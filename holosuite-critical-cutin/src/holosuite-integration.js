import { MODULE_ID, MODULE_TITLE, SETTINGS, setting } from "./settings.js";
import { openPlayerConfig } from "./player-config-app.js";

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
  console.log(`${MODULE_ID} | Registered with HoloSuite.`);
  return true;
}

export function unregisterHoloSuiteIntegration() {
  const api = getHoloSuiteApi();
  api?.unregisterApp?.(MODULE_ID);
}
