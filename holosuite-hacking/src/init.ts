import { createHackingApi } from "./core/hacking-api";
import { DIFFICULTY_PROFILES, normalizeQuickOutcome } from "./core/difficulty";
import { getDefaultRollSource, getRollOptions, rollSkillCheck } from "./core/check-roll";
import { getDieOptions } from "../../shared/src/dice-checks";
import { isCoC7System } from "./core/system-id";
import {
  actorIsOwnedByUser,
  escapeHtml,
  getActorById,
  getSelectedTokenActor,
  getSkillData,
  getSkillLabel,
  getSkillModifier,
  getUserById,
  getUserCharacter,
  getUserOwnedActors,
  getWorldUsers
} from "./core/actor-skills";
import { registerMinigame } from "./core/minigame-runner";
import { HackingLauncherApp, openHackConfiguration } from "./ui/hacking-launcher-app";
import { DifficultyProfilesApp } from "./ui/difficulty-profiles-app";
import { NodeIntrusionApp } from "./minigames/node-intrusion/node-intrusion-app";
import { SignalAlignmentApp } from "./minigames/signal-alignment/signal-alignment-app";
import { PacketSwitchboardApp } from "./minigames/packet-switchboard/packet-switchboard-app";
import { PrismLockApp } from "./minigames/prism-lock/prism-lock-app";

declare const foundry: any;
declare const game: any;
declare const ui: any;
declare const Hooks: any;
declare const Dialog: any;
declare const Roll: any;
declare const ChatMessage: any;

const MODULE_ID = "holosuite-hacking";
const SOCKET_NAME = `module.${MODULE_ID}`;
const PENDING_CALLBACK_TTL_MS = 10 * 60 * 1000;
const LIVE_STATE_INTERVAL_MS = 200;

let api: any = null;
let launcherApp: any = null;
const pendingCallbacks = new Map<string, any>();
const controllerSessions = new Map<string, any>();
const spectatorApps = new Map<string, any>();

function registerSettings() {
  game.settings.register(MODULE_ID, "quickHackMode", {
    name: "Quick Hack launcher mode", scope: "client", config: false, type: Boolean, default: false
  });
  game.settings.register(MODULE_ID, "showSkillModifiers", {
    name: "Show Skill Modifiers",
    hint: "Show modifiers and skill percentages when choosing a character's skill. Display only; does not change rolls.",
    scope: "world", config: true, type: Boolean, default: false
  });
  game.settings.register(MODULE_ID, "defaultRollSource", {
    name: "Hacking Roll Source",
    hint: "System skill roll uses the system's dialog. Roll from character sheet uses a chat result. Custom dice roll uses your dice and modifiers. Used as the initial choice for new attached hacks.",
    scope: "world", config: true, type: String, default: getDefaultRollSource(),
    choices: { custom: "Custom dice roll", system: "System skill roll", sheet: "Roll from character sheet" }
  });
  game.settings.register(MODULE_ID, "defaultStaticModifier", {
    name: "Hacking Custom Static Modifier",
    hint: "Extra adjustment for custom checks. Negative numbers subtract. Used as the initial choice for new attached hacks; existing hacks keep their own settings.",
    scope: "world", config: true, type: Number, default: 0
  });
  game.settings.register(MODULE_ID, "defaultDiceCount", {
    name: "Hacking Custom Dice Count",
    hint: "Roll this many dice and keep one result in Custom dice roll mode.",
    scope: "world", config: true, type: Number, default: 1,
    choices: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [index + 1, String(index + 1)]))
  });
  game.settings.register(MODULE_ID, "defaultKeepResult", {
    name: "Hacking Custom Result",
    hint: "Keep the best or worst die. Best means highest when high rolls are positive, and lowest when low rolls are positive.",
    scope: "world", config: true, type: String, default: "best",
    choices: { best: "Keep best", worst: "Keep worst" }
  });
  game.settings.register(MODULE_ID, "defaultDieSides", {
    name: "Hacking Check Die",
    hint: "Choose a standard or system-registered numbered die. The last launcher choice is saved here and used initially for new attached hacks.",
    scope: "world", config: true, type: Number, default: isCoC7System() ? 100 : 20,
    choices: () => Object.fromEntries(getDieOptions(game.settings.get(MODULE_ID, "defaultDieSides")).map(({ value, label }) => [value, label]))
  });
  game.settings.register(MODULE_ID, "defaultRollDirection", {
    name: "Hacking Positive Rolls",
    hint: "High: meet or exceed the DC. Low: meet or roll under the DC. Natural best/worst faces also follow this choice. Skill modifiers are still added as shown.",
    scope: "world", config: true, type: String, default: isCoC7System() ? "low" : "high",
    choices: { high: "High rolls are positive", low: "Low rolls are positive" }
  });
  game.settings.register(MODULE_ID, "defaultDc", {
    name: "Default Hacking DC",
    hint: "Used by the GM launcher and API calls that omit a DC.",
    scope: "world",
    config: true,
    type: Number,
    default: 15
  });

  game.settings.register(MODULE_ID, "traceDurationMultiplier", {
    name: "Default Trace Duration Multiplier",
    hint: "Multiplies trace timers for all HoloSuite hacking minigames.",
    scope: "world",
    config: true,
    type: Number,
    default: 1
  });

  game.settings.register(MODULE_ID, "nodeTakeoverDurationSeconds", {
    name: "Node Takeover Duration Override",
    hint: "Optional fixed seconds for claiming a Node Intrusion node. Set to 0 to use the selected difficulty profile.",
    scope: "world",
    config: true,
    type: Number,
    default: 0
  });

  game.settings.registerMenu(MODULE_ID, "difficultyProfilesMenu", {
    name: "Difficulty Profiles",
    label: "Configure Profiles",
    hint: "Tune Node Intrusion, Signal Alignment, Packet Switchboard, and Prism Lock difficulty settings.",
    icon: "fas fa-sliders",
    type: DifficultyProfilesApp,
    restricted: true
  });

  game.settings.register(MODULE_ID, "difficultyProfileOverrides", {
    name: "Difficulty Profile Data",
    hint: "Internal storage for the Difficulty Profiles configuration menu.",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  game.settings.register(MODULE_ID, "allowPlayerInteraction", {
    name: "Allow Players To Interact Directly",
    hint: "Reserved for future player-targeted play. The GM launcher remains GM-only for now.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, "defaultLiveAudience", {
    name: "Default Live Hacking Audience",
    hint: "Choose who receives a read-only live view when a player begins a hacking challenge.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      none: "Nobody",
      gm: "GM only",
      everyone: "GM and players"
    },
    default: "everyone"
  });

  game.settings.register(MODULE_ID, "watchOtherHacks", {
    name: "Watch Other Players' Hacks",
    hint: "Automatically open read-only live views for hacks included in the GM's selected audience. This preference only affects your client.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: (enabled: boolean) => {
      if (enabled) requestLiveSessionSync();
      else closeSpectatorSessions();
    }
  });

  game.settings.register(MODULE_ID, "visualGlitchIntensity", {
    name: "Visual Glitch Intensity",
    hint: "Global visual preference. Difficulty profiles still apply their own gameplay tuning.",
    scope: "client",
    config: true,
    type: String,
    choices: {
      low: "Low",
      medium: "Medium",
      high: "High"
    },
    default: "medium"
  });
}

function registerMinigames() {
  registerMinigame({
    id: "node-intrusion",
    title: "Node Intrusion",
    icon: "fa-solid fa-network-wired",
    create: (options: any) => new NodeIntrusionApp(options)
  });

  registerMinigame({
    id: "signal-alignment",
    title: "Signal Alignment",
    icon: "fa-solid fa-wave-square",
    create: (options: any) => new SignalAlignmentApp(options)
  });

  registerMinigame({
    id: "packet-switchboard",
    title: "Packet Switchboard",
    icon: "fa-solid fa-shuffle",
    create: (options: any) => new PacketSwitchboardApp(options)
  });

  registerMinigame({
    id: "prism-lock",
    title: "Prism Lock",
    icon: "fa-solid fa-bullseye",
    create: (options: any) => new PrismLockApp(options)
  });
}

function openLauncher() {
  if (!game.user?.isGM) {
    ui.notifications?.warn?.("Only the GM can open HoloSuite Hacking.");
    return null;
  }

  launcherApp = launcherApp ?? new HackingLauncherApp({ api });
  launcherApp.render(true);
  return launcherApp;
}

function exposeApi() {
  api = api ?? createHackingApi({ moduleId: MODULE_ID, openLauncher, openConfiguration: openHackConfiguration, createLiveController });
  api.sendHackToPlayer = sendHackToPlayer;
  api.registerWithHoloSuite = tryRegisterWithHoloSuite;
  const foundryModule = game.modules.get(MODULE_ID);
  if (foundryModule) foundryModule.api = api;
  game.holosuiteHacking = api;
  return api;
}

function sendHackToPlayer(options: any = {}) {
  if (!game.user?.isGM) {
    ui.notifications?.warn?.("Only the GM can send HoloSuite hacking challenges.");
    return false;
  }
  if (!game.socket) {
    ui.notifications?.error?.("Foundry sockets are not available.");
    return false;
  }

  const payload = sanitizeLaunchPayload(options);
  const targetUser = getUserById(payload.userId);
  if (payload.quickOutcome && (!targetUser || targetUser.isGM || targetUser.active === false)) {
    ui.notifications?.warn?.("Choose a connected player for Quick Hack.");
    return false;
  }
  const actor = resolveHackerActor(payload.actorId, targetUser);
  if (!actor) {
    console.warn(`${MODULE_ID} | Could not resolve hacker actor.`, {
      actorId: payload.actorId,
      userId: payload.userId,
      availableUsers: getWorldUsers().map((user) => ({ id: user.id, name: user.name, isGM: user.isGM })),
      userCharacter: getUserCharacter(targetUser),
      ownedActors: getUserOwnedActors(targetUser).map((ownedActor) => ({ id: ownedActor.id, name: ownedActor.name }))
    });
  } else if (targetUser && !actorIsOwnedByUser(actor, targetUser)) {
    console.warn(`${MODULE_ID} | ${targetUser.name} does not appear to own ${actor.name}; sending fallback roll data anyway.`);
  }

  const skillData = payload.quickOutcome ? null : getSkillData(actor, payload.skillId);
  const skillLabel = payload.quickOutcome ? "GM-selected outcome" : payload.skillLabel || getSkillLabel(payload.skillId, skillData);
  const skillModifier = skillData != null ? getSkillModifier(skillData) : payload.skillModifier;

  if (typeof options.onSuccess === "function" || typeof options.onFailure === "function") {
    const timeoutId = window.setTimeout(() => pendingCallbacks.delete(payload.requestId), PENDING_CALLBACK_TTL_MS);
    pendingCallbacks.set(payload.requestId, {
      onSuccess: typeof options.onSuccess === "function" ? options.onSuccess : null,
      onFailure: typeof options.onFailure === "function" ? options.onFailure : null,
      timeoutId
    });
  }

  game.socket.emit(SOCKET_NAME, {
    type: "launch-request",
    payload: {
      ...payload,
      actorId: actor?.id ?? "",
      actorName: actor?.name ?? targetUser?.name ?? "Hacker",
      skillLabel,
      skillModifier,
      gmUserId: game.user.id
    }
  });
  ui.notifications?.info?.(`${getMinigameTitle(payload.minigameType)} sent${targetUser ? ` to ${targetUser.name}` : " to players"}.`);
  return true;
}

function receiveSocketMessage(message: any) {
  try {
    if (String(message?.type ?? "").startsWith("live-")) {
      receiveLiveMessage(message);
      return;
    }
    if (message?.type === "result-report") {
      receiveResultReport(message.payload ?? {});
      return;
    }
    if (message?.type !== "launch-request") return;
    const payload = sanitizeLaunchPayload(message.payload ?? {});
    if (payload.userId && payload.userId !== game.user?.id) return;
    if (!payload.userId && game.user?.isGM) return;
    if (payload.quickOutcome && !getUserById(payload.gmUserId)?.isGM) return;

    new Dialog({
      title: getMinigameTitle(payload.minigameType),
      content: renderStartPrompt(payload),
      buttons: {
        start: {
          icon: '<i class="fa-solid fa-terminal"></i>',
          label: payload.quickOutcome ? "HACK" : "Accept and roll",
          callback: async () => startPlayerHack(payload)
        }
      },
      default: "start"
    }, {
      classes: ["holosuite-hacking-start-dialog"],
      width: 520,
      height: 320,
      resizable: true
    }).render(true);
  } catch (error) {
    console.error(`${MODULE_ID} | Failed to handle hacking launch request.`, error);
    ui.notifications?.error?.("HoloSuite Hacking launch failed. See console for details.");
  }
}

function createLiveController(payload: any) {
  const sessionId = String(payload.requestId ?? foundry.utils.randomID());
  const enabled = normalizeLiveAudience(payload.liveAudience) !== "none";
  if (!enabled) {
    return {
      start: () => {},
      publish: null,
      end: null,
      cancel: () => {}
    };
  }
  const session: any = {
    sessionId,
    audience: normalizeLiveAudience(payload.liveAudience),
    hackerUserId: String(game.user?.id ?? payload.userId ?? ""),
    gmUserId: String(payload.gmUserId ?? ""),
    startPayload: null,
    latestState: null,
    lastSentAt: 0,
    timeoutId: null,
    started: false
  };

  const emitState = () => {
    session.timeoutId = null;
    if (!enabled || !session.started || !session.latestState) return;
    session.lastSentAt = Date.now();
    game.socket?.emit?.(SOCKET_NAME, {
      type: "live-state",
      payload: {
        sessionId,
        hackerUserId: session.hackerUserId,
        audience: session.audience,
        state: session.latestState
      }
    });
  };

  const publish = (state: any, { immediate = false } = {}) => {
    if (!enabled || !state) return;
    session.latestState = state;
    if (!session.started) return;
    const remaining = LIVE_STATE_INTERVAL_MS - (Date.now() - session.lastSentAt);
    if (immediate || remaining <= 0) {
      if (session.timeoutId) window.clearTimeout(session.timeoutId);
      emitState();
    } else if (!session.timeoutId) {
      session.timeoutId = window.setTimeout(emitState, remaining);
    }
  };

  const start = (data: any) => {
    if (!enabled || !data) return;
    session.started = true;
    session.startPayload = {
      sessionId,
      audience: session.audience,
      hackerUserId: session.hackerUserId,
      gmUserId: session.gmUserId,
      minigameType: String(data.type ?? payload.minigameType),
      options: data.options ?? {},
      state: data.state ?? null
    };
    session.latestState = data.state ?? session.latestState;
    controllerSessions.set(sessionId, session);
    game.socket?.emit?.(SOCKET_NAME, { type: "live-start", payload: session.startPayload });
    if (session.latestState) publish(session.latestState, { immediate: true });
  };

  const end = (state: any = null) => {
    if (session.timeoutId) window.clearTimeout(session.timeoutId);
    if (state) session.latestState = state;
    controllerSessions.delete(sessionId);
    if (!enabled || !session.started) return;
    game.socket?.emit?.(SOCKET_NAME, {
      type: "live-end",
      payload: {
        sessionId,
        hackerUserId: session.hackerUserId,
        audience: session.audience,
        state: session.latestState
      }
    });
    session.started = false;
  };

  const cancel = () => {
    if (session.timeoutId) window.clearTimeout(session.timeoutId);
    controllerSessions.delete(sessionId);
    session.started = false;
  };

  return { start, publish, end, cancel };
}

function receiveLiveMessage(message: any) {
  const payload = message?.payload ?? {};
  if (message.type === "live-sync-request") {
    const observerUserId = String(payload.observerUserId ?? "");
    if (!observerUserId || observerUserId === game.user?.id) return;
    for (const session of controllerSessions.values()) {
      if (!session.started || !session.startPayload) continue;
      game.socket?.emit?.(SOCKET_NAME, {
        type: "live-start",
        payload: { ...session.startPayload, state: session.latestState, observerUserId }
      });
    }
    return;
  }

  const observerUserId = String(payload.observerUserId ?? "");
  if (observerUserId && observerUserId !== game.user?.id) return;
  if (!shouldObserveLiveSession(payload)) return;

  const sessionId = String(payload.sessionId ?? "");
  if (!sessionId) return;
  if (message.type === "live-start") {
    openSpectatorSession(payload);
    return;
  }

  const app = spectatorApps.get(sessionId);
  if (!app) return;
  if (payload.state) app.applyLiveState?.(payload.state);
  if (message.type === "live-end") {
    spectatorApps.delete(sessionId);
    app.markLiveSessionEnded?.();
    if (!payload.state?.state?.result) app.close?.();
  }
}

function shouldObserveLiveSession(payload: any) {
  if (!game.user || String(payload.hackerUserId ?? "") === game.user.id) return false;
  if (!game.settings.get(MODULE_ID, "watchOtherHacks")) return false;
  const audience = normalizeLiveAudience(payload.audience);
  if (audience === "none") return false;
  if (audience === "gm") return Boolean(game.user.isGM);
  return true;
}

function closeSpectatorSessions() {
  const apps = [...spectatorApps.values()];
  spectatorApps.clear();
  for (const app of apps) app.close?.();
}

function openSpectatorSession(payload: any) {
  const sessionId = String(payload.sessionId ?? "");
  if (spectatorApps.has(sessionId)) {
    if (payload.state) spectatorApps.get(sessionId)?.applyLiveState?.(payload.state);
    return;
  }
  const options = payload.options ?? {};
  const minigameType = String(payload.minigameType ?? options.type ?? "node-intrusion");
  const safeSessionId = sessionId.replace(/[^A-Za-z0-9_-]/g, "");
  const app = api.startHack({
    ...options,
    id: `holosuite-${minigameType}-spectator-${safeSessionId}`,
    type: minigameType,
    liveSessionId: sessionId,
    readOnly: true,
    chatOnResult: false,
    onSuccess: null,
    onFailure: null
  });
  if (!app) return;
  const originalClose = app.close.bind(app);
  app.close = async (...args) => {
    spectatorApps.delete(sessionId);
    return originalClose(...args);
  };
  spectatorApps.set(sessionId, app);
  if (payload.state) app.applyLiveState?.(payload.state);
}

function requestLiveSessionSync() {
  if (!game.user?.id) return;
  game.socket?.emit?.(SOCKET_NAME, {
    type: "live-sync-request",
    payload: { observerUserId: game.user.id }
  });
}

async function startPlayerHack(payload: any) {
  const actor = resolveHackerActor(payload.actorId, getUserById(payload.userId) ?? game.user);

  const rollResult: any = payload.quickOutcome ? { total: null, naturalRoll: null, rollSource: "gm" } : await rollPlayerSkill(payload, actor);
  if (!payload.quickOutcome && !Number.isFinite(rollResult?.total)) return null;

  const liveController = createLiveController(payload);
  const options = {
    quickOutcome: payload.quickOutcome,
    rollTotal: rollResult.total,
    naturalRoll: rollResult.naturalRoll,
    dieSides: rollResult.dieSides,
    rollDirection: rollResult.rollDirection,
    rollSource: rollResult.rollSource,
    diceCount: rollResult.diceCount,
    keepResult: rollResult.keepResult,
    staticModifier: rollResult.staticModifier,
    systemOutcome: rollResult.systemOutcome,
    dc: payload.quickOutcome ? null : payload.dc,
    actorId: payload.actorId,
    actorName: actor?.name ?? payload.actorName ?? "Hacker",
    userId: payload.userId,
    skillId: payload.skillId,
    liveSessionId: payload.requestId,
    onLiveState: liveController.publish,
    onLiveEnd: liveController.end,
    onSuccess: (result: any) => reportPlayerResult(payload, result),
    onFailure: (result: any) => reportPlayerResult(payload, result)
  };

  const app = api.startHack({ ...options, type: payload.minigameType });
  if (!app) {
    liveController.cancel();
    return null;
  }
  liveController.start(app.getLiveSessionData?.());
  return app;
}

async function rollPlayerSkill(payload: any, actor: any) {
  return rollSkillCheck({
    ...payload,
    actor,
    flavor: `${escapeHtml(getMinigameTitle(payload.minigameType))}: ${escapeHtml(payload.skillLabel || payload.skillId || "Skill")} vs DC ${Number(payload.dc)} (${getRollOptions(payload).rollDirection === "low" ? "low" : "high"} rolls are positive)`
  });
}

function reportPlayerResult(payload: any, result: any) {
  game.socket?.emit?.(SOCKET_NAME, {
    type: "result-report",
    payload: {
      requestId: payload.requestId,
      gmUserId: payload.gmUserId,
      result
    }
  });
}

function receiveResultReport(payload: any = {}) {
  if (!game.user?.isGM || payload.gmUserId !== game.user.id) return;
  const callbacks = pendingCallbacks.get(payload.requestId);
  pendingCallbacks.delete(payload.requestId);
  if (callbacks?.timeoutId) window.clearTimeout(callbacks.timeoutId);

  const result = payload.result ?? {};
  if (result.result === "success") callbacks?.onSuccess?.(result);
  else callbacks?.onFailure?.(result);
}

function renderStartPrompt(payload: any) {
  if (payload.quickOutcome) {
    const label = payload.quickOutcome === "failure_but_playable" ? "Failure" : DIFFICULTY_PROFILES[payload.quickOutcome].label;
    return `<section class="holosuite-hacking-start-prompt"><p>Quick Hack</p>
      <h2>${escapeHtml(getMinigameTitle(payload.minigameType))}</h2>
      <div>Result: ${escapeHtml(label)}</div></section>`;
  }
  // Native percentile checks choose their difficulty in the roll dialog, not via the hacking DC.
  const difficulty = payload.rollSource === "system" && isCoC7System()
    ? "Set when rolling" : String(Number(payload.dc));
  return `
    <section class="holosuite-hacking-start-prompt">
      <p>Incoming hacking challenge</p>
      <h2>${escapeHtml(getMinigameTitle(payload.minigameType))}</h2>
      <div>Difficulty: ${escapeHtml(difficulty)}</div>
    </section>
  `;
}

function sanitizeLaunchPayload(payload: any = {}) {
  const quickOutcome = normalizeQuickOutcome(payload.quickOutcome);
  const defaultDc = Number(game.settings.get(MODULE_ID, "defaultDc") ?? 15);
  const defaultLiveAudience = normalizeLiveAudience(game.settings.get(MODULE_ID, "defaultLiveAudience"));
  return {
    ...(quickOutcome ? { rollSource: "gm" } : getRollOptions(payload)),
    quickOutcome,
    requestId: String(payload.requestId ?? foundry.utils.randomID()),
    minigameType: String(payload.minigameType ?? payload.type ?? "node-intrusion"),
    userId: String(payload.userId ?? ""),
    actorId: String(payload.actorId ?? ""),
    actorName: String(payload.actorName ?? ""),
    skillId: String(payload.skillId ?? ""),
    skillLabel: String(payload.skillLabel ?? ""),
    skillModifier: Number(payload.skillModifier ?? 0),
    dc: Number(payload.dc ?? defaultDc),
    gmUserId: String(payload.gmUserId ?? ""),
    liveAudience: normalizeLiveAudience(payload.liveAudience ?? defaultLiveAudience)
  };
}

function normalizeLiveAudience(value: any) {
  const audience = String(value ?? "everyone");
  return ["none", "gm", "everyone"].includes(audience) ? audience : "everyone";
}

function resolveHackerActor(actorId: string, user: any) {
  const chosenActor = getActorById(actorId);
  if (chosenActor) return chosenActor;

  const character = getUserCharacter(user);
  if (character) return character;

  const ownedActors = getUserOwnedActors(user);
  if (ownedActors.length === 1) return ownedActors[0];

  const selectedActor = getSelectedTokenActor();
  if (selectedActor && actorIsOwnedByUser(selectedActor, user)) return selectedActor;

  return null;
}

function getMinigameTitle(type: string) {
  return api?.getMinigames?.().find((minigame) => minigame.id === type)?.title ?? String(type ?? "Hacking");
}

function tryRegisterWithHoloSuite() {
  const holosuite = game.modules.get("holosuite-core")?.api ?? game.holosuite;
  if (typeof holosuite?.registerApp !== "function") return false;

  holosuite.unregisterApp?.("node-intrusion");

  // TODO: Replace this simple app registration with a richer HoloSuite Core
  // integration once Core exposes player routing and app manifests.
  holosuite.registerApp({
    id: MODULE_ID,
    title: "HoloSuite Hacking",
    icon: "fa-solid fa-terminal",
    premium: false,
    featureId: MODULE_ID,
    playerVisible: false,
    description: "Reusable hacking minigames for terminals, traces, and signal puzzles.",
    open: () => openLauncher()
  });
  return true;
}

Hooks.once("init", () => {
  registerSettings();
  registerMinigames();
  exposeApi();
});

Hooks.once("ready", () => {
  exposeApi();
  game.socket?.on?.(SOCKET_NAME, receiveSocketMessage);
  window.setTimeout(requestLiveSessionSync, 250);
  tryRegisterWithHoloSuite();
  window.setTimeout(() => tryRegisterWithHoloSuite(), 500);
  console.log(`${MODULE_ID} | Ready. API available at game.modules.get("${MODULE_ID}").api`);
});
