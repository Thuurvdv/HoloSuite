export const MODULE_ID = "holosuite-critical-cutin";
export const MODULE_TITLE = "HoloSuite Critical Cut-In";
export const SOCKET_NAME = `module.${MODULE_ID}`;
export const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/player-config.hbs`;

export const SETTINGS = {
  enabled: "enabled",
  threshold: "threshold",
  duration: "duration",
  volume: "volume",
  audience: "audience",
  textEnabled: "textEnabled",
  defaultText: "defaultText",
  debug: "debug",
  playerConfigs: "playerConfigs"
};

export const AUDIENCE = {
  everyone: "everyone",
  gm: "gm",
  triggeringPlayer: "triggeringPlayer"
};

export function registerSettings(configAppClass) {
  game.settings.register(MODULE_ID, SETTINGS.enabled, {
    name: "Enable Critical Cut-In",
    hint: "Play a configured cut-in when a qualifying natural d20 result is rolled.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, SETTINGS.threshold, {
    name: "Default Trigger Threshold",
    hint: "Natural d20 results equal to or above this number trigger the cut-in. Example: 19 triggers on 19 and 20.",
    scope: "world",
    config: true,
    type: Number,
    range: { min: 1, max: 20, step: 1 },
    default: 20
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
    hint: "Set each user or actor portrait, audio sample, label, accent color, and enable state.",
    icon: "fa-solid fa-bolt",
    type: configAppClass,
    restricted: true
  });
}

export function setting(key) {
  return game.settings.get(MODULE_ID, key);
}

export async function setSetting(key, value) {
  return game.settings.set(MODULE_ID, key, value);
}

export function getThreshold() {
  return Math.min(20, Math.max(1, Number(setting(SETTINGS.threshold) || 20)));
}

export function getPlayerConfigs() {
  const configs = setting(SETTINGS.playerConfigs);
  return foundry.utils.deepClone(configs && typeof configs === "object" ? configs : {});
}

export async function savePlayerConfigs(configs) {
  return setSetting(SETTINGS.playerConfigs, configs && typeof configs === "object" ? configs : {});
}

export function debugLog(...args) {
  if (setting(SETTINGS.debug)) console.log(`${MODULE_ID} |`, ...args);
}
