import { MODULE_ID, SOCKET_NAME, SETTINGS, debugLog, getDieSides, getFailureThreshold, getPlayerConfigs, getThreshold, resultQualifies, setting } from "./settings";
import { playCutin, type CutinPayload } from "./cutin-animation";

declare const foundry: any;
declare const game: any;
declare const Hooks: any;

const processedMessages = new Set<string>();

// Every message that already existed when detection was registered. The chat log
// replays its backlog (CONFIG.ChatMessage.batchSize, 100 by default) through the
// render hooks on page load, and pulls another batch whenever the log is scrolled
// up far enough, so rendered detection has to ignore anything that predates this
// session or every historical crit fires a cut-in again on load.
const messagesKnownAtLoad = new Set<string>();

function isBacklogMessage(message: any) {
  return !!message?.id && messagesKnownAtLoad.has(message.id);
}

function asArray(value: any) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function collectRolls(message: any) {
  const rolls = [
    ...asArray(message?.rolls),
    ...asArray(message?.roll),
    ...asArray(message?._rolls),
    ...asArray(message?.flags?.dnd5e?.roll),
    ...asArray(message?.flags?.dnd5e?.rolls)
  ];
  const seen = new Set();
  return rolls.filter((roll) => {
    if (!roll || seen.has(roll)) return false;
    seen.add(roll);
    return true;
  });
}

function collectDiceTerms(roll: any) {
  const terms: any[] = [];
  const queue = [...asArray(roll?.terms), ...asArray(roll?.dice), ...asArray(roll?._terms), ...asArray(roll?._dice)];
  const visited = new Set();

  while (queue.length) {
    const term = queue.shift();
    if (!term || visited.has(term)) continue;
    visited.add(term);
    terms.push(term);
    queue.push(
      ...asArray(term.terms),
      ...asArray(term.dice),
      ...asArray(term.rolls),
      ...asArray(term._terms),
      ...asArray(term._dice)
    );
  }

  return terms;
}

function isDamageRoll(message: any, roll: any) {
  const flags = message?.flags ?? {};
  const dnd5eRollType = flags.dnd5e?.roll?.type ?? flags.dnd5e?.roll?.rollType;
  const pf2eContextType = flags.pf2e?.context?.type;
  return [roll?.options?.type, roll?.options?.rollType, dnd5eRollType, pf2eContextType].some((type) => String(type ?? "").toLowerCase().includes("damage"));
}

function getActiveDieResults(roll: any) {
  const results: number[] = [];
  for (const term of collectDiceTerms(roll)) {
    const faces = Number(term?.faces ?? term?._faces);
    if (faces !== getDieSides() || !Array.isArray(term.results)) continue;
    for (const result of term.results) {
      if (result.active === false || result.discarded === true || result.rerolled === true) continue;
      const value = Number(result.result ?? result.value ?? result.total);
      if (Number.isInteger(value) && value >= 1 && value <= faces) results.push(value);
    }
  }
  return results;
}

function getHtmlRoot(html: any): HTMLElement | null {
  if (!html) return null;
  if (html instanceof HTMLElement) return html;
  if (html[0] instanceof HTMLElement) return html[0];
  return null;
}

function getRenderedDieResults(html: any) {
  const root = getHtmlRoot(html);
  if (!root) return [];
  const results: number[] = [];
  const dieClass = `d${getDieSides()}`;
  const selectors = [
    `.dice-rolls .roll.${dieClass}`,
    `.dice-rolls .roll.die.${dieClass}`,
    `.dice-tooltip .roll.${dieClass}`,
    `.dice-tooltip .dice.${dieClass} .roll`
  ];
  const dice = new Set<HTMLElement>();
  for (const selector of selectors) {
    root.querySelectorAll<HTMLElement>(selector).forEach((element) => dice.add(element));
  }

  for (const element of dice) {
    if (
      element.classList.contains("discarded")
      || element.classList.contains("rerolled")
      || element.classList.contains("ignored")
      || element.classList.contains("inactive")
    ) {
      continue;
    }
    const value = Number(element.textContent?.trim());
    if (Number.isInteger(value) && value >= 1 && value <= getDieSides()) results.push(value);
  }

  return results;
}

function targetKey(type: string, id: string) {
  return `${type}:${id}`;
}

function gmTargetKey() {
  return targetKey("gm", "default");
}

function sanitizeAnimationStyle(value: any) {
  return ["strike", "breach", "signal"].includes(value) ? value : "strike";
}

function hasOwner(actor: any, userId: string) {
  if (!actor || !userId) return false;
  const ownerLevel = (globalThis as any).CONST?.DOCUMENT_OWNERSHIP_LEVELS?.OWNER ?? 3;
  return Number(actor.ownership?.[userId] ?? actor.ownership?.default ?? 0) >= ownerLevel;
}

function resolveActor(message: any) {
  const speaker = message?.speaker ?? {};
  if (speaker.actor) return game.actors?.get(speaker.actor) ?? null;
  if (message?.actor) return message.actor;
  return null;
}

// v12 renamed ChatMessage#user to #author and v14 dropped the deprecated alias,
// so the author has to be read from both shapes, as a document or as a raw id.
function resolveMessageAuthor(message: any) {
  const author = message?.author ?? message?.user;
  if (author && typeof author === "object") return author.id ? game.users?.get(author.id) ?? author : null;
  const authorId = author ?? message?._source?.author ?? message?.userId;
  return authorId ? game.users?.get(authorId) ?? null : null;
}

function resolveTriggerUser(message: any, actor: any) {
  const author = resolveMessageAuthor(message);
  if (author && !author.isGM) return author;
  if (actor) {
    const owner = game.users?.find((user) => !user.isGM && hasOwner(actor, user.id));
    if (owner) return owner;
  }
  return author ?? null;
}

type TriggerConfig = {
  kind: "success" | "failure";
  enabled: boolean;
  threshold: number;
  animationStyle: string;
  imagePath: string;
  audioPath: string;
  overlayText: string;
  accentColor: string;
};

function normalizeTriggerConfig(rawConfig: any = {}, kind: "success" | "failure", actor: any, preferActorImage = false): TriggerConfig {
  const fallbackThreshold = kind === "failure" ? getFailureThreshold() : getThreshold();
  const defaultText = kind === "failure" ? setting(SETTINGS.defaultFailureText) : setting(SETTINGS.defaultText);
  const defaultAccent = kind === "failure" ? "#ff4d7d" : "#69e8ff";
  const config = kind === "failure" ? rawConfig.failure ?? {} : rawConfig;
  const configuredThreshold = Number(config.threshold);
  return {
    kind,
    enabled: config.enabled !== false,
    threshold: Number.isInteger(configuredThreshold) && configuredThreshold >= 1 && configuredThreshold <= getDieSides()
      ? configuredThreshold
      : fallbackThreshold,
    animationStyle: sanitizeAnimationStyle(config.animationStyle),
    imagePath: (preferActorImage ? actor?.img : "") || config.imagePath || actor?.img || "",
    audioPath: config.audioPath || "",
    overlayText: config.overlayText || defaultText,
    accentColor: config.accentColor || defaultAccent
  };
}

function resolveConfig(user: any, actor: any, kind: "success" | "failure" = "success"): TriggerConfig {
  const configs = getPlayerConfigs();
  const actorConfig = actor ? configs[targetKey("actor", actor.id)] : null;
  const isGm = user?.isGM === true;
  const gmConfig = isGm ? configs[gmTargetKey()] : null;
  if (!actor && !isGm && !actorConfig) {
    return normalizeTriggerConfig({ enabled: false }, kind, actor);
  }

  // A GM rolling as an unconfigured actor keeps their own animation, audio,
  // thresholds, label and accent, but shows that actor's portrait so monsters
  // look like themselves. Rolling as themselves uses the configured GM image.
  const preferActorImage = isGm && !actorConfig && !!actor?.img;
  return normalizeTriggerConfig(actorConfig ?? gmConfig ?? {}, kind, actor, preferActorImage);
}

function buildPayload(message: any, qualifyingResult: number, actor: any, user: any, config: any): CutinPayload | null {
  if (!config.enabled) {
    debugLog("Cut-in disabled for target.", { userId: user?.id, actorId: actor?.id });
    return null;
  }

  return {
    id: foundry.utils.randomID(),
    messageId: message.id,
    userId: user?.id ?? null,
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

export function messageHasQualifyingDie(message: any, threshold: number, kind: "success" | "failure" = "success") {
  const rolls = collectRolls(message);
  if (!message?.isRoll && !rolls.length) return null;
  for (const roll of rolls) {
    if (isDamageRoll(message, roll)) continue;
    const qualifying = getActiveDieResults(roll).find((value) => resultQualifies(value, threshold, kind));
    if (qualifying) return qualifying;
  }
  return null;
}

export function renderedMessageHasQualifyingDie(message: any, html: any, threshold: number, kind: "success" | "failure" = "success") {
  const results = getRenderedDieResults(html);
  if (!results.length) return null;
  if (isDamageRoll(message, {})) return null;
  return results.find((value) => resultQualifies(value, threshold, kind)) ?? null;
}

function shouldAuthoritativelyDetect() {
  const activeGms = game.users?.filter((user) => user.active && user.isGM) ?? [];
  const firstActiveGm = activeGms.sort((a, b) => a.id.localeCompare(b.id))[0];
  return game.user?.isGM && (!firstActiveGm || firstActiveGm.id === game.user.id);
}

function rememberProcessedMessage(messageId: string) {
  processedMessages.add(messageId);
  const oldest = processedMessages.values().next().value;
  if (processedMessages.size > 200 && oldest) processedMessages.delete(oldest);
}

function detectChatMessage(message: any) {
  if (!message?.id || processedMessages.has(message.id)) return true;

  const actor = resolveActor(message);
  const user = resolveTriggerUser(message, actor);
  const successConfig = resolveConfig(user, actor, "success");
  const failureConfig = resolveConfig(user, actor, "failure");
  const failureNatural = messageHasQualifyingDie(message, failureConfig.threshold, "failure");
  const successNatural = failureNatural ? null : messageHasQualifyingDie(message, successConfig.threshold, "success");
  const natural = failureNatural ?? successNatural;
  if (!natural) return false;
  const config = failureNatural ? failureConfig : successConfig;

  const payload = buildPayload(message, natural, actor, user, config);
  if (!payload) {
    rememberProcessedMessage(message.id);
    return true;
  }

  rememberProcessedMessage(message.id);
  debugLog("Triggering cut-in.", payload);
  game.socket?.emit(SOCKET_NAME, { type: "play", payload });
  playCutin(payload);
  return true;
}

function detectRenderedChatMessage(message: any, html: any) {
  if (!message?.id || processedMessages.has(message.id)) return true;

  const actor = resolveActor(message);
  const user = resolveTriggerUser(message, actor);
  const successConfig = resolveConfig(user, actor, "success");
  const failureConfig = resolveConfig(user, actor, "failure");
  const failureNatural = renderedMessageHasQualifyingDie(message, html, failureConfig.threshold, "failure");
  const successNatural = failureNatural
    ? null
    : renderedMessageHasQualifyingDie(message, html, successConfig.threshold, "success");
  const natural = failureNatural ?? successNatural;
  if (!natural) return false;
  const config = failureNatural ? failureConfig : successConfig;

  const payload = buildPayload(message, natural, actor, user, config);
  if (!payload) {
    rememberProcessedMessage(message.id);
    return true;
  }

  rememberProcessedMessage(message.id);
  debugLog("Triggering cut-in from rendered chat card.", payload);
  game.socket?.emit(SOCKET_NAME, { type: "play", payload });
  playCutin(payload);
  return true;
}

function scheduleChatMessageRetry(message: any, delay: number) {
  if (!message?.id) return;
  globalThis.setTimeout(() => {
    if (processedMessages.has(message.id)) return;
    const currentMessage = game.messages?.get(message.id) ?? message;
    detectChatMessage(currentMessage);
  }, delay);
}

export function registerRollDetection() {
  messagesKnownAtLoad.clear();
  for (const message of game.messages ?? []) {
    if (message?.id) messagesKnownAtLoad.add(message.id);
  }

  Hooks.on("createChatMessage", (message) => {
    if (!setting(SETTINGS.enabled)) return;
    if (!shouldAuthoritativelyDetect()) return;
    if (detectChatMessage(message)) return;
    scheduleChatMessageRetry(message, 100);
    scheduleChatMessageRetry(message, 500);
    scheduleChatMessageRetry(message, 1500);
  });

  const onRenderedChatMessage = (message: any, html: any) => {
    if (!setting(SETTINGS.enabled)) return;
    if (isBacklogMessage(message)) return;
    if (!shouldAuthoritativelyDetect()) return;
    detectRenderedChatMessage(message, html);
  };

  // v12 passes jQuery; v13+ passes an HTMLElement through renderChatMessageHTML and
  // still fires the deprecated renderChatMessage until v15. getHtmlRoot handles both.
  Hooks.on("renderChatMessage", onRenderedChatMessage);
  Hooks.on("renderChatMessageHTML", onRenderedChatMessage);

  game.socket?.on(SOCKET_NAME, (data) => {
    if (data?.type !== "play") return;
    if (!setting(SETTINGS.enabled)) return;
    playCutin(data.payload);
  });
}

export function createManualPayloadForUser(userId: string, options: any = {}): CutinPayload {
  const user = game.users?.get(userId);
  const actor = options.actorId ? game.actors?.get(options.actorId) : user?.character ?? null;
  const triggerKind = options.triggerKind === "failure" ? "failure" : "success";
  const config = resolveConfig(user, actor, triggerKind);
  return {
    id: foundry.utils.randomID(),
    userId,
    actorId: actor?.id ?? null,
    userName: user?.name ?? "",
    actorName: actor?.name ?? user?.name ?? "",
    naturalResult: options.naturalResult ?? config.threshold,
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

export function createManualPayloadForActor(actorId: string, options: any = {}): CutinPayload {
  const actor = game.actors?.get(actorId);
  const user = game.users?.find((candidate) => !candidate.isGM && hasOwner(actor, candidate.id)) ?? game.user;
  return createManualPayloadForUser(user?.id, { ...options, actorId });
}

export function broadcastPayload(payload: CutinPayload) {
  game.socket?.emit(SOCKET_NAME, { type: "play", payload });
  playCutin(payload);
}
