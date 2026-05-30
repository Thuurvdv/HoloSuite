// @ts-nocheck
import {
  COLOR_OPTIONS,
  DEFAULT_MODE,
  DEFAULT_TYPE,
  MODE_META,
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

  Hooks.on("updateScene", (scene, changes = {}) => {
    if (scene.id === canvas?.scene?.id && changes.flags?.[MODULE_ID]?.[TARGET_FLAG]) refreshManager();
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

    game.settings.register(MODULE_ID, "scannerCharges", {
      name: "Scanner Charges",
      hint: "Maximum number of charges per Pulse Scanner item. Set to 0 for unlimited.",
      scope: "world",
      config: true,
      type: Number,
      default: 0
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
      usePulseScannerItem,
      refreshScannerItem,
      getScannerCharges,
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

    const scannerItems = getPulseScannerItemsForToken(token);
    if (!scannerItems.length) return;

    const title = scannerItems.length > 1 ? "Choose Pulse Scanner" : "Use Pulse Scanner";
    const icon = $(`<div class="control-icon pulse-scanner-token-control" title="${title}" data-action="pulse-scanner-scan"><i class="fa-solid fa-wave-square"></i></div>`);

    icon.on("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      choosePulseScannerItemForToken(token).catch((error) => console.error(`${MODULE_TITLE} | Item scan failed`, error));
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

    const charges = getScannerCharges(item);
    const chargesLabel = charges ? ` (${charges.current}/${charges.max})` : "";

    const wrapper = document.createElement("div");
    wrapper.className = "pulse-scanner-item-actions";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "pulse-scanner-item-use";
    button.innerHTML = `<i class="fa-solid fa-wave-square"></i> Use Pulse Scanner${escapeHtml(chargesLabel)}`;
    if (charges && charges.current <= 0) button.disabled = true;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      usePulseScannerItem({ item }).catch((error) => console.error(`${MODULE_TITLE} | Item scan failed`, error));
    });
    wrapper.appendChild(button);

    if (charges) {
      const refreshBtn = document.createElement("button");
      refreshBtn.type = "button";
      refreshBtn.className = "pulse-scanner-item-refresh";
      refreshBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i>`;
      refreshBtn.title = "Refresh scanner charges";
      refreshBtn.addEventListener("click", (event) => {
        event.preventDefault();
        refreshScannerItem({ item }).catch((error) => console.error(`${MODULE_TITLE} | Refresh failed`, error));
      });
      wrapper.appendChild(refreshBtn);
    }

    const content = root.querySelector(".window-content") ?? root;
    const sheetHeader = content.querySelector(".sheet-header, header.sheet-header, .item-header");
    if (sheetHeader?.parentElement) sheetHeader.parentElement.insertBefore(wrapper, sheetHeader.nextSibling);
    else content.prepend(wrapper);
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

  // --- Region helpers ---

  function getSceneRegions(sceneId = "") {
    const scene = getSceneById(sceneId);
    const regions = scene?.regions?.contents ?? [];
    return regions
      .map((region) => ({
        id: region.id,
        name: region.name || `Region ${region.id}`,
        region
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function getRegionChoices(sceneId = "", selectedRegionId = "") {
    return [
      { id: "", name: "No Linked Region", selected: !selectedRegionId },
      ...getSceneRegions(sceneId).map((entry) => ({
        id: entry.id,
        name: entry.name,
        selected: entry.id === selectedRegionId
      }))
    ];
  }

  function getRegionDocument(regionId = "", sceneId = "") {
    if (!regionId) return null;
    const scene = getSceneById(sceneId);
    return scene?.regions?.get?.(regionId) ?? null;
  }

  function getRegionBounds(region) {
    const regionObject = region?.object ?? canvas?.regions?.placeables?.find?.((placeable) => placeable.document?.id === region?.id);
    const objectBounds = regionObject?.bounds;
    if (objectBounds?.width && objectBounds?.height) return normalizeBounds(objectBounds);

    const directBounds = region?.bounds;
    if (directBounds?.width && directBounds?.height) return normalizeBounds(directBounds);

    const source = region?.toObject?.() ?? region;
    const shapes = Array.isArray(region?.shapes) ? region.shapes : Array.isArray(source?.shapes) ? source.shapes : [];
    return getShapesRegionBounds(shapes);
  }

  function normalizeBounds(bounds) {
    const x = Number(bounds.x ?? 0);
    const y = Number(bounds.y ?? 0);
    const width = Number(bounds.width ?? 0);
    const height = Number(bounds.height ?? 0);
    return {
      x: Math.round(x + width / 2),
      y: Math.round(y + height / 2),
      radius: Math.round(Math.hypot(width, height) / 2)
    };
  }

  function getShapesRegionBounds(shapes) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const shape of shapes) {
      if (shape.type === "rectangle") {
        minX = Math.min(minX, shape.x ?? 0);
        minY = Math.min(minY, shape.y ?? 0);
        maxX = Math.max(maxX, (shape.x ?? 0) + (shape.width ?? 0));
        maxY = Math.max(maxY, (shape.y ?? 0) + (shape.height ?? 0));
      } else if (shape.type === "ellipse") {
        minX = Math.min(minX, (shape.x ?? 0) - (shape.radiusX ?? 0));
        minY = Math.min(minY, (shape.y ?? 0) - (shape.radiusY ?? 0));
        maxX = Math.max(maxX, (shape.x ?? 0) + (shape.radiusX ?? 0));
        maxY = Math.max(maxY, (shape.y ?? 0) + (shape.radiusY ?? 0));
      } else if (shape.type === "polygon" && Array.isArray(shape.points)) {
        for (let i = 0; i < shape.points.length; i += 2) {
          minX = Math.min(minX, shape.points[i]);
          minY = Math.min(minY, shape.points[i + 1]);
          maxX = Math.max(maxX, shape.points[i]);
          maxY = Math.max(maxY, shape.points[i + 1]);
        }
      }
    }
    if (!Number.isFinite(minX)) return null;
    const width = maxX - minX;
    const height = maxY - minY;
    return {
      x: Math.round(minX + width / 2),
      y: Math.round(minY + height / 2),
      radius: Math.round(Math.hypot(width, height) / 2)
    };
  }

  function applyRegionBounds(target) {
    if (!target.regionId) return target;
    const region = getRegionDocument(target.regionId, target.sceneId);
    const bounds = getRegionBounds(region);
    if (!bounds) return target;
    return { ...target, ...bounds };
  }

  // --- Core API ---

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
    const targets = getSceneTargets(canvas.scene.id).map(applyRegionBounds);
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

    const item = options.item ?? getPulseScannerItemById(token, options.scannerItemId) ?? getPulseScannerItemForToken(token);
    if (!game.user?.isGM && !item && playerRequiresScannerItem(options)) {
      notifyScannerWarning("This token needs a Pulse Scanner item before it can scan.");
      return [];
    }

    const maxCharges = toNumber(game.settings.get(MODULE_ID, "scannerCharges"), 0);
    if (maxCharges > 0 && item) {
      const charges = toNumber(item.getFlag?.(MODULE_ID, "charges"), maxCharges);
      if (charges <= 0) {
        notifyScannerWarning("This scanner has no charges remaining. Refresh it to scan again.");
        return [];
      }
      await item.setFlag?.(MODULE_ID, "charges", charges - 1);
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

  async function refreshScannerItem(options = {}) {
    const token = resolveToken(options.tokenId) ?? resolveTokenForItem(options.item);
    if (!token) {
      notifyScannerWarning("Select a token with a Pulse Scanner item.");
      return null;
    }

    const item = options.item ?? getPulseScannerItemById(token, options.scannerItemId) ?? getPulseScannerItemForToken(token);
    if (!item) {
      notifyScannerWarning("No Pulse Scanner item found on this token.");
      return null;
    }

    const maxCharges = toNumber(game.settings.get(MODULE_ID, "scannerCharges"), 0);
    if (maxCharges <= 0) return item;

    await item.setFlag?.(MODULE_ID, "charges", maxCharges);
    ui.notifications?.info?.(`${MODULE_TITLE}: scanner recharged to ${maxCharges} charge${maxCharges === 1 ? "" : "s"}.`);
    return item;
  }

  function getScannerCharges(item) {
    const maxCharges = toNumber(game.settings.get(MODULE_ID, "scannerCharges"), 0);
    if (maxCharges <= 0) return null;
    const current = toNumber(item?.getFlag?.(MODULE_ID, "charges"), maxCharges);
    return { current, max: maxCharges };
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

    const duration = Math.max(900, Number(payload.duration || 4200));

    const overlay = document.createElement("div");
    overlay.className = "pulse-scanner-overlay";
    overlay.dataset.cameraLocked = "true";
    overlay.style.setProperty("--pulse-duration", `${duration}ms`);
    document.body.appendChild(overlay);

    lockCanvasControls(duration + 650);

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

    window.setTimeout(() => overlay.remove(), duration + 650);
  }

  function lockCanvasControls(durationMs) {
    if (!canvas?.mouseInteractionManager) return;

    const mim = canvas.mouseInteractionManager;
    const savedCallbacks = {
      dragLeftMove: mim.callbacks?.dragLeftMove,
      dragRightMove: mim.callbacks?.dragRightMove,
      longPress: mim.callbacks?.longPress
    };
    const noop = () => {};
    if (mim.callbacks) {
      mim.callbacks.dragLeftMove = noop;
      mim.callbacks.dragRightMove = noop;
      mim.callbacks.longPress = noop;
    }

    const view = canvas.app?.view ?? canvas.element?.[0] ?? document.querySelector("#board");
    const blockWheel = (event) => { event.preventDefault(); event.stopPropagation(); };
    if (view) view.addEventListener("wheel", blockWheel, { capture: true, passive: false });

    window.setTimeout(() => {
      if (mim.callbacks) {
        mim.callbacks.dragLeftMove = savedCallbacks.dragLeftMove;
        mim.callbacks.dragRightMove = savedCallbacks.dragRightMove;
        mim.callbacks.longPress = savedCallbacks.longPress;
      }
      if (view) view.removeEventListener("wheel", blockWheel, { capture: true });
    }, durationMs);
  }

  function buildTargetLabelHtml(target, showIntegrity) {
    const safeLabel = escapeHtml(target.label || TYPE_META[target.type]?.label || "Signature");
    const safeDescription = escapeHtml(target.description || "");
    const integrityValue = clamp(Number(target.integrity ?? 0), 0, 100);
    const isBreakable = target.type === "breakable";
    const showType = target.type !== "custom";

    const typeLabel = showType ? `<small>${escapeHtml(TYPE_META[target.type]?.label || "")}</small>` : "";

    let integrityLine = "";
    if (showIntegrity && isBreakable) {
      integrityLine = `<small>Integrity</small><div class="pulse-scanner-integrity-bar"><span style="width: ${integrityValue}%;"></span></div>`;
    }

    const descriptionLine = safeDescription
      ? `<small class="pulse-scanner-description">${safeDescription}</small>`
      : "";

    return `<span class="pulse-scanner-label-row"><strong>${safeLabel}</strong></span>${integrityLine}${descriptionLine}`;
  }

  function handleSocketMessage(message = {}) {
    if (message.action === "scan-results") {
      if (message.payload?.userId === game.user?.id) return;
      renderScanEffect(message.payload);
    }
  }

  // --- Coordinate helpers ---

  function sceneToClient(x, y) {
    try {
      const point = canvas.stage.worldTransform.apply(new PIXI.Point(Number(x), Number(y)));
      const rect = canvas.app.view.getBoundingClientRect();
      return { x: rect.left + point.x, y: rect.top + point.y };
    } catch (error) {
      return { x: Number(x), y: Number(y) };
    }
  }

  function sceneDistanceToScreen(distance) {
    const scale = canvas?.stage?.scale?.x ?? 1;
    return Number(distance) * scale;
  }

  // --- Token / actor helpers ---

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
    return getPulseScannerItemsForActor(actor)[0] ?? null;
  }

  function getPulseScannerItemsForToken(token) {
    return token?.actor ? getPulseScannerItemsForActor(token.actor) : [];
  }

  function getPulseScannerItemsForActor(actor) {
    const items = Array.from(actor?.items ?? []);
    return items.filter((item) => isPulseScannerItem(item));
  }

  function getPulseScannerItemById(token, itemId) {
    if (!itemId) return null;
    return getPulseScannerItemsForToken(token).find((item) => item.id === itemId) ?? null;
  }

  async function choosePulseScannerItemForToken(token) {
    const items = getPulseScannerItemsForToken(token);
    const tokenId = token.id ?? token.document?.id;
    if (!items.length) {
      notifyScannerWarning("This token needs a Pulse Scanner item before it can scan.");
      return [];
    }
    if (items.length === 1) return usePulseScannerItem({ tokenId, item: items[0] });

    const DialogClass = globalThis.Dialog ?? globalThis.foundry?.appv1?.api?.Dialog;
    if (!DialogClass) return usePulseScannerItem({ tokenId, item: items[0] });

    const rows = items.map((item, index) => {
      const config = getPulseScannerItemConfig(item);
      const charges = getScannerCharges(item);
      const chargesLabel = charges ? ` - ${charges.current}/${charges.max} charges` : "";
      const checked = index === 0 ? "checked" : "";
      return `
        <label class="pulse-scanner-choice">
          <input type="radio" name="pulseScannerItemId" value="${escapeHtml(item.id)}" ${checked}>
          <span>
            <strong>${escapeHtml(item.name)}</strong>
            <small>${escapeHtml(labelize(config.mode))} / ${Number(config.radiusFeet)} ft${escapeHtml(chargesLabel)}</small>
          </span>
        </label>
      `;
    }).join("");

    return new Promise((resolve) => {
      new DialogClass({
        title: "Choose Pulse Scanner",
        content: `<form class="pulse-scanner-choice-dialog">${rows}</form>`,
        buttons: {
          scan: {
            icon: '<i class="fa-solid fa-wave-square"></i>',
            label: "Scan",
            callback: async (html) => {
              const root = html?.[0] ?? html;
              const selectedId = root?.querySelector?.("[name='pulseScannerItemId']:checked")?.value;
              const item = getPulseScannerItemById(token, selectedId) ?? items[0];
              resolve(await usePulseScannerItem({ tokenId, item }));
            }
          },
          cancel: {
            label: "Cancel",
            callback: () => resolve([])
          }
        },
        default: "scan",
        close: () => resolve([])
      }, {
        classes: ["pulse-scanner", "pulse-scanner-choice-window"],
        width: 360
      }).render(true);
    });
  }

  function getPulseScannerItemConfig(item) {
    const scan = item?.getFlag?.(MODULE_ID, "scan") ?? {};
    return {
      mode: SCANNER_MODES.includes(scan.mode) ? scan.mode : getScannerItemMode(),
      radiusFeet: toNumber(scan.radiusFeet, game.settings.get(MODULE_ID, "scannerItemRadiusFeet"))
    };
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

  function getTokenCenter(token) {
    if (token.center) return { x: token.center.x, y: token.center.y };
    const document = token.document ?? token;
    const width = Number(document.width ?? 1) * Number(canvas.grid?.size ?? 100);
    const height = Number(document.height ?? 1) * Number(canvas.grid?.size ?? 100);
    return { x: Number(document.x ?? token.x ?? 0) + width / 2, y: Number(document.y ?? token.y ?? 0) + height / 2 };
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

  function getRegionName(regionId, sceneId) {
    if (!regionId) return "";
    const region = getRegionDocument(regionId, sceneId);
    return region?.name || `Region ${regionId}`;
  }

  function refreshManager() {
    if (state.manager?.rendered) state.manager.render(false);
  }

  function requireGM(action) {
    if (game.user?.isGM) return true;
    console.warn(`${MODULE_TITLE}: only GMs can ${action}.`);
    return false;
  }

  function randomId() {
    return foundry.utils.randomID?.(16) ?? crypto.randomUUID();
  }

  function notifyScannerWarning(message) {
    ui.notifications?.warn?.(message);
    console.warn(`${MODULE_TITLE}: ${message}`);
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
        width: 1080,
        height: 720,
        resizable: true
      });
    }

    getData() {
      const scene = canvas?.scene ?? game.scenes?.current ?? null;
      const targets = getTargets(scene?.id);
      const viewTargets = targets.map((target) => ({
        ...target,
        isResolved: target.status === "resolved",
        regionName: target.regionId ? getRegionName(target.regionId, scene?.id) : ""
      }));
      const selectedTarget = this.draftTarget
        ?? targets.find((target) => target.id === this.selectedTargetId)
        ?? targets[0]
        ?? normalizeTarget({ sceneId: scene?.id });
      const selectedViewTarget = {
        ...selectedTarget,
        statLabel: TYPE_META[selectedTarget.type]?.stat ?? "Intensity"
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
        regionChoices: getRegionChoices(scene?.id, selectedTarget.regionId),
        hasTargets: targets.length > 0,
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
      html.find(".ps-type-select").on("change", (event) => {
        const type = event.currentTarget.value;
        const integrityGroup = html.find(".ps-integrity-group");
        if (type === "breakable") integrityGroup.show();
        else integrityGroup.hide();
      });
    }

    async _handleAction(event) {
      event.preventDefault();
      event.stopPropagation();

      const button = event.currentTarget;
      const action = button.dataset.action;
      const targetId = button.dataset.targetId ?? button.closest("[data-target-id]")?.dataset.targetId ?? this.selectedTargetId;

      if (action === "new-target") return this._startNewTarget();
      if (action === "save-target") return this._saveForm(button.closest("form"));
      if (action === "create-scanner-item-config") return this._createScannerItemConfig(button.closest("form"));
      if (action === "delete-target") return this._deleteTarget(targetId);
      if (action === "reveal-target") return this._revealTarget(targetId);
      if (action === "hide-target") return this._hideTarget(targetId);
      if (action === "toggle-resolved") return this._toggleResolved(targetId);
    }

    _startNewTarget() {
      this.draftTarget = normalizeTarget({ sceneId: canvas.scene?.id, label: "New Scan Target" });
      this.selectedTargetId = null;
      this.render(false);
      window.setTimeout(() => {
        const form = this.element?.find?.("form.pulse-scanner-target-form")?.[0];
        if (!form) return;
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
        regionId: data.regionId || "",
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
})();
