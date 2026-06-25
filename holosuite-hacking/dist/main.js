var Ze = Object.defineProperty;
var et = (t, n, e) => n in t ? Ze(t, n, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[n] = e;
var p = (t, n, e) => et(t, typeof n != "symbol" ? n + "" : n, e);
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
    }
  }
};
function H(t) {
  return {
    ...t,
    ...t.nodeIntrusion,
    ...t.signalAlignment,
    allowMainPathFirewalls: t.nodeIntrusion.allowFirewallOnMainPath
  };
}
function ae(t = 0, n = 10, e = null) {
  const i = Number(t) || 0, r = Number(n) || 10, a = Number(e);
  return a === 1 ? H(O.critical_failure) : a === 20 ? H(O.critical_success) : i <= r - 10 ? H(O.critical_failure) : i >= r + 10 ? H(O.critical_success) : i >= r + 5 ? H(O.strong_success) : i >= r ? H(O.success) : H(O.failure_but_playable);
}
const ye = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map();
function Pe(t) {
  const n = String((t == null ? void 0 : t.id) ?? "").trim();
  if (!n || typeof (t == null ? void 0 : t.create) != "function")
    throw new Error("HoloSuite Hacking minigames require an id and create(options) function.");
  ye.set(n, {
    title: String(t.title ?? n),
    icon: String(t.icon ?? "fa-solid fa-terminal"),
    ...t,
    id: n
  });
}
function tt(t) {
  return ye.get(String(t ?? ""));
}
function nt() {
  return [...ye.values()];
}
function it(t, n = {}) {
  var a, s, o, l;
  const e = tt(t);
  if (!e)
    return (s = (a = ui.notifications) == null ? void 0 : a.warn) == null || s.call(a, `Unknown HoloSuite hacking minigame: ${t}`), null;
  (l = (o = z.get(e.id)) == null ? void 0 : o.close) == null || l.call(o);
  const i = e.create(n), r = i.close.bind(i);
  return i.close = async (...c) => (z.delete(e.id), r(...c)), z.set(e.id, i), i.render(!0), i;
}
function rt(t) {
  return t ? z.get(String(t)) ?? null : [...z.values()].at(-1) ?? null;
}
function te(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function Le(t, n) {
  if (!te(n)) return t;
  const e = { ...t };
  for (const [i, r] of Object.entries(n))
    e[i] = te(r) && te(e[i]) ? Le(e[i], r) : r;
  return e;
}
function at(t) {
  var n;
  return {
    ...t,
    ...t.nodeIntrusion ?? {},
    ...t.signalAlignment ?? {},
    allowMainPathFirewalls: ((n = t.nodeIntrusion) == null ? void 0 : n.allowFirewallOnMainPath) ?? t.allowMainPathFirewalls
  };
}
function st(t) {
  var e, i;
  const n = String(game.settings.get(t, "difficultyProfileOverrides") ?? "").trim();
  if (!n) return {};
  try {
    const r = JSON.parse(n);
    return te(r) ? r : {};
  } catch (r) {
    return console.warn(`${t} | Difficulty profile overrides must be valid JSON.`, r), (i = (e = ui.notifications) == null ? void 0 : e.warn) == null || i.call(e, "HoloSuite Hacking difficulty profile overrides contain invalid JSON."), {};
  }
}
function ot({ moduleId: t, openLauncher: n }) {
  function e(o) {
    const l = String(o.profileId ?? o.id ?? ""), u = st(t)[l], d = at(Le(o, u)), f = Number(game.settings.get(t, "nodeTakeoverDurationSeconds") ?? 0);
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
    const l = String(game.settings.get(t, "visualGlitchIntensity") ?? "medium"), c = Number(o.visualGlitchIntensity ?? 0.4), u = l === "low" ? Math.min(c, 0.25) : l === "high" ? Math.min(1, c + 0.2) : c;
    return { ...o, visualGlitchIntensity: u };
  }
  function r(o = {}) {
    const l = Number(game.settings.get(t, "defaultDc") ?? 15), c = Number(o.dc ?? l), u = Number(o.rollTotal ?? c), d = o.naturalRoll === null || o.naturalRoll === void 0 ? null : Number(o.naturalRoll), f = i(e(o.profile ?? ae(u, c, d)));
    return { ...o, dc: c, rollTotal: u, profile: f };
  }
  function a(o = {}) {
    const l = String(o.type ?? "node-intrusion");
    return it(l, r(o));
  }
  const s = {
    startHack: a,
    startNodeIntrusion: (o = {}) => a({ ...o, type: "node-intrusion" }),
    startSignalAlignment: (o = {}) => a({ ...o, type: "signal-alignment" }),
    openLauncher: n,
    getDifficultyProfile: (o = 0, l = 10, c = null) => i(e(ae(o, l, c))),
    difficultyProfiles: O,
    getMinigames: nt,
    getActiveApp: rt,
    testNodeIntrusion: () => s.startNodeIntrusion({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }),
    testSignalAlignment: () => s.startSignalAlignment({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    })
  };
  return s;
}
function F(t) {
  const n = document.createElement("div");
  return n.textContent = String(t ?? ""), n.innerHTML;
}
function ge() {
  return Se().filter((n) => !n.isGM);
}
function Se() {
  var t;
  return Array.isArray(game.users) ? game.users : ((t = game.users) == null ? void 0 : t.contents) ?? [...game.users ?? []];
}
function be(t) {
  var e, i;
  const n = String(t ?? "");
  return ((i = (e = game.users) == null ? void 0 : e.get) == null ? void 0 : i.call(e, n)) ?? Se().find((r) => r.id === n) ?? null;
}
function we() {
  var t;
  return Array.isArray(game.actors) ? game.actors : ((t = game.actors) == null ? void 0 : t.contents) ?? [...game.actors ?? []];
}
function _(t) {
  var e, i;
  const n = String(t ?? "");
  return ((i = (e = game.actors) == null ? void 0 : e.get) == null ? void 0 : i.call(e, n)) ?? we().find((r) => r.id === n || r.uuid === n) ?? null;
}
function U(t) {
  const n = t == null ? void 0 : t.character;
  return n ? typeof n == "string" ? _(n) : n : null;
}
function V(t, n) {
  var r, a, s, o;
  if (!t || !n) return !1;
  if (t === U(n) || (r = t.testUserPermission) != null && r.call(t, n, "OWNER")) return !0;
  const e = ((s = (a = globalThis.CONST) == null ? void 0 : a.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : s.OWNER) ?? 3, i = t.ownership ?? ((o = t.data) == null ? void 0 : o.permission) ?? {};
  return Number(i[n.id] ?? i.default ?? 0) >= e;
}
function lt() {
  var t, n, e;
  return ((e = (n = (t = canvas == null ? void 0 : canvas.tokens) == null ? void 0 : t.controlled) == null ? void 0 : n[0]) == null ? void 0 : e.actor) ?? null;
}
function Ie(t) {
  const n = U(t) ? [U(t)] : [], e = we().filter((r) => V(r, t));
  return [...new Map([...n, ...e].filter(Boolean).map((r) => [r.id, r])).values()].sort((r, a) => r.name.localeCompare(a.name));
}
function Te(t = "") {
  const n = ge(), e = n.find((r) => r.id === t);
  return (e ? Ie(e) : we()).filter((r) => !e || V(r, e)).map((r) => ({
    id: r.id,
    name: r.name,
    owners: n.filter((a) => V(r, a))
  })).sort((r, a) => r.name.localeCompare(a.name));
}
const ct = {
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
function Ae(t) {
  var e;
  const n = (e = t == null ? void 0 : t.system) == null ? void 0 : e.skills;
  if (n && typeof n == "object") {
    const i = Object.entries(n).map(([r, a]) => ({
      id: r,
      name: ce(r, a),
      label: ut(r, a),
      modifier: ve(a)
    }));
    if (i.length) return i.sort((r, a) => r.label.localeCompare(a.label));
  }
  return [
    { id: "hacking", name: "Hacking", label: "Hacking (+0)", modifier: 0 },
    { id: "computers", name: "Computers", label: "Computers (+0)", modifier: 0 },
    { id: "technology", name: "Technology", label: "Technology (+0)", modifier: 0 },
    { id: "intelligence", name: "Intelligence", label: "Intelligence (+0)", modifier: 0 }
  ];
}
function He(t, n) {
  var e, i;
  return ((i = (e = t == null ? void 0 : t.system) == null ? void 0 : e.skills) == null ? void 0 : i[n]) ?? null;
}
function ce(t, n) {
  const e = String((n == null ? void 0 : n.label) ?? (n == null ? void 0 : n.name) ?? (n == null ? void 0 : n.localizedName) ?? t ?? "Skill").trim(), i = e.toLowerCase().replace(/[^a-z0-9]/g, "");
  return String(ct[i] ?? e).replace(/[_-]/g, " ").replace(/\b\w/g, (r) => r.toUpperCase());
}
function ve(t) {
  var r, a, s, o, l, c, u, d, f, h;
  if (typeof t == "number") return t;
  if (!t || typeof t != "object") return 0;
  const e = [
    t == null ? void 0 : t.mod,
    (r = t == null ? void 0 : t.mod) == null ? void 0 : r.value,
    t == null ? void 0 : t.modifier,
    (a = t == null ? void 0 : t.modifier) == null ? void 0 : a.value,
    t == null ? void 0 : t.total,
    (s = t == null ? void 0 : t.total) == null ? void 0 : s.value,
    t == null ? void 0 : t.value,
    (o = t == null ? void 0 : t.value) == null ? void 0 : o.value,
    t == null ? void 0 : t.bonus,
    (l = t == null ? void 0 : t.bonus) == null ? void 0 : l.value,
    t == null ? void 0 : t.check,
    (c = t == null ? void 0 : t.check) == null ? void 0 : c.mod,
    (u = t == null ? void 0 : t.check) == null ? void 0 : u.total,
    t == null ? void 0 : t.roll,
    (d = t == null ? void 0 : t.roll) == null ? void 0 : d.mod,
    (f = t == null ? void 0 : t.roll) == null ? void 0 : f.total,
    t == null ? void 0 : t.rank,
    t == null ? void 0 : t.ranks
  ].find((m) => Number.isFinite(Number(m)));
  if (e !== void 0) return Number(e);
  const i = [];
  return Ee(t, i, 0), i.sort((m, I) => I.score - m.score), Number(((h = i[0]) == null ? void 0 : h.value) ?? 0);
}
function ut(t, n) {
  const e = ce(t, n), i = ve(n), r = i >= 0 ? "+" : "-";
  return `${e} (${r}${Math.abs(i)})`;
}
function Ee(t, n, e, i = "") {
  if (!(!t || typeof t != "object" || e > 4))
    for (const [r, a] of Object.entries(t)) {
      const s = i ? `${i}.${r}` : r, o = Number(a);
      if (Number.isFinite(o)) {
        const l = s.toLowerCase();
        let c = 1;
        /(total|mod|modifier|bonus|check|roll|value)$/.test(l) && (c += 6), /(dc|rank|ranks|proficient|prof|trained|ability|base|label|name)/.test(l) && (c -= 4), Math.abs(o) > 30 && (c -= 5), n.push({ value: o, score: c, path: s });
      } else a && typeof a == "object" && Ee(a, n, e + 1, s);
    }
}
function _e() {
  var t, n, e;
  return ((n = (t = globalThis.foundry) == null ? void 0 : t.applications) == null ? void 0 : n.api) ?? ((e = foundry == null ? void 0 : foundry.applications) == null ? void 0 : e.api) ?? null;
}
function qe() {
  var t, n, e;
  return ((n = (t = globalThis.foundry) == null ? void 0 : t.appv1) == null ? void 0 : n.api) ?? ((e = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : e.api) ?? null;
}
function dt(t = {}, n = {}) {
  var i, r, a;
  const e = ((r = (i = globalThis.foundry) == null ? void 0 : i.utils) == null ? void 0 : r.mergeObject) ?? ((a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.mergeObject);
  return typeof e == "function" ? e(t, n, { inplace: !1 }) : { ...t, ...n };
}
function ft() {
  var t, n, e, i, r;
  return ((e = (n = (t = globalThis.foundry) == null ? void 0 : t.utils) == null ? void 0 : n.randomID) == null ? void 0 : e.call(n, 8)) ?? ((r = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.randomID) == null ? void 0 : r.call(i, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function De(t = {}) {
  return {
    id: String(t.id ?? `legacy-application-${ft()}`),
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
function Ge(t) {
  return class extends t {
    constructor(i = {}) {
      const r = dt(new.target.defaultOptions ?? {}, i);
      super(De(r));
      p(this, "_v1Options");
      this._v1Options = r;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return De(this.defaultOptions ?? {});
    }
    activateListeners(i) {
    }
    async _renderHTML(i, r) {
      var c, u, d;
      const a = typeof this.getData == "function" ? await this.getData() : {}, s = ((c = this._v1Options) == null ? void 0 : c.template) ?? ((u = this.options) == null ? void 0 : u.template) ?? ((d = this.constructor.defaultOptions) == null ? void 0 : d.template);
      if (!s) return document.createDocumentFragment();
      const o = await globalThis.renderTemplate(s, a), l = document.createElement("template");
      return l.innerHTML = o.trim(), l.content;
    }
    _activateV1Form(i) {
      var a, s;
      if (typeof this._updateObject != "function") return;
      const r = (a = i.matches) != null && a.call(i, "form") ? i : (s = i.querySelector) == null ? void 0 : s.call(i, "form");
      r instanceof HTMLFormElement && r.addEventListener("submit", async (o) => {
        var c;
        o.preventDefault(), o.stopPropagation();
        const l = new FormData(r);
        await this._updateObject(o, l), ((c = this._v1Options) == null ? void 0 : c.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(i, r, a) {
      var u, d, f, h;
      r.replaceChildren(i);
      const s = globalThis.jQuery ?? globalThis.$, o = ((u = r.closest) == null ? void 0 : u.call(r, ".window-app, .app, .application")) ?? r, l = s ? s(o) : o;
      try {
        Object.defineProperty(this, "element", {
          value: l,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = l;
        } catch {
        }
      }
      const c = (d = this._v1Options) == null ? void 0 : d.classes;
      Array.isArray(c) && c.length && (r.classList.add(...c), (h = (f = r.closest) == null ? void 0 : f.call(r, ".window-app, .app, .application")) == null || h.classList.add(...c)), this._activateV1Form(r), typeof this.activateListeners == "function" && this.activateListeners(s ? s(r) : r);
    }
  };
}
function ue() {
  const t = _e(), n = qe(), e = globalThis.Application ?? (n == null ? void 0 : n.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (n == null ? void 0 : n.FormApplication) ?? (t == null ? void 0 : t.FormApplication);
  if (e) return e;
  const i = t == null ? void 0 : t.ApplicationV2;
  return i ? Ge(i) : null;
}
function ht() {
  const t = _e(), n = qe(), e = globalThis.FormApplication ?? (n == null ? void 0 : n.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? globalThis.Application ?? (n == null ? void 0 : n.Application) ?? (t == null ? void 0 : t.ApplicationV1);
  if (e) return e;
  const i = t == null ? void 0 : t.ApplicationV2;
  return i ? Ge(i) : ue();
}
const ne = "holosuite-hacking", gt = `modules/${ne}/templates/hacking-launcher.html`, mt = ue();
class pt extends mt {
  constructor(e = {}) {
    super(e);
    p(this, "api");
    this.api = e.api;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-hacking-launcher",
      title: "HoloSuite Hacking",
      classes: ["holosuite-hacking-launcher-window"],
      popOut: !0,
      resizable: !0,
      width: 460,
      height: 440,
      template: gt
    });
  }
  getData() {
    const e = Number(game.settings.get(ne, "defaultDc") ?? 15), i = ge(), r = i[0] ?? null, a = Te(r == null ? void 0 : r.id), s = a.length ? _(a[0].id) : null;
    return {
      defaultDc: e,
      defaultTestRoll: e,
      minigames: this.api.getMinigames(),
      actors: a.map((o) => ({
        id: o.id,
        name: o.name,
        ownerNames: o.owners.map((l) => l.name).join(", ") || "No active owner"
      })),
      users: i.map((o) => ({
        id: o.id,
        name: o.name
      })),
      skills: Ae(s)
    };
  }
  activateListeners(e) {
    super.activateListeners(e);
    const i = e.is("form") ? e[0] : e.find("form")[0];
    e.find("[data-action='start']").on("click", (a) => {
      a.preventDefault(), this.submit(i);
    }), e.find("[data-action='test-self']").on("click", (a) => {
      a.preventDefault(), this.testSelf(i);
    }), (e.is("form") ? e : e.find("form")).on("submit", (a) => {
      a.preventDefault(), this.submit(a.currentTarget);
    }), e.find("[name='actorId']").on("change", (a) => {
      this.syncUserToActor(e, a.currentTarget.value), this.syncSkillOptions(e, a.currentTarget.value);
    }), e.find("[name='userId']").on("change", (a) => {
      this.syncActorsForUser(e, a.currentTarget.value);
    }), this.syncSkillOptions(e, e.find("[name='actorId']").val());
  }
  submit(e) {
    var S, v, C, P, L, g;
    if (!((S = game.user) != null && S.isGM)) {
      (C = (v = ui.notifications) == null ? void 0 : v.warn) == null || C.call(v, "Only the GM can open the HoloSuite Hacking launcher.");
      return;
    }
    if (!e) {
      (L = (P = ui.notifications) == null ? void 0 : P.error) == null || L.call(P, "HoloSuite Hacking launcher form was not found."), console.error(`${ne} | Launcher form was not found.`);
      return;
    }
    const i = e.querySelector("[name='minigameType']"), r = e.querySelector("[name='actorId']"), a = e.querySelector("[name='userId']"), s = e.querySelector("[name='skillId']"), o = e.querySelector("[name='dc']"), l = ((g = s == null ? void 0 : s.selectedOptions) == null ? void 0 : g[0]) ?? null, c = String((i == null ? void 0 : i.value) || "node-intrusion"), u = String((r == null ? void 0 : r.value) || ""), d = String((a == null ? void 0 : a.value) || ""), f = String((s == null ? void 0 : s.value) || ""), h = String((l == null ? void 0 : l.dataset.skillLabel) || (l == null ? void 0 : l.textContent) || f || "Skill"), m = Number((l == null ? void 0 : l.dataset.skillModifier) ?? 0), I = Number((o == null ? void 0 : o.value) ?? 15);
    this.api.sendHackToPlayer({
      minigameType: c,
      actorId: u,
      userId: d,
      skillId: f,
      skillLabel: h,
      skillModifier: m,
      dc: I,
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }) && this.close();
  }
  testSelf(e) {
    var l, c, u, d, f, h, m, I, A, S, v, C, P;
    if (!((l = game.user) != null && l.isGM)) {
      (u = (c = ui.notifications) == null ? void 0 : c.warn) == null || u.call(c, "Only the GM can test HoloSuite Hacking minigames.");
      return;
    }
    if (!e) {
      (f = (d = ui.notifications) == null ? void 0 : d.error) == null || f.call(d, "HoloSuite Hacking launcher form was not found.");
      return;
    }
    const i = String(((h = e.querySelector("[name='minigameType']")) == null ? void 0 : h.value) || "node-intrusion"), r = String(((m = e.querySelector("[name='actorId']")) == null ? void 0 : m.value) || ""), a = Number(((I = e.querySelector("[name='dc']")) == null ? void 0 : I.value) ?? game.settings.get(ne, "defaultDc") ?? 15), s = Number(((A = e.querySelector("[name='testRollTotal']")) == null ? void 0 : A.value) ?? a);
    if (!Number.isFinite(s)) {
      (v = (S = ui.notifications) == null ? void 0 : S.warn) == null || v.call(S, "Enter a fake roll result before testing the minigame.");
      return;
    }
    const o = _(r);
    this.api.startHack({
      type: i,
      dc: a,
      rollTotal: s,
      actorName: (o == null ? void 0 : o.name) ?? ((C = game.user) == null ? void 0 : C.name) ?? "GM",
      userId: ((P = game.user) == null ? void 0 : P.id) ?? "",
      onSuccess: () => {
      },
      onFailure: () => {
      }
    }), this.close();
  }
  syncUserToActor(e, i) {
    const r = _(i), a = ge().find((s) => r == null ? void 0 : r.testUserPermission(s, "OWNER"));
    a && e.find("[name='userId']").val(a.id);
  }
  syncSkillOptions(e, i) {
    const r = _(i), a = Ae(r);
    e.find("[name='skillId']").html(a.map((s) => `<option value="${F(s.id)}" data-skill-label="${F(s.name ?? s.label)}" data-skill-modifier="${Number(s.modifier ?? 0)}">${F(s.label)}</option>`).join(""));
  }
  syncActorsForUser(e, i) {
    const r = Te(i), a = r.length ? r.map((s) => `<option value="${F(s.id)}">${F(s.name)} (${F(s.owners.map((o) => o.name).join(", ") || "No owner")})</option>`).join("") : '<option value="">Use assigned character</option>';
    e.find("[name='actorId']").html(a), this.syncSkillOptions(e, e.find("[name='actorId']").val());
  }
}
const B = "holosuite-hacking", yt = `modules/${B}/templates/difficulty-profiles.html`, St = ht(), fe = [
  "critical_success",
  "strong_success",
  "success",
  "failure_but_playable",
  "critical_failure"
];
function ie(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function je(t, n) {
  if (!ie(n)) return t;
  const e = { ...t };
  for (const [i, r] of Object.entries(n))
    e[i] = ie(r) && ie(e[i]) ? je(e[i], r) : r;
  return e;
}
function bt() {
  const t = String(game.settings.get(B, "difficultyProfileOverrides") ?? "").trim();
  if (!t) return {};
  try {
    const n = JSON.parse(t);
    return ie(n) ? n : {};
  } catch (n) {
    return console.warn(`${B} | Difficulty profile overrides must be valid JSON.`, n), {};
  }
}
function b(t, n, e) {
  const i = Number(t.get(n));
  return Number.isFinite(i) ? i : e;
}
function y(t, n, e) {
  return Math.min(e, Math.max(n, t));
}
function re(t, n) {
  return t.get(n) === "on";
}
function $e(t) {
  if (t.type !== "number" || t.value === "") return;
  const n = Number(t.value);
  if (!Number.isFinite(n)) return;
  const e = t.min === "" ? -1 / 0 : Number(t.min), i = t.max === "" ? 1 / 0 : Number(t.max), r = y(n, e, i);
  r !== n && (t.value = String(r));
}
function se(t, n, e, i) {
  const r = y(Math.round(t), 6, 40), a = Math.max(0, r - 4), s = y(Math.round(n), 0, a), o = Math.max(0, r - s), l = y(Math.round(o * 0.48), Math.min(6, o), o), c = l >= 5 ? 3 : 1, u = y(Math.round(e), 1, c), d = l + Math.max(0, u - 1), f = i ? Math.max(0, r - s - 2) : Math.max(0, r - s - d);
  return {
    nodeCount: r,
    maxDecoys: a,
    decoyCount: s,
    mainPathLength: l,
    maxRoutes: c,
    routeCount: u,
    protectedNodes: d,
    maxFirewalls: f
  };
}
function wt(t, n, e) {
  const i = b(t, `${n}nodeCount`, e.nodeIntrusion.nodeCount), r = b(t, `${n}decoyCount`, e.nodeIntrusion.decoyCount), a = b(t, `${n}routeCount`, e.nodeIntrusion.routeCount ?? 2), s = re(t, `${n}allowFirewallOnMainPath`), o = se(i, r, a, s);
  return {
    traceDurationSeconds: y(Math.round(b(t, `${n}nodeTraceDurationSeconds`, e.nodeIntrusion.traceDurationSeconds ?? e.traceDurationSeconds ?? 60)), 5, 300),
    nodeCount: o.nodeCount,
    firewallCount: y(Math.round(b(t, `${n}firewallCount`, e.nodeIntrusion.firewallCount)), 0, o.maxFirewalls),
    decoyCount: o.decoyCount,
    routeCount: o.routeCount,
    radarEnabled: re(t, `${n}radarEnabled`),
    claimDurationSeconds: y(b(t, `${n}claimDurationSeconds`, e.nodeIntrusion.claimDurationSeconds ?? 0.5), 0.1, 5),
    firewallClaimMultiplier: y(b(t, `${n}firewallClaimMultiplier`, e.nodeIntrusion.firewallClaimMultiplier ?? 1.75), 1, 5),
    firewallPenaltySeconds: y(Math.round(b(t, `${n}firewallPenaltySeconds`, e.nodeIntrusion.firewallPenaltySeconds ?? 6)), 0, 60),
    decoyPenaltySeconds: y(Math.round(b(t, `${n}decoyPenaltySeconds`, e.nodeIntrusion.decoyPenaltySeconds ?? 4)), 0, 60),
    showTarget: re(t, `${n}showTarget`),
    allowFirewallOnMainPath: s
  };
}
function It(t, n, e) {
  return {
    traceDurationSeconds: y(Math.round(b(t, `${n}signalTraceDurationSeconds`, e.signalAlignment.traceDurationSeconds ?? e.traceDurationSeconds ?? 60)), 5, 300),
    channelCount: y(Math.round(b(t, `${n}signalChannelCount`, e.signalAlignment.channelCount ?? 3)), 2, 5),
    tolerance: y(b(t, `${n}signalTolerance`, e.signalAlignment.tolerance ?? 5), 0.5, 20),
    signalDriftSpeed: y(b(t, `${n}signalDriftSpeed`, e.signalAlignment.signalDriftSpeed ?? 0), 0, 5),
    noiseLevel: y(b(t, `${n}signalNoiseLevel`, e.signalAlignment.noiseLevel ?? 0), 0, 1),
    lockHoldSeconds: y(b(t, `${n}signalLockHoldSeconds`, e.signalAlignment.lockHoldSeconds ?? 4), 0.5, 30),
    targetRevealRadius: y(b(t, `${n}signalTargetRevealRadius`, e.signalAlignment.targetRevealRadius ?? 100), 0, 100),
    destabilizationPenaltySeconds: y(b(t, `${n}signalDestabilizationPenaltySeconds`, e.signalAlignment.destabilizationPenaltySeconds ?? 0), 0, 60)
  };
}
function vt(t) {
  const n = O[t], e = se(
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
      firewallCount: y(Number(n.nodeIntrusion.firewallCount ?? 0), 0, e.maxFirewalls),
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
    }
  };
}
class Nt extends St {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-hacking-difficulty-profiles",
      title: "HoloSuite Hacking Difficulty Profiles",
      classes: ["holosuite-hacking-window", "holosuite-hacking-profile-window"],
      template: yt,
      width: 720,
      height: 760,
      resizable: !0,
      closeOnSubmit: !0,
      submitOnChange: !1,
      submitOnClose: !1
    });
  }
  getData() {
    const n = bt();
    return {
      profiles: fe.map((i) => {
        var d, f, h, m, I, A, S, v, C, P, L, g, M, D, R, $, x, q, W, K, G;
        const r = O[i], a = je(r, n[i]), s = Number(((d = a.nodeIntrusion) == null ? void 0 : d.nodeCount) ?? 12), o = Number(((f = a.nodeIntrusion) == null ? void 0 : f.decoyCount) ?? 0), l = Number(((h = a.nodeIntrusion) == null ? void 0 : h.routeCount) ?? 2), c = !!((m = a.nodeIntrusion) != null && m.allowFirewallOnMainPath), u = se(s, o, l, c);
        return {
          id: i,
          label: a.label,
          hintsEnabled: !!a.hintsEnabled,
          visualGlitchIntensity: Number(a.visualGlitchIntensity ?? 0.4),
          nodeIntrusion: {
            traceDurationSeconds: Number(((I = a.nodeIntrusion) == null ? void 0 : I.traceDurationSeconds) ?? a.traceDurationSeconds ?? 60),
            nodeCount: u.nodeCount,
            firewallCount: y(Number(((A = a.nodeIntrusion) == null ? void 0 : A.firewallCount) ?? 0), 0, u.maxFirewalls),
            decoyCount: u.decoyCount,
            routeCount: u.routeCount,
            radarEnabled: !!(((S = a.nodeIntrusion) == null ? void 0 : S.radarEnabled) ?? Number(((v = a.nodeIntrusion) == null ? void 0 : v.radarRange) ?? 0) > 0),
            claimDurationSeconds: Number(((C = a.nodeIntrusion) == null ? void 0 : C.claimDurationSeconds) ?? 0.5),
            firewallClaimMultiplier: Number(((P = a.nodeIntrusion) == null ? void 0 : P.firewallClaimMultiplier) ?? 1.75),
            firewallPenaltySeconds: Number(((L = a.nodeIntrusion) == null ? void 0 : L.firewallPenaltySeconds) ?? 6),
            decoyPenaltySeconds: Number(((g = a.nodeIntrusion) == null ? void 0 : g.decoyPenaltySeconds) ?? 4),
            showTarget: !!((M = a.nodeIntrusion) != null && M.showTarget),
            allowFirewallOnMainPath: c
          },
          signalAlignment: {
            traceDurationSeconds: Number(((D = a.signalAlignment) == null ? void 0 : D.traceDurationSeconds) ?? a.traceDurationSeconds ?? 60),
            channelCount: Number(((R = a.signalAlignment) == null ? void 0 : R.channelCount) ?? 3),
            tolerance: Number((($ = a.signalAlignment) == null ? void 0 : $.tolerance) ?? 5),
            signalDriftSpeed: Number(((x = a.signalAlignment) == null ? void 0 : x.signalDriftSpeed) ?? 0),
            noiseLevel: Number(((q = a.signalAlignment) == null ? void 0 : q.noiseLevel) ?? 0),
            lockHoldSeconds: Number(((W = a.signalAlignment) == null ? void 0 : W.lockHoldSeconds) ?? 4),
            targetRevealRadius: Number(((K = a.signalAlignment) == null ? void 0 : K.targetRevealRadius) ?? 100),
            destabilizationPenaltySeconds: Number(((G = a.signalAlignment) == null ? void 0 : G.destabilizationPenaltySeconds) ?? 0)
          },
          constraints: u
        };
      }),
      hasOverrides: Object.keys(n).length > 0
    };
  }
  activateListeners(n) {
    super.activateListeners(n), this.syncConstraints(n), n.find("input[type='number']").on("change", (e) => {
      $e(e.currentTarget);
    }), n.find("[data-profile-section] input").on("input change", (e) => {
      var r;
      const i = (r = e.currentTarget) == null ? void 0 : r.closest("[data-profile-section]");
      i && this.syncProfileConstraints(i);
    }), n.find("[data-action='reset-profile']").on("click", (e) => {
      var r;
      e.preventDefault();
      const i = (r = e.currentTarget) == null ? void 0 : r.closest("[data-profile-section]");
      i && this.resetProfileSection(i);
    }), n.find("[data-action='reset-profiles']").on("click", async (e) => {
      var i, r;
      e.preventDefault(), await game.settings.set(B, "difficultyProfileOverrides", ""), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "HoloSuite Hacking difficulty profiles reset to defaults."), this.render(!1);
    });
  }
  syncConstraints(n) {
    n.find("[data-profile-section]").each((e, i) => this.syncProfileConstraints(i));
  }
  clampNumberInputs() {
    var e;
    const n = (e = this.element) == null ? void 0 : e[0];
    n == null || n.querySelectorAll("input[type='number']").forEach((i) => $e(i));
  }
  syncProfileConstraints(n) {
    const e = n.dataset.profileId ?? "", i = (u) => n.querySelector(`[name="${e}.${u}"]`), r = i("nodeCount"), a = i("decoyCount"), s = i("routeCount"), o = i("firewallCount"), l = i("allowFirewallOnMainPath");
    if (!r || !a || !s || !o) return;
    const c = se(
      Number(r.value),
      Number(a.value),
      Number(s.value),
      !!(l != null && l.checked)
    );
    r.value = String(c.nodeCount), a.max = String(c.maxDecoys), a.value = String(c.decoyCount), s.max = String(c.maxRoutes), s.value = String(c.routeCount), o.max = String(c.maxFirewalls), o.value = String(y(Math.round(Number(o.value) || 0), 0, c.maxFirewalls)), n.querySelectorAll("[data-constraint]").forEach((u) => {
      const d = u.dataset.constraint;
      d && c[d] !== void 0 && (u.textContent = String(c[d]));
    });
  }
  resetProfileSection(n) {
    const e = n.dataset.profileId ?? "";
    if (!fe.includes(e)) return;
    const i = vt(e), r = {
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
      signalDestabilizationPenaltySeconds: i.signalAlignment.destabilizationPenaltySeconds
    };
    for (const [s, o] of Object.entries(r)) {
      const l = n.querySelector(`[name="${e}.${s}"]`);
      l && (l.value = String(o));
    }
    const a = {
      hintsEnabled: i.hintsEnabled,
      radarEnabled: i.nodeIntrusion.radarEnabled,
      showTarget: i.nodeIntrusion.showTarget,
      allowFirewallOnMainPath: i.nodeIntrusion.allowFirewallOnMainPath
    };
    for (const [s, o] of Object.entries(a)) {
      const l = n.querySelector(`[name="${e}.${s}"]`);
      l && (l.checked = o);
    }
    this.syncProfileConstraints(n);
  }
  async _updateObject(n, e) {
    var a, s;
    this.clampNumberInputs();
    const i = new FormData(this.form), r = {};
    for (const o of fe) {
      const l = O[o], c = `${o}.`;
      r[o] = {
        traceDurationSeconds: y(Math.round(b(i, `${c}nodeTraceDurationSeconds`, l.traceDurationSeconds)), 5, 300),
        hintsEnabled: re(i, `${c}hintsEnabled`),
        visualGlitchIntensity: y(b(i, `${c}visualGlitchIntensity`, l.visualGlitchIntensity), 0, 1),
        nodeIntrusion: wt(i, c, l),
        signalAlignment: It(i, c, l)
      };
    }
    await game.settings.set(B, "difficultyProfileOverrides", JSON.stringify(r)), (s = (a = ui.notifications) == null ? void 0 : a.info) == null || s.call(a, "HoloSuite Hacking difficulty profiles saved.");
  }
}
async function ze({ title: t, result: n, actorName: e, message: i, rollTotal: r, dc: a }) {
  const s = n === "success", o = s ? "#38f28f" : "#ff477e", l = s ? "HACK SUCCESS" : "HACK FAILED", c = i || (s ? "Objective completed." : "Trace or countermeasure completed."), u = Number.isFinite(Number(r)) && Number.isFinite(Number(a)) ? `<p style="margin: 4px 0 0; color: #bdeff6;">Roll ${Number(r)} vs DC ${Number(a)}</p>` : "", d = `
    <div class="holosuite-hacking-chat-result" style="border-left: 4px solid ${o}; padding: 8px 10px; background: rgba(5, 8, 14, 0.88); color: ${o};">
      <strong>${X(l)} // ${X(t)} // ${X(e || "Hacker")}</strong>
      <p style="margin: 6px 0 0; color: ${o};">${X(c)}</p>
      ${u}
    </div>
  `;
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content: d
  });
}
function X(t) {
  const n = document.createElement("div");
  return n.textContent = String(t ?? ""), n.innerHTML;
}
function T(t, n, e) {
  return Math.min(e, Math.max(n, t));
}
function Ct(t) {
  const n = String(t ?? "node-intrusion");
  let e = 2166136261;
  for (let i = 0; i < n.length; i += 1)
    e ^= n.charCodeAt(i), e = Math.imul(e, 16777619);
  return e >>> 0;
}
function Mt(t) {
  let n = Ct(t);
  return () => {
    n += 1831565813;
    let e = n;
    return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
  };
}
function he(t, n) {
  return t.length ? t[Math.floor(n() * t.length)] : null;
}
function Pt(t, n) {
  const e = [...t];
  for (let i = e.length - 1; i > 0; i -= 1) {
    const r = Math.floor(n() * (i + 1));
    [e[i], e[r]] = [e[r], e[i]];
  }
  return e;
}
function E(t, n, e) {
  const i = t.find((a) => a.id === n), r = t.find((a) => a.id === e);
  !i || !r || (i.connected.includes(e) || i.connected.push(e), r.connected.includes(n) || r.connected.push(n));
}
function j(t, n) {
  return [t, n].sort().join("--");
}
function oe(t, n, e, i) {
  return {
    id: t,
    x: T(Math.round(e), 6, 94),
    y: T(Math.round(i), 10, 90),
    type: n,
    connected: [],
    revealed: n === "start",
    visited: !1
  };
}
function Ne(t) {
  return t.flatMap((n) => n.connected.filter((e) => n.id < e).map((e) => ({ from: n.id, to: e })));
}
function k(t, n) {
  return t.find((e) => e.id === n);
}
function J(t, n, e) {
  return Math.sign((n.y - t.y) * (e.x - n.x) - (n.x - t.x) * (e.y - n.y));
}
function Tt(t, n, e, i) {
  const r = J(t, n, e), a = J(t, n, i), s = J(e, i, t), o = J(e, i, n);
  return r !== a && s !== o;
}
function At(t, n, e) {
  if (n.from === e.from || n.from === e.to || n.to === e.from || n.to === e.to) return !1;
  const i = k(t, n.from), r = k(t, n.to), a = k(t, e.from), s = k(t, e.to);
  return !i || !r || !a || !s ? !1 : Tt(i, r, a, s);
}
function Dt(t, n, e) {
  const i = e.x - n.x, r = e.y - n.y, a = i * i + r * r;
  if (!a) {
    const u = t.x - n.x, d = t.y - n.y;
    return Math.sqrt(u * u + d * d);
  }
  const s = T(((t.x - n.x) * i + (t.y - n.y) * r) / a, 0, 1), o = {
    x: n.x + s * i,
    y: n.y + s * r
  }, l = t.x - o.x, c = t.y - o.y;
  return Math.sqrt(l * l + c * c);
}
function $t(t, n = Ne(t)) {
  let e = 0;
  for (let i = 0; i < n.length; i += 1)
    for (let r = i + 1; r < n.length; r += 1)
      At(t, n[i], n[r]) && (e += 1);
  return e;
}
function Ue(t) {
  const n = Ne(t);
  let e = $t(t, n) * 900;
  for (let i = 0; i < t.length; i += 1)
    for (let r = i + 1; r < t.length; r += 1) {
      const a = t[i], s = t[r], o = s.x - a.x, l = s.y - a.y, c = Math.sqrt(o * o + l * l) || 1;
      c < 13 && (e += (13 - c) * 30), c < 18 && (e += (18 - c) * 6);
    }
  for (const i of t)
    for (const r of n) {
      if (r.from === i.id || r.to === i.id) continue;
      const a = k(t, r.from), s = k(t, r.to);
      if (!a || !s) continue;
      const o = Dt(i, a, s);
      o < 8 && (e += (8 - o) * 18);
    }
  return e;
}
function xt(t, n, e) {
  const i = t.map((r) => ({ ...r, connected: [...r.connected] }));
  i.push({ ...n, connected: [] });
  for (const r of e) E(i, n.id, r);
  return Ue(i);
}
function xe(t, n, e, i, r, a, s = {}) {
  const {
    radiusMin: o = 17,
    radiusMax: l = 34,
    biasX: c = 5,
    ySpread: u = 1
  } = s;
  let d = null, f = 1 / 0;
  for (let h = 0; h < 16; h += 1) {
    const m = r() * Math.PI * 2 - Math.PI * 0.2, I = o + r() * (l - o), A = i.x + Math.cos(m) * I + c, S = i.y + Math.sin(m) * I * u, v = oe(n, e, A, S), C = xt(t, v, a);
    C < f && (d = v, f = C);
  }
  return d ?? oe(n, e, i.x + c, i.y);
}
function Ot(t) {
  for (let n = 0; n < 24; n += 1)
    for (let e = 0; e < t.length; e += 1)
      for (let i = e + 1; i < t.length; i += 1) {
        const r = t[e], a = t[i], s = a.x - r.x, o = a.y - r.y, l = Math.sqrt(s * s + o * o) || 1;
        if (l >= 13) continue;
        const c = (13 - l) * 0.35, u = s / l * c, d = o / l * c;
        r.type !== "start" && r.type !== "target" && (r.x = T(r.x - u, 6, 94), r.y = T(r.y - d, 10, 90)), a.type !== "start" && a.type !== "target" && (a.x = T(a.x + u, 6, 94), a.y = T(a.y + d, 10, 90));
      }
}
function Y(t) {
  const n = Math.floor(t() * 4);
  return n === 0 ? { x: 8 + t() * 22, y: 12 + t() * 76 } : n === 1 ? { x: 70 + t() * 22, y: 12 + t() * 76 } : n === 2 ? { x: 12 + t() * 76, y: 10 + t() * 20 } : { x: 12 + t() * 76, y: 70 + t() * 20 };
}
function Ft(t) {
  let n = Y(t), e = Y(t), i = { start: n, target: e, distance: 0 };
  for (let r = 0; r < 24; r += 1) {
    n = Y(t), e = Y(t);
    const a = e.x - n.x, s = e.y - n.y, o = Math.sqrt(a * a + s * s);
    if (o > i.distance && (i = { start: n, target: e, distance: o }), o >= 58) return { start: n, target: e };
  }
  return { start: i.start, target: i.target };
}
function Oe(t, n, e, i = /* @__PURE__ */ new Set()) {
  const r = [n], a = /* @__PURE__ */ new Map([[n, null]]);
  for (let l = 0; l < r.length; l += 1) {
    const c = k(t, r[l]);
    if (c) {
      if (c.id === e) break;
      for (const u of c.connected) {
        if (a.has(u)) continue;
        const d = k(t, u);
        !d || i.has(d.type) || (a.set(u, c.id), r.push(u));
      }
    }
  }
  if (!a.has(e)) return [];
  const s = [];
  let o = e;
  for (; o; )
    s.unshift(o), o = a.get(o) ?? null;
  return s;
}
function Rt(t, n, e) {
  const i = Oe(t, n, e, /* @__PURE__ */ new Set(["firewall", "decoy"]));
  if (!i.length) return 0;
  const r = /* @__PURE__ */ new Set([n, e]), a = t.map((s) => ({
    ...s,
    connected: r.has(s.id) || !i.includes(s.id) ? [...s.connected] : []
  }));
  return 1 + (Oe(a, n, e, /* @__PURE__ */ new Set(["firewall", "decoy"])).length ? 1 : 0);
}
function kt(t, n, e, i) {
  let r = t.length + 1;
  const a = [];
  for (let s = 1; s < i && !(n.length < 5); s += 1) {
    const o = 1 + Math.floor(e() * Math.max(1, n.length - 4)), l = T(o + 2 + Math.floor(e() * 3), o + 2, n.length - 2), c = k(t, n[o]), u = k(t, n[l]);
    if (!c || !u) continue;
    const d = `node-${r}`;
    r += 1;
    const f = oe(
      d,
      "normal",
      (c.x + u.x) / 2 + (e() - 0.5) * 34,
      (c.y + u.y) / 2 + (e() - 0.5) * 34
    );
    t.push(f), a.push(c.id, f.id, u.id), E(t, c.id, f.id), E(t, f.id, u.id);
  }
  return a;
}
function Fe(t, n = Date.now()) {
  var S, v, C, P, L;
  const e = Mt(n), i = Math.max(6, Number(t.nodeCount ?? ((S = t.nodeIntrusion) == null ? void 0 : S.nodeCount)) || 10), r = T(Number(t.decoyCount ?? ((v = t.nodeIntrusion) == null ? void 0 : v.decoyCount)) || 0, 0, i - 4), a = Math.max(0, i - r), s = T(Math.round(a * 0.48), 6, a), o = T(Number(t.routeCount ?? ((C = t.nodeIntrusion) == null ? void 0 : C.routeCount)) || 2, 1, 3), l = Ft(e), c = [], u = [];
  for (let g = 0; g < s; g += 1) {
    const M = g === 0 ? "start" : g === s - 1 ? "target" : `node-${g}`, D = g === 0 ? "start" : g === s - 1 ? "target" : "normal", R = g / Math.max(1, s - 1), $ = l.target.x - l.start.x, x = l.target.y - l.start.y, q = Math.sqrt($ * $ + x * x) || 1, W = -x / q, K = $ / q, G = Math.sin(R * Math.PI * (1.15 + e() * 0.6)) * (10 + e() * 8), Ye = g === 0 || g === s - 1 ? 0 : (e() - 0.5) * 5, Qe = g === 0 || g === s - 1 ? 0 : (e() - 0.5) * 12;
    c.push(oe(
      M,
      D,
      l.start.x + $ * R + W * G + Ye,
      l.start.y + x * R + K * G + Qe
    )), u.push(M), g > 0 && E(c, u[g - 1], M);
  }
  const d = /* @__PURE__ */ new Set([...u, ...kt(c, u, e, o)]);
  let f = c.length + 1;
  for (; c.length < i - r; ) {
    const g = he(c.filter((x) => x.type !== "target"), e) ?? c[0], M = `node-${f}`;
    f += 1;
    const D = e() > 0.45 ? he(c.filter((x) => x.id !== g.id && x.type !== "start"), e) : null, R = D ? [g.id, D.id] : [g.id], $ = xe(c, M, "normal", g, e, R, {
      radiusMin: 16,
      radiusMax: 31,
      biasX: e() > 0.35 ? 5 : -4,
      ySpread: 1.15
    });
    c.push($), E(c, g.id, M), D && E(c, M, D.id);
  }
  for (let g = 0; g < r; g += 1) {
    const M = he(c.filter(($) => $.type !== "target" && $.type !== "decoy"), e) ?? c[0], D = `decoy-${g + 1}`, R = xe(c, D, "decoy", M, e, [M.id], {
      radiusMin: 18,
      radiusMax: 34,
      biasX: e() > 0.5 ? -6 : 6,
      ySpread: 1.25
    });
    c.push(R), E(c, M.id, D);
  }
  const h = !!(t.allowFirewallOnMainPath ?? t.allowMainPathFirewalls ?? ((P = t.nodeIntrusion) == null ? void 0 : P.allowFirewallOnMainPath)), m = c.filter((g) => g.type === "start" || g.type === "target" || g.type === "decoy" ? !1 : h || !d.has(g.id)), I = T(Number(t.firewallCount ?? ((L = t.nodeIntrusion) == null ? void 0 : L.firewallCount)) || 0, 0, m.length);
  for (const g of Pt(m, e).slice(0, I))
    g.type = "firewall";
  Ot(c);
  const A = Rt(c, "start", "target");
  return {
    nodes: c,
    edges: Ne(c),
    startNodeId: "start",
    targetNodeId: "target",
    mainPathIds: u,
    safeRoutes: A,
    layoutScore: Ue(c)
  };
}
function Lt(t, n = Date.now()) {
  var r;
  const e = T(Math.ceil(Number(t.nodeCount ?? ((r = t.nodeIntrusion) == null ? void 0 : r.nodeCount)) || 10), 7, 14);
  let i = null;
  for (let a = 0; a < e; a += 1) {
    const s = Fe(t, `${n}:${a}`);
    if ((!i || s.layoutScore < i.layoutScore) && (i = s), s.layoutScore < 1 && s.safeRoutes > 1) break;
  }
  return i ?? Fe(t, n);
}
const Ve = "holosuite-hacking", Ht = `modules/${Ve}/templates/node-intrusion.html`, Et = ue();
function Q(t, n, e) {
  return Math.min(e, Math.max(n, t));
}
function Re(t) {
  return t === "start" ? "entry" : t === "target" ? "target" : t === "firewall" ? "firewall" : t === "decoy" ? "decoy" : "relay";
}
function _t(t, n, e) {
  const i = globalThis.crypto, r = typeof (i == null ? void 0 : i.randomUUID) == "function" ? i.randomUUID() : `${Date.now()}:${performance.now()}:${Math.random()}`;
  return `${t}:${n}:${e.profileId ?? e.id}:${r}`;
}
class qt extends Et {
  constructor(e = {}) {
    super(e);
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
    this.rollTotal = Number(e.rollTotal ?? 15), this.dc = Number(e.dc ?? 15), this.profile = e.profile ? { ...e.profile } : ae(this.rollTotal, this.dc), this.seed = e.seed ?? _t(this.rollTotal, this.dc, this.profile), this.onSuccess = typeof e.onSuccess == "function" ? e.onSuccess : null, this.onFailure = typeof e.onFailure == "function" ? e.onFailure : null, this.actorName = String(e.actorName ?? "Hacker"), this.chatOnResult = e.chatOnResult !== !1, this.graph = Lt(this.profile, this.seed), this.state = {
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
      template: Ht
    });
  }
  getData() {
    var s, o;
    const e = this.getCurrentNode(), i = e.connected, r = !!(this.profile.radarEnabled ?? ((s = this.profile.nodeIntrusion) == null ? void 0 : s.radarEnabled) ?? Number(this.profile.radarRange ?? ((o = this.profile.nodeIntrusion) == null ? void 0 : o.radarRange)) > 0), a = this.graph.nodes.map((l) => {
      const c = l.id === this.state.currentNodeId, u = this.state.visitedNodeIds.has(l.id), d = l.id === this.state.claimingNodeId, f = l.type === "target" && (u || this.profile.showTarget || this.profile.hintsEnabled), h = l.type !== "target" && (this.profile.hintsEnabled || l.revealed || u || l.type === "start"), m = f || h ? Re(l.type) : "unknown", A = r && (c || u || i.includes(l.id)) && l.type !== "start" && l.type !== "target" ? this.countAdjacentBadNodes(l.id) : 0, S = Q(A, 0, 2);
      return {
        ...l,
        visualType: f ? "target" : l.type === "target" ? "normal" : l.type,
        isTargetVisible: f,
        isCurrent: c,
        isVisited: u,
        isClaiming: d,
        isNeighbor: i.includes(l.id),
        canMove: i.includes(l.id) && !this.state.claimingNodeId && !this.state.blockedEdgeIds.has(j(e.id, l.id)) && !this.state.deadNodeIds.has(l.id),
        isDangerVisible: l.type !== "target" && (this.profile.hintsEnabled || l.revealed || u),
        dangerSignal: S,
        displayType: m,
        title: `${l.id} - ${m}${S ? ` / signal ${S}` : ""}`
      };
    });
    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      nodes: a,
      edges: this.graph.edges.map((l) => {
        const c = a.find((f) => f.id === l.from), u = a.find((f) => f.id === l.to), d = this.state.blockedEdgeIds.get(j(l.from, l.to));
        return {
          ...l,
          from: c,
          to: u,
          isVisitedPath: this.state.traversedEdgeIds.has(j(l.from, l.to)),
          isAvailable: !d && (i.includes(l.from) || i.includes(l.to)),
          isFirewallPath: d === "firewall",
          isDecoyPath: d === "decoy"
        };
      }),
      movement: this.state.movement,
      currentNode: {
        id: e.id,
        label: Re(e.type),
        availableRoutes: a.filter((l) => l.canMove).length
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
    super.activateListeners(e), e.find("[data-node-id]").on("click", (i) => this.handleNodeClick(i.currentTarget.dataset.nodeId)), e.find("[data-action='start']").on("click", () => this.startRun()), e.find("[data-action='abort']").on("click", () => this.abort()), this.syncDom();
  }
  async render(e, i) {
    const r = await super.render(e, i);
    return this.state.hasStarted && this.state.isRunning && this.startTimer(), r;
  }
  async close(e = {}) {
    return this.stopTimer(), this.claimTimer && window.clearTimeout(this.claimTimer), this.claimTimer = null, super.close(e);
  }
  getCurrentNode() {
    return this.graph.nodes.find((e) => e.id === this.state.currentNodeId) ?? this.graph.nodes[0];
  }
  getTraceDuration() {
    var r;
    const e = Number(game.settings.get(Ve, "traceDurationMultiplier") ?? 1) || 1, i = Number(((r = this.profile.nodeIntrusion) == null ? void 0 : r.traceDurationSeconds) ?? this.profile.traceDurationSeconds ?? 60);
    return Math.max(5, i * e);
  }
  countAdjacentBadNodes(e) {
    const i = this.graph.nodes.find((r) => r.id === e);
    return i ? i.connected.reduce((r, a) => {
      const s = this.graph.nodes.find((o) => o.id === a);
      return (s == null ? void 0 : s.type) === "firewall" || (s == null ? void 0 : s.type) === "decoy" ? r + 1 : r;
    }, 0) : 0;
  }
  firewallsArePassable() {
    var e;
    return !!(this.profile.allowFirewallOnMainPath ?? this.profile.allowMainPathFirewalls ?? ((e = this.profile.nodeIntrusion) == null ? void 0 : e.allowFirewallOnMainPath));
  }
  startRun() {
    this.state.hasStarted || this.state.result || (this.state.hasStarted = !0, this.state.isRunning = !0, this.startedAt = performance.now(), this.startTimer(), this.render(!1));
  }
  handleNodeClick(e) {
    var c, u, d, f;
    if (!this.state.hasStarted || !this.state.isRunning || this.state.claimingNodeId) return;
    const i = this.getCurrentNode(), r = this.graph.nodes.find((h) => h.id === e);
    if (!r) return;
    if (!i.connected.includes(e)) {
      (c = this.element) == null || c.find(".node-intrusion-shell").addClass("invalid-pulse"), window.setTimeout(() => {
        var h;
        return (h = this.element) == null ? void 0 : h.find(".node-intrusion-shell").removeClass("invalid-pulse");
      }, 280);
      return;
    }
    const a = j(i.id, e);
    if (this.state.blockedEdgeIds.has(a) || this.state.deadNodeIds.has(e)) {
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
    }, this.state.claimingNodeId = e, this.render(!1);
    const s = Math.max(0.1, Number(this.profile.claimDurationSeconds ?? ((d = this.profile.nodeIntrusion) == null ? void 0 : d.claimDurationSeconds)) || 0.5), o = Math.max(1, Number(this.profile.firewallClaimMultiplier ?? ((f = this.profile.nodeIntrusion) == null ? void 0 : f.firewallClaimMultiplier)) || 1), l = r.type === "firewall" ? s * o : s;
    this.claimTimer = window.setTimeout(() => {
      this.claimTimer = null, this.completeNodeClaim(i.id, e);
    }, l * 1e3);
  }
  completeNodeClaim(e, i) {
    var o, l, c, u, d, f;
    if (!this.state.hasStarted || !this.state.isRunning) return;
    const r = this.graph.nodes.find((h) => h.id === e), a = this.graph.nodes.find((h) => h.id === i);
    if (!r || !a) return;
    const s = j(r.id, i);
    if (this.state.claimingNodeId = null, this.state.visitedNodeIds.add(i), this.state.traversedEdgeIds.add(s), a.visited = !0, a.revealed = !0, a.type === "firewall") {
      this.state.mistakes += 1;
      const h = Number(this.profile.firewallPenaltySeconds ?? ((o = this.profile.nodeIntrusion) == null ? void 0 : o.firewallPenaltySeconds)) || 6;
      if (this.addTracePenalty(h), (c = (l = ui.notifications) == null ? void 0 : l.warn) == null || c.call(l, `Firewall surge: trace accelerated by ${h}s.`), this.state.result) return;
      this.firewallsArePassable() ? this.state.currentNodeId = i : (this.state.blockedEdgeIds.set(s, "firewall"), this.state.deadNodeIds.add(i)), this.render(!1);
      return;
    }
    if (a.type === "decoy") {
      this.state.mistakes += 1, this.state.blockedEdgeIds.set(s, "decoy"), this.state.deadNodeIds.add(i);
      const h = Number(this.profile.decoyPenaltySeconds ?? ((u = this.profile.nodeIntrusion) == null ? void 0 : u.decoyPenaltySeconds)) || 4;
      this.addTracePenalty(h), (f = (d = ui.notifications) == null ? void 0 : d.warn) == null || f.call(d, `Decoy sink: trace accelerated by ${h}s.`), this.render(!1);
      return;
    }
    if (this.state.currentNodeId = i, a.type === "target") {
      this.finish("success", "Target node breached");
      return;
    }
    this.render(!1);
  }
  addTracePenalty(e) {
    const i = Math.max(0, e) / this.getTraceDuration() * 100;
    this.state.tracePenaltyProgress = Q(this.state.tracePenaltyProgress + i, 0, 100), this.state.traceProgress = Q(this.state.traceProgress + i, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
  }
  startTimer() {
    if (this.timer || !this.state.hasStarted || !this.startedAt) return;
    const e = this.getTraceDuration();
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const i = (performance.now() - this.startedAt) / 1e3;
      this.state.traceProgress = Q(i / e * 100 + this.state.tracePenaltyProgress, 0, 100), this.syncDom(), this.state.traceProgress >= 100 && this.finish("failure", "Trace complete");
    }, 120);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(e, i, { close: r = !1 } = {}) {
    var s, o;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = e, this.stopTimer(), this.resultMessage = i, this.syncDom(), await this.render(!1);
    const a = {
      type: "node-intrusion",
      result: e,
      message: i,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      tracePenaltyProgress: this.state.tracePenaltyProgress,
      traceProgress: this.state.traceProgress,
      visitedNodeIds: [...this.state.visitedNodeIds]
    };
    this.chatOnResult && await ze({
      title: "Node Intrusion",
      result: e,
      actorName: this.actorName,
      message: i,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), e === "success" ? (s = this.onSuccess) == null || s.call(this, a) : (o = this.onFailure) == null || o.call(this, a), r && await this.close();
  }
  syncDom() {
    var s;
    const e = (s = this.element) == null ? void 0 : s[0];
    if (!e) return;
    const i = e.querySelector("[data-trace-fill]"), r = e.querySelector("[data-trace-text]"), a = e.querySelector("[data-penalty-text]");
    i && (i.style.width = `${this.state.traceProgress}%`), r && (r.textContent = `${Math.round(this.state.traceProgress)}%`), a && (a.textContent = `${Math.round(this.state.tracePenaltyProgress)}%`);
  }
}
function Be(t, n, e) {
  return Math.min(e, Math.max(n, t));
}
function Gt(t) {
  const n = String(t ?? "signal-alignment");
  let e = 2166136261;
  for (let i = 0; i < n.length; i += 1)
    e ^= n.charCodeAt(i), e = Math.imul(e, 16777619);
  return e >>> 0;
}
function jt(t) {
  let n = Gt(t);
  return () => {
    n += 1831565813;
    let e = n;
    return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
  };
}
function me(t) {
  return Be(Number(t) || 0, 0, 100);
}
function zt(t, n = Date.now()) {
  var a, s;
  const e = jt(n), i = Be(Number(t.channelCount ?? ((a = t.signalAlignment) == null ? void 0 : a.channelCount)) || 3, 2, 5), r = Number(t.tolerance ?? ((s = t.signalAlignment) == null ? void 0 : s.tolerance) ?? 5);
  return Array.from({ length: i }, (o, l) => {
    const c = Math.round(18 + e() * 64), u = e() > 0.5 ? 1 : -1, d = r + 8 + Math.round(e() * 18), f = e() > 0.5 ? 1 : -1;
    return {
      id: `channel-${l + 1}`,
      label: `CH-${String(l + 1).padStart(2, "0")}`,
      value: me(c + u * d),
      target: c,
      tolerance: r,
      driftDirection: f
    };
  });
}
const We = "holosuite-hacking", Ut = `modules/${We}/templates/signal-alignment.html`, Vt = ue();
function Z(t, n, e) {
  return Math.min(e, Math.max(n, t));
}
class Bt extends Vt {
  constructor(e = {}) {
    super(e);
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
    this.rollTotal = Number(e.rollTotal ?? 15), this.dc = Number(e.dc ?? 15), this.profile = e.profile ? { ...e.profile } : ae(this.rollTotal, this.dc), this.seed = e.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}:signal`, this.onSuccess = typeof e.onSuccess == "function" ? e.onSuccess : null, this.onFailure = typeof e.onFailure == "function" ? e.onFailure : null, this.actorName = String(e.actorName ?? "Hacker"), this.chatOnResult = e.chatOnResult !== !1, this.channels = zt(this.profile, this.seed), this.state = {
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
      template: Ut
    });
  }
  getData() {
    const e = this.channels.map((i) => {
      const r = Math.abs(i.value - i.target), a = r <= i.tolerance, s = this.isTargetVisible(i);
      return {
        ...i,
        valueLabel: i.value.toFixed(1),
        aligned: a,
        targetVisible: s,
        targetLabel: s ? i.target : "??",
        deltaRevealLabel: s ? r.toFixed(1) : "--",
        targetStateLabel: a ? "locked" : s ? "signal found" : "searching",
        waveDurationSeconds: Math.max(1.2, 3.2 - Number(this.profile.noiseLevel ?? 0) * 2),
        targetLeft: i.target,
        toleranceLeft: Z(i.target - i.tolerance, 0, 100),
        toleranceWidth: Z(i.tolerance * 2, 1, 100)
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
    super.activateListeners(e), e.find("[data-channel-slider]").on("input", (i) => this.handleSlider(i.currentTarget)), e.find("[data-action='start']").on("click", () => this.startRun()), e.find("[data-action='abort']").on("click", () => this.abort()), this.syncDom();
  }
  async render(e, i) {
    const r = await super.render(e, i);
    return this.state.hasStarted && this.state.isRunning && this.startTimer(), r;
  }
  async close(e = {}) {
    return this.stopTimer(), super.close(e);
  }
  startRun() {
    this.state.hasStarted || this.state.result || (this.state.hasStarted = !0, this.state.isRunning = !0, this.startedAt = performance.now(), this.lastTickAt = this.startedAt, this.startTimer(), this.render(!1));
  }
  handleSlider(e) {
    if (!this.state.hasStarted || !this.state.isRunning) return;
    const i = this.channels.find((r) => r.id === e.dataset.channelSlider);
    i && (i.value = me(e.value), this.checkDestabilization(), this.syncDom());
  }
  areAllChannelsAligned() {
    return this.channels.every((e) => Math.abs(e.value - e.target) <= e.tolerance);
  }
  isTargetVisible(e) {
    var a;
    const i = Math.abs(e.value - e.target), r = Number(this.profile.targetRevealRadius ?? ((a = this.profile.signalAlignment) == null ? void 0 : a.targetRevealRadius) ?? 100);
    return r >= 100 || i <= e.tolerance ? !0 : i <= r;
  }
  updateAlignmentState(e = this.areAllChannelsAligned()) {
    this.wasAligned && !e && this.recordTraceSpike(), this.wasAligned = e;
  }
  checkDestabilization() {
    this.updateAlignmentState();
  }
  recordTraceSpike() {
    var i, r;
    const e = Math.max(0, Number(this.profile.destabilizationPenaltySeconds ?? 0));
    this.state.mistakes += 1, this.state.tracePenaltySeconds += e, e > 0 && ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, `Signal destabilized. Trace jumped by ${e}s.`));
  }
  startTimer() {
    var a;
    if (this.timer || !this.state.hasStarted || !this.startedAt || !this.lastTickAt) return;
    const e = Number(game.settings.get(We, "traceDurationMultiplier") ?? 1) || 1, i = Number(((a = this.profile.signalAlignment) == null ? void 0 : a.traceDurationSeconds) ?? this.profile.traceDurationSeconds ?? 60), r = Math.max(5, i * e);
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const s = performance.now(), o = Math.min(0.5, (s - this.lastTickAt) / 1e3);
      this.lastTickAt = s, this.applyDrift(o);
      const l = this.areAllChannelsAligned();
      this.state.lockProgress = l ? Z(this.state.lockProgress + o / this.profile.lockHoldSeconds, 0, 1) : 0, this.updateAlignmentState(l);
      const c = (s - this.startedAt) / 1e3 + this.state.tracePenaltySeconds;
      this.state.traceProgress = Z(c / r * 100, 0, 100), this.syncDom(), this.state.lockProgress >= 1 ? this.finish("success", "Transmission Decrypted") : this.state.traceProgress >= 100 && this.finish("failure", "Trace Complete");
    }, 120);
  }
  applyDrift(e) {
    const i = Number(this.profile.signalDriftSpeed ?? 0);
    if (!(i <= 0))
      for (const r of this.channels)
        r.value = me(r.value + r.driftDirection * i * e), (r.value <= 0 || r.value >= 100) && (r.driftDirection *= -1);
  }
  stopTimer() {
    this.timer && (window.clearInterval(this.timer), this.timer = null);
  }
  async abort() {
    await this.finish("failure", "Manual disconnect", { close: !0 });
  }
  async finish(e, i, { close: r = !1 } = {}) {
    var s, o;
    if (this.state.result) return;
    this.state.isRunning = !1, this.state.result = e, this.stopTimer(), this.resultMessage = i, this.syncDom(), await this.render(!1);
    const a = {
      type: "signal-alignment",
      result: e,
      message: i,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      tracePenaltySeconds: this.state.tracePenaltySeconds,
      traceProgress: this.state.traceProgress,
      lockProgress: this.state.lockProgress,
      channels: this.channels.map((l) => ({ ...l }))
    };
    this.chatOnResult && await ze({
      title: "Signal Alignment",
      result: e,
      actorName: this.actorName,
      message: i,
      rollTotal: this.rollTotal,
      dc: this.dc
    }), e === "success" ? (s = this.onSuccess) == null || s.call(this, a) : (o = this.onFailure) == null || o.call(this, a), r && await this.close();
  }
  syncDom() {
    var l;
    const e = (l = this.element) == null ? void 0 : l[0];
    if (!e) return;
    const i = e.querySelector("[data-trace-fill]"), r = e.querySelector("[data-trace-text]"), a = e.querySelector("[data-mistake-text]"), s = e.querySelector("[data-lock-fill]"), o = e.querySelector("[data-lock-text]");
    i && (i.style.width = `${this.state.traceProgress}%`), r && (r.textContent = `${Math.round(this.state.traceProgress)}%`), a && (a.textContent = `${this.state.tracePenaltySeconds.toFixed(0)}s`), s && (s.style.width = `${Math.round(this.state.lockProgress * 100)}%`), o && (o.textContent = `${Math.round(this.state.lockProgress * 100)}%`);
    for (const c of this.channels) {
      const u = e.querySelector(`[data-channel-row="${c.id}"]`);
      if (!u) continue;
      const d = Math.abs(c.value - c.target) <= c.tolerance, f = this.isTargetVisible(c);
      u.classList.toggle("is-aligned", d), u.classList.toggle("is-target-visible", f), u.querySelector("[data-channel-value]").textContent = c.value.toFixed(1), u.querySelector("[data-channel-target]").textContent = f ? String(c.target) : "??", u.querySelector("[data-channel-delta]").textContent = f ? Math.abs(c.value - c.target).toFixed(1) : "--", u.querySelector("[data-channel-state]").textContent = d ? "locked" : f ? "signal found" : "searching";
      const h = u.querySelector("[data-channel-slider]");
      h && document.activeElement !== h && (h.value = c.value);
      const m = u.querySelector("[data-wave-fill]");
      m && (m.style.width = `${c.value}%`, m.style.setProperty("--wave-duration", `${Math.max(1.2, 3.2 - Number(this.profile.noiseLevel ?? 0) * 2)}s`));
    }
  }
}
const w = "holosuite-hacking", Ce = `module.${w}`, Wt = 10 * 60 * 1e3;
let N = null, ee = null;
const le = /* @__PURE__ */ new Map();
function Kt() {
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
    hint: "Tune Node Intrusion maps and Signal Alignment channels, drift, reveal radius, hold time, and trace pressure.",
    icon: "fas fa-sliders",
    type: Nt,
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
function Xt() {
  Pe({
    id: "node-intrusion",
    title: "Node Intrusion",
    icon: "fa-solid fa-network-wired",
    create: (t) => new qt(t)
  }), Pe({
    id: "signal-alignment",
    title: "Signal Alignment",
    icon: "fa-solid fa-wave-square",
    create: (t) => new Bt(t)
  });
}
function Ke() {
  var t, n, e;
  return (t = game.user) != null && t.isGM ? (ee = ee ?? new pt({ api: N }), ee.render(!0), ee) : ((e = (n = ui.notifications) == null ? void 0 : n.warn) == null || e.call(n, "Only the GM can open HoloSuite Hacking."), null);
}
function Xe() {
  N = N ?? ot({ moduleId: w, openLauncher: Ke }), N.sendHackToPlayer = Jt, N.registerWithHoloSuite = pe;
  const t = game.modules.get(w);
  return t && (t.api = N), game.holosuiteHacking = N, N;
}
function Jt(t = {}) {
  var o, l, c, u, d, f, h;
  if (!((o = game.user) != null && o.isGM))
    return (c = (l = ui.notifications) == null ? void 0 : l.warn) == null || c.call(l, "Only the GM can send HoloSuite hacking challenges."), !1;
  if (!game.socket)
    return (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(u, "Foundry sockets are not available."), !1;
  const n = Je(t), e = be(n.userId), i = Me(n.actorId, e);
  i ? e && !V(i, e) && console.warn(`${w} | ${e.name} does not appear to own ${i.name}; sending fallback roll data anyway.`) : console.warn(`${w} | Could not resolve hacker actor.`, {
    actorId: n.actorId,
    userId: n.userId,
    availableUsers: Se().map((m) => ({ id: m.id, name: m.name, isGM: m.isGM })),
    userCharacter: U(e),
    ownedActors: Ie(e).map((m) => ({ id: m.id, name: m.name }))
  });
  const r = He(i, n.skillId), a = n.skillLabel || ce(n.skillId, r), s = Number.isFinite(Number(n.skillModifier)) && Number(n.skillModifier) !== 0 ? Number(n.skillModifier) : ve(r);
  if (typeof t.onSuccess == "function" || typeof t.onFailure == "function") {
    const m = window.setTimeout(() => le.delete(n.requestId), Wt);
    le.set(n.requestId, {
      onSuccess: typeof t.onSuccess == "function" ? t.onSuccess : null,
      onFailure: typeof t.onFailure == "function" ? t.onFailure : null,
      timeoutId: m
    });
  }
  return game.socket.emit(Ce, {
    type: "launch-request",
    payload: {
      ...n,
      actorId: (i == null ? void 0 : i.id) ?? "",
      actorName: (i == null ? void 0 : i.name) ?? (e == null ? void 0 : e.name) ?? "Hacker",
      skillLabel: a,
      skillModifier: s,
      gmUserId: game.user.id
    }
  }), (h = (f = ui.notifications) == null ? void 0 : f.info) == null || h.call(f, `${de(n.minigameType)} sent${e ? ` to ${e.name}` : " to players"}.`), !0;
}
function Yt(t) {
  var n, e, i, r;
  try {
    if ((t == null ? void 0 : t.type) === "result-report") {
      tn(t.payload ?? {});
      return;
    }
    if ((t == null ? void 0 : t.type) !== "launch-request") return;
    const a = Je(t.payload ?? {});
    if (a.userId && a.userId !== ((n = game.user) == null ? void 0 : n.id) || !a.userId && ((e = game.user) != null && e.isGM)) return;
    const s = Me(a.actorId, be(a.userId) ?? game.user), o = a.actorName || (s == null ? void 0 : s.name) || "Intruder", l = a.skillLabel || ce(a.skillId, He(s, a.skillId));
    new Dialog({
      title: de(a.minigameType),
      content: nn(a, o, l),
      buttons: {
        start: {
          icon: '<i class="fa-solid fa-terminal"></i>',
          label: "Accept and roll",
          callback: async () => Qt(a)
        }
      },
      default: "start"
    }, {
      classes: ["holosuite-hacking-start-dialog"],
      width: 520,
      height: 320,
      resizable: !0
    }).render(!0);
  } catch (a) {
    console.error(`${w} | Failed to handle hacking launch request.`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(i, "HoloSuite Hacking launch failed. See console for details.");
  }
}
async function Qt(t) {
  const n = Me(t.actorId, be(t.userId) ?? game.user), e = await Zt(t);
  if (!Number.isFinite(e == null ? void 0 : e.total)) return null;
  const i = {
    rollTotal: e.total,
    naturalRoll: e.naturalRoll,
    dc: t.dc,
    actorId: t.actorId,
    actorName: (n == null ? void 0 : n.name) ?? t.actorName ?? "Hacker",
    userId: t.userId,
    skillId: t.skillId,
    onSuccess: (r) => ke(t, r),
    onFailure: (r) => ke(t, r)
  };
  return t.minigameType === "signal-alignment" ? N.startSignalAlignment(i) : N.startNodeIntrusion(i);
}
async function Zt(t) {
  var n, e;
  try {
    const i = Number(t.skillModifier ?? 0), r = `1d20 ${i >= 0 ? "+" : "-"} ${Math.abs(i)}`, a = await new Roll(r).evaluate({ async: !0 });
    return await a.toMessage({
      speaker: ChatMessage.getSpeaker(),
      flavor: `${F(de(t.minigameType))}: ${F(t.skillLabel || t.skillId || "Skill")} vs DC ${Number(t.dc)}`
    }), {
      total: Number(a.total),
      naturalRoll: en(a),
      roll: a
    };
  } catch (i) {
    return console.error(`${w} | Fallback skill roll failed.`, i), (e = (n = ui.notifications) == null ? void 0 : n.warn) == null || e.call(n, "HoloSuite Hacking skill check failed."), null;
  }
}
function en(t) {
  var a, s, o, l, c;
  const e = ((t == null ? void 0 : t.dice) ?? ((s = (a = t == null ? void 0 : t.terms) == null ? void 0 : a.filter) == null ? void 0 : s.call(a, (u) => (u == null ? void 0 : u.faces) === 20)) ?? []).find((u) => Number(u == null ? void 0 : u.faces) === 20), i = (c = (l = (o = e == null ? void 0 : e.results) == null ? void 0 : o.find) == null ? void 0 : l.call(o, (u) => !u.discarded && !u.rerolled)) == null ? void 0 : c.result, r = Number(i);
  return Number.isFinite(r) ? r : null;
}
function ke(t, n) {
  var e, i;
  (i = (e = game.socket) == null ? void 0 : e.emit) == null || i.call(e, Ce, {
    type: "result-report",
    payload: {
      requestId: t.requestId,
      gmUserId: t.gmUserId,
      result: n
    }
  });
}
function tn(t = {}) {
  var i, r, a;
  if (!((i = game.user) != null && i.isGM) || t.gmUserId !== game.user.id) return;
  const n = le.get(t.requestId);
  le.delete(t.requestId), n != null && n.timeoutId && window.clearTimeout(n.timeoutId);
  const e = t.result ?? {};
  e.result === "success" ? (r = n == null ? void 0 : n.onSuccess) == null || r.call(n, e) : (a = n == null ? void 0 : n.onFailure) == null || a.call(n, e);
}
function nn(t, n, e) {
  return `
    <section class="holosuite-hacking-start-prompt">
      <p>Incoming hacking challenge</p>
      <h2>${F(de(t.minigameType))}</h2>
      <div>${F(n)} rolls ${F(e)} vs DC ${Number(t.dc)}</div>
    </section>
  `;
}
function Je(t = {}) {
  const n = Number(game.settings.get(w, "defaultDc") ?? 15);
  return {
    requestId: String(t.requestId ?? foundry.utils.randomID()),
    minigameType: String(t.minigameType ?? t.type ?? "node-intrusion"),
    userId: String(t.userId ?? ""),
    actorId: String(t.actorId ?? ""),
    actorName: String(t.actorName ?? ""),
    skillId: String(t.skillId ?? ""),
    skillLabel: String(t.skillLabel ?? ""),
    skillModifier: Number(t.skillModifier ?? 0),
    dc: Number(t.dc ?? n),
    gmUserId: String(t.gmUserId ?? "")
  };
}
function Me(t, n) {
  const e = _(t);
  if (e) return e;
  const i = U(n);
  if (i) return i;
  const r = Ie(n);
  if (r.length === 1) return r[0];
  const a = lt();
  return a && V(a, n) ? a : null;
}
function de(t) {
  var n, e;
  return ((e = (n = N == null ? void 0 : N.getMinigames) == null ? void 0 : n.call(N).find((i) => i.id === t)) == null ? void 0 : e.title) ?? String(t ?? "Hacking");
}
function pe() {
  var n, e;
  const t = ((n = game.modules.get("holosuite-core")) == null ? void 0 : n.api) ?? game.holosuite;
  return typeof (t == null ? void 0 : t.registerApp) != "function" ? !1 : ((e = t.unregisterApp) == null || e.call(t, "node-intrusion"), t.registerApp({
    id: w,
    title: "HoloSuite Hacking",
    icon: "fa-solid fa-terminal",
    premium: !1,
    featureId: w,
    playerVisible: !1,
    description: "Reusable hacking minigames for terminals, traces, and signal puzzles.",
    open: () => Ke()
  }), !0);
}
Hooks.once("init", () => {
  Kt(), Xt(), Xe();
});
Hooks.once("ready", () => {
  var t, n;
  Xe(), (n = (t = game.socket) == null ? void 0 : t.on) == null || n.call(t, Ce, Yt), pe(), window.setTimeout(() => pe(), 500), console.log(`${w} | Ready. API available at game.modules.get("${w}").api`);
});
