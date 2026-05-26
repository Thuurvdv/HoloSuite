(() => {
  var ge, ye;
  const h = "csi-toolkit", u = "CSI Toolkit", J = `module.${h}`, Q = `modules/${h}/samples/glass-orchid.json`, be = [
    `modules/${h}/templates/case-manager.hbs`,
    `modules/${h}/templates/case-browser.hbs`,
    `modules/${h}/templates/case-board.hbs`,
    `modules/${h}/templates/item-card.hbs`,
    `modules/${h}/templates/board-item-editor.hbs`
  ], Z = ["open", "cold", "solved", "classified"], w = ["gm", "players"], ee = ["database", "noir"], A = ["physical", "digital", "biological", "weapon", "document", "testimony", "other"], P = ["unknown", "relevant", "red_herring", "confirmed"], O = ["unknown", "cleared", "person_of_interest", "prime_suspect", "arrested", "dead"], H = ["link", "supports", "contradicts", "location", "timeline", "identity"], Y = ["solid", "dashed", "dotted"], q = ["cyan", "green", "red", "amber", "violet", "orange", "white"], te = ["evidence", "suspects", "locations", "timeline", "connections"], ie = ["evidence", "suspects", "locations", "timeline", "connections"], x = 220, Ce = 246, _e = 5200, Ie = 3600, M = globalThis.Application ?? ((ye = (ge = foundry.appv1) == null ? void 0 : ge.api) == null ? void 0 : ye.Application), m = {
    manager: null,
    browser: null,
    boards: /* @__PURE__ */ new Map(),
    playerBoard: null
  };
  Hooks.once("init", async () => {
    we(), Se(), await loadTemplates(be), console.log(`${u} | Initialized`);
  }), Hooks.once("ready", () => {
    game.csiToolkit = ve();
    const i = game.modules.get(h);
    i && (i.api = game.csiToolkit), xe(), game.socket.on(J, Le), console.log(`${u} | API available at game.csiToolkit`);
  });
  function we() {
    game.settings.register(h, "cases", {
      name: "CSI Toolkit Cases",
      hint: "Stores all investigation cases for this world.",
      scope: "world",
      config: !1,
      type: Object,
      default: {}
    });
  }
  function Se() {
    Handlebars.registerHelper("csiEq", (i, e) => i === e), Handlebars.registerHelper("csiLabel", (i) => K(i)), Handlebars.registerHelper("csiCount", (i) => Array.isArray(i) ? i.length : 0), Handlebars.registerHelper("csiFallback", (i, e) => i || e), Handlebars.registerHelper("csiJoin", (i) => Array.isArray(i) ? i.join(", ") : ""), Handlebars.registerHelper("csiOption", (i, e) => i === e ? "selected" : ""), Handlebars.registerHelper("csiChecked", (i) => i === "players" ? "checked" : "");
  }
  function ve() {
    return {
      openCaseBoard: (i, e = {}) => U(i, e),
      openCaseManager: () => E(),
      openCaseBrowser: () => F(),
      createCase: (i) => se(i),
      getCases: () => _(),
      exportCase: (i) => ae(i),
      importCase: (i) => z(i),
      importSampleCase: () => oe()
    };
  }
  function xe() {
    const i = game.modules.get("holosuite-core"), e = i != null && i.active ? i.api : null;
    return e != null && e.registerApp ? (e.registerApp({
      id: h,
      title: "CSI Toolkit",
      icon: "fa-solid fa-fingerprint",
      premium: !1,
      featureId: h,
      description: "Open case files, evidence boards, and investigation tools.",
      open: () => {
        var t;
        return (t = game.user) != null && t.isGM ? E() : F();
      }
    }), !0) : !1;
  }
  function _() {
    return de(game.settings.get(h, "cases") ?? {});
  }
  async function T(i) {
    return game.settings.set(h, "cases", i ?? {});
  }
  function p(i) {
    const e = _();
    return e[i] ? C(e[i]) : null;
  }
  async function S(i, { notify: e = !0, render: t = !0 } = {}) {
    const s = C(i), n = _();
    return n[s.id] = s, await T(n), e && k(s.id), t && le(s.id), s;
  }
  async function se(i = {}) {
    var s;
    const e = C(i, { forceNewId: !i.id }), t = _();
    return t[e.id] = e, await T(t), k(e.id), (s = ui.notifications) == null || s.info(`${u}: Created case "${e.title}".`), e;
  }
  async function Te(i) {
    var s;
    const e = _(), t = e[i];
    return t ? (delete e[i], await T(e), He(i), k(i), (s = ui.notifications) == null || s.info(`${u}: Deleted case "${t.title}".`), !0) : !1;
  }
  async function ne(i, e, t, { confirm: s = !0 } = {}) {
    var c, l;
    if (!te.includes(e) || !t) return !1;
    const n = p(i);
    if (!n) return !1;
    const o = (c = n[e]) == null ? void 0 : c.find((r) => r.id === t);
    if (!o) return !1;
    const a = ue(o, e);
    return s && !await he({
      title: `Delete ${K(W(e))}`,
      content: `<p>Delete <strong>${pe(a)}</strong>?${e === "connections" ? "" : " Any attached connections will also be deleted."}</p>`,
      yes: () => !0,
      no: () => !1,
      defaultYes: !1
    }) ? !1 : (n[e] = n[e].filter((r) => r.id !== t), e !== "connections" && (n.connections = n.connections.filter((r) => r.fromId !== t && r.toId !== t), n.timeline = n.timeline.map((r) => ({
      ...r,
      linkedItemIds: (r.linkedItemIds ?? []).filter((d) => d !== t)
    })), delete n.boardLayout.cards[t]), await S(n), (l = ui.notifications) == null || l.info(`${u}: Deleted "${a}".`), !0);
  }
  async function ke(i) {
    var n;
    const e = p(i);
    if (!e) return null;
    const t = C({
      ...e,
      id: b(),
      title: `${e.title} Copy`
    }), s = _();
    return s[t.id] = t, await T(s), k(t.id), (n = ui.notifications) == null || n.info(`${u}: Duplicated case "${e.title}".`), t;
  }
  async function z(i) {
    var s;
    const e = C({
      ...i,
      id: i.id || b()
    }), t = _();
    return t[e.id] && (e.id = b()), t[e.id] = e, await T(t), k(e.id), (s = ui.notifications) == null || s.info(`${u}: Imported case "${e.title}".`), e;
  }
  async function oe() {
    const i = await fetch(Q);
    if (!i.ok) throw new Error(`Could not load ${Q}`);
    return z(await i.json());
  }
  function ae(i) {
    const e = p(i);
    if (!e) return !1;
    const t = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), s = URL.createObjectURL(t), n = document.createElement("a");
    return n.href = s, n.download = `${Ye(e.title)}.json`, n.click(), URL.revokeObjectURL(s), !0;
  }
  function E() {
    var i;
    return (i = game.user) != null && i.isGM ? (m.manager || (m.manager = new Me()), m.manager.render(!0), m.manager) : F();
  }
  function F() {
    return m.browser || (m.browser = new $e()), m.browser.render(!0), m.browser;
  }
  function U(i, e = {}) {
    var c, l, r;
    if (!i)
      return (c = ui.notifications) == null || c.warn(`${u}: No case id provided.`), null;
    if (!p(i))
      return (l = ui.notifications) == null || l.warn(`${u}: Case "${i}" was not found.`), null;
    const s = e.playerMode ?? !((r = game.user) != null && r.isGM), n = `${i}:${s ? "player" : "gm"}`, o = m.boards.get(n);
    if (o)
      return o.render(!0), o;
    const a = new Ee(i, { playerMode: s });
    return m.boards.set(n, a), a.render(!0), a;
  }
  function k(i) {
    var e, t;
    (t = game.socket) == null || t.emit(J, { type: "case-updated", caseId: i, userId: (e = game.user) == null ? void 0 : e.id });
  }
  function Le(i) {
    var e;
    if (i && i.type === "case-updated" && i.caseId) {
      if (i.userId && i.userId === ((e = game.user) == null ? void 0 : e.id)) return;
      le(i.caseId);
      return;
    }
  }
  class $e extends M {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "csi-case-browser",
        title: "CSI Toolkit Case Files",
        template: `modules/${h}/templates/case-browser.hbs`,
        classes: ["csi-toolkit", "csi-case-browser"],
        width: 520,
        height: 620,
        resizable: !0
      });
    }
    async getData() {
      var t;
      return {
        cases: Object.values(_()).map((s) => C(s)).sort((s, n) => s.title.localeCompare(n.title)),
        isGM: (t = game.user) == null ? void 0 : t.isGM,
        canContribute: Oe()
      };
    }
    activateListeners(e) {
      super.activateListeners(e), e.find("[data-action='open-board']").on("click", (t) => {
        var s;
        U(t.currentTarget.dataset.caseId, { playerMode: !((s = game.user) != null && s.isGM) });
      }), e.find("[data-action='open-manager']").on("click", () => E());
    }
    async close(e = {}) {
      return m.browser = null, super.close(e);
    }
  }
  class Me extends M {
    constructor(e = {}) {
      super(e), this.selectedCaseId = e.caseId ?? null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "csi-case-manager",
        title: "CSI Toolkit Case Manager",
        template: `modules/${h}/templates/case-manager.hbs`,
        classes: ["csi-toolkit", "csi-case-manager"],
        width: 1180,
        height: 820,
        resizable: !0
      });
    }
    async getData() {
      var o;
      const e = _(), t = Object.values(e).map((a) => C(a)).sort((a, c) => a.title.localeCompare(c.title));
      !this.selectedCaseId && t.length && (this.selectedCaseId = t[0].id), this.selectedCaseId && !e[this.selectedCaseId] && (this.selectedCaseId = ((o = t[0]) == null ? void 0 : o.id) ?? null);
      const s = this.selectedCaseId ? C(e[this.selectedCaseId]) : null, n = s ? ce(s) : [];
      return {
        cases: t,
        selected: s,
        itemChoices: n,
        options: {
          caseStatuses: Z,
          themes: ee,
          evidenceTypes: A,
          evidenceStatuses: P,
          suspectStatuses: O,
          connectionTypes: H,
          connectionStyles: Y,
          connectionColors: q
        }
      };
    }
    activateListeners(e) {
      super.activateListeners(e), e.find("[data-action='select-case']").on("click", (t) => {
        this.selectedCaseId = t.currentTarget.dataset.caseId, this.render(!1);
      }), e.find("[data-action='new-case']").on("click", () => this._createNewCase()), e.find("[data-csi-case-form]").on("submit", (t) => this._saveSelectedCase(t)), e.find("[data-action='save-case']").on("click", (t) => this._saveSelectedCase(t)), e.find("[data-action='delete-case']").on("click", () => this._deleteSelectedCase()), e.find("[data-action='duplicate-case']").on("click", () => this._duplicateSelectedCase()), e.find("[data-action='open-board']").on("click", () => U(this.selectedCaseId)), e.find("[data-action='pick-image']").on("click", (t) => this._pickImage(t.currentTarget)), e.find("[data-action='export-case']").on("click", () => ae(this.selectedCaseId)), e.find("[data-action='import-case']").on("click", () => {
        var t;
        return (t = this.element[0].querySelector("[data-csi-import-file]")) == null ? void 0 : t.click();
      }), e.find("[data-csi-import-file]").on("change", (t) => this._importFromFile(t.currentTarget)), e.find("[data-action='import-sample']").on("click", () => this._importSample());
    }
    _readCurrentCase() {
      const e = this.element[0].querySelector("[data-csi-case-form]");
      return e ? De(e, this.selectedCaseId) : p(this.selectedCaseId);
    }
    async _createNewCase() {
      const e = await se({
        title: "New Investigation",
        subtitle: "Unfiled case",
        description: "Describe the incident, victim, premise, or central mystery.",
        visibility: "players"
      });
      this.selectedCaseId = e.id, this.render(!1);
    }
    async _saveSelectedCase(e) {
      var t, s;
      if (e.preventDefault(), !!this.selectedCaseId)
        try {
          const n = this._readCurrentCase();
          await S(n), this.selectedCaseId = n.id, (t = ui.notifications) == null || t.info(`${u}: Saved case "${n.title}".`), this.render(!1);
        } catch (n) {
          console.error(`${u} | Could not save case`, n), (s = ui.notifications) == null || s.error(`${u}: ${n.message}`);
        }
    }
    async _deleteSelectedCase() {
      if (!this.selectedCaseId) return;
      const e = p(this.selectedCaseId);
      !e || !await he({
        title: "Delete CSI Case",
        content: `<p>Delete <strong>${pe(e.title)}</strong>? This cannot be undone.</p>`,
        yes: () => !0,
        no: () => !1,
        defaultYes: !1
      }) || (await Te(this.selectedCaseId), this.selectedCaseId = null, this.render(!1));
    }
    async _duplicateSelectedCase() {
      if (!this.selectedCaseId) return;
      const e = await ke(this.selectedCaseId);
      e && (this.selectedCaseId = e.id, this.render(!1));
    }
    _pickImage(e) {
      var n, o, a, c, l;
      const t = (n = e.closest(".csi-image-field")) == null ? void 0 : n.querySelector("input");
      if (!t) return;
      const s = globalThis.FilePicker ?? ((c = (a = (o = globalThis.foundry) == null ? void 0 : o.applications) == null ? void 0 : a.apps) == null ? void 0 : c.FilePicker);
      if (!s) {
        (l = ui.notifications) == null || l.warn(`${u}: Foundry FilePicker is unavailable.`);
        return;
      }
      new s({
        type: "image",
        current: t.value,
        callback: (r) => {
          t.value = r, t.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).render(!0);
    }
    async _importFromFile(e) {
      var s, n;
      const t = (s = e.files) == null ? void 0 : s[0];
      if (t)
        try {
          const o = await t.text(), a = await z(JSON.parse(o));
          this.selectedCaseId = a.id, this.render(!1);
        } catch (o) {
          console.error(`${u} | Import failed`, o), (n = ui.notifications) == null || n.error(`${u}: Import failed. ${o.message}`);
        } finally {
          e.value = "";
        }
    }
    async _importSample() {
      var e;
      try {
        const t = await oe();
        this.selectedCaseId = t.id, this.render(!1);
      } catch (t) {
        console.error(`${u} | Sample import failed`, t), (e = ui.notifications) == null || e.error(`${u}: Could not import sample case.`);
      }
    }
    async close(e = {}) {
      return m.manager = null, super.close(e);
    }
  }
  class Ee extends M {
    constructor(e, t = {}) {
      super(t), this.caseId = e, this.playerMode = !!t.playerMode, this._drag = null, this._pan = null, this._localLayout = null, this._layoutDraft = null, this._pendingConnection = null, this._contextBoardPosition = null, this._boundContextClose = null, this._dimmedKinds = /* @__PURE__ */ new Set(), this._saveTimer = null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: "CSI Toolkit Case Board",
        template: `modules/${h}/templates/case-board.hbs`,
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
      const e = p(this.caseId), t = this.playerMode ? "Player Board" : "GM Board";
      return e ? `${e.title} - ${t}` : `CSI Toolkit - ${t}`;
    }
    async getData() {
      return Be(this.caseId, { playerMode: this.playerMode, layoutOverride: this._localLayout });
    }
    activateListeners(e) {
      super.activateListeners(e), e.find("[data-action='open-manager']").on("click", () => E()), e.find("[data-action='refresh-board']").on("click", () => this.render(!1)), e.find("[data-action='zoom-in']").on("click", () => this._zoomBy(0.1)), e.find("[data-action='zoom-out']").on("click", () => this._zoomBy(-0.1)), e.find("[data-action='context-add-board-item']").on("click", (s) => this._addBoardItemFromContext(s)), e.find("[data-action='edit-card']").on("click", (s) => this._editCard(s.currentTarget.dataset.collection, s.currentTarget.dataset.itemId)), e.find("[data-action='delete-board-item']").on("click", (s) => this._deleteBoardItem(s.currentTarget.dataset.collection, s.currentTarget.dataset.itemId)), e.find("[data-action='move-timeline-item']").on("click", (s) => this._moveTimelineItem(s.currentTarget.dataset.itemId, s.currentTarget.dataset.direction)), e.find("[data-csi-connection-hit]").on("dblclick", (s) => this._editCard("connections", s.currentTarget.dataset.connectionId)), e.find("[data-action='start-connection']").on("click", (s) => this._startConnection(s)), e.find("[data-csi-dim-kind]").on("change", (s) => this._toggleDimKind(s.currentTarget));
      const t = e[0].querySelector("[data-csi-board-viewport]");
      t && (t.addEventListener("wheel", (s) => this._onWheel(s), { passive: !1 }), t.addEventListener("mousedown", (s) => this._onViewportMouseDown(s)), t.addEventListener("contextmenu", (s) => this._openContextMenu(s))), e.find("[data-csi-board-card]").on("mousedown", (s) => this._onCardMouseDown(s)), e.find("[data-csi-board-card]").on("click", (s) => this._completeConnection(s)), e.find(".csi-card-image").on("load", () => this._queueConnectionLineUpdate()), this._syncDimControls(), this._applyDimmedKinds(), this._queueConnectionLineUpdate();
    }
    _onCardMouseDown(e) {
      if (!I(this.caseId) || e.button !== 0 || e.target.closest("button")) return;
      const t = e.currentTarget, s = this._getView(), n = this._getLayout(), o = t.dataset.itemId, a = n.cards[o] ?? { x: Number(t.dataset.x) || 0, y: Number(t.dataset.y) || 0 };
      e.preventDefault(), this._drag = {
        itemId: o,
        card: t,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startX: a.x,
        startY: a.y,
        scale: s.scale
      }, document.addEventListener("mousemove", this._boundDragMove = (c) => this._onCardDrag(c)), document.addEventListener("mouseup", this._boundDragEnd = () => this._endDrag());
    }
    _onCardDrag(e) {
      if (!this._drag) return;
      const t = Math.round(this._drag.startX + (e.clientX - this._drag.startClientX) / this._drag.scale), s = Math.round(this._drag.startY + (e.clientY - this._drag.startClientY) / this._drag.scale);
      this._drag.card.style.left = `${t}px`, this._drag.card.style.top = `${s}px`, this._drag.card.dataset.x = t, this._drag.card.dataset.y = s, this._updateConnectionLines();
    }
    _endDrag() {
      if (!this._drag) return;
      document.removeEventListener("mousemove", this._boundDragMove), document.removeEventListener("mouseup", this._boundDragEnd);
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
      const t = this._getView();
      e.preventDefault(), this._pan = {
        startClientX: e.clientX,
        startClientY: e.clientY,
        startX: t.x,
        startY: t.y
      }, document.addEventListener("mousemove", this._boundPanMove = (s) => this._onPan(s)), document.addEventListener("mouseup", this._boundPanEnd = () => this._endPan());
    }
    _onPan(e) {
      if (!this._pan) return;
      const t = this._getLayout();
      t.view.x = Math.round(this._pan.startX + e.clientX - this._pan.startClientX), t.view.y = Math.round(this._pan.startY + e.clientY - this._pan.startClientY), this._layoutDraft = t, this._applyView(t.view);
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
      const t = this._getLayout();
      t.view.scale = B(Number(t.view.scale) + e, 0.45, 1.8), this._applyView(t.view), this._saveLayout(t);
    }
    _applyView(e) {
      var n, o;
      const t = (n = this.element[0]) == null ? void 0 : n.querySelector("[data-csi-board-canvas]");
      if (!t) return;
      t.style.transform = `translate(${e.x}px, ${e.y}px) scale(${e.scale})`;
      const s = (o = this.element[0]) == null ? void 0 : o.querySelector("[data-csi-zoom]");
      s && (s.textContent = `${Math.round(e.scale * 100)}%`);
    }
    _getView() {
      return this._getLayout().view;
    }
    _getLayout() {
      const e = p(this.caseId);
      return v(this._layoutDraft ?? this._localLayout ?? (e == null ? void 0 : e.boardLayout));
    }
    async _saveLayout(e) {
      var t;
      this._localLayout = v(e), (t = game.user) != null && t.isGM && (clearTimeout(this._saveTimer), this._saveTimer = setTimeout(async () => {
        const s = p(this.caseId);
        s && (s.boardLayout = v(e), await S(s, { render: !1 }));
      }, 180));
    }
    _updateConnectionLines() {
      const e = this.element[0];
      if (!e) return;
      const t = new Map(Array.from(e.querySelectorAll("[data-csi-board-card]")).map((s) => [s.dataset.itemId, s]));
      for (const s of e.querySelectorAll("[data-csi-connection-group]")) {
        const n = t.get(s.dataset.fromId), o = t.get(s.dataset.toId);
        if (!n || !o) continue;
        const a = this._getCardBoardRect(n), c = this._getCardBoardRect(o), l = me(a, c), r = me(c, a);
        if (!fe(l) || !fe(r)) continue;
        for (const f of s.querySelectorAll("[data-csi-connection-line], [data-csi-connection-hit]"))
          f.setAttribute("x1", l.x), f.setAttribute("y1", l.y), f.setAttribute("x2", r.x), f.setAttribute("y2", r.y);
        const d = s.querySelector("[data-csi-connection-label]");
        d && (d.setAttribute("x", Math.round((l.x + r.x) / 2)), d.setAttribute("y", Math.round((l.y + r.y) / 2 - 10)));
      }
    }
    _queueConnectionLineUpdate() {
      const e = () => this._updateConnectionLines();
      globalThis.requestAnimationFrame ? globalThis.requestAnimationFrame(e) : globalThis.setTimeout(e, 0);
    }
    _getCardBoardRect(e) {
      const t = Number(e.dataset.x) || Number.parseFloat(e.style.left) || 0, s = Number(e.dataset.y) || Number.parseFloat(e.style.top) || 0, n = e.offsetWidth || x, o = e.offsetHeight || Ce;
      return {
        x: t,
        y: s,
        width: n,
        height: o,
        centerX: t + n / 2,
        centerY: s + o / 2
      };
    }
    _editCard(e, t) {
      I(this.caseId) && new X(this.caseId, e, t).render(!0);
    }
    async _deleteBoardItem(e, t) {
      !I(this.caseId) || !te.includes(e) || !t || await ne(this.caseId, e, t);
    }
    async _moveTimelineItem(e, t) {
      var l;
      if (!I(this.caseId) || !e) return;
      const s = p(this.caseId), n = ((l = s == null ? void 0 : s.timeline) == null ? void 0 : l.findIndex((r) => r.id === e)) ?? -1, a = n + (t === "up" ? -1 : t === "down" ? 1 : 0);
      if (!s || n < 0 || a < 0 || a >= s.timeline.length) return;
      const [c] = s.timeline.splice(n, 1);
      s.timeline.splice(a, 0, c), await S(s);
    }
    _toggleDimKind(e) {
      const t = e == null ? void 0 : e.value;
      ["evidence", "suspects", "locations", "timeline"].includes(t) && (e.checked ? this._dimmedKinds.add(t) : this._dimmedKinds.delete(t), this._applyDimmedKinds());
    }
    _syncDimControls() {
      var e;
      for (const t of ((e = this.element[0]) == null ? void 0 : e.querySelectorAll("[data-csi-dim-kind]")) ?? [])
        t.checked = this._dimmedKinds.has(t.value);
    }
    _applyDimmedKinds() {
      const e = this.element[0];
      if (e) {
        for (const t of e.querySelectorAll("[data-csi-board-card]"))
          t.classList.toggle("is-type-dimmed", this._dimmedKinds.has(t.dataset.collection));
        for (const t of e.querySelectorAll("[data-csi-timeline-row]"))
          t.classList.toggle("is-type-dimmed", this._dimmedKinds.has(t.dataset.collection));
      }
    }
    _addBoardItemFromContext(e) {
      e.preventDefault(), e.stopPropagation();
      const t = e.currentTarget.dataset.collection;
      this._addBoardItem(t, this._contextBoardPosition), this._hideContextMenu();
    }
    _addBoardItem(e = "evidence", t = null) {
      I(this.caseId) && ie.includes(e) && new X(this.caseId, e, null, { boardPosition: t }).render(!0);
    }
    _openContextMenu(e) {
      var l, r;
      if (!I(this.caseId) || e.target.closest("[data-csi-board-card], button, input, select, textarea")) return;
      const t = (l = this.element[0]) == null ? void 0 : l.querySelector("[data-csi-context-menu]"), s = (r = this.element[0]) == null ? void 0 : r.querySelector("[data-csi-board-viewport]");
      if (!t || !s) return;
      e.preventDefault(), e.stopPropagation(), this._contextBoardPosition = this._clientToBoardPosition(e.clientX, e.clientY), t.hidden = !1;
      const n = t.offsetWidth || 156, o = t.offsetHeight || 180, a = Math.max(4, globalThis.innerWidth - n - 4), c = Math.max(4, globalThis.innerHeight - o - 4);
      t.style.left = `${B(e.clientX, 4, a)}px`, t.style.top = `${B(e.clientY, 4, c)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu() {
      var t;
      const e = (t = this.element[0]) == null ? void 0 : t.querySelector("[data-csi-context-menu]");
      e && (e.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    _clientToBoardPosition(e, t) {
      var a;
      const s = (a = this.element[0]) == null ? void 0 : a.querySelector("[data-csi-board-viewport]"), n = s == null ? void 0 : s.getBoundingClientRect(), o = this._getView();
      return n ? {
        x: Math.round((e - n.left - o.x) / o.scale - x / 2),
        y: Math.round((t - n.top - o.y) / o.scale - 32)
      } : null;
    }
    _startConnection(e) {
      var n;
      if (e.preventDefault(), e.stopPropagation(), !I(this.caseId)) return;
      const s = e.currentTarget.dataset.itemId;
      if (s) {
        this._pendingConnection = { fromId: s };
        for (const o of this.element[0].querySelectorAll("[data-csi-board-card]")) o.classList.toggle("is-link-source", o.dataset.itemId === s);
        (n = ui.notifications) == null || n.info(`${u}: Select another card to create a connection.`);
      }
    }
    async _completeConnection(e) {
      if (!this._pendingConnection || e.target.closest("button, input, select, textarea") || !I(this.caseId)) return;
      const t = e.currentTarget.dataset.itemId, s = this._pendingConnection.fromId;
      this._pendingConnection = null;
      for (const a of this.element[0].querySelectorAll("[data-csi-board-card]")) a.classList.remove("is-link-source");
      if (!t || t === s) return;
      const n = p(this.caseId);
      if (!n) return;
      const o = N({
        id: b(),
        fromId: s,
        toId: t,
        label: "linked to",
        type: "link",
        style: "solid",
        color: "cyan",
        visibility: "players"
      });
      n.connections.push(o), await S(n), new X(this.caseId, "connections", o.id).render(!0);
    }
    async close(e = {}) {
      return this._hideContextMenu(), m.boards.delete(`${this.caseId}:${this.playerMode ? "player" : "gm"}`), m.playerBoard === this && (m.playerBoard = null), super.close(e);
    }
  }
  class X extends M {
    constructor(e, t, s, n = {}) {
      super(n), this.caseId = e, this.collection = t, this.itemId = s || b(), this.isNew = !s, this.boardPosition = n.boardPosition ? {
        x: Number(n.boardPosition.x) || 0,
        y: Number(n.boardPosition.y) || 0
      } : null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: "Edit CSI Board Card",
        template: `modules/${h}/templates/board-item-editor.hbs`,
        classes: ["csi-toolkit", "csi-board-item-editor"],
        width: 560,
        height: 520,
        resizable: !0
      });
    }
    get title() {
      const e = this._getItem();
      return this.isNew ? `Add ${W(this.collection)}` : e ? `Edit ${ue(e, this.collection)}` : "Edit CSI Board Card";
    }
    async getData() {
      var s;
      const e = p(this.caseId), t = this._getItem();
      return {
        caseId: this.caseId,
        collection: this.collection,
        item: t,
        isNew: this.isNew,
        itemChoices: e ? ce(e, !((s = game.user) != null && s.isGM)) : [],
        isEvidence: this.collection === "evidence",
        isSuspect: this.collection === "suspects",
        isLocation: this.collection === "locations",
        isTimeline: this.collection === "timeline",
        isConnection: this.collection === "connections",
        options: {
          evidenceTypes: A,
          evidenceStatuses: P,
          suspectStatuses: O,
          connectionTypes: H,
          connectionStyles: Y,
          connectionColors: q
        }
      };
    }
    activateListeners(e) {
      var n, o;
      super.activateListeners(e);
      const t = e[0], s = (n = t == null ? void 0 : t.matches) != null && n.call(t, "[data-csi-board-item-form]") ? t : (o = t == null ? void 0 : t.querySelector) == null ? void 0 : o.call(t, "[data-csi-board-item-form]");
      s && s.addEventListener("submit", (a) => this._save(a)), e.find("[data-action='pick-image']").on("click", (a) => this._pickImage(a.currentTarget)), e.find("[data-action='delete-board-item']").on("click", (a) => this._delete(a));
    }
    _getItem() {
      var s;
      const e = p(this.caseId), t = (s = e == null ? void 0 : e[this.collection]) == null ? void 0 : s.find((n) => n.id === this.itemId);
      return t || (this.isNew ? Pe(this.collection, "players", this.itemId) : null);
    }
    async _save(e) {
      var a, c, l;
      e.preventDefault(), e.stopPropagation(), (a = e.stopImmediatePropagation) == null || a.call(e);
      const t = e.currentTarget, s = p(this.caseId);
      if (!s)
        return (c = ui.notifications) == null || c.warn(`${u}: The case could not be found.`), !1;
      const n = s[this.collection].findIndex((r) => r.id === this.itemId);
      if (n < 0 && !this.isNew)
        return (l = ui.notifications) == null || l.warn(`${u}: The item could not be found.`), !1;
      const o = Ne(this.collection, t);
      return o.id = this.itemId, o.visibility = "players", o.hidden = n >= 0 ? !!s[this.collection][n].hidden : !1, n >= 0 ? s[this.collection][n] = o : s[this.collection].push(o), this.isNew && this.collection !== "connections" && (s.boardLayout.cards[this.itemId] = this.boardPosition ?? re(s.evidence.length + s.suspects.length + s.locations.length + s.timeline.length)), await S(s), this.close(), !1;
    }
    async _delete(e) {
      var s;
      return e.preventDefault(), e.stopPropagation(), (s = e.stopImmediatePropagation) == null || s.call(e), this.isNew || await ne(this.caseId, this.collection, this.itemId, { confirm: !0 }) && this.close(), !1;
    }
    _pickImage(e) {
      var n, o, a, c;
      const t = (n = e.closest(".csi-image-field")) == null ? void 0 : n.querySelector("input"), s = globalThis.FilePicker ?? ((c = (a = (o = globalThis.foundry) == null ? void 0 : o.applications) == null ? void 0 : a.apps) == null ? void 0 : c.FilePicker);
      !t || !s || new s({
        type: "image",
        current: t.value,
        callback: (l) => {
          t.value = l, t.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).render(!0);
    }
  }
  function De(i, e) {
    const t = new FormData(i), s = p(e) ?? C({ id: e }), n = C({
      id: e,
      title: t.get("title"),
      subtitle: t.get("subtitle"),
      status: t.get("status"),
      description: t.get("description"),
      image: t.get("image"),
      visibility: "players",
      evidence: s.evidence,
      suspects: s.suspects,
      locations: s.locations,
      timeline: s.timeline,
      connections: s.connections,
      boardLayout: {
        ...s.boardLayout,
        theme: t.get("theme")
      }
    });
    return C(n);
  }
  function Ne(i, e) {
    const t = (o) => {
      var a;
      return ((a = e.querySelector(`[name="${o}"]`)) == null ? void 0 : a.value) ?? "";
    }, s = "players", n = { id: e.dataset.itemId || b(), visibility: s };
    return i === "evidence" ? j({
      ...n,
      title: t("title"),
      type: t("type"),
      status: t("status"),
      description: t("description"),
      image: t("image"),
      notes: t("notes")
    }) : i === "suspects" ? R({
      ...n,
      name: t("name"),
      alias: t("alias"),
      status: t("status"),
      motive: t("motive"),
      alibi: t("alibi"),
      image: t("image"),
      notes: t("notes")
    }) : i === "locations" ? V({
      ...n,
      name: t("name"),
      sceneId: t("sceneId"),
      image: t("image"),
      description: t("description"),
      notes: t("notes")
    }) : i === "timeline" ? G({
      ...n,
      time: t("time"),
      title: t("title"),
      description: t("description"),
      linkedItemIds: t("linkedItemIds").split(",").map((o) => o.trim()).filter(Boolean)
    }) : N({
      id: n.id,
      visibility: s,
      fromId: t("fromId"),
      toId: t("toId"),
      label: t("label"),
      type: t("type"),
      style: t("style"),
      color: t("color")
    });
  }
  function Be(i, { playerMode: e = !1, layoutOverride: t = null } = {}) {
    var l, r;
    const s = p(i);
    if (!s) return { isMissing: !0, playerMode: e, isGM: (l = game.user) == null ? void 0 : l.isGM };
    const n = de(s);
    t && (n.boardLayout = v(t)), n.evidence = L(n.evidence), n.suspects = L(n.suspects), n.locations = L(n.locations), n.timeline = L(n.timeline);
    const o = Ae(n), a = new Map(o.map((d) => [d.id, d]));
    n.timeline = n.timeline.map((d) => ({
      ...d,
      linkedLabels: (d.linkedItemIds ?? []).map((f) => {
        var g;
        return (g = a.get(f)) == null ? void 0 : g.label;
      }).filter(Boolean)
    }));
    const c = L(n.connections).map((d) => {
      const f = a.get(d.fromId), g = a.get(d.toId);
      return {
        ...d,
        fromLabel: (f == null ? void 0 : f.label) ?? d.fromId,
        toLabel: (g == null ? void 0 : g.label) ?? d.toId,
        x1: f ? f.x + x / 2 : 0,
        y1: f ? f.y + 94 : 0,
        x2: g ? g.x + x / 2 : 0,
        y2: g ? g.y + 94 : 0,
        labelX: f && g ? Math.round((f.x + g.x + x) / 2) : 0,
        labelY: f && g ? Math.round((f.y + g.y) / 2 + 84) : 0,
        typeClass: `csi-connection--${d.type}`,
        styleClass: `csi-connection-line--${d.style}`,
        colorClass: `csi-connection-color--${d.color}`,
        hasVisibleEnds: !!(f && g)
      };
    }).filter((d) => d.hasVisibleEnds);
    return {
      case: n,
      cards: o,
      connections: c,
      boardSize: { width: _e, height: Ie },
      viewStyle: `transform: translate(${n.boardLayout.view.x}px, ${n.boardLayout.view.y}px) scale(${n.boardLayout.view.scale});`,
      zoomPercent: Math.round(n.boardLayout.view.scale * 100),
      themeClass: `csi-theme-${n.boardLayout.theme}`,
      playerMode: e,
      isGM: (r = game.user) == null ? void 0 : r.isGM,
      canEditBoard: I(s),
      addCollections: ie.map((d) => ({
        id: d,
        label: K(W(d))
      })),
      counts: {
        evidence: n.evidence.length,
        suspects: n.suspects.length,
        locations: n.locations.length,
        timeline: n.timeline.length,
        connections: c.length
      }
    };
  }
  function L(i) {
    return Array.isArray(i) ? i : [];
  }
  function Ae(i) {
    const e = v(i.boardLayout), t = [];
    for (const s of i.evidence) t.push(D(s, "evidence", "Evidence", s.title, e, t.length));
    for (const s of i.suspects) t.push(D(s, "suspects", "Suspect", s.name, e, t.length));
    for (const s of i.locations) t.push(D(s, "locations", "Location", s.name, e, t.length));
    for (const s of i.timeline) t.push(D(s, "timeline", "Timeline", s.title, e, t.length));
    return t;
  }
  function D(i, e, t, s, n, o) {
    const a = n.cards[i.id] ?? re(o);
    return {
      ...i,
      collection: e,
      kind: e === "suspects" ? "suspect" : e === "locations" ? "location" : e === "timeline" ? "timeline" : "evidence",
      kindLabel: t,
      label: s,
      x: Number(a.x) || 0,
      y: Number(a.y) || 0,
      layer: "public",
      style: `left: ${Number(a.x) || 0}px; top: ${Number(a.y) || 0}px;`
    };
  }
  function re(i) {
    return {
      x: 80 + i % 5 * 300,
      y: 90 + Math.floor(i / 5) * 330
    };
  }
  function ce(i) {
    const e = [];
    for (const t of i.evidence) e.push({ id: t.id, label: `Evidence: ${t.title}` });
    for (const t of i.suspects) e.push({ id: t.id, label: `Suspect: ${t.name}` });
    for (const t of i.locations) e.push({ id: t.id, label: `Location: ${t.name}` });
    for (const t of i.timeline) e.push({ id: t.id, label: `Timeline: ${t.title}` });
    return e;
  }
  function C(i = {}, { forceNewId: e = !1 } = {}) {
    return {
      id: e ? b() : i.id || b(),
      title: String(i.title || "Untitled Case"),
      subtitle: String(i.subtitle || ""),
      status: y(i.status, Z, "open"),
      description: String(i.description || ""),
      image: String(i.image || ""),
      visibility: y(i.visibility, w, "players"),
      evidence: $(i.evidence, j),
      suspects: $(i.suspects, R),
      locations: $(i.locations, V),
      timeline: $(i.timeline, G),
      connections: $(i.connections, N),
      boardLayout: v(i.boardLayout)
    };
  }
  function j(i = {}) {
    return {
      id: i.id || b(),
      title: String(i.title || "Untitled Evidence"),
      type: y(i.type, A, "other"),
      description: String(i.description || ""),
      image: String(i.image || ""),
      status: y(i.status, P, "unknown"),
      visibility: y(i.visibility, w, "players"),
      hidden: !!i.hidden,
      notes: String(i.notes || "")
    };
  }
  function R(i = {}) {
    return {
      id: i.id || b(),
      name: String(i.name || "Unknown Suspect"),
      alias: String(i.alias || ""),
      image: String(i.image || ""),
      motive: String(i.motive || ""),
      alibi: String(i.alibi || ""),
      status: y(i.status, O, "unknown"),
      visibility: y(i.visibility, w, "players"),
      hidden: !!i.hidden,
      notes: String(i.notes || "")
    };
  }
  function V(i = {}) {
    return {
      id: i.id || b(),
      name: String(i.name || "Unknown Location"),
      sceneId: String(i.sceneId || ""),
      image: String(i.image || ""),
      description: String(i.description || ""),
      visibility: y(i.visibility, w, "players"),
      hidden: !!i.hidden,
      notes: String(i.notes || "")
    };
  }
  function G(i = {}) {
    return {
      id: i.id || b(),
      time: String(i.time || ""),
      title: String(i.title || "Timeline Event"),
      description: String(i.description || ""),
      linkedItemIds: Array.isArray(i.linkedItemIds) ? i.linkedItemIds.map(String) : [],
      visibility: y(i.visibility, w, "players"),
      hidden: !!i.hidden
    };
  }
  function N(i = {}) {
    return {
      id: i.id || b(),
      fromId: String(i.fromId || ""),
      toId: String(i.toId || ""),
      label: String(i.label || ""),
      type: y(i.type, H, "link"),
      style: y(i.style, Y, "solid"),
      color: y(i.color, q, qe(i.type)),
      visibility: y(i.visibility, w, "players")
    };
  }
  function v(i = {}) {
    var e, t, s;
    return {
      theme: y(i.theme, ee, "database"),
      view: {
        x: Number((e = i.view) == null ? void 0 : e.x) || 0,
        y: Number((t = i.view) == null ? void 0 : t.y) || 0,
        scale: B(Number((s = i.view) == null ? void 0 : s.scale) || 1, 0.45, 1.8)
      },
      cards: Object.fromEntries(Object.entries(i.cards ?? {}).map(([n, o]) => [n, {
        x: Number(o == null ? void 0 : o.x) || 0,
        y: Number(o == null ? void 0 : o.y) || 0
      }]))
    };
  }
  function Pe(i, e = "players", t = b()) {
    return i === "evidence" ? j({ id: t, visibility: e }) : i === "suspects" ? R({ id: t, visibility: e }) : i === "locations" ? V({ id: t, visibility: e }) : i === "timeline" ? G({ id: t, visibility: e }) : N({ id: t, visibility: e });
  }
  function $(i, e) {
    return Array.isArray(i) ? i.map((t) => e(t)) : [];
  }
  function y(i, e, t) {
    return e.includes(i) ? i : t;
  }
  function le(i) {
    var e;
    (e = m.manager) != null && e.rendered && m.manager.render(!1);
    for (const [t, s] of m.boards.entries())
      t.startsWith(`${i}:`) && s.rendered && s.render(!1);
  }
  function I(i) {
    return !!(typeof i == "string" ? p(i) : i);
  }
  function Oe() {
    return !0;
  }
  function He(i) {
    for (const [e, t] of m.boards.entries())
      e.startsWith(`${i}:`) && t.close();
  }
  function de(i) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(i) : JSON.parse(JSON.stringify(i));
  }
  function b() {
    var i;
    return foundry.utils.randomID ? foundry.utils.randomID() : ((i = crypto.randomUUID) == null ? void 0 : i.call(crypto)) ?? Math.random().toString(36).slice(2, 12);
  }
  function K(i) {
    return String(i ?? "").replace(/_/g, " ").replace(/\b\w/g, (e) => e.toUpperCase());
  }
  function Ye(i) {
    return String(i || "case").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "case";
  }
  function W(i) {
    return i === "suspects" ? "suspect" : i === "locations" ? "location" : i === "timeline" ? "timeline item" : i === "connections" ? "connection" : "evidence";
  }
  function qe(i) {
    return i === "supports" ? "green" : i === "contradicts" ? "red" : i === "location" ? "amber" : i === "timeline" ? "violet" : i === "identity" ? "orange" : "cyan";
  }
  function ue(i, e) {
    return e === "connections" ? i.label || `${i.fromId} -> ${i.toId}` : e === "suspects" || e === "locations" ? i.name : i.title;
  }
  function me(i, e) {
    const t = e.centerX - i.centerX, s = e.centerY - i.centerY;
    if (!t && !s) return { x: Math.round(i.centerX), y: Math.round(i.centerY) };
    const n = t === 0 ? Number.POSITIVE_INFINITY : Math.abs(i.width / 2 / t), o = s === 0 ? Number.POSITIVE_INFINITY : Math.abs(i.height / 2 / s), a = Math.min(n, o);
    return !Number.isFinite(a) || a <= 0 ? { x: Math.round(i.centerX), y: Math.round(i.centerY) } : {
      x: Math.round(i.centerX + t * a),
      y: Math.round(i.centerY + s * a)
    };
  }
  function fe(i) {
    return Number.isFinite(i == null ? void 0 : i.x) && Number.isFinite(i == null ? void 0 : i.y);
  }
  function B(i, e, t) {
    return Math.min(t, Math.max(e, i));
  }
  function he(i) {
    var t, s, n, o, a;
    const e = globalThis.Dialog ?? ((n = (s = (t = globalThis.foundry) == null ? void 0 : t.appv1) == null ? void 0 : s.api) == null ? void 0 : n.Dialog);
    return e != null && e.confirm ? e.confirm(i) : Promise.resolve((a = globalThis.confirm) == null ? void 0 : a.call(globalThis, ((o = i.content) == null ? void 0 : o.replace(/<[^>]+>/g, "")) ?? i.title));
  }
  function pe(i) {
    const e = document.createElement("div");
    return e.textContent = String(i ?? ""), e.innerHTML;
  }
})();
