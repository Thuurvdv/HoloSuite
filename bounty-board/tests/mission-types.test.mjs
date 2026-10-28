import test from 'node:test';
import assert from 'node:assert/strict';
const state = { bounties: {}, removedTags: [], boardVisibleToPlayers: true };
globalThis.foundry = { utils: { deepClone: structuredClone, randomID: () => 'new' } };
globalThis.game = { user: { isGM: true }, settings: {
  get: (_module, key) => state[key], set: async (_module, key, value) => state[key] = value
}, i18n: { localize: key => key } };
globalThis.ui = { notifications: { error() {}, warn() {} } };
const { normalizeBounty, upsertBounty, getMissionTypes, filterBounties, prepareBountyForDisplay, getBountiesForActor } = await import('../src/bounty-service.ts');

test('legacy contracts retain bounty semantics and existing links', () => {
  const old = normalizeBounty({ id: 'old', title: 'Wanted', targetName: 'Target', linkedActorUuid: 'Actor.a', sceneId: 's' });
  assert.equal(old.missionType, 'Bounty');
  assert.equal(old.linkedActorUuid, 'Actor.a');
  assert.equal(old.sceneId, 's');
  assert.equal(prepareBountyForDisplay(old).missionSubject, 'Target');
});

test('transport, exploration, and named missions survive saves without a bounty target', async () => {
  state.bounties = {};
  const transport = await upsertBounty({ id: 't', title: 'Medical delivery', missionType: 'transport', cargo: 'Medicine', pickup: 'Luna', destination: 'Mars', deadline: 'Before dawn', linkedActorUuid: 'Actor.a' });
  assert.ok(transport);
  assert.equal(transport.missionType, 'Transport');
  const updated = await upsertBounty({ id: 't', rewardAmount: 500 });
  assert.equal(updated.destination, 'Mars');
  assert.equal(updated.deadline, 'Before dawn');
  assert.equal(prepareBountyForDisplay(updated).missionSubject, 'Medicine');
  assert.equal(getBountiesForActor('Actor.a').length, 0, 'cargo rewards must not become wanted bounties');
  const exploration = await upsertBounty({ id: 'e', title: 'Survey', missionType: 'Exploration', region: 'Outer Rim', objective: 'Map ruins', hazards: 'Radiation' });
  assert.equal(prepareBountyForDisplay(exploration).missionSubject, 'Outer Rim');
  assert.equal(prepareBountyForDisplay(exploration).displayMissionType, 'Exploration');
  assert.equal(prepareBountyForDisplay(exploration).displayMissionSubject, 'Survey');
  assert.equal(prepareBountyForDisplay(exploration).displayContractTitle, 'Outer Rim');
  assert.equal(prepareBountyForDisplay(exploration).dangerLabel, 'Danger');
  const named = await upsertBounty({ id: 'n', title: 'Find the wreck', missionType: '  Deep   Salvage  ', objective: 'Recover the drive', published: true });
  assert.equal(named.missionType, 'Deep Salvage');
  const reuse = await upsertBounty({ id: 'n2', title: 'Second wreck', missionType: 'deep salvage' });
  assert.equal(reuse.missionType, 'Deep Salvage');
  assert.equal(getMissionTypes().filter(t => t.toLowerCase() === 'deep salvage').length, 1);
  assert.equal(filterBounties([transport, exploration, named], { missionType: 'deep salvage' })[0].id, 'n');
  for (const query of ['Mars', 'Before dawn', 'Medicine', 'Luna']) {
    assert.equal(filterBounties([transport], { search: query }).length, 1);
    assert.ok(prepareBountyForDisplay(transport).searchText.includes(query.toLowerCase()));
  }
  assert.equal(filterBounties([exploration], { search: 'Radiation' }).length, 1);
});

test('bounties can omit or clear their title while retaining the target and reward', async () => {
  game.user.isGM = true;
  for (const title of [undefined, '', '   ']) {
    const saved = await upsertBounty({ id: 'untitled', title, targetName: 'Nara Voss', rewardAmount: 42000 });
    assert.ok(saved);
    assert.equal(saved.title, '');
    const card = prepareBountyForDisplay(saved);
    assert.equal(card.displayContractTitle, '');
    assert.equal(card.displayMissionSubject, 'Nara Voss');
    assert.equal(saved.rewardAmount, 42000);
  }
  const titled = await upsertBounty({ id: 'untitled', title: 'Recovery job' });
  assert.equal(titled.title, 'Recovery job');
  const cleared = await upsertBounty({ id: 'untitled', title: '' });
  assert.equal(cleared.title, '');
  assert.equal(cleared.targetName, 'Nara Voss');
  assert.equal(await upsertBounty({ id: 'no-target', title: '', targetName: '' }), null);
});

test('unpublished mission type names are excluded from player suggestions', async () => {
  await upsertBounty({ id: 'secret', title: 'Secret job', missionType: 'Covert Diplomacy' });
  game.user.isGM = false;
  assert.ok(getMissionTypes().includes('Deep Salvage'));
  assert.equal(getMissionTypes().includes('Covert Diplomacy'), false);
  state.boardVisibleToPlayers = false;
  assert.equal(getMissionTypes().includes('Deep Salvage'), false);
});
