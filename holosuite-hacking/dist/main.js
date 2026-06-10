var Pt = Object.defineProperty;
var Ht = (e, n, t) => n in e ? Pt(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t;
var m = (e, n, t) => Ht(e, typeof n != "symbol" ? n + "" : n, t);
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
      nodeCount: 8,
      firewallCount: 1,
      decoyCount: 1,
      allowFirewallOnMainPath: !1
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
      nodeCount: 10,
      firewallCount: 2,
      decoyCount: 2,
      allowFirewallOnMainPath: !1
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
      nodeCount: 12,
      firewallCount: 3,
      decoyCount: 3,
      allowFirewallOnMainPath: !1
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
      nodeCount: 15,
      firewallCount: 5,
      decoyCount: 4,
      allowFirewallOnMainPath: !1
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
    traceDurationSeconds: 32,
    maxMistakes: 1,
    hintsEnabled: !1,
    visualGlitchIntensity: 0.9,
    nodeIntrusion: {
      nodeCount: 18,
      firewallCount: 7,
      decoyCount: 6,
      allowFirewallOnMainPath: !0
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
function $(e) {
  return {
    ...e,
    ...e.nodeIntrusion,
    ...e.signalAlignment,
    allowMainPathFirewalls: e.nodeIntrusion.allowFirewallOnMainPath
  };
}
function z(e = 0, n = 10) {
  const t = Number(e) || 0, i = Number(n) || 10;
  return t <= i - 10 ? $(x.critical_failure) : t >= i + 10 ? $(x.critical_success) : t >= i + 5 ? $(x.strong_success) : t >= i ? $(x.success) : $(x.failure_but_playable);
}
const J = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map();
function at(e) {
  const n = String((e == null ? void 0 : e.id) ?? "").trim();
  if (!n || typeof (e == null ? void 0 : e.create) != "function")
    throw new Error("HoloSuite Hacking minigames require an id and create(options) function.");
  J.set(n, {
    title: String(e.title ?? n),
    icon: String(e.icon ?? "fa-solid fa-terminal"),
    ...e,
    id: n
  });
}
function Ft(e) {
  return J.get(String(e ?? ""));
}
function Lt() {
  return [...J.values()];
}
function Ot(e, n = {}) {
  var r, a, o, c;
  const t = Ft(e);
  if (!t)
    return (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, `Unknown HoloSuite hacking minigame: ${e}`), null;
  (c = (o = P.get(t.id)) == null ? void 0 : o.close) == null || c.call(o);
  const i = t.create(n), s = i.close.bind(i);
  return i.close = async (...l) => (P.delete(t.id), s(...l)), P.set(t.id, i), i.render(!0), i;
}
function qt(e) {
  return e ? P.get(String(e)) ?? null : [...P.values()].at(-1) ?? null;
}
function Rt({ moduleId: e, openLauncher: n }) {
  function t(a) {
    const o = String(game.settings.get(e, "visualGlitchIntensity") ?? "medium"), c = Number(a.visualGlitchIntensity ?? 0.4), l = o === "low" ? Math.min(c, 0.25) : o === "high" ? Math.min(1, c + 0.2) : c;
    return { ...a, visualGlitchIntensity: l };
  }
  function i(a = {}) {
    const o = Number(game.settings.get(e, "defaultDc") ?? 15), c = Number(a.dc ?? o), l = Number(a.rollTotal ?? c), u = t(a.profile ?? z(l, c));
    return { ...a, dc: c, rollTotal: l, profile: u };
  }
  function s(a = {}) {
    const o = String(a.type ?? "node-intrusion");
    return Ot(o, i(a));
  }
  const r = {
    startHack: s,
    startNodeIntrusion: (a = {}) => s({ ...a, type: "node-intrusion" }),
    startSignalAlignment: (a = {}) => s({ ...a, type: "signal-alignment" }),
    openLauncher: n,
    getDifficultyProfile: z,
    difficultyProfiles: x,
    getMinigames: Lt,
    getActiveApp: qt,
    testNodeIntrusion: () => r.startNodeIntrusion({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }),
    testSignalAlignment: () => r.startSignalAlignment({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    })
  };
  return r;
}
function T(e) {
  const n = document.createElement("div");
  return n.textContent = String(e ?? ""), n.innerHTML;
}
function K() {
  return Q().filter((n) => !n.isGM);
}
function Q() {
  var e;
  return Array.isArray(game.users) ? game.users : ((e = game.users) == null ? void 0 : e.contents) ?? [...game.users ?? []];
}
function Z(e) {
  var t, i;
  const n = String(e ?? "");
  return ((i = (t = game.users) == null ? void 0 : t.get) == null ? void 0 : i.call(t, n)) ?? Q().find((s) => s.id === n) ?? null;
}
function tt() {
  var e;
  return Array.isArray(game.actors) ? game.actors : ((e = game.actors) == null ? void 0 : e.contents) ?? [...game.actors ?? []];
}
function C(e) {
  var t, i;
  const n = String(e ?? "");
  return ((i = (t = game.actors) == null ? void 0 : t.get) == null ? void 0 : i.call(t, n)) ?? tt().find((s) => s.id === n || s.uuid === n) ?? null;
}
function H(e) {
  const n = e == null ? void 0 : e.character;
  return n ? typeof n == "string" ? C(n) : n : null;
}
function F(e, n) {
  var s, r, a, o;
  if (!e || !n) return !1;
  if (e === H(n) || (s = e.testUserPermission) != null && s.call(e, n, "OWNER")) return !0;
  const t = ((a = (r = globalThis.CONST) == null ? void 0 : r.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3, i = e.ownership ?? ((o = e.data) == null ? void 0 : o.permission) ?? {};
  return Number(i[n.id] ?? i.default ?? 0) >= t;
}
function Et() {
  var e, n, t;
  return ((t = (n = (e = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : e.controlled) == null ? void 0 : n[0]) == null ? void 0 : t.actor) ?? null;
}
function et(e) {
  const n = H(e) ? [H(e)] : [], t = tt().filter((s) => F(s, e));
  return [...new Map([...n, ...t].filter(Boolean).map((s) => [s.id, s])).values()].sort((s, r) => s.name.localeCompare(r.name));
}
function ot(e = "") {
  const n = K(), t = n.find((s) => s.id === e);
  return (t ? et(t) : tt()).filter((s) => !t || F(s, t)).map((s) => ({
    id: s.id,
    name: s.name,
    owners: n.filter((r) => F(s, r))
  })).sort((s, r) => s.name.localeCompare(r.name));
}
const _t = {
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
function ct(e) {
  var t;
  const n = (t = e == null ? void 0 : e.system) == null ? void 0 : t.skills;
  if (n && typeof n == "object") {
    const i = Object.entries(n).map(([s, r]) => ({
      id: s,
      name: V(s, r),
      label: Gt(s, r),
      modifier: nt(r)
    }));
    if (i.length) return i.sort((s, r) => s.label.localeCompare(r.label));
  }
  return [
    { id: "hacking", name: "Hacking", label: "Hacking (+0)", modifier: 0 },
    { id: "computers", name: "Computers", label: "Computers (+0)", modifier: 0 },
    { id: "technology", name: "Technology", label: "Technology (+0)", modifier: 0 },
    { id: "intelligence", name: "Intelligence", label: "Intelligence (+0)", modifier: 0 }
  ];
}
function Mt(e, n) {
  var t, i;
  return ((i = (t = e == null ? void 0 : e.system) == null ? void 0 : t.skills) == null ? void 0 : i[n]) ?? null;
}
function V(e, n) {
  const t = String((n == null ? void 0 : n.label) ?? (n == null ? void 0 : n.name) ?? (n == null ? void 0 : n.localizedName) ?? e ?? "Skill").trim(), i = t.toLowerCase().replace(/[^a-z0-9]/g, "");
  return String(_t[i] ?? t).replace(/[_-]/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
}
function nt(e) {
  var s, r, a, o, c, l, u, h, f, b;
  if (typeof e == "number") return e;
  if (!e || typeof e != "object") return 0;
  const t = [
    e == null ? void 0 : e.mod,
    (s = e == null ? void 0 : e.mod) == null ? void 0 : s.value,
    e == null ? void 0 : e.modifier,
    (r = e == null ? void 0 : e.modifier) == null ? void 0 : r.value,
    e == null ? void 0 : e.total,
    (a = e == null ? void 0 : e.total) == null ? void 0 : a.value,
    e == null ? void 0 : e.value,
    (o = e == null ? void 0 : e.value) == null ? void 0 : o.value,
    e == null ? void 0 : e.bonus,
    (c = e == null ? void 0 : e.bonus) == null ? void 0 : c.value,
    e == null ? void 0 : e.check,
    (l = e == null ? void 0 : e.check) == null ? void 0 : l.mod,
    (u = e == null ? void 0 : e.check) == null ? void 0 : u.total,
    e == null ? void 0 : e.roll,
    (h = e == null ? void 0 : e.roll) == null ? void 0 : h.mod,
    (f = e == null ? void 0 : e.roll) == null ? void 0 : f.total,
    e == null ? void 0 : e.rank,
    e == null ? void 0 : e.ranks
  ].find((g) => Number.isFinite(Number(g)));
  if (t !== void 0) return Number(t);
  const i = [];
  return vt(e, i, 0), i.sort((g, M) => M.score - g.score), Number(((b = i[0]) == null ? void 0 : b.value) ?? 0);
}
function Gt(e, n) {
  const t = V(e, n), i = nt(n), s = i >= 0 ? "+" : "-";
  return `${t} (${s}${Math.abs(i)})`;
}
function vt(e, n, t, i = "") {
  if (!(!e || typeof e != "object" || t > 4))
    for (const [s, r] of Object.entries(e)) {
      const a = i ? `${i}.${s}` : s, o = Number(r);
      if (Number.isFinite(o)) {
        const c = a.toLowerCase();
        let l = 1;
        /(total|mod|modifier|bonus|check|roll|value)$/.test(c) && (l += 6), /(dc|rank|ranks|proficient|prof|trained|ability|base|label|name)/.test(c) && (l -= 4), Math.abs(o) > 30 && (l -= 5), n.push({ value: o, score: l, path: a });
      } else r && typeof r == "object" && vt(r, n, t + 1, a);
    }
}
const U = "holosuite-hacking", Ut = `modules/${U}/templates/hacking-launcher.html`;
var ft, mt, gt;
const zt = globalThis.Application ?? ((gt = (mt = (ft = globalThis.foundry) == null ? void 0 : ft.appv1) == null ? void 0 : mt.api) == null ? void 0 : gt.Application);
class jt extends zt {
  constructor(t = {}) {
    super(t);
    m(this, "api");
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
      template: Ut
    });
  }
  getData() {
    const t = Number(game.settings.get(U, "defaultDc") ?? 15), i = K(), s = i[0] ?? null, r = ot(s == null ? void 0 : s.id), a = r.length ? C(r[0].id) : null;
    return {
      defaultDc: t,
      defaultTestRoll: t,
      minigames: this.api.getMinigames(),
      actors: r.map((o) => ({
        id: o.id,
        name: o.name,
        ownerNames: o.owners.map((c) => c.name).join(", ") || "No active owner"
      })),
      users: i.map((o) => ({
        id: o.id,
        name: o.name
      })),
      skills: ct(a)
    };
  }
  activateListeners(t) {
    super.activateListeners(t);
    const i = t.is("form") ? t[0] : t.find("form")[0];
    t.find("[data-action='start']").on("click", (r) => {
      r.preventDefault(), this.submit(i);
    }), t.find("[data-action='test-self']").on("click", (r) => {
      r.preventDefault(), this.testSelf(i);
    }), (t.is("form") ? t : t.find("form")).on("submit", (r) => {
      r.preventDefault(), this.submit(r.currentTarget);
    }), t.find("[name='actorId']").on("change", (r) => {
      this.syncUserToActor(t, r.currentTarget.value), this.syncSkillOptions(t, r.currentTarget.value);
    }), t.find("[name='userId']").on("change", (r) => {
      this.syncActorsForUser(t, r.currentTarget.value);
    }), this.syncSkillOptions(t, t.find("[name='actorId']").val());
  }
  submit(t) {
    var p, y, S, v, A, L;
    if (!((p = game.user) != null && p.isGM)) {
      (S = (y = ui.notifications) == null ? void 0 : y.warn) == null || S.call(y, "Only the GM can open the HoloSuite Hacking launcher.");
      return;
    }
    if (!t) {
      (A = (v = ui.notifications) == null ? void 0 : v.error) == null || A.call(v, "HoloSuite Hacking launcher form was not found."), console.error(`${U} | Launcher form was not found.`);
      return;
    }
    const i = t.querySelector("[name='minigameType']"), s = t.querySelector("[name='actorId']"), r = t.querySelector("[name='userId']"), a = t.querySelector("[name='skillId']"), o = t.querySelector("[name='dc']"), c = ((L = a == null ? void 0 : a.selectedOptions) == null ? void 0 : L[0]) ?? null, l = String((i == null ? void 0 : i.value) || "node-intrusion"), u = String((s == null ? void 0 : s.value) || ""), h = String((r == null ? void 0 : r.value) || ""), f = String((a == null ? void 0 : a.value) || ""), b = String((c == null ? void 0 : c.dataset.skillLabel) || (c == null ? void 0 : c.textContent) || f || "Skill"), g = Number((c == null ? void 0 : c.dataset.skillModifier) ?? 0), M = Number((o == null ? void 0 : o.value) ?? 15);
    this.api.sendHackToPlayer({
      minigameType: l,
      actorId: u,
      userId: h,
      skillId: f,
      skillLabel: b,
      skillModifier: g,
      dc: M,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }) && this.close();
  }
  testSelf(t) {
    var c, l, u, h, f, b, g, M, d, p, y, S, v;
    if (!((c = game.user) != null && c.isGM)) {
      (u = (l = ui.notifications) == null ? void 0 : l.warn) == null || u.call(l, "Only the GM can test HoloSuite Hacking minigames.");
      return;
    }
    if (!t) {
      (f = (h = ui.notifications) == null ? void 0 : h.error) == null || f.call(h, "HoloSuite Hacking launcher form was not found.");
      return;
    }
    const i = String(((b = t.querySelector("[name='minigameType']")) == null ? void 0 : b.value) || "node-intrusion"), s = String(((g = t.querySelector("[name='actorId']")) == null ? void 0 : g.value) || ""), r = Number(((M = t.querySelector("[name='dc']")) == null ? void 0 : M.value) ?? game.settings.get(U, "defaultDc") ?? 15), a = Number(((d = t.querySelector("[name='testRollTotal']")) == null ? void 0 : d.value) ?? r);
    if (!Number.isFinite(a)) {
      (y = (p = ui.notifications) == null ? void 0 : p.warn) == null || y.call(p, "Enter a fake roll result before testing the minigame.");
      return;
    }
    const o = C(s);
    this.api.startHack({
      type: i,
      dc: r,
      rollTotal: a,
      actorName: (o == null ? void 0 : o.name) ?? ((S = game.user) == null ? void 0 : S.name) ?? "GM",
      userId: ((v = game.user) == null ? void 0 : v.id) ?? "",
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }), this.close();
  }
  syncUserToActor(t, i) {
    const s = C(i), r = K().find((a) => s == null ? void 0 : s.testUserPermission(a, "OWNER"));
    r && t.find("[name='userId']").val(r.id);
  }
  syncSkillOptions(t, i) {
    const s = C(i), r = ct(s);
    t.find("[name='skillId']").html(r.map((a) => `<option value="${T(a.id)}" data-skill-label="${T(a.name ?? a.label)}" data-skill-modifier="${Number(a.modifier ?? 0)}">${T(a.label)}</option>`).join(""));
  }
  syncActorsForUser(t, i) {
    const s = ot(i), r = s.length ? s.map((a) => `<option value="${T(a.id)}">${T(a.name)} (${T(a.owners.map((o) => o.name).join(", ") || "No owner")})</option>`).join("") : '<option value="">Use assigned character</option>';
    t.find("[name='actorId']").html(r), this.syncSkillOptions(t, t.find("[name='actorId']").val());
  }
}
async function Tt({ title: e, result: n, actorName: t, message: i, rollTotal: s, dc: r }) {
  const a = n === "success", o = a ? "#38f28f" : "#ff477e", c = a ? "HACK SUCCESS" : "HACK FAILED", l = i || (a ? "Objective completed." : "Trace or countermeasure completed."), u = Number.isFinite(Number(s)) && Number.isFinite(Number(r)) ? `<p style="margin: 4px 0 0; color: #bdeff6;">Roll ${Number(s)} vs DC ${Number(r)}</p>` : "", h = `
    <div class="holosuite-hacking-chat-result" style="border-left: 4px solid ${o}; padding: 8px 10px; background: rgba(5, 8, 14, 0.88); color: ${o};">
      <strong>${O(c)} // ${O(e)} // ${O(t || "Hacker")}</strong>
      <p style="margin: 6px 0 0; color: ${o};">${O(l)}</p>
      ${u}
    </div>
  `;
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content: h
  });
}
function O(e) {
  const n = document.createElement("div");
  return n.textContent = String(e ?? ""), n.innerHTML;
}
function N(e, n, t) {
  return Math.min(t, Math.max(n, e));
}
function Bt(e) {
  const n = String(e ?? "node-intrusion");
  let t = 2166136261;
  for (let i = 0; i < n.length; i += 1)
    t ^= n.charCodeAt(i), t = Math.imul(t, 16777619);
  return t >>> 0;
}
function Vt(e) {
  let n = Bt(e);
  return () => {
    n += 1831565813;
    let t = n;
    return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function q(e, n) {
  return e.length ? e[Math.floor(n() * e.length)] : null;
}
function D(e, n, t) {
  const i = e.find((r) => r.id === n), s = e.find((r) => r.id === t);
  !i || !s || (i.connected.includes(t) || i.connected.push(t), s.connected.includes(n) || s.connected.push(n));
}
function R(e, n) {
  return [e, n].sort().join("--");
}
function X(e, n, t, i) {
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
function it(e) {
  return e.flatMap((n) => n.connected.filter((t) => n.id < t).map((t) => ({ from: n.id, to: t })));
}
function k(e, n) {
  return e.find((t) => t.id === n);
}
function E(e, n, t) {
  return Math.sign((n.y - e.y) * (t.x - n.x) - (n.x - e.x) * (t.y - n.y));
}
function Wt(e, n, t, i) {
  const s = E(e, n, t), r = E(e, n, i), a = E(t, i, e), o = E(t, i, n);
  return s !== r && a !== o;
}
function Kt(e, n, t) {
  if (n.from === t.from || n.from === t.to || n.to === t.from || n.to === t.to) return !1;
  const i = k(e, n.from), s = k(e, n.to), r = k(e, t.from), a = k(e, t.to);
  return !i || !s || !r || !a ? !1 : Wt(i, s, r, a);
}
function Xt(e, n, t) {
  const i = t.x - n.x, s = t.y - n.y, r = i * i + s * s;
  if (!r) {
    const u = e.x - n.x, h = e.y - n.y;
    return Math.sqrt(u * u + h * h);
  }
  const a = N(((e.x - n.x) * i + (e.y - n.y) * s) / r, 0, 1), o = {
    x: n.x + a * i,
    y: n.y + a * s
  }, c = e.x - o.x, l = e.y - o.y;
  return Math.sqrt(c * c + l * l);
}
function Yt(e, n = it(e)) {
  let t = 0;
  for (let i = 0; i < n.length; i += 1)
    for (let s = i + 1; s < n.length; s += 1)
      Kt(e, n[i], n[s]) && (t += 1);
  return t;
}
function Nt(e) {
  const n = it(e);
  let t = Yt(e, n) * 900;
  for (let i = 0; i < e.length; i += 1)
    for (let s = i + 1; s < e.length; s += 1) {
      const r = e[i], a = e[s], o = a.x - r.x, c = a.y - r.y, l = Math.sqrt(o * o + c * c) || 1;
      l < 13 && (t += (13 - l) * 30), l < 18 && (t += (18 - l) * 6);
    }
  for (const i of e)
    for (const s of n) {
      if (s.from === i.id || s.to === i.id) continue;
      const r = k(e, s.from), a = k(e, s.to);
      if (!r || !a) continue;
      const o = Xt(i, r, a);
      o < 8 && (t += (8 - o) * 18);
    }
  return t;
}
function Jt(e, n, t) {
  const i = e.map((s) => ({ ...s, connected: [...s.connected] }));
  i.push({ ...n, connected: [] });
  for (const s of t) D(i, n.id, s);
  return Nt(i);
}
function lt(e, n, t, i, s, r, a = {}) {
  const {
    radiusMin: o = 17,
    radiusMax: c = 34,
    biasX: l = 5,
    ySpread: u = 1
  } = a;
  let h = null, f = 1 / 0;
  for (let b = 0; b < 16; b += 1) {
    const g = s() * Math.PI * 2 - Math.PI * 0.2, M = o + s() * (c - o), d = i.x + Math.cos(g) * M + l, p = i.y + Math.sin(g) * M * u, y = X(n, t, d, p), S = Jt(e, y, r);
    S < f && (h = y, f = S);
  }
  return h ?? X(n, t, i.x + l, i.y);
}
function Qt(e) {
  for (let n = 0; n < 24; n += 1)
    for (let t = 0; t < e.length; t += 1)
      for (let i = t + 1; i < e.length; i += 1) {
        const s = e[t], r = e[i], a = r.x - s.x, o = r.y - s.y, c = Math.sqrt(a * a + o * o) || 1;
        if (c >= 13) continue;
        const l = (13 - c) * 0.35, u = a / c * l, h = o / c * l;
        s.type !== "start" && s.type !== "target" && (s.x = N(s.x - u, 6, 94), s.y = N(s.y - h, 10, 90)), r.type !== "start" && r.type !== "target" && (r.x = N(r.x + u, 6, 94), r.y = N(r.y + h, 10, 90));
      }
}
function ut(e, n = Date.now()) {
  var b, g, M;
  const t = Vt(n), i = Math.max(6, Number(e.nodeCount ?? ((b = e.nodeIntrusion) == null ? void 0 : b.nodeCount)) || 10), s = N(Number(e.decoyCount ?? ((g = e.nodeIntrusion) == null ? void 0 : g.decoyCount)) || 0, 0, i - 4), r = Math.max(0, i - s), a = N(Math.round(r * 0.55), 5, r), o = [], c = [];
  for (let d = 0; d < a; d += 1) {
    const p = d === 0 ? "start" : d === a - 1 ? "target" : `node-${d}`, y = d === 0 ? "start" : d === a - 1 ? "target" : "normal", S = d / Math.max(1, a - 1), v = Math.sin(S * Math.PI * 1.35) * 10, A = d === 0 || d === a - 1 ? 0 : (t() - 0.5) * 5, L = d === 0 || d === a - 1 ? 0 : (t() - 0.5) * 12;
    o.push(X(p, y, 9 + S * 82 + A, 52 + v + L)), c.push(p), d > 0 && D(o, c[d - 1], p);
  }
  let l = a;
  for (; o.length < i - s; ) {
    const d = q(o.filter((A) => A.type !== "target"), t) ?? o[0], p = `node-${l}`;
    l += 1;
    const y = t() > 0.45 ? q(o.filter((A) => A.id !== d.id && A.type !== "start"), t) : null, S = y ? [d.id, y.id] : [d.id], v = lt(o, p, "normal", d, t, S, {
      radiusMin: 16,
      radiusMax: 31,
      biasX: t() > 0.35 ? 5 : -4,
      ySpread: 1.15
    });
    o.push(v), D(o, d.id, p), y && D(o, p, y.id);
  }
  for (let d = 0; d < s; d += 1) {
    const p = q(o.filter((v) => v.type !== "target" && v.type !== "decoy"), t) ?? o[0], y = `decoy-${d + 1}`, S = lt(o, y, "decoy", p, t, [p.id], {
      radiusMin: 18,
      radiusMax: 34,
      biasX: t() > 0.5 ? -6 : 6,
      ySpread: 1.25
    });
    o.push(S), D(o, p.id, y);
  }
  const u = e.allowFirewallOnMainPath ?? e.allowMainPathFirewalls ?? !1, h = o.filter((d) => d.type === "start" || d.type === "target" || d.type === "decoy" ? !1 : u || !c.includes(d.id)), f = N(Number(e.firewallCount ?? ((M = e.nodeIntrusion) == null ? void 0 : M.firewallCount)) || 0, 0, h.length);
  for (let d = 0; d < f; d += 1) {
    const p = h.filter((S) => S.type !== "firewall"), y = q(p, t);
    if (!y) break;
    y.type = "firewall";
  }
  return Qt(o), {
    nodes: o,
    edges: it(o),
    startNodeId: "start",
    targetNodeId: "target",
    mainPathIds: c,
    layoutScore: Nt(o)
  };
}
function Zt(e, n = Date.now()) {
  var s;
  const t = N(Math.ceil(Number(e.nodeCount ?? ((s = e.nodeIntrusion) == null ? void 0 : s.nodeCount)) || 10), 7, 14);
  let i = null;
  for (let r = 0; r < t; r += 1) {
    const a = ut(e, `${n}:${r}`);
    if ((!i || a.layoutScore < i.layoutScore) && (i = a), a.layoutScore < 1) break;
  }
  return i ?? ut(e, n);
}
const At = "holosuite-hacking", te = `modules/${At}/templates/node-intrusion.html`;
var pt, yt, bt;
const ee = globalThis.Application ?? ((bt = (yt = (pt = globalThis.foundry) == null ? void 0 : pt.appv1) == null ? void 0 : yt.api) == null ? void 0 : bt.Application);
function ne(e, n, t) {
  return Math.min(t, Math.max(n, e));
}
function dt(e) {
  return e === "start" ? "entry" : e === "target" ? "target" : e === "firewall" ? "firewall" : e === "decoy" ? "decoy" : "relay";
}
class ie extends ee {
  constructor(t = {}) {
    super(t);
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
    m(this, "resultMessage");
    this.rollTotal = Number(t.rollTotal ?? 15), this.dc = Number(t.dc ?? 15), this.profile = t.profile ? { ...t.profile } : z(this.rollTotal, this.dc), this.seed = t.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}`, this.onSuccess = typeof t.onSuccess == "function" ? t.onSuccess : null, this.onFailure = typeof t.onFailure == "function" ? t.onFailure : null, this.actorName = String(t.actorName ?? "Hacker"), this.chatOnResult = t.chatOnResult !== !1, this.graph = Zt(this.profile, this.seed), this.state = {
      currentNodeId: this.graph.startNodeId,
      visitedNodeIds: /* @__PURE__ */ new Set([this.graph.startNodeId]),
      traversedEdgeIds: /* @__PURE__ */ new Set(),
      blockedEdgeIds: /* @__PURE__ */ new Map(),
      deadNodeIds: /* @__PURE__ */ new Set(),
      movement: null,
      mistakes: 0,
      traceProgress: 0,
      hasStarted: !1,
      isRunning: !1,
      result: null
    }, this.startedAt = null, this.timer = null;
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
      template: te
    });
  }
  getData() {
    const t = this.getCurrentNode(), i = t.connected, s = this.graph.nodes.map((r) => {
      const a = r.id === this.state.currentNodeId, o = this.state.visitedNodeIds.has(r.id), c = r.type === "target" && o, l = r.type !== "target" && (this.profile.hintsEnabled || r.revealed || o || r.type === "start"), u = c || l ? dt(r.type) : "unknown";
      return {
        ...r,
        visualType: c ? "target" : r.type === "target" ? "normal" : r.type,
        isCurrent: a,
        isVisited: o,
        isNeighbor: i.includes(r.id),
        canMove: i.includes(r.id) && !this.state.blockedEdgeIds.has(R(t.id, r.id)) && !this.state.deadNodeIds.has(r.id),
        isDangerVisible: r.type !== "target" && (this.profile.hintsEnabled || r.revealed || o),
        displayType: u,
        title: `${r.id} - ${u}`
      };
    });
    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      nodes: s,
      edges: this.graph.edges.map((r) => {
        const a = s.find((l) => l.id === r.from), o = s.find((l) => l.id === r.to), c = this.state.blockedEdgeIds.get(R(r.from, r.to));
        return {
          ...r,
          from: a,
          to: o,
          isVisitedPath: this.state.traversedEdgeIds.has(R(r.from, r.to)),
          isAvailable: !c && (i.includes(r.from) || i.includes(r.to)),
          isBlocked: !!c,
          isFirewallPath: c === "firewall",
          isDecoyPath: c === "decoy"
        };
      }),
      movement: this.state.movement,
      currentNode: {
        id: t.id,
        label: dt(t.type),
        availableRoutes: s.filter((r) => r.canMove).length
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
    const s = await super.render(t, i);
    return this.state.hasStarted && this.state.isRunning && this.startTimer(), s;
  }
  async close(t = {}) {
    return this.stopTimer(), super.close(t);
  }
  getCurrentNode() {
    return this.graph.nodes.find((t) => t.id === this.state.currentNodeId) ?? this.graph.nodes[0];
  }
  startRun() {
    this.state.hasStarted || this.state.result || (this.state.hasStarted = !0, this.state.isRunning = !0, this.startedAt = performance.now(), this.startTimer(), this.render(!1));
  }
  handleNodeClick(t) {
    var a, o, c, l, u, h;
    if (!this.state.hasStarted || !this.state.isRunning) return;
    const i = this.getCurrentNode(), s = this.graph.nodes.find((f) => f.id === t);
    if (!s) return;
    if (!i.connected.includes(t)) {
      (a = this.element) == null || a.find(".node-intrusion-shell").addClass("invalid-pulse"), window.setTimeout(() => {
        var f;
        return (f = this.element) == null ? void 0 : f.find(".node-intrusion-shell").removeClass("invalid-pulse");
      }, 280);
      return;
    }
    const r = R(i.id, t);
    if (this.state.blockedEdgeIds.has(r) || this.state.deadNodeIds.has(t)) {
      (o = this.element) == null || o.find(".node-intrusion-shell").addClass("invalid-pulse"), window.setTimeout(() => {
        var f;
        return (f = this.element) == null ? void 0 : f.find(".node-intrusion-shell").removeClass("invalid-pulse");
      }, 280);
      return;
    }
    if (this.state.visitedNodeIds.add(t), this.state.traversedEdgeIds.add(r), this.state.movement = {
      fromX: i.x,
      fromY: i.y,
      toX: s.x,
      toY: s.y,
      path: `M ${i.x} ${i.y} L ${s.x} ${s.y}`
    }, s.visited = !0, s.revealed = !0, s.type === "firewall") {
      if (this.state.mistakes += 1, this.state.blockedEdgeIds.set(r, "firewall"), this.state.deadNodeIds.add(t), (l = (c = ui.notifications) == null ? void 0 : c.warn) == null || l.call(c, `Firewall tripped (${this.state.mistakes}/${this.profile.maxMistakes}).`), this.state.mistakes > this.profile.maxMistakes) {
        this.finish("failure", "Firewall countermeasures locked the intrusion");
        return;
      }
      this.render(!1);
      return;
    }
    if (s.type === "decoy") {
      if (this.state.mistakes += 1, this.state.blockedEdgeIds.set(r, "decoy"), this.state.deadNodeIds.add(t), (h = (u = ui.notifications) == null ? void 0 : u.warn) == null || h.call(u, `Decoy route burned (${this.state.mistakes}/${this.profile.maxMistakes}).`), this.state.mistakes > this.profile.maxMistakes) {
        this.finish("failure", "The intrusion collapsed into decoy space");
        return;
      }
      this.render(!1);
      return;
    }
    if (this.state.currentNodeId = t, s.type === "target") {
      this.finish("success", "Target node breached");
      return;
    }
    if (this.state.mistakes > this.profile.maxMistakes) {
      this.finish("failure", "Firewall countermeasures locked the intrusion");
      return;
    }
    this.render(!1);
  }
  startTimer() {
    if (this.timer || !this.state.hasStarted || !this.startedAt) return;
    const t = Number(game.settings.get(At, "traceDurationMultiplier") ?? 1) || 1, i = Math.max(5, this.profile.traceDurationSeconds * t);
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const s = (performance.now() - this.startedAt) / 1e3;
      this.state.traceProgress = ne(s / i * 100, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
    }, 120);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(t, i, { close: s = !1 } = {}) {
    var a, o;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = t, this.stopTimer(), this.resultMessage = i, this.syncDom(), await this.render(!1);
    const r = {
      type: "node-intrusion",
      result: t,
      message: i,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      traceProgress: this.state.traceProgress,
      visitedNodeIds: [...this.state.visitedNodeIds]
    };
    this.chatOnResult && await Tt({
      title: "Node Intrusion",
      result: t,
      actorName: this.actorName,
      message: i,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), t === "success" ? (a = this.onSuccess) == null || a.call(this, r) : (o = this.onFailure) == null || o.call(this, r), s && await this.close();
  }
  syncDom() {
    var a;
    const t = (a = this.element) == null ? void 0 : a[0];
    if (!t) return;
    const i = t.querySelector("[data-trace-fill]"), s = t.querySelector("[data-trace-text]"), r = t.querySelector("[data-mistake-text]");
    i && (i.style.width = `${this.state.traceProgress}%`), s && (s.textContent = `${Math.round(this.state.traceProgress)}%`), r && (r.textContent = `${this.state.mistakes}/${this.profile.maxMistakes}`);
  }
}
function xt(e, n, t) {
  return Math.min(t, Math.max(n, e));
}
function se(e) {
  const n = String(e ?? "signal-alignment");
  let t = 2166136261;
  for (let i = 0; i < n.length; i += 1)
    t ^= n.charCodeAt(i), t = Math.imul(t, 16777619);
  return t >>> 0;
}
function re(e) {
  let n = se(e);
  return () => {
    n += 1831565813;
    let t = n;
    return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function j(e) {
  return xt(Number(e) || 0, 0, 100);
}
function ae(e, n = Date.now()) {
  var a, o, c;
  const t = re(n), i = xt(Number(e.channelCount ?? ((a = e.signalAlignment) == null ? void 0 : a.channelCount)) || 3, 2, 5), s = Number(e.tolerance ?? ((o = e.signalAlignment) == null ? void 0 : o.tolerance) ?? 5), r = Number(e.decoyFrequencies ?? ((c = e.signalAlignment) == null ? void 0 : c.decoyFrequencies) ?? 0);
  return Array.from({ length: i }, (l, u) => {
    const h = Math.round(18 + t() * 64), f = t() > 0.5 ? 1 : -1, b = s + 8 + Math.round(t() * 18), g = t() > 0.5 ? 1 : -1, M = Array.from({ length: r }, () => j(h + (t() > 0.5 ? 1 : -1) * (s + 9 + t() * 18)));
    return {
      id: `channel-${u + 1}`,
      label: `CH-${String(u + 1).padStart(2, "0")}`,
      value: j(h + f * b),
      target: h,
      tolerance: s,
      driftDirection: g,
      decoys: M
    };
  });
}
const Ct = "holosuite-hacking", oe = `modules/${Ct}/templates/signal-alignment.html`;
var St, It, wt;
const ce = globalThis.Application ?? ((wt = (It = (St = globalThis.foundry) == null ? void 0 : St.appv1) == null ? void 0 : It.api) == null ? void 0 : wt.Application);
function _(e, n, t) {
  return Math.min(t, Math.max(n, e));
}
class le extends ce {
  constructor(t = {}) {
    super(t);
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
    this.rollTotal = Number(t.rollTotal ?? 15), this.dc = Number(t.dc ?? 15), this.profile = t.profile ? { ...t.profile } : z(this.rollTotal, this.dc), this.seed = t.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}:signal`, this.onSuccess = typeof t.onSuccess == "function" ? t.onSuccess : null, this.onFailure = typeof t.onFailure == "function" ? t.onFailure : null, this.actorName = String(t.actorName ?? "Hacker"), this.chatOnResult = t.chatOnResult !== !1, this.channels = ae(this.profile, this.seed), this.state = {
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
      template: oe
    });
  }
  getData() {
    const t = this.channels.map((i) => {
      const s = Math.abs(i.value - i.target), r = s <= i.tolerance;
      return {
        ...i,
        valueLabel: i.value.toFixed(1),
        deltaLabel: s.toFixed(1),
        aligned: r,
        targetLeft: i.target,
        toleranceLeft: _(i.target - i.tolerance, 0, 100),
        toleranceWidth: _(i.tolerance * 2, 1, 100)
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
    const s = await super.render(t, i);
    return this.state.hasStarted && this.state.isRunning && this.startTimer(), s;
  }
  async close(t = {}) {
    return this.stopTimer(), super.close(t);
  }
  startRun() {
    this.state.hasStarted || this.state.result || (this.state.hasStarted = !0, this.state.isRunning = !0, this.startedAt = performance.now(), this.lastTickAt = this.startedAt, this.startTimer(), this.render(!1));
  }
  handleSlider(t) {
    if (!this.state.hasStarted || !this.state.isRunning) return;
    const i = this.channels.find((s) => s.id === t.dataset.channelSlider);
    i && (i.value = j(t.value), this.checkDestabilization(), this.syncDom());
  }
  areAllChannelsAligned() {
    return this.channels.every((t) => Math.abs(t.value - t.target) <= t.tolerance);
  }
  checkDestabilization() {
    var i, s;
    const t = this.areAllChannelsAligned();
    this.wasAligned && !t && (this.state.mistakes += 1, this.state.destabilizations += 1, (s = (i = ui.notifications) == null ? void 0 : i.warn) == null || s.call(i, `Signal destabilized (${this.state.mistakes}/${this.profile.maxMistakes}).`), this.state.mistakes > this.profile.maxMistakes && this.finish("failure", "Signal destabilized too often")), this.wasAligned = t;
  }
  startTimer() {
    if (this.timer || !this.state.hasStarted || !this.startedAt || !this.lastTickAt) return;
    const t = Number(game.settings.get(Ct, "traceDurationMultiplier") ?? 1) || 1, i = Math.max(5, this.profile.traceDurationSeconds * t);
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const s = performance.now(), r = Math.min(0.5, (s - this.lastTickAt) / 1e3);
      this.lastTickAt = s, this.applyDrift(r);
      const a = this.areAllChannelsAligned();
      this.state.lockProgress = a ? _(this.state.lockProgress + r / this.profile.lockHoldSeconds, 0, 1) : 0, this.wasAligned && !a && (this.state.mistakes += 1, this.state.destabilizations += 1), this.wasAligned = a;
      const o = (s - this.startedAt) / 1e3;
      this.state.traceProgress = _(o / i * 100, 0, 100), this.syncDom(), this.state.lockProgress >= 1 ? this.finish("success", "Transmission Decrypted") : this.state.traceProgress >= 100 ? this.finish("failure", "Trace Complete") : this.state.mistakes > this.profile.maxMistakes && this.finish("failure", "Signal destabilized too often");
    }, 120);
  }
  applyDrift(t) {
    const i = Number(this.profile.signalDriftSpeed ?? 0);
    if (!(i <= 0))
      for (const s of this.channels)
        s.value = j(s.value + s.driftDirection * i * t), (s.value <= 0 || s.value >= 100) && (s.driftDirection *= -1);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(t, i, { close: s = !1 } = {}) {
    var a, o;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = t, this.stopTimer(), this.resultMessage = i, this.syncDom(), await this.render(!1);
    const r = {
      type: "signal-alignment",
      result: t,
      message: i,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      traceProgress: this.state.traceProgress,
      lockProgress: this.state.lockProgress,
      channels: this.channels.map((c) => ({ ...c }))
    };
    this.chatOnResult && await Tt({
      title: "Signal Alignment",
      result: t,
      actorName: this.actorName,
      message: i,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), t === "success" ? (a = this.onSuccess) == null || a.call(this, r) : (o = this.onFailure) == null || o.call(this, r), s && await this.close();
  }
  syncDom() {
    var c;
    const t = (c = this.element) == null ? void 0 : c[0];
    if (!t) return;
    const i = t.querySelector("[data-trace-fill]"), s = t.querySelector("[data-trace-text]"), r = t.querySelector("[data-mistake-text]"), a = t.querySelector("[data-lock-fill]"), o = t.querySelector("[data-lock-text]");
    i && (i.style.width = `${this.state.traceProgress}%`), s && (s.textContent = `${Math.round(this.state.traceProgress)}%`), r && (r.textContent = `${this.state.mistakes}/${this.profile.maxMistakes}`), a && (a.style.width = `${Math.round(this.state.lockProgress * 100)}%`), o && (o.textContent = `${Math.round(this.state.lockProgress * 100)}%`);
    for (const l of this.channels) {
      const u = t.querySelector(`[data-channel-row="${l.id}"]`);
      if (!u) continue;
      const h = Math.abs(l.value - l.target) <= l.tolerance;
      u.classList.toggle("is-aligned", h), u.querySelector("[data-channel-value]").textContent = l.value.toFixed(1), u.querySelector("[data-channel-delta]").textContent = Math.abs(l.value - l.target).toFixed(1);
      const f = u.querySelector("[data-channel-slider]");
      f && document.activeElement !== f && (f.value = l.value);
      const b = u.querySelector("[data-wave-fill]");
      b && (b.style.width = `${l.value}%`);
    }
  }
}
const I = "holosuite-hacking", st = `module.${I}`, ue = 10 * 60 * 1e3;
let w = null, G = null;
const B = /* @__PURE__ */ new Map();
function de() {
  game.settings.register(I, "defaultDc", {
    name: "Default Hacking DC",
    hint: "Used by the GM launcher and API calls that omit a DC.",
    scope: "world",
    config: !0,
    type: Number,
    default: 15
  }), game.settings.register(I, "traceDurationMultiplier", {
    name: "Default Trace Duration Multiplier",
    hint: "Multiplies trace timers for all HoloSuite hacking minigames.",
    scope: "world",
    config: !0,
    type: Number,
    default: 1
  }), game.settings.register(I, "allowPlayerInteraction", {
    name: "Allow Players To Interact Directly",
    hint: "Reserved for future player-targeted play. The GM launcher remains GM-only for now.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(I, "visualGlitchIntensity", {
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
function he() {
  at({
    id: "node-intrusion",
    title: "Node Intrusion",
    icon: "fa-solid fa-network-wired",
    create: (e) => new ie(e)
  }), at({
    id: "signal-alignment",
    title: "Signal Alignment",
    icon: "fa-solid fa-wave-square",
    create: (e) => new le(e)
  });
}
function kt() {
  var e, n, t;
  return (e = game.user) != null && e.isGM ? (G = G ?? new jt({ api: w }), G.render(!0), G) : ((t = (n = ui.notifications) == null ? void 0 : n.warn) == null || t.call(n, "Only the GM can open HoloSuite Hacking."), null);
}
function $t() {
  w = w ?? Rt({ moduleId: I, openLauncher: kt }), w.sendHackToPlayer = fe, w.registerWithHoloSuite = Y;
  const e = game.modules.get(I);
  return e && (e.api = w), game.holosuiteHacking = w, w;
}
function fe(e = {}) {
  var o, c, l, u, h, f, b;
  if (!((o = game.user) != null && o.isGM))
    return (l = (c = ui.notifications) == null ? void 0 : c.warn) == null || l.call(c, "Only the GM can send HoloSuite hacking challenges."), !1;
  if (!game.socket)
    return (h = (u = ui.notifications) == null ? void 0 : u.error) == null || h.call(u, "Foundry sockets are not available."), !1;
  const n = Dt(e), t = Z(n.userId), i = rt(n.actorId, t);
  i ? t && !F(i, t) && console.warn(`${I} | ${t.name} does not appear to own ${i.name}; sending fallback roll data anyway.`) : console.warn(`${I} | Could not resolve hacker actor.`, {
    actorId: n.actorId,
    userId: n.userId,
    availableUsers: Q().map((g) => ({ id: g.id, name: g.name, isGM: g.isGM })),
    userCharacter: H(t),
    ownedActors: et(t).map((g) => ({ id: g.id, name: g.name }))
  });
  const s = Mt(i, n.skillId), r = n.skillLabel || V(n.skillId, s), a = Number.isFinite(Number(n.skillModifier)) && Number(n.skillModifier) !== 0 ? Number(n.skillModifier) : nt(s);
  if (typeof e.onSuccess == "function" || typeof e.onFailure == "function") {
    const g = window.setTimeout(() => B.delete(n.requestId), ue);
    B.set(n.requestId, {
      onSuccess: typeof e.onSuccess == "function" ? e.onSuccess : null,
      onFailure: typeof e.onFailure == "function" ? e.onFailure : null,
      timeoutId: g
    });
  }
  return game.socket.emit(st, {
    type: "launch-request",
    payload: {
      ...n,
      actorId: (i == null ? void 0 : i.id) ?? "",
      actorName: (i == null ? void 0 : i.name) ?? (t == null ? void 0 : t.name) ?? "Hacker",
      skillLabel: r,
      skillModifier: a,
      gmUserId: game.user.id
    }
  }), (b = (f = ui.notifications) == null ? void 0 : f.info) == null || b.call(f, `${W(n.minigameType)} sent${t ? ` to ${t.name}` : " to players"}.`), !0;
}
function me(e) {
  var n, t, i, s;
  try {
    if ((e == null ? void 0 : e.type) === "result-report") {
      ye(e.payload ?? {});
      return;
    }
    if ((e == null ? void 0 : e.type) !== "launch-request") return;
    const r = Dt(e.payload ?? {});
    if (r.userId && r.userId !== ((n = game.user) == null ? void 0 : n.id) || !r.userId && ((t = game.user) != null && t.isGM)) return;
    const a = rt(r.actorId, Z(r.userId) ?? game.user), o = r.actorName || (a == null ? void 0 : a.name) || "Intruder", c = r.skillLabel || V(r.skillId, Mt(a, r.skillId));
    new Dialog({
      title: W(r.minigameType),
      content: be(r, o, c),
      buttons: {
        start: {
          icon: '<i class="fa-solid fa-terminal"></i>',
          label: "Accept and roll",
          callback: async () => ge(r)
        }
      },
      default: "start"
    }, {
      classes: ["holosuite-hacking-start-dialog"]
    }).render(!0);
  } catch (r) {
    console.error(`${I} | Failed to handle hacking launch request.`, r), (s = (i = ui.notifications) == null ? void 0 : i.error) == null || s.call(i, "HoloSuite Hacking launch failed. See console for details.");
  }
}
async function ge(e) {
  const n = rt(e.actorId, Z(e.userId) ?? game.user), t = await pe(e);
  if (!Number.isFinite(t == null ? void 0 : t.total)) return null;
  const i = {
    rollTotal: t.total,
    dc: e.dc,
    actorId: e.actorId,
    actorName: (n == null ? void 0 : n.name) ?? e.actorName ?? "Hacker",
    userId: e.userId,
    skillId: e.skillId,
    onSuccess: (s) => ht(e, s),
    onFailure: (s) => ht(e, s)
  };
  return e.minigameType === "signal-alignment" ? w.startSignalAlignment(i) : w.startNodeIntrusion(i);
}
async function pe(e) {
  var n, t;
  try {
    const i = Number(e.skillModifier ?? 0), s = `1d20 ${i >= 0 ? "+" : "-"} ${Math.abs(i)}`, r = await new Roll(s).evaluate({ async: !0 });
    return await r.toMessage({
      speaker: ChatMessage.getSpeaker(),
      flavor: `${T(W(e.minigameType))}: ${T(e.skillLabel || e.skillId || "Skill")} vs DC ${Number(e.dc)}`
    }), { total: Number(r.total), roll: r };
  } catch (i) {
    return console.error(`${I} | Fallback skill roll failed.`, i), (t = (n = ui.notifications) == null ? void 0 : n.warn) == null || t.call(n, "HoloSuite Hacking skill check failed."), null;
  }
}
function ht(e, n) {
  var t, i;
  (i = (t = game.socket) == null ? void 0 : t.emit) == null || i.call(t, st, {
    type: "result-report",
    payload: {
      requestId: e.requestId,
      gmUserId: e.gmUserId,
      result: n
    }
  });
}
function ye(e = {}) {
  var i, s, r;
  if (!((i = game.user) != null && i.isGM) || e.gmUserId !== game.user.id) return;
  const n = B.get(e.requestId);
  B.delete(e.requestId), n != null && n.timeoutId && window.clearTimeout(n.timeoutId);
  const t = e.result ?? {};
  t.result === "success" ? (s = n == null ? void 0 : n.onSuccess) == null || s.call(n, t) : (r = n == null ? void 0 : n.onFailure) == null || r.call(n, t);
}
function be(e, n, t) {
  return `
    <section class="holosuite-hacking-start-prompt">
      <p>Incoming hacking challenge</p>
      <h2>${T(W(e.minigameType))}</h2>
      <div>${T(n)} rolls ${T(t)} vs DC ${Number(e.dc)}</div>
    </section>
  `;
}
function Dt(e = {}) {
  const n = Number(game.settings.get(I, "defaultDc") ?? 15);
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
function rt(e, n) {
  const t = C(e);
  if (t) return t;
  const i = H(n);
  if (i) return i;
  const s = et(n);
  if (s.length === 1) return s[0];
  const r = Et();
  return r && F(r, n) ? r : null;
}
function W(e) {
  var n, t;
  return ((t = (n = w == null ? void 0 : w.getMinigames) == null ? void 0 : n.call(w).find((i) => i.id === e)) == null ? void 0 : t.title) ?? String(e ?? "Hacking");
}
function Y() {
  var n, t;
  const e = ((n = game.modules.get("holosuite-core")) == null ? void 0 : n.api) ?? game.holosuite;
  return typeof (e == null ? void 0 : e.registerApp) != "function" ? !1 : ((t = e.unregisterApp) == null || t.call(e, "node-intrusion"), e.registerApp({
    id: I,
    title: "HoloSuite Hacking",
    icon: "fa-solid fa-terminal",
    premium: !1,
    featureId: I,
    playerVisible: !1,
    description: "Reusable hacking minigames for terminals, traces, and signal puzzles.",
    open: () => kt()
  }), !0);
}
Hooks.once("init", () => {
  de(), he(), $t();
});
Hooks.once("ready", () => {
  var e, n;
  $t(), (n = (e = game.socket) == null ? void 0 : e.on) == null || n.call(e, st, me), Y(), window.setTimeout(() => Y(), 500), console.log(`${I} | Ready. API available at game.modules.get("${I}").api`);
});
