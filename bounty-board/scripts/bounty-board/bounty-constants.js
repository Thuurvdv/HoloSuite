export const MODULE_ID = "bounty-board";
export const MODULE_TITLE = "Bounty Board";
export const SETTING_BOUNTIES = "bounties";
export const SETTING_POST_PUBLISH_CHAT = "postPublishChat";
export const SETTING_POST_RESULT_CHAT = "postResultChat";
export const SETTING_PUBLIC_DOCUMENT_LINKS = "publicDocumentLinks";

export const TEMPLATE_ROOT = `modules/${MODULE_ID}/templates`;

export const BOUNTY_STATUSES = Object.freeze({
  AVAILABLE: "available",
  CLAIMED: "claimed",
  COMPLETED: "completed",
  FAILED: "failed",
  HIDDEN: "hidden",
  ARCHIVED: "archived"
});

export const STATUS_LABELS = Object.freeze({
  [BOUNTY_STATUSES.AVAILABLE]: "Available",
  [BOUNTY_STATUSES.CLAIMED]: "Claimed",
  [BOUNTY_STATUSES.COMPLETED]: "Completed",
  [BOUNTY_STATUSES.FAILED]: "Failed",
  [BOUNTY_STATUSES.HIDDEN]: "Hidden",
  [BOUNTY_STATUSES.ARCHIVED]: "Archived"
});

export const THREAT_LEVELS = Object.freeze(["Low", "Moderate", "High", "Severe", "Extreme"]);

export const DEFAULT_TAGS = Object.freeze([
  "Smuggling",
  "Assassination",
  "Rescue",
  "Investigation",
  "Monster Hunt",
  "Recovery",
  "Escort",
  "Sabotage"
]);

export const EMPTY_BOUNTY = Object.freeze({
  id: "",
  title: "",
  targetName: "",
  description: "",
  longDescription: "",
  rewardAmount: 0,
  rewardCurrency: "credits",
  threatLevel: "Moderate",
  faction: "",
  location: "",
  tags: [],
  status: BOUNTY_STATUSES.AVAILABLE,
  image: "",
  createdAt: "",
  updatedAt: "",
  published: false,
  claimedBy: "",
  notesGM: "",
  notesPublic: "",
  linkedJournalId: "",
  linkedSceneId: ""
});
