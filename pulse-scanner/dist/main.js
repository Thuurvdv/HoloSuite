function Ze(s) {
  return s.shape === "rectangle" ? Math.hypot(Number(s.width || 0), Number(s.height || 0)) / 2 : Number(s.radius || 0);
}
function Kn(s, d, c, m) {
  return Math.hypot(s.x - c.x, s.y - c.y) <= Number(d) + Number(m);
}
function Qn(s, d, c) {
  const m = Math.max(0, Number(c.width || 0) / 2), g = Math.max(0, Number(c.height || 0) / 2), S = Number(c.x) - m, M = Number(c.x) + m, O = Number(c.y) - g, o = Number(c.y) + g, Q = Math.max(S, Math.min(s.x, M)), Z = Math.max(O, Math.min(s.y, o));
  return Math.hypot(s.x - Q, s.y - Z) <= Number(d);
}
function Zn(s, d, c) {
  return c.shape === "rectangle" ? Qn(s, d, c) : Kn(s, d, c, Number(c.radius || 0));
}
function et(s, d, c, m, g) {
  return s.status === "resolved" || m != null && m.size && !m.has(String(s.type)) || g != null && g.size && !g.has(String(s.mode)) ? !1 : Zn(d, c, s);
}
const U = "structural", fe = "breakable", B = "circle", K = [
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
], en = ["gm", "revealed", "always"], nn = ["active", "revealed", "resolved"], me = ["circle", "rectangle"], P = ["structural", "arcane", "thermal", "forensic", "tech", "biological"], J = {
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
}, de = [
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
function nt(s) {
  return s && typeof s == "object" ? s : {};
}
function z(s, d) {
  const c = Number(s);
  return Number.isFinite(c) ? c : d;
}
function tt(s, d, c) {
  return Math.max(d, Math.min(c, s));
}
function rt(s) {
  return String(s || "").replace(/[-_]/g, " ").replace(/\b\w/g, (d) => d.toUpperCase());
}
function tn(s) {
  return P.find((d) => {
    var c, m;
    return (m = (c = J[d]) == null ? void 0 : c.types) == null ? void 0 : m.includes(s);
  }) ?? U;
}
function rn(s, d) {
  const c = String(s || d || "").trim();
  return c.startsWith("#") ? c.toLowerCase() : c;
}
function at(s = {}, d = {}) {
  var o;
  const c = nt(s), m = K.includes(c.type) ? c.type : fe, g = y[m] ?? y.custom, S = P.includes(c.mode) ? c.mode : tn(m), M = me.includes(c.shape) ? c.shape : B, O = nn.includes(c.status) ? c.status : c.resolved ? "resolved" : "active";
  return {
    id: String(c.id || ((o = d.createId) == null ? void 0 : o.call(d)) || ""),
    sceneId: String(c.sceneId || d.sceneId || ""),
    x: z(c.x, 0),
    y: z(c.y, 0),
    radius: Math.max(0, z(c.radius, 80)),
    shape: M,
    width: Math.max(0, z(c.width, 160)),
    height: Math.max(0, z(c.height, 160)),
    mode: S,
    type: m,
    label: String(c.label || g.label),
    description: String(c.description || ""),
    integrity: tt(z(c.integrity, 100), 0, 100),
    difficulty: z(c.difficulty, 10),
    visibility: en.includes(c.visibility) ? c.visibility : "gm",
    status: O,
    color: rn(c.color, g.color),
    icon: g.icon
  };
}
function st(s) {
  if (!Array.isArray(s) || s.length === 0) return null;
  const d = s.map((c) => String(c).trim()).filter((c) => K.includes(c));
  return d.length ? new Set(d) : null;
}
function it(s) {
  const c = (Array.isArray(s) ? s : s ? [s] : []).map((m) => String(m).trim()).filter((m) => P.includes(m));
  return c.length ? new Set(c) : null;
}
function ot(s, d, c, m, g) {
  return et(s, d, c, m, g);
}
function lt(s) {
  return s.visibility === "revealed" || s.visibility === "always";
}
function ct(s, d) {
  var S;
  const c = d && s.visibility === "gm", m = ((S = y[s.type]) == null ? void 0 : S.label) || rt(s.type), g = m.toLowerCase().includes("signature") ? m : `${m} Signature`;
  return {
    ...s,
    label: c ? g : s.label,
    description: c ? "" : s.description,
    integrity: c && s.type !== "breakable" ? null : s.integrity,
    difficulty: c ? null : s.difficulty
  };
}
function ut(s) {
  const d = rn(s, "");
  return !d || de.some((c) => c.value === d) ? de : [{ label: `Current (${d})`, value: d }, ...de];
}
function dt(s) {
  if (s.shape === "rectangle") {
    const c = Math.max(10, Number(s.width || 160) / 2), m = Math.max(10, Number(s.height || 160) / 2);
    return [
      { handle: "nw", x: -c, y: -m },
      { handle: "n", x: 0, y: -m },
      { handle: "ne", x: c, y: -m },
      { handle: "e", x: c, y: 0 },
      { handle: "se", x: c, y: m },
      { handle: "s", x: 0, y: m },
      { handle: "sw", x: -c, y: m },
      { handle: "w", x: -c, y: 0 }
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
function ft(s) {
  return s.startsWith("radius") ? "move" : s === "n" || s === "s" ? "ns-resize" : s === "e" || s === "w" ? "ew-resize" : s === "nw" || s === "se" ? "nwse-resize" : s === "ne" || s === "sw" ? "nesw-resize" : "move";
}
function mt(s, d, c) {
  const m = c.x - Number(s.x), g = c.y - Number(s.y);
  if (s.shape === "rectangle") {
    const S = {};
    return (d.includes("e") || d.includes("w")) && (S.width = Math.max(24, Math.round(Math.abs(m) * 2))), (d.includes("n") || d.includes("s")) && (S.height = Math.max(24, Math.round(Math.abs(g) * 2))), S;
  }
  return {
    radius: Math.max(12, Math.round(Math.hypot(m, g)))
  };
}
function gt(s) {
  return Math.max(18, Math.min(Ze(s), 80));
}
function ht(s, d) {
  return Math.hypot(Number(d.x) - s.x, Number(d.y) - s.y) <= gt(d);
}
(() => {
  var Je, Ke;
  const s = "pulse-scanner", d = "Pulse Scanner", c = `module.${s}`, m = `modules/${s}/templates`, g = "targets", S = "isPulseScanner", M = "Pulse Scanner", O = "icons/tools/scribal/magnifying-glass.webp", o = {
    manager: null,
    lastMouseScenePosition: null,
    mouseTrackingCanvas: null,
    placementActive: !1,
    placementShape: B,
    markerLayer: null,
    markerSceneId: null,
    draggingMarker: null,
    resizingMarker: null,
    liveMarker: null,
    liveUpdates: null,
    latestScan: null,
    sheetObserver: null,
    sheetEnhanceTimeout: null
  }, Q = globalThis.Application ?? ((Ke = (Je = foundry.appv1) == null ? void 0 : Je.api) == null ? void 0 : Ke.Application);
  Hooks.once("init", async () => {
    Z(), an(), await loadTemplates([
      `${m}/target-manager.hbs`,
      `${m}/target-form.hbs`
    ]), console.log(`${d} | Initialized`);
  }), Hooks.once("ready", () => {
    var n;
    game.pulseScanner = sn();
    const e = game.modules.get(s);
    e && (e.api = game.pulseScanner), on(), ln(), be(), (n = game.socket) == null || n.on(c, Nn), console.log(`${d} | API available at game.pulseScanner`);
  }), Hooks.on("canvasReady", Dn), Hooks.on("canvasReady", W), Hooks.on("updateScene", (e, n = {}) => {
    var t, r, a;
    o.draggingMarker || o.resizingMarker || e.id === ((t = canvas == null ? void 0 : canvas.scene) == null ? void 0 : t.id) && ((a = (r = n.flags) == null ? void 0 : r[s]) != null && a[g]) && W();
  });
  function Z() {
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
      default: M
    }), game.settings.register(s, "scannerItemMode", {
      name: "Pulse Scanner Item Signal",
      hint: "The scanner mode used when players activate the Pulse Scanner item.",
      scope: "world",
      config: !1,
      type: String,
      default: U
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
  function an() {
    Handlebars.registerHelper("psOption", (e, n) => e === n ? "selected" : ""), Handlebars.registerHelper("psFallback", (e, n) => e || n), Handlebars.registerHelper("psEq", (e, n) => e === n), Handlebars.registerHelper("psTypeLabel", (e) => {
      var n;
      return ((n = y[e]) == null ? void 0 : n.label) ?? A(e);
    }), Handlebars.registerHelper("psModeLabel", (e) => {
      var n;
      return ((n = J[e]) == null ? void 0 : n.label) ?? A(e);
    });
  }
  function sn() {
    return {
      openTargetManager: ye,
      scan: te,
      createTarget: re,
      getTargets: X,
      deleteTarget: Me,
      revealTarget: ae,
      revealLatestScan: Te,
      hideTarget: Ie,
      resolveTarget: ke,
      unresolveTarget: Pe,
      exportTargets: wn,
      importTargets: xe,
      togglePlacementTool: pe,
      usePulseScannerItem: q,
      createPulseScannerItem: pn,
      hasPulseScannerItem: bn,
      ensureWorldPulseScannerItem: be,
      createWorldPulseScannerItem: ve,
      getPulseScannerItemData: D
    };
  }
  function on() {
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
        return (t = game.user) != null && t.isGM ? ye() : te();
      }
    }), !0) : !1;
  }
  function ln() {
    Hooks.on("renderTokenHUD", cn), Hooks.on("getItemSheetHeaderButtons", un), Hooks.on("renderItemSheet", ge), Hooks.on("renderItemSheetV2", ge), Hooks.on("renderApplication", j), Hooks.on("renderApplicationV2", j), dn();
  }
  function cn(e, n) {
    var l, f, h, b;
    if (!game.settings.get(s, "allowPlayersToScan") && !((l = game.user) != null && l.isGM)) return;
    const t = (f = e.object) != null && f.document ? e.object : (b = canvas.tokens) == null ? void 0 : b.get((h = e.object) == null ? void 0 : h.id);
    if (!(t != null && t.actor) || !!!V(t)) return;
    const a = $('<div class="control-icon pulse-scanner-token-control" title="Use Pulse Scanner" data-action="pulse-scanner-scan"><i class="fa-solid fa-wave-square"></i></div>');
    a.on("click", (v) => {
      var p;
      v.preventDefault(), v.stopPropagation(), q({ tokenId: t.id ?? ((p = t.document) == null ? void 0 : p.id) }).catch((w) => console.error(`${d} | Item scan failed`, w));
    });
    const i = n instanceof jQuery ? n : $(n), u = i.find(".col.right, .right").first();
    u.length ? u.append(a) : i.append(a);
  }
  function un(e, n) {
    const t = ee(e);
    _(t) && (n.some((r) => r.class === "pulse-scanner-use-item") || n.unshift({
      label: "Scan",
      class: "pulse-scanner-use-item",
      icon: "fas fa-wave-square",
      onclick: () => q({ item: t }).catch((r) => console.error(`${d} | Item scan failed`, r))
    }));
  }
  function ge(e, n) {
    const t = ee(e);
    if (!_(t)) return;
    const r = ne(n);
    r && he(r, t);
  }
  function he(e, n) {
    if (!e || e.querySelector(".pulse-scanner-item-use")) return;
    const t = document.createElement("button");
    t.type = "button", t.className = "pulse-scanner-item-use", t.innerHTML = '<i class="fa-solid fa-wave-square"></i> Use Pulse Scanner', t.addEventListener("click", (i) => {
      i.preventDefault(), q({ item: n }).catch((u) => console.error(`${d} | Item scan failed`, u));
    });
    const r = e.querySelector(".window-content") ?? e, a = r.querySelector(".sheet-header, header.sheet-header, .item-header");
    a != null && a.parentElement ? a.parentElement.insertBefore(t, a.nextSibling) : r.prepend(t);
  }
  function ee(e) {
    var t;
    const n = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? (e == null ? void 0 : e.item) ?? null;
    return (n == null ? void 0 : n.documentName) === "Item" || ((t = n == null ? void 0 : n.constructor) == null ? void 0 : t.documentName) === "Item" ? n : null;
  }
  function ne(e) {
    return e ? e instanceof HTMLElement ? e : Array.isArray(e) ? e.find((n) => n instanceof HTMLElement) ?? null : e[0] instanceof HTMLElement ? e[0] : null : null;
  }
  function j() {
    window.clearTimeout(o.sheetEnhanceTimeout), o.sheetEnhanceTimeout = window.setTimeout(fn, 40);
  }
  function dn() {
    o.sheetObserver || !document.body || (o.sheetObserver = new MutationObserver((e) => {
      e.some((n) => n.addedNodes.length) && j();
    }), o.sheetObserver.observe(document.body, { childList: !0, subtree: !0 }), j());
  }
  function fn() {
    for (const e of mn()) {
      const n = ee(e);
      if (!_(n)) continue;
      const t = gn(e);
      t && he(t, n);
    }
  }
  function mn() {
    var t;
    const e = [];
    e.push(...Object.values(ui.windows ?? {}));
    const n = (t = foundry.applications) == null ? void 0 : t.instances;
    return n instanceof Map ? e.push(...n.values()) : n && typeof n == "object" && e.push(...Object.values(n)), [...new Set(e)].filter(Boolean);
  }
  function gn(e) {
    return ne(e == null ? void 0 : e.element) ?? ne(e == null ? void 0 : e._element) ?? document.querySelector(`[data-appid="${e == null ? void 0 : e.appId}"]`) ?? document.querySelector(`[data-application-id="${e == null ? void 0 : e.id}"]`) ?? null;
  }
  function pe(e) {
    return E("place scan targets") ? (o.placementActive = typeof e == "boolean" ? e : !o.placementActive, W(), o.placementActive) : !1;
  }
  function hn(e) {
    return E("place scan targets") ? (o.placementShape = me.includes(e) ? e : B, o.placementActive = !0, C(), o.placementShape) : B;
  }
  function ye() {
    var e;
    return (e = game.user) != null && e.isGM ? (o.manager || (o.manager = new Ye()), o.manager.render(!0), o.manager) : (console.warn(`${d}: only GMs can manage scan targets.`), null);
  }
  async function te(e = {}) {
    var b, v, p, w, T, I, Qe;
    if (!(canvas != null && canvas.ready) || !canvas.scene)
      return console.warn(`${d}: no active scene is ready.`), [];
    if (!((b = game.user) != null && b.isGM) && !game.settings.get(s, "allowPlayersToScan"))
      return console.warn(`${d}: players are not allowed to scan in this world.`), [];
    const n = Y(e.tokenId);
    if (!n)
      return G("Select a token before using the Pulse Scanner."), [];
    if (!vn(n, e)) return [];
    const t = Number(e.radius ?? game.settings.get(s, "defaultScanRadius")), r = kn(e.types), a = Pn(e.modes ?? e.mode), i = je(n), l = k(canvas.scene.id).filter((F) => In(F, i, t, r, a)), f = Number(e.duration ?? game.settings.get(s, "defaultHighlightDuration"));
    o.latestScan = {
      sceneId: canvas.scene.id,
      targetIds: l.map((F) => F.id),
      timestamp: Date.now()
    };
    const h = Ce({
      sceneId: canvas.scene.id,
      origin: i,
      radius: t,
      duration: f,
      detected: l,
      userId: (v = game.user) == null ? void 0 : v.id,
      playerView: !((p = game.user) != null && p.isGM),
      mode: (a == null ? void 0 : a.values().next().value) ?? null
    });
    if (Yn(), $e(h), (w = game.user) != null && w.isGM && e.revealToPlayers) {
      const F = Ce({
        sceneId: canvas.scene.id,
        origin: i,
        radius: t,
        duration: f,
        detected: l,
        userId: (T = game.user) == null ? void 0 : T.id,
        playerView: !0,
        mode: (a == null ? void 0 : a.values().next().value) ?? null
      });
      (I = game.socket) == null || I.emit(c, { action: "scan-results", payload: F });
    }
    return (Qe = game.user) != null && Qe.isGM ? foundry.utils.deepClone(l) : l.map((F) => se(F, !0));
  }
  async function q(e = {}) {
    var i, u, l;
    const n = Y(e.tokenId) ?? Un(e.item);
    if (!n)
      return G("Select a token with a Pulse Scanner item."), [];
    const t = e.item ?? V(n);
    if (!((i = game.user) != null && i.isGM) && !t && we(e))
      return G("This token needs a Pulse Scanner item before it can scan."), [];
    const r = ((u = t == null ? void 0 : t.getFlag) == null ? void 0 : u.call(t, s, "scan")) ?? {}, a = r.radiusFeet != null ? yn(r.radiusFeet) : r.radius;
    return te({
      ...r,
      ...e,
      radius: e.radius ?? a,
      tokenId: n.id ?? ((l = n.document) == null ? void 0 : l.id),
      scannerItemId: (t == null ? void 0 : t.id) ?? e.scannerItemId
    });
  }
  async function pn(e, n = {}) {
    const t = Ue(e);
    if (!(t != null && t.createEmbeddedDocuments))
      return G("Select a token actor before creating a Pulse Scanner item."), null;
    const r = oe(t);
    if (r && !n.duplicate) return r;
    const a = {
      ...D(n),
      system: n.system ?? D(n).system
    }, [i] = await t.createEmbeddedDocuments("Item", [a]);
    return i ?? null;
  }
  async function be(e = {}) {
    var r, a, i, u, l;
    if (!((r = game.user) != null && r.isGM) || !game.items || !e.force && !game.settings.get(s, "createWorldScannerItem")) return null;
    const n = Array.from(game.items).find((f) => _(f));
    if (n && !e.duplicate) return n;
    const t = D(e);
    try {
      const f = await Item.create(t, { renderSheet: !1 });
      return e.silent || (i = (a = ui.notifications) == null ? void 0 : a.info) == null || i.call(a, `${d}: created the Pulse Scanner item in the Items sidebar.`), f;
    } catch (f) {
      return console.error(`${d} | Could not create world Pulse Scanner item`, f), (l = (u = ui.notifications) == null ? void 0 : u.warn) == null || l.call(u, `${d}: could not create the world item. Check the browser console for details.`), null;
    }
  }
  async function ve(e = {}) {
    var t, r, a, i, u;
    if (!((t = game.user) != null && t.isGM) || !game.items) return null;
    const n = D(e);
    try {
      const l = await Item.create(n, { renderSheet: !1 });
      return e.silent || (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, `${d}: created ${l.name} in the Items sidebar.`), l;
    } catch (l) {
      return console.error(`${d} | Could not create scanner item`, l), (u = (i = ui.notifications) == null ? void 0 : i.warn) == null || u.call(i, `${d}: could not create the scanner item. Check the browser console for details.`), null;
    }
  }
  function D(e = {}) {
    const n = ce(e.radiusFeet ?? game.settings.get(s, "scannerItemRadiusFeet"), 30), t = P.includes(e.mode) ? e.mode : Se();
    return {
      name: e.name || le(),
      type: e.type || jn(),
      img: e.img || O,
      flags: {
        [s]: {
          [S]: !0,
          scan: {
            radiusFeet: n,
            mode: t
          }
        }
      },
      system: e.system ?? {}
    };
  }
  function Se() {
    const e = game.settings.get(s, "scannerItemMode");
    return P.includes(e) ? e : U;
  }
  function yn(e) {
    var r, a, i, u, l, f, h;
    const n = Number(((a = (r = canvas == null ? void 0 : canvas.scene) == null ? void 0 : r.grid) == null ? void 0 : a.distance) ?? ((i = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : i.distance) ?? 5) || 5, t = Number(((u = canvas == null ? void 0 : canvas.grid) == null ? void 0 : u.size) ?? ((f = (l = canvas == null ? void 0 : canvas.scene) == null ? void 0 : l.grid) == null ? void 0 : f.size) ?? ((h = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : h.size) ?? 100) || 100;
    return Math.max(0, ce(e, 30)) * t / n;
  }
  function bn(e) {
    return !!(V(Y((e == null ? void 0 : e.id) ?? e)) ?? oe(Ue(e)));
  }
  function vn(e, n = {}) {
    var t;
    return (t = game.user) != null && t.isGM || !we(n) || V(e) ? !0 : (G("This token needs a Pulse Scanner item before it can scan."), !1);
  }
  function we(e = {}) {
    return e.requireItem === !1 ? !1 : !!game.settings.get(s, "requireScannerItem");
  }
  async function re(e = {}) {
    if (!E("create scan targets")) return null;
    const n = L(e.sceneId) ?? canvas.scene;
    if (!n)
      return console.warn(`${d}: no scene was found for the new target.`), null;
    const t = R(n), r = N({ ...e, sceneId: n.id });
    return t[r.id] = r, await n.setFlag(s, g, t), C(), foundry.utils.deepClone(r);
  }
  function X(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    return k(e).filter((t) => {
      var r;
      return ((r = game.user) == null ? void 0 : r.isGM) || lt(t);
    }).map((t) => {
      var r;
      return (r = game.user) != null && r.isGM ? foundry.utils.deepClone(t) : se(t, !0);
    });
  }
  function k(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    const t = L(e);
    return t ? Object.values(R(t)).map((r) => N(r)).sort((r, a) => r.label.localeCompare(a.label)) : [];
  }
  async function Me(e, n = ((t) => (t = canvas == null ? void 0 : canvas.scene) == null ? void 0 : t.id)()) {
    if (!E("delete scan targets")) return !1;
    o.draggingMarker = null, o.resizingMarker = null, o.liveMarker = null, o.liveUpdates = null;
    const r = L(n) ?? qe(e);
    if (!r)
      return console.warn(`${d}: target "${e}" was not found.`), !1;
    const a = R(r), i = Sn(a, e);
    if (!i)
      return console.warn(`${d}: target "${e}" was not found on ${r.name}.`), !1;
    delete a[i], await r.update({ [`flags.${s}.${g}.-=${i}`]: null });
    const u = r.getFlag(s, g) ?? {};
    (u[i] || Object.values(u).some((f) => (f == null ? void 0 : f.id) === e)) && (await r.unsetFlag(s, g), Object.keys(a).length && await r.setFlag(s, g, a));
    const l = r.getFlag(s, g) ?? {};
    return l[i] || Object.values(l).some((f) => (f == null ? void 0 : f.id) === e) ? (console.error(`${d} | Delete failed`, { targetId: e, storeKey: i, scene: r, store: a, afterFallback: l }), !1) : (C(), !0);
  }
  function Sn(e, n) {
    var t;
    return e[n] ? n : ((t = Object.entries(e).find(([, r]) => (r == null ? void 0 : r.id) === n)) == null ? void 0 : t[0]) ?? null;
  }
  async function ae(e) {
    var t;
    const n = k((t = canvas.scene) == null ? void 0 : t.id).find((r) => r.id === e);
    return n ? x(e, { visibility: "revealed", status: n.status === "resolved" ? "resolved" : "revealed" }) : null;
  }
  async function Te() {
    var n;
    if (!E("reveal scan targets")) return [];
    if (!o.latestScan || o.latestScan.sceneId !== ((n = canvas.scene) == null ? void 0 : n.id))
      return console.warn(`${d}: no latest scan is available for this scene.`), [];
    const e = [];
    for (const t of o.latestScan.targetIds) {
      const r = await ae(t);
      r && e.push(r);
    }
    return e;
  }
  async function Ie(e) {
    return x(e, { visibility: "gm", status: "active" });
  }
  async function ke(e) {
    return x(e, { status: "resolved", visibility: "revealed" });
  }
  async function Pe(e) {
    return x(e, { status: "active", visibility: "gm" });
  }
  function wn(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    var a, i;
    const t = L(e);
    if (!t) return null;
    const r = {
      module: s,
      version: ((i = (a = game.modules) == null ? void 0 : a.get(s)) == null ? void 0 : i.version) ?? "0.1.0",
      sceneId: t.id,
      sceneName: t.name,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      targets: k(t.id)
    };
    return Vn(`pulse-scanner-${Jn(t.name)}.json`, r), r;
  }
  async function xe(e, { merge: n = !0, sceneId: t = ((r) => (r = canvas == null ? void 0 : canvas.scene) == null ? void 0 : r.id)() } = {}) {
    if (!E("import scan targets")) return [];
    const a = L(t);
    if (!a) return [];
    let i;
    try {
      i = typeof e == "string" ? JSON.parse(e) : e;
    } catch (h) {
      return console.error(`${d} | Import failed`, h), [];
    }
    const u = Array.isArray(i) ? i : i == null ? void 0 : i.targets;
    if (!Array.isArray(u))
      return console.warn(`${d}: import JSON must contain a targets array.`), [];
    const l = n ? R(a) : {}, f = u.map((h) => N({
      ...h,
      id: h.id && !l[h.id] ? h.id : Xe(),
      sceneId: a.id
    }));
    for (const h of f) l[h.id] = h;
    return await a.setFlag(s, g, l), C(), f;
  }
  async function x(e, n = {}, t = {}) {
    if (!E("edit scan targets")) return null;
    const r = qe(e) ?? L(n.sceneId) ?? canvas.scene;
    if (!r) return null;
    const a = R(r), i = a[e] ?? {}, u = N({ ...i, ...n, id: e, sceneId: r.id });
    return a[u.id] = u, await r.setFlag(s, g, a), t.refresh !== !1 && C(), foundry.utils.deepClone(u);
  }
  function R(e) {
    return foundry.utils.deepClone((e == null ? void 0 : e.getFlag(s, g)) ?? {});
  }
  function N(e = {}) {
    var n;
    return at(e, {
      createId: Xe,
      sceneId: ((n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id) || ""
    });
  }
  function Mn(e) {
    return tn(e);
  }
  function Tn(e) {
    return ut(e);
  }
  function In(e, n, t, r, a) {
    return ot(e, n, t, r, a);
  }
  function kn(e) {
    return st(e);
  }
  function Pn(e) {
    return it(e);
  }
  function Ne(e) {
    return Ze(e);
  }
  function Ce({ sceneId: e, origin: n, radius: t, duration: r, detected: a, userId: i, playerView: u, mode: l }) {
    return {
      sceneId: e,
      origin: n,
      radius: t,
      duration: r,
      userId: i,
      playerView: u,
      mode: l,
      showLabels: u ? !!game.settings.get(s, "showLabelsToPlayers") : !0,
      showIntegrity: u ? !!game.settings.get(s, "showIntegrityToPlayers") : !0,
      detected: a.map((f) => se(f, u))
    };
  }
  function se(e, n) {
    return ct(e, n);
  }
  function $e(e = {}) {
    var i, u, l, f, h, b, v;
    if (!(canvas != null && canvas.ready) || e.sceneId !== ((i = canvas.scene) == null ? void 0 : i.id)) return;
    const n = document.createElement("div");
    n.className = "pulse-scanner-overlay", n.style.setProperty("--pulse-duration", `${Math.max(900, Number(e.duration || 4200))}ms`), document.body.appendChild(n);
    const t = _e(((u = e.origin) == null ? void 0 : u.x) ?? 0, ((l = e.origin) == null ? void 0 : l.y) ?? 0), r = Math.max(16, Ge(Number(e.radius || 0))), a = document.createElement("div");
    if (a.className = "pulse-scanner-ring", a.style.left = `${t.x}px`, a.style.top = `${t.y}px`, a.style.setProperty("--pulse-radius", `${r}px`), a.style.setProperty("--pulse-color", ((f = J[e.mode]) == null ? void 0 : f.color) ?? "#7df9ff"), n.appendChild(a), !((h = e.detected) != null && h.length)) {
      const p = document.createElement("div");
      p.className = "pulse-scanner-empty", p.textContent = "NO SIGNATURES DETECTED", p.style.left = `${t.x}px`, p.style.top = `${t.y}px`, n.appendChild(p);
    }
    for (const p of e.detected ?? []) {
      const w = _e(p.x, p.y), T = document.createElement("div");
      if (T.className = `pulse-scanner-target pulse-scanner-target-${p.type}`, T.style.left = `${w.x}px`, T.style.top = `${w.y}px`, T.style.setProperty("--target-color", p.color || ((b = y[p.type]) == null ? void 0 : b.color) || y.custom.color), T.style.setProperty("--target-size", `${Math.max(28, Ge(Ne(p) || 80) * 2)}px`), n.appendChild(T), e.showLabels) {
        const I = document.createElement("div");
        I.className = "pulse-scanner-label", I.style.left = `${w.x}px`, I.style.top = `${w.y}px`, I.style.setProperty("--target-color", p.color || ((v = y[p.type]) == null ? void 0 : v.color) || y.custom.color), I.innerHTML = xn(p, e.showIntegrity), n.appendChild(I);
      }
    }
    window.setTimeout(() => n.remove(), Math.max(900, Number(e.duration || 4200)) + 650);
  }
  function xn(e, n) {
    var h, b, v;
    const t = e.icon || ((h = y[e.type]) == null ? void 0 : h.icon) || y.custom.icon, r = ue(e.label || ((b = y[e.type]) == null ? void 0 : b.label) || "Signature"), a = ue(((v = y[e.type]) == null ? void 0 : v.label) || A(e.type)), i = Xn(Number(e.integrity ?? 0), 0, 100), u = e.type === "breakable", l = n && u ? `<span class="pulse-scanner-integrity">${i}%</span>` : "", f = n && u ? `<div class="pulse-scanner-integrity-bar"><span style="width: ${i}%;"></span></div><small>STRUCTURAL WEAKNESS: ${i}%</small>` : `<small>${a}</small>`;
    return `<span class="pulse-scanner-label-row"><i class="${ue(t)}"></i><strong>${r}</strong>${l}</span>${f}`;
  }
  function Nn(e = {}) {
    var n, t;
    if (e.action === "scan-results") {
      if (((n = e.payload) == null ? void 0 : n.userId) === ((t = game.user) == null ? void 0 : t.id)) return;
      $e(e.payload);
    }
  }
  function W() {
    var r, a, i;
    if (!(canvas != null && canvas.ready) || !canvas.scene || !globalThis.PIXI) return;
    (r = o.markerLayer) != null && r.parent && o.markerLayer.parent.removeChild(o.markerLayer), (i = (a = o.markerLayer) == null ? void 0 : a.destroy) == null || i.call(a, { children: !0 });
    const e = canvas.interface ?? canvas.foreground ?? canvas.stage;
    if (!(e != null && e.addChild)) return;
    const n = new PIXI.Container();
    n.name = "pulse-scanner-target-markers", n.sortableChildren = !0, n.zIndex = 250, e.addChild(n), o.markerLayer = n, o.markerSceneId = canvas.scene.id;
    const t = k(canvas.scene.id).filter((u) => Cn(u));
    for (const u of t) n.addChild($n(u));
  }
  function Cn(e) {
    var n;
    return (n = game.user) != null && n.isGM ? !0 : e.visibility === "revealed" || e.visibility === "always";
  }
  function $n(e) {
    var u, l, f;
    const n = new PIXI.Container();
    n.name = `pulse-scanner-target-${e.id}`, n.position.set(Number(e.x), Number(e.y)), n.eventMode = "none", n.interactive = !1, n.zIndex = e.status === "resolved" ? 1 : 5;
    const t = We(e), r = new PIXI.Graphics();
    Ee(r, e, t), n.addChild(r), (u = game.user) != null && u.isGM && Fe(n, e, t);
    const a = Ae(e, t);
    (l = game.user) != null && l.isGM && n.addChild(a);
    const i = new PIXI.Text(e.status === "resolved" ? `${e.label} [resolved]` : e.label, {
      fontFamily: "Arial",
      fontSize: 13,
      fill: 16777215,
      stroke: 0,
      strokeThickness: 3
    });
    return i.anchor.set(0.5, 1), i.position.set(0, -Math.max(28, Ne(e) + 8)), i.alpha = (f = game.user) != null && f.isGM ? 0.95 : 0.78, n.addChild(i), n;
  }
  function Ee(e, n, t) {
    const r = n.status === "resolved" ? 0.14 : n.visibility === "revealed" ? 0.2 : 0.1;
    e.clear(), e.lineStyle(2, t, n.status === "resolved" ? 0.42 : 0.82), e.beginFill(t, r), n.shape === "rectangle" ? e.drawRoundedRect(-n.width / 2, -n.height / 2, n.width, n.height, 8) : e.drawCircle(0, 0, Math.max(8, Number(n.radius || 80))), e.endFill(), e.lineStyle(1, t, 0.52), e.drawCircle(0, 0, 14);
  }
  function Ae(e, n) {
    const t = new PIXI.Graphics();
    return t.name = `pulse-scanner-move-${e.id}`, t.eventMode = "static", t.interactive = !0, t.cursor = "move", t.hitArea = new PIXI.Circle(0, 0, 13), t.lineStyle(2, 16777215, 0.78), t.beginFill(n, 0.82), t.drawCircle(0, 0, 9), t.endFill(), t.lineStyle(1, 1053204, 0.9), t.moveTo(-5, 0), t.lineTo(5, 0), t.moveTo(0, -5), t.lineTo(0, 5), t.on("pointerdown", (r) => zn(r, e, t.parent)).on("pointermove", (r) => Rn(r, e)).on("pointerup", () => ie()).on("pointerupoutside", () => ie()).on("rightclick", () => {
      o.manager = o.manager ?? new Ye({ targetId: e.id }), o.manager.selectedTargetId = e.id, o.manager.render(!0);
    }), t;
  }
  function Fe(e, n, t) {
    dt(n).forEach(({ handle: r, x: a, y: i }) => e.addChild(En(n, r, a, i, t)));
  }
  function En(e, n, t, r, a) {
    const i = new PIXI.Graphics();
    return i.name = `pulse-scanner-resize-${e.id}-${n}`, i.position.set(t, r), i.eventMode = "static", i.interactive = !0, i.cursor = Fn(n), i.hitArea = new PIXI.Circle(0, 0, 12), i.beginFill(1053204, 0.92), i.lineStyle(2, a, 1), i.drawCircle(0, 0, 7), i.endFill(), i.on("pointerdown", (u) => An(u, e, n)), i;
  }
  function An(e, n, t) {
    var r, a, i;
    (r = game.user) != null && r.isGM && ((a = e.stopPropagation) == null || a.call(e), o.resizingMarker = {
      id: n.id,
      handle: t,
      center: { x: Number(n.x), y: Number(n.y) }
    }, o.liveMarker = ((i = e.currentTarget) == null ? void 0 : i.parent) ?? null, o.liveUpdates = null);
  }
  function Fn(e) {
    return ft(e);
  }
  function zn(e, n, t) {
    var r, a;
    (r = game.user) != null && r.isGM && ((a = e.stopPropagation) == null || a.call(e), o.draggingMarker = {
      id: n.id,
      start: ze(e),
      origin: { x: Number(n.x), y: Number(n.y) }
    }, o.liveMarker = t ?? null, o.liveUpdates = null);
  }
  function Rn(e, n) {
    !o.draggingMarker || o.draggingMarker.id !== n.id || Re(ze(e));
  }
  function ze(e) {
    var r, a;
    const n = (r = e.data) == null ? void 0 : r.originalEvent;
    if ((n == null ? void 0 : n.clientX) != null && (n == null ? void 0 : n.clientY) != null) return H(n.clientX, n.clientY);
    const t = e.global ?? ((a = e.data) == null ? void 0 : a.global);
    if (!t) return null;
    try {
      const i = canvas.stage.worldTransform.applyInverse(new PIXI.Point(t.x, t.y));
      return { x: Math.round(i.x), y: Math.round(i.y) };
    } catch {
      return null;
    }
  }
  async function ie() {
    if (!o.draggingMarker) return !1;
    const e = o.draggingMarker.id, n = o.liveUpdates;
    return o.draggingMarker = null, o.liveMarker = null, o.liveUpdates = null, n && await x(e, n, { refresh: !1 }), C(), !0;
  }
  function Re(e) {
    if (!o.draggingMarker || !(canvas != null && canvas.scene)) return !1;
    if (!e || !o.draggingMarker.start) return !0;
    const n = e.x - o.draggingMarker.start.x, t = e.y - o.draggingMarker.start.y, r = Math.round(o.draggingMarker.origin.x + n), a = Math.round(o.draggingMarker.origin.y + t);
    return o.liveMarker && o.liveMarker.position.set(r, a), o.liveUpdates = { x: r, y: a }, !0;
  }
  function Ln(e, n) {
    if (!o.resizingMarker || !(canvas != null && canvas.scene)) return !1;
    const t = H(e, n);
    if (!t) return !0;
    const r = k(canvas.scene.id).find((i) => i.id === o.resizingMarker.id);
    if (!r) return !0;
    const a = mt(r, o.resizingMarker.handle, t);
    if (o.liveUpdates = a, o.liveMarker) {
      o.liveMarker.removeChildren();
      const i = N({ ...r, ...a }), u = We(i), l = new PIXI.Graphics();
      Ee(l, i, u), o.liveMarker.addChild(l), Fe(o.liveMarker, i, u), o.liveMarker.addChild(Ae(i, u));
    }
    return !0;
  }
  async function On() {
    if (!o.resizingMarker) return !1;
    const e = o.resizingMarker.id, n = o.liveUpdates;
    return o.resizingMarker = null, o.liveMarker = null, o.liveUpdates = null, n && await x(e, n, { refresh: !1 }), C(), !0;
  }
  function Dn() {
    var n;
    const e = (n = canvas == null ? void 0 : canvas.app) == null ? void 0 : n.view;
    !e || o.mouseTrackingCanvas === e || (o.mouseTrackingCanvas && (o.mouseTrackingCanvas.removeEventListener("mousemove", Le), o.mouseTrackingCanvas.removeEventListener("pointerdown", Oe), o.mouseTrackingCanvas.removeEventListener("pointermove", De), o.mouseTrackingCanvas.removeEventListener("pointerup", He)), e.addEventListener("mousemove", Le), e.addEventListener("pointerdown", Oe), e.addEventListener("pointermove", De), e.addEventListener("pointerup", He), o.mouseTrackingCanvas = e);
  }
  function Le(e) {
    o.lastMouseScenePosition = H(e.clientX, e.clientY);
  }
  async function Oe(e) {
    var a;
    if (!o.placementActive || !((a = game.user) != null && a.isGM) || !(canvas != null && canvas.scene) || o.resizingMarker || o.draggingMarker || e.button !== 0) return;
    const n = H(e.clientX, e.clientY);
    if (!n || Gn(n)) return;
    e.preventDefault(), e.stopPropagation();
    const t = _n(), r = await re({
      sceneId: canvas.scene.id,
      x: n.x,
      y: n.y,
      mode: t.mode,
      type: t.type,
      label: t.label,
      visibility: "gm",
      shape: Hn(),
      radius: 80,
      width: 160,
      height: 160
    });
    o.manager && (o.manager.selectedTargetId = (r == null ? void 0 : r.id) ?? o.manager.selectedTargetId, o.manager.draftTarget = null, o.manager.render(!0));
  }
  function De(e) {
    !o.resizingMarker && !o.draggingMarker || (e.preventDefault(), o.draggingMarker && Re(H(e.clientX, e.clientY)), o.resizingMarker && Ln(e.clientX, e.clientY));
  }
  function He(e) {
    !o.resizingMarker && !o.draggingMarker || (e.preventDefault(), o.draggingMarker && ie().catch((n) => console.error(`${d} | Move failed`, n)), o.resizingMarker && On().catch((n) => console.error(`${d} | Resize failed`, n)));
  }
  function Hn() {
    return me.includes(o.placementShape) ? o.placementShape : B;
  }
  function _n() {
    var a, i, u, l, f, h, b, v, p, w;
    const e = (l = (u = (i = (a = o.manager) == null ? void 0 : a.element) == null ? void 0 : i.find) == null ? void 0 : u.call(i, "form.pulse-scanner-target-form")) == null ? void 0 : l[0], n = (h = (f = e == null ? void 0 : e.elements) == null ? void 0 : f.type) == null ? void 0 : h.value, t = (v = (b = e == null ? void 0 : e.elements) == null ? void 0 : b.mode) == null ? void 0 : v.value, r = (w = (p = e == null ? void 0 : e.elements) == null ? void 0 : p.label) == null ? void 0 : w.value;
    return {
      type: K.includes(n) ? n : fe,
      mode: P.includes(t) ? t : Mn(n || fe),
      label: r || "Placed Scan Target"
    };
  }
  function Gn(e) {
    var n;
    return k((n = canvas.scene) == null ? void 0 : n.id).some((t) => ht(e, t));
  }
  function _e(e, n) {
    try {
      const t = canvas.stage.worldTransform.apply(new PIXI.Point(Number(e), Number(n))), r = canvas.app.view.getBoundingClientRect();
      return { x: r.left + t.x, y: r.top + t.y };
    } catch {
      return { x: Number(e), y: Number(n) };
    }
  }
  function H(e, n) {
    try {
      const t = canvas.app.view.getBoundingClientRect(), r = canvas.stage.worldTransform.applyInverse(new PIXI.Point(e - t.left, n - t.top));
      return { x: Math.round(r.x), y: Math.round(r.y) };
    } catch {
      return null;
    }
  }
  function Ge(e) {
    var t, r;
    const n = ((r = (t = canvas == null ? void 0 : canvas.stage) == null ? void 0 : t.scale) == null ? void 0 : r.x) ?? 1;
    return Number(e) * n;
  }
  function Y(e) {
    var n, t, r, a, i;
    return e ? ((n = canvas.tokens) == null ? void 0 : n.get(e)) ?? ((r = (t = canvas.tokens) == null ? void 0 : t.placeables) == null ? void 0 : r.find((u) => {
      var l;
      return u.id === e || ((l = u.document) == null ? void 0 : l.id) === e;
    })) : ((i = (a = canvas.tokens) == null ? void 0 : a.controlled) == null ? void 0 : i[0]) ?? null;
  }
  function Un(e) {
    var r, a, i, u;
    const n = e == null ? void 0 : e.actor;
    if (!n) return null;
    const t = (a = (r = canvas.tokens) == null ? void 0 : r.controlled) == null ? void 0 : a.find((l) => {
      var f;
      return ((f = l.actor) == null ? void 0 : f.id) === n.id;
    });
    return t || (((u = (i = canvas.tokens) == null ? void 0 : i.placeables) == null ? void 0 : u.find((l) => {
      var f;
      return ((f = l.actor) == null ? void 0 : f.id) === n.id && Bn(l);
    })) ?? null);
  }
  function Bn(e) {
    var n, t;
    return !!(e != null && e.isOwner || (n = e == null ? void 0 : e.document) != null && n.isOwner || (t = e == null ? void 0 : e.actor) != null && t.isOwner);
  }
  function Ue(e) {
    var n, t, r, a, i, u;
    if (!e) return ((r = (t = (n = canvas.tokens) == null ? void 0 : n.controlled) == null ? void 0 : t[0]) == null ? void 0 : r.actor) ?? ((a = game.user) == null ? void 0 : a.character) ?? null;
    if (e.actor) return e.actor;
    if ((i = e.document) != null && i.actor) return e.document.actor;
    if (e.items) return e;
    if (typeof e == "string") {
      const l = Y(e);
      return (l == null ? void 0 : l.actor) ?? ((u = game.actors) == null ? void 0 : u.get(e)) ?? null;
    }
    return null;
  }
  function V(e) {
    return e != null && e.actor ? oe(e.actor) : null;
  }
  function oe(e) {
    return Array.from((e == null ? void 0 : e.items) ?? []).find((t) => _(t)) ?? null;
  }
  function _(e) {
    var n;
    return e ? (n = e.getFlag) != null && n.call(e, s, S) ? !0 : Be(e.name) === Be(le()) : !1;
  }
  function le() {
    return String(game.settings.get(s, "scannerItemName") || M).trim() || M;
  }
  function Be(e) {
    return String(e || "").trim().toLowerCase();
  }
  function jn() {
    var t, r;
    const e = ((r = (t = game.system) == null ? void 0 : t.documentTypes) == null ? void 0 : r.Item) ?? [], n = Array.isArray(e) ? e : e instanceof Set ? Array.from(e) : e && typeof e == "object" ? Object.keys(e) : [];
    return n.includes("equipment") ? "equipment" : n.includes("tool") ? "tool" : n.includes("gear") ? "gear" : n.includes("loot") ? "loot" : n[0] ?? "item";
  }
  function G(e) {
    var n, t;
    (t = (n = ui.notifications) == null ? void 0 : n.warn) == null || t.call(n, e), console.warn(`${d}: ${e}`);
  }
  function je(e) {
    var a, i;
    if (e.center) return { x: e.center.x, y: e.center.y };
    const n = e.document ?? e, t = Number(n.width ?? 1) * Number(((a = canvas.grid) == null ? void 0 : a.size) ?? 100), r = Number(n.height ?? 1) * Number(((i = canvas.grid) == null ? void 0 : i.size) ?? 100);
    return { x: Number(n.x ?? e.x ?? 0) + t / 2, y: Number(n.y ?? e.y ?? 0) + r / 2 };
  }
  function qn() {
    var n, t;
    const e = (t = (n = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : n.controlled) == null ? void 0 : t[0];
    return e ? je(e) : null;
  }
  function L(e) {
    var n;
    return e ? ((n = game.scenes) == null ? void 0 : n.get(e)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
  }
  function qe(e) {
    for (const n of game.scenes ?? [])
      if (R(n)[e]) return n;
    return null;
  }
  function C() {
    var e;
    (e = o.manager) != null && e.rendered && o.manager.render(!1), !o.draggingMarker && !o.resizingMarker && W();
  }
  function E(e) {
    var n;
    return (n = game.user) != null && n.isGM ? !0 : (console.warn(`${d}: only GMs can ${e}.`), !1);
  }
  function Xe() {
    var e, n;
    return ((n = (e = foundry.utils).randomID) == null ? void 0 : n.call(e, 16)) ?? crypto.randomUUID();
  }
  function A(e) {
    return String(e || "").replace(/[-_]/g, " ").replace(/\b\w/g, (n) => n.toUpperCase());
  }
  function ce(e, n) {
    const t = Number(e);
    return Number.isFinite(t) ? t : n;
  }
  function Xn(e, n, t) {
    return Math.max(n, Math.min(t, e));
  }
  function Wn(e) {
    const n = String(e).trim().replace("#", ""), t = Number.parseInt(n.length === 3 ? n.split("").map((r) => `${r}${r}`).join("") : n, 16);
    return Number.isFinite(t) ? t : 8255999;
  }
  function We(e) {
    var n;
    return e.status === "resolved" ? 8095116 : Wn(e.color || ((n = y[e.type]) == null ? void 0 : n.color) || y.custom.color);
  }
  function Yn() {
    var t, r;
    const e = String(game.settings.get(s, "scanSound") || "").trim();
    if (!e) return;
    const n = globalThis.AudioHelper ?? ((t = foundry.audio) == null ? void 0 : t.AudioHelper);
    (r = n == null ? void 0 : n.play) == null || r.call(n, { src: e, volume: 0.65, autoplay: !0, loop: !1 }, !0);
  }
  function Vn(e, n) {
    const t = new Blob([JSON.stringify(n, null, 2)], { type: "application/json" }), r = URL.createObjectURL(t), a = document.createElement("a");
    a.href = r, a.download = e, a.click(), URL.revokeObjectURL(r);
  }
  function Jn(e) {
    return String(e || "scene").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "scene";
  }
  function ue(e) {
    return String(e ?? "").replace(/[&<>"']/g, (n) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[n]);
  }
  class Ye extends Q {
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
      const n = (canvas == null ? void 0 : canvas.scene) ?? ((u = game.scenes) == null ? void 0 : u.current) ?? null, t = X(n == null ? void 0 : n.id), r = t.map((l) => ({
        ...l,
        isResolved: l.status === "resolved",
        isBreakable: l.type === "breakable"
      })), a = this.draftTarget ?? t.find((l) => l.id === this.selectedTargetId) ?? t[0] ?? N({ sceneId: n == null ? void 0 : n.id, ...Ve() }), i = {
        ...a,
        isBreakable: a.type === "breakable"
      };
      return !this.draftTarget && !this.selectedTargetId && t[0] && (this.selectedTargetId = t[0].id), {
        scene: n,
        targets: r,
        selectedTarget: i,
        typeOptions: K.map((l) => {
          var f;
          return { value: l, label: ((f = y[l]) == null ? void 0 : f.label) ?? A(l) };
        }),
        modeOptions: P.map((l) => {
          var f;
          return { value: l, label: ((f = J[l]) == null ? void 0 : f.label) ?? A(l) };
        }),
        colorOptions: Tn(a.color),
        visibilityOptions: en.map((l) => ({ value: l, label: A(l) })),
        statusOptions: nn.map((l) => ({ value: l, label: A(l) })),
        hasTargets: t.length > 0,
        canUseMouse: !!o.lastMouseScenePosition,
        placementActive: o.placementActive,
        placementShape: o.placementShape,
        placementCircle: o.placementShape === "circle",
        placementRectangle: o.placementShape === "rectangle",
        scannerItem: {
          name: le(),
          mode: Se(),
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
      const n = Ve();
      this.draftTarget = N({ sceneId: (t = canvas.scene) == null ? void 0 : t.id, ...n, label: "New Scan Target" }), this.selectedTargetId = null, this.render(!1), window.setTimeout(() => {
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
      if (r.id && X((u = canvas.scene) == null ? void 0 : u.id).some((l) => l.id === r.id))
        await x(r.id, a), this.selectedTargetId = r.id;
      else {
        const l = await re(a);
        this.selectedTargetId = (l == null ? void 0 : l.id) ?? this.selectedTargetId;
      }
      this.draftTarget = null, this.render(!1);
    }
    async _createScannerItemConfig(n) {
      if (!n) return;
      const t = new FormData(n), r = String(t.get("scannerItemName") || M).trim() || M, a = P.includes(t.get("scannerItemMode")) ? t.get("scannerItemMode") : U, i = Math.max(0, ce(t.get("scannerItemRadiusFeet"), 30));
      await game.settings.set(s, "scannerItemName", r), await game.settings.set(s, "scannerItemMode", a), await game.settings.set(s, "scannerItemRadiusFeet", i), await ve({ name: r, mode: a, radiusFeet: i }), this.render(!1);
    }
    _getCurrentMode() {
      var t, r, a, i, u;
      const n = (a = (r = (t = this.element) == null ? void 0 : t.find) == null ? void 0 : r.call(t, "form.pulse-scanner-target-form")) == null ? void 0 : a[0];
      return ((u = (i = n == null ? void 0 : n.elements) == null ? void 0 : i.mode) == null ? void 0 : u.value) || U;
    }
    _togglePlacement() {
      pe(), this.render(!1);
    }
    _setPlacementShape(n) {
      hn(n), this.render(!1);
    }
    async _revealTarget(n) {
      n && (await ae(n), this.render(!1));
    }
    async _revealLatest() {
      await Te(), this.render(!1);
    }
    async _hideTarget(n) {
      n && (await Ie(n), this.render(!1));
    }
    async _toggleResolved(n) {
      var r;
      if (!n) return;
      const t = k((r = canvas.scene) == null ? void 0 : r.id).find((a) => a.id === n);
      (t == null ? void 0 : t.status) === "resolved" ? await Pe(n) : await ke(n), this.render(!1);
    }
    _openImportDialog() {
      new Dialog({
        title: "Import Pulse Scanner Targets",
        content: `<form><textarea name="json" rows="12" style="width:100%;" placeholder='{"targets":[]}'></textarea></form>`,
        buttons: {
          import: {
            icon: '<i class="fa-solid fa-file-import"></i>',
            label: "Import",
            callback: (t) => xe(t.find("textarea[name='json']").val())
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
      n && (await Me(n, (t = canvas.scene) == null ? void 0 : t.id), this.selectedTargetId = ((a = X((r = canvas.scene) == null ? void 0 : r.id)[0]) == null ? void 0 : a.id) ?? null, this.draftTarget = null, this.render(!1));
    }
  }
  function Ve() {
    var e, n;
    return qn() ?? o.lastMouseScenePosition ?? { x: Math.round(((e = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : e.width) / 2 || 0), y: Math.round(((n = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : n.height) / 2 || 0) };
  }
})();
