import {
  MAX_ZOOM,
  MIN_ZOOM,
  TRAVEL_ANIMATION_MS,
  clamp,
  normalizeMap
} from "./galaxy-model";

declare const foundry: any;
declare const Application: any;
declare const Dialog: any;
declare const game: any;

function getApplicationBase() {
  const ApplicationV2 = foundry.applications?.api?.ApplicationV2;
  const HandlebarsApplicationMixin = foundry.applications?.api?.HandlebarsApplicationMixin;
  if (ApplicationV2 && HandlebarsApplicationMixin) return HandlebarsApplicationMixin(ApplicationV2);
  return Application;
}

export function createGalaxyMapViewClass(deps: any) {
  const {
    templateRoot,
    getRawMap,
    prepareMapForDisplay,
    openSystemDialog,
    openRouteDialog,
    openFactionDialog,
    openFactionManagerDialog,
    openMapMetadataDialog,
    revealSystemToPlayers,
    revealRouteToPlayers,
    deleteSystem,
    deleteRoute,
    setCurrentSystem,
    requestTravelToSystem,
    notifySystemDiscovered,
    exportMap,
    getTravelRoute,
    notifyInfo,
    notifyError,
    saveSystemPosition,
    showMapToPlayers,
    openMapManager,
    clearMapView
  } = deps;

  return class GalaxyMapView extends getApplicationBase() {
    mapId: string;
    playerMode: boolean;
    selectedSystemId: string | null;
    selectedRouteId: string | null;
    zoom: number;
    panX: number;
    panY: number;
    _drag: any;
    _contextTarget: any;
    _boundContextClose: any;

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

    async _prepareContext(options: any) {
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

    _onRender(context: any, options: any) {
      super._onRender?.(context, options);
      const html = this.element instanceof HTMLElement ? this.element : this.element?.[0];
      if (html) this._attachPartListeners("main", html, options);
    }

    _attachPartListeners(partId: string, html: any, options: any) {
      const boundStage = html.matches?.(".gmf-map-stage") ? html : html.querySelector?.(".gmf-map-stage");
      if (boundStage?.dataset.gmfMapBound === "true") return;
      if (boundStage) boundStage.dataset.gmfMapBound = "true";
      super._attachPartListeners?.(partId, html, options);
      this._applyViewportTransform(html);

      html.querySelectorAll("[data-system-id]").forEach((node: any) => {
        node.addEventListener("click", (event: any) => {
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
          node.addEventListener("pointerdown", (event: any) => this._startSystemDrag(event, html, node));
        }
      });
      html.querySelectorAll("[data-route-id]").forEach((route: any) => {
        route.addEventListener("click", (event: any) => {
          event.stopPropagation();
          this.selectedRouteId = route.dataset.routeId;
          this.selectedSystemId = null;
          this.render({ force: true });
        });
      });
      const stage = html.querySelector(".gmf-map-stage");
      stage?.addEventListener("wheel", (event: any) => this._onWheelZoom(event, html), { passive: false });
      stage?.addEventListener("pointerdown", (event: any) => this._startPan(event, html));
      stage?.addEventListener("contextmenu", (event: any) => this._openContextMenu(event, html), { capture: true });
      html.querySelectorAll("[data-context-action]").forEach((button: any) => {
        button.addEventListener("click", (event: any) => this._handleContextAction(event, html));
      });
      html.querySelector("[data-action='open-map-menu']")?.addEventListener("click", (event: any) => this._openStageMenuFromButton(event, html));
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
      html.querySelector("[data-action='show-to-players']")?.addEventListener("click", () => showMapToPlayers(this.mapId));
      html.querySelector("[data-action='edit-map']")?.addEventListener("click", () => {
        const manager = openMapManager();
        if (manager) {
          manager.selectedMapId = this.mapId;
          manager.render({ force: true });
        }
      });
    }

    _applyViewportTransform(html: any) {
      const viewport = html.querySelector(".gmf-map-viewport");
      if (!viewport) return;
      viewport.style.setProperty("--gmf-pan-x", `${this.panX}px`);
      viewport.style.setProperty("--gmf-pan-y", `${this.panY}px`);
      viewport.style.setProperty("--gmf-zoom", String(this.zoom));
      html.querySelector("[data-zoom-label]")?.replaceChildren(`${Math.round(this.zoom * 100)}%`);
    }

    _setZoom(value: number, html: any) {
      this.zoom = clamp(value, MIN_ZOOM, MAX_ZOOM);
      this._applyViewportTransform(html);
    }

    _onWheelZoom(event: any, html: any) {
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

    _startPan(event: any, html: any) {
      if (event.button !== 0) return;
      if (event.target.closest("[data-system-id], [data-route-id], button")) return;
      event.preventDefault();
      const startX = event.clientX;
      const startY = event.clientY;
      const originX = this.panX;
      const originY = this.panY;

      const onMove = (moveEvent: any) => {
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
      node.classList.add("is-dragging");

      const onMove = (moveEvent: any) => {
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

    _pointerToMapPercent(event: any, html: any) {
      const stage = html.querySelector(".gmf-map-stage");
      const rect = stage.getBoundingClientRect();
      return {
        x: clamp(((event.clientX - rect.left - this.panX) / this.zoom / rect.width) * 100, 0, 100),
        y: clamp(((event.clientY - rect.top - this.panY) / this.zoom / rect.height) * 100, 0, 100)
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

    _openStageMenuFromButton(event: any, html: any) {
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

    _hideContextMenu(html: any = null) {
      const root = html ?? this.element ?? null;
      const menu = root?.querySelector?.("[data-gmf-context-menu]") ?? root?.[0]?.querySelector?.("[data-gmf-context-menu]");
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

    async _confirmDeleteSystem(systemId: string) {
      const confirmed = await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      });
      if (confirmed) await deleteSystem(this.mapId, systemId);
    }

    async _confirmDeleteRoute(routeId: string) {
      const confirmed = await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      });
      if (confirmed) await deleteRoute(this.mapId, routeId);
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

      await this._animateShipTravel(from, to, html);
      await setCurrentSystem(this.mapId, to.id);
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
      return map?.systems?.find((system: any) => system.id === this.selectedSystemId) ?? null;
    }

    async close(options: any = {}) {
      this._hideContextMenu();
      clearMapView(this);
      return super.close(options);
    }
  };
}
