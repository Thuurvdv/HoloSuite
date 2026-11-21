import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_ID, keepLinkedActor } from '../src/model.mjs';
import { Dnd5eAdapter, getAdapter } from '../src/adapters.mjs';
import { LootTransactions } from '../src/transactions.mjs';

function fixture({ quantity = 2, amount = 2, currency = false, manual = false } = {}) {
  const flags = {};
  const data = { name: 'Dagger', type: manual ? 'gear' : 'weapon', system: { quantity } };
  const itemFlags = {};
  const item = { id: 'dagger', ...structuredClone(data), toObject() { return { ...data, system: { ...this.system } }; },
    getFlag: (_m, key) => itemFlags[key], async update(change) {
      this.system.quantity = change['system.quantity']; itemFlags.sourceClaim = change[`flags.${MODULE_ID}.sourceClaim`];
    } };
  const source = { id: 'villain', uuid: 'Actor.villain', type: 'npc', statuses: new Set(['dead']),
    items: new Map([[item.id, item]]), system: { currency: { gp: quantity } },
    getFlag: (_m, key) => flags[key], async setFlag(_m, key, value) { flags[key] = structuredClone(value); },
    async unsetFlag(_m, key) { if (source.failRelease) throw Error('release failed'); delete flags[key]; },
    async deleteEmbeddedDocuments(_type, ids) { if (source.failDelete) throw Error('deletion failed'); ids.forEach(id => source.items.delete(id)); },
    async update(changes) {
      for (const [path, value] of Object.entries(changes)) {
        if (path === 'system.currency.gp') this.system.currency.gp = value;
        else if (path.startsWith(`flags.${MODULE_ID}.`)) {
          const [, , key, child] = path.split('.'); flags[key] ??= {};
          if (child.startsWith('-=')) delete flags[key][child.slice(2)]; else flags[key][child] = value;
        }
      }
    }
  };
  const adapter = manual ? getAdapter('unknown-linked-test') : new Dnd5eAdapter();
  const tokens = ['one', 'two'].map(id => ({ id, actorId: source.id, actor: source, actorLink: true,
    uuid: `Scene.scene.Token.${id}`, parent: { id: 'scene', active: true }, config: { mode: 'enabled', keepLinkedActor: true },
    getFlag(_m, key) { return key === 'config' ? this.config : undefined; },
    async update() { throw Error('linked token must not be updated'); }
  }));
  const user = { id: 'gm', isGM: true, active: true };
  const heroFlags = {};
  const hero = { id: 'hero', type: 'character', items: new Map(), system: { currency: { gp: 0 } },
    testUserPermission: () => true, getFlag: (_m, key) => heroFlags[key],
    async createEmbeddedDocuments(_type, [raw]) {
      if (hero.failCreate) throw Error('creation failed');
      const created = { id: raw._id, ...structuredClone(raw), getFlag: (m, key) => raw.flags[m]?.[key] };
      this.items.set(created.id, created); return [created];
    },
    async update(changes) {
      for (const [path, value] of Object.entries(changes)) {
        if (path === 'system.currency.gp') this.system.currency.gp = value;
        else {
          const [, , key, child] = path.split('.'); heroFlags[key] ??= {};
          if (child.startsWith('-=')) delete heroFlags[key][child.slice(2)]; else heroFlags[key][child] = value;
        }
      }
    }
  };
  const states = new Map(tokens.map(token => [token.uuid, { version: 1, entries: [{ id: 'entry', taken: false,
    ...(currency ? { currency: { storage: 'balance', unit: 'gp', amount }, data: { name: 'Gold', system: { quantity: amount } } }
      : { data: { ...structuredClone(data), system: { quantity: amount } }, source: { itemId: item.id, ruleKey: `${source.id}:${item.id}` },
        ...(manual ? { wholeItem: true } : {}) })
  }] }]));
  let serial = 0;
  const io = { moduleId: MODULE_ID, authority: () => true, environment: () => ({ manual, visible: () => true }), adapter: () => adapter,
    token: async uuid => tokens.find(token => token.uuid === uuid), actor: async () => hero, id: () => `id${++serial}`,
    load: async token => structuredClone(states.get(token.uuid)),
    save: async (token, state) => {
      if (io.failCommit && state.entries.some(e => e.taken)) throw Error('commit failed');
      states.set(token.uuid, structuredClone(state));
    }, summary: (_token, state) => ({ entries: state.entries.filter(e => !e.taken) }) };
  const request = (index = 0, action = 'take') => ({ action, tokenUuid: tokens[index].uuid, actorId: hero.id, entryId: 'entry' });
  return { source, hero, tokens, states, io, request, user, service: new LootTransactions(io) };
}

test('linked actor preference inherits the world default and explicit token values override it', () => {
  const original = globalThis.game;
  try {
    globalThis.game = { settings: { get: () => true } };
    assert.equal(keepLinkedActor({ getFlag: () => null }), true);
    assert.equal(keepLinkedActor({ getFlag: () => ({ keepLinkedActor: false }) }), false);
    globalThis.game.settings.get = () => false;
    assert.equal(keepLinkedActor({ getFlag: () => ({ keepLinkedActor: true }) }), true);
    assert.equal(keepLinkedActor({ getFlag: () => null }), false);
  } finally { globalThis.game = original; }
});

test('keeping the link deletes the world actor item and updates every linked token', async () => {
  const f = fixture();
  const result = await f.service.execute(f.request(), f.user);
  assert.deepEqual(result.failures, []);
  assert.equal(f.hero.items.size, 1); assert.equal(f.source.items.size, 0);
  assert.ok(f.tokens.every(token => token.actorLink && token.actor === f.source && !token.actor.items.has('dagger')));
  assert.equal(f.source.getFlag(MODULE_ID, 'linkedLootClaim'), undefined);
});

test('linked partial stacks recover failed commits without subtracting or granting twice', async () => {
  const f = fixture({ quantity: 5 }); f.io.failCommit = true;
  await f.service.execute(f.request(), f.user);
  assert.equal(f.source.items.get('dagger').system.quantity, 3);
  assert.equal((await f.service.execute(f.request(1), f.user)).failures[0].code, 'RecoveryRequired');
  assert.equal(f.hero.items.size, 1);
  f.io.failCommit = false;
  await new LootTransactions(f.io).execute(f.request(0, 'view'), f.user);
  assert.equal(f.source.items.get('dagger').system.quantity, 3); assert.equal(f.hero.items.size, 1);
  assert.equal(f.states.get(f.tokens[0].uuid).entries[0].taken, true);
});

test('two linked token pickups cannot duplicate the same world actor item', async () => {
  const f = fixture();
  await Promise.all([0, 1].map(i => f.service.execute(f.request(i), f.user)));
  assert.equal(f.hero.items.size, 1); assert.equal(f.source.items.size, 0);
});

test('failed linked deletion reserves the shared actor until its original transfer recovers', async () => {
  const f = fixture(); f.source.failDelete = true;
  await f.service.execute(f.request(), f.user);
  assert.equal((await f.service.execute(f.request(1), f.user)).failures[0].code, 'RecoveryRequired');
  assert.equal(f.hero.items.size, 1); assert.equal(f.source.items.size, 1);
  f.source.failDelete = false;
  // A changed preference cannot redirect a pending transfer into a synthetic actor.
  f.tokens[0].config.keepLinkedActor = false;
  await new LootTransactions(f.io).execute(f.request(0, 'view'), f.user);
  assert.equal(f.source.items.size, 0); assert.equal(f.tokens[0].actorLink, true);
});

test('failed destination creation leaves linked inventory intact and retries with the same claim', async () => {
  const f = fixture(); f.hero.failCreate = true;
  await f.service.execute(f.request(), f.user);
  assert.equal(f.source.items.size, 1); assert.equal(f.hero.items.size, 0); assert.equal(f.tokens[0].actorLink, true);
  f.hero.failCreate = false;
  await f.service.execute(f.request(), f.user);
  assert.equal(f.source.items.size, 0); assert.equal(f.hero.items.size, 1);
});

test('a pending linked transfer refuses an unlinked or replaced source actor', async () => {
  for (const change of [token => { token.actorLink = false; }, token => { token.actor = { ...token.actor, uuid: 'Actor.other' }; }]) {
    const f = fixture(); f.source.failDelete = true;
    await f.service.execute(f.request(), f.user); change(f.tokens[0]);
    await assert.rejects(new LootTransactions(f.io).execute(f.request(0, 'view'), f.user), { code: 'SourceChanged' });
    assert.equal(f.source.items.size, 1); assert.equal(f.hero.items.size, 1);
  }
});

test('a failed reservation cleanup is reconciled from the committed source ledger', async () => {
  const f = fixture({ quantity: 5 }); f.source.failRelease = true;
  await f.service.execute(f.request(), f.user);
  assert.equal(f.states.get(f.tokens[0].uuid).entries[0].taken, true);
  f.source.failRelease = false;
  await new LootTransactions(f.io).execute(f.request(1), f.user);
  assert.equal(f.source.items.get('dagger').system.quantity, 1); assert.equal(f.hero.items.size, 2);
});

test('linked currency debits the world actor and recovers without duplicate payment', async () => {
  const f = fixture({ currency: true, quantity: 5 }); f.io.failCommit = true;
  await f.service.execute(f.request(), f.user);
  assert.equal(f.source.system.currency.gp, 3); assert.equal(f.hero.system.currency.gp, 2);
  f.io.failCommit = false;
  await new LootTransactions(f.io).execute(f.request(0, 'view'), f.user);
  assert.equal(f.source.system.currency.gp, 3); assert.equal(f.hero.system.currency.gp, 2);
  assert.equal(f.tokens[0].actorLink, true);
});

test('manual whole-item loot honors the linked actor preference', async () => {
  const f = fixture({ manual: true });
  assert.deepEqual((await f.service.execute(f.request(), f.user)).failures, []);
  assert.equal(f.hero.items.size, 1); assert.equal(f.source.items.size, 0); assert.equal(f.tokens[0].actorLink, true);
});
