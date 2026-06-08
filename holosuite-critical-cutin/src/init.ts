import { MODULE_ID, MODULE_TITLE, registerSettings } from "./settings";
import { playCutin } from "./cutin-animation";
import { broadcastPayload, createManualPayloadForActor, createManualPayloadForUser, registerRollDetection } from "./roll-detector";
import { openPlayerConfig, PlayerConfigApp } from "./player-config-app";
import { registerHoloSuiteIntegration } from "./holosuite-integration";

declare const game: any;
declare const Hooks: any;
declare const loadTemplates: any;

function exposeApi() {
  const api = {
    playCutinForUser(userId: string, options: any = {}) {
      const payload = createManualPayloadForUser(userId, options);
      if (game.user?.isGM) broadcastPayload(payload);
      else playCutin(payload);
      return payload;
    },
    playCutinForActor(actorId: string, options: any = {}) {
      const payload = createManualPayloadForActor(actorId, options);
      if (game.user?.isGM) broadcastPayload(payload);
      else playCutin(payload);
      return payload;
    },
    openConfig: openPlayerConfig
  };

  const foundryModule = game.modules.get(MODULE_ID);
  if (foundryModule) foundryModule.api = api;
  game.holosuiteCriticalCutin = api;
  return api;
}

Hooks.once("init", async () => {
  registerSettings(PlayerConfigApp);
  exposeApi();
  await loadTemplates([`modules/${MODULE_ID}/templates/player-config.hbs`]);
});

Hooks.once("ready", () => {
  exposeApi();
  registerRollDetection();
  registerHoloSuiteIntegration();
  console.log(`${MODULE_ID} | Ready. API available at game.modules.get("${MODULE_ID}").api`);
});

Hooks.on("hotReload", () => {
  registerHoloSuiteIntegration();
});

console.log(`${MODULE_TITLE} | Loading.`);
