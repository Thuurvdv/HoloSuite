import {
  GALAXY_SCHEMA_VERSION,
  normalizeMap,
  normalizePlanetLocations
} from "./galaxy-model";
import { createGalaxyMapManagerClass } from "./manager-app";
import { createGalaxyMapViewClass } from "./view-app";
import { createPlayerMapChooserClass } from "./player-map-chooser-app";
import { MODULE_ID, SETTING_MAPS, SETTING_SCHEMA_V1_BACKUP, SETTING_SURFACE_LOCATION_RECOVERY, SOCKET_NAME, TEMPLATE_ROOT } from "./constants";
import { getHtmlElement } from "./dom-utils";
import { activateGalaxyDialogChrome } from "./window-chrome";
import { prepareMapForDisplay, prepareMapForManager } from "./map-presenters";
import { activateAppearancePanelControls } from "./appearance-controls";
import { createGalaxyStore } from "./galaxy-store";
import { createTravelService } from "./travel-service";
import { getTextureGuideMarkup } from "./texture-guide";

let managerApp = null;
const openMaps = new Map();
let playerMapApp = null;
let playerMapChooserApp = null;

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

const {
  getMapStore, saveMapStore, getRawMap, createMap, updateMap, updateMapMetadata, deleteMap, duplicateMap,
  upsertSystem, upsertObject, savePlanetLocation, removePlanetLocation, unlinkPlanetScene, deleteObject, moveObject,
  setPrimaryObject, saveObjectPosition, setObjectVisibility, deleteSystem, setCurrentSystem, setCurrentObject,
  upsertRoute, deleteRoute, upsertFaction, deleteFaction, hideFactionFromPlayers, saveSystemPosition,
  revealSystemToPlayers, hideSystemFromPlayers, revealRouteToPlayers, hideRouteFromPlayers,
  importMapData, exportMap, getMaps, getSystem, getObject, getSceneIdsForSystem, getSceneIdsForObject,
  getObjectsForScene, getSystemsForScene, updateOpenPlanetLocations
} = createGalaxyStore({ notifyError, notifyInfo, requireGM, refreshOpenApps, closeOpenMap, getOpenMapViews });

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

const {
  getTravelRoute, requestTravelToSystem, requestTravelToObject, promptForTravelRequest, isPrimaryGMMessage,
  handleTravelProgress, trackTravelRequest, animateTravelOnOpenMaps, broadcastTravelAnimation,
  broadcastObjectTravelAnimation, handleTravelVote, handleTravelApproved, handleTravelDeclined
} = createTravelService({
  getRawMap, setCurrentSystem, setCurrentObject, getOpenMapViews, getAppHtml,
  notifyInfo, notifyError, getActiveUsers, getPrimaryGM, isPrimaryGM
});

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
  importMapData,
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
  notifyError,
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
    `${TEMPLATE_ROOT}/map-context-menu.hbs`,
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

