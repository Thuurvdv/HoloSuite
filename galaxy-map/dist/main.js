var ut = Object.defineProperty;
var ft = (r, p, u) => p in r ? ut(r, p, { enumerable: !0, configurable: !0, writable: !0, value: u }) : r[p] = u;
var F = (r, p, u) => ft(r, typeof p != "symbol" ? p + "" : p, u);
const Ze = ["core", "colony", "frontier", "station", "anomaly", "ruins", "restricted", "unknown"], Je = ["undiscovered", "known", "visited", "danger", "locked"], We = ["safe", "dangerous", "restricted", "smuggler", "unknown"], Se = ["gm", "players"], Qe = ["planet", "ringed", "star", "diamond", "void"];
function W(r = "gmf") {
  return `${r}-${foundry.utils.randomID(10)}`;
}
function De(r, p = "players") {
  const u = Se.includes(p) ? p : "players";
  return Se.includes(r) ? String(r) : u;
}
function mt(r) {
  return typeof r == "string" && /^#[0-9a-f]{6}$/i.test(r) ? r : "#58d8ff";
}
function pt(r) {
  return typeof r == "string" && /^#[0-9a-f]{6}$/i.test(r) ? r : "";
}
function ve(r, p = 0) {
  const u = Number(r);
  return Number.isFinite(u) ? u : p;
}
function ee(r, p, u) {
  return Math.min(u, Math.max(p, r));
}
function Fe(r = {}) {
  return {
    id: String(r.id || W("system")),
    name: String(r.name || "Unnamed System"),
    x: Math.min(100, Math.max(0, ve(r.x, 50))),
    y: Math.min(100, Math.max(0, ve(r.y, 50))),
    type: Ze.includes(r.type) ? r.type : "unknown",
    factionId: String(r.factionId || ""),
    status: Je.includes(r.status) ? r.status : "known",
    description: String(r.description || ""),
    image: String(r.image || ""),
    sceneId: String(r.sceneId || ""),
    journalId: String(r.journalId || ""),
    visibility: De(r.visibility, "players"),
    notes: String(r.notes || ""),
    iconColor: pt(r.iconColor),
    iconSize: ee(ve(r.iconSize, 28), 18, 56),
    iconStyle: Qe.includes(r.iconStyle) ? r.iconStyle : "planet",
    pulse: r.pulse !== !1
  };
}
function Oe(r = {}) {
  return {
    id: String(r.id || W("route")),
    fromSystemId: String(r.fromSystemId || ""),
    toSystemId: String(r.toSystemId || ""),
    type: We.includes(r.type) ? r.type : "unknown",
    travelTime: String(r.travelTime || ""),
    fuelCost: ve(r.fuelCost, 0),
    visibility: De(r.visibility, "players"),
    notes: String(r.notes || "")
  };
}
function Ge(r = {}) {
  return {
    id: String(r.id || W("faction")),
    name: String(r.name || "Unaffiliated"),
    color: mt(r.color),
    description: String(r.description || ""),
    visibility: De(r.visibility, "players")
  };
}
function k(r = {}) {
  var w;
  const p = Array.isArray(r.systems) ? r.systems.map(Fe) : [], u = Array.isArray(r.routes) ? r.routes.map(Oe) : [], v = Array.isArray(r.factions) ? r.factions.map(Ge) : [];
  return {
    id: String(r.id || W("map")),
    title: String(r.title || "Untitled Galaxy Map"),
    subtitle: String(r.subtitle || ""),
    description: String(r.description || ""),
    backgroundImage: String(r.backgroundImage || ""),
    visibility: De(r.visibility, "players"),
    currentSystemId: String(r.currentSystemId || ((w = p[0]) == null ? void 0 : w.id) || ""),
    systems: p,
    routes: u,
    factions: v
  };
}
function yt() {
  var u, v, w, $;
  const r = (v = (u = foundry.applications) == null ? void 0 : u.api) == null ? void 0 : v.ApplicationV2, p = ($ = (w = foundry.applications) == null ? void 0 : w.api) == null ? void 0 : $.HandlebarsApplicationMixin;
  return r && p ? p(r) : Application;
}
function gt(r) {
  var ie;
  const {
    templateRoot: p,
    getMaps: u,
    prepareMapForManager: v,
    getRawMap: w,
    openMapMetadataDialog: $,
    openSystemDialog: I,
    openRouteDialog: N,
    openFactionDialog: T,
    exportMap: fe,
    duplicateMap: oe,
    deleteMap: me,
    createMap: pe,
    deleteSystem: q,
    deleteRoute: R,
    deleteFaction: be,
    openMap: te,
    showMapToPlayers: D,
    closePlayerMap: le,
    clearManagerApp: ce
  } = r;
  return ie = class extends yt() {
    constructor(L = {}) {
      super(L);
      F(this, "selectedMapId");
      F(this, "jsonDraft");
      this.selectedMapId = L.selectedMapId ?? null, this.jsonDraft = "";
    }
    async _prepareContext(L) {
      var o, a;
      const b = await ((o = super._prepareContext) == null ? void 0 : o.call(this, L)) ?? {}, H = u().sort((c, d) => c.title.localeCompare(d.title));
      (!this.selectedMapId || !H.some((c) => c.id === this.selectedMapId)) && (this.selectedMapId = ((a = H[0]) == null ? void 0 : a.id) ?? null);
      const ne = this.selectedMapId ? v(w(this.selectedMapId)) : null;
      return {
        ...b,
        maps: H,
        selectedMap: ne,
        selectedMapId: this.selectedMapId,
        hasMaps: H.length > 0
      };
    }
    _attachPartListeners(L, b, H) {
      var ne, o, a, c, d, m, g, x;
      (ne = super._attachPartListeners) == null || ne.call(this, L, b, H), (o = b.querySelector("[data-action='create-map']")) == null || o.addEventListener("click", () => this._onCreateMap()), (a = b.querySelector("[data-action='edit-map-metadata']")) == null || a.addEventListener("click", () => {
        this.selectedMapId && $(this.selectedMapId);
      }), (c = b.querySelector("[data-action='create-system']")) == null || c.addEventListener("click", () => {
        this.selectedMapId && I(this.selectedMapId);
      }), (d = b.querySelector("[data-action='create-route']")) == null || d.addEventListener("click", () => {
        this.selectedMapId && N(this.selectedMapId);
      }), (m = b.querySelector("[data-action='create-faction']")) == null || m.addEventListener("click", () => {
        this.selectedMapId && T(this.selectedMapId);
      }), b.querySelectorAll("[data-edit-system]").forEach((y) => {
        y.addEventListener("click", () => I(this.selectedMapId, y.dataset.editSystem));
      }), b.querySelectorAll("[data-delete-system]").forEach((y) => {
        y.addEventListener("click", () => this._confirmDeleteSystem(y.dataset.deleteSystem));
      }), b.querySelectorAll("[data-edit-route]").forEach((y) => {
        y.addEventListener("click", () => N(this.selectedMapId, y.dataset.editRoute));
      }), b.querySelectorAll("[data-delete-route]").forEach((y) => {
        y.addEventListener("click", () => this._confirmDeleteRoute(y.dataset.deleteRoute));
      }), b.querySelectorAll("[data-edit-faction]").forEach((y) => {
        y.addEventListener("click", () => T(this.selectedMapId, y.dataset.editFaction));
      }), b.querySelectorAll("[data-delete-faction]").forEach((y) => {
        y.addEventListener("click", () => this._confirmDeleteFaction(y.dataset.deleteFaction));
      }), (g = b.querySelector("[data-action='export-map']")) == null || g.addEventListener("click", () => {
        this.selectedMapId && fe(this.selectedMapId);
      }), b.querySelectorAll("[data-select-map]").forEach((y) => {
        y.addEventListener("click", () => {
          this.selectedMapId = y.dataset.selectMap, this.jsonDraft = "", this.render({ force: !0 });
        });
      }), b.querySelectorAll("[data-open-map]").forEach((y) => {
        y.addEventListener("click", () => te(y.dataset.openMap));
      }), b.querySelectorAll("[data-show-map]").forEach((y) => {
        y.addEventListener("click", () => D(y.dataset.showMap));
      }), b.querySelectorAll("[data-duplicate-map]").forEach((y) => {
        y.addEventListener("click", async () => {
          const _ = await oe(y.dataset.duplicateMap);
          _ && (this.selectedMapId = _.id, this.jsonDraft = "", this.render({ force: !0 }));
        });
      }), b.querySelectorAll("[data-delete-map]").forEach((y) => {
        y.addEventListener("click", async () => {
          const _ = y.dataset.deleteMap, M = w(_);
          await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${(M == null ? void 0 : M.title) ?? _}</strong>? This cannot be undone.</p>`
          }) && (await me(_), this.selectedMapId === _ && (this.selectedMapId = null), this.jsonDraft = "", this.render({ force: !0 }));
        });
      }), (x = b.querySelector("[data-action='close-player-map']")) == null || x.addEventListener("click", () => le());
    }
    async _onCreateMap() {
      const L = await pe({
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
      }) && await R(this.selectedMapId, L);
    }
    async _confirmDeleteFaction(L) {
      await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }) && await be(this.selectedMapId, L);
    }
    async close(L = {}) {
      return ce(this), super.close(L);
    }
  }, F(ie, "DEFAULT_OPTIONS", {
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
  }), F(ie, "PARTS", {
    main: {
      template: `${p}/map-manager.hbs`
    }
  }), ie;
}
function ht() {
  var u, v, w, $;
  const r = (v = (u = foundry.applications) == null ? void 0 : u.api) == null ? void 0 : v.ApplicationV2, p = ($ = (w = foundry.applications) == null ? void 0 : w.api) == null ? void 0 : $.HandlebarsApplicationMixin;
  return r && p ? p(r) : Application;
}
function St(r) {
  var b;
  const {
    templateRoot: p,
    getRawMap: u,
    prepareMapForDisplay: v,
    openSystemDialog: w,
    openRouteDialog: $,
    openFactionDialog: I,
    openFactionManagerDialog: N,
    openMapMetadataDialog: T,
    revealSystemToPlayers: fe,
    revealRouteToPlayers: oe,
    deleteSystem: me,
    deleteRoute: pe,
    setCurrentSystem: q,
    requestTravelToSystem: R,
    notifySystemDiscovered: be,
    exportMap: te,
    getTravelRoute: D,
    notifyInfo: le,
    notifyError: ce,
    saveSystemPosition: ie,
    showMapToPlayers: Ee,
    openMapManager: Me,
    clearMapView: L
  } = r;
  return b = class extends ht() {
    constructor(o = {}) {
      var d;
      const a = o.mapId, c = o.playerMode ?? !((d = game.user) != null && d.isGM);
      super({
        ...o,
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
      this.mapId = a, this.playerMode = c, this.selectedSystemId = o.selectedSystemId ?? null, this.selectedRouteId = o.selectedRouteId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null;
    }
    get title() {
      const o = u(this.mapId), a = this.playerMode ? "Player View" : "GM View";
      return o ? `${o.title} - ${a}` : `Galaxy Map - ${a}`;
    }
    async _prepareContext(o) {
      var m;
      const a = await ((m = super._prepareContext) == null ? void 0 : m.call(this, o)) ?? {}, c = u(this.mapId), d = c ? v(c, {
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
    _onRender(o, a) {
      var d, m;
      (d = super._onRender) == null || d.call(this, o, a);
      const c = this.element instanceof HTMLElement ? this.element : (m = this.element) == null ? void 0 : m[0];
      c && this._attachPartListeners("main", c, a);
    }
    _attachPartListeners(o, a, c) {
      var g, x, y, _, M, z, Y, O, B, Q, K, _e, Ie, we, xe, de, $e, ke, ue, P;
      const d = (g = a.matches) != null && g.call(a, ".gmf-map-stage") ? a : (x = a.querySelector) == null ? void 0 : x.call(a, ".gmf-map-stage");
      if ((d == null ? void 0 : d.dataset.gmfMapBound) === "true") return;
      d && (d.dataset.gmfMapBound = "true"), (y = super._attachPartListeners) == null || y.call(this, o, a, c), this._applyViewportTransform(a), a.querySelectorAll("[data-system-id]").forEach((E) => {
        var se;
        E.addEventListener("click", (ye) => {
          if (E.dataset.dragged === "true") {
            E.dataset.dragged = "false";
            return;
          }
          ye.stopPropagation(), this.selectedSystemId = E.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
        }), !this.playerMode && ((se = game.user) != null && se.isGM) && E.addEventListener("pointerdown", (ye) => this._startSystemDrag(ye, a, E));
      }), a.querySelectorAll("[data-route-id]").forEach((E) => {
        E.addEventListener("click", (se) => {
          se.stopPropagation(), this.selectedRouteId = E.dataset.routeId, this.selectedSystemId = null, this.render({ force: !0 });
        });
      });
      const m = a.querySelector(".gmf-map-stage");
      m == null || m.addEventListener("wheel", (E) => this._onWheelZoom(E, a), { passive: !1 }), m == null || m.addEventListener("pointerdown", (E) => this._startPan(E, a)), m == null || m.addEventListener("contextmenu", (E) => this._openContextMenu(E, a), { capture: !0 }), a.querySelectorAll("[data-context-action]").forEach((E) => {
        E.addEventListener("click", (se) => this._handleContextAction(se, a));
      }), (_ = a.querySelector("[data-action='open-map-menu']")) == null || _.addEventListener("click", (E) => this._openStageMenuFromButton(E, a)), (M = a.querySelector("[data-action='zoom-in']")) == null || M.addEventListener("click", () => this._setZoom(this.zoom + 0.15, a)), (z = a.querySelector("[data-action='zoom-out']")) == null || z.addEventListener("click", () => this._setZoom(this.zoom - 0.15, a)), (Y = a.querySelector("[data-action='reset-view']")) == null || Y.addEventListener("click", () => {
        this.zoom = 1, this.panX = 0, this.panY = 0, this._applyViewportTransform(a);
      }), (O = a.querySelector("[data-action='open-scene']")) == null || O.addEventListener("click", () => this._openLinkedScene()), (B = a.querySelector("[data-action='open-journal']")) == null || B.addEventListener("click", () => this._openLinkedJournal()), (Q = a.querySelector("[data-action='edit-system']")) == null || Q.addEventListener("click", () => {
        this.selectedSystemId && w(this.mapId, this.selectedSystemId);
      }), (K = a.querySelector("[data-action='reveal-system']")) == null || K.addEventListener("click", () => {
        this.selectedSystemId && fe(this.mapId, this.selectedSystemId);
      }), (_e = a.querySelector("[data-action='delete-system']")) == null || _e.addEventListener("click", () => {
        this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), (Ie = a.querySelector("[data-action='set-current-system']")) == null || Ie.addEventListener("click", () => {
        this.selectedSystemId && q(this.mapId, this.selectedSystemId);
      }), (we = a.querySelector("[data-action='travel-to-system']")) == null || we.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? R(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, a));
      }), (xe = a.querySelector("[data-action='edit-route']")) == null || xe.addEventListener("click", () => {
        this.selectedRouteId && $(this.mapId, this.selectedRouteId);
      }), (de = a.querySelector("[data-action='reveal-route']")) == null || de.addEventListener("click", () => {
        this.selectedRouteId && oe(this.mapId, this.selectedRouteId);
      }), ($e = a.querySelector("[data-action='delete-route']")) == null || $e.addEventListener("click", () => {
        this.selectedRouteId && this._confirmDeleteRoute(this.selectedRouteId);
      }), (ke = a.querySelector("[data-action='notify-discovery']")) == null || ke.addEventListener("click", () => {
        this.selectedSystemId && be(this.mapId, this.selectedSystemId);
      }), (ue = a.querySelector("[data-action='show-to-players']")) == null || ue.addEventListener("click", () => Ee(this.mapId)), (P = a.querySelector("[data-action='edit-map']")) == null || P.addEventListener("click", () => {
        const E = Me();
        E && (E.selectedMapId = this.mapId, E.render({ force: !0 }));
      });
    }
    _applyViewportTransform(o) {
      var c;
      const a = o.querySelector(".gmf-map-viewport");
      a && (a.style.setProperty("--gmf-pan-x", `${this.panX}px`), a.style.setProperty("--gmf-pan-y", `${this.panY}px`), a.style.setProperty("--gmf-zoom", String(this.zoom)), (c = o.querySelector("[data-zoom-label]")) == null || c.replaceChildren(`${Math.round(this.zoom * 100)}%`));
    }
    _setZoom(o, a) {
      this.zoom = ee(o, 0.55, 2.6), this._applyViewportTransform(a);
    }
    _onWheelZoom(o, a) {
      o.preventDefault();
      const c = a.querySelector(".gmf-map-stage");
      if (!c) return;
      const d = c.getBoundingClientRect(), m = this.zoom, g = ee(m + (o.deltaY < 0 ? 0.12 : -0.12), 0.55, 2.6), x = o.clientX - d.left, y = o.clientY - d.top, _ = (x - this.panX) / m, M = (y - this.panY) / m;
      this.zoom = g, this.panX = x - _ * g, this.panY = y - M * g, this._applyViewportTransform(a);
    }
    _startPan(o, a) {
      if (o.button !== 0 || o.target.closest("[data-system-id], [data-route-id], button")) return;
      o.preventDefault();
      const c = o.clientX, d = o.clientY, m = this.panX, g = this.panY, x = (_) => {
        this.panX = m + _.clientX - c, this.panY = g + _.clientY - d, this._applyViewportTransform(a);
      }, y = () => {
        window.removeEventListener("pointermove", x), window.removeEventListener("pointerup", y);
      };
      window.addEventListener("pointermove", x), window.addEventListener("pointerup", y, { once: !0 });
    }
    _startSystemDrag(o, a, c) {
      var O;
      if (o.button !== 0) return;
      o.preventDefault(), o.stopPropagation(), (O = c.setPointerCapture) == null || O.call(c, o.pointerId);
      const d = o.clientX, m = o.clientY;
      let g = this._pointerToMapPercent(o, a), x = !1, y = null;
      const _ = Array.from(a.querySelectorAll(`[data-route-from="${c.dataset.systemId}"]`)), M = Array.from(a.querySelectorAll(`[data-route-to="${c.dataset.systemId}"]`));
      c.classList.add("is-dragging");
      const z = (B) => {
        const Q = Math.abs(B.clientX - d), K = Math.abs(B.clientY - m);
        x = x || Q > 3 || K > 3, g = this._pointerToMapPercent(B, a), c.dataset.dragged = x ? "true" : "false", !y && (y = requestAnimationFrame(() => {
          y = null, c.style.left = `${g.x}%`, c.style.top = `${g.y}%`, this._updateConnectedRoutes(_, M, g.x, g.y);
        }));
      }, Y = async () => {
        y && cancelAnimationFrame(y), c.style.left = `${g.x}%`, c.style.top = `${g.y}%`, this._updateConnectedRoutes(_, M, g.x, g.y), c.classList.remove("is-dragging"), window.removeEventListener("pointermove", z), window.removeEventListener("pointerup", Y), x && await ie(this.mapId, c.dataset.systemId, g.x, g.y);
      };
      window.addEventListener("pointermove", z), window.addEventListener("pointerup", Y, { once: !0 });
    }
    _pointerToMapPercent(o, a) {
      const d = a.querySelector(".gmf-map-stage").getBoundingClientRect();
      return {
        x: ee((o.clientX - d.left - this.panX) / this.zoom / d.width * 100, 0, 100),
        y: ee((o.clientY - d.top - this.panY) / this.zoom / d.height * 100, 0, 100)
      };
    }
    _updateConnectedRoutes(o, a, c, d) {
      o.forEach((m) => {
        m.setAttribute("x1", c), m.setAttribute("y1", d);
      }), a.forEach((m) => {
        m.setAttribute("x2", c), m.setAttribute("y2", d);
      });
    }
    _openContextMenu(o, a) {
      var Q;
      if (!((Q = game.user) != null && Q.isGM) || this.playerMode || o.target.closest(".gmf-map-toolbar, .gmf-context-menu")) return;
      o.preventDefault(), o.stopPropagation();
      const c = o.target.closest("[data-route-id]"), d = o.target.closest("[data-system-id]"), m = this._pointerToMapPercent(o, a);
      this._contextTarget = c ? { type: "route", id: c.dataset.routeId, position: m } : d ? { type: "system", id: d.dataset.systemId, position: m } : { type: "stage", id: null, position: m };
      const g = a.querySelector("[data-gmf-context-menu]");
      if (!g) return;
      g.querySelectorAll("[data-context-show]").forEach((K) => {
        K.hidden = K.dataset.contextShow !== this._contextTarget.type;
      }), g.hidden = !1;
      const x = g.offsetWidth || 184, y = g.offsetHeight || 260, M = a.querySelector(".gmf-map-stage").getBoundingClientRect(), z = o.clientX - M.left, Y = o.clientY - M.top, O = Math.max(4, M.width - x - 4), B = Math.max(4, M.height - y - 4);
      g.style.left = `${ee(z, 4, O)}px`, g.style.top = `${ee(Y, 4, B)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(a), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _openStageMenuFromButton(o, a) {
      var g;
      if (!((g = game.user) != null && g.isGM) || this.playerMode) return;
      o.preventDefault(), o.stopPropagation();
      const c = a.querySelector(".gmf-map-stage"), d = c == null ? void 0 : c.getBoundingClientRect();
      if (!d) return;
      const m = {
        clientX: d.left + d.width / 2,
        clientY: d.top + d.height / 2,
        target: c,
        preventDefault: () => {
        },
        stopPropagation: () => {
        }
      };
      this._openContextMenu(m, a);
    }
    _hideContextMenu(o = null) {
      var d, m, g;
      const a = o ?? this.element ?? null, c = ((d = a == null ? void 0 : a.querySelector) == null ? void 0 : d.call(a, "[data-gmf-context-menu]")) ?? ((g = (m = a == null ? void 0 : a[0]) == null ? void 0 : m.querySelector) == null ? void 0 : g.call(m, "[data-gmf-context-menu]"));
      c && (c.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(o, a) {
      o.preventDefault(), o.stopPropagation();
      const c = o.currentTarget.dataset.contextAction, d = this._contextTarget;
      this._hideContextMenu(a), d && (c === "add-system" ? w(this.mapId, null, { x: d.position.x, y: d.position.y }) : c === "add-route" ? $(this.mapId) : c === "manage-factions" ? N(this.mapId) : c === "add-faction" ? I(this.mapId) : c === "edit-map-details" ? T(this.mapId) : c === "export-map" ? te(this.mapId) : c === "edit-system" ? w(this.mapId, d.id) : c === "add-route-from-system" ? $(this.mapId, null, { fromSystemId: d.id }) : c === "reveal-system" ? await fe(this.mapId, d.id) : c === "delete-system" ? await this._confirmDeleteSystem(d.id) : c === "edit-route" ? $(this.mapId, d.id) : c === "reveal-route" ? await oe(this.mapId, d.id) : c === "delete-route" && await this._confirmDeleteRoute(d.id));
    }
    async _confirmDeleteSystem(o) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }) && await me(this.mapId, o);
    }
    async _confirmDeleteRoute(o) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }) && await pe(this.mapId, o);
    }
    async _travelToSystem(o, a) {
      const c = k(u(this.mapId)), d = c.systems.find((x) => x.id === c.currentSystemId), m = c.systems.find((x) => x.id === o);
      if (!m) return;
      if (!d) {
        await q(this.mapId, m.id), le(`Current location set to ${m.name}.`);
        return;
      }
      if (d.id === m.id) {
        le(`${m.name} is already the current location.`);
        return;
      }
      if (!D(c, d.id, m.id)) {
        ce(`No direct route from ${d.name} to ${m.name}.`);
        return;
      }
      await this._animateShipTravel(d, m, a), await q(this.mapId, m.id), le(`Arrived at ${m.name}.`);
    }
    _animateShipTravel(o, a, c) {
      const d = c.querySelector("[data-ship-layer]"), m = c.querySelector(".gmf-map-stage");
      if (!d || !m) return Promise.resolve();
      const g = m.getBoundingClientRect(), x = (a.x - o.x) * g.width / 100, y = (a.y - o.y) * g.height / 100, _ = Math.atan2(y, x) * 180 / Math.PI, M = document.createElement("div");
      return M.className = "gmf-travel-ship", M.innerHTML = '<i class="fa-solid fa-rocket"></i>', M.style.left = `${o.x}%`, M.style.top = `${o.y}%`, M.style.setProperty("--gmf-ship-angle", `${_}deg`), d.replaceChildren(M), new Promise((z) => {
        let Y = !1;
        const O = () => {
          Y || (Y = !0, M.removeEventListener("transitionend", O), M.classList.add("is-arrived"), globalThis.setTimeout(() => {
            M.remove(), z();
          }, 260));
        };
        M.addEventListener("transitionend", O, { once: !0 }), requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            M.style.left = `${a.x}%`, M.style.top = `${a.y}%`;
          });
        }), globalThis.setTimeout(O, 2400);
      });
    }
    _openLinkedScene() {
      var c;
      const o = this._getSelectedRawSystem();
      if (!(o != null && o.sceneId)) return;
      const a = (c = game.scenes) == null ? void 0 : c.get(o.sceneId);
      if (!a) {
        ce(`Scene "${o.sceneId}" was not found.`);
        return;
      }
      a.view();
    }
    _openLinkedJournal() {
      var c, d;
      const o = this._getSelectedRawSystem();
      if (!(o != null && o.journalId)) return;
      const a = (c = game.journal) == null ? void 0 : c.get(o.journalId);
      if (!a) {
        ce(`Journal "${o.journalId}" was not found.`);
        return;
      }
      (d = a.sheet) == null || d.render(!0);
    }
    _getSelectedRawSystem() {
      var a;
      const o = u(this.mapId);
      return ((a = o == null ? void 0 : o.systems) == null ? void 0 : a.find((c) => c.id === this.selectedSystemId)) ?? null;
    }
    async close(o = {}) {
      return this._hideContextMenu(), L(this), super.close(o);
    }
  }, F(b, "DEFAULT_OPTIONS", {
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
  }), F(b, "PARTS", {
    main: {
      template: `${p}/galaxy-map.hbs`
    }
  }), b;
}
const re = "galaxy-map", Pe = "maps", A = `module.${re}`, Te = `modules/${re}/templates`;
function vt(r) {
  return String(r || "galaxy-map").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "galaxy-map";
}
function bt(r, p) {
  const u = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" }), v = URL.createObjectURL(u), w = document.createElement("a");
  w.href = v, w.download = r, document.body.appendChild(w), w.click(), w.remove(), URL.revokeObjectURL(v);
}
function S(r) {
  const p = document.createElement("div");
  return p.textContent = String(r ?? ""), p.innerHTML;
}
function U(r, p) {
  return r.map((u) => {
    const v = typeof u == "string" ? u : u.value, w = typeof u == "string" ? u : u.label;
    return `<option value="${S(v)}" ${v === p ? "selected" : ""}>${S(w)}</option>`;
  }).join("");
}
function Be(r, p) {
  const u = (r == null ? void 0 : r.contents) ?? [];
  return [
    { value: "", label: "None" },
    ...u.map((v) => ({ value: v.id, label: v.name }))
  ].map((v) => `<option value="${S(v.value)}" ${v.value === p ? "selected" : ""}>${S(v.label)}</option>`).join("");
}
function Le(r) {
  return (r == null ? void 0 : r[0]) ?? r ?? null;
}
function Mt(r) {
  var v;
  const p = Le(r), u = (v = p == null ? void 0 : p.matches) != null && v.call(p, "form") ? p : p == null ? void 0 : p.querySelector("form");
  return Object.fromEntries(new FormData(u).entries());
}
(() => {
  let r = null;
  const p = /* @__PURE__ */ new Map();
  let u = null;
  const v = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Set();
  function $(e) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? {}));
  }
  function I(e) {
    var t;
    (t = ui.notifications) == null || t.error(`[Galaxy Map] ${e}`);
  }
  function N(e) {
    var t;
    (t = ui.notifications) == null || t.info(`[Galaxy Map] ${e}`);
  }
  function T(e = "change galaxy maps") {
    var t;
    return (t = game.user) != null && t.isGM ? !0 : (I(`Only a GM can ${e}.`), !1);
  }
  function fe() {
    var e;
    return ((e = game.users) == null ? void 0 : e.contents) ?? Array.from(game.users ?? []);
  }
  function oe() {
    return fe().filter((e) => e.active);
  }
  function me() {
    return oe().filter((e) => e.isGM).sort((e, t) => String(e.id).localeCompare(String(t.id)))[0] ?? null;
  }
  function pe() {
    var e, t;
    return !!((e = game.user) != null && e.isGM && ((t = me()) == null ? void 0 : t.id) === game.user.id);
  }
  function q() {
    return $(game.settings.get(re, Pe) ?? {});
  }
  async function R(e) {
    return T("save galaxy map data") && await game.settings.set(re, Pe, e ?? {}), e;
  }
  function be(e) {
    const t = Le(e);
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
  function te({ title: e, content: t, submitLabel: s = "Save", onSubmit: i, render: n = be }) {
    new Dialog({
      title: e,
      content: t,
      render: n,
      buttons: {
        save: {
          icon: '<i class="fa-solid fa-floppy-disk"></i>',
          label: s,
          callback: (l) => i(Mt(l))
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
    return t[e] ? $(t[e]) : null;
  }
  function le(e) {
    return new Map((e ?? []).map((t) => [t.id, t]));
  }
  function ce(e) {
    return e.visibility === "players";
  }
  function ie(e, t) {
    return t && e.status === "undiscovered";
  }
  function Ee(e, { playerMode: t = !1, selectedSystemId: s = null, selectedRouteId: i = null } = {}) {
    var Ue, He;
    const n = k(e), l = t ? n.systems.filter(ce) : n.systems, f = new Set(l.map((h) => h.id)), C = t ? n.factions.filter((h) => h.visibility === "players") : n.factions, G = le(C), V = l.map((h) => {
      const X = G.get(h.factionId), J = ie(h, t);
      return {
        ...h,
        displayName: J ? "???" : h.name,
        displayDescription: J ? "Unresolved sensor contact. Details are not available." : h.description,
        displayType: J ? "unknown" : h.type,
        displayStatus: J ? "undiscovered" : h.status,
        factionName: (X == null ? void 0 : X.name) ?? "Unaffiliated",
        factionColor: h.iconColor || (X == null ? void 0 : X.color) || "#58d8ff",
        obscured: J,
        isCurrent: h.id === n.currentSystemId,
        isSelected: h.id === s,
        gmOnly: h.visibility === "gm"
      };
    }), he = n.routes.filter((h) => !t || h.visibility === "players").filter((h) => f.has(h.fromSystemId) && f.has(h.toSystemId)).map((h) => {
      const X = V.find((Ne) => Ne.id === h.fromSystemId), J = V.find((Ne) => Ne.id === h.toSystemId);
      return {
        ...h,
        from: X,
        to: J,
        fromName: (X == null ? void 0 : X.displayName) ?? h.fromSystemId,
        toName: (J == null ? void 0 : J.displayName) ?? h.toSystemId,
        isSelected: h.id === i,
        connectsCurrent: h.fromSystemId === n.currentSystemId || h.toSystemId === n.currentSystemId,
        gmOnly: h.visibility === "gm"
      };
    }), Z = he.find((h) => h.id === i) ?? null, j = Z ? null : V.find((h) => h.id === s) ?? V[0] ?? null;
    j && (j.isSelected = !0);
    const ae = V.find((h) => h.id === n.currentSystemId) ?? V[0] ?? null, Ce = j && ae && j.id !== ae.id ? he.find((h) => h.fromSystemId === ae.id && h.toSystemId === j.id || h.toSystemId === ae.id && h.fromSystemId === j.id) : null;
    return j && (j.canTravel = !!Ce, j.travelRouteId = (Ce == null ? void 0 : Ce.id) ?? "", j.isCurrent = j.id === (ae == null ? void 0 : ae.id)), {
      ...n,
      systems: V,
      routes: he,
      factions: C,
      selectedSystem: j,
      selectedRoute: Z,
      currentSystem: ae,
      selectedType: Z ? "route" : "system",
      playerMode: t,
      isGM: ((Ue = game.user) == null ? void 0 : Ue.isGM) ?? !1,
      canEdit: ((He = game.user) == null ? void 0 : He.isGM) && !t
    };
  }
  async function Me(e = {}) {
    if (!T("create galaxy maps")) return null;
    const t = q(), s = k(e);
    return t[s.id] = s, await R(t), P(s.id), $(s);
  }
  async function L(e, t = {}) {
    if (!T("update galaxy maps")) return null;
    const s = q();
    if (!s[e])
      return I(`Map "${e}" was not found.`), null;
    const i = k({ ...t, id: e });
    return s[e] = i, await R(s), P(e), $(i);
  }
  async function b(e, t = {}) {
    if (!T("update galaxy map metadata")) return null;
    const s = D(e);
    return s ? L(e, {
      ...s,
      title: t.title,
      subtitle: t.subtitle,
      description: t.description,
      backgroundImage: t.backgroundImage,
      visibility: t.visibility
    }) : (I(`Map "${e}" was not found.`), null);
  }
  async function H(e) {
    if (!T("delete galaxy maps")) return !1;
    const t = q();
    return t[e] ? (delete t[e], await R(t), rt(e), P(), !0) : !1;
  }
  async function ne(e) {
    if (!T("duplicate galaxy maps")) return null;
    const t = D(e);
    if (!t)
      return I(`Map "${e}" was not found.`), null;
    const s = k({
      ...t,
      id: W("map"),
      title: `${t.title} Copy`
    }), i = q();
    return i[s.id] = s, await R(i), P(s.id), $(s);
  }
  async function o(e, t = {}) {
    if (!T("save star systems")) return null;
    const s = q(), i = s[e];
    if (!i)
      return I(`Map "${e}" was not found.`), null;
    const n = Fe(t), l = i.systems.findIndex((f) => f.id === n.id);
    return l >= 0 ? i.systems[l] = n : i.systems.push(n), s[e] = k(i), await R(s), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), $(n);
  }
  async function a(e, t) {
    var n;
    if (!T("delete star systems")) return !1;
    const s = q(), i = s[e];
    return i ? (i.systems = i.systems.filter((l) => l.id !== t), i.routes = i.routes.filter((l) => l.fromSystemId !== t && l.toSystemId !== t), i.currentSystemId === t && (i.currentSystemId = ((n = i.systems[0]) == null ? void 0 : n.id) ?? ""), s[e] = k(i), await R(s), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function c(e, t) {
    var l;
    if (!T("set current location")) return null;
    const s = q(), i = s[e], n = (l = i == null ? void 0 : i.systems) == null ? void 0 : l.find((f) => f.id === t);
    return n ? (i.currentSystemId = t, s[e] = k(i), await R(s), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), $(n)) : (I(`System "${t}" was not found.`), null);
  }
  async function d(e, t = {}) {
    if (!T("save routes")) return null;
    const s = q(), i = s[e];
    if (!i)
      return I(`Map "${e}" was not found.`), null;
    const n = Oe(t);
    if (!n.fromSystemId || !n.toSystemId || n.fromSystemId === n.toSystemId)
      return I("Routes require two different systems."), null;
    const l = i.routes.findIndex((f) => f.id === n.id);
    return l >= 0 ? i.routes[l] = n : i.routes.push(n), s[e] = k(i), await R(s), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), $(n);
  }
  async function m(e, t) {
    if (!T("delete routes")) return !1;
    const s = q(), i = s[e];
    return i ? (i.routes = i.routes.filter((n) => n.id !== t), s[e] = k(i), await R(s), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function g(e, t = {}) {
    if (!T("save factions")) return null;
    const s = q(), i = s[e];
    if (!i)
      return I(`Map "${e}" was not found.`), null;
    const n = Ge(t), l = i.factions.findIndex((f) => f.id === n.id);
    return l >= 0 ? i.factions[l] = n : i.factions.push(n), s[e] = k(i), await R(s), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), $(n);
  }
  async function x(e, t) {
    if (!T("delete factions")) return !1;
    const s = q(), i = s[e];
    if (!i) return !1;
    i.factions = i.factions.filter((n) => n.id !== t);
    for (const n of i.systems)
      n.factionId === t && (n.factionId = "");
    return s[e] = k(i), await R(s), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), !0;
  }
  async function y(e, t, s, i) {
    var C;
    if (!T("move star systems")) return null;
    const n = q(), l = n[e], f = (C = l == null ? void 0 : l.systems) == null ? void 0 : C.find((G) => G.id === t);
    return f ? (f.x = ee(ve(s, f.x), 0, 100), f.y = ee(ve(i, f.y), 0, 100), n[e] = k(l), await R(n), game.socket.emit(A, { action: "refresh", mapId: e }), $(f)) : (I(`System "${t}" was not found.`), null);
  }
  async function _(e, t, { notify: s = !0 } = {}) {
    var f;
    if (!T("reveal star systems")) return null;
    const i = q(), n = i[e], l = (f = n == null ? void 0 : n.systems) == null ? void 0 : f.find((C) => C.id === t);
    return l ? (l.visibility = "players", (l.status === "undiscovered" || l.status === "locked") && (l.status = "known"), i[e] = k(n), await R(i), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), s && z(e, l.id), N(`${l.name} revealed to players.`), $(l)) : (I(`System "${t}" was not found.`), null);
  }
  async function M(e, t) {
    var l;
    if (!T("reveal routes")) return null;
    const s = q(), i = s[e], n = (l = i == null ? void 0 : i.routes) == null ? void 0 : l.find((f) => f.id === t);
    return n ? (n.visibility = "players", s[e] = k(i), await R(s), P(e), game.socket.emit(A, { action: "refresh", mapId: e }), N("Route revealed to players."), $(n)) : (I(`Route "${t}" was not found.`), null);
  }
  function z(e, t) {
    var n;
    if (!T("notify players about discoveries")) return;
    const s = D(e), i = (n = s == null ? void 0 : s.systems) == null ? void 0 : n.find((l) => l.id === t);
    if (!i) {
      I(`System "${t}" was not found.`);
      return;
    }
    game.socket.emit(A, {
      action: "notify",
      mapId: e,
      systemId: t,
      message: `New System Discovered: ${i.name}`
    }), N(`Discovery notification sent: ${i.name}.`);
  }
  async function Y(e, { replace: t = !1 } = {}) {
    if (!T("import galaxy maps")) return null;
    const s = q();
    let i = k(e);
    return s[i.id] && !t && (i = k({
      ...i,
      id: W("map"),
      title: `${i.title} Import`
    })), s[i.id] = i, await R(s), P(i.id), N(`Imported ${i.title}.`), $(i);
  }
  function O(e) {
    const t = D(e);
    if (!t) {
      I(`Map "${e}" was not found.`);
      return;
    }
    bt(`${vt(t.title)}.json`, k(t));
  }
  function B(e, t = {}, s = {}) {
    const i = D(e), n = Fe({ ...s, ...t }), l = [
      { value: "", label: "Unaffiliated" },
      ...((i == null ? void 0 : i.factions) ?? []).map((G) => ({ value: G.id, label: G.name }))
    ], f = ((i == null ? void 0 : i.factions) ?? []).find((G) => G.id === n.factionId), C = n.iconColor || (f == null ? void 0 : f.color) || "#58d8ff";
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${S(n.id)}" />
        <input type="hidden" name="x" value="${S(n.x)}" />
        <input type="hidden" name="y" value="${S(n.y)}" />
        <label>Name <input type="text" name="name" value="${S(n.name)}" /></label>
        <div class="gmf-form-grid">
          <label>Type <select name="type">${U(Ze, n.type)}</select></label>
          <label>Status <select name="status">${U(Je, n.status)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Faction <select name="factionId">${U(l, n.factionId)}</select></label>
          <label>Visibility <select name="visibility">${U(Se, n.visibility)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Icon Style <select name="iconStyle">${U(Qe, n.iconStyle)}</select></label>
          <label>Icon Size <input type="range" name="iconSize" value="${S(n.iconSize)}" min="18" max="56" step="1" /></label>
        </div>
        <div class="gmf-form-grid">
          <label>Icon Color <input type="color" name="iconColor" value="${S(C)}" /></label>
          <label class="gmf-checkbox-label"><input type="checkbox" name="pulse" value="true" ${n.pulse ? "checked" : ""} /> Pulse Glow</label>
        </div>
        <label>Description <textarea name="description">${S(n.description)}</textarea></label>
        <label>Image Path
          <div class="gmf-path-field">
            <input type="text" name="image" value="${S(n.image)}" />
            <button type="button" data-browse-target="image"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
        <div class="gmf-form-grid">
          <label>Scene <select name="sceneId">${Be(game.scenes, n.sceneId)}</select></label>
          <label>Journal <select name="journalId">${Be(game.journal, n.journalId)}</select></label>
        </div>
        <label>GM Notes <textarea name="notes">${S(n.notes)}</textarea></label>
      </form>
    `;
  }
  function Q(e, t = {}, s = {}) {
    var G, V, he;
    const i = D(e), n = { ...s, ...t }, l = (i == null ? void 0 : i.systems) ?? [];
    n.fromSystemId || (n.fromSystemId = ((G = l[0]) == null ? void 0 : G.id) ?? ""), n.toSystemId || (n.toSystemId = ((V = l.find((Z) => Z.id !== n.fromSystemId)) == null ? void 0 : V.id) ?? ""), n.fromSystemId && !n.toSystemId && (n.toSystemId = ((he = l.find((Z) => Z.id !== n.fromSystemId)) == null ? void 0 : he.id) ?? "");
    const f = Oe(n), C = l.map((Z) => ({ value: Z.id, label: Z.name }));
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${S(f.id)}" />
        <div class="gmf-form-grid">
          <label>From <select name="fromSystemId">${U(C, f.fromSystemId)}</select></label>
          <label>To <select name="toSystemId">${U(C, f.toSystemId)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Type <select name="type">${U(We, f.type)}</select></label>
          <label>Visibility <select name="visibility">${U(Se, f.visibility)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Travel Time <input type="text" name="travelTime" value="${S(f.travelTime)}" /></label>
          <label>Fuel Cost <input type="number" name="fuelCost" value="${S(f.fuelCost)}" min="0" step="1" /></label>
        </div>
        <label>Notes <textarea name="notes">${S(f.notes)}</textarea></label>
      </form>
    `;
  }
  function K(e = {}) {
    const t = Ge(e);
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${S(t.id)}" />
        <label>Name <input type="text" name="name" value="${S(t.name)}" /></label>
        <div class="gmf-form-grid">
          <label>Color <input type="color" name="color" value="${S(t.color)}" /></label>
          <label>Visibility <select name="visibility">${U(Se, t.visibility)}</select></label>
        </div>
        <label>Description <textarea name="description">${S(t.description)}</textarea></label>
      </form>
    `;
  }
  function _e(e = {}) {
    const t = k(e);
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
        <label>Visibility <select name="visibility">${U(Se, t.visibility)}</select></label>
      </form>
    `;
  }
  function Ie(e) {
    const t = D(e);
    t && te({
      title: "Edit Galaxy Map",
      content: _e(t),
      onSubmit: (s) => b(e, s)
    });
  }
  function we(e, t = null, s = {}) {
    var l;
    const i = D(e), n = t ? (l = i == null ? void 0 : i.systems) == null ? void 0 : l.find((f) => f.id === t) : null;
    te({
      title: n ? "Edit Star System" : "Create Star System",
      content: B(e, n ?? { id: W("system"), name: "New System" }, s),
      submitLabel: n ? "Save System" : "Create System",
      onSubmit: (f) => o(e, { ...f, pulse: f.pulse === "true" })
    });
  }
  function xe(e, t = null, s = {}) {
    var l;
    const i = D(e);
    if ((((l = i == null ? void 0 : i.systems) == null ? void 0 : l.length) ?? 0) < 2) {
      I("Create at least two systems before adding a route.");
      return;
    }
    const n = t ? i.routes.find((f) => f.id === t) : null;
    te({
      title: n ? "Edit Route" : "Create Route",
      content: Q(e, n ?? { id: W("route") }, s),
      submitLabel: n ? "Save Route" : "Create Route",
      onSubmit: (f) => d(e, f)
    });
  }
  function de(e, t = null) {
    var n;
    const s = D(e), i = t ? (n = s == null ? void 0 : s.factions) == null ? void 0 : n.find((l) => l.id === t) : null;
    te({
      title: i ? "Edit Faction" : "Create Faction",
      content: K(i ?? { id: W("faction"), name: "New Faction" }),
      submitLabel: i ? "Save Faction" : "Create Faction",
      onSubmit: (l) => g(e, l)
    });
  }
  function $e(e) {
    const t = D(e);
    if (!t) return;
    const s = k(t).factions.map((i) => `
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
          <div class="gmf-dialog-list">${s}</div>
        </section>
      `,
      render: (i) => {
        var l;
        const n = Le(i);
        (l = n.querySelector("[data-dialog-add-faction]")) == null || l.addEventListener("click", () => de(e)), n.querySelectorAll("[data-dialog-edit-faction]").forEach((f) => {
          f.addEventListener("click", () => de(e, f.dataset.dialogEditFaction));
        }), n.querySelectorAll("[data-dialog-delete-faction]").forEach((f) => {
          f.addEventListener("click", async () => {
            await Dialog.confirm({
              title: "Delete Faction",
              content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
            }) && (await x(e, f.dataset.dialogDeleteFaction), $e(e));
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
  function ke(e) {
    if (!e) return null;
    const t = k(e), s = new Map(t.systems.map((n) => [n.id, n])), i = new Map(t.factions.map((n) => [n.id, n]));
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
        var l, f;
        return {
          ...n,
          fromName: ((l = s.get(n.fromSystemId)) == null ? void 0 : l.name) ?? n.fromSystemId,
          toName: ((f = s.get(n.toSystemId)) == null ? void 0 : f.name) ?? n.toSystemId
        };
      })
    };
  }
  function ue() {
    return Object.values(q()).map(k);
  }
  function P(e = null) {
    r != null && r.rendered && r.render({ force: !0 });
    for (const [t, s] of p.entries())
      (!e || t === e) && s.render({ force: !0 });
    u != null && u.rendered && (!e || u.mapId === e) && u.render({ force: !0 });
  }
  function E(e) {
    const t = [...p.values()];
    return u && t.push(u), t.filter((s) => (s == null ? void 0 : s.rendered) && s.mapId === e);
  }
  function se(e) {
    var t;
    return e.element instanceof HTMLElement ? e.element : ((t = e.element) == null ? void 0 : t[0]) ?? null;
  }
  function ye(e, t, s) {
    return e.routes.find((i) => i.fromSystemId === t && i.toSystemId === s || i.toSystemId === t && i.fromSystemId === s) ?? null;
  }
  function Ke(e) {
    return oe().filter((t) => t.id !== e).map((t) => t.id);
  }
  function et(e, t) {
    const s = D(e);
    if (!s)
      return I(`Map "${e}" was not found.`), null;
    const i = k(s), n = i.systems.find((V) => V.id === i.currentSystemId), l = i.systems.find((V) => V.id === t);
    if (!l)
      return I(`System "${t}" was not found.`), null;
    if (!n)
      return I("This map does not have a current location yet. Ask the GM to set one first."), null;
    if (n.id === l.id)
      return N(`${l.name} is already the current location.`), null;
    if (i.visibility !== "players" || n.visibility !== "players" || l.visibility !== "players")
      return I("That travel destination is not visible to players."), null;
    const f = ye(i, n.id, l.id);
    if (!f || f.visibility !== "players")
      return I(`No player-visible direct route from ${n.name} to ${l.name}.`), null;
    const C = me();
    if (!C)
      return I("A GM must be online to approve player travel."), null;
    const G = Ke(game.user.id);
    return G.includes(C.id) || G.push(C.id), {
      action: "travel-request",
      requestId: W("travel"),
      mapId: e,
      mapTitle: i.title,
      fromSystemId: n.id,
      fromName: n.name,
      toSystemId: l.id,
      toName: l.name,
      routeId: f.id,
      routeType: f.type,
      travelTime: f.travelTime,
      fuelCost: f.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      voterIds: [...new Set(G)]
    };
  }
  function ze(e, t) {
    const s = et(e, t);
    return s ? (game.socket.emit(A, s), N(`Travel request sent: ${s.fromName} to ${s.toName}.`), s) : null;
  }
  function tt(e) {
    var i, n, l;
    if (!(e != null && e.requestId) || e.requesterId === ((i = game.user) == null ? void 0 : i.id) || !((l = e.voterIds) != null && l.includes((n = game.user) == null ? void 0 : n.id)) || w.has(e.requestId)) return;
    w.add(e.requestId);
    let t = !1;
    const s = (f) => {
      if (t) return;
      t = !0;
      const C = {
        action: "travel-vote",
        requestId: e.requestId,
        mapId: e.mapId,
        userId: game.user.id,
        userName: game.user.name,
        accepted: f
      };
      game.socket.emit(A, C), je(C);
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
  function it(e) {
    if (!pe() || !(e != null && e.requestId)) return;
    const t = globalThis.setTimeout(() => {
      const s = v.get(e.requestId);
      s && Ye(s, "Request timeout");
    }, 6e4);
    v.set(e.requestId, {
      ...e,
      accepted: /* @__PURE__ */ new Set(),
      voterIds: [...new Set(e.voterIds ?? [])],
      timeoutId: t
    });
  }
  function Ve(e) {
    const t = k(D(e.mapId)), s = t.systems.find((n) => n.id === e.fromSystemId), i = t.systems.find((n) => n.id === e.toSystemId);
    !s || !i || E(e.mapId).forEach((n) => {
      var f;
      const l = se(n);
      l && (n.selectedSystemId = i.id, n.selectedRouteId = null, (f = n._animateShipTravel) == null || f.call(n, s, i, l));
    });
  }
  async function nt(e) {
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
    game.socket.emit(A, t), Ve(t), N(`Travel approved: ${e.fromName} to ${e.toName}.`), globalThis.setTimeout(() => c(e.mapId, e.toSystemId), 2400);
  }
  function Ye(e, t = "A player") {
    v.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId);
    const s = {
      action: "travel-declined",
      requestId: e.requestId,
      mapId: e.mapId,
      fromName: e.fromName,
      toName: e.toName,
      voterName: t,
      coordinatorId: game.user.id
    };
    game.socket.emit(A, s), N(`Travel declined by ${t}: ${e.fromName} to ${e.toName}.`);
  }
  function je(e) {
    if (!pe() || !(e != null && e.requestId)) return;
    const t = v.get(e.requestId);
    if (!(!t || !t.voterIds.includes(e.userId))) {
      if (!e.accepted) {
        Ye(t, e.userName);
        return;
      }
      t.accepted.add(e.userId), t.voterIds.every((s) => t.accepted.has(s)) && nt(t);
    }
  }
  function st(e) {
    var t, s;
    e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && w.delete(e.requestId), Ve(e), (s = ui.notifications) == null || s.info(`Travel approved: ${e.fromName} to ${e.toName}.`));
  }
  function at(e) {
    var t, s;
    e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && w.delete(e.requestId), (s = ui.notifications) == null || s.warn(`Travel declined by ${e.voterName}: ${e.fromName} to ${e.toName}.`));
  }
  function rt(e) {
    const t = p.get(e);
    t && t.close(), (u == null ? void 0 : u.mapId) === e && u.close();
  }
  function ge(e, t = {}) {
    var C;
    const s = D(e);
    if (!s)
      return I(`Map "${e}" was not found.`), null;
    const i = t.playerMode ?? !((C = game.user) != null && C.isGM);
    if (i && s.visibility !== "players" && !t.broadcast)
      return I("That galaxy map is not visible to players."), null;
    const n = i ? `player:${e}` : e, l = i && (u == null ? void 0 : u.mapId) === e ? u : p.get(n);
    if (l != null && l.rendered)
      return l.bringToFront(), l;
    const f = new ct({ mapId: e, playerMode: i });
    return i ? u = f : p.set(n, f), f.render({ force: !0 }), f;
  }
  function qe() {
    return T("open the map manager") ? (r || (r = new lt()), r.render({ force: !0 }), r) : null;
  }
  function Re() {
    const e = ue().filter((i) => i.visibility === "players").sort((i, n) => i.title.localeCompare(n.title));
    if (!e.length)
      return N("No galaxy map is currently visible to players."), null;
    if (e.length === 1) return ge(e[0].id, { playerMode: !0 });
    const t = e.map((i) => `
      <button type="button" class="gmf-player-map-choice" data-player-open-map="${S(i.id)}">
        <span class="gmf-player-map-choice__title">${S(i.title)}</span>
        <span class="gmf-player-map-choice__meta">${S(i.subtitle || i.description || "Player-visible galaxy map")}</span>
      </button>
    `).join("");
    let s = null;
    return s = new Dialog({
      title: "Choose Galaxy Map",
      content: `<section class="gmf-player-map-chooser">${t}</section>`,
      render: (i) => {
        const n = Le(i);
        n == null || n.querySelectorAll("[data-player-open-map]").forEach((l) => {
          l.addEventListener("click", () => {
            ge(l.dataset.playerOpenMap, { playerMode: !0 }), s == null || s.close();
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
  function ot() {
    var t;
    const e = ue().sort((s, i) => s.title.localeCompare(i.title));
    return (t = game.user) != null && t.isGM ? e.length === 1 ? ge(e[0].id) : qe() : Re();
  }
  function Ae(e) {
    if (T("broadcast galaxy maps")) {
      if (!D(e)) {
        I(`Map "${e}" was not found.`);
        return;
      }
      game.socket.emit(A, { action: "open", mapId: e }), N("Map broadcast sent to players.");
    }
  }
  function Xe() {
    T("close player galaxy maps") && (game.socket.emit(A, { action: "close" }), N("Close-map signal sent to players."));
  }
  const lt = gt({
    templateRoot: Te,
    getMaps: ue,
    prepareMapForManager: ke,
    getRawMap: D,
    openMapMetadataDialog: Ie,
    openSystemDialog: we,
    openRouteDialog: xe,
    openFactionDialog: de,
    exportMap: O,
    duplicateMap: ne,
    deleteMap: H,
    createMap: Me,
    deleteSystem: a,
    deleteRoute: m,
    deleteFaction: x,
    openMap: ge,
    showMapToPlayers: Ae,
    closePlayerMap: Xe,
    clearManagerApp: (e) => {
      r === e && (r = null);
    }
  }), ct = St({
    templateRoot: Te,
    getRawMap: D,
    prepareMapForDisplay: Ee,
    openSystemDialog: we,
    openRouteDialog: xe,
    openFactionDialog: de,
    openFactionManagerDialog: $e,
    openMapMetadataDialog: Ie,
    revealSystemToPlayers: _,
    revealRouteToPlayers: M,
    deleteSystem: a,
    deleteRoute: m,
    setCurrentSystem: c,
    requestTravelToSystem: ze,
    notifySystemDiscovered: z,
    exportMap: O,
    getTravelRoute: ye,
    notifyInfo: N,
    notifyError: I,
    saveSystemPosition: y,
    showMapToPlayers: Ae,
    openMapManager: qe,
    clearMapView: (e) => {
      e.playerMode && u === e && (u = null);
      for (const [t, s] of p.entries())
        s === e && p.delete(t);
    }
  });
  function dt() {
    const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
    return t != null && t.registerApp ? (t.registerApp({
      id: re,
      title: "Galaxy Map",
      icon: "fa-solid fa-route",
      premium: !1,
      description: "Open cinematic campaign maps and navigation charts.",
      open: () => {
        var s;
        return (s = game.user) != null && s.isGM ? qe() : Re();
      }
    }), !0) : !1;
  }
  Hooks.once("init", async () => {
    game.settings.register(re, Pe, {
      scope: "world",
      config: !1,
      type: Object,
      default: {}
    }), Handlebars.registerHelper("gmfEq", (e, t) => e === t), Handlebars.registerHelper("gmfJson", (e) => JSON.stringify(e, null, 2)), Handlebars.registerHelper("gmfPercent", (e) => `${Number(e).toFixed(3)}%`), Handlebars.registerHelper("gmfFallback", (e, t) => e || t), await loadTemplates([
      `${Te}/map-manager.hbs`,
      `${Te}/galaxy-map.hbs`,
      `${Te}/system-details.hbs`
    ]);
  }), Hooks.once("ready", () => {
    game.galaxyMap = {
      openMap: ge,
      openMapManager: qe,
      openGalaxyMapFromSceneControls: ot,
      openPlayerMapChooser: Re,
      createMap: Me,
      getMaps: ue,
      showMapToPlayers: Ae,
      closePlayerMap: Xe,
      updateMap: L,
      updateMapMetadata: b,
      deleteMap: H,
      duplicateMap: ne,
      upsertSystem: o,
      deleteSystem: a,
      upsertRoute: d,
      deleteRoute: m,
      upsertFaction: g,
      deleteFaction: x,
      saveSystemPosition: y,
      setCurrentSystem: c,
      revealSystemToPlayers: _,
      revealRouteToPlayers: M,
      notifySystemDiscovered: z,
      requestTravelToSystem: ze,
      importMapData: Y,
      exportMap: O
    };
    const e = game.modules.get(re);
    e && (e.api = game.galaxyMap), dt(), game.socket.on(A, (t = {}) => {
      var s, i;
      if (t.action === "travel-request") {
        it(t), tt(t);
        return;
      }
      if (t.action === "travel-vote") {
        je(t);
        return;
      }
      if (t.action === "travel-approved") {
        st(t);
        return;
      }
      if (t.action === "travel-declined") {
        at(t);
        return;
      }
      (s = game.user) != null && s.isGM || (t.action === "open" && t.mapId && (u == null || u.close(), ge(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "close" && (u == null || u.close()), t.action === "refresh" && (u == null ? void 0 : u.mapId) === t.mapId && u.render({ force: !0 }), t.action === "notify" && ((i = ui.notifications) == null || i.info(t.message || "New system discovered."), (u == null ? void 0 : u.mapId) === t.mapId && u.render({ force: !0 })));
    }), console.log(`${re} | Ready. API available at game.galaxyMap.`);
  });
})();
