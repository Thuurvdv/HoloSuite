declare const game: any;
declare const canvas: any;

import { isActiveSystem, isCoC7System } from "./system-id";

export function escapeHtml(value: any) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML.replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

export function getPlayerUsers() {
  const users = getWorldUsers();
  return users.filter((user) => !user.isGM);
}

export function getWorldUsers() {
  if (Array.isArray(game.users)) return game.users;
  return game.users?.contents ?? [...(game.users ?? [])];
}

export function getUserById(userId: string) {
  const id = String(userId ?? "");
  return game.users?.get?.(id) ?? getWorldUsers().find((user) => user.id === id) ?? null;
}

export function getWorldActors() {
  if (Array.isArray(game.actors)) return game.actors;
  return game.actors?.contents ?? [...(game.actors ?? [])];
}

export function getActorById(actorId: string) {
  const id = String(actorId ?? "");
  return game.actors?.get?.(id) ?? getWorldActors().find((actor) => actor.id === id || actor.uuid === id) ?? null;
}

export function getUserCharacter(user: any) {
  const character = user?.character;
  if (!character) return null;
  if (typeof character === "string") return getActorById(character);
  return character;
}

export function actorIsOwnedByUser(actor: any, user: any) {
  if (!actor || !user) return false;
  if (actor === getUserCharacter(user)) return true;
  if (actor.testUserPermission?.(user, "OWNER")) return true;

  const ownerLevel = (globalThis as any).CONST?.DOCUMENT_OWNERSHIP_LEVELS?.OWNER ?? 3;
  const ownership = actor.ownership ?? actor.data?.permission ?? {};
  return Number(ownership[user.id] ?? ownership.default ?? 0) >= ownerLevel;
}

export function getSelectedTokenActor() {
  return canvas?.tokens?.controlled?.[0]?.actor ?? null;
}

export function getUserOwnedActors(user: any) {
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
  com: "Computers",
  cmp: "Computers",
  comp: "Computers",
  computer: "Computers",
  computers: "Computers",
  dec: "Deception",
  eng: "Engineering",
  hack: "Hacking",
  hak: "Hacking",
  hacking: "Hacking",
  his: "History",
  ins: "Insight",
  int: "Intelligence",
  itm: "Intimidation",
  inv: "Investigation",
  lor: "Lore",
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
  tec: "Technology",
  technology: "Technology"
};

export function getActorSkillOptions(actor: any) {
  const skills = getActorSkills(actor);
  if (skills && typeof skills === "object") {
    const entries = Object.entries(skills).map(([id, skill]) => ({
      id: isSkillItem(skill) ? getSkillItemKey(skill, Object.values(skills)) : id,
      name: getSkillLabel(id, skill),
      label: formatSkillOptionLabel(id, skill),
      modifier: getSkillModifier(skill)
    }));
    if (entries.length) return entries.sort((left, right) => left.label.localeCompare(right.label));
  }

  return [];
}

export function getMissingSkillsWarning() {
  return "HoloSuite couldn't find skills for the selected character in this system. Choose Roll from character sheet, roll normally, and click Use for hacking on the chat result. Or choose Custom dice roll under Roll source and enter modifiers in Static modifier. If the character has skills, report this to magetowerfoundry@gmail.com so support can be added in an update. Include the system name/version, Foundry and HoloSuite module versions.";
}

export function getSkillData(actor: any, skillId: string) {
  return getActorSkills(actor)?.[resolveSkillId(actor, skillId)] ?? null;
}

function getActorSkills(actor: any) {
  const skills = isActiveSystem("pf2e", "sf2e") ? (actor?.skills ?? actor?.system?.skills) : actor?.system?.skills;
  // These systems roll owned skill Items. Derived skill summaries (including
  // those supplied by sheets/modules) do not carry the Item's roll methods.
  if (!isActiveSystem("CoC7", "cyberpunk-red-core") && skills && Object.keys(skills).length) return skills;
  // Some systems store skills as embedded Items instead of actor.system.skills.
  // Discover explicit skill Items only; never infer skills from arbitrary stats.
  const collection = actor?.items;
  const items = Array.isArray(collection) ? collection : collection?.contents ?? (collection?.values ? [...collection.values()] : []);
  return Object.fromEntries(items.filter(item => isSkillItem(item) && item.id && item.name).map(item => [item.id, item]));
}

function isSkillItem(skill: any) {
  return skill?.type === "skill" && skill.system && typeof skill.system === "object";
}

function getSkillItemKey(skill: any, skills: any[]) {
  const cocid = isCoC7System() ? skill.flags?.CoC7?.cocidFlag?.id : null;
  if (typeof cocid === "string" && cocid && skills.filter(candidate => candidate.flags?.CoC7?.cocidFlag?.id === cocid).length === 1) return cocid;
  // Item IDs differ between actors. A unique name also works in shared terminal locks.
  return skills.filter(candidate => candidate.name === skill.name).length === 1 ? skill.name : skill.id;
}

export function getCoC7SkillValue(skill: any): number | null {
  if (!isCoC7System() || !isSkillItem(skill)) return null;
  // v8 moved the computed, effect-adjusted percentage from Item.value to system.value.
  const modern = Number.parseInt(String(game.system.version ?? "0"), 10) >= 8;
  const values = modern ? [skill.system.value] : [skill.value, skill.system.value];
  const value = values.find(isNumericModifier);
  return value === undefined ? null : Number(value);
}

export function resolveSkillId(actor: any, value: unknown) {
  const id = String(value ?? "").trim();
  const skills = getActorSkills(actor) ?? {};
  if (Object.hasOwn(skills, id)) return id;
  // Older terminal locks stored a display name rather than the system skill ID.
  const normalized = id.toLocaleLowerCase();
  const redSummary = isActiveSystem("cyberpunk-red-core") ? actor?.system?.skills?.[id] : null;
  const redItemId = redSummary?.id ?? redSummary?._id;
  const redName = String(redSummary?.name ?? redSummary?.label ?? "").trim().toLocaleLowerCase();
  const matches = Object.entries(skills).filter(([key, skill]: [string, any]) => key.toLocaleLowerCase() === normalized
    || skill?.uuid === id
    || (redItemId && skill?.id === redItemId)
    || (redName && String(skill?.name ?? "").trim().toLocaleLowerCase() === redName)
    || (isCoC7System() && skill?.flags?.CoC7?.cocidFlag?.id === id)
    || getSkillLabel(key, skill).toLocaleLowerCase() === normalized);
  return matches.length === 1 ? matches[0][0] : id;
}

export function getSkillLabel(skillId: string, skill: any) {
  if (isSkillItem(skill)) return String(skill.name ?? skillId);
  const config = (globalThis as any).CONFIG?.[String(game.system?.id ?? "").toUpperCase()]?.skills?.[skillId];
  const configuredLabel = typeof config === "string" ? config : config?.label ?? config?.name;
  const label = skill?.label ?? skill?.name ?? skill?.localizedName ?? configuredLabel ?? skillId ?? "Skill";
  const raw = String(game.i18n?.localize?.(label) ?? label).trim();
  const normalized = raw.toLowerCase().replace(/[^a-z0-9]/g, "");
  return String(SKILL_LABEL_OVERRIDES[normalized] ?? raw)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getSkillModifier(skill: any) {
  // An Item's numeric value could be a percentile target, rank, or die type.
  // Unknown Item schemas use the GM's static modifier, never a guessed bonus.
  if (isSkillItem(skill)) return 0;
  if (typeof skill === "number") return skill;
  if (!skill || typeof skill !== "object") return 0;
  const candidates = [
    // Prefer the system's computed total; mod can be just the ability bonus.
    skill?.total,
    skill?.total?.value,
    skill?.check?.total,
    skill?.check?.mod,
    skill?.roll?.total,
    skill?.mod,
    skill?.mod?.value,
    skill?.modifier,
    skill?.modifier?.value,
    skill?.value,
    skill?.value?.value,
    skill?.bonus,
    skill?.bonus?.value,
    skill?.check,
    skill?.roll,
    skill?.roll?.mod,
    skill?.rank,
    skill?.ranks
  ];
  const value = candidates.find(isNumericModifier);
  if (value !== undefined) return Number(value);

  const weighted = [];
  collectNumericFields(skill, weighted, 0);
  weighted.sort((left, right) => right.score - left.score);
  return Number(weighted[0]?.value ?? 0);
}

export function formatSkillOptionLabel(skillId: string, skill: any) {
  const label = getSkillLabel(skillId, skill);
  if (game.settings?.get?.("holosuite-hacking", "showSkillModifiers") !== true) return label;
  if (isSkillItem(skill)) {
    const percentage = getCoC7SkillValue(skill);
    return percentage === null ? label : `${label} (${percentage}%)`;
  }
  const modifier = getSkillModifier(skill);
  const sign = modifier >= 0 ? "+" : "-";
  return `${label} (${sign}${Math.abs(modifier)})`;
}

function isNumericModifier(value: any) {
  return (typeof value === "number" || (typeof value === "string" && value.trim() !== "")) && Number.isFinite(Number(value));
}

function collectNumericFields(value: any, results: any[], depth: number, path = "") {
  if (!value || typeof value !== "object" || depth > 4) return;
  for (const [key, child] of Object.entries(value)) {
    const childPath = path ? `${path}.${key}` : key;
    const number = Number(child);
    if (isNumericModifier(child)) {
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
