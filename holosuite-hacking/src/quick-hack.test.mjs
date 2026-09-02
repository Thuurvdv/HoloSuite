import assert from "node:assert/strict";
import test from "node:test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

globalThis.Application = class { render() {} async close() {} };
globalThis.FormApplication = Application;
globalThis.foundry = { utils: { deepClone: structuredClone } };
const source = buildSync({ stdin: { contents: `
  export * from './core/difficulty'; export * from './core/hacking-api'; export * from './core/minigame-runner'; export * from './core/chat';
  export {NodeIntrusionApp} from './minigames/node-intrusion/node-intrusion-app';
  export {SignalAlignmentApp} from './minigames/signal-alignment/signal-alignment-app';
  export {PacketSwitchboardApp} from './minigames/packet-switchboard/packet-switchboard-app';
  export {PrismLockApp} from './minigames/prism-lock/prism-lock-app';`,
  resolveDir: fileURLToPath(new URL('./', import.meta.url)), loader: 'ts' }, bundle: true, write: false, format: 'esm', platform: 'node' }).outputFiles[0].text;
const checks = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

function setup() {
  const values = { defaultStaticModifier: "invalid", difficultyProfileOverrides: JSON.stringify({ success: { nodeIntrusion: { nodeCount: 7 } } }) };
  globalThis.game = { settings: { get: (_module, key) => values[key] }, system: { id: 'unknown' } };
  globalThis.ui = { notifications: { warn() {} } };
  globalThis.document = { createElement: () => ({ set textContent(value) { this.innerHTML = String(value); } }) };
  return values;
}

test("Quick Hack selects each profile with tuning, independent of all dice settings and supplied roll data", () => {
  setup();
  checks.registerMinigame({ id: 'quick-test', create: options => ({ options, render() {}, close() {} }) });
  const api = checks.createHackingApi({ moduleId: 'holosuite-hacking' });
  for (const outcome of Object.keys(checks.DIFFICULTY_PROFILES)) {
    const app = api.startHack({ type: 'quick-test', quickOutcome: outcome, rollTotal: 999, dc: -999, naturalRoll: 20 });
    assert.equal(app.options.profile.profileId, outcome);
    assert.equal(app.options.rollTotal, null); assert.equal(app.options.dc, null); assert.equal(app.options.naturalRoll, null);
    assert.equal(app.options.rollSource, 'gm');
    if (outcome === 'success') assert.equal(app.options.profile.nodeCount, 7);
  }
  for (const invalid of ['constructor', 'invalid', false, 2, {}]) assert.throws(() => api.startHack({ type: 'quick-test', quickOutcome: invalid }), /valid Quick Hack/);
  const snapshotProfile = { ...checks.getDifficultyProfile(null, null, null, { quickOutcome: 'success' }), nodeCount: 19 };
  const spectator = api.startHack({ type: 'quick-test', readOnly: true, quickOutcome: 'success', profile: snapshotProfile });
  assert.equal(spectator.options.profile.nodeCount, 19, "Spectators preserve the running puzzle's tuning");
});

test("all four minigames and their spectator snapshots preserve GM difficulty without fabricating roll totals", () => {
  setup();
  for (const Class of [checks.NodeIntrusionApp, checks.SignalAlignmentApp, checks.PacketSwitchboardApp, checks.PrismLockApp]) {
    const app = new Class({ quickOutcome: 'strong_success', actorName: 'Hacker', seed: 'quick-test' });
    assert.equal(app.profile.profileId, 'strong_success');
    assert.equal(app.rollTotal, null); assert.equal(app.dc, null);
    const data = app.getData();
    assert.equal(data.quickOutcome, 'strong_success');
    assert.equal(data.rollTotal, null);
    const snapshot = app.getLiveSessionData();
    assert.equal(snapshot.options.quickOutcome, 'strong_success');
    const spectator = new Class({ ...snapshot.options, readOnly: true });
    assert.equal(spectator.getData().quickOutcome, 'strong_success');
    assert.equal(spectator.rollTotal, null);
  }
});

test("Quick Hack result cards report the selected difficulty and the actual puzzle result separately", async () => {
  setup(); let posted;
  globalThis.ChatMessage = { getSpeaker: () => ({}), create: data => { posted = data; } };
  await checks.postHackResultMessage({ title: 'Node Intrusion', result: 'failure', actorName: 'Hacker', quickOutcome: 'success', rollTotal: null, dc: null });
  assert.match(posted.content, /HACK FAILED/);
  assert.match(posted.content, /GM-selected difficulty: Success/);
  assert.doesNotMatch(posted.content, /Roll \d|vs DC/);
  await checks.postHackResultMessage({ title: 'Node Intrusion', result: 'success', rollTotal: 0, dc: 10 });
  assert.match(posted.content, /Roll 0 vs DC 10/);
});
