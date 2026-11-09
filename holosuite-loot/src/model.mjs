export const MODULE_ID = "holosuite-loot";
export const BUILD_VERSION = "1.1.0";
export const REQUEST_FLAG = "commandV3";
export const RESPONSE_FLAG = "replyV3";
export const clone = value => structuredClone(value);
export function authenticatedRequest(user, change, senderId, flag = "request") {
  if (senderId !== user.id || !user.active || !change.flags?.[MODULE_ID]?.[flag]) return null;
  return clone(user.getFlag(MODULE_ID, flag));
}
export class LootError extends Error {
  constructor(code) { super(code); this.code = code; }
}
export function validLootRequest(request) {
  const id = value => typeof value === "string" && /^[\w-]{1,64}$/.test(value);
  return typeof request?.tokenUuid === "string" && /^Scene\.[\w-]{1,64}\.Token\.[\w-]{1,64}$/.test(request.tokenUuid)
    && ["view", "inspect", "take", "all"].includes(request.action)
    && (!["inspect", "take"].includes(request.action) || id(request.entryId))
    && (request.actorId == null || (typeof request.actorId === "string"
      && /^(?:[\w-]{1,64}|Actor\.[\w-]{1,64}|Scene\.[\w-]{1,64}\.Token\.[\w-]{1,64}(?:\.Actor\.[\w-]{1,64})?)$/.test(request.actorId)));
}
export function configFor(token) {
  return token.getFlag(MODULE_ID, "config") ?? token.actor?.getFlag(MODULE_ID, "config")
    ?? { mode: "automatic", source: "inventory" };
}
export const actorKey = actor => actor?.uuid ?? actor?.id;
export const canonical = value => JSON.stringify(value, (_key, part) => part && typeof part === "object" && !Array.isArray(part)
  ? Object.fromEntries(Object.entries(part).sort(([a], [b]) => a.localeCompare(b))) : part);
export function canReceiveLoot(actor, user, adapter, source = undefined) {
  if (!actor || !adapter.destination(actor) || !actor.testUserPermission(user, "OWNER")) return false;
  return !adapter.manual || !source || (actorKey(actor) !== actorKey(source.actor)
    && (actor.isToken || actor.id !== source.actorId));
}
export function resolveCharacter(user, actors, tokens, adapter, source = undefined) {
  const owned = actor => canReceiveLoot(actor, user, adapter, source);
  if (owned(user.character)) return user.character;
  const placed = [...new Map(Array.from(tokens ?? []).map(token => token.actor).filter(owned)
    .map(actor => [actorKey(actor), actor])).values()];
  if (placed.length === 1) return placed[0];
  if (placed.length > 1) throw new LootError("AmbiguousActor");
  const candidates = Array.from(actors ?? []).filter(owned);
  if (candidates.length === 1) return candidates[0];
  throw new LootError(candidates.length ? "AmbiguousActor" : "NoActor");
}
export function eligible(token, { combats = [], zeroHP = false, automatic = true, manual = false } = {}) {
  if (!token?.actor || (manual ? !token.actor.items : token.actor.type !== "npc")) return false;
  if (manual) return token.getFlag(MODULE_ID, "config")?.mode === "enabled";
  const config = configFor(token);
  if (config.mode === "disabled") return false;
  if (config.mode === "enabled") return true;
  if (!automatic) return false;
  if (combats.some(combat => combat.scene?.id === token.parent?.id
    && combat.combatants?.some(c => c.tokenId === token.id && c.defeated))) return true;
  const statuses = token.actor.statuses;
  if (statuses?.has("dead")) return true;
  // Unconsciousness and player-style death saves are not death.
  const hp = token.actor.system?.attributes?.hp;
  return zeroHP && Number(hp?.max) > 0 && hp?.value === 0
    && !token.actor.system?.attributes?.death?.success;
}
export function validateAccess(token, user, environment, recipient = undefined) {
  if (!user?.active || !eligible(token, environment)) throw new LootError("Unavailable");
  if (user.isGM) return;
  // Players may view Foundry's active scene without being granted Scene ownership.
  // They still need to be on that scene and pass token visibility validation.
  const sceneAccess = token.parent?.active || token.parent?.testUserPermission(user, "LIMITED");
  if (token.hidden || user.viewedScene !== token.parent?.id
    || !sceneAccess || !environment.visible(token, user)) {
    throw new LootError("AccessDenied");
  }
  if (environment.inRange && !environment.inRange(token, user, recipient)) throw new LootError("OutOfRange");
}
export function validateActor(actor, user, adapter, source = undefined) {
  if (!canReceiveLoot(actor, user, adapter, source)) {
    throw new LootError("ActorDenied");
  }
}
export class SerialQueue {
  tails = new Map();
  async run(key, work) {
    const previous = this.tails.get(key) ?? Promise.resolve();
    const next = previous.catch(() => {}).then(work);
    this.tails.set(key, next);
    try { return await next; }
    finally { if (this.tails.get(key) === next) this.tails.delete(key); }
  }
}
