import { normalizeDieSides, normalizeRollDirection } from "../../shared/src/dice-checks";

export const MODULE_ID = "holosuite-critical-cutin";
export const MODULE_TITLE = "HoloSuite Critical Cut-In";
export const SOCKET_NAME = `module.${MODULE_ID}`;
export const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/player-config.hbs`;

export const SETTINGS = {
  enabled: "enabled",
  dieSides: "dieSides",
  rollDirection: "rollDirection",
  threshold: "threshold",
  failureThreshold: "failureThreshold",
  duration: "duration",
  volume: "volume",
  audience: "audience",
  textEnabled: "textEnabled",
  animationFont: "animationFont",
  defaultText: "defaultText",
  defaultFailureText: "defaultFailureText",
  motionMode: "motionMode",
  flashMode: "flashMode",
  effectIntensity: "effectIntensity",
  shakeIntensity: "shakeIntensity",
  localVolume: "localVolume",
  suppressCutins: "suppressCutins",
  debug: "debug",
  playerConfigs: "playerConfigs"
};

export const AUDIENCE = {
  everyone: "everyone",
  gm: "gm",
  triggeringPlayer: "triggeringPlayer"
};

declare const foundry: any;
declare const game: any;

export function registerSettings(configAppClass: any) {
  game.settings.register(MODULE_ID, SETTINGS.effectIntensity, {
    name: "Local Effect Detail", hint: "Choose the density of decorative particles and the strength of glow on this device.",
    scope: "client", config: true, type: String, default: "standard",
    choices: { low: "Low", standard: "Standard", high: "High" }
  });
  game.settings.register(MODULE_ID, SETTINGS.shakeIntensity, {
    name: "Local Impact Shake", hint: "Shake the cut-in at impact. Reduced and still motion always disable shake.",
    scope: "client", config: true, type: Number, default: 0.5, range: { min: 0, max: 1, step: 0.1 }
  });
  game.settings.register(MODULE_ID, SETTINGS.enabled, {
    name: "Enable Critical Cut-In",
    hint: "Play a configured cut-in when a qualifying natural result is rolled on the selected die.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, SETTINGS.dieSides, {
    name: "Check Die",
    hint: "Configured in Configure Player Cut-Ins, where changes confirm the reset of all listed roll thresholds.",
    scope: "world", config: false, type: Number, default: 20
  });
  game.settings.register(MODULE_ID, SETTINGS.rollDirection, {
    name: "Positive Rolls",
    hint: "Configured in Configure Player Cut-Ins, together with the check die and roll thresholds.",
    scope: "world", config: false, type: String, default: "high",
    choices: { high: "High rolls are positive", low: "Low rolls are positive" }
  });

  game.settings.register(MODULE_ID, SETTINGS.threshold, {
    name: "Default Trigger Threshold",
    hint: "0 automatically uses the best die face. Otherwise success triggers at or above this value for high rolls, or at or below it for low rolls.",
    scope: "world",
    config: true,
    type: Number,
    default: 0
  });

  game.settings.register(MODULE_ID, SETTINGS.failureThreshold, {
    name: "Default Failure Trigger",
    hint: "0 automatically uses the worst die face. Otherwise failure triggers at or below this value for high rolls, or at or above it for low rolls.",
    scope: "world",
    config: true,
    type: Number,
    default: 0
  });

  game.settings.register(MODULE_ID, SETTINGS.duration, {
    name: "Animation Duration",
    hint: "How long the cut-in remains visible, in milliseconds.",
    scope: "world",
    config: true,
    type: Number,
    range: { min: 800, max: 8000, step: 100 },
    default: 2500
  });

  game.settings.register(MODULE_ID, SETTINGS.volume, {
    name: "Cut-In Audio Volume",
    hint: "Volume multiplier for configured cut-in audio samples.",
    scope: "world",
    config: true,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 0.8
  });

  game.settings.register(MODULE_ID, SETTINGS.audience, {
    name: "Show Animation To",
    hint: "Choose who sees synchronized cut-in playback.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      [AUDIENCE.everyone]: "Everyone",
      [AUDIENCE.gm]: "GM only",
      [AUDIENCE.triggeringPlayer]: "Triggering player only"
    },
    default: AUDIENCE.everyone
  });

  game.settings.register(MODULE_ID, SETTINGS.animationFont, {
    name: "Animation Font",
    hint: "Typeface for the cut-in label and actor name.",
    scope: "world", config: true, type: String, default: "aicon",
    choices: { aicon: "AICON", classic: "Classic (Orbitron / system fallback)" }
  });

  game.settings.register(MODULE_ID, SETTINGS.textEnabled, {
    name: "Enable Text Overlay",
    hint: "Show the configured label during the cut-in.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, SETTINGS.defaultText, {
    name: "Default Overlay Text",
    hint: "Fallback label used when no player-specific label is configured.",
    scope: "world",
    config: true,
    type: String,
    default: "CRITICAL"
  });

  game.settings.register(MODULE_ID, SETTINGS.defaultFailureText, {
    name: "Default Failure Overlay Text",
    hint: "Fallback label used when no failure-specific label is configured.",
    scope: "world",
    config: true,
    type: String,
    default: "CRITICAL FAILURE"
  });

  game.settings.register(MODULE_ID, SETTINGS.motionMode, {
    name: "Local Motion",
    hint: "Control cut-in motion on this device. System follows your operating-system reduced-motion preference.",
    scope: "client",
    config: true,
    type: String,
    choices: {
      system: "Follow system preference",
      full: "Full cinematic motion",
      reduced: "Reduced motion",
      still: "Still presentation"
    },
    default: "system"
  });

  game.settings.register(MODULE_ID, SETTINGS.flashMode, {
    name: "Local Flash Intensity",
    hint: "Reduce or disable the bright opening flash on this device.",
    scope: "client",
    config: true,
    type: String,
    choices: { full: "Full", soft: "Soft", off: "Off" },
    default: "soft"
  });

  game.settings.register(MODULE_ID, SETTINGS.localVolume, {
    name: "Local Cut-In Volume",
    hint: "Personal volume multiplier applied after the GM's cut-in volume setting.",
    scope: "client",
    config: true,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 1
  });

  game.settings.register(MODULE_ID, SETTINGS.suppressCutins, {
    name: "Hide Cut-Ins On This Device",
    hint: "Do not show or play critical cut-ins for this client.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, SETTINGS.debug, {
    name: "Debug Logging",
    hint: "Log roll detection and playback decisions to the console.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, SETTINGS.playerConfigs, {
    name: "Per-Player Cut-In Configuration",
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });

  game.settings.registerMenu(MODULE_ID, "playerConfigMenu", {
    name: "Configure Player Cut-Ins",
    label: "Open Configuration",
    hint: "Choose the check die and positive roll direction, and set each user or actor's roll thresholds, portrait, audio, label, accent color, and enable state.",
    icon: "fa-solid fa-bolt",
    type: configAppClass,
    restricted: true
  });
}

export function setting(key: string) {
  return game.settings.get(MODULE_ID, key);
}

export async function setSetting(key: string, value: any) {
  return game.settings.set(MODULE_ID, key, value);
}

export function normalizeDurationOverride(value: unknown): number | undefined {
  if (typeof value !== "number" && typeof value !== "string") return undefined;
  const duration = Number(value);
  return Number.isInteger(duration) && duration >= 800 && duration <= 8000 ? duration : undefined;
}

export function getThreshold() {
  return resolveThreshold(setting(SETTINGS.threshold), "success");
}

export function getFailureThreshold() {
  return resolveThreshold(setting(SETTINGS.failureThreshold), "failure");
}

export function getDieSides() {
  return normalizeDieSides(setting(SETTINGS.dieSides));
}

export function lowRollsAreGood() {
  return normalizeRollDirection(setting(SETTINGS.rollDirection)) === "low";
}

function resolveThreshold(value: any, kind: "success" | "failure") {
  const threshold = Number(value);
  if (Number.isInteger(threshold) && threshold >= 1 && threshold <= getDieSides()) return threshold;
  const useLowFace = (kind === "success") === lowRollsAreGood();
  return useLowFace ? 1 : getDieSides();
}

export function resultQualifies(value: number, threshold: number, kind: "success" | "failure") {
  const useLowFace = (kind === "success") === lowRollsAreGood();
  return useLowFace ? value <= threshold : value >= threshold;
}

export function getPlayerConfigs() {
  const configs = setting(SETTINGS.playerConfigs);
  return foundry.utils.deepClone(configs && typeof configs === "object" ? configs : {});
}

export async function savePlayerConfigs(configs: any) {
  return setSetting(SETTINGS.playerConfigs, configs && typeof configs === "object" ? configs : {});
}

export function debugLog(...args: any[]) {
  if (setting(SETTINGS.debug)) console.log(`${MODULE_ID} |`, ...args);
}
