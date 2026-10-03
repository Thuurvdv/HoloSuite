import {
  OBJECT_VISIBILITIES,
  clamp,
  normalizeFaction,
  normalizeMap,
  normalizeNumber,
  normalizePlanetLocation,
  normalizeRoute,
  normalizeSystem,
  normalizeSystemObject,
  randomId
} from "./galaxy-model";
import { MODULE_ID, SETTING_MAPS, SOCKET_NAME } from "./constants";
import { downloadJson, slugify } from "./dom-utils";

declare const foundry: any;
declare const game: any;

interface StoreDependencies {
  notifyError: (message: string) => void;
  notifyInfo: (message: string) => void;
  requireGM: (action?: string) => boolean;
  refreshOpenApps: (mapId?: string | null) => unknown;
  closeOpenMap: (mapId: string) => unknown;
  getOpenMapViews: (mapId: string) => any[];
}

export function createGalaxyStore(deps: StoreDependencies) {
  const { notifyError, notifyInfo, requireGM, refreshOpenApps, closeOpenMap, getOpenMapViews } = deps;
  const clone = (data: any) => foundry.utils.deepClone(data);
  const emitRefresh = (mapId: string) => game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });

  function getMapStore() {
    return clone(game.settings.get(MODULE_ID, SETTING_MAPS) ?? {});
  }

  async function saveMapStore(maps: any) {
    if (!requireGM("save galaxy map data")) return maps;
    await game.settings.set(MODULE_ID, SETTING_MAPS, maps ?? {});
    return maps;
  }

  function getRawMap(mapId: string) {
    const maps = getMapStore();
    return maps[mapId] ? clone(maps[mapId]) : null;
  }

  async function persistMap(maps: any, mapId: string, { refresh = true } = {}) {
    maps[mapId] = normalizeMap(maps[mapId]);
    await saveMapStore(maps);
    if (refresh) refreshOpenApps(mapId);
    emitRefresh(mapId);
    return maps[mapId];
  }

  async function createMap(mapData: any = {}) {
    if (!requireGM("create galaxy maps")) return null;
    const maps = getMapStore();
    const map = normalizeMap(mapData);
    maps[map.id] = map;
    await saveMapStore(maps);
    refreshOpenApps(map.id);
    return clone(map);
  }

  async function updateMap(mapId: string, mapData: any = {}) {
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

  async function updateMapMetadata(mapId: string, metadata: any = {}) {
    const map = getRawMap(mapId);
    if (!requireGM("update galaxy map metadata") || !map) {
      if (!map) notifyError(`Map "${mapId}" was not found.`);
      return null;
    }
    return updateMap(mapId, { ...map, title: metadata.title, subtitle: metadata.subtitle, description: metadata.description,
      backgroundImage: metadata.backgroundImage, visibility: metadata.visibility, travelApprovalMode: metadata.travelApprovalMode });
  }

  async function deleteMap(mapId: string) {
    if (!requireGM("delete galaxy maps")) return false;
    const maps = getMapStore();
    if (!maps[mapId]) return false;
    delete maps[mapId];
    await saveMapStore(maps);
    closeOpenMap(mapId);
    refreshOpenApps();
    return true;
  }

  async function duplicateMap(mapId: string) {
    if (!requireGM("duplicate galaxy maps")) return null;
    const source = getRawMap(mapId);
    if (!source) { notifyError(`Map "${mapId}" was not found.`); return null; }
    const copy = normalizeMap({ ...source, id: randomId("map"), title: `${source.title} Copy` });
    const maps = getMapStore();
    maps[copy.id] = copy;
    await saveMapStore(maps);
    refreshOpenApps(copy.id);
    return clone(copy);
  }

  async function upsertSystem(mapId: string, systemData: any = {}) {
    if (!requireGM("save star systems")) return null;
    const maps = getMapStore();
    if (!maps[mapId]) { notifyError(`Map "${mapId}" was not found.`); return null; }
    const map = normalizeMap(maps[mapId]);
    const existing = map.systems.find((candidate: any) => candidate.id === systemData.id);
    const objects = systemData.objects ?? existing?.objects ?? [];
    const primaryId = existing?.primaryObjectId || objects[0]?.id;
    const objectFields = ["image", "sceneIds", "planetLocations", "journalId", "planetPreset", "planetShape", "planetFinish", "planetTexture", "planetColor"];
    const mergedObjects = objects.map((object: any) => object.id !== primaryId ? object : normalizeSystemObject({
      ...object, ...Object.fromEntries(objectFields.filter(key => systemData[key] !== undefined).map(key => [key, systemData[key]]))
    }));
    const system = normalizeSystem({ ...existing, ...systemData, objects: mergedObjects });
    const index = map.systems.findIndex((candidate: any) => candidate.id === system.id);
    if (index >= 0) map.systems[index] = system;
    else map.systems.push(system);
    maps[mapId] = map;
    await persistMap(maps, mapId);
    return clone(system);
  }

  async function upsertObject(mapId: string, systemId: string, objectData: any = {}) {
    if (!requireGM("save locations")) return null;
    const maps = getMapStore();
    const map = maps[mapId] ? normalizeMap(maps[mapId]) : null;
    const system = map?.systems.find((candidate: any) => candidate.id === systemId);
    if (!map || !system) return null;
    const object = normalizeSystemObject(objectData);
    const index = system.objects.findIndex((candidate: any) => candidate.id === object.id);
    if (index >= 0) system.objects[index] = object;
    else system.objects.push(object);
    if (!system.primaryObjectId) system.primaryObjectId = object.id;
    maps[mapId] = map;
    await persistMap(maps, mapId);
    return clone(object);
  }

  const updateOpenPlanetLocations = (mapId: string, systemId: string, objectId: string) => {
    for (const app of getOpenMapViews(mapId)) app.refreshPlanetLocations?.(systemId, objectId);
  };

  async function savePlanetLocation(mapId: string, systemId: string, objectId: string, locationData: any = {}) {
    if (!requireGM("place surface locations")) return null;
    const maps = getMapStore();
    const map = maps[mapId] ? normalizeMap(maps[mapId]) : null;
    const object = map?.systems.find((candidate: any) => candidate.id === systemId)?.objects.find((candidate: any) => candidate.id === objectId);
    if (!map || !object) return null;
    const sceneId = String(locationData.sceneId || "");
    if (!object.sceneIds.includes(sceneId)) { notifyError("Only scenes linked to this object can be placed on its surface."); return null; }
    const location = normalizePlanetLocation(locationData);
    const index = object.planetLocations.findIndex((candidate: any) => candidate.sceneId === sceneId && candidate.shape === location.shape);
    if (index >= 0) location.id = object.planetLocations[index].id;
    if (index >= 0) object.planetLocations[index] = location;
    else object.planetLocations.push(location);
    maps[mapId] = normalizeMap(map);
    await saveMapStore(maps);
    updateOpenPlanetLocations(mapId, systemId, objectId);
    game.socket.emit(SOCKET_NAME, { action: "planet-locations", mapId, systemId, objectId });
    return clone(location);
  }

  async function removePlanetLocation(mapId: string, systemId: string, objectId: string, locationId: string) {
    if (!requireGM("remove surface locations")) return false;
    const maps = getMapStore();
    const map = maps[mapId] ? normalizeMap(maps[mapId]) : null;
    const object = map?.systems.find((candidate: any) => candidate.id === systemId)?.objects.find((candidate: any) => candidate.id === objectId);
    if (!map || !object) return false;
    const before = object.planetLocations.length;
    object.planetLocations = object.planetLocations.filter((candidate: any) => candidate.id !== locationId);
    if (object.planetLocations.length === before) return false;
    maps[mapId] = normalizeMap(map);
    await saveMapStore(maps);
    updateOpenPlanetLocations(mapId, systemId, objectId);
    game.socket.emit(SOCKET_NAME, { action: "planet-locations", mapId, systemId, objectId });
    return true;
  }

  async function unlinkPlanetScene(mapId: string, systemId: string, objectId: string, sceneId: string) {
    if (!requireGM("unlink scenes from locations")) return false;
    const object = getRawMap(mapId)?.systems.find((candidate: any) => candidate.id === systemId)?.objects.find((candidate: any) => candidate.id === objectId);
    if (!object?.sceneIds.includes(sceneId)) return false;
    return Boolean(await upsertObject(mapId, systemId, { ...object, sceneIds: object.sceneIds.filter((candidate: string) => candidate !== sceneId) }));
  }

  async function deleteObject(mapId: string, systemId: string, objectId: string) {
    if (!requireGM("delete locations")) return false;
    const maps = getMapStore();
    const map = maps[mapId] ? normalizeMap(maps[mapId]) : null;
    const system = map?.systems.find((candidate: any) => candidate.id === systemId);
    if (!map || !system) return false;
    system.objects = system.objects.filter((candidate: any) => candidate.id !== objectId);
    if (system.primaryObjectId === objectId) system.primaryObjectId = system.objects[0]?.id ?? "";
    if (map.currentLocation.objectId === objectId) map.currentLocation.objectId = system.primaryObjectId;
    maps[mapId] = map;
    await persistMap(maps, mapId);
    return true;
  }

  async function moveObject(mapId: string, objectId: string, destinationSystemId: string) {
    if (!requireGM("move locations")) return null;
    const maps = getMapStore();
    const map = maps[mapId] ? normalizeMap(maps[mapId]) : null;
    const source = map?.systems.find((system: any) => system.objects.some((object: any) => object.id === objectId));
    const destination = map?.systems.find((system: any) => system.id === destinationSystemId);
    const object = source?.objects.find((candidate: any) => candidate.id === objectId);
    if (!map || !source || !destination || !object) return null;
    source.objects = source.objects.filter((candidate: any) => candidate.id !== objectId);
    destination.objects.push(object);
    if (source.primaryObjectId === objectId) source.primaryObjectId = source.objects[0]?.id ?? "";
    if (!destination.primaryObjectId) destination.primaryObjectId = objectId;
    if (map.currentLocation.objectId === objectId) map.currentLocation.systemId = destination.id;
    maps[mapId] = map;
    await persistMap(maps, mapId);
    return clone(object);
  }

  async function setPrimaryObject(mapId: string, systemId: string, objectId: string) {
    if (!requireGM("set the arrival object")) return null;
    const maps = getMapStore();
    const map = maps[mapId] ? normalizeMap(maps[mapId]) : null;
    const system = map?.systems.find((candidate: any) => candidate.id === systemId);
    if (!map || !system?.objects.some((object: any) => object.id === objectId)) return null;
    system.primaryObjectId = objectId;
    if (map.currentLocation.systemId === systemId && !map.currentLocation.objectId) map.currentLocation.objectId = objectId;
    maps[mapId] = map;
    await persistMap(maps, mapId);
    return clone(system);
  }

  async function saveObjectPosition(mapId: string, systemId: string, objectId: string, x: any, y: any) {
    const maps = getMapStore();
    const map = maps[mapId] ? normalizeMap(maps[mapId]) : null;
    const object = map?.systems.find((system: any) => system.id === systemId)?.objects.find((candidate: any) => candidate.id === objectId);
    if (!map || !object) return null;
    object.x = clamp(normalizeNumber(x, object.x), 0, 100);
    object.y = clamp(normalizeNumber(y, object.y), 0, 100);
    maps[mapId] = map;
    await persistMap(maps, mapId);
    return clone(object);
  }

  async function setObjectVisibility(mapId: string, systemId: string, objectId: string, visibility: string) {
    if (!requireGM("change object visibility")) return null;
    const maps = getMapStore();
    const map = maps[mapId] ? normalizeMap(maps[mapId]) : null;
    const object = map?.systems.find((system: any) => system.id === systemId)?.objects.find((candidate: any) => candidate.id === objectId);
    if (!map || !object) return null;
    object.visibility = OBJECT_VISIBILITIES.includes(visibility) ? visibility : "inherit";
    if (object.visibility === "players" && ["undiscovered", "locked"].includes(object.status)) object.status = "known";
    maps[mapId] = map;
    await persistMap(maps, mapId);
    return clone(object);
  }

  async function deleteSystem(mapId: string, systemId: string) {
    if (!requireGM("delete star systems")) return false;
    const maps = getMapStore();
    const map = maps[mapId];
    if (!map) return false;
    map.systems = map.systems.filter((system: any) => system.id !== systemId);
    map.routes = map.routes.filter((route: any) => route.fromSystemId !== systemId && route.toSystemId !== systemId);
    if (map.currentSystemId === systemId) map.currentSystemId = map.systems[0]?.id ?? "";
    await persistMap(maps, mapId);
    return true;
  }

  async function setCurrentSystem(mapId: string, systemId: string) {
    if (!requireGM("set current location")) return null;
    const maps = getMapStore();
    const map = maps[mapId] ? normalizeMap(maps[mapId]) : null;
    const system = map?.systems.find((candidate: any) => candidate.id === systemId);
    if (!map || !system) { notifyError(`System "${systemId}" was not found.`); return null; }
    map.currentSystemId = systemId;
    maps[mapId] = map;
    await persistMap(maps, mapId);
    return clone(system);
  }

  async function setCurrentObject(mapId: string, systemId: string, objectId: string) {
    if (!requireGM("set current location")) return null;
    const maps = getMapStore();
    const map = maps[mapId] ? normalizeMap(maps[mapId]) : null;
    const system = map?.systems.find((candidate: any) => candidate.id === systemId);
    const object = system?.objects.find((candidate: any) => candidate.id === objectId);
    if (!map || !system || !object) return null;
    map.currentSystemId = systemId;
    map.currentLocation = { systemId, objectId };
    maps[mapId] = map;
    await persistMap(maps, mapId);
    return clone(object);
  }

  async function upsertRoute(mapId: string, routeData: any = {}, systemId = "") {
    if (!requireGM("save routes")) return null;
    const maps = getMapStore();
    const map = maps[mapId];
    const owner = systemId ? map?.systems?.find((system: any) => system.id === systemId) : map;
    if (!map || !owner) { notifyError(systemId ? `System "${systemId}" was not found.` : `Map "${mapId}" was not found.`); return null; }
    if (!Array.isArray(owner.routes)) owner.routes = [];
    const route = normalizeRoute(routeData);
    if (!route.fromSystemId || !route.toSystemId || route.fromSystemId === route.toSystemId) { notifyError("Routes require two different systems."); return null; }
    const index = owner.routes.findIndex((candidate: any) => candidate.id === route.id);
    if (index >= 0) owner.routes[index] = route;
    else owner.routes.push(route);
    await persistMap(maps, mapId);
    return clone(route);
  }

  async function deleteRoute(mapId: string, routeId: string, systemId = "") {
    if (!requireGM("delete routes")) return false;
    const maps = getMapStore();
    const map = maps[mapId];
    const owner = systemId ? map?.systems?.find((system: any) => system.id === systemId) : map;
    if (!owner) return false;
    owner.routes = (owner.routes ?? []).filter((route: any) => route.id !== routeId);
    await persistMap(maps, mapId);
    return true;
  }

  async function upsertFaction(mapId: string, factionData: any = {}) {
    if (!requireGM("save factions")) return null;
    const maps = getMapStore();
    const map = maps[mapId];
    if (!map) { notifyError(`Map "${mapId}" was not found.`); return null; }
    const faction = normalizeFaction(factionData);
    const index = map.factions.findIndex((candidate: any) => candidate.id === faction.id);
    if (index >= 0) map.factions[index] = faction;
    else map.factions.push(faction);
    await persistMap(maps, mapId);
    return clone(faction);
  }

  async function deleteFaction(mapId: string, factionId: string) {
    if (!requireGM("delete factions")) return false;
    const maps = getMapStore();
    const map = maps[mapId];
    if (!map) return false;
    map.factions = map.factions.filter((faction: any) => faction.id !== factionId);
    for (const system of map.systems) {
      if (system.factionId === factionId) system.factionId = "";
      for (const object of system.objects ?? []) if (object.factionId === factionId) object.factionId = "";
    }
    await persistMap(maps, mapId);
    return true;
  }

  async function setVisibility(mapId: string, kind: string, id: string, hidden: boolean, systemId = "") {
    const actions: any = { faction: "factions", system: "star systems", route: "routes" };
    if (!requireGM(`${hidden ? "hide" : "reveal"} ${actions[kind]}`)) return null;
    const maps = getMapStore();
    const map = maps[mapId];
    const owner = systemId ? map?.systems?.find((system: any) => system.id === systemId) : map;
    const item = kind === "faction" ? map?.factions?.find((candidate: any) => candidate.id === id)
      : kind === "system" ? map?.systems?.find((candidate: any) => candidate.id === id)
      : owner?.routes?.find((candidate: any) => candidate.id === id);
    if (!map || !item) { notifyError(`${kind[0].toUpperCase()}${kind.slice(1)} "${id}" was not found.`); return null; }
    item.visibility = hidden ? "gm" : "players";
    if (kind === "system" && !hidden && ["undiscovered", "locked"].includes(item.status)) item.status = "known";
    await persistMap(maps, mapId);
    return clone(item);
  }

  async function hideFactionFromPlayers(mapId: string, factionId: string, hidden = true) {
    const faction = await setVisibility(mapId, "faction", factionId, hidden);
    if (faction) notifyInfo(`${faction.name} ${hidden ? "hidden from" : "visible to"} players.`);
    return faction;
  }
  async function revealSystemToPlayers(mapId: string, systemId: string, { notify = true } = {}) {
    const system = await setVisibility(mapId, "system", systemId, false);
    if (!system) return null;
    if (notify) notifySystemDiscovered(mapId, system.id);
    notifyInfo(`${system.name} revealed to players.`);
    return system;
  }
  async function hideSystemFromPlayers(mapId: string, systemId: string, hidden = true) {
    const system = await setVisibility(mapId, "system", systemId, hidden);
    if (system) notifyInfo(`${system.name} ${hidden ? "hidden from" : "visible to"} players.`);
    return system;
  }
  async function revealRouteToPlayers(mapId: string, routeId: string, systemId = "") {
    const route = await setVisibility(mapId, "route", routeId, false, systemId);
    if (route) notifyInfo("Route revealed to players.");
    return route;
  }
  async function hideRouteFromPlayers(mapId: string, routeId: string, hidden = true, systemId = "") {
    const route = await setVisibility(mapId, "route", routeId, hidden, systemId);
    if (route) notifyInfo(`Route ${hidden ? "hidden from" : "visible to"} players.`);
    return route;
  }

  async function saveSystemPosition(mapId: string, systemId: string, x: any, y: any) {
    if (!requireGM("move star systems")) return null;
    const maps = getMapStore();
    const map = maps[mapId];
    const system = map?.systems?.find((candidate: any) => candidate.id === systemId);
    if (!system) { notifyError(`System "${systemId}" was not found.`); return null; }
    system.x = clamp(normalizeNumber(x, system.x), 0, 100);
    system.y = clamp(normalizeNumber(y, system.y), 0, 100);
    await persistMap(maps, mapId, { refresh: false });
    return clone(system);
  }

  function notifySystemDiscovered(mapId: string, systemId: string) {
    if (!requireGM("notify players about discoveries")) return;
    const system = getRawMap(mapId)?.systems?.find((candidate: any) => candidate.id === systemId);
    if (!system) { notifyError(`System "${systemId}" was not found.`); return; }
    game.socket.emit(SOCKET_NAME, { action: "notify", mapId, systemId, message: `New System Discovered: ${system.name}` });
    notifyInfo(`Discovery notification sent: ${system.name}.`);
  }

  async function importMapData(mapData: any, { replace = false } = {}) {
    if (!requireGM("import galaxy maps")) return null;
    const maps = getMapStore();
    let map = normalizeMap(mapData);
    if (maps[map.id] && !replace) map = normalizeMap({ ...map, id: randomId("map"), title: `${map.title} Import` });
    maps[map.id] = map;
    await saveMapStore(maps);
    refreshOpenApps(map.id);
    notifyInfo(`Imported ${map.title}.`);
    return clone(map);
  }

  function exportMap(mapId: string) {
    const map = getRawMap(mapId);
    if (!map) { notifyError(`Map "${mapId}" was not found.`); return; }
    downloadJson(`${slugify(map.title)}.json`, normalizeMap(map));
  }

  const getMaps = () => Object.values(getMapStore()).map(normalizeMap);
  const getSystem = (mapId: string, systemId: string) => clone(normalizeMap(getRawMap(mapId)).systems.find((system: any) => system.id === String(systemId)) ?? null);
  function getObject(mapId: string, objectId: string) {
    const map = normalizeMap(getRawMap(mapId));
    for (const system of map.systems) {
      const object = system.objects.find((candidate: any) => candidate.id === String(objectId));
      if (object) return { systemId: system.id, object: clone(object) };
    }
    return null;
  }
  const getSceneIdsForSystem = (mapId: string, systemId: string) => {
    const system = normalizeMap(getRawMap(mapId)).systems.find((candidate: any) => candidate.id === String(systemId));
    return [...new Set(system?.objects.flatMap((object: any) => object.sceneIds) ?? [])];
  };
  const getSceneIdsForObject = (mapId: string, objectId: string) => [...(getObject(mapId, objectId)?.object.sceneIds ?? [])];
  function getObjectsForScene(sceneId: string) {
    return getMaps().flatMap((map: any) => map.systems.flatMap((system: any) => system.objects
      .filter((object: any) => object.sceneIds.includes(String(sceneId)))
      .map((object: any) => ({ mapId: map.id, mapTitle: map.title, systemId: system.id, systemName: system.name, object: clone(object) }))));
  }
  function getSystemsForScene(sceneId: string) {
    return getMaps().flatMap((map: any) => map.systems
      .filter((system: any) => system.objects.some((object: any) => object.sceneIds.includes(String(sceneId))))
      .map((system: any) => ({ mapId: map.id, mapTitle: map.title, system: clone(system) })));
  }

  return {
    getMapStore, saveMapStore, getRawMap, createMap, updateMap, updateMapMetadata, deleteMap, duplicateMap,
    upsertSystem, upsertObject, savePlanetLocation, removePlanetLocation, unlinkPlanetScene, deleteObject, moveObject,
    setPrimaryObject, saveObjectPosition, setObjectVisibility, deleteSystem, setCurrentSystem, setCurrentObject,
    upsertRoute, deleteRoute, upsertFaction, deleteFaction, hideFactionFromPlayers, saveSystemPosition,
    revealSystemToPlayers, hideSystemFromPlayers, revealRouteToPlayers, hideRouteFromPlayers, notifySystemDiscovered,
    importMapData, exportMap, getMaps, getSystem, getObject, getSceneIdsForSystem, getSceneIdsForObject,
    getObjectsForScene, getSystemsForScene, updateOpenPlanetLocations
  };
}
