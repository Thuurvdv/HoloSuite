import test from 'node:test';
import assert from 'node:assert/strict';
const state = { bounties: {}, removedTags: [], postPublishChat: false, postResultChat: false };
globalThis.foundry = { utils: { deepClone: structuredClone } };
globalThis.game = { user: { isGM: true }, settings: { get: (_m, key) => state[key], set: async (_m, key, value) => { state[key] = value; } } };
globalThis.ui = { notifications: { warn() {}, error() {} } };
const { normalizeBounty, setBountyStatus } = await import('../src/bounty-service.ts');
test('card status picker preserves publication rules and private data across transitions', async () => {
  state.bounties.b = normalizeBounty({ id: 'b', title: 'Contract', targetName: 'Target', status: 'hidden', published: false, notesGM: 'Secret', claimedBy: 'Crew' });
  for (const [status, published] of [['available', true], ['claimed', true], ['completed', true], ['failed', true], ['hidden', false], ['archived', false], ['available', true]]) {
    const updated = await setBountyStatus('b', status);
    assert.equal(updated.status, status);
    assert.equal(updated.published, published);
    assert.equal(updated.notesGM, 'Secret');
    assert.equal(updated.claimedBy, 'Crew');
  }
  const original = structuredClone(state.bounties.b);
  assert.equal(await setBountyStatus('b', 'invalid'), null);
  game.user.isGM = false;
  assert.equal(await setBountyStatus('b', 'archived'), null);
  assert.deepEqual(state.bounties.b, original);
});
