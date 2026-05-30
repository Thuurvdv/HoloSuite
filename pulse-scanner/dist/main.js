function En(s) {
  return Number(s.radius || 0);
}
function Fn(s, u, d, g) {
  return Math.hypot(s.x - d.x, s.y - d.y) <= Number(u) + Number(g);
}
function An(s, u, d) {
  return Fn(s, u, d, Number(d.radius || 0));
}
function kn(s, u, d, g, p) {
  return s.status === "resolved" || g != null && g.size && !g.has(String(s.type)) || p != null && p.size && !p.has(String(s.mode)) ? !1 : An(u, d, s);
}
const X = "structural", Ln = "breakable", le = [
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
], _e = ["gm", "revealed", "always"], He = ["active", "revealed", "resolved"], C = ["structural", "arcane", "thermal", "forensic", "tech", "biological"], J = {
  structural: { label: "Structural", color: "#ffb347", icon: "fa-solid fa-building-shield", types: ["breakable", "hidden"] },
  arcane: { label: "Arcane", color: "#c77dff", icon: "fa-solid fa-wand-sparkles", types: ["magic", "hidden", "custom"] },
  thermal: { label: "Thermal", color: "#ff4d6d", icon: "fa-solid fa-temperature-high", types: ["trap", "biological", "radiation"] },
  forensic: { label: "Forensic", color: "#f7f7f2", icon: "fa-solid fa-fingerprint", types: ["evidence", "loot", "biological"] },
  tech: { label: "Tech", color: "#39ffb6", icon: "fa-solid fa-microchip", types: ["tech", "radiation", "hidden"] },
  biological: { label: "Biological", color: "#8fd14f", icon: "fa-solid fa-dna", types: ["biological", "evidence"] }
}, I = {
  breakable: { label: "Breakable Wall", color: "#ffb347", icon: "fa-solid fa-hammer", stat: "Integrity" },
  hidden: { label: "Hidden Passage", color: "#45d6ff", icon: "fa-solid fa-door-open", stat: "Concealment" },
  trap: { label: "Trap", color: "#ff4d6d", icon: "fa-solid fa-triangle-exclamation", stat: "Lethality" },
  magic: { label: "Magic Residue", color: "#c77dff", icon: "fa-solid fa-wand-sparkles", stat: "Potency" },
  tech: { label: "Tech Signature", color: "#39ffb6", icon: "fa-solid fa-microchip", stat: "Signal" },
  biological: { label: "Biological Trace", color: "#8fd14f", icon: "fa-solid fa-dna", stat: "Vitality" },
  loot: { label: "Loot Cache", color: "#ffd166", icon: "fa-solid fa-gem", stat: "Value" },
  radiation: { label: "Radiation Leak", color: "#f8f32b", icon: "fa-solid fa-radiation", stat: "Exposure" },
  evidence: { label: "Evidence", color: "#f7f7f2", icon: "fa-solid fa-magnifying-glass", stat: "Freshness" },
  custom: { label: "Custom", color: "#7df9ff", icon: "fa-solid fa-location-dot", stat: "Intensity" }
}, oe = [
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
function Rn(s) {
  return s && typeof s == "object" ? s : {};
}
function q(s, u) {
  const d = Number(s);
  return Number.isFinite(d) ? d : u;
}
function On(s, u, d) {
  return Math.max(u, Math.min(d, s));
}
function Dn(s) {
  return String(s || "").replace(/[-_]/g, " ").replace(/\b\w/g, (u) => u.toUpperCase());
}
function _n(s) {
  return C.find((u) => {
    var d, g;
    return (g = (d = J[u]) == null ? void 0 : d.types) == null ? void 0 : g.includes(s);
  }) ?? X;
}
function Ge(s, u) {
  const d = String(s || u || "").trim();
  return d.startsWith("#") ? d.toLowerCase() : d;
}
function Hn(s = {}, u = {}) {
  var U;
  const d = Rn(s), g = le.includes(d.type) ? d.type : Ln, p = I[g] ?? I.custom, E = C.includes(d.mode) ? d.mode : _n(g), F = He.includes(d.status) ? d.status : d.resolved ? "resolved" : "active";
  return {
    id: String(d.id || ((U = u.createId) == null ? void 0 : U.call(u)) || ""),
    sceneId: String(d.sceneId || u.sceneId || ""),
    regionId: String(d.regionId || ""),
    x: q(d.x, 0),
    y: q(d.y, 0),
    radius: Math.max(0, q(d.radius, 80)),
    mode: E,
    type: g,
    label: String(d.label || p.label),
    description: String(d.description || ""),
    integrity: On(q(d.integrity, 100), 0, 100),
    difficulty: q(d.difficulty, 10),
    visibility: _e.includes(d.visibility) ? d.visibility : "gm",
    status: F,
    color: Ge(d.color, p.color),
    icon: p.icon
  };
}
function Gn(s) {
  if (!Array.isArray(s) || s.length === 0) return null;
  const u = s.map((d) => String(d).trim()).filter((d) => le.includes(d));
  return u.length ? new Set(u) : null;
}
function zn(s) {
  const d = (Array.isArray(s) ? s : s ? [s] : []).map((g) => String(g).trim()).filter((g) => C.includes(g));
  return d.length ? new Set(d) : null;
}
function jn(s, u, d, g, p) {
  return kn(s, u, d, g, p);
}
function Bn(s) {
  return s.visibility === "revealed" || s.visibility === "always";
}
function qn(s, u) {
  var E;
  const d = u && s.visibility === "gm", g = ((E = I[s.type]) == null ? void 0 : E.label) || Dn(s.type), p = g.toLowerCase().includes("signature") ? g : `${g} Signature`;
  return {
    ...s,
    label: d ? p : s.label,
    description: d ? "" : s.description,
    integrity: d && s.type !== "breakable" ? null : s.integrity,
    difficulty: d ? null : s.difficulty
  };
}
function Un(s) {
  const u = Ge(s, "");
  return !u || oe.some((d) => d.value === u) ? oe : [{ label: `Current (${u})`, value: u }, ...oe];
}
(() => {
  var Oe, De;
  const s = "pulse-scanner", u = "Pulse Scanner", d = `module.${s}`, g = `modules/${s}/templates`, p = "targets", E = "isPulseScanner", F = "Pulse Scanner", U = "icons/tools/scribal/magnifying-glass.webp", b = {
    manager: null,
    latestScan: null,
    sheetObserver: null,
    sheetEnhanceTimeout: null
  }, ze = globalThis.Application ?? ((De = (Oe = foundry.appv1) == null ? void 0 : Oe.api) == null ? void 0 : De.Application);
  Hooks.once("init", async () => {
    je(), Be(), await loadTemplates([
      `${g}/target-manager.hbs`,
      `${g}/target-form.hbs`
    ]), console.log(`${u} | Initialized`);
  }), Hooks.once("ready", () => {
    var n;
    game.pulseScanner = qe();
    const e = game.modules.get(s);
    e && (e.api = game.pulseScanner), Ue(), We(), pe(), (n = game.socket) == null || n.on(d, bn), console.log(`${u} | API available at game.pulseScanner`);
  }), Hooks.on("updateScene", (e, n = {}) => {
    var t, a, r;
    e.id === ((t = canvas == null ? void 0 : canvas.scene) == null ? void 0 : t.id) && ((r = (a = n.flags) == null ? void 0 : a[s]) != null && r[p]) && j();
  });
  function je() {
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
      default: F
    }), game.settings.register(s, "scannerItemMode", {
      name: "Pulse Scanner Item Signal",
      hint: "The scanner mode used when players activate the Pulse Scanner item.",
      scope: "world",
      config: !1,
      type: String,
      default: X
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
    }), game.settings.register(s, "scannerCharges", {
      name: "Scanner Charges",
      hint: "Maximum number of charges per Pulse Scanner item. Set to 0 for unlimited.",
      scope: "world",
      config: !0,
      type: Number,
      default: 0
    });
  }
  function Be() {
    Handlebars.registerHelper("psOption", (e, n) => e === n ? "selected" : ""), Handlebars.registerHelper("psFallback", (e, n) => e || n), Handlebars.registerHelper("psEq", (e, n) => e === n), Handlebars.registerHelper("psTypeLabel", (e) => {
      var n;
      return ((n = I[e]) == null ? void 0 : n.label) ?? A(e);
    }), Handlebars.registerHelper("psModeLabel", (e) => {
      var n;
      return ((n = J[e]) == null ? void 0 : n.label) ?? A(e);
    });
  }
  function qe() {
    return {
      openTargetManager: ge,
      scan: Z,
      createTarget: ve,
      getTargets: V,
      deleteTarget: Se,
      revealTarget: te,
      revealLatestScan: we,
      hideTarget: Ie,
      resolveTarget: Te,
      unresolveTarget: Pe,
      exportTargets: un,
      importTargets: Me,
      usePulseScannerItem: L,
      refreshScannerItem: he,
      getScannerCharges: ee,
      createPulseScannerItem: rn,
      hasPulseScannerItem: cn,
      ensureWorldPulseScannerItem: pe,
      createWorldPulseScannerItem: ye,
      getPulseScannerItemData: D
    };
  }
  function Ue() {
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
        return (t = game.user) != null && t.isGM ? ge() : Z();
      }
    }), !0) : !1;
  }
  function We() {
    Hooks.on("renderTokenHUD", Ve), Hooks.on("getItemSheetHeaderButtons", Ye), Hooks.on("renderItemSheet", ue), Hooks.on("renderItemSheetV2", ue), Hooks.on("renderApplication", W), Hooks.on("renderApplicationV2", W), Xe();
  }
  function Ve(e, n) {
    var o, f, m, h;
    if (!game.settings.get(s, "allowPlayersToScan") && !((o = game.user) != null && o.isGM)) return;
    const t = (f = e.object) != null && f.document ? e.object : (h = canvas.tokens) == null ? void 0 : h.get((m = e.object) == null ? void 0 : m.id);
    if (!(t != null && t.actor)) return;
    const a = se(t);
    if (!a.length) return;
    const r = a.length > 1 ? "Choose Pulse Scanner" : "Use Pulse Scanner", i = $(`<div class="control-icon pulse-scanner-token-control" title="${r}" data-action="pulse-scanner-scan"><i class="fa-solid fa-wave-square"></i></div>`);
    i.on("click", (v) => {
      v.preventDefault(), v.stopPropagation(), Sn(t).catch((y) => console.error(`${u} | Item scan failed`, y));
    });
    const l = n instanceof jQuery ? n : $(n), c = l.find(".col.right, .right").first();
    c.length ? c.append(i) : l.append(i);
  }
  function Ye(e, n) {
    const t = K(e);
    z(t) && (n.some((a) => a.class === "pulse-scanner-use-item") || n.unshift({
      label: "Scan",
      class: "pulse-scanner-use-item",
      icon: "fas fa-wave-square",
      onclick: () => L({ item: t }).catch((a) => console.error(`${u} | Item scan failed`, a))
    }));
  }
  function ue(e, n) {
    const t = K(e);
    if (!z(t)) return;
    const a = Q(n);
    a && de(a, t);
  }
  function de(e, n) {
    if (!e || e.querySelector(".pulse-scanner-item-use")) return;
    const t = ee(n), a = t ? ` (${t.current}/${t.max})` : "", r = document.createElement("div");
    r.className = "pulse-scanner-item-actions";
    const i = document.createElement("button");
    if (i.type = "button", i.className = "pulse-scanner-item-use", i.innerHTML = `<i class="fa-solid fa-wave-square"></i> Use Pulse Scanner${x(a)}`, t && t.current <= 0 && (i.disabled = !0), i.addEventListener("click", (o) => {
      o.preventDefault(), L({ item: n }).catch((f) => console.error(`${u} | Item scan failed`, f));
    }), r.appendChild(i), t) {
      const o = document.createElement("button");
      o.type = "button", o.className = "pulse-scanner-item-refresh", o.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i>', o.title = "Refresh scanner charges", o.addEventListener("click", (f) => {
        f.preventDefault(), he({ item: n }).catch((m) => console.error(`${u} | Refresh failed`, m));
      }), r.appendChild(o);
    }
    const l = e.querySelector(".window-content") ?? e, c = l.querySelector(".sheet-header, header.sheet-header, .item-header");
    c != null && c.parentElement ? c.parentElement.insertBefore(r, c.nextSibling) : l.prepend(r);
  }
  function K(e) {
    var t;
    const n = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? (e == null ? void 0 : e.item) ?? null;
    return (n == null ? void 0 : n.documentName) === "Item" || ((t = n == null ? void 0 : n.constructor) == null ? void 0 : t.documentName) === "Item" ? n : null;
  }
  function Q(e) {
    return e ? e instanceof HTMLElement ? e : Array.isArray(e) ? e.find((n) => n instanceof HTMLElement) ?? null : e[0] instanceof HTMLElement ? e[0] : null : null;
  }
  function W() {
    window.clearTimeout(b.sheetEnhanceTimeout), b.sheetEnhanceTimeout = window.setTimeout(Je, 40);
  }
  function Xe() {
    b.sheetObserver || !document.body || (b.sheetObserver = new MutationObserver((e) => {
      e.some((n) => n.addedNodes.length) && W();
    }), b.sheetObserver.observe(document.body, { childList: !0, subtree: !0 }), W());
  }
  function Je() {
    for (const e of Ke()) {
      const n = K(e);
      if (!z(n)) continue;
      const t = Qe(e);
      t && de(t, n);
    }
  }
  function Ke() {
    var t;
    const e = [];
    e.push(...Object.values(ui.windows ?? {}));
    const n = (t = foundry.applications) == null ? void 0 : t.instances;
    return n instanceof Map ? e.push(...n.values()) : n && typeof n == "object" && e.push(...Object.values(n)), [...new Set(e)].filter(Boolean);
  }
  function Qe(e) {
    return Q(e == null ? void 0 : e.element) ?? Q(e == null ? void 0 : e._element) ?? document.querySelector(`[data-appid="${e == null ? void 0 : e.appId}"]`) ?? document.querySelector(`[data-application-id="${e == null ? void 0 : e.id}"]`) ?? null;
  }
  function Ze(e = "") {
    var a;
    const n = N(e);
    return (((a = n == null ? void 0 : n.regions) == null ? void 0 : a.contents) ?? []).map((r) => ({
      id: r.id,
      name: r.name || `Region ${r.id}`,
      region: r
    })).sort((r, i) => r.name.localeCompare(i.name));
  }
  function en(e = "", n = "") {
    return [
      { id: "", name: "No Linked Region", selected: !n },
      ...Ze(e).map((t) => ({
        id: t.id,
        name: t.name,
        selected: t.id === n
      }))
    ];
  }
  function fe(e = "", n = "") {
    var a, r;
    if (!e) return null;
    const t = N(n);
    return ((r = (a = t == null ? void 0 : t.regions) == null ? void 0 : a.get) == null ? void 0 : r.call(a, e)) ?? null;
  }
  function nn(e) {
    var l, c, o, f;
    const n = (e == null ? void 0 : e.object) ?? ((o = (c = (l = canvas == null ? void 0 : canvas.regions) == null ? void 0 : l.placeables) == null ? void 0 : c.find) == null ? void 0 : o.call(c, (m) => {
      var h;
      return ((h = m.document) == null ? void 0 : h.id) === (e == null ? void 0 : e.id);
    })), t = n == null ? void 0 : n.bounds;
    if (t != null && t.width && (t != null && t.height)) return me(t);
    const a = e == null ? void 0 : e.bounds;
    if (a != null && a.width && (a != null && a.height)) return me(a);
    const r = ((f = e == null ? void 0 : e.toObject) == null ? void 0 : f.call(e)) ?? e, i = Array.isArray(e == null ? void 0 : e.shapes) ? e.shapes : Array.isArray(r == null ? void 0 : r.shapes) ? r.shapes : [];
    return tn(i);
  }
  function me(e) {
    const n = Number(e.x ?? 0), t = Number(e.y ?? 0), a = Number(e.width ?? 0), r = Number(e.height ?? 0);
    return {
      x: Math.round(n + a / 2),
      y: Math.round(t + r / 2),
      radius: Math.round(Math.hypot(a, r) / 2)
    };
  }
  function tn(e) {
    let n = 1 / 0, t = 1 / 0, a = -1 / 0, r = -1 / 0;
    for (const c of e)
      if (c.type === "rectangle")
        n = Math.min(n, c.x ?? 0), t = Math.min(t, c.y ?? 0), a = Math.max(a, (c.x ?? 0) + (c.width ?? 0)), r = Math.max(r, (c.y ?? 0) + (c.height ?? 0));
      else if (c.type === "ellipse")
        n = Math.min(n, (c.x ?? 0) - (c.radiusX ?? 0)), t = Math.min(t, (c.y ?? 0) - (c.radiusY ?? 0)), a = Math.max(a, (c.x ?? 0) + (c.radiusX ?? 0)), r = Math.max(r, (c.y ?? 0) + (c.radiusY ?? 0));
      else if (c.type === "polygon" && Array.isArray(c.points))
        for (let o = 0; o < c.points.length; o += 2)
          n = Math.min(n, c.points[o]), t = Math.min(t, c.points[o + 1]), a = Math.max(a, c.points[o]), r = Math.max(r, c.points[o + 1]);
    if (!Number.isFinite(n)) return null;
    const i = a - n, l = r - t;
    return {
      x: Math.round(n + i / 2),
      y: Math.round(t + l / 2),
      radius: Math.round(Math.hypot(i, l) / 2)
    };
  }
  function an(e) {
    if (!e.regionId) return e;
    const n = fe(e.regionId, e.sceneId), t = nn(n);
    return t ? { ...e, ...t } : e;
  }
  function ge() {
    var e;
    return (e = game.user) != null && e.isGM ? (b.manager || (b.manager = new Cn()), b.manager.render(!0), b.manager) : (console.warn(`${u}: only GMs can manage scan targets.`), null);
  }
  async function Z(e = {}) {
    var m, h, v, y, S, w, M;
    if (!(canvas != null && canvas.ready) || !canvas.scene)
      return console.warn(`${u}: no active scene is ready.`), [];
    if (!((m = game.user) != null && m.isGM) && !game.settings.get(s, "allowPlayersToScan"))
      return console.warn(`${u}: players are not allowed to scan in this world.`), [];
    const n = G(e.tokenId);
    if (!n)
      return T("Select a token before using the Pulse Scanner."), [];
    if (!on(n, e)) return [];
    const t = Number(e.radius ?? game.settings.get(s, "defaultScanRadius")), a = mn(e.types), r = gn(e.modes ?? e.mode), i = Tn(n), c = _(canvas.scene.id).map(an).filter((k) => fn(k, i, t, a, r)), o = Number(e.duration ?? game.settings.get(s, "defaultHighlightDuration"));
    b.latestScan = {
      sceneId: canvas.scene.id,
      targetIds: c.map((k) => k.id),
      timestamp: Date.now()
    };
    const f = $e({
      sceneId: canvas.scene.id,
      origin: i,
      radius: t,
      duration: o,
      detected: c,
      userId: (h = game.user) == null ? void 0 : h.id,
      playerView: !((v = game.user) != null && v.isGM),
      mode: (r == null ? void 0 : r.values().next().value) ?? null
    });
    if ($n(), Ne(f), (y = game.user) != null && y.isGM && e.revealToPlayers) {
      const k = $e({
        sceneId: canvas.scene.id,
        origin: i,
        radius: t,
        duration: o,
        detected: c,
        userId: (S = game.user) == null ? void 0 : S.id,
        playerView: !0,
        mode: (r == null ? void 0 : r.values().next().value) ?? null
      });
      (w = game.socket) == null || w.emit(d, { action: "scan-results", payload: k });
    }
    return (M = game.user) != null && M.isGM ? foundry.utils.deepClone(c) : c.map((k) => ae(k, !0));
  }
  async function L(e = {}) {
    var l, c, o, f, m;
    const n = G(e.tokenId) ?? Ee(e.item);
    if (!n)
      return T("Select a token with a Pulse Scanner item."), [];
    const t = e.item ?? ie(n, e.scannerItemId) ?? Y(n);
    if (!((l = game.user) != null && l.isGM) && !t && be(e))
      return T("This token needs a Pulse Scanner item before it can scan."), [];
    const a = P(game.settings.get(s, "scannerCharges"), 0);
    if (a > 0 && t) {
      const h = P((c = t.getFlag) == null ? void 0 : c.call(t, s, "charges"), a);
      if (h <= 0)
        return T("This scanner has no charges remaining. Refresh it to scan again."), [];
      await ((o = t.setFlag) == null ? void 0 : o.call(t, s, "charges", h - 1));
    }
    const r = ((f = t == null ? void 0 : t.getFlag) == null ? void 0 : f.call(t, s, "scan")) ?? {}, i = r.radiusFeet != null ? sn(r.radiusFeet) : r.radius;
    return Z({
      ...r,
      ...e,
      radius: e.radius ?? i,
      tokenId: n.id ?? ((m = n.document) == null ? void 0 : m.id),
      scannerItemId: (t == null ? void 0 : t.id) ?? e.scannerItemId
    });
  }
  async function he(e = {}) {
    var r, i, l;
    const n = G(e.tokenId) ?? Ee(e.item);
    if (!n)
      return T("Select a token with a Pulse Scanner item."), null;
    const t = e.item ?? ie(n, e.scannerItemId) ?? Y(n);
    if (!t)
      return T("No Pulse Scanner item found on this token."), null;
    const a = P(game.settings.get(s, "scannerCharges"), 0);
    return a <= 0 || (await ((r = t.setFlag) == null ? void 0 : r.call(t, s, "charges", a)), (l = (i = ui.notifications) == null ? void 0 : i.info) == null || l.call(i, `${u}: scanner recharged to ${a} charge${a === 1 ? "" : "s"}.`)), t;
  }
  function ee(e) {
    var a;
    const n = P(game.settings.get(s, "scannerCharges"), 0);
    return n <= 0 ? null : { current: P((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, s, "charges"), n), max: n };
  }
  async function rn(e, n = {}) {
    const t = Fe(e);
    if (!(t != null && t.createEmbeddedDocuments))
      return T("Select a token actor before creating a Pulse Scanner item."), null;
    const a = re(t);
    if (a && !n.duplicate) return a;
    const r = {
      ...D(n),
      system: n.system ?? D(n).system
    }, [i] = await t.createEmbeddedDocuments("Item", [r]);
    return i ?? null;
  }
  async function pe(e = {}) {
    var a, r, i, l, c;
    if (!((a = game.user) != null && a.isGM) || !game.items || !e.force && !game.settings.get(s, "createWorldScannerItem")) return null;
    const n = Array.from(game.items).find((o) => z(o));
    if (n && !e.duplicate) return n;
    const t = D(e);
    try {
      const o = await Item.create(t, { renderSheet: !1 });
      return e.silent || (i = (r = ui.notifications) == null ? void 0 : r.info) == null || i.call(r, `${u}: created the Pulse Scanner item in the Items sidebar.`), o;
    } catch (o) {
      return console.error(`${u} | Could not create world Pulse Scanner item`, o), (c = (l = ui.notifications) == null ? void 0 : l.warn) == null || c.call(l, `${u}: could not create the world item. Check the browser console for details.`), null;
    }
  }
  async function ye(e = {}) {
    var t, a, r, i, l;
    if (!((t = game.user) != null && t.isGM) || !game.items) return null;
    const n = D(e);
    try {
      const c = await Item.create(n, { renderSheet: !1 });
      return e.silent || (r = (a = ui.notifications) == null ? void 0 : a.info) == null || r.call(a, `${u}: created ${c.name} in the Items sidebar.`), c;
    } catch (c) {
      return console.error(`${u} | Could not create scanner item`, c), (l = (i = ui.notifications) == null ? void 0 : i.warn) == null || l.call(i, `${u}: could not create the scanner item. Check the browser console for details.`), null;
    }
  }
  function D(e = {}) {
    const n = P(e.radiusFeet ?? game.settings.get(s, "scannerItemRadiusFeet"), 30), t = C.includes(e.mode) ? e.mode : ne();
    return {
      name: e.name || ce(),
      type: e.type || In(),
      img: e.img || U,
      flags: {
        [s]: {
          [E]: !0,
          scan: {
            radiusFeet: n,
            mode: t
          }
        }
      },
      system: e.system ?? {}
    };
  }
  function ne() {
    const e = game.settings.get(s, "scannerItemMode");
    return C.includes(e) ? e : X;
  }
  function sn(e) {
    var a, r, i, l, c, o, f;
    const n = Number(((r = (a = canvas == null ? void 0 : canvas.scene) == null ? void 0 : a.grid) == null ? void 0 : r.distance) ?? ((i = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : i.distance) ?? 5) || 5, t = Number(((l = canvas == null ? void 0 : canvas.grid) == null ? void 0 : l.size) ?? ((o = (c = canvas == null ? void 0 : canvas.scene) == null ? void 0 : c.grid) == null ? void 0 : o.size) ?? ((f = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : f.size) ?? 100) || 100;
    return Math.max(0, P(e, 30)) * t / n;
  }
  function cn(e) {
    return !!(Y(G((e == null ? void 0 : e.id) ?? e)) ?? re(Fe(e)));
  }
  function on(e, n = {}) {
    var t;
    return (t = game.user) != null && t.isGM || !be(n) || Y(e) ? !0 : (T("This token needs a Pulse Scanner item before it can scan."), !1);
  }
  function be(e = {}) {
    return e.requireItem === !1 ? !1 : !!game.settings.get(s, "requireScannerItem");
  }
  async function ve(e = {}) {
    if (!B("create scan targets")) return null;
    const n = N(e.sceneId) ?? canvas.scene;
    if (!n)
      return console.warn(`${u}: no scene was found for the new target.`), null;
    const t = R(n), a = O({ ...e, sceneId: n.id });
    return t[a.id] = a, await n.setFlag(s, p, t), j(), foundry.utils.deepClone(a);
  }
  function V(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    return _(e).filter((t) => {
      var a;
      return ((a = game.user) == null ? void 0 : a.isGM) || Bn(t);
    }).map((t) => {
      var a;
      return (a = game.user) != null && a.isGM ? foundry.utils.deepClone(t) : ae(t, !0);
    });
  }
  function _(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    const t = N(e);
    return t ? Object.values(R(t)).map((a) => O(a)).sort((a, r) => a.label.localeCompare(r.label)) : [];
  }
  async function Se(e, n = ((t) => (t = canvas == null ? void 0 : canvas.scene) == null ? void 0 : t.id)()) {
    if (!B("delete scan targets")) return !1;
    const a = N(n) ?? Le(e);
    if (!a)
      return console.warn(`${u}: target "${e}" was not found.`), !1;
    const r = R(a), i = ln(r, e);
    if (!i)
      return console.warn(`${u}: target "${e}" was not found on ${a.name}.`), !1;
    delete r[i], await a.update({ [`flags.${s}.${p}.-=${i}`]: null });
    const l = a.getFlag(s, p) ?? {};
    (l[i] || Object.values(l).some((o) => (o == null ? void 0 : o.id) === e)) && (await a.unsetFlag(s, p), Object.keys(r).length && await a.setFlag(s, p, r));
    const c = a.getFlag(s, p) ?? {};
    return c[i] || Object.values(c).some((o) => (o == null ? void 0 : o.id) === e) ? (console.error(`${u} | Delete failed`, { targetId: e, storeKey: i, scene: a, store: r, afterFallback: c }), !1) : (j(), !0);
  }
  function ln(e, n) {
    var t;
    return e[n] ? n : ((t = Object.entries(e).find(([, a]) => (a == null ? void 0 : a.id) === n)) == null ? void 0 : t[0]) ?? null;
  }
  async function te(e) {
    var t;
    const n = _((t = canvas.scene) == null ? void 0 : t.id).find((a) => a.id === e);
    return n ? H(e, { visibility: "revealed", status: n.status === "resolved" ? "resolved" : "revealed" }) : null;
  }
  async function we() {
    var n;
    if (!B("reveal scan targets")) return [];
    if (!b.latestScan || b.latestScan.sceneId !== ((n = canvas.scene) == null ? void 0 : n.id))
      return console.warn(`${u}: no latest scan is available for this scene.`), [];
    const e = [];
    for (const t of b.latestScan.targetIds) {
      const a = await te(t);
      a && e.push(a);
    }
    return e;
  }
  async function Ie(e) {
    return H(e, { visibility: "gm", status: "active" });
  }
  async function Te(e) {
    return H(e, { status: "resolved", visibility: "revealed" });
  }
  async function Pe(e) {
    return H(e, { status: "active", visibility: "gm" });
  }
  function un(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    var r, i;
    const t = N(e);
    if (!t) return null;
    const a = {
      module: s,
      version: ((i = (r = game.modules) == null ? void 0 : r.get(s)) == null ? void 0 : i.version) ?? "0.1.0",
      sceneId: t.id,
      sceneName: t.name,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      targets: _(t.id)
    };
    return Nn(`pulse-scanner-${xn(t.name)}.json`, a), a;
  }
  async function Me(e, { merge: n = !0, sceneId: t = ((a) => (a = canvas == null ? void 0 : canvas.scene) == null ? void 0 : a.id)() } = {}) {
    if (!B("import scan targets")) return [];
    const r = N(t);
    if (!r) return [];
    let i;
    try {
      i = typeof e == "string" ? JSON.parse(e) : e;
    } catch (f) {
      return console.error(`${u} | Import failed`, f), [];
    }
    const l = Array.isArray(i) ? i : i == null ? void 0 : i.targets;
    if (!Array.isArray(l))
      return console.warn(`${u}: import JSON must contain a targets array.`), [];
    const c = n ? R(r) : {}, o = l.map((f) => O({
      ...f,
      id: f.id && !c[f.id] ? f.id : Re(),
      sceneId: r.id
    }));
    for (const f of o) c[f.id] = f;
    return await r.setFlag(s, p, c), j(), o;
  }
  async function H(e, n = {}, t = {}) {
    if (!B("edit scan targets")) return null;
    const a = Le(e) ?? N(n.sceneId) ?? canvas.scene;
    if (!a) return null;
    const r = R(a), i = r[e] ?? {}, l = O({ ...i, ...n, id: e, sceneId: a.id });
    return r[l.id] = l, await a.setFlag(s, p, r), t.refresh !== !1 && j(), foundry.utils.deepClone(l);
  }
  function R(e) {
    return foundry.utils.deepClone((e == null ? void 0 : e.getFlag(s, p)) ?? {});
  }
  function O(e = {}) {
    var n;
    return Hn(e, {
      createId: Re,
      sceneId: ((n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id) || ""
    });
  }
  function dn(e) {
    return Un(e);
  }
  function fn(e, n, t, a, r) {
    return jn(e, n, t, a, r);
  }
  function mn(e) {
    return Gn(e);
  }
  function gn(e) {
    return zn(e);
  }
  function hn(e) {
    return En(e);
  }
  function $e({ sceneId: e, origin: n, radius: t, duration: a, detected: r, userId: i, playerView: l, mode: c }) {
    return {
      sceneId: e,
      origin: n,
      radius: t,
      duration: a,
      userId: i,
      playerView: l,
      mode: c,
      showLabels: l ? !!game.settings.get(s, "showLabelsToPlayers") : !0,
      showIntegrity: l ? !!game.settings.get(s, "showIntegrityToPlayers") : !0,
      detected: r.map((o) => ae(o, l))
    };
  }
  function ae(e, n) {
    return qn(e, n);
  }
  function Ne(e = {}) {
    var l, c, o, f, m, h, v;
    if (!(canvas != null && canvas.ready) || e.sceneId !== ((l = canvas.scene) == null ? void 0 : l.id)) return;
    const n = Math.max(900, Number(e.duration || 4200)), t = document.createElement("div");
    t.className = "pulse-scanner-overlay", t.dataset.cameraLocked = "true", t.style.setProperty("--pulse-duration", `${n}ms`), document.body.appendChild(t), pn(n + 650);
    const a = xe(((c = e.origin) == null ? void 0 : c.x) ?? 0, ((o = e.origin) == null ? void 0 : o.y) ?? 0), r = Math.max(16, Ce(Number(e.radius || 0))), i = document.createElement("div");
    if (i.className = "pulse-scanner-ring", i.style.left = `${a.x}px`, i.style.top = `${a.y}px`, i.style.setProperty("--pulse-radius", `${r}px`), i.style.setProperty("--pulse-color", ((f = J[e.mode]) == null ? void 0 : f.color) ?? "#7df9ff"), t.appendChild(i), !((m = e.detected) != null && m.length)) {
      const y = document.createElement("div");
      y.className = "pulse-scanner-empty", y.textContent = "NO SIGNATURES DETECTED", y.style.left = `${a.x}px`, y.style.top = `${a.y}px`, t.appendChild(y);
    }
    for (const y of e.detected ?? []) {
      const S = xe(y.x, y.y), w = document.createElement("div");
      if (w.className = `pulse-scanner-target pulse-scanner-target-${y.type}`, w.style.left = `${S.x}px`, w.style.top = `${S.y}px`, w.style.setProperty("--target-color", y.color || ((h = I[y.type]) == null ? void 0 : h.color) || I.custom.color), w.style.setProperty("--target-size", `${Math.max(28, Ce(hn(y) || 80) * 2)}px`), t.appendChild(w), e.showLabels) {
        const M = document.createElement("div");
        M.className = "pulse-scanner-label", M.style.left = `${S.x}px`, M.style.top = `${S.y}px`, M.style.setProperty("--target-color", y.color || ((v = I[y.type]) == null ? void 0 : v.color) || I.custom.color), M.innerHTML = yn(y, e.showIntegrity), t.appendChild(M);
      }
    }
    window.setTimeout(() => t.remove(), n + 650);
  }
  function pn(e) {
    var l, c, o, f, m;
    if (!(canvas != null && canvas.mouseInteractionManager)) return;
    const n = canvas.mouseInteractionManager, t = {
      dragLeftMove: (l = n.callbacks) == null ? void 0 : l.dragLeftMove,
      dragRightMove: (c = n.callbacks) == null ? void 0 : c.dragRightMove,
      longPress: (o = n.callbacks) == null ? void 0 : o.longPress
    }, a = () => {
    };
    n.callbacks && (n.callbacks.dragLeftMove = a, n.callbacks.dragRightMove = a, n.callbacks.longPress = a);
    const r = ((f = canvas.app) == null ? void 0 : f.view) ?? ((m = canvas.element) == null ? void 0 : m[0]) ?? document.querySelector("#board"), i = (h) => {
      h.preventDefault(), h.stopPropagation();
    };
    r && r.addEventListener("wheel", i, { capture: !0, passive: !1 }), window.setTimeout(() => {
      n.callbacks && (n.callbacks.dragLeftMove = t.dragLeftMove, n.callbacks.dragRightMove = t.dragRightMove, n.callbacks.longPress = t.longPress), r && r.removeEventListener("wheel", i, { capture: !0 });
    }, e);
  }
  function yn(e, n) {
    var f, m;
    const t = x(e.label || ((f = I[e.type]) == null ? void 0 : f.label) || "Signature"), a = x(e.description || ""), r = Mn(Number(e.integrity ?? 0), 0, 100), i = e.type === "breakable";
    e.type !== "custom" && `${x(((m = I[e.type]) == null ? void 0 : m.label) || "")}`;
    let c = "";
    n && i && (c = `<small>Integrity</small><div class="pulse-scanner-integrity-bar"><span style="width: ${r}%;"></span></div>`);
    const o = a ? `<small class="pulse-scanner-description">${a}</small>` : "";
    return `<span class="pulse-scanner-label-row"><strong>${t}</strong></span>${c}${o}`;
  }
  function bn(e = {}) {
    var n, t;
    if (e.action === "scan-results") {
      if (((n = e.payload) == null ? void 0 : n.userId) === ((t = game.user) == null ? void 0 : t.id)) return;
      Ne(e.payload);
    }
  }
  function xe(e, n) {
    try {
      const t = canvas.stage.worldTransform.apply(new PIXI.Point(Number(e), Number(n))), a = canvas.app.view.getBoundingClientRect();
      return { x: a.left + t.x, y: a.top + t.y };
    } catch {
      return { x: Number(e), y: Number(n) };
    }
  }
  function Ce(e) {
    var t, a;
    const n = ((a = (t = canvas == null ? void 0 : canvas.stage) == null ? void 0 : t.scale) == null ? void 0 : a.x) ?? 1;
    return Number(e) * n;
  }
  function G(e) {
    var n, t, a, r, i;
    return e ? ((n = canvas.tokens) == null ? void 0 : n.get(e)) ?? ((a = (t = canvas.tokens) == null ? void 0 : t.placeables) == null ? void 0 : a.find((l) => {
      var c;
      return l.id === e || ((c = l.document) == null ? void 0 : c.id) === e;
    })) : ((i = (r = canvas.tokens) == null ? void 0 : r.controlled) == null ? void 0 : i[0]) ?? null;
  }
  function Ee(e) {
    var a, r, i, l;
    const n = e == null ? void 0 : e.actor;
    if (!n) return null;
    const t = (r = (a = canvas.tokens) == null ? void 0 : a.controlled) == null ? void 0 : r.find((c) => {
      var o;
      return ((o = c.actor) == null ? void 0 : o.id) === n.id;
    });
    return t || (((l = (i = canvas.tokens) == null ? void 0 : i.placeables) == null ? void 0 : l.find((c) => {
      var o;
      return ((o = c.actor) == null ? void 0 : o.id) === n.id && vn(c);
    })) ?? null);
  }
  function vn(e) {
    var n, t;
    return !!(e != null && e.isOwner || (n = e == null ? void 0 : e.document) != null && n.isOwner || (t = e == null ? void 0 : e.actor) != null && t.isOwner);
  }
  function Fe(e) {
    var n, t, a, r, i, l;
    if (!e) return ((a = (t = (n = canvas.tokens) == null ? void 0 : n.controlled) == null ? void 0 : t[0]) == null ? void 0 : a.actor) ?? ((r = game.user) == null ? void 0 : r.character) ?? null;
    if (e.actor) return e.actor;
    if ((i = e.document) != null && i.actor) return e.document.actor;
    if (e.items) return e;
    if (typeof e == "string") {
      const c = G(e);
      return (c == null ? void 0 : c.actor) ?? ((l = game.actors) == null ? void 0 : l.get(e)) ?? null;
    }
    return null;
  }
  function Y(e) {
    return e != null && e.actor ? re(e.actor) : null;
  }
  function re(e) {
    return Ae(e)[0] ?? null;
  }
  function se(e) {
    return e != null && e.actor ? Ae(e.actor) : [];
  }
  function Ae(e) {
    return Array.from((e == null ? void 0 : e.items) ?? []).filter((t) => z(t));
  }
  function ie(e, n) {
    return n ? se(e).find((t) => t.id === n) ?? null : null;
  }
  async function Sn(e) {
    var i, l, c, o;
    const n = se(e), t = e.id ?? ((i = e.document) == null ? void 0 : i.id);
    if (!n.length)
      return T("This token needs a Pulse Scanner item before it can scan."), [];
    if (n.length === 1) return L({ tokenId: t, item: n[0] });
    const a = globalThis.Dialog ?? ((o = (c = (l = globalThis.foundry) == null ? void 0 : l.appv1) == null ? void 0 : c.api) == null ? void 0 : o.Dialog);
    if (!a) return L({ tokenId: t, item: n[0] });
    const r = n.map((f, m) => {
      const h = wn(f), v = ee(f), y = v ? ` - ${v.current}/${v.max} charges` : "", S = m === 0 ? "checked" : "";
      return `
        <label class="pulse-scanner-choice">
          <input type="radio" name="pulseScannerItemId" value="${x(f.id)}" ${S}>
          <span>
            <strong>${x(f.name)}</strong>
            <small>${x(A(h.mode))} / ${Number(h.radiusFeet)} ft${x(y)}</small>
          </span>
        </label>
      `;
    }).join("");
    return new Promise((f) => {
      new a({
        title: "Choose Pulse Scanner",
        content: `<form class="pulse-scanner-choice-dialog">${r}</form>`,
        buttons: {
          scan: {
            icon: '<i class="fa-solid fa-wave-square"></i>',
            label: "Scan",
            callback: async (m) => {
              var S, w;
              const h = (m == null ? void 0 : m[0]) ?? m, v = (w = (S = h == null ? void 0 : h.querySelector) == null ? void 0 : S.call(h, "[name='pulseScannerItemId']:checked")) == null ? void 0 : w.value, y = ie(e, v) ?? n[0];
              f(await L({ tokenId: t, item: y }));
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
  function wn(e) {
    var t;
    const n = ((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, s, "scan")) ?? {};
    return {
      mode: C.includes(n.mode) ? n.mode : ne(),
      radiusFeet: P(n.radiusFeet, game.settings.get(s, "scannerItemRadiusFeet"))
    };
  }
  function z(e) {
    var n;
    return e ? (n = e.getFlag) != null && n.call(e, s, E) ? !0 : ke(e.name) === ke(ce()) : !1;
  }
  function ce() {
    return String(game.settings.get(s, "scannerItemName") || F).trim() || F;
  }
  function ke(e) {
    return String(e || "").trim().toLowerCase();
  }
  function In() {
    var t, a;
    const e = ((a = (t = game.system) == null ? void 0 : t.documentTypes) == null ? void 0 : a.Item) ?? [], n = Array.isArray(e) ? e : e instanceof Set ? Array.from(e) : e && typeof e == "object" ? Object.keys(e) : [];
    return n.includes("equipment") ? "equipment" : n.includes("tool") ? "tool" : n.includes("gear") ? "gear" : n.includes("loot") ? "loot" : n[0] ?? "item";
  }
  function Tn(e) {
    var r, i;
    if (e.center) return { x: e.center.x, y: e.center.y };
    const n = e.document ?? e, t = Number(n.width ?? 1) * Number(((r = canvas.grid) == null ? void 0 : r.size) ?? 100), a = Number(n.height ?? 1) * Number(((i = canvas.grid) == null ? void 0 : i.size) ?? 100);
    return { x: Number(n.x ?? e.x ?? 0) + t / 2, y: Number(n.y ?? e.y ?? 0) + a / 2 };
  }
  function N(e) {
    var n;
    return e ? ((n = game.scenes) == null ? void 0 : n.get(e)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
  }
  function Le(e) {
    for (const n of game.scenes ?? [])
      if (R(n)[e]) return n;
    return null;
  }
  function Pn(e, n) {
    if (!e) return "";
    const t = fe(e, n);
    return (t == null ? void 0 : t.name) || `Region ${e}`;
  }
  function j() {
    var e;
    (e = b.manager) != null && e.rendered && b.manager.render(!1);
  }
  function B(e) {
    var n;
    return (n = game.user) != null && n.isGM ? !0 : (console.warn(`${u}: only GMs can ${e}.`), !1);
  }
  function Re() {
    var e, n;
    return ((n = (e = foundry.utils).randomID) == null ? void 0 : n.call(e, 16)) ?? crypto.randomUUID();
  }
  function T(e) {
    var n, t;
    (t = (n = ui.notifications) == null ? void 0 : n.warn) == null || t.call(n, e), console.warn(`${u}: ${e}`);
  }
  function A(e) {
    return String(e || "").replace(/[-_]/g, " ").replace(/\b\w/g, (n) => n.toUpperCase());
  }
  function P(e, n) {
    const t = Number(e);
    return Number.isFinite(t) ? t : n;
  }
  function Mn(e, n, t) {
    return Math.max(n, Math.min(t, e));
  }
  function $n() {
    var t, a;
    const e = String(game.settings.get(s, "scanSound") || "").trim();
    if (!e) return;
    const n = globalThis.AudioHelper ?? ((t = foundry.audio) == null ? void 0 : t.AudioHelper);
    (a = n == null ? void 0 : n.play) == null || a.call(n, { src: e, volume: 0.65, autoplay: !0, loop: !1 }, !0);
  }
  function Nn(e, n) {
    const t = new Blob([JSON.stringify(n, null, 2)], { type: "application/json" }), a = URL.createObjectURL(t), r = document.createElement("a");
    r.href = a, r.download = e, r.click(), URL.revokeObjectURL(a);
  }
  function xn(e) {
    return String(e || "scene").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "scene";
  }
  function x(e) {
    return String(e ?? "").replace(/[&<>"']/g, (n) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[n]);
  }
  class Cn extends ze {
    constructor(n = {}) {
      super(n), this.selectedTargetId = n.targetId ?? null, this.draftTarget = null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "pulse-scanner-target-manager",
        title: "Pulse Scanner Target Manager",
        template: `${g}/target-manager.hbs`,
        classes: ["pulse-scanner", "pulse-scanner-manager"],
        width: 1080,
        height: 720,
        resizable: !0
      });
    }
    getData() {
      var l, c;
      const n = (canvas == null ? void 0 : canvas.scene) ?? ((l = game.scenes) == null ? void 0 : l.current) ?? null, t = V(n == null ? void 0 : n.id), a = t.map((o) => ({
        ...o,
        isResolved: o.status === "resolved",
        regionName: o.regionId ? Pn(o.regionId, n == null ? void 0 : n.id) : ""
      })), r = this.draftTarget ?? t.find((o) => o.id === this.selectedTargetId) ?? t[0] ?? O({ sceneId: n == null ? void 0 : n.id }), i = {
        ...r,
        statLabel: ((c = I[r.type]) == null ? void 0 : c.stat) ?? "Intensity"
      };
      return !this.draftTarget && !this.selectedTargetId && t[0] && (this.selectedTargetId = t[0].id), {
        scene: n,
        targets: a,
        selectedTarget: i,
        typeOptions: le.map((o) => {
          var f;
          return { value: o, label: ((f = I[o]) == null ? void 0 : f.label) ?? A(o) };
        }),
        modeOptions: C.map((o) => {
          var f;
          return { value: o, label: ((f = J[o]) == null ? void 0 : f.label) ?? A(o) };
        }),
        colorOptions: dn(r.color),
        visibilityOptions: _e.map((o) => ({ value: o, label: A(o) })),
        statusOptions: He.map((o) => ({ value: o, label: A(o) })),
        regionChoices: en(n == null ? void 0 : n.id, r.regionId),
        hasTargets: t.length > 0,
        scannerItem: {
          name: ce(),
          mode: ne(),
          radiusFeet: game.settings.get(s, "scannerItemRadiusFeet")
        }
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
      }), n.find(".ps-type-select").on("change", (t) => {
        const a = t.currentTarget.value, r = n.find(".ps-integrity-group");
        a === "breakable" ? r.show() : r.hide();
      });
    }
    async _handleAction(n) {
      var i;
      n.preventDefault(), n.stopPropagation();
      const t = n.currentTarget, a = t.dataset.action, r = t.dataset.targetId ?? ((i = t.closest("[data-target-id]")) == null ? void 0 : i.dataset.targetId) ?? this.selectedTargetId;
      if (a === "new-target") return this._startNewTarget();
      if (a === "save-target") return this._saveForm(t.closest("form"));
      if (a === "create-scanner-item-config") return this._createScannerItemConfig(t.closest("form"));
      if (a === "delete-target") return this._deleteTarget(r);
      if (a === "reveal-target") return this._revealTarget(r);
      if (a === "hide-target") return this._hideTarget(r);
      if (a === "toggle-resolved") return this._toggleResolved(r);
    }
    _startNewTarget() {
      var n;
      this.draftTarget = O({ sceneId: (n = canvas.scene) == null ? void 0 : n.id, label: "New Scan Target" }), this.selectedTargetId = null, this.render(!1), window.setTimeout(() => {
        var a, r, i;
        const t = (i = (r = (a = this.element) == null ? void 0 : a.find) == null ? void 0 : r.call(a, "form.pulse-scanner-target-form")) == null ? void 0 : i[0];
        t && (t.elements.label.focus(), t.elements.label.select());
      }, 20);
    }
    async _saveForm(n) {
      var i, l;
      if (!n) return;
      const t = new FormData(n), a = Object.fromEntries(t.entries()), r = {
        ...a,
        sceneId: (i = canvas.scene) == null ? void 0 : i.id,
        regionId: a.regionId || "",
        integrity: a.integrity
      };
      if (a.id && V((l = canvas.scene) == null ? void 0 : l.id).some((c) => c.id === a.id))
        await H(a.id, r), this.selectedTargetId = a.id;
      else {
        const c = await ve(r);
        this.selectedTargetId = (c == null ? void 0 : c.id) ?? this.selectedTargetId;
      }
      this.draftTarget = null, this.render(!1);
    }
    async _createScannerItemConfig(n) {
      if (!n) return;
      const t = new FormData(n), a = String(t.get("scannerItemName") || F).trim() || F, r = C.includes(t.get("scannerItemMode")) ? t.get("scannerItemMode") : X, i = Math.max(0, P(t.get("scannerItemRadiusFeet"), 30));
      await game.settings.set(s, "scannerItemName", a), await game.settings.set(s, "scannerItemMode", r), await game.settings.set(s, "scannerItemRadiusFeet", i), await ye({ name: a, mode: r, radiusFeet: i }), this.render(!1);
    }
    async _revealTarget(n) {
      n && (await te(n), this.render(!1));
    }
    async _revealLatest() {
      await we(), this.render(!1);
    }
    async _hideTarget(n) {
      n && (await Ie(n), this.render(!1));
    }
    async _toggleResolved(n) {
      var a;
      if (!n) return;
      const t = _((a = canvas.scene) == null ? void 0 : a.id).find((r) => r.id === n);
      (t == null ? void 0 : t.status) === "resolved" ? await Pe(n) : await Te(n), this.render(!1);
    }
    _openImportDialog() {
      new Dialog({
        title: "Import Pulse Scanner Targets",
        content: `<form><textarea name="json" rows="12" style="width:100%;" placeholder='{"targets":[]}'></textarea></form>`,
        buttons: {
          import: {
            icon: '<i class="fa-solid fa-file-import"></i>',
            label: "Import",
            callback: (t) => Me(t.find("textarea[name='json']").val())
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
      var t, a, r;
      n && (await Se(n, (t = canvas.scene) == null ? void 0 : t.id), this.selectedTargetId = ((r = V((a = canvas.scene) == null ? void 0 : a.id)[0]) == null ? void 0 : r.id) ?? null, this.draftTarget = null, this.render(!1));
    }
  }
})();
