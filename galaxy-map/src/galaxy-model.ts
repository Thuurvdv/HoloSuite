import { normalizePlanetFinish, normalizePlanetPreset, normalizePlanetShape } from "./planet-presets.ts";
import { normalizeTravelApprovalMode } from "./travel-approval.ts";

export const GALAXY_SCHEMA_VERSION = 3;
export const SYSTEM_TYPES = ["core", "colony", "frontier", "ruins", "restricted", "unknown"];
export const LEGACY_SYSTEM_TYPES = [...SYSTEM_TYPES, "station", "anomaly"];
export const OBJECT_KINDS = ["star", "planet", "moon", "station", "asteroid", "anomaly", "black-hole", "other"];
export const SYSTEM_STATUSES = ["undiscovered", "known", "visited", "danger", "locked"];
export const ROUTE_TYPES = ["safe", "dangerous", "restricted", "smuggler", "unknown"];
export const VISIBILITIES = ["gm", "players"];
export const OBJECT_VISIBILITIES = ["inherit", ...VISIBILITIES];
export const ICON_STYLE_OPTIONS = [
  { value: "planet", label: "Planet" }, { value: "terrestrial", label: "Terrestrial" },
  { value: "gas-giant", label: "Gas Giant" }, { value: "ice-world", label: "Ice World" },
  { value: "volcanic", label: "Volcanic" }, { value: "artificial", label: "Artificial / Machine World" },
  { value: "ringed", label: "Ringed" }, { value: "star", label: "Star" },
  { value: "black-hole", label: "Black Hole" }, { value: "station", label: "Space Station" },
  { value: "diamond", label: "Diamond" }, { value: "void", label: "Void" }
];
export const ICON_STYLES = ICON_STYLE_OPTIONS.map((option) => option.value);
export const ANIMATED_CELESTIAL_STYLES = ["planet", "terrestrial", "gas-giant", "ice-world", "volcanic", "artificial", "ringed", "star", "black-hole", "station"];
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 2;
export const TRAVEL_ANIMATION_MS = 2400;
export const TRAVEL_REQUEST_TIMEOUT_MS = 60_000;

export function randomId(prefix = "gmf") { return `${prefix}-${foundry.utils.randomID(10)}`; }
export function normalizeVisibility(value: unknown, fallback = "players") {
  const safeFallback = VISIBILITIES.includes(fallback) ? fallback : "players";
  return VISIBILITIES.includes(value as string) ? String(value) : safeFallback;
}
export function normalizeObjectVisibility(value: unknown) { return OBJECT_VISIBILITIES.includes(value as string) ? String(value) : "inherit"; }
export function normalizeColor(value: unknown) { return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : "#58d8ff"; }
export function normalizeOptionalColor(value: unknown) { return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : ""; }
export function normalizeNumber(value: unknown, fallback = 0) { const numeric = Number(value); return Number.isFinite(numeric) ? numeric : fallback; }
export function normalizeIdList(value: unknown) { const values = Array.isArray(value) ? value : value ? [value] : []; return [...new Set(values.map((id) => String(id).trim()).filter(Boolean))]; }
export function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }

function normalizeVector3(value: unknown, fallback: [number, number, number]): [number, number, number] {
  if (!Array.isArray(value) || value.length < 3) return [...fallback];
  return value.slice(0, 3).map((component, index) => clamp(normalizeNumber(component, fallback[index]), -2.5, 2.5)) as [number, number, number];
}

export function normalizePlanetLocation(location: any = {}) {
  const normal = normalizeVector3(location.normal, [0, 0, 1]);
  const length = Math.hypot(...normal) || 1;
  return {
    id: String(location.id || randomId("location")), sceneId: String(location.sceneId || "").trim(),
    shape: normalizePlanetShape(location.shape), position: normalizeVector3(location.position, [0, 0, 1]),
    normal: normal.map(component => component / length) as [number, number, number], surfaceVersion: 1
  };
}

export function normalizePlanetLocations(value: unknown) {
  const seen = new Set<string>();
  return (Array.isArray(value) ? value : []).slice(0, 64).map(normalizePlanetLocation).filter(location => {
    const key = `${location.sceneId}:${location.shape}`;
    if (!location.sceneId || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function inferObjectKind(value: any = {}) {
  if (OBJECT_KINDS.includes(value.kind)) return value.kind;
  if (value.type === "station" || value.iconStyle === "station") return "station";
  if (value.type === "anomaly") return "anomaly";
  if (value.iconStyle === "star") return "star";
  if (value.iconStyle === "black-hole") return "black-hole";
  if (value.planetShape === "asteroid") return "asteroid";
  if (["planet", "terrestrial", "gas-giant", "ice-world", "volcanic", "artificial", "ringed"].includes(value.iconStyle)) return "planet";
  return "other";
}

export function normalizeSystemObject(object: any = {}) {
  const sceneIds = normalizeIdList(object.sceneIds === undefined ? object.sceneId : object.sceneIds);
  const planetTexture = String(object.planetTexture || "").trim();
  const requestedPlanetPreset = normalizePlanetPreset(object.planetPreset);
  const planetPreset = planetTexture && !["none", "color"].includes(requestedPlanetPreset) ? "custom" : requestedPlanetPreset;
  const kind = inferObjectKind(object);
  const normalized: any = {
    id: String(object.id || randomId("object")), name: String(object.name || "Unnamed Object"), kind,
    x: clamp(normalizeNumber(object.x, 50), 0, 100), y: clamp(normalizeNumber(object.y, 50), 0, 100),
    status: SYSTEM_STATUSES.includes(object.status) ? object.status : "known",
    visibility: normalizeObjectVisibility(object.visibility), factionId: String(object.factionId || ""),
    description: String(object.description || ""), image: String(object.image || ""), sceneIds,
    planetLocations: normalizePlanetLocations(object.planetLocations).filter(location => sceneIds.includes(location.sceneId)),
    journalId: String(object.journalId || ""), notes: String(object.notes || ""),
    iconColor: normalizeOptionalColor(object.iconColor), iconSize: clamp(normalizeNumber(object.iconSize, 28), 18, 56),
    iconStyle: ICON_STYLES.includes(object.iconStyle) ? object.iconStyle : kind === "star" ? "star" : kind === "station" ? "station" : "planet",
    pulse: object.pulse === false ? false : true, planetPreset, planetShape: normalizePlanetShape(object.planetShape),
    planetFinish: normalizePlanetFinish(object.planetFinish),
    planetDetailStrength: clamp(normalizeNumber(object.planetDetailStrength, 45), 0, 100),
    planetTexture, planetColor: normalizeOptionalColor(object.planetColor) || "#58d8ff"
  };
  return normalized;
}

export function normalizeSystem(system: any = {}) {
  const objects = Array.isArray(system.objects) ? system.objects.map(normalizeSystemObject) : [];
  const objectIds = new Set(objects.map((object: any) => object.id));
  const routes = (Array.isArray(system.routes) ? system.routes : []).map(normalizeRoute)
    .filter(route => route.fromSystemId !== route.toSystemId && objectIds.has(route.fromSystemId) && objectIds.has(route.toSystemId));
  const primaryObjectId = objects.some((object: any) => object.id === system.primaryObjectId) ? String(system.primaryObjectId) : objects[0]?.id ?? "";
  // Transitional read facade for 1.x callers. Canonical object data lives in
  // `objects`; these fields can be removed once the deprecated API is retired.
  const primary = objects.find((object: any) => object.id === primaryObjectId) ?? normalizeSystemObject(system);
  const normalized: any = {
    id: String(system.id || randomId("system")), name: String(system.name || "Unnamed System"),
    x: clamp(normalizeNumber(system.x, 50), 0, 100), y: clamp(normalizeNumber(system.y, 50), 0, 100),
    type: SYSTEM_TYPES.includes(system.type) ? system.type : "unknown", factionId: String(system.factionId || ""),
    status: SYSTEM_STATUSES.includes(system.status) ? system.status : "known", description: String(system.description || ""),
    visibility: normalizeVisibility(system.visibility, "players"), notes: String(system.notes || ""),
    iconColor: normalizeOptionalColor(system.iconColor), iconSize: clamp(normalizeNumber(system.iconSize, 30), 18, 56),
    iconStyle: ICON_STYLES.includes(system.iconStyle) ? system.iconStyle : "star", pulse: system.pulse === false ? false : true,
    primaryObjectId, objects, routes
  };
  for (const [key, value] of Object.entries({
    image: primary.image, sceneIds: [...primary.sceneIds], planetLocations: [...primary.planetLocations], journalId: primary.journalId,
    planetPreset: primary.planetPreset, planetShape: primary.planetShape,
    planetFinish: primary.planetFinish, planetDetailStrength: primary.planetDetailStrength,
    planetTexture: primary.planetTexture, planetColor: primary.planetColor
  })) Object.defineProperty(normalized, key, { value, enumerable: false, configurable: true });
  return normalized;
}

export function normalizeRoute(route: any = {}) {
  return { id: String(route.id || randomId("route")), fromSystemId: String(route.fromSystemId || ""), toSystemId: String(route.toSystemId || ""),
    type: ROUTE_TYPES.includes(route.type) ? route.type : "unknown", travelTime: String(route.travelTime || ""),
    fuelCost: normalizeNumber(route.fuelCost, 0), visibility: normalizeVisibility(route.visibility, "players"), notes: String(route.notes || "") };
}
export function normalizeFaction(faction: any = {}) {
  return { id: String(faction.id || randomId("faction")), name: String(faction.name || "Unaffiliated"), color: normalizeColor(faction.color),
    description: String(faction.description || ""), visibility: normalizeVisibility(faction.visibility, "players") };
}

function getDefaultSystemId(map: any = {}) {
  return `${String(map.id || "galaxy")}-system-1`;
}

function migrateLegacyEntity(legacy: any = {}) {
  const objectId = String(legacy.id || legacy.objectId || randomId("object"));
  const kind = inferObjectKind(legacy);
  return {
    ...legacy, id: objectId, name: String(legacy.name || "Unnamed Entity"), kind, x: legacy.x, y: legacy.y,
    visibility: legacy.visibility,
    iconColor: legacy.iconColor, iconSize: legacy.iconSize,
    iconStyle: legacy.iconStyle === "planet" && kind !== "planet" ? (kind === "station" ? "station" : kind === "star" ? "star" : "diamond") : legacy.iconStyle,
    pulse: legacy.pulse
  };
}

function createDefaultSystem(map: any, objects: any[], currentObjectId = "", id = getDefaultSystemId(map), routes: any[] = []) {
  const primaryObjectId = objects.some(object => object.id === currentObjectId) ? currentObjectId : objects[0]?.id ?? "";
  return {
    id, name: "System 1", x: 50, y: 50, type: "core", factionId: "", status: "known",
    description: "", visibility: normalizeVisibility(map.visibility, "players"), notes: "",
    iconColor: "", iconSize: 30, iconStyle: "star", pulse: true, primaryObjectId, objects, routes
  };
}

function migrateSchema1Map(map: any, version: number) {
  const legacySystems = Array.isArray(map.systems) ? map.systems : [];
  const objects = legacySystems.map(migrateLegacyEntity);
  const currentObjectId = String(map.currentSystemId || objects[0]?.id || "");
  const defaultSystem = createDefaultSystem(map, objects, currentObjectId, getDefaultSystemId(map), Array.isArray(map.routes) ? map.routes : []);
  return {
    ...map, schemaVersion: GALAXY_SCHEMA_VERSION, migratedFromSchema: version,
    systems: [defaultSystem], routes: [],
    currentLocation: { systemId: defaultSystem.id, objectId: defaultSystem.primaryObjectId },
    currentSystemId: defaultSystem.id
  };
}

function isGeneratedSchema2Wrapper(system: any) {
  return Boolean(system?.id && system?.primaryObjectId === `${system.id}-object`
    && Array.isArray(system.objects) && system.objects.some((object: any) => object.id === system.primaryObjectId));
}

function migrateSchema2Map(map: any) {
  const sourceSystems = Array.isArray(map.systems) ? map.systems : [];
  const wrappers = sourceSystems.filter(isGeneratedSchema2Wrapper);
  const retainedSystems = sourceSystems.filter(system => !isGeneratedSchema2Wrapper(system));
  if (!wrappers.length && sourceSystems.length) return { ...map, schemaVersion: GALAXY_SCHEMA_VERSION };

  const retainedIds = new Set(retainedSystems.map(system => String(system.id)));
  let defaultSystemId = getDefaultSystemId(map);
  if (retainedIds.has(defaultSystemId)) defaultSystemId = `${defaultSystemId}-legacy`;
  const collapsedIds = new Set(wrappers.map(system => String(system.id)));
  const wrapperObjectIds = new Map(wrappers.map(system => [String(system.id), String(system.primaryObjectId)]));
  const objects = wrappers.flatMap(system => (system.objects ?? []).map((object: any) => {
    const primary = object.id === system.primaryObjectId;
    return {
      ...object,
      x: primary ? system.x : object.x,
      y: primary ? system.y : object.y,
      visibility: object.visibility === "inherit" ? system.visibility : object.visibility,
      factionId: object.factionId || system.factionId || ""
    };
  }));
  const previousCurrentSystemId = String(map.currentLocation?.systemId || map.currentSystemId || "");
  const previousWrapper = wrappers.find(system => system.id === previousCurrentSystemId);
  const currentObjectId = String(map.currentLocation?.objectId || previousWrapper?.primaryObjectId || objects[0]?.id || "");
  const sourceRoutes = Array.isArray(map.routes) ? map.routes : [];
  const entityRoutes = sourceRoutes.filter(route => collapsedIds.has(String(route.fromSystemId)) && collapsedIds.has(String(route.toSystemId)))
    .map(route => ({ ...route, fromSystemId: wrapperObjectIds.get(String(route.fromSystemId)), toSystemId: wrapperObjectIds.get(String(route.toSystemId)) }));
  const defaultSystem = createDefaultSystem(map, objects, currentObjectId, defaultSystemId, entityRoutes);
  const systems = [defaultSystem, ...retainedSystems];
  const validSystemIds = new Set(systems.map(system => String(system.id)));
  const seenRoutes = new Set<string>();
  const routes = sourceRoutes.filter(route => !(collapsedIds.has(String(route.fromSystemId)) && collapsedIds.has(String(route.toSystemId)))).map(route => ({
    ...route,
    fromSystemId: collapsedIds.has(String(route.fromSystemId)) ? defaultSystemId : route.fromSystemId,
    toSystemId: collapsedIds.has(String(route.toSystemId)) ? defaultSystemId : route.toSystemId
  })).filter(route => {
    if (route.fromSystemId === route.toSystemId || !validSystemIds.has(String(route.fromSystemId)) || !validSystemIds.has(String(route.toSystemId))) return false;
    const key = [route.fromSystemId, route.toSystemId].sort().join(":");
    if (seenRoutes.has(key)) return false;
    seenRoutes.add(key);
    return true;
  });
  const currentSystemId = collapsedIds.has(previousCurrentSystemId) || !validSystemIds.has(previousCurrentSystemId)
    ? defaultSystemId : previousCurrentSystemId;
  return {
    ...map, schemaVersion: GALAXY_SCHEMA_VERSION, migratedFromSchema: 2, systems, routes,
    currentLocation: { systemId: currentSystemId, objectId: currentSystemId === defaultSystemId ? defaultSystem.primaryObjectId : map.currentLocation?.objectId ?? "" },
    currentSystemId
  };
}

export function migrateMap(map: any = {}) {
  const version = Number(map.schemaVersion) || 1;
  if (version > GALAXY_SCHEMA_VERSION) throw new Error(`Galaxy Map schema ${version} is newer than supported schema ${GALAXY_SCHEMA_VERSION}.`);
  if (version >= GALAXY_SCHEMA_VERSION) return { ...map, schemaVersion: GALAXY_SCHEMA_VERSION };
  if (version < 2) return migrateSchema1Map(map, version);
  return migrateSchema2Map(map);
}

export function normalizeMap(input: any = {}) {
  const map = migrateMap(input);
  const systems = Array.isArray(map.systems) ? map.systems.map(normalizeSystem) : [];
  const routes = Array.isArray(map.routes) ? map.routes.map(normalizeRoute) : [];
  const factions = Array.isArray(map.factions) ? map.factions.map(normalizeFaction) : [];
  const requestedSystemId = String(map.currentLocation?.systemId || map.currentSystemId || systems[0]?.id || "");
  const currentSystemId = systems.some((system: any) => system.id === requestedSystemId) ? requestedSystemId : systems[0]?.id ?? "";
  const currentSystem = systems.find((system: any) => system.id === currentSystemId);
  const requestedObjectId = String(map.currentLocation?.objectId || "");
  const currentObjectId = currentSystem?.objects.some((object: any) => object.id === requestedObjectId) ? requestedObjectId : currentSystem?.primaryObjectId ?? "";
  return {
    schemaVersion: GALAXY_SCHEMA_VERSION, id: String(map.id || randomId("map")), title: String(map.title || "Untitled Galaxy Map"),
    subtitle: String(map.subtitle || ""), description: String(map.description || ""), backgroundImage: String(map.backgroundImage || ""),
    visibility: normalizeVisibility(map.visibility, "players"), travelApprovalMode: normalizeTravelApprovalMode(map.travelApprovalMode),
    currentLocation: { systemId: currentSystemId, objectId: currentObjectId }, currentSystemId, systems, routes, factions
  };
}

export function getSystemObject(system: any, objectId = "") {
  if (!system) return null;
  return system.objects?.find((object: any) => object.id === objectId) ?? system.objects?.find((object: any) => object.id === system.primaryObjectId) ?? system.objects?.[0] ?? null;
}
export function getEffectiveObjectVisibility(system: any, object: any) { return object?.visibility === "inherit" ? system?.visibility ?? "gm" : object?.visibility ?? "gm"; }
