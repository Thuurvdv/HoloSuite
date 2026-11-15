import { getApplicationBase } from "./app-base";
import { MODULE_ID } from "./constants";
import { areFactionsEnabled, FACTION_RATING_SCALES, getFactionRatings, type FactionRating, type FactionRatingScale } from "./faction-ratings";
import { randomId } from "./galaxy-model";

declare const game: any;

export function createFactionRatingSettingsClass(templateRoot: string, scale: FactionRatingScale) {
  const { setting, title, icon } = FACTION_RATING_SCALES[scale];
  return class FactionRatingSettings extends getApplicationBase() {
    static DEFAULT_OPTIONS = {
      id: `galaxy-map-${scale}-settings`,
      window: { title: `${title} Ratings`, icon, resizable: true },
      position: { width: 520, height: 480 }
    };

    static PARTS = {
      main: { template: `${templateRoot}/faction-rating-settings.hbs`, scrollable: [""] }
    };

    draft: FactionRating[] | null = null;

    async _prepareContext(options: any) {
      const context = await super._prepareContext(options);
      const canEdit = Boolean(game.user?.isGM && areFactionsEnabled());
      return { ...context, canEdit, title, scale, ratings: canEdit ? this.draft ?? getFactionRatings(scale) : [] };
    }

    _onRender(context: any, options: any) {
      super._onRender(context, options);
      const root: HTMLElement = this.element;
      const form = root.querySelector<HTMLFormElement>("[data-faction-ratings]");
      if (!form) return;
      const readRatings = () => Array.from(form.querySelectorAll<HTMLInputElement>("[data-rating-label]"), input => ({
        id: input.dataset.ratingLabel!,
        label: input.value
      }));
      form.querySelector("[data-add-rating]")?.addEventListener("click", () => {
        this.draft = [...readRatings(), { id: randomId(scale), label: "" }];
        this.render({ force: true });
      });
      form.querySelectorAll<HTMLButtonElement>("[data-remove-rating]").forEach(button => {
        button.addEventListener("click", () => {
          this.draft = readRatings().filter(rating => rating.id !== button.dataset.removeRating);
          this.render({ force: true });
        });
      });
      form.addEventListener("submit", async event => {
        event.preventDefault();
        if (!game.user?.isGM || !areFactionsEnabled()) return;
        const status = form.querySelector<HTMLElement>("[data-rating-status]")!;
        const ratings = readRatings().map(({ id, label }) => ({ id, label: label.trim() }));
        const labels = ratings.map(rating => rating.label.toLowerCase());
        if (labels.includes("") || new Set(labels).size !== ratings.length) {
          status.textContent = "Enter a unique name for each rating.";
          return;
        }
        if (scale === "prominence" && labels.includes("unrated")) {
          status.textContent = "Unrated is reserved for factions without a prominence rating.";
          return;
        }
        const fields = form.querySelector<HTMLFieldSetElement>("fieldset")!;
        if (fields.disabled) return;
        fields.disabled = true;
        status.textContent = "Saving…";
        try {
          await game.settings.set(MODULE_ID, setting, { ratings });
          this.draft = null;
          status.textContent = `${title} ratings saved.`;
        } catch (error) {
          status.textContent = `Could not save ${scale} ratings.`;
          console.error(`Galaxy Map failed to save ${scale} ratings`, error);
        } finally {
          fields.disabled = false;
        }
      });
    }
  };
}
