import { MODULE_ID, MODULE_TITLE, TEMPLATE_ROOT } from "./bounty-constants";
import { openBountyBoard } from "./bounty-board-app";
import {
  archiveBounty,
  claimBounty,
  deleteBounty,
  getAllBounties,
  getBounty,
  publishBounty,
  registerSettings,
  upsertBounty
} from "./bounty-service";

declare const game: any;
declare const Hooks: any;
declare const Handlebars: any;
declare const loadTemplates: any;

function exposeApi() {
  const api = {
    open: openBountyBoard,
    getAllBounties,
    getBounty,
    upsertBounty,
    deleteBounty,
    publishBounty,
    archiveBounty,
    claimBounty,
    // Future extension hooks:
    // Patreon/premium gating can wrap open() or selected GM actions here.
    // Random bounty generator can call upsertBounty() with generated data.
    // Faction reputation systems can listen for completed/failed state changes.
    // Galaxy map integration can use location metadata.
    // CyberCall contact integration can add claimant/contact actions.
    // Security camera and crime scene modules can attach evidence links via notes or future document ids.
  };

  const foundryModule = game.modules.get(MODULE_ID);
  if (foundryModule) foundryModule.api = api;
  game.scifiSuite ??= {};
  game.scifiSuite.bountyBoard = api;
}

Hooks.once("init", async () => {
  registerSettings();
  exposeApi();

  Handlebars.registerHelper("bbEq", (left, right) => left === right);
  Handlebars.registerHelper("bbIncludes", (array, value) => Array.isArray(array) && array.includes(value));
  Handlebars.registerHelper("bbStatusClass", (status) => `bb-status--${String(status ?? "available").toLowerCase()}`);

  await loadTemplates([
    `${TEMPLATE_ROOT}/bounty-card.hbs`,
    `${TEMPLATE_ROOT}/bounty-board.hbs`,
    `${TEMPLATE_ROOT}/bounty-editor.hbs`,
    `${TEMPLATE_ROOT}/bounty-chat-card.hbs`
  ]);
});

Hooks.once("ready", () => {
  exposeApi();
  game.modules.get("holosuite-core")?.api?.registerApp?.({
    id: MODULE_ID,
    title: MODULE_TITLE,
    icon: "fa-solid fa-crosshairs",
    premium: false,
    description: "Open the sci-fi contract terminal.",
    open: () => openBountyBoard()
  });

  console.log(`${MODULE_ID} | Ready. API available at game.scifiSuite.bountyBoard.`);
});
