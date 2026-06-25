var pt = Object.defineProperty;
var yt = (r, y, f) => y in r ? pt(r, y, { enumerable: !0, configurable: !0, writable: !0, value: f }) : r[y] = f;
var F = (r, y, f) => yt(r, typeof y != "symbol" ? y + "" : y, f);
const Ke = ["core", "colony", "frontier", "station", "anomaly", "ruins", "restricted", "unknown"], et = ["undiscovered", "known", "visited", "danger", "locked"], tt = ["safe", "dangerous", "restricted", "smuggler", "unknown"], Me = ["gm", "players"], it = ["planet", "ringed", "star", "diamond", "void"];
function K(r = "gmf") {
  return `${r}-${foundry.utils.randomID(10)}`;
}
function Fe(r, y = "players") {
  const f = Me.includes(y) ? y : "players";
  return Me.includes(r) ? String(r) : f;
}
function gt(r) {
  return typeof r == "string" && /^#[0-9a-f]{6}$/i.test(r) ? r : "#58d8ff";
}
function ht(r) {
  return typeof r == "string" && /^#[0-9a-f]{6}$/i.test(r) ? r : "";
}
function Ie(r, y = 0) {
  const f = Number(r);
  return Number.isFinite(f) ? f : y;
}
function ne(r, y, f) {
  return Math.min(f, Math.max(y, r));
}
function je(r = {}) {
  return {
    id: String(r.id || K("system")),
    name: String(r.name || "Unnamed System"),
    x: Math.min(100, Math.max(0, Ie(r.x, 50))),
    y: Math.min(100, Math.max(0, Ie(r.y, 50))),
    type: Ke.includes(r.type) ? r.type : "unknown",
    factionId: String(r.factionId || ""),
    status: et.includes(r.status) ? r.status : "known",
    description: String(r.description || ""),
    image: String(r.image || ""),
    sceneId: String(r.sceneId || ""),
    journalId: String(r.journalId || ""),
    visibility: Fe(r.visibility, "players"),
    notes: String(r.notes || ""),
    iconColor: ht(r.iconColor),
    iconSize: ne(Ie(r.iconSize, 28), 18, 56),
    iconStyle: it.includes(r.iconStyle) ? r.iconStyle : "planet",
    pulse: r.pulse !== !1
  };
}
function Xe(r = {}) {
  return {
    id: String(r.id || K("route")),
    fromSystemId: String(r.fromSystemId || ""),
    toSystemId: String(r.toSystemId || ""),
    type: tt.includes(r.type) ? r.type : "unknown",
    travelTime: String(r.travelTime || ""),
    fuelCost: Ie(r.fuelCost, 0),
    visibility: Fe(r.visibility, "players"),
    notes: String(r.notes || "")
  };
}
function Ue(r = {}) {
  return {
    id: String(r.id || K("faction")),
    name: String(r.name || "Unaffiliated"),
    color: gt(r.color),
    description: String(r.description || ""),
    visibility: Fe(r.visibility, "players")
  };
}
function _(r = {}) {
  var $;
  const y = Array.isArray(r.systems) ? r.systems.map(je) : [], f = Array.isArray(r.routes) ? r.routes.map(Xe) : [], v = Array.isArray(r.factions) ? r.factions.map(Ue) : [];
  return {
    id: String(r.id || K("map")),
    title: String(r.title || "Untitled Galaxy Map"),
    subtitle: String(r.subtitle || ""),
    description: String(r.description || ""),
    backgroundImage: String(r.backgroundImage || ""),
    visibility: Fe(r.visibility, "players"),
    currentSystemId: String(r.currentSystemId || (($ = y[0]) == null ? void 0 : $.id) || ""),
    systems: y,
    routes: f,
    factions: v
  };
}
function St() {
  var f, v, $, w;
  const r = (v = (f = foundry.applications) == null ? void 0 : f.api) == null ? void 0 : v.ApplicationV2, y = (w = ($ = foundry.applications) == null ? void 0 : $.api) == null ? void 0 : w.HandlebarsApplicationMixin;
  return r && y ? y(r) : Application;
}
function vt(r) {
  var X;
  const {
    templateRoot: y,
    getMaps: f,
    prepareMapForManager: v,
    getRawMap: $,
    openMapMetadataDialog: w,
    openSystemDialog: M,
    openRouteDialog: N,
    openFactionDialog: T,
    exportMap: ge,
    duplicateMap: ce,
    deleteMap: de,
    createMap: ue,
    deleteSystem: q,
    deleteRoute: C,
    deleteFaction: fe,
    openMap: ae,
    showMapToPlayers: D,
    closePlayerMap: we,
    hideSystemFromPlayers: he,
    hideRouteFromPlayers: Se,
    clearManagerApp: me
  } = r;
  return X = class extends St() {
    constructor(L = {}) {
      super(L);
      F(this, "selectedMapId");
      F(this, "jsonDraft");
      this.selectedMapId = L.selectedMapId ?? null, this.jsonDraft = "";
    }
    async _prepareContext(L) {
      var Z, l;
      const b = await ((Z = super._prepareContext) == null ? void 0 : Z.call(this, L)) ?? {}, G = f().sort((a, c) => a.title.localeCompare(c.title));
      (!this.selectedMapId || !G.some((a) => a.id === this.selectedMapId)) && (this.selectedMapId = ((l = G[0]) == null ? void 0 : l.id) ?? null);
      const ee = this.selectedMapId ? v($(this.selectedMapId)) : null;
      return {
        ...b,
        maps: G,
        selectedMap: ee,
        selectedMapId: this.selectedMapId,
        hasMaps: G.length > 0
      };
    }
    _attachPartListeners(L, b, G) {
      var ee, Z, l, a, c, d, p, g;
      (ee = super._attachPartListeners) == null || ee.call(this, L, b, G), (Z = b.querySelector("[data-action='create-map']")) == null || Z.addEventListener("click", () => this._onCreateMap()), (l = b.querySelector("[data-action='edit-map-metadata']")) == null || l.addEventListener("click", () => {
        this.selectedMapId && w(this.selectedMapId);
      }), (a = b.querySelector("[data-action='create-system']")) == null || a.addEventListener("click", () => {
        this.selectedMapId && M(this.selectedMapId);
      }), (c = b.querySelector("[data-action='create-route']")) == null || c.addEventListener("click", () => {
        this.selectedMapId && N(this.selectedMapId);
      }), (d = b.querySelector("[data-action='create-faction']")) == null || d.addEventListener("click", () => {
        this.selectedMapId && T(this.selectedMapId);
      }), b.querySelectorAll("[data-edit-system]").forEach((m) => {
        m.addEventListener("click", () => M(this.selectedMapId, m.dataset.editSystem));
      }), b.querySelectorAll("[data-show-system]").forEach((m) => {
        m.addEventListener("click", () => he(this.selectedMapId, m.dataset.showSystem, !1));
      }), b.querySelectorAll("[data-hide-system]").forEach((m) => {
        m.addEventListener("click", () => he(this.selectedMapId, m.dataset.hideSystem, !0));
      }), b.querySelectorAll("[data-delete-system]").forEach((m) => {
        m.addEventListener("click", () => this._confirmDeleteSystem(m.dataset.deleteSystem));
      }), b.querySelectorAll("[data-edit-route]").forEach((m) => {
        m.addEventListener("click", () => N(this.selectedMapId, m.dataset.editRoute));
      }), b.querySelectorAll("[data-show-route]").forEach((m) => {
        m.addEventListener("click", () => Se(this.selectedMapId, m.dataset.showRoute, !1));
      }), b.querySelectorAll("[data-hide-route]").forEach((m) => {
        m.addEventListener("click", () => Se(this.selectedMapId, m.dataset.hideRoute, !0));
      }), b.querySelectorAll("[data-delete-route]").forEach((m) => {
        m.addEventListener("click", () => this._confirmDeleteRoute(m.dataset.deleteRoute));
      }), b.querySelectorAll("[data-edit-faction]").forEach((m) => {
        m.addEventListener("click", () => T(this.selectedMapId, m.dataset.editFaction));
      }), b.querySelectorAll("[data-delete-faction]").forEach((m) => {
        m.addEventListener("click", () => this._confirmDeleteFaction(m.dataset.deleteFaction));
      }), (p = b.querySelector("[data-action='export-map']")) == null || p.addEventListener("click", () => {
        this.selectedMapId && ge(this.selectedMapId);
      }), b.querySelectorAll("[data-select-map]").forEach((m) => {
        m.addEventListener("click", () => {
          this.selectedMapId = m.dataset.selectMap, this.jsonDraft = "", this.render({ force: !0 });
        });
      }), b.querySelectorAll("[data-open-map]").forEach((m) => {
        m.addEventListener("click", () => ae(m.dataset.openMap));
      }), b.querySelectorAll("[data-show-map]").forEach((m) => {
        m.addEventListener("click", () => D(m.dataset.showMap));
      }), b.querySelectorAll("[data-duplicate-map]").forEach((m) => {
        m.addEventListener("click", async () => {
          const x = await ce(m.dataset.duplicateMap);
          x && (this.selectedMapId = x.id, this.jsonDraft = "", this.render({ force: !0 }));
        });
      }), b.querySelectorAll("[data-delete-map]").forEach((m) => {
        m.addEventListener("click", async () => {
          const x = m.dataset.deleteMap, R = $(x);
          await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${(R == null ? void 0 : R.title) ?? x}</strong>? This cannot be undone.</p>`
          }) && (await de(x), this.selectedMapId === x && (this.selectedMapId = null), this.jsonDraft = "", this.render({ force: !0 }));
        });
      }), (g = b.querySelector("[data-action='close-player-map']")) == null || g.addEventListener("click", () => we());
    }
    async _onCreateMap() {
      const L = await ue({
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
      L && (this.selectedMapId = L.id, this.jsonDraft = "", this.render({ force: !0 }));
    }
    async _confirmDeleteSystem(L) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }) && await q(this.selectedMapId, L);
    }
    async _confirmDeleteRoute(L) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }) && await C(this.selectedMapId, L);
    }
    async _confirmDeleteFaction(L) {
      await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }) && await fe(this.selectedMapId, L);
    }
    async close(L = {}) {
      return me(this), super.close(L);
    }
  }, F(X, "DEFAULT_OPTIONS", {
    id: "galaxy-map-manager",
    classes: ["galaxy-map", "galaxy-map-framework", "gmf-manager-window"],
    window: {
      title: "Galaxy Map Manager",
      icon: "fa-solid fa-satellite",
      resizable: !0
    },
    position: {
      width: 980,
      height: 720
    }
  }), F(X, "PARTS", {
    main: {
      template: `${y}/map-manager.hbs`
    }
  }), X;
}
function bt() {
  var f, v, $, w;
  const r = (v = (f = foundry.applications) == null ? void 0 : f.api) == null ? void 0 : v.ApplicationV2, y = (w = ($ = foundry.applications) == null ? void 0 : $.api) == null ? void 0 : w.HandlebarsApplicationMixin;
  return r && y ? y(r) : Application;
}
function Mt(r) {
  var G;
  const {
    templateRoot: y,
    getRawMap: f,
    prepareMapForDisplay: v,
    openSystemDialog: $,
    openRouteDialog: w,
    openFactionDialog: M,
    openFactionManagerDialog: N,
    openMapMetadataDialog: T,
    revealSystemToPlayers: ge,
    revealRouteToPlayers: ce,
    hideSystemFromPlayers: de,
    hideRouteFromPlayers: ue,
    deleteSystem: q,
    deleteRoute: C,
    setCurrentSystem: fe,
    requestTravelToSystem: ae,
    notifySystemDiscovered: D,
    exportMap: we,
    getTravelRoute: he,
    broadcastTravelAnimation: Se,
    notifyInfo: me,
    notifyError: X,
    saveSystemPosition: xe,
    showMapToPlayers: $e,
    openMapManager: L,
    clearMapView: b
  } = r;
  return G = class extends bt() {
    constructor(l = {}) {
      var d;
      const a = l.mapId, c = l.playerMode ?? !((d = game.user) != null && d.isGM);
      super({
        ...l,
        id: `galaxy-map-view-${c ? "player" : "gm"}-${a}`
      });
      F(this, "mapId");
      F(this, "playerMode");
      F(this, "selectedSystemId");
      F(this, "selectedRouteId");
      F(this, "zoom");
      F(this, "panX");
      F(this, "panY");
      F(this, "_drag");
      F(this, "_contextTarget");
      F(this, "_boundContextClose");
      this.mapId = a, this.playerMode = c, this.selectedSystemId = l.selectedSystemId ?? null, this.selectedRouteId = l.selectedRouteId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null;
    }
    get title() {
      const l = f(this.mapId), a = this.playerMode ? "Player View" : "GM View";
      return l ? `${l.title} - ${a}` : `Galaxy Map - ${a}`;
    }
    async _prepareContext(l) {
      var p;
      const a = await ((p = super._prepareContext) == null ? void 0 : p.call(this, l)) ?? {}, c = f(this.mapId), d = c ? v(c, {
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
    _onRender(l, a) {
      var d, p;
      (d = super._onRender) == null || d.call(this, l, a);
      const c = this.element instanceof HTMLElement ? this.element : (p = this.element) == null ? void 0 : p[0];
      c && this._attachPartListeners("main", c, a);
    }
    _attachPartListeners(l, a, c) {
      var g, m, x, R, I, U, z, Y, J, te, ie, Te, Ee, ke, pe, _e, Ce, ye, P, De, Re, qe;
      const d = (g = a.matches) != null && g.call(a, ".gmf-map-stage") ? a : (m = a.querySelector) == null ? void 0 : m.call(a, ".gmf-map-stage");
      if ((d == null ? void 0 : d.dataset.gmfMapBound) === "true") return;
      d && (d.dataset.gmfMapBound = "true"), (x = super._attachPartListeners) == null || x.call(this, l, a, c), this._applyViewportTransform(a), a.querySelectorAll("[data-system-id]").forEach((k) => {
        var re;
        k.addEventListener("click", (se) => {
          if (k.dataset.dragged === "true") {
            k.dataset.dragged = "false";
            return;
          }
          se.stopPropagation(), this.selectedSystemId = k.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
        }), !this.playerMode && ((re = game.user) != null && re.isGM) && k.addEventListener("pointerdown", (se) => this._startSystemDrag(se, a, k));
      }), a.querySelectorAll("[data-route-id]").forEach((k) => {
        k.addEventListener("click", (re) => {
          var se;
          if (re.stopPropagation(), !this.playerMode && ((se = game.user) != null && se.isGM)) {
            w(this.mapId, k.dataset.routeId);
            return;
          }
          this.selectedRouteId = k.dataset.routeId, this.selectedSystemId = null, this.render({ force: !0 });
        });
      });
      const p = a.querySelector(".gmf-map-stage");
      p == null || p.addEventListener("wheel", (k) => this._onWheelZoom(k, a), { passive: !1 }), p == null || p.addEventListener("pointerdown", (k) => this._startPan(k, a)), p == null || p.addEventListener("contextmenu", (k) => this._openContextMenu(k, a), { capture: !0 }), a.querySelectorAll("[data-context-action]").forEach((k) => {
        k.addEventListener("click", (re) => this._handleContextAction(re, a));
      }), (R = a.querySelector("[data-action='open-map-menu']")) == null || R.addEventListener("click", (k) => this._openStageMenuFromButton(k, a)), (I = a.querySelector("[data-action='zoom-in']")) == null || I.addEventListener("click", () => this._setZoom(this.zoom + 0.15, a)), (U = a.querySelector("[data-action='zoom-out']")) == null || U.addEventListener("click", () => this._setZoom(this.zoom - 0.15, a)), (z = a.querySelector("[data-action='reset-view']")) == null || z.addEventListener("click", () => {
        this.zoom = 1, this.panX = 0, this.panY = 0, this._applyViewportTransform(a);
      }), (Y = a.querySelector("[data-action='open-scene']")) == null || Y.addEventListener("click", () => this._openLinkedScene()), (J = a.querySelector("[data-action='open-journal']")) == null || J.addEventListener("click", () => this._openLinkedJournal()), (te = a.querySelector("[data-action='edit-system']")) == null || te.addEventListener("click", () => {
        this.selectedSystemId && $(this.mapId, this.selectedSystemId);
      }), (ie = a.querySelector("[data-action='reveal-system']")) == null || ie.addEventListener("click", () => {
        this.selectedSystemId && ge(this.mapId, this.selectedSystemId);
      }), (Te = a.querySelector("[data-action='hide-system']")) == null || Te.addEventListener("click", () => {
        this.selectedSystemId && de(this.mapId, this.selectedSystemId, !0);
      }), (Ee = a.querySelector("[data-action='delete-system']")) == null || Ee.addEventListener("click", () => {
        this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), (ke = a.querySelector("[data-action='set-current-system']")) == null || ke.addEventListener("click", () => {
        this.selectedSystemId && fe(this.mapId, this.selectedSystemId);
      }), (pe = a.querySelector("[data-action='travel-to-system']")) == null || pe.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? ae(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, a));
      }), (_e = a.querySelector("[data-action='edit-route']")) == null || _e.addEventListener("click", () => {
        this.selectedRouteId && w(this.mapId, this.selectedRouteId);
      }), (Ce = a.querySelector("[data-action='reveal-route']")) == null || Ce.addEventListener("click", () => {
        this.selectedRouteId && ce(this.mapId, this.selectedRouteId);
      }), (ye = a.querySelector("[data-action='hide-route']")) == null || ye.addEventListener("click", () => {
        this.selectedRouteId && ue(this.mapId, this.selectedRouteId, !0);
      }), (P = a.querySelector("[data-action='delete-route']")) == null || P.addEventListener("click", () => {
        this.selectedRouteId && this._confirmDeleteRoute(this.selectedRouteId);
      }), (De = a.querySelector("[data-action='notify-discovery']")) == null || De.addEventListener("click", () => {
        this.selectedSystemId && D(this.mapId, this.selectedSystemId);
      }), (Re = a.querySelector("[data-action='show-to-players']")) == null || Re.addEventListener("click", () => $e(this.mapId)), (qe = a.querySelector("[data-action='edit-map']")) == null || qe.addEventListener("click", () => {
        const k = L();
        k && (k.selectedMapId = this.mapId, k.render({ force: !0 }));
      });
    }
    _applyViewportTransform(l) {
      var c;
      const a = l.querySelector(".gmf-map-viewport");
      a && (a.style.setProperty("--gmf-pan-x", `${this.panX}px`), a.style.setProperty("--gmf-pan-y", `${this.panY}px`), a.style.setProperty("--gmf-zoom", String(this.zoom)), (c = l.querySelector("[data-zoom-label]")) == null || c.replaceChildren(`${Math.round(this.zoom * 100)}%`));
    }
    _setZoom(l, a) {
      this.zoom = ne(l, 0.55, 2.6), this._applyViewportTransform(a);
    }
    _onWheelZoom(l, a) {
      l.preventDefault();
      const c = a.querySelector(".gmf-map-stage");
      if (!c) return;
      const d = c.getBoundingClientRect(), p = this.zoom, g = ne(p + (l.deltaY < 0 ? 0.12 : -0.12), 0.55, 2.6), m = l.clientX - d.left, x = l.clientY - d.top, R = (m - this.panX) / p, I = (x - this.panY) / p;
      this.zoom = g, this.panX = m - R * g, this.panY = x - I * g, this._applyViewportTransform(a);
    }
    _startPan(l, a) {
      if (l.button !== 0 || l.target.closest("[data-system-id], [data-route-id], button")) return;
      l.preventDefault();
      const c = l.clientX, d = l.clientY, p = this.panX, g = this.panY, m = (R) => {
        this.panX = p + R.clientX - c, this.panY = g + R.clientY - d, this._applyViewportTransform(a);
      }, x = () => {
        window.removeEventListener("pointermove", m), window.removeEventListener("pointerup", x);
      };
      window.addEventListener("pointermove", m), window.addEventListener("pointerup", x, { once: !0 });
    }
    _startSystemDrag(l, a, c) {
      var Y;
      if (l.button !== 0) return;
      l.preventDefault(), l.stopPropagation(), (Y = c.setPointerCapture) == null || Y.call(c, l.pointerId);
      const d = l.clientX, p = l.clientY;
      let g = this._pointerToMapPercent(l, a), m = !1, x = null;
      const R = Array.from(a.querySelectorAll(`[data-route-from="${c.dataset.systemId}"]`)), I = Array.from(a.querySelectorAll(`[data-route-to="${c.dataset.systemId}"]`));
      c.classList.add("is-dragging");
      const U = (J) => {
        const te = Math.abs(J.clientX - d), ie = Math.abs(J.clientY - p);
        m = m || te > 3 || ie > 3, g = this._pointerToMapPercent(J, a), c.dataset.dragged = m ? "true" : "false", !x && (x = requestAnimationFrame(() => {
          x = null, c.style.left = `${g.x}%`, c.style.top = `${g.y}%`, this._updateConnectedRoutes(R, I, g.x, g.y);
        }));
      }, z = async () => {
        x && cancelAnimationFrame(x), c.style.left = `${g.x}%`, c.style.top = `${g.y}%`, this._updateConnectedRoutes(R, I, g.x, g.y), c.classList.remove("is-dragging"), window.removeEventListener("pointermove", U), window.removeEventListener("pointerup", z), m && await xe(this.mapId, c.dataset.systemId, g.x, g.y);
      };
      window.addEventListener("pointermove", U), window.addEventListener("pointerup", z, { once: !0 });
    }
    _pointerToMapPercent(l, a) {
      const d = a.querySelector(".gmf-map-stage").getBoundingClientRect();
      return {
        x: ne((l.clientX - d.left - this.panX) / this.zoom / d.width * 100, 0, 100),
        y: ne((l.clientY - d.top - this.panY) / this.zoom / d.height * 100, 0, 100)
      };
    }
    _updateConnectedRoutes(l, a, c, d) {
      l.forEach((p) => {
        p.setAttribute("x1", c), p.setAttribute("y1", d);
      }), a.forEach((p) => {
        p.setAttribute("x2", c), p.setAttribute("y2", d);
      });
    }
    _openContextMenu(l, a) {
      var te;
      if (!((te = game.user) != null && te.isGM) || this.playerMode || l.target.closest(".gmf-map-toolbar, .gmf-context-menu")) return;
      l.preventDefault(), l.stopPropagation();
      const c = l.target.closest("[data-route-id]"), d = l.target.closest("[data-system-id]"), p = this._pointerToMapPercent(l, a);
      this._contextTarget = c ? { type: "route", id: c.dataset.routeId, position: p } : d ? { type: "system", id: d.dataset.systemId, position: p } : { type: "stage", id: null, position: p };
      const g = a.querySelector("[data-gmf-context-menu]");
      if (!g) return;
      g.querySelectorAll("[data-context-show]").forEach((ie) => {
        ie.hidden = ie.dataset.contextShow !== this._contextTarget.type;
      }), g.hidden = !1;
      const m = g.offsetWidth || 184, x = g.offsetHeight || 260, I = a.querySelector(".gmf-map-stage").getBoundingClientRect(), U = l.clientX - I.left, z = l.clientY - I.top, Y = Math.max(4, I.width - m - 4), J = Math.max(4, I.height - x - 4);
      g.style.left = `${ne(U, 4, Y)}px`, g.style.top = `${ne(z, 4, J)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(a), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _openStageMenuFromButton(l, a) {
      var g;
      if (!((g = game.user) != null && g.isGM) || this.playerMode) return;
      l.preventDefault(), l.stopPropagation();
      const c = a.querySelector(".gmf-map-stage"), d = c == null ? void 0 : c.getBoundingClientRect();
      if (!d) return;
      const p = {
        clientX: d.left + d.width / 2,
        clientY: d.top + d.height / 2,
        target: c,
        preventDefault: () => {
        },
        stopPropagation: () => {
        }
      };
      this._openContextMenu(p, a);
    }
    _hideContextMenu(l = null) {
      var d, p, g;
      const a = l ?? this.element ?? null, c = ((d = a == null ? void 0 : a.querySelector) == null ? void 0 : d.call(a, "[data-gmf-context-menu]")) ?? ((g = (p = a == null ? void 0 : a[0]) == null ? void 0 : p.querySelector) == null ? void 0 : g.call(p, "[data-gmf-context-menu]"));
      c && (c.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(l, a) {
      l.preventDefault(), l.stopPropagation();
      const c = l.currentTarget.dataset.contextAction, d = this._contextTarget;
      this._hideContextMenu(a), d && (c === "add-system" ? $(this.mapId, null, { x: d.position.x, y: d.position.y }) : c === "add-route" ? w(this.mapId) : c === "manage-factions" ? N(this.mapId) : c === "add-faction" ? M(this.mapId) : c === "edit-map-details" ? T(this.mapId) : c === "export-map" ? we(this.mapId) : c === "edit-system" ? $(this.mapId, d.id) : c === "add-route-from-system" ? w(this.mapId, null, { fromSystemId: d.id }) : c === "reveal-system" ? await ge(this.mapId, d.id) : c === "hide-system" ? await de(this.mapId, d.id, !0) : c === "delete-system" ? await this._confirmDeleteSystem(d.id) : c === "edit-route" ? w(this.mapId, d.id) : c === "reveal-route" ? await ce(this.mapId, d.id) : c === "hide-route" ? await ue(this.mapId, d.id, !0) : c === "delete-route" && await this._confirmDeleteRoute(d.id));
    }
    async _confirmDeleteSystem(l) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }) && await q(this.mapId, l);
    }
    async _confirmDeleteRoute(l) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }) && await C(this.mapId, l);
    }
    async _travelToSystem(l, a) {
      const c = _(f(this.mapId)), d = c.systems.find((m) => m.id === c.currentSystemId), p = c.systems.find((m) => m.id === l);
      if (!p) return;
      if (!d) {
        await fe(this.mapId, p.id), me(`Current location set to ${p.name}.`);
        return;
      }
      if (d.id === p.id) {
        me(`${p.name} is already the current location.`);
        return;
      }
      if (!he(c, d.id, p.id)) {
        X(`No direct route from ${d.name} to ${p.name}.`);
        return;
      }
      Se(this.mapId, d.id, p.id), await this._animateShipTravel(d, p, a), await fe(this.mapId, p.id), me(`Arrived at ${p.name}.`);
    }
    _animateShipTravel(l, a, c) {
      const d = c.querySelector("[data-ship-layer]"), p = c.querySelector(".gmf-map-stage");
      if (!d || !p) return Promise.resolve();
      const g = p.getBoundingClientRect(), m = (a.x - l.x) * g.width / 100, x = (a.y - l.y) * g.height / 100, R = Math.atan2(x, m) * 180 / Math.PI, I = document.createElement("div");
      return I.className = "gmf-travel-ship", I.innerHTML = '<i class="fa-solid fa-rocket"></i>', I.style.left = `${l.x}%`, I.style.top = `${l.y}%`, I.style.setProperty("--gmf-ship-angle", `${R}deg`), d.replaceChildren(I), new Promise((U) => {
        let z = !1;
        const Y = () => {
          z || (z = !0, I.removeEventListener("transitionend", Y), I.classList.add("is-arrived"), globalThis.setTimeout(() => {
            I.remove(), U();
          }, 260));
        };
        I.addEventListener("transitionend", Y, { once: !0 }), requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            I.style.left = `${a.x}%`, I.style.top = `${a.y}%`;
          });
        }), globalThis.setTimeout(Y, 2400);
      });
    }
    _openLinkedScene() {
      var c;
      const l = this._getSelectedRawSystem();
      if (!(l != null && l.sceneId)) return;
      const a = (c = game.scenes) == null ? void 0 : c.get(l.sceneId);
      if (!a) {
        X(`Scene "${l.sceneId}" was not found.`);
        return;
      }
      a.view();
    }
    _openLinkedJournal() {
      var c, d;
      const l = this._getSelectedRawSystem();
      if (!(l != null && l.journalId)) return;
      const a = (c = game.journal) == null ? void 0 : c.get(l.journalId);
      if (!a) {
        X(`Journal "${l.journalId}" was not found.`);
        return;
      }
      (d = a.sheet) == null || d.render(!0);
    }
    _getSelectedRawSystem() {
      var a;
      const l = f(this.mapId);
      return ((a = l == null ? void 0 : l.systems) == null ? void 0 : a.find((c) => c.id === this.selectedSystemId)) ?? null;
    }
    async close(l = {}) {
      return this._hideContextMenu(), b(this), super.close(l);
    }
  }, F(G, "DEFAULT_OPTIONS", {
    id: "galaxy-map-view",
    classes: ["galaxy-map", "galaxy-map-framework", "gmf-map-window"],
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
  }), F(G, "PARTS", {
    main: {
      template: `${y}/galaxy-map.hbs`
    }
  }), G;
}
const le = "galaxy-map", Ye = "maps", A = `module.${le}`, Le = `modules/${le}/templates`;
function It(r) {
  return String(r || "galaxy-map").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "galaxy-map";
}
function wt(r, y) {
  const f = new Blob([JSON.stringify(y, null, 2)], { type: "application/json" }), v = URL.createObjectURL(f), $ = document.createElement("a");
  $.href = v, $.download = r, document.body.appendChild($), $.click(), $.remove(), URL.revokeObjectURL(v);
}
function S(r) {
  const y = document.createElement("div");
  return y.textContent = String(r ?? ""), y.innerHTML;
}
function B(r, y) {
  return r.map((f) => {
    const v = typeof f == "string" ? f : f.value, $ = typeof f == "string" ? f : f.label;
    return `<option value="${S(v)}" ${v === y ? "selected" : ""}>${S($)}</option>`;
  }).join("");
}
function Qe(r, y) {
  const f = (r == null ? void 0 : r.contents) ?? [];
  return [
    { value: "", label: "None" },
    ...f.map((v) => ({ value: v.id, label: v.name }))
  ].map((v) => `<option value="${S(v.value)}" ${v.value === y ? "selected" : ""}>${S(v.label)}</option>`).join("");
}
function Pe(r) {
  return (r == null ? void 0 : r[0]) ?? r ?? null;
}
function xt(r) {
  var v;
  const y = Pe(r), f = (v = y == null ? void 0 : y.matches) != null && v.call(y, "form") ? y : y == null ? void 0 : y.querySelector("form");
  return Object.fromEntries(new FormData(f).entries());
}
(() => {
  let r = null;
  const y = /* @__PURE__ */ new Map();
  let f = null;
  const v = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Set();
  function w(e) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? {}));
  }
  function M(e) {
    var t;
    (t = ui.notifications) == null || t.error(`[Galaxy Map] ${e}`);
  }
  function N(e) {
    var t;
    (t = ui.notifications) == null || t.info(`[Galaxy Map] ${e}`);
  }
  function T(e = "change galaxy maps") {
    var t;
    return (t = game.user) != null && t.isGM ? !0 : (M(`Only a GM can ${e}.`), !1);
  }
  function ge() {
    var e;
    return ((e = game.users) == null ? void 0 : e.contents) ?? Array.from(game.users ?? []);
  }
  function ce() {
    return ge().filter((e) => e.active);
  }
  function de() {
    return ce().filter((e) => e.isGM).sort((e, t) => String(e.id).localeCompare(String(t.id)))[0] ?? null;
  }
  function ue() {
    var e, t;
    return !!((e = game.user) != null && e.isGM && ((t = de()) == null ? void 0 : t.id) === game.user.id);
  }
  function q() {
    return w(game.settings.get(le, Ye) ?? {});
  }
  async function C(e) {
    return T("save galaxy map data") && await game.settings.set(le, Ye, e ?? {}), e;
  }
  function fe(e) {
    const t = Pe(e);
    t == null || t.querySelectorAll("[data-browse-target]").forEach((n) => {
      n.addEventListener("click", (i) => {
        i.preventDefault();
        const s = t.querySelector(`[name="${n.dataset.browseTarget}"]`);
        s && new FilePicker({
          type: "image",
          current: s.value,
          callback: (o) => {
            s.value = o, s.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        }).browse();
      });
    });
  }
  function ae({ title: e, content: t, submitLabel: n = "Save", onSubmit: i, render: s = fe }) {
    new Dialog({
      title: e,
      content: t,
      render: s,
      buttons: {
        save: {
          icon: '<i class="fa-solid fa-floppy-disk"></i>',
          label: n,
          callback: (o) => i(xt(o))
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
  function D(e) {
    const t = q();
    return t[e] ? w(t[e]) : null;
  }
  function we(e) {
    return new Map((e ?? []).map((t) => [t.id, t]));
  }
  function he(e) {
    return e.visibility === "players";
  }
  function Se(e, t) {
    return t && e.status === "undiscovered";
  }
  function me(e, { playerMode: t = !1, selectedSystemId: n = null, selectedRouteId: i = null } = {}) {
    var Je, We;
    const s = _(e), o = t ? s.systems.filter(he) : s.systems, u = new Set(o.map((h) => h.id)), E = t ? s.factions.filter((h) => h.visibility === "players") : s.factions, O = we(E), V = o.map((h) => {
      const H = O.get(h.factionId), Q = Se(h, t);
      return {
        ...h,
        displayName: Q ? "???" : h.name,
        displayDescription: Q ? "Unresolved sensor contact. Details are not available." : h.description,
        displayType: Q ? "unknown" : h.type,
        displayStatus: Q ? "undiscovered" : h.status,
        factionName: (H == null ? void 0 : H.name) ?? "Unaffiliated",
        factionColor: h.iconColor || (H == null ? void 0 : H.color) || "#58d8ff",
        obscured: Q,
        isCurrent: h.id === s.currentSystemId,
        isSelected: h.id === n,
        gmOnly: h.visibility === "gm"
      };
    }), be = s.routes.filter((h) => !t || h.visibility === "players").filter((h) => u.has(h.fromSystemId) && u.has(h.toSystemId)).map((h) => {
      const H = V.find((Ve) => Ve.id === h.fromSystemId), Q = V.find((Ve) => Ve.id === h.toSystemId);
      return {
        ...h,
        from: H,
        to: Q,
        fromName: (H == null ? void 0 : H.displayName) ?? h.fromSystemId,
        toName: (Q == null ? void 0 : Q.displayName) ?? h.toSystemId,
        isSelected: h.id === i,
        connectsCurrent: h.fromSystemId === s.currentSystemId || h.toSystemId === s.currentSystemId,
        gmOnly: h.visibility === "gm"
      };
    }), W = be.find((h) => h.id === i) ?? null, j = W ? null : V.find((h) => h.id === n) ?? V[0] ?? null;
    j && (j.isSelected = !0);
    const oe = V.find((h) => h.id === s.currentSystemId) ?? V[0] ?? null, Ne = j && oe && j.id !== oe.id ? be.find((h) => h.fromSystemId === oe.id && h.toSystemId === j.id || h.toSystemId === oe.id && h.fromSystemId === j.id) : null;
    return j && (j.canTravel = !!Ne, j.travelRouteId = (Ne == null ? void 0 : Ne.id) ?? "", j.isCurrent = j.id === (oe == null ? void 0 : oe.id)), {
      ...s,
      systems: V,
      routes: be,
      factions: E,
      selectedSystem: j,
      selectedRoute: W,
      currentSystem: oe,
      selectedType: W ? "route" : "system",
      playerMode: t,
      isGM: ((Je = game.user) == null ? void 0 : Je.isGM) ?? !1,
      canEdit: ((We = game.user) == null ? void 0 : We.isGM) && !t
    };
  }
  async function X(e = {}) {
    if (!T("create galaxy maps")) return null;
    const t = q(), n = _(e);
    return t[n.id] = n, await C(t), P(n.id), w(n);
  }
  async function xe(e, t = {}) {
    if (!T("update galaxy maps")) return null;
    const n = q();
    if (!n[e])
      return M(`Map "${e}" was not found.`), null;
    const i = _({ ...t, id: e });
    return n[e] = i, await C(n), P(e), w(i);
  }
  async function $e(e, t = {}) {
    if (!T("update galaxy map metadata")) return null;
    const n = D(e);
    return n ? xe(e, {
      ...n,
      title: t.title,
      subtitle: t.subtitle,
      description: t.description,
      backgroundImage: t.backgroundImage,
      visibility: t.visibility
    }) : (M(`Map "${e}" was not found.`), null);
  }
  async function L(e) {
    if (!T("delete galaxy maps")) return !1;
    const t = q();
    return t[e] ? (delete t[e], await C(t), ct(e), P(), !0) : !1;
  }
  async function b(e) {
    if (!T("duplicate galaxy maps")) return null;
    const t = D(e);
    if (!t)
      return M(`Map "${e}" was not found.`), null;
    const n = _({
      ...t,
      id: K("map"),
      title: `${t.title} Copy`
    }), i = q();
    return i[n.id] = n, await C(i), P(n.id), w(n);
  }
  async function G(e, t = {}) {
    if (!T("save star systems")) return null;
    const n = q(), i = n[e];
    if (!i)
      return M(`Map "${e}" was not found.`), null;
    const s = je(t), o = i.systems.findIndex((u) => u.id === s.id);
    return o >= 0 ? i.systems[o] = s : i.systems.push(s), n[e] = _(i), await C(n), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), w(s);
  }
  async function ee(e, t) {
    var s;
    if (!T("delete star systems")) return !1;
    const n = q(), i = n[e];
    return i ? (i.systems = i.systems.filter((o) => o.id !== t), i.routes = i.routes.filter((o) => o.fromSystemId !== t && o.toSystemId !== t), i.currentSystemId === t && (i.currentSystemId = ((s = i.systems[0]) == null ? void 0 : s.id) ?? ""), n[e] = _(i), await C(n), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function Z(e, t) {
    var o;
    if (!T("set current location")) return null;
    const n = q(), i = n[e], s = (o = i == null ? void 0 : i.systems) == null ? void 0 : o.find((u) => u.id === t);
    return s ? (i.currentSystemId = t, n[e] = _(i), await C(n), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), w(s)) : (M(`System "${t}" was not found.`), null);
  }
  async function l(e, t = {}) {
    if (!T("save routes")) return null;
    const n = q(), i = n[e];
    if (!i)
      return M(`Map "${e}" was not found.`), null;
    const s = Xe(t);
    if (!s.fromSystemId || !s.toSystemId || s.fromSystemId === s.toSystemId)
      return M("Routes require two different systems."), null;
    const o = i.routes.findIndex((u) => u.id === s.id);
    return o >= 0 ? i.routes[o] = s : i.routes.push(s), n[e] = _(i), await C(n), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), w(s);
  }
  async function a(e, t) {
    if (!T("delete routes")) return !1;
    const n = q(), i = n[e];
    return i ? (i.routes = i.routes.filter((s) => s.id !== t), n[e] = _(i), await C(n), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function c(e, t = {}) {
    if (!T("save factions")) return null;
    const n = q(), i = n[e];
    if (!i)
      return M(`Map "${e}" was not found.`), null;
    const s = Ue(t), o = i.factions.findIndex((u) => u.id === s.id);
    return o >= 0 ? i.factions[o] = s : i.factions.push(s), n[e] = _(i), await C(n), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), w(s);
  }
  async function d(e, t) {
    if (!T("delete factions")) return !1;
    const n = q(), i = n[e];
    if (!i) return !1;
    i.factions = i.factions.filter((s) => s.id !== t);
    for (const s of i.systems)
      s.factionId === t && (s.factionId = "");
    return n[e] = _(i), await C(n), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), !0;
  }
  async function p(e, t, n, i) {
    var E;
    if (!T("move star systems")) return null;
    const s = q(), o = s[e], u = (E = o == null ? void 0 : o.systems) == null ? void 0 : E.find((O) => O.id === t);
    return u ? (u.x = ne(Ie(n, u.x), 0, 100), u.y = ne(Ie(i, u.y), 0, 100), s[e] = _(o), await C(s), game.socket.emit(A, { action: "refresh", mapId: e }), w(u)) : (M(`System "${t}" was not found.`), null);
  }
  async function g(e, t, { notify: n = !0 } = {}) {
    var u;
    if (!T("reveal star systems")) return null;
    const i = q(), s = i[e], o = (u = s == null ? void 0 : s.systems) == null ? void 0 : u.find((E) => E.id === t);
    return o ? (o.visibility = "players", (o.status === "undiscovered" || o.status === "locked") && (o.status = "known"), i[e] = _(s), await C(i), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), n && I(e, o.id), N(`${o.name} revealed to players.`), w(o)) : (M(`System "${t}" was not found.`), null);
  }
  async function m(e, t, n = !0) {
    var u;
    if (!T(n ? "hide star systems" : "reveal star systems")) return null;
    const i = q(), s = i[e], o = (u = s == null ? void 0 : s.systems) == null ? void 0 : u.find((E) => E.id === t);
    return o ? (o.visibility = n ? "gm" : "players", i[e] = _(s), await C(i), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), N(`${o.name} ${n ? "hidden from" : "visible to"} players.`), w(o)) : (M(`System "${t}" was not found.`), null);
  }
  async function x(e, t) {
    var o;
    if (!T("reveal routes")) return null;
    const n = q(), i = n[e], s = (o = i == null ? void 0 : i.routes) == null ? void 0 : o.find((u) => u.id === t);
    return s ? (s.visibility = "players", n[e] = _(i), await C(n), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), N("Route revealed to players."), w(s)) : (M(`Route "${t}" was not found.`), null);
  }
  async function R(e, t, n = !0) {
    var u;
    if (!T(n ? "hide routes" : "reveal routes")) return null;
    const i = q(), s = i[e], o = (u = s == null ? void 0 : s.routes) == null ? void 0 : u.find((E) => E.id === t);
    return o ? (o.visibility = n ? "gm" : "players", i[e] = _(s), await C(i), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), N(`Route ${n ? "hidden from" : "visible to"} players.`), w(o)) : (M(`Route "${t}" was not found.`), null);
  }
  function I(e, t) {
    var s;
    if (!T("notify players about discoveries")) return;
    const n = D(e), i = (s = n == null ? void 0 : n.systems) == null ? void 0 : s.find((o) => o.id === t);
    if (!i) {
      M(`System "${t}" was not found.`);
      return;
    }
    game.socket.emit(A, {
      action: "notify",
      mapId: e,
      systemId: t,
      message: `New System Discovered: ${i.name}`
    }), N(`Discovery notification sent: ${i.name}.`);
  }
  async function U(e, { replace: t = !1 } = {}) {
    if (!T("import galaxy maps")) return null;
    const n = q();
    let i = _(e);
    return n[i.id] && !t && (i = _({
      ...i,
      id: K("map"),
      title: `${i.title} Import`
    })), n[i.id] = i, await C(n), P(i.id), N(`Imported ${i.title}.`), w(i);
  }
  function z(e) {
    const t = D(e);
    if (!t) {
      M(`Map "${e}" was not found.`);
      return;
    }
    wt(`${It(t.title)}.json`, _(t));
  }
  function Y(e, t = {}, n = {}) {
    const i = D(e), s = je({ ...n, ...t }), o = [
      { value: "", label: "Unaffiliated" },
      ...((i == null ? void 0 : i.factions) ?? []).map((O) => ({ value: O.id, label: O.name }))
    ], u = ((i == null ? void 0 : i.factions) ?? []).find((O) => O.id === s.factionId), E = s.iconColor || (u == null ? void 0 : u.color) || "#58d8ff";
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${S(s.id)}" />
        <input type="hidden" name="x" value="${S(s.x)}" />
        <input type="hidden" name="y" value="${S(s.y)}" />
        <label>Name <input type="text" name="name" value="${S(s.name)}" /></label>
        <div class="gmf-form-grid">
          <label>Type <select name="type">${B(Ke, s.type)}</select></label>
          <label>Status <select name="status">${B(et, s.status)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Faction <select name="factionId">${B(o, s.factionId)}</select></label>
          <label>Visibility <select name="visibility">${B(Me, s.visibility)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Icon Style <select name="iconStyle">${B(it, s.iconStyle)}</select></label>
          <label>Icon Size <input type="range" name="iconSize" value="${S(s.iconSize)}" min="18" max="56" step="1" /></label>
        </div>
        <div class="gmf-form-grid">
          <label>Icon Color <input type="color" name="iconColor" value="${S(E)}" /></label>
          <label class="gmf-checkbox-label"><input type="checkbox" name="pulse" value="true" ${s.pulse ? "checked" : ""} /> Pulse Glow</label>
        </div>
        <label>Description <textarea name="description">${S(s.description)}</textarea></label>
        <label>Image Path
          <div class="gmf-path-field">
            <input type="text" name="image" value="${S(s.image)}" />
            <button type="button" data-browse-target="image"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
        <div class="gmf-form-grid">
          <label>Scene <select name="sceneId">${Qe(game.scenes, s.sceneId)}</select></label>
          <label>Journal <select name="journalId">${Qe(game.journal, s.journalId)}</select></label>
        </div>
        <label>GM Notes <textarea name="notes">${S(s.notes)}</textarea></label>
      </form>
    `;
  }
  function J(e, t = {}, n = {}) {
    var O, V, be;
    const i = D(e), s = { ...n, ...t }, o = (i == null ? void 0 : i.systems) ?? [];
    s.fromSystemId || (s.fromSystemId = ((O = o[0]) == null ? void 0 : O.id) ?? ""), s.toSystemId || (s.toSystemId = ((V = o.find((W) => W.id !== s.fromSystemId)) == null ? void 0 : V.id) ?? ""), s.fromSystemId && !s.toSystemId && (s.toSystemId = ((be = o.find((W) => W.id !== s.fromSystemId)) == null ? void 0 : be.id) ?? "");
    const u = Xe(s), E = o.map((W) => ({ value: W.id, label: W.name }));
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${S(u.id)}" />
        <div class="gmf-form-grid">
          <label>From <select name="fromSystemId">${B(E, u.fromSystemId)}</select></label>
          <label>To <select name="toSystemId">${B(E, u.toSystemId)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Type <select name="type">${B(tt, u.type)}</select></label>
          <label>Visibility <select name="visibility">${B(Me, u.visibility)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Travel Time <input type="text" name="travelTime" value="${S(u.travelTime)}" /></label>
          <label>Fuel Cost <input type="number" name="fuelCost" value="${S(u.fuelCost)}" min="0" step="1" /></label>
        </div>
        <label>Notes <textarea name="notes">${S(u.notes)}</textarea></label>
      </form>
    `;
  }
  function te(e = {}) {
    const t = Ue(e);
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${S(t.id)}" />
        <label>Name <input type="text" name="name" value="${S(t.name)}" /></label>
        <div class="gmf-form-grid">
          <label>Color <input type="color" name="color" value="${S(t.color)}" /></label>
          <label>Visibility <select name="visibility">${B(Me, t.visibility)}</select></label>
        </div>
        <label>Description <textarea name="description">${S(t.description)}</textarea></label>
      </form>
    `;
  }
  function ie(e = {}) {
    const t = _(e);
    return `
      <form class="gmf-crud-form">
        <label>Title <input type="text" name="title" value="${S(t.title)}" /></label>
        <label>Subtitle <input type="text" name="subtitle" value="${S(t.subtitle)}" /></label>
        <label>Description <textarea name="description">${S(t.description)}</textarea></label>
        <label>Background Image
          <div class="gmf-path-field">
            <input type="text" name="backgroundImage" value="${S(t.backgroundImage)}" />
            <button type="button" data-browse-target="backgroundImage"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
        <label>Visibility <select name="visibility">${B(Me, t.visibility)}</select></label>
      </form>
    `;
  }
  function Te(e) {
    const t = D(e);
    t && ae({
      title: "Edit Galaxy Map",
      content: ie(t),
      onSubmit: (n) => $e(e, n)
    });
  }
  function Ee(e, t = null, n = {}) {
    var o;
    const i = D(e), s = t ? (o = i == null ? void 0 : i.systems) == null ? void 0 : o.find((u) => u.id === t) : null;
    ae({
      title: s ? "Edit Star System" : "Create Star System",
      content: Y(e, s ?? { id: K("system"), name: "New System" }, n),
      submitLabel: s ? "Save System" : "Create System",
      onSubmit: (u) => G(e, { ...u, pulse: u.pulse === "true" })
    });
  }
  function ke(e, t = null, n = {}) {
    var o;
    const i = D(e);
    if ((((o = i == null ? void 0 : i.systems) == null ? void 0 : o.length) ?? 0) < 2) {
      M("Create at least two systems before adding a route.");
      return;
    }
    const s = t ? i.routes.find((u) => u.id === t) : null;
    ae({
      title: s ? "Edit Route" : "Create Route",
      content: J(e, s ?? { id: K("route") }, n),
      submitLabel: s ? "Save Route" : "Create Route",
      onSubmit: (u) => l(e, u)
    });
  }
  function pe(e, t = null) {
    var s;
    const n = D(e), i = t ? (s = n == null ? void 0 : n.factions) == null ? void 0 : s.find((o) => o.id === t) : null;
    ae({
      title: i ? "Edit Faction" : "Create Faction",
      content: te(i ?? { id: K("faction"), name: "New Faction" }),
      submitLabel: i ? "Save Faction" : "Create Faction",
      onSubmit: (o) => c(e, o)
    });
  }
  function _e(e) {
    const t = D(e);
    if (!t) return;
    const n = _(t).factions.map((i) => `
      <article class="gmf-dialog-row">
        <div>
          <strong><span class="gmf-color-dot" style="--gmf-faction-color: ${S(i.color)};"></span>${S(i.name)}</strong>
          <span>${S(i.color)} - ${S(i.visibility)}</span>
        </div>
        <div class="gmf-row-actions">
          <button type="button" data-dialog-edit-faction="${S(i.id)}" title="Edit faction"><i class="fa-solid fa-pen"></i></button>
          <button type="button" data-dialog-delete-faction="${S(i.id)}" title="Delete faction"><i class="fa-solid fa-trash"></i></button>
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
          <div class="gmf-dialog-list">${n}</div>
        </section>
      `,
      render: (i) => {
        var o;
        const s = Pe(i);
        (o = s.querySelector("[data-dialog-add-faction]")) == null || o.addEventListener("click", () => pe(e)), s.querySelectorAll("[data-dialog-edit-faction]").forEach((u) => {
          u.addEventListener("click", () => pe(e, u.dataset.dialogEditFaction));
        }), s.querySelectorAll("[data-dialog-delete-faction]").forEach((u) => {
          u.addEventListener("click", async () => {
            await Dialog.confirm({
              title: "Delete Faction",
              content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
            }) && (await d(e, u.dataset.dialogDeleteFaction), _e(e));
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
  function Ce(e) {
    if (!e) return null;
    const t = _(e), n = new Map(t.systems.map((s) => [s.id, s])), i = new Map(t.factions.map((s) => [s.id, s]));
    return {
      ...t,
      systems: t.systems.map((s) => {
        var o;
        return {
          ...s,
          factionName: ((o = i.get(s.factionId)) == null ? void 0 : o.name) ?? "Unaffiliated"
        };
      }),
      routes: t.routes.map((s) => {
        var o, u;
        return {
          ...s,
          fromName: ((o = n.get(s.fromSystemId)) == null ? void 0 : o.name) ?? s.fromSystemId,
          toName: ((u = n.get(s.toSystemId)) == null ? void 0 : u.name) ?? s.toSystemId
        };
      })
    };
  }
  function ye() {
    return Object.values(q()).map(_);
  }
  function P(e = null) {
    r != null && r.rendered && r.render({ force: !0 });
    for (const [t, n] of y.entries())
      (!e || t === e) && n.render({ force: !0 });
    f != null && f.rendered && (!e || f.mapId === e) && f.render({ force: !0 });
  }
  function De(e) {
    const t = [...y.values()];
    return f && t.push(f), t.filter((n) => (n == null ? void 0 : n.rendered) && n.mapId === e);
  }
  function Re(e) {
    var t;
    return e.element instanceof HTMLElement ? e.element : ((t = e.element) == null ? void 0 : t[0]) ?? null;
  }
  function qe(e, t, n) {
    return e.routes.find((i) => i.fromSystemId === t && i.toSystemId === n || i.toSystemId === t && i.fromSystemId === n) ?? null;
  }
  function k(e) {
    return ce().filter((t) => t.id !== e).map((t) => t.id);
  }
  function re(e, t) {
    const n = D(e);
    if (!n)
      return M(`Map "${e}" was not found.`), null;
    const i = _(n), s = i.systems.find((V) => V.id === i.currentSystemId), o = i.systems.find((V) => V.id === t);
    if (!o)
      return M(`System "${t}" was not found.`), null;
    if (!s)
      return M("This map does not have a current location yet. Ask the GM to set one first."), null;
    if (s.id === o.id)
      return N(`${o.name} is already the current location.`), null;
    if (i.visibility !== "players" || s.visibility !== "players" || o.visibility !== "players")
      return M("That travel destination is not visible to players."), null;
    const u = qe(i, s.id, o.id);
    if (!u || u.visibility !== "players")
      return M(`No player-visible direct route from ${s.name} to ${o.name}.`), null;
    const E = de();
    if (!E)
      return M("A GM must be online to approve player travel."), null;
    const O = k(game.user.id);
    return O.includes(E.id) || O.push(E.id), {
      action: "travel-request",
      requestId: K("travel"),
      mapId: e,
      mapTitle: i.title,
      fromSystemId: s.id,
      fromName: s.name,
      toSystemId: o.id,
      toName: o.name,
      routeId: u.id,
      routeType: u.type,
      travelTime: u.travelTime,
      fuelCost: u.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      voterIds: [...new Set(O)]
    };
  }
  function se(e, t) {
    const n = re(e, t);
    return n ? (game.socket.emit(A, n), N(`Travel request sent: ${n.fromName} to ${n.toName}.`), n) : null;
  }
  function st(e) {
    var i, s, o;
    if (!(e != null && e.requestId) || e.requesterId === ((i = game.user) == null ? void 0 : i.id) || !((o = e.voterIds) != null && o.includes((s = game.user) == null ? void 0 : s.id)) || $.has(e.requestId)) return;
    $.add(e.requestId);
    let t = !1;
    const n = (u) => {
      if (t) return;
      t = !0;
      const E = {
        action: "travel-vote",
        requestId: e.requestId,
        mapId: e.mapId,
        userId: game.user.id,
        userName: game.user.name,
        accepted: u
      };
      game.socket.emit(A, E), Be(E);
    };
    new Dialog({
      title: "Travel Request",
      content: `
        <section class="gmf-travel-request">
          <p><strong>${S(e.requesterName)}</strong> wants to travel on <strong>${S(e.mapTitle)}</strong>.</p>
          <p>${S(e.fromName)} &rarr; ${S(e.toName)}</p>
          <p class="gmf-travel-request__meta">${S(e.routeType)} route / ${S(e.travelTime || "Unknown time")} / Fuel ${S(e.fuelCost ?? 0)}</p>
        </section>
      `,
      buttons: {
        accept: {
          icon: '<i class="fa-solid fa-check"></i>',
          label: "Accept",
          callback: () => n(!0)
        },
        decline: {
          icon: '<i class="fa-solid fa-xmark"></i>',
          label: "Decline",
          callback: () => n(!1)
        }
      },
      default: "accept",
      close: () => n(!1)
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog"],
      width: 420
    }).render(!0);
  }
  function nt(e) {
    if (!ue() || !(e != null && e.requestId)) return;
    const t = globalThis.setTimeout(() => {
      const n = v.get(e.requestId);
      n && He(n, "Request timeout");
    }, 6e4);
    v.set(e.requestId, {
      ...e,
      accepted: /* @__PURE__ */ new Set(),
      voterIds: [...new Set(e.voterIds ?? [])],
      timeoutId: t
    });
  }
  function Oe(e) {
    const t = _(D(e.mapId)), n = t.systems.find((s) => s.id === e.fromSystemId), i = t.systems.find((s) => s.id === e.toSystemId);
    !n || !i || De(e.mapId).forEach((s) => {
      var u;
      const o = Re(s);
      o && (s.selectedSystemId = i.id, s.selectedRouteId = null, (u = s._animateShipTravel) == null || u.call(s, n, i, o));
    });
  }
  function at(e, t, n) {
    var i;
    game.socket.emit(A, {
      action: "travel-animation",
      mapId: e,
      fromSystemId: t,
      toSystemId: n,
      coordinatorId: (i = game.user) == null ? void 0 : i.id
    });
  }
  async function rt(e) {
    v.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId);
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
    game.socket.emit(A, t), Oe(t), N(`Travel approved: ${e.fromName} to ${e.toName}.`), globalThis.setTimeout(() => Z(e.mapId, e.toSystemId), 2400);
  }
  function He(e, t = "A player") {
    v.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId);
    const n = {
      action: "travel-declined",
      requestId: e.requestId,
      mapId: e.mapId,
      fromName: e.fromName,
      toName: e.toName,
      voterName: t,
      coordinatorId: game.user.id
    };
    game.socket.emit(A, n), N(`Travel declined by ${t}: ${e.fromName} to ${e.toName}.`);
  }
  function Be(e) {
    if (!ue() || !(e != null && e.requestId)) return;
    const t = v.get(e.requestId);
    if (!(!t || !t.voterIds.includes(e.userId))) {
      if (!e.accepted) {
        He(t, e.userName);
        return;
      }
      t.accepted.add(e.userId), t.voterIds.every((n) => t.accepted.has(n)) && rt(t);
    }
  }
  function ot(e) {
    var t, n;
    e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && $.delete(e.requestId), Oe(e), (n = ui.notifications) == null || n.info(`Travel approved: ${e.fromName} to ${e.toName}.`));
  }
  function lt(e) {
    var t, n;
    e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && $.delete(e.requestId), (n = ui.notifications) == null || n.warn(`Travel declined by ${e.voterName}: ${e.fromName} to ${e.toName}.`));
  }
  function ct(e) {
    const t = y.get(e);
    t && t.close(), (f == null ? void 0 : f.mapId) === e && f.close();
  }
  function ve(e, t = {}) {
    var E;
    const n = D(e);
    if (!n)
      return M(`Map "${e}" was not found.`), null;
    const i = t.playerMode ?? !((E = game.user) != null && E.isGM);
    if (i && n.visibility !== "players" && !t.broadcast)
      return M("That galaxy map is not visible to players."), null;
    const s = i ? `player:${e}` : e, o = i && (f == null ? void 0 : f.mapId) === e ? f : y.get(s);
    if (o != null && o.rendered)
      return o.bringToFront(), o;
    const u = new ft({ mapId: e, playerMode: i });
    return i ? f = u : y.set(s, u), u.render({ force: !0 }), u;
  }
  function Ae() {
    return T("open the map manager") ? (r || (r = new ut()), r.render({ force: !0 }), r) : null;
  }
  function Ge() {
    const e = ye().filter((i) => i.visibility === "players").sort((i, s) => i.title.localeCompare(s.title));
    if (!e.length)
      return N("No galaxy map is currently visible to players."), null;
    if (e.length === 1) return ve(e[0].id, { playerMode: !0 });
    const t = e.map((i) => `
      <button type="button" class="gmf-player-map-choice" data-player-open-map="${S(i.id)}">
        <span class="gmf-player-map-choice__title">${S(i.title)}</span>
        <span class="gmf-player-map-choice__meta">${S(i.subtitle || i.description || "Player-visible galaxy map")}</span>
      </button>
    `).join("");
    let n = null;
    return n = new Dialog({
      title: "Choose Galaxy Map",
      content: `<section class="gmf-player-map-chooser">${t}</section>`,
      render: (i) => {
        const s = Pe(i);
        s == null || s.querySelectorAll("[data-player-open-map]").forEach((o) => {
          o.addEventListener("click", () => {
            ve(o.dataset.playerOpenMap, { playerMode: !0 }), n == null || n.close();
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
    }), n.render(!0), n;
  }
  function dt() {
    var t;
    const e = ye().sort((n, i) => n.title.localeCompare(i.title));
    return (t = game.user) != null && t.isGM ? e.length === 1 ? ve(e[0].id) : Ae() : Ge();
  }
  function ze(e) {
    if (T("broadcast galaxy maps")) {
      if (!D(e)) {
        M(`Map "${e}" was not found.`);
        return;
      }
      game.socket.emit(A, { action: "open", mapId: e }), N("Map broadcast sent to players.");
    }
  }
  function Ze() {
    T("close player galaxy maps") && (game.socket.emit(A, { action: "close" }), N("Close-map signal sent to players."));
  }
  const ut = vt({
    templateRoot: Le,
    getMaps: ye,
    prepareMapForManager: Ce,
    getRawMap: D,
    openMapMetadataDialog: Te,
    openSystemDialog: Ee,
    openRouteDialog: ke,
    openFactionDialog: pe,
    exportMap: z,
    duplicateMap: b,
    deleteMap: L,
    createMap: X,
    deleteSystem: ee,
    deleteRoute: a,
    deleteFaction: d,
    openMap: ve,
    showMapToPlayers: ze,
    closePlayerMap: Ze,
    hideSystemFromPlayers: m,
    hideRouteFromPlayers: R,
    clearManagerApp: (e) => {
      r === e && (r = null);
    }
  }), ft = Mt({
    templateRoot: Le,
    getRawMap: D,
    prepareMapForDisplay: me,
    openSystemDialog: Ee,
    openRouteDialog: ke,
    openFactionDialog: pe,
    openFactionManagerDialog: _e,
    openMapMetadataDialog: Te,
    revealSystemToPlayers: g,
    revealRouteToPlayers: x,
    hideSystemFromPlayers: m,
    hideRouteFromPlayers: R,
    deleteSystem: ee,
    deleteRoute: a,
    setCurrentSystem: Z,
    requestTravelToSystem: se,
    notifySystemDiscovered: I,
    exportMap: z,
    getTravelRoute: qe,
    broadcastTravelAnimation: at,
    notifyInfo: N,
    notifyError: M,
    saveSystemPosition: p,
    showMapToPlayers: ze,
    openMapManager: Ae,
    clearMapView: (e) => {
      e.playerMode && f === e && (f = null);
      for (const [t, n] of y.entries())
        n === e && y.delete(t);
    }
  });
  function mt() {
    const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
    return t != null && t.registerApp ? (t.registerApp({
      id: le,
      title: "Galaxy Map",
      icon: "fa-solid fa-route",
      premium: !1,
      description: "Open cinematic campaign maps and navigation charts.",
      open: () => {
        var n;
        return (n = game.user) != null && n.isGM ? Ae() : Ge();
      }
    }), !0) : !1;
  }
  Hooks.once("init", async () => {
    game.settings.register(le, Ye, {
      scope: "world",
      config: !1,
      type: Object,
      default: {}
    }), Handlebars.registerHelper("gmfEq", (e, t) => e === t), Handlebars.registerHelper("gmfJson", (e) => JSON.stringify(e, null, 2)), Handlebars.registerHelper("gmfPercent", (e) => `${Number(e).toFixed(3)}%`), Handlebars.registerHelper("gmfFallback", (e, t) => e || t), await loadTemplates([
      `${Le}/map-manager.hbs`,
      `${Le}/galaxy-map.hbs`,
      `${Le}/system-details.hbs`
    ]);
  }), Hooks.once("ready", () => {
    game.galaxyMap = {
      openMap: ve,
      openMapManager: Ae,
      openGalaxyMapFromSceneControls: dt,
      openPlayerMapChooser: Ge,
      createMap: X,
      getMaps: ye,
      showMapToPlayers: ze,
      closePlayerMap: Ze,
      updateMap: xe,
      updateMapMetadata: $e,
      deleteMap: L,
      duplicateMap: b,
      upsertSystem: G,
      deleteSystem: ee,
      upsertRoute: l,
      deleteRoute: a,
      upsertFaction: c,
      deleteFaction: d,
      saveSystemPosition: p,
      setCurrentSystem: Z,
      revealSystemToPlayers: g,
      revealRouteToPlayers: x,
      hideSystemFromPlayers: m,
      hideRouteFromPlayers: R,
      notifySystemDiscovered: I,
      requestTravelToSystem: se,
      importMapData: U,
      exportMap: z
    };
    const e = game.modules.get(le);
    e && (e.api = game.galaxyMap), mt(), game.socket.on(A, (t = {}) => {
      var n, i, s;
      if (t.action === "travel-request") {
        nt(t), st(t);
        return;
      }
      if (t.action === "travel-vote") {
        Be(t);
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
      if (t.action === "travel-animation") {
        t.coordinatorId !== ((n = game.user) == null ? void 0 : n.id) && Oe(t);
        return;
      }
      (i = game.user) != null && i.isGM || (t.action === "open" && t.mapId && (f == null || f.close(), ve(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "close" && (f == null || f.close()), t.action === "refresh" && (f == null ? void 0 : f.mapId) === t.mapId && f.render({ force: !0 }), t.action === "notify" && ((s = ui.notifications) == null || s.info(t.message || "New system discovered."), (f == null ? void 0 : f.mapId) === t.mapId && f.render({ force: !0 })));
    }), console.log(`${le} | Ready. API available at game.galaxyMap.`);
  });
})();
