import { getRollOptions } from "./check-roll";
import { getActorSkillOptions, getSkillData, getWorldActors } from "./actor-skills";
import { normalizeQuickOutcome } from "./difficulty";

declare const game: any;

/** Versioned, serializable challenge settings. Never stores a player, actor, or skill bonus. */
export function createHackConfiguration(value: any = {}) {
  if (value.version != null && value.version !== 1) throw new Error("Update HoloSuite Hacking to use this hack configuration.");
  if (value.version === 1) {
    const required = ["minigameType", "skillId", "dc", "rollSource", "dieSides", "diceCount", "keepResult", "staticModifier", "rollDirection", "liveAudience", "quickOutcome"];
    if (required.some(key => value[key] === undefined) || !["system", "sheet", "custom"].includes(value.rollSource)) {
      throw new Error("This hack configuration is incomplete. Ask the GM to edit and save it again.");
    }
  }
  const quickOutcome = normalizeQuickOutcome(value.quickOutcome);
  const dc = Number(value.dc ?? game.settings.get("holosuite-hacking", "defaultDc") ?? 15);
  if (!Number.isFinite(dc)) throw new Error("Enter a valid difficulty.");
  const liveAudience = value.liveAudience ?? game.settings.get("holosuite-hacking", "defaultLiveAudience") ?? "everyone";
  const rules = getRollOptions(value);
  return {
    version: 1,
    minigameType: String(value.minigameType ?? value.minigame ?? value.type ?? "node-intrusion"),
    skillId: String(value.skillId ?? value.skill ?? ""),
    skillLabel: String(value.skillLabel ?? value.skillId ?? value.skill ?? ""),
    dc,
    ...rules,
    quickOutcome,
    liveAudience: ["everyone", "gm", "none"].includes(liveAudience) ? liveAudience : "everyone"
  };
}

/** Discover real skills across the world, without borrowing any character's numeric value. */
export function getConfigurationSkills() {
  const skills = new Map<string, { id: string; name: string; label: string; modifier: number }>();
  for (const actor of getWorldActors()) {
    for (const option of getActorSkillOptions(actor)) {
      const data = getSkillData(actor, option.id);
      // A duplicate Item name has no portable key; don't attach an actor-local Item ID.
      if (data?.type === "skill" && option.id === data.id) continue;
      if (!skills.has(option.id)) skills.set(option.id, { ...option, label: option.name, modifier: 0 });
    }
  }
  return [...skills.values()].sort((a, b) => a.name.localeCompare(b.name));
}
