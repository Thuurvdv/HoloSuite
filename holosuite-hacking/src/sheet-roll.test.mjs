import assert from "node:assert/strict";
import test from "node:test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

const source = buildSync({ stdin: { contents: `export * from './core/sheet-roll'; export * from './core/check-roll'; export * from './core/difficulty';`,
  resolveDir: fileURLToPath(new URL("./", import.meta.url)), loader: "ts" }, bundle: true, write: false, format: "esm", platform: "node" }).outputFiles[0].text;
const checks = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

function setup() {
  globalThis.game = { user: { id: "player" }, system: { id: "cyberpunk-red-core" }, actors: [],
    settings: { get: (_module, key) => ({ defaultRollSource: "sheet", defaultStaticModifier: 99 })[key] }, i18n: { localize: value => value } };
  globalThis.ui = { notifications: { warn() {} } };
  const listeners = new Map();
  globalThis.Hooks = {
    on(name, handler) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(handler); },
    off(name, handler) { listeners.get(name)?.delete(handler); }
  };
  return { emit: (name, ...args) => { for (const fn of listeners.get(name) ?? []) fn(...args); }, count: () => [...listeners.values()].reduce((n, set) => n + set.size, 0) };
}
const actor = { id: "hacker", name: "Hacker", ownership: { player: 3 }, system: {} };
const message = (overrides = {}) => ({ id: "roll", author: { id: "player" }, visible: true, isContentVisible: true,
  speaker: { actor: actor.id }, flavor: "Interface", rolls: [{ total: 18, formula: "1d10 + 8", _evaluated: true }], ...overrides });

test("sheet capture filters other users, actors, hidden content, blind rolls and unevaluated dice", () => {
  setup();
  assert.equal(checks.getSheetRollCandidates(message(), actor)[0].total, 18);
  for (const data of [{ author: { id: "someone-else" } }, { speaker: { actor: "other" } }, { visible: false },
    { isContentVisible: false }, { blind: true }, { rolls: [{ total: 99, _evaluated: false }] },
    { rolls: [{ total: NaN }] }, { rolls: [{ total: "18" }] }]) {
    assert.deepEqual(checks.getSheetRollCandidates(message(data), actor), []);
  }
  const tokenActor = { ...actor, isToken: true, token: { id: "token", parent: { id: "scene" } } };
  assert.deepEqual(checks.getSheetRollCandidates(message({ speaker: { actor: actor.id, token: "other" } }), tokenActor), []);
  assert.deepEqual(checks.getSheetRollCandidates(message({ speaker: { actor: actor.id, token: "token", scene: "other" } }), tokenActor), []);
  assert.match(checks.getSheetRollCandidates(message({ speaker: {} }), actor)[0].label, /actor not specified/);
  assert.equal(checks.getSheetRollCandidates(message({ author: undefined, user: "player" }), actor).length, 1);
});

test("capture lists multiple totals individually and does not guess totals from unknown cards", () => {
  setup();
  game.system.id = 'unknown-system';
  const candidates = checks.getSheetRollCandidates(message({ rolls: [{ total: 12 }, { total: 6 }] }), actor);
  assert.deepEqual(candidates.map(c => [c.id, c.total]), [["roll:0", 12], ["roll:1", 6]]);
  assert.deepEqual(checks.getSheetRollCandidates(message({ rolls: [], content: '<div class="dice-total">99</div>' }), actor), []);
});

test("capture watches only new messages, refreshes updates, removes deleted or hidden rolls, and cleans up", () => {
  const hooks = setup(); let choices = [];
  const watcher = checks.watchSheetRolls(actor, value => { choices = value; });
  assert.equal(hooks.count(), 3);
  hooks.emit("updateChatMessage", message()); assert.deepEqual(choices, []);
  hooks.emit("createChatMessage", message()); assert.equal(choices[0].total, 18);
  hooks.emit("updateChatMessage", message({ rolls: [{ total: 23 }] })); assert.equal(choices[0].total, 23);
  hooks.emit("updateChatMessage", message({ isContentVisible: false })); assert.deepEqual(choices, []);
  hooks.emit("updateChatMessage", message()); assert.equal(choices.length, 1);
  hooks.emit("deleteChatMessage", message()); assert.deepEqual(choices, []);
  for (let i = 0; i < 55; i++) hooks.emit("createChatMessage", message({ id: `roll-${i}` }));
  assert.equal(watcher.candidates().length, 50);
  watcher.dispose(); assert.equal(hooks.count(), 0); assert.deepEqual(watcher.candidates(), []);
  hooks.emit("createChatMessage", message()); assert.deepEqual(watcher.candidates(), []);
});

test("chat selection keeps the final total unchanged and leaves difficulty to the GM's DC", () => {
  setup();
  const candidate = checks.getSheetRollCandidates(message(), actor)[0];
  const captured = checks.confirmSheetRoll("999", candidate);
  assert.equal(captured.total, 18); assert.equal(captured.naturalRoll, null); assert.equal(captured.sheetMessageId, "roll");
  assert.equal(checks.getDifficultyProfile(18, 15, captured.naturalRoll, { rollSource: "sheet" }).profileId, "success");
  assert.equal(captured.systemOutcome, undefined);
  assert.equal(checks.confirmSheetRoll("0").total, 0);
  assert.equal(checks.confirmSheetRoll("-2").total, -2);
  for (const total of ["", " ", null, undefined, false, "NaN", Infinity]) assert.throws(() => checks.confirmSheetRoll(total));
});

test("sheet source opens the sheet without a dialog and cancellation removes the notice and hooks", async t => {
  const hooks = setup(); let notice, opened = 0;
  const fields = new Map();
  const field = selector => {
    if (!fields.has(selector)) fields.set(selector, { addEventListener(event, callback) { this[event] = callback; } });
    return fields.get(selector);
  };
  globalThis.document = { body: { appendChild: node => { notice = node; } }, createElement: () => ({
    set textContent(value) { this.innerHTML = String(value); }, setAttribute() {}, querySelector: field,
    remove() { this.removed = true; }
  }) };
  globalThis.Dialog = class { constructor() { assert.fail("No capture dialog should open"); } };
  actor.sheet = { render: () => { opened++; } };
  globalThis.Roll = class { constructor() { assert.fail("Must not roll again"); } };
  globalThis.ChatMessage = { create() { assert.fail("Must not post duplicate chat"); } };
  t.mock.method(console, "error", () => {});
  assert.equal(checks.getRollOptions().rollSource, "sheet");
  const pending = checks.rollSkillCheck({ actor, skillId: "", dc: 15 });
  assert.equal(hooks.count(), 4);
  assert.equal(opened, 1);
  assert.match(notice.innerHTML, /requested skill/);
  assert.doesNotMatch(notice.innerHTML, /sheetCandidate|sheetOutcome/);
  assert.equal(await checks.rollSkillCheck({ actor }), null, "A second capture cannot consume the same roll");
  notice.querySelector('[data-cancel-sheet]').click(); assert.equal(await pending, null); assert.equal(hooks.count(), 0);
  assert.equal(notice.removed, true);
  const next = checks.rollSkillCheck({ actor }); notice.querySelector('[data-cancel-sheet]').click();
  assert.equal(await next, null); assert.equal(hooks.count(), 0);
  assert.equal(await checks.rollSkillCheck({ actor: { ...actor, ownership: {} } }), null);
  assert.equal(await checks.rollSkillCheck({}), null);
  assert.equal(hooks.count(), 0);
});
