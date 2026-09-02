import { getNaturalDieResult, normalizeDieSides, normalizeRollDirection } from "../../../shared/src/dice-checks";
import { getActorById, getSkillData, getSkillModifier, resolveSkillId } from "./actor-skills";
import { rollSystemSkill, supportsSystemSkillRoll } from "./system-roll";
import { rollFromCharacterSheet } from "./sheet-roll";
import { isActiveSystem, isCoC7System } from "./system-id";

declare const game: any;
declare const Roll: any;
declare const ChatMessage: any;
declare const ui: any;

const MODULE_ID = "holosuite-hacking";

export function getDefaultRollSource() {
  return supportsSystemSkillRoll() ? "system" : "sheet";
}

export function getRollOptions(options: any = {}) {
  const source = options.rollSource ?? game.settings.get(MODULE_ID, "defaultRollSource");
  return {
    rollSource: source === "system" || source === "custom" || source === "sheet" ? source : getDefaultRollSource(),
    staticModifier: normalizeStaticModifier(options.staticModifier ?? game.settings.get(MODULE_ID, "defaultStaticModifier")),
    diceCount: normalizeDiceCount(options.diceCount ?? game.settings.get(MODULE_ID, "defaultDiceCount")),
    keepResult: (options.keepResult ?? game.settings.get(MODULE_ID, "defaultKeepResult")) === "worst" ? "worst" : "best",
    dieSides: normalizeDieSides(options.dieSides ?? game.settings.get(MODULE_ID, "defaultDieSides") ?? (isCoC7System() ? 100 : 20)),
    rollDirection: normalizeRollDirection(options.rollDirection ?? game.settings.get(MODULE_ID, "defaultRollDirection") ?? (isCoC7System() ? "low" : "high"))
  };
}

export function normalizeStaticModifier(value: unknown) {
  const modifier = Number(value ?? 0);
  if (!Number.isFinite(modifier)) throw new Error("The static modifier must be a finite number.");
  return modifier;
}

export function normalizeDiceCount(value: unknown) {
  const count = Number(value);
  return Number.isInteger(count) && count >= 1 && count <= 10 ? count : 1;
}

export function getCustomRollFormula(options: any, modifier = 0) {
  const rules = getRollOptions(options);
  const keepHigh = (rules.rollDirection === "high") === (rules.keepResult === "best");
  const keep = rules.diceCount > 1 ? (keepHigh ? "kh1" : "kl1") : "";
  return `${rules.diceCount}d${rules.dieSides}${keep} ${modifier >= 0 ? "+" : "-"} ${Math.abs(modifier)}`;
}

// The caller supplies already escaped chat flavor. Keep rolls centralized so
// launchers and integrations use exactly the same die and natural result.
export async function rollSkillCheck(options: any = {}) {
  try {
    const rules = getRollOptions(options);
    const actor = options.actor ?? getActorById(options.actorId);
    const skillId = resolveSkillId(actor, options.skillId ?? options.skill);
    if (rules.rollSource === "sheet") {
      const result = await rollFromCharacterSheet(actor, { ...options, ...rules, skillId });
      return result ? { ...rules, ...result } : null;
    }
    if (rules.rollSource === "system") {
      const roll = await rollSystemSkill(actor, skillId, options);
      if (!roll) return null;
      if (isCoC7System()) {
        // CoC7 returns the resolved percentile check, not a Foundry d100 Roll.
        // Its total can include flat adjustments, so it is not a natural die.
        return { ...rules, dieSides: 100, rollDirection: "low", total: roll.total,
          naturalRoll: null, systemOutcome: roll.systemOutcome, roll };
      }
      if (isActiveSystem("cyberpunk-red-core")) {
        return { ...rules, dieSides: 10, rollDirection: "high", total: roll.total,
          naturalRoll: null, systemOutcome: roll.systemOutcome, roll };
      }
      // The remaining adapters use a d20, regardless of the saved custom die.
      return { ...rules, dieSides: 20, total: roll.total, naturalRoll: getNaturalDieResult(roll, 20), systemOutcome: undefined, roll };
    }
    const skill = getSkillData(actor, skillId);
    // Re-read the actor at roll time so effects applied after dispatch aren't lost.
    const skillModifier = skill != null ? getSkillModifier(skill) : Number(options.skillModifier ?? 0);
    const modifier = skillModifier + rules.staticModifier;
    if (!Number.isFinite(modifier)) throw new Error("The skill modifier must be a finite number.");
    const formula = getCustomRollFormula(rules, modifier);
    const roll = await new Roll(formula).evaluate({ async: true });
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker(actor ? { actor } : undefined),
      flavor: options.flavor ?? "HoloSuite Hacking"
    });
    return { total: Number(roll.total), naturalRoll: getNaturalDieResult(roll, rules.dieSides), systemOutcome: undefined, roll, ...rules };
  } catch (error) {
    console.error(`${MODULE_ID} | Skill check failed.`, error);
    ui.notifications?.warn?.(`HoloSuite Hacking: ${error instanceof Error ? error.message : "Skill check failed."}`);
    return null;
  }
}
