var $e = Object.defineProperty;
var De = (e, r, t) => r in e ? $e(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t;
var g = (e, r, t) => De(e, typeof r != "symbol" ? r + "" : r, t);
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
function G(e) {
  return {
    ...e,
    ...e.nodeIntrusion,
    ...e.signalAlignment,
    ...e.packetSwitchboard,
    ...e.prismLock,
    allowMainPathFirewalls: e.nodeIntrusion.allowFirewallOnMainPath
  };
}
function W(e = 0, r = 10, t = null) {
  const n = Number(e) || 0, i = Number(r) || 10, s = Number(t);
  return s === 1 ? G(O.critical_failure) : s === 20 ? G(O.critical_success) : n <= i - 10 ? G(O.critical_failure) : n >= i + 10 ? G(O.critical_success) : n >= i + 5 ? G(O.strong_success) : n >= i ? G(O.success) : G(O.failure_but_playable);
}
const Tt = /* @__PURE__ */ new Map(), tt = /* @__PURE__ */ new Map();
function ot(e) {
  const r = String((e == null ? void 0 : e.id) ?? "").trim();
  if (!r || typeof (e == null ? void 0 : e.create) != "function")
    throw new Error("HoloSuite Hacking minigames require an id and create(options) function.");
  Tt.set(r, {
    title: String(e.title ?? r),
    icon: String(e.icon ?? "fa-solid fa-terminal"),
    ...e,
    id: r
  });
}
function xe(e) {
  return Tt.get(String(e ?? ""));
}
function Le() {
  return [...Tt.values()];
}
function Oe(e, r = {}) {
  var s, o, c, a;
  const t = xe(e);
  if (!t)
    return (o = (s = ui.notifications) == null ? void 0 : s.warn) == null || o.call(s, `Unknown HoloSuite hacking minigame: ${e}`), null;
  (a = (c = tt.get(t.id)) == null ? void 0 : c.close) == null || a.call(c);
  const n = t.create(r), i = n.close.bind(n);
  return n.close = async (...l) => (tt.delete(t.id), i(...l)), tt.set(t.id, n), n.render(!0), n;
}
function He(e) {
  return e ? tt.get(String(e)) ?? null : [...tt.values()].at(-1) ?? null;
}
function ft(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function fe(e, r) {
  if (!ft(r)) return e;
  const t = { ...e };
  for (const [n, i] of Object.entries(r))
    t[n] = ft(i) && ft(t[n]) ? fe(t[n], i) : i;
  return t;
}
function Fe(e) {
  var r;
  return {
    ...e,
    ...e.nodeIntrusion ?? {},
    ...e.signalAlignment ?? {},
    ...e.packetSwitchboard ?? {},
    ...e.prismLock ?? {},
    allowMainPathFirewalls: ((r = e.nodeIntrusion) == null ? void 0 : r.allowFirewallOnMainPath) ?? e.allowMainPathFirewalls
  };
}
function Ee(e) {
  var t, n;
  const r = String(game.settings.get(e, "difficultyProfileOverrides") ?? "").trim();
  if (!r) return {};
  try {
    const i = JSON.parse(r);
    return ft(i) ? i : {};
  } catch (i) {
    return console.warn(`${e} | Difficulty profile overrides must be valid JSON.`, i), (n = (t = ui.notifications) == null ? void 0 : t.warn) == null || n.call(t, "HoloSuite Hacking difficulty profile overrides contain invalid JSON."), {};
  }
}
function _e({ moduleId: e, openLauncher: r }) {
  function t(c) {
    const a = String(c.profileId ?? c.id ?? ""), u = Ee(e)[a], d = Fe(fe(c, u)), h = Number(game.settings.get(e, "nodeTakeoverDurationSeconds") ?? 0);
    return Number.isFinite(h) && h > 0 ? {
      ...d,
      nodeIntrusion: {
        ...d.nodeIntrusion ?? {},
        claimDurationSeconds: h
      },
      claimDurationSeconds: h
    } : d;
  }
  function n(c) {
    const a = String(game.settings.get(e, "visualGlitchIntensity") ?? "medium"), l = Number(c.visualGlitchIntensity ?? 0.4), u = a === "low" ? Math.min(l, 0.25) : a === "high" ? Math.min(1, l + 0.2) : l;
    return { ...c, visualGlitchIntensity: u };
  }
  function i(c = {}) {
    const a = Number(game.settings.get(e, "defaultDc") ?? 15), l = Number(c.dc ?? a), u = Number(c.rollTotal ?? l), d = c.naturalRoll === null || c.naturalRoll === void 0 ? null : Number(c.naturalRoll), h = n(t(c.profile ?? W(u, l, d)));
    return { ...c, dc: l, rollTotal: u, profile: h };
  }
  function s(c = {}) {
    const a = String(c.type ?? "node-intrusion");
    return Oe(a, i(c));
  }
  const o = {
    startHack: s,
    startNodeIntrusion: (c = {}) => s({ ...c, type: "node-intrusion" }),
    startSignalAlignment: (c = {}) => s({ ...c, type: "signal-alignment" }),
    startPacketSwitchboard: (c = {}) => s({ ...c, type: "packet-switchboard" }),
    startPrismLock: (c = {}) => s({ ...c, type: "prism-lock" }),
    openLauncher: r,
    getDifficultyProfile: (c = 0, a = 10, l = null) => n(t(W(c, a, l))),
    difficultyProfiles: O,
    getMinigames: Le,
    getActiveApp: He,
    testNodeIntrusion: () => o.startNodeIntrusion({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }),
    testSignalAlignment: () => o.startSignalAlignment({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }),
    testPacketSwitchboard: () => o.startPacketSwitchboard({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }),
    testPrismLock: () => o.startPrismLock({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    })
  };
  return o;
}
function H(e) {
  const r = document.createElement("div");
  return r.textContent = String(e ?? ""), r.innerHTML;
}
function It() {
  return At().filter((r) => !r.isGM);
}
function At() {
  var e;
  return Array.isArray(game.users) ? game.users : ((e = game.users) == null ? void 0 : e.contents) ?? [...game.users ?? []];
}
function Rt(e) {
  var t, n;
  const r = String(e ?? "");
  return ((n = (t = game.users) == null ? void 0 : t.get) == null ? void 0 : n.call(t, r)) ?? At().find((i) => i.id === r) ?? null;
}
function $t() {
  var e;
  return Array.isArray(game.actors) ? game.actors : ((e = game.actors) == null ? void 0 : e.contents) ?? [...game.actors ?? []];
}
function K(e) {
  var t, n;
  const r = String(e ?? "");
  return ((n = (t = game.actors) == null ? void 0 : t.get) == null ? void 0 : n.call(t, r)) ?? $t().find((i) => i.id === r || i.uuid === r) ?? null;
}
function nt(e) {
  const r = e == null ? void 0 : e.character;
  return r ? typeof r == "string" ? K(r) : r : null;
}
function it(e, r) {
  var i, s, o, c;
  if (!e || !r) return !1;
  if (e === nt(r) || (i = e.testUserPermission) != null && i.call(e, r, "OWNER")) return !0;
  const t = ((o = (s = globalThis.CONST) == null ? void 0 : s.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : o.OWNER) ?? 3, n = e.ownership ?? ((c = e.data) == null ? void 0 : c.permission) ?? {};
  return Number(n[r.id] ?? n.default ?? 0) >= t;
}
function qe() {
  var e, r, t;
  return ((t = (r = (e = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : e.controlled) == null ? void 0 : r[0]) == null ? void 0 : t.actor) ?? null;
}
function Dt(e) {
  const r = nt(e) ? [nt(e)] : [], t = $t().filter((i) => it(i, e));
  return [...new Map([...r, ...t].filter(Boolean).map((i) => [i.id, i])).values()].sort((i, s) => i.name.localeCompare(s.name));
}
function ee(e = "") {
  const r = It(), t = r.find((i) => i.id === e);
  return (t ? Dt(t) : $t()).filter((i) => !t || it(i, t)).map((i) => ({
    id: i.id,
    name: i.name,
    owners: r.filter((s) => it(i, s))
  })).sort((i, s) => i.name.localeCompare(s.name));
}
const Ge = {
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
function ne(e) {
  var t;
  const r = (t = e == null ? void 0 : e.system) == null ? void 0 : t.skills;
  if (r && typeof r == "object") {
    const n = Object.entries(r).map(([i, s]) => ({
      id: i,
      name: bt(i, s),
      label: je(i, s),
      modifier: xt(s)
    }));
    if (n.length) return n.sort((i, s) => i.label.localeCompare(s.label));
  }
  return [
    { id: "hacking", name: "Hacking", label: "Hacking (+0)", modifier: 0 },
    { id: "computers", name: "Computers", label: "Computers (+0)", modifier: 0 },
    { id: "technology", name: "Technology", label: "Technology (+0)", modifier: 0 },
    { id: "intelligence", name: "Intelligence", label: "Intelligence (+0)", modifier: 0 }
  ];
}
function me(e, r) {
  var t, n;
  return ((n = (t = e == null ? void 0 : e.system) == null ? void 0 : t.skills) == null ? void 0 : n[r]) ?? null;
}
function bt(e, r) {
  const t = String((r == null ? void 0 : r.label) ?? (r == null ? void 0 : r.name) ?? (r == null ? void 0 : r.localizedName) ?? e ?? "Skill").trim(), n = t.toLowerCase().replace(/[^a-z0-9]/g, "");
  return String(Ge[n] ?? t).replace(/[_-]/g, " ").replace(/\b\w/g, (i) => i.toUpperCase());
}
function xt(e) {
  var i, s, o, c, a, l, u, d, h, f;
  if (typeof e == "number") return e;
  if (!e || typeof e != "object") return 0;
  const t = [
    e == null ? void 0 : e.mod,
    (i = e == null ? void 0 : e.mod) == null ? void 0 : i.value,
    e == null ? void 0 : e.modifier,
    (s = e == null ? void 0 : e.modifier) == null ? void 0 : s.value,
    e == null ? void 0 : e.total,
    (o = e == null ? void 0 : e.total) == null ? void 0 : o.value,
    e == null ? void 0 : e.value,
    (c = e == null ? void 0 : e.value) == null ? void 0 : c.value,
    e == null ? void 0 : e.bonus,
    (a = e == null ? void 0 : e.bonus) == null ? void 0 : a.value,
    e == null ? void 0 : e.check,
    (l = e == null ? void 0 : e.check) == null ? void 0 : l.mod,
    (u = e == null ? void 0 : e.check) == null ? void 0 : u.total,
    e == null ? void 0 : e.roll,
    (d = e == null ? void 0 : e.roll) == null ? void 0 : d.mod,
    (h = e == null ? void 0 : e.roll) == null ? void 0 : h.total,
    e == null ? void 0 : e.rank,
    e == null ? void 0 : e.ranks
  ].find((m) => Number.isFinite(Number(m)));
  if (t !== void 0) return Number(t);
  const n = [];
  return ge(e, n, 0), n.sort((m, w) => w.score - m.score), Number(((f = n[0]) == null ? void 0 : f.value) ?? 0);
}
function je(e, r) {
  const t = bt(e, r), n = xt(r), i = n >= 0 ? "+" : "-";
  return `${t} (${i}${Math.abs(n)})`;
}
function ge(e, r, t, n = "") {
  if (!(!e || typeof e != "object" || t > 4))
    for (const [i, s] of Object.entries(e)) {
      const o = n ? `${n}.${i}` : i, c = Number(s);
      if (Number.isFinite(c)) {
        const a = o.toLowerCase();
        let l = 1;
        /(total|mod|modifier|bonus|check|roll|value)$/.test(a) && (l += 6), /(dc|rank|ranks|proficient|prof|trained|ability|base|label|name)/.test(a) && (l -= 4), Math.abs(c) > 30 && (l -= 5), r.push({ value: c, score: l, path: o });
      } else s && typeof s == "object" && ge(s, r, t + 1, o);
    }
}
function pe() {
  var e, r, t;
  return ((r = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : r.api) ?? ((t = foundry == null ? void 0 : foundry.applications) == null ? void 0 : t.api) ?? null;
}
function Se() {
  var e, r, t;
  return ((r = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : r.api) ?? ((t = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : t.api) ?? null;
}
function Ue(e = {}, r = {}) {
  var n, i, s;
  const t = ((i = (n = globalThis.foundry) == null ? void 0 : n.utils) == null ? void 0 : i.mergeObject) ?? ((s = foundry == null ? void 0 : foundry.utils) == null ? void 0 : s.mergeObject);
  return typeof t == "function" ? t(e, r, { inplace: !1 }) : { ...e, ...r };
}
function ze() {
  var e, r, t, n, i;
  return ((t = (r = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : r.randomID) == null ? void 0 : t.call(r, 8)) ?? ((i = (n = foundry == null ? void 0 : foundry.utils) == null ? void 0 : n.randomID) == null ? void 0 : i.call(n, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function ie(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${ze()}`),
    tag: e.tag ?? "section",
    classes: Array.isArray(e.classes) ? e.classes : [],
    window: {
      title: e.title ?? "",
      icon: e.icon,
      resizable: e.resizable === !0
    },
    position: {
      width: Number(e.width ?? 600),
      height: e.height === "auto" ? "auto" : Number(e.height ?? 600)
    }
  };
}
function ye(e) {
  return class extends e {
    constructor(n = {}) {
      const i = Ue(new.target.defaultOptions ?? {}, n);
      super(ie(i));
      g(this, "_v1Options");
      this._v1Options = i;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return ie(this.defaultOptions ?? {});
    }
    activateListeners(n) {
    }
    async _renderHTML(n, i) {
      var l, u, d;
      const s = typeof this.getData == "function" ? await this.getData() : {}, o = ((l = this._v1Options) == null ? void 0 : l.template) ?? ((u = this.options) == null ? void 0 : u.template) ?? ((d = this.constructor.defaultOptions) == null ? void 0 : d.template);
      if (!o) return document.createDocumentFragment();
      const c = await globalThis.renderTemplate(o, s), a = document.createElement("template");
      return a.innerHTML = c.trim(), a.content;
    }
    _activateV1Form(n) {
      var s, o;
      if (typeof this._updateObject != "function") return;
      const i = (s = n.matches) != null && s.call(n, "form") ? n : (o = n.querySelector) == null ? void 0 : o.call(n, "form");
      i instanceof HTMLFormElement && i.addEventListener("submit", async (c) => {
        var l;
        c.preventDefault(), c.stopPropagation();
        const a = new FormData(i);
        await this._updateObject(c, a), ((l = this._v1Options) == null ? void 0 : l.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(n, i, s) {
      var u, d, h, f;
      i.replaceChildren(n);
      const o = globalThis.jQuery ?? globalThis.$, c = ((u = i.closest) == null ? void 0 : u.call(i, ".window-app, .app, .application")) ?? i, a = o ? o(c) : c;
      try {
        Object.defineProperty(this, "element", {
          value: a,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = a;
        } catch {
        }
      }
      const l = (d = this._v1Options) == null ? void 0 : d.classes;
      Array.isArray(l) && l.length && (i.classList.add(...l), (f = (h = i.closest) == null ? void 0 : h.call(i, ".window-app, .app, .application")) == null || f.classList.add(...l)), this._activateV1Form(i), typeof this.activateListeners == "function" && this.activateListeners(o ? o(i) : i);
    }
  };
}
function Y() {
  const e = pe(), r = Se(), t = globalThis.Application ?? (r == null ? void 0 : r.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (r == null ? void 0 : r.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (t) return t;
  const n = e == null ? void 0 : e.ApplicationV2;
  return n ? ye(n) : null;
}
function Be() {
  const e = pe(), r = Se(), t = globalThis.FormApplication ?? (r == null ? void 0 : r.FormApplication) ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (r == null ? void 0 : r.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (t) return t;
  const n = e == null ? void 0 : e.ApplicationV2;
  return n ? ye(n) : Y();
}
const et = "holosuite-hacking", Ve = `modules/${et}/templates/hacking-launcher.html`, Je = Y();
function Ke(e) {
  var i, s, o;
  const r = `modules/${et}/${e.replace(/^\/+/, "")}`, t = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.getRoute;
  return typeof t == "function" ? t(r) : `${String(globalThis.ROUTE_PREFIX ?? ((o = (s = game == null ? void 0 : game.data) == null ? void 0 : s.options) == null ? void 0 : o.routePrefix) ?? "").replace(/^\/?/, "/").replace(/\/$/, "")}/${r}`;
}
class Xe extends Je {
  constructor(t = {}) {
    super(t);
    g(this, "api");
    this.api = t.api;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-hacking-launcher",
      title: "HoloSuite Hacking",
      classes: ["holosuite-hacking-launcher-window"],
      popOut: !0,
      resizable: !0,
      width: 560,
      height: 620,
      template: Ve
    });
  }
  getData() {
    const t = Number(game.settings.get(et, "defaultDc") ?? 15), n = It(), i = n[0] ?? null, s = ee(i == null ? void 0 : i.id), o = s.length ? K(s[0].id) : null;
    return {
      frameAssetBase: Ke("assets/frame"),
      defaultDc: t,
      defaultTestRoll: t,
      minigames: this.api.getMinigames(),
      actors: s.map((c) => ({
        id: c.id,
        name: c.name,
        ownerNames: c.owners.map((a) => a.name).join(", ") || "No active owner"
      })),
      users: n.map((c) => ({
        id: c.id,
        name: c.name
      })),
      skills: ne(o)
    };
  }
  activateListeners(t) {
    super.activateListeners(t);
    const n = t.is("form") ? t[0] : t.find("form")[0];
    t.find("[data-action='start']").on("click", (s) => {
      s.preventDefault(), this.submit(n);
    }), t.find("[data-action='test-self']").on("click", (s) => {
      s.preventDefault(), this.testSelf(n);
    }), (t.is("form") ? t : t.find("form")).on("submit", (s) => {
      s.preventDefault(), this.submit(s.currentTarget);
    }), t.find("[name='actorId']").on("change", (s) => {
      this.syncUserToActor(t, s.currentTarget.value), this.syncSkillOptions(t, s.currentTarget.value);
    }), t.find("[name='userId']").on("change", (s) => {
      this.syncActorsForUser(t, s.currentTarget.value);
    }), this.syncSkillOptions(t, t.find("[name='actorId']").val());
  }
  submit(t) {
    var I, b, C, k, A, p;
    if (!((I = game.user) != null && I.isGM)) {
      (C = (b = ui.notifications) == null ? void 0 : b.warn) == null || C.call(b, "Only the GM can open the HoloSuite Hacking launcher.");
      return;
    }
    if (!t) {
      (A = (k = ui.notifications) == null ? void 0 : k.error) == null || A.call(k, "HoloSuite Hacking launcher form was not found."), console.error(`${et} | Launcher form was not found.`);
      return;
    }
    const n = t.querySelector("[name='minigameType']"), i = t.querySelector("[name='actorId']"), s = t.querySelector("[name='userId']"), o = t.querySelector("[name='skillId']"), c = t.querySelector("[name='dc']"), a = ((p = o == null ? void 0 : o.selectedOptions) == null ? void 0 : p[0]) ?? null, l = String((n == null ? void 0 : n.value) || "node-intrusion"), u = String((i == null ? void 0 : i.value) || ""), d = String((s == null ? void 0 : s.value) || ""), h = String((o == null ? void 0 : o.value) || ""), f = String((a == null ? void 0 : a.dataset.skillLabel) || (a == null ? void 0 : a.textContent) || h || "Skill"), m = Number((a == null ? void 0 : a.dataset.skillModifier) ?? 0), w = Number((c == null ? void 0 : c.value) ?? 15);
    this.api.sendHackToPlayer({
      minigameType: l,
      actorId: u,
      userId: d,
      skillId: h,
      skillLabel: f,
      skillModifier: m,
      dc: w,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }) && this.close();
  }
  testSelf(t) {
    var a, l, u, d, h, f, m, w, P, I, b, C, k;
    if (!((a = game.user) != null && a.isGM)) {
      (u = (l = ui.notifications) == null ? void 0 : l.warn) == null || u.call(l, "Only the GM can test HoloSuite Hacking minigames.");
      return;
    }
    if (!t) {
      (h = (d = ui.notifications) == null ? void 0 : d.error) == null || h.call(d, "HoloSuite Hacking launcher form was not found.");
      return;
    }
    const n = String(((f = t.querySelector("[name='minigameType']")) == null ? void 0 : f.value) || "node-intrusion"), i = String(((m = t.querySelector("[name='actorId']")) == null ? void 0 : m.value) || ""), s = Number(((w = t.querySelector("[name='dc']")) == null ? void 0 : w.value) ?? game.settings.get(et, "defaultDc") ?? 15), o = Number(((P = t.querySelector("[name='testRollTotal']")) == null ? void 0 : P.value) ?? s);
    if (!Number.isFinite(o)) {
      (b = (I = ui.notifications) == null ? void 0 : I.warn) == null || b.call(I, "Enter a fake roll result before testing the minigame.");
      return;
    }
    const c = K(i);
    this.api.startHack({
      type: n,
      dc: s,
      rollTotal: o,
      actorName: (c == null ? void 0 : c.name) ?? ((C = game.user) == null ? void 0 : C.name) ?? "GM",
      userId: ((k = game.user) == null ? void 0 : k.id) ?? "",
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }), this.close();
  }
  syncUserToActor(t, n) {
    const i = K(n), s = It().find((o) => i == null ? void 0 : i.testUserPermission(o, "OWNER"));
    s && t.find("[name='userId']").val(s.id);
  }
  syncSkillOptions(t, n) {
    const i = K(n), s = ne(i);
    t.find("[name='skillId']").html(s.map((o) => `<option value="${H(o.id)}" data-skill-label="${H(o.name ?? o.label)}" data-skill-modifier="${Number(o.modifier ?? 0)}">${H(o.label)}</option>`).join(""));
  }
  syncActorsForUser(t, n) {
    const i = ee(n), s = i.length ? i.map((o) => `<option value="${H(o.id)}">${H(o.name)} (${H(o.owners.map((c) => c.name).join(", ") || "No owner")})</option>`).join("") : '<option value="">Use assigned character</option>';
    t.find("[name='actorId']").html(s), this.syncSkillOptions(t, t.find("[name='actorId']").val());
  }
}
const rt = "holosuite-hacking", We = `modules/${rt}/templates/difficulty-profiles.html`, Ye = Be(), Ct = [
  "critical_success",
  "strong_success",
  "success",
  "failure_but_playable",
  "critical_failure"
];
function mt(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function be(e, r) {
  if (!mt(r)) return e;
  const t = { ...e };
  for (const [n, i] of Object.entries(r))
    t[n] = mt(i) && mt(t[n]) ? be(t[n], i) : i;
  return t;
}
function Qe() {
  const e = String(game.settings.get(rt, "difficultyProfileOverrides") ?? "").trim();
  if (!e) return {};
  try {
    const r = JSON.parse(e);
    return mt(r) ? r : {};
  } catch (r) {
    return console.warn(`${rt} | Difficulty profile overrides must be valid JSON.`, r), {};
  }
}
function v(e, r, t) {
  const n = Number(e.get(r));
  return Number.isFinite(n) ? n : t;
}
function S(e, r, t) {
  return Math.min(t, Math.max(r, e));
}
function gt(e, r) {
  return e.get(r) === "on";
}
function re(e) {
  if (e.type !== "number" || e.value === "") return;
  const r = Number(e.value);
  if (!Number.isFinite(r)) return;
  const t = e.min === "" ? -1 / 0 : Number(e.min), n = e.max === "" ? 1 / 0 : Number(e.max), i = S(r, t, n);
  i !== r && (e.value = String(i));
}
function pt(e, r, t, n) {
  const i = S(Math.round(e), 6, 40), s = Math.max(0, i - 4), o = S(Math.round(r), 0, s), c = Math.max(0, i - o), a = S(Math.round(c * 0.48), Math.min(6, c), c), l = a >= 5 ? 3 : 1, u = S(Math.round(t), 1, l), d = a + Math.max(0, u - 1), h = n ? Math.max(0, i - o - 2) : Math.max(0, i - o - d);
  return {
    nodeCount: i,
    maxDecoys: s,
    decoyCount: o,
    mainPathLength: a,
    maxRoutes: l,
    routeCount: u,
    protectedNodes: d,
    maxFirewalls: h
  };
}
function Ze(e, r, t) {
  const n = v(e, `${r}nodeCount`, t.nodeIntrusion.nodeCount), i = v(e, `${r}decoyCount`, t.nodeIntrusion.decoyCount), s = v(e, `${r}routeCount`, t.nodeIntrusion.routeCount ?? 2), o = gt(e, `${r}allowFirewallOnMainPath`), c = pt(n, i, s, o);
  return {
    traceDurationSeconds: S(Math.round(v(e, `${r}nodeTraceDurationSeconds`, t.nodeIntrusion.traceDurationSeconds ?? t.traceDurationSeconds ?? 60)), 5, 300),
    nodeCount: c.nodeCount,
    firewallCount: S(Math.round(v(e, `${r}firewallCount`, t.nodeIntrusion.firewallCount)), 0, c.maxFirewalls),
    decoyCount: c.decoyCount,
    routeCount: c.routeCount,
    radarEnabled: gt(e, `${r}radarEnabled`),
    claimDurationSeconds: S(v(e, `${r}claimDurationSeconds`, t.nodeIntrusion.claimDurationSeconds ?? 0.5), 0.1, 5),
    firewallClaimMultiplier: S(v(e, `${r}firewallClaimMultiplier`, t.nodeIntrusion.firewallClaimMultiplier ?? 1.75), 1, 5),
    firewallPenaltySeconds: S(Math.round(v(e, `${r}firewallPenaltySeconds`, t.nodeIntrusion.firewallPenaltySeconds ?? 6)), 0, 60),
    decoyPenaltySeconds: S(Math.round(v(e, `${r}decoyPenaltySeconds`, t.nodeIntrusion.decoyPenaltySeconds ?? 4)), 0, 60),
    showTarget: gt(e, `${r}showTarget`),
    allowFirewallOnMainPath: o
  };
}
function tn(e, r, t) {
  return {
    traceDurationSeconds: S(Math.round(v(e, `${r}signalTraceDurationSeconds`, t.signalAlignment.traceDurationSeconds ?? t.traceDurationSeconds ?? 60)), 5, 300),
    channelCount: S(Math.round(v(e, `${r}signalChannelCount`, t.signalAlignment.channelCount ?? 3)), 2, 5),
    tolerance: S(v(e, `${r}signalTolerance`, t.signalAlignment.tolerance ?? 5), 0.5, 20),
    signalDriftSpeed: S(v(e, `${r}signalDriftSpeed`, t.signalAlignment.signalDriftSpeed ?? 0), 0, 5),
    noiseLevel: S(v(e, `${r}signalNoiseLevel`, t.signalAlignment.noiseLevel ?? 0), 0, 1),
    lockHoldSeconds: S(v(e, `${r}signalLockHoldSeconds`, t.signalAlignment.lockHoldSeconds ?? 4), 0.5, 30),
    targetRevealRadius: S(v(e, `${r}signalTargetRevealRadius`, t.signalAlignment.targetRevealRadius ?? 100), 0, 100),
    destabilizationPenaltySeconds: S(v(e, `${r}signalDestabilizationPenaltySeconds`, t.signalAlignment.destabilizationPenaltySeconds ?? 0), 0, 60)
  };
}
function en(e, r, t) {
  const n = t.packetSwitchboard ?? {}, i = S(Math.round(v(e, `${r}packetLaneCount`, n.laneCount ?? 4)), 3, 6);
  return {
    traceDurationSeconds: S(Math.round(v(e, `${r}packetTraceDurationSeconds`, n.traceDurationSeconds ?? t.traceDurationSeconds ?? 60)), 5, 300),
    laneCount: i,
    columnCount: S(Math.round(v(e, `${r}packetColumnCount`, n.columnCount ?? 6)), i - 1, 8),
    deliveryGoal: S(Math.round(v(e, `${r}packetDeliveryGoal`, n.deliveryGoal ?? 7)), 3, 20),
    packetIntervalSeconds: S(v(e, `${r}packetIntervalSeconds`, n.packetIntervalSeconds ?? 2), 0.35, 10),
    packetStepSeconds: S(v(e, `${r}packetStepSeconds`, n.packetStepSeconds ?? 0.8), 0.25, 5),
    previewCount: S(Math.round(v(e, `${r}packetPreviewCount`, n.previewCount ?? 2)), 0, 6),
    misroutePenaltySeconds: S(v(e, `${r}packetMisroutePenaltySeconds`, n.misroutePenaltySeconds ?? 5), 0, 60),
    maxActivePackets: S(Math.round(v(e, `${r}packetMaxActivePackets`, n.maxActivePackets ?? 2)), 1, 6),
    entryHoldSeconds: S(v(e, `${r}packetEntryHoldSeconds`, n.entryHoldSeconds ?? 1.5), 0, 10)
  };
}
function nn(e, r, t) {
  const n = t.prismLock ?? {}, i = S(Math.round(v(e, `${r}prismRingCount`, n.ringCount ?? 3)), 2, 4), s = S(Math.round(v(e, `${r}prismSlotCount`, n.slotCount ?? 10)), 8, 16), o = S(Math.round(v(e, `${r}prismReceiverCount`, n.receiverCount ?? 4)), 2, Math.min(8, s)), c = S(Math.round(v(e, `${r}prismSwitchableRingCount`, n.switchableRingCount ?? 0)), 0, i - 1), a = Math.min(4, s - o), l = c > 0 && a > 0 ? 1 : 0;
  return {
    traceDurationSeconds: S(Math.round(v(e, `${r}prismTraceDurationSeconds`, n.traceDurationSeconds ?? t.traceDurationSeconds ?? 60)), 5, 300),
    ringCount: i,
    slotCount: s,
    receiverCount: o,
    blockersPerRing: S(Math.round(v(e, `${r}prismBlockersPerRing`, n.blockersPerRing ?? 0)), 0, 3),
    iceReceiverCount: S(Math.round(v(e, `${r}prismIceReceiverCount`, n.iceReceiverCount ?? 0)), l, a),
    switchableRingCount: c,
    scrambleSteps: S(Math.round(v(e, `${r}prismScrambleSteps`, n.scrambleSteps ?? 3)), 1, Math.floor(s / 2)),
    icePenaltySeconds: S(v(e, `${r}prismIcePenaltySeconds`, n.icePenaltySeconds ?? 5), 0, 60)
  };
}
function rn(e) {
  var n, i, s, o, c, a, l, u, d, h, f, m, w, P, I, b, C, k, A;
  const r = O[e], t = pt(
    Number(r.nodeIntrusion.nodeCount),
    Number(r.nodeIntrusion.decoyCount),
    Number(r.nodeIntrusion.routeCount ?? 2),
    !!r.nodeIntrusion.allowFirewallOnMainPath
  );
  return {
    hintsEnabled: !!r.hintsEnabled,
    visualGlitchIntensity: Number(r.visualGlitchIntensity ?? 0.4),
    nodeIntrusion: {
      traceDurationSeconds: Number(r.nodeIntrusion.traceDurationSeconds ?? r.traceDurationSeconds ?? 60),
      nodeCount: t.nodeCount,
      firewallCount: S(Number(r.nodeIntrusion.firewallCount ?? 0), 0, t.maxFirewalls),
      decoyCount: t.decoyCount,
      routeCount: t.routeCount,
      radarEnabled: !!(r.nodeIntrusion.radarEnabled ?? Number(r.nodeIntrusion.radarRange ?? 0) > 0),
      claimDurationSeconds: Number(r.nodeIntrusion.claimDurationSeconds ?? 0.5),
      firewallClaimMultiplier: Number(r.nodeIntrusion.firewallClaimMultiplier ?? 1.75),
      firewallPenaltySeconds: Number(r.nodeIntrusion.firewallPenaltySeconds ?? 6),
      decoyPenaltySeconds: Number(r.nodeIntrusion.decoyPenaltySeconds ?? 4),
      showTarget: !!r.nodeIntrusion.showTarget,
      allowFirewallOnMainPath: !!r.nodeIntrusion.allowFirewallOnMainPath
    },
    signalAlignment: {
      traceDurationSeconds: Number(r.signalAlignment.traceDurationSeconds ?? r.traceDurationSeconds ?? 60),
      channelCount: Number(r.signalAlignment.channelCount ?? 3),
      tolerance: Number(r.signalAlignment.tolerance ?? 5),
      signalDriftSpeed: Number(r.signalAlignment.signalDriftSpeed ?? 0),
      noiseLevel: Number(r.signalAlignment.noiseLevel ?? 0),
      lockHoldSeconds: Number(r.signalAlignment.lockHoldSeconds ?? 4),
      targetRevealRadius: Number(r.signalAlignment.targetRevealRadius ?? 100),
      destabilizationPenaltySeconds: Number(r.signalAlignment.destabilizationPenaltySeconds ?? 0)
    },
    packetSwitchboard: {
      traceDurationSeconds: Number(((n = r.packetSwitchboard) == null ? void 0 : n.traceDurationSeconds) ?? r.traceDurationSeconds ?? 60),
      laneCount: Number(((i = r.packetSwitchboard) == null ? void 0 : i.laneCount) ?? 4),
      columnCount: Number(((s = r.packetSwitchboard) == null ? void 0 : s.columnCount) ?? 6),
      deliveryGoal: Number(((o = r.packetSwitchboard) == null ? void 0 : o.deliveryGoal) ?? 7),
      packetIntervalSeconds: Number(((c = r.packetSwitchboard) == null ? void 0 : c.packetIntervalSeconds) ?? 2),
      packetStepSeconds: Number(((a = r.packetSwitchboard) == null ? void 0 : a.packetStepSeconds) ?? 0.8),
      previewCount: Number(((l = r.packetSwitchboard) == null ? void 0 : l.previewCount) ?? 2),
      misroutePenaltySeconds: Number(((u = r.packetSwitchboard) == null ? void 0 : u.misroutePenaltySeconds) ?? 5),
      maxActivePackets: Number(((d = r.packetSwitchboard) == null ? void 0 : d.maxActivePackets) ?? 2),
      entryHoldSeconds: Number(((h = r.packetSwitchboard) == null ? void 0 : h.entryHoldSeconds) ?? 1.5)
    },
    prismLock: {
      traceDurationSeconds: Number(((f = r.prismLock) == null ? void 0 : f.traceDurationSeconds) ?? r.traceDurationSeconds ?? 60),
      ringCount: Number(((m = r.prismLock) == null ? void 0 : m.ringCount) ?? 3),
      slotCount: Number(((w = r.prismLock) == null ? void 0 : w.slotCount) ?? 10),
      receiverCount: Number(((P = r.prismLock) == null ? void 0 : P.receiverCount) ?? 4),
      blockersPerRing: Number(((I = r.prismLock) == null ? void 0 : I.blockersPerRing) ?? 0),
      iceReceiverCount: Number(((b = r.prismLock) == null ? void 0 : b.iceReceiverCount) ?? 0),
      switchableRingCount: Number(((C = r.prismLock) == null ? void 0 : C.switchableRingCount) ?? 0),
      scrambleSteps: Number(((k = r.prismLock) == null ? void 0 : k.scrambleSteps) ?? 3),
      icePenaltySeconds: Number(((A = r.prismLock) == null ? void 0 : A.icePenaltySeconds) ?? 5)
    }
  };
}
class sn extends Ye {
  constructor() {
    super(...arguments);
    g(this, "activeProfileTab", "general");
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-hacking-difficulty-profiles",
      title: "HoloSuite Hacking Difficulty Profiles",
      classes: ["holosuite-hacking-window", "holosuite-hacking-profile-window"],
      template: We,
      width: 820,
      height: 780,
      resizable: !0,
      closeOnSubmit: !0,
      submitOnChange: !1,
      submitOnClose: !1
    });
  }
  getData() {
    const t = Qe();
    return {
      profiles: Ct.map((i) => {
        var h, f, m, w, P, I, b, C, k, A, p, y, M, R, N, D, q, B, V, $, F, st, Ft, Et, _t, qt, Gt, jt, Ut, zt, Bt, Vt, Jt, Kt, Xt, Wt, Yt, Qt, Zt, te;
        const s = O[i], o = be(s, t[i]), c = Number(((h = o.nodeIntrusion) == null ? void 0 : h.nodeCount) ?? 12), a = Number(((f = o.nodeIntrusion) == null ? void 0 : f.decoyCount) ?? 0), l = Number(((m = o.nodeIntrusion) == null ? void 0 : m.routeCount) ?? 2), u = !!((w = o.nodeIntrusion) != null && w.allowFirewallOnMainPath), d = pt(c, a, l, u);
        return {
          id: i,
          label: o.label,
          hintsEnabled: !!o.hintsEnabled,
          visualGlitchIntensity: Number(o.visualGlitchIntensity ?? 0.4),
          nodeIntrusion: {
            traceDurationSeconds: Number(((P = o.nodeIntrusion) == null ? void 0 : P.traceDurationSeconds) ?? o.traceDurationSeconds ?? 60),
            nodeCount: d.nodeCount,
            firewallCount: S(Number(((I = o.nodeIntrusion) == null ? void 0 : I.firewallCount) ?? 0), 0, d.maxFirewalls),
            decoyCount: d.decoyCount,
            routeCount: d.routeCount,
            radarEnabled: !!(((b = o.nodeIntrusion) == null ? void 0 : b.radarEnabled) ?? Number(((C = o.nodeIntrusion) == null ? void 0 : C.radarRange) ?? 0) > 0),
            claimDurationSeconds: Number(((k = o.nodeIntrusion) == null ? void 0 : k.claimDurationSeconds) ?? 0.5),
            firewallClaimMultiplier: Number(((A = o.nodeIntrusion) == null ? void 0 : A.firewallClaimMultiplier) ?? 1.75),
            firewallPenaltySeconds: Number(((p = o.nodeIntrusion) == null ? void 0 : p.firewallPenaltySeconds) ?? 6),
            decoyPenaltySeconds: Number(((y = o.nodeIntrusion) == null ? void 0 : y.decoyPenaltySeconds) ?? 4),
            showTarget: !!((M = o.nodeIntrusion) != null && M.showTarget),
            allowFirewallOnMainPath: u
          },
          signalAlignment: {
            traceDurationSeconds: Number(((R = o.signalAlignment) == null ? void 0 : R.traceDurationSeconds) ?? o.traceDurationSeconds ?? 60),
            channelCount: Number(((N = o.signalAlignment) == null ? void 0 : N.channelCount) ?? 3),
            tolerance: Number(((D = o.signalAlignment) == null ? void 0 : D.tolerance) ?? 5),
            signalDriftSpeed: Number(((q = o.signalAlignment) == null ? void 0 : q.signalDriftSpeed) ?? 0),
            noiseLevel: Number(((B = o.signalAlignment) == null ? void 0 : B.noiseLevel) ?? 0),
            lockHoldSeconds: Number(((V = o.signalAlignment) == null ? void 0 : V.lockHoldSeconds) ?? 4),
            targetRevealRadius: Number((($ = o.signalAlignment) == null ? void 0 : $.targetRevealRadius) ?? 100),
            destabilizationPenaltySeconds: Number(((F = o.signalAlignment) == null ? void 0 : F.destabilizationPenaltySeconds) ?? 0)
          },
          packetSwitchboard: {
            traceDurationSeconds: Number(((st = o.packetSwitchboard) == null ? void 0 : st.traceDurationSeconds) ?? o.traceDurationSeconds ?? 60),
            laneCount: Number(((Ft = o.packetSwitchboard) == null ? void 0 : Ft.laneCount) ?? 4),
            columnCount: Number(((Et = o.packetSwitchboard) == null ? void 0 : Et.columnCount) ?? 6),
            deliveryGoal: Number(((_t = o.packetSwitchboard) == null ? void 0 : _t.deliveryGoal) ?? 7),
            packetIntervalSeconds: Number(((qt = o.packetSwitchboard) == null ? void 0 : qt.packetIntervalSeconds) ?? 2),
            packetStepSeconds: Number(((Gt = o.packetSwitchboard) == null ? void 0 : Gt.packetStepSeconds) ?? 0.8),
            previewCount: Number(((jt = o.packetSwitchboard) == null ? void 0 : jt.previewCount) ?? 2),
            misroutePenaltySeconds: Number(((Ut = o.packetSwitchboard) == null ? void 0 : Ut.misroutePenaltySeconds) ?? 5),
            maxActivePackets: Number(((zt = o.packetSwitchboard) == null ? void 0 : zt.maxActivePackets) ?? 2),
            entryHoldSeconds: Number(((Bt = o.packetSwitchboard) == null ? void 0 : Bt.entryHoldSeconds) ?? 1.5)
          },
          prismLock: {
            traceDurationSeconds: Number(((Vt = o.prismLock) == null ? void 0 : Vt.traceDurationSeconds) ?? o.traceDurationSeconds ?? 60),
            ringCount: Number(((Jt = o.prismLock) == null ? void 0 : Jt.ringCount) ?? 3),
            slotCount: Number(((Kt = o.prismLock) == null ? void 0 : Kt.slotCount) ?? 10),
            receiverCount: Number(((Xt = o.prismLock) == null ? void 0 : Xt.receiverCount) ?? 4),
            blockersPerRing: Number(((Wt = o.prismLock) == null ? void 0 : Wt.blockersPerRing) ?? 0),
            iceReceiverCount: Number(((Yt = o.prismLock) == null ? void 0 : Yt.iceReceiverCount) ?? 0),
            switchableRingCount: Number(((Qt = o.prismLock) == null ? void 0 : Qt.switchableRingCount) ?? 0),
            scrambleSteps: Number(((Zt = o.prismLock) == null ? void 0 : Zt.scrambleSteps) ?? 3),
            icePenaltySeconds: Number(((te = o.prismLock) == null ? void 0 : te.icePenaltySeconds) ?? 5)
          },
          constraints: d
        };
      }),
      hasOverrides: Object.keys(t).length > 0
    };
  }
  activateListeners(t) {
    super.activateListeners(t), this.setProfileTab(t, this.activeProfileTab, !1), this.syncConstraints(t), t.find("[data-profile-tab]").on("click", (n) => {
      n.preventDefault();
      const i = n.currentTarget, s = (i == null ? void 0 : i.dataset.profileTab) ?? "general";
      this.setProfileTab((i == null ? void 0 : i.closest(".holosuite-profile-config")) ?? t, s, !0);
    }), t.find("[data-action='toggle-profile']").on("click", (n) => {
      n.preventDefault();
      const i = n.currentTarget, s = i == null ? void 0 : i.closest("[data-profile-section]");
      if (!i || !s) return;
      const o = !s.classList.contains("is-open");
      s.classList.toggle("is-open", o), i.setAttribute("aria-expanded", String(o));
    }), t.find("input[type='number']").on("change", (n) => {
      re(n.currentTarget);
    }), t.find("[data-profile-section] input").on("input change", (n) => {
      var s;
      const i = (s = n.currentTarget) == null ? void 0 : s.closest("[data-profile-section]");
      i && this.syncProfileConstraints(i);
    }), t.find("[data-action='reset-profile']").on("click", (n) => {
      var s;
      n.preventDefault(), n.stopPropagation();
      const i = (s = n.currentTarget) == null ? void 0 : s.closest("[data-profile-section]");
      i && this.resetProfileSection(i);
    }), t.find("[data-action='reset-profiles']").on("click", async (n) => {
      var i, s;
      n.preventDefault(), await game.settings.set(rt, "difficultyProfileOverrides", ""), (s = (i = ui.notifications) == null ? void 0 : i.info) == null || s.call(i, "HoloSuite Hacking difficulty profiles reset to defaults."), this.render(!1);
    });
  }
  setProfileTab(t, n, i) {
    var u, d;
    const s = t instanceof HTMLElement ? t : t == null ? void 0 : t[0], o = (u = s == null ? void 0 : s.matches) != null && u.call(s, ".holosuite-profile-config") ? s : ((d = s == null ? void 0 : s.querySelector) == null ? void 0 : d.call(s, ".holosuite-profile-config")) ?? this.form;
    if (!o) return;
    const c = Array.from(o.querySelectorAll("[data-profile-tab]")), a = c.some((h) => h.dataset.profileTab === n) ? n : "general", l = a !== this.activeProfileTab;
    this.activeProfileTab = a, o.dataset.activeProfileTab = a, c.forEach((h) => {
      const f = h.dataset.profileTab === a;
      h.classList.toggle("is-active", f), h.setAttribute("aria-selected", String(f)), h.tabIndex = f ? 0 : -1;
    }), o.querySelectorAll("[data-profile-panel]").forEach((h) => {
      const f = h.dataset.profilePanel === a;
      h.classList.toggle("is-active", f);
    }), i && l && o.querySelectorAll("[data-profile-section]").forEach((h) => {
      var f;
      h.classList.remove("is-open"), (f = h.querySelector("[data-action='toggle-profile']")) == null || f.setAttribute("aria-expanded", "false");
    });
  }
  syncConstraints(t) {
    t.find("[data-profile-section]").each((n, i) => this.syncProfileConstraints(i));
  }
  clampNumberInputs() {
    var n;
    const t = (n = this.element) == null ? void 0 : n[0];
    t == null || t.querySelectorAll("input[type='number']").forEach((i) => re(i));
  }
  syncProfileConstraints(t) {
    const n = t.dataset.profileId ?? "", i = (b) => t.querySelector(`[name="${n}.${b}"]`), s = i("nodeCount"), o = i("decoyCount"), c = i("routeCount"), a = i("firewallCount"), l = i("allowFirewallOnMainPath");
    if (s && o && c && a) {
      const b = pt(
        Number(s.value),
        Number(o.value),
        Number(c.value),
        !!(l != null && l.checked)
      );
      s.value = String(b.nodeCount), o.max = String(b.maxDecoys), o.value = String(b.decoyCount), c.max = String(b.maxRoutes), c.value = String(b.routeCount), a.max = String(b.maxFirewalls), a.value = String(S(Math.round(Number(a.value) || 0), 0, b.maxFirewalls)), t.querySelectorAll("[data-constraint]").forEach((C) => {
        const k = C.dataset.constraint;
        k && b[k] !== void 0 && (C.textContent = String(b[k]));
      });
    }
    const u = i("packetLaneCount"), d = i("packetColumnCount");
    if (u && d) {
      const b = S(Math.round(Number(u.value) || 4), 3, 6), C = b - 1;
      u.value = String(b), d.min = String(C), d.value = String(S(Math.round(Number(d.value) || 6), C, 8));
    }
    const h = i("prismRingCount"), f = i("prismSlotCount"), m = i("prismReceiverCount"), w = i("prismIceReceiverCount"), P = i("prismSwitchableRingCount"), I = i("prismScrambleSteps");
    if (h && f && m && w && P && I) {
      const b = S(Math.round(Number(h.value) || 3), 2, 4), C = S(Math.round(Number(f.value) || 10), 8, 16), k = S(Math.round(Number(m.value) || 4), 2, Math.min(8, C)), A = S(Math.round(Number(P.value) || 0), 0, b - 1), p = Math.min(4, C - k);
      h.value = String(b), f.value = String(C), m.max = String(Math.min(8, C)), m.value = String(k), P.max = String(b - 1), P.value = String(A), w.max = String(p), w.min = String(A > 0 && p > 0 ? 1 : 0), w.value = String(S(Math.round(Number(w.value) || 0), Number(w.min), p)), I.max = String(Math.floor(C / 2)), I.value = String(S(Math.round(Number(I.value) || 3), 1, Math.floor(C / 2)));
    }
  }
  resetProfileSection(t) {
    const n = t.dataset.profileId ?? "";
    if (!Ct.includes(n)) return;
    const i = rn(n), s = {
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
    for (const [c, a] of Object.entries(s)) {
      const l = t.querySelector(`[name="${n}.${c}"]`);
      l && (l.value = String(a));
    }
    const o = {
      hintsEnabled: i.hintsEnabled,
      radarEnabled: i.nodeIntrusion.radarEnabled,
      showTarget: i.nodeIntrusion.showTarget,
      allowFirewallOnMainPath: i.nodeIntrusion.allowFirewallOnMainPath
    };
    for (const [c, a] of Object.entries(o)) {
      const l = t.querySelector(`[name="${n}.${c}"]`);
      l && (l.checked = a);
    }
    this.syncProfileConstraints(t);
  }
  async _updateObject(t, n) {
    var o, c;
    this.clampNumberInputs();
    const i = new FormData(this.form), s = {};
    for (const a of Ct) {
      const l = O[a], u = `${a}.`;
      s[a] = {
        traceDurationSeconds: S(Math.round(v(i, `${u}nodeTraceDurationSeconds`, l.traceDurationSeconds)), 5, 300),
        hintsEnabled: gt(i, `${u}hintsEnabled`),
        visualGlitchIntensity: S(v(i, `${u}visualGlitchIntensity`, l.visualGlitchIntensity), 0, 1),
        nodeIntrusion: Ze(i, u, l),
        signalAlignment: tn(i, u, l),
        packetSwitchboard: en(i, u, l),
        prismLock: nn(i, u, l)
      };
    }
    await game.settings.set(rt, "difficultyProfileOverrides", JSON.stringify(s)), (c = (o = ui.notifications) == null ? void 0 : o.info) == null || c.call(o, "HoloSuite Hacking difficulty profiles saved.");
  }
}
async function wt({ title: e, result: r, actorName: t, message: n, rollTotal: i, dc: s }) {
  const o = r === "success", c = o ? "#38f28f" : "#ff477e", a = o ? "HACK SUCCESS" : "HACK FAILED", l = n || (o ? "Objective completed." : "Trace or countermeasure completed."), u = Number.isFinite(Number(i)) && Number.isFinite(Number(s)) ? `<p style="margin: 4px 0 0; color: #bdeff6;">Roll ${Number(i)} vs DC ${Number(s)}</p>` : "", d = `
    <div class="holosuite-hacking-chat-result" style="border-left: 4px solid ${c}; padding: 8px 10px; background: rgba(5, 8, 14, 0.88); color: ${c};">
      <strong>${at(a)} // ${at(e)} // ${at(t || "Hacker")}</strong>
      <p style="margin: 6px 0 0; color: ${c};">${at(l)}</p>
      ${u}
    </div>
  `;
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content: d
  });
}
function at(e) {
  const r = document.createElement("div");
  return r.textContent = String(e ?? ""), r.innerHTML;
}
function L(e, r, t) {
  return Math.min(t, Math.max(r, e));
}
function on(e) {
  const r = String(e ?? "node-intrusion");
  let t = 2166136261;
  for (let n = 0; n < r.length; n += 1)
    t ^= r.charCodeAt(n), t = Math.imul(t, 16777619);
  return t >>> 0;
}
function an(e) {
  let r = on(e);
  return () => {
    r += 1831565813;
    let t = r;
    return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function Pt(e, r) {
  return e.length ? e[Math.floor(r() * e.length)] : null;
}
function cn(e, r) {
  const t = [...e];
  for (let n = t.length - 1; n > 0; n -= 1) {
    const i = Math.floor(r() * (n + 1));
    [t[n], t[i]] = [t[i], t[n]];
  }
  return t;
}
function z(e, r, t) {
  const n = e.find((s) => s.id === r), i = e.find((s) => s.id === t);
  !n || !i || (n.connected.includes(t) || n.connected.push(t), i.connected.includes(r) || i.connected.push(r));
}
function Q(e, r) {
  return [e, r].sort().join("--");
}
function St(e, r, t, n) {
  return {
    id: e,
    x: L(Math.round(t), 6, 94),
    y: L(Math.round(n), 10, 90),
    type: r,
    connected: [],
    revealed: r === "start",
    visited: !1
  };
}
function Lt(e) {
  return e.flatMap((r) => r.connected.filter((t) => r.id < t).map((t) => ({ from: r.id, to: t })));
}
function E(e, r) {
  return e.find((t) => t.id === r);
}
function ct(e, r, t) {
  return Math.sign((r.y - e.y) * (t.x - r.x) - (r.x - e.x) * (t.y - r.y));
}
function ln(e, r, t, n) {
  const i = ct(e, r, t), s = ct(e, r, n), o = ct(t, n, e), c = ct(t, n, r);
  return i !== s && o !== c;
}
function un(e, r, t) {
  if (r.from === t.from || r.from === t.to || r.to === t.from || r.to === t.to) return !1;
  const n = E(e, r.from), i = E(e, r.to), s = E(e, t.from), o = E(e, t.to);
  return !n || !i || !s || !o ? !1 : ln(n, i, s, o);
}
function dn(e, r, t) {
  const n = t.x - r.x, i = t.y - r.y, s = n * n + i * i;
  if (!s) {
    const u = e.x - r.x, d = e.y - r.y;
    return Math.sqrt(u * u + d * d);
  }
  const o = L(((e.x - r.x) * n + (e.y - r.y) * i) / s, 0, 1), c = {
    x: r.x + o * n,
    y: r.y + o * i
  }, a = e.x - c.x, l = e.y - c.y;
  return Math.sqrt(a * a + l * l);
}
function hn(e, r = Lt(e)) {
  let t = 0;
  for (let n = 0; n < r.length; n += 1)
    for (let i = n + 1; i < r.length; i += 1)
      un(e, r[n], r[i]) && (t += 1);
  return t;
}
function we(e) {
  const r = Lt(e);
  let t = hn(e, r) * 900;
  for (let n = 0; n < e.length; n += 1)
    for (let i = n + 1; i < e.length; i += 1) {
      const s = e[n], o = e[i], c = o.x - s.x, a = o.y - s.y, l = Math.sqrt(c * c + a * a) || 1;
      l < 13 && (t += (13 - l) * 30), l < 18 && (t += (18 - l) * 6);
    }
  for (const n of e)
    for (const i of r) {
      if (i.from === n.id || i.to === n.id) continue;
      const s = E(e, i.from), o = E(e, i.to);
      if (!s || !o) continue;
      const c = dn(n, s, o);
      c < 8 && (t += (8 - c) * 18);
    }
  return t;
}
function fn(e, r, t) {
  const n = e.map((i) => ({ ...i, connected: [...i.connected] }));
  n.push({ ...r, connected: [] });
  for (const i of t) z(n, r.id, i);
  return we(n);
}
function se(e, r, t, n, i, s, o = {}) {
  const {
    radiusMin: c = 17,
    radiusMax: a = 34,
    biasX: l = 5,
    ySpread: u = 1
  } = o;
  let d = null, h = 1 / 0;
  for (let f = 0; f < 16; f += 1) {
    const m = i() * Math.PI * 2 - Math.PI * 0.2, w = c + i() * (a - c), P = n.x + Math.cos(m) * w + l, I = n.y + Math.sin(m) * w * u, b = St(r, t, P, I), C = fn(e, b, s);
    C < h && (d = b, h = C);
  }
  return d ?? St(r, t, n.x + l, n.y);
}
function mn(e) {
  for (let r = 0; r < 24; r += 1)
    for (let t = 0; t < e.length; t += 1)
      for (let n = t + 1; n < e.length; n += 1) {
        const i = e[t], s = e[n], o = s.x - i.x, c = s.y - i.y, a = Math.sqrt(o * o + c * c) || 1;
        if (a >= 13) continue;
        const l = (13 - a) * 0.35, u = o / a * l, d = c / a * l;
        i.type !== "start" && i.type !== "target" && (i.x = L(i.x - u, 6, 94), i.y = L(i.y - d, 10, 90)), s.type !== "start" && s.type !== "target" && (s.x = L(s.x + u, 6, 94), s.y = L(s.y + d, 10, 90));
      }
}
function lt(e) {
  const r = Math.floor(e() * 4);
  return r === 0 ? { x: 8 + e() * 22, y: 12 + e() * 76 } : r === 1 ? { x: 70 + e() * 22, y: 12 + e() * 76 } : r === 2 ? { x: 12 + e() * 76, y: 10 + e() * 20 } : { x: 12 + e() * 76, y: 70 + e() * 20 };
}
function gn(e) {
  let r = lt(e), t = lt(e), n = { start: r, target: t, distance: 0 };
  for (let i = 0; i < 24; i += 1) {
    r = lt(e), t = lt(e);
    const s = t.x - r.x, o = t.y - r.y, c = Math.sqrt(s * s + o * o);
    if (c > n.distance && (n = { start: r, target: t, distance: c }), c >= 58) return { start: r, target: t };
  }
  return { start: n.start, target: n.target };
}
function oe(e, r, t, n = /* @__PURE__ */ new Set()) {
  const i = [r], s = /* @__PURE__ */ new Map([[r, null]]);
  for (let a = 0; a < i.length; a += 1) {
    const l = E(e, i[a]);
    if (l) {
      if (l.id === t) break;
      for (const u of l.connected) {
        if (s.has(u)) continue;
        const d = E(e, u);
        !d || n.has(d.type) || (s.set(u, l.id), i.push(u));
      }
    }
  }
  if (!s.has(t)) return [];
  const o = [];
  let c = t;
  for (; c; )
    o.unshift(c), c = s.get(c) ?? null;
  return o;
}
function pn(e, r, t) {
  const n = oe(e, r, t, /* @__PURE__ */ new Set(["firewall", "decoy"]));
  if (!n.length) return 0;
  const i = /* @__PURE__ */ new Set([r, t]), s = e.map((o) => ({
    ...o,
    connected: i.has(o.id) || !n.includes(o.id) ? [...o.connected] : []
  }));
  return 1 + (oe(s, r, t, /* @__PURE__ */ new Set(["firewall", "decoy"])).length ? 1 : 0);
}
function Sn(e, r, t, n) {
  let i = e.length + 1;
  const s = [];
  for (let o = 1; o < n && !(r.length < 5); o += 1) {
    const c = 1 + Math.floor(t() * Math.max(1, r.length - 4)), a = L(c + 2 + Math.floor(t() * 3), c + 2, r.length - 2), l = E(e, r[c]), u = E(e, r[a]);
    if (!l || !u) continue;
    const d = `node-${i}`;
    i += 1;
    const h = St(
      d,
      "normal",
      (l.x + u.x) / 2 + (t() - 0.5) * 34,
      (l.y + u.y) / 2 + (t() - 0.5) * 34
    );
    e.push(h), s.push(l.id, h.id, u.id), z(e, l.id, h.id), z(e, h.id, u.id);
  }
  return s;
}
function ae(e, r = Date.now()) {
  var I, b, C, k, A;
  const t = an(r), n = Math.max(6, Number(e.nodeCount ?? ((I = e.nodeIntrusion) == null ? void 0 : I.nodeCount)) || 10), i = L(Number(e.decoyCount ?? ((b = e.nodeIntrusion) == null ? void 0 : b.decoyCount)) || 0, 0, n - 4), s = Math.max(0, n - i), o = L(Math.round(s * 0.48), 6, s), c = L(Number(e.routeCount ?? ((C = e.nodeIntrusion) == null ? void 0 : C.routeCount)) || 2, 1, 3), a = gn(t), l = [], u = [];
  for (let p = 0; p < o; p += 1) {
    const y = p === 0 ? "start" : p === o - 1 ? "target" : `node-${p}`, M = p === 0 ? "start" : p === o - 1 ? "target" : "normal", R = p / Math.max(1, o - 1), N = a.target.x - a.start.x, D = a.target.y - a.start.y, q = Math.sqrt(N * N + D * D) || 1, B = -D / q, V = N / q, $ = Math.sin(R * Math.PI * (1.15 + t() * 0.6)) * (10 + t() * 8), F = p === 0 || p === o - 1 ? 0 : (t() - 0.5) * 5, st = p === 0 || p === o - 1 ? 0 : (t() - 0.5) * 12;
    l.push(St(
      y,
      M,
      a.start.x + N * R + B * $ + F,
      a.start.y + D * R + V * $ + st
    )), u.push(y), p > 0 && z(l, u[p - 1], y);
  }
  const d = /* @__PURE__ */ new Set([...u, ...Sn(l, u, t, c)]);
  let h = l.length + 1;
  for (; l.length < n - i; ) {
    const p = Pt(l.filter((D) => D.type !== "target"), t) ?? l[0], y = `node-${h}`;
    h += 1;
    const M = t() > 0.45 ? Pt(l.filter((D) => D.id !== p.id && D.type !== "start"), t) : null, R = M ? [p.id, M.id] : [p.id], N = se(l, y, "normal", p, t, R, {
      radiusMin: 16,
      radiusMax: 31,
      biasX: t() > 0.35 ? 5 : -4,
      ySpread: 1.15
    });
    l.push(N), z(l, p.id, y), M && z(l, y, M.id);
  }
  for (let p = 0; p < i; p += 1) {
    const y = Pt(l.filter((N) => N.type !== "target" && N.type !== "decoy"), t) ?? l[0], M = `decoy-${p + 1}`, R = se(l, M, "decoy", y, t, [y.id], {
      radiusMin: 18,
      radiusMax: 34,
      biasX: t() > 0.5 ? -6 : 6,
      ySpread: 1.25
    });
    l.push(R), z(l, y.id, M);
  }
  const f = !!(e.allowFirewallOnMainPath ?? e.allowMainPathFirewalls ?? ((k = e.nodeIntrusion) == null ? void 0 : k.allowFirewallOnMainPath)), m = l.filter((p) => p.type === "start" || p.type === "target" || p.type === "decoy" ? !1 : f || !d.has(p.id)), w = L(Number(e.firewallCount ?? ((A = e.nodeIntrusion) == null ? void 0 : A.firewallCount)) || 0, 0, m.length);
  for (const p of cn(m, t).slice(0, w))
    p.type = "firewall";
  mn(l);
  const P = pn(l, "start", "target");
  return {
    nodes: l,
    edges: Lt(l),
    startNodeId: "start",
    targetNodeId: "target",
    mainPathIds: u,
    safeRoutes: P,
    layoutScore: we(l)
  };
}
function yn(e, r = Date.now()) {
  var i;
  const t = L(Math.ceil(Number(e.nodeCount ?? ((i = e.nodeIntrusion) == null ? void 0 : i.nodeCount)) || 10), 7, 14);
  let n = null;
  for (let s = 0; s < t; s += 1) {
    const o = ae(e, `${r}:${s}`);
    if ((!n || o.layoutScore < n.layoutScore) && (n = o), o.layoutScore < 1 && o.safeRoutes > 1) break;
  }
  return n ?? ae(e, r);
}
const ve = "holosuite-hacking", bn = `modules/${ve}/templates/node-intrusion.html`, wn = Y();
function ut(e, r, t) {
  return Math.min(t, Math.max(r, e));
}
function ce(e) {
  return e === "start" ? "entry" : e === "target" ? "target" : e === "firewall" ? "firewall" : e === "decoy" ? "decoy" : "relay";
}
function vn(e, r, t) {
  const n = globalThis.crypto, i = typeof (n == null ? void 0 : n.randomUUID) == "function" ? n.randomUUID() : `${Date.now()}:${performance.now()}:${Math.random()}`;
  return `${e}:${r}:${t.profileId ?? t.id}:${i}`;
}
class Cn extends wn {
  constructor(t = {}) {
    super(t);
    g(this, "rollTotal");
    g(this, "dc");
    g(this, "profile");
    g(this, "seed");
    g(this, "onSuccess");
    g(this, "onFailure");
    g(this, "actorName");
    g(this, "chatOnResult");
    g(this, "graph");
    g(this, "state");
    g(this, "startedAt");
    g(this, "timer");
    g(this, "claimTimer");
    g(this, "resultMessage");
    this.rollTotal = Number(t.rollTotal ?? 15), this.dc = Number(t.dc ?? 15), this.profile = t.profile ? { ...t.profile } : W(this.rollTotal, this.dc), this.seed = t.seed ?? vn(this.rollTotal, this.dc, this.profile), this.onSuccess = typeof t.onSuccess == "function" ? t.onSuccess : null, this.onFailure = typeof t.onFailure == "function" ? t.onFailure : null, this.actorName = String(t.actorName ?? "Hacker"), this.chatOnResult = t.chatOnResult !== !1, this.graph = yn(this.profile, this.seed), this.state = {
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
      template: bn
    });
  }
  getData() {
    var o, c;
    const t = this.getCurrentNode(), n = t.connected, i = !!(this.profile.radarEnabled ?? ((o = this.profile.nodeIntrusion) == null ? void 0 : o.radarEnabled) ?? Number(this.profile.radarRange ?? ((c = this.profile.nodeIntrusion) == null ? void 0 : c.radarRange)) > 0), s = this.graph.nodes.map((a) => {
      const l = a.id === this.state.currentNodeId, u = this.state.visitedNodeIds.has(a.id), d = a.id === this.state.claimingNodeId, h = a.type === "target" && (u || this.profile.showTarget || this.profile.hintsEnabled), f = a.type !== "target" && (this.profile.hintsEnabled || a.revealed || u || a.type === "start"), m = h || f ? ce(a.type) : "unknown", P = i && (l || u || n.includes(a.id)) && a.type !== "start" && a.type !== "target" ? this.countAdjacentBadNodes(a.id) : 0, I = ut(P, 0, 2);
      return {
        ...a,
        visualType: h ? "target" : a.type === "target" ? "normal" : a.type,
        isTargetVisible: h,
        isCurrent: l,
        isVisited: u,
        isClaiming: d,
        isNeighbor: n.includes(a.id),
        canMove: n.includes(a.id) && !this.state.claimingNodeId && !this.state.blockedEdgeIds.has(Q(t.id, a.id)) && !this.state.deadNodeIds.has(a.id),
        isDangerVisible: a.type !== "target" && (this.profile.hintsEnabled || a.revealed || u),
        dangerSignal: I,
        displayType: m,
        title: `${a.id} - ${m}${I ? ` / signal ${I}` : ""}`
      };
    });
    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      nodes: s,
      edges: this.graph.edges.map((a) => {
        const l = s.find((h) => h.id === a.from), u = s.find((h) => h.id === a.to), d = this.state.blockedEdgeIds.get(Q(a.from, a.to));
        return {
          ...a,
          from: l,
          to: u,
          isVisitedPath: this.state.traversedEdgeIds.has(Q(a.from, a.to)),
          isAvailable: !d && (n.includes(a.from) || n.includes(a.to)),
          isFirewallPath: d === "firewall",
          isDecoyPath: d === "decoy"
        };
      }),
      movement: this.state.movement,
      currentNode: {
        id: t.id,
        label: ce(t.type),
        availableRoutes: s.filter((a) => a.canMove).length
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
  activateListeners(t) {
    super.activateListeners(t), t.find("[data-node-id]").on("click", (n) => this.handleNodeClick(n.currentTarget.dataset.nodeId)), t.find("[data-action='start']").on("click", () => this.startRun()), t.find("[data-action='abort']").on("click", () => this.abort()), t.find("[data-action='close']").on("click", () => this.close()), this.syncDom();
  }
  async render(t, n) {
    const i = await super.render(t, n);
    return this.state.hasStarted && this.state.isRunning && this.startTimer(), i;
  }
  async close(t = {}) {
    return this.stopTimer(), this.claimTimer && window.clearTimeout(this.claimTimer), this.claimTimer = null, super.close(t);
  }
  getCurrentNode() {
    return this.graph.nodes.find((t) => t.id === this.state.currentNodeId) ?? this.graph.nodes[0];
  }
  getTraceDuration() {
    var i;
    const t = Number(game.settings.get(ve, "traceDurationMultiplier") ?? 1) || 1, n = Number(((i = this.profile.nodeIntrusion) == null ? void 0 : i.traceDurationSeconds) ?? this.profile.traceDurationSeconds ?? 60);
    return Math.max(5, n * t);
  }
  countAdjacentBadNodes(t) {
    const n = this.graph.nodes.find((i) => i.id === t);
    return n ? n.connected.reduce((i, s) => {
      const o = this.graph.nodes.find((c) => c.id === s);
      return (o == null ? void 0 : o.type) === "firewall" || (o == null ? void 0 : o.type) === "decoy" ? i + 1 : i;
    }, 0) : 0;
  }
  firewallsArePassable() {
    var t;
    return !!(this.profile.allowFirewallOnMainPath ?? this.profile.allowMainPathFirewalls ?? ((t = this.profile.nodeIntrusion) == null ? void 0 : t.allowFirewallOnMainPath));
  }
  startRun() {
    this.state.hasStarted || this.state.result || (this.state.hasStarted = !0, this.state.isRunning = !0, this.startedAt = performance.now(), this.startTimer(), this.render(!1));
  }
  handleNodeClick(t) {
    var l, u, d, h;
    if (!this.state.hasStarted || !this.state.isRunning || this.state.claimingNodeId) return;
    const n = this.getCurrentNode(), i = this.graph.nodes.find((f) => f.id === t);
    if (!i) return;
    if (!n.connected.includes(t)) {
      (l = this.element) == null || l.find(".node-intrusion-shell").addClass("invalid-pulse"), window.setTimeout(() => {
        var f;
        return (f = this.element) == null ? void 0 : f.find(".node-intrusion-shell").removeClass("invalid-pulse");
      }, 280);
      return;
    }
    const s = Q(n.id, t);
    if (this.state.blockedEdgeIds.has(s) || this.state.deadNodeIds.has(t)) {
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
    }, this.state.claimingNodeId = t, this.render(!1);
    const o = Math.max(0.1, Number(this.profile.claimDurationSeconds ?? ((d = this.profile.nodeIntrusion) == null ? void 0 : d.claimDurationSeconds)) || 0.5), c = Math.max(1, Number(this.profile.firewallClaimMultiplier ?? ((h = this.profile.nodeIntrusion) == null ? void 0 : h.firewallClaimMultiplier)) || 1), a = i.type === "firewall" ? o * c : o;
    this.claimTimer = window.setTimeout(() => {
      this.claimTimer = null, this.completeNodeClaim(n.id, t);
    }, a * 1e3);
  }
  completeNodeClaim(t, n) {
    var c, a, l, u, d, h;
    if (!this.state.hasStarted || !this.state.isRunning) return;
    const i = this.graph.nodes.find((f) => f.id === t), s = this.graph.nodes.find((f) => f.id === n);
    if (!i || !s) return;
    const o = Q(i.id, n);
    if (this.state.claimingNodeId = null, this.state.visitedNodeIds.add(n), this.state.traversedEdgeIds.add(o), s.visited = !0, s.revealed = !0, s.type === "firewall") {
      this.state.mistakes += 1;
      const f = Number(this.profile.firewallPenaltySeconds ?? ((c = this.profile.nodeIntrusion) == null ? void 0 : c.firewallPenaltySeconds)) || 6;
      if (this.addTracePenalty(f), (l = (a = ui.notifications) == null ? void 0 : a.warn) == null || l.call(a, `Firewall surge: trace accelerated by ${f}s.`), this.state.result) return;
      this.firewallsArePassable() ? this.state.currentNodeId = n : (this.state.blockedEdgeIds.set(o, "firewall"), this.state.deadNodeIds.add(n)), this.render(!1);
      return;
    }
    if (s.type === "decoy") {
      this.state.mistakes += 1, this.state.blockedEdgeIds.set(o, "decoy"), this.state.deadNodeIds.add(n);
      const f = Number(this.profile.decoyPenaltySeconds ?? ((u = this.profile.nodeIntrusion) == null ? void 0 : u.decoyPenaltySeconds)) || 4;
      this.addTracePenalty(f), (h = (d = ui.notifications) == null ? void 0 : d.warn) == null || h.call(d, `Decoy sink: trace accelerated by ${f}s.`), this.render(!1);
      return;
    }
    if (this.state.currentNodeId = n, s.type === "target") {
      this.finish("success", "Target node breached");
      return;
    }
    this.render(!1);
  }
  addTracePenalty(t) {
    const n = Math.max(0, t) / this.getTraceDuration() * 100;
    this.state.tracePenaltyProgress = ut(this.state.tracePenaltyProgress + n, 0, 100), this.state.traceProgress = ut(this.state.traceProgress + n, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
  }
  startTimer() {
    if (this.timer || !this.state.hasStarted || !this.startedAt) return;
    const t = this.getTraceDuration();
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const n = (performance.now() - this.startedAt) / 1e3;
      this.state.traceProgress = ut(n / t * 100 + this.state.tracePenaltyProgress, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
    }, 120);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(t, n, { close: i = !1 } = {}) {
    var o, c;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = t, this.stopTimer(), this.resultMessage = n, this.syncDom(), await this.render(!1);
    const s = {
      type: "node-intrusion",
      result: t,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      tracePenaltyProgress: this.state.tracePenaltyProgress,
      traceProgress: this.state.traceProgress,
      visitedNodeIds: [...this.state.visitedNodeIds]
    };
    this.chatOnResult && await wt({
      title: "Node Intrusion",
      result: t,
      actorName: this.actorName,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), t === "success" ? (o = this.onSuccess) == null || o.call(this, s) : (c = this.onFailure) == null || c.call(this, s), i && await this.close();
  }
  syncDom() {
    var o;
    const t = (o = this.element) == null ? void 0 : o[0];
    if (!t) return;
    const n = t.querySelector("[data-trace-fill]"), i = t.querySelector("[data-trace-text]"), s = t.querySelector("[data-penalty-text]");
    n && (n.style.width = `${this.state.traceProgress}%`), i && (i.textContent = `${Math.round(this.state.traceProgress)}%`), s && (s.textContent = `${Math.round(this.state.tracePenaltyProgress)}%`);
  }
}
function Ce(e, r, t) {
  return Math.min(t, Math.max(r, e));
}
function Pn(e) {
  const r = String(e ?? "signal-alignment");
  let t = 2166136261;
  for (let n = 0; n < r.length; n += 1)
    t ^= r.charCodeAt(n), t = Math.imul(t, 16777619);
  return t >>> 0;
}
function In(e) {
  let r = Pn(e);
  return () => {
    r += 1831565813;
    let t = r;
    return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function kt(e) {
  return Ce(Number(e) || 0, 0, 100);
}
function kn(e, r = Date.now()) {
  var s, o;
  const t = In(r), n = Ce(Number(e.channelCount ?? ((s = e.signalAlignment) == null ? void 0 : s.channelCount)) || 3, 2, 5), i = Number(e.tolerance ?? ((o = e.signalAlignment) == null ? void 0 : o.tolerance) ?? 5);
  return Array.from({ length: n }, (c, a) => {
    const l = Math.round(18 + t() * 64), u = t() > 0.5 ? 1 : -1, d = i + 8 + Math.round(t() * 18), h = t() > 0.5 ? 1 : -1;
    return {
      id: `channel-${a + 1}`,
      label: `CH-${String(a + 1).padStart(2, "0")}`,
      value: kt(l + u * d),
      target: l,
      tolerance: i,
      driftDirection: h
    };
  });
}
const Pe = "holosuite-hacking", Mn = `modules/${Pe}/templates/signal-alignment.html`, Nn = Y();
function dt(e, r, t) {
  return Math.min(t, Math.max(r, e));
}
class Tn extends Nn {
  constructor(t = {}) {
    super(t);
    g(this, "rollTotal");
    g(this, "dc");
    g(this, "profile");
    g(this, "seed");
    g(this, "onSuccess");
    g(this, "onFailure");
    g(this, "actorName");
    g(this, "chatOnResult");
    g(this, "channels");
    g(this, "state");
    g(this, "startedAt");
    g(this, "lastTickAt");
    g(this, "timer");
    g(this, "wasAligned");
    g(this, "resultMessage");
    this.rollTotal = Number(t.rollTotal ?? 15), this.dc = Number(t.dc ?? 15), this.profile = t.profile ? { ...t.profile } : W(this.rollTotal, this.dc), this.seed = t.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}:signal`, this.onSuccess = typeof t.onSuccess == "function" ? t.onSuccess : null, this.onFailure = typeof t.onFailure == "function" ? t.onFailure : null, this.actorName = String(t.actorName ?? "Hacker"), this.chatOnResult = t.chatOnResult !== !1, this.channels = kn(this.profile, this.seed), this.state = {
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
      template: Mn
    });
  }
  getData() {
    const t = this.channels.map((n) => {
      const i = Math.abs(n.value - n.target), s = i <= n.tolerance, o = this.isTargetVisible(n);
      return {
        ...n,
        valueLabel: n.value.toFixed(1),
        aligned: s,
        targetVisible: o,
        targetLabel: o ? n.target : "??",
        deltaRevealLabel: o ? i.toFixed(1) : "--",
        targetStateLabel: s ? "locked" : o ? "signal found" : "searching",
        waveDurationSeconds: Math.max(1.2, 3.2 - Number(this.profile.noiseLevel ?? 0) * 2),
        targetLeft: n.target,
        toleranceLeft: dt(n.target - n.tolerance, 0, 100),
        toleranceWidth: dt(n.tolerance * 2, 1, 100)
      };
    });
    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      channels: t,
      state: this.state,
      allAligned: this.areAllChannelsAligned(),
      lockPercent: Math.round(this.state.lockProgress * 100),
      resultTitle: this.state.result === "success" ? "Signal Locked" : "Signal Lost",
      resultDetail: this.resultMessage ?? (this.state.result === "success" ? "Transmission Decrypted" : "Trace Complete"),
      glitchClass: this.profile.visualGlitchIntensity > 0.7 ? "glitch-high" : this.profile.visualGlitchIntensity > 0.35 ? "glitch-medium" : "glitch-low"
    };
  }
  activateListeners(t) {
    super.activateListeners(t), t.find("[data-channel-slider]").on("input", (n) => this.handleSlider(n.currentTarget)), t.find("[data-action='start']").on("click", () => this.startRun()), t.find("[data-action='abort']").on("click", () => this.abort()), t.find("[data-action='close']").on("click", () => this.close()), this.syncDom();
  }
  async render(t, n) {
    const i = await super.render(t, n);
    return this.state.hasStarted && this.state.isRunning && this.startTimer(), i;
  }
  async close(t = {}) {
    return this.stopTimer(), super.close(t);
  }
  startRun() {
    this.state.hasStarted || this.state.result || (this.state.hasStarted = !0, this.state.isRunning = !0, this.startedAt = performance.now(), this.lastTickAt = this.startedAt, this.startTimer(), this.render(!1));
  }
  handleSlider(t) {
    if (!this.state.hasStarted || !this.state.isRunning) return;
    const n = this.channels.find((i) => i.id === t.dataset.channelSlider);
    n && (n.value = kt(t.value), this.checkDestabilization(), this.syncDom());
  }
  areAllChannelsAligned() {
    return this.channels.every((t) => Math.abs(t.value - t.target) <= t.tolerance);
  }
  isTargetVisible(t) {
    var s;
    const n = Math.abs(t.value - t.target), i = Number(this.profile.targetRevealRadius ?? ((s = this.profile.signalAlignment) == null ? void 0 : s.targetRevealRadius) ?? 100);
    return i >= 100 || n <= t.tolerance ? !0 : n <= i;
  }
  updateAlignmentState(t = this.areAllChannelsAligned()) {
    this.wasAligned && !t && this.recordTraceSpike(), this.wasAligned = t;
  }
  checkDestabilization() {
    this.updateAlignmentState();
  }
  recordTraceSpike() {
    var n, i;
    const t = Math.max(0, Number(this.profile.destabilizationPenaltySeconds ?? 0));
    this.state.mistakes += 1, this.state.tracePenaltySeconds += t, t > 0 && ((i = (n = ui.notifications) == null ? void 0 : n.warn) == null || i.call(n, `Signal destabilized. Trace jumped by ${t}s.`));
  }
  startTimer() {
    var s;
    if (this.timer || !this.state.hasStarted || !this.startedAt || !this.lastTickAt) return;
    const t = Number(game.settings.get(Pe, "traceDurationMultiplier") ?? 1) || 1, n = Number(((s = this.profile.signalAlignment) == null ? void 0 : s.traceDurationSeconds) ?? this.profile.traceDurationSeconds ?? 60), i = Math.max(5, n * t);
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const o = performance.now(), c = Math.min(0.5, (o - this.lastTickAt) / 1e3);
      this.lastTickAt = o, this.applyDrift(c);
      const a = this.areAllChannelsAligned();
      this.state.lockProgress = a ? dt(this.state.lockProgress + c / this.profile.lockHoldSeconds, 0, 1) : 0, this.updateAlignmentState(a);
      const l = (o - this.startedAt) / 1e3 + this.state.tracePenaltySeconds;
      this.state.traceProgress = dt(l / i * 100, 0, 100), this.syncDom(), this.state.lockProgress >= 1 ? this.finish("success", "Transmission Decrypted") : this.state.traceProgress >= 100 && this.finish("failure", "Trace Complete");
    }, 120);
  }
  applyDrift(t) {
    const n = Number(this.profile.signalDriftSpeed ?? 0);
    if (!(n <= 0))
      for (const i of this.channels)
        i.value = kt(i.value + i.driftDirection * n * t), (i.value <= 0 || i.value >= 100) && (i.driftDirection *= -1);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(t, n, { close: i = !1 } = {}) {
    var o, c;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = t, this.stopTimer(), this.resultMessage = n, this.syncDom(), await this.render(!1);
    const s = {
      type: "signal-alignment",
      result: t,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      tracePenaltySeconds: this.state.tracePenaltySeconds,
      traceProgress: this.state.traceProgress,
      lockProgress: this.state.lockProgress,
      channels: this.channels.map((a) => ({ ...a }))
    };
    this.chatOnResult && await wt({
      title: "Signal Alignment",
      result: t,
      actorName: this.actorName,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), t === "success" ? (o = this.onSuccess) == null || o.call(this, s) : (c = this.onFailure) == null || c.call(this, s), i && await this.close();
  }
  syncDom() {
    var a;
    const t = (a = this.element) == null ? void 0 : a[0];
    if (!t) return;
    const n = t.querySelector("[data-trace-fill]"), i = t.querySelector("[data-trace-text]"), s = t.querySelector("[data-mistake-text]"), o = t.querySelector("[data-lock-fill]"), c = t.querySelector("[data-lock-text]");
    n && (n.style.width = `${this.state.traceProgress}%`), i && (i.textContent = `${Math.round(this.state.traceProgress)}%`), s && (s.textContent = `${this.state.tracePenaltySeconds.toFixed(0)}s`), o && (o.style.width = `${Math.round(this.state.lockProgress * 100)}%`), c && (c.textContent = `${Math.round(this.state.lockProgress * 100)}%`);
    for (const l of this.channels) {
      const u = t.querySelector(`[data-channel-row="${l.id}"]`);
      if (!u) continue;
      const d = Math.abs(l.value - l.target) <= l.tolerance, h = this.isTargetVisible(l);
      u.classList.toggle("is-aligned", d), u.classList.toggle("is-target-visible", h), u.querySelector("[data-channel-value]").textContent = l.value.toFixed(1), u.querySelector("[data-channel-target]").textContent = h ? String(l.target) : "??", u.querySelector("[data-channel-delta]").textContent = h ? Math.abs(l.value - l.target).toFixed(1) : "--", u.querySelector("[data-channel-state]").textContent = d ? "locked" : h ? "signal found" : "searching";
      const f = u.querySelector("[data-channel-slider]");
      f && document.activeElement !== f && (f.value = l.value);
      const m = u.querySelector("[data-wave-fill]");
      m && (m.style.width = `${l.value}%`, m.style.setProperty("--wave-duration", `${Math.max(1.2, 3.2 - Number(this.profile.noiseLevel ?? 0) * 2)}s`));
    }
  }
}
const le = [
  { id: "cyan", label: "CYAN", color: "#4df6ff" },
  { id: "magenta", label: "MAGENTA", color: "#ff4fd8" },
  { id: "amber", label: "AMBER", color: "#ffc857" },
  { id: "lime", label: "LIME", color: "#8dff69" },
  { id: "violet", label: "VIOLET", color: "#a98cff" },
  { id: "red", label: "RED", color: "#ff6577" }
];
function X(e, r, t) {
  return Math.min(t, Math.max(r, e));
}
function An(e) {
  const r = String(e ?? "packet-switchboard");
  let t = 2166136261;
  for (let n = 0; n < r.length; n += 1)
    t ^= r.charCodeAt(n), t = Math.imul(t, 16777619);
  return t >>> 0;
}
function Rn(e) {
  let r = An(e);
  return () => {
    r += 1831565813;
    let t = r;
    return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function Ie(e) {
  return e < 0 ? "up" : e > 0 ? "down" : "straight";
}
function ke(e, r) {
  const t = [0];
  return e > 0 && t.unshift(-1), e < r - 1 && t.push(1), t;
}
function $n(e, r, t) {
  const n = ke(r, t), i = n.indexOf(Number(e));
  return n[(i + 1) % n.length];
}
function Mt(e, r, t) {
  const n = Math.sign(Number(e) || 0);
  return ke(r, t).includes(n) ? n : 0;
}
function Dn(e, r, t = 0, n = (r == null ? void 0 : r.sourceRow) ?? 0) {
  let i = X(Math.round(Number(n) || 0), 0, e.laneCount - 1);
  const s = [];
  for (let o = Math.max(0, Math.round(Number(t) || 0)); o < e.columnCount; o += 1) {
    const c = e.junctions.find((a) => a.row === i && a.column === o);
    c && (s.push(c.id), i = X(i + Mt(c.direction, i, e.laneCount), 0, e.laneCount - 1));
  }
  return {
    junctionIds: s,
    finalRow: i,
    targetRow: Number((r == null ? void 0 : r.targetRow) ?? i),
    reachesTarget: i === Number((r == null ? void 0 : r.targetRow) ?? i)
  };
}
function xn(e, r = Date.now()) {
  const t = e.packetSwitchboard ?? e, n = X(Math.round(Number(t.laneCount) || 4), 3, le.length), i = X(Math.round(Number(t.columnCount) || 6), n - 1, 8), s = X(Math.round(Number(t.deliveryGoal) || 7), 3, 20), o = X(Math.round(Number(t.previewCount) || 2), 0, 6), c = Rn(r), a = le.slice(0, n).map((f, m) => ({
    ...f,
    row: m,
    inputPort: `IN-${String(m + 1).padStart(2, "0")}`,
    port: `OUT-${String(m + 1).padStart(2, "0")}`
  })), l = [];
  for (let f = 0; f < n; f += 1)
    for (let m = 0; m < i; m += 1)
      l.push({
        id: `junction-${f}-${m}`,
        row: f,
        column: m,
        gridRow: f + 1,
        gridColumn: m + 1,
        direction: 0,
        directionLabel: Ie(0)
      });
  const u = [], d = Math.max(s * 4, s + 12);
  let h = -1;
  for (let f = 0; f < d; f += 1) {
    let m = Math.floor(c() * n);
    m === h && n > 1 && (m = (m + 1 + Math.floor(c() * (n - 1))) % n), h = m;
    let w = Math.floor(c() * n);
    w === m && c() > 0.2 && (w = (w + 1 + Math.floor(c() * (n - 1))) % n);
    const P = a[m], I = a[w];
    u.push({
      id: `packet-${f + 1}`,
      sequence: f + 1,
      sourceRow: w,
      sourcePort: I.inputPort,
      targetRow: m,
      colorId: P.id,
      color: P.color,
      label: P.label,
      port: P.port
    });
  }
  return {
    laneCount: n,
    columnCount: i,
    deliveryGoal: s,
    previewCount: o,
    lanes: a,
    junctions: l,
    packetPlan: u
  };
}
function Ln(e) {
  return Ie(e);
}
const Me = "holosuite-hacking", On = `modules/${Me}/templates/packet-switchboard.html`, Hn = Y();
function Z(e, r, t) {
  return Math.min(t, Math.max(r, e));
}
function Fn(e, r, t) {
  var i;
  const n = typeof ((i = globalThis.crypto) == null ? void 0 : i.randomUUID) == "function" ? globalThis.crypto.randomUUID() : `${Date.now()}:${performance.now()}:${Math.random()}`;
  return `${e}:${r}:${t.profileId ?? t.id}:switchboard:${n}`;
}
class En extends Hn {
  constructor(t = {}) {
    super(t);
    g(this, "rollTotal");
    g(this, "dc");
    g(this, "profile");
    g(this, "tuning");
    g(this, "seed");
    g(this, "actorName");
    g(this, "onSuccess");
    g(this, "onFailure");
    g(this, "chatOnResult");
    g(this, "board");
    g(this, "state");
    g(this, "startedAt");
    g(this, "nextSpawnAt");
    g(this, "timer");
    g(this, "hoveredJunctionId");
    g(this, "boundHoveredKeydown");
    g(this, "resultMessage");
    this.rollTotal = Number(t.rollTotal ?? 15), this.dc = Number(t.dc ?? 15), this.profile = t.profile ? { ...t.profile } : W(this.rollTotal, this.dc), this.tuning = this.profile.packetSwitchboard ?? {}, this.seed = t.seed ?? Fn(this.rollTotal, this.dc, this.profile), this.actorName = String(t.actorName ?? "Hacker"), this.onSuccess = typeof t.onSuccess == "function" ? t.onSuccess : null, this.onFailure = typeof t.onFailure == "function" ? t.onFailure : null, this.chatOnResult = t.chatOnResult !== !1, this.board = xn(this.profile, this.seed), this.state = {
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
      template: On
    });
  }
  getData() {
    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
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
  activateListeners(t) {
    super.activateListeners(t), this.hoveredJunctionId = null, t.find("[data-junction-id]").on("click", (n) => this.cycleJunction(n.currentTarget.dataset.junctionId)), t.find("[data-junction-id]").on("mouseenter", (n) => this.setHoveredJunction(n.currentTarget.dataset.junctionId, n.currentTarget)), t.find("[data-junction-id]").on("mouseleave", (n) => this.clearHoveredJunction(n.currentTarget.dataset.junctionId, n.currentTarget)), t.find("[data-action='start']").on("click", () => this.startRun()), t.find("[data-action='abort']").on("click", () => this.abort()), t.find("[data-action='close']").on("click", () => this.close()), window.removeEventListener("keydown", this.boundHoveredKeydown), window.addEventListener("keydown", this.boundHoveredKeydown), this.syncDom();
  }
  async render(t, n) {
    const i = await super.render(t, n);
    return this.state.hasStarted && this.state.isRunning && this.startTimer(), i;
  }
  async close(t = {}) {
    return this.stopTimer(), window.removeEventListener("keydown", this.boundHoveredKeydown), super.close(t);
  }
  getTraceDuration() {
    const t = Number(game.settings.get(Me, "traceDurationMultiplier") ?? 1) || 1;
    return Math.max(5, Number(this.tuning.traceDurationSeconds ?? this.profile.traceDurationSeconds ?? 60) * t);
  }
  getUpcomingPackets() {
    const t = Math.max(0, Number(this.tuning.previewCount ?? this.board.previewCount) || 0);
    return this.board.packetPlan.slice(this.state.nextPacketIndex, this.state.nextPacketIndex + t);
  }
  getMaxActivePackets() {
    return Z(Math.round(Number(this.tuning.maxActivePackets) || 2), 1, 6);
  }
  startRun() {
    this.state.hasStarted || this.state.result || (this.state.hasStarted = !0, this.state.isRunning = !0, this.startedAt = performance.now(), this.nextSpawnAt = this.startedAt, this.render(!1));
  }
  setHoveredJunction(t, n) {
    this.hoveredJunctionId = t, n == null || n.classList.add("is-keyboard-target");
  }
  clearHoveredJunction(t, n) {
    n == null || n.classList.remove("is-keyboard-target"), this.hoveredJunctionId === t && (this.hoveredJunctionId = null);
  }
  handleHoveredJunctionKeydown(t) {
    if (!this.hoveredJunctionId || t.altKey || t.ctrlKey || t.metaKey) return;
    const n = {
      ArrowUp: -1,
      ArrowRight: 0,
      ArrowDown: 1
    };
    t.key in n && (t.preventDefault(), t.stopPropagation(), this.setJunctionDirection(this.hoveredJunctionId, n[t.key]));
  }
  cycleJunction(t) {
    if (this.state.result) return;
    const n = this.board.junctions.find((i) => i.id === t);
    n && this.setJunctionDirection(t, $n(n.direction, n.row, this.board.laneCount));
  }
  setJunctionDirection(t, n) {
    var o, c;
    if (this.state.result) return;
    const i = this.board.junctions.find((a) => a.id === t);
    if (!i) return;
    i.direction = Mt(n, i.row, this.board.laneCount), i.directionLabel = Ln(i.direction);
    const s = (c = (o = this.element) == null ? void 0 : o[0]) == null ? void 0 : c.querySelector(`[data-junction-id="${i.id}"]`);
    s && (s.dataset.direction = i.directionLabel, s.setAttribute("aria-label", `Junction lane ${i.row + 1}, column ${i.column + 1}: ${i.directionLabel}`), s.setAttribute("title", `Route ${i.directionLabel}. Click to change direction.`)), this.syncRoutePreview();
  }
  startTimer() {
    this.timer || !this.state.hasStarted || !this.startedAt || (this.timer = window.setInterval(() => this.tick(performance.now()), 80));
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  tick(t) {
    if (!this.state.isRunning || !this.startedAt || this.nextSpawnAt === null) return;
    const n = Math.max(350, Number(this.tuning.packetIntervalSeconds ?? 2) * 1e3);
    for (; t >= this.nextSpawnAt && this.state.isRunning && !(this.state.activePackets.length >= this.getMaxActivePackets()); )
      this.spawnPacket(t), this.nextSpawnAt += n;
    const i = Math.max(250, Number(this.tuning.packetStepSeconds ?? 0.8) * 1e3);
    for (const o of [...this.state.activePackets])
      for (; this.state.isRunning && t >= o.nextMoveAt && (this.advancePacket(o), o.nextMoveAt += i, !!this.state.activePackets.includes(o)); )
        ;
    const s = (t - this.startedAt) / 1e3 + this.state.tracePenaltySeconds;
    this.state.traceProgress = Z(s / this.getTraceDuration() * 100, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
  }
  spawnPacket(t) {
    const n = this.board.packetPlan[this.state.nextPacketIndex % this.board.packetPlan.length];
    this.state.nextPacketIndex += 1, this.state.activePackets.push({
      ...n,
      runtimeId: `${n.id}-${this.state.nextPacketIndex}`,
      row: n.sourceRow,
      column: -1,
      nextMoveAt: t + Math.max(0, Number(this.tuning.entryHoldSeconds ?? 1.5) * 1e3)
    }), this.syncPreview();
  }
  advancePacket(t) {
    if (t.column < 0) {
      t.column = 0;
      return;
    }
    const n = this.board.junctions.find((i) => i.row === t.row && i.column === t.column);
    t.row = Z(t.row + Number((n == null ? void 0 : n.direction) ?? 0), 0, this.board.laneCount - 1), t.column += 1, t.column >= this.board.columnCount && this.resolvePacket(t);
  }
  resolvePacket(t) {
    var i, s;
    if (this.state.activePackets = this.state.activePackets.filter((o) => o.runtimeId !== t.runtimeId), t.row === t.targetRow) {
      this.state.delivered += 1, this.flashBoard("delivery-pulse"), this.state.delivered >= this.board.deliveryGoal && this.finish("success", "Priority payload delivered");
      return;
    }
    this.state.corrupted += 1;
    const n = Math.max(0, Number(this.tuning.misroutePenaltySeconds ?? 5));
    this.state.tracePenaltySeconds += n, this.flashBoard("misroute-pulse"), n > 0 && ((s = (i = ui.notifications) == null ? void 0 : i.warn) == null || s.call(i, `Packet misrouted. Trace jumped by ${n}s.`));
  }
  flashBoard(t) {
    var i, s, o;
    const n = (s = (i = this.element) == null ? void 0 : i.find) == null ? void 0 : s.call(i, ".packet-switchboard-shell");
    (o = n == null ? void 0 : n.addClass) == null || o.call(n, t), window.setTimeout(() => {
      var c;
      return (c = n == null ? void 0 : n.removeClass) == null ? void 0 : c.call(n, t);
    }, 320);
  }
  syncPreview() {
    var n, i;
    const t = (i = (n = this.element) == null ? void 0 : n[0]) == null ? void 0 : i.querySelector("[data-packet-preview]");
    if (t) {
      if (t.replaceChildren(...this.getUpcomingPackets().map((s) => {
        const o = document.createElement("span");
        return o.className = "packet-preview-chip", o.style.setProperty("--packet-color", s.color), o.textContent = `${s.sourcePort} -> ${s.port} / ${s.label}`, o;
      })), !t.childElementCount) {
        const s = document.createElement("span");
        s.className = "packet-preview-hidden", s.textContent = "Encrypted", t.appendChild(s);
      }
      this.syncRoutePreview();
    }
  }
  syncRoutePreview() {
    var a, l, u;
    const t = (a = this.element) == null ? void 0 : a[0];
    if (!t) return;
    t.querySelectorAll(".packet-junction.is-route-preview, .packet-junction.is-route-danger").forEach((d) => {
      d.classList.remove("is-route-preview", "is-route-danger");
    }), t.querySelectorAll(".packet-switchboard-inputs .is-preview-source, .packet-switchboard-outputs .is-preview-target").forEach((d) => {
      d.classList.remove("is-preview-source", "is-preview-target");
    });
    const n = this.state.activePackets[0] ?? null, i = n ?? this.getUpcomingPackets()[0] ?? null;
    if (!i) {
      this.syncConnectionLines();
      return;
    }
    const s = n ? Math.max(0, Number(n.column) || 0) : 0, o = n ? n.row : i.sourceRow, c = Dn(this.board, i, s, o);
    for (const d of c.junctionIds) {
      const h = t.querySelector(`[data-junction-id="${d}"]`);
      h == null || h.classList.add("is-route-preview"), c.reachesTarget || h == null || h.classList.add("is-route-danger");
    }
    (l = t.querySelector(`[data-input-row="${i.sourceRow}"]`)) == null || l.classList.add("is-preview-source"), (u = t.querySelector(`[data-output-row="${i.targetRow}"]`)) == null || u.classList.add("is-preview-target"), this.syncConnectionLines();
  }
  syncConnectionLines() {
    var i;
    const t = (i = this.element) == null ? void 0 : i[0];
    if (!t) return;
    const n = 0.5 / this.board.columnCount * 100;
    for (const s of this.board.lanes) {
      const o = t.querySelector(`[data-input-connection-row="${s.row}"]`);
      if (!o) continue;
      const c = (s.row + 0.5) / this.board.laneCount * 100;
      o.setAttribute("x1", "0"), o.setAttribute("y1", String(c)), o.setAttribute("x2", String(n)), o.setAttribute("y2", String(c));
      const a = t.querySelector(`[data-input-row="${s.row}"]`), l = t.querySelector(".packet-junction.is-route-preview"), u = !!(a != null && a.classList.contains("is-preview-source"));
      o.classList.toggle("is-route-preview", u), o.classList.toggle("is-route-danger", u && !!(l != null && l.classList.contains("is-route-danger")));
    }
    for (const s of this.board.junctions) {
      const o = t.querySelector(`[data-connection-id="${s.id}"]`);
      if (!o) continue;
      const c = Mt(s.direction, s.row, this.board.laneCount), a = Z(s.row + c, 0, this.board.laneCount - 1), l = (s.column + 0.5) / this.board.columnCount * 100, u = s.column >= this.board.columnCount - 1 ? 100 : (s.column + 1.5) / this.board.columnCount * 100, d = (s.row + 0.5) / this.board.laneCount * 100, h = (a + 0.5) / this.board.laneCount * 100;
      o.setAttribute("x1", String(l)), o.setAttribute("y1", String(d)), o.setAttribute("x2", String(u)), o.setAttribute("y2", String(h));
      const f = t.querySelector(`[data-junction-id="${s.id}"]`);
      o.classList.toggle("is-route-preview", !!(f != null && f.classList.contains("is-route-preview"))), o.classList.toggle("is-route-danger", !!(f != null && f.classList.contains("is-route-danger")));
    }
  }
  syncPackets() {
    var i, s;
    const t = (s = (i = this.element) == null ? void 0 : i[0]) == null ? void 0 : s.querySelector("[data-packet-layer]");
    if (!t) return;
    const n = new Set(this.state.activePackets.map((o) => o.runtimeId));
    t.querySelectorAll("[data-runtime-packet]").forEach((o) => {
      const c = o;
      n.has(c.dataset.runtimePacket) || c.remove();
    });
    for (const o of this.state.activePackets) {
      let c = t.querySelector(`[data-runtime-packet="${o.runtimeId}"]`);
      if (!c) {
        c = document.createElement("div"), c.className = "switchboard-packet", c.dataset.runtimePacket = o.runtimeId, c.style.setProperty("--packet-color", o.color);
        const u = document.createElement("span");
        u.textContent = String(o.targetRow + 1), c.appendChild(u), c.title = `${o.label} packet to ${o.port}`, t.appendChild(c);
      }
      const a = o.column < 0 ? 0 : (o.column + 0.5) / this.board.columnCount * 100, l = (o.row + 0.5) / this.board.laneCount * 100;
      c.style.left = `${Z(a, 0, 100)}%`, c.style.top = `${l}%`;
    }
  }
  syncDom() {
    var o;
    const t = (o = this.element) == null ? void 0 : o[0];
    if (!t) return;
    const n = t.querySelector("[data-trace-fill]"), i = t.querySelector("[data-delivery-fill]");
    n && (n.style.width = `${this.state.traceProgress}%`), i && (i.style.width = `${Math.min(100, this.state.delivered / this.board.deliveryGoal * 100)}%`);
    const s = {
      "[data-trace-text]": `${Math.round(this.state.traceProgress)}%`,
      "[data-delivery-text]": `${this.state.delivered} / ${this.board.deliveryGoal}`,
      "[data-corrupted-text]": String(this.state.corrupted),
      "[data-active-text]": `${this.state.activePackets.length} / ${this.getMaxActivePackets()}`
    };
    for (const [c, a] of Object.entries(s)) {
      const l = t.querySelector(c);
      l && (l.textContent = a);
    }
    this.syncPackets(), this.syncRoutePreview();
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(t, n, { close: i = !1 } = {}) {
    var o, c;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = t, this.stopTimer(), this.resultMessage = n, await this.render(!1);
    const s = {
      type: "packet-switchboard",
      result: t,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      delivered: this.state.delivered,
      corrupted: this.state.corrupted,
      tracePenaltySeconds: this.state.tracePenaltySeconds,
      traceProgress: this.state.traceProgress
    };
    this.chatOnResult && await wt({
      title: "Packet Switchboard",
      result: t,
      actorName: this.actorName,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), t === "success" ? (o = this.onSuccess) == null || o.call(this, s) : (c = this.onFailure) == null || c.call(this, s), i && await this.close();
  }
}
const _n = ["#57f3ff", "#b779ff", "#ffcd57", "#66ffad"];
function j(e, r, t) {
  return Math.min(t, Math.max(r, e));
}
function _(e, r) {
  return (Math.round(e) % r + r) % r;
}
function qn(e) {
  const r = String(e ?? "prism-lock");
  let t = 2166136261;
  for (let n = 0; n < r.length; n += 1)
    t ^= r.charCodeAt(n), t = Math.imul(t, 16777619);
  return t >>> 0;
}
function Gn(e) {
  let r = qn(e);
  return () => {
    r += 1831565813;
    let t = r;
    return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function ue(e, r) {
  const t = [...e];
  for (let n = t.length - 1; n > 0; n -= 1) {
    const i = Math.floor(r() * (n + 1));
    [t[n], t[i]] = [t[i], t[n]];
  }
  return t;
}
function J(e, r, t) {
  const n = _(e, t) / t * Math.PI * 2 - Math.PI / 2;
  return {
    x: 50 + Math.cos(n) * r,
    y: 50 + Math.sin(n) * r
  };
}
function de(e, r) {
  return e.find((t) => t.id === r.id) ?? {
    id: r.id,
    rotation: r.initialRotation ?? 0,
    enabled: r.initialEnabled !== !1
  };
}
function U(e, r) {
  const t = /* @__PURE__ */ new Set(), n = [], i = [], s = [];
  for (const a of e.rings) {
    const l = de(r, a);
    if (l.enabled)
      for (const u of a.blockers) {
        const d = _(u.baseSlot + l.rotation, e.slotCount);
        s.push({
          id: u.id,
          ringId: a.id,
          ringIndex: a.index,
          slot: d,
          color: a.color,
          ...J(d, a.radius, e.slotCount)
        });
      }
  }
  for (const a of e.rings) {
    const l = de(r, a);
    if (l.enabled)
      for (const u of a.emitters) {
        const d = _(u.baseSlot + l.rotation, e.slotCount), h = J(d, a.radius, e.slotCount), f = s.filter((P) => P.ringIndex > a.index && P.slot === d).sort((P, I) => P.ringIndex - I.ringIndex)[0] ?? null, m = f ? Math.max(a.radius + 1, e.rings[f.ringIndex].radius - 2.2) : e.receiverRadius, w = J(d, m, e.slotCount);
        f || t.add(d), i.push({
          id: u.id,
          ringId: a.id,
          slot: d,
          color: a.color,
          x: h.x,
          y: h.y
        }), n.push({
          id: `${u.id}-beam`,
          ringId: a.id,
          slot: d,
          color: a.color,
          x1: h.x,
          y1: h.y,
          x2: w.x,
          y2: w.y,
          blocked: !!f
        });
      }
  }
  const o = e.receivers.map((a) => ({
    ...a,
    lit: t.has(a.slot),
    ...J(a.slot, e.receiverRadius, e.slotCount)
  })), c = e.iceReceivers.map((a) => {
    const l = J(a.slot, e.receiverRadius, e.slotCount);
    return {
      ...a,
      lit: t.has(a.slot),
      ...l,
      rectX: l.x - 2.2,
      rectY: l.y - 2.2
    };
  });
  return {
    beams: n,
    emitters: i,
    blockers: s,
    receivers: o,
    iceReceivers: c,
    litSlots: [...t],
    activeIceSlots: c.filter((a) => a.lit).map((a) => a.slot),
    litReceiverCount: o.filter((a) => a.lit).length,
    solved: o.every((a) => a.lit) && c.every((a) => !a.lit)
  };
}
function jn(e, r, t, n) {
  return e.map((i) => i.id === r ? { ...i, rotation: _(i.rotation + Math.sign(t), n) } : { ...i });
}
function Un(e, r = Date.now()) {
  var A;
  const t = e.prismLock ?? e, n = Gn(r), i = j(Math.round(Number(t.ringCount) || 3), 2, 4), s = j(Math.round(Number(t.slotCount) || 10), 8, 16), o = j(Math.round(Number(t.receiverCount) || 4), 2, Math.min(8, s - 2)), c = j(Math.round(Number(t.switchableRingCount) || 0), 0, i - 1), a = Math.min(4, s - o), l = c > 0 && a > 0 ? 1 : 0, u = j(Math.round(Number(t.iceReceiverCount) || 0), l, a), d = i - c, h = j(Math.round(Number(t.blockersPerRing) || 0), 0, 3), f = j(Math.round(Number(t.scrambleSteps) || 3), 1, Math.floor(s / 2)), m = ue(Array.from({ length: s }, (p, y) => y), n), w = m.slice(0, o), P = m.slice(o, o + u), I = Array.from({ length: i }, () => Math.floor(n() * s)), b = w.map((p, y) => ({
    slot: p,
    ringIndex: y % d
  })), C = Array.from({ length: i }, (p, y) => {
    const M = I[y], R = y >= d, N = b.filter(($) => $.ringIndex === y).map(($) => $.slot), D = R ? [P[(y - d) % Math.max(1, P.length)] ?? m.at(-1) ?? 0] : N, q = /* @__PURE__ */ new Set([...w, ...P]), B = ue(
      Array.from({ length: s }, ($, F) => F).filter(($) => !q.has($)),
      n
    ).slice(0, h), V = 1 + Math.floor(n() * f);
    return {
      id: `ring-${y + 1}`,
      index: y,
      label: `RING ${String(y + 1).padStart(2, "0")}`,
      color: _n[y],
      radius: 14 + y * 8,
      switchable: R,
      solvedRotation: M,
      solvedEnabled: !R,
      initialRotation: _(M + V, s),
      initialEnabled: !0,
      emitters: D.map(($, F) => ({
        id: `ring-${y + 1}-emitter-${F + 1}`,
        baseSlot: _($ - M, s)
      })),
      blockers: B.map(($, F) => ({
        id: `ring-${y + 1}-blocker-${F + 1}`,
        baseSlot: _($ - M, s)
      }))
    };
  }), k = {
    ringCount: i,
    slotCount: s,
    receiverCount: o,
    receiverRadius: 46,
    rings: C,
    receivers: w.map((p, y) => ({ id: `receiver-${y + 1}`, slot: p })),
    iceReceivers: P.map((p, y) => ({ id: `ice-${y + 1}`, slot: p })),
    ticks: Array.from({ length: s }, (p, y) => ({
      slot: y,
      ...J(y, 42.5, s)
    })),
    solutionStates: C.map((p) => ({ id: p.id, rotation: p.solvedRotation, enabled: p.solvedEnabled })),
    initialStates: C.map((p) => ({ id: p.id, rotation: p.initialRotation, enabled: p.initialEnabled }))
  };
  if (U(k, k.initialStates).solved) {
    let p = k.initialStates;
    t: for (const y of C)
      for (let M = 1; M < s; M += 1) {
        const R = k.initialStates.map((N) => N.id === y.id ? { ...N, rotation: _(N.rotation + M, s) } : { ...N });
        if (!U(k, R).solved) {
          p = R;
          break t;
        }
      }
    k.initialStates = p;
    for (const y of C)
      y.initialRotation = ((A = k.initialStates.find((M) => M.id === y.id)) == null ? void 0 : A.rotation) ?? y.initialRotation;
  }
  return k;
}
const Ne = "holosuite-hacking", zn = `modules/${Ne}/templates/prism-lock.html`, Bn = Y();
function Vn(e, r, t) {
  return Math.min(t, Math.max(r, e));
}
function Jn(e, r, t) {
  var i;
  const n = typeof ((i = globalThis.crypto) == null ? void 0 : i.randomUUID) == "function" ? globalThis.crypto.randomUUID() : `${Date.now()}:${performance.now()}:${Math.random()}`;
  return `${e}:${r}:${t.profileId ?? t.id}:prism:${n}`;
}
class Kn extends Bn {
  constructor(t = {}) {
    super(t);
    g(this, "rollTotal");
    g(this, "dc");
    g(this, "profile");
    g(this, "tuning");
    g(this, "seed");
    g(this, "actorName");
    g(this, "onSuccess");
    g(this, "onFailure");
    g(this, "chatOnResult");
    g(this, "board");
    g(this, "state");
    g(this, "startedAt");
    g(this, "timer");
    g(this, "previousIceSlots");
    g(this, "resultMessage");
    this.rollTotal = Number(t.rollTotal ?? 15), this.dc = Number(t.dc ?? 15), this.profile = t.profile ? { ...t.profile } : W(this.rollTotal, this.dc), this.tuning = this.profile.prismLock ?? {}, this.seed = t.seed ?? Jn(this.rollTotal, this.dc, this.profile), this.actorName = String(t.actorName ?? "Hacker"), this.onSuccess = typeof t.onSuccess == "function" ? t.onSuccess : null, this.onFailure = typeof t.onFailure == "function" ? t.onFailure : null, this.chatOnResult = t.chatOnResult !== !1, this.board = Un(this.profile, this.seed), this.state = {
      rings: this.board.initialStates.map((n) => ({ ...n })),
      hasStarted: !1,
      isRunning: !1,
      result: null,
      traceProgress: 0,
      tracePenaltySeconds: 0,
      moves: 0
    }, this.startedAt = null, this.timer = null, this.previousIceSlots = new Set(U(this.board, this.state.rings).activeIceSlots);
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
      template: zn
    });
  }
  getData() {
    const t = U(this.board, this.state.rings), n = this.board.rings.map((i) => {
      const s = this.state.rings.find((o) => o.id === i.id) ?? {};
      return {
        ...i,
        rotation: s.rotation ?? 0,
        enabled: s.enabled !== !1,
        statusLabel: s.enabled === !1 ? "phased out" : "active"
      };
    });
    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      tuning: this.tuning,
      board: this.board,
      rings: n,
      evaluation: t,
      state: this.state,
      receiverPercent: Math.round(t.litReceiverCount / this.board.receiverCount * 100),
      resultTitle: this.state.result === "success" ? "Lattice Resolved" : "Prism Lock Rejected",
      resultDetail: this.resultMessage ?? (this.state.result === "success" ? "All authorization receptors illuminated." : "Trace completed before alignment."),
      glitchClass: this.profile.visualGlitchIntensity > 0.7 ? "glitch-high" : this.profile.visualGlitchIntensity > 0.35 ? "glitch-medium" : "glitch-low"
    };
  }
  activateListeners(t) {
    super.activateListeners(t), t.find("[data-action='rotate-ring']").on("click", (n) => {
      this.rotateRing(n.currentTarget.dataset.ringId, Number(n.currentTarget.dataset.direction));
    }), t.find("[data-action='toggle-ring']").on("click", (n) => this.toggleRing(n.currentTarget.dataset.ringId)), t.find("[data-action='start']").on("click", () => this.startRun()), t.find("[data-action='abort']").on("click", () => this.abort()), t.find("[data-action='close']").on("click", () => this.close()), this.syncDom();
  }
  async render(t, n) {
    const i = await super.render(t, n);
    return this.state.hasStarted && this.state.isRunning && this.startTimer(), i;
  }
  async close(t = {}) {
    return this.stopTimer(), super.close(t);
  }
  getTraceDuration() {
    const t = Number(game.settings.get(Ne, "traceDurationMultiplier") ?? 1) || 1;
    return Math.max(5, Number(this.tuning.traceDurationSeconds ?? this.profile.traceDurationSeconds ?? 60) * t);
  }
  startRun() {
    this.state.hasStarted || this.state.result || (this.state.hasStarted = !0, this.state.isRunning = !0, this.startedAt = performance.now(), this.previousIceSlots = new Set(U(this.board, this.state.rings).activeIceSlots), this.render(!1));
  }
  rotateRing(t, n) {
    !this.state.isRunning || !n || (this.state.rings = jn(this.state.rings, t, n, this.board.slotCount), this.state.moves += 1, this.evaluateMove());
  }
  toggleRing(t) {
    if (!this.state.isRunning) return;
    const n = this.board.rings.find((i) => i.id === t);
    n != null && n.switchable && (this.state.rings = this.state.rings.map((i) => i.id === t ? { ...i, enabled: !i.enabled } : { ...i }), this.state.moves += 1, this.evaluateMove());
  }
  evaluateMove() {
    var i, s;
    const t = U(this.board, this.state.rings), n = t.activeIceSlots.filter((o) => !this.previousIceSlots.has(o));
    if (this.previousIceSlots = new Set(t.activeIceSlots), n.length) {
      const o = Math.max(0, Number(this.tuning.icePenaltySeconds ?? 5)) * n.length;
      this.state.tracePenaltySeconds += o, o > 0 && ((s = (i = ui.notifications) == null ? void 0 : i.warn) == null || s.call(i, `ICE receptor energized. Trace jumped by ${o}s.`));
    }
    if (t.solved) {
      this.finish("success", "Authorization lattice resolved");
      return;
    }
    this.render(!1);
  }
  startTimer() {
    this.timer || !this.state.hasStarted || !this.startedAt || (this.timer = window.setInterval(() => {
      if (!this.state.isRunning || !this.startedAt) return;
      const t = (performance.now() - this.startedAt) / 1e3 + this.state.tracePenaltySeconds;
      this.state.traceProgress = Vn(t / this.getTraceDuration() * 100, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
    }, 120));
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  syncDom() {
    var s;
    const t = (s = this.element) == null ? void 0 : s[0];
    if (!t) return;
    const n = t.querySelector("[data-trace-fill]"), i = t.querySelector("[data-trace-text]");
    n && (n.style.width = `${this.state.traceProgress}%`), i && (i.textContent = `${Math.round(this.state.traceProgress)}%`);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(t, n, { close: i = !1 } = {}) {
    var c, a;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = t, this.stopTimer(), this.resultMessage = n, await this.render(!1);
    const s = U(this.board, this.state.rings), o = {
      type: "prism-lock",
      result: t,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      moves: this.state.moves,
      litReceiverCount: s.litReceiverCount,
      activeIceSlots: s.activeIceSlots,
      tracePenaltySeconds: this.state.tracePenaltySeconds,
      traceProgress: this.state.traceProgress
    };
    this.chatOnResult && await wt({
      title: "Prism Lock",
      result: t,
      actorName: this.actorName,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), t === "success" ? (c = this.onSuccess) == null || c.call(this, o) : (a = this.onFailure) == null || a.call(this, o), i && await this.close();
  }
}
const T = "holosuite-hacking", Ot = `module.${T}`, Xn = 10 * 60 * 1e3;
let x = null, ht = null;
const yt = /* @__PURE__ */ new Map();
function Wn() {
  game.settings.register(T, "defaultDc", {
    name: "Default Hacking DC",
    hint: "Used by the GM launcher and API calls that omit a DC.",
    scope: "world",
    config: !0,
    type: Number,
    default: 15
  }), game.settings.register(T, "traceDurationMultiplier", {
    name: "Default Trace Duration Multiplier",
    hint: "Multiplies trace timers for all HoloSuite hacking minigames.",
    scope: "world",
    config: !0,
    type: Number,
    default: 1
  }), game.settings.register(T, "nodeTakeoverDurationSeconds", {
    name: "Node Takeover Duration Override",
    hint: "Optional fixed seconds for claiming a Node Intrusion node. Set to 0 to use the selected difficulty profile.",
    scope: "world",
    config: !0,
    type: Number,
    default: 0
  }), game.settings.registerMenu(T, "difficultyProfilesMenu", {
    name: "Difficulty Profiles",
    label: "Configure Profiles",
    hint: "Tune Node Intrusion, Signal Alignment, Packet Switchboard, and Prism Lock difficulty settings.",
    icon: "fas fa-sliders",
    type: sn,
    restricted: !0
  }), game.settings.register(T, "difficultyProfileOverrides", {
    name: "Difficulty Profile Data",
    hint: "Internal storage for the Difficulty Profiles configuration menu.",
    scope: "world",
    config: !1,
    type: String,
    default: ""
  }), game.settings.register(T, "allowPlayerInteraction", {
    name: "Allow Players To Interact Directly",
    hint: "Reserved for future player-targeted play. The GM launcher remains GM-only for now.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(T, "visualGlitchIntensity", {
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
function Yn() {
  ot({
    id: "node-intrusion",
    title: "Node Intrusion",
    icon: "fa-solid fa-network-wired",
    create: (e) => new Cn(e)
  }), ot({
    id: "signal-alignment",
    title: "Signal Alignment",
    icon: "fa-solid fa-wave-square",
    create: (e) => new Tn(e)
  }), ot({
    id: "packet-switchboard",
    title: "Packet Switchboard",
    icon: "fa-solid fa-shuffle",
    create: (e) => new En(e)
  }), ot({
    id: "prism-lock",
    title: "Prism Lock",
    icon: "fa-solid fa-bullseye",
    create: (e) => new Kn(e)
  });
}
function Te() {
  var e, r, t;
  return (e = game.user) != null && e.isGM ? (ht = ht ?? new Xe({ api: x }), ht.render(!0), ht) : ((t = (r = ui.notifications) == null ? void 0 : r.warn) == null || t.call(r, "Only the GM can open HoloSuite Hacking."), null);
}
function Ae() {
  x = x ?? _e({ moduleId: T, openLauncher: Te }), x.sendHackToPlayer = Qn, x.registerWithHoloSuite = Nt;
  const e = game.modules.get(T);
  return e && (e.api = x), game.holosuiteHacking = x, x;
}
function Qn(e = {}) {
  var c, a, l, u, d, h, f;
  if (!((c = game.user) != null && c.isGM))
    return (l = (a = ui.notifications) == null ? void 0 : a.warn) == null || l.call(a, "Only the GM can send HoloSuite hacking challenges."), !1;
  if (!game.socket)
    return (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(u, "Foundry sockets are not available."), !1;
  const r = Re(e), t = Rt(r.userId), n = Ht(r.actorId, t);
  n ? t && !it(n, t) && console.warn(`${T} | ${t.name} does not appear to own ${n.name}; sending fallback roll data anyway.`) : console.warn(`${T} | Could not resolve hacker actor.`, {
    actorId: r.actorId,
    userId: r.userId,
    availableUsers: At().map((m) => ({ id: m.id, name: m.name, isGM: m.isGM })),
    userCharacter: nt(t),
    ownedActors: Dt(t).map((m) => ({ id: m.id, name: m.name }))
  });
  const i = me(n, r.skillId), s = r.skillLabel || bt(r.skillId, i), o = Number.isFinite(Number(r.skillModifier)) && Number(r.skillModifier) !== 0 ? Number(r.skillModifier) : xt(i);
  if (typeof e.onSuccess == "function" || typeof e.onFailure == "function") {
    const m = window.setTimeout(() => yt.delete(r.requestId), Xn);
    yt.set(r.requestId, {
      onSuccess: typeof e.onSuccess == "function" ? e.onSuccess : null,
      onFailure: typeof e.onFailure == "function" ? e.onFailure : null,
      timeoutId: m
    });
  }
  return game.socket.emit(Ot, {
    type: "launch-request",
    payload: {
      ...r,
      actorId: (n == null ? void 0 : n.id) ?? "",
      actorName: (n == null ? void 0 : n.name) ?? (t == null ? void 0 : t.name) ?? "Hacker",
      skillLabel: s,
      skillModifier: o,
      gmUserId: game.user.id
    }
  }), (f = (h = ui.notifications) == null ? void 0 : h.info) == null || f.call(h, `${vt(r.minigameType)} sent${t ? ` to ${t.name}` : " to players"}.`), !0;
}
function Zn(e) {
  var r, t, n, i;
  try {
    if ((e == null ? void 0 : e.type) === "result-report") {
      ii(e.payload ?? {});
      return;
    }
    if ((e == null ? void 0 : e.type) !== "launch-request") return;
    const s = Re(e.payload ?? {});
    if (s.userId && s.userId !== ((r = game.user) == null ? void 0 : r.id) || !s.userId && ((t = game.user) != null && t.isGM)) return;
    const o = Ht(s.actorId, Rt(s.userId) ?? game.user), c = s.actorName || (o == null ? void 0 : o.name) || "Intruder", a = s.skillLabel || bt(s.skillId, me(o, s.skillId));
    new Dialog({
      title: vt(s.minigameType),
      content: ri(s, c, a),
      buttons: {
        start: {
          icon: '<i class="fa-solid fa-terminal"></i>',
          label: "Accept and roll",
          callback: async () => ti(s)
        }
      },
      default: "start"
    }, {
      classes: ["holosuite-hacking-start-dialog"],
      width: 520,
      height: 320,
      resizable: !0
    }).render(!0);
  } catch (s) {
    console.error(`${T} | Failed to handle hacking launch request.`, s), (i = (n = ui.notifications) == null ? void 0 : n.error) == null || i.call(n, "HoloSuite Hacking launch failed. See console for details.");
  }
}
async function ti(e) {
  const r = Ht(e.actorId, Rt(e.userId) ?? game.user), t = await ei(e);
  if (!Number.isFinite(t == null ? void 0 : t.total)) return null;
  const n = {
    rollTotal: t.total,
    naturalRoll: t.naturalRoll,
    dc: e.dc,
    actorId: e.actorId,
    actorName: (r == null ? void 0 : r.name) ?? e.actorName ?? "Hacker",
    userId: e.userId,
    skillId: e.skillId,
    onSuccess: (i) => he(e, i),
    onFailure: (i) => he(e, i)
  };
  return x.startHack({ ...n, type: e.minigameType });
}
async function ei(e) {
  var r, t;
  try {
    const n = Number(e.skillModifier ?? 0), i = `1d20 ${n >= 0 ? "+" : "-"} ${Math.abs(n)}`, s = await new Roll(i).evaluate({ async: !0 });
    return await s.toMessage({
      speaker: ChatMessage.getSpeaker(),
      flavor: `${H(vt(e.minigameType))}: ${H(e.skillLabel || e.skillId || "Skill")} vs DC ${Number(e.dc)}`
    }), {
      total: Number(s.total),
      naturalRoll: ni(s),
      roll: s
    };
  } catch (n) {
    return console.error(`${T} | Fallback skill roll failed.`, n), (t = (r = ui.notifications) == null ? void 0 : r.warn) == null || t.call(r, "HoloSuite Hacking skill check failed."), null;
  }
}
function ni(e) {
  var s, o, c, a, l;
  const t = ((e == null ? void 0 : e.dice) ?? ((o = (s = e == null ? void 0 : e.terms) == null ? void 0 : s.filter) == null ? void 0 : o.call(s, (u) => (u == null ? void 0 : u.faces) === 20)) ?? []).find((u) => Number(u == null ? void 0 : u.faces) === 20), n = (l = (a = (c = t == null ? void 0 : t.results) == null ? void 0 : c.find) == null ? void 0 : a.call(c, (u) => !u.discarded && !u.rerolled)) == null ? void 0 : l.result, i = Number(n);
  return Number.isFinite(i) ? i : null;
}
function he(e, r) {
  var t, n;
  (n = (t = game.socket) == null ? void 0 : t.emit) == null || n.call(t, Ot, {
    type: "result-report",
    payload: {
      requestId: e.requestId,
      gmUserId: e.gmUserId,
      result: r
    }
  });
}
function ii(e = {}) {
  var n, i, s;
  if (!((n = game.user) != null && n.isGM) || e.gmUserId !== game.user.id) return;
  const r = yt.get(e.requestId);
  yt.delete(e.requestId), r != null && r.timeoutId && window.clearTimeout(r.timeoutId);
  const t = e.result ?? {};
  t.result === "success" ? (i = r == null ? void 0 : r.onSuccess) == null || i.call(r, t) : (s = r == null ? void 0 : r.onFailure) == null || s.call(r, t);
}
function ri(e, r, t) {
  return `
    <section class="holosuite-hacking-start-prompt">
      <p>Incoming hacking challenge</p>
      <h2>${H(vt(e.minigameType))}</h2>
      <div>${H(r)} rolls ${H(t)} vs DC ${Number(e.dc)}</div>
    </section>
  `;
}
function Re(e = {}) {
  const r = Number(game.settings.get(T, "defaultDc") ?? 15);
  return {
    requestId: String(e.requestId ?? foundry.utils.randomID()),
    minigameType: String(e.minigameType ?? e.type ?? "node-intrusion"),
    userId: String(e.userId ?? ""),
    actorId: String(e.actorId ?? ""),
    actorName: String(e.actorName ?? ""),
    skillId: String(e.skillId ?? ""),
    skillLabel: String(e.skillLabel ?? ""),
    skillModifier: Number(e.skillModifier ?? 0),
    dc: Number(e.dc ?? r),
    gmUserId: String(e.gmUserId ?? "")
  };
}
function Ht(e, r) {
  const t = K(e);
  if (t) return t;
  const n = nt(r);
  if (n) return n;
  const i = Dt(r);
  if (i.length === 1) return i[0];
  const s = qe();
  return s && it(s, r) ? s : null;
}
function vt(e) {
  var r, t;
  return ((t = (r = x == null ? void 0 : x.getMinigames) == null ? void 0 : r.call(x).find((n) => n.id === e)) == null ? void 0 : t.title) ?? String(e ?? "Hacking");
}
function Nt() {
  var r, t;
  const e = ((r = game.modules.get("holosuite-core")) == null ? void 0 : r.api) ?? game.holosuite;
  return typeof (e == null ? void 0 : e.registerApp) != "function" ? !1 : ((t = e.unregisterApp) == null || t.call(e, "node-intrusion"), e.registerApp({
    id: T,
    title: "HoloSuite Hacking",
    icon: "fa-solid fa-terminal",
    premium: !1,
    featureId: T,
    playerVisible: !1,
    description: "Reusable hacking minigames for terminals, traces, and signal puzzles.",
    open: () => Te()
  }), !0);
}
Hooks.once("init", () => {
  Wn(), Yn(), Ae();
});
Hooks.once("ready", () => {
  var e, r;
  Ae(), (r = (e = game.socket) == null ? void 0 : e.on) == null || r.call(e, Ot, Zn), Nt(), window.setTimeout(() => Nt(), 500), console.log(`${T} | Ready. API available at game.modules.get("${T}").api`);
});
