import {
  ANIMATED_CELESTIAL_STYLES,
  ICON_STYLE_OPTIONS,
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
import { getPlanetAppearance, PLANET_OPTIONS, PLANET_SHAPE_OPTIONS } from "./planet-presets";
import { evaluateTravelApproval, getTravelElectorate, TRAVEL_APPROVAL_OPTIONS } from "./travel-approval";
import { MODULE_ID, SETTING_MAPS, SOCKET_NAME, TEMPLATE_ROOT } from "./constants";
import { downloadJson, escapeHtml, getFormValues, getHtmlElement, optionList, slugify } from "./dom-utils";

(() => {
  "use strict";

  let managerApp = null;
  const openMaps = new Map();
  let playerMapApp = null;
  const pendingTravelRequests = new Map();
  const promptedTravelRequests = new Set();
  const travelRequestPrompts = new Map();
  const latestTravelProgress = new Map();

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
    const ownerDocument = root?.ownerDocument ?? window.document;
    const dialogListeners = new AbortController();
    const dialogObserver = root ? new MutationObserver(() => {
      if (root.isConnected) return;
      dialogListeners.abort();
      dialogObserver.disconnect();
    }) : null;
    if (root && ownerDocument.body) dialogObserver?.observe(ownerDocument.body, { childList: true, subtree: true });
    let activeDocumentPicker: HTMLElement | null = null;
    const closeDocumentPicker = (restoreFocus = false) => {
      if (!activeDocumentPicker) return;
      const picker = activeDocumentPicker.closest("[data-linked-documents]");
      activeDocumentPicker.hidden = true;
      activeDocumentPicker.style.removeProperty("left");
      activeDocumentPicker.style.removeProperty("top");
      activeDocumentPicker.style.removeProperty("width");
      const trigger: HTMLElement | null = picker?.querySelector("[data-open-document-picker]") ?? null;
      trigger?.setAttribute("aria-expanded", "false");
      activeDocumentPicker = null;
      if (restoreFocus) trigger?.focus();
    };
    const positionDocumentPicker = () => {
      if (!activeDocumentPicker || activeDocumentPicker.hidden) return;
      const trigger: HTMLElement | null = activeDocumentPicker.closest("[data-linked-documents]")?.querySelector("[data-open-document-picker]") ?? null;
      if (!trigger) return;
      const viewportWidth = ownerDocument.documentElement.clientWidth;
      const viewportHeight = ownerDocument.documentElement.clientHeight;
      const width = Math.min(320, viewportWidth - 24);
      activeDocumentPicker.style.width = `${width}px`;
      const anchor = trigger.getBoundingClientRect();
      const popover = activeDocumentPicker.getBoundingClientRect();
      const left = Math.max(12, Math.min(anchor.right - width, viewportWidth - width - 12));
      const below = anchor.bottom + 6;
      const top = below + popover.height <= viewportHeight - 12
        ? below
        : Math.max(12, anchor.top - popover.height - 6);
      activeDocumentPicker.style.left = `${left}px`;
      activeDocumentPicker.style.top = `${top}px`;
    };
    ownerDocument.addEventListener("pointerdown", (event) => {
      if (!activeDocumentPicker) return;
      const target = event.target as Node;
      const trigger = activeDocumentPicker.closest("[data-linked-documents]")?.querySelector("[data-open-document-picker]");
      if (!activeDocumentPicker.contains(target) && !trigger?.contains(target)) closeDocumentPicker();
    }, { signal: dialogListeners.signal });
    ownerDocument.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !activeDocumentPicker) return;
      event.preventDefault();
      event.stopPropagation();
      closeDocumentPicker(true);
    }, { capture: true, signal: dialogListeners.signal });
    ownerDocument.addEventListener("scroll", positionDocumentPicker, { capture: true, passive: true, signal: dialogListeners.signal });
    ownerDocument.defaultView?.addEventListener("resize", positionDocumentPicker, { signal: dialogListeners.signal });
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
    const editorTabs = Array.from(root?.querySelectorAll("[data-system-editor-tab]") ?? []);
    const editorPanels = Array.from(root?.querySelectorAll("[data-system-editor-panel]") ?? []);
    const selectEditorTab = (tabId: string, focus = false) => {
      closeDocumentPicker();
      editorTabs.forEach((tab: HTMLElement) => {
        const active = tab.dataset.systemEditorTab === tabId;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        if (active && focus) tab.focus();
      });
      editorPanels.forEach((panel: HTMLElement) => { panel.hidden = panel.dataset.systemEditorPanel !== tabId; });
    };
    editorTabs.forEach((tab: HTMLElement, index) => {
      tab.addEventListener("click", () => selectEditorTab(tab.dataset.systemEditorTab ?? "overview"));
      tab.addEventListener("keydown", (event: KeyboardEvent) => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const next = editorTabs[(index + direction + editorTabs.length) % editorTabs.length] as HTMLElement;
        selectEditorTab(next.dataset.systemEditorTab ?? "overview", true);
      });
    });
    if (editorTabs.length) selectEditorTab("overview");

    root?.querySelectorAll("[data-marker-preview]").forEach((preview: HTMLElement) => {
      const form = preview.closest("form");
      const styleInput: HTMLSelectElement | null = form?.querySelector('[name="iconStyle"]') ?? null;
      const typeInput: HTMLSelectElement | null = form?.querySelector('[name="type"]') ?? null;
      const statusInput: HTMLSelectElement | null = form?.querySelector('[name="status"]') ?? null;
      const colorInput: HTMLInputElement | null = form?.querySelector('[name="iconColor"]') ?? null;
      const sizeInput: HTMLInputElement | null = form?.querySelector('[name="iconSize"]') ?? null;
      const pulseInput: HTMLInputElement | null = form?.querySelector('[name="pulse"]') ?? null;
      const nameInput: HTMLInputElement | null = form?.querySelector('[name="name"]') ?? null;
      const marker: HTMLElement | null = preview.querySelector("[data-marker-preview-system]");
      const icon = preview.querySelector("[data-marker-preview-icon]");
      const label = preview.querySelector("[data-marker-preview-label]");
      let renderSequence = 0;
      const updateMarkerPreview = async () => {
        if (!marker || !icon) return;
        const type = typeInput?.value ?? "unknown";
        const status = statusInput?.value ?? "known";
        const iconStyle = getDisplayIconStyle(type, styleInput?.value ?? "planet");
        marker.className = `gmf-system gmf-system--${type} gmf-icon--${iconStyle} gmf-status--${status}${pulseInput?.checked ? " is-marker-preview-pulsing" : " gmf-no-pulse"}`;
        marker.style.setProperty("--gmf-faction-color", colorInput?.value || "#58d8ff");
        marker.style.setProperty("--gmf-system-size", `${sizeInput?.value || 28}px`);
        if (label) label.textContent = nameInput?.value.trim() || "New System";
        const sequence = ++renderSequence;
        if (ANIMATED_CELESTIAL_STYLES.includes(iconStyle)) {
          const markup = await renderTemplate(`${TEMPLATE_ROOT}/celestial-icon.hbs`, { system: { iconStyle } });
          if (sequence === renderSequence) icon.innerHTML = markup;
        } else {
          icon.innerHTML = '<span class="gmf-system__core"></span>';
        }
      };
      for (const control of [styleInput, typeInput, statusInput, colorInput, sizeInput, pulseInput, nameInput]) {
        control?.addEventListener("input", updateMarkerPreview);
        control?.addEventListener("change", updateMarkerPreview);
      }
      updateMarkerPreview();
    });
    root?.querySelectorAll("[data-linked-documents]").forEach((picker: HTMLElement) => {
      const list = picker.querySelector("[data-linked-document-list]");
      const panel: HTMLElement | null = picker.querySelector("[data-document-picker]");
      const search: HTMLInputElement | null = picker.querySelector("[data-document-search]");
      const results = picker.querySelector("[data-document-results]");
      const collection = game[picker.dataset.collection]?.contents ?? [];
      const inputName = picker.dataset.inputName ?? "documentId";
      const multiple = picker.dataset.multiple === "true";
      const kindLabel = picker.dataset.kindLabel ?? "Document";
      const iconClass = picker.dataset.iconClass ?? "fa-file";
      const openButton: HTMLElement | null = picker.querySelector("[data-open-document-picker]");

      const selectedIds = () => new Set(Array.from(list?.querySelectorAll(`input[name="${inputName}"]`) ?? []).map((input: HTMLInputElement) => input.value));
      const updateEmptyState = () => {
        const empty: HTMLElement | null = picker.querySelector("[data-linked-document-empty]");
        if (empty) empty.hidden = Boolean(list?.querySelector("[data-linked-document]"));
      };
      const renderResults = () => {
        if (!results) return;
        const query = search?.value.trim().toLocaleLowerCase() ?? "";
        const selected = selectedIds();
        const matches = collection
          .filter((document) => !selected.has(String(document.id)))
          .filter((document) => !query || String(document.name ?? document.id).toLocaleLowerCase().includes(query));
        results.replaceChildren();
        for (const document of matches.slice(0, 50)) {
          const button = window.document.createElement("button");
          button.type = "button";
          button.className = "gmf-document-picker__result";
          button.dataset.documentId = String(document.id);
          button.textContent = String(document.name ?? document.id);
          results.append(button);
        }
        if (!matches.length) {
          const message = window.document.createElement("p");
          message.textContent = collection.length ? `No matching ${kindLabel.toLocaleLowerCase()}s.` : `No ${kindLabel.toLocaleLowerCase()}s exist in this world yet.`;
          results.append(message);
        } else if (matches.length > 50) {
          const message = window.document.createElement("p");
          message.textContent = `${matches.length - 50} more results — refine your search.`;
          results.append(message);
        }
      };
      const addDocument = (document) => {
        if (!list || selectedIds().has(String(document.id))) return;
        if (!multiple) list.querySelectorAll("[data-linked-document]").forEach((row) => row.remove());
        const row = ownerDocument.createElement("div");
        row.className = "gmf-linked-document";
        row.dataset.linkedDocument = "";
        row.dataset.documentId = String(document.id);
        const icon = ownerDocument.createElement("i");
        icon.className = `fa-solid ${iconClass} gmf-linked-document__icon`;
        icon.setAttribute("aria-hidden", "true");
        const copy = ownerDocument.createElement("span");
        copy.className = "gmf-linked-document__copy";
        const name = ownerDocument.createElement("strong");
        name.textContent = String(document.name ?? document.id);
        const meta = ownerDocument.createElement("small");
        meta.textContent = kindLabel;
        copy.append(name, meta);
        const input = ownerDocument.createElement("input");
        input.type = "hidden";
        input.name = inputName;
        input.value = String(document.id);
        const remove = ownerDocument.createElement("button");
        remove.type = "button";
        remove.dataset.unlinkDocument = "";
        remove.title = `Remove ${kindLabel.toLocaleLowerCase()}`;
        remove.setAttribute("aria-label", remove.title);
        remove.innerHTML = '<i class="fa-solid fa-xmark"></i><span>Unlink</span>';
        row.append(icon, copy, input, remove);
        list.append(row);
        updateEmptyState();
        renderResults();
        closeDocumentPicker(true);
      };

      list?.addEventListener("click", (event) => {
        const button = (event.target as HTMLElement).closest("[data-unlink-document]");
        if (!button) return;
        button.closest("[data-linked-document]")?.remove();
        updateEmptyState();
        renderResults();
      });
      openButton?.addEventListener("click", () => {
        if (!panel) return;
        if (activeDocumentPicker === panel) return closeDocumentPicker(true);
        closeDocumentPicker();
        activeDocumentPicker = panel;
        panel.hidden = false;
        openButton.setAttribute("aria-expanded", "true");
        renderResults();
        requestAnimationFrame(() => {
          positionDocumentPicker();
          search?.focus();
          search?.select();
        });
      });
      picker.querySelector("[data-close-document-picker]")?.addEventListener("click", () => closeDocumentPicker(true));
      search?.addEventListener("input", renderResults);
      search?.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          (results?.querySelector("[data-document-id]") as HTMLElement | null)?.focus();
        }
        if (event.key === "Enter") {
          event.preventDefault();
          event.stopPropagation();
          (results?.querySelector("[data-document-id]") as HTMLElement | null)?.click();
        }
      });
      results?.addEventListener("click", (event) => {
        const button: HTMLElement | null = (event.target as HTMLElement).closest("[data-document-id]");
        const document = collection.find((candidate) => String(candidate.id) === button?.dataset.documentId);
        if (document) addDocument(document);
      });
      updateEmptyState();
    });
    const texturePanel = root?.querySelector("[data-texture-upload-fields]");
    const textureInput = root?.querySelector('[name="planetTexture"]');
    const colorPanel = root?.querySelector("[data-color-appearance-fields]");
    const textureStatus = root?.querySelector("[data-texture-upload-status]");
    const appearanceInput = root?.querySelector('[name="planetPreset"]');
    const shapeInput = root?.querySelector('[name="planetShape"]');
    const textureGuide = root?.querySelector("[data-texture-guide]");
    const texturePreviews = root?.querySelectorAll("[data-texture-guide-preview]") ?? [];
    const updateCustomTextureState = () => {
      const custom = appearanceInput?.value === "custom";
      if (texturePanel) texturePanel.hidden = !custom;
      if (colorPanel) colorPanel.hidden = appearanceInput?.value !== "color";
      if (textureInput) textureInput.required = custom;
      return custom;
    };
    const updateTexturePreview = () => {
      if (!textureGuide) return;
      const path = textureInput?.value?.trim();
      if (path) {
        textureGuide.dataset.hasTexture = "true";
        if (textureStatus) textureStatus.textContent = "Loading custom texture preview…";
        texturePreviews.forEach((preview: HTMLImageElement) => {
          preview.hidden = false;
          preview.onload = () => {
            if (textureInput?.value?.trim() !== path) return;
            if (textureStatus) textureStatus.textContent = "Custom texture selected · visible beneath the guide";
          };
          preview.onerror = () => {
            preview.hidden = true;
            if (textureInput?.value?.trim() === path && textureStatus) textureStatus.textContent = "Custom texture selected, but its preview could not be loaded";
          };
          preview.src = path;
        });
      } else {
        delete textureGuide.dataset.hasTexture;
        texturePreviews.forEach((preview: HTMLImageElement) => {
          preview.onload = null;
          preview.onerror = null;
          preview.removeAttribute("src");
          preview.hidden = true;
        });
      }
    };
    const updateTextureStatus = () => {
      if (textureStatus) textureStatus.textContent = textureInput?.value?.trim()
        ? "Loading custom texture preview…"
        : "Choose an image to preview it beneath the guide";
      updateTexturePreview();
    };
    appearanceInput?.addEventListener("change", () => {
      const custom = updateCustomTextureState();
      if (!custom && textureInput?.value) {
        textureInput.value = "";
        textureInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    root?.querySelector("[data-clear-planet-texture]")?.addEventListener("click", () => {
      if (!textureInput) return;
      textureInput.value = "";
      textureInput.dispatchEvent(new Event("change", { bubbles: true }));
    });
    textureInput?.addEventListener("change", updateTextureStatus);
    shapeInput?.addEventListener("change", () => {
      if (textureGuide) textureGuide.dataset.shape = shapeInput.value;
    });
    updateCustomTextureState();
    updateTextureStatus();

  }

  function renderCrudDialog({ title, content, submitLabel = "Save", onSubmit, render = activateCrudDialog, width = 700, height = "auto", dialogClass = "" }) {
    new Dialog({
      title,
      content,
      render,
      buttons: {
        cancel: {
          icon: '<i class="fa-solid fa-xmark"></i>',
          label: "Cancel"
        },
        save: {
          icon: '<i class="fa-solid fa-floppy-disk"></i>',
          label: submitLabel,
          callback: (html) => {
            const root = getHtmlElement(html);
            const form = root?.matches?.("form") ? root : root?.querySelector("form");
            const invalid = form ? Array.from(form.elements).find((control: any) => control.willValidate && !control.checkValidity()) as HTMLElement : null;
            if (invalid) {
              const panel: HTMLElement | null = invalid.closest("[data-system-editor-panel]");
              if (panel?.dataset.systemEditorPanel) root.querySelector(`[data-system-editor-tab="${panel.dataset.systemEditorPanel}"]`)?.click();
              (invalid as any).reportValidity();
              invalid.focus();
              return false;
            }
            return onSubmit(getFormValues(html));
          }
        }
      },
      default: "save"
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog", dialogClass].filter(Boolean),
      width,
      height
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
      return {
        ...system,
        iconStyle: displayIconStyle,
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
        animatedCelestial: ANIMATED_CELESTIAL_STYLES.includes(displayIconStyle),
        hasAlert: ["danger", "locked"].includes(obscured ? "undiscovered" : system.status),
        alertLabel: system.status === "danger" ? "Hazard advisory" : system.status === "locked" ? "Restricted access" : "",
        hasJournal: Boolean(!obscured && system.journalId),
        hasScenes: Boolean(!obscured && system.sceneIds.length),
        showImage: Boolean(!obscured && system.image),
        canInspectSystem: Boolean(getPlanetAppearance({ ...system, iconStyle: displayIconStyle, obscured }))
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
          <figcaption><strong>2048×1024 · 2:1</strong> Uses the full 8×4 grid—there are no required circles or fixed crater positions. Left and right join; place recognizable features near the equator and expect organic distortion.</figcaption>
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
          <figcaption><strong>2048×2048 · 1:1</strong> The middle 50% (y=25–75%) is the side. Each cap is a 512px circle: top at x=12.5–37.5%, y=0–25%; bottom at x=62.5–87.5%, y=75–100%.</figcaption>
        </figure>
        <figure data-guide-shape="crystal">
          <div class="gmf-uv-map gmf-uv-map--crystal" aria-hidden="true">
            <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
            <b class="gmf-uv-guide-grid"></b>
            ${Array.from({ length: 8 }, (_, index) => `<span class="is-face-${index + 1}">Face ${index + 1}</span>`).join("")}
            <i class="gmf-uv-grid-label is-columns">4 columns · 512px each</i>
            <i class="gmf-uv-grid-label is-rows">NO GAP · center seam y=512</i>
          </div>
          <figcaption><strong>2048×1024 · 2:1</strong> Divide the image into four 512×512 columns. Each column is one diamond containing two faces: Faces 1–4 point down from the top edge; Faces 5–8 point up from the bottom edge. Their bases meet exactly at y=512—leave no gap. Only the tinted triangles are used; the untinted corner halves are ignored.</figcaption>
        </figure>
      </div>
    `;
  }

  function getLinkedDocumentPickerMarkup({ collection, selectedIds, inputName, collectionName, kindLabel, iconClass, multiple = false }) {
    const documents = collection?.contents ?? [];
    const documentsById = new Map(documents.map((document) => [String(document.id), document]));
    const selected = (Array.isArray(selectedIds) ? selectedIds : selectedIds ? [selectedIds] : []).map(String);
    const rows = selected.map((id) => {
      const document = documentsById.get(id);
      const label = document?.name ?? `Missing ${kindLabel}`;
      return `<div class="gmf-linked-document ${document ? "" : "is-missing"}" data-linked-document data-document-id="${escapeHtml(id)}">
        <i class="fa-solid ${escapeHtml(iconClass)} gmf-linked-document__icon" aria-hidden="true"></i>
        <span class="gmf-linked-document__copy"><strong>${escapeHtml(label)}</strong><small>${document ? escapeHtml(kindLabel) : escapeHtml(id)}</small></span>
        <input type="hidden" name="${escapeHtml(inputName)}" value="${escapeHtml(id)}" />
        <button type="button" data-unlink-document title="Unlink ${escapeHtml(kindLabel.toLocaleLowerCase())}" aria-label="Unlink ${escapeHtml(kindLabel.toLocaleLowerCase())}"><i class="fa-solid fa-xmark"></i><span>Unlink</span></button>
      </div>`;
    }).join("");
    return `<div class="gmf-linked-documents" data-linked-documents data-collection="${escapeHtml(collectionName)}" data-input-name="${escapeHtml(inputName)}" data-kind-label="${escapeHtml(kindLabel)}" data-icon-class="${escapeHtml(iconClass)}" data-multiple="${multiple}">
      <div class="gmf-linked-document-list" data-linked-document-list>${rows}</div>
      <p class="gmf-linked-document-empty" data-linked-document-empty ${rows ? "hidden" : ""}>No linked ${escapeHtml(kindLabel.toLocaleLowerCase())}${multiple ? "s" : ""}.</p>
      <button type="button" class="gmf-button--quiet gmf-linked-documents__add" data-open-document-picker aria-haspopup="dialog" aria-expanded="false"><i class="fa-solid fa-plus"></i> Add ${escapeHtml(kindLabel)}</button>
      <div class="gmf-document-picker" data-document-picker role="dialog" aria-label="Choose ${escapeHtml(kindLabel.toLocaleLowerCase())}" hidden>
        <div class="gmf-document-picker__toolbar">
          <label>Search ${escapeHtml(kindLabel.toLocaleLowerCase())}${multiple ? "s" : ""}<input type="search" data-document-search autocomplete="off" placeholder="Type to filter…" /></label>
          <button type="button" class="gmf-button--quiet" data-close-document-picker aria-label="Close picker"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="gmf-document-picker__results" data-document-results></div>
      </div>
    </div>`;
  }

  function getMarkerPreviewMarkup(data, color) {
    const iconStyle = getDisplayIconStyle(data.type, data.iconStyle);
    return `<div class="gmf-marker-preview gmf-galaxy" data-marker-preview aria-label="Live map marker preview">
      <div class="gmf-marker-preview__stage">
        <span class="gmf-system gmf-system--${escapeHtml(data.type)} gmf-icon--${escapeHtml(iconStyle)} gmf-status--${escapeHtml(data.status)} ${data.pulse ? "is-marker-preview-pulsing" : "gmf-no-pulse"}" data-marker-preview-system style="--gmf-faction-color: ${escapeHtml(color)}; --gmf-system-size: ${escapeHtml(data.iconSize)}px;">
          <span class="gmf-system__halo"></span>
          <span data-marker-preview-icon><span class="gmf-system__core"></span></span>
          <span class="gmf-system__type-glyph" aria-hidden="true"></span>
        </span>
      </div>
      <span class="gmf-marker-preview__label" data-marker-preview-label>${escapeHtml(data.name || "New System")}</span>
    </div>`;
  }

  function getMarkerComposerMarkup(data, color, { quick = false } = {}) {
    return `<div class="gmf-marker-composer ${quick ? "gmf-marker-composer--quick" : ""}">
      <div class="gmf-marker-composer__controls">
        <div class="gmf-form-grid">
          <label>Marker Style <select name="iconStyle">${optionList(ICON_STYLE_OPTIONS, data.iconStyle)}</select></label>
          <label>Marker Color <input type="color" name="iconColor" value="${escapeHtml(color)}" /></label>
        </div>
        ${quick ? "" : `<div class="gmf-form-grid">
          <label>Marker Size <input type="range" name="iconSize" value="${escapeHtml(data.iconSize)}" min="18" max="56" step="1" /></label>
          <label class="gmf-checkbox-label"><input type="checkbox" name="pulse" value="true" ${data.pulse ? "checked" : ""} /> Pulse Glow</label>
        </div>`}
      </div>
      ${getMarkerPreviewMarkup(data, color)}
    </div>`;
  }

  function getSystemDialogContent(mapId, system = {}, defaults = {}, creating = false) {
    const map = getRawMap(mapId);
    const data = normalizeSystem({ ...defaults, ...system });
    const factionOptions = [
      { value: "", label: "Unaffiliated" },
      ...(map?.factions ?? []).map((faction) => ({ value: faction.id, label: faction.name }))
    ];
    const faction = (map?.factions ?? []).find((candidate) => candidate.id === data.factionId);
    const iconColorValue = data.iconColor || faction?.color || "#58d8ff";
    const texturePanelId = `gmf-texture-${String(data.id).replace(/[^a-z0-9_-]/gi, "") || "system"}`;
    const hiddenFields = `
      <input type="hidden" name="id" value="${escapeHtml(data.id)}" />
      <input type="hidden" name="x" value="${escapeHtml(data.x)}" />
      <input type="hidden" name="y" value="${escapeHtml(data.y)}" />`;
    const planetWorkspace = `
      <div class="gmf-planet-workspace__heading">
        <div><h3>System Appearance</h3><p>Configure the rotating model shown in the system detail view.</p></div>
      </div>
      <div class="gmf-planet-workspace__controls">
          <div class="gmf-form-grid">
            <label>Appearance <select name="planetPreset">${optionList(PLANET_OPTIONS, data.planetPreset)}</select></label>
            <label>3D Shape <select name="planetShape">${optionList(PLANET_SHAPE_OPTIONS, data.planetShape)}</select></label>
          </div>
          <div class="gmf-texture-upload">
            <div class="gmf-color-appearance__fields" data-color-appearance-fields ${data.planetPreset === "color" ? "" : "hidden"}>
              <label>Model color <input type="color" name="planetColor" value="${escapeHtml(data.planetColor)}" /></label>
              <p class="gmf-scene-picker__hint">The selected color covers the complete 3D shape without an image texture.</p>
            </div>
            <div id="${texturePanelId}" class="gmf-texture-upload__fields" data-texture-upload-fields ${data.planetPreset === "custom" ? "" : "hidden"}>
              <label>Custom texture image
                <div class="gmf-path-field">
                  <input type="text" name="planetTexture" value="${escapeHtml(data.planetTexture)}" placeholder="Choose PNG, JPEG, or WebP" />
                  <button type="button" data-browse-target="planetTexture"><i class="fa-solid fa-folder-open"></i> Browse</button>
                </div>
              </label>
              <p class="gmf-scene-picker__hint" data-texture-upload-status>${data.planetTexture ? "Custom texture selected · previewed beneath the guide" : "Choose an image to preview it beneath the guide"}</p>
              <button type="button" class="gmf-button--quiet gmf-texture-upload__clear" data-clear-planet-texture>Clear custom texture</button>
              ${getTextureGuideMarkup(data.planetShape)}
            </div>
          </div>
      </div>`;
    const contentWorkspace = `
      <section class="gmf-content-section">
        <header><h3>System Image</h3><p>Shown in system details when this location is selected.</p></header>
        <label class="gmf-content-section__control">Image path
          <div class="gmf-path-field">
            <input type="text" name="image" value="${escapeHtml(data.image)}" />
            <button type="button" data-browse-target="image"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
      </section>
      <section class="gmf-content-section">
        <header><h3>Linked Scenes</h3><p>Connect one or more scenes to this system for navigation and cross-module overlays.</p></header>
        ${getLinkedDocumentPickerMarkup({ collection: game.scenes, selectedIds: data.sceneIds, inputName: "sceneIds", collectionName: "scenes", kindLabel: "Scene", iconClass: "fa-image", multiple: true })}
      </section>
      <section class="gmf-content-section">
        <header><h3>Linked Journal</h3><p>Optionally attach one journal entry for lore and reference material.</p></header>
        ${getLinkedDocumentPickerMarkup({ collection: game.journal, selectedIds: data.journalId, inputName: "journalId", collectionName: "journal", kindLabel: "Journal", iconClass: "fa-book-open", multiple: false })}
      </section>
      <section class="gmf-content-section">
        <header><h3>GM Notes</h3><p>Private notes shown only to GMs.</p></header>
        <label class="gmf-content-section__control">Notes<textarea name="notes" rows="4">${escapeHtml(data.notes)}</textarea></label>
      </section>`;

    if (creating) return `
      <form class="gmf-crud-form gmf-system-form gmf-system-form--create">
        ${hiddenFields}
        <div class="gmf-quick-create__identity">
          <label>Name <input type="text" name="name" value="${escapeHtml(data.name)}" required autofocus /></label>
          <label>Type <select name="type">${optionList(SYSTEM_TYPES, data.type)}</select></label>
        </div>
        ${getMarkerComposerMarkup(data, iconColorValue, { quick: true })}
        <details class="gmf-more-options">
          <summary>More options</summary>
          <div class="gmf-more-options__content">
            <div class="gmf-form-grid">
              <label>Faction <select name="factionId">${optionList(factionOptions, data.factionId)}</select></label>
              <label>Status <select name="status">${optionList(SYSTEM_STATUSES, data.status)}</select></label>
            </div>
            <div class="gmf-form-grid">
              <label>Visibility <select name="visibility">${optionList(VISIBILITIES, data.visibility)}</select></label>
              <label>Marker Size <input type="range" name="iconSize" value="${escapeHtml(data.iconSize)}" min="18" max="56" step="1" /></label>
            </div>
            <label class="gmf-checkbox-label"><input type="checkbox" name="pulse" value="true" ${data.pulse ? "checked" : ""} /> Pulse Glow</label>
          </div>
        </details>
      </form>`;

    return `
      <form class="gmf-crud-form gmf-system-form gmf-system-form--edit">
        ${hiddenFields}
        <nav class="gmf-system-editor-tabs" role="tablist" aria-label="System editor sections">
          <button type="button" role="tab" data-system-editor-tab="overview"><i class="fa-solid fa-circle-info" aria-hidden="true"></i>Overview</button>
          <button type="button" role="tab" data-system-editor-tab="planet"><i class="fa-solid fa-globe" aria-hidden="true"></i>Planet</button>
          <button type="button" role="tab" data-system-editor-tab="content"><i class="fa-solid fa-link" aria-hidden="true"></i>Content</button>
        </nav>
        <section class="gmf-system-editor-panel gmf-system-editor-panel--overview" role="tabpanel" data-system-editor-panel="overview">
          <div class="gmf-overview-fields">
            <label>Name <input type="text" name="name" value="${escapeHtml(data.name)}" required autofocus /></label>
            <div class="gmf-form-grid">
              <label>Type <select name="type">${optionList(SYSTEM_TYPES, data.type)}</select></label>
              <label>Status <select name="status">${optionList(SYSTEM_STATUSES, data.status)}</select></label>
            </div>
            <div class="gmf-form-grid">
              <label>Faction <select name="factionId">${optionList(factionOptions, data.factionId)}</select></label>
              <label>Visibility <select name="visibility">${optionList(VISIBILITIES, data.visibility)}</select></label>
            </div>
            <label>Description <textarea name="description" rows="3">${escapeHtml(data.description)}</textarea></label>
          </div>
          <div class="gmf-overview-marker"><h3>Map Appearance</h3>${getMarkerComposerMarkup(data, iconColorValue)}</div>
        </section>
        <section class="gmf-system-editor-panel gmf-system-editor-panel--planet" role="tabpanel" data-system-editor-panel="planet" hidden>
          ${planetWorkspace}
        </section>
        <section class="gmf-system-editor-panel gmf-system-editor-panel--content" role="tabpanel" data-system-editor-panel="content" hidden>
          ${contentWorkspace}
        </section>
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
        <label>Player Travel Approval <select name="travelApprovalMode">${optionList(TRAVEL_APPROVAL_OPTIONS, data.travelApprovalMode)}</select></label>
        <p class="gmf-form-help">GM approval asks only the primary online GM. Majority counts the requester as an approval and passes at more than half of active participants. Unanimous asks every other active participant and cancels on any decline.</p>
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
      content: getSystemDialogContent(mapId, system ?? { id: randomId("system"), name: "New System" }, defaults, !system),
      submitLabel: system ? "Save System" : "Create System",
      width: system ? 860 : 540,
      height: system ? Math.min(760, Math.max(360, window.innerHeight - 64)) : "auto",
      dialogClass: system ? "gmf-system-edit-dialog" : "gmf-system-create-dialog",
      onSubmit: (values) => upsertSystem(mapId, {
        ...values,
        sceneIds: values.sceneIds ?? [],
        pulse: values.pulse === "true"
      })
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
      travelApprovalModeLabel: TRAVEL_APPROVAL_OPTIONS.find(option => option.value === normalized.travelApprovalMode)?.label ?? "Unanimous agreement",
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

  function getSceneIdsForSystem(mapId, systemId) {
    const rawMap = getRawMap(mapId);
    if (!rawMap) return [];
    const system = normalizeMap(rawMap).systems.find((candidate) => candidate.id === String(systemId));
    return system ? [...system.sceneIds] : [];
  }

  function getSystemsForScene(sceneId) {
    const targetSceneId = String(sceneId || "");
    if (!targetSceneId) return [];
    return getMaps().flatMap((map: any) => map.systems
      .filter((system: any) => system.sceneIds.includes(targetSceneId))
      .map((system: any) => ({
        mapId: map.id,
        mapTitle: map.title,
        system: clone(system)
      })));
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
      width: 420
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
    const from = currentMap.systems.find(system => system.id === currentMap.currentSystemId);
    const to = currentMap.systems.find(system => system.id === payload.toSystemId);
    const route = from && to ? getTravelRoute(currentMap, from.id, to.id) : null;
    if (!requester || currentMap.visibility !== "players" || !from || !to || from.id === to.id
      || from.visibility !== "players" || to.visibility !== "players" || !route || route.visibility !== "players") return null;
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
      fromSystemId: from.id,
      fromName: from.name,
      toSystemId: to.id,
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
    promptedTravelRequests.delete(pending.requestId);
    travelRequestPrompts.get(pending.requestId)?.resolve();
    travelRequestPrompts.delete(pending.requestId);
    latestTravelProgress.delete(pending.requestId);
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
    hideFactionFromPlayers,
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
      `${TEMPLATE_ROOT}/celestial-icon.hbs`,
      `${TEMPLATE_ROOT}/system-details.hbs`
    ]);
  });

  // HoloSuite Core is the suite launcher; keep this module out of the scene-control toolbar.

  Hooks.once("ready", () => {
    game.galaxyMap = {
      openMap,
      focusSystem,
      clearSystemFocus,
      openMapManager,
      openGalaxyMapFromSceneControls,
      openPlayerMapChooser,
      createMap,
      getMaps,
      getSceneIdsForSystem,
      getSystemsForScene,
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
      hideFactionFromPlayers,
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

