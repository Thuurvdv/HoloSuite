import { BOUNTY_STATUSES, MODULE_ID, TEMPLATE_ROOT } from "./bounty-constants";
import {
  archiveBounty,
  claimBounty,
  deleteBounty,
  filterBounties,
  getAllBounties,
  getFilterOptions,
  isBoardVisibleToPlayers,
  markBountyCompleted,
  prepareBountyForDisplay,
  publishBounty,
  removeTag,
  requestContract,
  setBoardVisibleToPlayers,
  setBountiesPublished,
  updateBountyState
} from "./bounty-service";
import { BountyEditorApp } from "./bounty-editor-app";

declare const foundry: any;
declare const Application: any;
declare const game: any;
declare const Dialog: any;
declare const ImagePopout: any;
declare const renderTemplate: any;

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

let boardApp: BountyBoardApp | null = null;

function getBountyIdFromEvent(event: Event) {
  return (event.target as Element | null)?.closest("[data-bounty-id]")?.getAttribute("data-bounty-id") ?? "";
}

function formatLocalized(key: string, data: Record<string, string | number>, fallback: string) {
  const localized = game.i18n?.format?.(key, data);
  return localized && localized !== key ? localized : fallback;
}

export class BountyBoardApp extends BaseApplication {
  filters: BountyFilters;
  expanded: Set<string>;

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
      showFiltered: BountyBoardApp.#onShowFiltered,
      hideFiltered: BountyBoardApp.#onHideFiltered,
      toggleBoardVisibility: BountyBoardApp.#onToggleBoardVisibility,
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
  }

  async _prepareContext(options: any) {
    const isGM = game.user?.isGM === true;
    const boardVisibleToPlayers = isBoardVisibleToPlayers();
    const boardHiddenForPlayers = !isGM && !boardVisibleToPlayers;
    const bounties = getAllBounties({ includeHidden: isGM })
      .map(prepareBountyForDisplay)
      .map((bounty) => ({ ...bounty, expanded: this.expanded.has(bounty.id) }));
    const structuralFilters = { ...this.filters, search: "" };
    const filteredBounties = boardHiddenForPlayers ? [] : filterBounties(bounties, structuralFilters);
    const visibleCount = boardHiddenForPlayers ? 0 : filterBounties(bounties, this.filters).length;
    const activeCount = bounties.filter((bounty) => [BOUNTY_STATUSES.AVAILABLE, BOUNTY_STATUSES.CLAIMED].includes(bounty.status as any)).length;
    const hasActiveFilters = Object.values(this.filters).some((value) => value.trim().length > 0);
    const activeCountLabel = String(activeCount).padStart(2, "0");

    return {
      isGM,
      boardVisibleToPlayers,
      boardHiddenForPlayers,
      filters: this.filters,
      options: getFilterOptions(),
      bounties: filteredBounties,
      totalCount: bounties.length,
      visibleCount,
      activeCount,
      contractSummary: hasActiveFilters
        ? formatLocalized("BOUNTYBOARD.Header.ShowingContracts", { visible: visibleCount, total: bounties.length }, `Showing ${visibleCount} of ${bounties.length} contracts`)
        : formatLocalized("BOUNTYBOARD.Header.ActiveContracts", { count: activeCountLabel }, `${activeCountLabel} active contracts`)
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
      if (input.dataset.filter === "search") {
        input.addEventListener("input", () => {
          this.filters.search = input.value;
          this.#applySearchFilter();
        });
      } else {
        input.addEventListener("change", () => this.#updateFilter(input, { immediate: true }));
      }
    });
    this.#applySearchFilter();
    this._bindBountyToggles(html);
  }

  _bindBountyToggles(root: ParentNode) {
    root.querySelectorAll("[data-bounty-toggle]").forEach((button: HTMLElement) => {
      button.addEventListener("click", () => {
        const id = button.dataset.bountyToggle ?? "";
        const expanded = !this.expanded.has(id);
        if (expanded) this.expanded.add(id);
        else this.expanded.delete(id);

        const card = button.closest<HTMLElement>("[data-bounty-id]");
        card?.classList.toggle("is-expanded", expanded);
        card?.classList.toggle("is-collapsed", !expanded);
        const details = card?.querySelector<HTMLElement>(".bb-card-details");
        if (details) details.hidden = !expanded;

        button.setAttribute("aria-expanded", String(expanded));
        button.title = expanded ? button.dataset.expandedTitle ?? "" : button.dataset.collapsedTitle ?? "";
        const visibleLabel = button.querySelector<HTMLElement>(".bb-expand-label");
        if (visibleLabel) visibleLabel.textContent = expanded ? button.dataset.expandedLabel ?? "" : button.dataset.collapsedLabel ?? "";
        const accessibleLabel = button.querySelector<HTMLElement>(".bb-visually-hidden");
        if (accessibleLabel) accessibleLabel.textContent = button.title;
        const icon = button.querySelector<HTMLElement>("i");
        icon?.classList.toggle("fa-chevron-up", expanded);
        icon?.classList.toggle("fa-chevron-down", !expanded);
      });
    });
  }

  _findBountyCard(bountyId: string) {
    const cards = Array.from(this.element?.querySelectorAll?.("[data-bounty-id]") ?? []) as HTMLElement[];
    return cards.find((card) => card.dataset.bountyId === bountyId) ?? null;
  }

  _syncCountData() {
    const bounties = getAllBounties({ includeHidden: game.user?.isGM === true });
    const activeCount = bounties.filter((bounty) => [BOUNTY_STATUSES.AVAILABLE, BOUNTY_STATUSES.CLAIMED].includes(bounty.status as any)).length;
    const subtitle = this.element?.querySelector?.(".bb-subtitle") as HTMLElement | null;
    if (!subtitle) return;
    subtitle.dataset.totalCount = String(bounties.length);
    subtitle.dataset.activeCount = String(activeCount);
  }

  async _refreshBountyCard(bountyId: string, source: any) {
    const currentCard = this._findBountyCard(bountyId);
    if (!currentCard || !source) return;

    const bounty = {
      ...prepareBountyForDisplay(source),
      expanded: this.expanded.has(bountyId)
    };
    const structuralFilters = { ...this.filters, search: "" };
    const remainsVisible = filterBounties([bounty], structuralFilters).length > 0;

    if (!remainsVisible) {
      currentCard.remove();
    } else {
      const markup = await renderTemplate(`${TEMPLATE_ROOT}/bounty-card.hbs`, {
        bounty,
        isGM: game.user?.isGM === true
      });
      const fragment = document.createElement("template");
      fragment.innerHTML = String(markup).trim();
      const replacement = fragment.content.firstElementChild as HTMLElement | null;
      if (replacement) {
        currentCard.replaceWith(replacement);
        this._bindBountyToggles(replacement);
      }
    }

    this._syncCountData();
    this.#applySearchFilter();
  }

  _removeBountyCard(bountyId: string) {
    this._findBountyCard(bountyId)?.remove();
    this.expanded.delete(bountyId);
    this._syncCountData();
    this.#applySearchFilter();
  }

  #updateFilter(input: HTMLInputElement | HTMLSelectElement, { immediate = false } = {}) {
    const filterKey = input.dataset.filter as keyof BountyFilters | undefined;
    if (!filterKey) return;
    this.filters[filterKey] = input.value;
    this.render({ force: true });
  }

  #applySearchFilter() {
    const search = this.filters.search.trim().toLowerCase();
    const cards = Array.from(this.element?.querySelectorAll?.("[data-bounty-id]") ?? []) as HTMLElement[];
    let visibleCount = 0;
    for (const card of cards) {
      const matches = !search || String(card.dataset.searchText ?? "").includes(search);
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    }

    const subtitle = this.element?.querySelector?.(".bb-subtitle");
    const totalCount = Number(subtitle?.dataset?.totalCount ?? cards.length);
    const activeCount = Number(subtitle?.dataset?.activeCount ?? cards.length);
    if (subtitle) {
      subtitle.textContent = this.#hasActiveFilters()
        ? formatLocalized("BOUNTYBOARD.Header.ShowingContracts", { visible: visibleCount, total: totalCount }, `Showing ${visibleCount} of ${totalCount} contracts`)
        : formatLocalized("BOUNTYBOARD.Header.ActiveContracts", { count: String(activeCount).padStart(2, "0") }, `${String(activeCount).padStart(2, "0")} active contracts`);
    }
    this.element?.querySelectorAll?.("[data-action='showFiltered'], [data-action='hideFiltered']").forEach((button: HTMLButtonElement) => {
      button.disabled = visibleCount === 0;
    });
    const searchEmpty = this.element?.querySelector?.(".bb-search-empty") as HTMLElement | null;
    if (searchEmpty) searchEmpty.hidden = visibleCount > 0;
  }

  #hasActiveFilters() {
    return Object.values(this.filters).some((value) => value.trim().length > 0);
  }

  async close(options: any = {}) {
    if (boardApp === this) boardApp = null;
    return super.close(options);
  }

  static #onCreateBounty() {
    new BountyEditorApp().render({ force: true });
  }

  static #onEditBounty(event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) new BountyEditorApp({ bountyId }).render({ force: true });
  }

  static async #onDeleteBounty(this: BountyBoardApp, event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId && await deleteBounty(bountyId)) this._removeBountyCard(bountyId);
  }

  static async #onPublishBounty(this: BountyBoardApp, event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      const updated = await publishBounty(bountyId, true);
      if (updated) await this._refreshBountyCard(bountyId, updated);
    }
  }

  static async #onUnpublishBounty(this: BountyBoardApp, event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      const updated = await publishBounty(bountyId, false);
      if (updated) await this._refreshBountyCard(bountyId, updated);
    }
  }

  static async #onArchiveBounty(this: BountyBoardApp, event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      const updated = await archiveBounty(bountyId);
      if (updated) await this._refreshBountyCard(bountyId, updated);
    }
  }

  static async #onCompleteBounty(this: BountyBoardApp, event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      const updated = await markBountyCompleted(bountyId, false);
      if (updated) await this._refreshBountyCard(bountyId, updated);
    }
  }

  static async #onFailBounty(this: BountyBoardApp, event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      const updated = await markBountyCompleted(bountyId, true);
      if (updated) await this._refreshBountyCard(bountyId, updated);
    }
  }

  static async #onHideBounty(this: BountyBoardApp, event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) {
      const updated = await updateBountyState(bountyId, { status: BOUNTY_STATUSES.HIDDEN, published: false });
      if (updated) await this._refreshBountyCard(bountyId, updated);
    }
  }

  static async #onClaimBounty(this: BountyBoardApp, event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    const claimedBy = (event.target as Element | null)?.closest("[data-bounty-id]")?.querySelector<HTMLInputElement>("[data-claimed-by]")?.value ?? "";
    if (bountyId) {
      const updated = await claimBounty(bountyId, claimedBy);
      if (updated) await this._refreshBountyCard(bountyId, updated);
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

  static async #onShowFiltered() {
    const bounties = filterBounties(getAllBounties({ includeHidden: true }), this.filters);
    if (await setBountiesPublished(bounties.map((bounty) => bounty.id), true)) this.render({ force: true });
  }

  static async #onHideFiltered() {
    const bounties = filterBounties(getAllBounties({ includeHidden: true }), this.filters);
    if (await setBountiesPublished(bounties.map((bounty) => bounty.id), false)) this.render({ force: true });
  }

  static async #onToggleBoardVisibility() {
    if (await setBoardVisibleToPlayers(!isBoardVisibleToPlayers())) this.render({ force: true });
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

export async function refreshBountyBoard(bounty: any = null) {
  if (!boardApp) return;
  if (bounty?.id && boardApp._findBountyCard(bounty.id)) {
    await boardApp._refreshBountyCard(bounty.id, bounty);
    return;
  }
  boardApp.render({ force: true });
}
