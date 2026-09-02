import assert from "node:assert/strict";
import test from "node:test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

const source = buildSync({
  stdin: { contents: `export * from './core/check-roll'; export * from './core/actor-skills'; export * from './core/system-roll';`,
    resolveDir: fileURLToPath(new URL("./", import.meta.url)), loader: "ts" },
  bundle: true, write: false, format: "esm", platform: "node"
}).outputFiles[0].text;
const checks = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

function setup(system = { id: "dnd5e", version: "5.3.3" }, preferences = {}) {
  globalThis.game = { system, actors: [], settings: { get: (_module, key) => preferences[key] }, i18n: { localize: value => value } };
  globalThis.ui = { notifications: { warn() {} } };
  globalThis.CONFIG = {};
  globalThis.Roll = class { constructor() { throw new Error("Unexpected fallback roll"); } };
  globalThis.ChatMessage = { getSpeaker() { throw new Error("Unexpected duplicate chat message"); } };
}

const nativeRoll = () => ({ total: 29, dice: [{ faces: 20, results: [
  { result: 1, active: false, discarded: true }, { result: 19, active: true }
] }, { faces: 4, results: [{ result: 4 }] }] });

test("modern D&D skill checks keep the native total, dialog and active natural die without double proficiency", async () => {
  for (const version of ["4.1.0", "4.4.4", "5.3.3"]) {
    setup({ id: "dnd5e", version }, { defaultDieSides: 100, defaultStaticModifier: -20 });
    const roll = nativeRoll();
    const actor = { id: "hacker", system: { skills: { inv: { mod: 3, total: 6 } } },
      async rollSkill(...args) {
        assert.equal(this, actor);
        assert.deepEqual(args, [{ skill: "inv", target: 18 }, { configure: true }, { create: true, data: { flavor: "Encrypted file" } }]);
        return [roll];
      } };
    game.actors.push(actor);
    const result = await checks.rollSkillCheck({ actorId: "hacker", skillId: "inv", skillModifier: 6, dc: 18, flavor: "Encrypted file" });
    assert.equal(result.roll, roll);
    assert.equal(result.total, 29);
    assert.equal(result.naturalRoll, 19);
    assert.equal(result.dieSides, 20, "native checks ignore saved custom die sides");
    assert.equal(result.rollSource, "system");
  }
});

test("system rolls default only on supported systems and explicit saved choices win", () => {
  for (const id of ["dnd5e", "pf2e", "sf2e", "CoC7", "cyberpunk-red-core"]) {
    setup({ id });
    assert.equal(checks.getRollOptions().rollSource, "system");
    assert.equal(checks.getRollOptions({ rollSource: "custom" }).rollSource, "custom");
    setup({ id }, { defaultRollSource: "custom" });
    assert.equal(checks.getRollOptions().rollSource, "custom");
    assert.equal(checks.getRollOptions({ rollSource: "system" }).rollSource, "system");
  }
  setup({ id: "unknown-system" });
  assert.equal(checks.getRollOptions().rollSource, "sheet");
});

test("CoC7 detection survives V14 lifecycle metadata and id casing", () => {
  setup({ id: "coc7", version: "8.15" });
  assert.equal(checks.supportsSystemSkillRoll(), true);
  assert.equal(checks.getRollOptions().rollSource, "system");
  assert.equal(checks.getRollOptions().dieSides, 100);
  assert.equal(checks.getRollOptions().rollDirection, "low");

  game.system = {};
  game.world = { system: "CoC7" };
  assert.equal(checks.supportsSystemSkillRoll(), true);
  assert.equal(checks.getRollOptions().rollSource, "system");

  game.world = { system: { id: "CoC7" } };
  assert.equal(checks.supportsSystemSkillRoll(), true);
});

test("custom static modifiers add or subtract once without changing the natural die", async () => {
  setup(undefined, { defaultRollSource: "custom", defaultStaticModifier: -5 });
  const formulas = [], totals = [];
  const actor = { system: { skills: { inv: { mod: 3, total: 8 } } } };
  globalThis.ChatMessage = { getSpeaker: () => ({}) };
  globalThis.Roll = class {
    constructor(formula) {
      formulas.push(formula);
      const match = /([+-]) ([\d.]+)$/.exec(formula);
      this.total = 10 + Number(`${match[1]}${match[2]}`);
      this.dice = [{ faces: 20, results: [{ result: 1, discarded: true }, { result: 10 }] }];
    }
    async evaluate() { return this; }
    async toMessage() {}
  };
  for (const staticModifier of [undefined, 5, -12, 0, "-2.5"]) {
    const result = await checks.rollSkillCheck({ actor, skillId: "inv", diceCount: 2, staticModifier });
    totals.push(result.total);
    assert.equal(result.naturalRoll, 10);
  }
  assert.deepEqual(formulas, ["2d20kh1 + 3", "2d20kh1 + 13", "2d20kh1 - 4", "2d20kh1 + 8", "2d20kh1 + 5.5"]);
  assert.deepEqual(totals, [13, 23, 6, 18, 15.5]);
  const noActor = await checks.rollSkillCheck({ staticModifier: -4 });
  assert.equal(noActor.total, 6, "manual adjustment also works without detected skill data");
  assert.equal(checks.getRollOptions({ staticModifier: "" }).staticModifier, 0);
});

test("invalid static modifiers do not create a roll", async t => {
  setup(undefined, { defaultRollSource: "custom" });
  t.mock.method(console, "error", () => {});
  const warnings = [];
  ui.notifications.warn = message => warnings.push(message);
  for (const value of [NaN, Infinity, "1d4", "not a number"]) {
    assert.equal(await checks.rollSkillCheck({ staticModifier: value }), null);
  }
  assert.equal(warnings.length, 4);
  assert.ok(warnings.every(message => message.includes("static modifier")));
});

test("unreadable skills return no invented choices and provide actionable reporting guidance", () => {
  setup({ id: "CoC7" });
  const actor = { system: {}, items: [{ id: "computer-use", type: "ability", name: "Computer Use", system: { value: 65 } }] };
  assert.deepEqual(checks.getActorSkillOptions(actor), []);
  assert.deepEqual(checks.getActorSkillOptions(null), []);
  assert.deepEqual(checks.getActorSkillOptions({ system: { skills: {} } }), []);
  const warning = checks.getMissingSkillsWarning();
  for (const text of ["Custom dice roll", "Roll source", "Static modifier", "magetowerfoundry@gmail.com", "system name/version"]) {
    assert.ok(warning.includes(text));
  }
});

test("custom rolls without detected skills use only the supplied static modifier", async () => {
  setup({ id: "CoC7" }, { defaultRollSource: "custom", defaultStaticModifier: -4, defaultDieSides: 100, defaultRollDirection: "low" });
  const actor = { system: {}, items: [{ type: "skill", name: "Computer Use" }] };
  globalThis.ChatMessage = { getSpeaker: () => ({}) };
  globalThis.Roll = class {
    constructor(formula) {
      assert.equal(formula, "1d100 - 4");
      this.total = 46;
      this.dice = [{ faces: 100, results: [{ result: 50 }] }];
    }
    async evaluate() { return this; }
    async toMessage() {}
  };
  const result = await checks.rollSkillCheck({ actor, skillId: "" });
  assert.equal(result.total, 46);
  assert.equal(result.naturalRoll, 50);
});

test("older D&D uses the legacy skill signature and still opens its dialog", async () => {
  setup({ id: "dnd5e", version: "3.3.1" });
  const actor = { system: { skills: { inv: {} } }, async rollSkill(id, options) {
    assert.equal(id, "inv");
    assert.equal(options.targetValue, 15);
    assert.equal(options.fastForward, false);
    return nativeRoll();
  } };
  assert.equal((await checks.rollSkillCheck({ actor, skillId: "inv", rollSource: "system" })).total, 29);
});

test("native cancellation, malformed responses and errors never roll a fallback", async t => {
  setup();
  t.mock.method(console, "error", () => {});
  const warnings = [];
  ui.notifications.warn = message => warnings.push(message);
  const actor = { system: { skills: { inv: {} } } };
  for (const cancelled of [null, undefined, false, []]) {
    actor.rollSkill = async () => cancelled;
    assert.equal(await checks.rollSkillCheck({ actor, skillId: "inv", rollSource: "system" }), null);
  }
  assert.deepEqual(warnings, [], "cancelling is not an error");
  for (const bad of [{ total: null }, { total: NaN }, { total: "20" }, { total: Infinity }]) {
    actor.rollSkill = async () => bad;
    assert.equal(await checks.rollSkillCheck({ actor, skillId: "inv", rollSource: "system" }), null);
  }
  actor.rollSkill = async () => { throw new Error("System roll failed"); };
  assert.equal(await checks.rollSkillCheck({ actor, skillId: "inv", rollSource: "system" }), null);
  assert.match(warnings.at(-1), /System roll failed/);
  assert.equal(await checks.rollSkillCheck({ actor, skillId: "missing", rollSource: "system" }), null);
  assert.match(warnings.at(-1), /selected system skill/);
  game.system.id = "unknown";
  assert.equal(checks.supportsSystemSkillRoll(), false);
  assert.equal(await checks.rollSkillCheck({ actor, skillId: "inv", rollSource: "system" }), null);
  assert.match(warnings.at(-1), /Custom dice roll/);
});

test("PF2e skills use their native statistic, check modifiers and dialog", async () => {
  setup({ id: "pf2e", version: "6.6.2" });
  const skill = { label: "Thievery", mod: 5, check: { mod: 8, async roll(options) {
    assert.equal(this, skill.check);
    assert.deepEqual(options, { dc: { value: 20 }, skipDialog: false, createMessage: true });
    return nativeRoll();
  } } };
  const actor = { skills: { thievery: skill }, getStatistic: id => actor.skills[id] };
  const result = await checks.rollSkillCheck({ actor, skillId: "Thievery", dc: 20, rollSource: "system" });
  assert.equal(result.total, 29);
  assert.equal(checks.getActorSkillOptions(actor)[0].modifier, 8);
});

test("Starfinder 2e reads its own Computers statistic and uses the shared native check contract", async () => {
  setup({ id: "sf2e", version: "1.0.0" });
  let calls = 0;
  const computers = { label: "Computers", check: { mod: 12, async roll(options) {
    calls++;
    assert.deepEqual(options, { dc: { value: 22 }, skipDialog: false, createMessage: true });
    return calls === 1 ? nativeRoll() : null;
  } } };
  const actor = { skills: { computers }, system: { skills: { thievery: { mod: 99 } } }, getStatistic: id => actor.skills[id] };
  assert.deepEqual(checks.getActorSkillOptions(actor).map(s => [s.id, s.modifier]), [["computers", 12]]);
  const result = await checks.rollSkillCheck({ actor, skillId: "Computers", dc: 22 });
  assert.equal(result.total, 29); assert.equal(result.dieSides, 20); assert.equal(result.rollSource, "system");
  assert.equal(await checks.rollSkillCheck({ actor, skillId: "computers", dc: 22 }), null);
});

test("custom dice keep best/worst follows positive direction and bounds dice count", () => {
  setup();
  for (const [rollDirection, keepResult, term] of [
    ["high", "best", "kh1"], ["high", "worst", "kl1"], ["low", "best", "kl1"], ["low", "worst", "kh1"]
  ]) assert.equal(checks.getCustomRollFormula({ diceCount: 3, dieSides: 100, rollDirection, keepResult }, -2), `3d100${term} - 2`);
  for (const value of [0, -2, 11, 1.5, "2d20", Infinity, undefined]) {
    assert.equal(checks.getCustomRollFormula({ diceCount: value }, 0), "1d20 + 0");
  }
});

test("custom checks refresh complete static modifiers and only inspect the kept die", async () => {
  setup();
  const actor = { system: { skills: { inv: { mod: 3, total: 8, value: 1 } } } };
  const sent = [];
  globalThis.ChatMessage = { getSpeaker: options => options };
  globalThis.Roll = class {
    constructor(formula) {
      assert.equal(formula, "2d20kl1 + 8");
      this.total = 18;
      this.dice = [{ faces: 20, results: [{ result: 20, discarded: true }, { result: 10 }] }];
    }
    async evaluate() { return this; }
    async toMessage(data) { sent.push(data); }
  };
  const result = await checks.rollSkillCheck({ actor, skillId: "inv", skillModifier: 3, rollSource: "custom", diceCount: 2, keepResult: "worst" });
  assert.equal(result.total, 18);
  assert.equal(result.naturalRoll, 10);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].speaker.actor, actor);
});

test("skill extraction prefers complete totals and never mistakes null for zero", () => {
  const preferences = {};
  setup(undefined, preferences);
  assert.equal(checks.getSkillModifier({ mod: 3, total: 9, prof: 6 }), 9);
  assert.equal(checks.getSkillModifier({ mod: null, total: { value: 0 }, bonus: 2 }), 0);
  assert.equal(checks.getSkillModifier({ mod: false, total: "", modifier: 7 }), 7);
  CONFIG.DND5E = { skills: { tec: { label: "Technology" } } };
  const actor = { system: { skills: { tec: { total: 7 } } } };
  assert.deepEqual(checks.getActorSkillOptions(actor), [{ id: "tec", name: "Technology", label: "Technology", modifier: 7 }]);
  preferences.showSkillModifiers = true;
  assert.deepEqual(checks.getActorSkillOptions(actor), [{ id: "tec", name: "Technology", label: "Technology (+7)", modifier: 7 }]);
  actor.system.skills.tec.total = -2;
  assert.equal(checks.getActorSkillOptions(actor)[0].label, "Technology (-2)");
  preferences.showSkillModifiers = false;
  assert.deepEqual(checks.getActorSkillOptions(actor), [{ id: "tec", name: "Technology", label: "Technology", modifier: -2 }]);
  assert.equal(checks.resolveSkillId(actor, "Technology"), "tec");
  assert.equal(checks.resolveSkillId(actor, "TEC"), "tec");
});

test("GM dispatch and player acceptance preserve native rules, actor and final total; cancellation launches nothing", async t => {
  const preferences = { defaultDieSides: 100, defaultDiceCount: 3, defaultKeepResult: "worst", defaultStaticModifier: -5 };
  setup(undefined, preferences);
  const hooks = new Map(), messages = [], launches = [];
  let receive, prompt, calls = 0, cancelled = false;
  globalThis.Application = class {};
  globalThis.FormApplication = Application;
  globalThis.foundry = { utils: { randomID: () => "request", deepClone: structuredClone } };
  globalThis.Hooks = { once: (name, callback) => hooks.set(name, callback) };
  globalThis.window = { setTimeout() {} };
  globalThis.Dialog = class { constructor(data) { prompt = data; } render() { return this; } };
  globalThis.document = { createElement: () => ({ set textContent(value) { this.innerHTML = String(value); } }) };
  globalThis.canvas = { tokens: { controlled: [] } };
  const actor = { id: "hacker", name: "Hacker", system: { skills: { inv: { mod: 3, total: 7 } } },
    async rollSkill(config) { calls++; assert.equal(this, actor); assert.equal(config.skill, "inv"); return cancelled ? null : [nativeRoll()]; } };
  const gm = { id: "gm", isGM: true, name: "GM" }, player = { id: "player", name: "Player", character: actor };
  game.user = gm;
  game.users = [gm, player];
  game.actors = [actor];
  game.modules = new Map([["holosuite-hacking", {}]]);
  const registered = new Map();
  game.settings.register = (_module, key, config) => registered.set(key, config);
  game.settings.registerMenu = () => {};
  game.socket = { on: (_name, callback) => { receive = callback; }, emit: (_name, message) => messages.push(message) };
  t.mock.method(console, "log", () => {});
  const initSource = buildSync({ entryPoints: [fileURLToPath(new URL("./init.ts", import.meta.url))],
    bundle: true, write: false, format: "esm", platform: "node" }).outputFiles[0].text;
  await import(`data:text/javascript;base64,${Buffer.from(initSource).toString("base64")}`);
  hooks.get("init")();
  assert.equal(registered.get("defaultRollSource").default, "system");
  assert.equal(registered.get("defaultStaticModifier").default, 0);
  assert.equal(registered.get("showSkillModifiers").default, false);
  assert.equal(registered.get("showSkillModifiers").scope, "world");
  assert.equal(registered.get("showSkillModifiers").config, true);
  hooks.get("ready")();
  const api = game.holosuiteHacking;
  api.startHack = options => { launches.push(options); return {}; };
  assert.equal(api.sendHackToPlayer({ actorId: actor.id, userId: player.id, skillId: "inv", dc: 18, liveAudience: "none" }), true);
  const request = messages.at(-1);
  assert.equal(request.payload.rollSource, "system");
  assert.equal(request.payload.diceCount, 3);
  assert.equal(request.payload.keepResult, "worst");
  assert.equal(request.payload.skillModifier, 7);
  assert.equal(request.payload.staticModifier, -5);
  preferences.defaultRollSource = "custom";
  preferences.defaultDieSides = 6;
  game.user = player;
  receive(request);
  assert.match(prompt.content, /<div>Difficulty: 18<\/div>/);
  assert.doesNotMatch(prompt.content, /System skill roll|Check:|rolls are positive/);
  assert.equal(prompt.buttons.start.label, "Accept and roll");
  await prompt.buttons.start.callback();
  assert.equal(calls, 1);
  assert.equal(launches[0].rollTotal, 29);
  assert.equal(launches[0].naturalRoll, 19);
  assert.equal(launches[0].dieSides, 20);
  assert.equal(launches[0].rollSource, "system");
  assert.equal(launches[0].staticModifier, -5);
  assert.equal(launches[0].actorId, "hacker");
  cancelled = true;
  receive(request);
  await prompt.buttons.start.callback();
  assert.equal(calls, 2);
  assert.equal(launches.length, 1);
  game.system = { id: "CoC7", version: "8.15" };
  actor.items = [{ id: "computer", type: "skill", name: "Computer Use", system: { value: 65 } }];
  actor.runRoll = async options => {
    assert.equal(options.skillId, "computer");
    return { result: 55, successLevel: 1, passed: true, isCritical: false, isFumble: false };
  };
  game.user = gm;
  api.sendHackToPlayer({ actorId: actor.id, userId: player.id, skillId: "Computer Use", rollSource: "system", dc: 15, liveAudience: "none" });
  game.user = player;
  receive(messages.at(-1));
  assert.match(prompt.content, /<div>Difficulty: Set when rolling<\/div>/);
  assert.doesNotMatch(prompt.content, /CoC7|vs DC|Difficulty: 15/);
  await prompt.buttons.start.callback();
  assert.equal(launches[1].rollTotal, 55);
  assert.equal(launches[1].dieSides, 100);
  assert.equal(launches[1].rollDirection, "low");
  assert.equal(launches[1].systemOutcome, "success");
  // Quick Hack carries the GM's outcome without reading skills or rolling again,
  // even if the normal roll configuration is incomplete or invalid.
  game.system = { id: "unknown-system" };
  preferences.defaultStaticModifier = "invalid";
  actor.rollSkill = actor.runRoll = () => assert.fail("Quick Hack must not roll");
  const beforeQuick = launches.length;
  for (const quickOutcome of ["critical_success", "strong_success", "success", "failure_but_playable", "critical_failure"]) {
    game.user = gm;
    assert.equal(api.sendHackToPlayer({ actorId: actor.id, userId: player.id, quickOutcome, liveAudience: "none" }), true);
    const quickRequest = messages.at(-1);
    assert.equal(quickRequest.payload.quickOutcome, quickOutcome);
    game.user = player;
    receive(quickRequest);
    assert.equal(prompt.buttons.start.label, "HACK");
    const label = { critical_success: "Critical Success", strong_success: "Strong Success", success: "Success", failure_but_playable: "Failure", critical_failure: "Critical Failure" }[quickOutcome];
    assert.ok(prompt.content.includes(`<div>Result: ${label}</div>`));
    assert.doesNotMatch(prompt.content, /Difficulty:|roll|GM-selected|No roll needed/);
    await prompt.buttons.start.callback();
    assert.equal(launches.at(-1).quickOutcome, quickOutcome);
    assert.equal(launches.at(-1).rollTotal, null);
    assert.equal(launches.at(-1).dc, null);
    assert.equal(launches.at(-1).rollSource, "gm");
  }
  assert.equal(launches.length, beforeQuick + 5);
  assert.equal(api.sendHackToPlayer({ userId: player.id, quickOutcome: "success" }), false, "Players cannot dispatch Quick Hacks");
  game.user = gm;
  assert.equal(api.sendHackToPlayer({ quickOutcome: "success" }), false, "Quick Hack requires a selected player");
  player.active = false;
  assert.equal(api.sendHackToPlayer({ userId: player.id, quickOutcome: "success" }), false);
  assert.throws(() => api.sendHackToPlayer({ userId: player.id, quickOutcome: "not-an-outcome" }), /valid Quick Hack/);
});
