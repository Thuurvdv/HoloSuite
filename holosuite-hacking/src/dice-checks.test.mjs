import assert from "node:assert/strict";
import test from "node:test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

// Bundle the production modules together, retaining their shared registries.
globalThis.Application = class { render() {} async close() {} };
globalThis.foundry = { utils: { deepClone: structuredClone } };
const source = buildSync({
  stdin: {
    contents: `
      export * from "./holosuite-hacking/src/core/check-roll";
      export * from "./holosuite-hacking/src/core/difficulty";
      export * from "./holosuite-hacking/src/core/hacking-api";
      export * from "./holosuite-hacking/src/core/minigame-runner";
      export * from "./holosuite-hacking/src/ui/hacking-launcher-app";
      export * from "./holosuite-critical-cutin/src/settings";
      export * from "./holosuite-critical-cutin/src/roll-detector";
      export * from "./holosuite-critical-cutin/src/player-config-app";
      export * from "./shared/src/dice-checks";
    `,
    resolveDir: fileURLToPath(new URL("../../", import.meta.url)), loader: "ts"
  },
  bundle: true, write: false, format: "esm", platform: "node"
}).outputFiles[0].text;
const rules = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

test("dice choices include Foundry defaults, registered numbered dice, and previously saved custom dice", () => {
  globalThis.CONFIG = { Dice: { fulfillment: { dice: { d30: {}, d100: {}, dF: {}, d0: {}, d10001: {}, d6: {} } } } };
  const choices = rules.getDieOptions(7);
  assert.deepEqual(choices.map(die => die.value), [4, 6, 7, 8, 10, 12, 20, 30, 100]);
  assert.deepEqual(choices.filter(die => die.selected), [{ value: 7, label: "d7", selected: true }]);
  delete globalThis.CONFIG;
  assert.deepEqual(rules.getDieOptions().map(die => die.label), ["d4", "d6", "d8", "d10", "d12", "d20", "d100"]);
});

test("reset endpoints follow die and direction for both tabs", () => {
  assert.deepEqual(rules.getCriticalRollEndpoints(100, "high"), { success: 100, failure: 1 });
  assert.deepEqual(rules.getCriticalRollEndpoints(100, "low"), { success: 1, failure: 100 });
  assert.deepEqual(rules.getCriticalRollEndpoints(6, "high"), { success: 6, failure: 1 });
  assert.deepEqual(rules.getCriticalRollEndpoints(6, "low"), { success: 1, failure: 6 });
});

test("Cut-in reset confirmation explains both thresholds and defaults to cancel on Foundry V2", async () => {
  let prompt;
  globalThis.foundry.applications = { api: { DialogV2: { confirm: async options => { prompt = options; return false; } } } };
  assert.equal(await rules.confirmRollThresholdReset(100, "low", 3), false);
  assert.match(prompt.content, /all 3 listed players\/GM entries/);
  assert.match(prompt.content, /Success: <strong>1<\/strong>/);
  assert.match(prompt.content, /Failure: <strong>100<\/strong>/);
  assert.match(prompt.content, /stay unchanged/);
  assert.equal(prompt.no.default, true);
  assert.equal(prompt.rejectClose, false);
  globalThis.foundry.applications.api.DialogV2.confirm = async () => true;
  assert.equal(await rules.confirmRollThresholdReset(100, "high", 3), true);
  delete globalThis.foundry.applications;
});

test("Cut-in reset confirmation supports legacy dialogs and treats closing as cancellation", async () => {
  let prompt;
  globalThis.Dialog = { confirm: async options => { prompt = options; return null; } };
  assert.equal(await rules.confirmRollThresholdReset(6, "high", 2), false);
  assert.equal(prompt.defaultYes, false);
  assert.equal(prompt.rejectClose, false);
  delete globalThis.Dialog;
});

function setup(values = {}) {
  const store = new Map(Object.entries(values));
  globalThis.game = {
    user: { id: "gm", isGM: true },
    users: [], actors: [],
    settings: {
      get: (_module, key) => store.get(key),
      set: async (_module, key, value) => { store.set(key, value); return value; }
    }
  };
  globalThis.ui = { notifications: { warn() {}, error() {} } };
  return store;
}

test("existing d20 checks retain all five difficulty bands and natural overrides", () => {
  const id = (total, natural = null) => rules.getDifficultyProfile(total, 15, natural).id;
  assert.deepEqual([5, 14, 15, 20, 25].map(total => id(total)), [
    "critical_failure", "failure_but_playable", "success", "strong_success", "critical_success"
  ]);
  assert.equal(id(35, 1), "critical_failure");
  assert.equal(id(0, 20), "critical_success");
});

test("roll-under checks reverse every band, including equality and natural endpoints", () => {
  const id = (total, natural = null) => rules.getDifficultyProfile(total, 50, natural, { dieSides: 100, rollDirection: "low" }).id;
  assert.deepEqual([60, 51, 50, 45, 40].map(total => id(total)), [
    "critical_failure", "failure_but_playable", "success", "strong_success", "critical_success"
  ]);
  assert.equal(id(90, 1), "critical_success");
  assert.equal(id(10, 100), "critical_failure");
  assert.equal(id(50, 20), "success", "20 is not a natural critical on d100");
  assert.equal(rules.getDifficultyProfile(6, 6, 6, { dieSides: 6 }).id, "critical_success");
  assert.equal(rules.getDifficultyProfile(0, 0).id, "success");
});

test("saved rules drive the actual roll; discarded results and modifiers do not become natural rolls", async () => {
  setup({ defaultRollSource: "custom", defaultDieSides: 100, defaultRollDirection: "low" });
  let formula;
  globalThis.Roll = class {
    constructor(value) {
      formula = value;
      this.total = 46;
      this.dice = [{ faces: 100, results: [
        { result: 1, active: false }, { result: 100, discarded: true }, { result: 1, rerolled: true }, { result: 50 }
      ] }];
    }
    async evaluate() { return this; }
    async toMessage() {}
  };
  globalThis.ChatMessage = { getSpeaker: () => ({}) };
  const result = await rules.rollSkillCheck({ skillModifier: -4 });
  assert.equal(formula, "1d100 - 4");
  assert.equal(result.total, 46);
  assert.equal(result.naturalRoll, 50);
  assert.equal(result.dieSides, 100);
  assert.equal(result.rollDirection, "low");
  assert.deepEqual(rules.getRollOptions({ dieSides: 6, rollDirection: "high" }), { dieSides: 6, rollDirection: "high", rollSource: "custom", diceCount: 1, keepResult: "best", staticModifier: 0 });
  assert.deepEqual(rules.getRollOptions({ dieSides: "1d20+100", rollDirection: "bad" }), { dieSides: 20, rollDirection: "high", rollSource: "custom", diceCount: 1, keepResult: "best", staticModifier: 0 });
});

test("launcher remembers the last selection, including queued changes, for reopened launchers and integrations", async () => {
  setup();
  const form = (dieSides, rollDirection, rollSource, diceCount, keepResult, staticModifier) => ({ querySelector: selector => ({ value: { dieSides, rollDirection, rollSource, diceCount, keepResult, staticModifier }[selector.match(/name='(.*?)'/)[1]] }) });
  const launcher = new rules.HackingLauncherApp();
  const first = launcher.saveRollPreferences(form("6", "high"));
  const last = launcher.saveRollPreferences(form("100", "low", "system", "3", "worst", "-5"));
  await Promise.all([first, last]);
  const api = rules.createHackingApi({ moduleId: "holosuite-hacking" });
  const reopened = new rules.HackingLauncherApp({ api }).getData();
  assert.equal(reopened.dieSides, 100);
  assert.equal(reopened.lowRollsGood, true);
  assert.equal(reopened.staticModifier, -5);
  assert.deepEqual(api.getRollOptions(), { dieSides: 100, rollDirection: "low", rollSource: "system", diceCount: 3, keepResult: "worst", staticModifier: -5 });
});

test("API launches use saved defaults, preserve explicit per-challenge rules, and honor profile overrides", () => {
  setup({ defaultDieSides: 100, defaultRollDirection: "low" });
  rules.registerMinigame({ id: "test-rules", create: options => ({ ...options, render() {}, async close() {} }) });
  const api = rules.createHackingApi({ moduleId: "holosuite-hacking" });
  const low = api.startHack({ type: "test-rules", rollTotal: 45, dc: 50 });
  assert.equal(low.profile.id, "strong_success");
  const high = api.startHack({ type: "test-rules", rollTotal: 6, naturalRoll: 6, dc: 10, dieSides: 6, rollDirection: "high" });
  assert.equal(high.profile.id, "critical_success");
  assert.equal(high.dieSides, 6);
  assert.equal(api.getDifficultyProfile(100, 50, 100).id, "critical_failure");
  const custom = api.startHack({ type: "test-rules", profile: { id: "custom" } });
  assert.equal(custom.profile.id, "custom");
});

test("Cut-in automatic thresholds follow the die and direction; saved custom values still work", () => {
  const store = setup({ dieSides: 100, rollDirection: "low", threshold: 0, failureThreshold: 0 });
  assert.equal(rules.getThreshold(), 1);
  assert.equal(rules.getFailureThreshold(), 100);
  store.set("threshold", 5);
  store.set("failureThreshold", 96);
  assert.equal(rules.getThreshold(), 5);
  assert.equal(rules.getFailureThreshold(), 96);
  assert.equal(rules.resultQualifies(4, 5, "success"), true);
  assert.equal(rules.resultQualifies(95, 96, "failure"), false);
  store.set("rollDirection", "high");
  store.set("threshold", 0);
  store.set("failureThreshold", 0);
  assert.equal(rules.getThreshold(), 100);
  assert.equal(rules.getFailureThreshold(), 1);
});

test("Cut-in only detects the selected die, including nested rolls, and skips damage and inactive dice", () => {
  setup({ dieSides: 100, rollDirection: "low" });
  const die = (faces, results) => ({ faces, results });
  const message = { rolls: [{ terms: [{ rolls: [{ dice: [die(100, [
    { result: 1, discarded: true }, { result: 2, active: false }, { result: 3, rerolled: true }, { result: 4 }
  ])] }] }] }] };
  assert.equal(rules.messageHasQualifyingDie(message, 4), 4);
  assert.equal(rules.messageHasQualifyingDie(message, 3), null);
  assert.equal(rules.messageHasQualifyingDie({ rolls: [{ dice: [die(20, [{ result: 1 }])] }] }, 5), null);
  message.flags = { dnd5e: { roll: { type: "damage" } } };
  assert.equal(rules.messageHasQualifyingDie(message, 4), null);
  setup({ dieSides: 6, rollDirection: "high" });
  assert.equal(rules.messageHasQualifyingDie({ rolls: [{ dice: [die(6, [{ result: 6 }])] }] }, 6), 6);
});

test("Cut-in rendered fallback uses the selected die and reversed failure threshold", () => {
  setup({ dieSides: 100, rollDirection: "low" });
  globalThis.HTMLElement = class {};
  const root = new HTMLElement();
  root.querySelectorAll = selector => {
    assert.ok(selector.includes("d100"));
    return [
      { textContent: "100", classList: { contains: name => name === "discarded" } },
      { textContent: "97", classList: { contains: () => false } }
    ];
  };
  assert.equal(rules.renderedMessageHasQualifyingDie({}, root, 96, "failure"), 97);
  assert.equal(rules.renderedMessageHasQualifyingDie({}, root, 100, "failure"), null);
  assert.equal(rules.renderedMessageHasQualifyingDie({}, root, 5, "success"), null);
});
