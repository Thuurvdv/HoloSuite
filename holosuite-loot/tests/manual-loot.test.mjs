import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { BUILD_VERSION, MODULE_ID, eligible } from '../src/model.mjs';
import { getAdapter } from '../src/adapters.mjs';
import { LootTransactions } from '../src/transactions.mjs';

test('manual loot only transfers GM-selected whole items and recovers a failed source deletion once', async () => {
  const compiled = await build({ entryPoints: [fileURLToPath(new URL('../src/persistence.ts', import.meta.url))],
    bundle: true, write: false, format: 'esm', platform: 'browser' });
  const { loadState, saveState, saveManualLoot, manualLootRows } = await import(
    `data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
  const previous = { game: globalThis.game, foundry: globalThis.foundry };
  class Items extends Map {
    filter(fn) { return [...this.values()].filter(fn); }
    some(fn) { return [...this.values()].some(fn); }
  }
  const makeItem = data => ({ ...data, id: data._id, toObject: () => structuredClone(data),
    getFlag: (module, key) => data.flags?.[module]?.[key] });
  const gear = { _id: 'gear', type: 'component', name: 'Tool', system: { charges: { value: 3 }, amount: 'a bundle' } };
  const skill = { _id: 'skill', type: 'ability', name: 'Skill', system: {} };
  const source = { id: 'source', type: 'adversary', items: new Items([[gear._id, makeItem(gear)], [skill._id, makeItem(skill)]]),
    getFlag: () => null, async deleteEmbeddedDocuments() { throw Error('injected deletion failure'); } };
  const token = { id: 'corpse', actorId: source.id, actor: source, uuid: 'Scene.scene.Token.corpse',
    parent: { id: 'scene', active: true }, flags: {}, getFlag(_module, key) { return this.flags[key]; },
    async setFlag(_module, key, value) { this.flags[key] = structuredClone(value); } };
  const players = ['one', 'two'].map(id => ({ id, active: true, viewedScene: 'scene' }));
  const heroes = players.map(user => ({
    id: user.id, type: 'agent', items: new Items(), testUserPermission: candidate => candidate.id === user.id,
    async createEmbeddedDocuments(kind, [data], options) {
      assert.equal(kind, 'Item'); assert.equal(options.keepId, true);
      const created = makeItem(data);
      this.items.set(created.id, created);
      return [created];
    }
  }));
  const gm = { id: 'gm', active: true, isGM: true, getFlag: () => BUILD_VERSION };
  const journals = new Map();
  let serial = 0;
  globalThis.game = { user: gm, users: { contents: [gm, ...players] }, actors: new Map(), settings: { get: () => null },
    journal: { find: fn => [...journals.values()].find(fn), get: id => journals.get(id) } };
  globalThis.foundry = { utils: { randomID: () => `id${++serial}` }, documents: { JournalEntry: { async create(data) {
    const flags = structuredClone(data.flags[MODULE_ID]);
    const vault = { id: `journal${++serial}`, getFlag: (_module, key) => flags[key],
      async setFlag(_module, key, value) { flags[key] = structuredClone(value); },
      async update(changes) { for (const [path, value] of Object.entries(changes)) flags[path.split('.').at(-1)] = structuredClone(value); } };
    journals.set(vault.id, vault);
    return vault;
  } } } };

  try {
    const adapter = getAdapter('unrecognized-system');
    const env = { manual: true, visible: () => true };
    assert.equal(adapter.manual, true);
    assert.equal(getAdapter('dnd5e').manual, false);
    assert.equal(eligible(token, env), false);
    const service = new LootTransactions({ moduleId: MODULE_ID, authority: () => true, environment: () => env,
      adapter: () => adapter, token: () => token, actor: id => heroes.find(actor => actor.id === id),
      id: foundry.utils.randomID, load: loadState, save: saveState,
      summary: (_token, state) => ({ entries: state.entries.filter(entry => !entry.taken) }) });
    const save = (mode, ids) => service.queue.run(token.uuid, () => saveManualLoot(token, adapter, mode, ids));
    const request = (user, action = 'view') => service.execute({ action, tokenUuid: token.uuid, actorId: user.id }, user);

    await save('enabled', ['gear']);
    assert.deepEqual(manualLootRows(token, adapter).map(row => [row.id, row.selected]), [['gear', true], ['skill', false]]);
    assert.deepEqual((await request(players[0])).entries.map(entry => entry.data.name), ['Tool']);
    assert.equal((await request(players[0], 'all')).failures.length, 1);
    assert.equal(heroes[0].items.size, 1);
    source.deleteEmbeddedDocuments = async (_kind, ids) => ids.forEach(id => source.items.delete(id));
    await request(players[1], 'all');
    assert.deepEqual([...heroes[0].items.values()][0].system, gear.system);
    assert.equal(heroes[0].items.size, 1);
    assert.equal(heroes[1].items.size, 0);
    assert.deepEqual([...source.items.keys()], ['skill']);

    await save('disabled', ['skill']);
    token.flags.config.mode = 'enabled';
    await assert.rejects(request(players[0]), { code: 'Unavailable' });
    game.user = players[0];
    await assert.rejects(save('enabled', ['skill']), { code: 'RuleGM' });
  } finally { Object.assign(globalThis, previous); }
});
