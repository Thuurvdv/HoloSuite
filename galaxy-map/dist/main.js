var jt = Object.defineProperty;
var Bt = (r, y, p) => y in r ? jt(r, y, { enumerable: !0, configurable: !0, writable: !0, value: p }) : r[y] = p;
var R = (r, y, p) => Bt(r, typeof y != "symbol" ? y + "" : y, p);
const De = [
  { value: "cartoon", label: "Cartoon · Acid Seas", color: "#af91ff" },
  { value: "adventure", label: "Painterly · Golden Frontier", color: "#69e7dc" },
  { value: "realistic", label: "Realistic · Blue Marble", color: "#78caff" }
], St = [
  { value: "auto", label: "Automatic (cartoon for planet icons)" },
  ...De,
  { value: "custom", label: "Custom texture" },
  { value: "none", label: "No planet view" }
], bt = [
  { value: "sphere", label: "Sphere" },
  { value: "cube", label: "Cube" },
  { value: "donut", label: "Donut" },
  { value: "asteroid", label: "Asteroid" },
  { value: "crystal", label: "Crystal" },
  { value: "cylinder", label: "Cylinder" }
];
function It(r) {
  return bt.some((y) => y.value === r) ? String(r) : "sphere";
}
function wt(r) {
  return St.some((y) => y.value === r) ? String(r) : "auto";
}
function Ze(r, y = "") {
  if (!r || r.obscured || r.planetPreset === "none") return null;
  const p = wt(r.planetPreset), h = ["planet", "terrestrial", "gas-giant", "ice-world", "volcanic", "artificial", "ringed"].includes(r.iconStyle ?? "planet") && r.type !== "station" && r.type !== "anomaly";
  if (p === "auto" && !h && !r.planetTexture) return null;
  const S = De.find((C) => C.value === y) ?? De.find((C) => C.value === p) ?? De[0], M = !y && p === "custom" && !!r.planetTexture;
  return {
    texture: M ? r.planetTexture : `modules/galaxy-map/assets/planets/${S.value}.png`,
    label: M ? "Custom texture" : S.label,
    color: S.color,
    shape: It(r.planetShape)
  };
}
const Je = [
  { value: "gm", label: "GM approval" },
  { value: "majority", label: "Majority vote" },
  { value: "unanimous", label: "Unanimous agreement" }
];
function ct(r) {
  return Je.some((y) => y.value === r) ? String(r) : "unanimous";
}
function ht(r, y, p, h) {
  const S = ct(h), M = [...new Map((r ?? []).filter((N) => N == null ? void 0 : N.id).map((N) => [String(N.id), N])).values()], C = S === "gm" ? p != null && p.id ? [p] : [] : M.filter((N) => String(N.id) !== String(y)), x = C.map((N) => String(N.id)), $ = Object.fromEntries(C.map((N) => [String(N.id), String(N.name || "Navigator").slice(0, 80)])), T = x.length + (S === "gm" ? 0 : 1), w = S === "gm" ? 1 : S === "majority" ? Math.floor(T / 2) + 1 : T;
  return { approvalMode: S, voterIds: x, voterNames: $, participantCount: T, requiredApprovals: w };
}
function vt(r) {
  const y = ct(r == null ? void 0 : r.approvalMode), p = [...new Set(((r == null ? void 0 : r.voterIds) ?? []).map(String))], h = new Set([...(r == null ? void 0 : r.accepted) ?? []].map(String)), S = new Set([...(r == null ? void 0 : r.declined) ?? []].map(String)), M = y === "gm" ? 0 : 1, C = Math.max(1, Number(r == null ? void 0 : r.requiredApprovals) || (y === "unanimous" ? p.length + 1 : 1)), x = M + p.filter((w) => h.has(w)).length, $ = p.filter((w) => S.has(w)).length, T = p.filter((w) => !h.has(w) && !S.has(w));
  return x >= C ? { outcome: "approved", acceptedCount: x, declinedCount: $, required: C, pendingIds: T } : y === "unanimous" && $ > 0 ? { outcome: "declined", acceptedCount: x, declinedCount: $, required: C, pendingIds: T } : x + T.length < C ? { outcome: "declined", acceptedCount: x, declinedCount: $, required: C, pendingIds: T } : { outcome: "pending", acceptedCount: x, declinedCount: $, required: C, pendingIds: T };
}
const Mt = ["core", "colony", "frontier", "station", "anomaly", "ruins", "restricted", "unknown"], xt = ["undiscovered", "known", "visited", "danger", "locked"], Tt = ["safe", "dangerous", "restricted", "smuggler", "unknown"], qe = ["gm", "players"], qt = [
  { value: "planet", label: "Planet" },
  { value: "terrestrial", label: "Terrestrial" },
  { value: "gas-giant", label: "Gas Giant" },
  { value: "ice-world", label: "Ice World" },
  { value: "volcanic", label: "Volcanic" },
  { value: "artificial", label: "Artificial / Machine World" },
  { value: "ringed", label: "Ringed" },
  { value: "star", label: "Star" },
  { value: "black-hole", label: "Black Hole" },
  { value: "station", label: "Space Station" },
  { value: "diamond", label: "Diamond" },
  { value: "void", label: "Void" }
], Vt = qt.map((r) => r.value), Yt = [
  "planet",
  "terrestrial",
  "gas-giant",
  "ice-world",
  "volcanic",
  "artificial",
  "ringed",
  "star",
  "black-hole",
  "station"
], at = 0.55, it = 2.6, _t = 2400, Ut = 6e4;
function re(r = "gmf") {
  return `${r}-${foundry.utils.randomID(10)}`;
}
function We(r, y = "players") {
  const p = qe.includes(y) ? y : "players";
  return qe.includes(r) ? String(r) : p;
}
function Ht(r) {
  return typeof r == "string" && /^#[0-9a-f]{6}$/i.test(r) ? r : "#58d8ff";
}
function Xt(r) {
  return typeof r == "string" && /^#[0-9a-f]{6}$/i.test(r) ? r : "";
}
function _e(r, y = 0) {
  const p = Number(r);
  return Number.isFinite(p) ? p : y;
}
function Zt(r) {
  const y = Array.isArray(r) ? r : r ? [r] : [];
  return [...new Set(y.map((p) => String(p).trim()).filter(Boolean))];
}
function ne(r, y, p) {
  return Math.min(p, Math.max(y, r));
}
function rt(r = {}) {
  const y = Zt(r.sceneIds === void 0 ? r.sceneId : r.sceneIds), p = String(r.planetTexture || "").trim(), h = wt(r.planetPreset), S = p && h !== "none" ? "custom" : h;
  return {
    id: String(r.id || re("system")),
    name: String(r.name || "Unnamed System"),
    x: Math.min(100, Math.max(0, _e(r.x, 50))),
    y: Math.min(100, Math.max(0, _e(r.y, 50))),
    type: Mt.includes(r.type) ? r.type : "unknown",
    factionId: String(r.factionId || ""),
    status: xt.includes(r.status) ? r.status : "known",
    description: String(r.description || ""),
    image: String(r.image || ""),
    planetPreset: S,
    planetShape: It(r.planetShape),
    planetTexture: p,
    sceneIds: y,
    journalId: String(r.journalId || ""),
    visibility: We(r.visibility, "players"),
    notes: String(r.notes || ""),
    iconColor: Xt(r.iconColor),
    iconSize: ne(_e(r.iconSize, 28), 18, 56),
    iconStyle: Vt.includes(r.iconStyle) ? r.iconStyle : "planet",
    pulse: r.pulse !== !1
  };
}
function ot(r = {}) {
  return {
    id: String(r.id || re("route")),
    fromSystemId: String(r.fromSystemId || ""),
    toSystemId: String(r.toSystemId || ""),
    type: Tt.includes(r.type) ? r.type : "unknown",
    travelTime: String(r.travelTime || ""),
    fuelCost: _e(r.fuelCost, 0),
    visibility: We(r.visibility, "players"),
    notes: String(r.notes || "")
  };
}
function lt(r = {}) {
  return {
    id: String(r.id || re("faction")),
    name: String(r.name || "Unaffiliated"),
    color: Ht(r.color),
    description: String(r.description || ""),
    visibility: We(r.visibility, "players")
  };
}
function A(r = {}) {
  var S;
  const y = Array.isArray(r.systems) ? r.systems.map(rt) : [], p = Array.isArray(r.routes) ? r.routes.map(ot) : [], h = Array.isArray(r.factions) ? r.factions.map(lt) : [];
  return {
    id: String(r.id || re("map")),
    title: String(r.title || "Untitled Galaxy Map"),
    subtitle: String(r.subtitle || ""),
    description: String(r.description || ""),
    backgroundImage: String(r.backgroundImage || ""),
    visibility: We(r.visibility, "players"),
    travelApprovalMode: ct(r.travelApprovalMode),
    currentSystemId: String(r.currentSystemId || ((S = y[0]) == null ? void 0 : S.id) || ""),
    systems: y,
    routes: p,
    factions: h
  };
}
function Jt() {
  var p, h, S, M;
  const r = (h = (p = foundry.applications) == null ? void 0 : p.api) == null ? void 0 : h.ApplicationV2, y = (M = (S = foundry.applications) == null ? void 0 : S.api) == null ? void 0 : M.HandlebarsApplicationMixin;
  return r && y ? y(r) : Application;
}
function Wt(r) {
  var oe;
  const {
    templateRoot: y,
    getMaps: p,
    prepareMapForManager: h,
    getRawMap: S,
    openMapMetadataDialog: M,
    openSystemDialog: C,
    openRouteDialog: x,
    openFactionDialog: $,
    exportMap: T,
    duplicateMap: w,
    deleteMap: N,
    createMap: se,
    deleteSystem: me,
    deleteRoute: be,
    deleteFaction: D,
    openMap: U,
    showMapToPlayers: Ee,
    closePlayerMap: fe,
    hideSystemFromPlayers: O,
    hideRouteFromPlayers: Ie,
    hideFactionFromPlayers: we,
    clearManagerApp: de
  } = r;
  return oe = class extends Jt() {
    constructor(j = {}) {
      super(j);
      R(this, "selectedMapId");
      R(this, "jsonDraft");
      R(this, "activeTab");
      this.selectedMapId = j.selectedMapId ?? null, this.jsonDraft = "", this.activeTab = ["systems", "routes", "factions"].includes(j.activeTab) ? j.activeTab : "systems";
    }
    async _prepareContext(j) {
      var le, o;
      const L = await ((le = super._prepareContext) == null ? void 0 : le.call(this, j)) ?? {}, Q = p().sort((n, c) => n.title.localeCompare(c.title));
      (!this.selectedMapId || !Q.some((n) => n.id === this.selectedMapId)) && (this.selectedMapId = ((o = Q[0]) == null ? void 0 : o.id) ?? null);
      const pe = this.selectedMapId ? h(S(this.selectedMapId)) : null;
      return {
        ...L,
        maps: Q,
        selectedMap: pe,
        selectedMapId: this.selectedMapId,
        activeTab: this.activeTab,
        showSystems: this.activeTab === "systems",
        showRoutes: this.activeTab === "routes",
        showFactions: this.activeTab === "factions",
        hasMaps: Q.length > 0
      };
    }
    _attachPartListeners(j, L, Q) {
      var pe, le, o, n, c, d, m, g;
      (pe = super._attachPartListeners) == null || pe.call(this, j, L, Q), (le = L.querySelector("[data-action='create-map']")) == null || le.addEventListener("click", () => this._onCreateMap()), (o = L.querySelector("[data-action='edit-map-metadata']")) == null || o.addEventListener("click", () => {
        this.selectedMapId && M(this.selectedMapId);
      }), (n = L.querySelector("[data-action='create-system']")) == null || n.addEventListener("click", () => {
        this.selectedMapId && C(this.selectedMapId);
      }), (c = L.querySelector("[data-action='create-route']")) == null || c.addEventListener("click", () => {
        this.selectedMapId && x(this.selectedMapId);
      }), (d = L.querySelector("[data-action='create-faction']")) == null || d.addEventListener("click", () => {
        this.selectedMapId && $(this.selectedMapId);
      }), L.querySelectorAll("[data-manager-tab]").forEach((u) => {
        u.addEventListener("click", () => {
          const v = u.dataset.managerTab;
          !["systems", "routes", "factions"].includes(v) || v === this.activeTab || (this.activeTab = v, this.render({ force: !0 }));
        });
      }), L.querySelectorAll("[data-edit-system]").forEach((u) => {
        u.addEventListener("click", () => C(this.selectedMapId, u.dataset.editSystem));
      }), L.querySelectorAll("[data-show-system]").forEach((u) => {
        u.addEventListener("click", () => O(this.selectedMapId, u.dataset.showSystem, !1));
      }), L.querySelectorAll("[data-hide-system]").forEach((u) => {
        u.addEventListener("click", () => O(this.selectedMapId, u.dataset.hideSystem, !0));
      }), L.querySelectorAll("[data-delete-system]").forEach((u) => {
        u.addEventListener("click", () => this._confirmDeleteSystem(u.dataset.deleteSystem));
      }), L.querySelectorAll("[data-edit-route]").forEach((u) => {
        u.addEventListener("click", () => x(this.selectedMapId, u.dataset.editRoute));
      }), L.querySelectorAll("[data-show-route]").forEach((u) => {
        u.addEventListener("click", () => Ie(this.selectedMapId, u.dataset.showRoute, !1));
      }), L.querySelectorAll("[data-hide-route]").forEach((u) => {
        u.addEventListener("click", () => Ie(this.selectedMapId, u.dataset.hideRoute, !0));
      }), L.querySelectorAll("[data-delete-route]").forEach((u) => {
        u.addEventListener("click", () => this._confirmDeleteRoute(u.dataset.deleteRoute));
      }), L.querySelectorAll("[data-edit-faction]").forEach((u) => {
        u.addEventListener("click", () => $(this.selectedMapId, u.dataset.editFaction));
      }), L.querySelectorAll("[data-show-faction]").forEach((u) => {
        u.addEventListener("click", () => we(this.selectedMapId, u.dataset.showFaction, !1));
      }), L.querySelectorAll("[data-hide-faction]").forEach((u) => {
        u.addEventListener("click", () => we(this.selectedMapId, u.dataset.hideFaction, !0));
      }), L.querySelectorAll("[data-delete-faction]").forEach((u) => {
        u.addEventListener("click", () => this._confirmDeleteFaction(u.dataset.deleteFaction));
      }), (m = L.querySelector("[data-action='export-map']")) == null || m.addEventListener("click", () => {
        this.selectedMapId && T(this.selectedMapId);
      }), L.querySelectorAll("[data-select-map]").forEach((u) => {
        u.addEventListener("click", () => {
          this.selectedMapId = u.dataset.selectMap, this.jsonDraft = "", this.render({ force: !0 });
        });
      }), L.querySelectorAll("[data-open-map]").forEach((u) => {
        u.addEventListener("click", () => U(u.dataset.openMap));
      }), L.querySelectorAll("[data-show-map]").forEach((u) => {
        u.addEventListener("click", () => Ee(u.dataset.showMap));
      }), L.querySelectorAll("[data-duplicate-map]").forEach((u) => {
        u.addEventListener("click", async () => {
          const v = await w(u.dataset.duplicateMap);
          v && (this.selectedMapId = v.id, this.jsonDraft = "", this.render({ force: !0 }));
        });
      }), L.querySelectorAll("[data-delete-map]").forEach((u) => {
        u.addEventListener("click", async () => {
          const v = u.dataset.deleteMap, _ = S(v);
          await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${(_ == null ? void 0 : _.title) ?? v}</strong>? This cannot be undone.</p>`
          }) && (await N(v), this.selectedMapId === v && (this.selectedMapId = null), this.jsonDraft = "", this.render({ force: !0 }));
        });
      }), (g = L.querySelector("[data-action='close-player-map']")) == null || g.addEventListener("click", () => fe());
    }
    async _onCreateMap() {
      const j = await se({
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
      j && (this.selectedMapId = j.id, this.jsonDraft = "", this.render({ force: !0 }));
    }
    async _confirmDeleteSystem(j) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }) && await me(this.selectedMapId, j);
    }
    async _confirmDeleteRoute(j) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }) && await be(this.selectedMapId, j);
    }
    async _confirmDeleteFaction(j) {
      await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }) && await D(this.selectedMapId, j);
    }
    async close(j = {}) {
      return de(this), super.close(j);
    }
  }, R(oe, "DEFAULT_OPTIONS", {
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
  }), R(oe, "PARTS", {
    main: {
      template: `${y}/map-manager.hbs`
    }
  }), oe;
}
function Qt(r, y) {
  const p = (h, S, M) => (S[0] - h[0]) * (M[1] - h[1]) - (S[1] - h[1]) * (M[0] - h[0]);
  return y.flatMap((h) => {
    const S = r.filter((T) => T.factionId === h.id && !T.obscured);
    if (!S.length) return [];
    const M = S.flatMap((T) => Array.from({ length: 12 }, (w, N) => {
      const se = N * Math.PI / 6;
      return [
        Math.max(1, Math.min(99, T.x + Math.cos(se) * 7)),
        Math.max(1, Math.min(99, T.y + Math.sin(se) * 9))
      ];
    })).sort((T, w) => T[0] - w[0] || T[1] - w[1]), C = (T) => {
      const w = [];
      for (const N of T) {
        for (; w.length > 1 && p(w[w.length - 2], w[w.length - 1], N) <= 0; ) w.pop();
        w.push(N);
      }
      return w.slice(0, -1);
    }, x = [...C(M), ...C([...M].reverse())], $ = Math.min(...M.map((T) => T[1]));
    return [{
      id: h.id,
      name: h.name,
      color: h.color,
      points: x.map((T) => T.map((w) => w.toFixed(2)).join(",")).join(" "),
      labelX: (Math.min(...M.map((T) => T[0])) + Math.max(...M.map((T) => T[0]))) / 2,
      labelY: Math.max(3, $ + 3)
    }];
  });
}
function Kt() {
  var p, h, S, M;
  const r = (h = (p = foundry.applications) == null ? void 0 : p.api) == null ? void 0 : h.ApplicationV2, y = (M = (S = foundry.applications) == null ? void 0 : S.api) == null ? void 0 : M.HandlebarsApplicationMixin;
  return r && y ? y(r) : Application;
}
function es(r) {
  var Q;
  const {
    templateRoot: y,
    getRawMap: p,
    prepareMapForDisplay: h,
    openSystemDialog: S,
    openRouteDialog: M,
    openFactionDialog: C,
    openFactionManagerDialog: x,
    openMapMetadataDialog: $,
    revealSystemToPlayers: T,
    revealRouteToPlayers: w,
    hideSystemFromPlayers: N,
    hideRouteFromPlayers: se,
    deleteSystem: me,
    deleteRoute: be,
    setCurrentSystem: D,
    requestTravelToSystem: U,
    notifySystemDiscovered: Ee,
    pingSystem: fe,
    exportMap: O,
    getTravelRoute: Ie,
    broadcastTravelAnimation: we,
    notifyInfo: de,
    notifyError: oe,
    saveSystemPosition: $e,
    showMapToPlayers: ke,
    openMapManager: j,
    clearMapView: L
  } = r;
  return Q = class extends Kt() {
    constructor(o = {}) {
      var d;
      const n = o.mapId, c = o.playerMode ?? !((d = game.user) != null && d.isGM);
      super({
        ...o,
        id: `galaxy-map-view-${c ? "player" : "gm"}-${n}`
      });
      R(this, "mapId");
      R(this, "playerMode");
      R(this, "selectedSystemId");
      R(this, "selectedRouteId");
      R(this, "zoom");
      R(this, "panX");
      R(this, "panY");
      R(this, "_drag");
      R(this, "_contextTarget");
      R(this, "_boundContextClose");
      R(this, "externalFocus");
      R(this, "_externalFocusTimeout");
      R(this, "_pendingFocusZoom");
      R(this, "searchQuery");
      R(this, "showTerritories", !0);
      R(this, "planetSystemId", null);
      R(this, "planetPreview", "");
      R(this, "planetStatic", !1);
      R(this, "_planetRenderer", null);
      R(this, "_planetGeneration", 0);
      R(this, "_planetReturnFocus", !1);
      R(this, "_effectTimeouts");
      this.mapId = n, this.playerMode = c, this.selectedSystemId = o.selectedSystemId ?? null, this.selectedRouteId = o.selectedRouteId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null, this.externalFocus = null, this._externalFocusTimeout = null, this._pendingFocusZoom = null, this.searchQuery = "", this._effectTimeouts = /* @__PURE__ */ new Set();
    }
    get title() {
      const o = p(this.mapId), n = this.playerMode ? "Player View" : "GM View";
      return o ? `${o.title} - ${n}` : `Galaxy Map - ${n}`;
    }
    async _prepareContext(o) {
      var u, v;
      const n = await ((u = super._prepareContext) == null ? void 0 : u.call(this, o)) ?? {}, c = p(this.mapId), d = c ? h(c, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      }) : null;
      d != null && d.systems && this.externalFocus && (d.systems = d.systems.map((_) => _.id === this.externalFocus.systemId ? { ..._, isExternalFocus: !0, hasSignal: !0, externalFocus: this.externalFocus } : _), ((v = d.selectedSystem) == null ? void 0 : v.id) === this.externalFocus.systemId && (d.selectedSystem = d.systems.find((_) => _.id === this.externalFocus.systemId))), d != null && d.selectedSystem && (this.selectedSystemId = d.selectedSystem.id);
      const m = d == null ? void 0 : d.systems.find((_) => _.id === this.planetSystemId), g = !this.playerMode || (c == null ? void 0 : c.visibility) === "players" ? Ze(m, this.playerMode ? "" : this.planetPreview) : null;
      return g || (this.planetSystemId = null), {
        ...n,
        map: d,
        planetView: !!g,
        planetSystem: m,
        planetAppearance: g,
        planetPresets: De.map((_) => ({ ..._, selected: _.value === this.planetPreview })),
        planetPreview: this.planetPreview,
        territories: d ? Qt(d.systems, d.factions) : [],
        showTerritories: this.showTerritories,
        mapId: this.mapId,
        playerMode: this.playerMode,
        zoomPercent: Math.round(this.zoom * 100),
        searchQuery: this.searchQuery,
        panX: this.panX,
        panY: this.panY,
        zoom: this.zoom,
        missingMap: !c
      };
    }
    _onRender(o, n) {
      var d, m, g;
      this._disposePlanetRenderer(), (d = super._onRender) == null || d.call(this, o, n);
      const c = this.element instanceof HTMLElement ? this.element : (m = this.element) == null ? void 0 : m[0];
      if (c) {
        if (this._attachPartListeners("main", c, n), this.externalFocus && this._pendingFocusZoom !== null) {
          const u = A(p(this.mapId)).systems.find((v) => v.id === this.externalFocus.systemId);
          u && this._centerOnSystem(u, c, this._pendingFocusZoom), this._pendingFocusZoom = null;
        }
        this._applySearchState(this.searchQuery, c), o.planetView ? this._mountPlanetRenderer(c, o.planetAppearance) : this._planetReturnFocus && ((g = c.querySelector("[data-action='inspect-planet']")) == null || g.focus(), this._planetReturnFocus = !1);
      }
    }
    _attachPartListeners(o, n, c) {
      var u, v, _, I, H, X, B, K, ue, ae, Ne, Oe, ze, Ge, je, Ce, Le, Ae, ve, Pe, Be, ge, Ve, Ye, J, Me, Ue;
      const d = (u = n.matches) != null && u.call(n, ".gmf-map-stage") ? n : (v = n.querySelector) == null ? void 0 : v.call(n, ".gmf-map-stage, .gmf-planet-stage");
      if ((d == null ? void 0 : d.dataset.gmfMapBound) === "true") return;
      d && (d.dataset.gmfMapBound = "true"), (_ = super._attachPartListeners) == null || _.call(this, o, n, c), this._attachPlanetListeners(n), (I = n.querySelector("[data-action='toggle-territories']")) == null || I.addEventListener("click", () => {
        this.showTerritories = !this.showTerritories, this.render({ force: !0 });
      }), this._applyViewportTransform(n), n.querySelectorAll("[data-system-id]").forEach((P) => {
        var ye;
        P.addEventListener("click", (xe) => {
          if (P.dataset.dragged === "true") {
            P.dataset.dragged = "false";
            return;
          }
          xe.stopPropagation(), this.selectedSystemId = P.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
        }), !this.playerMode && ((ye = game.user) != null && ye.isGM) && P.addEventListener("pointerdown", (xe) => this._startSystemDrag(xe, n, P));
      }), n.querySelectorAll("[data-route-id]").forEach((P) => {
        P.addEventListener("click", (ye) => {
          ye.stopPropagation(), this.selectedRouteId = P.dataset.routeId, this.selectedSystemId = null, this.render({ force: !0 });
        });
      });
      const m = n.querySelector(".gmf-map-stage");
      m == null || m.addEventListener("wheel", (P) => this._onWheelZoom(P, n), { passive: !1 }), m == null || m.addEventListener("pointerdown", (P) => this._startPan(P, n)), m == null || m.addEventListener("contextmenu", (P) => this._openContextMenu(P, n), { capture: !0 }), n.querySelectorAll("[data-context-action]").forEach((P) => {
        P.addEventListener("click", (ye) => this._handleContextAction(ye, n));
      }), (H = n.querySelector("[data-action='open-map-menu']")) == null || H.addEventListener("click", (P) => this._openStageMenuFromButton(P, n)), (X = n.querySelector("[data-action='zoom-in']")) == null || X.addEventListener("click", () => this._setZoom(this.zoom + 0.15, n)), (B = n.querySelector("[data-action='zoom-out']")) == null || B.addEventListener("click", () => this._setZoom(this.zoom - 0.15, n)), (K = n.querySelector("[data-action='reset-view']")) == null || K.addEventListener("click", () => {
        this.zoom = 1, this.panX = 0, this.panY = 0, this._applyViewportTransform(n);
      });
      const g = n.querySelector("[data-system-search]");
      g == null || g.addEventListener("input", () => {
        this.searchQuery = g.value, this._applySearchState(this.searchQuery, n);
      }), g == null || g.addEventListener("keydown", (P) => {
        P.key === "Enter" && (P.preventDefault(), this._focusSearchResult(g.value, n));
      }), (ue = n.querySelector("[data-action='run-system-search']")) == null || ue.addEventListener("click", () => this._focusSearchResult((g == null ? void 0 : g.value) ?? "", n)), (ae = n.querySelector("[data-action='clear-system-search']")) == null || ae.addEventListener("click", () => {
        this.searchQuery = "", g && (g.value = ""), this._applySearchState("", n), g == null || g.focus();
      }), (Ne = n.querySelector("[data-action='open-journal']")) == null || Ne.addEventListener("click", () => this._openLinkedJournal()), (Oe = n.querySelector("[data-action='open-scene']")) == null || Oe.addEventListener("click", () => this._openLinkedScene()), (ze = n.querySelector("[data-action='scan-system']")) == null || ze.addEventListener("click", () => this._scanSelectedSystem(n)), (Ge = n.querySelector("[data-action='ping-system']")) == null || Ge.addEventListener("click", () => {
        this.selectedSystemId && fe(this.mapId, this.selectedSystemId);
      }), (je = n.querySelector("[data-action='edit-system']")) == null || je.addEventListener("click", () => {
        this.selectedSystemId && S(this.mapId, this.selectedSystemId);
      }), (Ce = n.querySelector("[data-action='reveal-system']")) == null || Ce.addEventListener("click", () => {
        this.selectedSystemId && T(this.mapId, this.selectedSystemId);
      }), (Le = n.querySelector("[data-action='hide-system']")) == null || Le.addEventListener("click", () => {
        this.selectedSystemId && N(this.mapId, this.selectedSystemId, !0);
      }), (Ae = n.querySelector("[data-action='delete-system']")) == null || Ae.addEventListener("click", () => {
        this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), (ve = n.querySelector("[data-action='set-current-system']")) == null || ve.addEventListener("click", () => {
        this.selectedSystemId && D(this.mapId, this.selectedSystemId);
      }), (Pe = n.querySelector("[data-action='travel-to-system']")) == null || Pe.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? U(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, n));
      }), (Be = n.querySelector("[data-action='edit-route']")) == null || Be.addEventListener("click", () => {
        this.selectedRouteId && M(this.mapId, this.selectedRouteId);
      }), (ge = n.querySelector("[data-action='reveal-route']")) == null || ge.addEventListener("click", () => {
        this.selectedRouteId && w(this.mapId, this.selectedRouteId);
      }), (Ve = n.querySelector("[data-action='hide-route']")) == null || Ve.addEventListener("click", () => {
        this.selectedRouteId && se(this.mapId, this.selectedRouteId, !0);
      }), (Ye = n.querySelector("[data-action='delete-route']")) == null || Ye.addEventListener("click", () => {
        this.selectedRouteId && this._confirmDeleteRoute(this.selectedRouteId);
      }), (J = n.querySelector("[data-action='notify-discovery']")) == null || J.addEventListener("click", () => {
        this.selectedSystemId && Ee(this.mapId, this.selectedSystemId);
      }), (Me = n.querySelector("[data-action='show-to-players']")) == null || Me.addEventListener("click", () => ke(this.mapId)), (Ue = n.querySelector("[data-action='edit-map']")) == null || Ue.addEventListener("click", () => {
        const P = j();
        P && (P.selectedMapId = this.mapId, P.render({ force: !0 }));
      });
    }
    _applyViewportTransform(o) {
      var c;
      const n = o.querySelector(".gmf-map-viewport");
      n && (n.style.setProperty("--gmf-pan-x", `${this.panX}px`), n.style.setProperty("--gmf-pan-y", `${this.panY}px`), n.style.setProperty("--gmf-zoom", String(this.zoom)), (c = o.querySelector("[data-zoom-label]")) == null || c.replaceChildren(`${Math.round(this.zoom * 100)}%`));
    }
    _setZoom(o, n) {
      this.zoom = ne(o, at, it), this._applyViewportTransform(n);
    }
    _attachPlanetListeners(o) {
      var n, c, d, m, g, u, v, _;
      (n = o.querySelector("[data-action='inspect-planet']")) == null || n.addEventListener("click", () => {
        const I = p(this.mapId), H = h(I, { playerMode: this.playerMode, selectedSystemId: this.selectedSystemId });
        this.playerMode && (I == null ? void 0 : I.visibility) !== "players" || Ze(H == null ? void 0 : H.selectedSystem) && (this.planetSystemId = this.selectedSystemId, this.planetPreview = "", this.render({ force: !0 }));
      }), (c = o.querySelector("[data-action='back-to-galaxy']")) == null || c.addEventListener("click", () => {
        this._disposePlanetRenderer(), this.planetSystemId = null, this._planetReturnFocus = !0, this.render({ force: !0 });
      }), (d = o.querySelector("[data-planet-preset]")) == null || d.addEventListener("change", (I) => {
        var B, K;
        if (this.playerMode || !((B = game.user) != null && B.isGM)) return;
        this.planetPreview = I.target.value;
        const H = h(p(this.mapId), { playerMode: this.playerMode, selectedSystemId: this.planetSystemId }), X = Ze(H.selectedSystem, this.planetPreview);
        X && (this._setPlanetFallback(o, X), (K = this._planetRenderer) == null || K.setTexture(X.texture));
      }), (m = o.querySelector("[data-action='planet-pause']")) == null || m.addEventListener("click", () => {
        var I;
        return (I = this._planetRenderer) == null ? void 0 : I.setPaused(!this._planetRenderer.paused);
      }), (g = o.querySelector("[data-action='planet-zoom-in']")) == null || g.addEventListener("click", () => {
        var I;
        return (I = this._planetRenderer) == null ? void 0 : I.zoom(-0.25);
      }), (u = o.querySelector("[data-action='planet-zoom-out']")) == null || u.addEventListener("click", () => {
        var I;
        return (I = this._planetRenderer) == null ? void 0 : I.zoom(0.25);
      }), (v = o.querySelector("[data-action='planet-reset']")) == null || v.addEventListener("click", () => {
        var I;
        return (I = this._planetRenderer) == null ? void 0 : I.reset();
      }), (_ = o.querySelector("[data-action='planet-static']")) == null || _.addEventListener("click", () => {
        this.planetStatic = !this.planetStatic, this.render({ force: !0 });
      });
    }
    async focusSystem(o, n = {}) {
      var H, X;
      const c = A(p(this.mapId));
      if (!c.systems.find((B) => B.id === o)) return !1;
      const m = h(c, {
        playerMode: this.playerMode,
        selectedSystemId: o,
        selectedRouteId: null
      });
      if (!((H = m == null ? void 0 : m.systems) != null && H.some((B) => B.id === o))) return !1;
      const g = String(n.focusId || o).slice(0, 80), u = ["distress", "warning", "objective", "custom"].includes(n.kind) ? n.kind : "custom", v = /^#[0-9a-f]{6}$/i.test(n.color ?? "") ? n.color : u === "distress" ? "#ff5c7a" : "#58d8ff", _ = ne(Number(n.duration) || 0, 0, 6e5), I = ne(Number(n.zoom) || 1.45, at, it);
      return this.externalFocus = {
        id: g,
        systemId: o,
        kind: u,
        color: v,
        label: String(n.label || (u === "distress" ? "Distress signal" : "Signal located")).slice(0, 120)
      }, this.selectedSystemId = o, this.planetSystemId = null, this.selectedRouteId = null, this._pendingFocusZoom = I, this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, await this.render({ force: !0 }), (X = this.bringToFront) == null || X.call(this), _ > 0 && (this._externalFocusTimeout = globalThis.setTimeout(() => {
        var B;
        ((B = this.externalFocus) == null ? void 0 : B.id) === g && this.clearSystemFocus(g);
      }, _)), !0;
    }
    clearSystemFocus(o = "") {
      return !this.externalFocus || o && this.externalFocus.id !== o ? !1 : (this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, this._pendingFocusZoom = null, this.externalFocus = null, this.rendered && this.render({ force: !0 }), !0);
    }
    _centerOnSystem(o, n, c) {
      const d = n.querySelector(".gmf-map-stage");
      if (!d) return;
      const m = d.getBoundingClientRect();
      this.zoom = c, this.panX = m.width / 2 - Number(o.x) / 100 * m.width * c, this.panY = m.height / 2 - Number(o.y) / 100 * m.height * c, this._applyViewportTransform(n);
    }
    _getVisibleSystems() {
      var n;
      const o = p(this.mapId);
      return o ? ((n = h(o, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      })) == null ? void 0 : n.systems) ?? [] : [];
    }
    _applySearchState(o, n) {
      var m;
      const c = String(o || "").trim().toLocaleLowerCase(), d = Array.from(n.querySelectorAll("[data-system-id]"));
      return d.forEach((g) => {
        const u = String(g.dataset.searchText || "").toLocaleLowerCase(), v = !!(c && u.includes(c));
        g.classList.toggle("is-search-match", v), g.classList.toggle("is-search-dimmed", !!(c && !v));
      }), (m = n.querySelector("[data-action='clear-system-search']")) == null || m.toggleAttribute("hidden", !c), d.find((g) => g.classList.contains("is-search-match")) ?? null;
    }
    _focusSearchResult(o, n) {
      var u;
      const c = String(o || "").trim().toLocaleLowerCase();
      if (!c) {
        (u = n.querySelector("[data-system-search]")) == null || u.focus();
        return;
      }
      const d = this._getVisibleSystems(), m = (v) => [v.displayName, v.displayType, v.displayStatus, v.factionName].filter(Boolean).join(" ").toLocaleLowerCase(), g = d.find((v) => v.displayName.toLocaleLowerCase() === c) ?? d.find((v) => v.displayName.toLocaleLowerCase().startsWith(c)) ?? d.find((v) => m(v).includes(c));
      if (!g) {
        de(`No charted system matches "${String(o).trim()}".`);
        return;
      }
      this.searchQuery = String(o), this.selectedSystemId = g.id, this.selectedRouteId = null, this._centerOnSystem(g, n, Math.max(this.zoom, 1.2)), this.render({ force: !0 });
    }
    _scanSelectedSystem(o) {
      if (!this.selectedSystemId) return;
      const n = Array.from(o.querySelectorAll("[data-system-id]")).find((m) => m.dataset.systemId === this.selectedSystemId);
      if (!n) return;
      n.classList.remove("is-scanning"), n.offsetWidth, n.classList.add("is-scanning");
      const c = this._getVisibleSystems().find((m) => m.id === this.selectedSystemId), d = globalThis.setTimeout(() => {
        n.classList.remove("is-scanning"), this._effectTimeouts.delete(d), c && de(`Sensor sweep complete: ${c.displayName}.`);
      }, 1800);
      this._effectTimeouts.add(d);
    }
    showSystemPing(o, n = {}) {
      var u;
      const c = this.element instanceof HTMLElement ? this.element : (u = this.element) == null ? void 0 : u[0];
      if (!c) return !1;
      const d = Array.from(c.querySelectorAll("[data-system-id]")).find((v) => v.dataset.systemId === o);
      if (!d) return !1;
      const m = document.createElement("span");
      m.className = "gmf-system-ping", m.style.setProperty("--gmf-ping-color", /^#[0-9a-f]{6}$/i.test(n.color ?? "") ? n.color : "#58d8ff"), m.title = n.userName ? `Ping from ${n.userName}` : "System ping", m.setAttribute("aria-hidden", "true"), d.appendChild(m);
      const g = globalThis.setTimeout(() => {
        m.remove(), this._effectTimeouts.delete(g);
      }, 3e3);
      return this._effectTimeouts.add(g), !0;
    }
    _onWheelZoom(o, n) {
      o.preventDefault();
      const c = n.querySelector(".gmf-map-stage");
      if (!c) return;
      const d = c.getBoundingClientRect(), m = this.zoom, g = ne(m + (o.deltaY < 0 ? 0.12 : -0.12), at, it), u = o.clientX - d.left, v = o.clientY - d.top, _ = (u - this.panX) / m, I = (v - this.panY) / m;
      this.zoom = g, this.panX = u - _ * g, this.panY = v - I * g, this._applyViewportTransform(n);
    }
    _startPan(o, n) {
      if (o.button !== 0 || o.target.closest("[data-system-id], [data-route-id], button, input")) return;
      o.preventDefault();
      const c = o.clientX, d = o.clientY, m = this.panX, g = this.panY, u = (_) => {
        this.panX = m + _.clientX - c, this.panY = g + _.clientY - d, this._applyViewportTransform(n);
      }, v = () => {
        window.removeEventListener("pointermove", u), window.removeEventListener("pointerup", v);
      };
      window.addEventListener("pointermove", u), window.addEventListener("pointerup", v, { once: !0 });
    }
    _startSystemDrag(o, n, c) {
      var B;
      if (o.button !== 0) return;
      o.preventDefault(), o.stopPropagation(), (B = c.setPointerCapture) == null || B.call(c, o.pointerId);
      const d = o.clientX, m = o.clientY;
      let g = this._pointerToMapPercent(o, n), u = !1, v = null;
      const _ = Array.from(n.querySelectorAll(`[data-route-from="${c.dataset.systemId}"]`)), I = Array.from(n.querySelectorAll(`[data-route-to="${c.dataset.systemId}"]`));
      c.classList.add("is-dragging");
      const H = (K) => {
        const ue = Math.abs(K.clientX - d), ae = Math.abs(K.clientY - m);
        u = u || ue > 3 || ae > 3, g = this._pointerToMapPercent(K, n), c.dataset.dragged = u ? "true" : "false", !v && (v = requestAnimationFrame(() => {
          v = null, c.style.left = `${g.x}%`, c.style.top = `${g.y}%`, this._updateConnectedRoutes(_, I, g.x, g.y);
        }));
      }, X = async () => {
        v && cancelAnimationFrame(v), c.style.left = `${g.x}%`, c.style.top = `${g.y}%`, this._updateConnectedRoutes(_, I, g.x, g.y), c.classList.remove("is-dragging"), window.removeEventListener("pointermove", H), window.removeEventListener("pointerup", X), u && await $e(this.mapId, c.dataset.systemId, g.x, g.y);
      };
      window.addEventListener("pointermove", H), window.addEventListener("pointerup", X, { once: !0 });
    }
    _pointerToMapPercent(o, n) {
      const d = n.querySelector(".gmf-map-stage").getBoundingClientRect();
      return {
        x: ne((o.clientX - d.left - this.panX) / this.zoom / d.width * 100, 0, 100),
        y: ne((o.clientY - d.top - this.panY) / this.zoom / d.height * 100, 0, 100)
      };
    }
    _updateConnectedRoutes(o, n, c, d) {
      o.forEach((m) => {
        m.setAttribute("x1", c), m.setAttribute("y1", d);
      }), n.forEach((m) => {
        m.setAttribute("x2", c), m.setAttribute("y2", d);
      });
    }
    _openContextMenu(o, n) {
      var ue;
      if (!((ue = game.user) != null && ue.isGM) || this.playerMode || o.target.closest(".gmf-map-toolbar, .gmf-context-menu")) return;
      o.preventDefault(), o.stopPropagation();
      const c = o.target.closest("[data-route-id]"), d = o.target.closest("[data-system-id]"), m = this._pointerToMapPercent(o, n);
      this._contextTarget = c ? { type: "route", id: c.dataset.routeId, position: m } : d ? { type: "system", id: d.dataset.systemId, position: m } : { type: "stage", id: null, position: m };
      const g = n.querySelector("[data-gmf-context-menu]");
      if (!g) return;
      g.querySelectorAll("[data-context-show]").forEach((ae) => {
        ae.hidden = ae.dataset.contextShow !== this._contextTarget.type;
      }), g.hidden = !1;
      const u = g.offsetWidth || 184, v = g.offsetHeight || 260, I = n.querySelector(".gmf-map-stage").getBoundingClientRect(), H = o.clientX - I.left, X = o.clientY - I.top, B = Math.max(4, I.width - u - 4), K = Math.max(4, I.height - v - 4);
      g.style.left = `${ne(H, 4, B)}px`, g.style.top = `${ne(X, 4, K)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(n), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _openStageMenuFromButton(o, n) {
      var g;
      if (!((g = game.user) != null && g.isGM) || this.playerMode) return;
      o.preventDefault(), o.stopPropagation();
      const c = n.querySelector(".gmf-map-stage"), d = c == null ? void 0 : c.getBoundingClientRect();
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
      this._openContextMenu(m, n);
    }
    _hideContextMenu(o = null) {
      var d, m, g;
      const n = o ?? this.element ?? null, c = ((d = n == null ? void 0 : n.querySelector) == null ? void 0 : d.call(n, "[data-gmf-context-menu]")) ?? ((g = (m = n == null ? void 0 : n[0]) == null ? void 0 : m.querySelector) == null ? void 0 : g.call(m, "[data-gmf-context-menu]"));
      c && (c.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(o, n) {
      o.preventDefault(), o.stopPropagation();
      const c = o.currentTarget.dataset.contextAction, d = this._contextTarget;
      this._hideContextMenu(n), d && (c === "add-system" ? S(this.mapId, null, { x: d.position.x, y: d.position.y }) : c === "add-route" ? M(this.mapId) : c === "manage-factions" ? x(this.mapId) : c === "add-faction" ? C(this.mapId) : c === "edit-map-details" ? $(this.mapId) : c === "export-map" ? O(this.mapId) : c === "edit-system" ? S(this.mapId, d.id) : c === "add-route-from-system" ? M(this.mapId, null, { fromSystemId: d.id }) : c === "reveal-system" ? await T(this.mapId, d.id) : c === "hide-system" ? await N(this.mapId, d.id, !0) : c === "delete-system" ? await this._confirmDeleteSystem(d.id) : c === "edit-route" ? M(this.mapId, d.id) : c === "reveal-route" ? await w(this.mapId, d.id) : c === "hide-route" ? await se(this.mapId, d.id, !0) : c === "delete-route" && await this._confirmDeleteRoute(d.id));
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
      }) && await be(this.mapId, o);
    }
    async _travelToSystem(o, n) {
      const c = A(p(this.mapId)), d = c.systems.find((u) => u.id === c.currentSystemId), m = c.systems.find((u) => u.id === o);
      if (!m) return;
      if (!d) {
        await D(this.mapId, m.id), de(`Current location set to ${m.name}.`);
        return;
      }
      if (d.id === m.id) {
        de(`${m.name} is already the current location.`);
        return;
      }
      if (!Ie(c, d.id, m.id)) {
        oe(`No direct route from ${d.name} to ${m.name}.`);
        return;
      }
      we(this.mapId, d.id, m.id), await this._animateShipTravel(d, m, n), await D(this.mapId, m.id), de(`Arrived at ${m.name}.`);
    }
    _animateShipTravel(o, n, c) {
      const d = c.querySelector("[data-ship-layer]"), m = c.querySelector(".gmf-map-stage");
      if (!d || !m) return Promise.resolve();
      const g = m.getBoundingClientRect(), u = (n.x - o.x) * g.width / 100, v = (n.y - o.y) * g.height / 100, _ = Math.atan2(v, u) * 180 / Math.PI, I = document.createElement("div");
      return I.className = "gmf-travel-ship", I.innerHTML = '<i class="fa-solid fa-rocket"></i>', I.style.left = `${o.x}%`, I.style.top = `${o.y}%`, I.style.setProperty("--gmf-ship-angle", `${_}deg`), d.replaceChildren(I), new Promise((H) => {
        let X = !1;
        const B = () => {
          X || (X = !0, I.removeEventListener("transitionend", B), I.classList.add("is-arrived"), globalThis.setTimeout(() => {
            I.remove(), H();
          }, 260));
        };
        I.addEventListener("transitionend", B, { once: !0 }), requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            I.style.left = `${n.x}%`, I.style.top = `${n.y}%`;
          });
        }), globalThis.setTimeout(B, _t);
      });
    }
    _openLinkedJournal() {
      var c, d;
      const o = this._getSelectedRawSystem();
      if (!(o != null && o.journalId)) return;
      const n = (c = game.journal) == null ? void 0 : c.get(o.journalId);
      if (!n) {
        oe(`Journal "${o.journalId}" was not found.`);
        return;
      }
      (d = n.sheet) == null || d.render(!0);
    }
    _openLinkedScene() {
      var d, m;
      const o = this._getSelectedRawSystem(), n = (d = o == null ? void 0 : o.sceneIds) == null ? void 0 : d.find((g) => {
        var u;
        return (u = game.scenes) == null ? void 0 : u.get(g);
      });
      if (!n) {
        oe("No available scene is linked to this system.");
        return;
      }
      const c = game.scenes.get(n);
      c != null && c.view ? c.view() : (m = c == null ? void 0 : c.sheet) == null || m.render(!0);
    }
    _getSelectedRawSystem() {
      var n;
      const o = p(this.mapId);
      return ((n = o == null ? void 0 : o.systems) == null ? void 0 : n.find((c) => c.id === this.selectedSystemId)) ?? null;
    }
    async close(o = {}) {
      return this._disposePlanetRenderer(), this._hideContextMenu(), this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, this._effectTimeouts.forEach((n) => globalThis.clearTimeout(n)), this._effectTimeouts.clear(), L(this), super.close(o);
    }
    _disposePlanetRenderer() {
      var o;
      this._planetGeneration++, (o = this._planetRenderer) == null || o.dispose(), this._planetRenderer = null;
    }
    _setPlanetFallback(o, n) {
      const c = o.querySelector(".gmf-planet-fallback");
      c && (c.style.backgroundImage = `url(${JSON.stringify(n.texture)})`);
      const d = o.querySelector("[data-planet-canvas]");
      d && (d.dataset.planetShape = n.shape);
      const m = o.querySelector(".gmf-planet-stage");
      m == null || m.style.setProperty("--gmf-planet-color", n.color);
      const g = o.querySelector("[data-planet-appearance]");
      g && (g.textContent = n.label);
    }
    async _mountPlanetRenderer(o, n) {
      const c = o.querySelector("[data-planet-canvas]");
      if (!c || !n) return;
      this._setPlanetFallback(o, n);
      const d = this._planetGeneration, m = o.querySelector("[data-planet-status]"), g = o.querySelector("[data-action='planet-static']"), u = o.querySelectorAll("[data-planet-control]");
      if (g && (g.textContent = this.planetStatic ? "Enable 3D" : "Static view", g.setAttribute("aria-pressed", String(this.planetStatic))), this.planetStatic) {
        m && (m.textContent = "Static preview · Enable 3D to rotate and zoom"), u.forEach((v) => v.disabled = !0);
        return;
      }
      try {
        const { createPlanetRenderer: v } = await import("./chunks/planet-renderer-Cw1Z4oD7.js");
        if (d !== this._planetGeneration || !c.isConnected) return;
        u.forEach((_) => _.disabled = !1), this._planetRenderer = v(c, {
          texture: n.texture,
          shape: n.shape,
          isVisible: () => !this.minimized && !this._minimized,
          onStatus: (_) => {
            m && (m.textContent = _);
          },
          onPaused: (_) => {
            const I = o.querySelector("[data-action='planet-pause']");
            I && (I.textContent = _ ? "Resume rotation" : "Pause rotation", I.setAttribute("aria-pressed", String(_)));
          },
          onStopped: () => {
            u.forEach((_) => _.disabled = !0), m && (m.textContent = "Static preview · Reopen this planet to resume 3D");
          }
        });
      } catch {
        u.forEach((v) => v.disabled = !0), m && (m.textContent = "3D could not be loaded. Static preview shown.");
      }
    }
  }, R(Q, "DEFAULT_OPTIONS", {
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
  }), R(Q, "PARTS", {
    main: {
      template: `${y}/galaxy-map.hbs`
    }
  }), Q;
}
const he = "galaxy-map", nt = "maps", G = `module.${he}`, Te = `modules/${he}/templates`;
function ts(r) {
  return String(r || "galaxy-map").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "galaxy-map";
}
function ss(r, y) {
  const p = new Blob([JSON.stringify(y, null, 2)], { type: "application/json" }), h = URL.createObjectURL(p), S = document.createElement("a");
  S.href = h, S.download = r, document.body.appendChild(S), S.click(), S.remove(), URL.revokeObjectURL(h);
}
function E(r) {
  const y = document.createElement("div");
  return y.textContent = String(r ?? ""), y.innerHTML;
}
function ee(r, y) {
  return r.map((p) => {
    const h = typeof p == "string" ? p : p.value, S = typeof p == "string" ? p : p.label;
    return `<option value="${E(h)}" ${h === y ? "selected" : ""}>${E(S)}</option>`;
  }).join("");
}
function as(r, y) {
  const p = (r == null ? void 0 : r.contents) ?? [];
  return [
    { value: "", label: "None" },
    ...p.map((h) => ({ value: h.id, label: h.name }))
  ].map((h) => `<option value="${E(h.value)}" ${h.value === y ? "selected" : ""}>${E(h.label)}</option>`).join("");
}
function is(r, y, p) {
  const h = (r == null ? void 0 : r.contents) ?? [], S = new Set(Array.isArray(y) ? y.map(String) : y ? [String(y)] : []), M = new Set(h.map((x) => String(x.id))), C = [
    ...h.map((x) => ({ value: String(x.id), label: String(x.name || x.id), missing: !1 })),
    ...[...S].filter((x) => !M.has(x)).map((x) => ({ value: x, label: `Missing scene (${x})`, missing: !0 }))
  ];
  return C.length ? C.map((x) => `
    <label class="gmf-scene-picker__option ${x.missing ? "is-missing" : ""}">
      <input type="checkbox" name="${E(p)}" value="${E(x.value)}" ${S.has(x.value) ? "checked" : ""} />
      <span>${E(x.label)}</span>
    </label>
  `).join("") : '<p class="gmf-scene-picker__empty">No scenes exist in this world yet.</p>';
}
function Fe(r) {
  return (r == null ? void 0 : r[0]) ?? r ?? null;
}
function ns(r) {
  var S;
  const y = Fe(r), p = (S = y == null ? void 0 : y.matches) != null && S.call(y, "form") ? y : y == null ? void 0 : y.querySelector("form"), h = {};
  for (const [M, C] of new FormData(p).entries())
    h[M] === void 0 ? h[M] = C : Array.isArray(h[M]) ? h[M].push(C) : h[M] = [h[M], C];
  return h;
}
(() => {
  let r = null;
  const y = /* @__PURE__ */ new Map();
  let p = null;
  const h = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map();
  function x(e) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? {}));
  }
  function $(e) {
    var t;
    (t = ui.notifications) == null || t.error(`[Galaxy Map] ${e}`);
  }
  function T(e) {
    var t;
    (t = ui.notifications) == null || t.info(`[Galaxy Map] ${e}`);
  }
  function w(e = "change galaxy maps") {
    var t;
    return (t = game.user) != null && t.isGM ? !0 : ($(`Only a GM can ${e}.`), !1);
  }
  function N() {
    var e;
    return ((e = game.users) == null ? void 0 : e.contents) ?? Array.from(game.users ?? []);
  }
  function se() {
    return N().filter((e) => e.active);
  }
  function me() {
    return se().filter((e) => e.isGM).sort((e, t) => String(e.id).localeCompare(String(t.id)))[0] ?? null;
  }
  function be() {
    var e, t;
    return !!((e = game.user) != null && e.isGM && ((t = me()) == null ? void 0 : t.id) === game.user.id);
  }
  function D() {
    return x(game.settings.get(he, nt) ?? {});
  }
  async function U(e) {
    return w("save galaxy map data") && await game.settings.set(he, nt, e ?? {}), e;
  }
  function Ee(e) {
    var V;
    const t = Fe(e);
    t == null || t.querySelectorAll("[data-browse-target]").forEach((k) => {
      k.addEventListener("click", (te) => {
        te.preventDefault();
        const Y = t.querySelector(`[name="${k.dataset.browseTarget}"]`);
        Y && new FilePicker({
          type: "image",
          current: Y.value,
          callback: (ce) => {
            Y.value = ce, Y.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        }).browse();
      });
    });
    const a = t == null ? void 0 : t.querySelector("[data-texture-upload-fields]"), s = t == null ? void 0 : t.querySelector('[name="planetTexture"]'), i = t == null ? void 0 : t.querySelector("[data-texture-upload-status]"), l = t == null ? void 0 : t.querySelector('[name="planetPreset"]'), f = t == null ? void 0 : t.querySelector('[name="planetShape"]'), q = t == null ? void 0 : t.querySelector("[data-texture-guide]"), z = (t == null ? void 0 : t.querySelectorAll("[data-texture-guide-preview]")) ?? [], F = () => {
      var te;
      if (!q) return;
      const k = (te = s == null ? void 0 : s.value) == null ? void 0 : te.trim();
      k ? (q.dataset.hasTexture = "true", i && (i.textContent = "Loading custom texture preview…"), z.forEach((Y) => {
        Y.hidden = !1, Y.onload = () => {
          var ce;
          ((ce = s == null ? void 0 : s.value) == null ? void 0 : ce.trim()) === k && i && (i.textContent = "Custom texture selected · visible beneath the guide");
        }, Y.onerror = () => {
          var ce;
          Y.hidden = !0, ((ce = s == null ? void 0 : s.value) == null ? void 0 : ce.trim()) === k && i && (i.textContent = "Custom texture selected, but its preview could not be loaded");
        }, Y.src = k;
      })) : (delete q.dataset.hasTexture, z.forEach((Y) => {
        Y.onload = null, Y.onerror = null, Y.removeAttribute("src"), Y.hidden = !0;
      }));
    }, Z = () => {
      var k;
      i && (i.textContent = (k = s == null ? void 0 : s.value) != null && k.trim() ? "Loading custom texture preview…" : "Choose an image to preview it beneath the guide"), F();
    };
    l == null || l.addEventListener("change", () => {
      const k = l.value === "custom";
      a && (a.hidden = !k), !k && (s != null && s.value) && (s.value = "", s.dispatchEvent(new Event("change", { bubbles: !0 })));
    }), (V = t == null ? void 0 : t.querySelector("[data-clear-planet-texture]")) == null || V.addEventListener("click", () => {
      s && (s.value = "", s.dispatchEvent(new Event("change", { bubbles: !0 })));
    }), s == null || s.addEventListener("change", Z), f == null || f.addEventListener("change", () => {
      q && (q.dataset.shape = f.value);
    }), Z();
  }
  function fe({ title: e, content: t, submitLabel: a = "Save", onSubmit: s, render: i = Ee }) {
    new Dialog({
      title: e,
      content: t,
      render: i,
      buttons: {
        save: {
          icon: '<i class="fa-solid fa-floppy-disk"></i>',
          label: a,
          callback: (l) => s(ns(l))
        },
        cancel: {
          icon: '<i class="fa-solid fa-xmark"></i>',
          label: "Cancel"
        }
      },
      default: "save"
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog"],
      width: 700
    }).render(!0);
  }
  function O(e) {
    const t = D();
    return t[e] ? x(t[e]) : null;
  }
  function Ie(e) {
    return new Map((e ?? []).map((t) => [t.id, t]));
  }
  function we(e) {
    return e.visibility === "players";
  }
  function de(e, t) {
    return t && e.status === "undiscovered";
  }
  function oe(e, { playerMode: t = !1, selectedSystemId: a = null, selectedRouteId: s = null } = {}) {
    var ce, gt;
    const i = A(e), l = t ? i.systems.filter(we) : i.systems, f = new Set(l.map((b) => b.id)), q = t ? i.factions.filter((b) => b.visibility === "players") : i.factions, z = Ie(q), F = l.map((b) => {
      const ie = z.get(b.factionId), W = de(b, t), Re = { station: "station", anomaly: "diamond", ruins: "diamond", unknown: "diamond" }, yt = W ? "unknown" : b.type, st = W ? "diamond" : b.iconStyle === "planet" ? Re[yt] ?? b.iconStyle : b.iconStyle;
      return {
        ...b,
        iconStyle: st,
        displayName: W ? "???" : b.name,
        displayDescription: W ? "Unresolved sensor contact. Details are not available." : b.description,
        displayType: yt,
        displayStatus: W ? "undiscovered" : b.status,
        factionName: (ie == null ? void 0 : ie.name) ?? "Unaffiliated",
        factionColor: b.iconColor || (ie == null ? void 0 : ie.color) || "#58d8ff",
        obscured: W,
        isCurrent: b.id === i.currentSystemId,
        isSelected: b.id === a,
        gmOnly: b.visibility === "gm",
        animatedCelestial: Yt.includes(st),
        hasAlert: ["danger", "locked"].includes(W ? "undiscovered" : b.status),
        alertLabel: b.status === "danger" ? "Hazard advisory" : b.status === "locked" ? "Restricted access" : "",
        hasJournal: !!(!W && b.journalId),
        hasScenes: !!(!W && b.sceneIds.length),
        showImage: !!(!W && b.image),
        canInspectPlanet: !!Ze({ ...b, iconStyle: st, obscured: W })
      };
    }), Z = i.routes.filter((b) => !t || b.visibility === "players").filter((b) => f.has(b.fromSystemId) && f.has(b.toSystemId)).map((b) => {
      const ie = F.find((Re) => Re.id === b.fromSystemId), W = F.find((Re) => Re.id === b.toSystemId);
      return {
        ...b,
        from: ie,
        to: W,
        fromName: (ie == null ? void 0 : ie.displayName) ?? b.fromSystemId,
        toName: (W == null ? void 0 : W.displayName) ?? b.toSystemId,
        isSelected: b.id === s,
        connectsCurrent: b.fromSystemId === i.currentSystemId || b.toSystemId === i.currentSystemId,
        gmOnly: b.visibility === "gm"
      };
    }), V = Z.find((b) => b.id === s) ?? null, k = V ? null : F.find((b) => b.id === a) ?? F[0] ?? null;
    k && (k.isSelected = !0);
    const te = F.find((b) => b.id === i.currentSystemId) ?? F[0] ?? null, Y = k && te && k.id !== te.id ? Z.find((b) => b.fromSystemId === te.id && b.toSystemId === k.id || b.toSystemId === te.id && b.fromSystemId === k.id) : null;
    return k && (k.canTravel = !!Y, k.travelRouteId = (Y == null ? void 0 : Y.id) ?? "", k.isCurrent = k.id === (te == null ? void 0 : te.id), k.isDestination = !!(Y && !k.isCurrent)), Z.forEach((b) => {
      b.isActive = b.isSelected || b.id === (Y == null ? void 0 : Y.id);
    }), {
      ...i,
      systems: F,
      routes: Z,
      factions: q,
      selectedSystem: k,
      selectedRoute: V,
      currentSystem: te,
      selectedType: V ? "route" : "system",
      playerMode: t,
      isGM: ((ce = game.user) == null ? void 0 : ce.isGM) ?? !1,
      canEdit: ((gt = game.user) == null ? void 0 : gt.isGM) && !t
    };
  }
  async function $e(e = {}) {
    if (!w("create galaxy maps")) return null;
    const t = D(), a = A(e);
    return t[a.id] = a, await U(t), J(a.id), x(a);
  }
  async function ke(e, t = {}) {
    if (!w("update galaxy maps")) return null;
    const a = D();
    if (!a[e])
      return $(`Map "${e}" was not found.`), null;
    const s = A({ ...t, id: e });
    return a[e] = s, await U(a), J(e), x(s);
  }
  async function j(e, t = {}) {
    if (!w("update galaxy map metadata")) return null;
    const a = O(e);
    return a ? ke(e, {
      ...a,
      title: t.title,
      subtitle: t.subtitle,
      description: t.description,
      backgroundImage: t.backgroundImage,
      visibility: t.visibility
    }) : ($(`Map "${e}" was not found.`), null);
  }
  async function L(e) {
    if (!w("delete galaxy maps")) return !1;
    const t = D();
    return t[e] ? (delete t[e], await U(t), Rt(e), J(), !0) : !1;
  }
  async function Q(e) {
    if (!w("duplicate galaxy maps")) return null;
    const t = O(e);
    if (!t)
      return $(`Map "${e}" was not found.`), null;
    const a = A({
      ...t,
      id: re("map"),
      title: `${t.title} Copy`
    }), s = D();
    return s[a.id] = a, await U(s), J(a.id), x(a);
  }
  async function pe(e, t = {}) {
    if (!w("save star systems")) return null;
    const a = D(), s = a[e];
    if (!s)
      return $(`Map "${e}" was not found.`), null;
    const i = rt(t), l = s.systems.findIndex((f) => f.id === i.id);
    return l >= 0 ? s.systems[l] = i : s.systems.push(i), a[e] = A(s), await U(a), J(e), game.socket.emit(G, { action: "refresh", mapId: e }), x(i);
  }
  async function le(e, t) {
    var i;
    if (!w("delete star systems")) return !1;
    const a = D(), s = a[e];
    return s ? (s.systems = s.systems.filter((l) => l.id !== t), s.routes = s.routes.filter((l) => l.fromSystemId !== t && l.toSystemId !== t), s.currentSystemId === t && (s.currentSystemId = ((i = s.systems[0]) == null ? void 0 : i.id) ?? ""), a[e] = A(s), await U(a), J(e), game.socket.emit(G, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function o(e, t) {
    var l;
    if (!w("set current location")) return null;
    const a = D(), s = a[e], i = (l = s == null ? void 0 : s.systems) == null ? void 0 : l.find((f) => f.id === t);
    return i ? (s.currentSystemId = t, a[e] = A(s), await U(a), J(e), game.socket.emit(G, { action: "refresh", mapId: e }), x(i)) : ($(`System "${t}" was not found.`), null);
  }
  async function n(e, t = {}) {
    if (!w("save routes")) return null;
    const a = D(), s = a[e];
    if (!s)
      return $(`Map "${e}" was not found.`), null;
    const i = ot(t);
    if (!i.fromSystemId || !i.toSystemId || i.fromSystemId === i.toSystemId)
      return $("Routes require two different systems."), null;
    const l = s.routes.findIndex((f) => f.id === i.id);
    return l >= 0 ? s.routes[l] = i : s.routes.push(i), a[e] = A(s), await U(a), J(e), game.socket.emit(G, { action: "refresh", mapId: e }), x(i);
  }
  async function c(e, t) {
    if (!w("delete routes")) return !1;
    const a = D(), s = a[e];
    return s ? (s.routes = s.routes.filter((i) => i.id !== t), a[e] = A(s), await U(a), J(e), game.socket.emit(G, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function d(e, t = {}) {
    if (!w("save factions")) return null;
    const a = D(), s = a[e];
    if (!s)
      return $(`Map "${e}" was not found.`), null;
    const i = lt(t), l = s.factions.findIndex((f) => f.id === i.id);
    return l >= 0 ? s.factions[l] = i : s.factions.push(i), a[e] = A(s), await U(a), J(e), game.socket.emit(G, { action: "refresh", mapId: e }), x(i);
  }
  async function m(e, t) {
    if (!w("delete factions")) return !1;
    const a = D(), s = a[e];
    if (!s) return !1;
    s.factions = s.factions.filter((i) => i.id !== t);
    for (const i of s.systems)
      i.factionId === t && (i.factionId = "");
    return a[e] = A(s), await U(a), J(e), game.socket.emit(G, { action: "refresh", mapId: e }), !0;
  }
  async function g(e, t, a = !0) {
    var f;
    if (!w(a ? "hide factions" : "reveal factions")) return null;
    const s = D(), i = s[e], l = (f = i == null ? void 0 : i.factions) == null ? void 0 : f.find((q) => q.id === t);
    return l ? (l.visibility = a ? "gm" : "players", s[e] = A(i), await U(s), J(e), game.socket.emit(G, { action: "refresh", mapId: e }), T(`${l.name} ${a ? "hidden from" : "visible to"} players.`), x(l)) : ($(`Faction "${t}" was not found.`), null);
  }
  async function u(e, t, a, s) {
    var q;
    if (!w("move star systems")) return null;
    const i = D(), l = i[e], f = (q = l == null ? void 0 : l.systems) == null ? void 0 : q.find((z) => z.id === t);
    return f ? (f.x = ne(_e(a, f.x), 0, 100), f.y = ne(_e(s, f.y), 0, 100), i[e] = A(l), await U(i), game.socket.emit(G, { action: "refresh", mapId: e }), x(f)) : ($(`System "${t}" was not found.`), null);
  }
  async function v(e, t, { notify: a = !0 } = {}) {
    var f;
    if (!w("reveal star systems")) return null;
    const s = D(), i = s[e], l = (f = i == null ? void 0 : i.systems) == null ? void 0 : f.find((q) => q.id === t);
    return l ? (l.visibility = "players", (l.status === "undiscovered" || l.status === "locked") && (l.status = "known"), s[e] = A(i), await U(s), J(e), game.socket.emit(G, { action: "refresh", mapId: e }), a && X(e, l.id), T(`${l.name} revealed to players.`), x(l)) : ($(`System "${t}" was not found.`), null);
  }
  async function _(e, t, a = !0) {
    var f;
    if (!w(a ? "hide star systems" : "reveal star systems")) return null;
    const s = D(), i = s[e], l = (f = i == null ? void 0 : i.systems) == null ? void 0 : f.find((q) => q.id === t);
    return l ? (l.visibility = a ? "gm" : "players", s[e] = A(i), await U(s), J(e), game.socket.emit(G, { action: "refresh", mapId: e }), T(`${l.name} ${a ? "hidden from" : "visible to"} players.`), x(l)) : ($(`System "${t}" was not found.`), null);
  }
  async function I(e, t) {
    var l;
    if (!w("reveal routes")) return null;
    const a = D(), s = a[e], i = (l = s == null ? void 0 : s.routes) == null ? void 0 : l.find((f) => f.id === t);
    return i ? (i.visibility = "players", a[e] = A(s), await U(a), J(e), game.socket.emit(G, { action: "refresh", mapId: e }), T("Route revealed to players."), x(i)) : ($(`Route "${t}" was not found.`), null);
  }
  async function H(e, t, a = !0) {
    var f;
    if (!w(a ? "hide routes" : "reveal routes")) return null;
    const s = D(), i = s[e], l = (f = i == null ? void 0 : i.routes) == null ? void 0 : f.find((q) => q.id === t);
    return l ? (l.visibility = a ? "gm" : "players", s[e] = A(i), await U(s), J(e), game.socket.emit(G, { action: "refresh", mapId: e }), T(`Route ${a ? "hidden from" : "visible to"} players.`), x(l)) : ($(`Route "${t}" was not found.`), null);
  }
  function X(e, t) {
    var i;
    if (!w("notify players about discoveries")) return;
    const a = O(e), s = (i = a == null ? void 0 : a.systems) == null ? void 0 : i.find((l) => l.id === t);
    if (!s) {
      $(`System "${t}" was not found.`);
      return;
    }
    game.socket.emit(G, {
      action: "notify",
      mapId: e,
      systemId: t,
      message: `New System Discovered: ${s.name}`
    }), T(`Discovery notification sent: ${s.name}.`);
  }
  function B(e) {
    Me(e.mapId).forEach((t) => {
      var a;
      return (a = t.showSystemPing) == null ? void 0 : a.call(t, e.systemId, e);
    });
  }
  function K(e, t) {
    var q, z, F, Z;
    const a = O(e), s = a ? A(a) : null, i = s == null ? void 0 : s.systems.find((V) => V.id === t);
    if (!s || !i)
      return $(`System "${t}" was not found.`), null;
    if (!((q = game.user) != null && q.isGM) && (s.visibility !== "players" || i.visibility !== "players"))
      return $("That system is not available on the player map."), null;
    const l = String(((z = game.user) == null ? void 0 : z.color) || ""), f = {
      action: "system-ping",
      pingId: re("ping"),
      mapId: e,
      systemId: t,
      userId: (F = game.user) == null ? void 0 : F.id,
      userName: String(((Z = game.user) == null ? void 0 : Z.name) || "Navigator").slice(0, 80),
      color: /^#[0-9a-f]{6}$/i.test(l) ? l : "#58d8ff"
    };
    return game.socket.emit(G, f), B(f), f;
  }
  async function ue(e, { replace: t = !1 } = {}) {
    if (!w("import galaxy maps")) return null;
    const a = D();
    let s = A(e);
    return a[s.id] && !t && (s = A({
      ...s,
      id: re("map"),
      title: `${s.title} Import`
    })), a[s.id] = s, await U(a), J(s.id), T(`Imported ${s.title}.`), x(s);
  }
  function ae(e) {
    const t = O(e);
    if (!t) {
      $(`Map "${e}" was not found.`);
      return;
    }
    ss(`${ts(t.title)}.json`, A(t));
  }
  function Ne(e) {
    return `
      <div class="gmf-texture-guide" data-texture-guide data-shape="${E(e)}">
        <figure data-guide-shape="sphere">
          <div class="gmf-uv-map gmf-uv-map--sphere" aria-hidden="true">
            <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
            <b class="gmf-uv-guide-grid"></b>
            <span class="gmf-uv-pole gmf-uv-pole--north">North pole · 15%</span>
            <span class="gmf-uv-equator">Equator · 50%</span>
            <span class="gmf-uv-pole gmf-uv-pole--south">South pole · 15%</span>
            <i class="gmf-uv-seam">wrap seam</i>
          </div>
          <figcaption><strong>2048×1024 · 2:1</strong> Left and right join. Keep important details out of the pale polar bands, where the image pinches to a point.</figcaption>
        </figure>
        <figure data-guide-shape="asteroid">
          <div class="gmf-uv-map gmf-uv-map--asteroid" aria-hidden="true">
            <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
            <b class="gmf-uv-guide-grid"></b>
            <span class="gmf-uv-pole gmf-uv-pole--north">Distorted pole · 15%</span>
            <span class="gmf-uv-equator">Best detail near equator · 50%</span>
            <span class="gmf-uv-pole gmf-uv-pole--south">Distorted pole · 15%</span>
            <i class="gmf-uv-seam">wrap seam</i>
          </div>
          <figcaption><strong>2048×1024 · 2:1</strong> Uses the full 8×4 grid—there are no required circles or fixed crater positions. Left and right join; place recognizable features near the equator and expect organic distortion.</figcaption>
        </figure>
        <figure data-guide-shape="donut">
          <div class="gmf-uv-map gmf-uv-map--donut" aria-hidden="true">
            <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
            <b class="gmf-uv-guide-grid"></b>
            <span class="gmf-uv-donut-ring">Around ring →</span>
            <span class="gmf-uv-donut-tube">Around tube ↓</span>
            <span class="gmf-uv-donut-landmark is-outer-top">Outer bend · 0%</span>
            <span class="gmf-uv-donut-landmark is-side-a">Side A · 25%</span>
            <span class="gmf-uv-donut-landmark is-inner">Inner bend · 50%</span>
            <span class="gmf-uv-donut-landmark is-side-b">Side B · 75%</span>
            <span class="gmf-uv-donut-landmark is-outer-bottom">Outer bend · 100%</span>
          </div>
          <figcaption><strong>2048×1024 · 2:1</strong> Top and bottom meet on the outer bend. The center line becomes the inner bend; 25% and 75% become the two sides. Left/right join as the texture travels around the ring, so all four edges must be seamless.</figcaption>
        </figure>
        <figure data-guide-shape="cube">
          <div class="gmf-uv-map gmf-uv-map--cube" aria-hidden="true">
            <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
            <b class="gmf-uv-guide-grid"></b>
            <span class="is-top">Top</span><span class="is-left">Left</span><span class="is-front">Front</span>
            <span class="is-right">Right</span><span class="is-back">Back</span><span class="is-bottom">Bottom</span>
          </div>
          <figcaption><strong>2048×1536 · 4:3</strong> The full 4×3 grid contains twelve 512px squares. Draw only in the six labeled squares; the six dim squares are unused.</figcaption>
        </figure>
        <figure data-guide-shape="cylinder">
          <div class="gmf-uv-map gmf-uv-map--cylinder" aria-hidden="true">
            <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
            <b class="gmf-uv-guide-grid"></b>
            <span class="gmf-uv-cap gmf-uv-cap--top">Top<br>25% × 25%</span>
            <span class="gmf-uv-cylinder-side">Side band · 100% × 50%<br>left/right join</span>
            <span class="gmf-uv-cap gmf-uv-cap--bottom">Bottom<br>25% × 25%</span>
            <i class="gmf-uv-row-label is-top">25%</i><i class="gmf-uv-row-label is-middle">50%</i><i class="gmf-uv-row-label is-bottom">25%</i>
          </div>
          <figcaption><strong>2048×2048 · 1:1</strong> The middle 50% (y=25–75%) is the side. Each cap is a 512px circle: top at x=12.5–37.5%, y=0–25%; bottom at x=62.5–87.5%, y=75–100%.</figcaption>
        </figure>
        <figure data-guide-shape="crystal">
          <div class="gmf-uv-map gmf-uv-map--crystal" aria-hidden="true">
            <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
            <b class="gmf-uv-guide-grid"></b>
            ${Array.from({ length: 8 }, (t, a) => `<span class="is-face-${a + 1}">Face ${a + 1}</span>`).join("")}
            <i class="gmf-uv-grid-label is-columns">4 columns · 512px each</i>
            <i class="gmf-uv-grid-label is-rows">NO GAP · center seam y=512</i>
          </div>
          <figcaption><strong>2048×1024 · 2:1</strong> Divide the image into four 512×512 columns. Each column is one diamond containing two faces: Faces 1–4 point down from the top edge; Faces 5–8 point up from the bottom edge. Their bases meet exactly at y=512—leave no gap. Only the tinted triangles are used; the untinted corner halves are ignored.</figcaption>
        </figure>
      </div>
    `;
  }
  function Oe(e, t = {}, a = {}) {
    const s = O(e), i = rt({ ...a, ...t }), l = [
      { value: "", label: "Unaffiliated" },
      ...((s == null ? void 0 : s.factions) ?? []).map((F) => ({ value: F.id, label: F.name }))
    ], f = ((s == null ? void 0 : s.factions) ?? []).find((F) => F.id === i.factionId), q = i.iconColor || (f == null ? void 0 : f.color) || "#58d8ff", z = `gmf-texture-${String(i.id).replace(/[^a-z0-9_-]/gi, "") || "system"}`;
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${E(i.id)}" />
        <input type="hidden" name="x" value="${E(i.x)}" />
        <input type="hidden" name="y" value="${E(i.y)}" />
        <label>Name <input type="text" name="name" value="${E(i.name)}" /></label>
        <div class="gmf-form-grid">
          <label>Type <select name="type">${ee(Mt, i.type)}</select></label>
          <label>Status <select name="status">${ee(xt, i.status)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Faction <select name="factionId">${ee(l, i.factionId)}</select></label>
          <label>Visibility <select name="visibility">${ee(qe, i.visibility)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Icon Style <select name="iconStyle">${ee(qt, i.iconStyle)}</select></label>
          <label>Icon Size <input type="range" name="iconSize" value="${E(i.iconSize)}" min="18" max="56" step="1" /></label>
        </div>
        <div class="gmf-form-grid">
          <label>Icon Color <input type="color" name="iconColor" value="${E(q)}" /></label>
          <label class="gmf-checkbox-label"><input type="checkbox" name="pulse" value="true" ${i.pulse ? "checked" : ""} /> Pulse Glow</label>
        </div>
        <label>Description <textarea name="description">${E(i.description)}</textarea></label>
        <fieldset>
          <legend>Planet close-up</legend>
          <div class="gmf-form-grid">
            <label>Appearance <select name="planetPreset">${ee(St, i.planetPreset)}</select></label>
            <label>3D Shape <select name="planetShape">${ee(bt, i.planetShape)}</select></label>
          </div>
          <div class="gmf-texture-upload">
            <div id="${z}" class="gmf-texture-upload__fields" data-texture-upload-fields ${i.planetPreset === "custom" ? "" : "hidden"}>
              <label>Custom texture image
                <div class="gmf-path-field">
                  <input type="text" name="planetTexture" value="${E(i.planetTexture)}" placeholder="Choose PNG, JPEG, or WebP" />
                  <button type="button" data-browse-target="planetTexture"><i class="fa-solid fa-folder-open"></i> Browse</button>
                </div>
              </label>
              <p class="gmf-scene-picker__hint" data-texture-upload-status>${i.planetTexture ? "Custom texture selected · previewed beneath the guide" : "Choose an image to preview it beneath the guide"}</p>
              <button type="button" class="gmf-button--quiet gmf-texture-upload__clear" data-clear-planet-texture>Clear custom texture</button>
              ${Ne(i.planetShape)}
            </div>
          </div>
          <p class="gmf-scene-picker__hint">Choose Custom texture to reveal the image picker and UV preview. No planet view disables the close-up for stations and other locations.</p>
        </fieldset>
        <label>Image Path
          <div class="gmf-path-field">
            <input type="text" name="image" value="${E(i.image)}" />
            <button type="button" data-browse-target="image"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
        <fieldset class="gmf-scene-picker">
          <legend>System Scenes</legend>
          <p class="gmf-scene-picker__hint">Tag every Foundry scene that belongs to this system.</p>
          <div class="gmf-scene-picker__options">
            ${is(game.scenes, i.sceneIds, "sceneIds")}
          </div>
        </fieldset>
        <label>Journal <select name="journalId">${as(game.journal, i.journalId)}</select></label>
        <label>GM Notes <textarea name="notes">${E(i.notes)}</textarea></label>
      </form>
    `;
  }
  function ze(e, t = {}, a = {}) {
    var z, F, Z;
    const s = O(e), i = { ...a, ...t }, l = (s == null ? void 0 : s.systems) ?? [];
    i.fromSystemId || (i.fromSystemId = ((z = l[0]) == null ? void 0 : z.id) ?? ""), i.toSystemId || (i.toSystemId = ((F = l.find((V) => V.id !== i.fromSystemId)) == null ? void 0 : F.id) ?? ""), i.fromSystemId && !i.toSystemId && (i.toSystemId = ((Z = l.find((V) => V.id !== i.fromSystemId)) == null ? void 0 : Z.id) ?? "");
    const f = ot(i), q = l.map((V) => ({ value: V.id, label: V.name }));
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${E(f.id)}" />
        <div class="gmf-form-grid">
          <label>From <select name="fromSystemId">${ee(q, f.fromSystemId)}</select></label>
          <label>To <select name="toSystemId">${ee(q, f.toSystemId)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Type <select name="type">${ee(Tt, f.type)}</select></label>
          <label>Visibility <select name="visibility">${ee(qe, f.visibility)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Travel Time <input type="text" name="travelTime" value="${E(f.travelTime)}" /></label>
          <label>Fuel Cost <input type="number" name="fuelCost" value="${E(f.fuelCost)}" min="0" step="1" /></label>
        </div>
        <label>Notes <textarea name="notes">${E(f.notes)}</textarea></label>
      </form>
    `;
  }
  function Ge(e = {}) {
    const t = lt(e);
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${E(t.id)}" />
        <label>Name <input type="text" name="name" value="${E(t.name)}" /></label>
        <div class="gmf-form-grid">
          <label>Color <input type="color" name="color" value="${E(t.color)}" /></label>
          <label>Visibility <select name="visibility">${ee(qe, t.visibility)}</select></label>
        </div>
        <label>Description <textarea name="description">${E(t.description)}</textarea></label>
      </form>
    `;
  }
  function je(e = {}) {
    const t = A(e);
    return `
      <form class="gmf-crud-form">
        <label>Title <input type="text" name="title" value="${E(t.title)}" /></label>
        <label>Subtitle <input type="text" name="subtitle" value="${E(t.subtitle)}" /></label>
        <label>Description <textarea name="description">${E(t.description)}</textarea></label>
        <label>Background Image
          <div class="gmf-path-field">
            <input type="text" name="backgroundImage" value="${E(t.backgroundImage)}" />
            <button type="button" data-browse-target="backgroundImage"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
        <label>Visibility <select name="visibility">${ee(qe, t.visibility)}</select></label>
        <label>Player Travel Approval <select name="travelApprovalMode">${ee(Je, t.travelApprovalMode)}</select></label>
        <p class="gmf-form-help">GM approval asks only the primary online GM. Majority counts the requester as an approval and passes at more than half of active participants. Unanimous asks every other active participant and cancels on any decline.</p>
      </form>
    `;
  }
  function Ce(e) {
    const t = O(e);
    t && fe({
      title: "Edit Galaxy Map",
      content: je(t),
      onSubmit: (a) => j(e, a)
    });
  }
  function Le(e, t = null, a = {}) {
    var l;
    const s = O(e), i = t ? (l = s == null ? void 0 : s.systems) == null ? void 0 : l.find((f) => f.id === t) : null;
    fe({
      title: i ? "Edit Star System" : "Create Star System",
      content: Oe(e, i ?? { id: re("system"), name: "New System" }, a),
      submitLabel: i ? "Save System" : "Create System",
      onSubmit: (f) => pe(e, {
        ...f,
        sceneIds: f.sceneIds ?? [],
        pulse: f.pulse === "true"
      })
    });
  }
  function Ae(e, t = null, a = {}) {
    var l;
    const s = O(e);
    if ((((l = s == null ? void 0 : s.systems) == null ? void 0 : l.length) ?? 0) < 2) {
      $("Create at least two systems before adding a route.");
      return;
    }
    const i = t ? s.routes.find((f) => f.id === t) : null;
    fe({
      title: i ? "Edit Route" : "Create Route",
      content: ze(e, i ?? { id: re("route") }, a),
      submitLabel: i ? "Save Route" : "Create Route",
      onSubmit: (f) => n(e, f)
    });
  }
  function ve(e, t = null) {
    var i;
    const a = O(e), s = t ? (i = a == null ? void 0 : a.factions) == null ? void 0 : i.find((l) => l.id === t) : null;
    fe({
      title: s ? "Edit Faction" : "Create Faction",
      content: Ge(s ?? { id: re("faction"), name: "New Faction" }),
      submitLabel: s ? "Save Faction" : "Create Faction",
      onSubmit: (l) => d(e, l)
    });
  }
  function Pe(e) {
    const t = O(e);
    if (!t) return;
    const a = A(t).factions.map((s) => `
      <article class="gmf-dialog-row">
        <div>
          <strong><span class="gmf-color-dot" style="--gmf-faction-color: ${E(s.color)};"></span>${E(s.name)}</strong>
          <span>${E(s.color)} - ${E(s.visibility)}</span>
        </div>
        <div class="gmf-row-actions">
          <button type="button" data-dialog-edit-faction="${E(s.id)}" title="Edit faction"><i class="fa-solid fa-pen"></i></button>
          <button type="button" data-dialog-delete-faction="${E(s.id)}" title="Delete faction"><i class="fa-solid fa-trash"></i></button>
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
          <div class="gmf-dialog-list">${a}</div>
        </section>
      `,
      render: (s) => {
        var l;
        const i = Fe(s);
        (l = i.querySelector("[data-dialog-add-faction]")) == null || l.addEventListener("click", () => ve(e)), i.querySelectorAll("[data-dialog-edit-faction]").forEach((f) => {
          f.addEventListener("click", () => ve(e, f.dataset.dialogEditFaction));
        }), i.querySelectorAll("[data-dialog-delete-faction]").forEach((f) => {
          f.addEventListener("click", async () => {
            await Dialog.confirm({
              title: "Delete Faction",
              content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
            }) && (await m(e, f.dataset.dialogDeleteFaction), Pe(e));
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
  function Be(e) {
    var i;
    if (!e) return null;
    const t = A(e), a = new Map(t.systems.map((l) => [l.id, l])), s = new Map(t.factions.map((l) => [l.id, l]));
    return {
      ...t,
      travelApprovalModeLabel: ((i = Je.find((l) => l.value === t.travelApprovalMode)) == null ? void 0 : i.label) ?? "Unanimous agreement",
      systems: t.systems.map((l) => {
        var f;
        return {
          ...l,
          factionName: ((f = s.get(l.factionId)) == null ? void 0 : f.name) ?? "Unaffiliated"
        };
      }),
      routes: t.routes.map((l) => {
        var f, q;
        return {
          ...l,
          fromName: ((f = a.get(l.fromSystemId)) == null ? void 0 : f.name) ?? l.fromSystemId,
          toName: ((q = a.get(l.toSystemId)) == null ? void 0 : q.name) ?? l.toSystemId
        };
      })
    };
  }
  function ge() {
    return Object.values(D()).map(A);
  }
  function Ve(e, t) {
    const a = O(e);
    if (!a) return [];
    const s = A(a).systems.find((i) => i.id === String(t));
    return s ? [...s.sceneIds] : [];
  }
  function Ye(e) {
    const t = String(e || "");
    return t ? ge().flatMap((a) => a.systems.filter((s) => s.sceneIds.includes(t)).map((s) => ({
      mapId: a.id,
      mapTitle: a.title,
      system: x(s)
    }))) : [];
  }
  function J(e = null) {
    r != null && r.rendered && r.render({ force: !0 });
    for (const [t, a] of y.entries())
      (!e || t === e) && a.render({ force: !0 });
    p != null && p.rendered && (!e || p.mapId === e) && p.render({ force: !0 });
  }
  function Me(e) {
    const t = [...y.values()];
    return p && t.push(p), t.filter((a) => (a == null ? void 0 : a.rendered) && a.mapId === e);
  }
  function Ue(e) {
    var t;
    return e.element instanceof HTMLElement ? e.element : ((t = e.element) == null ? void 0 : t[0]) ?? null;
  }
  function P(e, t, a) {
    return e.routes.find((s) => s.fromSystemId === t && s.toSystemId === a || s.toSystemId === t && s.fromSystemId === a) ?? null;
  }
  function ye(e, t) {
    const a = O(e);
    if (!a)
      return $(`Map "${e}" was not found.`), null;
    const s = A(a), i = s.systems.find((F) => F.id === s.currentSystemId), l = s.systems.find((F) => F.id === t);
    if (!l)
      return $(`System "${t}" was not found.`), null;
    if (!i)
      return $("This map does not have a current location yet. Ask the GM to set one first."), null;
    if (i.id === l.id)
      return T(`${l.name} is already the current location.`), null;
    if (s.visibility !== "players" || i.visibility !== "players" || l.visibility !== "players")
      return $("That travel destination is not visible to players."), null;
    const f = P(s, i.id, l.id);
    if (!f || f.visibility !== "players")
      return $(`No player-visible direct route from ${i.name} to ${l.name}.`), null;
    const q = me();
    if (!q)
      return $("A GM must be online to approve player travel."), null;
    const z = ht(se(), game.user.id, q, s.travelApprovalMode);
    return {
      action: "travel-request",
      requestId: re("travel"),
      mapId: e,
      mapTitle: s.title,
      fromSystemId: i.id,
      fromName: i.name,
      toSystemId: l.id,
      toName: l.name,
      routeId: f.id,
      routeType: f.type,
      travelTime: f.travelTime,
      fuelCost: f.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      approvalMode: z.approvalMode,
      voterIds: z.voterIds,
      voterNames: z.voterNames,
      requiredApprovals: z.requiredApprovals,
      participantCount: z.participantCount
    };
  }
  function xe(e, t) {
    const a = ye(e, t);
    return a ? (game.socket.emit(G, a), T(`Travel request sent: ${a.fromName} to ${a.toName}.`), a) : null;
  }
  function dt(e) {
    var f, q, z, F;
    if (!(e != null && e.requestId) || e.requesterId === ((f = game.user) == null ? void 0 : f.id) || !((z = e.voterIds) != null && z.includes((q = game.user) == null ? void 0 : q.id)) || S.has(e.requestId)) return;
    S.add(e.requestId);
    let t = !1, a = !1, s = null;
    const i = (Z) => {
      if (t) return;
      t = !0;
      const V = {
        action: "travel-vote",
        requestId: e.requestId,
        mapId: e.mapId,
        userId: game.user.id,
        userName: game.user.name,
        accepted: Z
      };
      game.socket.emit(G, V), ft(V);
    }, l = ((F = Je.find((Z) => Z.value === e.approvalMode)) == null ? void 0 : F.label) ?? "Unanimous agreement";
    s = new Dialog({
      title: "Travel Request",
      content: `
        <section class="gmf-travel-request">
          <p><strong>${E(e.requesterName)}</strong> wants to travel on <strong>${E(e.mapTitle)}</strong>.</p>
          <p>${E(e.fromName)} &rarr; ${E(e.toName)}</p>
          <p class="gmf-travel-request__meta">${E(e.routeType)} route / ${E(e.travelTime || "Unknown time")} / Fuel ${E(e.fuelCost ?? 0)}</p>
          <p class="gmf-travel-request__mode"><i class="fa-solid fa-users"></i> ${E(l)}</p>
          <div class="gmf-travel-progress" data-travel-progress aria-live="polite">
            <div class="gmf-travel-progress__bar"><span data-travel-progress-bar></span></div>
            <strong data-travel-progress-count>Waiting for vote status…</strong>
            <span data-travel-progress-pending></span>
          </div>
        </section>
      `,
      render: (Z) => {
        const V = Fe(Z), k = M.get(e.requestId);
        k && (k.root = V), Qe(e.requestId, C.get(e.requestId));
      },
      buttons: {
        accept: {
          icon: '<i class="fa-solid fa-check"></i>',
          label: "Accept",
          callback: () => i(!0)
        },
        decline: {
          icon: '<i class="fa-solid fa-xmark"></i>',
          label: "Decline",
          callback: () => i(!1)
        }
      },
      default: "accept",
      close: () => {
        M.delete(e.requestId), a || i(!1);
      }
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog"],
      width: 420
    }), M.set(e.requestId, {
      root: null,
      resolve: () => {
        a = !0, t = !0, s == null || s.close();
      }
    }), s.render(!0);
  }
  function He(e) {
    var t;
    return !!(e != null && e.coordinatorId && e.coordinatorId === ((t = me()) == null ? void 0 : t.id));
  }
  function Et(e) {
    const t = vt(e);
    return {
      action: "travel-progress",
      requestId: e.requestId,
      mapId: e.mapId,
      requesterId: e.requesterId,
      approvalMode: e.approvalMode,
      acceptedCount: t.acceptedCount,
      declinedCount: t.declinedCount,
      requiredApprovals: t.required,
      participantCount: e.participantCount,
      pendingNames: t.pendingIds.map((a) => {
        var s;
        return ((s = e.voterNames) == null ? void 0 : s[a]) || "Navigator";
      }),
      coordinatorId: game.user.id
    };
  }
  function Qe(e, t) {
    var f, q;
    if (!t) return;
    C.set(e, t);
    const a = (f = M.get(e)) == null ? void 0 : f.root;
    if (!a) return;
    const s = a.querySelector("[data-travel-progress-count]"), i = a.querySelector("[data-travel-progress-pending]"), l = a.querySelector("[data-travel-progress-bar]");
    s && (s.textContent = `${t.acceptedCount} of ${t.requiredApprovals} approvals`), i && (i.textContent = (q = t.pendingNames) != null && q.length ? `Waiting for: ${t.pendingNames.join(", ")}` : "All votes received"), l && (l.style.width = `${Math.min(100, t.acceptedCount / Math.max(1, t.requiredApprovals) * 100)}%`);
  }
  function ut(e) {
    const t = Et(e);
    return C.set(e.requestId, t), Qe(e.requestId, t), game.socket.emit(G, t), t;
  }
  function $t(e) {
    var a, s, i;
    if (!(e != null && e.requestId) || !He(e)) return;
    const t = C.get(e.requestId);
    if (Qe(e.requestId, e), e.requesterId === ((a = game.user) == null ? void 0 : a.id) && (!t || t.acceptedCount !== e.acceptedCount || t.declinedCount !== e.declinedCount)) {
      const l = (s = e.pendingNames) != null && s.length ? ` Waiting for ${e.pendingNames.join(", ")}.` : "";
      (i = ui.notifications) == null || i.info(`Travel vote: ${e.acceptedCount}/${e.requiredApprovals} approvals.${l}`);
    }
  }
  function kt(e) {
    if (!be() || !(e != null && e.requestId) || h.has(e.requestId)) return null;
    const t = O(e.mapId);
    if (!t) return null;
    const a = A(t), s = se().find((k) => k.id === e.requesterId && !k.isGM), i = a.systems.find((k) => k.id === a.currentSystemId), l = a.systems.find((k) => k.id === e.toSystemId), f = i && l ? P(a, i.id, l.id) : null;
    if (!s || a.visibility !== "players" || !i || !l || i.id === l.id || i.visibility !== "players" || l.visibility !== "players" || !f || f.visibility !== "players") return null;
    const q = a.travelApprovalMode, z = me(), F = ht(se(), e.requesterId, z, q), Z = globalThis.setTimeout(() => {
      const k = h.get(e.requestId);
      k && mt(k, { reason: "Travel request timed out." });
    }, Ut), V = {
      action: "travel-ballot",
      requestId: String(e.requestId).slice(0, 80),
      mapId: a.id,
      mapTitle: a.title,
      fromSystemId: i.id,
      fromName: i.name,
      toSystemId: l.id,
      toName: l.name,
      routeId: f.id,
      routeType: f.type,
      travelTime: f.travelTime,
      fuelCost: f.fuelCost,
      requesterId: s.id,
      requesterName: s.name,
      coordinatorId: game.user.id,
      ...F,
      accepted: /* @__PURE__ */ new Set(),
      declined: /* @__PURE__ */ new Set(),
      timeoutId: Z
    };
    return h.set(e.requestId, V), ut(V), V;
  }
  function Ke(e) {
    const t = A(O(e.mapId)), a = t.systems.find((i) => i.id === e.fromSystemId), s = t.systems.find((i) => i.id === e.toSystemId);
    !a || !s || Me(e.mapId).forEach((i) => {
      var f;
      const l = Ue(i);
      l && (i.selectedSystemId = s.id, i.selectedRouteId = null, (f = i._animateShipTravel) == null || f.call(i, a, s, l));
    });
  }
  function Ct(e, t, a) {
    var s;
    game.socket.emit(G, {
      action: "travel-animation",
      mapId: e,
      fromSystemId: t,
      toSystemId: a,
      coordinatorId: (s = game.user) == null ? void 0 : s.id
    });
  }
  async function Lt(e) {
    var a;
    h.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId), S.delete(e.requestId), (a = M.get(e.requestId)) == null || a.resolve(), M.delete(e.requestId), C.delete(e.requestId);
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
    game.socket.emit(G, t), Ke(t), T(`Travel approved: ${e.fromName} to ${e.toName}.`), globalThis.setTimeout(() => o(e.mapId, e.toSystemId), _t);
  }
  function mt(e, { voterName: t = "", reason: a = "" } = {}) {
    var l;
    h.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId), S.delete(e.requestId), (l = M.get(e.requestId)) == null || l.resolve(), M.delete(e.requestId), C.delete(e.requestId);
    const s = a || `${t || "A participant"} declined the request.`, i = {
      action: "travel-declined",
      requestId: e.requestId,
      mapId: e.mapId,
      fromName: e.fromName,
      toName: e.toName,
      voterName: t,
      reason: s,
      coordinatorId: game.user.id
    };
    game.socket.emit(G, i), T(`Travel cancelled: ${s}`);
  }
  function ft(e) {
    if (!be() || !(e != null && e.requestId)) return;
    const t = h.get(e.requestId);
    if (!t || !t.voterIds.includes(e.userId) || t.accepted.has(e.userId) || t.declined.has(e.userId)) return;
    e.accepted ? t.accepted.add(e.userId) : t.declined.add(e.userId);
    const a = vt(t);
    ut(t), a.outcome === "approved" ? Lt(t) : a.outcome === "declined" && mt(t, {
      voterName: e.userName,
      reason: t.approvalMode === "unanimous" ? `${e.userName || "A participant"} declined the unanimous request.` : "The remaining votes cannot reach a majority."
    });
  }
  function At(e) {
    var t, a, s;
    He(e) && e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && S.delete(e.requestId), (a = M.get(e.requestId)) == null || a.resolve(), M.delete(e.requestId), C.delete(e.requestId), Ke(e), (s = ui.notifications) == null || s.info(`Travel approved: ${e.fromName} to ${e.toName}.`));
  }
  function Pt(e) {
    var t, a, s;
    He(e) && e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && S.delete(e.requestId), (a = M.get(e.requestId)) == null || a.resolve(), M.delete(e.requestId), C.delete(e.requestId), (s = ui.notifications) == null || s.warn(`Travel cancelled: ${e.reason || `${e.voterName || "A participant"} declined.`}`));
  }
  function Rt(e) {
    const t = y.get(e);
    t && t.close(), (p == null ? void 0 : p.mapId) === e && p.close();
  }
  function Se(e, t = {}) {
    var q;
    const a = O(e);
    if (!a)
      return $(`Map "${e}" was not found.`), null;
    const s = t.playerMode ?? !((q = game.user) != null && q.isGM);
    if (s && a.visibility !== "players" && !t.broadcast)
      return $("That galaxy map is not visible to players."), null;
    const i = s ? `player:${e}` : e, l = s && (p == null ? void 0 : p.mapId) === e ? p : y.get(i);
    if (l != null && l.rendered)
      return l.bringToFront(), l;
    const f = new zt({ mapId: e, playerMode: s });
    return s ? p = f : y.set(i, f), f.render({ force: !0 }), f;
  }
  async function Ft(e, t, a = {}) {
    var i;
    if (!e || !t) return !1;
    const s = Se(e, {
      playerMode: a.playerMode ?? !((i = game.user) != null && i.isGM),
      broadcast: a.broadcast === !0
    });
    return s != null && s.focusSystem ? s.focusSystem(t, a) : !1;
  }
  function Dt(e, t = "") {
    var s;
    let a = !1;
    for (const i of Me(e))
      a = ((s = i.clearSystemFocus) == null ? void 0 : s.call(i, t)) || a;
    return a;
  }
  function Xe() {
    return w("open the map manager") ? (r || (r = new Ot()), r.render({ force: !0 }), r) : null;
  }
  function et() {
    const e = ge().filter((s) => s.visibility === "players").sort((s, i) => s.title.localeCompare(i.title));
    if (!e.length)
      return T("No galaxy map is currently visible to players."), null;
    if (e.length === 1) return Se(e[0].id, { playerMode: !0 });
    const t = e.map((s) => `
      <button type="button" class="gmf-player-map-choice" data-player-open-map="${E(s.id)}">
        <span class="gmf-player-map-choice__title">${E(s.title)}</span>
        <span class="gmf-player-map-choice__meta">${E(s.subtitle || s.description || "Player-visible galaxy map")}</span>
      </button>
    `).join("");
    let a = null;
    return a = new Dialog({
      title: "Choose Galaxy Map",
      content: `<section class="gmf-player-map-chooser">${t}</section>`,
      render: (s) => {
        const i = Fe(s);
        i == null || i.querySelectorAll("[data-player-open-map]").forEach((l) => {
          l.addEventListener("click", () => {
            Se(l.dataset.playerOpenMap, { playerMode: !0 }), a == null || a.close();
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
    }), a.render(!0), a;
  }
  function Nt() {
    var t;
    const e = ge().sort((a, s) => a.title.localeCompare(s.title));
    return (t = game.user) != null && t.isGM ? e.length === 1 ? Se(e[0].id) : Xe() : et();
  }
  function tt(e) {
    if (w("broadcast galaxy maps")) {
      if (!O(e)) {
        $(`Map "${e}" was not found.`);
        return;
      }
      game.socket.emit(G, { action: "open", mapId: e }), T("Map broadcast sent to players.");
    }
  }
  function pt() {
    w("close player galaxy maps") && (game.socket.emit(G, { action: "close" }), T("Close-map signal sent to players."));
  }
  const Ot = Wt({
    templateRoot: Te,
    getMaps: ge,
    prepareMapForManager: Be,
    getRawMap: O,
    openMapMetadataDialog: Ce,
    openSystemDialog: Le,
    openRouteDialog: Ae,
    openFactionDialog: ve,
    exportMap: ae,
    duplicateMap: Q,
    deleteMap: L,
    createMap: $e,
    deleteSystem: le,
    deleteRoute: c,
    deleteFaction: m,
    openMap: Se,
    showMapToPlayers: tt,
    closePlayerMap: pt,
    hideSystemFromPlayers: _,
    hideRouteFromPlayers: H,
    hideFactionFromPlayers: g,
    clearManagerApp: (e) => {
      r === e && (r = null);
    }
  }), zt = es({
    templateRoot: Te,
    getRawMap: O,
    prepareMapForDisplay: oe,
    openSystemDialog: Le,
    openRouteDialog: Ae,
    openFactionDialog: ve,
    openFactionManagerDialog: Pe,
    openMapMetadataDialog: Ce,
    revealSystemToPlayers: v,
    revealRouteToPlayers: I,
    hideSystemFromPlayers: _,
    hideRouteFromPlayers: H,
    deleteSystem: le,
    deleteRoute: c,
    setCurrentSystem: o,
    requestTravelToSystem: xe,
    notifySystemDiscovered: X,
    pingSystem: K,
    exportMap: ae,
    getTravelRoute: P,
    broadcastTravelAnimation: Ct,
    notifyInfo: T,
    notifyError: $,
    saveSystemPosition: u,
    showMapToPlayers: tt,
    openMapManager: Xe,
    clearMapView: (e) => {
      e.playerMode && p === e && (p = null);
      for (const [t, a] of y.entries())
        a === e && y.delete(t);
    }
  });
  function Gt() {
    const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
    return t != null && t.registerApp ? (t.registerApp({
      id: he,
      title: "Galaxy Map",
      icon: "fa-solid fa-route",
      premium: !1,
      description: "Open cinematic campaign maps and navigation charts.",
      open: () => {
        var a;
        return (a = game.user) != null && a.isGM ? Xe() : et();
      }
    }), !0) : !1;
  }
  Hooks.once("init", async () => {
    game.settings.register(he, nt, {
      scope: "world",
      config: !1,
      type: Object,
      default: {}
    }), Handlebars.registerHelper("gmfEq", (e, t) => e === t), Handlebars.registerHelper("gmfJson", (e) => JSON.stringify(e, null, 2)), Handlebars.registerHelper("gmfPercent", (e) => `${Number(e).toFixed(3)}%`), Handlebars.registerHelper("gmfFallback", (e, t) => e || t), await loadTemplates([
      `${Te}/map-manager.hbs`,
      `${Te}/galaxy-map.hbs`,
      `${Te}/celestial-icon.hbs`,
      `${Te}/system-details.hbs`
    ]);
  }), Hooks.once("ready", () => {
    game.galaxyMap = {
      openMap: Se,
      focusSystem: Ft,
      clearSystemFocus: Dt,
      openMapManager: Xe,
      openGalaxyMapFromSceneControls: Nt,
      openPlayerMapChooser: et,
      createMap: $e,
      getMaps: ge,
      getSceneIdsForSystem: Ve,
      getSystemsForScene: Ye,
      showMapToPlayers: tt,
      closePlayerMap: pt,
      updateMap: ke,
      updateMapMetadata: j,
      deleteMap: L,
      duplicateMap: Q,
      upsertSystem: pe,
      deleteSystem: le,
      upsertRoute: n,
      deleteRoute: c,
      upsertFaction: d,
      deleteFaction: m,
      saveSystemPosition: u,
      setCurrentSystem: o,
      revealSystemToPlayers: v,
      revealRouteToPlayers: I,
      hideSystemFromPlayers: _,
      hideRouteFromPlayers: H,
      hideFactionFromPlayers: g,
      notifySystemDiscovered: X,
      pingSystem: K,
      requestTravelToSystem: xe,
      importMapData: ue,
      exportMap: ae
    };
    const e = game.modules.get(he);
    e && (e.api = game.galaxyMap), Gt(), game.socket.on(G, (t = {}) => {
      var a, s, i, l, f;
      if (t.action === "travel-request") {
        const q = kt(t);
        q && (game.socket.emit(G, q), dt(q));
        return;
      }
      if (t.action === "travel-ballot") {
        He(t) && t.coordinatorId !== ((a = game.user) == null ? void 0 : a.id) && dt(t);
        return;
      }
      if (t.action === "travel-vote") {
        ft(t);
        return;
      }
      if (t.action === "travel-progress") {
        $t(t);
        return;
      }
      if (t.action === "travel-approved") {
        At(t);
        return;
      }
      if (t.action === "travel-declined") {
        Pt(t);
        return;
      }
      if (t.action === "travel-animation") {
        t.coordinatorId !== ((s = game.user) == null ? void 0 : s.id) && Ke(t);
        return;
      }
      if (t.action === "system-ping") {
        t.userId !== ((i = game.user) == null ? void 0 : i.id) && t.mapId && t.systemId && B(t);
        return;
      }
      (l = game.user) != null && l.isGM || (t.action === "open" && t.mapId && (p == null || p.close(), Se(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "close" && (p == null || p.close()), t.action === "refresh" && (p == null ? void 0 : p.mapId) === t.mapId && p.render({ force: !0 }), t.action === "notify" && ((f = ui.notifications) == null || f.info(t.message || "New system discovered."), (p == null ? void 0 : p.mapId) === t.mapId && p.render({ force: !0 })));
    }), console.log(`${he} | Ready. API available at game.galaxyMap.`);
  });
})();
