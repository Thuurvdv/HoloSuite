import { BOX_FLAG } from "./box-of-doom";
import { MODULE_ID, SOCKET_NAME, SETTINGS, debugLog, getCheckRollRange, getDiceQuantity, getDieSides, getFailureThreshold, getPlayerConfigs, getThreshold, normalizeDurationOverride, resolveCutinAudio, resultQualifies, setting } from "./settings";
import { playCutin, type CutinPayload } from "./cutin-animation";
import { normalizeEffectId } from "./effect-presets";
import { MANGA_ACCENT, MANGA_STYLE } from "./manga-overdrive";

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
      ...(term.roll && typeof term.roll === "object" ? [term.roll] : []),
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

function isInactiveResult(result: any) {
  return result?.active === false || result?.discarded === true || result?.rerolled === true;
}

function getActiveDieResults(roll: any, checkPools: boolean) {
  const results: number[] = [];
  const sides = getDieSides();
  const terms = collectDiceTerms(roll);
  const discardedTerms = new Set();
  if (checkPools) {
    // Foundry's flattened dice list also contains dice from dropped pool entries.
    for (const term of terms) {
      if (!Array.isArray(term.rolls) || !Array.isArray(term.results)) continue;
      for (const [index, nestedRoll] of term.rolls.entries()) {
        if (isInactiveResult(term.results[index])) {
          for (const die of collectDiceTerms(nestedRoll)) discardedTerms.add(die);
        }
      }
    }
  }
  for (const term of terms) {
    const faces = Number(term?.faces ?? term?._faces);
    if (faces !== sides || discardedTerms.has(term) || !Array.isArray(term.results)) continue;
    for (const result of term.results) {
      if (!result || isInactiveResult(result)) continue;
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

function getRenderedDieResults(root: HTMLElement) {
  const results: number[] = [];
  const sides = getDieSides();
  const dieClass = `d${sides}`;
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
    if (Number.isInteger(value) && value >= 1 && value <= sides) results.push(value);
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
  return normalizeEffectId(value);
}

function hasOwner(actor: any, userId: string) {
  if (!actor || !userId) return false;
  const ownerLevel = (globalThis as any).CONST?.DOCUMENT_OWNERSHIP_LEVELS?.OWNER ?? 3;
  return Number(actor.ownership?.[userId] ?? actor.ownership?.default ?? 0) >= ownerLevel;
}

function resolveSpeakerToken(message: any) {
  const { scene, token } = message?.speaker ?? {};
  if (!token) return null;
  const speakerScene = scene ? game.scenes?.get(scene) : (globalThis as any).canvas?.scene;
  return speakerScene?.tokens?.get(token) ?? null;
}

function resolveActor(message: any, token: any) {
  const speaker = message?.speaker ?? {};
  return (speaker.actor ? game.actors?.get(speaker.actor) : null) ?? token?.actor ?? message?.actor ?? null;
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
  duration: number;
  animationStyle: string;
  imagePath: string;
  audioPath: string;
  overlayText: string;
  accentColor: string;
};

function normalizeTriggerConfig(rawConfig: any = {}, kind: "success" | "failure", actor: any, preferredImage = ""): TriggerConfig {
  const fallbackThreshold = kind === "failure" ? getFailureThreshold() : getThreshold();
  const defaultText = kind === "failure" ? setting(SETTINGS.defaultFailureText) : setting(SETTINGS.defaultText);
  const config = kind === "failure" ? rawConfig.failure ?? {} : rawConfig;
  const animationStyle = sanitizeAnimationStyle(config.animationStyle);
  const defaultAccent = animationStyle === MANGA_STYLE ? MANGA_ACCENT : kind === "failure" ? "#ff4d7d" : "#69e8ff";
  const configuredThreshold = Number(config.threshold);
  const { min, max } = getCheckRollRange();
  return {
    kind,
    enabled: config.enabled !== false,
    threshold: Number.isInteger(configuredThreshold) && configuredThreshold >= min && configuredThreshold <= max
      ? configuredThreshold
      : fallbackThreshold,
    duration: normalizeDurationOverride(config.duration) ?? setting(SETTINGS.duration),
    animationStyle,
    imagePath: preferredImage || config.imagePath || actor?.img || "",
    audioPath: resolveCutinAudio(kind, config.audioPath),
    overlayText: config.overlayText || defaultText,
    accentColor: config.accentColor || defaultAccent
  };
}

function resolveConfig(user: any, actor: any, kind: "success" | "failure", token?: any): TriggerConfig {
  const configs = getPlayerConfigs();
  const actorConfig = actor ? configs[targetKey("actor", actor.id)] : null;
  const isGm = user?.isGM === true;
  const gmConfig = isGm ? configs[gmTargetKey()] : null;
  if (!actor && !isGm && !actorConfig) {
    return normalizeTriggerConfig({ enabled: false }, kind, actor);
  }

  const preferredImage = isGm && !actorConfig && gmConfig?.useTokenPortrait !== false
    ? token?.texture?.src || actor?.img
    : "";
  return normalizeTriggerConfig(actorConfig ?? gmConfig ?? {}, kind, actor, preferredImage);
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
    actorName: actor?.name ?? "",
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
    duration: config.duration,
    volume: setting(SETTINGS.volume),
    audience: setting(SETTINGS.audience)
  };
}

function qualifyingNaturalTotal(results: number[], quantity: number, threshold: number, kind: "success" | "failure") {
  if (quantity === 1) return results.find(value => resultQualifies(value, threshold, kind)) ?? null;
  if (results.length !== quantity) return null;
  const total = results.reduce((sum, value) => sum + value, 0);
  return resultQualifies(total, threshold, kind) ? total : null;
}

export function messageHasQualifyingDie(message: any, threshold: number, kind: "success" | "failure" = "success") {
  const rolls = collectRolls(message);
  if (!message?.isRoll && !rolls.length) return null;
  const quantity = getDiceQuantity();
  for (const roll of rolls) {
    if (isDamageRoll(message, roll)) continue;
    const qualifying = qualifyingNaturalTotal(getActiveDieResults(roll, quantity > 1), quantity, threshold, kind);
    if (qualifying !== null) return qualifying;
  }
  return null;
}

export function renderedMessageHasQualifyingDie(message: any, html: any, threshold: number, kind: "success" | "failure" = "success") {
  const root = getHtmlRoot(html);
  if (!root || isDamageRoll(message, {})) return null;
  const quantity = getDiceQuantity();
  if (quantity === 1) return qualifyingNaturalTotal(getRenderedDieResults(root), quantity, threshold, kind);

  const rolls = collectRolls(message);
  if (rolls.some(roll => collectDiceTerms(roll).some(term => term.results?.length))) {
    return messageHasQualifyingDie(message, threshold, kind);
  }
  if (rolls.some(roll => isDamageRoll(message, roll))) return null;
  const rollCards = Array.from(root.querySelectorAll<HTMLElement>(".dice-roll"))
    .filter(card => !card.querySelector(".dice-roll"));
  if (!rollCards.length && rolls.length > 1 && !root.matches(".dice-roll")) return null;
  for (const card of rollCards.length ? rollCards : [root]) {
    const total = qualifyingNaturalTotal(getRenderedDieResults(card), quantity, threshold, kind);
    if (total !== null) return total;
  }
  return null;
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
  if (!message?.id || message.flags?.[MODULE_ID]?.[BOX_FLAG] || processedMessages.has(message.id)) return true;

  const token = resolveSpeakerToken(message);
  const actor = resolveActor(message, token);
  const user = resolveTriggerUser(message, actor);
  const successConfig = resolveConfig(user, actor, "success", token);
  const failureConfig = resolveConfig(user, actor, "failure", token);
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
  if (!message?.id || message.flags?.[MODULE_ID]?.[BOX_FLAG] || processedMessages.has(message.id)) return true;

  const token = resolveSpeakerToken(message);
  const actor = resolveActor(message, token);
  const user = resolveTriggerUser(message, actor);
  const successConfig = resolveConfig(user, actor, "success", token);
  const failureConfig = resolveConfig(user, actor, "failure", token);
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
  const token = actor && user?.isGM && user.id === game.user?.id
    ? (globalThis as any).canvas?.tokens?.controlled?.find((item: any) => item.actor?.id === actor.id)?.document
    : null;
  const config = resolveConfig(user, actor, triggerKind, token);
  return {
    id: foundry.utils.randomID(),
    userId,
    actorId: actor?.id ?? null,
    userName: user?.name ?? "",
    actorName: actor?.name ?? "",
    naturalResult: options.naturalResult ?? config.threshold,
    triggerKind,
    threshold: options.threshold ?? config.threshold ?? getThreshold(),
    animationStyle: options.animationStyle ?? config.animationStyle ?? "strike",
    imagePath: options.imagePath ?? config.imagePath ?? "",
    audioPath: options.audioPath ?? config.audioPath ?? "",
    overlayText: options.overlayText ?? config.overlayText ?? setting(SETTINGS.defaultText),
    accentColor: options.accentColor ?? config.accentColor ?? "#69e8ff",
    textEnabled: options.textEnabled ?? setting(SETTINGS.textEnabled),
    duration: options.duration ?? config.duration,
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
