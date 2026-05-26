// @ts-nocheck
import {
  COLOR_OPTIONS,
  DEFAULT_MODE,
  DEFAULT_SHAPE,
  DEFAULT_TYPE,
  MODE_META,
  REGION_SHAPES,
  SCANNER_MODES,
  TARGET_STATUSES,
  TARGET_TYPES,
  TYPE_META,
  VISIBILITY_MODES,
  clamp,
  getColorOptions as getModelColorOptions,
  getTargetScanRadius as getModelTargetScanRadius,
  inferModeForType as inferModelModeForType,
  labelize,
  normalizeColor as normalizeModelColor,
  normalizeModeFilter as normalizeModelModeFilter,
  normalizeTarget as normalizeModelTarget,
  normalizeTypeFilter as normalizeModelTypeFilter,
  sanitizeTargetForPulse as sanitizeModelTargetForPulse,
  targetMatchesScan as modelTargetMatchesScan,
  targetVisibleToPlayer,
  toNumber
} from "./target-model";
import {
  getResizeCursor as getMarkerResizeCursor,
  getResizeHandlePositions,
  getResizeUpdates,
  isPointNearTarget
} from "./marker-geometry";

(() => {
  "use strict";

  const MODULE_ID = "pulse-scanner";
  const MODULE_TITLE = "Pulse Scanner";
  const SOCKET_NAME = `module.${MODULE_ID}`;
  const TEMPLATE_ROOT = `modules/${MODULE_ID}/templates`;
  const TARGET_FLAG = "targets";
  const SCANNER_ITEM_FLAG = "isPulseScanner";
  const SCANNER_ITEM_NAME = "Pulse Scanner";
  const SCANNER_ITEM_IMAGE = "icons/tools/scribal/magnifying-glass.webp";
  const state = {
    manager: null,
    lastMouseScenePosition: null,
    mouseTrackingCanvas: null,
    placementActive: false,
    placementShape: DEFAULT_SHAPE,
    markerLayer: null,
    markerSceneId: null,
    draggingMarker: null,
    resizingMarker: null,
    liveMarker: null,
    liveUpdates: null,
    latestScan: null,
    sheetObserver: null,
    sheetEnhanceTimeout: null
  };

  const LegacyApplication = globalThis.Application ?? foundry.appv1?.api?.Application;

  Hooks.once("init", async () => {
    registerSettings();
    registerHandlebarsHelpers();
    await loadTemplates([
      `${TEMPLATE_ROOT}/target-manager.hbs`,
      `${TEMPLATE_ROOT}/target-form.hbs`
    ]);
    console.log(`${MODULE_TITLE} | Initialized`);
  });

  Hooks.once("ready", () => {
    game.pulseScanner = buildPublicApi();
    const module = game.modules.get(MODULE_ID);
    if (module) module.api = game.pulseScanner;
    registerWithHoloSuite();
    registerPlayerScannerHooks();
    ensureWorldPulseScannerItem();
    game.socket?.on(SOCKET_NAME, handleSocketMessage);
    console.log(`${MODULE_TITLE} | API available at game.pulseScanner`);
  });

  // HoloSuite Core is the suite launcher; keep this module out of the scene-control toolbar.
  Hooks.on("canvasReady", setupMouseTracking);
  Hooks.on("canvasReady", renderTargetMarkers);
  Hooks.on("updateScene", (scene, changes = {}) => {
    if (state.draggingMarker || state.resizingMarker) return;
    if (scene.id === canvas?.scene?.id && changes.flags?.[MODULE_ID]?.[TARGET_FLAG]) renderTargetMarkers();
  });

  function registerSettings() {
    game.settings.register(MODULE_ID, "defaultScanRadius", {
      name: "Default Scan Radius",
      hint: "The default pulse radius in scene pixels.",
      scope: "world",
      config: true,
      type: Number,
      default: 600
    });

    game.settings.register(MODULE_ID, "allowPlayersToScan", {
      name: "Allow Players to Scan",
      hint: "Allow non-GM users to activate scanner pulses from controlled tokens.",
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    });

    game.settings.register(MODULE_ID, "requireScannerItem", {
      name: "Require Pulse Scanner Item",
      hint: "Require players to have a Pulse Scanner item on the selected token's actor before scanning. GMs can always scan.",
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    });

    game.settings.register(MODULE_ID, "scannerItemName", {
      name: "Pulse Scanner Item Name",
      hint: "The actor item name players can use to trigger scanner pulses.",
      scope: "world",
      config: true,
      type: String,
      default: SCANNER_ITEM_NAME
    });

    game.settings.register(MODULE_ID, "scannerItemMode", {
      name: "Pulse Scanner Item Signal",
      hint: "The scanner mode used when players activate the Pulse Scanner item.",
      scope: "world",
      config: false,
      type: String,
      default: DEFAULT_MODE
    });

    game.settings.register(MODULE_ID, "scannerItemRadiusFeet", {
      name: "Pulse Scanner Item Radius",
      hint: "The Pulse Scanner item range in scene distance units, usually feet.",
      scope: "world",
      config: false,
      type: Number,
      default: 30
    });

    game.settings.register(MODULE_ID, "createWorldScannerItem", {
      name: "Create World Pulse Scanner Item",
      hint: "Create a ready-to-drag Pulse Scanner item in the world Items directory when a GM loads the world.",
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    });

    game.settings.register(MODULE_ID, "defaultHighlightDuration", {
      name: "Default Highlight Duration",
      hint: "How long detected target highlights remain visible, in milliseconds.",
      scope: "world",
      config: true,
      type: Number,
      default: 4200
    });

    game.settings.register(MODULE_ID, "showIntegrityToPlayers", {
      name: "Show Integrity to Players",
      hint: "Show integrity values on player-visible scan labels for breakable targets.",
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    });

    game.settings.register(MODULE_ID, "showLabelsToPlayers", {
      name: "Show Labels to Players",
      hint: "Show target labels to players when scan results are revealed.",
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    });

    game.settings.register(MODULE_ID, "scanSound", {
      name: "Scan Pulse Sound",
      hint: "Optional audio path played when a scanner pulse fires.",
      scope: "world",
      config: true,
      type: String,
      default: ""
    });
  }

  function registerHandlebarsHelpers() {
    Handlebars.registerHelper("psOption", (value, selected) => value === selected ? "selected" : "");
    Handlebars.registerHelper("psFallback", (value, fallback) => value || fallback);
    Handlebars.registerHelper("psEq", (left, right) => left === right);
    Handlebars.registerHelper("psTypeLabel", (type) => TYPE_META[type]?.label ?? labelize(type));
    Handlebars.registerHelper("psModeLabel", (mode) => MODE_META[mode]?.label ?? labelize(mode));
  }

  function buildPublicApi() {
    return {
      openTargetManager,
      scan,
      createTarget,
      getTargets,
      deleteTarget,
      revealTarget,
      revealLatestScan,
      hideTarget,
      resolveTarget,
      unresolveTarget,
      exportTargets,
      importTargets,
      togglePlacementTool,
      usePulseScannerItem,
      createPulseScannerItem,
      hasPulseScannerItem,
      ensureWorldPulseScannerItem,
      createWorldPulseScannerItem,
      getPulseScannerItemData
    };
  }

  function registerWithHoloSuite() {
    const holosuite = game.modules.get("holosuite-core");
    const api = holosuite?.active ? holosuite.api : null;
    if (!api?.registerApp) return false;

    api.registerApp({
      id: MODULE_ID,
      title: "Pulse Scanner",
      icon: "fa-solid fa-wave-square",
      premium: false,
      featureId: MODULE_ID,
      playerVisible: false,
      description: "Scan scenes, reveal targets, and manage sensor signatures.",
      open: () => game.user?.isGM ? openTargetManager() : scan()
    });
    return true;
  }

  function registerPlayerScannerHooks() {
    Hooks.on("renderTokenHUD", injectTokenHudScannerAction);
    Hooks.on("getItemSheetHeaderButtons", injectPulseScannerItemHeaderButton);
    Hooks.on("renderItemSheet", injectPulseScannerItemSheetButton);
    Hooks.on("renderItemSheetV2", injectPulseScannerItemSheetButton);
    Hooks.on("renderApplication", schedulePulseScannerSheetEnhancement);
    Hooks.on("renderApplicationV2", schedulePulseScannerSheetEnhancement);
    setupPulseScannerSheetObserver();
  }

  function injectTokenHudScannerAction(app, html) {
    if (!game.settings.get(MODULE_ID, "allowPlayersToScan") && !game.user?.isGM) return;

    const token = app.object?.document ? app.object : canvas.tokens?.get(app.object?.id);
    if (!token?.actor) return;

    const hasItem = Boolean(getPulseScannerItemForToken(token));
    if (!hasItem) return;

    const icon = $(`<div class="control-icon pulse-scanner-token-control" title="Use Pulse Scanner" data-action="pulse-scanner-scan"><i class="fa-solid fa-wave-square"></i></div>`);

    icon.on("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      usePulseScannerItem({ tokenId: token.id ?? token.document?.id }).catch((error) => console.error(`${MODULE_TITLE} | Item scan failed`, error));
    });

    const root = html instanceof jQuery ? html : $(html);
    const rightColumn = root.find(".col.right, .right").first();
    if (rightColumn.length) rightColumn.append(icon);
    else root.append(icon);
  }

  function injectPulseScannerItemHeaderButton(app, buttons) {
    const item = getItemFromSheet(app);
    if (!isPulseScannerItem(item)) return;
    if (buttons.some((button) => button.class === "pulse-scanner-use-item")) return;
    buttons.unshift({
      label: "Scan",
      class: "pulse-scanner-use-item",
      icon: "fas fa-wave-square",
      onclick: () => usePulseScannerItem({ item }).catch((error) => console.error(`${MODULE_TITLE} | Item scan failed`, error))
    });
  }

  function injectPulseScannerItemSheetButton(app, html) {
    const item = getItemFromSheet(app);
    if (!isPulseScannerItem(item)) return;

    const root = getSheetRoot(html);
    if (!root) return;
    insertPulseScannerItemButton(root, item);
  }

  function insertPulseScannerItemButton(root, item) {
    if (!root || root.querySelector(".pulse-scanner-item-use")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "pulse-scanner-item-use";
    button.innerHTML = `<i class="fa-solid fa-wave-square"></i> Use Pulse Scanner`;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      usePulseScannerItem({ item }).catch((error) => console.error(`${MODULE_TITLE} | Item scan failed`, error));
    });

    const content = root.querySelector(".window-content") ?? root;
    const sheetHeader = content.querySelector(".sheet-header, header.sheet-header, .item-header");
    if (sheetHeader?.parentElement) sheetHeader.parentElement.insertBefore(button, sheetHeader.nextSibling);
    else content.prepend(button);
  }

  function getItemFromSheet(app) {
    const candidate = app?.object ?? app?.document ?? app?.item ?? null;
    if (candidate?.documentName === "Item") return candidate;
    if (candidate?.constructor?.documentName === "Item") return candidate;
    return null;
  }

  function getSheetRoot(html) {
    if (!html) return null;
    if (html instanceof HTMLElement) return html;
    if (Array.isArray(html)) return html.find((element) => element instanceof HTMLElement) ?? null;
    if (html[0] instanceof HTMLElement) return html[0];
    return null;
  }

  function schedulePulseScannerSheetEnhancement() {
    window.clearTimeout(state.sheetEnhanceTimeout);
    state.sheetEnhanceTimeout = window.setTimeout(enhanceOpenPulseScannerSheets, 40);
  }

  function setupPulseScannerSheetObserver() {
    if (state.sheetObserver || !document.body) return;
    state.sheetObserver = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.addedNodes.length)) schedulePulseScannerSheetEnhancement();
    });
    state.sheetObserver.observe(document.body, { childList: true, subtree: true });
    schedulePulseScannerSheetEnhancement();
  }

  function enhanceOpenPulseScannerSheets() {
    for (const app of getOpenApplications()) {
      const item = getItemFromSheet(app);
      if (!isPulseScannerItem(item)) continue;
      const root = getApplicationRoot(app);
      if (root) insertPulseScannerItemButton(root, item);
    }
  }

  function getOpenApplications() {
    const apps = [];
    apps.push(...Object.values(ui.windows ?? {}));
    const instances = foundry.applications?.instances;
    if (instances instanceof Map) apps.push(...instances.values());
    else if (instances && typeof instances === "object") apps.push(...Object.values(instances));
    return [...new Set(apps)].filter(Boolean);
  }

  function getApplicationRoot(app) {
    return getSheetRoot(app?.element)
      ?? getSheetRoot(app?._element)
      ?? document.querySelector(`[data-appid="${app?.appId}"]`)
      ?? document.querySelector(`[data-application-id="${app?.id}"]`)
      ?? null;
  }

  function addSceneControlsButton(controls) {
    const toolName = "pulse-scanner-open-manager";
    const placeToolName = "pulse-scanner-place-target";
    const title = game.user?.isGM ? "Pulse Scanner Targets" : "Pulse Scanner";
    const icon = "fa-solid fa-wave-square";

    if (Array.isArray(controls)) {
      const control = controls.find((candidate) => candidate.name === "token") ?? controls[0];
      if (!control?.tools) return;
      if (!control.tools.some((tool) => tool.name === toolName)) {
        control.tools.push({
          name: toolName,
          title,
          icon,
          visible: true,
          toggle: false,
          active: false,
          button: true,
          onClick: () => game.user?.isGM ? openTargetManager() : scan()
        });
      }
      if (game.user?.isGM && !control.tools.some((tool) => tool.name === placeToolName)) {
        control.tools.push({
          name: placeToolName,
          title: "Place Scan Target",
          icon: "fa-solid fa-location-crosshairs",
          visible: true,
          toggle: true,
          active: state.placementActive,
          button: true,
          onClick: togglePlacementTool
        });
      }
      return;
    }

    const control = controls.tokens ?? Object.values(controls)[0];
    if (!control?.tools) return;
    if (!control.tools[toolName]) {
      control.tools[toolName] = {
        name: toolName,
        title,
        icon,
        order: Object.keys(control.tools).length,
        button: true,
        visible: true,
        onChange: () => game.user?.isGM ? openTargetManager() : scan()
      };
    }
    if (game.user?.isGM && !control.tools[placeToolName]) {
      control.tools[placeToolName] = {
        name: placeToolName,
        title: "Place Scan Target",
        icon: "fa-solid fa-location-crosshairs",
        order: Object.keys(control.tools).length,
        toggle: true,
        active: state.placementActive,
        button: true,
        visible: true,
        onChange: togglePlacementTool
      };
    }
  }

  function togglePlacementTool(force) {
    if (!requireGM("place scan targets")) return false;
    state.placementActive = typeof force === "boolean" ? force : !state.placementActive;
    renderTargetMarkers();
    return state.placementActive;
  }

  function setPlacementShape(shape) {
    if (!requireGM("place scan targets")) return DEFAULT_SHAPE;
    state.placementShape = REGION_SHAPES.includes(shape) ? shape : DEFAULT_SHAPE;
    state.placementActive = true;
    refreshManager();
    return state.placementShape;
  }

  function openTargetManager() {
    if (!game.user?.isGM) {
      console.warn(`${MODULE_TITLE}: only GMs can manage scan targets.`);
      return null;
    }

    if (!state.manager) state.manager = new PulseTargetManager();
    state.manager.render(true);
    return state.manager;
  }

  async function scan(options = {}) {
    if (!canvas?.ready || !canvas.scene) {
      console.warn(`${MODULE_TITLE}: no active scene is ready.`);
      return [];
    }

    if (!game.user?.isGM && !game.settings.get(MODULE_ID, "allowPlayersToScan")) {
      console.warn(`${MODULE_TITLE}: players are not allowed to scan in this world.`);
      return [];
    }

    const token = resolveToken(options.tokenId);
    if (!token) {
      notifyScannerWarning("Select a token before using the Pulse Scanner.");
      return [];
    }

    if (!canTokenUseScanner(token, options)) return [];

    const radius = Number(options.radius ?? game.settings.get(MODULE_ID, "defaultScanRadius"));
    const selectedTypes = normalizeTypeFilter(options.types);
    const selectedModes = normalizeModeFilter(options.modes ?? options.mode);
    const origin = getTokenCenter(token);
    const targets = getSceneTargets(canvas.scene.id);
    const detected = targets.filter((target) => targetMatchesScan(target, origin, radius, selectedTypes, selectedModes));
    const duration = Number(options.duration ?? game.settings.get(MODULE_ID, "defaultHighlightDuration"));

    state.latestScan = {
      sceneId: canvas.scene.id,
      targetIds: detected.map((target) => target.id),
      timestamp: Date.now()
    };

    const localPayload = buildScanPayload({
      sceneId: canvas.scene.id,
      origin,
      radius,
      duration,
      detected,
      userId: game.user?.id,
      playerView: !game.user?.isGM,
      mode: selectedModes?.values().next().value ?? null
    });

    playScanSound();
    renderScanEffect(localPayload);

    if (game.user?.isGM && options.revealToPlayers) {
      const playerPayload = buildScanPayload({
        sceneId: canvas.scene.id,
        origin,
        radius,
        duration,
        detected,
        userId: game.user?.id,
        playerView: true,
        mode: selectedModes?.values().next().value ?? null
      });
      game.socket?.emit(SOCKET_NAME, { action: "scan-results", payload: playerPayload });
    }

    return game.user?.isGM
      ? foundry.utils.deepClone(detected)
      : detected.map((target) => sanitizeTargetForPulse(target, true));
  }

  async function usePulseScannerItem(options = {}) {
    const token = resolveToken(options.tokenId) ?? resolveTokenForItem(options.item);
    if (!token) {
      notifyScannerWarning("Select a token with a Pulse Scanner item.");
      return [];
    }

    const item = options.item ?? getPulseScannerItemForToken(token);
    if (!game.user?.isGM && !item && playerRequiresScannerItem(options)) {
      notifyScannerWarning("This token needs a Pulse Scanner item before it can scan.");
      return [];
    }

    const itemFlags = item?.getFlag?.(MODULE_ID, "scan") ?? {};
    const itemRadius = itemFlags.radiusFeet != null
      ? feetToScenePixels(itemFlags.radiusFeet)
      : itemFlags.radius;
    return scan({
      ...itemFlags,
      ...options,
      radius: options.radius ?? itemRadius,
      tokenId: token.id ?? token.document?.id,
      scannerItemId: item?.id ?? options.scannerItemId
    });
  }

  async function createPulseScannerItem(target, options = {}) {
    const actor = resolveActor(target);
    if (!actor?.createEmbeddedDocuments) {
      notifyScannerWarning("Select a token actor before creating a Pulse Scanner item.");
      return null;
    }

    const existing = getPulseScannerItemForActor(actor);
    if (existing && !options.duplicate) return existing;

    const itemData = {
      ...getPulseScannerItemData(options),
      system: options.system ?? getPulseScannerItemData(options).system
    };

    const [item] = await actor.createEmbeddedDocuments("Item", [itemData]);
    return item ?? null;
  }

  async function ensureWorldPulseScannerItem(options = {}) {
    if (!game.user?.isGM || !game.items) return null;
    if (!options.force && !game.settings.get(MODULE_ID, "createWorldScannerItem")) return null;

    const existing = Array.from(game.items).find((item) => isPulseScannerItem(item));
    if (existing && !options.duplicate) return existing;

    const itemData = getPulseScannerItemData(options);
    try {
      const item = await Item.create(itemData, { renderSheet: false });
      if (!options.silent) ui.notifications?.info?.(`${MODULE_TITLE}: created the Pulse Scanner item in the Items sidebar.`);
      return item;
    } catch (error) {
      console.error(`${MODULE_TITLE} | Could not create world Pulse Scanner item`, error);
      ui.notifications?.warn?.(`${MODULE_TITLE}: could not create the world item. Check the browser console for details.`);
      return null;
    }
  }

  async function createWorldPulseScannerItem(options = {}) {
    if (!game.user?.isGM || !game.items) return null;
    const itemData = getPulseScannerItemData(options);
    try {
      const item = await Item.create(itemData, { renderSheet: false });
      if (!options.silent) ui.notifications?.info?.(`${MODULE_TITLE}: created ${item.name} in the Items sidebar.`);
      return item;
    } catch (error) {
      console.error(`${MODULE_TITLE} | Could not create scanner item`, error);
      ui.notifications?.warn?.(`${MODULE_TITLE}: could not create the scanner item. Check the browser console for details.`);
      return null;
    }
  }

  function getPulseScannerItemData(options = {}) {
    const radiusFeet = toNumber(options.radiusFeet ?? game.settings.get(MODULE_ID, "scannerItemRadiusFeet"), 30);
    const mode = SCANNER_MODES.includes(options.mode) ? options.mode : getScannerItemMode();
    return {
      name: options.name || getScannerItemName(),
      type: options.type || getFallbackItemType(),
      img: options.img || SCANNER_ITEM_IMAGE,
      flags: {
        [MODULE_ID]: {
          [SCANNER_ITEM_FLAG]: true,
          scan: {
            radiusFeet,
            mode
          }
        }
      },
      system: options.system ?? {}
    };
  }

  function getScannerItemMode() {
    const mode = game.settings.get(MODULE_ID, "scannerItemMode");
    return SCANNER_MODES.includes(mode) ? mode : DEFAULT_MODE;
  }

  function feetToScenePixels(feet) {
    const distance = Number(canvas?.scene?.grid?.distance ?? canvas?.dimensions?.distance ?? 5) || 5;
    const size = Number(canvas?.grid?.size ?? canvas?.scene?.grid?.size ?? canvas?.dimensions?.size ?? 100) || 100;
    return Math.max(0, toNumber(feet, 30)) * size / distance;
  }

  function hasPulseScannerItem(target) {
    return Boolean(getPulseScannerItemForToken(resolveToken(target?.id ?? target)) ?? getPulseScannerItemForActor(resolveActor(target)));
  }

  function canTokenUseScanner(token, options = {}) {
    if (game.user?.isGM) return true;
    if (!playerRequiresScannerItem(options)) return true;
    if (getPulseScannerItemForToken(token)) return true;
    notifyScannerWarning("This token needs a Pulse Scanner item before it can scan.");
    return false;
  }

  function playerRequiresScannerItem(options = {}) {
    if (options.requireItem === false) return false;
    return Boolean(game.settings.get(MODULE_ID, "requireScannerItem"));
  }

  async function createTarget(targetData = {}) {
    if (!requireGM("create scan targets")) return null;
    const scene = getSceneById(targetData.sceneId) ?? canvas.scene;
    if (!scene) {
      console.warn(`${MODULE_TITLE}: no scene was found for the new target.`);
      return null;
    }

    const store = getTargetStore(scene);
    const target = normalizeTarget({ ...targetData, sceneId: scene.id });
    store[target.id] = target;
    await scene.setFlag(MODULE_ID, TARGET_FLAG, store);
    refreshManager();
    return foundry.utils.deepClone(target);
  }

  function getTargets(sceneId = canvas?.scene?.id) {
    return getSceneTargets(sceneId)
      .filter((target) => game.user?.isGM || targetVisibleToPlayer(target))
      .map((target) => game.user?.isGM
        ? foundry.utils.deepClone(target)
        : sanitizeTargetForPulse(target, true));
  }

  function getSceneTargets(sceneId = canvas?.scene?.id) {
    const scene = getSceneById(sceneId);
    if (!scene) return [];
    return Object.values(getTargetStore(scene))
      .map((target) => normalizeTarget(target))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  async function deleteTarget(targetId, sceneId = canvas?.scene?.id) {
    if (!requireGM("delete scan targets")) return false;
    state.draggingMarker = null;
    state.resizingMarker = null;
    state.liveMarker = null;
    state.liveUpdates = null;
    const scene = getSceneById(sceneId) ?? findSceneForTarget(targetId);
    if (!scene) {
      console.warn(`${MODULE_TITLE}: target "${targetId}" was not found.`);
      return false;
    }

    const store = getTargetStore(scene);
    const storeKey = resolveTargetStoreKey(store, targetId);
    if (!storeKey) {
      console.warn(`${MODULE_TITLE}: target "${targetId}" was not found on ${scene.name}.`);
      return false;
    }

    delete store[storeKey];
    await scene.update({ [`flags.${MODULE_ID}.${TARGET_FLAG}.-=${storeKey}`]: null });

    const afterDelete = scene.getFlag(MODULE_ID, TARGET_FLAG) ?? {};
    if (afterDelete[storeKey] || Object.values(afterDelete).some((target) => target?.id === targetId)) {
      await scene.unsetFlag(MODULE_ID, TARGET_FLAG);
      if (Object.keys(store).length) await scene.setFlag(MODULE_ID, TARGET_FLAG, store);
    }

    const afterFallback = scene.getFlag(MODULE_ID, TARGET_FLAG) ?? {};
    if (afterFallback[storeKey] || Object.values(afterFallback).some((target) => target?.id === targetId)) {
      console.error(`${MODULE_TITLE} | Delete failed`, { targetId, storeKey, scene, store, afterFallback });
      return false;
    }

    refreshManager();
    return true;
  }

  function resolveTargetStoreKey(store, targetId) {
    if (store[targetId]) return targetId;
    return Object.entries(store).find(([, target]) => target?.id === targetId)?.[0] ?? null;
  }

  async function revealTarget(targetId) {
    const target = getSceneTargets(canvas.scene?.id).find((candidate) => candidate.id === targetId);
    if (!target) return null;
    return updateTarget(targetId, { visibility: "revealed", status: target.status === "resolved" ? "resolved" : "revealed" });
  }

  async function revealLatestScan() {
    if (!requireGM("reveal scan targets")) return [];
    if (!state.latestScan || state.latestScan.sceneId !== canvas.scene?.id) {
      console.warn(`${MODULE_TITLE}: no latest scan is available for this scene.`);
      return [];
    }

    const revealed = [];
    for (const targetId of state.latestScan.targetIds) {
      const target = await revealTarget(targetId);
      if (target) revealed.push(target);
    }
    return revealed;
  }

  async function hideTarget(targetId) {
    return updateTarget(targetId, { visibility: "gm", status: "active" });
  }

  async function resolveTarget(targetId) {
    return updateTarget(targetId, { status: "resolved", visibility: "revealed" });
  }

  async function unresolveTarget(targetId) {
    return updateTarget(targetId, { status: "active", visibility: "gm" });
  }

  function exportTargets(sceneId = canvas?.scene?.id) {
    const scene = getSceneById(sceneId);
    if (!scene) return null;
    const payload = {
      module: MODULE_ID,
      version: game.modules?.get(MODULE_ID)?.version ?? "0.1.0",
      sceneId: scene.id,
      sceneName: scene.name,
      exportedAt: new Date().toISOString(),
      targets: getSceneTargets(scene.id)
    };
    downloadJson(`pulse-scanner-${slugify(scene.name)}.json`, payload);
    return payload;
  }

  async function importTargets(source, { merge = true, sceneId = canvas?.scene?.id } = {}) {
    if (!requireGM("import scan targets")) return [];
    const scene = getSceneById(sceneId);
    if (!scene) return [];

    let payload;
    try {
      payload = typeof source === "string" ? JSON.parse(source) : source;
    } catch (error) {
      console.error(`${MODULE_TITLE} | Import failed`, error);
      return [];
    }
    const importedTargets = Array.isArray(payload) ? payload : payload?.targets;
    if (!Array.isArray(importedTargets)) {
      console.warn(`${MODULE_TITLE}: import JSON must contain a targets array.`);
      return [];
    }

    const store = merge ? getTargetStore(scene) : {};
    const normalized = importedTargets.map((target) => normalizeTarget({
      ...target,
      id: target.id && !store[target.id] ? target.id : randomId(),
      sceneId: scene.id
    }));
    for (const target of normalized) store[target.id] = target;
    await scene.setFlag(MODULE_ID, TARGET_FLAG, store);
    refreshManager();
    return normalized;
  }

  async function updateTarget(targetId, updates = {}, options = {}) {
    if (!requireGM("edit scan targets")) return null;
    const scene = findSceneForTarget(targetId) ?? getSceneById(updates.sceneId) ?? canvas.scene;
    if (!scene) return null;
    const store = getTargetStore(scene);
    const existing = store[targetId] ?? {};
    const target = normalizeTarget({ ...existing, ...updates, id: targetId, sceneId: scene.id });
    store[target.id] = target;
    await scene.setFlag(MODULE_ID, TARGET_FLAG, store);
    if (options.refresh !== false) refreshManager();
    return foundry.utils.deepClone(target);
  }

  async function duplicateTarget(targetId) {
    const source = getTargets(canvas.scene?.id).find((target) => target.id === targetId);
    if (!source) return null;
    return createTarget({
      ...source,
      id: randomId(),
      label: `${source.label} Copy`,
      x: Number(source.x) + 40,
      y: Number(source.y) + 40
    });
  }

  function getTargetStore(scene) {
    return foundry.utils.deepClone(scene?.getFlag(MODULE_ID, TARGET_FLAG) ?? {});
  }

  function normalizeTarget(data = {}) {
    return normalizeModelTarget(data, {
      createId: randomId,
      sceneId: canvas?.scene?.id || ""
    });
  }

  function inferModeForType(type) {
    return inferModelModeForType(type);
  }

  function normalizeColor(value, fallback) {
    return normalizeModelColor(value, fallback);
  }

  function getColorOptions(selectedColor) {
    return getModelColorOptions(selectedColor);
  }

  function targetMatchesScan(target, origin, radius, selectedTypes, selectedModes) {
    return modelTargetMatchesScan(target, origin, radius, selectedTypes, selectedModes);
  }

  function normalizeTypeFilter(types) {
    return normalizeModelTypeFilter(types);
  }

  function normalizeModeFilter(modes) {
    return normalizeModelModeFilter(modes);
  }

  function getTargetScanRadius(target) {
    return getModelTargetScanRadius(target);
  }

  function buildScanPayload({ sceneId, origin, radius, duration, detected, userId, playerView, mode }) {
    return {
      sceneId,
      origin,
      radius,
      duration,
      userId,
      playerView,
      mode,
      showLabels: playerView ? Boolean(game.settings.get(MODULE_ID, "showLabelsToPlayers")) : true,
      showIntegrity: playerView ? Boolean(game.settings.get(MODULE_ID, "showIntegrityToPlayers")) : true,
      detected: detected.map((target) => sanitizeTargetForPulse(target, playerView))
    };
  }

  function sanitizeTargetForPulse(target, playerView) {
    return sanitizeModelTargetForPulse(target, playerView);
  }

  function renderScanEffect(payload = {}) {
    if (!canvas?.ready || payload.sceneId !== canvas.scene?.id) return;

    const overlay = document.createElement("div");
    overlay.className = "pulse-scanner-overlay";
    overlay.style.setProperty("--pulse-duration", `${Math.max(900, Number(payload.duration || 4200))}ms`);
    document.body.appendChild(overlay);

    const originPoint = sceneToClient(payload.origin?.x ?? 0, payload.origin?.y ?? 0);
    const screenRadius = Math.max(16, sceneDistanceToScreen(Number(payload.radius || 0)));

    const ring = document.createElement("div");
    ring.className = "pulse-scanner-ring";
    ring.style.left = `${originPoint.x}px`;
    ring.style.top = `${originPoint.y}px`;
    ring.style.setProperty("--pulse-radius", `${screenRadius}px`);
    ring.style.setProperty("--pulse-color", MODE_META[payload.mode]?.color ?? "#7df9ff");
    overlay.appendChild(ring);

    if (!payload.detected?.length) {
      const empty = document.createElement("div");
      empty.className = "pulse-scanner-empty";
      empty.textContent = "NO SIGNATURES DETECTED";
      empty.style.left = `${originPoint.x}px`;
      empty.style.top = `${originPoint.y}px`;
      overlay.appendChild(empty);
    }

    for (const target of payload.detected ?? []) {
      const point = sceneToClient(target.x, target.y);
      const glow = document.createElement("div");
      glow.className = `pulse-scanner-target pulse-scanner-target-${target.type}`;
      glow.style.left = `${point.x}px`;
      glow.style.top = `${point.y}px`;
      glow.style.setProperty("--target-color", target.color || TYPE_META[target.type]?.color || TYPE_META.custom.color);
      glow.style.setProperty("--target-size", `${Math.max(28, sceneDistanceToScreen(getTargetScanRadius(target) || 80) * 2)}px`);
      overlay.appendChild(glow);

      if (payload.showLabels) {
        const label = document.createElement("div");
        label.className = "pulse-scanner-label";
        label.style.left = `${point.x}px`;
        label.style.top = `${point.y}px`;
        label.style.setProperty("--target-color", target.color || TYPE_META[target.type]?.color || TYPE_META.custom.color);
        label.innerHTML = buildTargetLabelHtml(target, payload.showIntegrity);
        overlay.appendChild(label);
      }
    }

    window.setTimeout(() => overlay.remove(), Math.max(900, Number(payload.duration || 4200)) + 650);
  }

  function buildTargetLabelHtml(target, showIntegrity) {
    const icon = target.icon || TYPE_META[target.type]?.icon || TYPE_META.custom.icon;
    const safeLabel = escapeHtml(target.label || TYPE_META[target.type]?.label || "Signature");
    const safeType = escapeHtml(TYPE_META[target.type]?.label || labelize(target.type));
    const integrityValue = clamp(Number(target.integrity ?? 0), 0, 100);
    const isStructural = target.type === "breakable";
    const integrity = showIntegrity && isStructural
      ? `<span class="pulse-scanner-integrity">${integrityValue}%</span>`
      : "";
    const integrityBar = showIntegrity && isStructural
      ? `<div class="pulse-scanner-integrity-bar"><span style="width: ${integrityValue}%;"></span></div><small>STRUCTURAL WEAKNESS: ${integrityValue}%</small>`
      : `<small>${safeType}</small>`;
    return `<span class="pulse-scanner-label-row"><i class="${escapeHtml(icon)}"></i><strong>${safeLabel}</strong>${integrity}</span>${integrityBar}`;
  }

  function handleSocketMessage(message = {}) {
    if (message.action === "scan-results") {
      if (message.payload?.userId === game.user?.id) return;
      renderScanEffect(message.payload);
    }
  }

  function renderTargetMarkers() {
    if (!canvas?.ready || !canvas.scene || !globalThis.PIXI) return;

    if (state.markerLayer?.parent) state.markerLayer.parent.removeChild(state.markerLayer);
    state.markerLayer?.destroy?.({ children: true });

    const parent = canvas.interface ?? canvas.foreground ?? canvas.stage;
    if (!parent?.addChild) return;

    const layer = new PIXI.Container();
    layer.name = "pulse-scanner-target-markers";
    layer.sortableChildren = true;
    layer.zIndex = 250;
    parent.addChild(layer);
    state.markerLayer = layer;
    state.markerSceneId = canvas.scene.id;

    const targets = getSceneTargets(canvas.scene.id).filter((target) => targetShouldShowMarker(target));
    for (const target of targets) layer.addChild(createTargetMarker(target));
  }

  function targetShouldShowMarker(target) {
    if (game.user?.isGM) return true;
    return target.visibility === "revealed" || target.visibility === "always";
  }

  function createTargetMarker(target) {
    const marker = new PIXI.Container();
    marker.name = `pulse-scanner-target-${target.id}`;
    marker.position.set(Number(target.x), Number(target.y));
    marker.eventMode = "none";
    marker.interactive = false;
    marker.zIndex = target.status === "resolved" ? 1 : 5;

    const color = getTargetDisplayColor(target);
    const region = new PIXI.Graphics();
    drawMarkerRegion(region, target, color);
    marker.addChild(region);
    if (game.user?.isGM) addResizeHandles(marker, target, color);

    const moveHandle = createMoveHandle(target, color);
    if (game.user?.isGM) marker.addChild(moveHandle);

    const label = new PIXI.Text(target.status === "resolved" ? `${target.label} [resolved]` : target.label, {
      fontFamily: "Arial",
      fontSize: 13,
      fill: 0xffffff,
      stroke: 0x000000,
      strokeThickness: 3
    });
    label.anchor.set(0.5, 1);
    label.position.set(0, -Math.max(28, getTargetScanRadius(target) + 8));
    label.alpha = game.user?.isGM ? 0.95 : 0.78;
    marker.addChild(label);

    return marker;
  }

  function drawMarkerRegion(graphics, target, color) {
    const alpha = target.status === "resolved" ? 0.14 : target.visibility === "revealed" ? 0.2 : 0.1;
    graphics.clear();
    graphics.lineStyle(2, color, target.status === "resolved" ? 0.42 : 0.82);
    graphics.beginFill(color, alpha);
    if (target.shape === "rectangle") {
      graphics.drawRoundedRect(-target.width / 2, -target.height / 2, target.width, target.height, 8);
    } else {
      graphics.drawCircle(0, 0, Math.max(8, Number(target.radius || 80)));
    }
    graphics.endFill();
    graphics.lineStyle(1, color, 0.52);
    graphics.drawCircle(0, 0, 14);
  }

  function createMoveHandle(target, color) {
    const grip = new PIXI.Graphics();
    grip.name = `pulse-scanner-move-${target.id}`;
    grip.eventMode = "static";
    grip.interactive = true;
    grip.cursor = "move";
    grip.hitArea = new PIXI.Circle(0, 0, 13);
    grip.lineStyle(2, 0xffffff, 0.78);
    grip.beginFill(color, 0.82);
    grip.drawCircle(0, 0, 9);
    grip.endFill();
    grip.lineStyle(1, 0x101214, 0.9);
    grip.moveTo(-5, 0);
    grip.lineTo(5, 0);
    grip.moveTo(0, -5);
    grip.lineTo(0, 5);
    grip
      .on("pointerdown", (event) => beginMarkerDrag(event, target, grip.parent))
      .on("pointermove", (event) => dragMarker(event, target))
      .on("pointerup", () => finishMarkerDrag())
      .on("pointerupoutside", () => finishMarkerDrag())
      .on("rightclick", () => {
        state.manager = state.manager ?? new PulseTargetManager({ targetId: target.id });
        state.manager.selectedTargetId = target.id;
        state.manager.render(true);
      });
    return grip;
  }

  function addResizeHandles(marker, target, color) {
    getResizeHandlePositions(target)
      .forEach(({ handle, x, y }) => marker.addChild(createResizeHandle(target, handle, x, y, color)));
  }

  function createResizeHandle(target, handle, x, y, color) {
    const grip = new PIXI.Graphics();
    grip.name = `pulse-scanner-resize-${target.id}-${handle}`;
    grip.position.set(x, y);
    grip.eventMode = "static";
    grip.interactive = true;
    grip.cursor = getResizeCursor(handle);
    grip.hitArea = new PIXI.Circle(0, 0, 12);
    grip.beginFill(0x101214, 0.92);
    grip.lineStyle(2, color, 1);
    grip.drawCircle(0, 0, 7);
    grip.endFill();
    grip.on("pointerdown", (event) => beginMarkerResize(event, target, handle));
    return grip;
  }

  function beginMarkerResize(event, target, handle) {
    if (!game.user?.isGM) return;
    event.stopPropagation?.();
    state.resizingMarker = {
      id: target.id,
      handle,
      center: { x: Number(target.x), y: Number(target.y) }
    };
    state.liveMarker = event.currentTarget?.parent ?? null;
    state.liveUpdates = null;
  }

  function getResizeCursor(handle) {
    return getMarkerResizeCursor(handle);
  }

  function beginMarkerDrag(event, target, marker) {
    if (!game.user?.isGM) return;
    event.stopPropagation?.();
    state.draggingMarker = {
      id: target.id,
      start: getScenePointFromPixiEvent(event),
      origin: { x: Number(target.x), y: Number(target.y) }
    };
    state.liveMarker = marker ?? null;
    state.liveUpdates = null;
  }

  function dragMarker(event, target) {
    if (!state.draggingMarker || state.draggingMarker.id !== target.id) return;
    moveMarkerToScenePoint(getScenePointFromPixiEvent(event));
  }

  function getPixiLocalPosition(event, target) {
    return event.data?.getLocalPosition?.(target)
      ?? event.getLocalPosition?.(target)
      ?? new PIXI.Point(0, 0);
  }

  function getScenePointFromPixiEvent(event) {
    const original = event.data?.originalEvent;
    if (original?.clientX != null && original?.clientY != null) return clientToScene(original.clientX, original.clientY);
    const global = event.global ?? event.data?.global;
    if (!global) return null;
    try {
      const point = canvas.stage.worldTransform.applyInverse(new PIXI.Point(global.x, global.y));
      return { x: Math.round(point.x), y: Math.round(point.y) };
    } catch (error) {
      return null;
    }
  }

  async function finishMarkerDrag() {
    if (!state.draggingMarker) return false;
    const targetId = state.draggingMarker.id;
    const updates = state.liveUpdates;
    state.draggingMarker = null;
    state.liveMarker = null;
    state.liveUpdates = null;
    if (updates) await updateTarget(targetId, updates, { refresh: false });
    refreshManager();
    return true;
  }

  function moveMarkerToScenePoint(point) {
    if (!state.draggingMarker || !canvas?.scene) return false;
    if (!point || !state.draggingMarker.start) return true;
    const dx = point.x - state.draggingMarker.start.x;
    const dy = point.y - state.draggingMarker.start.y;
    const x = Math.round(state.draggingMarker.origin.x + dx);
    const y = Math.round(state.draggingMarker.origin.y + dy);
    if (state.liveMarker) state.liveMarker.position.set(x, y);
    state.liveUpdates = { x, y };
    return true;
  }

  function resizeMarkerFromClientPoint(clientX, clientY) {
    if (!state.resizingMarker || !canvas?.scene) return false;
    const point = clientToScene(clientX, clientY);
    if (!point) return true;

    const target = getSceneTargets(canvas.scene.id).find((candidate) => candidate.id === state.resizingMarker.id);
    if (!target) return true;

    const updates = getResizeUpdates(target, state.resizingMarker.handle, point);

    state.liveUpdates = updates;
    if (state.liveMarker) {
      state.liveMarker.removeChildren();
      const preview = normalizeTarget({ ...target, ...updates });
      const color = getTargetDisplayColor(preview);
      const region = new PIXI.Graphics();
      drawMarkerRegion(region, preview, color);
      state.liveMarker.addChild(region);
      addResizeHandles(state.liveMarker, preview, color);
      state.liveMarker.addChild(createMoveHandle(preview, color));
    }
    return true;
  }

  async function finishMarkerResize() {
    if (!state.resizingMarker) return false;
    const targetId = state.resizingMarker.id;
    const updates = state.liveUpdates;
    state.resizingMarker = null;
    state.liveMarker = null;
    state.liveUpdates = null;
    if (updates) await updateTarget(targetId, updates, { refresh: false });
    refreshManager();
    return true;
  }

  function setupMouseTracking() {
    const view = canvas?.app?.view;
    if (!view || state.mouseTrackingCanvas === view) return;

    if (state.mouseTrackingCanvas) {
      state.mouseTrackingCanvas.removeEventListener("mousemove", trackMousePosition);
      state.mouseTrackingCanvas.removeEventListener("pointerdown", handleCanvasPlacement);
      state.mouseTrackingCanvas.removeEventListener("pointermove", handleCanvasPointerMove);
      state.mouseTrackingCanvas.removeEventListener("pointerup", handleCanvasPointerUp);
    }

    view.addEventListener("mousemove", trackMousePosition);
    view.addEventListener("pointerdown", handleCanvasPlacement);
    view.addEventListener("pointermove", handleCanvasPointerMove);
    view.addEventListener("pointerup", handleCanvasPointerUp);
    state.mouseTrackingCanvas = view;
  }

  function trackMousePosition(event) {
    state.lastMouseScenePosition = clientToScene(event.clientX, event.clientY);
  }

  async function handleCanvasPlacement(event) {
    if (!state.placementActive || !game.user?.isGM || !canvas?.scene) return;
    if (state.resizingMarker || state.draggingMarker) return;
    if (event.button !== 0) return;

    const position = clientToScene(event.clientX, event.clientY);
    if (!position) return;
    if (isNearExistingTarget(position)) return;

    event.preventDefault();
    event.stopPropagation();
    const defaults = getCurrentManagerFormDefaults();
    const target = await createTarget({
      sceneId: canvas.scene.id,
      x: position.x,
      y: position.y,
      mode: defaults.mode,
      type: defaults.type,
      label: defaults.label,
      visibility: "gm",
      shape: getPlacementShape(),
      radius: 80,
      width: 160,
      height: 160
    });
    if (state.manager) {
      state.manager.selectedTargetId = target?.id ?? state.manager.selectedTargetId;
      state.manager.draftTarget = null;
      state.manager.render(true);
    }
  }

  function handleCanvasPointerMove(event) {
    if (!state.resizingMarker && !state.draggingMarker) return;
    event.preventDefault();
    if (state.draggingMarker) moveMarkerToScenePoint(clientToScene(event.clientX, event.clientY));
    if (state.resizingMarker) resizeMarkerFromClientPoint(event.clientX, event.clientY);
  }

  function handleCanvasPointerUp(event) {
    if (!state.resizingMarker && !state.draggingMarker) return;
    event.preventDefault();
    if (state.draggingMarker) finishMarkerDrag().catch((error) => console.error(`${MODULE_TITLE} | Move failed`, error));
    if (state.resizingMarker) finishMarkerResize().catch((error) => console.error(`${MODULE_TITLE} | Resize failed`, error));
  }

  function getPlacementShape() {
    return REGION_SHAPES.includes(state.placementShape) ? state.placementShape : DEFAULT_SHAPE;
  }

  function getCurrentManagerFormDefaults() {
    const form = state.manager?.element?.find?.("form.pulse-scanner-target-form")?.[0];
    const type = form?.elements?.type?.value;
    const mode = form?.elements?.mode?.value;
    const label = form?.elements?.label?.value;
    return {
      type: TARGET_TYPES.includes(type) ? type : DEFAULT_TYPE,
      mode: SCANNER_MODES.includes(mode) ? mode : inferModeForType(type || DEFAULT_TYPE),
      label: label || "Placed Scan Target"
    };
  }

  function isNearExistingTarget(position) {
    return getSceneTargets(canvas.scene?.id).some((target) => isPointNearTarget(position, target));
  }

  function sceneToClient(x, y) {
    try {
      const point = canvas.stage.worldTransform.apply(new PIXI.Point(Number(x), Number(y)));
      const rect = canvas.app.view.getBoundingClientRect();
      return { x: rect.left + point.x, y: rect.top + point.y };
    } catch (error) {
      return { x: Number(x), y: Number(y) };
    }
  }

  function clientToScene(clientX, clientY) {
    try {
      const rect = canvas.app.view.getBoundingClientRect();
      const point = canvas.stage.worldTransform.applyInverse(new PIXI.Point(clientX - rect.left, clientY - rect.top));
      return { x: Math.round(point.x), y: Math.round(point.y) };
    } catch (error) {
      return null;
    }
  }

  function sceneDistanceToScreen(distance) {
    const scale = canvas?.stage?.scale?.x ?? 1;
    return Number(distance) * scale;
  }

  function resolveToken(tokenId) {
    if (tokenId) return canvas.tokens?.get(tokenId) ?? canvas.tokens?.placeables?.find((token) => token.id === tokenId || token.document?.id === tokenId);
    return canvas.tokens?.controlled?.[0] ?? null;
  }

  function resolveTokenForItem(item) {
    const actor = item?.actor;
    if (!actor) return null;
    const controlled = canvas.tokens?.controlled?.find((token) => token.actor?.id === actor.id);
    if (controlled) return controlled;
    return canvas.tokens?.placeables?.find((token) => token.actor?.id === actor.id && tokenIsOwner(token)) ?? null;
  }

  function tokenIsOwner(token) {
    return Boolean(token?.isOwner || token?.document?.isOwner || token?.actor?.isOwner);
  }

  function resolveActor(target) {
    if (!target) return canvas.tokens?.controlled?.[0]?.actor ?? game.user?.character ?? null;
    if (target.actor) return target.actor;
    if (target.document?.actor) return target.document.actor;
    if (target.items) return target;
    if (typeof target === "string") {
      const token = resolveToken(target);
      return token?.actor ?? game.actors?.get(target) ?? null;
    }
    return null;
  }

  function getPulseScannerItemForToken(token) {
    return token?.actor ? getPulseScannerItemForActor(token.actor) : null;
  }

  function getPulseScannerItemForActor(actor) {
    const items = Array.from(actor?.items ?? []);
    return items.find((item) => isPulseScannerItem(item)) ?? null;
  }

  function isPulseScannerItem(item) {
    if (!item) return false;
    if (item.getFlag?.(MODULE_ID, SCANNER_ITEM_FLAG)) return true;
    return normalizeScannerItemName(item.name) === normalizeScannerItemName(getScannerItemName());
  }

  function getScannerItemName() {
    return String(game.settings.get(MODULE_ID, "scannerItemName") || SCANNER_ITEM_NAME).trim() || SCANNER_ITEM_NAME;
  }

  function normalizeScannerItemName(name) {
    return String(name || "").trim().toLowerCase();
  }

  function getFallbackItemType() {
    const configuredTypes = game.system?.documentTypes?.Item ?? [];
    const documentTypes = Array.isArray(configuredTypes)
      ? configuredTypes
      : configuredTypes instanceof Set
        ? Array.from(configuredTypes)
        : configuredTypes && typeof configuredTypes === "object"
          ? Object.keys(configuredTypes)
          : [];
    if (documentTypes.includes("equipment")) return "equipment";
    if (documentTypes.includes("tool")) return "tool";
    if (documentTypes.includes("gear")) return "gear";
    if (documentTypes.includes("loot")) return "loot";
    return documentTypes[0] ?? "item";
  }

  function notifyScannerWarning(message) {
    ui.notifications?.warn?.(message);
    console.warn(`${MODULE_TITLE}: ${message}`);
  }

  function getTokenCenter(token) {
    if (token.center) return { x: token.center.x, y: token.center.y };
    const document = token.document ?? token;
    const width = Number(document.width ?? 1) * Number(canvas.grid?.size ?? 100);
    const height = Number(document.height ?? 1) * Number(canvas.grid?.size ?? 100);
    return { x: Number(document.x ?? token.x ?? 0) + width / 2, y: Number(document.y ?? token.y ?? 0) + height / 2 };
  }

  function getSelectedTokenPosition() {
    const token = canvas?.tokens?.controlled?.[0];
    return token ? getTokenCenter(token) : null;
  }

  function getSceneById(sceneId) {
    if (!sceneId) return canvas?.scene ?? null;
    return game.scenes?.get(sceneId) ?? null;
  }

  function findSceneForTarget(targetId) {
    for (const scene of game.scenes ?? []) {
      const store = getTargetStore(scene);
      if (store[targetId]) return scene;
    }
    return null;
  }

  function refreshManager() {
    if (state.manager?.rendered) state.manager.render(false);
    if (!state.draggingMarker && !state.resizingMarker) renderTargetMarkers();
  }

  function requireGM(action) {
    if (game.user?.isGM) return true;
    console.warn(`${MODULE_TITLE}: only GMs can ${action}.`);
    return false;
  }

  function randomId() {
    return foundry.utils.randomID?.(16) ?? crypto.randomUUID();
  }

  function labelize(value) {
    return String(value || "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function toNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function colorToHex(value) {
    const normalized = String(value || "").trim().replace("#", "");
    const parsed = Number.parseInt(normalized.length === 3
      ? normalized.split("").map((part) => `${part}${part}`).join("")
      : normalized, 16);
    return Number.isFinite(parsed) ? parsed : 0x7df9ff;
  }

  function getTargetDisplayColor(target) {
    if (target.status === "resolved") return 0x7b858c;
    return colorToHex(target.color || TYPE_META[target.type]?.color || TYPE_META.custom.color);
  }

  function playScanSound() {
    const src = String(game.settings.get(MODULE_ID, "scanSound") || "").trim();
    if (!src) return;
    const AudioHelper = globalThis.AudioHelper ?? foundry.audio?.AudioHelper;
    AudioHelper?.play?.({ src, volume: 0.65, autoplay: true, loop: false }, true);
  }

  function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function slugify(value) {
    return String(value || "scene")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "scene";
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    })[character]);
  }

  class PulseTargetManager extends LegacyApplication {
    constructor(options = {}) {
      super(options);
      this.selectedTargetId = options.targetId ?? null;
      this.draftTarget = null;
    }

    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "pulse-scanner-target-manager",
        title: "Pulse Scanner Target Manager",
        template: `${TEMPLATE_ROOT}/target-manager.hbs`,
        classes: ["pulse-scanner", "pulse-scanner-manager"],
        width: 900,
        height: "auto",
        resizable: true
      });
    }

    getData() {
      const scene = canvas?.scene ?? game.scenes?.current ?? null;
      const targets = getTargets(scene?.id);
      const viewTargets = targets.map((target) => ({
        ...target,
        isResolved: target.status === "resolved",
        isBreakable: target.type === "breakable"
      }));
      const selectedTarget = this.draftTarget
        ?? targets.find((target) => target.id === this.selectedTargetId)
        ?? targets[0]
        ?? normalizeTarget({ sceneId: scene?.id, ...getDefaultPositionData() });
      const selectedViewTarget = {
        ...selectedTarget,
        isBreakable: selectedTarget.type === "breakable"
      };

      if (!this.draftTarget && !this.selectedTargetId && targets[0]) this.selectedTargetId = targets[0].id;

      return {
        scene,
        targets: viewTargets,
        selectedTarget: selectedViewTarget,
        typeOptions: TARGET_TYPES.map((type) => ({ value: type, label: TYPE_META[type]?.label ?? labelize(type) })),
        modeOptions: SCANNER_MODES.map((mode) => ({ value: mode, label: MODE_META[mode]?.label ?? labelize(mode) })),
        colorOptions: getColorOptions(selectedTarget.color),
        visibilityOptions: VISIBILITY_MODES.map((mode) => ({ value: mode, label: labelize(mode) })),
        statusOptions: TARGET_STATUSES.map((status) => ({ value: status, label: labelize(status) })),
        hasTargets: targets.length > 0,
        canUseMouse: Boolean(state.lastMouseScenePosition),
        placementActive: state.placementActive,
        placementShape: state.placementShape,
        placementCircle: state.placementShape === "circle",
        placementRectangle: state.placementShape === "rectangle",
        scannerItem: {
          name: getScannerItemName(),
          mode: getScannerItemMode(),
          radiusFeet: game.settings.get(MODULE_ID, "scannerItemRadiusFeet")
        }
      };
    }

    activateListeners(html) {
      super.activateListeners(html);
      html.find("[data-action]").on("click", (event) => this._handleAction(event));
      html.find("form.pulse-scanner-target-form").on("submit", (event) => {
        event.preventDefault();
        this._saveForm(event.currentTarget);
      });
      html.find(".pulse-scanner-target-card").on("click", (event) => {
        const targetId = event.currentTarget.dataset.targetId;
        if (!targetId) return;
        this.draftTarget = null;
        this.selectedTargetId = targetId;
        this.render(false);
      });
      html.find(".ps-integrity-slider").on("input", (event) => {
        html.find(".ps-integrity-value").text(event.currentTarget.value);
      });
    }

    async _handleAction(event) {
      event.preventDefault();
      event.stopPropagation();

      const button = event.currentTarget;
      const action = button.dataset.action;
      const targetId = button.dataset.targetId ?? button.closest("[data-target-id]")?.dataset.targetId ?? this.selectedTargetId;

      if (action === "new-manual") return this._startManualTarget();
      if (action === "save-target") return this._saveForm(button.closest("form"));
      if (action === "create-scanner-item-config") return this._createScannerItemConfig(button.closest("form"));
      if (action === "delete-target") return this._deleteTarget(targetId);
      if (action === "toggle-placement") return this._togglePlacement();
      if (action === "set-placement-shape") return this._setPlacementShape(button.dataset.shape);
      if (action === "reveal-target") return this._revealTarget(targetId);
      if (action === "hide-target") return this._hideTarget(targetId);
      if (action === "toggle-resolved") return this._toggleResolved(targetId);
    }

    _startManualTarget() {
      const position = getDefaultPositionData();
      this.draftTarget = normalizeTarget({ sceneId: canvas.scene?.id, ...position, label: "New Scan Target" });
      this.selectedTargetId = null;
      this.render(false);
      window.setTimeout(() => {
        const form = this.element?.find?.("form.pulse-scanner-target-form")?.[0];
        if (!form) return;
        form.elements.x.value = position.x;
        form.elements.y.value = position.y;
        form.elements.label.focus();
        form.elements.label.select();
      }, 20);
    }

    async _saveForm(form) {
      if (!form) return;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const targetData = {
        ...data,
        sceneId: canvas.scene?.id,
        x: data.x,
        y: data.y,
        radius: data.radius,
        integrity: data.integrity
      };

      if (data.id && getTargets(canvas.scene?.id).some((target) => target.id === data.id)) {
        await updateTarget(data.id, targetData);
        this.selectedTargetId = data.id;
      } else {
        const target = await createTarget(targetData);
        this.selectedTargetId = target?.id ?? this.selectedTargetId;
      }
      this.draftTarget = null;
      this.render(false);
    }

    async _createScannerItemConfig(form) {
      if (!form) return;
      const formData = new FormData(form);
      const name = String(formData.get("scannerItemName") || SCANNER_ITEM_NAME).trim() || SCANNER_ITEM_NAME;
      const mode = SCANNER_MODES.includes(formData.get("scannerItemMode")) ? formData.get("scannerItemMode") : DEFAULT_MODE;
      const radiusFeet = Math.max(0, toNumber(formData.get("scannerItemRadiusFeet"), 30));

      await game.settings.set(MODULE_ID, "scannerItemName", name);
      await game.settings.set(MODULE_ID, "scannerItemMode", mode);
      await game.settings.set(MODULE_ID, "scannerItemRadiusFeet", radiusFeet);
      await createWorldPulseScannerItem({ name, mode, radiusFeet });
      this.render(false);
    }

    _getCurrentMode() {
      const form = this.element?.find?.("form.pulse-scanner-target-form")?.[0];
      return form?.elements?.mode?.value || DEFAULT_MODE;
    }

    _togglePlacement() {
      togglePlacementTool();
      this.render(false);
    }

    _setPlacementShape(shape) {
      setPlacementShape(shape);
      this.render(false);
    }

    async _revealTarget(targetId) {
      if (!targetId) return;
      await revealTarget(targetId);
      this.render(false);
    }

    async _revealLatest() {
      await revealLatestScan();
      this.render(false);
    }

    async _hideTarget(targetId) {
      if (!targetId) return;
      await hideTarget(targetId);
      this.render(false);
    }

    async _toggleResolved(targetId) {
      if (!targetId) return;
      const target = getSceneTargets(canvas.scene?.id).find((candidate) => candidate.id === targetId);
      if (target?.status === "resolved") await unresolveTarget(targetId);
      else await resolveTarget(targetId);
      this.render(false);
    }

    _openImportDialog() {
      const dialog = new Dialog({
        title: "Import Pulse Scanner Targets",
        content: `<form><textarea name="json" rows="12" style="width:100%;" placeholder='{"targets":[]}'></textarea></form>`,
        buttons: {
          import: {
            icon: '<i class="fa-solid fa-file-import"></i>',
            label: "Import",
            callback: (html) => importTargets(html.find("textarea[name='json']").val())
          },
          cancel: {
            label: "Cancel"
          }
        },
        default: "import"
      }, {
        width: 520,
        classes: ["pulse-scanner", "pulse-scanner-import-dialog"]
      });
      dialog.render(true);
    }

    async _deleteTarget(targetId) {
      if (!targetId) return;
      await deleteTarget(targetId, canvas.scene?.id);
      this.selectedTargetId = getTargets(canvas.scene?.id)[0]?.id ?? null;
      this.draftTarget = null;
      this.render(false);
    }
  }

  function getDefaultPositionData() {
    return getSelectedTokenPosition()
      ?? state.lastMouseScenePosition
      ?? { x: Math.round(canvas?.dimensions?.width / 2 || 0), y: Math.round(canvas?.dimensions?.height / 2 || 0) };
  }
})();
