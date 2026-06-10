var Ae = Object.defineProperty;
var Ne = (s, l, b) => l in s ? Ae(s, l, { enumerable: !0, configurable: !0, writable: !0, value: b }) : s[l] = b;
var S = (s, l, b) => Ne(s, typeof l != "symbol" ? l + "" : l, b);
const Le = ["open", "cold", "solved", "classified"], V = ["gm", "players"], xe = ["database", "noir"], ce = ["physical", "digital", "biological", "weapon", "document", "testimony", "other"], le = ["unknown", "relevant", "red_herring", "confirmed"], de = ["unknown", "cleared", "person_of_interest", "prime_suspect", "arrested", "dead"], ue = ["link", "supports", "contradicts", "location", "timeline", "identity"], me = ["solid", "dashed", "dotted"], fe = ["cyan", "green", "red", "amber", "violet", "orange", "white"], ke = ["evidence", "suspects", "locations", "timeline", "connections"], Me = ["evidence", "suspects", "locations", "timeline", "connections"];
function O(s = {}, { forceNewId: l = !1 } = {}) {
  return {
    id: l ? N() : s.id || N(),
    title: String(s.title || "Untitled Case"),
    subtitle: String(s.subtitle || ""),
    status: A(s.status, Le, "open"),
    description: String(s.description || ""),
    image: String(s.image || ""),
    visibility: A(s.visibility, V, "players"),
    evidence: Q(s.evidence, he),
    suspects: Q(s.suspects, pe),
    locations: Q(s.locations, ge),
    timeline: Q(s.timeline, ye),
    connections: Q(s.connections, ne),
    boardLayout: z(s.boardLayout)
  };
}
function he(s = {}) {
  return {
    id: s.id || N(),
    title: String(s.title || "Untitled Evidence"),
    type: A(s.type, ce, "other"),
    description: String(s.description || ""),
    image: String(s.image || ""),
    status: A(s.status, le, "unknown"),
    visibility: A(s.visibility, V, "players"),
    hidden: !!s.hidden,
    notes: String(s.notes || "")
  };
}
function pe(s = {}) {
  return {
    id: s.id || N(),
    name: String(s.name || "Unknown Suspect"),
    alias: String(s.alias || ""),
    image: String(s.image || ""),
    motive: String(s.motive || ""),
    alibi: String(s.alibi || ""),
    status: A(s.status, de, "unknown"),
    visibility: A(s.visibility, V, "players"),
    hidden: !!s.hidden,
    notes: String(s.notes || "")
  };
}
function ge(s = {}) {
  return {
    id: s.id || N(),
    name: String(s.name || "Unknown Location"),
    sceneId: String(s.sceneId || ""),
    image: String(s.image || ""),
    description: String(s.description || ""),
    visibility: A(s.visibility, V, "players"),
    hidden: !!s.hidden,
    notes: String(s.notes || "")
  };
}
function ye(s = {}) {
  return {
    id: s.id || N(),
    time: String(s.time || ""),
    title: String(s.title || "Timeline Event"),
    description: String(s.description || ""),
    linkedItemIds: Array.isArray(s.linkedItemIds) ? s.linkedItemIds.map(String) : [],
    visibility: A(s.visibility, V, "players"),
    hidden: !!s.hidden
  };
}
function ne(s = {}) {
  return {
    id: s.id || N(),
    fromId: String(s.fromId || ""),
    toId: String(s.toId || ""),
    label: String(s.label || ""),
    type: A(s.type, ue, "link"),
    style: A(s.style, me, "solid"),
    color: A(s.color, fe, Oe(s.type)),
    visibility: A(s.visibility, V, "players")
  };
}
function z(s = {}) {
  var l, b, G;
  return {
    theme: A(s.theme, xe, "database"),
    view: {
      x: Number((l = s.view) == null ? void 0 : l.x) || 0,
      y: Number((b = s.view) == null ? void 0 : b.y) || 0,
      scale: ie(Number((G = s.view) == null ? void 0 : G.scale) || 1, 0.45, 1.8)
    },
    cards: Object.fromEntries(Object.entries(s.cards ?? {}).map(([k, T]) => [k, {
      x: Number(T == null ? void 0 : T.x) || 0,
      y: Number(T == null ? void 0 : T.y) || 0
    }]))
  };
}
function Pe(s, l = "players", b = N()) {
  return s === "evidence" ? he({ id: b, visibility: l }) : s === "suspects" ? pe({ id: b, visibility: l }) : s === "locations" ? ge({ id: b, visibility: l }) : s === "timeline" ? ye({ id: b, visibility: l }) : ne({ id: b, visibility: l });
}
function Q(s, l) {
  return Array.isArray(s) ? s.map((b) => l(b)) : [];
}
function A(s, l, b) {
  return l.includes(s) ? s : b;
}
function N() {
  var s;
  return foundry.utils.randomID ? foundry.utils.randomID() : ((s = crypto.randomUUID) == null ? void 0 : s.call(crypto)) ?? Math.random().toString(36).slice(2, 12);
}
function Oe(s) {
  return s === "supports" ? "green" : s === "contradicts" ? "red" : s === "location" ? "amber" : s === "timeline" ? "violet" : s === "identity" ? "orange" : "cyan";
}
function ie(s, l, b) {
  return Math.min(b, Math.max(l, s));
}
function He(s) {
  const {
    LegacyApplication: l,
    moduleId: b,
    moduleTitle: G,
    CSIBoardItemEditor: k,
    getCase: T,
    prepareBoardData: R,
    openCaseManager: M,
    canUserEditBoard: x,
    publishSharedLayout: j,
    requestLayoutPublish: X,
    deleteBoardItem: K,
    saveCase: W,
    defaultBoardPosition: se,
    getRectEdgeAnchor: m,
    isFinitePoint: h,
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
      const n = T(this.caseId), o = this.playerMode ? "Player Board" : "GM Board";
      return n ? `${n.title} - ${o}` : `CSI Toolkit - ${o}`;
    }
    async getData() {
      return R(this.caseId, { playerMode: this.playerMode, layoutOverride: this._localLayout });
    }
    activateListeners(n) {
      super.activateListeners(n), n.find("[data-action='open-manager']").on("click", () => M()), n.find("[data-action='refresh-board']").on("click", () => this._reloadSharedBoard()), n.find("[data-action='publish-layout']").on("click", () => this._publishLayout()), n.find("[data-action='zoom-in']").on("click", () => this._zoomBy(0.1)), n.find("[data-action='zoom-out']").on("click", () => this._zoomBy(-0.1)), n.find("[data-action='context-add-board-item']").on("click", (c) => this._addBoardItemFromContext(c)), n.find("[data-action='edit-card']").on("click", (c) => this._editCard(c.currentTarget.dataset.collection, c.currentTarget.dataset.itemId)), n.find("[data-action='delete-board-item']").on("click", (c) => this._deleteBoardItem(c.currentTarget.dataset.collection, c.currentTarget.dataset.itemId)), n.find("[data-action='move-timeline-item']").on("click", (c) => this._moveTimelineItem(c.currentTarget.dataset.itemId, c.currentTarget.dataset.direction)), n.find("[data-csi-connection-hit]").on("dblclick", (c) => this._editCard("connections", c.currentTarget.dataset.connectionId)), n.find("[data-action='start-connection']").on("click", (c) => this._startConnection(c)), n.find("[data-csi-dim-kind]").on("change", (c) => this._toggleDimKind(c.currentTarget));
      const o = n[0].querySelector("[data-csi-board-viewport]");
      o && (o.addEventListener("wheel", (c) => this._onWheel(c), { passive: !1 }), o.addEventListener("mousedown", (c) => this._onViewportMouseDown(c)), o.addEventListener("contextmenu", (c) => this._openContextMenu(c))), n.find("[data-csi-board-card]").on("mousedown", (c) => this._onCardMouseDown(c)), n.find("[data-csi-board-card]").on("click", (c) => this._completeConnection(c)), n.find(".csi-card-image").on("load", () => this._queueConnectionLineUpdate()), this._syncDimControls(), this._applyDimmedKinds(), this._queueConnectionLineUpdate();
    }
    _onCardMouseDown(n) {
      if (!x(this.caseId) || n.button !== 0 || n.target.closest("button")) return;
      const o = n.currentTarget, c = this._getView(), p = this._getLayout(), y = o.dataset.itemId, I = p.cards[y] ?? { x: Number(o.dataset.x) || 0, y: Number(o.dataset.y) || 0 };
      n.preventDefault(), this._drag = {
        itemId: y,
        card: o,
        startClientX: n.clientX,
        startClientY: n.clientY,
        startX: I.x,
        startY: I.y,
        scale: c.scale,
        x: I.x,
        y: I.y,
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
      var p, y;
      const o = (p = this.element[0]) == null ? void 0 : p.querySelector("[data-csi-board-canvas]");
      if (!o) return;
      o.style.transform = `translate(${n.x}px, ${n.y}px) scale(${n.scale})`;
      const c = (y = this.element[0]) == null ? void 0 : y.querySelector("[data-csi-zoom]");
      c && (c.textContent = `${Math.round(n.scale * 100)}%`);
    }
    _getView() {
      return this._getLayout().view;
    }
    _getLayout() {
      const n = T(this.caseId);
      return z(this._layoutDraft ?? this._localLayout ?? (n == null ? void 0 : n.boardLayout));
    }
    async _saveLayout(n) {
      this._localLayout = z(n);
    }
    async _publishLayout() {
      var o;
      if (!x(this.caseId)) return;
      const n = this._getLayout();
      if ((o = game.user) != null && o.isGM) {
        await j(this.caseId, n);
        return;
      }
      await X(this.caseId, n);
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
      const p = o ?? this._getBoardCardMap(), y = n ?? Array.from(c.querySelectorAll("[data-csi-connection-group]"));
      for (const I of y) {
        const H = p.get(I.dataset.fromId), q = p.get(I.dataset.toId);
        if (!H || !q) continue;
        const F = this._getCardBoardRect(H), Z = this._getCardBoardRect(q), U = m(F, Z), P = m(Z, F);
        if (!h(U) || !h(P)) continue;
        for (const Y of I.querySelectorAll("[data-csi-connection-line], [data-csi-connection-hit]"))
          Y.setAttribute("x1", U.x), Y.setAttribute("y1", U.y), Y.setAttribute("x2", P.x), Y.setAttribute("y2", P.y);
        const J = I.querySelector("[data-csi-connection-label]");
        J && (J.setAttribute("x", Math.round((U.x + P.x) / 2)), J.setAttribute("y", Math.round((U.y + P.y) / 2 - 10)));
      }
    }
    _queueConnectionLineUpdate() {
      const n = () => this._updateConnectionLines();
      globalThis.requestAnimationFrame ? globalThis.requestAnimationFrame(n) : globalThis.setTimeout(n, 0);
    }
    _getCardBoardRect(n) {
      const o = Number(n.dataset.x) || Number.parseFloat(n.style.left) || 0, c = Number(n.dataset.y) || Number.parseFloat(n.style.top) || 0, p = n.offsetWidth || 220, y = n.offsetHeight || 246;
      return {
        x: o,
        y: c,
        width: p,
        height: y,
        centerX: o + p / 2,
        centerY: c + y / 2
      };
    }
    _editCard(n, o) {
      x(this.caseId) && new k(this.caseId, n, o).render(!0);
    }
    async _deleteBoardItem(n, o) {
      !x(this.caseId) || !ke.includes(n) || !o || await K(this.caseId, n, o);
    }
    async _moveTimelineItem(n, o) {
      var q;
      if (!x(this.caseId) || !n) return;
      const c = T(this.caseId), p = ((q = c == null ? void 0 : c.timeline) == null ? void 0 : q.findIndex((F) => F.id === n)) ?? -1, I = p + (o === "up" ? -1 : o === "down" ? 1 : 0);
      if (!c || p < 0 || I < 0 || I >= c.timeline.length) return;
      const [H] = c.timeline.splice(p, 1);
      c.timeline.splice(I, 0, H), await W(c);
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
      x(this.caseId) && Me.includes(n) && new k(this.caseId, n, null, { boardPosition: o }).render(!0);
    }
    _openContextMenu(n) {
      var q, F;
      if (!x(this.caseId) || n.target.closest("[data-csi-board-card], button, input, select, textarea")) return;
      const o = (q = this.element[0]) == null ? void 0 : q.querySelector("[data-csi-context-menu]"), c = (F = this.element[0]) == null ? void 0 : F.querySelector("[data-csi-board-viewport]");
      if (!o || !c) return;
      n.preventDefault(), n.stopPropagation(), this._contextBoardPosition = this._clientToBoardPosition(n.clientX, n.clientY), o.hidden = !1;
      const p = o.offsetWidth || 156, y = o.offsetHeight || 180, I = Math.max(4, globalThis.innerWidth - p - 4), H = Math.max(4, globalThis.innerHeight - y - 4);
      o.style.left = `${ie(n.clientX, 4, I)}px`, o.style.top = `${ie(n.clientY, 4, H)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu() {
      var o;
      const n = (o = this.element[0]) == null ? void 0 : o.querySelector("[data-csi-context-menu]");
      n && (n.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    _clientToBoardPosition(n, o) {
      var I;
      const c = (I = this.element[0]) == null ? void 0 : I.querySelector("[data-csi-board-viewport]"), p = c == null ? void 0 : c.getBoundingClientRect(), y = this._getView();
      return p ? {
        x: Math.round((n - p.left - y.x) / y.scale - 220 / 2),
        y: Math.round((o - p.top - y.y) / y.scale - 32)
      } : null;
    }
    _startConnection(n) {
      var p;
      if (n.preventDefault(), n.stopPropagation(), !x(this.caseId)) return;
      const c = n.currentTarget.dataset.itemId;
      if (c) {
        this._pendingConnection = { fromId: c };
        for (const y of this.element[0].querySelectorAll("[data-csi-board-card]")) y.classList.toggle("is-link-source", y.dataset.itemId === c);
        (p = ui.notifications) == null || p.info(`${G}: Select another card to create a connection.`);
      }
    }
    async _completeConnection(n) {
      if (!this._pendingConnection || n.target.closest("button, input, select, textarea") || !x(this.caseId)) return;
      const o = n.currentTarget.dataset.itemId, c = this._pendingConnection.fromId;
      this._pendingConnection = null;
      for (const I of this.element[0].querySelectorAll("[data-csi-board-card]")) I.classList.remove("is-link-source");
      if (!o || o === c) return;
      const p = T(this.caseId);
      if (!p) return;
      const y = ne({
        id: N(),
        fromId: c,
        toId: o,
        label: "linked to",
        type: "link",
        style: "solid",
        color: "cyan",
        visibility: "players"
      });
      p.connections.push(y), await W(p), new k(this.caseId, "connections", y.id).render(!0);
    }
    async close(n = {}) {
      return this._hideContextMenu(), f(this), super.close(n);
    }
  };
}
function qe(s) {
  const {
    LegacyApplication: l,
    moduleId: b,
    moduleTitle: G,
    singularLabel: k,
    getItemTitle: T,
    getCase: R,
    buildItemChoices: M,
    parseItemElement: x,
    saveCase: j,
    deleteBoardItem: X,
    defaultBoardPosition: K
  } = s;
  return class extends l {
    constructor(m, h, f, C = {}) {
      super(C);
      S(this, "caseId");
      S(this, "collection");
      S(this, "itemId");
      S(this, "isNew");
      S(this, "boardPosition");
      this.caseId = m, this.collection = h, this.itemId = f || N(), this.isNew = !f, this.boardPosition = C.boardPosition ? {
        x: Number(C.boardPosition.x) || 0,
        y: Number(C.boardPosition.y) || 0
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
      return this.isNew ? `Add ${k(this.collection)}` : m ? `Edit ${T(m, this.collection)}` : "Edit CSI Board Card";
    }
    async getData() {
      var f;
      const m = R(this.caseId), h = this._getItem();
      return {
        caseId: this.caseId,
        collection: this.collection,
        item: h,
        isNew: this.isNew,
        itemChoices: m ? M(m, !((f = game.user) != null && f.isGM)) : [],
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
    activateListeners(m) {
      var C, $;
      super.activateListeners(m);
      const h = m[0], f = (C = h == null ? void 0 : h.matches) != null && C.call(h, "[data-csi-board-item-form]") ? h : ($ = h == null ? void 0 : h.querySelector) == null ? void 0 : $.call(h, "[data-csi-board-item-form]");
      f && f.addEventListener("submit", (n) => this._save(n)), m.find("[data-action='pick-image']").on("click", (n) => this._pickImage(n.currentTarget)), m.find("[data-action='delete-board-item']").on("click", (n) => this._delete(n));
    }
    _getItem() {
      var f;
      const m = R(this.caseId), h = (f = m == null ? void 0 : m[this.collection]) == null ? void 0 : f.find((C) => C.id === this.itemId);
      return h || (this.isNew ? Pe(this.collection, "players", this.itemId) : null);
    }
    async _save(m) {
      var n, o, c;
      m.preventDefault(), m.stopPropagation(), (n = m.stopImmediatePropagation) == null || n.call(m);
      const h = m.currentTarget, f = R(this.caseId);
      if (!f)
        return (o = ui.notifications) == null || o.warn(`${G}: The case could not be found.`), !1;
      const C = f[this.collection].findIndex((p) => p.id === this.itemId);
      if (C < 0 && !this.isNew)
        return (c = ui.notifications) == null || c.warn(`${G}: The item could not be found.`), !1;
      const $ = x(this.collection, h);
      return $.id = this.itemId, $.visibility = "players", $.hidden = C >= 0 ? !!f[this.collection][C].hidden : !1, C >= 0 ? f[this.collection][C] = $ : f[this.collection].push($), this.isNew && this.collection !== "connections" && (f.boardLayout.cards[this.itemId] = this.boardPosition ?? K(f.evidence.length + f.suspects.length + f.locations.length + f.timeline.length)), await j(f), this.close(), !1;
    }
    async _delete(m) {
      var f;
      return m.preventDefault(), m.stopPropagation(), (f = m.stopImmediatePropagation) == null || f.call(m), this.isNew || await X(this.caseId, this.collection, this.itemId, { confirm: !0 }) && this.close(), !1;
    }
    _pickImage(m) {
      var C, $, n, o;
      const h = (C = m.closest(".csi-image-field")) == null ? void 0 : C.querySelector("input"), f = globalThis.FilePicker ?? ((o = (n = ($ = globalThis.foundry) == null ? void 0 : $.applications) == null ? void 0 : n.apps) == null ? void 0 : o.FilePicker);
      !h || !f || new f({
        type: "image",
        current: h.value,
        callback: (c) => {
          h.value = c, h.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).render(!0);
    }
  };
}
const D = "csi-toolkit", g = "CSI Toolkit", te = `module.${D}`, Ge = [
  `modules/${D}/templates/case-manager.hbs`,
  `modules/${D}/templates/case-browser.hbs`,
  `modules/${D}/templates/case-board.hbs`,
  `modules/${D}/templates/item-card.hbs`,
  `modules/${D}/templates/board-item-editor.hbs`
];
function Fe() {
  game.settings.register(D, "cases", {
    name: "CSI Toolkit Cases",
    hint: "Stores all investigation cases for this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  });
}
function re(s) {
  return String(s || "").replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
function Ye(s) {
  return String(s || "case").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "case";
}
function Te(s) {
  const l = document.createElement("div");
  return l.textContent = String(s ?? ""), l.innerHTML;
}
function ze() {
  Handlebars.registerHelper("csiEq", (s, l) => s === l), Handlebars.registerHelper("csiLabel", (s) => re(s)), Handlebars.registerHelper("csiCount", (s) => Array.isArray(s) ? s.length : 0), Handlebars.registerHelper("csiFallback", (s, l) => s || l), Handlebars.registerHelper("csiJoin", (s) => Array.isArray(s) ? s.join(", ") : ""), Handlebars.registerHelper("csiOption", (s, l) => s === l ? "selected" : ""), Handlebars.registerHelper("csiChecked", (s) => s === "players" ? "checked" : "");
}
(() => {
  var we, Se;
  const s = globalThis.Application ?? ((Se = (we = foundry.appv1) == null ? void 0 : we.api) == null ? void 0 : Se.Application), l = {
    manager: null,
    browser: null,
    boards: /* @__PURE__ */ new Map(),
    playerBoard: null
  };
  Hooks.once("init", async () => {
    Fe(), ze(), await loadTemplates(Ge), console.log(`${g} | Initialized`);
  }), Hooks.once("ready", () => {
    game.csiToolkit = b();
    const e = game.modules.get(D);
    e && (e.api = game.csiToolkit), G(), game.socket.on(te, p), console.log(`${g} | API available at game.csiToolkit`);
  });
  function b() {
    return {
      openCaseBoard: (e, i = {}) => $(e, i),
      openCaseManager: () => f(),
      openCaseBrowser: () => C(),
      createCase: (e) => X(e),
      getCases: () => k(),
      exportCase: (e) => h(e),
      importCase: (e) => m(e)
    };
  }
  function G() {
    const e = game.modules.get("holosuite-core"), i = e != null && e.active ? e.api : null;
    return i != null && i.registerApp ? (i.registerApp({
      id: D,
      title: "CSI Toolkit",
      icon: "fa-solid fa-fingerprint",
      premium: !1,
      featureId: D,
      description: "Open case files, evidence boards, and investigation tools.",
      open: () => {
        var t;
        return (t = game.user) != null && t.isGM ? f() : C();
      }
    }), !0) : !1;
  }
  function k() {
    return Ce(game.settings.get(D, "cases") ?? {});
  }
  async function T(e) {
    return game.settings.set(D, "cases", e ?? {});
  }
  function R() {
    var i;
    return (((i = game.users) == null ? void 0 : i.contents) ?? Array.from(game.users ?? [])).some((t) => (t == null ? void 0 : t.isGM) && (t == null ? void 0 : t.active));
  }
  function M(e) {
    const i = k();
    return i[e] ? O(i[e]) : null;
  }
  async function x(e, { notify: i = !0, render: t = !0, updateReason: a = null, userName: r = null } = {}) {
    var _;
    const u = O(e);
    if (!((_ = game.user) != null && _.isGM)) return j(u, { notify: i, render: t });
    const d = k();
    return d[u.id] = u, await T(d), i && c(u.id, { reason: a, userName: r }), t && ee(u.id), u;
  }
  async function j(e, { render: i = !0, notify: t = !0 } = {}) {
    var a, r, u, d, _, L;
    return (a = game.socket) != null && a.emit ? R() ? (game.socket.emit(te, {
      type: "save-case-request",
      caseData: e,
      userId: (d = game.user) == null ? void 0 : d.id,
      userName: (_ = game.user) == null ? void 0 : _.name
    }), t && ((L = ui.notifications) == null || L.info(`${g}: Board update sent to the GM.`)), e) : ((u = ui.notifications) == null || u.warn(`${g}: No active GM is connected to save board changes.`), e) : ((r = ui.notifications) == null || r.warn(`${g}: A GM must be connected to save board changes.`), e);
  }
  async function X(e = {}) {
    var a;
    const i = O(e, { forceNewId: !e.id }), t = k();
    return t[i.id] = i, await T(t), c(i.id), (a = ui.notifications) == null || a.info(`${g}: Created case "${i.title}".`), i;
  }
  async function K(e) {
    var a;
    const i = k(), t = i[e];
    return t ? (delete i[e], await T(i), De(e), c(e), (a = ui.notifications) == null || a.info(`${g}: Deleted case "${t.title}".`), !0) : !1;
  }
  async function W(e, i, t, { confirm: a = !0 } = {}) {
    var _, L;
    if (!ke.includes(i) || !t) return !1;
    const r = M(e);
    if (!r) return !1;
    const u = (_ = r[i]) == null ? void 0 : _.find((v) => v.id === t);
    if (!u) return !1;
    const d = Ie(u, i);
    return a && !await ve({
      title: `Delete ${re(ae(i))}`,
      content: `<p>Delete <strong>${Te(d)}</strong>?${i === "connections" ? "" : " Any attached connections will also be deleted."}</p>`,
      yes: () => !0,
      no: () => !1,
      defaultYes: !1
    }) ? !1 : (r[i] = r[i].filter((v) => v.id !== t), i !== "connections" && (r.connections = r.connections.filter((v) => v.fromId !== t && v.toId !== t), r.timeline = r.timeline.map((v) => ({
      ...v,
      linkedItemIds: (v.linkedItemIds ?? []).filter((w) => w !== t)
    })), delete r.boardLayout.cards[t]), await x(r), (L = ui.notifications) == null || L.info(`${g}: Deleted "${d}".`), !0);
  }
  async function se(e) {
    var r;
    const i = M(e);
    if (!i) return null;
    const t = O({
      ...i,
      id: N(),
      title: `${i.title} Copy`
    }), a = k();
    return a[t.id] = t, await T(a), c(t.id), (r = ui.notifications) == null || r.info(`${g}: Duplicated case "${i.title}".`), t;
  }
  async function m(e) {
    var a;
    const i = O({
      ...e,
      id: e.id || N()
    }), t = k();
    return t[i.id] && (i.id = N()), t[i.id] = i, await T(t), c(i.id), (a = ui.notifications) == null || a.info(`${g}: Imported case "${i.title}".`), i;
  }
  function h(e) {
    const i = M(e);
    if (!i) return !1;
    const t = new Blob([JSON.stringify(i, null, 2)], { type: "application/json" }), a = URL.createObjectURL(t), r = document.createElement("a");
    return r.href = a, r.download = `${Ye(i.title)}.json`, r.click(), URL.revokeObjectURL(a), !0;
  }
  function f() {
    var e;
    return (e = game.user) != null && e.isGM ? (l.manager || (l.manager = new q()), l.manager.render(!0), l.manager) : C();
  }
  function C() {
    return l.browser || (l.browser = new H()), l.browser.render(!0), l.browser;
  }
  function $(e, i = {}) {
    var _, L, v;
    if (!e)
      return (_ = ui.notifications) == null || _.warn(`${g}: No case id provided.`), null;
    if (!M(e))
      return (L = ui.notifications) == null || L.warn(`${g}: Case "${e}" was not found.`), null;
    const a = i.playerMode ?? !((v = game.user) != null && v.isGM), r = `${e}:${a ? "player" : "gm"}`, u = l.boards.get(r);
    if (u)
      return u.render(!0), u;
    const d = new I(e, { playerMode: a });
    return l.boards.set(r, d), d.render(!0), d;
  }
  async function n(e, i) {
    var a, r, u, d, _, L;
    const t = z(i);
    return (a = game.socket) != null && a.emit ? R() ? (game.socket.emit(te, {
      type: "publish-layout-request",
      caseId: e,
      boardLayout: t,
      userId: (d = game.user) == null ? void 0 : d.id,
      userName: (_ = game.user) == null ? void 0 : _.name
    }), (L = ui.notifications) == null || L.info(`${g}: Layout publish request sent to the GM.`), !0) : ((u = ui.notifications) == null || u.warn(`${g}: No active GM is connected to publish the board layout.`), !1) : ((r = ui.notifications) == null || r.warn(`${g}: A GM must be connected to publish the board layout.`), !1);
  }
  async function o(e, i, { userId: t = ((r) => (r = game.user) == null ? void 0 : r.id)(), userName: a = ((u) => (u = game.user) == null ? void 0 : u.name)() } = {}) {
    var v;
    const d = M(e);
    if (!d) return !1;
    const _ = z(d.boardLayout), L = z(i);
    return d.boardLayout = z({
      ..._,
      cards: L.cards
    }), await x(d, {
      render: !1,
      updateReason: "layout-published",
      userName: a
    }), ee(e, { resetLayout: !0 }), (v = ui.notifications) == null || v.info(`${g}: Published shared board layout${a ? ` from ${a}` : ""}.`), !0;
  }
  function c(e, { reason: i = null, userName: t = null } = {}) {
    var a, r;
    (r = game.socket) == null || r.emit(te, { type: "case-updated", caseId: e, reason: i, userName: t, userId: (a = game.user) == null ? void 0 : a.id });
  }
  function p(e) {
    var i, t, a, r;
    if (e) {
      if (e.type === "save-case-request") {
        if (!((i = game.user) != null && i.isGM) || !e.caseData) return;
        x(e.caseData, { render: !1 }).then((u) => {
          var d;
          u && (ee(u.id), (d = ui.notifications) == null || d.info(`${g}: Saved player board update from ${e.userName ?? "a player"}.`));
        }).catch((u) => {
          var d;
          console.error(`${g} | Could not save player board update`, u), (d = ui.notifications) == null || d.error(`${g}: Player board update could not be saved.`);
        });
        return;
      }
      if (e.type === "publish-layout-request") {
        if (!((t = game.user) != null && t.isGM) || !e.caseId || !e.boardLayout) return;
        o(e.caseId, e.boardLayout, {
          userId: e.userId,
          userName: e.userName
        }).catch((u) => {
          var d;
          console.error(`${g} | Could not publish player layout`, u), (d = ui.notifications) == null || d.error(`${g}: Player layout could not be published.`);
        });
        return;
      }
      if (e.type === "case-updated" && e.caseId) {
        if (e.userId && e.userId === ((a = game.user) == null ? void 0 : a.id)) return;
        ee(e.caseId, { resetLayout: e.reason === "layout-published" }), e.reason === "layout-published" && ((r = ui.notifications) == null || r.info(`${g}: ${e.userName ?? "Someone"} published a shared board layout.`));
        return;
      }
    }
  }
  const y = qe({
    LegacyApplication: s,
    moduleId: D,
    moduleTitle: g,
    singularLabel: ae,
    getItemTitle: Ie,
    getCase: M,
    buildItemChoices: be,
    parseItemElement: Z,
    saveCase: x,
    deleteBoardItem: W,
    defaultBoardPosition: oe
  }), I = He({
    LegacyApplication: s,
    moduleId: D,
    moduleTitle: g,
    CSIBoardItemEditor: y,
    getCase: M,
    prepareBoardData: U,
    openCaseManager: f,
    canUserEditBoard: _e,
    publishSharedLayout: o,
    requestLayoutPublish: n,
    deleteBoardItem: W,
    saveCase: x,
    defaultBoardPosition: oe,
    getRectEdgeAnchor: Ee,
    isFinitePoint: Be,
    clearBoardApp: (e) => {
      l.boards.delete(`${e.caseId}:${e.playerMode ? "player" : "gm"}`), l.playerBoard === e && (l.playerBoard = null);
    }
  });
  class H extends s {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "csi-case-browser",
        title: "CSI Toolkit Case Files",
        template: `modules/${D}/templates/case-browser.hbs`,
        classes: ["csi-toolkit", "csi-case-browser"],
        width: 520,
        height: 620,
        resizable: !0
      });
    }
    async getData() {
      var t;
      return {
        cases: Object.values(k()).map((a) => O(a)).sort((a, r) => a.title.localeCompare(r.title)),
        isGM: (t = game.user) == null ? void 0 : t.isGM,
        canContribute: $e()
      };
    }
    activateListeners(i) {
      super.activateListeners(i), i.find("[data-action='open-board']").on("click", (t) => {
        var a;
        $(t.currentTarget.dataset.caseId, { playerMode: !((a = game.user) != null && a.isGM) });
      }), i.find("[data-action='open-manager']").on("click", () => f());
    }
    async close(i = {}) {
      return l.browser = null, super.close(i);
    }
  }
  class q extends s {
    constructor(i = {}) {
      super(i), this.selectedCaseId = i.caseId ?? null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "csi-case-manager",
        title: "CSI Toolkit Case Manager",
        template: `modules/${D}/templates/case-manager.hbs`,
        classes: ["csi-toolkit", "csi-case-manager"],
        width: 1180,
        height: 820,
        resizable: !0
      });
    }
    async getData() {
      var u;
      const i = k(), t = Object.values(i).map((d) => O(d)).sort((d, _) => d.title.localeCompare(_.title));
      !this.selectedCaseId && t.length && (this.selectedCaseId = t[0].id), this.selectedCaseId && !i[this.selectedCaseId] && (this.selectedCaseId = ((u = t[0]) == null ? void 0 : u.id) ?? null);
      const a = this.selectedCaseId ? O(i[this.selectedCaseId]) : null, r = a ? be(a) : [];
      return {
        cases: t,
        selected: a,
        itemChoices: r,
        options: {
          caseStatuses: Le,
          themes: xe,
          evidenceTypes: ce,
          evidenceStatuses: le,
          suspectStatuses: de,
          connectionTypes: ue,
          connectionStyles: me,
          connectionColors: fe
        }
      };
    }
    activateListeners(i) {
      super.activateListeners(i), i.find("[data-action='select-case']").on("click", (t) => {
        this.selectedCaseId = t.currentTarget.dataset.caseId, this.render(!1);
      }), i.find("[data-action='new-case']").on("click", () => this._createNewCase()), i.find("[data-csi-case-form]").on("submit", (t) => this._saveSelectedCase(t)), i.find("[data-action='save-case']").on("click", (t) => this._saveSelectedCase(t)), i.find("[data-action='delete-case']").on("click", () => this._deleteSelectedCase()), i.find("[data-action='duplicate-case']").on("click", () => this._duplicateSelectedCase()), i.find("[data-action='open-board']").on("click", () => $(this.selectedCaseId)), i.find("[data-action='pick-image']").on("click", (t) => this._pickImage(t.currentTarget)), i.find("[data-action='export-case']").on("click", () => h(this.selectedCaseId)), i.find("[data-action='import-case']").on("click", () => {
        var t;
        return (t = this.element[0].querySelector("[data-csi-import-file]")) == null ? void 0 : t.click();
      }), i.find("[data-csi-import-file]").on("change", (t) => this._importFromFile(t.currentTarget));
    }
    _readCurrentCase() {
      const i = this.element[0].querySelector("[data-csi-case-form]");
      return i ? F(i, this.selectedCaseId) : M(this.selectedCaseId);
    }
    async _createNewCase() {
      const i = await X({
        title: "New Investigation",
        subtitle: "Unfiled case",
        description: "Describe the incident, victim, premise, or central mystery.",
        visibility: "players"
      });
      this.selectedCaseId = i.id, this.render(!1);
    }
    async _saveSelectedCase(i) {
      var t, a;
      if (i.preventDefault(), !!this.selectedCaseId)
        try {
          const r = this._readCurrentCase();
          await x(r), this.selectedCaseId = r.id, (t = ui.notifications) == null || t.info(`${g}: Saved case "${r.title}".`), this.render(!1);
        } catch (r) {
          console.error(`${g} | Could not save case`, r), (a = ui.notifications) == null || a.error(`${g}: ${r.message}`);
        }
    }
    async _deleteSelectedCase() {
      if (!this.selectedCaseId) return;
      const i = M(this.selectedCaseId);
      !i || !await ve({
        title: "Delete CSI Case",
        content: `<p>Delete <strong>${Te(i.title)}</strong>? This cannot be undone.</p>`,
        yes: () => !0,
        no: () => !1,
        defaultYes: !1
      }) || (await K(this.selectedCaseId), this.selectedCaseId = null, this.render(!1));
    }
    async _duplicateSelectedCase() {
      if (!this.selectedCaseId) return;
      const i = await se(this.selectedCaseId);
      i && (this.selectedCaseId = i.id, this.render(!1));
    }
    _pickImage(i) {
      var r, u, d, _, L;
      const t = (r = i.closest(".csi-image-field")) == null ? void 0 : r.querySelector("input");
      if (!t) return;
      const a = globalThis.FilePicker ?? ((_ = (d = (u = globalThis.foundry) == null ? void 0 : u.applications) == null ? void 0 : d.apps) == null ? void 0 : _.FilePicker);
      if (!a) {
        (L = ui.notifications) == null || L.warn(`${g}: Foundry FilePicker is unavailable.`);
        return;
      }
      new a({
        type: "image",
        current: t.value,
        callback: (v) => {
          t.value = v, t.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).render(!0);
    }
    async _importFromFile(i) {
      var a, r;
      const t = (a = i.files) == null ? void 0 : a[0];
      if (t)
        try {
          const u = await t.text(), d = await m(JSON.parse(u));
          this.selectedCaseId = d.id, this.render(!1);
        } catch (u) {
          console.error(`${g} | Import failed`, u), (r = ui.notifications) == null || r.error(`${g}: Import failed. ${u.message}`);
        } finally {
          i.value = "";
        }
    }
    async close(i = {}) {
      return l.manager = null, super.close(i);
    }
  }
  function F(e, i) {
    const t = new FormData(e), a = M(i) ?? O({ id: i }), r = O({
      id: i,
      title: t.get("title"),
      subtitle: t.get("subtitle"),
      status: t.get("status"),
      description: t.get("description"),
      image: t.get("image"),
      visibility: "players",
      evidence: a.evidence,
      suspects: a.suspects,
      locations: a.locations,
      timeline: a.timeline,
      connections: a.connections,
      boardLayout: {
        ...a.boardLayout,
        theme: t.get("theme")
      }
    });
    return O(r);
  }
  function Z(e, i) {
    const t = (u) => {
      var d;
      return ((d = i.querySelector(`[name="${u}"]`)) == null ? void 0 : d.value) ?? "";
    }, a = "players", r = { id: i.dataset.itemId || N(), visibility: a };
    return e === "evidence" ? he({
      ...r,
      title: t("title"),
      type: t("type"),
      status: t("status"),
      description: t("description"),
      image: t("image"),
      notes: t("notes")
    }) : e === "suspects" ? pe({
      ...r,
      name: t("name"),
      alias: t("alias"),
      status: t("status"),
      motive: t("motive"),
      alibi: t("alibi"),
      image: t("image"),
      notes: t("notes")
    }) : e === "locations" ? ge({
      ...r,
      name: t("name"),
      sceneId: t("sceneId"),
      image: t("image"),
      description: t("description"),
      notes: t("notes")
    }) : e === "timeline" ? ye({
      ...r,
      time: t("time"),
      title: t("title"),
      description: t("description"),
      linkedItemIds: t("linkedItemIds").split(",").map((u) => u.trim()).filter(Boolean)
    }) : ne({
      id: r.id,
      visibility: a,
      fromId: t("fromId"),
      toId: t("toId"),
      label: t("label"),
      type: t("type"),
      style: t("style"),
      color: t("color")
    });
  }
  function U(e, { playerMode: i = !1, layoutOverride: t = null } = {}) {
    var L, v;
    const a = M(e);
    if (!a) return { isMissing: !0, playerMode: i, isGM: (L = game.user) == null ? void 0 : L.isGM };
    const r = Ce(a);
    t && (r.boardLayout = z(t)), r.evidence = P(r.evidence), r.suspects = P(r.suspects), r.locations = P(r.locations), r.timeline = P(r.timeline);
    const u = J(r), d = new Map(u.map((w) => [w.id, w]));
    r.timeline = r.timeline.map((w) => ({
      ...w,
      linkedLabels: (w.linkedItemIds ?? []).map((B) => {
        var E;
        return (E = d.get(B)) == null ? void 0 : E.label;
      }).filter(Boolean)
    }));
    const _ = P(r.connections).map((w) => {
      const B = d.get(w.fromId), E = d.get(w.toId);
      return {
        ...w,
        fromLabel: (B == null ? void 0 : B.label) ?? w.fromId,
        toLabel: (E == null ? void 0 : E.label) ?? w.toId,
        x1: B ? B.x + 220 / 2 : 0,
        y1: B ? B.y + 94 : 0,
        x2: E ? E.x + 220 / 2 : 0,
        y2: E ? E.y + 94 : 0,
        labelX: B && E ? Math.round((B.x + E.x + 220) / 2) : 0,
        labelY: B && E ? Math.round((B.y + E.y) / 2 + 84) : 0,
        typeClass: `csi-connection--${w.type}`,
        styleClass: `csi-connection-line--${w.style}`,
        colorClass: `csi-connection-color--${w.color}`,
        hasVisibleEnds: !!(B && E)
      };
    }).filter((w) => w.hasVisibleEnds);
    return {
      case: r,
      cards: u,
      connections: _,
      boardSize: { width: 5200, height: 3600 },
      viewStyle: `transform: translate(${r.boardLayout.view.x}px, ${r.boardLayout.view.y}px) scale(${r.boardLayout.view.scale});`,
      zoomPercent: Math.round(r.boardLayout.view.scale * 100),
      themeClass: `csi-theme-${r.boardLayout.theme}`,
      playerMode: i,
      isGM: (v = game.user) == null ? void 0 : v.isGM,
      canEditBoard: _e(a),
      addCollections: Me.map((w) => ({
        id: w,
        label: re(ae(w))
      })),
      counts: {
        evidence: r.evidence.length,
        suspects: r.suspects.length,
        locations: r.locations.length,
        timeline: r.timeline.length,
        connections: _.length
      }
    };
  }
  function P(e) {
    return Array.isArray(e) ? e : [];
  }
  function J(e) {
    const i = z(e.boardLayout), t = [];
    for (const a of e.evidence) t.push(Y(a, "evidence", "Evidence", a.title, i, t.length));
    for (const a of e.suspects) t.push(Y(a, "suspects", "Suspect", a.name, i, t.length));
    for (const a of e.locations) t.push(Y(a, "locations", "Location", a.name, i, t.length));
    for (const a of e.timeline) t.push(Y(a, "timeline", "Timeline", a.title, i, t.length));
    return t;
  }
  function Y(e, i, t, a, r, u) {
    const d = r.cards[e.id] ?? oe(u);
    return {
      ...e,
      collection: i,
      kind: i === "suspects" ? "suspect" : i === "locations" ? "location" : i === "timeline" ? "timeline" : "evidence",
      kindLabel: t,
      label: a,
      x: Number(d.x) || 0,
      y: Number(d.y) || 0,
      layer: "public",
      style: `left: ${Number(d.x) || 0}px; top: ${Number(d.y) || 0}px;`
    };
  }
  function oe(e) {
    return {
      x: 80 + e % 5 * 300,
      y: 90 + Math.floor(e / 5) * 330
    };
  }
  function be(e) {
    const i = [];
    for (const t of e.evidence) i.push({ id: t.id, label: `Evidence: ${t.title}` });
    for (const t of e.suspects) i.push({ id: t.id, label: `Suspect: ${t.name}` });
    for (const t of e.locations) i.push({ id: t.id, label: `Location: ${t.name}` });
    for (const t of e.timeline) i.push({ id: t.id, label: `Timeline: ${t.title}` });
    return i;
  }
  function ee(e, { resetLayout: i = !1 } = {}) {
    var t;
    (t = l.manager) != null && t.rendered && l.manager.render(!0);
    for (const [a, r] of l.boards.entries())
      i && a.startsWith(`${e}:`) && (r._localLayout = null), a.startsWith(`${e}:`) && r.rendered && r.render(!0);
  }
  function _e(e) {
    return !!(typeof e == "string" ? M(e) : e);
  }
  function $e() {
    return !0;
  }
  function De(e) {
    for (const [i, t] of l.boards.entries())
      i.startsWith(`${e}:`) && t.close();
  }
  function Ce(e) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(e) : JSON.parse(JSON.stringify(e));
  }
  function ae(e) {
    return e === "suspects" ? "suspect" : e === "locations" ? "location" : e === "timeline" ? "timeline item" : e === "connections" ? "connection" : "evidence";
  }
  function Ie(e, i) {
    return i === "connections" ? e.label || `${e.fromId} -> ${e.toId}` : i === "suspects" || i === "locations" ? e.name : e.title;
  }
  function Ee(e, i) {
    const t = i.centerX - e.centerX, a = i.centerY - e.centerY;
    if (!t && !a) return { x: Math.round(e.centerX), y: Math.round(e.centerY) };
    const r = t === 0 ? Number.POSITIVE_INFINITY : Math.abs(e.width / 2 / t), u = a === 0 ? Number.POSITIVE_INFINITY : Math.abs(e.height / 2 / a), d = Math.min(r, u);
    return !Number.isFinite(d) || d <= 0 ? { x: Math.round(e.centerX), y: Math.round(e.centerY) } : {
      x: Math.round(e.centerX + t * d),
      y: Math.round(e.centerY + a * d)
    };
  }
  function Be(e) {
    return Number.isFinite(e == null ? void 0 : e.x) && Number.isFinite(e == null ? void 0 : e.y);
  }
  function ve(e) {
    var t, a, r, u, d;
    const i = globalThis.Dialog ?? ((r = (a = (t = globalThis.foundry) == null ? void 0 : t.appv1) == null ? void 0 : a.api) == null ? void 0 : r.Dialog);
    return i != null && i.confirm ? i.confirm(e) : Promise.resolve((d = globalThis.confirm) == null ? void 0 : d.call(globalThis, ((u = e.content) == null ? void 0 : u.replace(/<[^>]+>/g, "")) ?? e.title));
  }
})();
