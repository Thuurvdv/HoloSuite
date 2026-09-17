import {
  ANIMATED_CELESTIAL_STYLES,
  GALAXY_SCHEMA_VERSION,
  ICON_STYLE_OPTIONS,
  OBJECT_KINDS,
  OBJECT_VISIBILITIES,
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
  normalizePlanetLocation,
  normalizePlanetLocations,
  normalizeRoute,
  normalizeSystem,
  normalizeSystemObject,
  randomId
} from "./galaxy-model";
import { createGalaxyMapManagerClass } from "./manager-app";
import { createGalaxyMapViewClass } from "./view-app";
import { getPlanetAppearance, PLANET_FINISH_OPTIONS, PLANET_OPTIONS, PLANET_SHAPE_OPTIONS } from "./planet-presets";
import { evaluateTravelApproval, getTravelElectorate, TRAVEL_APPROVAL_OPTIONS } from "./travel-approval";
import { MODULE_ID, SETTING_MAPS, SETTING_SCHEMA_V1_BACKUP, SETTING_SURFACE_LOCATION_RECOVERY, SOCKET_NAME, TEMPLATE_ROOT } from "./constants";
import { downloadJson, escapeHtml, getFormValues, getHtmlElement, optionList, slugify } from "./dom-utils";
import { activateGalaxyDialogChrome, GALAXY_DIALOG_OPTIONS } from "./window-chrome";

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
    const surfaceStrengthInput = root?.querySelector('[name="planetDetailStrength"]');
    const surfaceStrengthOutput = root?.querySelector("[data-surface-strength-output]");
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
    surfaceStrengthInput?.addEventListener("input", () => {
      if (surfaceStrengthOutput) surfaceStrengthOutput.value = `${surfaceStrengthInput.value}%`;
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
        image: system.image,
        sceneIds: [...system.sceneIds],
        journalId: system.journalId,
        planetPreset: system.planetPreset,
        planetShape: system.planetShape,
        planetTexture: system.planetTexture,
        planetColor: system.planetColor,
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
    if (!maps[mapId]) {
      notifyError(`Map "${mapId}" was not found.`);
      return null;
    }
    const map = normalizeMap(maps[mapId]);
    const existing = map.systems.find((candidate) => candidate.id === systemData.id);
    const objects = systemData.objects ?? existing?.objects ?? [];
    const primaryId = existing?.primaryObjectId || objects[0]?.id;
    const objectFields = ["image", "sceneIds", "planetLocations", "journalId", "planetPreset", "planetShape", "planetFinish", "planetDetailStrength", "planetTexture", "planetColor"];
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

  async function mergeSystems(mapId, sourceSystemId, destinationSystemId) {
    if (!requireGM("merge star systems")) return null;
    if (!sourceSystemId || !destinationSystemId || sourceSystemId === destinationSystemId) return null;
    const maps = getMapStore();
    if (!maps[mapId]) return null;
    const map = normalizeMap(maps[mapId]);
    const source = map.systems.find((system) => system.id === sourceSystemId);
    const destination = map.systems.find((system) => system.id === destinationSystemId);
    if (!source || !destination) return null;
    const existingIds = new Set(destination.objects.map((object) => object.id));
    destination.objects.push(...source.objects.filter((object) => !existingIds.has(object.id)));
    if (!destination.primaryObjectId) destination.primaryObjectId = source.primaryObjectId || destination.objects[0]?.id || "";
    map.systems = map.systems.filter((system) => system.id !== sourceSystemId);
    const seenRoutes = new Set<string>();
    map.routes = map.routes.map((route) => ({
      ...route,
      fromSystemId: route.fromSystemId === sourceSystemId ? destinationSystemId : route.fromSystemId,
      toSystemId: route.toSystemId === sourceSystemId ? destinationSystemId : route.toSystemId
    })).filter((route) => {
      if (route.fromSystemId === route.toSystemId) return false;
      const key = [route.fromSystemId, route.toSystemId].sort().join(":");
      if (seenRoutes.has(key)) return false;
      seenRoutes.add(key);
      return true;
    });
    if (map.currentLocation.systemId === sourceSystemId) map.currentLocation.systemId = destinationSystemId;
    map.currentSystemId = map.currentLocation.systemId;
    maps[mapId] = normalizeMap(map);
    await saveMapStore(maps);
    refreshOpenApps(mapId);
    game.socket.emit(SOCKET_NAME, { action: "refresh", mapId });
    return clone(destination);
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

  function getSurfaceLocationManagerMarkup(data: any) {
    const rows = (data.planetLocations ?? []).map((location: any) => {
      const scene = game.scenes?.get?.(location.sceneId);
      const linked = data.sceneIds.includes(location.sceneId);
      return `<label class="gmf-surface-location-manager__row">
        <span><i class="fa-solid fa-location-dot"></i><strong>${escapeHtml(scene?.name || "Missing scene")}</strong><small>${escapeHtml(location.shape)}${linked ? "" : " · no longer linked"}</small></span>
        <span><input type="checkbox" name="removePlanetLocationIds" value="${escapeHtml(location.id)}" /> Remove</span>
      </label>`;
    }).join("");
    return rows ? `<section class="gmf-surface-location-manager">
      <header><h3>Surface Locations</h3><p>Mark locations for removal, then save. This includes markers on other 3D shapes or scenes that are no longer linked.</p></header>
      <div>${rows}</div>
    </section>` : "";
  }

  function getSystemDialogContent(mapId, system = {}, defaults = {}, creating = false) {
    const data = normalizeSystem({ ...defaults, ...system });
    const hiddenFields = `
      <input type="hidden" name="id" value="${escapeHtml(data.id)}" />
      <input type="hidden" name="x" value="${escapeHtml(data.x)}" />
      <input type="hidden" name="y" value="${escapeHtml(data.y)}" />`;

    if (creating) return `
      <form class="gmf-crud-form gmf-system-form gmf-system-form--create">
        ${hiddenFields}
        <label>System name <input type="text" name="name" value="${escapeHtml(data.name)}" required autofocus /></label>
        <details class="gmf-more-options">
          <summary>More options</summary>
          <div class="gmf-more-options__content">
            <div class="gmf-form-grid">
              <label>Status <select name="status">${optionList(SYSTEM_STATUSES, data.status)}</select></label>
              <label>Visibility <select name="visibility">${optionList(VISIBILITIES, data.visibility)}</select></label>
            </div>
            <label>Description <textarea name="description" rows="3">${escapeHtml(data.description)}</textarea></label>
          </div>
        </details>
      </form>`;

    return `
      <form class="gmf-crud-form gmf-system-form gmf-system-form--edit">
        ${hiddenFields}
        <label>System name <input type="text" name="name" value="${escapeHtml(data.name)}" required autofocus /></label>
        <div class="gmf-form-grid">
          <label>Status <select name="status">${optionList(SYSTEM_STATUSES, data.status)}</select></label>
          <label>Visibility <select name="visibility">${optionList(VISIBILITIES, data.visibility)}</select></label>
        </div>
        <label>Description <textarea name="description" rows="5">${escapeHtml(data.description)}</textarea></label>
        <p class="gmf-form-help">Planets, stars, stations, factions, linked content, and 3D appearance are configured on entities inside this system.</p>
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
      title: system ? "Edit System" : "Create System",
      content: getSystemDialogContent(mapId, system ?? { id: randomId("system"), name: "New System" }, defaults, !system),
      submitLabel: system ? "Save System" : "Create System",
      width: system ? 860 : 540,
      height: system ? Math.min(760, Math.max(360, window.innerHeight - 64)) : "auto",
      dialogClass: system ? "gmf-system-edit-dialog" : "gmf-system-create-dialog",
      onSubmit: (values) => {
        const removalIds = new Set((Array.isArray(values.removePlanetLocationIds)
          ? values.removePlanetLocationIds : [values.removePlanetLocationIds]).filter(Boolean).map(String));
        delete values.removePlanetLocationIds;
        const primary = system ? normalizeSystem(system).objects.find((object: any) => object.id === normalizeSystem(system).primaryObjectId) : null;
        return upsertSystem(mapId, {
          ...values,
          sceneIds: values.sceneIds ?? [],
          planetLocations: (primary?.planetLocations ?? []).filter((location: any) => !removalIds.has(location.id)),
          pulse: values.pulse === "true"
        });
      }
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
            }, GALAXY_DIALOG_OPTIONS);
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

  function getObjectDialogContent(mapId, systemId, object: any = {}, defaults: any = {}) {
    const map = normalizeMap(getRawMap(mapId));
    const data = normalizeSystemObject({ ...defaults, ...object });
    const systemOptions = map.systems.map((system) => ({ value: system.id, label: system.name }));
    const factionOptions = [{ value: "", label: "Inherit system faction" }, ...map.factions.map((faction) => ({ value: faction.id, label: faction.name }))];
    return `<form class="gmf-crud-form gmf-object-form">
      <input type="hidden" name="id" value="${escapeHtml(data.id)}" />
      <input type="hidden" name="x" value="${escapeHtml(data.x)}" />
      <input type="hidden" name="y" value="${escapeHtml(data.y)}" />
      <div class="gmf-form-grid">
        <label>Name <input type="text" name="name" value="${escapeHtml(data.name)}" required autofocus /></label>
        <label>System <select name="systemId">${optionList(systemOptions, systemId)}</select></label>
      </div>
      <div class="gmf-form-grid">
        <label>Entity type <select name="kind">${optionList(OBJECT_KINDS, data.kind)}</select></label>
        <label>Status <select name="status">${optionList(SYSTEM_STATUSES, data.status)}</select></label>
      </div>
      <label>Description <textarea name="description" rows="4">${escapeHtml(data.description)}</textarea></label>
      <div class="gmf-form-grid">
        <label>Visibility <select name="visibility">${optionList(OBJECT_VISIBILITIES, data.visibility)}</select></label>
        <label>Faction <select name="factionId">${optionList(factionOptions, data.factionId)}</select></label>
      </div>
      ${getMarkerComposerMarkup({ ...data, type: data.kind }, data.iconColor || "#58d8ff")}
      <fieldset><legend>Detail view</legend>
        <div class="gmf-form-grid">
          <label>Appearance <select name="planetPreset">${optionList(PLANET_OPTIONS, data.planetPreset)}</select></label>
          <label>3D shape <select name="planetShape">${optionList(PLANET_SHAPE_OPTIONS, data.planetShape)}</select></label>
          <label>Surface finish <select name="planetFinish">${optionList(PLANET_FINISH_OPTIONS, data.planetFinish)}</select></label>
          <label class="gmf-surface-strength">Detail strength <span><input type="range" name="planetDetailStrength" value="${escapeHtml(data.planetDetailStrength)}" min="0" max="100" step="1" /><output data-surface-strength-output>${escapeHtml(data.planetDetailStrength)}%</output></span></label>
        </div>
        <label>Model color <input type="color" name="planetColor" value="${escapeHtml(data.planetColor)}" /></label>
        <label>Custom texture <div class="gmf-path-field"><input type="text" name="planetTexture" value="${escapeHtml(data.planetTexture)}" /><button type="button" data-browse-target="planetTexture"><i class="fa-solid fa-folder-open"></i> Browse</button></div></label>
        ${getSurfaceLocationManagerMarkup(data)}
      </fieldset>
      <fieldset><legend>Linked content</legend>
        <label>Image <div class="gmf-path-field"><input type="text" name="image" value="${escapeHtml(data.image)}" /><button type="button" data-browse-target="image"><i class="fa-solid fa-folder-open"></i> Browse</button></div></label>
        ${getLinkedDocumentPickerMarkup({ collection: game.scenes, selectedIds: data.sceneIds, inputName: "sceneIds", collectionName: "scenes", kindLabel: "Scene", iconClass: "fa-image", multiple: true })}
        ${getLinkedDocumentPickerMarkup({ collection: game.journal, selectedIds: data.journalId, inputName: "journalId", collectionName: "journal", kindLabel: "Journal", iconClass: "fa-book-open", multiple: false })}
      </fieldset>
      <label>GM notes <textarea name="notes" rows="3">${escapeHtml(data.notes)}</textarea></label>
    </form>`;
  }

  function openObjectDialog(mapId, systemId, objectId = null, defaults = {}) {
    const map = normalizeMap(getRawMap(mapId));
    const sourceSystem = map.systems.find((system) => system.id === systemId);
    const existing = objectId ? sourceSystem?.objects.find((object) => object.id === objectId) : null;
    renderCrudDialog({
      title: existing ? `Edit ${existing.name}` : "Add Entity",
      content: getObjectDialogContent(mapId, systemId, existing ?? { id: randomId("object"), name: "New Object" }, defaults),
      submitLabel: existing ? "Save Entity" : "Add Entity",
      width: 760,
      height: Math.min(760, Math.max(420, window.innerHeight - 64)),
      onSubmit: async (values) => {
        const destinationSystemId = String(values.systemId || systemId);
        if (existing && destinationSystemId !== systemId) await moveObject(mapId, existing.id, destinationSystemId);
        const removalIds = new Set((Array.isArray(values.removePlanetLocationIds)
          ? values.removePlanetLocationIds : [values.removePlanetLocationIds]).filter(Boolean).map(String));
        delete values.removePlanetLocationIds;
        return upsertObject(mapId, destinationSystemId, {
          ...existing, ...values, sceneIds: values.sceneIds ?? [],
          planetLocations: (existing?.planetLocations ?? []).filter((location: any) => !removalIds.has(location.id)),
          pulse: values.pulse === "true"
        });
      }
    });
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
    openObjectDialog,
    openRouteDialog,
    openFactionDialog,
    exportMap,
    duplicateMap,
    deleteMap,
    createMap,
    deleteSystem,
    deleteObject,
    setPrimaryObject,
    mergeSystems,
    deleteRoute,
    deleteFaction,
    openMap,
    showMapToPlayers,
    closePlayerMap,
    hideSystemFromPlayers,
    setObjectVisibility,
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
    openObjectDialog,
    upsertObject,
    openRouteDialog,
    openFactionDialog,
    openFactionManagerDialog,
    openMapMetadataDialog,
    revealSystemToPlayers,
    revealRouteToPlayers,
    hideSystemFromPlayers,
    hideRouteFromPlayers,
    deleteSystem,
    deleteObject,
    deleteRoute,
    setCurrentSystem,
    setCurrentObject,
    requestTravelToSystem,
    notifySystemDiscovered,
    exportMap,
    getTravelRoute,
    broadcastTravelAnimation,
    notifyInfo,
    notifyError,
    saveSystemPosition,
    saveObjectPosition,
    savePlanetLocation,
    removePlanetLocation,
    unlinkPlanetScene,
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
      `${TEMPLATE_ROOT}/system-details.hbs`
    ]);
  });

  // HoloSuite Core is the suite launcher; keep this module out of the scene-control toolbar.

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
      closePlayerMap,
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
      mergeSystems,
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
      notifySystemDiscovered,
      requestTravelToSystem,
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
        notifyInfo("Galaxy maps upgraded to the Galaxy → System → Entity structure. Existing map contents were placed in System 1 and the schema v1 backup was retained.");
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
          notifyInfo(`Restored ${recovered} planet surface location${recovered === 1 ? "" : "s"} from the schema backup.`);
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

