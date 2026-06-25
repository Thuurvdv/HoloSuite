var Ae = Object.defineProperty;
var Be = (e, c, f) => c in e ? Ae(e, c, { enumerable: !0, configurable: !0, writable: !0, value: f }) : e[c] = f;
var x = (e, c, f) => Be(e, typeof c != "symbol" ? c + "" : c, f);
const Te = ["open", "cold", "solved", "classified"], J = ["gm", "players"], Le = ["database", "noir"], ce = ["physical", "digital", "biological", "weapon", "document", "testimony", "other"], le = ["unknown", "relevant", "red_herring", "confirmed"], de = ["unknown", "cleared", "person_of_interest", "prime_suspect", "arrested", "dead"], ue = ["link", "supports", "contradicts", "location", "timeline", "identity"], me = ["solid", "dashed", "dotted"], fe = ["cyan", "green", "red", "amber", "violet", "orange", "white"], xe = ["evidence", "suspects", "locations", "timeline", "connections"], Me = ["evidence", "suspects", "locations", "timeline", "connections"];
function z(e = {}, { forceNewId: c = !1 } = {}) {
  return {
    id: c ? H() : e.id || H(),
    title: String(e.title || "Untitled Case"),
    subtitle: String(e.subtitle || ""),
    status: P(e.status, Te, "open"),
    description: String(e.description || ""),
    image: String(e.image || ""),
    visibility: P(e.visibility, J, "players"),
    evidence: Z(e.evidence, he),
    suspects: Z(e.suspects, pe),
    locations: Z(e.locations, ge),
    timeline: Z(e.timeline, ye),
    connections: Z(e.connections, ne),
    boardLayout: X(e.boardLayout)
  };
}
function he(e = {}) {
  return {
    id: e.id || H(),
    title: String(e.title || "Untitled Evidence"),
    type: P(e.type, ce, "other"),
    description: String(e.description || ""),
    image: String(e.image || ""),
    status: P(e.status, le, "unknown"),
    visibility: P(e.visibility, J, "players"),
    hidden: !!e.hidden,
    notes: String(e.notes || "")
  };
}
function pe(e = {}) {
  return {
    id: e.id || H(),
    name: String(e.name || "Unknown Suspect"),
    alias: String(e.alias || ""),
    image: String(e.image || ""),
    motive: String(e.motive || ""),
    alibi: String(e.alibi || ""),
    status: P(e.status, de, "unknown"),
    visibility: P(e.visibility, J, "players"),
    hidden: !!e.hidden,
    notes: String(e.notes || "")
  };
}
function ge(e = {}) {
  return {
    id: e.id || H(),
    name: String(e.name || "Unknown Location"),
    sceneId: String(e.sceneId || ""),
    image: String(e.image || ""),
    description: String(e.description || ""),
    visibility: P(e.visibility, J, "players"),
    hidden: !!e.hidden,
    notes: String(e.notes || "")
  };
}
function ye(e = {}) {
  return {
    id: e.id || H(),
    time: String(e.time || ""),
    title: String(e.title || "Timeline Event"),
    description: String(e.description || ""),
    linkedItemIds: Array.isArray(e.linkedItemIds) ? e.linkedItemIds.map(String) : [],
    visibility: P(e.visibility, J, "players"),
    hidden: !!e.hidden
  };
}
function ne(e = {}) {
  return {
    id: e.id || H(),
    fromId: String(e.fromId || ""),
    toId: String(e.toId || ""),
    label: String(e.label || ""),
    type: P(e.type, ue, "link"),
    style: P(e.style, me, "solid"),
    color: P(e.color, fe, Oe(e.type)),
    visibility: P(e.visibility, J, "players")
  };
}
function X(e = {}) {
  var c, f, g;
  return {
    theme: P(e.theme, Le, "database"),
    view: {
      x: Number((c = e.view) == null ? void 0 : c.x) || 0,
      y: Number((f = e.view) == null ? void 0 : f.y) || 0,
      scale: se(Number((g = e.view) == null ? void 0 : g.scale) || 1, 0.45, 1.8)
    },
    cards: Object.fromEntries(Object.entries(e.cards ?? {}).map(([m, C]) => [m, {
      x: Number(C == null ? void 0 : C.x) || 0,
      y: Number(C == null ? void 0 : C.y) || 0
    }]))
  };
}
function Ne(e, c = "players", f = H()) {
  return e === "evidence" ? he({ id: f, visibility: c }) : e === "suspects" ? pe({ id: f, visibility: c }) : e === "locations" ? ge({ id: f, visibility: c }) : e === "timeline" ? ye({ id: f, visibility: c }) : ne({ id: f, visibility: c });
}
function Z(e, c) {
  return Array.isArray(e) ? e.map((f) => c(f)) : [];
}
function P(e, c, f) {
  return c.includes(e) ? e : f;
}
function H() {
  var e;
  return foundry.utils.randomID ? foundry.utils.randomID() : ((e = crypto.randomUUID) == null ? void 0 : e.call(crypto)) ?? Math.random().toString(36).slice(2, 12);
}
function Oe(e) {
  return e === "supports" ? "green" : e === "contradicts" ? "red" : e === "location" ? "amber" : e === "timeline" ? "violet" : e === "identity" ? "orange" : "cyan";
}
function se(e, c, f) {
  return Math.min(f, Math.max(c, e));
}
function Pe(e) {
  const {
    LegacyApplication: c,
    moduleId: f,
    moduleTitle: g,
    CSIBoardItemEditor: m,
    getCase: C,
    prepareBoardData: D,
    openCaseManager: v,
    canUserEditBoard: w,
    publishSharedLayout: E,
    requestLayoutPublish: F,
    deleteBoardItem: q,
    saveCase: U,
    defaultBoardPosition: K,
    getRectEdgeAnchor: h,
    isFinitePoint: y,
    clearBoardApp: p
  } = e;
  return class extends c {
    constructor(n, a = {}) {
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
      this.caseId = n, this.playerMode = !!a.playerMode, this._drag = null, this._pan = null, this._localLayout = null, this._layoutDraft = null, this._pendingConnection = null, this._contextBoardPosition = null, this._boundContextClose = null, this._dimmedKinds = /* @__PURE__ */ new Set(), this._saveTimer = null;
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
      const n = C(this.caseId), a = this.playerMode ? "Player Board" : "GM Board";
      return n ? `${n.title} - ${a}` : `CSI Toolkit - ${a}`;
    }
    async getData() {
      return D(this.caseId, { playerMode: this.playerMode, layoutOverride: this._localLayout });
    }
    activateListeners(n) {
      super.activateListeners(n), n.find("[data-action='open-manager']").on("click", () => v()), n.find("[data-action='refresh-board']").on("click", () => this._reloadSharedBoard()), n.find("[data-action='publish-layout']").on("click", () => this._publishLayout()), n.find("[data-action='zoom-in']").on("click", () => this._zoomBy(0.1)), n.find("[data-action='zoom-out']").on("click", () => this._zoomBy(-0.1)), n.find("[data-action='context-add-board-item']").on("click", (l) => this._addBoardItemFromContext(l)), n.find("[data-action='edit-card']").on("click", (l) => this._editCard(l.currentTarget.dataset.collection, l.currentTarget.dataset.itemId)), n.find("[data-action='delete-board-item']").on("click", (l) => this._deleteBoardItem(l.currentTarget.dataset.collection, l.currentTarget.dataset.itemId)), n.find("[data-action='move-timeline-item']").on("click", (l) => this._moveTimelineItem(l.currentTarget.dataset.itemId, l.currentTarget.dataset.direction)), n.find("[data-csi-connection-hit]").on("dblclick", (l) => this._editCard("connections", l.currentTarget.dataset.connectionId)), n.find("[data-action='start-connection']").on("click", (l) => this._startConnection(l)), n.find("[data-csi-dim-kind]").on("change", (l) => this._toggleDimKind(l.currentTarget));
      const a = n[0].querySelector("[data-csi-board-viewport]");
      a && (a.addEventListener("wheel", (l) => this._onWheel(l), { passive: !1 }), a.addEventListener("mousedown", (l) => this._onViewportMouseDown(l)), a.addEventListener("contextmenu", (l) => this._openContextMenu(l))), n.find("[data-csi-board-card]").on("mousedown", (l) => this._onCardMouseDown(l)), n.find("[data-csi-board-card]").on("click", (l) => this._completeConnection(l)), n.find(".csi-card-image").on("load", () => this._queueConnectionLineUpdate()), this._syncDimControls(), this._applyDimmedKinds(), this._queueConnectionLineUpdate();
    }
    _onCardMouseDown(n) {
      if (!w(this.caseId) || n.button !== 0 || n.target.closest("button")) return;
      const a = n.currentTarget, l = this._getView(), b = this._getLayout(), I = a.dataset.itemId, L = b.cards[I] ?? { x: Number(a.dataset.x) || 0, y: Number(a.dataset.y) || 0 };
      n.preventDefault(), this._drag = {
        itemId: I,
        card: a,
        startClientX: n.clientX,
        startClientY: n.clientY,
        startX: L.x,
        startY: L.y,
        scale: l.scale,
        x: L.x,
        y: L.y,
        frame: null,
        cards: this._getBoardCardMap(),
        connectionGroups: this._getConnectionGroupsForItem(I)
      }, document.addEventListener("mousemove", this._boundDragMove = (Y) => this._onCardDrag(Y)), document.addEventListener("mouseup", this._boundDragEnd = () => this._endDrag());
    }
    _onCardDrag(n) {
      if (!this._drag) return;
      const a = Math.round(this._drag.startX + (n.clientX - this._drag.startClientX) / this._drag.scale), l = Math.round(this._drag.startY + (n.clientY - this._drag.startClientY) / this._drag.scale);
      this._drag.x = a, this._drag.y = l, !this._drag.frame && (this._drag.frame = globalThis.requestAnimationFrame ? globalThis.requestAnimationFrame(() => this._flushCardDrag()) : globalThis.setTimeout(() => this._flushCardDrag(), 0));
    }
    _flushCardDrag() {
      this._drag && (this._drag.frame = null, this._applyCardDragPosition(this._drag.x, this._drag.y), this._updateConnectionLines(this._drag.connectionGroups, this._drag.cards));
    }
    _applyCardDragPosition(n, a) {
      this._drag && (this._drag.card.style.left = `${n}px`, this._drag.card.style.top = `${a}px`, this._drag.card.dataset.x = n, this._drag.card.dataset.y = a);
    }
    _endDrag() {
      var a;
      if (!this._drag) return;
      document.removeEventListener("mousemove", this._boundDragMove), document.removeEventListener("mouseup", this._boundDragEnd), this._drag.frame && (globalThis.cancelAnimationFrame ? globalThis.cancelAnimationFrame(this._drag.frame) : (a = globalThis.clearTimeout) == null || a.call(globalThis, this._drag.frame), this._drag.frame = null), this._applyCardDragPosition(this._drag.x, this._drag.y), this._updateConnectionLines(this._drag.connectionGroups, this._drag.cards);
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
      const a = this._getView();
      n.preventDefault(), this._pan = {
        startClientX: n.clientX,
        startClientY: n.clientY,
        startX: a.x,
        startY: a.y
      }, document.addEventListener("mousemove", this._boundPanMove = (l) => this._onPan(l)), document.addEventListener("mouseup", this._boundPanEnd = () => this._endPan());
    }
    _onPan(n) {
      if (!this._pan) return;
      const a = this._getLayout();
      a.view.x = Math.round(this._pan.startX + n.clientX - this._pan.startClientX), a.view.y = Math.round(this._pan.startY + n.clientY - this._pan.startClientY), this._layoutDraft = a, this._applyView(a.view);
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
      const a = this._getLayout();
      a.view.scale = se(Number(a.view.scale) + n, 0.45, 1.8), this._applyView(a.view), this._saveLayout(a);
    }
    _applyView(n) {
      var b, I;
      const a = (b = this.element[0]) == null ? void 0 : b.querySelector("[data-csi-board-canvas]");
      if (!a) return;
      a.style.transform = `translate(${n.x}px, ${n.y}px) scale(${n.scale})`;
      const l = (I = this.element[0]) == null ? void 0 : I.querySelector("[data-csi-zoom]");
      l && (l.textContent = `${Math.round(n.scale * 100)}%`);
    }
    _getView() {
      return this._getLayout().view;
    }
    _getLayout() {
      const n = C(this.caseId);
      return X(this._layoutDraft ?? this._localLayout ?? (n == null ? void 0 : n.boardLayout));
    }
    async _saveLayout(n) {
      this._localLayout = X(n);
    }
    async _publishLayout() {
      var a;
      if (!w(this.caseId)) return;
      const n = this._getLayout();
      if ((a = game.user) != null && a.isGM) {
        await E(this.caseId, n);
        return;
      }
      await F(this.caseId, n);
    }
    _reloadSharedBoard() {
      this._localLayout = null, this._layoutDraft = null, this.render(!0);
    }
    _getBoardCardMap() {
      const n = this.element[0];
      return n ? new Map(Array.from(n.querySelectorAll("[data-csi-board-card]")).map((a) => [a.dataset.itemId, a])) : /* @__PURE__ */ new Map();
    }
    _getConnectionGroupsForItem(n) {
      const a = this.element[0];
      return !a || !n ? [] : Array.from(a.querySelectorAll("[data-csi-connection-group]")).filter((l) => l.dataset.fromId === n || l.dataset.toId === n);
    }
    _updateConnectionLines(n = null, a = null) {
      const l = this.element[0];
      if (!l) return;
      const b = a ?? this._getBoardCardMap(), I = n ?? Array.from(l.querySelectorAll("[data-csi-connection-group]"));
      for (const L of I) {
        const Y = b.get(L.dataset.fromId), R = b.get(L.dataset.toId);
        if (!Y || !R) continue;
        const V = this._getCardBoardRect(Y), ee = this._getCardBoardRect(R), W = h(V, ee), G = h(ee, V);
        if (!y(W) || !y(G)) continue;
        for (const j of L.querySelectorAll("[data-csi-connection-line], [data-csi-connection-hit]"))
          j.setAttribute("x1", W.x), j.setAttribute("y1", W.y), j.setAttribute("x2", G.x), j.setAttribute("y2", G.y);
        const Q = L.querySelector("[data-csi-connection-label]");
        Q && (Q.setAttribute("x", Math.round((W.x + G.x) / 2)), Q.setAttribute("y", Math.round((W.y + G.y) / 2 - 10)));
      }
    }
    _queueConnectionLineUpdate() {
      const n = () => this._updateConnectionLines();
      globalThis.requestAnimationFrame ? globalThis.requestAnimationFrame(n) : globalThis.setTimeout(n, 0);
    }
    _getCardBoardRect(n) {
      const a = Number(n.dataset.x) || Number.parseFloat(n.style.left) || 0, l = Number(n.dataset.y) || Number.parseFloat(n.style.top) || 0, b = n.offsetWidth || 220, I = n.offsetHeight || 246;
      return {
        x: a,
        y: l,
        width: b,
        height: I,
        centerX: a + b / 2,
        centerY: l + I / 2
      };
    }
    _editCard(n, a) {
      w(this.caseId) && new m(this.caseId, n, a).render(!0);
    }
    async _deleteBoardItem(n, a) {
      !w(this.caseId) || !xe.includes(n) || !a || await q(this.caseId, n, a);
    }
    async _moveTimelineItem(n, a) {
      var R;
      if (!w(this.caseId) || !n) return;
      const l = C(this.caseId), b = ((R = l == null ? void 0 : l.timeline) == null ? void 0 : R.findIndex((V) => V.id === n)) ?? -1, L = b + (a === "up" ? -1 : a === "down" ? 1 : 0);
      if (!l || b < 0 || L < 0 || L >= l.timeline.length) return;
      const [Y] = l.timeline.splice(b, 1);
      l.timeline.splice(L, 0, Y), await U(l);
    }
    _toggleDimKind(n) {
      const a = n == null ? void 0 : n.value;
      ["evidence", "suspects", "locations", "timeline"].includes(a) && (n.checked ? this._dimmedKinds.add(a) : this._dimmedKinds.delete(a), this._applyDimmedKinds());
    }
    _syncDimControls() {
      var n;
      for (const a of ((n = this.element[0]) == null ? void 0 : n.querySelectorAll("[data-csi-dim-kind]")) ?? [])
        a.checked = this._dimmedKinds.has(a.value);
    }
    _applyDimmedKinds() {
      const n = this.element[0];
      if (n) {
        for (const a of n.querySelectorAll("[data-csi-board-card]"))
          a.classList.toggle("is-type-dimmed", this._dimmedKinds.has(a.dataset.collection));
        for (const a of n.querySelectorAll("[data-csi-timeline-row]"))
          a.classList.toggle("is-type-dimmed", this._dimmedKinds.has(a.dataset.collection));
      }
    }
    _addBoardItemFromContext(n) {
      n.preventDefault(), n.stopPropagation();
      const a = n.currentTarget.dataset.collection;
      this._addBoardItem(a, this._contextBoardPosition), this._hideContextMenu();
    }
    _addBoardItem(n = "evidence", a = null) {
      w(this.caseId) && Me.includes(n) && new m(this.caseId, n, null, { boardPosition: a }).render(!0);
    }
    _openContextMenu(n) {
      var R, V;
      if (!w(this.caseId) || n.target.closest("[data-csi-board-card], button, input, select, textarea")) return;
      const a = (R = this.element[0]) == null ? void 0 : R.querySelector("[data-csi-context-menu]"), l = (V = this.element[0]) == null ? void 0 : V.querySelector("[data-csi-board-viewport]");
      if (!a || !l) return;
      n.preventDefault(), n.stopPropagation(), this._contextBoardPosition = this._clientToBoardPosition(n.clientX, n.clientY), a.hidden = !1;
      const b = a.offsetWidth || 156, I = a.offsetHeight || 180, L = Math.max(4, globalThis.innerWidth - b - 4), Y = Math.max(4, globalThis.innerHeight - I - 4);
      a.style.left = `${se(n.clientX, 4, L)}px`, a.style.top = `${se(n.clientY, 4, Y)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu() {
      var a;
      const n = (a = this.element[0]) == null ? void 0 : a.querySelector("[data-csi-context-menu]");
      n && (n.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    _clientToBoardPosition(n, a) {
      var L;
      const l = (L = this.element[0]) == null ? void 0 : L.querySelector("[data-csi-board-viewport]"), b = l == null ? void 0 : l.getBoundingClientRect(), I = this._getView();
      return b ? {
        x: Math.round((n - b.left - I.x) / I.scale - 220 / 2),
        y: Math.round((a - b.top - I.y) / I.scale - 32)
      } : null;
    }
    _startConnection(n) {
      var b;
      if (n.preventDefault(), n.stopPropagation(), !w(this.caseId)) return;
      const l = n.currentTarget.dataset.itemId;
      if (l) {
        this._pendingConnection = { fromId: l };
        for (const I of this.element[0].querySelectorAll("[data-csi-board-card]")) I.classList.toggle("is-link-source", I.dataset.itemId === l);
        (b = ui.notifications) == null || b.info(`${g}: Select another card to create a connection.`);
      }
    }
    async _completeConnection(n) {
      if (!this._pendingConnection || n.target.closest("button, input, select, textarea") || !w(this.caseId)) return;
      const a = n.currentTarget.dataset.itemId, l = this._pendingConnection.fromId;
      this._pendingConnection = null;
      for (const L of this.element[0].querySelectorAll("[data-csi-board-card]")) L.classList.remove("is-link-source");
      if (!a || a === l) return;
      const b = C(this.caseId);
      if (!b) return;
      const I = ne({
        id: H(),
        fromId: l,
        toId: a,
        label: "linked to",
        type: "link",
        style: "solid",
        color: "cyan",
        visibility: "players"
      });
      b.connections.push(I), await U(b), new m(this.caseId, "connections", I.id).render(!0);
    }
    async close(n = {}) {
      return this._hideContextMenu(), p(this), super.close(n);
    }
  };
}
function He(e) {
  const {
    LegacyApplication: c,
    moduleId: f,
    moduleTitle: g,
    singularLabel: m,
    getItemTitle: C,
    getCase: D,
    buildItemChoices: v,
    parseItemElement: w,
    saveCase: E,
    deleteBoardItem: F,
    defaultBoardPosition: q
  } = e;
  return class extends c {
    constructor(h, y, p, T = {}) {
      super(T);
      x(this, "caseId");
      x(this, "collection");
      x(this, "itemId");
      x(this, "isNew");
      x(this, "boardPosition");
      this.caseId = h, this.collection = y, this.itemId = p || H(), this.isNew = !p, this.boardPosition = T.boardPosition ? {
        x: Number(T.boardPosition.x) || 0,
        y: Number(T.boardPosition.y) || 0
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
      return this.isNew ? `Add ${m(this.collection)}` : h ? `Edit ${C(h, this.collection)}` : "Edit CSI Board Card";
    }
    async getData() {
      var p;
      const h = D(this.caseId), y = this._getItem();
      return {
        caseId: this.caseId,
        collection: this.collection,
        item: y,
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
      var T, A;
      super.activateListeners(h);
      const y = h[0], p = (T = y == null ? void 0 : y.matches) != null && T.call(y, "[data-csi-board-item-form]") ? y : (A = y == null ? void 0 : y.querySelector) == null ? void 0 : A.call(y, "[data-csi-board-item-form]");
      p && p.addEventListener("submit", (n) => this._save(n)), h.find("[data-action='pick-image']").on("click", (n) => this._pickImage(n.currentTarget)), h.find("[data-action='delete-board-item']").on("click", (n) => this._delete(n));
    }
    _getItem() {
      var p;
      const h = D(this.caseId), y = (p = h == null ? void 0 : h[this.collection]) == null ? void 0 : p.find((T) => T.id === this.itemId);
      return y || (this.isNew ? Ne(this.collection, "players", this.itemId) : null);
    }
    async _save(h) {
      var n, a, l;
      h.preventDefault(), h.stopPropagation(), (n = h.stopImmediatePropagation) == null || n.call(h);
      const y = h.currentTarget, p = D(this.caseId);
      if (!p)
        return (a = ui.notifications) == null || a.warn(`${g}: The case could not be found.`), !1;
      const T = p[this.collection].findIndex((b) => b.id === this.itemId);
      if (T < 0 && !this.isNew)
        return (l = ui.notifications) == null || l.warn(`${g}: The item could not be found.`), !1;
      const A = w(this.collection, y);
      return A.id = this.itemId, A.visibility = "players", A.hidden = T >= 0 ? !!p[this.collection][T].hidden : !1, T >= 0 ? p[this.collection][T] = A : p[this.collection].push(A), this.isNew && this.collection !== "connections" && (p.boardLayout.cards[this.itemId] = this.boardPosition ?? q(p.evidence.length + p.suspects.length + p.locations.length + p.timeline.length)), await E(p), this.close(), !1;
    }
    async _delete(h) {
      var p;
      return h.preventDefault(), h.stopPropagation(), (p = h.stopImmediatePropagation) == null || p.call(h), this.isNew || await F(this.caseId, this.collection, this.itemId, { confirm: !0 }) && this.close(), !1;
    }
    _pickImage(h) {
      var T, A, n, a;
      const y = (T = h.closest(".csi-image-field")) == null ? void 0 : T.querySelector("input"), p = globalThis.FilePicker ?? ((a = (n = (A = globalThis.foundry) == null ? void 0 : A.applications) == null ? void 0 : n.apps) == null ? void 0 : a.FilePicker);
      !y || !p || new p({
        type: "image",
        current: y.value,
        callback: (l) => {
          y.value = l, y.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).render(!0);
    }
  };
}
const B = "csi-toolkit", _ = "CSI Toolkit", ie = `module.${B}`, Fe = [
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
  return String(e || "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function Ge(e) {
  return String(e || "case").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "case";
}
function ve(e) {
  const c = document.createElement("div");
  return c.textContent = String(e ?? ""), c.innerHTML;
}
function ze() {
  Handlebars.registerHelper("csiEq", (e, c) => e === c), Handlebars.registerHelper("csiLabel", (e) => re(e)), Handlebars.registerHelper("csiCount", (e) => Array.isArray(e) ? e.length : 0), Handlebars.registerHelper("csiFallback", (e, c) => e || c), Handlebars.registerHelper("csiJoin", (e) => Array.isArray(e) ? e.join(", ") : ""), Handlebars.registerHelper("csiOption", (e, c) => e === c ? "selected" : ""), Handlebars.registerHelper("csiChecked", (e) => e === "players" ? "checked" : "");
}
function Ye() {
  var e, c, f;
  return ((c = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : c.api) ?? ((f = foundry == null ? void 0 : foundry.applications) == null ? void 0 : f.api) ?? null;
}
function Re() {
  var e, c, f;
  return ((c = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : c.api) ?? ((f = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : f.api) ?? null;
}
function Ue(e = {}, c = {}) {
  var g, m, C;
  const f = ((m = (g = globalThis.foundry) == null ? void 0 : g.utils) == null ? void 0 : m.mergeObject) ?? ((C = foundry == null ? void 0 : foundry.utils) == null ? void 0 : C.mergeObject);
  return typeof f == "function" ? f(e, c, { inplace: !1 }) : { ...e, ...c };
}
function Ve() {
  var e, c, f, g, m;
  return ((f = (c = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : c.randomID) == null ? void 0 : f.call(c, 8)) ?? ((m = (g = foundry == null ? void 0 : foundry.utils) == null ? void 0 : g.randomID) == null ? void 0 : m.call(g, 8)) ?? Math.random().toString(36).slice(2, 10);
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
      var E, F, q;
      const C = typeof this.getData == "function" ? await this.getData() : {}, D = ((E = this._v1Options) == null ? void 0 : E.template) ?? ((F = this.options) == null ? void 0 : F.template) ?? ((q = this.constructor.defaultOptions) == null ? void 0 : q.template);
      if (!D) return document.createDocumentFragment();
      const v = await globalThis.renderTemplate(D, C), w = document.createElement("template");
      return w.innerHTML = v.trim(), w.content;
    }
    _activateV1Form(g) {
      var C, D;
      if (typeof this._updateObject != "function") return;
      const m = (C = g.matches) != null && C.call(g, "form") ? g : (D = g.querySelector) == null ? void 0 : D.call(g, "form");
      m instanceof HTMLFormElement && m.addEventListener("submit", async (v) => {
        var E;
        v.preventDefault(), v.stopPropagation();
        const w = new FormData(m);
        await this._updateObject(v, w), ((E = this._v1Options) == null ? void 0 : E.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(g, m, C) {
      var F, q, U, K;
      m.replaceChildren(g);
      const D = globalThis.jQuery ?? globalThis.$, v = ((F = m.closest) == null ? void 0 : F.call(m, ".window-app, .app, .application")) ?? m, w = D ? D(v) : v;
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
      const E = (q = this._v1Options) == null ? void 0 : q.classes;
      Array.isArray(E) && E.length && (m.classList.add(...E), (K = (U = m.closest) == null ? void 0 : U.call(m, ".window-app, .app, .application")) == null || K.classList.add(...E)), this._activateV1Form(m), typeof this.activateListeners == "function" && this.activateListeners(D ? D(m) : m);
    }
  };
}
function Xe() {
  const e = Ye(), c = Re(), f = globalThis.Application ?? (c == null ? void 0 : c.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (c == null ? void 0 : c.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (f) return f;
  const g = e == null ? void 0 : e.ApplicationV2;
  return g ? je(g) : null;
}
(() => {
  const e = Xe(), c = {
    manager: null,
    browser: null,
    boards: /* @__PURE__ */ new Map(),
    playerBoard: null
  };
  Hooks.once("init", async () => {
    qe(), ze(), await loadTemplates(Fe), console.log(`${_} | Initialized`);
  }), Hooks.once("ready", () => {
    game.csiToolkit = f();
    const t = game.modules.get(B);
    t && (t.api = game.csiToolkit), g(), game.socket.on(ie, b), console.log(`${_} | API available at game.csiToolkit`);
  });
  function f() {
    return {
      openCaseBoard: (t, s = {}) => A(t, s),
      openCaseManager: () => p(),
      openCaseBrowser: () => T(),
      createCase: (t) => F(t),
      getCases: () => m(),
      exportCase: (t) => y(t),
      importCase: (t) => h(t)
    };
  }
  function g() {
    const t = game.modules.get("holosuite-core"), s = t != null && t.active ? t.api : null;
    return s != null && s.registerApp ? (s.registerApp({
      id: B,
      title: "CSI Toolkit",
      icon: "fa-solid fa-fingerprint",
      premium: !1,
      featureId: B,
      description: "Open case files, evidence boards, and investigation tools.",
      open: () => {
        var i;
        return (i = game.user) != null && i.isGM ? p() : T();
      }
    }), !0) : !1;
  }
  function m() {
    return Ce(game.settings.get(B, "cases") ?? {});
  }
  async function C(t) {
    return game.settings.set(B, "cases", t ?? {});
  }
  function D() {
    var s;
    return (((s = game.users) == null ? void 0 : s.contents) ?? Array.from(game.users ?? [])).some((i) => (i == null ? void 0 : i.isGM) && (i == null ? void 0 : i.active));
  }
  function v(t) {
    const s = m();
    return s[t] ? z(s[t]) : null;
  }
  async function w(t, { notify: s = !0, render: i = !0, updateReason: o = null, userName: r = null } = {}) {
    var S;
    const u = z(t);
    if (!((S = game.user) != null && S.isGM)) return E(u, { notify: s, render: i });
    const d = m();
    return d[u.id] = u, await C(d), s && l(u.id, { reason: o, userName: r }), i && te(u.id), u;
  }
  async function E(t, { render: s = !0, notify: i = !0 } = {}) {
    var o, r, u, d, S, $;
    return (o = game.socket) != null && o.emit ? D() ? (game.socket.emit(ie, {
      type: "save-case-request",
      caseData: t,
      userId: (d = game.user) == null ? void 0 : d.id,
      userName: (S = game.user) == null ? void 0 : S.name
    }), i && (($ = ui.notifications) == null || $.info(`${_}: Board update sent to the GM.`)), t) : ((u = ui.notifications) == null || u.warn(`${_}: No active GM is connected to save board changes.`), t) : ((r = ui.notifications) == null || r.warn(`${_}: A GM must be connected to save board changes.`), t);
  }
  async function F(t = {}) {
    var o;
    const s = z(t, { forceNewId: !t.id }), i = m();
    return i[s.id] = s, await C(i), l(s.id), (o = ui.notifications) == null || o.info(`${_}: Created case "${s.title}".`), s;
  }
  async function q(t) {
    var o;
    const s = m(), i = s[t];
    return i ? (delete s[t], await C(s), De(t), l(t), (o = ui.notifications) == null || o.info(`${_}: Deleted case "${i.title}".`), !0) : !1;
  }
  async function U(t, s, i, { confirm: o = !0 } = {}) {
    var S, $;
    if (!xe.includes(s) || !i) return !1;
    const r = v(t);
    if (!r) return !1;
    const u = (S = r[s]) == null ? void 0 : S.find((M) => M.id === i);
    if (!u) return !1;
    const d = Ie(u, s);
    return o && !await we({
      title: `Delete ${re(oe(s))}`,
      content: `<p>Delete <strong>${ve(d)}</strong>?${s === "connections" ? "" : " Any attached connections will also be deleted."}</p>`,
      yes: () => !0,
      no: () => !1,
      defaultYes: !1
    }) ? !1 : (r[s] = r[s].filter((M) => M.id !== i), s !== "connections" && (r.connections = r.connections.filter((M) => M.fromId !== i && M.toId !== i), r.timeline = r.timeline.map((M) => ({
      ...M,
      linkedItemIds: (M.linkedItemIds ?? []).filter((k) => k !== i)
    })), delete r.boardLayout.cards[i]), await w(r), ($ = ui.notifications) == null || $.info(`${_}: Deleted "${d}".`), !0);
  }
  async function K(t) {
    var r;
    const s = v(t);
    if (!s) return null;
    const i = z({
      ...s,
      id: H(),
      title: `${s.title} Copy`
    }), o = m();
    return o[i.id] = i, await C(o), l(i.id), (r = ui.notifications) == null || r.info(`${_}: Duplicated case "${s.title}".`), i;
  }
  async function h(t) {
    var o;
    const s = z({
      ...t,
      id: t.id || H()
    }), i = m();
    return i[s.id] && (s.id = H()), i[s.id] = s, await C(i), l(s.id), (o = ui.notifications) == null || o.info(`${_}: Imported case "${s.title}".`), s;
  }
  function y(t) {
    const s = v(t);
    if (!s) return !1;
    const i = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" }), o = URL.createObjectURL(i), r = document.createElement("a");
    return r.href = o, r.download = `${Ge(s.title)}.json`, r.click(), URL.revokeObjectURL(o), !0;
  }
  function p() {
    var t;
    return (t = game.user) != null && t.isGM ? (c.manager || (c.manager = new R()), c.manager.render(!0), c.manager) : T();
  }
  function T() {
    return c.browser || (c.browser = new Y()), c.browser.render(!0), c.browser;
  }
  function A(t, s = {}) {
    var S, $, M;
    if (!t)
      return (S = ui.notifications) == null || S.warn(`${_}: No case id provided.`), null;
    if (!v(t))
      return ($ = ui.notifications) == null || $.warn(`${_}: Case "${t}" was not found.`), null;
    const o = s.playerMode ?? !((M = game.user) != null && M.isGM), r = `${t}:${o ? "player" : "gm"}`, u = c.boards.get(r);
    if (u)
      return u.render(!0), u;
    const d = new L(t, { playerMode: o });
    return c.boards.set(r, d), d.render(!0), d;
  }
  async function n(t, s) {
    var o, r, u, d, S, $;
    const i = X(s);
    return (o = game.socket) != null && o.emit ? D() ? (game.socket.emit(ie, {
      type: "publish-layout-request",
      caseId: t,
      boardLayout: i,
      userId: (d = game.user) == null ? void 0 : d.id,
      userName: (S = game.user) == null ? void 0 : S.name
    }), ($ = ui.notifications) == null || $.info(`${_}: Layout publish request sent to the GM.`), !0) : ((u = ui.notifications) == null || u.warn(`${_}: No active GM is connected to publish the board layout.`), !1) : ((r = ui.notifications) == null || r.warn(`${_}: A GM must be connected to publish the board layout.`), !1);
  }
  async function a(t, s, { userId: i = ((r) => (r = game.user) == null ? void 0 : r.id)(), userName: o = ((u) => (u = game.user) == null ? void 0 : u.name)() } = {}) {
    var M;
    const d = v(t);
    if (!d) return !1;
    const S = X(d.boardLayout), $ = X(s);
    return d.boardLayout = X({
      ...S,
      cards: $.cards
    }), await w(d, {
      render: !1,
      updateReason: "layout-published",
      userName: o
    }), te(t, { resetLayout: !0 }), (M = ui.notifications) == null || M.info(`${_}: Published shared board layout${o ? ` from ${o}` : ""}.`), !0;
  }
  function l(t, { reason: s = null, userName: i = null } = {}) {
    var o, r;
    (r = game.socket) == null || r.emit(ie, { type: "case-updated", caseId: t, reason: s, userName: i, userId: (o = game.user) == null ? void 0 : o.id });
  }
  function b(t) {
    var s, i, o, r;
    if (t) {
      if (t.type === "save-case-request") {
        if (!((s = game.user) != null && s.isGM) || !t.caseData) return;
        w(t.caseData, { render: !1 }).then((u) => {
          var d;
          u && (te(u.id), (d = ui.notifications) == null || d.info(`${_}: Saved player board update from ${t.userName ?? "a player"}.`));
        }).catch((u) => {
          var d;
          console.error(`${_} | Could not save player board update`, u), (d = ui.notifications) == null || d.error(`${_}: Player board update could not be saved.`);
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
          console.error(`${_} | Could not publish player layout`, u), (d = ui.notifications) == null || d.error(`${_}: Player layout could not be published.`);
        });
        return;
      }
      if (t.type === "case-updated" && t.caseId) {
        if (t.userId && t.userId === ((o = game.user) == null ? void 0 : o.id)) return;
        te(t.caseId, { resetLayout: t.reason === "layout-published" }), t.reason === "layout-published" && ((r = ui.notifications) == null || r.info(`${_}: ${t.userName ?? "Someone"} published a shared board layout.`));
        return;
      }
    }
  }
  const I = He({
    LegacyApplication: e,
    moduleId: B,
    moduleTitle: _,
    singularLabel: oe,
    getItemTitle: Ie,
    getCase: v,
    buildItemChoices: be,
    parseItemElement: ee,
    saveCase: w,
    deleteBoardItem: U,
    defaultBoardPosition: ae
  }), L = Pe({
    LegacyApplication: e,
    moduleId: B,
    moduleTitle: _,
    CSIBoardItemEditor: I,
    getCase: v,
    prepareBoardData: W,
    openCaseManager: p,
    canUserEditBoard: _e,
    publishSharedLayout: a,
    requestLayoutPublish: n,
    deleteBoardItem: U,
    saveCase: w,
    defaultBoardPosition: ae,
    getRectEdgeAnchor: $e,
    isFinitePoint: Ee,
    clearBoardApp: (t) => {
      c.boards.delete(`${t.caseId}:${t.playerMode ? "player" : "gm"}`), c.playerBoard === t && (c.playerBoard = null);
    }
  });
  class Y extends e {
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
        cases: Object.values(m()).map((o) => z(o)).sort((o, r) => o.title.localeCompare(r.title)),
        isGM: (i = game.user) == null ? void 0 : i.isGM,
        canContribute: ke()
      };
    }
    activateListeners(s) {
      super.activateListeners(s), s.find("[data-action='open-board']").on("click", (i) => {
        var o;
        A(i.currentTarget.dataset.caseId, { playerMode: !((o = game.user) != null && o.isGM) });
      }), s.find("[data-action='open-manager']").on("click", () => p());
    }
    async close(s = {}) {
      return c.browser = null, super.close(s);
    }
  }
  class R extends e {
    constructor(s = {}) {
      super(s), this.selectedCaseId = s.caseId ?? null;
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
      const s = m(), i = Object.values(s).map((d) => z(d)).sort((d, S) => d.title.localeCompare(S.title));
      !this.selectedCaseId && i.length && (this.selectedCaseId = i[0].id), this.selectedCaseId && !s[this.selectedCaseId] && (this.selectedCaseId = ((u = i[0]) == null ? void 0 : u.id) ?? null);
      const o = this.selectedCaseId ? z(s[this.selectedCaseId]) : null, r = o ? be(o) : [];
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
    activateListeners(s) {
      super.activateListeners(s), s.find("[data-action='select-case']").on("click", (i) => {
        this.selectedCaseId = i.currentTarget.dataset.caseId, this.render(!1);
      }), s.find("[data-action='new-case']").on("click", () => this._createNewCase()), s.find("[data-csi-case-form]").on("submit", (i) => this._saveSelectedCase(i)), s.find("[data-action='save-case']").on("click", (i) => this._saveSelectedCase(i)), s.find("[data-action='delete-case']").on("click", () => this._deleteSelectedCase()), s.find("[data-action='duplicate-case']").on("click", () => this._duplicateSelectedCase()), s.find("[data-action='open-board']").on("click", () => A(this.selectedCaseId)), s.find("[data-action='pick-image']").on("click", (i) => this._pickImage(i.currentTarget)), s.find("[data-action='export-case']").on("click", () => y(this.selectedCaseId)), s.find("[data-action='import-case']").on("click", () => {
        var i;
        return (i = this.element[0].querySelector("[data-csi-import-file]")) == null ? void 0 : i.click();
      }), s.find("[data-csi-import-file]").on("change", (i) => this._importFromFile(i.currentTarget));
    }
    _readCurrentCase() {
      const s = this.element[0].querySelector("[data-csi-case-form]");
      return s ? V(s, this.selectedCaseId) : v(this.selectedCaseId);
    }
    async _createNewCase() {
      const s = await F({
        title: "New Investigation",
        subtitle: "Unfiled case",
        description: "Describe the incident, victim, premise, or central mystery.",
        visibility: "players"
      });
      this.selectedCaseId = s.id, this.render(!1);
    }
    async _saveSelectedCase(s) {
      var i, o;
      if (s.preventDefault(), !!this.selectedCaseId)
        try {
          const r = this._readCurrentCase();
          await w(r), this.selectedCaseId = r.id, (i = ui.notifications) == null || i.info(`${_}: Saved case "${r.title}".`), this.render(!1);
        } catch (r) {
          console.error(`${_} | Could not save case`, r), (o = ui.notifications) == null || o.error(`${_}: ${r.message}`);
        }
    }
    async _deleteSelectedCase() {
      if (!this.selectedCaseId) return;
      const s = v(this.selectedCaseId);
      !s || !await we({
        title: "Delete CSI Case",
        content: `<p>Delete <strong>${ve(s.title)}</strong>? This cannot be undone.</p>`,
        yes: () => !0,
        no: () => !1,
        defaultYes: !1
      }) || (await q(this.selectedCaseId), this.selectedCaseId = null, this.render(!1));
    }
    async _duplicateSelectedCase() {
      if (!this.selectedCaseId) return;
      const s = await K(this.selectedCaseId);
      s && (this.selectedCaseId = s.id, this.render(!1));
    }
    _pickImage(s) {
      var r, u, d, S, $;
      const i = (r = s.closest(".csi-image-field")) == null ? void 0 : r.querySelector("input");
      if (!i) return;
      const o = globalThis.FilePicker ?? ((S = (d = (u = globalThis.foundry) == null ? void 0 : u.applications) == null ? void 0 : d.apps) == null ? void 0 : S.FilePicker);
      if (!o) {
        ($ = ui.notifications) == null || $.warn(`${_}: Foundry FilePicker is unavailable.`);
        return;
      }
      new o({
        type: "image",
        current: i.value,
        callback: (M) => {
          i.value = M, i.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).render(!0);
    }
    async _importFromFile(s) {
      var o, r;
      const i = (o = s.files) == null ? void 0 : o[0];
      if (i)
        try {
          const u = await i.text(), d = await h(JSON.parse(u));
          this.selectedCaseId = d.id, this.render(!1);
        } catch (u) {
          console.error(`${_} | Import failed`, u), (r = ui.notifications) == null || r.error(`${_}: Import failed. ${u.message}`);
        } finally {
          s.value = "";
        }
    }
    async close(s = {}) {
      return c.manager = null, super.close(s);
    }
  }
  function V(t, s) {
    const i = new FormData(t), o = v(s) ?? z({ id: s }), r = z({
      id: s,
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
    return z(r);
  }
  function ee(t, s) {
    const i = (u) => {
      var d;
      return ((d = s.querySelector(`[name="${u}"]`)) == null ? void 0 : d.value) ?? "";
    }, o = "players", r = { id: s.dataset.itemId || H(), visibility: o };
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
  function W(t, { playerMode: s = !1, layoutOverride: i = null } = {}) {
    var $, M;
    const o = v(t);
    if (!o) return { isMissing: !0, playerMode: s, isGM: ($ = game.user) == null ? void 0 : $.isGM };
    const r = Ce(o);
    i && (r.boardLayout = X(i)), r.evidence = G(r.evidence), r.suspects = G(r.suspects), r.locations = G(r.locations), r.timeline = G(r.timeline);
    const u = Q(r), d = new Map(u.map((k) => [k.id, k]));
    r.timeline = r.timeline.map((k) => ({
      ...k,
      linkedLabels: (k.linkedItemIds ?? []).map((O) => {
        var N;
        return (N = d.get(O)) == null ? void 0 : N.label;
      }).filter(Boolean)
    }));
    const S = G(r.connections).map((k) => {
      const O = d.get(k.fromId), N = d.get(k.toId);
      return {
        ...k,
        fromLabel: (O == null ? void 0 : O.label) ?? k.fromId,
        toLabel: (N == null ? void 0 : N.label) ?? k.toId,
        x1: O ? O.x + 220 / 2 : 0,
        y1: O ? O.y + 94 : 0,
        x2: N ? N.x + 220 / 2 : 0,
        y2: N ? N.y + 94 : 0,
        labelX: O && N ? Math.round((O.x + N.x + 220) / 2) : 0,
        labelY: O && N ? Math.round((O.y + N.y) / 2 + 84) : 0,
        typeClass: `csi-connection--${k.type}`,
        styleClass: `csi-connection-line--${k.style}`,
        colorClass: `csi-connection-color--${k.color}`,
        hasVisibleEnds: !!(O && N)
      };
    }).filter((k) => k.hasVisibleEnds);
    return {
      case: r,
      cards: u,
      connections: S,
      boardSize: { width: 5200, height: 3600 },
      viewStyle: `transform: translate(${r.boardLayout.view.x}px, ${r.boardLayout.view.y}px) scale(${r.boardLayout.view.scale});`,
      zoomPercent: Math.round(r.boardLayout.view.scale * 100),
      themeClass: `csi-theme-${r.boardLayout.theme}`,
      playerMode: s,
      isGM: (M = game.user) == null ? void 0 : M.isGM,
      canEditBoard: _e(o),
      addCollections: Me.map((k) => ({
        id: k,
        label: re(oe(k))
      })),
      counts: {
        evidence: r.evidence.length,
        suspects: r.suspects.length,
        locations: r.locations.length,
        timeline: r.timeline.length,
        connections: S.length
      }
    };
  }
  function G(t) {
    return Array.isArray(t) ? t : [];
  }
  function Q(t) {
    const s = X(t.boardLayout), i = [];
    for (const o of t.evidence) i.push(j(o, "evidence", "Evidence", o.title, s, i.length));
    for (const o of t.suspects) i.push(j(o, "suspects", "Suspect", o.name, s, i.length));
    for (const o of t.locations) i.push(j(o, "locations", "Location", o.name, s, i.length));
    for (const o of t.timeline) i.push(j(o, "timeline", "Timeline", o.title, s, i.length));
    return i;
  }
  function j(t, s, i, o, r, u) {
    const d = r.cards[t.id] ?? ae(u);
    return {
      ...t,
      collection: s,
      kind: s === "suspects" ? "suspect" : s === "locations" ? "location" : s === "timeline" ? "timeline" : "evidence",
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
    const s = [];
    for (const i of t.evidence) s.push({ id: i.id, label: `Evidence: ${i.title}` });
    for (const i of t.suspects) s.push({ id: i.id, label: `Suspect: ${i.name}` });
    for (const i of t.locations) s.push({ id: i.id, label: `Location: ${i.name}` });
    for (const i of t.timeline) s.push({ id: i.id, label: `Timeline: ${i.title}` });
    return s;
  }
  function te(t, { resetLayout: s = !1 } = {}) {
    var i;
    (i = c.manager) != null && i.rendered && c.manager.render(!0);
    for (const [o, r] of c.boards.entries())
      s && o.startsWith(`${t}:`) && (r._localLayout = null), o.startsWith(`${t}:`) && r.rendered && r.render(!0);
  }
  function _e(t) {
    return !!(typeof t == "string" ? v(t) : t);
  }
  function ke() {
    return !0;
  }
  function De(t) {
    for (const [s, i] of c.boards.entries())
      s.startsWith(`${t}:`) && i.close();
  }
  function Ce(t) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(t) : JSON.parse(JSON.stringify(t));
  }
  function oe(t) {
    return t === "suspects" ? "suspect" : t === "locations" ? "location" : t === "timeline" ? "timeline item" : t === "connections" ? "connection" : "evidence";
  }
  function Ie(t, s) {
    return s === "connections" ? t.label || `${t.fromId} -> ${t.toId}` : s === "suspects" || s === "locations" ? t.name : t.title;
  }
  function $e(t, s) {
    const i = s.centerX - t.centerX, o = s.centerY - t.centerY;
    if (!i && !o) return { x: Math.round(t.centerX), y: Math.round(t.centerY) };
    const r = i === 0 ? Number.POSITIVE_INFINITY : Math.abs(t.width / 2 / i), u = o === 0 ? Number.POSITIVE_INFINITY : Math.abs(t.height / 2 / o), d = Math.min(r, u);
    return !Number.isFinite(d) || d <= 0 ? { x: Math.round(t.centerX), y: Math.round(t.centerY) } : {
      x: Math.round(t.centerX + i * d),
      y: Math.round(t.centerY + o * d)
    };
  }
  function Ee(t) {
    return Number.isFinite(t == null ? void 0 : t.x) && Number.isFinite(t == null ? void 0 : t.y);
  }
  function we(t) {
    var i, o, r, u, d;
    const s = globalThis.Dialog ?? ((r = (o = (i = globalThis.foundry) == null ? void 0 : i.appv1) == null ? void 0 : o.api) == null ? void 0 : r.Dialog);
    return s != null && s.confirm ? s.confirm(t) : Promise.resolve((d = globalThis.confirm) == null ? void 0 : d.call(globalThis, ((u = t.content) == null ? void 0 : u.replace(/<[^>]+>/g, "")) ?? t.title));
  }
})();
