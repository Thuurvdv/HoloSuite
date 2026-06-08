import {
  BOUNTY_STATUSES,
  DEFAULT_TAGS,
  EMPTY_BOUNTY,
  MODULE_ID,
  MODULE_TITLE,
  SETTING_BOUNTIES,
  SETTING_POST_PUBLISH_CHAT,
  SETTING_POST_RESULT_CHAT,
  SETTING_PUBLIC_DOCUMENT_LINKS,
  STATUS_LABELS,
  THREAT_LEVELS
} from "./bounty-constants";
import { postBountyChatCard } from "./bounty-chat";

declare const foundry: any;
declare const game: any;
declare const ui: any;
declare const Dialog: any;
declare const ChatMessage: any;

export type BountyData = {
  id: string;
  title: string;
  targetName: string;
  description: string;
  longDescription: string;
  rewardAmount: number;
  rewardCurrency: string;
  threatLevel: string;
  faction: string;
  location: string;
  tags: string[];
  status: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  claimedBy: string;
  notesGM: string;
  notesPublic: string;
  linkedJournalId: string;
};

export type BountyFilters = {
  status?: string;
  threatLevel?: string;
  faction?: string;
  tag?: string;
  search?: string;
};

function clone<T = any>(value: T): T {
  if (foundry.utils.deepClone) return foundry.utils.deepClone(value);
  if (foundry.utils.duplicate) return foundry.utils.duplicate(value);
  return JSON.parse(JSON.stringify(value ?? null));
}

function now() {
  return new Date().toISOString();
}

function requireGM(action = "change bounty data") {
  if (game.user?.isGM) return true;
  ui.notifications?.warn?.(`Only a GM can ${action}.`);
  return false;
}

function normalizeString(value: any, fallback = "") {
  return String(value ?? fallback).trim();
}

function normalizeTags(value: any) {
  if (Array.isArray(value)) return value.map((tag) => normalizeString(tag)).filter(Boolean);
  return normalizeString(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function escapeHtml(value: any) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

function normalizeStatus(value: any, fallback = BOUNTY_STATUSES.AVAILABLE) {
  const statuses = Object.values(BOUNTY_STATUSES);
  return statuses.includes(value) ? value : fallback;
}

function normalizeThreat(value: any) {
  const threat = normalizeString(value, "Moderate");
  return THREAT_LEVELS.includes(threat) ? threat : "Moderate";
}

function normalizeRewardAmount(value: any) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

export function getStatusLabel(status: string) {
  return STATUS_LABELS[status] ?? STATUS_LABELS[BOUNTY_STATUSES.AVAILABLE];
}

export function getRewardLabel(bounty: Partial<BountyData>) {
  const amount = Number(bounty?.rewardAmount ?? 0);
  const currency = bounty?.rewardCurrency || "credits";
  return `${amount.toLocaleString()} ${currency}`;
}

export function normalizeBounty(source: Partial<BountyData> & Record<string, any> = {}): BountyData {
  const timestamp = now();
  const id = normalizeString(source.id) || `bounty-${foundry.utils.randomID(12)}`;
  const createdAt = normalizeString(source.createdAt) || timestamp;
  const status = normalizeStatus(source.status);

  return {
    ...clone(EMPTY_BOUNTY),
    id,
    title: normalizeString(source.title, "Untitled Bounty"),
    targetName: normalizeString(source.targetName),
    description: normalizeString(source.description),
    longDescription: normalizeString(source.longDescription),
    rewardAmount: normalizeRewardAmount(source.rewardAmount),
    rewardCurrency: normalizeString(source.rewardCurrency, "credits") || "credits",
    threatLevel: normalizeThreat(source.threatLevel),
    faction: normalizeString(source.faction),
    location: normalizeString(source.location),
    tags: normalizeTags(source.tags),
    status,
    image: normalizeString(source.image),
    createdAt,
    updatedAt: normalizeString(source.updatedAt) || createdAt,
    published: source.published === true,
    claimedBy: normalizeString(source.claimedBy),
    notesGM: normalizeString(source.notesGM),
    notesPublic: normalizeString(source.notesPublic),
    linkedJournalId: normalizeString(source.linkedJournalId)
  };
}

export function prepareBountyForDisplay(bounty: Partial<BountyData>) {
  const normalized = normalizeBounty(bounty);
  const linkedJournal = normalized.linkedJournalId ? game.journal?.get(normalized.linkedJournalId) ?? null : null;
  const publicLinks = game.settings.get(MODULE_ID, SETTING_PUBLIC_DOCUMENT_LINKS) === true;
  const user = game.user;
  const canSeeJournal = Boolean(linkedJournal && (user?.isGM || publicLinks || linkedJournal.testUserPermission?.(user, "OBSERVER")));

  return {
    ...normalized,
    statusLabel: getStatusLabel(normalized.status),
    rewardLabel: getRewardLabel(normalized),
    tagsText: normalized.tags.join(", "),
    hasImage: Boolean(normalized.image),
    isVisibleToPlayers: isBountyVisibleToPlayers(normalized),
    linkedJournalName: linkedJournal?.name ?? "",
    canSeeJournal,
    canEdit: game.user?.isGM === true
  };
}

export function isBountyVisibleToPlayers(bounty: Partial<BountyData>) {
  const normalized = normalizeBounty(bounty);
  return normalized.published && ![BOUNTY_STATUSES.HIDDEN, BOUNTY_STATUSES.ARCHIVED].includes(normalized.status as any);
}

export function getBountyStore(): Record<string, BountyData> {
  const raw = game.settings.get(MODULE_ID, SETTING_BOUNTIES);
  if (!raw) return {};

  if (Array.isArray(raw)) {
    return Object.fromEntries(raw.map(normalizeBounty).map((bounty) => [bounty.id, bounty]));
  }

  if (typeof raw === "object") {
    return Object.fromEntries(Object.values(raw).map(normalizeBounty).map((bounty) => [bounty.id, bounty]));
  }

  console.warn(`${MODULE_ID} | Ignoring invalid bounty setting payload.`, raw);
  return {};
}

async function saveBountyStore(store: Record<string, BountyData>) {
  if (!requireGM("save bounties")) return getBountyStore();
  await game.settings.set(MODULE_ID, SETTING_BOUNTIES, store ?? {});
  return store;
}

export function getAllBounties({ includeHidden = game.user?.isGM === true } = {}) {
  const bounties = Object.values(getBountyStore()).map(normalizeBounty);
  const visible = includeHidden ? bounties : bounties.filter(isBountyVisibleToPlayers);
  return visible.sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)));
}

export function getBounty(id: string): BountyData | null {
  const bounty = getBountyStore()[id];
  return bounty ? normalizeBounty(bounty) : null;
}

export function validateBounty(data: Partial<BountyData>) {
  const errors = [];
  if (!normalizeString(data.title)) errors.push("Title is required.");
  if (!normalizeString(data.targetName)) errors.push("Target name is required.");
  if (!normalizeString(data.rewardCurrency)) errors.push("Reward currency is required.");
  if (!normalizeString(data.threatLevel)) errors.push("Threat level is required.");
  return errors;
}

export async function upsertBounty(data: Partial<BountyData> & Record<string, any>) {
  if (!requireGM("create or edit bounties")) return null;
  const existing = data.id ? getBounty(data.id) : null;
  const timestamp = now();
  const bounty = normalizeBounty({
    ...existing,
    ...data,
    id: existing?.id || data.id || `bounty-${foundry.utils.randomID(12)}`,
    createdAt: existing?.createdAt || timestamp,
    updatedAt: timestamp
  });
  const errors = validateBounty(bounty);
  if (errors.length) {
    ui.notifications?.error?.(errors.join(" "));
    return null;
  }

  const store = getBountyStore();
  store[bounty.id] = bounty;
  await saveBountyStore(store);
  return bounty;
}

export async function deleteBounty(id: string) {
  if (!requireGM("delete bounties")) return false;
  const confirmed = await Dialog.confirm({
    title: "Delete Bounty",
    content: "<p>Permanently delete this bounty from world data?</p>"
  });
  if (!confirmed) return false;
  const store = getBountyStore();
  delete store[id];
  await saveBountyStore(store);
  return true;
}

export async function updateBountyState(id: string, patch: Partial<BountyData> = {}, { chat = false } = {}) {
  if (!requireGM("update bounty status")) return null;
  const existing = getBounty(id);
  if (!existing) {
    ui.notifications?.warn?.("Bounty not found.");
    return null;
  }

  const updated = await upsertBounty({ ...existing, ...patch });
  if (!updated) return null;

  if (chat) await postBountyChatCard(updated, patch.status === BOUNTY_STATUSES.AVAILABLE ? "published" : "result");
  return updated;
}

export async function publishBounty(id: string, published = true) {
  const updated = await updateBountyState(id, {
    published,
    status: published ? BOUNTY_STATUSES.AVAILABLE : BOUNTY_STATUSES.HIDDEN
  });
  if (updated && published && game.settings.get(MODULE_ID, SETTING_POST_PUBLISH_CHAT)) {
    await postBountyChatCard(updated, "published");
  }
  return updated;
}

export async function markBountyCompleted(id: string, failed = false) {
  const status = failed ? BOUNTY_STATUSES.FAILED : BOUNTY_STATUSES.COMPLETED;
  const updated = await updateBountyState(id, { status });
  if (updated && game.settings.get(MODULE_ID, SETTING_POST_RESULT_CHAT)) {
    await postBountyChatCard(updated, "result");
  }
  return updated;
}

export async function archiveBounty(id: string) {
  return updateBountyState(id, { status: BOUNTY_STATUSES.ARCHIVED, published: false });
}

export async function claimBounty(id: string, claimedBy: string) {
  return updateBountyState(id, { status: BOUNTY_STATUSES.CLAIMED, claimedBy: normalizeString(claimedBy) });
}

export function getFilterOptions() {
  const bounties = getAllBounties({ includeHidden: true });
  const unique = (values: any[]) => [...new Set(values.map((value) => normalizeString(value)).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  return {
    statuses: Object.values(BOUNTY_STATUSES).map((value) => ({ value, label: getStatusLabel(value) })),
    threatLevels: THREAT_LEVELS,
    factions: unique(bounties.map((bounty) => bounty.faction)),
    tags: unique([...DEFAULT_TAGS, ...bounties.flatMap((bounty) => bounty.tags)])
  };
}

export function filterBounties(bounties: Partial<BountyData>[], filters: BountyFilters = {}) {
  const status = normalizeString(filters.status);
  const threatLevel = normalizeString(filters.threatLevel);
  const faction = normalizeString(filters.faction).toLowerCase();
  const tag = normalizeString(filters.tag).toLowerCase();
  const search = normalizeString(filters.search).toLowerCase();

  return bounties.filter((bounty) => {
    const normalized = normalizeBounty(bounty);
    if (status && normalized.status !== status) return false;
    if (threatLevel && normalized.threatLevel !== threatLevel) return false;
    if (faction && normalized.faction.toLowerCase() !== faction) return false;
    if (tag && !normalized.tags.some((candidate) => candidate.toLowerCase() === tag)) return false;
    if (search) {
      const haystack = [
        normalized.title,
        normalized.targetName,
        normalized.description,
        normalized.longDescription,
        normalized.faction,
        normalized.location,
        normalized.tags.join(" ")
      ].join(" ").toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

export async function requestContract(id: string) {
  const bounty = getBounty(id);
  if (!bounty) return;
  const speaker = ChatMessage.getSpeaker({ user: game.user });
  const content = `
    <div class="bb-chat-card bb-chat-card--request">
      <h3>Contract Request</h3>
      <p><strong>${escapeHtml(game.user?.name ?? "A player")}</strong> requests contract authorization.</p>
      <p><strong>${escapeHtml(bounty.title)}</strong> - ${escapeHtml(bounty.targetName)}</p>
    </div>
  `;
  await ChatMessage.create({
    speaker,
    whisper: ChatMessage.getWhisperRecipients("GM").map((user: any) => user.id),
    content
  });
  ui.notifications?.info?.("Contract request sent to the GM.");
}

export function registerSettings() {
  game.settings.register(MODULE_ID, SETTING_BOUNTIES, {
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });

  game.settings.register(MODULE_ID, SETTING_POST_PUBLISH_CHAT, {
    name: "Post Chat Card When Publishing",
    hint: "Automatically post a contract card when the GM publishes a bounty.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, SETTING_POST_RESULT_CHAT, {
    name: "Post Chat Card When Resolved",
    hint: "Automatically post a result card when the GM completes or fails a bounty.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, SETTING_PUBLIC_DOCUMENT_LINKS, {
    name: "Show Linked Journals To Players",
    hint: "Allow player-visible bounty cards to show linked journal buttons when the bounty is published.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
}
