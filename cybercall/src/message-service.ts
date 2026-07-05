import { MESSAGE_FLAG_KIND, MESSAGE_SCHEMA_VERSION, MODULE_ID } from "./constants";
import { escapeHTML } from "./dom-utils";
import { createThreadIdForContact, CyberCallMessage, normalizeMessage } from "./message-model";
import { normalizeContact } from "./call-model";

declare const ChatMessage: any;
declare const game: any;

function getMessageFlag(document: any) {
  const flag = document?.flags?.[MODULE_ID] ?? document?.getFlag?.(MODULE_ID, "message");
  if (flag?.kind === MESSAGE_FLAG_KIND) return flag;
  if (flag?.message?.kind === MESSAGE_FLAG_KIND) return flag.message;
  return null;
}

function getChatCreatedAt(document: any) {
  return String(document?.timestamp ? new Date(document.timestamp).toISOString() : document?.createdTime ?? "");
}

function getGMUserIds() {
  return (game.users?.contents ?? [])
    .filter((user: any) => user.isGM)
    .map((user: any) => user.id);
}

function uniqueStrings(values: any[]) {
  return [...new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))];
}

function getRecipientUserIds(contact: any) {
  const explicit = Array.isArray(contact?.userIds)
    ? contact.userIds
    : contact?.userId
      ? [contact.userId]
      : [];
  const normalized = uniqueStrings(explicit);
  if (normalized.length) return normalized;
  return getGMUserIds();
}

function hasExplicitUserRecipient(contact: any) {
  return Boolean(contact?.userId || (Array.isArray(contact?.userIds) && contact.userIds.length));
}

function renderMessageContent(message: CyberCallMessage, contact: any) {
  const title = message.senderName || "CyberCall";
  const target = contact?.name ? `<span>${escapeHTML(contact.name)}</span>` : "";
  const eventClass = message.messageType !== "text" ? " cybercall-chat-card--event" : "";
  return `
    <div class="cybercall-chat-card${eventClass}" data-cybercall-thread-id="${escapeHTML(message.threadId)}">
      <strong>${escapeHTML(title)}</strong>
      ${target}
      <p>${escapeHTML(message.body)}</p>
      <button type="button" data-cybercall-open-thread data-cybercall-thread-id="${escapeHTML(message.threadId)}">Open CyberCall</button>
    </div>
  `;
}

export function getStoredMessages(): CyberCallMessage[] {
  const messages = game.messages?.contents ?? [];
  return messages
    .map((document: any) => {
      const flag = getMessageFlag(document);
      if (!flag) return null;
      return normalizeMessage({
        ...flag,
        chatMessageId: document.id,
        createdAt: flag.createdAt || getChatCreatedAt(document)
      });
    })
    .filter(Boolean);
}

export async function sendMessageToContact(contactSource: any, bodySource: any, options: any = {}) {
  const contact = normalizeContact(contactSource);
  const body = String(bodySource ?? "").trim();
  if (!body) return null;

  const senderUser = game.user;
  const recipientUserIds = options.recipientUserIds
    ? uniqueStrings(options.recipientUserIds)
    : getRecipientUserIds(contactSource);
  const routesToGMManagedContact = !hasExplicitUserRecipient(contactSource);
  const threadId = String(options.threadId ?? createThreadIdForContact(contactSource, senderUser?.id));
  const senderName = String(options.senderName ?? senderUser?.character?.name ?? senderUser?.name ?? "Unknown Sender").trim();
  const senderActorId = String(options.senderActorId ?? senderUser?.character?.id ?? "").trim();
  const senderNumber = String(options.senderNumber ?? "").trim();
  const message = normalizeMessage({
    threadId,
    senderUserId: senderUser?.id ?? "",
    senderActorId,
    senderName,
    senderNumber,
    recipientUserIds,
    recipientActorIds: contact.actorId ? [contact.actorId] : [],
    recipientNumbers: options.recipientNumbers ?? (contact.number ? [contact.number] : []),
    contactName: String(options.contactName ?? contact.name ?? ""),
    contactImage: String(options.contactImage ?? contact.image ?? ""),
    contactUserId: String(options.contactUserId ?? contact.userId ?? ""),
    contactManagedByGM: options.contactManagedByGM ?? (contact.managedByGM === true || routesToGMManagedContact),
    contactIsNpc: options.contactIsNpc ?? (contact.isNpc === true || routesToGMManagedContact),
    body,
    messageType: String(options.messageType ?? "text"),
    eventType: String(options.eventType ?? ""),
    schemaVersion: MESSAGE_SCHEMA_VERSION
  });
  const whisper = [...new Set([senderUser?.id, ...recipientUserIds].filter(Boolean))];

  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: message.senderName }),
    whisper,
    content: renderMessageContent(message, contact),
    flags: {
      [MODULE_ID]: {
        kind: MESSAGE_FLAG_KIND,
        ...message
      }
    }
  });
}

export async function createMessageEvent(contactSource: any, bodySource: any, options: any = {}) {
  return sendMessageToContact(contactSource, bodySource, {
    ...options,
    messageType: options.messageType ?? "event"
  });
}
