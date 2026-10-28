import test from 'node:test';
import assert from 'node:assert/strict';

const state = { boardVisibleToPlayers: true, removedTags: [], bounties: {} };
globalThis.Application = class {};
globalThis.foundry = { applications: {}, utils: { deepClone: structuredClone } };
globalThis.game = { user: { isGM: true }, settings: { get: (_module, key) => state[key] },
  i18n: { localize: key => key } };
const { BountyBoardApp } = await import('../src/bounty-board-app.ts');
const { normalizeBounty } = await import('../src/bounty-service.ts');

test('status dropdown options count permitted contracts and selected status filters the board', async () => {
  state.bounties = Object.fromEntries(['available', 'claimed', 'hidden', 'archived'].map(status =>
    [status, normalizeBounty({ id: status, title: status, status, published: true })]));
  const app = new BountyBoardApp();
  app.filters.status = 'available';
  const gm = await app._prepareContext({});
  assert.deepEqual(gm.bounties.map(b => b.id), ['available']);
  assert.equal(gm.statusOptions.find(t => t.value === '').count, 4);
  assert.equal(gm.statusOptions.find(t => t.value === 'available').selected, true);
  assert.equal(gm.statusOptions.find(t => t.value === 'claimed').selected, false);
  game.user.isGM = false;
  const player = await app._prepareContext({});
  assert.equal(player.statusOptions.some(t => ['hidden', 'archived'].includes(t.value)), false);
  assert.equal(player.statusOptions.find(t => t.value === '').count, 2);
  state.boardVisibleToPlayers = false;
  const hidden = await app._prepareContext({});
  assert.equal(hidden.boardHiddenForPlayers, true);
  assert.equal(hidden.bounties.length, 0);
});
