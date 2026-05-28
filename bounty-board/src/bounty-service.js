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
} from "./bounty-constants.js";
import { postBountyChatCard } from "./bounty-chat.js";

function clone(value) {
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

function normalizeString(value, fallback = "") {
  return String(value ?? fallback).trim();
}

function normalizeTags(value) {
  if (Array.isArray(value)) return value.map((tag) => normalizeString(tag)).filter(Boolean);
  return normalizeString(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

function normalizeStatus(value, fallback = BOUNTY_STATUSES.AVAILABLE) {
  const statuses = Object.values(BOUNTY_STATUSES);
  return statuses.includes(value) ? value : fallback;
}

function normalizeThreat(value) {
  const threat = normalizeString(value, "Moderate");
  return THREAT_LEVELS.includes(threat) ? threat : "Moderate";
}

function normalizeRewardAmount(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

export function getStatusLabel(status) {
  return STATUS_LABELS[status] ?? STATUS_LABELS[BOUNTY_STATUSES.AVAILABLE];
}

export function getRewardLabel(bounty) {
  const amount = Number(bounty?.rewardAmount ?? 0);
  const currency = bounty?.rewardCurrency || "credits";
  return `${amount.toLocaleString()} ${currency}`;
}

export function normalizeBounty(source = {}) {
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

export function prepareBountyForDisplay(bounty) {
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

export function isBountyVisibleToPlayers(bounty) {
  const normalized = normalizeBounty(bounty);
  return normalized.published && ![BOUNTY_STATUSES.HIDDEN, BOUNTY_STATUSES.ARCHIVED].includes(normalized.status);
}

export function getBountyStore() {
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

async function saveBountyStore(store) {
  if (!requireGM("save bounties")) return getBountyStore();
  await game.settings.set(MODULE_ID, SETTING_BOUNTIES, store ?? {});
  return store;
}

export function getAllBounties({ includeHidden = game.user?.isGM === true } = {}) {
  const bounties = Object.values(getBountyStore()).map(normalizeBounty);
  const visible = includeHidden ? bounties : bounties.filter(isBountyVisibleToPlayers);
  return visible.sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)));
}

export function getBounty(id) {
  const bounty = getBountyStore()[id];
  return bounty ? normalizeBounty(bounty) : null;
}

export function validateBounty(data) {
  const errors = [];
  if (!normalizeString(data.title)) errors.push("Title is required.");
  if (!normalizeString(data.targetName)) errors.push("Target name is required.");
  if (!normalizeString(data.rewardCurrency)) errors.push("Reward currency is required.");
  if (!normalizeString(data.threatLevel)) errors.push("Threat level is required.");
  return errors;
}

export async function upsertBounty(data) {
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

export async function deleteBounty(id) {
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

export async function updateBountyState(id, patch = {}, { chat = false } = {}) {
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

export async function publishBounty(id, published = true) {
  const updated = await updateBountyState(id, {
    published,
    status: published ? BOUNTY_STATUSES.AVAILABLE : BOUNTY_STATUSES.HIDDEN
  });
  if (updated && published && game.settings.get(MODULE_ID, SETTING_POST_PUBLISH_CHAT)) {
    await postBountyChatCard(updated, "published");
  }
  return updated;
}

export async function markBountyCompleted(id, failed = false) {
  const status = failed ? BOUNTY_STATUSES.FAILED : BOUNTY_STATUSES.COMPLETED;
  const updated = await updateBountyState(id, { status });
  if (updated && game.settings.get(MODULE_ID, SETTING_POST_RESULT_CHAT)) {
    await postBountyChatCard(updated, "result");
  }
  return updated;
}

export async function archiveBounty(id) {
  return updateBountyState(id, { status: BOUNTY_STATUSES.ARCHIVED, published: false });
}

export async function claimBounty(id, claimedBy) {
  return updateBountyState(id, { status: BOUNTY_STATUSES.CLAIMED, claimedBy: normalizeString(claimedBy) });
}

export function getFilterOptions() {
  const bounties = getAllBounties({ includeHidden: true });
  const unique = (values) => [...new Set(values.map(normalizeString).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  return {
    statuses: Object.values(BOUNTY_STATUSES).map((value) => ({ value, label: getStatusLabel(value) })),
    threatLevels: THREAT_LEVELS,
    factions: unique(bounties.map((bounty) => bounty.faction)),
    tags: unique([...DEFAULT_TAGS, ...bounties.flatMap((bounty) => bounty.tags)])
  };
}

export function filterBounties(bounties, filters = {}) {
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

export async function requestContract(id) {
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
    whisper: ChatMessage.getWhisperRecipients("GM").map((user) => user.id),
    content
  });
  ui.notifications?.info?.("Contract request sent to the GM.");
}

export async function seedTestData() {
  if (!requireGM("seed bounty test data")) return [];
  const timestamp = now();
  const samples = [
    {
      title: "Red Wake Intercept",
      targetName: "The Glass Jackal",
      description: "Recover stolen drive cores before the convoy reaches restricted space.",
      longDescription: "Blackline telemetry places the fugitive courier inside the Red Wake interdiction lane. Expect spoofed transponders and military-grade countermeasures.",
      rewardAmount: 8500,
      rewardCurrency: "credits",
      threatLevel: "High",
      faction: "Aster Accord",
      location: "Kestral Gate",
      tags: ["Recovery", "Smuggling"],
      status: BOUNTY_STATUSES.AVAILABLE,
      published: true,
      notesPublic: "Bring the cores back intact.",
      notesGM: "Premium gating hook: upgrade with Blackline classified details later.",
      createdAt: timestamp,
      updatedAt: timestamp
    },
    {
      title: "Signal Under Saltglass",
      targetName: "Unknown Echo Source",
      description: "Investigate a repeating distress ping beneath reflective storm cover.",
      longDescription: "The signal uses a pre-collapse cadence. Salvors claim the ruins answer back when approached after local midnight.",
      rewardAmount: 4200,
      rewardCurrency: "credits",
      threatLevel: "Moderate",
      faction: "Veil Freeholds",
      location: "Saltglass Ruins",
      tags: ["Investigation", "Rescue"],
      status: BOUNTY_STATUSES.HIDDEN,
      published: false,
      notesGM: "Galaxy map integration hook: reveal route after this bounty is accepted.",
      createdAt: timestamp,
      updatedAt: timestamp
    }
  ];

  const store = getBountyStore();
  const installed = [];
  for (const sample of samples) {
    const bounty = normalizeBounty({ ...sample, id: `sample-${foundry.utils.randomID(8)}` });
    store[bounty.id] = bounty;
    installed.push(bounty);
  }
  await saveBountyStore(store);
  ui.notifications?.info?.(`${MODULE_TITLE}: seeded ${installed.length} sample bounties.`);
  return installed;
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
