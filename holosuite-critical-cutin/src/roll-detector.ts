import { MODULE_ID, SOCKET_NAME, SETTINGS, debugLog, getFailureThreshold, getPlayerConfigs, getThreshold, setting } from "./settings";
import { playCutin, type CutinPayload } from "./cutin-animation";

declare const foundry: any;
declare const game: any;
declare const Hooks: any;

const processedMessages = new Set<string>();

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
  const diceTerms = collectDiceTerms(roll);
  if (diceTerms.some((term) => term && term.faces === 20)) return false;
  const flags = message?.flags ?? {};
  const dnd5eRollType = flags.dnd5e?.roll?.type ?? flags.dnd5e?.roll?.rollType;
  const pf2eContextType = flags.pf2e?.context?.type;
  return [dnd5eRollType, pf2eContextType].some((type) => String(type ?? "").toLowerCase().includes("damage"));
}

function getActiveD20Results(roll: any) {
  const results: number[] = [];
  for (const term of collectDiceTerms(roll)) {
    const faces = Number(term?.faces ?? term?._faces);
    if (faces !== 20 || !Array.isArray(term.results)) continue;
    for (const result of term.results) {
      if (result.active === false || result.discarded === true) continue;
      const value = Number(result.result ?? result.value ?? result.total);
      if (Number.isInteger(value)) results.push(value);
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

function getRenderedD20Results(html: any) {
  const root = getHtmlRoot(html);
  if (!root) return [];
  const results: number[] = [];
  const selectors = [
    ".dice-rolls .roll.d20",
    ".dice-rolls .roll.die.d20",
    ".dice-tooltip .roll.d20",
    ".dice-tooltip .dice.d20 .roll"
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
    if (Number.isInteger(value) && value >= 1 && value <= 20) results.push(value);
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

function resolveTriggerUser(message: any, actor: any) {
  const authorId = message?.user?.id ?? message?.user ?? message?.userId;
  const author = game.users?.get(authorId);
  if (author && !author.isGM) return author;
  if (actor) {
    const owner = game.users?.find((user) => !user.isGM && hasOwner(actor, user.id));
    if (owner) return owner;
  }
  return author ?? game.users?.get(authorId) ?? null;
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

function normalizeTriggerConfig(rawConfig: any = {}, kind: "success" | "failure", actor: any): TriggerConfig {
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

function resolveConfig(user: any, actor: any, kind: "success" | "failure" = "success"): TriggerConfig {
  const configs = getPlayerConfigs();
  const actorConfig = actor ? configs[targetKey("actor", actor.id)] : null;
  const gmConfig = user?.isGM ? configs[gmTargetKey()] : null;
  if (!actor && !user?.isGM && !actorConfig) {
    return normalizeTriggerConfig({ enabled: false }, kind, actor);
  }

  return normalizeTriggerConfig(actorConfig ?? gmConfig ?? {}, kind, actor);
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

function messageHasQualifyingD20(message: any, threshold: number, kind: "success" | "failure" = "success") {
  const rolls = collectRolls(message);
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

function renderedMessageHasQualifyingD20(message: any, html: any, threshold: number, kind: "success" | "failure" = "success") {
  const results = getRenderedD20Results(html);
  if (!results.length) return null;
  if (isDamageRoll(message, {})) return null;
  return kind === "failure"
    ? results.find((value) => value <= threshold) ?? null
    : results.find((value) => value >= threshold) ?? null;
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
  const failureNatural = messageHasQualifyingD20(message, failureConfig.threshold, "failure");
  const successNatural = failureNatural ? null : messageHasQualifyingD20(message, successConfig.threshold, "success");
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
  const failureNatural = renderedMessageHasQualifyingD20(message, html, failureConfig.threshold, "failure");
  const successNatural = failureNatural
    ? null
    : renderedMessageHasQualifyingD20(message, html, successConfig.threshold, "success");
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
  Hooks.on("createChatMessage", (message) => {
    if (!setting(SETTINGS.enabled)) return;
    if (!shouldAuthoritativelyDetect()) return;
    if (detectChatMessage(message)) return;
    scheduleChatMessageRetry(message, 100);
    scheduleChatMessageRetry(message, 500);
    scheduleChatMessageRetry(message, 1500);
  });

  Hooks.on("renderChatMessage", (message, html) => {
    if (!setting(SETTINGS.enabled)) return;
    if (!shouldAuthoritativelyDetect()) return;
    detectRenderedChatMessage(message, html);
  });

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

export function createManualPayloadForActor(actorId: string, options: any = {}): CutinPayload {
  const actor = game.actors?.get(actorId);
  const user = game.users?.find((candidate) => !candidate.isGM && hasOwner(actor, candidate.id)) ?? game.user;
  return createManualPayloadForUser(user?.id, { ...options, actorId });
}

export function broadcastPayload(payload: CutinPayload) {
  game.socket?.emit(SOCKET_NAME, { type: "play", payload });
  playCutin(payload);
}
