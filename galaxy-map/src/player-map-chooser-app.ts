declare const foundry: any;
declare const Application: any;

import { activateGalaxyWindowChrome } from "./window-chrome";

function getApplicationBase() {
  const ApplicationV2 = foundry.applications?.api?.ApplicationV2;
  const HandlebarsApplicationMixin = foundry.applications?.api?.HandlebarsApplicationMixin;
  if (ApplicationV2 && HandlebarsApplicationMixin) return HandlebarsApplicationMixin(ApplicationV2);
  return Application;
}

export function createPlayerMapChooserClass(deps: any) {
  const { templateRoot, getVisibleMaps, openMap, clearChooser } = deps;
  return class PlayerMapChooser extends getApplicationBase() {
    static DEFAULT_OPTIONS = {
      id: "galaxy-map-player-chooser",
      classes: ["galaxy-map", "galaxy-map-framework", "gmf-manager-window", "gmf-map-chooser-window"],
      window: { title: "Choose Galaxy Map", icon: "fa-solid fa-satellite", resizable: true },
      position: { width: 480, height: 420 }
    };

    static PARTS = { main: { template: `${templateRoot}/player-map-chooser.hbs` } };

    async _prepareContext(options: any) {
      return { ...(await super._prepareContext?.(options) ?? {}), maps: getVisibleMaps() };
    }

    _attachPartListeners(partId: string, html: HTMLElement, options: any) {
      super._attachPartListeners?.(partId, html, options);
      activateGalaxyWindowChrome(this, html);
      html.querySelectorAll<HTMLElement>("[data-player-open-map]").forEach(button => {
        button.addEventListener("click", () => {
          openMap(button.dataset.playerOpenMap, { playerMode: true });
          this.close();
        });
      });
    }

    async close(options: any = {}) {
      clearChooser(this);
      return super.close(options);
    }
  };
}
