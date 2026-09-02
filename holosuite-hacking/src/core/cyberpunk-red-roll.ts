import { actorIsOwnedByUser, getSkillData } from "./actor-skills";
import { getDifficultyProfile } from "./difficulty";

declare const game: any;

async function loadCyberpunkChat() {
  // Load the installed system's renderer, preserving its card and visibility rules.
  const route = "systems/cyberpunk-red-core/modules/chat/cpr-chat.js";
  const path = (globalThis as any).foundry?.utils?.getRoute?.(route) ?? `/${route}`;
  return (await import(/* @vite-ignore */ path)).default;
}

export async function rollCyberpunkRedSkill(actor: any, skillId: string, dc: number, loadChat = loadCyberpunkChat) {
  if (!game.user?.isGM && !actorIsOwnedByUser(actor, game.user)) throw new Error("You must own the hacker character to roll its skills.");
  const selected = getSkillData(actor, skillId);
  const skill = actor.items?.get?.(selected?.id) ?? selected;
  if (skill?.type !== "skill") throw new Error("The selected Cyberpunk RED skill is missing from this character. Choose one of the character's skill items.");
  if (typeof skill.createRoll !== "function" || typeof skill.confirmRoll !== "function") {
    throw new Error("This Cyberpunk RED version does not provide the expected skill-roll methods. Use Roll from character sheet and report the system version to magetowerfoundry@gmail.com.");
  }
  // Resolve dependencies before rolling or spending Luck. This is the same pipeline
  // used by RED's sheet in v0.89.2 and v0.92.4, without depending on a sheet click.
  const Chat = await loadChat();
  if (typeof Chat?.RenderRollCard !== "function") throw new Error("Cyberpunk RED's roll-card renderer is unavailable.");
  let roll = skill.createRoll("skill", actor);
  if (typeof roll?.handleRollDialog !== "function" || typeof roll?.roll !== "function") throw new Error("Cyberpunk RED could not prepare this skill check.");
  if (!await roll.handleRollDialog({ type: "macro", ctrlKey: false, metaKey: false }, actor, skill)) return null;
  roll = await skill.confirmRoll(roll);
  if (!roll) return null;
  await roll.roll();
  if (typeof roll.resultTotal !== "number" || !Number.isFinite(roll.resultTotal)) throw new Error("Cyberpunk RED did not return a final skill-check total.");
  if (Number.isInteger(roll.luck) && roll.luck > 0) {
    const available = Number(actor.system.stats.luck.value);
    await actor.update({ "system.stats.luck.value": Math.max(0, available - roll.luck) });
  }
  roll.entityData = { actor: actor.id, token: actor.isToken ? actor.token?.id ?? null : null, item: skill.id };
  await Chat.RenderRollCard(roll);
  // RED requires beating the DV. A natural 1/10 changes the total through an
  // additional die; it does not automatically fail/succeed against that DV.
  const profile = getDifficultyProfile(roll.resultTotal, dc + 1, null, { dieSides: 10, rollDirection: "high" });
  return { total: roll.resultTotal, systemOutcome: profile.profileId, systemResult: roll };
}
