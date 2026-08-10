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
  setBoardVisibleToPlayers,
  setBountiesPublished,
  upsertBounty
} from "./bounty-service";

declare const game: any;
declare const foundry: any;
declare const Hooks: any;
declare const Handlebars: any;
declare const loadTemplates: any;

const LOCALIZATION_FALLBACKS: Record<string, string> = {
  "BOUNTYBOARD.Header.ContractTerminal": "Contract Terminal",
  "BOUNTYBOARD.Header.Title": "Bounty Board",
  "BOUNTYBOARD.Header.ActiveContracts": "{count} ACTIVE CONTRACTS",
  "BOUNTYBOARD.Header.ShowingContracts": "Showing {visible} of {total} contracts",
  "BOUNTYBOARD.Header.NewContract": "New Contract",
  "BOUNTYBOARD.Header.TerminalOptions": "Terminal options",
  "BOUNTYBOARD.Header.ShowFiltered": "Show filtered",
  "BOUNTYBOARD.Header.HideFiltered": "Hide filtered",
  "BOUNTYBOARD.Header.HideBoard": "Hide board",
  "BOUNTYBOARD.Header.ShowBoard": "Show board",
  "BOUNTYBOARD.Filter.Status": "Status",
  "BOUNTYBOARD.Filter.Threat": "Threat",
  "BOUNTYBOARD.Filter.Faction": "Faction",
  "BOUNTYBOARD.Filter.Tag": "Tags",
  "BOUNTYBOARD.Filter.Search": "Search",
  "BOUNTYBOARD.Filter.AllStatuses": "All",
  "BOUNTYBOARD.Filter.AllThreats": "All",
  "BOUNTYBOARD.Filter.AllFactions": "All",
  "BOUNTYBOARD.Filter.AllTags": "All",
  "BOUNTYBOARD.Filter.SearchPlaceholder": "Search contracts, targets, locations...",
  "BOUNTYBOARD.Filter.Clear": "Clear filters",
  "BOUNTYBOARD.Filter.RemoveTag": "Remove selected tag",
  "BOUNTYBOARD.Empty.Unavailable": "The bounty board is currently unavailable.",
  "BOUNTYBOARD.Empty.NoMatches": "No contracts match the current filters.",
  "BOUNTYBOARD.Editor.ContractId": "Contract ID",
  "BOUNTYBOARD.Card.ContractId": "Contract identifier",
  "BOUNTYBOARD.Card.Target": "Target",
  "BOUNTYBOARD.Card.Reward": "Reward",
  "BOUNTYBOARD.Card.Faction": "Faction",
  "BOUNTYBOARD.Card.Location": "Location",
  "BOUNTYBOARD.Card.Tags": "Tags",
  "BOUNTYBOARD.Card.Threat": "Threat",
  "BOUNTYBOARD.Card.Unlisted": "Unlisted",
  "BOUNTYBOARD.Card.Unknown": "Unknown",
  "BOUNTYBOARD.Card.DossierNotes": "Dossier notes",
  "BOUNTYBOARD.Card.ClaimedBy": "Claimed by",
  "BOUNTYBOARD.Card.AssignedParty": "Assigned party",
  "BOUNTYBOARD.Card.AssigneePlaceholder": "Party or player",
  "BOUNTYBOARD.Card.OpenImage": "Open target image",
  "BOUNTYBOARD.Card.OpenJournal": "Open linked journal",
  "BOUNTYBOARD.Card.Expand": "Expand contract details",
  "BOUNTYBOARD.Card.Collapse": "Collapse contract details",
  "BOUNTYBOARD.Card.ShowDetails": "Details",
  "BOUNTYBOARD.Card.HideDetails": "Hide",
  "BOUNTYBOARD.Action.Edit": "Edit",
  "BOUNTYBOARD.Action.Publish": "Publish",
  "BOUNTYBOARD.Action.Unpublish": "Unpublish",
  "BOUNTYBOARD.Action.Assign": "Assign",
  "BOUNTYBOARD.Action.More": "More",
  "BOUNTYBOARD.Action.Complete": "Complete",
  "BOUNTYBOARD.Action.Fail": "Mark failed",
  "BOUNTYBOARD.Action.Hide": "Hide",
  "BOUNTYBOARD.Action.Archive": "Archive",
  "BOUNTYBOARD.Action.Delete": "Delete",
  "BOUNTYBOARD.Action.Request": "Request contract"
};

function installLocalizationFallbacks() {
  const translations = game.i18n?.translations;
  if (!translations) return;
  for (const [key, fallback] of Object.entries(LOCALIZATION_FALLBACKS)) {
    const existing = foundry.utils.getProperty(translations, key);
    if (existing === undefined || existing === key) {
      foundry.utils.setProperty(translations, key, fallback);
    }
  }
}

function exposeApi() {
  const api = {
    open: openBountyBoard,
    getAllBounties,
    getBounty,
    upsertBounty,
    deleteBounty,
    publishBounty,
    setBountiesPublished,
    setBoardVisibleToPlayers,
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
  installLocalizationFallbacks();
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
  installLocalizationFallbacks();
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
