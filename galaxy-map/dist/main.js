var wa = Object.defineProperty;
var Ia = (o, g, u) => g in o ? wa(o, g, { enumerable: !0, configurable: !0, writable: !0, value: u }) : o[g] = u;
var Y = (o, g, u) => Ia(o, typeof g != "symbol" ? g + "" : g, u);
const St = [
  { value: "cartoon", label: "Cartoon · Acid Seas", color: "#af91ff" },
  { value: "adventure", label: "Painterly · Golden Frontier", color: "#69e7dc" },
  { value: "realistic", label: "Realistic · Blue Marble", color: "#78caff" }
], Zt = [
  { value: "auto", label: "Automatic texture" },
  ...St,
  { value: "color", label: "Flat color" },
  { value: "custom", label: "Custom texture" },
  { value: "none", label: "No detail view" }
], Jt = [
  { value: "sphere", label: "Sphere" },
  { value: "cube", label: "Cube" },
  { value: "donut", label: "Donut" },
  { value: "asteroid", label: "Asteroid" },
  { value: "crystal", label: "Crystal" },
  { value: "cylinder", label: "Cylinder" }
];
function Qt(o) {
  return Jt.some((g) => g.value === o) ? String(o) : "sphere";
}
function Kt(o) {
  return Zt.some((g) => g.value === o) ? String(o) : "auto";
}
function Et(o, g = "") {
  if (!o || o.obscured || o.planetPreset === "none") return null;
  const u = Kt(o.planetPreset), h = St.find((q) => q.value === g) ?? St.find((q) => q.value === u) ?? St[0], v = !g && u === "custom" && !!o.planetTexture, S = !g && u === "color";
  return {
    texture: S ? null : v ? o.planetTexture : `modules/galaxy-map/assets/planets/${h.value}.png`,
    label: S ? "Flat color" : v ? "Custom texture" : h.label,
    color: S ? o.planetColor || "#58d8ff" : h.color,
    shape: Qt(o.planetShape)
  };
}
const bt = [
  { value: "gm", label: "GM approval" },
  { value: "majority", label: "Majority vote" },
  { value: "unanimous", label: "Unanimous agreement" }
];
function Ft(o) {
  return bt.some((g) => g.value === o) ? String(o) : "unanimous";
}
function Ut(o, g, u, h) {
  const v = Ft(h), S = [...new Map((o ?? []).filter((T) => T == null ? void 0 : T.id).map((T) => [String(T.id), T])).values()], q = v === "gm" ? u != null && u.id ? [u] : [] : S.filter((T) => String(T.id) !== String(g)), I = q.map((T) => String(T.id)), _ = Object.fromEntries(q.map((T) => [String(T.id), String(T.name || "Navigator").slice(0, 80)])), k = I.length + (v === "gm" ? 0 : 1), b = v === "gm" ? 1 : v === "majority" ? Math.floor(k / 2) + 1 : k;
  return { approvalMode: v, voterIds: I, voterNames: _, participantCount: k, requiredApprovals: b };
}
function Yt(o) {
  const g = Ft(o == null ? void 0 : o.approvalMode), u = [...new Set(((o == null ? void 0 : o.voterIds) ?? []).map(String))], h = new Set([...(o == null ? void 0 : o.accepted) ?? []].map(String)), v = new Set([...(o == null ? void 0 : o.declined) ?? []].map(String)), S = g === "gm" ? 0 : 1, q = Math.max(1, Number(o == null ? void 0 : o.requiredApprovals) || (g === "unanimous" ? u.length + 1 : 1)), I = S + u.filter((b) => h.has(b)).length, _ = u.filter((b) => v.has(b)).length, k = u.filter((b) => !h.has(b) && !v.has(b));
  return I >= q ? { outcome: "approved", acceptedCount: I, declinedCount: _, required: q, pendingIds: k } : g === "unanimous" && _ > 0 ? { outcome: "declined", acceptedCount: I, declinedCount: _, required: q, pendingIds: k } : I + k.length < q ? { outcome: "declined", acceptedCount: I, declinedCount: _, required: q, pendingIds: k } : { outcome: "pending", acceptedCount: I, declinedCount: _, required: q, pendingIds: k };
}
const Ct = ["core", "colony", "frontier", "station", "anomaly", "ruins", "restricted", "unknown"], Lt = ["undiscovered", "known", "visited", "danger", "locked"], ea = ["safe", "dangerous", "restricted", "smuggler", "unknown"], Xe = ["gm", "players"], ta = [
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
], xa = ta.map((o) => o.value), Xt = [
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
], _t = 0.55, $t = 2.6, aa = 2400, Ma = 6e4;
function $e(o = "gmf") {
  return `${o}-${foundry.utils.randomID(10)}`;
}
function wt(o, g = "players") {
  const u = Xe.includes(g) ? g : "players";
  return Xe.includes(o) ? String(o) : u;
}
function ka(o) {
  return typeof o == "string" && /^#[0-9a-f]{6}$/i.test(o) ? o : "#58d8ff";
}
function Wt(o) {
  return typeof o == "string" && /^#[0-9a-f]{6}$/i.test(o) ? o : "";
}
function Qe(o, g = 0) {
  const u = Number(o);
  return Number.isFinite(u) ? u : g;
}
function qa(o) {
  const g = Array.isArray(o) ? o : o ? [o] : [];
  return [...new Set(g.map((u) => String(u).trim()).filter(Boolean))];
}
function qe(o, g, u) {
  return Math.min(u, Math.max(g, o));
}
function At(o = {}) {
  const g = qa(o.sceneIds === void 0 ? o.sceneId : o.sceneIds), u = String(o.planetTexture || "").trim(), h = Kt(o.planetPreset), v = u && !["none", "color"].includes(h) ? "custom" : h;
  return {
    id: String(o.id || $e("system")),
    name: String(o.name || "Unnamed System"),
    x: Math.min(100, Math.max(0, Qe(o.x, 50))),
    y: Math.min(100, Math.max(0, Qe(o.y, 50))),
    type: Ct.includes(o.type) ? o.type : "unknown",
    factionId: String(o.factionId || ""),
    status: Lt.includes(o.status) ? o.status : "known",
    description: String(o.description || ""),
    image: String(o.image || ""),
    planetPreset: v,
    planetShape: Qt(o.planetShape),
    planetTexture: u,
    planetColor: Wt(o.planetColor) || "#58d8ff",
    sceneIds: g,
    journalId: String(o.journalId || ""),
    visibility: wt(o.visibility, "players"),
    notes: String(o.notes || ""),
    iconColor: Wt(o.iconColor),
    iconSize: qe(Qe(o.iconSize, 28), 18, 56),
    iconStyle: xa.includes(o.iconStyle) ? o.iconStyle : "planet",
    pulse: o.pulse !== !1
  };
}
function Pt(o = {}) {
  return {
    id: String(o.id || $e("route")),
    fromSystemId: String(o.fromSystemId || ""),
    toSystemId: String(o.toSystemId || ""),
    type: ea.includes(o.type) ? o.type : "unknown",
    travelTime: String(o.travelTime || ""),
    fuelCost: Qe(o.fuelCost, 0),
    visibility: wt(o.visibility, "players"),
    notes: String(o.notes || "")
  };
}
function Rt(o = {}) {
  return {
    id: String(o.id || $e("faction")),
    name: String(o.name || "Unaffiliated"),
    color: ka(o.color),
    description: String(o.description || ""),
    visibility: wt(o.visibility, "players")
  };
}
function H(o = {}) {
  var v;
  const g = Array.isArray(o.systems) ? o.systems.map(At) : [], u = Array.isArray(o.routes) ? o.routes.map(Pt) : [], h = Array.isArray(o.factions) ? o.factions.map(Rt) : [];
  return {
    id: String(o.id || $e("map")),
    title: String(o.title || "Untitled Galaxy Map"),
    subtitle: String(o.subtitle || ""),
    description: String(o.description || ""),
    backgroundImage: String(o.backgroundImage || ""),
    visibility: wt(o.visibility, "players"),
    travelApprovalMode: Ft(o.travelApprovalMode),
    currentSystemId: String(o.currentSystemId || ((v = g[0]) == null ? void 0 : v.id) || ""),
    systems: g,
    routes: u,
    factions: h
  };
}
function _a() {
  var u, h, v, S;
  const o = (h = (u = foundry.applications) == null ? void 0 : u.api) == null ? void 0 : h.ApplicationV2, g = (S = (v = foundry.applications) == null ? void 0 : v.api) == null ? void 0 : S.HandlebarsApplicationMixin;
  return o && g ? g(o) : Application;
}
function $a(o) {
  var he;
  const {
    templateRoot: g,
    getMaps: u,
    prepareMapForManager: h,
    getRawMap: v,
    openMapMetadataDialog: S,
    openSystemDialog: q,
    openRouteDialog: I,
    openFactionDialog: _,
    exportMap: k,
    duplicateMap: b,
    deleteMap: T,
    createMap: R,
    deleteSystem: le,
    deleteRoute: ve,
    deleteFaction: j,
    openMap: U,
    showMapToPlayers: fe,
    closePlayerMap: ye,
    hideSystemFromPlayers: X,
    hideRouteFromPlayers: Ae,
    hideFactionFromPlayers: Se,
    clearManagerApp: _e
  } = o;
  return he = class extends _a() {
    constructor(G = {}) {
      super(G);
      Y(this, "selectedMapId");
      Y(this, "jsonDraft");
      Y(this, "activeTab");
      this.selectedMapId = G.selectedMapId ?? null, this.jsonDraft = "", this.activeTab = ["systems", "routes", "factions"].includes(G.activeTab) ? G.activeTab : "systems";
    }
    async _prepareContext(G) {
      var l, n;
      const P = await ((l = super._prepareContext) == null ? void 0 : l.call(this, G)) ?? {}, ue = u().sort((c, d) => c.title.localeCompare(d.title));
      (!this.selectedMapId || !ue.some((c) => c.id === this.selectedMapId)) && (this.selectedMapId = ((n = ue[0]) == null ? void 0 : n.id) ?? null);
      const pe = this.selectedMapId ? h(v(this.selectedMapId)) : null;
      return {
        ...P,
        maps: ue,
        selectedMap: pe,
        selectedMapId: this.selectedMapId,
        activeTab: this.activeTab,
        showSystems: this.activeTab === "systems",
        showRoutes: this.activeTab === "routes",
        showFactions: this.activeTab === "factions",
        hasMaps: ue.length > 0
      };
    }
    _attachPartListeners(G, P, ue) {
      var pe, l, n, c, d, p, y, E;
      (pe = super._attachPartListeners) == null || pe.call(this, G, P, ue), (l = P.querySelector("[data-action='create-map']")) == null || l.addEventListener("click", () => this._onCreateMap()), (n = P.querySelector("[data-action='edit-map-metadata']")) == null || n.addEventListener("click", () => {
        this.selectedMapId && S(this.selectedMapId);
      }), (c = P.querySelector("[data-action='create-system']")) == null || c.addEventListener("click", () => {
        this.selectedMapId && q(this.selectedMapId);
      }), (d = P.querySelector("[data-action='create-route']")) == null || d.addEventListener("click", () => {
        this.selectedMapId && I(this.selectedMapId);
      }), (p = P.querySelector("[data-action='create-faction']")) == null || p.addEventListener("click", () => {
        this.selectedMapId && _(this.selectedMapId);
      }), P.querySelectorAll("[data-manager-tab]").forEach((f) => {
        f.addEventListener("click", () => {
          const x = f.dataset.managerTab;
          !["systems", "routes", "factions"].includes(x) || x === this.activeTab || (this.activeTab = x, this.render({ force: !0 }));
        });
      }), P.querySelectorAll("[data-edit-system]").forEach((f) => {
        f.addEventListener("click", () => q(this.selectedMapId, f.dataset.editSystem));
      }), P.querySelectorAll("[data-show-system]").forEach((f) => {
        f.addEventListener("click", () => X(this.selectedMapId, f.dataset.showSystem, !1));
      }), P.querySelectorAll("[data-hide-system]").forEach((f) => {
        f.addEventListener("click", () => X(this.selectedMapId, f.dataset.hideSystem, !0));
      }), P.querySelectorAll("[data-delete-system]").forEach((f) => {
        f.addEventListener("click", () => this._confirmDeleteSystem(f.dataset.deleteSystem));
      }), P.querySelectorAll("[data-edit-route]").forEach((f) => {
        f.addEventListener("click", () => I(this.selectedMapId, f.dataset.editRoute));
      }), P.querySelectorAll("[data-show-route]").forEach((f) => {
        f.addEventListener("click", () => Ae(this.selectedMapId, f.dataset.showRoute, !1));
      }), P.querySelectorAll("[data-hide-route]").forEach((f) => {
        f.addEventListener("click", () => Ae(this.selectedMapId, f.dataset.hideRoute, !0));
      }), P.querySelectorAll("[data-delete-route]").forEach((f) => {
        f.addEventListener("click", () => this._confirmDeleteRoute(f.dataset.deleteRoute));
      }), P.querySelectorAll("[data-edit-faction]").forEach((f) => {
        f.addEventListener("click", () => _(this.selectedMapId, f.dataset.editFaction));
      }), P.querySelectorAll("[data-show-faction]").forEach((f) => {
        f.addEventListener("click", () => Se(this.selectedMapId, f.dataset.showFaction, !1));
      }), P.querySelectorAll("[data-hide-faction]").forEach((f) => {
        f.addEventListener("click", () => Se(this.selectedMapId, f.dataset.hideFaction, !0));
      }), P.querySelectorAll("[data-delete-faction]").forEach((f) => {
        f.addEventListener("click", () => this._confirmDeleteFaction(f.dataset.deleteFaction));
      }), (y = P.querySelector("[data-action='export-map']")) == null || y.addEventListener("click", () => {
        this.selectedMapId && k(this.selectedMapId);
      }), P.querySelectorAll("[data-select-map]").forEach((f) => {
        f.addEventListener("click", () => {
          this.selectedMapId = f.dataset.selectMap, this.jsonDraft = "", this.render({ force: !0 });
        });
      }), P.querySelectorAll("[data-open-map]").forEach((f) => {
        f.addEventListener("click", () => U(f.dataset.openMap));
      }), P.querySelectorAll("[data-show-map]").forEach((f) => {
        f.addEventListener("click", () => fe(f.dataset.showMap));
      }), P.querySelectorAll("[data-duplicate-map]").forEach((f) => {
        f.addEventListener("click", async () => {
          const x = await b(f.dataset.duplicateMap);
          x && (this.selectedMapId = x.id, this.jsonDraft = "", this.render({ force: !0 }));
        });
      }), P.querySelectorAll("[data-delete-map]").forEach((f) => {
        f.addEventListener("click", async () => {
          const x = f.dataset.deleteMap, N = v(x);
          await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${(N == null ? void 0 : N.title) ?? x}</strong>? This cannot be undone.</p>`
          }) && (await T(x), this.selectedMapId === x && (this.selectedMapId = null), this.jsonDraft = "", this.render({ force: !0 }));
        });
      }), (E = P.querySelector("[data-action='close-player-map']")) == null || E.addEventListener("click", () => ye());
    }
    async _onCreateMap() {
      const G = await R({
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
      G && (this.selectedMapId = G.id, this.jsonDraft = "", this.render({ force: !0 }));
    }
    async _confirmDeleteSystem(G) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }) && await le(this.selectedMapId, G);
    }
    async _confirmDeleteRoute(G) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }) && await ve(this.selectedMapId, G);
    }
    async _confirmDeleteFaction(G) {
      await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }) && await j(this.selectedMapId, G);
    }
    async close(G = {}) {
      return _e(this), super.close(G);
    }
  }, Y(he, "DEFAULT_OPTIONS", {
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
  }), Y(he, "PARTS", {
    main: {
      template: `${g}/map-manager.hbs`
    }
  }), he;
}
function Ta(o, g) {
  const u = (h, v, S) => (v[0] - h[0]) * (S[1] - h[1]) - (v[1] - h[1]) * (S[0] - h[0]);
  return g.flatMap((h) => {
    const v = o.filter((k) => k.factionId === h.id && !k.obscured);
    if (!v.length) return [];
    const S = v.flatMap((k) => Array.from({ length: 12 }, (b, T) => {
      const R = T * Math.PI / 6;
      return [
        Math.max(1, Math.min(99, k.x + Math.cos(R) * 7)),
        Math.max(1, Math.min(99, k.y + Math.sin(R) * 9))
      ];
    })).sort((k, b) => k[0] - b[0] || k[1] - b[1]), q = (k) => {
      const b = [];
      for (const T of k) {
        for (; b.length > 1 && u(b[b.length - 2], b[b.length - 1], T) <= 0; ) b.pop();
        b.push(T);
      }
      return b.slice(0, -1);
    }, I = [...q(S), ...q([...S].reverse())], _ = Math.min(...S.map((k) => k[1]));
    return [{
      id: h.id,
      name: h.name,
      color: h.color,
      points: I.map((k) => k.map((b) => b.toFixed(2)).join(",")).join(" "),
      labelX: (Math.min(...S.map((k) => k[0])) + Math.max(...S.map((k) => k[0]))) / 2,
      labelY: Math.max(3, _ + 3)
    }];
  });
}
function sa() {
  var o, g, u;
  try {
    const h = (g = (o = game.modules) == null ? void 0 : o.get) == null ? void 0 : g.call(o, "bounty-board");
    if ((h == null ? void 0 : h.active) === !1) return null;
    const v = h.api ?? ((u = game.scifiSuite) == null ? void 0 : u.bountyBoard);
    return typeof (v == null ? void 0 : v.getBountiesForScene) == "function" ? v : null;
  } catch {
    return null;
  }
}
function Ea(o) {
  const g = sa();
  if (!g || !Array.isArray(o == null ? void 0 : o.sceneIds)) return [];
  const u = /* @__PURE__ */ new Set(), h = [];
  try {
    for (const v of o.sceneIds)
      for (const S of g.getBountiesForScene(String(v)) ?? []) {
        const q = String((S == null ? void 0 : S.id) ?? "");
        !q || u.has(q) || (u.add(q), h.push({
          id: q,
          name: String(S.name || "Unknown target"),
          image: String(S.image || ""),
          status: String(S.status || ""),
          statusLabel: String(S.statusLabel || S.status || ""),
          reward: String(S.reward || ""),
          sceneId: String(S.sceneId || v)
        }));
      }
  } catch {
    return [];
  }
  return h;
}
function Ca(o) {
  try {
    const g = sa();
    return typeof (g == null ? void 0 : g.openBounty) == "function" && g.openBounty(String(o)) !== !1;
  } catch {
    return !1;
  }
}
const Ue = /* @__PURE__ */ new Map(), La = 40, Aa = 192;
function Pa(o) {
  return new Promise((g, u) => {
    const h = new Image();
    h.onload = () => g(h), h.onerror = () => u(new Error("Image unavailable")), h.src = o;
  });
}
async function Ra(o) {
  if (!o) return null;
  try {
    const g = await Pa(o), u = Math.min(1, Aa / Math.max(g.naturalWidth || g.width, g.naturalHeight || g.height)), h = Math.max(2, Math.round((g.naturalWidth || g.width) * u)), v = Math.max(2, Math.round((g.naturalHeight || g.height) * u)), S = document.createElement("canvas");
    S.width = h, S.height = v;
    const q = S.getContext("2d", { willReadFrequently: !0 });
    if (!q) return null;
    q.drawImage(g, 0, 0, h, v);
    const I = q.getImageData(0, 0, h, v), _ = q.createImageData(h, v), k = new Float32Array(h * v);
    for (let T = 0; T < k.length; T++) {
      const R = T * 4;
      k[T] = I.data[R] * 0.299 + I.data[R + 1] * 0.587 + I.data[R + 2] * 0.114;
    }
    const b = (T, R) => k[R * h + T];
    for (let T = 1; T < v - 1; T++)
      for (let R = 1; R < h - 1; R++) {
        const le = -b(R - 1, T - 1) + b(R + 1, T - 1) - 2 * b(R - 1, T) + 2 * b(R + 1, T) - b(R - 1, T + 1) + b(R + 1, T + 1), ve = -b(R - 1, T - 1) - 2 * b(R, T - 1) - b(R + 1, T - 1) + b(R - 1, T + 1) + 2 * b(R, T + 1) + b(R + 1, T + 1), j = Math.hypot(le, ve), U = Math.max(0, Math.min(235, (j - 34) * 2.1)), fe = (T * h + R) * 4;
        _.data[fe] = 104, _.data[fe + 1] = 241, _.data[fe + 2] = 255, _.data[fe + 3] = U;
      }
    return q.clearRect(0, 0, h, v), q.putImageData(_, 0, 0), S.toDataURL("image/png");
  } catch {
    return null;
  }
}
function Fa(o, g = "") {
  const u = `${g}\0${o}`, h = Ue.get(u);
  if (h)
    return Ue.delete(u), Ue.set(u, h), h;
  for (; Ue.size >= La; ) {
    const S = Ue.keys().next().value;
    if (S === void 0) break;
    Ue.delete(S);
  }
  const v = Ra(o);
  return Ue.set(u, v), v;
}
function Da({ root: o, stage: g, resolveItems: u, onOpen: h }) {
  var _e, he, Ge;
  const v = o.querySelector("[data-intel-layer]");
  if (!v) return null;
  const S = new AbortController(), q = S.signal, I = document.createElement("aside");
  I.className = "gmf-intel-callout", I.setAttribute("aria-label", "Bounty intel"), I.hidden = !0, I.innerHTML = `
    <span class="gmf-intel-callout__connector" aria-hidden="true"></span>
    <button type="button" class="gmf-intel-callout__body" data-intel-open>
      <span class="gmf-intel-callout__portrait"><img alt="" data-intel-image hidden /><i class="fa-solid fa-crosshairs" data-intel-fallback></i></span>
      <span class="gmf-intel-callout__copy"><small data-intel-kicker>ACTIVE BOUNTY</small><strong data-intel-name></strong><span data-intel-meta></span></span>
    </button>
    <footer class="gmf-intel-callout__nav" data-intel-nav hidden>
      <button type="button" data-intel-previous aria-label="Previous bounty"><i class="fa-solid fa-chevron-left"></i></button>
      <span data-intel-count></span>
      <button type="button" data-intel-next aria-label="Next bounty"><i class="fa-solid fa-chevron-right"></i></button>
    </footer>`, v.append(I);
  let _ = [], k = 0, b = null, T = null, R = null, le = 0, ve = 0;
  const j = () => {
    T && clearTimeout(T), T = null;
  }, U = () => {
    le++, R && clearTimeout(R), R = null, T = null, b = null, _ = [], I.hidden = !0, I.classList.remove("is-visible", "is-left");
  }, fe = (D = 180) => {
    j(), le++, R && clearTimeout(R), R = null, T = setTimeout(U, D);
  }, ye = () => {
    if (!b || I.hidden) return;
    const D = g.getBoundingClientRect(), G = b.getBoundingClientRect(), P = I.offsetWidth || 242, ue = I.offsetHeight || 126, pe = G.right - D.left + P + 24 > D.width, l = pe ? G.left - D.left - P - 18 : G.right - D.left + 18, n = Math.max(48, Math.min(D.height - ue - 12, G.top - D.top + G.height / 2 - ue / 2));
    I.classList.toggle("is-left", pe), I.style.left = `${Math.max(8, l)}px`, I.style.top = `${n}px`;
  }, X = () => {
    const D = _[k];
    if (!D) return U();
    const G = I.querySelector("[data-intel-name]"), P = I.querySelector("[data-intel-kicker]"), ue = I.querySelector("[data-intel-meta]"), pe = I.querySelector("[data-intel-nav]"), l = I.querySelector("[data-intel-count]"), n = I.querySelector("[data-intel-image]"), c = I.querySelector("[data-intel-fallback]");
    G && (G.textContent = D.name), P && (P.textContent = `BOUNTY // ${(D.statusLabel || "INTEL").toUpperCase()}`), ue && (ue.textContent = [D.statusLabel, D.reward].filter(Boolean).join(" // ")), pe && (pe.hidden = _.length < 2), l && (l.textContent = `${String(k + 1).padStart(2, "0")} / ${String(_.length).padStart(2, "0")}`);
    const d = ++ve;
    n && (n.hidden = !0, n.removeAttribute("src")), c && (c.hidden = !1), D.image && n && (n.src = D.image, n.classList.add("is-css-fallback"), n.hidden = !1, c && (c.hidden = !0), n.onerror = () => {
      d === ve && (n.hidden = !0, c && (c.hidden = !1));
    }, Fa(D.image, D.id).then((p) => {
      var y;
      !p || d !== ve || ((y = _[k]) == null ? void 0 : y.id) !== D.id || (n.classList.remove("is-css-fallback"), n.src = p);
    })), ye();
  }, Ae = async (D) => {
    j(), b = D;
    const G = ++le;
    let P = [];
    try {
      P = await u(D.dataset.systemId ?? "");
    } catch {
    }
    if (!(G !== le || b !== D)) {
      if (!P.length) return U();
      _ = P, k = 0, I.hidden = !1, X(), requestAnimationFrame(() => {
        ye(), I.classList.add("is-visible");
      });
    }
  }, Se = (D) => {
    j(), le++, R && clearTimeout(R), R = setTimeout(() => {
      R = null, Ae(D);
    }, 90);
  };
  return o.querySelectorAll("[data-system-id]").forEach((D) => {
    D.addEventListener("pointerenter", () => Se(D), { signal: q }), D.addEventListener("pointerleave", () => fe(), { signal: q }), D.addEventListener("focus", () => Se(D), { signal: q }), D.addEventListener("blur", () => fe(), { signal: q }), D.addEventListener("pointerdown", () => U(), { signal: q });
  }), I.addEventListener("pointerenter", j, { signal: q }), I.addEventListener("pointerleave", () => fe(), { signal: q }), I.addEventListener("click", (D) => D.stopPropagation(), { signal: q }), (_e = I.querySelector("[data-intel-open]")) == null || _e.addEventListener("click", () => {
    const D = _[k];
    D && h(D.id);
  }, { signal: q }), (he = I.querySelector("[data-intel-previous]")) == null || he.addEventListener("click", () => {
    k = (k - 1 + _.length) % _.length, X();
  }, { signal: q }), (Ge = I.querySelector("[data-intel-next]")) == null || Ge.addEventListener("click", () => {
    k = (k + 1) % _.length, X();
  }, { signal: q }), g.addEventListener("wheel", () => requestAnimationFrame(ye), { signal: q }), window.addEventListener("resize", ye, { signal: q }), {
    dispose() {
      le++, T && clearTimeout(T), R && clearTimeout(R), S.abort(), I.remove();
    }
  };
}
function Na(o) {
  return String(o || "galaxy-map").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "galaxy-map";
}
function za(o, g) {
  const u = new Blob([JSON.stringify(g, null, 2)], { type: "application/json" }), h = URL.createObjectURL(u), v = document.createElement("a");
  v.href = h, v.download = o, document.body.appendChild(v), v.click(), v.remove(), URL.revokeObjectURL(h);
}
function w(o) {
  const g = document.createElement("div");
  return g.textContent = String(o ?? ""), g.innerHTML;
}
function oe(o, g) {
  return o.map((u) => {
    const h = typeof u == "string" ? u : u.value, v = typeof u == "string" ? u.split(/[-_]/).map((S) => S.toLowerCase() === "gm" ? "GM" : `${S.charAt(0).toUpperCase()}${S.slice(1)}`).join(" ") : u.label;
    return `<option value="${w(h)}" ${h === g ? "selected" : ""}>${w(v)}</option>`;
  }).join("");
}
function Be(o) {
  return (o == null ? void 0 : o[0]) ?? o ?? null;
}
function Ba(o) {
  var v;
  const g = Be(o), u = (v = g == null ? void 0 : g.matches) != null && v.call(g, "form") ? g : g == null ? void 0 : g.querySelector("form"), h = {};
  for (const [S, q] of new FormData(u).entries())
    h[S] === void 0 ? h[S] = q : Array.isArray(h[S]) ? h[S].push(q) : h[S] = [h[S], q];
  return h;
}
function Ga() {
  var u, h, v, S;
  const o = (h = (u = foundry.applications) == null ? void 0 : u.api) == null ? void 0 : h.ApplicationV2, g = (S = (v = foundry.applications) == null ? void 0 : v.api) == null ? void 0 : S.HandlebarsApplicationMixin;
  return o && g ? g(o) : Application;
}
function Oa(o) {
  var P;
  const {
    templateRoot: g,
    getRawMap: u,
    prepareMapForDisplay: h,
    openSystemDialog: v,
    openRouteDialog: S,
    openFactionDialog: q,
    openFactionManagerDialog: I,
    openMapMetadataDialog: _,
    revealSystemToPlayers: k,
    revealRouteToPlayers: b,
    hideSystemFromPlayers: T,
    hideRouteFromPlayers: R,
    deleteSystem: le,
    deleteRoute: ve,
    setCurrentSystem: j,
    requestTravelToSystem: U,
    notifySystemDiscovered: fe,
    exportMap: ye,
    getTravelRoute: X,
    broadcastTravelAnimation: Ae,
    notifyInfo: Se,
    notifyError: _e,
    saveSystemPosition: he,
    showMapToPlayers: Ge,
    openMapManager: D,
    clearMapView: G
  } = o;
  return P = class extends Ga() {
    constructor(l = {}) {
      var d;
      const n = l.mapId, c = l.playerMode ?? !((d = game.user) != null && d.isGM);
      super({
        ...l,
        id: `galaxy-map-view-${c ? "player" : "gm"}-${n}`
      });
      Y(this, "mapId");
      Y(this, "playerMode");
      Y(this, "selectedSystemId");
      Y(this, "selectedRouteId");
      Y(this, "zoom");
      Y(this, "panX");
      Y(this, "panY");
      Y(this, "_drag");
      Y(this, "_contextTarget");
      Y(this, "_boundContextClose");
      Y(this, "externalFocus");
      Y(this, "_externalFocusTimeout");
      Y(this, "_pendingFocusZoom");
      Y(this, "searchQuery");
      Y(this, "showTerritories", !0);
      Y(this, "planetSystemId", null);
      Y(this, "planetStatic", !1);
      Y(this, "_planetRenderer", null);
      Y(this, "_planetGeneration", 0);
      Y(this, "_planetReturnFocus", !1);
      Y(this, "_bountyIntelCallout", null);
      this.mapId = n, this.playerMode = c, this.selectedSystemId = l.selectedSystemId ?? null, this.selectedRouteId = l.selectedRouteId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null, this.externalFocus = null, this._externalFocusTimeout = null, this._pendingFocusZoom = null, this.searchQuery = "";
    }
    get title() {
      const l = u(this.mapId), n = this.playerMode ? "Player View" : "GM View";
      return l ? `${l.title} - ${n}` : `Galaxy Map - ${n}`;
    }
    async _prepareContext(l) {
      var E, f;
      const n = await ((E = super._prepareContext) == null ? void 0 : E.call(this, l)) ?? {}, c = u(this.mapId), d = c ? h(c, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      }) : null;
      d != null && d.systems && this.externalFocus && (d.systems = d.systems.map((x) => x.id === this.externalFocus.systemId ? { ...x, isExternalFocus: !0, externalFocus: this.externalFocus } : x), ((f = d.selectedSystem) == null ? void 0 : f.id) === this.externalFocus.systemId && (d.selectedSystem = d.systems.find((x) => x.id === this.externalFocus.systemId))), d != null && d.selectedSystem && (this.selectedSystemId = d.selectedSystem.id);
      const p = d == null ? void 0 : d.systems.find((x) => x.id === this.planetSystemId), y = !this.playerMode || (c == null ? void 0 : c.visibility) === "players" ? Et(p) : null;
      return y || (this.planetSystemId = null), {
        ...n,
        map: d,
        planetView: !!y,
        planetSystem: p,
        planetAppearance: y,
        territories: d ? Ta(d.systems, d.factions) : [],
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
    _onRender(l, n) {
      var d, p, y, E, f;
      (p = (d = this._bountyIntelCallout) == null ? void 0 : d.dispose) == null || p.call(d), this._bountyIntelCallout = null, this._disposePlanetRenderer(), (y = super._onRender) == null || y.call(this, l, n);
      const c = this.element instanceof HTMLElement ? this.element : (E = this.element) == null ? void 0 : E[0];
      if (c) {
        if (this._attachPartListeners("main", c, n), this._mountBountyIntelCallout(c), this.externalFocus && this._pendingFocusZoom !== null) {
          const x = H(u(this.mapId)).systems.find((N) => N.id === this.externalFocus.systemId);
          x && this._centerOnSystem(x, c, this._pendingFocusZoom), this._pendingFocusZoom = null;
        }
        this._applySearchState(this.searchQuery, c), l.planetView ? this._mountPlanetRenderer(c, l.planetAppearance) : this._planetReturnFocus && ((f = c.querySelector("[data-action='inspect-system']")) == null || f.focus(), this._planetReturnFocus = !1);
      }
    }
    _attachPartListeners(l, n, c) {
      var E, f, x, N, ce, me, ae, be, Te, Ie, ot, Ke, lt, et, ct, dt, ut, mt, tt, at, st, Oe, nt, ft, Pe, pt;
      const d = (E = n.matches) != null && E.call(n, ".gmf-map-stage") ? n : (f = n.querySelector) == null ? void 0 : f.call(n, ".gmf-map-stage, .gmf-planet-stage");
      if ((d == null ? void 0 : d.dataset.gmfMapBound) === "true") return;
      d && (d.dataset.gmfMapBound = "true");
      const p = (x = d == null ? void 0 : d.matches) != null && x.call(d, ".gmf-map-stage") ? d : null;
      (N = super._attachPartListeners) == null || N.call(this, l, n, c), this._attachPlanetListeners(n), (ce = n.querySelector("[data-action='toggle-territories']")) == null || ce.addEventListener("click", () => {
        this.showTerritories = !this.showTerritories, this.render({ force: !0 });
      }), this._applyViewportTransform(n), n.querySelectorAll("[data-system-id]").forEach((W) => {
        var ee;
        W.addEventListener("click", (We) => {
          if (W.dataset.dragged === "true") {
            W.dataset.dragged = "false";
            return;
          }
          We.stopPropagation(), this.selectedSystemId = W.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
        }), !this.playerMode && ((ee = game.user) != null && ee.isGM) && W.addEventListener("pointerdown", (We) => this._startSystemDrag(We, n, W));
      }), this._mountBountyIntelCallout(n), n.querySelectorAll("[data-route-id]").forEach((W) => {
        W.addEventListener("click", (ee) => {
          ee.stopPropagation(), this.selectedRouteId = W.dataset.routeId, this.selectedSystemId = null, this.render({ force: !0 });
        });
      }), p == null || p.addEventListener("wheel", (W) => this._onWheelZoom(W, n), { passive: !1 }), p == null || p.addEventListener("pointerdown", (W) => this._startPan(W, n)), p == null || p.addEventListener("contextmenu", (W) => this._openContextMenu(W, n), { capture: !0 }), n.querySelectorAll("[data-context-action]").forEach((W) => {
        W.addEventListener("click", (ee) => this._handleContextAction(ee, n));
      }), (me = n.querySelector("[data-action='open-map-menu']")) == null || me.addEventListener("click", (W) => this._openStageMenuFromButton(W, n)), (ae = n.querySelector("[data-action='zoom-in']")) == null || ae.addEventListener("click", () => this._setZoom(this.zoom + 0.15, n)), (be = n.querySelector("[data-action='zoom-out']")) == null || be.addEventListener("click", () => this._setZoom(this.zoom - 0.15, n)), (Te = n.querySelector("[data-action='reset-view']")) == null || Te.addEventListener("click", () => {
        this.zoom = 1, this.panX = 0, this.panY = 0, this._applyViewportTransform(n);
      });
      const y = n.querySelector("[data-system-search]");
      y == null || y.addEventListener("input", () => {
        this.searchQuery = y.value, this._applySearchState(this.searchQuery, n);
      }), y == null || y.addEventListener("keydown", (W) => {
        W.key === "Enter" && (W.preventDefault(), this._focusSearchResult(y.value, n));
      }), (Ie = n.querySelector("[data-action='run-system-search']")) == null || Ie.addEventListener("click", () => this._focusSearchResult((y == null ? void 0 : y.value) ?? "", n)), (ot = n.querySelector("[data-action='clear-system-search']")) == null || ot.addEventListener("click", () => {
        this.searchQuery = "", y && (y.value = ""), this._applySearchState("", n), y == null || y.focus();
      }), (Ke = n.querySelector("[data-action='open-journal']")) == null || Ke.addEventListener("click", () => this._openLinkedJournal()), (lt = n.querySelector("[data-action='open-scene']")) == null || lt.addEventListener("click", () => this._openLinkedScene()), (et = n.querySelector("[data-action='edit-system']")) == null || et.addEventListener("click", () => {
        this.selectedSystemId && v(this.mapId, this.selectedSystemId);
      }), (ct = n.querySelector("[data-action='reveal-system']")) == null || ct.addEventListener("click", () => {
        this.selectedSystemId && k(this.mapId, this.selectedSystemId);
      }), (dt = n.querySelector("[data-action='hide-system']")) == null || dt.addEventListener("click", () => {
        this.selectedSystemId && T(this.mapId, this.selectedSystemId, !0);
      }), (ut = n.querySelector("[data-action='delete-system']")) == null || ut.addEventListener("click", () => {
        this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), (mt = n.querySelector("[data-action='set-current-system']")) == null || mt.addEventListener("click", () => {
        this.selectedSystemId && j(this.mapId, this.selectedSystemId);
      }), (tt = n.querySelector("[data-action='travel-to-system']")) == null || tt.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? U(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, n));
      }), (at = n.querySelector("[data-action='edit-route']")) == null || at.addEventListener("click", () => {
        this.selectedRouteId && S(this.mapId, this.selectedRouteId);
      }), (st = n.querySelector("[data-action='reveal-route']")) == null || st.addEventListener("click", () => {
        this.selectedRouteId && b(this.mapId, this.selectedRouteId);
      }), (Oe = n.querySelector("[data-action='hide-route']")) == null || Oe.addEventListener("click", () => {
        this.selectedRouteId && R(this.mapId, this.selectedRouteId, !0);
      }), (nt = n.querySelector("[data-action='delete-route']")) == null || nt.addEventListener("click", () => {
        this.selectedRouteId && this._confirmDeleteRoute(this.selectedRouteId);
      }), (ft = n.querySelector("[data-action='notify-discovery']")) == null || ft.addEventListener("click", () => {
        this.selectedSystemId && fe(this.mapId, this.selectedSystemId);
      }), (Pe = n.querySelector("[data-action='show-to-players']")) == null || Pe.addEventListener("click", () => Ge(this.mapId)), (pt = n.querySelector("[data-action='edit-map']")) == null || pt.addEventListener("click", () => {
        const W = D();
        W && (W.selectedMapId = this.mapId, W.render({ force: !0 }));
      });
    }
    _applyViewportTransform(l) {
      var c;
      const n = l.querySelector(".gmf-map-viewport");
      n && (n.style.setProperty("--gmf-pan-x", `${this.panX}px`), n.style.setProperty("--gmf-pan-y", `${this.panY}px`), n.style.setProperty("--gmf-zoom", String(this.zoom)), (c = l.querySelector("[data-zoom-label]")) == null || c.replaceChildren(`${Math.round(this.zoom * 100)}%`));
    }
    _setZoom(l, n) {
      this.zoom = qe(l, _t, $t), this._applyViewportTransform(n);
    }
    _mountBountyIntelCallout(l) {
      var d;
      if (this._bountyIntelCallout || l.querySelector(".gmf-intel-callout")) return;
      const n = (d = l.matches) != null && d.call(l, ".gmf-map-stage") ? l : l.querySelector(".gmf-map-stage"), c = l;
      !n || !c.querySelector("[data-intel-layer]") || (this._bountyIntelCallout = Da({
        root: c,
        stage: n,
        resolveItems: (p) => {
          const y = H(u(this.mapId)).systems.find((E) => E.id === p);
          return y ? Ea(y) : [];
        },
        onOpen: (p) => Ca(p)
      }));
    }
    _attachPlanetListeners(l) {
      var n, c, d, p, y, E, f;
      (n = l.querySelector("[data-action='inspect-system']")) == null || n.addEventListener("click", () => {
        const x = u(this.mapId), N = h(x, { playerMode: this.playerMode, selectedSystemId: this.selectedSystemId });
        this.playerMode && (x == null ? void 0 : x.visibility) !== "players" || Et(N == null ? void 0 : N.selectedSystem) && (this.planetSystemId = this.selectedSystemId, this.render({ force: !0 }));
      }), (c = l.querySelector("[data-action='back-to-galaxy']")) == null || c.addEventListener("click", () => {
        this._disposePlanetRenderer(), this.planetSystemId = null, this._planetReturnFocus = !0, this.render({ force: !0 });
      }), (d = l.querySelector("[data-action='planet-pause']")) == null || d.addEventListener("click", () => {
        var x;
        return (x = this._planetRenderer) == null ? void 0 : x.setPaused(!this._planetRenderer.paused);
      }), (p = l.querySelector("[data-action='planet-zoom-in']")) == null || p.addEventListener("click", () => {
        var x;
        return (x = this._planetRenderer) == null ? void 0 : x.zoom(-0.25);
      }), (y = l.querySelector("[data-action='planet-zoom-out']")) == null || y.addEventListener("click", () => {
        var x;
        return (x = this._planetRenderer) == null ? void 0 : x.zoom(0.25);
      }), (E = l.querySelector("[data-action='planet-reset']")) == null || E.addEventListener("click", () => {
        var x;
        return (x = this._planetRenderer) == null ? void 0 : x.reset();
      }), (f = l.querySelector("[data-action='planet-static']")) == null || f.addEventListener("click", () => {
        this.planetStatic = !this.planetStatic, this.render({ force: !0 });
      });
    }
    async focusSystem(l, n = {}) {
      var ce, me;
      const c = H(u(this.mapId));
      if (!c.systems.find((ae) => ae.id === l)) return !1;
      const p = h(c, {
        playerMode: this.playerMode,
        selectedSystemId: l,
        selectedRouteId: null
      });
      if (!((ce = p == null ? void 0 : p.systems) != null && ce.some((ae) => ae.id === l))) return !1;
      const y = String(n.focusId || l).slice(0, 80), E = ["distress", "warning", "objective", "custom"].includes(n.kind) ? n.kind : "custom", f = /^#[0-9a-f]{6}$/i.test(n.color ?? "") ? n.color : E === "distress" ? "#ff5c7a" : "#58d8ff", x = qe(Number(n.duration) || 0, 0, 6e5), N = qe(Number(n.zoom) || 1.45, _t, $t);
      return this.externalFocus = {
        id: y,
        systemId: l,
        kind: E,
        color: f,
        label: String(n.label || (E === "distress" ? "Distress signal" : "Signal located")).slice(0, 120)
      }, this.selectedSystemId = l, this.planetSystemId = null, this.selectedRouteId = null, this._pendingFocusZoom = N, this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, await this.render({ force: !0 }), (me = this.bringToFront) == null || me.call(this), x > 0 && (this._externalFocusTimeout = globalThis.setTimeout(() => {
        var ae;
        ((ae = this.externalFocus) == null ? void 0 : ae.id) === y && this.clearSystemFocus(y);
      }, x)), !0;
    }
    clearSystemFocus(l = "") {
      return !this.externalFocus || l && this.externalFocus.id !== l ? !1 : (this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, this._pendingFocusZoom = null, this.externalFocus = null, this.rendered && this.render({ force: !0 }), !0);
    }
    _centerOnSystem(l, n, c) {
      const d = n.querySelector(".gmf-map-stage");
      if (!d) return;
      const p = d.getBoundingClientRect();
      this.zoom = c, this.panX = p.width / 2 - Number(l.x) / 100 * p.width * c, this.panY = p.height / 2 - Number(l.y) / 100 * p.height * c, this._applyViewportTransform(n);
    }
    _getVisibleSystems() {
      var n;
      const l = u(this.mapId);
      return l ? ((n = h(l, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      })) == null ? void 0 : n.systems) ?? [] : [];
    }
    _applySearchState(l, n) {
      var p;
      const c = String(l || "").trim().toLocaleLowerCase(), d = Array.from(n.querySelectorAll("[data-system-id]"));
      return d.forEach((y) => {
        const E = String(y.dataset.searchText || "").toLocaleLowerCase(), f = !!(c && E.includes(c));
        y.classList.toggle("is-search-match", f), y.classList.toggle("is-search-dimmed", !!(c && !f));
      }), (p = n.querySelector("[data-action='clear-system-search']")) == null || p.toggleAttribute("hidden", !c), d.find((y) => y.classList.contains("is-search-match")) ?? null;
    }
    _focusSearchResult(l, n) {
      var E;
      const c = String(l || "").trim().toLocaleLowerCase();
      if (!c) {
        (E = n.querySelector("[data-system-search]")) == null || E.focus();
        return;
      }
      const d = this._getVisibleSystems(), p = (f) => [f.displayName, f.displayType, f.displayStatus, f.factionName].filter(Boolean).join(" ").toLocaleLowerCase(), y = d.find((f) => f.displayName.toLocaleLowerCase() === c) ?? d.find((f) => f.displayName.toLocaleLowerCase().startsWith(c)) ?? d.find((f) => p(f).includes(c));
      if (!y) {
        Se(`No charted system matches "${String(l).trim()}".`);
        return;
      }
      this.searchQuery = String(l), this.selectedSystemId = y.id, this.selectedRouteId = null, this._centerOnSystem(y, n, Math.max(this.zoom, 1.2)), this.render({ force: !0 });
    }
    _onWheelZoom(l, n) {
      l.preventDefault();
      const c = n.querySelector(".gmf-map-stage");
      if (!c) return;
      const d = c.getBoundingClientRect(), p = this.zoom, y = qe(p + (l.deltaY < 0 ? 0.12 : -0.12), _t, $t), E = l.clientX - d.left, f = l.clientY - d.top, x = (E - this.panX) / p, N = (f - this.panY) / p;
      this.zoom = y, this.panX = E - x * y, this.panY = f - N * y, this._applyViewportTransform(n);
    }
    _startPan(l, n) {
      if (l.button !== 0 || l.target.closest("[data-system-id], [data-route-id], button, input")) return;
      l.preventDefault();
      const c = l.clientX, d = l.clientY, p = this.panX, y = this.panY, E = (x) => {
        this.panX = p + x.clientX - c, this.panY = y + x.clientY - d, this._applyViewportTransform(n);
      }, f = () => {
        window.removeEventListener("pointermove", E), window.removeEventListener("pointerup", f);
      };
      window.addEventListener("pointermove", E), window.addEventListener("pointerup", f, { once: !0 });
    }
    _startSystemDrag(l, n, c) {
      var ae;
      if (l.button !== 0) return;
      l.preventDefault(), l.stopPropagation(), (ae = c.setPointerCapture) == null || ae.call(c, l.pointerId);
      const d = l.clientX, p = l.clientY;
      let y = this._pointerToMapPercent(l, n), E = !1, f = null;
      const x = Array.from(n.querySelectorAll(`[data-route-from="${c.dataset.systemId}"]`)), N = Array.from(n.querySelectorAll(`[data-route-to="${c.dataset.systemId}"]`));
      c.classList.add("is-dragging");
      const ce = (be) => {
        const Te = Math.abs(be.clientX - d), Ie = Math.abs(be.clientY - p);
        E = E || Te > 3 || Ie > 3, y = this._pointerToMapPercent(be, n), c.dataset.dragged = E ? "true" : "false", !f && (f = requestAnimationFrame(() => {
          f = null, c.style.left = `${y.x}%`, c.style.top = `${y.y}%`, this._updateConnectedRoutes(x, N, y.x, y.y);
        }));
      }, me = async () => {
        f && cancelAnimationFrame(f), c.style.left = `${y.x}%`, c.style.top = `${y.y}%`, this._updateConnectedRoutes(x, N, y.x, y.y), c.classList.remove("is-dragging"), window.removeEventListener("pointermove", ce), window.removeEventListener("pointerup", me), E && await he(this.mapId, c.dataset.systemId, y.x, y.y);
      };
      window.addEventListener("pointermove", ce), window.addEventListener("pointerup", me, { once: !0 });
    }
    _pointerToMapPercent(l, n) {
      const d = n.querySelector(".gmf-map-stage").getBoundingClientRect();
      return {
        x: qe((l.clientX - d.left - this.panX) / this.zoom / d.width * 100, 0, 100),
        y: qe((l.clientY - d.top - this.panY) / this.zoom / d.height * 100, 0, 100)
      };
    }
    _updateConnectedRoutes(l, n, c, d) {
      l.forEach((p) => {
        p.setAttribute("x1", c), p.setAttribute("y1", d);
      }), n.forEach((p) => {
        p.setAttribute("x2", c), p.setAttribute("y2", d);
      });
    }
    _openContextMenu(l, n) {
      var Te;
      if (!((Te = game.user) != null && Te.isGM) || this.playerMode || l.target.closest(".gmf-map-toolbar, .gmf-context-menu")) return;
      l.preventDefault(), l.stopPropagation();
      const c = l.target.closest("[data-route-id]"), d = l.target.closest("[data-system-id]"), p = this._pointerToMapPercent(l, n);
      this._contextTarget = c ? { type: "route", id: c.dataset.routeId, position: p } : d ? { type: "system", id: d.dataset.systemId, position: p } : { type: "stage", id: null, position: p };
      const y = n.querySelector("[data-gmf-context-menu]");
      if (!y) return;
      y.querySelectorAll("[data-context-show]").forEach((Ie) => {
        Ie.hidden = Ie.dataset.contextShow !== this._contextTarget.type;
      }), y.hidden = !1;
      const E = y.offsetWidth || 184, f = y.offsetHeight || 260, N = n.querySelector(".gmf-map-stage").getBoundingClientRect(), ce = l.clientX - N.left, me = l.clientY - N.top, ae = Math.max(4, N.width - E - 4), be = Math.max(4, N.height - f - 4);
      y.style.left = `${qe(ce, 4, ae)}px`, y.style.top = `${qe(me, 4, be)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(n), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _openStageMenuFromButton(l, n) {
      var y;
      if (!((y = game.user) != null && y.isGM) || this.playerMode) return;
      l.preventDefault(), l.stopPropagation();
      const c = n.querySelector(".gmf-map-stage"), d = c == null ? void 0 : c.getBoundingClientRect();
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
      this._openContextMenu(p, n);
    }
    _hideContextMenu(l = null) {
      var d, p, y;
      const n = l ?? this.element ?? null, c = ((d = n == null ? void 0 : n.querySelector) == null ? void 0 : d.call(n, "[data-gmf-context-menu]")) ?? ((y = (p = n == null ? void 0 : n[0]) == null ? void 0 : p.querySelector) == null ? void 0 : y.call(p, "[data-gmf-context-menu]"));
      c && (c.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(l, n) {
      l.preventDefault(), l.stopPropagation();
      const c = l.currentTarget.dataset.contextAction, d = this._contextTarget;
      this._hideContextMenu(n), d && (c === "add-system" ? v(this.mapId, null, { x: d.position.x, y: d.position.y }) : c === "add-route" ? S(this.mapId) : c === "manage-factions" ? I(this.mapId) : c === "add-faction" ? q(this.mapId) : c === "edit-map-details" ? _(this.mapId) : c === "export-map" ? ye(this.mapId) : c === "edit-system" ? v(this.mapId, d.id) : c === "add-route-from-system" ? S(this.mapId, null, { fromSystemId: d.id }) : c === "reveal-system" ? await k(this.mapId, d.id) : c === "hide-system" ? await T(this.mapId, d.id, !0) : c === "delete-system" ? await this._confirmDeleteSystem(d.id) : c === "edit-route" ? S(this.mapId, d.id) : c === "reveal-route" ? await b(this.mapId, d.id) : c === "hide-route" ? await R(this.mapId, d.id, !0) : c === "delete-route" && await this._confirmDeleteRoute(d.id));
    }
    async _confirmDeleteSystem(l) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }) && await le(this.mapId, l);
    }
    async _confirmDeleteRoute(l) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }) && await ve(this.mapId, l);
    }
    async _travelToSystem(l, n) {
      const c = H(u(this.mapId)), d = c.systems.find((E) => E.id === c.currentSystemId), p = c.systems.find((E) => E.id === l);
      if (!p) return;
      if (!d) {
        await j(this.mapId, p.id), Se(`Current location set to ${p.name}.`);
        return;
      }
      if (d.id === p.id) {
        Se(`${p.name} is already the current location.`);
        return;
      }
      if (!X(c, d.id, p.id)) {
        _e(`No direct route from ${d.name} to ${p.name}.`);
        return;
      }
      Ae(this.mapId, d.id, p.id), await this._animateShipTravel(d, p, n), await j(this.mapId, p.id), Se(`Arrived at ${p.name}.`);
    }
    _animateShipTravel(l, n, c) {
      const d = c.querySelector("[data-ship-layer]"), p = c.querySelector(".gmf-map-stage");
      if (!d || !p) return Promise.resolve();
      const y = p.getBoundingClientRect(), E = (n.x - l.x) * y.width / 100, f = (n.y - l.y) * y.height / 100, x = Math.atan2(f, E) * 180 / Math.PI, N = document.createElement("div");
      return N.className = "gmf-travel-ship", N.innerHTML = '<i class="fa-solid fa-rocket"></i>', N.style.left = `${l.x}%`, N.style.top = `${l.y}%`, N.style.setProperty("--gmf-ship-angle", `${x}deg`), d.replaceChildren(N), new Promise((ce) => {
        let me = !1;
        const ae = () => {
          me || (me = !0, N.removeEventListener("transitionend", ae), N.classList.add("is-arrived"), globalThis.setTimeout(() => {
            N.remove(), ce();
          }, 260));
        };
        N.addEventListener("transitionend", ae, { once: !0 }), requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            N.style.left = `${n.x}%`, N.style.top = `${n.y}%`;
          });
        }), globalThis.setTimeout(ae, aa);
      });
    }
    _openLinkedJournal() {
      var c, d;
      const l = this._getSelectedRawSystem();
      if (!(l != null && l.journalId)) return;
      const n = (c = game.journal) == null ? void 0 : c.get(l.journalId);
      if (!n) {
        _e(`Journal "${l.journalId}" was not found.`);
        return;
      }
      (d = n.sheet) == null || d.render(!0);
    }
    _openLinkedScene() {
      const l = this._getSelectedRawSystem(), n = ((l == null ? void 0 : l.sceneIds) ?? []).map((d) => {
        var p;
        return (p = game.scenes) == null ? void 0 : p.get(d);
      }).filter(Boolean);
      if (!n.length) {
        _e("No available scene is linked to this system.");
        return;
      }
      if (n.length === 1) {
        this._viewLinkedScene(n[0]);
        return;
      }
      const c = n.map((d) => `<option value="${w(d.id)}">${w(d.name || d.id)}</option>`).join("");
      new Dialog({
        title: `Go to Scene · ${l.name}`,
        content: `<form class="gmf-scene-choice-form"><label>Linked scene<select name="sceneId" autofocus>${c}</select></label><p>Choose which linked scene to open.</p></form>`,
        render: (d) => {
          var p, y;
          return (y = (p = Be(d)) == null ? void 0 : p.querySelector('[name="sceneId"]')) == null ? void 0 : y.focus();
        },
        buttons: {
          cancel: { icon: '<i class="fa-solid fa-xmark"></i>', label: "Cancel" },
          open: {
            icon: '<i class="fa-solid fa-arrow-up-right-from-square"></i>',
            label: "Go to Scene",
            callback: (d) => {
              var y, E, f;
              const p = (E = (y = Be(d)) == null ? void 0 : y.querySelector('[name="sceneId"]')) == null ? void 0 : E.value;
              this._viewLinkedScene((f = game.scenes) == null ? void 0 : f.get(p));
            }
          }
        },
        default: "open"
      }, {
        classes: ["galaxy-map", "gmf-crud-dialog", "gmf-scene-choice-dialog"],
        width: 400
      }).render(!0);
    }
    _viewLinkedScene(l) {
      var n;
      l && (l != null && l.view ? l.view() : (n = l == null ? void 0 : l.sheet) == null || n.render(!0));
    }
    _getSelectedRawSystem() {
      var n;
      const l = u(this.mapId);
      return ((n = l == null ? void 0 : l.systems) == null ? void 0 : n.find((c) => c.id === this.selectedSystemId)) ?? null;
    }
    async close(l = {}) {
      var n, c;
      return (c = (n = this._bountyIntelCallout) == null ? void 0 : n.dispose) == null || c.call(n), this._bountyIntelCallout = null, this._disposePlanetRenderer(), this._hideContextMenu(), this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, G(this), super.close(l);
    }
    _disposePlanetRenderer() {
      var l;
      this._planetGeneration++, (l = this._planetRenderer) == null || l.dispose(), this._planetRenderer = null;
    }
    _setPlanetFallback(l, n) {
      const c = l.querySelector(".gmf-planet-fallback");
      c && (c.style.backgroundImage = n.texture ? `url(${JSON.stringify(n.texture)})` : "none", c.style.backgroundColor = n.color);
      const d = l.querySelector("[data-planet-canvas]");
      d && (d.dataset.planetShape = n.shape);
      const p = l.querySelector(".gmf-planet-stage");
      p == null || p.style.setProperty("--gmf-planet-color", n.color);
      const y = l.querySelector("[data-planet-appearance]");
      y && (y.textContent = n.label);
    }
    async _mountPlanetRenderer(l, n) {
      const c = l.querySelector("[data-planet-canvas]");
      if (!c || !n) return;
      this._setPlanetFallback(l, n);
      const d = this._planetGeneration, p = l.querySelector("[data-planet-status]"), y = l.querySelector("[data-action='planet-static']"), E = l.querySelectorAll("[data-planet-control]");
      if (y && (y.textContent = this.planetStatic ? "Enable 3D" : "Static view", y.setAttribute("aria-pressed", String(this.planetStatic))), this.planetStatic) {
        p && (p.textContent = "Static preview · Enable 3D to rotate and zoom"), E.forEach((f) => f.disabled = !0);
        return;
      }
      try {
        const { createPlanetRenderer: f } = await import("./chunks/planet-renderer-CRO6eCfL.js");
        if (d !== this._planetGeneration || !c.isConnected) return;
        E.forEach((x) => x.disabled = !1), this._planetRenderer = f(c, {
          texture: n.texture,
          color: n.color,
          shape: n.shape,
          isVisible: () => !this.minimized && !this._minimized,
          onStatus: (x) => {
            p && (p.textContent = x);
          },
          onPaused: (x) => {
            const N = l.querySelector("[data-action='planet-pause']");
            N && (N.textContent = x ? "Resume rotation" : "Pause rotation", N.setAttribute("aria-pressed", String(x)));
          },
          onStopped: () => {
            E.forEach((x) => x.disabled = !0), p && (p.textContent = "Static preview · Reopen this detail view to resume 3D");
          }
        });
      } catch {
        E.forEach((f) => f.disabled = !0), p && (p.textContent = "3D could not be loaded. Static preview shown.");
      }
    }
  }, Y(P, "DEFAULT_OPTIONS", {
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
  }), Y(P, "PARTS", {
    main: {
      template: `${g}/galaxy-map.hbs`
    }
  }), P;
}
const ze = "galaxy-map", Tt = "maps", te = `module.${ze}`, Ye = `modules/${ze}/templates`;
(() => {
  let o = null;
  const g = /* @__PURE__ */ new Map();
  let u = null;
  const h = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Set(), S = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map();
  function I(e) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? {}));
  }
  function _(e) {
    var t;
    (t = ui.notifications) == null || t.error(`[Galaxy Map] ${e}`);
  }
  function k(e) {
    var t;
    (t = ui.notifications) == null || t.info(`[Galaxy Map] ${e}`);
  }
  function b(e = "change galaxy maps") {
    var t;
    return (t = game.user) != null && t.isGM ? !0 : (_(`Only a GM can ${e}.`), !1);
  }
  function T() {
    var e;
    return ((e = game.users) == null ? void 0 : e.contents) ?? Array.from(game.users ?? []);
  }
  function R() {
    return T().filter((e) => e.active);
  }
  function le() {
    return R().filter((e) => e.isGM).sort((e, t) => String(e.id).localeCompare(String(t.id)))[0] ?? null;
  }
  function ve() {
    var e, t;
    return !!((e = game.user) != null && e.isGM && ((t = le()) == null ? void 0 : t.id) === game.user.id);
  }
  function j() {
    return I(game.settings.get(ze, Tt) ?? {});
  }
  async function U(e) {
    return b("save galaxy map data") && await game.settings.set(ze, Tt, e ?? {}), e;
  }
  function fe(e) {
    var jt, Vt;
    const t = Be(e), a = (t == null ? void 0 : t.ownerDocument) ?? window.document, s = new AbortController(), i = t ? new MutationObserver(() => {
      t.isConnected || (s.abort(), i.disconnect());
    }) : null;
    t && a.body && (i == null || i.observe(a.body, { childList: !0, subtree: !0 }));
    let r = null;
    const m = (L = !1) => {
      if (!r) return;
      const C = r.closest("[data-linked-documents]");
      r.hidden = !0, r.style.removeProperty("left"), r.style.removeProperty("top"), r.style.removeProperty("width");
      const A = (C == null ? void 0 : C.querySelector("[data-open-document-picker]")) ?? null;
      A == null || A.setAttribute("aria-expanded", "false"), r = null, L && (A == null || A.focus());
    }, F = () => {
      var Le;
      if (!r || r.hidden) return;
      const L = ((Le = r.closest("[data-linked-documents]")) == null ? void 0 : Le.querySelector("[data-open-document-picker]")) ?? null;
      if (!L) return;
      const C = a.documentElement.clientWidth, A = a.documentElement.clientHeight, z = Math.min(320, C - 24);
      r.style.width = `${z}px`;
      const Q = L.getBoundingClientRect(), xe = r.getBoundingClientRect(), Ee = Math.max(12, Math.min(Q.right - z, C - z - 12)), Ce = Q.bottom + 6, Me = Ce + xe.height <= A - 12 ? Ce : Math.max(12, Q.top - xe.height - 6);
      r.style.left = `${Ee}px`, r.style.top = `${Me}px`;
    };
    a.addEventListener("pointerdown", (L) => {
      var z;
      if (!r) return;
      const C = L.target, A = (z = r.closest("[data-linked-documents]")) == null ? void 0 : z.querySelector("[data-open-document-picker]");
      !r.contains(C) && !(A != null && A.contains(C)) && m();
    }, { signal: s.signal }), a.addEventListener("keydown", (L) => {
      L.key !== "Escape" || !r || (L.preventDefault(), L.stopPropagation(), m(!0));
    }, { capture: !0, signal: s.signal }), a.addEventListener("scroll", F, { capture: !0, passive: !0, signal: s.signal }), (jt = a.defaultView) == null || jt.addEventListener("resize", F, { signal: s.signal }), t == null || t.querySelectorAll("[data-browse-target]").forEach((L) => {
      L.addEventListener("click", (C) => {
        C.preventDefault();
        const A = t.querySelector(`[name="${L.dataset.browseTarget}"]`);
        A && new FilePicker({
          type: "image",
          current: A.value,
          callback: (z) => {
            A.value = z, A.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        }).browse();
      });
    });
    const V = Array.from((t == null ? void 0 : t.querySelectorAll("[data-system-editor-tab]")) ?? []), O = Array.from((t == null ? void 0 : t.querySelectorAll("[data-system-editor-panel]")) ?? []), Z = (L, C = !1) => {
      m(), V.forEach((A) => {
        const z = A.dataset.systemEditorTab === L;
        A.classList.toggle("is-active", z), A.setAttribute("aria-selected", String(z)), A.tabIndex = z ? 0 : -1, z && C && A.focus();
      }), O.forEach((A) => {
        A.hidden = A.dataset.systemEditorPanel !== L;
      });
    };
    V.forEach((L, C) => {
      L.addEventListener("click", () => Z(L.dataset.systemEditorTab ?? "overview")), L.addEventListener("keydown", (A) => {
        if (!["ArrowLeft", "ArrowRight"].includes(A.key)) return;
        A.preventDefault();
        const z = A.key === "ArrowRight" ? 1 : -1, Q = V[(C + z + V.length) % V.length];
        Z(Q.dataset.systemEditorTab ?? "overview", !0);
      });
    }), V.length && Z("overview"), t == null || t.querySelectorAll("[data-marker-preview]").forEach((L) => {
      const C = L.closest("form"), A = (C == null ? void 0 : C.querySelector('[name="iconStyle"]')) ?? null, z = (C == null ? void 0 : C.querySelector('[name="type"]')) ?? null, Q = (C == null ? void 0 : C.querySelector('[name="status"]')) ?? null, xe = (C == null ? void 0 : C.querySelector('[name="iconColor"]')) ?? null, Ee = (C == null ? void 0 : C.querySelector('[name="iconSize"]')) ?? null, Ce = (C == null ? void 0 : C.querySelector('[name="pulse"]')) ?? null, Me = (C == null ? void 0 : C.querySelector('[name="name"]')) ?? null, Le = L.querySelector("[data-marker-preview-system]"), Fe = L.querySelector("[data-marker-preview-icon]"), rt = L.querySelector("[data-marker-preview-label]");
      let Ze = 0;
      const De = async () => {
        if (!Le || !Fe) return;
        const ke = (z == null ? void 0 : z.value) ?? "unknown", ht = (Q == null ? void 0 : Q.value) ?? "known", Je = he(ke, (A == null ? void 0 : A.value) ?? "planet");
        Le.className = `gmf-system gmf-system--${ke} gmf-icon--${Je} gmf-status--${ht}${Ce != null && Ce.checked ? " is-marker-preview-pulsing" : " gmf-no-pulse"}`, Le.style.setProperty("--gmf-faction-color", (xe == null ? void 0 : xe.value) || "#58d8ff"), Le.style.setProperty("--gmf-system-size", `${(Ee == null ? void 0 : Ee.value) || 28}px`), rt && (rt.textContent = (Me == null ? void 0 : Me.value.trim()) || "New System");
        const K = ++Ze;
        if (Xt.includes(Je)) {
          const re = await renderTemplate(`${Ye}/celestial-icon.hbs`, { system: { iconStyle: Je } });
          K === Ze && (Fe.innerHTML = re);
        } else
          Fe.innerHTML = '<span class="gmf-system__core"></span>';
      };
      for (const ke of [A, z, Q, xe, Ee, Ce, Me])
        ke == null || ke.addEventListener("input", De), ke == null || ke.addEventListener("change", De);
      De();
    }), t == null || t.querySelectorAll("[data-linked-documents]").forEach((L) => {
      var ht, Je;
      const C = L.querySelector("[data-linked-document-list]"), A = L.querySelector("[data-document-picker]"), z = L.querySelector("[data-document-search]"), Q = L.querySelector("[data-document-results]"), xe = ((ht = game[L.dataset.collection]) == null ? void 0 : ht.contents) ?? [], Ee = L.dataset.inputName ?? "documentId", Ce = L.dataset.multiple === "true", Me = L.dataset.kindLabel ?? "Document", Le = L.dataset.iconClass ?? "fa-file", Fe = L.querySelector("[data-open-document-picker]"), rt = () => new Set(Array.from((C == null ? void 0 : C.querySelectorAll(`input[name="${Ee}"]`)) ?? []).map((K) => K.value)), Ze = () => {
        const K = L.querySelector("[data-linked-document-empty]");
        K && (K.hidden = !!(C != null && C.querySelector("[data-linked-document]")));
      }, De = () => {
        if (!Q) return;
        const K = (z == null ? void 0 : z.value.trim().toLocaleLowerCase()) ?? "", re = rt(), de = xe.filter((ne) => !re.has(String(ne.id))).filter((ne) => !K || String(ne.name ?? ne.id).toLocaleLowerCase().includes(K));
        Q.replaceChildren();
        for (const ne of de.slice(0, 50)) {
          const Ne = window.document.createElement("button");
          Ne.type = "button", Ne.className = "gmf-document-picker__result", Ne.dataset.documentId = String(ne.id), Ne.textContent = String(ne.name ?? ne.id), Q.append(Ne);
        }
        if (de.length) {
          if (de.length > 50) {
            const ne = window.document.createElement("p");
            ne.textContent = `${de.length - 50} more results — refine your search.`, Q.append(ne);
          }
        } else {
          const ne = window.document.createElement("p");
          ne.textContent = xe.length ? `No matching ${Me.toLocaleLowerCase()}s.` : `No ${Me.toLocaleLowerCase()}s exist in this world yet.`, Q.append(ne);
        }
      }, ke = (K) => {
        if (!C || rt().has(String(K.id))) return;
        Ce || C.querySelectorAll("[data-linked-document]").forEach((ba) => ba.remove());
        const re = a.createElement("div");
        re.className = "gmf-linked-document", re.dataset.linkedDocument = "", re.dataset.documentId = String(K.id);
        const de = a.createElement("i");
        de.className = `fa-solid ${Le} gmf-linked-document__icon`, de.setAttribute("aria-hidden", "true");
        const ne = a.createElement("span");
        ne.className = "gmf-linked-document__copy";
        const Ne = a.createElement("strong");
        Ne.textContent = String(K.name ?? K.id);
        const Ht = a.createElement("small");
        Ht.textContent = Me, ne.append(Ne, Ht);
        const vt = a.createElement("input");
        vt.type = "hidden", vt.name = Ee, vt.value = String(K.id);
        const He = a.createElement("button");
        He.type = "button", He.dataset.unlinkDocument = "", He.title = `Remove ${Me.toLocaleLowerCase()}`, He.setAttribute("aria-label", He.title), He.innerHTML = '<i class="fa-solid fa-xmark"></i><span>Unlink</span>', re.append(de, ne, vt, He), C.append(re), Ze(), De(), m(!0);
      };
      C == null || C.addEventListener("click", (K) => {
        var de;
        const re = K.target.closest("[data-unlink-document]");
        re && ((de = re.closest("[data-linked-document]")) == null || de.remove(), Ze(), De());
      }), Fe == null || Fe.addEventListener("click", () => {
        if (A) {
          if (r === A) return m(!0);
          m(), r = A, A.hidden = !1, Fe.setAttribute("aria-expanded", "true"), De(), requestAnimationFrame(() => {
            F(), z == null || z.focus(), z == null || z.select();
          });
        }
      }), (Je = L.querySelector("[data-close-document-picker]")) == null || Je.addEventListener("click", () => m(!0)), z == null || z.addEventListener("input", De), z == null || z.addEventListener("keydown", (K) => {
        var re, de;
        K.key === "ArrowDown" && (K.preventDefault(), (re = Q == null ? void 0 : Q.querySelector("[data-document-id]")) == null || re.focus()), K.key === "Enter" && (K.preventDefault(), K.stopPropagation(), (de = Q == null ? void 0 : Q.querySelector("[data-document-id]")) == null || de.click());
      }), Q == null || Q.addEventListener("click", (K) => {
        const re = K.target.closest("[data-document-id]"), de = xe.find((ne) => String(ne.id) === (re == null ? void 0 : re.dataset.documentId));
        de && ke(de);
      }), Ze();
    });
    const B = t == null ? void 0 : t.querySelector("[data-texture-upload-fields]"), M = t == null ? void 0 : t.querySelector('[name="planetTexture"]'), se = t == null ? void 0 : t.querySelector("[data-color-appearance-fields]"), J = t == null ? void 0 : t.querySelector("[data-texture-upload-status]"), we = t == null ? void 0 : t.querySelector('[name="planetPreset"]'), Ve = t == null ? void 0 : t.querySelector('[name="planetShape"]'), $ = t == null ? void 0 : t.querySelector("[data-texture-guide]"), ge = (t == null ? void 0 : t.querySelectorAll("[data-texture-guide-preview]")) ?? [], ie = () => {
      const L = (we == null ? void 0 : we.value) === "custom";
      return B && (B.hidden = !L), se && (se.hidden = (we == null ? void 0 : we.value) !== "color"), M && (M.required = L), L;
    }, Re = () => {
      var C;
      if (!$) return;
      const L = (C = M == null ? void 0 : M.value) == null ? void 0 : C.trim();
      L ? ($.dataset.hasTexture = "true", J && (J.textContent = "Loading custom texture preview…"), ge.forEach((A) => {
        A.hidden = !1, A.onload = () => {
          var z;
          ((z = M == null ? void 0 : M.value) == null ? void 0 : z.trim()) === L && J && (J.textContent = "Custom texture selected · visible beneath the guide");
        }, A.onerror = () => {
          var z;
          A.hidden = !0, ((z = M == null ? void 0 : M.value) == null ? void 0 : z.trim()) === L && J && (J.textContent = "Custom texture selected, but its preview could not be loaded");
        }, A.src = L;
      })) : (delete $.dataset.hasTexture, ge.forEach((A) => {
        A.onload = null, A.onerror = null, A.removeAttribute("src"), A.hidden = !0;
      }));
    }, it = () => {
      var L;
      J && (J.textContent = (L = M == null ? void 0 : M.value) != null && L.trim() ? "Loading custom texture preview…" : "Choose an image to preview it beneath the guide"), Re();
    };
    we == null || we.addEventListener("change", () => {
      !ie() && (M != null && M.value) && (M.value = "", M.dispatchEvent(new Event("change", { bubbles: !0 })));
    }), (Vt = t == null ? void 0 : t.querySelector("[data-clear-planet-texture]")) == null || Vt.addEventListener("click", () => {
      M && (M.value = "", M.dispatchEvent(new Event("change", { bubbles: !0 })));
    }), M == null || M.addEventListener("change", it), Ve == null || Ve.addEventListener("change", () => {
      $ && ($.dataset.shape = Ve.value);
    }), ie(), it();
  }
  function ye({ title: e, content: t, submitLabel: a = "Save", onSubmit: s, render: i = fe, width: r = 700, height: m = "auto", dialogClass: F = "" }) {
    new Dialog({
      title: e,
      content: t,
      render: i,
      buttons: {
        cancel: {
          icon: '<i class="fa-solid fa-xmark"></i>',
          label: "Cancel"
        },
        save: {
          icon: '<i class="fa-solid fa-floppy-disk"></i>',
          label: a,
          callback: (V) => {
            var M, se;
            const O = Be(V), Z = (M = O == null ? void 0 : O.matches) != null && M.call(O, "form") ? O : O == null ? void 0 : O.querySelector("form"), B = Z ? Array.from(Z.elements).find((J) => J.willValidate && !J.checkValidity()) : null;
            if (B) {
              const J = B.closest("[data-system-editor-panel]");
              return J != null && J.dataset.systemEditorPanel && ((se = O.querySelector(`[data-system-editor-tab="${J.dataset.systemEditorPanel}"]`)) == null || se.click()), B.reportValidity(), B.focus(), !1;
            }
            return s(Ba(V));
          }
        }
      },
      default: "save"
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog", F].filter(Boolean),
      width: r,
      height: m
    }).render(!0);
  }
  function X(e) {
    const t = j();
    return t[e] ? I(t[e]) : null;
  }
  function Ae(e) {
    return new Map((e ?? []).map((t) => [t.id, t]));
  }
  function Se(e) {
    return e.visibility === "players";
  }
  function _e(e, t) {
    return t && e.status === "undiscovered";
  }
  function he(e, t) {
    return t === "planet" ? { station: "station", anomaly: "diamond", ruins: "diamond", unknown: "diamond" }[e] ?? t : t;
  }
  function Ge(e, { playerMode: t = !1, selectedSystemId: a = null, selectedRouteId: s = null } = {}) {
    var we, Ve;
    const i = H(e), r = t ? i.systems.filter(Se) : i.systems, m = new Set(r.map(($) => $.id)), F = t ? i.factions.filter(($) => $.visibility === "players") : i.factions, V = Ae(F), O = r.map(($) => {
      const ge = V.get($.factionId), ie = _e($, t), Re = ie ? "unknown" : $.type, it = ie ? "diamond" : he(Re, $.iconStyle);
      return {
        ...$,
        iconStyle: it,
        displayName: ie ? "???" : $.name,
        displayDescription: ie ? "Unresolved sensor contact. Details are not available." : $.description,
        displayType: Re,
        displayStatus: ie ? "undiscovered" : $.status,
        factionName: (ge == null ? void 0 : ge.name) ?? "Unaffiliated",
        factionColor: $.iconColor || (ge == null ? void 0 : ge.color) || "#58d8ff",
        obscured: ie,
        isCurrent: $.id === i.currentSystemId,
        isSelected: $.id === a,
        gmOnly: $.visibility === "gm",
        animatedCelestial: Xt.includes(it),
        hasAlert: ["danger", "locked"].includes(ie ? "undiscovered" : $.status),
        alertLabel: $.status === "danger" ? "Hazard advisory" : $.status === "locked" ? "Restricted access" : "",
        hasJournal: !!(!ie && $.journalId),
        hasScenes: !!(!ie && $.sceneIds.length),
        showImage: !!(!ie && $.image),
        canInspectSystem: !!Et({ ...$, obscured: ie })
      };
    }), Z = i.routes.filter(($) => !t || $.visibility === "players").filter(($) => m.has($.fromSystemId) && m.has($.toSystemId)).map(($) => {
      const ge = O.find((Re) => Re.id === $.fromSystemId), ie = O.find((Re) => Re.id === $.toSystemId);
      return {
        ...$,
        from: ge,
        to: ie,
        fromName: (ge == null ? void 0 : ge.displayName) ?? $.fromSystemId,
        toName: (ie == null ? void 0 : ie.displayName) ?? $.toSystemId,
        isSelected: $.id === s,
        connectsCurrent: $.fromSystemId === i.currentSystemId || $.toSystemId === i.currentSystemId,
        gmOnly: $.visibility === "gm"
      };
    }), B = Z.find(($) => $.id === s) ?? null, M = B ? null : O.find(($) => $.id === a) ?? O[0] ?? null;
    M && (M.isSelected = !0);
    const se = O.find(($) => $.id === i.currentSystemId) ?? O[0] ?? null, J = M && se && M.id !== se.id ? Z.find(($) => $.fromSystemId === se.id && $.toSystemId === M.id || $.toSystemId === se.id && $.fromSystemId === M.id) : null;
    return M && (M.canTravel = !!J, M.travelRouteId = (J == null ? void 0 : J.id) ?? "", M.isCurrent = M.id === (se == null ? void 0 : se.id), M.isDestination = !!(J && !M.isCurrent)), Z.forEach(($) => {
      $.isActive = $.isSelected || $.id === (J == null ? void 0 : J.id);
    }), {
      ...i,
      systems: O,
      routes: Z,
      factions: F,
      selectedSystem: M,
      selectedRoute: B,
      currentSystem: se,
      selectedType: B ? "route" : "system",
      playerMode: t,
      isGM: ((we = game.user) == null ? void 0 : we.isGM) ?? !1,
      canEdit: ((Ve = game.user) == null ? void 0 : Ve.isGM) && !t
    };
  }
  async function D(e = {}) {
    if (!b("create galaxy maps")) return null;
    const t = j(), a = H(e);
    return t[a.id] = a, await U(t), ee(a.id), I(a);
  }
  async function G(e, t = {}) {
    if (!b("update galaxy maps")) return null;
    const a = j();
    if (!a[e])
      return _(`Map "${e}" was not found.`), null;
    const s = H({ ...t, id: e });
    return a[e] = s, await U(a), ee(e), I(s);
  }
  async function P(e, t = {}) {
    if (!b("update galaxy map metadata")) return null;
    const a = X(e);
    return a ? G(e, {
      ...a,
      title: t.title,
      subtitle: t.subtitle,
      description: t.description,
      backgroundImage: t.backgroundImage,
      visibility: t.visibility
    }) : (_(`Map "${e}" was not found.`), null);
  }
  async function ue(e) {
    if (!b("delete galaxy maps")) return !1;
    const t = j();
    return t[e] ? (delete t[e], await U(t), fa(e), ee(), !0) : !1;
  }
  async function pe(e) {
    if (!b("duplicate galaxy maps")) return null;
    const t = X(e);
    if (!t)
      return _(`Map "${e}" was not found.`), null;
    const a = H({
      ...t,
      id: $e("map"),
      title: `${t.title} Copy`
    }), s = j();
    return s[a.id] = a, await U(s), ee(a.id), I(a);
  }
  async function l(e, t = {}) {
    if (!b("save star systems")) return null;
    const a = j(), s = a[e];
    if (!s)
      return _(`Map "${e}" was not found.`), null;
    const i = At(t), r = s.systems.findIndex((m) => m.id === i.id);
    return r >= 0 ? s.systems[r] = i : s.systems.push(i), a[e] = H(s), await U(a), ee(e), game.socket.emit(te, { action: "refresh", mapId: e }), I(i);
  }
  async function n(e, t) {
    var i;
    if (!b("delete star systems")) return !1;
    const a = j(), s = a[e];
    return s ? (s.systems = s.systems.filter((r) => r.id !== t), s.routes = s.routes.filter((r) => r.fromSystemId !== t && r.toSystemId !== t), s.currentSystemId === t && (s.currentSystemId = ((i = s.systems[0]) == null ? void 0 : i.id) ?? ""), a[e] = H(s), await U(a), ee(e), game.socket.emit(te, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function c(e, t) {
    var r;
    if (!b("set current location")) return null;
    const a = j(), s = a[e], i = (r = s == null ? void 0 : s.systems) == null ? void 0 : r.find((m) => m.id === t);
    return i ? (s.currentSystemId = t, a[e] = H(s), await U(a), ee(e), game.socket.emit(te, { action: "refresh", mapId: e }), I(i)) : (_(`System "${t}" was not found.`), null);
  }
  async function d(e, t = {}) {
    if (!b("save routes")) return null;
    const a = j(), s = a[e];
    if (!s)
      return _(`Map "${e}" was not found.`), null;
    const i = Pt(t);
    if (!i.fromSystemId || !i.toSystemId || i.fromSystemId === i.toSystemId)
      return _("Routes require two different systems."), null;
    const r = s.routes.findIndex((m) => m.id === i.id);
    return r >= 0 ? s.routes[r] = i : s.routes.push(i), a[e] = H(s), await U(a), ee(e), game.socket.emit(te, { action: "refresh", mapId: e }), I(i);
  }
  async function p(e, t) {
    if (!b("delete routes")) return !1;
    const a = j(), s = a[e];
    return s ? (s.routes = s.routes.filter((i) => i.id !== t), a[e] = H(s), await U(a), ee(e), game.socket.emit(te, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function y(e, t = {}) {
    if (!b("save factions")) return null;
    const a = j(), s = a[e];
    if (!s)
      return _(`Map "${e}" was not found.`), null;
    const i = Rt(t), r = s.factions.findIndex((m) => m.id === i.id);
    return r >= 0 ? s.factions[r] = i : s.factions.push(i), a[e] = H(s), await U(a), ee(e), game.socket.emit(te, { action: "refresh", mapId: e }), I(i);
  }
  async function E(e, t) {
    if (!b("delete factions")) return !1;
    const a = j(), s = a[e];
    if (!s) return !1;
    s.factions = s.factions.filter((i) => i.id !== t);
    for (const i of s.systems)
      i.factionId === t && (i.factionId = "");
    return a[e] = H(s), await U(a), ee(e), game.socket.emit(te, { action: "refresh", mapId: e }), !0;
  }
  async function f(e, t, a = !0) {
    var m;
    if (!b(a ? "hide factions" : "reveal factions")) return null;
    const s = j(), i = s[e], r = (m = i == null ? void 0 : i.factions) == null ? void 0 : m.find((F) => F.id === t);
    return r ? (r.visibility = a ? "gm" : "players", s[e] = H(i), await U(s), ee(e), game.socket.emit(te, { action: "refresh", mapId: e }), k(`${r.name} ${a ? "hidden from" : "visible to"} players.`), I(r)) : (_(`Faction "${t}" was not found.`), null);
  }
  async function x(e, t, a, s) {
    var F;
    if (!b("move star systems")) return null;
    const i = j(), r = i[e], m = (F = r == null ? void 0 : r.systems) == null ? void 0 : F.find((V) => V.id === t);
    return m ? (m.x = qe(Qe(a, m.x), 0, 100), m.y = qe(Qe(s, m.y), 0, 100), i[e] = H(r), await U(i), game.socket.emit(te, { action: "refresh", mapId: e }), I(m)) : (_(`System "${t}" was not found.`), null);
  }
  async function N(e, t, { notify: a = !0 } = {}) {
    var m;
    if (!b("reveal star systems")) return null;
    const s = j(), i = s[e], r = (m = i == null ? void 0 : i.systems) == null ? void 0 : m.find((F) => F.id === t);
    return r ? (r.visibility = "players", (r.status === "undiscovered" || r.status === "locked") && (r.status = "known"), s[e] = H(i), await U(s), ee(e), game.socket.emit(te, { action: "refresh", mapId: e }), a && be(e, r.id), k(`${r.name} revealed to players.`), I(r)) : (_(`System "${t}" was not found.`), null);
  }
  async function ce(e, t, a = !0) {
    var m;
    if (!b(a ? "hide star systems" : "reveal star systems")) return null;
    const s = j(), i = s[e], r = (m = i == null ? void 0 : i.systems) == null ? void 0 : m.find((F) => F.id === t);
    return r ? (r.visibility = a ? "gm" : "players", s[e] = H(i), await U(s), ee(e), game.socket.emit(te, { action: "refresh", mapId: e }), k(`${r.name} ${a ? "hidden from" : "visible to"} players.`), I(r)) : (_(`System "${t}" was not found.`), null);
  }
  async function me(e, t) {
    var r;
    if (!b("reveal routes")) return null;
    const a = j(), s = a[e], i = (r = s == null ? void 0 : s.routes) == null ? void 0 : r.find((m) => m.id === t);
    return i ? (i.visibility = "players", a[e] = H(s), await U(a), ee(e), game.socket.emit(te, { action: "refresh", mapId: e }), k("Route revealed to players."), I(i)) : (_(`Route "${t}" was not found.`), null);
  }
  async function ae(e, t, a = !0) {
    var m;
    if (!b(a ? "hide routes" : "reveal routes")) return null;
    const s = j(), i = s[e], r = (m = i == null ? void 0 : i.routes) == null ? void 0 : m.find((F) => F.id === t);
    return r ? (r.visibility = a ? "gm" : "players", s[e] = H(i), await U(s), ee(e), game.socket.emit(te, { action: "refresh", mapId: e }), k(`Route ${a ? "hidden from" : "visible to"} players.`), I(r)) : (_(`Route "${t}" was not found.`), null);
  }
  function be(e, t) {
    var i;
    if (!b("notify players about discoveries")) return;
    const a = X(e), s = (i = a == null ? void 0 : a.systems) == null ? void 0 : i.find((r) => r.id === t);
    if (!s) {
      _(`System "${t}" was not found.`);
      return;
    }
    game.socket.emit(te, {
      action: "notify",
      mapId: e,
      systemId: t,
      message: `New System Discovered: ${s.name}`
    }), k(`Discovery notification sent: ${s.name}.`);
  }
  async function Te(e, { replace: t = !1 } = {}) {
    if (!b("import galaxy maps")) return null;
    const a = j();
    let s = H(e);
    return a[s.id] && !t && (s = H({
      ...s,
      id: $e("map"),
      title: `${s.title} Import`
    })), a[s.id] = s, await U(a), ee(s.id), k(`Imported ${s.title}.`), I(s);
  }
  function Ie(e) {
    const t = X(e);
    if (!t) {
      _(`Map "${e}" was not found.`);
      return;
    }
    za(`${Na(t.title)}.json`, H(t));
  }
  function ot(e) {
    return `
      <div class="gmf-texture-guide" data-texture-guide data-shape="${w(e)}">
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
  function Ke({ collection: e, selectedIds: t, inputName: a, collectionName: s, kindLabel: i, iconClass: r, multiple: m = !1 }) {
    const F = (e == null ? void 0 : e.contents) ?? [], V = new Map(F.map((B) => [String(B.id), B])), Z = (Array.isArray(t) ? t : t ? [t] : []).map(String).map((B) => {
      const M = V.get(B), se = (M == null ? void 0 : M.name) ?? `Missing ${i}`;
      return `<div class="gmf-linked-document ${M ? "" : "is-missing"}" data-linked-document data-document-id="${w(B)}">
        <i class="fa-solid ${w(r)} gmf-linked-document__icon" aria-hidden="true"></i>
        <span class="gmf-linked-document__copy"><strong>${w(se)}</strong><small>${w(M ? i : B)}</small></span>
        <input type="hidden" name="${w(a)}" value="${w(B)}" />
        <button type="button" data-unlink-document title="Unlink ${w(i.toLocaleLowerCase())}" aria-label="Unlink ${w(i.toLocaleLowerCase())}"><i class="fa-solid fa-xmark"></i><span>Unlink</span></button>
      </div>`;
    }).join("");
    return `<div class="gmf-linked-documents" data-linked-documents data-collection="${w(s)}" data-input-name="${w(a)}" data-kind-label="${w(i)}" data-icon-class="${w(r)}" data-multiple="${m}">
      <div class="gmf-linked-document-list" data-linked-document-list>${Z}</div>
      <p class="gmf-linked-document-empty" data-linked-document-empty ${Z ? "hidden" : ""}>No linked ${w(i.toLocaleLowerCase())}${m ? "s" : ""}.</p>
      <button type="button" class="gmf-button--quiet gmf-linked-documents__add" data-open-document-picker aria-haspopup="dialog" aria-expanded="false"><i class="fa-solid fa-plus"></i> Add ${w(i)}</button>
      <div class="gmf-document-picker" data-document-picker role="dialog" aria-label="Choose ${w(i.toLocaleLowerCase())}" hidden>
        <div class="gmf-document-picker__toolbar">
          <label>Search ${w(i.toLocaleLowerCase())}${m ? "s" : ""}<input type="search" data-document-search autocomplete="off" placeholder="Type to filter…" /></label>
          <button type="button" class="gmf-button--quiet" data-close-document-picker aria-label="Close picker"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="gmf-document-picker__results" data-document-results></div>
      </div>
    </div>`;
  }
  function lt(e, t) {
    const a = he(e.type, e.iconStyle);
    return `<div class="gmf-marker-preview gmf-galaxy" data-marker-preview aria-label="Live map marker preview">
      <div class="gmf-marker-preview__stage">
        <span class="gmf-system gmf-system--${w(e.type)} gmf-icon--${w(a)} gmf-status--${w(e.status)} ${e.pulse ? "is-marker-preview-pulsing" : "gmf-no-pulse"}" data-marker-preview-system style="--gmf-faction-color: ${w(t)}; --gmf-system-size: ${w(e.iconSize)}px;">
          <span class="gmf-system__halo"></span>
          <span data-marker-preview-icon><span class="gmf-system__core"></span></span>
          <span class="gmf-system__type-glyph" aria-hidden="true"></span>
        </span>
      </div>
      <span class="gmf-marker-preview__label" data-marker-preview-label>${w(e.name || "New System")}</span>
    </div>`;
  }
  function et(e, t, { quick: a = !1 } = {}) {
    return `<div class="gmf-marker-composer ${a ? "gmf-marker-composer--quick" : ""}">
      <div class="gmf-marker-composer__controls">
        <div class="gmf-form-grid">
          <label>Marker Style <select name="iconStyle">${oe(ta, e.iconStyle)}</select></label>
          <label>Marker Color <input type="color" name="iconColor" value="${w(t)}" /></label>
        </div>
        ${a ? "" : `<div class="gmf-form-grid">
          <label>Marker Size <input type="range" name="iconSize" value="${w(e.iconSize)}" min="18" max="56" step="1" /></label>
          <label class="gmf-checkbox-label"><input type="checkbox" name="pulse" value="true" ${e.pulse ? "checked" : ""} /> Pulse Glow</label>
        </div>`}
      </div>
      ${lt(e, t)}
    </div>`;
  }
  function ct(e, t = {}, a = {}, s = !1) {
    const i = X(e), r = At({ ...a, ...t }), m = [
      { value: "", label: "Unaffiliated" },
      ...((i == null ? void 0 : i.factions) ?? []).map((se) => ({ value: se.id, label: se.name }))
    ], F = ((i == null ? void 0 : i.factions) ?? []).find((se) => se.id === r.factionId), V = r.iconColor || (F == null ? void 0 : F.color) || "#58d8ff", O = `gmf-texture-${String(r.id).replace(/[^a-z0-9_-]/gi, "") || "system"}`, Z = `
      <input type="hidden" name="id" value="${w(r.id)}" />
      <input type="hidden" name="x" value="${w(r.x)}" />
      <input type="hidden" name="y" value="${w(r.y)}" />`, B = `
      <div class="gmf-planet-workspace__heading">
        <div><h3>System Appearance</h3><p>Configure the rotating model shown in the system detail view.</p></div>
      </div>
      <div class="gmf-planet-workspace__controls">
          <div class="gmf-form-grid">
            <label>Appearance <select name="planetPreset">${oe(Zt, r.planetPreset)}</select></label>
            <label>3D Shape <select name="planetShape">${oe(Jt, r.planetShape)}</select></label>
          </div>
          <div class="gmf-texture-upload">
            <div class="gmf-color-appearance__fields" data-color-appearance-fields ${r.planetPreset === "color" ? "" : "hidden"}>
              <label>Model color <input type="color" name="planetColor" value="${w(r.planetColor)}" /></label>
              <p class="gmf-scene-picker__hint">The selected color covers the complete 3D shape without an image texture.</p>
            </div>
            <div id="${O}" class="gmf-texture-upload__fields" data-texture-upload-fields ${r.planetPreset === "custom" ? "" : "hidden"}>
              <label>Custom texture image
                <div class="gmf-path-field">
                  <input type="text" name="planetTexture" value="${w(r.planetTexture)}" placeholder="Choose PNG, JPEG, or WebP" />
                  <button type="button" data-browse-target="planetTexture"><i class="fa-solid fa-folder-open"></i> Browse</button>
                </div>
              </label>
              <p class="gmf-scene-picker__hint" data-texture-upload-status>${r.planetTexture ? "Custom texture selected · previewed beneath the guide" : "Choose an image to preview it beneath the guide"}</p>
              <button type="button" class="gmf-button--quiet gmf-texture-upload__clear" data-clear-planet-texture>Clear custom texture</button>
              ${ot(r.planetShape)}
            </div>
          </div>
      </div>`, M = `
      <section class="gmf-content-section">
        <header><h3>System Image</h3><p>Shown in system details when this location is selected.</p></header>
        <label class="gmf-content-section__control">Image path
          <div class="gmf-path-field">
            <input type="text" name="image" value="${w(r.image)}" />
            <button type="button" data-browse-target="image"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
      </section>
      <section class="gmf-content-section">
        <header><h3>Linked Scenes</h3><p>Connect one or more scenes to this system for navigation and cross-module overlays.</p></header>
        ${Ke({ collection: game.scenes, selectedIds: r.sceneIds, inputName: "sceneIds", collectionName: "scenes", kindLabel: "Scene", iconClass: "fa-image", multiple: !0 })}
      </section>
      <section class="gmf-content-section">
        <header><h3>Linked Journal</h3><p>Optionally attach one journal entry for lore and reference material.</p></header>
        ${Ke({ collection: game.journal, selectedIds: r.journalId, inputName: "journalId", collectionName: "journal", kindLabel: "Journal", iconClass: "fa-book-open", multiple: !1 })}
      </section>
      <section class="gmf-content-section">
        <header><h3>GM Notes</h3><p>Private notes shown only to GMs.</p></header>
        <label class="gmf-content-section__control">Notes<textarea name="notes" rows="4">${w(r.notes)}</textarea></label>
      </section>`;
    return s ? `
      <form class="gmf-crud-form gmf-system-form gmf-system-form--create">
        ${Z}
        <div class="gmf-quick-create__identity">
          <label>Name <input type="text" name="name" value="${w(r.name)}" required autofocus /></label>
          <label>Type <select name="type">${oe(Ct, r.type)}</select></label>
        </div>
        ${et(r, V, { quick: !0 })}
        <details class="gmf-more-options">
          <summary>More options</summary>
          <div class="gmf-more-options__content">
            <div class="gmf-form-grid">
              <label>Faction <select name="factionId">${oe(m, r.factionId)}</select></label>
              <label>Status <select name="status">${oe(Lt, r.status)}</select></label>
            </div>
            <div class="gmf-form-grid">
              <label>Visibility <select name="visibility">${oe(Xe, r.visibility)}</select></label>
              <label>Marker Size <input type="range" name="iconSize" value="${w(r.iconSize)}" min="18" max="56" step="1" /></label>
            </div>
            <label class="gmf-checkbox-label"><input type="checkbox" name="pulse" value="true" ${r.pulse ? "checked" : ""} /> Pulse Glow</label>
          </div>
        </details>
      </form>` : `
      <form class="gmf-crud-form gmf-system-form gmf-system-form--edit">
        ${Z}
        <nav class="gmf-system-editor-tabs" role="tablist" aria-label="System editor sections">
          <button type="button" role="tab" data-system-editor-tab="overview"><i class="fa-solid fa-circle-info" aria-hidden="true"></i>Overview</button>
          <button type="button" role="tab" data-system-editor-tab="planet"><i class="fa-solid fa-globe" aria-hidden="true"></i>Planet</button>
          <button type="button" role="tab" data-system-editor-tab="content"><i class="fa-solid fa-link" aria-hidden="true"></i>Content</button>
        </nav>
        <section class="gmf-system-editor-panel gmf-system-editor-panel--overview" role="tabpanel" data-system-editor-panel="overview">
          <div class="gmf-overview-fields">
            <label>Name <input type="text" name="name" value="${w(r.name)}" required autofocus /></label>
            <div class="gmf-form-grid">
              <label>Type <select name="type">${oe(Ct, r.type)}</select></label>
              <label>Status <select name="status">${oe(Lt, r.status)}</select></label>
            </div>
            <div class="gmf-form-grid">
              <label>Faction <select name="factionId">${oe(m, r.factionId)}</select></label>
              <label>Visibility <select name="visibility">${oe(Xe, r.visibility)}</select></label>
            </div>
            <label>Description <textarea name="description" rows="3">${w(r.description)}</textarea></label>
          </div>
          <div class="gmf-overview-marker"><h3>Map Appearance</h3>${et(r, V)}</div>
        </section>
        <section class="gmf-system-editor-panel gmf-system-editor-panel--planet" role="tabpanel" data-system-editor-panel="planet" hidden>
          ${B}
        </section>
        <section class="gmf-system-editor-panel gmf-system-editor-panel--content" role="tabpanel" data-system-editor-panel="content" hidden>
          ${M}
        </section>
      </form>
    `;
  }
  function dt(e, t = {}, a = {}) {
    var V, O, Z;
    const s = X(e), i = { ...a, ...t }, r = (s == null ? void 0 : s.systems) ?? [];
    i.fromSystemId || (i.fromSystemId = ((V = r[0]) == null ? void 0 : V.id) ?? ""), i.toSystemId || (i.toSystemId = ((O = r.find((B) => B.id !== i.fromSystemId)) == null ? void 0 : O.id) ?? ""), i.fromSystemId && !i.toSystemId && (i.toSystemId = ((Z = r.find((B) => B.id !== i.fromSystemId)) == null ? void 0 : Z.id) ?? "");
    const m = Pt(i), F = r.map((B) => ({ value: B.id, label: B.name }));
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${w(m.id)}" />
        <div class="gmf-form-grid">
          <label>From <select name="fromSystemId">${oe(F, m.fromSystemId)}</select></label>
          <label>To <select name="toSystemId">${oe(F, m.toSystemId)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Type <select name="type">${oe(ea, m.type)}</select></label>
          <label>Visibility <select name="visibility">${oe(Xe, m.visibility)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Travel Time <input type="text" name="travelTime" value="${w(m.travelTime)}" /></label>
          <label>Fuel Cost <input type="number" name="fuelCost" value="${w(m.fuelCost)}" min="0" step="1" /></label>
        </div>
        <label>Notes <textarea name="notes">${w(m.notes)}</textarea></label>
      </form>
    `;
  }
  function ut(e = {}) {
    const t = Rt(e);
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${w(t.id)}" />
        <label>Name <input type="text" name="name" value="${w(t.name)}" /></label>
        <div class="gmf-form-grid">
          <label>Color <input type="color" name="color" value="${w(t.color)}" /></label>
          <label>Visibility <select name="visibility">${oe(Xe, t.visibility)}</select></label>
        </div>
        <label>Description <textarea name="description">${w(t.description)}</textarea></label>
      </form>
    `;
  }
  function mt(e = {}) {
    const t = H(e);
    return `
      <form class="gmf-crud-form">
        <label>Title <input type="text" name="title" value="${w(t.title)}" /></label>
        <label>Subtitle <input type="text" name="subtitle" value="${w(t.subtitle)}" /></label>
        <label>Description <textarea name="description">${w(t.description)}</textarea></label>
        <label>Background Image
          <div class="gmf-path-field">
            <input type="text" name="backgroundImage" value="${w(t.backgroundImage)}" />
            <button type="button" data-browse-target="backgroundImage"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
        <label>Visibility <select name="visibility">${oe(Xe, t.visibility)}</select></label>
        <label>Player Travel Approval <select name="travelApprovalMode">${oe(bt, t.travelApprovalMode)}</select></label>
        <p class="gmf-form-help">GM approval asks only the primary online GM. Majority counts the requester as an approval and passes at more than half of active participants. Unanimous asks every other active participant and cancels on any decline.</p>
      </form>
    `;
  }
  function tt(e) {
    const t = X(e);
    t && ye({
      title: "Edit Galaxy Map",
      content: mt(t),
      onSubmit: (a) => P(e, a)
    });
  }
  function at(e, t = null, a = {}) {
    var r;
    const s = X(e), i = t ? (r = s == null ? void 0 : s.systems) == null ? void 0 : r.find((m) => m.id === t) : null;
    ye({
      title: i ? "Edit Star System" : "Create Star System",
      content: ct(e, i ?? { id: $e("system"), name: "New System" }, a, !i),
      submitLabel: i ? "Save System" : "Create System",
      width: i ? 860 : 540,
      height: i ? Math.min(760, Math.max(360, window.innerHeight - 64)) : "auto",
      dialogClass: i ? "gmf-system-edit-dialog" : "gmf-system-create-dialog",
      onSubmit: (m) => l(e, {
        ...m,
        sceneIds: m.sceneIds ?? [],
        pulse: m.pulse === "true"
      })
    });
  }
  function st(e, t = null, a = {}) {
    var r;
    const s = X(e);
    if ((((r = s == null ? void 0 : s.systems) == null ? void 0 : r.length) ?? 0) < 2) {
      _("Create at least two systems before adding a route.");
      return;
    }
    const i = t ? s.routes.find((m) => m.id === t) : null;
    ye({
      title: i ? "Edit Route" : "Create Route",
      content: dt(e, i ?? { id: $e("route") }, a),
      submitLabel: i ? "Save Route" : "Create Route",
      onSubmit: (m) => d(e, m)
    });
  }
  function Oe(e, t = null) {
    var i;
    const a = X(e), s = t ? (i = a == null ? void 0 : a.factions) == null ? void 0 : i.find((r) => r.id === t) : null;
    ye({
      title: s ? "Edit Faction" : "Create Faction",
      content: ut(s ?? { id: $e("faction"), name: "New Faction" }),
      submitLabel: s ? "Save Faction" : "Create Faction",
      onSubmit: (r) => y(e, r)
    });
  }
  function nt(e) {
    const t = X(e);
    if (!t) return;
    const a = H(t).factions.map((s) => `
      <article class="gmf-dialog-row">
        <div>
          <strong><span class="gmf-color-dot" style="--gmf-faction-color: ${w(s.color)};"></span>${w(s.name)}</strong>
          <span>${w(s.color)} - ${w(s.visibility)}</span>
        </div>
        <div class="gmf-row-actions">
          <button type="button" data-dialog-edit-faction="${w(s.id)}" title="Edit faction"><i class="fa-solid fa-pen"></i></button>
          <button type="button" data-dialog-delete-faction="${w(s.id)}" title="Delete faction"><i class="fa-solid fa-trash"></i></button>
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
        var r;
        const i = Be(s);
        (r = i.querySelector("[data-dialog-add-faction]")) == null || r.addEventListener("click", () => Oe(e)), i.querySelectorAll("[data-dialog-edit-faction]").forEach((m) => {
          m.addEventListener("click", () => Oe(e, m.dataset.dialogEditFaction));
        }), i.querySelectorAll("[data-dialog-delete-faction]").forEach((m) => {
          m.addEventListener("click", async () => {
            await Dialog.confirm({
              title: "Delete Faction",
              content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
            }) && (await E(e, m.dataset.dialogDeleteFaction), nt(e));
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
  function ft(e) {
    var i;
    if (!e) return null;
    const t = H(e), a = new Map(t.systems.map((r) => [r.id, r])), s = new Map(t.factions.map((r) => [r.id, r]));
    return {
      ...t,
      travelApprovalModeLabel: ((i = bt.find((r) => r.value === t.travelApprovalMode)) == null ? void 0 : i.label) ?? "Unanimous agreement",
      systems: t.systems.map((r) => {
        var m;
        return {
          ...r,
          factionName: ((m = s.get(r.factionId)) == null ? void 0 : m.name) ?? "Unaffiliated"
        };
      }),
      routes: t.routes.map((r) => {
        var m, F;
        return {
          ...r,
          fromName: ((m = a.get(r.fromSystemId)) == null ? void 0 : m.name) ?? r.fromSystemId,
          toName: ((F = a.get(r.toSystemId)) == null ? void 0 : F.name) ?? r.toSystemId
        };
      })
    };
  }
  function Pe() {
    return Object.values(j()).map(H);
  }
  function pt(e, t) {
    const a = X(e);
    if (!a) return [];
    const s = H(a).systems.find((i) => i.id === String(t));
    return s ? [...s.sceneIds] : [];
  }
  function W(e) {
    const t = String(e || "");
    return t ? Pe().flatMap((a) => a.systems.filter((s) => s.sceneIds.includes(t)).map((s) => ({
      mapId: a.id,
      mapTitle: a.title,
      system: I(s)
    }))) : [];
  }
  function ee(e = null) {
    o != null && o.rendered && o.render({ force: !0 });
    for (const [t, a] of g.entries())
      (!e || t === e) && a.render({ force: !0 });
    u != null && u.rendered && (!e || u.mapId === e) && u.render({ force: !0 });
  }
  function We(e) {
    const t = [...g.values()];
    return u && t.push(u), t.filter((a) => (a == null ? void 0 : a.rendered) && a.mapId === e);
  }
  function na(e) {
    var t;
    return e.element instanceof HTMLElement ? e.element : ((t = e.element) == null ? void 0 : t[0]) ?? null;
  }
  function It(e, t, a) {
    return e.routes.find((s) => s.fromSystemId === t && s.toSystemId === a || s.toSystemId === t && s.fromSystemId === a) ?? null;
  }
  function ia(e, t) {
    const a = X(e);
    if (!a)
      return _(`Map "${e}" was not found.`), null;
    const s = H(a), i = s.systems.find((O) => O.id === s.currentSystemId), r = s.systems.find((O) => O.id === t);
    if (!r)
      return _(`System "${t}" was not found.`), null;
    if (!i)
      return _("This map does not have a current location yet. Ask the GM to set one first."), null;
    if (i.id === r.id)
      return k(`${r.name} is already the current location.`), null;
    if (s.visibility !== "players" || i.visibility !== "players" || r.visibility !== "players")
      return _("That travel destination is not visible to players."), null;
    const m = It(s, i.id, r.id);
    if (!m || m.visibility !== "players")
      return _(`No player-visible direct route from ${i.name} to ${r.name}.`), null;
    const F = le();
    if (!F)
      return _("A GM must be online to approve player travel."), null;
    const V = Ut(R(), game.user.id, F, s.travelApprovalMode);
    return {
      action: "travel-request",
      requestId: $e("travel"),
      mapId: e,
      mapTitle: s.title,
      fromSystemId: i.id,
      fromName: i.name,
      toSystemId: r.id,
      toName: r.name,
      routeId: m.id,
      routeType: m.type,
      travelTime: m.travelTime,
      fuelCost: m.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      approvalMode: V.approvalMode,
      voterIds: V.voterIds,
      voterNames: V.voterNames,
      requiredApprovals: V.requiredApprovals,
      participantCount: V.participantCount
    };
  }
  function Dt(e, t) {
    const a = ia(e, t);
    return a ? (game.socket.emit(te, a), k(`Travel request sent: ${a.fromName} to ${a.toName}.`), a) : null;
  }
  function Nt(e) {
    var m, F, V, O;
    if (!(e != null && e.requestId) || e.requesterId === ((m = game.user) == null ? void 0 : m.id) || !((V = e.voterIds) != null && V.includes((F = game.user) == null ? void 0 : F.id)) || v.has(e.requestId)) return;
    v.add(e.requestId);
    let t = !1, a = !1, s = null;
    const i = (Z) => {
      if (t) return;
      t = !0;
      const B = {
        action: "travel-vote",
        requestId: e.requestId,
        mapId: e.mapId,
        userId: game.user.id,
        userName: game.user.name,
        accepted: Z
      };
      game.socket.emit(te, B), Gt(B);
    }, r = ((O = bt.find((Z) => Z.value === e.approvalMode)) == null ? void 0 : O.label) ?? "Unanimous agreement";
    s = new Dialog({
      title: "Travel Request",
      content: `
        <section class="gmf-travel-request">
          <p><strong>${w(e.requesterName)}</strong> wants to travel on <strong>${w(e.mapTitle)}</strong>.</p>
          <p>${w(e.fromName)} &rarr; ${w(e.toName)}</p>
          <p class="gmf-travel-request__meta">${w(e.routeType)} route / ${w(e.travelTime || "Unknown time")} / Fuel ${w(e.fuelCost ?? 0)}</p>
          <p class="gmf-travel-request__mode"><i class="fa-solid fa-users"></i> ${w(r)}</p>
          <div class="gmf-travel-progress" data-travel-progress aria-live="polite">
            <div class="gmf-travel-progress__bar"><span data-travel-progress-bar></span></div>
            <strong data-travel-progress-count>Waiting for vote status…</strong>
            <span data-travel-progress-pending></span>
          </div>
        </section>
      `,
      render: (Z) => {
        const B = Be(Z), M = S.get(e.requestId);
        M && (M.root = B), xt(e.requestId, q.get(e.requestId));
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
        S.delete(e.requestId), a || i(!1);
      }
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog"],
      width: 420
    }), S.set(e.requestId, {
      root: null,
      resolve: () => {
        a = !0, t = !0, s == null || s.close();
      }
    }), s.render(!0);
  }
  function gt(e) {
    var t;
    return !!(e != null && e.coordinatorId && e.coordinatorId === ((t = le()) == null ? void 0 : t.id));
  }
  function ra(e) {
    const t = Yt(e);
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
  function xt(e, t) {
    var m, F;
    if (!t) return;
    q.set(e, t);
    const a = (m = S.get(e)) == null ? void 0 : m.root;
    if (!a) return;
    const s = a.querySelector("[data-travel-progress-count]"), i = a.querySelector("[data-travel-progress-pending]"), r = a.querySelector("[data-travel-progress-bar]");
    s && (s.textContent = `${t.acceptedCount} of ${t.requiredApprovals} approvals`), i && (i.textContent = (F = t.pendingNames) != null && F.length ? `Waiting for: ${t.pendingNames.join(", ")}` : "All votes received"), r && (r.style.width = `${Math.min(100, t.acceptedCount / Math.max(1, t.requiredApprovals) * 100)}%`);
  }
  function zt(e) {
    const t = ra(e);
    return q.set(e.requestId, t), xt(e.requestId, t), game.socket.emit(te, t), t;
  }
  function oa(e) {
    var a, s, i;
    if (!(e != null && e.requestId) || !gt(e)) return;
    const t = q.get(e.requestId);
    if (xt(e.requestId, e), e.requesterId === ((a = game.user) == null ? void 0 : a.id) && (!t || t.acceptedCount !== e.acceptedCount || t.declinedCount !== e.declinedCount)) {
      const r = (s = e.pendingNames) != null && s.length ? ` Waiting for ${e.pendingNames.join(", ")}.` : "";
      (i = ui.notifications) == null || i.info(`Travel vote: ${e.acceptedCount}/${e.requiredApprovals} approvals.${r}`);
    }
  }
  function la(e) {
    if (!ve() || !(e != null && e.requestId) || h.has(e.requestId)) return null;
    const t = X(e.mapId);
    if (!t) return null;
    const a = H(t), s = R().find((M) => M.id === e.requesterId && !M.isGM), i = a.systems.find((M) => M.id === a.currentSystemId), r = a.systems.find((M) => M.id === e.toSystemId), m = i && r ? It(a, i.id, r.id) : null;
    if (!s || a.visibility !== "players" || !i || !r || i.id === r.id || i.visibility !== "players" || r.visibility !== "players" || !m || m.visibility !== "players") return null;
    const F = a.travelApprovalMode, V = le(), O = Ut(R(), e.requesterId, V, F), Z = globalThis.setTimeout(() => {
      const M = h.get(e.requestId);
      M && Bt(M, { reason: "Travel request timed out." });
    }, Ma), B = {
      action: "travel-ballot",
      requestId: String(e.requestId).slice(0, 80),
      mapId: a.id,
      mapTitle: a.title,
      fromSystemId: i.id,
      fromName: i.name,
      toSystemId: r.id,
      toName: r.name,
      routeId: m.id,
      routeType: m.type,
      travelTime: m.travelTime,
      fuelCost: m.fuelCost,
      requesterId: s.id,
      requesterName: s.name,
      coordinatorId: game.user.id,
      ...O,
      accepted: /* @__PURE__ */ new Set(),
      declined: /* @__PURE__ */ new Set(),
      timeoutId: Z
    };
    return h.set(e.requestId, B), zt(B), B;
  }
  function Mt(e) {
    const t = H(X(e.mapId)), a = t.systems.find((i) => i.id === e.fromSystemId), s = t.systems.find((i) => i.id === e.toSystemId);
    !a || !s || We(e.mapId).forEach((i) => {
      var m;
      const r = na(i);
      r && (i.selectedSystemId = s.id, i.selectedRouteId = null, (m = i._animateShipTravel) == null || m.call(i, a, s, r));
    });
  }
  function ca(e, t, a) {
    var s;
    game.socket.emit(te, {
      action: "travel-animation",
      mapId: e,
      fromSystemId: t,
      toSystemId: a,
      coordinatorId: (s = game.user) == null ? void 0 : s.id
    });
  }
  async function da(e) {
    var a;
    h.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId), v.delete(e.requestId), (a = S.get(e.requestId)) == null || a.resolve(), S.delete(e.requestId), q.delete(e.requestId);
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
    game.socket.emit(te, t), Mt(t), k(`Travel approved: ${e.fromName} to ${e.toName}.`), globalThis.setTimeout(() => c(e.mapId, e.toSystemId), aa);
  }
  function Bt(e, { voterName: t = "", reason: a = "" } = {}) {
    var r;
    h.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId), v.delete(e.requestId), (r = S.get(e.requestId)) == null || r.resolve(), S.delete(e.requestId), q.delete(e.requestId);
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
    game.socket.emit(te, i), k(`Travel cancelled: ${s}`);
  }
  function Gt(e) {
    if (!ve() || !(e != null && e.requestId)) return;
    const t = h.get(e.requestId);
    if (!t || !t.voterIds.includes(e.userId) || t.accepted.has(e.userId) || t.declined.has(e.userId)) return;
    e.accepted ? t.accepted.add(e.userId) : t.declined.add(e.userId);
    const a = Yt(t);
    zt(t), a.outcome === "approved" ? da(t) : a.outcome === "declined" && Bt(t, {
      voterName: e.userName,
      reason: t.approvalMode === "unanimous" ? `${e.userName || "A participant"} declined the unanimous request.` : "The remaining votes cannot reach a majority."
    });
  }
  function ua(e) {
    var t, a, s;
    gt(e) && e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && v.delete(e.requestId), (a = S.get(e.requestId)) == null || a.resolve(), S.delete(e.requestId), q.delete(e.requestId), Mt(e), (s = ui.notifications) == null || s.info(`Travel approved: ${e.fromName} to ${e.toName}.`));
  }
  function ma(e) {
    var t, a, s;
    gt(e) && e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && v.delete(e.requestId), (a = S.get(e.requestId)) == null || a.resolve(), S.delete(e.requestId), q.delete(e.requestId), (s = ui.notifications) == null || s.warn(`Travel cancelled: ${e.reason || `${e.voterName || "A participant"} declined.`}`));
  }
  function fa(e) {
    const t = g.get(e);
    t && t.close(), (u == null ? void 0 : u.mapId) === e && u.close();
  }
  function je(e, t = {}) {
    var F;
    const a = X(e);
    if (!a)
      return _(`Map "${e}" was not found.`), null;
    const s = t.playerMode ?? !((F = game.user) != null && F.isGM);
    if (s && a.visibility !== "players" && !t.broadcast)
      return _("That galaxy map is not visible to players."), null;
    const i = s ? `player:${e}` : e, r = s && (u == null ? void 0 : u.mapId) === e ? u : g.get(i);
    if (r != null && r.rendered)
      return r.bringToFront(), r;
    const m = new va({ mapId: e, playerMode: s });
    return s ? u = m : g.set(i, m), m.render({ force: !0 }), m;
  }
  async function pa(e, t, a = {}) {
    var i;
    if (!e || !t) return !1;
    const s = je(e, {
      playerMode: a.playerMode ?? !((i = game.user) != null && i.isGM),
      broadcast: a.broadcast === !0
    });
    return s != null && s.focusSystem ? s.focusSystem(t, a) : !1;
  }
  function ga(e, t = "") {
    var s;
    let a = !1;
    for (const i of We(e))
      a = ((s = i.clearSystemFocus) == null ? void 0 : s.call(i, t)) || a;
    return a;
  }
  function yt() {
    return b("open the map manager") ? (o || (o = new ha()), o.render({ force: !0 }), o) : null;
  }
  function kt() {
    const e = Pe().filter((s) => s.visibility === "players").sort((s, i) => s.title.localeCompare(i.title));
    if (!e.length)
      return k("No galaxy map is currently visible to players."), null;
    if (e.length === 1) return je(e[0].id, { playerMode: !0 });
    const t = e.map((s) => `
      <button type="button" class="gmf-player-map-choice" data-player-open-map="${w(s.id)}">
        <span class="gmf-player-map-choice__title">${w(s.title)}</span>
        <span class="gmf-player-map-choice__meta">${w(s.subtitle || s.description || "Player-visible galaxy map")}</span>
      </button>
    `).join("");
    let a = null;
    return a = new Dialog({
      title: "Choose Galaxy Map",
      content: `<section class="gmf-player-map-chooser">${t}</section>`,
      render: (s) => {
        const i = Be(s);
        i == null || i.querySelectorAll("[data-player-open-map]").forEach((r) => {
          r.addEventListener("click", () => {
            je(r.dataset.playerOpenMap, { playerMode: !0 }), a == null || a.close();
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
  function ya() {
    var t;
    const e = Pe().sort((a, s) => a.title.localeCompare(s.title));
    return (t = game.user) != null && t.isGM ? e.length === 1 ? je(e[0].id) : yt() : kt();
  }
  function qt(e) {
    if (b("broadcast galaxy maps")) {
      if (!X(e)) {
        _(`Map "${e}" was not found.`);
        return;
      }
      game.socket.emit(te, { action: "open", mapId: e }), k("Map broadcast sent to players.");
    }
  }
  function Ot() {
    b("close player galaxy maps") && (game.socket.emit(te, { action: "close" }), k("Close-map signal sent to players."));
  }
  const ha = $a({
    templateRoot: Ye,
    getMaps: Pe,
    prepareMapForManager: ft,
    getRawMap: X,
    openMapMetadataDialog: tt,
    openSystemDialog: at,
    openRouteDialog: st,
    openFactionDialog: Oe,
    exportMap: Ie,
    duplicateMap: pe,
    deleteMap: ue,
    createMap: D,
    deleteSystem: n,
    deleteRoute: p,
    deleteFaction: E,
    openMap: je,
    showMapToPlayers: qt,
    closePlayerMap: Ot,
    hideSystemFromPlayers: ce,
    hideRouteFromPlayers: ae,
    hideFactionFromPlayers: f,
    clearManagerApp: (e) => {
      o === e && (o = null);
    }
  }), va = Oa({
    templateRoot: Ye,
    getRawMap: X,
    prepareMapForDisplay: Ge,
    openSystemDialog: at,
    openRouteDialog: st,
    openFactionDialog: Oe,
    openFactionManagerDialog: nt,
    openMapMetadataDialog: tt,
    revealSystemToPlayers: N,
    revealRouteToPlayers: me,
    hideSystemFromPlayers: ce,
    hideRouteFromPlayers: ae,
    deleteSystem: n,
    deleteRoute: p,
    setCurrentSystem: c,
    requestTravelToSystem: Dt,
    notifySystemDiscovered: be,
    exportMap: Ie,
    getTravelRoute: It,
    broadcastTravelAnimation: ca,
    notifyInfo: k,
    notifyError: _,
    saveSystemPosition: x,
    showMapToPlayers: qt,
    openMapManager: yt,
    clearMapView: (e) => {
      e.playerMode && u === e && (u = null);
      for (const [t, a] of g.entries())
        a === e && g.delete(t);
    }
  });
  function Sa() {
    const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
    return t != null && t.registerApp ? (t.registerApp({
      id: ze,
      title: "Galaxy Map",
      icon: "fa-solid fa-route",
      premium: !1,
      description: "Open cinematic campaign maps and navigation charts.",
      open: () => {
        var a;
        return (a = game.user) != null && a.isGM ? yt() : kt();
      }
    }), !0) : !1;
  }
  Hooks.once("init", async () => {
    game.settings.register(ze, Tt, {
      scope: "world",
      config: !1,
      type: Object,
      default: {}
    }), Handlebars.registerHelper("gmfEq", (e, t) => e === t), Handlebars.registerHelper("gmfJson", (e) => JSON.stringify(e, null, 2)), Handlebars.registerHelper("gmfPercent", (e) => `${Number(e).toFixed(3)}%`), Handlebars.registerHelper("gmfFallback", (e, t) => e || t), await loadTemplates([
      `${Ye}/map-manager.hbs`,
      `${Ye}/galaxy-map.hbs`,
      `${Ye}/celestial-icon.hbs`,
      `${Ye}/system-details.hbs`
    ]);
  }), Hooks.once("ready", () => {
    game.galaxyMap = {
      openMap: je,
      focusSystem: pa,
      clearSystemFocus: ga,
      openMapManager: yt,
      openGalaxyMapFromSceneControls: ya,
      openPlayerMapChooser: kt,
      createMap: D,
      getMaps: Pe,
      getSceneIdsForSystem: pt,
      getSystemsForScene: W,
      showMapToPlayers: qt,
      closePlayerMap: Ot,
      updateMap: G,
      updateMapMetadata: P,
      deleteMap: ue,
      duplicateMap: pe,
      upsertSystem: l,
      deleteSystem: n,
      upsertRoute: d,
      deleteRoute: p,
      upsertFaction: y,
      deleteFaction: E,
      saveSystemPosition: x,
      setCurrentSystem: c,
      revealSystemToPlayers: N,
      revealRouteToPlayers: me,
      hideSystemFromPlayers: ce,
      hideRouteFromPlayers: ae,
      hideFactionFromPlayers: f,
      notifySystemDiscovered: be,
      requestTravelToSystem: Dt,
      importMapData: Te,
      exportMap: Ie
    };
    const e = game.modules.get(ze);
    e && (e.api = game.galaxyMap), Sa(), game.socket.on(te, (t = {}) => {
      var a, s, i, r;
      if (t.action === "travel-request") {
        const m = la(t);
        m && (game.socket.emit(te, m), Nt(m));
        return;
      }
      if (t.action === "travel-ballot") {
        gt(t) && t.coordinatorId !== ((a = game.user) == null ? void 0 : a.id) && Nt(t);
        return;
      }
      if (t.action === "travel-vote") {
        Gt(t);
        return;
      }
      if (t.action === "travel-progress") {
        oa(t);
        return;
      }
      if (t.action === "travel-approved") {
        ua(t);
        return;
      }
      if (t.action === "travel-declined") {
        ma(t);
        return;
      }
      if (t.action === "travel-animation") {
        t.coordinatorId !== ((s = game.user) == null ? void 0 : s.id) && Mt(t);
        return;
      }
      (i = game.user) != null && i.isGM || (t.action === "open" && t.mapId && (u == null || u.close(), je(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "close" && (u == null || u.close()), t.action === "refresh" && (u == null ? void 0 : u.mapId) === t.mapId && u.render({ force: !0 }), t.action === "notify" && ((r = ui.notifications) == null || r.info(t.message || "New system discovered."), (u == null ? void 0 : u.mapId) === t.mapId && u.render({ force: !0 })));
    }), console.log(`${ze} | Ready. API available at game.galaxyMap.`);
  });
})();
