import { MODULE_ID, MODULE_TITLE, TEMPLATE_ROOT } from "./bounty-constants";
import { applyDetailColor } from "./bounty-appearance";
import { openBounty, openBountyBoard, refreshBountyBoard } from "./bounty-board-app";
import { openBountyHandout, showBountyHandout, registerHandoutHooks } from "./bounty-handout";
import {
  archiveBounty,
  claimBounty,
  deleteBounty,
  getAllBounties,
  getBounty,
  getBountiesForScene,
  getBountiesForActor,
  linkBountyTarget,
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
  "BOUNTYBOARD.Settings.DetailColor.Name": "Detail color",
  "BOUNTYBOARD.Settings.DetailColor.Hint": "Choose the reward text, border, and background color on your cards and handouts. Updates immediately and only affects your display.",
  "BOUNTYBOARD.Settings.DetailColor.Pink": "Hot Pink",
  "BOUNTYBOARD.Settings.DetailColor.Yellow": "Bright Yellow",
  "BOUNTYBOARD.Settings.DetailColor.Green": "Neon Green",
  "BOUNTYBOARD.Settings.LargeCards.Name": "Use Large Bounty Cards",
  "BOUNTYBOARD.Settings.LargeCards.Hint": "Use larger portraits with the title and details below the image. Enabled by default. Disable for compact cards; changes apply immediately to your board.",
  "BOUNTYBOARD.Status.Private": "Private",
  "BOUNTYBOARD.Handout.Title": "Contract handout",
  "BOUNTYBOARD.Handout.Close": "Close handout",
  "BOUNTYBOARD.Handout.Wanted": "Wanted",
  "BOUNTYBOARD.Handout.Briefing": "Contract briefing",
  "BOUNTYBOARD.Handout.PublicNotes": "Public notes",
  "BOUNTYBOARD.Handout.Open": "Open handout",
  "BOUNTYBOARD.Handout.Show": "Show to players",
  "BOUNTYBOARD.Handout.Shared": "A contract handout has been shared with you.",
  "BOUNTYBOARD.Handout.Unavailable": "This contract handout is no longer available.",
  "BOUNTYBOARD.Handout.PublishFirst": "Publish this contract and show the board to players before sharing its handout.",
  "BOUNTYBOARD.Link.DropHint": "Drop Actor / Token onto this bounty to link its target",
  "BOUNTYBOARD.Link.Unlink": "Unlink target",
  "BOUNTYBOARD.Link.Invalid": "Drop a world Actor or Token onto a bounty.",
  "BOUNTYBOARD.Link.MissingBounty": "Bounty not found.",

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
  "BOUNTYBOARD.Filter.MissionType": "Mission type",
  "BOUNTYBOARD.Filter.Threat": "Danger",
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
  "BOUNTYBOARD.Editor.Scene": "Location / Scene",
  "BOUNTYBOARD.Editor.NoScene": "No linked scene",
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
    getBountiesForScene,
    getBountiesForActor,
    linkBountyTarget,
    openBounty,
    openHandout: openBountyHandout,
    showHandout: showBountyHandout,
    upsertBounty,
    deleteBounty,
    publishBounty,
    setBountiesPublished,
    setBoardVisibleToPlayers,
    archiveBounty,
    claimBounty,
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
    `${TEMPLATE_ROOT}/bounty-chat-card.hbs`,
    `${TEMPLATE_ROOT}/bounty-handout.hbs`,
    `${TEMPLATE_ROOT}/bounty-handout-chat.hbs`
  ]);
});

Hooks.once("ready", () => {
  applyDetailColor();
  Hooks.on("bountyBoardLayoutChanged", () => refreshBountyBoard());
  registerHandoutHooks();
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
