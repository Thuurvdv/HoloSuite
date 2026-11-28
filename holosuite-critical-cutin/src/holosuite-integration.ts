import { MODULE_ID, SETTINGS, setting } from "./settings";
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
  api.unregisterApp?.(`${MODULE_ID}-box-of-doom`);

  api.registerApp({
    brandingInApp: true,
    id: MODULE_ID,
    title: "Critical Cut-In",
    icon: "fa-solid fa-bolt-lightning",
    premium: false,
    playerVisible: false,
    description: "Set up cut-ins for critical rolls or start a Glory Roll.",
    enabled: setting(SETTINGS.enabled),
    open: () => openPlayerConfig()
  });
  api.registerWhatsNew?.({
    moduleId: MODULE_ID,
    title: "Critical Cut-In",
    tier: "free",
    version: "2.0.0",
    updated: "2026-11-28",
    icon: "fa-solid fa-bolt-lightning",
    entries: [
      {
        title: "New cut-in editor",
        summary: "Browse 15 animations, reorder characters, and set up criticals for rolls like 2d6.",
        tags: ["Foundry v12-v14"]
      },
      {
        title: "Glory Roll",
        summary: "Pick who rolls, enter a formula, and show the result to the table."
      }
    ]
  });
  console.log(`${MODULE_ID} | Registered with HoloSuite.`);
  return true;
}

export function unregisterHoloSuiteIntegration() {
  const api = getHoloSuiteApi();
  api?.unregisterApp?.(MODULE_ID);
  api?.unregisterApp?.(`${MODULE_ID}-box-of-doom`);
}
