import { BOUNTY_STATUSES, MODULE_ID, TEMPLATE_ROOT } from "./bounty-constants.js";
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
  requestContract,
  updateBountyState
} from "./bounty-service.js";
import { BountyEditorApp } from "./bounty-editor-app.js";

const ApplicationV2 = foundry.applications?.api?.ApplicationV2 ?? Application;
const HandlebarsApplicationMixin = foundry.applications?.api?.HandlebarsApplicationMixin;
const BaseApplication = HandlebarsApplicationMixin ? HandlebarsApplicationMixin(ApplicationV2) : ApplicationV2;

let boardApp = null;

function getBountyIdFromEvent(event) {
  return event.target.closest("[data-bounty-id]")?.dataset.bountyId;
}

export class BountyBoardApp extends BaseApplication {
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
      clearFilters: BountyBoardApp.#onClearFilters
    }
  };

  static PARTS = {
    board: {
      template: `${TEMPLATE_ROOT}/bounty-board.hbs`
    }
  };

  constructor(options = {}) {
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

  async _prepareContext(options) {
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

  _onRender(context, options) {
    super._onRender?.(context, options);
    const html = this.element;
    html.querySelector(".bb-filters")?.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    html.querySelectorAll("[data-filter]").forEach((input) => {
      input.addEventListener("change", () => this.#updateFilter(input, { immediate: true }));
      input.addEventListener("input", () => this.#updateFilter(input));
    });
    this.#restoreSearchFocus();
    html.querySelectorAll("[data-bounty-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.bountyToggle;
        if (this.expanded.has(id)) this.expanded.delete(id);
        else this.expanded.add(id);
        this.render({ force: true });
      });
    });
  }

  #updateFilter(input, { immediate = false } = {}) {
    this.filters[input.dataset.filter] = input.value;
    if (input.dataset.filter === "search") {
      this.searchSelection = {
        start: input.selectionStart ?? input.value.length,
        end: input.selectionEnd ?? input.value.length
      };
      this.restoreSearchFocus = true;
    }
    if (this.pendingFilterRender) window.clearTimeout(this.pendingFilterRender);
    if (!immediate && input.dataset.filter === "search") {
      this.pendingFilterRender = window.setTimeout(() => {
        this.pendingFilterRender = null;
        this.render({ force: true });
      }, 120);
      return;
    }
    this.render({ force: true });
  }

  #restoreSearchFocus() {
    const search = this.element?.querySelector?.("[data-filter='search']");
    if (!search || !this.restoreSearchFocus || document.activeElement === search || this.searchSelection === null) return;
    this.restoreSearchFocus = false;
    search.focus({ preventScroll: true });
    const start = Math.min(this.searchSelection.start, search.value.length);
    const end = Math.min(this.searchSelection.end, search.value.length);
    search.setSelectionRange?.(start, end);
  }

  async close(options = {}) {
    if (boardApp === this) boardApp = null;
    if (this.pendingFilterRender) window.clearTimeout(this.pendingFilterRender);
    return super.close(options);
  }

  static #onCreateBounty() {
    new BountyEditorApp().render({ force: true });
  }

  static #onEditBounty(event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) new BountyEditorApp({ bountyId }).render({ force: true });
  }

  static async #onDeleteBounty(event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId && await deleteBounty(bountyId)) this.render({ force: true });
  }

  static async #onPublishBounty(event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      await publishBounty(bountyId, true);
      this.render({ force: true });
    }
  }

  static async #onUnpublishBounty(event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      await publishBounty(bountyId, false);
      this.render({ force: true });
    }
  }

  static async #onArchiveBounty(event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      await archiveBounty(bountyId);
      this.render({ force: true });
    }
  }

  static async #onCompleteBounty(event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      await markBountyCompleted(bountyId, false);
      this.render({ force: true });
    }
  }

  static async #onFailBounty(event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      await markBountyCompleted(bountyId, true);
      this.render({ force: true });
    }
  }

  static async #onHideBounty(event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      await updateBountyState(bountyId, { status: BOUNTY_STATUSES.HIDDEN, published: false });
      this.render({ force: true });
    }
  }

  static async #onClaimBounty(event) {
    const bountyId = getBountyIdFromEvent(event);
    const claimedBy = event.target.closest("[data-bounty-id]")?.querySelector("[data-claimed-by]")?.value ?? "";
    if (bountyId) {
      await claimBounty(bountyId, claimedBy);
      this.render({ force: true });
    }
  }

  static async #onRequestContract(event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) await requestContract(bountyId);
  }

  static #onOpenImage(event) {
    const image = event.target.closest("[data-image-src]")?.dataset.imageSrc;
    if (!image) return;
    const title = event.target.closest("[data-bounty-id]")?.querySelector(".bb-card-title")?.textContent?.trim() || "Bounty Image";
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

  static #onOpenJournal(event) {
    const id = event.target.closest("[data-open-journal]")?.dataset.openJournal;
    game.journal?.get(id)?.sheet?.render(true);
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
