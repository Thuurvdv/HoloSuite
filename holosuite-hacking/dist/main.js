const $ = {
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
function D(e) {
  return {
    ...e,
    ...e.nodeIntrusion,
    ...e.signalAlignment,
    allowMainPathFirewalls: e.nodeIntrusion.allowFirewallOnMainPath
  };
}
function j(e = 0, t = 10) {
  const n = Number(e) || 0, i = Number(t) || 10;
  return n <= i - 10 ? D($.critical_failure) : n >= i + 10 ? D($.critical_success) : n >= i + 5 ? D($.strong_success) : n >= i ? D($.success) : D($.failure_but_playable);
}
const J = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map();
function ot(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim();
  if (!t || typeof (e == null ? void 0 : e.create) != "function")
    throw new Error("HoloSuite Hacking minigames require an id and create(options) function.");
  J.set(t, {
    title: String(e.title ?? t),
    icon: String(e.icon ?? "fa-solid fa-terminal"),
    ...e,
    id: t
  });
}
function Dt(e) {
  return J.get(String(e ?? ""));
}
function Pt() {
  return [...J.values()];
}
function Ht(e, t = {}) {
  var r, a, o, c, l;
  const n = Dt(e);
  if (!n)
    return (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, `Unknown HoloSuite hacking minigame: ${e}`), null;
  (c = (o = H.get(n.id)) == null ? void 0 : o.close) == null || c.call(o);
  const i = n.create(t);
  console.log("holosuite-hacking | Creating minigame app", {
    type: n.id,
    title: n.title,
    appClass: (l = i.constructor) == null ? void 0 : l.name
  });
  const s = i.close.bind(i);
  return i.close = async (...h) => (H.delete(n.id), s(...h)), H.set(n.id, i), i.render(!0), i;
}
function Ft(e) {
  return e ? H.get(String(e)) ?? null : [...H.values()].at(-1) ?? null;
}
function Lt({ moduleId: e, openLauncher: t }) {
  function n(a) {
    const o = String(game.settings.get(e, "visualGlitchIntensity") ?? "medium"), c = Number(a.visualGlitchIntensity ?? 0.4), l = o === "low" ? Math.min(c, 0.25) : o === "high" ? Math.min(1, c + 0.2) : c;
    return { ...a, visualGlitchIntensity: l };
  }
  function i(a = {}) {
    const o = Number(game.settings.get(e, "defaultDc") ?? 15), c = Number(a.dc ?? o), l = Number(a.rollTotal ?? c), h = n(a.profile ?? j(l, c));
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
    getDifficultyProfile: j,
    difficultyProfiles: $,
    getMinigames: Pt,
    getActiveApp: Ft,
    testNodeIntrusion: () => r.startNodeIntrusion({
      rollTotal: 17,
      dc: 15,
      onSuccess: (a) => console.log(`${e} | Node Intrusion success`, a),
      onFailure: (a) => console.log(`${e} | Node Intrusion failure`, a)
    }),
    testSignalAlignment: () => r.startSignalAlignment({
      rollTotal: 17,
      dc: 15,
      onSuccess: (a) => console.log(`${e} | Signal Alignment success`, a),
      onFailure: (a) => console.log(`${e} | Signal Alignment failure`, a)
    })
  };
  return r;
}
function v(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function K() {
  return Q().filter((t) => !t.isGM);
}
function Q() {
  var e;
  return Array.isArray(game.users) ? game.users : ((e = game.users) == null ? void 0 : e.contents) ?? [...game.users ?? []];
}
function Z(e) {
  var n, i;
  const t = String(e ?? "");
  return ((i = (n = game.users) == null ? void 0 : n.get) == null ? void 0 : i.call(n, t)) ?? Q().find((s) => s.id === t) ?? null;
}
function tt() {
  var e;
  return Array.isArray(game.actors) ? game.actors : ((e = game.actors) == null ? void 0 : e.contents) ?? [...game.actors ?? []];
}
function C(e) {
  var n, i;
  const t = String(e ?? "");
  return ((i = (n = game.actors) == null ? void 0 : n.get) == null ? void 0 : i.call(n, t)) ?? tt().find((s) => s.id === t || s.uuid === t) ?? null;
}
function F(e) {
  const t = e == null ? void 0 : e.character;
  return t ? typeof t == "string" ? C(t) : t : null;
}
function L(e, t) {
  var s, r, a, o;
  if (!e || !t) return !1;
  if (e === F(t) || (s = e.testUserPermission) != null && s.call(e, t, "OWNER")) return !0;
  const n = ((a = (r = globalThis.CONST) == null ? void 0 : r.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3, i = e.ownership ?? ((o = e.data) == null ? void 0 : o.permission) ?? {};
  return Number(i[t.id] ?? i.default ?? 0) >= n;
}
function Ot() {
  var e, t, n;
  return ((n = (t = (e = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : e.controlled) == null ? void 0 : t[0]) == null ? void 0 : n.actor) ?? null;
}
function et(e) {
  const t = F(e) ? [F(e)] : [], n = tt().filter((s) => L(s, e));
  return [...new Map([...t, ...n].filter(Boolean).map((s) => [s.id, s])).values()].sort((s, r) => s.name.localeCompare(r.name));
}
function ct(e = "") {
  const t = K(), n = t.find((s) => s.id === e);
  return (n ? et(n) : tt()).filter((s) => !n || L(s, n)).map((s) => ({
    id: s.id,
    name: s.name,
    owners: t.filter((r) => L(s, r))
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
function lt(e) {
  var n;
  const t = (n = e == null ? void 0 : e.system) == null ? void 0 : n.skills;
  if (t && typeof t == "object") {
    const i = Object.entries(t).map(([s, r]) => ({
      id: s,
      name: W(s, r),
      label: Et(s, r),
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
function Mt(e, t) {
  var n, i;
  return ((i = (n = e == null ? void 0 : e.system) == null ? void 0 : n.skills) == null ? void 0 : i[t]) ?? null;
}
function W(e, t) {
  const n = String((t == null ? void 0 : t.label) ?? (t == null ? void 0 : t.name) ?? (t == null ? void 0 : t.localizedName) ?? e ?? "Skill").trim(), i = n.toLowerCase().replace(/[^a-z0-9]/g, "");
  return String(qt[i] ?? n).replace(/[_-]/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
}
function nt(e) {
  var s, r, a, o, c, l, h, d, m, S;
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
    (m = e == null ? void 0 : e.roll) == null ? void 0 : m.total,
    e == null ? void 0 : e.rank,
    e == null ? void 0 : e.ranks
  ].find((f) => Number.isFinite(Number(f)));
  if (n !== void 0) return Number(n);
  const i = [];
  return vt(e, i, 0), i.sort((f, w) => w.score - f.score), Number(((S = i[0]) == null ? void 0 : S.value) ?? 0);
}
function Et(e, t) {
  const n = W(e, t), i = nt(t), s = i >= 0 ? "+" : "-";
  return `${n} (${s}${Math.abs(i)})`;
}
function vt(e, t, n, i = "") {
  if (!(!e || typeof e != "object" || n > 4))
    for (const [s, r] of Object.entries(e)) {
      const a = i ? `${i}.${s}` : s, o = Number(r);
      if (Number.isFinite(o)) {
        const c = a.toLowerCase();
        let l = 1;
        /(total|mod|modifier|bonus|check|roll|value)$/.test(c) && (l += 6), /(dc|rank|ranks|proficient|prof|trained|ability|base|label|name)/.test(c) && (l -= 4), Math.abs(o) > 30 && (l -= 5), t.push({ value: o, score: l, path: a });
      } else r && typeof r == "object" && vt(r, t, n + 1, a);
    }
}
const A = "holosuite-hacking", Rt = `modules/${A}/templates/hacking-launcher.html`;
var ft, gt, mt;
const Gt = globalThis.Application ?? ((mt = (gt = (ft = globalThis.foundry) == null ? void 0 : ft.appv1) == null ? void 0 : gt.api) == null ? void 0 : mt.Application);
class _t extends Gt {
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
    const t = Number(game.settings.get(A, "defaultDc") ?? 15), n = K(), i = n[0] ?? null, s = ct(i == null ? void 0 : i.id), r = s.length ? C(s[0].id) : null;
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
      skills: lt(r)
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
    var u, g, y, b, M, N;
    if (!((u = game.user) != null && u.isGM)) {
      (y = (g = ui.notifications) == null ? void 0 : g.warn) == null || y.call(g, "Only the GM can open the HoloSuite Hacking launcher.");
      return;
    }
    if (!t) {
      (M = (b = ui.notifications) == null ? void 0 : b.error) == null || M.call(b, "HoloSuite Hacking launcher form was not found."), console.error(`${A} | Launcher form was not found.`);
      return;
    }
    const n = t.querySelector("[name='minigameType']"), i = t.querySelector("[name='actorId']"), s = t.querySelector("[name='userId']"), r = t.querySelector("[name='skillId']"), a = t.querySelector("[name='dc']"), o = ((N = r == null ? void 0 : r.selectedOptions) == null ? void 0 : N[0]) ?? null, c = String((n == null ? void 0 : n.value) || "node-intrusion"), l = String((i == null ? void 0 : i.value) || ""), h = String((s == null ? void 0 : s.value) || ""), d = String((r == null ? void 0 : r.value) || ""), m = String((o == null ? void 0 : o.dataset.skillLabel) || (o == null ? void 0 : o.textContent) || d || "Skill"), S = Number((o == null ? void 0 : o.dataset.skillModifier) ?? 0), f = Number((a == null ? void 0 : a.value) ?? 15);
    this.api.sendHackToPlayer({
      minigameType: c,
      actorId: l,
      userId: h,
      skillId: d,
      skillLabel: m,
      skillModifier: S,
      dc: f,
      onSuccess: (x) => console.log(`${A} | Test success callback`, x),
      onFailure: (x) => console.log(`${A} | Test failure callback`, x)
    }) && this.close();
  }
  testSelf(t) {
    var o, c, l, h, d, m, S, f, w, u, g, y, b;
    if (!((o = game.user) != null && o.isGM)) {
      (l = (c = ui.notifications) == null ? void 0 : c.warn) == null || l.call(c, "Only the GM can test HoloSuite Hacking minigames.");
      return;
    }
    if (!t) {
      (d = (h = ui.notifications) == null ? void 0 : h.error) == null || d.call(h, "HoloSuite Hacking launcher form was not found.");
      return;
    }
    const n = String(((m = t.querySelector("[name='minigameType']")) == null ? void 0 : m.value) || "node-intrusion"), i = String(((S = t.querySelector("[name='actorId']")) == null ? void 0 : S.value) || ""), s = Number(((f = t.querySelector("[name='dc']")) == null ? void 0 : f.value) ?? game.settings.get(A, "defaultDc") ?? 15), r = Number(((w = t.querySelector("[name='testRollTotal']")) == null ? void 0 : w.value) ?? s);
    if (!Number.isFinite(r)) {
      (g = (u = ui.notifications) == null ? void 0 : u.warn) == null || g.call(u, "Enter a fake roll result before testing the minigame.");
      return;
    }
    const a = C(i);
    this.api.startHack({
      type: n,
      dc: s,
      rollTotal: r,
      actorName: (a == null ? void 0 : a.name) ?? ((y = game.user) == null ? void 0 : y.name) ?? "GM",
      userId: ((b = game.user) == null ? void 0 : b.id) ?? "",
      onSuccess: (M) => console.log(`${A} | GM test success`, M),
      onFailure: (M) => console.log(`${A} | GM test failure`, M)
    }), this.close();
  }
  syncUserToActor(t, n) {
    const i = C(n), s = K().find((r) => i == null ? void 0 : i.testUserPermission(r, "OWNER"));
    s && t.find("[name='userId']").val(s.id);
  }
  syncSkillOptions(t, n) {
    const i = C(n), s = lt(i);
    t.find("[name='skillId']").html(s.map((r) => `<option value="${v(r.id)}" data-skill-label="${v(r.name ?? r.label)}" data-skill-modifier="${Number(r.modifier ?? 0)}">${v(r.label)}</option>`).join(""));
  }
  syncActorsForUser(t, n) {
    const i = ct(n), s = i.length ? i.map((r) => `<option value="${v(r.id)}">${v(r.name)} (${v(r.owners.map((a) => a.name).join(", ") || "No owner")})</option>`).join("") : '<option value="">Use assigned character</option>';
    t.find("[name='actorId']").html(s), this.syncSkillOptions(t, t.find("[name='actorId']").val());
  }
}
async function Tt({ title: e, result: t, actorName: n, message: i, rollTotal: s, dc: r }) {
  const a = t === "success", o = a ? "#38f28f" : "#ff477e", c = a ? "HACK SUCCESS" : "HACK FAILED", l = i || (a ? "Objective completed." : "Trace or countermeasure completed."), h = Number.isFinite(Number(s)) && Number.isFinite(Number(r)) ? `<p style="margin: 4px 0 0; color: #bdeff6;">Roll ${Number(s)} vs DC ${Number(r)}</p>` : "", d = `
    <div class="holosuite-hacking-chat-result" style="border-left: 4px solid ${o}; padding: 8px 10px; background: rgba(5, 8, 14, 0.88); color: ${o};">
      <strong>${q(c)} // ${q(e)} // ${q(n || "Hacker")}</strong>
      <p style="margin: 6px 0 0; color: ${o};">${q(l)}</p>
      ${h}
    </div>
  `;
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content: d
  });
}
function q(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function T(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function Ut(e) {
  const t = String(e ?? "node-intrusion");
  let n = 2166136261;
  for (let i = 0; i < t.length; i += 1)
    n ^= t.charCodeAt(i), n = Math.imul(n, 16777619);
  return n >>> 0;
}
function jt(e) {
  let t = Ut(e);
  return () => {
    t += 1831565813;
    let n = t;
    return n = Math.imul(n ^ n >>> 15, n | 1), n ^= n + Math.imul(n ^ n >>> 7, n | 61), ((n ^ n >>> 14) >>> 0) / 4294967296;
  };
}
function E(e, t) {
  return e.length ? e[Math.floor(t() * e.length)] : null;
}
function P(e, t, n) {
  const i = e.find((r) => r.id === t), s = e.find((r) => r.id === n);
  !i || !s || (i.connected.includes(n) || i.connected.push(n), s.connected.includes(t) || s.connected.push(t));
}
function R(e, t) {
  return [e, t].sort().join("--");
}
function X(e, t, n, i) {
  return {
    id: e,
    x: T(Math.round(n), 6, 94),
    y: T(Math.round(i), 10, 90),
    type: t,
    connected: [],
    revealed: t === "start" || t === "target",
    visited: !1
  };
}
function it(e) {
  return e.flatMap((t) => t.connected.filter((n) => t.id < n).map((n) => ({ from: t.id, to: n })));
}
function k(e, t) {
  return e.find((n) => n.id === t);
}
function G(e, t, n) {
  return Math.sign((t.y - e.y) * (n.x - t.x) - (t.x - e.x) * (n.y - t.y));
}
function zt(e, t, n, i) {
  const s = G(e, t, n), r = G(e, t, i), a = G(n, i, e), o = G(n, i, t);
  return s !== r && a !== o;
}
function Bt(e, t, n) {
  if (t.from === n.from || t.from === n.to || t.to === n.from || t.to === n.to) return !1;
  const i = k(e, t.from), s = k(e, t.to), r = k(e, n.from), a = k(e, n.to);
  return !i || !s || !r || !a ? !1 : zt(i, s, r, a);
}
function Wt(e, t, n) {
  const i = n.x - t.x, s = n.y - t.y, r = i * i + s * s;
  if (!r) {
    const h = e.x - t.x, d = e.y - t.y;
    return Math.sqrt(h * h + d * d);
  }
  const a = T(((e.x - t.x) * i + (e.y - t.y) * s) / r, 0, 1), o = {
    x: t.x + a * i,
    y: t.y + a * s
  }, c = e.x - o.x, l = e.y - o.y;
  return Math.sqrt(c * c + l * l);
}
function Vt(e, t = it(e)) {
  let n = 0;
  for (let i = 0; i < t.length; i += 1)
    for (let s = i + 1; s < t.length; s += 1)
      Bt(e, t[i], t[s]) && (n += 1);
  return n;
}
function Nt(e) {
  const t = it(e);
  let n = Vt(e, t) * 900;
  for (let i = 0; i < e.length; i += 1)
    for (let s = i + 1; s < e.length; s += 1) {
      const r = e[i], a = e[s], o = a.x - r.x, c = a.y - r.y, l = Math.sqrt(o * o + c * c) || 1;
      l < 13 && (n += (13 - l) * 30), l < 18 && (n += (18 - l) * 6);
    }
  for (const i of e)
    for (const s of t) {
      if (s.from === i.id || s.to === i.id) continue;
      const r = k(e, s.from), a = k(e, s.to);
      if (!r || !a) continue;
      const o = Wt(i, r, a);
      o < 8 && (n += (8 - o) * 18);
    }
  return n;
}
function Kt(e, t, n) {
  const i = e.map((s) => ({ ...s, connected: [...s.connected] }));
  i.push({ ...t, connected: [] });
  for (const s of n) P(i, t.id, s);
  return Nt(i);
}
function ut(e, t, n, i, s, r, a = {}) {
  const {
    radiusMin: o = 17,
    radiusMax: c = 34,
    biasX: l = 5,
    ySpread: h = 1
  } = a;
  let d = null, m = 1 / 0;
  for (let S = 0; S < 16; S += 1) {
    const f = s() * Math.PI * 2 - Math.PI * 0.2, w = o + s() * (c - o), u = i.x + Math.cos(f) * w + l, g = i.y + Math.sin(f) * w * h, y = X(t, n, u, g), b = Kt(e, y, r);
    b < m && (d = y, m = b);
  }
  return d ?? X(t, n, i.x + l, i.y);
}
function Xt(e) {
  for (let t = 0; t < 24; t += 1)
    for (let n = 0; n < e.length; n += 1)
      for (let i = n + 1; i < e.length; i += 1) {
        const s = e[n], r = e[i], a = r.x - s.x, o = r.y - s.y, c = Math.sqrt(a * a + o * o) || 1;
        if (c >= 13) continue;
        const l = (13 - c) * 0.35, h = a / c * l, d = o / c * l;
        s.type !== "start" && s.type !== "target" && (s.x = T(s.x - h, 6, 94), s.y = T(s.y - d, 10, 90)), r.type !== "start" && r.type !== "target" && (r.x = T(r.x + h, 6, 94), r.y = T(r.y + d, 10, 90));
      }
}
function dt(e, t = Date.now()) {
  var S, f, w;
  const n = jt(t), i = Math.max(6, Number(e.nodeCount ?? ((S = e.nodeIntrusion) == null ? void 0 : S.nodeCount)) || 10), s = T(Number(e.decoyCount ?? ((f = e.nodeIntrusion) == null ? void 0 : f.decoyCount)) || 0, 0, i - 4), r = Math.max(0, i - s), a = T(Math.round(r * 0.55), 5, r), o = [], c = [];
  for (let u = 0; u < a; u += 1) {
    const g = u === 0 ? "start" : u === a - 1 ? "target" : `node-${u}`, y = u === 0 ? "start" : u === a - 1 ? "target" : "normal", b = u / Math.max(1, a - 1), M = Math.sin(b * Math.PI * 1.35) * 10, N = u === 0 || u === a - 1 ? 0 : (n() - 0.5) * 5, x = u === 0 || u === a - 1 ? 0 : (n() - 0.5) * 12;
    o.push(X(g, y, 9 + b * 82 + N, 52 + M + x)), c.push(g), u > 0 && P(o, c[u - 1], g);
  }
  let l = a;
  for (; o.length < i - s; ) {
    const u = E(o.filter((N) => N.type !== "target"), n) ?? o[0], g = `node-${l}`;
    l += 1;
    const y = n() > 0.45 ? E(o.filter((N) => N.id !== u.id && N.type !== "start"), n) : null, b = y ? [u.id, y.id] : [u.id], M = ut(o, g, "normal", u, n, b, {
      radiusMin: 16,
      radiusMax: 31,
      biasX: n() > 0.35 ? 5 : -4,
      ySpread: 1.15
    });
    o.push(M), P(o, u.id, g), y && P(o, g, y.id);
  }
  for (let u = 0; u < s; u += 1) {
    const g = E(o.filter((M) => M.type !== "target" && M.type !== "decoy"), n) ?? o[0], y = `decoy-${u + 1}`, b = ut(o, y, "decoy", g, n, [g.id], {
      radiusMin: 18,
      radiusMax: 34,
      biasX: n() > 0.5 ? -6 : 6,
      ySpread: 1.25
    });
    o.push(b), P(o, g.id, y);
  }
  const h = e.allowFirewallOnMainPath ?? e.allowMainPathFirewalls ?? !1, d = o.filter((u) => u.type === "start" || u.type === "target" || u.type === "decoy" ? !1 : h || !c.includes(u.id)), m = T(Number(e.firewallCount ?? ((w = e.nodeIntrusion) == null ? void 0 : w.firewallCount)) || 0, 0, d.length);
  for (let u = 0; u < m; u += 1) {
    const g = d.filter((b) => b.type !== "firewall"), y = E(g, n);
    if (!y) break;
    y.type = "firewall";
  }
  return Xt(o), {
    nodes: o,
    edges: it(o),
    startNodeId: "start",
    targetNodeId: "target",
    mainPathIds: c,
    layoutScore: Nt(o)
  };
}
function Yt(e, t = Date.now()) {
  var s;
  const n = T(Math.ceil(Number(e.nodeCount ?? ((s = e.nodeIntrusion) == null ? void 0 : s.nodeCount)) || 10), 7, 14);
  let i = null;
  for (let r = 0; r < n; r += 1) {
    const a = dt(e, `${t}:${r}`);
    if ((!i || a.layoutScore < i.layoutScore) && (i = a), a.layoutScore < 1) break;
  }
  return i ?? dt(e, t);
}
const At = "holosuite-hacking", Jt = `modules/${At}/templates/node-intrusion.html`;
var pt, yt, bt;
const Qt = globalThis.Application ?? ((bt = (yt = (pt = globalThis.foundry) == null ? void 0 : pt.appv1) == null ? void 0 : yt.api) == null ? void 0 : bt.Application);
function Zt(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function V(e) {
  return e === "start" ? "entry" : e === "target" ? "target" : e === "firewall" ? "firewall" : e === "decoy" ? "decoy" : "relay";
}
class te extends Qt {
  constructor(t = {}) {
    super(t), this.rollTotal = Number(t.rollTotal ?? 15), this.dc = Number(t.dc ?? 15), this.profile = t.profile ? { ...t.profile } : j(this.rollTotal, this.dc), this.seed = t.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}`, this.onSuccess = typeof t.onSuccess == "function" ? t.onSuccess : null, this.onFailure = typeof t.onFailure == "function" ? t.onFailure : null, this.actorName = String(t.actorName ?? "Hacker"), this.chatOnResult = t.chatOnResult !== !1, this.graph = Yt(this.profile, this.seed), this.state = {
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
    const t = this.getCurrentNode(), n = t.connected, i = this.graph.nodes.map((s) => ({
      ...s,
      isCurrent: s.id === this.state.currentNodeId,
      isVisited: this.state.visitedNodeIds.has(s.id),
      isNeighbor: n.includes(s.id),
      canMove: n.includes(s.id) && !this.state.blockedEdgeIds.has(R(t.id, s.id)) && !this.state.deadNodeIds.has(s.id),
      isDangerVisible: this.profile.hintsEnabled || s.revealed || this.state.visitedNodeIds.has(s.id),
      displayType: this.profile.hintsEnabled || s.revealed || this.state.visitedNodeIds.has(s.id) || s.type === "start" || s.type === "target" ? V(s.type) : "unknown",
      title: `${s.id} - ${V(s.type)}`
    }));
    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      nodes: i,
      edges: this.graph.edges.map((s) => {
        const r = i.find((c) => c.id === s.from), a = i.find((c) => c.id === s.to), o = this.state.blockedEdgeIds.get(R(s.from, s.to));
        return {
          ...s,
          from: r,
          to: a,
          isVisitedPath: this.state.traversedEdgeIds.has(R(s.from, s.to)),
          isAvailable: !o && (n.includes(s.from) || n.includes(s.to)),
          isBlocked: !!o,
          isFirewallPath: o === "firewall",
          isDecoyPath: o === "decoy"
        };
      }),
      movement: this.state.movement,
      currentNode: {
        id: t.id,
        label: V(t.type),
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
    const s = R(n.id, t);
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
    const t = Number(game.settings.get(At, "traceDurationMultiplier") ?? 1) || 1, n = Math.max(5, this.profile.traceDurationSeconds * t);
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
    this.chatOnResult && await Tt({
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
function $t(e, t, n) {
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
function z(e) {
  return $t(Number(e) || 0, 0, 100);
}
function ie(e, t = Date.now()) {
  var a, o, c;
  const n = ne(t), i = $t(Number(e.channelCount ?? ((a = e.signalAlignment) == null ? void 0 : a.channelCount)) || 3, 2, 5), s = Number(e.tolerance ?? ((o = e.signalAlignment) == null ? void 0 : o.tolerance) ?? 5), r = Number(e.decoyFrequencies ?? ((c = e.signalAlignment) == null ? void 0 : c.decoyFrequencies) ?? 0);
  return Array.from({ length: i }, (l, h) => {
    const d = Math.round(18 + n() * 64), m = n() > 0.5 ? 1 : -1, S = s + 8 + Math.round(n() * 18), f = n() > 0.5 ? 1 : -1, w = Array.from({ length: r }, () => z(d + (n() > 0.5 ? 1 : -1) * (s + 9 + n() * 18)));
    return {
      id: `channel-${h + 1}`,
      label: `CH-${String(h + 1).padStart(2, "0")}`,
      value: z(d + m * S),
      target: d,
      tolerance: s,
      driftDirection: f,
      decoys: w
    };
  });
}
const Ct = "holosuite-hacking", se = `modules/${Ct}/templates/signal-alignment.html`;
var St, It, wt;
const re = globalThis.Application ?? ((wt = (It = (St = globalThis.foundry) == null ? void 0 : St.appv1) == null ? void 0 : It.api) == null ? void 0 : wt.Application);
function _(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
class ae extends re {
  constructor(t = {}) {
    super(t), this.rollTotal = Number(t.rollTotal ?? 15), this.dc = Number(t.dc ?? 15), this.profile = t.profile ? { ...t.profile } : j(this.rollTotal, this.dc), this.seed = t.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}:signal`, this.onSuccess = typeof t.onSuccess == "function" ? t.onSuccess : null, this.onFailure = typeof t.onFailure == "function" ? t.onFailure : null, this.actorName = String(t.actorName ?? "Hacker"), this.chatOnResult = t.chatOnResult !== !1, this.channels = ie(this.profile, this.seed), this.state = {
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
        toleranceLeft: _(n.target - n.tolerance, 0, 100),
        toleranceWidth: _(n.tolerance * 2, 1, 100)
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
    n && (n.value = z(t.value), this.checkDestabilization(), this.syncDom());
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
    const t = Number(game.settings.get(Ct, "traceDurationMultiplier") ?? 1) || 1, n = Math.max(5, this.profile.traceDurationSeconds * t);
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const i = performance.now(), s = Math.min(0.5, (i - this.lastTickAt) / 1e3);
      this.lastTickAt = i, this.applyDrift(s);
      const r = this.areAllChannelsAligned();
      this.state.lockProgress = r ? _(this.state.lockProgress + s / this.profile.lockHoldSeconds, 0, 1) : 0, this.wasAligned && !r && (this.state.mistakes += 1, this.state.destabilizations += 1), this.wasAligned = r;
      const a = (i - this.startedAt) / 1e3;
      this.state.traceProgress = _(a / n * 100, 0, 100), this.syncDom(), this.state.lockProgress >= 1 ? this.finish("success", "Transmission Decrypted") : this.state.traceProgress >= 100 ? this.finish("failure", "Trace Complete") : this.state.mistakes > this.profile.maxMistakes && this.finish("failure", "Signal destabilized too often");
    }, 120);
  }
  applyDrift(t) {
    const n = Number(this.profile.signalDriftSpeed ?? 0);
    if (!(n <= 0))
      for (const i of this.channels)
        i.value = z(i.value + i.driftDirection * n * t), (i.value <= 0 || i.value >= 100) && (i.driftDirection *= -1);
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
    this.chatOnResult && await Tt({
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
      const m = l.querySelector("[data-wave-fill]");
      m && (m.style.width = `${c.value}%`);
    }
  }
}
const p = "holosuite-hacking", st = `module.${p}`, oe = 10 * 60 * 1e3;
let I = null, U = null;
const B = /* @__PURE__ */ new Map();
function ce() {
  game.settings.register(p, "defaultDc", {
    name: "Default Hacking DC",
    hint: "Used by the GM launcher and API calls that omit a DC.",
    scope: "world",
    config: !0,
    type: Number,
    default: 15
  }), game.settings.register(p, "traceDurationMultiplier", {
    name: "Default Trace Duration Multiplier",
    hint: "Multiplies trace timers for all HoloSuite hacking minigames.",
    scope: "world",
    config: !0,
    type: Number,
    default: 1
  }), game.settings.register(p, "allowPlayerInteraction", {
    name: "Allow Players To Interact Directly",
    hint: "Reserved for future player-targeted play. The GM launcher remains GM-only for now.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(p, "visualGlitchIntensity", {
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
  ot({
    id: "node-intrusion",
    title: "Node Intrusion",
    icon: "fa-solid fa-network-wired",
    create: (e) => new te(e)
  }), ot({
    id: "signal-alignment",
    title: "Signal Alignment",
    icon: "fa-solid fa-wave-square",
    create: (e) => new ae(e)
  });
}
function rt() {
  var e, t, n;
  return (e = game.user) != null && e.isGM ? (U = U ?? new _t({ api: I }), U.render(!0), U) : ((n = (t = ui.notifications) == null ? void 0 : t.warn) == null || n.call(t, "Only the GM can open HoloSuite Hacking."), null);
}
function ue(e) {
  var r, a, o;
  if (!((r = game.user) != null && r.isGM)) return;
  const t = () => rt(), n = {
    name: "holosuite-hacking-launch",
    title: "HoloSuite Hacking",
    icon: "fa-solid fa-terminal",
    button: !0,
    visible: !0,
    onClick: t,
    onChange: t
  };
  if (Array.isArray(e)) {
    const c = e.find((l) => l.name === "token") ?? e[0];
    c != null && c.tools && !((o = (a = c.tools).some) != null && o.call(a, (l) => l.name === n.name)) && c.tools.push(n);
    return;
  }
  const i = e ?? {}, s = i.tokens ?? i.token ?? Object.values(i)[0];
  !(s != null && s.tools) || s.tools[n.name] || (s.tools[n.name] = { ...n, order: Object.keys(s.tools).length });
}
function kt() {
  I = I ?? Lt({ moduleId: p, openLauncher: rt }), I.sendHackToPlayer = de, I.registerWithHoloSuite = Y;
  const e = game.modules.get(p);
  return e && (e.api = I), game.holosuiteHacking = I, I;
}
function de(e = {}) {
  var o, c, l, h, d, m, S;
  if (!((o = game.user) != null && o.isGM))
    return (l = (c = ui.notifications) == null ? void 0 : c.warn) == null || l.call(c, "Only the GM can send HoloSuite hacking challenges."), !1;
  if (!game.socket)
    return (d = (h = ui.notifications) == null ? void 0 : h.error) == null || d.call(h, "Foundry sockets are not available."), !1;
  const t = xt(e), n = Z(t.userId), i = at(t.actorId, n);
  i ? n && !L(i, n) && console.warn(`${p} | ${n.name} does not appear to own ${i.name}; sending fallback roll data anyway.`) : console.warn(`${p} | Could not resolve hacker actor.`, {
    actorId: t.actorId,
    userId: t.userId,
    availableUsers: Q().map((f) => ({ id: f.id, name: f.name, isGM: f.isGM })),
    userCharacter: F(n),
    ownedActors: et(n).map((f) => ({ id: f.id, name: f.name }))
  });
  const s = Mt(i, t.skillId), r = t.skillLabel || W(t.skillId, s), a = Number.isFinite(Number(t.skillModifier)) && Number(t.skillModifier) !== 0 ? Number(t.skillModifier) : nt(s);
  if (typeof e.onSuccess == "function" || typeof e.onFailure == "function") {
    const f = window.setTimeout(() => B.delete(t.requestId), oe);
    B.set(t.requestId, {
      onSuccess: typeof e.onSuccess == "function" ? e.onSuccess : null,
      onFailure: typeof e.onFailure == "function" ? e.onFailure : null,
      timeoutId: f
    });
  }
  return game.socket.emit(st, {
    type: "launch-request",
    payload: {
      ...t,
      actorId: (i == null ? void 0 : i.id) ?? "",
      actorName: (i == null ? void 0 : i.name) ?? (n == null ? void 0 : n.name) ?? "Hacker",
      skillLabel: r,
      skillModifier: a,
      gmUserId: game.user.id
    }
  }), console.log(`${p} | Sent hacking challenge`, {
    minigameType: t.minigameType,
    userId: t.userId,
    actorId: (i == null ? void 0 : i.id) ?? "",
    skillLabel: r,
    skillModifier: a
  }), (S = (m = ui.notifications) == null ? void 0 : m.info) == null || S.call(m, `${O(t.minigameType)} sent${n ? ` to ${n.name}` : " to players"}.`), !0;
}
function he(e) {
  var t, n, i, s;
  try {
    if ((e == null ? void 0 : e.type) === "result-report") {
      me(e.payload ?? {});
      return;
    }
    if ((e == null ? void 0 : e.type) !== "launch-request") return;
    const r = xt(e.payload ?? {});
    if (r.userId && r.userId !== ((t = game.user) == null ? void 0 : t.id) || !r.userId && ((n = game.user) != null && n.isGM)) return;
    const a = at(r.actorId, Z(r.userId) ?? game.user), o = r.actorName || (a == null ? void 0 : a.name) || "Intruder", c = r.skillLabel || W(r.skillId, Mt(a, r.skillId));
    new Dialog({
      title: O(r.minigameType),
      content: pe(r, o, c),
      buttons: {
        start: {
          icon: '<i class="fa-solid fa-terminal"></i>',
          label: "Accept and roll",
          callback: async () => fe(r)
        }
      },
      default: "start"
    }, {
      classes: ["holosuite-hacking-start-dialog"]
    }).render(!0);
  } catch (r) {
    console.error(`${p} | Failed to handle hacking launch request.`, r), (s = (i = ui.notifications) == null ? void 0 : i.error) == null || s.call(i, "HoloSuite Hacking launch failed. See console for details.");
  }
}
async function fe(e) {
  const t = at(e.actorId, Z(e.userId) ?? game.user), n = await ge(e);
  if (!Number.isFinite(n == null ? void 0 : n.total)) return null;
  const i = {
    rollTotal: n.total,
    dc: e.dc,
    actorId: e.actorId,
    actorName: (t == null ? void 0 : t.name) ?? e.actorName ?? "Hacker",
    userId: e.userId,
    skillId: e.skillId,
    onSuccess: (s) => ht(e, s),
    onFailure: (s) => ht(e, s)
  };
  return console.log(`${p} | Starting player minigame`, {
    minigameType: e.minigameType,
    rollTotal: n.total,
    dc: e.dc
  }), e.minigameType === "signal-alignment" ? I.startSignalAlignment(i) : I.startNodeIntrusion(i);
}
async function ge(e) {
  var t, n;
  try {
    const i = Number(e.skillModifier ?? 0), s = `1d20 ${i >= 0 ? "+" : "-"} ${Math.abs(i)}`, r = await new Roll(s).evaluate({ async: !0 });
    return await r.toMessage({
      speaker: ChatMessage.getSpeaker(),
      flavor: `${v(O(e.minigameType))}: ${v(e.skillLabel || e.skillId || "Skill")} vs DC ${Number(e.dc)}`
    }), { total: Number(r.total), roll: r };
  } catch (i) {
    return console.error(`${p} | Fallback skill roll failed.`, i), (n = (t = ui.notifications) == null ? void 0 : t.warn) == null || n.call(t, "HoloSuite Hacking skill check failed."), null;
  }
}
function ht(e, t) {
  var n, i;
  console.log(`${p} | ${O(e.minigameType)} ${t.result}`, t), (i = (n = game.socket) == null ? void 0 : n.emit) == null || i.call(n, st, {
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
  const t = B.get(e.requestId);
  B.delete(e.requestId), t != null && t.timeoutId && window.clearTimeout(t.timeoutId);
  const n = e.result ?? {};
  n.result === "success" ? (s = t == null ? void 0 : t.onSuccess) == null || s.call(t, n) : (r = t == null ? void 0 : t.onFailure) == null || r.call(t, n), console.log(`${p} | Player hacking result`, n);
}
function pe(e, t, n) {
  return `
    <section class="holosuite-hacking-start-prompt">
      <p>Incoming hacking challenge</p>
      <h2>${v(O(e.minigameType))}</h2>
      <div>${v(t)} rolls ${v(n)} vs DC ${Number(e.dc)}</div>
    </section>
  `;
}
function xt(e = {}) {
  const t = Number(game.settings.get(p, "defaultDc") ?? 15);
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
function at(e, t) {
  const n = C(e);
  if (n) return n;
  const i = F(t);
  if (i) return i;
  const s = et(t);
  if (s.length === 1) return s[0];
  const r = Ot();
  return r && L(r, t) ? r : null;
}
function O(e) {
  var t, n;
  return ((n = (t = I == null ? void 0 : I.getMinigames) == null ? void 0 : t.call(I).find((i) => i.id === e)) == null ? void 0 : n.title) ?? String(e ?? "Hacking");
}
function Y() {
  var t, n;
  const e = ((t = game.modules.get("holosuite-core")) == null ? void 0 : t.api) ?? game.holosuite;
  return typeof (e == null ? void 0 : e.registerApp) != "function" ? !1 : ((n = e.unregisterApp) == null || n.call(e, "node-intrusion"), e.registerApp({
    id: p,
    title: "HoloSuite Hacking",
    icon: "fa-solid fa-terminal",
    premium: !1,
    featureId: p,
    playerVisible: !1,
    description: "Reusable hacking minigames for terminals, traces, and signal puzzles.",
    open: () => rt()
  }), !0);
}
Hooks.once("init", () => {
  ce(), le(), kt();
});
Hooks.on("getSceneControlButtons", ue);
Hooks.once("ready", () => {
  var e, t;
  kt(), (t = (e = game.socket) == null ? void 0 : e.on) == null || t.call(e, st, he), Y(), window.setTimeout(() => Y(), 500), console.log(`${p} | Ready. API available at game.modules.get("${p}").api`), console.log(`${p} | Test with game.modules.get("${p}").api.testNodeIntrusion() or .testSignalAlignment()`);
});
