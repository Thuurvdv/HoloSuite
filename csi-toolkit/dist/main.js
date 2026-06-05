var He = Object.defineProperty;
var qe = (s, l, b) => l in s ? He(s, l, { enumerable: !0, configurable: !0, writable: !0, value: b }) : s[l] = b;
var S = (s, l, b) => qe(s, typeof l != "symbol" ? l + "" : l, b);
const Te = ["open", "cold", "solved", "classified"], W = ["gm", "players"], Le = ["database", "noir"], re = ["physical", "digital", "biological", "weapon", "document", "testimony", "other"], ce = ["unknown", "relevant", "red_herring", "confirmed"], le = ["unknown", "cleared", "person_of_interest", "prime_suspect", "arrested", "dead"], de = ["link", "supports", "contradicts", "location", "timeline", "identity"], ue = ["solid", "dashed", "dotted"], me = ["cyan", "green", "red", "amber", "violet", "orange", "white"], xe = ["evidence", "suspects", "locations", "timeline", "connections"], ke = ["evidence", "suspects", "locations", "timeline", "connections"];
function O(s = {}, { forceNewId: l = !1 } = {}) {
  return {
    id: l ? D() : s.id || D(),
    title: String(s.title || "Untitled Case"),
    subtitle: String(s.subtitle || ""),
    status: $(s.status, Te, "open"),
    description: String(s.description || ""),
    image: String(s.image || ""),
    visibility: $(s.visibility, W, "players"),
    evidence: Q(s.evidence, fe),
    suspects: Q(s.suspects, he),
    locations: Q(s.locations, pe),
    timeline: Q(s.timeline, ge),
    connections: Q(s.connections, ne),
    boardLayout: F(s.boardLayout)
  };
}
function fe(s = {}) {
  return {
    id: s.id || D(),
    title: String(s.title || "Untitled Evidence"),
    type: $(s.type, re, "other"),
    description: String(s.description || ""),
    image: String(s.image || ""),
    status: $(s.status, ce, "unknown"),
    visibility: $(s.visibility, W, "players"),
    hidden: !!s.hidden,
    notes: String(s.notes || "")
  };
}
function he(s = {}) {
  return {
    id: s.id || D(),
    name: String(s.name || "Unknown Suspect"),
    alias: String(s.alias || ""),
    image: String(s.image || ""),
    motive: String(s.motive || ""),
    alibi: String(s.alibi || ""),
    status: $(s.status, le, "unknown"),
    visibility: $(s.visibility, W, "players"),
    hidden: !!s.hidden,
    notes: String(s.notes || "")
  };
}
function pe(s = {}) {
  return {
    id: s.id || D(),
    name: String(s.name || "Unknown Location"),
    sceneId: String(s.sceneId || ""),
    image: String(s.image || ""),
    description: String(s.description || ""),
    visibility: $(s.visibility, W, "players"),
    hidden: !!s.hidden,
    notes: String(s.notes || "")
  };
}
function ge(s = {}) {
  return {
    id: s.id || D(),
    time: String(s.time || ""),
    title: String(s.title || "Timeline Event"),
    description: String(s.description || ""),
    linkedItemIds: Array.isArray(s.linkedItemIds) ? s.linkedItemIds.map(String) : [],
    visibility: $(s.visibility, W, "players"),
    hidden: !!s.hidden
  };
}
function ne(s = {}) {
  return {
    id: s.id || D(),
    fromId: String(s.fromId || ""),
    toId: String(s.toId || ""),
    label: String(s.label || ""),
    type: $(s.type, de, "link"),
    style: $(s.style, ue, "solid"),
    color: $(s.color, me, Fe(s.type)),
    visibility: $(s.visibility, W, "players")
  };
}
function F(s = {}) {
  var l, b, q;
  return {
    theme: $(s.theme, Le, "database"),
    view: {
      x: Number((l = s.view) == null ? void 0 : l.x) || 0,
      y: Number((b = s.view) == null ? void 0 : b.y) || 0,
      scale: ie(Number((q = s.view) == null ? void 0 : q.scale) || 1, 0.45, 1.8)
    },
    cards: Object.fromEntries(Object.entries(s.cards ?? {}).map(([N, p]) => [N, {
      x: Number(p == null ? void 0 : p.x) || 0,
      y: Number(p == null ? void 0 : p.y) || 0
    }]))
  };
}
function Ge(s, l = "players", b = D()) {
  return s === "evidence" ? fe({ id: b, visibility: l }) : s === "suspects" ? he({ id: b, visibility: l }) : s === "locations" ? pe({ id: b, visibility: l }) : s === "timeline" ? ge({ id: b, visibility: l }) : ne({ id: b, visibility: l });
}
function Q(s, l) {
  return Array.isArray(s) ? s.map((b) => l(b)) : [];
}
function $(s, l, b) {
  return l.includes(s) ? s : b;
}
function D() {
  var s;
  return foundry.utils.randomID ? foundry.utils.randomID() : ((s = crypto.randomUUID) == null ? void 0 : s.call(crypto)) ?? Math.random().toString(36).slice(2, 12);
}
function Fe(s) {
  return s === "supports" ? "green" : s === "contradicts" ? "red" : s === "location" ? "amber" : s === "timeline" ? "violet" : s === "identity" ? "orange" : "cyan";
}
function ie(s, l, b) {
  return Math.min(b, Math.max(l, s));
}
function Ye(s) {
  const {
    LegacyApplication: l,
    moduleId: b,
    moduleTitle: q,
    CSIBoardItemEditor: N,
    getCase: p,
    prepareBoardData: Y,
    openCaseManager: V,
    canUserEditBoard: E,
    publishSharedLayout: j,
    requestLayoutPublish: B,
    deleteBoardItem: G,
    saveCase: U,
    defaultBoardPosition: k,
    getRectEdgeAnchor: m,
    isFinitePoint: g,
    clearBoardApp: f
  } = s;
  return class extends l {
    constructor(n, o = {}) {
      super(o);
      S(this, "caseId");
      S(this, "playerMode");
      S(this, "_drag");
      S(this, "_pan");
      S(this, "_localLayout");
      S(this, "_layoutDraft");
      S(this, "_pendingConnection");
      S(this, "_contextBoardPosition");
      S(this, "_boundContextClose");
      S(this, "_dimmedKinds");
      S(this, "_saveTimer");
      S(this, "_boundDragMove");
      S(this, "_boundDragEnd");
      S(this, "_boundPanMove");
      S(this, "_boundPanEnd");
      this.caseId = n, this.playerMode = !!o.playerMode, this._drag = null, this._pan = null, this._localLayout = null, this._layoutDraft = null, this._pendingConnection = null, this._contextBoardPosition = null, this._boundContextClose = null, this._dimmedKinds = /* @__PURE__ */ new Set(), this._saveTimer = null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: "CSI Toolkit Case Board",
        template: `modules/${b}/templates/case-board.hbs`,
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
      const n = p(this.caseId), o = this.playerMode ? "Player Board" : "GM Board";
      return n ? `${n.title} - ${o}` : `CSI Toolkit - ${o}`;
    }
    async getData() {
      return Y(this.caseId, { playerMode: this.playerMode, layoutOverride: this._localLayout });
    }
    activateListeners(n) {
      super.activateListeners(n), n.find("[data-action='open-manager']").on("click", () => V()), n.find("[data-action='refresh-board']").on("click", () => this._reloadSharedBoard()), n.find("[data-action='publish-layout']").on("click", () => this._publishLayout()), n.find("[data-action='zoom-in']").on("click", () => this._zoomBy(0.1)), n.find("[data-action='zoom-out']").on("click", () => this._zoomBy(-0.1)), n.find("[data-action='context-add-board-item']").on("click", (c) => this._addBoardItemFromContext(c)), n.find("[data-action='edit-card']").on("click", (c) => this._editCard(c.currentTarget.dataset.collection, c.currentTarget.dataset.itemId)), n.find("[data-action='delete-board-item']").on("click", (c) => this._deleteBoardItem(c.currentTarget.dataset.collection, c.currentTarget.dataset.itemId)), n.find("[data-action='move-timeline-item']").on("click", (c) => this._moveTimelineItem(c.currentTarget.dataset.itemId, c.currentTarget.dataset.direction)), n.find("[data-csi-connection-hit]").on("dblclick", (c) => this._editCard("connections", c.currentTarget.dataset.connectionId)), n.find("[data-action='start-connection']").on("click", (c) => this._startConnection(c)), n.find("[data-csi-dim-kind]").on("change", (c) => this._toggleDimKind(c.currentTarget));
      const o = n[0].querySelector("[data-csi-board-viewport]");
      o && (o.addEventListener("wheel", (c) => this._onWheel(c), { passive: !1 }), o.addEventListener("mousedown", (c) => this._onViewportMouseDown(c)), o.addEventListener("contextmenu", (c) => this._openContextMenu(c))), n.find("[data-csi-board-card]").on("mousedown", (c) => this._onCardMouseDown(c)), n.find("[data-csi-board-card]").on("click", (c) => this._completeConnection(c)), n.find(".csi-card-image").on("load", () => this._queueConnectionLineUpdate()), this._syncDimControls(), this._applyDimmedKinds(), this._queueConnectionLineUpdate();
    }
    _onCardMouseDown(n) {
      if (!E(this.caseId) || n.button !== 0 || n.target.closest("button")) return;
      const o = n.currentTarget, c = this._getView(), h = this._getLayout(), y = o.dataset.itemId, _ = h.cards[y] ?? { x: Number(o.dataset.x) || 0, y: Number(o.dataset.y) || 0 };
      n.preventDefault(), this._drag = {
        itemId: y,
        card: o,
        startClientX: n.clientX,
        startClientY: n.clientY,
        startX: _.x,
        startY: _.y,
        scale: c.scale,
        x: _.x,
        y: _.y,
        frame: null,
        cards: this._getBoardCardMap(),
        connectionGroups: this._getConnectionGroupsForItem(y)
      }, document.addEventListener("mousemove", this._boundDragMove = (H) => this._onCardDrag(H)), document.addEventListener("mouseup", this._boundDragEnd = () => this._endDrag());
    }
    _onCardDrag(n) {
      if (!this._drag) return;
      const o = Math.round(this._drag.startX + (n.clientX - this._drag.startClientX) / this._drag.scale), c = Math.round(this._drag.startY + (n.clientY - this._drag.startClientY) / this._drag.scale);
      this._drag.x = o, this._drag.y = c, !this._drag.frame && (this._drag.frame = globalThis.requestAnimationFrame ? globalThis.requestAnimationFrame(() => this._flushCardDrag()) : globalThis.setTimeout(() => this._flushCardDrag(), 0));
    }
    _flushCardDrag() {
      this._drag && (this._drag.frame = null, this._applyCardDragPosition(this._drag.x, this._drag.y), this._updateConnectionLines(this._drag.connectionGroups, this._drag.cards));
    }
    _applyCardDragPosition(n, o) {
      this._drag && (this._drag.card.style.left = `${n}px`, this._drag.card.style.top = `${o}px`, this._drag.card.dataset.x = n, this._drag.card.dataset.y = o);
    }
    _endDrag() {
      var o;
      if (!this._drag) return;
      document.removeEventListener("mousemove", this._boundDragMove), document.removeEventListener("mouseup", this._boundDragEnd), this._drag.frame && (globalThis.cancelAnimationFrame ? globalThis.cancelAnimationFrame(this._drag.frame) : (o = globalThis.clearTimeout) == null || o.call(globalThis, this._drag.frame), this._drag.frame = null), this._applyCardDragPosition(this._drag.x, this._drag.y), this._updateConnectionLines(this._drag.connectionGroups, this._drag.cards);
      const n = this._getLayout();
      n.cards[this._drag.itemId] = {
        ...n.cards[this._drag.itemId] ?? {},
        x: Number(this._drag.card.dataset.x),
        y: Number(this._drag.card.dataset.y)
      }, this._drag = null, this._saveLayout(n);
    }
    _onViewportMouseDown(n) {
      if (n.button !== 0 || n.target.closest("[data-csi-board-card], [data-csi-context-menu], [data-csi-connection-hit], button")) return;
      this._hideContextMenu();
      const o = this._getView();
      n.preventDefault(), this._pan = {
        startClientX: n.clientX,
        startClientY: n.clientY,
        startX: o.x,
        startY: o.y
      }, document.addEventListener("mousemove", this._boundPanMove = (c) => this._onPan(c)), document.addEventListener("mouseup", this._boundPanEnd = () => this._endPan());
    }
    _onPan(n) {
      if (!this._pan) return;
      const o = this._getLayout();
      o.view.x = Math.round(this._pan.startX + n.clientX - this._pan.startClientX), o.view.y = Math.round(this._pan.startY + n.clientY - this._pan.startClientY), this._layoutDraft = o, this._applyView(o.view);
    }
    _endPan() {
      if (!this._pan) return;
      document.removeEventListener("mousemove", this._boundPanMove), document.removeEventListener("mouseup", this._boundPanEnd);
      const n = this._layoutDraft ?? this._getLayout();
      this._pan = null, this._saveLayout(n), this._layoutDraft = null;
    }
    _onWheel(n) {
      n.preventDefault(), this._hideContextMenu(), this._zoomBy(n.deltaY > 0 ? -0.08 : 0.08);
    }
    _zoomBy(n) {
      const o = this._getLayout();
      o.view.scale = ie(Number(o.view.scale) + n, 0.45, 1.8), this._applyView(o.view), this._saveLayout(o);
    }
    _applyView(n) {
      var h, y;
      const o = (h = this.element[0]) == null ? void 0 : h.querySelector("[data-csi-board-canvas]");
      if (!o) return;
      o.style.transform = `translate(${n.x}px, ${n.y}px) scale(${n.scale})`;
      const c = (y = this.element[0]) == null ? void 0 : y.querySelector("[data-csi-zoom]");
      c && (c.textContent = `${Math.round(n.scale * 100)}%`);
    }
    _getView() {
      return this._getLayout().view;
    }
    _getLayout() {
      const n = p(this.caseId);
      return F(this._layoutDraft ?? this._localLayout ?? (n == null ? void 0 : n.boardLayout));
    }
    async _saveLayout(n) {
      this._localLayout = F(n);
    }
    async _publishLayout() {
      var o;
      if (!E(this.caseId)) return;
      const n = this._getLayout();
      if ((o = game.user) != null && o.isGM) {
        await j(this.caseId, n);
        return;
      }
      await B(this.caseId, n);
    }
    _reloadSharedBoard() {
      this._localLayout = null, this._layoutDraft = null, this.render(!0);
    }
    _getBoardCardMap() {
      const n = this.element[0];
      return n ? new Map(Array.from(n.querySelectorAll("[data-csi-board-card]")).map((o) => [o.dataset.itemId, o])) : /* @__PURE__ */ new Map();
    }
    _getConnectionGroupsForItem(n) {
      const o = this.element[0];
      return !o || !n ? [] : Array.from(o.querySelectorAll("[data-csi-connection-group]")).filter((c) => c.dataset.fromId === n || c.dataset.toId === n);
    }
    _updateConnectionLines(n = null, o = null) {
      const c = this.element[0];
      if (!c) return;
      const h = o ?? this._getBoardCardMap(), y = n ?? Array.from(c.querySelectorAll("[data-csi-connection-group]"));
      for (const _ of y) {
        const H = h.get(_.dataset.fromId), P = h.get(_.dataset.toId);
        if (!H || !P) continue;
        const A = this._getCardBoardRect(H), Z = this._getCardBoardRect(P), z = m(A, Z), R = m(Z, A);
        if (!g(z) || !g(R)) continue;
        for (const X of _.querySelectorAll("[data-csi-connection-line], [data-csi-connection-hit]"))
          X.setAttribute("x1", z.x), X.setAttribute("y1", z.y), X.setAttribute("x2", R.x), X.setAttribute("y2", R.y);
        const K = _.querySelector("[data-csi-connection-label]");
        K && (K.setAttribute("x", Math.round((z.x + R.x) / 2)), K.setAttribute("y", Math.round((z.y + R.y) / 2 - 10)));
      }
    }
    _queueConnectionLineUpdate() {
      const n = () => this._updateConnectionLines();
      globalThis.requestAnimationFrame ? globalThis.requestAnimationFrame(n) : globalThis.setTimeout(n, 0);
    }
    _getCardBoardRect(n) {
      const o = Number(n.dataset.x) || Number.parseFloat(n.style.left) || 0, c = Number(n.dataset.y) || Number.parseFloat(n.style.top) || 0, h = n.offsetWidth || 220, y = n.offsetHeight || 246;
      return {
        x: o,
        y: c,
        width: h,
        height: y,
        centerX: o + h / 2,
        centerY: c + y / 2
      };
    }
    _editCard(n, o) {
      E(this.caseId) && new N(this.caseId, n, o).render(!0);
    }
    async _deleteBoardItem(n, o) {
      !E(this.caseId) || !xe.includes(n) || !o || await G(this.caseId, n, o);
    }
    async _moveTimelineItem(n, o) {
      var P;
      if (!E(this.caseId) || !n) return;
      const c = p(this.caseId), h = ((P = c == null ? void 0 : c.timeline) == null ? void 0 : P.findIndex((A) => A.id === n)) ?? -1, _ = h + (o === "up" ? -1 : o === "down" ? 1 : 0);
      if (!c || h < 0 || _ < 0 || _ >= c.timeline.length) return;
      const [H] = c.timeline.splice(h, 1);
      c.timeline.splice(_, 0, H), await U(c);
    }
    _toggleDimKind(n) {
      const o = n == null ? void 0 : n.value;
      ["evidence", "suspects", "locations", "timeline"].includes(o) && (n.checked ? this._dimmedKinds.add(o) : this._dimmedKinds.delete(o), this._applyDimmedKinds());
    }
    _syncDimControls() {
      var n;
      for (const o of ((n = this.element[0]) == null ? void 0 : n.querySelectorAll("[data-csi-dim-kind]")) ?? [])
        o.checked = this._dimmedKinds.has(o.value);
    }
    _applyDimmedKinds() {
      const n = this.element[0];
      if (n) {
        for (const o of n.querySelectorAll("[data-csi-board-card]"))
          o.classList.toggle("is-type-dimmed", this._dimmedKinds.has(o.dataset.collection));
        for (const o of n.querySelectorAll("[data-csi-timeline-row]"))
          o.classList.toggle("is-type-dimmed", this._dimmedKinds.has(o.dataset.collection));
      }
    }
    _addBoardItemFromContext(n) {
      n.preventDefault(), n.stopPropagation();
      const o = n.currentTarget.dataset.collection;
      this._addBoardItem(o, this._contextBoardPosition), this._hideContextMenu();
    }
    _addBoardItem(n = "evidence", o = null) {
      E(this.caseId) && ke.includes(n) && new N(this.caseId, n, null, { boardPosition: o }).render(!0);
    }
    _openContextMenu(n) {
      var P, A;
      if (!E(this.caseId) || n.target.closest("[data-csi-board-card], button, input, select, textarea")) return;
      const o = (P = this.element[0]) == null ? void 0 : P.querySelector("[data-csi-context-menu]"), c = (A = this.element[0]) == null ? void 0 : A.querySelector("[data-csi-board-viewport]");
      if (!o || !c) return;
      n.preventDefault(), n.stopPropagation(), this._contextBoardPosition = this._clientToBoardPosition(n.clientX, n.clientY), o.hidden = !1;
      const h = o.offsetWidth || 156, y = o.offsetHeight || 180, _ = Math.max(4, globalThis.innerWidth - h - 4), H = Math.max(4, globalThis.innerHeight - y - 4);
      o.style.left = `${ie(n.clientX, 4, _)}px`, o.style.top = `${ie(n.clientY, 4, H)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu() {
      var o;
      const n = (o = this.element[0]) == null ? void 0 : o.querySelector("[data-csi-context-menu]");
      n && (n.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    _clientToBoardPosition(n, o) {
      var _;
      const c = (_ = this.element[0]) == null ? void 0 : _.querySelector("[data-csi-board-viewport]"), h = c == null ? void 0 : c.getBoundingClientRect(), y = this._getView();
      return h ? {
        x: Math.round((n - h.left - y.x) / y.scale - 220 / 2),
        y: Math.round((o - h.top - y.y) / y.scale - 32)
      } : null;
    }
    _startConnection(n) {
      var h;
      if (n.preventDefault(), n.stopPropagation(), !E(this.caseId)) return;
      const c = n.currentTarget.dataset.itemId;
      if (c) {
        this._pendingConnection = { fromId: c };
        for (const y of this.element[0].querySelectorAll("[data-csi-board-card]")) y.classList.toggle("is-link-source", y.dataset.itemId === c);
        (h = ui.notifications) == null || h.info(`${q}: Select another card to create a connection.`);
      }
    }
    async _completeConnection(n) {
      if (!this._pendingConnection || n.target.closest("button, input, select, textarea") || !E(this.caseId)) return;
      const o = n.currentTarget.dataset.itemId, c = this._pendingConnection.fromId;
      this._pendingConnection = null;
      for (const _ of this.element[0].querySelectorAll("[data-csi-board-card]")) _.classList.remove("is-link-source");
      if (!o || o === c) return;
      const h = p(this.caseId);
      if (!h) return;
      const y = ne({
        id: D(),
        fromId: c,
        toId: o,
        label: "linked to",
        type: "link",
        style: "solid",
        color: "cyan",
        visibility: "players"
      });
      h.connections.push(y), await U(h), new N(this.caseId, "connections", y.id).render(!0);
    }
    async close(n = {}) {
      return this._hideContextMenu(), f(this), super.close(n);
    }
  };
}
function ze(s) {
  const {
    LegacyApplication: l,
    moduleId: b,
    moduleTitle: q,
    singularLabel: N,
    getItemTitle: p,
    getCase: Y,
    buildItemChoices: V,
    parseItemElement: E,
    saveCase: j,
    deleteBoardItem: B,
    defaultBoardPosition: G
  } = s;
  return class extends l {
    constructor(m, g, f, I = {}) {
      super(I);
      S(this, "caseId");
      S(this, "collection");
      S(this, "itemId");
      S(this, "isNew");
      S(this, "boardPosition");
      this.caseId = m, this.collection = g, this.itemId = f || D(), this.isNew = !f, this.boardPosition = I.boardPosition ? {
        x: Number(I.boardPosition.x) || 0,
        y: Number(I.boardPosition.y) || 0
      } : null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: "Edit CSI Board Card",
        template: `modules/${b}/templates/board-item-editor.hbs`,
        classes: ["csi-toolkit", "csi-board-item-editor"],
        width: 560,
        height: 520,
        resizable: !0
      });
    }
    get title() {
      const m = this._getItem();
      return this.isNew ? `Add ${N(this.collection)}` : m ? `Edit ${p(m, this.collection)}` : "Edit CSI Board Card";
    }
    async getData() {
      var f;
      const m = Y(this.caseId), g = this._getItem();
      return {
        caseId: this.caseId,
        collection: this.collection,
        item: g,
        isNew: this.isNew,
        itemChoices: m ? V(m, !((f = game.user) != null && f.isGM)) : [],
        isEvidence: this.collection === "evidence",
        isSuspect: this.collection === "suspects",
        isLocation: this.collection === "locations",
        isTimeline: this.collection === "timeline",
        isConnection: this.collection === "connections",
        options: {
          evidenceTypes: re,
          evidenceStatuses: ce,
          suspectStatuses: le,
          connectionTypes: de,
          connectionStyles: ue,
          connectionColors: me
        }
      };
    }
    activateListeners(m) {
      var I, L;
      super.activateListeners(m);
      const g = m[0], f = (I = g == null ? void 0 : g.matches) != null && I.call(g, "[data-csi-board-item-form]") ? g : (L = g == null ? void 0 : g.querySelector) == null ? void 0 : L.call(g, "[data-csi-board-item-form]");
      f && f.addEventListener("submit", (n) => this._save(n)), m.find("[data-action='pick-image']").on("click", (n) => this._pickImage(n.currentTarget)), m.find("[data-action='delete-board-item']").on("click", (n) => this._delete(n));
    }
    _getItem() {
      var f;
      const m = Y(this.caseId), g = (f = m == null ? void 0 : m[this.collection]) == null ? void 0 : f.find((I) => I.id === this.itemId);
      return g || (this.isNew ? Ge(this.collection, "players", this.itemId) : null);
    }
    async _save(m) {
      var n, o, c;
      m.preventDefault(), m.stopPropagation(), (n = m.stopImmediatePropagation) == null || n.call(m);
      const g = m.currentTarget, f = Y(this.caseId);
      if (!f)
        return (o = ui.notifications) == null || o.warn(`${q}: The case could not be found.`), !1;
      const I = f[this.collection].findIndex((h) => h.id === this.itemId);
      if (I < 0 && !this.isNew)
        return (c = ui.notifications) == null || c.warn(`${q}: The item could not be found.`), !1;
      const L = E(this.collection, g);
      return L.id = this.itemId, L.visibility = "players", L.hidden = I >= 0 ? !!f[this.collection][I].hidden : !1, I >= 0 ? f[this.collection][I] = L : f[this.collection].push(L), this.isNew && this.collection !== "connections" && (f.boardLayout.cards[this.itemId] = this.boardPosition ?? G(f.evidence.length + f.suspects.length + f.locations.length + f.timeline.length)), await j(f), this.close(), !1;
    }
    async _delete(m) {
      var f;
      return m.preventDefault(), m.stopPropagation(), (f = m.stopImmediatePropagation) == null || f.call(m), this.isNew || await B(this.caseId, this.collection, this.itemId, { confirm: !0 }) && this.close(), !1;
    }
    _pickImage(m) {
      var I, L, n, o;
      const g = (I = m.closest(".csi-image-field")) == null ? void 0 : I.querySelector("input"), f = globalThis.FilePicker ?? ((o = (n = (L = globalThis.foundry) == null ? void 0 : L.applications) == null ? void 0 : n.apps) == null ? void 0 : o.FilePicker);
      !g || !f || new f({
        type: "image",
        current: g.value,
        callback: (c) => {
          g.value = c, g.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).render(!0);
    }
  };
}
(() => {
  var we, Se;
  const s = "csi-toolkit", l = "CSI Toolkit", b = `module.${s}`, q = [
    `modules/${s}/templates/case-manager.hbs`,
    `modules/${s}/templates/case-browser.hbs`,
    `modules/${s}/templates/case-board.hbs`,
    `modules/${s}/templates/item-card.hbs`,
    `modules/${s}/templates/board-item-editor.hbs`
  ], N = globalThis.Application ?? ((Se = (we = foundry.appv1) == null ? void 0 : we.api) == null ? void 0 : Se.Application), p = {
    manager: null,
    browser: null,
    boards: /* @__PURE__ */ new Map(),
    playerBoard: null
  };
  Hooks.once("init", async () => {
    Y(), V(), await loadTemplates(q), console.log(`${l} | Initialized`);
  }), Hooks.once("ready", () => {
    game.csiToolkit = E();
    const e = game.modules.get(s);
    e && (e.api = game.csiToolkit), j(), game.socket.on(b, Z), console.log(`${l} | API available at game.csiToolkit`);
  });
  function Y() {
    game.settings.register(s, "cases", {
      name: "CSI Toolkit Cases",
      hint: "Stores all investigation cases for this world.",
      scope: "world",
      config: !1,
      type: Object,
      default: {}
    });
  }
  function V() {
    Handlebars.registerHelper("csiEq", (e, t) => e === t), Handlebars.registerHelper("csiLabel", (e) => oe(e)), Handlebars.registerHelper("csiCount", (e) => Array.isArray(e) ? e.length : 0), Handlebars.registerHelper("csiFallback", (e, t) => e || t), Handlebars.registerHelper("csiJoin", (e) => Array.isArray(e) ? e.join(", ") : ""), Handlebars.registerHelper("csiOption", (e, t) => e === t ? "selected" : ""), Handlebars.registerHelper("csiChecked", (e) => e === "players" ? "checked" : "");
  }
  function E() {
    return {
      openCaseBoard: (e, t = {}) => _(e, t),
      openCaseManager: () => h(),
      openCaseBrowser: () => y(),
      createCase: (e) => f(e),
      getCases: () => B(),
      exportCase: (e) => c(e),
      importCase: (e) => o(e)
    };
  }
  function j() {
    const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
    return t != null && t.registerApp ? (t.registerApp({
      id: s,
      title: "CSI Toolkit",
      icon: "fa-solid fa-fingerprint",
      premium: !1,
      featureId: s,
      description: "Open case files, evidence boards, and investigation tools.",
      open: () => {
        var i;
        return (i = game.user) != null && i.isGM ? h() : y();
      }
    }), !0) : !1;
  }
  function B() {
    return _e(game.settings.get(s, "cases") ?? {});
  }
  async function G(e) {
    return game.settings.set(s, "cases", e ?? {});
  }
  function U() {
    var t;
    return (((t = game.users) == null ? void 0 : t.contents) ?? Array.from(game.users ?? [])).some((i) => (i == null ? void 0 : i.isGM) && (i == null ? void 0 : i.active));
  }
  function k(e) {
    const t = B();
    return t[e] ? O(t[e]) : null;
  }
  async function m(e, { notify: t = !0, render: i = !0, updateReason: a = null, userName: r = null } = {}) {
    var C;
    const u = O(e);
    if (!((C = game.user) != null && C.isGM)) return g(u, { notify: t, render: i });
    const d = B();
    return d[u.id] = u, await G(d), t && A(u.id, { reason: a, userName: r }), i && te(u.id), u;
  }
  async function g(e, { render: t = !0, notify: i = !0 } = {}) {
    var a, r, u, d, C, T;
    return (a = game.socket) != null && a.emit ? U() ? (game.socket.emit(b, {
      type: "save-case-request",
      caseData: e,
      userId: (d = game.user) == null ? void 0 : d.id,
      userName: (C = game.user) == null ? void 0 : C.name
    }), i && ((T = ui.notifications) == null || T.info(`${l}: Board update sent to the GM.`)), e) : ((u = ui.notifications) == null || u.warn(`${l}: No active GM is connected to save board changes.`), e) : ((r = ui.notifications) == null || r.warn(`${l}: A GM must be connected to save board changes.`), e);
  }
  async function f(e = {}) {
    var a;
    const t = O(e, { forceNewId: !e.id }), i = B();
    return i[t.id] = t, await G(i), A(t.id), (a = ui.notifications) == null || a.info(`${l}: Created case "${t.title}".`), t;
  }
  async function I(e) {
    var a;
    const t = B(), i = t[e];
    return i ? (delete t[e], await G(t), Ae(e), A(e), (a = ui.notifications) == null || a.info(`${l}: Deleted case "${i.title}".`), !0) : !1;
  }
  async function L(e, t, i, { confirm: a = !0 } = {}) {
    var C, T;
    if (!xe.includes(t) || !i) return !1;
    const r = k(e);
    if (!r) return !1;
    const u = (C = r[t]) == null ? void 0 : C.find((v) => v.id === i);
    if (!u) return !1;
    const d = Ce(u, t);
    return a && !await Ie({
      title: `Delete ${oe(ae(t))}`,
      content: `<p>Delete <strong>${ve(d)}</strong>?${t === "connections" ? "" : " Any attached connections will also be deleted."}</p>`,
      yes: () => !0,
      no: () => !1,
      defaultYes: !1
    }) ? !1 : (r[t] = r[t].filter((v) => v.id !== i), t !== "connections" && (r.connections = r.connections.filter((v) => v.fromId !== i && v.toId !== i), r.timeline = r.timeline.map((v) => ({
      ...v,
      linkedItemIds: (v.linkedItemIds ?? []).filter((w) => w !== i)
    })), delete r.boardLayout.cards[i]), await m(r), (T = ui.notifications) == null || T.info(`${l}: Deleted "${d}".`), !0);
  }
  async function n(e) {
    var r;
    const t = k(e);
    if (!t) return null;
    const i = O({
      ...t,
      id: D(),
      title: `${t.title} Copy`
    }), a = B();
    return a[i.id] = i, await G(a), A(i.id), (r = ui.notifications) == null || r.info(`${l}: Duplicated case "${t.title}".`), i;
  }
  async function o(e) {
    var a;
    const t = O({
      ...e,
      id: e.id || D()
    }), i = B();
    return i[t.id] && (t.id = D()), i[t.id] = t, await G(i), A(t.id), (a = ui.notifications) == null || a.info(`${l}: Imported case "${t.title}".`), t;
  }
  function c(e) {
    const t = k(e);
    if (!t) return !1;
    const i = new Blob([JSON.stringify(t, null, 2)], { type: "application/json" }), a = URL.createObjectURL(i), r = document.createElement("a");
    return r.href = a, r.download = `${Ne(t.title)}.json`, r.click(), URL.revokeObjectURL(a), !0;
  }
  function h() {
    var e;
    return (e = game.user) != null && e.isGM ? (p.manager || (p.manager = new X()), p.manager.render(!0), p.manager) : y();
  }
  function y() {
    return p.browser || (p.browser = new K()), p.browser.render(!0), p.browser;
  }
  function _(e, t = {}) {
    var C, T, v;
    if (!e)
      return (C = ui.notifications) == null || C.warn(`${l}: No case id provided.`), null;
    if (!k(e))
      return (T = ui.notifications) == null || T.warn(`${l}: Case "${e}" was not found.`), null;
    const a = t.playerMode ?? !((v = game.user) != null && v.isGM), r = `${e}:${a ? "player" : "gm"}`, u = p.boards.get(r);
    if (u)
      return u.render(!0), u;
    const d = new R(e, { playerMode: a });
    return p.boards.set(r, d), d.render(!0), d;
  }
  async function H(e, t) {
    var a, r, u, d, C, T;
    const i = F(t);
    return (a = game.socket) != null && a.emit ? U() ? (game.socket.emit(b, {
      type: "publish-layout-request",
      caseId: e,
      boardLayout: i,
      userId: (d = game.user) == null ? void 0 : d.id,
      userName: (C = game.user) == null ? void 0 : C.name
    }), (T = ui.notifications) == null || T.info(`${l}: Layout publish request sent to the GM.`), !0) : ((u = ui.notifications) == null || u.warn(`${l}: No active GM is connected to publish the board layout.`), !1) : ((r = ui.notifications) == null || r.warn(`${l}: A GM must be connected to publish the board layout.`), !1);
  }
  async function P(e, t, { userId: i = ((r) => (r = game.user) == null ? void 0 : r.id)(), userName: a = ((u) => (u = game.user) == null ? void 0 : u.name)() } = {}) {
    var v;
    const d = k(e);
    if (!d) return !1;
    const C = F(d.boardLayout), T = F(t);
    return d.boardLayout = F({
      ...C,
      cards: T.cards
    }), await m(d, {
      render: !1,
      updateReason: "layout-published",
      userName: a
    }), te(e, { resetLayout: !0 }), (v = ui.notifications) == null || v.info(`${l}: Published shared board layout${a ? ` from ${a}` : ""}.`), !0;
  }
  function A(e, { reason: t = null, userName: i = null } = {}) {
    var a, r;
    (r = game.socket) == null || r.emit(b, { type: "case-updated", caseId: e, reason: t, userName: i, userId: (a = game.user) == null ? void 0 : a.id });
  }
  function Z(e) {
    var t, i, a, r;
    if (e) {
      if (e.type === "save-case-request") {
        if (!((t = game.user) != null && t.isGM) || !e.caseData) return;
        m(e.caseData, { render: !1 }).then((u) => {
          var d;
          u && (te(u.id), (d = ui.notifications) == null || d.info(`${l}: Saved player board update from ${e.userName ?? "a player"}.`));
        }).catch((u) => {
          var d;
          console.error(`${l} | Could not save player board update`, u), (d = ui.notifications) == null || d.error(`${l}: Player board update could not be saved.`);
        });
        return;
      }
      if (e.type === "publish-layout-request") {
        if (!((i = game.user) != null && i.isGM) || !e.caseId || !e.boardLayout) return;
        P(e.caseId, e.boardLayout, {
          userId: e.userId,
          userName: e.userName
        }).catch((u) => {
          var d;
          console.error(`${l} | Could not publish player layout`, u), (d = ui.notifications) == null || d.error(`${l}: Player layout could not be published.`);
        });
        return;
      }
      if (e.type === "case-updated" && e.caseId) {
        if (e.userId && e.userId === ((a = game.user) == null ? void 0 : a.id)) return;
        te(e.caseId, { resetLayout: e.reason === "layout-published" }), e.reason === "layout-published" && ((r = ui.notifications) == null || r.info(`${l}: ${e.userName ?? "Someone"} published a shared board layout.`));
        return;
      }
    }
  }
  const z = ze({
    LegacyApplication: N,
    moduleId: s,
    moduleTitle: l,
    singularLabel: ae,
    getItemTitle: Ce,
    getCase: k,
    buildItemChoices: ye,
    parseItemElement: $e,
    saveCase: m,
    deleteBoardItem: L,
    defaultBoardPosition: se
  }), R = Ye({
    LegacyApplication: N,
    moduleId: s,
    moduleTitle: l,
    CSIBoardItemEditor: z,
    getCase: k,
    prepareBoardData: De,
    openCaseManager: h,
    canUserEditBoard: be,
    publishSharedLayout: P,
    requestLayoutPublish: H,
    deleteBoardItem: L,
    saveCase: m,
    defaultBoardPosition: se,
    getRectEdgeAnchor: Pe,
    isFinitePoint: Oe,
    clearBoardApp: (e) => {
      p.boards.delete(`${e.caseId}:${e.playerMode ? "player" : "gm"}`), p.playerBoard === e && (p.playerBoard = null);
    }
  });
  class K extends N {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "csi-case-browser",
        title: "CSI Toolkit Case Files",
        template: `modules/${s}/templates/case-browser.hbs`,
        classes: ["csi-toolkit", "csi-case-browser"],
        width: 520,
        height: 620,
        resizable: !0
      });
    }
    async getData() {
      var i;
      return {
        cases: Object.values(B()).map((a) => O(a)).sort((a, r) => a.title.localeCompare(r.title)),
        isGM: (i = game.user) == null ? void 0 : i.isGM,
        canContribute: Be()
      };
    }
    activateListeners(t) {
      super.activateListeners(t), t.find("[data-action='open-board']").on("click", (i) => {
        var a;
        _(i.currentTarget.dataset.caseId, { playerMode: !((a = game.user) != null && a.isGM) });
      }), t.find("[data-action='open-manager']").on("click", () => h());
    }
    async close(t = {}) {
      return p.browser = null, super.close(t);
    }
  }
  class X extends N {
    constructor(t = {}) {
      super(t), this.selectedCaseId = t.caseId ?? null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "csi-case-manager",
        title: "CSI Toolkit Case Manager",
        template: `modules/${s}/templates/case-manager.hbs`,
        classes: ["csi-toolkit", "csi-case-manager"],
        width: 1180,
        height: 820,
        resizable: !0
      });
    }
    async getData() {
      var u;
      const t = B(), i = Object.values(t).map((d) => O(d)).sort((d, C) => d.title.localeCompare(C.title));
      !this.selectedCaseId && i.length && (this.selectedCaseId = i[0].id), this.selectedCaseId && !t[this.selectedCaseId] && (this.selectedCaseId = ((u = i[0]) == null ? void 0 : u.id) ?? null);
      const a = this.selectedCaseId ? O(t[this.selectedCaseId]) : null, r = a ? ye(a) : [];
      return {
        cases: i,
        selected: a,
        itemChoices: r,
        options: {
          caseStatuses: Te,
          themes: Le,
          evidenceTypes: re,
          evidenceStatuses: ce,
          suspectStatuses: le,
          connectionTypes: de,
          connectionStyles: ue,
          connectionColors: me
        }
      };
    }
    activateListeners(t) {
      super.activateListeners(t), t.find("[data-action='select-case']").on("click", (i) => {
        this.selectedCaseId = i.currentTarget.dataset.caseId, this.render(!1);
      }), t.find("[data-action='new-case']").on("click", () => this._createNewCase()), t.find("[data-csi-case-form]").on("submit", (i) => this._saveSelectedCase(i)), t.find("[data-action='save-case']").on("click", (i) => this._saveSelectedCase(i)), t.find("[data-action='delete-case']").on("click", () => this._deleteSelectedCase()), t.find("[data-action='duplicate-case']").on("click", () => this._duplicateSelectedCase()), t.find("[data-action='open-board']").on("click", () => _(this.selectedCaseId)), t.find("[data-action='pick-image']").on("click", (i) => this._pickImage(i.currentTarget)), t.find("[data-action='export-case']").on("click", () => c(this.selectedCaseId)), t.find("[data-action='import-case']").on("click", () => {
        var i;
        return (i = this.element[0].querySelector("[data-csi-import-file]")) == null ? void 0 : i.click();
      }), t.find("[data-csi-import-file]").on("change", (i) => this._importFromFile(i.currentTarget));
    }
    _readCurrentCase() {
      const t = this.element[0].querySelector("[data-csi-case-form]");
      return t ? Me(t, this.selectedCaseId) : k(this.selectedCaseId);
    }
    async _createNewCase() {
      const t = await f({
        title: "New Investigation",
        subtitle: "Unfiled case",
        description: "Describe the incident, victim, premise, or central mystery.",
        visibility: "players"
      });
      this.selectedCaseId = t.id, this.render(!1);
    }
    async _saveSelectedCase(t) {
      var i, a;
      if (t.preventDefault(), !!this.selectedCaseId)
        try {
          const r = this._readCurrentCase();
          await m(r), this.selectedCaseId = r.id, (i = ui.notifications) == null || i.info(`${l}: Saved case "${r.title}".`), this.render(!1);
        } catch (r) {
          console.error(`${l} | Could not save case`, r), (a = ui.notifications) == null || a.error(`${l}: ${r.message}`);
        }
    }
    async _deleteSelectedCase() {
      if (!this.selectedCaseId) return;
      const t = k(this.selectedCaseId);
      !t || !await Ie({
        title: "Delete CSI Case",
        content: `<p>Delete <strong>${ve(t.title)}</strong>? This cannot be undone.</p>`,
        yes: () => !0,
        no: () => !1,
        defaultYes: !1
      }) || (await I(this.selectedCaseId), this.selectedCaseId = null, this.render(!1));
    }
    async _duplicateSelectedCase() {
      if (!this.selectedCaseId) return;
      const t = await n(this.selectedCaseId);
      t && (this.selectedCaseId = t.id, this.render(!1));
    }
    _pickImage(t) {
      var r, u, d, C, T;
      const i = (r = t.closest(".csi-image-field")) == null ? void 0 : r.querySelector("input");
      if (!i) return;
      const a = globalThis.FilePicker ?? ((C = (d = (u = globalThis.foundry) == null ? void 0 : u.applications) == null ? void 0 : d.apps) == null ? void 0 : C.FilePicker);
      if (!a) {
        (T = ui.notifications) == null || T.warn(`${l}: Foundry FilePicker is unavailable.`);
        return;
      }
      new a({
        type: "image",
        current: i.value,
        callback: (v) => {
          i.value = v, i.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).render(!0);
    }
    async _importFromFile(t) {
      var a, r;
      const i = (a = t.files) == null ? void 0 : a[0];
      if (i)
        try {
          const u = await i.text(), d = await o(JSON.parse(u));
          this.selectedCaseId = d.id, this.render(!1);
        } catch (u) {
          console.error(`${l} | Import failed`, u), (r = ui.notifications) == null || r.error(`${l}: Import failed. ${u.message}`);
        } finally {
          t.value = "";
        }
    }
    async close(t = {}) {
      return p.manager = null, super.close(t);
    }
  }
  function Me(e, t) {
    const i = new FormData(e), a = k(t) ?? O({ id: t }), r = O({
      id: t,
      title: i.get("title"),
      subtitle: i.get("subtitle"),
      status: i.get("status"),
      description: i.get("description"),
      image: i.get("image"),
      visibility: "players",
      evidence: a.evidence,
      suspects: a.suspects,
      locations: a.locations,
      timeline: a.timeline,
      connections: a.connections,
      boardLayout: {
        ...a.boardLayout,
        theme: i.get("theme")
      }
    });
    return O(r);
  }
  function $e(e, t) {
    const i = (u) => {
      var d;
      return ((d = t.querySelector(`[name="${u}"]`)) == null ? void 0 : d.value) ?? "";
    }, a = "players", r = { id: t.dataset.itemId || D(), visibility: a };
    return e === "evidence" ? fe({
      ...r,
      title: i("title"),
      type: i("type"),
      status: i("status"),
      description: i("description"),
      image: i("image"),
      notes: i("notes")
    }) : e === "suspects" ? he({
      ...r,
      name: i("name"),
      alias: i("alias"),
      status: i("status"),
      motive: i("motive"),
      alibi: i("alibi"),
      image: i("image"),
      notes: i("notes")
    }) : e === "locations" ? pe({
      ...r,
      name: i("name"),
      sceneId: i("sceneId"),
      image: i("image"),
      description: i("description"),
      notes: i("notes")
    }) : e === "timeline" ? ge({
      ...r,
      time: i("time"),
      title: i("title"),
      description: i("description"),
      linkedItemIds: i("linkedItemIds").split(",").map((u) => u.trim()).filter(Boolean)
    }) : ne({
      id: r.id,
      visibility: a,
      fromId: i("fromId"),
      toId: i("toId"),
      label: i("label"),
      type: i("type"),
      style: i("style"),
      color: i("color")
    });
  }
  function De(e, { playerMode: t = !1, layoutOverride: i = null } = {}) {
    var T, v;
    const a = k(e);
    if (!a) return { isMissing: !0, playerMode: t, isGM: (T = game.user) == null ? void 0 : T.isGM };
    const r = _e(a);
    i && (r.boardLayout = F(i)), r.evidence = J(r.evidence), r.suspects = J(r.suspects), r.locations = J(r.locations), r.timeline = J(r.timeline);
    const u = Ee(r), d = new Map(u.map((w) => [w.id, w]));
    r.timeline = r.timeline.map((w) => ({
      ...w,
      linkedLabels: (w.linkedItemIds ?? []).map((M) => {
        var x;
        return (x = d.get(M)) == null ? void 0 : x.label;
      }).filter(Boolean)
    }));
    const C = J(r.connections).map((w) => {
      const M = d.get(w.fromId), x = d.get(w.toId);
      return {
        ...w,
        fromLabel: (M == null ? void 0 : M.label) ?? w.fromId,
        toLabel: (x == null ? void 0 : x.label) ?? w.toId,
        x1: M ? M.x + 220 / 2 : 0,
        y1: M ? M.y + 94 : 0,
        x2: x ? x.x + 220 / 2 : 0,
        y2: x ? x.y + 94 : 0,
        labelX: M && x ? Math.round((M.x + x.x + 220) / 2) : 0,
        labelY: M && x ? Math.round((M.y + x.y) / 2 + 84) : 0,
        typeClass: `csi-connection--${w.type}`,
        styleClass: `csi-connection-line--${w.style}`,
        colorClass: `csi-connection-color--${w.color}`,
        hasVisibleEnds: !!(M && x)
      };
    }).filter((w) => w.hasVisibleEnds);
    return {
      case: r,
      cards: u,
      connections: C,
      boardSize: { width: 5200, height: 3600 },
      viewStyle: `transform: translate(${r.boardLayout.view.x}px, ${r.boardLayout.view.y}px) scale(${r.boardLayout.view.scale});`,
      zoomPercent: Math.round(r.boardLayout.view.scale * 100),
      themeClass: `csi-theme-${r.boardLayout.theme}`,
      playerMode: t,
      isGM: (v = game.user) == null ? void 0 : v.isGM,
      canEditBoard: be(a),
      addCollections: ke.map((w) => ({
        id: w,
        label: oe(ae(w))
      })),
      counts: {
        evidence: r.evidence.length,
        suspects: r.suspects.length,
        locations: r.locations.length,
        timeline: r.timeline.length,
        connections: C.length
      }
    };
  }
  function J(e) {
    return Array.isArray(e) ? e : [];
  }
  function Ee(e) {
    const t = F(e.boardLayout), i = [];
    for (const a of e.evidence) i.push(ee(a, "evidence", "Evidence", a.title, t, i.length));
    for (const a of e.suspects) i.push(ee(a, "suspects", "Suspect", a.name, t, i.length));
    for (const a of e.locations) i.push(ee(a, "locations", "Location", a.name, t, i.length));
    for (const a of e.timeline) i.push(ee(a, "timeline", "Timeline", a.title, t, i.length));
    return i;
  }
  function ee(e, t, i, a, r, u) {
    const d = r.cards[e.id] ?? se(u);
    return {
      ...e,
      collection: t,
      kind: t === "suspects" ? "suspect" : t === "locations" ? "location" : t === "timeline" ? "timeline" : "evidence",
      kindLabel: i,
      label: a,
      x: Number(d.x) || 0,
      y: Number(d.y) || 0,
      layer: "public",
      style: `left: ${Number(d.x) || 0}px; top: ${Number(d.y) || 0}px;`
    };
  }
  function se(e) {
    return {
      x: 80 + e % 5 * 300,
      y: 90 + Math.floor(e / 5) * 330
    };
  }
  function ye(e) {
    const t = [];
    for (const i of e.evidence) t.push({ id: i.id, label: `Evidence: ${i.title}` });
    for (const i of e.suspects) t.push({ id: i.id, label: `Suspect: ${i.name}` });
    for (const i of e.locations) t.push({ id: i.id, label: `Location: ${i.name}` });
    for (const i of e.timeline) t.push({ id: i.id, label: `Timeline: ${i.title}` });
    return t;
  }
  function te(e, { resetLayout: t = !1 } = {}) {
    var i;
    (i = p.manager) != null && i.rendered && p.manager.render(!0);
    for (const [a, r] of p.boards.entries())
      t && a.startsWith(`${e}:`) && (r._localLayout = null), a.startsWith(`${e}:`) && r.rendered && r.render(!0);
  }
  function be(e) {
    return !!(typeof e == "string" ? k(e) : e);
  }
  function Be() {
    return !0;
  }
  function Ae(e) {
    for (const [t, i] of p.boards.entries())
      t.startsWith(`${e}:`) && i.close();
  }
  function _e(e) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(e) : JSON.parse(JSON.stringify(e));
  }
  function oe(e) {
    return String(e ?? "").replace(/_/g, " ").replace(/\b\w/g, (t) => t.toUpperCase());
  }
  function Ne(e) {
    return String(e || "case").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "case";
  }
  function ae(e) {
    return e === "suspects" ? "suspect" : e === "locations" ? "location" : e === "timeline" ? "timeline item" : e === "connections" ? "connection" : "evidence";
  }
  function Ce(e, t) {
    return t === "connections" ? e.label || `${e.fromId} -> ${e.toId}` : t === "suspects" || t === "locations" ? e.name : e.title;
  }
  function Pe(e, t) {
    const i = t.centerX - e.centerX, a = t.centerY - e.centerY;
    if (!i && !a) return { x: Math.round(e.centerX), y: Math.round(e.centerY) };
    const r = i === 0 ? Number.POSITIVE_INFINITY : Math.abs(e.width / 2 / i), u = a === 0 ? Number.POSITIVE_INFINITY : Math.abs(e.height / 2 / a), d = Math.min(r, u);
    return !Number.isFinite(d) || d <= 0 ? { x: Math.round(e.centerX), y: Math.round(e.centerY) } : {
      x: Math.round(e.centerX + i * d),
      y: Math.round(e.centerY + a * d)
    };
  }
  function Oe(e) {
    return Number.isFinite(e == null ? void 0 : e.x) && Number.isFinite(e == null ? void 0 : e.y);
  }
  function Ie(e) {
    var i, a, r, u, d;
    const t = globalThis.Dialog ?? ((r = (a = (i = globalThis.foundry) == null ? void 0 : i.appv1) == null ? void 0 : a.api) == null ? void 0 : r.Dialog);
    return t != null && t.confirm ? t.confirm(e) : Promise.resolve((d = globalThis.confirm) == null ? void 0 : d.call(globalThis, ((u = e.content) == null ? void 0 : u.replace(/<[^>]+>/g, "")) ?? e.title));
  }
  function ve(e) {
    const t = document.createElement("div");
    return t.textContent = String(e ?? ""), t.innerHTML;
  }
})();
