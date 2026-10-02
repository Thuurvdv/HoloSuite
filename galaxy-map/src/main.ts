import {
  ANIMATED_CELESTIAL_STYLES,
  GALAXY_SCHEMA_VERSION,
  OBJECT_VISIBILITIES,
  TRAVEL_ANIMATION_MS,
  TRAVEL_REQUEST_TIMEOUT_MS,
  clamp,
  getEffectiveObjectVisibility,
  normalizeFaction,
  normalizeMap,
  normalizeNumber,
  normalizePlanetLocation,
  normalizePlanetLocations,
  normalizeRoute,
  normalizeSystem,
  normalizeSystemObject,
  randomId
} from "./galaxy-model";
import { createGalaxyMapManagerClass } from "./manager-app";
import { createGalaxyMapViewClass } from "./view-app";
import { createPlayerMapChooserClass } from "./player-map-chooser-app";
import { getPlanetAppearance, getPlanetOptionsForShape, normalizePlanetPresetForShape } from "./planet-presets";
import { evaluateTravelApproval, getTravelElectorate, TRAVEL_APPROVAL_OPTIONS } from "./travel-approval";
import { MODULE_ID, SETTING_MAPS, SETTING_SCHEMA_V1_BACKUP, SETTING_SURFACE_LOCATION_RECOVERY, SOCKET_NAME, TEMPLATE_ROOT } from "./constants";
import { bindFilePickerFields, downloadJson, escapeHtml, getHtmlElement, slugify } from "./dom-utils";
import { activateGalaxyDialogChrome } from "./window-chrome";

let managerApp = null;
const openMaps = new Map();
let playerMapApp = null;
let playerMapChooserApp = null;
const pendingTravelRequests = new Map();
const promptedTravelRequests = new Set();
const travelRequestPrompts = new Map();
const latestTravelProgress = new Map();

function clone(data) {
  return foundry.utils.deepClone(data);
}

function notifyError(message) {
  ui.notifications?.error(`[Galaxy Map] ${message}`);
}

function notifyInfo(message) {
  ui.notifications?.info(`[Galaxy Map] ${message}`);
}

function requireGM(action = "change galaxy maps") {
  if (game.user?.isGM) return true;
  notifyError(`Only a GM can ${action}.`);
  return false;
}

function getActiveUsers() {
  return game.users.filter((user) => user.active);
}

function getPrimaryGM() {
  return getActiveUsers()
    .filter((user) => user.isGM)
    .sort((left, right) => String(left.id).localeCompare(String(right.id)))[0] ?? null;
}

function isPrimaryGM() {
  return Boolean(game.user?.isGM && getPrimaryGM()?.id === game.user.id);
}

function getMapStore() {
  return clone(game.settings.get(MODULE_ID, SETTING_MAPS) ?? {});
}

async function saveMapStore(maps) {
  if (!requireGM("save galaxy map data")) return maps;
  await game.settings.set(MODULE_ID, SETTING_MAPS, maps ?? {});
  return maps;
}

function activateAppearancePanelControls(root: HTMLElement) {
  bindFilePickerFields(root);
  root.querySelectorAll<HTMLInputElement>("[data-use-custom-marker]").forEach((toggle) => {
    const field: HTMLElement | null = (toggle.closest("form") ?? root).querySelector("[data-custom-marker-field]");
    const input: HTMLInputElement | null = field?.querySelector('[name="markerImage"]') ?? null;
    const buttons = field?.querySelectorAll<HTMLButtonElement>("button") ?? [];
    const sync = () => {
      const enabled = toggle.checked;
      field?.classList.toggle("is-disabled", !enabled);
      if (input) input.disabled = !enabled;
      buttons.forEach(button => { button.disabled = !enabled; });
      if (!enabled && input?.value) {
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };
    toggle.addEventListener("change", sync);
    sync();
  });
  const texturePanel = root.querySelector<HTMLElement>("[data-texture-upload-fields]");
  const textureInput = root.querySelector<HTMLInputElement>('[name="planetTexture"]');
  const appearanceInput = root.querySelector<HTMLSelectElement>('[name="planetPreset"]');
  const shapeInput = root.querySelector<HTMLSelectElement>('[name="planetShape"]');
  const finishInput = root.querySelector<HTMLSelectElement>('[name="planetFinish"]');
  const colorInput = root.querySelector<HTMLInputElement>('[name="planetColor"]');
  const textureGuide = root.querySelector<HTMLElement>("[data-texture-guide]");
  const textureGuideSection = root.querySelector<HTMLElement>("[data-texture-guide-section]");
  const texturePreviews = root.querySelectorAll<HTMLImageElement>("[data-texture-guide-preview]");
  const updateAppearanceOptions = () => {
    if (!appearanceInput || !shapeInput) return;
    const selected = normalizePlanetPresetForShape(appearanceInput.value, shapeInput.value);
    appearanceInput.replaceChildren(...getPlanetOptionsForShape(shapeInput.value).map(option => {
      const element = document.createElement("option");
      element.value = option.value;
      element.textContent = option.label;
      return element;
    }));
    appearanceInput.value = selected;
  };
  const updateCustomTextureState = () => {
    const custom = appearanceInput?.value === "custom";
    const noDetail = appearanceInput?.value === "none";
    if (texturePanel) texturePanel.hidden = !custom;
    if (textureGuideSection) textureGuideSection.hidden = !custom;
    if (textureInput) textureInput.required = custom;
    if (shapeInput) shapeInput.disabled = noDetail;
    if (finishInput) finishInput.disabled = noDetail;
    if (colorInput) colorInput.disabled = appearanceInput?.value !== "color";
    return custom;
  };
  const updateTexturePreview = () => {
    if (!textureGuide) return;
    const path = textureInput?.value?.trim();
    if (path) textureGuide.dataset.hasTexture = "true";
    else delete textureGuide.dataset.hasTexture;
    texturePreviews.forEach((preview) => {
      preview.onerror = path ? () => { preview.hidden = true; } : null;
      preview.hidden = !path;
      if (path) preview.src = path;
      else preview.removeAttribute("src");
    });
  };
  appearanceInput?.addEventListener("change", () => {
    const custom = updateCustomTextureState();
    if (!custom && textureInput?.value) {
      textureInput.value = "";
      textureInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
  textureInput?.addEventListener("change", updateTexturePreview);
  shapeInput?.addEventListener("change", () => {
    if (textureGuide) textureGuide.dataset.shape = shapeInput.value;
    updateAppearanceOptions();
    updateCustomTextureState();
  });
  updateAppearanceOptions();
  updateCustomTextureState();
  updateTexturePreview();
}

function getRawMap(mapId) {
  const maps = getMapStore();
  return maps[mapId] ? clone(maps[mapId]) : null;
}

function getFactionLookup(factions: any[]) {
  return new Map((factions ?? []).map((faction) => [faction.id, faction]));
}

function canPlayerSeeSystem(system) {
  return system.visibility === "players";
}

function isSystemObscured(system, playerMode) {
  return playerMode && system.status === "undiscovered";
}

function getDisplayIconStyle(type, iconStyle) {
  const typeIconFallbacks: Record<string, string> = { station: "station", anomaly: "diamond", ruins: "diamond", unknown: "diamond" };
  return iconStyle === "planet" ? typeIconFallbacks[type] ?? iconStyle : iconStyle;
}

function prepareMapForDisplay(map, { playerMode = false, selectedSystemId = null, selectedRouteId = null } = {}) {
  const normalized = normalizeMap(map);
  const systems = playerMode ? normalized.systems.filter(canPlayerSeeSystem) : normalized.systems;
  const visibleSystemIds = new Set(systems.map((system) => system.id));
  const factions = playerMode
    ? normalized.factions.filter((faction) => faction.visibility === "players")
    : normalized.factions;
  const factionLookup = getFactionLookup(factions);

  const displaySystems = systems.map((system) => {
    const faction = factionLookup.get(system.factionId);
    const obscured = isSystemObscured(system, playerMode);
    const displayType = obscured ? "unknown" : system.type;
    const displayIconStyle = obscured
      ? "diamond"
      : getDisplayIconStyle(displayType, system.iconStyle);
    const displayMarkerImage = obscured ? "" : system.markerImage;
    return {
      ...system,
      image: system.image,
      sceneIds: [...system.sceneIds],
      journalId: system.journalId,
      planetPreset: system.planetPreset,
      planetShape: system.planetShape,
      planetTexture: system.planetTexture,
      planetColor: system.planetColor,
      iconStyle: displayIconStyle,
      displayMarkerImage,
      hasCustomMarker: Boolean(displayMarkerImage),
      displayName: obscured ? "???" : system.name,
      displayDescription: obscured ? "Unresolved sensor contact. Details are not available." : system.description,
      displayType,
      displayStatus: obscured ? "undiscovered" : system.status,
      factionName: faction?.name ?? "Unaffiliated",
      factionColor: system.iconColor || faction?.color || "#58d8ff",
      obscured,
      isCurrent: system.id === normalized.currentSystemId,
      isSelected: system.id === selectedSystemId,
      gmOnly: system.visibility === "gm",
      animatedCelestial: !displayMarkerImage && ANIMATED_CELESTIAL_STYLES.includes(displayIconStyle),
      hasAlert: ["danger", "locked"].includes(obscured ? "undiscovered" : system.status),
      alertLabel: system.status === "danger" ? "Hazard advisory" : system.status === "locked" ? "Restricted access" : "",
      hasJournal: Boolean(!obscured && system.journalId),
      hasScenes: Boolean(!obscured && system.sceneIds.length),
      showImage: Boolean(!obscured && system.image),
      canInspectSystem: Boolean(getPlanetAppearance({ ...system, planetPreset: system.planetPreset, planetShape: system.planetShape, planetTexture: system.planetTexture, planetColor: system.planetColor, iconStyle: displayIconStyle, obscured }))
    };
  });

  const routes = normalized.routes
    .filter((route) => !playerMode || route.visibility === "players")
    .filter((route) => visibleSystemIds.has(route.fromSystemId) && visibleSystemIds.has(route.toSystemId))
    .map((route) => {
      const from = displaySystems.find((system) => system.id === route.fromSystemId);
      const to = displaySystems.find((system) => system.id === route.toSystemId);
      return {
        ...route,
        from,
        to,
        fromName: from?.displayName ?? route.fromSystemId,
        toName: to?.displayName ?? route.toSystemId,
        isSelected: route.id === selectedRouteId,
        connectsCurrent: route.fromSystemId === normalized.currentSystemId || route.toSystemId === normalized.currentSystemId,
        gmOnly: route.visibility === "gm"
      };
    });

  const selectedRoute = routes.find((route) => route.id === selectedRouteId) ?? null;
  const selectedSystem = selectedRoute
    ? null
    : displaySystems.find((system) => system.id === selectedSystemId) ?? null;
  if (selectedSystem) selectedSystem.isSelected = true;
  const currentSystem = displaySystems.find((system) => system.id === normalized.currentSystemId) ?? displaySystems[0] ?? null;
  const selectedTravelRoute = selectedSystem && currentSystem && selectedSystem.id !== currentSystem.id
    ? routes.find((route) => (
      (route.fromSystemId === currentSystem.id && route.toSystemId === selectedSystem.id)
      || (route.toSystemId === currentSystem.id && route.fromSystemId === selectedSystem.id)
    ))
    : null;
  if (selectedSystem) {
    selectedSystem.canTravel = Boolean(selectedTravelRoute);
    selectedSystem.travelRouteId = selectedTravelRoute?.id ?? "";
    selectedSystem.isCurrent = selectedSystem.id === currentSystem?.id;
    selectedSystem.isDestination = Boolean(selectedTravelRoute && !selectedSystem.isCurrent);
  }
  routes.forEach((route) => {
    route.isActive = route.isSelected || route.id === selectedTravelRoute?.id;
  });

  return {
    ...normalized,
    systems: displaySystems,
    routes,
    factions,
    selectedSystem,
    selectedRoute,
    currentSystem,
    selectedType: selectedRoute ? "route" : selectedSystem ? "system" : null,
    playerMode,
    isGM: game.user?.isGM ?? false,
    canEdit: game.user?.isGM && !playerMode
  };
}

async function createMap(mapData = {}) {
  if (!requireGM("create galaxy maps")) return null;
  const maps = getMapStore();
  const map = normalizeMap(mapData);
  maps[map.id] = map;
  await saveMapStore(maps);
  refreshOpenApps(map.id);
  return clone(map);
}

async function updateMap(mapId, mapData = {}) {
  if (!requireGM("update galaxy maps")) return null;
  const maps = getMapStore();
  if (!maps[mapId]) {
    notifyError(`Map "${mapId}" was not found.`);
    return null;
  }
  const normalized = normalizeMap({ ...mapData, id: mapId });
  maps[mapId] = normalized;
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  return clone(normalized);
}

async function updateMapMetadata(mapId, metadata: any = {}) {
  if (!requireGM("update galaxy map metadata")) return null;
  const map = getRawMap(mapId);
  if (!map) {
    notifyError(`Map "${mapId}" was not found.`);
    return null;
  }
  return updateMap(mapId, {
    ...map,
    title: metadata.title,
    subtitle: metadata.subtitle,
    description: metadata.description,
    backgroundImage: metadata.backgroundImage,
    visibility: metadata.visibility,
    travelApprovalMode: metadata.travelApprovalMode
  });
}

async function deleteMap(mapId) {
  if (!requireGM("delete galaxy maps")) return false;
  const maps = getMapStore();
  if (!maps[mapId]) return false;
  delete maps[mapId];
  await saveMapStore(maps);
  closeOpenMap(mapId);
  refreshOpenApps();
  return true;
}

async function duplicateMap(mapId) {
  if (!requireGM("duplicate galaxy maps")) return null;
  const source = getRawMap(mapId);
  if (!source) {
    notifyError(`Map "${mapId}" was not found.`);
    return null;
  }
  const copy = normalizeMap({
    ...source,
    id: randomId("map"),
    title: `${source.title} Copy`
  });
  const maps = getMapStore();
  maps[copy.id] = copy;
  await saveMapStore(maps);
  refreshOpenApps(copy.id);
  return clone(copy);
}

async function upsertSystem(mapId, systemData = {}) {
  if (!requireGM("save star systems")) return null;
  const maps = getMapStore();
  if (!maps[mapId]) {
    notifyError(`Map "${mapId}" was not found.`);
    return null;
  }
  const map = normalizeMap(maps[mapId]);
  const existing = map.systems.find((candidate) => candidate.id === systemData.id);
  const objects = systemData.objects ?? existing?.objects ?? [];
  const primaryId = existing?.primaryObjectId || objects[0]?.id;
  const objectFields = ["image", "sceneIds", "planetLocations", "journalId", "planetPreset", "planetShape", "planetFinish", "planetTexture", "planetColor"];
  const mergedObjects = objects.map((object) => object.id !== primaryId ? object : normalizeSystemObject({
    ...object,
    ...Object.fromEntries(objectFields.filter((key) => systemData[key] !== undefined).map((key) => [key, systemData[key]]))
  }));
  const system = normalizeSystem({ ...existing, ...systemData, objects: mergedObjects });
  const index = map.systems.findIndex((candidate) => candidate.id === system.id);
  if (index >= 0) map.systems[index] = system;
  else map.systems.push(system);
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  return clone(system);
}

async function upsertObject(mapId, systemId, objectData = {}) {
  if (!requireGM("save entities")) return null;
  const maps = getMapStore();
  if (!maps[mapId]) return null;
  const map = normalizeMap(maps[mapId]);
  const system = map.systems.find((candidate) => candidate.id === systemId);
  if (!system) return null;
  const object = normalizeSystemObject(objectData);
  const index = system.objects.findIndex((candidate) => candidate.id === object.id);
  if (index >= 0) system.objects[index] = object;
  else system.objects.push(object);
  if (!system.primaryObjectId) system.primaryObjectId = object.id;
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  return clone(object);
}

function updateOpenPlanetLocations(mapId, systemId, objectId) {
  for (const app of getOpenMapViews(mapId)) app.refreshPlanetLocations?.(systemId, objectId);
}

async function savePlanetLocation(mapId, systemId, objectId, locationData: any = {}) {
  if (!requireGM("place surface locations")) return null;
  const maps = getMapStore();
  const map = maps[mapId] ? normalizeMap(maps[mapId]) : null;
  const system = map?.systems.find(candidate => candidate.id === systemId);
  const object = system?.objects.find(candidate => candidate.id === objectId);
  if (!map || !system || !object) return null;
  const sceneId = String(locationData.sceneId || "");
  if (!object.sceneIds.includes(sceneId)) {
    notifyError("Only scenes linked to this object can be placed on its surface.");
    return null;
  }
  const location = normalizePlanetLocation(locationData);
  const index = object.planetLocations.findIndex(candidate => candidate.sceneId === sceneId && candidate.shape === location.shape);
  if (index >= 0) location.id = object.planetLocations[index].id;
  if (index >= 0) object.planetLocations[index] = location;
  else object.planetLocations.push(location);
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  updateOpenPlanetLocations(mapId, systemId, objectId);
  game.socket.emit(SOCKET_NAME, { action: "planet-locations", mapId, systemId, objectId });
  return clone(location);
}

async function removePlanetLocation(mapId, systemId, objectId, locationId) {
  if (!requireGM("remove surface locations")) return false;
  const maps = getMapStore();
  const map = maps[mapId] ? normalizeMap(maps[mapId]) : null;
  const object = map?.systems.find(candidate => candidate.id === systemId)?.objects.find(candidate => candidate.id === objectId);
  if (!map || !object) return false;
  const before = object.planetLocations.length;
  object.planetLocations = object.planetLocations.filter(candidate => candidate.id !== locationId);
  if (object.planetLocations.length === before) return false;
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  updateOpenPlanetLocations(mapId, systemId, objectId);
  game.socket.emit(SOCKET_NAME, { action: "planet-locations", mapId, systemId, objectId });
  return true;
}

async function unlinkPlanetScene(mapId, systemId, objectId, sceneId) {
  if (!requireGM("unlink scenes from entities")) return false;
  const map = getRawMap(mapId);
  const object = map?.systems.find(candidate => candidate.id === systemId)?.objects.find(candidate => candidate.id === objectId);
  if (!object?.sceneIds.includes(sceneId)) return false;
  return Boolean(await upsertObject(mapId, systemId, { ...object, sceneIds: object.sceneIds.filter(candidate => candidate !== sceneId) }));
}

async function deleteObject(mapId, systemId, objectId) {
  if (!requireGM("delete entities")) return false;
  const maps = getMapStore();
  if (!maps[mapId]) return false;
  const map = normalizeMap(maps[mapId]);
  const system = map.systems.find((candidate) => candidate.id === systemId);
  if (!system) return false;
  system.objects = system.objects.filter((candidate) => candidate.id !== objectId);
  if (system.primaryObjectId === objectId) system.primaryObjectId = system.objects[0]?.id ?? "";
  if (map.currentLocation.objectId === objectId) map.currentLocation.objectId = system.primaryObjectId;
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  return true;
}

async function moveObject(mapId, objectId, destinationSystemId) {
  if (!requireGM("move entities")) return null;
  const maps = getMapStore();
  if (!maps[mapId]) return null;
  const map = normalizeMap(maps[mapId]);
  const source = map.systems.find((system) => system.objects.some((object) => object.id === objectId));
  const destination = map.systems.find((system) => system.id === destinationSystemId);
  const object = source?.objects.find((candidate) => candidate.id === objectId);
  if (!source || !destination || !object) return null;
  source.objects = source.objects.filter((candidate) => candidate.id !== objectId);
  destination.objects.push(object);
  if (source.primaryObjectId === objectId) source.primaryObjectId = source.objects[0]?.id ?? "";
  if (!destination.primaryObjectId) destination.primaryObjectId = objectId;
  if (map.currentLocation.objectId === objectId) map.currentLocation.systemId = destination.id;
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  return clone(object);
}

async function setPrimaryObject(mapId, systemId, objectId) {
  if (!requireGM("set the arrival object")) return null;
  const maps = getMapStore();
  if (!maps[mapId]) return null;
  const map = normalizeMap(maps[mapId]);
  const system = map.systems.find((candidate) => candidate.id === systemId);
  if (!system?.objects.some((object) => object.id === objectId)) return null;
  system.primaryObjectId = objectId;
  if (map.currentLocation.systemId === systemId && !map.currentLocation.objectId) map.currentLocation.objectId = objectId;
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  return clone(system);
}

async function saveObjectPosition(mapId, systemId, objectId, x, y) {
  const maps = getMapStore();
  if (!maps[mapId]) return null;
  const map = normalizeMap(maps[mapId]);
  const object = map.systems.find((system) => system.id === systemId)?.objects.find((candidate) => candidate.id === objectId);
  if (!object) return null;
  object.x = clamp(normalizeNumber(x, object.x), 0, 100);
  object.y = clamp(normalizeNumber(y, object.y), 0, 100);
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  return clone(object);
}

async function setObjectVisibility(mapId, systemId, objectId, visibility) {
  if (!requireGM("change object visibility")) return null;
  const maps = getMapStore();
  if (!maps[mapId]) return null;
  const map = normalizeMap(maps[mapId]);
  const object = map.systems.find((system) => system.id === systemId)?.objects.find((candidate) => candidate.id === objectId);
  if (!object) return null;
  object.visibility = OBJECT_VISIBILITIES.includes(visibility) ? visibility : "inherit";
  if (object.visibility === "players" && ["undiscovered", "locked"].includes(object.status)) object.status = "known";
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  return clone(object);
}

async function deleteSystem(mapId, systemId) {
  if (!requireGM("delete star systems")) return false;
  const maps = getMapStore();
  const map = maps[mapId];
  if (!map) return false;
  map.systems = map.systems.filter((system) => system.id !== systemId);
  map.routes = map.routes.filter((route) => route.fromSystemId !== systemId && route.toSystemId !== systemId);
  if (map.currentSystemId === systemId) map.currentSystemId = map.systems[0]?.id ?? "";
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  return true;
}

async function setCurrentSystem(mapId, systemId) {
  if (!requireGM("set current location")) return null;
  const maps = getMapStore();
  const map = maps[mapId] ? normalizeMap(maps[mapId]) : null;
  const system = map?.systems?.find((candidate) => candidate.id === systemId);
  if (!system) {
    notifyError(`System "${systemId}" was not found.`);
    return null;
  }
  map.currentSystemId = systemId;
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  return clone(system);
}

async function setCurrentObject(mapId, systemId, objectId) {
  if (!requireGM("set current location")) return null;
  const maps = getMapStore();
  if (!maps[mapId]) return null;
  const map = normalizeMap(maps[mapId]);
  const system = map.systems.find((candidate) => candidate.id === systemId);
  const object = system?.objects.find((candidate) => candidate.id === objectId);
  if (!system || !object) return null;
  map.currentSystemId = systemId;
  map.currentLocation = { systemId, objectId };
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  return clone(object);
}

async function upsertRoute(mapId, routeData = {}, systemId = "") {
  if (!requireGM("save routes")) return null;
  const maps = getMapStore();
  const map = maps[mapId];
  if (!map) {
    notifyError(`Map "${mapId}" was not found.`);
    return null;
  }
  const routeOwner = systemId ? map.systems?.find((system) => system.id === systemId) : map;
  if (!routeOwner) {
    notifyError(`System "${systemId}" was not found.`);
    return null;
  }
  if (!Array.isArray(routeOwner.routes)) routeOwner.routes = [];
  const route = normalizeRoute(routeData);
  if (!route.fromSystemId || !route.toSystemId || route.fromSystemId === route.toSystemId) {
    notifyError("Routes require two different systems.");
    return null;
  }
  const index = routeOwner.routes.findIndex((candidate) => candidate.id === route.id);
  if (index >= 0) routeOwner.routes[index] = route;
  else routeOwner.routes.push(route);
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  return clone(route);
}

async function deleteRoute(mapId, routeId, systemId = "") {
  if (!requireGM("delete routes")) return false;
  const maps = getMapStore();
  const map = maps[mapId];
  if (!map) return false;
  const routeOwner = systemId ? map.systems?.find((system) => system.id === systemId) : map;
  if (!routeOwner) return false;
  routeOwner.routes = (routeOwner.routes ?? []).filter((route) => route.id !== routeId);
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  return true;
}

async function upsertFaction(mapId, factionData = {}) {
  if (!requireGM("save factions")) return null;
  const maps = getMapStore();
  const map = maps[mapId];
  if (!map) {
    notifyError(`Map "${mapId}" was not found.`);
    return null;
  }
  const faction = normalizeFaction(factionData);
  const index = map.factions.findIndex((candidate) => candidate.id === faction.id);
  if (index >= 0) map.factions[index] = faction;
  else map.factions.push(faction);
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  return clone(faction);
}

async function deleteFaction(mapId, factionId) {
  if (!requireGM("delete factions")) return false;
  const maps = getMapStore();
  const map = maps[mapId];
  if (!map) return false;
  map.factions = map.factions.filter((faction) => faction.id !== factionId);
  for (const system of map.systems) {
    if (system.factionId === factionId) system.factionId = "";
    for (const object of system.objects ?? []) if (object.factionId === factionId) object.factionId = "";
  }
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  return true;
}

async function hideFactionFromPlayers(mapId, factionId, hidden = true) {
  if (!requireGM(hidden ? "hide factions" : "reveal factions")) return null;
  const maps = getMapStore();
  const map = maps[mapId];
  const faction = map?.factions?.find((candidate) => candidate.id === factionId);
  if (!faction) {
    notifyError(`Faction "${factionId}" was not found.`);
    return null;
  }

  faction.visibility = hidden ? "gm" : "players";
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  notifyInfo(`${faction.name} ${hidden ? "hidden from" : "visible to"} players.`);
  return clone(faction);
}

async function saveSystemPosition(mapId, systemId, x, y) {
  if (!requireGM("move star systems")) return null;
  const maps = getMapStore();
  const map = maps[mapId];
  const system = map?.systems?.find((candidate) => candidate.id === systemId);
  if (!system) {
    notifyError(`System "${systemId}" was not found.`);
    return null;
  }

  system.x = clamp(normalizeNumber(x, system.x), 0, 100);
  system.y = clamp(normalizeNumber(y, system.y), 0, 100);
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  return clone(system);
}

async function revealSystemToPlayers(mapId, systemId, { notify = true } = {}) {
  if (!requireGM("reveal star systems")) return null;
  const maps = getMapStore();
  const map = maps[mapId];
  const system = map?.systems?.find((candidate) => candidate.id === systemId);
  if (!system) {
    notifyError(`System "${systemId}" was not found.`);
    return null;
  }

  system.visibility = "players";
  if (system.status === "undiscovered" || system.status === "locked") system.status = "known";
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  if (notify) notifySystemDiscovered(mapId, system.id);
  notifyInfo(`${system.name} revealed to players.`);
  return clone(system);
}

async function hideSystemFromPlayers(mapId, systemId, hidden = true) {
  if (!requireGM(hidden ? "hide star systems" : "reveal star systems")) return null;
  const maps = getMapStore();
  const map = maps[mapId];
  const system = map?.systems?.find((candidate) => candidate.id === systemId);
  if (!system) {
    notifyError(`System "${systemId}" was not found.`);
    return null;
  }

  system.visibility = hidden ? "gm" : "players";
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  notifyInfo(`${system.name} ${hidden ? "hidden from" : "visible to"} players.`);
  return clone(system);
}

async function revealRouteToPlayers(mapId, routeId, systemId = "") {
  if (!requireGM("reveal routes")) return null;
  const maps = getMapStore();
  const map = maps[mapId];
  const routeOwner = systemId ? map?.systems?.find((system) => system.id === systemId) : map;
  const route = routeOwner?.routes?.find((candidate) => candidate.id === routeId);
  if (!route) {
    notifyError(`Route "${routeId}" was not found.`);
    return null;
  }

  route.visibility = "players";
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  notifyInfo("Route revealed to players.");
  return clone(route);
}

async function hideRouteFromPlayers(mapId, routeId, hidden = true, systemId = "") {
  if (!requireGM(hidden ? "hide routes" : "reveal routes")) return null;
  const maps = getMapStore();
  const map = maps[mapId];
  const routeOwner = systemId ? map?.systems?.find((system) => system.id === systemId) : map;
  const route = routeOwner?.routes?.find((candidate) => candidate.id === routeId);
  if (!route) {
    notifyError(`Route "${routeId}" was not found.`);
    return null;
  }

  route.visibility = hidden ? "gm" : "players";
  maps[mapId] = normalizeMap(map);
  await saveMapStore(maps);
  refreshOpenApps(mapId);
  game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
  notifyInfo(`Route ${hidden ? "hidden from" : "visible to"} players.`);
  return clone(route);
}

function notifySystemDiscovered(mapId, systemId) {
  if (!requireGM("notify players about discoveries")) return;
  const map = getRawMap(mapId);
  const system = map?.systems?.find((candidate) => candidate.id === systemId);
  if (!system) {
    notifyError(`System "${systemId}" was not found.`);
    return;
  }
  game.socket.emit(SOCKET_NAME, {
    action: "notify",
    mapId,
    systemId,
    message: `New System Discovered: ${system.name}`
  });
  notifyInfo(`Discovery notification sent: ${system.name}.`);
}

async function importMapData(mapData, { replace = false } = {}) {
  if (!requireGM("import galaxy maps")) return null;
  const maps = getMapStore();
  let map = normalizeMap(mapData);
  if (maps[map.id] && !replace) {
    map = normalizeMap({
      ...map,
      id: randomId("map"),
      title: `${map.title} Import`
    });
  }
  maps[map.id] = map;
  await saveMapStore(maps);
  refreshOpenApps(map.id);
  notifyInfo(`Imported ${map.title}.`);
  return clone(map);
}

function exportMap(mapId) {
  const map = getRawMap(mapId);
  if (!map) {
    notifyError(`Map "${mapId}" was not found.`);
    return;
  }
  downloadJson(`${slugify(map.title)}.json`, normalizeMap(map));
}

function getTextureGuideMarkup(shape: string) {
  return `
    <div class="gmf-texture-guide" data-texture-guide data-shape="${escapeHtml(shape)}">
      <figure data-guide-shape="sphere">
        <div class="gmf-uv-map gmf-uv-map--sphere" aria-hidden="true">
          <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
          <b class="gmf-uv-guide-grid"></b>
          <span class="gmf-uv-pole gmf-uv-pole--north">North pole · 15%</span>
          <span class="gmf-uv-equator">Equator · 50%</span>
          <span class="gmf-uv-pole gmf-uv-pole--south">South pole · 15%</span>
          <i class="gmf-uv-seam">wrap seam</i>
        </div>
        <figcaption><strong>2048×1024 · 2:1</strong> Left and right join. Keep important details out of the pale polar bands, where the image pinches to a point.</figcaption>
      </figure>
      <figure data-guide-shape="asteroid">
        <div class="gmf-uv-map gmf-uv-map--asteroid" aria-hidden="true">
          <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
          <b class="gmf-uv-guide-grid"></b>
          <span class="gmf-uv-pole gmf-uv-pole--north">Distorted pole · 15%</span>
          <span class="gmf-uv-equator">Best detail near equator · 50%</span>
          <span class="gmf-uv-pole gmf-uv-pole--south">Distorted pole · 15%</span>
          <i class="gmf-uv-seam">wrap seam</i>
        </div>
        <figcaption><strong>2048×1024 · 2:1</strong> Uses the full 8×4 grid. There are no required circles or fixed crater positions. Left and right join; place recognizable features near the equator and expect organic distortion.</figcaption>
      </figure>
      <figure data-guide-shape="donut">
        <div class="gmf-uv-map gmf-uv-map--donut" aria-hidden="true">
          <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
          <b class="gmf-uv-guide-grid"></b>
          <span class="gmf-uv-donut-ring">Around ring →</span>
          <span class="gmf-uv-donut-tube">Around tube ↓</span>
          <span class="gmf-uv-donut-landmark is-outer-top">Outer bend · 0%</span>
          <span class="gmf-uv-donut-landmark is-side-a">Side A · 25%</span>
          <span class="gmf-uv-donut-landmark is-inner">Inner bend · 50%</span>
          <span class="gmf-uv-donut-landmark is-side-b">Side B · 75%</span>
          <span class="gmf-uv-donut-landmark is-outer-bottom">Outer bend · 100%</span>
        </div>
        <figcaption><strong>2048×1024 · 2:1</strong> Top and bottom meet on the outer bend. The center line becomes the inner bend; 25% and 75% become the two sides. Left/right join as the texture travels around the ring, so all four edges must be seamless.</figcaption>
      </figure>
      <figure data-guide-shape="cube">
        <div class="gmf-uv-map gmf-uv-map--cube" aria-hidden="true">
          <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
          <b class="gmf-uv-guide-grid"></b>
          <span class="is-top">Top</span><span class="is-left">Left</span><span class="is-front">Front</span>
          <span class="is-right">Right</span><span class="is-back">Back</span><span class="is-bottom">Bottom</span>
        </div>
        <figcaption><strong>2048×1536 · 4:3</strong> The full 4×3 grid contains twelve 512px squares. Draw only in the six labeled squares; the six dim squares are unused.</figcaption>
      </figure>
      <figure data-guide-shape="cylinder">
        <div class="gmf-uv-map gmf-uv-map--cylinder" aria-hidden="true">
          <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
          <b class="gmf-uv-guide-grid"></b>
          <span class="gmf-uv-cap gmf-uv-cap--top">Top<br>25% × 25%</span>
          <span class="gmf-uv-cylinder-side">Side band · 100% × 50%<br>left/right join</span>
          <span class="gmf-uv-cap gmf-uv-cap--bottom">Bottom<br>25% × 25%</span>
          <i class="gmf-uv-row-label is-top">25%</i><i class="gmf-uv-row-label is-middle">50%</i><i class="gmf-uv-row-label is-bottom">25%</i>
        </div>
        <figcaption><strong>2048×2048 · 1:1</strong> The middle 50% is the side. Each cap is a 512px circle.</figcaption>
      </figure>
      <figure data-guide-shape="crystal">
        <div class="gmf-uv-map gmf-uv-map--crystal" aria-hidden="true">
          <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
          <b class="gmf-uv-guide-grid"></b>
          ${Array.from({ length: 4 }, (_, index) => `<span class="is-face-${index + 1}">Side ${index + 1}<br>upper</span>`).join("")}
          ${Array.from({ length: 4 }, (_, index) => `<span class="is-face-${index + 5}">Side ${index + 1}<br>lower</span>`).join("")}
          <i class="gmf-uv-grid-label is-columns">4 columns · 512px each</i>
        </div>
        <figcaption><strong>2048×1024 · 2:1</strong> Divide the image into four 512×512 columns. Each column is one continuous crystal side: its upper triangle sits directly above its matching lower triangle.</figcaption>
      </figure>
    </div>
  `;
}

function prepareMapForManager(map) {
  if (!map) return null;
  const normalized = normalizeMap(map);
  const systemsById = new Map<string, any>(normalized.systems.map((system) => [system.id, system]));
  const factionsById = new Map<string, any>(normalized.factions.map((faction) => [faction.id, faction]));
  return {
    ...normalized,
    travelApprovalModeLabel: TRAVEL_APPROVAL_OPTIONS.find(option => option.value === normalized.travelApprovalMode)?.label ?? "Unanimous agreement",
    systems: normalized.systems.map((system) => ({
      ...system,
      factionName: factionsById.get(system.factionId)?.name ?? "Unaffiliated"
    })),
    routes: [
      ...normalized.routes.map((route) => ({
        ...route,
        systemId: "",
        scopeLabel: "Galaxy route",
        fromName: systemsById.get(route.fromSystemId)?.name ?? route.fromSystemId,
        toName: systemsById.get(route.toSystemId)?.name ?? route.toSystemId
      })),
      ...normalized.systems.flatMap((system) => {
        const objectsById = new Map<string, any>(system.objects.map((object) => [object.id, object]));
        return system.routes.map((route) => ({
          ...route,
          systemId: system.id,
          scopeLabel: `Inside ${system.name}`,
          fromName: objectsById.get(route.fromSystemId)?.name ?? route.fromSystemId,
          toName: objectsById.get(route.toSystemId)?.name ?? route.toSystemId
        }));
      })
    ]
  };
}

function getMaps() {
  return Object.values(getMapStore()).map(normalizeMap);
}

function getSystem(mapId, systemId) {
  return clone(normalizeMap(getRawMap(mapId)).systems.find((system) => system.id === String(systemId)) ?? null);
}

function getObject(mapId, objectId) {
  const map = normalizeMap(getRawMap(mapId));
  for (const system of map.systems) {
    const object = system.objects.find((candidate) => candidate.id === String(objectId));
    if (object) return { systemId: system.id, object: clone(object) };
  }
  return null;
}

function getSceneIdsForSystem(mapId, systemId) {
  const rawMap = getRawMap(mapId);
  if (!rawMap) return [];
  const system = normalizeMap(rawMap).systems.find((candidate) => candidate.id === String(systemId));
  return system ? [...new Set(system.objects.flatMap((object) => object.sceneIds))] : [];
}

function getSceneIdsForObject(mapId, objectId) {
  const map = normalizeMap(getRawMap(mapId));
  const object = map.systems.flatMap((system) => system.objects).find((candidate) => candidate.id === String(objectId));
  return object ? [...object.sceneIds] : [];
}

function getObjectsForScene(sceneId) {
  const targetSceneId = String(sceneId || "");
  if (!targetSceneId) return [];
  return getMaps().flatMap((map: any) => map.systems.flatMap((system: any) => system.objects
    .filter((object: any) => object.sceneIds.includes(targetSceneId))
    .map((object: any) => ({ mapId: map.id, mapTitle: map.title, systemId: system.id, systemName: system.name, object: clone(object) }))));
}

function getSystemsForScene(sceneId) {
  const targetSceneId = String(sceneId || "");
  if (!targetSceneId) return [];
  return getMaps().flatMap((map: any) => map.systems
    .filter((system: any) => system.objects.some((object: any) => object.sceneIds.includes(targetSceneId)))
    .map((system: any) => ({ mapId: map.id, mapTitle: map.title, system: clone(system) })));
}

function getAppFrame(app) {
  const element = getAppHtml(app);
  return element?.closest?.(".window-app, .application, .app") ?? element;
}

function snapshotWindowStack(apps) {
  return apps.map((app) => {
    const frame = getAppFrame(app);
    if (!frame) return null;
    const computedZIndex = Number.parseInt(globalThis.getComputedStyle?.(frame)?.zIndex ?? "", 10);
    return { app, zIndex: frame.style.zIndex || (Number.isFinite(computedZIndex) ? String(computedZIndex) : "") };
  }).filter(Boolean);
}

function restoreWindowStack(stack) {
  for (const entry of stack) {
    const frame = getAppFrame(entry.app);
    if (!frame?.isConnected || !entry.zIndex) continue;
    frame.style.zIndex = entry.zIndex;
  }
}

async function refreshOpenApps(mapId = null) {
  const mapApps = [...openMaps.entries()]
    .filter(([id, app]) => app?.rendered && (!mapId || id === mapId))
    .map(([, app]) => app);
  if (playerMapApp?.rendered && (!mapId || playerMapApp.mapId === mapId)) mapApps.push(playerMapApp);

  const apps = [managerApp?.rendered ? managerApp : null, ...mapApps].filter(Boolean);
  const windowStack = snapshotWindowStack(apps);
  const renders = apps.map((app) => Promise.resolve(app.render({ force: true })));

  // Rendering a background Application can make Foundry assign it the newest
  // z-index. Restore the existing stack so data refreshes never surface the
  // Map Manager over the viewport that initiated the update.
  restoreWindowStack(windowStack);
  await Promise.allSettled(renders);
  restoreWindowStack(windowStack);
  globalThis.requestAnimationFrame?.(() => restoreWindowStack(windowStack));
}

function getOpenMapViews(mapId) {
  const views = [...openMaps.values()];
  if (playerMapApp) views.push(playerMapApp);
  return views.filter((app) => app?.rendered && app.mapId === mapId);
}

function getAppHtml(app) {
  return app.element ?? null;
}

function getTravelRoute(map, fromSystemId, toSystemId) {
  return map.routes.find((route) => (
    (route.fromSystemId === fromSystemId && route.toSystemId === toSystemId)
    || (route.toSystemId === fromSystemId && route.fromSystemId === toSystemId)
  )) ?? null;
}

function buildTravelRequest(mapId, destinationSystemId) {
  const rawMap = getRawMap(mapId);
  if (!rawMap) {
    notifyError(`Map "${mapId}" was not found.`);
    return null;
  }
  const map = normalizeMap(rawMap);

  const from = map.systems.find((system) => system.id === map.currentSystemId);
  const to = map.systems.find((system) => system.id === destinationSystemId);
  if (!to) {
    notifyError(`System "${destinationSystemId}" was not found.`);
    return null;
  }
  if (!from) {
    notifyError("This map does not have a current location yet. Ask the GM to set one first.");
    return null;
  }
  if (from.id === to.id) {
    notifyInfo(`${to.name} is already the current location.`);
    return null;
  }

  if (map.visibility !== "players" || from.visibility !== "players" || to.visibility !== "players") {
    notifyError("That travel destination is not visible to players.");
    return null;
  }

  const route = getTravelRoute(map, from.id, to.id);
  if (!route || route.visibility !== "players") {
    notifyError(`No player-visible direct route from ${from.name} to ${to.name}.`);
    return null;
  }

  const primaryGM = getPrimaryGM();
  if (!primaryGM) {
    notifyError("A GM must be online to approve player travel.");
    return null;
  }

  const electorate = getTravelElectorate(getActiveUsers(), game.user.id, primaryGM, map.travelApprovalMode);

  return {
    action: "travel-request",
    requestId: randomId("travel"),
    mapId,
    mapTitle: map.title,
    fromSystemId: from.id,
    fromName: from.name,
    toSystemId: to.id,
    toName: to.name,
    routeId: route.id,
    routeType: route.type,
    travelTime: route.travelTime,
    fuelCost: route.fuelCost,
    requesterId: game.user.id,
    requesterName: game.user.name,
    approvalMode: electorate.approvalMode,
    voterIds: electorate.voterIds,
    voterNames: electorate.voterNames,
    requiredApprovals: electorate.requiredApprovals,
    participantCount: electorate.participantCount
  };
}

function requestTravelToSystem(mapId, destinationSystemId) {
  const request = buildTravelRequest(mapId, destinationSystemId);
  if (!request) return null;
  game.socket.emit(SOCKET_NAME, request);
  notifyInfo(`Travel request sent: ${request.fromName} to ${request.toName}.`);
  return request;
}

function buildObjectTravelRequest(mapId, systemId, destinationObjectId) {
  const rawMap = getRawMap(mapId);
  if (!rawMap) {
    notifyError(`Map "${mapId}" was not found.`);
    return null;
  }
  const map = normalizeMap(rawMap);
  const system = map.systems.find(candidate => candidate.id === systemId);
  const from = system?.objects.find(object => object.id === map.currentLocation.objectId);
  const to = system?.objects.find(object => object.id === destinationObjectId);
  if (!system || map.currentLocation.systemId !== system.id || !from) {
    notifyError("The current location is not inside this system.");
    return null;
  }
  if (!to) {
    notifyError(`Destination "${destinationObjectId}" was not found.`);
    return null;
  }
  if (from.id === to.id) {
    notifyInfo(`${to.name} is already the current location.`);
    return null;
  }
  if (map.visibility !== "players" || system.visibility !== "players"
    || getEffectiveObjectVisibility(system, from) !== "players"
    || getEffectiveObjectVisibility(system, to) !== "players") {
    notifyError("That travel destination is not visible to players.");
    return null;
  }
  const route = getTravelRoute({ routes: system.routes }, from.id, to.id);
  if (!route || route.visibility !== "players") {
    notifyError(`No player-visible direct route from ${from.name} to ${to.name}.`);
    return null;
  }
  const primaryGM = getPrimaryGM();
  if (!primaryGM) {
    notifyError("A GM must be online to approve player travel.");
    return null;
  }
  const electorate = getTravelElectorate(getActiveUsers(), game.user.id, primaryGM, map.travelApprovalMode);
  return {
    action: "travel-request",
    travelScope: "object",
    requestId: randomId("travel"), mapId, mapTitle: map.title, systemId: system.id,
    fromObjectId: from.id, fromName: from.name, toObjectId: to.id, toName: to.name,
    routeId: route.id, routeType: route.type, travelTime: route.travelTime, fuelCost: route.fuelCost,
    requesterId: game.user.id, requesterName: game.user.name,
    approvalMode: electorate.approvalMode, voterIds: electorate.voterIds,
    voterNames: electorate.voterNames, requiredApprovals: electorate.requiredApprovals,
    participantCount: electorate.participantCount
  };
}

function requestTravelToObject(mapId, systemId, destinationObjectId) {
  const request = buildObjectTravelRequest(mapId, systemId, destinationObjectId);
  if (!request) return null;
  game.socket.emit(SOCKET_NAME, request);
  notifyInfo(`Travel request sent: ${request.fromName} to ${request.toName}.`);
  return request;
}

function promptForTravelRequest(payload) {
  if (!payload?.requestId || payload.requesterId === game.user?.id) return;
  if (!payload.voterIds?.includes(game.user?.id)) return;
  if (promptedTravelRequests.has(payload.requestId)) return;
  promptedTravelRequests.add(payload.requestId);

  let responded = false;
  let resolved = false;
  let dialog: any = null;
  const respond = (accepted) => {
    if (responded) return;
    responded = true;
    const vote = {
      action: "travel-vote",
      requestId: payload.requestId,
      mapId: payload.mapId,
      userId: game.user.id,
      userName: game.user.name,
      accepted
    };
    game.socket.emit(SOCKET_NAME, vote);
    handleTravelVote(vote);
  };

  const modeLabel = TRAVEL_APPROVAL_OPTIONS.find(option => option.value === payload.approvalMode)?.label ?? "Unanimous agreement";
  dialog = new Dialog({
    title: "Travel Request",
    content: `
      <section class="gmf-travel-request">
        <p><strong>${escapeHtml(payload.requesterName)}</strong> wants to travel on <strong>${escapeHtml(payload.mapTitle)}</strong>.</p>
        <p>${escapeHtml(payload.fromName)} &rarr; ${escapeHtml(payload.toName)}</p>
        <p class="gmf-travel-request__meta">${escapeHtml(payload.routeType)} route / ${escapeHtml(payload.travelTime || "Unknown time")} / Fuel ${escapeHtml(payload.fuelCost ?? 0)}</p>
        <p class="gmf-travel-request__mode"><i class="fa-solid fa-users"></i> ${escapeHtml(modeLabel)}</p>
        <div class="gmf-travel-progress" data-travel-progress aria-live="polite">
          <div class="gmf-travel-progress__bar"><span data-travel-progress-bar></span></div>
          <strong data-travel-progress-count>Waiting for vote status…</strong>
          <span data-travel-progress-pending></span>
        </div>
      </section>
    `,
    render: (html) => {
      const root = getHtmlElement(html);
      const state = travelRequestPrompts.get(payload.requestId);
      if (state) state.root = root;
      updateTravelPrompt(payload.requestId, latestTravelProgress.get(payload.requestId));
    },
    buttons: {
      accept: {
        icon: '<i class="fa-solid fa-check"></i>',
        label: "Accept",
        callback: () => respond(true)
      },
      decline: {
        icon: '<i class="fa-solid fa-xmark"></i>',
        label: "Decline",
        callback: () => respond(false)
      }
    },
    default: "accept",
    close: () => {
      travelRequestPrompts.delete(payload.requestId);
      if (!resolved) respond(false);
    }
  }, {
    classes: ["galaxy-map", "gmf-crud-dialog"],
    width: 420,
    height: Math.max(320, Math.min(440, window.innerHeight - 80))
  });
  travelRequestPrompts.set(payload.requestId, {
    root: null,
    resolve: () => {
      resolved = true;
      responded = true;
      dialog?.close();
    }
  });
  dialog.render(true);
}

function isPrimaryGMMessage(payload) {
  return Boolean(payload?.coordinatorId && payload.coordinatorId === getPrimaryGM()?.id);
}

function getTravelProgressPayload(pending) {
  const evaluation = evaluateTravelApproval(pending);
  return {
    action: "travel-progress",
    requestId: pending.requestId,
    mapId: pending.mapId,
    requesterId: pending.requesterId,
    approvalMode: pending.approvalMode,
    acceptedCount: evaluation.acceptedCount,
    declinedCount: evaluation.declinedCount,
    requiredApprovals: evaluation.required,
    participantCount: pending.participantCount,
    pendingNames: evaluation.pendingIds.map(id => pending.voterNames?.[id] || "Navigator"),
    coordinatorId: game.user.id
  };
}

function updateTravelPrompt(requestId, progress) {
  if (!progress) return;
  latestTravelProgress.set(requestId, progress);
  const root = travelRequestPrompts.get(requestId)?.root;
  if (!root) return;
  const count = root.querySelector("[data-travel-progress-count]");
  const pending = root.querySelector("[data-travel-progress-pending]");
  const bar = root.querySelector("[data-travel-progress-bar]");
  if (count) count.textContent = `${progress.acceptedCount} of ${progress.requiredApprovals} approvals`;
  if (pending) pending.textContent = progress.pendingNames?.length ? `Waiting for: ${progress.pendingNames.join(", ")}` : "All votes received";
  if (bar) bar.style.width = `${Math.min(100, (progress.acceptedCount / Math.max(1, progress.requiredApprovals)) * 100)}%`;
}

function broadcastTravelProgress(pending) {
  const progress = getTravelProgressPayload(pending);
  latestTravelProgress.set(pending.requestId, progress);
  updateTravelPrompt(pending.requestId, progress);
  game.socket.emit(SOCKET_NAME, progress);
  return progress;
}

function handleTravelProgress(payload) {
  if (!payload?.requestId || !isPrimaryGMMessage(payload)) return;
  const previous = latestTravelProgress.get(payload.requestId);
  updateTravelPrompt(payload.requestId, payload);
  if (payload.requesterId === game.user?.id && (!previous || previous.acceptedCount !== payload.acceptedCount || previous.declinedCount !== payload.declinedCount)) {
    const waiting = payload.pendingNames?.length ? ` Waiting for ${payload.pendingNames.join(", ")}.` : "";
    ui.notifications?.info(`Travel vote: ${payload.acceptedCount}/${payload.requiredApprovals} approvals.${waiting}`);
  }
}

function trackTravelRequest(payload) {
  if (!isPrimaryGM() || !payload?.requestId || pendingTravelRequests.has(payload.requestId)) return null;
  const rawMap = getRawMap(payload.mapId);
  if (!rawMap) return null;
  const currentMap = normalizeMap(rawMap);
  const requester = getActiveUsers().find(user => user.id === payload.requesterId && !user.isGM);
  const objectTravel = payload.travelScope === "object";
  const travelSystem = objectTravel ? currentMap.systems.find(system => system.id === payload.systemId) : null;
  const from = objectTravel
    ? travelSystem?.objects.find(object => object.id === currentMap.currentLocation.objectId)
    : currentMap.systems.find(system => system.id === currentMap.currentSystemId);
  const to = objectTravel
    ? travelSystem?.objects.find(object => object.id === payload.toObjectId)
    : currentMap.systems.find(system => system.id === payload.toSystemId);
  const route = from && to ? getTravelRoute(objectTravel ? { routes: travelSystem?.routes ?? [] } : currentMap, from.id, to.id) : null;
  const invalidObjectTravel = objectTravel && (!travelSystem
    || currentMap.currentLocation.systemId !== travelSystem.id
    || travelSystem.visibility !== "players"
    || getEffectiveObjectVisibility(travelSystem, from) !== "players"
    || getEffectiveObjectVisibility(travelSystem, to) !== "players");
  const invalidSystemTravel = !objectTravel && (from?.visibility !== "players" || to?.visibility !== "players");
  if (!requester || currentMap.visibility !== "players" || !from || !to || from.id === to.id
    || invalidObjectTravel || invalidSystemTravel || !route || route.visibility !== "players") return null;
  const mode = currentMap.travelApprovalMode;
  const primaryGM = getPrimaryGM();
  const electorate = getTravelElectorate(getActiveUsers(), payload.requesterId, primaryGM, mode);
  const timeoutId = globalThis.setTimeout(() => {
    const pending = pendingTravelRequests.get(payload.requestId);
    if (pending) rejectTravelRequest(pending, { reason: "Travel request timed out." });
  }, TRAVEL_REQUEST_TIMEOUT_MS);
  const pending = {
    action: "travel-ballot",
    requestId: String(payload.requestId).slice(0, 80),
    mapId: currentMap.id,
    mapTitle: currentMap.title,
    travelScope: objectTravel ? "object" : "system",
    systemId: objectTravel ? travelSystem.id : "",
    fromSystemId: objectTravel ? travelSystem.id : from.id,
    fromObjectId: objectTravel ? from.id : "",
    fromName: from.name,
    toSystemId: objectTravel ? travelSystem.id : to.id,
    toObjectId: objectTravel ? to.id : "",
    toName: to.name,
    routeId: route.id,
    routeType: route.type,
    travelTime: route.travelTime,
    fuelCost: route.fuelCost,
    requesterId: requester.id,
    requesterName: requester.name,
    coordinatorId: game.user.id,
    ...electorate,
    accepted: new Set(),
    declined: new Set(),
    timeoutId
  };
  pendingTravelRequests.set(payload.requestId, pending);
  broadcastTravelProgress(pending);
  return pending;
}

function animateTravelOnOpenMaps(payload) {
  const map = normalizeMap(getRawMap(payload.mapId));
  const objectTravel = payload.travelScope === "object";
  const travelSystem = objectTravel ? map.systems.find((system) => system.id === payload.systemId) : null;
  const from = objectTravel
    ? travelSystem?.objects.find((object) => object.id === payload.fromObjectId)
    : map.systems.find((system) => system.id === payload.fromSystemId);
  const to = objectTravel
    ? travelSystem?.objects.find((object) => object.id === payload.toObjectId)
    : map.systems.find((system) => system.id === payload.toSystemId);
  if (!from || !to) return;
  getOpenMapViews(payload.mapId).forEach((app) => {
    const html = getAppHtml(app);
    if (!html) return;
    if (objectTravel) {
      if (app.activeSystemId !== travelSystem.id) return;
      app.selectedObjectId = to.id;
    } else app.selectedSystemId = to.id;
    app.selectedRouteId = null;
    app._animateShipTravel?.(from, to, html);
  });
}

function broadcastTravelAnimation(mapId, fromSystemId, toSystemId) {
  game.socket.emit(SOCKET_NAME, {
    action: "travel-animation",
    mapId,
    fromSystemId,
    toSystemId,
    coordinatorId: game.user?.id
  });
}

function broadcastObjectTravelAnimation(mapId, systemId, fromObjectId, toObjectId) {
  game.socket.emit(SOCKET_NAME, {
    action: "travel-animation",
    travelScope: "object",
    mapId, systemId, fromObjectId, toObjectId,
    coordinatorId: game.user?.id
  });
}

async function approveTravelRequest(pending) {
  pendingTravelRequests.delete(pending.requestId);
  if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
  promptedTravelRequests.delete(pending.requestId);
  travelRequestPrompts.get(pending.requestId)?.resolve();
  travelRequestPrompts.delete(pending.requestId);
  latestTravelProgress.delete(pending.requestId);
  const payload = {
    action: "travel-approved",
    requestId: pending.requestId,
    mapId: pending.mapId,
    travelScope: pending.travelScope,
    systemId: pending.systemId,
    fromSystemId: pending.fromSystemId,
    toSystemId: pending.toSystemId,
    fromObjectId: pending.fromObjectId,
    toObjectId: pending.toObjectId,
    fromName: pending.fromName,
    toName: pending.toName,
    coordinatorId: game.user.id
  };
  game.socket.emit(SOCKET_NAME, payload);
  animateTravelOnOpenMaps(payload);
  notifyInfo(`Travel approved: ${pending.fromName} to ${pending.toName}.`);
  globalThis.setTimeout(() => {
    if (pending.travelScope === "object") setCurrentObject(pending.mapId, pending.systemId, pending.toObjectId);
    else setCurrentSystem(pending.mapId, pending.toSystemId);
  }, TRAVEL_ANIMATION_MS);
}

function rejectTravelRequest(pending, { voterName = "", reason = "" } = {}) {
  pendingTravelRequests.delete(pending.requestId);
  if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
  promptedTravelRequests.delete(pending.requestId);
  travelRequestPrompts.get(pending.requestId)?.resolve();
  travelRequestPrompts.delete(pending.requestId);
  latestTravelProgress.delete(pending.requestId);
  const message = reason || `${voterName || "A participant"} declined the request.`;
  const payload = {
    action: "travel-declined",
    requestId: pending.requestId,
    mapId: pending.mapId,
    fromName: pending.fromName,
    toName: pending.toName,
    voterName,
    reason: message,
    coordinatorId: game.user.id
  };
  game.socket.emit(SOCKET_NAME, payload);
  notifyInfo(`Travel cancelled: ${message}`);
}

function handleTravelVote(payload) {
  if (!isPrimaryGM() || !payload?.requestId) return;
  const pending = pendingTravelRequests.get(payload.requestId);
  if (!pending || !pending.voterIds.includes(payload.userId)) return;
  if (pending.accepted.has(payload.userId) || pending.declined.has(payload.userId)) return;
  if (payload.accepted) pending.accepted.add(payload.userId);
  else pending.declined.add(payload.userId);
  const evaluation = evaluateTravelApproval(pending);
  broadcastTravelProgress(pending);
  if (evaluation.outcome === "approved") approveTravelRequest(pending);
  else if (evaluation.outcome === "declined") rejectTravelRequest(pending, {
    voterName: payload.userName,
    reason: pending.approvalMode === "unanimous"
      ? `${payload.userName || "A participant"} declined the unanimous request.`
      : "The remaining votes cannot reach a majority."
  });
}

function handleTravelApproved(payload) {
  if (!isPrimaryGMMessage(payload)) return;
  if (payload.coordinatorId === game.user?.id) return;
  if (payload.requestId) promptedTravelRequests.delete(payload.requestId);
  travelRequestPrompts.get(payload.requestId)?.resolve();
  travelRequestPrompts.delete(payload.requestId);
  latestTravelProgress.delete(payload.requestId);
  animateTravelOnOpenMaps(payload);
  ui.notifications?.info(`Travel approved: ${payload.fromName} to ${payload.toName}.`);
}

function handleTravelDeclined(payload) {
  if (!isPrimaryGMMessage(payload)) return;
  if (payload.coordinatorId === game.user?.id) return;
  if (payload.requestId) promptedTravelRequests.delete(payload.requestId);
  travelRequestPrompts.get(payload.requestId)?.resolve();
  travelRequestPrompts.delete(payload.requestId);
  latestTravelProgress.delete(payload.requestId);
  ui.notifications?.warn(`Travel cancelled: ${payload.reason || `${payload.voterName || "A participant"} declined.`}`);
}

function closeOpenMap(mapId) {
  const app = openMaps.get(mapId);
  if (app) app.close();
  if (playerMapApp?.mapId === mapId) playerMapApp.close();
}

function openMap(mapId, options: any = {}) {
  const map = getRawMap(mapId);
  if (!map) {
    notifyError(`Map "${mapId}" was not found.`);
    return null;
  }

  const playerMode = options.playerMode ?? !game.user?.isGM;
  if (playerMode && map.visibility !== "players" && !options.broadcast) {
    notifyError("That galaxy map is not visible to players.");
    return null;
  }

  const key = playerMode ? `player:${mapId}` : mapId;
  const existing = playerMode && playerMapApp?.mapId === mapId ? playerMapApp : openMaps.get(key);
  if (existing?.rendered) {
    existing.bringToFront();
    return existing;
  }

  const app = new GalaxyMapView({ mapId, playerMode });
  if (playerMode) playerMapApp = app;
  else openMaps.set(key, app);
  app.render({ force: true });
  return app;
}

async function focusSystem(mapId, systemId, options: any = {}) {
  if (!mapId || !systemId) return false;
  const app = openMap(mapId, {
    playerMode: options.playerMode ?? !game.user?.isGM,
    broadcast: options.broadcast === true
  });
  if (!app?.focusSystem) return false;
  return app.focusSystem(systemId, options);
}

async function focusLocation(mapId, location: any = {}, options: any = {}) {
  const systemId = String(location.systemId || "");
  const objectId = String(location.objectId || "");
  if (!mapId || !systemId) return false;
  const app = openMap(mapId, { playerMode: options.playerMode ?? !game.user?.isGM, broadcast: options.broadcast === true });
  if (!app) return false;
  return objectId && app.focusLocation ? app.focusLocation(systemId, objectId, options) : app.focusSystem?.(systemId, options);
}

function clearSystemFocus(mapId, focusId = "") {
  let cleared = false;
  for (const app of getOpenMapViews(mapId)) {
    cleared = app.clearSystemFocus?.(focusId) || cleared;
  }
  return cleared;
}

function openMapManager() {
  if (!requireGM("open the map manager")) return null;
  if (!managerApp) managerApp = new GalaxyMapManager();
  managerApp.render({ force: true });
  return managerApp;
}

function openPlayerMapChooser() {
  const visibleMaps = getVisiblePlayerMaps();

  if (!visibleMaps.length) {
    notifyInfo("No galaxy map is currently visible to players.");
    return null;
  }

  if (visibleMaps.length === 1) return openMap(visibleMaps[0].id, { playerMode: true });

  if (!playerMapChooserApp) playerMapChooserApp = new PlayerMapChooser();
  playerMapChooserApp.render({ force: true });
  return playerMapChooserApp;
}

function getVisiblePlayerMaps() {
  return getMaps().filter((map) => map.visibility === "players").sort((a, b) => a.title.localeCompare(b.title));
}

function openGalaxyMapFromSceneControls() {
  const maps = getMaps().sort((a, b) => a.title.localeCompare(b.title));
  if (game.user?.isGM) {
    if (maps.length === 1) return openMap(maps[0].id);
    return openMapManager();
  }

  return openPlayerMapChooser();
}

function showMapToPlayers(mapId) {
  if (!requireGM("broadcast galaxy maps")) return;
  if (!getRawMap(mapId)) {
    notifyError(`Map "${mapId}" was not found.`);
    return;
  }
  game.socket.emit(SOCKET_NAME, { action: "open", mapId });
  notifyInfo("Map broadcast sent to players.");
}

const GalaxyMapManager = createGalaxyMapManagerClass({
  templateRoot: TEMPLATE_ROOT,
  getMaps,
  prepareMapForManager,
  getRawMap,
  exportMap,
  duplicateMap,
  deleteMap,
  createMap,
  deleteSystem,
  deleteObject,
  deleteRoute,
  deleteFaction,
  openMap,
  showMapToPlayers,
  hideSystemFromPlayers,
  setObjectVisibility,
  hideRouteFromPlayers,
  hideFactionFromPlayers,
  clearManagerApp: (app) => {
    if (managerApp === app) managerApp = null;
  }
});

const PlayerMapChooser = createPlayerMapChooserClass({
  templateRoot: TEMPLATE_ROOT,
  getVisibleMaps: getVisiblePlayerMaps,
  openMap,
  clearChooser: (app) => {
    if (playerMapChooserApp === app) playerMapChooserApp = null;
  }
});

const GalaxyMapView = createGalaxyMapViewClass({
  templateRoot: TEMPLATE_ROOT,
  getRawMap,
  prepareMapForDisplay,
  upsertSystem,
  upsertObject,
  upsertRoute,
  upsertFaction,
  updateMapMetadata,
  deleteFaction,
  getTextureGuideMarkup,
  activateObjectEditorControls: activateAppearancePanelControls,
  revealSystemToPlayers,
  revealRouteToPlayers,
  hideSystemFromPlayers,
  setObjectVisibility,
  hideRouteFromPlayers,
  deleteSystem,
  deleteObject,
  deleteRoute,
  setCurrentSystem,
  setCurrentObject,
  requestTravelToSystem,
  requestTravelToObject,
  exportMap,
  getTravelRoute,
  broadcastTravelAnimation,
  broadcastObjectTravelAnimation,
  notifyInfo,
  notifyError,
  saveSystemPosition,
  saveObjectPosition,
  savePlanetLocation,
  removePlanetLocation,
  unlinkPlanetScene,
  clearMapView: (app) => {
    if (app.playerMode && playerMapApp === app) playerMapApp = null;
    for (const [key, openApp] of openMaps.entries()) {
      if (openApp === app) openMaps.delete(key);
    }
  }
});

function registerWithHoloSuite() {
  const holosuite = game.modules.get("holosuite-core");
  const api = holosuite?.active ? holosuite.api : null;
  if (!api?.registerApp) return false;

  api.registerApp({
    id: MODULE_ID,
    title: "Galaxy Map",
    icon: "fa-solid fa-route",
    premium: false,
    description: "Open cinematic campaign maps and navigation charts.",
    open: () => game.user?.isGM ? openMapManager() : openPlayerMapChooser()
  });
  return true;
}

Hooks.once("init", async () => {
  game.settings.register(MODULE_ID, SETTING_MAPS, {
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });
  game.settings.register(MODULE_ID, SETTING_SCHEMA_V1_BACKUP, {
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });
  game.settings.register(MODULE_ID, SETTING_SURFACE_LOCATION_RECOVERY, {
    scope: "world",
    config: false,
    type: Boolean,
    default: false
  });

  Handlebars.registerHelper("gmfEq", (left, right) => left === right);
  Handlebars.registerHelper("gmfJson", (value) => JSON.stringify(value, null, 2));
  Handlebars.registerHelper("gmfPercent", (value) => `${Number(value).toFixed(3)}%`);
  Handlebars.registerHelper("gmfFallback", (value, fallback) => value || fallback);

  Hooks.on("renderDialog", (app, html) => {
    const root = getHtmlElement(html);
    const frame = root?.closest?.(".window-app, .application, .app") ?? root;
    if (frame?.classList?.contains("galaxy-map")) activateGalaxyDialogChrome(app, html);
  });

  await loadTemplates([
    `${TEMPLATE_ROOT}/map-manager.hbs`,
    `${TEMPLATE_ROOT}/galaxy-map.hbs`,
    `${TEMPLATE_ROOT}/celestial-icon.hbs`,
    `${TEMPLATE_ROOT}/object-appearance-panel.hbs`,
    `${TEMPLATE_ROOT}/system-details.hbs`,
    `${TEMPLATE_ROOT}/player-map-chooser.hbs`
  ]);
});

Hooks.once("ready", async () => {
  game.galaxyMap = {
    openMap,
    focusSystem,
    focusLocation,
    clearSystemFocus,
    openMapManager,
    openGalaxyMapFromSceneControls,
    openPlayerMapChooser,
    createMap,
    getMaps,
    getSystem,
    getObject,
    getSceneIdsForSystem,
    getSystemsForScene,
    getSceneIdsForObject,
    getObjectsForScene,
    showMapToPlayers,
    updateMap,
    updateMapMetadata,
    deleteMap,
    duplicateMap,
    upsertSystem,
    deleteSystem,
    upsertObject,
    deleteObject,
    moveObject,
    setPrimaryObject,
    upsertRoute,
    deleteRoute,
    upsertFaction,
    deleteFaction,
    saveSystemPosition,
    saveObjectPosition,
    savePlanetLocation,
    removePlanetLocation,
    unlinkPlanetScene,
    setCurrentSystem,
    setCurrentObject,
    revealSystemToPlayers,
    revealRouteToPlayers,
    hideSystemFromPlayers,
    setObjectVisibility,
    hideRouteFromPlayers,
    hideFactionFromPlayers,
    requestTravelToSystem,
    requestTravelToObject,
    importMapData,
    exportMap
  };
  const module = game.modules.get(MODULE_ID);
  if (module) module.api = game.galaxyMap;
  registerWithHoloSuite();

  if (isPrimaryGM()) {
    const stored = getMapStore();
    const needsMigration = Object.values(stored).some((map: any) => Number(map?.schemaVersion || 1) < GALAXY_SCHEMA_VERSION);
    if (needsMigration) {
      const existingBackup = clone(game.settings.get(MODULE_ID, SETTING_SCHEMA_V1_BACKUP) ?? {});
      if (!Object.keys(existingBackup).length) await game.settings.set(MODULE_ID, SETTING_SCHEMA_V1_BACKUP, stored);
      const migrated = Object.fromEntries(Object.entries(stored).map(([id, map]) => [id, normalizeMap(map)]));
      await saveMapStore(migrated);
      notifyInfo("Your galaxy maps were updated to the new format. Everything from the old single map is now inside a system called \"System 1\", and a backup of the old data was kept.");
    }
    if (!game.settings.get(MODULE_ID, SETTING_SURFACE_LOCATION_RECOVERY)) {
      const backup = clone(game.settings.get(MODULE_ID, SETTING_SCHEMA_V1_BACKUP) ?? {});
      const recoveredStore = getMapStore();
      let recovered = 0;
      for (const [mapId, legacyMap] of Object.entries(backup) as [string, any][]) {
        if (!recoveredStore[mapId]) continue;
        const currentMap = normalizeMap(recoveredStore[mapId]);
        for (const legacySystem of legacyMap?.systems ?? []) {
          const locations = normalizePlanetLocations(legacySystem?.planetLocations);
          if (!locations.length) continue;
          const object = currentMap.systems.flatMap(system => system.objects)
            .find(candidate => candidate.id === legacySystem.id || candidate.id === `${legacySystem.id}-object`);
          if (!object || object.planetLocations.length) continue;
          object.planetLocations = locations.filter(location => object.sceneIds.includes(location.sceneId));
          recovered += object.planetLocations.length;
        }
        recoveredStore[mapId] = normalizeMap(currentMap);
      }
      if (recovered) {
        await saveMapStore(recoveredStore);
        notifyInfo(`Restored ${recovered} surface location${recovered === 1 ? "" : "s"} that went missing in an earlier update.`);
      }
      await game.settings.set(MODULE_ID, SETTING_SURFACE_LOCATION_RECOVERY, true);
    }
  }

  game.socket.on(SOCKET_NAME, (payload: any = {}) => {
    if (payload.action === "travel-request") {
      const ballot = trackTravelRequest(payload);
      if (ballot) {
        game.socket.emit(SOCKET_NAME, ballot);
        promptForTravelRequest(ballot);
      }
      return;
    }
    if (payload.action === "travel-ballot") {
      if (isPrimaryGMMessage(payload) && payload.coordinatorId !== game.user?.id) promptForTravelRequest(payload);
      return;
    }
    if (payload.action === "travel-vote") {
      handleTravelVote(payload);
      return;
    }
    if (payload.action === "travel-progress") {
      handleTravelProgress(payload);
      return;
    }
    if (payload.action === "travel-approved") {
      handleTravelApproved(payload);
      return;
    }
    if (payload.action === "travel-declined") {
      handleTravelDeclined(payload);
      return;
    }
    if (payload.action === "travel-animation") {
      if (payload.coordinatorId !== game.user?.id) animateTravelOnOpenMaps(payload);
      return;
    }
    if (payload.action === "planet-locations") {
      updateOpenPlanetLocations(payload.mapId, payload.systemId, payload.objectId);
      return;
    }
    if (payload.action === "refresh") {
      // Only GMs send this. Other GMs refresh their own windows; players only have the player view.
      if (game.user?.isGM) refreshOpenApps(payload.mapId);
      else if (playerMapApp?.mapId === payload.mapId) playerMapApp.render({ force: true });
      return;
    }
    if (game.user?.isGM) return;
    if (payload.action === "open" && payload.mapId) {
      playerMapApp?.close();
      openMap(payload.mapId, { playerMode: true, broadcast: true });
    }
    if (payload.action === "notify") {
      ui.notifications?.info(payload.message || "New system discovered.");
      if (playerMapApp?.mapId === payload.mapId) playerMapApp.render({ force: true });
    }
  });

  console.log(`${MODULE_ID} | Ready. API available at game.galaxyMap.`);
});

