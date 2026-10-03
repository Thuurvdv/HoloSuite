declare const Dialog: any;

import { activateGalaxyWindowChrome, GALAXY_DIALOG_OPTIONS } from "./window-chrome";
import { getApplicationBase } from "./app-base";
import { escapeHtml } from "./dom-utils";

export function createGalaxyMapManagerClass(deps: any) {
  const {
    templateRoot,
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
    hideRouteFromPlayers,
    hideFactionFromPlayers,
    notifyError,
    clearManagerApp
  } = deps;

  return class GalaxyMapManager extends getApplicationBase() {
    selectedMapId: string | null;
    activeTab: "systems" | "routes" | "factions";
    expandedSystemId: string | null | undefined;

    static DEFAULT_OPTIONS = {
      id: "galaxy-map-manager",
      classes: ["galaxy-map", "galaxy-map-framework", "gmf-manager-window"],
      window: {
        title: "Galaxy Map Manager",
        icon: "fa-solid fa-satellite",
        resizable: true
      },
      position: {
        width: 980,
        height: 720
      }
    };

    static PARTS = {
      main: {
        template: `${templateRoot}/map-manager.hbs`
      }
    };

    constructor(options: any = {}) {
      super(options);
      this.selectedMapId = options.selectedMapId ?? null;
      this.activeTab = ["systems", "routes", "factions"].includes(options.activeTab) ? options.activeTab : "systems";
      this.expandedSystemId = options.expandedSystemId;
    }

    async _prepareContext(options: any) {
      const context = await super._prepareContext(options);
      const maps = getMaps().sort((a: any, b: any) => a.title.localeCompare(b.title));
      if (!this.selectedMapId || !maps.some((map: any) => map.id === this.selectedMapId)) {
        this.selectedMapId = maps[0]?.id ?? null;
      }
      const selectedMap = this.selectedMapId ? prepareMapForManager(getRawMap(this.selectedMapId)) : null;
      if (selectedMap) {
        const systemIds = new Set(selectedMap.systems.map((system: any) => system.id));
        if (this.expandedSystemId && !systemIds.has(this.expandedSystemId)) this.expandedSystemId = undefined;
        if (this.expandedSystemId === undefined) this.expandedSystemId = selectedMap.systems[0]?.id ?? null;
        selectedMap.systems = selectedMap.systems.map((system: any) => ({
          ...system,
          isExpanded: system.id === this.expandedSystemId
        }));
      }
      return {
        ...context,
        maps,
        selectedMap,
        selectedMapId: this.selectedMapId,
        activeTab: this.activeTab,
        showSystems: this.activeTab === "systems",
        showRoutes: this.activeTab === "routes",
        showFactions: this.activeTab === "factions",
        hasMaps: maps.length > 0
      };
    }

    _attachPartListeners(partId: string, html: any, options: any) {
      super._attachPartListeners(partId, html, options);
      activateGalaxyWindowChrome(this, html);
      html.querySelector("[data-action='create-map']")?.addEventListener("click", () => this._onCreateMap());
      html.querySelector("[data-action='edit-map-metadata']")?.addEventListener("click", () => {
        this._openViewportEditor("map");
      });
      html.querySelector("[data-action='create-system']")?.addEventListener("click", () => {
        this._openViewportEditor("system");
      });
      html.querySelector("[data-action='create-route']")?.addEventListener("click", () => {
        this._openViewportEditor("route");
      });
      html.querySelector("[data-action='create-faction']")?.addEventListener("click", () => {
        this._openViewportEditor("faction");
      });
      html.querySelectorAll("[data-manager-tab]").forEach((button: any) => {
        button.addEventListener("click", () => {
          const tab = button.dataset.managerTab;
          if (!["systems", "routes", "factions"].includes(tab) || tab === this.activeTab) return;
          this.activeTab = tab;
          this.render({ force: true });
        });
      });
      html.querySelectorAll("[data-toggle-system]").forEach((button: any) => {
        button.addEventListener("click", () => {
          const systemId = button.dataset.toggleSystem;
          this.expandedSystemId = this.expandedSystemId === systemId ? null : systemId;
          this.render({ force: true });
        });
      });
      html.querySelectorAll("[data-edit-system]").forEach((button: any) => {
        button.addEventListener("click", () => this._openViewportEditor("system", { id: button.dataset.editSystem }));
      });
      html.querySelectorAll("[data-create-object]").forEach((button: any) => {
        button.addEventListener("click", () => this._openViewportEditor("entity", { systemId: button.dataset.createObject }));
      });
      html.querySelectorAll("[data-edit-object]").forEach((button: any) => {
        button.addEventListener("click", () => this._openViewportEditor("entity", { systemId: button.dataset.objectSystem, id: button.dataset.editObject }));
      });
      html.querySelectorAll("[data-delete-object]").forEach((button: any) => {
        button.addEventListener("click", () => this._confirmDeleteObject(button.dataset.objectSystem, button.dataset.deleteObject));
      });
      html.querySelectorAll("[data-show-system]").forEach((button: any) => {
        button.addEventListener("click", () => hideSystemFromPlayers(this.selectedMapId, button.dataset.showSystem, false));
      });
      html.querySelectorAll("[data-hide-system]").forEach((button: any) => {
        button.addEventListener("click", () => hideSystemFromPlayers(this.selectedMapId, button.dataset.hideSystem, true));
      });
      html.querySelectorAll("[data-delete-system]").forEach((button: any) => {
        button.addEventListener("click", () => this._confirmDeleteSystem(button.dataset.deleteSystem));
      });
      html.querySelectorAll("[data-edit-route]").forEach((button: any) => {
        button.addEventListener("click", () => this._openViewportEditor("route", { id: button.dataset.editRoute, systemId: button.dataset.routeSystem }));
      });
      html.querySelectorAll("[data-show-route]").forEach((button: any) => {
        button.addEventListener("click", () => hideRouteFromPlayers(this.selectedMapId, button.dataset.showRoute, false, button.dataset.routeSystem));
      });
      html.querySelectorAll("[data-hide-route]").forEach((button: any) => {
        button.addEventListener("click", () => hideRouteFromPlayers(this.selectedMapId, button.dataset.hideRoute, true, button.dataset.routeSystem));
      });
      html.querySelectorAll("[data-delete-route]").forEach((button: any) => {
        button.addEventListener("click", () => this._confirmDeleteRoute(button.dataset.deleteRoute, button.dataset.routeSystem));
      });
      html.querySelectorAll("[data-edit-faction]").forEach((button: any) => {
        button.addEventListener("click", () => this._openViewportEditor("faction", { id: button.dataset.editFaction }));
      });
      html.querySelectorAll("[data-show-faction]").forEach((button: any) => {
        button.addEventListener("click", () => hideFactionFromPlayers(this.selectedMapId, button.dataset.showFaction, false));
      });
      html.querySelectorAll("[data-hide-faction]").forEach((button: any) => {
        button.addEventListener("click", () => hideFactionFromPlayers(this.selectedMapId, button.dataset.hideFaction, true));
      });
      html.querySelectorAll("[data-delete-faction]").forEach((button: any) => {
        button.addEventListener("click", () => this._confirmDeleteFaction(button.dataset.deleteFaction));
      });
      html.querySelector("[data-action='export-map']")?.addEventListener("click", () => {
        if (this.selectedMapId) exportMap(this.selectedMapId);
      });
      html.querySelector("[data-action='import-map']")?.addEventListener("click", () => this._onImportMap());
      html.querySelectorAll("[data-select-map]").forEach((button: any) => {
        button.addEventListener("click", () => {
          this.selectedMapId = button.dataset.selectMap;
          this.expandedSystemId = undefined;
          this.render({ force: true });
        });
      });
      html.querySelectorAll("[data-open-map]").forEach((button: any) => {
        button.addEventListener("click", () => openMap(button.dataset.openMap));
      });
      html.querySelectorAll("[data-show-map]").forEach((button: any) => {
        button.addEventListener("click", () => showMapToPlayers(button.dataset.showMap));
      });
      html.querySelectorAll("[data-duplicate-map]").forEach((button: any) => {
        button.addEventListener("click", async () => {
          const map = await duplicateMap(button.dataset.duplicateMap);
          if (map) {
            this.selectedMapId = map.id;
            this.render({ force: true });
          }
        });
      });
      html.querySelectorAll("[data-delete-map]").forEach((button: any) => {
        button.addEventListener("click", async () => {
          const mapId = button.dataset.deleteMap;
          const map = getRawMap(mapId);
          const confirmed = await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${escapeHtml(map?.title ?? mapId)}</strong>? This cannot be undone.</p>`
          }, GALAXY_DIALOG_OPTIONS);
          if (!confirmed) return;
          await deleteMap(mapId);
          if (this.selectedMapId === mapId) this.selectedMapId = null;
          this.render({ force: true });
        });
      });
    }

    _onImportMap() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json,application/json";
      input.addEventListener("change", async () => {
        const file = input.files?.[0];
        if (!file) return;

        try {
          const data = JSON.parse(await file.text());
          if (!data || typeof data !== "object" || Array.isArray(data)) {
            throw new Error("The selected file does not contain a Galaxy Map object.");
          }
          const map = await importMapData(data);
          if (!map) return;
          this.selectedMapId = map.id;
          this.expandedSystemId = undefined;
          this.render({ force: true });
        } catch (error) {
          const message = error instanceof Error ? error.message : "The selected file could not be read.";
          notifyError(`Could not import map: ${message}`);
        }
      }, { once: true });
      input.click();
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
        this.render({ force: true });
      }
    }

    _openViewportEditor(kind: string, options: any = {}) {
      if (!this.selectedMapId) return;
      openMap(this.selectedMapId)?.openEditor?.(kind, options);
    }

    async _confirmDeleteSystem(systemId: string) {
      const confirmed = await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, GALAXY_DIALOG_OPTIONS);
      if (confirmed) await deleteSystem(this.selectedMapId, systemId);
    }

    async _confirmDeleteObject(systemId: string, objectId: string) {
      const confirmed = await Dialog.confirm({
        title: "Delete Location",
        content: "<p>Delete this location and its linked content from the system?</p>"
      });
      if (confirmed) await deleteObject(this.selectedMapId, systemId, objectId);
    }

    async _confirmDeleteRoute(routeId: string, systemId = "") {
      const confirmed = await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, GALAXY_DIALOG_OPTIONS);
      if (confirmed) await deleteRoute(this.selectedMapId, routeId, systemId);
    }

    async _confirmDeleteFaction(factionId: string) {
      const confirmed = await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }, GALAXY_DIALOG_OPTIONS);
      if (confirmed) await deleteFaction(this.selectedMapId, factionId);
    }

    async close(options: any = {}) {
      clearManagerApp(this);
      return super.close(options);
    }
  };
}
