export const DEFAULT_CALL = {
  callerName: "UNKNOWN CALLER",
  subtitle: "Unidentified Signal",
  image: "",
  message: "Incoming transmission...",
  signal: 100,
  variant: "standard",
  fullscreen: false,
  ringing: true,
  accepted: false,
  canAccept: true,
  canDecline: true,
  allowBroadcast: true,
  outgoing: false
};

const VARIANTS = new Set(["standard", "emergency", "corrupted"]);

export function clampSignal(value: unknown) {
  const number = Number(value);
  if (Number.isNaN(number)) return DEFAULT_CALL.signal;
  return Math.min(100, Math.max(0, Math.round(number)));
}

export function getInitials(name: unknown) {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";
}

export function createCallId() {
  if (foundry?.utils?.randomID) return foundry.utils.randomID();
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function normalizeCallData(data: any = {}) {
  const targetUserIds = Array.isArray(data.targetUserIds)
    ? data.targetUserIds.map((id: any) => String(id)).filter(Boolean)
    : [];
  const targetUserNames = Array.isArray(data.targetUserNames)
    ? data.targetUserNames.map((name: any) => String(name)).filter(Boolean)
    : [];
  const call: any = {
    ...DEFAULT_CALL,
    ...data,
    id: String(data.id ?? createCallId()),
    callerName: String(data.callerName ?? DEFAULT_CALL.callerName),
    subtitle: String(data.subtitle ?? DEFAULT_CALL.subtitle),
    image: String(data.image ?? DEFAULT_CALL.image),
    message: String(data.message ?? DEFAULT_CALL.message),
    signal: clampSignal(data.signal ?? DEFAULT_CALL.signal),
    variant: VARIANTS.has(data.variant) ? data.variant : DEFAULT_CALL.variant,
    fullscreen: Boolean(data.fullscreen ?? DEFAULT_CALL.fullscreen),
    ringing: data.ringing !== false && data.accepted !== true,
    accepted: data.accepted === true,
    canAccept: data.canAccept !== false,
    canDecline: data.canDecline !== false,
    allowBroadcast: data.allowBroadcast !== false,
    outgoing: data.outgoing === true,
    callerUserId: String(data.callerUserId ?? ""),
    contactNumber: String(data.contactNumber ?? ""),
    targetUserIds,
    targetUserNames
  };
  call.initials = getInitials(call.callerName);
  call.showBroadcast = Boolean(game?.user?.isGM && call.allowBroadcast);
  call.isStandard = call.variant === "standard";
  call.isEmergency = call.variant === "emergency";
  call.isCorrupted = call.variant === "corrupted";
  call.isIncoming = !call.accepted;
  call.hasTargets = call.targetUserIds.length > 0;
  call.recipientLabel = call.hasTargets ? call.targetUserNames.join(", ") : "All players";
  call.directionLabel = call.outgoing ? `Calling ${call.recipientLabel}` : `From ${call.callerName}`;
  call.kicker = call.outgoing ? "Outgoing CyberCall" : call.fullscreen ? "System-wide Broadcast" : "Incoming CyberCall";
  return call;
}

export function normalizeContact(contact: any = {}) {
  return {
    id: String(contact.id ?? createCallId()),
    name: String(contact.name ?? "").trim(),
    number: String(contact.number ?? "").trim(),
    image: String(contact.image ?? contact.img ?? "").trim(),
    initials: getInitials(contact.name)
  };
}
