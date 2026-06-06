import { MODULE_ID, SOCKET_NAME, SETTINGS, debugLog, getFailureThreshold, getPlayerConfigs, getThreshold, setting } from "./settings.js";
import { playCutin } from "./cutin-animation.js";

const processedMessages = new Set();

function isDamageRoll(message, roll) {
  const diceTerms = [...(roll?.terms ?? []), ...(roll?.dice ?? [])];
  if (diceTerms.some((term) => term && term.faces === 20)) return false;
  const flags = message?.flags ?? {};
  const dnd5eRollType = flags.dnd5e?.roll?.type ?? flags.dnd5e?.roll?.rollType;
  const pf2eContextType = flags.pf2e?.context?.type;
  return [dnd5eRollType, pf2eContextType].some((type) => String(type ?? "").toLowerCase().includes("damage"));
}

function normalizeRolls(message) {
  const candidates = [];
  if (Array.isArray(message?.rolls)) candidates.push(...message.rolls);
  if (message?.roll) candidates.push(message.roll);
  if (Array.isArray(message?._source?.rolls)) candidates.push(...message._source.rolls);

  return candidates.map((roll) => {
    if (!roll || typeof roll !== "string") return roll;
    try {
      if (globalThis.Roll?.fromJSON) return globalThis.Roll.fromJSON(roll);
    } catch (error) {
      debugLog("Roll.fromJSON failed; falling back to raw JSON parse.", error);
    }
    try {
      return JSON.parse(roll);
    } catch (error) {
      debugLog("Unable to parse serialized roll data.", { roll, error });
      return null;
    }
  }).filter(Boolean);
}

function getActiveD20Results(roll) {
  const results = [];
  const diceTerms = [...(roll?.terms ?? []), ...(roll?.dice ?? [])];
  const visited = new Set();
  for (const term of diceTerms) {
    if (visited.has(term)) continue;
    visited.add(term);
    if (!term || term.faces !== 20 || !Array.isArray(term.results)) continue;
    for (const result of term.results) {
      if (result.active === false || result.discarded === true) continue;
      const value = Number(result.result);
      if (Number.isInteger(value)) results.push(value);
    }
  }
  return results;
}

function targetKey(type, id) {
  return `${type}:${id}`;
}

function gmTargetKey() {
  return targetKey("gm", "default");
}

function sanitizeAnimationStyle(value) {
  return ["strike", "breach", "signal"].includes(value) ? value : "strike";
}

function hasOwner(actor, userId) {
  if (!actor || !userId) return false;
  const ownerLevel = globalThis.CONST?.DOCUMENT_OWNERSHIP_LEVELS?.OWNER ?? 3;
  return Number(actor.ownership?.[userId] ?? actor.ownership?.default ?? 0) >= ownerLevel;
}

function resolveMessageAuthorId(message) {
  const candidate = message?.user?.id
    ?? message?.userId
    ?? message?._source?.user
    ?? (typeof message?.user === "string" ? message.user : null);
  if (candidate) return String(candidate);
  if (message?.isAuthor) return game.user?.id ?? null;
  return null;
}

function resolveActor(message) {
  const speaker = message?.speaker ?? {};
  if (message?.speakerActor) return message.speakerActor;
  if (speaker.actor) return game.actors?.get(speaker.actor) ?? null;
  if (message?.actor) return message.actor;
  return null;
}

function resolveTriggerUser(message, actor) {
  const authorId = resolveMessageAuthorId(message);
  const author = authorId ? game.users?.get(authorId) : null;
  if (!author && message?.isAuthor && game.user) return game.user;
  if (author) return author;
  if (actor) {
    const owner = game.users?.find((user) => !user.isGM && hasOwner(actor, user.id));
    if (owner) return owner;
  }
  return author ?? null;
}

function normalizeTriggerConfig(rawConfig = {}, kind, actor) {
  const fallbackThreshold = kind === "failure" ? getFailureThreshold() : getThreshold();
  const defaultText = kind === "failure" ? setting(SETTINGS.defaultFailureText) : setting(SETTINGS.defaultText);
  const defaultAccent = kind === "failure" ? "#ff4d7d" : "#69e8ff";
  const config = kind === "failure" ? rawConfig.failure ?? {} : rawConfig;
  const configuredThreshold = Number(config.threshold);
  return {
    kind,
    enabled: config.enabled !== false,
    threshold: Number.isInteger(configuredThreshold) && configuredThreshold >= 1 && configuredThreshold <= 20
      ? configuredThreshold
      : fallbackThreshold,
    animationStyle: sanitizeAnimationStyle(config.animationStyle),
    imagePath: config.imagePath || actor?.img || "",
    audioPath: config.audioPath || "",
    overlayText: config.overlayText || defaultText,
    accentColor: config.accentColor || defaultAccent
  };
}

function resolveConfig(user, actor, kind = "success") {
  const configs = getPlayerConfigs();
  const actorConfig = actor ? configs[targetKey("actor", actor.id)] : null;
  const gmConfig = user?.isGM ? configs[gmTargetKey()] : null;
  if (!actor && !user?.isGM && !actorConfig) return { enabled: false, threshold: kind === "failure" ? getFailureThreshold() : getThreshold() };

  return normalizeTriggerConfig(actorConfig ?? gmConfig ?? {}, kind, actor);
}

function buildPayload(message, qualifyingResult, actor, user, config) {
  if (!config.enabled) {
    debugLog("Cut-in disabled for target.", { userId: user?.id, actorId: actor?.id });
    return null;
  }

  const authorId = resolveMessageAuthorId(message);

  return {
    id: foundry.utils.randomID(),
    messageId: message.id,
    userId: user?.id ?? null,
    authorId: authorId ?? user?.id ?? null,
    actorId: actor?.id ?? null,
    userName: user?.name ?? "",
    actorName: actor?.name ?? user?.name ?? "",
    triggerKind: config.kind ?? "success",
    naturalResult: qualifyingResult,
    threshold: config.threshold,
    animationStyle: config.animationStyle,
    blind: message.blind === true,
    whisper: Array.isArray(message.whisper) ? [...message.whisper] : [],
    imagePath: config.imagePath || "",
    audioPath: config.audioPath || "",
    overlayText: config.overlayText || "",
    accentColor: config.accentColor || "#69e8ff",
    textEnabled: setting(SETTINGS.textEnabled),
    duration: setting(SETTINGS.duration),
    volume: setting(SETTINGS.volume),
    audience: setting(SETTINGS.audience)
  };
}

function messageHasQualifyingD20(message, threshold, kind = "success") {
  const rolls = normalizeRolls(message);
  if (!message?.isRoll && !rolls.length) return null;
  for (const roll of rolls) {
    if (isDamageRoll(message, roll)) continue;
    const d20Results = getActiveD20Results(roll);
    const qualifying = kind === "failure"
      ? d20Results.find((value) => value <= threshold)
      : d20Results.find((value) => value >= threshold);
    if (qualifying) return qualifying;
  }
  return null;
}

function shouldAuthoritativelyDetect() {
  const activeGms = game.users?.filter((user) => user.active && user.isGM) ?? [];
  const firstActiveGm = activeGms.sort((a, b) => a.id.localeCompare(b.id))[0];
  return game.user?.isGM && (!firstActiveGm || firstActiveGm.id === game.user.id);
}

export function registerRollDetection() {
  Hooks.on("createChatMessage", (message) => {
    if (!setting(SETTINGS.enabled)) return;
    if (!shouldAuthoritativelyDetect()) return;
    if (processedMessages.has(message.id)) return;
    processedMessages.add(message.id);
    if (processedMessages.size > 200) processedMessages.delete(processedMessages.values().next().value);

    const actor = resolveActor(message);
    const user = resolveTriggerUser(message, actor);
    const successConfig = resolveConfig(user, actor, "success");
    const failureConfig = resolveConfig(user, actor, "failure");
    const failureNatural = messageHasQualifyingD20(message, failureConfig.threshold, "failure");
    const successNatural = failureNatural ? null : messageHasQualifyingD20(message, successConfig.threshold, "success");
    const natural = failureNatural ?? successNatural;
    if (!natural) return;
    const config = failureNatural ? failureConfig : successConfig;

    const payload = buildPayload(message, natural, actor, user, config);
    if (!payload) return;

    debugLog("Triggering cut-in.", payload);
    game.socket?.emit(SOCKET_NAME, { type: "play", payload });
    playCutin(payload);
  });

  game.socket?.on(SOCKET_NAME, (data) => {
    if (data?.type !== "play") return;
    if (!setting(SETTINGS.enabled)) return;
    playCutin(data.payload);
  });
}

export function createManualPayloadForUser(userId, options = {}) {
  const user = game.users?.get(userId);
  const actor = options.actorId ? game.actors?.get(options.actorId) : user?.character ?? null;
  const triggerKind = options.triggerKind === "failure" ? "failure" : "success";
  const config = resolveConfig(user, actor, triggerKind);
  return {
    id: foundry.utils.randomID(),
    userId,
    authorId: game.user?.id ?? userId,
    actorId: actor?.id ?? null,
    userName: user?.name ?? "",
    actorName: actor?.name ?? user?.name ?? "",
    naturalResult: options.naturalResult ?? 20,
    triggerKind,
    threshold: options.threshold ?? config.threshold ?? getThreshold(),
    animationStyle: options.animationStyle ?? config.animationStyle ?? "strike",
    imagePath: options.imagePath ?? config.imagePath ?? "",
    audioPath: options.audioPath ?? config.audioPath ?? "",
    overlayText: options.overlayText ?? config.overlayText ?? setting(SETTINGS.defaultText),
    accentColor: options.accentColor ?? config.accentColor ?? "#69e8ff",
    textEnabled: options.textEnabled ?? setting(SETTINGS.textEnabled),
    duration: options.duration ?? setting(SETTINGS.duration),
    volume: options.volume ?? setting(SETTINGS.volume),
    audience: options.audience ?? setting(SETTINGS.audience)
  };
}

export function createManualPayloadForActor(actorId, options = {}) {
  const actor = game.actors?.get(actorId);
  const user = game.users?.find((candidate) => !candidate.isGM && hasOwner(actor, candidate.id)) ?? game.user;
  return createManualPayloadForUser(user?.id, { ...options, actorId });
}

export function broadcastPayload(payload) {
  game.socket?.emit(SOCKET_NAME, { type: "play", payload });
  playCutin(payload);
}
