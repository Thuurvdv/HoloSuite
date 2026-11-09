import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { Dnd5eAdapter } from '../src/adapters.mjs';
import { BUILD_VERSION, MODULE_ID } from '../src/model.mjs';
import { globalItemKey, parseRule, resolveQuantity } from '../src/rules.mjs';
import { LootTransactions } from '../src/transactions.mjs';

test('quantity rules normalize safe formulas and clamp fixed and rolled quantities', async () => {
  assert.deepEqual(parseRule('quantity', ' d6 + 1 '), { mode: 'quantity', quantity: '1d6+1' });
  assert.equal(await resolveQuantity(parseRule('quantity', '30'), 2), 2);
  assert.equal(await resolveQuantity(parseRule('quantity', '1d6'), 3, async () => 6), 3);
  assert.equal(await resolveQuantity(parseRule('quantity', '1d6-10'), 300, async () => -4), 0);
  for (const invalid of ['-1', '2.5', '0d6', '9999d6', '1d0', '@attributes.hp', '1d6x=6']) {
    assert.throws(() => parseRule('quantity', invalid), { code: 'InvalidRule' });
  }
});

test('global rules use standalone source UUIDs, including legacy compendium forms', () => {
  assert.equal(globalItemKey({ _stats: { compendiumSource: 'Compendium.game.gear.Item.rounds' } }), 'Compendium.game.gear.Item.rounds');
  assert.equal(globalItemKey({ flags: { core: { sourceId: 'Compendium.game.gear.rounds' } } }), 'Compendium.game.gear.Item.rounds');
  assert.equal(globalItemKey({ _stats: { duplicateSource: 'Item.rounds' } }), 'Item.rounds');
  assert.equal(globalItemKey({ name: 'Rounds', _stats: { duplicateSource: 'Actor.pirate.Item.rounds' } }), undefined);
  assert.equal(globalItemKey({ name: 'Rounds' }), undefined);
});

test('scoped bulk rules persist rolls and protect configured loot through collection', async () => {
  const compiled = await build({ entryPoints: [fileURLToPath(new URL('../src/persistence.ts', import.meta.url))],
    bundle: true, write: false, format: 'esm', platform: 'browser' });
  const { loadState, saveState, editRules, ruleRows, refreshInventory, rollLootQuantity, summary } = await import(
    `data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
  const originals = { game: globalThis.game, foundry: globalThis.foundry, DOMParser: globalThis.DOMParser };
  class Items extends Map { filter(fn) { return Array.from(this.values()).filter(fn); } }
  const item = (id, name, quantity, source) => {
    const raw = { name, type: 'loot', img: 'item.webp', system: { quantity } };
    return { ...raw, id, _stats: { compendiumSource: source }, flags: {},
      toObject() { return structuredClone({ ...raw, system: this.system }); },
      getFlag(_module, key) { return this.flags[key]; },
      async update(change) { this.system.quantity = change['system.quantity']; this.flags.sourceClaim = change[`flags.${MODULE_ID}.sourceClaim`]; } };
  };
  const npc = (id, items) => ({
    id, type: 'npc', items: new Items(items.map(entry => [entry.id, entry])), getFlag: () => ({ mode: 'enabled' }),
    async deleteEmbeddedDocuments(_kind, ids) { ids.forEach(id => this.items.delete(id)); }
  });
  const cloneNpc = actor => npc(actor.id, [...actor.items.values()].map(i => item(i.id, i.name, i.system.quantity, i._stats.compendiumSource)));
  const base = npc('pirate', [
    item('ammo', 'Rounds', 300, 'Compendium.game.gear.Item.ammo'),
    item('med', 'Medkit', 20, 'Compendium.game.gear.Item.med'),
    item('quest', 'Quest item', 1),
    item('tool', 'Tool', 1)
  ]);
  const other = npc('other', [
    item('ammo-copy', 'Renamed ammo', 7, 'Compendium.game.gear.Item.ammo'),
    item('name-copy', 'Rounds', 11)
  ]);
  const scene = { id: 'scene', active: true };
  const token = (id, actor, linked = false) => ({
    id, actorId: actor.id, actor: linked ? actor : cloneNpc(actor), actorLink: linked,
    uuid: `Scene.scene.Token.${id}`, parent: scene, name: id, texture: { src: '' }, flags: {},
    getFlag(_module, key) { return this.flags[key]; },
    async setFlag(_module, key, value) { this.flags[key] = structuredClone(value); },
    async update(change) { this.actorLink = change.actorLink; this.actor = cloneNpc(actor); }
  });
  const gm = { id: 'gm', isGM: true, active: true, getFlag: () => BUILD_VERSION };
  const players = ['one', 'two'].map(id => ({ id, active: true, viewedScene: scene.id }));
  const destinations = new Map(players.map(user => [user.id, {
    id: user.id, name: user.id, type: 'character', items: new Map(), testUserPermission: owner => owner.id === user.id,
    async createEmbeddedDocuments(_kind, [data]) {
      const created = { ...data, id: data._id, getFlag: (module, key) => data.flags[module]?.[key] };
      this.items.set(created.id, created);
      return [created];
    }
  }]));
  const journals = new Map(), settings = new Map();
  let serial = 0, rolls = 0;
  globalThis.game = { user: gm, users: { contents: [gm, ...players] }, actors: new Map([[base.id, base], [other.id, other]]),
    settings: { get: (_module, key) => structuredClone(settings.get(key)), set: async (_module, key, value) => settings.set(key, structuredClone(value)) },
    journal: { get: id => journals.get(id), find: predicate => [...journals.values()].find(predicate) },
    i18n: { localize: key => key }
  };
  globalThis.DOMParser = class { parseFromString() { return { body: { textContent: '' } }; } };
  globalThis.foundry = { utils: { randomID: () => `id${++serial}` },
    dice: { Roll: class {
      constructor(formula) { this.formula = formula; }
      async evaluate(options) {
        assert.equal(options.allowInteractive, false);
        const totals = { '1d6': 4, '2d6+2': 9, '1d6-10': -6 };
        assert.ok(this.formula in totals);
        rolls++; this.total = totals[this.formula]; return this;
      }
      toJSON() { return { formula: this.formula, total: this.total }; }
    } },
    documents: { JournalEntry: { async create(data) {
      const record = {
        id: `vault${++serial}`, flags: structuredClone(data.flags[MODULE_ID]),
        getFlag(_module, key) { return this.flags[key]; },
        async setFlag(_module, key, value) { this.flags[key] = structuredClone(value); },
        async update(change) { for (const [key, value] of Object.entries(change)) this.flags[key.split('.').at(-1)] = structuredClone(value); }
      };
      journals.set(record.id, record);
      return record;
    } } }
  };
  try {
    const adapter = new Dnd5eAdapter(), linked = token('linked', base, true), unlinked = token('unlinked', base);
    const unrelated = token('unrelated', other);
    const original = token('original', base);
    const pickupRolls = [];
    const service = new LootTransactions({ moduleId: MODULE_ID, authority: () => true, environment: () => ({ visible: () => true }),
      adapter: () => adapter, token: uuid => [linked, unlinked, unrelated, original].find(doc => doc.uuid === uuid),
      actor: id => destinations.get(id), id: foundry.utils.randomID, load: loadState, save: saveState, summary,
      rollQuantity: rollLootQuantity, quantityRolled: entry => pickupRolls.push(entry.claim.quantityRoll) });
    const edit = (doc, scope, ids, mode, quantity) => service.queue.run(doc.uuid,
      () => editRules(doc, adapter, scope, ids, parseRule(mode, quantity)));
    const request = (doc, user, action = 'view', entryId) => service.execute({ action, tokenUuid: doc.uuid, actorId: user.id, entryId }, user);
    const view = async doc => Object.fromEntries((await request(doc, players[0])).entries.map(e => [e.name, e.quantity]));

    assert.deepEqual(await view(original), { Rounds: 300, Medkit: 20, 'Quest item': 1, Tool: 1 });
    await edit(linked, 'global', ['ammo', 'med'], 'never');
    await edit(linked, 'actor', ['ammo'], 'quantity', '1d6');
    await edit(linked, 'actor', ['med'], 'quantity', '200');
    await edit(linked, 'token', ['quest', 'tool'], 'never');
    await edit(linked, 'token', ['med'], 'allow');
    assert.equal(linked.flags.state, undefined); // A rule draft does not generate the corpse.
    assert.deepEqual(await view(linked), { Rounds: 300, Medkit: 20 });
    assert.equal(linked.actor.items.get('ammo').system.quantity, 300);
    assert.equal(rolls, 0);
    assert.equal((await request(linked, players[0])).entries[0].formula, '1d6');
    await edit(linked, 'token', ['ammo'], 'quantity', '1d6');
    assert.equal(rolls, 0);

    assert.deepEqual(await view(unlinked), { Rounds: 300, Medkit: 20, 'Quest item': 1, Tool: 1 });
    const toolId = (await request(unlinked, players[0])).entries.find(e => e.name === 'Tool').id;
    await edit(unlinked, 'token', ['tool'], 'never');
    assert.equal((await view(unlinked)).Tool, undefined);
    await request(unlinked, players[0], 'take', toolId);
    assert.equal(unlinked.actor.items.get('tool').system.quantity, 1);
    await edit(unlinked, 'token', ['tool'], 'inherit');
    assert.equal((await view(unlinked)).Tool, 1);
    assert.deepEqual(await view(unrelated), { Rounds: 11 });
    assert.equal(rolls, 0);
    await edit(linked, 'actor', ['med'], 'quantity', '2');
    assert.equal((await view(unlinked)).Medkit, 20); // Existing actor/global manifests stay frozen.
    assert.equal((await loadState(token('future', base), adapter)).entries.find(e => e.data.name === 'Medkit').data.system.quantity, 2);
    const unlinkedAmmo = (await request(unlinked, players[0])).entries.find(e => e.name === 'Rounds').id;
    unlinked.actor.items.get('ammo').system.quantity = 3;
    assert.equal((await request(unlinked, players[0], 'take', unlinkedAmmo)).failures[0].code, 'SourceChanged');
    assert.equal((await view(unlinked)).Rounds, 300);
    const oldMedId = (await request(linked, players[0])).entries.find(e => e.name === 'Medkit').id;
    await edit(linked, 'token', ['med'], 'inherit');
    assert.deepEqual(await view(linked), { Rounds: 300, Medkit: 2 });
    await request(linked, players[0], 'take', oldMedId);
    assert.equal(destinations.get(players[0].id).items.size, 0);
    const hiddenId = (await loadState(linked, adapter)).entries.find(e => e.hidden).id;
    await assert.rejects(request(linked, players[0], 'inspect', hiddenId), { code: 'Unavailable' });
    await assert.rejects(request(linked, players[0], 'take', {}), { code: 'InvalidRequest' });

    await Promise.all(players.map(player => request(linked, player, 'all')));
    const granted = [...destinations.values()].flatMap(actor => [...actor.items.values()]);
    assert.deepEqual(granted.map(entry => [entry.name, entry.system.quantity]), [['Rounds', 4], ['Medkit', 2]]);
    assert.equal(linked.actorLink, false);
    assert.equal(linked.actor.items.has('ammo'), false);
    assert.equal(rolls, 1);
    assert.equal(linked.actor.items.get('quest').system.quantity, 1);
    assert.equal(base.items.get('ammo').system.quantity, 300);
    assert.deepEqual(await view(linked), {});
    assert.equal(ruleRows(linked, adapter).find(e => e.id === 'med').canToken, false);
    await assert.rejects(edit(linked, 'token', ['med'], 'allow'), { code: 'RuleScopeUnavailable' });

    const oldSnapshot = journals.get(original.flags.state.vaultId);
    const oldAmmo = oldSnapshot.flags.items.find(entry => entry.source?.itemId === 'ammo');
    delete oldAmmo.source;
    delete oldAmmo.originalQuantity;
    delete oldAmmo.limit;
    const duplicate = { ...oldAmmo, id: 'duplicate-stack' };
    oldSnapshot.flags.items.push(duplicate);
    oldSnapshot.flags.state.entries.push({ id: duplicate.id, taken: true });
    assert.equal(ruleRows(original, adapter).find(e => e.id === 'ammo').canToken, false);
    await assert.rejects(edit(original, 'token', ['ammo'], 'quantity', '2'), { code: 'RuleScopeUnavailable' });
    oldSnapshot.flags.items.pop();
    oldSnapshot.flags.state.entries.pop();
    assert.equal(ruleRows(original, adapter).find(e => e.id === 'ammo').canToken, true);
    await edit(original, 'token', ['ammo'], 'quantity', '2');
    assert.equal((await view(original)).Rounds, 2);

    const refresh = doc => service.queue.run(doc.uuid, () => refreshInventory(doc, adapter));
    const priorRolls = rolls;
    await refresh(linked);
    assert.deepEqual(await view(linked), { Medkit: 2 });
    assert.equal(linked.actor.items.get('med').system.quantity, 18);
    assert.equal(rolls, priorRolls);
    assert.equal((await loadState(linked, adapter)).entries.filter(entry => entry.taken).length, 2);

    const stock = original.actor.items;
    stock.get('med').system.quantity = 1;
    await refresh(original);
    const before = (await request(original, players[0])).entries.find(entry => entry.name === 'Medkit');
    stock.get('med').system.quantity = 9;
    stock.delete('tool');
    stock.set('new', item('new', 'New stack', 3));
    original.actor.system = { currency: { gp: 5 } };
    await refresh(original);
    const after = (await request(original, players[0])).entries.find(entry => entry.name === 'Medkit');
    assert.notEqual(after.id, before.id);
    assert.equal(after.quantity, 9);
    assert.equal((await view(original)).Tool, undefined);
    assert.equal((await view(original))['New stack'], 3);
    assert.equal((await request(original, players[0])).entries.find(entry => entry.currency).quantity, 5);
    await request(original, players[0], 'take', before.id);
    assert.equal(stock.get('med').system.quantity, 9);
    await Promise.all([request(original, players[0], 'take', after.id), refresh(original)]);
    assert.equal((await view(original)).Medkit, undefined);
    stock.set('med', item('med', 'Medkit', 7));
    await refresh(original);
    const restocked = (await request(original, players[0])).entries.find(entry => entry.name === 'Medkit');
    assert.notEqual(restocked.id, after.id);
    assert.equal(restocked.quantity, 7);

    stock.set('grenade', item('grenade', 'Grenade', 1));
    stock.set('empty', item('empty', 'Empty stack', 1));
    await refresh(original);
    assert.deepEqual(await edit(original, 'token', ['grenade'], 'quantity', '2d6+2'), []);
    await edit(original, 'token', ['empty'], 'quantity', '1d6-10');
    await refresh(original);
    const [grenade, empty] = (await request(original, players[0])).entries.filter(entry => ['Grenade','Empty stack'].includes(entry.name));
    assert.equal(grenade.formula, '2d6+2');
    assert.equal(rolls, priorRolls);
    const remove = original.actor.deleteEmbeddedDocuments;
    original.actor.deleteEmbeddedDocuments = async () => { throw Error('injected source deletion failure'); };
    assert.equal((await request(original, players[0], 'take', grenade.id)).failures.length, 1);
    assert.equal(original.flags.state.entries.find(entry => entry.id === grenade.id).claim.quantityRoll, undefined);
    original.actor.deleteEmbeddedDocuments = remove;
    await request(original, players[1], 'take', grenade.id);
    assert.equal(stock.has('grenade'), false);
    assert.equal(rolls, priorRolls + 1);
    assert.deepEqual([...destinations.get(players[0].id).items.values()].filter(entry => entry.name === 'Grenade')
      .map(entry => entry.system.quantity), [9]);
    assert.equal([...destinations.get(players[1].id).items.values()].some(entry => entry.name === 'Grenade'), false);
    assert.deepEqual(pickupRolls.at(-1), { quantity: 9, roll: { formula: '2d6+2', total: 9 } });
    await request(original, players[0], 'take', empty.id);
    assert.equal(stock.has('empty'), false);
    assert.equal([...destinations.get(players[0].id).items.values()].some(entry => entry.name === 'Empty stack'), false);
    assert.equal(pickupRolls.at(-1).quantity, 0);

    const pending = await loadState(original, adapter);
    const quest = pending.entries.find(entry => entry.source?.itemId === 'quest');
    quest.claim = { id: 'pending', actorId: players[0].id, source: { itemId: 'quest', before: 1, after: 0 } };
    await saveState(original, pending);
    stock.get('quest').system.quantity = 2;
    await refresh(original);
    const afterPending = (await loadState(original, adapter)).entries.filter(entry => entry.source?.itemId === 'quest');
    assert.equal(afterPending.length, 1);
    assert.equal(afterPending[0].id, quest.id);
    assert.deepEqual(afterPending[0].claim, quest.claim);
    assert.equal(afterPending[0].data.system.quantity, 1);

    original.actorLink = true;
    await assert.rejects(refresh(original), { code: 'RefreshUntracked' });
    original.actorLink = false;
    game.user = players[0];
    await assert.rejects(edit(linked, 'actor', ['ammo'], 'allow'), { code: 'RuleGM' });
    await assert.rejects(refresh(original), { code: 'RuleGM' });
  } finally {
    Object.assign(globalThis, originals);
  }
});
