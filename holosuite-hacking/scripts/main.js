import { createHackingApi } from "./core/hacking-api.js";
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
} from "./core/actor-skills.js";
import { registerMinigame } from "./core/minigame-runner.js";
import { HackingLauncherApp } from "./ui/hacking-launcher-app.js";
import { NodeIntrusionApp } from "./minigames/node-intrusion/node-intrusion-app.js";
import { SignalAlignmentApp } from "./minigames/signal-alignment/signal-alignment-app.js";

const MODULE_ID = "holosuite-hacking";
const SOCKET_NAME = `module.${MODULE_ID}`;
const PENDING_CALLBACK_TTL_MS = 10 * 60 * 1000;

let api = null;
let launcherApp = null;
const pendingCallbacks = new Map();

function registerSettings() {
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

  game.settings.register(MODULE_ID, "allowPlayerInteraction", {
    name: "Allow Players To Interact Directly",
    hint: "Reserved for future player-targeted play. The GM launcher remains GM-only for now.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
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
    create: (options) => new NodeIntrusionApp(options)
  });

  registerMinigame({
    id: "signal-alignment",
    title: "Signal Alignment",
    icon: "fa-solid fa-wave-square",
    create: (options) => new SignalAlignmentApp(options)
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

function renderLaunchControl(controls) {
  if (!game.user?.isGM) return;

  const onClick = () => openLauncher();
  const tool = {
    name: "holosuite-hacking-launch",
    title: "HoloSuite Hacking",
    icon: "fa-solid fa-terminal",
    button: true,
    visible: true,
    onClick,
    onChange: onClick
  };

  if (Array.isArray(controls)) {
    const tokenControls = controls.find((control) => control.name === "token") ?? controls[0];
    if (tokenControls?.tools && !tokenControls.tools.some?.((candidate) => candidate.name === tool.name)) {
      tokenControls.tools.push(tool);
    }
    return;
  }

  const record = controls ?? {};
  const tokenControls = record.tokens ?? record.token ?? Object.values(record)[0];
  if (!tokenControls?.tools || tokenControls.tools[tool.name]) return;
  tokenControls.tools[tool.name] = { ...tool, order: Object.keys(tokenControls.tools).length };
}

function exposeApi() {
  api = api ?? createHackingApi({ moduleId: MODULE_ID, openLauncher });
  api.sendHackToPlayer = sendHackToPlayer;
  api.registerWithHoloSuite = tryRegisterWithHoloSuite;
  const foundryModule = game.modules.get(MODULE_ID);
  if (foundryModule) foundryModule.api = api;
  game.holosuiteHacking = api;
  return api;
}

function sendHackToPlayer(options = {}) {
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

  const skillData = getSkillData(actor, payload.skillId);
  const skillLabel = payload.skillLabel || getSkillLabel(payload.skillId, skillData);
  const skillModifier = Number.isFinite(Number(payload.skillModifier)) && Number(payload.skillModifier) !== 0
    ? Number(payload.skillModifier)
    : getSkillModifier(skillData);

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
  console.log(`${MODULE_ID} | Sent hacking challenge`, {
    minigameType: payload.minigameType,
    userId: payload.userId,
    actorId: actor?.id ?? "",
    skillLabel,
    skillModifier
  });
  ui.notifications?.info?.(`${getMinigameTitle(payload.minigameType)} sent${targetUser ? ` to ${targetUser.name}` : " to players"}.`);
  return true;
}

function receiveSocketMessage(message) {
  try {
    if (message?.type === "result-report") {
      receiveResultReport(message.payload ?? {});
      return;
    }
    if (message?.type !== "launch-request") return;
    const payload = sanitizeLaunchPayload(message.payload ?? {});
    if (payload.userId && payload.userId !== game.user?.id) return;
    if (!payload.userId && game.user?.isGM) return;

    const actor = resolveHackerActor(payload.actorId, getUserById(payload.userId) ?? game.user);
    const actorName = payload.actorName || actor?.name || "Intruder";
    const skillLabel = payload.skillLabel || getSkillLabel(payload.skillId, getSkillData(actor, payload.skillId));
    new Dialog({
      title: getMinigameTitle(payload.minigameType),
      content: renderStartPrompt(payload, actorName, skillLabel),
      buttons: {
        start: {
          icon: '<i class="fa-solid fa-terminal"></i>',
          label: "Accept and roll",
          callback: async () => startPlayerHack(payload)
        }
      },
      default: "start"
    }, {
      classes: ["holosuite-hacking-start-dialog"]
    }).render(true);
  } catch (error) {
    console.error(`${MODULE_ID} | Failed to handle hacking launch request.`, error);
    ui.notifications?.error?.("HoloSuite Hacking launch failed. See console for details.");
  }
}

async function startPlayerHack(payload) {
  const actor = resolveHackerActor(payload.actorId, getUserById(payload.userId) ?? game.user);

  const rollResult = await rollFallbackSkill(payload);
  if (!Number.isFinite(rollResult?.total)) return null;

  const options = {
    rollTotal: rollResult.total,
    dc: payload.dc,
    actorId: payload.actorId,
    actorName: actor?.name ?? payload.actorName ?? "Hacker",
    userId: payload.userId,
    skillId: payload.skillId,
    onSuccess: (result) => reportPlayerResult(payload, result),
    onFailure: (result) => reportPlayerResult(payload, result)
  };

  console.log(`${MODULE_ID} | Starting player minigame`, {
    minigameType: payload.minigameType,
    rollTotal: rollResult.total,
    dc: payload.dc
  });

  if (payload.minigameType === "signal-alignment") return api.startSignalAlignment(options);
  return api.startNodeIntrusion(options);
}

async function rollFallbackSkill(payload) {
  try {
    const modifier = Number(payload.skillModifier ?? 0);
    const formula = `1d20 ${modifier >= 0 ? "+" : "-"} ${Math.abs(modifier)}`;
    const roll = await new Roll(formula).evaluate({ async: true });
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker(),
      flavor: `${escapeHtml(getMinigameTitle(payload.minigameType))}: ${escapeHtml(payload.skillLabel || payload.skillId || "Skill")} vs DC ${Number(payload.dc)}`
    });
    return { total: Number(roll.total), roll };
  } catch (error) {
    console.error(`${MODULE_ID} | Fallback skill roll failed.`, error);
    ui.notifications?.warn?.("HoloSuite Hacking skill check failed.");
    return null;
  }
}

function reportPlayerResult(payload, result) {
  console.log(`${MODULE_ID} | ${getMinigameTitle(payload.minigameType)} ${result.result}`, result);
  game.socket?.emit?.(SOCKET_NAME, {
    type: "result-report",
    payload: {
      requestId: payload.requestId,
      gmUserId: payload.gmUserId,
      result
    }
  });
}

function receiveResultReport(payload = {}) {
  if (!game.user?.isGM || payload.gmUserId !== game.user.id) return;
  const callbacks = pendingCallbacks.get(payload.requestId);
  pendingCallbacks.delete(payload.requestId);
  if (callbacks?.timeoutId) window.clearTimeout(callbacks.timeoutId);

  const result = payload.result ?? {};
  if (result.result === "success") callbacks?.onSuccess?.(result);
  else callbacks?.onFailure?.(result);
  console.log(`${MODULE_ID} | Player hacking result`, result);
}

function renderStartPrompt(payload, actorName, skillLabel) {
  return `
    <section class="holosuite-hacking-start-prompt">
      <p>Incoming hacking challenge</p>
      <h2>${escapeHtml(getMinigameTitle(payload.minigameType))}</h2>
      <div>${escapeHtml(actorName)} rolls ${escapeHtml(skillLabel)} vs DC ${Number(payload.dc)}</div>
    </section>
  `;
}

function sanitizeLaunchPayload(payload = {}) {
  const defaultDc = Number(game.settings.get(MODULE_ID, "defaultDc") ?? 15);
  return {
    requestId: String(payload.requestId ?? foundry.utils.randomID()),
    minigameType: String(payload.minigameType ?? payload.type ?? "node-intrusion"),
    userId: String(payload.userId ?? ""),
    actorId: String(payload.actorId ?? ""),
    actorName: String(payload.actorName ?? ""),
    skillId: String(payload.skillId ?? ""),
    skillLabel: String(payload.skillLabel ?? ""),
    skillModifier: Number(payload.skillModifier ?? 0),
    dc: Number(payload.dc ?? defaultDc),
    gmUserId: String(payload.gmUserId ?? "")
  };
}

function resolveHackerActor(actorId, user) {
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

function getMinigameTitle(type) {
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

Hooks.on("getSceneControlButtons", renderLaunchControl);

Hooks.once("ready", () => {
  exposeApi();
  game.socket?.on?.(SOCKET_NAME, receiveSocketMessage);
  tryRegisterWithHoloSuite();
  window.setTimeout(() => tryRegisterWithHoloSuite(), 500);
  console.log(`${MODULE_ID} | Ready. API available at game.modules.get("${MODULE_ID}").api`);
  console.log(`${MODULE_ID} | Test with game.modules.get("${MODULE_ID}").api.testNodeIntrusion() or .testSignalAlignment()`);
});
