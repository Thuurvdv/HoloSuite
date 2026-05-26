// @ts-nocheck
(() => {
  "use strict";

  const MODULE_ID = "galaxy-map";
  const SETTING_MAPS = "maps";
  const SOCKET_NAME = `module.${MODULE_ID}`;
  const TEMPLATE_ROOT = `modules/${MODULE_ID}/templates`;

  const SYSTEM_TYPES = ["core", "colony", "frontier", "station", "anomaly", "ruins", "restricted", "unknown"];
  const SYSTEM_STATUSES = ["undiscovered", "known", "visited", "danger", "locked"];
  const ROUTE_TYPES = ["safe", "dangerous", "restricted", "smuggler", "unknown"];
  const VISIBILITIES = ["gm", "players"];
  const ICON_STYLES = ["planet", "ringed", "star", "diamond", "void"];
  const MIN_ZOOM = 0.55;
  const MAX_ZOOM = 2.6;
  const TRAVEL_ANIMATION_MS = 2400;

  const SAMPLE_MAP = {
    id: "sample-aster-veil",
    title: "The Aster Veil",
    subtitle: "A frontier command chart for luminous trouble",
    description: "A polished public-beta sample map with revealed worlds, hidden threats, and discoverable sensor contacts.",
    backgroundImage: "",
    visibility: "players",
    currentSystemId: "crown-of-aster",
    factions: [
      {
        id: "aster-accord",
        name: "Aster Accord",
        color: "#58d8ff",
        description: "A pragmatic coalition of settled ports, navigators, and survey courts.",
        visibility: "players"
      },
      {
        id: "veil-freeholds",
        name: "Veil Freeholds",
        color: "#ffd166",
        description: "Independent habitats that trade favors, salvage, and silence.",
        visibility: "players"
      },
      {
        id: "helios-compact",
        name: "Helios Compact",
        color: "#7dffbd",
        description: "Corporate science enclaves with pristine ships and carefully redacted manifests.",
        visibility: "players"
      },
      {
        id: "blackline",
        name: "Blackline Directorate",
        color: "#ff5c7a",
        description: "A classified interdiction authority known only to the GM.",
        visibility: "gm"
      }
    ],
    systems: [
      {
        id: "crown-of-aster",
        name: "Crown of Aster",
        x: 22,
        y: 42,
        type: "core",
        factionId: "aster-accord",
        status: "visited",
        description: "The administrative heart of the region, ringed by pearlescent habitats and courier traffic.",
        image: "",
        sceneId: "",
        journalId: "",
        visibility: "players",
        iconColor: "#58d8ff",
        iconSize: 36,
        iconStyle: "ringed",
        pulse: true,
        notes: "Use for command briefings, political bargaining, and refit scenes."
      },
      {
        id: "vesper-anchorage",
        name: "Vesper Anchorage",
        x: 43,
        y: 56,
        type: "station",
        factionId: "veil-freeholds",
        status: "known",
        description: "A freehold station built through the ribs of a derelict ark, bright with docking strobes.",
        image: "",
        sceneId: "",
        journalId: "",
        visibility: "players",
        iconColor: "#ffd166",
        iconSize: 32,
        iconStyle: "diamond",
        pulse: true,
        notes: "Neutral ground. Everyone is listening, especially the people who say they are not."
      },
      {
        id: "greenward",
        name: "Greenward",
        x: 57,
        y: 29,
        type: "colony",
        factionId: "helios-compact",
        status: "known",
        description: "A garden colony under mirrored weather shields, famed for bio-reactor exports.",
        image: "",
        sceneId: "",
        journalId: "",
        visibility: "players",
        iconColor: "#7dffbd",
        iconSize: 34,
        iconStyle: "planet",
        pulse: true,
        notes: "Great place to hide experimental contamination under corporate hospitality."
      },
      {
        id: "kestral-gate",
        name: "Kestral Gate",
        x: 72,
        y: 49,
        type: "frontier",
        factionId: "veil-freeholds",
        status: "danger",
        description: "A ragged frontier transit cluster where beacon data often arrives late or wrong.",
        image: "",
        sceneId: "",
        journalId: "",
        visibility: "players",
        iconColor: "#ffd166",
        iconSize: 30,
        iconStyle: "planet",
        pulse: true,
        notes: "Escalate encounters here when the crew thinks they are nearly safe."
      },
      {
        id: "red-wake",
        name: "Red Wake",
        x: 77,
        y: 24,
        type: "restricted",
        factionId: "blackline",
        status: "locked",
        description: "A classified interdiction zone wrapped in military silence.",
        image: "",
        sceneId: "",
        journalId: "",
        visibility: "gm",
        iconColor: "#ff5c7a",
        iconSize: 34,
        iconStyle: "void",
        pulse: true,
        notes: "Reveal after the convoy ambush. Route access implies someone inside helped."
      },
      {
        id: "echo-vault",
        name: "Echo Vault",
        x: 66,
        y: 74,
        type: "unknown",
        factionId: "",
        status: "undiscovered",
        description: "A dormant megastructure fragment broadcasting low-frequency mathematical noise.",
        image: "",
        sceneId: "",
        journalId: "",
        visibility: "players",
        iconColor: "#b48cff",
        iconSize: 38,
        iconStyle: "star",
        pulse: true,
        notes: "Players initially see ???. Discovery should feel like the map itself wakes up."
      },
      {
        id: "saltglass-ruins",
        name: "Saltglass Ruins",
        x: 31,
        y: 72,
        type: "ruins",
        factionId: "",
        status: "undiscovered",
        description: "Shattered cities below reflective storm clouds, visible only between static surges.",
        image: "",
        sceneId: "",
        journalId: "",
        visibility: "gm",
        iconColor: "#9fb7c6",
        iconSize: 31,
        iconStyle: "diamond",
        pulse: false,
        notes: "Optional side mystery. Good place for a recovered archive or lost distress call."
      }
    ],
    routes: [
      {
        id: "route-crown-vesper",
        fromSystemId: "crown-of-aster",
        toSystemId: "vesper-anchorage",
        type: "safe",
        travelTime: "18 hours",
        fuelCost: 1,
        visibility: "players",
        notes: "Patrolled, busy, and easy to track."
      },
      {
        id: "route-vesper-greenward",
        fromSystemId: "vesper-anchorage",
        toSystemId: "greenward",
        type: "safe",
        travelTime: "22 hours",
        fuelCost: 1,
        visibility: "players",
        notes: "Commercial lane with reliable nav buoys."
      },
      {
        id: "route-greenward-kestral",
        fromSystemId: "greenward",
        toSystemId: "kestral-gate",
        type: "dangerous",
        travelTime: "31 hours",
        fuelCost: 2,
        visibility: "players",
        notes: "Radiation shear and pirate spoofing both complicate travel."
      },
      {
        id: "route-vesper-echo",
        fromSystemId: "vesper-anchorage",
        toSystemId: "echo-vault",
        type: "unknown",
        travelTime: "Unknown",
        fuelCost: 0,
        visibility: "players",
        notes: "Sensor ghost only until the system is discovered."
      },
      {
        id: "route-kestral-redwake",
        fromSystemId: "kestral-gate",
        toSystemId: "red-wake",
        type: "restricted",
        travelTime: "7 hours",
        fuelCost: 2,
        visibility: "gm",
        notes: "Hidden military corridor. Revealing it changes the campaign board."
      },
      {
        id: "route-vesper-saltglass",
        fromSystemId: "vesper-anchorage",
        toSystemId: "saltglass-ruins",
        type: "smuggler",
        travelTime: "14 hours",
        fuelCost: 2,
        visibility: "gm",
        notes: "Known by salvors, denied by everyone official."
      }
    ]
  };

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

  function randomId(prefix = "gmf") {
    return `${prefix}-${foundry.utils.randomID(10)}`;
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

  function normalizeVisibility(value, fallback = "players") {
    const safeFallback = VISIBILITIES.includes(fallback) ? fallback : "players";
    return VISIBILITIES.includes(value) ? value : safeFallback;
  }

  function normalizeColor(value) {
    return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : "#58d8ff";
  }

  function normalizeOptionalColor(value) {
    return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : "";
  }

  function normalizeNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function slugify(value) {
    return String(value || "galaxy-map")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "galaxy-map";
  }

  function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
  }

  function optionList(options, selected) {
    return options.map((option) => {
      const value = typeof option === "string" ? option : option.value;
      const label = typeof option === "string" ? option : option.label;
      return `<option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(label)}</option>`;
    }).join("");
  }

  function documentOptions(collection, selectedId) {
    const documents = collection?.contents ?? [];
    return [
      { value: "", label: "None" },
      ...documents.map((doc) => ({ value: doc.id, label: doc.name }))
    ].map((option) => `<option value="${escapeHtml(option.value)}" ${option.value === selectedId ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("");
  }

  function getHtmlElement(html) {
    return html?.[0] ?? html;
  }

  function getFormValues(html) {
    const element = getHtmlElement(html);
    const form = element?.matches?.("form") ? element : element?.querySelector("form");
    return Object.fromEntries(new FormData(form).entries());
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

  function normalizeSystem(system = {}) {
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

  function normalizeRoute(route = {}) {
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

  function normalizeFaction(faction = {}) {
    return {
      id: String(faction.id || randomId("faction")),
      name: String(faction.name || "Unaffiliated"),
      color: normalizeColor(faction.color),
      description: String(faction.description || ""),
      visibility: normalizeVisibility(faction.visibility, "players")
    };
  }

  function normalizeMap(map = {}) {
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

  function getRawMap(mapId) {
    const maps = getMapStore();
    return maps[mapId] ? clone(maps[mapId]) : null;
  }

  function getFactionLookup(factions) {
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

  async function updateMapMetadata(mapId, metadata = {}) {
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
    if (managerApp?.rendered) managerApp.render({ force: true });
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

  async function installSampleMap() {
    if (!requireGM("install sample maps")) return null;
    const maps = getMapStore();
    const sample = normalizeMap(SAMPLE_MAP);
    maps[sample.id] = sample;
    await saveMapStore(maps);
    refreshOpenApps(sample.id);
    notifyInfo("Sample galaxy map installed.");
    return clone(sample);
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

  function getRouteDialogContent(mapId, route = {}, defaults = {}) {
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
    const systemsById = new Map(normalized.systems.map((system) => [system.id, system]));
    const factionsById = new Map(normalized.factions.map((faction) => [faction.id, faction]));
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
    pendingTravelRequests.set(payload.requestId, {
      ...payload,
      accepted: new Set(),
      voterIds: [...new Set(payload.voterIds ?? [])]
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

  async function approveTravelRequest(pending) {
    pendingTravelRequests.delete(pending.requestId);
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
    animateTravelOnOpenMaps(payload);
    ui.notifications?.info(`Travel approved: ${payload.fromName} to ${payload.toName}.`);
  }

  function handleTravelDeclined(payload) {
    if (payload.coordinatorId === game.user?.id) return;
    ui.notifications?.warn(`Travel declined by ${payload.voterName}: ${payload.fromName} to ${payload.toName}.`);
  }

  function closeOpenMap(mapId) {
    const app = openMaps.get(mapId);
    if (app) app.close();
    if (playerMapApp?.mapId === mapId) playerMapApp.close();
  }

  function openMap(mapId, options = {}) {
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
      onChange: openGalaxyMapFromSceneControls
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

  function getApplicationBase() {
    const ApplicationV2 = foundry.applications?.api?.ApplicationV2;
    const HandlebarsApplicationMixin = foundry.applications?.api?.HandlebarsApplicationMixin;
    if (ApplicationV2 && HandlebarsApplicationMixin) return HandlebarsApplicationMixin(ApplicationV2);
    return Application;
  }

  class GalaxyMapManager extends getApplicationBase() {
    static DEFAULT_OPTIONS = {
      id: "galaxy-map-manager",
      classes: ["galaxy-map", "gmf-manager-window"],
      window: {
        title: "Galaxy Map Manager",
        icon: "fa-solid fa-satellite"
      },
      position: {
        width: 980,
        height: 720
      }
    };

    static PARTS = {
      main: {
        template: `${TEMPLATE_ROOT}/map-manager.hbs`
      }
    };

    constructor(options = {}) {
      super(options);
      this.selectedMapId = options.selectedMapId ?? null;
      this.jsonDraft = "";
    }

    async _prepareContext(options) {
      const context = await super._prepareContext?.(options) ?? {};
      const maps = getMaps().sort((a, b) => a.title.localeCompare(b.title));
      if (!this.selectedMapId || !maps.some((map) => map.id === this.selectedMapId)) {
        this.selectedMapId = maps[0]?.id ?? null;
      }
      const selectedMap = this.selectedMapId ? prepareMapForManager(getRawMap(this.selectedMapId)) : null;
      return {
        ...context,
        maps,
        selectedMap,
        selectedMapId: this.selectedMapId,
        hasMaps: maps.length > 0,
        sampleInstalled: Boolean(getRawMap(SAMPLE_MAP.id))
      };
    }

    _attachPartListeners(partId, html, options) {
      super._attachPartListeners?.(partId, html, options);
      html.querySelector("[data-action='create-map']")?.addEventListener("click", () => this._onCreateMap());
      html.querySelector("[data-action='edit-map-metadata']")?.addEventListener("click", () => {
        if (this.selectedMapId) openMapMetadataDialog(this.selectedMapId);
      });
      html.querySelector("[data-action='create-system']")?.addEventListener("click", () => {
        if (this.selectedMapId) openSystemDialog(this.selectedMapId);
      });
      html.querySelector("[data-action='create-route']")?.addEventListener("click", () => {
        if (this.selectedMapId) openRouteDialog(this.selectedMapId);
      });
      html.querySelector("[data-action='create-faction']")?.addEventListener("click", () => {
        if (this.selectedMapId) openFactionDialog(this.selectedMapId);
      });
      html.querySelectorAll("[data-edit-system]").forEach((button) => {
        button.addEventListener("click", () => openSystemDialog(this.selectedMapId, button.dataset.editSystem));
      });
      html.querySelectorAll("[data-delete-system]").forEach((button) => {
        button.addEventListener("click", () => this._confirmDeleteSystem(button.dataset.deleteSystem));
      });
      html.querySelectorAll("[data-edit-route]").forEach((button) => {
        button.addEventListener("click", () => openRouteDialog(this.selectedMapId, button.dataset.editRoute));
      });
      html.querySelectorAll("[data-delete-route]").forEach((button) => {
        button.addEventListener("click", () => this._confirmDeleteRoute(button.dataset.deleteRoute));
      });
      html.querySelectorAll("[data-edit-faction]").forEach((button) => {
        button.addEventListener("click", () => openFactionDialog(this.selectedMapId, button.dataset.editFaction));
      });
      html.querySelectorAll("[data-delete-faction]").forEach((button) => {
        button.addEventListener("click", () => this._confirmDeleteFaction(button.dataset.deleteFaction));
      });
      html.querySelector("[data-action='install-sample']")?.addEventListener("click", async () => {
        const map = await installSampleMap();
        if (map) {
          this.selectedMapId = map.id;
          this.jsonDraft = "";
          this.render({ force: true });
        }
      });
      html.querySelector("[data-action='export-map']")?.addEventListener("click", () => {
        if (this.selectedMapId) exportMap(this.selectedMapId);
      });
      html.querySelector("[data-action='import-map']")?.addEventListener("click", () => {
        html.querySelector("[name='map-import']")?.click();
      });
      html.querySelector("[name='map-import']")?.addEventListener("change", (event) => this._onImportFile(event));
      html.querySelectorAll("[data-select-map]").forEach((button) => {
        button.addEventListener("click", () => {
          this.selectedMapId = button.dataset.selectMap;
          this.jsonDraft = "";
          this.render({ force: true });
        });
      });
      html.querySelectorAll("[data-open-map]").forEach((button) => {
        button.addEventListener("click", () => game.galaxyMap.openMap(button.dataset.openMap));
      });
      html.querySelectorAll("[data-show-map]").forEach((button) => {
        button.addEventListener("click", () => game.galaxyMap.showMapToPlayers(button.dataset.showMap));
      });
      html.querySelectorAll("[data-duplicate-map]").forEach((button) => {
        button.addEventListener("click", async () => {
          const map = await duplicateMap(button.dataset.duplicateMap);
          if (map) {
            this.selectedMapId = map.id;
            this.jsonDraft = "";
            this.render({ force: true });
          }
        });
      });
      html.querySelectorAll("[data-delete-map]").forEach((button) => {
        button.addEventListener("click", async () => {
          const mapId = button.dataset.deleteMap;
          const map = getRawMap(mapId);
          const confirmed = await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${map?.title ?? mapId}</strong>? This cannot be undone.</p>`
          });
          if (!confirmed) return;
          await deleteMap(mapId);
          if (this.selectedMapId === mapId) this.selectedMapId = null;
          this.jsonDraft = "";
          this.render({ force: true });
        });
      });
      html.querySelector("[data-action='close-player-map']")?.addEventListener("click", () => game.galaxyMap.closePlayerMap());
    }

    async _onCreateMap() {
      const map = await createMap({
        title: "New Galaxy Map",
        subtitle: "Uncharted theatre",
        description: "A campaign-scale navigation map.",
        visibility: "players",
        factions: [
          {
            id: "independent",
            name: "Independent",
            color: "#58d8ff",
            description: "Unaffiliated worlds and stations.",
            visibility: "players"
          }
        ],
        systems: [],
        routes: []
      });
      if (map) {
        this.selectedMapId = map.id;
        this.jsonDraft = "";
        this.render({ force: true });
      }
    }

    async _onImportFile(event) {
      const file = event.currentTarget.files?.[0];
      event.currentTarget.value = "";
      if (!file) return;

      let parsed;
      try {
        parsed = JSON.parse(await file.text());
      } catch (error) {
        notifyError(`Import failed: ${error.message}`);
        return;
      }

      const imported = await importMapData(parsed);
      if (imported) {
        this.selectedMapId = imported.id;
        this.jsonDraft = "";
        this.render({ force: true });
      }
    }

    async _confirmDeleteSystem(systemId) {
      const confirmed = await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      });
      if (confirmed) await deleteSystem(this.selectedMapId, systemId);
    }

    async _confirmDeleteRoute(routeId) {
      const confirmed = await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      });
      if (confirmed) await deleteRoute(this.selectedMapId, routeId);
    }

    async _confirmDeleteFaction(factionId) {
      const confirmed = await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      });
      if (confirmed) await deleteFaction(this.selectedMapId, factionId);
    }
  }

  class GalaxyMapView extends getApplicationBase() {
    static DEFAULT_OPTIONS = {
      id: "galaxy-map-view",
      classes: ["galaxy-map", "gmf-map-window"],
      window: {
        title: "Galaxy Map",
        icon: "fa-solid fa-meteor",
        resizable: true
      },
      resizable: true,
      position: {
        width: 1120,
        height: 760
      }
    };

    static PARTS = {
      main: {
        template: `${TEMPLATE_ROOT}/galaxy-map.hbs`
      }
    };

    constructor(options = {}) {
      const mapId = options.mapId;
      const playerMode = options.playerMode ?? !game.user?.isGM;
      super({
        ...options,
        id: `galaxy-map-view-${playerMode ? "player" : "gm"}-${mapId}`
      });
      this.mapId = mapId;
      this.playerMode = playerMode;
      this.selectedSystemId = options.selectedSystemId ?? null;
      this.selectedRouteId = options.selectedRouteId ?? null;
      this.zoom = 1;
      this.panX = 0;
      this.panY = 0;
      this._drag = null;
      this._contextTarget = null;
      this._boundContextClose = null;
    }

    get title() {
      const map = getRawMap(this.mapId);
      const suffix = this.playerMode ? "Player View" : "GM View";
      return map ? `${map.title} - ${suffix}` : `Galaxy Map - ${suffix}`;
    }

    async _prepareContext(options) {
      const context = await super._prepareContext?.(options) ?? {};
      const rawMap = getRawMap(this.mapId);
      const displayMap = rawMap ? prepareMapForDisplay(rawMap, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      }) : null;
      if (displayMap?.selectedSystem) this.selectedSystemId = displayMap.selectedSystem.id;
      return {
        ...context,
        map: displayMap,
        mapId: this.mapId,
        playerMode: this.playerMode,
        zoomPercent: Math.round(this.zoom * 100),
        panX: this.panX,
        panY: this.panY,
        zoom: this.zoom,
        missingMap: !rawMap
      };
    }

    _onRender(context, options) {
      super._onRender?.(context, options);
      const html = this.element instanceof HTMLElement ? this.element : this.element?.[0];
      if (html) this._attachPartListeners("main", html, options);
    }

    _attachPartListeners(partId, html, options) {
      const boundStage = html.matches?.(".gmf-map-stage") ? html : html.querySelector?.(".gmf-map-stage");
      if (boundStage?.dataset.gmfMapBound === "true") return;
      if (boundStage) boundStage.dataset.gmfMapBound = "true";
      super._attachPartListeners?.(partId, html, options);
      this._applyViewportTransform(html);

      html.querySelectorAll("[data-system-id]").forEach((node) => {
        node.addEventListener("click", (event) => {
          if (node.dataset.dragged === "true") {
            node.dataset.dragged = "false";
            return;
          }
          event.stopPropagation();
          this.selectedSystemId = node.dataset.systemId;
          this.selectedRouteId = null;
          this.render({ force: true });
        });
        if (!this.playerMode && game.user?.isGM) {
          node.addEventListener("pointerdown", (event) => this._startSystemDrag(event, html, node));
        }
      });
      html.querySelectorAll("[data-route-id]").forEach((route) => {
        route.addEventListener("click", (event) => {
          event.stopPropagation();
          this.selectedRouteId = route.dataset.routeId;
          this.selectedSystemId = null;
          this.render({ force: true });
        });
      });
      const stage = html.querySelector(".gmf-map-stage");
      stage?.addEventListener("wheel", (event) => this._onWheelZoom(event, html), { passive: false });
      stage?.addEventListener("pointerdown", (event) => this._startPan(event, html));
      stage?.addEventListener("contextmenu", (event) => this._openContextMenu(event, html), { capture: true });
      html.querySelectorAll("[data-context-action]").forEach((button) => {
        button.addEventListener("click", (event) => this._handleContextAction(event, html));
      });
      html.querySelector("[data-action='open-map-menu']")?.addEventListener("click", (event) => this._openStageMenuFromButton(event, html));
      html.querySelector("[data-action='zoom-in']")?.addEventListener("click", () => this._setZoom(this.zoom + 0.15, html));
      html.querySelector("[data-action='zoom-out']")?.addEventListener("click", () => this._setZoom(this.zoom - 0.15, html));
      html.querySelector("[data-action='reset-view']")?.addEventListener("click", () => {
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this._applyViewportTransform(html);
      });
      html.querySelector("[data-action='open-scene']")?.addEventListener("click", () => this._openLinkedScene());
      html.querySelector("[data-action='open-journal']")?.addEventListener("click", () => this._openLinkedJournal());
      html.querySelector("[data-action='edit-system']")?.addEventListener("click", () => {
        if (this.selectedSystemId) openSystemDialog(this.mapId, this.selectedSystemId);
      });
      html.querySelector("[data-action='reveal-system']")?.addEventListener("click", () => {
        if (this.selectedSystemId) revealSystemToPlayers(this.mapId, this.selectedSystemId);
      });
      html.querySelector("[data-action='delete-system']")?.addEventListener("click", () => {
        if (this.selectedSystemId) this._confirmDeleteSystem(this.selectedSystemId);
      });
      html.querySelector("[data-action='set-current-system']")?.addEventListener("click", () => {
        if (this.selectedSystemId) setCurrentSystem(this.mapId, this.selectedSystemId);
      });
      html.querySelector("[data-action='travel-to-system']")?.addEventListener("click", () => {
        if (!this.selectedSystemId) return;
        if (this.playerMode) requestTravelToSystem(this.mapId, this.selectedSystemId);
        else this._travelToSystem(this.selectedSystemId, html);
      });
      html.querySelector("[data-action='edit-route']")?.addEventListener("click", () => {
        if (this.selectedRouteId) openRouteDialog(this.mapId, this.selectedRouteId);
      });
      html.querySelector("[data-action='reveal-route']")?.addEventListener("click", () => {
        if (this.selectedRouteId) revealRouteToPlayers(this.mapId, this.selectedRouteId);
      });
      html.querySelector("[data-action='delete-route']")?.addEventListener("click", () => {
        if (this.selectedRouteId) this._confirmDeleteRoute(this.selectedRouteId);
      });
      html.querySelector("[data-action='notify-discovery']")?.addEventListener("click", () => {
        if (this.selectedSystemId) notifySystemDiscovered(this.mapId, this.selectedSystemId);
      });
      html.querySelector("[data-action='show-to-players']")?.addEventListener("click", () => game.galaxyMap.showMapToPlayers(this.mapId));
      html.querySelector("[data-action='edit-map']")?.addEventListener("click", () => {
        const manager = game.galaxyMap.openMapManager();
        if (manager) {
          manager.selectedMapId = this.mapId;
          manager.render({ force: true });
        }
      });
    }

    _applyViewportTransform(html) {
      const viewport = html.querySelector(".gmf-map-viewport");
      if (!viewport) return;
      viewport.style.setProperty("--gmf-pan-x", `${this.panX}px`);
      viewport.style.setProperty("--gmf-pan-y", `${this.panY}px`);
      viewport.style.setProperty("--gmf-zoom", String(this.zoom));
      html.querySelector("[data-zoom-label]")?.replaceChildren(`${Math.round(this.zoom * 100)}%`);
    }

    _setZoom(value, html) {
      this.zoom = clamp(value, MIN_ZOOM, MAX_ZOOM);
      this._applyViewportTransform(html);
    }

    _onWheelZoom(event, html) {
      event.preventDefault();
      const stage = html.querySelector(".gmf-map-stage");
      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      const oldZoom = this.zoom;
      const nextZoom = clamp(oldZoom + (event.deltaY < 0 ? 0.12 : -0.12), MIN_ZOOM, MAX_ZOOM);
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;
      const worldX = (pointerX - this.panX) / oldZoom;
      const worldY = (pointerY - this.panY) / oldZoom;

      this.zoom = nextZoom;
      this.panX = pointerX - worldX * nextZoom;
      this.panY = pointerY - worldY * nextZoom;
      this._applyViewportTransform(html);
    }

    _startPan(event, html) {
      if (event.button !== 0) return;
      if (event.target.closest("[data-system-id], [data-route-id], button")) return;
      event.preventDefault();
      const startX = event.clientX;
      const startY = event.clientY;
      const originX = this.panX;
      const originY = this.panY;

      const onMove = (moveEvent) => {
        this.panX = originX + moveEvent.clientX - startX;
        this.panY = originY + moveEvent.clientY - startY;
        this._applyViewportTransform(html);
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, { once: true });
    }

    _startSystemDrag(event, html, node) {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      node.setPointerCapture?.(event.pointerId);

      const startX = event.clientX;
      const startY = event.clientY;
      let latest = this._pointerToMapPercent(event, html);
      let moved = false;
      let frame = null;
      const connectedFrom = Array.from(html.querySelectorAll(`[data-route-from="${node.dataset.systemId}"]`));
      const connectedTo = Array.from(html.querySelectorAll(`[data-route-to="${node.dataset.systemId}"]`));
      node.classList.add("is-dragging");

      const onMove = (moveEvent) => {
        const dx = Math.abs(moveEvent.clientX - startX);
        const dy = Math.abs(moveEvent.clientY - startY);
        moved = moved || dx > 3 || dy > 3;
        latest = this._pointerToMapPercent(moveEvent, html);
        node.dataset.dragged = moved ? "true" : "false";
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = null;
          node.style.left = `${latest.x}%`;
          node.style.top = `${latest.y}%`;
          this._updateConnectedRoutes(connectedFrom, connectedTo, latest.x, latest.y);
        });
      };

      const onUp = async () => {
        if (frame) cancelAnimationFrame(frame);
        node.style.left = `${latest.x}%`;
        node.style.top = `${latest.y}%`;
        this._updateConnectedRoutes(connectedFrom, connectedTo, latest.x, latest.y);
        node.classList.remove("is-dragging");
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        if (moved) await saveSystemPosition(this.mapId, node.dataset.systemId, latest.x, latest.y);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, { once: true });
    }

    _pointerToMapPercent(event, html) {
      const stage = html.querySelector(".gmf-map-stage");
      const rect = stage.getBoundingClientRect();
      return {
        x: clamp(((event.clientX - rect.left - this.panX) / this.zoom / rect.width) * 100, 0, 100),
        y: clamp(((event.clientY - rect.top - this.panY) / this.zoom / rect.height) * 100, 0, 100)
      };
    }

    _updateConnectedRoutes(connectedFrom, connectedTo, x, y) {
      connectedFrom.forEach((line) => {
        line.setAttribute("x1", x);
        line.setAttribute("y1", y);
      });
      connectedTo.forEach((line) => {
        line.setAttribute("x2", x);
        line.setAttribute("y2", y);
      });
    }

    _openContextMenu(event, html) {
      if (!game.user?.isGM || this.playerMode) return;
      if (event.target.closest(".gmf-map-toolbar, .gmf-context-menu")) return;
      event.preventDefault();
      event.stopPropagation();

      const routeTarget = event.target.closest("[data-route-id]");
      const systemTarget = event.target.closest("[data-system-id]");
      const position = this._pointerToMapPercent(event, html);
      this._contextTarget = routeTarget
        ? { type: "route", id: routeTarget.dataset.routeId, position }
        : systemTarget
          ? { type: "system", id: systemTarget.dataset.systemId, position }
          : { type: "stage", id: null, position };

      const menu = html.querySelector("[data-gmf-context-menu]");
      if (!menu) return;
      menu.querySelectorAll("[data-context-show]").forEach((button) => {
        button.hidden = button.dataset.contextShow !== this._contextTarget.type;
      });
      menu.hidden = false;
      const menuWidth = menu.offsetWidth || 184;
      const menuHeight = menu.offsetHeight || 260;
      const stage = html.querySelector(".gmf-map-stage");
      const rect = stage.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const maxLeft = Math.max(4, rect.width - menuWidth - 4);
      const maxTop = Math.max(4, rect.height - menuHeight - 4);
      menu.style.left = `${clamp(localX, 4, maxLeft)}px`;
      menu.style.top = `${clamp(localY, 4, maxTop)}px`;

      if (this._boundContextClose) document.removeEventListener("click", this._boundContextClose);
      this._boundContextClose = () => this._hideContextMenu(html);
      globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: true }), 0);
    }

    _openStageMenuFromButton(event, html) {
      if (!game.user?.isGM || this.playerMode) return;
      event.preventDefault();
      event.stopPropagation();
      const stage = html.querySelector(".gmf-map-stage");
      const rect = stage?.getBoundingClientRect();
      if (!rect) return;
      const synthetic = {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
        target: stage,
        preventDefault: () => {},
        stopPropagation: () => {}
      };
      this._openContextMenu(synthetic, html);
    }

    _hideContextMenu(html = null) {
      const root = html ?? this.element ?? null;
      const menu = root?.querySelector?.("[data-gmf-context-menu]") ?? root?.[0]?.querySelector?.("[data-gmf-context-menu]");
      if (menu) menu.hidden = true;
      if (this._boundContextClose) document.removeEventListener("click", this._boundContextClose);
      this._boundContextClose = null;
    }

    async _handleContextAction(event, html) {
      event.preventDefault();
      event.stopPropagation();
      const action = event.currentTarget.dataset.contextAction;
      const target = this._contextTarget;
      this._hideContextMenu(html);
      if (!target) return;

      if (action === "add-system") {
        openSystemDialog(this.mapId, null, { x: target.position.x, y: target.position.y });
      } else if (action === "add-route") {
        openRouteDialog(this.mapId);
      } else if (action === "manage-factions") {
        openFactionManagerDialog(this.mapId);
      } else if (action === "add-faction") {
        openFactionDialog(this.mapId);
      } else if (action === "edit-map-details") {
        openMapMetadataDialog(this.mapId);
      } else if (action === "export-map") {
        exportMap(this.mapId);
      } else if (action === "edit-system") {
        openSystemDialog(this.mapId, target.id);
      } else if (action === "add-route-from-system") {
        openRouteDialog(this.mapId, null, { fromSystemId: target.id });
      } else if (action === "reveal-system") {
        await revealSystemToPlayers(this.mapId, target.id);
      } else if (action === "delete-system") {
        await this._confirmDeleteSystem(target.id);
      } else if (action === "edit-route") {
        openRouteDialog(this.mapId, target.id);
      } else if (action === "reveal-route") {
        await revealRouteToPlayers(this.mapId, target.id);
      } else if (action === "delete-route") {
        await this._confirmDeleteRoute(target.id);
      }
    }

    async _confirmDeleteSystem(systemId) {
      const confirmed = await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      });
      if (confirmed) await deleteSystem(this.mapId, systemId);
    }

    async _confirmDeleteRoute(routeId) {
      const confirmed = await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      });
      if (confirmed) await deleteRoute(this.mapId, routeId);
    }

    async _travelToSystem(destinationSystemId, html) {
      const map = normalizeMap(getRawMap(this.mapId));
      const from = map.systems.find((system) => system.id === map.currentSystemId);
      const to = map.systems.find((system) => system.id === destinationSystemId);
      if (!to) return;
      if (!from) {
        await setCurrentSystem(this.mapId, to.id);
        notifyInfo(`Current location set to ${to.name}.`);
        return;
      }
      if (from.id === to.id) {
        notifyInfo(`${to.name} is already the current location.`);
        return;
      }

      const route = getTravelRoute(map, from.id, to.id);
      if (!route) {
        notifyError(`No direct route from ${from.name} to ${to.name}.`);
        return;
      }

      await this._animateShipTravel(from, to, html);
      await setCurrentSystem(this.mapId, to.id);
      notifyInfo(`Arrived at ${to.name}.`);
    }

    _animateShipTravel(from, to, html) {
      const layer = html.querySelector("[data-ship-layer]");
      const stage = html.querySelector(".gmf-map-stage");
      if (!layer || !stage) return Promise.resolve();

      const rect = stage.getBoundingClientRect();
      const dx = (to.x - from.x) * rect.width / 100;
      const dy = (to.y - from.y) * rect.height / 100;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const ship = document.createElement("div");
      ship.className = "gmf-travel-ship";
      ship.innerHTML = '<i class="fa-solid fa-rocket"></i>';
      ship.style.left = `${from.x}%`;
      ship.style.top = `${from.y}%`;
      ship.style.setProperty("--gmf-ship-angle", `${angle}deg`);
      layer.replaceChildren(ship);

      return new Promise((resolve) => {
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          ship.removeEventListener("transitionend", finish);
          ship.classList.add("is-arrived");
          globalThis.setTimeout(() => {
            ship.remove();
            resolve();
          }, 260);
        };
        ship.addEventListener("transitionend", finish, { once: true });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            ship.style.left = `${to.x}%`;
            ship.style.top = `${to.y}%`;
          });
        });
        globalThis.setTimeout(finish, TRAVEL_ANIMATION_MS);
      });
    }

    _openLinkedScene() {
      const system = this._getSelectedRawSystem();
      if (!system?.sceneId) return;
      const scene = game.scenes?.get(system.sceneId);
      if (!scene) {
        notifyError(`Scene "${system.sceneId}" was not found.`);
        return;
      }
      scene.view();
    }

    _openLinkedJournal() {
      const system = this._getSelectedRawSystem();
      if (!system?.journalId) return;
      const journal = game.journal?.get(system.journalId);
      if (!journal) {
        notifyError(`Journal "${system.journalId}" was not found.`);
        return;
      }
      journal.sheet?.render(true);
    }

    _getSelectedRawSystem() {
      const map = getRawMap(this.mapId);
      return map?.systems?.find((system) => system.id === this.selectedSystemId) ?? null;
    }

    async close(options = {}) {
      this._hideContextMenu();
      if (this.playerMode && playerMapApp === this) playerMapApp = null;
      for (const [key, app] of openMaps.entries()) {
        if (app === this) openMaps.delete(key);
      }
      return super.close(options);
    }
  }

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
      notifySystemDiscovered,
      requestTravelToSystem,
      importMapData,
      exportMap,
      installSampleMap
    };
    const module = game.modules.get(MODULE_ID);
    if (module) module.api = game.galaxyMap;
    registerWithHoloSuite();

    game.socket.on(SOCKET_NAME, (payload = {}) => {
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

