declare const foundry: any;
declare const Application: any;
declare const Dialog: any;

function getApplicationBase() {
  const ApplicationV2 = foundry.applications?.api?.ApplicationV2;
  const HandlebarsApplicationMixin = foundry.applications?.api?.HandlebarsApplicationMixin;
  if (ApplicationV2 && HandlebarsApplicationMixin) return HandlebarsApplicationMixin(ApplicationV2);
  return Application;
}

export function createGalaxyMapManagerClass(deps: any) {
  const {
    templateRoot,
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
    clearManagerApp
  } = deps;

  return class GalaxyMapManager extends getApplicationBase() {
    selectedMapId: string | null;
    jsonDraft: string;

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
        template: `${templateRoot}/map-manager.hbs`
      }
    };

    constructor(options: any = {}) {
      super(options);
      this.selectedMapId = options.selectedMapId ?? null;
      this.jsonDraft = "";
    }

    async _prepareContext(options: any) {
      const context = await super._prepareContext?.(options) ?? {};
      const maps = getMaps().sort((a: any, b: any) => a.title.localeCompare(b.title));
      if (!this.selectedMapId || !maps.some((map: any) => map.id === this.selectedMapId)) {
        this.selectedMapId = maps[0]?.id ?? null;
      }
      const selectedMap = this.selectedMapId ? prepareMapForManager(getRawMap(this.selectedMapId)) : null;
      return {
        ...context,
        maps,
        selectedMap,
        selectedMapId: this.selectedMapId,
        hasMaps: maps.length > 0
      };
    }

    _attachPartListeners(partId: string, html: any, options: any) {
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
      html.querySelectorAll("[data-edit-system]").forEach((button: any) => {
        button.addEventListener("click", () => openSystemDialog(this.selectedMapId, button.dataset.editSystem));
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
        button.addEventListener("click", () => openRouteDialog(this.selectedMapId, button.dataset.editRoute));
      });
      html.querySelectorAll("[data-show-route]").forEach((button: any) => {
        button.addEventListener("click", () => hideRouteFromPlayers(this.selectedMapId, button.dataset.showRoute, false));
      });
      html.querySelectorAll("[data-hide-route]").forEach((button: any) => {
        button.addEventListener("click", () => hideRouteFromPlayers(this.selectedMapId, button.dataset.hideRoute, true));
      });
      html.querySelectorAll("[data-delete-route]").forEach((button: any) => {
        button.addEventListener("click", () => this._confirmDeleteRoute(button.dataset.deleteRoute));
      });
      html.querySelectorAll("[data-edit-faction]").forEach((button: any) => {
        button.addEventListener("click", () => openFactionDialog(this.selectedMapId, button.dataset.editFaction));
      });
      html.querySelectorAll("[data-delete-faction]").forEach((button: any) => {
        button.addEventListener("click", () => this._confirmDeleteFaction(button.dataset.deleteFaction));
      });
      html.querySelector("[data-action='export-map']")?.addEventListener("click", () => {
        if (this.selectedMapId) exportMap(this.selectedMapId);
      });
      html.querySelectorAll("[data-select-map]").forEach((button: any) => {
        button.addEventListener("click", () => {
          this.selectedMapId = button.dataset.selectMap;
          this.jsonDraft = "";
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
            this.jsonDraft = "";
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
            content: `<p>Delete <strong>${map?.title ?? mapId}</strong>? This cannot be undone.</p>`
          });
          if (!confirmed) return;
          await deleteMap(mapId);
          if (this.selectedMapId === mapId) this.selectedMapId = null;
          this.jsonDraft = "";
          this.render({ force: true });
        });
      });
      html.querySelector("[data-action='close-player-map']")?.addEventListener("click", () => closePlayerMap());
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

    async _confirmDeleteSystem(systemId: string) {
      const confirmed = await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      });
      if (confirmed) await deleteSystem(this.selectedMapId, systemId);
    }

    async _confirmDeleteRoute(routeId: string) {
      const confirmed = await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      });
      if (confirmed) await deleteRoute(this.selectedMapId, routeId);
    }

    async _confirmDeleteFaction(factionId: string) {
      const confirmed = await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      });
      if (confirmed) await deleteFaction(this.selectedMapId, factionId);
    }

    async close(options: any = {}) {
      clearManagerApp(this);
      return super.close(options);
    }
  };
}
