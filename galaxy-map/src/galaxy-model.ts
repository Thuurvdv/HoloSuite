export const SYSTEM_TYPES = ["core", "colony", "frontier", "station", "anomaly", "ruins", "restricted", "unknown"];
export const SYSTEM_STATUSES = ["undiscovered", "known", "visited", "danger", "locked"];
export const ROUTE_TYPES = ["safe", "dangerous", "restricted", "smuggler", "unknown"];
export const VISIBILITIES = ["gm", "players"];
export const ICON_STYLES = ["planet", "ringed", "star", "diamond", "void"];
export const MIN_ZOOM = 0.55;
export const MAX_ZOOM = 2.6;
export const TRAVEL_ANIMATION_MS = 2400;
export const TRAVEL_REQUEST_TIMEOUT_MS = 60_000;

export function randomId(prefix = "gmf") {
  return `${prefix}-${foundry.utils.randomID(10)}`;
}

export function normalizeVisibility(value: unknown, fallback = "players") {
  const safeFallback = VISIBILITIES.includes(fallback) ? fallback : "players";
  return VISIBILITIES.includes(value as string) ? String(value) : safeFallback;
}

export function normalizeColor(value: unknown) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : "#58d8ff";
}

export function normalizeOptionalColor(value: unknown) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : "";
}

export function normalizeNumber(value: unknown, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeSystem(system: any = {}) {
  return {
    id: String(system.id || randomId("system")),
    name: String(system.name || "Unnamed System"),
    x: Math.min(100, Math.max(0, normalizeNumber(system.x, 50))),
    y: Math.min(100, Math.max(0, normalizeNumber(system.y, 50))),
    type: SYSTEM_TYPES.includes(system.type) ? system.type : "unknown",
    factionId: String(system.factionId || ""),
    status: SYSTEM_STATUSES.includes(system.status) ? system.status : "known",
    description: String(system.description || ""),
    image: String(system.image || ""),
    sceneId: String(system.sceneId || ""),
    journalId: String(system.journalId || ""),
    visibility: normalizeVisibility(system.visibility, "players"),
    notes: String(system.notes || ""),
    iconColor: normalizeOptionalColor(system.iconColor),
    iconSize: clamp(normalizeNumber(system.iconSize, 28), 18, 56),
    iconStyle: ICON_STYLES.includes(system.iconStyle) ? system.iconStyle : "planet",
    pulse: system.pulse === false ? false : true
  };
}

export function normalizeRoute(route: any = {}) {
  return {
    id: String(route.id || randomId("route")),
    fromSystemId: String(route.fromSystemId || ""),
    toSystemId: String(route.toSystemId || ""),
    type: ROUTE_TYPES.includes(route.type) ? route.type : "unknown",
    travelTime: String(route.travelTime || ""),
    fuelCost: normalizeNumber(route.fuelCost, 0),
    visibility: normalizeVisibility(route.visibility, "players"),
    notes: String(route.notes || "")
  };
}

export function normalizeFaction(faction: any = {}) {
  return {
    id: String(faction.id || randomId("faction")),
    name: String(faction.name || "Unaffiliated"),
    color: normalizeColor(faction.color),
    description: String(faction.description || ""),
    visibility: normalizeVisibility(faction.visibility, "players")
  };
}

export function normalizeMap(map: any = {}) {
  const systems = Array.isArray(map.systems) ? map.systems.map(normalizeSystem) : [];
  const routes = Array.isArray(map.routes) ? map.routes.map(normalizeRoute) : [];
  const factions = Array.isArray(map.factions) ? map.factions.map(normalizeFaction) : [];

  return {
    id: String(map.id || randomId("map")),
    title: String(map.title || "Untitled Galaxy Map"),
    subtitle: String(map.subtitle || ""),
    description: String(map.description || ""),
    backgroundImage: String(map.backgroundImage || ""),
    visibility: normalizeVisibility(map.visibility, "players"),
    currentSystemId: String(map.currentSystemId || systems[0]?.id || ""),
    systems,
    routes,
    factions
  };
}
