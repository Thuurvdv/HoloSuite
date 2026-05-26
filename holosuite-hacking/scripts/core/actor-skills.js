export function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

export function getPlayerUsers() {
  const users = getWorldUsers();
  return users.filter((user) => !user.isGM);
}

export function getWorldUsers() {
  if (Array.isArray(game.users)) return game.users;
  return game.users?.contents ?? [...(game.users ?? [])];
}

export function getUserById(userId) {
  const id = String(userId ?? "");
  return game.users?.get?.(id) ?? getWorldUsers().find((user) => user.id === id) ?? null;
}

export function getWorldActors() {
  if (Array.isArray(game.actors)) return game.actors;
  return game.actors?.contents ?? [...(game.actors ?? [])];
}

export function getActorById(actorId) {
  const id = String(actorId ?? "");
  return game.actors?.get?.(id) ?? getWorldActors().find((actor) => actor.id === id || actor.uuid === id) ?? null;
}

export function getUserCharacter(user) {
  const character = user?.character;
  if (!character) return null;
  if (typeof character === "string") return getActorById(character);
  return character;
}

export function actorIsOwnedByUser(actor, user) {
  if (!actor || !user) return false;
  if (actor === getUserCharacter(user)) return true;
  if (actor.testUserPermission?.(user, "OWNER")) return true;

  const ownerLevel = globalThis.CONST?.DOCUMENT_OWNERSHIP_LEVELS?.OWNER ?? 3;
  const ownership = actor.ownership ?? actor.data?.permission ?? {};
  return Number(ownership[user.id] ?? ownership.default ?? 0) >= ownerLevel;
}

export function getSelectedTokenActor() {
  return canvas?.tokens?.controlled?.[0]?.actor ?? null;
}

export function getUserOwnedActors(user) {
  const assigned = getUserCharacter(user) ? [getUserCharacter(user)] : [];
  const owned = getWorldActors().filter((actor) => actorIsOwnedByUser(actor, user));
  const actors = new Map([...assigned, ...owned].filter(Boolean).map((actor) => [actor.id, actor]));
  return [...actors.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export function getPlayerActorOptions(userId = "") {
  const users = getPlayerUsers();
  const selectedUser = users.find((user) => user.id === userId);
  const actors = selectedUser ? getUserOwnedActors(selectedUser) : getWorldActors();
  return actors
    .filter((actor) => !selectedUser || actorIsOwnedByUser(actor, selectedUser))
    .map((actor) => ({
      id: actor.id,
      name: actor.name,
      owners: users.filter((user) => actorIsOwnedByUser(actor, user))
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

const SKILL_LABEL_OVERRIDES = {
  acr: "Acrobatics",
  ani: "Animal Handling",
  arc: "Arcana",
  ath: "Athletics",
  comp: "Computers",
  computer: "Computers",
  computers: "Computers",
  dec: "Deception",
  eng: "Engineering",
  hack: "Hacking",
  hacking: "Hacking",
  his: "History",
  ins: "Insight",
  int: "Intelligence",
  itm: "Intimidation",
  inv: "Investigation",
  med: "Medicine",
  nat: "Nature",
  per: "Persuasion",
  pil: "Piloting",
  prc: "Perception",
  prf: "Performance",
  rel: "Religion",
  sci: "Science",
  slt: "Sleight of Hand",
  soc: "Social",
  ste: "Stealth",
  sur: "Survival",
  tech: "Technology",
  technology: "Technology"
};

export function getActorSkillOptions(actor) {
  const skills = actor?.system?.skills;
  if (skills && typeof skills === "object") {
    const entries = Object.entries(skills).map(([id, skill]) => ({
      id,
      name: getSkillLabel(id, skill),
      label: formatSkillOptionLabel(id, skill),
      modifier: getSkillModifier(skill)
    }));
    if (entries.length) return entries.sort((left, right) => left.label.localeCompare(right.label));
  }

  return [
    { id: "hacking", name: "Hacking", label: "Hacking (+0)", modifier: 0 },
    { id: "computers", name: "Computers", label: "Computers (+0)", modifier: 0 },
    { id: "technology", name: "Technology", label: "Technology (+0)", modifier: 0 },
    { id: "intelligence", name: "Intelligence", label: "Intelligence (+0)", modifier: 0 }
  ];
}

export function getSkillData(actor, skillId) {
  return actor?.system?.skills?.[skillId] ?? null;
}

export function getSkillLabel(skillId, skill) {
  const raw = String(skill?.label ?? skill?.name ?? skill?.localizedName ?? skillId ?? "Skill").trim();
  const normalized = raw.toLowerCase().replace(/[^a-z0-9]/g, "");
  return String(SKILL_LABEL_OVERRIDES[normalized] ?? raw)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getSkillModifier(skill) {
  if (typeof skill === "number") return skill;
  if (!skill || typeof skill !== "object") return 0;
  const candidates = [
    skill?.mod,
    skill?.mod?.value,
    skill?.modifier,
    skill?.modifier?.value,
    skill?.total,
    skill?.total?.value,
    skill?.value,
    skill?.value?.value,
    skill?.bonus,
    skill?.bonus?.value,
    skill?.check,
    skill?.check?.mod,
    skill?.check?.total,
    skill?.roll,
    skill?.roll?.mod,
    skill?.roll?.total,
    skill?.rank,
    skill?.ranks
  ];
  const value = candidates.find((candidate) => Number.isFinite(Number(candidate)));
  if (value !== undefined) return Number(value);

  const weighted = [];
  collectNumericFields(skill, weighted, 0);
  weighted.sort((left, right) => right.score - left.score);
  return Number(weighted[0]?.value ?? 0);
}

export function formatSkillOptionLabel(skillId, skill) {
  const label = getSkillLabel(skillId, skill);
  const modifier = getSkillModifier(skill);
  const sign = modifier >= 0 ? "+" : "-";
  return `${label} (${sign}${Math.abs(modifier)})`;
}

function collectNumericFields(value, results, depth, path = "") {
  if (!value || typeof value !== "object" || depth > 4) return;
  for (const [key, child] of Object.entries(value)) {
    const childPath = path ? `${path}.${key}` : key;
    const number = Number(child);
    if (Number.isFinite(number)) {
      const normalized = childPath.toLowerCase();
      let score = 1;
      if (/(total|mod|modifier|bonus|check|roll|value)$/.test(normalized)) score += 6;
      if (/(dc|rank|ranks|proficient|prof|trained|ability|base|label|name)/.test(normalized)) score -= 4;
      if (Math.abs(number) > 30) score -= 5;
      results.push({ value: number, score, path: childPath });
    } else if (child && typeof child === "object") {
      collectNumericFields(child, results, depth + 1, childPath);
    }
  }
}

export async function rollActorSkill(actor, skillId, dc, flavorPrefix = "HoloSuite Hacking") {
  try {
    if (typeof actor.rollSkill === "function") {
      const roll = await actor.rollSkill(skillId, { dc, event: null });
      return { total: Number(roll?.total ?? roll?.rolls?.[0]?.total), roll };
    }

    const skill = getSkillData(actor, skillId);
    const modifier = getSkillModifier(skill);
    const label = getSkillLabel(skillId, skill);
    const formula = `1d20 ${modifier >= 0 ? "+" : "-"} ${Math.abs(modifier)}`;
    const roll = await new Roll(formula).evaluate({ async: true });
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor }),
      flavor: `${escapeHtml(flavorPrefix)}: ${escapeHtml(label)} vs DC ${Number(dc)}`
    });
    return { total: Number(roll.total), roll };
  } catch (error) {
    console.error("holosuite-hacking | Skill check failed.", error);
    ui.notifications?.warn?.("HoloSuite Hacking skill check failed.");
    return null;
  }
}
