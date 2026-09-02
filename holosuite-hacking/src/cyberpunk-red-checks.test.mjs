import assert from "node:assert/strict";
import test from "node:test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

const source = buildSync({ stdin: { contents: `export * from './core/cyberpunk-red-roll'; export * from './core/actor-skills';`,
  resolveDir: fileURLToPath(new URL('./', import.meta.url)), loader: 'ts' }, bundle: true, write: false, format: 'esm', platform: 'node' }).outputFiles[0].text;
const { rollCyberpunkRedSkill, getActorSkillOptions, getSkillData, resolveSkillId } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test("RED skill pipeline preserves the native final total, dialog, critical adjustment, Luck and card", async () => {
  globalThis.game = { user: { id: 'player' }, system: { id: 'cyberpunk-red-core' } };
  const events = [];
  const actor = { id: 'actor', ownership: { player: 3 }, system: { stats: { luck: { value: 5 } } },
    async update(data) { events.push(['luck', data]); } };
  const roll = { initialRoll: 1, luck: 3, resultTotal: 0,
    async handleRollDialog(event, receivedActor, receivedSkill) { assert.equal(event.type, 'macro'); assert.equal(event.ctrlKey, false); assert.equal(receivedActor, actor); assert.equal(receivedSkill, skill); events.push('dialog'); return true; },
    async roll() { events.push('roll'); this.resultTotal = 18; }
  };
  const skill = { id: 'skill', name: 'Electronics/Security Tech', type: 'skill', system: {},
    createRoll(type, owner) { assert.equal(type, 'skill'); assert.equal(owner, actor); events.push('create'); return roll; },
    async confirmRoll(value) { assert.equal(value, roll); events.push('confirm'); return roll; } };
  actor.items = [skill];
  const load = async () => ({ RenderRollCard: async value => { assert.equal(value, roll); events.push('chat'); } });
  const result = await rollCyberpunkRedSkill(actor, skill.id, 15, load);
  assert.equal(result.total, 18); assert.equal(result.systemOutcome, 'success', 'a natural 1 is not an automatic failure');
  assert.deepEqual(roll.entityData, { actor: 'actor', token: null, item: 'skill' });
  assert.deepEqual(events, ['create', 'dialog', 'confirm', 'roll', ['luck', { 'system.stats.luck.value': 2 }], 'chat']);
  events.length = 0;
  assert.equal((await rollCyberpunkRedSkill(actor, skill.id, 18, load)).systemOutcome, 'failure_but_playable', 'RED requires beating the DV');
  roll.handleRollDialog = async () => false; events.length = 0;
  assert.equal(await rollCyberpunkRedSkill(actor, skill.id, 15, load), null);
  assert.deepEqual(events, ['create'], 'cancel never rolls, spends Luck or posts chat');
  await assert.rejects(() => rollCyberpunkRedSkill({ ...actor, ownership: {} }, skill.id, 15, load), /own/);
});

test("RED uses live owned skill Items even when actor data contains skill summaries", async () => {
  globalThis.game = { user: { id: 'player' }, system: { id: 'cyberpunk-red-core' }, settings: { get: () => false } };
  const roll = { resultTotal: 17, luck: 0, handleRollDialog: async () => true, roll: async () => {} };
  const skill = { id: 'owned-skill', uuid: 'Actor.hacker.Item.owned-skill', name: 'Electronics/Security Tech', type: 'skill',
    system: { level: 0 }, createRoll() { assert.equal(this, skill); return roll; }, confirmRoll: async value => value };
  const actor = { id: 'hacker', ownership: { player: 3 }, items: { contents: [skill], get: id => id === skill.id ? skill : undefined },
    system: { skills: { electronics: { name: skill.name, total: 7 } } } };
  assert.deepEqual(getActorSkillOptions(actor).map(option => option.id), [skill.name]);
  for (const id of [skill.id, skill.uuid, skill.name, 'electronics']) {
    assert.equal(resolveSkillId(actor, id), skill.id);
    assert.equal(getSkillData(actor, id), skill);
    assert.equal((await rollCyberpunkRedSkill(actor, id, 15, async () => ({ RenderRollCard() {} }))).total, 17);
  }
  const noItems = { ...actor, items: { contents: [] } };
  assert.deepEqual(getActorSkillOptions(noItems), [], 'summaries without real skills are not advertised as rollable');
  await assert.rejects(() => rollCyberpunkRedSkill(noItems, 'electronics', 15), /skill is missing/);
  await assert.rejects(() => rollCyberpunkRedSkill({ ...actor, items: [{ ...skill, createRoll: undefined }] }, skill.id, 15), /system version/);
});
