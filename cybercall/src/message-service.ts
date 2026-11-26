import { MESSAGE_SCHEMA_VERSION, MODULE_ID } from "./constants";
import { archivedMessages, legacyMessage, MIGRATED, queueMessage } from "./message-archive";
import { createThreadIdForContact, CyberCallMessage, normalizeMessage } from "./message-model";
import { getUserDisplayName, getUserTokenImage, normalizeContact } from "./call-model";

declare const game: any;

function getGMUserIds() {
  return (game.users?.contents ?? [])
    .filter((user: any) => user.isGM)
    .map((user: any) => user.id);
}

function uniqueStrings(values: any[]) {
  return [...new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))];
}

function canCurrentUserReadMessage(message: CyberCallMessage) {
  const currentUserId = String(game.user?.id ?? "").trim();
  if (!currentUserId) return false;
  const isParticipant = message.senderUserId === currentUserId || message.recipientUserIds.includes(currentUserId);
  if (isParticipant) return true;
  if (game.user?.isGM === true) {
    if (!message.contactUserId && (message.contactManagedByGM || message.contactIsNpc)) return true;
    return game.settings.get(MODULE_ID, "gmViewPlayerMessages") === true;
  }

  return false;
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

export function getStoredMessages(): CyberCallMessage[] {
  const messages = archivedMessages();
  if (!game.settings.get(MODULE_ID, MIGRATED)) {
    const migrated = new Set(messages.map(message => message.chatMessageId));
    for (const document of game.messages.contents) {
      if (migrated.has(document.id)) continue;
      const message = legacyMessage(document);
      if (message) messages.push(message);
    }
  }
  return messages.filter(canCurrentUserReadMessage);
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
  const isGroup = options.conversationType === "group";
  const threadId = String(options.threadId ?? createThreadIdForContact(contactSource, senderUser?.id, options));
  const senderName = String(options.senderName ?? "").trim() || getUserDisplayName(senderUser, "Unknown Sender");
  const senderActorId = String(options.senderActorId ?? senderUser?.character?.id ?? "").trim();
  const senderNumber = String(options.senderNumber ?? "").trim();
  const message = normalizeMessage({
    threadId,
    senderUserId: senderUser?.id ?? "",
    senderActorId,
    senderName,
    senderNumber,
    senderImage: String(options.senderImage ?? getUserTokenImage(senderUser)).trim(),
    recipientUserIds,
    recipientActorIds: contact.actorId ? [contact.actorId] : [],
    recipientNumbers: options.recipientNumbers ?? (contact.number ? [contact.number] : []),
    contactName: String(options.contactName ?? contact.name ?? ""),
    contactImage: String(options.contactImage ?? contact.image ?? ""),
    contactUserId: String(options.contactUserId ?? contact.userId ?? ""),
    contactManagedByGM: !isGroup && (options.contactManagedByGM ?? (contact.managedByGM === true || routesToGMManagedContact)),
    contactIsNpc: !isGroup && (options.contactIsNpc ?? (contact.isNpc === true || routesToGMManagedContact)),
    body,
    messageType: String(options.messageType ?? "text"),
    eventType: String(options.eventType ?? ""),
    conversationType: String(options.conversationType ?? "direct"),
    groupId: String(options.groupId ?? ""),
    groupName: String(options.groupName ?? ""),
    groupMemberUserIds: options.groupMemberUserIds ?? [],
    groupMemberNames: options.groupMemberNames ?? [],
    groupNpcMembers: options.groupNpcMembers ?? [],
    schemaVersion: MESSAGE_SCHEMA_VERSION
  });
  return queueMessage(message);
}

export async function createMessageEvent(contactSource: any, bodySource: any, options: any = {}) {
  return sendMessageToContact(contactSource, bodySource, {
    ...options,
    messageType: options.messageType ?? "event"
  });
}
