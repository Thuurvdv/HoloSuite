import test from 'node:test';
import assert from 'node:assert/strict';
import { Dnd5eAdapter, Sf2eAdapter, getAdapter } from '../src/adapters.mjs';
import { LootTransactions } from '../src/transactions.mjs';
import { MODULE_ID } from '../src/model.mjs';

function actor(id, gp = 0) {
  const document = { id, uuid: `Actor.${id}`, type: 'character', flags: {}, items: new Map(),
    system: { currency: { cp: 0, sp: 0, ep: 0, gp, pp: 0 } }, updates: 0,
    testUserPermission: user => user.id === 'p1' || user.id === 'p2',
    getFlag(_module, key) { return this.flags[key]; },
    async update(changes) {
      this.updates++;
      if (this.failBefore === this.updates) throw Error('before write');
      for (const [path, value] of Object.entries(changes)) {
        const keys = path.startsWith('flags.') ? path.split('.').slice(2) : path.split('.');
        let root = path.startsWith('flags.') ? this.flags : this;
        for (const key of keys.slice(0, -1)) root = root[key] ??= {};
        const key = keys.at(-1);
        if (key.startsWith('-=')) delete root[key.slice(2)]; else root[key] = structuredClone(value);
      }
      if (this.failAfter === this.updates) throw Error('lost response after write');
      return this;
    }
  };
  return document;
}
function fixture(gp = 12, destination = actor('hero', 3), id = 'corpse') {
  const source = actor(`source-${id}`, gp); source.type = 'npc'; source.statuses = new Set(['dead']);
  const token = { id, uuid: `Scene.scene.Token.${id}`, actor: source, actorLink: false,
    parent: { id: 'scene', active: true }, getFlag: () => null };
  const adapter = new Dnd5eAdapter();
  let state = { version: 1, currencyReady: true, entries: adapter.currencyEntries(source).map((entry, index) => ({ ...entry, id: `money${index}`, taken: false })) };
  let ids = 0, saves = 0;
  const io = { moduleId: MODULE_ID, authority: () => true, adapter: () => adapter,
    environment: () => ({ visible: () => true }), token: async () => token,
    actor: async () => destination, id: () => `claim${id}${++ids}`,
    load: async () => structuredClone(state), save: async (_token, next) => {
      if (++saves === io.failSave) throw Error('ledger write failed'); state = structuredClone(next);
    }, summary: (_token, data) => ({ entries: data.entries.filter(e => !e.taken) }) };
  const service = new LootTransactions(io), user = { id: 'p1', active: true, viewedScene: 'scene' };
  const request = (action = 'take') => ({ action, actorId: destination.id, tokenUuid: token.uuid, entryId: 'money0' });
  return { source, destination, token, service, io, user, request, state: () => structuredClone(state) };
}

test('D&D5e currency uses native denomination balances and creates no fake inventory Items', async () => {
  const f = fixture();
  const result = await f.service.execute(f.request(), f.user);
  assert.equal(result.entries.length, 0);
  assert.equal(f.destination.system.currency.gp, 15); assert.equal(f.source.system.currency.gp, 0);
  assert.equal(f.destination.items.size, 0); assert.deepEqual(f.destination.flags.currencyReceipts, {});
});
test('Loot All transfers each denomination exactly once and preserves existing balances', async () => {
  const f = fixture();
  const load = f.io.load;
  f.source.system.currency.sp = 7;
  f.io.load = async () => { const data = await load(); if (!data.entries.some(e => e.id === 'silver')) data.entries.push({
    ...new Dnd5eAdapter().currencyEntries(f.source).find(e => e.currency.unit === 'sp'), id: 'silver', taken: false }); return data; };
  await f.service.execute(f.request('all'), f.user);
  assert.equal(f.destination.system.currency.gp, 15); assert.equal(f.destination.system.currency.sp, 7);
  assert.equal(f.source.system.currency.sp, 0);
  await f.service.execute(f.request('all'), f.user); assert.equal(f.destination.system.currency.sp, 7);
});
test('two players racing for the same coins receive only one payment', async () => {
  const f = fixture();
  await Promise.all([f.service.execute(f.request(), f.user), f.service.execute(f.request(), { ...f.user, id: 'p2' })]);
  assert.equal(f.destination.system.currency.gp, 15); assert.equal(f.source.system.currency.gp, 0);
});
test('different corpses paying the same Actor cannot overwrite each other', async () => {
  const hero = actor('shared', 10), a = fixture(5, hero, 'a'), b = fixture(7, hero, 'b');
  await Promise.all([a.service.execute(a.request(), a.user), b.service.execute(b.request(), b.user)]);
  assert.equal(hero.system.currency.gp, 22);
});
test('failed reservation cannot alter either currency balance', async () => {
  const f = fixture(); f.io.failSave = 1;
  const result = await f.service.execute(f.request(), f.user);
  assert.equal(result.failures.length, 1); assert.equal(f.destination.system.currency.gp, 3); assert.equal(f.source.system.currency.gp, 12);
});
test('failed commit recovers from Actor receipts without paying or subtracting twice', async () => {
  const f = fixture(); f.io.failSave = 3;
  assert.equal((await f.service.execute(f.request(), f.user)).failures.length, 1);
  await new LootTransactions(f.io).execute(f.request('view'), f.user);
  assert.equal(f.destination.system.currency.gp, 15); assert.equal(f.source.system.currency.gp, 0); assert.equal(f.state().entries[0].taken, true);
});
test('an ambiguous source write recovers from its debit receipt', async () => {
  const f = fixture(); f.source.failAfter = 1;
  await f.service.execute(f.request(), f.user); await f.service.execute(f.request('view'), f.user);
  assert.equal(f.destination.system.currency.gp, 15); assert.equal(f.source.system.currency.gp, 0);
});
test('an ambiguous destination write recovers from its payment receipt', async () => {
  const f = fixture(); f.destination.failAfter = 1;
  await f.service.execute(f.request(), f.user); await f.service.execute(f.request('view'), f.user);
  assert.equal(f.destination.system.currency.gp, 15); assert.equal(f.source.system.currency.gp, 0);
});
test('attempted payment without a receipt fails closed rather than guessing and paying twice', async () => {
  const f = fixture(); f.destination.failBefore = 1;
  await f.service.execute(f.request(), f.user);
  const retry = await f.service.execute(f.request(), f.user);
  assert.equal(retry.failures[0].code, 'RecoveryRequired'); assert.equal(f.source.system.currency.gp, 12); assert.equal(f.destination.system.currency.gp, 3);
});
test('hidden sources and unauthorized destinations never grant money', async () => {
  const f = fixture(); f.token.hidden = true;
  await assert.rejects(f.service.execute(f.request(), f.user), { code: 'AccessDenied' });
  f.token.hidden = false; f.destination.testUserPermission = () => false;
  await assert.rejects(f.service.execute(f.request(), f.user), { code: 'ActorDenied' });
  assert.equal(f.destination.updates, 0); assert.equal(f.source.updates, 0);
});
test('SF2e uses physical currency Items, excludes NPC attacks, and preserves native credstick price', () => {
  const adapter = getAdapter('sf2e'); assert.ok(adapter instanceof Sf2eAdapter);
  const raw = { name: 'Credstick', type: 'treasure', system: { quantity: 1, category: 'credstick', price: { value: { sp: 150 } }, containerId: 'bag', equipped: { carryType: 'held' } } };
  const item = { ...raw, id: 'stick', isCurrency: true, unit: 'credits', assetValue: { credits: 150 }, isOfType: type => type === 'physical', toObject: () => structuredClone(raw) };
  assert.ok(adapter.eligible(item)); assert.equal(adapter.eligible({ type: 'melee', system: { quantity: 1 } }), false);
  assert.deepEqual(adapter.entryMetadata(item).currency, { storage: 'item', unit: 'credits', amount: 150 });
  const copy = adapter.snapshot(item); assert.equal(copy.system.price.value.sp, 150); assert.equal(copy.system.containerId, null);
  assert.equal(copy.system.equipped.carryType, 'stowed'); assert.deepEqual(adapter.currencyEntries({}), []);
});
test('SF2e refuses a credstick whose value changed after its loot snapshot', async () => {
  const adapter = new Sf2eAdapter();
  const item = { id: 'stick', type: 'treasure', system: { quantity: 1 }, isCurrency: true, unit: 'credits', assetValue: { credits: 90 } };
  const token = { actorLink: false, actor: { items: new Map([['stick', item]]) } };
  const entry = { source: { itemId: 'stick' }, currency: { storage: 'item', unit: 'credits', amount: 100 }, data: { system: { quantity: 1 } } };
  await assert.rejects(adapter.sourceClaim(token, entry), { code: 'CurrencyChanged' });
});
test('SF2e values and debits only the configured portion of a currency Item stack', async () => {
  const adapter = new Sf2eAdapter();
  class Value {
    static fromPrice(price, quantity) { return new Value(price.credits * quantity); }
    constructor(credits) { this.credits = credits; }
  }
  const item = {
    id: 'stick', type: 'treasure', system: { quantity: 5 }, isCurrency: true, unit: 'credits', price: { credits: 10 },
    get assetValue() { return Value.fromPrice(this.price, this.system.quantity); }
  };
  const token = { actorId: 'npc', actorLink: false, actor: { items: new Map([['stick', item]]) } };
  const entry = { source: { itemId: 'stick', ruleKey: 'npc:stick' }, ...adapter.entryMetadata(item, 2),
    data: { type: 'treasure', system: { quantity: 2 } } };
  assert.equal(entry.currency.amount, 20);
  const source = await adapter.sourceClaim(token, entry);
  assert.equal(source.after, 3);
  adapter.validateSourcePlan(token, entry, { source });
  item.price.credits = 11;
  assert.throws(() => adapter.validateSourcePlan(token, entry, { source }), { code: 'CurrencyChanged' });
});
