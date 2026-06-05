export const CASE_STATUSES = ["open", "cold", "solved", "classified"];
export const VISIBILITIES = ["gm", "players"];
export const THEMES = ["database", "noir"];
export const EVIDENCE_TYPES = ["physical", "digital", "biological", "weapon", "document", "testimony", "other"];
export const EVIDENCE_STATUSES = ["unknown", "relevant", "red_herring", "confirmed"];
export const SUSPECT_STATUSES = ["unknown", "cleared", "person_of_interest", "prime_suspect", "arrested", "dead"];
export const CONNECTION_TYPES = ["link", "supports", "contradicts", "location", "timeline", "identity"];
export const CONNECTION_STYLES = ["solid", "dashed", "dotted"];
export const CONNECTION_COLORS = ["cyan", "green", "red", "amber", "violet", "orange", "white"];
export const COLLECTIONS = ["evidence", "suspects", "locations", "timeline", "connections"];
export const BOARD_ADD_COLLECTIONS = ["evidence", "suspects", "locations", "timeline", "connections"];
export const CARD_WIDTH = 220;
export const CARD_HEIGHT = 246;
export const BOARD_WIDTH = 5200;
export const BOARD_HEIGHT = 3600;

export function normalizeCase(data: any = {}, { forceNewId = false }: any = {}) {
  return {
    id: forceNewId ? randomId() : data.id || randomId(),
    title: String(data.title || "Untitled Case"),
    subtitle: String(data.subtitle || ""),
    status: normalizeEnum(data.status, CASE_STATUSES, "open"),
    description: String(data.description || ""),
    image: String(data.image || ""),
    visibility: normalizeEnum(data.visibility, VISIBILITIES, "players"),
    evidence: normalizeCollection(data.evidence, normalizeEvidence),
    suspects: normalizeCollection(data.suspects, normalizeSuspect),
    locations: normalizeCollection(data.locations, normalizeLocation),
    timeline: normalizeCollection(data.timeline, normalizeTimelineItem),
    connections: normalizeCollection(data.connections, normalizeConnection),
    boardLayout: normalizeBoardLayout(data.boardLayout)
  };
}

export function normalizeEvidence(data: any = {}) {
  return {
    id: data.id || randomId(),
    title: String(data.title || "Untitled Evidence"),
    type: normalizeEnum(data.type, EVIDENCE_TYPES, "other"),
    description: String(data.description || ""),
    image: String(data.image || ""),
    status: normalizeEnum(data.status, EVIDENCE_STATUSES, "unknown"),
    visibility: normalizeEnum(data.visibility, VISIBILITIES, "players"),
    hidden: Boolean(data.hidden),
    notes: String(data.notes || "")
  };
}

export function normalizeSuspect(data: any = {}) {
  return {
    id: data.id || randomId(),
    name: String(data.name || "Unknown Suspect"),
    alias: String(data.alias || ""),
    image: String(data.image || ""),
    motive: String(data.motive || ""),
    alibi: String(data.alibi || ""),
    status: normalizeEnum(data.status, SUSPECT_STATUSES, "unknown"),
    visibility: normalizeEnum(data.visibility, VISIBILITIES, "players"),
    hidden: Boolean(data.hidden),
    notes: String(data.notes || "")
  };
}

export function normalizeLocation(data: any = {}) {
  return {
    id: data.id || randomId(),
    name: String(data.name || "Unknown Location"),
    sceneId: String(data.sceneId || ""),
    image: String(data.image || ""),
    description: String(data.description || ""),
    visibility: normalizeEnum(data.visibility, VISIBILITIES, "players"),
    hidden: Boolean(data.hidden),
    notes: String(data.notes || "")
  };
}

export function normalizeTimelineItem(data: any = {}) {
  return {
    id: data.id || randomId(),
    time: String(data.time || ""),
    title: String(data.title || "Timeline Event"),
    description: String(data.description || ""),
    linkedItemIds: Array.isArray(data.linkedItemIds) ? data.linkedItemIds.map(String) : [],
    visibility: normalizeEnum(data.visibility, VISIBILITIES, "players"),
    hidden: Boolean(data.hidden)
  };
}

export function normalizeConnection(data: any = {}) {
  return {
    id: data.id || randomId(),
    fromId: String(data.fromId || ""),
    toId: String(data.toId || ""),
    label: String(data.label || ""),
    type: normalizeEnum(data.type, CONNECTION_TYPES, "link"),
    style: normalizeEnum(data.style, CONNECTION_STYLES, "solid"),
    color: normalizeEnum(data.color, CONNECTION_COLORS, connectionDefaultColor(data.type)),
    visibility: normalizeEnum(data.visibility, VISIBILITIES, "players")
  };
}

export function normalizeBoardLayout(data: any = {}) {
  return {
    theme: normalizeEnum(data.theme, THEMES, "database"),
    view: {
      x: Number(data.view?.x) || 0,
      y: Number(data.view?.y) || 0,
      scale: clamp(Number(data.view?.scale) || 1, 0.45, 1.8)
    },
    cards: Object.fromEntries(Object.entries(data.cards ?? {}).map(([id, position]: any) => [id, {
      x: Number(position?.x) || 0,
      y: Number(position?.y) || 0
    }]))
  };
}

export function defaultItem(collection: string, visibility = "players", id = randomId()) {
  if (collection === "evidence") return normalizeEvidence({ id, visibility });
  if (collection === "suspects") return normalizeSuspect({ id, visibility });
  if (collection === "locations") return normalizeLocation({ id, visibility });
  if (collection === "timeline") return normalizeTimelineItem({ id, visibility });
  return normalizeConnection({ id, visibility });
}

function normalizeCollection(collection: any, normalizer: (item: any) => any) {
  return Array.isArray(collection) ? collection.map(item => normalizer(item)) : [];
}

function normalizeEnum(value: any, allowed: any[], fallback: string) {
  return allowed.includes(value) ? value : fallback;
}

export function randomId() {
  if (foundry.utils.randomID) return foundry.utils.randomID();
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 12);
}

function connectionDefaultColor(type: string) {
  if (type === "supports") return "green";
  if (type === "contradicts") return "red";
  if (type === "location") return "amber";
  if (type === "timeline") return "violet";
  if (type === "identity") return "orange";
  return "cyan";
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
