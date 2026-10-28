import test from 'node:test';
import assert from 'node:assert/strict';

const state = { bounties: {}, boardVisibleToPlayers: true };
const hooks = new Map();
const created = [];
let serial = 0;
globalThis.Application = class {
  constructor(options) { this.options = options; this.renders = 0; this.rendered = false; }
  bringToFront() { if (!this.rendered) throw new Error('Window element does not exist until rendering completes'); }
  render() { this.renders++; return this; }
  async close() { this.closed = true; }
};
globalThis.foundry = { applications: {}, utils: { deepClone: structuredClone, randomID: () => String(++serial) } };
globalThis.game = { user: { isGM: false }, settings: { get: (_module, key) => state[key] }, i18n: { localize: key => key } };
globalThis.ui = { notifications: { warn() {} } };
globalThis.Hooks = { on: (name, handler) => hooks.set(name, handler) };
globalThis.renderTemplate = async (_path, data) => `Open handout: ${data.bountyId}`;
globalThis.ChatMessage = { getSpeaker: () => ({}), create: async data => { created.push(data); return data; } };

const { normalizeBounty } = await import('../src/bounty-service.ts');
const { getHandoutData, openBountyHandout, showBountyHandout, refreshBountyHandouts, registerHandoutHooks, handleHandoutPresentation } = await import('../src/bounty-handout.ts');
function reset() {
  game.user.isGM = false;
  state.boardVisibleToPlayers = true;
  state.bounties = { b: normalizeBounty({ id: 'b', title: 'Public contract', targetName: 'Target', published: true,
    notesGM: 'SECRET', notesPublic: 'Public note', linkedActorUuid: 'Actor.secret', linkedJournalId: 'secret-journal', sceneId: 'secret-scene',
    cargo: 'Inactive secret cargo', claimedBy: 'Inactive assignee' }) };
  created.length = 0;
}

test('handout callouts show at most six tags balanced across both sides without changing the contract', async () => {
  reset();
  state.bounties.b.tags = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
  const app = openBountyHandout('b');
  const context = await app._prepareContext();
  assert.deepEqual(context.tagCallouts.map(tag => tag.label), state.bounties.b.tags.slice(0, 6));
  for (const side of ['left', 'right']) assert.deepEqual(context.tagCallouts.filter(tag => tag.side === side).map(tag => tag.row), [0, 1, 2]);
  assert.equal(state.bounties.b.tags.length, 7);
  state.bounties.b.tags = ['Only'];
  assert.deepEqual((await app._prepareContext()).tagCallouts, [{ label: 'Only', side: 'left', row: 1 }]);
  state.bounties.b.tags = [];
  assert.deepEqual((await app._prepareContext()).tagCallouts, []);
  await app.close();
});

test('player handouts explicitly project public fields and deny inaccessible contracts', () => {
  reset();
  const data = getHandoutData('b');
  assert.equal(data.notesPublic, 'Public note');
  for (const key of ['notesGM', 'linkedActorUuid', 'linkedJournalId', 'sceneId', 'cargo']) assert.equal(key in data, false);
  assert.equal(data.claimedBy, '');
  assert.equal(JSON.stringify(data).includes('SECRET'), false);
  assert.equal(getHandoutData('missing'), null);
  assert.equal(getHandoutData(null), null);
  for (const status of ['hidden', 'archived']) {
    state.bounties.b.status = status;
    assert.equal(getHandoutData('b'), null);
  }
  for (const status of ['available', 'claimed', 'completed', 'failed']) {
    state.bounties.b.status = status;
    assert.ok(getHandoutData('b'));
  }
  state.bounties.b.published = false;
  assert.equal(getHandoutData('b'), null);
  game.user.isGM = true;
  assert.ok(getHandoutData('b'));
  assert.equal(getHandoutData('b', { forPlayers: true }), null);
  state.bounties.b.published = true;
  state.boardVisibleToPlayers = false;
  assert.ok(getHandoutData('b'));
  assert.equal(getHandoutData('b', { forPlayers: true }), null);
  game.user.isGM = false;
  assert.equal(getHandoutData('b'), null);
});

test('handouts show only facts relevant to the current mission type', () => {
  reset();
  Object.assign(state.bounties.b, { missionType: 'Transport', cargo: 'Medicine', pickup: 'Luna', destination: 'Mars', deadline: 'Tonight' });
  const transport = getHandoutData('b');
  assert.equal(transport.missionSubject, 'Medicine');
  assert.deepEqual(transport.missionFacts.map(f => f.value), ['Luna', 'Mars', 'Tonight']);
  Object.assign(state.bounties.b, { missionType: 'Exploration', region: 'Rim', objective: 'Survey', hazards: 'Radiation' });
  assert.deepEqual(getHandoutData('b').missionFacts.map(f => f.value), ['Survey', 'Radiation']);
  state.bounties.b.missionType = 'Diplomacy';
  assert.equal(getHandoutData('b').missionSubject, 'Survey');
  assert.deepEqual(getHandoutData('b').missionFacts.map(f => f.value), ['Survey']);
});

test('only GMs can share and messages contain a reference without private snapshots', async () => {
  reset();
  assert.equal(await showBountyHandout('b'), false);
  assert.equal(created.length, 0);
  game.user.isGM = true;
  assert.ok(await showBountyHandout('b'));
  assert.deepEqual(created[0].flags, { 'bounty-board': { bountyId: 'b', mode: 'handout' } });
  assert.equal(JSON.stringify(created).includes('SECRET'), false);
  assert.equal(JSON.stringify(created).includes('Public contract'), false);
  state.boardVisibleToPlayers = false;
  assert.equal(await showBountyHandout('b'), false);
  state.boardVisibleToPlayers = true;
  state.bounties.b.published = false;
  assert.equal(await showBountyHandout('b'), false);
  assert.equal(created.length, 1);
});

test('open handouts refresh current data and close on revoked access or deletion', async () => {
  reset();
  const app = openBountyHandout('b');
  assert.equal(openBountyHandout('b'), app);
  state.bounties.b.title = 'Updated';
  await refreshBountyHandouts();
  assert.equal((await app._prepareContext()).bounty.title, 'Updated');
  state.bounties.b.published = false;
  await refreshBountyHandouts();
  assert.equal(app.closed, true);
  assert.equal(openBountyHandout('b'), false);
  state.bounties.b.published = true;
  const second = openBountyHandout('b');
  state.boardVisibleToPlayers = false;
  await refreshBountyHandouts();
  assert.equal(second.closed, true);
  game.user.isGM = true;
  const preview = openBountyHandout('b');
  delete state.bounties.b;
  await refreshBountyHandouts();
  assert.equal(preview.closed, true);
});

test('live presentations require GM authorship and visible messages; both chat hook formats reopen safely', async () => {
  reset();
  const message = { flags: { 'bounty-board': { bountyId: 'b', mode: 'handout' } }, author: { isGM: false } };
  const app = openBountyHandout('b');
  let renders = app.renders;
  handleHandoutPresentation(message);
  assert.equal(app.renders, renders);
  message.author.isGM = true;
  message.visible = false;
  handleHandoutPresentation(message);
  assert.equal(app.renders, renders);
  message.visible = true;
  handleHandoutPresentation(message);
  assert.equal(app.renders, ++renders);
  registerHandoutHooks();
  const button = { dataset: {}, addEventListener: (_name, listener) => { button.click = listener; } };
  const root = { querySelectorAll: () => [button] };
  hooks.get('renderChatMessage')(message, [root]);
  hooks.get('renderChatMessageHTML')(message, root);
  button.click({ preventDefault() {} });
  assert.equal(app.renders, ++renders);
  state.bounties.b.status = 'hidden';
  button.click({ preventDefault() {} });
  assert.equal(app.renders, renders);
  hooks.get('updateSetting')({ key: 'bounty-board.bounties' });
  assert.equal(app.closed, true);
  assert.equal(openBountyHandout('b'), false);
});
