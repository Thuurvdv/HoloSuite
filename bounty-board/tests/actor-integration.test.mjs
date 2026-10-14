import test from 'node:test';
import assert from 'node:assert/strict';
const state={bounties:{},boardVisibleToPlayers:true,removedTags:[]};
const actor={id:'a',uuid:'Actor.a',documentName:'Actor',name:'Target'};
const synthetic={id:'a',uuid:'Scene.s.Token.t.Actor.a',isToken:true,documentName:'Actor',name:'Token target'};
const docs={'Actor.a':actor,'Scene.s.Token.linked':{documentName:'Token',actor},'Scene.s.Token.t':{documentName:'Token',actor:synthetic},'Compendium.pack.Actor.a':{...actor,pack:'pack'}};
globalThis.foundry={utils:{deepClone:structuredClone,randomID:()=> 'random',fromUuid:async id=>docs[id]}};
globalThis.ui={notifications:{warn(){},error(){}}};
globalThis.game={user:{isGM:true},actors:{get:id=>id==='a'?actor:null},settings:{get:(_m,k)=>state[k],set:async(_m,k,v)=>{state[k]=v;}}};
const {normalizeBounty,linkBountyTarget,getBountiesForActor,upsertBounty}=await import('../src/bounty-service.ts');
function reset(){game.user.isGM=true;state.boardVisibleToPlayers=true;state.bounties={b:normalizeBounty({id:'b',title:'Contract',targetName:'Target',rewardAmount:2500,published:true,sceneId:'s',linkedJournalId:'j',notesGM:'secret'})};}
test('actor and linked-token drops persist the same Actor UUID without changing bounty data',async()=>{
 reset();const before=structuredClone(state.bounties.b);await linkBountyTarget('b',{type:'Token',uuid:'Scene.s.Token.linked'});
 assert.equal(state.bounties.b.linkedActorUuid,'Actor.a');
 for(const key of ['rewardAmount','targetName','sceneId','linkedJournalId','notesGM'])assert.equal(state.bounties.b[key],before[key]);
 await upsertBounty({id:'b',rewardAmount:5000});assert.equal(state.bounties.b.linkedActorUuid,'Actor.a');
 assert.equal(getBountiesForActor('Actor.a')[0].rewardAmount,5000);
 await linkBountyTarget('b',null);assert.deepEqual(getBountiesForActor('Actor.a'),[]);
});
test('unlinked tokens remain distinct from their base Actor and other tokens',async()=>{
 reset();await linkBountyTarget('b',{type:'Token',uuid:'Scene.s.Token.t'});
 assert.equal(state.bounties.b.linkedActorUuid,synthetic.uuid);assert.deepEqual(getBountiesForActor(actor.uuid),[]);
 assert.equal(getBountiesForActor(synthetic.uuid).length,1);assert.deepEqual(getBountiesForActor('Scene.s.Token.other.Actor.a'),[]);
});
test('non-GMs and invalid drops cannot change links; missing bounties are not created',async()=>{
 reset();game.user.isGM=false;assert.equal(await linkBountyTarget('b',{type:'Actor',uuid:actor.uuid}),null);assert.equal(state.bounties.b.linkedActorUuid,'');
 game.user.isGM=true;
 for(const data of [{type:'Item',uuid:actor.uuid},{type:'Actor',uuid:'missing'},{type:'Actor',uuid:'Compendium.pack.Actor.a'}])await assert.rejects(linkBountyTarget('b',data));
 await assert.rejects(linkBountyTarget('missing',{type:'Actor',uuid:actor.uuid}));assert.equal(Object.keys(state.bounties).length,1);
});
test('reward API projects only permitted amounts and respects board visibility',async()=>{
 reset();await linkBountyTarget('b',{type:'Actor',uuid:actor.uuid});game.user.isGM=false;
 assert.deepEqual(getBountiesForActor(actor.uuid),[{id:'b',rewardAmount:2500,rewardCurrency:'credits',status:'available'}]);
 state.bounties.b.published=false;assert.deepEqual(getBountiesForActor(actor.uuid),[]);
 state.bounties.b.published=true;state.bounties.b.status='hidden';assert.deepEqual(getBountiesForActor(actor.uuid),[]);
 state.bounties.b.status='available';state.boardVisibleToPlayers=false;assert.deepEqual(getBountiesForActor(actor.uuid),[]);
 game.user.isGM=true;assert.equal(getBountiesForActor(actor.uuid).length,1);
});
