import {
  MAX_ZOOM,
  MIN_ZOOM,
  ANIMATED_CELESTIAL_STYLES,
  TRAVEL_ANIMATION_MS,
  clamp,
  getEffectiveObjectVisibility,
  normalizeMap
} from "./galaxy-model";
import { buildTerritories } from "./territories";
import { getPlanetAppearance, isDefaultStaticPlanetAppearance } from "./planet-presets";
import { getBountyIntelForSystem, openBountyIntel } from "./bounty-integration";
import { createPlanetIntelCallout } from "./planet-intel-callout";
import { createPlanetLocationCallout, type PlanetLocationItem } from "./planet-location-callout";
import { bindFilePickerFields, escapeHtml } from "./dom-utils";
import { activateGalaxyWindowChrome, GALAXY_DIALOG_OPTIONS } from "./window-chrome";
import { getApplicationBase } from "./app-base";

declare const foundry: any;
declare const Dialog: any;
declare const game: any;

function getSceneDropData(event: DragEvent) {
  // v13 moved TextEditor into a namespace; v12 only has the global.
  const TextEditorClass = foundry.applications?.ux?.TextEditor ?? (globalThis as any).TextEditor;
  return TextEditorClass.getDragEventData(event) ?? {};
}

async function resolveDroppedDocument(event: DragEvent) {
  const data = getSceneDropData(event);
  const fromUuidFunction = (globalThis as any).fromUuid;
  const document = data.uuid && fromUuidFunction ? await fromUuidFunction(data.uuid) : null;
  if (["Scene", "JournalEntry"].includes(document?.documentName)) return document;
  const id = String(data.sceneId || data.journalId || data.id || "");
  if (!id) return null;
  if (data.type === "Scene") return game.scenes?.get?.(id) ?? null;
  if (["JournalEntry", "Journal"].includes(data.type)) return game.journal?.get?.(id) ?? null;
  return game.scenes?.get?.(id) ?? game.journal?.get?.(id) ?? null;
}

async function resolveDroppedScene(event: DragEvent) {
  const document = await resolveDroppedDocument(event);
  return document?.documentName === "Scene" ? document : null;
}

export function createGalaxyMapViewClass(deps: any) {
  const {
    templateRoot,
    getRawMap,
    prepareMapForDisplay,
    upsertSystem,
    upsertObject,
    upsertRoute,
    upsertFaction,
    updateMapMetadata,
    deleteFaction,
    getTextureGuideMarkup,
    activateObjectEditorControls,
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
    clearMapView
  } = deps;

  return class GalaxyMapView extends getApplicationBase() {
    mapId: string;
    playerMode: boolean;
    selectedSystemId: string | null;
    selectedRouteId: string | null;
    activeSystemId: string | null;
    selectedObjectId: string | null;
    zoom: number;
    panX: number;
    panY: number;
    _drag: any;
    _contextTarget: any;
    _boundContextClose: any;
    externalFocus: any;
    _externalFocusTimeout: any;
    _pendingFocusZoom: number | null;
    showTerritories = true;
    showRoutes = true;
    hardContrast = false;
    planetSystemId: string | null = null;
    planetStatic = false;
    _planetStaticViewKey: string | null = null;
    _planetRenderer: any = null;
    _planetGeneration = 0;
    _planetReturnFocus = false;
    _bountyIntelCallout: any = null;
    _planetLocationCallout: any = null;
    creationPanel: any = null;
    factionRegistry = false;
    _selectionTimer: any = null;
    _worldWidth = 0;
    _worldHeight = 0;
    _viewportResizeObserver: ResizeObserver | null = null;
    _baseWindowHeight: number | null = null;

    static DEFAULT_OPTIONS = {
      id: "galaxy-map-view",
      classes: ["galaxy-map", "galaxy-map-framework", "gmf-map-window"],
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
        template: `${templateRoot}/galaxy-map.hbs`
      }
    };

    constructor(options: any = {}) {
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
      this.activeSystemId = options.activeSystemId ?? null;
      this.selectedObjectId = options.selectedObjectId ?? null;
      this.zoom = 1;
      this.panX = 0;
      this.panY = 0;
      this._drag = null;
      this._contextTarget = null;
      this._boundContextClose = null;
      this.externalFocus = null;
      this._externalFocusTimeout = null;
      this._pendingFocusZoom = null;
    }

    get title() {
      const map = getRawMap(this.mapId);
      const suffix = this.playerMode ? "Player View" : "GM View";
      return map ? `${map.title} - ${suffix}` : `Galaxy Map - ${suffix}`;
    }

    async _prepareContext(options: any) {
      const context = await super._prepareContext(options);
      const rawMap = getRawMap(this.mapId);
      const displayMap = rawMap ? prepareMapForDisplay(rawMap, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      }) : null;
      if (displayMap?.systems) {
        displayMap.systems = displayMap.systems.map((system: any) => ({
          ...system,
          displayType: "system",
          factionName: "System",
          factionColor: "#58d8ff",
          animatedCelestial: false,
          hasCustomMarker: Boolean(system.displayMarkerImage)
        }));
        if (displayMap.selectedSystem) {
          displayMap.selectedSystem = displayMap.systems.find((system: any) => system.id === displayMap.selectedSystem.id) ?? null;
        }
      }
      if (displayMap?.systems && this.externalFocus) {
        displayMap.systems = displayMap.systems.map((system: any) => system.id === this.externalFocus.systemId
          ? { ...system, isExternalFocus: true, externalFocus: this.externalFocus }
          : system);
        if (displayMap.selectedSystem?.id === this.externalFocus.systemId) {
          displayMap.selectedSystem = displayMap.systems.find((system: any) => system.id === this.externalFocus.systemId);
        }
      }
      if (!this.activeSystemId && this.selectedSystemId && !displayMap?.selectedSystem) this.selectedSystemId = null;
      const activeSystem = displayMap?.systems.find((system: any) => system.id === this.activeSystemId) ?? null;
      if (activeSystem) displayMap.backgroundImage = activeSystem.backgroundImage || "";
      const factionLookup = new Map((displayMap?.factions ?? []).map((faction: any) => [faction.id, faction]));
      const systemObjects = activeSystem ? activeSystem.objects
        .filter((object: any) => !this.playerMode || getEffectiveObjectVisibility(activeSystem, object) === "players")
        .map((object: any) => {
          const obscured = this.playerMode && object.status === "undiscovered";
          const faction: any = factionLookup.get(object.factionId);
          const displayMarkerImage = obscured ? "" : object.markerImage;
          return {
            ...object,
            systemId: activeSystem.id,
            displayName: obscured ? "???" : object.name,
            displayDescription: obscured ? "Unresolved sensor contact. Details are not available." : object.description,
            displayType: obscured ? "unknown" : object.kind,
            displayStatus: obscured ? "undiscovered" : object.status,
            factionName: faction?.name ?? "Unaffiliated",
            factionColor: object.iconColor || faction?.color || "#58d8ff",
            displayMarkerImage,
            hasCustomMarker: Boolean(displayMarkerImage),
            obscured,
            gmOnly: getEffectiveObjectVisibility(activeSystem, object) === "gm",
            isSelected: object.id === this.selectedObjectId,
            isCurrent: displayMap?.currentLocation?.objectId === object.id,
            animatedCelestial: !displayMarkerImage && ANIMATED_CELESTIAL_STYLES.includes(object.iconStyle),
            hasJournal: Boolean(!obscured && object.journalId),
            hasScenes: Boolean(!obscured && object.sceneIds.length),
            showImage: Boolean(!obscured && object.image),
            canInspectSystem: Boolean(getPlanetAppearance({ ...object, obscured }))
          };
        }) : [];
      if (activeSystem && this.selectedObjectId && !systemObjects.some((object: any) => object.id === this.selectedObjectId)) this.selectedObjectId = null;
      const selectedObject = systemObjects.find((object: any) => object.id === this.selectedObjectId) ?? null;
      const visibleObjectIds = new Set(systemObjects.map((object: any) => object.id));
      const systemRoutes = activeSystem ? (activeSystem.routes ?? [])
        .filter((route: any) => (!this.playerMode || route.visibility === "players")
          && visibleObjectIds.has(route.fromSystemId) && visibleObjectIds.has(route.toSystemId))
        .map((route: any) => {
          const from = systemObjects.find((object: any) => object.id === route.fromSystemId);
          const to = systemObjects.find((object: any) => object.id === route.toSystemId);
          return {
            ...route, from, to,
            fromName: from?.displayName ?? route.fromSystemId,
            toName: to?.displayName ?? route.toSystemId,
            isSelected: route.id === this.selectedRouteId,
            isActive: route.id === this.selectedRouteId,
            gmOnly: route.visibility === "gm"
          };
        }) : [];
      const selectedSystemRoute = systemRoutes.find((route: any) => route.id === this.selectedRouteId) ?? null;
      const currentObject = systemObjects.find((object: any) => object.isCurrent) ?? null;
      const selectedObjectTravelRoute = selectedObject && currentObject && selectedObject.id !== currentObject.id
        ? systemRoutes.find((route: any) => (
          (route.fromSystemId === currentObject.id && route.toSystemId === selectedObject.id)
          || (route.toSystemId === currentObject.id && route.fromSystemId === selectedObject.id)
        ))
        : null;
      if (selectedObject) {
        selectedObject.canTravel = Boolean(selectedObjectTravelRoute);
        selectedObject.isDestination = Boolean(selectedObjectTravelRoute && !selectedObject.isCurrent);
        selectedObject.travelRouteId = selectedObjectTravelRoute?.id ?? "";
      }
      systemRoutes.forEach((route: any) => {
        route.isActive = route.isSelected || route.id === selectedObjectTravelRoute?.id;
      });
      if (activeSystem) {
        displayMap.systems = systemObjects;
        displayMap.routes = systemRoutes;
        displayMap.selectedSystem = selectedSystemRoute ? null : selectedObject;
        displayMap.selectedRoute = selectedSystemRoute;
        displayMap.currentSystem = currentObject;
      }
      const planetSystem = systemObjects.find((object: any) => object.id === this.planetSystemId)
        ?? (!activeSystem ? displayMap?.systems.find((system: any) => system.id === this.planetSystemId) : null);
      const planetAppearance = (!this.playerMode || rawMap?.visibility === "players")
        ? getPlanetAppearance(planetSystem) : null;
      if (!planetAppearance) this.planetSystemId = null;
      const planetStaticViewKey = planetSystem && planetAppearance ? `${planetSystem.id}:${planetAppearance.preset}` : null;
      if (planetStaticViewKey !== this._planetStaticViewKey) {
        this._planetStaticViewKey = planetStaticViewKey;
        this.planetStatic = Boolean(planetStaticViewKey && isDefaultStaticPlanetAppearance(planetAppearance?.preset));
      }
      const planetLocations = planetSystem && planetAppearance ? this._preparePlanetLocations(planetSystem, planetAppearance.shape) : [];
      const linkedContentEntity = planetSystem ?? selectedObject;
      const canPlacePlanetLocations = Boolean(game.user?.isGM && !this.playerMode && activeSystem && linkedContentEntity);
      const linkedPlanetScenes = (linkedContentEntity?.sceneIds ?? [])
        .map((sceneId: string) => game.scenes?.get?.(sceneId)).filter((scene: any) => scene && (game.user?.isGM || scene.testUserPermission?.(game.user, "OBSERVER")))
        .map((scene: any) => ({ id: scene.id, uuid: scene.uuid, name: scene.name || "Linked Scene" }));
      const journal = linkedContentEntity?.journalId ? game.journal?.get?.(linkedContentEntity.journalId) : null;
      const linkedPlanetJournal = journal && (game.user?.isGM || journal.testUserPermission?.(game.user, "OBSERVER"))
        ? { id: journal.id, uuid: journal.uuid, name: journal.name || "Linked Journal" } : null;
      const creationPanel = this.creationPanel ? {
        ...this.creationPanel,
        ...this.creationPanel.data,
        kind: this.creationPanel.kind,
        entityKind: this.creationPanel.data?.kind,
        isSystem: this.creationPanel.kind === "system",
        isEntity: this.creationPanel.kind === "entity",
        isRoute: this.creationPanel.kind === "route",
        isFaction: this.creationPanel.kind === "faction",
        isMap: this.creationPanel.kind === "map",
        mapTitle: this.creationPanel.data?.title,
        title: this.creationPanel.kind === "map" ? "Edit Galaxy" : `${this.creationPanel.editId ? "Edit" : "Create"} ${({ system: "System", entity: "Entity", route: "Route", faction: "Faction" } as any)[this.creationPanel.kind]}`,
        submitLabel: this.creationPanel.editId ? "Save changes" : "Create",
        systemOptions: (activeSystem ? systemObjects : displayMap?.systems ?? [])
          .map((endpoint: any) => ({ id: endpoint.id, name: endpoint.displayName || endpoint.name })),
        factionOptions: (displayMap?.factions ?? []).map((faction: any) => ({ id: faction.id, name: faction.name }))
      } : null;
      return {
        ...context,
        map: displayMap,
        systemView: Boolean(activeSystem && !planetAppearance),
        activeSystem,
        selectedObject,
        planetView: Boolean(planetAppearance),
        planetSystem,
        planetAppearance,
        planetLocations,
        hasPlanetLocations: planetLocations.length > 0,
        canPlacePlanetLocations,
        linkedPlanetScenes,
        linkedPlanetJournal,
        creationPanel,
        factionRegistry: this.factionRegistry,
        appearanceGuideMarkup: creationPanel?.isEntity ? getTextureGuideMarkup(creationPanel.planetShape || "sphere") : "",
        showInspector: Boolean(creationPanel || this.factionRegistry || planetAppearance || displayMap?.selectedSystem || displayMap?.selectedRoute),
        territories: displayMap ? buildTerritories(displayMap.systems, displayMap.factions) : [],
        showTerritories: this.showTerritories,
        showRoutes: this.showRoutes,
        hardContrast: this.hardContrast,
        mapId: this.mapId,
        playerMode: this.playerMode,
        zoomPercent: Math.round(this.zoom * 100),
        panX: this.panX,
        panY: this.panY,
        zoom: this.zoom,
        missingMap: !rawMap
      };
    }

    _onRender(context: any, options: any) {
      this._bountyIntelCallout?.dispose();
      this._bountyIntelCallout = null;
      this._disposePlanetRenderer();
      super._onRender(context, options);
      const html = this.element;
      if (html) {
        this._attachPartListeners("main", html, options);
        this._observeViewport(html);
        this._mountBountyIntelCallout(html);
        if (this.externalFocus && this._pendingFocusZoom !== null) {
          const system = normalizeMap(getRawMap(this.mapId)).systems.find((candidate: any) => candidate.id === this.externalFocus.systemId);
          if (system) this._centerOnSystem(system, html, this._pendingFocusZoom);
          this._pendingFocusZoom = null;
        }
        if (context.planetView) void this._mountPlanetRenderer(html, context.planetAppearance);
        else if (this._planetReturnFocus) {
          html.querySelector("[data-action='inspect-system']")?.focus();
          this._planetReturnFocus = false;
        }
      }
    }

    _attachPartListeners(partId: string, html: any, options: any) {
      const boundStage = html.matches?.(".gmf-map-stage") ? html : html.querySelector?.(".gmf-map-stage, .gmf-planet-stage");
      if (boundStage?.dataset.gmfMapBound === "true") return;
      if (boundStage) boundStage.dataset.gmfMapBound = "true";
      const stage = boundStage?.matches?.(".gmf-map-stage") ? boundStage : null;
      super._attachPartListeners(partId, html, options);
      activateGalaxyWindowChrome(this, html);
      this._attachPlanetListeners(html);
      this._attachCreationPanel(html);
      const appearancePanel = html.querySelector<HTMLElement>(".gmf-object-appearance-panel");
      if (appearancePanel) {
        activateObjectEditorControls(appearancePanel);
        this._attachAppearancePreview(html);
      }
      html.querySelector("[data-action='toggle-territories']")?.addEventListener("click", () => {
        this.showTerritories = !this.showTerritories;
        this.render({ force: true });
      });
      html.querySelector("[data-action='toggle-routes']")?.addEventListener("click", () => {
        this.showRoutes = !this.showRoutes;
        this.render({ force: true });
      });
      html.querySelector("[data-action='edit-current-layer']")?.addEventListener("click", () => {
        if (!game.user?.isGM || this.playerMode) return;
        if (this.activeSystemId) this._openEditPanel("system", this.activeSystemId);
        else this._openCreationPanel("map", normalizeMap(getRawMap(this.mapId)), this.mapId);
      });
      html.querySelector("[data-action='toggle-hard-contrast']")?.addEventListener("click", (event: MouseEvent) => {
        this.hardContrast = !this.hardContrast;
        const galaxy = html.matches?.(".gmf-galaxy") ? html : html.querySelector(".gmf-galaxy");
        galaxy?.classList.toggle("is-hard-contrast", this.hardContrast);
        (event.currentTarget as HTMLElement).setAttribute("aria-pressed", String(this.hardContrast));
      });
      this._applyViewportTransform(html);

      html.querySelectorAll("[data-system-id]").forEach((node: any) => {
        node.addEventListener("click", (event: any) => {
          if (node.dataset.dragged === "true") {
            node.dataset.dragged = "false";
            return;
          }
          event.stopPropagation();
          if (this._selectionTimer) clearTimeout(this._selectionTimer);
          this._selectionTimer = globalThis.setTimeout(() => {
            if (this.activeSystemId) this.selectedObjectId = node.dataset.systemId;
            else this.selectedSystemId = node.dataset.systemId;
            this.selectedRouteId = null;
            this.render({ force: true });
          }, 180);
        });
        node.addEventListener("dblclick", (event: any) => {
          event.preventDefault();
          event.stopPropagation();
          if (this._selectionTimer) clearTimeout(this._selectionTimer);
          this._selectionTimer = null;
          const id = node.dataset.systemId;
          this.selectedRouteId = null;
          this.creationPanel = null;
          if (this.activeSystemId) {
            this.selectedObjectId = id;
            const object = normalizeMap(getRawMap(this.mapId)).systems.find((system: any) => system.id === this.activeSystemId)
              ?.objects.find((candidate: any) => candidate.id === id);
            if (getPlanetAppearance(object)) this.planetSystemId = id;
          } else {
            this.selectedSystemId = id;
            this.activeSystemId = id;
            this.selectedObjectId = null;
          }
          this.render({ force: true });
        });
        if (!this.playerMode && game.user?.isGM) {
          node.querySelector("[data-resize-marker]")?.addEventListener("pointerdown", (event: any) => this._startMarkerResize(event, node));
          node.addEventListener("pointerdown", (event: any) => this._startSystemDrag(event, html, node));
        }
      });
      this._mountBountyIntelCallout(html);
      html.querySelectorAll("[data-route-id]").forEach((route: any) => {
        route.addEventListener("click", (event: any) => {
          event.stopPropagation();
          this.selectedRouteId = route.dataset.routeId;
          if (this.activeSystemId) this.selectedObjectId = null;
          else this.selectedSystemId = null;
          if (!this.playerMode && game.user?.isGM) {
            this._openEditPanel("route", route.dataset.routeId);
            return;
          }
          this.render({ force: true });
        });
      });
      stage?.addEventListener("wheel", (event: any) => this._onWheelZoom(event, html), { passive: false });
      stage?.addEventListener("pointerdown", (event: any) => this._startPan(event, html));
      stage?.addEventListener("contextmenu", (event: any) => this._openContextMenu(event, html), { capture: true });
      html.querySelectorAll("[data-context-action]").forEach((button: any) => {
        button.addEventListener("click", (event: any) => this._handleContextAction(event, html));
      });
      html.querySelector("[data-action='open-journal']")?.addEventListener("click", () => this._openLinkedJournal());
      html.querySelector("[data-action='edit-system']")?.addEventListener("click", () => {
        if (this.activeSystemId && this.selectedObjectId) this._openEditPanel("entity", this.selectedObjectId);
        else if (this.selectedSystemId) this._openEditPanel("system", this.selectedSystemId);
      });
      html.querySelector("[data-action='open-system']")?.addEventListener("click", () => {
        if (!this.selectedSystemId) return;
        this.activeSystemId = this.selectedSystemId;
        this.selectedObjectId = null;
        this.selectedRouteId = null;
        this.render({ force: true });
      });
      html.querySelector("[data-action='navigate-up']")?.addEventListener("click", () => {
        this.creationPanel = null;
        if (this.planetSystemId) {
          this._disposePlanetRenderer();
          this.planetSystemId = null;
          this._planetReturnFocus = true;
        } else if (this.activeSystemId) {
          this.activeSystemId = null;
          this.selectedObjectId = null;
          this.selectedRouteId = null;
        } else return;
        this.render({ force: true });
      });
      html.querySelector("[data-action='reveal-system']")?.addEventListener("click", () => {
        if (this.activeSystemId && this.selectedObjectId) setObjectVisibility(this.mapId, this.activeSystemId, this.selectedObjectId, "players");
        else if (this.selectedSystemId) revealSystemToPlayers(this.mapId, this.selectedSystemId);
      });
      html.querySelector("[data-action='hide-system']")?.addEventListener("click", () => {
        if (this.activeSystemId && this.selectedObjectId) setObjectVisibility(this.mapId, this.activeSystemId, this.selectedObjectId, "gm");
        else if (this.selectedSystemId) hideSystemFromPlayers(this.mapId, this.selectedSystemId, true);
      });
      html.querySelector("[data-action='delete-system']")?.addEventListener("click", () => {
        if (this.activeSystemId && this.selectedObjectId) this._confirmDeleteObject(this.activeSystemId, this.selectedObjectId);
        else if (this.selectedSystemId) this._confirmDeleteSystem(this.selectedSystemId);
      });
      html.querySelector("[data-action='set-current-system']")?.addEventListener("click", () => {
        if (this.activeSystemId && this.selectedObjectId) setCurrentObject(this.mapId, this.activeSystemId, this.selectedObjectId);
        else if (this.selectedSystemId) setCurrentSystem(this.mapId, this.selectedSystemId);
      });
      html.querySelector("[data-action='travel-to-system']")?.addEventListener("click", () => {
        if (!this.selectedSystemId) return;
        if (this.playerMode) requestTravelToSystem(this.mapId, this.selectedSystemId);
        else this._travelToSystem(this.selectedSystemId, html);
      });
      html.querySelector("[data-action='travel-to-object']")?.addEventListener("click", () => {
        if (!this.activeSystemId || !this.selectedObjectId) return;
        if (this.playerMode) requestTravelToObject(this.mapId, this.activeSystemId, this.selectedObjectId);
        else this._travelToObject(this.activeSystemId, this.selectedObjectId, html);
      });
      html.querySelector("[data-action='edit-route']")?.addEventListener("click", () => {
        if (this.selectedRouteId) this._openEditPanel("route", this.selectedRouteId);
      });
      html.querySelector("[data-action='reveal-route']")?.addEventListener("click", () => {
        if (this.selectedRouteId) revealRouteToPlayers(this.mapId, this.selectedRouteId, this.activeSystemId ?? "");
      });
      html.querySelector("[data-action='hide-route']")?.addEventListener("click", () => {
        if (this.selectedRouteId) hideRouteFromPlayers(this.mapId, this.selectedRouteId, true, this.activeSystemId ?? "");
      });
      html.querySelector("[data-action='delete-route']")?.addEventListener("click", () => {
        if (this.selectedRouteId) this._confirmDeleteRoute(this.selectedRouteId);
      });
    }

    _applyViewportTransform(html: any) {
      const viewport = html.querySelector(".gmf-map-viewport");
      if (!viewport) return;
      const stage = html.querySelector(".gmf-map-stage");
      if (stage) {
        const rect = stage.getBoundingClientRect();
        const background = viewport.querySelector(".gmf-map-background");
        if (background) this.zoom = Math.max(1, this.zoom);
        const imageAspect = background?.naturalWidth && background?.naturalHeight
          ? background.naturalWidth / background.naturalHeight : null;
        if (imageAspect) this._adjustWindowToBackground(stage, imageAspect);
        else if (!background) this._adjustWindowToBackground(stage, null);
        const stageAspect = rect.width / Math.max(1, rect.height);
        if (imageAspect && imageAspect > stageAspect) {
          this._worldWidth = rect.width;
          this._worldHeight = rect.width / imageAspect;
        } else if (imageAspect) {
          this._worldHeight = rect.height;
          this._worldWidth = rect.height * imageAspect;
        } else {
          this._worldWidth = rect.width;
          this._worldHeight = rect.height;
        }
        viewport.style.width = `${this._worldWidth}px`;
        viewport.style.height = `${this._worldHeight}px`;

        const scaledWidth = this._worldWidth * this.zoom;
        const scaledHeight = this._worldHeight * this.zoom;
        this.panX = scaledWidth <= rect.width
          ? (rect.width - scaledWidth) / 2
          : clamp(this.panX, rect.width - scaledWidth, 0);
        this.panY = scaledHeight <= rect.height
          ? (rect.height - scaledHeight) / 2
          : clamp(this.panY, rect.height - scaledHeight, 0);

        if (background && background.dataset.gmfWorldImageBound !== "true") {
          background.dataset.gmfWorldImageBound = "true";
          background.addEventListener("load", () => this._applyViewportTransform(html), { once: true });
        }
      }
      viewport.style.setProperty("--gmf-pan-x", `${this.panX}px`);
      viewport.style.setProperty("--gmf-pan-y", `${this.panY}px`);
      viewport.style.setProperty("--gmf-zoom", String(this.zoom));
      html.querySelector("[data-zoom-label]")?.replaceChildren(`${Math.round(this.zoom * 100)}%`);
    }

    _adjustWindowToBackground(stage: HTMLElement, imageAspect: number | null) {
      const frame = stage.closest<HTMLElement>(".window-app, .application, .app");
      if (!frame || !this.setPosition) return;
      const frameRect = frame.getBoundingClientRect();
      if (!imageAspect) {
        if (this._baseWindowHeight && Math.abs(frameRect.height - this._baseWindowHeight) > 2) {
          this.setPosition({ height: Math.min(this._baseWindowHeight, window.innerHeight - 24) });
        }
        this._baseWindowHeight = null;
        return;
      }

      this._baseWindowHeight ??= frameRect.height;
      const stageRect = stage.getBoundingClientRect();
      const desiredStageHeight = clamp(stageRect.width / imageAspect, 240, window.innerHeight - 96);
      if (Math.abs(stageRect.height - desiredStageHeight) <= 2) return;
      const desiredWindowHeight = clamp(frameRect.height + desiredStageHeight - stageRect.height, 320, window.innerHeight - 24);
      this.setPosition({ height: Math.round(desiredWindowHeight) });
    }

    _observeViewport(html: any) {
      this._viewportResizeObserver?.disconnect();
      const stage = html.querySelector(".gmf-map-stage");
      if (!stage) return;
      this._viewportResizeObserver = new ResizeObserver(() => this._applyViewportTransform(html));
      this._viewportResizeObserver.observe(stage);
    }

    _setZoom(value: number, html: any) {
      const minimumZoom = html.querySelector(".gmf-map-background") ? 1 : MIN_ZOOM;
      this.zoom = clamp(value, minimumZoom, MAX_ZOOM);
      this._applyViewportTransform(html);
    }

    _mountBountyIntelCallout(html: HTMLElement) {
      if (this._bountyIntelCallout || html.querySelector(".gmf-intel-callout")) return;
      // Called with either the map stage or the whole window.
      const stage = html.matches?.(".gmf-map-stage") ? html : html.querySelector<HTMLElement>(".gmf-map-stage");
      const root = html;
      if (!stage || !root.querySelector("[data-intel-layer]")) return;
      this._bountyIntelCallout = createPlanetIntelCallout({
        root,
        stage,
        resolveItems: (systemId: string) => {
          const map = normalizeMap(getRawMap(this.mapId));
          const target = this.activeSystemId
            ? map.systems.find((candidate: any) => candidate.id === this.activeSystemId)?.objects.find((object: any) => object.id === systemId)
            : map.systems.find((candidate: any) => candidate.id === systemId);
          return target ? getBountyIntelForSystem(target) : [];
        },
        onOpen: (bountyId: string) => openBountyIntel(bountyId)
      });
    }

    _attachPlanetListeners(html: HTMLElement) {
      html.querySelector("[data-action='inspect-system']")?.addEventListener("click", () => {
        const raw = getRawMap(this.mapId);
        if (this.playerMode && raw?.visibility !== "players") return;
        if (this.activeSystemId) {
          const map = normalizeMap(raw);
          const object = map.systems.find((system: any) => system.id === this.activeSystemId)?.objects.find((candidate: any) => candidate.id === this.selectedObjectId);
          if (!getPlanetAppearance(object)) return;
          this.planetSystemId = this.selectedObjectId;
        } else {
          // From the galaxy view, inspecting a system opens its primary entity.
          this.activeSystemId = this.selectedSystemId;
          const map = normalizeMap(raw);
          this.selectedObjectId = map.systems.find((system: any) => system.id === this.activeSystemId)?.primaryObjectId ?? null;
          this.planetSystemId = this.selectedObjectId;
        }
        this.render({ force: true });
      });
      html.querySelector("[data-action='planet-pause']")?.addEventListener("click", () => this._planetRenderer?.setPaused(!this._planetRenderer.paused));
      html.querySelector("[data-action='planet-zoom-in']")?.addEventListener("click", () => this._planetRenderer?.zoom(-0.25));
      html.querySelector("[data-action='planet-zoom-out']")?.addEventListener("click", () => this._planetRenderer?.zoom(0.25));
      html.querySelector("[data-action='planet-reset']")?.addEventListener("click", () => this._planetRenderer?.reset());
      html.querySelector("[data-action='planet-static']")?.addEventListener("click", () => {
        this.planetStatic = !this.planetStatic;
        this.render({ force: true });
      });
      this._attachPlanetLocationList(html);
      this._attachLinkedContentDrop(html);
    }

    _getPlanetObject() {
      const map = normalizeMap(getRawMap(this.mapId));
      return map.systems.find((system: any) => system.id === this.activeSystemId)
        ?.objects.find((object: any) => object.id === this.planetSystemId) ?? null;
    }

    _preparePlanetLocations(object: any, shape: string): PlanetLocationItem[] {
      return (object?.planetLocations ?? []).filter((location: any) => location.shape === shape).map((location: any) => {
        const scene = game.scenes?.get?.(location.sceneId);
        const accessible = Boolean(scene && (game.user?.isGM || scene.testUserPermission?.(game.user, "OBSERVER")));
        return { ...location,
          name: scene ? (accessible || game.user?.isGM ? scene.name || "Linked Scene" : "Restricted location") : "Missing linked scene",
          accessible, missing: !scene, canRemove: Boolean(game.user?.isGM && !this.playerMode)
        };
      });
    }

    _getPlanetLocationItem(locationId: string) {
      const object = this._getPlanetObject();
      return this._preparePlanetLocations(object, getPlanetAppearance(object)?.shape)
        .find(location => location.id === locationId) ?? null;
    }

    _attachPlanetLocationList(html: HTMLElement) {
      const root = this.element ?? html;
      html.querySelectorAll<HTMLElement>("[data-planet-scene-drag]").forEach(item => item.addEventListener("dragstart", (event: DragEvent) => {
        if (!event.dataTransfer) return;
        event.dataTransfer.setData("text/plain", JSON.stringify({ type: "Scene", id: item.dataset.planetSceneDrag, uuid: item.dataset.planetSceneUuid }));
        event.dataTransfer.effectAllowed = "link";
      }));
      html.querySelectorAll<HTMLElement>("[data-unlink-planet-scene]").forEach(button => button.addEventListener("click", async event => {
        event.preventDefault(); event.stopPropagation();
        const sceneId = button.dataset.unlinkPlanetScene ?? "";
        const objectId = this.planetSystemId || this.selectedObjectId;
        if (!sceneId || !this.activeSystemId || !objectId) return;
        const name = game.scenes?.get?.(sceneId)?.name || "Scene";
        if (await unlinkPlanetScene(this.mapId, this.activeSystemId, objectId, sceneId)) notifyInfo(`${name} unlinked from this entity.`);
      }));
      html.querySelectorAll<HTMLElement>("[data-open-linked-scene]").forEach(button => button.addEventListener("click", () => {
        const scene = game.scenes?.get?.(button.dataset.openLinkedScene ?? "");
        if (scene?.view) scene.view(); else scene?.sheet?.render(true);
      }));
      html.querySelectorAll<HTMLElement>("[data-open-planet-location]").forEach(button =>
        button.addEventListener("click", () => this._openPlanetLocation(button.dataset.openPlanetLocation ?? "")));
      html.querySelectorAll<HTMLElement>("[data-remove-planet-location]").forEach(button =>
        button.addEventListener("click", () => this._removePlanetLocation(button.dataset.removePlanetLocation ?? "", html)));
      html.querySelectorAll<HTMLElement>("[data-planet-location-drag]").forEach(item => {
        item.addEventListener("dragstart", (event: DragEvent) => {
          if (!event.dataTransfer) return;
          const locationId = item.dataset.planetLocationDrag ?? "";
          event.dataTransfer.setData("application/x-gmf-surface-location", locationId);
          event.dataTransfer.setData("text/plain", JSON.stringify({ type: "GalaxySurfaceLocation", locationId }));
          event.dataTransfer.effectAllowed = "move";
          root.querySelector("[data-planet-location-trash]")?.classList.add("is-armed");
        });
        item.addEventListener("dragend", () => root.querySelector("[data-planet-location-trash]")?.classList.remove("is-armed", "is-dragover"));
      });
      const trash = root.querySelector<HTMLElement>("[data-planet-location-trash]");
      if (trash?.dataset.gmfTrashBound !== "true") {
        if (trash) trash.dataset.gmfTrashBound = "true";
        trash?.addEventListener("dragover", (event: DragEvent) => {
          if (!event.dataTransfer?.types.includes("application/x-gmf-surface-location")) return;
          event.preventDefault(); event.dataTransfer.dropEffect = "move"; trash.classList.add("is-dragover");
        });
        trash?.addEventListener("dragleave", () => trash.classList.remove("is-dragover"));
        trash?.addEventListener("drop", (event: DragEvent) => {
          event.preventDefault();
          const locationId = event.dataTransfer?.getData("application/x-gmf-surface-location") ?? "";
          trash.classList.remove("is-armed", "is-dragover");
          if (locationId) void this._removePlanetLocation(locationId, html);
        });
      }
      html.querySelector<HTMLElement>("[data-clear-planet-locations]")?.addEventListener("click", () => this._clearPlanetLocations(html));
    }

    _attachLinkedContentDrop(html: HTMLElement) {
      const target = html.querySelector<HTMLElement>("[data-linked-content-drop]");
      if (!target || !game.user?.isGM || this.playerMode) return;
      target.addEventListener("dragover", (event: DragEvent) => {
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "link";
        target.classList.add("is-document-dragover");
      });
      target.addEventListener("dragleave", event => {
        if (!target.contains(event.relatedTarget as Node)) target.classList.remove("is-document-dragover");
      });
      target.addEventListener("drop", async (event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        target.classList.remove("is-document-dragover");
        const objectId = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !objectId) return;
        const document = await resolveDroppedDocument(event);
        const object = normalizeMap(getRawMap(this.mapId)).systems.find((system: any) => system.id === this.activeSystemId)
          ?.objects.find((candidate: any) => candidate.id === objectId);
        if (!document || !object) { notifyError("Drop a Foundry Scene or Journal here."); return; }
        if (document.documentName === "Scene") {
          const sceneIds = [...new Set([...(object.sceneIds ?? []), document.id])];
          await upsertObject(this.mapId, this.activeSystemId, { ...object, sceneIds });
          notifyInfo(`${document.name || "Scene"} linked to ${object.name}.`);
        } else if (document.documentName === "JournalEntry") {
          await upsertObject(this.mapId, this.activeSystemId, { ...object, journalId: document.id });
          notifyInfo(`${document.name || "Journal"} linked to ${object.name}.`);
        } else {
          notifyError("Drop a Foundry Scene or Journal here."); return;
        }
      });
      html.querySelector<HTMLElement>("[data-unlink-linked-journal]")?.addEventListener("click", async event => {
        event.preventDefault(); event.stopPropagation();
        const objectId = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !objectId) return;
        const object = normalizeMap(getRawMap(this.mapId)).systems.find((system: any) => system.id === this.activeSystemId)
          ?.objects.find((candidate: any) => candidate.id === objectId);
        if (!object) return;
        await upsertObject(this.mapId, this.activeSystemId, { ...object, journalId: "" });
      });
    }

    _openPlanetLocation(locationId: string) {
      const item = this._getPlanetLocationItem(locationId);
      const scene = item ? game.scenes?.get?.(item.sceneId) : null;
      if (!item || !scene || !item.accessible) {
        notifyError(item?.missing ? "That location is unavailable." : "You do not have permission to view that scene.");
        return;
      }
      if (scene.view) scene.view(); else scene.sheet?.render(true);
    }

    async _removePlanetLocation(locationId: string, html: HTMLElement) {
      if (!game.user?.isGM || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const item = this._getPlanetLocationItem(locationId);
      if (!item || !await removePlanetLocation(this.mapId, this.activeSystemId, this.planetSystemId, locationId)) return;
      this._syncPlanetLocations(html); notifyInfo(`${item.name} removed from the surface.`);
    }

    async _clearPlanetLocations(html: HTMLElement) {
      if (!game.user?.isGM || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const object = this._getPlanetObject();
      const locations = this._preparePlanetLocations(object, getPlanetAppearance(object)?.shape);
      for (const location of locations) await removePlanetLocation(this.mapId, this.activeSystemId, this.planetSystemId, location.id);
      this._syncPlanetLocations(html);
      if (locations.length) notifyInfo(`Cleared ${locations.length} surface location${locations.length === 1 ? "" : "s"}.`);
    }

    async _placePlanetLocation(event: DragEvent, anchor: any, html: HTMLElement) {
      if (!game.user?.isGM || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const scene = await resolveDroppedScene(event);
      if (!scene) { notifyError("Drop a Foundry Scene onto the 3D surface."); return; }
      const object = this._getPlanetObject();
      if (!object?.sceneIds.includes(scene.id)) {
        notifyError(`Link ${scene.name || "this scene"} to the object before placing it on the surface.`); return;
      }
      const saved = await savePlanetLocation(this.mapId, this.activeSystemId, this.planetSystemId, { ...anchor, sceneId: scene.id });
      if (!saved) return;
      this._syncPlanetLocations(html);
      notifyInfo(`${scene.name || "Scene"} placed on the ${anchor.shape}. Drag it again to move it.`);
    }

    _syncPlanetLocations(html: HTMLElement) {
      const root = this.element ?? html;
      const object = this._getPlanetObject();
      const items = this._preparePlanetLocations(object, getPlanetAppearance(object)?.shape);
      this._planetRenderer?.setLocations(object?.planetLocations ?? []);
      const list = root.querySelector<HTMLElement>("[data-planet-location-list]");
      if (!list) return;
      list.innerHTML = items.length ? items.map(item => `
        <div class="gmf-planet-location-row ${item.accessible ? "" : "is-restricted"}" ${item.canRemove ? `draggable="true" data-planet-location-drag="${escapeHtml(item.id)}" title="Drag to the trash bin to remove"` : ""}>
          <button type="button" data-open-planet-location="${escapeHtml(item.id)}" ${item.accessible ? "" : "disabled"}><i class="fa-solid ${item.accessible ? "fa-location-dot" : "fa-lock"}"></i><span>${escapeHtml(item.name)}</span></button>
          ${item.canRemove ? `<button type="button" data-remove-planet-location="${escapeHtml(item.id)}" title="Remove location" aria-label="Remove ${escapeHtml(item.name)}"><i class="fa-solid fa-trash"></i></button>` : ""}
        </div>`).join("") : '<p class="gmf-planet-locations__empty">No surface locations placed.</p>';
      this._attachPlanetLocationList(list);
      root.querySelector<HTMLElement>("[data-planet-location-removal]")?.toggleAttribute("hidden", items.length === 0);
    }

    refreshPlanetLocations(systemId: string, objectId: string) {
      if (this.activeSystemId !== systemId || this.planetSystemId !== objectId) return;
      if (this.element) this._syncPlanetLocations(this.element);
    }

    async focusSystem(systemId: string, options: any = {}) {
      const rawMap = normalizeMap(getRawMap(this.mapId));
      const system = rawMap.systems.find((candidate: any) => candidate.id === systemId);
      if (!system) return false;

      const displayMap = prepareMapForDisplay(rawMap, {
        playerMode: this.playerMode,
        selectedSystemId: systemId,
        selectedRouteId: null
      });
      if (!displayMap?.systems?.some((candidate: any) => candidate.id === systemId)) return false;

      const focusId = String(options.focusId || systemId).slice(0, 80);
      const kind = ["distress", "warning", "objective", "custom"].includes(options.kind) ? options.kind : "custom";
      const color = /^#[0-9a-f]{6}$/i.test(options.color ?? "") ? options.color : kind === "distress" ? "#ff5c7a" : "#58d8ff";
      const duration = clamp(Number(options.duration) || 0, 0, 600000);
      const zoom = clamp(Number(options.zoom) || 1.45, MIN_ZOOM, MAX_ZOOM);
      this.externalFocus = {
        id: focusId,
        systemId,
        kind,
        color,
        label: String(options.label || (kind === "distress" ? "Distress signal" : "Signal located")).slice(0, 120)
      };
      this.selectedSystemId = systemId;
      this.planetSystemId = null;
      this.selectedRouteId = null;
      this._pendingFocusZoom = zoom;
      if (this._externalFocusTimeout) globalThis.clearTimeout(this._externalFocusTimeout);
      this._externalFocusTimeout = null;

      await this.render({ force: true });
      this.bringToFront();

      if (duration > 0) {
        this._externalFocusTimeout = globalThis.setTimeout(() => {
          if (this.externalFocus?.id === focusId) this.clearSystemFocus(focusId);
        }, duration);
      }
      return true;
    }

    async focusLocation(systemId: string, objectId = "", options: any = {}) {
      const map = normalizeMap(getRawMap(this.mapId));
      const system = map.systems.find((candidate: any) => candidate.id === systemId);
      const object = system?.objects.find((candidate: any) => candidate.id === objectId)
        ?? system?.objects.find((candidate: any) => candidate.id === system.primaryObjectId);
      if (!system || !object) return false;
      if (this.playerMode && (system.visibility !== "players" || getEffectiveObjectVisibility(system, object) !== "players")) return false;
      this.activeSystemId = system.id;
      this.selectedSystemId = system.id;
      this.selectedObjectId = object.id;
      this.selectedRouteId = null;
      this.planetSystemId = options.detail === true && getPlanetAppearance(object) ? object.id : null;
      await this.render({ force: true });
      this.bringToFront();
      return true;
    }

    clearSystemFocus(focusId = "") {
      if (!this.externalFocus || (focusId && this.externalFocus.id !== focusId)) return false;
      if (this._externalFocusTimeout) globalThis.clearTimeout(this._externalFocusTimeout);
      this._externalFocusTimeout = null;
      this._pendingFocusZoom = null;
      this.externalFocus = null;
      if (this.rendered) this.render({ force: true });
      return true;
    }

    _centerOnSystem(system: any, html: any, zoom: number) {
      const stage = html.querySelector(".gmf-map-stage");
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      this.zoom = zoom;
      this.panX = rect.width / 2 - (Number(system.x) / 100) * this._worldWidth * zoom;
      this.panY = rect.height / 2 - (Number(system.y) / 100) * this._worldHeight * zoom;
      this._applyViewportTransform(html);
    }

    _onWheelZoom(event: any, html: any) {
      event.preventDefault();
      const stage = html.querySelector(".gmf-map-stage");
      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      const oldZoom = this.zoom;
      const minimumZoom = html.querySelector(".gmf-map-background") ? 1 : MIN_ZOOM;
      const nextZoom = clamp(oldZoom * Math.exp(-event.deltaY * 0.0015), minimumZoom, MAX_ZOOM);
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;
      const worldX = (pointerX - this.panX) / oldZoom;
      const worldY = (pointerY - this.panY) / oldZoom;

      this.zoom = nextZoom;
      this.panX = pointerX - worldX * nextZoom;
      this.panY = pointerY - worldY * nextZoom;
      this._applyViewportTransform(html);
    }

    _startPan(event: any, html: any) {
      if (event.button !== 0) return;
      if (event.target.closest("[data-system-id], [data-route-id], button, input")) return;
      event.preventDefault();
      const startX = event.clientX;
      const startY = event.clientY;
      const originX = this.panX;
      const originY = this.panY;
      let moved = false;

      const onMove = (moveEvent: any) => {
        moved = moved || Math.abs(moveEvent.clientX - startX) > 3 || Math.abs(moveEvent.clientY - startY) > 3;
        this.panX = originX + moveEvent.clientX - startX;
        this.panY = originY + moveEvent.clientY - startY;
        this._applyViewportTransform(html);
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        if (!moved) {
          this.selectedRouteId = null;
          if (this.activeSystemId) this.selectedObjectId = null;
          else this.selectedSystemId = null;
          this.render({ force: true });
        }
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, { once: true });
    }

    _startSystemDrag(event: any, html: any, node: any) {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      node.setPointerCapture?.(event.pointerId);

      const startX = event.clientX;
      const startY = event.clientY;
      let latest = this._pointerToMapPercent(event, html);
      let moved = false;
      let frame: number | null = null;
      const connectedFrom = Array.from(html.querySelectorAll(`[data-route-from="${node.dataset.systemId}"]`));
      const connectedTo = Array.from(html.querySelectorAll(`[data-route-to="${node.dataset.systemId}"]`));

      const onMove = (moveEvent: any) => {
        const dx = Math.abs(moveEvent.clientX - startX);
        const dy = Math.abs(moveEvent.clientY - startY);
        if (!moved && dx <= 4 && dy <= 4) return;
        moved = true;
        node.classList.add("is-dragging");
        latest = this._pointerToMapPercent(moveEvent, html);
        node.dataset.dragged = "true";
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
        node.classList.remove("is-dragging");
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        if (moved) {
          node.style.left = `${latest.x}%`;
          node.style.top = `${latest.y}%`;
          this._updateConnectedRoutes(connectedFrom, connectedTo, latest.x, latest.y);
          if (this.activeSystemId) await saveObjectPosition(this.mapId, this.activeSystemId, node.dataset.systemId, latest.x, latest.y);
          else await saveSystemPosition(this.mapId, node.dataset.systemId, latest.x, latest.y);
        }
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, { once: true });
    }

    _startMarkerResize(event: any, node: any) {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      if (this._selectionTimer) clearTimeout(this._selectionTimer);
      this._selectionTimer = null;

      const initialSize = clamp(Number(node.dataset.iconSize) || 28, 18, 56);
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const startDistance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
      let latestSize = initialSize;
      node.dataset.dragged = "true";
      node.classList.add("is-resizing");
      node.setPointerCapture?.(event.pointerId);

      const onMove = (moveEvent: any) => {
        const distance = Math.hypot(moveEvent.clientX - centerX, moveEvent.clientY - centerY);
        latestSize = clamp(Math.round(initialSize + (distance - startDistance) / Math.max(this.zoom, 0.01)), 18, 56);
        node.dataset.iconSize = String(latestSize);
        node.style.setProperty("--gmf-system-size", `${latestSize}px`);
      };

      const onUp = async () => {
        node.classList.remove("is-resizing");
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        globalThis.setTimeout(() => { node.dataset.dragged = "false"; }, 0);
        if (latestSize === initialSize) return;
        if (this.activeSystemId) {
          const system = normalizeMap(getRawMap(this.mapId)).systems.find((candidate: any) => candidate.id === this.activeSystemId);
          const object = system?.objects.find((candidate: any) => candidate.id === node.dataset.systemId);
          if (object) await upsertObject(this.mapId, this.activeSystemId, { ...object, iconSize: latestSize });
        } else {
          await upsertSystem(this.mapId, { id: node.dataset.systemId, iconSize: latestSize });
        }
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, { once: true });
      window.addEventListener("pointercancel", onUp, { once: true });
    }

    _pointerToMapPercent(event: any, html: any) {
      const stage = html.querySelector(".gmf-map-stage");
      const rect = stage.getBoundingClientRect();
      return {
        x: clamp(((event.clientX - rect.left - this.panX) / this.zoom / this._worldWidth) * 100, 0, 100),
        y: clamp(((event.clientY - rect.top - this.panY) / this.zoom / this._worldHeight) * 100, 0, 100)
      };
    }

    _updateConnectedRoutes(connectedFrom: any[], connectedTo: any[], x: number, y: number) {
      connectedFrom.forEach((line: any) => {
        line.setAttribute("x1", x);
        line.setAttribute("y1", y);
      });
      connectedTo.forEach((line: any) => {
        line.setAttribute("x2", x);
        line.setAttribute("y2", y);
      });
    }

    _openContextMenu(event: any, html: any) {
      if (!game.user?.isGM || this.playerMode) return;
      if (event.target.closest(".gmf-context-menu")) return;
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
      menu.querySelectorAll("[data-context-show]").forEach((button: any) => {
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

    _hideContextMenu(html: any = null) {
      const root = html ?? this.element ?? null;
      const menu = root?.querySelector("[data-gmf-context-menu]");
      if (menu) menu.hidden = true;
      if (this._boundContextClose) document.removeEventListener("click", this._boundContextClose);
      this._boundContextClose = null;
    }

    async _handleContextAction(event: any, html: any) {
      event.preventDefault();
      event.stopPropagation();
      const action = event.currentTarget.dataset.contextAction;
      const target = this._contextTarget;
      this._hideContextMenu(html);
      if (!target) return;

      if (action === "add-system") {
        this._openCreationPanel("system", { x: target.position.x, y: target.position.y });
      } else if (action === "add-entity") {
        if (this.activeSystemId) this._openCreationPanel("entity", { x: target.position.x, y: target.position.y });
      } else if (action === "manage-factions") {
        this.creationPanel = null;
        this.factionRegistry = true;
        this.render({ force: true });
      } else if (action === "add-faction") {
        this._openCreationPanel("faction");
      } else if (action === "edit-map-details") {
        this._openCreationPanel("map", normalizeMap(getRawMap(this.mapId)), this.mapId);
      } else if (action === "export-map") {
        exportMap(this.mapId);
      } else if (action === "edit-system") {
        this._openEditPanel("system", target.id);
      } else if (action === "edit-entity") {
        if (this.activeSystemId) this._openEditPanel("entity", target.id);
      } else if (action === "add-route-from-marker") {
        this._openCreationPanel("route", { fromSystemId: target.id });
      } else if (action === "reveal-system") {
        await revealSystemToPlayers(this.mapId, target.id);
      } else if (action === "hide-system") {
        await hideSystemFromPlayers(this.mapId, target.id, true);
      } else if (action === "delete-system") {
        await this._confirmDeleteSystem(target.id);
      } else if (action === "reveal-entity") {
        if (this.activeSystemId) await setObjectVisibility(this.mapId, this.activeSystemId, target.id, "players");
      } else if (action === "hide-entity") {
        if (this.activeSystemId) await setObjectVisibility(this.mapId, this.activeSystemId, target.id, "gm");
      } else if (action === "delete-entity") {
        if (this.activeSystemId) await this._confirmDeleteObject(this.activeSystemId, target.id);
      } else if (action === "edit-route") {
        this._openEditPanel("route", target.id);
      } else if (action === "reveal-route") {
        await revealRouteToPlayers(this.mapId, target.id, this.activeSystemId ?? "");
      } else if (action === "hide-route") {
        await hideRouteFromPlayers(this.mapId, target.id, true, this.activeSystemId ?? "");
      } else if (action === "delete-route") {
        await this._confirmDeleteRoute(target.id);
      }
    }

    async _confirmDeleteSystem(systemId: string) {
      const confirmed = await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, GALAXY_DIALOG_OPTIONS);
      if (confirmed) await deleteSystem(this.mapId, systemId);
    }

    async _confirmDeleteObject(systemId: string, objectId: string) {
      const confirmed = await Dialog.confirm({ title: "Delete Entity", content: "<p>Delete this entity and its linked content?</p>" });
      if (confirmed) {
        await deleteObject(this.mapId, systemId, objectId);
        this.selectedObjectId = null;
      }
    }

    _openCreationPanel(kind: string, defaults: any = {}, editId: string | null = null) {
      if (!game.user?.isGM || this.playerMode) return;
      const map = normalizeMap(getRawMap(this.mapId));
      const routeEndpoints = this.activeSystemId
        ? map.systems.find((system: any) => system.id === this.activeSystemId)?.objects ?? []
        : map.systems;
      if (kind === "route" && routeEndpoints.length < 2) {
        notifyError(this.activeSystemId ? "Create at least two entities before adding a route." : "Create at least two systems before adding a route.");
        return;
      }
      const fromSystemId = defaults.fromSystemId || routeEndpoints[0]?.id || "";
      const base = kind === "map" ? { title: "Galaxy Map", subtitle: "", description: "", backgroundImage: "", visibility: "players", travelApprovalMode: "unanimous" }
        : kind === "system" ? { name: "New System", status: "known", visibility: "gm", description: "", markerImage: "", backgroundImage: "" }
        : kind === "entity" ? {
          name: "New Entity", kind: "planet", status: "known", visibility: "inherit", factionId: "", description: "", notes: "",
          iconStyle: "planet", iconColor: "#58d8ff", markerImage: "", planetPreset: "ice", planetShape: "sphere", planetFinish: "smooth",
          planetColor: "#58d8ff", planetTexture: "", image: ""
        }
        : kind === "route" ? { type: "safe", visibility: "gm", travelTime: "", fuelCost: 0, notes: "" }
        : { name: "New Faction", color: "#58d8ff", visibility: "gm", description: "" };
      this.creationPanel = {
        kind,
        editId,
        data: {
          ...base,
          ...defaults,
          x: Number.isFinite(Number(defaults.x)) ? Number(defaults.x) : 50,
          y: Number.isFinite(Number(defaults.y)) ? Number(defaults.y) : 50,
          fromSystemId,
          toSystemId: defaults.toSystemId || routeEndpoints.find((endpoint: any) => endpoint.id !== fromSystemId)?.id || ""
        }
      };
      this.factionRegistry = false;
      this.selectedSystemId = null;
      this.selectedObjectId = null;
      this.selectedRouteId = null;
      this.render({ force: true });
    }

    _openEditPanel(kind: string, id: string) {
      const map = normalizeMap(getRawMap(this.mapId));
      const source = kind === "system" ? map.systems.find((system: any) => system.id === id)
        : kind === "entity" ? map.systems.find((system: any) => system.id === this.activeSystemId)?.objects.find((object: any) => object.id === id)
        : kind === "route" ? (this.activeSystemId
          ? map.systems.find((system: any) => system.id === this.activeSystemId)?.routes.find((route: any) => route.id === id)
          : map.routes.find((route: any) => route.id === id))
        : map.factions.find((faction: any) => faction.id === id);
      if (source) this._openCreationPanel(kind, source, id);
    }

    openEditor(kind: string, options: any = {}) {
      if (!game.user?.isGM || this.playerMode) return false;
      this._disposePlanetRenderer();
      this.planetSystemId = null;
      if (kind === "entity") {
        this.activeSystemId = options.systemId || this.activeSystemId;
        this.selectedSystemId = this.activeSystemId;
      } else if (kind === "route") {
        this.activeSystemId = options.systemId || null;
      } else if (["map", "system", "faction"].includes(kind)) {
        this.activeSystemId = null;
      }
      if (kind === "map") this._openCreationPanel("map", normalizeMap(getRawMap(this.mapId)), this.mapId);
      else if (options.id) this._openEditPanel(kind, options.id);
      else this._openCreationPanel(kind, options.defaults || {});
      return true;
    }

    _attachCreationPanel(html: HTMLElement) {
      html.querySelector("[data-action='cancel-panel-create']")?.addEventListener("click", () => {
        this.creationPanel = null;
        this.render({ force: true });
      });
      html.querySelector("[data-action='close-faction-registry']")?.addEventListener("click", () => {
        this.factionRegistry = false;
        this.render({ force: true });
      });
      html.querySelector("[data-action='add-inline-faction']")?.addEventListener("click", () => this._openCreationPanel("faction"));
      html.querySelectorAll<HTMLElement>("[data-edit-inline-faction]").forEach(button => {
        button.addEventListener("click", () => this._openEditPanel("faction", button.dataset.editInlineFaction || ""));
      });
      html.querySelectorAll<HTMLElement>("[data-delete-inline-faction]").forEach(button => {
        button.addEventListener("click", async () => {
          const confirmed = await Dialog.confirm({ title: "Delete Faction", content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>" }, GALAXY_DIALOG_OPTIONS);
          if (!confirmed) return;
          await deleteFaction(this.mapId, button.dataset.deleteInlineFaction);
          this.factionRegistry = true;
          this.render({ force: true });
        });
      });
      const form = html.querySelector<HTMLFormElement>("[data-panel-create-form]");
      if (!form) return;
      bindFilePickerFields(form);
      form.addEventListener("submit", async event => {
        event.preventDefault();
        const kind = form.dataset.createKind || "";
        const values = Object.fromEntries(new FormData(form).entries()) as any;
        html.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[form="gmf-panel-editor-form"][name]').forEach(control => {
          if ((control instanceof HTMLInputElement) && ["checkbox", "radio"].includes(control.type) && !control.checked) return;
          values[control.name] = control.value;
        });
        if (kind === "entity") {
          values.markerImage = values.useCustomMarker === "true" ? values.markerImage ?? "" : "";
          delete values.useCustomMarker;
        }
        const x = Number(values.x), y = Number(values.y);
        const panel = this.creationPanel;
        const existing = panel?.data ?? {};
        if (panel?.editId) values.id = panel.editId;
        this.creationPanel = null;
        let saved: any = null;
        if (kind === "map") saved = await updateMapMetadata(this.mapId, { ...existing, ...values });
        else if (kind === "system") saved = await upsertSystem(this.mapId, { ...existing, ...values, x, y });
        else if (kind === "entity" && this.activeSystemId) saved = await upsertObject(this.mapId, this.activeSystemId, { ...existing, ...values, x, y });
        else if (kind === "route") {
          if (!values.fromSystemId || !values.toSystemId || values.fromSystemId === values.toSystemId) {
            notifyError(`Choose two different ${this.activeSystemId ? "entities" : "systems"} for the route.`);
            this._openCreationPanel("route", { ...existing, ...values }, panel?.editId ?? null);
            return;
          }
          saved = await upsertRoute(this.mapId, { ...existing, ...values }, this.activeSystemId ?? "");
        } else if (kind === "faction") {
          saved = await upsertFaction(this.mapId, { ...existing, ...values });
          this.factionRegistry = true;
        }
        if (saved?.id) {
          if (kind === "system") this.selectedSystemId = saved.id;
          if (kind === "entity") this.selectedObjectId = saved.id;
          if (kind === "route") this.selectedRouteId = saved.id;
        }
        this.render({ force: true });
      });
      globalThis.setTimeout(() => form.querySelector<HTMLElement>("[autofocus]")?.focus(), 0);
    }

    _attachAppearancePreview(html: HTMLElement) {
      const marker = html.querySelector<HTMLElement>("[data-panel-marker-preview-system]");
      const icon = html.querySelector<HTMLElement>("[data-panel-marker-preview-icon]");
      const label = html.querySelector<HTMLElement>("[data-panel-marker-preview-label]");
      if (!marker) return;
      let renderSequence = 0;
      const controls = ["name", "kind", "status", "iconStyle", "iconColor", "markerImage"]
        .map(name => html.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`));
      const update = async () => {
        const value = (name: string, fallback: string) => html.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`)?.value || fallback;
        const type = value("kind", "planet");
        const status = value("status", "known");
        const iconStyle = value("iconStyle", type);
        const markerImage = value("markerImage", "").trim();
        marker.className = `gmf-system gmf-system--${type} gmf-icon--${iconStyle} gmf-status--${status}${markerImage ? " has-custom-marker" : ""}`;
        marker.style.setProperty("--gmf-faction-color", value("iconColor", "#58d8ff"));
        marker.style.setProperty("--gmf-system-size", "42px");
        if (label) label.textContent = value("name", "New Entity");
        const sequence = ++renderSequence;
        if (icon && markerImage) {
          const image = document.createElement("img");
          image.className = "gmf-custom-marker__image";
          image.src = markerImage;
          image.alt = "";
          image.draggable = false;
          icon.replaceChildren(image);
        } else if (icon && ANIMATED_CELESTIAL_STYLES.includes(iconStyle)) {
          const markup = await (globalThis as any).renderTemplate(`${templateRoot}/celestial-icon.hbs`, { system: { iconStyle } });
          if (sequence === renderSequence) icon.innerHTML = markup;
        } else if (icon) {
          icon.innerHTML = '<span class="gmf-system__core"></span>';
        }
      };
      controls.forEach(control => {
        control?.addEventListener("input", update);
        control?.addEventListener("change", update);
      });
      update();
    }

    async _confirmDeleteRoute(routeId: string) {
      const confirmed = await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, GALAXY_DIALOG_OPTIONS);
      if (confirmed) await deleteRoute(this.mapId, routeId, this.activeSystemId ?? "");
    }

    async _travelToSystem(destinationSystemId: string, html: any) {
      const map = normalizeMap(getRawMap(this.mapId));
      const from = map.systems.find((system: any) => system.id === map.currentSystemId);
      const to = map.systems.find((system: any) => system.id === destinationSystemId);
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

      broadcastTravelAnimation(this.mapId, from.id, to.id);
      await this._animateShipTravel(from, to, html);
      await setCurrentSystem(this.mapId, to.id);
      notifyInfo(`Arrived at ${to.name}.`);
    }

    async _travelToObject(systemId: string, destinationObjectId: string, html: any) {
      const map = normalizeMap(getRawMap(this.mapId));
      const system = map.systems.find((candidate: any) => candidate.id === systemId);
      const from = system?.objects.find((object: any) => object.id === map.currentLocation.objectId);
      const to = system?.objects.find((object: any) => object.id === destinationObjectId);
      if (!system || !to) return;
      if (!from || map.currentLocation.systemId !== system.id) {
        await setCurrentObject(this.mapId, system.id, to.id);
        notifyInfo(`Current location set to ${to.name}.`);
        return;
      }
      if (from.id === to.id) {
        notifyInfo(`${to.name} is already the current location.`);
        return;
      }
      const route = getTravelRoute({ routes: system.routes }, from.id, to.id);
      if (!route) {
        notifyError(`No direct route from ${from.name} to ${to.name}.`);
        return;
      }
      broadcastObjectTravelAnimation(this.mapId, system.id, from.id, to.id);
      await this._animateShipTravel(from, to, html);
      await setCurrentObject(this.mapId, system.id, to.id);
      notifyInfo(`Arrived at ${to.name}.`);
    }

    _animateShipTravel(from: any, to: any, html: any) {
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

      return new Promise<void>((resolve) => {
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
      const map = normalizeMap(getRawMap(this.mapId));
      if (this.activeSystemId) return map.systems.find((system: any) => system.id === this.activeSystemId)?.objects.find((object: any) => object.id === this.selectedObjectId) ?? null;
      return map.systems.find((system: any) => system.id === this.selectedSystemId) ?? null;
    }

    async close(options: any = {}) {
      this._bountyIntelCallout?.dispose();
      this._bountyIntelCallout = null;
      this._disposePlanetRenderer();
      this._hideContextMenu();
      if (this._externalFocusTimeout) globalThis.clearTimeout(this._externalFocusTimeout);
      this._externalFocusTimeout = null;
      this._viewportResizeObserver?.disconnect();
      this._viewportResizeObserver = null;
      clearMapView(this);
      return super.close(options);
    }

    _disposePlanetRenderer() {
      this._planetGeneration++;
      this._planetLocationCallout?.dispose();
      this._planetLocationCallout = null;
      this._planetRenderer?.dispose();
      this._planetRenderer = null;
    }

    _setPlanetFallback(html: HTMLElement, appearance: any) {
      const fallback = html.querySelector<HTMLElement>(".gmf-planet-fallback");
      if (fallback) {
        fallback.style.backgroundImage = appearance.texture ? `url(${JSON.stringify(appearance.texture)})` : "none";
        fallback.style.backgroundColor = appearance.color;
      }
      const host = html.querySelector<HTMLElement>("[data-planet-canvas]");
      if (host) {
        host.dataset.planetShape = appearance.shape;
        host.dataset.planetPreset = appearance.preset;
      }
      const stage = html.querySelector<HTMLElement>(".gmf-planet-stage");
      stage?.style.setProperty("--gmf-planet-color", appearance.color);
    }

    async _mountPlanetRenderer(html: HTMLElement, appearance: any) {
      const host = html.querySelector<HTMLElement>("[data-planet-canvas]");
      if (!host || !appearance) return;
      this._setPlanetFallback(html, appearance);
      const generation = this._planetGeneration;
      const status = html.querySelector("[data-planet-status]");
      const toggle = html.querySelector("[data-action='planet-static']");
      const controls = html.querySelectorAll<HTMLButtonElement>("[data-planet-control]");
      if (toggle) {
        const label = this.planetStatic ? "Enable 3D" : "Static view";
        toggle.setAttribute("title", label);
        toggle.setAttribute("aria-label", label);
        toggle.setAttribute("aria-pressed", String(this.planetStatic));
        const icon = toggle.querySelector("i");
        if (icon) icon.className = this.planetStatic ? "fa-solid fa-cube" : "fa-solid fa-image";
      }
      if (this.planetStatic) {
        if (status) status.textContent = "Static preview. Turn on 3D to rotate and zoom.";
        controls.forEach(b => b.disabled = true);
        return;
      }
      try {
        const { createPlanetRenderer } = await import("./planet-renderer");
        if (generation !== this._planetGeneration || !host.isConnected) return;
        controls.forEach(b => b.disabled = false);
        this._planetRenderer = createPlanetRenderer(host, {
          texture: appearance.texture,
          color: appearance.color,
          appearancePreset: appearance.preset,
          shape: appearance.shape,
          finish: appearance.finish,
          detailStrength: appearance.detailStrength,
          locations: this._getPlanetObject()?.planetLocations ?? [],
          canPlaceLocations: Boolean(game.user?.isGM && !this.playerMode),
          onLocationDrop: (event: DragEvent, anchor: any) => void this._placePlanetLocation(event, anchor, html),
          onInvalidLocationDrop: () => notifyError("Drop the scene directly onto the visible 3D surface."),
          onMarkerHover: (location: any) => {
            const item = this._getPlanetLocationItem(location.id);
            if (item) this._planetLocationCallout?.show(item);
          },
          onMarkerLeave: () => this._planetLocationCallout?.scheduleHide(),
          onMarkerPosition: (point: any) => this._planetLocationCallout?.setAnchor(point),
          onMarkerOpen: (location: any) => this._openPlanetLocation(location.id),
          onMarkerContextMenu: game.user?.isGM && !this.playerMode
            ? (location: any) => void this._removePlanetLocation(location.id, html)
            : null,
          isVisible: () => !this.minimized,
          onStatus: (text: string) => { if (status) status.textContent = text; },
          onPaused: (paused: boolean) => {
            const button = html.querySelector("[data-action='planet-pause']");
            if (button) {
              const label = paused ? "Resume rotation" : "Pause rotation";
              button.setAttribute("title", label);
              button.setAttribute("aria-label", label);
              button.setAttribute("aria-pressed", String(paused));
              const icon = button.querySelector("i");
              if (icon) icon.className = paused ? "fa-solid fa-play" : "fa-solid fa-pause";
            }
          },
          onStopped: () => {
            controls.forEach(b => b.disabled = true);
            if (status) status.textContent = "Static preview. Reopen this view to turn 3D back on.";
          }
        });
        this._planetLocationCallout = createPlanetLocationCallout({ host });
      } catch {
        controls.forEach(b => b.disabled = true);
        if (status) status.textContent = "3D could not be loaded. Static preview shown.";
      }
    }
  };
}
