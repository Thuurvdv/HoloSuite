import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_ID, eligible, resolveCharacter, SerialQueue, authenticatedRequest } from '../src/model.mjs';
import { Dnd5eAdapter } from '../src/adapters.mjs';
import { LootTransactions } from '../src/transactions.mjs';

const copy = value => structuredClone(value);
test('authenticated differential User updates retain unchanged request fields and reject forged identity', () => {
  const complete = { id: 'request2', tokenUuid: 'Scene.scene.Token.corpse', action: 'take', actorId: 'hero' };
  const user = { id: 'requester', active: true, getFlag: () => complete };
  const change = { flags: { [MODULE_ID]: { request: { id: 'request2', action: 'take' } } } };
  const request = authenticatedRequest(user, change, 'requester');
  assert.deepEqual(request, complete); assert.notEqual(request, complete);
  assert.equal(authenticatedRequest(user, change, 'another-user'), null);
  assert.equal(authenticatedRequest(user, { flags: { [MODULE_ID]: { publicKey: {} } } }, 'requester'), null);
});
function fixture(count = 2) {
  const user = { id: 'player', active: true, viewedScene: 'scene' };
  const sourceActor = { type: 'npc', getFlag: () => null, statuses: new Set(['dead']) };
  const token = { id: 'corpse', uuid: 'Scene.scene.Token.corpse', actor: sourceActor,
    parent: { id: 'scene', testUserPermission: () => true }, getFlag: () => null };
  const actor = { id: 'hero', type: 'character', items: new Map(), testUserPermission: u => u.id === user.id,
    async createEmbeddedDocuments(_type, [data]) {
      if (actor.fail) throw Error('injected creation failure');
      if (actor.items.has(data._id)) throw Error('duplicate id');
      const item = { ...copy(data), id: data._id, getFlag: (module, key) => data.flags[module]?.[key] };
      actor.items.set(item.id, item); return [item];
    } };
  let persisted = { version: 1, entries: Array.from({ length: count }, (_, i) => ({ id: `entry${i}`, taken: false,
    data: { name: `Weapon ${i}`, type: 'weapon', system: { quantity: i + 2 } } })) };
  let id = 0, saveCount = 0;
  const io = { moduleId: MODULE_ID, authority: () => true,
    environment: () => ({ visible: () => true }), adapter: () => new Dnd5eAdapter(),
    token: async uuid => uuid === token.uuid ? token : null,
    actor: async actorId => actorId === actor.id ? actor : null,
    id: () => `generated${++id}`, load: async () => copy(persisted),
    save: async (_token, value) => { saveCount++; if (io.failSave === saveCount) throw Error('save failure'); persisted = copy(value); },
    summary: (_token, state) => ({ entries: state.entries.filter(e => !e.taken).map(copy) }) };
  const service = new LootTransactions(io);
  const request = (action = 'take', extra = {}) => ({ action, tokenUuid: token.uuid, actorId: actor.id, entryId: 'entry0', ...extra });
  return { io, service, user, actor, token, request, state: () => copy(persisted) };
}

test('individual transfer preserves quantity and leaves source inventory untouched', async () => {
  const f = fixture(); const original = f.token.actor;
  const result = await f.service.execute(f.request(), f.user);
  assert.equal(result.entries.length, 1); assert.equal(f.actor.items.size, 1);
  assert.equal([...f.actor.items.values()][0].system.quantity, 2);
  assert.equal(f.token.actor, original);
  assert.equal(f.state().entries[0].taken, true);
});

test('loot range is rechecked before pickup and cannot be satisfied by a different character', async () => {
  const f = fixture(1);
  let nearby = true;
  let recipientNearby = false;
  f.io.environment = () => ({ visible: () => true,
    inRange: (_token, _user, recipient) => recipient ? recipient === f.actor && recipientNearby : nearby });
  assert.equal((await f.service.execute(f.request('view'), f.user)).entries.length, 1);
  f.io.destination = () => f.actor;
  await assert.rejects(f.service.execute(f.request('view'), f.user), { code: 'OutOfRange' });
  await assert.rejects(f.service.execute(f.request('take'), f.user), { code: 'OutOfRange' });
  nearby = false;
  await assert.rejects(f.service.execute(f.request('inspect'), f.user), { code: 'OutOfRange' });
  await assert.rejects(f.service.execute(f.request('all'), f.user), { code: 'OutOfRange' });
  assert.equal(f.state().entries[0].claim, undefined);
  assert.equal(f.actor.items.size, 0);
  nearby = recipientNearby = true;
  assert.equal((await f.service.execute(f.request('view'), f.user)).entries.length, 1);
  assert.equal((await f.service.execute(f.request('take'), f.user)).entries.length, 0);
});

test('collection notifications include only committed entries and do not repeat on retry', async () => {
  const f = fixture(2), notifications = [];
  f.io.collected = event => { assert.equal(f.state().entries.find(e => e.id === event.entry.id).taken, true); notifications.push(event); };
  const create = f.actor.createEmbeddedDocuments;
  f.actor.createEmbeddedDocuments = async (...args) => {
    if (args[1][0].name === 'Weapon 0') throw Error('creation failure');
    return create(...args);
  };
  await f.service.execute(f.request('all'), f.user);
  assert.deepEqual(notifications.map(e => e.entry.data.name), ['Weapon 1']);
  f.actor.createEmbeddedDocuments = create;
  await f.service.execute(f.request(), f.user);
  await f.service.execute(f.request('all'), f.user);
  assert.deepEqual(notifications.map(e => e.entry.data.name), ['Weapon 1', 'Weapon 0']);
  assert.equal(notifications[1].actor, f.actor);
  assert.equal(notifications[1].entry.claim.userId, f.user.id);
});

test('recovered committed loot is announced once, using its original claim', async () => {
  const f = fixture(1), notifications = [];
  f.io.collected = event => notifications.push(event);
  f.io.failSave = 2;
  await f.service.execute(f.request(), f.user);
  assert.equal(notifications.length, 0);
  await f.service.execute(f.request('view'), f.user);
  await f.service.execute(f.request('view'), f.user);
  assert.equal(notifications.length, 1);
  assert.equal(notifications[0].entry.claim.userId, f.user.id);
});

test('chat failure cannot turn a committed transfer into a failed transfer', async () => {
  const f = fixture(1);
  f.io.collected = () => { throw Error('chat unavailable'); };
  const result = await f.service.execute(f.request(), f.user);
  assert.deepEqual(result.failures, []);
  assert.equal(f.actor.items.size, 1);
  assert.equal(f.state().entries[0].taken, true);
});

test('authority destination policy overrides a supplied Actor and validates the resolved character', async () => {
  const f = fixture(1);
  f.io.destination = (_request, user) => user.character;
  f.user.character = f.actor;
  await f.service.execute(f.request('take', { actorId: 'some-other-actor' }), f.user);
  assert.equal(f.actor.items.size, 1);
  const missing = fixture(1);
  missing.io.destination = () => null;
  await assert.rejects(missing.service.execute(missing.request(), missing.user), { code: 'ActorDenied' });
  assert.equal(missing.actor.items.size, 0);
});
test('Loot All transfers each remaining entry and is idempotent after a service reload', async () => {
  const f = fixture(3);
  assert.equal((await f.service.execute(f.request('all'), f.user)).entries.length, 0);
  await new LootTransactions(f.io).execute(f.request('all'), f.user);
  assert.equal(f.actor.items.size, 3);
});
test('simultaneous claims for one entry create exactly one Item', async () => {
  const f = fixture(1);
  await Promise.all(Array.from({ length: 15 }, () => f.service.execute(f.request(), f.user)));
  assert.equal(f.actor.items.size, 1);
});
test('rejected ownership, hidden tokens, scene mismatch, visibility, and unavailable GM cannot mutate', async () => {
  for (const change of [
    f => { f.actor.testUserPermission = () => false; },
    f => { f.token.hidden = true; },
    f => { f.user.viewedScene = 'other'; },
    f => { f.io.environment = () => ({ visible: () => false }); },
    f => { f.io.authority = () => false; }
  ]) {
    const f = fixture(); change(f);
    await assert.rejects(f.service.execute(f.request(), f.user)); assert.equal(f.actor.items.size, 0);
    assert.ok(f.state().entries.every(e => !e.taken && !e.claim));
  }
});
test('a player can loot the active scene without extra Scene ownership; an unshared inactive scene stays denied', async () => {
  const f = fixture(1);
  f.token.parent.testUserPermission = () => false;
  f.token.parent.active = true;
  await f.service.execute(f.request(), f.user);
  assert.equal(f.actor.items.size, 1);
  f.token.parent.active = false;
  await assert.rejects(f.service.execute(f.request('view'), f.user), { code: 'AccessDenied' });
});
test('forged item contents are ignored; unknown entry grants nothing', async () => {
  const f = fixture();
  await f.service.execute(f.request('take', { data: { name: 'Forged item' } }), f.user);
  assert.equal([...f.actor.items.values()][0].name, 'Weapon 0');
  await f.service.execute(f.request('take', { entryId: 'missing' }), f.user);
  assert.equal(f.actor.items.size, 1);
});
test('failed reservation write cannot create inventory', async () => {
  const f = fixture(); f.io.failSave = 1;
  const result = await f.service.execute(f.request(), f.user);
  assert.equal(result.failures.length, 1); assert.equal(f.actor.items.size, 0);
  assert.equal(f.state().entries[0].taken, false);
});
test('partial creation failure leaves failed loot reserved and available for same-character recovery', async () => {
  const f = fixture(); const original = f.actor.createEmbeddedDocuments;
  f.actor.createEmbeddedDocuments = async (...args) => {
    if (args[1][0].name === 'Weapon 0') throw Error('failure');
    return original(...args);
  };
  const result = await f.service.execute(f.request('all'), f.user);
  assert.equal(result.failures.length, 1); assert.equal(result.entries.length, 1); assert.equal(f.actor.items.size, 1);
  f.actor.createEmbeddedDocuments = original;
  await new LootTransactions(f.io).execute(f.request(), f.user);
  assert.equal(f.actor.items.size, 2); assert.ok(f.state().entries.every(e => e.taken));
});
test('crash after Item creation but before token commit recovers without duplicate', async () => {
  const f = fixture(1); f.io.failSave = 2;
  await f.service.execute(f.request(), f.user);
  assert.equal(f.actor.items.size, 1); assert.equal(f.state().entries[0].taken, false);
  assert.ok(f.state().entries[0].claim);
  const result = await new LootTransactions(f.io).execute(f.request('view'), f.user);
  assert.equal(result.entries.length, 0); assert.equal(f.actor.items.size, 1);
});
test('a different player cannot take an ambiguous pending claim', async () => {
  const f = fixture(1); f.actor.fail = true;
  await f.service.execute(f.request(), f.user);
  const other = { ...f.user, id: 'other' }; f.actor.testUserPermission = () => true; f.actor.fail = false;
  const result = await f.service.execute(f.request(), other);
  assert.equal(result.failures[0].code, 'RecoveryRequired'); assert.equal(f.actor.items.size, 0);
});
test('separate token snapshots do not share depletion', async () => {
  const a = fixture(1), b = fixture(1);
  await a.service.execute(a.request(), a.user);
  assert.equal(b.state().entries[0].taken, false);
});
test('defeat detection respects override and does not infer death from zero HP by default', () => {
  const f = fixture(); f.token.actor.statuses.clear(); f.token.actor.system = { attributes: { hp: { value: 0, max: 10 } } };
  assert.equal(eligible(f.token), false); // Automatic is the default, including existing initialized corpses.
  f.token.getFlag = () => ({ mode: 'automatic' });
  assert.equal(eligible(f.token), false); assert.equal(eligible(f.token, { zeroHP: true }), true);
  const combats = [{ scene: { id: 'scene' }, combatants: [{ tokenId: 'corpse', defeated: true }] }];
  assert.equal(eligible(f.token, { combats }), true);
  f.token.getFlag = () => ({ mode: 'disabled' }); assert.equal(eligible(f.token, { combats }), false);
  f.token.getFlag = () => ({ mode: 'enabled' }); assert.equal(eligible(f.token), true);
});
test('D&D5e physical filtering excludes natural attacks, mechanics and zero quantities', () => {
  const adapter = new Dnd5eAdapter();
  const item = (type, system = {}) => ({ type, system: { quantity: 1, ...system } });
  for (const type of ['weapon', 'equipment', 'consumable', 'tool', 'loot', 'container']) assert.ok(adapter.eligible(item(type)));
  for (const type of ['spell', 'feat', 'class', 'race', 'background']) assert.equal(adapter.eligible(item(type)), false);
  assert.equal(adapter.eligible(item('weapon', { type: { value: 'natural' } })), false);
  assert.equal(adapter.eligible(item('weapon', { weaponType: 'natural' })), false);
  assert.equal(adapter.eligible(item('loot', { quantity: 0 })), false);
  assert.equal(adapter.eligible(item('loot', { schema: { getField: () => null } })), false);
});
test('snapshot preserves activities and effects while clearing corpse relationships', () => {
  const adapter = new Dnd5eAdapter();
  const source = { _id: 'old', name: 'Blade', type: 'weapon', system: { quantity: 2, container: 'bag', equipped: true,
    attuned: true, attunement: 2, activities: { attack: { type: 'attack' } } }, effects: [{ _id: 'effect', origin: 'Actor.npc.Item.old', changes: [] }] };
  const result = adapter.snapshot({ toObject: () => source });
  assert.equal(result._id, undefined); assert.equal(result.system.quantity, 2);
  assert.equal(result.system.container, null); assert.equal(result.system.equipped, false);
  assert.equal(result.system.attunement, 1); assert.deepEqual(result.system.activities, source.system.activities);
  assert.equal(result.effects[0].origin, null); assert.equal(source.system.equipped, true);
});
test('queue releases after rejection and unrelated containers can run independently', async () => {
  const queue = new SerialQueue();
  await assert.rejects(queue.run('a', () => { throw Error(); }));
  assert.equal(await queue.run('a', () => 42), 42); assert.equal(queue.tails.size, 0);
});

test('character resolution prefers assignment, then owned scene tokens, and rejects ambiguous or unauthorized destinations', () => {
 const user={id:'player'};const adapter={destination:a=>a.type==='character'};
 const hero=(id,uuid=id,owner=true)=>({id,uuid,type:'character',testUserPermission:u=>owner&&u.id===user.id});
 const a=hero('a'),b=hero('b'),synthetic=hero('a','Scene.s.Token.t.Actor.a');
 assert.equal(resolveCharacter(user,[a,b],[{actor:a},{actor:a}],adapter),a);
 assert.equal(resolveCharacter(user,[a],[{actor:synthetic}],adapter),synthetic);
 user.character=b;assert.equal(resolveCharacter(user,[a,b],[{actor:a}],adapter),b);
 user.character=null;assert.equal(resolveCharacter(user,[a],[],adapter),a);
 assert.throws(()=>resolveCharacter(user,[a,b],[{actor:a},{actor:b}],adapter),{code:'AmbiguousActor'});
 assert.throws(()=>resolveCharacter(user,[hero('denied','denied',false)],[],adapter),{code:'NoActor'});
});

function sourceFixture(quantity=2) {
 const f=fixture(1);const base={...f.token.actor,items:new Map()};
 const makeItem=()=>({id:'source',type:'weapon',system:{quantity},getFlag:(_m,key)=>item.flags?.[key],
   update:async change=>{item.system.quantity=change['system.quantity'];item.flags={sourceClaim:change['flags.holosuite-loot.sourceClaim']};}});
 let item=makeItem();base.items.set('source',item);
 f.token.actorLink=true;f.token.actor=base;
 f.token.update=async change=>{f.token.actorLink=change.actorLink;item=makeItem();f.token.actor={...base,items:new Map([['source',item]]),deleteEmbeddedDocuments:async(_type,ids)=>{if(f.token.failRemove)throw Error('delete failed');for(const id of ids)f.token.actor.items.delete(id);}};};
 const load=f.io.load;f.io.load=async()=>{const state=await load();state.entries[0].source={itemId:'source'};return state;};
 return {...f,base};
}
test('looting removes the source stack on a detached token while keeping its shared Actor unchanged',async()=>{
 const f=sourceFixture();await f.service.execute(f.request(),f.user);
 assert.equal(f.actor.items.size,1);assert.equal(f.token.actorLink,false);assert.equal(f.token.actor.items.size,0);assert.equal(f.base.items.size,1);
});
test('source depletion preserves extra quantity and is idempotent after a failed commit',async()=>{
 const f=sourceFixture(5);f.io.failSave=2;await f.service.execute(f.request(),f.user);
 assert.equal(f.token.actor.items.get('source').system.quantity,3);
 await f.service.execute(f.request('view'),f.user);
 assert.equal(f.token.actor.items.get('source').system.quantity,3);assert.equal(f.actor.items.size,1);assert.equal(f.state().entries[0].taken,true);
});
test('failed source removal reserves the granted Item and retries without granting a duplicate',async()=>{
 const f=sourceFixture();f.token.failRemove=true;
 assert.equal((await f.service.execute(f.request(),f.user)).failures.length,1);
 assert.equal(f.actor.items.size,1);assert.equal(f.state().entries[0].taken,false);assert.equal(f.token.actor.items.size,1);
 f.token.failRemove=false;await f.service.execute(f.request('view'),f.user);
 assert.equal(f.actor.items.size,1);assert.equal(f.token.actor.items.size,0);assert.equal(f.state().entries[0].taken,true);
});
test('failed destination creation never depletes the source and missing source fails before creation',async()=>{
 const f=sourceFixture();f.actor.fail=true;await f.service.execute(f.request(),f.user);
 assert.equal(f.token.actor.items.size,1);
 const missing=sourceFixture(1);const result=await missing.service.execute(missing.request(),missing.user);
 assert.equal(result.failures[0].code,'SourceChanged');assert.equal(missing.actor.items.size,0);
});
test('item inspection is authorized, creates no inventory Item, and hides unidentified mechanics',async()=>{
 const f=fixture();const result=await f.service.execute(f.request('inspect'),f.user);
 assert.equal(result.item.name,'Weapon 0');assert.equal(f.actor.items.size,0);assert.equal(f.state().entries[0].taken,false);
 f.token.hidden=true;await assert.rejects(f.service.execute(f.request('inspect'),f.user),{code:'AccessDenied'});
 const preview=new Dnd5eAdapter().preview({data:{name:'Secret Sword',type:'weapon',system:{quantity:1,identified:false,unidentified:{name:'Unknown Blade',description:'A blade'},activities:{secret:{}}}}});
 assert.equal(preview.name,'Unknown Blade');assert.equal(preview.system.activities,undefined);
});

test('cancelled native unlink and deletion hooks cannot mutate the shared Actor or falsely commit depletion',async()=>{
 const f=sourceFixture();f.token.update=async()=>{};
 assert.equal((await f.service.execute(f.request(),f.user)).failures[0].code,'SourceChanged');
 assert.equal(f.actor.items.size,0);assert.equal(f.base.items.size,1);
 const deletion=sourceFixture();const update=deletion.token.update;
 deletion.token.update=async change=>{await update(change);deletion.token.actor.deleteEmbeddedDocuments=async()=>[];};
 assert.equal((await deletion.service.execute(deletion.request(),deletion.user)).failures[0].code,'SourceChanged');
 assert.equal(deletion.state().entries[0].taken,false);assert.equal(deletion.actor.items.size,1);
});

test('zero-HP detection never authorizes a living default NPC, including one with an existing loot snapshot', async()=>{
 const f=fixture(1);f.token.actor.statuses.clear();
 f.token.actor.system={attributes:{hp:{value:10,max:10}}};
 f.io.environment=()=>({visible:()=>true,zeroHP:true});
 assert.equal(eligible(f.token,{zeroHP:true}),false);
 await assert.rejects(f.service.execute(f.request('view'),f.user),{code:'Unavailable'});
 await assert.rejects(f.service.execute(f.request(),f.user),{code:'Unavailable'});
 assert.equal(f.actor.items.size,0);
 f.token.actor.system.attributes.hp.value=0;
 assert.equal((await f.service.execute(f.request('view'),f.user)).entries.length,1);
 f.token.actor.system.attributes.hp.value=1;
 await assert.rejects(f.service.execute(f.request('all'),f.user),{code:'Unavailable'});
 assert.equal(f.actor.items.size,0);
});
