import { MODULE_ID, MODULE_TITLE, SETTINGS, setting } from "./settings";
import { openPlayerConfig } from "./player-config-app";

declare const game: any;

function getHoloSuiteApi() {
  const requestedModuleApi = game.modules.get("holosuite")?.active ? game.modules.get("holosuite")?.api : null;
  const coreModuleApi = game.modules.get("holosuite-core")?.active ? game.modules.get("holosuite-core")?.api : null;
  return requestedModuleApi ?? coreModuleApi ?? game.holosuite ?? null;
}

export function registerHoloSuiteIntegration() {
  const api = getHoloSuiteApi();
  if (!api?.registerApp) return false;

  // HoloSuite integration point: this adds the module to the GM command panel when HoloSuite is active.
  api.registerApp({
    id: MODULE_ID,
    title: "Critical Cut-In",
    icon: "fa-solid fa-bolt-lightning",
    premium: false,
    playerVisible: false,
    description: "JRPG-style critical hit cut-in animation for natural d20 results.",
    enabled: setting(SETTINGS.enabled),
    open: () => openPlayerConfig()
  });
  api.registerWhatsNew?.({
    moduleId: MODULE_ID,
    title: "Critical Cut-In",
    tier: "free",
    version: "1.0.6",
    updated: "2026-09-02",
    icon: "fa-solid fa-bolt-lightning",
    entries: [
      {
        title: "Critical cut-ins for more dice",
        summary: "Choose from standard and registered dice, decide whether high or low results are positive, and configure separate success and failure thresholds for each character.",
        tags: ["Critical Cut-In", "Dice", "Thresholds", "Customization"]
      },
      {
        title: "More reliable cut-in detection",
        summary: "Improved Foundry 14 support and prevented old chat rolls, damage rolls, discarded dice, and rerolls from triggering unwanted animations.",
        tags: ["Critical Cut-In", "Bug Fix", "Foundry v12-v14", "Chat"]
      }
    ]
  });
  console.log(`${MODULE_ID} | Registered with HoloSuite.`);
  return true;
}

export function unregisterHoloSuiteIntegration() {
  const api = getHoloSuiteApi();
  api?.unregisterApp?.(MODULE_ID);
}
