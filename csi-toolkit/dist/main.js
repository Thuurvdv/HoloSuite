(() => {
  var be, Ce;
  const h = "csi-toolkit", l = "CSI Toolkit", M = `module.${h}`, Z = `modules/${h}/samples/glass-orchid.json`, _e = [
    `modules/${h}/templates/case-manager.hbs`,
    `modules/${h}/templates/case-browser.hbs`,
    `modules/${h}/templates/case-board.hbs`,
    `modules/${h}/templates/item-card.hbs`,
    `modules/${h}/templates/board-item-editor.hbs`
  ], ee = ["open", "cold", "solved", "classified"], S = ["gm", "players"], te = ["database", "noir"], O = ["physical", "digital", "biological", "weapon", "document", "testimony", "other"], q = ["unknown", "relevant", "red_herring", "confirmed"], H = ["unknown", "cleared", "person_of_interest", "prime_suspect", "arrested", "dead"], Y = ["link", "supports", "contradicts", "location", "timeline", "identity"], z = ["solid", "dashed", "dotted"], F = ["cyan", "green", "red", "amber", "violet", "orange", "white"], ie = ["evidence", "suspects", "locations", "timeline", "connections"], ne = ["evidence", "suspects", "locations", "timeline", "connections"], L = 220, Ie = 246, we = 5200, ve = 3600, E = globalThis.Application ?? ((Ce = (be = foundry.appv1) == null ? void 0 : be.api) == null ? void 0 : Ce.Application), m = {
    manager: null,
    browser: null,
    boards: /* @__PURE__ */ new Map(),
    playerBoard: null
  };
  Hooks.once("init", async () => {
    Se(), Le(), await loadTemplates(_e), console.log(`${l} | Initialized`);
  }), Hooks.once("ready", () => {
    game.csiToolkit = ke();
    const i = game.modules.get(h);
    i && (i.api = game.csiToolkit), xe(), game.socket.on(M, De), console.log(`${l} | API available at game.csiToolkit`);
  });
  function Se() {
    game.settings.register(h, "cases", {
      name: "CSI Toolkit Cases",
      hint: "Stores all investigation cases for this world.",
      scope: "world",
      config: !1,
      type: Object,
      default: {}
    });
  }
  function Le() {
    Handlebars.registerHelper("csiEq", (i, e) => i === e), Handlebars.registerHelper("csiLabel", (i) => J(i)), Handlebars.registerHelper("csiCount", (i) => Array.isArray(i) ? i.length : 0), Handlebars.registerHelper("csiFallback", (i, e) => i || e), Handlebars.registerHelper("csiJoin", (i) => Array.isArray(i) ? i.join(", ") : ""), Handlebars.registerHelper("csiOption", (i, e) => i === e ? "selected" : ""), Handlebars.registerHelper("csiChecked", (i) => i === "players" ? "checked" : "");
  }
  function ke() {
    return {
      openCaseBoard: (i, e = {}) => X(i, e),
      openCaseManager: () => D(),
      openCaseBrowser: () => U(),
      createCase: (i) => oe(i),
      getCases: () => I(),
      exportCase: (i) => ce(i),
      importCase: (i) => G(i),
      importSampleCase: () => re()
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
        return (t = game.user) != null && t.isGM ? D() : U();
      }
    }), !0) : !1;
  }
  function I() {
    return me(game.settings.get(h, "cases") ?? {});
  }
  async function k(i) {
    return game.settings.set(h, "cases", i ?? {});
  }
  function se() {
    var e;
    return (((e = game.users) == null ? void 0 : e.contents) ?? Array.from(game.users ?? [])).some((t) => (t == null ? void 0 : t.isGM) && (t == null ? void 0 : t.active));
  }
  function p(i) {
    const e = I();
    return e[i] ? C(e[i]) : null;
  }
  async function v(i, { notify: e = !0, render: t = !0, updateReason: n = null, userName: s = null } = {}) {
    var r;
    const o = C(i);
    if (!((r = game.user) != null && r.isGM)) return $e(o, { render: t });
    const a = I();
    return a[o.id] = o, await k(a), e && x(o.id, { reason: n, userName: s }), t && A(o.id), o;
  }
  async function $e(i, { render: e = !0 } = {}) {
    var t, n, s, o, a, r;
    return (t = game.socket) != null && t.emit ? se() ? (game.socket.emit(M, {
      type: "save-case-request",
      caseData: i,
      userId: (o = game.user) == null ? void 0 : o.id,
      userName: (a = game.user) == null ? void 0 : a.name
    }), (r = ui.notifications) == null || r.info(`${l}: Board update sent to the GM.`), i) : ((s = ui.notifications) == null || s.warn(`${l}: No active GM is connected to save board changes.`), i) : ((n = ui.notifications) == null || n.warn(`${l}: A GM must be connected to save board changes.`), i);
  }
  async function oe(i = {}) {
    var n;
    const e = C(i, { forceNewId: !i.id }), t = I();
    return t[e.id] = e, await k(t), x(e.id), (n = ui.notifications) == null || n.info(`${l}: Created case "${e.title}".`), e;
  }
  async function Te(i) {
    var n;
    const e = I(), t = e[i];
    return t ? (delete e[i], await k(e), Fe(i), x(i), (n = ui.notifications) == null || n.info(`${l}: Deleted case "${t.title}".`), !0) : !1;
  }
  async function ae(i, e, t, { confirm: n = !0 } = {}) {
    var r, d;
    if (!ie.includes(e) || !t) return !1;
    const s = p(i);
    if (!s) return !1;
    const o = (r = s[e]) == null ? void 0 : r.find((c) => c.id === t);
    if (!o) return !1;
    const a = fe(o, e);
    return n && !await ye({
      title: `Delete ${J(Q(e))}`,
      content: `<p>Delete <strong>${ge(a)}</strong>?${e === "connections" ? "" : " Any attached connections will also be deleted."}</p>`,
      yes: () => !0,
      no: () => !1,
      defaultYes: !1
    }) ? !1 : (s[e] = s[e].filter((c) => c.id !== t), e !== "connections" && (s.connections = s.connections.filter((c) => c.fromId !== t && c.toId !== t), s.timeline = s.timeline.map((c) => ({
      ...c,
      linkedItemIds: (c.linkedItemIds ?? []).filter((u) => u !== t)
    })), delete s.boardLayout.cards[t]), await v(s), (d = ui.notifications) == null || d.info(`${l}: Deleted "${a}".`), !0);
  }
  async function Me(i) {
    var s;
    const e = p(i);
    if (!e) return null;
    const t = C({
      ...e,
      id: b(),
      title: `${e.title} Copy`
    }), n = I();
    return n[t.id] = t, await k(n), x(t.id), (s = ui.notifications) == null || s.info(`${l}: Duplicated case "${e.title}".`), t;
  }
  async function G(i) {
    var n;
    const e = C({
      ...i,
      id: i.id || b()
    }), t = I();
    return t[e.id] && (e.id = b()), t[e.id] = e, await k(t), x(e.id), (n = ui.notifications) == null || n.info(`${l}: Imported case "${e.title}".`), e;
  }
  async function re() {
    const i = await fetch(Z);
    if (!i.ok) throw new Error(`Could not load ${Z}`);
    return G(await i.json());
  }
  function ce(i) {
    const e = p(i);
    if (!e) return !1;
    const t = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), n = URL.createObjectURL(t), s = document.createElement("a");
    return s.href = n, s.download = `${Ge(e.title)}.json`, s.click(), URL.revokeObjectURL(n), !0;
  }
  function D() {
    var i;
    return (i = game.user) != null && i.isGM ? (m.manager || (m.manager = new Be()), m.manager.render(!0), m.manager) : U();
  }
  function U() {
    return m.browser || (m.browser = new Ne()), m.browser.render(!0), m.browser;
  }
  function X(i, e = {}) {
    var r, d, c;
    if (!i)
      return (r = ui.notifications) == null || r.warn(`${l}: No case id provided.`), null;
    if (!p(i))
      return (d = ui.notifications) == null || d.warn(`${l}: Case "${i}" was not found.`), null;
    const n = e.playerMode ?? !((c = game.user) != null && c.isGM), s = `${i}:${n ? "player" : "gm"}`, o = m.boards.get(s);
    if (o)
      return o.render(!0), o;
    const a = new Ae(i, { playerMode: n });
    return m.boards.set(s, a), a.render(!0), a;
  }
  async function Ee(i, e) {
    var n, s, o, a, r, d;
    const t = w(e);
    return (n = game.socket) != null && n.emit ? se() ? (game.socket.emit(M, {
      type: "publish-layout-request",
      caseId: i,
      boardLayout: t,
      userId: (a = game.user) == null ? void 0 : a.id,
      userName: (r = game.user) == null ? void 0 : r.name
    }), (d = ui.notifications) == null || d.info(`${l}: Layout publish request sent to the GM.`), !0) : ((o = ui.notifications) == null || o.warn(`${l}: No active GM is connected to publish the board layout.`), !1) : ((s = ui.notifications) == null || s.warn(`${l}: A GM must be connected to publish the board layout.`), !1);
  }
  async function le(i, e, { userId: t = ((s) => (s = game.user) == null ? void 0 : s.id)(), userName: n = ((o) => (o = game.user) == null ? void 0 : o.name)() } = {}) {
    var c;
    const a = p(i);
    if (!a) return !1;
    const r = w(a.boardLayout), d = w(e);
    return a.boardLayout = w({
      ...r,
      cards: d.cards
    }), await v(a, {
      render: !1,
      updateReason: "layout-published",
      userName: n
    }), A(i, { resetLayout: !0 }), (c = ui.notifications) == null || c.info(`${l}: Published shared board layout${n ? ` from ${n}` : ""}.`), !0;
  }
  function x(i, { reason: e = null, userName: t = null } = {}) {
    var n, s;
    (s = game.socket) == null || s.emit(M, { type: "case-updated", caseId: i, reason: e, userName: t, userId: (n = game.user) == null ? void 0 : n.id });
  }
  function De(i) {
    var e, t, n, s;
    if (i) {
      if (i.type === "save-case-request") {
        if (!((e = game.user) != null && e.isGM) || !i.caseData) return;
        v(i.caseData, { render: !1 }).then((o) => {
          var a;
          o && (A(o.id), (a = ui.notifications) == null || a.info(`${l}: Saved player board update from ${i.userName ?? "a player"}.`));
        }).catch((o) => {
          var a;
          console.error(`${l} | Could not save player board update`, o), (a = ui.notifications) == null || a.error(`${l}: Player board update could not be saved.`);
        });
        return;
      }
      if (i.type === "publish-layout-request") {
        if (!((t = game.user) != null && t.isGM) || !i.caseId || !i.boardLayout) return;
        le(i.caseId, i.boardLayout, {
          userId: i.userId,
          userName: i.userName
        }).catch((o) => {
          var a;
          console.error(`${l} | Could not publish player layout`, o), (a = ui.notifications) == null || a.error(`${l}: Player layout could not be published.`);
        });
        return;
      }
      if (i.type === "case-updated" && i.caseId) {
        if (i.userId && i.userId === ((n = game.user) == null ? void 0 : n.id)) return;
        A(i.caseId, { resetLayout: i.reason === "layout-published" }), i.reason === "layout-published" && ((s = ui.notifications) == null || s.info(`${l}: ${i.userName ?? "Someone"} published a shared board layout.`));
        return;
      }
    }
  }
  class Ne extends E {
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
        cases: Object.values(I()).map((n) => C(n)).sort((n, s) => n.title.localeCompare(s.title)),
        isGM: (t = game.user) == null ? void 0 : t.isGM,
        canContribute: ze()
      };
    }
    activateListeners(e) {
      super.activateListeners(e), e.find("[data-action='open-board']").on("click", (t) => {
        var n;
        X(t.currentTarget.dataset.caseId, { playerMode: !((n = game.user) != null && n.isGM) });
      }), e.find("[data-action='open-manager']").on("click", () => D());
    }
    async close(e = {}) {
      return m.browser = null, super.close(e);
    }
  }
  class Be extends E {
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
      const e = I(), t = Object.values(e).map((a) => C(a)).sort((a, r) => a.title.localeCompare(r.title));
      !this.selectedCaseId && t.length && (this.selectedCaseId = t[0].id), this.selectedCaseId && !e[this.selectedCaseId] && (this.selectedCaseId = ((o = t[0]) == null ? void 0 : o.id) ?? null);
      const n = this.selectedCaseId ? C(e[this.selectedCaseId]) : null, s = n ? ue(n) : [];
      return {
        cases: t,
        selected: n,
        itemChoices: s,
        options: {
          caseStatuses: ee,
          themes: te,
          evidenceTypes: O,
          evidenceStatuses: q,
          suspectStatuses: H,
          connectionTypes: Y,
          connectionStyles: z,
          connectionColors: F
        }
      };
    }
    activateListeners(e) {
      super.activateListeners(e), e.find("[data-action='select-case']").on("click", (t) => {
        this.selectedCaseId = t.currentTarget.dataset.caseId, this.render(!1);
      }), e.find("[data-action='new-case']").on("click", () => this._createNewCase()), e.find("[data-csi-case-form]").on("submit", (t) => this._saveSelectedCase(t)), e.find("[data-action='save-case']").on("click", (t) => this._saveSelectedCase(t)), e.find("[data-action='delete-case']").on("click", () => this._deleteSelectedCase()), e.find("[data-action='duplicate-case']").on("click", () => this._duplicateSelectedCase()), e.find("[data-action='open-board']").on("click", () => X(this.selectedCaseId)), e.find("[data-action='pick-image']").on("click", (t) => this._pickImage(t.currentTarget)), e.find("[data-action='export-case']").on("click", () => ce(this.selectedCaseId)), e.find("[data-action='import-case']").on("click", () => {
        var t;
        return (t = this.element[0].querySelector("[data-csi-import-file]")) == null ? void 0 : t.click();
      }), e.find("[data-csi-import-file]").on("change", (t) => this._importFromFile(t.currentTarget)), e.find("[data-action='import-sample']").on("click", () => this._importSample());
    }
    _readCurrentCase() {
      const e = this.element[0].querySelector("[data-csi-case-form]");
      return e ? Pe(e, this.selectedCaseId) : p(this.selectedCaseId);
    }
    async _createNewCase() {
      const e = await oe({
        title: "New Investigation",
        subtitle: "Unfiled case",
        description: "Describe the incident, victim, premise, or central mystery.",
        visibility: "players"
      });
      this.selectedCaseId = e.id, this.render(!1);
    }
    async _saveSelectedCase(e) {
      var t, n;
      if (e.preventDefault(), !!this.selectedCaseId)
        try {
          const s = this._readCurrentCase();
          await v(s), this.selectedCaseId = s.id, (t = ui.notifications) == null || t.info(`${l}: Saved case "${s.title}".`), this.render(!1);
        } catch (s) {
          console.error(`${l} | Could not save case`, s), (n = ui.notifications) == null || n.error(`${l}: ${s.message}`);
        }
    }
    async _deleteSelectedCase() {
      if (!this.selectedCaseId) return;
      const e = p(this.selectedCaseId);
      !e || !await ye({
        title: "Delete CSI Case",
        content: `<p>Delete <strong>${ge(e.title)}</strong>? This cannot be undone.</p>`,
        yes: () => !0,
        no: () => !1,
        defaultYes: !1
      }) || (await Te(this.selectedCaseId), this.selectedCaseId = null, this.render(!1));
    }
    async _duplicateSelectedCase() {
      if (!this.selectedCaseId) return;
      const e = await Me(this.selectedCaseId);
      e && (this.selectedCaseId = e.id, this.render(!1));
    }
    _pickImage(e) {
      var s, o, a, r, d;
      const t = (s = e.closest(".csi-image-field")) == null ? void 0 : s.querySelector("input");
      if (!t) return;
      const n = globalThis.FilePicker ?? ((r = (a = (o = globalThis.foundry) == null ? void 0 : o.applications) == null ? void 0 : a.apps) == null ? void 0 : r.FilePicker);
      if (!n) {
        (d = ui.notifications) == null || d.warn(`${l}: Foundry FilePicker is unavailable.`);
        return;
      }
      new n({
        type: "image",
        current: t.value,
        callback: (c) => {
          t.value = c, t.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).render(!0);
    }
    async _importFromFile(e) {
      var n, s;
      const t = (n = e.files) == null ? void 0 : n[0];
      if (t)
        try {
          const o = await t.text(), a = await G(JSON.parse(o));
          this.selectedCaseId = a.id, this.render(!1);
        } catch (o) {
          console.error(`${l} | Import failed`, o), (s = ui.notifications) == null || s.error(`${l}: Import failed. ${o.message}`);
        } finally {
          e.value = "";
        }
    }
    async _importSample() {
      var e;
      try {
        const t = await re();
        this.selectedCaseId = t.id, this.render(!1);
      } catch (t) {
        console.error(`${l} | Sample import failed`, t), (e = ui.notifications) == null || e.error(`${l}: Could not import sample case.`);
      }
    }
    async close(e = {}) {
      return m.manager = null, super.close(e);
    }
  }
  class Ae extends E {
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
      return qe(this.caseId, { playerMode: this.playerMode, layoutOverride: this._localLayout });
    }
    activateListeners(e) {
      super.activateListeners(e), e.find("[data-action='open-manager']").on("click", () => D()), e.find("[data-action='refresh-board']").on("click", () => this._reloadSharedBoard()), e.find("[data-action='publish-layout']").on("click", () => this._publishLayout()), e.find("[data-action='zoom-in']").on("click", () => this._zoomBy(0.1)), e.find("[data-action='zoom-out']").on("click", () => this._zoomBy(-0.1)), e.find("[data-action='context-add-board-item']").on("click", (n) => this._addBoardItemFromContext(n)), e.find("[data-action='edit-card']").on("click", (n) => this._editCard(n.currentTarget.dataset.collection, n.currentTarget.dataset.itemId)), e.find("[data-action='delete-board-item']").on("click", (n) => this._deleteBoardItem(n.currentTarget.dataset.collection, n.currentTarget.dataset.itemId)), e.find("[data-action='move-timeline-item']").on("click", (n) => this._moveTimelineItem(n.currentTarget.dataset.itemId, n.currentTarget.dataset.direction)), e.find("[data-csi-connection-hit]").on("dblclick", (n) => this._editCard("connections", n.currentTarget.dataset.connectionId)), e.find("[data-action='start-connection']").on("click", (n) => this._startConnection(n)), e.find("[data-csi-dim-kind]").on("change", (n) => this._toggleDimKind(n.currentTarget));
      const t = e[0].querySelector("[data-csi-board-viewport]");
      t && (t.addEventListener("wheel", (n) => this._onWheel(n), { passive: !1 }), t.addEventListener("mousedown", (n) => this._onViewportMouseDown(n)), t.addEventListener("contextmenu", (n) => this._openContextMenu(n))), e.find("[data-csi-board-card]").on("mousedown", (n) => this._onCardMouseDown(n)), e.find("[data-csi-board-card]").on("click", (n) => this._completeConnection(n)), e.find(".csi-card-image").on("load", () => this._queueConnectionLineUpdate()), this._syncDimControls(), this._applyDimmedKinds(), this._queueConnectionLineUpdate();
    }
    _onCardMouseDown(e) {
      if (!_(this.caseId) || e.button !== 0 || e.target.closest("button")) return;
      const t = e.currentTarget, n = this._getView(), s = this._getLayout(), o = t.dataset.itemId, a = s.cards[o] ?? { x: Number(t.dataset.x) || 0, y: Number(t.dataset.y) || 0 };
      e.preventDefault(), this._drag = {
        itemId: o,
        card: t,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startX: a.x,
        startY: a.y,
        scale: n.scale
      }, document.addEventListener("mousemove", this._boundDragMove = (r) => this._onCardDrag(r)), document.addEventListener("mouseup", this._boundDragEnd = () => this._endDrag());
    }
    _onCardDrag(e) {
      if (!this._drag) return;
      const t = Math.round(this._drag.startX + (e.clientX - this._drag.startClientX) / this._drag.scale), n = Math.round(this._drag.startY + (e.clientY - this._drag.startClientY) / this._drag.scale);
      this._drag.card.style.left = `${t}px`, this._drag.card.style.top = `${n}px`, this._drag.card.dataset.x = t, this._drag.card.dataset.y = n, this._updateConnectionLines();
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
      }, document.addEventListener("mousemove", this._boundPanMove = (n) => this._onPan(n)), document.addEventListener("mouseup", this._boundPanEnd = () => this._endPan());
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
      t.view.scale = P(Number(t.view.scale) + e, 0.45, 1.8), this._applyView(t.view), this._saveLayout(t);
    }
    _applyView(e) {
      var s, o;
      const t = (s = this.element[0]) == null ? void 0 : s.querySelector("[data-csi-board-canvas]");
      if (!t) return;
      t.style.transform = `translate(${e.x}px, ${e.y}px) scale(${e.scale})`;
      const n = (o = this.element[0]) == null ? void 0 : o.querySelector("[data-csi-zoom]");
      n && (n.textContent = `${Math.round(e.scale * 100)}%`);
    }
    _getView() {
      return this._getLayout().view;
    }
    _getLayout() {
      const e = p(this.caseId);
      return w(this._layoutDraft ?? this._localLayout ?? (e == null ? void 0 : e.boardLayout));
    }
    async _saveLayout(e) {
      this._localLayout = w(e);
    }
    async _publishLayout() {
      var t;
      if (!_(this.caseId)) return;
      const e = this._getLayout();
      if ((t = game.user) != null && t.isGM) {
        await le(this.caseId, e);
        return;
      }
      await Ee(this.caseId, e);
    }
    _reloadSharedBoard() {
      this._localLayout = null, this._layoutDraft = null, this.render(!0);
    }
    _updateConnectionLines() {
      const e = this.element[0];
      if (!e) return;
      const t = new Map(Array.from(e.querySelectorAll("[data-csi-board-card]")).map((n) => [n.dataset.itemId, n]));
      for (const n of e.querySelectorAll("[data-csi-connection-group]")) {
        const s = t.get(n.dataset.fromId), o = t.get(n.dataset.toId);
        if (!s || !o) continue;
        const a = this._getCardBoardRect(s), r = this._getCardBoardRect(o), d = he(a, r), c = he(r, a);
        if (!pe(d) || !pe(c)) continue;
        for (const f of n.querySelectorAll("[data-csi-connection-line], [data-csi-connection-hit]"))
          f.setAttribute("x1", d.x), f.setAttribute("y1", d.y), f.setAttribute("x2", c.x), f.setAttribute("y2", c.y);
        const u = n.querySelector("[data-csi-connection-label]");
        u && (u.setAttribute("x", Math.round((d.x + c.x) / 2)), u.setAttribute("y", Math.round((d.y + c.y) / 2 - 10)));
      }
    }
    _queueConnectionLineUpdate() {
      const e = () => this._updateConnectionLines();
      globalThis.requestAnimationFrame ? globalThis.requestAnimationFrame(e) : globalThis.setTimeout(e, 0);
    }
    _getCardBoardRect(e) {
      const t = Number(e.dataset.x) || Number.parseFloat(e.style.left) || 0, n = Number(e.dataset.y) || Number.parseFloat(e.style.top) || 0, s = e.offsetWidth || L, o = e.offsetHeight || Ie;
      return {
        x: t,
        y: n,
        width: s,
        height: o,
        centerX: t + s / 2,
        centerY: n + o / 2
      };
    }
    _editCard(e, t) {
      _(this.caseId) && new R(this.caseId, e, t).render(!0);
    }
    async _deleteBoardItem(e, t) {
      !_(this.caseId) || !ie.includes(e) || !t || await ae(this.caseId, e, t);
    }
    async _moveTimelineItem(e, t) {
      var d;
      if (!_(this.caseId) || !e) return;
      const n = p(this.caseId), s = ((d = n == null ? void 0 : n.timeline) == null ? void 0 : d.findIndex((c) => c.id === e)) ?? -1, a = s + (t === "up" ? -1 : t === "down" ? 1 : 0);
      if (!n || s < 0 || a < 0 || a >= n.timeline.length) return;
      const [r] = n.timeline.splice(s, 1);
      n.timeline.splice(a, 0, r), await v(n);
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
      _(this.caseId) && ne.includes(e) && new R(this.caseId, e, null, { boardPosition: t }).render(!0);
    }
    _openContextMenu(e) {
      var d, c;
      if (!_(this.caseId) || e.target.closest("[data-csi-board-card], button, input, select, textarea")) return;
      const t = (d = this.element[0]) == null ? void 0 : d.querySelector("[data-csi-context-menu]"), n = (c = this.element[0]) == null ? void 0 : c.querySelector("[data-csi-board-viewport]");
      if (!t || !n) return;
      e.preventDefault(), e.stopPropagation(), this._contextBoardPosition = this._clientToBoardPosition(e.clientX, e.clientY), t.hidden = !1;
      const s = t.offsetWidth || 156, o = t.offsetHeight || 180, a = Math.max(4, globalThis.innerWidth - s - 4), r = Math.max(4, globalThis.innerHeight - o - 4);
      t.style.left = `${P(e.clientX, 4, a)}px`, t.style.top = `${P(e.clientY, 4, r)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu() {
      var t;
      const e = (t = this.element[0]) == null ? void 0 : t.querySelector("[data-csi-context-menu]");
      e && (e.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    _clientToBoardPosition(e, t) {
      var a;
      const n = (a = this.element[0]) == null ? void 0 : a.querySelector("[data-csi-board-viewport]"), s = n == null ? void 0 : n.getBoundingClientRect(), o = this._getView();
      return s ? {
        x: Math.round((e - s.left - o.x) / o.scale - L / 2),
        y: Math.round((t - s.top - o.y) / o.scale - 32)
      } : null;
    }
    _startConnection(e) {
      var s;
      if (e.preventDefault(), e.stopPropagation(), !_(this.caseId)) return;
      const n = e.currentTarget.dataset.itemId;
      if (n) {
        this._pendingConnection = { fromId: n };
        for (const o of this.element[0].querySelectorAll("[data-csi-board-card]")) o.classList.toggle("is-link-source", o.dataset.itemId === n);
        (s = ui.notifications) == null || s.info(`${l}: Select another card to create a connection.`);
      }
    }
    async _completeConnection(e) {
      if (!this._pendingConnection || e.target.closest("button, input, select, textarea") || !_(this.caseId)) return;
      const t = e.currentTarget.dataset.itemId, n = this._pendingConnection.fromId;
      this._pendingConnection = null;
      for (const a of this.element[0].querySelectorAll("[data-csi-board-card]")) a.classList.remove("is-link-source");
      if (!t || t === n) return;
      const s = p(this.caseId);
      if (!s) return;
      const o = B({
        id: b(),
        fromId: n,
        toId: t,
        label: "linked to",
        type: "link",
        style: "solid",
        color: "cyan",
        visibility: "players"
      });
      s.connections.push(o), await v(s), new R(this.caseId, "connections", o.id).render(!0);
    }
    async close(e = {}) {
      return this._hideContextMenu(), m.boards.delete(`${this.caseId}:${this.playerMode ? "player" : "gm"}`), m.playerBoard === this && (m.playerBoard = null), super.close(e);
    }
  }
  class R extends E {
    constructor(e, t, n, s = {}) {
      super(s), this.caseId = e, this.collection = t, this.itemId = n || b(), this.isNew = !n, this.boardPosition = s.boardPosition ? {
        x: Number(s.boardPosition.x) || 0,
        y: Number(s.boardPosition.y) || 0
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
      return this.isNew ? `Add ${Q(this.collection)}` : e ? `Edit ${fe(e, this.collection)}` : "Edit CSI Board Card";
    }
    async getData() {
      var n;
      const e = p(this.caseId), t = this._getItem();
      return {
        caseId: this.caseId,
        collection: this.collection,
        item: t,
        isNew: this.isNew,
        itemChoices: e ? ue(e, !((n = game.user) != null && n.isGM)) : [],
        isEvidence: this.collection === "evidence",
        isSuspect: this.collection === "suspects",
        isLocation: this.collection === "locations",
        isTimeline: this.collection === "timeline",
        isConnection: this.collection === "connections",
        options: {
          evidenceTypes: O,
          evidenceStatuses: q,
          suspectStatuses: H,
          connectionTypes: Y,
          connectionStyles: z,
          connectionColors: F
        }
      };
    }
    activateListeners(e) {
      var s, o;
      super.activateListeners(e);
      const t = e[0], n = (s = t == null ? void 0 : t.matches) != null && s.call(t, "[data-csi-board-item-form]") ? t : (o = t == null ? void 0 : t.querySelector) == null ? void 0 : o.call(t, "[data-csi-board-item-form]");
      n && n.addEventListener("submit", (a) => this._save(a)), e.find("[data-action='pick-image']").on("click", (a) => this._pickImage(a.currentTarget)), e.find("[data-action='delete-board-item']").on("click", (a) => this._delete(a));
    }
    _getItem() {
      var n;
      const e = p(this.caseId), t = (n = e == null ? void 0 : e[this.collection]) == null ? void 0 : n.find((s) => s.id === this.itemId);
      return t || (this.isNew ? Ye(this.collection, "players", this.itemId) : null);
    }
    async _save(e) {
      var a, r, d;
      e.preventDefault(), e.stopPropagation(), (a = e.stopImmediatePropagation) == null || a.call(e);
      const t = e.currentTarget, n = p(this.caseId);
      if (!n)
        return (r = ui.notifications) == null || r.warn(`${l}: The case could not be found.`), !1;
      const s = n[this.collection].findIndex((c) => c.id === this.itemId);
      if (s < 0 && !this.isNew)
        return (d = ui.notifications) == null || d.warn(`${l}: The item could not be found.`), !1;
      const o = Oe(this.collection, t);
      return o.id = this.itemId, o.visibility = "players", o.hidden = s >= 0 ? !!n[this.collection][s].hidden : !1, s >= 0 ? n[this.collection][s] = o : n[this.collection].push(o), this.isNew && this.collection !== "connections" && (n.boardLayout.cards[this.itemId] = this.boardPosition ?? de(n.evidence.length + n.suspects.length + n.locations.length + n.timeline.length)), await v(n), this.close(), !1;
    }
    async _delete(e) {
      var n;
      return e.preventDefault(), e.stopPropagation(), (n = e.stopImmediatePropagation) == null || n.call(e), this.isNew || await ae(this.caseId, this.collection, this.itemId, { confirm: !0 }) && this.close(), !1;
    }
    _pickImage(e) {
      var s, o, a, r;
      const t = (s = e.closest(".csi-image-field")) == null ? void 0 : s.querySelector("input"), n = globalThis.FilePicker ?? ((r = (a = (o = globalThis.foundry) == null ? void 0 : o.applications) == null ? void 0 : a.apps) == null ? void 0 : r.FilePicker);
      !t || !n || new n({
        type: "image",
        current: t.value,
        callback: (d) => {
          t.value = d, t.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).render(!0);
    }
  }
  function Pe(i, e) {
    const t = new FormData(i), n = p(e) ?? C({ id: e }), s = C({
      id: e,
      title: t.get("title"),
      subtitle: t.get("subtitle"),
      status: t.get("status"),
      description: t.get("description"),
      image: t.get("image"),
      visibility: "players",
      evidence: n.evidence,
      suspects: n.suspects,
      locations: n.locations,
      timeline: n.timeline,
      connections: n.connections,
      boardLayout: {
        ...n.boardLayout,
        theme: t.get("theme")
      }
    });
    return C(s);
  }
  function Oe(i, e) {
    const t = (o) => {
      var a;
      return ((a = e.querySelector(`[name="${o}"]`)) == null ? void 0 : a.value) ?? "";
    }, n = "players", s = { id: e.dataset.itemId || b(), visibility: n };
    return i === "evidence" ? j({
      ...s,
      title: t("title"),
      type: t("type"),
      status: t("status"),
      description: t("description"),
      image: t("image"),
      notes: t("notes")
    }) : i === "suspects" ? V({
      ...s,
      name: t("name"),
      alias: t("alias"),
      status: t("status"),
      motive: t("motive"),
      alibi: t("alibi"),
      image: t("image"),
      notes: t("notes")
    }) : i === "locations" ? K({
      ...s,
      name: t("name"),
      sceneId: t("sceneId"),
      image: t("image"),
      description: t("description"),
      notes: t("notes")
    }) : i === "timeline" ? W({
      ...s,
      time: t("time"),
      title: t("title"),
      description: t("description"),
      linkedItemIds: t("linkedItemIds").split(",").map((o) => o.trim()).filter(Boolean)
    }) : B({
      id: s.id,
      visibility: n,
      fromId: t("fromId"),
      toId: t("toId"),
      label: t("label"),
      type: t("type"),
      style: t("style"),
      color: t("color")
    });
  }
  function qe(i, { playerMode: e = !1, layoutOverride: t = null } = {}) {
    var d, c;
    const n = p(i);
    if (!n) return { isMissing: !0, playerMode: e, isGM: (d = game.user) == null ? void 0 : d.isGM };
    const s = me(n);
    t && (s.boardLayout = w(t)), s.evidence = $(s.evidence), s.suspects = $(s.suspects), s.locations = $(s.locations), s.timeline = $(s.timeline);
    const o = He(s), a = new Map(o.map((u) => [u.id, u]));
    s.timeline = s.timeline.map((u) => ({
      ...u,
      linkedLabels: (u.linkedItemIds ?? []).map((f) => {
        var y;
        return (y = a.get(f)) == null ? void 0 : y.label;
      }).filter(Boolean)
    }));
    const r = $(s.connections).map((u) => {
      const f = a.get(u.fromId), y = a.get(u.toId);
      return {
        ...u,
        fromLabel: (f == null ? void 0 : f.label) ?? u.fromId,
        toLabel: (y == null ? void 0 : y.label) ?? u.toId,
        x1: f ? f.x + L / 2 : 0,
        y1: f ? f.y + 94 : 0,
        x2: y ? y.x + L / 2 : 0,
        y2: y ? y.y + 94 : 0,
        labelX: f && y ? Math.round((f.x + y.x + L) / 2) : 0,
        labelY: f && y ? Math.round((f.y + y.y) / 2 + 84) : 0,
        typeClass: `csi-connection--${u.type}`,
        styleClass: `csi-connection-line--${u.style}`,
        colorClass: `csi-connection-color--${u.color}`,
        hasVisibleEnds: !!(f && y)
      };
    }).filter((u) => u.hasVisibleEnds);
    return {
      case: s,
      cards: o,
      connections: r,
      boardSize: { width: we, height: ve },
      viewStyle: `transform: translate(${s.boardLayout.view.x}px, ${s.boardLayout.view.y}px) scale(${s.boardLayout.view.scale});`,
      zoomPercent: Math.round(s.boardLayout.view.scale * 100),
      themeClass: `csi-theme-${s.boardLayout.theme}`,
      playerMode: e,
      isGM: (c = game.user) == null ? void 0 : c.isGM,
      canEditBoard: _(n),
      addCollections: ne.map((u) => ({
        id: u,
        label: J(Q(u))
      })),
      counts: {
        evidence: s.evidence.length,
        suspects: s.suspects.length,
        locations: s.locations.length,
        timeline: s.timeline.length,
        connections: r.length
      }
    };
  }
  function $(i) {
    return Array.isArray(i) ? i : [];
  }
  function He(i) {
    const e = w(i.boardLayout), t = [];
    for (const n of i.evidence) t.push(N(n, "evidence", "Evidence", n.title, e, t.length));
    for (const n of i.suspects) t.push(N(n, "suspects", "Suspect", n.name, e, t.length));
    for (const n of i.locations) t.push(N(n, "locations", "Location", n.name, e, t.length));
    for (const n of i.timeline) t.push(N(n, "timeline", "Timeline", n.title, e, t.length));
    return t;
  }
  function N(i, e, t, n, s, o) {
    const a = s.cards[i.id] ?? de(o);
    return {
      ...i,
      collection: e,
      kind: e === "suspects" ? "suspect" : e === "locations" ? "location" : e === "timeline" ? "timeline" : "evidence",
      kindLabel: t,
      label: n,
      x: Number(a.x) || 0,
      y: Number(a.y) || 0,
      layer: "public",
      style: `left: ${Number(a.x) || 0}px; top: ${Number(a.y) || 0}px;`
    };
  }
  function de(i) {
    return {
      x: 80 + i % 5 * 300,
      y: 90 + Math.floor(i / 5) * 330
    };
  }
  function ue(i) {
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
      status: g(i.status, ee, "open"),
      description: String(i.description || ""),
      image: String(i.image || ""),
      visibility: g(i.visibility, S, "players"),
      evidence: T(i.evidence, j),
      suspects: T(i.suspects, V),
      locations: T(i.locations, K),
      timeline: T(i.timeline, W),
      connections: T(i.connections, B),
      boardLayout: w(i.boardLayout)
    };
  }
  function j(i = {}) {
    return {
      id: i.id || b(),
      title: String(i.title || "Untitled Evidence"),
      type: g(i.type, O, "other"),
      description: String(i.description || ""),
      image: String(i.image || ""),
      status: g(i.status, q, "unknown"),
      visibility: g(i.visibility, S, "players"),
      hidden: !!i.hidden,
      notes: String(i.notes || "")
    };
  }
  function V(i = {}) {
    return {
      id: i.id || b(),
      name: String(i.name || "Unknown Suspect"),
      alias: String(i.alias || ""),
      image: String(i.image || ""),
      motive: String(i.motive || ""),
      alibi: String(i.alibi || ""),
      status: g(i.status, H, "unknown"),
      visibility: g(i.visibility, S, "players"),
      hidden: !!i.hidden,
      notes: String(i.notes || "")
    };
  }
  function K(i = {}) {
    return {
      id: i.id || b(),
      name: String(i.name || "Unknown Location"),
      sceneId: String(i.sceneId || ""),
      image: String(i.image || ""),
      description: String(i.description || ""),
      visibility: g(i.visibility, S, "players"),
      hidden: !!i.hidden,
      notes: String(i.notes || "")
    };
  }
  function W(i = {}) {
    return {
      id: i.id || b(),
      time: String(i.time || ""),
      title: String(i.title || "Timeline Event"),
      description: String(i.description || ""),
      linkedItemIds: Array.isArray(i.linkedItemIds) ? i.linkedItemIds.map(String) : [],
      visibility: g(i.visibility, S, "players"),
      hidden: !!i.hidden
    };
  }
  function B(i = {}) {
    return {
      id: i.id || b(),
      fromId: String(i.fromId || ""),
      toId: String(i.toId || ""),
      label: String(i.label || ""),
      type: g(i.type, Y, "link"),
      style: g(i.style, z, "solid"),
      color: g(i.color, F, Ue(i.type)),
      visibility: g(i.visibility, S, "players")
    };
  }
  function w(i = {}) {
    var e, t, n;
    return {
      theme: g(i.theme, te, "database"),
      view: {
        x: Number((e = i.view) == null ? void 0 : e.x) || 0,
        y: Number((t = i.view) == null ? void 0 : t.y) || 0,
        scale: P(Number((n = i.view) == null ? void 0 : n.scale) || 1, 0.45, 1.8)
      },
      cards: Object.fromEntries(Object.entries(i.cards ?? {}).map(([s, o]) => [s, {
        x: Number(o == null ? void 0 : o.x) || 0,
        y: Number(o == null ? void 0 : o.y) || 0
      }]))
    };
  }
  function Ye(i, e = "players", t = b()) {
    return i === "evidence" ? j({ id: t, visibility: e }) : i === "suspects" ? V({ id: t, visibility: e }) : i === "locations" ? K({ id: t, visibility: e }) : i === "timeline" ? W({ id: t, visibility: e }) : B({ id: t, visibility: e });
  }
  function T(i, e) {
    return Array.isArray(i) ? i.map((t) => e(t)) : [];
  }
  function g(i, e, t) {
    return e.includes(i) ? i : t;
  }
  function A(i, { resetLayout: e = !1 } = {}) {
    var t;
    (t = m.manager) != null && t.rendered && m.manager.render(!0);
    for (const [n, s] of m.boards.entries())
      e && n.startsWith(`${i}:`) && (s._localLayout = null), n.startsWith(`${i}:`) && s.rendered && s.render(!0);
  }
  function _(i) {
    return !!(typeof i == "string" ? p(i) : i);
  }
  function ze() {
    return !0;
  }
  function Fe(i) {
    for (const [e, t] of m.boards.entries())
      e.startsWith(`${i}:`) && t.close();
  }
  function me(i) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(i) : JSON.parse(JSON.stringify(i));
  }
  function b() {
    var i;
    return foundry.utils.randomID ? foundry.utils.randomID() : ((i = crypto.randomUUID) == null ? void 0 : i.call(crypto)) ?? Math.random().toString(36).slice(2, 12);
  }
  function J(i) {
    return String(i ?? "").replace(/_/g, " ").replace(/\b\w/g, (e) => e.toUpperCase());
  }
  function Ge(i) {
    return String(i || "case").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "case";
  }
  function Q(i) {
    return i === "suspects" ? "suspect" : i === "locations" ? "location" : i === "timeline" ? "timeline item" : i === "connections" ? "connection" : "evidence";
  }
  function Ue(i) {
    return i === "supports" ? "green" : i === "contradicts" ? "red" : i === "location" ? "amber" : i === "timeline" ? "violet" : i === "identity" ? "orange" : "cyan";
  }
  function fe(i, e) {
    return e === "connections" ? i.label || `${i.fromId} -> ${i.toId}` : e === "suspects" || e === "locations" ? i.name : i.title;
  }
  function he(i, e) {
    const t = e.centerX - i.centerX, n = e.centerY - i.centerY;
    if (!t && !n) return { x: Math.round(i.centerX), y: Math.round(i.centerY) };
    const s = t === 0 ? Number.POSITIVE_INFINITY : Math.abs(i.width / 2 / t), o = n === 0 ? Number.POSITIVE_INFINITY : Math.abs(i.height / 2 / n), a = Math.min(s, o);
    return !Number.isFinite(a) || a <= 0 ? { x: Math.round(i.centerX), y: Math.round(i.centerY) } : {
      x: Math.round(i.centerX + t * a),
      y: Math.round(i.centerY + n * a)
    };
  }
  function pe(i) {
    return Number.isFinite(i == null ? void 0 : i.x) && Number.isFinite(i == null ? void 0 : i.y);
  }
  function P(i, e, t) {
    return Math.min(t, Math.max(e, i));
  }
  function ye(i) {
    var t, n, s, o, a;
    const e = globalThis.Dialog ?? ((s = (n = (t = globalThis.foundry) == null ? void 0 : t.appv1) == null ? void 0 : n.api) == null ? void 0 : s.Dialog);
    return e != null && e.confirm ? e.confirm(i) : Promise.resolve((a = globalThis.confirm) == null ? void 0 : a.call(globalThis, ((o = i.content) == null ? void 0 : o.replace(/<[^>]+>/g, "")) ?? i.title));
  }
  function ge(i) {
    const e = document.createElement("div");
    return e.textContent = String(i ?? ""), e.innerHTML;
  }
})();
