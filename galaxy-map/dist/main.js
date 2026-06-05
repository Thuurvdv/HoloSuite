var pt = Object.defineProperty;
var yt = (o, M, p) => M in o ? pt(o, M, { enumerable: !0, configurable: !0, writable: !0, value: p }) : o[M] = p;
var N = (o, M, p) => yt(o, typeof M != "symbol" ? M + "" : M, p);
const Ze = ["core", "colony", "frontier", "station", "anomaly", "ruins", "restricted", "unknown"], Je = ["undiscovered", "known", "visited", "danger", "locked"], We = ["safe", "dangerous", "restricted", "smuggler", "unknown"], he = ["gm", "players"], Qe = ["planet", "ringed", "star", "diamond", "void"];
function K(o = "gmf") {
  return `${o}-${foundry.utils.randomID(10)}`;
}
function qe(o, M = "players") {
  const p = he.includes(M) ? M : "players";
  return he.includes(o) ? String(o) : p;
}
function gt(o) {
  return typeof o == "string" && /^#[0-9a-f]{6}$/i.test(o) ? o : "#58d8ff";
}
function ht(o) {
  return typeof o == "string" && /^#[0-9a-f]{6}$/i.test(o) ? o : "";
}
function Se(o, M = 0) {
  const p = Number(o);
  return Number.isFinite(p) ? p : M;
}
function ie(o, M, p) {
  return Math.min(p, Math.max(M, o));
}
function Re(o = {}) {
  return {
    id: String(o.id || K("system")),
    name: String(o.name || "Unnamed System"),
    x: Math.min(100, Math.max(0, Se(o.x, 50))),
    y: Math.min(100, Math.max(0, Se(o.y, 50))),
    type: Ze.includes(o.type) ? o.type : "unknown",
    factionId: String(o.factionId || ""),
    status: Je.includes(o.status) ? o.status : "known",
    description: String(o.description || ""),
    image: String(o.image || ""),
    sceneId: String(o.sceneId || ""),
    journalId: String(o.journalId || ""),
    visibility: qe(o.visibility, "players"),
    notes: String(o.notes || ""),
    iconColor: ht(o.iconColor),
    iconSize: ie(Se(o.iconSize, 28), 18, 56),
    iconStyle: Qe.includes(o.iconStyle) ? o.iconStyle : "planet",
    pulse: o.pulse !== !1
  };
}
function Ae(o = {}) {
  return {
    id: String(o.id || K("route")),
    fromSystemId: String(o.fromSystemId || ""),
    toSystemId: String(o.toSystemId || ""),
    type: We.includes(o.type) ? o.type : "unknown",
    travelTime: String(o.travelTime || ""),
    fuelCost: Se(o.fuelCost, 0),
    visibility: qe(o.visibility, "players"),
    notes: String(o.notes || "")
  };
}
function Ne(o = {}) {
  return {
    id: String(o.id || K("faction")),
    name: String(o.name || "Unaffiliated"),
    color: gt(o.color),
    description: String(o.description || ""),
    visibility: qe(o.visibility, "players")
  };
}
function _(o = {}) {
  var x;
  const M = Array.isArray(o.systems) ? o.systems.map(Re) : [], p = Array.isArray(o.routes) ? o.routes.map(Ae) : [], A = Array.isArray(o.factions) ? o.factions.map(Ne) : [];
  return {
    id: String(o.id || K("map")),
    title: String(o.title || "Untitled Galaxy Map"),
    subtitle: String(o.subtitle || ""),
    description: String(o.description || ""),
    backgroundImage: String(o.backgroundImage || ""),
    visibility: qe(o.visibility, "players"),
    currentSystemId: String(o.currentSystemId || ((x = M[0]) == null ? void 0 : x.id) || ""),
    systems: M,
    routes: p,
    factions: A
  };
}
function St() {
  var p, A, x, D;
  const o = (A = (p = foundry.applications) == null ? void 0 : p.api) == null ? void 0 : A.ApplicationV2, M = (D = (x = foundry.applications) == null ? void 0 : x.api) == null ? void 0 : D.HandlebarsApplicationMixin;
  return o && M ? M(o) : Application;
}
function vt(o) {
  var ne;
  const {
    templateRoot: M,
    getMaps: p,
    prepareMapForManager: A,
    getRawMap: x,
    openMapMetadataDialog: D,
    openSystemDialog: S,
    openRouteDialog: Z,
    openFactionDialog: ee,
    exportMap: R,
    duplicateMap: I,
    deleteMap: P,
    createMap: $,
    deleteSystem: re,
    deleteRoute: ce,
    deleteFaction: de,
    openMap: ue,
    showMapToPlayers: C,
    closePlayerMap: L,
    clearManagerApp: oe
  } = o;
  return ne = class extends St() {
    constructor(q = {}) {
      super(q);
      N(this, "selectedMapId");
      N(this, "jsonDraft");
      this.selectedMapId = q.selectedMapId ?? null, this.jsonDraft = "";
    }
    async _prepareContext(q) {
      var r, a;
      const v = await ((r = super._prepareContext) == null ? void 0 : r.call(this, q)) ?? {}, te = p().sort((c, d) => c.title.localeCompare(d.title));
      (!this.selectedMapId || !te.some((c) => c.id === this.selectedMapId)) && (this.selectedMapId = ((a = te[0]) == null ? void 0 : a.id) ?? null);
      const le = this.selectedMapId ? A(x(this.selectedMapId)) : null;
      return {
        ...v,
        maps: te,
        selectedMap: le,
        selectedMapId: this.selectedMapId,
        hasMaps: te.length > 0
      };
    }
    _attachPartListeners(q, v, te) {
      var le, r, a, c, d, f, g, w;
      (le = super._attachPartListeners) == null || le.call(this, q, v, te), (r = v.querySelector("[data-action='create-map']")) == null || r.addEventListener("click", () => this._onCreateMap()), (a = v.querySelector("[data-action='edit-map-metadata']")) == null || a.addEventListener("click", () => {
        this.selectedMapId && D(this.selectedMapId);
      }), (c = v.querySelector("[data-action='create-system']")) == null || c.addEventListener("click", () => {
        this.selectedMapId && S(this.selectedMapId);
      }), (d = v.querySelector("[data-action='create-route']")) == null || d.addEventListener("click", () => {
        this.selectedMapId && Z(this.selectedMapId);
      }), (f = v.querySelector("[data-action='create-faction']")) == null || f.addEventListener("click", () => {
        this.selectedMapId && ee(this.selectedMapId);
      }), v.querySelectorAll("[data-edit-system]").forEach((m) => {
        m.addEventListener("click", () => S(this.selectedMapId, m.dataset.editSystem));
      }), v.querySelectorAll("[data-delete-system]").forEach((m) => {
        m.addEventListener("click", () => this._confirmDeleteSystem(m.dataset.deleteSystem));
      }), v.querySelectorAll("[data-edit-route]").forEach((m) => {
        m.addEventListener("click", () => Z(this.selectedMapId, m.dataset.editRoute));
      }), v.querySelectorAll("[data-delete-route]").forEach((m) => {
        m.addEventListener("click", () => this._confirmDeleteRoute(m.dataset.deleteRoute));
      }), v.querySelectorAll("[data-edit-faction]").forEach((m) => {
        m.addEventListener("click", () => ee(this.selectedMapId, m.dataset.editFaction));
      }), v.querySelectorAll("[data-delete-faction]").forEach((m) => {
        m.addEventListener("click", () => this._confirmDeleteFaction(m.dataset.deleteFaction));
      }), (g = v.querySelector("[data-action='export-map']")) == null || g.addEventListener("click", () => {
        this.selectedMapId && R(this.selectedMapId);
      }), v.querySelectorAll("[data-select-map]").forEach((m) => {
        m.addEventListener("click", () => {
          this.selectedMapId = m.dataset.selectMap, this.jsonDraft = "", this.render({ force: !0 });
        });
      }), v.querySelectorAll("[data-open-map]").forEach((m) => {
        m.addEventListener("click", () => ue(m.dataset.openMap));
      }), v.querySelectorAll("[data-show-map]").forEach((m) => {
        m.addEventListener("click", () => C(m.dataset.showMap));
      }), v.querySelectorAll("[data-duplicate-map]").forEach((m) => {
        m.addEventListener("click", async () => {
          const E = await I(m.dataset.duplicateMap);
          E && (this.selectedMapId = E.id, this.jsonDraft = "", this.render({ force: !0 }));
        });
      }), v.querySelectorAll("[data-delete-map]").forEach((m) => {
        m.addEventListener("click", async () => {
          const E = m.dataset.deleteMap, b = x(E);
          await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${(b == null ? void 0 : b.title) ?? E}</strong>? This cannot be undone.</p>`
          }) && (await P(E), this.selectedMapId === E && (this.selectedMapId = null), this.jsonDraft = "", this.render({ force: !0 }));
        });
      }), (w = v.querySelector("[data-action='close-player-map']")) == null || w.addEventListener("click", () => L());
    }
    async _onCreateMap() {
      const q = await $({
        title: "New Galaxy Map",
        subtitle: "Uncharted theatre",
        description: "A campaign-scale navigation map.",
        visibility: "players",
        factions: [
          {
            id: "independent",
            name: "Independent",
            color: "#58d8ff",
            description: "Unaffiliated worlds and stations.",
            visibility: "players"
          }
        ],
        systems: [],
        routes: []
      });
      q && (this.selectedMapId = q.id, this.jsonDraft = "", this.render({ force: !0 }));
    }
    async _confirmDeleteSystem(q) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }) && await re(this.selectedMapId, q);
    }
    async _confirmDeleteRoute(q) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }) && await ce(this.selectedMapId, q);
    }
    async _confirmDeleteFaction(q) {
      await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }) && await de(this.selectedMapId, q);
    }
    async close(q = {}) {
      return oe(this), super.close(q);
    }
  }, N(ne, "DEFAULT_OPTIONS", {
    id: "galaxy-map-manager",
    classes: ["galaxy-map", "gmf-manager-window"],
    window: {
      title: "Galaxy Map Manager",
      icon: "fa-solid fa-satellite"
    },
    position: {
      width: 980,
      height: 720
    }
  }), N(ne, "PARTS", {
    main: {
      template: `${M}/map-manager.hbs`
    }
  }), ne;
}
function bt() {
  var p, A, x, D;
  const o = (A = (p = foundry.applications) == null ? void 0 : p.api) == null ? void 0 : A.ApplicationV2, M = (D = (x = foundry.applications) == null ? void 0 : x.api) == null ? void 0 : D.HandlebarsApplicationMixin;
  return o && M ? M(o) : Application;
}
function Mt(o) {
  var v;
  const {
    templateRoot: M,
    getRawMap: p,
    prepareMapForDisplay: A,
    openSystemDialog: x,
    openRouteDialog: D,
    openFactionDialog: S,
    openFactionManagerDialog: Z,
    openMapMetadataDialog: ee,
    revealSystemToPlayers: R,
    revealRouteToPlayers: I,
    deleteSystem: P,
    deleteRoute: $,
    setCurrentSystem: re,
    requestTravelToSystem: ce,
    notifySystemDiscovered: de,
    exportMap: ue,
    getTravelRoute: C,
    notifyInfo: L,
    notifyError: oe,
    saveSystemPosition: ne,
    showMapToPlayers: y,
    openMapManager: G,
    clearMapView: q
  } = o;
  return v = class extends bt() {
    constructor(r = {}) {
      var d;
      const a = r.mapId, c = r.playerMode ?? !((d = game.user) != null && d.isGM);
      super({
        ...r,
        id: `galaxy-map-view-${c ? "player" : "gm"}-${a}`
      });
      N(this, "mapId");
      N(this, "playerMode");
      N(this, "selectedSystemId");
      N(this, "selectedRouteId");
      N(this, "zoom");
      N(this, "panX");
      N(this, "panY");
      N(this, "_drag");
      N(this, "_contextTarget");
      N(this, "_boundContextClose");
      this.mapId = a, this.playerMode = c, this.selectedSystemId = r.selectedSystemId ?? null, this.selectedRouteId = r.selectedRouteId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null;
    }
    get title() {
      const r = p(this.mapId), a = this.playerMode ? "Player View" : "GM View";
      return r ? `${r.title} - ${a}` : `Galaxy Map - ${a}`;
    }
    async _prepareContext(r) {
      var f;
      const a = await ((f = super._prepareContext) == null ? void 0 : f.call(this, r)) ?? {}, c = p(this.mapId), d = c ? A(c, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      }) : null;
      return d != null && d.selectedSystem && (this.selectedSystemId = d.selectedSystem.id), {
        ...a,
        map: d,
        mapId: this.mapId,
        playerMode: this.playerMode,
        zoomPercent: Math.round(this.zoom * 100),
        panX: this.panX,
        panY: this.panY,
        zoom: this.zoom,
        missingMap: !c
      };
    }
    _onRender(r, a) {
      var d, f;
      (d = super._onRender) == null || d.call(this, r, a);
      const c = this.element instanceof HTMLElement ? this.element : (f = this.element) == null ? void 0 : f[0];
      c && this._attachPartListeners("main", c, a);
    }
    _attachPartListeners(r, a, c) {
      var g, w, m, E, b, Y, j, F, X, J, H, ve, fe, be, Me, Ie, me, xe, pe, $e;
      const d = (g = a.matches) != null && g.call(a, ".gmf-map-stage") ? a : (w = a.querySelector) == null ? void 0 : w.call(a, ".gmf-map-stage");
      if ((d == null ? void 0 : d.dataset.gmfMapBound) === "true") return;
      d && (d.dataset.gmfMapBound = "true"), (m = super._attachPartListeners) == null || m.call(this, r, a, c), this._applyViewportTransform(a), a.querySelectorAll("[data-system-id]").forEach((T) => {
        var se;
        T.addEventListener("click", (we) => {
          if (T.dataset.dragged === "true") {
            T.dataset.dragged = "false";
            return;
          }
          we.stopPropagation(), this.selectedSystemId = T.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
        }), !this.playerMode && ((se = game.user) != null && se.isGM) && T.addEventListener("pointerdown", (we) => this._startSystemDrag(we, a, T));
      }), a.querySelectorAll("[data-route-id]").forEach((T) => {
        T.addEventListener("click", (se) => {
          se.stopPropagation(), this.selectedRouteId = T.dataset.routeId, this.selectedSystemId = null, this.render({ force: !0 });
        });
      });
      const f = a.querySelector(".gmf-map-stage");
      f == null || f.addEventListener("wheel", (T) => this._onWheelZoom(T, a), { passive: !1 }), f == null || f.addEventListener("pointerdown", (T) => this._startPan(T, a)), f == null || f.addEventListener("contextmenu", (T) => this._openContextMenu(T, a), { capture: !0 }), a.querySelectorAll("[data-context-action]").forEach((T) => {
        T.addEventListener("click", (se) => this._handleContextAction(se, a));
      }), (E = a.querySelector("[data-action='open-map-menu']")) == null || E.addEventListener("click", (T) => this._openStageMenuFromButton(T, a)), (b = a.querySelector("[data-action='zoom-in']")) == null || b.addEventListener("click", () => this._setZoom(this.zoom + 0.15, a)), (Y = a.querySelector("[data-action='zoom-out']")) == null || Y.addEventListener("click", () => this._setZoom(this.zoom - 0.15, a)), (j = a.querySelector("[data-action='reset-view']")) == null || j.addEventListener("click", () => {
        this.zoom = 1, this.panX = 0, this.panY = 0, this._applyViewportTransform(a);
      }), (F = a.querySelector("[data-action='open-scene']")) == null || F.addEventListener("click", () => this._openLinkedScene()), (X = a.querySelector("[data-action='open-journal']")) == null || X.addEventListener("click", () => this._openLinkedJournal()), (J = a.querySelector("[data-action='edit-system']")) == null || J.addEventListener("click", () => {
        this.selectedSystemId && x(this.mapId, this.selectedSystemId);
      }), (H = a.querySelector("[data-action='reveal-system']")) == null || H.addEventListener("click", () => {
        this.selectedSystemId && R(this.mapId, this.selectedSystemId);
      }), (ve = a.querySelector("[data-action='delete-system']")) == null || ve.addEventListener("click", () => {
        this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), (fe = a.querySelector("[data-action='set-current-system']")) == null || fe.addEventListener("click", () => {
        this.selectedSystemId && re(this.mapId, this.selectedSystemId);
      }), (be = a.querySelector("[data-action='travel-to-system']")) == null || be.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? ce(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, a));
      }), (Me = a.querySelector("[data-action='edit-route']")) == null || Me.addEventListener("click", () => {
        this.selectedRouteId && D(this.mapId, this.selectedRouteId);
      }), (Ie = a.querySelector("[data-action='reveal-route']")) == null || Ie.addEventListener("click", () => {
        this.selectedRouteId && I(this.mapId, this.selectedRouteId);
      }), (me = a.querySelector("[data-action='delete-route']")) == null || me.addEventListener("click", () => {
        this.selectedRouteId && this._confirmDeleteRoute(this.selectedRouteId);
      }), (xe = a.querySelector("[data-action='notify-discovery']")) == null || xe.addEventListener("click", () => {
        this.selectedSystemId && de(this.mapId, this.selectedSystemId);
      }), (pe = a.querySelector("[data-action='show-to-players']")) == null || pe.addEventListener("click", () => y(this.mapId)), ($e = a.querySelector("[data-action='edit-map']")) == null || $e.addEventListener("click", () => {
        const T = G();
        T && (T.selectedMapId = this.mapId, T.render({ force: !0 }));
      });
    }
    _applyViewportTransform(r) {
      var c;
      const a = r.querySelector(".gmf-map-viewport");
      a && (a.style.setProperty("--gmf-pan-x", `${this.panX}px`), a.style.setProperty("--gmf-pan-y", `${this.panY}px`), a.style.setProperty("--gmf-zoom", String(this.zoom)), (c = r.querySelector("[data-zoom-label]")) == null || c.replaceChildren(`${Math.round(this.zoom * 100)}%`));
    }
    _setZoom(r, a) {
      this.zoom = ie(r, 0.55, 2.6), this._applyViewportTransform(a);
    }
    _onWheelZoom(r, a) {
      r.preventDefault();
      const c = a.querySelector(".gmf-map-stage");
      if (!c) return;
      const d = c.getBoundingClientRect(), f = this.zoom, g = ie(f + (r.deltaY < 0 ? 0.12 : -0.12), 0.55, 2.6), w = r.clientX - d.left, m = r.clientY - d.top, E = (w - this.panX) / f, b = (m - this.panY) / f;
      this.zoom = g, this.panX = w - E * g, this.panY = m - b * g, this._applyViewportTransform(a);
    }
    _startPan(r, a) {
      if (r.button !== 0 || r.target.closest("[data-system-id], [data-route-id], button")) return;
      r.preventDefault();
      const c = r.clientX, d = r.clientY, f = this.panX, g = this.panY, w = (E) => {
        this.panX = f + E.clientX - c, this.panY = g + E.clientY - d, this._applyViewportTransform(a);
      }, m = () => {
        window.removeEventListener("pointermove", w), window.removeEventListener("pointerup", m);
      };
      window.addEventListener("pointermove", w), window.addEventListener("pointerup", m, { once: !0 });
    }
    _startSystemDrag(r, a, c) {
      var F;
      if (r.button !== 0) return;
      r.preventDefault(), r.stopPropagation(), (F = c.setPointerCapture) == null || F.call(c, r.pointerId);
      const d = r.clientX, f = r.clientY;
      let g = this._pointerToMapPercent(r, a), w = !1, m = null;
      const E = Array.from(a.querySelectorAll(`[data-route-from="${c.dataset.systemId}"]`)), b = Array.from(a.querySelectorAll(`[data-route-to="${c.dataset.systemId}"]`));
      c.classList.add("is-dragging");
      const Y = (X) => {
        const J = Math.abs(X.clientX - d), H = Math.abs(X.clientY - f);
        w = w || J > 3 || H > 3, g = this._pointerToMapPercent(X, a), c.dataset.dragged = w ? "true" : "false", !m && (m = requestAnimationFrame(() => {
          m = null, c.style.left = `${g.x}%`, c.style.top = `${g.y}%`, this._updateConnectedRoutes(E, b, g.x, g.y);
        }));
      }, j = async () => {
        m && cancelAnimationFrame(m), c.style.left = `${g.x}%`, c.style.top = `${g.y}%`, this._updateConnectedRoutes(E, b, g.x, g.y), c.classList.remove("is-dragging"), window.removeEventListener("pointermove", Y), window.removeEventListener("pointerup", j), w && await ne(this.mapId, c.dataset.systemId, g.x, g.y);
      };
      window.addEventListener("pointermove", Y), window.addEventListener("pointerup", j, { once: !0 });
    }
    _pointerToMapPercent(r, a) {
      const d = a.querySelector(".gmf-map-stage").getBoundingClientRect();
      return {
        x: ie((r.clientX - d.left - this.panX) / this.zoom / d.width * 100, 0, 100),
        y: ie((r.clientY - d.top - this.panY) / this.zoom / d.height * 100, 0, 100)
      };
    }
    _updateConnectedRoutes(r, a, c, d) {
      r.forEach((f) => {
        f.setAttribute("x1", c), f.setAttribute("y1", d);
      }), a.forEach((f) => {
        f.setAttribute("x2", c), f.setAttribute("y2", d);
      });
    }
    _openContextMenu(r, a) {
      var J;
      if (!((J = game.user) != null && J.isGM) || this.playerMode || r.target.closest(".gmf-map-toolbar, .gmf-context-menu")) return;
      r.preventDefault(), r.stopPropagation();
      const c = r.target.closest("[data-route-id]"), d = r.target.closest("[data-system-id]"), f = this._pointerToMapPercent(r, a);
      this._contextTarget = c ? { type: "route", id: c.dataset.routeId, position: f } : d ? { type: "system", id: d.dataset.systemId, position: f } : { type: "stage", id: null, position: f };
      const g = a.querySelector("[data-gmf-context-menu]");
      if (!g) return;
      g.querySelectorAll("[data-context-show]").forEach((H) => {
        H.hidden = H.dataset.contextShow !== this._contextTarget.type;
      }), g.hidden = !1;
      const w = g.offsetWidth || 184, m = g.offsetHeight || 260, b = a.querySelector(".gmf-map-stage").getBoundingClientRect(), Y = r.clientX - b.left, j = r.clientY - b.top, F = Math.max(4, b.width - w - 4), X = Math.max(4, b.height - m - 4);
      g.style.left = `${ie(Y, 4, F)}px`, g.style.top = `${ie(j, 4, X)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(a), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _openStageMenuFromButton(r, a) {
      var g;
      if (!((g = game.user) != null && g.isGM) || this.playerMode) return;
      r.preventDefault(), r.stopPropagation();
      const c = a.querySelector(".gmf-map-stage"), d = c == null ? void 0 : c.getBoundingClientRect();
      if (!d) return;
      const f = {
        clientX: d.left + d.width / 2,
        clientY: d.top + d.height / 2,
        target: c,
        preventDefault: () => {
        },
        stopPropagation: () => {
        }
      };
      this._openContextMenu(f, a);
    }
    _hideContextMenu(r = null) {
      var d, f, g;
      const a = r ?? this.element ?? null, c = ((d = a == null ? void 0 : a.querySelector) == null ? void 0 : d.call(a, "[data-gmf-context-menu]")) ?? ((g = (f = a == null ? void 0 : a[0]) == null ? void 0 : f.querySelector) == null ? void 0 : g.call(f, "[data-gmf-context-menu]"));
      c && (c.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(r, a) {
      r.preventDefault(), r.stopPropagation();
      const c = r.currentTarget.dataset.contextAction, d = this._contextTarget;
      this._hideContextMenu(a), d && (c === "add-system" ? x(this.mapId, null, { x: d.position.x, y: d.position.y }) : c === "add-route" ? D(this.mapId) : c === "manage-factions" ? Z(this.mapId) : c === "add-faction" ? S(this.mapId) : c === "edit-map-details" ? ee(this.mapId) : c === "export-map" ? ue(this.mapId) : c === "edit-system" ? x(this.mapId, d.id) : c === "add-route-from-system" ? D(this.mapId, null, { fromSystemId: d.id }) : c === "reveal-system" ? await R(this.mapId, d.id) : c === "delete-system" ? await this._confirmDeleteSystem(d.id) : c === "edit-route" ? D(this.mapId, d.id) : c === "reveal-route" ? await I(this.mapId, d.id) : c === "delete-route" && await this._confirmDeleteRoute(d.id));
    }
    async _confirmDeleteSystem(r) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }) && await P(this.mapId, r);
    }
    async _confirmDeleteRoute(r) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }) && await $(this.mapId, r);
    }
    async _travelToSystem(r, a) {
      const c = _(p(this.mapId)), d = c.systems.find((w) => w.id === c.currentSystemId), f = c.systems.find((w) => w.id === r);
      if (!f) return;
      if (!d) {
        await re(this.mapId, f.id), L(`Current location set to ${f.name}.`);
        return;
      }
      if (d.id === f.id) {
        L(`${f.name} is already the current location.`);
        return;
      }
      if (!C(c, d.id, f.id)) {
        oe(`No direct route from ${d.name} to ${f.name}.`);
        return;
      }
      await this._animateShipTravel(d, f, a), await re(this.mapId, f.id), L(`Arrived at ${f.name}.`);
    }
    _animateShipTravel(r, a, c) {
      const d = c.querySelector("[data-ship-layer]"), f = c.querySelector(".gmf-map-stage");
      if (!d || !f) return Promise.resolve();
      const g = f.getBoundingClientRect(), w = (a.x - r.x) * g.width / 100, m = (a.y - r.y) * g.height / 100, E = Math.atan2(m, w) * 180 / Math.PI, b = document.createElement("div");
      return b.className = "gmf-travel-ship", b.innerHTML = '<i class="fa-solid fa-rocket"></i>', b.style.left = `${r.x}%`, b.style.top = `${r.y}%`, b.style.setProperty("--gmf-ship-angle", `${E}deg`), d.replaceChildren(b), new Promise((Y) => {
        let j = !1;
        const F = () => {
          j || (j = !0, b.removeEventListener("transitionend", F), b.classList.add("is-arrived"), globalThis.setTimeout(() => {
            b.remove(), Y();
          }, 260));
        };
        b.addEventListener("transitionend", F, { once: !0 }), requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            b.style.left = `${a.x}%`, b.style.top = `${a.y}%`;
          });
        }), globalThis.setTimeout(F, 2400);
      });
    }
    _openLinkedScene() {
      var c;
      const r = this._getSelectedRawSystem();
      if (!(r != null && r.sceneId)) return;
      const a = (c = game.scenes) == null ? void 0 : c.get(r.sceneId);
      if (!a) {
        oe(`Scene "${r.sceneId}" was not found.`);
        return;
      }
      a.view();
    }
    _openLinkedJournal() {
      var c, d;
      const r = this._getSelectedRawSystem();
      if (!(r != null && r.journalId)) return;
      const a = (c = game.journal) == null ? void 0 : c.get(r.journalId);
      if (!a) {
        oe(`Journal "${r.journalId}" was not found.`);
        return;
      }
      (d = a.sheet) == null || d.render(!0);
    }
    _getSelectedRawSystem() {
      var a;
      const r = p(this.mapId);
      return ((a = r == null ? void 0 : r.systems) == null ? void 0 : a.find((c) => c.id === this.selectedSystemId)) ?? null;
    }
    async close(r = {}) {
      return this._hideContextMenu(), q(this), super.close(r);
    }
  }, N(v, "DEFAULT_OPTIONS", {
    id: "galaxy-map-view",
    classes: ["galaxy-map", "gmf-map-window"],
    window: {
      title: "Galaxy Map",
      icon: "fa-solid fa-meteor",
      resizable: !0
    },
    resizable: !0,
    position: {
      width: 1120,
      height: 760
    }
  }), N(v, "PARTS", {
    main: {
      template: `${M}/galaxy-map.hbs`
    }
  }), v;
}
(() => {
  const o = "galaxy-map", M = "maps", p = `module.${o}`, A = `modules/${o}/templates`;
  let x = null;
  const D = /* @__PURE__ */ new Map();
  let S = null;
  const Z = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Set();
  function R(e) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? {}));
  }
  function I(e) {
    var t;
    (t = ui.notifications) == null || t.error(`[Galaxy Map] ${e}`);
  }
  function P(e) {
    var t;
    (t = ui.notifications) == null || t.info(`[Galaxy Map] ${e}`);
  }
  function $(e = "change galaxy maps") {
    var t;
    return (t = game.user) != null && t.isGM ? !0 : (I(`Only a GM can ${e}.`), !1);
  }
  function re() {
    var e;
    return ((e = game.users) == null ? void 0 : e.contents) ?? Array.from(game.users ?? []);
  }
  function ce() {
    return re().filter((e) => e.active);
  }
  function de() {
    return ce().filter((e) => e.isGM).sort((e, t) => String(e.id).localeCompare(String(t.id)))[0] ?? null;
  }
  function ue() {
    var e, t;
    return !!((e = game.user) != null && e.isGM && ((t = de()) == null ? void 0 : t.id) === game.user.id);
  }
  function C() {
    return R(game.settings.get(o, M) ?? {});
  }
  async function L(e) {
    return $("save galaxy map data") && await game.settings.set(o, M, e ?? {}), e;
  }
  function oe(e) {
    return String(e || "galaxy-map").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "galaxy-map";
  }
  function ne(e, t) {
    const s = new Blob([JSON.stringify(t, null, 2)], { type: "application/json" }), i = URL.createObjectURL(s), n = document.createElement("a");
    n.href = i, n.download = e, document.body.appendChild(n), n.click(), n.remove(), URL.revokeObjectURL(i);
  }
  function y(e) {
    const t = document.createElement("div");
    return t.textContent = String(e ?? ""), t.innerHTML;
  }
  function G(e, t) {
    return e.map((s) => {
      const i = typeof s == "string" ? s : s.value, n = typeof s == "string" ? s : s.label;
      return `<option value="${y(i)}" ${i === t ? "selected" : ""}>${y(n)}</option>`;
    }).join("");
  }
  function q(e, t) {
    const s = (e == null ? void 0 : e.contents) ?? [];
    return [
      { value: "", label: "None" },
      ...s.map((i) => ({ value: i.id, label: i.name }))
    ].map((i) => `<option value="${y(i.value)}" ${i.value === t ? "selected" : ""}>${y(i.label)}</option>`).join("");
  }
  function v(e) {
    return (e == null ? void 0 : e[0]) ?? e;
  }
  function te(e) {
    var i;
    const t = v(e), s = (i = t == null ? void 0 : t.matches) != null && i.call(t, "form") ? t : t == null ? void 0 : t.querySelector("form");
    return Object.fromEntries(new FormData(s).entries());
  }
  function le(e) {
    const t = v(e);
    t == null || t.querySelectorAll("[data-browse-target]").forEach((s) => {
      s.addEventListener("click", (i) => {
        i.preventDefault();
        const n = t.querySelector(`[name="${s.dataset.browseTarget}"]`);
        n && new FilePicker({
          type: "image",
          current: n.value,
          callback: (l) => {
            n.value = l, n.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        }).browse();
      });
    });
  }
  function r({ title: e, content: t, submitLabel: s = "Save", onSubmit: i, render: n = le }) {
    new Dialog({
      title: e,
      content: t,
      render: n,
      buttons: {
        save: {
          icon: '<i class="fa-solid fa-floppy-disk"></i>',
          label: s,
          callback: (l) => i(te(l))
        },
        cancel: {
          icon: '<i class="fa-solid fa-xmark"></i>',
          label: "Cancel"
        }
      },
      default: "save"
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog"],
      width: 560
    }).render(!0);
  }
  function a(e) {
    const t = C();
    return t[e] ? R(t[e]) : null;
  }
  function c(e) {
    return new Map((e ?? []).map((t) => [t.id, t]));
  }
  function d(e) {
    return e.visibility === "players";
  }
  function f(e, t) {
    return t && e.status === "undiscovered";
  }
  function g(e, { playerMode: t = !1, selectedSystemId: s = null, selectedRouteId: i = null } = {}) {
    var He, Be;
    const n = _(e), l = t ? n.systems.filter(d) : n.systems, u = new Set(l.map((h) => h.id)), k = t ? n.factions.filter((h) => h.visibility === "players") : n.factions, O = c(k), V = l.map((h) => {
      const B = O.get(h.factionId), Q = f(h, t);
      return {
        ...h,
        displayName: Q ? "???" : h.name,
        displayDescription: Q ? "Unresolved sensor contact. Details are not available." : h.description,
        displayType: Q ? "unknown" : h.type,
        displayStatus: Q ? "undiscovered" : h.status,
        factionName: (B == null ? void 0 : B.name) ?? "Unaffiliated",
        factionColor: h.iconColor || (B == null ? void 0 : B.color) || "#58d8ff",
        obscured: Q,
        isCurrent: h.id === n.currentSystemId,
        isSelected: h.id === s,
        gmOnly: h.visibility === "gm"
      };
    }), ge = n.routes.filter((h) => !t || h.visibility === "players").filter((h) => u.has(h.fromSystemId) && u.has(h.toSystemId)).map((h) => {
      const B = V.find((De) => De.id === h.fromSystemId), Q = V.find((De) => De.id === h.toSystemId);
      return {
        ...h,
        from: B,
        to: Q,
        fromName: (B == null ? void 0 : B.displayName) ?? h.fromSystemId,
        toName: (Q == null ? void 0 : Q.displayName) ?? h.toSystemId,
        isSelected: h.id === i,
        connectsCurrent: h.fromSystemId === n.currentSystemId || h.toSystemId === n.currentSystemId,
        gmOnly: h.visibility === "gm"
      };
    }), W = ge.find((h) => h.id === i) ?? null, U = W ? null : V.find((h) => h.id === s) ?? V[0] ?? null;
    U && (U.isSelected = !0);
    const ae = V.find((h) => h.id === n.currentSystemId) ?? V[0] ?? null, ke = U && ae && U.id !== ae.id ? ge.find((h) => h.fromSystemId === ae.id && h.toSystemId === U.id || h.toSystemId === ae.id && h.fromSystemId === U.id) : null;
    return U && (U.canTravel = !!ke, U.travelRouteId = (ke == null ? void 0 : ke.id) ?? "", U.isCurrent = U.id === (ae == null ? void 0 : ae.id)), {
      ...n,
      systems: V,
      routes: ge,
      factions: k,
      selectedSystem: U,
      selectedRoute: W,
      currentSystem: ae,
      selectedType: W ? "route" : "system",
      playerMode: t,
      isGM: ((He = game.user) == null ? void 0 : He.isGM) ?? !1,
      canEdit: ((Be = game.user) == null ? void 0 : Be.isGM) && !t
    };
  }
  async function w(e = {}) {
    if (!$("create galaxy maps")) return null;
    const t = C(), s = _(e);
    return t[s.id] = s, await L(t), z(s.id), R(s);
  }
  async function m(e, t = {}) {
    if (!$("update galaxy maps")) return null;
    const s = C();
    if (!s[e])
      return I(`Map "${e}" was not found.`), null;
    const i = _({ ...t, id: e });
    return s[e] = i, await L(s), z(e), R(i);
  }
  async function E(e, t = {}) {
    if (!$("update galaxy map metadata")) return null;
    const s = a(e);
    return s ? m(e, {
      ...s,
      title: t.title,
      subtitle: t.subtitle,
      description: t.description,
      backgroundImage: t.backgroundImage,
      visibility: t.visibility
    }) : (I(`Map "${e}" was not found.`), null);
  }
  async function b(e) {
    if (!$("delete galaxy maps")) return !1;
    const t = C();
    return t[e] ? (delete t[e], await L(t), ct(e), z(), !0) : !1;
  }
  async function Y(e) {
    if (!$("duplicate galaxy maps")) return null;
    const t = a(e);
    if (!t)
      return I(`Map "${e}" was not found.`), null;
    const s = _({
      ...t,
      id: K("map"),
      title: `${t.title} Copy`
    }), i = C();
    return i[s.id] = s, await L(i), z(s.id), R(s);
  }
  async function j(e, t = {}) {
    if (!$("save star systems")) return null;
    const s = C(), i = s[e];
    if (!i)
      return I(`Map "${e}" was not found.`), null;
    const n = Re(t), l = i.systems.findIndex((u) => u.id === n.id);
    return l >= 0 ? i.systems[l] = n : i.systems.push(n), s[e] = _(i), await L(s), z(e), game.socket.emit(p, { action: "refresh", mapId: e }), R(n);
  }
  async function F(e, t) {
    var n;
    if (!$("delete star systems")) return !1;
    const s = C(), i = s[e];
    return i ? (i.systems = i.systems.filter((l) => l.id !== t), i.routes = i.routes.filter((l) => l.fromSystemId !== t && l.toSystemId !== t), i.currentSystemId === t && (i.currentSystemId = ((n = i.systems[0]) == null ? void 0 : n.id) ?? ""), s[e] = _(i), await L(s), z(e), game.socket.emit(p, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function X(e, t) {
    var l;
    if (!$("set current location")) return null;
    const s = C(), i = s[e], n = (l = i == null ? void 0 : i.systems) == null ? void 0 : l.find((u) => u.id === t);
    return n ? (i.currentSystemId = t, s[e] = _(i), await L(s), z(e), game.socket.emit(p, { action: "refresh", mapId: e }), R(n)) : (I(`System "${t}" was not found.`), null);
  }
  async function J(e, t = {}) {
    if (!$("save routes")) return null;
    const s = C(), i = s[e];
    if (!i)
      return I(`Map "${e}" was not found.`), null;
    const n = Ae(t);
    if (!n.fromSystemId || !n.toSystemId || n.fromSystemId === n.toSystemId)
      return I("Routes require two different systems."), null;
    const l = i.routes.findIndex((u) => u.id === n.id);
    return l >= 0 ? i.routes[l] = n : i.routes.push(n), s[e] = _(i), await L(s), z(e), game.socket.emit(p, { action: "refresh", mapId: e }), R(n);
  }
  async function H(e, t) {
    if (!$("delete routes")) return !1;
    const s = C(), i = s[e];
    return i ? (i.routes = i.routes.filter((n) => n.id !== t), s[e] = _(i), await L(s), z(e), game.socket.emit(p, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function ve(e, t = {}) {
    if (!$("save factions")) return null;
    const s = C(), i = s[e];
    if (!i)
      return I(`Map "${e}" was not found.`), null;
    const n = Ne(t), l = i.factions.findIndex((u) => u.id === n.id);
    return l >= 0 ? i.factions[l] = n : i.factions.push(n), s[e] = _(i), await L(s), z(e), game.socket.emit(p, { action: "refresh", mapId: e }), R(n);
  }
  async function fe(e, t) {
    if (!$("delete factions")) return !1;
    const s = C(), i = s[e];
    if (!i) return !1;
    i.factions = i.factions.filter((n) => n.id !== t);
    for (const n of i.systems)
      n.factionId === t && (n.factionId = "");
    return s[e] = _(i), await L(s), z(e), game.socket.emit(p, { action: "refresh", mapId: e }), !0;
  }
  async function be(e, t, s, i) {
    var k;
    if (!$("move star systems")) return null;
    const n = C(), l = n[e], u = (k = l == null ? void 0 : l.systems) == null ? void 0 : k.find((O) => O.id === t);
    return u ? (u.x = ie(Se(s, u.x), 0, 100), u.y = ie(Se(i, u.y), 0, 100), n[e] = _(l), await L(n), game.socket.emit(p, { action: "refresh", mapId: e }), R(u)) : (I(`System "${t}" was not found.`), null);
  }
  async function Me(e, t, { notify: s = !0 } = {}) {
    var u;
    if (!$("reveal star systems")) return null;
    const i = C(), n = i[e], l = (u = n == null ? void 0 : n.systems) == null ? void 0 : u.find((k) => k.id === t);
    return l ? (l.visibility = "players", (l.status === "undiscovered" || l.status === "locked") && (l.status = "known"), i[e] = _(n), await L(i), z(e), game.socket.emit(p, { action: "refresh", mapId: e }), s && me(e, l.id), P(`${l.name} revealed to players.`), R(l)) : (I(`System "${t}" was not found.`), null);
  }
  async function Ie(e, t) {
    var l;
    if (!$("reveal routes")) return null;
    const s = C(), i = s[e], n = (l = i == null ? void 0 : i.routes) == null ? void 0 : l.find((u) => u.id === t);
    return n ? (n.visibility = "players", s[e] = _(i), await L(s), z(e), game.socket.emit(p, { action: "refresh", mapId: e }), P("Route revealed to players."), R(n)) : (I(`Route "${t}" was not found.`), null);
  }
  function me(e, t) {
    var n;
    if (!$("notify players about discoveries")) return;
    const s = a(e), i = (n = s == null ? void 0 : s.systems) == null ? void 0 : n.find((l) => l.id === t);
    if (!i) {
      I(`System "${t}" was not found.`);
      return;
    }
    game.socket.emit(p, {
      action: "notify",
      mapId: e,
      systemId: t,
      message: `New System Discovered: ${i.name}`
    }), P(`Discovery notification sent: ${i.name}.`);
  }
  async function xe(e, { replace: t = !1 } = {}) {
    if (!$("import galaxy maps")) return null;
    const s = C();
    let i = _(e);
    return s[i.id] && !t && (i = _({
      ...i,
      id: K("map"),
      title: `${i.title} Import`
    })), s[i.id] = i, await L(s), z(i.id), P(`Imported ${i.title}.`), R(i);
  }
  function pe(e) {
    const t = a(e);
    if (!t) {
      I(`Map "${e}" was not found.`);
      return;
    }
    ne(`${oe(t.title)}.json`, _(t));
  }
  function $e(e, t = {}, s = {}) {
    const i = a(e), n = Re({ ...s, ...t }), l = [
      { value: "", label: "Unaffiliated" },
      ...((i == null ? void 0 : i.factions) ?? []).map((O) => ({ value: O.id, label: O.name }))
    ], u = ((i == null ? void 0 : i.factions) ?? []).find((O) => O.id === n.factionId), k = n.iconColor || (u == null ? void 0 : u.color) || "#58d8ff";
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${y(n.id)}" />
        <input type="hidden" name="x" value="${y(n.x)}" />
        <input type="hidden" name="y" value="${y(n.y)}" />
        <label>Name <input type="text" name="name" value="${y(n.name)}" /></label>
        <div class="gmf-form-grid">
          <label>Type <select name="type">${G(Ze, n.type)}</select></label>
          <label>Status <select name="status">${G(Je, n.status)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Faction <select name="factionId">${G(l, n.factionId)}</select></label>
          <label>Visibility <select name="visibility">${G(he, n.visibility)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Icon Style <select name="iconStyle">${G(Qe, n.iconStyle)}</select></label>
          <label>Icon Size <input type="range" name="iconSize" value="${y(n.iconSize)}" min="18" max="56" step="1" /></label>
        </div>
        <div class="gmf-form-grid">
          <label>Icon Color <input type="color" name="iconColor" value="${y(k)}" /></label>
          <label class="gmf-checkbox-label"><input type="checkbox" name="pulse" value="true" ${n.pulse ? "checked" : ""} /> Pulse Glow</label>
        </div>
        <label>Description <textarea name="description">${y(n.description)}</textarea></label>
        <label>Image Path
          <div class="gmf-path-field">
            <input type="text" name="image" value="${y(n.image)}" />
            <button type="button" data-browse-target="image"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
        <div class="gmf-form-grid">
          <label>Scene <select name="sceneId">${q(game.scenes, n.sceneId)}</select></label>
          <label>Journal <select name="journalId">${q(game.journal, n.journalId)}</select></label>
        </div>
        <label>GM Notes <textarea name="notes">${y(n.notes)}</textarea></label>
      </form>
    `;
  }
  function T(e, t = {}, s = {}) {
    var O, V, ge;
    const i = a(e), n = { ...s, ...t }, l = (i == null ? void 0 : i.systems) ?? [];
    n.fromSystemId || (n.fromSystemId = ((O = l[0]) == null ? void 0 : O.id) ?? ""), n.toSystemId || (n.toSystemId = ((V = l.find((W) => W.id !== n.fromSystemId)) == null ? void 0 : V.id) ?? ""), n.fromSystemId && !n.toSystemId && (n.toSystemId = ((ge = l.find((W) => W.id !== n.fromSystemId)) == null ? void 0 : ge.id) ?? "");
    const u = Ae(n), k = l.map((W) => ({ value: W.id, label: W.name }));
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${y(u.id)}" />
        <div class="gmf-form-grid">
          <label>From <select name="fromSystemId">${G(k, u.fromSystemId)}</select></label>
          <label>To <select name="toSystemId">${G(k, u.toSystemId)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Type <select name="type">${G(We, u.type)}</select></label>
          <label>Visibility <select name="visibility">${G(he, u.visibility)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Travel Time <input type="text" name="travelTime" value="${y(u.travelTime)}" /></label>
          <label>Fuel Cost <input type="number" name="fuelCost" value="${y(u.fuelCost)}" min="0" step="1" /></label>
        </div>
        <label>Notes <textarea name="notes">${y(u.notes)}</textarea></label>
      </form>
    `;
  }
  function se(e = {}) {
    const t = Ne(e);
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${y(t.id)}" />
        <label>Name <input type="text" name="name" value="${y(t.name)}" /></label>
        <div class="gmf-form-grid">
          <label>Color <input type="color" name="color" value="${y(t.color)}" /></label>
          <label>Visibility <select name="visibility">${G(he, t.visibility)}</select></label>
        </div>
        <label>Description <textarea name="description">${y(t.description)}</textarea></label>
      </form>
    `;
  }
  function we(e = {}) {
    const t = _(e);
    return `
      <form class="gmf-crud-form">
        <label>Title <input type="text" name="title" value="${y(t.title)}" /></label>
        <label>Subtitle <input type="text" name="subtitle" value="${y(t.subtitle)}" /></label>
        <label>Description <textarea name="description">${y(t.description)}</textarea></label>
        <label>Background Image
          <div class="gmf-path-field">
            <input type="text" name="backgroundImage" value="${y(t.backgroundImage)}" />
            <button type="button" data-browse-target="backgroundImage"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
        <label>Visibility <select name="visibility">${G(he, t.visibility)}</select></label>
      </form>
    `;
  }
  function Pe(e) {
    const t = a(e);
    t && r({
      title: "Edit Galaxy Map",
      content: we(t),
      onSubmit: (s) => E(e, s)
    });
  }
  function Fe(e, t = null, s = {}) {
    var l;
    const i = a(e), n = t ? (l = i == null ? void 0 : i.systems) == null ? void 0 : l.find((u) => u.id === t) : null;
    r({
      title: n ? "Edit Star System" : "Create Star System",
      content: $e(e, n ?? { id: K("system"), name: "New System" }, s),
      submitLabel: n ? "Save System" : "Create System",
      onSubmit: (u) => j(e, { ...u, pulse: u.pulse === "true" })
    });
  }
  function Oe(e, t = null, s = {}) {
    var l;
    const i = a(e);
    if ((((l = i == null ? void 0 : i.systems) == null ? void 0 : l.length) ?? 0) < 2) {
      I("Create at least two systems before adding a route.");
      return;
    }
    const n = t ? i.routes.find((u) => u.id === t) : null;
    r({
      title: n ? "Edit Route" : "Create Route",
      content: T(e, n ?? { id: K("route") }, s),
      submitLabel: n ? "Save Route" : "Create Route",
      onSubmit: (u) => J(e, u)
    });
  }
  function Te(e, t = null) {
    var n;
    const s = a(e), i = t ? (n = s == null ? void 0 : s.factions) == null ? void 0 : n.find((l) => l.id === t) : null;
    r({
      title: i ? "Edit Faction" : "Create Faction",
      content: se(i ?? { id: K("faction"), name: "New Faction" }),
      submitLabel: i ? "Save Faction" : "Create Faction",
      onSubmit: (l) => ve(e, l)
    });
  }
  function Ge(e) {
    const t = a(e);
    if (!t) return;
    const s = _(t).factions.map((i) => `
      <article class="gmf-dialog-row">
        <div>
          <strong><span class="gmf-color-dot" style="--gmf-faction-color: ${y(i.color)};"></span>${y(i.name)}</strong>
          <span>${y(i.color)} - ${y(i.visibility)}</span>
        </div>
        <div class="gmf-row-actions">
          <button type="button" data-dialog-edit-faction="${y(i.id)}" title="Edit faction"><i class="fa-solid fa-pen"></i></button>
          <button type="button" data-dialog-delete-faction="${y(i.id)}" title="Delete faction"><i class="fa-solid fa-trash"></i></button>
        </div>
      </article>
    `).join("") || '<p class="gmf-empty-inline">No factions yet.</p>';
    new Dialog({
      title: "Manage Factions",
      content: `
        <section class="gmf-dialog-manager">
          <div class="gmf-dialog-manager__bar">
            <p>Factions tint systems and help organize territory on the map.</p>
            <button type="button" data-dialog-add-faction><i class="fa-solid fa-plus"></i> Add Faction</button>
          </div>
          <div class="gmf-dialog-list">${s}</div>
        </section>
      `,
      render: (i) => {
        var l;
        const n = v(i);
        (l = n.querySelector("[data-dialog-add-faction]")) == null || l.addEventListener("click", () => Te(e)), n.querySelectorAll("[data-dialog-edit-faction]").forEach((u) => {
          u.addEventListener("click", () => Te(e, u.dataset.dialogEditFaction));
        }), n.querySelectorAll("[data-dialog-delete-faction]").forEach((u) => {
          u.addEventListener("click", async () => {
            await Dialog.confirm({
              title: "Delete Faction",
              content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
            }) && (await fe(e, u.dataset.dialogDeleteFaction), Ge(e));
          });
        });
      },
      buttons: {
        close: {
          icon: '<i class="fa-solid fa-check"></i>',
          label: "Done"
        }
      },
      default: "close"
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog"],
      width: 560
    }).render(!0);
  }
  function Ke(e) {
    if (!e) return null;
    const t = _(e), s = new Map(t.systems.map((n) => [n.id, n])), i = new Map(t.factions.map((n) => [n.id, n]));
    return {
      ...t,
      systems: t.systems.map((n) => {
        var l;
        return {
          ...n,
          factionName: ((l = i.get(n.factionId)) == null ? void 0 : l.name) ?? "Unaffiliated"
        };
      }),
      routes: t.routes.map((n) => {
        var l, u;
        return {
          ...n,
          fromName: ((l = s.get(n.fromSystemId)) == null ? void 0 : l.name) ?? n.fromSystemId,
          toName: ((u = s.get(n.toSystemId)) == null ? void 0 : u.name) ?? n.toSystemId
        };
      })
    };
  }
  function Ee() {
    return Object.values(C()).map(_);
  }
  function z(e = null) {
    x != null && x.rendered && x.render({ force: !0 });
    for (const [t, s] of D.entries())
      (!e || t === e) && s.render({ force: !0 });
    S != null && S.rendered && (!e || S.mapId === e) && S.render({ force: !0 });
  }
  function et(e) {
    const t = [...D.values()];
    return S && t.push(S), t.filter((s) => (s == null ? void 0 : s.rendered) && s.mapId === e);
  }
  function tt(e) {
    var t;
    return e.element instanceof HTMLElement ? e.element : ((t = e.element) == null ? void 0 : t[0]) ?? null;
  }
  function ze(e, t, s) {
    return e.routes.find((i) => i.fromSystemId === t && i.toSystemId === s || i.toSystemId === t && i.fromSystemId === s) ?? null;
  }
  function it(e) {
    return ce().filter((t) => t.id !== e).map((t) => t.id);
  }
  function nt(e, t) {
    const s = a(e);
    if (!s)
      return I(`Map "${e}" was not found.`), null;
    const i = _(s), n = i.systems.find((V) => V.id === i.currentSystemId), l = i.systems.find((V) => V.id === t);
    if (!l)
      return I(`System "${t}" was not found.`), null;
    if (!n)
      return I("This map does not have a current location yet. Ask the GM to set one first."), null;
    if (n.id === l.id)
      return P(`${l.name} is already the current location.`), null;
    if (i.visibility !== "players" || n.visibility !== "players" || l.visibility !== "players")
      return I("That travel destination is not visible to players."), null;
    const u = ze(i, n.id, l.id);
    if (!u || u.visibility !== "players")
      return I(`No player-visible direct route from ${n.name} to ${l.name}.`), null;
    const k = de();
    if (!k)
      return I("A GM must be online to approve player travel."), null;
    const O = it(game.user.id);
    return O.includes(k.id) || O.push(k.id), {
      action: "travel-request",
      requestId: K("travel"),
      mapId: e,
      mapTitle: i.title,
      fromSystemId: n.id,
      fromName: n.name,
      toSystemId: l.id,
      toName: l.name,
      routeId: u.id,
      routeType: u.type,
      travelTime: u.travelTime,
      fuelCost: u.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      voterIds: [...new Set(O)]
    };
  }
  function Ve(e, t) {
    const s = nt(e, t);
    return s ? (game.socket.emit(p, s), P(`Travel request sent: ${s.fromName} to ${s.toName}.`), s) : null;
  }
  function st(e) {
    var i, n, l;
    if (!(e != null && e.requestId) || e.requesterId === ((i = game.user) == null ? void 0 : i.id) || !((l = e.voterIds) != null && l.includes((n = game.user) == null ? void 0 : n.id)) || ee.has(e.requestId)) return;
    ee.add(e.requestId);
    let t = !1;
    const s = (u) => {
      if (t) return;
      t = !0;
      const k = {
        action: "travel-vote",
        requestId: e.requestId,
        mapId: e.mapId,
        userId: game.user.id,
        userName: game.user.name,
        accepted: u
      };
      game.socket.emit(p, k), Xe(k);
    };
    new Dialog({
      title: "Travel Request",
      content: `
        <section class="gmf-travel-request">
          <p><strong>${y(e.requesterName)}</strong> wants to travel on <strong>${y(e.mapTitle)}</strong>.</p>
          <p>${y(e.fromName)} &rarr; ${y(e.toName)}</p>
          <p class="gmf-travel-request__meta">${y(e.routeType)} route / ${y(e.travelTime || "Unknown time")} / Fuel ${y(e.fuelCost ?? 0)}</p>
        </section>
      `,
      buttons: {
        accept: {
          icon: '<i class="fa-solid fa-check"></i>',
          label: "Accept",
          callback: () => s(!0)
        },
        decline: {
          icon: '<i class="fa-solid fa-xmark"></i>',
          label: "Decline",
          callback: () => s(!1)
        }
      },
      default: "accept",
      close: () => s(!1)
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog"],
      width: 420
    }).render(!0);
  }
  function at(e) {
    if (!ue() || !(e != null && e.requestId)) return;
    const t = globalThis.setTimeout(() => {
      const s = Z.get(e.requestId);
      s && je(s, "Request timeout");
    }, 6e4);
    Z.set(e.requestId, {
      ...e,
      accepted: /* @__PURE__ */ new Set(),
      voterIds: [...new Set(e.voterIds ?? [])],
      timeoutId: t
    });
  }
  function Ye(e) {
    const t = _(a(e.mapId)), s = t.systems.find((n) => n.id === e.fromSystemId), i = t.systems.find((n) => n.id === e.toSystemId);
    !s || !i || et(e.mapId).forEach((n) => {
      var u;
      const l = tt(n);
      l && (n.selectedSystemId = i.id, n.selectedRouteId = null, (u = n._animateShipTravel) == null || u.call(n, s, i, l));
    });
  }
  async function rt(e) {
    Z.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId);
    const t = {
      action: "travel-approved",
      requestId: e.requestId,
      mapId: e.mapId,
      fromSystemId: e.fromSystemId,
      toSystemId: e.toSystemId,
      fromName: e.fromName,
      toName: e.toName,
      coordinatorId: game.user.id
    };
    game.socket.emit(p, t), Ye(t), P(`Travel approved: ${e.fromName} to ${e.toName}.`), globalThis.setTimeout(() => X(e.mapId, e.toSystemId), 2400);
  }
  function je(e, t = "A player") {
    Z.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId);
    const s = {
      action: "travel-declined",
      requestId: e.requestId,
      mapId: e.mapId,
      fromName: e.fromName,
      toName: e.toName,
      voterName: t,
      coordinatorId: game.user.id
    };
    game.socket.emit(p, s), P(`Travel declined by ${t}: ${e.fromName} to ${e.toName}.`);
  }
  function Xe(e) {
    if (!ue() || !(e != null && e.requestId)) return;
    const t = Z.get(e.requestId);
    if (!(!t || !t.voterIds.includes(e.userId))) {
      if (!e.accepted) {
        je(t, e.userName);
        return;
      }
      t.accepted.add(e.userId), t.voterIds.every((s) => t.accepted.has(s)) && rt(t);
    }
  }
  function ot(e) {
    var t, s;
    e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && ee.delete(e.requestId), Ye(e), (s = ui.notifications) == null || s.info(`Travel approved: ${e.fromName} to ${e.toName}.`));
  }
  function lt(e) {
    var t, s;
    e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && ee.delete(e.requestId), (s = ui.notifications) == null || s.warn(`Travel declined by ${e.voterName}: ${e.fromName} to ${e.toName}.`));
  }
  function ct(e) {
    const t = D.get(e);
    t && t.close(), (S == null ? void 0 : S.mapId) === e && S.close();
  }
  function ye(e, t = {}) {
    var k;
    const s = a(e);
    if (!s)
      return I(`Map "${e}" was not found.`), null;
    const i = t.playerMode ?? !((k = game.user) != null && k.isGM);
    if (i && s.visibility !== "players" && !t.broadcast)
      return I("That galaxy map is not visible to players."), null;
    const n = i ? `player:${e}` : e, l = i && (S == null ? void 0 : S.mapId) === e ? S : D.get(n);
    if (l != null && l.rendered)
      return l.bringToFront(), l;
    const u = new ft({ mapId: e, playerMode: i });
    return i ? S = u : D.set(n, u), u.render({ force: !0 }), u;
  }
  function _e() {
    return $("open the map manager") ? (x || (x = new ut()), x.render({ force: !0 }), x) : null;
  }
  function Ce() {
    const e = Ee().filter((i) => i.visibility === "players").sort((i, n) => i.title.localeCompare(n.title));
    if (!e.length)
      return P("No galaxy map is currently visible to players."), null;
    if (e.length === 1) return ye(e[0].id, { playerMode: !0 });
    const t = e.map((i) => `
      <button type="button" class="gmf-player-map-choice" data-player-open-map="${y(i.id)}">
        <span class="gmf-player-map-choice__title">${y(i.title)}</span>
        <span class="gmf-player-map-choice__meta">${y(i.subtitle || i.description || "Player-visible galaxy map")}</span>
      </button>
    `).join("");
    let s = null;
    return s = new Dialog({
      title: "Choose Galaxy Map",
      content: `<section class="gmf-player-map-chooser">${t}</section>`,
      render: (i) => {
        const n = v(i);
        n == null || n.querySelectorAll("[data-player-open-map]").forEach((l) => {
          l.addEventListener("click", () => {
            ye(l.dataset.playerOpenMap, { playerMode: !0 }), s == null || s.close();
          });
        });
      },
      buttons: {
        close: {
          icon: '<i class="fa-solid fa-xmark"></i>',
          label: "Close"
        }
      },
      default: "close"
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog", "gmf-map-chooser-dialog"],
      width: 460
    }), s.render(!0), s;
  }
  function dt() {
    var t;
    const e = Ee().sort((s, i) => s.title.localeCompare(i.title));
    return (t = game.user) != null && t.isGM ? e.length === 1 ? ye(e[0].id) : _e() : Ce();
  }
  function Le(e) {
    if ($("broadcast galaxy maps")) {
      if (!a(e)) {
        I(`Map "${e}" was not found.`);
        return;
      }
      game.socket.emit(p, { action: "open", mapId: e }), P("Map broadcast sent to players.");
    }
  }
  function Ue() {
    $("close player galaxy maps") && (game.socket.emit(p, { action: "close" }), P("Close-map signal sent to players."));
  }
  const ut = vt({
    templateRoot: A,
    getMaps: Ee,
    prepareMapForManager: Ke,
    getRawMap: a,
    openMapMetadataDialog: Pe,
    openSystemDialog: Fe,
    openRouteDialog: Oe,
    openFactionDialog: Te,
    exportMap: pe,
    duplicateMap: Y,
    deleteMap: b,
    createMap: w,
    deleteSystem: F,
    deleteRoute: H,
    deleteFaction: fe,
    openMap: ye,
    showMapToPlayers: Le,
    closePlayerMap: Ue,
    clearManagerApp: (e) => {
      x === e && (x = null);
    }
  }), ft = Mt({
    templateRoot: A,
    getRawMap: a,
    prepareMapForDisplay: g,
    openSystemDialog: Fe,
    openRouteDialog: Oe,
    openFactionDialog: Te,
    openFactionManagerDialog: Ge,
    openMapMetadataDialog: Pe,
    revealSystemToPlayers: Me,
    revealRouteToPlayers: Ie,
    deleteSystem: F,
    deleteRoute: H,
    setCurrentSystem: X,
    requestTravelToSystem: Ve,
    notifySystemDiscovered: me,
    exportMap: pe,
    getTravelRoute: ze,
    notifyInfo: P,
    notifyError: I,
    saveSystemPosition: be,
    showMapToPlayers: Le,
    openMapManager: _e,
    clearMapView: (e) => {
      e.playerMode && S === e && (S = null);
      for (const [t, s] of D.entries())
        s === e && D.delete(t);
    }
  });
  function mt() {
    const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
    return t != null && t.registerApp ? (t.registerApp({
      id: o,
      title: "Galaxy Map",
      icon: "fa-solid fa-route",
      premium: !1,
      description: "Open cinematic campaign maps and navigation charts.",
      open: () => {
        var s;
        return (s = game.user) != null && s.isGM ? _e() : Ce();
      }
    }), !0) : !1;
  }
  Hooks.once("init", async () => {
    game.settings.register(o, M, {
      scope: "world",
      config: !1,
      type: Object,
      default: {}
    }), Handlebars.registerHelper("gmfEq", (e, t) => e === t), Handlebars.registerHelper("gmfJson", (e) => JSON.stringify(e, null, 2)), Handlebars.registerHelper("gmfPercent", (e) => `${Number(e).toFixed(3)}%`), Handlebars.registerHelper("gmfFallback", (e, t) => e || t), await loadTemplates([
      `${A}/map-manager.hbs`,
      `${A}/galaxy-map.hbs`,
      `${A}/system-details.hbs`
    ]);
  }), Hooks.once("ready", () => {
    game.galaxyMap = {
      openMap: ye,
      openMapManager: _e,
      openGalaxyMapFromSceneControls: dt,
      openPlayerMapChooser: Ce,
      createMap: w,
      getMaps: Ee,
      showMapToPlayers: Le,
      closePlayerMap: Ue,
      updateMap: m,
      updateMapMetadata: E,
      deleteMap: b,
      duplicateMap: Y,
      upsertSystem: j,
      deleteSystem: F,
      upsertRoute: J,
      deleteRoute: H,
      upsertFaction: ve,
      deleteFaction: fe,
      saveSystemPosition: be,
      setCurrentSystem: X,
      revealSystemToPlayers: Me,
      revealRouteToPlayers: Ie,
      notifySystemDiscovered: me,
      requestTravelToSystem: Ve,
      importMapData: xe,
      exportMap: pe
    };
    const e = game.modules.get(o);
    e && (e.api = game.galaxyMap), mt(), game.socket.on(p, (t = {}) => {
      var s, i;
      if (t.action === "travel-request") {
        at(t), st(t);
        return;
      }
      if (t.action === "travel-vote") {
        Xe(t);
        return;
      }
      if (t.action === "travel-approved") {
        ot(t);
        return;
      }
      if (t.action === "travel-declined") {
        lt(t);
        return;
      }
      (s = game.user) != null && s.isGM || (t.action === "open" && t.mapId && (S == null || S.close(), ye(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "close" && (S == null || S.close()), t.action === "refresh" && (S == null ? void 0 : S.mapId) === t.mapId && S.render({ force: !0 }), t.action === "notify" && ((i = ui.notifications) == null || i.info(t.message || "New system discovered."), (S == null ? void 0 : S.mapId) === t.mapId && S.render({ force: !0 })));
    }), console.log(`${o} | Ready. API available at game.galaxyMap.`);
  });
})();
