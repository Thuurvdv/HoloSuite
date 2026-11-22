import { MODULE_ID, MESSAGE_FLAG_KIND } from "./constants";
import { normalizeMessage, type CyberCallMessage } from "./message-model";
import { escapeHTML } from "./dom-utils";
import { getExpiredCallEventIds, isCallHistoryEvent } from "./history-retention";

declare const game: any;
declare const ui: any;

const ARCHIVE = "conversationArchive";
const OUTBOX = "pendingMessages";
export const MIGRATED = "messageArchiveMigrated";

const flags = (doc: any) => doc?.flags?.[MODULE_ID] ?? {};
export const isArchive = (doc: any) => typeof flags(doc)[ARCHIVE] === "string";
export const archiveMessage = (page: any) => isArchive(page?.parent) ? flags(page).message : null;
const journals = (): any[] => (game.journal?.contents ?? []).filter(isArchive);
const audience = (message: CyberCallMessage) => [...new Set([message.senderUserId, ...message.recipientUserIds])].sort();

// Foundry document IDs are 16 alphanumeric characters. Check the full key on every
// lookup so even a collision cannot put a message in another conversation.
function documentId(key: string) {
  let a = 2166136261, b = 5381;
  for (let i = 0; i < key.length; i++) {
    a = Math.imul(a ^ key.charCodeAt(i), 16777619);
    b = Math.imul(b, 33) ^ key.charCodeAt(i);
  }
  return [a, b].map(n => (n >>> 0).toString(16).padStart(8, "0")).join("");
}

function writer() {
  return game.user?.isGM && game.users.activeGM?.id === game.user.id;
}

export function legacyMessage(doc: any): CyberCallMessage | null {
  const data = flags(doc);
  const raw = data.kind === MESSAGE_FLAG_KIND ? data : data.message;
  if (raw?.kind !== MESSAGE_FLAG_KIND || data.archiveNotice) return null;
  const author = doc.author?.id ?? doc.user?.id ?? doc.user ?? doc._source?.author ?? doc._source?.user;
  if (!Array.isArray(doc.whisper)) return null;
  const whisper = new Set(doc.whisper.map((u: any) => u?.id ?? u));
  if (!author || author !== raw.senderUserId || !whisper.size || !Array.isArray(raw.recipientUserIds)) return null;
  const participants = new Set([author, ...raw.recipientUserIds]);
  if (raw.recipientUserIds.some((id: string) => id !== author && !whisper.has(id))
    || [...whisper].some(id => !participants.has(id))) return null;
  const timestamp = new Date(raw.createdAt || doc.timestamp);
  if (!Number.isFinite(timestamp.getTime()) || !raw.threadId || !raw.body) return null;
  for (const field of ["recipientActorIds", "recipientNumbers", "groupMemberUserIds", "groupMemberNames"]) {
    if (raw[field] != null && !Array.isArray(raw[field])) return null;
  }
  return normalizeMessage({ ...raw, id: raw.id || doc.id, chatMessageId: doc.id, createdAt: timestamp.toISOString() });
}

export function archivedMessages(): CyberCallMessage[] {
  return journals().flatMap(entry => entry.pages.contents.map(archiveMessage).filter(Boolean));
}

async function store(message: CyberCallMessage, origin: string, migration: boolean) {
  const participants = audience(message);
  const key = JSON.stringify([message.threadId, participants]);
  const id = documentId(key);
  let entry = game.journal.get(id);
  if (!entry) {
    const ownership = Object.fromEntries(participants.map(uid => [uid, 2]));
    entry = await game.journal.documentClass.create({
      _id: id, name: "CyberCall Conversation", ownership: { ...ownership, default: 0 },
      flags: { [MODULE_ID]: { [ARCHIVE]: key } }
    }, { keepId: true, renderSheet: false });
  }
  if (flags(entry)[ARCHIVE] !== key) throw new Error("CyberCall journal ID conflict.");
  const pageId = documentId(origin);
  const existing = entry.pages.get(pageId);
  if (existing) {
    if (flags(existing).origin !== origin) throw new Error("CyberCall page ID conflict.");
    return false;
  }
  const [page] = await entry.createEmbeddedDocuments("JournalEntryPage", [{
    _id: pageId, name: "CyberCall Message", type: "text",
    text: { content: `<p>${escapeHTML(message.body)}</p>`, format: 1 },
    flags: { [MODULE_ID]: { origin, message: { ...message, kind: MESSAGE_FLAG_KIND } } }
  }], { keepId: true, renderSheet: false, cybercallMigration: migration });
  if (!page) throw new Error("Foundry did not save the CyberCall message.");
  if (isCallHistoryEvent(page)) retentionDue = true;
  return true;
}

export async function queueMessage(message: CyberCallMessage) {
  const key = documentId(message.id);
  const user = game.user;
  try {
    await user.setFlag(MODULE_ID, `${OUTBOX}.${key}`, message);
  } catch (error) {
    ui.notifications?.error?.("CyberCall could not save the message to your outbox.");
    throw error;
  }
  if (writer()) await serviceArchive();
  const pending = user.getFlag(MODULE_ID, OUTBOX)?.[key];
  if (pending && !game.users.activeGM && (message.messageType === "text" || message.eventType === "group-created")) {
    ui.notifications?.info?.("Message queued. A GM will deliver it when they connect.");
  }
  return message;
}

async function migrate() {
  if (game.settings.get(MODULE_ID, MIGRATED)) return;
  const skipped: string[] = [];
  for (const doc of game.messages.contents) {
    const data = flags(doc);
    if (!writer()) return;
    if (data.archiveNotice || (data.kind !== MESSAGE_FLAG_KIND && data.message?.kind !== MESSAGE_FLAG_KIND)) continue;
    const message = legacyMessage(doc);
    if (message) await store(message, `chat:${doc.id}`, true);
    else skipped.push(doc.id);
  }
  if (!writer()) return;
  await game.settings.set(MODULE_ID, MIGRATED, true);
  retentionDue = true;
  if (skipped.length) {
    console.warn("CyberCall could not validate these legacy chat records:", skipped);
    ui.notifications.warn(`CyberCall left ${skipped.length} legacy chat records in chat for GM review. Their IDs are in the console.`);
  }
}

async function deliver(user: any, key: string, raw: any) {
  if (raw?.senderUserId !== user.id || !raw.id || documentId(raw.id) !== key
    || !Array.isArray(raw.recipientUserIds) || !raw.body || !raw.threadId) return;
  const message = normalizeMessage({ ...raw, chatMessageId: "" });
  const origin = JSON.stringify([user.id, message.id]);
  const created = await store(message, origin, false);
  await user.unsetFlag(MODULE_ID, `${OUTBOX}.${key}`);
  if (!created) return;
  try {
    const Chat = game.messages.documentClass;
    await Chat.create({
      speaker: Chat.getSpeaker({ alias: message.senderName }), whisper: audience(message),
      content: `<div class="cybercall-chat-card"><strong>${escapeHTML(message.senderName)}</strong><p>${escapeHTML(message.body)}</p><button type="button" data-cybercall-open-thread data-cybercall-thread-id="${escapeHTML(message.threadId)}">Open CyberCall</button></div>`,
      flags: { [MODULE_ID]: { archiveNotice: true, archiveOrigin: origin } }
    });
  } catch (error) {
    console.warn("CyberCall saved the message but could not create its chat card.", error);
  }
}

async function prune() {
  const pages = journals().flatMap(entry => entry.pages.contents);
  const expired = new Set(getExpiredCallEventIds(pages.map(page => ({
    id: page.uuid, flags: page.flags
  }))));
  if (!expired.size) return;
  const origins = new Set(pages.filter(page => expired.has(page.uuid)).map(page => flags(page).origin));
  const cards = game.messages.contents.filter((doc: any) => {
    const data = flags(doc);
    if (data.archiveNotice) return origins.has(data.archiveOrigin);
    return origins.has(`chat:${doc.id}`) && isCallHistoryEvent(doc) && legacyMessage(doc);
  });
  if (cards.length) await game.messages.documentClass.deleteDocuments(cards.map((doc: any) => doc.id));
  for (const entry of journals()) {
    if (!writer()) return;
    const ids = entry.pages.contents.filter((page: any) => expired.has(page.uuid)).map((page: any) => page.id);
    if (ids.length) await entry.deleteEmbeddedDocuments("JournalEntryPage", ids);
  }
}

let retentionDue = true;
let active: Promise<void> | undefined;
let requested = false;
export function serviceArchive(): Promise<void> {
  if (!writer()) return Promise.resolve();
  requested = true;
  if (active) return active;
  active = Promise.resolve().then(async () => {
    while (requested && writer()) {
      requested = false;
      await migrate();
      for (const user of game.users.contents) {
        const pending = user.getFlag(MODULE_ID, OUTBOX) ?? {};
        for (const [key, raw] of Object.entries(pending)) {
          if (!writer()) return;
          try { await deliver(user, key, raw); }
          catch (error) { console.warn("CyberCall will retry the queued message.", error); }
        }
      }
      if (retentionDue && writer()) {
        await prune();
        retentionDue = false;
      }
    }
  }).catch(error => console.warn("CyberCall archive maintenance will retry.", error))
    .finally(() => { active = undefined; });
  return active;
}
