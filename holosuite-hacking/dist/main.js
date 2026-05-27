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
function x(t) {
  return {
    ...t,
    ...t.nodeIntrusion,
    ...t.signalAlignment,
    allowMainPathFirewalls: t.nodeIntrusion.allowFirewallOnMainPath
  };
}
function z(t = 0, e = 10) {
  const n = Number(t) || 0, i = Number(e) || 10;
  return n <= i - 10 ? x($.critical_failure) : n >= i + 10 ? x($.critical_success) : n >= i + 5 ? x($.strong_success) : n >= i ? x($.success) : x($.failure_but_playable);
}
const J = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map();
function oe(t) {
  const e = String((t == null ? void 0 : t.id) ?? "").trim();
  if (!e || typeof (t == null ? void 0 : t.create) != "function")
    throw new Error("HoloSuite Hacking minigames require an id and create(options) function.");
  J.set(e, {
    title: String(t.title ?? e),
    icon: String(t.icon ?? "fa-solid fa-terminal"),
    ...t,
    id: e
  });
}
function He(t) {
  return J.get(String(t ?? ""));
}
function Fe() {
  return [...J.values()];
}
function Le(t, e = {}) {
  var r, a, o, c, l;
  const n = He(t);
  if (!n)
    return (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, `Unknown HoloSuite hacking minigame: ${t}`), null;
  (c = (o = P.get(n.id)) == null ? void 0 : o.close) == null || c.call(o);
  const i = n.create(e);
  console.log("holosuite-hacking | Creating minigame app", {
    type: n.id,
    title: n.title,
    appClass: (l = i.constructor) == null ? void 0 : l.name
  });
  const s = i.close.bind(i);
  return i.close = async (...h) => (P.delete(n.id), s(...h)), P.set(n.id, i), i.render(!0), i;
}
function Oe(t) {
  return t ? P.get(String(t)) ?? null : [...P.values()].at(-1) ?? null;
}
function Ee({ moduleId: t, openLauncher: e }) {
  function n(a) {
    const o = String(game.settings.get(t, "visualGlitchIntensity") ?? "medium"), c = Number(a.visualGlitchIntensity ?? 0.4), l = o === "low" ? Math.min(c, 0.25) : o === "high" ? Math.min(1, c + 0.2) : c;
    return { ...a, visualGlitchIntensity: l };
  }
  function i(a = {}) {
    const o = Number(game.settings.get(t, "defaultDc") ?? 15), c = Number(a.dc ?? o), l = Number(a.rollTotal ?? c), h = n(a.profile ?? z(l, c));
    return { ...a, dc: c, rollTotal: l, profile: h };
  }
  function s(a = {}) {
    const o = String(a.type ?? "node-intrusion");
    return Le(o, i(a));
  }
  const r = {
    startHack: s,
    startNodeIntrusion: (a = {}) => s({ ...a, type: "node-intrusion" }),
    startSignalAlignment: (a = {}) => s({ ...a, type: "signal-alignment" }),
    openLauncher: e,
    getDifficultyProfile: z,
    difficultyProfiles: $,
    getMinigames: Fe,
    getActiveApp: Oe,
    testNodeIntrusion: () => r.startNodeIntrusion({
      rollTotal: 17,
      dc: 15,
      onSuccess: (a) => console.log(`${t} | Node Intrusion success`, a),
      onFailure: (a) => console.log(`${t} | Node Intrusion failure`, a)
    }),
    testSignalAlignment: () => r.startSignalAlignment({
      rollTotal: 17,
      dc: 15,
      onSuccess: (a) => console.log(`${t} | Signal Alignment success`, a),
      onFailure: (a) => console.log(`${t} | Signal Alignment failure`, a)
    })
  };
  return r;
}
function w(t) {
  const e = document.createElement("div");
  return e.textContent = String(t ?? ""), e.innerHTML;
}
function K() {
  return Q().filter((e) => !e.isGM);
}
function Q() {
  var t;
  return Array.isArray(game.users) ? game.users : ((t = game.users) == null ? void 0 : t.contents) ?? [...game.users ?? []];
}
function Z(t) {
  var n, i;
  const e = String(t ?? "");
  return ((i = (n = game.users) == null ? void 0 : n.get) == null ? void 0 : i.call(n, e)) ?? Q().find((s) => s.id === e) ?? null;
}
function ee() {
  var t;
  return Array.isArray(game.actors) ? game.actors : ((t = game.actors) == null ? void 0 : t.contents) ?? [...game.actors ?? []];
}
function H(t) {
  var n, i;
  const e = String(t ?? "");
  return ((i = (n = game.actors) == null ? void 0 : n.get) == null ? void 0 : i.call(n, e)) ?? ee().find((s) => s.id === e || s.uuid === e) ?? null;
}
function F(t) {
  const e = t == null ? void 0 : t.character;
  return e ? typeof e == "string" ? H(e) : e : null;
}
function L(t, e) {
  var s, r, a, o;
  if (!t || !e) return !1;
  if (t === F(e) || (s = t.testUserPermission) != null && s.call(t, e, "OWNER")) return !0;
  const n = ((a = (r = globalThis.CONST) == null ? void 0 : r.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3, i = t.ownership ?? ((o = t.data) == null ? void 0 : o.permission) ?? {};
  return Number(i[e.id] ?? i.default ?? 0) >= n;
}
function qe() {
  var t, e, n;
  return ((n = (e = (t = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : t.controlled) == null ? void 0 : e[0]) == null ? void 0 : n.actor) ?? null;
}
function te(t) {
  const e = F(t) ? [F(t)] : [], n = ee().filter((s) => L(s, t));
  return [...new Map([...e, ...n].filter(Boolean).map((s) => [s.id, s])).values()].sort((s, r) => s.name.localeCompare(r.name));
}
function ce(t = "") {
  const e = K(), n = e.find((s) => s.id === t);
  return (n ? te(n) : ee()).filter((s) => !n || L(s, n)).map((s) => ({
    id: s.id,
    name: s.name,
    owners: e.filter((r) => L(s, r))
  })).sort((s, r) => s.name.localeCompare(r.name));
}
const Re = {
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
function le(t) {
  var n;
  const e = (n = t == null ? void 0 : t.system) == null ? void 0 : n.skills;
  if (e && typeof e == "object") {
    const i = Object.entries(e).map(([s, r]) => ({
      id: s,
      name: W(s, r),
      label: Ge(s, r),
      modifier: ne(r)
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
function Ne(t, e) {
  var n, i;
  return ((i = (n = t == null ? void 0 : t.system) == null ? void 0 : n.skills) == null ? void 0 : i[e]) ?? null;
}
function W(t, e) {
  const n = String((e == null ? void 0 : e.label) ?? (e == null ? void 0 : e.name) ?? (e == null ? void 0 : e.localizedName) ?? t ?? "Skill").trim(), i = n.toLowerCase().replace(/[^a-z0-9]/g, "");
  return String(Re[i] ?? n).replace(/[_-]/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
}
function ne(t) {
  var s, r, a, o, c, l, h, u, f, y;
  if (typeof t == "number") return t;
  if (!t || typeof t != "object") return 0;
  const n = [
    t == null ? void 0 : t.mod,
    (s = t == null ? void 0 : t.mod) == null ? void 0 : s.value,
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
    (h = t == null ? void 0 : t.check) == null ? void 0 : h.total,
    t == null ? void 0 : t.roll,
    (u = t == null ? void 0 : t.roll) == null ? void 0 : u.mod,
    (f = t == null ? void 0 : t.roll) == null ? void 0 : f.total,
    t == null ? void 0 : t.rank,
    t == null ? void 0 : t.ranks
  ].find((g) => Number.isFinite(Number(g)));
  if (n !== void 0) return Number(n);
  const i = [];
  return Te(t, i, 0), i.sort((g, v) => v.score - g.score), Number(((y = i[0]) == null ? void 0 : y.value) ?? 0);
}
function Ge(t, e) {
  const n = W(t, e), i = ne(e), s = i >= 0 ? "+" : "-";
  return `${n} (${s}${Math.abs(i)})`;
}
function Te(t, e, n, i = "") {
  if (!(!t || typeof t != "object" || n > 4))
    for (const [s, r] of Object.entries(t)) {
      const a = i ? `${i}.${s}` : s, o = Number(r);
      if (Number.isFinite(o)) {
        const c = a.toLowerCase();
        let l = 1;
        /(total|mod|modifier|bonus|check|roll|value)$/.test(c) && (l += 6), /(dc|rank|ranks|proficient|prof|trained|ability|base|label|name)/.test(c) && (l -= 4), Math.abs(o) > 30 && (l -= 5), e.push({ value: o, score: l, path: a });
      } else r && typeof r == "object" && Te(r, e, n + 1, a);
    }
}
const A = "holosuite-hacking", _e = `modules/${A}/templates/hacking-launcher.html`;
var me, pe, ye;
const Ue = globalThis.Application ?? ((ye = (pe = (me = globalThis.foundry) == null ? void 0 : me.appv1) == null ? void 0 : pe.api) == null ? void 0 : ye.Application);
class ze extends Ue {
  constructor(e = {}) {
    super(e), this.api = e.api;
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
      template: _e
    });
  }
  getData() {
    const e = Number(game.settings.get(A, "defaultDc") ?? 15), n = K(), i = n[0] ?? null, s = ce(i == null ? void 0 : i.id), r = s.length ? H(s[0].id) : null;
    return {
      defaultDc: e,
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
      skills: le(r)
    };
  }
  activateListeners(e) {
    super.activateListeners(e);
    const n = e.is("form") ? e[0] : e.find("form")[0];
    e.find("[data-action='start']").on("click", (s) => {
      s.preventDefault(), this.submit(n);
    }), e.find("[data-action='test-self']").on("click", (s) => {
      s.preventDefault(), this.testSelf(n);
    }), (e.is("form") ? e : e.find("form")).on("submit", (s) => {
      s.preventDefault(), this.submit(s.currentTarget);
    }), e.find("[name='actorId']").on("change", (s) => {
      this.syncUserToActor(e, s.currentTarget.value), this.syncSkillOptions(e, s.currentTarget.value);
    }), e.find("[name='userId']").on("change", (s) => {
      this.syncActorsForUser(e, s.currentTarget.value);
    }), this.syncSkillOptions(e, e.find("[name='actorId']").val());
  }
  submit(e) {
    var d, p, b, I, N, T;
    if (!((d = game.user) != null && d.isGM)) {
      (b = (p = ui.notifications) == null ? void 0 : p.warn) == null || b.call(p, "Only the GM can open the HoloSuite Hacking launcher.");
      return;
    }
    if (!e) {
      (N = (I = ui.notifications) == null ? void 0 : I.error) == null || N.call(I, "HoloSuite Hacking launcher form was not found."), console.error(`${A} | Launcher form was not found.`);
      return;
    }
    const n = e.querySelector("[name='minigameType']"), i = e.querySelector("[name='actorId']"), s = e.querySelector("[name='userId']"), r = e.querySelector("[name='skillId']"), a = e.querySelector("[name='dc']"), o = ((T = r == null ? void 0 : r.selectedOptions) == null ? void 0 : T[0]) ?? null, c = String((n == null ? void 0 : n.value) || "node-intrusion"), l = String((i == null ? void 0 : i.value) || ""), h = String((s == null ? void 0 : s.value) || ""), u = String((r == null ? void 0 : r.value) || ""), f = String((o == null ? void 0 : o.dataset.skillLabel) || (o == null ? void 0 : o.textContent) || u || "Skill"), y = Number((o == null ? void 0 : o.dataset.skillModifier) ?? 0), g = Number((a == null ? void 0 : a.value) ?? 15);
    this.api.sendHackToPlayer({
      minigameType: c,
      actorId: l,
      userId: h,
      skillId: u,
      skillLabel: f,
      skillModifier: y,
      dc: g,
      onSuccess: (C) => console.log(`${A} | Test success callback`, C),
      onFailure: (C) => console.log(`${A} | Test failure callback`, C)
    }) && this.close();
  }
  testSelf(e) {
    var s, r, a, o, c, l, h, u, f;
    if (!((s = game.user) != null && s.isGM)) {
      (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, "Only the GM can test HoloSuite Hacking minigames.");
      return;
    }
    if (!e) {
      (c = (o = ui.notifications) == null ? void 0 : o.error) == null || c.call(o, "HoloSuite Hacking launcher form was not found.");
      return;
    }
    const n = String(((l = e.querySelector("[name='minigameType']")) == null ? void 0 : l.value) || "node-intrusion"), i = Number(((h = e.querySelector("[name='dc']")) == null ? void 0 : h.value) ?? game.settings.get(A, "defaultDc") ?? 15);
    this.api.startHack({
      type: n,
      dc: i,
      rollTotal: i + 2,
      actorName: ((u = game.user) == null ? void 0 : u.name) ?? "GM",
      userId: ((f = game.user) == null ? void 0 : f.id) ?? "",
      onSuccess: (y) => console.log(`${A} | GM test success`, y),
      onFailure: (y) => console.log(`${A} | GM test failure`, y)
    }), this.close();
  }
  syncUserToActor(e, n) {
    const i = H(n), s = K().find((r) => i == null ? void 0 : i.testUserPermission(r, "OWNER"));
    s && e.find("[name='userId']").val(s.id);
  }
  syncSkillOptions(e, n) {
    const i = H(n), s = le(i);
    e.find("[name='skillId']").html(s.map((r) => `<option value="${w(r.id)}" data-skill-label="${w(r.name ?? r.label)}" data-skill-modifier="${Number(r.modifier ?? 0)}">${w(r.label)}</option>`).join(""));
  }
  syncActorsForUser(e, n) {
    const i = ce(n), s = i.length ? i.map((r) => `<option value="${w(r.id)}">${w(r.name)} (${w(r.owners.map((a) => a.name).join(", ") || "No owner")})</option>`).join("") : '<option value="">Use assigned character</option>';
    e.find("[name='actorId']").html(s), this.syncSkillOptions(e, e.find("[name='actorId']").val());
  }
}
async function Ae({ title: t, result: e, actorName: n, message: i, rollTotal: s, dc: r }) {
  const a = e === "success", o = a ? "#38f28f" : "#ff477e", c = a ? "HACK SUCCESS" : "HACK FAILED", l = i || (a ? "Objective completed." : "Trace or countermeasure completed."), h = Number.isFinite(Number(s)) && Number.isFinite(Number(r)) ? `<p style="margin: 4px 0 0; color: #bdeff6;">Roll ${Number(s)} vs DC ${Number(r)}</p>` : "", u = `
    <div class="holosuite-hacking-chat-result" style="border-left: 4px solid ${o}; padding: 8px 10px; background: rgba(5, 8, 14, 0.88); color: ${o};">
      <strong>${E(c)} // ${E(t)} // ${E(n || "Hacker")}</strong>
      <p style="margin: 6px 0 0; color: ${o};">${E(l)}</p>
      ${h}
    </div>
  `;
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content: u
  });
}
function E(t) {
  const e = document.createElement("div");
  return e.textContent = String(t ?? ""), e.innerHTML;
}
function M(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function je(t) {
  const e = String(t ?? "node-intrusion");
  let n = 2166136261;
  for (let i = 0; i < e.length; i += 1)
    n ^= e.charCodeAt(i), n = Math.imul(n, 16777619);
  return n >>> 0;
}
function Be(t) {
  let e = je(t);
  return () => {
    e += 1831565813;
    let n = e;
    return n = Math.imul(n ^ n >>> 15, n | 1), n ^= n + Math.imul(n ^ n >>> 7, n | 61), ((n ^ n >>> 14) >>> 0) / 4294967296;
  };
}
function q(t, e) {
  return t.length ? t[Math.floor(e() * t.length)] : null;
}
function D(t, e, n) {
  const i = t.find((r) => r.id === e), s = t.find((r) => r.id === n);
  !i || !s || (i.connected.includes(n) || i.connected.push(n), s.connected.includes(e) || s.connected.push(e));
}
function R(t, e) {
  return [t, e].sort().join("--");
}
function X(t, e, n, i) {
  return {
    id: t,
    x: M(Math.round(n), 6, 94),
    y: M(Math.round(i), 10, 90),
    type: e,
    connected: [],
    revealed: e === "start" || e === "target",
    visited: !1
  };
}
function ie(t) {
  return t.flatMap((e) => e.connected.filter((n) => e.id < n).map((n) => ({ from: e.id, to: n })));
}
function k(t, e) {
  return t.find((n) => n.id === e);
}
function G(t, e, n) {
  return Math.sign((e.y - t.y) * (n.x - e.x) - (e.x - t.x) * (n.y - e.y));
}
function We(t, e, n, i) {
  const s = G(t, e, n), r = G(t, e, i), a = G(n, i, t), o = G(n, i, e);
  return s !== r && a !== o;
}
function Ve(t, e, n) {
  if (e.from === n.from || e.from === n.to || e.to === n.from || e.to === n.to) return !1;
  const i = k(t, e.from), s = k(t, e.to), r = k(t, n.from), a = k(t, n.to);
  return !i || !s || !r || !a ? !1 : We(i, s, r, a);
}
function Ke(t, e, n) {
  const i = n.x - e.x, s = n.y - e.y, r = i * i + s * s;
  if (!r) {
    const h = t.x - e.x, u = t.y - e.y;
    return Math.sqrt(h * h + u * u);
  }
  const a = M(((t.x - e.x) * i + (t.y - e.y) * s) / r, 0, 1), o = {
    x: e.x + a * i,
    y: e.y + a * s
  }, c = t.x - o.x, l = t.y - o.y;
  return Math.sqrt(c * c + l * l);
}
function Xe(t, e = ie(t)) {
  let n = 0;
  for (let i = 0; i < e.length; i += 1)
    for (let s = i + 1; s < e.length; s += 1)
      Ve(t, e[i], e[s]) && (n += 1);
  return n;
}
function $e(t) {
  const e = ie(t);
  let n = Xe(t, e) * 900;
  for (let i = 0; i < t.length; i += 1)
    for (let s = i + 1; s < t.length; s += 1) {
      const r = t[i], a = t[s], o = a.x - r.x, c = a.y - r.y, l = Math.sqrt(o * o + c * c) || 1;
      l < 13 && (n += (13 - l) * 30), l < 18 && (n += (18 - l) * 6);
    }
  for (const i of t)
    for (const s of e) {
      if (s.from === i.id || s.to === i.id) continue;
      const r = k(t, s.from), a = k(t, s.to);
      if (!r || !a) continue;
      const o = Ke(i, r, a);
      o < 8 && (n += (8 - o) * 18);
    }
  return n;
}
function Ye(t, e, n) {
  const i = t.map((s) => ({ ...s, connected: [...s.connected] }));
  i.push({ ...e, connected: [] });
  for (const s of n) D(i, e.id, s);
  return $e(i);
}
function ue(t, e, n, i, s, r, a = {}) {
  const {
    radiusMin: o = 17,
    radiusMax: c = 34,
    biasX: l = 5,
    ySpread: h = 1
  } = a;
  let u = null, f = 1 / 0;
  for (let y = 0; y < 16; y += 1) {
    const g = s() * Math.PI * 2 - Math.PI * 0.2, v = o + s() * (c - o), d = i.x + Math.cos(g) * v + l, p = i.y + Math.sin(g) * v * h, b = X(e, n, d, p), I = Ye(t, b, r);
    I < f && (u = b, f = I);
  }
  return u ?? X(e, n, i.x + l, i.y);
}
function Je(t) {
  for (let e = 0; e < 24; e += 1)
    for (let n = 0; n < t.length; n += 1)
      for (let i = n + 1; i < t.length; i += 1) {
        const s = t[n], r = t[i], a = r.x - s.x, o = r.y - s.y, c = Math.sqrt(a * a + o * o) || 1;
        if (c >= 13) continue;
        const l = (13 - c) * 0.35, h = a / c * l, u = o / c * l;
        s.type !== "start" && s.type !== "target" && (s.x = M(s.x - h, 6, 94), s.y = M(s.y - u, 10, 90)), r.type !== "start" && r.type !== "target" && (r.x = M(r.x + h, 6, 94), r.y = M(r.y + u, 10, 90));
      }
}
function de(t, e = Date.now()) {
  var y, g, v;
  const n = Be(e), i = Math.max(6, Number(t.nodeCount ?? ((y = t.nodeIntrusion) == null ? void 0 : y.nodeCount)) || 10), s = M(Number(t.decoyCount ?? ((g = t.nodeIntrusion) == null ? void 0 : g.decoyCount)) || 0, 0, i - 4), r = Math.max(0, i - s), a = M(Math.round(r * 0.55), 5, r), o = [], c = [];
  for (let d = 0; d < a; d += 1) {
    const p = d === 0 ? "start" : d === a - 1 ? "target" : `node-${d}`, b = d === 0 ? "start" : d === a - 1 ? "target" : "normal", I = d / Math.max(1, a - 1), N = Math.sin(I * Math.PI * 1.35) * 10, T = d === 0 || d === a - 1 ? 0 : (n() - 0.5) * 5, C = d === 0 || d === a - 1 ? 0 : (n() - 0.5) * 12;
    o.push(X(p, b, 9 + I * 82 + T, 52 + N + C)), c.push(p), d > 0 && D(o, c[d - 1], p);
  }
  let l = a;
  for (; o.length < i - s; ) {
    const d = q(o.filter((T) => T.type !== "target"), n) ?? o[0], p = `node-${l}`;
    l += 1;
    const b = n() > 0.45 ? q(o.filter((T) => T.id !== d.id && T.type !== "start"), n) : null, I = b ? [d.id, b.id] : [d.id], N = ue(o, p, "normal", d, n, I, {
      radiusMin: 16,
      radiusMax: 31,
      biasX: n() > 0.35 ? 5 : -4,
      ySpread: 1.15
    });
    o.push(N), D(o, d.id, p), b && D(o, p, b.id);
  }
  for (let d = 0; d < s; d += 1) {
    const p = q(o.filter((N) => N.type !== "target" && N.type !== "decoy"), n) ?? o[0], b = `decoy-${d + 1}`, I = ue(o, b, "decoy", p, n, [p.id], {
      radiusMin: 18,
      radiusMax: 34,
      biasX: n() > 0.5 ? -6 : 6,
      ySpread: 1.25
    });
    o.push(I), D(o, p.id, b);
  }
  const h = t.allowFirewallOnMainPath ?? t.allowMainPathFirewalls ?? !1, u = o.filter((d) => d.type === "start" || d.type === "target" || d.type === "decoy" ? !1 : h || !c.includes(d.id)), f = M(Number(t.firewallCount ?? ((v = t.nodeIntrusion) == null ? void 0 : v.firewallCount)) || 0, 0, u.length);
  for (let d = 0; d < f; d += 1) {
    const p = u.filter((I) => I.type !== "firewall"), b = q(p, n);
    if (!b) break;
    b.type = "firewall";
  }
  return Je(o), {
    nodes: o,
    edges: ie(o),
    startNodeId: "start",
    targetNodeId: "target",
    mainPathIds: c,
    layoutScore: $e(o)
  };
}
function he(t, e = Date.now()) {
  var s;
  const n = M(Math.ceil(Number(t.nodeCount ?? ((s = t.nodeIntrusion) == null ? void 0 : s.nodeCount)) || 10), 7, 14);
  let i = null;
  for (let r = 0; r < n; r += 1) {
    const a = de(t, `${e}:${r}`);
    if ((!i || a.layoutScore < i.layoutScore) && (i = a), a.layoutScore < 1) break;
  }
  return i ?? de(t, e);
}
const ke = "holosuite-hacking", Qe = `modules/${ke}/templates/node-intrusion.html`;
var be, Ie, Se;
const Ze = globalThis.Application ?? ((Se = (Ie = (be = globalThis.foundry) == null ? void 0 : be.appv1) == null ? void 0 : Ie.api) == null ? void 0 : Se.Application);
function et(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function V(t) {
  return t === "start" ? "entry" : t === "target" ? "target" : t === "firewall" ? "firewall" : t === "decoy" ? "decoy" : "relay";
}
class tt extends Ze {
  constructor(e = {}) {
    super(e), this.rollTotal = Number(e.rollTotal ?? 15), this.dc = Number(e.dc ?? 15), this.profile = e.profile ? { ...e.profile } : z(this.rollTotal, this.dc), this.seed = e.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}`, this.onSuccess = typeof e.onSuccess == "function" ? e.onSuccess : null, this.onFailure = typeof e.onFailure == "function" ? e.onFailure : null, this.actorName = String(e.actorName ?? "Hacker"), this.chatOnResult = e.chatOnResult !== !1, this.graph = he(this.profile, this.seed), this.state = {
      currentNodeId: this.graph.startNodeId,
      visitedNodeIds: /* @__PURE__ */ new Set([this.graph.startNodeId]),
      traversedEdgeIds: /* @__PURE__ */ new Set(),
      blockedEdgeIds: /* @__PURE__ */ new Map(),
      deadNodeIds: /* @__PURE__ */ new Set(),
      mistakes: 0,
      traceProgress: 0,
      isRunning: !0,
      result: null
    }, this.startedAt = performance.now(), this.timer = null;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-node-intrusion-app",
      title: "Node Intrusion",
      classes: ["node-intrusion-window", "holosuite-hacking-window"],
      popOut: !0,
      resizable: !0,
      width: 920,
      height: 660,
      template: Qe
    });
  }
  getData() {
    const e = this.getCurrentNode(), n = e.connected, i = this.graph.nodes.map((s) => ({
      ...s,
      isCurrent: s.id === this.state.currentNodeId,
      isVisited: this.state.visitedNodeIds.has(s.id),
      isNeighbor: n.includes(s.id),
      canMove: n.includes(s.id) && !this.state.blockedEdgeIds.has(R(e.id, s.id)) && !this.state.deadNodeIds.has(s.id),
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
      currentNode: {
        id: e.id,
        label: V(e.type),
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
  activateListeners(e) {
    super.activateListeners(e), e.find("[data-node-id]").on("click", (n) => this.handleNodeClick(n.currentTarget.dataset.nodeId)), e.find("[data-action='abort']").on("click", () => this.abort()), e.find("[data-action='restart']").on("click", () => this.restart()), this.syncDom();
  }
  async render(e, n) {
    const i = await super.render(e, n);
    return this.state.isRunning && this.startTimer(), i;
  }
  async close(e = {}) {
    return this.stopTimer(), super.close(e);
  }
  getCurrentNode() {
    return this.graph.nodes.find((e) => e.id === this.state.currentNodeId) ?? this.graph.nodes[0];
  }
  handleNodeClick(e) {
    var r, a, o, c, l, h;
    if (!this.state.isRunning) return;
    const n = this.getCurrentNode(), i = this.graph.nodes.find((u) => u.id === e);
    if (!i) return;
    if (!n.connected.includes(e)) {
      (r = this.element) == null || r.find(".node-intrusion-shell").addClass("invalid-pulse"), window.setTimeout(() => {
        var u;
        return (u = this.element) == null ? void 0 : u.find(".node-intrusion-shell").removeClass("invalid-pulse");
      }, 280);
      return;
    }
    const s = R(n.id, e);
    if (this.state.blockedEdgeIds.has(s) || this.state.deadNodeIds.has(e)) {
      (a = this.element) == null || a.find(".node-intrusion-shell").addClass("invalid-pulse"), window.setTimeout(() => {
        var u;
        return (u = this.element) == null ? void 0 : u.find(".node-intrusion-shell").removeClass("invalid-pulse");
      }, 280);
      return;
    }
    if (this.state.visitedNodeIds.add(e), this.state.traversedEdgeIds.add(s), i.visited = !0, i.revealed = !0, i.type === "firewall") {
      if (this.state.mistakes += 1, this.state.blockedEdgeIds.set(s, "firewall"), this.state.deadNodeIds.add(e), (c = (o = ui.notifications) == null ? void 0 : o.warn) == null || c.call(o, `Firewall tripped (${this.state.mistakes}/${this.profile.maxMistakes}).`), this.state.mistakes > this.profile.maxMistakes) {
        this.finish("failure", "Firewall countermeasures locked the intrusion");
        return;
      }
      this.render(!1);
      return;
    }
    if (i.type === "decoy") {
      if (this.state.mistakes += 1, this.state.blockedEdgeIds.set(s, "decoy"), this.state.deadNodeIds.add(e), (h = (l = ui.notifications) == null ? void 0 : l.warn) == null || h.call(l, `Decoy route burned (${this.state.mistakes}/${this.profile.maxMistakes}).`), this.state.mistakes > this.profile.maxMistakes) {
        this.finish("failure", "The intrusion collapsed into decoy space");
        return;
      }
      this.render(!1);
      return;
    }
    if (this.state.currentNodeId = e, i.type === "target") {
      this.finish("success", "Target node breached");
      return;
    }
    if (this.state.mistakes > this.profile.maxMistakes) {
      this.finish("failure", "Firewall countermeasures locked the intrusion");
      return;
    }
    this.render(!1);
  }
  restart() {
    this.stopTimer(), this.graph = he(this.profile, `${this.seed}:${Date.now()}`), this.state = {
      currentNodeId: this.graph.startNodeId,
      visitedNodeIds: /* @__PURE__ */ new Set([this.graph.startNodeId]),
      traversedEdgeIds: /* @__PURE__ */ new Set(),
      blockedEdgeIds: /* @__PURE__ */ new Map(),
      deadNodeIds: /* @__PURE__ */ new Set(),
      mistakes: 0,
      traceProgress: 0,
      isRunning: !0,
      result: null
    }, this.resultMessage = null, this.startedAt = performance.now(), this.render(!1);
  }
  startTimer() {
    if (this.timer) return;
    const e = Number(game.settings.get(ke, "traceDurationMultiplier") ?? 1) || 1, n = Math.max(5, this.profile.traceDurationSeconds * e);
    this.timer = window.setInterval(() => {
      if (!this.state.isRunning) return;
      const i = (performance.now() - this.startedAt) / 1e3;
      this.state.traceProgress = et(i / n * 100, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
    }, 120);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(e, n, { close: i = !1 } = {}) {
    var r, a;
    if (!this.state.isRunning && this.state.result) return;
    this.state.isRunning = !1, this.state.result = e, this.stopTimer(), this.resultMessage = n, this.syncDom(), await this.render(!1);
    const s = {
      type: "node-intrusion",
      result: e,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      traceProgress: this.state.traceProgress,
      visitedNodeIds: [...this.state.visitedNodeIds]
    };
    this.chatOnResult && await Ae({
      title: "Node Intrusion",
      result: e,
      actorName: this.actorName,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), e === "success" ? (r = this.onSuccess) == null || r.call(this, s) : (a = this.onFailure) == null || a.call(this, s), i && await this.close();
  }
  syncDom() {
    var r;
    const e = (r = this.element) == null ? void 0 : r[0];
    if (!e) return;
    const n = e.querySelector("[data-trace-fill]"), i = e.querySelector("[data-trace-text]"), s = e.querySelector("[data-mistake-text]");
    n && (n.style.width = `${this.state.traceProgress}%`), i && (i.textContent = `${Math.round(this.state.traceProgress)}%`), s && (s.textContent = `${this.state.mistakes}/${this.profile.maxMistakes}`);
  }
}
function Ce(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function nt(t) {
  const e = String(t ?? "signal-alignment");
  let n = 2166136261;
  for (let i = 0; i < e.length; i += 1)
    n ^= e.charCodeAt(i), n = Math.imul(n, 16777619);
  return n >>> 0;
}
function it(t) {
  let e = nt(t);
  return () => {
    e += 1831565813;
    let n = e;
    return n = Math.imul(n ^ n >>> 15, n | 1), n ^= n + Math.imul(n ^ n >>> 7, n | 61), ((n ^ n >>> 14) >>> 0) / 4294967296;
  };
}
function j(t) {
  return Ce(Number(t) || 0, 0, 100);
}
function fe(t, e = Date.now()) {
  var a, o, c;
  const n = it(e), i = Ce(Number(t.channelCount ?? ((a = t.signalAlignment) == null ? void 0 : a.channelCount)) || 3, 2, 5), s = Number(t.tolerance ?? ((o = t.signalAlignment) == null ? void 0 : o.tolerance) ?? 5), r = Number(t.decoyFrequencies ?? ((c = t.signalAlignment) == null ? void 0 : c.decoyFrequencies) ?? 0);
  return Array.from({ length: i }, (l, h) => {
    const u = Math.round(18 + n() * 64), f = n() > 0.5 ? 1 : -1, y = s + 8 + Math.round(n() * 18), g = n() > 0.5 ? 1 : -1, v = Array.from({ length: r }, () => j(u + (n() > 0.5 ? 1 : -1) * (s + 9 + n() * 18)));
    return {
      id: `channel-${h + 1}`,
      label: `CH-${String(h + 1).padStart(2, "0")}`,
      value: j(u + f * y),
      target: u,
      tolerance: s,
      driftDirection: g,
      decoys: v
    };
  });
}
const xe = "holosuite-hacking", st = `modules/${xe}/templates/signal-alignment.html`;
var we, Me, ve;
const rt = globalThis.Application ?? ((ve = (Me = (we = globalThis.foundry) == null ? void 0 : we.appv1) == null ? void 0 : Me.api) == null ? void 0 : ve.Application);
function _(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
class at extends rt {
  constructor(e = {}) {
    super(e), this.rollTotal = Number(e.rollTotal ?? 15), this.dc = Number(e.dc ?? 15), this.profile = e.profile ? { ...e.profile } : z(this.rollTotal, this.dc), this.seed = e.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}:signal`, this.onSuccess = typeof e.onSuccess == "function" ? e.onSuccess : null, this.onFailure = typeof e.onFailure == "function" ? e.onFailure : null, this.actorName = String(e.actorName ?? "Hacker"), this.chatOnResult = e.chatOnResult !== !1, this.channels = fe(this.profile, this.seed), this.state = {
      traceProgress: 0,
      mistakes: 0,
      lockProgress: 0,
      destabilizations: 0,
      isRunning: !0,
      result: null
    }, this.startedAt = performance.now(), this.lastTickAt = this.startedAt, this.timer = null, this.wasAligned = !1;
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
      template: st
    });
  }
  getData() {
    const e = this.channels.map((n) => {
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
    super.activateListeners(e), e.find("[data-channel-slider]").on("input", (n) => this.handleSlider(n.currentTarget)), e.find("[data-action='abort']").on("click", () => this.abort()), e.find("[data-action='restart']").on("click", () => this.restart()), this.syncDom();
  }
  async render(e, n) {
    const i = await super.render(e, n);
    return this.state.isRunning && this.startTimer(), i;
  }
  async close(e = {}) {
    return this.stopTimer(), super.close(e);
  }
  handleSlider(e) {
    if (!this.state.isRunning) return;
    const n = this.channels.find((i) => i.id === e.dataset.channelSlider);
    n && (n.value = j(e.value), this.checkDestabilization(), this.syncDom());
  }
  areAllChannelsAligned() {
    return this.channels.every((e) => Math.abs(e.value - e.target) <= e.tolerance);
  }
  checkDestabilization() {
    var n, i;
    const e = this.areAllChannelsAligned();
    this.wasAligned && !e && (this.state.mistakes += 1, this.state.destabilizations += 1, (i = (n = ui.notifications) == null ? void 0 : n.warn) == null || i.call(n, `Signal destabilized (${this.state.mistakes}/${this.profile.maxMistakes}).`), this.state.mistakes > this.profile.maxMistakes && this.finish("failure", "Signal destabilized too often")), this.wasAligned = e;
  }
  restart() {
    this.stopTimer(), this.channels = fe(this.profile, `${this.seed}:${Date.now()}`), this.state = {
      traceProgress: 0,
      mistakes: 0,
      lockProgress: 0,
      destabilizations: 0,
      isRunning: !0,
      result: null
    }, this.resultMessage = null, this.startedAt = performance.now(), this.lastTickAt = this.startedAt, this.wasAligned = !1, this.render(!1);
  }
  startTimer() {
    if (this.timer) return;
    const e = Number(game.settings.get(xe, "traceDurationMultiplier") ?? 1) || 1, n = Math.max(5, this.profile.traceDurationSeconds * e);
    this.timer = window.setInterval(() => {
      if (!this.state.isRunning) return;
      const i = performance.now(), s = Math.min(0.5, (i - this.lastTickAt) / 1e3);
      this.lastTickAt = i, this.applyDrift(s);
      const r = this.areAllChannelsAligned();
      this.state.lockProgress = r ? _(this.state.lockProgress + s / this.profile.lockHoldSeconds, 0, 1) : 0, this.wasAligned && !r && (this.state.mistakes += 1, this.state.destabilizations += 1), this.wasAligned = r;
      const a = (i - this.startedAt) / 1e3;
      this.state.traceProgress = _(a / n * 100, 0, 100), this.syncDom(), this.state.lockProgress >= 1 ? this.finish("success", "Transmission Decrypted") : this.state.traceProgress >= 100 ? this.finish("failure", "Trace Complete") : this.state.mistakes > this.profile.maxMistakes && this.finish("failure", "Signal destabilized too often");
    }, 120);
  }
  applyDrift(e) {
    const n = Number(this.profile.signalDriftSpeed ?? 0);
    if (!(n <= 0))
      for (const i of this.channels)
        i.value = j(i.value + i.driftDirection * n * e), (i.value <= 0 || i.value >= 100) && (i.driftDirection *= -1);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(e, n, { close: i = !1 } = {}) {
    var r, a;
    if (!this.state.isRunning && this.state.result) return;
    this.state.isRunning = !1, this.state.result = e, this.stopTimer(), this.resultMessage = n, this.syncDom(), await this.render(!1);
    const s = {
      type: "signal-alignment",
      result: e,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      traceProgress: this.state.traceProgress,
      lockProgress: this.state.lockProgress,
      channels: this.channels.map((o) => ({ ...o }))
    };
    this.chatOnResult && await Ae({
      title: "Signal Alignment",
      result: e,
      actorName: this.actorName,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), e === "success" ? (r = this.onSuccess) == null || r.call(this, s) : (a = this.onFailure) == null || a.call(this, s), i && await this.close();
  }
  syncDom() {
    var o;
    const e = (o = this.element) == null ? void 0 : o[0];
    if (!e) return;
    const n = e.querySelector("[data-trace-fill]"), i = e.querySelector("[data-trace-text]"), s = e.querySelector("[data-mistake-text]"), r = e.querySelector("[data-lock-fill]"), a = e.querySelector("[data-lock-text]");
    n && (n.style.width = `${this.state.traceProgress}%`), i && (i.textContent = `${Math.round(this.state.traceProgress)}%`), s && (s.textContent = `${this.state.mistakes}/${this.profile.maxMistakes}`), r && (r.style.width = `${Math.round(this.state.lockProgress * 100)}%`), a && (a.textContent = `${Math.round(this.state.lockProgress * 100)}%`);
    for (const c of this.channels) {
      const l = e.querySelector(`[data-channel-row="${c.id}"]`);
      if (!l) continue;
      const h = Math.abs(c.value - c.target) <= c.tolerance;
      l.classList.toggle("is-aligned", h), l.querySelector("[data-channel-value]").textContent = c.value.toFixed(1), l.querySelector("[data-channel-delta]").textContent = Math.abs(c.value - c.target).toFixed(1);
      const u = l.querySelector("[data-channel-slider]");
      u && document.activeElement !== u && (u.value = c.value);
      const f = l.querySelector("[data-wave-fill]");
      f && (f.style.width = `${c.value}%`);
    }
  }
}
const m = "holosuite-hacking", se = `module.${m}`, ot = 10 * 60 * 1e3;
let S = null, U = null;
const B = /* @__PURE__ */ new Map();
function ct() {
  game.settings.register(m, "defaultDc", {
    name: "Default Hacking DC",
    hint: "Used by the GM launcher and API calls that omit a DC.",
    scope: "world",
    config: !0,
    type: Number,
    default: 15
  }), game.settings.register(m, "traceDurationMultiplier", {
    name: "Default Trace Duration Multiplier",
    hint: "Multiplies trace timers for all HoloSuite hacking minigames.",
    scope: "world",
    config: !0,
    type: Number,
    default: 1
  }), game.settings.register(m, "allowPlayerInteraction", {
    name: "Allow Players To Interact Directly",
    hint: "Reserved for future player-targeted play. The GM launcher remains GM-only for now.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(m, "visualGlitchIntensity", {
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
function lt() {
  oe({
    id: "node-intrusion",
    title: "Node Intrusion",
    icon: "fa-solid fa-network-wired",
    create: (t) => new tt(t)
  }), oe({
    id: "signal-alignment",
    title: "Signal Alignment",
    icon: "fa-solid fa-wave-square",
    create: (t) => new at(t)
  });
}
function re() {
  var t, e, n;
  return (t = game.user) != null && t.isGM ? (U = U ?? new ze({ api: S }), U.render(!0), U) : ((n = (e = ui.notifications) == null ? void 0 : e.warn) == null || n.call(e, "Only the GM can open HoloSuite Hacking."), null);
}
function ut(t) {
  var r, a, o;
  if (!((r = game.user) != null && r.isGM)) return;
  const e = () => re(), n = {
    name: "holosuite-hacking-launch",
    title: "HoloSuite Hacking",
    icon: "fa-solid fa-terminal",
    button: !0,
    visible: !0,
    onClick: e,
    onChange: e
  };
  if (Array.isArray(t)) {
    const c = t.find((l) => l.name === "token") ?? t[0];
    c != null && c.tools && !((o = (a = c.tools).some) != null && o.call(a, (l) => l.name === n.name)) && c.tools.push(n);
    return;
  }
  const i = t ?? {}, s = i.tokens ?? i.token ?? Object.values(i)[0];
  !(s != null && s.tools) || s.tools[n.name] || (s.tools[n.name] = { ...n, order: Object.keys(s.tools).length });
}
function De() {
  S = S ?? Ee({ moduleId: m, openLauncher: re }), S.sendHackToPlayer = dt, S.registerWithHoloSuite = Y;
  const t = game.modules.get(m);
  return t && (t.api = S), game.holosuiteHacking = S, S;
}
function dt(t = {}) {
  var o, c, l, h, u, f, y;
  if (!((o = game.user) != null && o.isGM))
    return (l = (c = ui.notifications) == null ? void 0 : c.warn) == null || l.call(c, "Only the GM can send HoloSuite hacking challenges."), !1;
  if (!game.socket)
    return (u = (h = ui.notifications) == null ? void 0 : h.error) == null || u.call(h, "Foundry sockets are not available."), !1;
  const e = Pe(t), n = Z(e.userId), i = ae(e.actorId, n);
  i ? n && !L(i, n) && console.warn(`${m} | ${n.name} does not appear to own ${i.name}; sending fallback roll data anyway.`) : console.warn(`${m} | Could not resolve hacker actor.`, {
    actorId: e.actorId,
    userId: e.userId,
    availableUsers: Q().map((g) => ({ id: g.id, name: g.name, isGM: g.isGM })),
    userCharacter: F(n),
    ownedActors: te(n).map((g) => ({ id: g.id, name: g.name }))
  });
  const s = Ne(i, e.skillId), r = e.skillLabel || W(e.skillId, s), a = Number.isFinite(Number(e.skillModifier)) && Number(e.skillModifier) !== 0 ? Number(e.skillModifier) : ne(s);
  if (typeof t.onSuccess == "function" || typeof t.onFailure == "function") {
    const g = window.setTimeout(() => B.delete(e.requestId), ot);
    B.set(e.requestId, {
      onSuccess: typeof t.onSuccess == "function" ? t.onSuccess : null,
      onFailure: typeof t.onFailure == "function" ? t.onFailure : null,
      timeoutId: g
    });
  }
  return game.socket.emit(se, {
    type: "launch-request",
    payload: {
      ...e,
      actorId: (i == null ? void 0 : i.id) ?? "",
      actorName: (i == null ? void 0 : i.name) ?? (n == null ? void 0 : n.name) ?? "Hacker",
      skillLabel: r,
      skillModifier: a,
      gmUserId: game.user.id
    }
  }), console.log(`${m} | Sent hacking challenge`, {
    minigameType: e.minigameType,
    userId: e.userId,
    actorId: (i == null ? void 0 : i.id) ?? "",
    skillLabel: r,
    skillModifier: a
  }), (y = (f = ui.notifications) == null ? void 0 : f.info) == null || y.call(f, `${O(e.minigameType)} sent${n ? ` to ${n.name}` : " to players"}.`), !0;
}
function ht(t) {
  var e, n, i, s;
  try {
    if ((t == null ? void 0 : t.type) === "result-report") {
      mt(t.payload ?? {});
      return;
    }
    if ((t == null ? void 0 : t.type) !== "launch-request") return;
    const r = Pe(t.payload ?? {});
    if (r.userId && r.userId !== ((e = game.user) == null ? void 0 : e.id) || !r.userId && ((n = game.user) != null && n.isGM)) return;
    const a = ae(r.actorId, Z(r.userId) ?? game.user), o = r.actorName || (a == null ? void 0 : a.name) || "Intruder", c = r.skillLabel || W(r.skillId, Ne(a, r.skillId));
    new Dialog({
      title: O(r.minigameType),
      content: pt(r, o, c),
      buttons: {
        start: {
          icon: '<i class="fa-solid fa-terminal"></i>',
          label: "Accept and roll",
          callback: async () => ft(r)
        }
      },
      default: "start"
    }, {
      classes: ["holosuite-hacking-start-dialog"]
    }).render(!0);
  } catch (r) {
    console.error(`${m} | Failed to handle hacking launch request.`, r), (s = (i = ui.notifications) == null ? void 0 : i.error) == null || s.call(i, "HoloSuite Hacking launch failed. See console for details.");
  }
}
async function ft(t) {
  const e = ae(t.actorId, Z(t.userId) ?? game.user), n = await gt(t);
  if (!Number.isFinite(n == null ? void 0 : n.total)) return null;
  const i = {
    rollTotal: n.total,
    dc: t.dc,
    actorId: t.actorId,
    actorName: (e == null ? void 0 : e.name) ?? t.actorName ?? "Hacker",
    userId: t.userId,
    skillId: t.skillId,
    onSuccess: (s) => ge(t, s),
    onFailure: (s) => ge(t, s)
  };
  return console.log(`${m} | Starting player minigame`, {
    minigameType: t.minigameType,
    rollTotal: n.total,
    dc: t.dc
  }), t.minigameType === "signal-alignment" ? S.startSignalAlignment(i) : S.startNodeIntrusion(i);
}
async function gt(t) {
  var e, n;
  try {
    const i = Number(t.skillModifier ?? 0), s = `1d20 ${i >= 0 ? "+" : "-"} ${Math.abs(i)}`, r = await new Roll(s).evaluate({ async: !0 });
    return await r.toMessage({
      speaker: ChatMessage.getSpeaker(),
      flavor: `${w(O(t.minigameType))}: ${w(t.skillLabel || t.skillId || "Skill")} vs DC ${Number(t.dc)}`
    }), { total: Number(r.total), roll: r };
  } catch (i) {
    return console.error(`${m} | Fallback skill roll failed.`, i), (n = (e = ui.notifications) == null ? void 0 : e.warn) == null || n.call(e, "HoloSuite Hacking skill check failed."), null;
  }
}
function ge(t, e) {
  var n, i;
  console.log(`${m} | ${O(t.minigameType)} ${e.result}`, e), (i = (n = game.socket) == null ? void 0 : n.emit) == null || i.call(n, se, {
    type: "result-report",
    payload: {
      requestId: t.requestId,
      gmUserId: t.gmUserId,
      result: e
    }
  });
}
function mt(t = {}) {
  var i, s, r;
  if (!((i = game.user) != null && i.isGM) || t.gmUserId !== game.user.id) return;
  const e = B.get(t.requestId);
  B.delete(t.requestId), e != null && e.timeoutId && window.clearTimeout(e.timeoutId);
  const n = t.result ?? {};
  n.result === "success" ? (s = e == null ? void 0 : e.onSuccess) == null || s.call(e, n) : (r = e == null ? void 0 : e.onFailure) == null || r.call(e, n), console.log(`${m} | Player hacking result`, n);
}
function pt(t, e, n) {
  return `
    <section class="holosuite-hacking-start-prompt">
      <p>Incoming hacking challenge</p>
      <h2>${w(O(t.minigameType))}</h2>
      <div>${w(e)} rolls ${w(n)} vs DC ${Number(t.dc)}</div>
    </section>
  `;
}
function Pe(t = {}) {
  const e = Number(game.settings.get(m, "defaultDc") ?? 15);
  return {
    requestId: String(t.requestId ?? foundry.utils.randomID()),
    minigameType: String(t.minigameType ?? t.type ?? "node-intrusion"),
    userId: String(t.userId ?? ""),
    actorId: String(t.actorId ?? ""),
    actorName: String(t.actorName ?? ""),
    skillId: String(t.skillId ?? ""),
    skillLabel: String(t.skillLabel ?? ""),
    skillModifier: Number(t.skillModifier ?? 0),
    dc: Number(t.dc ?? e),
    gmUserId: String(t.gmUserId ?? "")
  };
}
function ae(t, e) {
  const n = H(t);
  if (n) return n;
  const i = F(e);
  if (i) return i;
  const s = te(e);
  if (s.length === 1) return s[0];
  const r = qe();
  return r && L(r, e) ? r : null;
}
function O(t) {
  var e, n;
  return ((n = (e = S == null ? void 0 : S.getMinigames) == null ? void 0 : e.call(S).find((i) => i.id === t)) == null ? void 0 : n.title) ?? String(t ?? "Hacking");
}
function Y() {
  var e, n;
  const t = ((e = game.modules.get("holosuite-core")) == null ? void 0 : e.api) ?? game.holosuite;
  return typeof (t == null ? void 0 : t.registerApp) != "function" ? !1 : ((n = t.unregisterApp) == null || n.call(t, "node-intrusion"), t.registerApp({
    id: m,
    title: "HoloSuite Hacking",
    icon: "fa-solid fa-terminal",
    premium: !1,
    featureId: m,
    playerVisible: !1,
    description: "Reusable hacking minigames for terminals, traces, and signal puzzles.",
    open: () => re()
  }), !0);
}
Hooks.once("init", () => {
  ct(), lt(), De();
});
Hooks.on("getSceneControlButtons", ut);
Hooks.once("ready", () => {
  var t, e;
  De(), (e = (t = game.socket) == null ? void 0 : t.on) == null || e.call(t, se, ht), Y(), window.setTimeout(() => Y(), 500), console.log(`${m} | Ready. API available at game.modules.get("${m}").api`), console.log(`${m} | Test with game.modules.get("${m}").api.testNodeIntrusion() or .testSignalAlignment()`);
});
