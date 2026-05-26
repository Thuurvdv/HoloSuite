(() => {
  var $e, Ee;
  const u = "pulse-scanner", g = "Pulse Scanner", V = `module.${u}`, F = `modules/${u}/templates`, v = "targets", J = "structural", G = "breakable", E = "circle", R = [
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
  ], K = ["gm", "revealed", "always"], Q = ["active", "revealed", "resolved"], H = ["circle", "rectangle"], A = ["structural", "arcane", "thermal", "forensic", "tech", "biological"], _ = {
    structural: { label: "Structural", color: "#ffb347", icon: "fa-solid fa-building-shield", types: ["breakable", "hidden"] },
    arcane: { label: "Arcane", color: "#c77dff", icon: "fa-solid fa-wand-sparkles", types: ["magic", "hidden", "custom"] },
    thermal: { label: "Thermal", color: "#ff4d6d", icon: "fa-solid fa-temperature-high", types: ["trap", "biological", "radiation"] },
    forensic: { label: "Forensic", color: "#f7f7f2", icon: "fa-solid fa-fingerprint", types: ["evidence", "loot", "biological"] },
    tech: { label: "Tech", color: "#39ffb6", icon: "fa-solid fa-microchip", types: ["tech", "radiation", "hidden"] },
    biological: { label: "Biological", color: "#8fd14f", icon: "fa-solid fa-dna", types: ["biological", "evidence"] }
  }, m = {
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
  }, U = [
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
  ], s = {
    manager: null,
    lastMouseScenePosition: null,
    mouseTrackingCanvas: null,
    placementActive: !1,
    placementShape: E,
    markerLayer: null,
    markerSceneId: null,
    draggingMarker: null,
    resizingMarker: null,
    liveMarker: null,
    liveUpdates: null,
    latestScan: null
  }, ze = globalThis.Application ?? ((Ee = ($e = foundry.appv1) == null ? void 0 : $e.api) == null ? void 0 : Ee.Application);
  Hooks.once("init", async () => {
    Le(), Re(), await loadTemplates([
      `${F}/target-manager.hbs`,
      `${F}/target-form.hbs`
    ]), console.log(`${g} | Initialized`);
  }), Hooks.once("ready", () => {
    var n;
    game.pulseScanner = _e();
    const e = game.modules.get(u);
    e && (e.api = game.pulseScanner), De(), (n = game.socket) == null || n.on(V, Ye), console.log(`${g} | API available at game.pulseScanner`);
  }), Hooks.on("canvasReady", nn), Hooks.on("canvasReady", O), Hooks.on("updateScene", (e, n = {}) => {
    var t, r, a;
    s.draggingMarker || s.resizingMarker || e.id === ((t = canvas == null ? void 0 : canvas.scene) == null ? void 0 : t.id) && ((a = (r = n.flags) == null ? void 0 : r[u]) != null && a[v]) && O();
  });
  function Le() {
    game.settings.register(u, "defaultScanRadius", {
      name: "Default Scan Radius",
      hint: "The default pulse radius in scene pixels.",
      scope: "world",
      config: !0,
      type: Number,
      default: 600
    }), game.settings.register(u, "allowPlayersToScan", {
      name: "Allow Players to Scan",
      hint: "Allow non-GM users to activate scanner pulses from controlled tokens.",
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0
    }), game.settings.register(u, "defaultHighlightDuration", {
      name: "Default Highlight Duration",
      hint: "How long detected target highlights remain visible, in milliseconds.",
      scope: "world",
      config: !0,
      type: Number,
      default: 4200
    }), game.settings.register(u, "showIntegrityToPlayers", {
      name: "Show Integrity to Players",
      hint: "Show integrity values on player-visible scan labels for breakable targets.",
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0
    }), game.settings.register(u, "showLabelsToPlayers", {
      name: "Show Labels to Players",
      hint: "Show target labels to players when scan results are revealed.",
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0
    }), game.settings.register(u, "scanSound", {
      name: "Scan Pulse Sound",
      hint: "Optional audio path played when a scanner pulse fires.",
      scope: "world",
      config: !0,
      type: String,
      default: ""
    });
  }
  function Re() {
    Handlebars.registerHelper("psOption", (e, n) => e === n ? "selected" : ""), Handlebars.registerHelper("psFallback", (e, n) => e || n), Handlebars.registerHelper("psEq", (e, n) => e === n), Handlebars.registerHelper("psTypeLabel", (e) => {
      var n;
      return ((n = m[e]) == null ? void 0 : n.label) ?? I(e);
    }), Handlebars.registerHelper("psModeLabel", (e) => {
      var n;
      return ((n = _[e]) == null ? void 0 : n.label) ?? I(e);
    });
  }
  function _e() {
    return {
      openTargetManager: ee,
      scan: X,
      createTarget: B,
      getTargets: z,
      deleteTarget: ne,
      revealTarget: j,
      revealLatestScan: te,
      hideTarget: re,
      resolveTarget: ae,
      unresolveTarget: se,
      exportTargets: Ge,
      importTargets: ie,
      togglePlacementTool: Z
    };
  }
  function De() {
    const e = game.modules.get("holosuite-core"), n = e != null && e.active ? e.api : null;
    return n != null && n.registerApp ? (n.registerApp({
      id: u,
      title: "Pulse Scanner",
      icon: "fa-solid fa-wave-square",
      premium: !1,
      featureId: u,
      description: "Scan scenes, reveal targets, and manage sensor signatures.",
      open: () => {
        var t;
        return (t = game.user) != null && t.isGM ? ee() : X();
      }
    }), !0) : !1;
  }
  function Z(e) {
    return x("place scan targets") ? (s.placementActive = typeof e == "boolean" ? e : !s.placementActive, O(), s.placementActive) : !1;
  }
  function Oe(e) {
    return x("place scan targets") ? (s.placementShape = H.includes(e) ? e : E, s.placementActive = !0, k(), s.placementShape) : E;
  }
  function ee() {
    var e;
    return (e = game.user) != null && e.isGM ? (s.manager || (s.manager = new Ce()), s.manager.render(!0), s.manager) : (console.warn(`${g}: only GMs can manage scan targets.`), null);
  }
  async function X(e = {}) {
    var p, h, f, y, b, w, Ae;
    if (!(canvas != null && canvas.ready) || !canvas.scene)
      return console.warn(`${g}: no active scene is ready.`), [];
    if (!((p = game.user) != null && p.isGM) && !game.settings.get(u, "allowPlayersToScan"))
      return console.warn(`${g}: players are not allowed to scan in this world.`), [];
    const n = sn(e.tokenId);
    if (!n)
      return console.warn(`${g}: select a token or pass tokenId.`), [];
    const t = Number(e.radius ?? game.settings.get(u, "defaultScanRadius")), r = Xe(e.types), a = Be(e.modes ?? e.mode), i = Se(n), o = z(canvas.scene.id).filter((C) => Ue(C, i, t, r, a)), c = Number(e.duration ?? game.settings.get(u, "defaultHighlightDuration"));
    s.latestScan = {
      sceneId: canvas.scene.id,
      targetIds: o.map((C) => C.id),
      timestamp: Date.now()
    };
    const d = ce({
      sceneId: canvas.scene.id,
      origin: i,
      radius: t,
      duration: c,
      detected: o,
      userId: (h = game.user) == null ? void 0 : h.id,
      playerView: !((f = game.user) != null && f.isGM),
      mode: (a == null ? void 0 : a.values().next().value) ?? null
    });
    if (cn(), ue(d), (y = game.user) != null && y.isGM && e.revealToPlayers) {
      const C = ce({
        sceneId: canvas.scene.id,
        origin: i,
        radius: t,
        duration: c,
        detected: o,
        userId: (b = game.user) == null ? void 0 : b.id,
        playerView: !0,
        mode: (a == null ? void 0 : a.values().next().value) ?? null
      });
      (w = game.socket) == null || w.emit(V, { action: "scan-results", payload: C });
    }
    return (Ae = game.user) != null && Ae.isGM ? foundry.utils.deepClone(o) : o.map((C) => Y(C));
  }
  async function B(e = {}) {
    if (!x("create scan targets")) return null;
    const n = $(e.sceneId) ?? canvas.scene;
    if (!n)
      return console.warn(`${g}: no scene was found for the new target.`), null;
    const t = N(n), r = S({ ...e, sceneId: n.id });
    return t[r.id] = r, await n.setFlag(u, v, t), k(), foundry.utils.deepClone(r);
  }
  function z(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    return M(e).map((t) => {
      var r;
      return (r = game.user) != null && r.isGM ? foundry.utils.deepClone(t) : Y(t);
    });
  }
  function M(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    const t = $(e);
    return t ? Object.values(N(t)).map((r) => S(r)).sort((r, a) => r.label.localeCompare(a.label)) : [];
  }
  async function ne(e, n = ((t) => (t = canvas == null ? void 0 : canvas.scene) == null ? void 0 : t.id)()) {
    if (!x("delete scan targets")) return !1;
    s.draggingMarker = null, s.resizingMarker = null, s.liveMarker = null, s.liveUpdates = null;
    const r = $(n) ?? ke(e);
    if (!r)
      return console.warn(`${g}: target "${e}" was not found.`), !1;
    const a = N(r), i = Fe(a, e);
    if (!i)
      return console.warn(`${g}: target "${e}" was not found on ${r.name}.`), !1;
    delete a[i], await r.update({ [`flags.${u}.${v}.-=${i}`]: null });
    const l = r.getFlag(u, v) ?? {};
    (l[i] || Object.values(l).some((c) => (c == null ? void 0 : c.id) === e)) && (await r.unsetFlag(u, v), Object.keys(a).length && await r.setFlag(u, v, a));
    const o = r.getFlag(u, v) ?? {};
    return o[i] || Object.values(o).some((c) => (c == null ? void 0 : c.id) === e) ? (console.error(`${g} | Delete failed`, { targetId: e, storeKey: i, scene: r, store: a, afterFallback: o }), !1) : (k(), !0);
  }
  function Fe(e, n) {
    var t;
    return e[n] ? n : ((t = Object.entries(e).find(([, r]) => (r == null ? void 0 : r.id) === n)) == null ? void 0 : t[0]) ?? null;
  }
  async function j(e) {
    var t;
    const n = M((t = canvas.scene) == null ? void 0 : t.id).find((r) => r.id === e);
    return n ? T(e, { visibility: "revealed", status: n.status === "resolved" ? "resolved" : "revealed" }) : null;
  }
  async function te() {
    var n;
    if (!x("reveal scan targets")) return [];
    if (!s.latestScan || s.latestScan.sceneId !== ((n = canvas.scene) == null ? void 0 : n.id))
      return console.warn(`${g}: no latest scan is available for this scene.`), [];
    const e = [];
    for (const t of s.latestScan.targetIds) {
      const r = await j(t);
      r && e.push(r);
    }
    return e;
  }
  async function re(e) {
    return T(e, { visibility: "gm", status: "active" });
  }
  async function ae(e) {
    return T(e, { status: "resolved", visibility: "revealed" });
  }
  async function se(e) {
    return T(e, { status: "active", visibility: "gm" });
  }
  function Ge(e = ((n) => (n = canvas == null ? void 0 : canvas.scene) == null ? void 0 : n.id)()) {
    var a, i;
    const t = $(e);
    if (!t) return null;
    const r = {
      module: u,
      version: ((i = (a = game.modules) == null ? void 0 : a.get(u)) == null ? void 0 : i.version) ?? "0.1.0",
      sceneId: t.id,
      sceneName: t.name,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      targets: M(t.id)
    };
    return un(`pulse-scanner-${dn(t.name)}.json`, r), r;
  }
  async function ie(e, { merge: n = !0, sceneId: t = ((r) => (r = canvas == null ? void 0 : canvas.scene) == null ? void 0 : r.id)() } = {}) {
    if (!x("import scan targets")) return [];
    const a = $(t);
    if (!a) return [];
    let i;
    try {
      i = typeof e == "string" ? JSON.parse(e) : e;
    } catch (d) {
      return console.error(`${g} | Import failed`, d), [];
    }
    const l = Array.isArray(i) ? i : i == null ? void 0 : i.targets;
    if (!Array.isArray(l))
      return console.warn(`${g}: import JSON must contain a targets array.`), [];
    const o = n ? N(a) : {}, c = l.map((d) => S({
      ...d,
      id: d.id && !o[d.id] ? d.id : xe(),
      sceneId: a.id
    }));
    for (const d of c) o[d.id] = d;
    return await a.setFlag(u, v, o), k(), c;
  }
  async function T(e, n = {}, t = {}) {
    if (!x("edit scan targets")) return null;
    const r = ke(e) ?? $(n.sceneId) ?? canvas.scene;
    if (!r) return null;
    const a = N(r), i = a[e] ?? {}, l = S({ ...i, ...n, id: e, sceneId: r.id });
    return a[l.id] = l, await r.setFlag(u, v, a), t.refresh !== !1 && k(), foundry.utils.deepClone(l);
  }
  function N(e) {
    return foundry.utils.deepClone((e == null ? void 0 : e.getFlag(u, v)) ?? {});
  }
  function S(e = {}) {
    var l;
    const n = R.includes(e.type) ? e.type : G, t = m[n] ?? m.custom, r = A.includes(e.mode) ? e.mode : le(n), a = H.includes(e.shape) ? e.shape : E, i = Q.includes(e.status) ? e.status : e.resolved ? "resolved" : "active";
    return {
      id: String(e.id || xe()),
      sceneId: String(e.sceneId || ((l = canvas == null ? void 0 : canvas.scene) == null ? void 0 : l.id) || ""),
      x: P(e.x, 0),
      y: P(e.y, 0),
      radius: Math.max(0, P(e.radius, 80)),
      shape: a,
      width: Math.max(0, P(e.width, 160)),
      height: Math.max(0, P(e.height, 160)),
      mode: r,
      type: n,
      label: String(e.label || t.label),
      description: String(e.description || ""),
      integrity: Ie(P(e.integrity, 100), 0, 100),
      difficulty: P(e.difficulty, 10),
      visibility: K.includes(e.visibility) ? e.visibility : "gm",
      status: i,
      color: oe(e.color, t.color),
      icon: t.icon
    };
  }
  function le(e) {
    return A.find((n) => {
      var t, r;
      return (r = (t = _[n]) == null ? void 0 : t.types) == null ? void 0 : r.includes(e);
    }) ?? J;
  }
  function oe(e, n) {
    const t = String(e || n || "").trim();
    return t.startsWith("#") ? t.toLowerCase() : t;
  }
  function He(e) {
    const n = oe(e, "");
    return !n || U.some((t) => t.value === n) ? U : [{ label: `Current (${n})`, value: n }, ...U];
  }
  function Ue(e, n, t, r, a) {
    return e.status === "resolved" || r != null && r.size && !r.has(e.type) || a != null && a.size && !a.has(e.mode) ? !1 : Math.hypot(Number(e.x) - n.x, Number(e.y) - n.y) <= Number(t) + D(e);
  }
  function Xe(e) {
    if (!Array.isArray(e) || e.length === 0) return null;
    const n = e.map((t) => String(t).trim()).filter((t) => R.includes(t));
    return n.length ? new Set(n) : null;
  }
  function Be(e) {
    const t = (Array.isArray(e) ? e : e ? [e] : []).map((r) => String(r).trim()).filter((r) => A.includes(r));
    return t.length ? new Set(t) : null;
  }
  function D(e) {
    return e.shape === "rectangle" ? Math.hypot(Number(e.width || 0), Number(e.height || 0)) / 2 : Number(e.radius || 0);
  }
  function ce({ sceneId: e, origin: n, radius: t, duration: r, detected: a, userId: i, playerView: l, mode: o }) {
    return {
      sceneId: e,
      origin: n,
      radius: t,
      duration: r,
      userId: i,
      playerView: l,
      mode: o,
      showLabels: l ? !!game.settings.get(u, "showLabelsToPlayers") : !0,
      showIntegrity: l ? !!game.settings.get(u, "showIntegrityToPlayers") : !0,
      detected: a.map((c) => Y(c))
    };
  }
  function Y(e, n) {
    return {
      id: e.id,
      sceneId: e.sceneId,
      x: e.x,
      y: e.y,
      radius: e.radius,
      shape: e.shape,
      width: e.width,
      height: e.height,
      mode: e.mode,
      type: e.type,
      label: e.label,
      description: e.description,
      integrity: e.integrity,
      difficulty: e.difficulty,
      visibility: e.visibility,
      status: e.status,
      color: e.color,
      icon: e.icon
    };
  }
  function ue(e = {}) {
    var i, l, o, c, d, p, h;
    if (!(canvas != null && canvas.ready) || e.sceneId !== ((i = canvas.scene) == null ? void 0 : i.id)) return;
    const n = document.createElement("div");
    n.className = "pulse-scanner-overlay", n.style.setProperty("--pulse-duration", `${Math.max(900, Number(e.duration || 4200))}ms`), document.body.appendChild(n);
    const t = Me(((l = e.origin) == null ? void 0 : l.x) ?? 0, ((o = e.origin) == null ? void 0 : o.y) ?? 0), r = Math.max(16, Te(Number(e.radius || 0))), a = document.createElement("div");
    if (a.className = "pulse-scanner-ring", a.style.left = `${t.x}px`, a.style.top = `${t.y}px`, a.style.setProperty("--pulse-radius", `${r}px`), a.style.setProperty("--pulse-color", ((c = _[e.mode]) == null ? void 0 : c.color) ?? "#7df9ff"), n.appendChild(a), !((d = e.detected) != null && d.length)) {
      const f = document.createElement("div");
      f.className = "pulse-scanner-empty", f.textContent = "NO SIGNATURES DETECTED", f.style.left = `${t.x}px`, f.style.top = `${t.y}px`, n.appendChild(f);
    }
    for (const f of e.detected ?? []) {
      const y = Me(f.x, f.y), b = document.createElement("div");
      if (b.className = `pulse-scanner-target pulse-scanner-target-${f.type}`, b.style.left = `${y.x}px`, b.style.top = `${y.y}px`, b.style.setProperty("--target-color", f.color || ((p = m[f.type]) == null ? void 0 : p.color) || m.custom.color), b.style.setProperty("--target-size", `${Math.max(28, Te(D(f) || 80) * 2)}px`), n.appendChild(b), e.showLabels) {
        const w = document.createElement("div");
        w.className = "pulse-scanner-label", w.style.left = `${y.x}px`, w.style.top = `${y.y}px`, w.style.setProperty("--target-color", f.color || ((h = m[f.type]) == null ? void 0 : h.color) || m.custom.color), w.innerHTML = je(f, e.showIntegrity), n.appendChild(w);
      }
    }
    window.setTimeout(() => n.remove(), Math.max(900, Number(e.duration || 4200)) + 650);
  }
  function je(e, n) {
    var d, p, h;
    const t = e.icon || ((d = m[e.type]) == null ? void 0 : d.icon) || m.custom.icon, r = q(e.label || ((p = m[e.type]) == null ? void 0 : p.label) || "Signature"), a = q(((h = m[e.type]) == null ? void 0 : h.label) || I(e.type)), i = Ie(Number(e.integrity ?? 0), 0, 100), l = e.type === "breakable", o = n && l ? `<span class="pulse-scanner-integrity">${i}%</span>` : "", c = n && l ? `<div class="pulse-scanner-integrity-bar"><span style="width: ${i}%;"></span></div><small>STRUCTURAL WEAKNESS: ${i}%</small>` : `<small>${a}</small>`;
    return `<span class="pulse-scanner-label-row"><i class="${q(t)}"></i><strong>${r}</strong>${o}</span>${c}`;
  }
  function Ye(e = {}) {
    var n, t;
    if (e.action === "scan-results") {
      if (((n = e.payload) == null ? void 0 : n.userId) === ((t = game.user) == null ? void 0 : t.id)) return;
      ue(e.payload);
    }
  }
  function O() {
    var r, a, i;
    if (!(canvas != null && canvas.ready) || !canvas.scene || !globalThis.PIXI) return;
    (r = s.markerLayer) != null && r.parent && s.markerLayer.parent.removeChild(s.markerLayer), (i = (a = s.markerLayer) == null ? void 0 : a.destroy) == null || i.call(a, { children: !0 });
    const e = canvas.interface ?? canvas.foreground ?? canvas.stage;
    if (!(e != null && e.addChild)) return;
    const n = new PIXI.Container();
    n.name = "pulse-scanner-target-markers", n.sortableChildren = !0, n.zIndex = 250, e.addChild(n), s.markerLayer = n, s.markerSceneId = canvas.scene.id;
    const t = M(canvas.scene.id).filter((l) => We(l));
    for (const l of t) n.addChild(qe(l));
  }
  function We(e) {
    var n;
    return (n = game.user) != null && n.isGM ? !0 : e.visibility === "revealed" || e.visibility === "always";
  }
  function qe(e) {
    var l, o, c;
    const n = new PIXI.Container();
    n.name = `pulse-scanner-target-${e.id}`, n.position.set(Number(e.x), Number(e.y)), n.eventMode = "none", n.interactive = !1, n.zIndex = e.status === "resolved" ? 1 : 5;
    const t = Pe(e), r = new PIXI.Graphics();
    de(r, e, t), n.addChild(r), (l = game.user) != null && l.isGM && ge(n, e, t);
    const a = fe(e, t);
    (o = game.user) != null && o.isGM && n.addChild(a);
    const i = new PIXI.Text(e.status === "resolved" ? `${e.label} [resolved]` : e.label, {
      fontFamily: "Arial",
      fontSize: 13,
      fill: 16777215,
      stroke: 0,
      strokeThickness: 3
    });
    return i.anchor.set(0.5, 1), i.position.set(0, -Math.max(28, D(e) + 8)), i.alpha = (c = game.user) != null && c.isGM ? 0.95 : 0.78, n.addChild(i), n;
  }
  function de(e, n, t) {
    const r = n.status === "resolved" ? 0.14 : n.visibility === "revealed" ? 0.2 : 0.1;
    e.clear(), e.lineStyle(2, t, n.status === "resolved" ? 0.42 : 0.82), e.beginFill(t, r), n.shape === "rectangle" ? e.drawRoundedRect(-n.width / 2, -n.height / 2, n.width, n.height, 8) : e.drawCircle(0, 0, Math.max(8, Number(n.radius || 80))), e.endFill(), e.lineStyle(1, t, 0.52), e.drawCircle(0, 0, 14);
  }
  function fe(e, n) {
    const t = new PIXI.Graphics();
    return t.name = `pulse-scanner-move-${e.id}`, t.eventMode = "static", t.interactive = !0, t.cursor = "move", t.hitArea = new PIXI.Circle(0, 0, 13), t.lineStyle(2, 16777215, 0.78), t.beginFill(n, 0.82), t.drawCircle(0, 0, 9), t.endFill(), t.lineStyle(1, 1053204, 0.9), t.moveTo(-5, 0), t.lineTo(5, 0), t.moveTo(0, -5), t.lineTo(0, 5), t.on("pointerdown", (r) => Ke(r, e, t.parent)).on("pointermove", (r) => Qe(r, e)).on("pointerup", () => W()).on("pointerupoutside", () => W()).on("rightclick", () => {
      s.manager = s.manager ?? new Ce({ targetId: e.id }), s.manager.selectedTargetId = e.id, s.manager.render(!0);
    }), t;
  }
  function ge(e, n, t) {
    if (n.shape === "rectangle") {
      const a = Math.max(10, Number(n.width || 160) / 2), i = Math.max(10, Number(n.height || 160) / 2);
      [
        ["nw", -a, -i],
        ["n", 0, -i],
        ["ne", a, -i],
        ["e", a, 0],
        ["se", a, i],
        ["s", 0, i],
        ["sw", -a, i],
        ["w", -a, 0]
      ].forEach(([l, o, c]) => e.addChild(me(n, l, o, c, t)));
      return;
    }
    const r = Math.max(12, Number(n.radius || 80));
    [
      ["radius-e", r, 0],
      ["radius-s", 0, r],
      ["radius-w", -r, 0],
      ["radius-n", 0, -r]
    ].forEach(([a, i, l]) => e.addChild(me(n, a, i, l, t)));
  }
  function me(e, n, t, r, a) {
    const i = new PIXI.Graphics();
    return i.name = `pulse-scanner-resize-${e.id}-${n}`, i.position.set(t, r), i.eventMode = "static", i.interactive = !0, i.cursor = Je(n), i.hitArea = new PIXI.Circle(0, 0, 12), i.beginFill(1053204, 0.92), i.lineStyle(2, a, 1), i.drawCircle(0, 0, 7), i.endFill(), i.on("pointerdown", (l) => Ve(l, e, n)), i;
  }
  function Ve(e, n, t) {
    var r, a, i;
    (r = game.user) != null && r.isGM && ((a = e.stopPropagation) == null || a.call(e), s.resizingMarker = {
      id: n.id,
      handle: t,
      center: { x: Number(n.x), y: Number(n.y) }
    }, s.liveMarker = ((i = e.currentTarget) == null ? void 0 : i.parent) ?? null, s.liveUpdates = null);
  }
  function Je(e) {
    return e.startsWith("radius") ? "move" : e === "n" || e === "s" ? "ns-resize" : e === "e" || e === "w" ? "ew-resize" : e === "nw" || e === "se" ? "nwse-resize" : e === "ne" || e === "sw" ? "nesw-resize" : "move";
  }
  function Ke(e, n, t) {
    var r, a;
    (r = game.user) != null && r.isGM && ((a = e.stopPropagation) == null || a.call(e), s.draggingMarker = {
      id: n.id,
      start: pe(e),
      origin: { x: Number(n.x), y: Number(n.y) }
    }, s.liveMarker = t ?? null, s.liveUpdates = null);
  }
  function Qe(e, n) {
    !s.draggingMarker || s.draggingMarker.id !== n.id || he(pe(e));
  }
  function pe(e) {
    var r, a;
    const n = (r = e.data) == null ? void 0 : r.originalEvent;
    if ((n == null ? void 0 : n.clientX) != null && (n == null ? void 0 : n.clientY) != null) return L(n.clientX, n.clientY);
    const t = e.global ?? ((a = e.data) == null ? void 0 : a.global);
    if (!t) return null;
    try {
      const i = canvas.stage.worldTransform.applyInverse(new PIXI.Point(t.x, t.y));
      return { x: Math.round(i.x), y: Math.round(i.y) };
    } catch {
      return null;
    }
  }
  async function W() {
    if (!s.draggingMarker) return !1;
    const e = s.draggingMarker.id, n = s.liveUpdates;
    return s.draggingMarker = null, s.liveMarker = null, s.liveUpdates = null, n && await T(e, n, { refresh: !1 }), k(), !0;
  }
  function he(e) {
    if (!s.draggingMarker || !(canvas != null && canvas.scene)) return !1;
    if (!e || !s.draggingMarker.start) return !0;
    const n = e.x - s.draggingMarker.start.x, t = e.y - s.draggingMarker.start.y, r = Math.round(s.draggingMarker.origin.x + n), a = Math.round(s.draggingMarker.origin.y + t);
    return s.liveMarker && s.liveMarker.position.set(r, a), s.liveUpdates = { x: r, y: a }, !0;
  }
  function Ze(e, n) {
    if (!s.resizingMarker || !(canvas != null && canvas.scene)) return !1;
    const t = L(e, n);
    if (!t) return !0;
    const r = M(canvas.scene.id).find((o) => o.id === s.resizingMarker.id);
    if (!r) return !0;
    const a = t.x - Number(r.x), i = t.y - Number(r.y), l = {};
    if (r.shape === "rectangle") {
      const o = s.resizingMarker.handle;
      (o.includes("e") || o.includes("w")) && (l.width = Math.max(24, Math.round(Math.abs(a) * 2))), (o.includes("n") || o.includes("s")) && (l.height = Math.max(24, Math.round(Math.abs(i) * 2)));
    } else
      l.radius = Math.max(12, Math.round(Math.hypot(a, i)));
    if (s.liveUpdates = l, s.liveMarker) {
      s.liveMarker.removeChildren();
      const o = S({ ...r, ...l }), c = Pe(o), d = new PIXI.Graphics();
      de(d, o, c), s.liveMarker.addChild(d), ge(s.liveMarker, o, c), s.liveMarker.addChild(fe(o, c));
    }
    return !0;
  }
  async function en() {
    if (!s.resizingMarker) return !1;
    const e = s.resizingMarker.id, n = s.liveUpdates;
    return s.resizingMarker = null, s.liveMarker = null, s.liveUpdates = null, n && await T(e, n, { refresh: !1 }), k(), !0;
  }
  function nn() {
    var n;
    const e = (n = canvas == null ? void 0 : canvas.app) == null ? void 0 : n.view;
    !e || s.mouseTrackingCanvas === e || (s.mouseTrackingCanvas && (s.mouseTrackingCanvas.removeEventListener("mousemove", ve), s.mouseTrackingCanvas.removeEventListener("pointerdown", ye), s.mouseTrackingCanvas.removeEventListener("pointermove", be), s.mouseTrackingCanvas.removeEventListener("pointerup", we)), e.addEventListener("mousemove", ve), e.addEventListener("pointerdown", ye), e.addEventListener("pointermove", be), e.addEventListener("pointerup", we), s.mouseTrackingCanvas = e);
  }
  function ve(e) {
    s.lastMouseScenePosition = L(e.clientX, e.clientY);
  }
  async function ye(e) {
    var a;
    if (!s.placementActive || !((a = game.user) != null && a.isGM) || !(canvas != null && canvas.scene) || s.resizingMarker || s.draggingMarker || e.button !== 0) return;
    const n = L(e.clientX, e.clientY);
    if (!n || an(n)) return;
    e.preventDefault(), e.stopPropagation();
    const t = rn(), r = await B({
      sceneId: canvas.scene.id,
      x: n.x,
      y: n.y,
      mode: t.mode,
      type: t.type,
      label: t.label,
      visibility: "gm",
      shape: tn(),
      radius: 80,
      width: 160,
      height: 160
    });
    s.manager && (s.manager.selectedTargetId = (r == null ? void 0 : r.id) ?? s.manager.selectedTargetId, s.manager.draftTarget = null, s.manager.render(!0));
  }
  function be(e) {
    !s.resizingMarker && !s.draggingMarker || (e.preventDefault(), s.draggingMarker && he(L(e.clientX, e.clientY)), s.resizingMarker && Ze(e.clientX, e.clientY));
  }
  function we(e) {
    !s.resizingMarker && !s.draggingMarker || (e.preventDefault(), s.draggingMarker && W().catch((n) => console.error(`${g} | Move failed`, n)), s.resizingMarker && en().catch((n) => console.error(`${g} | Resize failed`, n)));
  }
  function tn() {
    return H.includes(s.placementShape) ? s.placementShape : E;
  }
  function rn() {
    var a, i, l, o, c, d, p, h, f, y;
    const e = (o = (l = (i = (a = s.manager) == null ? void 0 : a.element) == null ? void 0 : i.find) == null ? void 0 : l.call(i, "form.pulse-scanner-target-form")) == null ? void 0 : o[0], n = (d = (c = e == null ? void 0 : e.elements) == null ? void 0 : c.type) == null ? void 0 : d.value, t = (h = (p = e == null ? void 0 : e.elements) == null ? void 0 : p.mode) == null ? void 0 : h.value, r = (y = (f = e == null ? void 0 : e.elements) == null ? void 0 : f.label) == null ? void 0 : y.value;
    return {
      type: R.includes(n) ? n : G,
      mode: A.includes(t) ? t : le(n || G),
      label: r || "Placed Scan Target"
    };
  }
  function an(e) {
    var n;
    return M((n = canvas.scene) == null ? void 0 : n.id).some((t) => {
      const r = Math.max(18, Math.min(D(t), 80));
      return Math.hypot(t.x - e.x, t.y - e.y) <= r;
    });
  }
  function Me(e, n) {
    try {
      const t = canvas.stage.worldTransform.apply(new PIXI.Point(Number(e), Number(n))), r = canvas.app.view.getBoundingClientRect();
      return { x: r.left + t.x, y: r.top + t.y };
    } catch {
      return { x: Number(e), y: Number(n) };
    }
  }
  function L(e, n) {
    try {
      const t = canvas.app.view.getBoundingClientRect(), r = canvas.stage.worldTransform.applyInverse(new PIXI.Point(e - t.left, n - t.top));
      return { x: Math.round(r.x), y: Math.round(r.y) };
    } catch {
      return null;
    }
  }
  function Te(e) {
    var t, r;
    const n = ((r = (t = canvas == null ? void 0 : canvas.stage) == null ? void 0 : t.scale) == null ? void 0 : r.x) ?? 1;
    return Number(e) * n;
  }
  function sn(e) {
    var n, t, r, a, i;
    return e ? ((n = canvas.tokens) == null ? void 0 : n.get(e)) ?? ((r = (t = canvas.tokens) == null ? void 0 : t.placeables) == null ? void 0 : r.find((l) => {
      var o;
      return l.id === e || ((o = l.document) == null ? void 0 : o.id) === e;
    })) : ((i = (a = canvas.tokens) == null ? void 0 : a.controlled) == null ? void 0 : i[0]) ?? null;
  }
  function Se(e) {
    var a, i;
    if (e.center) return { x: e.center.x, y: e.center.y };
    const n = e.document ?? e, t = Number(n.width ?? 1) * Number(((a = canvas.grid) == null ? void 0 : a.size) ?? 100), r = Number(n.height ?? 1) * Number(((i = canvas.grid) == null ? void 0 : i.size) ?? 100);
    return { x: Number(n.x ?? e.x ?? 0) + t / 2, y: Number(n.y ?? e.y ?? 0) + r / 2 };
  }
  function ln() {
    var n, t;
    const e = (t = (n = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : n.controlled) == null ? void 0 : t[0];
    return e ? Se(e) : null;
  }
  function $(e) {
    var n;
    return e ? ((n = game.scenes) == null ? void 0 : n.get(e)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
  }
  function ke(e) {
    for (const n of game.scenes ?? [])
      if (N(n)[e]) return n;
    return null;
  }
  function k() {
    var e;
    (e = s.manager) != null && e.rendered && s.manager.render(!1), !s.draggingMarker && !s.resizingMarker && O();
  }
  function x(e) {
    var n;
    return (n = game.user) != null && n.isGM ? !0 : (console.warn(`${g}: only GMs can ${e}.`), !1);
  }
  function xe() {
    var e, n;
    return ((n = (e = foundry.utils).randomID) == null ? void 0 : n.call(e, 16)) ?? crypto.randomUUID();
  }
  function I(e) {
    return String(e || "").replace(/[-_]/g, " ").replace(/\b\w/g, (n) => n.toUpperCase());
  }
  function P(e, n) {
    const t = Number(e);
    return Number.isFinite(t) ? t : n;
  }
  function Ie(e, n, t) {
    return Math.max(n, Math.min(t, e));
  }
  function on(e) {
    const n = String(e).trim().replace("#", ""), t = Number.parseInt(n.length === 3 ? n.split("").map((r) => `${r}${r}`).join("") : n, 16);
    return Number.isFinite(t) ? t : 8255999;
  }
  function Pe(e) {
    var n;
    return e.status === "resolved" ? 8095116 : on(e.color || ((n = m[e.type]) == null ? void 0 : n.color) || m.custom.color);
  }
  function cn() {
    var t, r;
    const e = String(game.settings.get(u, "scanSound") || "").trim();
    if (!e) return;
    const n = globalThis.AudioHelper ?? ((t = foundry.audio) == null ? void 0 : t.AudioHelper);
    (r = n == null ? void 0 : n.play) == null || r.call(n, { src: e, volume: 0.65, autoplay: !0, loop: !1 }, !0);
  }
  function un(e, n) {
    const t = new Blob([JSON.stringify(n, null, 2)], { type: "application/json" }), r = URL.createObjectURL(t), a = document.createElement("a");
    a.href = r, a.download = e, a.click(), URL.revokeObjectURL(r);
  }
  function dn(e) {
    return String(e || "scene").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "scene";
  }
  function q(e) {
    return String(e ?? "").replace(/[&<>"']/g, (n) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[n]);
  }
  class Ce extends ze {
    constructor(n = {}) {
      super(n), this.selectedTargetId = n.targetId ?? null, this.draftTarget = null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "pulse-scanner-target-manager",
        title: "Pulse Scanner Target Manager",
        template: `${F}/target-manager.hbs`,
        classes: ["pulse-scanner", "pulse-scanner-manager"],
        width: 900,
        height: "auto",
        resizable: !0
      });
    }
    getData() {
      var l, o;
      const n = (canvas == null ? void 0 : canvas.scene) ?? ((l = game.scenes) == null ? void 0 : l.current) ?? null, t = z(n == null ? void 0 : n.id), r = t.map((c) => ({
        ...c,
        isResolved: c.status === "resolved",
        isBreakable: c.type === "breakable"
      })), a = this.draftTarget ?? t.find((c) => c.id === this.selectedTargetId) ?? t[0] ?? S({ sceneId: n == null ? void 0 : n.id, ...Ne() }), i = {
        ...a,
        isBreakable: a.type === "breakable"
      };
      return !this.draftTarget && !this.selectedTargetId && t[0] && (this.selectedTargetId = t[0].id), {
        scene: n,
        targets: r,
        selectedTarget: i,
        typeOptions: R.map((c) => {
          var d;
          return { value: c, label: ((d = m[c]) == null ? void 0 : d.label) ?? I(c) };
        }),
        modeOptions: A.map((c) => {
          var d;
          return { value: c, label: ((d = _[c]) == null ? void 0 : d.label) ?? I(c) };
        }),
        colorOptions: He(a.color),
        visibilityOptions: K.map((c) => ({ value: c, label: I(c) })),
        statusOptions: Q.map((c) => ({ value: c, label: I(c) })),
        defaultRadius: game.settings.get(u, "defaultScanRadius"),
        hasTargets: t.length > 0,
        canUseMouse: !!s.lastMouseScenePosition,
        placementActive: s.placementActive,
        placementShape: s.placementShape,
        placementCircle: s.placementShape === "circle",
        placementRectangle: s.placementShape === "rectangle",
        latestScanCount: ((o = s.latestScan) == null ? void 0 : o.sceneId) === (n == null ? void 0 : n.id) ? s.latestScan.targetIds.length : 0
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
      if (r === "delete-target") return this._deleteTarget(a);
      if (r === "scan-selected") return X({ radius: Number(game.settings.get(u, "defaultScanRadius")), mode: t.dataset.mode || this._getCurrentMode() });
      if (r === "toggle-placement") return this._togglePlacement();
      if (r === "set-placement-shape") return this._setPlacementShape(t.dataset.shape);
      if (r === "reveal-target") return this._revealTarget(a);
      if (r === "reveal-latest") return this._revealLatest();
      if (r === "hide-target") return this._hideTarget(a);
      if (r === "toggle-resolved") return this._toggleResolved(a);
    }
    _startManualTarget() {
      var t;
      const n = Ne();
      this.draftTarget = S({ sceneId: (t = canvas.scene) == null ? void 0 : t.id, ...n, label: "New Scan Target" }), this.selectedTargetId = null, this.render(!1), window.setTimeout(() => {
        var a, i, l;
        const r = (l = (i = (a = this.element) == null ? void 0 : a.find) == null ? void 0 : i.call(a, "form.pulse-scanner-target-form")) == null ? void 0 : l[0];
        r && (r.elements.x.value = n.x, r.elements.y.value = n.y, r.elements.label.focus(), r.elements.label.select());
      }, 20);
    }
    async _saveForm(n) {
      var i, l;
      if (!n) return;
      const t = new FormData(n), r = Object.fromEntries(t.entries()), a = {
        ...r,
        sceneId: (i = canvas.scene) == null ? void 0 : i.id,
        x: r.x,
        y: r.y,
        radius: r.radius,
        integrity: r.integrity,
        difficulty: r.difficulty
      };
      if (r.id && z((l = canvas.scene) == null ? void 0 : l.id).some((o) => o.id === r.id))
        await T(r.id, a), this.selectedTargetId = r.id;
      else {
        const o = await B(a);
        this.selectedTargetId = (o == null ? void 0 : o.id) ?? this.selectedTargetId;
      }
      this.draftTarget = null, this.render(!1);
    }
    _getCurrentMode() {
      var t, r, a, i, l;
      const n = (a = (r = (t = this.element) == null ? void 0 : t.find) == null ? void 0 : r.call(t, "form.pulse-scanner-target-form")) == null ? void 0 : a[0];
      return ((l = (i = n == null ? void 0 : n.elements) == null ? void 0 : i.mode) == null ? void 0 : l.value) || J;
    }
    _togglePlacement() {
      Z(), this.render(!1);
    }
    _setPlacementShape(n) {
      Oe(n), this.render(!1);
    }
    async _revealTarget(n) {
      n && (await j(n), this.render(!1));
    }
    async _revealLatest() {
      await te(), this.render(!1);
    }
    async _hideTarget(n) {
      n && (await re(n), this.render(!1));
    }
    async _toggleResolved(n) {
      var r;
      if (!n) return;
      const t = M((r = canvas.scene) == null ? void 0 : r.id).find((a) => a.id === n);
      (t == null ? void 0 : t.status) === "resolved" ? await se(n) : await ae(n), this.render(!1);
    }
    _openImportDialog() {
      new Dialog({
        title: "Import Pulse Scanner Targets",
        content: `<form><textarea name="json" rows="12" style="width:100%;" placeholder='{"targets":[]}'></textarea></form>`,
        buttons: {
          import: {
            icon: '<i class="fa-solid fa-file-import"></i>',
            label: "Import",
            callback: (t) => ie(t.find("textarea[name='json']").val())
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
      n && (await ne(n, (t = canvas.scene) == null ? void 0 : t.id), this.selectedTargetId = ((a = z((r = canvas.scene) == null ? void 0 : r.id)[0]) == null ? void 0 : a.id) ?? null, this.draftTarget = null, this.render(!1));
    }
  }
  function Ne() {
    var e, n;
    return ln() ?? s.lastMouseScenePosition ?? { x: Math.round(((e = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : e.width) / 2 || 0), y: Math.round(((n = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : n.height) / 2 || 0) };
  }
})();
