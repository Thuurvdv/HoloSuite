import {
  ICON_STYLES,
  ROUTE_TYPES,
  SYSTEM_STATUSES,
  SYSTEM_TYPES,
  TRAVEL_ANIMATION_MS,
  TRAVEL_REQUEST_TIMEOUT_MS,
  VISIBILITIES,
  clamp,
  normalizeFaction,
  normalizeMap,
  normalizeNumber,
  normalizeRoute,
  normalizeSystem,
  randomId
} from "./galaxy-model";
import { createGalaxyMapManagerClass } from "./manager-app";
import { createGalaxyMapViewClass } from "./view-app";
import { MODULE_ID, SETTING_MAPS, SOCKET_NAME, TEMPLATE_ROOT } from "./constants";
import { documentOptions, downloadJson, escapeHtml, getFormValues, getHtmlElement, optionList, slugify } from "./dom-utils";

(() => {
  "use strict";

  let managerApp = null;
  const openMaps = new Map();
  let playerMapApp = null;
  const pendingTravelRequests = new Map();
  const promptedTravelRequests = new Set();

  function clone(data) {
    if (foundry.utils.deepClone) return foundry.utils.deepClone(data);
    if (foundry.utils.duplicate) return foundry.utils.duplicate(data);
    return JSON.parse(JSON.stringify(data ?? {}));
  }

  function localizeFallback(key, fallback) {
    const localized = game.i18n.localize(key);
    return localized === key ? fallback : localized;
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

  function getUsersArray() {
    return game.users?.contents ?? Array.from(game.users ?? []);
  }

  function getActiveUsers() {
    return getUsersArray().filter((user) => user.active);
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

  function activateCrudDialog(html) {
    const root = getHtmlElement(html);
    root?.querySelectorAll("[data-browse-target]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const target = root.querySelector(`[name="${button.dataset.browseTarget}"]`);
        if (!target) return;
        new FilePicker({
          type: "image",
          current: target.value,
          callback: (path) => {
            target.value = path;
            target.dispatchEvent(new Event("change", { bubbles: true }));
          }
        }).browse();
      });
    });
  }

  function renderCrudDialog({ title, content, submitLabel = "Save", onSubmit, render = activateCrudDialog }) {
    new Dialog({
      title,
      content,
      render,
      buttons: {
        save: {
          icon: '<i class="fa-solid fa-floppy-disk"></i>',
          label: submitLabel,
          callback: (html) => onSubmit(getFormValues(html))
        },
        cancel: {
          icon: '<i class="fa-solid fa-xmark"></i>',
          label: "Cancel"
        }
      },
      default: "save"
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog"],
      width: 560
    }).render(true);
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
      return {
        ...system,
        displayName: obscured ? "???" : system.name,
        displayDescription: obscured ? "Unresolved sensor contact. Details are not available." : system.description,
        displayType: obscured ? "unknown" : system.type,
        displayStatus: obscured ? "undiscovered" : system.status,
        factionName: faction?.name ?? "Unaffiliated",
        factionColor: system.iconColor || faction?.color || "#58d8ff",
        obscured,
        isCurrent: system.id === normalized.currentSystemId,
        isSelected: system.id === selectedSystemId,
        gmOnly: system.visibility === "gm"
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
      : displaySystems.find((system) => system.id === selectedSystemId) ?? displaySystems[0] ?? null;
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
    }

    return {
      ...normalized,
      systems: displaySystems,
      routes,
      factions,
      selectedSystem,
      selectedRoute,
      currentSystem,
      selectedType: selectedRoute ? "route" : "system",
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
      visibility: metadata.visibility
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
    const map = maps[mapId];
    if (!map) {
      notifyError(`Map "${mapId}" was not found.`);
      return null;
    }
    const system = normalizeSystem(systemData);
    const index = map.systems.findIndex((candidate) => candidate.id === system.id);
    if (index >= 0) map.systems[index] = system;
    else map.systems.push(system);
    maps[mapId] = normalizeMap(map);
    await saveMapStore(maps);
    refreshOpenApps(mapId);
    game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
    return clone(system);
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
    const map = maps[mapId];
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

  async function upsertRoute(mapId, routeData = {}) {
    if (!requireGM("save routes")) return null;
    const maps = getMapStore();
    const map = maps[mapId];
    if (!map) {
      notifyError(`Map "${mapId}" was not found.`);
      return null;
    }
    const route = normalizeRoute(routeData);
    if (!route.fromSystemId || !route.toSystemId || route.fromSystemId === route.toSystemId) {
      notifyError("Routes require two different systems.");
      return null;
    }
    const index = map.routes.findIndex((candidate) => candidate.id === route.id);
    if (index >= 0) map.routes[index] = route;
    else map.routes.push(route);
    maps[mapId] = normalizeMap(map);
    await saveMapStore(maps);
    refreshOpenApps(mapId);
    game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
    return clone(route);
  }

  async function deleteRoute(mapId, routeId) {
    if (!requireGM("delete routes")) return false;
    const maps = getMapStore();
    const map = maps[mapId];
    if (!map) return false;
    map.routes = map.routes.filter((route) => route.id !== routeId);
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
    }
    maps[mapId] = normalizeMap(map);
    await saveMapStore(maps);
    refreshOpenApps(mapId);
    game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
    return true;
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

  async function revealRouteToPlayers(mapId, routeId) {
    if (!requireGM("reveal routes")) return null;
    const maps = getMapStore();
    const map = maps[mapId];
    const route = map?.routes?.find((candidate) => candidate.id === routeId);
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

  async function hideRouteFromPlayers(mapId, routeId, hidden = true) {
    if (!requireGM(hidden ? "hide routes" : "reveal routes")) return null;
    const maps = getMapStore();
    const map = maps[mapId];
    const route = map?.routes?.find((candidate) => candidate.id === routeId);
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

  function getSystemDialogContent(mapId, system = {}, defaults = {}) {
    const map = getRawMap(mapId);
    const data = normalizeSystem({ ...defaults, ...system });
    const factionOptions = [
      { value: "", label: "Unaffiliated" },
      ...(map?.factions ?? []).map((faction) => ({ value: faction.id, label: faction.name }))
    ];
    const faction = (map?.factions ?? []).find((candidate) => candidate.id === data.factionId);
    const iconColorValue = data.iconColor || faction?.color || "#58d8ff";
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${escapeHtml(data.id)}" />
        <input type="hidden" name="x" value="${escapeHtml(data.x)}" />
        <input type="hidden" name="y" value="${escapeHtml(data.y)}" />
        <label>Name <input type="text" name="name" value="${escapeHtml(data.name)}" /></label>
        <div class="gmf-form-grid">
          <label>Type <select name="type">${optionList(SYSTEM_TYPES, data.type)}</select></label>
          <label>Status <select name="status">${optionList(SYSTEM_STATUSES, data.status)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Faction <select name="factionId">${optionList(factionOptions, data.factionId)}</select></label>
          <label>Visibility <select name="visibility">${optionList(VISIBILITIES, data.visibility)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Icon Style <select name="iconStyle">${optionList(ICON_STYLES, data.iconStyle)}</select></label>
          <label>Icon Size <input type="range" name="iconSize" value="${escapeHtml(data.iconSize)}" min="18" max="56" step="1" /></label>
        </div>
        <div class="gmf-form-grid">
          <label>Icon Color <input type="color" name="iconColor" value="${escapeHtml(iconColorValue)}" /></label>
          <label class="gmf-checkbox-label"><input type="checkbox" name="pulse" value="true" ${data.pulse ? "checked" : ""} /> Pulse Glow</label>
        </div>
        <label>Description <textarea name="description">${escapeHtml(data.description)}</textarea></label>
        <label>Image Path
          <div class="gmf-path-field">
            <input type="text" name="image" value="${escapeHtml(data.image)}" />
            <button type="button" data-browse-target="image"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
        <div class="gmf-form-grid">
          <label>Scene <select name="sceneId">${documentOptions(game.scenes, data.sceneId)}</select></label>
          <label>Journal <select name="journalId">${documentOptions(game.journal, data.journalId)}</select></label>
        </div>
        <label>GM Notes <textarea name="notes">${escapeHtml(data.notes)}</textarea></label>
      </form>
    `;
  }

  function getRouteDialogContent(mapId, route: any = {}, defaults: any = {}) {
    const map = getRawMap(mapId);
    const routeDefaults = { ...defaults, ...route };
    const systems = map?.systems ?? [];
    if (!routeDefaults.fromSystemId) routeDefaults.fromSystemId = systems[0]?.id ?? "";
    if (!routeDefaults.toSystemId) routeDefaults.toSystemId = systems.find((system) => system.id !== routeDefaults.fromSystemId)?.id ?? "";
    if (routeDefaults.fromSystemId && !routeDefaults.toSystemId) {
      routeDefaults.toSystemId = systems.find((system) => system.id !== routeDefaults.fromSystemId)?.id ?? "";
    }
    const data = normalizeRoute(routeDefaults);
    const systemOptions = systems.map((system) => ({ value: system.id, label: system.name }));
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${escapeHtml(data.id)}" />
        <div class="gmf-form-grid">
          <label>From <select name="fromSystemId">${optionList(systemOptions, data.fromSystemId)}</select></label>
          <label>To <select name="toSystemId">${optionList(systemOptions, data.toSystemId)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Type <select name="type">${optionList(ROUTE_TYPES, data.type)}</select></label>
          <label>Visibility <select name="visibility">${optionList(VISIBILITIES, data.visibility)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Travel Time <input type="text" name="travelTime" value="${escapeHtml(data.travelTime)}" /></label>
          <label>Fuel Cost <input type="number" name="fuelCost" value="${escapeHtml(data.fuelCost)}" min="0" step="1" /></label>
        </div>
        <label>Notes <textarea name="notes">${escapeHtml(data.notes)}</textarea></label>
      </form>
    `;
  }

  function getFactionDialogContent(faction = {}) {
    const data = normalizeFaction(faction);
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${escapeHtml(data.id)}" />
        <label>Name <input type="text" name="name" value="${escapeHtml(data.name)}" /></label>
        <div class="gmf-form-grid">
          <label>Color <input type="color" name="color" value="${escapeHtml(data.color)}" /></label>
          <label>Visibility <select name="visibility">${optionList(VISIBILITIES, data.visibility)}</select></label>
        </div>
        <label>Description <textarea name="description">${escapeHtml(data.description)}</textarea></label>
      </form>
    `;
  }

  function getMapMetadataDialogContent(map = {}) {
    const data = normalizeMap(map);
    return `
      <form class="gmf-crud-form">
        <label>Title <input type="text" name="title" value="${escapeHtml(data.title)}" /></label>
        <label>Subtitle <input type="text" name="subtitle" value="${escapeHtml(data.subtitle)}" /></label>
        <label>Description <textarea name="description">${escapeHtml(data.description)}</textarea></label>
        <label>Background Image
          <div class="gmf-path-field">
            <input type="text" name="backgroundImage" value="${escapeHtml(data.backgroundImage)}" />
            <button type="button" data-browse-target="backgroundImage"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
        <label>Visibility <select name="visibility">${optionList(VISIBILITIES, data.visibility)}</select></label>
      </form>
    `;
  }

  function openMapMetadataDialog(mapId) {
    const map = getRawMap(mapId);
    if (!map) return;
    renderCrudDialog({
      title: "Edit Galaxy Map",
      content: getMapMetadataDialogContent(map),
      onSubmit: (values) => updateMapMetadata(mapId, values)
    });
  }

  function openSystemDialog(mapId, systemId = null, defaults = {}) {
    const map = getRawMap(mapId);
    const system = systemId ? map?.systems?.find((candidate) => candidate.id === systemId) : null;
    renderCrudDialog({
      title: system ? "Edit Star System" : "Create Star System",
      content: getSystemDialogContent(mapId, system ?? { id: randomId("system"), name: "New System" }, defaults),
      submitLabel: system ? "Save System" : "Create System",
      onSubmit: (values) => upsertSystem(mapId, { ...values, pulse: values.pulse === "true" })
    });
  }

  function openRouteDialog(mapId, routeId = null, defaults = {}) {
    const map = getRawMap(mapId);
    if ((map?.systems?.length ?? 0) < 2) {
      notifyError("Create at least two systems before adding a route.");
      return;
    }
    const route = routeId ? map.routes.find((candidate) => candidate.id === routeId) : null;
    renderCrudDialog({
      title: route ? "Edit Route" : "Create Route",
      content: getRouteDialogContent(mapId, route ?? { id: randomId("route") }, defaults),
      submitLabel: route ? "Save Route" : "Create Route",
      onSubmit: (values) => upsertRoute(mapId, values)
    });
  }

  function openFactionDialog(mapId, factionId = null) {
    const map = getRawMap(mapId);
    const faction = factionId ? map?.factions?.find((candidate) => candidate.id === factionId) : null;
    renderCrudDialog({
      title: faction ? "Edit Faction" : "Create Faction",
      content: getFactionDialogContent(faction ?? { id: randomId("faction"), name: "New Faction" }),
      submitLabel: faction ? "Save Faction" : "Create Faction",
      onSubmit: (values) => upsertFaction(mapId, values)
    });
  }

  function openFactionManagerDialog(mapId) {
    const map = getRawMap(mapId);
    if (!map) return;
    const rows = normalizeMap(map).factions.map((faction) => `
      <article class="gmf-dialog-row">
        <div>
          <strong><span class="gmf-color-dot" style="--gmf-faction-color: ${escapeHtml(faction.color)};"></span>${escapeHtml(faction.name)}</strong>
          <span>${escapeHtml(faction.color)} - ${escapeHtml(faction.visibility)}</span>
        </div>
        <div class="gmf-row-actions">
          <button type="button" data-dialog-edit-faction="${escapeHtml(faction.id)}" title="Edit faction"><i class="fa-solid fa-pen"></i></button>
          <button type="button" data-dialog-delete-faction="${escapeHtml(faction.id)}" title="Delete faction"><i class="fa-solid fa-trash"></i></button>
        </div>
      </article>
    `).join("") || '<p class="gmf-empty-inline">No factions yet.</p>';

    new Dialog({
      title: "Manage Factions",
      content: `
        <section class="gmf-dialog-manager">
          <div class="gmf-dialog-manager__bar">
            <p>Factions tint systems and help organize territory on the map.</p>
            <button type="button" data-dialog-add-faction><i class="fa-solid fa-plus"></i> Add Faction</button>
          </div>
          <div class="gmf-dialog-list">${rows}</div>
        </section>
      `,
      render: (html) => {
        const root = getHtmlElement(html);
        root.querySelector("[data-dialog-add-faction]")?.addEventListener("click", () => openFactionDialog(mapId));
        root.querySelectorAll("[data-dialog-edit-faction]").forEach((button) => {
          button.addEventListener("click", () => openFactionDialog(mapId, button.dataset.dialogEditFaction));
        });
        root.querySelectorAll("[data-dialog-delete-faction]").forEach((button) => {
          button.addEventListener("click", async () => {
            const confirmed = await Dialog.confirm({
              title: "Delete Faction",
              content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
            });
            if (confirmed) {
              await deleteFaction(mapId, button.dataset.dialogDeleteFaction);
              openFactionManagerDialog(mapId);
            }
          });
        });
      },
      buttons: {
        close: {
          icon: '<i class="fa-solid fa-check"></i>',
          label: "Done"
        }
      },
      default: "close"
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog"],
      width: 560
    }).render(true);
  }

  function prepareMapForManager(map) {
    if (!map) return null;
    const normalized = normalizeMap(map);
    const systemsById = new Map<string, any>(normalized.systems.map((system) => [system.id, system]));
    const factionsById = new Map<string, any>(normalized.factions.map((faction) => [faction.id, faction]));
    return {
      ...normalized,
      systems: normalized.systems.map((system) => ({
        ...system,
        factionName: factionsById.get(system.factionId)?.name ?? "Unaffiliated"
      })),
      routes: normalized.routes.map((route) => ({
        ...route,
        fromName: systemsById.get(route.fromSystemId)?.name ?? route.fromSystemId,
        toName: systemsById.get(route.toSystemId)?.name ?? route.toSystemId
      }))
    };
  }

  function getMaps() {
    return Object.values(getMapStore()).map(normalizeMap);
  }

  function refreshOpenApps(mapId = null) {
    if (managerApp?.rendered) managerApp.render({ force: true });
    for (const [id, app] of openMaps.entries()) {
      if (!mapId || id === mapId) app.render({ force: true });
    }
    if (playerMapApp?.rendered && (!mapId || playerMapApp.mapId === mapId)) playerMapApp.render({ force: true });
  }

  function getOpenMapViews(mapId) {
    const views = [...openMaps.values()];
    if (playerMapApp) views.push(playerMapApp);
    return views.filter((app) => app?.rendered && app.mapId === mapId);
  }

  function getAppHtml(app) {
    return app.element instanceof HTMLElement ? app.element : app.element?.[0] ?? null;
  }

  function getTravelRoute(map, fromSystemId, toSystemId) {
    return map.routes.find((route) => (
      (route.fromSystemId === fromSystemId && route.toSystemId === toSystemId)
      || (route.toSystemId === fromSystemId && route.fromSystemId === toSystemId)
    )) ?? null;
  }

  function getTravelVoterIds(requesterId) {
    return getActiveUsers()
      .filter((user) => user.id !== requesterId)
      .map((user) => user.id);
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

    const voterIds = getTravelVoterIds(game.user.id);
    if (!voterIds.includes(primaryGM.id)) voterIds.push(primaryGM.id);

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
      voterIds: [...new Set(voterIds)]
    };
  }

  function requestTravelToSystem(mapId, destinationSystemId) {
    const request = buildTravelRequest(mapId, destinationSystemId);
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

    new Dialog({
      title: "Travel Request",
      content: `
        <section class="gmf-travel-request">
          <p><strong>${escapeHtml(payload.requesterName)}</strong> wants to travel on <strong>${escapeHtml(payload.mapTitle)}</strong>.</p>
          <p>${escapeHtml(payload.fromName)} &rarr; ${escapeHtml(payload.toName)}</p>
          <p class="gmf-travel-request__meta">${escapeHtml(payload.routeType)} route / ${escapeHtml(payload.travelTime || "Unknown time")} / Fuel ${escapeHtml(payload.fuelCost ?? 0)}</p>
        </section>
      `,
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
      close: () => respond(false)
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog"],
      width: 420
    }).render(true);
  }

  function trackTravelRequest(payload) {
    if (!isPrimaryGM() || !payload?.requestId) return;
    const timeoutId = globalThis.setTimeout(() => {
      const pending = pendingTravelRequests.get(payload.requestId);
      if (pending) rejectTravelRequest(pending, "Request timeout");
    }, TRAVEL_REQUEST_TIMEOUT_MS);
    pendingTravelRequests.set(payload.requestId, {
      ...payload,
      accepted: new Set(),
      voterIds: [...new Set(payload.voterIds ?? [])],
      timeoutId
    });
  }

  function animateTravelOnOpenMaps(payload) {
    const map = normalizeMap(getRawMap(payload.mapId));
    const from = map.systems.find((system) => system.id === payload.fromSystemId);
    const to = map.systems.find((system) => system.id === payload.toSystemId);
    if (!from || !to) return;
    getOpenMapViews(payload.mapId).forEach((app) => {
      const html = getAppHtml(app);
      if (!html) return;
      app.selectedSystemId = to.id;
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

  async function approveTravelRequest(pending) {
    pendingTravelRequests.delete(pending.requestId);
    if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
    const payload = {
      action: "travel-approved",
      requestId: pending.requestId,
      mapId: pending.mapId,
      fromSystemId: pending.fromSystemId,
      toSystemId: pending.toSystemId,
      fromName: pending.fromName,
      toName: pending.toName,
      coordinatorId: game.user.id
    };
    game.socket.emit(SOCKET_NAME, payload);
    animateTravelOnOpenMaps(payload);
    notifyInfo(`Travel approved: ${pending.fromName} to ${pending.toName}.`);
    globalThis.setTimeout(() => setCurrentSystem(pending.mapId, pending.toSystemId), TRAVEL_ANIMATION_MS);
  }

  function rejectTravelRequest(pending, voterName = "A player") {
    pendingTravelRequests.delete(pending.requestId);
    if (pending.timeoutId) globalThis.clearTimeout(pending.timeoutId);
    const payload = {
      action: "travel-declined",
      requestId: pending.requestId,
      mapId: pending.mapId,
      fromName: pending.fromName,
      toName: pending.toName,
      voterName,
      coordinatorId: game.user.id
    };
    game.socket.emit(SOCKET_NAME, payload);
    notifyInfo(`Travel declined by ${voterName}: ${pending.fromName} to ${pending.toName}.`);
  }

  function handleTravelVote(payload) {
    if (!isPrimaryGM() || !payload?.requestId) return;
    const pending = pendingTravelRequests.get(payload.requestId);
    if (!pending || !pending.voterIds.includes(payload.userId)) return;

    if (!payload.accepted) {
      rejectTravelRequest(pending, payload.userName);
      return;
    }

    pending.accepted.add(payload.userId);
    if (pending.voterIds.every((userId) => pending.accepted.has(userId))) {
      approveTravelRequest(pending);
    }
  }

  function handleTravelApproved(payload) {
    if (payload.coordinatorId === game.user?.id) return;
    if (payload.requestId) promptedTravelRequests.delete(payload.requestId);
    animateTravelOnOpenMaps(payload);
    ui.notifications?.info(`Travel approved: ${payload.fromName} to ${payload.toName}.`);
  }

  function handleTravelDeclined(payload) {
    if (payload.coordinatorId === game.user?.id) return;
    if (payload.requestId) promptedTravelRequests.delete(payload.requestId);
    ui.notifications?.warn(`Travel declined by ${payload.voterName}: ${payload.fromName} to ${payload.toName}.`);
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

  function openMapManager() {
    if (!requireGM("open the map manager")) return null;
    if (!managerApp) managerApp = new GalaxyMapManager();
    managerApp.render({ force: true });
    return managerApp;
  }

  function openPlayerMapChooser() {
    const visibleMaps = getMaps()
      .filter((map) => map.visibility === "players")
      .sort((a, b) => a.title.localeCompare(b.title));

    if (!visibleMaps.length) {
      notifyInfo("No galaxy map is currently visible to players.");
      return null;
    }

    if (visibleMaps.length === 1) return openMap(visibleMaps[0].id, { playerMode: true });

    const choices = visibleMaps.map((map) => `
      <button type="button" class="gmf-player-map-choice" data-player-open-map="${escapeHtml(map.id)}">
        <span class="gmf-player-map-choice__title">${escapeHtml(map.title)}</span>
        <span class="gmf-player-map-choice__meta">${escapeHtml(map.subtitle || map.description || "Player-visible galaxy map")}</span>
      </button>
    `).join("");

    let dialog = null;
    dialog = new Dialog({
      title: "Choose Galaxy Map",
      content: `<section class="gmf-player-map-chooser">${choices}</section>`,
      render: (html) => {
        const root = getHtmlElement(html);
        root?.querySelectorAll("[data-player-open-map]").forEach((button) => {
          button.addEventListener("click", () => {
            openMap(button.dataset.playerOpenMap, { playerMode: true });
            dialog?.close();
          });
        });
      },
      buttons: {
        close: {
          icon: '<i class="fa-solid fa-xmark"></i>',
          label: "Close"
        }
      },
      default: "close"
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog", "gmf-map-chooser-dialog"],
      width: 460
    });
    dialog.render(true);
    return dialog;
  }

  function openGalaxyMapFromSceneControls() {
    const maps = getMaps().sort((a, b) => a.title.localeCompare(b.title));
    if (game.user?.isGM) {
      if (maps.length === 1) return openMap(maps[0].id);
      return openMapManager();
    }

    return openPlayerMapChooser();
  }

  function addSceneControlsButton(controls) {
    const toolName = "galaxy-map-open";
    const title = "Galaxy Map";
    const icon = "fa-solid fa-satellite";

    if (Array.isArray(controls)) {
      const control = controls.find((candidate) => candidate.name === "token") ?? controls[0];
      if (!control?.tools || control.tools.some((tool) => tool.name === toolName)) return;
      control.tools.push({
        name: toolName,
        title,
        icon,
        visible: true,
        toggle: false,
        active: false,
        button: true,
        onClick: openGalaxyMapFromSceneControls
      });
      return;
    }

    const control = controls.tokens ?? Object.values(controls)[0];
    if (!control?.tools || control.tools[toolName]) return;
    control.tools[toolName] = {
      name: toolName,
      title,
      icon,
      order: Object.keys(control.tools).length,
      button: true,
      visible: true,
      onClick: openGalaxyMapFromSceneControls
    };
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

  function closePlayerMap() {
    if (!requireGM("close player galaxy maps")) return;
    game.socket.emit(SOCKET_NAME, { action: "close" });
    notifyInfo("Close-map signal sent to players.");
  }

  const GalaxyMapManager = createGalaxyMapManagerClass({
    templateRoot: TEMPLATE_ROOT,
    getMaps,
    prepareMapForManager,
    getRawMap,
    openMapMetadataDialog,
    openSystemDialog,
    openRouteDialog,
    openFactionDialog,
    exportMap,
    duplicateMap,
    deleteMap,
    createMap,
    deleteSystem,
    deleteRoute,
    deleteFaction,
    openMap,
    showMapToPlayers,
    closePlayerMap,
    hideSystemFromPlayers,
    hideRouteFromPlayers,
    clearManagerApp: (app) => {
      if (managerApp === app) managerApp = null;
    }
  });

  const GalaxyMapView = createGalaxyMapViewClass({
    templateRoot: TEMPLATE_ROOT,
    getRawMap,
    prepareMapForDisplay,
    openSystemDialog,
    openRouteDialog,
    openFactionDialog,
    openFactionManagerDialog,
    openMapMetadataDialog,
    revealSystemToPlayers,
    revealRouteToPlayers,
    hideSystemFromPlayers,
    hideRouteFromPlayers,
    deleteSystem,
    deleteRoute,
    setCurrentSystem,
    requestTravelToSystem,
    notifySystemDiscovered,
    exportMap,
    getTravelRoute,
    broadcastTravelAnimation,
    notifyInfo,
    notifyError,
    saveSystemPosition,
    showMapToPlayers,
    openMapManager,
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

    Handlebars.registerHelper("gmfEq", (left, right) => left === right);
    Handlebars.registerHelper("gmfJson", (value) => JSON.stringify(value, null, 2));
    Handlebars.registerHelper("gmfPercent", (value) => `${Number(value).toFixed(3)}%`);
    Handlebars.registerHelper("gmfFallback", (value, fallback) => value || fallback);

    await loadTemplates([
      `${TEMPLATE_ROOT}/map-manager.hbs`,
      `${TEMPLATE_ROOT}/galaxy-map.hbs`,
      `${TEMPLATE_ROOT}/system-details.hbs`
    ]);
  });

  // HoloSuite Core is the suite launcher; keep this module out of the scene-control toolbar.

  Hooks.once("ready", () => {
    game.galaxyMap = {
      openMap,
      openMapManager,
      openGalaxyMapFromSceneControls,
      openPlayerMapChooser,
      createMap,
      getMaps,
      showMapToPlayers,
      closePlayerMap,
      updateMap,
      updateMapMetadata,
      deleteMap,
      duplicateMap,
      upsertSystem,
      deleteSystem,
      upsertRoute,
      deleteRoute,
      upsertFaction,
      deleteFaction,
      saveSystemPosition,
      setCurrentSystem,
      revealSystemToPlayers,
      revealRouteToPlayers,
      hideSystemFromPlayers,
      hideRouteFromPlayers,
      notifySystemDiscovered,
      requestTravelToSystem,
      importMapData,
      exportMap
    };
    const module = game.modules.get(MODULE_ID);
    if (module) module.api = game.galaxyMap;
    registerWithHoloSuite();

    game.socket.on(SOCKET_NAME, (payload: any = {}) => {
      if (payload.action === "travel-request") {
        trackTravelRequest(payload);
        promptForTravelRequest(payload);
        return;
      }
      if (payload.action === "travel-vote") {
        handleTravelVote(payload);
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

      if (game.user?.isGM) return;
      if (payload.action === "open" && payload.mapId) {
        playerMapApp?.close();
        openMap(payload.mapId, { playerMode: true, broadcast: true });
      }
      if (payload.action === "close") playerMapApp?.close();
      if (payload.action === "refresh" && playerMapApp?.mapId === payload.mapId) {
        playerMapApp.render({ force: true });
      }
      if (payload.action === "notify") {
        ui.notifications?.info(payload.message || "New system discovered.");
        if (playerMapApp?.mapId === payload.mapId) playerMapApp.render({ force: true });
      }
    });

    console.log(`${MODULE_ID} | Ready. API available at game.galaxyMap.`);
  });
})();

