var se = Object.defineProperty;
var ae = (e, n, t) => n in e ? se(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t;
var p = (e, n, t) => ae(e, typeof n != "symbol" ? n + "" : n, t);
const x = {
  critical_success: {
    profileId: "critical_success",
    id: "critical_success",
    label: "Critical Success",
    traceDurationSeconds: 95,
    maxMistakes: 4,
    hintsEnabled: !0,
    visualGlitchIntensity: 0.15,
    nodeIntrusion: {
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
      channelCount: 2,
      tolerance: 8,
      signalDriftSpeed: 0,
      noiseLevel: 0.05,
      lockHoldSeconds: 2.5,
      decoyFrequencies: 0
    }
  },
  strong_success: {
    profileId: "strong_success",
    id: "strong_success",
    label: "Strong Success",
    traceDurationSeconds: 75,
    maxMistakes: 3,
    hintsEnabled: !0,
    visualGlitchIntensity: 0.25,
    nodeIntrusion: {
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
      channelCount: 3,
      tolerance: 7,
      signalDriftSpeed: 0.08,
      noiseLevel: 0.12,
      lockHoldSeconds: 3,
      decoyFrequencies: 0
    }
  },
  success: {
    profileId: "success",
    id: "success",
    label: "Success",
    traceDurationSeconds: 60,
    maxMistakes: 3,
    hintsEnabled: !1,
    visualGlitchIntensity: 0.4,
    nodeIntrusion: {
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
      channelCount: 3,
      tolerance: 5,
      signalDriftSpeed: 0.16,
      noiseLevel: 0.2,
      lockHoldSeconds: 4,
      decoyFrequencies: 1
    }
  },
  failure_but_playable: {
    profileId: "failure_but_playable",
    id: "failure_but_playable",
    label: "Failure, But Playable",
    traceDurationSeconds: 45,
    maxMistakes: 2,
    hintsEnabled: !1,
    visualGlitchIntensity: 0.65,
    nodeIntrusion: {
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
      channelCount: 4,
      tolerance: 4,
      signalDriftSpeed: 0.28,
      noiseLevel: 0.32,
      lockHoldSeconds: 5,
      decoyFrequencies: 2
    }
  },
  critical_failure: {
    profileId: "critical_failure",
    id: "critical_failure",
    label: "Critical Failure",
    traceDurationSeconds: 24,
    maxMistakes: 1,
    hintsEnabled: !1,
    visualGlitchIntensity: 0.9,
    nodeIntrusion: {
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
      channelCount: 5,
      tolerance: 2,
      signalDriftSpeed: 0.45,
      noiseLevel: 0.5,
      lockHoldSeconds: 6.5,
      decoyFrequencies: 3
    }
  }
};
function L(e) {
  return {
    ...e,
    ...e.nodeIntrusion,
    ...e.signalAlignment,
    allowMainPathFirewalls: e.nodeIntrusion.allowFirewallOnMainPath
  };
}
function et(e = 0, n = 10, t = null) {
  const i = Number(e) || 0, r = Number(n) || 10, s = Number(t);
  return s === 1 ? L(x.critical_failure) : s === 20 ? L(x.critical_success) : i <= r - 10 ? L(x.critical_failure) : i >= r + 10 ? L(x.critical_success) : i >= r + 5 ? L(x.strong_success) : i >= r ? L(x.success) : L(x.failure_but_playable);
}
const ft = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map();
function Ct(e) {
  const n = String((e == null ? void 0 : e.id) ?? "").trim();
  if (!n || typeof (e == null ? void 0 : e.create) != "function")
    throw new Error("HoloSuite Hacking minigames require an id and create(options) function.");
  ft.set(n, {
    title: String(e.title ?? n),
    icon: String(e.icon ?? "fa-solid fa-terminal"),
    ...e,
    id: n
  });
}
function oe(e) {
  return ft.get(String(e ?? ""));
}
function le() {
  return [...ft.values()];
}
function ce(e, n = {}) {
  var s, a, o, l;
  const t = oe(e);
  if (!t)
    return (a = (s = ui.notifications) == null ? void 0 : s.warn) == null || a.call(s, `Unknown HoloSuite hacking minigame: ${e}`), null;
  (l = (o = G.get(t.id)) == null ? void 0 : o.close) == null || l.call(o);
  const i = t.create(n), r = i.close.bind(i);
  return i.close = async (...c) => (G.delete(t.id), r(...c)), G.set(t.id, i), i.render(!0), i;
}
function ue(e) {
  return e ? G.get(String(e)) ?? null : [...G.values()].at(-1) ?? null;
}
function Y(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function jt(e, n) {
  if (!Y(n)) return e;
  const t = { ...e };
  for (const [i, r] of Object.entries(n))
    t[i] = Y(r) && Y(t[i]) ? jt(t[i], r) : r;
  return t;
}
function de(e) {
  var n;
  return {
    ...e,
    ...e.nodeIntrusion ?? {},
    ...e.signalAlignment ?? {},
    allowMainPathFirewalls: ((n = e.nodeIntrusion) == null ? void 0 : n.allowFirewallOnMainPath) ?? e.allowMainPathFirewalls
  };
}
function fe(e) {
  var t, i;
  const n = String(game.settings.get(e, "difficultyProfileOverrides") ?? "").trim();
  if (!n) return {};
  try {
    const r = JSON.parse(n);
    return Y(r) ? r : {};
  } catch (r) {
    return console.warn(`${e} | Difficulty profile overrides must be valid JSON.`, r), (i = (t = ui.notifications) == null ? void 0 : t.warn) == null || i.call(t, "HoloSuite Hacking difficulty profile overrides contain invalid JSON."), {};
  }
}
function he({ moduleId: e, openLauncher: n }) {
  function t(o) {
    const l = String(o.profileId ?? o.id ?? ""), u = fe(e)[l], d = de(jt(o, u)), f = Number(game.settings.get(e, "nodeTakeoverDurationSeconds") ?? 0);
    return Number.isFinite(f) && f > 0 ? {
      ...d,
      nodeIntrusion: {
        ...d.nodeIntrusion ?? {},
        claimDurationSeconds: f
      },
      claimDurationSeconds: f
    } : d;
  }
  function i(o) {
    const l = String(game.settings.get(e, "visualGlitchIntensity") ?? "medium"), c = Number(o.visualGlitchIntensity ?? 0.4), u = l === "low" ? Math.min(c, 0.25) : l === "high" ? Math.min(1, c + 0.2) : c;
    return { ...o, visualGlitchIntensity: u };
  }
  function r(o = {}) {
    const l = Number(game.settings.get(e, "defaultDc") ?? 15), c = Number(o.dc ?? l), u = Number(o.rollTotal ?? c), d = o.naturalRoll === null || o.naturalRoll === void 0 ? null : Number(o.naturalRoll), f = i(t(o.profile ?? et(u, c, d)));
    return { ...o, dc: c, rollTotal: u, profile: f };
  }
  function s(o = {}) {
    const l = String(o.type ?? "node-intrusion");
    return ce(l, r(o));
  }
  const a = {
    startHack: s,
    startNodeIntrusion: (o = {}) => s({ ...o, type: "node-intrusion" }),
    startSignalAlignment: (o = {}) => s({ ...o, type: "signal-alignment" }),
    openLauncher: n,
    getDifficultyProfile: (o = 0, l = 10, c = null) => i(t(et(o, l, c))),
    difficultyProfiles: x,
    getMinigames: le,
    getActiveApp: ue,
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
    })
  };
  return a;
}
function D(e) {
  const n = document.createElement("div");
  return n.textContent = String(e ?? ""), n.innerHTML;
}
function ut() {
  return ht().filter((n) => !n.isGM);
}
function ht() {
  var e;
  return Array.isArray(game.users) ? game.users : ((e = game.users) == null ? void 0 : e.contents) ?? [...game.users ?? []];
}
function mt(e) {
  var t, i;
  const n = String(e ?? "");
  return ((i = (t = game.users) == null ? void 0 : t.get) == null ? void 0 : i.call(t, n)) ?? ht().find((r) => r.id === n) ?? null;
}
function gt() {
  var e;
  return Array.isArray(game.actors) ? game.actors : ((e = game.actors) == null ? void 0 : e.contents) ?? [...game.actors ?? []];
}
function q(e) {
  var t, i;
  const n = String(e ?? "");
  return ((i = (t = game.actors) == null ? void 0 : t.get) == null ? void 0 : i.call(t, n)) ?? gt().find((r) => r.id === n || r.uuid === n) ?? null;
}
function U(e) {
  const n = e == null ? void 0 : e.character;
  return n ? typeof n == "string" ? q(n) : n : null;
}
function j(e, n) {
  var r, s, a, o;
  if (!e || !n) return !1;
  if (e === U(n) || (r = e.testUserPermission) != null && r.call(e, n, "OWNER")) return !0;
  const t = ((a = (s = globalThis.CONST) == null ? void 0 : s.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3, i = e.ownership ?? ((o = e.data) == null ? void 0 : o.permission) ?? {};
  return Number(i[n.id] ?? i.default ?? 0) >= t;
}
function me() {
  var e, n, t;
  return ((t = (n = (e = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : e.controlled) == null ? void 0 : n[0]) == null ? void 0 : t.actor) ?? null;
}
function pt(e) {
  const n = U(e) ? [U(e)] : [], t = gt().filter((r) => j(r, e));
  return [...new Map([...n, ...t].filter(Boolean).map((r) => [r.id, r])).values()].sort((r, s) => r.name.localeCompare(s.name));
}
function vt(e = "") {
  const n = ut(), t = n.find((r) => r.id === e);
  return (t ? pt(t) : gt()).filter((r) => !t || j(r, t)).map((r) => ({
    id: r.id,
    name: r.name,
    owners: n.filter((s) => j(r, s))
  })).sort((r, s) => r.name.localeCompare(s.name));
}
const ge = {
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
function Nt(e) {
  var t;
  const n = (t = e == null ? void 0 : e.system) == null ? void 0 : t.skills;
  if (n && typeof n == "object") {
    const i = Object.entries(n).map(([r, s]) => ({
      id: r,
      name: at(r, s),
      label: pe(r, s),
      modifier: yt(s)
    }));
    if (i.length) return i.sort((r, s) => r.label.localeCompare(s.label));
  }
  return [
    { id: "hacking", name: "Hacking", label: "Hacking (+0)", modifier: 0 },
    { id: "computers", name: "Computers", label: "Computers (+0)", modifier: 0 },
    { id: "technology", name: "Technology", label: "Technology (+0)", modifier: 0 },
    { id: "intelligence", name: "Intelligence", label: "Intelligence (+0)", modifier: 0 }
  ];
}
function Bt(e, n) {
  var t, i;
  return ((i = (t = e == null ? void 0 : e.system) == null ? void 0 : t.skills) == null ? void 0 : i[n]) ?? null;
}
function at(e, n) {
  const t = String((n == null ? void 0 : n.label) ?? (n == null ? void 0 : n.name) ?? (n == null ? void 0 : n.localizedName) ?? e ?? "Skill").trim(), i = t.toLowerCase().replace(/[^a-z0-9]/g, "");
  return String(ge[i] ?? t).replace(/[_-]/g, " ").replace(/\b\w/g, (r) => r.toUpperCase());
}
function yt(e) {
  var r, s, a, o, l, c, u, d, f, h;
  if (typeof e == "number") return e;
  if (!e || typeof e != "object") return 0;
  const t = [
    e == null ? void 0 : e.mod,
    (r = e == null ? void 0 : e.mod) == null ? void 0 : r.value,
    e == null ? void 0 : e.modifier,
    (s = e == null ? void 0 : e.modifier) == null ? void 0 : s.value,
    e == null ? void 0 : e.total,
    (a = e == null ? void 0 : e.total) == null ? void 0 : a.value,
    e == null ? void 0 : e.value,
    (o = e == null ? void 0 : e.value) == null ? void 0 : o.value,
    e == null ? void 0 : e.bonus,
    (l = e == null ? void 0 : e.bonus) == null ? void 0 : l.value,
    e == null ? void 0 : e.check,
    (c = e == null ? void 0 : e.check) == null ? void 0 : c.mod,
    (u = e == null ? void 0 : e.check) == null ? void 0 : u.total,
    e == null ? void 0 : e.roll,
    (d = e == null ? void 0 : e.roll) == null ? void 0 : d.mod,
    (f = e == null ? void 0 : e.roll) == null ? void 0 : f.total,
    e == null ? void 0 : e.rank,
    e == null ? void 0 : e.ranks
  ].find((g) => Number.isFinite(Number(g)));
  if (t !== void 0) return Number(t);
  const i = [];
  return zt(e, i, 0), i.sort((g, S) => S.score - g.score), Number(((h = i[0]) == null ? void 0 : h.value) ?? 0);
}
function pe(e, n) {
  const t = at(e, n), i = yt(n), r = i >= 0 ? "+" : "-";
  return `${t} (${r}${Math.abs(i)})`;
}
function zt(e, n, t, i = "") {
  if (!(!e || typeof e != "object" || t > 4))
    for (const [r, s] of Object.entries(e)) {
      const a = i ? `${i}.${r}` : r, o = Number(s);
      if (Number.isFinite(o)) {
        const l = a.toLowerCase();
        let c = 1;
        /(total|mod|modifier|bonus|check|roll|value)$/.test(l) && (c += 6), /(dc|rank|ranks|proficient|prof|trained|ability|base|label|name)/.test(l) && (c -= 4), Math.abs(o) > 30 && (c -= 5), n.push({ value: o, score: c, path: a });
      } else s && typeof s == "object" && zt(s, n, t + 1, a);
    }
}
const Q = "holosuite-hacking", ye = `modules/${Q}/templates/hacking-launcher.html`;
var $t, kt, Ot;
const we = globalThis.Application ?? ((Ot = (kt = ($t = globalThis.foundry) == null ? void 0 : $t.appv1) == null ? void 0 : kt.api) == null ? void 0 : Ot.Application);
class Se extends we {
  constructor(t = {}) {
    super(t);
    p(this, "api");
    this.api = t.api;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-hacking-launcher",
      title: "HoloSuite Hacking",
      classes: ["holosuite-hacking-launcher-window"],
      popOut: !0,
      resizable: !1,
      width: 460,
      height: "auto",
      template: ye
    });
  }
  getData() {
    const t = Number(game.settings.get(Q, "defaultDc") ?? 15), i = ut(), r = i[0] ?? null, s = vt(r == null ? void 0 : r.id), a = s.length ? q(s[0].id) : null;
    return {
      defaultDc: t,
      defaultTestRoll: t,
      minigames: this.api.getMinigames(),
      actors: s.map((o) => ({
        id: o.id,
        name: o.name,
        ownerNames: o.owners.map((l) => l.name).join(", ") || "No active owner"
      })),
      users: i.map((o) => ({
        id: o.id,
        name: o.name
      })),
      skills: Nt(a)
    };
  }
  activateListeners(t) {
    super.activateListeners(t);
    const i = t.is("form") ? t[0] : t.find("form")[0];
    t.find("[data-action='start']").on("click", (s) => {
      s.preventDefault(), this.submit(i);
    }), t.find("[data-action='test-self']").on("click", (s) => {
      s.preventDefault(), this.testSelf(i);
    }), (t.is("form") ? t : t.find("form")).on("submit", (s) => {
      s.preventDefault(), this.submit(s.currentTarget);
    }), t.find("[name='actorId']").on("change", (s) => {
      this.syncUserToActor(t, s.currentTarget.value), this.syncSkillOptions(t, s.currentTarget.value);
    }), t.find("[name='userId']").on("change", (s) => {
      this.syncActorsForUser(t, s.currentTarget.value);
    }), this.syncSkillOptions(t, t.find("[name='actorId']").val());
  }
  submit(t) {
    var y, b, M, v, E, m;
    if (!((y = game.user) != null && y.isGM)) {
      (M = (b = ui.notifications) == null ? void 0 : b.warn) == null || M.call(b, "Only the GM can open the HoloSuite Hacking launcher.");
      return;
    }
    if (!t) {
      (E = (v = ui.notifications) == null ? void 0 : v.error) == null || E.call(v, "HoloSuite Hacking launcher form was not found."), console.error(`${Q} | Launcher form was not found.`);
      return;
    }
    const i = t.querySelector("[name='minigameType']"), r = t.querySelector("[name='actorId']"), s = t.querySelector("[name='userId']"), a = t.querySelector("[name='skillId']"), o = t.querySelector("[name='dc']"), l = ((m = a == null ? void 0 : a.selectedOptions) == null ? void 0 : m[0]) ?? null, c = String((i == null ? void 0 : i.value) || "node-intrusion"), u = String((r == null ? void 0 : r.value) || ""), d = String((s == null ? void 0 : s.value) || ""), f = String((a == null ? void 0 : a.value) || ""), h = String((l == null ? void 0 : l.dataset.skillLabel) || (l == null ? void 0 : l.textContent) || f || "Skill"), g = Number((l == null ? void 0 : l.dataset.skillModifier) ?? 0), S = Number((o == null ? void 0 : o.value) ?? 15);
    this.api.sendHackToPlayer({
      minigameType: c,
      actorId: u,
      userId: d,
      skillId: f,
      skillLabel: h,
      skillModifier: g,
      dc: S,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }) && this.close();
  }
  testSelf(t) {
    var l, c, u, d, f, h, g, S, P, y, b, M, v;
    if (!((l = game.user) != null && l.isGM)) {
      (u = (c = ui.notifications) == null ? void 0 : c.warn) == null || u.call(c, "Only the GM can test HoloSuite Hacking minigames.");
      return;
    }
    if (!t) {
      (f = (d = ui.notifications) == null ? void 0 : d.error) == null || f.call(d, "HoloSuite Hacking launcher form was not found.");
      return;
    }
    const i = String(((h = t.querySelector("[name='minigameType']")) == null ? void 0 : h.value) || "node-intrusion"), r = String(((g = t.querySelector("[name='actorId']")) == null ? void 0 : g.value) || ""), s = Number(((S = t.querySelector("[name='dc']")) == null ? void 0 : S.value) ?? game.settings.get(Q, "defaultDc") ?? 15), a = Number(((P = t.querySelector("[name='testRollTotal']")) == null ? void 0 : P.value) ?? s);
    if (!Number.isFinite(a)) {
      (b = (y = ui.notifications) == null ? void 0 : y.warn) == null || b.call(y, "Enter a fake roll result before testing the minigame.");
      return;
    }
    const o = q(r);
    this.api.startHack({
      type: i,
      dc: s,
      rollTotal: a,
      actorName: (o == null ? void 0 : o.name) ?? ((M = game.user) == null ? void 0 : M.name) ?? "GM",
      userId: ((v = game.user) == null ? void 0 : v.id) ?? "",
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }), this.close();
  }
  syncUserToActor(t, i) {
    const r = q(i), s = ut().find((a) => r == null ? void 0 : r.testUserPermission(a, "OWNER"));
    s && t.find("[name='userId']").val(s.id);
  }
  syncSkillOptions(t, i) {
    const r = q(i), s = Nt(r);
    t.find("[name='skillId']").html(s.map((a) => `<option value="${D(a.id)}" data-skill-label="${D(a.name ?? a.label)}" data-skill-modifier="${Number(a.modifier ?? 0)}">${D(a.label)}</option>`).join(""));
  }
  syncActorsForUser(t, i) {
    const r = vt(i), s = r.length ? r.map((a) => `<option value="${D(a.id)}">${D(a.name)} (${D(a.owners.map((o) => o.name).join(", ") || "No owner")})</option>`).join("") : '<option value="">Use assigned character</option>';
    t.find("[name='actorId']").html(s), this.syncSkillOptions(t, t.find("[name='actorId']").val());
  }
}
const B = "holosuite-hacking", be = `modules/${B}/templates/difficulty-profiles.html`;
var Ft, Et, Ht;
const Ie = globalThis.FormApplication ?? ((Ht = (Et = (Ft = globalThis.foundry) == null ? void 0 : Ft.appv1) == null ? void 0 : Et.api) == null ? void 0 : Ht.FormApplication), lt = [
  "critical_success",
  "strong_success",
  "success",
  "failure_but_playable",
  "critical_failure"
];
function Z(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Vt(e, n) {
  if (!Z(n)) return e;
  const t = { ...e };
  for (const [i, r] of Object.entries(n))
    t[i] = Z(r) && Z(t[i]) ? Vt(t[i], r) : r;
  return t;
}
function Me() {
  const e = String(game.settings.get(B, "difficultyProfileOverrides") ?? "").trim();
  if (!e) return {};
  try {
    const n = JSON.parse(e);
    return Z(n) ? n : {};
  } catch (n) {
    return console.warn(`${B} | Difficulty profile overrides must be valid JSON.`, n), {};
  }
}
function A(e, n, t) {
  const i = Number(e.get(n));
  return Number.isFinite(i) ? i : t;
}
function C(e, n, t) {
  return Math.min(t, Math.max(n, e));
}
function tt(e, n) {
  return e.get(n) === "on";
}
function nt(e, n, t, i) {
  const r = C(Math.round(e), 6, 40), s = Math.max(0, r - 4), a = C(Math.round(n), 0, s), o = Math.max(0, r - a), l = C(Math.round(o * 0.48), Math.min(6, o), o), c = l >= 5 ? 3 : 1, u = C(Math.round(t), 1, c), d = l + Math.max(0, u - 1), f = i ? Math.max(0, r - a - 2) : Math.max(0, r - a - d);
  return {
    nodeCount: r,
    maxDecoys: s,
    decoyCount: a,
    mainPathLength: l,
    maxRoutes: c,
    routeCount: u,
    protectedNodes: d,
    maxFirewalls: f
  };
}
function Ce(e, n, t) {
  const i = A(e, `${n}nodeCount`, t.nodeIntrusion.nodeCount), r = A(e, `${n}decoyCount`, t.nodeIntrusion.decoyCount), s = A(e, `${n}routeCount`, t.nodeIntrusion.routeCount ?? 2), a = tt(e, `${n}allowFirewallOnMainPath`), o = nt(i, r, s, a);
  return {
    nodeCount: o.nodeCount,
    firewallCount: C(Math.round(A(e, `${n}firewallCount`, t.nodeIntrusion.firewallCount)), 0, o.maxFirewalls),
    decoyCount: o.decoyCount,
    routeCount: o.routeCount,
    radarEnabled: tt(e, `${n}radarEnabled`),
    claimDurationSeconds: C(A(e, `${n}claimDurationSeconds`, t.nodeIntrusion.claimDurationSeconds ?? 0.5), 0.1, 5),
    firewallClaimMultiplier: C(A(e, `${n}firewallClaimMultiplier`, t.nodeIntrusion.firewallClaimMultiplier ?? 1.75), 1, 5),
    firewallPenaltySeconds: C(Math.round(A(e, `${n}firewallPenaltySeconds`, t.nodeIntrusion.firewallPenaltySeconds ?? 6)), 0, 60),
    decoyPenaltySeconds: C(Math.round(A(e, `${n}decoyPenaltySeconds`, t.nodeIntrusion.decoyPenaltySeconds ?? 4)), 0, 60),
    showTarget: tt(e, `${n}showTarget`),
    allowFirewallOnMainPath: a
  };
}
function ve(e) {
  const n = x[e], t = nt(
    Number(n.nodeIntrusion.nodeCount),
    Number(n.nodeIntrusion.decoyCount),
    Number(n.nodeIntrusion.routeCount ?? 2),
    !!n.nodeIntrusion.allowFirewallOnMainPath
  );
  return {
    traceDurationSeconds: Number(n.traceDurationSeconds ?? 60),
    hintsEnabled: !!n.hintsEnabled,
    visualGlitchIntensity: Number(n.visualGlitchIntensity ?? 0.4),
    nodeIntrusion: {
      nodeCount: t.nodeCount,
      firewallCount: C(Number(n.nodeIntrusion.firewallCount ?? 0), 0, t.maxFirewalls),
      decoyCount: t.decoyCount,
      routeCount: t.routeCount,
      radarEnabled: !!(n.nodeIntrusion.radarEnabled ?? Number(n.nodeIntrusion.radarRange ?? 0) > 0),
      claimDurationSeconds: Number(n.nodeIntrusion.claimDurationSeconds ?? 0.5),
      firewallClaimMultiplier: Number(n.nodeIntrusion.firewallClaimMultiplier ?? 1.75),
      firewallPenaltySeconds: Number(n.nodeIntrusion.firewallPenaltySeconds ?? 6),
      decoyPenaltySeconds: Number(n.nodeIntrusion.decoyPenaltySeconds ?? 4),
      showTarget: !!n.nodeIntrusion.showTarget,
      allowFirewallOnMainPath: !!n.nodeIntrusion.allowFirewallOnMainPath
    }
  };
}
class Ne extends Ie {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-hacking-difficulty-profiles",
      title: "HoloSuite Hacking Difficulty Profiles",
      classes: ["holosuite-hacking-profile-window"],
      template: be,
      width: 720,
      height: "auto",
      closeOnSubmit: !0,
      submitOnChange: !1,
      submitOnClose: !1
    });
  }
  getData() {
    const n = Me();
    return {
      profiles: lt.map((i) => {
        var d, f, h, g, S, P, y, b, M, v, E, m;
        const r = x[i], s = Vt(r, n[i]), a = Number(((d = s.nodeIntrusion) == null ? void 0 : d.nodeCount) ?? 12), o = Number(((f = s.nodeIntrusion) == null ? void 0 : f.decoyCount) ?? 0), l = Number(((h = s.nodeIntrusion) == null ? void 0 : h.routeCount) ?? 2), c = !!((g = s.nodeIntrusion) != null && g.allowFirewallOnMainPath), u = nt(a, o, l, c);
        return {
          id: i,
          label: s.label,
          traceDurationSeconds: Number(s.traceDurationSeconds ?? 60),
          hintsEnabled: !!s.hintsEnabled,
          visualGlitchIntensity: Number(s.visualGlitchIntensity ?? 0.4),
          nodeIntrusion: {
            nodeCount: u.nodeCount,
            firewallCount: C(Number(((S = s.nodeIntrusion) == null ? void 0 : S.firewallCount) ?? 0), 0, u.maxFirewalls),
            decoyCount: u.decoyCount,
            routeCount: u.routeCount,
            radarEnabled: !!(((P = s.nodeIntrusion) == null ? void 0 : P.radarEnabled) ?? Number(((y = s.nodeIntrusion) == null ? void 0 : y.radarRange) ?? 0) > 0),
            claimDurationSeconds: Number(((b = s.nodeIntrusion) == null ? void 0 : b.claimDurationSeconds) ?? 0.5),
            firewallClaimMultiplier: Number(((M = s.nodeIntrusion) == null ? void 0 : M.firewallClaimMultiplier) ?? 1.75),
            firewallPenaltySeconds: Number(((v = s.nodeIntrusion) == null ? void 0 : v.firewallPenaltySeconds) ?? 6),
            decoyPenaltySeconds: Number(((E = s.nodeIntrusion) == null ? void 0 : E.decoyPenaltySeconds) ?? 4),
            showTarget: !!((m = s.nodeIntrusion) != null && m.showTarget),
            allowFirewallOnMainPath: c
          },
          constraints: u
        };
      }),
      hasOverrides: Object.keys(n).length > 0
    };
  }
  activateListeners(n) {
    super.activateListeners(n), this.syncConstraints(n), n.find("[data-profile-section] input").on("input change", (t) => {
      var r;
      const i = (r = t.currentTarget) == null ? void 0 : r.closest("[data-profile-section]");
      i && this.syncProfileConstraints(i);
    }), n.find("[data-action='reset-profile']").on("click", (t) => {
      var r;
      t.preventDefault();
      const i = (r = t.currentTarget) == null ? void 0 : r.closest("[data-profile-section]");
      i && this.resetProfileSection(i);
    }), n.find("[data-action='reset-profiles']").on("click", async (t) => {
      var i, r;
      t.preventDefault(), await game.settings.set(B, "difficultyProfileOverrides", ""), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "HoloSuite Hacking difficulty profiles reset to defaults."), this.render(!1);
    });
  }
  syncConstraints(n) {
    n.find("[data-profile-section]").each((t, i) => this.syncProfileConstraints(i));
  }
  syncProfileConstraints(n) {
    const t = n.dataset.profileId ?? "", i = (u) => n.querySelector(`[name="${t}.${u}"]`), r = i("nodeCount"), s = i("decoyCount"), a = i("routeCount"), o = i("firewallCount"), l = i("allowFirewallOnMainPath");
    if (!r || !s || !a || !o) return;
    const c = nt(
      Number(r.value),
      Number(s.value),
      Number(a.value),
      !!(l != null && l.checked)
    );
    r.value = String(c.nodeCount), s.max = String(c.maxDecoys), s.value = String(c.decoyCount), a.max = String(c.maxRoutes), a.value = String(c.routeCount), o.max = String(c.maxFirewalls), o.value = String(C(Math.round(Number(o.value) || 0), 0, c.maxFirewalls)), n.querySelectorAll("[data-constraint]").forEach((u) => {
      const d = u.dataset.constraint;
      d && c[d] !== void 0 && (u.textContent = String(c[d]));
    });
  }
  resetProfileSection(n) {
    const t = n.dataset.profileId ?? "";
    if (!lt.includes(t)) return;
    const i = ve(t), r = {
      traceDurationSeconds: i.traceDurationSeconds,
      visualGlitchIntensity: i.visualGlitchIntensity,
      nodeCount: i.nodeIntrusion.nodeCount,
      routeCount: i.nodeIntrusion.routeCount,
      firewallCount: i.nodeIntrusion.firewallCount,
      decoyCount: i.nodeIntrusion.decoyCount,
      claimDurationSeconds: i.nodeIntrusion.claimDurationSeconds,
      firewallClaimMultiplier: i.nodeIntrusion.firewallClaimMultiplier,
      firewallPenaltySeconds: i.nodeIntrusion.firewallPenaltySeconds,
      decoyPenaltySeconds: i.nodeIntrusion.decoyPenaltySeconds
    };
    for (const [a, o] of Object.entries(r)) {
      const l = n.querySelector(`[name="${t}.${a}"]`);
      l && (l.value = String(o));
    }
    const s = {
      hintsEnabled: i.hintsEnabled,
      radarEnabled: i.nodeIntrusion.radarEnabled,
      showTarget: i.nodeIntrusion.showTarget,
      allowFirewallOnMainPath: i.nodeIntrusion.allowFirewallOnMainPath
    };
    for (const [a, o] of Object.entries(s)) {
      const l = n.querySelector(`[name="${t}.${a}"]`);
      l && (l.checked = o);
    }
    this.syncProfileConstraints(n);
  }
  async _updateObject(n, t) {
    var s, a;
    const i = t instanceof FormData ? t : new FormData(this.form), r = {};
    for (const o of lt) {
      const l = x[o], c = `${o}.`;
      r[o] = {
        traceDurationSeconds: C(Math.round(A(i, `${c}traceDurationSeconds`, l.traceDurationSeconds)), 5, 300),
        hintsEnabled: tt(i, `${c}hintsEnabled`),
        visualGlitchIntensity: C(A(i, `${c}visualGlitchIntensity`, l.visualGlitchIntensity), 0, 1),
        nodeIntrusion: Ce(i, c, l)
      };
    }
    await game.settings.set(B, "difficultyProfileOverrides", JSON.stringify(r)), (a = (s = ui.notifications) == null ? void 0 : s.info) == null || a.call(s, "HoloSuite Hacking difficulty profiles saved.");
  }
}
async function Wt({ title: e, result: n, actorName: t, message: i, rollTotal: r, dc: s }) {
  const a = n === "success", o = a ? "#38f28f" : "#ff477e", l = a ? "HACK SUCCESS" : "HACK FAILED", c = i || (a ? "Objective completed." : "Trace or countermeasure completed."), u = Number.isFinite(Number(r)) && Number.isFinite(Number(s)) ? `<p style="margin: 4px 0 0; color: #bdeff6;">Roll ${Number(r)} vs DC ${Number(s)}</p>` : "", d = `
    <div class="holosuite-hacking-chat-result" style="border-left: 4px solid ${o}; padding: 8px 10px; background: rgba(5, 8, 14, 0.88); color: ${o};">
      <strong>${z(l)} // ${z(e)} // ${z(t || "Hacker")}</strong>
      <p style="margin: 6px 0 0; color: ${o};">${z(c)}</p>
      ${u}
    </div>
  `;
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content: d
  });
}
function z(e) {
  const n = document.createElement("div");
  return n.textContent = String(e ?? ""), n.innerHTML;
}
function N(e, n, t) {
  return Math.min(t, Math.max(n, e));
}
function Pe(e) {
  const n = String(e ?? "node-intrusion");
  let t = 2166136261;
  for (let i = 0; i < n.length; i += 1)
    t ^= n.charCodeAt(i), t = Math.imul(t, 16777619);
  return t >>> 0;
}
function Te(e) {
  let n = Pe(e);
  return () => {
    n += 1831565813;
    let t = n;
    return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function ct(e, n) {
  return e.length ? e[Math.floor(n() * e.length)] : null;
}
function xe(e, n) {
  const t = [...e];
  for (let i = t.length - 1; i > 0; i -= 1) {
    const r = Math.floor(n() * (i + 1));
    [t[i], t[r]] = [t[r], t[i]];
  }
  return t;
}
function R(e, n, t) {
  const i = e.find((s) => s.id === n), r = e.find((s) => s.id === t);
  !i || !r || (i.connected.includes(t) || i.connected.push(t), r.connected.includes(n) || r.connected.push(n));
}
function _(e, n) {
  return [e, n].sort().join("--");
}
function it(e, n, t, i) {
  return {
    id: e,
    x: N(Math.round(t), 6, 94),
    y: N(Math.round(i), 10, 90),
    type: n,
    connected: [],
    revealed: n === "start",
    visited: !1
  };
}
function wt(e) {
  return e.flatMap((n) => n.connected.filter((t) => n.id < t).map((t) => ({ from: n.id, to: t })));
}
function $(e, n) {
  return e.find((t) => t.id === n);
}
function V(e, n, t) {
  return Math.sign((n.y - e.y) * (t.x - n.x) - (n.x - e.x) * (t.y - n.y));
}
function De(e, n, t, i) {
  const r = V(e, n, t), s = V(e, n, i), a = V(t, i, e), o = V(t, i, n);
  return r !== s && a !== o;
}
function Ae(e, n, t) {
  if (n.from === t.from || n.from === t.to || n.to === t.from || n.to === t.to) return !1;
  const i = $(e, n.from), r = $(e, n.to), s = $(e, t.from), a = $(e, t.to);
  return !i || !r || !s || !a ? !1 : De(i, r, s, a);
}
function $e(e, n, t) {
  const i = t.x - n.x, r = t.y - n.y, s = i * i + r * r;
  if (!s) {
    const u = e.x - n.x, d = e.y - n.y;
    return Math.sqrt(u * u + d * d);
  }
  const a = N(((e.x - n.x) * i + (e.y - n.y) * r) / s, 0, 1), o = {
    x: n.x + a * i,
    y: n.y + a * r
  }, l = e.x - o.x, c = e.y - o.y;
  return Math.sqrt(l * l + c * c);
}
function ke(e, n = wt(e)) {
  let t = 0;
  for (let i = 0; i < n.length; i += 1)
    for (let r = i + 1; r < n.length; r += 1)
      Ae(e, n[i], n[r]) && (t += 1);
  return t;
}
function Kt(e) {
  const n = wt(e);
  let t = ke(e, n) * 900;
  for (let i = 0; i < e.length; i += 1)
    for (let r = i + 1; r < e.length; r += 1) {
      const s = e[i], a = e[r], o = a.x - s.x, l = a.y - s.y, c = Math.sqrt(o * o + l * l) || 1;
      c < 13 && (t += (13 - c) * 30), c < 18 && (t += (18 - c) * 6);
    }
  for (const i of e)
    for (const r of n) {
      if (r.from === i.id || r.to === i.id) continue;
      const s = $(e, r.from), a = $(e, r.to);
      if (!s || !a) continue;
      const o = $e(i, s, a);
      o < 8 && (t += (8 - o) * 18);
    }
  return t;
}
function Oe(e, n, t) {
  const i = e.map((r) => ({ ...r, connected: [...r.connected] }));
  i.push({ ...n, connected: [] });
  for (const r of t) R(i, n.id, r);
  return Kt(i);
}
function Pt(e, n, t, i, r, s, a = {}) {
  const {
    radiusMin: o = 17,
    radiusMax: l = 34,
    biasX: c = 5,
    ySpread: u = 1
  } = a;
  let d = null, f = 1 / 0;
  for (let h = 0; h < 16; h += 1) {
    const g = r() * Math.PI * 2 - Math.PI * 0.2, S = o + r() * (l - o), P = i.x + Math.cos(g) * S + c, y = i.y + Math.sin(g) * S * u, b = it(n, t, P, y), M = Oe(e, b, s);
    M < f && (d = b, f = M);
  }
  return d ?? it(n, t, i.x + c, i.y);
}
function Fe(e) {
  for (let n = 0; n < 24; n += 1)
    for (let t = 0; t < e.length; t += 1)
      for (let i = t + 1; i < e.length; i += 1) {
        const r = e[t], s = e[i], a = s.x - r.x, o = s.y - r.y, l = Math.sqrt(a * a + o * o) || 1;
        if (l >= 13) continue;
        const c = (13 - l) * 0.35, u = a / l * c, d = o / l * c;
        r.type !== "start" && r.type !== "target" && (r.x = N(r.x - u, 6, 94), r.y = N(r.y - d, 10, 90)), s.type !== "start" && s.type !== "target" && (s.x = N(s.x + u, 6, 94), s.y = N(s.y + d, 10, 90));
      }
}
function W(e) {
  const n = Math.floor(e() * 4);
  return n === 0 ? { x: 8 + e() * 22, y: 12 + e() * 76 } : n === 1 ? { x: 70 + e() * 22, y: 12 + e() * 76 } : n === 2 ? { x: 12 + e() * 76, y: 10 + e() * 20 } : { x: 12 + e() * 76, y: 70 + e() * 20 };
}
function Ee(e) {
  let n = W(e), t = W(e), i = { start: n, target: t, distance: 0 };
  for (let r = 0; r < 24; r += 1) {
    n = W(e), t = W(e);
    const s = t.x - n.x, a = t.y - n.y, o = Math.sqrt(s * s + a * a);
    if (o > i.distance && (i = { start: n, target: t, distance: o }), o >= 58) return { start: n, target: t };
  }
  return { start: i.start, target: i.target };
}
function Tt(e, n, t, i = /* @__PURE__ */ new Set()) {
  const r = [n], s = /* @__PURE__ */ new Map([[n, null]]);
  for (let l = 0; l < r.length; l += 1) {
    const c = $(e, r[l]);
    if (c) {
      if (c.id === t) break;
      for (const u of c.connected) {
        if (s.has(u)) continue;
        const d = $(e, u);
        !d || i.has(d.type) || (s.set(u, c.id), r.push(u));
      }
    }
  }
  if (!s.has(t)) return [];
  const a = [];
  let o = t;
  for (; o; )
    a.unshift(o), o = s.get(o) ?? null;
  return a;
}
function He(e, n, t) {
  const i = Tt(e, n, t, /* @__PURE__ */ new Set(["firewall", "decoy"]));
  if (!i.length) return 0;
  const r = /* @__PURE__ */ new Set([n, t]), s = e.map((a) => ({
    ...a,
    connected: r.has(a.id) || !i.includes(a.id) ? [...a.connected] : []
  }));
  return 1 + (Tt(s, n, t, /* @__PURE__ */ new Set(["firewall", "decoy"])).length ? 1 : 0);
}
function Le(e, n, t, i) {
  let r = e.length + 1;
  const s = [];
  for (let a = 1; a < i && !(n.length < 5); a += 1) {
    const o = 1 + Math.floor(t() * Math.max(1, n.length - 4)), l = N(o + 2 + Math.floor(t() * 3), o + 2, n.length - 2), c = $(e, n[o]), u = $(e, n[l]);
    if (!c || !u) continue;
    const d = `node-${r}`;
    r += 1;
    const f = it(
      d,
      "normal",
      (c.x + u.x) / 2 + (t() - 0.5) * 34,
      (c.y + u.y) / 2 + (t() - 0.5) * 34
    );
    e.push(f), s.push(c.id, f.id, u.id), R(e, c.id, f.id), R(e, f.id, u.id);
  }
  return s;
}
function xt(e, n = Date.now()) {
  var y, b, M, v, E;
  const t = Te(n), i = Math.max(6, Number(e.nodeCount ?? ((y = e.nodeIntrusion) == null ? void 0 : y.nodeCount)) || 10), r = N(Number(e.decoyCount ?? ((b = e.nodeIntrusion) == null ? void 0 : b.decoyCount)) || 0, 0, i - 4), s = Math.max(0, i - r), a = N(Math.round(s * 0.48), 6, s), o = N(Number(e.routeCount ?? ((M = e.nodeIntrusion) == null ? void 0 : M.routeCount)) || 2, 1, 3), l = Ee(t), c = [], u = [];
  for (let m = 0; m < a; m += 1) {
    const T = m === 0 ? "start" : m === a - 1 ? "target" : `node-${m}`, k = m === 0 ? "start" : m === a - 1 ? "target" : "normal", H = m / Math.max(1, a - 1), O = l.target.x - l.start.x, F = l.target.y - l.start.y, It = Math.sqrt(O * O + F * F) || 1, ee = -F / It, ne = O / It, Mt = Math.sin(H * Math.PI * (1.15 + t() * 0.6)) * (10 + t() * 8), ie = m === 0 || m === a - 1 ? 0 : (t() - 0.5) * 5, re = m === 0 || m === a - 1 ? 0 : (t() - 0.5) * 12;
    c.push(it(
      T,
      k,
      l.start.x + O * H + ee * Mt + ie,
      l.start.y + F * H + ne * Mt + re
    )), u.push(T), m > 0 && R(c, u[m - 1], T);
  }
  const d = /* @__PURE__ */ new Set([...u, ...Le(c, u, t, o)]);
  let f = c.length + 1;
  for (; c.length < i - r; ) {
    const m = ct(c.filter((F) => F.type !== "target"), t) ?? c[0], T = `node-${f}`;
    f += 1;
    const k = t() > 0.45 ? ct(c.filter((F) => F.id !== m.id && F.type !== "start"), t) : null, H = k ? [m.id, k.id] : [m.id], O = Pt(c, T, "normal", m, t, H, {
      radiusMin: 16,
      radiusMax: 31,
      biasX: t() > 0.35 ? 5 : -4,
      ySpread: 1.15
    });
    c.push(O), R(c, m.id, T), k && R(c, T, k.id);
  }
  for (let m = 0; m < r; m += 1) {
    const T = ct(c.filter((O) => O.type !== "target" && O.type !== "decoy"), t) ?? c[0], k = `decoy-${m + 1}`, H = Pt(c, k, "decoy", T, t, [T.id], {
      radiusMin: 18,
      radiusMax: 34,
      biasX: t() > 0.5 ? -6 : 6,
      ySpread: 1.25
    });
    c.push(H), R(c, T.id, k);
  }
  const h = !!(e.allowFirewallOnMainPath ?? e.allowMainPathFirewalls ?? ((v = e.nodeIntrusion) == null ? void 0 : v.allowFirewallOnMainPath)), g = c.filter((m) => m.type === "start" || m.type === "target" || m.type === "decoy" ? !1 : h || !d.has(m.id)), S = N(Number(e.firewallCount ?? ((E = e.nodeIntrusion) == null ? void 0 : E.firewallCount)) || 0, 0, g.length);
  for (const m of xe(g, t).slice(0, S))
    m.type = "firewall";
  Fe(c);
  const P = He(c, "start", "target");
  return {
    nodes: c,
    edges: wt(c),
    startNodeId: "start",
    targetNodeId: "target",
    mainPathIds: u,
    safeRoutes: P,
    layoutScore: Kt(c)
  };
}
function Re(e, n = Date.now()) {
  var r;
  const t = N(Math.ceil(Number(e.nodeCount ?? ((r = e.nodeIntrusion) == null ? void 0 : r.nodeCount)) || 10), 7, 14);
  let i = null;
  for (let s = 0; s < t; s += 1) {
    const a = xt(e, `${n}:${s}`);
    if ((!i || a.layoutScore < i.layoutScore) && (i = a), a.layoutScore < 1 && a.safeRoutes > 1) break;
  }
  return i ?? xt(e, n);
}
const Xt = "holosuite-hacking", qe = `modules/${Xt}/templates/node-intrusion.html`;
var Lt, Rt, qt;
const _e = globalThis.Application ?? ((qt = (Rt = (Lt = globalThis.foundry) == null ? void 0 : Lt.appv1) == null ? void 0 : Rt.api) == null ? void 0 : qt.Application);
function K(e, n, t) {
  return Math.min(t, Math.max(n, e));
}
function Dt(e) {
  return e === "start" ? "entry" : e === "target" ? "target" : e === "firewall" ? "firewall" : e === "decoy" ? "decoy" : "relay";
}
function Ge(e, n, t) {
  const i = globalThis.crypto, r = typeof (i == null ? void 0 : i.randomUUID) == "function" ? i.randomUUID() : `${Date.now()}:${performance.now()}:${Math.random()}`;
  return `${e}:${n}:${t.profileId ?? t.id}:${r}`;
}
class Ue extends _e {
  constructor(t = {}) {
    super(t);
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
    this.rollTotal = Number(t.rollTotal ?? 15), this.dc = Number(t.dc ?? 15), this.profile = t.profile ? { ...t.profile } : et(this.rollTotal, this.dc), this.seed = t.seed ?? Ge(this.rollTotal, this.dc, this.profile), this.onSuccess = typeof t.onSuccess == "function" ? t.onSuccess : null, this.onFailure = typeof t.onFailure == "function" ? t.onFailure : null, this.actorName = String(t.actorName ?? "Hacker"), this.chatOnResult = t.chatOnResult !== !1, this.graph = Re(this.profile, this.seed), this.state = {
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
      template: qe
    });
  }
  getData() {
    var a, o;
    const t = this.getCurrentNode(), i = t.connected, r = !!(this.profile.radarEnabled ?? ((a = this.profile.nodeIntrusion) == null ? void 0 : a.radarEnabled) ?? Number(this.profile.radarRange ?? ((o = this.profile.nodeIntrusion) == null ? void 0 : o.radarRange)) > 0), s = this.graph.nodes.map((l) => {
      const c = l.id === this.state.currentNodeId, u = this.state.visitedNodeIds.has(l.id), d = l.id === this.state.claimingNodeId, f = l.type === "target" && (u || this.profile.showTarget || this.profile.hintsEnabled), h = l.type !== "target" && (this.profile.hintsEnabled || l.revealed || u || l.type === "start"), g = f || h ? Dt(l.type) : "unknown", P = r && (c || u || i.includes(l.id)) && l.type !== "start" && l.type !== "target" ? this.countAdjacentBadNodes(l.id) : 0, y = K(P, 0, 2);
      return {
        ...l,
        visualType: f ? "target" : l.type === "target" ? "normal" : l.type,
        isTargetVisible: f,
        isCurrent: c,
        isVisited: u,
        isClaiming: d,
        isNeighbor: i.includes(l.id),
        canMove: i.includes(l.id) && !this.state.claimingNodeId && !this.state.blockedEdgeIds.has(_(t.id, l.id)) && !this.state.deadNodeIds.has(l.id),
        isDangerVisible: l.type !== "target" && (this.profile.hintsEnabled || l.revealed || u),
        dangerSignal: y,
        displayType: g,
        title: `${l.id} - ${g}${y ? ` / signal ${y}` : ""}`
      };
    });
    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      nodes: s,
      edges: this.graph.edges.map((l) => {
        const c = s.find((f) => f.id === l.from), u = s.find((f) => f.id === l.to), d = this.state.blockedEdgeIds.get(_(l.from, l.to));
        return {
          ...l,
          from: c,
          to: u,
          isVisitedPath: this.state.traversedEdgeIds.has(_(l.from, l.to)),
          isAvailable: !d && (i.includes(l.from) || i.includes(l.to)),
          isFirewallPath: d === "firewall",
          isDecoyPath: d === "decoy"
        };
      }),
      movement: this.state.movement,
      currentNode: {
        id: t.id,
        label: Dt(t.type),
        availableRoutes: s.filter((l) => l.canMove).length
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
    super.activateListeners(t), t.find("[data-node-id]").on("click", (i) => this.handleNodeClick(i.currentTarget.dataset.nodeId)), t.find("[data-action='start']").on("click", () => this.startRun()), t.find("[data-action='abort']").on("click", () => this.abort()), this.syncDom();
  }
  async render(t, i) {
    const r = await super.render(t, i);
    return this.state.hasStarted && this.state.isRunning && this.startTimer(), r;
  }
  async close(t = {}) {
    return this.stopTimer(), this.claimTimer && window.clearTimeout(this.claimTimer), this.claimTimer = null, super.close(t);
  }
  getCurrentNode() {
    return this.graph.nodes.find((t) => t.id === this.state.currentNodeId) ?? this.graph.nodes[0];
  }
  getTraceDuration() {
    const t = Number(game.settings.get(Xt, "traceDurationMultiplier") ?? 1) || 1;
    return Math.max(5, this.profile.traceDurationSeconds * t);
  }
  countAdjacentBadNodes(t) {
    const i = this.graph.nodes.find((r) => r.id === t);
    return i ? i.connected.reduce((r, s) => {
      const a = this.graph.nodes.find((o) => o.id === s);
      return (a == null ? void 0 : a.type) === "firewall" || (a == null ? void 0 : a.type) === "decoy" ? r + 1 : r;
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
    var c, u, d, f;
    if (!this.state.hasStarted || !this.state.isRunning || this.state.claimingNodeId) return;
    const i = this.getCurrentNode(), r = this.graph.nodes.find((h) => h.id === t);
    if (!r) return;
    if (!i.connected.includes(t)) {
      (c = this.element) == null || c.find(".node-intrusion-shell").addClass("invalid-pulse"), window.setTimeout(() => {
        var h;
        return (h = this.element) == null ? void 0 : h.find(".node-intrusion-shell").removeClass("invalid-pulse");
      }, 280);
      return;
    }
    const s = _(i.id, t);
    if (this.state.blockedEdgeIds.has(s) || this.state.deadNodeIds.has(t)) {
      (u = this.element) == null || u.find(".node-intrusion-shell").addClass("invalid-pulse"), window.setTimeout(() => {
        var h;
        return (h = this.element) == null ? void 0 : h.find(".node-intrusion-shell").removeClass("invalid-pulse");
      }, 280);
      return;
    }
    this.state.movement = {
      fromX: i.x,
      fromY: i.y,
      toX: r.x,
      toY: r.y,
      path: `M ${i.x} ${i.y} L ${r.x} ${r.y}`
    }, this.state.claimingNodeId = t, this.render(!1);
    const a = Math.max(0.1, Number(this.profile.claimDurationSeconds ?? ((d = this.profile.nodeIntrusion) == null ? void 0 : d.claimDurationSeconds)) || 0.5), o = Math.max(1, Number(this.profile.firewallClaimMultiplier ?? ((f = this.profile.nodeIntrusion) == null ? void 0 : f.firewallClaimMultiplier)) || 1), l = r.type === "firewall" ? a * o : a;
    this.claimTimer = window.setTimeout(() => {
      this.claimTimer = null, this.completeNodeClaim(i.id, t);
    }, l * 1e3);
  }
  completeNodeClaim(t, i) {
    var o, l, c, u, d, f;
    if (!this.state.hasStarted || !this.state.isRunning) return;
    const r = this.graph.nodes.find((h) => h.id === t), s = this.graph.nodes.find((h) => h.id === i);
    if (!r || !s) return;
    const a = _(r.id, i);
    if (this.state.claimingNodeId = null, this.state.visitedNodeIds.add(i), this.state.traversedEdgeIds.add(a), s.visited = !0, s.revealed = !0, s.type === "firewall") {
      this.state.mistakes += 1;
      const h = Number(this.profile.firewallPenaltySeconds ?? ((o = this.profile.nodeIntrusion) == null ? void 0 : o.firewallPenaltySeconds)) || 6;
      if (this.addTracePenalty(h), (c = (l = ui.notifications) == null ? void 0 : l.warn) == null || c.call(l, `Firewall surge: trace accelerated by ${h}s.`), this.state.result) return;
      this.firewallsArePassable() ? this.state.currentNodeId = i : (this.state.blockedEdgeIds.set(a, "firewall"), this.state.deadNodeIds.add(i)), this.render(!1);
      return;
    }
    if (s.type === "decoy") {
      this.state.mistakes += 1, this.state.blockedEdgeIds.set(a, "decoy"), this.state.deadNodeIds.add(i);
      const h = Number(this.profile.decoyPenaltySeconds ?? ((u = this.profile.nodeIntrusion) == null ? void 0 : u.decoyPenaltySeconds)) || 4;
      this.addTracePenalty(h), (f = (d = ui.notifications) == null ? void 0 : d.warn) == null || f.call(d, `Decoy sink: trace accelerated by ${h}s.`), this.render(!1);
      return;
    }
    if (this.state.currentNodeId = i, s.type === "target") {
      this.finish("success", "Target node breached");
      return;
    }
    this.render(!1);
  }
  addTracePenalty(t) {
    const i = Math.max(0, t) / this.getTraceDuration() * 100;
    this.state.tracePenaltyProgress = K(this.state.tracePenaltyProgress + i, 0, 100), this.state.traceProgress = K(this.state.traceProgress + i, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
  }
  startTimer() {
    if (this.timer || !this.state.hasStarted || !this.startedAt) return;
    const t = this.getTraceDuration();
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const i = (performance.now() - this.startedAt) / 1e3;
      this.state.traceProgress = K(i / t * 100 + this.state.tracePenaltyProgress, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
    }, 120);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(t, i, { close: r = !1 } = {}) {
    var a, o;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = t, this.stopTimer(), this.resultMessage = i, this.syncDom(), await this.render(!1);
    const s = {
      type: "node-intrusion",
      result: t,
      message: i,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      tracePenaltyProgress: this.state.tracePenaltyProgress,
      traceProgress: this.state.traceProgress,
      visitedNodeIds: [...this.state.visitedNodeIds]
    };
    this.chatOnResult && await Wt({
      title: "Node Intrusion",
      result: t,
      actorName: this.actorName,
      message: i,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), t === "success" ? (a = this.onSuccess) == null || a.call(this, s) : (o = this.onFailure) == null || o.call(this, s), r && await this.close();
  }
  syncDom() {
    var a;
    const t = (a = this.element) == null ? void 0 : a[0];
    if (!t) return;
    const i = t.querySelector("[data-trace-fill]"), r = t.querySelector("[data-trace-text]"), s = t.querySelector("[data-penalty-text]");
    i && (i.style.width = `${this.state.traceProgress}%`), r && (r.textContent = `${Math.round(this.state.traceProgress)}%`), s && (s.textContent = `${Math.round(this.state.tracePenaltyProgress)}%`);
  }
}
function Jt(e, n, t) {
  return Math.min(t, Math.max(n, e));
}
function je(e) {
  const n = String(e ?? "signal-alignment");
  let t = 2166136261;
  for (let i = 0; i < n.length; i += 1)
    t ^= n.charCodeAt(i), t = Math.imul(t, 16777619);
  return t >>> 0;
}
function Be(e) {
  let n = je(e);
  return () => {
    n += 1831565813;
    let t = n;
    return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function rt(e) {
  return Jt(Number(e) || 0, 0, 100);
}
function ze(e, n = Date.now()) {
  var a, o, l;
  const t = Be(n), i = Jt(Number(e.channelCount ?? ((a = e.signalAlignment) == null ? void 0 : a.channelCount)) || 3, 2, 5), r = Number(e.tolerance ?? ((o = e.signalAlignment) == null ? void 0 : o.tolerance) ?? 5), s = Number(e.decoyFrequencies ?? ((l = e.signalAlignment) == null ? void 0 : l.decoyFrequencies) ?? 0);
  return Array.from({ length: i }, (c, u) => {
    const d = Math.round(18 + t() * 64), f = t() > 0.5 ? 1 : -1, h = r + 8 + Math.round(t() * 18), g = t() > 0.5 ? 1 : -1, S = Array.from({ length: s }, () => rt(d + (t() > 0.5 ? 1 : -1) * (r + 9 + t() * 18)));
    return {
      id: `channel-${u + 1}`,
      label: `CH-${String(u + 1).padStart(2, "0")}`,
      value: rt(d + f * h),
      target: d,
      tolerance: r,
      driftDirection: g,
      decoys: S
    };
  });
}
const Yt = "holosuite-hacking", Ve = `modules/${Yt}/templates/signal-alignment.html`;
var _t, Gt, Ut;
const We = globalThis.Application ?? ((Ut = (Gt = (_t = globalThis.foundry) == null ? void 0 : _t.appv1) == null ? void 0 : Gt.api) == null ? void 0 : Ut.Application);
function X(e, n, t) {
  return Math.min(t, Math.max(n, e));
}
class Ke extends We {
  constructor(t = {}) {
    super(t);
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
    this.rollTotal = Number(t.rollTotal ?? 15), this.dc = Number(t.dc ?? 15), this.profile = t.profile ? { ...t.profile } : et(this.rollTotal, this.dc), this.seed = t.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}:signal`, this.onSuccess = typeof t.onSuccess == "function" ? t.onSuccess : null, this.onFailure = typeof t.onFailure == "function" ? t.onFailure : null, this.actorName = String(t.actorName ?? "Hacker"), this.chatOnResult = t.chatOnResult !== !1, this.channels = ze(this.profile, this.seed), this.state = {
      traceProgress: 0,
      mistakes: 0,
      lockProgress: 0,
      destabilizations: 0,
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
      template: Ve
    });
  }
  getData() {
    const t = this.channels.map((i) => {
      const r = Math.abs(i.value - i.target), s = r <= i.tolerance;
      return {
        ...i,
        valueLabel: i.value.toFixed(1),
        deltaLabel: r.toFixed(1),
        aligned: s,
        targetLeft: i.target,
        toleranceLeft: X(i.target - i.tolerance, 0, 100),
        toleranceWidth: X(i.tolerance * 2, 1, 100)
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
    super.activateListeners(t), t.find("[data-channel-slider]").on("input", (i) => this.handleSlider(i.currentTarget)), t.find("[data-action='start']").on("click", () => this.startRun()), t.find("[data-action='abort']").on("click", () => this.abort()), this.syncDom();
  }
  async render(t, i) {
    const r = await super.render(t, i);
    return this.state.hasStarted && this.state.isRunning && this.startTimer(), r;
  }
  async close(t = {}) {
    return this.stopTimer(), super.close(t);
  }
  startRun() {
    this.state.hasStarted || this.state.result || (this.state.hasStarted = !0, this.state.isRunning = !0, this.startedAt = performance.now(), this.lastTickAt = this.startedAt, this.startTimer(), this.render(!1));
  }
  handleSlider(t) {
    if (!this.state.hasStarted || !this.state.isRunning) return;
    const i = this.channels.find((r) => r.id === t.dataset.channelSlider);
    i && (i.value = rt(t.value), this.checkDestabilization(), this.syncDom());
  }
  areAllChannelsAligned() {
    return this.channels.every((t) => Math.abs(t.value - t.target) <= t.tolerance);
  }
  checkDestabilization() {
    var i, r;
    const t = this.areAllChannelsAligned();
    this.wasAligned && !t && (this.state.mistakes += 1, this.state.destabilizations += 1, (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, `Signal destabilized (${this.state.mistakes}/${this.profile.maxMistakes}).`), this.state.mistakes > this.profile.maxMistakes && this.finish("failure", "Signal destabilized too often")), this.wasAligned = t;
  }
  startTimer() {
    if (this.timer || !this.state.hasStarted || !this.startedAt || !this.lastTickAt) return;
    const t = Number(game.settings.get(Yt, "traceDurationMultiplier") ?? 1) || 1, i = Math.max(5, this.profile.traceDurationSeconds * t);
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const r = performance.now(), s = Math.min(0.5, (r - this.lastTickAt) / 1e3);
      this.lastTickAt = r, this.applyDrift(s);
      const a = this.areAllChannelsAligned();
      this.state.lockProgress = a ? X(this.state.lockProgress + s / this.profile.lockHoldSeconds, 0, 1) : 0, this.wasAligned && !a && (this.state.mistakes += 1, this.state.destabilizations += 1), this.wasAligned = a;
      const o = (r - this.startedAt) / 1e3;
      this.state.traceProgress = X(o / i * 100, 0, 100), this.syncDom(), this.state.lockProgress >= 1 ? this.finish("success", "Transmission Decrypted") : this.state.traceProgress >= 100 ? this.finish("failure", "Trace Complete") : this.state.mistakes > this.profile.maxMistakes && this.finish("failure", "Signal destabilized too often");
    }, 120);
  }
  applyDrift(t) {
    const i = Number(this.profile.signalDriftSpeed ?? 0);
    if (!(i <= 0))
      for (const r of this.channels)
        r.value = rt(r.value + r.driftDirection * i * t), (r.value <= 0 || r.value >= 100) && (r.driftDirection *= -1);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(t, i, { close: r = !1 } = {}) {
    var a, o;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = t, this.stopTimer(), this.resultMessage = i, this.syncDom(), await this.render(!1);
    const s = {
      type: "signal-alignment",
      result: t,
      message: i,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      traceProgress: this.state.traceProgress,
      lockProgress: this.state.lockProgress,
      channels: this.channels.map((l) => ({ ...l }))
    };
    this.chatOnResult && await Wt({
      title: "Signal Alignment",
      result: t,
      actorName: this.actorName,
      message: i,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), t === "success" ? (a = this.onSuccess) == null || a.call(this, s) : (o = this.onFailure) == null || o.call(this, s), r && await this.close();
  }
  syncDom() {
    var l;
    const t = (l = this.element) == null ? void 0 : l[0];
    if (!t) return;
    const i = t.querySelector("[data-trace-fill]"), r = t.querySelector("[data-trace-text]"), s = t.querySelector("[data-mistake-text]"), a = t.querySelector("[data-lock-fill]"), o = t.querySelector("[data-lock-text]");
    i && (i.style.width = `${this.state.traceProgress}%`), r && (r.textContent = `${Math.round(this.state.traceProgress)}%`), s && (s.textContent = `${this.state.mistakes}/${this.profile.maxMistakes}`), a && (a.style.width = `${Math.round(this.state.lockProgress * 100)}%`), o && (o.textContent = `${Math.round(this.state.lockProgress * 100)}%`);
    for (const c of this.channels) {
      const u = t.querySelector(`[data-channel-row="${c.id}"]`);
      if (!u) continue;
      const d = Math.abs(c.value - c.target) <= c.tolerance;
      u.classList.toggle("is-aligned", d), u.querySelector("[data-channel-value]").textContent = c.value.toFixed(1), u.querySelector("[data-channel-delta]").textContent = Math.abs(c.value - c.target).toFixed(1);
      const f = u.querySelector("[data-channel-slider]");
      f && document.activeElement !== f && (f.value = c.value);
      const h = u.querySelector("[data-wave-fill]");
      h && (h.style.width = `${c.value}%`);
    }
  }
}
const w = "holosuite-hacking", St = `module.${w}`, Xe = 10 * 60 * 1e3;
let I = null, J = null;
const st = /* @__PURE__ */ new Map();
function Je() {
  game.settings.register(w, "defaultDc", {
    name: "Default Hacking DC",
    hint: "Used by the GM launcher and API calls that omit a DC.",
    scope: "world",
    config: !0,
    type: Number,
    default: 15
  }), game.settings.register(w, "traceDurationMultiplier", {
    name: "Default Trace Duration Multiplier",
    hint: "Multiplies trace timers for all HoloSuite hacking minigames.",
    scope: "world",
    config: !0,
    type: Number,
    default: 1
  }), game.settings.register(w, "nodeTakeoverDurationSeconds", {
    name: "Node Takeover Duration Override",
    hint: "Optional fixed seconds for claiming a Node Intrusion node. Set to 0 to use the selected difficulty profile.",
    scope: "world",
    config: !0,
    type: Number,
    default: 0
  }), game.settings.registerMenu(w, "difficultyProfilesMenu", {
    name: "Difficulty Profiles",
    label: "Configure Profiles",
    hint: "Tune Node Intrusion profile timers, map size, hazards, radar, takeover speed, and penalties.",
    icon: "fas fa-sliders",
    type: Ne,
    restricted: !0
  }), game.settings.register(w, "difficultyProfileOverrides", {
    name: "Difficulty Profile Data",
    hint: "Internal storage for the Difficulty Profiles configuration menu.",
    scope: "world",
    config: !1,
    type: String,
    default: ""
  }), game.settings.register(w, "allowPlayerInteraction", {
    name: "Allow Players To Interact Directly",
    hint: "Reserved for future player-targeted play. The GM launcher remains GM-only for now.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(w, "visualGlitchIntensity", {
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
function Ye() {
  Ct({
    id: "node-intrusion",
    title: "Node Intrusion",
    icon: "fa-solid fa-network-wired",
    create: (e) => new Ue(e)
  }), Ct({
    id: "signal-alignment",
    title: "Signal Alignment",
    icon: "fa-solid fa-wave-square",
    create: (e) => new Ke(e)
  });
}
function Qt() {
  var e, n, t;
  return (e = game.user) != null && e.isGM ? (J = J ?? new Se({ api: I }), J.render(!0), J) : ((t = (n = ui.notifications) == null ? void 0 : n.warn) == null || t.call(n, "Only the GM can open HoloSuite Hacking."), null);
}
function Zt() {
  I = I ?? he({ moduleId: w, openLauncher: Qt }), I.sendHackToPlayer = Qe, I.registerWithHoloSuite = dt;
  const e = game.modules.get(w);
  return e && (e.api = I), game.holosuiteHacking = I, I;
}
function Qe(e = {}) {
  var o, l, c, u, d, f, h;
  if (!((o = game.user) != null && o.isGM))
    return (c = (l = ui.notifications) == null ? void 0 : l.warn) == null || c.call(l, "Only the GM can send HoloSuite hacking challenges."), !1;
  if (!game.socket)
    return (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(u, "Foundry sockets are not available."), !1;
  const n = te(e), t = mt(n.userId), i = bt(n.actorId, t);
  i ? t && !j(i, t) && console.warn(`${w} | ${t.name} does not appear to own ${i.name}; sending fallback roll data anyway.`) : console.warn(`${w} | Could not resolve hacker actor.`, {
    actorId: n.actorId,
    userId: n.userId,
    availableUsers: ht().map((g) => ({ id: g.id, name: g.name, isGM: g.isGM })),
    userCharacter: U(t),
    ownedActors: pt(t).map((g) => ({ id: g.id, name: g.name }))
  });
  const r = Bt(i, n.skillId), s = n.skillLabel || at(n.skillId, r), a = Number.isFinite(Number(n.skillModifier)) && Number(n.skillModifier) !== 0 ? Number(n.skillModifier) : yt(r);
  if (typeof e.onSuccess == "function" || typeof e.onFailure == "function") {
    const g = window.setTimeout(() => st.delete(n.requestId), Xe);
    st.set(n.requestId, {
      onSuccess: typeof e.onSuccess == "function" ? e.onSuccess : null,
      onFailure: typeof e.onFailure == "function" ? e.onFailure : null,
      timeoutId: g
    });
  }
  return game.socket.emit(St, {
    type: "launch-request",
    payload: {
      ...n,
      actorId: (i == null ? void 0 : i.id) ?? "",
      actorName: (i == null ? void 0 : i.name) ?? (t == null ? void 0 : t.name) ?? "Hacker",
      skillLabel: s,
      skillModifier: a,
      gmUserId: game.user.id
    }
  }), (h = (f = ui.notifications) == null ? void 0 : f.info) == null || h.call(f, `${ot(n.minigameType)} sent${t ? ` to ${t.name}` : " to players"}.`), !0;
}
function Ze(e) {
  var n, t, i, r;
  try {
    if ((e == null ? void 0 : e.type) === "result-report") {
      rn(e.payload ?? {});
      return;
    }
    if ((e == null ? void 0 : e.type) !== "launch-request") return;
    const s = te(e.payload ?? {});
    if (s.userId && s.userId !== ((n = game.user) == null ? void 0 : n.id) || !s.userId && ((t = game.user) != null && t.isGM)) return;
    const a = bt(s.actorId, mt(s.userId) ?? game.user), o = s.actorName || (a == null ? void 0 : a.name) || "Intruder", l = s.skillLabel || at(s.skillId, Bt(a, s.skillId));
    new Dialog({
      title: ot(s.minigameType),
      content: sn(s, o, l),
      buttons: {
        start: {
          icon: '<i class="fa-solid fa-terminal"></i>',
          label: "Accept and roll",
          callback: async () => tn(s)
        }
      },
      default: "start"
    }, {
      classes: ["holosuite-hacking-start-dialog"]
    }).render(!0);
  } catch (s) {
    console.error(`${w} | Failed to handle hacking launch request.`, s), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(i, "HoloSuite Hacking launch failed. See console for details.");
  }
}
async function tn(e) {
  const n = bt(e.actorId, mt(e.userId) ?? game.user), t = await en(e);
  if (!Number.isFinite(t == null ? void 0 : t.total)) return null;
  const i = {
    rollTotal: t.total,
    naturalRoll: t.naturalRoll,
    dc: e.dc,
    actorId: e.actorId,
    actorName: (n == null ? void 0 : n.name) ?? e.actorName ?? "Hacker",
    userId: e.userId,
    skillId: e.skillId,
    onSuccess: (r) => At(e, r),
    onFailure: (r) => At(e, r)
  };
  return e.minigameType === "signal-alignment" ? I.startSignalAlignment(i) : I.startNodeIntrusion(i);
}
async function en(e) {
  var n, t;
  try {
    const i = Number(e.skillModifier ?? 0), r = `1d20 ${i >= 0 ? "+" : "-"} ${Math.abs(i)}`, s = await new Roll(r).evaluate({ async: !0 });
    return await s.toMessage({
      speaker: ChatMessage.getSpeaker(),
      flavor: `${D(ot(e.minigameType))}: ${D(e.skillLabel || e.skillId || "Skill")} vs DC ${Number(e.dc)}`
    }), {
      total: Number(s.total),
      naturalRoll: nn(s),
      roll: s
    };
  } catch (i) {
    return console.error(`${w} | Fallback skill roll failed.`, i), (t = (n = ui.notifications) == null ? void 0 : n.warn) == null || t.call(n, "HoloSuite Hacking skill check failed."), null;
  }
}
function nn(e) {
  var s, a, o, l, c;
  const t = ((e == null ? void 0 : e.dice) ?? ((a = (s = e == null ? void 0 : e.terms) == null ? void 0 : s.filter) == null ? void 0 : a.call(s, (u) => (u == null ? void 0 : u.faces) === 20)) ?? []).find((u) => Number(u == null ? void 0 : u.faces) === 20), i = (c = (l = (o = t == null ? void 0 : t.results) == null ? void 0 : o.find) == null ? void 0 : l.call(o, (u) => !u.discarded && !u.rerolled)) == null ? void 0 : c.result, r = Number(i);
  return Number.isFinite(r) ? r : null;
}
function At(e, n) {
  var t, i;
  (i = (t = game.socket) == null ? void 0 : t.emit) == null || i.call(t, St, {
    type: "result-report",
    payload: {
      requestId: e.requestId,
      gmUserId: e.gmUserId,
      result: n
    }
  });
}
function rn(e = {}) {
  var i, r, s;
  if (!((i = game.user) != null && i.isGM) || e.gmUserId !== game.user.id) return;
  const n = st.get(e.requestId);
  st.delete(e.requestId), n != null && n.timeoutId && window.clearTimeout(n.timeoutId);
  const t = e.result ?? {};
  t.result === "success" ? (r = n == null ? void 0 : n.onSuccess) == null || r.call(n, t) : (s = n == null ? void 0 : n.onFailure) == null || s.call(n, t);
}
function sn(e, n, t) {
  return `
    <section class="holosuite-hacking-start-prompt">
      <p>Incoming hacking challenge</p>
      <h2>${D(ot(e.minigameType))}</h2>
      <div>${D(n)} rolls ${D(t)} vs DC ${Number(e.dc)}</div>
    </section>
  `;
}
function te(e = {}) {
  const n = Number(game.settings.get(w, "defaultDc") ?? 15);
  return {
    requestId: String(e.requestId ?? foundry.utils.randomID()),
    minigameType: String(e.minigameType ?? e.type ?? "node-intrusion"),
    userId: String(e.userId ?? ""),
    actorId: String(e.actorId ?? ""),
    actorName: String(e.actorName ?? ""),
    skillId: String(e.skillId ?? ""),
    skillLabel: String(e.skillLabel ?? ""),
    skillModifier: Number(e.skillModifier ?? 0),
    dc: Number(e.dc ?? n),
    gmUserId: String(e.gmUserId ?? "")
  };
}
function bt(e, n) {
  const t = q(e);
  if (t) return t;
  const i = U(n);
  if (i) return i;
  const r = pt(n);
  if (r.length === 1) return r[0];
  const s = me();
  return s && j(s, n) ? s : null;
}
function ot(e) {
  var n, t;
  return ((t = (n = I == null ? void 0 : I.getMinigames) == null ? void 0 : n.call(I).find((i) => i.id === e)) == null ? void 0 : t.title) ?? String(e ?? "Hacking");
}
function dt() {
  var n, t;
  const e = ((n = game.modules.get("holosuite-core")) == null ? void 0 : n.api) ?? game.holosuite;
  return typeof (e == null ? void 0 : e.registerApp) != "function" ? !1 : ((t = e.unregisterApp) == null || t.call(e, "node-intrusion"), e.registerApp({
    id: w,
    title: "HoloSuite Hacking",
    icon: "fa-solid fa-terminal",
    premium: !1,
    featureId: w,
    playerVisible: !1,
    description: "Reusable hacking minigames for terminals, traces, and signal puzzles.",
    open: () => Qt()
  }), !0);
}
Hooks.once("init", () => {
  Je(), Ye(), Zt();
});
Hooks.once("ready", () => {
  var e, n;
  Zt(), (n = (e = game.socket) == null ? void 0 : e.on) == null || n.call(e, St, Ze), dt(), window.setTimeout(() => dt(), 500), console.log(`${w} | Ready. API available at game.modules.get("${w}").api`);
});
