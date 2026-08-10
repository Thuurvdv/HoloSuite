var yt = Object.defineProperty;
var gt = (a, p, m) => p in a ? yt(a, p, { enumerable: !0, configurable: !0, writable: !0, value: m }) : a[p] = m;
var P = (a, p, m) => gt(a, typeof p != "symbol" ? p + "" : p, m);
const Qe = ["core", "colony", "frontier", "station", "anomaly", "ruins", "restricted", "unknown"], Ke = ["undiscovered", "known", "visited", "danger", "locked"], et = ["safe", "dangerous", "restricted", "smuggler", "unknown"], Me = ["gm", "players"], tt = ["planet", "ringed", "star", "diamond", "void"];
function K(a = "gmf") {
  return `${a}-${foundry.utils.randomID(10)}`;
}
function Fe(a, p = "players") {
  const m = Me.includes(p) ? p : "players";
  return Me.includes(a) ? String(a) : m;
}
function ht(a) {
  return typeof a == "string" && /^#[0-9a-f]{6}$/i.test(a) ? a : "#58d8ff";
}
function St(a) {
  return typeof a == "string" && /^#[0-9a-f]{6}$/i.test(a) ? a : "";
}
function Ie(a, p = 0) {
  const m = Number(a);
  return Number.isFinite(m) ? m : p;
}
function vt(a) {
  const p = Array.isArray(a) ? a : a ? [a] : [];
  return [...new Set(p.map((m) => String(m).trim()).filter(Boolean))];
}
function ne(a, p, m) {
  return Math.min(m, Math.max(p, a));
}
function Ye(a = {}) {
  const p = vt(a.sceneIds === void 0 ? a.sceneId : a.sceneIds);
  return {
    id: String(a.id || K("system")),
    name: String(a.name || "Unnamed System"),
    x: Math.min(100, Math.max(0, Ie(a.x, 50))),
    y: Math.min(100, Math.max(0, Ie(a.y, 50))),
    type: Qe.includes(a.type) ? a.type : "unknown",
    factionId: String(a.factionId || ""),
    status: Ke.includes(a.status) ? a.status : "known",
    description: String(a.description || ""),
    image: String(a.image || ""),
    sceneIds: p,
    journalId: String(a.journalId || ""),
    visibility: Fe(a.visibility, "players"),
    notes: String(a.notes || ""),
    iconColor: St(a.iconColor),
    iconSize: ne(Ie(a.iconSize, 28), 18, 56),
    iconStyle: tt.includes(a.iconStyle) ? a.iconStyle : "planet",
    pulse: a.pulse !== !1
  };
}
function je(a = {}) {
  return {
    id: String(a.id || K("route")),
    fromSystemId: String(a.fromSystemId || ""),
    toSystemId: String(a.toSystemId || ""),
    type: et.includes(a.type) ? a.type : "unknown",
    travelTime: String(a.travelTime || ""),
    fuelCost: Ie(a.fuelCost, 0),
    visibility: Fe(a.visibility, "players"),
    notes: String(a.notes || "")
  };
}
function Xe(a = {}) {
  return {
    id: String(a.id || K("faction")),
    name: String(a.name || "Unaffiliated"),
    color: ht(a.color),
    description: String(a.description || ""),
    visibility: Fe(a.visibility, "players")
  };
}
function _(a = {}) {
  var w;
  const p = Array.isArray(a.systems) ? a.systems.map(Ye) : [], m = Array.isArray(a.routes) ? a.routes.map(je) : [], S = Array.isArray(a.factions) ? a.factions.map(Xe) : [];
  return {
    id: String(a.id || K("map")),
    title: String(a.title || "Untitled Galaxy Map"),
    subtitle: String(a.subtitle || ""),
    description: String(a.description || ""),
    backgroundImage: String(a.backgroundImage || ""),
    visibility: Fe(a.visibility, "players"),
    currentSystemId: String(a.currentSystemId || ((w = p[0]) == null ? void 0 : w.id) || ""),
    systems: p,
    routes: m,
    factions: S
  };
}
function bt() {
  var m, S, w, b;
  const a = (S = (m = foundry.applications) == null ? void 0 : m.api) == null ? void 0 : S.ApplicationV2, p = (b = (w = foundry.applications) == null ? void 0 : w.api) == null ? void 0 : b.HandlebarsApplicationMixin;
  return a && p ? p(a) : Application;
}
function Mt(a) {
  var B;
  const {
    templateRoot: p,
    getMaps: m,
    prepareMapForManager: S,
    getRawMap: w,
    openMapMetadataDialog: b,
    openSystemDialog: M,
    openRouteDialog: I,
    openFactionDialog: E,
    exportMap: ge,
    duplicateMap: de,
    deleteMap: ue,
    createMap: me,
    deleteSystem: C,
    deleteRoute: R,
    deleteFaction: fe,
    openMap: ae,
    showMapToPlayers: L,
    closePlayerMap: we,
    hideSystemFromPlayers: he,
    hideRouteFromPlayers: Se,
    clearManagerApp: pe
  } = a;
  return B = class extends bt() {
    constructor(D = {}) {
      super(D);
      P(this, "selectedMapId");
      P(this, "jsonDraft");
      this.selectedMapId = D.selectedMapId ?? null, this.jsonDraft = "";
    }
    async _prepareContext(D) {
      var Z, l;
      const x = await ((Z = super._prepareContext) == null ? void 0 : Z.call(this, D)) ?? {}, G = m().sort((r, c) => r.title.localeCompare(c.title));
      (!this.selectedMapId || !G.some((r) => r.id === this.selectedMapId)) && (this.selectedMapId = ((l = G[0]) == null ? void 0 : l.id) ?? null);
      const ee = this.selectedMapId ? S(w(this.selectedMapId)) : null;
      return {
        ...x,
        maps: G,
        selectedMap: ee,
        selectedMapId: this.selectedMapId,
        hasMaps: G.length > 0
      };
    }
    _attachPartListeners(D, x, G) {
      var ee, Z, l, r, c, d, y, g;
      (ee = super._attachPartListeners) == null || ee.call(this, D, x, G), (Z = x.querySelector("[data-action='create-map']")) == null || Z.addEventListener("click", () => this._onCreateMap()), (l = x.querySelector("[data-action='edit-map-metadata']")) == null || l.addEventListener("click", () => {
        this.selectedMapId && b(this.selectedMapId);
      }), (r = x.querySelector("[data-action='create-system']")) == null || r.addEventListener("click", () => {
        this.selectedMapId && M(this.selectedMapId);
      }), (c = x.querySelector("[data-action='create-route']")) == null || c.addEventListener("click", () => {
        this.selectedMapId && I(this.selectedMapId);
      }), (d = x.querySelector("[data-action='create-faction']")) == null || d.addEventListener("click", () => {
        this.selectedMapId && E(this.selectedMapId);
      }), x.querySelectorAll("[data-edit-system]").forEach((f) => {
        f.addEventListener("click", () => M(this.selectedMapId, f.dataset.editSystem));
      }), x.querySelectorAll("[data-show-system]").forEach((f) => {
        f.addEventListener("click", () => he(this.selectedMapId, f.dataset.showSystem, !1));
      }), x.querySelectorAll("[data-hide-system]").forEach((f) => {
        f.addEventListener("click", () => he(this.selectedMapId, f.dataset.hideSystem, !0));
      }), x.querySelectorAll("[data-delete-system]").forEach((f) => {
        f.addEventListener("click", () => this._confirmDeleteSystem(f.dataset.deleteSystem));
      }), x.querySelectorAll("[data-edit-route]").forEach((f) => {
        f.addEventListener("click", () => I(this.selectedMapId, f.dataset.editRoute));
      }), x.querySelectorAll("[data-show-route]").forEach((f) => {
        f.addEventListener("click", () => Se(this.selectedMapId, f.dataset.showRoute, !1));
      }), x.querySelectorAll("[data-hide-route]").forEach((f) => {
        f.addEventListener("click", () => Se(this.selectedMapId, f.dataset.hideRoute, !0));
      }), x.querySelectorAll("[data-delete-route]").forEach((f) => {
        f.addEventListener("click", () => this._confirmDeleteRoute(f.dataset.deleteRoute));
      }), x.querySelectorAll("[data-edit-faction]").forEach((f) => {
        f.addEventListener("click", () => E(this.selectedMapId, f.dataset.editFaction));
      }), x.querySelectorAll("[data-delete-faction]").forEach((f) => {
        f.addEventListener("click", () => this._confirmDeleteFaction(f.dataset.deleteFaction));
      }), (y = x.querySelector("[data-action='export-map']")) == null || y.addEventListener("click", () => {
        this.selectedMapId && ge(this.selectedMapId);
      }), x.querySelectorAll("[data-select-map]").forEach((f) => {
        f.addEventListener("click", () => {
          this.selectedMapId = f.dataset.selectMap, this.jsonDraft = "", this.render({ force: !0 });
        });
      }), x.querySelectorAll("[data-open-map]").forEach((f) => {
        f.addEventListener("click", () => ae(f.dataset.openMap));
      }), x.querySelectorAll("[data-show-map]").forEach((f) => {
        f.addEventListener("click", () => L(f.dataset.showMap));
      }), x.querySelectorAll("[data-duplicate-map]").forEach((f) => {
        f.addEventListener("click", async () => {
          const T = await de(f.dataset.duplicateMap);
          T && (this.selectedMapId = T.id, this.jsonDraft = "", this.render({ force: !0 }));
        });
      }), x.querySelectorAll("[data-delete-map]").forEach((f) => {
        f.addEventListener("click", async () => {
          const T = f.dataset.deleteMap, A = w(T);
          await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${(A == null ? void 0 : A.title) ?? T}</strong>? This cannot be undone.</p>`
          }) && (await ue(T), this.selectedMapId === T && (this.selectedMapId = null), this.jsonDraft = "", this.render({ force: !0 }));
        });
      }), (g = x.querySelector("[data-action='close-player-map']")) == null || g.addEventListener("click", () => we());
    }
    async _onCreateMap() {
      const D = await me({
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
      D && (this.selectedMapId = D.id, this.jsonDraft = "", this.render({ force: !0 }));
    }
    async _confirmDeleteSystem(D) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }) && await C(this.selectedMapId, D);
    }
    async _confirmDeleteRoute(D) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }) && await R(this.selectedMapId, D);
    }
    async _confirmDeleteFaction(D) {
      await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }) && await fe(this.selectedMapId, D);
    }
    async close(D = {}) {
      return pe(this), super.close(D);
    }
  }, P(B, "DEFAULT_OPTIONS", {
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
  }), P(B, "PARTS", {
    main: {
      template: `${p}/map-manager.hbs`
    }
  }), B;
}
function It() {
  var m, S, w, b;
  const a = (S = (m = foundry.applications) == null ? void 0 : m.api) == null ? void 0 : S.ApplicationV2, p = (b = (w = foundry.applications) == null ? void 0 : w.api) == null ? void 0 : b.HandlebarsApplicationMixin;
  return a && p ? p(a) : Application;
}
function wt(a) {
  var G;
  const {
    templateRoot: p,
    getRawMap: m,
    prepareMapForDisplay: S,
    openSystemDialog: w,
    openRouteDialog: b,
    openFactionDialog: M,
    openFactionManagerDialog: I,
    openMapMetadataDialog: E,
    revealSystemToPlayers: ge,
    revealRouteToPlayers: de,
    hideSystemFromPlayers: ue,
    hideRouteFromPlayers: me,
    deleteSystem: C,
    deleteRoute: R,
    setCurrentSystem: fe,
    requestTravelToSystem: ae,
    notifySystemDiscovered: L,
    exportMap: we,
    getTravelRoute: he,
    broadcastTravelAnimation: Se,
    notifyInfo: pe,
    notifyError: B,
    saveSystemPosition: xe,
    showMapToPlayers: $e,
    openMapManager: D,
    clearMapView: x
  } = a;
  return G = class extends It() {
    constructor(l = {}) {
      var d;
      const r = l.mapId, c = l.playerMode ?? !((d = game.user) != null && d.isGM);
      super({
        ...l,
        id: `galaxy-map-view-${c ? "player" : "gm"}-${r}`
      });
      P(this, "mapId");
      P(this, "playerMode");
      P(this, "selectedSystemId");
      P(this, "selectedRouteId");
      P(this, "zoom");
      P(this, "panX");
      P(this, "panY");
      P(this, "_drag");
      P(this, "_contextTarget");
      P(this, "_boundContextClose");
      this.mapId = r, this.playerMode = c, this.selectedSystemId = l.selectedSystemId ?? null, this.selectedRouteId = l.selectedRouteId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null;
    }
    get title() {
      const l = m(this.mapId), r = this.playerMode ? "Player View" : "GM View";
      return l ? `${l.title} - ${r}` : `Galaxy Map - ${r}`;
    }
    async _prepareContext(l) {
      var y;
      const r = await ((y = super._prepareContext) == null ? void 0 : y.call(this, l)) ?? {}, c = m(this.mapId), d = c ? S(c, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      }) : null;
      return d != null && d.selectedSystem && (this.selectedSystemId = d.selectedSystem.id), {
        ...r,
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
    _onRender(l, r) {
      var d, y;
      (d = super._onRender) == null || d.call(this, l, r);
      const c = this.element instanceof HTMLElement ? this.element : (y = this.element) == null ? void 0 : y[0];
      c && this._attachPartListeners("main", c, r);
    }
    _attachPartListeners(l, r, c) {
      var g, f, T, A, $, X, z, Y, J, te, ie, Te, Ee, ke, ye, _e, Ce, re, Le, De, F;
      const d = (g = r.matches) != null && g.call(r, ".gmf-map-stage") ? r : (f = r.querySelector) == null ? void 0 : f.call(r, ".gmf-map-stage");
      if ((d == null ? void 0 : d.dataset.gmfMapBound) === "true") return;
      d && (d.dataset.gmfMapBound = "true"), (T = super._attachPartListeners) == null || T.call(this, l, r, c), this._applyViewportTransform(r), r.querySelectorAll("[data-system-id]").forEach((q) => {
        var oe;
        q.addEventListener("click", (se) => {
          if (q.dataset.dragged === "true") {
            q.dataset.dragged = "false";
            return;
          }
          se.stopPropagation(), this.selectedSystemId = q.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
        }), !this.playerMode && ((oe = game.user) != null && oe.isGM) && q.addEventListener("pointerdown", (se) => this._startSystemDrag(se, r, q));
      }), r.querySelectorAll("[data-route-id]").forEach((q) => {
        q.addEventListener("click", (oe) => {
          var se;
          if (oe.stopPropagation(), !this.playerMode && ((se = game.user) != null && se.isGM)) {
            b(this.mapId, q.dataset.routeId);
            return;
          }
          this.selectedRouteId = q.dataset.routeId, this.selectedSystemId = null, this.render({ force: !0 });
        });
      });
      const y = r.querySelector(".gmf-map-stage");
      y == null || y.addEventListener("wheel", (q) => this._onWheelZoom(q, r), { passive: !1 }), y == null || y.addEventListener("pointerdown", (q) => this._startPan(q, r)), y == null || y.addEventListener("contextmenu", (q) => this._openContextMenu(q, r), { capture: !0 }), r.querySelectorAll("[data-context-action]").forEach((q) => {
        q.addEventListener("click", (oe) => this._handleContextAction(oe, r));
      }), (A = r.querySelector("[data-action='open-map-menu']")) == null || A.addEventListener("click", (q) => this._openStageMenuFromButton(q, r)), ($ = r.querySelector("[data-action='zoom-in']")) == null || $.addEventListener("click", () => this._setZoom(this.zoom + 0.15, r)), (X = r.querySelector("[data-action='zoom-out']")) == null || X.addEventListener("click", () => this._setZoom(this.zoom - 0.15, r)), (z = r.querySelector("[data-action='reset-view']")) == null || z.addEventListener("click", () => {
        this.zoom = 1, this.panX = 0, this.panY = 0, this._applyViewportTransform(r);
      }), (Y = r.querySelector("[data-action='open-journal']")) == null || Y.addEventListener("click", () => this._openLinkedJournal()), (J = r.querySelector("[data-action='edit-system']")) == null || J.addEventListener("click", () => {
        this.selectedSystemId && w(this.mapId, this.selectedSystemId);
      }), (te = r.querySelector("[data-action='reveal-system']")) == null || te.addEventListener("click", () => {
        this.selectedSystemId && ge(this.mapId, this.selectedSystemId);
      }), (ie = r.querySelector("[data-action='hide-system']")) == null || ie.addEventListener("click", () => {
        this.selectedSystemId && ue(this.mapId, this.selectedSystemId, !0);
      }), (Te = r.querySelector("[data-action='delete-system']")) == null || Te.addEventListener("click", () => {
        this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), (Ee = r.querySelector("[data-action='set-current-system']")) == null || Ee.addEventListener("click", () => {
        this.selectedSystemId && fe(this.mapId, this.selectedSystemId);
      }), (ke = r.querySelector("[data-action='travel-to-system']")) == null || ke.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? ae(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, r));
      }), (ye = r.querySelector("[data-action='edit-route']")) == null || ye.addEventListener("click", () => {
        this.selectedRouteId && b(this.mapId, this.selectedRouteId);
      }), (_e = r.querySelector("[data-action='reveal-route']")) == null || _e.addEventListener("click", () => {
        this.selectedRouteId && de(this.mapId, this.selectedRouteId);
      }), (Ce = r.querySelector("[data-action='hide-route']")) == null || Ce.addEventListener("click", () => {
        this.selectedRouteId && me(this.mapId, this.selectedRouteId, !0);
      }), (re = r.querySelector("[data-action='delete-route']")) == null || re.addEventListener("click", () => {
        this.selectedRouteId && this._confirmDeleteRoute(this.selectedRouteId);
      }), (Le = r.querySelector("[data-action='notify-discovery']")) == null || Le.addEventListener("click", () => {
        this.selectedSystemId && L(this.mapId, this.selectedSystemId);
      }), (De = r.querySelector("[data-action='show-to-players']")) == null || De.addEventListener("click", () => $e(this.mapId)), (F = r.querySelector("[data-action='edit-map']")) == null || F.addEventListener("click", () => {
        const q = D();
        q && (q.selectedMapId = this.mapId, q.render({ force: !0 }));
      });
    }
    _applyViewportTransform(l) {
      var c;
      const r = l.querySelector(".gmf-map-viewport");
      r && (r.style.setProperty("--gmf-pan-x", `${this.panX}px`), r.style.setProperty("--gmf-pan-y", `${this.panY}px`), r.style.setProperty("--gmf-zoom", String(this.zoom)), (c = l.querySelector("[data-zoom-label]")) == null || c.replaceChildren(`${Math.round(this.zoom * 100)}%`));
    }
    _setZoom(l, r) {
      this.zoom = ne(l, 0.55, 2.6), this._applyViewportTransform(r);
    }
    _onWheelZoom(l, r) {
      l.preventDefault();
      const c = r.querySelector(".gmf-map-stage");
      if (!c) return;
      const d = c.getBoundingClientRect(), y = this.zoom, g = ne(y + (l.deltaY < 0 ? 0.12 : -0.12), 0.55, 2.6), f = l.clientX - d.left, T = l.clientY - d.top, A = (f - this.panX) / y, $ = (T - this.panY) / y;
      this.zoom = g, this.panX = f - A * g, this.panY = T - $ * g, this._applyViewportTransform(r);
    }
    _startPan(l, r) {
      if (l.button !== 0 || l.target.closest("[data-system-id], [data-route-id], button")) return;
      l.preventDefault();
      const c = l.clientX, d = l.clientY, y = this.panX, g = this.panY, f = (A) => {
        this.panX = y + A.clientX - c, this.panY = g + A.clientY - d, this._applyViewportTransform(r);
      }, T = () => {
        window.removeEventListener("pointermove", f), window.removeEventListener("pointerup", T);
      };
      window.addEventListener("pointermove", f), window.addEventListener("pointerup", T, { once: !0 });
    }
    _startSystemDrag(l, r, c) {
      var Y;
      if (l.button !== 0) return;
      l.preventDefault(), l.stopPropagation(), (Y = c.setPointerCapture) == null || Y.call(c, l.pointerId);
      const d = l.clientX, y = l.clientY;
      let g = this._pointerToMapPercent(l, r), f = !1, T = null;
      const A = Array.from(r.querySelectorAll(`[data-route-from="${c.dataset.systemId}"]`)), $ = Array.from(r.querySelectorAll(`[data-route-to="${c.dataset.systemId}"]`));
      c.classList.add("is-dragging");
      const X = (J) => {
        const te = Math.abs(J.clientX - d), ie = Math.abs(J.clientY - y);
        f = f || te > 3 || ie > 3, g = this._pointerToMapPercent(J, r), c.dataset.dragged = f ? "true" : "false", !T && (T = requestAnimationFrame(() => {
          T = null, c.style.left = `${g.x}%`, c.style.top = `${g.y}%`, this._updateConnectedRoutes(A, $, g.x, g.y);
        }));
      }, z = async () => {
        T && cancelAnimationFrame(T), c.style.left = `${g.x}%`, c.style.top = `${g.y}%`, this._updateConnectedRoutes(A, $, g.x, g.y), c.classList.remove("is-dragging"), window.removeEventListener("pointermove", X), window.removeEventListener("pointerup", z), f && await xe(this.mapId, c.dataset.systemId, g.x, g.y);
      };
      window.addEventListener("pointermove", X), window.addEventListener("pointerup", z, { once: !0 });
    }
    _pointerToMapPercent(l, r) {
      const d = r.querySelector(".gmf-map-stage").getBoundingClientRect();
      return {
        x: ne((l.clientX - d.left - this.panX) / this.zoom / d.width * 100, 0, 100),
        y: ne((l.clientY - d.top - this.panY) / this.zoom / d.height * 100, 0, 100)
      };
    }
    _updateConnectedRoutes(l, r, c, d) {
      l.forEach((y) => {
        y.setAttribute("x1", c), y.setAttribute("y1", d);
      }), r.forEach((y) => {
        y.setAttribute("x2", c), y.setAttribute("y2", d);
      });
    }
    _openContextMenu(l, r) {
      var te;
      if (!((te = game.user) != null && te.isGM) || this.playerMode || l.target.closest(".gmf-map-toolbar, .gmf-context-menu")) return;
      l.preventDefault(), l.stopPropagation();
      const c = l.target.closest("[data-route-id]"), d = l.target.closest("[data-system-id]"), y = this._pointerToMapPercent(l, r);
      this._contextTarget = c ? { type: "route", id: c.dataset.routeId, position: y } : d ? { type: "system", id: d.dataset.systemId, position: y } : { type: "stage", id: null, position: y };
      const g = r.querySelector("[data-gmf-context-menu]");
      if (!g) return;
      g.querySelectorAll("[data-context-show]").forEach((ie) => {
        ie.hidden = ie.dataset.contextShow !== this._contextTarget.type;
      }), g.hidden = !1;
      const f = g.offsetWidth || 184, T = g.offsetHeight || 260, $ = r.querySelector(".gmf-map-stage").getBoundingClientRect(), X = l.clientX - $.left, z = l.clientY - $.top, Y = Math.max(4, $.width - f - 4), J = Math.max(4, $.height - T - 4);
      g.style.left = `${ne(X, 4, Y)}px`, g.style.top = `${ne(z, 4, J)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(r), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _openStageMenuFromButton(l, r) {
      var g;
      if (!((g = game.user) != null && g.isGM) || this.playerMode) return;
      l.preventDefault(), l.stopPropagation();
      const c = r.querySelector(".gmf-map-stage"), d = c == null ? void 0 : c.getBoundingClientRect();
      if (!d) return;
      const y = {
        clientX: d.left + d.width / 2,
        clientY: d.top + d.height / 2,
        target: c,
        preventDefault: () => {
        },
        stopPropagation: () => {
        }
      };
      this._openContextMenu(y, r);
    }
    _hideContextMenu(l = null) {
      var d, y, g;
      const r = l ?? this.element ?? null, c = ((d = r == null ? void 0 : r.querySelector) == null ? void 0 : d.call(r, "[data-gmf-context-menu]")) ?? ((g = (y = r == null ? void 0 : r[0]) == null ? void 0 : y.querySelector) == null ? void 0 : g.call(y, "[data-gmf-context-menu]"));
      c && (c.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(l, r) {
      l.preventDefault(), l.stopPropagation();
      const c = l.currentTarget.dataset.contextAction, d = this._contextTarget;
      this._hideContextMenu(r), d && (c === "add-system" ? w(this.mapId, null, { x: d.position.x, y: d.position.y }) : c === "add-route" ? b(this.mapId) : c === "manage-factions" ? I(this.mapId) : c === "add-faction" ? M(this.mapId) : c === "edit-map-details" ? E(this.mapId) : c === "export-map" ? we(this.mapId) : c === "edit-system" ? w(this.mapId, d.id) : c === "add-route-from-system" ? b(this.mapId, null, { fromSystemId: d.id }) : c === "reveal-system" ? await ge(this.mapId, d.id) : c === "hide-system" ? await ue(this.mapId, d.id, !0) : c === "delete-system" ? await this._confirmDeleteSystem(d.id) : c === "edit-route" ? b(this.mapId, d.id) : c === "reveal-route" ? await de(this.mapId, d.id) : c === "hide-route" ? await me(this.mapId, d.id, !0) : c === "delete-route" && await this._confirmDeleteRoute(d.id));
    }
    async _confirmDeleteSystem(l) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }) && await C(this.mapId, l);
    }
    async _confirmDeleteRoute(l) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }) && await R(this.mapId, l);
    }
    async _travelToSystem(l, r) {
      const c = _(m(this.mapId)), d = c.systems.find((f) => f.id === c.currentSystemId), y = c.systems.find((f) => f.id === l);
      if (!y) return;
      if (!d) {
        await fe(this.mapId, y.id), pe(`Current location set to ${y.name}.`);
        return;
      }
      if (d.id === y.id) {
        pe(`${y.name} is already the current location.`);
        return;
      }
      if (!he(c, d.id, y.id)) {
        B(`No direct route from ${d.name} to ${y.name}.`);
        return;
      }
      Se(this.mapId, d.id, y.id), await this._animateShipTravel(d, y, r), await fe(this.mapId, y.id), pe(`Arrived at ${y.name}.`);
    }
    _animateShipTravel(l, r, c) {
      const d = c.querySelector("[data-ship-layer]"), y = c.querySelector(".gmf-map-stage");
      if (!d || !y) return Promise.resolve();
      const g = y.getBoundingClientRect(), f = (r.x - l.x) * g.width / 100, T = (r.y - l.y) * g.height / 100, A = Math.atan2(T, f) * 180 / Math.PI, $ = document.createElement("div");
      return $.className = "gmf-travel-ship", $.innerHTML = '<i class="fa-solid fa-rocket"></i>', $.style.left = `${l.x}%`, $.style.top = `${l.y}%`, $.style.setProperty("--gmf-ship-angle", `${A}deg`), d.replaceChildren($), new Promise((X) => {
        let z = !1;
        const Y = () => {
          z || (z = !0, $.removeEventListener("transitionend", Y), $.classList.add("is-arrived"), globalThis.setTimeout(() => {
            $.remove(), X();
          }, 260));
        };
        $.addEventListener("transitionend", Y, { once: !0 }), requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            $.style.left = `${r.x}%`, $.style.top = `${r.y}%`;
          });
        }), globalThis.setTimeout(Y, 2400);
      });
    }
    _openLinkedJournal() {
      var c, d;
      const l = this._getSelectedRawSystem();
      if (!(l != null && l.journalId)) return;
      const r = (c = game.journal) == null ? void 0 : c.get(l.journalId);
      if (!r) {
        B(`Journal "${l.journalId}" was not found.`);
        return;
      }
      (d = r.sheet) == null || d.render(!0);
    }
    _getSelectedRawSystem() {
      var r;
      const l = m(this.mapId);
      return ((r = l == null ? void 0 : l.systems) == null ? void 0 : r.find((c) => c.id === this.selectedSystemId)) ?? null;
    }
    async close(l = {}) {
      return this._hideContextMenu(), x(this), super.close(l);
    }
  }, P(G, "DEFAULT_OPTIONS", {
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
  }), P(G, "PARTS", {
    main: {
      template: `${p}/galaxy-map.hbs`
    }
  }), G;
}
const ce = "galaxy-map", Ve = "maps", N = `module.${ce}`, qe = `modules/${ce}/templates`;
function xt(a) {
  return String(a || "galaxy-map").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "galaxy-map";
}
function $t(a, p) {
  const m = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" }), S = URL.createObjectURL(m), w = document.createElement("a");
  w.href = S, w.download = a, document.body.appendChild(w), w.click(), w.remove(), URL.revokeObjectURL(S);
}
function h(a) {
  const p = document.createElement("div");
  return p.textContent = String(a ?? ""), p.innerHTML;
}
function H(a, p) {
  return a.map((m) => {
    const S = typeof m == "string" ? m : m.value, w = typeof m == "string" ? m : m.label;
    return `<option value="${h(S)}" ${S === p ? "selected" : ""}>${h(w)}</option>`;
  }).join("");
}
function Tt(a, p) {
  const m = (a == null ? void 0 : a.contents) ?? [];
  return [
    { value: "", label: "None" },
    ...m.map((S) => ({ value: S.id, label: S.name }))
  ].map((S) => `<option value="${h(S.value)}" ${S.value === p ? "selected" : ""}>${h(S.label)}</option>`).join("");
}
function Et(a, p, m) {
  const S = (a == null ? void 0 : a.contents) ?? [], w = new Set(Array.isArray(p) ? p.map(String) : p ? [String(p)] : []), b = new Set(S.map((I) => String(I.id))), M = [
    ...S.map((I) => ({ value: String(I.id), label: String(I.name || I.id), missing: !1 })),
    ...[...w].filter((I) => !b.has(I)).map((I) => ({ value: I, label: `Missing scene (${I})`, missing: !0 }))
  ];
  return M.length ? M.map((I) => `
    <label class="gmf-scene-picker__option ${I.missing ? "is-missing" : ""}">
      <input type="checkbox" name="${h(m)}" value="${h(I.value)}" ${w.has(I.value) ? "checked" : ""} />
      <span>${h(I.label)}</span>
    </label>
  `).join("") : '<p class="gmf-scene-picker__empty">No scenes exist in this world yet.</p>';
}
function Ne(a) {
  return (a == null ? void 0 : a[0]) ?? a ?? null;
}
function kt(a) {
  var w;
  const p = Ne(a), m = (w = p == null ? void 0 : p.matches) != null && w.call(p, "form") ? p : p == null ? void 0 : p.querySelector("form"), S = {};
  for (const [b, M] of new FormData(m).entries())
    S[b] === void 0 ? S[b] = M : Array.isArray(S[b]) ? S[b].push(M) : S[b] = [S[b], M];
  return S;
}
(() => {
  let a = null;
  const p = /* @__PURE__ */ new Map();
  let m = null;
  const S = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Set();
  function b(e) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? {}));
  }
  function M(e) {
    var t;
    (t = ui.notifications) == null || t.error(`[Galaxy Map] ${e}`);
  }
  function I(e) {
    var t;
    (t = ui.notifications) == null || t.info(`[Galaxy Map] ${e}`);
  }
  function E(e = "change galaxy maps") {
    var t;
    return (t = game.user) != null && t.isGM ? !0 : (M(`Only a GM can ${e}.`), !1);
  }
  function ge() {
    var e;
    return ((e = game.users) == null ? void 0 : e.contents) ?? Array.from(game.users ?? []);
  }
  function de() {
    return ge().filter((e) => e.active);
  }
  function ue() {
    return de().filter((e) => e.isGM).sort((e, t) => String(e.id).localeCompare(String(t.id)))[0] ?? null;
  }
  function me() {
    var e, t;
    return !!((e = game.user) != null && e.isGM && ((t = ue()) == null ? void 0 : t.id) === game.user.id);
  }
  function C() {
    return b(game.settings.get(ce, Ve) ?? {});
  }
  async function R(e) {
    return E("save galaxy map data") && await game.settings.set(ce, Ve, e ?? {}), e;
  }
  function fe(e) {
    const t = Ne(e);
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
          callback: (o) => i(kt(o))
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
  function L(e) {
    const t = C();
    return t[e] ? b(t[e]) : null;
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
  function pe(e, { playerMode: t = !1, selectedSystemId: n = null, selectedRouteId: i = null } = {}) {
    var Je, We;
    const s = _(e), o = t ? s.systems.filter(he) : s.systems, u = new Set(o.map((v) => v.id)), k = t ? s.factions.filter((v) => v.visibility === "players") : s.factions, O = we(k), V = o.map((v) => {
      const U = O.get(v.factionId), Q = Se(v, t);
      return {
        ...v,
        displayName: Q ? "???" : v.name,
        displayDescription: Q ? "Unresolved sensor contact. Details are not available." : v.description,
        displayType: Q ? "unknown" : v.type,
        displayStatus: Q ? "undiscovered" : v.status,
        factionName: (U == null ? void 0 : U.name) ?? "Unaffiliated",
        factionColor: v.iconColor || (U == null ? void 0 : U.color) || "#58d8ff",
        obscured: Q,
        isCurrent: v.id === s.currentSystemId,
        isSelected: v.id === n,
        gmOnly: v.visibility === "gm"
      };
    }), be = s.routes.filter((v) => !t || v.visibility === "players").filter((v) => u.has(v.fromSystemId) && u.has(v.toSystemId)).map((v) => {
      const U = V.find((ze) => ze.id === v.fromSystemId), Q = V.find((ze) => ze.id === v.toSystemId);
      return {
        ...v,
        from: U,
        to: Q,
        fromName: (U == null ? void 0 : U.displayName) ?? v.fromSystemId,
        toName: (Q == null ? void 0 : Q.displayName) ?? v.toSystemId,
        isSelected: v.id === i,
        connectsCurrent: v.fromSystemId === s.currentSystemId || v.toSystemId === s.currentSystemId,
        gmOnly: v.visibility === "gm"
      };
    }), W = be.find((v) => v.id === i) ?? null, j = W ? null : V.find((v) => v.id === n) ?? V[0] ?? null;
    j && (j.isSelected = !0);
    const le = V.find((v) => v.id === s.currentSystemId) ?? V[0] ?? null, Ae = j && le && j.id !== le.id ? be.find((v) => v.fromSystemId === le.id && v.toSystemId === j.id || v.toSystemId === le.id && v.fromSystemId === j.id) : null;
    return j && (j.canTravel = !!Ae, j.travelRouteId = (Ae == null ? void 0 : Ae.id) ?? "", j.isCurrent = j.id === (le == null ? void 0 : le.id)), {
      ...s,
      systems: V,
      routes: be,
      factions: k,
      selectedSystem: j,
      selectedRoute: W,
      currentSystem: le,
      selectedType: W ? "route" : "system",
      playerMode: t,
      isGM: ((Je = game.user) == null ? void 0 : Je.isGM) ?? !1,
      canEdit: ((We = game.user) == null ? void 0 : We.isGM) && !t
    };
  }
  async function B(e = {}) {
    if (!E("create galaxy maps")) return null;
    const t = C(), n = _(e);
    return t[n.id] = n, await R(t), F(n.id), b(n);
  }
  async function xe(e, t = {}) {
    if (!E("update galaxy maps")) return null;
    const n = C();
    if (!n[e])
      return M(`Map "${e}" was not found.`), null;
    const i = _({ ...t, id: e });
    return n[e] = i, await R(n), F(e), b(i);
  }
  async function $e(e, t = {}) {
    if (!E("update galaxy map metadata")) return null;
    const n = L(e);
    return n ? xe(e, {
      ...n,
      title: t.title,
      subtitle: t.subtitle,
      description: t.description,
      backgroundImage: t.backgroundImage,
      visibility: t.visibility
    }) : (M(`Map "${e}" was not found.`), null);
  }
  async function D(e) {
    if (!E("delete galaxy maps")) return !1;
    const t = C();
    return t[e] ? (delete t[e], await R(t), dt(e), F(), !0) : !1;
  }
  async function x(e) {
    if (!E("duplicate galaxy maps")) return null;
    const t = L(e);
    if (!t)
      return M(`Map "${e}" was not found.`), null;
    const n = _({
      ...t,
      id: K("map"),
      title: `${t.title} Copy`
    }), i = C();
    return i[n.id] = n, await R(i), F(n.id), b(n);
  }
  async function G(e, t = {}) {
    if (!E("save star systems")) return null;
    const n = C(), i = n[e];
    if (!i)
      return M(`Map "${e}" was not found.`), null;
    const s = Ye(t), o = i.systems.findIndex((u) => u.id === s.id);
    return o >= 0 ? i.systems[o] = s : i.systems.push(s), n[e] = _(i), await R(n), F(e), game.socket.emit(N, { action: "refresh", mapId: e }), b(s);
  }
  async function ee(e, t) {
    var s;
    if (!E("delete star systems")) return !1;
    const n = C(), i = n[e];
    return i ? (i.systems = i.systems.filter((o) => o.id !== t), i.routes = i.routes.filter((o) => o.fromSystemId !== t && o.toSystemId !== t), i.currentSystemId === t && (i.currentSystemId = ((s = i.systems[0]) == null ? void 0 : s.id) ?? ""), n[e] = _(i), await R(n), F(e), game.socket.emit(N, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function Z(e, t) {
    var o;
    if (!E("set current location")) return null;
    const n = C(), i = n[e], s = (o = i == null ? void 0 : i.systems) == null ? void 0 : o.find((u) => u.id === t);
    return s ? (i.currentSystemId = t, n[e] = _(i), await R(n), F(e), game.socket.emit(N, { action: "refresh", mapId: e }), b(s)) : (M(`System "${t}" was not found.`), null);
  }
  async function l(e, t = {}) {
    if (!E("save routes")) return null;
    const n = C(), i = n[e];
    if (!i)
      return M(`Map "${e}" was not found.`), null;
    const s = je(t);
    if (!s.fromSystemId || !s.toSystemId || s.fromSystemId === s.toSystemId)
      return M("Routes require two different systems."), null;
    const o = i.routes.findIndex((u) => u.id === s.id);
    return o >= 0 ? i.routes[o] = s : i.routes.push(s), n[e] = _(i), await R(n), F(e), game.socket.emit(N, { action: "refresh", mapId: e }), b(s);
  }
  async function r(e, t) {
    if (!E("delete routes")) return !1;
    const n = C(), i = n[e];
    return i ? (i.routes = i.routes.filter((s) => s.id !== t), n[e] = _(i), await R(n), F(e), game.socket.emit(N, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function c(e, t = {}) {
    if (!E("save factions")) return null;
    const n = C(), i = n[e];
    if (!i)
      return M(`Map "${e}" was not found.`), null;
    const s = Xe(t), o = i.factions.findIndex((u) => u.id === s.id);
    return o >= 0 ? i.factions[o] = s : i.factions.push(s), n[e] = _(i), await R(n), F(e), game.socket.emit(N, { action: "refresh", mapId: e }), b(s);
  }
  async function d(e, t) {
    if (!E("delete factions")) return !1;
    const n = C(), i = n[e];
    if (!i) return !1;
    i.factions = i.factions.filter((s) => s.id !== t);
    for (const s of i.systems)
      s.factionId === t && (s.factionId = "");
    return n[e] = _(i), await R(n), F(e), game.socket.emit(N, { action: "refresh", mapId: e }), !0;
  }
  async function y(e, t, n, i) {
    var k;
    if (!E("move star systems")) return null;
    const s = C(), o = s[e], u = (k = o == null ? void 0 : o.systems) == null ? void 0 : k.find((O) => O.id === t);
    return u ? (u.x = ne(Ie(n, u.x), 0, 100), u.y = ne(Ie(i, u.y), 0, 100), s[e] = _(o), await R(s), game.socket.emit(N, { action: "refresh", mapId: e }), b(u)) : (M(`System "${t}" was not found.`), null);
  }
  async function g(e, t, { notify: n = !0 } = {}) {
    var u;
    if (!E("reveal star systems")) return null;
    const i = C(), s = i[e], o = (u = s == null ? void 0 : s.systems) == null ? void 0 : u.find((k) => k.id === t);
    return o ? (o.visibility = "players", (o.status === "undiscovered" || o.status === "locked") && (o.status = "known"), i[e] = _(s), await R(i), F(e), game.socket.emit(N, { action: "refresh", mapId: e }), n && $(e, o.id), I(`${o.name} revealed to players.`), b(o)) : (M(`System "${t}" was not found.`), null);
  }
  async function f(e, t, n = !0) {
    var u;
    if (!E(n ? "hide star systems" : "reveal star systems")) return null;
    const i = C(), s = i[e], o = (u = s == null ? void 0 : s.systems) == null ? void 0 : u.find((k) => k.id === t);
    return o ? (o.visibility = n ? "gm" : "players", i[e] = _(s), await R(i), F(e), game.socket.emit(N, { action: "refresh", mapId: e }), I(`${o.name} ${n ? "hidden from" : "visible to"} players.`), b(o)) : (M(`System "${t}" was not found.`), null);
  }
  async function T(e, t) {
    var o;
    if (!E("reveal routes")) return null;
    const n = C(), i = n[e], s = (o = i == null ? void 0 : i.routes) == null ? void 0 : o.find((u) => u.id === t);
    return s ? (s.visibility = "players", n[e] = _(i), await R(n), F(e), game.socket.emit(N, { action: "refresh", mapId: e }), I("Route revealed to players."), b(s)) : (M(`Route "${t}" was not found.`), null);
  }
  async function A(e, t, n = !0) {
    var u;
    if (!E(n ? "hide routes" : "reveal routes")) return null;
    const i = C(), s = i[e], o = (u = s == null ? void 0 : s.routes) == null ? void 0 : u.find((k) => k.id === t);
    return o ? (o.visibility = n ? "gm" : "players", i[e] = _(s), await R(i), F(e), game.socket.emit(N, { action: "refresh", mapId: e }), I(`Route ${n ? "hidden from" : "visible to"} players.`), b(o)) : (M(`Route "${t}" was not found.`), null);
  }
  function $(e, t) {
    var s;
    if (!E("notify players about discoveries")) return;
    const n = L(e), i = (s = n == null ? void 0 : n.systems) == null ? void 0 : s.find((o) => o.id === t);
    if (!i) {
      M(`System "${t}" was not found.`);
      return;
    }
    game.socket.emit(N, {
      action: "notify",
      mapId: e,
      systemId: t,
      message: `New System Discovered: ${i.name}`
    }), I(`Discovery notification sent: ${i.name}.`);
  }
  async function X(e, { replace: t = !1 } = {}) {
    if (!E("import galaxy maps")) return null;
    const n = C();
    let i = _(e);
    return n[i.id] && !t && (i = _({
      ...i,
      id: K("map"),
      title: `${i.title} Import`
    })), n[i.id] = i, await R(n), F(i.id), I(`Imported ${i.title}.`), b(i);
  }
  function z(e) {
    const t = L(e);
    if (!t) {
      M(`Map "${e}" was not found.`);
      return;
    }
    $t(`${xt(t.title)}.json`, _(t));
  }
  function Y(e, t = {}, n = {}) {
    const i = L(e), s = Ye({ ...n, ...t }), o = [
      { value: "", label: "Unaffiliated" },
      ...((i == null ? void 0 : i.factions) ?? []).map((O) => ({ value: O.id, label: O.name }))
    ], u = ((i == null ? void 0 : i.factions) ?? []).find((O) => O.id === s.factionId), k = s.iconColor || (u == null ? void 0 : u.color) || "#58d8ff";
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${h(s.id)}" />
        <input type="hidden" name="x" value="${h(s.x)}" />
        <input type="hidden" name="y" value="${h(s.y)}" />
        <label>Name <input type="text" name="name" value="${h(s.name)}" /></label>
        <div class="gmf-form-grid">
          <label>Type <select name="type">${H(Qe, s.type)}</select></label>
          <label>Status <select name="status">${H(Ke, s.status)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Faction <select name="factionId">${H(o, s.factionId)}</select></label>
          <label>Visibility <select name="visibility">${H(Me, s.visibility)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Icon Style <select name="iconStyle">${H(tt, s.iconStyle)}</select></label>
          <label>Icon Size <input type="range" name="iconSize" value="${h(s.iconSize)}" min="18" max="56" step="1" /></label>
        </div>
        <div class="gmf-form-grid">
          <label>Icon Color <input type="color" name="iconColor" value="${h(k)}" /></label>
          <label class="gmf-checkbox-label"><input type="checkbox" name="pulse" value="true" ${s.pulse ? "checked" : ""} /> Pulse Glow</label>
        </div>
        <label>Description <textarea name="description">${h(s.description)}</textarea></label>
        <label>Image Path
          <div class="gmf-path-field">
            <input type="text" name="image" value="${h(s.image)}" />
            <button type="button" data-browse-target="image"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
        <fieldset class="gmf-scene-picker">
          <legend>System Scenes</legend>
          <p class="gmf-scene-picker__hint">Tag every Foundry scene that belongs to this system.</p>
          <div class="gmf-scene-picker__options">
            ${Et(game.scenes, s.sceneIds, "sceneIds")}
          </div>
        </fieldset>
        <label>Journal <select name="journalId">${Tt(game.journal, s.journalId)}</select></label>
        <label>GM Notes <textarea name="notes">${h(s.notes)}</textarea></label>
      </form>
    `;
  }
  function J(e, t = {}, n = {}) {
    var O, V, be;
    const i = L(e), s = { ...n, ...t }, o = (i == null ? void 0 : i.systems) ?? [];
    s.fromSystemId || (s.fromSystemId = ((O = o[0]) == null ? void 0 : O.id) ?? ""), s.toSystemId || (s.toSystemId = ((V = o.find((W) => W.id !== s.fromSystemId)) == null ? void 0 : V.id) ?? ""), s.fromSystemId && !s.toSystemId && (s.toSystemId = ((be = o.find((W) => W.id !== s.fromSystemId)) == null ? void 0 : be.id) ?? "");
    const u = je(s), k = o.map((W) => ({ value: W.id, label: W.name }));
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${h(u.id)}" />
        <div class="gmf-form-grid">
          <label>From <select name="fromSystemId">${H(k, u.fromSystemId)}</select></label>
          <label>To <select name="toSystemId">${H(k, u.toSystemId)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Type <select name="type">${H(et, u.type)}</select></label>
          <label>Visibility <select name="visibility">${H(Me, u.visibility)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Travel Time <input type="text" name="travelTime" value="${h(u.travelTime)}" /></label>
          <label>Fuel Cost <input type="number" name="fuelCost" value="${h(u.fuelCost)}" min="0" step="1" /></label>
        </div>
        <label>Notes <textarea name="notes">${h(u.notes)}</textarea></label>
      </form>
    `;
  }
  function te(e = {}) {
    const t = Xe(e);
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${h(t.id)}" />
        <label>Name <input type="text" name="name" value="${h(t.name)}" /></label>
        <div class="gmf-form-grid">
          <label>Color <input type="color" name="color" value="${h(t.color)}" /></label>
          <label>Visibility <select name="visibility">${H(Me, t.visibility)}</select></label>
        </div>
        <label>Description <textarea name="description">${h(t.description)}</textarea></label>
      </form>
    `;
  }
  function ie(e = {}) {
    const t = _(e);
    return `
      <form class="gmf-crud-form">
        <label>Title <input type="text" name="title" value="${h(t.title)}" /></label>
        <label>Subtitle <input type="text" name="subtitle" value="${h(t.subtitle)}" /></label>
        <label>Description <textarea name="description">${h(t.description)}</textarea></label>
        <label>Background Image
          <div class="gmf-path-field">
            <input type="text" name="backgroundImage" value="${h(t.backgroundImage)}" />
            <button type="button" data-browse-target="backgroundImage"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
        <label>Visibility <select name="visibility">${H(Me, t.visibility)}</select></label>
      </form>
    `;
  }
  function Te(e) {
    const t = L(e);
    t && ae({
      title: "Edit Galaxy Map",
      content: ie(t),
      onSubmit: (n) => $e(e, n)
    });
  }
  function Ee(e, t = null, n = {}) {
    var o;
    const i = L(e), s = t ? (o = i == null ? void 0 : i.systems) == null ? void 0 : o.find((u) => u.id === t) : null;
    ae({
      title: s ? "Edit Star System" : "Create Star System",
      content: Y(e, s ?? { id: K("system"), name: "New System" }, n),
      submitLabel: s ? "Save System" : "Create System",
      onSubmit: (u) => G(e, {
        ...u,
        sceneIds: u.sceneIds ?? [],
        pulse: u.pulse === "true"
      })
    });
  }
  function ke(e, t = null, n = {}) {
    var o;
    const i = L(e);
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
  function ye(e, t = null) {
    var s;
    const n = L(e), i = t ? (s = n == null ? void 0 : n.factions) == null ? void 0 : s.find((o) => o.id === t) : null;
    ae({
      title: i ? "Edit Faction" : "Create Faction",
      content: te(i ?? { id: K("faction"), name: "New Faction" }),
      submitLabel: i ? "Save Faction" : "Create Faction",
      onSubmit: (o) => c(e, o)
    });
  }
  function _e(e) {
    const t = L(e);
    if (!t) return;
    const n = _(t).factions.map((i) => `
      <article class="gmf-dialog-row">
        <div>
          <strong><span class="gmf-color-dot" style="--gmf-faction-color: ${h(i.color)};"></span>${h(i.name)}</strong>
          <span>${h(i.color)} - ${h(i.visibility)}</span>
        </div>
        <div class="gmf-row-actions">
          <button type="button" data-dialog-edit-faction="${h(i.id)}" title="Edit faction"><i class="fa-solid fa-pen"></i></button>
          <button type="button" data-dialog-delete-faction="${h(i.id)}" title="Delete faction"><i class="fa-solid fa-trash"></i></button>
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
        const s = Ne(i);
        (o = s.querySelector("[data-dialog-add-faction]")) == null || o.addEventListener("click", () => ye(e)), s.querySelectorAll("[data-dialog-edit-faction]").forEach((u) => {
          u.addEventListener("click", () => ye(e, u.dataset.dialogEditFaction));
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
  function re() {
    return Object.values(C()).map(_);
  }
  function Le(e, t) {
    const n = L(e);
    if (!n) return [];
    const i = _(n).systems.find((s) => s.id === String(t));
    return i ? [...i.sceneIds] : [];
  }
  function De(e) {
    const t = String(e || "");
    return t ? re().flatMap((n) => n.systems.filter((i) => i.sceneIds.includes(t)).map((i) => ({
      mapId: n.id,
      mapTitle: n.title,
      system: b(i)
    }))) : [];
  }
  function F(e = null) {
    a != null && a.rendered && a.render({ force: !0 });
    for (const [t, n] of p.entries())
      (!e || t === e) && n.render({ force: !0 });
    m != null && m.rendered && (!e || m.mapId === e) && m.render({ force: !0 });
  }
  function q(e) {
    const t = [...p.values()];
    return m && t.push(m), t.filter((n) => (n == null ? void 0 : n.rendered) && n.mapId === e);
  }
  function oe(e) {
    var t;
    return e.element instanceof HTMLElement ? e.element : ((t = e.element) == null ? void 0 : t[0]) ?? null;
  }
  function se(e, t, n) {
    return e.routes.find((i) => i.fromSystemId === t && i.toSystemId === n || i.toSystemId === t && i.fromSystemId === n) ?? null;
  }
  function it(e) {
    return de().filter((t) => t.id !== e).map((t) => t.id);
  }
  function st(e, t) {
    const n = L(e);
    if (!n)
      return M(`Map "${e}" was not found.`), null;
    const i = _(n), s = i.systems.find((V) => V.id === i.currentSystemId), o = i.systems.find((V) => V.id === t);
    if (!o)
      return M(`System "${t}" was not found.`), null;
    if (!s)
      return M("This map does not have a current location yet. Ask the GM to set one first."), null;
    if (s.id === o.id)
      return I(`${o.name} is already the current location.`), null;
    if (i.visibility !== "players" || s.visibility !== "players" || o.visibility !== "players")
      return M("That travel destination is not visible to players."), null;
    const u = se(i, s.id, o.id);
    if (!u || u.visibility !== "players")
      return M(`No player-visible direct route from ${s.name} to ${o.name}.`), null;
    const k = ue();
    if (!k)
      return M("A GM must be online to approve player travel."), null;
    const O = it(game.user.id);
    return O.includes(k.id) || O.push(k.id), {
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
  function Ue(e, t) {
    const n = st(e, t);
    return n ? (game.socket.emit(N, n), I(`Travel request sent: ${n.fromName} to ${n.toName}.`), n) : null;
  }
  function nt(e) {
    var i, s, o;
    if (!(e != null && e.requestId) || e.requesterId === ((i = game.user) == null ? void 0 : i.id) || !((o = e.voterIds) != null && o.includes((s = game.user) == null ? void 0 : s.id)) || w.has(e.requestId)) return;
    w.add(e.requestId);
    let t = !1;
    const n = (u) => {
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
      game.socket.emit(N, k), Be(k);
    };
    new Dialog({
      title: "Travel Request",
      content: `
        <section class="gmf-travel-request">
          <p><strong>${h(e.requesterName)}</strong> wants to travel on <strong>${h(e.mapTitle)}</strong>.</p>
          <p>${h(e.fromName)} &rarr; ${h(e.toName)}</p>
          <p class="gmf-travel-request__meta">${h(e.routeType)} route / ${h(e.travelTime || "Unknown time")} / Fuel ${h(e.fuelCost ?? 0)}</p>
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
  function at(e) {
    if (!me() || !(e != null && e.requestId)) return;
    const t = globalThis.setTimeout(() => {
      const n = S.get(e.requestId);
      n && He(n, "Request timeout");
    }, 6e4);
    S.set(e.requestId, {
      ...e,
      accepted: /* @__PURE__ */ new Set(),
      voterIds: [...new Set(e.voterIds ?? [])],
      timeoutId: t
    });
  }
  function Pe(e) {
    const t = _(L(e.mapId)), n = t.systems.find((s) => s.id === e.fromSystemId), i = t.systems.find((s) => s.id === e.toSystemId);
    !n || !i || q(e.mapId).forEach((s) => {
      var u;
      const o = oe(s);
      o && (s.selectedSystemId = i.id, s.selectedRouteId = null, (u = s._animateShipTravel) == null || u.call(s, n, i, o));
    });
  }
  function rt(e, t, n) {
    var i;
    game.socket.emit(N, {
      action: "travel-animation",
      mapId: e,
      fromSystemId: t,
      toSystemId: n,
      coordinatorId: (i = game.user) == null ? void 0 : i.id
    });
  }
  async function ot(e) {
    S.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId);
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
    game.socket.emit(N, t), Pe(t), I(`Travel approved: ${e.fromName} to ${e.toName}.`), globalThis.setTimeout(() => Z(e.mapId, e.toSystemId), 2400);
  }
  function He(e, t = "A player") {
    S.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId);
    const n = {
      action: "travel-declined",
      requestId: e.requestId,
      mapId: e.mapId,
      fromName: e.fromName,
      toName: e.toName,
      voterName: t,
      coordinatorId: game.user.id
    };
    game.socket.emit(N, n), I(`Travel declined by ${t}: ${e.fromName} to ${e.toName}.`);
  }
  function Be(e) {
    if (!me() || !(e != null && e.requestId)) return;
    const t = S.get(e.requestId);
    if (!(!t || !t.voterIds.includes(e.userId))) {
      if (!e.accepted) {
        He(t, e.userName);
        return;
      }
      t.accepted.add(e.userId), t.voterIds.every((n) => t.accepted.has(n)) && ot(t);
    }
  }
  function lt(e) {
    var t, n;
    e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && w.delete(e.requestId), Pe(e), (n = ui.notifications) == null || n.info(`Travel approved: ${e.fromName} to ${e.toName}.`));
  }
  function ct(e) {
    var t, n;
    e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && w.delete(e.requestId), (n = ui.notifications) == null || n.warn(`Travel declined by ${e.voterName}: ${e.fromName} to ${e.toName}.`));
  }
  function dt(e) {
    const t = p.get(e);
    t && t.close(), (m == null ? void 0 : m.mapId) === e && m.close();
  }
  function ve(e, t = {}) {
    var k;
    const n = L(e);
    if (!n)
      return M(`Map "${e}" was not found.`), null;
    const i = t.playerMode ?? !((k = game.user) != null && k.isGM);
    if (i && n.visibility !== "players" && !t.broadcast)
      return M("That galaxy map is not visible to players."), null;
    const s = i ? `player:${e}` : e, o = i && (m == null ? void 0 : m.mapId) === e ? m : p.get(s);
    if (o != null && o.rendered)
      return o.bringToFront(), o;
    const u = new ft({ mapId: e, playerMode: i });
    return i ? m = u : p.set(s, u), u.render({ force: !0 }), u;
  }
  function Re() {
    return E("open the map manager") ? (a || (a = new mt()), a.render({ force: !0 }), a) : null;
  }
  function Oe() {
    const e = re().filter((i) => i.visibility === "players").sort((i, s) => i.title.localeCompare(s.title));
    if (!e.length)
      return I("No galaxy map is currently visible to players."), null;
    if (e.length === 1) return ve(e[0].id, { playerMode: !0 });
    const t = e.map((i) => `
      <button type="button" class="gmf-player-map-choice" data-player-open-map="${h(i.id)}">
        <span class="gmf-player-map-choice__title">${h(i.title)}</span>
        <span class="gmf-player-map-choice__meta">${h(i.subtitle || i.description || "Player-visible galaxy map")}</span>
      </button>
    `).join("");
    let n = null;
    return n = new Dialog({
      title: "Choose Galaxy Map",
      content: `<section class="gmf-player-map-chooser">${t}</section>`,
      render: (i) => {
        const s = Ne(i);
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
  function ut() {
    var t;
    const e = re().sort((n, i) => n.title.localeCompare(i.title));
    return (t = game.user) != null && t.isGM ? e.length === 1 ? ve(e[0].id) : Re() : Oe();
  }
  function Ge(e) {
    if (E("broadcast galaxy maps")) {
      if (!L(e)) {
        M(`Map "${e}" was not found.`);
        return;
      }
      game.socket.emit(N, { action: "open", mapId: e }), I("Map broadcast sent to players.");
    }
  }
  function Ze() {
    E("close player galaxy maps") && (game.socket.emit(N, { action: "close" }), I("Close-map signal sent to players."));
  }
  const mt = Mt({
    templateRoot: qe,
    getMaps: re,
    prepareMapForManager: Ce,
    getRawMap: L,
    openMapMetadataDialog: Te,
    openSystemDialog: Ee,
    openRouteDialog: ke,
    openFactionDialog: ye,
    exportMap: z,
    duplicateMap: x,
    deleteMap: D,
    createMap: B,
    deleteSystem: ee,
    deleteRoute: r,
    deleteFaction: d,
    openMap: ve,
    showMapToPlayers: Ge,
    closePlayerMap: Ze,
    hideSystemFromPlayers: f,
    hideRouteFromPlayers: A,
    clearManagerApp: (e) => {
      a === e && (a = null);
    }
  }), ft = wt({
    templateRoot: qe,
    getRawMap: L,
    prepareMapForDisplay: pe,
    openSystemDialog: Ee,
    openRouteDialog: ke,
    openFactionDialog: ye,
    openFactionManagerDialog: _e,
    openMapMetadataDialog: Te,
    revealSystemToPlayers: g,
    revealRouteToPlayers: T,
    hideSystemFromPlayers: f,
    hideRouteFromPlayers: A,
    deleteSystem: ee,
    deleteRoute: r,
    setCurrentSystem: Z,
    requestTravelToSystem: Ue,
    notifySystemDiscovered: $,
    exportMap: z,
    getTravelRoute: se,
    broadcastTravelAnimation: rt,
    notifyInfo: I,
    notifyError: M,
    saveSystemPosition: y,
    showMapToPlayers: Ge,
    openMapManager: Re,
    clearMapView: (e) => {
      e.playerMode && m === e && (m = null);
      for (const [t, n] of p.entries())
        n === e && p.delete(t);
    }
  });
  function pt() {
    const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
    return t != null && t.registerApp ? (t.registerApp({
      id: ce,
      title: "Galaxy Map",
      icon: "fa-solid fa-route",
      premium: !1,
      description: "Open cinematic campaign maps and navigation charts.",
      open: () => {
        var n;
        return (n = game.user) != null && n.isGM ? Re() : Oe();
      }
    }), !0) : !1;
  }
  Hooks.once("init", async () => {
    game.settings.register(ce, Ve, {
      scope: "world",
      config: !1,
      type: Object,
      default: {}
    }), Handlebars.registerHelper("gmfEq", (e, t) => e === t), Handlebars.registerHelper("gmfJson", (e) => JSON.stringify(e, null, 2)), Handlebars.registerHelper("gmfPercent", (e) => `${Number(e).toFixed(3)}%`), Handlebars.registerHelper("gmfFallback", (e, t) => e || t), await loadTemplates([
      `${qe}/map-manager.hbs`,
      `${qe}/galaxy-map.hbs`,
      `${qe}/system-details.hbs`
    ]);
  }), Hooks.once("ready", () => {
    game.galaxyMap = {
      openMap: ve,
      openMapManager: Re,
      openGalaxyMapFromSceneControls: ut,
      openPlayerMapChooser: Oe,
      createMap: B,
      getMaps: re,
      getSceneIdsForSystem: Le,
      getSystemsForScene: De,
      showMapToPlayers: Ge,
      closePlayerMap: Ze,
      updateMap: xe,
      updateMapMetadata: $e,
      deleteMap: D,
      duplicateMap: x,
      upsertSystem: G,
      deleteSystem: ee,
      upsertRoute: l,
      deleteRoute: r,
      upsertFaction: c,
      deleteFaction: d,
      saveSystemPosition: y,
      setCurrentSystem: Z,
      revealSystemToPlayers: g,
      revealRouteToPlayers: T,
      hideSystemFromPlayers: f,
      hideRouteFromPlayers: A,
      notifySystemDiscovered: $,
      requestTravelToSystem: Ue,
      importMapData: X,
      exportMap: z
    };
    const e = game.modules.get(ce);
    e && (e.api = game.galaxyMap), pt(), game.socket.on(N, (t = {}) => {
      var n, i, s;
      if (t.action === "travel-request") {
        at(t), nt(t);
        return;
      }
      if (t.action === "travel-vote") {
        Be(t);
        return;
      }
      if (t.action === "travel-approved") {
        lt(t);
        return;
      }
      if (t.action === "travel-declined") {
        ct(t);
        return;
      }
      if (t.action === "travel-animation") {
        t.coordinatorId !== ((n = game.user) == null ? void 0 : n.id) && Pe(t);
        return;
      }
      (i = game.user) != null && i.isGM || (t.action === "open" && t.mapId && (m == null || m.close(), ve(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "close" && (m == null || m.close()), t.action === "refresh" && (m == null ? void 0 : m.mapId) === t.mapId && m.render({ force: !0 }), t.action === "notify" && ((s = ui.notifications) == null || s.info(t.message || "New system discovered."), (m == null ? void 0 : m.mapId) === t.mapId && m.render({ force: !0 })));
    }), console.log(`${ce} | Ready. API available at game.galaxyMap.`);
  });
})();
