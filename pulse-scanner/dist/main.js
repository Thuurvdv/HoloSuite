function Nn(i) {
  return Number(i.radius || 0);
}
function xn(i, u, l, m) {
  return Math.hypot(i.x - l.x, i.y - l.y) <= Number(u) + Number(m);
}
function An(i, u, l) {
  return xn(i, u, l, Number(l.radius || 0));
}
function En(i, u, l, m, h) {
  return i.status === "resolved" || m != null && m.size && !m.has(String(i.type)) || h != null && h.size && !h.has(String(i.mode)) ? !1 : An(u, l, i);
}
const Y = "structural", Fn = "breakable", ie = [
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
], Le = ["gm", "revealed", "always"], De = ["active", "revealed", "resolved"], M = ["structural", "arcane", "thermal", "forensic", "tech", "biological"], V = {
  structural: { label: "Structural", color: "#ffb347", icon: "fa-solid fa-building-shield", types: ["breakable", "hidden"] },
  arcane: { label: "Arcane", color: "#c77dff", icon: "fa-solid fa-wand-sparkles", types: ["magic", "hidden", "custom"] },
  thermal: { label: "Thermal", color: "#ff4d6d", icon: "fa-solid fa-temperature-high", types: ["trap", "biological", "radiation"] },
  forensic: { label: "Forensic", color: "#f7f7f2", icon: "fa-solid fa-fingerprint", types: ["evidence", "loot", "biological"] },
  tech: { label: "Tech", color: "#39ffb6", icon: "fa-solid fa-microchip", types: ["tech", "radiation", "hidden"] },
  biological: { label: "Biological", color: "#8fd14f", icon: "fa-solid fa-dna", types: ["biological", "evidence"] }
}, S = {
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
}, se = [
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
function Cn(i) {
  return i && typeof i == "object" ? i : {};
}
function z(i, u) {
  const l = Number(i);
  return Number.isFinite(l) ? l : u;
}
function Rn(i, u, l) {
  return Math.max(u, Math.min(l, i));
}
function On(i) {
  return String(i || "").replace(/[-_]/g, " ").replace(/\b\w/g, (u) => u.toUpperCase());
}
function Ln(i) {
  return M.find((u) => {
    var l, m;
    return (m = (l = V[u]) == null ? void 0 : l.types) == null ? void 0 : m.includes(i);
  }) ?? Y;
}
function ke(i, u) {
  const l = String(i || u || "").trim();
  return l.startsWith("#") ? l.toLowerCase() : l;
}
function Dn(i = {}, u = {}) {
  var j;
  const l = Cn(i), m = ie.includes(l.type) ? l.type : Fn, h = S[m] ?? S.custom, N = M.includes(l.mode) ? l.mode : Ln(m), x = De.includes(l.status) ? l.status : l.resolved ? "resolved" : "active";
  return {
    id: String(l.id || ((j = u.createId) == null ? void 0 : j.call(u)) || ""),
    sceneId: String(l.sceneId || u.sceneId || ""),
    regionId: String(l.regionId || ""),
    x: z(l.x, 0),
    y: z(l.y, 0),
    radius: Math.max(0, z(l.radius, 80)),
    mode: N,
    type: m,
    label: String(l.label || h.label),
    description: String(l.description || ""),
    integrity: Rn(z(l.integrity, 100), 0, 100),
    difficulty: z(l.difficulty, 10),
    visibility: Le.includes(l.visibility) ? l.visibility : "gm",
    status: x,
    color: ke(l.color, h.color),
    icon: h.icon
  };
}
function kn(i) {
  if (!Array.isArray(i) || i.length === 0) return null;
  const u = i.map((l) => String(l).trim()).filter((l) => ie.includes(l));
  return u.length ? new Set(u) : null;
}
function _n(i) {
  const l = (Array.isArray(i) ? i : i ? [i] : []).map((m) => String(m).trim()).filter((m) => M.includes(m));
  return l.length ? new Set(l) : null;
}
function Hn(i, u, l, m, h) {
  return En(i, u, l, m, h);
}
function Gn(i) {
  return i.visibility === "revealed" || i.visibility === "always";
}
function zn(i, u) {
  var N;
  const l = u && i.visibility === "gm", m = ((N = S[i.type]) == null ? void 0 : N.label) || On(i.type), h = m.toLowerCase().includes("signature") ? m : `${m} Signature`;
  return {
    ...i,
    label: l ? h : i.label,
    description: l ? "" : i.description,
    integrity: l && i.type !== "breakable" ? null : i.integrity,
    difficulty: l ? null : i.difficulty
  };
}
function jn(i) {
  const u = ke(i, "");
  return !u || se.some((l) => l.value === u) ? se : [{ label: `Current (${u})`, value: u }, ...se];
}
(() => {
  var Ce, Re;
  const i = "pulse-scanner", u = "Pulse Scanner", l = `module.${i}`, m = `modules/${i}/templates`, h = "targets", N = "isPulseScanner", x = "Pulse Scanner", j = "icons/tools/scribal/magnifying-glass.webp", b = {
    manager: null,
    latestScan: null,
    sheetObserver: null,
    sheetEnhanceTimeout: null
  }, _e = globalThis.Application ?? ((Re = (Ce = foundry.appv1) == null ? void 0 : Ce.api) == null ? void 0 : Re.Application);
  Hooks.once("init", async () => {
    He(), Ge(), await loadTemplates([
      `${m}/target-manager.hbs`,
      `${m}/target-form.hbs`
    ]), console.log(`${u} | Initialized`);
  }), Hooks.once("ready", () => {
    var n;
    game.pulseScanner = ze();
    const e = game.modules.get(i);
    e && (e.api = game.pulseScanner), je(), Be(), fe(), (n = game.socket) == null || n.on(l, gn), console.log(`${u} | API available at game.pulseScanner`);
  }), Hooks.on("updateScene", (e, n = {}) => {
    var t, r, a;
    e.id === ((t = canvas == null ? void 0 : canvas.scene) == null ? void 0 : t.id) && ((a = (r = n.flags) == null ? void 0 : r[i]) != null && a[h]) && H();
  });
  function He() {
    game.settings.register(i, "defaultScanRadius", {
      name: "Default Scan Radius",
      hint: "The default pulse radius in scene pixels.",
      scope: "world",
      config: !0,
      type: Number,
      default: 600
    }), game.settings.register(i, "allowPlayersToScan", {
      name: "Allow Players to Scan",
      hint: "Allow non-GM users to activate scanner pulses from controlled tokens.",
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0
    }), game.settings.register(i, "requireScannerItem", {
      name: "Require Pulse Scanner Item",
      hint: "Require players to have a Pulse Scanner item on the selected token's actor before scanning. GMs can always scan.",
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0
    }), game.settings.register(i, "scannerItemName", {
      name: "Pulse Scanner Item Name",
      hint: "The actor item name players can use to trigger scanner pulses.",
      scope: "world",
      config: !0,
      type: String,
      default: x
    }), game.settings.register(i, "scannerItemMode", {
      name: "Pulse Scanner Item Signal",
      hint: "The scanner mode used when players activate the Pulse Scanner item.",
      scope: "world",
      config: !1,
      type: String,
      default: Y
    }), game.settings.register(i, "scannerItemRadiusFeet", {
      name: "Pulse Scanner Item Radius",
      hint: "The Pulse Scanner item range in scene distance units, usually feet.",
      scope: "world",
      config: !1,
      type: Number,
      default: 30
    }), game.settings.register(i, "createWorldScannerItem", {
      name: "Create World Pulse Scanner Item",
      hint: "Create a ready-to-drag Pulse Scanner item in the world Items directory when a GM loads the world.",
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0
    }), game.settings.register(i, "defaultHighlightDuration", {
      name: "Default Highlight Duration",
      hint: "How long detected target highlights remain visible, in milliseconds.",
      scope: "world",
      config: !0,
      type: Number,
      default: 4200
    }), game.settings.register(i, "showIntegrityToPlayers", {
      name: "Show Integrity to Players",
      hint: "Show integrity values on player-visible scan labels for breakable targets.",
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0
    }), game.settings.register(i, "showLabelsToPlayers", {
      name: "Show Labels to Players",
      hint: "Show target labels to players when scan results are revealed.",
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0
    }), game.settings.register(i, "scanSound", {
      name: "Scan Pulse Sound",
      hint: "Optional audio path played when a scanner pulse fires.",
      scope: "world",
      config: !0,
      type: String,
      default: ""
    });
  }
  function Ge() {
    Handlebars.registerHelper("psOption", (e, n) => e === n ? "selected" : ""), Handlebars.registerHelper("psFallback", (e, n) => e || n), Handlebars.registerHelper("psEq", (e, n) => e === n), Handlebars.registerHelper("psTypeLabel", (e) => {
      var n;
      return ((n = S[e]) == null ? void 0 : n.label) ?? P(e);
    }), Handlebars.registerHelper("psModeLabel", (e) => {
      var n;
      return ((n = V[e]) == null ? void 0 : n.label) ?? P(e);
    });
  }
  function ze() {
    return {
      openTargetManager: de,
      scan: K,
      createTarget: he,
      getTargets: q,
      deleteTarget: ye,
      revealTarget: Z,
      revealLatestScan: pe,
      hideTarget: be,
      resolveTarget: Se,
      unresolveTarget: ve,
      exportTargets: cn,
      importTargets: we,
      usePulseScannerItem: E,
      createPulseScannerItem: nn,
      hasPulseScannerItem: rn,
      ensureWorldPulseScannerItem: fe,
      createWorldPulseScannerItem: me,
      getPulseScannerItemData: L
    };
  }
  function je() {
    const e = game.modules.get("holosuite-core"), n = e != null && e.active ? e.api : null;
    return n != null && n.registerApp ? (n.registerApp({
      id: i,
      title: "Pulse Scanner",
      icon: "fa-solid fa-wave-square",
      premium: !1,
      featureId: i,
      playerVisible: !1,
      description: "Scan scenes, reveal targets, and manage sensor signatures.",
      open: () => {
        var t;
        return (t = game.user) != null && t.isGM ? de() : K();
      }
    }), !0) : !1;
  }
  function Be() {
    Hooks.on("renderTokenHUD", qe), Hooks.on("getItemSheetHeaderButtons", Ue), Hooks.on("renderItemSheet", ce), Hooks.on("renderItemSheetV2", ce), Hooks.on("renderApplication", B), Hooks.on("renderApplicationV2", B), We();
  }
  function qe(e, n) {
    var d, f, p, y;
    if (!game.settings.get(i, "allowPlayersToScan") && !((d = game.user) != null && d.isGM)) return;
    const t = (f = e.object) != null && f.document ? e.object : (y = canvas.tokens) == null ? void 0 : y.get((p = e.object) == null ? void 0 : p.id);
    if (!(t != null && t.actor)) return;
    const r = re(t);
    if (!r.length) return;
    const a = r.length > 1 ? "Choose Pulse Scanner" : "Use Pulse Scanner", c = $(`<div class="control-icon pulse-scanner-token-control" title="${a}" data-action="pulse-scanner-scan"><i class="fa-solid fa-wave-square"></i></div>`);
    c.on("click", (g) => {
      g.preventDefault(), g.stopPropagation(), pn(t).catch((T) => console.error(`${u} | Item scan failed`, T));
    });
    const o = n instanceof jQuery ? n : $(n), s = o.find(".col.right, .right").first();
    s.length ? s.append(c) : o.append(c);
  }
  function Ue(e, n) {
    const t = X(e);
    _(t) && (n.some((r) => r.class === "pulse-scanner-use-item") || n.unshift({
      label: "Scan",
      class: "pulse-scanner-use-item",
      icon: "fas fa-wave-square",
      onclick: () => E({ item: t }).catch((r) => console.error(`${u} | Item scan failed`, r))
    }));
  }
  function ce(e, n) {
    const t = X(e);
    if (!_(t)) return;
    const r = J(n);
    r && oe(r, t);
  }
  function oe(e, n) {
    if (!e || e.querySelector(".pulse-scanner-item-use")) return;
    const t = document.createElement("button");
    t.type = "button", t.className = "pulse-scanner-item-use", t.innerHTML = '<i class="fa-solid fa-wave-square"></i> Use Pulse Scanner', t.addEventListener("click", (c) => {
      c.preventDefault(), E({ item: n }).catch((o) => console.error(`${u} | Item scan failed`, o));
    });
    const r = e.querySelector(".window-content") ?? e, a = r.querySelector(".sheet-header, header.sheet-header, .item-header");
    a != null && a.parentElement ? a.parentElement.insertBefore(t, a.nextSibling) : r.prepend(t);
  }
  function X(e) {
    var t;
    const n = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? (e == null ? void 0 : e.item) ?? null;
    return (n == null ? void 0 : n.documentName) === "Item" || ((t = n == null ? void 0 : n.constructor) == null ? void 0 : t.documentName) === "Item" ? n : null;
  }
  function J(e) {
    return e ? e instanceof HTMLElement ? e : Array.isArray(e) ? e.find((n) => n instanceof HTMLElement) ?? null : e[0] instanceof HTMLElement ? e[0] : null : null;
  }
  function B() {
    window.clearTimeout(b.sheetEnhanceTimeout), b.sheetEnhanceTimeout = window.setTimeout(Ye, 40);
  }
  function We() {
    b.sheetObserver || !document.body || (b.sheetObserver = new MutationObserver((e) => {
      e.some((n) => n.addedNodes.length) && B();
    }), b.sheetObserver.observe(document.body, { childList: !0, subtree: !0 }), B());
  }
  function Ye() {
    for (const e of Ve()) {
      const n = X(e);
      if (!_(n)) continue;
      const t = Xe(e);
      t && oe(t, n);
    }
  }
  function Ve() {
    var t;
    const e = [];
    e.push(...Object.values(ui.windows ?? {}));
    const n = (t = foundry.applications) == null ? void 0 : t.instances;
    return n instanceof Map ? e.push(...n.values()) : n && typeof n == "object" && e.push(...Object.values(n)), [...new Set(e)].filter(Boolean);
  }
  function Xe(e) {
    return J(e == null ? void 0 : e.element) ?? J(e == null ? void 0 : e._element) ?? document.querySelector(`[data-appid="${e == null ? void 0 : e.appId}"]`) ?? document.querySelector(`[data-application-id="${e == null ? void 0 : e.id}"]`) ?? null;
  }
  function Je(e = "") {
    var r;
    const n = I(e);
    return (((r = n == null ? void 0 : n.regions) == null ? void 0 : r.contents) ?? []).map((a) => ({
      id: a.id,
      name: a.name || `Region ${a.id}`,
      region: a
    })).sort((a, c) => a.name.localeCompare(c.name));
  }
  function Ke(e = "", n = "") {
    return [
      { id: "", name: "No Linked Region", selected: !n },
      ...Je(e).map((t) => ({
        id: t.id,
        name: t.name,
        selected: t.id === n
      }))
    ];
  }
  function le(e = "", n = "") {
    var r, a;
    if (!e) return null;
    const t = I(n);
    return ((a = (r = t == null ? void 0 : t.regions) == null ? void 0 : r.get) == null ? void 0 : a.call(r, e)) ?? null;
  }
  function Qe(e) {
    var o, s, d, f;
    const n = (e == null ? void 0 : e.object) ?? ((d = (s = (o = canvas == null ? void 0 : canvas.regions) == null ? void 0 : o.placeables) == null ? void 0 : s.find) == null ? void 0 : d.call(s, (p) => {
      var y;
      return ((y = p.document) == null ? void 0 : y.id) === (e == null ? void 0 : e.id);
    })), t = n == null ? void 0 : n.bounds;
    if (t != null && t.width && (t != null && t.height)) return ue(t);
    const r = e == null ? void 0 : e.bounds;
    if (r != null && r.width && (r != null && r.height)) return ue(r);
    const a = ((f = e == null ? void 0 : e.toObject) == null ? void 0 : f.call(e)) ?? e, c = Array.isArray(e == null ? void 0 : e.shapes) ? e.shapes : Array.isArray(a == null ? void 0 : a.shapes) ? a.shapes : [];
    return Ze(c);
  }
  function ue(e) {
    const n = Number(e.x ?? 0), t = Number(e.y ?? 0), r = Number(e.width ?? 0), a = Number(e.height ?? 0);
    return {
      x: Math.round(n + r / 2),
      y: Math.round(t + a / 2),
      radius: Math.round(Math.hypot(r, a) / 2)
    };
  }
  function Ze(e) {
    let n = 1 / 0, t = 1 / 0, r = -1 / 0, a = -1 / 0;
    for (const s of e)
      if (s.type === "rectangle")
        n = Math.min(n, s.x ?? 0), t = Math.min(t, s.y ?? 0), r = Math.max(r, (s.x ?? 0) + (s.width ?? 0)), a = Math.max(a, (s.y ?? 0) + (s.height ?? 0));
      else if (s.type === "ellipse")
        n = Math.min(n, (s.x ?? 0) - (s.radiusX ?? 0)), t = Math.min(t, (s.y ?? 0) - (s.radiusY ?? 0)), r = Math.max(r, (s.x ?? 0) + (s.radiusX ?? 0)), a = Math.max(a, (s.y ?? 0) + (s.radiusY ?? 0));
      else if (s.type === "polygon" && Array.isArray(s.points))
        for (let d = 0; d < s.points.length; d += 2)
          n = Math.min(n, s.points[d]), t = Math.min(t, s.points[d + 1]), r = Math.max(r, s.points[d]), a = Math.max(a, s.points[d + 1]);
    if (!Number.isFinite(n)) return null;
    const c = r - n, o = a - t;
    return {
      x: Math.round(n + c / 2),
      y: Math.round(t + o / 2),
      radius: Math.round(Math.hypot(c, o) / 2)
    };
  }
  function en(e) {
    if (!e.regionId) return e;
    const n = le(e.regionId, e.sceneId), t = Qe(n);
    return t ? { ...e, ...t } : e;
  }
  function de() {
    var e;
    return (e = game.user) != null && e.isGM ? (b.manager || (b.manager = new $n()), b.manager.render(!0), b.manager) : (console.warn(`${u}: only GMs can manage scan targets.`), null);
  }
  async function K(e = {}) {
    var p, y, g, T, v, w, Oe;
    if (!(canvas != null && canvas.ready) || !canvas.scene)
      return console.warn(`${u}: no active scene is ready.`), [];
    if (!((p = game.user) != null && p.isGM) && !game.settings.get(i, "allowPlayersToScan"))
      return console.warn(`${u}: players are not allowed to scan in this world.`), [];
    const n = U(e.tokenId);
    if (!n)
      return R("Select a token before using the Pulse Scanner."), [];
    if (!an(n, e)) return [];
    const t = Number(e.radius ?? game.settings.get(i, "defaultScanRadius")), r = un(e.types), a = dn(e.modes ?? e.mode), c = vn(n), s = D(canvas.scene.id).map(en).filter((A) => ln(A, c, t, r, a)), d = Number(e.duration ?? game.settings.get(i, "defaultHighlightDuration"));
    b.latestScan = {
      sceneId: canvas.scene.id,
      targetIds: s.map((A) => A.id),
      timestamp: Date.now()
    };
    const f = Te({
      sceneId: canvas.scene.id,
      origin: c,
      radius: t,
      duration: d,
      detected: s,
      userId: (y = game.user) == null ? void 0 : y.id,
      playerView: !((g = game.user) != null && g.isGM),
      mode: (a == null ? void 0 : a.values().next().value) ?? null
    });
    if (In(), Ie(f), (T = game.user) != null && T.isGM && e.revealToPlayers) {
      const A = Te({
        sceneId: canvas.scene.id,
        origin: c,
        radius: t,
        duration: d,
        detected: s,
        userId: (v = game.user) == null ? void 0 : v.id,
        playerView: !0,
        mode: (a == null ? void 0 : a.values().next().value) ?? null
      });
      (w = game.socket) == null || w.emit(l, { action: "scan-results", payload: A });
    }
    return (Oe = game.user) != null && Oe.isGM ? foundry.utils.deepClone(s) : s.map((A) => ee(A, !0));
  }
  async function E(e = {}) {
    var c, o, s;
    const n = U(e.tokenId) ?? hn(e.item);
    if (!n)
      return R("Select a token with a Pulse Scanner item."), [];
    const t = e.item ?? xe(n, e.scannerItemId) ?? ne(n);
    if (!((c = game.user) != null && c.isGM) && !t && ge(e))
      return R("This token needs a Pulse Scanner item before it can scan."), [];
    const r = ((o = t == null ? void 0 : t.getFlag) == null ? void 0 : o.call(t, i, "scan")) ?? {}, a = r.radiusFeet != null ? tn(r.radiusFeet) : r.radius;
    return K({
      ...r,
      ...e,
      radius: e.radius ?? a,
      tokenId: n.id ?? ((s = n.document) == null ? void 0 : s.id),
      scannerItemId: (t == null ? void 0 : t.id) ?? e.scannerItemId
    });
  }
  async function nn(e, n = {}) {
    const t = $e(e);
    if (!(t != null && t.createEmbeddedDocuments))
      return R("Select a token actor before creating a Pulse Scanner item."), null;
    const r = te(t);
    if (r && !n.duplicate) return r;
    const a = {
      ...L(n),
      system: n.system ?? L(n).system
    }, [c] = await t.createEmbeddedDocuments("Item", [a]);
    return c ?? null;
  }
  async function fe(e = {}) {
    var r, a, c, o, s;
    if (!((r = game.user) != null && r.isGM) || !game.items || !e.force && !game.settings.get(i, "createWorldScannerItem")) return null;
    const n = Array.from(game.items).find((d) => _(d));
    if (n && !e.duplicate) return n;
    const t = L(e);
    try {
      const d = await Item.create(t, { renderSheet: !1 });
      return e.silent || (c = (a = ui.notifications) == null ? void 0 : a.info) == null || c.call(a, `${u}: created the Pulse Scanner item in the Items sidebar.`), d;
    } catch (d) {
      return console.error(`${u} | Could not create world Pulse Scanner item`, d), (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, `${u}: could not create the world item. Check the browser console for details.`), null;
    }
  }
  async function me(e = {}) {
    var t, r, a, c, o;
    if (!((t = game.user) != null && t.isGM) || !game.items) return null;
    const n = L(e);
    try {
      const s = await Item.create(n, { renderSheet: !1 });
      return e.silent || (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, `${u}: created ${s.name} in the Items sidebar.`), s;
    } catch (s) {
      return console.error(`${u} | Could not create scanner item`, s), (o = (c = ui.notifications) == null ? void 0 : c.warn) == null || o.call(c, `${u}: could not create the scanner item. Check the browser console for details.`), null;
    }
  }
  function L(e = {}) {
    const n = W(e.radiusFeet ?? game.settings.get(i, "scannerItemRadiusFeet"), 30), t = M.includes(e.mode) ? e.mode : Q();
    return {
      name: e.name || ae(),
      type: e.type || Sn(),
      img: e.img || j,
      flags: {
        [i]: {
          [N]: !0,
          scan: {
            radiusFeet: n,
            mode: t
          }
        }
      },
      system: e.system ?? {}
    };
  }
  function Q() {
    const e = game.settings.get(i, "scannerItemMode");
    return M.includes(e) ? e : Y;
  }
  function tn(e) {
    var r, a, c, o, s, d, f;
    const n = Number(((a = (r = canvas == null ? void 0 : canvas.scene) == null ? void 0 : r.grid) == null ? void 0 : a.distance) ?? ((c = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : c.distance) ?? 5) || 5, t = Number(((o = canvas == null ? void 0 : canvas.grid) == null ? void 0 : o.size) ?? ((d = (s = canvas == null ? void 0 : canvas.scene) == null ? void 0 : s.grid) == null ? void 0 : d.size) ?? ((f = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : f.size) ?? 100) || 100;
    return Math.max(0, W(e, 30)) * t / n;
  }
  function rn(e) {
    return !!(ne(U((e == null ? void 0 : e.id) ?? e)) ?? te($e(e)));
  }
  function an(e, n = {}) {
    var t;
    return (t = game.user) != null && t.isGM || !ge(n) || ne(e) ? !0 : (R("This token needs a Pulse Scanner item before it can scan."), !1);
  }
  function ge(e = {}) {
    return e.requireItem === !1 ? !1 : !!game.settings.get(i, "requireScannerItem");
  }
  async function he(e = {}) {
    if (!G("create scan targets")) return null;
    const n = I(e.sceneId) ?? canvas.scene;
    if (!n)
      return console.warn(`${u}: no scene was found for the new target.`), null;
    const t = F(n), r = C({ ...e, sceneId: n.id });
    return t[r.id] = r, await n.setFlag(i, h, t), H(), foundry.utils.deepClone(r);
  }
  function q(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    return D(e).filter((t) => {
      var r;
      return ((r = game.user) == null ? void 0 : r.isGM) || Gn(t);
    }).map((t) => {
      var r;
      return (r = game.user) != null && r.isGM ? foundry.utils.deepClone(t) : ee(t, !0);
    });
  }
  function D(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    const t = I(e);
    return t ? Object.values(F(t)).map((r) => C(r)).sort((r, a) => r.label.localeCompare(a.label)) : [];
  }
  async function ye(e, n = ((t) => (t = canvas == null ? void 0 : canvas.scene) == null ? void 0 : t.id)()) {
    if (!G("delete scan targets")) return !1;
    const r = I(n) ?? Ee(e);
    if (!r)
      return console.warn(`${u}: target "${e}" was not found.`), !1;
    const a = F(r), c = sn(a, e);
    if (!c)
      return console.warn(`${u}: target "${e}" was not found on ${r.name}.`), !1;
    delete a[c], await r.update({ [`flags.${i}.${h}.-=${c}`]: null });
    const o = r.getFlag(i, h) ?? {};
    (o[c] || Object.values(o).some((d) => (d == null ? void 0 : d.id) === e)) && (await r.unsetFlag(i, h), Object.keys(a).length && await r.setFlag(i, h, a));
    const s = r.getFlag(i, h) ?? {};
    return s[c] || Object.values(s).some((d) => (d == null ? void 0 : d.id) === e) ? (console.error(`${u} | Delete failed`, { targetId: e, storeKey: c, scene: r, store: a, afterFallback: s }), !1) : (H(), !0);
  }
  function sn(e, n) {
    var t;
    return e[n] ? n : ((t = Object.entries(e).find(([, r]) => (r == null ? void 0 : r.id) === n)) == null ? void 0 : t[0]) ?? null;
  }
  async function Z(e) {
    var t;
    const n = D((t = canvas.scene) == null ? void 0 : t.id).find((r) => r.id === e);
    return n ? k(e, { visibility: "revealed", status: n.status === "resolved" ? "resolved" : "revealed" }) : null;
  }
  async function pe() {
    var n;
    if (!G("reveal scan targets")) return [];
    if (!b.latestScan || b.latestScan.sceneId !== ((n = canvas.scene) == null ? void 0 : n.id))
      return console.warn(`${u}: no latest scan is available for this scene.`), [];
    const e = [];
    for (const t of b.latestScan.targetIds) {
      const r = await Z(t);
      r && e.push(r);
    }
    return e;
  }
  async function be(e) {
    return k(e, { visibility: "gm", status: "active" });
  }
  async function Se(e) {
    return k(e, { status: "resolved", visibility: "revealed" });
  }
  async function ve(e) {
    return k(e, { status: "active", visibility: "gm" });
  }
  function cn(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    var a, c;
    const t = I(e);
    if (!t) return null;
    const r = {
      module: i,
      version: ((c = (a = game.modules) == null ? void 0 : a.get(i)) == null ? void 0 : c.version) ?? "0.1.0",
      sceneId: t.id,
      sceneName: t.name,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      targets: D(t.id)
    };
    return Pn(`pulse-scanner-${Mn(t.name)}.json`, r), r;
  }
  async function we(e, { merge: n = !0, sceneId: t = ((r) => (r = canvas == null ? void 0 : canvas.scene) == null ? void 0 : r.id)() } = {}) {
    if (!G("import scan targets")) return [];
    const a = I(t);
    if (!a) return [];
    let c;
    try {
      c = typeof e == "string" ? JSON.parse(e) : e;
    } catch (f) {
      return console.error(`${u} | Import failed`, f), [];
    }
    const o = Array.isArray(c) ? c : c == null ? void 0 : c.targets;
    if (!Array.isArray(o))
      return console.warn(`${u}: import JSON must contain a targets array.`), [];
    const s = n ? F(a) : {}, d = o.map((f) => C({
      ...f,
      id: f.id && !s[f.id] ? f.id : Fe(),
      sceneId: a.id
    }));
    for (const f of d) s[f.id] = f;
    return await a.setFlag(i, h, s), H(), d;
  }
  async function k(e, n = {}, t = {}) {
    if (!G("edit scan targets")) return null;
    const r = Ee(e) ?? I(n.sceneId) ?? canvas.scene;
    if (!r) return null;
    const a = F(r), c = a[e] ?? {}, o = C({ ...c, ...n, id: e, sceneId: r.id });
    return a[o.id] = o, await r.setFlag(i, h, a), t.refresh !== !1 && H(), foundry.utils.deepClone(o);
  }
  function F(e) {
    return foundry.utils.deepClone((e == null ? void 0 : e.getFlag(i, h)) ?? {});
  }
  function C(e = {}) {
    var n;
    return Dn(e, {
      createId: Fe,
      sceneId: ((n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id) || ""
    });
  }
  function on(e) {
    return jn(e);
  }
  function ln(e, n, t, r, a) {
    return Hn(e, n, t, r, a);
  }
  function un(e) {
    return kn(e);
  }
  function dn(e) {
    return _n(e);
  }
  function fn(e) {
    return Nn(e);
  }
  function Te({ sceneId: e, origin: n, radius: t, duration: r, detected: a, userId: c, playerView: o, mode: s }) {
    return {
      sceneId: e,
      origin: n,
      radius: t,
      duration: r,
      userId: c,
      playerView: o,
      mode: s,
      showLabels: o ? !!game.settings.get(i, "showLabelsToPlayers") : !0,
      showIntegrity: o ? !!game.settings.get(i, "showIntegrityToPlayers") : !0,
      detected: a.map((d) => ee(d, o))
    };
  }
  function ee(e, n) {
    return zn(e, n);
  }
  function Ie(e = {}) {
    var c, o, s, d, f, p, y;
    if (!(canvas != null && canvas.ready) || e.sceneId !== ((c = canvas.scene) == null ? void 0 : c.id)) return;
    const n = document.createElement("div");
    n.className = "pulse-scanner-overlay", n.dataset.cameraLocked = "true", n.style.setProperty("--pulse-duration", `${Math.max(900, Number(e.duration || 4200))}ms`), document.body.appendChild(n);
    const t = Pe(((o = e.origin) == null ? void 0 : o.x) ?? 0, ((s = e.origin) == null ? void 0 : s.y) ?? 0), r = Math.max(16, Me(Number(e.radius || 0))), a = document.createElement("div");
    if (a.className = "pulse-scanner-ring", a.style.left = `${t.x}px`, a.style.top = `${t.y}px`, a.style.setProperty("--pulse-radius", `${r}px`), a.style.setProperty("--pulse-color", ((d = V[e.mode]) == null ? void 0 : d.color) ?? "#7df9ff"), n.appendChild(a), !((f = e.detected) != null && f.length)) {
      const g = document.createElement("div");
      g.className = "pulse-scanner-empty", g.textContent = "NO SIGNATURES DETECTED", g.style.left = `${t.x}px`, g.style.top = `${t.y}px`, n.appendChild(g);
    }
    for (const g of e.detected ?? []) {
      const T = Pe(g.x, g.y), v = document.createElement("div");
      if (v.className = `pulse-scanner-target pulse-scanner-target-${g.type}`, v.style.left = `${T.x}px`, v.style.top = `${T.y}px`, v.style.setProperty("--target-color", g.color || ((p = S[g.type]) == null ? void 0 : p.color) || S.custom.color), v.style.setProperty("--target-size", `${Math.max(28, Me(fn(g) || 80) * 2)}px`), n.appendChild(v), e.showLabels) {
        const w = document.createElement("div");
        w.className = "pulse-scanner-label", w.style.left = `${T.x}px`, w.style.top = `${T.y}px`, w.style.setProperty("--target-color", g.color || ((y = S[g.type]) == null ? void 0 : y.color) || S.custom.color), w.innerHTML = mn(g, e.showIntegrity), n.appendChild(w);
      }
    }
    window.setTimeout(() => n.remove(), Math.max(900, Number(e.duration || 4200)) + 650);
  }
  function mn(e, n) {
    var f, p, y;
    const t = e.icon || ((f = S[e.type]) == null ? void 0 : f.icon) || S.custom.icon, r = O(e.label || ((p = S[e.type]) == null ? void 0 : p.label) || "Signature"), a = O(((y = S[e.type]) == null ? void 0 : y.label) || P(e.type)), c = Tn(Number(e.integrity ?? 0), 0, 100), o = e.type === "breakable", s = n && o ? `<span class="pulse-scanner-integrity">${c}%</span>` : "", d = n && o ? `<div class="pulse-scanner-integrity-bar"><span style="width: ${c}%;"></span></div><small>STRUCTURAL WEAKNESS: ${c}%</small>` : `<small>${a}</small>`;
    return `<span class="pulse-scanner-label-row"><i class="${O(t)}"></i><strong>${r}</strong>${s}</span>${d}`;
  }
  function gn(e = {}) {
    var n, t;
    if (e.action === "scan-results") {
      if (((n = e.payload) == null ? void 0 : n.userId) === ((t = game.user) == null ? void 0 : t.id)) return;
      Ie(e.payload);
    }
  }
  function Pe(e, n) {
    try {
      const t = canvas.stage.worldTransform.apply(new PIXI.Point(Number(e), Number(n))), r = canvas.app.view.getBoundingClientRect();
      return { x: r.left + t.x, y: r.top + t.y };
    } catch {
      return { x: Number(e), y: Number(n) };
    }
  }
  function Me(e) {
    var t, r;
    const n = ((r = (t = canvas == null ? void 0 : canvas.stage) == null ? void 0 : t.scale) == null ? void 0 : r.x) ?? 1;
    return Number(e) * n;
  }
  function U(e) {
    var n, t, r, a, c;
    return e ? ((n = canvas.tokens) == null ? void 0 : n.get(e)) ?? ((r = (t = canvas.tokens) == null ? void 0 : t.placeables) == null ? void 0 : r.find((o) => {
      var s;
      return o.id === e || ((s = o.document) == null ? void 0 : s.id) === e;
    })) : ((c = (a = canvas.tokens) == null ? void 0 : a.controlled) == null ? void 0 : c[0]) ?? null;
  }
  function hn(e) {
    var r, a, c, o;
    const n = e == null ? void 0 : e.actor;
    if (!n) return null;
    const t = (a = (r = canvas.tokens) == null ? void 0 : r.controlled) == null ? void 0 : a.find((s) => {
      var d;
      return ((d = s.actor) == null ? void 0 : d.id) === n.id;
    });
    return t || (((o = (c = canvas.tokens) == null ? void 0 : c.placeables) == null ? void 0 : o.find((s) => {
      var d;
      return ((d = s.actor) == null ? void 0 : d.id) === n.id && yn(s);
    })) ?? null);
  }
  function yn(e) {
    var n, t;
    return !!(e != null && e.isOwner || (n = e == null ? void 0 : e.document) != null && n.isOwner || (t = e == null ? void 0 : e.actor) != null && t.isOwner);
  }
  function $e(e) {
    var n, t, r, a, c, o;
    if (!e) return ((r = (t = (n = canvas.tokens) == null ? void 0 : n.controlled) == null ? void 0 : t[0]) == null ? void 0 : r.actor) ?? ((a = game.user) == null ? void 0 : a.character) ?? null;
    if (e.actor) return e.actor;
    if ((c = e.document) != null && c.actor) return e.document.actor;
    if (e.items) return e;
    if (typeof e == "string") {
      const s = U(e);
      return (s == null ? void 0 : s.actor) ?? ((o = game.actors) == null ? void 0 : o.get(e)) ?? null;
    }
    return null;
  }
  function ne(e) {
    return e != null && e.actor ? te(e.actor) : null;
  }
  function te(e) {
    return Ne(e)[0] ?? null;
  }
  function re(e) {
    return e != null && e.actor ? Ne(e.actor) : [];
  }
  function Ne(e) {
    return Array.from((e == null ? void 0 : e.items) ?? []).filter((t) => _(t));
  }
  function xe(e, n) {
    return n ? re(e).find((t) => t.id === n) ?? null : null;
  }
  async function pn(e) {
    var c, o, s, d;
    const n = re(e), t = e.id ?? ((c = e.document) == null ? void 0 : c.id);
    if (!n.length)
      return R("This token needs a Pulse Scanner item before it can scan."), [];
    if (n.length === 1) return E({ tokenId: t, item: n[0] });
    const r = globalThis.Dialog ?? ((d = (s = (o = globalThis.foundry) == null ? void 0 : o.appv1) == null ? void 0 : s.api) == null ? void 0 : d.Dialog);
    if (!r) return E({ tokenId: t, item: n[0] });
    const a = n.map((f, p) => {
      const y = bn(f), g = p === 0 ? "checked" : "";
      return `
        <label class="pulse-scanner-choice">
          <input type="radio" name="pulseScannerItemId" value="${O(f.id)}" ${g}>
          <span>
            <strong>${O(f.name)}</strong>
            <small>${O(P(y.mode))} / ${Number(y.radiusFeet)} ft</small>
          </span>
        </label>
      `;
    }).join("");
    return new Promise((f) => {
      new r({
        title: "Choose Pulse Scanner",
        content: `<form class="pulse-scanner-choice-dialog">${a}</form>`,
        buttons: {
          scan: {
            icon: '<i class="fa-solid fa-wave-square"></i>',
            label: "Scan",
            callback: async (p) => {
              var v, w;
              const y = (p == null ? void 0 : p[0]) ?? p, g = (w = (v = y == null ? void 0 : y.querySelector) == null ? void 0 : v.call(y, "[name='pulseScannerItemId']:checked")) == null ? void 0 : w.value, T = xe(e, g) ?? n[0];
              f(await E({ tokenId: t, item: T }));
            }
          },
          cancel: {
            label: "Cancel",
            callback: () => f([])
          }
        },
        default: "scan",
        close: () => f([])
      }, {
        classes: ["pulse-scanner", "pulse-scanner-choice-window"],
        width: 360
      }).render(!0);
    });
  }
  function bn(e) {
    var t;
    const n = ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, i, "scan")) ?? {};
    return {
      mode: M.includes(n.mode) ? n.mode : Q(),
      radiusFeet: W(n.radiusFeet, game.settings.get(i, "scannerItemRadiusFeet"))
    };
  }
  function _(e) {
    var n;
    return e ? (n = e.getFlag) != null && n.call(e, i, N) ? !0 : Ae(e.name) === Ae(ae()) : !1;
  }
  function ae() {
    return String(game.settings.get(i, "scannerItemName") || x).trim() || x;
  }
  function Ae(e) {
    return String(e || "").trim().toLowerCase();
  }
  function Sn() {
    var t, r;
    const e = ((r = (t = game.system) == null ? void 0 : t.documentTypes) == null ? void 0 : r.Item) ?? [], n = Array.isArray(e) ? e : e instanceof Set ? Array.from(e) : e && typeof e == "object" ? Object.keys(e) : [];
    return n.includes("equipment") ? "equipment" : n.includes("tool") ? "tool" : n.includes("gear") ? "gear" : n.includes("loot") ? "loot" : n[0] ?? "item";
  }
  function vn(e) {
    var a, c;
    if (e.center) return { x: e.center.x, y: e.center.y };
    const n = e.document ?? e, t = Number(n.width ?? 1) * Number(((a = canvas.grid) == null ? void 0 : a.size) ?? 100), r = Number(n.height ?? 1) * Number(((c = canvas.grid) == null ? void 0 : c.size) ?? 100);
    return { x: Number(n.x ?? e.x ?? 0) + t / 2, y: Number(n.y ?? e.y ?? 0) + r / 2 };
  }
  function I(e) {
    var n;
    return e ? ((n = game.scenes) == null ? void 0 : n.get(e)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
  }
  function Ee(e) {
    for (const n of game.scenes ?? [])
      if (F(n)[e]) return n;
    return null;
  }
  function wn(e, n) {
    if (!e) return "";
    const t = le(e, n);
    return (t == null ? void 0 : t.name) || `Region ${e}`;
  }
  function H() {
    var e;
    (e = b.manager) != null && e.rendered && b.manager.render(!1);
  }
  function G(e) {
    var n;
    return (n = game.user) != null && n.isGM ? !0 : (console.warn(`${u}: only GMs can ${e}.`), !1);
  }
  function Fe() {
    var e, n;
    return ((n = (e = foundry.utils).randomID) == null ? void 0 : n.call(e, 16)) ?? crypto.randomUUID();
  }
  function R(e) {
    var n, t;
    (t = (n = ui.notifications) == null ? void 0 : n.warn) == null || t.call(n, e), console.warn(`${u}: ${e}`);
  }
  function P(e) {
    return String(e || "").replace(/[-_]/g, " ").replace(/\b\w/g, (n) => n.toUpperCase());
  }
  function W(e, n) {
    const t = Number(e);
    return Number.isFinite(t) ? t : n;
  }
  function Tn(e, n, t) {
    return Math.max(n, Math.min(t, e));
  }
  function In() {
    var t, r;
    const e = String(game.settings.get(i, "scanSound") || "").trim();
    if (!e) return;
    const n = globalThis.AudioHelper ?? ((t = foundry.audio) == null ? void 0 : t.AudioHelper);
    (r = n == null ? void 0 : n.play) == null || r.call(n, { src: e, volume: 0.65, autoplay: !0, loop: !1 }, !0);
  }
  function Pn(e, n) {
    const t = new Blob([JSON.stringify(n, null, 2)], { type: "application/json" }), r = URL.createObjectURL(t), a = document.createElement("a");
    a.href = r, a.download = e, a.click(), URL.revokeObjectURL(r);
  }
  function Mn(e) {
    return String(e || "scene").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "scene";
  }
  function O(e) {
    return String(e ?? "").replace(/[&<>"']/g, (n) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[n]);
  }
  class $n extends _e {
    constructor(n = {}) {
      super(n), this.selectedTargetId = n.targetId ?? null, this.draftTarget = null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "pulse-scanner-target-manager",
        title: "Pulse Scanner Target Manager",
        template: `${m}/target-manager.hbs`,
        classes: ["pulse-scanner", "pulse-scanner-manager"],
        width: 1080,
        height: 720,
        resizable: !0
      });
    }
    getData() {
      var o;
      const n = (canvas == null ? void 0 : canvas.scene) ?? ((o = game.scenes) == null ? void 0 : o.current) ?? null, t = q(n == null ? void 0 : n.id), r = t.map((s) => ({
        ...s,
        isResolved: s.status === "resolved",
        isBreakable: s.type === "breakable",
        regionName: s.regionId ? wn(s.regionId, n == null ? void 0 : n.id) : ""
      })), a = this.draftTarget ?? t.find((s) => s.id === this.selectedTargetId) ?? t[0] ?? C({ sceneId: n == null ? void 0 : n.id }), c = {
        ...a,
        isBreakable: a.type === "breakable"
      };
      return !this.draftTarget && !this.selectedTargetId && t[0] && (this.selectedTargetId = t[0].id), {
        scene: n,
        targets: r,
        selectedTarget: c,
        typeOptions: ie.map((s) => {
          var d;
          return { value: s, label: ((d = S[s]) == null ? void 0 : d.label) ?? P(s) };
        }),
        modeOptions: M.map((s) => {
          var d;
          return { value: s, label: ((d = V[s]) == null ? void 0 : d.label) ?? P(s) };
        }),
        colorOptions: on(a.color),
        visibilityOptions: Le.map((s) => ({ value: s, label: P(s) })),
        statusOptions: De.map((s) => ({ value: s, label: P(s) })),
        regionChoices: Ke(n == null ? void 0 : n.id, a.regionId),
        hasTargets: t.length > 0,
        scannerItem: {
          name: ae(),
          mode: Q(),
          radiusFeet: game.settings.get(i, "scannerItemRadiusFeet")
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
      var c;
      n.preventDefault(), n.stopPropagation();
      const t = n.currentTarget, r = t.dataset.action, a = t.dataset.targetId ?? ((c = t.closest("[data-target-id]")) == null ? void 0 : c.dataset.targetId) ?? this.selectedTargetId;
      if (r === "new-target") return this._startNewTarget();
      if (r === "save-target") return this._saveForm(t.closest("form"));
      if (r === "create-scanner-item-config") return this._createScannerItemConfig(t.closest("form"));
      if (r === "delete-target") return this._deleteTarget(a);
      if (r === "reveal-target") return this._revealTarget(a);
      if (r === "hide-target") return this._hideTarget(a);
      if (r === "toggle-resolved") return this._toggleResolved(a);
    }
    _startNewTarget() {
      var n;
      this.draftTarget = C({ sceneId: (n = canvas.scene) == null ? void 0 : n.id, label: "New Scan Target" }), this.selectedTargetId = null, this.render(!1), window.setTimeout(() => {
        var r, a, c;
        const t = (c = (a = (r = this.element) == null ? void 0 : r.find) == null ? void 0 : a.call(r, "form.pulse-scanner-target-form")) == null ? void 0 : c[0];
        t && (t.elements.label.focus(), t.elements.label.select());
      }, 20);
    }
    async _saveForm(n) {
      var c, o;
      if (!n) return;
      const t = new FormData(n), r = Object.fromEntries(t.entries()), a = {
        ...r,
        sceneId: (c = canvas.scene) == null ? void 0 : c.id,
        regionId: r.regionId || "",
        integrity: r.integrity
      };
      if (r.id && q((o = canvas.scene) == null ? void 0 : o.id).some((s) => s.id === r.id))
        await k(r.id, a), this.selectedTargetId = r.id;
      else {
        const s = await he(a);
        this.selectedTargetId = (s == null ? void 0 : s.id) ?? this.selectedTargetId;
      }
      this.draftTarget = null, this.render(!1);
    }
    async _createScannerItemConfig(n) {
      if (!n) return;
      const t = new FormData(n), r = String(t.get("scannerItemName") || x).trim() || x, a = M.includes(t.get("scannerItemMode")) ? t.get("scannerItemMode") : Y, c = Math.max(0, W(t.get("scannerItemRadiusFeet"), 30));
      await game.settings.set(i, "scannerItemName", r), await game.settings.set(i, "scannerItemMode", a), await game.settings.set(i, "scannerItemRadiusFeet", c), await me({ name: r, mode: a, radiusFeet: c }), this.render(!1);
    }
    async _revealTarget(n) {
      n && (await Z(n), this.render(!1));
    }
    async _revealLatest() {
      await pe(), this.render(!1);
    }
    async _hideTarget(n) {
      n && (await be(n), this.render(!1));
    }
    async _toggleResolved(n) {
      var r;
      if (!n) return;
      const t = D((r = canvas.scene) == null ? void 0 : r.id).find((a) => a.id === n);
      (t == null ? void 0 : t.status) === "resolved" ? await ve(n) : await Se(n), this.render(!1);
    }
    _openImportDialog() {
      new Dialog({
        title: "Import Pulse Scanner Targets",
        content: `<form><textarea name="json" rows="12" style="width:100%;" placeholder='{"targets":[]}'></textarea></form>`,
        buttons: {
          import: {
            icon: '<i class="fa-solid fa-file-import"></i>',
            label: "Import",
            callback: (t) => we(t.find("textarea[name='json']").val())
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
      n && (await ye(n, (t = canvas.scene) == null ? void 0 : t.id), this.selectedTargetId = ((a = q((r = canvas.scene) == null ? void 0 : r.id)[0]) == null ? void 0 : a.id) ?? null, this.draftTarget = null, this.render(!1));
    }
  }
})();
