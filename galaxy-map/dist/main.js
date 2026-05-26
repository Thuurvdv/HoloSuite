var _t = Object.defineProperty;
var Lt = (_, A, v) => A in _ ? _t(_, A, { enumerable: !0, configurable: !0, writable: !0, value: v }) : _[A] = v;
var W = (_, A, v) => Lt(_, typeof A != "symbol" ? A + "" : A, v);
(() => {
  const _ = "galaxy-map", A = "maps", v = `module.${_}`, V = `modules/${_}/templates`, ve = ["core", "colony", "frontier", "station", "anomaly", "ruins", "restricted", "unknown"], Se = ["undiscovered", "known", "visited", "danger", "locked"], be = ["safe", "dangerous", "restricted", "smuggler", "unknown"], O = ["gm", "players"], Ie = ["planet", "ringed", "star", "diamond", "void"], we = 0.55, Me = 2.6, xe = 2400, et = 6e4, $e = {
    id: "sample-aster-veil",
    title: "The Aster Veil",
    subtitle: "A frontier command chart for luminous trouble",
    description: "A polished public-beta sample map with revealed worlds, hidden threats, and discoverable sensor contacts.",
    backgroundImage: "",
    visibility: "players",
    currentSystemId: "crown-of-aster",
    factions: [
      {
        id: "aster-accord",
        name: "Aster Accord",
        color: "#58d8ff",
        description: "A pragmatic coalition of settled ports, navigators, and survey courts.",
        visibility: "players"
      },
      {
        id: "veil-freeholds",
        name: "Veil Freeholds",
        color: "#ffd166",
        description: "Independent habitats that trade favors, salvage, and silence.",
        visibility: "players"
      },
      {
        id: "helios-compact",
        name: "Helios Compact",
        color: "#7dffbd",
        description: "Corporate science enclaves with pristine ships and carefully redacted manifests.",
        visibility: "players"
      },
      {
        id: "blackline",
        name: "Blackline Directorate",
        color: "#ff5c7a",
        description: "A classified interdiction authority known only to the GM.",
        visibility: "gm"
      }
    ],
    systems: [
      {
        id: "crown-of-aster",
        name: "Crown of Aster",
        x: 22,
        y: 42,
        type: "core",
        factionId: "aster-accord",
        status: "visited",
        description: "The administrative heart of the region, ringed by pearlescent habitats and courier traffic.",
        image: "",
        sceneId: "",
        journalId: "",
        visibility: "players",
        iconColor: "#58d8ff",
        iconSize: 36,
        iconStyle: "ringed",
        pulse: !0,
        notes: "Use for command briefings, political bargaining, and refit scenes."
      },
      {
        id: "vesper-anchorage",
        name: "Vesper Anchorage",
        x: 43,
        y: 56,
        type: "station",
        factionId: "veil-freeholds",
        status: "known",
        description: "A freehold station built through the ribs of a derelict ark, bright with docking strobes.",
        image: "",
        sceneId: "",
        journalId: "",
        visibility: "players",
        iconColor: "#ffd166",
        iconSize: 32,
        iconStyle: "diamond",
        pulse: !0,
        notes: "Neutral ground. Everyone is listening, especially the people who say they are not."
      },
      {
        id: "greenward",
        name: "Greenward",
        x: 57,
        y: 29,
        type: "colony",
        factionId: "helios-compact",
        status: "known",
        description: "A garden colony under mirrored weather shields, famed for bio-reactor exports.",
        image: "",
        sceneId: "",
        journalId: "",
        visibility: "players",
        iconColor: "#7dffbd",
        iconSize: 34,
        iconStyle: "planet",
        pulse: !0,
        notes: "Great place to hide experimental contamination under corporate hospitality."
      },
      {
        id: "kestral-gate",
        name: "Kestral Gate",
        x: 72,
        y: 49,
        type: "frontier",
        factionId: "veil-freeholds",
        status: "danger",
        description: "A ragged frontier transit cluster where beacon data often arrives late or wrong.",
        image: "",
        sceneId: "",
        journalId: "",
        visibility: "players",
        iconColor: "#ffd166",
        iconSize: 30,
        iconStyle: "planet",
        pulse: !0,
        notes: "Escalate encounters here when the crew thinks they are nearly safe."
      },
      {
        id: "red-wake",
        name: "Red Wake",
        x: 77,
        y: 24,
        type: "restricted",
        factionId: "blackline",
        status: "locked",
        description: "A classified interdiction zone wrapped in military silence.",
        image: "",
        sceneId: "",
        journalId: "",
        visibility: "gm",
        iconColor: "#ff5c7a",
        iconSize: 34,
        iconStyle: "void",
        pulse: !0,
        notes: "Reveal after the convoy ambush. Route access implies someone inside helped."
      },
      {
        id: "echo-vault",
        name: "Echo Vault",
        x: 66,
        y: 74,
        type: "unknown",
        factionId: "",
        status: "undiscovered",
        description: "A dormant megastructure fragment broadcasting low-frequency mathematical noise.",
        image: "",
        sceneId: "",
        journalId: "",
        visibility: "players",
        iconColor: "#b48cff",
        iconSize: 38,
        iconStyle: "star",
        pulse: !0,
        notes: "Players initially see ???. Discovery should feel like the map itself wakes up."
      },
      {
        id: "saltglass-ruins",
        name: "Saltglass Ruins",
        x: 31,
        y: 72,
        type: "ruins",
        factionId: "",
        status: "undiscovered",
        description: "Shattered cities below reflective storm clouds, visible only between static surges.",
        image: "",
        sceneId: "",
        journalId: "",
        visibility: "gm",
        iconColor: "#9fb7c6",
        iconSize: 31,
        iconStyle: "diamond",
        pulse: !1,
        notes: "Optional side mystery. Good place for a recovered archive or lost distress call."
      }
    ],
    routes: [
      {
        id: "route-crown-vesper",
        fromSystemId: "crown-of-aster",
        toSystemId: "vesper-anchorage",
        type: "safe",
        travelTime: "18 hours",
        fuelCost: 1,
        visibility: "players",
        notes: "Patrolled, busy, and easy to track."
      },
      {
        id: "route-vesper-greenward",
        fromSystemId: "vesper-anchorage",
        toSystemId: "greenward",
        type: "safe",
        travelTime: "22 hours",
        fuelCost: 1,
        visibility: "players",
        notes: "Commercial lane with reliable nav buoys."
      },
      {
        id: "route-greenward-kestral",
        fromSystemId: "greenward",
        toSystemId: "kestral-gate",
        type: "dangerous",
        travelTime: "31 hours",
        fuelCost: 2,
        visibility: "players",
        notes: "Radiation shear and pirate spoofing both complicate travel."
      },
      {
        id: "route-vesper-echo",
        fromSystemId: "vesper-anchorage",
        toSystemId: "echo-vault",
        type: "unknown",
        travelTime: "Unknown",
        fuelCost: 0,
        visibility: "players",
        notes: "Sensor ghost only until the system is discovered."
      },
      {
        id: "route-kestral-redwake",
        fromSystemId: "kestral-gate",
        toSystemId: "red-wake",
        type: "restricted",
        travelTime: "7 hours",
        fuelCost: 2,
        visibility: "gm",
        notes: "Hidden military corridor. Revealing it changes the campaign board."
      },
      {
        id: "route-vesper-saltglass",
        fromSystemId: "vesper-anchorage",
        toSystemId: "saltglass-ruins",
        type: "smuggler",
        travelTime: "14 hours",
        fuelCost: 2,
        visibility: "gm",
        notes: "Known by salvors, denied by everyone official."
      }
    ]
  };
  let R = null;
  const z = /* @__PURE__ */ new Map();
  let f = null;
  const X = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Set();
  function L(e) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? {}));
  }
  function P(e = "gmf") {
    return `${e}-${foundry.utils.randomID(10)}`;
  }
  function y(e) {
    var t;
    (t = ui.notifications) == null || t.error(`[Galaxy Map] ${e}`);
  }
  function E(e) {
    var t;
    (t = ui.notifications) == null || t.info(`[Galaxy Map] ${e}`);
  }
  function w(e = "change galaxy maps") {
    var t;
    return (t = game.user) != null && t.isGM ? !0 : (y(`Only a GM can ${e}.`), !1);
  }
  function tt() {
    var e;
    return ((e = game.users) == null ? void 0 : e.contents) ?? Array.from(game.users ?? []);
  }
  function ke() {
    return tt().filter((e) => e.active);
  }
  function Te() {
    return ke().filter((e) => e.isGM).sort((e, t) => String(e.id).localeCompare(String(t.id)))[0] ?? null;
  }
  function Ee() {
    var e, t;
    return !!((e = game.user) != null && e.isGM && ((t = Te()) == null ? void 0 : t.id) === game.user.id);
  }
  function x() {
    return L(game.settings.get(_, A) ?? {});
  }
  async function k(e) {
    return w("save galaxy map data") && await game.settings.set(_, A, e ?? {}), e;
  }
  function Q(e, t = "players") {
    const i = O.includes(t) ? t : "players";
    return O.includes(e) ? e : i;
  }
  function it(e) {
    return typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "#58d8ff";
  }
  function st(e) {
    return typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "";
  }
  function G(e, t = 0) {
    const i = Number(e);
    return Number.isFinite(i) ? i : t;
  }
  function F(e, t, i) {
    return Math.min(i, Math.max(t, e));
  }
  function nt(e) {
    return String(e || "galaxy-map").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "galaxy-map";
  }
  function at(e, t) {
    const i = new Blob([JSON.stringify(t, null, 2)], { type: "application/json" }), s = URL.createObjectURL(i), n = document.createElement("a");
    n.href = s, n.download = e, document.body.appendChild(n), n.click(), n.remove(), URL.revokeObjectURL(s);
  }
  function d(e) {
    const t = document.createElement("div");
    return t.textContent = String(e ?? ""), t.innerHTML;
  }
  function N(e, t) {
    return e.map((i) => {
      const s = typeof i == "string" ? i : i.value, n = typeof i == "string" ? i : i.label;
      return `<option value="${d(s)}" ${s === t ? "selected" : ""}>${d(n)}</option>`;
    }).join("");
  }
  function Ce(e, t) {
    const i = (e == null ? void 0 : e.contents) ?? [];
    return [
      { value: "", label: "None" },
      ...i.map((s) => ({ value: s.id, label: s.name }))
    ].map((s) => `<option value="${d(s.value)}" ${s.value === t ? "selected" : ""}>${d(s.label)}</option>`).join("");
  }
  function ee(e) {
    return (e == null ? void 0 : e[0]) ?? e;
  }
  function rt(e) {
    var s;
    const t = ee(e), i = (s = t == null ? void 0 : t.matches) != null && s.call(t, "form") ? t : t == null ? void 0 : t.querySelector("form");
    return Object.fromEntries(new FormData(i).entries());
  }
  function ot(e) {
    const t = ee(e);
    t == null || t.querySelectorAll("[data-browse-target]").forEach((i) => {
      i.addEventListener("click", (s) => {
        s.preventDefault();
        const n = t.querySelector(`[name="${i.dataset.browseTarget}"]`);
        n && new FilePicker({
          type: "image",
          current: n.value,
          callback: (a) => {
            n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        }).browse();
      });
    });
  }
  function te({ title: e, content: t, submitLabel: i = "Save", onSubmit: s, render: n = ot }) {
    new Dialog({
      title: e,
      content: t,
      render: n,
      buttons: {
        save: {
          icon: '<i class="fa-solid fa-floppy-disk"></i>',
          label: i,
          callback: (a) => s(rt(a))
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
  function se(e = {}) {
    return {
      id: String(e.id || P("system")),
      name: String(e.name || "Unnamed System"),
      x: Math.min(100, Math.max(0, G(e.x, 50))),
      y: Math.min(100, Math.max(0, G(e.y, 50))),
      type: ve.includes(e.type) ? e.type : "unknown",
      factionId: String(e.factionId || ""),
      status: Se.includes(e.status) ? e.status : "known",
      description: String(e.description || ""),
      image: String(e.image || ""),
      sceneId: String(e.sceneId || ""),
      journalId: String(e.journalId || ""),
      visibility: Q(e.visibility, "players"),
      notes: String(e.notes || ""),
      iconColor: st(e.iconColor),
      iconSize: F(G(e.iconSize, 28), 18, 56),
      iconStyle: Ie.includes(e.iconStyle) ? e.iconStyle : "planet",
      pulse: e.pulse !== !1
    };
  }
  function ne(e = {}) {
    return {
      id: String(e.id || P("route")),
      fromSystemId: String(e.fromSystemId || ""),
      toSystemId: String(e.toSystemId || ""),
      type: be.includes(e.type) ? e.type : "unknown",
      travelTime: String(e.travelTime || ""),
      fuelCost: G(e.fuelCost, 0),
      visibility: Q(e.visibility, "players"),
      notes: String(e.notes || "")
    };
  }
  function ae(e = {}) {
    return {
      id: String(e.id || P("faction")),
      name: String(e.name || "Unaffiliated"),
      color: it(e.color),
      description: String(e.description || ""),
      visibility: Q(e.visibility, "players")
    };
  }
  function h(e = {}) {
    var n;
    const t = Array.isArray(e.systems) ? e.systems.map(se) : [], i = Array.isArray(e.routes) ? e.routes.map(ne) : [], s = Array.isArray(e.factions) ? e.factions.map(ae) : [];
    return {
      id: String(e.id || P("map")),
      title: String(e.title || "Untitled Galaxy Map"),
      subtitle: String(e.subtitle || ""),
      description: String(e.description || ""),
      backgroundImage: String(e.backgroundImage || ""),
      visibility: Q(e.visibility, "players"),
      currentSystemId: String(e.currentSystemId || ((n = t[0]) == null ? void 0 : n.id) || ""),
      systems: t,
      routes: i,
      factions: s
    };
  }
  function M(e) {
    const t = x();
    return t[e] ? L(t[e]) : null;
  }
  function lt(e) {
    return new Map((e ?? []).map((t) => [t.id, t]));
  }
  function ct(e) {
    return e.visibility === "players";
  }
  function dt(e, t) {
    return t && e.status === "undiscovered";
  }
  function ut(e, { playerMode: t = !1, selectedSystemId: i = null, selectedRouteId: s = null } = {}) {
    var l, $;
    const n = h(e), a = t ? n.systems.filter(ct) : n.systems, r = new Set(a.map((c) => c.id)), o = t ? n.factions.filter((c) => c.visibility === "players") : n.factions, u = lt(o), p = a.map((c) => {
      const q = u.get(c.factionId), D = dt(c, t);
      return {
        ...c,
        displayName: D ? "???" : c.name,
        displayDescription: D ? "Unresolved sensor contact. Details are not available." : c.description,
        displayType: D ? "unknown" : c.type,
        displayStatus: D ? "undiscovered" : c.status,
        factionName: (q == null ? void 0 : q.name) ?? "Unaffiliated",
        factionColor: c.iconColor || (q == null ? void 0 : q.color) || "#58d8ff",
        obscured: D,
        isCurrent: c.id === n.currentSystemId,
        isSelected: c.id === i,
        gmOnly: c.visibility === "gm"
      };
    }), m = n.routes.filter((c) => !t || c.visibility === "players").filter((c) => r.has(c.fromSystemId) && r.has(c.toSystemId)).map((c) => {
      const q = p.find((Y) => Y.id === c.fromSystemId), D = p.find((Y) => Y.id === c.toSystemId);
      return {
        ...c,
        from: q,
        to: D,
        fromName: (q == null ? void 0 : q.displayName) ?? c.fromSystemId,
        toName: (D == null ? void 0 : D.displayName) ?? c.toSystemId,
        isSelected: c.id === s,
        connectsCurrent: c.fromSystemId === n.currentSystemId || c.toSystemId === n.currentSystemId,
        gmOnly: c.visibility === "gm"
      };
    }), S = m.find((c) => c.id === s) ?? null, g = S ? null : p.find((c) => c.id === i) ?? p[0] ?? null;
    g && (g.isSelected = !0);
    const b = p.find((c) => c.id === n.currentSystemId) ?? p[0] ?? null, T = g && b && g.id !== b.id ? m.find((c) => c.fromSystemId === b.id && c.toSystemId === g.id || c.toSystemId === b.id && c.fromSystemId === g.id) : null;
    return g && (g.canTravel = !!T, g.travelRouteId = (T == null ? void 0 : T.id) ?? "", g.isCurrent = g.id === (b == null ? void 0 : b.id)), {
      ...n,
      systems: p,
      routes: m,
      factions: o,
      selectedSystem: g,
      selectedRoute: S,
      currentSystem: b,
      selectedType: S ? "route" : "system",
      playerMode: t,
      isGM: ((l = game.user) == null ? void 0 : l.isGM) ?? !1,
      canEdit: (($ = game.user) == null ? void 0 : $.isGM) && !t
    };
  }
  async function qe(e = {}) {
    if (!w("create galaxy maps")) return null;
    const t = x(), i = h(e);
    return t[i.id] = i, await k(t), C(i.id), L(i);
  }
  async function _e(e, t = {}) {
    if (!w("update galaxy maps")) return null;
    const i = x();
    if (!i[e])
      return y(`Map "${e}" was not found.`), null;
    const s = h({ ...t, id: e });
    return i[e] = s, await k(i), C(e), L(s);
  }
  async function Le(e, t = {}) {
    if (!w("update galaxy map metadata")) return null;
    const i = M(e);
    return i ? _e(e, {
      ...i,
      title: t.title,
      subtitle: t.subtitle,
      description: t.description,
      backgroundImage: t.backgroundImage,
      visibility: t.visibility
    }) : (y(`Map "${e}" was not found.`), null);
  }
  async function De(e) {
    if (!w("delete galaxy maps")) return !1;
    const t = x();
    return t[e] ? (delete t[e], await k(t), kt(e), C(), !0) : !1;
  }
  async function Re(e) {
    if (!w("duplicate galaxy maps")) return null;
    const t = M(e);
    if (!t)
      return y(`Map "${e}" was not found.`), null;
    const i = h({
      ...t,
      id: P("map"),
      title: `${t.title} Copy`
    }), s = x();
    return s[i.id] = i, await k(s), C(i.id), L(i);
  }
  async function Ae(e, t = {}) {
    if (!w("save star systems")) return null;
    const i = x(), s = i[e];
    if (!s)
      return y(`Map "${e}" was not found.`), null;
    const n = se(t), a = s.systems.findIndex((r) => r.id === n.id);
    return a >= 0 ? s.systems[a] = n : s.systems.push(n), i[e] = h(s), await k(i), C(e), game.socket.emit(v, { action: "refresh", mapId: e }), L(n);
  }
  async function re(e, t) {
    var n;
    if (!w("delete star systems")) return !1;
    const i = x(), s = i[e];
    return s ? (s.systems = s.systems.filter((a) => a.id !== t), s.routes = s.routes.filter((a) => a.fromSystemId !== t && a.toSystemId !== t), s.currentSystemId === t && (s.currentSystemId = ((n = s.systems[0]) == null ? void 0 : n.id) ?? ""), i[e] = h(s), await k(i), C(e), game.socket.emit(v, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function H(e, t) {
    var a;
    if (!w("set current location")) return null;
    const i = x(), s = i[e], n = (a = s == null ? void 0 : s.systems) == null ? void 0 : a.find((r) => r.id === t);
    return n ? (s.currentSystemId = t, i[e] = h(s), await k(i), C(e), game.socket.emit(v, { action: "refresh", mapId: e }), L(n)) : (y(`System "${t}" was not found.`), null);
  }
  async function Ne(e, t = {}) {
    if (!w("save routes")) return null;
    const i = x(), s = i[e];
    if (!s)
      return y(`Map "${e}" was not found.`), null;
    const n = ne(t);
    if (!n.fromSystemId || !n.toSystemId || n.fromSystemId === n.toSystemId)
      return y("Routes require two different systems."), null;
    const a = s.routes.findIndex((r) => r.id === n.id);
    return a >= 0 ? s.routes[a] = n : s.routes.push(n), i[e] = h(s), await k(i), C(e), game.socket.emit(v, { action: "refresh", mapId: e }), L(n);
  }
  async function oe(e, t) {
    if (!w("delete routes")) return !1;
    const i = x(), s = i[e];
    return s ? (s.routes = s.routes.filter((n) => n.id !== t), i[e] = h(s), await k(i), C(e), game.socket.emit(v, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function Pe(e, t = {}) {
    if (!w("save factions")) return null;
    const i = x(), s = i[e];
    if (!s)
      return y(`Map "${e}" was not found.`), null;
    const n = ae(t), a = s.factions.findIndex((r) => r.id === n.id);
    return a >= 0 ? s.factions[a] = n : s.factions.push(n), i[e] = h(s), await k(i), C(e), game.socket.emit(v, { action: "refresh", mapId: e }), L(n);
  }
  async function le(e, t) {
    if (!w("delete factions")) return !1;
    const i = x(), s = i[e];
    if (!s) return !1;
    s.factions = s.factions.filter((n) => n.id !== t);
    for (const n of s.systems)
      n.factionId === t && (n.factionId = "");
    return i[e] = h(s), await k(i), C(e), game.socket.emit(v, { action: "refresh", mapId: e }), !0;
  }
  async function Fe(e, t, i, s) {
    var o;
    if (!w("move star systems")) return null;
    const n = x(), a = n[e], r = (o = a == null ? void 0 : a.systems) == null ? void 0 : o.find((u) => u.id === t);
    return r ? (r.x = F(G(i, r.x), 0, 100), r.y = F(G(s, r.y), 0, 100), n[e] = h(a), await k(n), R != null && R.rendered && R.render({ force: !0 }), game.socket.emit(v, { action: "refresh", mapId: e }), L(r)) : (y(`System "${t}" was not found.`), null);
  }
  async function ce(e, t, { notify: i = !0 } = {}) {
    var r;
    if (!w("reveal star systems")) return null;
    const s = x(), n = s[e], a = (r = n == null ? void 0 : n.systems) == null ? void 0 : r.find((o) => o.id === t);
    return a ? (a.visibility = "players", (a.status === "undiscovered" || a.status === "locked") && (a.status = "known"), s[e] = h(n), await k(s), C(e), game.socket.emit(v, { action: "refresh", mapId: e }), i && ue(e, a.id), E(`${a.name} revealed to players.`), L(a)) : (y(`System "${t}" was not found.`), null);
  }
  async function de(e, t) {
    var a;
    if (!w("reveal routes")) return null;
    const i = x(), s = i[e], n = (a = s == null ? void 0 : s.routes) == null ? void 0 : a.find((r) => r.id === t);
    return n ? (n.visibility = "players", i[e] = h(s), await k(i), C(e), game.socket.emit(v, { action: "refresh", mapId: e }), E("Route revealed to players."), L(n)) : (y(`Route "${t}" was not found.`), null);
  }
  function ue(e, t) {
    var n;
    if (!w("notify players about discoveries")) return;
    const i = M(e), s = (n = i == null ? void 0 : i.systems) == null ? void 0 : n.find((a) => a.id === t);
    if (!s) {
      y(`System "${t}" was not found.`);
      return;
    }
    game.socket.emit(v, {
      action: "notify",
      mapId: e,
      systemId: t,
      message: `New System Discovered: ${s.name}`
    }), E(`Discovery notification sent: ${s.name}.`);
  }
  async function ze() {
    if (!w("install sample maps")) return null;
    const e = x(), t = h($e);
    return e[t.id] = t, await k(e), C(t.id), E("Sample galaxy map installed."), L(t);
  }
  async function Oe(e, { replace: t = !1 } = {}) {
    if (!w("import galaxy maps")) return null;
    const i = x();
    let s = h(e);
    return i[s.id] && !t && (s = h({
      ...s,
      id: P("map"),
      title: `${s.title} Import`
    })), i[s.id] = s, await k(i), C(s.id), E(`Imported ${s.title}.`), L(s);
  }
  function me(e) {
    const t = M(e);
    if (!t) {
      y(`Map "${e}" was not found.`);
      return;
    }
    at(`${nt(t.title)}.json`, h(t));
  }
  function mt(e, t = {}, i = {}) {
    const s = M(e), n = se({ ...i, ...t }), a = [
      { value: "", label: "Unaffiliated" },
      ...((s == null ? void 0 : s.factions) ?? []).map((u) => ({ value: u.id, label: u.name }))
    ], r = ((s == null ? void 0 : s.factions) ?? []).find((u) => u.id === n.factionId), o = n.iconColor || (r == null ? void 0 : r.color) || "#58d8ff";
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${d(n.id)}" />
        <input type="hidden" name="x" value="${d(n.x)}" />
        <input type="hidden" name="y" value="${d(n.y)}" />
        <label>Name <input type="text" name="name" value="${d(n.name)}" /></label>
        <div class="gmf-form-grid">
          <label>Type <select name="type">${N(ve, n.type)}</select></label>
          <label>Status <select name="status">${N(Se, n.status)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Faction <select name="factionId">${N(a, n.factionId)}</select></label>
          <label>Visibility <select name="visibility">${N(O, n.visibility)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Icon Style <select name="iconStyle">${N(Ie, n.iconStyle)}</select></label>
          <label>Icon Size <input type="range" name="iconSize" value="${d(n.iconSize)}" min="18" max="56" step="1" /></label>
        </div>
        <div class="gmf-form-grid">
          <label>Icon Color <input type="color" name="iconColor" value="${d(o)}" /></label>
          <label class="gmf-checkbox-label"><input type="checkbox" name="pulse" value="true" ${n.pulse ? "checked" : ""} /> Pulse Glow</label>
        </div>
        <label>Description <textarea name="description">${d(n.description)}</textarea></label>
        <label>Image Path
          <div class="gmf-path-field">
            <input type="text" name="image" value="${d(n.image)}" />
            <button type="button" data-browse-target="image"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
        <div class="gmf-form-grid">
          <label>Scene <select name="sceneId">${Ce(game.scenes, n.sceneId)}</select></label>
          <label>Journal <select name="journalId">${Ce(game.journal, n.journalId)}</select></label>
        </div>
        <label>GM Notes <textarea name="notes">${d(n.notes)}</textarea></label>
      </form>
    `;
  }
  function ft(e, t = {}, i = {}) {
    var u, p, m;
    const s = M(e), n = { ...i, ...t }, a = (s == null ? void 0 : s.systems) ?? [];
    n.fromSystemId || (n.fromSystemId = ((u = a[0]) == null ? void 0 : u.id) ?? ""), n.toSystemId || (n.toSystemId = ((p = a.find((S) => S.id !== n.fromSystemId)) == null ? void 0 : p.id) ?? ""), n.fromSystemId && !n.toSystemId && (n.toSystemId = ((m = a.find((S) => S.id !== n.fromSystemId)) == null ? void 0 : m.id) ?? "");
    const r = ne(n), o = a.map((S) => ({ value: S.id, label: S.name }));
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${d(r.id)}" />
        <div class="gmf-form-grid">
          <label>From <select name="fromSystemId">${N(o, r.fromSystemId)}</select></label>
          <label>To <select name="toSystemId">${N(o, r.toSystemId)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Type <select name="type">${N(be, r.type)}</select></label>
          <label>Visibility <select name="visibility">${N(O, r.visibility)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Travel Time <input type="text" name="travelTime" value="${d(r.travelTime)}" /></label>
          <label>Fuel Cost <input type="number" name="fuelCost" value="${d(r.fuelCost)}" min="0" step="1" /></label>
        </div>
        <label>Notes <textarea name="notes">${d(r.notes)}</textarea></label>
      </form>
    `;
  }
  function pt(e = {}) {
    const t = ae(e);
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${d(t.id)}" />
        <label>Name <input type="text" name="name" value="${d(t.name)}" /></label>
        <div class="gmf-form-grid">
          <label>Color <input type="color" name="color" value="${d(t.color)}" /></label>
          <label>Visibility <select name="visibility">${N(O, t.visibility)}</select></label>
        </div>
        <label>Description <textarea name="description">${d(t.description)}</textarea></label>
      </form>
    `;
  }
  function yt(e = {}) {
    const t = h(e);
    return `
      <form class="gmf-crud-form">
        <label>Title <input type="text" name="title" value="${d(t.title)}" /></label>
        <label>Subtitle <input type="text" name="subtitle" value="${d(t.subtitle)}" /></label>
        <label>Description <textarea name="description">${d(t.description)}</textarea></label>
        <label>Background Image
          <div class="gmf-path-field">
            <input type="text" name="backgroundImage" value="${d(t.backgroundImage)}" />
            <button type="button" data-browse-target="backgroundImage"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
        <label>Visibility <select name="visibility">${N(O, t.visibility)}</select></label>
      </form>
    `;
  }
  function Ge(e) {
    const t = M(e);
    t && te({
      title: "Edit Galaxy Map",
      content: yt(t),
      onSubmit: (i) => Le(e, i)
    });
  }
  function B(e, t = null, i = {}) {
    var a;
    const s = M(e), n = t ? (a = s == null ? void 0 : s.systems) == null ? void 0 : a.find((r) => r.id === t) : null;
    te({
      title: n ? "Edit Star System" : "Create Star System",
      content: mt(e, n ?? { id: P("system"), name: "New System" }, i),
      submitLabel: n ? "Save System" : "Create System",
      onSubmit: (r) => Ae(e, { ...r, pulse: r.pulse === "true" })
    });
  }
  function j(e, t = null, i = {}) {
    var a;
    const s = M(e);
    if ((((a = s == null ? void 0 : s.systems) == null ? void 0 : a.length) ?? 0) < 2) {
      y("Create at least two systems before adding a route.");
      return;
    }
    const n = t ? s.routes.find((r) => r.id === t) : null;
    te({
      title: n ? "Edit Route" : "Create Route",
      content: ft(e, n ?? { id: P("route") }, i),
      submitLabel: n ? "Save Route" : "Create Route",
      onSubmit: (r) => Ne(e, r)
    });
  }
  function J(e, t = null) {
    var n;
    const i = M(e), s = t ? (n = i == null ? void 0 : i.factions) == null ? void 0 : n.find((a) => a.id === t) : null;
    te({
      title: s ? "Edit Faction" : "Create Faction",
      content: pt(s ?? { id: P("faction"), name: "New Faction" }),
      submitLabel: s ? "Save Faction" : "Create Faction",
      onSubmit: (a) => Pe(e, a)
    });
  }
  function je(e) {
    const t = M(e);
    if (!t) return;
    const i = h(t).factions.map((s) => `
      <article class="gmf-dialog-row">
        <div>
          <strong><span class="gmf-color-dot" style="--gmf-faction-color: ${d(s.color)};"></span>${d(s.name)}</strong>
          <span>${d(s.color)} - ${d(s.visibility)}</span>
        </div>
        <div class="gmf-row-actions">
          <button type="button" data-dialog-edit-faction="${d(s.id)}" title="Edit faction"><i class="fa-solid fa-pen"></i></button>
          <button type="button" data-dialog-delete-faction="${d(s.id)}" title="Delete faction"><i class="fa-solid fa-trash"></i></button>
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
          <div class="gmf-dialog-list">${i}</div>
        </section>
      `,
      render: (s) => {
        var a;
        const n = ee(s);
        (a = n.querySelector("[data-dialog-add-faction]")) == null || a.addEventListener("click", () => J(e)), n.querySelectorAll("[data-dialog-edit-faction]").forEach((r) => {
          r.addEventListener("click", () => J(e, r.dataset.dialogEditFaction));
        }), n.querySelectorAll("[data-dialog-delete-faction]").forEach((r) => {
          r.addEventListener("click", async () => {
            await Dialog.confirm({
              title: "Delete Faction",
              content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
            }) && (await le(e, r.dataset.dialogDeleteFaction), je(e));
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
  function gt(e) {
    if (!e) return null;
    const t = h(e), i = new Map(t.systems.map((n) => [n.id, n])), s = new Map(t.factions.map((n) => [n.id, n]));
    return {
      ...t,
      systems: t.systems.map((n) => {
        var a;
        return {
          ...n,
          factionName: ((a = s.get(n.factionId)) == null ? void 0 : a.name) ?? "Unaffiliated"
        };
      }),
      routes: t.routes.map((n) => {
        var a, r;
        return {
          ...n,
          fromName: ((a = i.get(n.fromSystemId)) == null ? void 0 : a.name) ?? n.fromSystemId,
          toName: ((r = i.get(n.toSystemId)) == null ? void 0 : r.name) ?? n.toSystemId
        };
      })
    };
  }
  function ie() {
    return Object.values(x()).map(h);
  }
  function C(e = null) {
    R != null && R.rendered && R.render({ force: !0 });
    for (const [t, i] of z.entries())
      (!e || t === e) && i.render({ force: !0 });
    f != null && f.rendered && (!e || f.mapId === e) && f.render({ force: !0 });
  }
  function ht(e) {
    const t = [...z.values()];
    return f && t.push(f), t.filter((i) => (i == null ? void 0 : i.rendered) && i.mapId === e);
  }
  function vt(e) {
    var t;
    return e.element instanceof HTMLElement ? e.element : ((t = e.element) == null ? void 0 : t[0]) ?? null;
  }
  function Ye(e, t, i) {
    return e.routes.find((s) => s.fromSystemId === t && s.toSystemId === i || s.toSystemId === t && s.fromSystemId === i) ?? null;
  }
  function St(e) {
    return ke().filter((t) => t.id !== e).map((t) => t.id);
  }
  function bt(e, t) {
    const i = M(e);
    if (!i)
      return y(`Map "${e}" was not found.`), null;
    const s = h(i), n = s.systems.find((p) => p.id === s.currentSystemId), a = s.systems.find((p) => p.id === t);
    if (!a)
      return y(`System "${t}" was not found.`), null;
    if (!n)
      return y("This map does not have a current location yet. Ask the GM to set one first."), null;
    if (n.id === a.id)
      return E(`${a.name} is already the current location.`), null;
    if (s.visibility !== "players" || n.visibility !== "players" || a.visibility !== "players")
      return y("That travel destination is not visible to players."), null;
    const r = Ye(s, n.id, a.id);
    if (!r || r.visibility !== "players")
      return y(`No player-visible direct route from ${n.name} to ${a.name}.`), null;
    const o = Te();
    if (!o)
      return y("A GM must be online to approve player travel."), null;
    const u = St(game.user.id);
    return u.includes(o.id) || u.push(o.id), {
      action: "travel-request",
      requestId: P("travel"),
      mapId: e,
      mapTitle: s.title,
      fromSystemId: n.id,
      fromName: n.name,
      toSystemId: a.id,
      toName: a.name,
      routeId: r.id,
      routeType: r.type,
      travelTime: r.travelTime,
      fuelCost: r.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      voterIds: [...new Set(u)]
    };
  }
  function Ue(e, t) {
    const i = bt(e, t);
    return i ? (game.socket.emit(v, i), E(`Travel request sent: ${i.fromName} to ${i.toName}.`), i) : null;
  }
  function It(e) {
    var s, n, a;
    if (!(e != null && e.requestId) || e.requesterId === ((s = game.user) == null ? void 0 : s.id) || !((a = e.voterIds) != null && a.includes((n = game.user) == null ? void 0 : n.id)) || K.has(e.requestId)) return;
    K.add(e.requestId);
    let t = !1;
    const i = (r) => {
      if (t) return;
      t = !0;
      const o = {
        action: "travel-vote",
        requestId: e.requestId,
        mapId: e.mapId,
        userId: game.user.id,
        userName: game.user.name,
        accepted: r
      };
      game.socket.emit(v, o), He(o);
    };
    new Dialog({
      title: "Travel Request",
      content: `
        <section class="gmf-travel-request">
          <p><strong>${d(e.requesterName)}</strong> wants to travel on <strong>${d(e.mapTitle)}</strong>.</p>
          <p>${d(e.fromName)} &rarr; ${d(e.toName)}</p>
          <p class="gmf-travel-request__meta">${d(e.routeType)} route / ${d(e.travelTime || "Unknown time")} / Fuel ${d(e.fuelCost ?? 0)}</p>
        </section>
      `,
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
      close: () => i(!1)
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog"],
      width: 420
    }).render(!0);
  }
  function wt(e) {
    if (!Ee() || !(e != null && e.requestId)) return;
    const t = globalThis.setTimeout(() => {
      const i = X.get(e.requestId);
      i && Xe(i, "Request timeout");
    }, et);
    X.set(e.requestId, {
      ...e,
      accepted: /* @__PURE__ */ new Set(),
      voterIds: [...new Set(e.voterIds ?? [])],
      timeoutId: t
    });
  }
  function Ve(e) {
    const t = h(M(e.mapId)), i = t.systems.find((n) => n.id === e.fromSystemId), s = t.systems.find((n) => n.id === e.toSystemId);
    !i || !s || ht(e.mapId).forEach((n) => {
      var r;
      const a = vt(n);
      a && (n.selectedSystemId = s.id, n.selectedRouteId = null, (r = n._animateShipTravel) == null || r.call(n, i, s, a));
    });
  }
  async function Mt(e) {
    X.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId);
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
    game.socket.emit(v, t), Ve(t), E(`Travel approved: ${e.fromName} to ${e.toName}.`), globalThis.setTimeout(() => H(e.mapId, e.toSystemId), xe);
  }
  function Xe(e, t = "A player") {
    X.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId);
    const i = {
      action: "travel-declined",
      requestId: e.requestId,
      mapId: e.mapId,
      fromName: e.fromName,
      toName: e.toName,
      voterName: t,
      coordinatorId: game.user.id
    };
    game.socket.emit(v, i), E(`Travel declined by ${t}: ${e.fromName} to ${e.toName}.`);
  }
  function He(e) {
    if (!Ee() || !(e != null && e.requestId)) return;
    const t = X.get(e.requestId);
    if (!(!t || !t.voterIds.includes(e.userId))) {
      if (!e.accepted) {
        Xe(t, e.userName);
        return;
      }
      t.accepted.add(e.userId), t.voterIds.every((i) => t.accepted.has(i)) && Mt(t);
    }
  }
  function xt(e) {
    var t, i;
    e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && K.delete(e.requestId), Ve(e), (i = ui.notifications) == null || i.info(`Travel approved: ${e.fromName} to ${e.toName}.`));
  }
  function $t(e) {
    var t, i;
    e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && K.delete(e.requestId), (i = ui.notifications) == null || i.warn(`Travel declined by ${e.voterName}: ${e.fromName} to ${e.toName}.`));
  }
  function kt(e) {
    const t = z.get(e);
    t && t.close(), (f == null ? void 0 : f.mapId) === e && f.close();
  }
  function Z(e, t = {}) {
    var o;
    const i = M(e);
    if (!i)
      return y(`Map "${e}" was not found.`), null;
    const s = t.playerMode ?? !((o = game.user) != null && o.isGM);
    if (s && i.visibility !== "players" && !t.broadcast)
      return y("That galaxy map is not visible to players."), null;
    const n = s ? `player:${e}` : e, a = s && (f == null ? void 0 : f.mapId) === e ? f : z.get(n);
    if (a != null && a.rendered)
      return a.bringToFront(), a;
    const r = new ge({ mapId: e, playerMode: s });
    return s ? f = r : z.set(n, r), r.render({ force: !0 }), r;
  }
  function fe() {
    return w("open the map manager") ? (R || (R = new ye()), R.render({ force: !0 }), R) : null;
  }
  function pe() {
    const e = ie().filter((s) => s.visibility === "players").sort((s, n) => s.title.localeCompare(n.title));
    if (!e.length)
      return E("No galaxy map is currently visible to players."), null;
    if (e.length === 1) return Z(e[0].id, { playerMode: !0 });
    const t = e.map((s) => `
      <button type="button" class="gmf-player-map-choice" data-player-open-map="${d(s.id)}">
        <span class="gmf-player-map-choice__title">${d(s.title)}</span>
        <span class="gmf-player-map-choice__meta">${d(s.subtitle || s.description || "Player-visible galaxy map")}</span>
      </button>
    `).join("");
    let i = null;
    return i = new Dialog({
      title: "Choose Galaxy Map",
      content: `<section class="gmf-player-map-chooser">${t}</section>`,
      render: (s) => {
        const n = ee(s);
        n == null || n.querySelectorAll("[data-player-open-map]").forEach((a) => {
          a.addEventListener("click", () => {
            Z(a.dataset.playerOpenMap, { playerMode: !0 }), i == null || i.close();
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
    }), i.render(!0), i;
  }
  function Tt() {
    var t;
    const e = ie().sort((i, s) => i.title.localeCompare(s.title));
    return (t = game.user) != null && t.isGM ? e.length === 1 ? Z(e[0].id) : fe() : pe();
  }
  function Et(e) {
    if (w("broadcast galaxy maps")) {
      if (!M(e)) {
        y(`Map "${e}" was not found.`);
        return;
      }
      game.socket.emit(v, { action: "open", mapId: e }), E("Map broadcast sent to players.");
    }
  }
  function Ct() {
    w("close player galaxy maps") && (game.socket.emit(v, { action: "close" }), E("Close-map signal sent to players."));
  }
  function Be() {
    var i, s, n, a;
    const e = (s = (i = foundry.applications) == null ? void 0 : i.api) == null ? void 0 : s.ApplicationV2, t = (a = (n = foundry.applications) == null ? void 0 : n.api) == null ? void 0 : a.HandlebarsApplicationMixin;
    return e && t ? t(e) : Application;
  }
  class ye extends Be() {
    constructor(t = {}) {
      super(t), this.selectedMapId = t.selectedMapId ?? null, this.jsonDraft = "";
    }
    async _prepareContext(t) {
      var a, r;
      const i = await ((a = super._prepareContext) == null ? void 0 : a.call(this, t)) ?? {}, s = ie().sort((o, u) => o.title.localeCompare(u.title));
      (!this.selectedMapId || !s.some((o) => o.id === this.selectedMapId)) && (this.selectedMapId = ((r = s[0]) == null ? void 0 : r.id) ?? null);
      const n = this.selectedMapId ? gt(M(this.selectedMapId)) : null;
      return {
        ...i,
        maps: s,
        selectedMap: n,
        selectedMapId: this.selectedMapId,
        hasMaps: s.length > 0,
        sampleInstalled: !!M($e.id)
      };
    }
    _attachPartListeners(t, i, s) {
      var n, a, r, o, u, p, m, S, g, b, T;
      (n = super._attachPartListeners) == null || n.call(this, t, i, s), (a = i.querySelector("[data-action='create-map']")) == null || a.addEventListener("click", () => this._onCreateMap()), (r = i.querySelector("[data-action='edit-map-metadata']")) == null || r.addEventListener("click", () => {
        this.selectedMapId && Ge(this.selectedMapId);
      }), (o = i.querySelector("[data-action='create-system']")) == null || o.addEventListener("click", () => {
        this.selectedMapId && B(this.selectedMapId);
      }), (u = i.querySelector("[data-action='create-route']")) == null || u.addEventListener("click", () => {
        this.selectedMapId && j(this.selectedMapId);
      }), (p = i.querySelector("[data-action='create-faction']")) == null || p.addEventListener("click", () => {
        this.selectedMapId && J(this.selectedMapId);
      }), i.querySelectorAll("[data-edit-system]").forEach((l) => {
        l.addEventListener("click", () => B(this.selectedMapId, l.dataset.editSystem));
      }), i.querySelectorAll("[data-delete-system]").forEach((l) => {
        l.addEventListener("click", () => this._confirmDeleteSystem(l.dataset.deleteSystem));
      }), i.querySelectorAll("[data-edit-route]").forEach((l) => {
        l.addEventListener("click", () => j(this.selectedMapId, l.dataset.editRoute));
      }), i.querySelectorAll("[data-delete-route]").forEach((l) => {
        l.addEventListener("click", () => this._confirmDeleteRoute(l.dataset.deleteRoute));
      }), i.querySelectorAll("[data-edit-faction]").forEach((l) => {
        l.addEventListener("click", () => J(this.selectedMapId, l.dataset.editFaction));
      }), i.querySelectorAll("[data-delete-faction]").forEach((l) => {
        l.addEventListener("click", () => this._confirmDeleteFaction(l.dataset.deleteFaction));
      }), (m = i.querySelector("[data-action='install-sample']")) == null || m.addEventListener("click", async () => {
        const l = await ze();
        l && (this.selectedMapId = l.id, this.jsonDraft = "", this.render({ force: !0 }));
      }), (S = i.querySelector("[data-action='export-map']")) == null || S.addEventListener("click", () => {
        this.selectedMapId && me(this.selectedMapId);
      }), (g = i.querySelector("[data-action='import-map']")) == null || g.addEventListener("click", () => {
        var l;
        (l = i.querySelector("[name='map-import']")) == null || l.click();
      }), (b = i.querySelector("[name='map-import']")) == null || b.addEventListener("change", (l) => this._onImportFile(l)), i.querySelectorAll("[data-select-map]").forEach((l) => {
        l.addEventListener("click", () => {
          this.selectedMapId = l.dataset.selectMap, this.jsonDraft = "", this.render({ force: !0 });
        });
      }), i.querySelectorAll("[data-open-map]").forEach((l) => {
        l.addEventListener("click", () => game.galaxyMap.openMap(l.dataset.openMap));
      }), i.querySelectorAll("[data-show-map]").forEach((l) => {
        l.addEventListener("click", () => game.galaxyMap.showMapToPlayers(l.dataset.showMap));
      }), i.querySelectorAll("[data-duplicate-map]").forEach((l) => {
        l.addEventListener("click", async () => {
          const $ = await Re(l.dataset.duplicateMap);
          $ && (this.selectedMapId = $.id, this.jsonDraft = "", this.render({ force: !0 }));
        });
      }), i.querySelectorAll("[data-delete-map]").forEach((l) => {
        l.addEventListener("click", async () => {
          const $ = l.dataset.deleteMap, c = M($);
          await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${(c == null ? void 0 : c.title) ?? $}</strong>? This cannot be undone.</p>`
          }) && (await De($), this.selectedMapId === $ && (this.selectedMapId = null), this.jsonDraft = "", this.render({ force: !0 }));
        });
      }), (T = i.querySelector("[data-action='close-player-map']")) == null || T.addEventListener("click", () => game.galaxyMap.closePlayerMap());
    }
    async _onCreateMap() {
      const t = await qe({
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
      t && (this.selectedMapId = t.id, this.jsonDraft = "", this.render({ force: !0 }));
    }
    async _onImportFile(t) {
      var a;
      const i = (a = t.currentTarget.files) == null ? void 0 : a[0];
      if (t.currentTarget.value = "", !i) return;
      let s;
      try {
        s = JSON.parse(await i.text());
      } catch (r) {
        y(`Import failed: ${r.message}`);
        return;
      }
      const n = await Oe(s);
      n && (this.selectedMapId = n.id, this.jsonDraft = "", this.render({ force: !0 }));
    }
    async _confirmDeleteSystem(t) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }) && await re(this.selectedMapId, t);
    }
    async _confirmDeleteRoute(t) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }) && await oe(this.selectedMapId, t);
    }
    async _confirmDeleteFaction(t) {
      await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }) && await le(this.selectedMapId, t);
    }
  }
  W(ye, "DEFAULT_OPTIONS", {
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
  }), W(ye, "PARTS", {
    main: {
      template: `${V}/map-manager.hbs`
    }
  });
  class ge extends Be() {
    constructor(t = {}) {
      var n;
      const i = t.mapId, s = t.playerMode ?? !((n = game.user) != null && n.isGM);
      super({
        ...t,
        id: `galaxy-map-view-${s ? "player" : "gm"}-${i}`
      }), this.mapId = i, this.playerMode = s, this.selectedSystemId = t.selectedSystemId ?? null, this.selectedRouteId = t.selectedRouteId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null;
    }
    get title() {
      const t = M(this.mapId), i = this.playerMode ? "Player View" : "GM View";
      return t ? `${t.title} - ${i}` : `Galaxy Map - ${i}`;
    }
    async _prepareContext(t) {
      var a;
      const i = await ((a = super._prepareContext) == null ? void 0 : a.call(this, t)) ?? {}, s = M(this.mapId), n = s ? ut(s, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      }) : null;
      return n != null && n.selectedSystem && (this.selectedSystemId = n.selectedSystem.id), {
        ...i,
        map: n,
        mapId: this.mapId,
        playerMode: this.playerMode,
        zoomPercent: Math.round(this.zoom * 100),
        panX: this.panX,
        panY: this.panY,
        zoom: this.zoom,
        missingMap: !s
      };
    }
    _onRender(t, i) {
      var n, a;
      (n = super._onRender) == null || n.call(this, t, i);
      const s = this.element instanceof HTMLElement ? this.element : (a = this.element) == null ? void 0 : a[0];
      s && this._attachPartListeners("main", s, i);
    }
    _attachPartListeners(t, i, s) {
      var r, o, u, p, m, S, g, b, T, l, $, c, q, D, Y, Je, Ze, We, Ke, Qe;
      const n = (r = i.matches) != null && r.call(i, ".gmf-map-stage") ? i : (o = i.querySelector) == null ? void 0 : o.call(i, ".gmf-map-stage");
      if ((n == null ? void 0 : n.dataset.gmfMapBound) === "true") return;
      n && (n.dataset.gmfMapBound = "true"), (u = super._attachPartListeners) == null || u.call(this, t, i, s), this._applyViewportTransform(i), i.querySelectorAll("[data-system-id]").forEach((I) => {
        var U;
        I.addEventListener("click", (he) => {
          if (I.dataset.dragged === "true") {
            I.dataset.dragged = "false";
            return;
          }
          he.stopPropagation(), this.selectedSystemId = I.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
        }), !this.playerMode && ((U = game.user) != null && U.isGM) && I.addEventListener("pointerdown", (he) => this._startSystemDrag(he, i, I));
      }), i.querySelectorAll("[data-route-id]").forEach((I) => {
        I.addEventListener("click", (U) => {
          U.stopPropagation(), this.selectedRouteId = I.dataset.routeId, this.selectedSystemId = null, this.render({ force: !0 });
        });
      });
      const a = i.querySelector(".gmf-map-stage");
      a == null || a.addEventListener("wheel", (I) => this._onWheelZoom(I, i), { passive: !1 }), a == null || a.addEventListener("pointerdown", (I) => this._startPan(I, i)), a == null || a.addEventListener("contextmenu", (I) => this._openContextMenu(I, i), { capture: !0 }), i.querySelectorAll("[data-context-action]").forEach((I) => {
        I.addEventListener("click", (U) => this._handleContextAction(U, i));
      }), (p = i.querySelector("[data-action='open-map-menu']")) == null || p.addEventListener("click", (I) => this._openStageMenuFromButton(I, i)), (m = i.querySelector("[data-action='zoom-in']")) == null || m.addEventListener("click", () => this._setZoom(this.zoom + 0.15, i)), (S = i.querySelector("[data-action='zoom-out']")) == null || S.addEventListener("click", () => this._setZoom(this.zoom - 0.15, i)), (g = i.querySelector("[data-action='reset-view']")) == null || g.addEventListener("click", () => {
        this.zoom = 1, this.panX = 0, this.panY = 0, this._applyViewportTransform(i);
      }), (b = i.querySelector("[data-action='open-scene']")) == null || b.addEventListener("click", () => this._openLinkedScene()), (T = i.querySelector("[data-action='open-journal']")) == null || T.addEventListener("click", () => this._openLinkedJournal()), (l = i.querySelector("[data-action='edit-system']")) == null || l.addEventListener("click", () => {
        this.selectedSystemId && B(this.mapId, this.selectedSystemId);
      }), ($ = i.querySelector("[data-action='reveal-system']")) == null || $.addEventListener("click", () => {
        this.selectedSystemId && ce(this.mapId, this.selectedSystemId);
      }), (c = i.querySelector("[data-action='delete-system']")) == null || c.addEventListener("click", () => {
        this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), (q = i.querySelector("[data-action='set-current-system']")) == null || q.addEventListener("click", () => {
        this.selectedSystemId && H(this.mapId, this.selectedSystemId);
      }), (D = i.querySelector("[data-action='travel-to-system']")) == null || D.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? Ue(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, i));
      }), (Y = i.querySelector("[data-action='edit-route']")) == null || Y.addEventListener("click", () => {
        this.selectedRouteId && j(this.mapId, this.selectedRouteId);
      }), (Je = i.querySelector("[data-action='reveal-route']")) == null || Je.addEventListener("click", () => {
        this.selectedRouteId && de(this.mapId, this.selectedRouteId);
      }), (Ze = i.querySelector("[data-action='delete-route']")) == null || Ze.addEventListener("click", () => {
        this.selectedRouteId && this._confirmDeleteRoute(this.selectedRouteId);
      }), (We = i.querySelector("[data-action='notify-discovery']")) == null || We.addEventListener("click", () => {
        this.selectedSystemId && ue(this.mapId, this.selectedSystemId);
      }), (Ke = i.querySelector("[data-action='show-to-players']")) == null || Ke.addEventListener("click", () => game.galaxyMap.showMapToPlayers(this.mapId)), (Qe = i.querySelector("[data-action='edit-map']")) == null || Qe.addEventListener("click", () => {
        const I = game.galaxyMap.openMapManager();
        I && (I.selectedMapId = this.mapId, I.render({ force: !0 }));
      });
    }
    _applyViewportTransform(t) {
      var s;
      const i = t.querySelector(".gmf-map-viewport");
      i && (i.style.setProperty("--gmf-pan-x", `${this.panX}px`), i.style.setProperty("--gmf-pan-y", `${this.panY}px`), i.style.setProperty("--gmf-zoom", String(this.zoom)), (s = t.querySelector("[data-zoom-label]")) == null || s.replaceChildren(`${Math.round(this.zoom * 100)}%`));
    }
    _setZoom(t, i) {
      this.zoom = F(t, we, Me), this._applyViewportTransform(i);
    }
    _onWheelZoom(t, i) {
      t.preventDefault();
      const s = i.querySelector(".gmf-map-stage");
      if (!s) return;
      const n = s.getBoundingClientRect(), a = this.zoom, r = F(a + (t.deltaY < 0 ? 0.12 : -0.12), we, Me), o = t.clientX - n.left, u = t.clientY - n.top, p = (o - this.panX) / a, m = (u - this.panY) / a;
      this.zoom = r, this.panX = o - p * r, this.panY = u - m * r, this._applyViewportTransform(i);
    }
    _startPan(t, i) {
      if (t.button !== 0 || t.target.closest("[data-system-id], [data-route-id], button")) return;
      t.preventDefault();
      const s = t.clientX, n = t.clientY, a = this.panX, r = this.panY, o = (p) => {
        this.panX = a + p.clientX - s, this.panY = r + p.clientY - n, this._applyViewportTransform(i);
      }, u = () => {
        window.removeEventListener("pointermove", o), window.removeEventListener("pointerup", u);
      };
      window.addEventListener("pointermove", o), window.addEventListener("pointerup", u, { once: !0 });
    }
    _startSystemDrag(t, i, s) {
      var b;
      if (t.button !== 0) return;
      t.preventDefault(), t.stopPropagation(), (b = s.setPointerCapture) == null || b.call(s, t.pointerId);
      const n = t.clientX, a = t.clientY;
      let r = this._pointerToMapPercent(t, i), o = !1, u = null;
      const p = Array.from(i.querySelectorAll(`[data-route-from="${s.dataset.systemId}"]`)), m = Array.from(i.querySelectorAll(`[data-route-to="${s.dataset.systemId}"]`));
      s.classList.add("is-dragging");
      const S = (T) => {
        const l = Math.abs(T.clientX - n), $ = Math.abs(T.clientY - a);
        o = o || l > 3 || $ > 3, r = this._pointerToMapPercent(T, i), s.dataset.dragged = o ? "true" : "false", !u && (u = requestAnimationFrame(() => {
          u = null, s.style.left = `${r.x}%`, s.style.top = `${r.y}%`, this._updateConnectedRoutes(p, m, r.x, r.y);
        }));
      }, g = async () => {
        u && cancelAnimationFrame(u), s.style.left = `${r.x}%`, s.style.top = `${r.y}%`, this._updateConnectedRoutes(p, m, r.x, r.y), s.classList.remove("is-dragging"), window.removeEventListener("pointermove", S), window.removeEventListener("pointerup", g), o && await Fe(this.mapId, s.dataset.systemId, r.x, r.y);
      };
      window.addEventListener("pointermove", S), window.addEventListener("pointerup", g, { once: !0 });
    }
    _pointerToMapPercent(t, i) {
      const n = i.querySelector(".gmf-map-stage").getBoundingClientRect();
      return {
        x: F((t.clientX - n.left - this.panX) / this.zoom / n.width * 100, 0, 100),
        y: F((t.clientY - n.top - this.panY) / this.zoom / n.height * 100, 0, 100)
      };
    }
    _updateConnectedRoutes(t, i, s, n) {
      t.forEach((a) => {
        a.setAttribute("x1", s), a.setAttribute("y1", n);
      }), i.forEach((a) => {
        a.setAttribute("x2", s), a.setAttribute("y2", n);
      });
    }
    _openContextMenu(t, i) {
      var l;
      if (!((l = game.user) != null && l.isGM) || this.playerMode || t.target.closest(".gmf-map-toolbar, .gmf-context-menu")) return;
      t.preventDefault(), t.stopPropagation();
      const s = t.target.closest("[data-route-id]"), n = t.target.closest("[data-system-id]"), a = this._pointerToMapPercent(t, i);
      this._contextTarget = s ? { type: "route", id: s.dataset.routeId, position: a } : n ? { type: "system", id: n.dataset.systemId, position: a } : { type: "stage", id: null, position: a };
      const r = i.querySelector("[data-gmf-context-menu]");
      if (!r) return;
      r.querySelectorAll("[data-context-show]").forEach(($) => {
        $.hidden = $.dataset.contextShow !== this._contextTarget.type;
      }), r.hidden = !1;
      const o = r.offsetWidth || 184, u = r.offsetHeight || 260, m = i.querySelector(".gmf-map-stage").getBoundingClientRect(), S = t.clientX - m.left, g = t.clientY - m.top, b = Math.max(4, m.width - o - 4), T = Math.max(4, m.height - u - 4);
      r.style.left = `${F(S, 4, b)}px`, r.style.top = `${F(g, 4, T)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(i), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _openStageMenuFromButton(t, i) {
      var r;
      if (!((r = game.user) != null && r.isGM) || this.playerMode) return;
      t.preventDefault(), t.stopPropagation();
      const s = i.querySelector(".gmf-map-stage"), n = s == null ? void 0 : s.getBoundingClientRect();
      if (!n) return;
      const a = {
        clientX: n.left + n.width / 2,
        clientY: n.top + n.height / 2,
        target: s,
        preventDefault: () => {
        },
        stopPropagation: () => {
        }
      };
      this._openContextMenu(a, i);
    }
    _hideContextMenu(t = null) {
      var n, a, r;
      const i = t ?? this.element ?? null, s = ((n = i == null ? void 0 : i.querySelector) == null ? void 0 : n.call(i, "[data-gmf-context-menu]")) ?? ((r = (a = i == null ? void 0 : i[0]) == null ? void 0 : a.querySelector) == null ? void 0 : r.call(a, "[data-gmf-context-menu]"));
      s && (s.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(t, i) {
      t.preventDefault(), t.stopPropagation();
      const s = t.currentTarget.dataset.contextAction, n = this._contextTarget;
      this._hideContextMenu(i), n && (s === "add-system" ? B(this.mapId, null, { x: n.position.x, y: n.position.y }) : s === "add-route" ? j(this.mapId) : s === "manage-factions" ? je(this.mapId) : s === "add-faction" ? J(this.mapId) : s === "edit-map-details" ? Ge(this.mapId) : s === "export-map" ? me(this.mapId) : s === "edit-system" ? B(this.mapId, n.id) : s === "add-route-from-system" ? j(this.mapId, null, { fromSystemId: n.id }) : s === "reveal-system" ? await ce(this.mapId, n.id) : s === "delete-system" ? await this._confirmDeleteSystem(n.id) : s === "edit-route" ? j(this.mapId, n.id) : s === "reveal-route" ? await de(this.mapId, n.id) : s === "delete-route" && await this._confirmDeleteRoute(n.id));
    }
    async _confirmDeleteSystem(t) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }) && await re(this.mapId, t);
    }
    async _confirmDeleteRoute(t) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }) && await oe(this.mapId, t);
    }
    async _travelToSystem(t, i) {
      const s = h(M(this.mapId)), n = s.systems.find((o) => o.id === s.currentSystemId), a = s.systems.find((o) => o.id === t);
      if (!a) return;
      if (!n) {
        await H(this.mapId, a.id), E(`Current location set to ${a.name}.`);
        return;
      }
      if (n.id === a.id) {
        E(`${a.name} is already the current location.`);
        return;
      }
      if (!Ye(s, n.id, a.id)) {
        y(`No direct route from ${n.name} to ${a.name}.`);
        return;
      }
      await this._animateShipTravel(n, a, i), await H(this.mapId, a.id), E(`Arrived at ${a.name}.`);
    }
    _animateShipTravel(t, i, s) {
      const n = s.querySelector("[data-ship-layer]"), a = s.querySelector(".gmf-map-stage");
      if (!n || !a) return Promise.resolve();
      const r = a.getBoundingClientRect(), o = (i.x - t.x) * r.width / 100, u = (i.y - t.y) * r.height / 100, p = Math.atan2(u, o) * 180 / Math.PI, m = document.createElement("div");
      return m.className = "gmf-travel-ship", m.innerHTML = '<i class="fa-solid fa-rocket"></i>', m.style.left = `${t.x}%`, m.style.top = `${t.y}%`, m.style.setProperty("--gmf-ship-angle", `${p}deg`), n.replaceChildren(m), new Promise((S) => {
        let g = !1;
        const b = () => {
          g || (g = !0, m.removeEventListener("transitionend", b), m.classList.add("is-arrived"), globalThis.setTimeout(() => {
            m.remove(), S();
          }, 260));
        };
        m.addEventListener("transitionend", b, { once: !0 }), requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            m.style.left = `${i.x}%`, m.style.top = `${i.y}%`;
          });
        }), globalThis.setTimeout(b, xe);
      });
    }
    _openLinkedScene() {
      var s;
      const t = this._getSelectedRawSystem();
      if (!(t != null && t.sceneId)) return;
      const i = (s = game.scenes) == null ? void 0 : s.get(t.sceneId);
      if (!i) {
        y(`Scene "${t.sceneId}" was not found.`);
        return;
      }
      i.view();
    }
    _openLinkedJournal() {
      var s, n;
      const t = this._getSelectedRawSystem();
      if (!(t != null && t.journalId)) return;
      const i = (s = game.journal) == null ? void 0 : s.get(t.journalId);
      if (!i) {
        y(`Journal "${t.journalId}" was not found.`);
        return;
      }
      (n = i.sheet) == null || n.render(!0);
    }
    _getSelectedRawSystem() {
      var i;
      const t = M(this.mapId);
      return ((i = t == null ? void 0 : t.systems) == null ? void 0 : i.find((s) => s.id === this.selectedSystemId)) ?? null;
    }
    async close(t = {}) {
      this._hideContextMenu(), this.playerMode && f === this && (f = null);
      for (const [i, s] of z.entries())
        s === this && z.delete(i);
      return super.close(t);
    }
  }
  W(ge, "DEFAULT_OPTIONS", {
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
  }), W(ge, "PARTS", {
    main: {
      template: `${V}/galaxy-map.hbs`
    }
  });
  function qt() {
    const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
    return t != null && t.registerApp ? (t.registerApp({
      id: _,
      title: "Galaxy Map",
      icon: "fa-solid fa-route",
      premium: !1,
      description: "Open cinematic campaign maps and navigation charts.",
      open: () => {
        var i;
        return (i = game.user) != null && i.isGM ? fe() : pe();
      }
    }), !0) : !1;
  }
  Hooks.once("init", async () => {
    game.settings.register(_, A, {
      scope: "world",
      config: !1,
      type: Object,
      default: {}
    }), Handlebars.registerHelper("gmfEq", (e, t) => e === t), Handlebars.registerHelper("gmfJson", (e) => JSON.stringify(e, null, 2)), Handlebars.registerHelper("gmfPercent", (e) => `${Number(e).toFixed(3)}%`), Handlebars.registerHelper("gmfFallback", (e, t) => e || t), await loadTemplates([
      `${V}/map-manager.hbs`,
      `${V}/galaxy-map.hbs`,
      `${V}/system-details.hbs`
    ]);
  }), Hooks.once("ready", () => {
    game.galaxyMap = {
      openMap: Z,
      openMapManager: fe,
      openGalaxyMapFromSceneControls: Tt,
      openPlayerMapChooser: pe,
      createMap: qe,
      getMaps: ie,
      showMapToPlayers: Et,
      closePlayerMap: Ct,
      updateMap: _e,
      updateMapMetadata: Le,
      deleteMap: De,
      duplicateMap: Re,
      upsertSystem: Ae,
      deleteSystem: re,
      upsertRoute: Ne,
      deleteRoute: oe,
      upsertFaction: Pe,
      deleteFaction: le,
      saveSystemPosition: Fe,
      setCurrentSystem: H,
      revealSystemToPlayers: ce,
      revealRouteToPlayers: de,
      notifySystemDiscovered: ue,
      requestTravelToSystem: Ue,
      importMapData: Oe,
      exportMap: me,
      installSampleMap: ze
    };
    const e = game.modules.get(_);
    e && (e.api = game.galaxyMap), qt(), game.socket.on(v, (t = {}) => {
      var i, s;
      if (t.action === "travel-request") {
        wt(t), It(t);
        return;
      }
      if (t.action === "travel-vote") {
        He(t);
        return;
      }
      if (t.action === "travel-approved") {
        xt(t);
        return;
      }
      if (t.action === "travel-declined") {
        $t(t);
        return;
      }
      (i = game.user) != null && i.isGM || (t.action === "open" && t.mapId && (f == null || f.close(), Z(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "close" && (f == null || f.close()), t.action === "refresh" && (f == null ? void 0 : f.mapId) === t.mapId && f.render({ force: !0 }), t.action === "notify" && ((s = ui.notifications) == null || s.info(t.message || "New system discovered."), (f == null ? void 0 : f.mapId) === t.mapId && f.render({ force: !0 })));
    }), console.log(`${_} | Ready. API available at game.galaxyMap.`);
  });
})();
