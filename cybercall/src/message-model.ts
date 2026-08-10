import { MESSAGE_SCHEMA_VERSION } from "./constants";
import { createCallId, getInitials, normalizeContact } from "./call-model";

declare const game: any;

export type CyberCallMessage = {
  id: string;
  threadId: string;
  senderUserId: string;
  senderActorId: string;
  senderName: string;
  senderNumber: string;
  senderImage: string;
  recipientUserIds: string[];
  recipientActorIds: string[];
  recipientNumbers: string[];
  contactName: string;
  contactImage: string;
  contactUserId: string;
  contactManagedByGM: boolean;
  contactIsNpc: boolean;
  body: string;
  messageType: string;
  eventType: string;
  conversationType: string;
  groupId: string;
  groupName: string;
  groupMemberUserIds: string[];
  groupMemberNames: string[];
  createdAt: string;
  chatMessageId: string;
  schemaVersion: number;
};

export type CyberCallThread = {
  id: string;
  title: string;
  subtitle: string;
  initials: string;
  image: string;
  avatarTone: string;
  routeLabel: string;
  hasRouteLabel: boolean;
  isNpcRouted: boolean;
  contact: any;
  messages: CyberCallMessage[];
  lastMessage: CyberCallMessage | null;
  lastPreview: string;
  updatedAt: string;
  unread: boolean;
  unreadCount: number;
  active: boolean;
  isGroup: boolean;
  groupId: string;
  groupName: string;
  groupMemberUserIds: string[];
  groupMemberNames: string[];
};

function normalizeString(value: unknown, fallback = "") {
  return String(value ?? fallback).trim();
}

function unique(values: unknown[]) {
  return [...new Set(values.map((value) => normalizeString(value)).filter(Boolean))];
}

function now() {
  return new Date().toISOString();
}

export function getAvatarTone(value: unknown) {
  const source = normalizeString(value, "cybercall");
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = ((hash << 5) - hash + source.charCodeAt(index)) | 0;
  }
  return `tone-${Math.abs(hash) % 8 + 1}`;
}

function createPairThreadId(left: string, right: string) {
  return ["direct", ...[left, right].sort()].join(":");
}

export function createMessageId() {
  return `msg-${createCallId()}`;
}

export function createGroupThreadId(groupId = createCallId()) {
  return `group:${normalizeString(groupId)}`;
}

export function createThreadIdForContact(contact: any, userId = game?.user?.id) {
  const normalized = normalizeContact(contact);
  if (contact?.userId) {
    return createPairThreadId(`user:${normalizeString(userId, "unknown")}`, `user:${normalizeString(contact.userId)}`);
  }
  const contactKey = normalized.number || normalized.id || normalized.name;
  return createPairThreadId(`user:${normalizeString(userId, "unknown")}`, `contact:${contactKey}`);
}

export function normalizeMessage(source: Partial<CyberCallMessage> & Record<string, any> = {}): CyberCallMessage {
  return {
    id: normalizeString(source.id) || createMessageId(),
    threadId: normalizeString(source.threadId) || createThreadIdForContact({ number: source.recipientNumbers?.[0] ?? source.senderNumber }),
    senderUserId: normalizeString(source.senderUserId),
    senderActorId: normalizeString(source.senderActorId),
    senderName: normalizeString(source.senderName, "Unknown Sender"),
    senderNumber: normalizeString(source.senderNumber),
    senderImage: normalizeString(source.senderImage),
    recipientUserIds: unique(source.recipientUserIds ?? []),
    recipientActorIds: unique(source.recipientActorIds ?? []),
    recipientNumbers: unique(source.recipientNumbers ?? []),
    contactName: normalizeString(source.contactName),
    contactImage: normalizeString(source.contactImage),
    contactUserId: normalizeString(source.contactUserId),
    contactManagedByGM: source.contactManagedByGM === true,
    contactIsNpc: source.contactIsNpc === true,
    body: normalizeString(source.body),
    messageType: normalizeString(source.messageType, "text") || "text",
    eventType: normalizeString(source.eventType),
    conversationType: normalizeString(source.conversationType, source.groupId ? "group" : "direct") || "direct",
    groupId: normalizeString(source.groupId),
    groupName: normalizeString(source.groupName),
    groupMemberUserIds: unique(source.groupMemberUserIds ?? []),
    groupMemberNames: unique(source.groupMemberNames ?? []),
    createdAt: normalizeString(source.createdAt) || now(),
    chatMessageId: normalizeString(source.chatMessageId),
    schemaVersion: Number(source.schemaVersion ?? MESSAGE_SCHEMA_VERSION)
  };
}

export function prepareThreads(messages: CyberCallMessage[], contacts: any[] = [], activeThreadId = "", readState: Record<string, string> = {}) {
  const contactsByNumber = new Map();
  const contactsByUserId = new Map();
  for (const contact of contacts) {
    const normalized = normalizeContact(contact);
    const displayContact = { ...normalized, userId: contact?.userId, userIds: contact?.userIds ?? normalized.userIds };
    if (normalized.number) contactsByNumber.set(normalized.number, displayContact);
    if (contact?.userId) contactsByUserId.set(String(contact.userId), displayContact);
  }
  const grouped = new Map<string, CyberCallMessage[]>();

  for (const message of messages.map(normalizeMessage).filter((entry) => entry.body)) {
    const group = grouped.get(message.threadId) ?? [];
    group.push(message);
    grouped.set(message.threadId, group);
  }

  return [...grouped.entries()]
    .map(([threadId, threadMessages]) => {
      const sorted = threadMessages.sort((left, right) => left.createdAt.localeCompare(right.createdAt));
      const lastMessage = sorted[sorted.length - 1] ?? null;
      const groupMessage = [...sorted].reverse().find((message) => message.conversationType === "group" || message.groupId);
      const isGroup = Boolean(groupMessage);
      const groupId = groupMessage?.groupId || (isGroup ? threadId.replace(/^group:/, "") : "");
      const groupName = groupMessage?.groupName || (isGroup ? "Group Chat" : "");
      const groupMemberUserIds = isGroup ? unique(sorted.flatMap((message) => [
        ...message.groupMemberUserIds,
        message.senderUserId,
        ...message.recipientUserIds
      ])) : [];
      const storedGroupMemberNames = isGroup ? unique(sorted.flatMap((message) => message.groupMemberNames)) : [];
      const groupMemberNames = storedGroupMemberNames.length
        ? storedGroupMemberNames
        : groupMemberUserIds.map((id) => game.users?.get?.(id)?.name).filter(Boolean);
      const otherUserId = lastMessage?.senderUserId === game?.user?.id
        ? lastMessage?.recipientUserIds?.find((id) => id !== game?.user?.id)
        : lastMessage?.senderUserId;
      const contactNumber = lastMessage?.senderUserId === game?.user?.id
        ? lastMessage?.recipientNumbers?.[0] || ""
        : lastMessage?.senderNumber || lastMessage?.recipientNumbers?.[0] || "";
      const routedContactIdentity = lastMessage?.contactName && !lastMessage?.contactUserId && (lastMessage.contactIsNpc || lastMessage.contactManagedByGM)
        ? {
          id: `contact-${lastMessage.recipientNumbers?.[0] || lastMessage.senderNumber || threadId}`,
          name: lastMessage.contactName,
          number: lastMessage.recipientNumbers?.[0] || lastMessage.senderNumber || "",
          image: lastMessage.contactImage || "",
          actorId: lastMessage.recipientActorIds?.[0] ?? lastMessage.senderActorId ?? "",
          userId: "",
          userIds: [],
          managedByGM: true,
          isNpc: true,
          initials: getInitials(lastMessage.contactName)
        }
        : null;
      const senderIdentityContact = lastMessage?.senderUserId !== game?.user?.id && lastMessage?.senderNumber && lastMessage?.contactName
        ? {
          id: `contact-${lastMessage.senderNumber || threadId}`,
          name: lastMessage.contactName,
          number: lastMessage.senderNumber,
          image: lastMessage.contactImage || "",
          actorId: lastMessage.senderActorId ?? "",
          userId: "",
          userIds: [],
          managedByGM: true,
          isNpc: true,
          initials: getInitials(lastMessage.contactName)
        }
        : null;
      const groupContact = isGroup ? {
        id: `group-${groupId || threadId}`,
        name: groupName,
        number: `${groupMemberUserIds.length} member${groupMemberUserIds.length === 1 ? "" : "s"}`,
        image: "",
        actorId: "",
        userId: "",
        userIds: groupMemberUserIds.filter((id) => id !== game?.user?.id),
        managedByGM: false,
        isNpc: false,
        isGroup: true,
        initials: getInitials(groupName)
      } : null;
      const contact = groupContact ?? routedContactIdentity ?? senderIdentityContact ?? contactsByUserId.get(otherUserId) ?? contactsByNumber.get(contactNumber) ?? {
        id: `contact-${contactNumber || threadId}`,
        name: lastMessage?.contactName || (lastMessage?.senderUserId === game?.user?.id
          ? contactNumber || "Unknown Contact"
          : lastMessage?.senderName || contactNumber || "Unknown Contact"),
        number: contactNumber,
        image: lastMessage?.contactImage || "",
        actorId: lastMessage?.recipientActorIds?.[0] ?? "",
        userId: "",
        userIds: [],
        managedByGM: Boolean(lastMessage?.contactName || lastMessage?.recipientActorIds?.[0]),
        isNpc: Boolean(lastMessage?.contactName || lastMessage?.recipientActorIds?.[0]),
        initials: getInitials(lastMessage?.contactName || lastMessage?.senderName || contactNumber)
      };
      const participantMessage = isGroup ? null : [...sorted].reverse().find((message) =>
        message.senderUserId === otherUserId && message.senderImage
      );
      const npcRoutedMessage = [...sorted].reverse().find((message) => {
        const sender = game.users?.get?.(message.senderUserId);
        return message.senderUserId
          && sender?.isGM !== true
          && !message.contactUserId
          && Boolean(message.contactName)
          && (message.contactIsNpc || message.contactManagedByGM);
      }) ?? null;
      const routedPlayerMessage = game?.user?.isGM === true ? npcRoutedMessage : null;
      const routeLabel = routedPlayerMessage ? `TO: ${routedPlayerMessage.contactName}` : "";
      const routedSenderContact = routedPlayerMessage
        ? contactsByUserId.get(routedPlayerMessage.senderUserId)
        : null;
      const displayTitle = routedPlayerMessage?.senderName || routedSenderContact?.name || contact.name || lastMessage?.senderName || "Unknown Contact";
      const displaySubtitle = routedPlayerMessage
        ? routedSenderContact?.number || `@${routedPlayerMessage.senderName}`
        : contact.number || lastMessage?.senderNumber || "";
      const displayInitials = routedPlayerMessage
        ? getInitials(displayTitle)
        : contact.initials || getInitials(contact.name || lastMessage?.senderName);
      const displayImage = routedPlayerMessage?.senderImage
        || routedSenderContact?.image
        || participantMessage?.senderImage
        || contact.image
        || "";
      const lastRead = readState[threadId] ?? "";
      const unreadMessages = sorted.filter((message) =>
        message.senderUserId !== game?.user?.id && message.createdAt > lastRead
      );

      return {
        id: threadId,
        title: displayTitle,
        subtitle: displaySubtitle,
        initials: displayInitials,
        image: displayImage,
        avatarTone: getAvatarTone(isGroup ? groupId || threadId : routedPlayerMessage?.senderUserId || contact.userId || contact.number || threadId),
        routeLabel,
        hasRouteLabel: Boolean(routeLabel),
        isNpcRouted: Boolean(npcRoutedMessage),
        contact,
        messages: sorted.map((message) => ({
          ...message,
          isMine: message.senderUserId === game?.user?.id,
          isEvent: message.messageType !== "text"
        })),
        lastMessage,
        lastPreview: lastMessage?.body ?? "",
        updatedAt: lastMessage?.createdAt ?? "",
        unread: unreadMessages.length > 0,
        unreadCount: unreadMessages.length,
        active: threadId === activeThreadId,
        isGroup,
        groupId,
        groupName,
        groupMemberUserIds,
        groupMemberNames
      };
    })
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}
