import assert from "node:assert/strict";
import test from "node:test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

const source = buildSync({ stdin: { contents: `export * from './core/hack-configuration'; export * from './core/hacking-api'; export * from './core/minigame-runner';`,
  resolveDir: fileURLToPath(new URL("./", import.meta.url)), loader: "ts" }, bundle: true, write: false, format: "esm", platform: "node" }).outputFiles[0].text;
const apiModule = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

function setup() {
  const preferences = { defaultRollSource: "custom", defaultDieSides: 100, defaultRollDirection: "low", defaultDiceCount: 2,
    defaultKeepResult: "best", defaultStaticModifier: -3, defaultDc: 50, defaultLiveAudience: "gm" };
  const actor = { id: "hacker", name: "Hacker", system: { skills: { tec: { label: "Technology", total: 7 } } }, testUserPermission: () => true };
  globalThis.game = { user: { id: "player", character: actor }, users: [], actors: [actor], system: { id: "dnd5e", version: "5.3.3" },
    settings: { get: (_module, key) => preferences[key] }, i18n: { localize: value => value } };
  globalThis.ui = { notifications: { warn() {} } };
  globalThis.document = { createElement: () => ({ set textContent(value) { this.innerHTML = String(value); } }) };
  globalThis.ChatMessage = { getSpeaker: () => ({}) };
  let app;
  apiModule.registerMinigame({ id: "test-config", title: "Test", create: options => (app = { options, render() {}, async close() {} }) });
  const live = { starts: 0, ends: 0, start() { this.starts++; }, end() { this.ends++; }, cancel() {}, publish() {} };
  const api = apiModule.createHackingApi({ moduleId: "holosuite-hacking", createLiveController: () => live });
  return { preferences, actor, api, live, app: () => app };
}

test("attached configurations snapshot defaults and contain no actor, bonus, callbacks, or completion result", () => {
  const { preferences, api } = setup();
  const config = api.createHackConfiguration({ minigameType: "test-config", skillId: "tec", actorId: "gm", userId: "gm", skillModifier: 99,
    onSuccess() {}, systemOutcome: "critical_success", rollTotal: 99 });
  const frozen = structuredClone(config);
  Object.assign(preferences, { defaultRollSource: "sheet", defaultDieSides: 6, defaultRollDirection: "high", defaultStaticModifier: 99, defaultLiveAudience: "none" });
  assert.deepEqual(api.createHackConfiguration(config), frozen);
  for (const key of ["actorId", "userId", "skillModifier", "onSuccess", "systemOutcome", "rollTotal"]) assert.equal(key in config, false);
  assert.throws(() => api.createHackConfiguration({ ...config, version: 2 }), /Update/);
  assert.throws(() => api.createHackConfiguration({ version: 1 }), /incomplete/);
});

test("shared skill choices merge real portable skills without showing any character's modifier", () => {
  const { actor, api } = setup();
  game.actors.push({ ...actor, id: "other", system: { skills: { tec: { label: "Technology", total: 42 } } } });
  assert.deepEqual(api.getConfigurationSkills(), [{ id: "tec", name: "Technology", label: "Technology", modifier: 0 }]);
  game.system.id = "CoC7";
  game.actors = ["one", "two"].map(id => ({ items: [{ id, type: "skill", name: "Computer Use", system: { value: 65 }, flags: { CoC7: { cocidFlag: { id: "i.skill.computer-use" } } } }] }));
  assert.deepEqual(api.getConfigurationSkills(), [{ id: "i.skill.computer-use", name: "Computer Use", label: "Computer Use", modifier: 0 }]);
  game.actors = [];
  assert.deepEqual(api.getConfigurationSkills(), []);
});

test("attached custom checks preserve saved dice, read the current actor bonus, and require actual puzzle success", async () => {
  const { preferences, actor, api, app, live } = setup();
  const config = api.createHackConfiguration({ minigameType: "test-config", skillId: "tec" });
  actor.system.skills.tec.total = 9;
  Object.assign(preferences, { defaultDieSides: 6, defaultStaticModifier: 70, defaultRollSource: "system" });
  globalThis.Roll = class {
    constructor(formula) { assert.equal(formula, "2d100kl1 + 6"); this.total = 26; this.dice = [{ faces: 100, results: [{ result: 20 }] }]; }
    async evaluate() { return this; } async toMessage() {}
  };
  const result = api.runConfiguredHack(config, { actor, label: "Encrypted file" });
  for (let i = 0; i < 10 && !app(); i++) await Promise.resolve();
  assert.equal(app().options.rollTotal, 26);
  assert.equal(app().options.actorId, actor.id);
  assert.equal(app().options.dieSides, 100);
  assert.equal(app().options.rollDirection, "low");
  assert.equal(live.starts, 1);
  app().options.onSuccess();
  await app().close();
  assert.equal(await result, true);
});

test("attached native checks preserve system totals and cancellation never launches a puzzle", async () => {
  const { actor, api, app } = setup();
  const config = api.createHackConfiguration({ minigameType: "test-config", skillId: "tec", rollSource: "system", dc: 18 });
  actor.rollSkill = async () => null;
  assert.equal(await api.runConfiguredHack(config, { actor }), false);
  assert.equal(app(), undefined);
  actor.rollSkill = async (options) => {
    assert.deepEqual(options, { skill: "tec", target: 18 });
    return [{ total: 28, dice: [{ faces: 20, results: [{ result: 19 }] }] }];
  };
  const result = api.runConfiguredHack(config, { actor });
  for (let i = 0; i < 10 && !app(); i++) await Promise.resolve();
  assert.equal(app().options.rollTotal, 28);
  assert.equal(app().options.naturalRoll, 19);
  app().options.onFailure();
  assert.equal(await result, false);
});

test("all five attached Quick Hack outcomes skip rolls; closing does not unlock content", async () => {
  const { api, app } = setup();
  game.user.character = null; game.actors = [];
  globalThis.Roll = class { constructor() { assert.fail("Quick Hack must not roll"); } };
  for (const quickOutcome of ["critical_success", "strong_success", "success", "failure_but_playable", "critical_failure"]) {
    const result = api.runConfiguredHack(api.createHackConfiguration({ minigameType: "test-config", quickOutcome }));
    assert.equal(app().options.profile.profileId, quickOutcome);
    assert.equal(app().options.rollTotal, null);
    await app().close();
    assert.equal(await result, false);
  }
});

test("missing required skills, unowned actors, invalid configs and unavailable puzzles fail closed", async () => {
  const { api, actor } = setup();
  const config = api.createHackConfiguration({ minigameType: "test-config", skillId: "missing" });
  globalThis.Roll = class { constructor() { assert.fail("Invalid check must not roll"); } };
  assert.equal(await api.runConfiguredHack(config, { actor }), false);
  actor.testUserPermission = () => false; game.user.character = null;
  assert.equal(await api.runConfiguredHack({ ...config, skillId: "tec" }, { actor }), false);
  assert.equal(await api.runConfiguredHack({ ...config, version: 2 }), false);
  assert.equal(await api.runConfiguredHack({ ...config, minigameType: "missing-game" }), false);
});
