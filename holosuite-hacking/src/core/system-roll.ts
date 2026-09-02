import { getSkillData } from "./actor-skills";
import { rollCyberpunkRedSkill } from "./cyberpunk-red-roll";
import { isActiveSystem, isCoC7System } from "./system-id";

declare const game: any;

// Systems do not share a skill-roll API. Keep adapters explicit: calling an
// unknown rollSkill signature can roll the wrong check or omit its dialog.
export function supportsSystemSkillRoll() {
  return isActiveSystem("dnd5e", "pf2e", "sf2e", "CoC7", "cyberpunk-red-core");
}

export async function rollSystemSkill(actor: any, skillId: string, options: any = {}) {
  if (!supportsSystemSkillRoll()) {
    throw new Error("System skill rolls are not supported by this system. Choose Roll from character sheet or Custom dice roll in the Hacking launcher.");
  }
  if (!actor || !skillId) throw new Error("Choose a hacker character and one of its skills before using System skill roll.");
  if (isCoC7System()) return rollCoC7Skill(actor, skillId);
  const dc = Number(options.dc ?? game.settings.get("holosuite-hacking", "defaultDc") ?? 15);
  if (!Number.isFinite(dc)) throw new Error("The hacking DC must be a finite number.");
  if (isActiveSystem("cyberpunk-red-core")) return rollCyberpunkRedSkill(actor, skillId, dc);

  let result: any;
  if (isActiveSystem("pf2e", "sf2e")) {
    const statistic = actor.getStatistic?.(skillId) ?? actor.skills?.[skillId];
    if (typeof statistic?.check?.roll !== "function") throw new Error("This character does not have the selected system skill.");
    result = await statistic.check.roll({ dc: { value: dc }, skipDialog: false, createMessage: true });
  } else {
    if (typeof actor.rollSkill !== "function" || !Object.hasOwn(actor.system?.skills ?? {}, skillId)) {
      throw new Error("This character does not have the selected system skill.");
    }
    const [major, minor] = String(game.system.version ?? "").split(".").map(part => Number.parseInt(part, 10));
    if (!Number.isFinite(major)) throw new Error("Cannot determine the system skill-roll API version. Choose Custom dice roll.");
    // D&D 5e 4.1 introduced the configuration-object API and array result.
    if (major > 4 || (major === 4 && minor >= 1)) {
      result = await actor.rollSkill({ skill: skillId, target: dc }, { configure: true }, {
        create: true, data: { flavor: options.flavor ?? "HoloSuite Hacking" }
      });
    } else {
      result = await actor.rollSkill(skillId, { targetValue: dc, fastForward: false, chatMessage: true, flavor: options.flavor });
    }
  }

  // Null / empty results mean the player cancelled. Never reroll or post a
  // second message: the system owns modifiers, dice selection, and chat output.
  if (result == null || result === false || (Array.isArray(result) && !result.length)) return null;
  const roll = Array.isArray(result) ? result[0] : result;
  if (typeof roll?.total !== "number" || !Number.isFinite(roll.total)) {
    throw new Error("The system did not return an evaluated skill roll.");
  }
  return roll;
}

async function rollCoC7Skill(actor: any, skillId: string) {
  const skill = getSkillData(actor, skillId);
  if (skill?.type !== "skill") throw new Error("This character does not have the selected CoC7 skill.");
  if (typeof actor.runRoll !== "function") throw new Error("This CoC7 version does not expose native skill checks. Update CoC7 or choose Custom dice roll.");
  // CoC7's third-party API owns percentages, effects, bonus/penalty dice and chat.
  // Both v7 and v8 accept skillId; each uses a different option to lock the card type.
  const result = await actor.runRoll({ skillId: skill.id, fastForward: false, chatMessage: true,
    preventStandby: true, forcedCardType: true, cardTypeFixed: true });
  if (result == null || result === false) return null;
  const total = result.result;
  const level = result.successLevel;
  if (typeof total !== "number" || !Number.isFinite(total) || ![-99, -1, 0, 1, 2, 3, 4].includes(level)
    || typeof result.passed !== "boolean") throw new Error("CoC7 did not return an evaluated skill check.");
  // v8.15 returns false in isCritical/isFumble even for these results: use its
  // success level too. Respect failed hard/extreme checks despite a regular success.
  const systemOutcome = result.isFumble || level < 0 ? "critical_failure"
    : result.isCritical || level === 4 ? "critical_success"
    : !result.passed ? "failure_but_playable"
    : level >= 3 ? "critical_success"
    : level === 2 ? "strong_success" : "success";
  return { total, systemOutcome, systemResult: result };
}
