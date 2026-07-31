var Pe = Object.defineProperty;
var Be = (i, l, p) => l in i ? Pe(i, l, { enumerable: !0, configurable: !0, writable: !0, value: p }) : i[l] = p;
var x = (i, l, p) => Be(i, typeof l != "symbol" ? l + "" : l, p);
const Te = ["open", "cold", "solved", "classified"], Z = ["gm", "players"], Le = ["database", "noir"], ce = ["physical", "digital", "biological", "weapon", "document", "testimony", "other"], le = ["unknown", "relevant", "red_herring", "confirmed"], de = ["unknown", "cleared", "person_of_interest", "prime_suspect", "arrested", "dead"], ue = ["link", "supports", "contradicts", "location", "timeline", "identity"], me = ["solid", "dashed", "dotted"], fe = ["cyan", "green", "red", "amber", "violet", "orange", "white"], xe = ["evidence", "suspects", "locations", "timeline", "connections"], ke = ["evidence", "suspects", "locations", "timeline", "connections"];
function G(i = {}, { forceNewId: l = !1 } = {}) {
  return {
    id: l ? Y() : i.id || Y(),
    title: String(i.title || "Untitled Case"),
    subtitle: String(i.subtitle || ""),
    status: z(i.status, Te, "open"),
    description: String(i.description || ""),
    image: String(i.image || ""),
    visibility: z(i.visibility, Z, "players"),
    evidence: ee(i.evidence, pe),
    suspects: ee(i.suspects, he),
    locations: ee(i.locations, ge),
    timeline: ee(i.timeline, ye),
    connections: ee(i.connections, ne),
    boardLayout: K(i.boardLayout)
  };
}
function pe(i = {}) {
  return {
    id: i.id || Y(),
    title: String(i.title || "Untitled Evidence"),
    type: z(i.type, ce, "other"),
    description: String(i.description || ""),
    image: String(i.image || ""),
    status: z(i.status, le, "unknown"),
    visibility: z(i.visibility, Z, "players"),
    hidden: !!i.hidden,
    notes: String(i.notes || "")
  };
}
function he(i = {}) {
  return {
    id: i.id || Y(),
    name: String(i.name || "Unknown Suspect"),
    alias: String(i.alias || ""),
    image: String(i.image || ""),
    motive: String(i.motive || ""),
    alibi: String(i.alibi || ""),
    status: z(i.status, de, "unknown"),
    visibility: z(i.visibility, Z, "players"),
    hidden: !!i.hidden,
    notes: String(i.notes || "")
  };
}
function ge(i = {}) {
  return {
    id: i.id || Y(),
    name: String(i.name || "Unknown Location"),
    sceneId: String(i.sceneId || ""),
    image: String(i.image || ""),
    description: String(i.description || ""),
    visibility: z(i.visibility, Z, "players"),
    hidden: !!i.hidden,
    notes: String(i.notes || "")
  };
}
function ye(i = {}) {
  return {
    id: i.id || Y(),
    time: String(i.time || ""),
    title: String(i.title || "Timeline Event"),
    description: String(i.description || ""),
    linkedItemIds: Array.isArray(i.linkedItemIds) ? i.linkedItemIds.map(String) : [],
    visibility: z(i.visibility, Z, "players"),
    hidden: !!i.hidden
  };
}
function ne(i = {}) {
  return {
    id: i.id || Y(),
    fromId: String(i.fromId || ""),
    toId: String(i.toId || ""),
    label: String(i.label || ""),
    type: z(i.type, ue, "link"),
    style: z(i.style, me, "solid"),
    color: z(i.color, fe, Oe(i.type)),
    visibility: z(i.visibility, Z, "players")
  };
}
function K(i = {}) {
  var l, p, b;
  return {
    theme: z(i.theme, Le, "database"),
    view: {
      x: Number((l = i.view) == null ? void 0 : l.x) || 0,
      y: Number((p = i.view) == null ? void 0 : p.y) || 0,
      scale: se(Number((b = i.view) == null ? void 0 : b.scale) || 1, 0.45, 1.8)
    },
    cards: Object.fromEntries(Object.entries(i.cards ?? {}).map(([m, w]) => [m, {
      x: Number(w == null ? void 0 : w.x) || 0,
      y: Number(w == null ? void 0 : w.y) || 0
    }]))
  };
}
function Ne(i, l = "players", p = Y()) {
  return i === "evidence" ? pe({ id: p, visibility: l }) : i === "suspects" ? he({ id: p, visibility: l }) : i === "locations" ? ge({ id: p, visibility: l }) : i === "timeline" ? ye({ id: p, visibility: l }) : ne({ id: p, visibility: l });
}
function ee(i, l) {
  return Array.isArray(i) ? i.map((p) => l(p)) : [];
}
function z(i, l, p) {
  return l.includes(i) ? i : p;
}
function Y() {
  var i;
  return foundry.utils.randomID ? foundry.utils.randomID() : ((i = crypto.randomUUID) == null ? void 0 : i.call(crypto)) ?? Math.random().toString(36).slice(2, 12);
}
function Oe(i) {
  return i === "supports" ? "green" : i === "contradicts" ? "red" : i === "location" ? "amber" : i === "timeline" ? "violet" : i === "identity" ? "orange" : "cyan";
}
function se(i, l, p) {
  return Math.min(p, Math.max(l, i));
}
function Fe(i) {
  const {
    LegacyApplication: l,
    moduleId: p,
    moduleTitle: b,
    CSIBoardItemEditor: m,
    getCase: w,
    prepareBoardData: M,
    openCaseManager: T,
    canUserEditBoard: v,
    publishSharedLayout: E,
    requestLayoutPublish: U,
    deleteBoardItem: j,
    saveCase: X,
    defaultBoardPosition: Q,
    getRectEdgeAnchor: g,
    isFinitePoint: C,
    clearBoardApp: y
  } = i;
  return class extends l {
    constructor(e, a = {}) {
      super(a);
      x(this, "caseId");
      x(this, "playerMode");
      x(this, "_drag");
      x(this, "_pan");
      x(this, "_localLayout");
      x(this, "_layoutDraft");
      x(this, "_pendingConnection");
      x(this, "_contextBoardPosition");
      x(this, "_boundContextClose");
      x(this, "_dimmedKinds");
      x(this, "_saveTimer");
      x(this, "_boundDragMove");
      x(this, "_boundDragEnd");
      x(this, "_boundPanMove");
      x(this, "_boundPanEnd");
      this.caseId = e, this.playerMode = !!a.playerMode, this._drag = null, this._pan = null, this._localLayout = null, this._layoutDraft = null, this._pendingConnection = null, this._contextBoardPosition = null, this._boundContextClose = null, this._dimmedKinds = /* @__PURE__ */ new Set(), this._saveTimer = null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: "CSI Toolkit Case Board",
        template: `modules/${p}/templates/case-board.hbs`,
        classes: ["csi-toolkit", "csi-case-board-window"],
        width: 1220,
        height: 840,
        resizable: !0
      });
    }
    get id() {
      return `csi-case-board-${this.caseId}-${this.playerMode ? "player" : "gm"}`;
    }
    get title() {
      const e = w(this.caseId), a = this.playerMode ? "Player Board" : "GM Board";
      return e ? `${e.title} - ${a}` : `CSI Toolkit - ${a}`;
    }
    async getData() {
      return M(this.caseId, { playerMode: this.playerMode, layoutOverride: this._localLayout });
    }
    activateListeners(e) {
      super.activateListeners(e), e.find("[data-action='open-manager']").on("click", () => T()), e.find("[data-action='refresh-board']").on("click", () => this._reloadSharedBoard()), e.find("[data-action='publish-layout']").on("click", () => this._publishLayout()), e.find("[data-action='zoom-in']").on("click", () => this._zoomBy(0.1)), e.find("[data-action='zoom-out']").on("click", () => this._zoomBy(-0.1)), e.find("[data-action='context-add-board-item']").on("click", (c) => this._addBoardItemFromContext(c)), e.find("[data-action='edit-card']").on("click", (c) => this._editCard(c.currentTarget.dataset.collection, c.currentTarget.dataset.itemId)), e.find("[data-action='delete-board-item']").on("click", (c) => this._deleteBoardItem(c.currentTarget.dataset.collection, c.currentTarget.dataset.itemId)), e.find("[data-action='move-timeline-item']").on("click", (c) => this._moveTimelineItem(c.currentTarget.dataset.itemId, c.currentTarget.dataset.direction)), e.find("[data-csi-connection-hit]").on("dblclick", (c) => this._editCard("connections", c.currentTarget.dataset.connectionId)), e.find("[data-action='start-connection']").on("click", (c) => this._startConnection(c)), e.find("[data-csi-dim-kind]").on("change", (c) => this._toggleDimKind(c.currentTarget)), e.find("[data-csi-card-art]").on("click", (c) => this._viewCardArt(c));
      const a = e[0].querySelector("[data-csi-board-viewport]");
      a && (a.addEventListener("wheel", (c) => this._onWheel(c), { passive: !1 }), a.addEventListener("mousedown", (c) => this._onViewportMouseDown(c)), a.addEventListener("contextmenu", (c) => this._openContextMenu(c))), e.find("[data-csi-board-card]").on("mousedown", (c) => this._onCardMouseDown(c)), e.find("[data-csi-board-card]").on("click", (c) => this._completeConnection(c)), e.find(".csi-card-image").on("load", () => this._queueConnectionLineUpdate()), this._syncDimControls(), this._applyDimmedKinds(), this._queueConnectionLineUpdate();
    }
    _onCardMouseDown(e) {
      if (!v(this.caseId) || e.button !== 0 || e.target.closest("button, [data-csi-card-art]")) return;
      const a = e.currentTarget, c = this._getView(), f = this._getLayout(), h = a.dataset.itemId, _ = f.cards[h] ?? { x: Number(a.dataset.x) || 0, y: Number(a.dataset.y) || 0 };
      e.preventDefault(), this._drag = {
        itemId: h,
        card: a,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startX: _.x,
        startY: _.y,
        scale: c.scale,
        x: _.x,
        y: _.y,
        frame: null,
        cards: this._getBoardCardMap(),
        connectionGroups: this._getConnectionGroupsForItem(h)
      }, document.addEventListener("mousemove", this._boundDragMove = (k) => this._onCardDrag(k)), document.addEventListener("mouseup", this._boundDragEnd = () => this._endDrag());
    }
    _onCardDrag(e) {
      if (!this._drag) return;
      const a = Math.round(this._drag.startX + (e.clientX - this._drag.startClientX) / this._drag.scale), c = Math.round(this._drag.startY + (e.clientY - this._drag.startClientY) / this._drag.scale);
      this._drag.x = a, this._drag.y = c, !this._drag.frame && (this._drag.frame = globalThis.requestAnimationFrame ? globalThis.requestAnimationFrame(() => this._flushCardDrag()) : globalThis.setTimeout(() => this._flushCardDrag(), 0));
    }
    _flushCardDrag() {
      this._drag && (this._drag.frame = null, this._applyCardDragPosition(this._drag.x, this._drag.y), this._updateConnectionLines(this._drag.connectionGroups, this._drag.cards));
    }
    _applyCardDragPosition(e, a) {
      this._drag && (this._drag.card.style.left = `${e}px`, this._drag.card.style.top = `${a}px`, this._drag.card.dataset.x = e, this._drag.card.dataset.y = a);
    }
    _endDrag() {
      var a;
      if (!this._drag) return;
      document.removeEventListener("mousemove", this._boundDragMove), document.removeEventListener("mouseup", this._boundDragEnd), this._drag.frame && (globalThis.cancelAnimationFrame ? globalThis.cancelAnimationFrame(this._drag.frame) : (a = globalThis.clearTimeout) == null || a.call(globalThis, this._drag.frame), this._drag.frame = null), this._applyCardDragPosition(this._drag.x, this._drag.y), this._updateConnectionLines(this._drag.connectionGroups, this._drag.cards);
      const e = this._getLayout();
      e.cards[this._drag.itemId] = {
        ...e.cards[this._drag.itemId] ?? {},
        x: Number(this._drag.card.dataset.x),
        y: Number(this._drag.card.dataset.y)
      }, this._drag = null, this._saveLayout(e);
    }
    _onViewportMouseDown(e) {
      if (e.button !== 0 || e.target.closest("[data-csi-board-card], [data-csi-context-menu], [data-csi-connection-hit], button")) return;
      this._hideContextMenu();
      const a = this._getView();
      e.preventDefault(), this._pan = {
        startClientX: e.clientX,
        startClientY: e.clientY,
        startX: a.x,
        startY: a.y
      }, document.addEventListener("mousemove", this._boundPanMove = (c) => this._onPan(c)), document.addEventListener("mouseup", this._boundPanEnd = () => this._endPan());
    }
    _onPan(e) {
      if (!this._pan) return;
      const a = this._getLayout();
      a.view.x = Math.round(this._pan.startX + e.clientX - this._pan.startClientX), a.view.y = Math.round(this._pan.startY + e.clientY - this._pan.startClientY), this._layoutDraft = a, this._applyView(a.view);
    }
    _endPan() {
      if (!this._pan) return;
      document.removeEventListener("mousemove", this._boundPanMove), document.removeEventListener("mouseup", this._boundPanEnd);
      const e = this._layoutDraft ?? this._getLayout();
      this._pan = null, this._saveLayout(e), this._layoutDraft = null;
    }
    _onWheel(e) {
      e.preventDefault(), this._hideContextMenu(), this._zoomBy(e.deltaY > 0 ? -0.08 : 0.08);
    }
    _zoomBy(e) {
      const a = this._getLayout();
      a.view.scale = se(Number(a.view.scale) + e, 0.45, 1.8), this._applyView(a.view), this._saveLayout(a);
    }
    _applyView(e) {
      var f, h;
      const a = (f = this.element[0]) == null ? void 0 : f.querySelector("[data-csi-board-canvas]");
      if (!a) return;
      a.style.transform = `translate(${e.x}px, ${e.y}px) scale(${e.scale})`;
      const c = (h = this.element[0]) == null ? void 0 : h.querySelector("[data-csi-zoom]");
      c && (c.textContent = `${Math.round(e.scale * 100)}%`);
    }
    _getView() {
      return this._getLayout().view;
    }
    _getLayout() {
      const e = w(this.caseId);
      return K(this._layoutDraft ?? this._localLayout ?? (e == null ? void 0 : e.boardLayout));
    }
    async _saveLayout(e) {
      this._localLayout = K(e);
    }
    async _publishLayout() {
      var a;
      if (!v(this.caseId)) return;
      const e = this._getLayout();
      if ((a = game.user) != null && a.isGM) {
        await E(this.caseId, e);
        return;
      }
      await U(this.caseId, e);
    }
    _reloadSharedBoard() {
      this._localLayout = null, this._layoutDraft = null, this.render(!0);
    }
    _getBoardCardMap() {
      const e = this.element[0];
      return e ? new Map(Array.from(e.querySelectorAll("[data-csi-board-card]")).map((a) => [a.dataset.itemId, a])) : /* @__PURE__ */ new Map();
    }
    _getConnectionGroupsForItem(e) {
      const a = this.element[0];
      return !a || !e ? [] : Array.from(a.querySelectorAll("[data-csi-connection-group]")).filter((c) => c.dataset.fromId === e || c.dataset.toId === e);
    }
    _updateConnectionLines(e = null, a = null) {
      const c = this.element[0];
      if (!c) return;
      const f = a ?? this._getBoardCardMap(), h = e ?? Array.from(c.querySelectorAll("[data-csi-connection-group]"));
      for (const _ of h) {
        const k = f.get(_.dataset.fromId), B = f.get(_.dataset.toId);
        if (!k || !B) continue;
        const O = this._getCardBoardRect(k), V = this._getCardBoardRect(B), R = g(O, V), H = g(V, O);
        if (!C(R) || !C(H)) continue;
        for (const W of _.querySelectorAll("[data-csi-connection-line], [data-csi-connection-hit]"))
          W.setAttribute("x1", R.x), W.setAttribute("y1", R.y), W.setAttribute("x2", H.x), W.setAttribute("y2", H.y);
        const J = _.querySelector("[data-csi-connection-label]");
        J && (J.setAttribute("x", Math.round((R.x + H.x) / 2)), J.setAttribute("y", Math.round((R.y + H.y) / 2 - 10)));
      }
    }
    _queueConnectionLineUpdate() {
      const e = () => this._updateConnectionLines();
      globalThis.requestAnimationFrame ? globalThis.requestAnimationFrame(e) : globalThis.setTimeout(e, 0);
    }
    _getCardBoardRect(e) {
      const a = Number(e.dataset.x) || Number.parseFloat(e.style.left) || 0, c = Number(e.dataset.y) || Number.parseFloat(e.style.top) || 0, f = e.offsetWidth || 220, h = e.offsetHeight || 246;
      return {
        x: a,
        y: c,
        width: f,
        height: h,
        centerX: a + f / 2,
        centerY: c + h / 2
      };
    }
    _editCard(e, a) {
      v(this.caseId) && new m(this.caseId, e, a).render(!0);
    }
    _viewCardArt(e) {
      var B, O, V, R;
      e.preventDefault(), e.stopPropagation();
      const a = (O = (B = e.currentTarget) == null ? void 0 : B.dataset) == null ? void 0 : O.imageSrc;
      if (!a) return;
      const c = e.currentTarget.closest("[data-csi-board-card]"), f = ((R = (V = c == null ? void 0 : c.querySelector(".csi-card-body h3")) == null ? void 0 : V.textContent) == null ? void 0 : R.trim()) || "CSI Card Art", h = this.getImagePopoutClass();
      if (h) {
        new h(a, { title: f }).render(!0);
        return;
      }
      const _ = this.getDialogClass();
      if (!_) return;
      const k = String(a).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
      new _({
        title: f,
        content: `<img class="csi-image-dialog" src="${k}" alt="" />`,
        buttons: {
          close: { label: "Close" }
        }
      }, { classes: ["csi-toolkit"], width: 720 }).render(!0);
    }
    _getFoundryGlobal() {
      return globalThis.foundry ?? foundry;
    }
    getImagePopoutClass() {
      var a, c, f, h, _, k;
      const e = this._getFoundryGlobal();
      return (typeof ImagePopout < "u" ? ImagePopout : null) ?? globalThis.ImagePopout ?? ((c = (a = e == null ? void 0 : e.applications) == null ? void 0 : a.apps) == null ? void 0 : c.ImagePopout) ?? ((h = (f = e == null ? void 0 : e.applications) == null ? void 0 : f.api) == null ? void 0 : h.ImagePopout) ?? ((k = (_ = e == null ? void 0 : e.appv1) == null ? void 0 : _.api) == null ? void 0 : k.ImagePopout);
    }
    getDialogClass() {
      var a, c, f, h, _, k;
      const e = this._getFoundryGlobal();
      return (typeof Dialog < "u" ? Dialog : null) ?? globalThis.Dialog ?? ((c = (a = e == null ? void 0 : e.applications) == null ? void 0 : a.apps) == null ? void 0 : c.Dialog) ?? ((h = (f = e == null ? void 0 : e.applications) == null ? void 0 : f.api) == null ? void 0 : h.Dialog) ?? ((k = (_ = e == null ? void 0 : e.appv1) == null ? void 0 : _.api) == null ? void 0 : k.Dialog);
    }
    async _deleteBoardItem(e, a) {
      !v(this.caseId) || !xe.includes(e) || !a || await j(this.caseId, e, a);
    }
    async _moveTimelineItem(e, a) {
      var B;
      if (!v(this.caseId) || !e) return;
      const c = w(this.caseId), f = ((B = c == null ? void 0 : c.timeline) == null ? void 0 : B.findIndex((O) => O.id === e)) ?? -1, _ = f + (a === "up" ? -1 : a === "down" ? 1 : 0);
      if (!c || f < 0 || _ < 0 || _ >= c.timeline.length) return;
      const [k] = c.timeline.splice(f, 1);
      c.timeline.splice(_, 0, k), await X(c);
    }
    _toggleDimKind(e) {
      const a = e == null ? void 0 : e.value;
      ["evidence", "suspects", "locations", "timeline"].includes(a) && (e.checked ? this._dimmedKinds.add(a) : this._dimmedKinds.delete(a), this._applyDimmedKinds());
    }
    _syncDimControls() {
      var e;
      for (const a of ((e = this.element[0]) == null ? void 0 : e.querySelectorAll("[data-csi-dim-kind]")) ?? [])
        a.checked = this._dimmedKinds.has(a.value);
    }
    _applyDimmedKinds() {
      const e = this.element[0];
      if (e) {
        for (const a of e.querySelectorAll("[data-csi-board-card]"))
          a.classList.toggle("is-type-dimmed", this._dimmedKinds.has(a.dataset.collection));
        for (const a of e.querySelectorAll("[data-csi-timeline-row]"))
          a.classList.toggle("is-type-dimmed", this._dimmedKinds.has(a.dataset.collection));
      }
    }
    _addBoardItemFromContext(e) {
      e.preventDefault(), e.stopPropagation();
      const a = e.currentTarget.dataset.collection;
      this._addBoardItem(a, this._contextBoardPosition), this._hideContextMenu();
    }
    _addBoardItem(e = "evidence", a = null) {
      v(this.caseId) && ke.includes(e) && new m(this.caseId, e, null, { boardPosition: a }).render(!0);
    }
    _openContextMenu(e) {
      var B, O;
      if (!v(this.caseId) || e.target.closest("[data-csi-board-card], button, input, select, textarea")) return;
      const a = (B = this.element[0]) == null ? void 0 : B.querySelector("[data-csi-context-menu]"), c = (O = this.element[0]) == null ? void 0 : O.querySelector("[data-csi-board-viewport]");
      if (!a || !c) return;
      e.preventDefault(), e.stopPropagation(), this._contextBoardPosition = this._clientToBoardPosition(e.clientX, e.clientY), a.hidden = !1;
      const f = a.offsetWidth || 156, h = a.offsetHeight || 180, _ = Math.max(4, globalThis.innerWidth - f - 4), k = Math.max(4, globalThis.innerHeight - h - 4);
      a.style.left = `${se(e.clientX, 4, _)}px`, a.style.top = `${se(e.clientY, 4, k)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu() {
      var a;
      const e = (a = this.element[0]) == null ? void 0 : a.querySelector("[data-csi-context-menu]");
      e && (e.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    _clientToBoardPosition(e, a) {
      var _;
      const c = (_ = this.element[0]) == null ? void 0 : _.querySelector("[data-csi-board-viewport]"), f = c == null ? void 0 : c.getBoundingClientRect(), h = this._getView();
      return f ? {
        x: Math.round((e - f.left - h.x) / h.scale - 220 / 2),
        y: Math.round((a - f.top - h.y) / h.scale - 32)
      } : null;
    }
    _startConnection(e) {
      var f;
      if (e.preventDefault(), e.stopPropagation(), !v(this.caseId)) return;
      const c = e.currentTarget.dataset.itemId;
      if (c) {
        this._pendingConnection = { fromId: c };
        for (const h of this.element[0].querySelectorAll("[data-csi-board-card]")) h.classList.toggle("is-link-source", h.dataset.itemId === c);
        (f = ui.notifications) == null || f.info(`${b}: Select another card to create a connection.`);
      }
    }
    async _completeConnection(e) {
      if (!this._pendingConnection || e.target.closest("button, input, select, textarea, [data-csi-card-art]") || !v(this.caseId)) return;
      const a = e.currentTarget.dataset.itemId, c = this._pendingConnection.fromId;
      this._pendingConnection = null;
      for (const _ of this.element[0].querySelectorAll("[data-csi-board-card]")) _.classList.remove("is-link-source");
      if (!a || a === c) return;
      const f = w(this.caseId);
      if (!f) return;
      const h = ne({
        id: Y(),
        fromId: c,
        toId: a,
        label: "linked to",
        type: "link",
        style: "solid",
        color: "cyan",
        visibility: "players"
      });
      f.connections.push(h), await X(f), new m(this.caseId, "connections", h.id).render(!0);
    }
    async close(e = {}) {
      return this._hideContextMenu(), y(this), super.close(e);
    }
  };
}
function He(i) {
  const {
    LegacyApplication: l,
    moduleId: p,
    moduleTitle: b,
    singularLabel: m,
    getItemTitle: w,
    getCase: M,
    buildItemChoices: T,
    parseItemElement: v,
    saveCase: E,
    deleteBoardItem: U,
    defaultBoardPosition: j
  } = i;
  return class extends l {
    constructor(g, C, y, S = {}) {
      super(S);
      x(this, "caseId");
      x(this, "collection");
      x(this, "itemId");
      x(this, "isNew");
      x(this, "boardPosition");
      this.caseId = g, this.collection = C, this.itemId = y || Y(), this.isNew = !y, this.boardPosition = S.boardPosition ? {
        x: Number(S.boardPosition.x) || 0,
        y: Number(S.boardPosition.y) || 0
      } : null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: "Edit CSI Board Card",
        template: `modules/${p}/templates/board-item-editor.hbs`,
        classes: ["csi-toolkit", "csi-board-item-editor"],
        width: 560,
        height: 520,
        resizable: !0
      });
    }
    get title() {
      const g = this._getItem();
      return this.isNew ? `Add ${m(this.collection)}` : g ? `Edit ${w(g, this.collection)}` : "Edit CSI Board Card";
    }
    async getData() {
      var y;
      const g = M(this.caseId), C = this._getItem();
      return {
        caseId: this.caseId,
        collection: this.collection,
        item: C,
        isNew: this.isNew,
        itemChoices: g ? T(g, !((y = game.user) != null && y.isGM)) : [],
        isEvidence: this.collection === "evidence",
        isSuspect: this.collection === "suspects",
        isLocation: this.collection === "locations",
        isTimeline: this.collection === "timeline",
        isConnection: this.collection === "connections",
        options: {
          evidenceTypes: ce,
          evidenceStatuses: le,
          suspectStatuses: de,
          connectionTypes: ue,
          connectionStyles: me,
          connectionColors: fe
        }
      };
    }
    activateListeners(g) {
      var S, P;
      super.activateListeners(g);
      const C = g[0], y = (S = C == null ? void 0 : C.matches) != null && S.call(C, "[data-csi-board-item-form]") ? C : (P = C == null ? void 0 : C.querySelector) == null ? void 0 : P.call(C, "[data-csi-board-item-form]");
      y && y.addEventListener("submit", (e) => this._save(e)), g.find("[data-action='pick-image']").on("click", (e) => this._pickImage(e.currentTarget)), g.find("[data-action='delete-board-item']").on("click", (e) => this._delete(e));
    }
    _getItem() {
      var y;
      const g = M(this.caseId), C = (y = g == null ? void 0 : g[this.collection]) == null ? void 0 : y.find((S) => S.id === this.itemId);
      return C || (this.isNew ? Ne(this.collection, "players", this.itemId) : null);
    }
    async _save(g) {
      var e, a, c;
      g.preventDefault(), g.stopPropagation(), (e = g.stopImmediatePropagation) == null || e.call(g);
      const C = g.currentTarget, y = M(this.caseId);
      if (!y)
        return (a = ui.notifications) == null || a.warn(`${b}: The case could not be found.`), !1;
      const S = y[this.collection].findIndex((f) => f.id === this.itemId);
      if (S < 0 && !this.isNew)
        return (c = ui.notifications) == null || c.warn(`${b}: The item could not be found.`), !1;
      const P = v(this.collection, C);
      return P.id = this.itemId, P.visibility = "players", P.hidden = S >= 0 ? !!y[this.collection][S].hidden : !1, S >= 0 ? y[this.collection][S] = P : y[this.collection].push(P), this.isNew && this.collection !== "connections" && (y.boardLayout.cards[this.itemId] = this.boardPosition ?? j(y.evidence.length + y.suspects.length + y.locations.length + y.timeline.length)), await E(y), this.close(), !1;
    }
    async _delete(g) {
      var y;
      return g.preventDefault(), g.stopPropagation(), (y = g.stopImmediatePropagation) == null || y.call(g), this.isNew || await U(this.caseId, this.collection, this.itemId, { confirm: !0 }) && this.close(), !1;
    }
    _pickImage(g) {
      var P, e, a, c, f, h, _, k, B, O, V, R, H;
      const C = (P = g.closest(".csi-image-field")) == null ? void 0 : P.querySelector("input");
      if (!C) return;
      const y = (typeof FilePicker < "u" ? FilePicker : null) ?? globalThis.FilePicker ?? ((c = (a = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : a.apps) == null ? void 0 : c.FilePicker) ?? ((_ = (h = (f = globalThis.foundry) == null ? void 0 : f.applications) == null ? void 0 : h.api) == null ? void 0 : _.FilePicker) ?? ((O = (B = (k = globalThis.foundry) == null ? void 0 : k.appv1) == null ? void 0 : B.api) == null ? void 0 : O.FilePicker);
      if (!y) {
        (R = (V = ui.notifications) == null ? void 0 : V.warn) == null || R.call(V, `${b}: Foundry FilePicker is unavailable.`);
        return;
      }
      const S = new y({
        type: "image",
        current: C.value,
        callback: (J) => {
          C.value = J, C.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      });
      typeof S.browse == "function" ? S.browse() : (H = S.render) == null || H.call(S, !0);
    }
  };
}
const N = "csi-toolkit", I = "CSI Toolkit", ie = `module.${N}`, qe = [
  `modules/${N}/templates/case-manager.hbs`,
  `modules/${N}/templates/case-browser.hbs`,
  `modules/${N}/templates/case-board.hbs`,
  `modules/${N}/templates/item-card.hbs`,
  `modules/${N}/templates/board-item-editor.hbs`
];
function ze() {
  game.settings.register(N, "cases", {
    name: "CSI Toolkit Cases",
    hint: "Stores all investigation cases for this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  });
}
function re(i) {
  return String(i || "").replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
function Ye(i) {
  return String(i || "case").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "case";
}
function ve(i) {
  const l = document.createElement("div");
  return l.textContent = String(i ?? ""), l.innerHTML;
}
function Re() {
  Handlebars.registerHelper("csiEq", (i, l) => i === l), Handlebars.registerHelper("csiLabel", (i) => re(i)), Handlebars.registerHelper("csiCount", (i) => Array.isArray(i) ? i.length : 0), Handlebars.registerHelper("csiFallback", (i, l) => i || l), Handlebars.registerHelper("csiJoin", (i) => Array.isArray(i) ? i.join(", ") : ""), Handlebars.registerHelper("csiOption", (i, l) => i === l ? "selected" : ""), Handlebars.registerHelper("csiChecked", (i) => i === "players" ? "checked" : "");
}
function Ue() {
  var i, l, p;
  return ((l = (i = globalThis.foundry) == null ? void 0 : i.applications) == null ? void 0 : l.api) ?? ((p = foundry == null ? void 0 : foundry.applications) == null ? void 0 : p.api) ?? null;
}
function Ve() {
  var i, l, p;
  return ((l = (i = globalThis.foundry) == null ? void 0 : i.appv1) == null ? void 0 : l.api) ?? ((p = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : p.api) ?? null;
}
function je(i = {}, l = {}) {
  var b, m, w;
  const p = ((m = (b = globalThis.foundry) == null ? void 0 : b.utils) == null ? void 0 : m.mergeObject) ?? ((w = foundry == null ? void 0 : foundry.utils) == null ? void 0 : w.mergeObject);
  return typeof p == "function" ? p(i, l, { inplace: !1 }) : { ...i, ...l };
}
function Ge() {
  var i, l, p, b, m;
  return ((p = (l = (i = globalThis.foundry) == null ? void 0 : i.utils) == null ? void 0 : l.randomID) == null ? void 0 : p.call(l, 8)) ?? ((m = (b = foundry == null ? void 0 : foundry.utils) == null ? void 0 : b.randomID) == null ? void 0 : m.call(b, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function Se(i = {}) {
  return {
    id: String(i.id ?? `legacy-application-${Ge()}`),
    tag: i.tag ?? "section",
    classes: Array.isArray(i.classes) ? i.classes : [],
    window: {
      title: i.title ?? "",
      icon: i.icon,
      resizable: i.resizable === !0
    },
    position: {
      width: Number(i.width ?? 600),
      height: i.height === "auto" ? "auto" : Number(i.height ?? 600)
    }
  };
}
function Xe(i) {
  return class extends i {
    constructor(b = {}) {
      const m = je(new.target.defaultOptions ?? {}, b);
      super(Se(m));
      x(this, "_v1Options");
      this._v1Options = m;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return Se(this.defaultOptions ?? {});
    }
    activateListeners(b) {
    }
    async _renderHTML(b, m) {
      var E, U, j;
      const w = typeof this.getData == "function" ? await this.getData() : {}, M = ((E = this._v1Options) == null ? void 0 : E.template) ?? ((U = this.options) == null ? void 0 : U.template) ?? ((j = this.constructor.defaultOptions) == null ? void 0 : j.template);
      if (!M) return document.createDocumentFragment();
      const T = await globalThis.renderTemplate(M, w), v = document.createElement("template");
      return v.innerHTML = T.trim(), v.content;
    }
    _activateV1Form(b) {
      var w, M;
      if (typeof this._updateObject != "function") return;
      const m = (w = b.matches) != null && w.call(b, "form") ? b : (M = b.querySelector) == null ? void 0 : M.call(b, "form");
      m instanceof HTMLFormElement && m.addEventListener("submit", async (T) => {
        var E;
        T.preventDefault(), T.stopPropagation();
        const v = new FormData(m);
        await this._updateObject(T, v), ((E = this._v1Options) == null ? void 0 : E.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(b, m, w) {
      var U, j, X, Q;
      m.replaceChildren(b);
      const M = globalThis.jQuery ?? globalThis.$, T = ((U = m.closest) == null ? void 0 : U.call(m, ".window-app, .app, .application")) ?? m, v = M ? M(T) : T;
      try {
        Object.defineProperty(this, "element", {
          value: v,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = v;
        } catch {
        }
      }
      const E = (j = this._v1Options) == null ? void 0 : j.classes;
      Array.isArray(E) && E.length && (m.classList.add(...E), (Q = (X = m.closest) == null ? void 0 : X.call(m, ".window-app, .app, .application")) == null || Q.classList.add(...E)), this._activateV1Form(m), typeof this.activateListeners == "function" && this.activateListeners(M ? M(m) : m);
    }
  };
}
function We() {
  const i = Ue(), l = Ve(), p = globalThis.Application ?? (l == null ? void 0 : l.Application) ?? (i == null ? void 0 : i.ApplicationV1) ?? globalThis.FormApplication ?? (l == null ? void 0 : l.FormApplication) ?? (i == null ? void 0 : i.FormApplication);
  if (p) return p;
  const b = i == null ? void 0 : i.ApplicationV2;
  return b ? Xe(b) : null;
}
(() => {
  const i = We(), l = {
    manager: null,
    browser: null,
    boards: /* @__PURE__ */ new Map(),
    playerBoard: null
  };
  Hooks.once("init", async () => {
    ze(), Re(), await loadTemplates(qe), console.log(`${I} | Initialized`);
  }), Hooks.once("ready", () => {
    game.csiToolkit = p();
    const t = game.modules.get(N);
    t && (t.api = game.csiToolkit), b(), game.socket.on(ie, f), console.log(`${I} | API available at game.csiToolkit`);
  });
  function p() {
    return {
      openCaseBoard: (t, n = {}) => P(t, n),
      openCaseManager: () => y(),
      openCaseBrowser: () => S(),
      createCase: (t) => U(t),
      getCases: () => m(),
      exportCase: (t) => C(t),
      importCase: (t) => g(t)
    };
  }
  function b() {
    const t = game.modules.get("holosuite-core"), n = t != null && t.active ? t.api : null;
    return n != null && n.registerApp ? (n.registerApp({
      id: N,
      title: "CSI Toolkit",
      icon: "fa-solid fa-fingerprint",
      premium: !1,
      featureId: N,
      description: "Open case files, evidence boards, and investigation tools.",
      open: () => {
        var s;
        return (s = game.user) != null && s.isGM ? y() : S();
      }
    }), !0) : !1;
  }
  function m() {
    return Ce(game.settings.get(N, "cases") ?? {});
  }
  async function w(t) {
    return game.settings.set(N, "cases", t ?? {});
  }
  function M() {
    var n;
    return (((n = game.users) == null ? void 0 : n.contents) ?? Array.from(game.users ?? [])).some((s) => (s == null ? void 0 : s.isGM) && (s == null ? void 0 : s.active));
  }
  function T(t) {
    const n = m();
    return n[t] ? G(n[t]) : null;
  }
  async function v(t, { notify: n = !0, render: s = !0, updateReason: r = null, userName: o = null } = {}) {
    var L;
    const u = G(t);
    if (!((L = game.user) != null && L.isGM)) return E(u, { notify: n, render: s });
    const d = m();
    return d[u.id] = u, await w(d), n && c(u.id, { reason: r, userName: o }), s && te(u.id), u;
  }
  async function E(t, { render: n = !0, notify: s = !0 } = {}) {
    var r, o, u, d, L, A;
    return (r = game.socket) != null && r.emit ? M() ? (game.socket.emit(ie, {
      type: "save-case-request",
      caseData: t,
      userId: (d = game.user) == null ? void 0 : d.id,
      userName: (L = game.user) == null ? void 0 : L.name
    }), s && ((A = ui.notifications) == null || A.info(`${I}: Board update sent to the GM.`)), t) : ((u = ui.notifications) == null || u.warn(`${I}: No active GM is connected to save board changes.`), t) : ((o = ui.notifications) == null || o.warn(`${I}: A GM must be connected to save board changes.`), t);
  }
  async function U(t = {}) {
    var r;
    const n = G(t, { forceNewId: !t.id }), s = m();
    return s[n.id] = n, await w(s), c(n.id), (r = ui.notifications) == null || r.info(`${I}: Created case "${n.title}".`), n;
  }
  async function j(t) {
    var r;
    const n = m(), s = n[t];
    return s ? (delete n[t], await w(n), Me(t), c(t), (r = ui.notifications) == null || r.info(`${I}: Deleted case "${s.title}".`), !0) : !1;
  }
  async function X(t, n, s, { confirm: r = !0 } = {}) {
    var L, A;
    if (!xe.includes(n) || !s) return !1;
    const o = T(t);
    if (!o) return !1;
    const u = (L = o[n]) == null ? void 0 : L.find(($) => $.id === s);
    if (!u) return !1;
    const d = Ie(u, n);
    return r && !await we({
      title: `Delete ${re(oe(n))}`,
      content: `<p>Delete <strong>${ve(d)}</strong>?${n === "connections" ? "" : " Any attached connections will also be deleted."}</p>`,
      yes: () => !0,
      no: () => !1,
      defaultYes: !1
    }) ? !1 : (o[n] = o[n].filter(($) => $.id !== s), n !== "connections" && (o.connections = o.connections.filter(($) => $.fromId !== s && $.toId !== s), o.timeline = o.timeline.map(($) => ({
      ...$,
      linkedItemIds: ($.linkedItemIds ?? []).filter((D) => D !== s)
    })), delete o.boardLayout.cards[s]), await v(o), (A = ui.notifications) == null || A.info(`${I}: Deleted "${d}".`), !0);
  }
  async function Q(t) {
    var o;
    const n = T(t);
    if (!n) return null;
    const s = G({
      ...n,
      id: Y(),
      title: `${n.title} Copy`
    }), r = m();
    return r[s.id] = s, await w(r), c(s.id), (o = ui.notifications) == null || o.info(`${I}: Duplicated case "${n.title}".`), s;
  }
  async function g(t) {
    var r;
    const n = G({
      ...t,
      id: t.id || Y()
    }), s = m();
    return s[n.id] && (n.id = Y()), s[n.id] = n, await w(s), c(n.id), (r = ui.notifications) == null || r.info(`${I}: Imported case "${n.title}".`), n;
  }
  function C(t) {
    const n = T(t);
    if (!n) return !1;
    const s = new Blob([JSON.stringify(n, null, 2)], { type: "application/json" }), r = URL.createObjectURL(s), o = document.createElement("a");
    return o.href = r, o.download = `${Ye(n.title)}.json`, o.click(), URL.revokeObjectURL(r), !0;
  }
  function y() {
    var t;
    return (t = game.user) != null && t.isGM ? (l.manager || (l.manager = new B()), l.manager.render(!0), l.manager) : S();
  }
  function S() {
    return l.browser || (l.browser = new k()), l.browser.render(!0), l.browser;
  }
  function P(t, n = {}) {
    var L, A, $;
    if (!t)
      return (L = ui.notifications) == null || L.warn(`${I}: No case id provided.`), null;
    if (!T(t))
      return (A = ui.notifications) == null || A.warn(`${I}: Case "${t}" was not found.`), null;
    const r = n.playerMode ?? !(($ = game.user) != null && $.isGM), o = `${t}:${r ? "player" : "gm"}`, u = l.boards.get(o);
    if (u)
      return u.render(!0), u;
    const d = new _(t, { playerMode: r });
    return l.boards.set(o, d), d.render(!0), d;
  }
  async function e(t, n) {
    var r, o, u, d, L, A;
    const s = K(n);
    return (r = game.socket) != null && r.emit ? M() ? (game.socket.emit(ie, {
      type: "publish-layout-request",
      caseId: t,
      boardLayout: s,
      userId: (d = game.user) == null ? void 0 : d.id,
      userName: (L = game.user) == null ? void 0 : L.name
    }), (A = ui.notifications) == null || A.info(`${I}: Layout publish request sent to the GM.`), !0) : ((u = ui.notifications) == null || u.warn(`${I}: No active GM is connected to publish the board layout.`), !1) : ((o = ui.notifications) == null || o.warn(`${I}: A GM must be connected to publish the board layout.`), !1);
  }
  async function a(t, n, { userId: s = ((o) => (o = game.user) == null ? void 0 : o.id)(), userName: r = ((u) => (u = game.user) == null ? void 0 : u.name)() } = {}) {
    var $;
    const d = T(t);
    if (!d) return !1;
    const L = K(d.boardLayout), A = K(n);
    return d.boardLayout = K({
      ...L,
      cards: A.cards
    }), await v(d, {
      render: !1,
      updateReason: "layout-published",
      userName: r
    }), te(t, { resetLayout: !0 }), ($ = ui.notifications) == null || $.info(`${I}: Published shared board layout${r ? ` from ${r}` : ""}.`), !0;
  }
  function c(t, { reason: n = null, userName: s = null } = {}) {
    var r, o;
    (o = game.socket) == null || o.emit(ie, { type: "case-updated", caseId: t, reason: n, userName: s, userId: (r = game.user) == null ? void 0 : r.id });
  }
  function f(t) {
    var n, s, r, o;
    if (t) {
      if (t.type === "save-case-request") {
        if (!((n = game.user) != null && n.isGM) || !t.caseData) return;
        v(t.caseData, { render: !1 }).then((u) => {
          var d;
          u && (te(u.id), (d = ui.notifications) == null || d.info(`${I}: Saved player board update from ${t.userName ?? "a player"}.`));
        }).catch((u) => {
          var d;
          console.error(`${I} | Could not save player board update`, u), (d = ui.notifications) == null || d.error(`${I}: Player board update could not be saved.`);
        });
        return;
      }
      if (t.type === "publish-layout-request") {
        if (!((s = game.user) != null && s.isGM) || !t.caseId || !t.boardLayout) return;
        a(t.caseId, t.boardLayout, {
          userId: t.userId,
          userName: t.userName
        }).catch((u) => {
          var d;
          console.error(`${I} | Could not publish player layout`, u), (d = ui.notifications) == null || d.error(`${I}: Player layout could not be published.`);
        });
        return;
      }
      if (t.type === "case-updated" && t.caseId) {
        if (t.userId && t.userId === ((r = game.user) == null ? void 0 : r.id)) return;
        te(t.caseId, { resetLayout: t.reason === "layout-published" }), t.reason === "layout-published" && ((o = ui.notifications) == null || o.info(`${I}: ${t.userName ?? "Someone"} published a shared board layout.`));
        return;
      }
    }
  }
  const h = He({
    LegacyApplication: i,
    moduleId: N,
    moduleTitle: I,
    singularLabel: oe,
    getItemTitle: Ie,
    getCase: T,
    buildItemChoices: be,
    parseItemElement: V,
    saveCase: v,
    deleteBoardItem: X,
    defaultBoardPosition: ae
  }), _ = Fe({
    LegacyApplication: i,
    moduleId: N,
    moduleTitle: I,
    CSIBoardItemEditor: h,
    getCase: T,
    prepareBoardData: R,
    openCaseManager: y,
    canUserEditBoard: _e,
    publishSharedLayout: a,
    requestLayoutPublish: e,
    deleteBoardItem: X,
    saveCase: v,
    defaultBoardPosition: ae,
    getRectEdgeAnchor: Ae,
    isFinitePoint: Ee,
    clearBoardApp: (t) => {
      l.boards.delete(`${t.caseId}:${t.playerMode ? "player" : "gm"}`), l.playerBoard === t && (l.playerBoard = null);
    }
  });
  class k extends i {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "csi-case-browser",
        title: "CSI Toolkit Case Files",
        template: `modules/${N}/templates/case-browser.hbs`,
        classes: ["csi-toolkit", "csi-case-browser"],
        width: 520,
        height: 620,
        resizable: !0
      });
    }
    async getData() {
      var s;
      return {
        cases: Object.values(m()).map((r) => G(r)).sort((r, o) => r.title.localeCompare(o.title)),
        isGM: (s = game.user) == null ? void 0 : s.isGM,
        canContribute: De()
      };
    }
    activateListeners(n) {
      super.activateListeners(n), n.find("[data-action='open-board']").on("click", (s) => {
        var r;
        P(s.currentTarget.dataset.caseId, { playerMode: !((r = game.user) != null && r.isGM) });
      }), n.find("[data-action='open-manager']").on("click", () => y());
    }
    async close(n = {}) {
      return l.browser = null, super.close(n);
    }
  }
  class B extends i {
    constructor(n = {}) {
      super(n), this.selectedCaseId = n.caseId ?? null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "csi-case-manager",
        title: "CSI Toolkit Case Manager",
        template: `modules/${N}/templates/case-manager.hbs`,
        classes: ["csi-toolkit", "csi-case-manager"],
        width: 1180,
        height: 820,
        resizable: !0
      });
    }
    async getData() {
      var u;
      const n = m(), s = Object.values(n).map((d) => G(d)).sort((d, L) => d.title.localeCompare(L.title));
      !this.selectedCaseId && s.length && (this.selectedCaseId = s[0].id), this.selectedCaseId && !n[this.selectedCaseId] && (this.selectedCaseId = ((u = s[0]) == null ? void 0 : u.id) ?? null);
      const r = this.selectedCaseId ? G(n[this.selectedCaseId]) : null, o = r ? be(r) : [];
      return {
        cases: s,
        selected: r,
        itemChoices: o,
        options: {
          caseStatuses: Te,
          themes: Le,
          evidenceTypes: ce,
          evidenceStatuses: le,
          suspectStatuses: de,
          connectionTypes: ue,
          connectionStyles: me,
          connectionColors: fe
        }
      };
    }
    activateListeners(n) {
      super.activateListeners(n), n.find("[data-action='select-case']").on("click", (s) => {
        this.selectedCaseId = s.currentTarget.dataset.caseId, this.render(!1);
      }), n.find("[data-action='new-case']").on("click", () => this._createNewCase()), n.find("[data-csi-case-form]").on("submit", (s) => this._saveSelectedCase(s)), n.find("[data-action='save-case']").on("click", (s) => this._saveSelectedCase(s)), n.find("[data-action='delete-case']").on("click", () => this._deleteSelectedCase()), n.find("[data-action='duplicate-case']").on("click", () => this._duplicateSelectedCase()), n.find("[data-action='open-board']").on("click", () => P(this.selectedCaseId)), n.find("[data-action='pick-image']").on("click", (s) => this._pickImage(s.currentTarget)), n.find("[data-action='export-case']").on("click", () => C(this.selectedCaseId)), n.find("[data-action='import-case']").on("click", () => {
        var s;
        return (s = this.element[0].querySelector("[data-csi-import-file]")) == null ? void 0 : s.click();
      }), n.find("[data-csi-import-file]").on("change", (s) => this._importFromFile(s.currentTarget));
    }
    _readCurrentCase() {
      const n = this.element[0].querySelector("[data-csi-case-form]");
      return n ? O(n, this.selectedCaseId) : T(this.selectedCaseId);
    }
    async _createNewCase() {
      const n = await U({
        title: "New Investigation",
        subtitle: "Unfiled case",
        description: "Describe the incident, victim, premise, or central mystery.",
        visibility: "players"
      });
      this.selectedCaseId = n.id, this.render(!1);
    }
    async _saveSelectedCase(n) {
      var s, r;
      if (n.preventDefault(), !!this.selectedCaseId)
        try {
          const o = this._readCurrentCase();
          await v(o), this.selectedCaseId = o.id, (s = ui.notifications) == null || s.info(`${I}: Saved case "${o.title}".`), this.render(!1);
        } catch (o) {
          console.error(`${I} | Could not save case`, o), (r = ui.notifications) == null || r.error(`${I}: ${o.message}`);
        }
    }
    async _deleteSelectedCase() {
      if (!this.selectedCaseId) return;
      const n = T(this.selectedCaseId);
      !n || !await we({
        title: "Delete CSI Case",
        content: `<p>Delete <strong>${ve(n.title)}</strong>? This cannot be undone.</p>`,
        yes: () => !0,
        no: () => !1,
        defaultYes: !1
      }) || (await j(this.selectedCaseId), this.selectedCaseId = null, this.render(!1));
    }
    async _duplicateSelectedCase() {
      if (!this.selectedCaseId) return;
      const n = await Q(this.selectedCaseId);
      n && (this.selectedCaseId = n.id, this.render(!1));
    }
    _pickImage(n) {
      var u, d, L;
      const s = (u = n.closest(".csi-image-field")) == null ? void 0 : u.querySelector("input");
      if (!s) return;
      const r = $e();
      if (!r) {
        (d = ui.notifications) == null || d.warn(`${I}: Foundry FilePicker is unavailable.`);
        return;
      }
      const o = new r({
        type: "image",
        current: s.value,
        callback: (A) => {
          s.value = A, s.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      });
      typeof o.browse == "function" ? o.browse() : (L = o.render) == null || L.call(o, !0);
    }
    async _importFromFile(n) {
      var r, o;
      const s = (r = n.files) == null ? void 0 : r[0];
      if (s)
        try {
          const u = await s.text(), d = await g(JSON.parse(u));
          this.selectedCaseId = d.id, this.render(!1);
        } catch (u) {
          console.error(`${I} | Import failed`, u), (o = ui.notifications) == null || o.error(`${I}: Import failed. ${u.message}`);
        } finally {
          n.value = "";
        }
    }
    async close(n = {}) {
      return l.manager = null, super.close(n);
    }
  }
  function O(t, n) {
    const s = new FormData(t), r = T(n) ?? G({ id: n }), o = G({
      id: n,
      title: s.get("title"),
      subtitle: s.get("subtitle"),
      status: s.get("status"),
      description: s.get("description"),
      image: s.get("image"),
      visibility: "players",
      evidence: r.evidence,
      suspects: r.suspects,
      locations: r.locations,
      timeline: r.timeline,
      connections: r.connections,
      boardLayout: {
        ...r.boardLayout,
        theme: s.get("theme")
      }
    });
    return G(o);
  }
  function V(t, n) {
    const s = (u) => {
      var d;
      return ((d = n.querySelector(`[name="${u}"]`)) == null ? void 0 : d.value) ?? "";
    }, r = "players", o = { id: n.dataset.itemId || Y(), visibility: r };
    return t === "evidence" ? pe({
      ...o,
      title: s("title"),
      type: s("type"),
      status: s("status"),
      description: s("description"),
      image: s("image"),
      notes: s("notes")
    }) : t === "suspects" ? he({
      ...o,
      name: s("name"),
      alias: s("alias"),
      status: s("status"),
      motive: s("motive"),
      alibi: s("alibi"),
      image: s("image"),
      notes: s("notes")
    }) : t === "locations" ? ge({
      ...o,
      name: s("name"),
      sceneId: s("sceneId"),
      image: s("image"),
      description: s("description"),
      notes: s("notes")
    }) : t === "timeline" ? ye({
      ...o,
      time: s("time"),
      title: s("title"),
      description: s("description"),
      linkedItemIds: s("linkedItemIds").split(",").map((u) => u.trim()).filter(Boolean)
    }) : ne({
      id: o.id,
      visibility: r,
      fromId: s("fromId"),
      toId: s("toId"),
      label: s("label"),
      type: s("type"),
      style: s("style"),
      color: s("color")
    });
  }
  function R(t, { playerMode: n = !1, layoutOverride: s = null } = {}) {
    var A, $;
    const r = T(t);
    if (!r) return { isMissing: !0, playerMode: n, isGM: (A = game.user) == null ? void 0 : A.isGM };
    const o = Ce(r);
    s && (o.boardLayout = K(s)), o.evidence = H(o.evidence), o.suspects = H(o.suspects), o.locations = H(o.locations), o.timeline = H(o.timeline);
    const u = J(o), d = new Map(u.map((D) => [D.id, D]));
    o.timeline = o.timeline.map((D) => ({
      ...D,
      linkedLabels: (D.linkedItemIds ?? []).map((q) => {
        var F;
        return (F = d.get(q)) == null ? void 0 : F.label;
      }).filter(Boolean)
    }));
    const L = H(o.connections).map((D) => {
      const q = d.get(D.fromId), F = d.get(D.toId);
      return {
        ...D,
        fromLabel: (q == null ? void 0 : q.label) ?? D.fromId,
        toLabel: (F == null ? void 0 : F.label) ?? D.toId,
        x1: q ? q.x + 220 / 2 : 0,
        y1: q ? q.y + 94 : 0,
        x2: F ? F.x + 220 / 2 : 0,
        y2: F ? F.y + 94 : 0,
        labelX: q && F ? Math.round((q.x + F.x + 220) / 2) : 0,
        labelY: q && F ? Math.round((q.y + F.y) / 2 + 84) : 0,
        typeClass: `csi-connection--${D.type}`,
        styleClass: `csi-connection-line--${D.style}`,
        colorClass: `csi-connection-color--${D.color}`,
        hasVisibleEnds: !!(q && F)
      };
    }).filter((D) => D.hasVisibleEnds);
    return {
      case: o,
      cards: u,
      connections: L,
      boardSize: { width: 5200, height: 3600 },
      viewStyle: `transform: translate(${o.boardLayout.view.x}px, ${o.boardLayout.view.y}px) scale(${o.boardLayout.view.scale});`,
      zoomPercent: Math.round(o.boardLayout.view.scale * 100),
      themeClass: `csi-theme-${o.boardLayout.theme}`,
      playerMode: n,
      isGM: ($ = game.user) == null ? void 0 : $.isGM,
      canEditBoard: _e(r),
      addCollections: ke.map((D) => ({
        id: D,
        label: re(oe(D))
      })),
      counts: {
        evidence: o.evidence.length,
        suspects: o.suspects.length,
        locations: o.locations.length,
        timeline: o.timeline.length,
        connections: L.length
      }
    };
  }
  function H(t) {
    return Array.isArray(t) ? t : [];
  }
  function J(t) {
    const n = K(t.boardLayout), s = [];
    for (const r of t.evidence) s.push(W(r, "evidence", "Evidence", r.title, n, s.length));
    for (const r of t.suspects) s.push(W(r, "suspects", "Suspect", r.name, n, s.length));
    for (const r of t.locations) s.push(W(r, "locations", "Location", r.name, n, s.length));
    for (const r of t.timeline) s.push(W(r, "timeline", "Timeline", r.title, n, s.length));
    return s;
  }
  function W(t, n, s, r, o, u) {
    const d = o.cards[t.id] ?? ae(u);
    return {
      ...t,
      collection: n,
      kind: n === "suspects" ? "suspect" : n === "locations" ? "location" : n === "timeline" ? "timeline" : "evidence",
      kindLabel: s,
      label: r,
      x: Number(d.x) || 0,
      y: Number(d.y) || 0,
      layer: "public",
      style: `left: ${Number(d.x) || 0}px; top: ${Number(d.y) || 0}px;`
    };
  }
  function ae(t) {
    return {
      x: 80 + t % 5 * 300,
      y: 90 + Math.floor(t / 5) * 330
    };
  }
  function be(t) {
    const n = [];
    for (const s of t.evidence) n.push({ id: s.id, label: `Evidence: ${s.title}` });
    for (const s of t.suspects) n.push({ id: s.id, label: `Suspect: ${s.name}` });
    for (const s of t.locations) n.push({ id: s.id, label: `Location: ${s.name}` });
    for (const s of t.timeline) n.push({ id: s.id, label: `Timeline: ${s.title}` });
    return n;
  }
  function te(t, { resetLayout: n = !1 } = {}) {
    var s;
    (s = l.manager) != null && s.rendered && l.manager.render(!0);
    for (const [r, o] of l.boards.entries())
      n && r.startsWith(`${t}:`) && (o._localLayout = null), r.startsWith(`${t}:`) && o.rendered && o.render(!0);
  }
  function _e(t) {
    return !!(typeof t == "string" ? T(t) : t);
  }
  function De() {
    return !0;
  }
  function Me(t) {
    for (const [n, s] of l.boards.entries())
      n.startsWith(`${t}:`) && s.close();
  }
  function Ce(t) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(t) : JSON.parse(JSON.stringify(t));
  }
  function $e() {
    var n, s, r, o, u, d;
    const t = globalThis.foundry ?? foundry;
    return (typeof FilePicker < "u" ? FilePicker : null) ?? globalThis.FilePicker ?? ((s = (n = t == null ? void 0 : t.applications) == null ? void 0 : n.apps) == null ? void 0 : s.FilePicker) ?? ((o = (r = t == null ? void 0 : t.applications) == null ? void 0 : r.api) == null ? void 0 : o.FilePicker) ?? ((d = (u = t == null ? void 0 : t.appv1) == null ? void 0 : u.api) == null ? void 0 : d.FilePicker);
  }
  function oe(t) {
    return t === "suspects" ? "suspect" : t === "locations" ? "location" : t === "timeline" ? "timeline item" : t === "connections" ? "connection" : "evidence";
  }
  function Ie(t, n) {
    return n === "connections" ? t.label || `${t.fromId} -> ${t.toId}` : n === "suspects" || n === "locations" ? t.name : t.title;
  }
  function Ae(t, n) {
    const s = n.centerX - t.centerX, r = n.centerY - t.centerY;
    if (!s && !r) return { x: Math.round(t.centerX), y: Math.round(t.centerY) };
    const o = s === 0 ? Number.POSITIVE_INFINITY : Math.abs(t.width / 2 / s), u = r === 0 ? Number.POSITIVE_INFINITY : Math.abs(t.height / 2 / r), d = Math.min(o, u);
    return !Number.isFinite(d) || d <= 0 ? { x: Math.round(t.centerX), y: Math.round(t.centerY) } : {
      x: Math.round(t.centerX + s * d),
      y: Math.round(t.centerY + r * d)
    };
  }
  function Ee(t) {
    return Number.isFinite(t == null ? void 0 : t.x) && Number.isFinite(t == null ? void 0 : t.y);
  }
  function we(t) {
    var s, r, o, u, d;
    const n = globalThis.Dialog ?? ((o = (r = (s = globalThis.foundry) == null ? void 0 : s.appv1) == null ? void 0 : r.api) == null ? void 0 : o.Dialog);
    return n != null && n.confirm ? n.confirm(t) : Promise.resolve((d = globalThis.confirm) == null ? void 0 : d.call(globalThis, ((u = t.content) == null ? void 0 : u.replace(/<[^>]+>/g, "")) ?? t.title));
  }
})();
