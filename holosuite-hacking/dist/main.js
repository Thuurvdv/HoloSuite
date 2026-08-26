var Ot = Object.defineProperty;
var Et = (t, s, e) => s in t ? Ot(t, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[s] = e;
var m = (t, s, e) => Et(t, typeof s != "symbol" ? s + "" : s, e);
const O = {
  critical_success: {
    profileId: "critical_success",
    id: "critical_success",
    label: "Critical Success",
    traceDurationSeconds: 95,
    hintsEnabled: !0,
    visualGlitchIntensity: 0.15,
    nodeIntrusion: {
      traceDurationSeconds: 95,
      nodeCount: 14,
      firewallCount: 2,
      decoyCount: 2,
      allowFirewallOnMainPath: !1,
      routeCount: 3,
      showTarget: !0,
      radarEnabled: !0,
      claimDurationSeconds: 0.35,
      firewallClaimMultiplier: 1.5,
      firewallPenaltySeconds: 4,
      decoyPenaltySeconds: 2
    },
    signalAlignment: {
      traceDurationSeconds: 95,
      channelCount: 2,
      tolerance: 8,
      signalDriftSpeed: 0,
      noiseLevel: 0.05,
      lockHoldSeconds: 2.5,
      targetRevealRadius: 100,
      destabilizationPenaltySeconds: 0
    },
    packetSwitchboard: {
      traceDurationSeconds: 95,
      laneCount: 3,
      columnCount: 5,
      deliveryGoal: 5,
      packetIntervalSeconds: 3.2,
      packetStepSeconds: 1.2,
      previewCount: 4,
      misroutePenaltySeconds: 2,
      maxActivePackets: 1,
      entryHoldSeconds: 2.5
    },
    prismLock: {
      traceDurationSeconds: 95,
      ringCount: 2,
      slotCount: 8,
      receiverCount: 3,
      blockersPerRing: 0,
      iceReceiverCount: 0,
      switchableRingCount: 0,
      scrambleSteps: 2,
      icePenaltySeconds: 0
    }
  },
  strong_success: {
    profileId: "strong_success",
    id: "strong_success",
    label: "Strong Success",
    traceDurationSeconds: 75,
    hintsEnabled: !0,
    visualGlitchIntensity: 0.25,
    nodeIntrusion: {
      traceDurationSeconds: 75,
      nodeCount: 16,
      firewallCount: 3,
      decoyCount: 3,
      allowFirewallOnMainPath: !1,
      routeCount: 3,
      showTarget: !1,
      radarEnabled: !0,
      claimDurationSeconds: 0.45,
      firewallClaimMultiplier: 1.6,
      firewallPenaltySeconds: 5,
      decoyPenaltySeconds: 3
    },
    signalAlignment: {
      traceDurationSeconds: 75,
      channelCount: 3,
      tolerance: 7,
      signalDriftSpeed: 0.15,
      noiseLevel: 0.12,
      lockHoldSeconds: 3,
      targetRevealRadius: 30,
      destabilizationPenaltySeconds: 2
    },
    packetSwitchboard: {
      traceDurationSeconds: 75,
      laneCount: 4,
      columnCount: 5,
      deliveryGoal: 6,
      packetIntervalSeconds: 2.6,
      packetStepSeconds: 0.95,
      previewCount: 3,
      misroutePenaltySeconds: 3,
      maxActivePackets: 1,
      entryHoldSeconds: 2
    },
    prismLock: {
      traceDurationSeconds: 75,
      ringCount: 3,
      slotCount: 8,
      receiverCount: 4,
      blockersPerRing: 0,
      iceReceiverCount: 0,
      switchableRingCount: 0,
      scrambleSteps: 3,
      icePenaltySeconds: 2
    }
  },
  success: {
    profileId: "success",
    id: "success",
    label: "Success",
    traceDurationSeconds: 60,
    hintsEnabled: !1,
    visualGlitchIntensity: 0.4,
    nodeIntrusion: {
      traceDurationSeconds: 60,
      nodeCount: 18,
      firewallCount: 4,
      decoyCount: 4,
      allowFirewallOnMainPath: !1,
      routeCount: 3,
      showTarget: !1,
      radarEnabled: !1,
      claimDurationSeconds: 0.6,
      firewallClaimMultiplier: 1.75,
      firewallPenaltySeconds: 6,
      decoyPenaltySeconds: 4
    },
    signalAlignment: {
      traceDurationSeconds: 60,
      channelCount: 3,
      tolerance: 5,
      signalDriftSpeed: 0.35,
      noiseLevel: 0.2,
      lockHoldSeconds: 4,
      targetRevealRadius: 20,
      destabilizationPenaltySeconds: 4
    },
    packetSwitchboard: {
      traceDurationSeconds: 60,
      laneCount: 4,
      columnCount: 6,
      deliveryGoal: 6,
      packetIntervalSeconds: 2.75,
      packetStepSeconds: 1,
      previewCount: 3,
      misroutePenaltySeconds: 3,
      maxActivePackets: 2,
      entryHoldSeconds: 1.5
    },
    prismLock: {
      traceDurationSeconds: 60,
      ringCount: 3,
      slotCount: 10,
      receiverCount: 4,
      blockersPerRing: 1,
      iceReceiverCount: 1,
      switchableRingCount: 0,
      scrambleSteps: 3,
      icePenaltySeconds: 4
    }
  },
  failure_but_playable: {
    profileId: "failure_but_playable",
    id: "failure_but_playable",
    label: "Failure, But Playable",
    traceDurationSeconds: 45,
    hintsEnabled: !1,
    visualGlitchIntensity: 0.65,
    nodeIntrusion: {
      traceDurationSeconds: 45,
      nodeCount: 20,
      firewallCount: 6,
      decoyCount: 5,
      allowFirewallOnMainPath: !1,
      routeCount: 2,
      showTarget: !1,
      radarEnabled: !1,
      claimDurationSeconds: 0.75,
      firewallClaimMultiplier: 2,
      firewallPenaltySeconds: 8,
      decoyPenaltySeconds: 5
    },
    signalAlignment: {
      traceDurationSeconds: 45,
      channelCount: 4,
      tolerance: 4,
      signalDriftSpeed: 0.55,
      noiseLevel: 0.32,
      lockHoldSeconds: 5,
      targetRevealRadius: 12,
      destabilizationPenaltySeconds: 6
    },
    packetSwitchboard: {
      traceDurationSeconds: 45,
      laneCount: 5,
      columnCount: 6,
      deliveryGoal: 8,
      packetIntervalSeconds: 1.55,
      packetStepSeconds: 0.68,
      previewCount: 1,
      misroutePenaltySeconds: 7,
      maxActivePackets: 3,
      entryHoldSeconds: 1
    },
    prismLock: {
      traceDurationSeconds: 45,
      ringCount: 4,
      slotCount: 12,
      receiverCount: 5,
      blockersPerRing: 1,
      iceReceiverCount: 2,
      switchableRingCount: 1,
      scrambleSteps: 4,
      icePenaltySeconds: 6
    }
  },
  critical_failure: {
    profileId: "critical_failure",
    id: "critical_failure",
    label: "Critical Failure",
    traceDurationSeconds: 24,
    hintsEnabled: !1,
    visualGlitchIntensity: 0.9,
    nodeIntrusion: {
      traceDurationSeconds: 24,
      nodeCount: 24,
      firewallCount: 10,
      decoyCount: 8,
      allowFirewallOnMainPath: !1,
      routeCount: 1,
      showTarget: !1,
      radarEnabled: !1,
      claimDurationSeconds: 1.2,
      firewallClaimMultiplier: 2.25,
      firewallPenaltySeconds: 12,
      decoyPenaltySeconds: 8
    },
    signalAlignment: {
      traceDurationSeconds: 24,
      channelCount: 5,
      tolerance: 2,
      signalDriftSpeed: 0.6,
      noiseLevel: 0.5,
      lockHoldSeconds: 6.5,
      targetRevealRadius: 0,
      destabilizationPenaltySeconds: 8
    },
    packetSwitchboard: {
      traceDurationSeconds: 24,
      laneCount: 6,
      columnCount: 7,
      deliveryGoal: 9,
      packetIntervalSeconds: 1.1,
      packetStepSeconds: 0.55,
      previewCount: 1,
      misroutePenaltySeconds: 10,
      maxActivePackets: 4,
      entryHoldSeconds: 0.5
    },
    prismLock: {
      traceDurationSeconds: 24,
      ringCount: 4,
      slotCount: 12,
      receiverCount: 6,
      blockersPerRing: 2,
      iceReceiverCount: 3,
      switchableRingCount: 1,
      scrambleSteps: 5,
      icePenaltySeconds: 8
    }
  }
};
function U(t) {
  return {
    ...t,
    ...t.nodeIntrusion,
    ...t.signalAlignment,
    ...t.packetSwitchboard,
    ...t.prismLock,
    allowMainPathFirewalls: t.nodeIntrusion.allowFirewallOnMainPath
  };
}
function Z(t = 0, s = 10, e = null) {
  const n = Number(t) || 0, i = Number(s) || 10, r = Number(e);
  return r === 1 ? U(O.critical_failure) : r === 20 ? U(O.critical_success) : n <= i - 10 ? U(O.critical_failure) : n >= i + 10 ? U(O.critical_success) : n >= i + 5 ? U(O.strong_success) : n >= i ? U(O.success) : U(O.failure_but_playable);
}
const De = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map();
function le(t) {
  const s = String((t == null ? void 0 : t.id) ?? "").trim();
  if (!s || typeof (t == null ? void 0 : t.create) != "function")
    throw new Error("HoloSuite Hacking minigames require an id and create(options) function.");
  De.set(s, {
    title: String(t.title ?? s),
    icon: String(t.icon ?? "fa-solid fa-terminal"),
    ...t,
    id: s
  });
}
function Ft(t) {
  return De.get(String(t ?? ""));
}
function Ht() {
  return [...De.values()];
}
function qt(t, s = {}) {
  var o, c, l, u;
  const e = Ft(t);
  if (!e)
    return (c = (o = ui.notifications) == null ? void 0 : o.warn) == null || c.call(o, `Unknown HoloSuite hacking minigame: ${t}`), null;
  const n = String(s.liveSessionId ?? ""), i = s.readOnly && n ? `${e.id}:spectator:${n}` : e.id;
  (u = (l = ie.get(i)) == null ? void 0 : l.close) == null || u.call(l);
  const r = e.create(s), a = r.close.bind(r);
  return r.close = async (...d) => (ie.delete(i), a(...d)), ie.set(i, r), r.render(!0), r;
}
function _t(t) {
  return t ? ie.get(String(t)) ?? null : [...ie.values()].at(-1) ?? null;
}
function pe(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function pt(t, s) {
  if (!pe(s)) return t;
  const e = { ...t };
  for (const [n, i] of Object.entries(s))
    e[n] = pe(i) && pe(e[n]) ? pt(e[n], i) : i;
  return e;
}
function Gt(t) {
  var s;
  return {
    ...t,
    ...t.nodeIntrusion ?? {},
    ...t.signalAlignment ?? {},
    ...t.packetSwitchboard ?? {},
    ...t.prismLock ?? {},
    allowMainPathFirewalls: ((s = t.nodeIntrusion) == null ? void 0 : s.allowFirewallOnMainPath) ?? t.allowMainPathFirewalls
  };
}
function jt(t) {
  var e, n;
  const s = String(game.settings.get(t, "difficultyProfileOverrides") ?? "").trim();
  if (!s) return {};
  try {
    const i = JSON.parse(s);
    return pe(i) ? i : {};
  } catch (i) {
    return console.warn(`${t} | Difficulty profile overrides must be valid JSON.`, i), (n = (e = ui.notifications) == null ? void 0 : e.warn) == null || n.call(e, "HoloSuite Hacking difficulty profile overrides contain invalid JSON."), {};
  }
}
function Ut({ moduleId: t, openLauncher: s }) {
  function e(o) {
    const c = String(o.profileId ?? o.id ?? ""), u = jt(t)[c], d = Gt(pt(o, u)), h = Number(game.settings.get(t, "nodeTakeoverDurationSeconds") ?? 0);
    return Number.isFinite(h) && h > 0 ? {
      ...d,
      nodeIntrusion: {
        ...d.nodeIntrusion ?? {},
        claimDurationSeconds: h
      },
      claimDurationSeconds: h
    } : d;
  }
  function n(o) {
    const c = String(game.settings.get(t, "visualGlitchIntensity") ?? "medium"), l = Number(o.visualGlitchIntensity ?? 0.4), u = c === "low" ? Math.min(l, 0.25) : c === "high" ? Math.min(1, l + 0.2) : l;
    return { ...o, visualGlitchIntensity: u };
  }
  function i(o = {}) {
    const c = Number(game.settings.get(t, "defaultDc") ?? 15), l = Number(o.dc ?? c), u = Number(o.rollTotal ?? l), d = o.naturalRoll === null || o.naturalRoll === void 0 ? null : Number(o.naturalRoll), h = n(e(o.profile ?? Z(u, l, d)));
    return { ...o, dc: l, rollTotal: u, profile: h };
  }
  function r(o = {}) {
    const c = String(o.type ?? "node-intrusion");
    return qt(c, i(o));
  }
  const a = {
    startHack: r,
    startNodeIntrusion: (o = {}) => r({ ...o, type: "node-intrusion" }),
    startSignalAlignment: (o = {}) => r({ ...o, type: "signal-alignment" }),
    startPacketSwitchboard: (o = {}) => r({ ...o, type: "packet-switchboard" }),
    startPrismLock: (o = {}) => r({ ...o, type: "prism-lock" }),
    openLauncher: s,
    getDifficultyProfile: (o = 0, c = 10, l = null) => n(e(Z(o, c, l))),
    difficultyProfiles: O,
    getMinigames: Ht,
    getActiveApp: _t,
    testNodeIntrusion: () => a.startNodeIntrusion({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }),
    testSignalAlignment: () => a.startSignalAlignment({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }),
    testPacketSwitchboard: () => a.startPacketSwitchboard({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }),
    testPrismLock: () => a.startPrismLock({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    })
  };
  return a;
}
function E(t) {
  const s = document.createElement("div");
  return s.textContent = String(t ?? ""), s.innerHTML;
}
function Le() {
  return $e().filter((s) => !s.isGM);
}
function $e() {
  var t;
  return Array.isArray(game.users) ? game.users : ((t = game.users) == null ? void 0 : t.contents) ?? [...game.users ?? []];
}
function xe(t) {
  var e, n;
  const s = String(t ?? "");
  return ((n = (e = game.users) == null ? void 0 : e.get) == null ? void 0 : n.call(e, s)) ?? $e().find((i) => i.id === s) ?? null;
}
function Oe() {
  var t;
  return Array.isArray(game.actors) ? game.actors : ((t = game.actors) == null ? void 0 : t.contents) ?? [...game.actors ?? []];
}
function X(t) {
  var e, n;
  const s = String(t ?? "");
  return ((n = (e = game.actors) == null ? void 0 : e.get) == null ? void 0 : n.call(e, s)) ?? Oe().find((i) => i.id === s || i.uuid === s) ?? null;
}
function se(t) {
  const s = t == null ? void 0 : t.character;
  return s ? typeof s == "string" ? X(s) : s : null;
}
function re(t, s) {
  var i, r, a, o;
  if (!t || !s) return !1;
  if (t === se(s) || (i = t.testUserPermission) != null && i.call(t, s, "OWNER")) return !0;
  const e = ((a = (r = globalThis.CONST) == null ? void 0 : r.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3, n = t.ownership ?? ((o = t.data) == null ? void 0 : o.permission) ?? {};
  return Number(n[s.id] ?? n.default ?? 0) >= e;
}
function zt() {
  var t, s, e;
  return ((e = (s = (t = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : t.controlled) == null ? void 0 : s[0]) == null ? void 0 : e.actor) ?? null;
}
function Ee(t) {
  const s = se(t) ? [se(t)] : [], e = Oe().filter((i) => re(i, t));
  return [...new Map([...s, ...e].filter(Boolean).map((i) => [i.id, i])).values()].sort((i, r) => i.name.localeCompare(r.name));
}
function st(t = "") {
  const s = Le(), e = s.find((i) => i.id === t);
  return (e ? Ee(e) : Oe()).filter((i) => !e || re(i, e)).map((i) => ({
    id: i.id,
    name: i.name,
    owners: s.filter((r) => re(i, r))
  })).sort((i, r) => i.name.localeCompare(r.name));
}
const Bt = {
  acr: "Acrobatics",
  ani: "Animal Handling",
  arc: "Arcana",
  ath: "Athletics",
  comp: "Computers",
  computer: "Computers",
  computers: "Computers",
  dec: "Deception",
  eng: "Engineering",
  hack: "Hacking",
  hacking: "Hacking",
  his: "History",
  ins: "Insight",
  int: "Intelligence",
  itm: "Intimidation",
  inv: "Investigation",
  med: "Medicine",
  nat: "Nature",
  per: "Persuasion",
  pil: "Piloting",
  prc: "Perception",
  prf: "Performance",
  rel: "Religion",
  sci: "Science",
  slt: "Sleight of Hand",
  soc: "Social",
  ste: "Stealth",
  sur: "Survival",
  tech: "Technology",
  technology: "Technology"
};
function rt(t) {
  var e;
  const s = (e = t == null ? void 0 : t.system) == null ? void 0 : e.skills;
  if (s && typeof s == "object") {
    const n = Object.entries(s).map(([i, r]) => ({
      id: i,
      name: Ce(i, r),
      label: Vt(i, r),
      modifier: Fe(r)
    }));
    if (n.length) return n.sort((i, r) => i.label.localeCompare(r.label));
  }
  return [
    { id: "hacking", name: "Hacking", label: "Hacking (+0)", modifier: 0 },
    { id: "computers", name: "Computers", label: "Computers (+0)", modifier: 0 },
    { id: "technology", name: "Technology", label: "Technology (+0)", modifier: 0 },
    { id: "intelligence", name: "Intelligence", label: "Intelligence (+0)", modifier: 0 }
  ];
}
function St(t, s) {
  var e, n;
  return ((n = (e = t == null ? void 0 : t.system) == null ? void 0 : e.skills) == null ? void 0 : n[s]) ?? null;
}
function Ce(t, s) {
  const e = String((s == null ? void 0 : s.label) ?? (s == null ? void 0 : s.name) ?? (s == null ? void 0 : s.localizedName) ?? t ?? "Skill").trim(), n = e.toLowerCase().replace(/[^a-z0-9]/g, "");
  return String(Bt[n] ?? e).replace(/[_-]/g, " ").replace(/\b\w/g, (i) => i.toUpperCase());
}
function Fe(t) {
  var i, r, a, o, c, l, u, d, h, f;
  if (typeof t == "number") return t;
  if (!t || typeof t != "object") return 0;
  const e = [
    t == null ? void 0 : t.mod,
    (i = t == null ? void 0 : t.mod) == null ? void 0 : i.value,
    t == null ? void 0 : t.modifier,
    (r = t == null ? void 0 : t.modifier) == null ? void 0 : r.value,
    t == null ? void 0 : t.total,
    (a = t == null ? void 0 : t.total) == null ? void 0 : a.value,
    t == null ? void 0 : t.value,
    (o = t == null ? void 0 : t.value) == null ? void 0 : o.value,
    t == null ? void 0 : t.bonus,
    (c = t == null ? void 0 : t.bonus) == null ? void 0 : c.value,
    t == null ? void 0 : t.check,
    (l = t == null ? void 0 : t.check) == null ? void 0 : l.mod,
    (u = t == null ? void 0 : t.check) == null ? void 0 : u.total,
    t == null ? void 0 : t.roll,
    (d = t == null ? void 0 : t.roll) == null ? void 0 : d.mod,
    (h = t == null ? void 0 : t.roll) == null ? void 0 : h.total,
    t == null ? void 0 : t.rank,
    t == null ? void 0 : t.ranks
  ].find((g) => Number.isFinite(Number(g)));
  if (e !== void 0) return Number(e);
  const n = [];
  return yt(t, n, 0), n.sort((g, S) => S.score - g.score), Number(((f = n[0]) == null ? void 0 : f.value) ?? 0);
}
function Vt(t, s) {
  const e = Ce(t, s), n = Fe(s), i = n >= 0 ? "+" : "-";
  return `${e} (${i}${Math.abs(n)})`;
}
function yt(t, s, e, n = "") {
  if (!(!t || typeof t != "object" || e > 4))
    for (const [i, r] of Object.entries(t)) {
      const a = n ? `${n}.${i}` : i, o = Number(r);
      if (Number.isFinite(o)) {
        const c = a.toLowerCase();
        let l = 1;
        /(total|mod|modifier|bonus|check|roll|value)$/.test(c) && (l += 6), /(dc|rank|ranks|proficient|prof|trained|ability|base|label|name)/.test(c) && (l -= 4), Math.abs(o) > 30 && (l -= 5), s.push({ value: o, score: l, path: a });
      } else r && typeof r == "object" && yt(r, s, e + 1, a);
    }
}
function vt() {
  var t, s, e;
  return ((s = (t = globalThis.foundry) == null ? void 0 : t.applications) == null ? void 0 : s.api) ?? ((e = foundry == null ? void 0 : foundry.applications) == null ? void 0 : e.api) ?? null;
}
function bt() {
  var t, s, e;
  return ((s = (t = globalThis.foundry) == null ? void 0 : t.appv1) == null ? void 0 : s.api) ?? ((e = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : e.api) ?? null;
}
function Jt(t = {}, s = {}) {
  var n, i, r;
  const e = ((i = (n = globalThis.foundry) == null ? void 0 : n.utils) == null ? void 0 : i.mergeObject) ?? ((r = foundry == null ? void 0 : foundry.utils) == null ? void 0 : r.mergeObject);
  return typeof e == "function" ? e(t, s, { inplace: !1 }) : { ...t, ...s };
}
function Kt() {
  var t, s, e, n, i;
  return ((e = (s = (t = globalThis.foundry) == null ? void 0 : t.utils) == null ? void 0 : s.randomID) == null ? void 0 : e.call(s, 8)) ?? ((i = (n = foundry == null ? void 0 : foundry.utils) == null ? void 0 : n.randomID) == null ? void 0 : i.call(n, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function at(t = {}) {
  return {
    id: String(t.id ?? `legacy-application-${Kt()}`),
    tag: t.tag ?? "section",
    classes: Array.isArray(t.classes) ? t.classes : [],
    window: {
      title: t.title ?? "",
      icon: t.icon,
      resizable: t.resizable === !0
    },
    position: {
      width: Number(t.width ?? 600),
      height: t.height === "auto" ? "auto" : Number(t.height ?? 600)
    }
  };
}
function wt(t) {
  return class extends t {
    constructor(n = {}) {
      const i = Jt(new.target.defaultOptions ?? {}, n);
      super(at(i));
      m(this, "_v1Options");
      this._v1Options = i;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return at(this.defaultOptions ?? {});
    }
    activateListeners(n) {
    }
    async _renderHTML(n, i) {
      var l, u, d;
      const r = typeof this.getData == "function" ? await this.getData() : {}, a = ((l = this._v1Options) == null ? void 0 : l.template) ?? ((u = this.options) == null ? void 0 : u.template) ?? ((d = this.constructor.defaultOptions) == null ? void 0 : d.template);
      if (!a) return document.createDocumentFragment();
      const o = await globalThis.renderTemplate(a, r), c = document.createElement("template");
      return c.innerHTML = o.trim(), c.content;
    }
    _activateV1Form(n) {
      var r, a;
      if (typeof this._updateObject != "function") return;
      const i = (r = n.matches) != null && r.call(n, "form") ? n : (a = n.querySelector) == null ? void 0 : a.call(n, "form");
      i instanceof HTMLFormElement && i.addEventListener("submit", async (o) => {
        var l;
        o.preventDefault(), o.stopPropagation();
        const c = new FormData(i);
        await this._updateObject(o, c), ((l = this._v1Options) == null ? void 0 : l.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(n, i, r) {
      var u, d, h, f;
      i.replaceChildren(n);
      const a = globalThis.jQuery ?? globalThis.$, o = ((u = i.closest) == null ? void 0 : u.call(i, ".window-app, .app, .application")) ?? i, c = a ? a(o) : o;
      try {
        Object.defineProperty(this, "element", {
          value: c,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = c;
        } catch {
        }
      }
      const l = (d = this._v1Options) == null ? void 0 : d.classes;
      Array.isArray(l) && l.length && (i.classList.add(...l), (f = (h = i.closest) == null ? void 0 : h.call(i, ".window-app, .app, .application")) == null || f.classList.add(...l)), this._activateV1Form(i), typeof this.activateListeners == "function" && this.activateListeners(a ? a(i) : i);
    }
  };
}
function ee() {
  const t = vt(), s = bt(), e = globalThis.Application ?? (s == null ? void 0 : s.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (s == null ? void 0 : s.FormApplication) ?? (t == null ? void 0 : t.FormApplication);
  if (e) return e;
  const n = t == null ? void 0 : t.ApplicationV2;
  return n ? wt(n) : null;
}
function Wt() {
  const t = vt(), s = bt(), e = globalThis.FormApplication ?? (s == null ? void 0 : s.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? globalThis.Application ?? (s == null ? void 0 : s.Application) ?? (t == null ? void 0 : t.ApplicationV1);
  if (e) return e;
  const n = t == null ? void 0 : t.ApplicationV2;
  return n ? wt(n) : ee();
}
const Y = "holosuite-hacking", Xt = `modules/${Y}/templates/hacking-launcher.html`, Yt = ee();
function Qt(t) {
  var i, r, a;
  const s = `modules/${Y}/${t.replace(/^\/+/, "")}`, e = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.getRoute;
  return typeof e == "function" ? e(s) : `${String(globalThis.ROUTE_PREFIX ?? ((a = (r = game == null ? void 0 : game.data) == null ? void 0 : r.options) == null ? void 0 : a.routePrefix) ?? "").replace(/^\/?/, "/").replace(/\/$/, "")}/${s}`;
}
class Zt extends Yt {
  constructor(e = {}) {
    super(e);
    m(this, "api");
    this.api = e.api;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-hacking-launcher",
      title: "HoloSuite Hacking",
      classes: ["holosuite-hacking-launcher-window"],
      popOut: !0,
      resizable: !0,
      width: 560,
      height: 680,
      template: Xt
    });
  }
  getData() {
    const e = Number(game.settings.get(Y, "defaultDc") ?? 15), n = String(game.settings.get(Y, "defaultLiveAudience") ?? "everyone"), i = Le(), r = i[0] ?? null, a = st(r == null ? void 0 : r.id), o = a.length ? X(a[0].id) : null;
    return {
      frameAssetBase: Qt("assets/frame"),
      defaultDc: e,
      liveAudiences: [
        { value: "everyone", label: "GM and players", selected: n === "everyone" },
        { value: "gm", label: "GM only", selected: n === "gm" },
        { value: "none", label: "Nobody", selected: n === "none" }
      ],
      defaultTestRoll: e,
      minigames: this.api.getMinigames(),
      actors: a.map((c) => ({
        id: c.id,
        name: c.name,
        ownerNames: c.owners.map((l) => l.name).join(", ") || "No active owner"
      })),
      users: i.map((c) => ({
        id: c.id,
        name: c.name
      })),
      skills: rt(o)
    };
  }
  activateListeners(e) {
    super.activateListeners(e);
    const n = e.is("form") ? e[0] : e.find("form")[0];
    e.find("[data-action='start']").on("click", (r) => {
      r.preventDefault(), this.submit(n);
    }), e.find("[data-action='test-self']").on("click", (r) => {
      r.preventDefault(), this.testSelf(n);
    }), (e.is("form") ? e : e.find("form")).on("submit", (r) => {
      r.preventDefault(), this.submit(r.currentTarget);
    }), e.find("[name='actorId']").on("change", (r) => {
      this.syncUserToActor(e, r.currentTarget.value), this.syncSkillOptions(e, r.currentTarget.value);
    }), e.find("[name='userId']").on("change", (r) => {
      this.syncActorsForUser(e, r.currentTarget.value);
    }), this.syncSkillOptions(e, e.find("[name='actorId']").val());
  }
  submit(e) {
    var C, P, T, p, v, M;
    if (!((C = game.user) != null && C.isGM)) {
      (T = (P = ui.notifications) == null ? void 0 : P.warn) == null || T.call(P, "Only the GM can open the HoloSuite Hacking launcher.");
      return;
    }
    if (!e) {
      (v = (p = ui.notifications) == null ? void 0 : p.error) == null || v.call(p, "HoloSuite Hacking launcher form was not found."), console.error(`${Y} | Launcher form was not found.`);
      return;
    }
    const n = e.querySelector("[name='minigameType']"), i = e.querySelector("[name='actorId']"), r = e.querySelector("[name='userId']"), a = e.querySelector("[name='skillId']"), o = e.querySelector("[name='dc']"), c = e.querySelector("[name='liveAudience']"), l = ((M = a == null ? void 0 : a.selectedOptions) == null ? void 0 : M[0]) ?? null, u = String((n == null ? void 0 : n.value) || "node-intrusion"), d = String((i == null ? void 0 : i.value) || ""), h = String((r == null ? void 0 : r.value) || ""), f = String((a == null ? void 0 : a.value) || ""), g = String((l == null ? void 0 : l.dataset.skillLabel) || (l == null ? void 0 : l.textContent) || f || "Skill"), S = Number((l == null ? void 0 : l.dataset.skillModifier) ?? 0), b = Number((o == null ? void 0 : o.value) ?? 15), k = String((c == null ? void 0 : c.value) || "everyone");
    this.api.sendHackToPlayer({
      minigameType: u,
      actorId: d,
      userId: h,
      skillId: f,
      skillLabel: g,
      skillModifier: S,
      dc: b,
      liveAudience: k,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }) && this.close();
  }
  testSelf(e) {
    var c, l, u, d, h, f, g, S, b, k, I, C, P;
    if (!((c = game.user) != null && c.isGM)) {
      (u = (l = ui.notifications) == null ? void 0 : l.warn) == null || u.call(l, "Only the GM can test HoloSuite Hacking minigames.");
      return;
    }
    if (!e) {
      (h = (d = ui.notifications) == null ? void 0 : d.error) == null || h.call(d, "HoloSuite Hacking launcher form was not found.");
      return;
    }
    const n = String(((f = e.querySelector("[name='minigameType']")) == null ? void 0 : f.value) || "node-intrusion"), i = String(((g = e.querySelector("[name='actorId']")) == null ? void 0 : g.value) || ""), r = Number(((S = e.querySelector("[name='dc']")) == null ? void 0 : S.value) ?? game.settings.get(Y, "defaultDc") ?? 15), a = Number(((b = e.querySelector("[name='testRollTotal']")) == null ? void 0 : b.value) ?? r);
    if (!Number.isFinite(a)) {
      (I = (k = ui.notifications) == null ? void 0 : k.warn) == null || I.call(k, "Enter a fake roll result before testing the minigame.");
      return;
    }
    const o = X(i);
    this.api.startHack({
      type: n,
      dc: r,
      rollTotal: a,
      actorName: (o == null ? void 0 : o.name) ?? ((C = game.user) == null ? void 0 : C.name) ?? "GM",
      userId: ((P = game.user) == null ? void 0 : P.id) ?? "",
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }), this.close();
  }
  syncUserToActor(e, n) {
    const i = X(n), r = Le().find((a) => i == null ? void 0 : i.testUserPermission(a, "OWNER"));
    r && e.find("[name='userId']").val(r.id);
  }
  syncSkillOptions(e, n) {
    const i = X(n), r = rt(i);
    e.find("[name='skillId']").html(r.map((a) => `<option value="${E(a.id)}" data-skill-label="${E(a.name ?? a.label)}" data-skill-modifier="${Number(a.modifier ?? 0)}">${E(a.label)}</option>`).join(""));
  }
  syncActorsForUser(e, n) {
    const i = st(n), r = i.length ? i.map((a) => `<option value="${E(a.id)}">${E(a.name)} (${E(a.owners.map((o) => o.name).join(", ") || "No owner")})</option>`).join("") : '<option value="">Use assigned character</option>';
    e.find("[name='actorId']").html(r), this.syncSkillOptions(e, e.find("[name='actorId']").val());
  }
}
const ae = "holosuite-hacking", en = `modules/${ae}/templates/difficulty-profiles.html`, tn = Wt(), Me = [
  "critical_success",
  "strong_success",
  "success",
  "failure_but_playable",
  "critical_failure"
];
function Se(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function It(t, s) {
  if (!Se(s)) return t;
  const e = { ...t };
  for (const [n, i] of Object.entries(s))
    e[n] = Se(i) && Se(e[n]) ? It(e[n], i) : i;
  return e;
}
function nn() {
  const t = String(game.settings.get(ae, "difficultyProfileOverrides") ?? "").trim();
  if (!t) return {};
  try {
    const s = JSON.parse(t);
    return Se(s) ? s : {};
  } catch (s) {
    return console.warn(`${ae} | Difficulty profile overrides must be valid JSON.`, s), {};
  }
}
function w(t, s, e) {
  const n = t.get(s);
  if (n === null || n === "") return e;
  const i = Number(n);
  return Number.isFinite(i) ? i : e;
}
function y(t, s, e) {
  return Math.min(e, Math.max(s, t));
}
function ye(t, s) {
  return t.get(s) === "on";
}
function ot(t) {
  if (t.type !== "number" || t.value === "") return;
  const s = Number(t.value);
  if (!Number.isFinite(s)) return;
  const e = t.min === "" ? -1 / 0 : Number(t.min), n = t.max === "" ? 1 / 0 : Number(t.max), i = y(s, e, n);
  i !== s && (t.value = String(i));
}
function be(t, s, e, n) {
  const i = y(Math.round(t), 6, 40), r = Math.max(0, i - 4), a = y(Math.round(s), 0, r), o = Math.max(0, i - a), c = y(Math.round(o * 0.48), Math.min(6, o), o), l = c >= 5 ? 3 : 1, u = y(Math.round(e), 1, l), d = c + Math.max(0, u - 1), h = n ? Math.max(0, i - a - 2) : Math.max(0, i - a - d);
  return {
    nodeCount: i,
    maxDecoys: r,
    decoyCount: a,
    mainPathLength: c,
    maxRoutes: l,
    routeCount: u,
    protectedNodes: d,
    maxFirewalls: h
  };
}
function sn(t, s, e) {
  const n = w(t, `${s}nodeCount`, e.nodeIntrusion.nodeCount), i = w(t, `${s}decoyCount`, e.nodeIntrusion.decoyCount), r = w(t, `${s}routeCount`, e.nodeIntrusion.routeCount ?? 2), a = ye(t, `${s}allowFirewallOnMainPath`), o = be(n, i, r, a);
  return {
    traceDurationSeconds: y(Math.round(w(t, `${s}nodeTraceDurationSeconds`, e.nodeIntrusion.traceDurationSeconds ?? e.traceDurationSeconds ?? 60)), 5, 300),
    nodeCount: o.nodeCount,
    firewallCount: y(Math.round(w(t, `${s}firewallCount`, e.nodeIntrusion.firewallCount)), 0, o.maxFirewalls),
    decoyCount: o.decoyCount,
    routeCount: o.routeCount,
    radarEnabled: ye(t, `${s}radarEnabled`),
    claimDurationSeconds: y(w(t, `${s}claimDurationSeconds`, e.nodeIntrusion.claimDurationSeconds ?? 0.5), 0.1, 5),
    firewallClaimMultiplier: y(w(t, `${s}firewallClaimMultiplier`, e.nodeIntrusion.firewallClaimMultiplier ?? 1.75), 1, 5),
    firewallPenaltySeconds: y(Math.round(w(t, `${s}firewallPenaltySeconds`, e.nodeIntrusion.firewallPenaltySeconds ?? 6)), 0, 60),
    decoyPenaltySeconds: y(Math.round(w(t, `${s}decoyPenaltySeconds`, e.nodeIntrusion.decoyPenaltySeconds ?? 4)), 0, 60),
    showTarget: ye(t, `${s}showTarget`),
    allowFirewallOnMainPath: a
  };
}
function rn(t, s, e) {
  return {
    traceDurationSeconds: y(Math.round(w(t, `${s}signalTraceDurationSeconds`, e.signalAlignment.traceDurationSeconds ?? e.traceDurationSeconds ?? 60)), 5, 300),
    channelCount: y(Math.round(w(t, `${s}signalChannelCount`, e.signalAlignment.channelCount ?? 3)), 2, 5),
    tolerance: y(w(t, `${s}signalTolerance`, e.signalAlignment.tolerance ?? 5), 0.5, 20),
    signalDriftSpeed: y(w(t, `${s}signalDriftSpeed`, e.signalAlignment.signalDriftSpeed ?? 0), 0, 5),
    noiseLevel: y(w(t, `${s}signalNoiseLevel`, e.signalAlignment.noiseLevel ?? 0), 0, 1),
    lockHoldSeconds: y(w(t, `${s}signalLockHoldSeconds`, e.signalAlignment.lockHoldSeconds ?? 4), 0.5, 30),
    targetRevealRadius: y(w(t, `${s}signalTargetRevealRadius`, e.signalAlignment.targetRevealRadius ?? 100), 0, 100),
    destabilizationPenaltySeconds: y(w(t, `${s}signalDestabilizationPenaltySeconds`, e.signalAlignment.destabilizationPenaltySeconds ?? 0), 0, 60)
  };
}
function an(t, s, e) {
  const n = e.packetSwitchboard ?? {}, i = y(Math.round(w(t, `${s}packetLaneCount`, n.laneCount ?? 4)), 3, 6);
  return {
    traceDurationSeconds: y(Math.round(w(t, `${s}packetTraceDurationSeconds`, n.traceDurationSeconds ?? e.traceDurationSeconds ?? 60)), 5, 300),
    laneCount: i,
    columnCount: y(Math.round(w(t, `${s}packetColumnCount`, n.columnCount ?? 6)), i - 1, 8),
    deliveryGoal: y(Math.round(w(t, `${s}packetDeliveryGoal`, n.deliveryGoal ?? 7)), 3, 20),
    packetIntervalSeconds: y(w(t, `${s}packetIntervalSeconds`, n.packetIntervalSeconds ?? 2), 0.35, 10),
    packetStepSeconds: y(w(t, `${s}packetStepSeconds`, n.packetStepSeconds ?? 0.8), 0.25, 5),
    previewCount: y(Math.round(w(t, `${s}packetPreviewCount`, n.previewCount ?? 2)), 0, 6),
    misroutePenaltySeconds: y(w(t, `${s}packetMisroutePenaltySeconds`, n.misroutePenaltySeconds ?? 5), 0, 60),
    maxActivePackets: y(Math.round(w(t, `${s}packetMaxActivePackets`, n.maxActivePackets ?? 2)), 1, 6),
    entryHoldSeconds: y(w(t, `${s}packetEntryHoldSeconds`, n.entryHoldSeconds ?? 1.5), 0, 10)
  };
}
function on(t, s, e) {
  const n = e.prismLock ?? {}, i = y(Math.round(w(t, `${s}prismRingCount`, n.ringCount ?? 3)), 2, 4), r = y(Math.round(w(t, `${s}prismSlotCount`, n.slotCount ?? 10)), 8, 16), a = y(Math.round(w(t, `${s}prismReceiverCount`, n.receiverCount ?? 4)), 2, Math.min(8, r)), o = y(Math.round(w(t, `${s}prismSwitchableRingCount`, n.switchableRingCount ?? 0)), 0, i - 1), c = Math.min(4, r - a), l = o > 0 && c > 0 ? 1 : 0;
  return {
    traceDurationSeconds: y(Math.round(w(t, `${s}prismTraceDurationSeconds`, n.traceDurationSeconds ?? e.traceDurationSeconds ?? 60)), 5, 300),
    ringCount: i,
    slotCount: r,
    receiverCount: a,
    blockersPerRing: y(Math.round(w(t, `${s}prismBlockersPerRing`, n.blockersPerRing ?? 0)), 0, 3),
    iceReceiverCount: y(Math.round(w(t, `${s}prismIceReceiverCount`, n.iceReceiverCount ?? 0)), l, c),
    switchableRingCount: o,
    scrambleSteps: y(Math.round(w(t, `${s}prismScrambleSteps`, n.scrambleSteps ?? 3)), 1, Math.floor(r / 2)),
    icePenaltySeconds: y(w(t, `${s}prismIcePenaltySeconds`, n.icePenaltySeconds ?? 5), 0, 60)
  };
}
function cn(t) {
  var n, i, r, a, o, c, l, u, d, h, f, g, S, b, k, I, C, P, T;
  const s = O[t], e = be(
    Number(s.nodeIntrusion.nodeCount),
    Number(s.nodeIntrusion.decoyCount),
    Number(s.nodeIntrusion.routeCount ?? 2),
    !!s.nodeIntrusion.allowFirewallOnMainPath
  );
  return {
    hintsEnabled: !!s.hintsEnabled,
    visualGlitchIntensity: Number(s.visualGlitchIntensity ?? 0.4),
    nodeIntrusion: {
      traceDurationSeconds: Number(s.nodeIntrusion.traceDurationSeconds ?? s.traceDurationSeconds ?? 60),
      nodeCount: e.nodeCount,
      firewallCount: y(Number(s.nodeIntrusion.firewallCount ?? 0), 0, e.maxFirewalls),
      decoyCount: e.decoyCount,
      routeCount: e.routeCount,
      radarEnabled: !!(s.nodeIntrusion.radarEnabled ?? Number(s.nodeIntrusion.radarRange ?? 0) > 0),
      claimDurationSeconds: Number(s.nodeIntrusion.claimDurationSeconds ?? 0.5),
      firewallClaimMultiplier: Number(s.nodeIntrusion.firewallClaimMultiplier ?? 1.75),
      firewallPenaltySeconds: Number(s.nodeIntrusion.firewallPenaltySeconds ?? 6),
      decoyPenaltySeconds: Number(s.nodeIntrusion.decoyPenaltySeconds ?? 4),
      showTarget: !!s.nodeIntrusion.showTarget,
      allowFirewallOnMainPath: !!s.nodeIntrusion.allowFirewallOnMainPath
    },
    signalAlignment: {
      traceDurationSeconds: Number(s.signalAlignment.traceDurationSeconds ?? s.traceDurationSeconds ?? 60),
      channelCount: Number(s.signalAlignment.channelCount ?? 3),
      tolerance: Number(s.signalAlignment.tolerance ?? 5),
      signalDriftSpeed: Number(s.signalAlignment.signalDriftSpeed ?? 0),
      noiseLevel: Number(s.signalAlignment.noiseLevel ?? 0),
      lockHoldSeconds: Number(s.signalAlignment.lockHoldSeconds ?? 4),
      targetRevealRadius: Number(s.signalAlignment.targetRevealRadius ?? 100),
      destabilizationPenaltySeconds: Number(s.signalAlignment.destabilizationPenaltySeconds ?? 0)
    },
    packetSwitchboard: {
      traceDurationSeconds: Number(((n = s.packetSwitchboard) == null ? void 0 : n.traceDurationSeconds) ?? s.traceDurationSeconds ?? 60),
      laneCount: Number(((i = s.packetSwitchboard) == null ? void 0 : i.laneCount) ?? 4),
      columnCount: Number(((r = s.packetSwitchboard) == null ? void 0 : r.columnCount) ?? 6),
      deliveryGoal: Number(((a = s.packetSwitchboard) == null ? void 0 : a.deliveryGoal) ?? 7),
      packetIntervalSeconds: Number(((o = s.packetSwitchboard) == null ? void 0 : o.packetIntervalSeconds) ?? 2),
      packetStepSeconds: Number(((c = s.packetSwitchboard) == null ? void 0 : c.packetStepSeconds) ?? 0.8),
      previewCount: Number(((l = s.packetSwitchboard) == null ? void 0 : l.previewCount) ?? 2),
      misroutePenaltySeconds: Number(((u = s.packetSwitchboard) == null ? void 0 : u.misroutePenaltySeconds) ?? 5),
      maxActivePackets: Number(((d = s.packetSwitchboard) == null ? void 0 : d.maxActivePackets) ?? 2),
      entryHoldSeconds: Number(((h = s.packetSwitchboard) == null ? void 0 : h.entryHoldSeconds) ?? 1.5)
    },
    prismLock: {
      traceDurationSeconds: Number(((f = s.prismLock) == null ? void 0 : f.traceDurationSeconds) ?? s.traceDurationSeconds ?? 60),
      ringCount: Number(((g = s.prismLock) == null ? void 0 : g.ringCount) ?? 3),
      slotCount: Number(((S = s.prismLock) == null ? void 0 : S.slotCount) ?? 10),
      receiverCount: Number(((b = s.prismLock) == null ? void 0 : b.receiverCount) ?? 4),
      blockersPerRing: Number(((k = s.prismLock) == null ? void 0 : k.blockersPerRing) ?? 0),
      iceReceiverCount: Number(((I = s.prismLock) == null ? void 0 : I.iceReceiverCount) ?? 0),
      switchableRingCount: Number(((C = s.prismLock) == null ? void 0 : C.switchableRingCount) ?? 0),
      scrambleSteps: Number(((P = s.prismLock) == null ? void 0 : P.scrambleSteps) ?? 3),
      icePenaltySeconds: Number(((T = s.prismLock) == null ? void 0 : T.icePenaltySeconds) ?? 5)
    }
  };
}
class ln extends tn {
  constructor() {
    super(...arguments);
    m(this, "activeProfileTab", "general");
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-hacking-difficulty-profiles",
      title: "HoloSuite Hacking Difficulty Profiles",
      classes: ["holosuite-hacking-window", "holosuite-hacking-profile-window"],
      template: en,
      width: 820,
      height: 780,
      resizable: !0,
      closeOnSubmit: !0,
      submitOnChange: !1,
      submitOnClose: !1
    });
  }
  getData() {
    const e = nn();
    return {
      profiles: Me.map((i) => {
        var h, f, g, S, b, k, I, C, P, T, p, v, M, A, L, $, j, J, K, R, F, ce, _e, Ge, je, Ue, ze, Be, Ve, Je, Ke, We, Xe, Ye, Qe, Ze, et, tt, nt, it;
        const r = O[i], a = It(r, e[i]), o = Number(((h = a.nodeIntrusion) == null ? void 0 : h.nodeCount) ?? 12), c = Number(((f = a.nodeIntrusion) == null ? void 0 : f.decoyCount) ?? 0), l = Number(((g = a.nodeIntrusion) == null ? void 0 : g.routeCount) ?? 2), u = !!((S = a.nodeIntrusion) != null && S.allowFirewallOnMainPath), d = be(o, c, l, u);
        return {
          id: i,
          label: a.label,
          hintsEnabled: !!a.hintsEnabled,
          visualGlitchIntensity: Number(a.visualGlitchIntensity ?? 0.4),
          nodeIntrusion: {
            traceDurationSeconds: Number(((b = a.nodeIntrusion) == null ? void 0 : b.traceDurationSeconds) ?? a.traceDurationSeconds ?? 60),
            nodeCount: d.nodeCount,
            firewallCount: y(Number(((k = a.nodeIntrusion) == null ? void 0 : k.firewallCount) ?? 0), 0, d.maxFirewalls),
            decoyCount: d.decoyCount,
            routeCount: d.routeCount,
            radarEnabled: !!(((I = a.nodeIntrusion) == null ? void 0 : I.radarEnabled) ?? Number(((C = a.nodeIntrusion) == null ? void 0 : C.radarRange) ?? 0) > 0),
            claimDurationSeconds: Number(((P = a.nodeIntrusion) == null ? void 0 : P.claimDurationSeconds) ?? 0.5),
            firewallClaimMultiplier: Number(((T = a.nodeIntrusion) == null ? void 0 : T.firewallClaimMultiplier) ?? 1.75),
            firewallPenaltySeconds: Number(((p = a.nodeIntrusion) == null ? void 0 : p.firewallPenaltySeconds) ?? 6),
            decoyPenaltySeconds: Number(((v = a.nodeIntrusion) == null ? void 0 : v.decoyPenaltySeconds) ?? 4),
            showTarget: !!((M = a.nodeIntrusion) != null && M.showTarget),
            allowFirewallOnMainPath: u
          },
          signalAlignment: {
            traceDurationSeconds: Number(((A = a.signalAlignment) == null ? void 0 : A.traceDurationSeconds) ?? a.traceDurationSeconds ?? 60),
            channelCount: Number(((L = a.signalAlignment) == null ? void 0 : L.channelCount) ?? 3),
            tolerance: Number((($ = a.signalAlignment) == null ? void 0 : $.tolerance) ?? 5),
            signalDriftSpeed: Number(((j = a.signalAlignment) == null ? void 0 : j.signalDriftSpeed) ?? 0),
            noiseLevel: Number(((J = a.signalAlignment) == null ? void 0 : J.noiseLevel) ?? 0),
            lockHoldSeconds: Number(((K = a.signalAlignment) == null ? void 0 : K.lockHoldSeconds) ?? 4),
            targetRevealRadius: Number(((R = a.signalAlignment) == null ? void 0 : R.targetRevealRadius) ?? 100),
            destabilizationPenaltySeconds: Number(((F = a.signalAlignment) == null ? void 0 : F.destabilizationPenaltySeconds) ?? 0)
          },
          packetSwitchboard: {
            traceDurationSeconds: Number(((ce = a.packetSwitchboard) == null ? void 0 : ce.traceDurationSeconds) ?? a.traceDurationSeconds ?? 60),
            laneCount: Number(((_e = a.packetSwitchboard) == null ? void 0 : _e.laneCount) ?? 4),
            columnCount: Number(((Ge = a.packetSwitchboard) == null ? void 0 : Ge.columnCount) ?? 6),
            deliveryGoal: Number(((je = a.packetSwitchboard) == null ? void 0 : je.deliveryGoal) ?? 7),
            packetIntervalSeconds: Number(((Ue = a.packetSwitchboard) == null ? void 0 : Ue.packetIntervalSeconds) ?? 2),
            packetStepSeconds: Number(((ze = a.packetSwitchboard) == null ? void 0 : ze.packetStepSeconds) ?? 0.8),
            previewCount: Number(((Be = a.packetSwitchboard) == null ? void 0 : Be.previewCount) ?? 2),
            misroutePenaltySeconds: Number(((Ve = a.packetSwitchboard) == null ? void 0 : Ve.misroutePenaltySeconds) ?? 5),
            maxActivePackets: Number(((Je = a.packetSwitchboard) == null ? void 0 : Je.maxActivePackets) ?? 2),
            entryHoldSeconds: Number(((Ke = a.packetSwitchboard) == null ? void 0 : Ke.entryHoldSeconds) ?? 1.5)
          },
          prismLock: {
            traceDurationSeconds: Number(((We = a.prismLock) == null ? void 0 : We.traceDurationSeconds) ?? a.traceDurationSeconds ?? 60),
            ringCount: Number(((Xe = a.prismLock) == null ? void 0 : Xe.ringCount) ?? 3),
            slotCount: Number(((Ye = a.prismLock) == null ? void 0 : Ye.slotCount) ?? 10),
            receiverCount: Number(((Qe = a.prismLock) == null ? void 0 : Qe.receiverCount) ?? 4),
            blockersPerRing: Number(((Ze = a.prismLock) == null ? void 0 : Ze.blockersPerRing) ?? 0),
            iceReceiverCount: Number(((et = a.prismLock) == null ? void 0 : et.iceReceiverCount) ?? 0),
            switchableRingCount: Number(((tt = a.prismLock) == null ? void 0 : tt.switchableRingCount) ?? 0),
            scrambleSteps: Number(((nt = a.prismLock) == null ? void 0 : nt.scrambleSteps) ?? 3),
            icePenaltySeconds: Number(((it = a.prismLock) == null ? void 0 : it.icePenaltySeconds) ?? 5)
          },
          constraints: d
        };
      }),
      hasOverrides: Object.keys(e).length > 0
    };
  }
  activateListeners(e) {
    super.activateListeners(e), this.setProfileTab(e, this.activeProfileTab, !1), this.syncConstraints(e), e.find("[data-profile-tab]").on("click", (n) => {
      n.preventDefault();
      const i = n.currentTarget, r = (i == null ? void 0 : i.dataset.profileTab) ?? "general";
      this.setProfileTab((i == null ? void 0 : i.closest(".holosuite-profile-config")) ?? e, r, !0);
    }), e.find("[data-action='toggle-profile']").on("click", (n) => {
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("[data-profile-section]");
      if (!i || !r) return;
      const a = !r.classList.contains("is-open");
      r.classList.toggle("is-open", a), i.setAttribute("aria-expanded", String(a));
    }), e.find("input[type='number']").on("change", (n) => {
      ot(n.currentTarget);
    }), e.find("[data-profile-section] input").on("input change", (n) => {
      var r;
      const i = (r = n.currentTarget) == null ? void 0 : r.closest("[data-profile-section]");
      i && this.syncProfileConstraints(i);
    }), e.find("[data-action='reset-profile']").on("click", (n) => {
      var r;
      n.preventDefault(), n.stopPropagation();
      const i = (r = n.currentTarget) == null ? void 0 : r.closest("[data-profile-section]");
      i && this.resetProfileSection(i);
    }), e.find("[data-action='reset-profiles']").on("click", async (n) => {
      var i, r;
      n.preventDefault(), await game.settings.set(ae, "difficultyProfileOverrides", ""), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "HoloSuite Hacking difficulty profiles reset to defaults."), this.render(!1);
    });
  }
  setProfileTab(e, n, i) {
    var u, d;
    const r = e instanceof HTMLElement ? e : e == null ? void 0 : e[0], a = (u = r == null ? void 0 : r.matches) != null && u.call(r, ".holosuite-profile-config") ? r : ((d = r == null ? void 0 : r.querySelector) == null ? void 0 : d.call(r, ".holosuite-profile-config")) ?? this.form;
    if (!a) return;
    const o = Array.from(a.querySelectorAll("[data-profile-tab]")), c = o.some((h) => h.dataset.profileTab === n) ? n : "general", l = c !== this.activeProfileTab;
    this.activeProfileTab = c, a.dataset.activeProfileTab = c, o.forEach((h) => {
      const f = h.dataset.profileTab === c;
      h.classList.toggle("is-active", f), h.setAttribute("aria-selected", String(f)), h.tabIndex = f ? 0 : -1;
    }), a.querySelectorAll("[data-profile-panel]").forEach((h) => {
      const f = h.dataset.profilePanel === c;
      h.classList.toggle("is-active", f);
    }), i && l && a.querySelectorAll("[data-profile-section]").forEach((h) => {
      var f;
      h.classList.remove("is-open"), (f = h.querySelector("[data-action='toggle-profile']")) == null || f.setAttribute("aria-expanded", "false");
    });
  }
  syncConstraints(e) {
    e.find("[data-profile-section]").each((n, i) => this.syncProfileConstraints(i));
  }
  clampNumberInputs(e) {
    var i;
    const n = e ?? ((i = this.element) == null ? void 0 : i[0]);
    n == null || n.querySelectorAll("input[type='number']").forEach((r) => ot(r));
  }
  syncProfileConstraints(e) {
    const n = e.dataset.profileId ?? "", i = (I) => e.querySelector(`[name="${n}.${I}"]`), r = i("nodeCount"), a = i("decoyCount"), o = i("routeCount"), c = i("firewallCount"), l = i("allowFirewallOnMainPath");
    if (r && a && o && c) {
      const I = be(
        Number(r.value),
        Number(a.value),
        Number(o.value),
        !!(l != null && l.checked)
      );
      r.value = String(I.nodeCount), a.max = String(I.maxDecoys), a.value = String(I.decoyCount), o.max = String(I.maxRoutes), o.value = String(I.routeCount), c.max = String(I.maxFirewalls), c.value = String(y(Math.round(Number(c.value) || 0), 0, I.maxFirewalls)), e.querySelectorAll("[data-constraint]").forEach((C) => {
        const P = C.dataset.constraint;
        P && I[P] !== void 0 && (C.textContent = String(I[P]));
      });
    }
    const u = i("packetLaneCount"), d = i("packetColumnCount");
    if (u && d) {
      const I = y(Math.round(Number(u.value) || 4), 3, 6), C = I - 1;
      u.value = String(I), d.min = String(C), d.value = String(y(Math.round(Number(d.value) || 6), C, 8));
    }
    const h = i("prismRingCount"), f = i("prismSlotCount"), g = i("prismReceiverCount"), S = i("prismIceReceiverCount"), b = i("prismSwitchableRingCount"), k = i("prismScrambleSteps");
    if (h && f && g && S && b && k) {
      const I = y(Math.round(Number(h.value) || 3), 2, 4), C = y(Math.round(Number(f.value) || 10), 8, 16), P = y(Math.round(Number(g.value) || 4), 2, Math.min(8, C)), T = y(Math.round(Number(b.value) || 0), 0, I - 1), p = Math.min(4, C - P);
      h.value = String(I), f.value = String(C), g.max = String(Math.min(8, C)), g.value = String(P), b.max = String(I - 1), b.value = String(T), S.max = String(p), S.min = String(T > 0 && p > 0 ? 1 : 0), S.value = String(y(Math.round(Number(S.value) || 0), Number(S.min), p)), k.max = String(Math.floor(C / 2)), k.value = String(y(Math.round(Number(k.value) || 3), 1, Math.floor(C / 2)));
    }
  }
  resetProfileSection(e) {
    const n = e.dataset.profileId ?? "";
    if (!Me.includes(n)) return;
    const i = cn(n), r = {
      visualGlitchIntensity: i.visualGlitchIntensity,
      nodeTraceDurationSeconds: i.nodeIntrusion.traceDurationSeconds,
      nodeCount: i.nodeIntrusion.nodeCount,
      routeCount: i.nodeIntrusion.routeCount,
      firewallCount: i.nodeIntrusion.firewallCount,
      decoyCount: i.nodeIntrusion.decoyCount,
      claimDurationSeconds: i.nodeIntrusion.claimDurationSeconds,
      firewallClaimMultiplier: i.nodeIntrusion.firewallClaimMultiplier,
      firewallPenaltySeconds: i.nodeIntrusion.firewallPenaltySeconds,
      decoyPenaltySeconds: i.nodeIntrusion.decoyPenaltySeconds,
      signalTraceDurationSeconds: i.signalAlignment.traceDurationSeconds,
      signalChannelCount: i.signalAlignment.channelCount,
      signalTolerance: i.signalAlignment.tolerance,
      signalDriftSpeed: i.signalAlignment.signalDriftSpeed,
      signalNoiseLevel: i.signalAlignment.noiseLevel,
      signalLockHoldSeconds: i.signalAlignment.lockHoldSeconds,
      signalTargetRevealRadius: i.signalAlignment.targetRevealRadius,
      signalDestabilizationPenaltySeconds: i.signalAlignment.destabilizationPenaltySeconds,
      packetTraceDurationSeconds: i.packetSwitchboard.traceDurationSeconds,
      packetLaneCount: i.packetSwitchboard.laneCount,
      packetColumnCount: i.packetSwitchboard.columnCount,
      packetDeliveryGoal: i.packetSwitchboard.deliveryGoal,
      packetIntervalSeconds: i.packetSwitchboard.packetIntervalSeconds,
      packetStepSeconds: i.packetSwitchboard.packetStepSeconds,
      packetPreviewCount: i.packetSwitchboard.previewCount,
      packetMisroutePenaltySeconds: i.packetSwitchboard.misroutePenaltySeconds,
      packetMaxActivePackets: i.packetSwitchboard.maxActivePackets,
      packetEntryHoldSeconds: i.packetSwitchboard.entryHoldSeconds,
      prismTraceDurationSeconds: i.prismLock.traceDurationSeconds,
      prismRingCount: i.prismLock.ringCount,
      prismSlotCount: i.prismLock.slotCount,
      prismReceiverCount: i.prismLock.receiverCount,
      prismBlockersPerRing: i.prismLock.blockersPerRing,
      prismIceReceiverCount: i.prismLock.iceReceiverCount,
      prismSwitchableRingCount: i.prismLock.switchableRingCount,
      prismScrambleSteps: i.prismLock.scrambleSteps,
      prismIcePenaltySeconds: i.prismLock.icePenaltySeconds
    };
    for (const [o, c] of Object.entries(r)) {
      const l = e.querySelector(`[name="${n}.${o}"]`);
      l && (l.value = String(c));
    }
    const a = {
      hintsEnabled: i.hintsEnabled,
      radarEnabled: i.nodeIntrusion.radarEnabled,
      showTarget: i.nodeIntrusion.showTarget,
      allowFirewallOnMainPath: i.nodeIntrusion.allowFirewallOnMainPath
    };
    for (const [o, c] of Object.entries(a)) {
      const l = e.querySelector(`[name="${n}.${o}"]`);
      l && (l.checked = c);
    }
    this.syncProfileConstraints(e);
  }
  async _updateObject(e, n) {
    var u, d, h, f;
    const i = (e == null ? void 0 : e.currentTarget) instanceof HTMLFormElement ? e.currentTarget : null, r = (u = this.element) == null ? void 0 : u[0], a = r instanceof HTMLFormElement ? r : (d = r == null ? void 0 : r.querySelector) == null ? void 0 : d.call(r, "form"), o = i ?? a ?? this.form;
    this.clampNumberInputs(o);
    const c = o ? new FormData(o) : n instanceof FormData ? n : new FormData(), l = {};
    for (const g of Me) {
      const S = O[g], b = `${g}.`;
      l[g] = {
        traceDurationSeconds: y(Math.round(w(c, `${b}nodeTraceDurationSeconds`, S.traceDurationSeconds)), 5, 300),
        hintsEnabled: ye(c, `${b}hintsEnabled`),
        visualGlitchIntensity: y(w(c, `${b}visualGlitchIntensity`, S.visualGlitchIntensity), 0, 1),
        nodeIntrusion: sn(c, b, S),
        signalAlignment: rn(c, b, S),
        packetSwitchboard: an(c, b, S),
        prismLock: on(c, b, S)
      };
    }
    await game.settings.set(ae, "difficultyProfileOverrides", JSON.stringify(l)), (f = (h = ui.notifications) == null ? void 0 : h.info) == null || f.call(h, "HoloSuite Hacking difficulty profiles saved.");
  }
}
async function ke({ title: t, result: s, actorName: e, message: n, rollTotal: i, dc: r }) {
  const a = s === "success", o = a ? "#38f28f" : "#ff477e", c = a ? "HACK SUCCESS" : "HACK FAILED", l = n || (a ? "Objective completed." : "Trace or countermeasure completed."), u = Number.isFinite(Number(i)) && Number.isFinite(Number(r)) ? `<p style="margin: 4px 0 0; color: #bdeff6;">Roll ${Number(i)} vs DC ${Number(r)}</p>` : "", d = `
    <div class="holosuite-hacking-chat-result" style="border-left: 4px solid ${o}; padding: 8px 10px; background: rgba(5, 8, 14, 0.88); color: ${o};">
      <strong>${ue(c)} // ${ue(t)} // ${ue(e || "Hacker")}</strong>
      <p style="margin: 6px 0 0; color: ${o};">${ue(l)}</p>
      ${u}
    </div>
  `;
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content: d
  });
}
function ue(t) {
  const s = document.createElement("div");
  return s.textContent = String(t ?? ""), s.innerHTML;
}
function x(t, s, e) {
  return Math.min(e, Math.max(s, t));
}
function un(t) {
  const s = String(t ?? "node-intrusion");
  let e = 2166136261;
  for (let n = 0; n < s.length; n += 1)
    e ^= s.charCodeAt(n), e = Math.imul(e, 16777619);
  return e >>> 0;
}
function dn(t) {
  let s = un(t);
  return () => {
    s += 1831565813;
    let e = s;
    return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
  };
}
function Ne(t, s) {
  return t.length ? t[Math.floor(s() * t.length)] : null;
}
function hn(t, s) {
  const e = [...t];
  for (let n = e.length - 1; n > 0; n -= 1) {
    const i = Math.floor(s() * (n + 1));
    [e[n], e[i]] = [e[i], e[n]];
  }
  return e;
}
function V(t, s, e) {
  const n = t.find((r) => r.id === s), i = t.find((r) => r.id === e);
  !n || !i || (n.connected.includes(e) || n.connected.push(e), i.connected.includes(s) || i.connected.push(s));
}
function te(t, s) {
  return [t, s].sort().join("--");
}
function we(t, s, e, n) {
  return {
    id: t,
    x: x(Math.round(e), 6, 94),
    y: x(Math.round(n), 10, 90),
    type: s,
    connected: [],
    revealed: s === "start",
    visited: !1
  };
}
function He(t) {
  return t.flatMap((s) => s.connected.filter((e) => s.id < e).map((e) => ({ from: s.id, to: e })));
}
function H(t, s) {
  return t.find((e) => e.id === s);
}
function de(t, s, e) {
  return Math.sign((s.y - t.y) * (e.x - s.x) - (s.x - t.x) * (e.y - s.y));
}
function fn(t, s, e, n) {
  const i = de(t, s, e), r = de(t, s, n), a = de(e, n, t), o = de(e, n, s);
  return i !== r && a !== o;
}
function mn(t, s, e) {
  if (s.from === e.from || s.from === e.to || s.to === e.from || s.to === e.to) return !1;
  const n = H(t, s.from), i = H(t, s.to), r = H(t, e.from), a = H(t, e.to);
  return !n || !i || !r || !a ? !1 : fn(n, i, r, a);
}
function gn(t, s, e) {
  const n = e.x - s.x, i = e.y - s.y, r = n * n + i * i;
  if (!r) {
    const u = t.x - s.x, d = t.y - s.y;
    return Math.sqrt(u * u + d * d);
  }
  const a = x(((t.x - s.x) * n + (t.y - s.y) * i) / r, 0, 1), o = {
    x: s.x + a * n,
    y: s.y + a * i
  }, c = t.x - o.x, l = t.y - o.y;
  return Math.sqrt(c * c + l * l);
}
function pn(t, s = He(t)) {
  let e = 0;
  for (let n = 0; n < s.length; n += 1)
    for (let i = n + 1; i < s.length; i += 1)
      mn(t, s[n], s[i]) && (e += 1);
  return e;
}
function Ct(t) {
  const s = He(t);
  let e = pn(t, s) * 900;
  for (let n = 0; n < t.length; n += 1)
    for (let i = n + 1; i < t.length; i += 1) {
      const r = t[n], a = t[i], o = a.x - r.x, c = a.y - r.y, l = Math.sqrt(o * o + c * c) || 1;
      l < 13 && (e += (13 - l) * 30), l < 18 && (e += (18 - l) * 6);
    }
  for (const n of t)
    for (const i of s) {
      if (i.from === n.id || i.to === n.id) continue;
      const r = H(t, i.from), a = H(t, i.to);
      if (!r || !a) continue;
      const o = gn(n, r, a);
      o < 8 && (e += (8 - o) * 18);
    }
  return e;
}
function Sn(t, s, e) {
  const n = t.map((i) => ({ ...i, connected: [...i.connected] }));
  n.push({ ...s, connected: [] });
  for (const i of e) V(n, s.id, i);
  return Ct(n);
}
function ct(t, s, e, n, i, r, a = {}) {
  const {
    radiusMin: o = 17,
    radiusMax: c = 34,
    biasX: l = 5,
    ySpread: u = 1
  } = a;
  let d = null, h = 1 / 0;
  for (let f = 0; f < 16; f += 1) {
    const g = i() * Math.PI * 2 - Math.PI * 0.2, S = o + i() * (c - o), b = n.x + Math.cos(g) * S + l, k = n.y + Math.sin(g) * S * u, I = we(s, e, b, k), C = Sn(t, I, r);
    C < h && (d = I, h = C);
  }
  return d ?? we(s, e, n.x + l, n.y);
}
function yn(t) {
  for (let s = 0; s < 24; s += 1)
    for (let e = 0; e < t.length; e += 1)
      for (let n = e + 1; n < t.length; n += 1) {
        const i = t[e], r = t[n], a = r.x - i.x, o = r.y - i.y, c = Math.sqrt(a * a + o * o) || 1;
        if (c >= 13) continue;
        const l = (13 - c) * 0.35, u = a / c * l, d = o / c * l;
        i.type !== "start" && i.type !== "target" && (i.x = x(i.x - u, 6, 94), i.y = x(i.y - d, 10, 90)), r.type !== "start" && r.type !== "target" && (r.x = x(r.x + u, 6, 94), r.y = x(r.y + d, 10, 90));
      }
}
function he(t) {
  const s = Math.floor(t() * 4);
  return s === 0 ? { x: 8 + t() * 22, y: 12 + t() * 76 } : s === 1 ? { x: 70 + t() * 22, y: 12 + t() * 76 } : s === 2 ? { x: 12 + t() * 76, y: 10 + t() * 20 } : { x: 12 + t() * 76, y: 70 + t() * 20 };
}
function vn(t) {
  let s = he(t), e = he(t), n = { start: s, target: e, distance: 0 };
  for (let i = 0; i < 24; i += 1) {
    s = he(t), e = he(t);
    const r = e.x - s.x, a = e.y - s.y, o = Math.sqrt(r * r + a * a);
    if (o > n.distance && (n = { start: s, target: e, distance: o }), o >= 58) return { start: s, target: e };
  }
  return { start: n.start, target: n.target };
}
function lt(t, s, e, n = /* @__PURE__ */ new Set()) {
  const i = [s], r = /* @__PURE__ */ new Map([[s, null]]);
  for (let c = 0; c < i.length; c += 1) {
    const l = H(t, i[c]);
    if (l) {
      if (l.id === e) break;
      for (const u of l.connected) {
        if (r.has(u)) continue;
        const d = H(t, u);
        !d || n.has(d.type) || (r.set(u, l.id), i.push(u));
      }
    }
  }
  if (!r.has(e)) return [];
  const a = [];
  let o = e;
  for (; o; )
    a.unshift(o), o = r.get(o) ?? null;
  return a;
}
function bn(t, s, e) {
  const n = lt(t, s, e, /* @__PURE__ */ new Set(["firewall", "decoy"]));
  if (!n.length) return 0;
  const i = /* @__PURE__ */ new Set([s, e]), r = t.map((a) => ({
    ...a,
    connected: i.has(a.id) || !n.includes(a.id) ? [...a.connected] : []
  }));
  return 1 + (lt(r, s, e, /* @__PURE__ */ new Set(["firewall", "decoy"])).length ? 1 : 0);
}
function wn(t, s, e, n) {
  let i = t.length + 1;
  const r = [];
  for (let a = 1; a < n && !(s.length < 5); a += 1) {
    const o = 1 + Math.floor(e() * Math.max(1, s.length - 4)), c = x(o + 2 + Math.floor(e() * 3), o + 2, s.length - 2), l = H(t, s[o]), u = H(t, s[c]);
    if (!l || !u) continue;
    const d = `node-${i}`;
    i += 1;
    const h = we(
      d,
      "normal",
      (l.x + u.x) / 2 + (e() - 0.5) * 34,
      (l.y + u.y) / 2 + (e() - 0.5) * 34
    );
    t.push(h), r.push(l.id, h.id, u.id), V(t, l.id, h.id), V(t, h.id, u.id);
  }
  return r;
}
function ut(t, s = Date.now()) {
  var k, I, C, P, T;
  const e = dn(s), n = Math.max(6, Number(t.nodeCount ?? ((k = t.nodeIntrusion) == null ? void 0 : k.nodeCount)) || 10), i = x(Number(t.decoyCount ?? ((I = t.nodeIntrusion) == null ? void 0 : I.decoyCount)) || 0, 0, n - 4), r = Math.max(0, n - i), a = x(Math.round(r * 0.48), 6, r), o = x(Number(t.routeCount ?? ((C = t.nodeIntrusion) == null ? void 0 : C.routeCount)) || 2, 1, 3), c = vn(e), l = [], u = [];
  for (let p = 0; p < a; p += 1) {
    const v = p === 0 ? "start" : p === a - 1 ? "target" : `node-${p}`, M = p === 0 ? "start" : p === a - 1 ? "target" : "normal", A = p / Math.max(1, a - 1), L = c.target.x - c.start.x, $ = c.target.y - c.start.y, j = Math.sqrt(L * L + $ * $) || 1, J = -$ / j, K = L / j, R = Math.sin(A * Math.PI * (1.15 + e() * 0.6)) * (10 + e() * 8), F = p === 0 || p === a - 1 ? 0 : (e() - 0.5) * 5, ce = p === 0 || p === a - 1 ? 0 : (e() - 0.5) * 12;
    l.push(we(
      v,
      M,
      c.start.x + L * A + J * R + F,
      c.start.y + $ * A + K * R + ce
    )), u.push(v), p > 0 && V(l, u[p - 1], v);
  }
  const d = /* @__PURE__ */ new Set([...u, ...wn(l, u, e, o)]);
  let h = l.length + 1;
  for (; l.length < n - i; ) {
    const p = Ne(l.filter(($) => $.type !== "target"), e) ?? l[0], v = `node-${h}`;
    h += 1;
    const M = e() > 0.45 ? Ne(l.filter(($) => $.id !== p.id && $.type !== "start"), e) : null, A = M ? [p.id, M.id] : [p.id], L = ct(l, v, "normal", p, e, A, {
      radiusMin: 16,
      radiusMax: 31,
      biasX: e() > 0.35 ? 5 : -4,
      ySpread: 1.15
    });
    l.push(L), V(l, p.id, v), M && V(l, v, M.id);
  }
  for (let p = 0; p < i; p += 1) {
    const v = Ne(l.filter((L) => L.type !== "target" && L.type !== "decoy"), e) ?? l[0], M = `decoy-${p + 1}`, A = ct(l, M, "decoy", v, e, [v.id], {
      radiusMin: 18,
      radiusMax: 34,
      biasX: e() > 0.5 ? -6 : 6,
      ySpread: 1.25
    });
    l.push(A), V(l, v.id, M);
  }
  const f = !!(t.allowFirewallOnMainPath ?? t.allowMainPathFirewalls ?? ((P = t.nodeIntrusion) == null ? void 0 : P.allowFirewallOnMainPath)), g = l.filter((p) => p.type === "start" || p.type === "target" || p.type === "decoy" ? !1 : f || !d.has(p.id)), S = x(Number(t.firewallCount ?? ((T = t.nodeIntrusion) == null ? void 0 : T.firewallCount)) || 0, 0, g.length);
  for (const p of hn(g, e).slice(0, S))
    p.type = "firewall";
  yn(l);
  const b = bn(l, "start", "target");
  return {
    nodes: l,
    edges: He(l),
    startNodeId: "start",
    targetNodeId: "target",
    mainPathIds: u,
    safeRoutes: b,
    layoutScore: Ct(l)
  };
}
function In(t, s = Date.now()) {
  var i;
  const e = x(Math.ceil(Number(t.nodeCount ?? ((i = t.nodeIntrusion) == null ? void 0 : i.nodeCount)) || 10), 7, 14);
  let n = null;
  for (let r = 0; r < e; r += 1) {
    const a = ut(t, `${s}:${r}`);
    if ((!n || a.layoutScore < n.layoutScore) && (n = a), a.layoutScore < 1 && a.safeRoutes > 1) break;
  }
  return n ?? ut(t, s);
}
const kt = "holosuite-hacking", Cn = `modules/${kt}/templates/node-intrusion.html`, kn = ee();
function fe(t, s, e) {
  return Math.min(e, Math.max(s, t));
}
function dt(t) {
  return t === "start" ? "entry" : t === "target" ? "target" : t === "firewall" ? "firewall" : t === "decoy" ? "decoy" : "relay";
}
function Pn(t, s, e) {
  const n = globalThis.crypto, i = typeof (n == null ? void 0 : n.randomUUID) == "function" ? n.randomUUID() : `${Date.now()}:${performance.now()}:${Math.random()}`;
  return `${t}:${s}:${e.profileId ?? e.id}:${i}`;
}
class Mn extends kn {
  constructor(e = {}) {
    super(e);
    m(this, "rollTotal");
    m(this, "dc");
    m(this, "profile");
    m(this, "seed");
    m(this, "onSuccess");
    m(this, "onFailure");
    m(this, "actorName");
    m(this, "chatOnResult");
    m(this, "graph");
    m(this, "state");
    m(this, "startedAt");
    m(this, "timer");
    m(this, "claimTimer");
    m(this, "resultMessage");
    m(this, "readOnly");
    m(this, "liveSessionId");
    m(this, "onLiveState");
    m(this, "onLiveEnd");
    m(this, "liveEnded");
    this.rollTotal = Number(e.rollTotal ?? 15), this.dc = Number(e.dc ?? 15), this.profile = e.profile ? { ...e.profile } : Z(this.rollTotal, this.dc), this.seed = e.seed ?? Pn(this.rollTotal, this.dc, this.profile), this.onSuccess = typeof e.onSuccess == "function" ? e.onSuccess : null, this.onFailure = typeof e.onFailure == "function" ? e.onFailure : null, this.actorName = String(e.actorName ?? "Hacker"), this.chatOnResult = e.chatOnResult !== !1, this.readOnly = e.readOnly === !0, this.liveSessionId = String(e.liveSessionId ?? ""), this.onLiveState = typeof e.onLiveState == "function" ? e.onLiveState : null, this.onLiveEnd = typeof e.onLiveEnd == "function" ? e.onLiveEnd : null, this.liveEnded = !1, this.graph = In(this.profile, this.seed), this.state = {
      currentNodeId: this.graph.startNodeId,
      visitedNodeIds: /* @__PURE__ */ new Set([this.graph.startNodeId]),
      traversedEdgeIds: /* @__PURE__ */ new Set(),
      blockedEdgeIds: /* @__PURE__ */ new Map(),
      deadNodeIds: /* @__PURE__ */ new Set(),
      movement: null,
      claimingNodeId: null,
      mistakes: 0,
      traceProgress: 0,
      tracePenaltyProgress: 0,
      hasStarted: !1,
      isRunning: !1,
      result: null
    }, this.startedAt = null, this.timer = null, this.claimTimer = null;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-node-intrusion-app",
      title: "Node Intrusion",
      classes: ["node-intrusion-window", "holosuite-hacking-window"],
      popOut: !0,
      resizable: !0,
      width: 980,
      height: 760,
      template: Cn
    });
  }
  getData() {
    var a, o;
    const e = this.getCurrentNode(), n = e.connected, i = !!(this.profile.radarEnabled ?? ((a = this.profile.nodeIntrusion) == null ? void 0 : a.radarEnabled) ?? Number(this.profile.radarRange ?? ((o = this.profile.nodeIntrusion) == null ? void 0 : o.radarRange)) > 0), r = this.graph.nodes.map((c) => {
      const l = c.id === this.state.currentNodeId, u = this.state.visitedNodeIds.has(c.id), d = c.id === this.state.claimingNodeId, h = c.type === "target" && (u || this.profile.showTarget || this.profile.hintsEnabled), f = c.type !== "target" && (this.profile.hintsEnabled || c.revealed || u || c.type === "start"), g = h || f ? dt(c.type) : "unknown", b = i && (l || u || n.includes(c.id)) && c.type !== "start" && c.type !== "target" ? this.countAdjacentBadNodes(c.id) : 0, k = fe(b, 0, 2);
      return {
        ...c,
        visualType: h ? "target" : c.type === "target" ? "normal" : c.type,
        isTargetVisible: h,
        isCurrent: l,
        isVisited: u,
        isClaiming: d,
        isNeighbor: n.includes(c.id),
        canMove: n.includes(c.id) && !this.state.claimingNodeId && !this.state.blockedEdgeIds.has(te(e.id, c.id)) && !this.state.deadNodeIds.has(c.id),
        isDangerVisible: c.type !== "target" && (this.profile.hintsEnabled || c.revealed || u),
        dangerSignal: k,
        displayType: g,
        title: `${c.id} - ${g}${k ? ` / signal ${k}` : ""}`
      };
    });
    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      isReadOnly: this.readOnly,
      isLiveEnded: this.liveEnded,
      profile: this.profile,
      nodes: r,
      edges: this.graph.edges.map((c) => {
        const l = r.find((h) => h.id === c.from), u = r.find((h) => h.id === c.to), d = this.state.blockedEdgeIds.get(te(c.from, c.to));
        return {
          ...c,
          from: l,
          to: u,
          isVisitedPath: this.state.traversedEdgeIds.has(te(c.from, c.to)),
          isAvailable: !d && (n.includes(c.from) || n.includes(c.to)),
          isFirewallPath: d === "firewall",
          isDecoyPath: d === "decoy"
        };
      }),
      movement: this.state.movement,
      currentNode: {
        id: e.id,
        label: dt(e.type),
        availableRoutes: r.filter((c) => c.canMove).length
      },
      state: {
        ...this.state,
        visitedNodeIds: [...this.state.visitedNodeIds],
        traversedEdgeIds: [...this.state.traversedEdgeIds],
        blockedEdgeIds: [...this.state.blockedEdgeIds],
        deadNodeIds: [...this.state.deadNodeIds]
      },
      resultTitle: this.state.result === "success" ? "Access Granted" : "Intrusion Failed",
      resultDetail: this.resultMessage ?? (this.state.result === "success" ? "Target node breached." : "Trace or countermeasures completed."),
      glitchClass: this.profile.visualGlitchIntensity > 0.7 ? "glitch-high" : this.profile.visualGlitchIntensity > 0.35 ? "glitch-medium" : "glitch-low"
    };
  }
  activateListeners(e) {
    super.activateListeners(e), this.readOnly || (e.find("[data-node-id]").on("click", (n) => this.handleNodeClick(n.currentTarget.dataset.nodeId)), e.find("[data-action='start']").on("click", () => this.startRun()), e.find("[data-action='abort']").on("click", () => this.abort())), e.find("[data-action='close']").on("click", () => this.close()), this.syncDom();
  }
  async render(e, n) {
    const i = await super.render(e, n);
    return !this.readOnly && this.state.hasStarted && this.state.isRunning && this.startTimer(), i;
  }
  async close(e = {}) {
    var i;
    const n = this.serializeLiveState();
    return this.stopTimer(), this.claimTimer && window.clearTimeout(this.claimTimer), this.claimTimer = null, !this.readOnly && !this.liveEnded && (this.liveEnded = !0, (i = this.onLiveEnd) == null || i.call(this, n)), super.close(e);
  }
  getCurrentNode() {
    return this.graph.nodes.find((e) => e.id === this.state.currentNodeId) ?? this.graph.nodes[0];
  }
  getTraceDuration() {
    var i;
    const e = Number(game.settings.get(kt, "traceDurationMultiplier") ?? 1) || 1, n = Number(((i = this.profile.nodeIntrusion) == null ? void 0 : i.traceDurationSeconds) ?? this.profile.traceDurationSeconds ?? 60);
    return Math.max(5, n * e);
  }
  countAdjacentBadNodes(e) {
    const n = this.graph.nodes.find((i) => i.id === e);
    return n ? n.connected.reduce((i, r) => {
      const a = this.graph.nodes.find((o) => o.id === r);
      return (a == null ? void 0 : a.type) === "firewall" || (a == null ? void 0 : a.type) === "decoy" ? i + 1 : i;
    }, 0) : 0;
  }
  firewallsArePassable() {
    var e;
    return !!(this.profile.allowFirewallOnMainPath ?? this.profile.allowMainPathFirewalls ?? ((e = this.profile.nodeIntrusion) == null ? void 0 : e.allowFirewallOnMainPath));
  }
  startRun() {
    this.readOnly || this.state.hasStarted || this.state.result || (this.state.hasStarted = !0, this.state.isRunning = !0, this.startedAt = performance.now(), this.startTimer(), this.render(!1), this.publishLiveState(!0));
  }
  handleNodeClick(e) {
    var l, u, d, h;
    if (!this.state.hasStarted || !this.state.isRunning || this.state.claimingNodeId) return;
    const n = this.getCurrentNode(), i = this.graph.nodes.find((f) => f.id === e);
    if (!i) return;
    if (!n.connected.includes(e)) {
      (l = this.element) == null || l.find(".node-intrusion-shell").addClass("invalid-pulse"), window.setTimeout(() => {
        var f;
        return (f = this.element) == null ? void 0 : f.find(".node-intrusion-shell").removeClass("invalid-pulse");
      }, 280);
      return;
    }
    const r = te(n.id, e);
    if (this.state.blockedEdgeIds.has(r) || this.state.deadNodeIds.has(e)) {
      (u = this.element) == null || u.find(".node-intrusion-shell").addClass("invalid-pulse"), window.setTimeout(() => {
        var f;
        return (f = this.element) == null ? void 0 : f.find(".node-intrusion-shell").removeClass("invalid-pulse");
      }, 280);
      return;
    }
    this.state.movement = {
      fromX: n.x,
      fromY: n.y,
      toX: i.x,
      toY: i.y,
      path: `M ${n.x} ${n.y} L ${i.x} ${i.y}`
    }, this.state.claimingNodeId = e, this.render(!1), this.publishLiveState(!0);
    const a = Math.max(0.1, Number(this.profile.claimDurationSeconds ?? ((d = this.profile.nodeIntrusion) == null ? void 0 : d.claimDurationSeconds)) || 0.5), o = Math.max(1, Number(this.profile.firewallClaimMultiplier ?? ((h = this.profile.nodeIntrusion) == null ? void 0 : h.firewallClaimMultiplier)) || 1), c = i.type === "firewall" ? a * o : a;
    this.claimTimer = window.setTimeout(() => {
      this.claimTimer = null, this.completeNodeClaim(n.id, e);
    }, c * 1e3);
  }
  completeNodeClaim(e, n) {
    var o, c, l, u, d, h;
    if (!this.state.hasStarted || !this.state.isRunning) return;
    const i = this.graph.nodes.find((f) => f.id === e), r = this.graph.nodes.find((f) => f.id === n);
    if (!i || !r) return;
    const a = te(i.id, n);
    if (this.state.claimingNodeId = null, this.state.visitedNodeIds.add(n), this.state.traversedEdgeIds.add(a), r.visited = !0, r.revealed = !0, r.type === "firewall") {
      this.state.mistakes += 1;
      const f = Number(this.profile.firewallPenaltySeconds ?? ((o = this.profile.nodeIntrusion) == null ? void 0 : o.firewallPenaltySeconds)) || 6;
      if (this.addTracePenalty(f), (l = (c = ui.notifications) == null ? void 0 : c.warn) == null || l.call(c, `Firewall surge: trace accelerated by ${f}s.`), this.state.result) return;
      this.firewallsArePassable() ? this.state.currentNodeId = n : (this.state.blockedEdgeIds.set(a, "firewall"), this.state.deadNodeIds.add(n)), this.render(!1), this.publishLiveState(!0);
      return;
    }
    if (r.type === "decoy") {
      this.state.mistakes += 1, this.state.blockedEdgeIds.set(a, "decoy"), this.state.deadNodeIds.add(n);
      const f = Number(this.profile.decoyPenaltySeconds ?? ((u = this.profile.nodeIntrusion) == null ? void 0 : u.decoyPenaltySeconds)) || 4;
      this.addTracePenalty(f), (h = (d = ui.notifications) == null ? void 0 : d.warn) == null || h.call(d, `Decoy sink: trace accelerated by ${f}s.`), this.render(!1), this.publishLiveState(!0);
      return;
    }
    if (this.state.currentNodeId = n, r.type === "target") {
      this.finish("success", "Target node breached");
      return;
    }
    this.render(!1), this.publishLiveState(!0);
  }
  addTracePenalty(e) {
    const n = Math.max(0, e) / this.getTraceDuration() * 100;
    this.state.tracePenaltyProgress = fe(this.state.tracePenaltyProgress + n, 0, 100), this.state.traceProgress = fe(this.state.traceProgress + n, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
  }
  startTimer() {
    if (this.timer || !this.state.hasStarted || !this.startedAt) return;
    const e = this.getTraceDuration();
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const n = (performance.now() - this.startedAt) / 1e3;
      this.state.traceProgress = fe(n / e * 100 + this.state.tracePenaltyProgress, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
    }, 120);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(e, n, { close: i = !1 } = {}) {
    var a, o;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = e, this.stopTimer(), this.resultMessage = n, this.syncDom(), await this.render(!1), this.publishLiveState(!0);
    const r = {
      type: "node-intrusion",
      result: e,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      tracePenaltyProgress: this.state.tracePenaltyProgress,
      traceProgress: this.state.traceProgress,
      visitedNodeIds: [...this.state.visitedNodeIds]
    };
    this.chatOnResult && await ke({
      title: "Node Intrusion",
      result: e,
      actorName: this.actorName,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), e === "success" ? (a = this.onSuccess) == null || a.call(this, r) : (o = this.onFailure) == null || o.call(this, r), i && await this.close();
  }
  syncDom() {
    var a;
    const e = (a = this.element) == null ? void 0 : a[0];
    if (!e) return;
    const n = e.querySelector("[data-trace-fill]"), i = e.querySelector("[data-trace-text]"), r = e.querySelector("[data-penalty-text]");
    n && (n.style.width = `${this.state.traceProgress}%`), i && (i.textContent = `${Math.round(this.state.traceProgress)}%`), r && (r.textContent = `${Math.round(this.state.tracePenaltyProgress)}%`), this.publishLiveState();
  }
  serializeLiveState() {
    return {
      state: {
        ...this.state,
        visitedNodeIds: [...this.state.visitedNodeIds],
        traversedEdgeIds: [...this.state.traversedEdgeIds],
        blockedEdgeIds: [...this.state.blockedEdgeIds],
        deadNodeIds: [...this.state.deadNodeIds]
      },
      nodes: this.graph.nodes.map((e) => ({ id: e.id, visited: !!e.visited, revealed: !!e.revealed })),
      resultMessage: this.resultMessage ?? ""
    };
  }
  getLiveSessionData() {
    return {
      type: "node-intrusion",
      options: {
        rollTotal: this.rollTotal,
        dc: this.dc,
        profile: this.profile,
        seed: this.seed,
        actorName: this.actorName
      },
      state: this.serializeLiveState()
    };
  }
  applyLiveState(e) {
    if (!this.readOnly || !(e != null && e.state)) return;
    const n = JSON.stringify({
      currentNodeId: this.state.currentNodeId,
      claimingNodeId: this.state.claimingNodeId,
      visitedNodeIds: [...this.state.visitedNodeIds],
      blockedEdgeIds: [...this.state.blockedEdgeIds],
      result: this.state.result
    });
    this.state = {
      ...e.state,
      visitedNodeIds: new Set(e.state.visitedNodeIds ?? []),
      traversedEdgeIds: new Set(e.state.traversedEdgeIds ?? []),
      blockedEdgeIds: new Map(e.state.blockedEdgeIds ?? []),
      deadNodeIds: new Set(e.state.deadNodeIds ?? [])
    };
    for (const r of e.nodes ?? []) {
      const a = this.graph.nodes.find((o) => o.id === r.id);
      a && Object.assign(a, { visited: !!r.visited, revealed: !!r.revealed });
    }
    this.resultMessage = e.resultMessage || void 0;
    const i = JSON.stringify({
      currentNodeId: this.state.currentNodeId,
      claimingNodeId: this.state.claimingNodeId,
      visitedNodeIds: [...this.state.visitedNodeIds],
      blockedEdgeIds: [...this.state.blockedEdgeIds],
      result: this.state.result
    });
    n !== i ? this.render(!1) : this.syncDom();
  }
  markLiveSessionEnded() {
    this.liveEnded = !0, this.render(!1);
  }
  publishLiveState(e = !1) {
    var n;
    this.readOnly || (n = this.onLiveState) == null || n.call(this, this.serializeLiveState(), { immediate: e });
  }
}
function Pt(t, s, e) {
  return Math.min(e, Math.max(s, t));
}
function Nn(t) {
  const s = String(t ?? "signal-alignment");
  let e = 2166136261;
  for (let n = 0; n < s.length; n += 1)
    e ^= s.charCodeAt(n), e = Math.imul(e, 16777619);
  return e >>> 0;
}
function Ln(t) {
  let s = Nn(t);
  return () => {
    s += 1831565813;
    let e = s;
    return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
  };
}
function Te(t) {
  return Pt(Number(t) || 0, 0, 100);
}
function Tn(t, s = Date.now()) {
  var r, a;
  const e = Ln(s), n = Pt(Number(t.channelCount ?? ((r = t.signalAlignment) == null ? void 0 : r.channelCount)) || 3, 2, 5), i = Number(t.tolerance ?? ((a = t.signalAlignment) == null ? void 0 : a.tolerance) ?? 5);
  return Array.from({ length: n }, (o, c) => {
    const l = Math.round(18 + e() * 64), u = e() > 0.5 ? 1 : -1, d = i + 8 + Math.round(e() * 18), h = e() > 0.5 ? 1 : -1;
    return {
      id: `channel-${c + 1}`,
      label: `CH-${String(c + 1).padStart(2, "0")}`,
      value: Te(l + u * d),
      target: l,
      tolerance: i,
      driftDirection: h
    };
  });
}
const Mt = "holosuite-hacking", An = `modules/${Mt}/templates/signal-alignment.html`, Rn = ee();
function me(t, s, e) {
  return Math.min(e, Math.max(s, t));
}
class Dn extends Rn {
  constructor(e = {}) {
    super(e);
    m(this, "rollTotal");
    m(this, "dc");
    m(this, "profile");
    m(this, "seed");
    m(this, "onSuccess");
    m(this, "onFailure");
    m(this, "actorName");
    m(this, "chatOnResult");
    m(this, "channels");
    m(this, "state");
    m(this, "startedAt");
    m(this, "lastTickAt");
    m(this, "timer");
    m(this, "wasAligned");
    m(this, "resultMessage");
    m(this, "readOnly");
    m(this, "liveSessionId");
    m(this, "onLiveState");
    m(this, "onLiveEnd");
    m(this, "liveEnded");
    this.rollTotal = Number(e.rollTotal ?? 15), this.dc = Number(e.dc ?? 15), this.profile = e.profile ? { ...e.profile } : Z(this.rollTotal, this.dc), this.seed = e.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}:signal`, this.onSuccess = typeof e.onSuccess == "function" ? e.onSuccess : null, this.onFailure = typeof e.onFailure == "function" ? e.onFailure : null, this.actorName = String(e.actorName ?? "Hacker"), this.chatOnResult = e.chatOnResult !== !1, this.readOnly = e.readOnly === !0, this.liveSessionId = String(e.liveSessionId ?? ""), this.onLiveState = typeof e.onLiveState == "function" ? e.onLiveState : null, this.onLiveEnd = typeof e.onLiveEnd == "function" ? e.onLiveEnd : null, this.liveEnded = !1, this.channels = Tn(this.profile, this.seed), this.state = {
      traceProgress: 0,
      mistakes: 0,
      lockProgress: 0,
      tracePenaltySeconds: 0,
      hasStarted: !1,
      isRunning: !1,
      result: null
    }, this.startedAt = null, this.lastTickAt = null, this.timer = null, this.wasAligned = !1;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-signal-alignment-app",
      title: "Signal Alignment",
      classes: ["signal-alignment-window", "holosuite-hacking-window"],
      popOut: !0,
      resizable: !0,
      width: 840,
      height: 640,
      template: An
    });
  }
  getData() {
    const e = this.channels.map((n) => {
      const i = Math.abs(n.value - n.target), r = i <= n.tolerance, a = this.isTargetVisible(n);
      return {
        ...n,
        valueLabel: n.value.toFixed(1),
        aligned: r,
        targetVisible: a,
        targetLabel: a ? n.target : "??",
        deltaRevealLabel: a ? i.toFixed(1) : "--",
        targetStateLabel: r ? "locked" : a ? "signal found" : "searching",
        waveDurationSeconds: Math.max(1.2, 3.2 - Number(this.profile.noiseLevel ?? 0) * 2),
        targetLeft: n.target,
        toleranceLeft: me(n.target - n.tolerance, 0, 100),
        toleranceWidth: me(n.tolerance * 2, 1, 100)
      };
    });
    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      isReadOnly: this.readOnly,
      isLiveEnded: this.liveEnded,
      profile: this.profile,
      channels: e,
      state: this.state,
      allAligned: this.areAllChannelsAligned(),
      lockPercent: Math.round(this.state.lockProgress * 100),
      resultTitle: this.state.result === "success" ? "Signal Locked" : "Signal Lost",
      resultDetail: this.resultMessage ?? (this.state.result === "success" ? "Transmission Decrypted" : "Trace Complete"),
      glitchClass: this.profile.visualGlitchIntensity > 0.7 ? "glitch-high" : this.profile.visualGlitchIntensity > 0.35 ? "glitch-medium" : "glitch-low"
    };
  }
  activateListeners(e) {
    super.activateListeners(e), this.readOnly ? e.find("[data-channel-slider]").prop("disabled", !0) : (e.find("[data-channel-slider]").on("input", (n) => this.handleSlider(n.currentTarget)), e.find("[data-action='start']").on("click", () => this.startRun()), e.find("[data-action='abort']").on("click", () => this.abort())), e.find("[data-action='close']").on("click", () => this.close()), this.syncDom();
  }
  async render(e, n) {
    const i = await super.render(e, n);
    return !this.readOnly && this.state.hasStarted && this.state.isRunning && this.startTimer(), i;
  }
  async close(e = {}) {
    var i;
    const n = this.serializeLiveState();
    return this.stopTimer(), !this.readOnly && !this.liveEnded && (this.liveEnded = !0, (i = this.onLiveEnd) == null || i.call(this, n)), super.close(e);
  }
  startRun() {
    this.readOnly || this.state.hasStarted || this.state.result || (this.state.hasStarted = !0, this.state.isRunning = !0, this.startedAt = performance.now(), this.lastTickAt = this.startedAt, this.startTimer(), this.render(!1), this.publishLiveState(!0));
  }
  handleSlider(e) {
    if (!this.state.hasStarted || !this.state.isRunning) return;
    const n = this.channels.find((i) => i.id === e.dataset.channelSlider);
    n && (n.value = Te(e.value), this.checkDestabilization(), this.syncDom());
  }
  areAllChannelsAligned() {
    return this.channels.every((e) => Math.abs(e.value - e.target) <= e.tolerance);
  }
  isTargetVisible(e) {
    var r;
    const n = Math.abs(e.value - e.target), i = Number(this.profile.targetRevealRadius ?? ((r = this.profile.signalAlignment) == null ? void 0 : r.targetRevealRadius) ?? 100);
    return i >= 100 || n <= e.tolerance ? !0 : n <= i;
  }
  updateAlignmentState(e = this.areAllChannelsAligned()) {
    this.wasAligned && !e && this.recordTraceSpike(), this.wasAligned = e;
  }
  checkDestabilization() {
    this.updateAlignmentState();
  }
  recordTraceSpike() {
    var n, i;
    const e = Math.max(0, Number(this.profile.destabilizationPenaltySeconds ?? 0));
    this.state.mistakes += 1, this.state.tracePenaltySeconds += e, e > 0 && ((i = (n = ui.notifications) == null ? void 0 : n.warn) == null || i.call(n, `Signal destabilized. Trace jumped by ${e}s.`));
  }
  startTimer() {
    var r;
    if (this.timer || !this.state.hasStarted || !this.startedAt || !this.lastTickAt) return;
    const e = Number(game.settings.get(Mt, "traceDurationMultiplier") ?? 1) || 1, n = Number(((r = this.profile.signalAlignment) == null ? void 0 : r.traceDurationSeconds) ?? this.profile.traceDurationSeconds ?? 60), i = Math.max(5, n * e);
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const a = performance.now(), o = Math.min(0.5, (a - this.lastTickAt) / 1e3);
      this.lastTickAt = a, this.applyDrift(o);
      const c = this.areAllChannelsAligned();
      this.state.lockProgress = c ? me(this.state.lockProgress + o / this.profile.lockHoldSeconds, 0, 1) : 0, this.updateAlignmentState(c);
      const l = (a - this.startedAt) / 1e3 + this.state.tracePenaltySeconds;
      this.state.traceProgress = me(l / i * 100, 0, 100), this.syncDom(), this.state.lockProgress >= 1 ? this.finish("success", "Transmission Decrypted") : this.state.traceProgress >= 100 && this.finish("failure", "Trace Complete");
    }, 120);
  }
  applyDrift(e) {
    const n = Number(this.profile.signalDriftSpeed ?? 0);
    if (!(n <= 0))
      for (const i of this.channels)
        i.value = Te(i.value + i.driftDirection * n * e), (i.value <= 0 || i.value >= 100) && (i.driftDirection *= -1);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(e, n, { close: i = !1 } = {}) {
    var a, o;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = e, this.stopTimer(), this.resultMessage = n, this.syncDom(), await this.render(!1), this.publishLiveState(!0);
    const r = {
      type: "signal-alignment",
      result: e,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      tracePenaltySeconds: this.state.tracePenaltySeconds,
      traceProgress: this.state.traceProgress,
      lockProgress: this.state.lockProgress,
      channels: this.channels.map((c) => ({ ...c }))
    };
    this.chatOnResult && await ke({
      title: "Signal Alignment",
      result: e,
      actorName: this.actorName,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), e === "success" ? (a = this.onSuccess) == null || a.call(this, r) : (o = this.onFailure) == null || o.call(this, r), i && await this.close();
  }
  syncDom() {
    var c;
    const e = (c = this.element) == null ? void 0 : c[0];
    if (!e) return;
    const n = e.querySelector("[data-trace-fill]"), i = e.querySelector("[data-trace-text]"), r = e.querySelector("[data-mistake-text]"), a = e.querySelector("[data-lock-fill]"), o = e.querySelector("[data-lock-text]");
    n && (n.style.width = `${this.state.traceProgress}%`), i && (i.textContent = `${Math.round(this.state.traceProgress)}%`), r && (r.textContent = `${this.state.tracePenaltySeconds.toFixed(0)}s`), a && (a.style.width = `${Math.round(this.state.lockProgress * 100)}%`), o && (o.textContent = `${Math.round(this.state.lockProgress * 100)}%`);
    for (const l of this.channels) {
      const u = e.querySelector(`[data-channel-row="${l.id}"]`);
      if (!u) continue;
      const d = Math.abs(l.value - l.target) <= l.tolerance, h = this.isTargetVisible(l);
      u.classList.toggle("is-aligned", d), u.classList.toggle("is-target-visible", h), u.querySelector("[data-channel-value]").textContent = l.value.toFixed(1), u.querySelector("[data-channel-target]").textContent = h ? String(l.target) : "??", u.querySelector("[data-channel-delta]").textContent = h ? Math.abs(l.value - l.target).toFixed(1) : "--", u.querySelector("[data-channel-state]").textContent = d ? "locked" : h ? "signal found" : "searching";
      const f = u.querySelector("[data-channel-slider]");
      f && document.activeElement !== f && (f.value = l.value);
      const g = u.querySelector("[data-wave-fill]");
      g && (g.style.width = `${l.value}%`, g.style.setProperty("--wave-duration", `${Math.max(1.2, 3.2 - Number(this.profile.noiseLevel ?? 0) * 2)}s`));
    }
    this.publishLiveState();
  }
  serializeLiveState() {
    return {
      state: { ...this.state },
      channels: this.channels.map((e) => ({ ...e })),
      wasAligned: this.wasAligned,
      resultMessage: this.resultMessage ?? ""
    };
  }
  getLiveSessionData() {
    return {
      type: "signal-alignment",
      options: {
        rollTotal: this.rollTotal,
        dc: this.dc,
        profile: this.profile,
        seed: this.seed,
        actorName: this.actorName
      },
      state: this.serializeLiveState()
    };
  }
  applyLiveState(e) {
    if (!this.readOnly || !(e != null && e.state)) return;
    const n = this.state.result !== e.state.result;
    this.state = { ...e.state }, this.channels = (e.channels ?? []).map((i) => ({ ...i })), this.wasAligned = !!e.wasAligned, this.resultMessage = e.resultMessage || void 0, n ? this.render(!1) : this.syncDom();
  }
  markLiveSessionEnded() {
    this.liveEnded = !0, this.render(!1);
  }
  publishLiveState(e = !1) {
    var n;
    this.readOnly || (n = this.onLiveState) == null || n.call(this, this.serializeLiveState(), { immediate: e });
  }
}
const ht = [
  { id: "cyan", label: "CYAN", color: "#4df6ff" },
  { id: "magenta", label: "MAGENTA", color: "#ff4fd8" },
  { id: "amber", label: "AMBER", color: "#ffc857" },
  { id: "lime", label: "LIME", color: "#8dff69" },
  { id: "violet", label: "VIOLET", color: "#a98cff" },
  { id: "red", label: "RED", color: "#ff6577" }
];
function Q(t, s, e) {
  return Math.min(e, Math.max(s, t));
}
function $n(t) {
  const s = String(t ?? "packet-switchboard");
  let e = 2166136261;
  for (let n = 0; n < s.length; n += 1)
    e ^= s.charCodeAt(n), e = Math.imul(e, 16777619);
  return e >>> 0;
}
function xn(t) {
  let s = $n(t);
  return () => {
    s += 1831565813;
    let e = s;
    return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
  };
}
function Nt(t) {
  return t < 0 ? "up" : t > 0 ? "down" : "straight";
}
function Lt(t, s) {
  const e = [0];
  return t > 0 && e.unshift(-1), t < s - 1 && e.push(1), e;
}
function On(t, s, e) {
  const n = Lt(s, e), i = n.indexOf(Number(t));
  return n[(i + 1) % n.length];
}
function Ae(t, s, e) {
  const n = Math.sign(Number(t) || 0);
  return Lt(s, e).includes(n) ? n : 0;
}
function En(t, s, e, n, i) {
  return t < s ? { shouldSpawn: !1, nextSpawnAt: s } : {
    shouldSpawn: n < i,
    nextSpawnAt: t + Math.max(350, e)
  };
}
function Fn(t, s, e = 0, n = (s == null ? void 0 : s.sourceRow) ?? 0) {
  let i = Q(Math.round(Number(n) || 0), 0, t.laneCount - 1);
  const r = [];
  for (let a = Math.max(0, Math.round(Number(e) || 0)); a < t.columnCount; a += 1) {
    const o = t.junctions.find((c) => c.row === i && c.column === a);
    o && (r.push(o.id), i = Q(i + Ae(o.direction, i, t.laneCount), 0, t.laneCount - 1));
  }
  return {
    junctionIds: r,
    finalRow: i,
    targetRow: Number((s == null ? void 0 : s.targetRow) ?? i),
    reachesTarget: i === Number((s == null ? void 0 : s.targetRow) ?? i)
  };
}
function Hn(t, s = Date.now()) {
  const e = t.packetSwitchboard ?? t, n = Q(Math.round(Number(e.laneCount) || 4), 3, ht.length), i = Q(Math.round(Number(e.columnCount) || 6), n - 1, 8), r = Q(Math.round(Number(e.deliveryGoal) || 7), 3, 20), a = Q(Math.round(Number(e.previewCount) || 2), 0, 6), o = xn(s), c = ht.slice(0, n).map((f, g) => ({
    ...f,
    row: g,
    inputPort: `IN-${String(g + 1).padStart(2, "0")}`,
    port: `OUT-${String(g + 1).padStart(2, "0")}`
  })), l = [];
  for (let f = 0; f < n; f += 1)
    for (let g = 0; g < i; g += 1)
      l.push({
        id: `junction-${f}-${g}`,
        row: f,
        column: g,
        gridRow: f + 1,
        gridColumn: g + 1,
        direction: 0,
        directionLabel: Nt(0)
      });
  const u = [], d = Math.max(r * 4, r + 12);
  let h = -1;
  for (let f = 0; f < d; f += 1) {
    let g = Math.floor(o() * n);
    g === h && n > 1 && (g = (g + 1 + Math.floor(o() * (n - 1))) % n), h = g;
    let S = Math.floor(o() * n);
    S === g && o() > 0.2 && (S = (S + 1 + Math.floor(o() * (n - 1))) % n);
    const b = c[g], k = c[S];
    u.push({
      id: `packet-${f + 1}`,
      sequence: f + 1,
      sourceRow: S,
      sourcePort: k.inputPort,
      targetRow: g,
      colorId: b.id,
      color: b.color,
      label: b.label,
      port: b.port
    });
  }
  return {
    laneCount: n,
    columnCount: i,
    deliveryGoal: r,
    previewCount: a,
    lanes: c,
    junctions: l,
    packetPlan: u
  };
}
function qn(t) {
  return Nt(t);
}
const Tt = "holosuite-hacking", _n = `modules/${Tt}/templates/packet-switchboard.html`, Gn = ee();
function ne(t, s, e) {
  return Math.min(e, Math.max(s, t));
}
function jn(t, s, e) {
  var i;
  const n = typeof ((i = globalThis.crypto) == null ? void 0 : i.randomUUID) == "function" ? globalThis.crypto.randomUUID() : `${Date.now()}:${performance.now()}:${Math.random()}`;
  return `${t}:${s}:${e.profileId ?? e.id}:switchboard:${n}`;
}
class Un extends Gn {
  constructor(e = {}) {
    super(e);
    m(this, "rollTotal");
    m(this, "dc");
    m(this, "profile");
    m(this, "tuning");
    m(this, "seed");
    m(this, "actorName");
    m(this, "onSuccess");
    m(this, "onFailure");
    m(this, "chatOnResult");
    m(this, "board");
    m(this, "state");
    m(this, "startedAt");
    m(this, "nextSpawnAt");
    m(this, "timer");
    m(this, "hoveredJunctionId");
    m(this, "boundHoveredKeydown");
    m(this, "resultMessage");
    m(this, "readOnly");
    m(this, "liveSessionId");
    m(this, "onLiveState");
    m(this, "onLiveEnd");
    m(this, "liveEnded");
    this.rollTotal = Number(e.rollTotal ?? 15), this.dc = Number(e.dc ?? 15), this.profile = e.profile ? { ...e.profile } : Z(this.rollTotal, this.dc), this.tuning = this.profile.packetSwitchboard ?? {}, this.seed = e.seed ?? jn(this.rollTotal, this.dc, this.profile), this.actorName = String(e.actorName ?? "Hacker"), this.onSuccess = typeof e.onSuccess == "function" ? e.onSuccess : null, this.onFailure = typeof e.onFailure == "function" ? e.onFailure : null, this.chatOnResult = e.chatOnResult !== !1, this.readOnly = e.readOnly === !0, this.liveSessionId = String(e.liveSessionId ?? ""), this.onLiveState = typeof e.onLiveState == "function" ? e.onLiveState : null, this.onLiveEnd = typeof e.onLiveEnd == "function" ? e.onLiveEnd : null, this.liveEnded = !1, this.board = Hn(this.profile, this.seed), this.state = {
      hasStarted: !1,
      isRunning: !1,
      result: null,
      traceProgress: 0,
      tracePenaltySeconds: 0,
      delivered: 0,
      corrupted: 0,
      nextPacketIndex: 0,
      activePackets: []
    }, this.startedAt = null, this.nextSpawnAt = null, this.timer = null, this.hoveredJunctionId = null, this.boundHoveredKeydown = (n) => this.handleHoveredJunctionKeydown(n);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-packet-switchboard-app",
      title: "Packet Switchboard",
      classes: ["packet-switchboard-window", "holosuite-hacking-window"],
      popOut: !0,
      resizable: !0,
      width: 980,
      height: 760,
      template: _n
    });
  }
  getData() {
    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      isReadOnly: this.readOnly,
      isLiveEnded: this.liveEnded,
      profile: this.profile,
      tuning: this.tuning,
      board: this.board,
      state: this.state,
      deliveryPercent: Math.round(this.state.delivered / this.board.deliveryGoal * 100),
      nextPackets: this.getUpcomingPackets(),
      gridStyle: `--lane-count: ${this.board.laneCount}; --column-count: ${this.board.columnCount};`,
      resultTitle: this.state.result === "success" ? "Payload Delivered" : "Routing Compromised",
      resultDetail: this.resultMessage ?? (this.state.result === "success" ? "All priority packets reached their ports." : "Trace completed before delivery."),
      glitchClass: this.profile.visualGlitchIntensity > 0.7 ? "glitch-high" : this.profile.visualGlitchIntensity > 0.35 ? "glitch-medium" : "glitch-low"
    };
  }
  activateListeners(e) {
    super.activateListeners(e), this.hoveredJunctionId = null, this.readOnly || (e.find("[data-junction-id]").on("click", (n) => this.cycleJunction(n.currentTarget.dataset.junctionId)), e.find("[data-junction-id]").on("mouseenter", (n) => this.setHoveredJunction(n.currentTarget.dataset.junctionId, n.currentTarget)), e.find("[data-junction-id]").on("mouseleave", (n) => this.clearHoveredJunction(n.currentTarget.dataset.junctionId, n.currentTarget)), e.find("[data-action='start']").on("click", () => this.startRun()), e.find("[data-action='abort']").on("click", () => this.abort())), e.find("[data-action='close']").on("click", () => this.close()), window.removeEventListener("keydown", this.boundHoveredKeydown), this.readOnly || window.addEventListener("keydown", this.boundHoveredKeydown), this.syncDom();
  }
  async render(e, n) {
    const i = await super.render(e, n);
    return !this.readOnly && this.state.hasStarted && this.state.isRunning && this.startTimer(), i;
  }
  async close(e = {}) {
    var i;
    const n = this.serializeLiveState();
    return this.stopTimer(), window.removeEventListener("keydown", this.boundHoveredKeydown), !this.readOnly && !this.liveEnded && (this.liveEnded = !0, (i = this.onLiveEnd) == null || i.call(this, n)), super.close(e);
  }
  getTraceDuration() {
    const e = Number(game.settings.get(Tt, "traceDurationMultiplier") ?? 1) || 1;
    return Math.max(5, Number(this.tuning.traceDurationSeconds ?? this.profile.traceDurationSeconds ?? 60) * e);
  }
  getUpcomingPackets() {
    const e = Math.max(0, Number(this.tuning.previewCount ?? this.board.previewCount) || 0);
    return this.board.packetPlan.slice(this.state.nextPacketIndex, this.state.nextPacketIndex + e);
  }
  getMaxActivePackets() {
    return ne(Math.round(Number(this.tuning.maxActivePackets) || 2), 1, 6);
  }
  startRun() {
    this.readOnly || this.state.hasStarted || this.state.result || (this.state.hasStarted = !0, this.state.isRunning = !0, this.startedAt = performance.now(), this.nextSpawnAt = this.startedAt, this.render(!1), this.publishLiveState(!0));
  }
  setHoveredJunction(e, n) {
    this.hoveredJunctionId = e, n == null || n.classList.add("is-keyboard-target");
  }
  clearHoveredJunction(e, n) {
    n == null || n.classList.remove("is-keyboard-target"), this.hoveredJunctionId === e && (this.hoveredJunctionId = null);
  }
  handleHoveredJunctionKeydown(e) {
    if (!this.hoveredJunctionId || e.altKey || e.ctrlKey || e.metaKey) return;
    const n = {
      ArrowUp: -1,
      ArrowRight: 0,
      ArrowDown: 1
    };
    e.key in n && (e.preventDefault(), e.stopPropagation(), this.setJunctionDirection(this.hoveredJunctionId, n[e.key]));
  }
  cycleJunction(e) {
    if (this.state.result) return;
    const n = this.board.junctions.find((i) => i.id === e);
    n && this.setJunctionDirection(e, On(n.direction, n.row, this.board.laneCount));
  }
  setJunctionDirection(e, n) {
    var a, o;
    if (this.state.result) return;
    const i = this.board.junctions.find((c) => c.id === e);
    if (!i) return;
    i.direction = Ae(n, i.row, this.board.laneCount), i.directionLabel = qn(i.direction);
    const r = (o = (a = this.element) == null ? void 0 : a[0]) == null ? void 0 : o.querySelector(`[data-junction-id="${i.id}"]`);
    r && (r.dataset.direction = i.directionLabel, r.setAttribute("aria-label", `Junction lane ${i.row + 1}, column ${i.column + 1}: ${i.directionLabel}`), r.setAttribute("title", `Route ${i.directionLabel}. Click to change direction.`)), this.syncRoutePreview(), this.publishLiveState(!0);
  }
  startTimer() {
    this.timer || !this.state.hasStarted || !this.startedAt || (this.timer = window.setInterval(() => this.tick(performance.now()), 80));
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  tick(e) {
    if (!this.state.isRunning || !this.startedAt || this.nextSpawnAt === null) return;
    const n = Math.max(350, Number(this.tuning.packetIntervalSeconds ?? 2) * 1e3), i = En(
      e,
      this.nextSpawnAt,
      n,
      this.state.activePackets.length,
      this.getMaxActivePackets()
    );
    this.nextSpawnAt = i.nextSpawnAt, i.shouldSpawn && this.state.isRunning && this.spawnPacket(e);
    const r = Math.max(250, Number(this.tuning.packetStepSeconds ?? 0.8) * 1e3);
    for (const o of [...this.state.activePackets])
      for (; this.state.isRunning && e >= o.nextMoveAt && (this.advancePacket(o), o.nextMoveAt += r, !!this.state.activePackets.includes(o)); )
        ;
    const a = (e - this.startedAt) / 1e3 + this.state.tracePenaltySeconds;
    this.state.traceProgress = ne(a / this.getTraceDuration() * 100, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
  }
  spawnPacket(e) {
    const n = this.board.packetPlan[this.state.nextPacketIndex % this.board.packetPlan.length];
    this.state.nextPacketIndex += 1, this.state.activePackets.push({
      ...n,
      runtimeId: `${n.id}-${this.state.nextPacketIndex}`,
      row: n.sourceRow,
      column: -1,
      nextMoveAt: e + Math.max(0, Number(this.tuning.entryHoldSeconds ?? 1.5) * 1e3)
    }), this.syncPreview();
  }
  advancePacket(e) {
    if (e.column < 0) {
      e.column = 0;
      return;
    }
    const n = this.board.junctions.find((i) => i.row === e.row && i.column === e.column);
    e.row = ne(e.row + Number((n == null ? void 0 : n.direction) ?? 0), 0, this.board.laneCount - 1), e.column += 1, e.column >= this.board.columnCount && this.resolvePacket(e);
  }
  resolvePacket(e) {
    var i, r;
    if (this.state.activePackets = this.state.activePackets.filter((a) => a.runtimeId !== e.runtimeId), e.row === e.targetRow) {
      this.state.delivered += 1, this.flashBoard("delivery-pulse"), this.state.delivered >= this.board.deliveryGoal && this.finish("success", "Priority payload delivered");
      return;
    }
    this.state.corrupted += 1;
    const n = Math.max(0, Number(this.tuning.misroutePenaltySeconds ?? 5));
    this.state.tracePenaltySeconds += n, this.flashBoard("misroute-pulse"), n > 0 && ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, `Packet misrouted. Trace jumped by ${n}s.`));
  }
  flashBoard(e) {
    var i, r, a;
    const n = (r = (i = this.element) == null ? void 0 : i.find) == null ? void 0 : r.call(i, ".packet-switchboard-shell");
    (a = n == null ? void 0 : n.addClass) == null || a.call(n, e), window.setTimeout(() => {
      var o;
      return (o = n == null ? void 0 : n.removeClass) == null ? void 0 : o.call(n, e);
    }, 320);
  }
  syncPreview() {
    var n, i;
    const e = (i = (n = this.element) == null ? void 0 : n[0]) == null ? void 0 : i.querySelector("[data-packet-preview]");
    if (e) {
      if (e.replaceChildren(...this.getUpcomingPackets().map((r) => {
        const a = document.createElement("span");
        return a.className = "packet-preview-chip", a.style.setProperty("--packet-color", r.color), a.textContent = `${r.sourcePort} -> ${r.port} / ${r.label}`, a;
      })), !e.childElementCount) {
        const r = document.createElement("span");
        r.className = "packet-preview-hidden", r.textContent = "Encrypted", e.appendChild(r);
      }
      this.syncRoutePreview();
    }
  }
  syncRoutePreview() {
    var c, l, u;
    const e = (c = this.element) == null ? void 0 : c[0];
    if (!e) return;
    e.querySelectorAll(".packet-junction.is-route-preview, .packet-junction.is-route-danger").forEach((d) => {
      d.classList.remove("is-route-preview", "is-route-danger");
    }), e.querySelectorAll(".packet-switchboard-inputs .is-preview-source, .packet-switchboard-outputs .is-preview-target").forEach((d) => {
      d.classList.remove("is-preview-source", "is-preview-target");
    });
    const n = this.state.activePackets[0] ?? null, i = n ?? this.getUpcomingPackets()[0] ?? null;
    if (!i) {
      this.syncConnectionLines();
      return;
    }
    const r = n ? Math.max(0, Number(n.column) || 0) : 0, a = n ? n.row : i.sourceRow, o = Fn(this.board, i, r, a);
    for (const d of o.junctionIds) {
      const h = e.querySelector(`[data-junction-id="${d}"]`);
      h == null || h.classList.add("is-route-preview"), o.reachesTarget || h == null || h.classList.add("is-route-danger");
    }
    (l = e.querySelector(`[data-input-row="${i.sourceRow}"]`)) == null || l.classList.add("is-preview-source"), (u = e.querySelector(`[data-output-row="${i.targetRow}"]`)) == null || u.classList.add("is-preview-target"), this.syncConnectionLines();
  }
  syncConnectionLines() {
    var i;
    const e = (i = this.element) == null ? void 0 : i[0];
    if (!e) return;
    const n = 0.5 / this.board.columnCount * 100;
    for (const r of this.board.lanes) {
      const a = e.querySelector(`[data-input-connection-row="${r.row}"]`);
      if (!a) continue;
      const o = (r.row + 0.5) / this.board.laneCount * 100;
      a.setAttribute("x1", "0"), a.setAttribute("y1", String(o)), a.setAttribute("x2", String(n)), a.setAttribute("y2", String(o));
      const c = e.querySelector(`[data-input-row="${r.row}"]`), l = e.querySelector(".packet-junction.is-route-preview"), u = !!(c != null && c.classList.contains("is-preview-source"));
      a.classList.toggle("is-route-preview", u), a.classList.toggle("is-route-danger", u && !!(l != null && l.classList.contains("is-route-danger")));
    }
    for (const r of this.board.junctions) {
      const a = e.querySelector(`[data-connection-id="${r.id}"]`);
      if (!a) continue;
      const o = Ae(r.direction, r.row, this.board.laneCount), c = ne(r.row + o, 0, this.board.laneCount - 1), l = (r.column + 0.5) / this.board.columnCount * 100, u = r.column >= this.board.columnCount - 1 ? 100 : (r.column + 1.5) / this.board.columnCount * 100, d = (r.row + 0.5) / this.board.laneCount * 100, h = (c + 0.5) / this.board.laneCount * 100;
      a.setAttribute("x1", String(l)), a.setAttribute("y1", String(d)), a.setAttribute("x2", String(u)), a.setAttribute("y2", String(h));
      const f = e.querySelector(`[data-junction-id="${r.id}"]`);
      a.classList.toggle("is-route-preview", !!(f != null && f.classList.contains("is-route-preview"))), a.classList.toggle("is-route-danger", !!(f != null && f.classList.contains("is-route-danger")));
    }
  }
  syncPackets() {
    var i, r;
    const e = (r = (i = this.element) == null ? void 0 : i[0]) == null ? void 0 : r.querySelector("[data-packet-layer]");
    if (!e) return;
    const n = new Set(this.state.activePackets.map((a) => a.runtimeId));
    e.querySelectorAll("[data-runtime-packet]").forEach((a) => {
      const o = a;
      n.has(o.dataset.runtimePacket) || o.remove();
    });
    for (const a of this.state.activePackets) {
      let o = e.querySelector(`[data-runtime-packet="${a.runtimeId}"]`);
      if (!o) {
        o = document.createElement("div"), o.className = "switchboard-packet", o.dataset.runtimePacket = a.runtimeId, o.style.setProperty("--packet-color", a.color);
        const u = document.createElement("span");
        u.textContent = String(a.targetRow + 1), o.appendChild(u), o.title = `${a.label} packet to ${a.port}`, e.appendChild(o);
      }
      const c = a.column < 0 ? 0 : (a.column + 0.5) / this.board.columnCount * 100, l = (a.row + 0.5) / this.board.laneCount * 100;
      o.style.left = `${ne(c, 0, 100)}%`, o.style.top = `${l}%`;
    }
  }
  syncDom() {
    var a;
    const e = (a = this.element) == null ? void 0 : a[0];
    if (!e) return;
    const n = e.querySelector("[data-trace-fill]"), i = e.querySelector("[data-delivery-fill]");
    n && (n.style.width = `${this.state.traceProgress}%`), i && (i.style.width = `${Math.min(100, this.state.delivered / this.board.deliveryGoal * 100)}%`);
    const r = {
      "[data-trace-text]": `${Math.round(this.state.traceProgress)}%`,
      "[data-delivery-text]": `${this.state.delivered} / ${this.board.deliveryGoal}`,
      "[data-corrupted-text]": String(this.state.corrupted),
      "[data-active-text]": `${this.state.activePackets.length} / ${this.getMaxActivePackets()}`
    };
    for (const [o, c] of Object.entries(r)) {
      const l = e.querySelector(o);
      l && (l.textContent = c);
    }
    this.syncPackets(), this.syncRoutePreview(), this.publishLiveState();
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(e, n, { close: i = !1 } = {}) {
    var a, o;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = e, this.stopTimer(), this.resultMessage = n, await this.render(!1), this.publishLiveState(!0);
    const r = {
      type: "packet-switchboard",
      result: e,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      delivered: this.state.delivered,
      corrupted: this.state.corrupted,
      tracePenaltySeconds: this.state.tracePenaltySeconds,
      traceProgress: this.state.traceProgress
    };
    this.chatOnResult && await ke({
      title: "Packet Switchboard",
      result: e,
      actorName: this.actorName,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), e === "success" ? (a = this.onSuccess) == null || a.call(this, r) : (o = this.onFailure) == null || o.call(this, r), i && await this.close();
  }
  serializeLiveState() {
    return {
      state: {
        ...this.state,
        activePackets: this.state.activePackets.map((e) => ({ ...e }))
      },
      junctions: this.board.junctions.map((e) => ({
        id: e.id,
        direction: e.direction,
        directionLabel: e.directionLabel
      })),
      resultMessage: this.resultMessage ?? ""
    };
  }
  getLiveSessionData() {
    return {
      type: "packet-switchboard",
      options: {
        rollTotal: this.rollTotal,
        dc: this.dc,
        profile: this.profile,
        seed: this.seed,
        actorName: this.actorName
      },
      state: this.serializeLiveState()
    };
  }
  applyLiveState(e) {
    if (!this.readOnly || !(e != null && e.state)) return;
    const n = JSON.stringify({
      junctions: this.board.junctions.map((r) => [r.id, r.direction]),
      result: this.state.result
    });
    this.state = {
      ...e.state,
      activePackets: (e.state.activePackets ?? []).map((r) => ({ ...r }))
    };
    for (const r of e.junctions ?? []) {
      const a = this.board.junctions.find((o) => o.id === r.id);
      a && Object.assign(a, r);
    }
    this.resultMessage = e.resultMessage || void 0;
    const i = JSON.stringify({
      junctions: this.board.junctions.map((r) => [r.id, r.direction]),
      result: this.state.result
    });
    n !== i ? this.render(!1) : (this.syncPreview(), this.syncDom());
  }
  markLiveSessionEnded() {
    this.liveEnded = !0, this.render(!1);
  }
  publishLiveState(e = !1) {
    var n;
    this.readOnly || (n = this.onLiveState) == null || n.call(this, this.serializeLiveState(), { immediate: e });
  }
}
const zn = ["#57f3ff", "#b779ff", "#ffcd57", "#66ffad"];
function z(t, s, e) {
  return Math.min(e, Math.max(s, t));
}
function q(t, s) {
  return (Math.round(t) % s + s) % s;
}
function Bn(t) {
  const s = String(t ?? "prism-lock");
  let e = 2166136261;
  for (let n = 0; n < s.length; n += 1)
    e ^= s.charCodeAt(n), e = Math.imul(e, 16777619);
  return e >>> 0;
}
function Vn(t) {
  let s = Bn(t);
  return () => {
    s += 1831565813;
    let e = s;
    return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
  };
}
function ft(t, s) {
  const e = [...t];
  for (let n = e.length - 1; n > 0; n -= 1) {
    const i = Math.floor(s() * (n + 1));
    [e[n], e[i]] = [e[i], e[n]];
  }
  return e;
}
function W(t, s, e) {
  const n = q(t, e) / e * Math.PI * 2 - Math.PI / 2;
  return {
    x: 50 + Math.cos(n) * s,
    y: 50 + Math.sin(n) * s
  };
}
function mt(t, s) {
  return t.find((e) => e.id === s.id) ?? {
    id: s.id,
    rotation: s.initialRotation ?? 0,
    enabled: s.initialEnabled !== !1
  };
}
function B(t, s) {
  const e = /* @__PURE__ */ new Set(), n = [], i = [], r = [];
  for (const c of t.rings) {
    const l = mt(s, c);
    if (l.enabled)
      for (const u of c.blockers) {
        const d = q(u.baseSlot + l.rotation, t.slotCount);
        r.push({
          id: u.id,
          ringId: c.id,
          ringIndex: c.index,
          slot: d,
          color: c.color,
          ...W(d, c.radius, t.slotCount)
        });
      }
  }
  for (const c of t.rings) {
    const l = mt(s, c);
    if (l.enabled)
      for (const u of c.emitters) {
        const d = q(u.baseSlot + l.rotation, t.slotCount), h = W(d, c.radius, t.slotCount), f = r.filter((b) => b.ringIndex > c.index && b.slot === d).sort((b, k) => b.ringIndex - k.ringIndex)[0] ?? null, g = f ? Math.max(c.radius + 1, t.rings[f.ringIndex].radius - 2.2) : t.receiverRadius, S = W(d, g, t.slotCount);
        f || e.add(d), i.push({
          id: u.id,
          ringId: c.id,
          slot: d,
          color: c.color,
          x: h.x,
          y: h.y
        }), n.push({
          id: `${u.id}-beam`,
          ringId: c.id,
          slot: d,
          color: c.color,
          x1: h.x,
          y1: h.y,
          x2: S.x,
          y2: S.y,
          blocked: !!f
        });
      }
  }
  const a = t.receivers.map((c) => ({
    ...c,
    lit: e.has(c.slot),
    ...W(c.slot, t.receiverRadius, t.slotCount)
  })), o = t.iceReceivers.map((c) => {
    const l = W(c.slot, t.receiverRadius, t.slotCount);
    return {
      ...c,
      lit: e.has(c.slot),
      ...l,
      rectX: l.x - 2.2,
      rectY: l.y - 2.2
    };
  });
  return {
    beams: n,
    emitters: i,
    blockers: r,
    receivers: a,
    iceReceivers: o,
    litSlots: [...e],
    activeIceSlots: o.filter((c) => c.lit).map((c) => c.slot),
    litReceiverCount: a.filter((c) => c.lit).length,
    solved: a.every((c) => c.lit) && o.every((c) => !c.lit)
  };
}
function Jn(t, s, e, n) {
  return t.map((i) => i.id === s ? { ...i, rotation: q(i.rotation + Math.sign(e), n) } : { ...i });
}
function Kn(t, s = Date.now()) {
  var T;
  const e = t.prismLock ?? t, n = Vn(s), i = z(Math.round(Number(e.ringCount) || 3), 2, 4), r = z(Math.round(Number(e.slotCount) || 10), 8, 16), a = z(Math.round(Number(e.receiverCount) || 4), 2, Math.min(8, r - 2)), o = z(Math.round(Number(e.switchableRingCount) || 0), 0, i - 1), c = Math.min(4, r - a), l = o > 0 && c > 0 ? 1 : 0, u = z(Math.round(Number(e.iceReceiverCount) || 0), l, c), d = i - o, h = z(Math.round(Number(e.blockersPerRing) || 0), 0, 3), f = z(Math.round(Number(e.scrambleSteps) || 3), 1, Math.floor(r / 2)), g = ft(Array.from({ length: r }, (p, v) => v), n), S = g.slice(0, a), b = g.slice(a, a + u), k = Array.from({ length: i }, () => Math.floor(n() * r)), I = S.map((p, v) => ({
    slot: p,
    ringIndex: v % d
  })), C = Array.from({ length: i }, (p, v) => {
    const M = k[v], A = v >= d, L = I.filter((R) => R.ringIndex === v).map((R) => R.slot), $ = A ? [b[(v - d) % Math.max(1, b.length)] ?? g.at(-1) ?? 0] : L, j = /* @__PURE__ */ new Set([...S, ...b]), J = ft(
      Array.from({ length: r }, (R, F) => F).filter((R) => !j.has(R)),
      n
    ).slice(0, h), K = 1 + Math.floor(n() * f);
    return {
      id: `ring-${v + 1}`,
      index: v,
      label: `RING ${String(v + 1).padStart(2, "0")}`,
      color: zn[v],
      radius: 14 + v * 8,
      switchable: A,
      solvedRotation: M,
      solvedEnabled: !A,
      initialRotation: q(M + K, r),
      initialEnabled: !0,
      emitters: $.map((R, F) => ({
        id: `ring-${v + 1}-emitter-${F + 1}`,
        baseSlot: q(R - M, r)
      })),
      blockers: J.map((R, F) => ({
        id: `ring-${v + 1}-blocker-${F + 1}`,
        baseSlot: q(R - M, r)
      }))
    };
  }), P = {
    ringCount: i,
    slotCount: r,
    receiverCount: a,
    receiverRadius: 46,
    rings: C,
    receivers: S.map((p, v) => ({ id: `receiver-${v + 1}`, slot: p })),
    iceReceivers: b.map((p, v) => ({ id: `ice-${v + 1}`, slot: p })),
    ticks: Array.from({ length: r }, (p, v) => ({
      slot: v,
      ...W(v, 42.5, r)
    })),
    solutionStates: C.map((p) => ({ id: p.id, rotation: p.solvedRotation, enabled: p.solvedEnabled })),
    initialStates: C.map((p) => ({ id: p.id, rotation: p.initialRotation, enabled: p.initialEnabled }))
  };
  if (B(P, P.initialStates).solved) {
    let p = P.initialStates;
    e: for (const v of C)
      for (let M = 1; M < r; M += 1) {
        const A = P.initialStates.map((L) => L.id === v.id ? { ...L, rotation: q(L.rotation + M, r) } : { ...L });
        if (!B(P, A).solved) {
          p = A;
          break e;
        }
      }
    P.initialStates = p;
    for (const v of C)
      v.initialRotation = ((T = P.initialStates.find((M) => M.id === v.id)) == null ? void 0 : T.rotation) ?? v.initialRotation;
  }
  return P;
}
const At = "holosuite-hacking", Wn = `modules/${At}/templates/prism-lock.html`, Xn = ee();
function Yn(t, s, e) {
  return Math.min(e, Math.max(s, t));
}
function Qn(t, s, e) {
  var i;
  const n = typeof ((i = globalThis.crypto) == null ? void 0 : i.randomUUID) == "function" ? globalThis.crypto.randomUUID() : `${Date.now()}:${performance.now()}:${Math.random()}`;
  return `${t}:${s}:${e.profileId ?? e.id}:prism:${n}`;
}
class Zn extends Xn {
  constructor(e = {}) {
    super(e);
    m(this, "rollTotal");
    m(this, "dc");
    m(this, "profile");
    m(this, "tuning");
    m(this, "seed");
    m(this, "actorName");
    m(this, "onSuccess");
    m(this, "onFailure");
    m(this, "chatOnResult");
    m(this, "board");
    m(this, "state");
    m(this, "startedAt");
    m(this, "timer");
    m(this, "previousIceSlots");
    m(this, "resultMessage");
    m(this, "readOnly");
    m(this, "liveSessionId");
    m(this, "onLiveState");
    m(this, "onLiveEnd");
    m(this, "liveEnded");
    this.rollTotal = Number(e.rollTotal ?? 15), this.dc = Number(e.dc ?? 15), this.profile = e.profile ? { ...e.profile } : Z(this.rollTotal, this.dc), this.tuning = this.profile.prismLock ?? {}, this.seed = e.seed ?? Qn(this.rollTotal, this.dc, this.profile), this.actorName = String(e.actorName ?? "Hacker"), this.onSuccess = typeof e.onSuccess == "function" ? e.onSuccess : null, this.onFailure = typeof e.onFailure == "function" ? e.onFailure : null, this.chatOnResult = e.chatOnResult !== !1, this.readOnly = e.readOnly === !0, this.liveSessionId = String(e.liveSessionId ?? ""), this.onLiveState = typeof e.onLiveState == "function" ? e.onLiveState : null, this.onLiveEnd = typeof e.onLiveEnd == "function" ? e.onLiveEnd : null, this.liveEnded = !1, this.board = Kn(this.profile, this.seed), this.state = {
      rings: this.board.initialStates.map((n) => ({ ...n })),
      hasStarted: !1,
      isRunning: !1,
      result: null,
      traceProgress: 0,
      tracePenaltySeconds: 0,
      moves: 0
    }, this.startedAt = null, this.timer = null, this.previousIceSlots = new Set(B(this.board, this.state.rings).activeIceSlots);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-prism-lock-app",
      title: "Prism Lock",
      classes: ["prism-lock-window", "holosuite-hacking-window"],
      popOut: !0,
      resizable: !0,
      width: 940,
      height: 760,
      template: Wn
    });
  }
  getData() {
    const e = B(this.board, this.state.rings), n = this.board.rings.map((i) => {
      const r = this.state.rings.find((a) => a.id === i.id) ?? {};
      return {
        ...i,
        rotation: r.rotation ?? 0,
        enabled: r.enabled !== !1,
        statusLabel: r.enabled === !1 ? "phased out" : "active"
      };
    });
    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      isReadOnly: this.readOnly,
      isLiveEnded: this.liveEnded,
      profile: this.profile,
      tuning: this.tuning,
      board: this.board,
      rings: n,
      evaluation: e,
      state: this.state,
      receiverPercent: Math.round(e.litReceiverCount / this.board.receiverCount * 100),
      resultTitle: this.state.result === "success" ? "Lattice Resolved" : "Prism Lock Rejected",
      resultDetail: this.resultMessage ?? (this.state.result === "success" ? "All authorization receptors illuminated." : "Trace completed before alignment."),
      glitchClass: this.profile.visualGlitchIntensity > 0.7 ? "glitch-high" : this.profile.visualGlitchIntensity > 0.35 ? "glitch-medium" : "glitch-low"
    };
  }
  activateListeners(e) {
    super.activateListeners(e), this.readOnly || (e.find("[data-action='rotate-ring']").on("click", (n) => {
      this.rotateRing(n.currentTarget.dataset.ringId, Number(n.currentTarget.dataset.direction));
    }), e.find("[data-action='toggle-ring']").on("click", (n) => this.toggleRing(n.currentTarget.dataset.ringId)), e.find("[data-action='start']").on("click", () => this.startRun()), e.find("[data-action='abort']").on("click", () => this.abort())), e.find("[data-action='close']").on("click", () => this.close()), this.syncDom();
  }
  async render(e, n) {
    const i = await super.render(e, n);
    return !this.readOnly && this.state.hasStarted && this.state.isRunning && this.startTimer(), i;
  }
  async close(e = {}) {
    var i;
    const n = this.serializeLiveState();
    return this.stopTimer(), !this.readOnly && !this.liveEnded && (this.liveEnded = !0, (i = this.onLiveEnd) == null || i.call(this, n)), super.close(e);
  }
  getTraceDuration() {
    const e = Number(game.settings.get(At, "traceDurationMultiplier") ?? 1) || 1;
    return Math.max(5, Number(this.tuning.traceDurationSeconds ?? this.profile.traceDurationSeconds ?? 60) * e);
  }
  startRun() {
    this.readOnly || this.state.hasStarted || this.state.result || (this.state.hasStarted = !0, this.state.isRunning = !0, this.startedAt = performance.now(), this.previousIceSlots = new Set(B(this.board, this.state.rings).activeIceSlots), this.render(!1), this.publishLiveState(!0));
  }
  rotateRing(e, n) {
    !this.state.isRunning || !n || (this.state.rings = Jn(this.state.rings, e, n, this.board.slotCount), this.state.moves += 1, this.evaluateMove());
  }
  toggleRing(e) {
    if (!this.state.isRunning) return;
    const n = this.board.rings.find((i) => i.id === e);
    n != null && n.switchable && (this.state.rings = this.state.rings.map((i) => i.id === e ? { ...i, enabled: !i.enabled } : { ...i }), this.state.moves += 1, this.evaluateMove());
  }
  evaluateMove() {
    var i, r;
    const e = B(this.board, this.state.rings), n = e.activeIceSlots.filter((a) => !this.previousIceSlots.has(a));
    if (this.previousIceSlots = new Set(e.activeIceSlots), n.length) {
      const a = Math.max(0, Number(this.tuning.icePenaltySeconds ?? 5)) * n.length;
      this.state.tracePenaltySeconds += a, a > 0 && ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, `ICE receptor energized. Trace jumped by ${a}s.`));
    }
    if (e.solved) {
      this.finish("success", "Authorization lattice resolved");
      return;
    }
    this.render(!1), this.publishLiveState(!0);
  }
  startTimer() {
    this.timer || !this.state.hasStarted || !this.startedAt || (this.timer = window.setInterval(() => {
      if (!this.state.isRunning || !this.startedAt) return;
      const e = (performance.now() - this.startedAt) / 1e3 + this.state.tracePenaltySeconds;
      this.state.traceProgress = Yn(e / this.getTraceDuration() * 100, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
    }, 120));
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  syncDom() {
    var r;
    const e = (r = this.element) == null ? void 0 : r[0];
    if (!e) return;
    const n = e.querySelector("[data-trace-fill]"), i = e.querySelector("[data-trace-text]");
    n && (n.style.width = `${this.state.traceProgress}%`), i && (i.textContent = `${Math.round(this.state.traceProgress)}%`), this.publishLiveState();
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(e, n, { close: i = !1 } = {}) {
    var o, c;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = e, this.stopTimer(), this.resultMessage = n, await this.render(!1), this.publishLiveState(!0);
    const r = B(this.board, this.state.rings), a = {
      type: "prism-lock",
      result: e,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      moves: this.state.moves,
      litReceiverCount: r.litReceiverCount,
      activeIceSlots: r.activeIceSlots,
      tracePenaltySeconds: this.state.tracePenaltySeconds,
      traceProgress: this.state.traceProgress
    };
    this.chatOnResult && await ke({
      title: "Prism Lock",
      result: e,
      actorName: this.actorName,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), e === "success" ? (o = this.onSuccess) == null || o.call(this, a) : (c = this.onFailure) == null || c.call(this, a), i && await this.close();
  }
  serializeLiveState() {
    return {
      state: {
        ...this.state,
        rings: this.state.rings.map((e) => ({ ...e }))
      },
      previousIceSlots: [...this.previousIceSlots],
      resultMessage: this.resultMessage ?? ""
    };
  }
  getLiveSessionData() {
    return {
      type: "prism-lock",
      options: {
        rollTotal: this.rollTotal,
        dc: this.dc,
        profile: this.profile,
        seed: this.seed,
        actorName: this.actorName
      },
      state: this.serializeLiveState()
    };
  }
  applyLiveState(e) {
    if (!this.readOnly || !(e != null && e.state)) return;
    const n = JSON.stringify({ rings: this.state.rings, result: this.state.result });
    this.state = {
      ...e.state,
      rings: (e.state.rings ?? []).map((r) => ({ ...r }))
    }, this.previousIceSlots = new Set(e.previousIceSlots ?? []), this.resultMessage = e.resultMessage || void 0;
    const i = JSON.stringify({ rings: this.state.rings, result: this.state.result });
    n !== i ? this.render(!1) : this.syncDom();
  }
  markLiveSessionEnded() {
    this.liveEnded = !0, this.render(!1);
  }
  publishLiveState(e = !1) {
    var n;
    this.readOnly || (n = this.onLiveState) == null || n.call(this, this.serializeLiveState(), { immediate: e });
  }
}
const N = "holosuite-hacking", G = `module.${N}`, ei = 10 * 60 * 1e3, ti = 200;
let D = null, ge = null;
const Ie = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map();
function ni() {
  game.settings.register(N, "defaultDc", {
    name: "Default Hacking DC",
    hint: "Used by the GM launcher and API calls that omit a DC.",
    scope: "world",
    config: !0,
    type: Number,
    default: 15
  }), game.settings.register(N, "traceDurationMultiplier", {
    name: "Default Trace Duration Multiplier",
    hint: "Multiplies trace timers for all HoloSuite hacking minigames.",
    scope: "world",
    config: !0,
    type: Number,
    default: 1
  }), game.settings.register(N, "nodeTakeoverDurationSeconds", {
    name: "Node Takeover Duration Override",
    hint: "Optional fixed seconds for claiming a Node Intrusion node. Set to 0 to use the selected difficulty profile.",
    scope: "world",
    config: !0,
    type: Number,
    default: 0
  }), game.settings.registerMenu(N, "difficultyProfilesMenu", {
    name: "Difficulty Profiles",
    label: "Configure Profiles",
    hint: "Tune Node Intrusion, Signal Alignment, Packet Switchboard, and Prism Lock difficulty settings.",
    icon: "fas fa-sliders",
    type: ln,
    restricted: !0
  }), game.settings.register(N, "difficultyProfileOverrides", {
    name: "Difficulty Profile Data",
    hint: "Internal storage for the Difficulty Profiles configuration menu.",
    scope: "world",
    config: !1,
    type: String,
    default: ""
  }), game.settings.register(N, "allowPlayerInteraction", {
    name: "Allow Players To Interact Directly",
    hint: "Reserved for future player-targeted play. The GM launcher remains GM-only for now.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(N, "defaultLiveAudience", {
    name: "Default Live Hacking Audience",
    hint: "Choose who receives a read-only live view when a player begins a hacking challenge.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      none: "Nobody",
      gm: "GM only",
      everyone: "GM and players"
    },
    default: "everyone"
  }), game.settings.register(N, "watchOtherHacks", {
    name: "Watch Other Players' Hacks",
    hint: "Automatically open read-only live views for hacks included in the GM's selected audience. This preference only affects your client.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !0,
    onChange: (t) => {
      t ? $t() : li();
    }
  }), game.settings.register(N, "visualGlitchIntensity", {
    name: "Visual Glitch Intensity",
    hint: "Global visual preference. Difficulty profiles still apply their own gameplay tuning.",
    scope: "client",
    config: !0,
    type: String,
    choices: {
      low: "Low",
      medium: "Medium",
      high: "High"
    },
    default: "medium"
  });
}
function ii() {
  le({
    id: "node-intrusion",
    title: "Node Intrusion",
    icon: "fa-solid fa-network-wired",
    create: (t) => new Mn(t)
  }), le({
    id: "signal-alignment",
    title: "Signal Alignment",
    icon: "fa-solid fa-wave-square",
    create: (t) => new Dn(t)
  }), le({
    id: "packet-switchboard",
    title: "Packet Switchboard",
    icon: "fa-solid fa-shuffle",
    create: (t) => new Un(t)
  }), le({
    id: "prism-lock",
    title: "Prism Lock",
    icon: "fa-solid fa-bullseye",
    create: (t) => new Zn(t)
  });
}
function Rt() {
  var t, s, e;
  return (t = game.user) != null && t.isGM ? (ge = ge ?? new Zt({ api: D }), ge.render(!0), ge) : ((e = (s = ui.notifications) == null ? void 0 : s.warn) == null || e.call(s, "Only the GM can open HoloSuite Hacking."), null);
}
function Dt() {
  D = D ?? Ut({ moduleId: N, openLauncher: Rt }), D.sendHackToPlayer = si, D.registerWithHoloSuite = Re;
  const t = game.modules.get(N);
  return t && (t.api = D), game.holosuiteHacking = D, D;
}
function si(t = {}) {
  var o, c, l, u, d, h, f;
  if (!((o = game.user) != null && o.isGM))
    return (l = (c = ui.notifications) == null ? void 0 : c.warn) == null || l.call(c, "Only the GM can send HoloSuite hacking challenges."), !1;
  if (!game.socket)
    return (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(u, "Foundry sockets are not available."), !1;
  const s = xt(t), e = xe(s.userId), n = qe(s.actorId, e);
  n ? e && !re(n, e) && console.warn(`${N} | ${e.name} does not appear to own ${n.name}; sending fallback roll data anyway.`) : console.warn(`${N} | Could not resolve hacker actor.`, {
    actorId: s.actorId,
    userId: s.userId,
    availableUsers: $e().map((g) => ({ id: g.id, name: g.name, isGM: g.isGM })),
    userCharacter: se(e),
    ownedActors: Ee(e).map((g) => ({ id: g.id, name: g.name }))
  });
  const i = St(n, s.skillId), r = s.skillLabel || Ce(s.skillId, i), a = Number.isFinite(Number(s.skillModifier)) && Number(s.skillModifier) !== 0 ? Number(s.skillModifier) : Fe(i);
  if (typeof t.onSuccess == "function" || typeof t.onFailure == "function") {
    const g = window.setTimeout(() => Ie.delete(s.requestId), ei);
    Ie.set(s.requestId, {
      onSuccess: typeof t.onSuccess == "function" ? t.onSuccess : null,
      onFailure: typeof t.onFailure == "function" ? t.onFailure : null,
      timeoutId: g
    });
  }
  return game.socket.emit(G, {
    type: "launch-request",
    payload: {
      ...s,
      actorId: (n == null ? void 0 : n.id) ?? "",
      actorName: (n == null ? void 0 : n.name) ?? (e == null ? void 0 : e.name) ?? "Hacker",
      skillLabel: r,
      skillModifier: a,
      gmUserId: game.user.id
    }
  }), (f = (h = ui.notifications) == null ? void 0 : h.info) == null || f.call(h, `${Pe(s.minigameType)} sent${e ? ` to ${e.name}` : " to players"}.`), !0;
}
function ri(t) {
  var s, e, n, i;
  try {
    if (String((t == null ? void 0 : t.type) ?? "").startsWith("live-")) {
      oi(t);
      return;
    }
    if ((t == null ? void 0 : t.type) === "result-report") {
      gi(t.payload ?? {});
      return;
    }
    if ((t == null ? void 0 : t.type) !== "launch-request") return;
    const r = xt(t.payload ?? {});
    if (r.userId && r.userId !== ((s = game.user) == null ? void 0 : s.id) || !r.userId && ((e = game.user) != null && e.isGM)) return;
    const a = qe(r.actorId, xe(r.userId) ?? game.user), o = r.actorName || (a == null ? void 0 : a.name) || "Intruder", c = r.skillLabel || Ce(r.skillId, St(a, r.skillId));
    new Dialog({
      title: Pe(r.minigameType),
      content: pi(r, o, c),
      buttons: {
        start: {
          icon: '<i class="fa-solid fa-terminal"></i>',
          label: "Accept and roll",
          callback: async () => hi(r)
        }
      },
      default: "start"
    }, {
      classes: ["holosuite-hacking-start-dialog"],
      width: 520,
      height: 320,
      resizable: !0
    }).render(!0);
  } catch (r) {
    console.error(`${N} | Failed to handle hacking launch request.`, r), (i = (n = ui.notifications) == null ? void 0 : n.error) == null || i.call(n, "HoloSuite Hacking launch failed. See console for details.");
  }
}
function ai(t) {
  var l;
  const s = String(t.requestId ?? foundry.utils.randomID()), e = oe(t.liveAudience) !== "none";
  if (!e)
    return {
      start: () => {
      },
      publish: null,
      end: null,
      cancel: () => {
      }
    };
  const n = {
    sessionId: s,
    audience: oe(t.liveAudience),
    hackerUserId: String(((l = game.user) == null ? void 0 : l.id) ?? t.userId ?? ""),
    gmUserId: String(t.gmUserId ?? ""),
    startPayload: null,
    latestState: null,
    lastSentAt: 0,
    timeoutId: null,
    started: !1
  }, i = () => {
    var u, d;
    n.timeoutId = null, !(!e || !n.started || !n.latestState) && (n.lastSentAt = Date.now(), (d = (u = game.socket) == null ? void 0 : u.emit) == null || d.call(u, G, {
      type: "live-state",
      payload: {
        sessionId: s,
        hackerUserId: n.hackerUserId,
        audience: n.audience,
        state: n.latestState
      }
    }));
  }, r = (u, { immediate: d = !1 } = {}) => {
    if (!e || !u || (n.latestState = u, !n.started)) return;
    const h = ti - (Date.now() - n.lastSentAt);
    d || h <= 0 ? (n.timeoutId && window.clearTimeout(n.timeoutId), i()) : n.timeoutId || (n.timeoutId = window.setTimeout(i, h));
  };
  return { start: (u) => {
    var d, h;
    !e || !u || (n.started = !0, n.startPayload = {
      sessionId: s,
      audience: n.audience,
      hackerUserId: n.hackerUserId,
      gmUserId: n.gmUserId,
      minigameType: String(u.type ?? t.minigameType),
      options: u.options ?? {},
      state: u.state ?? null
    }, n.latestState = u.state ?? n.latestState, ve.set(s, n), (h = (d = game.socket) == null ? void 0 : d.emit) == null || h.call(d, G, { type: "live-start", payload: n.startPayload }), n.latestState && r(n.latestState, { immediate: !0 }));
  }, publish: r, end: (u = null) => {
    var d, h;
    n.timeoutId && window.clearTimeout(n.timeoutId), u && (n.latestState = u), ve.delete(s), !(!e || !n.started) && ((h = (d = game.socket) == null ? void 0 : d.emit) == null || h.call(d, G, {
      type: "live-end",
      payload: {
        sessionId: s,
        hackerUserId: n.hackerUserId,
        audience: n.audience,
        state: n.latestState
      }
    }), n.started = !1);
  }, cancel: () => {
    n.timeoutId && window.clearTimeout(n.timeoutId), ve.delete(s), n.started = !1;
  } };
}
function oi(t) {
  var r, a, o, c, l, u, d, h, f;
  const s = (t == null ? void 0 : t.payload) ?? {};
  if (t.type === "live-sync-request") {
    const g = String(s.observerUserId ?? "");
    if (!g || g === ((r = game.user) == null ? void 0 : r.id)) return;
    for (const S of ve.values())
      !S.started || !S.startPayload || (o = (a = game.socket) == null ? void 0 : a.emit) == null || o.call(a, G, {
        type: "live-start",
        payload: { ...S.startPayload, state: S.latestState, observerUserId: g }
      });
    return;
  }
  const e = String(s.observerUserId ?? "");
  if (e && e !== ((c = game.user) == null ? void 0 : c.id) || !ci(s)) return;
  const n = String(s.sessionId ?? "");
  if (!n) return;
  if (t.type === "live-start") {
    di(s);
    return;
  }
  const i = _.get(n);
  i && (s.state && ((l = i.applyLiveState) == null || l.call(i, s.state)), t.type === "live-end" && (_.delete(n), (u = i.markLiveSessionEnded) == null || u.call(i), (h = (d = s.state) == null ? void 0 : d.state) != null && h.result || (f = i.close) == null || f.call(i)));
}
function ci(t) {
  if (!game.user || String(t.hackerUserId ?? "") === game.user.id || !game.settings.get(N, "watchOtherHacks")) return !1;
  const s = oe(t.audience);
  return s === "none" ? !1 : s === "gm" ? !!game.user.isGM : !0;
}
function li() {
  var s;
  const t = [..._.values()];
  _.clear();
  for (const e of t) (s = e.close) == null || s.call(e);
}
function di(t) {
  var o, c, l;
  const s = String(t.sessionId ?? "");
  if (_.has(s)) {
    t.state && ((c = (o = _.get(s)) == null ? void 0 : o.applyLiveState) == null || c.call(o, t.state));
    return;
  }
  const e = t.options ?? {}, n = String(t.minigameType ?? e.type ?? "node-intrusion"), i = s.replace(/[^A-Za-z0-9_-]/g, ""), r = D.startHack({
    ...e,
    id: `holosuite-${n}-spectator-${i}`,
    type: n,
    liveSessionId: s,
    readOnly: !0,
    chatOnResult: !1,
    onSuccess: null,
    onFailure: null
  });
  if (!r) return;
  const a = r.close.bind(r);
  r.close = async (...u) => (_.delete(s), a(...u)), _.set(s, r), t.state && ((l = r.applyLiveState) == null || l.call(r, t.state));
}
function $t() {
  var t, s, e;
  (t = game.user) != null && t.id && ((e = (s = game.socket) == null ? void 0 : s.emit) == null || e.call(s, G, {
    type: "live-sync-request",
    payload: { observerUserId: game.user.id }
  }));
}
async function hi(t) {
  var a;
  const s = qe(t.actorId, xe(t.userId) ?? game.user), e = await fi(t);
  if (!Number.isFinite(e == null ? void 0 : e.total)) return null;
  const n = ai(t), i = {
    rollTotal: e.total,
    naturalRoll: e.naturalRoll,
    dc: t.dc,
    actorId: t.actorId,
    actorName: (s == null ? void 0 : s.name) ?? t.actorName ?? "Hacker",
    userId: t.userId,
    skillId: t.skillId,
    liveSessionId: t.requestId,
    onLiveState: n.publish,
    onLiveEnd: n.end,
    onSuccess: (o) => gt(t, o),
    onFailure: (o) => gt(t, o)
  }, r = D.startHack({ ...i, type: t.minigameType });
  return r ? (n.start((a = r.getLiveSessionData) == null ? void 0 : a.call(r)), r) : (n.cancel(), null);
}
async function fi(t) {
  var s, e;
  try {
    const n = Number(t.skillModifier ?? 0), i = `1d20 ${n >= 0 ? "+" : "-"} ${Math.abs(n)}`, r = await new Roll(i).evaluate({ async: !0 });
    return await r.toMessage({
      speaker: ChatMessage.getSpeaker(),
      flavor: `${E(Pe(t.minigameType))}: ${E(t.skillLabel || t.skillId || "Skill")} vs DC ${Number(t.dc)}`
    }), {
      total: Number(r.total),
      naturalRoll: mi(r),
      roll: r
    };
  } catch (n) {
    return console.error(`${N} | Fallback skill roll failed.`, n), (e = (s = ui.notifications) == null ? void 0 : s.warn) == null || e.call(s, "HoloSuite Hacking skill check failed."), null;
  }
}
function mi(t) {
  var r, a, o, c, l;
  const e = ((t == null ? void 0 : t.dice) ?? ((a = (r = t == null ? void 0 : t.terms) == null ? void 0 : r.filter) == null ? void 0 : a.call(r, (u) => (u == null ? void 0 : u.faces) === 20)) ?? []).find((u) => Number(u == null ? void 0 : u.faces) === 20), n = (l = (c = (o = e == null ? void 0 : e.results) == null ? void 0 : o.find) == null ? void 0 : c.call(o, (u) => !u.discarded && !u.rerolled)) == null ? void 0 : l.result, i = Number(n);
  return Number.isFinite(i) ? i : null;
}
function gt(t, s) {
  var e, n;
  (n = (e = game.socket) == null ? void 0 : e.emit) == null || n.call(e, G, {
    type: "result-report",
    payload: {
      requestId: t.requestId,
      gmUserId: t.gmUserId,
      result: s
    }
  });
}
function gi(t = {}) {
  var n, i, r;
  if (!((n = game.user) != null && n.isGM) || t.gmUserId !== game.user.id) return;
  const s = Ie.get(t.requestId);
  Ie.delete(t.requestId), s != null && s.timeoutId && window.clearTimeout(s.timeoutId);
  const e = t.result ?? {};
  e.result === "success" ? (i = s == null ? void 0 : s.onSuccess) == null || i.call(s, e) : (r = s == null ? void 0 : s.onFailure) == null || r.call(s, e);
}
function pi(t, s, e) {
  return `
    <section class="holosuite-hacking-start-prompt">
      <p>Incoming hacking challenge</p>
      <h2>${E(Pe(t.minigameType))}</h2>
      <div>${E(s)} rolls ${E(e)} vs DC ${Number(t.dc)}</div>
    </section>
  `;
}
function xt(t = {}) {
  const s = Number(game.settings.get(N, "defaultDc") ?? 15), e = oe(game.settings.get(N, "defaultLiveAudience"));
  return {
    requestId: String(t.requestId ?? foundry.utils.randomID()),
    minigameType: String(t.minigameType ?? t.type ?? "node-intrusion"),
    userId: String(t.userId ?? ""),
    actorId: String(t.actorId ?? ""),
    actorName: String(t.actorName ?? ""),
    skillId: String(t.skillId ?? ""),
    skillLabel: String(t.skillLabel ?? ""),
    skillModifier: Number(t.skillModifier ?? 0),
    dc: Number(t.dc ?? s),
    gmUserId: String(t.gmUserId ?? ""),
    liveAudience: oe(t.liveAudience ?? e)
  };
}
function oe(t) {
  const s = String(t ?? "everyone");
  return ["none", "gm", "everyone"].includes(s) ? s : "everyone";
}
function qe(t, s) {
  const e = X(t);
  if (e) return e;
  const n = se(s);
  if (n) return n;
  const i = Ee(s);
  if (i.length === 1) return i[0];
  const r = zt();
  return r && re(r, s) ? r : null;
}
function Pe(t) {
  var s, e;
  return ((e = (s = D == null ? void 0 : D.getMinigames) == null ? void 0 : s.call(D).find((n) => n.id === t)) == null ? void 0 : e.title) ?? String(t ?? "Hacking");
}
function Re() {
  var s, e;
  const t = ((s = game.modules.get("holosuite-core")) == null ? void 0 : s.api) ?? game.holosuite;
  return typeof (t == null ? void 0 : t.registerApp) != "function" ? !1 : ((e = t.unregisterApp) == null || e.call(t, "node-intrusion"), t.registerApp({
    id: N,
    title: "HoloSuite Hacking",
    icon: "fa-solid fa-terminal",
    premium: !1,
    featureId: N,
    playerVisible: !1,
    description: "Reusable hacking minigames for terminals, traces, and signal puzzles.",
    open: () => Rt()
  }), !0);
}
Hooks.once("init", () => {
  ni(), ii(), Dt();
});
Hooks.once("ready", () => {
  var t, s;
  Dt(), (s = (t = game.socket) == null ? void 0 : t.on) == null || s.call(t, G, ri), window.setTimeout($t, 250), Re(), window.setTimeout(() => Re(), 500), console.log(`${N} | Ready. API available at game.modules.get("${N}").api`);
});
