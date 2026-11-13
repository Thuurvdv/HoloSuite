import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { Dnd5eAdapter, getAdapter } from '../src/adapters.mjs';
const ID = 'holosuite-loot';

test('normal Foundry flags persist loot without Web Crypto and protect depletion from token edits', async () => {
  const compiled = await build({ stdin: { contents: `export {loadState,saveState} from './persistence';`,
    resolveDir: fileURLToPath(new URL('../src', import.meta.url)), loader: 'ts' }, bundle: true, write: false, format: 'esm', platform: 'browser' });
  const api = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
  const originals = { game: globalThis.game, foundry: globalThis.foundry, localStorage: globalThis.localStorage };
  const cryptoDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  Object.defineProperty(globalThis, 'crypto', { value: undefined, configurable: true });
  const journals = new Map(), storage = new Map(), settings = new Map(); let serial = 0;
  const user = { id: 'gm', isGM: true, active: true, flags: {},
    getFlag: (_m, key) => user.flags[key], setFlag: async (_m, key, value) => { user.flags[key] = value; } };
  const Journal = { create: async data => {
    const journal = { ...structuredClone(data), id: `vault${++serial}`, pages: { contents: data.pages ?? [] },
      getFlag(_m, key) { return this.flags[ID][key]; }, async setFlag(_m, key, value) { this.flags[ID][key] = structuredClone(value); },
      async update(changes) { for (const [path,value] of Object.entries(changes)) this.flags[ID][path.split(".").at(-1)] = structuredClone(value); },
      async delete() { journals.delete(this.id); } };
    journals.set(journal.id, journal); return journal;
  } };
  globalThis.foundry = { utils: { randomID: () => `entry${++serial}` }, documents: { JournalEntry: Journal } };
  globalThis.localStorage = { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) };
  globalThis.game = { user, world: { id: 'persistence-test' }, users: { contents: [user] },
    settings: { get: (_m, key) => structuredClone(settings.get(key)), set: async (_m, key, value) => { settings.set(key, structuredClone(value)); } },
    journal: { get: id => journals.get(id), find: fn => [...journals.values()].find(fn) } };
  const raw = { name: 'Shared Blade', type: 'weapon', system: { quantity: 7 } };
  const actor = { items: [{ ...raw, toObject: () => structuredClone(raw) }], getFlag: () => null };
  const token = id => ({ id, uuid: `Scene.scene.Token.${id}`, name: id, actor, flags: {},
    getFlag(_m, key) { return this.flags[key]; }, async setFlag(_m, key, value) { this.flags[key] = structuredClone(value); } });
  try {
    const adapter = new Dnd5eAdapter(), a = token('a'), b = token('b');
    const first = await api.loadState(a, adapter), second = await api.loadState(b, adapter);
    assert.notEqual(first.vaultId, second.vaultId); assert.equal(first.entries[0].data.system.quantity, 7);
    assert.equal(journals.get(first.vaultId).getFlag(ID, 'items')[0].data.name, 'Shared Blade');
    assert.equal(journals.get(first.vaultId).pages.contents.length, 0);
    first.entries[0].taken = true; await api.saveState(a, first);
    assert.equal((await api.loadState(a, adapter)).entries[0].taken, true);
    a.flags.state.entries[0].taken = false; // A token owner changes the public mirror.
    assert.equal((await api.loadState(a, adapter)).entries[0].taken, true);
    delete a.flags.state; // Deleting it must not reinitialize or regenerate loot.
    assert.equal((await api.loadState(a, adapter)).entries[0].taken, true);
    assert.equal((await api.loadState(b, adapter)).entries[0].taken, false);
    assert.equal(journals.size, 2); assert.equal(raw.system.quantity, 7);
    // Upgrade an existing depleted corpse once, without restoring its collected Item.
    actor.system = { currency: { gp: 8 } };
    const oldState = structuredClone(journals.get(first.vaultId).getFlag(ID, 'state'));
    delete oldState.currencyReady; await journals.get(first.vaultId).setFlag(ID, 'state', oldState);
    const upgraded = await api.loadState(a, adapter);
    assert.equal(upgraded.entries[0].taken, true); assert.equal(upgraded.entries[1].currency.amount, 8);
    actor.system.currency.gp = 99;
    assert.equal((await api.loadState(a, adapter)).entries[1].currency.amount, 8);
    upgraded.entries[1].taken = true; await api.saveState(a, upgraded);
    assert.ok((await api.loadState(a, adapter)).entries.every(entry => entry.taken));
    journals.delete(first.vaultId);
    await assert.rejects(api.loadState(a, adapter), { code: 'RecoveryRequired' });
  } finally { Object.assign(globalThis, originals); Object.defineProperty(globalThis, 'crypto', cryptoDescriptor); }
});

test('unsupported item payloads fail closed and depleted snapshots stay depleted', async () => {
  const compiled = await build({ entryPoints: [fileURLToPath(new URL('../src/persistence.ts', import.meta.url))], bundle: true, write: false, format: 'esm', platform: 'browser' });
  const api = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
  const originalGame = globalThis.game;
  const token = { uuid: 'Scene.scene.Token.legacy', getFlag: () => stored, setFlag: async () => {} };
  const stored = { version: 1, vaultId: 'legacy', entries: [{ id: 'taken', taken: true }, { id: 'left', taken: false }] };
  const flags = { tokenUuid: token.uuid, kind: 'snapshot', state: stored };
  const record = { getFlag: (_m, name) => flags[name] };
  globalThis.game = { journal: { find: () => record, get: () => record } };
  try {
    await assert.rejects(api.loadState(token, {}), { code: 'RecoveryRequired' });
    assert.equal(stored.entries[0].taken, true);
    stored.entries[1].taken = true;
    assert.ok((await api.loadState(token, {})).entries.every(entry => entry.taken && entry.data === null));
  } finally { globalThis.game = originalGame; }
});

test('SWADE filters legacy ability entries while preserving gear and pending claim recovery', async () => {
  const compiled = await build({ entryPoints: [fileURLToPath(new URL('../src/persistence.ts', import.meta.url))], bundle: true, write: false, format: 'esm', platform: 'browser' });
  const api = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
  const originalGame = globalThis.game;
  const adapter = getAdapter('swade');
  const gear = { type: 'gear', name: 'Rope', system: { quantity: 2, equipStatus: 3 }, flags: { swade: { hasGranted: ['old'] } } };
  const ability = { type: 'ability', name: 'Fear', system: { quantity: 1 } };
  const items = new Map([['rope', { ...gear, id: 'rope', toObject: () => gear }]]);
  items.filter = predicate => [...items.values()].filter(predicate);
  let mirror = { currencyReady: true };
  const token = { uuid: 'Scene.scene.Token.legacy', actorId: 'npc',
    actor: { items, system: { details: { currency: 8.5 } } }, getFlag: key => key === ID ? mirror : null,
    async setFlag(_module, _key, value) { mirror = structuredClone(value); } };
  const source = { itemId: 'rope', ruleKey: 'npc:rope' };
  const claim = { id: 'claim', source: { itemId: 'pending' } };
  const stored = { version: 1, vaultId: 'legacy', currencyReady: true, entries: [
    { id: 'rope', taken: false }, { id: 'fear', taken: false }, { id: 'pending', taken: false, claim }
  ] };
  const flags = { tokenUuid: token.uuid, kind: 'snapshot', state: stored, items: [
    { id: 'rope', data: gear, source, wholeItem: true },
    { id: 'fear', data: ability, wholeItem: true },
    { id: 'pending', data: ability, wholeItem: true }
  ] };
  const record = { getFlag: (_m, name) => flags[name], async update(changes) {
    for (const [path, value] of Object.entries(changes)) flags[path.split('.').at(-1)] = structuredClone(value);
  } };
  const originalFoundry = globalThis.foundry;
  globalThis.foundry = { utils: { randomID: () => 'cash' } };
  const gm = { id: 'gm', active: true, isGM: true, getFlag: () => '1.2.0' };
  globalThis.game = { user: gm, users: { contents: [gm] }, journal: { find: () => record, get: () => record },
    settings: { get: module => module === 'swade' ? 'Credits' : {} } };
  try {
    const state = await api.loadState(token, adapter);
    assert.deepEqual(state.entries.map(entry => entry.id), ['rope', 'pending', 'cash']);
    assert.equal(state.entries[2].currency.amount, 8.5);
    assert.equal(state.entries[2].data.name, 'Credits');
    assert.equal(mirror.currencyReady, 2);
    assert.equal((await api.loadState(token, adapter)).entries.filter(entry => entry.currency).length, 1);
    token.actor.system.details.currency = 10;
    const balanceRow = () => api.ruleRows(token, adapter).find(row => row.id === 'currency:swade');
    assert.equal(balanceRow().entry.currency.amount, 8.5);
    globalThis.foundry.utils.randomID = () => 'cash-capped';
    await api.editRules(token, adapter, 'token', ['currency:swade'], { mode: 'quantity', quantity: '3' });
    assert.equal(balanceRow().entry.currency.amount, 3);
    assert.equal((await api.loadState(token, adapter)).entries.find(entry => entry.currency).currency.amount, 3);
    globalThis.foundry.utils.randomID = () => 'cash-hidden';
    await api.editRules(token, adapter, 'token', ['currency:swade'], { mode: 'never' });
    assert.equal(balanceRow().entry.hidden, true);
    assert.equal(balanceRow().canToken, true);
    flags.state.entries.find(entry => entry.id === 'cash-hidden').taken = true;
    assert.equal(balanceRow().canToken, false);
    assert.equal(state.entries[1].hidden, true);
    assert.deepEqual(state.entries[1].claim, claim);
    assert.deepEqual(await adapter.sourceClaim(token, state.entries[0]), { itemId: 'rope' });
    assert.equal(adapter.snapshot(items.get('rope')).system.equipStatus, 1);
    assert.equal(adapter.snapshot(items.get('rope')).flags.swade.hasGranted, undefined);
    assert.equal(adapter.eligible({ type: 'armor', system: { quantity: 1, isNaturalArmor: true } }), false);
    assert.equal(adapter.eligible({ ...gear, grantedBy: ability }), false);
    assert.equal(adapter.eligible(ability), false);
  } finally { globalThis.game = originalGame; globalThis.foundry = originalFoundry; }
});
