const N = {
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
function A(t) {
  return {
    ...t,
    ...t.nodeIntrusion,
    ...t.signalAlignment,
    allowMainPathFirewalls: t.nodeIntrusion.allowFirewallOnMainPath
  };
}
function _(t = 0, e = 10) {
  const n = Number(t) || 0, i = Number(e) || 10;
  return n <= i - 10 ? A(N.critical_failure) : n >= i + 10 ? A(N.critical_success) : n >= i + 5 ? A(N.strong_success) : n >= i ? A(N.success) : A(N.failure_but_playable);
}
const V = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map();
function ie(t) {
  const e = String((t == null ? void 0 : t.id) ?? "").trim();
  if (!e || typeof (t == null ? void 0 : t.create) != "function")
    throw new Error("HoloSuite Hacking minigames require an id and create(options) function.");
  V.set(e, {
    title: String(t.title ?? e),
    icon: String(t.icon ?? "fa-solid fa-terminal"),
    ...t,
    id: e
  });
}
function Ae(t) {
  return V.get(String(t ?? ""));
}
function $e() {
  return [...V.values()];
}
function Ce(t, e = {}) {
  var r, a, o, c, l;
  const n = Ae(t);
  if (!n)
    return (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, `Unknown HoloSuite hacking minigame: ${t}`), null;
  (c = (o = C.get(n.id)) == null ? void 0 : o.close) == null || c.call(o);
  const i = n.create(e);
  console.log("holosuite-hacking | Creating minigame app", {
    type: n.id,
    title: n.title,
    appClass: (l = i.constructor) == null ? void 0 : l.name
  });
  const s = i.close.bind(i);
  return i.close = async (...h) => (C.delete(n.id), s(...h)), C.set(n.id, i), i.render(!0), i;
}
function ke(t) {
  return t ? C.get(String(t)) ?? null : [...C.values()].at(-1) ?? null;
}
function De({ moduleId: t, openLauncher: e }) {
  function n(a) {
    const o = String(game.settings.get(t, "visualGlitchIntensity") ?? "medium"), c = Number(a.visualGlitchIntensity ?? 0.4), l = o === "low" ? Math.min(c, 0.25) : o === "high" ? Math.min(1, c + 0.2) : c;
    return { ...a, visualGlitchIntensity: l };
  }
  function i(a = {}) {
    const o = Number(game.settings.get(t, "defaultDc") ?? 15), c = Number(a.dc ?? o), l = Number(a.rollTotal ?? c), h = n(a.profile ?? _(l, c));
    return { ...a, dc: c, rollTotal: l, profile: h };
  }
  function s(a = {}) {
    const o = String(a.type ?? "node-intrusion");
    return Ce(o, i(a));
  }
  const r = {
    startHack: s,
    startNodeIntrusion: (a = {}) => s({ ...a, type: "node-intrusion" }),
    startSignalAlignment: (a = {}) => s({ ...a, type: "signal-alignment" }),
    openLauncher: e,
    getDifficultyProfile: _,
    difficultyProfiles: N,
    getMinigames: $e,
    getActiveApp: ke,
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
function S(t) {
  const e = document.createElement("div");
  return e.textContent = String(t ?? ""), e.innerHTML;
}
function W() {
  return Y().filter((e) => !e.isGM);
}
function Y() {
  var t;
  return Array.isArray(game.users) ? game.users : ((t = game.users) == null ? void 0 : t.contents) ?? [...game.users ?? []];
}
function X(t) {
  var n, i;
  const e = String(t ?? "");
  return ((i = (n = game.users) == null ? void 0 : n.get) == null ? void 0 : i.call(n, e)) ?? Y().find((s) => s.id === e) ?? null;
}
function J() {
  var t;
  return Array.isArray(game.actors) ? game.actors : ((t = game.actors) == null ? void 0 : t.contents) ?? [...game.actors ?? []];
}
function k(t) {
  var n, i;
  const e = String(t ?? "");
  return ((i = (n = game.actors) == null ? void 0 : n.get) == null ? void 0 : i.call(n, e)) ?? J().find((s) => s.id === e || s.uuid === e) ?? null;
}
function D(t) {
  const e = t == null ? void 0 : t.character;
  return e ? typeof e == "string" ? k(e) : e : null;
}
function x(t, e) {
  var s, r, a, o;
  if (!t || !e) return !1;
  if (t === D(e) || (s = t.testUserPermission) != null && s.call(t, e, "OWNER")) return !0;
  const n = ((a = (r = globalThis.CONST) == null ? void 0 : r.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3, i = t.ownership ?? ((o = t.data) == null ? void 0 : o.permission) ?? {};
  return Number(i[e.id] ?? i.default ?? 0) >= n;
}
function xe() {
  var t, e, n;
  return ((n = (e = (t = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : t.controlled) == null ? void 0 : e[0]) == null ? void 0 : n.actor) ?? null;
}
function Q(t) {
  const e = D(t) ? [D(t)] : [], n = J().filter((s) => x(s, t));
  return [...new Map([...e, ...n].filter(Boolean).map((s) => [s.id, s])).values()].sort((s, r) => s.name.localeCompare(r.name));
}
function se(t = "") {
  const e = W(), n = e.find((s) => s.id === t);
  return (n ? Q(n) : J()).filter((s) => !n || x(s, n)).map((s) => ({
    id: s.id,
    name: s.name,
    owners: e.filter((r) => x(s, r))
  })).sort((s, r) => s.name.localeCompare(r.name));
}
const Pe = {
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
function re(t) {
  var n;
  const e = (n = t == null ? void 0 : t.system) == null ? void 0 : n.skills;
  if (e && typeof e == "object") {
    const i = Object.entries(e).map(([s, r]) => ({
      id: s,
      name: z(s, r),
      label: He(s, r),
      modifier: Z(r)
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
function be(t, e) {
  var n, i;
  return ((i = (n = t == null ? void 0 : t.system) == null ? void 0 : n.skills) == null ? void 0 : i[e]) ?? null;
}
function z(t, e) {
  const n = String((e == null ? void 0 : e.label) ?? (e == null ? void 0 : e.name) ?? (e == null ? void 0 : e.localizedName) ?? t ?? "Skill").trim(), i = n.toLowerCase().replace(/[^a-z0-9]/g, "");
  return String(Pe[i] ?? n).replace(/[_-]/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
}
function Z(t) {
  var s, r, a, o, c, l, h, d, y, I;
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
    (d = t == null ? void 0 : t.roll) == null ? void 0 : d.mod,
    (y = t == null ? void 0 : t.roll) == null ? void 0 : y.total,
    t == null ? void 0 : t.rank,
    t == null ? void 0 : t.ranks
  ].find((m) => Number.isFinite(Number(m)));
  if (n !== void 0) return Number(n);
  const i = [];
  return we(t, i, 0), i.sort((m, M) => M.score - m.score), Number(((I = i[0]) == null ? void 0 : I.value) ?? 0);
}
function He(t, e) {
  const n = z(t, e), i = Z(e), s = i >= 0 ? "+" : "-";
  return `${n} (${s}${Math.abs(i)})`;
}
function we(t, e, n, i = "") {
  if (!(!t || typeof t != "object" || n > 4))
    for (const [s, r] of Object.entries(t)) {
      const a = i ? `${i}.${s}` : s, o = Number(r);
      if (Number.isFinite(o)) {
        const c = a.toLowerCase();
        let l = 1;
        /(total|mod|modifier|bonus|check|roll|value)$/.test(c) && (l += 6), /(dc|rank|ranks|proficient|prof|trained|ability|base|label|name)/.test(c) && (l -= 4), Math.abs(o) > 30 && (l -= 5), e.push({ value: o, score: l, path: a });
      } else r && typeof r == "object" && we(r, e, n + 1, a);
    }
}
const $ = "holosuite-hacking", Fe = `modules/${$}/templates/hacking-launcher.html`;
var le, ue, de;
const Le = globalThis.Application ?? ((de = (ue = (le = globalThis.foundry) == null ? void 0 : le.appv1) == null ? void 0 : ue.api) == null ? void 0 : de.Application);
class Oe extends Le {
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
      template: Fe
    });
  }
  getData() {
    const e = Number(game.settings.get($, "defaultDc") ?? 15), n = W(), i = n[0] ?? null, s = se(i == null ? void 0 : i.id), r = s.length ? k(s[0].id) : null;
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
      skills: re(r)
    };
  }
  activateListeners(e) {
    super.activateListeners(e);
    const n = e.is("form") ? e[0] : e.find("form")[0];
    e.find("[data-action='start']").on("click", (s) => {
      s.preventDefault(), this.submit(n);
    }), (e.is("form") ? e : e.find("form")).on("submit", (s) => {
      s.preventDefault(), this.submit(s.currentTarget);
    }), e.find("[name='actorId']").on("change", (s) => {
      this.syncUserToActor(e, s.currentTarget.value), this.syncSkillOptions(e, s.currentTarget.value);
    }), e.find("[name='userId']").on("change", (s) => {
      this.syncActorsForUser(e, s.currentTarget.value);
    }), this.syncSkillOptions(e, e.find("[name='actorId']").val());
  }
  submit(e) {
    var u, f, w, p, H, F;
    if (!((u = game.user) != null && u.isGM)) {
      (w = (f = ui.notifications) == null ? void 0 : f.warn) == null || w.call(f, "Only the GM can open the HoloSuite Hacking launcher.");
      return;
    }
    if (!e) {
      (H = (p = ui.notifications) == null ? void 0 : p.error) == null || H.call(p, "HoloSuite Hacking launcher form was not found."), console.error(`${$} | Launcher form was not found.`);
      return;
    }
    const n = e.querySelector("[name='minigameType']"), i = e.querySelector("[name='actorId']"), s = e.querySelector("[name='userId']"), r = e.querySelector("[name='skillId']"), a = e.querySelector("[name='dc']"), o = ((F = r == null ? void 0 : r.selectedOptions) == null ? void 0 : F[0]) ?? null, c = String((n == null ? void 0 : n.value) || "node-intrusion"), l = String((i == null ? void 0 : i.value) || ""), h = String((s == null ? void 0 : s.value) || ""), d = String((r == null ? void 0 : r.value) || ""), y = String((o == null ? void 0 : o.dataset.skillLabel) || (o == null ? void 0 : o.textContent) || d || "Skill"), I = Number((o == null ? void 0 : o.dataset.skillModifier) ?? 0), m = Number((a == null ? void 0 : a.value) ?? 15);
    this.api.sendHackToPlayer({
      minigameType: c,
      actorId: l,
      userId: h,
      skillId: d,
      skillLabel: y,
      skillModifier: I,
      dc: m,
      onSuccess: (T) => console.log(`${$} | Test success callback`, T),
      onFailure: (T) => console.log(`${$} | Test failure callback`, T)
    }) && this.close();
  }
  syncUserToActor(e, n) {
    const i = k(n), s = W().find((r) => i == null ? void 0 : i.testUserPermission(r, "OWNER"));
    s && e.find("[name='userId']").val(s.id);
  }
  syncSkillOptions(e, n) {
    const i = k(n), s = re(i);
    e.find("[name='skillId']").html(s.map((r) => `<option value="${S(r.id)}" data-skill-label="${S(r.name ?? r.label)}" data-skill-modifier="${Number(r.modifier ?? 0)}">${S(r.label)}</option>`).join(""));
  }
  syncActorsForUser(e, n) {
    const i = se(n), s = i.length ? i.map((r) => `<option value="${S(r.id)}">${S(r.name)} (${S(r.owners.map((a) => a.name).join(", ") || "No owner")})</option>`).join("") : '<option value="">Use assigned character</option>';
    e.find("[name='actorId']").html(s), this.syncSkillOptions(e, e.find("[name='actorId']").val());
  }
}
async function Ie({ title: t, result: e, actorName: n, message: i, rollTotal: s, dc: r }) {
  const a = e === "success", o = a ? "#38f28f" : "#ff477e", c = a ? "HACK SUCCESS" : "HACK FAILED", l = i || (a ? "Objective completed." : "Trace or countermeasure completed."), h = Number.isFinite(Number(s)) && Number.isFinite(Number(r)) ? `<p style="margin: 4px 0 0; color: #bdeff6;">Roll ${Number(s)} vs DC ${Number(r)}</p>` : "", d = `
    <div class="holosuite-hacking-chat-result" style="border-left: 4px solid ${o}; padding: 8px 10px; background: rgba(5, 8, 14, 0.88); color: ${o};">
      <strong>${L(c)} // ${L(t)} // ${L(n || "Hacker")}</strong>
      <p style="margin: 6px 0 0; color: ${o};">${L(l)}</p>
      ${h}
    </div>
  `;
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content: d
  });
}
function L(t) {
  const e = document.createElement("div");
  return e.textContent = String(t ?? ""), e.innerHTML;
}
function v(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function Ee(t) {
  const e = String(t ?? "node-intrusion");
  let n = 2166136261;
  for (let i = 0; i < e.length; i += 1)
    n ^= e.charCodeAt(i), n = Math.imul(n, 16777619);
  return n >>> 0;
}
function Re(t) {
  let e = Ee(t);
  return () => {
    e += 1831565813;
    let n = e;
    return n = Math.imul(n ^ n >>> 15, n | 1), n ^= n + Math.imul(n ^ n >>> 7, n | 61), ((n ^ n >>> 14) >>> 0) / 4294967296;
  };
}
function O(t, e) {
  return t.length ? t[Math.floor(e() * t.length)] : null;
}
function E(t, e, n) {
  const i = t.find((r) => r.id === e), s = t.find((r) => r.id === n);
  !i || !s || (i.connected.includes(n) || i.connected.push(n), s.connected.includes(e) || s.connected.push(e));
}
function j(t, e) {
  return [t, e].sort().join("--");
}
function B(t, e, n, i) {
  return {
    id: t,
    x: v(Math.round(n), 6, 94),
    y: v(Math.round(i), 10, 90),
    type: e,
    connected: [],
    revealed: e === "start" || e === "target",
    visited: !1
  };
}
function qe(t) {
  for (let e = 0; e < 18; e += 1)
    for (let n = 0; n < t.length; n += 1)
      for (let i = n + 1; i < t.length; i += 1) {
        const s = t[n], r = t[i], a = r.x - s.x, o = r.y - s.y, c = Math.sqrt(a * a + o * o) || 1;
        if (c >= 13) continue;
        const l = (13 - c) * 0.35, h = a / c * l, d = o / c * l;
        s.type !== "start" && s.type !== "target" && (s.x = v(s.x - h, 6, 94), s.y = v(s.y - d, 10, 90)), r.type !== "start" && r.type !== "target" && (r.x = v(r.x + h, 6, 94), r.y = v(r.y + d, 10, 90));
      }
}
function ae(t, e = Date.now()) {
  var I, m, M;
  const n = Re(e), i = Math.max(6, Number(t.nodeCount ?? ((I = t.nodeIntrusion) == null ? void 0 : I.nodeCount)) || 10), s = v(Number(t.decoyCount ?? ((m = t.nodeIntrusion) == null ? void 0 : m.decoyCount)) || 0, 0, i - 4), r = Math.max(0, i - s), a = v(Math.round(r * 0.55), 5, r), o = [], c = [];
  for (let u = 0; u < a; u += 1) {
    const f = u === 0 ? "start" : u === a - 1 ? "target" : `node-${u}`, w = u === 0 ? "start" : u === a - 1 ? "target" : "normal", p = u / Math.max(1, a - 1), H = Math.sin(p * Math.PI * 1.35) * 12, F = (n() - 0.5) * 7, T = (n() - 0.5) * 18;
    o.push(B(f, w, 10 + p * 80 + F, 52 + H + T)), c.push(f), u > 0 && E(o, c[u - 1], f);
  }
  let l = a;
  for (; o.length < i - s; ) {
    const u = O(o.filter((p) => p.type !== "target"), n) ?? o[0], f = `node-${l}`;
    l += 1, o.push(B(f, "normal", u.x + (n() - 0.35) * 28, u.y + (n() - 0.5) * 34)), E(o, u.id, f);
    const w = O(o.filter((p) => p.id !== f && p.id !== u.id && p.type !== "start"), n);
    w && n() > 0.45 && E(o, f, w.id);
  }
  for (let u = 0; u < s; u += 1) {
    const f = O(o.filter((p) => p.type !== "target" && p.type !== "decoy"), n) ?? o[0], w = `decoy-${u + 1}`;
    o.push(B(w, "decoy", f.x + (n() - 0.5) * 24, f.y + (n() - 0.5) * 30)), E(o, f.id, w);
  }
  const h = t.allowFirewallOnMainPath ?? t.allowMainPathFirewalls ?? !1, d = o.filter((u) => u.type === "start" || u.type === "target" || u.type === "decoy" ? !1 : h || !c.includes(u.id)), y = v(Number(t.firewallCount ?? ((M = t.nodeIntrusion) == null ? void 0 : M.firewallCount)) || 0, 0, d.length);
  for (let u = 0; u < y; u += 1) {
    const f = d.filter((p) => p.type !== "firewall"), w = O(f, n);
    if (!w) break;
    w.type = "firewall";
  }
  return qe(o), {
    nodes: o,
    edges: o.flatMap((u) => u.connected.filter((f) => u.id < f).map((f) => ({ from: u.id, to: f }))),
    startNodeId: "start",
    targetNodeId: "target",
    mainPathIds: c
  };
}
const Se = "holosuite-hacking", _e = `modules/${Se}/templates/node-intrusion.html`;
var he, fe, ge;
const Ge = globalThis.Application ?? ((ge = (fe = (he = globalThis.foundry) == null ? void 0 : he.appv1) == null ? void 0 : fe.api) == null ? void 0 : ge.Application);
function Ue(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
class ze extends Ge {
  constructor(e = {}) {
    super(e), this.rollTotal = Number(e.rollTotal ?? 15), this.dc = Number(e.dc ?? 15), this.profile = e.profile ? { ...e.profile } : _(this.rollTotal, this.dc), this.seed = e.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}`, this.onSuccess = typeof e.onSuccess == "function" ? e.onSuccess : null, this.onFailure = typeof e.onFailure == "function" ? e.onFailure : null, this.actorName = String(e.actorName ?? "Hacker"), this.chatOnResult = e.chatOnResult !== !1, this.graph = ae(this.profile, this.seed), this.state = {
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
      template: _e
    });
  }
  getData() {
    const e = this.graph.nodes.map((n) => ({
      ...n,
      isCurrent: n.id === this.state.currentNodeId,
      isVisited: this.state.visitedNodeIds.has(n.id),
      isNeighbor: this.getCurrentNode().connected.includes(n.id),
      isDangerVisible: this.profile.hintsEnabled || n.revealed || this.state.visitedNodeIds.has(n.id)
    }));
    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      nodes: e,
      edges: this.graph.edges.map((n) => {
        const i = e.find((o) => o.id === n.from), s = e.find((o) => o.id === n.to), r = this.getCurrentNode().connected, a = this.state.blockedEdgeIds.get(j(n.from, n.to));
        return {
          ...n,
          from: i,
          to: s,
          isVisitedPath: this.state.traversedEdgeIds.has(j(n.from, n.to)),
          isAvailable: !a && (r.includes(n.from) || r.includes(n.to)),
          isBlocked: !!a,
          isFirewallPath: a === "firewall",
          isDecoyPath: a === "decoy"
        };
      }),
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
    super.activateListeners(e), e.find("[data-node-id]").on("click", (n) => this.handleNodeClick(n.currentTarget.dataset.nodeId)), e.find("[data-action='abort']").on("click", () => this.finish("failure", "Manual disconnect")), e.find("[data-action='restart']").on("click", () => this.restart()), this.syncDom();
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
    const n = this.getCurrentNode(), i = this.graph.nodes.find((d) => d.id === e);
    if (!i) return;
    if (!n.connected.includes(e)) {
      (r = this.element) == null || r.find(".node-intrusion-shell").addClass("invalid-pulse"), window.setTimeout(() => {
        var d;
        return (d = this.element) == null ? void 0 : d.find(".node-intrusion-shell").removeClass("invalid-pulse");
      }, 280);
      return;
    }
    const s = j(n.id, e);
    if (this.state.blockedEdgeIds.has(s) || this.state.deadNodeIds.has(e)) {
      (a = this.element) == null || a.find(".node-intrusion-shell").addClass("invalid-pulse"), window.setTimeout(() => {
        var d;
        return (d = this.element) == null ? void 0 : d.find(".node-intrusion-shell").removeClass("invalid-pulse");
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
    this.stopTimer(), this.graph = ae(this.profile, `${this.seed}:${Date.now()}`), this.state = {
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
    const e = Number(game.settings.get(Se, "traceDurationMultiplier") ?? 1) || 1, n = Math.max(5, this.profile.traceDurationSeconds * e);
    this.timer = window.setInterval(() => {
      if (!this.state.isRunning) return;
      const i = (performance.now() - this.startedAt) / 1e3;
      this.state.traceProgress = Ue(i / n * 100, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
    }, 120);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async finish(e, n) {
    var s, r;
    if (!this.state.isRunning && this.state.result) return;
    this.state.isRunning = !1, this.state.result = e, this.stopTimer(), this.resultMessage = n, this.syncDom(), await this.render(!1);
    const i = {
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
    this.chatOnResult && await Ie({
      title: "Node Intrusion",
      result: e,
      actorName: this.actorName,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), e === "success" ? (s = this.onSuccess) == null || s.call(this, i) : (r = this.onFailure) == null || r.call(this, i);
  }
  syncDom() {
    var r;
    const e = (r = this.element) == null ? void 0 : r[0];
    if (!e) return;
    const n = e.querySelector("[data-trace-fill]"), i = e.querySelector("[data-trace-text]"), s = e.querySelector("[data-mistake-text]");
    n && (n.style.width = `${this.state.traceProgress}%`), i && (i.textContent = `${Math.round(this.state.traceProgress)}%`), s && (s.textContent = `${this.state.mistakes}/${this.profile.maxMistakes}`);
  }
}
function ve(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function je(t) {
  const e = String(t ?? "signal-alignment");
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
function G(t) {
  return ve(Number(t) || 0, 0, 100);
}
function oe(t, e = Date.now()) {
  var a, o, c;
  const n = Be(e), i = ve(Number(t.channelCount ?? ((a = t.signalAlignment) == null ? void 0 : a.channelCount)) || 3, 2, 5), s = Number(t.tolerance ?? ((o = t.signalAlignment) == null ? void 0 : o.tolerance) ?? 5), r = Number(t.decoyFrequencies ?? ((c = t.signalAlignment) == null ? void 0 : c.decoyFrequencies) ?? 0);
  return Array.from({ length: i }, (l, h) => {
    const d = Math.round(18 + n() * 64), y = n() > 0.5 ? 1 : -1, I = s + 8 + Math.round(n() * 18), m = n() > 0.5 ? 1 : -1, M = Array.from({ length: r }, () => G(d + (n() > 0.5 ? 1 : -1) * (s + 9 + n() * 18)));
    return {
      id: `channel-${h + 1}`,
      label: `CH-${String(h + 1).padStart(2, "0")}`,
      value: G(d + y * I),
      target: d,
      tolerance: s,
      driftDirection: m,
      decoys: M
    };
  });
}
const Me = "holosuite-hacking", We = `modules/${Me}/templates/signal-alignment.html`;
var me, pe, ye;
const Ke = globalThis.Application ?? ((ye = (pe = (me = globalThis.foundry) == null ? void 0 : me.appv1) == null ? void 0 : pe.api) == null ? void 0 : ye.Application);
function R(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
class Ve extends Ke {
  constructor(e = {}) {
    super(e), this.rollTotal = Number(e.rollTotal ?? 15), this.dc = Number(e.dc ?? 15), this.profile = e.profile ? { ...e.profile } : _(this.rollTotal, this.dc), this.seed = e.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}:signal`, this.onSuccess = typeof e.onSuccess == "function" ? e.onSuccess : null, this.onFailure = typeof e.onFailure == "function" ? e.onFailure : null, this.actorName = String(e.actorName ?? "Hacker"), this.chatOnResult = e.chatOnResult !== !1, this.channels = oe(this.profile, this.seed), this.state = {
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
      template: We
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
        toleranceLeft: R(n.target - n.tolerance, 0, 100),
        toleranceWidth: R(n.tolerance * 2, 1, 100)
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
    super.activateListeners(e), e.find("[data-channel-slider]").on("input", (n) => this.handleSlider(n.currentTarget)), e.find("[data-action='abort']").on("click", () => this.finish("failure", "Manual disconnect")), e.find("[data-action='restart']").on("click", () => this.restart()), this.syncDom();
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
    n && (n.value = G(e.value), this.checkDestabilization(), this.syncDom());
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
    this.stopTimer(), this.channels = oe(this.profile, `${this.seed}:${Date.now()}`), this.state = {
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
    const e = Number(game.settings.get(Me, "traceDurationMultiplier") ?? 1) || 1, n = Math.max(5, this.profile.traceDurationSeconds * e);
    this.timer = window.setInterval(() => {
      if (!this.state.isRunning) return;
      const i = performance.now(), s = Math.min(0.5, (i - this.lastTickAt) / 1e3);
      this.lastTickAt = i, this.applyDrift(s);
      const r = this.areAllChannelsAligned();
      this.state.lockProgress = r ? R(this.state.lockProgress + s / this.profile.lockHoldSeconds, 0, 1) : 0, this.wasAligned && !r && (this.state.mistakes += 1, this.state.destabilizations += 1), this.wasAligned = r;
      const a = (i - this.startedAt) / 1e3;
      this.state.traceProgress = R(a / n * 100, 0, 100), this.syncDom(), this.state.lockProgress >= 1 ? this.finish("success", "Transmission Decrypted") : this.state.traceProgress >= 100 ? this.finish("failure", "Trace Complete") : this.state.mistakes > this.profile.maxMistakes && this.finish("failure", "Signal destabilized too often");
    }, 120);
  }
  applyDrift(e) {
    const n = Number(this.profile.signalDriftSpeed ?? 0);
    if (!(n <= 0))
      for (const i of this.channels)
        i.value = G(i.value + i.driftDirection * n * e), (i.value <= 0 || i.value >= 100) && (i.driftDirection *= -1);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async finish(e, n) {
    var s, r;
    if (!this.state.isRunning && this.state.result) return;
    this.state.isRunning = !1, this.state.result = e, this.stopTimer(), this.resultMessage = n, this.syncDom(), await this.render(!1);
    const i = {
      type: "signal-alignment",
      result: e,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      traceProgress: this.state.traceProgress,
      lockProgress: this.state.lockProgress,
      channels: this.channels.map((a) => ({ ...a }))
    };
    this.chatOnResult && await Ie({
      title: "Signal Alignment",
      result: e,
      actorName: this.actorName,
      message: n,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), e === "success" ? (s = this.onSuccess) == null || s.call(this, i) : (r = this.onFailure) == null || r.call(this, i);
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
      const d = l.querySelector("[data-channel-slider]");
      d && document.activeElement !== d && (d.value = c.value);
      const y = l.querySelector("[data-wave-fill]");
      y && (y.style.width = `${c.value}%`);
    }
  }
}
const g = "holosuite-hacking", ee = `module.${g}`, Ye = 10 * 60 * 1e3;
let b = null, q = null;
const U = /* @__PURE__ */ new Map();
function Xe() {
  game.settings.register(g, "defaultDc", {
    name: "Default Hacking DC",
    hint: "Used by the GM launcher and API calls that omit a DC.",
    scope: "world",
    config: !0,
    type: Number,
    default: 15
  }), game.settings.register(g, "traceDurationMultiplier", {
    name: "Default Trace Duration Multiplier",
    hint: "Multiplies trace timers for all HoloSuite hacking minigames.",
    scope: "world",
    config: !0,
    type: Number,
    default: 1
  }), game.settings.register(g, "allowPlayerInteraction", {
    name: "Allow Players To Interact Directly",
    hint: "Reserved for future player-targeted play. The GM launcher remains GM-only for now.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(g, "visualGlitchIntensity", {
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
function Je() {
  ie({
    id: "node-intrusion",
    title: "Node Intrusion",
    icon: "fa-solid fa-network-wired",
    create: (t) => new ze(t)
  }), ie({
    id: "signal-alignment",
    title: "Signal Alignment",
    icon: "fa-solid fa-wave-square",
    create: (t) => new Ve(t)
  });
}
function te() {
  var t, e, n;
  return (t = game.user) != null && t.isGM ? (q = q ?? new Oe({ api: b }), q.render(!0), q) : ((n = (e = ui.notifications) == null ? void 0 : e.warn) == null || n.call(e, "Only the GM can open HoloSuite Hacking."), null);
}
function Qe(t) {
  var r, a, o;
  if (!((r = game.user) != null && r.isGM)) return;
  const e = () => te(), n = {
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
function Ne() {
  b = b ?? De({ moduleId: g, openLauncher: te }), b.sendHackToPlayer = Ze, b.registerWithHoloSuite = K;
  const t = game.modules.get(g);
  return t && (t.api = b), game.holosuiteHacking = b, b;
}
function Ze(t = {}) {
  var o, c, l, h, d, y, I;
  if (!((o = game.user) != null && o.isGM))
    return (l = (c = ui.notifications) == null ? void 0 : c.warn) == null || l.call(c, "Only the GM can send HoloSuite hacking challenges."), !1;
  if (!game.socket)
    return (d = (h = ui.notifications) == null ? void 0 : h.error) == null || d.call(h, "Foundry sockets are not available."), !1;
  const e = Te(t), n = X(e.userId), i = ne(e.actorId, n);
  i ? n && !x(i, n) && console.warn(`${g} | ${n.name} does not appear to own ${i.name}; sending fallback roll data anyway.`) : console.warn(`${g} | Could not resolve hacker actor.`, {
    actorId: e.actorId,
    userId: e.userId,
    availableUsers: Y().map((m) => ({ id: m.id, name: m.name, isGM: m.isGM })),
    userCharacter: D(n),
    ownedActors: Q(n).map((m) => ({ id: m.id, name: m.name }))
  });
  const s = be(i, e.skillId), r = e.skillLabel || z(e.skillId, s), a = Number.isFinite(Number(e.skillModifier)) && Number(e.skillModifier) !== 0 ? Number(e.skillModifier) : Z(s);
  if (typeof t.onSuccess == "function" || typeof t.onFailure == "function") {
    const m = window.setTimeout(() => U.delete(e.requestId), Ye);
    U.set(e.requestId, {
      onSuccess: typeof t.onSuccess == "function" ? t.onSuccess : null,
      onFailure: typeof t.onFailure == "function" ? t.onFailure : null,
      timeoutId: m
    });
  }
  return game.socket.emit(ee, {
    type: "launch-request",
    payload: {
      ...e,
      actorId: (i == null ? void 0 : i.id) ?? "",
      actorName: (i == null ? void 0 : i.name) ?? (n == null ? void 0 : n.name) ?? "Hacker",
      skillLabel: r,
      skillModifier: a,
      gmUserId: game.user.id
    }
  }), console.log(`${g} | Sent hacking challenge`, {
    minigameType: e.minigameType,
    userId: e.userId,
    actorId: (i == null ? void 0 : i.id) ?? "",
    skillLabel: r,
    skillModifier: a
  }), (I = (y = ui.notifications) == null ? void 0 : y.info) == null || I.call(y, `${P(e.minigameType)} sent${n ? ` to ${n.name}` : " to players"}.`), !0;
}
function et(t) {
  var e, n, i, s;
  try {
    if ((t == null ? void 0 : t.type) === "result-report") {
      it(t.payload ?? {});
      return;
    }
    if ((t == null ? void 0 : t.type) !== "launch-request") return;
    const r = Te(t.payload ?? {});
    if (r.userId && r.userId !== ((e = game.user) == null ? void 0 : e.id) || !r.userId && ((n = game.user) != null && n.isGM)) return;
    const a = ne(r.actorId, X(r.userId) ?? game.user), o = r.actorName || (a == null ? void 0 : a.name) || "Intruder", c = r.skillLabel || z(r.skillId, be(a, r.skillId));
    new Dialog({
      title: P(r.minigameType),
      content: st(r, o, c),
      buttons: {
        start: {
          icon: '<i class="fa-solid fa-terminal"></i>',
          label: "Accept and roll",
          callback: async () => tt(r)
        }
      },
      default: "start"
    }, {
      classes: ["holosuite-hacking-start-dialog"]
    }).render(!0);
  } catch (r) {
    console.error(`${g} | Failed to handle hacking launch request.`, r), (s = (i = ui.notifications) == null ? void 0 : i.error) == null || s.call(i, "HoloSuite Hacking launch failed. See console for details.");
  }
}
async function tt(t) {
  const e = ne(t.actorId, X(t.userId) ?? game.user), n = await nt(t);
  if (!Number.isFinite(n == null ? void 0 : n.total)) return null;
  const i = {
    rollTotal: n.total,
    dc: t.dc,
    actorId: t.actorId,
    actorName: (e == null ? void 0 : e.name) ?? t.actorName ?? "Hacker",
    userId: t.userId,
    skillId: t.skillId,
    onSuccess: (s) => ce(t, s),
    onFailure: (s) => ce(t, s)
  };
  return console.log(`${g} | Starting player minigame`, {
    minigameType: t.minigameType,
    rollTotal: n.total,
    dc: t.dc
  }), t.minigameType === "signal-alignment" ? b.startSignalAlignment(i) : b.startNodeIntrusion(i);
}
async function nt(t) {
  var e, n;
  try {
    const i = Number(t.skillModifier ?? 0), s = `1d20 ${i >= 0 ? "+" : "-"} ${Math.abs(i)}`, r = await new Roll(s).evaluate({ async: !0 });
    return await r.toMessage({
      speaker: ChatMessage.getSpeaker(),
      flavor: `${S(P(t.minigameType))}: ${S(t.skillLabel || t.skillId || "Skill")} vs DC ${Number(t.dc)}`
    }), { total: Number(r.total), roll: r };
  } catch (i) {
    return console.error(`${g} | Fallback skill roll failed.`, i), (n = (e = ui.notifications) == null ? void 0 : e.warn) == null || n.call(e, "HoloSuite Hacking skill check failed."), null;
  }
}
function ce(t, e) {
  var n, i;
  console.log(`${g} | ${P(t.minigameType)} ${e.result}`, e), (i = (n = game.socket) == null ? void 0 : n.emit) == null || i.call(n, ee, {
    type: "result-report",
    payload: {
      requestId: t.requestId,
      gmUserId: t.gmUserId,
      result: e
    }
  });
}
function it(t = {}) {
  var i, s, r;
  if (!((i = game.user) != null && i.isGM) || t.gmUserId !== game.user.id) return;
  const e = U.get(t.requestId);
  U.delete(t.requestId), e != null && e.timeoutId && window.clearTimeout(e.timeoutId);
  const n = t.result ?? {};
  n.result === "success" ? (s = e == null ? void 0 : e.onSuccess) == null || s.call(e, n) : (r = e == null ? void 0 : e.onFailure) == null || r.call(e, n), console.log(`${g} | Player hacking result`, n);
}
function st(t, e, n) {
  return `
    <section class="holosuite-hacking-start-prompt">
      <p>Incoming hacking challenge</p>
      <h2>${S(P(t.minigameType))}</h2>
      <div>${S(e)} rolls ${S(n)} vs DC ${Number(t.dc)}</div>
    </section>
  `;
}
function Te(t = {}) {
  const e = Number(game.settings.get(g, "defaultDc") ?? 15);
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
function ne(t, e) {
  const n = k(t);
  if (n) return n;
  const i = D(e);
  if (i) return i;
  const s = Q(e);
  if (s.length === 1) return s[0];
  const r = xe();
  return r && x(r, e) ? r : null;
}
function P(t) {
  var e, n;
  return ((n = (e = b == null ? void 0 : b.getMinigames) == null ? void 0 : e.call(b).find((i) => i.id === t)) == null ? void 0 : n.title) ?? String(t ?? "Hacking");
}
function K() {
  var e, n;
  const t = ((e = game.modules.get("holosuite-core")) == null ? void 0 : e.api) ?? game.holosuite;
  return typeof (t == null ? void 0 : t.registerApp) != "function" ? !1 : ((n = t.unregisterApp) == null || n.call(t, "node-intrusion"), t.registerApp({
    id: g,
    title: "HoloSuite Hacking",
    icon: "fa-solid fa-terminal",
    premium: !1,
    featureId: g,
    description: "Reusable hacking minigames for terminals, traces, and signal puzzles.",
    open: () => te()
  }), !0);
}
Hooks.once("init", () => {
  Xe(), Je(), Ne();
});
Hooks.on("getSceneControlButtons", Qe);
Hooks.once("ready", () => {
  var t, e;
  Ne(), (e = (t = game.socket) == null ? void 0 : t.on) == null || e.call(t, ee, et), K(), window.setTimeout(() => K(), 500), console.log(`${g} | Ready. API available at game.modules.get("${g}").api`), console.log(`${g} | Test with game.modules.get("${g}").api.testNodeIntrusion() or .testSignalAlignment()`);
});
