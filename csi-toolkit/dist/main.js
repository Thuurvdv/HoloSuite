var Ye = Object.defineProperty;
var Ge = (s, l, g) => l in s ? Ye(s, l, { enumerable: !0, configurable: !0, writable: !0, value: g }) : s[l] = g;
var w = (s, l, g) => Ge(s, typeof l != "symbol" ? l + "" : l, g);
const Se = ["open", "cold", "solved", "classified"], R = ["gm", "players"], ve = ["database", "noir"], se = ["physical", "digital", "biological", "weapon", "document", "testimony", "other"], oe = ["unknown", "relevant", "red_herring", "confirmed"], ae = ["unknown", "cleared", "person_of_interest", "prime_suspect", "arrested", "dead"], re = ["link", "supports", "contradicts", "location", "timeline", "identity"], ce = ["solid", "dashed", "dotted"], le = ["cyan", "green", "red", "amber", "violet", "orange", "white"], we = ["evidence", "suspects", "locations", "timeline", "connections"], Le = ["evidence", "suspects", "locations", "timeline", "connections"];
function O(s = {}, { forceNewId: l = !1 } = {}) {
  return {
    id: l ? D() : s.id || D(),
    title: String(s.title || "Untitled Case"),
    subtitle: String(s.subtitle || ""),
    status: E(s.status, Se, "open"),
    description: String(s.description || ""),
    image: String(s.image || ""),
    visibility: E(s.visibility, R, "players"),
    evidence: V(s.evidence, de),
    suspects: V(s.suspects, ue),
    locations: V(s.locations, me),
    timeline: V(s.timeline, fe),
    connections: V(s.connections, ee),
    boardLayout: z(s.boardLayout)
  };
}
function de(s = {}) {
  return {
    id: s.id || D(),
    title: String(s.title || "Untitled Evidence"),
    type: E(s.type, se, "other"),
    description: String(s.description || ""),
    image: String(s.image || ""),
    status: E(s.status, oe, "unknown"),
    visibility: E(s.visibility, R, "players"),
    hidden: !!s.hidden,
    notes: String(s.notes || "")
  };
}
function ue(s = {}) {
  return {
    id: s.id || D(),
    name: String(s.name || "Unknown Suspect"),
    alias: String(s.alias || ""),
    image: String(s.image || ""),
    motive: String(s.motive || ""),
    alibi: String(s.alibi || ""),
    status: E(s.status, ae, "unknown"),
    visibility: E(s.visibility, R, "players"),
    hidden: !!s.hidden,
    notes: String(s.notes || "")
  };
}
function me(s = {}) {
  return {
    id: s.id || D(),
    name: String(s.name || "Unknown Location"),
    sceneId: String(s.sceneId || ""),
    image: String(s.image || ""),
    description: String(s.description || ""),
    visibility: E(s.visibility, R, "players"),
    hidden: !!s.hidden,
    notes: String(s.notes || "")
  };
}
function fe(s = {}) {
  return {
    id: s.id || D(),
    time: String(s.time || ""),
    title: String(s.title || "Timeline Event"),
    description: String(s.description || ""),
    linkedItemIds: Array.isArray(s.linkedItemIds) ? s.linkedItemIds.map(String) : [],
    visibility: E(s.visibility, R, "players"),
    hidden: !!s.hidden
  };
}
function ee(s = {}) {
  return {
    id: s.id || D(),
    fromId: String(s.fromId || ""),
    toId: String(s.toId || ""),
    label: String(s.label || ""),
    type: E(s.type, re, "link"),
    style: E(s.style, ce, "solid"),
    color: E(s.color, le, Fe(s.type)),
    visibility: E(s.visibility, R, "players")
  };
}
function z(s = {}) {
  var l, g, H;
  return {
    theme: E(s.theme, ve, "database"),
    view: {
      x: Number((l = s.view) == null ? void 0 : l.x) || 0,
      y: Number((g = s.view) == null ? void 0 : g.y) || 0,
      scale: Z(Number((H = s.view) == null ? void 0 : H.scale) || 1, 0.45, 1.8)
    },
    cards: Object.fromEntries(Object.entries(s.cards ?? {}).map(([Y, T]) => [Y, {
      x: Number(T == null ? void 0 : T.x) || 0,
      y: Number(T == null ? void 0 : T.y) || 0
    }]))
  };
}
function ze(s, l = "players", g = D()) {
  return s === "evidence" ? de({ id: g, visibility: l }) : s === "suspects" ? ue({ id: g, visibility: l }) : s === "locations" ? me({ id: g, visibility: l }) : s === "timeline" ? fe({ id: g, visibility: l }) : ee({ id: g, visibility: l });
}
function V(s, l) {
  return Array.isArray(s) ? s.map((g) => l(g)) : [];
}
function E(s, l, g) {
  return l.includes(s) ? s : g;
}
function D() {
  var s;
  return foundry.utils.randomID ? foundry.utils.randomID() : ((s = crypto.randomUUID) == null ? void 0 : s.call(crypto)) ?? Math.random().toString(36).slice(2, 12);
}
function Fe(s) {
  return s === "supports" ? "green" : s === "contradicts" ? "red" : s === "location" ? "amber" : s === "timeline" ? "violet" : s === "identity" ? "orange" : "cyan";
}
function Z(s, l, g) {
  return Math.min(g, Math.max(l, s));
}
function Re(s) {
  const {
    LegacyApplication: l,
    moduleId: g,
    moduleTitle: H,
    CSIBoardItemEditor: Y,
    getCase: T,
    prepareBoardData: b,
    openCaseManager: U,
    canUserEditBoard: B,
    publishSharedLayout: X,
    requestLayoutPublish: W,
    deleteBoardItem: A,
    saveCase: G,
    defaultBoardPosition: K,
    getRectEdgeAnchor: m,
    isFinitePoint: f,
    clearBoardApp: h
  } = s;
  return class extends l {
    constructor(n, r = {}) {
      super(r);
      w(this, "caseId");
      w(this, "playerMode");
      w(this, "_drag");
      w(this, "_pan");
      w(this, "_localLayout");
      w(this, "_layoutDraft");
      w(this, "_pendingConnection");
      w(this, "_contextBoardPosition");
      w(this, "_boundContextClose");
      w(this, "_dimmedKinds");
      w(this, "_saveTimer");
      w(this, "_boundDragMove");
      w(this, "_boundDragEnd");
      w(this, "_boundPanMove");
      w(this, "_boundPanEnd");
      this.caseId = n, this.playerMode = !!r.playerMode, this._drag = null, this._pan = null, this._localLayout = null, this._layoutDraft = null, this._pendingConnection = null, this._contextBoardPosition = null, this._boundContextClose = null, this._dimmedKinds = /* @__PURE__ */ new Set(), this._saveTimer = null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: "CSI Toolkit Case Board",
        template: `modules/${g}/templates/case-board.hbs`,
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
      const n = T(this.caseId), r = this.playerMode ? "Player Board" : "GM Board";
      return n ? `${n.title} - ${r}` : `CSI Toolkit - ${r}`;
    }
    async getData() {
      return b(this.caseId, { playerMode: this.playerMode, layoutOverride: this._localLayout });
    }
    activateListeners(n) {
      super.activateListeners(n), n.find("[data-action='open-manager']").on("click", () => U()), n.find("[data-action='refresh-board']").on("click", () => this._reloadSharedBoard()), n.find("[data-action='publish-layout']").on("click", () => this._publishLayout()), n.find("[data-action='zoom-in']").on("click", () => this._zoomBy(0.1)), n.find("[data-action='zoom-out']").on("click", () => this._zoomBy(-0.1)), n.find("[data-action='context-add-board-item']").on("click", (c) => this._addBoardItemFromContext(c)), n.find("[data-action='edit-card']").on("click", (c) => this._editCard(c.currentTarget.dataset.collection, c.currentTarget.dataset.itemId)), n.find("[data-action='delete-board-item']").on("click", (c) => this._deleteBoardItem(c.currentTarget.dataset.collection, c.currentTarget.dataset.itemId)), n.find("[data-action='move-timeline-item']").on("click", (c) => this._moveTimelineItem(c.currentTarget.dataset.itemId, c.currentTarget.dataset.direction)), n.find("[data-csi-connection-hit]").on("dblclick", (c) => this._editCard("connections", c.currentTarget.dataset.connectionId)), n.find("[data-action='start-connection']").on("click", (c) => this._startConnection(c)), n.find("[data-csi-dim-kind]").on("change", (c) => this._toggleDimKind(c.currentTarget));
      const r = n[0].querySelector("[data-csi-board-viewport]");
      r && (r.addEventListener("wheel", (c) => this._onWheel(c), { passive: !1 }), r.addEventListener("mousedown", (c) => this._onViewportMouseDown(c)), r.addEventListener("contextmenu", (c) => this._openContextMenu(c))), n.find("[data-csi-board-card]").on("mousedown", (c) => this._onCardMouseDown(c)), n.find("[data-csi-board-card]").on("click", (c) => this._completeConnection(c)), n.find(".csi-card-image").on("load", () => this._queueConnectionLineUpdate()), this._syncDimControls(), this._applyDimmedKinds(), this._queueConnectionLineUpdate();
    }
    _onCardMouseDown(n) {
      if (!B(this.caseId) || n.button !== 0 || n.target.closest("button")) return;
      const r = n.currentTarget, c = this._getView(), p = this._getLayout(), y = r.dataset.itemId, I = p.cards[y] ?? { x: Number(r.dataset.x) || 0, y: Number(r.dataset.y) || 0 };
      n.preventDefault(), this._drag = {
        itemId: y,
        card: r,
        startClientX: n.clientX,
        startClientY: n.clientY,
        startX: I.x,
        startY: I.y,
        scale: c.scale
      }, document.addEventListener("mousemove", this._boundDragMove = (N) => this._onCardDrag(N)), document.addEventListener("mouseup", this._boundDragEnd = () => this._endDrag());
    }
    _onCardDrag(n) {
      if (!this._drag) return;
      const r = Math.round(this._drag.startX + (n.clientX - this._drag.startClientX) / this._drag.scale), c = Math.round(this._drag.startY + (n.clientY - this._drag.startClientY) / this._drag.scale);
      this._drag.card.style.left = `${r}px`, this._drag.card.style.top = `${c}px`, this._drag.card.dataset.x = r, this._drag.card.dataset.y = c, this._updateConnectionLines();
    }
    _endDrag() {
      if (!this._drag) return;
      document.removeEventListener("mousemove", this._boundDragMove), document.removeEventListener("mouseup", this._boundDragEnd);
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
      const r = this._getView();
      n.preventDefault(), this._pan = {
        startClientX: n.clientX,
        startClientY: n.clientY,
        startX: r.x,
        startY: r.y
      }, document.addEventListener("mousemove", this._boundPanMove = (c) => this._onPan(c)), document.addEventListener("mouseup", this._boundPanEnd = () => this._endPan());
    }
    _onPan(n) {
      if (!this._pan) return;
      const r = this._getLayout();
      r.view.x = Math.round(this._pan.startX + n.clientX - this._pan.startClientX), r.view.y = Math.round(this._pan.startY + n.clientY - this._pan.startClientY), this._layoutDraft = r, this._applyView(r.view);
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
      const r = this._getLayout();
      r.view.scale = Z(Number(r.view.scale) + n, 0.45, 1.8), this._applyView(r.view), this._saveLayout(r);
    }
    _applyView(n) {
      var p, y;
      const r = (p = this.element[0]) == null ? void 0 : p.querySelector("[data-csi-board-canvas]");
      if (!r) return;
      r.style.transform = `translate(${n.x}px, ${n.y}px) scale(${n.scale})`;
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
      var r;
      if (!B(this.caseId)) return;
      const n = this._getLayout();
      if ((r = game.user) != null && r.isGM) {
        await X(this.caseId, n);
        return;
      }
      await W(this.caseId, n);
    }
    _reloadSharedBoard() {
      this._localLayout = null, this._layoutDraft = null, this.render(!0);
    }
    _updateConnectionLines() {
      const n = this.element[0];
      if (!n) return;
      const r = new Map(Array.from(n.querySelectorAll("[data-csi-board-card]")).map((c) => [c.dataset.itemId, c]));
      for (const c of n.querySelectorAll("[data-csi-connection-group]")) {
        const p = r.get(c.dataset.fromId), y = r.get(c.dataset.toId);
        if (!p || !y) continue;
        const I = this._getCardBoardRect(p), N = this._getCardBoardRect(y), x = m(I, N), P = m(N, I);
        if (!f(x) || !f(P)) continue;
        for (const q of c.querySelectorAll("[data-csi-connection-line], [data-csi-connection-hit]"))
          q.setAttribute("x1", x.x), q.setAttribute("y1", x.y), q.setAttribute("x2", P.x), q.setAttribute("y2", P.y);
        const F = c.querySelector("[data-csi-connection-label]");
        F && (F.setAttribute("x", Math.round((x.x + P.x) / 2)), F.setAttribute("y", Math.round((x.y + P.y) / 2 - 10)));
      }
    }
    _queueConnectionLineUpdate() {
      const n = () => this._updateConnectionLines();
      globalThis.requestAnimationFrame ? globalThis.requestAnimationFrame(n) : globalThis.setTimeout(n, 0);
    }
    _getCardBoardRect(n) {
      const r = Number(n.dataset.x) || Number.parseFloat(n.style.left) || 0, c = Number(n.dataset.y) || Number.parseFloat(n.style.top) || 0, p = n.offsetWidth || 220, y = n.offsetHeight || 246;
      return {
        x: r,
        y: c,
        width: p,
        height: y,
        centerX: r + p / 2,
        centerY: c + y / 2
      };
    }
    _editCard(n, r) {
      B(this.caseId) && new Y(this.caseId, n, r).render(!0);
    }
    async _deleteBoardItem(n, r) {
      !B(this.caseId) || !we.includes(n) || !r || await A(this.caseId, n, r);
    }
    async _moveTimelineItem(n, r) {
      var x;
      if (!B(this.caseId) || !n) return;
      const c = T(this.caseId), p = ((x = c == null ? void 0 : c.timeline) == null ? void 0 : x.findIndex((P) => P.id === n)) ?? -1, I = p + (r === "up" ? -1 : r === "down" ? 1 : 0);
      if (!c || p < 0 || I < 0 || I >= c.timeline.length) return;
      const [N] = c.timeline.splice(p, 1);
      c.timeline.splice(I, 0, N), await G(c);
    }
    _toggleDimKind(n) {
      const r = n == null ? void 0 : n.value;
      ["evidence", "suspects", "locations", "timeline"].includes(r) && (n.checked ? this._dimmedKinds.add(r) : this._dimmedKinds.delete(r), this._applyDimmedKinds());
    }
    _syncDimControls() {
      var n;
      for (const r of ((n = this.element[0]) == null ? void 0 : n.querySelectorAll("[data-csi-dim-kind]")) ?? [])
        r.checked = this._dimmedKinds.has(r.value);
    }
    _applyDimmedKinds() {
      const n = this.element[0];
      if (n) {
        for (const r of n.querySelectorAll("[data-csi-board-card]"))
          r.classList.toggle("is-type-dimmed", this._dimmedKinds.has(r.dataset.collection));
        for (const r of n.querySelectorAll("[data-csi-timeline-row]"))
          r.classList.toggle("is-type-dimmed", this._dimmedKinds.has(r.dataset.collection));
      }
    }
    _addBoardItemFromContext(n) {
      n.preventDefault(), n.stopPropagation();
      const r = n.currentTarget.dataset.collection;
      this._addBoardItem(r, this._contextBoardPosition), this._hideContextMenu();
    }
    _addBoardItem(n = "evidence", r = null) {
      B(this.caseId) && Le.includes(n) && new Y(this.caseId, n, null, { boardPosition: r }).render(!0);
    }
    _openContextMenu(n) {
      var x, P;
      if (!B(this.caseId) || n.target.closest("[data-csi-board-card], button, input, select, textarea")) return;
      const r = (x = this.element[0]) == null ? void 0 : x.querySelector("[data-csi-context-menu]"), c = (P = this.element[0]) == null ? void 0 : P.querySelector("[data-csi-board-viewport]");
      if (!r || !c) return;
      n.preventDefault(), n.stopPropagation(), this._contextBoardPosition = this._clientToBoardPosition(n.clientX, n.clientY), r.hidden = !1;
      const p = r.offsetWidth || 156, y = r.offsetHeight || 180, I = Math.max(4, globalThis.innerWidth - p - 4), N = Math.max(4, globalThis.innerHeight - y - 4);
      r.style.left = `${Z(n.clientX, 4, I)}px`, r.style.top = `${Z(n.clientY, 4, N)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu() {
      var r;
      const n = (r = this.element[0]) == null ? void 0 : r.querySelector("[data-csi-context-menu]");
      n && (n.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    _clientToBoardPosition(n, r) {
      var I;
      const c = (I = this.element[0]) == null ? void 0 : I.querySelector("[data-csi-board-viewport]"), p = c == null ? void 0 : c.getBoundingClientRect(), y = this._getView();
      return p ? {
        x: Math.round((n - p.left - y.x) / y.scale - 220 / 2),
        y: Math.round((r - p.top - y.y) / y.scale - 32)
      } : null;
    }
    _startConnection(n) {
      var p;
      if (n.preventDefault(), n.stopPropagation(), !B(this.caseId)) return;
      const c = n.currentTarget.dataset.itemId;
      if (c) {
        this._pendingConnection = { fromId: c };
        for (const y of this.element[0].querySelectorAll("[data-csi-board-card]")) y.classList.toggle("is-link-source", y.dataset.itemId === c);
        (p = ui.notifications) == null || p.info(`${H}: Select another card to create a connection.`);
      }
    }
    async _completeConnection(n) {
      if (!this._pendingConnection || n.target.closest("button, input, select, textarea") || !B(this.caseId)) return;
      const r = n.currentTarget.dataset.itemId, c = this._pendingConnection.fromId;
      this._pendingConnection = null;
      for (const I of this.element[0].querySelectorAll("[data-csi-board-card]")) I.classList.remove("is-link-source");
      if (!r || r === c) return;
      const p = T(this.caseId);
      if (!p) return;
      const y = ee({
        id: D(),
        fromId: c,
        toId: r,
        label: "linked to",
        type: "link",
        style: "solid",
        color: "cyan",
        visibility: "players"
      });
      p.connections.push(y), await G(p), new Y(this.caseId, "connections", y.id).render(!0);
    }
    async close(n = {}) {
      return this._hideContextMenu(), h(this), super.close(n);
    }
  };
}
function Ue(s) {
  const {
    LegacyApplication: l,
    moduleId: g,
    moduleTitle: H,
    singularLabel: Y,
    getItemTitle: T,
    getCase: b,
    buildItemChoices: U,
    parseItemElement: B,
    saveCase: X,
    deleteBoardItem: W,
    defaultBoardPosition: A
  } = s;
  return class extends l {
    constructor(m, f, h, _ = {}) {
      super(_);
      w(this, "caseId");
      w(this, "collection");
      w(this, "itemId");
      w(this, "isNew");
      w(this, "boardPosition");
      this.caseId = m, this.collection = f, this.itemId = h || D(), this.isNew = !h, this.boardPosition = _.boardPosition ? {
        x: Number(_.boardPosition.x) || 0,
        y: Number(_.boardPosition.y) || 0
      } : null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: "Edit CSI Board Card",
        template: `modules/${g}/templates/board-item-editor.hbs`,
        classes: ["csi-toolkit", "csi-board-item-editor"],
        width: 560,
        height: 520,
        resizable: !0
      });
    }
    get title() {
      const m = this._getItem();
      return this.isNew ? `Add ${Y(this.collection)}` : m ? `Edit ${T(m, this.collection)}` : "Edit CSI Board Card";
    }
    async getData() {
      var h;
      const m = b(this.caseId), f = this._getItem();
      return {
        caseId: this.caseId,
        collection: this.collection,
        item: f,
        isNew: this.isNew,
        itemChoices: m ? U(m, !((h = game.user) != null && h.isGM)) : [],
        isEvidence: this.collection === "evidence",
        isSuspect: this.collection === "suspects",
        isLocation: this.collection === "locations",
        isTimeline: this.collection === "timeline",
        isConnection: this.collection === "connections",
        options: {
          evidenceTypes: se,
          evidenceStatuses: oe,
          suspectStatuses: ae,
          connectionTypes: re,
          connectionStyles: ce,
          connectionColors: le
        }
      };
    }
    activateListeners(m) {
      var _, $;
      super.activateListeners(m);
      const f = m[0], h = (_ = f == null ? void 0 : f.matches) != null && _.call(f, "[data-csi-board-item-form]") ? f : ($ = f == null ? void 0 : f.querySelector) == null ? void 0 : $.call(f, "[data-csi-board-item-form]");
      h && h.addEventListener("submit", (n) => this._save(n)), m.find("[data-action='pick-image']").on("click", (n) => this._pickImage(n.currentTarget)), m.find("[data-action='delete-board-item']").on("click", (n) => this._delete(n));
    }
    _getItem() {
      var h;
      const m = b(this.caseId), f = (h = m == null ? void 0 : m[this.collection]) == null ? void 0 : h.find((_) => _.id === this.itemId);
      return f || (this.isNew ? ze(this.collection, "players", this.itemId) : null);
    }
    async _save(m) {
      var n, r, c;
      m.preventDefault(), m.stopPropagation(), (n = m.stopImmediatePropagation) == null || n.call(m);
      const f = m.currentTarget, h = b(this.caseId);
      if (!h)
        return (r = ui.notifications) == null || r.warn(`${H}: The case could not be found.`), !1;
      const _ = h[this.collection].findIndex((p) => p.id === this.itemId);
      if (_ < 0 && !this.isNew)
        return (c = ui.notifications) == null || c.warn(`${H}: The item could not be found.`), !1;
      const $ = B(this.collection, f);
      return $.id = this.itemId, $.visibility = "players", $.hidden = _ >= 0 ? !!h[this.collection][_].hidden : !1, _ >= 0 ? h[this.collection][_] = $ : h[this.collection].push($), this.isNew && this.collection !== "connections" && (h.boardLayout.cards[this.itemId] = this.boardPosition ?? A(h.evidence.length + h.suspects.length + h.locations.length + h.timeline.length)), await X(h), this.close(), !1;
    }
    async _delete(m) {
      var h;
      return m.preventDefault(), m.stopPropagation(), (h = m.stopImmediatePropagation) == null || h.call(m), this.isNew || await W(this.caseId, this.collection, this.itemId, { confirm: !0 }) && this.close(), !1;
    }
    _pickImage(m) {
      var _, $, n, r;
      const f = (_ = m.closest(".csi-image-field")) == null ? void 0 : _.querySelector("input"), h = globalThis.FilePicker ?? ((r = (n = ($ = globalThis.foundry) == null ? void 0 : $.applications) == null ? void 0 : n.apps) == null ? void 0 : r.FilePicker);
      !f || !h || new h({
        type: "image",
        current: f.value,
        callback: (c) => {
          f.value = c, f.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).render(!0);
    }
  };
}
(() => {
  var _e, Ie;
  const s = "csi-toolkit", l = "CSI Toolkit", g = `module.${s}`, H = `modules/${s}/samples/glass-orchid.json`, Y = [
    `modules/${s}/templates/case-manager.hbs`,
    `modules/${s}/templates/case-browser.hbs`,
    `modules/${s}/templates/case-board.hbs`,
    `modules/${s}/templates/item-card.hbs`,
    `modules/${s}/templates/board-item-editor.hbs`
  ], T = globalThis.Application ?? ((Ie = (_e = foundry.appv1) == null ? void 0 : _e.api) == null ? void 0 : Ie.Application), b = {
    manager: null,
    browser: null,
    boards: /* @__PURE__ */ new Map(),
    playerBoard: null
  };
  Hooks.once("init", async () => {
    U(), B(), await loadTemplates(Y), console.log(`${l} | Initialized`);
  }), Hooks.once("ready", () => {
    game.csiToolkit = X();
    const e = game.modules.get(s);
    e && (e.api = game.csiToolkit), W(), game.socket.on(g, Te), console.log(`${l} | API available at game.csiToolkit`);
  });
  function U() {
    game.settings.register(s, "cases", {
      name: "CSI Toolkit Cases",
      hint: "Stores all investigation cases for this world.",
      scope: "world",
      config: !1,
      type: Object,
      default: {}
    });
  }
  function B() {
    Handlebars.registerHelper("csiEq", (e, t) => e === t), Handlebars.registerHelper("csiLabel", (e) => ie(e)), Handlebars.registerHelper("csiCount", (e) => Array.isArray(e) ? e.length : 0), Handlebars.registerHelper("csiFallback", (e, t) => e || t), Handlebars.registerHelper("csiJoin", (e) => Array.isArray(e) ? e.join(", ") : ""), Handlebars.registerHelper("csiOption", (e, t) => e === t ? "selected" : ""), Handlebars.registerHelper("csiChecked", (e) => e === "players" ? "checked" : "");
  }
  function X() {
    return {
      openCaseBoard: (e, t = {}) => x(e, t),
      openCaseManager: () => I(),
      openCaseBrowser: () => N(),
      createCase: (e) => _(e),
      getCases: () => A(),
      exportCase: (e) => y(e),
      importCase: (e) => c(e),
      importSampleCase: () => p()
    };
  }
  function W() {
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
        return (i = game.user) != null && i.isGM ? I() : N();
      }
    }), !0) : !1;
  }
  function A() {
    return ge(game.settings.get(s, "cases") ?? {});
  }
  async function G(e) {
    return game.settings.set(s, "cases", e ?? {});
  }
  function K() {
    var t;
    return (((t = game.users) == null ? void 0 : t.contents) ?? Array.from(game.users ?? [])).some((i) => (i == null ? void 0 : i.isGM) && (i == null ? void 0 : i.active));
  }
  function m(e) {
    const t = A();
    return t[e] ? O(t[e]) : null;
  }
  async function f(e, { notify: t = !0, render: i = !0, updateReason: o = null, userName: a = null } = {}) {
    var C;
    const u = O(e);
    if (!((C = game.user) != null && C.isGM)) return h(u, { notify: t, render: i });
    const d = A();
    return d[u.id] = u, await G(d), t && q(u.id, { reason: o, userName: a }), i && Q(u.id), u;
  }
  async function h(e, { render: t = !0, notify: i = !0 } = {}) {
    var o, a, u, d, C, L;
    return (o = game.socket) != null && o.emit ? K() ? (game.socket.emit(g, {
      type: "save-case-request",
      caseData: e,
      userId: (d = game.user) == null ? void 0 : d.id,
      userName: (C = game.user) == null ? void 0 : C.name
    }), i && ((L = ui.notifications) == null || L.info(`${l}: Board update sent to the GM.`)), e) : ((u = ui.notifications) == null || u.warn(`${l}: No active GM is connected to save board changes.`), e) : ((a = ui.notifications) == null || a.warn(`${l}: A GM must be connected to save board changes.`), e);
  }
  async function _(e = {}) {
    var o;
    const t = O(e, { forceNewId: !e.id }), i = A();
    return i[t.id] = t, await G(i), q(t.id), (o = ui.notifications) == null || o.info(`${l}: Created case "${t.title}".`), t;
  }
  async function $(e) {
    var o;
    const t = A(), i = t[e];
    return i ? (delete t[e], await G(t), Pe(e), q(e), (o = ui.notifications) == null || o.info(`${l}: Deleted case "${i.title}".`), !0) : !1;
  }
  async function n(e, t, i, { confirm: o = !0 } = {}) {
    var C, L;
    if (!we.includes(t) || !i) return !1;
    const a = m(e);
    if (!a) return !1;
    const u = (C = a[t]) == null ? void 0 : C.find((S) => S.id === i);
    if (!u) return !1;
    const d = ye(u, t);
    return o && !await be({
      title: `Delete ${ie(ne(t))}`,
      content: `<p>Delete <strong>${Ce(d)}</strong>?${t === "connections" ? "" : " Any attached connections will also be deleted."}</p>`,
      yes: () => !0,
      no: () => !1,
      defaultYes: !1
    }) ? !1 : (a[t] = a[t].filter((S) => S.id !== i), t !== "connections" && (a.connections = a.connections.filter((S) => S.fromId !== i && S.toId !== i), a.timeline = a.timeline.map((S) => ({
      ...S,
      linkedItemIds: (S.linkedItemIds ?? []).filter((v) => v !== i)
    })), delete a.boardLayout.cards[i]), await f(a), (L = ui.notifications) == null || L.info(`${l}: Deleted "${d}".`), !0);
  }
  async function r(e) {
    var a;
    const t = m(e);
    if (!t) return null;
    const i = O({
      ...t,
      id: D(),
      title: `${t.title} Copy`
    }), o = A();
    return o[i.id] = i, await G(o), q(i.id), (a = ui.notifications) == null || a.info(`${l}: Duplicated case "${t.title}".`), i;
  }
  async function c(e) {
    var o;
    const t = O({
      ...e,
      id: e.id || D()
    }), i = A();
    return i[t.id] && (t.id = D()), i[t.id] = t, await G(i), q(t.id), (o = ui.notifications) == null || o.info(`${l}: Imported case "${t.title}".`), t;
  }
  async function p() {
    const e = await fetch(H);
    if (!e.ok) throw new Error(`Could not load ${H}`);
    return c(await e.json());
  }
  function y(e) {
    const t = m(e);
    if (!t) return !1;
    const i = new Blob([JSON.stringify(t, null, 2)], { type: "application/json" }), o = URL.createObjectURL(i), a = document.createElement("a");
    return a.href = o, a.download = `${Oe(t.title)}.json`, a.click(), URL.revokeObjectURL(o), !0;
  }
  function I() {
    var e;
    return (e = game.user) != null && e.isGM ? (b.manager || (b.manager = new Me()), b.manager.render(!0), b.manager) : N();
  }
  function N() {
    return b.browser || (b.browser = new $e()), b.browser.render(!0), b.browser;
  }
  function x(e, t = {}) {
    var C, L, S;
    if (!e)
      return (C = ui.notifications) == null || C.warn(`${l}: No case id provided.`), null;
    if (!m(e))
      return (L = ui.notifications) == null || L.warn(`${l}: Case "${e}" was not found.`), null;
    const o = t.playerMode ?? !((S = game.user) != null && S.isGM), a = `${e}:${o ? "player" : "gm"}`, u = b.boards.get(a);
    if (u)
      return u.render(!0), u;
    const d = new ke(e, { playerMode: o });
    return b.boards.set(a, d), d.render(!0), d;
  }
  async function P(e, t) {
    var o, a, u, d, C, L;
    const i = z(t);
    return (o = game.socket) != null && o.emit ? K() ? (game.socket.emit(g, {
      type: "publish-layout-request",
      caseId: e,
      boardLayout: i,
      userId: (d = game.user) == null ? void 0 : d.id,
      userName: (C = game.user) == null ? void 0 : C.name
    }), (L = ui.notifications) == null || L.info(`${l}: Layout publish request sent to the GM.`), !0) : ((u = ui.notifications) == null || u.warn(`${l}: No active GM is connected to publish the board layout.`), !1) : ((a = ui.notifications) == null || a.warn(`${l}: A GM must be connected to publish the board layout.`), !1);
  }
  async function F(e, t, { userId: i = ((a) => (a = game.user) == null ? void 0 : a.id)(), userName: o = ((u) => (u = game.user) == null ? void 0 : u.name)() } = {}) {
    var S;
    const d = m(e);
    if (!d) return !1;
    const C = z(d.boardLayout), L = z(t);
    return d.boardLayout = z({
      ...C,
      cards: L.cards
    }), await f(d, {
      render: !1,
      updateReason: "layout-published",
      userName: o
    }), Q(e, { resetLayout: !0 }), (S = ui.notifications) == null || S.info(`${l}: Published shared board layout${o ? ` from ${o}` : ""}.`), !0;
  }
  function q(e, { reason: t = null, userName: i = null } = {}) {
    var o, a;
    (a = game.socket) == null || a.emit(g, { type: "case-updated", caseId: e, reason: t, userName: i, userId: (o = game.user) == null ? void 0 : o.id });
  }
  function Te(e) {
    var t, i, o, a;
    if (e) {
      if (e.type === "save-case-request") {
        if (!((t = game.user) != null && t.isGM) || !e.caseData) return;
        f(e.caseData, { render: !1 }).then((u) => {
          var d;
          u && (Q(u.id), (d = ui.notifications) == null || d.info(`${l}: Saved player board update from ${e.userName ?? "a player"}.`));
        }).catch((u) => {
          var d;
          console.error(`${l} | Could not save player board update`, u), (d = ui.notifications) == null || d.error(`${l}: Player board update could not be saved.`);
        });
        return;
      }
      if (e.type === "publish-layout-request") {
        if (!((i = game.user) != null && i.isGM) || !e.caseId || !e.boardLayout) return;
        F(e.caseId, e.boardLayout, {
          userId: e.userId,
          userName: e.userName
        }).catch((u) => {
          var d;
          console.error(`${l} | Could not publish player layout`, u), (d = ui.notifications) == null || d.error(`${l}: Player layout could not be published.`);
        });
        return;
      }
      if (e.type === "case-updated" && e.caseId) {
        if (e.userId && e.userId === ((o = game.user) == null ? void 0 : o.id)) return;
        Q(e.caseId, { resetLayout: e.reason === "layout-published" }), e.reason === "layout-published" && ((a = ui.notifications) == null || a.info(`${l}: ${e.userName ?? "Someone"} published a shared board layout.`));
        return;
      }
    }
  }
  const xe = Ue({
    LegacyApplication: T,
    moduleId: s,
    moduleTitle: l,
    singularLabel: ne,
    getItemTitle: ye,
    getCase: m,
    buildItemChoices: he,
    parseItemElement: De,
    saveCase: f,
    deleteBoardItem: n,
    defaultBoardPosition: te
  }), ke = Re({
    LegacyApplication: T,
    moduleId: s,
    moduleTitle: l,
    CSIBoardItemEditor: xe,
    getCase: m,
    prepareBoardData: Be,
    openCaseManager: I,
    canUserEditBoard: pe,
    publishSharedLayout: F,
    requestLayoutPublish: P,
    deleteBoardItem: n,
    saveCase: f,
    defaultBoardPosition: te,
    getRectEdgeAnchor: He,
    isFinitePoint: qe,
    clearBoardApp: (e) => {
      b.boards.delete(`${e.caseId}:${e.playerMode ? "player" : "gm"}`), b.playerBoard === e && (b.playerBoard = null);
    }
  });
  class $e extends T {
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
        cases: Object.values(A()).map((o) => O(o)).sort((o, a) => o.title.localeCompare(a.title)),
        isGM: (i = game.user) == null ? void 0 : i.isGM,
        canContribute: Ne()
      };
    }
    activateListeners(t) {
      super.activateListeners(t), t.find("[data-action='open-board']").on("click", (i) => {
        var o;
        x(i.currentTarget.dataset.caseId, { playerMode: !((o = game.user) != null && o.isGM) });
      }), t.find("[data-action='open-manager']").on("click", () => I());
    }
    async close(t = {}) {
      return b.browser = null, super.close(t);
    }
  }
  class Me extends T {
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
      const t = A(), i = Object.values(t).map((d) => O(d)).sort((d, C) => d.title.localeCompare(C.title));
      !this.selectedCaseId && i.length && (this.selectedCaseId = i[0].id), this.selectedCaseId && !t[this.selectedCaseId] && (this.selectedCaseId = ((u = i[0]) == null ? void 0 : u.id) ?? null);
      const o = this.selectedCaseId ? O(t[this.selectedCaseId]) : null, a = o ? he(o) : [];
      return {
        cases: i,
        selected: o,
        itemChoices: a,
        options: {
          caseStatuses: Se,
          themes: ve,
          evidenceTypes: se,
          evidenceStatuses: oe,
          suspectStatuses: ae,
          connectionTypes: re,
          connectionStyles: ce,
          connectionColors: le
        }
      };
    }
    activateListeners(t) {
      super.activateListeners(t), t.find("[data-action='select-case']").on("click", (i) => {
        this.selectedCaseId = i.currentTarget.dataset.caseId, this.render(!1);
      }), t.find("[data-action='new-case']").on("click", () => this._createNewCase()), t.find("[data-csi-case-form]").on("submit", (i) => this._saveSelectedCase(i)), t.find("[data-action='save-case']").on("click", (i) => this._saveSelectedCase(i)), t.find("[data-action='delete-case']").on("click", () => this._deleteSelectedCase()), t.find("[data-action='duplicate-case']").on("click", () => this._duplicateSelectedCase()), t.find("[data-action='open-board']").on("click", () => x(this.selectedCaseId)), t.find("[data-action='pick-image']").on("click", (i) => this._pickImage(i.currentTarget)), t.find("[data-action='export-case']").on("click", () => y(this.selectedCaseId)), t.find("[data-action='import-case']").on("click", () => {
        var i;
        return (i = this.element[0].querySelector("[data-csi-import-file]")) == null ? void 0 : i.click();
      }), t.find("[data-csi-import-file]").on("change", (i) => this._importFromFile(i.currentTarget)), t.find("[data-action='import-sample']").on("click", () => this._importSample());
    }
    _readCurrentCase() {
      const t = this.element[0].querySelector("[data-csi-case-form]");
      return t ? Ee(t, this.selectedCaseId) : m(this.selectedCaseId);
    }
    async _createNewCase() {
      const t = await _({
        title: "New Investigation",
        subtitle: "Unfiled case",
        description: "Describe the incident, victim, premise, or central mystery.",
        visibility: "players"
      });
      this.selectedCaseId = t.id, this.render(!1);
    }
    async _saveSelectedCase(t) {
      var i, o;
      if (t.preventDefault(), !!this.selectedCaseId)
        try {
          const a = this._readCurrentCase();
          await f(a), this.selectedCaseId = a.id, (i = ui.notifications) == null || i.info(`${l}: Saved case "${a.title}".`), this.render(!1);
        } catch (a) {
          console.error(`${l} | Could not save case`, a), (o = ui.notifications) == null || o.error(`${l}: ${a.message}`);
        }
    }
    async _deleteSelectedCase() {
      if (!this.selectedCaseId) return;
      const t = m(this.selectedCaseId);
      !t || !await be({
        title: "Delete CSI Case",
        content: `<p>Delete <strong>${Ce(t.title)}</strong>? This cannot be undone.</p>`,
        yes: () => !0,
        no: () => !1,
        defaultYes: !1
      }) || (await $(this.selectedCaseId), this.selectedCaseId = null, this.render(!1));
    }
    async _duplicateSelectedCase() {
      if (!this.selectedCaseId) return;
      const t = await r(this.selectedCaseId);
      t && (this.selectedCaseId = t.id, this.render(!1));
    }
    _pickImage(t) {
      var a, u, d, C, L;
      const i = (a = t.closest(".csi-image-field")) == null ? void 0 : a.querySelector("input");
      if (!i) return;
      const o = globalThis.FilePicker ?? ((C = (d = (u = globalThis.foundry) == null ? void 0 : u.applications) == null ? void 0 : d.apps) == null ? void 0 : C.FilePicker);
      if (!o) {
        (L = ui.notifications) == null || L.warn(`${l}: Foundry FilePicker is unavailable.`);
        return;
      }
      new o({
        type: "image",
        current: i.value,
        callback: (S) => {
          i.value = S, i.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).render(!0);
    }
    async _importFromFile(t) {
      var o, a;
      const i = (o = t.files) == null ? void 0 : o[0];
      if (i)
        try {
          const u = await i.text(), d = await c(JSON.parse(u));
          this.selectedCaseId = d.id, this.render(!1);
        } catch (u) {
          console.error(`${l} | Import failed`, u), (a = ui.notifications) == null || a.error(`${l}: Import failed. ${u.message}`);
        } finally {
          t.value = "";
        }
    }
    async _importSample() {
      var t;
      try {
        const i = await p();
        this.selectedCaseId = i.id, this.render(!1);
      } catch (i) {
        console.error(`${l} | Sample import failed`, i), (t = ui.notifications) == null || t.error(`${l}: Could not import sample case.`);
      }
    }
    async close(t = {}) {
      return b.manager = null, super.close(t);
    }
  }
  function Ee(e, t) {
    const i = new FormData(e), o = m(t) ?? O({ id: t }), a = O({
      id: t,
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
    return O(a);
  }
  function De(e, t) {
    const i = (u) => {
      var d;
      return ((d = t.querySelector(`[name="${u}"]`)) == null ? void 0 : d.value) ?? "";
    }, o = "players", a = { id: t.dataset.itemId || D(), visibility: o };
    return e === "evidence" ? de({
      ...a,
      title: i("title"),
      type: i("type"),
      status: i("status"),
      description: i("description"),
      image: i("image"),
      notes: i("notes")
    }) : e === "suspects" ? ue({
      ...a,
      name: i("name"),
      alias: i("alias"),
      status: i("status"),
      motive: i("motive"),
      alibi: i("alibi"),
      image: i("image"),
      notes: i("notes")
    }) : e === "locations" ? me({
      ...a,
      name: i("name"),
      sceneId: i("sceneId"),
      image: i("image"),
      description: i("description"),
      notes: i("notes")
    }) : e === "timeline" ? fe({
      ...a,
      time: i("time"),
      title: i("title"),
      description: i("description"),
      linkedItemIds: i("linkedItemIds").split(",").map((u) => u.trim()).filter(Boolean)
    }) : ee({
      id: a.id,
      visibility: o,
      fromId: i("fromId"),
      toId: i("toId"),
      label: i("label"),
      type: i("type"),
      style: i("style"),
      color: i("color")
    });
  }
  function Be(e, { playerMode: t = !1, layoutOverride: i = null } = {}) {
    var L, S;
    const o = m(e);
    if (!o) return { isMissing: !0, playerMode: t, isGM: (L = game.user) == null ? void 0 : L.isGM };
    const a = ge(o);
    i && (a.boardLayout = z(i)), a.evidence = j(a.evidence), a.suspects = j(a.suspects), a.locations = j(a.locations), a.timeline = j(a.timeline);
    const u = Ae(a), d = new Map(u.map((v) => [v.id, v]));
    a.timeline = a.timeline.map((v) => ({
      ...v,
      linkedLabels: (v.linkedItemIds ?? []).map((M) => {
        var k;
        return (k = d.get(M)) == null ? void 0 : k.label;
      }).filter(Boolean)
    }));
    const C = j(a.connections).map((v) => {
      const M = d.get(v.fromId), k = d.get(v.toId);
      return {
        ...v,
        fromLabel: (M == null ? void 0 : M.label) ?? v.fromId,
        toLabel: (k == null ? void 0 : k.label) ?? v.toId,
        x1: M ? M.x + 220 / 2 : 0,
        y1: M ? M.y + 94 : 0,
        x2: k ? k.x + 220 / 2 : 0,
        y2: k ? k.y + 94 : 0,
        labelX: M && k ? Math.round((M.x + k.x + 220) / 2) : 0,
        labelY: M && k ? Math.round((M.y + k.y) / 2 + 84) : 0,
        typeClass: `csi-connection--${v.type}`,
        styleClass: `csi-connection-line--${v.style}`,
        colorClass: `csi-connection-color--${v.color}`,
        hasVisibleEnds: !!(M && k)
      };
    }).filter((v) => v.hasVisibleEnds);
    return {
      case: a,
      cards: u,
      connections: C,
      boardSize: { width: 5200, height: 3600 },
      viewStyle: `transform: translate(${a.boardLayout.view.x}px, ${a.boardLayout.view.y}px) scale(${a.boardLayout.view.scale});`,
      zoomPercent: Math.round(a.boardLayout.view.scale * 100),
      themeClass: `csi-theme-${a.boardLayout.theme}`,
      playerMode: t,
      isGM: (S = game.user) == null ? void 0 : S.isGM,
      canEditBoard: pe(o),
      addCollections: Le.map((v) => ({
        id: v,
        label: ie(ne(v))
      })),
      counts: {
        evidence: a.evidence.length,
        suspects: a.suspects.length,
        locations: a.locations.length,
        timeline: a.timeline.length,
        connections: C.length
      }
    };
  }
  function j(e) {
    return Array.isArray(e) ? e : [];
  }
  function Ae(e) {
    const t = z(e.boardLayout), i = [];
    for (const o of e.evidence) i.push(J(o, "evidence", "Evidence", o.title, t, i.length));
    for (const o of e.suspects) i.push(J(o, "suspects", "Suspect", o.name, t, i.length));
    for (const o of e.locations) i.push(J(o, "locations", "Location", o.name, t, i.length));
    for (const o of e.timeline) i.push(J(o, "timeline", "Timeline", o.title, t, i.length));
    return i;
  }
  function J(e, t, i, o, a, u) {
    const d = a.cards[e.id] ?? te(u);
    return {
      ...e,
      collection: t,
      kind: t === "suspects" ? "suspect" : t === "locations" ? "location" : t === "timeline" ? "timeline" : "evidence",
      kindLabel: i,
      label: o,
      x: Number(d.x) || 0,
      y: Number(d.y) || 0,
      layer: "public",
      style: `left: ${Number(d.x) || 0}px; top: ${Number(d.y) || 0}px;`
    };
  }
  function te(e) {
    return {
      x: 80 + e % 5 * 300,
      y: 90 + Math.floor(e / 5) * 330
    };
  }
  function he(e) {
    const t = [];
    for (const i of e.evidence) t.push({ id: i.id, label: `Evidence: ${i.title}` });
    for (const i of e.suspects) t.push({ id: i.id, label: `Suspect: ${i.name}` });
    for (const i of e.locations) t.push({ id: i.id, label: `Location: ${i.name}` });
    for (const i of e.timeline) t.push({ id: i.id, label: `Timeline: ${i.title}` });
    return t;
  }
  function Q(e, { resetLayout: t = !1 } = {}) {
    var i;
    (i = b.manager) != null && i.rendered && b.manager.render(!0);
    for (const [o, a] of b.boards.entries())
      t && o.startsWith(`${e}:`) && (a._localLayout = null), o.startsWith(`${e}:`) && a.rendered && a.render(!0);
  }
  function pe(e) {
    return !!(typeof e == "string" ? m(e) : e);
  }
  function Ne() {
    return !0;
  }
  function Pe(e) {
    for (const [t, i] of b.boards.entries())
      t.startsWith(`${e}:`) && i.close();
  }
  function ge(e) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(e) : JSON.parse(JSON.stringify(e));
  }
  function ie(e) {
    return String(e ?? "").replace(/_/g, " ").replace(/\b\w/g, (t) => t.toUpperCase());
  }
  function Oe(e) {
    return String(e || "case").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "case";
  }
  function ne(e) {
    return e === "suspects" ? "suspect" : e === "locations" ? "location" : e === "timeline" ? "timeline item" : e === "connections" ? "connection" : "evidence";
  }
  function ye(e, t) {
    return t === "connections" ? e.label || `${e.fromId} -> ${e.toId}` : t === "suspects" || t === "locations" ? e.name : e.title;
  }
  function He(e, t) {
    const i = t.centerX - e.centerX, o = t.centerY - e.centerY;
    if (!i && !o) return { x: Math.round(e.centerX), y: Math.round(e.centerY) };
    const a = i === 0 ? Number.POSITIVE_INFINITY : Math.abs(e.width / 2 / i), u = o === 0 ? Number.POSITIVE_INFINITY : Math.abs(e.height / 2 / o), d = Math.min(a, u);
    return !Number.isFinite(d) || d <= 0 ? { x: Math.round(e.centerX), y: Math.round(e.centerY) } : {
      x: Math.round(e.centerX + i * d),
      y: Math.round(e.centerY + o * d)
    };
  }
  function qe(e) {
    return Number.isFinite(e == null ? void 0 : e.x) && Number.isFinite(e == null ? void 0 : e.y);
  }
  function be(e) {
    var i, o, a, u, d;
    const t = globalThis.Dialog ?? ((a = (o = (i = globalThis.foundry) == null ? void 0 : i.appv1) == null ? void 0 : o.api) == null ? void 0 : a.Dialog);
    return t != null && t.confirm ? t.confirm(e) : Promise.resolve((d = globalThis.confirm) == null ? void 0 : d.call(globalThis, ((u = e.content) == null ? void 0 : u.replace(/<[^>]+>/g, "")) ?? e.title));
  }
  function Ce(e) {
    const t = document.createElement("div");
    return t.textContent = String(e ?? ""), t.innerHTML;
  }
})();
