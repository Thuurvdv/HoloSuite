import assert from "node:assert/strict";
import test from "node:test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

const source = buildSync({
  stdin: { contents: `export * from './core/check-roll'; export * from './core/actor-skills'; export * from './core/hacking-api'; export {registerMinigame} from './core/minigame-runner';`,
    resolveDir: fileURLToPath(new URL("./", import.meta.url)), loader: "ts" },
  bundle: true, write: false, format: "esm", platform: "node"
}).outputFiles[0].text;
const checks = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

function setup(version = "8.15", preferences = {}) {
  globalThis.game = { system: { id: "CoC7", version }, actors: [],
    settings: { get: (_module, key) => preferences[key] }, i18n: { localize: value => value } };
  globalThis.ui = { notifications: { warn() {} } };
  globalThis.CONFIG = {};
  globalThis.Roll = class { constructor() { throw new Error("Unexpected fallback roll"); } };
  globalThis.ChatMessage = { getSpeaker() { throw new Error("Unexpected duplicate chat message"); } };
}

function skill(id = "computer-1", value = 65) {
  return { id, uuid: `Actor.investigator.Item.${id}`, type: "skill", name: "Computer Use",
    flags: { CoC7: { cocidFlag: { id: "i.skill.computer-use" } } }, system: { value } };
}

test("CoC7 reads computed percentages from owned skill Items and keeps portable keys", () => {
  const preferences = {};
  setup(undefined, preferences);
  let value = 65;
  const computer = skill();
  Object.defineProperty(computer.system, "value", { get: () => value });
  const actor = { system: { skills: { stale: { value: 5 } } }, items: { contents: [computer,
    { id: "weapon", type: "weapon", name: "Handgun", system: { value: 90 } }] } };
  assert.deepEqual(checks.getActorSkillOptions(actor), [{ id: "i.skill.computer-use", name: "Computer Use", label: "Computer Use", modifier: 0 }]);
  preferences.showSkillModifiers = true;
  assert.deepEqual(checks.getActorSkillOptions(actor), [{ id: "i.skill.computer-use", name: "Computer Use", label: "Computer Use (65%)", modifier: 0 }]);
  for (const key of [computer.id, computer.uuid, "Computer Use", "computer use", "i.skill.computer-use"]) {
    assert.equal(checks.getSkillData(actor, key), computer);
  }
  value = 0;
  assert.equal(checks.getActorSkillOptions(actor)[0].label, "Computer Use (0%)");
  const other = skill("computer-2", 40);
  assert.equal(checks.getSkillData({ items: [other] }, checks.getActorSkillOptions(actor)[0].id), other);
});

test("CoC7 skill behavior uses normalized active-system detection", () => {
  setup();
  game.system.id = "coc7";
  const computer = skill();
  assert.equal(checks.getCoC7SkillValue(computer), 65);
  assert.equal(checks.getActorSkillOptions({ items: [computer] })[0].id, "i.skill.computer-use");
});

test("CoC7 7.x uses Item.value rather than the stored base value", () => {
  setup("7.22", { showSkillModifiers: true });
  const computer = skill();
  computer.system.value = 5;
  Object.defineProperty(computer, "value", { get: () => 75 });
  assert.equal(checks.getActorSkillOptions({ items: [computer] })[0].label, "Computer Use (75%)");
  assert.equal(checks.getSkillModifier(computer), 0);
});

test("generic skill Items are discoverable without inventing numeric bonuses or native support", () => {
  setup(); game.system.id = "other-system";
  const computer = skill();
  const actor = { system: { skills: {} }, items: new Map([[computer.id, computer]]) };
  assert.deepEqual(checks.getActorSkillOptions(actor), [{ id: "Computer Use", name: "Computer Use", label: "Computer Use", modifier: 0 }]);
  assert.equal(checks.getRollOptions().rollSource, "sheet");
  assert.deepEqual(checks.getActorSkillOptions({ items: [{ id: "perk", type: "talent", name: "Hacker", system: {} }] }), []);
  actor.system.skills = { inv: { label: "Investigation", total: 7 } };
  assert.equal(checks.getActorSkillOptions(actor)[0].id, "inv");
  const duplicate = { ...computer, id: "duplicate" };
  assert.deepEqual(checks.getActorSkillOptions({ items: [computer, duplicate] }).map(s => s.id), [computer.id, "duplicate"]);
  assert.equal(checks.getSkillData({ items: [computer, duplicate] }, "Computer Use"), null);
});

test("native CoC7 honors its final percentile result and success degree, independent of saved d20/DC rules", async () => {
  const cases = [
    [1, 4, true, "critical_success"], [9, 3, true, "critical_success"],
    [24, 2, true, "strong_success"], [51, 1, true, "success"],
    [75, 0, false, "failure_but_playable"], [96, -99, false, "critical_failure"],
    [24, 2, false, "failure_but_playable"] // A hard success still fails an extreme check.
  ];
  for (const version of ["7.22", "8.15"]) {
    setup(version, { defaultDieSides: 20, defaultRollDirection: "high", defaultStaticModifier: 99 });
    const computer = skill();
    for (const [total, successLevel, passed, outcome] of cases) {
      const actor = { items: [computer], async runRoll(options) {
        assert.equal(this, actor);
        assert.deepEqual(options, { skillId: computer.id, fastForward: false, chatMessage: true,
          preventStandby: true, forcedCardType: true, cardTypeFixed: true });
        // v8.15 exposes these two flags as false even for criticals and fumbles.
        return { result: total, successLevel, passed, isCritical: false, isFumble: false };
      } };
      const result = await checks.rollSkillCheck({ actor, skillId: "i.skill.computer-use", dc: 999 });
      assert.equal(result.total, total);
      assert.equal(result.naturalRoll, null);
      assert.equal(result.dieSides, 100);
      assert.equal(result.rollDirection, "low");
      assert.equal(result.systemOutcome, outcome);
      const api = checks.createHackingApi({ moduleId: "holosuite-hacking" });
      assert.equal(api.getDifficultyProfile(total, 999, null, result).profileId, outcome);
      checks.registerMinigame({ id: "profile-test", create: options => ({ options, close() {}, render() {} }) });
      const app = api.startHack({ ...result, type: "profile-test", rollTotal: total, dc: 999 });
      assert.equal(app.options.profile.profileId, outcome);
      assert.notEqual(api.getDifficultyProfile(1, 999, null, { rollSource: "custom", rollDirection: "high", systemOutcome: "critical_success" }).profileId, "critical_success");
    }
  }
});

test("CoC7 cancellation, missing skills, unsupported APIs and invalid native results never reroll", async t => {
  setup(); t.mock.method(console, "error", () => {});
  const computer = skill();
  for (const response of [null, false, undefined, {}, { result: NaN }, { result: 20, successLevel: 2 }]) {
    const actor = { items: [computer], runRoll: async () => response };
    assert.equal(await checks.rollSkillCheck({ actor, skillId: computer.id }), null);
  }
  assert.equal(await checks.rollSkillCheck({ actor: { items: [computer] }, skillId: computer.id }), null);
  const actor = { items: [computer], runRoll: async () => { throw new Error("Dialog closed"); } };
  assert.equal(await checks.rollSkillCheck({ actor, skillId: computer.id }), null);
  actor.runRoll = () => { assert.fail("Must not roll a missing skill"); };
  assert.equal(await checks.rollSkillCheck({ actor, skillId: "unavailable" }), null);
});

test("Custom CoC7 uses only the GM's static modifier, never adds the skill percentage", async () => {
  setup();
  assert.equal(checks.getRollOptions().dieSides, 100);
  assert.equal(checks.getRollOptions().rollDirection, "low");
  globalThis.ChatMessage = { getSpeaker: () => ({}) };
  globalThis.Roll = class {
    constructor(formula) { assert.equal(formula, "1d100 - 5"); this.total = 37; this.dice = [{ faces: 100, results: [{ result: 42 }] }]; }
    async evaluate() { return this; }
    async toMessage() {}
  };
  const result = await checks.rollSkillCheck({ actor: { items: [skill()] }, skillId: "Computer Use", skillModifier: 65, staticModifier: -5, rollSource: "custom" });
  assert.equal(result.total, 37);
  assert.equal(result.naturalRoll, 42);
});
