const A = {
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
function k(e) {
  return {
    ...e,
    ...e.nodeIntrusion,
    ...e.signalAlignment,
    allowMainPathFirewalls: e.nodeIntrusion.allowFirewallOnMainPath
  };
}
function G(e = 0, t = 10) {
  const n = Number(e) || 0, i = Number(t) || 10;
  return n <= i - 10 ? k(A.critical_failure) : n >= i + 10 ? k(A.critical_success) : n >= i + 5 ? k(A.strong_success) : n >= i ? k(A.success) : k(A.failure_but_playable);
}
const X = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
function st(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim();
  if (!t || typeof (e == null ? void 0 : e.create) != "function")
    throw new Error("HoloSuite Hacking minigames require an id and create(options) function.");
  X.set(t, {
    title: String(e.title ?? t),
    icon: String(e.icon ?? "fa-solid fa-terminal"),
    ...e,
    id: t
  });
}
function Dt(e) {
  return X.get(String(e ?? ""));
}
function Pt() {
  return [...X.values()];
}
function Ht(e, t = {}) {
  var r, a, o, c;
  const n = Dt(e);
  if (!n)
    return (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, `Unknown HoloSuite hacking minigame: ${e}`), null;
  (c = (o = D.get(n.id)) == null ? void 0 : o.close) == null || c.call(o);
  const i = n.create(t), s = i.close.bind(i);
  return i.close = async (...l) => (D.delete(n.id), s(...l)), D.set(n.id, i), i.render(!0), i;
}
function Ft(e) {
  return e ? D.get(String(e)) ?? null : [...D.values()].at(-1) ?? null;
}
function Lt({ moduleId: e, openLauncher: t }) {
  function n(a) {
    const o = String(game.settings.get(e, "visualGlitchIntensity") ?? "medium"), c = Number(a.visualGlitchIntensity ?? 0.4), l = o === "low" ? Math.min(c, 0.25) : o === "high" ? Math.min(1, c + 0.2) : c;
    return { ...a, visualGlitchIntensity: l };
  }
  function i(a = {}) {
    const o = Number(game.settings.get(e, "defaultDc") ?? 15), c = Number(a.dc ?? o), l = Number(a.rollTotal ?? c), h = n(a.profile ?? G(l, c));
    return { ...a, dc: c, rollTotal: l, profile: h };
  }
  function s(a = {}) {
    const o = String(a.type ?? "node-intrusion");
    return Ht(o, i(a));
  }
  const r = {
    startHack: s,
    startNodeIntrusion: (a = {}) => s({ ...a, type: "node-intrusion" }),
    startSignalAlignment: (a = {}) => s({ ...a, type: "signal-alignment" }),
    openLauncher: t,
    getDifficultyProfile: G,
    difficultyProfiles: A,
    getMinigames: Pt,
    getActiveApp: Ft,
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
function M(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function V() {
  return Y().filter((t) => !t.isGM);
}
function Y() {
  var e;
  return Array.isArray(game.users) ? game.users : ((e = game.users) == null ? void 0 : e.contents) ?? [...game.users ?? []];
}
function J(e) {
  var n, i;
  const t = String(e ?? "");
  return ((i = (n = game.users) == null ? void 0 : n.get) == null ? void 0 : i.call(n, t)) ?? Y().find((s) => s.id === t) ?? null;
}
function Q() {
  var e;
  return Array.isArray(game.actors) ? game.actors : ((e = game.actors) == null ? void 0 : e.contents) ?? [...game.actors ?? []];
}
function x(e) {
  var n, i;
  const t = String(e ?? "");
  return ((i = (n = game.actors) == null ? void 0 : n.get) == null ? void 0 : i.call(n, t)) ?? Q().find((s) => s.id === t || s.uuid === t) ?? null;
}
function P(e) {
  const t = e == null ? void 0 : e.character;
  return t ? typeof t == "string" ? x(t) : t : null;
}
function H(e, t) {
  var s, r, a, o;
  if (!e || !t) return !1;
  if (e === P(t) || (s = e.testUserPermission) != null && s.call(e, t, "OWNER")) return !0;
  const n = ((a = (r = globalThis.CONST) == null ? void 0 : r.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3, i = e.ownership ?? ((o = e.data) == null ? void 0 : o.permission) ?? {};
  return Number(i[t.id] ?? i.default ?? 0) >= n;
}
function Ot() {
  var e, t, n;
  return ((n = (t = (e = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : e.controlled) == null ? void 0 : t[0]) == null ? void 0 : n.actor) ?? null;
}
function Z(e) {
  const t = P(e) ? [P(e)] : [], n = Q().filter((s) => H(s, e));
  return [...new Map([...t, ...n].filter(Boolean).map((s) => [s.id, s])).values()].sort((s, r) => s.name.localeCompare(r.name));
}
function rt(e = "") {
  const t = V(), n = t.find((s) => s.id === e);
  return (n ? Z(n) : Q()).filter((s) => !n || H(s, n)).map((s) => ({
    id: s.id,
    name: s.name,
    owners: t.filter((r) => H(s, r))
  })).sort((s, r) => s.name.localeCompare(r.name));
}
const qt = {
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
function at(e) {
  var n;
  const t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.skills;
  if (t && typeof t == "object") {
    const i = Object.entries(t).map(([s, r]) => ({
      id: s,
      name: j(s, r),
      label: Et(s, r),
      modifier: tt(r)
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
function It(e, t) {
  var n, i;
  return ((i = (n = e == null ? void 0 : e.system) == null ? void 0 : n.skills) == null ? void 0 : i[t]) ?? null;
}
function j(e, t) {
  const n = String((t == null ? void 0 : t.label) ?? (t == null ? void 0 : t.name) ?? (t == null ? void 0 : t.localizedName) ?? e ?? "Skill").trim(), i = n.toLowerCase().replace(/[^a-z0-9]/g, "");
  return String(qt[i] ?? n).replace(/[_-]/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
}
function tt(e) {
  var s, r, a, o, c, l, h, d, g, b;
  if (typeof e == "number") return e;
  if (!e || typeof e != "object") return 0;
  const n = [
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
    (h = e == null ? void 0 : e.check) == null ? void 0 : h.total,
    e == null ? void 0 : e.roll,
    (d = e == null ? void 0 : e.roll) == null ? void 0 : d.mod,
    (g = e == null ? void 0 : e.roll) == null ? void 0 : g.total,
    e == null ? void 0 : e.rank,
    e == null ? void 0 : e.ranks
  ].find((f) => Number.isFinite(Number(f)));
  if (n !== void 0) return Number(n);
  const i = [];
  return wt(e, i, 0), i.sort((f, w) => w.score - f.score), Number(((b = i[0]) == null ? void 0 : b.value) ?? 0);
}
function Et(e, t) {
  const n = j(e, t), i = tt(t), s = i >= 0 ? "+" : "-";
  return `${n} (${s}${Math.abs(i)})`;
}
function wt(e, t, n, i = "") {
  if (!(!e || typeof e != "object" || n > 4))
    for (const [s, r] of Object.entries(e)) {
      const a = i ? `${i}.${s}` : s, o = Number(r);
      if (Number.isFinite(o)) {
        const c = a.toLowerCase();
        let l = 1;
        /(total|mod|modifier|bonus|check|roll|value)$/.test(c) && (l += 6), /(dc|rank|ranks|proficient|prof|trained|ability|base|label|name)/.test(c) && (l -= 4), Math.abs(o) > 30 && (l -= 5), t.push({ value: o, score: l, path: a });
      } else r && typeof r == "object" && wt(r, t, n + 1, a);
    }
}
const _ = "holosuite-hacking", Rt = `modules/${_}/templates/hacking-launcher.html`;
var dt, ht, ft;
const _t = globalThis.Application ?? ((ft = (ht = (dt = globalThis.foundry) == null ? void 0 : dt.appv1) == null ? void 0 : ht.api) == null ? void 0 : ft.Application);
class Gt extends _t {
  constructor(t = {}) {
    super(t), this.api = t.api;
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
      template: Rt
    });
  }
  getData() {
    const t = Number(game.settings.get(_, "defaultDc") ?? 15), n = V(), i = n[0] ?? null, s = rt(i == null ? void 0 : i.id), r = s.length ? x(s[0].id) : null;
    return {
      defaultDc: t,
      defaultTestRoll: t,
      minigames: this.api.getMinigames(),
      actors: s.map((a) => ({
        id: a.id,
        name: a.name,
        ownerNames: a.owners.map((o) => o.name).join(", ") || "No active owner"
      })),
      users: n.map((a) => ({
        id: a.id,
        name: a.name
      })),
      skills: at(r)
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
    var u, m, p, y, N, T;
    if (!((u = game.user) != null && u.isGM)) {
      (p = (m = ui.notifications) == null ? void 0 : m.warn) == null || p.call(m, "Only the GM can open the HoloSuite Hacking launcher.");
      return;
    }
    if (!t) {
      (N = (y = ui.notifications) == null ? void 0 : y.error) == null || N.call(y, "HoloSuite Hacking launcher form was not found."), console.error(`${_} | Launcher form was not found.`);
      return;
    }
    const n = t.querySelector("[name='minigameType']"), i = t.querySelector("[name='actorId']"), s = t.querySelector("[name='userId']"), r = t.querySelector("[name='skillId']"), a = t.querySelector("[name='dc']"), o = ((T = r == null ? void 0 : r.selectedOptions) == null ? void 0 : T[0]) ?? null, c = String((n == null ? void 0 : n.value) || "node-intrusion"), l = String((i == null ? void 0 : i.value) || ""), h = String((s == null ? void 0 : s.value) || ""), d = String((r == null ? void 0 : r.value) || ""), g = String((o == null ? void 0 : o.dataset.skillLabel) || (o == null ? void 0 : o.textContent) || d || "Skill"), b = Number((o == null ? void 0 : o.dataset.skillModifier) ?? 0), f = Number((a == null ? void 0 : a.value) ?? 15);
    this.api.sendHackToPlayer({
      minigameType: c,
      actorId: l,
      userId: h,
      skillId: d,
      skillLabel: g,
      skillModifier: b,
      dc: f,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }) && this.close();
  }
  testSelf(t) {
    var o, c, l, h, d, g, b, f, w, u, m, p, y;
    if (!((o = game.user) != null && o.isGM)) {
      (l = (c = ui.notifications) == null ? void 0 : c.warn) == null || l.call(c, "Only the GM can test HoloSuite Hacking minigames.");
      return;
    }
    if (!t) {
      (d = (h = ui.notifications) == null ? void 0 : h.error) == null || d.call(h, "HoloSuite Hacking launcher form was not found.");
      return;
    }
    const n = String(((g = t.querySelector("[name='minigameType']")) == null ? void 0 : g.value) || "node-intrusion"), i = String(((b = t.querySelector("[name='actorId']")) == null ? void 0 : b.value) || ""), s = Number(((f = t.querySelector("[name='dc']")) == null ? void 0 : f.value) ?? game.settings.get(_, "defaultDc") ?? 15), r = Number(((w = t.querySelector("[name='testRollTotal']")) == null ? void 0 : w.value) ?? s);
    if (!Number.isFinite(r)) {
      (m = (u = ui.notifications) == null ? void 0 : u.warn) == null || m.call(u, "Enter a fake roll result before testing the minigame.");
      return;
    }
    const a = x(i);
    this.api.startHack({
      type: n,
      dc: s,
      rollTotal: r,
      actorName: (a == null ? void 0 : a.name) ?? ((p = game.user) == null ? void 0 : p.name) ?? "GM",
      userId: ((y = game.user) == null ? void 0 : y.id) ?? "",
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }), this.close();
  }
  syncUserToActor(t, n) {
    const i = x(n), s = V().find((r) => i == null ? void 0 : i.testUserPermission(r, "OWNER"));
    s && t.find("[name='userId']").val(s.id);
  }
  syncSkillOptions(t, n) {
    const i = x(n), s = at(i);
    t.find("[name='skillId']").html(s.map((r) => `<option value="${M(r.id)}" data-skill-label="${M(r.name ?? r.label)}" data-skill-modifier="${Number(r.modifier ?? 0)}">${M(r.label)}</option>`).join(""));
  }
  syncActorsForUser(t, n) {
    const i = rt(n), s = i.length ? i.map((r) => `<option value="${M(r.id)}">${M(r.name)} (${M(r.owners.map((a) => a.name).join(", ") || "No owner")})</option>`).join("") : '<option value="">Use assigned character</option>';
    t.find("[name='actorId']").html(s), this.syncSkillOptions(t, t.find("[name='actorId']").val());
  }
}
async function Mt({ title: e, result: t, actorName: n, message: i, rollTotal: s, dc: r }) {
  const a = t === "success", o = a ? "#38f28f" : "#ff477e", c = a ? "HACK SUCCESS" : "HACK FAILED", l = i || (a ? "Objective completed." : "Trace or countermeasure completed."), h = Number.isFinite(Number(s)) && Number.isFinite(Number(r)) ? `<p style="margin: 4px 0 0; color: #bdeff6;">Roll ${Number(s)} vs DC ${Number(r)}</p>` : "", d = `
    <div class="holosuite-hacking-chat-result" style="border-left: 4px solid ${o}; padding: 8px 10px; background: rgba(5, 8, 14, 0.88); color: ${o};">
      <strong>${F(c)} // ${F(e)} // ${F(n || "Hacker")}</strong>
      <p style="margin: 6px 0 0; color: ${o};">${F(l)}</p>
      ${h}
    </div>
  `;
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content: d
  });
}
function F(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function v(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function Ut(e) {
  const t = String(e ?? "node-intrusion");
  let n = 2166136261;
  for (let i = 0; i < t.length; i += 1)
    n ^= t.charCodeAt(i), n = Math.imul(n, 16777619);
  return n >>> 0;
}
function zt(e) {
  let t = Ut(e);
  return () => {
    t += 1831565813;
    let n = t;
    return n = Math.imul(n ^ n >>> 15, n | 1), n ^= n + Math.imul(n ^ n >>> 7, n | 61), ((n ^ n >>> 14) >>> 0) / 4294967296;
  };
}
function L(e, t) {
  return e.length ? e[Math.floor(t() * e.length)] : null;
}
function $(e, t, n) {
  const i = e.find((r) => r.id === t), s = e.find((r) => r.id === n);
  !i || !s || (i.connected.includes(n) || i.connected.push(n), s.connected.includes(t) || s.connected.push(t));
}
function O(e, t) {
  return [e, t].sort().join("--");
}
function W(e, t, n, i) {
  return {
    id: e,
    x: v(Math.round(n), 6, 94),
    y: v(Math.round(i), 10, 90),
    type: t,
    connected: [],
    revealed: t === "start",
    visited: !1
  };
}
function et(e) {
  return e.flatMap((t) => t.connected.filter((n) => t.id < n).map((n) => ({ from: t.id, to: n })));
}
function C(e, t) {
  return e.find((n) => n.id === t);
}
function q(e, t, n) {
  return Math.sign((t.y - e.y) * (n.x - t.x) - (t.x - e.x) * (n.y - t.y));
}
function jt(e, t, n, i) {
  const s = q(e, t, n), r = q(e, t, i), a = q(n, i, e), o = q(n, i, t);
  return s !== r && a !== o;
}
function Bt(e, t, n) {
  if (t.from === n.from || t.from === n.to || t.to === n.from || t.to === n.to) return !1;
  const i = C(e, t.from), s = C(e, t.to), r = C(e, n.from), a = C(e, n.to);
  return !i || !s || !r || !a ? !1 : jt(i, s, r, a);
}
function Vt(e, t, n) {
  const i = n.x - t.x, s = n.y - t.y, r = i * i + s * s;
  if (!r) {
    const h = e.x - t.x, d = e.y - t.y;
    return Math.sqrt(h * h + d * d);
  }
  const a = v(((e.x - t.x) * i + (e.y - t.y) * s) / r, 0, 1), o = {
    x: t.x + a * i,
    y: t.y + a * s
  }, c = e.x - o.x, l = e.y - o.y;
  return Math.sqrt(c * c + l * l);
}
function Wt(e, t = et(e)) {
  let n = 0;
  for (let i = 0; i < t.length; i += 1)
    for (let s = i + 1; s < t.length; s += 1)
      Bt(e, t[i], t[s]) && (n += 1);
  return n;
}
function vt(e) {
  const t = et(e);
  let n = Wt(e, t) * 900;
  for (let i = 0; i < e.length; i += 1)
    for (let s = i + 1; s < e.length; s += 1) {
      const r = e[i], a = e[s], o = a.x - r.x, c = a.y - r.y, l = Math.sqrt(o * o + c * c) || 1;
      l < 13 && (n += (13 - l) * 30), l < 18 && (n += (18 - l) * 6);
    }
  for (const i of e)
    for (const s of t) {
      if (s.from === i.id || s.to === i.id) continue;
      const r = C(e, s.from), a = C(e, s.to);
      if (!r || !a) continue;
      const o = Vt(i, r, a);
      o < 8 && (n += (8 - o) * 18);
    }
  return n;
}
function Kt(e, t, n) {
  const i = e.map((s) => ({ ...s, connected: [...s.connected] }));
  i.push({ ...t, connected: [] });
  for (const s of n) $(i, t.id, s);
  return vt(i);
}
function ot(e, t, n, i, s, r, a = {}) {
  const {
    radiusMin: o = 17,
    radiusMax: c = 34,
    biasX: l = 5,
    ySpread: h = 1
  } = a;
  let d = null, g = 1 / 0;
  for (let b = 0; b < 16; b += 1) {
    const f = s() * Math.PI * 2 - Math.PI * 0.2, w = o + s() * (c - o), u = i.x + Math.cos(f) * w + l, m = i.y + Math.sin(f) * w * h, p = W(t, n, u, m), y = Kt(e, p, r);
    y < g && (d = p, g = y);
  }
  return d ?? W(t, n, i.x + l, i.y);
}
function Xt(e) {
  for (let t = 0; t < 24; t += 1)
    for (let n = 0; n < e.length; n += 1)
      for (let i = n + 1; i < e.length; i += 1) {
        const s = e[n], r = e[i], a = r.x - s.x, o = r.y - s.y, c = Math.sqrt(a * a + o * o) || 1;
        if (c >= 13) continue;
        const l = (13 - c) * 0.35, h = a / c * l, d = o / c * l;
        s.type !== "start" && s.type !== "target" && (s.x = v(s.x - h, 6, 94), s.y = v(s.y - d, 10, 90)), r.type !== "start" && r.type !== "target" && (r.x = v(r.x + h, 6, 94), r.y = v(r.y + d, 10, 90));
      }
}
function ct(e, t = Date.now()) {
  var b, f, w;
  const n = zt(t), i = Math.max(6, Number(e.nodeCount ?? ((b = e.nodeIntrusion) == null ? void 0 : b.nodeCount)) || 10), s = v(Number(e.decoyCount ?? ((f = e.nodeIntrusion) == null ? void 0 : f.decoyCount)) || 0, 0, i - 4), r = Math.max(0, i - s), a = v(Math.round(r * 0.55), 5, r), o = [], c = [];
  for (let u = 0; u < a; u += 1) {
    const m = u === 0 ? "start" : u === a - 1 ? "target" : `node-${u}`, p = u === 0 ? "start" : u === a - 1 ? "target" : "normal", y = u / Math.max(1, a - 1), N = Math.sin(y * Math.PI * 1.35) * 10, T = u === 0 || u === a - 1 ? 0 : (n() - 0.5) * 5, $t = u === 0 || u === a - 1 ? 0 : (n() - 0.5) * 12;
    o.push(W(m, p, 9 + y * 82 + T, 52 + N + $t)), c.push(m), u > 0 && $(o, c[u - 1], m);
  }
  let l = a;
  for (; o.length < i - s; ) {
    const u = L(o.filter((T) => T.type !== "target"), n) ?? o[0], m = `node-${l}`;
    l += 1;
    const p = n() > 0.45 ? L(o.filter((T) => T.id !== u.id && T.type !== "start"), n) : null, y = p ? [u.id, p.id] : [u.id], N = ot(o, m, "normal", u, n, y, {
      radiusMin: 16,
      radiusMax: 31,
      biasX: n() > 0.35 ? 5 : -4,
      ySpread: 1.15
    });
    o.push(N), $(o, u.id, m), p && $(o, m, p.id);
  }
  for (let u = 0; u < s; u += 1) {
    const m = L(o.filter((N) => N.type !== "target" && N.type !== "decoy"), n) ?? o[0], p = `decoy-${u + 1}`, y = ot(o, p, "decoy", m, n, [m.id], {
      radiusMin: 18,
      radiusMax: 34,
      biasX: n() > 0.5 ? -6 : 6,
      ySpread: 1.25
    });
    o.push(y), $(o, m.id, p);
  }
  const h = e.allowFirewallOnMainPath ?? e.allowMainPathFirewalls ?? !1, d = o.filter((u) => u.type === "start" || u.type === "target" || u.type === "decoy" ? !1 : h || !c.includes(u.id)), g = v(Number(e.firewallCount ?? ((w = e.nodeIntrusion) == null ? void 0 : w.firewallCount)) || 0, 0, d.length);
  for (let u = 0; u < g; u += 1) {
    const m = d.filter((y) => y.type !== "firewall"), p = L(m, n);
    if (!p) break;
    p.type = "firewall";
  }
  return Xt(o), {
    nodes: o,
    edges: et(o),
    startNodeId: "start",
    targetNodeId: "target",
    mainPathIds: c,
    layoutScore: vt(o)
  };
}
function Yt(e, t = Date.now()) {
  var s;
  const n = v(Math.ceil(Number(e.nodeCount ?? ((s = e.nodeIntrusion) == null ? void 0 : s.nodeCount)) || 10), 7, 14);
  let i = null;
  for (let r = 0; r < n; r += 1) {
    const a = ct(e, `${t}:${r}`);
    if ((!i || a.layoutScore < i.layoutScore) && (i = a), a.layoutScore < 1) break;
  }
  return i ?? ct(e, t);
}
const Nt = "holosuite-hacking", Jt = `modules/${Nt}/templates/node-intrusion.html`;
var mt, gt, pt;
const Qt = globalThis.Application ?? ((pt = (gt = (mt = globalThis.foundry) == null ? void 0 : mt.appv1) == null ? void 0 : gt.api) == null ? void 0 : pt.Application);
function Zt(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function lt(e) {
  return e === "start" ? "entry" : e === "target" ? "target" : e === "firewall" ? "firewall" : e === "decoy" ? "decoy" : "relay";
}
class te extends Qt {
  constructor(t = {}) {
    super(t), this.rollTotal = Number(t.rollTotal ?? 15), this.dc = Number(t.dc ?? 15), this.profile = t.profile ? { ...t.profile } : G(this.rollTotal, this.dc), this.seed = t.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}`, this.onSuccess = typeof t.onSuccess == "function" ? t.onSuccess : null, this.onFailure = typeof t.onFailure == "function" ? t.onFailure : null, this.actorName = String(t.actorName ?? "Hacker"), this.chatOnResult = t.chatOnResult !== !1, this.graph = Yt(this.profile, this.seed), this.state = {
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
      template: Jt
    });
  }
  getData() {
    const t = this.getCurrentNode(), n = t.connected, i = this.graph.nodes.map((s) => {
      const r = s.id === this.state.currentNodeId, a = this.state.visitedNodeIds.has(s.id), o = s.type === "target" && a, c = s.type !== "target" && (this.profile.hintsEnabled || s.revealed || a || s.type === "start"), l = o || c ? lt(s.type) : "unknown";
      return {
        ...s,
        visualType: o ? "target" : s.type === "target" ? "normal" : s.type,
        isCurrent: r,
        isVisited: a,
        isNeighbor: n.includes(s.id),
        canMove: n.includes(s.id) && !this.state.blockedEdgeIds.has(O(t.id, s.id)) && !this.state.deadNodeIds.has(s.id),
        isDangerVisible: s.type !== "target" && (this.profile.hintsEnabled || s.revealed || a),
        displayType: l,
        title: `${s.id} - ${l}`
      };
    });
    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      nodes: i,
      edges: this.graph.edges.map((s) => {
        const r = i.find((c) => c.id === s.from), a = i.find((c) => c.id === s.to), o = this.state.blockedEdgeIds.get(O(s.from, s.to));
        return {
          ...s,
          from: r,
          to: a,
          isVisitedPath: this.state.traversedEdgeIds.has(O(s.from, s.to)),
          isAvailable: !o && (n.includes(s.from) || n.includes(s.to)),
          isBlocked: !!o,
          isFirewallPath: o === "firewall",
          isDecoyPath: o === "decoy"
        };
      }),
      movement: this.state.movement,
      currentNode: {
        id: t.id,
        label: lt(t.type),
        availableRoutes: i.filter((s) => s.canMove).length
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
    super.activateListeners(t), t.find("[data-node-id]").on("click", (n) => this.handleNodeClick(n.currentTarget.dataset.nodeId)), t.find("[data-action='start']").on("click", () => this.startRun()), t.find("[data-action='abort']").on("click", () => this.abort()), this.syncDom();
  }
  async render(t, n) {
    const i = await super.render(t, n);
    return this.state.hasStarted && this.state.isRunning && this.startTimer(), i;
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
    var r, a, o, c, l, h;
    if (!this.state.hasStarted || !this.state.isRunning) return;
    const n = this.getCurrentNode(), i = this.graph.nodes.find((d) => d.id === t);
    if (!i) return;
    if (!n.connected.includes(t)) {
      (r = this.element) == null || r.find(".node-intrusion-shell").addClass("invalid-pulse"), window.setTimeout(() => {
        var d;
        return (d = this.element) == null ? void 0 : d.find(".node-intrusion-shell").removeClass("invalid-pulse");
      }, 280);
      return;
    }
    const s = O(n.id, t);
    if (this.state.blockedEdgeIds.has(s) || this.state.deadNodeIds.has(t)) {
      (a = this.element) == null || a.find(".node-intrusion-shell").addClass("invalid-pulse"), window.setTimeout(() => {
        var d;
        return (d = this.element) == null ? void 0 : d.find(".node-intrusion-shell").removeClass("invalid-pulse");
      }, 280);
      return;
    }
    if (this.state.visitedNodeIds.add(t), this.state.traversedEdgeIds.add(s), this.state.movement = {
      fromX: n.x,
      fromY: n.y,
      toX: i.x,
      toY: i.y,
      path: `M ${n.x} ${n.y} L ${i.x} ${i.y}`
    }, i.visited = !0, i.revealed = !0, i.type === "firewall") {
      if (this.state.mistakes += 1, this.state.blockedEdgeIds.set(s, "firewall"), this.state.deadNodeIds.add(t), (c = (o = ui.notifications) == null ? void 0 : o.warn) == null || c.call(o, `Firewall tripped (${this.state.mistakes}/${this.profile.maxMistakes}).`), this.state.mistakes > this.profile.maxMistakes) {
        this.finish("failure", "Firewall countermeasures locked the intrusion");
        return;
      }
      this.render(!1);
      return;
    }
    if (i.type === "decoy") {
      if (this.state.mistakes += 1, this.state.blockedEdgeIds.set(s, "decoy"), this.state.deadNodeIds.add(t), (h = (l = ui.notifications) == null ? void 0 : l.warn) == null || h.call(l, `Decoy route burned (${this.state.mistakes}/${this.profile.maxMistakes}).`), this.state.mistakes > this.profile.maxMistakes) {
        this.finish("failure", "The intrusion collapsed into decoy space");
        return;
      }
      this.render(!1);
      return;
    }
    if (this.state.currentNodeId = t, i.type === "target") {
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
    const t = Number(game.settings.get(Nt, "traceDurationMultiplier") ?? 1) || 1, n = Math.max(5, this.profile.traceDurationSeconds * t);
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const i = (performance.now() - this.startedAt) / 1e3;
      this.state.traceProgress = Zt(i / n * 100, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
    }, 120);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(t, n, { close: i = !1 } = {}) {
    var r, a;
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
      traceProgress: this.state.traceProgress,
      visitedNodeIds: [...this.state.visitedNodeIds]
    };
    this.chatOnResult && await Mt({
      title: "Node Intrusion",
      result: t,
      actorName: this.actorName,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), t === "success" ? (r = this.onSuccess) == null || r.call(this, s) : (a = this.onFailure) == null || a.call(this, s), i && await this.close();
  }
  syncDom() {
    var r;
    const t = (r = this.element) == null ? void 0 : r[0];
    if (!t) return;
    const n = t.querySelector("[data-trace-fill]"), i = t.querySelector("[data-trace-text]"), s = t.querySelector("[data-mistake-text]");
    n && (n.style.width = `${this.state.traceProgress}%`), i && (i.textContent = `${Math.round(this.state.traceProgress)}%`), s && (s.textContent = `${this.state.mistakes}/${this.profile.maxMistakes}`);
  }
}
function Tt(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function ee(e) {
  const t = String(e ?? "signal-alignment");
  let n = 2166136261;
  for (let i = 0; i < t.length; i += 1)
    n ^= t.charCodeAt(i), n = Math.imul(n, 16777619);
  return n >>> 0;
}
function ne(e) {
  let t = ee(e);
  return () => {
    t += 1831565813;
    let n = t;
    return n = Math.imul(n ^ n >>> 15, n | 1), n ^= n + Math.imul(n ^ n >>> 7, n | 61), ((n ^ n >>> 14) >>> 0) / 4294967296;
  };
}
function U(e) {
  return Tt(Number(e) || 0, 0, 100);
}
function ie(e, t = Date.now()) {
  var a, o, c;
  const n = ne(t), i = Tt(Number(e.channelCount ?? ((a = e.signalAlignment) == null ? void 0 : a.channelCount)) || 3, 2, 5), s = Number(e.tolerance ?? ((o = e.signalAlignment) == null ? void 0 : o.tolerance) ?? 5), r = Number(e.decoyFrequencies ?? ((c = e.signalAlignment) == null ? void 0 : c.decoyFrequencies) ?? 0);
  return Array.from({ length: i }, (l, h) => {
    const d = Math.round(18 + n() * 64), g = n() > 0.5 ? 1 : -1, b = s + 8 + Math.round(n() * 18), f = n() > 0.5 ? 1 : -1, w = Array.from({ length: r }, () => U(d + (n() > 0.5 ? 1 : -1) * (s + 9 + n() * 18)));
    return {
      id: `channel-${h + 1}`,
      label: `CH-${String(h + 1).padStart(2, "0")}`,
      value: U(d + g * b),
      target: d,
      tolerance: s,
      driftDirection: f,
      decoys: w
    };
  });
}
const At = "holosuite-hacking", se = `modules/${At}/templates/signal-alignment.html`;
var yt, bt, St;
const re = globalThis.Application ?? ((St = (bt = (yt = globalThis.foundry) == null ? void 0 : yt.appv1) == null ? void 0 : bt.api) == null ? void 0 : St.Application);
function E(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
class ae extends re {
  constructor(t = {}) {
    super(t), this.rollTotal = Number(t.rollTotal ?? 15), this.dc = Number(t.dc ?? 15), this.profile = t.profile ? { ...t.profile } : G(this.rollTotal, this.dc), this.seed = t.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}:signal`, this.onSuccess = typeof t.onSuccess == "function" ? t.onSuccess : null, this.onFailure = typeof t.onFailure == "function" ? t.onFailure : null, this.actorName = String(t.actorName ?? "Hacker"), this.chatOnResult = t.chatOnResult !== !1, this.channels = ie(this.profile, this.seed), this.state = {
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
      template: se
    });
  }
  getData() {
    const t = this.channels.map((n) => {
      const i = Math.abs(n.value - n.target), s = i <= n.tolerance;
      return {
        ...n,
        valueLabel: n.value.toFixed(1),
        deltaLabel: i.toFixed(1),
        aligned: s,
        targetLeft: n.target,
        toleranceLeft: E(n.target - n.tolerance, 0, 100),
        toleranceWidth: E(n.tolerance * 2, 1, 100)
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
    super.activateListeners(t), t.find("[data-channel-slider]").on("input", (n) => this.handleSlider(n.currentTarget)), t.find("[data-action='start']").on("click", () => this.startRun()), t.find("[data-action='abort']").on("click", () => this.abort()), this.syncDom();
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
    n && (n.value = U(t.value), this.checkDestabilization(), this.syncDom());
  }
  areAllChannelsAligned() {
    return this.channels.every((t) => Math.abs(t.value - t.target) <= t.tolerance);
  }
  checkDestabilization() {
    var n, i;
    const t = this.areAllChannelsAligned();
    this.wasAligned && !t && (this.state.mistakes += 1, this.state.destabilizations += 1, (i = (n = ui.notifications) == null ? void 0 : n.warn) == null || i.call(n, `Signal destabilized (${this.state.mistakes}/${this.profile.maxMistakes}).`), this.state.mistakes > this.profile.maxMistakes && this.finish("failure", "Signal destabilized too often")), this.wasAligned = t;
  }
  startTimer() {
    if (this.timer || !this.state.hasStarted || !this.startedAt || !this.lastTickAt) return;
    const t = Number(game.settings.get(At, "traceDurationMultiplier") ?? 1) || 1, n = Math.max(5, this.profile.traceDurationSeconds * t);
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const i = performance.now(), s = Math.min(0.5, (i - this.lastTickAt) / 1e3);
      this.lastTickAt = i, this.applyDrift(s);
      const r = this.areAllChannelsAligned();
      this.state.lockProgress = r ? E(this.state.lockProgress + s / this.profile.lockHoldSeconds, 0, 1) : 0, this.wasAligned && !r && (this.state.mistakes += 1, this.state.destabilizations += 1), this.wasAligned = r;
      const a = (i - this.startedAt) / 1e3;
      this.state.traceProgress = E(a / n * 100, 0, 100), this.syncDom(), this.state.lockProgress >= 1 ? this.finish("success", "Transmission Decrypted") : this.state.traceProgress >= 100 ? this.finish("failure", "Trace Complete") : this.state.mistakes > this.profile.maxMistakes && this.finish("failure", "Signal destabilized too often");
    }, 120);
  }
  applyDrift(t) {
    const n = Number(this.profile.signalDriftSpeed ?? 0);
    if (!(n <= 0))
      for (const i of this.channels)
        i.value = U(i.value + i.driftDirection * n * t), (i.value <= 0 || i.value >= 100) && (i.driftDirection *= -1);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(t, n, { close: i = !1 } = {}) {
    var r, a;
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
      traceProgress: this.state.traceProgress,
      lockProgress: this.state.lockProgress,
      channels: this.channels.map((o) => ({ ...o }))
    };
    this.chatOnResult && await Mt({
      title: "Signal Alignment",
      result: t,
      actorName: this.actorName,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), t === "success" ? (r = this.onSuccess) == null || r.call(this, s) : (a = this.onFailure) == null || a.call(this, s), i && await this.close();
  }
  syncDom() {
    var o;
    const t = (o = this.element) == null ? void 0 : o[0];
    if (!t) return;
    const n = t.querySelector("[data-trace-fill]"), i = t.querySelector("[data-trace-text]"), s = t.querySelector("[data-mistake-text]"), r = t.querySelector("[data-lock-fill]"), a = t.querySelector("[data-lock-text]");
    n && (n.style.width = `${this.state.traceProgress}%`), i && (i.textContent = `${Math.round(this.state.traceProgress)}%`), s && (s.textContent = `${this.state.mistakes}/${this.profile.maxMistakes}`), r && (r.style.width = `${Math.round(this.state.lockProgress * 100)}%`), a && (a.textContent = `${Math.round(this.state.lockProgress * 100)}%`);
    for (const c of this.channels) {
      const l = t.querySelector(`[data-channel-row="${c.id}"]`);
      if (!l) continue;
      const h = Math.abs(c.value - c.target) <= c.tolerance;
      l.classList.toggle("is-aligned", h), l.querySelector("[data-channel-value]").textContent = c.value.toFixed(1), l.querySelector("[data-channel-delta]").textContent = Math.abs(c.value - c.target).toFixed(1);
      const d = l.querySelector("[data-channel-slider]");
      d && document.activeElement !== d && (d.value = c.value);
      const g = l.querySelector("[data-wave-fill]");
      g && (g.style.width = `${c.value}%`);
    }
  }
}
const S = "holosuite-hacking", nt = `module.${S}`, oe = 10 * 60 * 1e3;
let I = null, R = null;
const z = /* @__PURE__ */ new Map();
function ce() {
  game.settings.register(S, "defaultDc", {
    name: "Default Hacking DC",
    hint: "Used by the GM launcher and API calls that omit a DC.",
    scope: "world",
    config: !0,
    type: Number,
    default: 15
  }), game.settings.register(S, "traceDurationMultiplier", {
    name: "Default Trace Duration Multiplier",
    hint: "Multiplies trace timers for all HoloSuite hacking minigames.",
    scope: "world",
    config: !0,
    type: Number,
    default: 1
  }), game.settings.register(S, "allowPlayerInteraction", {
    name: "Allow Players To Interact Directly",
    hint: "Reserved for future player-targeted play. The GM launcher remains GM-only for now.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(S, "visualGlitchIntensity", {
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
function le() {
  st({
    id: "node-intrusion",
    title: "Node Intrusion",
    icon: "fa-solid fa-network-wired",
    create: (e) => new te(e)
  }), st({
    id: "signal-alignment",
    title: "Signal Alignment",
    icon: "fa-solid fa-wave-square",
    create: (e) => new ae(e)
  });
}
function xt() {
  var e, t, n;
  return (e = game.user) != null && e.isGM ? (R = R ?? new Gt({ api: I }), R.render(!0), R) : ((n = (t = ui.notifications) == null ? void 0 : t.warn) == null || n.call(t, "Only the GM can open HoloSuite Hacking."), null);
}
function Ct() {
  I = I ?? Lt({ moduleId: S, openLauncher: xt }), I.sendHackToPlayer = ue, I.registerWithHoloSuite = K;
  const e = game.modules.get(S);
  return e && (e.api = I), game.holosuiteHacking = I, I;
}
function ue(e = {}) {
  var o, c, l, h, d, g, b;
  if (!((o = game.user) != null && o.isGM))
    return (l = (c = ui.notifications) == null ? void 0 : c.warn) == null || l.call(c, "Only the GM can send HoloSuite hacking challenges."), !1;
  if (!game.socket)
    return (d = (h = ui.notifications) == null ? void 0 : h.error) == null || d.call(h, "Foundry sockets are not available."), !1;
  const t = kt(e), n = J(t.userId), i = it(t.actorId, n);
  i ? n && !H(i, n) && console.warn(`${S} | ${n.name} does not appear to own ${i.name}; sending fallback roll data anyway.`) : console.warn(`${S} | Could not resolve hacker actor.`, {
    actorId: t.actorId,
    userId: t.userId,
    availableUsers: Y().map((f) => ({ id: f.id, name: f.name, isGM: f.isGM })),
    userCharacter: P(n),
    ownedActors: Z(n).map((f) => ({ id: f.id, name: f.name }))
  });
  const s = It(i, t.skillId), r = t.skillLabel || j(t.skillId, s), a = Number.isFinite(Number(t.skillModifier)) && Number(t.skillModifier) !== 0 ? Number(t.skillModifier) : tt(s);
  if (typeof e.onSuccess == "function" || typeof e.onFailure == "function") {
    const f = window.setTimeout(() => z.delete(t.requestId), oe);
    z.set(t.requestId, {
      onSuccess: typeof e.onSuccess == "function" ? e.onSuccess : null,
      onFailure: typeof e.onFailure == "function" ? e.onFailure : null,
      timeoutId: f
    });
  }
  return game.socket.emit(nt, {
    type: "launch-request",
    payload: {
      ...t,
      actorId: (i == null ? void 0 : i.id) ?? "",
      actorName: (i == null ? void 0 : i.name) ?? (n == null ? void 0 : n.name) ?? "Hacker",
      skillLabel: r,
      skillModifier: a,
      gmUserId: game.user.id
    }
  }), (b = (g = ui.notifications) == null ? void 0 : g.info) == null || b.call(g, `${B(t.minigameType)} sent${n ? ` to ${n.name}` : " to players"}.`), !0;
}
function de(e) {
  var t, n, i, s;
  try {
    if ((e == null ? void 0 : e.type) === "result-report") {
      me(e.payload ?? {});
      return;
    }
    if ((e == null ? void 0 : e.type) !== "launch-request") return;
    const r = kt(e.payload ?? {});
    if (r.userId && r.userId !== ((t = game.user) == null ? void 0 : t.id) || !r.userId && ((n = game.user) != null && n.isGM)) return;
    const a = it(r.actorId, J(r.userId) ?? game.user), o = r.actorName || (a == null ? void 0 : a.name) || "Intruder", c = r.skillLabel || j(r.skillId, It(a, r.skillId));
    new Dialog({
      title: B(r.minigameType),
      content: ge(r, o, c),
      buttons: {
        start: {
          icon: '<i class="fa-solid fa-terminal"></i>',
          label: "Accept and roll",
          callback: async () => he(r)
        }
      },
      default: "start"
    }, {
      classes: ["holosuite-hacking-start-dialog"]
    }).render(!0);
  } catch (r) {
    console.error(`${S} | Failed to handle hacking launch request.`, r), (s = (i = ui.notifications) == null ? void 0 : i.error) == null || s.call(i, "HoloSuite Hacking launch failed. See console for details.");
  }
}
async function he(e) {
  const t = it(e.actorId, J(e.userId) ?? game.user), n = await fe(e);
  if (!Number.isFinite(n == null ? void 0 : n.total)) return null;
  const i = {
    rollTotal: n.total,
    dc: e.dc,
    actorId: e.actorId,
    actorName: (t == null ? void 0 : t.name) ?? e.actorName ?? "Hacker",
    userId: e.userId,
    skillId: e.skillId,
    onSuccess: (s) => ut(e, s),
    onFailure: (s) => ut(e, s)
  };
  return e.minigameType === "signal-alignment" ? I.startSignalAlignment(i) : I.startNodeIntrusion(i);
}
async function fe(e) {
  var t, n;
  try {
    const i = Number(e.skillModifier ?? 0), s = `1d20 ${i >= 0 ? "+" : "-"} ${Math.abs(i)}`, r = await new Roll(s).evaluate({ async: !0 });
    return await r.toMessage({
      speaker: ChatMessage.getSpeaker(),
      flavor: `${M(B(e.minigameType))}: ${M(e.skillLabel || e.skillId || "Skill")} vs DC ${Number(e.dc)}`
    }), { total: Number(r.total), roll: r };
  } catch (i) {
    return console.error(`${S} | Fallback skill roll failed.`, i), (n = (t = ui.notifications) == null ? void 0 : t.warn) == null || n.call(t, "HoloSuite Hacking skill check failed."), null;
  }
}
function ut(e, t) {
  var n, i;
  (i = (n = game.socket) == null ? void 0 : n.emit) == null || i.call(n, nt, {
    type: "result-report",
    payload: {
      requestId: e.requestId,
      gmUserId: e.gmUserId,
      result: t
    }
  });
}
function me(e = {}) {
  var i, s, r;
  if (!((i = game.user) != null && i.isGM) || e.gmUserId !== game.user.id) return;
  const t = z.get(e.requestId);
  z.delete(e.requestId), t != null && t.timeoutId && window.clearTimeout(t.timeoutId);
  const n = e.result ?? {};
  n.result === "success" ? (s = t == null ? void 0 : t.onSuccess) == null || s.call(t, n) : (r = t == null ? void 0 : t.onFailure) == null || r.call(t, n);
}
function ge(e, t, n) {
  return `
    <section class="holosuite-hacking-start-prompt">
      <p>Incoming hacking challenge</p>
      <h2>${M(B(e.minigameType))}</h2>
      <div>${M(t)} rolls ${M(n)} vs DC ${Number(e.dc)}</div>
    </section>
  `;
}
function kt(e = {}) {
  const t = Number(game.settings.get(S, "defaultDc") ?? 15);
  return {
    requestId: String(e.requestId ?? foundry.utils.randomID()),
    minigameType: String(e.minigameType ?? e.type ?? "node-intrusion"),
    userId: String(e.userId ?? ""),
    actorId: String(e.actorId ?? ""),
    actorName: String(e.actorName ?? ""),
    skillId: String(e.skillId ?? ""),
    skillLabel: String(e.skillLabel ?? ""),
    skillModifier: Number(e.skillModifier ?? 0),
    dc: Number(e.dc ?? t),
    gmUserId: String(e.gmUserId ?? "")
  };
}
function it(e, t) {
  const n = x(e);
  if (n) return n;
  const i = P(t);
  if (i) return i;
  const s = Z(t);
  if (s.length === 1) return s[0];
  const r = Ot();
  return r && H(r, t) ? r : null;
}
function B(e) {
  var t, n;
  return ((n = (t = I == null ? void 0 : I.getMinigames) == null ? void 0 : t.call(I).find((i) => i.id === e)) == null ? void 0 : n.title) ?? String(e ?? "Hacking");
}
function K() {
  var t, n;
  const e = ((t = game.modules.get("holosuite-core")) == null ? void 0 : t.api) ?? game.holosuite;
  return typeof (e == null ? void 0 : e.registerApp) != "function" ? !1 : ((n = e.unregisterApp) == null || n.call(e, "node-intrusion"), e.registerApp({
    id: S,
    title: "HoloSuite Hacking",
    icon: "fa-solid fa-terminal",
    premium: !1,
    featureId: S,
    playerVisible: !1,
    description: "Reusable hacking minigames for terminals, traces, and signal puzzles.",
    open: () => xt()
  }), !0);
}
Hooks.once("init", () => {
  ce(), le(), Ct();
});
Hooks.once("ready", () => {
  var e, t;
  Ct(), (t = (e = game.socket) == null ? void 0 : e.on) == null || t.call(e, nt, de), K(), window.setTimeout(() => K(), 500), console.log(`${S} | Ready. API available at game.modules.get("${S}").api`);
});
