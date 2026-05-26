function ze(r) {
  return r.shape === "rectangle" ? Math.hypot(Number(r.width || 0), Number(r.height || 0)) / 2 : Number(r.radius || 0);
}
function mn(r, c, o, g) {
  return Math.hypot(r.x - o.x, r.y - o.y) <= Number(c) + Number(g);
}
function pn(r, c, o) {
  const g = Math.max(0, Number(o.width || 0) / 2), m = Math.max(0, Number(o.height || 0) / 2), s = Number(o.x) - g, A = Number(o.x) + g, R = Number(o.y) - m, z = Number(o.y) + m, X = Math.max(s, Math.min(r.x, A)), B = Math.max(R, Math.min(r.y, z));
  return Math.hypot(r.x - X, r.y - B) <= Number(c);
}
function hn(r, c, o) {
  return o.shape === "rectangle" ? pn(r, c, o) : mn(r, c, o, Number(o.radius || 0));
}
function yn(r, c, o, g, m) {
  return r.status === "resolved" || g != null && g.size && !g.has(String(r.type)) || m != null && m.size && !m.has(String(r.mode)) ? !1 : hn(c, o, r);
}
const Ee = "structural", Q = "breakable", F = "circle", U = [
  "breakable",
  "hidden",
  "trap",
  "magic",
  "tech",
  "biological",
  "radiation",
  "evidence",
  "loot",
  "custom"
], Le = ["gm", "revealed", "always"], Ae = ["active", "revealed", "resolved"], Z = ["circle", "rectangle"], D = ["structural", "arcane", "thermal", "forensic", "tech", "biological"], G = {
  structural: { label: "Structural", color: "#ffb347", icon: "fa-solid fa-building-shield", types: ["breakable", "hidden"] },
  arcane: { label: "Arcane", color: "#c77dff", icon: "fa-solid fa-wand-sparkles", types: ["magic", "hidden", "custom"] },
  thermal: { label: "Thermal", color: "#ff4d6d", icon: "fa-solid fa-temperature-high", types: ["trap", "biological", "radiation"] },
  forensic: { label: "Forensic", color: "#f7f7f2", icon: "fa-solid fa-fingerprint", types: ["evidence", "loot", "biological"] },
  tech: { label: "Tech", color: "#39ffb6", icon: "fa-solid fa-microchip", types: ["tech", "radiation", "hidden"] },
  biological: { label: "Biological", color: "#8fd14f", icon: "fa-solid fa-dna", types: ["biological", "evidence"] }
}, y = {
  breakable: { label: "Breakable Wall", color: "#ffb347", icon: "fa-solid fa-hammer" },
  hidden: { label: "Hidden Passage", color: "#45d6ff", icon: "fa-solid fa-door-open" },
  trap: { label: "Trap", color: "#ff4d6d", icon: "fa-solid fa-triangle-exclamation" },
  magic: { label: "Magic Residue", color: "#c77dff", icon: "fa-solid fa-wand-sparkles" },
  tech: { label: "Tech Signature", color: "#39ffb6", icon: "fa-solid fa-microchip" },
  biological: { label: "Biological Trace", color: "#8fd14f", icon: "fa-solid fa-dna" },
  radiation: { label: "Radiation Leak", color: "#f8f32b", icon: "fa-solid fa-radiation" },
  evidence: { label: "Evidence", color: "#f7f7f2", icon: "fa-solid fa-magnifying-glass" },
  loot: { label: "Loot Cache", color: "#ffd166", icon: "fa-solid fa-gem" },
  custom: { label: "Custom", color: "#7df9ff", icon: "fa-solid fa-location-dot" }
}, V = [
  { label: "Amber", value: "#ffb347" },
  { label: "Cyan", value: "#45d6ff" },
  { label: "Red", value: "#ff4d6d" },
  { label: "Violet", value: "#c77dff" },
  { label: "Green", value: "#39ffb6" },
  { label: "Bio Green", value: "#8fd14f" },
  { label: "Radiation Yellow", value: "#f8f32b" },
  { label: "White", value: "#f7f7f2" },
  { label: "Gold", value: "#ffd166" },
  { label: "Aqua", value: "#7df9ff" },
  { label: "Resolved Grey", value: "#7b858c" }
];
function vn(r) {
  return r && typeof r == "object" ? r : {};
}
function $(r, c) {
  const o = Number(r);
  return Number.isFinite(o) ? o : c;
}
function bn(r, c, o) {
  return Math.max(c, Math.min(o, r));
}
function Mn(r) {
  return String(r || "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function Re(r) {
  return D.find((c) => {
    var o, g;
    return (g = (o = G[c]) == null ? void 0 : o.types) == null ? void 0 : g.includes(r);
  }) ?? Ee;
}
function _e(r, c) {
  const o = String(r || c || "").trim();
  return o.startsWith("#") ? o.toLowerCase() : o;
}
function Tn(r = {}, c = {}) {
  var z;
  const o = vn(r), g = U.includes(o.type) ? o.type : Q, m = y[g] ?? y.custom, s = D.includes(o.mode) ? o.mode : Re(g), A = Z.includes(o.shape) ? o.shape : F, R = Ae.includes(o.status) ? o.status : o.resolved ? "resolved" : "active";
  return {
    id: String(o.id || ((z = c.createId) == null ? void 0 : z.call(c)) || ""),
    sceneId: String(o.sceneId || c.sceneId || ""),
    x: $(o.x, 0),
    y: $(o.y, 0),
    radius: Math.max(0, $(o.radius, 80)),
    shape: A,
    width: Math.max(0, $(o.width, 160)),
    height: Math.max(0, $(o.height, 160)),
    mode: s,
    type: g,
    label: String(o.label || m.label),
    description: String(o.description || ""),
    integrity: bn($(o.integrity, 100), 0, 100),
    difficulty: $(o.difficulty, 10),
    visibility: Le.includes(o.visibility) ? o.visibility : "gm",
    status: R,
    color: _e(o.color, m.color),
    icon: m.icon
  };
}
function wn(r) {
  if (!Array.isArray(r) || r.length === 0) return null;
  const c = r.map((o) => String(o).trim()).filter((o) => U.includes(o));
  return c.length ? new Set(c) : null;
}
function Sn(r) {
  const o = (Array.isArray(r) ? r : r ? [r] : []).map((g) => String(g).trim()).filter((g) => D.includes(g));
  return o.length ? new Set(o) : null;
}
function kn(r, c, o, g, m) {
  return yn(r, c, o, g, m);
}
function xn(r) {
  return r.visibility === "revealed" || r.visibility === "always";
}
function In(r, c) {
  var s;
  const o = c && r.visibility === "gm", g = ((s = y[r.type]) == null ? void 0 : s.label) || Mn(r.type), m = g.toLowerCase().includes("signature") ? g : `${g} Signature`;
  return {
    ...r,
    label: o ? m : r.label,
    description: o ? "" : r.description,
    integrity: o && r.type !== "breakable" ? null : r.integrity,
    difficulty: o ? null : r.difficulty
  };
}
function Pn(r) {
  const c = _e(r, "");
  return !c || V.some((o) => o.value === c) ? V : [{ label: `Current (${c})`, value: c }, ...V];
}
function Cn(r) {
  if (r.shape === "rectangle") {
    const o = Math.max(10, Number(r.width || 160) / 2), g = Math.max(10, Number(r.height || 160) / 2);
    return [
      { handle: "nw", x: -o, y: -g },
      { handle: "n", x: 0, y: -g },
      { handle: "ne", x: o, y: -g },
      { handle: "e", x: o, y: 0 },
      { handle: "se", x: o, y: g },
      { handle: "s", x: 0, y: g },
      { handle: "sw", x: -o, y: g },
      { handle: "w", x: -o, y: 0 }
    ];
  }
  const c = Math.max(12, Number(r.radius || 80));
  return [
    { handle: "radius-e", x: c, y: 0 },
    { handle: "radius-s", x: 0, y: c },
    { handle: "radius-w", x: -c, y: 0 },
    { handle: "radius-n", x: 0, y: -c }
  ];
}
function Nn(r) {
  return r.startsWith("radius") ? "move" : r === "n" || r === "s" ? "ns-resize" : r === "e" || r === "w" ? "ew-resize" : r === "nw" || r === "se" ? "nwse-resize" : r === "ne" || r === "sw" ? "nesw-resize" : "move";
}
function $n(r, c, o) {
  const g = o.x - Number(r.x), m = o.y - Number(r.y);
  if (r.shape === "rectangle") {
    const s = {};
    return (c.includes("e") || c.includes("w")) && (s.width = Math.max(24, Math.round(Math.abs(g) * 2))), (c.includes("n") || c.includes("s")) && (s.height = Math.max(24, Math.round(Math.abs(m) * 2))), s;
  }
  return {
    radius: Math.max(12, Math.round(Math.hypot(g, m)))
  };
}
function zn(r) {
  return Math.max(18, Math.min(ze(r), 80));
}
function En(r, c) {
  return Math.hypot(Number(c.x) - r.x, Number(c.y) - r.y) <= zn(c);
}
(() => {
  var Ce, Ne;
  const r = "pulse-scanner", c = "Pulse Scanner", o = `module.${r}`, g = `modules/${r}/templates`, m = "targets", s = {
    manager: null,
    lastMouseScenePosition: null,
    mouseTrackingCanvas: null,
    placementActive: !1,
    placementShape: F,
    markerLayer: null,
    markerSceneId: null,
    draggingMarker: null,
    resizingMarker: null,
    liveMarker: null,
    liveUpdates: null,
    latestScan: null
  }, A = globalThis.Application ?? ((Ne = (Ce = foundry.appv1) == null ? void 0 : Ce.api) == null ? void 0 : Ne.Application);
  Hooks.once("init", async () => {
    R(), z(), await loadTemplates([
      `${g}/target-manager.hbs`,
      `${g}/target-form.hbs`
    ]), console.log(`${c} | Initialized`);
  }), Hooks.once("ready", () => {
    var n;
    game.pulseScanner = X();
    const e = game.modules.get(r);
    e && (e.api = game.pulseScanner), B(), (n = game.socket) == null || n.on(o, Ye), console.log(`${c} | API available at game.pulseScanner`);
  }), Hooks.on("canvasReady", tn), Hooks.on("canvasReady", H), Hooks.on("updateScene", (e, n = {}) => {
    var t, a, i;
    s.draggingMarker || s.resizingMarker || e.id === ((t = canvas == null ? void 0 : canvas.scene) == null ? void 0 : t.id) && ((i = (a = n.flags) == null ? void 0 : a[r]) != null && i[m]) && H();
  });
  function R() {
    game.settings.register(r, "defaultScanRadius", {
      name: "Default Scan Radius",
      hint: "The default pulse radius in scene pixels.",
      scope: "world",
      config: !0,
      type: Number,
      default: 600
    }), game.settings.register(r, "allowPlayersToScan", {
      name: "Allow Players to Scan",
      hint: "Allow non-GM users to activate scanner pulses from controlled tokens.",
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0
    }), game.settings.register(r, "defaultHighlightDuration", {
      name: "Default Highlight Duration",
      hint: "How long detected target highlights remain visible, in milliseconds.",
      scope: "world",
      config: !0,
      type: Number,
      default: 4200
    }), game.settings.register(r, "showIntegrityToPlayers", {
      name: "Show Integrity to Players",
      hint: "Show integrity values on player-visible scan labels for breakable targets.",
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0
    }), game.settings.register(r, "showLabelsToPlayers", {
      name: "Show Labels to Players",
      hint: "Show target labels to players when scan results are revealed.",
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0
    }), game.settings.register(r, "scanSound", {
      name: "Scan Pulse Sound",
      hint: "Optional audio path played when a scanner pulse fires.",
      scope: "world",
      config: !0,
      type: String,
      default: ""
    });
  }
  function z() {
    Handlebars.registerHelper("psOption", (e, n) => e === n ? "selected" : ""), Handlebars.registerHelper("psFallback", (e, n) => e || n), Handlebars.registerHelper("psEq", (e, n) => e === n), Handlebars.registerHelper("psTypeLabel", (e) => {
      var n;
      return ((n = y[e]) == null ? void 0 : n.label) ?? C(e);
    }), Handlebars.registerHelper("psModeLabel", (e) => {
      var n;
      return ((n = G[e]) == null ? void 0 : n.label) ?? C(e);
    });
  }
  function X() {
    return {
      openTargetManager: ne,
      scan: j,
      createTarget: Y,
      getTargets: O,
      deleteTarget: te,
      revealTarget: W,
      revealLatestScan: ae,
      hideTarget: re,
      resolveTarget: se,
      unresolveTarget: ie,
      exportTargets: Oe,
      importTargets: le,
      togglePlacementTool: ee
    };
  }
  function B() {
    const e = game.modules.get("holosuite-core"), n = e != null && e.active ? e.api : null;
    return n != null && n.registerApp ? (n.registerApp({
      id: r,
      title: "Pulse Scanner",
      icon: "fa-solid fa-wave-square",
      premium: !1,
      featureId: r,
      description: "Scan scenes, reveal targets, and manage sensor signatures.",
      open: () => {
        var t;
        return (t = game.user) != null && t.isGM ? ne() : j();
      }
    }), !0) : !1;
  }
  function ee(e) {
    return P("place scan targets") ? (s.placementActive = typeof e == "boolean" ? e : !s.placementActive, H(), s.placementActive) : !1;
  }
  function Fe(e) {
    return P("place scan targets") ? (s.placementShape = Z.includes(e) ? e : F, s.placementActive = !0, I(), s.placementShape) : F;
  }
  function ne() {
    var e;
    return (e = game.user) != null && e.isGM ? (s.manager || (s.manager = new Ie()), s.manager.render(!0), s.manager) : (console.warn(`${c}: only GMs can manage scan targets.`), null);
  }
  async function j(e = {}) {
    var v, b, h, M, T, w, $e;
    if (!(canvas != null && canvas.ready) || !canvas.scene)
      return console.warn(`${c}: no active scene is ready.`), [];
    if (!((v = game.user) != null && v.isGM) && !game.settings.get(r, "allowPlayersToScan"))
      return console.warn(`${c}: players are not allowed to scan in this world.`), [];
    const n = ln(e.tokenId);
    if (!n)
      return console.warn(`${c}: select a token or pass tokenId.`), [];
    const t = Number(e.radius ?? game.settings.get(r, "defaultScanRadius")), a = Xe(e.types), i = Be(e.modes ?? e.mode), l = we(n), f = S(canvas.scene.id).filter((N) => Ue(N, l, t, a, i)), d = Number(e.duration ?? game.settings.get(r, "defaultHighlightDuration"));
    s.latestScan = {
      sceneId: canvas.scene.id,
      targetIds: f.map((N) => N.id),
      timestamp: Date.now()
    };
    const p = ce({
      sceneId: canvas.scene.id,
      origin: l,
      radius: t,
      duration: d,
      detected: f,
      userId: (b = game.user) == null ? void 0 : b.id,
      playerView: !((h = game.user) != null && h.isGM),
      mode: (i == null ? void 0 : i.values().next().value) ?? null
    });
    if (dn(), ue(p), (M = game.user) != null && M.isGM && e.revealToPlayers) {
      const N = ce({
        sceneId: canvas.scene.id,
        origin: l,
        radius: t,
        duration: d,
        detected: f,
        userId: (T = game.user) == null ? void 0 : T.id,
        playerView: !0,
        mode: (i == null ? void 0 : i.values().next().value) ?? null
      });
      (w = game.socket) == null || w.emit(o, { action: "scan-results", payload: N });
    }
    return ($e = game.user) != null && $e.isGM ? foundry.utils.deepClone(f) : f.map((N) => q(N, !0));
  }
  async function Y(e = {}) {
    if (!P("create scan targets")) return null;
    const n = L(e.sceneId) ?? canvas.scene;
    if (!n)
      return console.warn(`${c}: no scene was found for the new target.`), null;
    const t = E(n), a = x({ ...e, sceneId: n.id });
    return t[a.id] = a, await n.setFlag(r, m, t), I(), foundry.utils.deepClone(a);
  }
  function O(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    return S(e).filter((t) => {
      var a;
      return ((a = game.user) == null ? void 0 : a.isGM) || xn(t);
    }).map((t) => {
      var a;
      return (a = game.user) != null && a.isGM ? foundry.utils.deepClone(t) : q(t, !0);
    });
  }
  function S(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    const t = L(e);
    return t ? Object.values(E(t)).map((a) => x(a)).sort((a, i) => a.label.localeCompare(i.label)) : [];
  }
  async function te(e, n = ((t) => (t = canvas == null ? void 0 : canvas.scene) == null ? void 0 : t.id)()) {
    if (!P("delete scan targets")) return !1;
    s.draggingMarker = null, s.resizingMarker = null, s.liveMarker = null, s.liveUpdates = null;
    const a = L(n) ?? Se(e);
    if (!a)
      return console.warn(`${c}: target "${e}" was not found.`), !1;
    const i = E(a), l = De(i, e);
    if (!l)
      return console.warn(`${c}: target "${e}" was not found on ${a.name}.`), !1;
    delete i[l], await a.update({ [`flags.${r}.${m}.-=${l}`]: null });
    const u = a.getFlag(r, m) ?? {};
    (u[l] || Object.values(u).some((d) => (d == null ? void 0 : d.id) === e)) && (await a.unsetFlag(r, m), Object.keys(i).length && await a.setFlag(r, m, i));
    const f = a.getFlag(r, m) ?? {};
    return f[l] || Object.values(f).some((d) => (d == null ? void 0 : d.id) === e) ? (console.error(`${c} | Delete failed`, { targetId: e, storeKey: l, scene: a, store: i, afterFallback: f }), !1) : (I(), !0);
  }
  function De(e, n) {
    var t;
    return e[n] ? n : ((t = Object.entries(e).find(([, a]) => (a == null ? void 0 : a.id) === n)) == null ? void 0 : t[0]) ?? null;
  }
  async function W(e) {
    var t;
    const n = S((t = canvas.scene) == null ? void 0 : t.id).find((a) => a.id === e);
    return n ? k(e, { visibility: "revealed", status: n.status === "resolved" ? "resolved" : "revealed" }) : null;
  }
  async function ae() {
    var n;
    if (!P("reveal scan targets")) return [];
    if (!s.latestScan || s.latestScan.sceneId !== ((n = canvas.scene) == null ? void 0 : n.id))
      return console.warn(`${c}: no latest scan is available for this scene.`), [];
    const e = [];
    for (const t of s.latestScan.targetIds) {
      const a = await W(t);
      a && e.push(a);
    }
    return e;
  }
  async function re(e) {
    return k(e, { visibility: "gm", status: "active" });
  }
  async function se(e) {
    return k(e, { status: "resolved", visibility: "revealed" });
  }
  async function ie(e) {
    return k(e, { status: "active", visibility: "gm" });
  }
  function Oe(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    var i, l;
    const t = L(e);
    if (!t) return null;
    const a = {
      module: r,
      version: ((l = (i = game.modules) == null ? void 0 : i.get(r)) == null ? void 0 : l.version) ?? "0.1.0",
      sceneId: t.id,
      sceneName: t.name,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      targets: S(t.id)
    };
    return fn(`pulse-scanner-${gn(t.name)}.json`, a), a;
  }
  async function le(e, { merge: n = !0, sceneId: t = ((a) => (a = canvas == null ? void 0 : canvas.scene) == null ? void 0 : a.id)() } = {}) {
    if (!P("import scan targets")) return [];
    const i = L(t);
    if (!i) return [];
    let l;
    try {
      l = typeof e == "string" ? JSON.parse(e) : e;
    } catch (p) {
      return console.error(`${c} | Import failed`, p), [];
    }
    const u = Array.isArray(l) ? l : l == null ? void 0 : l.targets;
    if (!Array.isArray(u))
      return console.warn(`${c}: import JSON must contain a targets array.`), [];
    const f = n ? E(i) : {}, d = u.map((p) => x({
      ...p,
      id: p.id && !f[p.id] ? p.id : ke(),
      sceneId: i.id
    }));
    for (const p of d) f[p.id] = p;
    return await i.setFlag(r, m, f), I(), d;
  }
  async function k(e, n = {}, t = {}) {
    if (!P("edit scan targets")) return null;
    const a = Se(e) ?? L(n.sceneId) ?? canvas.scene;
    if (!a) return null;
    const i = E(a), l = i[e] ?? {}, u = x({ ...l, ...n, id: e, sceneId: a.id });
    return i[u.id] = u, await a.setFlag(r, m, i), t.refresh !== !1 && I(), foundry.utils.deepClone(u);
  }
  function E(e) {
    return foundry.utils.deepClone((e == null ? void 0 : e.getFlag(r, m)) ?? {});
  }
  function x(e = {}) {
    var n;
    return Tn(e, {
      createId: ke,
      sceneId: ((n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id) || ""
    });
  }
  function He(e) {
    return Re(e);
  }
  function Ge(e) {
    return Pn(e);
  }
  function Ue(e, n, t, a, i) {
    return kn(e, n, t, a, i);
  }
  function Xe(e) {
    return wn(e);
  }
  function Be(e) {
    return Sn(e);
  }
  function oe(e) {
    return ze(e);
  }
  function ce({ sceneId: e, origin: n, radius: t, duration: a, detected: i, userId: l, playerView: u, mode: f }) {
    return {
      sceneId: e,
      origin: n,
      radius: t,
      duration: a,
      userId: l,
      playerView: u,
      mode: f,
      showLabels: u ? !!game.settings.get(r, "showLabelsToPlayers") : !0,
      showIntegrity: u ? !!game.settings.get(r, "showIntegrityToPlayers") : !0,
      detected: i.map((d) => q(d, u))
    };
  }
  function q(e, n) {
    return In(e, n);
  }
  function ue(e = {}) {
    var l, u, f, d, p, v, b;
    if (!(canvas != null && canvas.ready) || e.sceneId !== ((l = canvas.scene) == null ? void 0 : l.id)) return;
    const n = document.createElement("div");
    n.className = "pulse-scanner-overlay", n.style.setProperty("--pulse-duration", `${Math.max(900, Number(e.duration || 4200))}ms`), document.body.appendChild(n);
    const t = Me(((u = e.origin) == null ? void 0 : u.x) ?? 0, ((f = e.origin) == null ? void 0 : f.y) ?? 0), a = Math.max(16, Te(Number(e.radius || 0))), i = document.createElement("div");
    if (i.className = "pulse-scanner-ring", i.style.left = `${t.x}px`, i.style.top = `${t.y}px`, i.style.setProperty("--pulse-radius", `${a}px`), i.style.setProperty("--pulse-color", ((d = G[e.mode]) == null ? void 0 : d.color) ?? "#7df9ff"), n.appendChild(i), !((p = e.detected) != null && p.length)) {
      const h = document.createElement("div");
      h.className = "pulse-scanner-empty", h.textContent = "NO SIGNATURES DETECTED", h.style.left = `${t.x}px`, h.style.top = `${t.y}px`, n.appendChild(h);
    }
    for (const h of e.detected ?? []) {
      const M = Me(h.x, h.y), T = document.createElement("div");
      if (T.className = `pulse-scanner-target pulse-scanner-target-${h.type}`, T.style.left = `${M.x}px`, T.style.top = `${M.y}px`, T.style.setProperty("--target-color", h.color || ((v = y[h.type]) == null ? void 0 : v.color) || y.custom.color), T.style.setProperty("--target-size", `${Math.max(28, Te(oe(h) || 80) * 2)}px`), n.appendChild(T), e.showLabels) {
        const w = document.createElement("div");
        w.className = "pulse-scanner-label", w.style.left = `${M.x}px`, w.style.top = `${M.y}px`, w.style.setProperty("--target-color", h.color || ((b = y[h.type]) == null ? void 0 : b.color) || y.custom.color), w.innerHTML = je(h, e.showIntegrity), n.appendChild(w);
      }
    }
    window.setTimeout(() => n.remove(), Math.max(900, Number(e.duration || 4200)) + 650);
  }
  function je(e, n) {
    var p, v, b;
    const t = e.icon || ((p = y[e.type]) == null ? void 0 : p.icon) || y.custom.icon, a = K(e.label || ((v = y[e.type]) == null ? void 0 : v.label) || "Signature"), i = K(((b = y[e.type]) == null ? void 0 : b.label) || C(e.type)), l = cn(Number(e.integrity ?? 0), 0, 100), u = e.type === "breakable", f = n && u ? `<span class="pulse-scanner-integrity">${l}%</span>` : "", d = n && u ? `<div class="pulse-scanner-integrity-bar"><span style="width: ${l}%;"></span></div><small>STRUCTURAL WEAKNESS: ${l}%</small>` : `<small>${i}</small>`;
    return `<span class="pulse-scanner-label-row"><i class="${K(t)}"></i><strong>${a}</strong>${f}</span>${d}`;
  }
  function Ye(e = {}) {
    var n, t;
    if (e.action === "scan-results") {
      if (((n = e.payload) == null ? void 0 : n.userId) === ((t = game.user) == null ? void 0 : t.id)) return;
      ue(e.payload);
    }
  }
  function H() {
    var a, i, l;
    if (!(canvas != null && canvas.ready) || !canvas.scene || !globalThis.PIXI) return;
    (a = s.markerLayer) != null && a.parent && s.markerLayer.parent.removeChild(s.markerLayer), (l = (i = s.markerLayer) == null ? void 0 : i.destroy) == null || l.call(i, { children: !0 });
    const e = canvas.interface ?? canvas.foreground ?? canvas.stage;
    if (!(e != null && e.addChild)) return;
    const n = new PIXI.Container();
    n.name = "pulse-scanner-target-markers", n.sortableChildren = !0, n.zIndex = 250, e.addChild(n), s.markerLayer = n, s.markerSceneId = canvas.scene.id;
    const t = S(canvas.scene.id).filter((u) => We(u));
    for (const u of t) n.addChild(qe(u));
  }
  function We(e) {
    var n;
    return (n = game.user) != null && n.isGM ? !0 : e.visibility === "revealed" || e.visibility === "always";
  }
  function qe(e) {
    var u, f, d;
    const n = new PIXI.Container();
    n.name = `pulse-scanner-target-${e.id}`, n.position.set(Number(e.x), Number(e.y)), n.eventMode = "none", n.interactive = !1, n.zIndex = e.status === "resolved" ? 1 : 5;
    const t = xe(e), a = new PIXI.Graphics();
    de(a, e, t), n.addChild(a), (u = game.user) != null && u.isGM && ge(n, e, t);
    const i = fe(e, t);
    (f = game.user) != null && f.isGM && n.addChild(i);
    const l = new PIXI.Text(e.status === "resolved" ? `${e.label} [resolved]` : e.label, {
      fontFamily: "Arial",
      fontSize: 13,
      fill: 16777215,
      stroke: 0,
      strokeThickness: 3
    });
    return l.anchor.set(0.5, 1), l.position.set(0, -Math.max(28, oe(e) + 8)), l.alpha = (d = game.user) != null && d.isGM ? 0.95 : 0.78, n.addChild(l), n;
  }
  function de(e, n, t) {
    const a = n.status === "resolved" ? 0.14 : n.visibility === "revealed" ? 0.2 : 0.1;
    e.clear(), e.lineStyle(2, t, n.status === "resolved" ? 0.42 : 0.82), e.beginFill(t, a), n.shape === "rectangle" ? e.drawRoundedRect(-n.width / 2, -n.height / 2, n.width, n.height, 8) : e.drawCircle(0, 0, Math.max(8, Number(n.radius || 80))), e.endFill(), e.lineStyle(1, t, 0.52), e.drawCircle(0, 0, 14);
  }
  function fe(e, n) {
    const t = new PIXI.Graphics();
    return t.name = `pulse-scanner-move-${e.id}`, t.eventMode = "static", t.interactive = !0, t.cursor = "move", t.hitArea = new PIXI.Circle(0, 0, 13), t.lineStyle(2, 16777215, 0.78), t.beginFill(n, 0.82), t.drawCircle(0, 0, 9), t.endFill(), t.lineStyle(1, 1053204, 0.9), t.moveTo(-5, 0), t.lineTo(5, 0), t.moveTo(0, -5), t.lineTo(0, 5), t.on("pointerdown", (a) => Qe(a, e, t.parent)).on("pointermove", (a) => Ze(a, e)).on("pointerup", () => J()).on("pointerupoutside", () => J()).on("rightclick", () => {
      s.manager = s.manager ?? new Ie({ targetId: e.id }), s.manager.selectedTargetId = e.id, s.manager.render(!0);
    }), t;
  }
  function ge(e, n, t) {
    Cn(n).forEach(({ handle: a, x: i, y: l }) => e.addChild(Je(n, a, i, l, t)));
  }
  function Je(e, n, t, a, i) {
    const l = new PIXI.Graphics();
    return l.name = `pulse-scanner-resize-${e.id}-${n}`, l.position.set(t, a), l.eventMode = "static", l.interactive = !0, l.cursor = Ve(n), l.hitArea = new PIXI.Circle(0, 0, 12), l.beginFill(1053204, 0.92), l.lineStyle(2, i, 1), l.drawCircle(0, 0, 7), l.endFill(), l.on("pointerdown", (u) => Ke(u, e, n)), l;
  }
  function Ke(e, n, t) {
    var a, i, l;
    (a = game.user) != null && a.isGM && ((i = e.stopPropagation) == null || i.call(e), s.resizingMarker = {
      id: n.id,
      handle: t,
      center: { x: Number(n.x), y: Number(n.y) }
    }, s.liveMarker = ((l = e.currentTarget) == null ? void 0 : l.parent) ?? null, s.liveUpdates = null);
  }
  function Ve(e) {
    return Nn(e);
  }
  function Qe(e, n, t) {
    var a, i;
    (a = game.user) != null && a.isGM && ((i = e.stopPropagation) == null || i.call(e), s.draggingMarker = {
      id: n.id,
      start: me(e),
      origin: { x: Number(n.x), y: Number(n.y) }
    }, s.liveMarker = t ?? null, s.liveUpdates = null);
  }
  function Ze(e, n) {
    !s.draggingMarker || s.draggingMarker.id !== n.id || pe(me(e));
  }
  function me(e) {
    var a, i;
    const n = (a = e.data) == null ? void 0 : a.originalEvent;
    if ((n == null ? void 0 : n.clientX) != null && (n == null ? void 0 : n.clientY) != null) return _(n.clientX, n.clientY);
    const t = e.global ?? ((i = e.data) == null ? void 0 : i.global);
    if (!t) return null;
    try {
      const l = canvas.stage.worldTransform.applyInverse(new PIXI.Point(t.x, t.y));
      return { x: Math.round(l.x), y: Math.round(l.y) };
    } catch {
      return null;
    }
  }
  async function J() {
    if (!s.draggingMarker) return !1;
    const e = s.draggingMarker.id, n = s.liveUpdates;
    return s.draggingMarker = null, s.liveMarker = null, s.liveUpdates = null, n && await k(e, n, { refresh: !1 }), I(), !0;
  }
  function pe(e) {
    if (!s.draggingMarker || !(canvas != null && canvas.scene)) return !1;
    if (!e || !s.draggingMarker.start) return !0;
    const n = e.x - s.draggingMarker.start.x, t = e.y - s.draggingMarker.start.y, a = Math.round(s.draggingMarker.origin.x + n), i = Math.round(s.draggingMarker.origin.y + t);
    return s.liveMarker && s.liveMarker.position.set(a, i), s.liveUpdates = { x: a, y: i }, !0;
  }
  function en(e, n) {
    if (!s.resizingMarker || !(canvas != null && canvas.scene)) return !1;
    const t = _(e, n);
    if (!t) return !0;
    const a = S(canvas.scene.id).find((l) => l.id === s.resizingMarker.id);
    if (!a) return !0;
    const i = $n(a, s.resizingMarker.handle, t);
    if (s.liveUpdates = i, s.liveMarker) {
      s.liveMarker.removeChildren();
      const l = x({ ...a, ...i }), u = xe(l), f = new PIXI.Graphics();
      de(f, l, u), s.liveMarker.addChild(f), ge(s.liveMarker, l, u), s.liveMarker.addChild(fe(l, u));
    }
    return !0;
  }
  async function nn() {
    if (!s.resizingMarker) return !1;
    const e = s.resizingMarker.id, n = s.liveUpdates;
    return s.resizingMarker = null, s.liveMarker = null, s.liveUpdates = null, n && await k(e, n, { refresh: !1 }), I(), !0;
  }
  function tn() {
    var n;
    const e = (n = canvas == null ? void 0 : canvas.app) == null ? void 0 : n.view;
    !e || s.mouseTrackingCanvas === e || (s.mouseTrackingCanvas && (s.mouseTrackingCanvas.removeEventListener("mousemove", he), s.mouseTrackingCanvas.removeEventListener("pointerdown", ye), s.mouseTrackingCanvas.removeEventListener("pointermove", ve), s.mouseTrackingCanvas.removeEventListener("pointerup", be)), e.addEventListener("mousemove", he), e.addEventListener("pointerdown", ye), e.addEventListener("pointermove", ve), e.addEventListener("pointerup", be), s.mouseTrackingCanvas = e);
  }
  function he(e) {
    s.lastMouseScenePosition = _(e.clientX, e.clientY);
  }
  async function ye(e) {
    var i;
    if (!s.placementActive || !((i = game.user) != null && i.isGM) || !(canvas != null && canvas.scene) || s.resizingMarker || s.draggingMarker || e.button !== 0) return;
    const n = _(e.clientX, e.clientY);
    if (!n || sn(n)) return;
    e.preventDefault(), e.stopPropagation();
    const t = rn(), a = await Y({
      sceneId: canvas.scene.id,
      x: n.x,
      y: n.y,
      mode: t.mode,
      type: t.type,
      label: t.label,
      visibility: "gm",
      shape: an(),
      radius: 80,
      width: 160,
      height: 160
    });
    s.manager && (s.manager.selectedTargetId = (a == null ? void 0 : a.id) ?? s.manager.selectedTargetId, s.manager.draftTarget = null, s.manager.render(!0));
  }
  function ve(e) {
    !s.resizingMarker && !s.draggingMarker || (e.preventDefault(), s.draggingMarker && pe(_(e.clientX, e.clientY)), s.resizingMarker && en(e.clientX, e.clientY));
  }
  function be(e) {
    !s.resizingMarker && !s.draggingMarker || (e.preventDefault(), s.draggingMarker && J().catch((n) => console.error(`${c} | Move failed`, n)), s.resizingMarker && nn().catch((n) => console.error(`${c} | Resize failed`, n)));
  }
  function an() {
    return Z.includes(s.placementShape) ? s.placementShape : F;
  }
  function rn() {
    var i, l, u, f, d, p, v, b, h, M;
    const e = (f = (u = (l = (i = s.manager) == null ? void 0 : i.element) == null ? void 0 : l.find) == null ? void 0 : u.call(l, "form.pulse-scanner-target-form")) == null ? void 0 : f[0], n = (p = (d = e == null ? void 0 : e.elements) == null ? void 0 : d.type) == null ? void 0 : p.value, t = (b = (v = e == null ? void 0 : e.elements) == null ? void 0 : v.mode) == null ? void 0 : b.value, a = (M = (h = e == null ? void 0 : e.elements) == null ? void 0 : h.label) == null ? void 0 : M.value;
    return {
      type: U.includes(n) ? n : Q,
      mode: D.includes(t) ? t : He(n || Q),
      label: a || "Placed Scan Target"
    };
  }
  function sn(e) {
    var n;
    return S((n = canvas.scene) == null ? void 0 : n.id).some((t) => En(e, t));
  }
  function Me(e, n) {
    try {
      const t = canvas.stage.worldTransform.apply(new PIXI.Point(Number(e), Number(n))), a = canvas.app.view.getBoundingClientRect();
      return { x: a.left + t.x, y: a.top + t.y };
    } catch {
      return { x: Number(e), y: Number(n) };
    }
  }
  function _(e, n) {
    try {
      const t = canvas.app.view.getBoundingClientRect(), a = canvas.stage.worldTransform.applyInverse(new PIXI.Point(e - t.left, n - t.top));
      return { x: Math.round(a.x), y: Math.round(a.y) };
    } catch {
      return null;
    }
  }
  function Te(e) {
    var t, a;
    const n = ((a = (t = canvas == null ? void 0 : canvas.stage) == null ? void 0 : t.scale) == null ? void 0 : a.x) ?? 1;
    return Number(e) * n;
  }
  function ln(e) {
    var n, t, a, i, l;
    return e ? ((n = canvas.tokens) == null ? void 0 : n.get(e)) ?? ((a = (t = canvas.tokens) == null ? void 0 : t.placeables) == null ? void 0 : a.find((u) => {
      var f;
      return u.id === e || ((f = u.document) == null ? void 0 : f.id) === e;
    })) : ((l = (i = canvas.tokens) == null ? void 0 : i.controlled) == null ? void 0 : l[0]) ?? null;
  }
  function we(e) {
    var i, l;
    if (e.center) return { x: e.center.x, y: e.center.y };
    const n = e.document ?? e, t = Number(n.width ?? 1) * Number(((i = canvas.grid) == null ? void 0 : i.size) ?? 100), a = Number(n.height ?? 1) * Number(((l = canvas.grid) == null ? void 0 : l.size) ?? 100);
    return { x: Number(n.x ?? e.x ?? 0) + t / 2, y: Number(n.y ?? e.y ?? 0) + a / 2 };
  }
  function on() {
    var n, t;
    const e = (t = (n = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : n.controlled) == null ? void 0 : t[0];
    return e ? we(e) : null;
  }
  function L(e) {
    var n;
    return e ? ((n = game.scenes) == null ? void 0 : n.get(e)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
  }
  function Se(e) {
    for (const n of game.scenes ?? [])
      if (E(n)[e]) return n;
    return null;
  }
  function I() {
    var e;
    (e = s.manager) != null && e.rendered && s.manager.render(!1), !s.draggingMarker && !s.resizingMarker && H();
  }
  function P(e) {
    var n;
    return (n = game.user) != null && n.isGM ? !0 : (console.warn(`${c}: only GMs can ${e}.`), !1);
  }
  function ke() {
    var e, n;
    return ((n = (e = foundry.utils).randomID) == null ? void 0 : n.call(e, 16)) ?? crypto.randomUUID();
  }
  function C(e) {
    return String(e || "").replace(/[-_]/g, " ").replace(/\b\w/g, (n) => n.toUpperCase());
  }
  function cn(e, n, t) {
    return Math.max(n, Math.min(t, e));
  }
  function un(e) {
    const n = String(e).trim().replace("#", ""), t = Number.parseInt(n.length === 3 ? n.split("").map((a) => `${a}${a}`).join("") : n, 16);
    return Number.isFinite(t) ? t : 8255999;
  }
  function xe(e) {
    var n;
    return e.status === "resolved" ? 8095116 : un(e.color || ((n = y[e.type]) == null ? void 0 : n.color) || y.custom.color);
  }
  function dn() {
    var t, a;
    const e = String(game.settings.get(r, "scanSound") || "").trim();
    if (!e) return;
    const n = globalThis.AudioHelper ?? ((t = foundry.audio) == null ? void 0 : t.AudioHelper);
    (a = n == null ? void 0 : n.play) == null || a.call(n, { src: e, volume: 0.65, autoplay: !0, loop: !1 }, !0);
  }
  function fn(e, n) {
    const t = new Blob([JSON.stringify(n, null, 2)], { type: "application/json" }), a = URL.createObjectURL(t), i = document.createElement("a");
    i.href = a, i.download = e, i.click(), URL.revokeObjectURL(a);
  }
  function gn(e) {
    return String(e || "scene").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "scene";
  }
  function K(e) {
    return String(e ?? "").replace(/[&<>"']/g, (n) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[n]);
  }
  class Ie extends A {
    constructor(n = {}) {
      super(n), this.selectedTargetId = n.targetId ?? null, this.draftTarget = null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "pulse-scanner-target-manager",
        title: "Pulse Scanner Target Manager",
        template: `${g}/target-manager.hbs`,
        classes: ["pulse-scanner", "pulse-scanner-manager"],
        width: 900,
        height: "auto",
        resizable: !0
      });
    }
    getData() {
      var u, f;
      const n = (canvas == null ? void 0 : canvas.scene) ?? ((u = game.scenes) == null ? void 0 : u.current) ?? null, t = O(n == null ? void 0 : n.id), a = t.map((d) => ({
        ...d,
        isResolved: d.status === "resolved",
        isBreakable: d.type === "breakable"
      })), i = this.draftTarget ?? t.find((d) => d.id === this.selectedTargetId) ?? t[0] ?? x({ sceneId: n == null ? void 0 : n.id, ...Pe() }), l = {
        ...i,
        isBreakable: i.type === "breakable"
      };
      return !this.draftTarget && !this.selectedTargetId && t[0] && (this.selectedTargetId = t[0].id), {
        scene: n,
        targets: a,
        selectedTarget: l,
        typeOptions: U.map((d) => {
          var p;
          return { value: d, label: ((p = y[d]) == null ? void 0 : p.label) ?? C(d) };
        }),
        modeOptions: D.map((d) => {
          var p;
          return { value: d, label: ((p = G[d]) == null ? void 0 : p.label) ?? C(d) };
        }),
        colorOptions: Ge(i.color),
        visibilityOptions: Le.map((d) => ({ value: d, label: C(d) })),
        statusOptions: Ae.map((d) => ({ value: d, label: C(d) })),
        defaultRadius: game.settings.get(r, "defaultScanRadius"),
        hasTargets: t.length > 0,
        canUseMouse: !!s.lastMouseScenePosition,
        placementActive: s.placementActive,
        placementShape: s.placementShape,
        placementCircle: s.placementShape === "circle",
        placementRectangle: s.placementShape === "rectangle",
        latestScanCount: ((f = s.latestScan) == null ? void 0 : f.sceneId) === (n == null ? void 0 : n.id) ? s.latestScan.targetIds.length : 0
      };
    }
    activateListeners(n) {
      super.activateListeners(n), n.find("[data-action]").on("click", (t) => this._handleAction(t)), n.find("form.pulse-scanner-target-form").on("submit", (t) => {
        t.preventDefault(), this._saveForm(t.currentTarget);
      }), n.find(".pulse-scanner-target-card").on("click", (t) => {
        const a = t.currentTarget.dataset.targetId;
        a && (this.draftTarget = null, this.selectedTargetId = a, this.render(!1));
      }), n.find(".ps-integrity-slider").on("input", (t) => {
        n.find(".ps-integrity-value").text(t.currentTarget.value);
      });
    }
    async _handleAction(n) {
      var l;
      n.preventDefault(), n.stopPropagation();
      const t = n.currentTarget, a = t.dataset.action, i = t.dataset.targetId ?? ((l = t.closest("[data-target-id]")) == null ? void 0 : l.dataset.targetId) ?? this.selectedTargetId;
      if (a === "new-manual") return this._startManualTarget();
      if (a === "save-target") return this._saveForm(t.closest("form"));
      if (a === "delete-target") return this._deleteTarget(i);
      if (a === "scan-selected") return j({ radius: Number(game.settings.get(r, "defaultScanRadius")), mode: t.dataset.mode || this._getCurrentMode() });
      if (a === "toggle-placement") return this._togglePlacement();
      if (a === "set-placement-shape") return this._setPlacementShape(t.dataset.shape);
      if (a === "reveal-target") return this._revealTarget(i);
      if (a === "reveal-latest") return this._revealLatest();
      if (a === "hide-target") return this._hideTarget(i);
      if (a === "toggle-resolved") return this._toggleResolved(i);
    }
    _startManualTarget() {
      var t;
      const n = Pe();
      this.draftTarget = x({ sceneId: (t = canvas.scene) == null ? void 0 : t.id, ...n, label: "New Scan Target" }), this.selectedTargetId = null, this.render(!1), window.setTimeout(() => {
        var i, l, u;
        const a = (u = (l = (i = this.element) == null ? void 0 : i.find) == null ? void 0 : l.call(i, "form.pulse-scanner-target-form")) == null ? void 0 : u[0];
        a && (a.elements.x.value = n.x, a.elements.y.value = n.y, a.elements.label.focus(), a.elements.label.select());
      }, 20);
    }
    async _saveForm(n) {
      var l, u;
      if (!n) return;
      const t = new FormData(n), a = Object.fromEntries(t.entries()), i = {
        ...a,
        sceneId: (l = canvas.scene) == null ? void 0 : l.id,
        x: a.x,
        y: a.y,
        radius: a.radius,
        integrity: a.integrity,
        difficulty: a.difficulty
      };
      if (a.id && O((u = canvas.scene) == null ? void 0 : u.id).some((f) => f.id === a.id))
        await k(a.id, i), this.selectedTargetId = a.id;
      else {
        const f = await Y(i);
        this.selectedTargetId = (f == null ? void 0 : f.id) ?? this.selectedTargetId;
      }
      this.draftTarget = null, this.render(!1);
    }
    _getCurrentMode() {
      var t, a, i, l, u;
      const n = (i = (a = (t = this.element) == null ? void 0 : t.find) == null ? void 0 : a.call(t, "form.pulse-scanner-target-form")) == null ? void 0 : i[0];
      return ((u = (l = n == null ? void 0 : n.elements) == null ? void 0 : l.mode) == null ? void 0 : u.value) || Ee;
    }
    _togglePlacement() {
      ee(), this.render(!1);
    }
    _setPlacementShape(n) {
      Fe(n), this.render(!1);
    }
    async _revealTarget(n) {
      n && (await W(n), this.render(!1));
    }
    async _revealLatest() {
      await ae(), this.render(!1);
    }
    async _hideTarget(n) {
      n && (await re(n), this.render(!1));
    }
    async _toggleResolved(n) {
      var a;
      if (!n) return;
      const t = S((a = canvas.scene) == null ? void 0 : a.id).find((i) => i.id === n);
      (t == null ? void 0 : t.status) === "resolved" ? await ie(n) : await se(n), this.render(!1);
    }
    _openImportDialog() {
      new Dialog({
        title: "Import Pulse Scanner Targets",
        content: `<form><textarea name="json" rows="12" style="width:100%;" placeholder='{"targets":[]}'></textarea></form>`,
        buttons: {
          import: {
            icon: '<i class="fa-solid fa-file-import"></i>',
            label: "Import",
            callback: (t) => le(t.find("textarea[name='json']").val())
          },
          cancel: {
            label: "Cancel"
          }
        },
        default: "import"
      }, {
        width: 520,
        classes: ["pulse-scanner", "pulse-scanner-import-dialog"]
      }).render(!0);
    }
    async _deleteTarget(n) {
      var t, a, i;
      n && (await te(n, (t = canvas.scene) == null ? void 0 : t.id), this.selectedTargetId = ((i = O((a = canvas.scene) == null ? void 0 : a.id)[0]) == null ? void 0 : i.id) ?? null, this.draftTarget = null, this.render(!1));
    }
  }
  function Pe() {
    var e, n;
    return on() ?? s.lastMouseScenePosition ?? { x: Math.round(((e = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : e.width) / 2 || 0), y: Math.round(((n = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : n.height) / 2 || 0) };
  }
})();
