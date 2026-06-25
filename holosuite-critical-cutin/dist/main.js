var fe = Object.defineProperty;
var ge = (e, t, n) => t in e ? fe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var I = (e, t, n) => ge(e, typeof t != "symbol" ? t + "" : t, n);
const f = "holosuite-critical-cutin", Z = "HoloSuite Critical Cut-In", F = `module.${f}`, he = `modules/${f}/templates/player-config.hbs`, o = {
  enabled: "enabled",
  threshold: "threshold",
  failureThreshold: "failureThreshold",
  duration: "duration",
  volume: "volume",
  audience: "audience",
  textEnabled: "textEnabled",
  defaultText: "defaultText",
  defaultFailureText: "defaultFailureText",
  debug: "debug",
  playerConfigs: "playerConfigs"
}, v = {
  everyone: "everyone",
  gm: "gm",
  triggeringPlayer: "triggeringPlayer"
};
function me(e) {
  game.settings.register(f, o.enabled, {
    name: "Enable Critical Cut-In",
    hint: "Play a configured cut-in when a qualifying natural d20 result is rolled.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(f, o.threshold, {
    name: "Default Trigger Threshold",
    hint: "Natural d20 results equal to or above this number trigger the cut-in. Example: 19 triggers on 19 and 20.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 1, max: 20, step: 1 },
    default: 20
  }), game.settings.register(f, o.failureThreshold, {
    name: "Default Failure Trigger",
    hint: "Natural d20 results equal to or below this number trigger the failure cut-in. Example: 1 triggers only on a natural 1.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 1, max: 20, step: 1 },
    default: 1
  }), game.settings.register(f, o.duration, {
    name: "Animation Duration",
    hint: "How long the cut-in remains visible, in milliseconds.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 800, max: 8e3, step: 100 },
    default: 2500
  }), game.settings.register(f, o.volume, {
    name: "Cut-In Audio Volume",
    hint: "Volume multiplier for configured cut-in audio samples.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 0.8
  }), game.settings.register(f, o.audience, {
    name: "Show Animation To",
    hint: "Choose who sees synchronized cut-in playback.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      [v.everyone]: "Everyone",
      [v.gm]: "GM only",
      [v.triggeringPlayer]: "Triggering player only"
    },
    default: v.everyone
  }), game.settings.register(f, o.textEnabled, {
    name: "Enable Text Overlay",
    hint: "Show the configured label during the cut-in.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(f, o.defaultText, {
    name: "Default Overlay Text",
    hint: "Fallback label used when no player-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL"
  }), game.settings.register(f, o.defaultFailureText, {
    name: "Default Failure Overlay Text",
    hint: "Fallback label used when no failure-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL FAILURE"
  }), game.settings.register(f, o.debug, {
    name: "Debug Logging",
    hint: "Log roll detection and playback decisions to the console.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(f, o.playerConfigs, {
    name: "Per-Player Cut-In Configuration",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.registerMenu(f, "playerConfigMenu", {
    name: "Configure Player Cut-Ins",
    label: "Open Configuration",
    hint: "Set each user or actor portrait, audio sample, label, accent color, and enable state.",
    icon: "fa-solid fa-bolt",
    type: e,
    restricted: !0
  });
}
function d(e) {
  return game.settings.get(f, e);
}
async function N(e, t) {
  return game.settings.set(f, e, t);
}
function k() {
  return Math.min(20, Math.max(1, Number(d(o.threshold) || 20)));
}
function $() {
  return Math.min(20, Math.max(1, Number(d(o.failureThreshold) || 1)));
}
function ee() {
  const e = d(o.playerConfigs);
  return foundry.utils.deepClone(e && typeof e == "object" ? e : {});
}
async function B(e) {
  return N(o.playerConfigs, e && typeof e == "object" ? e : {});
}
function E(...e) {
  d(o.debug) && console.log(`${f} |`, ...e);
}
const C = [], P = /* @__PURE__ */ new Set();
let L = !1;
function M(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function pe(e) {
  var n, a, i, r, c;
  if (e != null && e.blind && !((n = game.user) != null && n.isGM) || Array.isArray(e == null ? void 0 : e.whisper) && e.whisper.length && !e.whisper.includes((a = game.user) == null ? void 0 : a.id) && !((i = game.user) != null && i.isGM))
    return !1;
  const t = (e == null ? void 0 : e.audience) ?? d(o.audience);
  return t === v.everyone ? !0 : t === v.gm ? ((r = game.user) == null ? void 0 : r.isGM) === !0 : t === v.triggeringPlayer ? ((c = game.user) == null ? void 0 : c.id) === (e == null ? void 0 : e.userId) : !0;
}
async function ye(e, t) {
  var n, a;
  if (e)
    try {
      const i = Math.min(1, Math.max(0, Number(t ?? d(o.volume) ?? 0.8)));
      if ((a = (n = foundry.audio) == null ? void 0 : n.AudioHelper) != null && a.play)
        return foundry.audio.AudioHelper.play({ src: e, volume: i, autoplay: !0, loop: !1 }, !1);
      const r = globalThis.AudioHelper;
      if (r != null && r.play)
        return r.play({ src: e, volume: i, autoplay: !0, loop: !1 }, !1);
      const c = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), s = new Audio(e);
      return s.volume = i * c, await s.play(), s;
    } catch (i) {
      return E("Audio playback failed.", { src: e, error: i }), null;
    }
}
function ve(e) {
  try {
    if (!e) return;
    if (typeof e.stop == "function") {
      e.stop();
      return;
    }
    typeof e.pause == "function" && (e.pause(), e.currentTime = 0);
  } catch (t) {
    E("Audio stop failed.", t);
  }
}
function be(e) {
  const t = e.accentColor || "#69e8ff", n = ["strike", "breach", "signal"].includes(e.animationStyle) ? e.animationStyle : "strike", a = e.triggerKind === "failure" ? "failure" : "success", i = e.imagePath ? `<img class="hcci-portrait" src="${M(e.imagePath)}" alt="">` : '<div class="hcci-portrait hcci-portrait-fallback"><i class="fa-solid fa-user-astronaut"></i></div>', r = e.imagePath ? [0, 1, 2, 3].map((h) => `<div class="hcci-fracture hcci-fracture-${h + 1}" style="background-image: url('${M(e.imagePath)}')"></div>`).join("") : "", c = Math.max(1, String(e.overlayText ?? "").length), s = e.textEnabled && e.overlayText ? `<div class="hcci-title" style="--hcci-title-chars: ${c}">${M(e.overlayText)}</div>` : "", l = e.actorName || e.userName || "", u = document.createElement("div");
  return u.className = `hcci-overlay hcci-style-${n} hcci-kind-${a}`, u.style.setProperty("--hcci-accent", t), u.innerHTML = `
    <div class="hcci-flash"></div>
    <div class="hcci-noise"></div>
    <div class="hcci-ring hcci-ring-a"></div>
    <div class="hcci-ring hcci-ring-b"></div>
    <div class="hcci-orbit-glow"></div>
    <div class="hcci-panel hcci-panel-a"></div>
    <div class="hcci-panel hcci-panel-b"></div>
    <div class="hcci-tear hcci-tear-top"><span></span></div>
    <div class="hcci-tear hcci-tear-bottom"><span></span></div>
    <div class="hcci-triangle hcci-triangle-a"></div>
    <div class="hcci-triangle hcci-triangle-b"></div>
    <div class="hcci-triangle hcci-triangle-c"></div>
    <div class="hcci-sparkle hcci-sparkle-a"></div>
    <div class="hcci-sparkle hcci-sparkle-b"></div>
    <div class="hcci-scan hcci-scan-a"></div>
    <div class="hcci-scan hcci-scan-b"></div>
    <div class="hcci-scan hcci-scan-c"></div>
    <div class="hcci-diagonal hcci-diagonal-a"></div>
    <div class="hcci-diagonal hcci-diagonal-b"></div>
    <section class="hcci-stage">
      <div class="hcci-portrait-frame">
        ${i}
        ${r}
        <div class="hcci-frame-lightning hcci-frame-lightning-a"></div>
        <div class="hcci-frame-lightning hcci-frame-lightning-b"></div>
      </div>
      <div class="hcci-copy">
        ${s}
        ${l ? `<div class="hcci-subtitle">${M(l)}</div>` : ""}
      </div>
    </section>
  `, u;
}
async function Te(e) {
  if (!pe(e)) return;
  const t = Math.min(8e3, Math.max(800, Number(e.duration ?? d(o.duration) ?? 2500))), n = be(e);
  n.style.setProperty("--hcci-duration", `${t}ms`), document.body.appendChild(n), document.body.classList.add("hcci-screen-shake");
  const a = ye(e.audioPath, e.volume);
  await new Promise((i) => window.setTimeout(i, Math.max(250, t - 250))), ve(await a), n.classList.add("hcci-exiting"), await new Promise((i) => window.setTimeout(i, 250)), n.remove(), document.body.classList.remove("hcci-screen-shake");
}
async function we() {
  if (!L) {
    for (L = !0; C.length; ) {
      const e = C.shift();
      await Te(e);
    }
    L = !1;
  }
}
function x(e) {
  if (e) {
    if (e.id) {
      if (P.has(e.id)) return;
      P.add(e.id);
      const t = P.values().next().value;
      P.size > 100 && t && P.delete(t);
    }
    C.push(e), C.length > 3 && C.splice(1, C.length - 3), we();
  }
}
const S = /* @__PURE__ */ new Set();
function Ce(e, t) {
  var c, s, l, u, h, g;
  if ([...(t == null ? void 0 : t.terms) ?? [], ...(t == null ? void 0 : t.dice) ?? []].some((m) => m && m.faces === 20)) return !1;
  const a = (e == null ? void 0 : e.flags) ?? {}, i = ((s = (c = a.dnd5e) == null ? void 0 : c.roll) == null ? void 0 : s.type) ?? ((u = (l = a.dnd5e) == null ? void 0 : l.roll) == null ? void 0 : u.rollType), r = (g = (h = a.pf2e) == null ? void 0 : h.context) == null ? void 0 : g.type;
  return [i, r].some((m) => String(m ?? "").toLowerCase().includes("damage"));
}
function Ae(e) {
  const t = [], n = [...(e == null ? void 0 : e.terms) ?? [], ...(e == null ? void 0 : e.dice) ?? []], a = /* @__PURE__ */ new Set();
  for (const i of n)
    if (!a.has(i) && (a.add(i), !(!i || i.faces !== 20 || !Array.isArray(i.results))))
      for (const r of i.results) {
        if (r.active === !1 || r.discarded === !0) continue;
        const c = Number(r.result);
        Number.isInteger(c) && t.push(c);
      }
  return t;
}
function te(e, t) {
  return `${e}:${t}`;
}
function Pe() {
  return te("gm", "default");
}
function Se(e) {
  return ["strike", "breach", "signal"].includes(e) ? e : "strike";
}
function ie(e, t) {
  var a, i, r, c;
  if (!e || !t) return !1;
  const n = ((i = (a = globalThis.CONST) == null ? void 0 : a.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : i.OWNER) ?? 3;
  return Number(((r = e.ownership) == null ? void 0 : r[t]) ?? ((c = e.ownership) == null ? void 0 : c.default) ?? 0) >= n;
}
function xe(e) {
  var n;
  const t = (e == null ? void 0 : e.speaker) ?? {};
  return t.actor ? ((n = game.actors) == null ? void 0 : n.get(t.actor)) ?? null : e != null && e.actor ? e.actor : null;
}
function Me(e, t) {
  var i, r, c, s;
  const n = ((i = e == null ? void 0 : e.user) == null ? void 0 : i.id) ?? (e == null ? void 0 : e.user) ?? (e == null ? void 0 : e.userId), a = (r = game.users) == null ? void 0 : r.get(n);
  if (a && !a.isGM) return a;
  if (t) {
    const l = (c = game.users) == null ? void 0 : c.find((u) => !u.isGM && ie(t, u.id));
    if (l) return l;
  }
  return a ?? ((s = game.users) == null ? void 0 : s.get(n)) ?? null;
}
function W(e = {}, t, n) {
  const a = t === "failure" ? $() : k(), i = d(t === "failure" ? o.defaultFailureText : o.defaultText), r = t === "failure" ? "#ff4d7d" : "#69e8ff", c = t === "failure" ? e.failure ?? {} : e, s = Number(c.threshold);
  return {
    kind: t,
    enabled: c.enabled !== !1,
    threshold: Number.isInteger(s) && s >= 1 && s <= 20 ? s : a,
    animationStyle: Se(c.animationStyle),
    imagePath: c.imagePath || (n == null ? void 0 : n.img) || "",
    audioPath: c.audioPath || "",
    overlayText: c.overlayText || i,
    accentColor: c.accentColor || r
  };
}
function D(e, t, n = "success") {
  const a = ee(), i = t ? a[te("actor", t.id)] : null, r = e != null && e.isGM ? a[Pe()] : null;
  return !t && !(e != null && e.isGM) && !i ? W({ enabled: !1 }, n, t) : W(i ?? r ?? {}, n, t);
}
function Ne(e, t, n, a, i) {
  return i.enabled ? {
    id: foundry.utils.randomID(),
    messageId: e.id,
    userId: (a == null ? void 0 : a.id) ?? null,
    actorId: (n == null ? void 0 : n.id) ?? null,
    userName: (a == null ? void 0 : a.name) ?? "",
    actorName: (n == null ? void 0 : n.name) ?? (a == null ? void 0 : a.name) ?? "",
    triggerKind: i.kind ?? "success",
    naturalResult: t,
    threshold: i.threshold,
    animationStyle: i.animationStyle,
    blind: e.blind === !0,
    whisper: Array.isArray(e.whisper) ? [...e.whisper] : [],
    imagePath: i.imagePath || "",
    audioPath: i.audioPath || "",
    overlayText: i.overlayText || "",
    accentColor: i.accentColor || "#69e8ff",
    textEnabled: d(o.textEnabled),
    duration: d(o.duration),
    volume: d(o.volume),
    audience: d(o.audience)
  } : (E("Cut-in disabled for target.", { userId: a == null ? void 0 : a.id, actorId: n == null ? void 0 : n.id }), null);
}
function Q(e, t, n = "success") {
  var a;
  if (!(e != null && e.isRoll) && !((a = e == null ? void 0 : e.rolls) != null && a.length)) return null;
  for (const i of e.rolls ?? []) {
    if (Ce(e, i)) continue;
    const r = Ae(i), c = n === "failure" ? r.find((s) => s <= t) : r.find((s) => s >= t);
    if (c) return c;
  }
  return null;
}
function ke() {
  var n, a;
  const t = (((n = game.users) == null ? void 0 : n.filter((i) => i.active && i.isGM)) ?? []).sort((i, r) => i.id.localeCompare(r.id))[0];
  return ((a = game.user) == null ? void 0 : a.isGM) && (!t || t.id === game.user.id);
}
function Ee() {
  var e;
  Hooks.on("createChatMessage", (t) => {
    var m;
    if (!d(o.enabled) || !ke() || S.has(t.id)) return;
    S.add(t.id);
    const n = S.values().next().value;
    S.size > 200 && n && S.delete(n);
    const a = xe(t), i = Me(t, a), r = D(i, a, "success"), c = D(i, a, "failure"), s = Q(t, c.threshold, "failure"), l = s ? null : Q(t, r.threshold, "success"), u = s ?? l;
    if (!u) return;
    const g = Ne(t, u, a, i, s ? c : r);
    g && (E("Triggering cut-in.", g), (m = game.socket) == null || m.emit(F, { type: "play", payload: g }), x(g));
  }), (e = game.socket) == null || e.on(F, (t) => {
    (t == null ? void 0 : t.type) === "play" && d(o.enabled) && x(t.payload);
  });
}
function ae(e, t = {}) {
  var c, s;
  const n = (c = game.users) == null ? void 0 : c.get(e), a = t.actorId ? (s = game.actors) == null ? void 0 : s.get(t.actorId) : (n == null ? void 0 : n.character) ?? null, i = t.triggerKind === "failure" ? "failure" : "success", r = D(n, a, i);
  return {
    id: foundry.utils.randomID(),
    userId: e,
    actorId: (a == null ? void 0 : a.id) ?? null,
    userName: (n == null ? void 0 : n.name) ?? "",
    actorName: (a == null ? void 0 : a.name) ?? (n == null ? void 0 : n.name) ?? "",
    naturalResult: t.naturalResult ?? 20,
    triggerKind: i,
    threshold: t.threshold ?? r.threshold ?? k(),
    animationStyle: t.animationStyle ?? r.animationStyle ?? "strike",
    imagePath: t.imagePath ?? r.imagePath ?? "",
    audioPath: t.audioPath ?? r.audioPath ?? "",
    overlayText: t.overlayText ?? r.overlayText ?? d(o.defaultText),
    accentColor: t.accentColor ?? r.accentColor ?? "#69e8ff",
    textEnabled: t.textEnabled ?? d(o.textEnabled),
    duration: t.duration ?? d(o.duration),
    volume: t.volume ?? d(o.volume),
    audience: t.audience ?? d(o.audience)
  };
}
function Oe(e, t = {}) {
  var i, r;
  const n = (i = game.actors) == null ? void 0 : i.get(e), a = ((r = game.users) == null ? void 0 : r.find((c) => !c.isGM && ie(n, c.id))) ?? game.user;
  return ae(a == null ? void 0 : a.id, { ...t, actorId: e });
}
function J(e) {
  var t;
  (t = game.socket) == null || t.emit(F, { type: "play", payload: e }), x(e);
}
function ne() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) ?? null;
}
function re() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : n.api) ?? null;
}
function Ie(e = {}, t = {}) {
  var a, i, r;
  const n = ((i = (a = globalThis.foundry) == null ? void 0 : a.utils) == null ? void 0 : i.mergeObject) ?? ((r = foundry == null ? void 0 : foundry.utils) == null ? void 0 : r.mergeObject);
  return typeof n == "function" ? n(e, t, { inplace: !1 }) : { ...e, ...t };
}
function Le() {
  var e, t, n, a, i;
  return ((n = (t = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : t.randomID) == null ? void 0 : n.call(t, 8)) ?? ((i = (a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.randomID) == null ? void 0 : i.call(a, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function X(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${Le()}`),
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
function ce(e) {
  return class extends e {
    constructor(a = {}) {
      const i = Ie(new.target.defaultOptions ?? {}, a);
      super(X(i));
      I(this, "_v1Options");
      this._v1Options = i;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return X(this.defaultOptions ?? {});
    }
    activateListeners(a) {
    }
    async _renderHTML(a, i) {
      var u, h, g;
      const r = typeof this.getData == "function" ? await this.getData() : {}, c = ((u = this._v1Options) == null ? void 0 : u.template) ?? ((h = this.options) == null ? void 0 : h.template) ?? ((g = this.constructor.defaultOptions) == null ? void 0 : g.template);
      if (!c) return document.createDocumentFragment();
      const s = await globalThis.renderTemplate(c, r), l = document.createElement("template");
      return l.innerHTML = s.trim(), l.content;
    }
    _activateV1Form(a) {
      var r, c;
      if (typeof this._updateObject != "function") return;
      const i = (r = a.matches) != null && r.call(a, "form") ? a : (c = a.querySelector) == null ? void 0 : c.call(a, "form");
      i instanceof HTMLFormElement && i.addEventListener("submit", async (s) => {
        var u;
        s.preventDefault(), s.stopPropagation();
        const l = new FormData(i);
        await this._updateObject(s, l), ((u = this._v1Options) == null ? void 0 : u.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(a, i, r) {
      var h, g, m, A;
      i.replaceChildren(a);
      const c = globalThis.jQuery ?? globalThis.$, s = ((h = i.closest) == null ? void 0 : h.call(i, ".window-app, .app, .application")) ?? i, l = c ? c(s) : s;
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
      const u = (g = this._v1Options) == null ? void 0 : g.classes;
      Array.isArray(u) && u.length && (i.classList.add(...u), (A = (m = i.closest) == null ? void 0 : m.call(i, ".window-app, .app, .application")) == null || A.classList.add(...u)), this._activateV1Form(i), typeof this.activateListeners == "function" && this.activateListeners(c ? c(i) : i);
    }
  };
}
function Fe() {
  const e = ne(), t = re(), n = globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (n) return n;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? ce(a) : null;
}
function $e() {
  const e = ne(), t = re(), n = globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (n) return n;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? ce(a) : Fe();
}
const De = $e();
function se(e, t) {
  return `${e}:${t}`;
}
function _e() {
  return se("gm", "default");
}
function Ge(e, t) {
  var a, i, r, c;
  const n = ((i = (a = globalThis.CONST) == null ? void 0 : a.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : i.OWNER) ?? 3;
  return Number(((r = t == null ? void 0 : t.ownership) == null ? void 0 : r[e.id]) ?? ((c = t == null ? void 0 : t.ownership) == null ? void 0 : c.default) ?? 0) >= n;
}
function Y(e = {}, { defaultAccent: t = "#69e8ff" } = {}) {
  const n = Number(e.threshold), a = ["strike", "breach", "signal"].includes(e.animationStyle) ? e.animationStyle : "strike";
  return {
    enabled: e.enabled !== !1,
    threshold: Number.isInteger(n) && n >= 1 && n <= 20 ? n : "",
    animationStyle: a,
    animationStyles: [
      { value: "strike", label: "Neon Strike", selected: a === "strike" },
      { value: "breach", label: "Panel Breach", selected: a === "breach" },
      { value: "signal", label: "Signal Bloom", selected: a === "signal" }
    ],
    imagePath: String(e.imagePath ?? ""),
    audioPath: String(e.audioPath ?? ""),
    overlayText: String(e.overlayText ?? ""),
    accentColor: String(e.accentColor ?? t)
  };
}
function Re(e = {}) {
  return {
    success: Y(e, { defaultAccent: "#69e8ff" }),
    failure: Y(e.failure, { defaultAccent: "#ff4d7d" })
  };
}
function He() {
  var n, a, i;
  const e = ((n = game.users) == null ? void 0 : n.find((r) => r.isGM && r.active)) ?? ((a = game.users) == null ? void 0 : a.find((r) => r.isGM)) ?? game.user, t = [{
    key: _e(),
    type: "gm",
    typeLabel: "GM",
    id: "default",
    name: "GM Cut-In",
    portrait: (e == null ? void 0 : e.avatar) || "icons/svg/mystery-man.svg"
  }];
  for (const r of game.actors ?? []) {
    const c = ((i = game.users) == null ? void 0 : i.filter((s) => !s.isGM && Ge(s, r)).map((s) => s.name)) ?? [];
    c.length && t.push({
      key: se("actor", r.id),
      type: "actor",
      typeLabel: "Actor",
      id: r.id,
      name: `${r.name} (${c.join(", ")})`,
      portrait: r.img || "icons/svg/mystery-man.svg"
    });
  }
  return t.sort((r, c) => r.type === "gm" ? -1 : c.type === "gm" ? 1 : r.name.localeCompare(c.name));
}
class oe extends De {
  constructor(n = {}) {
    super(n);
    I(this, "activeTabs");
    this.activeTabs = /* @__PURE__ */ new Map();
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "hcci-player-config",
      title: `${Z} Configuration`,
      template: he,
      classes: ["hcci-config-window"],
      width: 1320,
      height: 760,
      resizable: !0,
      closeOnSubmit: !1,
      submitOnChange: !1
    });
  }
  async getData() {
    const n = ee(), a = He().map((i) => {
      const r = Re(n[i.key]), c = r.success.imagePath || i.portrait, s = r.failure.imagePath || i.portrait, l = this.activeTabs.get(i.key) === "failure" ? "failure" : "success";
      return {
        ...i,
        successActive: l === "success",
        failureActive: l === "failure",
        success: {
          ...r.success,
          preview: c,
          imageStatus: r.success.imagePath ? "Custom image configured." : "No custom image configured.",
          audioStatus: r.success.audioPath ? "Audio sample configured." : "No audio sample configured."
        },
        failure: {
          ...r.failure,
          preview: s,
          imageStatus: r.failure.imagePath ? "Custom image configured." : "No custom image configured.",
          audioStatus: r.failure.audioPath ? "Audio sample configured." : "No audio sample configured."
        }
      };
    });
    return {
      moduleId: f,
      threshold: k(),
      failureThreshold: $(),
      duration: d(o.duration),
      defaultText: d(o.defaultText),
      defaultFailureText: d(o.defaultFailureText),
      rows: a
    };
  }
  activateListeners(n) {
    super.activateListeners(n);
    const a = () => {
      var i;
      (i = n.closest(".app")) == null || i.addClass("hcci-config-dirty"), n.find("[data-hcci-dirty]").prop("hidden", !1);
    };
    n.find("input, select").on("input change", (i) => {
      if (a(), i.currentTarget.dataset.hcciField !== "imagePath") return;
      const r = i.currentTarget.closest("[data-hcci-panel]"), c = r == null ? void 0 : r.querySelector("[data-hcci-preview]");
      c && (c.src = i.currentTarget.value || c.dataset.fallbackSrc || "icons/svg/mystery-man.svg");
    }), n.find("[data-hcci-browse]").on("click", (i) => {
      i.preventDefault();
      const r = i.currentTarget, c = r.closest("[data-hcci-panel]"), s = r.dataset.hcciBrowse, l = c == null ? void 0 : c.querySelector(`[data-hcci-field="${s}"]`);
      if (!l) return;
      new FilePicker({
        type: s === "audioPath" ? "audio" : "image",
        current: l.value,
        callback: (h) => {
          if (l.value = h, l.dispatchEvent(new Event("change", { bubbles: !0 })), s === "imagePath") {
            const g = c.querySelector("[data-hcci-preview]");
            g && (g.src = h || g.dataset.fallbackSrc || "icons/svg/mystery-man.svg");
          }
        }
      }).browse();
    }), n.find("[data-hcci-tab]").on("click", (i) => {
      i.preventDefault();
      const r = i.currentTarget.dataset.hcciTab, c = i.currentTarget.closest("[data-hcci-row]");
      c != null && c.dataset.hcciRow && this.activeTabs.set(c.dataset.hcciRow, r), c == null || c.querySelectorAll("[data-hcci-tab]").forEach((s) => s.classList.toggle("is-active", s.dataset.hcciTab === r)), c == null || c.querySelectorAll("[data-hcci-panel]").forEach((s) => s.classList.toggle("is-active", s.dataset.hcciPanel === r));
    }), n.find("[data-hcci-action='reset']").on("click", async (i) => {
      var r;
      i.preventDefault(), await B({}), (r = ui.notifications) == null || r.info("Critical Cut-In player configuration reset."), this.render(!1);
    });
  }
  async _updateObject(n) {
    var u, h, g, m, A, O;
    const a = n.currentTarget, i = {}, r = (y, b) => {
      var _, G, R, H, q, V, j, z, K;
      const p = y.querySelector(`[data-hcci-panel="${b}"]`), T = (w) => p == null ? void 0 : p.querySelector(`[data-hcci-field="${w}"]`);
      return {
        enabled: ((_ = p == null ? void 0 : p.querySelector('[data-hcci-field="enabled"]')) == null ? void 0 : _.checked) === !0,
        threshold: (() => {
          var U;
          const w = Number((U = T("threshold")) == null ? void 0 : U.value);
          return Number.isInteger(w) && w >= 1 && w <= 20 ? w : "";
        })(),
        animationStyle: ((G = T("animationStyle")) == null ? void 0 : G.value) || "strike",
        imagePath: ((H = (R = T("imagePath")) == null ? void 0 : R.value) == null ? void 0 : H.trim()) ?? "",
        audioPath: ((V = (q = T("audioPath")) == null ? void 0 : q.value) == null ? void 0 : V.trim()) ?? "",
        overlayText: ((z = (j = T("overlayText")) == null ? void 0 : j.value) == null ? void 0 : z.trim()) ?? "",
        accentColor: ((K = T("accentColor")) == null ? void 0 : K.value) || (b === "failure" ? "#ff4d7d" : "#69e8ff")
      };
    };
    for (const y of a.querySelectorAll("[data-hcci-row]")) {
      const b = y.dataset.hcciRow, p = (u = y.querySelector("[data-hcci-panel].is-active")) == null ? void 0 : u.dataset.hcciPanel;
      p && this.activeTabs.set(b, p), i[b] = r(y, "success"), i[b].failure = r(y, "failure");
    }
    const c = Number(((h = a.querySelector('[name="threshold"]')) == null ? void 0 : h.value) ?? k()), s = Number(((g = a.querySelector('[name="failureThreshold"]')) == null ? void 0 : g.value) ?? $()), l = Number(((m = a.querySelector('[name="duration"]')) == null ? void 0 : m.value) ?? d(o.duration));
    await N(o.threshold, Math.min(20, Math.max(1, c))), await N(o.failureThreshold, Math.min(20, Math.max(1, s))), await N(o.duration, Math.min(8e3, Math.max(800, l))), await B(i), (A = ui.notifications) == null || A.info("Critical Cut-In configuration saved."), (O = this.element) == null || O.removeClass("hcci-config-dirty"), this.render(!1);
  }
}
function le() {
  var e, t;
  return (e = game.user) != null && e.isGM ? new oe().render(!0) : ((t = ui.notifications) == null || t.warn("Only the GM can configure Critical Cut-In."), null);
}
function qe() {
  var n, a, i, r;
  const e = (n = game.modules.get("holosuite")) != null && n.active ? (a = game.modules.get("holosuite")) == null ? void 0 : a.api : null, t = (i = game.modules.get("holosuite-core")) != null && i.active ? (r = game.modules.get("holosuite-core")) == null ? void 0 : r.api : null;
  return e ?? t ?? game.holosuite ?? null;
}
function ue() {
  const e = qe();
  return e != null && e.registerApp ? (e.registerApp({
    id: f,
    title: "Critical Cut-In",
    icon: "fa-solid fa-bolt-lightning",
    premium: !1,
    playerVisible: !1,
    description: "JRPG-style critical hit cut-in animation for natural d20 results.",
    enabled: d(o.enabled),
    open: () => le()
  }), console.log(`${f} | Registered with HoloSuite.`), !0) : !1;
}
function de() {
  const e = {
    playCutinForUser(n, a = {}) {
      var r;
      const i = ae(n, a);
      return (r = game.user) != null && r.isGM ? J(i) : x(i), i;
    },
    playCutinForActor(n, a = {}) {
      var r;
      const i = Oe(n, a);
      return (r = game.user) != null && r.isGM ? J(i) : x(i), i;
    },
    openConfig: le
  }, t = game.modules.get(f);
  return t && (t.api = e), game.holosuiteCriticalCutin = e, e;
}
Hooks.once("init", async () => {
  me(oe), de(), await loadTemplates([`modules/${f}/templates/player-config.hbs`]);
});
Hooks.once("ready", () => {
  de(), Ee(), ue(), console.log(`${f} | Ready. API available at game.modules.get("${f}").api`);
});
Hooks.on("hotReload", () => {
  ue();
});
console.log(`${Z} | Loading.`);
