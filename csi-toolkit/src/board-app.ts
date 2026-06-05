import {
  BOARD_ADD_COLLECTIONS,
  CARD_HEIGHT,
  CARD_WIDTH,
  COLLECTIONS,
  clamp,
  normalizeBoardLayout,
  normalizeConnection,
  randomId
} from "./case-model";

declare const foundry: any;
declare const game: any;
declare const globalThis: any;
declare const ui: any;

export function createCSICaseBoardClass(deps: any) {
  const {
    LegacyApplication,
    moduleId,
    moduleTitle,
    CSIBoardItemEditor,
    getCase,
    prepareBoardData,
    openCaseManager,
    canUserEditBoard,
    publishSharedLayout,
    requestLayoutPublish,
    deleteBoardItem,
    saveCase,
    defaultBoardPosition,
    getRectEdgeAnchor,
    isFinitePoint,
    clearBoardApp
  } = deps;

  return class CSICaseBoard extends LegacyApplication {
    caseId: string;
    playerMode: boolean;
    _drag: any;
    _pan: any;
    _localLayout: any;
    _layoutDraft: any;
    _pendingConnection: any;
    _contextBoardPosition: any;
    _boundContextClose: any;
    _dimmedKinds: Set<string>;
    _saveTimer: any;
    _boundDragMove: any;
    _boundDragEnd: any;
    _boundPanMove: any;
    _boundPanEnd: any;

    constructor(caseId: string, options: any = {}) {
      super(options);
      this.caseId = caseId;
      this.playerMode = Boolean(options.playerMode);
      this._drag = null;
      this._pan = null;
      this._localLayout = null;
      this._layoutDraft = null;
      this._pendingConnection = null;
      this._contextBoardPosition = null;
      this._boundContextClose = null;
      this._dimmedKinds = new Set();
      this._saveTimer = null;
    }

    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: "CSI Toolkit Case Board",
        template: `modules/${moduleId}/templates/case-board.hbs`,
        classes: ["csi-toolkit", "csi-case-board-window"],
        width: 1220,
        height: 840,
        resizable: true
      });
    }

    get id() {
      return `csi-case-board-${this.caseId}-${this.playerMode ? "player" : "gm"}`;
    }

    get title() {
      const csiCase = getCase(this.caseId);
      const suffix = this.playerMode ? "Player Board" : "GM Board";
      return csiCase ? `${csiCase.title} - ${suffix}` : `CSI Toolkit - ${suffix}`;
    }

    async getData() {
      return prepareBoardData(this.caseId, { playerMode: this.playerMode, layoutOverride: this._localLayout });
    }

    activateListeners(html: any) {
      super.activateListeners(html);
      html.find("[data-action='open-manager']").on("click", () => openCaseManager());
      html.find("[data-action='refresh-board']").on("click", () => this._reloadSharedBoard());
      html.find("[data-action='publish-layout']").on("click", () => this._publishLayout());
      html.find("[data-action='zoom-in']").on("click", () => this._zoomBy(0.1));
      html.find("[data-action='zoom-out']").on("click", () => this._zoomBy(-0.1));
      html.find("[data-action='context-add-board-item']").on("click", (event: any) => this._addBoardItemFromContext(event));
      html.find("[data-action='edit-card']").on("click", (event: any) => this._editCard(event.currentTarget.dataset.collection, event.currentTarget.dataset.itemId));
      html.find("[data-action='delete-board-item']").on("click", (event: any) => this._deleteBoardItem(event.currentTarget.dataset.collection, event.currentTarget.dataset.itemId));
      html.find("[data-action='move-timeline-item']").on("click", (event: any) => this._moveTimelineItem(event.currentTarget.dataset.itemId, event.currentTarget.dataset.direction));
      html.find("[data-csi-connection-hit]").on("dblclick", (event: any) => this._editCard("connections", event.currentTarget.dataset.connectionId));
      html.find("[data-action='start-connection']").on("click", (event: any) => this._startConnection(event));
      html.find("[data-csi-dim-kind]").on("change", (event: any) => this._toggleDimKind(event.currentTarget));

      const viewport = html[0].querySelector("[data-csi-board-viewport]");
      if (viewport) {
        viewport.addEventListener("wheel", (event: any) => this._onWheel(event), { passive: false });
        viewport.addEventListener("mousedown", (event: any) => this._onViewportMouseDown(event));
        viewport.addEventListener("contextmenu", (event: any) => this._openContextMenu(event));
      }

      html.find("[data-csi-board-card]").on("mousedown", (event: any) => this._onCardMouseDown(event));
      html.find("[data-csi-board-card]").on("click", (event: any) => this._completeConnection(event));
      html.find(".csi-card-image").on("load", () => this._queueConnectionLineUpdate());
      this._syncDimControls();
      this._applyDimmedKinds();
      this._queueConnectionLineUpdate();
    }

    _onCardMouseDown(event: any) {
      if (!canUserEditBoard(this.caseId) || event.button !== 0 || event.target.closest("button")) return;
      const card = event.currentTarget;
      const view = this._getView();
      const layout = this._getLayout();
      const itemId = card.dataset.itemId;
      const current = layout.cards[itemId] ?? { x: Number(card.dataset.x) || 0, y: Number(card.dataset.y) || 0 };

      event.preventDefault();
      this._drag = {
        itemId,
        card,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startX: current.x,
        startY: current.y,
        scale: view.scale,
        x: current.x,
        y: current.y,
        frame: null,
        cards: this._getBoardCardMap(),
        connectionGroups: this._getConnectionGroupsForItem(itemId)
      };

      document.addEventListener("mousemove", this._boundDragMove = (moveEvent: any) => this._onCardDrag(moveEvent));
      document.addEventListener("mouseup", this._boundDragEnd = () => this._endDrag());
    }

    _onCardDrag(event: any) {
      if (!this._drag) return;
      const x = Math.round(this._drag.startX + (event.clientX - this._drag.startClientX) / this._drag.scale);
      const y = Math.round(this._drag.startY + (event.clientY - this._drag.startClientY) / this._drag.scale);
      this._drag.x = x;
      this._drag.y = y;

      if (this._drag.frame) return;
      this._drag.frame = globalThis.requestAnimationFrame
        ? globalThis.requestAnimationFrame(() => this._flushCardDrag())
        : globalThis.setTimeout(() => this._flushCardDrag(), 0);
    }

    _flushCardDrag() {
      if (!this._drag) return;
      this._drag.frame = null;
      this._applyCardDragPosition(this._drag.x, this._drag.y);
      this._updateConnectionLines(this._drag.connectionGroups, this._drag.cards);
    }

    _applyCardDragPosition(x: number, y: number) {
      if (!this._drag) return;
      this._drag.card.style.left = `${x}px`;
      this._drag.card.style.top = `${y}px`;
      this._drag.card.dataset.x = x;
      this._drag.card.dataset.y = y;
    }

    _endDrag() {
      if (!this._drag) return;
      document.removeEventListener("mousemove", this._boundDragMove);
      document.removeEventListener("mouseup", this._boundDragEnd);
      if (this._drag.frame) {
        if (globalThis.cancelAnimationFrame) globalThis.cancelAnimationFrame(this._drag.frame);
        else globalThis.clearTimeout?.(this._drag.frame);
        this._drag.frame = null;
      }
      this._applyCardDragPosition(this._drag.x, this._drag.y);
      this._updateConnectionLines(this._drag.connectionGroups, this._drag.cards);
      const layout = this._getLayout();
      layout.cards[this._drag.itemId] = {
        ...(layout.cards[this._drag.itemId] ?? {}),
        x: Number(this._drag.card.dataset.x),
        y: Number(this._drag.card.dataset.y)
      };
      this._drag = null;
      this._saveLayout(layout);
    }

    _onViewportMouseDown(event: any) {
      if (event.button !== 0 || event.target.closest("[data-csi-board-card], [data-csi-context-menu], [data-csi-connection-hit], button")) return;
      this._hideContextMenu();
      const view = this._getView();
      event.preventDefault();
      this._pan = {
        startClientX: event.clientX,
        startClientY: event.clientY,
        startX: view.x,
        startY: view.y
      };
      document.addEventListener("mousemove", this._boundPanMove = (moveEvent: any) => this._onPan(moveEvent));
      document.addEventListener("mouseup", this._boundPanEnd = () => this._endPan());
    }

    _onPan(event: any) {
      if (!this._pan) return;
      const layout = this._getLayout();
      layout.view.x = Math.round(this._pan.startX + event.clientX - this._pan.startClientX);
      layout.view.y = Math.round(this._pan.startY + event.clientY - this._pan.startClientY);
      this._layoutDraft = layout;
      this._applyView(layout.view);
    }

    _endPan() {
      if (!this._pan) return;
      document.removeEventListener("mousemove", this._boundPanMove);
      document.removeEventListener("mouseup", this._boundPanEnd);
      const layout = this._layoutDraft ?? this._getLayout();
      this._pan = null;
      this._saveLayout(layout);
      this._layoutDraft = null;
    }

    _onWheel(event: any) {
      event.preventDefault();
      this._hideContextMenu();
      this._zoomBy(event.deltaY > 0 ? -0.08 : 0.08);
    }

    _zoomBy(delta: number) {
      const layout = this._getLayout();
      layout.view.scale = clamp(Number(layout.view.scale) + delta, 0.45, 1.8);
      this._applyView(layout.view);
      this._saveLayout(layout);
    }

    _applyView(view: any) {
      const canvas = this.element[0]?.querySelector("[data-csi-board-canvas]");
      if (!canvas) return;
      canvas.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
      const zoom = this.element[0]?.querySelector("[data-csi-zoom]");
      if (zoom) zoom.textContent = `${Math.round(view.scale * 100)}%`;
    }

    _getView() {
      return this._getLayout().view;
    }

    _getLayout() {
      const csiCase = getCase(this.caseId);
      return normalizeBoardLayout(this._layoutDraft ?? this._localLayout ?? csiCase?.boardLayout);
    }

    async _saveLayout(layout: any) {
      this._localLayout = normalizeBoardLayout(layout);
    }

    async _publishLayout() {
      if (!canUserEditBoard(this.caseId)) return;
      const layout = this._getLayout();
      if (game.user?.isGM) {
        await publishSharedLayout(this.caseId, layout);
        return;
      }
      await requestLayoutPublish(this.caseId, layout);
    }

    _reloadSharedBoard() {
      this._localLayout = null;
      this._layoutDraft = null;
      this.render(true);
    }

    _getBoardCardMap() {
      const root = this.element[0];
      if (!root) return new Map();
      return new Map(Array.from(root.querySelectorAll("[data-csi-board-card]")).map((card: any) => [card.dataset.itemId, card]));
    }

    _getConnectionGroupsForItem(itemId: string) {
      const root = this.element[0];
      if (!root || !itemId) return [];
      return Array.from(root.querySelectorAll("[data-csi-connection-group]"))
        .filter((group: any) => group.dataset.fromId === itemId || group.dataset.toId === itemId);
    }

    _updateConnectionLines(groups: any[] | null = null, cards: Map<string, any> | null = null) {
      const root = this.element[0];
      if (!root) return;
      const cardMap = cards ?? this._getBoardCardMap();
      const connectionGroups = groups ?? Array.from(root.querySelectorAll("[data-csi-connection-group]"));
      for (const group of connectionGroups) {
        const from = cardMap.get(group.dataset.fromId);
        const to = cardMap.get(group.dataset.toId);
        if (!from || !to) continue;
        const fromRect = this._getCardBoardRect(from);
        const toRect = this._getCardBoardRect(to);
        const start = getRectEdgeAnchor(fromRect, toRect);
        const end = getRectEdgeAnchor(toRect, fromRect);
        if (!isFinitePoint(start) || !isFinitePoint(end)) continue;
        for (const line of group.querySelectorAll("[data-csi-connection-line], [data-csi-connection-hit]")) {
          line.setAttribute("x1", start.x);
          line.setAttribute("y1", start.y);
          line.setAttribute("x2", end.x);
          line.setAttribute("y2", end.y);
        }
        const label = group.querySelector("[data-csi-connection-label]");
        if (label) {
          label.setAttribute("x", Math.round((start.x + end.x) / 2));
          label.setAttribute("y", Math.round((start.y + end.y) / 2 - 10));
        }
      }
    }

    _queueConnectionLineUpdate() {
      const update = () => this._updateConnectionLines();
      if (globalThis.requestAnimationFrame) globalThis.requestAnimationFrame(update);
      else globalThis.setTimeout(update, 0);
    }

    _getCardBoardRect(card: any) {
      const x = Number(card.dataset.x) || Number.parseFloat(card.style.left) || 0;
      const y = Number(card.dataset.y) || Number.parseFloat(card.style.top) || 0;
      const width = card.offsetWidth || CARD_WIDTH;
      const height = card.offsetHeight || CARD_HEIGHT;
      return {
        x,
        y,
        width,
        height,
        centerX: x + width / 2,
        centerY: y + height / 2
      };
    }

    _editCard(collection: string, itemId: string) {
      if (!canUserEditBoard(this.caseId)) return;
      new CSIBoardItemEditor(this.caseId, collection, itemId).render(true);
    }

    async _deleteBoardItem(collection: string, itemId: string) {
      if (!canUserEditBoard(this.caseId) || !COLLECTIONS.includes(collection) || !itemId) return;
      await deleteBoardItem(this.caseId, collection, itemId);
    }

    async _moveTimelineItem(itemId: string, direction: string) {
      if (!canUserEditBoard(this.caseId) || !itemId) return;
      const csiCase = getCase(this.caseId);
      const index = csiCase?.timeline?.findIndex((item: any) => item.id === itemId) ?? -1;
      const offset = direction === "up" ? -1 : direction === "down" ? 1 : 0;
      const nextIndex = index + offset;
      if (!csiCase || index < 0 || nextIndex < 0 || nextIndex >= csiCase.timeline.length) return;
      const [item] = csiCase.timeline.splice(index, 1);
      csiCase.timeline.splice(nextIndex, 0, item);
      await saveCase(csiCase);
    }

    _toggleDimKind(input: any) {
      const kind = input?.value;
      if (!["evidence", "suspects", "locations", "timeline"].includes(kind)) return;
      if (input.checked) this._dimmedKinds.add(kind);
      else this._dimmedKinds.delete(kind);
      this._applyDimmedKinds();
    }

    _syncDimControls() {
      for (const input of this.element[0]?.querySelectorAll("[data-csi-dim-kind]") ?? []) {
        input.checked = this._dimmedKinds.has(input.value);
      }
    }

    _applyDimmedKinds() {
      const root = this.element[0];
      if (!root) return;
      for (const card of root.querySelectorAll("[data-csi-board-card]")) {
        card.classList.toggle("is-type-dimmed", this._dimmedKinds.has(card.dataset.collection));
      }
      for (const row of root.querySelectorAll("[data-csi-timeline-row]")) {
        row.classList.toggle("is-type-dimmed", this._dimmedKinds.has(row.dataset.collection));
      }
    }

    _addBoardItemFromContext(event: any) {
      event.preventDefault();
      event.stopPropagation();
      const collection = event.currentTarget.dataset.collection;
      this._addBoardItem(collection, this._contextBoardPosition);
      this._hideContextMenu();
    }

    _addBoardItem(collection = "evidence", boardPosition: any = null) {
      if (!canUserEditBoard(this.caseId)) return;
      if (!BOARD_ADD_COLLECTIONS.includes(collection)) return;
      new CSIBoardItemEditor(this.caseId, collection, null, { boardPosition }).render(true);
    }

    _openContextMenu(event: any) {
      if (!canUserEditBoard(this.caseId)) return;
      if (event.target.closest("[data-csi-board-card], button, input, select, textarea")) return;

      const menu = this.element[0]?.querySelector("[data-csi-context-menu]");
      const viewport = this.element[0]?.querySelector("[data-csi-board-viewport]");
      if (!menu || !viewport) return;

      event.preventDefault();
      event.stopPropagation();
      this._contextBoardPosition = this._clientToBoardPosition(event.clientX, event.clientY);
      menu.hidden = false;
      const menuWidth = menu.offsetWidth || 156;
      const menuHeight = menu.offsetHeight || 180;
      const maxLeft = Math.max(4, globalThis.innerWidth - menuWidth - 4);
      const maxTop = Math.max(4, globalThis.innerHeight - menuHeight - 4);
      menu.style.left = `${clamp(event.clientX, 4, maxLeft)}px`;
      menu.style.top = `${clamp(event.clientY, 4, maxTop)}px`;

      if (this._boundContextClose) document.removeEventListener("click", this._boundContextClose);
      this._boundContextClose = () => this._hideContextMenu();
      globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: true }), 0);
    }

    _hideContextMenu() {
      const menu = this.element[0]?.querySelector("[data-csi-context-menu]");
      if (menu) menu.hidden = true;
      if (this._boundContextClose) document.removeEventListener("click", this._boundContextClose);
      this._boundContextClose = null;
    }

    _clientToBoardPosition(clientX: number, clientY: number) {
      const viewport = this.element[0]?.querySelector("[data-csi-board-viewport]");
      const rect = viewport?.getBoundingClientRect();
      const view = this._getView();
      if (!rect) return null;
      return {
        x: Math.round((clientX - rect.left - view.x) / view.scale - CARD_WIDTH / 2),
        y: Math.round((clientY - rect.top - view.y) / view.scale - 32)
      };
    }

    _startConnection(event: any) {
      event.preventDefault();
      event.stopPropagation();
      if (!canUserEditBoard(this.caseId)) return;

      const button = event.currentTarget;
      const itemId = button.dataset.itemId;
      if (!itemId) return;

      this._pendingConnection = { fromId: itemId };
      for (const card of this.element[0].querySelectorAll("[data-csi-board-card]")) card.classList.toggle("is-link-source", card.dataset.itemId === itemId);
      ui.notifications?.info(`${moduleTitle}: Select another card to create a connection.`);
    }

    async _completeConnection(event: any) {
      if (!this._pendingConnection || event.target.closest("button, input, select, textarea")) return;
      if (!canUserEditBoard(this.caseId)) return;

      const toId = event.currentTarget.dataset.itemId;
      const fromId = this._pendingConnection.fromId;
      this._pendingConnection = null;
      for (const card of this.element[0].querySelectorAll("[data-csi-board-card]")) card.classList.remove("is-link-source");
      if (!toId || toId === fromId) return;

      const csiCase = getCase(this.caseId);
      if (!csiCase) return;

      const connection = normalizeConnection({
        id: randomId(),
        fromId,
        toId,
        label: "linked to",
        type: "link",
        style: "solid",
        color: "cyan",
        visibility: "players"
      });
      csiCase.connections.push(connection);
      await saveCase(csiCase);
      new CSIBoardItemEditor(this.caseId, "connections", connection.id).render(true);
    }

    async close(options: any = {}) {
      this._hideContextMenu();
      clearBoardApp(this);
      return super.close(options);
    }
  };
}
