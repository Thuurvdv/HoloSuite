var oi = Object.defineProperty;
var ai = (t, n, e) => n in t ? oi(t, n, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[n] = e;
var p = (t, n, e) => ai(t, typeof n != "symbol" ? n + "" : n, e);
const ci = [4, 6, 8, 10, 12, 20, 100];
function Et(t = 20) {
  var s, r, o;
  const n = Ze(t), e = /* @__PURE__ */ new Set([...ci, n]), i = ((o = (r = (s = globalThis.CONFIG) == null ? void 0 : s.Dice) == null ? void 0 : r.fulfillment) == null ? void 0 : o.dice) ?? {};
  for (const a of Object.keys(i)) {
    const c = /^d([1-9]\d*)$/i.exec(a);
    if (!c) continue;
    const u = Number(c[1]);
    u >= 2 && u <= 1e4 && e.add(u);
  }
  return [...e].sort((a, c) => a - c).map((a) => ({ value: a, label: `d${a}`, selected: a === n }));
}
function Ze(t) {
  const n = Number(t);
  return Number.isInteger(n) && n >= 2 && n <= 1e4 ? n : 20;
}
function qt(t) {
  return t === "low" ? "low" : "high";
}
function wt(t, n = 20) {
  var i;
  const e = (t == null ? void 0 : t.dice) ?? (t == null ? void 0 : t.terms) ?? [];
  for (const s of e) {
    if (Number((s == null ? void 0 : s.faces) ?? (s == null ? void 0 : s._faces)) !== n) continue;
    const r = (i = s.results) == null ? void 0 : i.find((a) => a.active !== !1 && !a.discarded && !a.rerolled), o = Number((r == null ? void 0 : r.result) ?? (r == null ? void 0 : r.value));
    if (Number.isInteger(o) && o >= 1 && o <= n) return o;
  }
  return null;
}
const D = {
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
function J(t) {
  return {
    ...t,
    ...t.nodeIntrusion,
    ...t.signalAlignment,
    ...t.packetSwitchboard,
    ...t.prismLock,
    allowMainPathFirewalls: t.nodeIntrusion.allowFirewallOnMainPath
  };
}
function we(t) {
  if (t == null || t === "") return null;
  if (typeof t != "string" || !Object.hasOwn(D, t)) throw new Error("Choose a valid Quick Hack outcome.");
  return t;
}
function Y(t = 0, n = 10, e = null, i = {}) {
  const s = we(i.quickOutcome);
  if (s) return J(D[s]);
  if (["system", "sheet"].includes(i.rollSource) && Object.hasOwn(D, i.systemOutcome ?? ""))
    return J(D[i.systemOutcome]);
  const r = Number(t) || 0, o = Number.isFinite(Number(n)) ? Number(n) : 10, a = Number(e), c = Ze(i.dieSides), u = qt(i.rollDirection) === "low", l = u ? o - r : r - o;
  return a === (u ? c : 1) ? J(D.critical_failure) : a === (u ? 1 : c) ? J(D.critical_success) : l <= -10 ? J(D.critical_failure) : l >= 10 ? J(D.critical_success) : l >= 5 ? J(D.strong_success) : l >= 0 ? J(D.success) : J(D.failure_but_playable);
}
const et = /* @__PURE__ */ new Map(), pe = /* @__PURE__ */ new Map();
function Me(t) {
  const n = String((t == null ? void 0 : t.id) ?? "").trim();
  if (!n || typeof (t == null ? void 0 : t.create) != "function")
    throw new Error("HoloSuite Hacking minigames require an id and create(options) function.");
  et.set(n, {
    title: String(t.title ?? n),
    icon: String(t.icon ?? "fa-solid fa-terminal"),
    ...t,
    id: n
  });
}
function li(t) {
  return et.get(String(t ?? ""));
}
function kt() {
  return [...et.values()];
}
function di(t, n = {}) {
  var a, c, u, l;
  const e = li(t);
  if (!e)
    return (c = (a = ui.notifications) == null ? void 0 : a.warn) == null || c.call(a, `Unknown HoloSuite hacking minigame: ${t}`), null;
  const i = String(n.liveSessionId ?? ""), s = n.readOnly && i ? `${e.id}:spectator:${i}` : e.id;
  (l = (u = pe.get(s)) == null ? void 0 : u.close) == null || l.call(u);
  const r = e.create(n), o = r.close.bind(r);
  return r.close = async (...d) => (pe.delete(s), o(...d)), pe.set(s, r), r.render(!0), r;
}
function hi(t) {
  return t ? pe.get(String(t)) ?? null : [...pe.values()].at(-1) ?? null;
}
function fi() {
  var o, a, c, u;
  const t = globalThis.game, n = t == null ? void 0 : t.system, e = (o = t == null ? void 0 : t.world) == null ? void 0 : o.system, i = (a = t == null ? void 0 : t.data) == null ? void 0 : a.system, r = [
    n == null ? void 0 : n.id,
    (c = n == null ? void 0 : n._source) == null ? void 0 : c.id,
    (u = n == null ? void 0 : n.data) == null ? void 0 : u.id,
    typeof n == "string" ? n : null,
    typeof e == "string" ? e : e == null ? void 0 : e.id,
    typeof i == "string" ? i : i == null ? void 0 : i.id
  ].find((l) => typeof l == "string" && l.trim());
  return String(r ?? "").trim().toLocaleLowerCase();
}
function Z(...t) {
  const n = fi();
  return !!n && t.some((e) => String(e).trim().toLocaleLowerCase() === n);
}
function V() {
  return Z("CoC7");
}
function $(t) {
  const n = document.createElement("div");
  return n.textContent = String(t ?? ""), n.innerHTML.replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function Je() {
  return tt().filter((n) => !n.isGM);
}
function tt() {
  var t;
  return Array.isArray(game.users) ? game.users : ((t = game.users) == null ? void 0 : t.contents) ?? [...game.users ?? []];
}
function it(t) {
  var e, i;
  const n = String(t ?? "");
  return ((i = (e = game.users) == null ? void 0 : e.get) == null ? void 0 : i.call(e, n)) ?? tt().find((s) => s.id === n) ?? null;
}
function je() {
  var t;
  return Array.isArray(game.actors) ? game.actors : ((t = game.actors) == null ? void 0 : t.contents) ?? [...game.actors ?? []];
}
function K(t) {
  var e, i;
  const n = String(t ?? "");
  return ((i = (e = game.actors) == null ? void 0 : e.get) == null ? void 0 : i.call(e, n)) ?? je().find((s) => s.id === n || s.uuid === n) ?? null;
}
function ce(t) {
  const n = t == null ? void 0 : t.character;
  return n ? typeof n == "string" ? K(n) : n : null;
}
function ee(t, n) {
  var s, r, o, a;
  if (!t || !n) return !1;
  if (t === ce(n) || (s = t.testUserPermission) != null && s.call(t, n, "OWNER")) return !0;
  const e = ((o = (r = globalThis.CONST) == null ? void 0 : r.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : o.OWNER) ?? 3, i = t.ownership ?? ((a = t.data) == null ? void 0 : a.permission) ?? {};
  return Number(i[n.id] ?? i.default ?? 0) >= e;
}
function mi() {
  var t, n, e;
  return ((e = (n = (t = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : t.controlled) == null ? void 0 : n[0]) == null ? void 0 : e.actor) ?? null;
}
function nt(t) {
  const n = ce(t) ? [ce(t)] : [], e = je().filter((s) => ee(s, t));
  return [...new Map([...n, ...e].filter(Boolean).map((s) => [s.id, s])).values()].sort((s, r) => s.name.localeCompare(r.name));
}
function Ct(t = "") {
  const n = Je(), e = n.find((s) => s.id === t);
  return (e ? nt(e) : je()).filter((s) => !e || ee(s, e)).map((s) => ({
    id: s.id,
    name: s.name,
    owners: n.filter((r) => ee(s, r))
  })).sort((s, r) => s.name.localeCompare(r.name));
}
const gi = {
  acr: "Acrobatics",
  ani: "Animal Handling",
  arc: "Arcana",
  ath: "Athletics",
  com: "Computers",
  cmp: "Computers",
  comp: "Computers",
  computer: "Computers",
  computers: "Computers",
  dec: "Deception",
  eng: "Engineering",
  hack: "Hacking",
  hak: "Hacking",
  hacking: "Hacking",
  his: "History",
  ins: "Insight",
  int: "Intelligence",
  itm: "Intimidation",
  inv: "Investigation",
  lor: "Lore",
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
  tec: "Technology",
  technology: "Technology"
};
function Ee(t) {
  const n = st(t);
  if (n && typeof n == "object") {
    const e = Object.entries(n).map(([i, s]) => ({
      id: le(s) ? pi(s, Object.values(n)) : i,
      name: ke(i, s),
      label: Si(i, s),
      modifier: Ce(s)
    }));
    if (e.length) return e.sort((i, s) => i.label.localeCompare(s.label));
  }
  return [];
}
function Oe() {
  return "HoloSuite couldn't find skills for the selected character in this system. Choose Roll from character sheet, roll normally, and click Use for hacking on the chat result. Or choose Custom dice roll under Roll source and enter modifiers in Static modifier. If the character has skills, report this to magetowerfoundry@gmail.com so support can be added in an update. Include the system name/version, Foundry and HoloSuite module versions.";
}
function te(t, n) {
  var e;
  return ((e = st(t)) == null ? void 0 : e[qe(t, n)]) ?? null;
}
function st(t) {
  var s, r;
  const n = Z("pf2e", "sf2e") ? (t == null ? void 0 : t.skills) ?? ((s = t == null ? void 0 : t.system) == null ? void 0 : s.skills) : (r = t == null ? void 0 : t.system) == null ? void 0 : r.skills;
  if (!Z("CoC7", "cyberpunk-red-core") && n && Object.keys(n).length) return n;
  const e = t == null ? void 0 : t.items, i = Array.isArray(e) ? e : (e == null ? void 0 : e.contents) ?? (e != null && e.values ? [...e.values()] : []);
  return Object.fromEntries(i.filter((o) => le(o) && o.id && o.name).map((o) => [o.id, o]));
}
function le(t) {
  return (t == null ? void 0 : t.type) === "skill" && t.system && typeof t.system == "object";
}
function pi(t, n) {
  var i, s, r;
  const e = V() ? (r = (s = (i = t.flags) == null ? void 0 : i.CoC7) == null ? void 0 : s.cocidFlag) == null ? void 0 : r.id : null;
  return typeof e == "string" && e && n.filter((o) => {
    var a, c, u;
    return ((u = (c = (a = o.flags) == null ? void 0 : a.CoC7) == null ? void 0 : c.cocidFlag) == null ? void 0 : u.id) === e;
  }).length === 1 ? e : n.filter((o) => o.name === t.name).length === 1 ? t.name : t.id;
}
function yi(t) {
  if (!V() || !le(t)) return null;
  const i = (Number.parseInt(String(game.system.version ?? "0"), 10) >= 8 ? [t.system.value] : [t.value, t.system.value]).find(rt);
  return i === void 0 ? null : Number(i);
}
function qe(t, n) {
  var u, l;
  const e = String(n ?? "").trim(), i = st(t) ?? {};
  if (Object.hasOwn(i, e)) return e;
  const s = e.toLocaleLowerCase(), r = Z("cyberpunk-red-core") ? (l = (u = t == null ? void 0 : t.system) == null ? void 0 : u.skills) == null ? void 0 : l[e] : null, o = (r == null ? void 0 : r.id) ?? (r == null ? void 0 : r._id), a = String((r == null ? void 0 : r.name) ?? (r == null ? void 0 : r.label) ?? "").trim().toLocaleLowerCase(), c = Object.entries(i).filter(([d, h]) => {
    var f, m, S;
    return d.toLocaleLowerCase() === s || (h == null ? void 0 : h.uuid) === e || o && (h == null ? void 0 : h.id) === o || a && String((h == null ? void 0 : h.name) ?? "").trim().toLocaleLowerCase() === a || V() && ((S = (m = (f = h == null ? void 0 : h.flags) == null ? void 0 : f.CoC7) == null ? void 0 : m.cocidFlag) == null ? void 0 : S.id) === e || ke(d, h).toLocaleLowerCase() === s;
  });
  return c.length === 1 ? c[0][0] : e;
}
function ke(t, n) {
  var a, c, u, l, d, h;
  if (le(n)) return String(n.name ?? t);
  const e = (l = (u = (c = globalThis.CONFIG) == null ? void 0 : c[String(((a = game.system) == null ? void 0 : a.id) ?? "").toUpperCase()]) == null ? void 0 : u.skills) == null ? void 0 : l[t], i = typeof e == "string" ? e : (e == null ? void 0 : e.label) ?? (e == null ? void 0 : e.name), s = (n == null ? void 0 : n.label) ?? (n == null ? void 0 : n.name) ?? (n == null ? void 0 : n.localizedName) ?? i ?? t ?? "Skill", r = String(((h = (d = game.i18n) == null ? void 0 : d.localize) == null ? void 0 : h.call(d, s)) ?? s).trim(), o = r.toLowerCase().replace(/[^a-z0-9]/g, "");
  return String(gi[o] ?? r).replace(/[_-]/g, " ").replace(/\b\w/g, (f) => f.toUpperCase());
}
function Ce(t) {
  var s, r, o, a, c, u, l, d, h, f;
  if (le(t)) return 0;
  if (typeof t == "number") return t;
  if (!t || typeof t != "object") return 0;
  const e = [
    // Prefer the system's computed total; mod can be just the ability bonus.
    t == null ? void 0 : t.total,
    (s = t == null ? void 0 : t.total) == null ? void 0 : s.value,
    (r = t == null ? void 0 : t.check) == null ? void 0 : r.total,
    (o = t == null ? void 0 : t.check) == null ? void 0 : o.mod,
    (a = t == null ? void 0 : t.roll) == null ? void 0 : a.total,
    t == null ? void 0 : t.mod,
    (c = t == null ? void 0 : t.mod) == null ? void 0 : c.value,
    t == null ? void 0 : t.modifier,
    (u = t == null ? void 0 : t.modifier) == null ? void 0 : u.value,
    t == null ? void 0 : t.value,
    (l = t == null ? void 0 : t.value) == null ? void 0 : l.value,
    t == null ? void 0 : t.bonus,
    (d = t == null ? void 0 : t.bonus) == null ? void 0 : d.value,
    t == null ? void 0 : t.check,
    t == null ? void 0 : t.roll,
    (h = t == null ? void 0 : t.roll) == null ? void 0 : h.mod,
    t == null ? void 0 : t.rank,
    t == null ? void 0 : t.ranks
  ].find(rt);
  if (e !== void 0) return Number(e);
  const i = [];
  return Ht(t, i, 0), i.sort((m, S) => S.score - m.score), Number(((f = i[0]) == null ? void 0 : f.value) ?? 0);
}
function Si(t, n) {
  var r, o;
  const e = ke(t, n);
  if (((o = (r = game.settings) == null ? void 0 : r.get) == null ? void 0 : o.call(r, "holosuite-hacking", "showSkillModifiers")) !== !0) return e;
  if (le(n)) {
    const a = yi(n);
    return a === null ? e : `${e} (${a}%)`;
  }
  const i = Ce(n), s = i >= 0 ? "+" : "-";
  return `${e} (${s}${Math.abs(i)})`;
}
function rt(t) {
  return (typeof t == "number" || typeof t == "string" && t.trim() !== "") && Number.isFinite(Number(t));
}
function Ht(t, n, e, i = "") {
  if (!(!t || typeof t != "object" || e > 4))
    for (const [s, r] of Object.entries(t)) {
      const o = i ? `${i}.${s}` : s, a = Number(r);
      if (rt(r)) {
        const c = o.toLowerCase();
        let u = 1;
        /(total|mod|modifier|bonus|check|roll|value)$/.test(c) && (u += 6), /(dc|rank|ranks|proficient|prof|trained|ability|base|label|name)/.test(c) && (u -= 4), Math.abs(a) > 30 && (u -= 5), n.push({ value: a, score: u, path: o });
      } else r && typeof r == "object" && Ht(r, n, e + 1, o);
    }
}
async function bi() {
  var e, i, s;
  const t = "systems/cyberpunk-red-core/modules/chat/cpr-chat.js";
  return (await import(((s = (i = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : i.getRoute) == null ? void 0 : s.call(i, t)) ?? `/${t}`)).default;
}
async function vi(t, n, e, i = bi) {
  var u, l, d, h;
  if (!((u = game.user) != null && u.isGM) && !ee(t, game.user)) throw new Error("You must own the hacker character to roll its skills.");
  const s = te(t, n), r = ((d = (l = t.items) == null ? void 0 : l.get) == null ? void 0 : d.call(l, s == null ? void 0 : s.id)) ?? s;
  if ((r == null ? void 0 : r.type) !== "skill") throw new Error("The selected Cyberpunk RED skill is missing from this character. Choose one of the character's skill items.");
  if (typeof r.createRoll != "function" || typeof r.confirmRoll != "function")
    throw new Error("This Cyberpunk RED version does not provide the expected skill-roll methods. Use Roll from character sheet and report the system version to magetowerfoundry@gmail.com.");
  const o = await i();
  if (typeof (o == null ? void 0 : o.RenderRollCard) != "function") throw new Error("Cyberpunk RED's roll-card renderer is unavailable.");
  let a = r.createRoll("skill", t);
  if (typeof (a == null ? void 0 : a.handleRollDialog) != "function" || typeof (a == null ? void 0 : a.roll) != "function") throw new Error("Cyberpunk RED could not prepare this skill check.");
  if (!await a.handleRollDialog({ type: "macro", ctrlKey: !1, metaKey: !1 }, t, r) || (a = await r.confirmRoll(a), !a)) return null;
  if (await a.roll(), typeof a.resultTotal != "number" || !Number.isFinite(a.resultTotal)) throw new Error("Cyberpunk RED did not return a final skill-check total.");
  if (Number.isInteger(a.luck) && a.luck > 0) {
    const f = Number(t.system.stats.luck.value);
    await t.update({ "system.stats.luck.value": Math.max(0, f - a.luck) });
  }
  a.entityData = { actor: t.id, token: t.isToken ? ((h = t.token) == null ? void 0 : h.id) ?? null : null, item: r.id }, await o.RenderRollCard(a);
  const c = Y(a.resultTotal, e + 1, null, { dieSides: 10, rollDirection: "high" });
  return { total: a.resultTotal, systemOutcome: c.profileId, systemResult: a };
}
function ye() {
  return Z("dnd5e", "pf2e", "sf2e", "CoC7", "cyberpunk-red-core");
}
async function wi(t, n, e = {}) {
  var o, a, c, u;
  if (!ye())
    throw new Error("System skill rolls are not supported by this system. Choose Roll from character sheet or Custom dice roll in the Hacking launcher.");
  if (!t || !n) throw new Error("Choose a hacker character and one of its skills before using System skill roll.");
  if (V()) return ki(t, n);
  const i = Number(e.dc ?? game.settings.get("holosuite-hacking", "defaultDc") ?? 15);
  if (!Number.isFinite(i)) throw new Error("The hacking DC must be a finite number.");
  if (Z("cyberpunk-red-core")) return vi(t, n, i);
  let s;
  if (Z("pf2e", "sf2e")) {
    const l = ((o = t.getStatistic) == null ? void 0 : o.call(t, n)) ?? ((a = t.skills) == null ? void 0 : a[n]);
    if (typeof ((c = l == null ? void 0 : l.check) == null ? void 0 : c.roll) != "function") throw new Error("This character does not have the selected system skill.");
    s = await l.check.roll({ dc: { value: i }, skipDialog: !1, createMessage: !0 });
  } else {
    if (typeof t.rollSkill != "function" || !Object.hasOwn(((u = t.system) == null ? void 0 : u.skills) ?? {}, n))
      throw new Error("This character does not have the selected system skill.");
    const [l, d] = String(game.system.version ?? "").split(".").map((h) => Number.parseInt(h, 10));
    if (!Number.isFinite(l)) throw new Error("Cannot determine the system skill-roll API version. Choose Custom dice roll.");
    l > 4 || l === 4 && d >= 1 ? s = await t.rollSkill({ skill: n, target: i }, { configure: !0 }, {
      create: !0,
      data: { flavor: e.flavor ?? "HoloSuite Hacking" }
    }) : s = await t.rollSkill(n, { targetValue: i, fastForward: !1, chatMessage: !0, flavor: e.flavor });
  }
  if (s == null || s === !1 || Array.isArray(s) && !s.length) return null;
  const r = Array.isArray(s) ? s[0] : s;
  if (typeof (r == null ? void 0 : r.total) != "number" || !Number.isFinite(r.total))
    throw new Error("The system did not return an evaluated skill roll.");
  return r;
}
async function ki(t, n) {
  const e = te(t, n);
  if ((e == null ? void 0 : e.type) !== "skill") throw new Error("This character does not have the selected CoC7 skill.");
  if (typeof t.runRoll != "function") throw new Error("This CoC7 version does not expose native skill checks. Update CoC7 or choose Custom dice roll.");
  const i = await t.runRoll({
    skillId: e.id,
    fastForward: !1,
    chatMessage: !0,
    preventStandby: !0,
    forcedCardType: !0,
    cardTypeFixed: !0
  });
  if (i == null || i === !1) return null;
  const s = i.result, r = i.successLevel;
  if (typeof s != "number" || !Number.isFinite(s) || ![-99, -1, 0, 1, 2, 3, 4].includes(r) || typeof i.passed != "boolean") throw new Error("CoC7 did not return an evaluated skill check.");
  const o = i.isFumble || r < 0 ? "critical_failure" : i.isCritical || r === 4 ? "critical_success" : i.passed ? r >= 3 ? "critical_success" : r === 2 ? "strong_success" : "success" : "failure_but_playable";
  return { total: s, systemOutcome: o, systemResult: i };
}
function Ci(t) {
  var i;
  const n = Array.isArray(t.rolls) ? t.rolls : [];
  if (n.length) return n;
  if (((i = game.system) == null ? void 0 : i.id) !== "cyberpunk-red-core" || typeof t.content != "string") return [];
  const e = document.createElement("template");
  return e.innerHTML = t.content, [...e.content.querySelectorAll('.rollcard .d10-rollcard-data .d10-number-div [data-action="toggleVisibility"][data-visible-element="d10-data-details"]')].flatMap((s) => {
    var a;
    const r = ((a = s.textContent) == null ? void 0 : a.trim()) ?? "";
    if (!/^[+-]?\d+(?:\.\d+)?$/.test(r)) return [];
    const o = Number(r);
    return Number.isFinite(o) ? [{ total: o, formula: "Final result" }] : [];
  });
}
function Ii(t, n) {
  var a, c, u, l, d, h, f;
  const e = ((a = t == null ? void 0 : t.author) == null ? void 0 : a.id) ?? ((c = t == null ? void 0 : t.user) == null ? void 0 : c.id) ?? (t == null ? void 0 : t.user);
  if (!((u = game.user) != null && u.id) || e !== game.user.id || !(t != null && t.id)) return [];
  if (t.visible === !1 || t.isContentVisible === !1 || t.blind && !game.user.isGM) return [];
  const i = t.speaker ?? {}, s = ((l = i.actor) == null ? void 0 : l.id) ?? i.actor;
  if (n && s && s !== n.id) return [];
  if (n != null && n.isToken && i.token && i.token !== ((d = n.token) == null ? void 0 : d.id)) return [];
  if (n != null && n.isToken && i.scene && ((f = (h = n.token) == null ? void 0 : h.parent) != null && f.id) && i.scene !== n.token.parent.id) return [];
  const r = Ci(t), o = String(t.flavor || "Sheet roll").replace(/<[^>]*>/g, "").slice(0, 100);
  return r.flatMap((m, S) => (m == null ? void 0 : m._evaluated) === !1 || (m == null ? void 0 : m.evaluated) === !1 || typeof (m == null ? void 0 : m.total) != "number" || !Number.isFinite(m.total) ? [] : [{
    id: `${t.id}:${S}`,
    messageId: t.id,
    rollIndex: S,
    total: m.total,
    label: `${o} — ${String(m.formula ?? "Roll").slice(0, 80)} = ${m.total}${i.actor ? "" : " (actor not specified)"}`
  }]);
}
function Mi(t, n) {
  const e = /* @__PURE__ */ new Map();
  let i = !1;
  const s = () => [...e.values()].flatMap((l) => Ii(l, t)), r = () => {
    i || n(s());
  }, u = [["createChatMessage", (l) => {
    var h, f, m;
    i || (((h = l == null ? void 0 : l.author) == null ? void 0 : h.id) ?? ((f = l == null ? void 0 : l.user) == null ? void 0 : f.id) ?? (l == null ? void 0 : l.user)) !== ((m = game.user) == null ? void 0 : m.id) || !(l != null && l.id) || (e.set(l.id, l), e.size > 50 && e.delete(e.keys().next().value), r());
  }], ["updateChatMessage", (l) => {
    !i && e.has(l.id) && (e.set(l.id, l), r());
  }], ["deleteChatMessage", (l) => {
    e.delete(l.id) && r();
  }]];
  for (const [l, d] of u) Hooks.on(l, d);
  return {
    candidates: s,
    dispose() {
      i = !0;
      for (const [l, d] of u) Hooks.off(l, d);
      e.clear();
    }
  };
}
function It(t, n) {
  const e = (n == null ? void 0 : n.total) ?? (typeof t == "string" && t.trim() ? Number(t) : typeof t == "number" ? t : NaN);
  if (!Number.isFinite(e)) throw new Error("Enter the final total shown by your system.");
  return {
    total: e,
    naturalRoll: null,
    systemOutcome: void 0,
    sheetMessageId: n == null ? void 0 : n.messageId,
    sheetRollIndex: n == null ? void 0 : n.rollIndex,
    roll: null
  };
}
let ze = !1;
function Pi(t, n = {}) {
  if (!t) throw new Error("Choose a hacker character before using Roll from character sheet.");
  const e = () => {
    var i;
    return ((i = game.user) == null ? void 0 : i.isGM) || ee(t, game.user);
  };
  if (!e()) throw new Error("You must own the hacker character to use its sheet roll.");
  if (ze) throw new Error("Finish or cancel the pending character-sheet roll first.");
  return ze = !0, new Promise((i) => {
    var w, v, I, P, T;
    let s = !1, r, o;
    const a = /* @__PURE__ */ new Map(), u = Number(((w = game.release) == null ? void 0 : w.generation) ?? String(game.version ?? "12").split(".")[0]) >= 13 ? "renderChatMessageHTML" : "renderChatMessage", l = (g) => g.querySelectorAll(".hh-chat-roll-actions").forEach((y) => y.remove()), d = (g) => {
      if (!s) {
        s = !0, o == null || o.dispose(), Hooks.off(u, S);
        for (const y of a.values()) for (const k of y) l(k);
        a.clear(), r == null || r.remove(), ze = !1, i(g);
      }
    }, h = (g) => {
      var k, N;
      if (s) return;
      if (!e()) {
        d(null);
        return;
      }
      const y = o.candidates().find((M) => M.id === g);
      if (!y) {
        m(), (N = (k = ui.notifications) == null ? void 0 : k.warn) == null || N.call(k, "That roll is no longer available. Use a new, visible roll.");
        return;
      }
      d(It(void 0, y));
    }, f = (g, y) => {
      if (l(g), s || !y.length) return;
      const k = document.createElement("div");
      k.className = "hh-chat-roll-actions";
      for (const N of y) {
        const M = document.createElement("button");
        M.type = "button", M.textContent = `Use for hacking · ${N.total}${y.length > 1 ? ` (roll ${N.rollIndex + 1})` : ""}`, M.setAttribute("aria-label", `Use for hacking: ${N.label}`), M.addEventListener("click", (O) => {
          O.preventDefault(), O.stopPropagation(), h(N.id);
        }), k.appendChild(M);
      }
      (g.querySelector(".message-content") ?? g).appendChild(k);
    }, m = () => {
      if (s || !o) return;
      const g = o.candidates();
      for (const [y, k] of a) for (const N of k) f(N, g.filter((M) => M.messageId === y));
    }, S = (g, y) => {
      if (s || !(g != null && g.id)) return;
      const k = (y == null ? void 0 : y[0]) ?? y;
      if (!(k != null && k.querySelectorAll)) return;
      a.has(g.id) || a.set(g.id, /* @__PURE__ */ new Set());
      const N = a.get(g.id);
      for (const M of N) M.isConnected || (l(M), N.delete(M));
      if (N.add(k), a.size > 100) {
        const M = a.keys().next().value;
        for (const O of a.get(M)) l(O);
        a.delete(M);
      }
      f(k, (o == null ? void 0 : o.candidates().filter((M) => M.messageId === g.id)) ?? []);
    }, b = async () => {
      var g, y, k;
      try {
        if (typeof ((g = t.sheet) == null ? void 0 : g.render) != "function") throw new Error();
        await t.sheet.render(!0);
      } catch {
        (k = (y = ui.notifications) == null ? void 0 : y.warn) == null || k.call(y, "Open your character sheet manually, then roll and click Use for hacking in chat.");
      }
    };
    try {
      o = Mi(t, m), Hooks.on(u, S);
      const g = te(t, n.skillId), y = n.skillLabel || (g ? ke(n.skillId, g) : "the requested skill");
      r = document.createElement("section"), r.className = "hh-sheet-waiting", r.setAttribute("aria-label", "Pending hacking check"), r.innerHTML = `<p role="status"><strong>${$(t.name)} · Hacking check</strong><br>Roll ${$(y)} on your sheet, then click <strong>Use for hacking</strong> on your new chat roll.</p>
        <p class="hh-sheet-hint">DC ${Number(n.dc ?? 15)} · ${n.rollDirection === "low" ? "Low" : "High"} rolls are positive. Use the final skill-check total.</p>
        <div class="hh-sheet-waiting-actions"><button type="button" data-open-sheet>Open sheet</button><button type="button" data-cancel-sheet>Cancel hack</button></div>
        <details><summary>Can't use your chat roll?</summary><p>For cards without a readable result, enter the final total or number of successes. No modifiers are added.</p>
          <form><label>Final total<input type="number" name="sheetTotal" step="any" required></label><button type="submit">Use for hacking</button></form>
        </details>`, r.querySelector("[data-open-sheet]").addEventListener("click", b), r.querySelector("[data-cancel-sheet]").addEventListener("click", () => d(null)), r.querySelector("form").addEventListener("submit", (k) => {
        if (k.preventDefault(), s) return;
        if (!e()) {
          d(null);
          return;
        }
        const N = r.querySelector("[name='sheetTotal']");
        N.reportValidity() && d(It(N.value));
      }), document.body.appendChild(r), (I = (v = ui.sidebar) == null ? void 0 : v.activateTab) == null || I.call(v, "chat"), b();
    } catch (g) {
      d(null), (T = (P = ui.notifications) == null ? void 0 : P.warn) == null || T.call(P, `Could not start the sheet-roll check: ${g.message}`);
    }
  });
}
const ne = "holosuite-hacking";
function Ft() {
  return ye() ? "system" : "sheet";
}
function B(t = {}) {
  const n = t.rollSource ?? game.settings.get(ne, "defaultRollSource");
  return {
    rollSource: n === "system" || n === "custom" || n === "sheet" ? n : Ft(),
    staticModifier: Ni(t.staticModifier ?? game.settings.get(ne, "defaultStaticModifier")),
    diceCount: Li(t.diceCount ?? game.settings.get(ne, "defaultDiceCount")),
    keepResult: (t.keepResult ?? game.settings.get(ne, "defaultKeepResult")) === "worst" ? "worst" : "best",
    dieSides: Ze(t.dieSides ?? game.settings.get(ne, "defaultDieSides") ?? (V() ? 100 : 20)),
    rollDirection: qt(t.rollDirection ?? game.settings.get(ne, "defaultRollDirection") ?? (V() ? "low" : "high"))
  };
}
function Ni(t) {
  const n = Number(t ?? 0);
  if (!Number.isFinite(n)) throw new Error("The static modifier must be a finite number.");
  return n;
}
function Li(t) {
  const n = Number(t);
  return Number.isInteger(n) && n >= 1 && n <= 10 ? n : 1;
}
function Ti(t, n = 0) {
  const e = B(t), i = e.rollDirection === "high" == (e.keepResult === "best"), s = e.diceCount > 1 ? i ? "kh1" : "kl1" : "";
  return `${e.diceCount}d${e.dieSides}${s} ${n >= 0 ? "+" : "-"} ${Math.abs(n)}`;
}
async function Ke(t = {}) {
  var n, e;
  try {
    const i = B(t), s = t.actor ?? K(t.actorId), r = qe(s, t.skillId ?? t.skill);
    if (i.rollSource === "sheet") {
      const d = await Pi(s, { ...t, ...i, skillId: r });
      return d ? { ...i, ...d } : null;
    }
    if (i.rollSource === "system") {
      const d = await wi(s, r, t);
      return d ? V() ? {
        ...i,
        dieSides: 100,
        rollDirection: "low",
        total: d.total,
        naturalRoll: null,
        systemOutcome: d.systemOutcome,
        roll: d
      } : Z("cyberpunk-red-core") ? {
        ...i,
        dieSides: 10,
        rollDirection: "high",
        total: d.total,
        naturalRoll: null,
        systemOutcome: d.systemOutcome,
        roll: d
      } : { ...i, dieSides: 20, total: d.total, naturalRoll: wt(d, 20), systemOutcome: void 0, roll: d } : null;
    }
    const o = te(s, r), c = (o != null ? Ce(o) : Number(t.skillModifier ?? 0)) + i.staticModifier;
    if (!Number.isFinite(c)) throw new Error("The skill modifier must be a finite number.");
    const u = Ti(i, c), l = await new Roll(u).evaluate({ async: !0 });
    return await l.toMessage({
      speaker: ChatMessage.getSpeaker(s ? { actor: s } : void 0),
      flavor: t.flavor ?? "HoloSuite Hacking"
    }), { total: Number(l.total), naturalRoll: wt(l, i.dieSides), systemOutcome: void 0, roll: l, ...i };
  } catch (i) {
    return console.error(`${ne} | Skill check failed.`, i), (e = (n = ui.notifications) == null ? void 0 : n.warn) == null || e.call(n, `HoloSuite Hacking: ${i instanceof Error ? i.message : "Skill check failed."}`), null;
  }
}
function He(t = {}) {
  if (t.version != null && t.version !== 1) throw new Error("Update HoloSuite Hacking to use this hack configuration.");
  if (t.version === 1 && (["minigameType", "skillId", "dc", "rollSource", "dieSides", "diceCount", "keepResult", "staticModifier", "rollDirection", "liveAudience", "quickOutcome"].some((o) => t[o] === void 0) || !["system", "sheet", "custom"].includes(t.rollSource)))
    throw new Error("This hack configuration is incomplete. Ask the GM to edit and save it again.");
  const n = we(t.quickOutcome), e = Number(t.dc ?? game.settings.get("holosuite-hacking", "defaultDc") ?? 15);
  if (!Number.isFinite(e)) throw new Error("Enter a valid difficulty.");
  const i = t.liveAudience ?? game.settings.get("holosuite-hacking", "defaultLiveAudience") ?? "everyone", s = B(t);
  return {
    version: 1,
    minigameType: String(t.minigameType ?? t.minigame ?? t.type ?? "node-intrusion"),
    skillId: String(t.skillId ?? t.skill ?? ""),
    skillLabel: String(t.skillLabel ?? t.skillId ?? t.skill ?? ""),
    dc: e,
    ...s,
    quickOutcome: n,
    liveAudience: ["everyone", "gm", "none"].includes(i) ? i : "everyone"
  };
}
function We() {
  const t = /* @__PURE__ */ new Map();
  for (const n of je())
    for (const e of Ee(n)) {
      const i = te(n, e.id);
      (i == null ? void 0 : i.type) === "skill" && e.id === i.id || t.has(e.id) || t.set(e.id, { ...e, label: e.name, modifier: 0 });
    }
  return [...t.values()].sort((n, e) => n.name.localeCompare(e.name));
}
function Ae(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function _t(t, n) {
  if (!Ae(n)) return t;
  const e = { ...t };
  for (const [i, s] of Object.entries(n))
    e[i] = Ae(s) && Ae(e[i]) ? _t(e[i], s) : s;
  return e;
}
function Ri(t) {
  var n;
  return {
    ...t,
    ...t.nodeIntrusion ?? {},
    ...t.signalAlignment ?? {},
    ...t.packetSwitchboard ?? {},
    ...t.prismLock ?? {},
    allowMainPathFirewalls: ((n = t.nodeIntrusion) == null ? void 0 : n.allowFirewallOnMainPath) ?? t.allowMainPathFirewalls
  };
}
function Oi(t) {
  var e, i;
  const n = String(game.settings.get(t, "difficultyProfileOverrides") ?? "").trim();
  if (!n) return {};
  try {
    const s = JSON.parse(n);
    return Ae(s) ? s : {};
  } catch (s) {
    return console.warn(`${t} | Difficulty profile overrides must be valid JSON.`, s), (i = (e = ui.notifications) == null ? void 0 : e.warn) == null || i.call(e, "HoloSuite Hacking difficulty profile overrides contain invalid JSON."), {};
  }
}
function Ai({ moduleId: t, openLauncher: n, openConfiguration: e, createLiveController: i }) {
  function s(l) {
    const d = String(l.profileId ?? l.id ?? ""), f = Oi(t)[d], m = Ri(_t(l, f)), S = Number(game.settings.get(t, "nodeTakeoverDurationSeconds") ?? 0);
    return Number.isFinite(S) && S > 0 ? {
      ...m,
      nodeIntrusion: {
        ...m.nodeIntrusion ?? {},
        claimDurationSeconds: S
      },
      claimDurationSeconds: S
    } : m;
  }
  function r(l) {
    const d = String(game.settings.get(t, "visualGlitchIntensity") ?? "medium"), h = Number(l.visualGlitchIntensity ?? 0.4), f = d === "low" ? Math.min(h, 0.25) : d === "high" ? Math.min(1, h + 0.2) : h;
    return { ...l, visualGlitchIntensity: f };
  }
  function o(l = {}) {
    var v;
    const d = we(l.quickOutcome);
    if (d) {
      const I = l.readOnly && ((v = l.profile) == null ? void 0 : v.profileId) === d ? l.profile : r(s(Y(null, null, null, { quickOutcome: d })));
      return { ...l, quickOutcome: d, rollSource: "gm", dc: null, rollTotal: null, naturalRoll: null, profile: I };
    }
    const h = Number(game.settings.get(t, "defaultDc") ?? 15), f = Number(l.dc ?? h), m = Number(l.rollTotal ?? f), S = l.naturalRoll === null || l.naturalRoll === void 0 ? null : Number(l.naturalRoll), b = B(l), w = r(s(l.profile ?? Y(m, f, S, { ...b, systemOutcome: l.systemOutcome })));
    return { ...l, ...b, dc: f, rollTotal: m, profile: w };
  }
  function a(l = {}) {
    const d = String(l.type ?? "node-intrusion");
    return di(d, o(l));
  }
  async function c(l, d = {}) {
    var v, I, P, T, g, y, k, N;
    let h;
    try {
      h = He(l);
    } catch (M) {
      return (I = (v = ui.notifications) == null ? void 0 : v.warn) == null || I.call(v, M.message), !1;
    }
    if (!kt().some((M) => M.id === h.minigameType))
      return (T = (P = ui.notifications) == null ? void 0 : P.warn) == null || T.call(P, "The configured hacking minigame is unavailable."), !1;
    const f = d.actor ?? K(d.actorId) ?? ce(game.user);
    if (!h.quickOutcome && (!f || !ee(f, game.user)))
      return (y = (g = ui.notifications) == null ? void 0 : g.warn) == null || y.call(g, "Choose a character you own before attempting this hack."), !1;
    const m = qe(f, h.skillId);
    if (!h.quickOutcome && h.rollSource !== "sheet" && h.skillId && !te(f, m))
      return (N = (k = ui.notifications) == null ? void 0 : k.warn) == null || N.call(k, `This character does not have the configured skill: ${h.skillLabel || h.skillId}.`), !1;
    const S = String(d.label ?? "Hacking challenge"), b = h.quickOutcome ? { total: null, naturalRoll: null, rollSource: "gm" } : await Ke({ ...h, actor: f, skillId: m, flavor: $(S) });
    if (!h.quickOutcome && !Number.isFinite(b == null ? void 0 : b.total)) return !1;
    const w = i == null ? void 0 : i(h);
    return new Promise((M) => {
      var j, F, A, E, G, de;
      let O = !1;
      const x = (_) => {
        O || (O = !0, M(_));
      };
      try {
        const _ = a({
          ...h,
          ...b,
          type: h.minigameType,
          rollTotal: b.total,
          skillId: m,
          actorId: (f == null ? void 0 : f.id) ?? "",
          actorName: (f == null ? void 0 : f.name) ?? ((j = game.user) == null ? void 0 : j.name) ?? "Hacker",
          userId: ((F = game.user) == null ? void 0 : F.id) ?? "",
          challengeName: S,
          targetName: S,
          onLiveState: w == null ? void 0 : w.publish,
          onLiveEnd: w == null ? void 0 : w.end,
          onSuccess: () => x(!0),
          onFailure: () => x(!1)
        });
        if (!_) {
          w == null || w.cancel(), x(!1);
          return;
        }
        const he = (A = _.close) == null ? void 0 : A.bind(_);
        he && (_.close = async (...Ie) => {
          try {
            return await he(...Ie);
          } finally {
            w == null || w.end(), x(!1);
          }
        }), w == null || w.start((E = _.getLiveSessionData) == null ? void 0 : E.call(_));
      } catch (_) {
        w == null || w.cancel(), (de = (G = ui.notifications) == null ? void 0 : G.warn) == null || de.call(G, `Could not start hacking: ${_.message}`), x(!1);
      }
    });
  }
  const u = {
    startHack: a,
    startNodeIntrusion: (l = {}) => a({ ...l, type: "node-intrusion" }),
    startSignalAlignment: (l = {}) => a({ ...l, type: "signal-alignment" }),
    startPacketSwitchboard: (l = {}) => a({ ...l, type: "packet-switchboard" }),
    startPrismLock: (l = {}) => a({ ...l, type: "prism-lock" }),
    openLauncher: n,
    createHackConfiguration: He,
    getConfigurationSkills: We,
    configureHack: (l = null, d = {}) => e(u, l, d),
    runConfiguredHack: c,
    getRollOptions: B,
    rollSkillCheck: Ke,
    supportsSystemSkillRoll: ye,
    getActorSkillOptions: Ee,
    getMissingSkillsWarning: Oe,
    getSkillData: te,
    getSkillModifier: Ce,
    resolveSkillId: qe,
    getDifficultyProfile: (l = 0, d = 10, h = null, f = {}) => r(s(Y(l, d, h, { ...B(f), systemOutcome: f.systemOutcome }))),
    difficultyProfiles: D,
    getMinigames: kt,
    getActiveApp: hi,
    testNodeIntrusion: () => u.startNodeIntrusion({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }),
    testSignalAlignment: () => u.startSignalAlignment({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }),
    testPacketSwitchboard: () => u.startPacketSwitchboard({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }),
    testPrismLock: () => u.startPrismLock({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    })
  };
  return u;
}
function Ut() {
  var t, n, e;
  return ((n = (t = globalThis.foundry) == null ? void 0 : t.applications) == null ? void 0 : n.api) ?? ((e = foundry == null ? void 0 : foundry.applications) == null ? void 0 : e.api) ?? null;
}
function jt() {
  var t, n, e;
  return ((n = (t = globalThis.foundry) == null ? void 0 : t.appv1) == null ? void 0 : n.api) ?? ((e = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : e.api) ?? null;
}
function Di(t = {}, n = {}) {
  var i, s, r;
  const e = ((s = (i = globalThis.foundry) == null ? void 0 : i.utils) == null ? void 0 : s.mergeObject) ?? ((r = foundry == null ? void 0 : foundry.utils) == null ? void 0 : r.mergeObject);
  return typeof e == "function" ? e(t, n, { inplace: !1 }) : { ...t, ...n };
}
function $i() {
  var t, n, e, i, s;
  return ((e = (n = (t = globalThis.foundry) == null ? void 0 : t.utils) == null ? void 0 : n.randomID) == null ? void 0 : e.call(n, 8)) ?? ((s = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.randomID) == null ? void 0 : s.call(i, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function Mt(t = {}) {
  return {
    id: String(t.id ?? `legacy-application-${$i()}`),
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
function Gt(t) {
  return class extends t {
    constructor(i = {}) {
      const s = Di(new.target.defaultOptions ?? {}, i);
      super(Mt(s));
      p(this, "_v1Options");
      this._v1Options = s;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return Mt(this.defaultOptions ?? {});
    }
    activateListeners(i) {
    }
    async _renderHTML(i, s) {
      var u, l, d;
      const r = typeof this.getData == "function" ? await this.getData() : {}, o = ((u = this._v1Options) == null ? void 0 : u.template) ?? ((l = this.options) == null ? void 0 : l.template) ?? ((d = this.constructor.defaultOptions) == null ? void 0 : d.template);
      if (!o) return document.createDocumentFragment();
      const a = await globalThis.renderTemplate(o, r), c = document.createElement("template");
      return c.innerHTML = a.trim(), c.content;
    }
    _activateV1Form(i) {
      var r, o;
      if (typeof this._updateObject != "function") return;
      const s = (r = i.matches) != null && r.call(i, "form") ? i : (o = i.querySelector) == null ? void 0 : o.call(i, "form");
      s instanceof HTMLFormElement && s.addEventListener("submit", async (a) => {
        var u;
        a.preventDefault(), a.stopPropagation();
        const c = new FormData(s);
        await this._updateObject(a, c), ((u = this._v1Options) == null ? void 0 : u.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(i, s, r) {
      var l, d, h, f;
      s.replaceChildren(i);
      const o = globalThis.jQuery ?? globalThis.$, a = ((l = s.closest) == null ? void 0 : l.call(s, ".window-app, .app, .application")) ?? s, c = o ? o(a) : a;
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
      const u = (d = this._v1Options) == null ? void 0 : d.classes;
      Array.isArray(u) && u.length && (s.classList.add(...u), (f = (h = s.closest) == null ? void 0 : h.call(s, ".window-app, .app, .application")) == null || f.classList.add(...u)), this._activateV1Form(s), typeof this.activateListeners == "function" && this.activateListeners(o ? o(s) : s);
    }
  };
}
function ue() {
  const t = Ut(), n = jt(), e = globalThis.Application ?? (n == null ? void 0 : n.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (n == null ? void 0 : n.FormApplication) ?? (t == null ? void 0 : t.FormApplication);
  if (e) return e;
  const i = t == null ? void 0 : t.ApplicationV2;
  return i ? Gt(i) : null;
}
function xi() {
  const t = Ut(), n = jt(), e = globalThis.FormApplication ?? (n == null ? void 0 : n.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? globalThis.Application ?? (n == null ? void 0 : n.Application) ?? (t == null ? void 0 : t.ApplicationV1);
  if (e) return e;
  const i = t == null ? void 0 : t.ApplicationV2;
  return i ? Gt(i) : ue();
}
function Pt(t, n) {
  if (!t || t.dataset.persistentTooltipBound) return;
  t.dataset.persistentTooltipBound = "true";
  let e = null;
  const i = () => {
    var u;
    if (e || !t.isConnected || !t.getClientRects().length) return;
    document.dispatchEvent(new Event("holosuite-close-skill-help")), e = document.createElement("aside"), e.className = "holosuite-skill-help", e.id = `holosuite-skill-help-${crypto.randomUUID()}`, e.setAttribute("role", "note"), e.setAttribute("popover", "manual"), e.tabIndex = 0, e.textContent = n(), Object.assign(e.style, {
      position: "fixed",
      inset: "auto",
      margin: "0",
      padding: "12px",
      width: "min(380px, calc(100vw - 24px))",
      maxHeight: "calc(100vh - 24px)",
      boxSizing: "border-box",
      overflow: "auto",
      overflowWrap: "break-word",
      background: "#10151f",
      color: "#edf2f7",
      border: "1px solid #65788c",
      borderRadius: "6px",
      boxShadow: "0 4px 16px #0008",
      zIndex: "100000",
      fontSize: "14px",
      lineHeight: "1.45",
      fontWeight: "normal",
      textAlign: "left",
      userSelect: "text",
      pointerEvents: "auto"
    }), document.body.appendChild(e), (u = e.showPopover) == null || u.call(e), t.setAttribute("aria-describedby", e.id), t.setAttribute("aria-expanded", "true");
    const s = () => {
      if (!e) return;
      const l = t.getBoundingClientRect(), d = Math.max(12, Math.min(l.left, window.innerWidth - e.offsetWidth - 12)), h = l.bottom + 8, f = h + e.offsetHeight <= window.innerHeight - 12 ? h : Math.max(12, l.top - e.offsetHeight - 8);
      e.style.left = `${d}px`, e.style.top = `${f}px`;
    }, r = () => {
      e == null || e.remove(), e = null, t.removeAttribute("aria-describedby"), t.setAttribute("aria-expanded", "false"), document.removeEventListener("click", o, !0), document.removeEventListener("keydown", a, !0), document.removeEventListener("holosuite-close-skill-help", r), window.removeEventListener("resize", s), document.removeEventListener("scroll", s, !0), c.disconnect();
    }, o = (l) => {
      !(e != null && e.contains(l.target)) && !t.contains(l.target) && r();
    }, a = (l) => {
      l.key === "Escape" && r();
    }, c = new MutationObserver(() => {
      (!t.isConnected || !t.getClientRects().length) && r();
    });
    c.observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: ["hidden"] }), document.addEventListener("click", o, !0), document.addEventListener("keydown", a, !0), document.addEventListener("holosuite-close-skill-help", r), window.addEventListener("resize", s), document.addEventListener("scroll", s, !0), s();
  };
  t.addEventListener("pointerenter", i), t.addEventListener("focus", i), t.addEventListener("click", (s) => {
    s.preventDefault(), i();
  }), t.addEventListener("keydown", (s) => {
    (s.key === "Enter" || s.key === " ") && (s.preventDefault(), i());
  });
}
const q = "holosuite-hacking", Ei = `modules/${q}/templates/hacking-launcher.html`, qi = ue(), Hi = {
  minigameType: "Choose the puzzle the player will attempt.",
  userId: "Choose who receives the hacking challenge.",
  actorId: "Choose the character attempting the hack.",
  skillId: "Choose the character skill used for the check.",
  dieSides: "Choose the die used for custom rolls. Your choice is remembered.",
  diceCount: "Roll this many dice, then keep one result.",
  keepResult: "Keep the best or worst die, based on Positive rolls.",
  staticModifier: "Add this number to custom rolls. Negative numbers subtract.",
  rollDirection: "Choose whether high or low rolls are positive. System rolls may use their own rules.",
  dc: "Target number for the check. System rolls may use their own difficulty.",
  liveAudience: "Choose who can watch the minigame live.",
  testRollTotal: "Use this pretend roll total when clicking Test Yourself. No dice are rolled."
}, Fi = {
  system: "Uses the character's skill check and roll dialog, including system modifiers and dice rules.",
  sheet: "Opens the character sheet. Roll normally, then click Use for hacking on the chat result.",
  custom: "Uses your dice settings, the detected skill modifier, and your static modifier."
};
function _i(t) {
  var s, r, o;
  const n = `modules/${q}/${t.replace(/^\/+/, "")}`, e = (s = foundry == null ? void 0 : foundry.utils) == null ? void 0 : s.getRoute;
  return typeof e == "function" ? e(n) : `${String(globalThis.ROUTE_PREFIX ?? ((o = (r = game == null ? void 0 : game.data) == null ? void 0 : r.options) == null ? void 0 : o.routePrefix) ?? "").replace(/^\/?/, "/").replace(/\/$/, "")}/${n}`;
}
class zt extends qi {
  constructor(e = {}) {
    var i;
    super(e);
    p(this, "api");
    p(this, "preferenceSave", Promise.resolve());
    p(this, "quickHack");
    p(this, "quickSending", !1);
    p(this, "modeSave", Promise.resolve());
    p(this, "configurationMode");
    p(this, "configuration");
    p(this, "configurationResult");
    p(this, "selectedOutcome", null);
    p(this, "editingConfiguration");
    p(this, "fieldIdPrefix");
    this.api = e.api, this.configurationMode = e.configurationMode === !0, this.fieldIdPrefix = this.configurationMode ? `hh-config-${foundry.utils.randomID()}` : "hh", this.configuration = this.configurationMode ? He(e.configuration ?? {}) : null, this.configurationResult = e.onConfigured ?? null, this.editingConfiguration = e.editingConfiguration === !0, this.selectedOutcome = ((i = this.configuration) == null ? void 0 : i.quickOutcome) ?? null, this.quickHack = this.configurationMode ? !!this.selectedOutcome : !!game.settings.get(q, "quickHackMode");
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
      template: Ei
    });
  }
  getData() {
    var l, d;
    const e = ((l = this.configuration) == null ? void 0 : l.dc) ?? Number(game.settings.get(q, "defaultDc") ?? 15), i = ((d = this.configuration) == null ? void 0 : d.liveAudience) ?? String(game.settings.get(q, "defaultLiveAudience") ?? "everyone"), s = Je(), r = s[0] ?? null, o = Ct(r == null ? void 0 : r.id), a = o.length ? K(o[0].id) : null, c = B(this.configuration ?? {}), u = this.api.getMinigames().map((h) => {
      var f;
      return { ...h, selected: h.id === ((f = this.configuration) == null ? void 0 : f.minigameType) };
    });
    return this.configuration && !u.some((h) => h.selected) && u.push({ id: this.configuration.minigameType, title: `${this.configuration.minigameType} (unavailable)`, selected: !0 }), {
      ...c,
      configurationMode: this.configurationMode,
      fieldIdPrefix: this.fieldIdPrefix,
      configurationAction: this.editingConfiguration ? "Save" : "Add",
      quickHack: this.quickHack,
      quickOutcomes: Object.entries(D).map(([h, f]) => ({ id: h, label: h === "failure_but_playable" ? "Failure" : f.label })),
      missingSkillsWarning: Oe(),
      systemRollSupported: ye(),
      systemRoll: c.rollSource === "system",
      customRoll: c.rollSource === "custom",
      sheetRoll: c.rollSource === "sheet",
      keepWorst: c.keepResult === "worst",
      diceCounts: Array.from({ length: 10 }, (h, f) => ({ value: f + 1, selected: c.diceCount === f + 1 })),
      dice: Et(c.dieSides),
      lowRollsGood: c.rollDirection === "low",
      frameAssetBase: _i("assets/frame"),
      defaultDc: e,
      liveAudiences: [
        { value: "everyone", label: "GM and players", selected: i === "everyone" },
        { value: "gm", label: "GM only", selected: i === "gm" },
        { value: "none", label: "Nobody", selected: i === "none" }
      ],
      defaultTestRoll: e,
      minigames: u,
      actors: o.map((h) => ({
        id: h.id,
        name: h.name,
        ownerNames: h.owners.map((f) => f.name).join(", ") || "No active owner"
      })),
      users: s.map((h) => ({
        id: h.id,
        name: h.name
      })),
      skills: this.configurationMode ? We() : Ee(a)
    };
  }
  activateListeners(e) {
    super.activateListeners(e);
    const i = e.is("form") ? e[0] : e.find("form")[0];
    this.quickSending = !1, e.find("[data-action='quick-toggle']").on("click", () => {
      if (this.quickHack = !this.quickHack, this.syncQuickControls(i), this.configurationMode) return;
      const r = this.quickHack;
      this.modeSave = this.modeSave.catch(() => {
      }).then(() => game.settings.set(q, "quickHackMode", r)), this.modeSave.catch(() => {
        var o, a;
        return (a = (o = ui.notifications) == null ? void 0 : o.warn) == null ? void 0 : a.call(o, "Could not remember the launcher mode.");
      });
    }), e.find("[data-quick-outcome]").on("click", (r) => this.submitQuick(i, r.currentTarget.dataset.quickOutcome)), e.find("[data-action='start'], [data-action='save-quick-configuration']").on("click", (r) => {
      r.preventDefault(), this.submit(i);
    }), e.find("[data-action='test-self']").on("click", (r) => {
      r.preventDefault(), this.testSelf(i);
    });
    const s = e.is("form") ? e : e.find("form");
    Pt(i == null ? void 0 : i.querySelector("[data-skill-warning]"), Oe);
    for (const r of (i == null ? void 0 : i.querySelectorAll("[data-label-help]")) ?? [])
      Pt(r, () => {
        var o;
        return r.dataset.labelHelp === "rollSource" ? Fi[((o = i == null ? void 0 : i.querySelector("[name='rollSource']")) == null ? void 0 : o.value) ?? "custom"] : Hi[r.dataset.labelHelp ?? ""];
      });
    e.find("[name='rollSource'], [name='dieSides'], [name='rollDirection'], [name='diceCount'], [name='keepResult'], [name='staticModifier']").on("change", () => {
      var r, o;
      this.syncRollControls(i), (r = i == null ? void 0 : i.querySelector("[name='dieSides']")) != null && r.checkValidity() && (((o = i.querySelector("[name='staticModifier']")) == null ? void 0 : o.checkValidity()) ?? !0) && this.saveRollPreferences(i).catch(() => {
      });
    }), e.find("[data-action='cancel-configuration']").on("click", () => this.close()), s.on("submit", (r) => {
      r.preventDefault(), this.submit(r.currentTarget);
    }), e.find("[name='actorId']").on("change", (r) => {
      this.syncUserToActor(e, r.currentTarget.value), this.syncSkillOptions(e, r.currentTarget.value);
    }), e.find("[name='userId']").on("change", (r) => {
      this.syncActorsForUser(e, r.currentTarget.value);
    }), this.syncSkillOptions(e, e.find("[name='actorId']").val()), this.syncRollControls(i), this.syncQuickControls(i);
  }
  syncQuickControls(e) {
    if (!e) return;
    const i = e.querySelector("[data-full-setup]");
    i && (i.hidden = this.quickHack, i.disabled = this.quickHack);
    const s = e.querySelector("[data-quick-setup]");
    s && (s.hidden = !this.quickHack);
    const r = e.querySelector("[data-full-configuration-actions]");
    r && (r.hidden = this.quickHack);
    const o = e.querySelector("[data-action='quick-toggle']");
    o && (o.setAttribute("aria-pressed", String(this.quickHack)), o.textContent = this.quickHack ? "Full setup" : "Quick Hack");
    const a = e.querySelector("[data-launcher-heading]");
    if (a && (a.textContent = this.configurationMode ? "Configure Hack" : this.quickHack ? "Quick Hack" : "Launch Minigame"), this.configurationMode)
      for (const c of e.querySelectorAll("[data-quick-outcome]"))
        c.setAttribute("aria-pressed", String(c.dataset.quickOutcome === this.selectedOutcome));
    document.dispatchEvent(new Event("holosuite-close-skill-help")), e.scrollTop = 0;
  }
  async submitQuick(e, i) {
    var a, c, u, l, d, h, f;
    if (!((a = game.user) != null && a.isGM) || !this.quickHack || this.quickSending || !e) return;
    const s = we(i);
    if (!s) return;
    if (this.configurationMode) {
      this.selectedOutcome = s, this.syncQuickControls(e);
      return;
    }
    const r = e.querySelector("[name='userId']");
    if (!(r != null && r.value) || !r.reportValidity()) {
      (u = (c = ui.notifications) == null ? void 0 : c.warn) == null || u.call(c, "Choose a player for Quick Hack.");
      return;
    }
    this.quickSending = !0;
    const o = [...e.querySelectorAll("[data-quick-outcome]")];
    o.forEach((m) => {
      m.disabled = !0;
    });
    try {
      if (this.api.sendHackToPlayer({
        minigameType: String(((l = e.querySelector("[name='minigameType']")) == null ? void 0 : l.value) || "node-intrusion"),
        actorId: String(((d = e.querySelector("[name='actorId']")) == null ? void 0 : d.value) || ""),
        userId: r.value,
        quickOutcome: s,
        liveAudience: String(game.settings.get(q, "defaultLiveAudience") ?? "everyone")
      })) {
        await this.close();
        return;
      }
    } catch (m) {
      (f = (h = ui.notifications) == null ? void 0 : h.warn) == null || f.call(h, `Could not send Quick Hack: ${m.message}`);
    }
    this.quickSending = !1, o.forEach((m) => {
      m.disabled = !1;
    });
  }
  async submit(e) {
    var P, T, g, y, k, N, M, O, x, j, F, A, E, G;
    if (!((P = game.user) != null && P.isGM)) {
      (g = (T = ui.notifications) == null ? void 0 : T.warn) == null || g.call(T, "Only the GM can open the HoloSuite Hacking launcher.");
      return;
    }
    if (!e) {
      (k = (y = ui.notifications) == null ? void 0 : y.error) == null || k.call(y, "HoloSuite Hacking launcher form was not found."), console.error(`${q} | Launcher form was not found.`);
      return;
    }
    if (this.configurationMode) return this.saveConfiguration(e);
    if (this.quickHack) {
      (M = (N = ui.notifications) == null ? void 0 : N.info) == null || M.call(N, "Choose a Quick Hack outcome to send the minigame.");
      return;
    }
    const i = e.querySelector("[name='minigameType']"), s = e.querySelector("[name='actorId']"), r = e.querySelector("[name='userId']"), o = e.querySelector("[name='skillId']"), a = e.querySelector("[name='dc']"), c = e.querySelector("[name='liveAudience']"), u = ((O = o == null ? void 0 : o.selectedOptions) == null ? void 0 : O[0]) ?? null, l = String((i == null ? void 0 : i.value) || "node-intrusion"), d = String((s == null ? void 0 : s.value) || ""), h = String((r == null ? void 0 : r.value) || ""), f = String((o == null ? void 0 : o.value) || ""), m = f ? String((u == null ? void 0 : u.dataset.skillLabel) || (u == null ? void 0 : u.textContent) || f) : ((x = e.querySelector("[name='rollSource']")) == null ? void 0 : x.value) === "sheet" ? "the requested skill" : "Custom check", S = Number((u == null ? void 0 : u.dataset.skillModifier) ?? 0), b = Number((a == null ? void 0 : a.value) ?? 15), w = String((c == null ? void 0 : c.value) || "everyone");
    if (!f && ((j = e.querySelector("[name='rollSource']")) == null ? void 0 : j.value) === "system") {
      (A = (F = ui.notifications) == null ? void 0 : F.warn) == null || A.call(F, Oe());
      return;
    }
    if (!((E = e.querySelector("[name='dieSides']")) != null && E.reportValidity()) || ((G = e.querySelector("[name='staticModifier']")) == null ? void 0 : G.reportValidity()) === !1) return;
    let v;
    try {
      v = await this.saveRollPreferences(e);
    } catch {
      return;
    }
    this.api.sendHackToPlayer({
      ...v,
      minigameType: l,
      actorId: d,
      userId: h,
      skillId: f,
      skillLabel: m,
      skillModifier: S,
      dc: b,
      liveAudience: w,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }) && this.close();
  }
  async testSelf(e) {
    var u, l, d, h, f, m, S, b, w, v, I, P, T, g, y;
    if (!((u = game.user) != null && u.isGM)) {
      (d = (l = ui.notifications) == null ? void 0 : l.warn) == null || d.call(l, "Only the GM can test HoloSuite Hacking minigames.");
      return;
    }
    if (!e) {
      (f = (h = ui.notifications) == null ? void 0 : h.error) == null || f.call(h, "HoloSuite Hacking launcher form was not found.");
      return;
    }
    const i = String(((m = e.querySelector("[name='minigameType']")) == null ? void 0 : m.value) || "node-intrusion"), s = String(((S = e.querySelector("[name='actorId']")) == null ? void 0 : S.value) || ""), r = Number(((b = e.querySelector("[name='dc']")) == null ? void 0 : b.value) ?? game.settings.get(q, "defaultDc") ?? 15), o = Number(((w = e.querySelector("[name='testRollTotal']")) == null ? void 0 : w.value) ?? r);
    if (!Number.isFinite(o)) {
      (I = (v = ui.notifications) == null ? void 0 : v.warn) == null || I.call(v, "Enter a fake roll result before testing the minigame.");
      return;
    }
    const a = K(s);
    if (!((P = e.querySelector("[name='dieSides']")) != null && P.reportValidity()) || ((T = e.querySelector("[name='staticModifier']")) == null ? void 0 : T.reportValidity()) === !1) return;
    let c;
    try {
      c = await this.saveRollPreferences(e);
    } catch {
      return;
    }
    this.api.startHack({
      ...c,
      type: i,
      dc: r,
      rollTotal: o,
      actorName: (a == null ? void 0 : a.name) ?? ((g = game.user) == null ? void 0 : g.name) ?? "GM",
      userId: ((y = game.user) == null ? void 0 : y.id) ?? "",
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }), this.close();
  }
  saveRollPreferences(e) {
    var s, r, o, a, c, u;
    const i = B({
      rollSource: (s = e.querySelector("[name='rollSource']")) == null ? void 0 : s.value,
      diceCount: (r = e.querySelector("[name='diceCount']")) == null ? void 0 : r.value,
      keepResult: (o = e.querySelector("[name='keepResult']")) == null ? void 0 : o.value,
      staticModifier: (a = e.querySelector("[name='staticModifier']")) == null ? void 0 : a.value,
      dieSides: (c = e.querySelector("[name='dieSides']")) == null ? void 0 : c.value,
      rollDirection: (u = e.querySelector("[name='rollDirection']")) == null ? void 0 : u.value
    });
    return this.configurationMode ? Promise.resolve(i) : (this.preferenceSave = this.preferenceSave.catch(() => {
    }).then(async () => {
      var l, d, h;
      if (!((l = game.user) != null && l.isGM)) return i;
      try {
        return await game.settings.set(q, "defaultDieSides", i.dieSides), await game.settings.set(q, "defaultRollDirection", i.rollDirection), await game.settings.set(q, "defaultDiceCount", i.diceCount), await game.settings.set(q, "defaultKeepResult", i.keepResult), await game.settings.set(q, "defaultStaticModifier", i.staticModifier), await game.settings.set(q, "defaultRollSource", i.rollSource), i;
      } catch (f) {
        throw (h = (d = ui.notifications) == null ? void 0 : d.error) == null || h.call(d, "Could not save the hacking dice preferences."), f;
      }
    }), this.preferenceSave);
  }
  syncRollControls(e) {
    var o, a;
    if (!e) return;
    const i = (o = e.querySelector("[name='rollSource']")) == null ? void 0 : o.value;
    if (this.configurationMode) {
      const c = e.querySelector("[name='skillId'] option[value='']");
      c && (c.textContent = i === "system" ? "Choose a skill" : i === "sheet" ? "Player chooses on sheet" : "No skill modifier");
    }
    for (const c of e.querySelectorAll("[data-custom-roll]")) c.hidden = i !== "custom";
    const s = e.querySelector("[name='staticModifier']");
    s && (s.disabled = i !== "custom");
    const r = e.querySelector("[name='keepResult']");
    r && (r.disabled = ((a = e.querySelector("[name='diceCount']")) == null ? void 0 : a.value) === "1");
  }
  syncUserToActor(e, i) {
    const s = K(i), r = Je().find((o) => s == null ? void 0 : s.testUserPermission(o, "OWNER"));
    r && e.find("[name='userId']").val(r.id);
  }
  syncSkillOptions(e, i) {
    var a;
    if (this.configurationMode) {
      const c = We(), u = ((a = this.configuration) == null ? void 0 : a.skillId) ?? "";
      let l = c.find((h) => h.id === u || h.name.toLocaleLowerCase() === u.toLocaleLowerCase());
      !l && u && (l = { id: u, name: this.configuration.skillLabel || u, label: `${this.configuration.skillLabel || u} (saved skill)`, modifier: 0 }, c.push(l));
      const d = e.find("[name='skillId']");
      d.html('<option value="">No skill modifier</option>' + c.map((h) => `<option value="${$(h.id)}" data-skill-label="${$(h.name)}">${$(h.label)}</option>`).join("")), d.val((l == null ? void 0 : l.id) ?? "").prop("disabled", !1).prop("required", !1), e.find("[data-skill-warning]").prop("hidden", !!c.length);
      return;
    }
    const s = K(i), r = Ee(s), o = e.find("[name='skillId']");
    o.html(r.length ? r.map((c) => `<option value="${$(c.id)}" data-skill-label="${$(c.name ?? c.label)}" data-skill-modifier="${Number(c.modifier ?? 0)}">${$(c.label)}</option>`).join("") : '<option value="">No skills detected</option>'), o.prop("disabled", !r.length).prop("required", !!r.length), e.find("[data-skill-warning]").prop("hidden", !!r.length);
  }
  syncActorsForUser(e, i) {
    const s = Ct(i), r = s.length ? s.map((o) => `<option value="${$(o.id)}">${$(o.name)} (${$(o.owners.map((a) => a.name).join(", ") || "No owner")})</option>`).join("") : '<option value="">Use assigned character</option>';
    e.find("[name='actorId']").html(r), this.syncSkillOptions(e, e.find("[name='actorId']").val());
  }
  async saveConfiguration(e) {
    var o, a, c, u, l, d, h, f, m, S, b, w, v, I, P;
    if (!((o = game.user) != null && o.isGM)) return;
    const i = (a = e.querySelector("[name='minigameType']")) == null ? void 0 : a.value;
    if (!this.api.getMinigames().some((T) => T.id === i)) {
      (u = (c = ui.notifications) == null ? void 0 : c.warn) == null || u.call(c, "Choose an available minigame.");
      return;
    }
    if (this.quickHack && !this.selectedOutcome) {
      (d = (l = ui.notifications) == null ? void 0 : l.warn) == null || d.call(l, "Choose a Quick Hack outcome first.");
      return;
    }
    const s = (h = e.querySelector("[name='rollSource']")) == null ? void 0 : h.value, r = e.querySelector("[name='skillId']");
    if (!this.quickHack && s === "system" && (!ye() || !(r != null && r.value))) {
      (m = (f = ui.notifications) == null ? void 0 : f.warn) == null || m.call(f, "Choose a skill for the system roll, or use another roll source.");
      return;
    }
    if (e.reportValidity())
      try {
        const T = He({
          ...this.quickHack ? this.configuration : await this.saveRollPreferences(e),
          minigameType: i,
          skillId: (r == null ? void 0 : r.value) ?? "",
          skillLabel: ((S = r == null ? void 0 : r.selectedOptions[0]) == null ? void 0 : S.dataset.skillLabel) ?? "",
          dc: this.quickHack ? (b = this.configuration) == null ? void 0 : b.dc : (w = e.querySelector("[name='dc']")) == null ? void 0 : w.value,
          liveAudience: (v = e.querySelector("[name='liveAudience']")) == null ? void 0 : v.value,
          quickOutcome: this.quickHack ? this.selectedOutcome : null
        }), g = this.configurationResult;
        this.configurationResult = null, g == null || g(T), await this.close();
      } catch (T) {
        (P = (I = ui.notifications) == null ? void 0 : I.warn) == null || P.call(I, T.message);
      }
  }
  async close(e = {}) {
    const i = this.configurationResult;
    return this.configurationResult = null, i == null || i(null), super.close(e);
  }
}
function Ui(t, n = null, e = {}) {
  var i;
  return (i = game.user) != null && i.isGM ? new Promise((s, r) => {
    try {
      new zt({
        api: t,
        configurationMode: !0,
        configuration: n,
        editingConfiguration: !!n,
        onConfigured: s,
        id: `holosuite-hack-config-${foundry.utils.randomID()}`,
        title: e.title ? `Configure Hack: ${String(e.title)}` : "Configure Hack"
      }).render(!0);
    } catch (o) {
      r(o);
    }
  }) : Promise.reject(new Error("Only the GM can configure attached hacks."));
}
const Se = "holosuite-hacking", ji = `modules/${Se}/templates/difficulty-profiles.html`, Gi = xi(), Be = [
  "critical_success",
  "strong_success",
  "success",
  "failure_but_playable",
  "critical_failure"
];
function De(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function Bt(t, n) {
  if (!De(n)) return t;
  const e = { ...t };
  for (const [i, s] of Object.entries(n))
    e[i] = De(s) && De(e[i]) ? Bt(e[i], s) : s;
  return e;
}
function zi() {
  const t = String(game.settings.get(Se, "difficultyProfileOverrides") ?? "").trim();
  if (!t) return {};
  try {
    const n = JSON.parse(t);
    return De(n) ? n : {};
  } catch (n) {
    return console.warn(`${Se} | Difficulty profile overrides must be valid JSON.`, n), {};
  }
}
function L(t, n, e) {
  const i = t.get(n);
  if (i === null || i === "") return e;
  const s = Number(i);
  return Number.isFinite(s) ? s : e;
}
function C(t, n, e) {
  return Math.min(e, Math.max(n, t));
}
function $e(t, n) {
  return t.get(n) === "on";
}
function Nt(t) {
  if (t.type !== "number" || t.value === "") return;
  const n = Number(t.value);
  if (!Number.isFinite(n)) return;
  const e = t.min === "" ? -1 / 0 : Number(t.min), i = t.max === "" ? 1 / 0 : Number(t.max), s = C(n, e, i);
  s !== n && (t.value = String(s));
}
function Fe(t, n, e, i) {
  const s = C(Math.round(t), 6, 40), r = Math.max(0, s - 4), o = C(Math.round(n), 0, r), a = Math.max(0, s - o), c = C(Math.round(a * 0.48), Math.min(6, a), a), u = c >= 5 ? 3 : 1, l = C(Math.round(e), 1, u), d = c + Math.max(0, l - 1), h = i ? Math.max(0, s - o - 2) : Math.max(0, s - o - d);
  return {
    nodeCount: s,
    maxDecoys: r,
    decoyCount: o,
    mainPathLength: c,
    maxRoutes: u,
    routeCount: l,
    protectedNodes: d,
    maxFirewalls: h
  };
}
function Bi(t, n, e) {
  const i = L(t, `${n}nodeCount`, e.nodeIntrusion.nodeCount), s = L(t, `${n}decoyCount`, e.nodeIntrusion.decoyCount), r = L(t, `${n}routeCount`, e.nodeIntrusion.routeCount ?? 2), o = $e(t, `${n}allowFirewallOnMainPath`), a = Fe(i, s, r, o);
  return {
    traceDurationSeconds: C(Math.round(L(t, `${n}nodeTraceDurationSeconds`, e.nodeIntrusion.traceDurationSeconds ?? e.traceDurationSeconds ?? 60)), 5, 300),
    nodeCount: a.nodeCount,
    firewallCount: C(Math.round(L(t, `${n}firewallCount`, e.nodeIntrusion.firewallCount)), 0, a.maxFirewalls),
    decoyCount: a.decoyCount,
    routeCount: a.routeCount,
    radarEnabled: $e(t, `${n}radarEnabled`),
    claimDurationSeconds: C(L(t, `${n}claimDurationSeconds`, e.nodeIntrusion.claimDurationSeconds ?? 0.5), 0.1, 5),
    firewallClaimMultiplier: C(L(t, `${n}firewallClaimMultiplier`, e.nodeIntrusion.firewallClaimMultiplier ?? 1.75), 1, 5),
    firewallPenaltySeconds: C(Math.round(L(t, `${n}firewallPenaltySeconds`, e.nodeIntrusion.firewallPenaltySeconds ?? 6)), 0, 60),
    decoyPenaltySeconds: C(Math.round(L(t, `${n}decoyPenaltySeconds`, e.nodeIntrusion.decoyPenaltySeconds ?? 4)), 0, 60),
    showTarget: $e(t, `${n}showTarget`),
    allowFirewallOnMainPath: o
  };
}
function Vi(t, n, e) {
  return {
    traceDurationSeconds: C(Math.round(L(t, `${n}signalTraceDurationSeconds`, e.signalAlignment.traceDurationSeconds ?? e.traceDurationSeconds ?? 60)), 5, 300),
    channelCount: C(Math.round(L(t, `${n}signalChannelCount`, e.signalAlignment.channelCount ?? 3)), 2, 5),
    tolerance: C(L(t, `${n}signalTolerance`, e.signalAlignment.tolerance ?? 5), 0.5, 20),
    signalDriftSpeed: C(L(t, `${n}signalDriftSpeed`, e.signalAlignment.signalDriftSpeed ?? 0), 0, 5),
    noiseLevel: C(L(t, `${n}signalNoiseLevel`, e.signalAlignment.noiseLevel ?? 0), 0, 1),
    lockHoldSeconds: C(L(t, `${n}signalLockHoldSeconds`, e.signalAlignment.lockHoldSeconds ?? 4), 0.5, 30),
    targetRevealRadius: C(L(t, `${n}signalTargetRevealRadius`, e.signalAlignment.targetRevealRadius ?? 100), 0, 100),
    destabilizationPenaltySeconds: C(L(t, `${n}signalDestabilizationPenaltySeconds`, e.signalAlignment.destabilizationPenaltySeconds ?? 0), 0, 60)
  };
}
function Ji(t, n, e) {
  const i = e.packetSwitchboard ?? {}, s = C(Math.round(L(t, `${n}packetLaneCount`, i.laneCount ?? 4)), 3, 6);
  return {
    traceDurationSeconds: C(Math.round(L(t, `${n}packetTraceDurationSeconds`, i.traceDurationSeconds ?? e.traceDurationSeconds ?? 60)), 5, 300),
    laneCount: s,
    columnCount: C(Math.round(L(t, `${n}packetColumnCount`, i.columnCount ?? 6)), s - 1, 8),
    deliveryGoal: C(Math.round(L(t, `${n}packetDeliveryGoal`, i.deliveryGoal ?? 7)), 3, 20),
    packetIntervalSeconds: C(L(t, `${n}packetIntervalSeconds`, i.packetIntervalSeconds ?? 2), 0.35, 10),
    packetStepSeconds: C(L(t, `${n}packetStepSeconds`, i.packetStepSeconds ?? 0.8), 0.25, 5),
    previewCount: C(Math.round(L(t, `${n}packetPreviewCount`, i.previewCount ?? 2)), 0, 6),
    misroutePenaltySeconds: C(L(t, `${n}packetMisroutePenaltySeconds`, i.misroutePenaltySeconds ?? 5), 0, 60),
    maxActivePackets: C(Math.round(L(t, `${n}packetMaxActivePackets`, i.maxActivePackets ?? 2)), 1, 6),
    entryHoldSeconds: C(L(t, `${n}packetEntryHoldSeconds`, i.entryHoldSeconds ?? 1.5), 0, 10)
  };
}
function Ki(t, n, e) {
  const i = e.prismLock ?? {}, s = C(Math.round(L(t, `${n}prismRingCount`, i.ringCount ?? 3)), 2, 4), r = C(Math.round(L(t, `${n}prismSlotCount`, i.slotCount ?? 10)), 8, 16), o = C(Math.round(L(t, `${n}prismReceiverCount`, i.receiverCount ?? 4)), 2, Math.min(8, r)), a = C(Math.round(L(t, `${n}prismSwitchableRingCount`, i.switchableRingCount ?? 0)), 0, s - 1), c = Math.min(4, r - o), u = a > 0 && c > 0 ? 1 : 0;
  return {
    traceDurationSeconds: C(Math.round(L(t, `${n}prismTraceDurationSeconds`, i.traceDurationSeconds ?? e.traceDurationSeconds ?? 60)), 5, 300),
    ringCount: s,
    slotCount: r,
    receiverCount: o,
    blockersPerRing: C(Math.round(L(t, `${n}prismBlockersPerRing`, i.blockersPerRing ?? 0)), 0, 3),
    iceReceiverCount: C(Math.round(L(t, `${n}prismIceReceiverCount`, i.iceReceiverCount ?? 0)), u, c),
    switchableRingCount: a,
    scrambleSteps: C(Math.round(L(t, `${n}prismScrambleSteps`, i.scrambleSteps ?? 3)), 1, Math.floor(r / 2)),
    icePenaltySeconds: C(L(t, `${n}prismIcePenaltySeconds`, i.icePenaltySeconds ?? 5), 0, 60)
  };
}
function Wi(t) {
  var i, s, r, o, a, c, u, l, d, h, f, m, S, b, w, v, I, P, T;
  const n = D[t], e = Fe(
    Number(n.nodeIntrusion.nodeCount),
    Number(n.nodeIntrusion.decoyCount),
    Number(n.nodeIntrusion.routeCount ?? 2),
    !!n.nodeIntrusion.allowFirewallOnMainPath
  );
  return {
    hintsEnabled: !!n.hintsEnabled,
    visualGlitchIntensity: Number(n.visualGlitchIntensity ?? 0.4),
    nodeIntrusion: {
      traceDurationSeconds: Number(n.nodeIntrusion.traceDurationSeconds ?? n.traceDurationSeconds ?? 60),
      nodeCount: e.nodeCount,
      firewallCount: C(Number(n.nodeIntrusion.firewallCount ?? 0), 0, e.maxFirewalls),
      decoyCount: e.decoyCount,
      routeCount: e.routeCount,
      radarEnabled: !!(n.nodeIntrusion.radarEnabled ?? Number(n.nodeIntrusion.radarRange ?? 0) > 0),
      claimDurationSeconds: Number(n.nodeIntrusion.claimDurationSeconds ?? 0.5),
      firewallClaimMultiplier: Number(n.nodeIntrusion.firewallClaimMultiplier ?? 1.75),
      firewallPenaltySeconds: Number(n.nodeIntrusion.firewallPenaltySeconds ?? 6),
      decoyPenaltySeconds: Number(n.nodeIntrusion.decoyPenaltySeconds ?? 4),
      showTarget: !!n.nodeIntrusion.showTarget,
      allowFirewallOnMainPath: !!n.nodeIntrusion.allowFirewallOnMainPath
    },
    signalAlignment: {
      traceDurationSeconds: Number(n.signalAlignment.traceDurationSeconds ?? n.traceDurationSeconds ?? 60),
      channelCount: Number(n.signalAlignment.channelCount ?? 3),
      tolerance: Number(n.signalAlignment.tolerance ?? 5),
      signalDriftSpeed: Number(n.signalAlignment.signalDriftSpeed ?? 0),
      noiseLevel: Number(n.signalAlignment.noiseLevel ?? 0),
      lockHoldSeconds: Number(n.signalAlignment.lockHoldSeconds ?? 4),
      targetRevealRadius: Number(n.signalAlignment.targetRevealRadius ?? 100),
      destabilizationPenaltySeconds: Number(n.signalAlignment.destabilizationPenaltySeconds ?? 0)
    },
    packetSwitchboard: {
      traceDurationSeconds: Number(((i = n.packetSwitchboard) == null ? void 0 : i.traceDurationSeconds) ?? n.traceDurationSeconds ?? 60),
      laneCount: Number(((s = n.packetSwitchboard) == null ? void 0 : s.laneCount) ?? 4),
      columnCount: Number(((r = n.packetSwitchboard) == null ? void 0 : r.columnCount) ?? 6),
      deliveryGoal: Number(((o = n.packetSwitchboard) == null ? void 0 : o.deliveryGoal) ?? 7),
      packetIntervalSeconds: Number(((a = n.packetSwitchboard) == null ? void 0 : a.packetIntervalSeconds) ?? 2),
      packetStepSeconds: Number(((c = n.packetSwitchboard) == null ? void 0 : c.packetStepSeconds) ?? 0.8),
      previewCount: Number(((u = n.packetSwitchboard) == null ? void 0 : u.previewCount) ?? 2),
      misroutePenaltySeconds: Number(((l = n.packetSwitchboard) == null ? void 0 : l.misroutePenaltySeconds) ?? 5),
      maxActivePackets: Number(((d = n.packetSwitchboard) == null ? void 0 : d.maxActivePackets) ?? 2),
      entryHoldSeconds: Number(((h = n.packetSwitchboard) == null ? void 0 : h.entryHoldSeconds) ?? 1.5)
    },
    prismLock: {
      traceDurationSeconds: Number(((f = n.prismLock) == null ? void 0 : f.traceDurationSeconds) ?? n.traceDurationSeconds ?? 60),
      ringCount: Number(((m = n.prismLock) == null ? void 0 : m.ringCount) ?? 3),
      slotCount: Number(((S = n.prismLock) == null ? void 0 : S.slotCount) ?? 10),
      receiverCount: Number(((b = n.prismLock) == null ? void 0 : b.receiverCount) ?? 4),
      blockersPerRing: Number(((w = n.prismLock) == null ? void 0 : w.blockersPerRing) ?? 0),
      iceReceiverCount: Number(((v = n.prismLock) == null ? void 0 : v.iceReceiverCount) ?? 0),
      switchableRingCount: Number(((I = n.prismLock) == null ? void 0 : I.switchableRingCount) ?? 0),
      scrambleSteps: Number(((P = n.prismLock) == null ? void 0 : P.scrambleSteps) ?? 3),
      icePenaltySeconds: Number(((T = n.prismLock) == null ? void 0 : T.icePenaltySeconds) ?? 5)
    }
  };
}
class Qi extends Gi {
  constructor() {
    super(...arguments);
    p(this, "activeProfileTab", "general");
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-hacking-difficulty-profiles",
      title: "HoloSuite Hacking Difficulty Profiles",
      classes: ["holosuite-hacking-window", "holosuite-hacking-profile-window"],
      template: ji,
      width: 820,
      height: 780,
      resizable: !0,
      closeOnSubmit: !0,
      submitOnChange: !1,
      submitOnClose: !1
    });
  }
  getData() {
    const e = zi();
    return {
      profiles: Be.map((s) => {
        var h, f, m, S, b, w, v, I, P, T, g, y, k, N, M, O, x, j, F, A, E, G, de, _, he, Ie, at, ct, lt, ut, dt, ht, ft, mt, gt, pt, yt, St, bt, vt;
        const r = D[s], o = Bt(r, e[s]), a = Number(((h = o.nodeIntrusion) == null ? void 0 : h.nodeCount) ?? 12), c = Number(((f = o.nodeIntrusion) == null ? void 0 : f.decoyCount) ?? 0), u = Number(((m = o.nodeIntrusion) == null ? void 0 : m.routeCount) ?? 2), l = !!((S = o.nodeIntrusion) != null && S.allowFirewallOnMainPath), d = Fe(a, c, u, l);
        return {
          id: s,
          label: o.label,
          hintsEnabled: !!o.hintsEnabled,
          visualGlitchIntensity: Number(o.visualGlitchIntensity ?? 0.4),
          nodeIntrusion: {
            traceDurationSeconds: Number(((b = o.nodeIntrusion) == null ? void 0 : b.traceDurationSeconds) ?? o.traceDurationSeconds ?? 60),
            nodeCount: d.nodeCount,
            firewallCount: C(Number(((w = o.nodeIntrusion) == null ? void 0 : w.firewallCount) ?? 0), 0, d.maxFirewalls),
            decoyCount: d.decoyCount,
            routeCount: d.routeCount,
            radarEnabled: !!(((v = o.nodeIntrusion) == null ? void 0 : v.radarEnabled) ?? Number(((I = o.nodeIntrusion) == null ? void 0 : I.radarRange) ?? 0) > 0),
            claimDurationSeconds: Number(((P = o.nodeIntrusion) == null ? void 0 : P.claimDurationSeconds) ?? 0.5),
            firewallClaimMultiplier: Number(((T = o.nodeIntrusion) == null ? void 0 : T.firewallClaimMultiplier) ?? 1.75),
            firewallPenaltySeconds: Number(((g = o.nodeIntrusion) == null ? void 0 : g.firewallPenaltySeconds) ?? 6),
            decoyPenaltySeconds: Number(((y = o.nodeIntrusion) == null ? void 0 : y.decoyPenaltySeconds) ?? 4),
            showTarget: !!((k = o.nodeIntrusion) != null && k.showTarget),
            allowFirewallOnMainPath: l
          },
          signalAlignment: {
            traceDurationSeconds: Number(((N = o.signalAlignment) == null ? void 0 : N.traceDurationSeconds) ?? o.traceDurationSeconds ?? 60),
            channelCount: Number(((M = o.signalAlignment) == null ? void 0 : M.channelCount) ?? 3),
            tolerance: Number(((O = o.signalAlignment) == null ? void 0 : O.tolerance) ?? 5),
            signalDriftSpeed: Number(((x = o.signalAlignment) == null ? void 0 : x.signalDriftSpeed) ?? 0),
            noiseLevel: Number(((j = o.signalAlignment) == null ? void 0 : j.noiseLevel) ?? 0),
            lockHoldSeconds: Number(((F = o.signalAlignment) == null ? void 0 : F.lockHoldSeconds) ?? 4),
            targetRevealRadius: Number(((A = o.signalAlignment) == null ? void 0 : A.targetRevealRadius) ?? 100),
            destabilizationPenaltySeconds: Number(((E = o.signalAlignment) == null ? void 0 : E.destabilizationPenaltySeconds) ?? 0)
          },
          packetSwitchboard: {
            traceDurationSeconds: Number(((G = o.packetSwitchboard) == null ? void 0 : G.traceDurationSeconds) ?? o.traceDurationSeconds ?? 60),
            laneCount: Number(((de = o.packetSwitchboard) == null ? void 0 : de.laneCount) ?? 4),
            columnCount: Number(((_ = o.packetSwitchboard) == null ? void 0 : _.columnCount) ?? 6),
            deliveryGoal: Number(((he = o.packetSwitchboard) == null ? void 0 : he.deliveryGoal) ?? 7),
            packetIntervalSeconds: Number(((Ie = o.packetSwitchboard) == null ? void 0 : Ie.packetIntervalSeconds) ?? 2),
            packetStepSeconds: Number(((at = o.packetSwitchboard) == null ? void 0 : at.packetStepSeconds) ?? 0.8),
            previewCount: Number(((ct = o.packetSwitchboard) == null ? void 0 : ct.previewCount) ?? 2),
            misroutePenaltySeconds: Number(((lt = o.packetSwitchboard) == null ? void 0 : lt.misroutePenaltySeconds) ?? 5),
            maxActivePackets: Number(((ut = o.packetSwitchboard) == null ? void 0 : ut.maxActivePackets) ?? 2),
            entryHoldSeconds: Number(((dt = o.packetSwitchboard) == null ? void 0 : dt.entryHoldSeconds) ?? 1.5)
          },
          prismLock: {
            traceDurationSeconds: Number(((ht = o.prismLock) == null ? void 0 : ht.traceDurationSeconds) ?? o.traceDurationSeconds ?? 60),
            ringCount: Number(((ft = o.prismLock) == null ? void 0 : ft.ringCount) ?? 3),
            slotCount: Number(((mt = o.prismLock) == null ? void 0 : mt.slotCount) ?? 10),
            receiverCount: Number(((gt = o.prismLock) == null ? void 0 : gt.receiverCount) ?? 4),
            blockersPerRing: Number(((pt = o.prismLock) == null ? void 0 : pt.blockersPerRing) ?? 0),
            iceReceiverCount: Number(((yt = o.prismLock) == null ? void 0 : yt.iceReceiverCount) ?? 0),
            switchableRingCount: Number(((St = o.prismLock) == null ? void 0 : St.switchableRingCount) ?? 0),
            scrambleSteps: Number(((bt = o.prismLock) == null ? void 0 : bt.scrambleSteps) ?? 3),
            icePenaltySeconds: Number(((vt = o.prismLock) == null ? void 0 : vt.icePenaltySeconds) ?? 5)
          },
          constraints: d
        };
      }),
      hasOverrides: Object.keys(e).length > 0
    };
  }
  activateListeners(e) {
    super.activateListeners(e), this.setProfileTab(e, this.activeProfileTab, !1), this.syncConstraints(e), e.find("[data-profile-tab]").on("click", (i) => {
      i.preventDefault();
      const s = i.currentTarget, r = (s == null ? void 0 : s.dataset.profileTab) ?? "general";
      this.setProfileTab((s == null ? void 0 : s.closest(".holosuite-profile-config")) ?? e, r, !0);
    }), e.find("[data-action='toggle-profile']").on("click", (i) => {
      i.preventDefault();
      const s = i.currentTarget, r = s == null ? void 0 : s.closest("[data-profile-section]");
      if (!s || !r) return;
      const o = !r.classList.contains("is-open");
      r.classList.toggle("is-open", o), s.setAttribute("aria-expanded", String(o));
    }), e.find("input[type='number']").on("change", (i) => {
      Nt(i.currentTarget);
    }), e.find("[data-profile-section] input").on("input change", (i) => {
      var r;
      const s = (r = i.currentTarget) == null ? void 0 : r.closest("[data-profile-section]");
      s && this.syncProfileConstraints(s);
    }), e.find("[data-action='reset-profile']").on("click", (i) => {
      var r;
      i.preventDefault(), i.stopPropagation();
      const s = (r = i.currentTarget) == null ? void 0 : r.closest("[data-profile-section]");
      s && this.resetProfileSection(s);
    }), e.find("[data-action='reset-profiles']").on("click", async (i) => {
      var s, r;
      i.preventDefault(), await game.settings.set(Se, "difficultyProfileOverrides", ""), (r = (s = ui.notifications) == null ? void 0 : s.info) == null || r.call(s, "HoloSuite Hacking difficulty profiles reset to defaults."), this.render(!1);
    });
  }
  setProfileTab(e, i, s) {
    var l, d;
    const r = e instanceof HTMLElement ? e : e == null ? void 0 : e[0], o = (l = r == null ? void 0 : r.matches) != null && l.call(r, ".holosuite-profile-config") ? r : ((d = r == null ? void 0 : r.querySelector) == null ? void 0 : d.call(r, ".holosuite-profile-config")) ?? this.form;
    if (!o) return;
    const a = Array.from(o.querySelectorAll("[data-profile-tab]")), c = a.some((h) => h.dataset.profileTab === i) ? i : "general", u = c !== this.activeProfileTab;
    this.activeProfileTab = c, o.dataset.activeProfileTab = c, a.forEach((h) => {
      const f = h.dataset.profileTab === c;
      h.classList.toggle("is-active", f), h.setAttribute("aria-selected", String(f)), h.tabIndex = f ? 0 : -1;
    }), o.querySelectorAll("[data-profile-panel]").forEach((h) => {
      const f = h.dataset.profilePanel === c;
      h.classList.toggle("is-active", f);
    }), s && u && o.querySelectorAll("[data-profile-section]").forEach((h) => {
      var f;
      h.classList.remove("is-open"), (f = h.querySelector("[data-action='toggle-profile']")) == null || f.setAttribute("aria-expanded", "false");
    });
  }
  syncConstraints(e) {
    e.find("[data-profile-section]").each((i, s) => this.syncProfileConstraints(s));
  }
  clampNumberInputs(e) {
    var s;
    const i = e ?? ((s = this.element) == null ? void 0 : s[0]);
    i == null || i.querySelectorAll("input[type='number']").forEach((r) => Nt(r));
  }
  syncProfileConstraints(e) {
    const i = e.dataset.profileId ?? "", s = (v) => e.querySelector(`[name="${i}.${v}"]`), r = s("nodeCount"), o = s("decoyCount"), a = s("routeCount"), c = s("firewallCount"), u = s("allowFirewallOnMainPath");
    if (r && o && a && c) {
      const v = Fe(
        Number(r.value),
        Number(o.value),
        Number(a.value),
        !!(u != null && u.checked)
      );
      r.value = String(v.nodeCount), o.max = String(v.maxDecoys), o.value = String(v.decoyCount), a.max = String(v.maxRoutes), a.value = String(v.routeCount), c.max = String(v.maxFirewalls), c.value = String(C(Math.round(Number(c.value) || 0), 0, v.maxFirewalls)), e.querySelectorAll("[data-constraint]").forEach((I) => {
        const P = I.dataset.constraint;
        P && v[P] !== void 0 && (I.textContent = String(v[P]));
      });
    }
    const l = s("packetLaneCount"), d = s("packetColumnCount");
    if (l && d) {
      const v = C(Math.round(Number(l.value) || 4), 3, 6), I = v - 1;
      l.value = String(v), d.min = String(I), d.value = String(C(Math.round(Number(d.value) || 6), I, 8));
    }
    const h = s("prismRingCount"), f = s("prismSlotCount"), m = s("prismReceiverCount"), S = s("prismIceReceiverCount"), b = s("prismSwitchableRingCount"), w = s("prismScrambleSteps");
    if (h && f && m && S && b && w) {
      const v = C(Math.round(Number(h.value) || 3), 2, 4), I = C(Math.round(Number(f.value) || 10), 8, 16), P = C(Math.round(Number(m.value) || 4), 2, Math.min(8, I)), T = C(Math.round(Number(b.value) || 0), 0, v - 1), g = Math.min(4, I - P);
      h.value = String(v), f.value = String(I), m.max = String(Math.min(8, I)), m.value = String(P), b.max = String(v - 1), b.value = String(T), S.max = String(g), S.min = String(T > 0 && g > 0 ? 1 : 0), S.value = String(C(Math.round(Number(S.value) || 0), Number(S.min), g)), w.max = String(Math.floor(I / 2)), w.value = String(C(Math.round(Number(w.value) || 3), 1, Math.floor(I / 2)));
    }
  }
  resetProfileSection(e) {
    const i = e.dataset.profileId ?? "";
    if (!Be.includes(i)) return;
    const s = Wi(i), r = {
      visualGlitchIntensity: s.visualGlitchIntensity,
      nodeTraceDurationSeconds: s.nodeIntrusion.traceDurationSeconds,
      nodeCount: s.nodeIntrusion.nodeCount,
      routeCount: s.nodeIntrusion.routeCount,
      firewallCount: s.nodeIntrusion.firewallCount,
      decoyCount: s.nodeIntrusion.decoyCount,
      claimDurationSeconds: s.nodeIntrusion.claimDurationSeconds,
      firewallClaimMultiplier: s.nodeIntrusion.firewallClaimMultiplier,
      firewallPenaltySeconds: s.nodeIntrusion.firewallPenaltySeconds,
      decoyPenaltySeconds: s.nodeIntrusion.decoyPenaltySeconds,
      signalTraceDurationSeconds: s.signalAlignment.traceDurationSeconds,
      signalChannelCount: s.signalAlignment.channelCount,
      signalTolerance: s.signalAlignment.tolerance,
      signalDriftSpeed: s.signalAlignment.signalDriftSpeed,
      signalNoiseLevel: s.signalAlignment.noiseLevel,
      signalLockHoldSeconds: s.signalAlignment.lockHoldSeconds,
      signalTargetRevealRadius: s.signalAlignment.targetRevealRadius,
      signalDestabilizationPenaltySeconds: s.signalAlignment.destabilizationPenaltySeconds,
      packetTraceDurationSeconds: s.packetSwitchboard.traceDurationSeconds,
      packetLaneCount: s.packetSwitchboard.laneCount,
      packetColumnCount: s.packetSwitchboard.columnCount,
      packetDeliveryGoal: s.packetSwitchboard.deliveryGoal,
      packetIntervalSeconds: s.packetSwitchboard.packetIntervalSeconds,
      packetStepSeconds: s.packetSwitchboard.packetStepSeconds,
      packetPreviewCount: s.packetSwitchboard.previewCount,
      packetMisroutePenaltySeconds: s.packetSwitchboard.misroutePenaltySeconds,
      packetMaxActivePackets: s.packetSwitchboard.maxActivePackets,
      packetEntryHoldSeconds: s.packetSwitchboard.entryHoldSeconds,
      prismTraceDurationSeconds: s.prismLock.traceDurationSeconds,
      prismRingCount: s.prismLock.ringCount,
      prismSlotCount: s.prismLock.slotCount,
      prismReceiverCount: s.prismLock.receiverCount,
      prismBlockersPerRing: s.prismLock.blockersPerRing,
      prismIceReceiverCount: s.prismLock.iceReceiverCount,
      prismSwitchableRingCount: s.prismLock.switchableRingCount,
      prismScrambleSteps: s.prismLock.scrambleSteps,
      prismIcePenaltySeconds: s.prismLock.icePenaltySeconds
    };
    for (const [a, c] of Object.entries(r)) {
      const u = e.querySelector(`[name="${i}.${a}"]`);
      u && (u.value = String(c));
    }
    const o = {
      hintsEnabled: s.hintsEnabled,
      radarEnabled: s.nodeIntrusion.radarEnabled,
      showTarget: s.nodeIntrusion.showTarget,
      allowFirewallOnMainPath: s.nodeIntrusion.allowFirewallOnMainPath
    };
    for (const [a, c] of Object.entries(o)) {
      const u = e.querySelector(`[name="${i}.${a}"]`);
      u && (u.checked = c);
    }
    this.syncProfileConstraints(e);
  }
  async _updateObject(e, i) {
    var l, d, h, f;
    const s = (e == null ? void 0 : e.currentTarget) instanceof HTMLFormElement ? e.currentTarget : null, r = (l = this.element) == null ? void 0 : l[0], o = r instanceof HTMLFormElement ? r : (d = r == null ? void 0 : r.querySelector) == null ? void 0 : d.call(r, "form"), a = s ?? o ?? this.form;
    this.clampNumberInputs(a);
    const c = a ? new FormData(a) : i instanceof FormData ? i : new FormData(), u = {};
    for (const m of Be) {
      const S = D[m], b = `${m}.`;
      u[m] = {
        traceDurationSeconds: C(Math.round(L(c, `${b}nodeTraceDurationSeconds`, S.traceDurationSeconds)), 5, 300),
        hintsEnabled: $e(c, `${b}hintsEnabled`),
        visualGlitchIntensity: C(L(c, `${b}visualGlitchIntensity`, S.visualGlitchIntensity), 0, 1),
        nodeIntrusion: Bi(c, b, S),
        signalAlignment: Vi(c, b, S),
        packetSwitchboard: Ji(c, b, S),
        prismLock: Ki(c, b, S)
      };
    }
    await game.settings.set(Se, "difficultyProfileOverrides", JSON.stringify(u)), (f = (h = ui.notifications) == null ? void 0 : h.info) == null || f.call(h, "HoloSuite Hacking difficulty profiles saved.");
  }
}
async function Ge({ title: t, result: n, actorName: e, message: i, rollTotal: s, dc: r, quickOutcome: o }) {
  const a = n === "success", c = a ? "#38f28f" : "#ff477e", u = a ? "HACK SUCCESS" : "HACK FAILED", l = i || (a ? "Objective completed." : "Trace or countermeasure completed."), d = o && Object.hasOwn(D, o) ? `<p style="margin: 4px 0 0; color: #bdeff6;">GM-selected difficulty: ${fe(D[o].label)}</p>` : s != null && r != null && Number.isFinite(Number(s)) && Number.isFinite(Number(r)) ? `<p style="margin: 4px 0 0; color: #bdeff6;">Roll ${Number(s)} vs DC ${Number(r)}</p>` : "", h = `
    <div class="holosuite-hacking-chat-result" style="border-left: 4px solid ${c}; padding: 8px 10px; background: rgba(5, 8, 14, 0.88); color: ${c};">
      <strong>${fe(u)} // ${fe(t)} // ${fe(e || "Hacker")}</strong>
      <p style="margin: 6px 0 0; color: ${c};">${fe(l)}</p>
      ${d}
    </div>
  `;
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content: h
  });
}
function fe(t) {
  const n = document.createElement("div");
  return n.textContent = String(t ?? ""), n.innerHTML;
}
function U(t, n, e) {
  return Math.min(e, Math.max(n, t));
}
function Yi(t) {
  const n = String(t ?? "node-intrusion");
  let e = 2166136261;
  for (let i = 0; i < n.length; i += 1)
    e ^= n.charCodeAt(i), e = Math.imul(e, 16777619);
  return e >>> 0;
}
function Xi(t) {
  let n = Yi(t);
  return () => {
    n += 1831565813;
    let e = n;
    return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
  };
}
function Ve(t, n) {
  return t.length ? t[Math.floor(n() * t.length)] : null;
}
function Zi(t, n) {
  const e = [...t];
  for (let i = e.length - 1; i > 0; i -= 1) {
    const s = Math.floor(n() * (i + 1));
    [e[i], e[s]] = [e[s], e[i]];
  }
  return e;
}
function re(t, n, e) {
  const i = t.find((r) => r.id === n), s = t.find((r) => r.id === e);
  !i || !s || (i.connected.includes(e) || i.connected.push(e), s.connected.includes(n) || s.connected.push(n));
}
function me(t, n) {
  return [t, n].sort().join("--");
}
function _e(t, n, e, i) {
  return {
    id: t,
    x: U(Math.round(e), 6, 94),
    y: U(Math.round(i), 10, 90),
    type: n,
    connected: [],
    revealed: n === "start",
    visited: !1
  };
}
function ot(t) {
  return t.flatMap((n) => n.connected.filter((e) => n.id < e).map((e) => ({ from: n.id, to: e })));
}
function z(t, n) {
  return t.find((e) => e.id === n);
}
function Pe(t, n, e) {
  return Math.sign((n.y - t.y) * (e.x - n.x) - (n.x - t.x) * (e.y - n.y));
}
function en(t, n, e, i) {
  const s = Pe(t, n, e), r = Pe(t, n, i), o = Pe(e, i, t), a = Pe(e, i, n);
  return s !== r && o !== a;
}
function tn(t, n, e) {
  if (n.from === e.from || n.from === e.to || n.to === e.from || n.to === e.to) return !1;
  const i = z(t, n.from), s = z(t, n.to), r = z(t, e.from), o = z(t, e.to);
  return !i || !s || !r || !o ? !1 : en(i, s, r, o);
}
function nn(t, n, e) {
  const i = e.x - n.x, s = e.y - n.y, r = i * i + s * s;
  if (!r) {
    const l = t.x - n.x, d = t.y - n.y;
    return Math.sqrt(l * l + d * d);
  }
  const o = U(((t.x - n.x) * i + (t.y - n.y) * s) / r, 0, 1), a = {
    x: n.x + o * i,
    y: n.y + o * s
  }, c = t.x - a.x, u = t.y - a.y;
  return Math.sqrt(c * c + u * u);
}
function sn(t, n = ot(t)) {
  let e = 0;
  for (let i = 0; i < n.length; i += 1)
    for (let s = i + 1; s < n.length; s += 1)
      tn(t, n[i], n[s]) && (e += 1);
  return e;
}
function Vt(t) {
  const n = ot(t);
  let e = sn(t, n) * 900;
  for (let i = 0; i < t.length; i += 1)
    for (let s = i + 1; s < t.length; s += 1) {
      const r = t[i], o = t[s], a = o.x - r.x, c = o.y - r.y, u = Math.sqrt(a * a + c * c) || 1;
      u < 13 && (e += (13 - u) * 30), u < 18 && (e += (18 - u) * 6);
    }
  for (const i of t)
    for (const s of n) {
      if (s.from === i.id || s.to === i.id) continue;
      const r = z(t, s.from), o = z(t, s.to);
      if (!r || !o) continue;
      const a = nn(i, r, o);
      a < 8 && (e += (8 - a) * 18);
    }
  return e;
}
function rn(t, n, e) {
  const i = t.map((s) => ({ ...s, connected: [...s.connected] }));
  i.push({ ...n, connected: [] });
  for (const s of e) re(i, n.id, s);
  return Vt(i);
}
function Lt(t, n, e, i, s, r, o = {}) {
  const {
    radiusMin: a = 17,
    radiusMax: c = 34,
    biasX: u = 5,
    ySpread: l = 1
  } = o;
  let d = null, h = 1 / 0;
  for (let f = 0; f < 16; f += 1) {
    const m = s() * Math.PI * 2 - Math.PI * 0.2, S = a + s() * (c - a), b = i.x + Math.cos(m) * S + u, w = i.y + Math.sin(m) * S * l, v = _e(n, e, b, w), I = rn(t, v, r);
    I < h && (d = v, h = I);
  }
  return d ?? _e(n, e, i.x + u, i.y);
}
function on(t) {
  for (let n = 0; n < 24; n += 1)
    for (let e = 0; e < t.length; e += 1)
      for (let i = e + 1; i < t.length; i += 1) {
        const s = t[e], r = t[i], o = r.x - s.x, a = r.y - s.y, c = Math.sqrt(o * o + a * a) || 1;
        if (c >= 13) continue;
        const u = (13 - c) * 0.35, l = o / c * u, d = a / c * u;
        s.type !== "start" && s.type !== "target" && (s.x = U(s.x - l, 6, 94), s.y = U(s.y - d, 10, 90)), r.type !== "start" && r.type !== "target" && (r.x = U(r.x + l, 6, 94), r.y = U(r.y + d, 10, 90));
      }
}
function Ne(t) {
  const n = Math.floor(t() * 4);
  return n === 0 ? { x: 8 + t() * 22, y: 12 + t() * 76 } : n === 1 ? { x: 70 + t() * 22, y: 12 + t() * 76 } : n === 2 ? { x: 12 + t() * 76, y: 10 + t() * 20 } : { x: 12 + t() * 76, y: 70 + t() * 20 };
}
function an(t) {
  let n = Ne(t), e = Ne(t), i = { start: n, target: e, distance: 0 };
  for (let s = 0; s < 24; s += 1) {
    n = Ne(t), e = Ne(t);
    const r = e.x - n.x, o = e.y - n.y, a = Math.sqrt(r * r + o * o);
    if (a > i.distance && (i = { start: n, target: e, distance: a }), a >= 58) return { start: n, target: e };
  }
  return { start: i.start, target: i.target };
}
function Tt(t, n, e, i = /* @__PURE__ */ new Set()) {
  const s = [n], r = /* @__PURE__ */ new Map([[n, null]]);
  for (let c = 0; c < s.length; c += 1) {
    const u = z(t, s[c]);
    if (u) {
      if (u.id === e) break;
      for (const l of u.connected) {
        if (r.has(l)) continue;
        const d = z(t, l);
        !d || i.has(d.type) || (r.set(l, u.id), s.push(l));
      }
    }
  }
  if (!r.has(e)) return [];
  const o = [];
  let a = e;
  for (; a; )
    o.unshift(a), a = r.get(a) ?? null;
  return o;
}
function cn(t, n, e) {
  const i = Tt(t, n, e, /* @__PURE__ */ new Set(["firewall", "decoy"]));
  if (!i.length) return 0;
  const s = /* @__PURE__ */ new Set([n, e]), r = t.map((o) => ({
    ...o,
    connected: s.has(o.id) || !i.includes(o.id) ? [...o.connected] : []
  }));
  return 1 + (Tt(r, n, e, /* @__PURE__ */ new Set(["firewall", "decoy"])).length ? 1 : 0);
}
function ln(t, n, e, i) {
  let s = t.length + 1;
  const r = [];
  for (let o = 1; o < i && !(n.length < 5); o += 1) {
    const a = 1 + Math.floor(e() * Math.max(1, n.length - 4)), c = U(a + 2 + Math.floor(e() * 3), a + 2, n.length - 2), u = z(t, n[a]), l = z(t, n[c]);
    if (!u || !l) continue;
    const d = `node-${s}`;
    s += 1;
    const h = _e(
      d,
      "normal",
      (u.x + l.x) / 2 + (e() - 0.5) * 34,
      (u.y + l.y) / 2 + (e() - 0.5) * 34
    );
    t.push(h), r.push(u.id, h.id, l.id), re(t, u.id, h.id), re(t, h.id, l.id);
  }
  return r;
}
function Rt(t, n = Date.now()) {
  var w, v, I, P, T;
  const e = Xi(n), i = Math.max(6, Number(t.nodeCount ?? ((w = t.nodeIntrusion) == null ? void 0 : w.nodeCount)) || 10), s = U(Number(t.decoyCount ?? ((v = t.nodeIntrusion) == null ? void 0 : v.decoyCount)) || 0, 0, i - 4), r = Math.max(0, i - s), o = U(Math.round(r * 0.48), 6, r), a = U(Number(t.routeCount ?? ((I = t.nodeIntrusion) == null ? void 0 : I.routeCount)) || 2, 1, 3), c = an(e), u = [], l = [];
  for (let g = 0; g < o; g += 1) {
    const y = g === 0 ? "start" : g === o - 1 ? "target" : `node-${g}`, k = g === 0 ? "start" : g === o - 1 ? "target" : "normal", N = g / Math.max(1, o - 1), M = c.target.x - c.start.x, O = c.target.y - c.start.y, x = Math.sqrt(M * M + O * O) || 1, j = -O / x, F = M / x, A = Math.sin(N * Math.PI * (1.15 + e() * 0.6)) * (10 + e() * 8), E = g === 0 || g === o - 1 ? 0 : (e() - 0.5) * 5, G = g === 0 || g === o - 1 ? 0 : (e() - 0.5) * 12;
    u.push(_e(
      y,
      k,
      c.start.x + M * N + j * A + E,
      c.start.y + O * N + F * A + G
    )), l.push(y), g > 0 && re(u, l[g - 1], y);
  }
  const d = /* @__PURE__ */ new Set([...l, ...ln(u, l, e, a)]);
  let h = u.length + 1;
  for (; u.length < i - s; ) {
    const g = Ve(u.filter((O) => O.type !== "target"), e) ?? u[0], y = `node-${h}`;
    h += 1;
    const k = e() > 0.45 ? Ve(u.filter((O) => O.id !== g.id && O.type !== "start"), e) : null, N = k ? [g.id, k.id] : [g.id], M = Lt(u, y, "normal", g, e, N, {
      radiusMin: 16,
      radiusMax: 31,
      biasX: e() > 0.35 ? 5 : -4,
      ySpread: 1.15
    });
    u.push(M), re(u, g.id, y), k && re(u, y, k.id);
  }
  for (let g = 0; g < s; g += 1) {
    const y = Ve(u.filter((M) => M.type !== "target" && M.type !== "decoy"), e) ?? u[0], k = `decoy-${g + 1}`, N = Lt(u, k, "decoy", y, e, [y.id], {
      radiusMin: 18,
      radiusMax: 34,
      biasX: e() > 0.5 ? -6 : 6,
      ySpread: 1.25
    });
    u.push(N), re(u, y.id, k);
  }
  const f = !!(t.allowFirewallOnMainPath ?? t.allowMainPathFirewalls ?? ((P = t.nodeIntrusion) == null ? void 0 : P.allowFirewallOnMainPath)), m = u.filter((g) => g.type === "start" || g.type === "target" || g.type === "decoy" ? !1 : f || !d.has(g.id)), S = U(Number(t.firewallCount ?? ((T = t.nodeIntrusion) == null ? void 0 : T.firewallCount)) || 0, 0, m.length);
  for (const g of Zi(m, e).slice(0, S))
    g.type = "firewall";
  on(u);
  const b = cn(u, "start", "target");
  return {
    nodes: u,
    edges: ot(u),
    startNodeId: "start",
    targetNodeId: "target",
    mainPathIds: l,
    safeRoutes: b,
    layoutScore: Vt(u)
  };
}
function un(t, n = Date.now()) {
  var s;
  const e = U(Math.ceil(Number(t.nodeCount ?? ((s = t.nodeIntrusion) == null ? void 0 : s.nodeCount)) || 10), 7, 14);
  let i = null;
  for (let r = 0; r < e; r += 1) {
    const o = Rt(t, `${n}:${r}`);
    if ((!i || o.layoutScore < i.layoutScore) && (i = o), o.layoutScore < 1 && o.safeRoutes > 1) break;
  }
  return i ?? Rt(t, n);
}
const Jt = "holosuite-hacking", dn = `modules/${Jt}/templates/node-intrusion.html`, hn = ue();
function Le(t, n, e) {
  return Math.min(e, Math.max(n, t));
}
function Ot(t) {
  return t === "start" ? "entry" : t === "target" ? "target" : t === "firewall" ? "firewall" : t === "decoy" ? "decoy" : "relay";
}
function fn(t, n, e) {
  const i = globalThis.crypto, s = typeof (i == null ? void 0 : i.randomUUID) == "function" ? i.randomUUID() : `${Date.now()}:${performance.now()}:${Math.random()}`;
  return `${t}:${n}:${e.profileId ?? e.id}:${s}`;
}
class mn extends hn {
  constructor(e = {}) {
    super(e);
    p(this, "quickOutcome");
    p(this, "rollTotal");
    p(this, "dc");
    p(this, "profile");
    p(this, "seed");
    p(this, "onSuccess");
    p(this, "onFailure");
    p(this, "actorName");
    p(this, "chatOnResult");
    p(this, "graph");
    p(this, "state");
    p(this, "startedAt");
    p(this, "timer");
    p(this, "claimTimer");
    p(this, "resultMessage");
    p(this, "readOnly");
    p(this, "liveSessionId");
    p(this, "onLiveState");
    p(this, "onLiveEnd");
    p(this, "liveEnded");
    this.quickOutcome = e.quickOutcome ?? null, this.rollTotal = this.quickOutcome ? null : Number(e.rollTotal ?? 15), this.dc = this.quickOutcome ? null : Number(e.dc ?? 15), this.profile = e.profile ? { ...e.profile } : Y(this.rollTotal, this.dc, null, { quickOutcome: this.quickOutcome }), this.seed = e.seed ?? fn(this.rollTotal, this.dc, this.profile), this.onSuccess = typeof e.onSuccess == "function" ? e.onSuccess : null, this.onFailure = typeof e.onFailure == "function" ? e.onFailure : null, this.actorName = String(e.actorName ?? "Hacker"), this.chatOnResult = e.chatOnResult !== !1, this.readOnly = e.readOnly === !0, this.liveSessionId = String(e.liveSessionId ?? ""), this.onLiveState = typeof e.onLiveState == "function" ? e.onLiveState : null, this.onLiveEnd = typeof e.onLiveEnd == "function" ? e.onLiveEnd : null, this.liveEnded = !1, this.graph = un(this.profile, this.seed), this.state = {
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
      template: dn
    });
  }
  getData() {
    var o, a;
    const e = this.getCurrentNode(), i = e.connected, s = !!(this.profile.radarEnabled ?? ((o = this.profile.nodeIntrusion) == null ? void 0 : o.radarEnabled) ?? Number(this.profile.radarRange ?? ((a = this.profile.nodeIntrusion) == null ? void 0 : a.radarRange)) > 0), r = this.graph.nodes.map((c, u) => {
      const l = c.id === this.state.currentNodeId, d = this.state.visitedNodeIds.has(c.id), h = c.id === this.state.claimingNodeId, f = c.type === "target" && (d || this.profile.showTarget || this.profile.hintsEnabled), m = c.type !== "target" && (this.profile.hintsEnabled || c.revealed || d || c.type === "start"), S = f || m ? Ot(c.type) : "unknown", w = s && (l || d || i.includes(c.id)) && c.type !== "start" && c.type !== "target" ? this.countAdjacentBadNodes(c.id) : 0, v = Le(w, 0, 2);
      return {
        ...c,
        visualType: f ? "target" : c.type === "target" ? "normal" : c.type,
        isTargetVisible: f,
        isCurrent: l,
        isVisited: d,
        isClaiming: h,
        isNeighbor: i.includes(c.id),
        canMove: i.includes(c.id) && !this.state.claimingNodeId && !this.state.blockedEdgeIds.has(me(e.id, c.id)) && !this.state.deadNodeIds.has(c.id),
        isDangerVisible: c.type !== "target" && (this.profile.hintsEnabled || c.revealed || d),
        dangerSignal: v,
        displayType: S,
        displayNumber: u + 1
      };
    });
    return {
      quickOutcome: this.quickOutcome,
      rollTotal: this.rollTotal,
      dc: this.dc,
      isReadOnly: this.readOnly,
      isLiveEnded: this.liveEnded,
      profile: this.profile,
      nodes: r,
      edges: this.graph.edges.map((c) => {
        const u = r.find((h) => h.id === c.from), l = r.find((h) => h.id === c.to), d = this.state.blockedEdgeIds.get(me(c.from, c.to));
        return {
          ...c,
          from: u,
          to: l,
          isVisitedPath: this.state.traversedEdgeIds.has(me(c.from, c.to)),
          isAvailable: !d && (i.includes(c.from) || i.includes(c.to)),
          isFirewallPath: d === "firewall",
          isDecoyPath: d === "decoy"
        };
      }),
      movement: this.state.movement,
      currentNode: {
        id: e.id,
        label: Ot(e.type),
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
    super.activateListeners(e), this.readOnly || (e.find("[data-node-id]").on("click", (i) => this.handleNodeClick(i.currentTarget.dataset.nodeId)), e.find("[data-action='start']").on("click", () => this.startRun()), e.find("[data-action='abort']").on("click", () => this.abort())), e.find("[data-action='close']").on("click", () => this.close()), this.syncDom();
  }
  async render(e, i) {
    const s = await super.render(e, i);
    return !this.readOnly && this.state.hasStarted && this.state.isRunning && this.startTimer(), s;
  }
  async close(e = {}) {
    var s;
    const i = this.serializeLiveState();
    return this.stopTimer(), this.claimTimer && window.clearTimeout(this.claimTimer), this.claimTimer = null, !this.readOnly && !this.liveEnded && (this.liveEnded = !0, (s = this.onLiveEnd) == null || s.call(this, i)), super.close(e);
  }
  getCurrentNode() {
    return this.graph.nodes.find((e) => e.id === this.state.currentNodeId) ?? this.graph.nodes[0];
  }
  getTraceDuration() {
    var s;
    const e = Number(game.settings.get(Jt, "traceDurationMultiplier") ?? 1) || 1, i = Number(((s = this.profile.nodeIntrusion) == null ? void 0 : s.traceDurationSeconds) ?? this.profile.traceDurationSeconds ?? 60);
    return Math.max(5, i * e);
  }
  countAdjacentBadNodes(e) {
    const i = this.graph.nodes.find((s) => s.id === e);
    return i ? i.connected.reduce((s, r) => {
      const o = this.graph.nodes.find((a) => a.id === r);
      return (o == null ? void 0 : o.type) === "firewall" || (o == null ? void 0 : o.type) === "decoy" ? s + 1 : s;
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
    var u, l, d, h;
    if (!this.state.hasStarted || !this.state.isRunning || this.state.claimingNodeId) return;
    const i = this.getCurrentNode(), s = this.graph.nodes.find((f) => f.id === e);
    if (!s) return;
    if (!i.connected.includes(e)) {
      (u = this.element) == null || u.find(".node-intrusion-shell").addClass("invalid-pulse"), window.setTimeout(() => {
        var f;
        return (f = this.element) == null ? void 0 : f.find(".node-intrusion-shell").removeClass("invalid-pulse");
      }, 280);
      return;
    }
    const r = me(i.id, e);
    if (this.state.blockedEdgeIds.has(r) || this.state.deadNodeIds.has(e)) {
      (l = this.element) == null || l.find(".node-intrusion-shell").addClass("invalid-pulse"), window.setTimeout(() => {
        var f;
        return (f = this.element) == null ? void 0 : f.find(".node-intrusion-shell").removeClass("invalid-pulse");
      }, 280);
      return;
    }
    this.state.movement = {
      fromX: i.x,
      fromY: i.y,
      toX: s.x,
      toY: s.y,
      path: `M ${i.x} ${i.y} L ${s.x} ${s.y}`
    }, this.state.claimingNodeId = e, this.render(!1), this.publishLiveState(!0);
    const o = Math.max(0.1, Number(this.profile.claimDurationSeconds ?? ((d = this.profile.nodeIntrusion) == null ? void 0 : d.claimDurationSeconds)) || 0.5), a = Math.max(1, Number(this.profile.firewallClaimMultiplier ?? ((h = this.profile.nodeIntrusion) == null ? void 0 : h.firewallClaimMultiplier)) || 1), c = s.type === "firewall" ? o * a : o;
    this.claimTimer = window.setTimeout(() => {
      this.claimTimer = null, this.completeNodeClaim(i.id, e);
    }, c * 1e3);
  }
  completeNodeClaim(e, i) {
    var a, c, u, l, d, h;
    if (!this.state.hasStarted || !this.state.isRunning) return;
    const s = this.graph.nodes.find((f) => f.id === e), r = this.graph.nodes.find((f) => f.id === i);
    if (!s || !r) return;
    const o = me(s.id, i);
    if (this.state.claimingNodeId = null, this.state.visitedNodeIds.add(i), this.state.traversedEdgeIds.add(o), r.visited = !0, r.revealed = !0, r.type === "firewall") {
      this.state.mistakes += 1;
      const f = Number(this.profile.firewallPenaltySeconds ?? ((a = this.profile.nodeIntrusion) == null ? void 0 : a.firewallPenaltySeconds)) || 6;
      if (this.addTracePenalty(f), (u = (c = ui.notifications) == null ? void 0 : c.warn) == null || u.call(c, `Firewall surge: trace accelerated by ${f}s.`), this.state.result) return;
      this.firewallsArePassable() ? this.state.currentNodeId = i : (this.state.blockedEdgeIds.set(o, "firewall"), this.state.deadNodeIds.add(i)), this.render(!1), this.publishLiveState(!0);
      return;
    }
    if (r.type === "decoy") {
      this.state.mistakes += 1, this.state.blockedEdgeIds.set(o, "decoy"), this.state.deadNodeIds.add(i);
      const f = Number(this.profile.decoyPenaltySeconds ?? ((l = this.profile.nodeIntrusion) == null ? void 0 : l.decoyPenaltySeconds)) || 4;
      this.addTracePenalty(f), (h = (d = ui.notifications) == null ? void 0 : d.warn) == null || h.call(d, `Decoy sink: trace accelerated by ${f}s.`), this.render(!1), this.publishLiveState(!0);
      return;
    }
    if (this.state.currentNodeId = i, r.type === "target") {
      this.finish("success", "Target node breached");
      return;
    }
    this.render(!1), this.publishLiveState(!0);
  }
  addTracePenalty(e) {
    const i = Math.max(0, e) / this.getTraceDuration() * 100;
    this.state.tracePenaltyProgress = Le(this.state.tracePenaltyProgress + i, 0, 100), this.state.traceProgress = Le(this.state.traceProgress + i, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
  }
  startTimer() {
    if (this.timer || !this.state.hasStarted || !this.startedAt) return;
    const e = this.getTraceDuration();
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const i = (performance.now() - this.startedAt) / 1e3;
      this.state.traceProgress = Le(i / e * 100 + this.state.tracePenaltyProgress, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
    }, 120);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(e, i, { close: s = !1 } = {}) {
    var o, a;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = e, this.stopTimer(), this.resultMessage = i, this.syncDom(), await this.render(!1), this.publishLiveState(!0);
    const r = {
      type: "node-intrusion",
      result: e,
      message: i,
      quickOutcome: this.quickOutcome,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      tracePenaltyProgress: this.state.tracePenaltyProgress,
      traceProgress: this.state.traceProgress,
      visitedNodeIds: [...this.state.visitedNodeIds]
    };
    this.chatOnResult && await Ge({
      title: "Node Intrusion",
      result: e,
      actorName: this.actorName,
      message: i,
      quickOutcome: this.quickOutcome,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), e === "success" ? (o = this.onSuccess) == null || o.call(this, r) : (a = this.onFailure) == null || a.call(this, r), s && await this.close();
  }
  syncDom() {
    var o;
    const e = (o = this.element) == null ? void 0 : o[0];
    if (!e) return;
    const i = e.querySelector("[data-trace-fill]"), s = e.querySelector("[data-trace-text]"), r = e.querySelector("[data-penalty-text]");
    i && (i.style.width = `${this.state.traceProgress}%`), s && (s.textContent = `${Math.round(this.state.traceProgress)}%`), r && (r.textContent = `${Math.round(this.state.tracePenaltyProgress)}%`), this.publishLiveState();
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
        quickOutcome: this.quickOutcome,
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
    const i = JSON.stringify({
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
      const o = this.graph.nodes.find((a) => a.id === r.id);
      o && Object.assign(o, { visited: !!r.visited, revealed: !!r.revealed });
    }
    this.resultMessage = e.resultMessage || void 0;
    const s = JSON.stringify({
      currentNodeId: this.state.currentNodeId,
      claimingNodeId: this.state.claimingNodeId,
      visitedNodeIds: [...this.state.visitedNodeIds],
      blockedEdgeIds: [...this.state.blockedEdgeIds],
      result: this.state.result
    });
    i !== s ? this.render(!1) : this.syncDom();
  }
  markLiveSessionEnded() {
    this.liveEnded = !0, this.render(!1);
  }
  publishLiveState(e = !1) {
    var i;
    this.readOnly || (i = this.onLiveState) == null || i.call(this, this.serializeLiveState(), { immediate: e });
  }
}
function Kt(t, n, e) {
  return Math.min(e, Math.max(n, t));
}
function gn(t) {
  const n = String(t ?? "signal-alignment");
  let e = 2166136261;
  for (let i = 0; i < n.length; i += 1)
    e ^= n.charCodeAt(i), e = Math.imul(e, 16777619);
  return e >>> 0;
}
function pn(t) {
  let n = gn(t);
  return () => {
    n += 1831565813;
    let e = n;
    return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
  };
}
function Qe(t) {
  return Kt(Number(t) || 0, 0, 100);
}
function yn(t, n = Date.now()) {
  var r, o;
  const e = pn(n), i = Kt(Number(t.channelCount ?? ((r = t.signalAlignment) == null ? void 0 : r.channelCount)) || 3, 2, 5), s = Number(t.tolerance ?? ((o = t.signalAlignment) == null ? void 0 : o.tolerance) ?? 5);
  return Array.from({ length: i }, (a, c) => {
    const u = Math.round(18 + e() * 64), l = e() > 0.5 ? 1 : -1, d = s + 8 + Math.round(e() * 18), h = e() > 0.5 ? 1 : -1;
    return {
      id: `channel-${c + 1}`,
      label: `CH-${String(c + 1).padStart(2, "0")}`,
      value: Qe(u + l * d),
      target: u,
      tolerance: s,
      driftDirection: h
    };
  });
}
const Wt = "holosuite-hacking", Sn = `modules/${Wt}/templates/signal-alignment.html`, bn = ue();
function Te(t, n, e) {
  return Math.min(e, Math.max(n, t));
}
class vn extends bn {
  constructor(e = {}) {
    super(e);
    p(this, "quickOutcome");
    p(this, "rollTotal");
    p(this, "dc");
    p(this, "profile");
    p(this, "seed");
    p(this, "onSuccess");
    p(this, "onFailure");
    p(this, "actorName");
    p(this, "chatOnResult");
    p(this, "channels");
    p(this, "state");
    p(this, "startedAt");
    p(this, "lastTickAt");
    p(this, "timer");
    p(this, "wasAligned");
    p(this, "resultMessage");
    p(this, "readOnly");
    p(this, "liveSessionId");
    p(this, "onLiveState");
    p(this, "onLiveEnd");
    p(this, "liveEnded");
    this.quickOutcome = e.quickOutcome ?? null, this.rollTotal = this.quickOutcome ? null : Number(e.rollTotal ?? 15), this.dc = this.quickOutcome ? null : Number(e.dc ?? 15), this.profile = e.profile ? { ...e.profile } : Y(this.rollTotal, this.dc, null, { quickOutcome: this.quickOutcome }), this.seed = e.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}:signal`, this.onSuccess = typeof e.onSuccess == "function" ? e.onSuccess : null, this.onFailure = typeof e.onFailure == "function" ? e.onFailure : null, this.actorName = String(e.actorName ?? "Hacker"), this.chatOnResult = e.chatOnResult !== !1, this.readOnly = e.readOnly === !0, this.liveSessionId = String(e.liveSessionId ?? ""), this.onLiveState = typeof e.onLiveState == "function" ? e.onLiveState : null, this.onLiveEnd = typeof e.onLiveEnd == "function" ? e.onLiveEnd : null, this.liveEnded = !1, this.channels = yn(this.profile, this.seed), this.state = {
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
      template: Sn
    });
  }
  getData() {
    const e = this.channels.map((i) => {
      const s = Math.abs(i.value - i.target), r = s <= i.tolerance, o = this.isTargetVisible(i);
      return {
        ...i,
        valueLabel: i.value.toFixed(1),
        aligned: r,
        targetVisible: o,
        targetLabel: o ? i.target : "??",
        deltaRevealLabel: o ? s.toFixed(1) : "--",
        targetStateLabel: r ? "locked" : o ? "signal found" : "searching",
        waveDurationSeconds: Math.max(1.2, 3.2 - Number(this.profile.noiseLevel ?? 0) * 2),
        targetLeft: i.target,
        toleranceLeft: Te(i.target - i.tolerance, 0, 100),
        toleranceWidth: Te(i.tolerance * 2, 1, 100)
      };
    });
    return {
      quickOutcome: this.quickOutcome,
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
    super.activateListeners(e), this.readOnly ? e.find("[data-channel-slider]").prop("disabled", !0) : (e.find("[data-channel-slider]").on("input", (i) => this.handleSlider(i.currentTarget)), e.find("[data-action='start']").on("click", () => this.startRun()), e.find("[data-action='abort']").on("click", () => this.abort())), e.find("[data-action='close']").on("click", () => this.close()), this.syncDom();
  }
  async render(e, i) {
    const s = await super.render(e, i);
    return !this.readOnly && this.state.hasStarted && this.state.isRunning && this.startTimer(), s;
  }
  async close(e = {}) {
    var s;
    const i = this.serializeLiveState();
    return this.stopTimer(), !this.readOnly && !this.liveEnded && (this.liveEnded = !0, (s = this.onLiveEnd) == null || s.call(this, i)), super.close(e);
  }
  startRun() {
    this.readOnly || this.state.hasStarted || this.state.result || (this.state.hasStarted = !0, this.state.isRunning = !0, this.startedAt = performance.now(), this.lastTickAt = this.startedAt, this.startTimer(), this.render(!1), this.publishLiveState(!0));
  }
  handleSlider(e) {
    if (!this.state.hasStarted || !this.state.isRunning) return;
    const i = this.channels.find((s) => s.id === e.dataset.channelSlider);
    i && (i.value = Qe(e.value), this.checkDestabilization(), this.syncDom());
  }
  areAllChannelsAligned() {
    return this.channels.every((e) => Math.abs(e.value - e.target) <= e.tolerance);
  }
  isTargetVisible(e) {
    var r;
    const i = Math.abs(e.value - e.target), s = Number(this.profile.targetRevealRadius ?? ((r = this.profile.signalAlignment) == null ? void 0 : r.targetRevealRadius) ?? 100);
    return s >= 100 || i <= e.tolerance ? !0 : i <= s;
  }
  updateAlignmentState(e = this.areAllChannelsAligned()) {
    this.wasAligned && !e && this.recordTraceSpike(), this.wasAligned = e;
  }
  checkDestabilization() {
    this.updateAlignmentState();
  }
  recordTraceSpike() {
    var i, s;
    const e = Math.max(0, Number(this.profile.destabilizationPenaltySeconds ?? 0));
    this.state.mistakes += 1, this.state.tracePenaltySeconds += e, e > 0 && ((s = (i = ui.notifications) == null ? void 0 : i.warn) == null || s.call(i, `Signal destabilized. Trace jumped by ${e}s.`));
  }
  startTimer() {
    var r;
    if (this.timer || !this.state.hasStarted || !this.startedAt || !this.lastTickAt) return;
    const e = Number(game.settings.get(Wt, "traceDurationMultiplier") ?? 1) || 1, i = Number(((r = this.profile.signalAlignment) == null ? void 0 : r.traceDurationSeconds) ?? this.profile.traceDurationSeconds ?? 60), s = Math.max(5, i * e);
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const o = performance.now(), a = Math.min(0.5, (o - this.lastTickAt) / 1e3);
      this.lastTickAt = o, this.applyDrift(a);
      const c = this.areAllChannelsAligned();
      this.state.lockProgress = c ? Te(this.state.lockProgress + a / this.profile.lockHoldSeconds, 0, 1) : 0, this.updateAlignmentState(c);
      const u = (o - this.startedAt) / 1e3 + this.state.tracePenaltySeconds;
      this.state.traceProgress = Te(u / s * 100, 0, 100), this.syncDom(), this.state.lockProgress >= 1 ? this.finish("success", "Transmission Decrypted") : this.state.traceProgress >= 100 && this.finish("failure", "Trace Complete");
    }, 120);
  }
  applyDrift(e) {
    const i = Number(this.profile.signalDriftSpeed ?? 0);
    if (!(i <= 0))
      for (const s of this.channels)
        s.value = Qe(s.value + s.driftDirection * i * e), (s.value <= 0 || s.value >= 100) && (s.driftDirection *= -1);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(e, i, { close: s = !1 } = {}) {
    var o, a;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = e, this.stopTimer(), this.resultMessage = i, this.syncDom(), await this.render(!1), this.publishLiveState(!0);
    const r = {
      type: "signal-alignment",
      result: e,
      message: i,
      quickOutcome: this.quickOutcome,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      tracePenaltySeconds: this.state.tracePenaltySeconds,
      traceProgress: this.state.traceProgress,
      lockProgress: this.state.lockProgress,
      channels: this.channels.map((c) => ({ ...c }))
    };
    this.chatOnResult && await Ge({
      title: "Signal Alignment",
      result: e,
      actorName: this.actorName,
      message: i,
      quickOutcome: this.quickOutcome,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), e === "success" ? (o = this.onSuccess) == null || o.call(this, r) : (a = this.onFailure) == null || a.call(this, r), s && await this.close();
  }
  syncDom() {
    var c;
    const e = (c = this.element) == null ? void 0 : c[0];
    if (!e) return;
    const i = e.querySelector("[data-trace-fill]"), s = e.querySelector("[data-trace-text]"), r = e.querySelector("[data-mistake-text]"), o = e.querySelector("[data-lock-fill]"), a = e.querySelector("[data-lock-text]");
    i && (i.style.width = `${this.state.traceProgress}%`), s && (s.textContent = `${Math.round(this.state.traceProgress)}%`), r && (r.textContent = `${this.state.tracePenaltySeconds.toFixed(0)}s`), o && (o.style.width = `${Math.round(this.state.lockProgress * 100)}%`), a && (a.textContent = `${Math.round(this.state.lockProgress * 100)}%`);
    for (const u of this.channels) {
      const l = e.querySelector(`[data-channel-row="${u.id}"]`);
      if (!l) continue;
      const d = Math.abs(u.value - u.target) <= u.tolerance, h = this.isTargetVisible(u);
      l.classList.toggle("is-aligned", d), l.classList.toggle("is-target-visible", h), l.querySelector("[data-channel-value]").textContent = u.value.toFixed(1), l.querySelector("[data-channel-target]").textContent = h ? String(u.target) : "??", l.querySelector("[data-channel-delta]").textContent = h ? Math.abs(u.value - u.target).toFixed(1) : "--", l.querySelector("[data-channel-state]").textContent = d ? "locked" : h ? "signal found" : "searching";
      const f = l.querySelector("[data-channel-slider]");
      f && document.activeElement !== f && (f.value = u.value);
      const m = l.querySelector("[data-wave-fill]");
      m && (m.style.width = `${u.value}%`, m.style.setProperty("--wave-duration", `${Math.max(1.2, 3.2 - Number(this.profile.noiseLevel ?? 0) * 2)}s`));
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
        quickOutcome: this.quickOutcome,
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
    const i = this.state.result !== e.state.result;
    this.state = { ...e.state }, this.channels = (e.channels ?? []).map((s) => ({ ...s })), this.wasAligned = !!e.wasAligned, this.resultMessage = e.resultMessage || void 0, i ? this.render(!1) : this.syncDom();
  }
  markLiveSessionEnded() {
    this.liveEnded = !0, this.render(!1);
  }
  publishLiveState(e = !1) {
    var i;
    this.readOnly || (i = this.onLiveState) == null || i.call(this, this.serializeLiveState(), { immediate: e });
  }
}
const At = [
  { id: "cyan", label: "CYAN", color: "#4df6ff" },
  { id: "magenta", label: "MAGENTA", color: "#ff4fd8" },
  { id: "amber", label: "AMBER", color: "#ffc857" },
  { id: "lime", label: "LIME", color: "#8dff69" },
  { id: "violet", label: "VIOLET", color: "#a98cff" },
  { id: "red", label: "RED", color: "#ff6577" }
];
function ae(t, n, e) {
  return Math.min(e, Math.max(n, t));
}
function wn(t) {
  const n = String(t ?? "packet-switchboard");
  let e = 2166136261;
  for (let i = 0; i < n.length; i += 1)
    e ^= n.charCodeAt(i), e = Math.imul(e, 16777619);
  return e >>> 0;
}
function kn(t) {
  let n = wn(t);
  return () => {
    n += 1831565813;
    let e = n;
    return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
  };
}
function Qt(t) {
  return t < 0 ? "up" : t > 0 ? "down" : "straight";
}
function Yt(t, n) {
  const e = [0];
  return t > 0 && e.unshift(-1), t < n - 1 && e.push(1), e;
}
function Cn(t, n, e) {
  const i = Yt(n, e), s = i.indexOf(Number(t));
  return i[(s + 1) % i.length];
}
function Ye(t, n, e) {
  const i = Math.sign(Number(t) || 0);
  return Yt(n, e).includes(i) ? i : 0;
}
function In(t, n, e, i, s) {
  return t < n ? { shouldSpawn: !1, nextSpawnAt: n } : {
    shouldSpawn: i < s,
    nextSpawnAt: t + Math.max(350, e)
  };
}
function Mn(t, n, e = 0, i = (n == null ? void 0 : n.sourceRow) ?? 0) {
  let s = ae(Math.round(Number(i) || 0), 0, t.laneCount - 1);
  const r = [];
  for (let o = Math.max(0, Math.round(Number(e) || 0)); o < t.columnCount; o += 1) {
    const a = t.junctions.find((c) => c.row === s && c.column === o);
    a && (r.push(a.id), s = ae(s + Ye(a.direction, s, t.laneCount), 0, t.laneCount - 1));
  }
  return {
    junctionIds: r,
    finalRow: s,
    targetRow: Number((n == null ? void 0 : n.targetRow) ?? s),
    reachesTarget: s === Number((n == null ? void 0 : n.targetRow) ?? s)
  };
}
function Pn(t, n = Date.now()) {
  const e = t.packetSwitchboard ?? t, i = ae(Math.round(Number(e.laneCount) || 4), 3, At.length), s = ae(Math.round(Number(e.columnCount) || 6), i - 1, 8), r = ae(Math.round(Number(e.deliveryGoal) || 7), 3, 20), o = ae(Math.round(Number(e.previewCount) || 2), 0, 6), a = kn(n), c = At.slice(0, i).map((f, m) => ({
    ...f,
    row: m,
    inputPort: `IN-${String(m + 1).padStart(2, "0")}`,
    port: `OUT-${String(m + 1).padStart(2, "0")}`
  })), u = [];
  for (let f = 0; f < i; f += 1)
    for (let m = 0; m < s; m += 1)
      u.push({
        id: `junction-${f}-${m}`,
        row: f,
        column: m,
        gridRow: f + 1,
        gridColumn: m + 1,
        direction: 0,
        directionLabel: Qt(0)
      });
  const l = [], d = Math.max(r * 4, r + 12);
  let h = -1;
  for (let f = 0; f < d; f += 1) {
    let m = Math.floor(a() * i);
    m === h && i > 1 && (m = (m + 1 + Math.floor(a() * (i - 1))) % i), h = m;
    let S = Math.floor(a() * i);
    S === m && a() > 0.2 && (S = (S + 1 + Math.floor(a() * (i - 1))) % i);
    const b = c[m], w = c[S];
    l.push({
      id: `packet-${f + 1}`,
      sequence: f + 1,
      sourceRow: S,
      sourcePort: w.inputPort,
      targetRow: m,
      colorId: b.id,
      color: b.color,
      label: b.label,
      port: b.port
    });
  }
  return {
    laneCount: i,
    columnCount: s,
    deliveryGoal: r,
    previewCount: o,
    lanes: c,
    junctions: u,
    packetPlan: l
  };
}
function Nn(t) {
  return Qt(t);
}
const Xt = "holosuite-hacking", Ln = `modules/${Xt}/templates/packet-switchboard.html`, Tn = ue();
function ge(t, n, e) {
  return Math.min(e, Math.max(n, t));
}
function Rn(t, n, e) {
  var s;
  const i = typeof ((s = globalThis.crypto) == null ? void 0 : s.randomUUID) == "function" ? globalThis.crypto.randomUUID() : `${Date.now()}:${performance.now()}:${Math.random()}`;
  return `${t}:${n}:${e.profileId ?? e.id}:switchboard:${i}`;
}
class On extends Tn {
  constructor(e = {}) {
    super(e);
    p(this, "quickOutcome");
    p(this, "rollTotal");
    p(this, "dc");
    p(this, "profile");
    p(this, "tuning");
    p(this, "seed");
    p(this, "actorName");
    p(this, "onSuccess");
    p(this, "onFailure");
    p(this, "chatOnResult");
    p(this, "board");
    p(this, "state");
    p(this, "startedAt");
    p(this, "nextSpawnAt");
    p(this, "timer");
    p(this, "hoveredJunctionId");
    p(this, "boundHoveredKeydown");
    p(this, "resultMessage");
    p(this, "readOnly");
    p(this, "liveSessionId");
    p(this, "onLiveState");
    p(this, "onLiveEnd");
    p(this, "liveEnded");
    this.quickOutcome = e.quickOutcome ?? null, this.rollTotal = this.quickOutcome ? null : Number(e.rollTotal ?? 15), this.dc = this.quickOutcome ? null : Number(e.dc ?? 15), this.profile = e.profile ? { ...e.profile } : Y(this.rollTotal, this.dc, null, { quickOutcome: this.quickOutcome }), this.tuning = this.profile.packetSwitchboard ?? {}, this.seed = e.seed ?? Rn(this.rollTotal, this.dc, this.profile), this.actorName = String(e.actorName ?? "Hacker"), this.onSuccess = typeof e.onSuccess == "function" ? e.onSuccess : null, this.onFailure = typeof e.onFailure == "function" ? e.onFailure : null, this.chatOnResult = e.chatOnResult !== !1, this.readOnly = e.readOnly === !0, this.liveSessionId = String(e.liveSessionId ?? ""), this.onLiveState = typeof e.onLiveState == "function" ? e.onLiveState : null, this.onLiveEnd = typeof e.onLiveEnd == "function" ? e.onLiveEnd : null, this.liveEnded = !1, this.board = Pn(this.profile, this.seed), this.state = {
      hasStarted: !1,
      isRunning: !1,
      result: null,
      traceProgress: 0,
      tracePenaltySeconds: 0,
      delivered: 0,
      corrupted: 0,
      nextPacketIndex: 0,
      activePackets: []
    }, this.startedAt = null, this.nextSpawnAt = null, this.timer = null, this.hoveredJunctionId = null, this.boundHoveredKeydown = (i) => this.handleHoveredJunctionKeydown(i);
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
      template: Ln
    });
  }
  getData() {
    return {
      quickOutcome: this.quickOutcome,
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
    super.activateListeners(e), this.hoveredJunctionId = null, this.readOnly || (e.find("[data-junction-id]").on("click", (i) => this.cycleJunction(i.currentTarget.dataset.junctionId)), e.find("[data-junction-id]").on("mouseenter", (i) => this.setHoveredJunction(i.currentTarget.dataset.junctionId, i.currentTarget)), e.find("[data-junction-id]").on("mouseleave", (i) => this.clearHoveredJunction(i.currentTarget.dataset.junctionId, i.currentTarget)), e.find("[data-action='start']").on("click", () => this.startRun()), e.find("[data-action='abort']").on("click", () => this.abort())), e.find("[data-action='close']").on("click", () => this.close()), window.removeEventListener("keydown", this.boundHoveredKeydown), this.readOnly || window.addEventListener("keydown", this.boundHoveredKeydown), this.syncDom();
  }
  async render(e, i) {
    const s = await super.render(e, i);
    return !this.readOnly && this.state.hasStarted && this.state.isRunning && this.startTimer(), s;
  }
  async close(e = {}) {
    var s;
    const i = this.serializeLiveState();
    return this.stopTimer(), window.removeEventListener("keydown", this.boundHoveredKeydown), !this.readOnly && !this.liveEnded && (this.liveEnded = !0, (s = this.onLiveEnd) == null || s.call(this, i)), super.close(e);
  }
  getTraceDuration() {
    const e = Number(game.settings.get(Xt, "traceDurationMultiplier") ?? 1) || 1;
    return Math.max(5, Number(this.tuning.traceDurationSeconds ?? this.profile.traceDurationSeconds ?? 60) * e);
  }
  getUpcomingPackets() {
    const e = Math.max(0, Number(this.tuning.previewCount ?? this.board.previewCount) || 0);
    return this.board.packetPlan.slice(this.state.nextPacketIndex, this.state.nextPacketIndex + e);
  }
  getMaxActivePackets() {
    return ge(Math.round(Number(this.tuning.maxActivePackets) || 2), 1, 6);
  }
  startRun() {
    this.readOnly || this.state.hasStarted || this.state.result || (this.state.hasStarted = !0, this.state.isRunning = !0, this.startedAt = performance.now(), this.nextSpawnAt = this.startedAt, this.render(!1), this.publishLiveState(!0));
  }
  setHoveredJunction(e, i) {
    this.hoveredJunctionId = e, i == null || i.classList.add("is-keyboard-target");
  }
  clearHoveredJunction(e, i) {
    i == null || i.classList.remove("is-keyboard-target"), this.hoveredJunctionId === e && (this.hoveredJunctionId = null);
  }
  handleHoveredJunctionKeydown(e) {
    if (!this.hoveredJunctionId || e.altKey || e.ctrlKey || e.metaKey) return;
    const i = {
      ArrowUp: -1,
      ArrowRight: 0,
      ArrowDown: 1
    };
    e.key in i && (e.preventDefault(), e.stopPropagation(), this.setJunctionDirection(this.hoveredJunctionId, i[e.key]));
  }
  cycleJunction(e) {
    if (this.state.result) return;
    const i = this.board.junctions.find((s) => s.id === e);
    i && this.setJunctionDirection(e, Cn(i.direction, i.row, this.board.laneCount));
  }
  setJunctionDirection(e, i) {
    var o, a;
    if (this.state.result) return;
    const s = this.board.junctions.find((c) => c.id === e);
    if (!s) return;
    s.direction = Ye(i, s.row, this.board.laneCount), s.directionLabel = Nn(s.direction);
    const r = (a = (o = this.element) == null ? void 0 : o[0]) == null ? void 0 : a.querySelector(`[data-junction-id="${s.id}"]`);
    r && (r.dataset.direction = s.directionLabel, r.setAttribute("aria-label", `Junction lane ${s.row + 1}, column ${s.column + 1}: ${s.directionLabel}`), r.setAttribute("title", `Route ${s.directionLabel}. Click to change direction.`)), this.syncRoutePreview(), this.publishLiveState(!0);
  }
  startTimer() {
    this.timer || !this.state.hasStarted || !this.startedAt || (this.timer = window.setInterval(() => this.tick(performance.now()), 80));
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  tick(e) {
    if (!this.state.isRunning || !this.startedAt || this.nextSpawnAt === null) return;
    const i = Math.max(350, Number(this.tuning.packetIntervalSeconds ?? 2) * 1e3), s = In(
      e,
      this.nextSpawnAt,
      i,
      this.state.activePackets.length,
      this.getMaxActivePackets()
    );
    this.nextSpawnAt = s.nextSpawnAt, s.shouldSpawn && this.state.isRunning && this.spawnPacket(e);
    const r = Math.max(250, Number(this.tuning.packetStepSeconds ?? 0.8) * 1e3);
    for (const a of [...this.state.activePackets])
      for (; this.state.isRunning && e >= a.nextMoveAt && (this.advancePacket(a), a.nextMoveAt += r, !!this.state.activePackets.includes(a)); )
        ;
    const o = (e - this.startedAt) / 1e3 + this.state.tracePenaltySeconds;
    this.state.traceProgress = ge(o / this.getTraceDuration() * 100, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
  }
  spawnPacket(e) {
    const i = this.board.packetPlan[this.state.nextPacketIndex % this.board.packetPlan.length];
    this.state.nextPacketIndex += 1, this.state.activePackets.push({
      ...i,
      runtimeId: `${i.id}-${this.state.nextPacketIndex}`,
      row: i.sourceRow,
      column: -1,
      nextMoveAt: e + Math.max(0, Number(this.tuning.entryHoldSeconds ?? 1.5) * 1e3)
    }), this.syncPreview();
  }
  advancePacket(e) {
    if (e.column < 0) {
      e.column = 0;
      return;
    }
    const i = this.board.junctions.find((s) => s.row === e.row && s.column === e.column);
    e.row = ge(e.row + Number((i == null ? void 0 : i.direction) ?? 0), 0, this.board.laneCount - 1), e.column += 1, e.column >= this.board.columnCount && this.resolvePacket(e);
  }
  resolvePacket(e) {
    var s, r;
    if (this.state.activePackets = this.state.activePackets.filter((o) => o.runtimeId !== e.runtimeId), e.row === e.targetRow) {
      this.state.delivered += 1, this.flashBoard("delivery-pulse"), this.state.delivered >= this.board.deliveryGoal && this.finish("success", "Priority payload delivered");
      return;
    }
    this.state.corrupted += 1;
    const i = Math.max(0, Number(this.tuning.misroutePenaltySeconds ?? 5));
    this.state.tracePenaltySeconds += i, this.flashBoard("misroute-pulse"), i > 0 && ((r = (s = ui.notifications) == null ? void 0 : s.warn) == null || r.call(s, `Packet misrouted. Trace jumped by ${i}s.`));
  }
  flashBoard(e) {
    var s, r, o;
    const i = (r = (s = this.element) == null ? void 0 : s.find) == null ? void 0 : r.call(s, ".packet-switchboard-shell");
    (o = i == null ? void 0 : i.addClass) == null || o.call(i, e), window.setTimeout(() => {
      var a;
      return (a = i == null ? void 0 : i.removeClass) == null ? void 0 : a.call(i, e);
    }, 320);
  }
  syncPreview() {
    var i, s;
    const e = (s = (i = this.element) == null ? void 0 : i[0]) == null ? void 0 : s.querySelector("[data-packet-preview]");
    if (e) {
      if (e.replaceChildren(...this.getUpcomingPackets().map((r) => {
        const o = document.createElement("span");
        return o.className = "packet-preview-chip", o.style.setProperty("--packet-color", r.color), o.textContent = `${r.sourcePort} -> ${r.port} / ${r.label}`, o;
      })), !e.childElementCount) {
        const r = document.createElement("span");
        r.className = "packet-preview-hidden", r.textContent = "Encrypted", e.appendChild(r);
      }
      this.syncRoutePreview();
    }
  }
  syncRoutePreview() {
    var c, u, l;
    const e = (c = this.element) == null ? void 0 : c[0];
    if (!e) return;
    e.querySelectorAll(".packet-junction.is-route-preview, .packet-junction.is-route-danger").forEach((d) => {
      d.classList.remove("is-route-preview", "is-route-danger");
    }), e.querySelectorAll(".packet-switchboard-inputs .is-preview-source, .packet-switchboard-outputs .is-preview-target").forEach((d) => {
      d.classList.remove("is-preview-source", "is-preview-target");
    });
    const i = this.state.activePackets[0] ?? null, s = i ?? this.getUpcomingPackets()[0] ?? null;
    if (!s) {
      this.syncConnectionLines();
      return;
    }
    const r = i ? Math.max(0, Number(i.column) || 0) : 0, o = i ? i.row : s.sourceRow, a = Mn(this.board, s, r, o);
    for (const d of a.junctionIds) {
      const h = e.querySelector(`[data-junction-id="${d}"]`);
      h == null || h.classList.add("is-route-preview"), a.reachesTarget || h == null || h.classList.add("is-route-danger");
    }
    (u = e.querySelector(`[data-input-row="${s.sourceRow}"]`)) == null || u.classList.add("is-preview-source"), (l = e.querySelector(`[data-output-row="${s.targetRow}"]`)) == null || l.classList.add("is-preview-target"), this.syncConnectionLines();
  }
  syncConnectionLines() {
    var s;
    const e = (s = this.element) == null ? void 0 : s[0];
    if (!e) return;
    const i = 0.5 / this.board.columnCount * 100;
    for (const r of this.board.lanes) {
      const o = e.querySelector(`[data-input-connection-row="${r.row}"]`);
      if (!o) continue;
      const a = (r.row + 0.5) / this.board.laneCount * 100;
      o.setAttribute("x1", "0"), o.setAttribute("y1", String(a)), o.setAttribute("x2", String(i)), o.setAttribute("y2", String(a));
      const c = e.querySelector(`[data-input-row="${r.row}"]`), u = e.querySelector(".packet-junction.is-route-preview"), l = !!(c != null && c.classList.contains("is-preview-source"));
      o.classList.toggle("is-route-preview", l), o.classList.toggle("is-route-danger", l && !!(u != null && u.classList.contains("is-route-danger")));
    }
    for (const r of this.board.junctions) {
      const o = e.querySelector(`[data-connection-id="${r.id}"]`);
      if (!o) continue;
      const a = Ye(r.direction, r.row, this.board.laneCount), c = ge(r.row + a, 0, this.board.laneCount - 1), u = (r.column + 0.5) / this.board.columnCount * 100, l = r.column >= this.board.columnCount - 1 ? 100 : (r.column + 1.5) / this.board.columnCount * 100, d = (r.row + 0.5) / this.board.laneCount * 100, h = (c + 0.5) / this.board.laneCount * 100;
      o.setAttribute("x1", String(u)), o.setAttribute("y1", String(d)), o.setAttribute("x2", String(l)), o.setAttribute("y2", String(h));
      const f = e.querySelector(`[data-junction-id="${r.id}"]`);
      o.classList.toggle("is-route-preview", !!(f != null && f.classList.contains("is-route-preview"))), o.classList.toggle("is-route-danger", !!(f != null && f.classList.contains("is-route-danger")));
    }
  }
  syncPackets() {
    var s, r;
    const e = (r = (s = this.element) == null ? void 0 : s[0]) == null ? void 0 : r.querySelector("[data-packet-layer]");
    if (!e) return;
    const i = new Set(this.state.activePackets.map((o) => o.runtimeId));
    e.querySelectorAll("[data-runtime-packet]").forEach((o) => {
      const a = o;
      i.has(a.dataset.runtimePacket) || a.remove();
    });
    for (const o of this.state.activePackets) {
      let a = e.querySelector(`[data-runtime-packet="${o.runtimeId}"]`);
      if (!a) {
        a = document.createElement("div"), a.className = "switchboard-packet", a.dataset.runtimePacket = o.runtimeId, a.style.setProperty("--packet-color", o.color);
        const l = document.createElement("span");
        l.textContent = String(o.targetRow + 1), a.appendChild(l), a.title = `${o.label} packet to ${o.port}`, e.appendChild(a);
      }
      const c = o.column < 0 ? 0 : (o.column + 0.5) / this.board.columnCount * 100, u = (o.row + 0.5) / this.board.laneCount * 100;
      a.style.left = `${ge(c, 0, 100)}%`, a.style.top = `${u}%`;
    }
  }
  syncDom() {
    var o;
    const e = (o = this.element) == null ? void 0 : o[0];
    if (!e) return;
    const i = e.querySelector("[data-trace-fill]"), s = e.querySelector("[data-delivery-fill]");
    i && (i.style.width = `${this.state.traceProgress}%`), s && (s.style.width = `${Math.min(100, this.state.delivered / this.board.deliveryGoal * 100)}%`);
    const r = {
      "[data-trace-text]": `${Math.round(this.state.traceProgress)}%`,
      "[data-delivery-text]": `${this.state.delivered} / ${this.board.deliveryGoal}`,
      "[data-corrupted-text]": String(this.state.corrupted),
      "[data-active-text]": `${this.state.activePackets.length} / ${this.getMaxActivePackets()}`
    };
    for (const [a, c] of Object.entries(r)) {
      const u = e.querySelector(a);
      u && (u.textContent = c);
    }
    this.syncPackets(), this.syncRoutePreview(), this.publishLiveState();
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(e, i, { close: s = !1 } = {}) {
    var o, a;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = e, this.stopTimer(), this.resultMessage = i, await this.render(!1), this.publishLiveState(!0);
    const r = {
      type: "packet-switchboard",
      result: e,
      message: i,
      quickOutcome: this.quickOutcome,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      delivered: this.state.delivered,
      corrupted: this.state.corrupted,
      tracePenaltySeconds: this.state.tracePenaltySeconds,
      traceProgress: this.state.traceProgress
    };
    this.chatOnResult && await Ge({
      title: "Packet Switchboard",
      result: e,
      actorName: this.actorName,
      message: i,
      quickOutcome: this.quickOutcome,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), e === "success" ? (o = this.onSuccess) == null || o.call(this, r) : (a = this.onFailure) == null || a.call(this, r), s && await this.close();
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
        quickOutcome: this.quickOutcome,
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
    const i = JSON.stringify({
      junctions: this.board.junctions.map((r) => [r.id, r.direction]),
      result: this.state.result
    });
    this.state = {
      ...e.state,
      activePackets: (e.state.activePackets ?? []).map((r) => ({ ...r }))
    };
    for (const r of e.junctions ?? []) {
      const o = this.board.junctions.find((a) => a.id === r.id);
      o && Object.assign(o, r);
    }
    this.resultMessage = e.resultMessage || void 0;
    const s = JSON.stringify({
      junctions: this.board.junctions.map((r) => [r.id, r.direction]),
      result: this.state.result
    });
    i !== s ? this.render(!1) : (this.syncPreview(), this.syncDom());
  }
  markLiveSessionEnded() {
    this.liveEnded = !0, this.render(!1);
  }
  publishLiveState(e = !1) {
    var i;
    this.readOnly || (i = this.onLiveState) == null || i.call(this, this.serializeLiveState(), { immediate: e });
  }
}
const An = ["#57f3ff", "#b779ff", "#ffcd57", "#66ffad"];
function ie(t, n, e) {
  return Math.min(e, Math.max(n, t));
}
function W(t, n) {
  return (Math.round(t) % n + n) % n;
}
function Dn(t) {
  const n = String(t ?? "prism-lock");
  let e = 2166136261;
  for (let i = 0; i < n.length; i += 1)
    e ^= n.charCodeAt(i), e = Math.imul(e, 16777619);
  return e >>> 0;
}
function $n(t) {
  let n = Dn(t);
  return () => {
    n += 1831565813;
    let e = n;
    return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
  };
}
function Dt(t, n) {
  const e = [...t];
  for (let i = e.length - 1; i > 0; i -= 1) {
    const s = Math.floor(n() * (i + 1));
    [e[i], e[s]] = [e[s], e[i]];
  }
  return e;
}
function oe(t, n, e) {
  const i = W(t, e) / e * Math.PI * 2 - Math.PI / 2;
  return {
    x: 50 + Math.cos(i) * n,
    y: 50 + Math.sin(i) * n
  };
}
function $t(t, n) {
  return t.find((e) => e.id === n.id) ?? {
    id: n.id,
    rotation: n.initialRotation ?? 0,
    enabled: n.initialEnabled !== !1
  };
}
function se(t, n) {
  const e = /* @__PURE__ */ new Set(), i = [], s = [], r = [];
  for (const c of t.rings) {
    const u = $t(n, c);
    if (u.enabled)
      for (const l of c.blockers) {
        const d = W(l.baseSlot + u.rotation, t.slotCount);
        r.push({
          id: l.id,
          ringId: c.id,
          ringIndex: c.index,
          slot: d,
          color: c.color,
          ...oe(d, c.radius, t.slotCount)
        });
      }
  }
  for (const c of t.rings) {
    const u = $t(n, c);
    if (u.enabled)
      for (const l of c.emitters) {
        const d = W(l.baseSlot + u.rotation, t.slotCount), h = oe(d, c.radius, t.slotCount), f = r.filter((b) => b.ringIndex > c.index && b.slot === d).sort((b, w) => b.ringIndex - w.ringIndex)[0] ?? null, m = f ? Math.max(c.radius + 1, t.rings[f.ringIndex].radius - 2.2) : t.receiverRadius, S = oe(d, m, t.slotCount);
        f || e.add(d), s.push({
          id: l.id,
          ringId: c.id,
          slot: d,
          color: c.color,
          x: h.x,
          y: h.y
        }), i.push({
          id: `${l.id}-beam`,
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
  const o = t.receivers.map((c) => ({
    ...c,
    lit: e.has(c.slot),
    ...oe(c.slot, t.receiverRadius, t.slotCount)
  })), a = t.iceReceivers.map((c) => {
    const u = oe(c.slot, t.receiverRadius, t.slotCount);
    return {
      ...c,
      lit: e.has(c.slot),
      ...u,
      rectX: u.x - 2.2,
      rectY: u.y - 2.2
    };
  });
  return {
    beams: i,
    emitters: s,
    blockers: r,
    receivers: o,
    iceReceivers: a,
    litSlots: [...e],
    activeIceSlots: a.filter((c) => c.lit).map((c) => c.slot),
    litReceiverCount: o.filter((c) => c.lit).length,
    solved: o.every((c) => c.lit) && a.every((c) => !c.lit)
  };
}
function xn(t, n, e, i) {
  return t.map((s) => s.id === n ? { ...s, rotation: W(s.rotation + Math.sign(e), i) } : { ...s });
}
function En(t, n = Date.now()) {
  var T;
  const e = t.prismLock ?? t, i = $n(n), s = ie(Math.round(Number(e.ringCount) || 3), 2, 4), r = ie(Math.round(Number(e.slotCount) || 10), 8, 16), o = ie(Math.round(Number(e.receiverCount) || 4), 2, Math.min(8, r - 2)), a = ie(Math.round(Number(e.switchableRingCount) || 0), 0, s - 1), c = Math.min(4, r - o), u = a > 0 && c > 0 ? 1 : 0, l = ie(Math.round(Number(e.iceReceiverCount) || 0), u, c), d = s - a, h = ie(Math.round(Number(e.blockersPerRing) || 0), 0, 3), f = ie(Math.round(Number(e.scrambleSteps) || 3), 1, Math.floor(r / 2)), m = Dt(Array.from({ length: r }, (g, y) => y), i), S = m.slice(0, o), b = m.slice(o, o + l), w = Array.from({ length: s }, () => Math.floor(i() * r)), v = S.map((g, y) => ({
    slot: g,
    ringIndex: y % d
  })), I = Array.from({ length: s }, (g, y) => {
    const k = w[y], N = y >= d, M = v.filter((A) => A.ringIndex === y).map((A) => A.slot), O = N ? [b[(y - d) % Math.max(1, b.length)] ?? m.at(-1) ?? 0] : M, x = /* @__PURE__ */ new Set([...S, ...b]), j = Dt(
      Array.from({ length: r }, (A, E) => E).filter((A) => !x.has(A)),
      i
    ).slice(0, h), F = 1 + Math.floor(i() * f);
    return {
      id: `ring-${y + 1}`,
      index: y,
      label: `RING ${String(y + 1).padStart(2, "0")}`,
      color: An[y],
      radius: 14 + y * 8,
      switchable: N,
      solvedRotation: k,
      solvedEnabled: !N,
      initialRotation: W(k + F, r),
      initialEnabled: !0,
      emitters: O.map((A, E) => ({
        id: `ring-${y + 1}-emitter-${E + 1}`,
        baseSlot: W(A - k, r)
      })),
      blockers: j.map((A, E) => ({
        id: `ring-${y + 1}-blocker-${E + 1}`,
        baseSlot: W(A - k, r)
      }))
    };
  }), P = {
    ringCount: s,
    slotCount: r,
    receiverCount: o,
    receiverRadius: 46,
    rings: I,
    receivers: S.map((g, y) => ({ id: `receiver-${y + 1}`, slot: g })),
    iceReceivers: b.map((g, y) => ({ id: `ice-${y + 1}`, slot: g })),
    ticks: Array.from({ length: r }, (g, y) => ({
      slot: y,
      ...oe(y, 42.5, r)
    })),
    solutionStates: I.map((g) => ({ id: g.id, rotation: g.solvedRotation, enabled: g.solvedEnabled })),
    initialStates: I.map((g) => ({ id: g.id, rotation: g.initialRotation, enabled: g.initialEnabled }))
  };
  if (se(P, P.initialStates).solved) {
    let g = P.initialStates;
    e: for (const y of I)
      for (let k = 1; k < r; k += 1) {
        const N = P.initialStates.map((M) => M.id === y.id ? { ...M, rotation: W(M.rotation + k, r) } : { ...M });
        if (!se(P, N).solved) {
          g = N;
          break e;
        }
      }
    P.initialStates = g;
    for (const y of I)
      y.initialRotation = ((T = P.initialStates.find((k) => k.id === y.id)) == null ? void 0 : T.rotation) ?? y.initialRotation;
  }
  return P;
}
const Zt = "holosuite-hacking", qn = `modules/${Zt}/templates/prism-lock.html`, Hn = ue();
function Fn(t, n, e) {
  return Math.min(e, Math.max(n, t));
}
function _n(t, n, e) {
  var s;
  const i = typeof ((s = globalThis.crypto) == null ? void 0 : s.randomUUID) == "function" ? globalThis.crypto.randomUUID() : `${Date.now()}:${performance.now()}:${Math.random()}`;
  return `${t}:${n}:${e.profileId ?? e.id}:prism:${i}`;
}
class Un extends Hn {
  constructor(e = {}) {
    super(e);
    p(this, "quickOutcome");
    p(this, "rollTotal");
    p(this, "dc");
    p(this, "profile");
    p(this, "tuning");
    p(this, "seed");
    p(this, "actorName");
    p(this, "onSuccess");
    p(this, "onFailure");
    p(this, "chatOnResult");
    p(this, "board");
    p(this, "state");
    p(this, "startedAt");
    p(this, "timer");
    p(this, "previousIceSlots");
    p(this, "resultMessage");
    p(this, "readOnly");
    p(this, "liveSessionId");
    p(this, "onLiveState");
    p(this, "onLiveEnd");
    p(this, "liveEnded");
    this.quickOutcome = e.quickOutcome ?? null, this.rollTotal = this.quickOutcome ? null : Number(e.rollTotal ?? 15), this.dc = this.quickOutcome ? null : Number(e.dc ?? 15), this.profile = e.profile ? { ...e.profile } : Y(this.rollTotal, this.dc, null, { quickOutcome: this.quickOutcome }), this.tuning = this.profile.prismLock ?? {}, this.seed = e.seed ?? _n(this.rollTotal, this.dc, this.profile), this.actorName = String(e.actorName ?? "Hacker"), this.onSuccess = typeof e.onSuccess == "function" ? e.onSuccess : null, this.onFailure = typeof e.onFailure == "function" ? e.onFailure : null, this.chatOnResult = e.chatOnResult !== !1, this.readOnly = e.readOnly === !0, this.liveSessionId = String(e.liveSessionId ?? ""), this.onLiveState = typeof e.onLiveState == "function" ? e.onLiveState : null, this.onLiveEnd = typeof e.onLiveEnd == "function" ? e.onLiveEnd : null, this.liveEnded = !1, this.board = En(this.profile, this.seed), this.state = {
      rings: this.board.initialStates.map((i) => ({ ...i })),
      hasStarted: !1,
      isRunning: !1,
      result: null,
      traceProgress: 0,
      tracePenaltySeconds: 0,
      moves: 0
    }, this.startedAt = null, this.timer = null, this.previousIceSlots = new Set(se(this.board, this.state.rings).activeIceSlots);
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
      template: qn
    });
  }
  getData() {
    const e = se(this.board, this.state.rings), i = this.board.rings.map((s) => {
      const r = this.state.rings.find((o) => o.id === s.id) ?? {};
      return {
        ...s,
        rotation: r.rotation ?? 0,
        enabled: r.enabled !== !1,
        statusLabel: r.enabled === !1 ? "phased out" : "active"
      };
    });
    return {
      quickOutcome: this.quickOutcome,
      rollTotal: this.rollTotal,
      dc: this.dc,
      isReadOnly: this.readOnly,
      isLiveEnded: this.liveEnded,
      profile: this.profile,
      tuning: this.tuning,
      board: this.board,
      rings: i,
      evaluation: e,
      state: this.state,
      receiverPercent: Math.round(e.litReceiverCount / this.board.receiverCount * 100),
      resultTitle: this.state.result === "success" ? "Lattice Resolved" : "Prism Lock Rejected",
      resultDetail: this.resultMessage ?? (this.state.result === "success" ? "All authorization receptors illuminated." : "Trace completed before alignment."),
      glitchClass: this.profile.visualGlitchIntensity > 0.7 ? "glitch-high" : this.profile.visualGlitchIntensity > 0.35 ? "glitch-medium" : "glitch-low"
    };
  }
  activateListeners(e) {
    super.activateListeners(e), this.readOnly || (e.find("[data-action='rotate-ring']").on("click", (i) => {
      this.rotateRing(i.currentTarget.dataset.ringId, Number(i.currentTarget.dataset.direction));
    }), e.find("[data-action='toggle-ring']").on("click", (i) => this.toggleRing(i.currentTarget.dataset.ringId)), e.find("[data-action='start']").on("click", () => this.startRun()), e.find("[data-action='abort']").on("click", () => this.abort())), e.find("[data-action='close']").on("click", () => this.close()), this.syncDom();
  }
  async render(e, i) {
    const s = await super.render(e, i);
    return !this.readOnly && this.state.hasStarted && this.state.isRunning && this.startTimer(), s;
  }
  async close(e = {}) {
    var s;
    const i = this.serializeLiveState();
    return this.stopTimer(), !this.readOnly && !this.liveEnded && (this.liveEnded = !0, (s = this.onLiveEnd) == null || s.call(this, i)), super.close(e);
  }
  getTraceDuration() {
    const e = Number(game.settings.get(Zt, "traceDurationMultiplier") ?? 1) || 1;
    return Math.max(5, Number(this.tuning.traceDurationSeconds ?? this.profile.traceDurationSeconds ?? 60) * e);
  }
  startRun() {
    this.readOnly || this.state.hasStarted || this.state.result || (this.state.hasStarted = !0, this.state.isRunning = !0, this.startedAt = performance.now(), this.previousIceSlots = new Set(se(this.board, this.state.rings).activeIceSlots), this.render(!1), this.publishLiveState(!0));
  }
  rotateRing(e, i) {
    !this.state.isRunning || !i || (this.state.rings = xn(this.state.rings, e, i, this.board.slotCount), this.state.moves += 1, this.evaluateMove());
  }
  toggleRing(e) {
    if (!this.state.isRunning) return;
    const i = this.board.rings.find((s) => s.id === e);
    i != null && i.switchable && (this.state.rings = this.state.rings.map((s) => s.id === e ? { ...s, enabled: !s.enabled } : { ...s }), this.state.moves += 1, this.evaluateMove());
  }
  evaluateMove() {
    var s, r;
    const e = se(this.board, this.state.rings), i = e.activeIceSlots.filter((o) => !this.previousIceSlots.has(o));
    if (this.previousIceSlots = new Set(e.activeIceSlots), i.length) {
      const o = Math.max(0, Number(this.tuning.icePenaltySeconds ?? 5)) * i.length;
      this.state.tracePenaltySeconds += o, o > 0 && ((r = (s = ui.notifications) == null ? void 0 : s.warn) == null || r.call(s, `ICE receptor energized. Trace jumped by ${o}s.`));
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
      this.state.traceProgress = Fn(e / this.getTraceDuration() * 100, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
    }, 120));
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  syncDom() {
    var r;
    const e = (r = this.element) == null ? void 0 : r[0];
    if (!e) return;
    const i = e.querySelector("[data-trace-fill]"), s = e.querySelector("[data-trace-text]");
    i && (i.style.width = `${this.state.traceProgress}%`), s && (s.textContent = `${Math.round(this.state.traceProgress)}%`), this.publishLiveState();
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(e, i, { close: s = !1 } = {}) {
    var a, c;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = e, this.stopTimer(), this.resultMessage = i, await this.render(!1), this.publishLiveState(!0);
    const r = se(this.board, this.state.rings), o = {
      type: "prism-lock",
      result: e,
      message: i,
      quickOutcome: this.quickOutcome,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      moves: this.state.moves,
      litReceiverCount: r.litReceiverCount,
      activeIceSlots: r.activeIceSlots,
      tracePenaltySeconds: this.state.tracePenaltySeconds,
      traceProgress: this.state.traceProgress
    };
    this.chatOnResult && await Ge({
      title: "Prism Lock",
      result: e,
      actorName: this.actorName,
      message: i,
      quickOutcome: this.quickOutcome,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), e === "success" ? (a = this.onSuccess) == null || a.call(this, o) : (c = this.onFailure) == null || c.call(this, o), s && await this.close();
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
        quickOutcome: this.quickOutcome,
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
    const i = JSON.stringify({ rings: this.state.rings, result: this.state.result });
    this.state = {
      ...e.state,
      rings: (e.state.rings ?? []).map((r) => ({ ...r }))
    }, this.previousIceSlots = new Set(e.previousIceSlots ?? []), this.resultMessage = e.resultMessage || void 0;
    const s = JSON.stringify({ rings: this.state.rings, result: this.state.result });
    i !== s ? this.render(!1) : this.syncDom();
  }
  markLiveSessionEnded() {
    this.liveEnded = !0, this.render(!1);
  }
  publishLiveState(e = !1) {
    var i;
    this.readOnly || (i = this.onLiveState) == null || i.call(this, this.serializeLiveState(), { immediate: e });
  }
}
const R = "holosuite-hacking", X = `module.${R}`, jn = 10 * 60 * 1e3, Gn = 200;
let H = null, Re = null;
const Ue = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map();
function zn() {
  game.settings.register(R, "quickHackMode", {
    name: "Quick Hack launcher mode",
    scope: "client",
    config: !1,
    type: Boolean,
    default: !1
  }), game.settings.register(R, "showSkillModifiers", {
    name: "Show Skill Modifiers",
    hint: "Show modifiers and skill percentages when choosing a character's skill. Display only; does not change rolls.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(R, "defaultRollSource", {
    name: "Hacking Roll Source",
    hint: "System skill roll uses the system's dialog. Roll from character sheet uses a chat result. Custom dice roll uses your dice and modifiers. Used as the initial choice for new attached hacks.",
    scope: "world",
    config: !0,
    type: String,
    default: Ft(),
    choices: { custom: "Custom dice roll", system: "System skill roll", sheet: "Roll from character sheet" }
  }), game.settings.register(R, "defaultStaticModifier", {
    name: "Hacking Custom Static Modifier",
    hint: "Extra adjustment for custom checks. Negative numbers subtract. Used as the initial choice for new attached hacks; existing hacks keep their own settings.",
    scope: "world",
    config: !0,
    type: Number,
    default: 0
  }), game.settings.register(R, "defaultDiceCount", {
    name: "Hacking Custom Dice Count",
    hint: "Roll this many dice and keep one result in Custom dice roll mode.",
    scope: "world",
    config: !0,
    type: Number,
    default: 1,
    choices: Object.fromEntries(Array.from({ length: 10 }, (t, n) => [n + 1, String(n + 1)]))
  }), game.settings.register(R, "defaultKeepResult", {
    name: "Hacking Custom Result",
    hint: "Keep the best or worst die. Best means highest when high rolls are positive, and lowest when low rolls are positive.",
    scope: "world",
    config: !0,
    type: String,
    default: "best",
    choices: { best: "Keep best", worst: "Keep worst" }
  }), game.settings.register(R, "defaultDieSides", {
    name: "Hacking Check Die",
    hint: "Choose a standard or system-registered numbered die. The last launcher choice is saved here and used initially for new attached hacks.",
    scope: "world",
    config: !0,
    type: Number,
    default: V() ? 100 : 20,
    choices: () => Object.fromEntries(Et(game.settings.get(R, "defaultDieSides")).map(({ value: t, label: n }) => [t, n]))
  }), game.settings.register(R, "defaultRollDirection", {
    name: "Hacking Positive Rolls",
    hint: "High: meet or exceed the DC. Low: meet or roll under the DC. Natural best/worst faces also follow this choice. Skill modifiers are still added as shown.",
    scope: "world",
    config: !0,
    type: String,
    default: V() ? "low" : "high",
    choices: { high: "High rolls are positive", low: "Low rolls are positive" }
  }), game.settings.register(R, "defaultDc", {
    name: "Default Hacking DC",
    hint: "Used by the GM launcher and API calls that omit a DC.",
    scope: "world",
    config: !0,
    type: Number,
    default: 15
  }), game.settings.register(R, "traceDurationMultiplier", {
    name: "Default Trace Duration Multiplier",
    hint: "Multiplies trace timers for all HoloSuite hacking minigames.",
    scope: "world",
    config: !0,
    type: Number,
    default: 1
  }), game.settings.register(R, "nodeTakeoverDurationSeconds", {
    name: "Node Takeover Duration Override",
    hint: "Optional fixed seconds for claiming a Node Intrusion node. Set to 0 to use the selected difficulty profile.",
    scope: "world",
    config: !0,
    type: Number,
    default: 0
  }), game.settings.registerMenu(R, "difficultyProfilesMenu", {
    name: "Difficulty Profiles",
    label: "Configure Profiles",
    hint: "Tune Node Intrusion, Signal Alignment, Packet Switchboard, and Prism Lock difficulty settings.",
    icon: "fas fa-sliders",
    type: Qi,
    restricted: !0
  }), game.settings.register(R, "difficultyProfileOverrides", {
    name: "Difficulty Profile Data",
    hint: "Internal storage for the Difficulty Profiles configuration menu.",
    scope: "world",
    config: !1,
    type: String,
    default: ""
  }), game.settings.register(R, "allowPlayerInteraction", {
    name: "Allow Players To Interact Directly",
    hint: "Reserved for future player-targeted play. The GM launcher remains GM-only for now.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(R, "defaultLiveAudience", {
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
  }), game.settings.register(R, "watchOtherHacks", {
    name: "Watch Other Players' Hacks",
    hint: "Automatically open read-only live views for hacks included in the GM's selected audience. This preference only affects your client.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !0,
    onChange: (t) => {
      t ? ni() : Qn();
    }
  }), game.settings.register(R, "visualGlitchIntensity", {
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
function Bn() {
  Me({
    id: "node-intrusion",
    title: "Node Intrusion",
    icon: "fa-solid fa-network-wired",
    create: (t) => new mn(t)
  }), Me({
    id: "signal-alignment",
    title: "Signal Alignment",
    icon: "fa-solid fa-wave-square",
    create: (t) => new vn(t)
  }), Me({
    id: "packet-switchboard",
    title: "Packet Switchboard",
    icon: "fa-solid fa-shuffle",
    create: (t) => new On(t)
  }), Me({
    id: "prism-lock",
    title: "Prism Lock",
    icon: "fa-solid fa-bullseye",
    create: (t) => new Un(t)
  });
}
function ei() {
  var t, n, e;
  return (t = game.user) != null && t.isGM ? (Re = Re ?? new zt({ api: H }), Re.render(!0), Re) : ((e = (n = ui.notifications) == null ? void 0 : n.warn) == null || e.call(n, "Only the GM can open HoloSuite Hacking."), null);
}
function ti() {
  H = H ?? Ai({ moduleId: R, openLauncher: ei, openConfiguration: Ui, createLiveController: ii }), H.sendHackToPlayer = Vn, H.registerWithHoloSuite = Xe;
  const t = game.modules.get(R);
  return t && (t.api = H), game.holosuiteHacking = H, H;
}
function Vn(t = {}) {
  var a, c, u, l, d, h, f, m, S;
  if (!((a = game.user) != null && a.isGM))
    return (u = (c = ui.notifications) == null ? void 0 : c.warn) == null || u.call(c, "Only the GM can send HoloSuite hacking challenges."), !1;
  if (!game.socket)
    return (d = (l = ui.notifications) == null ? void 0 : l.error) == null || d.call(l, "Foundry sockets are not available."), !1;
  const n = si(t), e = it(n.userId);
  if (n.quickOutcome && (!e || e.isGM || e.active === !1))
    return (f = (h = ui.notifications) == null ? void 0 : h.warn) == null || f.call(h, "Choose a connected player for Quick Hack."), !1;
  const i = ri(n.actorId, e);
  i ? e && !ee(i, e) && console.warn(`${R} | ${e.name} does not appear to own ${i.name}; sending fallback roll data anyway.`) : console.warn(`${R} | Could not resolve hacker actor.`, {
    actorId: n.actorId,
    userId: n.userId,
    availableUsers: tt().map((b) => ({ id: b.id, name: b.name, isGM: b.isGM })),
    userCharacter: ce(e),
    ownedActors: nt(e).map((b) => ({ id: b.id, name: b.name }))
  });
  const s = n.quickOutcome ? null : te(i, n.skillId), r = n.quickOutcome ? "GM-selected outcome" : n.skillLabel || ke(n.skillId, s), o = s != null ? Ce(s) : n.skillModifier;
  if (typeof t.onSuccess == "function" || typeof t.onFailure == "function") {
    const b = window.setTimeout(() => Ue.delete(n.requestId), jn);
    Ue.set(n.requestId, {
      onSuccess: typeof t.onSuccess == "function" ? t.onSuccess : null,
      onFailure: typeof t.onFailure == "function" ? t.onFailure : null,
      timeoutId: b
    });
  }
  return game.socket.emit(X, {
    type: "launch-request",
    payload: {
      ...n,
      actorId: (i == null ? void 0 : i.id) ?? "",
      actorName: (i == null ? void 0 : i.name) ?? (e == null ? void 0 : e.name) ?? "Hacker",
      skillLabel: r,
      skillModifier: o,
      gmUserId: game.user.id
    }
  }), (S = (m = ui.notifications) == null ? void 0 : m.info) == null || S.call(m, `${ve(n.minigameType)} sent${e ? ` to ${e.name}` : " to players"}.`), !0;
}
function Jn(t) {
  var n, e, i, s, r;
  try {
    if (String((t == null ? void 0 : t.type) ?? "").startsWith("live-")) {
      Kn(t);
      return;
    }
    if ((t == null ? void 0 : t.type) === "result-report") {
      es(t.payload ?? {});
      return;
    }
    if ((t == null ? void 0 : t.type) !== "launch-request") return;
    const o = si(t.payload ?? {});
    if (o.userId && o.userId !== ((n = game.user) == null ? void 0 : n.id) || !o.userId && ((e = game.user) != null && e.isGM) || o.quickOutcome && !((i = it(o.gmUserId)) != null && i.isGM)) return;
    new Dialog({
      title: ve(o.minigameType),
      content: ts(o),
      buttons: {
        start: {
          icon: '<i class="fa-solid fa-terminal"></i>',
          label: o.quickOutcome ? "HACK" : "Accept and roll",
          callback: async () => Xn(o)
        }
      },
      default: "start"
    }, {
      classes: ["holosuite-hacking-start-dialog"],
      width: 520,
      height: 320,
      resizable: !0
    }).render(!0);
  } catch (o) {
    console.error(`${R} | Failed to handle hacking launch request.`, o), (r = (s = ui.notifications) == null ? void 0 : s.error) == null || r.call(s, "HoloSuite Hacking launch failed. See console for details.");
  }
}
function ii(t) {
  var u;
  const n = String(t.requestId ?? foundry.utils.randomID()), e = be(t.liveAudience) !== "none";
  if (!e)
    return {
      start: () => {
      },
      publish: null,
      end: null,
      cancel: () => {
      }
    };
  const i = {
    sessionId: n,
    audience: be(t.liveAudience),
    hackerUserId: String(((u = game.user) == null ? void 0 : u.id) ?? t.userId ?? ""),
    gmUserId: String(t.gmUserId ?? ""),
    startPayload: null,
    latestState: null,
    lastSentAt: 0,
    timeoutId: null,
    started: !1
  }, s = () => {
    var l, d;
    i.timeoutId = null, !(!e || !i.started || !i.latestState) && (i.lastSentAt = Date.now(), (d = (l = game.socket) == null ? void 0 : l.emit) == null || d.call(l, X, {
      type: "live-state",
      payload: {
        sessionId: n,
        hackerUserId: i.hackerUserId,
        audience: i.audience,
        state: i.latestState
      }
    }));
  }, r = (l, { immediate: d = !1 } = {}) => {
    if (!e || !l || (i.latestState = l, !i.started)) return;
    const h = Gn - (Date.now() - i.lastSentAt);
    d || h <= 0 ? (i.timeoutId && window.clearTimeout(i.timeoutId), s()) : i.timeoutId || (i.timeoutId = window.setTimeout(s, h));
  };
  return { start: (l) => {
    var d, h;
    !e || !l || (i.started = !0, i.startPayload = {
      sessionId: n,
      audience: i.audience,
      hackerUserId: i.hackerUserId,
      gmUserId: i.gmUserId,
      minigameType: String(l.type ?? t.minigameType),
      options: l.options ?? {},
      state: l.state ?? null
    }, i.latestState = l.state ?? i.latestState, xe.set(n, i), (h = (d = game.socket) == null ? void 0 : d.emit) == null || h.call(d, X, { type: "live-start", payload: i.startPayload }), i.latestState && r(i.latestState, { immediate: !0 }));
  }, publish: r, end: (l = null) => {
    var d, h;
    i.timeoutId && window.clearTimeout(i.timeoutId), l && (i.latestState = l), xe.delete(n), !(!e || !i.started) && ((h = (d = game.socket) == null ? void 0 : d.emit) == null || h.call(d, X, {
      type: "live-end",
      payload: {
        sessionId: n,
        hackerUserId: i.hackerUserId,
        audience: i.audience,
        state: i.latestState
      }
    }), i.started = !1);
  }, cancel: () => {
    i.timeoutId && window.clearTimeout(i.timeoutId), xe.delete(n), i.started = !1;
  } };
}
function Kn(t) {
  var r, o, a, c, u, l, d, h, f;
  const n = (t == null ? void 0 : t.payload) ?? {};
  if (t.type === "live-sync-request") {
    const m = String(n.observerUserId ?? "");
    if (!m || m === ((r = game.user) == null ? void 0 : r.id)) return;
    for (const S of xe.values())
      !S.started || !S.startPayload || (a = (o = game.socket) == null ? void 0 : o.emit) == null || a.call(o, X, {
        type: "live-start",
        payload: { ...S.startPayload, state: S.latestState, observerUserId: m }
      });
    return;
  }
  const e = String(n.observerUserId ?? "");
  if (e && e !== ((c = game.user) == null ? void 0 : c.id) || !Wn(n)) return;
  const i = String(n.sessionId ?? "");
  if (!i) return;
  if (t.type === "live-start") {
    Yn(n);
    return;
  }
  const s = Q.get(i);
  s && (n.state && ((u = s.applyLiveState) == null || u.call(s, n.state)), t.type === "live-end" && (Q.delete(i), (l = s.markLiveSessionEnded) == null || l.call(s), (h = (d = n.state) == null ? void 0 : d.state) != null && h.result || (f = s.close) == null || f.call(s)));
}
function Wn(t) {
  if (!game.user || String(t.hackerUserId ?? "") === game.user.id || !game.settings.get(R, "watchOtherHacks")) return !1;
  const n = be(t.audience);
  return n === "none" ? !1 : n === "gm" ? !!game.user.isGM : !0;
}
function Qn() {
  var n;
  const t = [...Q.values()];
  Q.clear();
  for (const e of t) (n = e.close) == null || n.call(e);
}
function Yn(t) {
  var a, c, u;
  const n = String(t.sessionId ?? "");
  if (Q.has(n)) {
    t.state && ((c = (a = Q.get(n)) == null ? void 0 : a.applyLiveState) == null || c.call(a, t.state));
    return;
  }
  const e = t.options ?? {}, i = String(t.minigameType ?? e.type ?? "node-intrusion"), s = n.replace(/[^A-Za-z0-9_-]/g, ""), r = H.startHack({
    ...e,
    id: `holosuite-${i}-spectator-${s}`,
    type: i,
    liveSessionId: n,
    readOnly: !0,
    chatOnResult: !1,
    onSuccess: null,
    onFailure: null
  });
  if (!r) return;
  const o = r.close.bind(r);
  r.close = async (...l) => (Q.delete(n), o(...l)), Q.set(n, r), t.state && ((u = r.applyLiveState) == null || u.call(r, t.state));
}
function ni() {
  var t, n, e;
  (t = game.user) != null && t.id && ((e = (n = game.socket) == null ? void 0 : n.emit) == null || e.call(n, X, {
    type: "live-sync-request",
    payload: { observerUserId: game.user.id }
  }));
}
async function Xn(t) {
  var o;
  const n = ri(t.actorId, it(t.userId) ?? game.user), e = t.quickOutcome ? { total: null, naturalRoll: null, rollSource: "gm" } : await Zn(t, n);
  if (!t.quickOutcome && !Number.isFinite(e == null ? void 0 : e.total)) return null;
  const i = ii(t), s = {
    quickOutcome: t.quickOutcome,
    rollTotal: e.total,
    naturalRoll: e.naturalRoll,
    dieSides: e.dieSides,
    rollDirection: e.rollDirection,
    rollSource: e.rollSource,
    diceCount: e.diceCount,
    keepResult: e.keepResult,
    staticModifier: e.staticModifier,
    systemOutcome: e.systemOutcome,
    dc: t.quickOutcome ? null : t.dc,
    actorId: t.actorId,
    actorName: (n == null ? void 0 : n.name) ?? t.actorName ?? "Hacker",
    userId: t.userId,
    skillId: t.skillId,
    liveSessionId: t.requestId,
    onLiveState: i.publish,
    onLiveEnd: i.end,
    onSuccess: (a) => xt(t, a),
    onFailure: (a) => xt(t, a)
  }, r = H.startHack({ ...s, type: t.minigameType });
  return r ? (i.start((o = r.getLiveSessionData) == null ? void 0 : o.call(r)), r) : (i.cancel(), null);
}
async function Zn(t, n) {
  return Ke({
    ...t,
    actor: n,
    flavor: `${$(ve(t.minigameType))}: ${$(t.skillLabel || t.skillId || "Skill")} vs DC ${Number(t.dc)} (${B(t).rollDirection === "low" ? "low" : "high"} rolls are positive)`
  });
}
function xt(t, n) {
  var e, i;
  (i = (e = game.socket) == null ? void 0 : e.emit) == null || i.call(e, X, {
    type: "result-report",
    payload: {
      requestId: t.requestId,
      gmUserId: t.gmUserId,
      result: n
    }
  });
}
function es(t = {}) {
  var i, s, r;
  if (!((i = game.user) != null && i.isGM) || t.gmUserId !== game.user.id) return;
  const n = Ue.get(t.requestId);
  Ue.delete(t.requestId), n != null && n.timeoutId && window.clearTimeout(n.timeoutId);
  const e = t.result ?? {};
  e.result === "success" ? (s = n == null ? void 0 : n.onSuccess) == null || s.call(n, e) : (r = n == null ? void 0 : n.onFailure) == null || r.call(n, e);
}
function ts(t) {
  if (t.quickOutcome) {
    const e = t.quickOutcome === "failure_but_playable" ? "Failure" : D[t.quickOutcome].label;
    return `<section class="holosuite-hacking-start-prompt"><p>Quick Hack</p>
      <h2>${$(ve(t.minigameType))}</h2>
      <div>Result: ${$(e)}</div></section>`;
  }
  const n = t.rollSource === "system" && V() ? "Set when rolling" : String(Number(t.dc));
  return `
    <section class="holosuite-hacking-start-prompt">
      <p>Incoming hacking challenge</p>
      <h2>${$(ve(t.minigameType))}</h2>
      <div>Difficulty: ${$(n)}</div>
    </section>
  `;
}
function si(t = {}) {
  const n = we(t.quickOutcome), e = Number(game.settings.get(R, "defaultDc") ?? 15), i = be(game.settings.get(R, "defaultLiveAudience"));
  return {
    ...n ? { rollSource: "gm" } : B(t),
    quickOutcome: n,
    requestId: String(t.requestId ?? foundry.utils.randomID()),
    minigameType: String(t.minigameType ?? t.type ?? "node-intrusion"),
    userId: String(t.userId ?? ""),
    actorId: String(t.actorId ?? ""),
    actorName: String(t.actorName ?? ""),
    skillId: String(t.skillId ?? ""),
    skillLabel: String(t.skillLabel ?? ""),
    skillModifier: Number(t.skillModifier ?? 0),
    dc: Number(t.dc ?? e),
    gmUserId: String(t.gmUserId ?? ""),
    liveAudience: be(t.liveAudience ?? i)
  };
}
function be(t) {
  const n = String(t ?? "everyone");
  return ["none", "gm", "everyone"].includes(n) ? n : "everyone";
}
function ri(t, n) {
  const e = K(t);
  if (e) return e;
  const i = ce(n);
  if (i) return i;
  const s = nt(n);
  if (s.length === 1) return s[0];
  const r = mi();
  return r && ee(r, n) ? r : null;
}
function ve(t) {
  var n, e;
  return ((e = (n = H == null ? void 0 : H.getMinigames) == null ? void 0 : n.call(H).find((i) => i.id === t)) == null ? void 0 : e.title) ?? String(t ?? "Hacking");
}
function Xe() {
  var n, e;
  const t = ((n = game.modules.get("holosuite-core")) == null ? void 0 : n.api) ?? game.holosuite;
  return typeof (t == null ? void 0 : t.registerApp) != "function" ? !1 : ((e = t.unregisterApp) == null || e.call(t, "node-intrusion"), t.registerApp({
    id: R,
    title: "HoloSuite Hacking",
    icon: "fa-solid fa-terminal",
    premium: !1,
    featureId: R,
    playerVisible: !1,
    description: "Reusable hacking minigames for terminals, traces, and signal puzzles.",
    open: () => ei()
  }), !0);
}
Hooks.once("init", () => {
  zn(), Bn(), ti();
});
Hooks.once("ready", () => {
  var t, n;
  ti(), (n = (t = game.socket) == null ? void 0 : t.on) == null || n.call(t, X, Jn), window.setTimeout(ni, 250), Xe(), window.setTimeout(() => Xe(), 500), console.log(`${R} | Ready. API available at game.modules.get("${R}").api`);
});
