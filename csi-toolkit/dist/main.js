var Ee = Object.defineProperty;
var Be = (e, l, f) => l in e ? Ee(e, l, { enumerable: !0, configurable: !0, writable: !0, value: f }) : e[l] = f;
var x = (e, l, f) => Be(e, typeof l != "symbol" ? l + "" : l, f);
const Te = ["open", "cold", "solved", "classified"], Z = ["gm", "players"], Le = ["database", "noir"], ce = ["physical", "digital", "biological", "weapon", "document", "testimony", "other"], le = ["unknown", "relevant", "red_herring", "confirmed"], de = ["unknown", "cleared", "person_of_interest", "prime_suspect", "arrested", "dead"], ue = ["link", "supports", "contradicts", "location", "timeline", "identity"], me = ["solid", "dashed", "dotted"], fe = ["cyan", "green", "red", "amber", "violet", "orange", "white"], xe = ["evidence", "suspects", "locations", "timeline", "connections"], De = ["evidence", "suspects", "locations", "timeline", "connections"];
function V(e = {}, { forceNewId: l = !1 } = {}) {
  return {
    id: l ? F() : e.id || F(),
    title: String(e.title || "Untitled Case"),
    subtitle: String(e.subtitle || ""),
    status: H(e.status, Te, "open"),
    description: String(e.description || ""),
    image: String(e.image || ""),
    visibility: H(e.visibility, Z, "players"),
    evidence: ee(e.evidence, he),
    suspects: ee(e.suspects, pe),
    locations: ee(e.locations, ge),
    timeline: ee(e.timeline, ye),
    connections: ee(e.connections, ne),
    boardLayout: W(e.boardLayout)
  };
}
function he(e = {}) {
  return {
    id: e.id || F(),
    title: String(e.title || "Untitled Evidence"),
    type: H(e.type, ce, "other"),
    description: String(e.description || ""),
    image: String(e.image || ""),
    status: H(e.status, le, "unknown"),
    visibility: H(e.visibility, Z, "players"),
    hidden: !!e.hidden,
    notes: String(e.notes || "")
  };
}
function pe(e = {}) {
  return {
    id: e.id || F(),
    name: String(e.name || "Unknown Suspect"),
    alias: String(e.alias || ""),
    image: String(e.image || ""),
    motive: String(e.motive || ""),
    alibi: String(e.alibi || ""),
    status: H(e.status, de, "unknown"),
    visibility: H(e.visibility, Z, "players"),
    hidden: !!e.hidden,
    notes: String(e.notes || "")
  };
}
function ge(e = {}) {
  return {
    id: e.id || F(),
    name: String(e.name || "Unknown Location"),
    sceneId: String(e.sceneId || ""),
    image: String(e.image || ""),
    description: String(e.description || ""),
    visibility: H(e.visibility, Z, "players"),
    hidden: !!e.hidden,
    notes: String(e.notes || "")
  };
}
function ye(e = {}) {
  return {
    id: e.id || F(),
    time: String(e.time || ""),
    title: String(e.title || "Timeline Event"),
    description: String(e.description || ""),
    linkedItemIds: Array.isArray(e.linkedItemIds) ? e.linkedItemIds.map(String) : [],
    visibility: H(e.visibility, Z, "players"),
    hidden: !!e.hidden
  };
}
function ne(e = {}) {
  return {
    id: e.id || F(),
    fromId: String(e.fromId || ""),
    toId: String(e.toId || ""),
    label: String(e.label || ""),
    type: H(e.type, ue, "link"),
    style: H(e.style, me, "solid"),
    color: H(e.color, fe, Oe(e.type)),
    visibility: H(e.visibility, Z, "players")
  };
}
function W(e = {}) {
  var l, f, g;
  return {
    theme: H(e.theme, Le, "database"),
    view: {
      x: Number((l = e.view) == null ? void 0 : l.x) || 0,
      y: Number((f = e.view) == null ? void 0 : f.y) || 0,
      scale: se(Number((g = e.view) == null ? void 0 : g.scale) || 1, 0.45, 1.8)
    },
    cards: Object.fromEntries(Object.entries(e.cards ?? {}).map(([m, I]) => [m, {
      x: Number(I == null ? void 0 : I.x) || 0,
      y: Number(I == null ? void 0 : I.y) || 0
    }]))
  };
}
function Ne(e, l = "players", f = F()) {
  return e === "evidence" ? he({ id: f, visibility: l }) : e === "suspects" ? pe({ id: f, visibility: l }) : e === "locations" ? ge({ id: f, visibility: l }) : e === "timeline" ? ye({ id: f, visibility: l }) : ne({ id: f, visibility: l });
}
function ee(e, l) {
  return Array.isArray(e) ? e.map((f) => l(f)) : [];
}
function H(e, l, f) {
  return l.includes(e) ? e : f;
}
function F() {
  var e;
  return foundry.utils.randomID ? foundry.utils.randomID() : ((e = crypto.randomUUID) == null ? void 0 : e.call(crypto)) ?? Math.random().toString(36).slice(2, 12);
}
function Oe(e) {
  return e === "supports" ? "green" : e === "contradicts" ? "red" : e === "location" ? "amber" : e === "timeline" ? "violet" : e === "identity" ? "orange" : "cyan";
}
function se(e, l, f) {
  return Math.min(f, Math.max(l, e));
}
function Pe(e) {
  const {
    LegacyApplication: l,
    moduleId: f,
    moduleTitle: g,
    CSIBoardItemEditor: m,
    getCase: I,
    prepareBoardData: M,
    openCaseManager: v,
    canUserEditBoard: w,
    publishSharedLayout: A,
    requestLayoutPublish: G,
    deleteBoardItem: U,
    saveCase: X,
    defaultBoardPosition: Q,
    getRectEdgeAnchor: h,
    isFinitePoint: b,
    clearBoardApp: p
  } = e;
  return class extends l {
    constructor(s, a = {}) {
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
      this.caseId = s, this.playerMode = !!a.playerMode, this._drag = null, this._pan = null, this._localLayout = null, this._layoutDraft = null, this._pendingConnection = null, this._contextBoardPosition = null, this._boundContextClose = null, this._dimmedKinds = /* @__PURE__ */ new Set(), this._saveTimer = null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: "CSI Toolkit Case Board",
        template: `modules/${f}/templates/case-board.hbs`,
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
      const s = I(this.caseId), a = this.playerMode ? "Player Board" : "GM Board";
      return s ? `${s.title} - ${a}` : `CSI Toolkit - ${a}`;
    }
    async getData() {
      return M(this.caseId, { playerMode: this.playerMode, layoutOverride: this._localLayout });
    }
    activateListeners(s) {
      super.activateListeners(s), s.find("[data-action='open-manager']").on("click", () => v()), s.find("[data-action='refresh-board']").on("click", () => this._reloadSharedBoard()), s.find("[data-action='publish-layout']").on("click", () => this._publishLayout()), s.find("[data-action='zoom-in']").on("click", () => this._zoomBy(0.1)), s.find("[data-action='zoom-out']").on("click", () => this._zoomBy(-0.1)), s.find("[data-action='context-add-board-item']").on("click", (c) => this._addBoardItemFromContext(c)), s.find("[data-action='edit-card']").on("click", (c) => this._editCard(c.currentTarget.dataset.collection, c.currentTarget.dataset.itemId)), s.find("[data-action='delete-board-item']").on("click", (c) => this._deleteBoardItem(c.currentTarget.dataset.collection, c.currentTarget.dataset.itemId)), s.find("[data-action='move-timeline-item']").on("click", (c) => this._moveTimelineItem(c.currentTarget.dataset.itemId, c.currentTarget.dataset.direction)), s.find("[data-csi-connection-hit]").on("dblclick", (c) => this._editCard("connections", c.currentTarget.dataset.connectionId)), s.find("[data-action='start-connection']").on("click", (c) => this._startConnection(c)), s.find("[data-csi-dim-kind]").on("change", (c) => this._toggleDimKind(c.currentTarget)), s.find("[data-csi-card-art]").on("dblclick", (c) => this._viewCardArt(c));
      const a = s[0].querySelector("[data-csi-board-viewport]");
      a && (a.addEventListener("wheel", (c) => this._onWheel(c), { passive: !1 }), a.addEventListener("mousedown", (c) => this._onViewportMouseDown(c)), a.addEventListener("contextmenu", (c) => this._openContextMenu(c))), s.find("[data-csi-board-card]").on("mousedown", (c) => this._onCardMouseDown(c)), s.find("[data-csi-board-card]").on("click", (c) => this._completeConnection(c)), s.find(".csi-card-image").on("load", () => this._queueConnectionLineUpdate()), this._syncDimControls(), this._applyDimmedKinds(), this._queueConnectionLineUpdate();
    }
    _onCardMouseDown(s) {
      if (!w(this.caseId) || s.button !== 0 || s.target.closest("button, [data-csi-card-art]")) return;
      const a = s.currentTarget, c = this._getView(), y = this._getLayout(), _ = a.dataset.itemId, S = y.cards[_] ?? { x: Number(a.dataset.x) || 0, y: Number(a.dataset.y) || 0 };
      s.preventDefault(), this._drag = {
        itemId: _,
        card: a,
        startClientX: s.clientX,
        startClientY: s.clientY,
        startX: S.x,
        startY: S.y,
        scale: c.scale,
        x: S.x,
        y: S.y,
        frame: null,
        cards: this._getBoardCardMap(),
        connectionGroups: this._getConnectionGroupsForItem(_)
      }, document.addEventListener("mousemove", this._boundDragMove = (z) => this._onCardDrag(z)), document.addEventListener("mouseup", this._boundDragEnd = () => this._endDrag());
    }
    _onCardDrag(s) {
      if (!this._drag) return;
      const a = Math.round(this._drag.startX + (s.clientX - this._drag.startClientX) / this._drag.scale), c = Math.round(this._drag.startY + (s.clientY - this._drag.startClientY) / this._drag.scale);
      this._drag.x = a, this._drag.y = c, !this._drag.frame && (this._drag.frame = globalThis.requestAnimationFrame ? globalThis.requestAnimationFrame(() => this._flushCardDrag()) : globalThis.setTimeout(() => this._flushCardDrag(), 0));
    }
    _flushCardDrag() {
      this._drag && (this._drag.frame = null, this._applyCardDragPosition(this._drag.x, this._drag.y), this._updateConnectionLines(this._drag.connectionGroups, this._drag.cards));
    }
    _applyCardDragPosition(s, a) {
      this._drag && (this._drag.card.style.left = `${s}px`, this._drag.card.style.top = `${a}px`, this._drag.card.dataset.x = s, this._drag.card.dataset.y = a);
    }
    _endDrag() {
      var a;
      if (!this._drag) return;
      document.removeEventListener("mousemove", this._boundDragMove), document.removeEventListener("mouseup", this._boundDragEnd), this._drag.frame && (globalThis.cancelAnimationFrame ? globalThis.cancelAnimationFrame(this._drag.frame) : (a = globalThis.clearTimeout) == null || a.call(globalThis, this._drag.frame), this._drag.frame = null), this._applyCardDragPosition(this._drag.x, this._drag.y), this._updateConnectionLines(this._drag.connectionGroups, this._drag.cards);
      const s = this._getLayout();
      s.cards[this._drag.itemId] = {
        ...s.cards[this._drag.itemId] ?? {},
        x: Number(this._drag.card.dataset.x),
        y: Number(this._drag.card.dataset.y)
      }, this._drag = null, this._saveLayout(s);
    }
    _onViewportMouseDown(s) {
      if (s.button !== 0 || s.target.closest("[data-csi-board-card], [data-csi-context-menu], [data-csi-connection-hit], button")) return;
      this._hideContextMenu();
      const a = this._getView();
      s.preventDefault(), this._pan = {
        startClientX: s.clientX,
        startClientY: s.clientY,
        startX: a.x,
        startY: a.y
      }, document.addEventListener("mousemove", this._boundPanMove = (c) => this._onPan(c)), document.addEventListener("mouseup", this._boundPanEnd = () => this._endPan());
    }
    _onPan(s) {
      if (!this._pan) return;
      const a = this._getLayout();
      a.view.x = Math.round(this._pan.startX + s.clientX - this._pan.startClientX), a.view.y = Math.round(this._pan.startY + s.clientY - this._pan.startClientY), this._layoutDraft = a, this._applyView(a.view);
    }
    _endPan() {
      if (!this._pan) return;
      document.removeEventListener("mousemove", this._boundPanMove), document.removeEventListener("mouseup", this._boundPanEnd);
      const s = this._layoutDraft ?? this._getLayout();
      this._pan = null, this._saveLayout(s), this._layoutDraft = null;
    }
    _onWheel(s) {
      s.preventDefault(), this._hideContextMenu(), this._zoomBy(s.deltaY > 0 ? -0.08 : 0.08);
    }
    _zoomBy(s) {
      const a = this._getLayout();
      a.view.scale = se(Number(a.view.scale) + s, 0.45, 1.8), this._applyView(a.view), this._saveLayout(a);
    }
    _applyView(s) {
      var y, _;
      const a = (y = this.element[0]) == null ? void 0 : y.querySelector("[data-csi-board-canvas]");
      if (!a) return;
      a.style.transform = `translate(${s.x}px, ${s.y}px) scale(${s.scale})`;
      const c = (_ = this.element[0]) == null ? void 0 : _.querySelector("[data-csi-zoom]");
      c && (c.textContent = `${Math.round(s.scale * 100)}%`);
    }
    _getView() {
      return this._getLayout().view;
    }
    _getLayout() {
      const s = I(this.caseId);
      return W(this._layoutDraft ?? this._localLayout ?? (s == null ? void 0 : s.boardLayout));
    }
    async _saveLayout(s) {
      this._localLayout = W(s);
    }
    async _publishLayout() {
      var a;
      if (!w(this.caseId)) return;
      const s = this._getLayout();
      if ((a = game.user) != null && a.isGM) {
        await A(this.caseId, s);
        return;
      }
      await G(this.caseId, s);
    }
    _reloadSharedBoard() {
      this._localLayout = null, this._layoutDraft = null, this.render(!0);
    }
    _getBoardCardMap() {
      const s = this.element[0];
      return s ? new Map(Array.from(s.querySelectorAll("[data-csi-board-card]")).map((a) => [a.dataset.itemId, a])) : /* @__PURE__ */ new Map();
    }
    _getConnectionGroupsForItem(s) {
      const a = this.element[0];
      return !a || !s ? [] : Array.from(a.querySelectorAll("[data-csi-connection-group]")).filter((c) => c.dataset.fromId === s || c.dataset.toId === s);
    }
    _updateConnectionLines(s = null, a = null) {
      const c = this.element[0];
      if (!c) return;
      const y = a ?? this._getBoardCardMap(), _ = s ?? Array.from(c.querySelectorAll("[data-csi-connection-group]"));
      for (const S of _) {
        const z = y.get(S.dataset.fromId), q = y.get(S.dataset.toId);
        if (!z || !q) continue;
        const Y = this._getCardBoardRect(z), J = this._getCardBoardRect(q), j = h(Y, J), O = h(J, Y);
        if (!b(j) || !b(O)) continue;
        for (const R of S.querySelectorAll("[data-csi-connection-line], [data-csi-connection-hit]"))
          R.setAttribute("x1", j.x), R.setAttribute("y1", j.y), R.setAttribute("x2", O.x), R.setAttribute("y2", O.y);
        const K = S.querySelector("[data-csi-connection-label]");
        K && (K.setAttribute("x", Math.round((j.x + O.x) / 2)), K.setAttribute("y", Math.round((j.y + O.y) / 2 - 10)));
      }
    }
    _queueConnectionLineUpdate() {
      const s = () => this._updateConnectionLines();
      globalThis.requestAnimationFrame ? globalThis.requestAnimationFrame(s) : globalThis.setTimeout(s, 0);
    }
    _getCardBoardRect(s) {
      const a = Number(s.dataset.x) || Number.parseFloat(s.style.left) || 0, c = Number(s.dataset.y) || Number.parseFloat(s.style.top) || 0, y = s.offsetWidth || 220, _ = s.offsetHeight || 246;
      return {
        x: a,
        y: c,
        width: y,
        height: _,
        centerX: a + y / 2,
        centerY: c + _ / 2
      };
    }
    _editCard(s, a) {
      w(this.caseId) && new m(this.caseId, s, a).render(!0);
    }
    _viewCardArt(s) {
      var q, Y, J, j, O, K, R;
      s.preventDefault(), s.stopPropagation();
      const a = (Y = (q = s.currentTarget) == null ? void 0 : q.dataset) == null ? void 0 : Y.imageSrc;
      if (!a) return;
      const c = s.currentTarget.closest("[data-csi-board-card]"), y = ((j = (J = c == null ? void 0 : c.querySelector(".csi-card-body h3")) == null ? void 0 : J.textContent) == null ? void 0 : j.trim()) || "CSI Card Art", _ = globalThis.ImagePopout;
      if (_) {
        new _(a, { title: y }).render(!0);
        return;
      }
      const S = globalThis.Dialog ?? ((R = (K = (O = globalThis.foundry) == null ? void 0 : O.appv1) == null ? void 0 : K.api) == null ? void 0 : R.Dialog);
      if (!S) return;
      const z = String(a).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
      new S({
        title: y,
        content: `<img class="csi-image-dialog" src="${z}" alt="" />`,
        buttons: {
          close: { label: "Close" }
        }
      }, { classes: ["csi-toolkit"], width: 720 }).render(!0);
    }
    async _deleteBoardItem(s, a) {
      !w(this.caseId) || !xe.includes(s) || !a || await U(this.caseId, s, a);
    }
    async _moveTimelineItem(s, a) {
      var q;
      if (!w(this.caseId) || !s) return;
      const c = I(this.caseId), y = ((q = c == null ? void 0 : c.timeline) == null ? void 0 : q.findIndex((Y) => Y.id === s)) ?? -1, S = y + (a === "up" ? -1 : a === "down" ? 1 : 0);
      if (!c || y < 0 || S < 0 || S >= c.timeline.length) return;
      const [z] = c.timeline.splice(y, 1);
      c.timeline.splice(S, 0, z), await X(c);
    }
    _toggleDimKind(s) {
      const a = s == null ? void 0 : s.value;
      ["evidence", "suspects", "locations", "timeline"].includes(a) && (s.checked ? this._dimmedKinds.add(a) : this._dimmedKinds.delete(a), this._applyDimmedKinds());
    }
    _syncDimControls() {
      var s;
      for (const a of ((s = this.element[0]) == null ? void 0 : s.querySelectorAll("[data-csi-dim-kind]")) ?? [])
        a.checked = this._dimmedKinds.has(a.value);
    }
    _applyDimmedKinds() {
      const s = this.element[0];
      if (s) {
        for (const a of s.querySelectorAll("[data-csi-board-card]"))
          a.classList.toggle("is-type-dimmed", this._dimmedKinds.has(a.dataset.collection));
        for (const a of s.querySelectorAll("[data-csi-timeline-row]"))
          a.classList.toggle("is-type-dimmed", this._dimmedKinds.has(a.dataset.collection));
      }
    }
    _addBoardItemFromContext(s) {
      s.preventDefault(), s.stopPropagation();
      const a = s.currentTarget.dataset.collection;
      this._addBoardItem(a, this._contextBoardPosition), this._hideContextMenu();
    }
    _addBoardItem(s = "evidence", a = null) {
      w(this.caseId) && De.includes(s) && new m(this.caseId, s, null, { boardPosition: a }).render(!0);
    }
    _openContextMenu(s) {
      var q, Y;
      if (!w(this.caseId) || s.target.closest("[data-csi-board-card], button, input, select, textarea")) return;
      const a = (q = this.element[0]) == null ? void 0 : q.querySelector("[data-csi-context-menu]"), c = (Y = this.element[0]) == null ? void 0 : Y.querySelector("[data-csi-board-viewport]");
      if (!a || !c) return;
      s.preventDefault(), s.stopPropagation(), this._contextBoardPosition = this._clientToBoardPosition(s.clientX, s.clientY), a.hidden = !1;
      const y = a.offsetWidth || 156, _ = a.offsetHeight || 180, S = Math.max(4, globalThis.innerWidth - y - 4), z = Math.max(4, globalThis.innerHeight - _ - 4);
      a.style.left = `${se(s.clientX, 4, S)}px`, a.style.top = `${se(s.clientY, 4, z)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu() {
      var a;
      const s = (a = this.element[0]) == null ? void 0 : a.querySelector("[data-csi-context-menu]");
      s && (s.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    _clientToBoardPosition(s, a) {
      var S;
      const c = (S = this.element[0]) == null ? void 0 : S.querySelector("[data-csi-board-viewport]"), y = c == null ? void 0 : c.getBoundingClientRect(), _ = this._getView();
      return y ? {
        x: Math.round((s - y.left - _.x) / _.scale - 220 / 2),
        y: Math.round((a - y.top - _.y) / _.scale - 32)
      } : null;
    }
    _startConnection(s) {
      var y;
      if (s.preventDefault(), s.stopPropagation(), !w(this.caseId)) return;
      const c = s.currentTarget.dataset.itemId;
      if (c) {
        this._pendingConnection = { fromId: c };
        for (const _ of this.element[0].querySelectorAll("[data-csi-board-card]")) _.classList.toggle("is-link-source", _.dataset.itemId === c);
        (y = ui.notifications) == null || y.info(`${g}: Select another card to create a connection.`);
      }
    }
    async _completeConnection(s) {
      if (!this._pendingConnection || s.target.closest("button, input, select, textarea, [data-csi-card-art]") || !w(this.caseId)) return;
      const a = s.currentTarget.dataset.itemId, c = this._pendingConnection.fromId;
      this._pendingConnection = null;
      for (const S of this.element[0].querySelectorAll("[data-csi-board-card]")) S.classList.remove("is-link-source");
      if (!a || a === c) return;
      const y = I(this.caseId);
      if (!y) return;
      const _ = ne({
        id: F(),
        fromId: c,
        toId: a,
        label: "linked to",
        type: "link",
        style: "solid",
        color: "cyan",
        visibility: "players"
      });
      y.connections.push(_), await X(y), new m(this.caseId, "connections", _.id).render(!0);
    }
    async close(s = {}) {
      return this._hideContextMenu(), p(this), super.close(s);
    }
  };
}
function He(e) {
  const {
    LegacyApplication: l,
    moduleId: f,
    moduleTitle: g,
    singularLabel: m,
    getItemTitle: I,
    getCase: M,
    buildItemChoices: v,
    parseItemElement: w,
    saveCase: A,
    deleteBoardItem: G,
    defaultBoardPosition: U
  } = e;
  return class extends l {
    constructor(h, b, p, L = {}) {
      super(L);
      x(this, "caseId");
      x(this, "collection");
      x(this, "itemId");
      x(this, "isNew");
      x(this, "boardPosition");
      this.caseId = h, this.collection = b, this.itemId = p || F(), this.isNew = !p, this.boardPosition = L.boardPosition ? {
        x: Number(L.boardPosition.x) || 0,
        y: Number(L.boardPosition.y) || 0
      } : null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: "Edit CSI Board Card",
        template: `modules/${f}/templates/board-item-editor.hbs`,
        classes: ["csi-toolkit", "csi-board-item-editor"],
        width: 560,
        height: 520,
        resizable: !0
      });
    }
    get title() {
      const h = this._getItem();
      return this.isNew ? `Add ${m(this.collection)}` : h ? `Edit ${I(h, this.collection)}` : "Edit CSI Board Card";
    }
    async getData() {
      var p;
      const h = M(this.caseId), b = this._getItem();
      return {
        caseId: this.caseId,
        collection: this.collection,
        item: b,
        isNew: this.isNew,
        itemChoices: h ? v(h, !((p = game.user) != null && p.isGM)) : [],
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
    activateListeners(h) {
      var L, E;
      super.activateListeners(h);
      const b = h[0], p = (L = b == null ? void 0 : b.matches) != null && L.call(b, "[data-csi-board-item-form]") ? b : (E = b == null ? void 0 : b.querySelector) == null ? void 0 : E.call(b, "[data-csi-board-item-form]");
      p && p.addEventListener("submit", (s) => this._save(s)), h.find("[data-action='pick-image']").on("click", (s) => this._pickImage(s.currentTarget)), h.find("[data-action='delete-board-item']").on("click", (s) => this._delete(s));
    }
    _getItem() {
      var p;
      const h = M(this.caseId), b = (p = h == null ? void 0 : h[this.collection]) == null ? void 0 : p.find((L) => L.id === this.itemId);
      return b || (this.isNew ? Ne(this.collection, "players", this.itemId) : null);
    }
    async _save(h) {
      var s, a, c;
      h.preventDefault(), h.stopPropagation(), (s = h.stopImmediatePropagation) == null || s.call(h);
      const b = h.currentTarget, p = M(this.caseId);
      if (!p)
        return (a = ui.notifications) == null || a.warn(`${g}: The case could not be found.`), !1;
      const L = p[this.collection].findIndex((y) => y.id === this.itemId);
      if (L < 0 && !this.isNew)
        return (c = ui.notifications) == null || c.warn(`${g}: The item could not be found.`), !1;
      const E = w(this.collection, b);
      return E.id = this.itemId, E.visibility = "players", E.hidden = L >= 0 ? !!p[this.collection][L].hidden : !1, L >= 0 ? p[this.collection][L] = E : p[this.collection].push(E), this.isNew && this.collection !== "connections" && (p.boardLayout.cards[this.itemId] = this.boardPosition ?? U(p.evidence.length + p.suspects.length + p.locations.length + p.timeline.length)), await A(p), this.close(), !1;
    }
    async _delete(h) {
      var p;
      return h.preventDefault(), h.stopPropagation(), (p = h.stopImmediatePropagation) == null || p.call(h), this.isNew || await G(this.caseId, this.collection, this.itemId, { confirm: !0 }) && this.close(), !1;
    }
    _pickImage(h) {
      var L, E, s, a;
      const b = (L = h.closest(".csi-image-field")) == null ? void 0 : L.querySelector("input"), p = globalThis.FilePicker ?? ((a = (s = (E = globalThis.foundry) == null ? void 0 : E.applications) == null ? void 0 : s.apps) == null ? void 0 : a.FilePicker);
      !b || !p || new p({
        type: "image",
        current: b.value,
        callback: (c) => {
          b.value = c, b.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).render(!0);
    }
  };
}
const B = "csi-toolkit", C = "CSI Toolkit", ie = `module.${B}`, Fe = [
  `modules/${B}/templates/case-manager.hbs`,
  `modules/${B}/templates/case-browser.hbs`,
  `modules/${B}/templates/case-board.hbs`,
  `modules/${B}/templates/item-card.hbs`,
  `modules/${B}/templates/board-item-editor.hbs`
];
function qe() {
  game.settings.register(B, "cases", {
    name: "CSI Toolkit Cases",
    hint: "Stores all investigation cases for this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  });
}
function re(e) {
  return String(e || "").replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
function Ge(e) {
  return String(e || "case").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "case";
}
function ve(e) {
  const l = document.createElement("div");
  return l.textContent = String(e ?? ""), l.innerHTML;
}
function ze() {
  Handlebars.registerHelper("csiEq", (e, l) => e === l), Handlebars.registerHelper("csiLabel", (e) => re(e)), Handlebars.registerHelper("csiCount", (e) => Array.isArray(e) ? e.length : 0), Handlebars.registerHelper("csiFallback", (e, l) => e || l), Handlebars.registerHelper("csiJoin", (e) => Array.isArray(e) ? e.join(", ") : ""), Handlebars.registerHelper("csiOption", (e, l) => e === l ? "selected" : ""), Handlebars.registerHelper("csiChecked", (e) => e === "players" ? "checked" : "");
}
function Ye() {
  var e, l, f;
  return ((l = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : l.api) ?? ((f = foundry == null ? void 0 : foundry.applications) == null ? void 0 : f.api) ?? null;
}
function Re() {
  var e, l, f;
  return ((l = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : l.api) ?? ((f = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : f.api) ?? null;
}
function Ue(e = {}, l = {}) {
  var g, m, I;
  const f = ((m = (g = globalThis.foundry) == null ? void 0 : g.utils) == null ? void 0 : m.mergeObject) ?? ((I = foundry == null ? void 0 : foundry.utils) == null ? void 0 : I.mergeObject);
  return typeof f == "function" ? f(e, l, { inplace: !1 }) : { ...e, ...l };
}
function Ve() {
  var e, l, f, g, m;
  return ((f = (l = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : l.randomID) == null ? void 0 : f.call(l, 8)) ?? ((m = (g = foundry == null ? void 0 : foundry.utils) == null ? void 0 : g.randomID) == null ? void 0 : m.call(g, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function Se(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${Ve()}`),
    tag: e.tag ?? "section",
    classes: Array.isArray(e.classes) ? e.classes : [],
    window: {
      title: e.title ?? "",
      icon: e.icon,
      resizable: e.resizable === !0
    },
    position: {
      width: Number(e.width ?? 600),
      height: e.height === "auto" ? "auto" : Number(e.height ?? 600)
    }
  };
}
function je(e) {
  return class extends e {
    constructor(g = {}) {
      const m = Ue(new.target.defaultOptions ?? {}, g);
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
    activateListeners(g) {
    }
    async _renderHTML(g, m) {
      var A, G, U;
      const I = typeof this.getData == "function" ? await this.getData() : {}, M = ((A = this._v1Options) == null ? void 0 : A.template) ?? ((G = this.options) == null ? void 0 : G.template) ?? ((U = this.constructor.defaultOptions) == null ? void 0 : U.template);
      if (!M) return document.createDocumentFragment();
      const v = await globalThis.renderTemplate(M, I), w = document.createElement("template");
      return w.innerHTML = v.trim(), w.content;
    }
    _activateV1Form(g) {
      var I, M;
      if (typeof this._updateObject != "function") return;
      const m = (I = g.matches) != null && I.call(g, "form") ? g : (M = g.querySelector) == null ? void 0 : M.call(g, "form");
      m instanceof HTMLFormElement && m.addEventListener("submit", async (v) => {
        var A;
        v.preventDefault(), v.stopPropagation();
        const w = new FormData(m);
        await this._updateObject(v, w), ((A = this._v1Options) == null ? void 0 : A.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(g, m, I) {
      var G, U, X, Q;
      m.replaceChildren(g);
      const M = globalThis.jQuery ?? globalThis.$, v = ((G = m.closest) == null ? void 0 : G.call(m, ".window-app, .app, .application")) ?? m, w = M ? M(v) : v;
      try {
        Object.defineProperty(this, "element", {
          value: w,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = w;
        } catch {
        }
      }
      const A = (U = this._v1Options) == null ? void 0 : U.classes;
      Array.isArray(A) && A.length && (m.classList.add(...A), (Q = (X = m.closest) == null ? void 0 : X.call(m, ".window-app, .app, .application")) == null || Q.classList.add(...A)), this._activateV1Form(m), typeof this.activateListeners == "function" && this.activateListeners(M ? M(m) : m);
    }
  };
}
function Xe() {
  const e = Ye(), l = Re(), f = globalThis.Application ?? (l == null ? void 0 : l.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (l == null ? void 0 : l.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (f) return f;
  const g = e == null ? void 0 : e.ApplicationV2;
  return g ? je(g) : null;
}
(() => {
  const e = Xe(), l = {
    manager: null,
    browser: null,
    boards: /* @__PURE__ */ new Map(),
    playerBoard: null
  };
  Hooks.once("init", async () => {
    qe(), ze(), await loadTemplates(Fe), console.log(`${C} | Initialized`);
  }), Hooks.once("ready", () => {
    game.csiToolkit = f();
    const t = game.modules.get(B);
    t && (t.api = game.csiToolkit), g(), game.socket.on(ie, y), console.log(`${C} | API available at game.csiToolkit`);
  });
  function f() {
    return {
      openCaseBoard: (t, n = {}) => E(t, n),
      openCaseManager: () => p(),
      openCaseBrowser: () => L(),
      createCase: (t) => G(t),
      getCases: () => m(),
      exportCase: (t) => b(t),
      importCase: (t) => h(t)
    };
  }
  function g() {
    const t = game.modules.get("holosuite-core"), n = t != null && t.active ? t.api : null;
    return n != null && n.registerApp ? (n.registerApp({
      id: B,
      title: "CSI Toolkit",
      icon: "fa-solid fa-fingerprint",
      premium: !1,
      featureId: B,
      description: "Open case files, evidence boards, and investigation tools.",
      open: () => {
        var i;
        return (i = game.user) != null && i.isGM ? p() : L();
      }
    }), !0) : !1;
  }
  function m() {
    return Ce(game.settings.get(B, "cases") ?? {});
  }
  async function I(t) {
    return game.settings.set(B, "cases", t ?? {});
  }
  function M() {
    var n;
    return (((n = game.users) == null ? void 0 : n.contents) ?? Array.from(game.users ?? [])).some((i) => (i == null ? void 0 : i.isGM) && (i == null ? void 0 : i.active));
  }
  function v(t) {
    const n = m();
    return n[t] ? V(n[t]) : null;
  }
  async function w(t, { notify: n = !0, render: i = !0, updateReason: o = null, userName: r = null } = {}) {
    var T;
    const u = V(t);
    if (!((T = game.user) != null && T.isGM)) return A(u, { notify: n, render: i });
    const d = m();
    return d[u.id] = u, await I(d), n && c(u.id, { reason: o, userName: r }), i && te(u.id), u;
  }
  async function A(t, { render: n = !0, notify: i = !0 } = {}) {
    var o, r, u, d, T, $;
    return (o = game.socket) != null && o.emit ? M() ? (game.socket.emit(ie, {
      type: "save-case-request",
      caseData: t,
      userId: (d = game.user) == null ? void 0 : d.id,
      userName: (T = game.user) == null ? void 0 : T.name
    }), i && (($ = ui.notifications) == null || $.info(`${C}: Board update sent to the GM.`)), t) : ((u = ui.notifications) == null || u.warn(`${C}: No active GM is connected to save board changes.`), t) : ((r = ui.notifications) == null || r.warn(`${C}: A GM must be connected to save board changes.`), t);
  }
  async function G(t = {}) {
    var o;
    const n = V(t, { forceNewId: !t.id }), i = m();
    return i[n.id] = n, await I(i), c(n.id), (o = ui.notifications) == null || o.info(`${C}: Created case "${n.title}".`), n;
  }
  async function U(t) {
    var o;
    const n = m(), i = n[t];
    return i ? (delete n[t], await I(n), Me(t), c(t), (o = ui.notifications) == null || o.info(`${C}: Deleted case "${i.title}".`), !0) : !1;
  }
  async function X(t, n, i, { confirm: o = !0 } = {}) {
    var T, $;
    if (!xe.includes(n) || !i) return !1;
    const r = v(t);
    if (!r) return !1;
    const u = (T = r[n]) == null ? void 0 : T.find((D) => D.id === i);
    if (!u) return !1;
    const d = Ie(u, n);
    return o && !await we({
      title: `Delete ${re(oe(n))}`,
      content: `<p>Delete <strong>${ve(d)}</strong>?${n === "connections" ? "" : " Any attached connections will also be deleted."}</p>`,
      yes: () => !0,
      no: () => !1,
      defaultYes: !1
    }) ? !1 : (r[n] = r[n].filter((D) => D.id !== i), n !== "connections" && (r.connections = r.connections.filter((D) => D.fromId !== i && D.toId !== i), r.timeline = r.timeline.map((D) => ({
      ...D,
      linkedItemIds: (D.linkedItemIds ?? []).filter((k) => k !== i)
    })), delete r.boardLayout.cards[i]), await w(r), ($ = ui.notifications) == null || $.info(`${C}: Deleted "${d}".`), !0);
  }
  async function Q(t) {
    var r;
    const n = v(t);
    if (!n) return null;
    const i = V({
      ...n,
      id: F(),
      title: `${n.title} Copy`
    }), o = m();
    return o[i.id] = i, await I(o), c(i.id), (r = ui.notifications) == null || r.info(`${C}: Duplicated case "${n.title}".`), i;
  }
  async function h(t) {
    var o;
    const n = V({
      ...t,
      id: t.id || F()
    }), i = m();
    return i[n.id] && (n.id = F()), i[n.id] = n, await I(i), c(n.id), (o = ui.notifications) == null || o.info(`${C}: Imported case "${n.title}".`), n;
  }
  function b(t) {
    const n = v(t);
    if (!n) return !1;
    const i = new Blob([JSON.stringify(n, null, 2)], { type: "application/json" }), o = URL.createObjectURL(i), r = document.createElement("a");
    return r.href = o, r.download = `${Ge(n.title)}.json`, r.click(), URL.revokeObjectURL(o), !0;
  }
  function p() {
    var t;
    return (t = game.user) != null && t.isGM ? (l.manager || (l.manager = new q()), l.manager.render(!0), l.manager) : L();
  }
  function L() {
    return l.browser || (l.browser = new z()), l.browser.render(!0), l.browser;
  }
  function E(t, n = {}) {
    var T, $, D;
    if (!t)
      return (T = ui.notifications) == null || T.warn(`${C}: No case id provided.`), null;
    if (!v(t))
      return ($ = ui.notifications) == null || $.warn(`${C}: Case "${t}" was not found.`), null;
    const o = n.playerMode ?? !((D = game.user) != null && D.isGM), r = `${t}:${o ? "player" : "gm"}`, u = l.boards.get(r);
    if (u)
      return u.render(!0), u;
    const d = new S(t, { playerMode: o });
    return l.boards.set(r, d), d.render(!0), d;
  }
  async function s(t, n) {
    var o, r, u, d, T, $;
    const i = W(n);
    return (o = game.socket) != null && o.emit ? M() ? (game.socket.emit(ie, {
      type: "publish-layout-request",
      caseId: t,
      boardLayout: i,
      userId: (d = game.user) == null ? void 0 : d.id,
      userName: (T = game.user) == null ? void 0 : T.name
    }), ($ = ui.notifications) == null || $.info(`${C}: Layout publish request sent to the GM.`), !0) : ((u = ui.notifications) == null || u.warn(`${C}: No active GM is connected to publish the board layout.`), !1) : ((r = ui.notifications) == null || r.warn(`${C}: A GM must be connected to publish the board layout.`), !1);
  }
  async function a(t, n, { userId: i = ((r) => (r = game.user) == null ? void 0 : r.id)(), userName: o = ((u) => (u = game.user) == null ? void 0 : u.name)() } = {}) {
    var D;
    const d = v(t);
    if (!d) return !1;
    const T = W(d.boardLayout), $ = W(n);
    return d.boardLayout = W({
      ...T,
      cards: $.cards
    }), await w(d, {
      render: !1,
      updateReason: "layout-published",
      userName: o
    }), te(t, { resetLayout: !0 }), (D = ui.notifications) == null || D.info(`${C}: Published shared board layout${o ? ` from ${o}` : ""}.`), !0;
  }
  function c(t, { reason: n = null, userName: i = null } = {}) {
    var o, r;
    (r = game.socket) == null || r.emit(ie, { type: "case-updated", caseId: t, reason: n, userName: i, userId: (o = game.user) == null ? void 0 : o.id });
  }
  function y(t) {
    var n, i, o, r;
    if (t) {
      if (t.type === "save-case-request") {
        if (!((n = game.user) != null && n.isGM) || !t.caseData) return;
        w(t.caseData, { render: !1 }).then((u) => {
          var d;
          u && (te(u.id), (d = ui.notifications) == null || d.info(`${C}: Saved player board update from ${t.userName ?? "a player"}.`));
        }).catch((u) => {
          var d;
          console.error(`${C} | Could not save player board update`, u), (d = ui.notifications) == null || d.error(`${C}: Player board update could not be saved.`);
        });
        return;
      }
      if (t.type === "publish-layout-request") {
        if (!((i = game.user) != null && i.isGM) || !t.caseId || !t.boardLayout) return;
        a(t.caseId, t.boardLayout, {
          userId: t.userId,
          userName: t.userName
        }).catch((u) => {
          var d;
          console.error(`${C} | Could not publish player layout`, u), (d = ui.notifications) == null || d.error(`${C}: Player layout could not be published.`);
        });
        return;
      }
      if (t.type === "case-updated" && t.caseId) {
        if (t.userId && t.userId === ((o = game.user) == null ? void 0 : o.id)) return;
        te(t.caseId, { resetLayout: t.reason === "layout-published" }), t.reason === "layout-published" && ((r = ui.notifications) == null || r.info(`${C}: ${t.userName ?? "Someone"} published a shared board layout.`));
        return;
      }
    }
  }
  const _ = He({
    LegacyApplication: e,
    moduleId: B,
    moduleTitle: C,
    singularLabel: oe,
    getItemTitle: Ie,
    getCase: v,
    buildItemChoices: be,
    parseItemElement: J,
    saveCase: w,
    deleteBoardItem: X,
    defaultBoardPosition: ae
  }), S = Pe({
    LegacyApplication: e,
    moduleId: B,
    moduleTitle: C,
    CSIBoardItemEditor: _,
    getCase: v,
    prepareBoardData: j,
    openCaseManager: p,
    canUserEditBoard: _e,
    publishSharedLayout: a,
    requestLayoutPublish: s,
    deleteBoardItem: X,
    saveCase: w,
    defaultBoardPosition: ae,
    getRectEdgeAnchor: $e,
    isFinitePoint: Ae,
    clearBoardApp: (t) => {
      l.boards.delete(`${t.caseId}:${t.playerMode ? "player" : "gm"}`), l.playerBoard === t && (l.playerBoard = null);
    }
  });
  class z extends e {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "csi-case-browser",
        title: "CSI Toolkit Case Files",
        template: `modules/${B}/templates/case-browser.hbs`,
        classes: ["csi-toolkit", "csi-case-browser"],
        width: 520,
        height: 620,
        resizable: !0
      });
    }
    async getData() {
      var i;
      return {
        cases: Object.values(m()).map((o) => V(o)).sort((o, r) => o.title.localeCompare(r.title)),
        isGM: (i = game.user) == null ? void 0 : i.isGM,
        canContribute: ke()
      };
    }
    activateListeners(n) {
      super.activateListeners(n), n.find("[data-action='open-board']").on("click", (i) => {
        var o;
        E(i.currentTarget.dataset.caseId, { playerMode: !((o = game.user) != null && o.isGM) });
      }), n.find("[data-action='open-manager']").on("click", () => p());
    }
    async close(n = {}) {
      return l.browser = null, super.close(n);
    }
  }
  class q extends e {
    constructor(n = {}) {
      super(n), this.selectedCaseId = n.caseId ?? null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "csi-case-manager",
        title: "CSI Toolkit Case Manager",
        template: `modules/${B}/templates/case-manager.hbs`,
        classes: ["csi-toolkit", "csi-case-manager"],
        width: 1180,
        height: 820,
        resizable: !0
      });
    }
    async getData() {
      var u;
      const n = m(), i = Object.values(n).map((d) => V(d)).sort((d, T) => d.title.localeCompare(T.title));
      !this.selectedCaseId && i.length && (this.selectedCaseId = i[0].id), this.selectedCaseId && !n[this.selectedCaseId] && (this.selectedCaseId = ((u = i[0]) == null ? void 0 : u.id) ?? null);
      const o = this.selectedCaseId ? V(n[this.selectedCaseId]) : null, r = o ? be(o) : [];
      return {
        cases: i,
        selected: o,
        itemChoices: r,
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
      super.activateListeners(n), n.find("[data-action='select-case']").on("click", (i) => {
        this.selectedCaseId = i.currentTarget.dataset.caseId, this.render(!1);
      }), n.find("[data-action='new-case']").on("click", () => this._createNewCase()), n.find("[data-csi-case-form]").on("submit", (i) => this._saveSelectedCase(i)), n.find("[data-action='save-case']").on("click", (i) => this._saveSelectedCase(i)), n.find("[data-action='delete-case']").on("click", () => this._deleteSelectedCase()), n.find("[data-action='duplicate-case']").on("click", () => this._duplicateSelectedCase()), n.find("[data-action='open-board']").on("click", () => E(this.selectedCaseId)), n.find("[data-action='pick-image']").on("click", (i) => this._pickImage(i.currentTarget)), n.find("[data-action='export-case']").on("click", () => b(this.selectedCaseId)), n.find("[data-action='import-case']").on("click", () => {
        var i;
        return (i = this.element[0].querySelector("[data-csi-import-file]")) == null ? void 0 : i.click();
      }), n.find("[data-csi-import-file]").on("change", (i) => this._importFromFile(i.currentTarget));
    }
    _readCurrentCase() {
      const n = this.element[0].querySelector("[data-csi-case-form]");
      return n ? Y(n, this.selectedCaseId) : v(this.selectedCaseId);
    }
    async _createNewCase() {
      const n = await G({
        title: "New Investigation",
        subtitle: "Unfiled case",
        description: "Describe the incident, victim, premise, or central mystery.",
        visibility: "players"
      });
      this.selectedCaseId = n.id, this.render(!1);
    }
    async _saveSelectedCase(n) {
      var i, o;
      if (n.preventDefault(), !!this.selectedCaseId)
        try {
          const r = this._readCurrentCase();
          await w(r), this.selectedCaseId = r.id, (i = ui.notifications) == null || i.info(`${C}: Saved case "${r.title}".`), this.render(!1);
        } catch (r) {
          console.error(`${C} | Could not save case`, r), (o = ui.notifications) == null || o.error(`${C}: ${r.message}`);
        }
    }
    async _deleteSelectedCase() {
      if (!this.selectedCaseId) return;
      const n = v(this.selectedCaseId);
      !n || !await we({
        title: "Delete CSI Case",
        content: `<p>Delete <strong>${ve(n.title)}</strong>? This cannot be undone.</p>`,
        yes: () => !0,
        no: () => !1,
        defaultYes: !1
      }) || (await U(this.selectedCaseId), this.selectedCaseId = null, this.render(!1));
    }
    async _duplicateSelectedCase() {
      if (!this.selectedCaseId) return;
      const n = await Q(this.selectedCaseId);
      n && (this.selectedCaseId = n.id, this.render(!1));
    }
    _pickImage(n) {
      var r, u, d, T, $;
      const i = (r = n.closest(".csi-image-field")) == null ? void 0 : r.querySelector("input");
      if (!i) return;
      const o = globalThis.FilePicker ?? ((T = (d = (u = globalThis.foundry) == null ? void 0 : u.applications) == null ? void 0 : d.apps) == null ? void 0 : T.FilePicker);
      if (!o) {
        ($ = ui.notifications) == null || $.warn(`${C}: Foundry FilePicker is unavailable.`);
        return;
      }
      new o({
        type: "image",
        current: i.value,
        callback: (D) => {
          i.value = D, i.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).render(!0);
    }
    async _importFromFile(n) {
      var o, r;
      const i = (o = n.files) == null ? void 0 : o[0];
      if (i)
        try {
          const u = await i.text(), d = await h(JSON.parse(u));
          this.selectedCaseId = d.id, this.render(!1);
        } catch (u) {
          console.error(`${C} | Import failed`, u), (r = ui.notifications) == null || r.error(`${C}: Import failed. ${u.message}`);
        } finally {
          n.value = "";
        }
    }
    async close(n = {}) {
      return l.manager = null, super.close(n);
    }
  }
  function Y(t, n) {
    const i = new FormData(t), o = v(n) ?? V({ id: n }), r = V({
      id: n,
      title: i.get("title"),
      subtitle: i.get("subtitle"),
      status: i.get("status"),
      description: i.get("description"),
      image: i.get("image"),
      visibility: "players",
      evidence: o.evidence,
      suspects: o.suspects,
      locations: o.locations,
      timeline: o.timeline,
      connections: o.connections,
      boardLayout: {
        ...o.boardLayout,
        theme: i.get("theme")
      }
    });
    return V(r);
  }
  function J(t, n) {
    const i = (u) => {
      var d;
      return ((d = n.querySelector(`[name="${u}"]`)) == null ? void 0 : d.value) ?? "";
    }, o = "players", r = { id: n.dataset.itemId || F(), visibility: o };
    return t === "evidence" ? he({
      ...r,
      title: i("title"),
      type: i("type"),
      status: i("status"),
      description: i("description"),
      image: i("image"),
      notes: i("notes")
    }) : t === "suspects" ? pe({
      ...r,
      name: i("name"),
      alias: i("alias"),
      status: i("status"),
      motive: i("motive"),
      alibi: i("alibi"),
      image: i("image"),
      notes: i("notes")
    }) : t === "locations" ? ge({
      ...r,
      name: i("name"),
      sceneId: i("sceneId"),
      image: i("image"),
      description: i("description"),
      notes: i("notes")
    }) : t === "timeline" ? ye({
      ...r,
      time: i("time"),
      title: i("title"),
      description: i("description"),
      linkedItemIds: i("linkedItemIds").split(",").map((u) => u.trim()).filter(Boolean)
    }) : ne({
      id: r.id,
      visibility: o,
      fromId: i("fromId"),
      toId: i("toId"),
      label: i("label"),
      type: i("type"),
      style: i("style"),
      color: i("color")
    });
  }
  function j(t, { playerMode: n = !1, layoutOverride: i = null } = {}) {
    var $, D;
    const o = v(t);
    if (!o) return { isMissing: !0, playerMode: n, isGM: ($ = game.user) == null ? void 0 : $.isGM };
    const r = Ce(o);
    i && (r.boardLayout = W(i)), r.evidence = O(r.evidence), r.suspects = O(r.suspects), r.locations = O(r.locations), r.timeline = O(r.timeline);
    const u = K(r), d = new Map(u.map((k) => [k.id, k]));
    r.timeline = r.timeline.map((k) => ({
      ...k,
      linkedLabels: (k.linkedItemIds ?? []).map((P) => {
        var N;
        return (N = d.get(P)) == null ? void 0 : N.label;
      }).filter(Boolean)
    }));
    const T = O(r.connections).map((k) => {
      const P = d.get(k.fromId), N = d.get(k.toId);
      return {
        ...k,
        fromLabel: (P == null ? void 0 : P.label) ?? k.fromId,
        toLabel: (N == null ? void 0 : N.label) ?? k.toId,
        x1: P ? P.x + 220 / 2 : 0,
        y1: P ? P.y + 94 : 0,
        x2: N ? N.x + 220 / 2 : 0,
        y2: N ? N.y + 94 : 0,
        labelX: P && N ? Math.round((P.x + N.x + 220) / 2) : 0,
        labelY: P && N ? Math.round((P.y + N.y) / 2 + 84) : 0,
        typeClass: `csi-connection--${k.type}`,
        styleClass: `csi-connection-line--${k.style}`,
        colorClass: `csi-connection-color--${k.color}`,
        hasVisibleEnds: !!(P && N)
      };
    }).filter((k) => k.hasVisibleEnds);
    return {
      case: r,
      cards: u,
      connections: T,
      boardSize: { width: 5200, height: 3600 },
      viewStyle: `transform: translate(${r.boardLayout.view.x}px, ${r.boardLayout.view.y}px) scale(${r.boardLayout.view.scale});`,
      zoomPercent: Math.round(r.boardLayout.view.scale * 100),
      themeClass: `csi-theme-${r.boardLayout.theme}`,
      playerMode: n,
      isGM: (D = game.user) == null ? void 0 : D.isGM,
      canEditBoard: _e(o),
      addCollections: De.map((k) => ({
        id: k,
        label: re(oe(k))
      })),
      counts: {
        evidence: r.evidence.length,
        suspects: r.suspects.length,
        locations: r.locations.length,
        timeline: r.timeline.length,
        connections: T.length
      }
    };
  }
  function O(t) {
    return Array.isArray(t) ? t : [];
  }
  function K(t) {
    const n = W(t.boardLayout), i = [];
    for (const o of t.evidence) i.push(R(o, "evidence", "Evidence", o.title, n, i.length));
    for (const o of t.suspects) i.push(R(o, "suspects", "Suspect", o.name, n, i.length));
    for (const o of t.locations) i.push(R(o, "locations", "Location", o.name, n, i.length));
    for (const o of t.timeline) i.push(R(o, "timeline", "Timeline", o.title, n, i.length));
    return i;
  }
  function R(t, n, i, o, r, u) {
    const d = r.cards[t.id] ?? ae(u);
    return {
      ...t,
      collection: n,
      kind: n === "suspects" ? "suspect" : n === "locations" ? "location" : n === "timeline" ? "timeline" : "evidence",
      kindLabel: i,
      label: o,
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
    for (const i of t.evidence) n.push({ id: i.id, label: `Evidence: ${i.title}` });
    for (const i of t.suspects) n.push({ id: i.id, label: `Suspect: ${i.name}` });
    for (const i of t.locations) n.push({ id: i.id, label: `Location: ${i.name}` });
    for (const i of t.timeline) n.push({ id: i.id, label: `Timeline: ${i.title}` });
    return n;
  }
  function te(t, { resetLayout: n = !1 } = {}) {
    var i;
    (i = l.manager) != null && i.rendered && l.manager.render(!0);
    for (const [o, r] of l.boards.entries())
      n && o.startsWith(`${t}:`) && (r._localLayout = null), o.startsWith(`${t}:`) && r.rendered && r.render(!0);
  }
  function _e(t) {
    return !!(typeof t == "string" ? v(t) : t);
  }
  function ke() {
    return !0;
  }
  function Me(t) {
    for (const [n, i] of l.boards.entries())
      n.startsWith(`${t}:`) && i.close();
  }
  function Ce(t) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(t) : JSON.parse(JSON.stringify(t));
  }
  function oe(t) {
    return t === "suspects" ? "suspect" : t === "locations" ? "location" : t === "timeline" ? "timeline item" : t === "connections" ? "connection" : "evidence";
  }
  function Ie(t, n) {
    return n === "connections" ? t.label || `${t.fromId} -> ${t.toId}` : n === "suspects" || n === "locations" ? t.name : t.title;
  }
  function $e(t, n) {
    const i = n.centerX - t.centerX, o = n.centerY - t.centerY;
    if (!i && !o) return { x: Math.round(t.centerX), y: Math.round(t.centerY) };
    const r = i === 0 ? Number.POSITIVE_INFINITY : Math.abs(t.width / 2 / i), u = o === 0 ? Number.POSITIVE_INFINITY : Math.abs(t.height / 2 / o), d = Math.min(r, u);
    return !Number.isFinite(d) || d <= 0 ? { x: Math.round(t.centerX), y: Math.round(t.centerY) } : {
      x: Math.round(t.centerX + i * d),
      y: Math.round(t.centerY + o * d)
    };
  }
  function Ae(t) {
    return Number.isFinite(t == null ? void 0 : t.x) && Number.isFinite(t == null ? void 0 : t.y);
  }
  function we(t) {
    var i, o, r, u, d;
    const n = globalThis.Dialog ?? ((r = (o = (i = globalThis.foundry) == null ? void 0 : i.appv1) == null ? void 0 : o.api) == null ? void 0 : r.Dialog);
    return n != null && n.confirm ? n.confirm(t) : Promise.resolve((d = globalThis.confirm) == null ? void 0 : d.call(globalThis, ((u = t.content) == null ? void 0 : u.replace(/<[^>]+>/g, "")) ?? t.title));
  }
})();
