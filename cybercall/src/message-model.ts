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
  createdAt: string;
  chatMessageId: string;
  schemaVersion: number;
};

export type CyberCallThread = {
  id: string;
  title: string;
  subtitle: string;
  initials: string;
  contact: any;
  messages: CyberCallMessage[];
  lastMessage: CyberCallMessage | null;
  lastPreview: string;
  updatedAt: string;
  unread: boolean;
  unreadCount: number;
  active: boolean;
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

function createPairThreadId(left: string, right: string) {
  return ["direct", ...[left, right].sort()].join(":");
}

export function createMessageId() {
  return `msg-${createCallId()}`;
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
      const contact = routedContactIdentity ?? senderIdentityContact ?? contactsByUserId.get(otherUserId) ?? contactsByNumber.get(contactNumber) ?? {
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
      const lastRead = readState[threadId] ?? "";
      const unreadMessages = sorted.filter((message) =>
        message.senderUserId !== game?.user?.id && message.createdAt > lastRead
      );

      return {
        id: threadId,
        title: contact.name || lastMessage?.senderName || "Unknown Contact",
        subtitle: contact.number || lastMessage?.senderNumber || "",
        initials: contact.initials || getInitials(contact.name || lastMessage?.senderName),
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
        active: threadId === activeThreadId
      };
    })
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}
