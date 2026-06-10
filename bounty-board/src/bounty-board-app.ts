import { BOUNTY_STATUSES, MODULE_ID, TEMPLATE_ROOT } from "./bounty-constants";
import {
  archiveBounty,
  claimBounty,
  deleteBounty,
  filterBounties,
  getAllBounties,
  getFilterOptions,
  markBountyCompleted,
  prepareBountyForDisplay,
  publishBounty,
  removeTag,
  requestContract,
  updateBountyState
} from "./bounty-service";
import { BountyEditorApp } from "./bounty-editor-app";

declare const foundry: any;
declare const Application: any;
declare const game: any;
declare const Dialog: any;
declare const ImagePopout: any;

const ApplicationV2 = foundry.applications?.api?.ApplicationV2 ?? Application;
const HandlebarsApplicationMixin = foundry.applications?.api?.HandlebarsApplicationMixin;
const BaseApplication = HandlebarsApplicationMixin ? HandlebarsApplicationMixin(ApplicationV2) : ApplicationV2;

type BountyFilters = {
  status: string;
  threatLevel: string;
  faction: string;
  tag: string;
  search: string;
};

type SearchSelection = {
  start: number;
  end: number;
};

let boardApp: BountyBoardApp | null = null;

function getBountyIdFromEvent(event: Event) {
  return (event.target as Element | null)?.closest("[data-bounty-id]")?.getAttribute("data-bounty-id") ?? "";
}

export class BountyBoardApp extends BaseApplication {
  filters: BountyFilters;
  expanded: Set<string>;
  pendingFilterRender: ReturnType<typeof window.setTimeout> | null;
  searchSelection: SearchSelection | null;
  restoreSearchFocus: boolean;

  static DEFAULT_OPTIONS = {
    id: "bounty-board-app",
    tag: "section",
    window: {
      title: "Bounty Board",
      icon: "fa-solid fa-crosshairs",
      resizable: true
    },
    position: {
      width: 980,
      height: 720
    },
    classes: ["bounty-board-window"],
    actions: {
      createBounty: BountyBoardApp.#onCreateBounty,
      editBounty: BountyBoardApp.#onEditBounty,
      deleteBounty: BountyBoardApp.#onDeleteBounty,
      publishBounty: BountyBoardApp.#onPublishBounty,
      unpublishBounty: BountyBoardApp.#onUnpublishBounty,
      archiveBounty: BountyBoardApp.#onArchiveBounty,
      completeBounty: BountyBoardApp.#onCompleteBounty,
      failBounty: BountyBoardApp.#onFailBounty,
      hideBounty: BountyBoardApp.#onHideBounty,
      claimBounty: BountyBoardApp.#onClaimBounty,
      requestContract: BountyBoardApp.#onRequestContract,
      openImage: BountyBoardApp.#onOpenImage,
      openJournal: BountyBoardApp.#onOpenJournal,
      removeTag: BountyBoardApp.#onRemoveTag,
      clearFilters: BountyBoardApp.#onClearFilters
    }
  };

  static PARTS = {
    board: {
      template: `${TEMPLATE_ROOT}/bounty-board.hbs`
    }
  };

  constructor(options: any = {}) {
    super(options);
    this.filters = {
      status: "",
      threatLevel: "",
      faction: "",
      tag: "",
      search: ""
    };
    this.expanded = new Set();
    this.pendingFilterRender = null;
    this.searchSelection = null;
    this.restoreSearchFocus = false;
  }

  async _prepareContext(options: any) {
    const isGM = game.user?.isGM === true;
    const bounties = getAllBounties({ includeHidden: isGM })
      .map(prepareBountyForDisplay)
      .map((bounty) => ({ ...bounty, expanded: this.expanded.has(bounty.id) }));

    return {
      isGM,
      filters: this.filters,
      options: getFilterOptions(),
      bounties: filterBounties(bounties, this.filters),
      totalCount: bounties.length,
      visibleCount: filterBounties(bounties, this.filters).length
    };
  }

  _onRender(context: any, options: any) {
    super._onRender?.(context, options);
    const html = this.element;
    html.querySelector(".bb-filters")?.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    html.querySelectorAll("[data-filter]").forEach((input: HTMLInputElement | HTMLSelectElement) => {
      input.addEventListener("change", () => this.#updateFilter(input, { immediate: true }));
      input.addEventListener("input", () => this.#updateFilter(input));
    });
    this.#restoreSearchFocus();
    html.querySelectorAll("[data-bounty-toggle]").forEach((button: HTMLElement) => {
      button.addEventListener("click", () => {
        const id = button.dataset.bountyToggle ?? "";
        if (this.expanded.has(id)) this.expanded.delete(id);
        else this.expanded.add(id);
        this.render({ force: true });
      });
    });
  }

  #updateFilter(input: HTMLInputElement | HTMLSelectElement, { immediate = false } = {}) {
    const filterKey = input.dataset.filter as keyof BountyFilters | undefined;
    if (!filterKey) return;
    this.filters[filterKey] = input.value;
    if (filterKey === "search") {
      const searchInput = input as HTMLInputElement;
      this.searchSelection = {
        start: searchInput.selectionStart ?? input.value.length,
        end: searchInput.selectionEnd ?? input.value.length
      };
      this.restoreSearchFocus = true;
    }
    if (this.pendingFilterRender) window.clearTimeout(this.pendingFilterRender);
    if (!immediate && filterKey === "search") {
      this.pendingFilterRender = window.setTimeout(() => {
        this.pendingFilterRender = null;
        this.render({ force: true });
      }, 120);
      return;
    }
    this.render({ force: true });
  }

  #restoreSearchFocus() {
    const search = this.element?.querySelector?.("[data-filter='search']") as HTMLInputElement | null;
    if (!search || !this.restoreSearchFocus || document.activeElement === search || this.searchSelection === null) return;
    this.restoreSearchFocus = false;
    search.focus({ preventScroll: true });
    const start = Math.min(this.searchSelection.start, search.value.length);
    const end = Math.min(this.searchSelection.end, search.value.length);
    search.setSelectionRange?.(start, end);
  }

  async close(options: any = {}) {
    if (boardApp === this) boardApp = null;
    if (this.pendingFilterRender) window.clearTimeout(this.pendingFilterRender);
    return super.close(options);
  }

  static #onCreateBounty() {
    new BountyEditorApp().render({ force: true });
  }

  static #onEditBounty(event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) new BountyEditorApp({ bountyId }).render({ force: true });
  }

  static async #onDeleteBounty(event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId && await deleteBounty(bountyId)) this.render({ force: true });
  }

  static async #onPublishBounty(event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      await publishBounty(bountyId, true);
      this.render({ force: true });
    }
  }

  static async #onUnpublishBounty(event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      await publishBounty(bountyId, false);
      this.render({ force: true });
    }
  }

  static async #onArchiveBounty(event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      await archiveBounty(bountyId);
      this.render({ force: true });
    }
  }

  static async #onCompleteBounty(event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      await markBountyCompleted(bountyId, false);
      this.render({ force: true });
    }
  }

  static async #onFailBounty(event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      await markBountyCompleted(bountyId, true);
      this.render({ force: true });
    }
  }

  static async #onHideBounty(event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      await updateBountyState(bountyId, { status: BOUNTY_STATUSES.HIDDEN, published: false });
      this.render({ force: true });
    }
  }

  static async #onClaimBounty(event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    const claimedBy = (event.target as Element | null)?.closest("[data-bounty-id]")?.querySelector<HTMLInputElement>("[data-claimed-by]")?.value ?? "";
    if (bountyId) {
      await claimBounty(bountyId, claimedBy);
      this.render({ force: true });
    }
  }

  static async #onRequestContract(event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) await requestContract(bountyId);
  }

  static #onOpenImage(event: Event) {
    const image = (event.target as Element | null)?.closest("[data-image-src]")?.getAttribute("data-image-src");
    if (!image) return;
    const title = (event.target as Element | null)?.closest("[data-bounty-id]")?.querySelector(".bb-card-title")?.textContent?.trim() || "Bounty Image";
    if (globalThis.ImagePopout) {
      new ImagePopout(image, { title }).render(true);
      return;
    }
    const safeImage = String(image).replaceAll('"', "&quot;");
    new Dialog({
      title,
      content: `<img class="bb-image-dialog" src="${safeImage}" alt="" />`,
      buttons: {
        close: { label: "Close" }
      }
    }, { classes: ["bounty-board-window"], width: 720 }).render(true);
  }

  static #onOpenJournal(event: Event) {
    const id = (event.target as Element | null)?.closest("[data-open-journal]")?.getAttribute("data-open-journal");
    game.journal?.get(id)?.sheet?.render(true);
  }

  static async #onRemoveTag() {
    const tag = this.filters.tag;
    if (await removeTag(tag)) {
      this.filters.tag = "";
      this.render({ force: true });
    }
  }

  static #onClearFilters() {
    this.filters = { status: "", threatLevel: "", faction: "", tag: "", search: "" };
    this.render({ force: true });
  }
}

export function openBountyBoard() {
  if (!boardApp) boardApp = new BountyBoardApp();
  boardApp.render({ force: true });
  return boardApp;
}

export function refreshBountyBoard() {
  boardApp?.render({ force: true });
}
