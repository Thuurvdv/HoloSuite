import { BOUNTY_STATUSES, MODULE_ID, SETTING_LARGE_CARDS, TEMPLATE_ROOT } from "./bounty-constants";
import {
  filterBounties,
  getAllBounties,
  getFilterOptions,
  isBoardVisibleToPlayers,
  linkBountyTarget,
  prepareBountyForDisplay,
  removeTag,
  setBoardVisibleToPlayers,
  setBountiesPublished,
  setBountyStatus,
  updateBountyState
} from "./bounty-service";
import { BountyEditorApp } from "./bounty-editor-app";
import { openBountyHandout } from "./bounty-handout";
import { prefersReducedMotion, revealBoard, toggleDetails, pulseStatus } from "./bounty-motion";

declare const foundry: any;
declare const Application: any;
declare const game: any;
declare const ui: any;
declare const Dialog: any;
declare const ImagePopout: any;
declare const renderTemplate: any;

const ApplicationV2 = foundry.applications?.api?.ApplicationV2 ?? Application;
const HandlebarsApplicationMixin = foundry.applications?.api?.HandlebarsApplicationMixin;
const BaseApplication = HandlebarsApplicationMixin ? HandlebarsApplicationMixin(ApplicationV2) : ApplicationV2;

type BountyFilters = {
  missionType: string;
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
  declare element: HTMLElement;
  filters: BountyFilters;
  expanded: Set<string>;
  focusBountyId: string | null;
  _targetDropController?: AbortController;
  _hasRevealed = false;
  _tagTickerObserver?: ResizeObserver;

  static DEFAULT_OPTIONS = {
    id: "bounty-board-app",
    tag: "section",
    window: {
      title: "Bounty Board",
      icon: "fa-solid fa-crosshairs",
      minimizable: false,
      resizable: true
    },
    position: {
      width: 1180,
      height: 720
    },
    classes: ["bounty-board-window"],
    actions: {
      filterTag: BountyBoardApp.#onFilterTag,
      openHandout: BountyBoardApp.#onOpenHandout,
      closeBoard: BountyBoardApp.#onCloseBoard,
      createBounty: BountyBoardApp.#onCreateBounty,
      editBounty: BountyBoardApp.#onEditBounty,
      openImage: BountyBoardApp.#onOpenImage,
      openJournal: BountyBoardApp.#onOpenJournal,
      removeTag: BountyBoardApp.#onRemoveTag,
      showFiltered: BountyBoardApp.#onShowFiltered,
      hideFiltered: BountyBoardApp.#onHideFiltered,
      toggleBoardVisibility: BountyBoardApp.#onToggleBoardVisibility,
      clearFilters: BountyBoardApp.#onClearFilters,
      unlinkTarget: BountyBoardApp.#onUnlinkTarget
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
      missionType: "",
      status: "",
      threatLevel: "",
      faction: "",
      tag: "",
      search: ""
    };
    this.expanded = new Set();
    this.focusBountyId = null;
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
      largeCards: game.settings.get(MODULE_ID, SETTING_LARGE_CARDS) === true,
      boardVisibleToPlayers,
      boardHiddenForPlayers,
      filters: this.filters,
      tagFilterLabel: this.filters.tag || game.i18n.localize("BOUNTYBOARD.Filter.AllTags"),
      options: getFilterOptions(),
      statusOptions: this._statusOptions(bounties),
      bounties: filteredBounties,
      totalCount: bounties.length,
      visibleCount,
      activeCount,
      contractSummary: hasActiveFilters
        ? formatLocalized("BOUNTYBOARD.Header.ShowingContracts", { visible: visibleCount, total: bounties.length }, `Showing ${visibleCount} of ${bounties.length} contracts`)
        : formatLocalized("BOUNTYBOARD.Header.ActiveContracts", { count: activeCountLabel }, `${activeCountLabel} active contracts`)
    };
  }

  _statusOptions(bounties = getAllBounties({ includeHidden: game.user?.isGM === true })) {
    const statuses = getFilterOptions().statuses.filter((status) => game.user?.isGM || ![BOUNTY_STATUSES.HIDDEN, BOUNTY_STATUSES.ARCHIVED].includes(status.value as any));
    return [{ value: "", label: game.i18n.localize("BOUNTYBOARD.Filter.AllStatuses") }, ...statuses]
      .map((status) => ({ ...status, selected: this.filters.status === status.value,
        count: bounties.filter((bounty) => !status.value || bounty.status === status.value).length }));
  }

  _onRender(context: any, options: any) {
    super._onRender?.(context, options);
    const html = this.element;
    this._tagTickerObserver?.disconnect();
    const heading = html.querySelector<HTMLElement>(".bb-header");
    heading?.addEventListener("pointerdown", (event: PointerEvent) => {
      if (event.button !== 0) return;
      if ((event.target as Element)?.closest("button, a, input, select, textarea, summary, details, [contenteditable='true']")) return;
      event.preventDefault();
      const { left, top } = this.position;
      const startX = event.clientX;
      const startY = event.clientY;
      heading.setPointerCapture(event.pointerId);
      const move = (next: PointerEvent) => {
        if (next.pointerId !== event.pointerId) return;
        this.setPosition({ left: left + next.clientX - startX, top: top + next.clientY - startY });
      };
      const stop = () => {
        heading.removeEventListener("pointermove", move);
        heading.removeEventListener("lostpointercapture", stop);
      };
      heading.addEventListener("pointermove", move);
      heading.addEventListener("lostpointercapture", stop);
    });
    this._targetDropController?.abort();
    if (game.user?.isGM) {
      this._targetDropController = new AbortController();
      const { signal } = this._targetDropController;
      html.addEventListener("dragover", (event: DragEvent) => {
        const card = (event.target as Element)?.closest?.(".bb-card[data-bounty-id]");
        if (!card) return;
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
        card.classList.add("bb-target-drop-active");
      }, { signal });
      html.addEventListener("dragleave", (event: DragEvent) => {
        const card = (event.target as Element)?.closest?.(".bb-card[data-bounty-id]");
        if (card && !card.contains(event.relatedTarget as Node)) card.classList.remove("bb-target-drop-active");
      }, { signal });
      html.addEventListener("drop", (event: DragEvent) => this._onTargetDrop(event), { signal });
    }
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
        input.addEventListener("change", () => this.#updateFilter(input));
      }
    });
    this.#applySearchFilter();
    this._bindBountyToggles(html);
    if (!this._hasRevealed) {
      revealBoard(html);
      this._hasRevealed = true;
    }
    if (this.focusBountyId) {
      const bountyId = this.focusBountyId;
      this.focusBountyId = null;
      requestAnimationFrame(() => {
        const card = this._findBountyCard(bountyId);
        if (!card) return;
        card.tabIndex = -1;
        card.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "instant" : "smooth" });
        card.focus({ preventScroll: true });
      });
    }
  }

  _bindBountyToggles(root: ParentNode) {
    if (typeof ResizeObserver !== "undefined") {
      this._tagTickerObserver ??= new ResizeObserver(entries => {
        for (const { target } of entries) {
          const viewport = target as HTMLElement;
          const track = viewport.querySelector<HTMLElement>(".bb-tags-track");
          if (!track) continue;
          const travel = Math.max(0, track.scrollWidth - viewport.clientWidth);
          viewport.classList.toggle("is-overflowing", travel > 1);
          track.style.setProperty("--bb-tags-travel", `${travel}px`);
          track.style.setProperty("--bb-tags-duration", `${Math.max(7, travel / 20)}s`);
        }
      });
      root.querySelectorAll(".bb-tags-viewport").forEach(viewport => this._tagTickerObserver.observe(viewport));
    }
    root.querySelectorAll<HTMLSelectElement>("[data-bounty-status]").forEach(select => {
      select.addEventListener("change", async () => {
        if (!game.user?.isGM) return;
        select.disabled = true;
        try {
          const updated = await setBountyStatus(select.closest<HTMLElement>("[data-bounty-id]")?.dataset.bountyId ?? "", select.value);
          if (updated) await this._refreshBountyCard(updated.id, updated);
        } finally { select.disabled = false; }
      });
    });
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
        if (details) toggleDetails(details, expanded);

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

  async _onTargetDrop(event: DragEvent) {
    const card = (event.target as Element)?.closest?.<HTMLElement>(".bb-card[data-bounty-id]");
    if (!card || !game.user?.isGM) return;
    event.preventDefault(); event.stopPropagation();
    card.classList.remove("bb-target-drop-active");
    try {
      const editor = foundry.applications?.ux?.TextEditor?.implementation ?? (globalThis as any).TextEditor;
      const data = editor?.getDragEventData ? editor.getDragEventData(event) : JSON.parse(event.dataTransfer?.getData("text/plain") || "{}");
      const updated = await linkBountyTarget(card.dataset.bountyId || "", data);
      if (updated) await this._refreshBountyCard(updated.id, updated);
    } catch (error) { ui.notifications?.warn?.(error.message); }
  }

  static async #onUnlinkTarget(this: BountyBoardApp, event: Event) {
    try {
      const updated = await linkBountyTarget(getBountyIdFromEvent(event), null);
      if (updated) await this._refreshBountyCard(updated.id, updated);
    } catch (error) { ui.notifications?.warn?.(error.message); }
  }

  _findBountyCard(bountyId: string) {
    const cards = Array.from(this.element?.querySelectorAll?.("[data-bounty-id]") ?? []) as HTMLElement[];
    return cards.find((card) => card.dataset.bountyId === bountyId) ?? null;
  }

  _syncCountData() {
    const bounties = getAllBounties({ includeHidden: game.user?.isGM === true });
    const activeCount = bounties.filter((bounty) => [BOUNTY_STATUSES.AVAILABLE, BOUNTY_STATUSES.CLAIMED].includes(bounty.status as any)).length;
    const subtitle = this.element?.querySelector<HTMLElement>(".bb-subtitle") as HTMLElement | null;
    const options = this.element?.querySelectorAll?.<HTMLOptionElement>("[data-filter='status'] option") ?? [];
    for (const status of this._statusOptions(bounties)) {
      const option = Array.from(options).find(option => option.value === status.value);
      if (option) option.textContent = `${status.label} (${status.count})`;
    }
    if (!subtitle) return;
    subtitle.dataset.totalCount = String(bounties.length);
    subtitle.dataset.activeCount = String(activeCount);
  }

  async _refreshBountyCard(bountyId: string, source: any) {
    const currentCard = this._findBountyCard(bountyId);
    if (!currentCard || !source) return;
    currentCard.querySelectorAll(".bb-tags-viewport").forEach(viewport => this._tagTickerObserver?.unobserve(viewport));
    // Type changes also change the available filter choices.
    if (currentCard.dataset.missionType !== (source.missionType || "Bounty")) {
      this.render({ force: true });
      return;
    }

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
        pulseStatus(replacement, currentCard.dataset.status);
      }
    }

    this._syncCountData();
    this.#applySearchFilter();
  }

  #updateFilter(input: HTMLInputElement | HTMLSelectElement) {
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

    const subtitle = this.element?.querySelector<HTMLElement>(".bb-subtitle");
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

  focusBounty(bountyId: string) {
    this.filters = { missionType: "", status: "", threatLevel: "", faction: "", tag: "", search: "" };
    this.expanded.add(bountyId);
    this.focusBountyId = bountyId;
    this.render({ force: true });
  }

  async close(options: any = {}) {
    this._tagTickerObserver?.disconnect();
    this._targetDropController?.abort();
    if (boardApp === this) boardApp = null;
    return super.close(options);
  }

  static #onCreateBounty() {
    new BountyEditorApp().render({ force: true });
  }

  static #onOpenHandout(event: Event) {
    return openBountyHandout(getBountyIdFromEvent(event));
  }

  static async #onCloseBoard(this: BountyBoardApp) {
    await this.close();
  }

  static #onEditBounty(event: Event) {
    const bountyId = getBountyIdFromEvent(event);
    if (bountyId) new BountyEditorApp({ bountyId }).render({ force: true });
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

  static #onFilterTag(this: BountyBoardApp, event: Event, target: HTMLElement) {
    this.filters.tag = target.dataset.tag ?? "";
    this.render({ force: true });
  }

  static async #onRemoveTag(this: BountyBoardApp, event: Event, target: HTMLElement) {
    const tag = target.dataset.tag ?? "";
    if (await removeTag(tag)) {
      if (this.filters.tag === tag) this.filters.tag = "";
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
    this.filters = { missionType: "", status: "", threatLevel: "", faction: "", tag: "", search: "" };
    this.render({ force: true });
  }
}

export function openBountyBoard() {
  if (!boardApp) boardApp = new BountyBoardApp();
  boardApp.render({ force: true });
  return boardApp;
}

export function openBounty(bountyId: string) {
  const id = String(bountyId || "");
  const isGM = game.user?.isGM === true;
  if (!id || (!isGM && !isBoardVisibleToPlayers())) return false;
  const visible = getAllBounties({ includeHidden: isGM }).some((bounty) => bounty.id === id);
  if (!visible) return false;
  if (!boardApp) boardApp = new BountyBoardApp();
  const app = boardApp;
  const reveal = () => {
    app.focusBounty(id);
    app.bringToFront?.();
  };
  // Finish restoring a minimized window before rerendering its focused contract.
  if (app.rendered) Promise.resolve(app.maximize?.()).then(reveal);
  else reveal();
  return true;
}

export async function refreshBountyBoard(bounty: any = null) {
  if (!boardApp) return;
  if (bounty?.id && boardApp._findBountyCard(bounty.id)) {
    await boardApp._refreshBountyCard(bounty.id, bounty);
    return;
  }
  boardApp.render({ force: true });
}
