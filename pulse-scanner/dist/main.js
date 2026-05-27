function tn(s) {
  return s.shape === "rectangle" ? Math.hypot(Number(s.width || 0), Number(s.height || 0)) / 2 : Number(s.radius || 0);
}
function tt(s, d, l, m) {
  return Math.hypot(s.x - l.x, s.y - l.y) <= Number(d) + Number(m);
}
function rt(s, d, l) {
  const m = Math.max(0, Number(l.width || 0) / 2), h = Math.max(0, Number(l.height || 0) / 2), w = Number(l.x) - m, I = Number(l.x) + m, _ = Number(l.y) - h, o = Number(l.y) + h, Z = Math.max(w, Math.min(s.x, I)), ee = Math.max(_, Math.min(s.y, o));
  return Math.hypot(s.x - Z, s.y - ee) <= Number(d);
}
function at(s, d, l) {
  return l.shape === "rectangle" ? rt(s, d, l) : tt(s, d, l, Number(l.radius || 0));
}
function st(s, d, l, m, h) {
  return s.status === "resolved" || m != null && m.size && !m.has(String(s.type)) || h != null && h.size && !h.has(String(s.mode)) ? !1 : at(d, l, s);
}
const j = "structural", ge = "breakable", q = "circle", Q = [
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
], rn = ["gm", "revealed", "always"], an = ["active", "revealed", "resolved"], he = ["circle", "rectangle"], k = ["structural", "arcane", "thermal", "forensic", "tech", "biological"], K = {
  structural: { label: "Structural", color: "#ffb347", icon: "fa-solid fa-building-shield", types: ["breakable", "hidden"] },
  arcane: { label: "Arcane", color: "#c77dff", icon: "fa-solid fa-wand-sparkles", types: ["magic", "hidden", "custom"] },
  thermal: { label: "Thermal", color: "#ff4d6d", icon: "fa-solid fa-temperature-high", types: ["trap", "biological", "radiation"] },
  forensic: { label: "Forensic", color: "#f7f7f2", icon: "fa-solid fa-fingerprint", types: ["evidence", "loot", "biological"] },
  tech: { label: "Tech", color: "#39ffb6", icon: "fa-solid fa-microchip", types: ["tech", "radiation", "hidden"] },
  biological: { label: "Biological", color: "#8fd14f", icon: "fa-solid fa-dna", types: ["biological", "evidence"] }
}, v = {
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
}, me = [
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
function it(s) {
  return s && typeof s == "object" ? s : {};
}
function R(s, d) {
  const l = Number(s);
  return Number.isFinite(l) ? l : d;
}
function ot(s, d, l) {
  return Math.max(d, Math.min(l, s));
}
function ct(s) {
  return String(s || "").replace(/[-_]/g, " ").replace(/\b\w/g, (d) => d.toUpperCase());
}
function sn(s) {
  return k.find((d) => {
    var l, m;
    return (m = (l = K[d]) == null ? void 0 : l.types) == null ? void 0 : m.includes(s);
  }) ?? j;
}
function on(s, d) {
  const l = String(s || d || "").trim();
  return l.startsWith("#") ? l.toLowerCase() : l;
}
function lt(s = {}, d = {}) {
  var o;
  const l = it(s), m = Q.includes(l.type) ? l.type : ge, h = v[m] ?? v.custom, w = k.includes(l.mode) ? l.mode : sn(m), I = he.includes(l.shape) ? l.shape : q, _ = an.includes(l.status) ? l.status : l.resolved ? "resolved" : "active";
  return {
    id: String(l.id || ((o = d.createId) == null ? void 0 : o.call(d)) || ""),
    sceneId: String(l.sceneId || d.sceneId || ""),
    x: R(l.x, 0),
    y: R(l.y, 0),
    radius: Math.max(0, R(l.radius, 80)),
    shape: I,
    width: Math.max(0, R(l.width, 160)),
    height: Math.max(0, R(l.height, 160)),
    mode: w,
    type: m,
    label: String(l.label || h.label),
    description: String(l.description || ""),
    integrity: ot(R(l.integrity, 100), 0, 100),
    difficulty: R(l.difficulty, 10),
    visibility: rn.includes(l.visibility) ? l.visibility : "gm",
    status: _,
    color: on(l.color, h.color),
    icon: h.icon
  };
}
function ut(s) {
  if (!Array.isArray(s) || s.length === 0) return null;
  const d = s.map((l) => String(l).trim()).filter((l) => Q.includes(l));
  return d.length ? new Set(d) : null;
}
function dt(s) {
  const l = (Array.isArray(s) ? s : s ? [s] : []).map((m) => String(m).trim()).filter((m) => k.includes(m));
  return l.length ? new Set(l) : null;
}
function ft(s, d, l, m, h) {
  return st(s, d, l, m, h);
}
function mt(s) {
  return s.visibility === "revealed" || s.visibility === "always";
}
function gt(s, d) {
  var w;
  const l = d && s.visibility === "gm", m = ((w = v[s.type]) == null ? void 0 : w.label) || ct(s.type), h = m.toLowerCase().includes("signature") ? m : `${m} Signature`;
  return {
    ...s,
    label: l ? h : s.label,
    description: l ? "" : s.description,
    integrity: l && s.type !== "breakable" ? null : s.integrity,
    difficulty: l ? null : s.difficulty
  };
}
function ht(s) {
  const d = on(s, "");
  return !d || me.some((l) => l.value === d) ? me : [{ label: `Current (${d})`, value: d }, ...me];
}
function pt(s) {
  if (s.shape === "rectangle") {
    const l = Math.max(10, Number(s.width || 160) / 2), m = Math.max(10, Number(s.height || 160) / 2);
    return [
      { handle: "nw", x: -l, y: -m },
      { handle: "n", x: 0, y: -m },
      { handle: "ne", x: l, y: -m },
      { handle: "e", x: l, y: 0 },
      { handle: "se", x: l, y: m },
      { handle: "s", x: 0, y: m },
      { handle: "sw", x: -l, y: m },
      { handle: "w", x: -l, y: 0 }
    ];
  }
  const d = Math.max(12, Number(s.radius || 80));
  return [
    { handle: "radius-e", x: d, y: 0 },
    { handle: "radius-s", x: 0, y: d },
    { handle: "radius-w", x: -d, y: 0 },
    { handle: "radius-n", x: 0, y: -d }
  ];
}
function yt(s) {
  return s.startsWith("radius") ? "move" : s === "n" || s === "s" ? "ns-resize" : s === "e" || s === "w" ? "ew-resize" : s === "nw" || s === "se" ? "nwse-resize" : s === "ne" || s === "sw" ? "nesw-resize" : "move";
}
function bt(s, d, l) {
  const m = l.x - Number(s.x), h = l.y - Number(s.y);
  if (s.shape === "rectangle") {
    const w = {};
    return (d.includes("e") || d.includes("w")) && (w.width = Math.max(24, Math.round(Math.abs(m) * 2))), (d.includes("n") || d.includes("s")) && (w.height = Math.max(24, Math.round(Math.abs(h) * 2))), w;
  }
  return {
    radius: Math.max(12, Math.round(Math.hypot(m, h)))
  };
}
function vt(s) {
  return Math.max(18, Math.min(tn(s), 80));
}
function St(s, d) {
  return Math.hypot(Number(d.x) - s.x, Number(d.y) - s.y) <= vt(d);
}
(() => {
  var Ze, en;
  const s = "pulse-scanner", d = "Pulse Scanner", l = `module.${s}`, m = `modules/${s}/templates`, h = "targets", w = "isPulseScanner", I = "Pulse Scanner", _ = "icons/tools/scribal/magnifying-glass.webp", o = {
    manager: null,
    lastMouseScenePosition: null,
    mouseTrackingCanvas: null,
    placementActive: !1,
    placementShape: q,
    markerLayer: null,
    markerSceneId: null,
    draggingMarker: null,
    resizingMarker: null,
    liveMarker: null,
    liveUpdates: null,
    latestScan: null,
    sheetObserver: null,
    sheetEnhanceTimeout: null
  }, Z = globalThis.Application ?? ((en = (Ze = foundry.appv1) == null ? void 0 : Ze.api) == null ? void 0 : en.Application);
  Hooks.once("init", async () => {
    ee(), cn(), await loadTemplates([
      `${m}/target-manager.hbs`,
      `${m}/target-form.hbs`
    ]), console.log(`${d} | Initialized`);
  }), Hooks.once("ready", () => {
    var n;
    game.pulseScanner = ln();
    const e = game.modules.get(s);
    e && (e.api = game.pulseScanner), un(), dn(), Se(), (n = game.socket) == null || n.on(l, En), console.log(`${d} | API available at game.pulseScanner`);
  }), Hooks.on("canvasReady", Gn), Hooks.on("canvasReady", Y), Hooks.on("updateScene", (e, n = {}) => {
    var t, r, a;
    o.draggingMarker || o.resizingMarker || e.id === ((t = canvas == null ? void 0 : canvas.scene) == null ? void 0 : t.id) && ((a = (r = n.flags) == null ? void 0 : r[s]) != null && a[h]) && Y();
  });
  function ee() {
    game.settings.register(s, "defaultScanRadius", {
      name: "Default Scan Radius",
      hint: "The default pulse radius in scene pixels.",
      scope: "world",
      config: !0,
      type: Number,
      default: 600
    }), game.settings.register(s, "allowPlayersToScan", {
      name: "Allow Players to Scan",
      hint: "Allow non-GM users to activate scanner pulses from controlled tokens.",
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0
    }), game.settings.register(s, "requireScannerItem", {
      name: "Require Pulse Scanner Item",
      hint: "Require players to have a Pulse Scanner item on the selected token's actor before scanning. GMs can always scan.",
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0
    }), game.settings.register(s, "scannerItemName", {
      name: "Pulse Scanner Item Name",
      hint: "The actor item name players can use to trigger scanner pulses.",
      scope: "world",
      config: !0,
      type: String,
      default: I
    }), game.settings.register(s, "scannerItemMode", {
      name: "Pulse Scanner Item Signal",
      hint: "The scanner mode used when players activate the Pulse Scanner item.",
      scope: "world",
      config: !1,
      type: String,
      default: j
    }), game.settings.register(s, "scannerItemRadiusFeet", {
      name: "Pulse Scanner Item Radius",
      hint: "The Pulse Scanner item range in scene distance units, usually feet.",
      scope: "world",
      config: !1,
      type: Number,
      default: 30
    }), game.settings.register(s, "createWorldScannerItem", {
      name: "Create World Pulse Scanner Item",
      hint: "Create a ready-to-drag Pulse Scanner item in the world Items directory when a GM loads the world.",
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0
    }), game.settings.register(s, "defaultHighlightDuration", {
      name: "Default Highlight Duration",
      hint: "How long detected target highlights remain visible, in milliseconds.",
      scope: "world",
      config: !0,
      type: Number,
      default: 4200
    }), game.settings.register(s, "showIntegrityToPlayers", {
      name: "Show Integrity to Players",
      hint: "Show integrity values on player-visible scan labels for breakable targets.",
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0
    }), game.settings.register(s, "showLabelsToPlayers", {
      name: "Show Labels to Players",
      hint: "Show target labels to players when scan results are revealed.",
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0
    }), game.settings.register(s, "scanSound", {
      name: "Scan Pulse Sound",
      hint: "Optional audio path played when a scanner pulse fires.",
      scope: "world",
      config: !0,
      type: String,
      default: ""
    });
  }
  function cn() {
    Handlebars.registerHelper("psOption", (e, n) => e === n ? "selected" : ""), Handlebars.registerHelper("psFallback", (e, n) => e || n), Handlebars.registerHelper("psEq", (e, n) => e === n), Handlebars.registerHelper("psTypeLabel", (e) => {
      var n;
      return ((n = v[e]) == null ? void 0 : n.label) ?? x(e);
    }), Handlebars.registerHelper("psModeLabel", (e) => {
      var n;
      return ((n = K[e]) == null ? void 0 : n.label) ?? x(e);
    });
  }
  function ln() {
    return {
      openTargetManager: ve,
      scan: re,
      createTarget: se,
      getTargets: W,
      deleteTarget: Me,
      revealTarget: ie,
      revealLatestScan: Ie,
      hideTarget: ke,
      resolveTarget: Pe,
      unresolveTarget: xe,
      exportTargets: In,
      importTargets: Ne,
      togglePlacementTool: be,
      usePulseScannerItem: z,
      createPulseScannerItem: vn,
      hasPulseScannerItem: wn,
      ensureWorldPulseScannerItem: Se,
      createWorldPulseScannerItem: we,
      getPulseScannerItemData: G
    };
  }
  function un() {
    const e = game.modules.get("holosuite-core"), n = e != null && e.active ? e.api : null;
    return n != null && n.registerApp ? (n.registerApp({
      id: s,
      title: "Pulse Scanner",
      icon: "fa-solid fa-wave-square",
      premium: !1,
      featureId: s,
      playerVisible: !1,
      description: "Scan scenes, reveal targets, and manage sensor signatures.",
      open: () => {
        var t;
        return (t = game.user) != null && t.isGM ? ve() : re();
      }
    }), !0) : !1;
  }
  function dn() {
    Hooks.on("renderTokenHUD", fn), Hooks.on("getItemSheetHeaderButtons", mn), Hooks.on("renderItemSheet", pe), Hooks.on("renderItemSheetV2", pe), Hooks.on("renderApplication", X), Hooks.on("renderApplicationV2", X), gn();
  }
  function fn(e, n) {
    var f, g, b, y;
    if (!game.settings.get(s, "allowPlayersToScan") && !((f = game.user) != null && f.isGM)) return;
    const t = (g = e.object) != null && g.document ? e.object : (y = canvas.tokens) == null ? void 0 : y.get((b = e.object) == null ? void 0 : b.id);
    if (!(t != null && t.actor)) return;
    const r = de(t);
    if (!r.length) return;
    const a = r.length > 1 ? "Choose Pulse Scanner" : "Use Pulse Scanner", i = $(`<div class="control-icon pulse-scanner-token-control" title="${a}" data-action="pulse-scanner-scan"><i class="fa-solid fa-wave-square"></i></div>`);
    i.on("click", (p) => {
      p.preventDefault(), p.stopPropagation(), Wn(t).catch((S) => console.error(`${d} | Item scan failed`, S));
    });
    const u = n instanceof jQuery ? n : $(n), c = u.find(".col.right, .right").first();
    c.length ? c.append(i) : u.append(i);
  }
  function mn(e, n) {
    const t = ne(e);
    B(t) && (n.some((r) => r.class === "pulse-scanner-use-item") || n.unshift({
      label: "Scan",
      class: "pulse-scanner-use-item",
      icon: "fas fa-wave-square",
      onclick: () => z({ item: t }).catch((r) => console.error(`${d} | Item scan failed`, r))
    }));
  }
  function pe(e, n) {
    const t = ne(e);
    if (!B(t)) return;
    const r = te(n);
    r && ye(r, t);
  }
  function ye(e, n) {
    if (!e || e.querySelector(".pulse-scanner-item-use")) return;
    const t = document.createElement("button");
    t.type = "button", t.className = "pulse-scanner-item-use", t.innerHTML = '<i class="fa-solid fa-wave-square"></i> Use Pulse Scanner', t.addEventListener("click", (i) => {
      i.preventDefault(), z({ item: n }).catch((u) => console.error(`${d} | Item scan failed`, u));
    });
    const r = e.querySelector(".window-content") ?? e, a = r.querySelector(".sheet-header, header.sheet-header, .item-header");
    a != null && a.parentElement ? a.parentElement.insertBefore(t, a.nextSibling) : r.prepend(t);
  }
  function ne(e) {
    var t;
    const n = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? (e == null ? void 0 : e.item) ?? null;
    return (n == null ? void 0 : n.documentName) === "Item" || ((t = n == null ? void 0 : n.constructor) == null ? void 0 : t.documentName) === "Item" ? n : null;
  }
  function te(e) {
    return e ? e instanceof HTMLElement ? e : Array.isArray(e) ? e.find((n) => n instanceof HTMLElement) ?? null : e[0] instanceof HTMLElement ? e[0] : null : null;
  }
  function X() {
    window.clearTimeout(o.sheetEnhanceTimeout), o.sheetEnhanceTimeout = window.setTimeout(hn, 40);
  }
  function gn() {
    o.sheetObserver || !document.body || (o.sheetObserver = new MutationObserver((e) => {
      e.some((n) => n.addedNodes.length) && X();
    }), o.sheetObserver.observe(document.body, { childList: !0, subtree: !0 }), X());
  }
  function hn() {
    for (const e of pn()) {
      const n = ne(e);
      if (!B(n)) continue;
      const t = yn(e);
      t && ye(t, n);
    }
  }
  function pn() {
    var t;
    const e = [];
    e.push(...Object.values(ui.windows ?? {}));
    const n = (t = foundry.applications) == null ? void 0 : t.instances;
    return n instanceof Map ? e.push(...n.values()) : n && typeof n == "object" && e.push(...Object.values(n)), [...new Set(e)].filter(Boolean);
  }
  function yn(e) {
    return te(e == null ? void 0 : e.element) ?? te(e == null ? void 0 : e._element) ?? document.querySelector(`[data-appid="${e == null ? void 0 : e.appId}"]`) ?? document.querySelector(`[data-application-id="${e == null ? void 0 : e.id}"]`) ?? null;
  }
  function be(e) {
    return A("place scan targets") ? (o.placementActive = typeof e == "boolean" ? e : !o.placementActive, Y(), o.placementActive) : !1;
  }
  function bn(e) {
    return A("place scan targets") ? (o.placementShape = he.includes(e) ? e : q, o.placementActive = !0, E(), o.placementShape) : q;
  }
  function ve() {
    var e;
    return (e = game.user) != null && e.isGM ? (o.manager || (o.manager = new Ke()), o.manager.render(!0), o.manager) : (console.warn(`${d}: only GMs can manage scan targets.`), null);
  }
  async function re(e = {}) {
    var b, y, p, S, T, M, nn;
    if (!(canvas != null && canvas.ready) || !canvas.scene)
      return console.warn(`${d}: no active scene is ready.`), [];
    if (!((b = game.user) != null && b.isGM) && !game.settings.get(s, "allowPlayersToScan"))
      return console.warn(`${d}: players are not allowed to scan in this world.`), [];
    const n = V(e.tokenId);
    if (!n)
      return D("Select a token before using the Pulse Scanner."), [];
    if (!Tn(n, e)) return [];
    const t = Number(e.radius ?? game.settings.get(s, "defaultScanRadius")), r = Nn(e.types), a = Cn(e.modes ?? e.mode), i = We(n), c = P(canvas.scene.id).filter((F) => xn(F, i, t, r, a)), f = Number(e.duration ?? game.settings.get(s, "defaultHighlightDuration"));
    o.latestScan = {
      sceneId: canvas.scene.id,
      targetIds: c.map((F) => F.id),
      timestamp: Date.now()
    };
    const g = $e({
      sceneId: canvas.scene.id,
      origin: i,
      radius: t,
      duration: f,
      detected: c,
      userId: (y = game.user) == null ? void 0 : y.id,
      playerView: !((p = game.user) != null && p.isGM),
      mode: (a == null ? void 0 : a.values().next().value) ?? null
    });
    if (Zn(), Ee(g), (S = game.user) != null && S.isGM && e.revealToPlayers) {
      const F = $e({
        sceneId: canvas.scene.id,
        origin: i,
        radius: t,
        duration: f,
        detected: c,
        userId: (T = game.user) == null ? void 0 : T.id,
        playerView: !0,
        mode: (a == null ? void 0 : a.values().next().value) ?? null
      });
      (M = game.socket) == null || M.emit(l, { action: "scan-results", payload: F });
    }
    return (nn = game.user) != null && nn.isGM ? foundry.utils.deepClone(c) : c.map((F) => oe(F, !0));
  }
  async function z(e = {}) {
    var i, u, c;
    const n = V(e.tokenId) ?? qn(e.item);
    if (!n)
      return D("Select a token with a Pulse Scanner item."), [];
    const t = e.item ?? qe(n, e.scannerItemId) ?? le(n);
    if (!((i = game.user) != null && i.isGM) && !t && Te(e))
      return D("This token needs a Pulse Scanner item before it can scan."), [];
    const r = ((u = t == null ? void 0 : t.getFlag) == null ? void 0 : u.call(t, s, "scan")) ?? {}, a = r.radiusFeet != null ? Sn(r.radiusFeet) : r.radius;
    return re({
      ...r,
      ...e,
      radius: e.radius ?? a,
      tokenId: n.id ?? ((c = n.document) == null ? void 0 : c.id),
      scannerItemId: (t == null ? void 0 : t.id) ?? e.scannerItemId
    });
  }
  async function vn(e, n = {}) {
    const t = Be(e);
    if (!(t != null && t.createEmbeddedDocuments))
      return D("Select a token actor before creating a Pulse Scanner item."), null;
    const r = ue(t);
    if (r && !n.duplicate) return r;
    const a = {
      ...G(n),
      system: n.system ?? G(n).system
    }, [i] = await t.createEmbeddedDocuments("Item", [a]);
    return i ?? null;
  }
  async function Se(e = {}) {
    var r, a, i, u, c;
    if (!((r = game.user) != null && r.isGM) || !game.items || !e.force && !game.settings.get(s, "createWorldScannerItem")) return null;
    const n = Array.from(game.items).find((f) => B(f));
    if (n && !e.duplicate) return n;
    const t = G(e);
    try {
      const f = await Item.create(t, { renderSheet: !1 });
      return e.silent || (i = (a = ui.notifications) == null ? void 0 : a.info) == null || i.call(a, `${d}: created the Pulse Scanner item in the Items sidebar.`), f;
    } catch (f) {
      return console.error(`${d} | Could not create world Pulse Scanner item`, f), (c = (u = ui.notifications) == null ? void 0 : u.warn) == null || c.call(u, `${d}: could not create the world item. Check the browser console for details.`), null;
    }
  }
  async function we(e = {}) {
    var t, r, a, i, u;
    if (!((t = game.user) != null && t.isGM) || !game.items) return null;
    const n = G(e);
    try {
      const c = await Item.create(n, { renderSheet: !1 });
      return e.silent || (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, `${d}: created ${c.name} in the Items sidebar.`), c;
    } catch (c) {
      return console.error(`${d} | Could not create scanner item`, c), (u = (i = ui.notifications) == null ? void 0 : i.warn) == null || u.call(i, `${d}: could not create the scanner item. Check the browser console for details.`), null;
    }
  }
  function G(e = {}) {
    const n = J(e.radiusFeet ?? game.settings.get(s, "scannerItemRadiusFeet"), 30), t = k.includes(e.mode) ? e.mode : ae();
    return {
      name: e.name || fe(),
      type: e.type || Vn(),
      img: e.img || _,
      flags: {
        [s]: {
          [w]: !0,
          scan: {
            radiusFeet: n,
            mode: t
          }
        }
      },
      system: e.system ?? {}
    };
  }
  function ae() {
    const e = game.settings.get(s, "scannerItemMode");
    return k.includes(e) ? e : j;
  }
  function Sn(e) {
    var r, a, i, u, c, f, g;
    const n = Number(((a = (r = canvas == null ? void 0 : canvas.scene) == null ? void 0 : r.grid) == null ? void 0 : a.distance) ?? ((i = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : i.distance) ?? 5) || 5, t = Number(((u = canvas == null ? void 0 : canvas.grid) == null ? void 0 : u.size) ?? ((f = (c = canvas == null ? void 0 : canvas.scene) == null ? void 0 : c.grid) == null ? void 0 : f.size) ?? ((g = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : g.size) ?? 100) || 100;
    return Math.max(0, J(e, 30)) * t / n;
  }
  function wn(e) {
    return !!(le(V((e == null ? void 0 : e.id) ?? e)) ?? ue(Be(e)));
  }
  function Tn(e, n = {}) {
    var t;
    return (t = game.user) != null && t.isGM || !Te(n) || le(e) ? !0 : (D("This token needs a Pulse Scanner item before it can scan."), !1);
  }
  function Te(e = {}) {
    return e.requireItem === !1 ? !1 : !!game.settings.get(s, "requireScannerItem");
  }
  async function se(e = {}) {
    if (!A("create scan targets")) return null;
    const n = O(e.sceneId) ?? canvas.scene;
    if (!n)
      return console.warn(`${d}: no scene was found for the new target.`), null;
    const t = L(n), r = C({ ...e, sceneId: n.id });
    return t[r.id] = r, await n.setFlag(s, h, t), E(), foundry.utils.deepClone(r);
  }
  function W(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    return P(e).filter((t) => {
      var r;
      return ((r = game.user) == null ? void 0 : r.isGM) || mt(t);
    }).map((t) => {
      var r;
      return (r = game.user) != null && r.isGM ? foundry.utils.deepClone(t) : oe(t, !0);
    });
  }
  function P(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    const t = O(e);
    return t ? Object.values(L(t)).map((r) => C(r)).sort((r, a) => r.label.localeCompare(a.label)) : [];
  }
  async function Me(e, n = ((t) => (t = canvas == null ? void 0 : canvas.scene) == null ? void 0 : t.id)()) {
    if (!A("delete scan targets")) return !1;
    o.draggingMarker = null, o.resizingMarker = null, o.liveMarker = null, o.liveUpdates = null;
    const r = O(n) ?? Ye(e);
    if (!r)
      return console.warn(`${d}: target "${e}" was not found.`), !1;
    const a = L(r), i = Mn(a, e);
    if (!i)
      return console.warn(`${d}: target "${e}" was not found on ${r.name}.`), !1;
    delete a[i], await r.update({ [`flags.${s}.${h}.-=${i}`]: null });
    const u = r.getFlag(s, h) ?? {};
    (u[i] || Object.values(u).some((f) => (f == null ? void 0 : f.id) === e)) && (await r.unsetFlag(s, h), Object.keys(a).length && await r.setFlag(s, h, a));
    const c = r.getFlag(s, h) ?? {};
    return c[i] || Object.values(c).some((f) => (f == null ? void 0 : f.id) === e) ? (console.error(`${d} | Delete failed`, { targetId: e, storeKey: i, scene: r, store: a, afterFallback: c }), !1) : (E(), !0);
  }
  function Mn(e, n) {
    var t;
    return e[n] ? n : ((t = Object.entries(e).find(([, r]) => (r == null ? void 0 : r.id) === n)) == null ? void 0 : t[0]) ?? null;
  }
  async function ie(e) {
    var t;
    const n = P((t = canvas.scene) == null ? void 0 : t.id).find((r) => r.id === e);
    return n ? N(e, { visibility: "revealed", status: n.status === "resolved" ? "resolved" : "revealed" }) : null;
  }
  async function Ie() {
    var n;
    if (!A("reveal scan targets")) return [];
    if (!o.latestScan || o.latestScan.sceneId !== ((n = canvas.scene) == null ? void 0 : n.id))
      return console.warn(`${d}: no latest scan is available for this scene.`), [];
    const e = [];
    for (const t of o.latestScan.targetIds) {
      const r = await ie(t);
      r && e.push(r);
    }
    return e;
  }
  async function ke(e) {
    return N(e, { visibility: "gm", status: "active" });
  }
  async function Pe(e) {
    return N(e, { status: "resolved", visibility: "revealed" });
  }
  async function xe(e) {
    return N(e, { status: "active", visibility: "gm" });
  }
  function In(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    var a, i;
    const t = O(e);
    if (!t) return null;
    const r = {
      module: s,
      version: ((i = (a = game.modules) == null ? void 0 : a.get(s)) == null ? void 0 : i.version) ?? "0.1.0",
      sceneId: t.id,
      sceneName: t.name,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      targets: P(t.id)
    };
    return et(`pulse-scanner-${nt(t.name)}.json`, r), r;
  }
  async function Ne(e, { merge: n = !0, sceneId: t = ((r) => (r = canvas == null ? void 0 : canvas.scene) == null ? void 0 : r.id)() } = {}) {
    if (!A("import scan targets")) return [];
    const a = O(t);
    if (!a) return [];
    let i;
    try {
      i = typeof e == "string" ? JSON.parse(e) : e;
    } catch (g) {
      return console.error(`${d} | Import failed`, g), [];
    }
    const u = Array.isArray(i) ? i : i == null ? void 0 : i.targets;
    if (!Array.isArray(u))
      return console.warn(`${d}: import JSON must contain a targets array.`), [];
    const c = n ? L(a) : {}, f = u.map((g) => C({
      ...g,
      id: g.id && !c[g.id] ? g.id : Ve(),
      sceneId: a.id
    }));
    for (const g of f) c[g.id] = g;
    return await a.setFlag(s, h, c), E(), f;
  }
  async function N(e, n = {}, t = {}) {
    if (!A("edit scan targets")) return null;
    const r = Ye(e) ?? O(n.sceneId) ?? canvas.scene;
    if (!r) return null;
    const a = L(r), i = a[e] ?? {}, u = C({ ...i, ...n, id: e, sceneId: r.id });
    return a[u.id] = u, await r.setFlag(s, h, a), t.refresh !== !1 && E(), foundry.utils.deepClone(u);
  }
  function L(e) {
    return foundry.utils.deepClone((e == null ? void 0 : e.getFlag(s, h)) ?? {});
  }
  function C(e = {}) {
    var n;
    return lt(e, {
      createId: Ve,
      sceneId: ((n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id) || ""
    });
  }
  function kn(e) {
    return sn(e);
  }
  function Pn(e) {
    return ht(e);
  }
  function xn(e, n, t, r, a) {
    return ft(e, n, t, r, a);
  }
  function Nn(e) {
    return ut(e);
  }
  function Cn(e) {
    return dt(e);
  }
  function Ce(e) {
    return tn(e);
  }
  function $e({ sceneId: e, origin: n, radius: t, duration: r, detected: a, userId: i, playerView: u, mode: c }) {
    return {
      sceneId: e,
      origin: n,
      radius: t,
      duration: r,
      userId: i,
      playerView: u,
      mode: c,
      showLabels: u ? !!game.settings.get(s, "showLabelsToPlayers") : !0,
      showIntegrity: u ? !!game.settings.get(s, "showIntegrityToPlayers") : !0,
      detected: a.map((f) => oe(f, u))
    };
  }
  function oe(e, n) {
    return gt(e, n);
  }
  function Ee(e = {}) {
    var i, u, c, f, g, b, y;
    if (!(canvas != null && canvas.ready) || e.sceneId !== ((i = canvas.scene) == null ? void 0 : i.id)) return;
    const n = document.createElement("div");
    n.className = "pulse-scanner-overlay", n.dataset.cameraLocked = "true", n.style.setProperty("--pulse-duration", `${Math.max(900, Number(e.duration || 4200))}ms`), document.body.appendChild(n);
    const t = Ge(((u = e.origin) == null ? void 0 : u.x) ?? 0, ((c = e.origin) == null ? void 0 : c.y) ?? 0), r = Math.max(16, Ue(Number(e.radius || 0))), a = document.createElement("div");
    if (a.className = "pulse-scanner-ring", a.style.left = `${t.x}px`, a.style.top = `${t.y}px`, a.style.setProperty("--pulse-radius", `${r}px`), a.style.setProperty("--pulse-color", ((f = K[e.mode]) == null ? void 0 : f.color) ?? "#7df9ff"), n.appendChild(a), !((g = e.detected) != null && g.length)) {
      const p = document.createElement("div");
      p.className = "pulse-scanner-empty", p.textContent = "NO SIGNATURES DETECTED", p.style.left = `${t.x}px`, p.style.top = `${t.y}px`, n.appendChild(p);
    }
    for (const p of e.detected ?? []) {
      const S = Ge(p.x, p.y), T = document.createElement("div");
      if (T.className = `pulse-scanner-target pulse-scanner-target-${p.type}`, T.style.left = `${S.x}px`, T.style.top = `${S.y}px`, T.style.setProperty("--target-color", p.color || ((b = v[p.type]) == null ? void 0 : b.color) || v.custom.color), T.style.setProperty("--target-size", `${Math.max(28, Ue(Ce(p) || 80) * 2)}px`), n.appendChild(T), e.showLabels) {
        const M = document.createElement("div");
        M.className = "pulse-scanner-label", M.style.left = `${S.x}px`, M.style.top = `${S.y}px`, M.style.setProperty("--target-color", p.color || ((y = v[p.type]) == null ? void 0 : y.color) || v.custom.color), M.innerHTML = $n(p, e.showIntegrity), n.appendChild(M);
      }
    }
    window.setTimeout(() => n.remove(), Math.max(900, Number(e.duration || 4200)) + 650);
  }
  function $n(e, n) {
    var g, b, y;
    const t = e.icon || ((g = v[e.type]) == null ? void 0 : g.icon) || v.custom.icon, r = H(e.label || ((b = v[e.type]) == null ? void 0 : b.label) || "Signature"), a = H(((y = v[e.type]) == null ? void 0 : y.label) || x(e.type)), i = Kn(Number(e.integrity ?? 0), 0, 100), u = e.type === "breakable", c = n && u ? `<span class="pulse-scanner-integrity">${i}%</span>` : "", f = n && u ? `<div class="pulse-scanner-integrity-bar"><span style="width: ${i}%;"></span></div><small>STRUCTURAL WEAKNESS: ${i}%</small>` : `<small>${a}</small>`;
    return `<span class="pulse-scanner-label-row"><i class="${H(t)}"></i><strong>${r}</strong>${c}</span>${f}`;
  }
  function En(e = {}) {
    var n, t;
    if (e.action === "scan-results") {
      if (((n = e.payload) == null ? void 0 : n.userId) === ((t = game.user) == null ? void 0 : t.id)) return;
      Ee(e.payload);
    }
  }
  function Y() {
    var r, a, i;
    if (!(canvas != null && canvas.ready) || !canvas.scene || !globalThis.PIXI) return;
    (r = o.markerLayer) != null && r.parent && o.markerLayer.parent.removeChild(o.markerLayer), (i = (a = o.markerLayer) == null ? void 0 : a.destroy) == null || i.call(a, { children: !0 });
    const e = canvas.interface ?? canvas.foreground ?? canvas.stage;
    if (!(e != null && e.addChild)) return;
    const n = new PIXI.Container();
    n.name = "pulse-scanner-target-markers", n.sortableChildren = !0, n.zIndex = 250, e.addChild(n), o.markerLayer = n, o.markerSceneId = canvas.scene.id;
    const t = P(canvas.scene.id).filter((u) => An(u));
    for (const u of t) n.addChild(Fn(u));
  }
  function An(e) {
    var n;
    return (n = game.user) != null && n.isGM ? !0 : e.visibility === "revealed" || e.visibility === "always";
  }
  function Fn(e) {
    var u, c, f;
    const n = new PIXI.Container();
    n.name = `pulse-scanner-target-${e.id}`, n.position.set(Number(e.x), Number(e.y)), n.eventMode = "none", n.interactive = !1, n.zIndex = e.status === "resolved" ? 1 : 5;
    const t = Je(e), r = new PIXI.Graphics();
    Ae(r, e, t), n.addChild(r), (u = game.user) != null && u.isGM && Re(n, e, t);
    const a = Fe(e, t);
    (c = game.user) != null && c.isGM && n.addChild(a);
    const i = new PIXI.Text(e.status === "resolved" ? `${e.label} [resolved]` : e.label, {
      fontFamily: "Arial",
      fontSize: 13,
      fill: 16777215,
      stroke: 0,
      strokeThickness: 3
    });
    return i.anchor.set(0.5, 1), i.position.set(0, -Math.max(28, Ce(e) + 8)), i.alpha = (f = game.user) != null && f.isGM ? 0.95 : 0.78, n.addChild(i), n;
  }
  function Ae(e, n, t) {
    const r = n.status === "resolved" ? 0.14 : n.visibility === "revealed" ? 0.2 : 0.1;
    e.clear(), e.lineStyle(2, t, n.status === "resolved" ? 0.42 : 0.82), e.beginFill(t, r), n.shape === "rectangle" ? e.drawRoundedRect(-n.width / 2, -n.height / 2, n.width, n.height, 8) : e.drawCircle(0, 0, Math.max(8, Number(n.radius || 80))), e.endFill(), e.lineStyle(1, t, 0.52), e.drawCircle(0, 0, 14);
  }
  function Fe(e, n) {
    const t = new PIXI.Graphics();
    return t.name = `pulse-scanner-move-${e.id}`, t.eventMode = "static", t.interactive = !0, t.cursor = "move", t.hitArea = new PIXI.Circle(0, 0, 13), t.lineStyle(2, 16777215, 0.78), t.beginFill(n, 0.82), t.drawCircle(0, 0, 9), t.endFill(), t.lineStyle(1, 1053204, 0.9), t.moveTo(-5, 0), t.lineTo(5, 0), t.moveTo(0, -5), t.lineTo(0, 5), t.on("pointerdown", (r) => Dn(r, e, t.parent)).on("pointermove", (r) => On(r, e)).on("pointerup", () => ce()).on("pointerupoutside", () => ce()).on("rightclick", () => {
      o.manager = o.manager ?? new Ke({ targetId: e.id }), o.manager.selectedTargetId = e.id, o.manager.render(!0);
    }), t;
  }
  function Re(e, n, t) {
    pt(n).forEach(({ handle: r, x: a, y: i }) => e.addChild(Rn(n, r, a, i, t)));
  }
  function Rn(e, n, t, r, a) {
    const i = new PIXI.Graphics();
    return i.name = `pulse-scanner-resize-${e.id}-${n}`, i.position.set(t, r), i.eventMode = "static", i.interactive = !0, i.cursor = Ln(n), i.hitArea = new PIXI.Circle(0, 0, 12), i.beginFill(1053204, 0.92), i.lineStyle(2, a, 1), i.drawCircle(0, 0, 7), i.endFill(), i.on("pointerdown", (u) => zn(u, e, n)), i;
  }
  function zn(e, n, t) {
    var r, a, i;
    (r = game.user) != null && r.isGM && ((a = e.stopPropagation) == null || a.call(e), o.resizingMarker = {
      id: n.id,
      handle: t,
      center: { x: Number(n.x), y: Number(n.y) }
    }, o.liveMarker = ((i = e.currentTarget) == null ? void 0 : i.parent) ?? null, o.liveUpdates = null);
  }
  function Ln(e) {
    return yt(e);
  }
  function Dn(e, n, t) {
    var r, a;
    (r = game.user) != null && r.isGM && ((a = e.stopPropagation) == null || a.call(e), o.draggingMarker = {
      id: n.id,
      start: ze(e),
      origin: { x: Number(n.x), y: Number(n.y) }
    }, o.liveMarker = t ?? null, o.liveUpdates = null);
  }
  function On(e, n) {
    !o.draggingMarker || o.draggingMarker.id !== n.id || Le(ze(e));
  }
  function ze(e) {
    var r, a;
    const n = (r = e.data) == null ? void 0 : r.originalEvent;
    if ((n == null ? void 0 : n.clientX) != null && (n == null ? void 0 : n.clientY) != null) return U(n.clientX, n.clientY);
    const t = e.global ?? ((a = e.data) == null ? void 0 : a.global);
    if (!t) return null;
    try {
      const i = canvas.stage.worldTransform.applyInverse(new PIXI.Point(t.x, t.y));
      return { x: Math.round(i.x), y: Math.round(i.y) };
    } catch {
      return null;
    }
  }
  async function ce() {
    if (!o.draggingMarker) return !1;
    const e = o.draggingMarker.id, n = o.liveUpdates;
    return o.draggingMarker = null, o.liveMarker = null, o.liveUpdates = null, n && await N(e, n, { refresh: !1 }), E(), !0;
  }
  function Le(e) {
    if (!o.draggingMarker || !(canvas != null && canvas.scene)) return !1;
    if (!e || !o.draggingMarker.start) return !0;
    const n = e.x - o.draggingMarker.start.x, t = e.y - o.draggingMarker.start.y, r = Math.round(o.draggingMarker.origin.x + n), a = Math.round(o.draggingMarker.origin.y + t);
    return o.liveMarker && o.liveMarker.position.set(r, a), o.liveUpdates = { x: r, y: a }, !0;
  }
  function Hn(e, n) {
    if (!o.resizingMarker || !(canvas != null && canvas.scene)) return !1;
    const t = U(e, n);
    if (!t) return !0;
    const r = P(canvas.scene.id).find((i) => i.id === o.resizingMarker.id);
    if (!r) return !0;
    const a = bt(r, o.resizingMarker.handle, t);
    if (o.liveUpdates = a, o.liveMarker) {
      o.liveMarker.removeChildren();
      const i = C({ ...r, ...a }), u = Je(i), c = new PIXI.Graphics();
      Ae(c, i, u), o.liveMarker.addChild(c), Re(o.liveMarker, i, u), o.liveMarker.addChild(Fe(i, u));
    }
    return !0;
  }
  async function _n() {
    if (!o.resizingMarker) return !1;
    const e = o.resizingMarker.id, n = o.liveUpdates;
    return o.resizingMarker = null, o.liveMarker = null, o.liveUpdates = null, n && await N(e, n, { refresh: !1 }), E(), !0;
  }
  function Gn() {
    var n;
    const e = (n = canvas == null ? void 0 : canvas.app) == null ? void 0 : n.view;
    !e || o.mouseTrackingCanvas === e || (o.mouseTrackingCanvas && (o.mouseTrackingCanvas.removeEventListener("mousemove", De), o.mouseTrackingCanvas.removeEventListener("pointerdown", Oe), o.mouseTrackingCanvas.removeEventListener("pointermove", He), o.mouseTrackingCanvas.removeEventListener("pointerup", _e)), e.addEventListener("mousemove", De), e.addEventListener("pointerdown", Oe), e.addEventListener("pointermove", He), e.addEventListener("pointerup", _e), o.mouseTrackingCanvas = e);
  }
  function De(e) {
    o.lastMouseScenePosition = U(e.clientX, e.clientY);
  }
  async function Oe(e) {
    var a;
    if (!o.placementActive || !((a = game.user) != null && a.isGM) || !(canvas != null && canvas.scene) || o.resizingMarker || o.draggingMarker || e.button !== 0) return;
    const n = U(e.clientX, e.clientY);
    if (!n || jn(n)) return;
    e.preventDefault(), e.stopPropagation();
    const t = Bn(), r = await se({
      sceneId: canvas.scene.id,
      x: n.x,
      y: n.y,
      mode: t.mode,
      type: t.type,
      label: t.label,
      visibility: "gm",
      shape: Un(),
      radius: 80,
      width: 160,
      height: 160
    });
    o.manager && (o.manager.selectedTargetId = (r == null ? void 0 : r.id) ?? o.manager.selectedTargetId, o.manager.draftTarget = null, o.manager.render(!0));
  }
  function He(e) {
    !o.resizingMarker && !o.draggingMarker || (e.preventDefault(), o.draggingMarker && Le(U(e.clientX, e.clientY)), o.resizingMarker && Hn(e.clientX, e.clientY));
  }
  function _e(e) {
    !o.resizingMarker && !o.draggingMarker || (e.preventDefault(), o.draggingMarker && ce().catch((n) => console.error(`${d} | Move failed`, n)), o.resizingMarker && _n().catch((n) => console.error(`${d} | Resize failed`, n)));
  }
  function Un() {
    return he.includes(o.placementShape) ? o.placementShape : q;
  }
  function Bn() {
    var a, i, u, c, f, g, b, y, p, S;
    const e = (c = (u = (i = (a = o.manager) == null ? void 0 : a.element) == null ? void 0 : i.find) == null ? void 0 : u.call(i, "form.pulse-scanner-target-form")) == null ? void 0 : c[0], n = (g = (f = e == null ? void 0 : e.elements) == null ? void 0 : f.type) == null ? void 0 : g.value, t = (y = (b = e == null ? void 0 : e.elements) == null ? void 0 : b.mode) == null ? void 0 : y.value, r = (S = (p = e == null ? void 0 : e.elements) == null ? void 0 : p.label) == null ? void 0 : S.value;
    return {
      type: Q.includes(n) ? n : ge,
      mode: k.includes(t) ? t : kn(n || ge),
      label: r || "Placed Scan Target"
    };
  }
  function jn(e) {
    var n;
    return P((n = canvas.scene) == null ? void 0 : n.id).some((t) => St(e, t));
  }
  function Ge(e, n) {
    try {
      const t = canvas.stage.worldTransform.apply(new PIXI.Point(Number(e), Number(n))), r = canvas.app.view.getBoundingClientRect();
      return { x: r.left + t.x, y: r.top + t.y };
    } catch {
      return { x: Number(e), y: Number(n) };
    }
  }
  function U(e, n) {
    try {
      const t = canvas.app.view.getBoundingClientRect(), r = canvas.stage.worldTransform.applyInverse(new PIXI.Point(e - t.left, n - t.top));
      return { x: Math.round(r.x), y: Math.round(r.y) };
    } catch {
      return null;
    }
  }
  function Ue(e) {
    var t, r;
    const n = ((r = (t = canvas == null ? void 0 : canvas.stage) == null ? void 0 : t.scale) == null ? void 0 : r.x) ?? 1;
    return Number(e) * n;
  }
  function V(e) {
    var n, t, r, a, i;
    return e ? ((n = canvas.tokens) == null ? void 0 : n.get(e)) ?? ((r = (t = canvas.tokens) == null ? void 0 : t.placeables) == null ? void 0 : r.find((u) => {
      var c;
      return u.id === e || ((c = u.document) == null ? void 0 : c.id) === e;
    })) : ((i = (a = canvas.tokens) == null ? void 0 : a.controlled) == null ? void 0 : i[0]) ?? null;
  }
  function qn(e) {
    var r, a, i, u;
    const n = e == null ? void 0 : e.actor;
    if (!n) return null;
    const t = (a = (r = canvas.tokens) == null ? void 0 : r.controlled) == null ? void 0 : a.find((c) => {
      var f;
      return ((f = c.actor) == null ? void 0 : f.id) === n.id;
    });
    return t || (((u = (i = canvas.tokens) == null ? void 0 : i.placeables) == null ? void 0 : u.find((c) => {
      var f;
      return ((f = c.actor) == null ? void 0 : f.id) === n.id && Xn(c);
    })) ?? null);
  }
  function Xn(e) {
    var n, t;
    return !!(e != null && e.isOwner || (n = e == null ? void 0 : e.document) != null && n.isOwner || (t = e == null ? void 0 : e.actor) != null && t.isOwner);
  }
  function Be(e) {
    var n, t, r, a, i, u;
    if (!e) return ((r = (t = (n = canvas.tokens) == null ? void 0 : n.controlled) == null ? void 0 : t[0]) == null ? void 0 : r.actor) ?? ((a = game.user) == null ? void 0 : a.character) ?? null;
    if (e.actor) return e.actor;
    if ((i = e.document) != null && i.actor) return e.document.actor;
    if (e.items) return e;
    if (typeof e == "string") {
      const c = V(e);
      return (c == null ? void 0 : c.actor) ?? ((u = game.actors) == null ? void 0 : u.get(e)) ?? null;
    }
    return null;
  }
  function le(e) {
    return e != null && e.actor ? ue(e.actor) : null;
  }
  function ue(e) {
    return je(e)[0] ?? null;
  }
  function de(e) {
    return e != null && e.actor ? je(e.actor) : [];
  }
  function je(e) {
    return Array.from((e == null ? void 0 : e.items) ?? []).filter((t) => B(t));
  }
  function qe(e, n) {
    return n ? de(e).find((t) => t.id === n) ?? null : null;
  }
  async function Wn(e) {
    var i, u, c, f;
    const n = de(e), t = e.id ?? ((i = e.document) == null ? void 0 : i.id);
    if (!n.length)
      return D("This token needs a Pulse Scanner item before it can scan."), [];
    if (n.length === 1) return z({ tokenId: t, item: n[0] });
    const r = globalThis.Dialog ?? ((f = (c = (u = globalThis.foundry) == null ? void 0 : u.appv1) == null ? void 0 : c.api) == null ? void 0 : f.Dialog);
    if (!r) return z({ tokenId: t, item: n[0] });
    const a = n.map((g, b) => {
      const y = Yn(g), p = b === 0 ? "checked" : "";
      return `
        <label class="pulse-scanner-choice">
          <input type="radio" name="pulseScannerItemId" value="${H(g.id)}" ${p}>
          <span>
            <strong>${H(g.name)}</strong>
            <small>${H(x(y.mode))} / ${Number(y.radiusFeet)} ft</small>
          </span>
        </label>
      `;
    }).join("");
    return new Promise((g) => {
      new r({
        title: "Choose Pulse Scanner",
        content: `<form class="pulse-scanner-choice-dialog">${a}</form>`,
        buttons: {
          scan: {
            icon: '<i class="fa-solid fa-wave-square"></i>',
            label: "Scan",
            callback: async (b) => {
              var T, M;
              const y = (b == null ? void 0 : b[0]) ?? b, p = (M = (T = y == null ? void 0 : y.querySelector) == null ? void 0 : T.call(y, "[name='pulseScannerItemId']:checked")) == null ? void 0 : M.value, S = qe(e, p) ?? n[0];
              g(await z({ tokenId: t, item: S }));
            }
          },
          cancel: {
            label: "Cancel",
            callback: () => g([])
          }
        },
        default: "scan",
        close: () => g([])
      }, {
        classes: ["pulse-scanner", "pulse-scanner-choice-window"],
        width: 360
      }).render(!0);
    });
  }
  function Yn(e) {
    var t;
    const n = ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, s, "scan")) ?? {};
    return {
      mode: k.includes(n.mode) ? n.mode : ae(),
      radiusFeet: J(n.radiusFeet, game.settings.get(s, "scannerItemRadiusFeet"))
    };
  }
  function B(e) {
    var n;
    return e ? (n = e.getFlag) != null && n.call(e, s, w) ? !0 : Xe(e.name) === Xe(fe()) : !1;
  }
  function fe() {
    return String(game.settings.get(s, "scannerItemName") || I).trim() || I;
  }
  function Xe(e) {
    return String(e || "").trim().toLowerCase();
  }
  function Vn() {
    var t, r;
    const e = ((r = (t = game.system) == null ? void 0 : t.documentTypes) == null ? void 0 : r.Item) ?? [], n = Array.isArray(e) ? e : e instanceof Set ? Array.from(e) : e && typeof e == "object" ? Object.keys(e) : [];
    return n.includes("equipment") ? "equipment" : n.includes("tool") ? "tool" : n.includes("gear") ? "gear" : n.includes("loot") ? "loot" : n[0] ?? "item";
  }
  function D(e) {
    var n, t;
    (t = (n = ui.notifications) == null ? void 0 : n.warn) == null || t.call(n, e), console.warn(`${d}: ${e}`);
  }
  function We(e) {
    var a, i;
    if (e.center) return { x: e.center.x, y: e.center.y };
    const n = e.document ?? e, t = Number(n.width ?? 1) * Number(((a = canvas.grid) == null ? void 0 : a.size) ?? 100), r = Number(n.height ?? 1) * Number(((i = canvas.grid) == null ? void 0 : i.size) ?? 100);
    return { x: Number(n.x ?? e.x ?? 0) + t / 2, y: Number(n.y ?? e.y ?? 0) + r / 2 };
  }
  function Jn() {
    var n, t;
    const e = (t = (n = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : n.controlled) == null ? void 0 : t[0];
    return e ? We(e) : null;
  }
  function O(e) {
    var n;
    return e ? ((n = game.scenes) == null ? void 0 : n.get(e)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
  }
  function Ye(e) {
    for (const n of game.scenes ?? [])
      if (L(n)[e]) return n;
    return null;
  }
  function E() {
    var e;
    (e = o.manager) != null && e.rendered && o.manager.render(!1), !o.draggingMarker && !o.resizingMarker && Y();
  }
  function A(e) {
    var n;
    return (n = game.user) != null && n.isGM ? !0 : (console.warn(`${d}: only GMs can ${e}.`), !1);
  }
  function Ve() {
    var e, n;
    return ((n = (e = foundry.utils).randomID) == null ? void 0 : n.call(e, 16)) ?? crypto.randomUUID();
  }
  function x(e) {
    return String(e || "").replace(/[-_]/g, " ").replace(/\b\w/g, (n) => n.toUpperCase());
  }
  function J(e, n) {
    const t = Number(e);
    return Number.isFinite(t) ? t : n;
  }
  function Kn(e, n, t) {
    return Math.max(n, Math.min(t, e));
  }
  function Qn(e) {
    const n = String(e).trim().replace("#", ""), t = Number.parseInt(n.length === 3 ? n.split("").map((r) => `${r}${r}`).join("") : n, 16);
    return Number.isFinite(t) ? t : 8255999;
  }
  function Je(e) {
    var n;
    return e.status === "resolved" ? 8095116 : Qn(e.color || ((n = v[e.type]) == null ? void 0 : n.color) || v.custom.color);
  }
  function Zn() {
    var t, r;
    const e = String(game.settings.get(s, "scanSound") || "").trim();
    if (!e) return;
    const n = globalThis.AudioHelper ?? ((t = foundry.audio) == null ? void 0 : t.AudioHelper);
    (r = n == null ? void 0 : n.play) == null || r.call(n, { src: e, volume: 0.65, autoplay: !0, loop: !1 }, !0);
  }
  function et(e, n) {
    const t = new Blob([JSON.stringify(n, null, 2)], { type: "application/json" }), r = URL.createObjectURL(t), a = document.createElement("a");
    a.href = r, a.download = e, a.click(), URL.revokeObjectURL(r);
  }
  function nt(e) {
    return String(e || "scene").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "scene";
  }
  function H(e) {
    return String(e ?? "").replace(/[&<>"']/g, (n) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[n]);
  }
  class Ke extends Z {
    constructor(n = {}) {
      super(n), this.selectedTargetId = n.targetId ?? null, this.draftTarget = null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "pulse-scanner-target-manager",
        title: "Pulse Scanner Target Manager",
        template: `${m}/target-manager.hbs`,
        classes: ["pulse-scanner", "pulse-scanner-manager"],
        width: 900,
        height: "auto",
        resizable: !0
      });
    }
    getData() {
      var u;
      const n = (canvas == null ? void 0 : canvas.scene) ?? ((u = game.scenes) == null ? void 0 : u.current) ?? null, t = W(n == null ? void 0 : n.id), r = t.map((c) => ({
        ...c,
        isResolved: c.status === "resolved",
        isBreakable: c.type === "breakable"
      })), a = this.draftTarget ?? t.find((c) => c.id === this.selectedTargetId) ?? t[0] ?? C({ sceneId: n == null ? void 0 : n.id, ...Qe() }), i = {
        ...a,
        isBreakable: a.type === "breakable"
      };
      return !this.draftTarget && !this.selectedTargetId && t[0] && (this.selectedTargetId = t[0].id), {
        scene: n,
        targets: r,
        selectedTarget: i,
        typeOptions: Q.map((c) => {
          var f;
          return { value: c, label: ((f = v[c]) == null ? void 0 : f.label) ?? x(c) };
        }),
        modeOptions: k.map((c) => {
          var f;
          return { value: c, label: ((f = K[c]) == null ? void 0 : f.label) ?? x(c) };
        }),
        colorOptions: Pn(a.color),
        visibilityOptions: rn.map((c) => ({ value: c, label: x(c) })),
        statusOptions: an.map((c) => ({ value: c, label: x(c) })),
        hasTargets: t.length > 0,
        canUseMouse: !!o.lastMouseScenePosition,
        placementActive: o.placementActive,
        placementShape: o.placementShape,
        placementCircle: o.placementShape === "circle",
        placementRectangle: o.placementShape === "rectangle",
        scannerItem: {
          name: fe(),
          mode: ae(),
          radiusFeet: game.settings.get(s, "scannerItemRadiusFeet")
        }
      };
    }
    activateListeners(n) {
      super.activateListeners(n), n.find("[data-action]").on("click", (t) => this._handleAction(t)), n.find("form.pulse-scanner-target-form").on("submit", (t) => {
        t.preventDefault(), this._saveForm(t.currentTarget);
      }), n.find(".pulse-scanner-target-card").on("click", (t) => {
        const r = t.currentTarget.dataset.targetId;
        r && (this.draftTarget = null, this.selectedTargetId = r, this.render(!1));
      }), n.find(".ps-integrity-slider").on("input", (t) => {
        n.find(".ps-integrity-value").text(t.currentTarget.value);
      });
    }
    async _handleAction(n) {
      var i;
      n.preventDefault(), n.stopPropagation();
      const t = n.currentTarget, r = t.dataset.action, a = t.dataset.targetId ?? ((i = t.closest("[data-target-id]")) == null ? void 0 : i.dataset.targetId) ?? this.selectedTargetId;
      if (r === "new-manual") return this._startManualTarget();
      if (r === "save-target") return this._saveForm(t.closest("form"));
      if (r === "create-scanner-item-config") return this._createScannerItemConfig(t.closest("form"));
      if (r === "delete-target") return this._deleteTarget(a);
      if (r === "toggle-placement") return this._togglePlacement();
      if (r === "set-placement-shape") return this._setPlacementShape(t.dataset.shape);
      if (r === "reveal-target") return this._revealTarget(a);
      if (r === "hide-target") return this._hideTarget(a);
      if (r === "toggle-resolved") return this._toggleResolved(a);
    }
    _startManualTarget() {
      var t;
      const n = Qe();
      this.draftTarget = C({ sceneId: (t = canvas.scene) == null ? void 0 : t.id, ...n, label: "New Scan Target" }), this.selectedTargetId = null, this.render(!1), window.setTimeout(() => {
        var a, i, u;
        const r = (u = (i = (a = this.element) == null ? void 0 : a.find) == null ? void 0 : i.call(a, "form.pulse-scanner-target-form")) == null ? void 0 : u[0];
        r && (r.elements.x.value = n.x, r.elements.y.value = n.y, r.elements.label.focus(), r.elements.label.select());
      }, 20);
    }
    async _saveForm(n) {
      var i, u;
      if (!n) return;
      const t = new FormData(n), r = Object.fromEntries(t.entries()), a = {
        ...r,
        sceneId: (i = canvas.scene) == null ? void 0 : i.id,
        x: r.x,
        y: r.y,
        radius: r.radius,
        integrity: r.integrity
      };
      if (r.id && W((u = canvas.scene) == null ? void 0 : u.id).some((c) => c.id === r.id))
        await N(r.id, a), this.selectedTargetId = r.id;
      else {
        const c = await se(a);
        this.selectedTargetId = (c == null ? void 0 : c.id) ?? this.selectedTargetId;
      }
      this.draftTarget = null, this.render(!1);
    }
    async _createScannerItemConfig(n) {
      if (!n) return;
      const t = new FormData(n), r = String(t.get("scannerItemName") || I).trim() || I, a = k.includes(t.get("scannerItemMode")) ? t.get("scannerItemMode") : j, i = Math.max(0, J(t.get("scannerItemRadiusFeet"), 30));
      await game.settings.set(s, "scannerItemName", r), await game.settings.set(s, "scannerItemMode", a), await game.settings.set(s, "scannerItemRadiusFeet", i), await we({ name: r, mode: a, radiusFeet: i }), this.render(!1);
    }
    _getCurrentMode() {
      var t, r, a, i, u;
      const n = (a = (r = (t = this.element) == null ? void 0 : t.find) == null ? void 0 : r.call(t, "form.pulse-scanner-target-form")) == null ? void 0 : a[0];
      return ((u = (i = n == null ? void 0 : n.elements) == null ? void 0 : i.mode) == null ? void 0 : u.value) || j;
    }
    _togglePlacement() {
      be(), this.render(!1);
    }
    _setPlacementShape(n) {
      bn(n), this.render(!1);
    }
    async _revealTarget(n) {
      n && (await ie(n), this.render(!1));
    }
    async _revealLatest() {
      await Ie(), this.render(!1);
    }
    async _hideTarget(n) {
      n && (await ke(n), this.render(!1));
    }
    async _toggleResolved(n) {
      var r;
      if (!n) return;
      const t = P((r = canvas.scene) == null ? void 0 : r.id).find((a) => a.id === n);
      (t == null ? void 0 : t.status) === "resolved" ? await xe(n) : await Pe(n), this.render(!1);
    }
    _openImportDialog() {
      new Dialog({
        title: "Import Pulse Scanner Targets",
        content: `<form><textarea name="json" rows="12" style="width:100%;" placeholder='{"targets":[]}'></textarea></form>`,
        buttons: {
          import: {
            icon: '<i class="fa-solid fa-file-import"></i>',
            label: "Import",
            callback: (t) => Ne(t.find("textarea[name='json']").val())
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
      var t, r, a;
      n && (await Me(n, (t = canvas.scene) == null ? void 0 : t.id), this.selectedTargetId = ((a = W((r = canvas.scene) == null ? void 0 : r.id)[0]) == null ? void 0 : a.id) ?? null, this.draftTarget = null, this.render(!1));
    }
  }
  function Qe() {
    var e, n;
    return Jn() ?? o.lastMouseScenePosition ?? { x: Math.round(((e = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : e.width) / 2 || 0), y: Math.round(((n = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : n.height) / 2 || 0) };
  }
})();
