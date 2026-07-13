var Ae = Object.defineProperty;
var Se = (e, t, n) => t in e ? Ae(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var $ = (e, t, n) => Se(e, typeof t != "symbol" ? t + "" : t, n);
const h = "holosuite-critical-cutin", re = "HoloSuite Critical Cut-In", D = `module.${h}`, Pe = `modules/${h}/templates/player-config.hbs`, l = {
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
}, b = {
  everyone: "everyone",
  gm: "gm",
  triggeringPlayer: "triggeringPlayer"
};
function Me(e) {
  game.settings.register(h, l.enabled, {
    name: "Enable Critical Cut-In",
    hint: "Play a configured cut-in when a qualifying natural d20 result is rolled.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(h, l.threshold, {
    name: "Default Trigger Threshold",
    hint: "Natural d20 results equal to or above this number trigger the cut-in. Example: 19 triggers on 19 and 20.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 1, max: 20, step: 1 },
    default: 20
  }), game.settings.register(h, l.failureThreshold, {
    name: "Default Failure Trigger",
    hint: "Natural d20 results equal to or below this number trigger the failure cut-in. Example: 1 triggers only on a natural 1.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 1, max: 20, step: 1 },
    default: 1
  }), game.settings.register(h, l.duration, {
    name: "Animation Duration",
    hint: "How long the cut-in remains visible, in milliseconds.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 800, max: 8e3, step: 100 },
    default: 2500
  }), game.settings.register(h, l.volume, {
    name: "Cut-In Audio Volume",
    hint: "Volume multiplier for configured cut-in audio samples.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 0.8
  }), game.settings.register(h, l.audience, {
    name: "Show Animation To",
    hint: "Choose who sees synchronized cut-in playback.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      [b.everyone]: "Everyone",
      [b.gm]: "GM only",
      [b.triggeringPlayer]: "Triggering player only"
    },
    default: b.everyone
  }), game.settings.register(h, l.textEnabled, {
    name: "Enable Text Overlay",
    hint: "Show the configured label during the cut-in.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(h, l.defaultText, {
    name: "Default Overlay Text",
    hint: "Fallback label used when no player-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL"
  }), game.settings.register(h, l.defaultFailureText, {
    name: "Default Failure Overlay Text",
    hint: "Fallback label used when no failure-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL FAILURE"
  }), game.settings.register(h, l.debug, {
    name: "Debug Logging",
    hint: "Log roll detection and playback decisions to the console.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(h, l.playerConfigs, {
    name: "Per-Player Cut-In Configuration",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.registerMenu(h, "playerConfigMenu", {
    name: "Configure Player Cut-Ins",
    label: "Open Configuration",
    hint: "Set each user or actor portrait, audio sample, label, accent color, and enable state.",
    icon: "fa-solid fa-bolt",
    type: e,
    restricted: !0
  });
}
function d(e) {
  return game.settings.get(h, e);
}
async function L(e, t) {
  return game.settings.set(h, e, t);
}
function O() {
  return Math.min(20, Math.max(1, Number(d(l.threshold) || 20)));
}
function H() {
  return Math.min(20, Math.max(1, Number(d(l.failureThreshold) || 1)));
}
function ae() {
  const e = d(l.playerConfigs);
  return foundry.utils.deepClone(e && typeof e == "object" ? e : {});
}
async function J(e) {
  return L(l.playerConfigs, e && typeof e == "object" ? e : {});
}
function E(...e) {
  d(l.debug) && console.log(`${h} |`, ...e);
}
const S = [], x = /* @__PURE__ */ new Set();
let _ = !1;
function k(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function xe(e) {
  var n, r, i, a, c;
  if (e != null && e.blind && !((n = game.user) != null && n.isGM) || Array.isArray(e == null ? void 0 : e.whisper) && e.whisper.length && !e.whisper.includes((r = game.user) == null ? void 0 : r.id) && !((i = game.user) != null && i.isGM))
    return !1;
  const t = (e == null ? void 0 : e.audience) ?? d(l.audience);
  return t === b.everyone ? !0 : t === b.gm ? ((a = game.user) == null ? void 0 : a.isGM) === !0 : t === b.triggeringPlayer ? ((c = game.user) == null ? void 0 : c.id) === (e == null ? void 0 : e.userId) : !0;
}
async function Ne(e, t) {
  var n, r;
  if (e)
    try {
      const i = Math.min(1, Math.max(0, Number(t ?? d(l.volume) ?? 0.8)));
      if ((r = (n = foundry.audio) == null ? void 0 : n.AudioHelper) != null && r.play)
        return foundry.audio.AudioHelper.play({ src: e, volume: i, autoplay: !0, loop: !1 }, !1);
      const a = globalThis.AudioHelper;
      if (a != null && a.play)
        return a.play({ src: e, volume: i, autoplay: !0, loop: !1 }, !1);
      const c = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), o = new Audio(e);
      return o.volume = i * c, await o.play(), o;
    } catch (i) {
      return E("Audio playback failed.", { src: e, error: i }), null;
    }
}
function Ee(e) {
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
function ke(e) {
  const t = e.accentColor || "#69e8ff", n = ["strike", "breach", "signal"].includes(e.animationStyle) ? e.animationStyle : "strike", r = e.triggerKind === "failure" ? "failure" : "success", i = e.imagePath ? `<img class="hcci-portrait" src="${k(e.imagePath)}" alt="">` : '<div class="hcci-portrait hcci-portrait-fallback"><i class="fa-solid fa-user-astronaut"></i></div>', a = e.imagePath ? [0, 1, 2, 3].map((f) => `<div class="hcci-fracture hcci-fracture-${f + 1}" style="background-image: url('${k(e.imagePath)}')"></div>`).join("") : "", c = Math.max(1, String(e.overlayText ?? "").length), o = e.textEnabled && e.overlayText ? `<div class="hcci-title" style="--hcci-title-chars: ${c}">${k(e.overlayText)}</div>` : "", u = e.actorName || e.userName || "", s = document.createElement("div");
  return s.className = `hcci-overlay hcci-style-${n} hcci-kind-${r}`, s.style.setProperty("--hcci-accent", t), s.innerHTML = `
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
        ${a}
        <div class="hcci-frame-lightning hcci-frame-lightning-a"></div>
        <div class="hcci-frame-lightning hcci-frame-lightning-b"></div>
      </div>
      <div class="hcci-copy">
        ${o}
        ${u ? `<div class="hcci-subtitle">${k(u)}</div>` : ""}
      </div>
    </section>
  `, s;
}
async function Le(e) {
  if (!xe(e)) return;
  const t = Math.min(8e3, Math.max(800, Number(e.duration ?? d(l.duration) ?? 2500))), n = ke(e);
  n.style.setProperty("--hcci-duration", `${t}ms`), document.body.appendChild(n), document.body.classList.add("hcci-screen-shake");
  const r = Ne(e.audioPath, e.volume);
  await new Promise((i) => window.setTimeout(i, Math.max(250, t - 250))), Ee(await r), n.classList.add("hcci-exiting"), await new Promise((i) => window.setTimeout(i, 250)), n.remove(), document.body.classList.remove("hcci-screen-shake");
}
async function Oe() {
  if (!_) {
    for (_ = !0; S.length; ) {
      const e = S.shift();
      await Le(e);
    }
    _ = !1;
  }
}
function P(e) {
  if (e) {
    if (e.id) {
      if (x.has(e.id)) return;
      x.add(e.id);
      const t = x.values().next().value;
      x.size > 100 && t && x.delete(t);
    }
    S.push(e), S.length > 3 && S.splice(1, S.length - 3), Oe();
  }
}
const T = /* @__PURE__ */ new Set();
function m(e) {
  return e ? Array.isArray(e) ? e : [e] : [];
}
function Ie(e) {
  var r, i, a, c;
  const t = [
    ...m(e == null ? void 0 : e.rolls),
    ...m(e == null ? void 0 : e.roll),
    ...m(e == null ? void 0 : e._rolls),
    ...m((i = (r = e == null ? void 0 : e.flags) == null ? void 0 : r.dnd5e) == null ? void 0 : i.roll),
    ...m((c = (a = e == null ? void 0 : e.flags) == null ? void 0 : a.dnd5e) == null ? void 0 : c.rolls)
  ], n = /* @__PURE__ */ new Set();
  return t.filter((o) => !o || n.has(o) ? !1 : (n.add(o), !0));
}
function ce(e) {
  const t = [], n = [...m(e == null ? void 0 : e.terms), ...m(e == null ? void 0 : e.dice), ...m(e == null ? void 0 : e._terms), ...m(e == null ? void 0 : e._dice)], r = /* @__PURE__ */ new Set();
  for (; n.length; ) {
    const i = n.shift();
    !i || r.has(i) || (r.add(i), t.push(i), n.push(
      ...m(i.terms),
      ...m(i.dice),
      ...m(i.rolls),
      ...m(i._terms),
      ...m(i._dice)
    ));
  }
  return t;
}
function oe(e, t) {
  var c, o, u, s, f, g;
  if (ce(t).some((p) => p && p.faces === 20)) return !1;
  const r = (e == null ? void 0 : e.flags) ?? {}, i = ((o = (c = r.dnd5e) == null ? void 0 : c.roll) == null ? void 0 : o.type) ?? ((s = (u = r.dnd5e) == null ? void 0 : u.roll) == null ? void 0 : s.rollType), a = (g = (f = r.pf2e) == null ? void 0 : f.context) == null ? void 0 : g.type;
  return [i, a].some((p) => String(p ?? "").toLowerCase().includes("damage"));
}
function De(e) {
  const t = [];
  for (const n of ce(e))
    if (!(Number((n == null ? void 0 : n.faces) ?? (n == null ? void 0 : n._faces)) !== 20 || !Array.isArray(n.results)))
      for (const i of n.results) {
        if (i.active === !1 || i.discarded === !0) continue;
        const a = Number(i.result ?? i.value ?? i.total);
        Number.isInteger(a) && t.push(a);
      }
  return t;
}
function Fe(e) {
  return e ? e instanceof HTMLElement ? e : e[0] instanceof HTMLElement ? e[0] : null : null;
}
function $e(e) {
  var a;
  const t = Fe(e);
  if (!t) return [];
  const n = [], r = [
    ".dice-rolls .roll.d20",
    ".dice-rolls .roll.die.d20",
    ".dice-tooltip .roll.d20",
    ".dice-tooltip .dice.d20 .roll"
  ], i = /* @__PURE__ */ new Set();
  for (const c of r)
    t.querySelectorAll(c).forEach((o) => i.add(o));
  for (const c of i) {
    if (c.classList.contains("discarded") || c.classList.contains("rerolled") || c.classList.contains("ignored") || c.classList.contains("inactive"))
      continue;
    const o = Number((a = c.textContent) == null ? void 0 : a.trim());
    Number.isInteger(o) && o >= 1 && o <= 20 && n.push(o);
  }
  return n;
}
function le(e, t) {
  return `${e}:${t}`;
}
function _e() {
  return le("gm", "default");
}
function Re(e) {
  return ["strike", "breach", "signal"].includes(e) ? e : "strike";
}
function se(e, t) {
  var r, i, a, c;
  if (!e || !t) return !1;
  const n = ((i = (r = globalThis.CONST) == null ? void 0 : r.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : i.OWNER) ?? 3;
  return Number(((a = e.ownership) == null ? void 0 : a[t]) ?? ((c = e.ownership) == null ? void 0 : c.default) ?? 0) >= n;
}
function ue(e) {
  var n;
  const t = (e == null ? void 0 : e.speaker) ?? {};
  return t.actor ? ((n = game.actors) == null ? void 0 : n.get(t.actor)) ?? null : e != null && e.actor ? e.actor : null;
}
function de(e, t) {
  var i, a, c, o;
  const n = ((i = e == null ? void 0 : e.user) == null ? void 0 : i.id) ?? (e == null ? void 0 : e.user) ?? (e == null ? void 0 : e.userId), r = (a = game.users) == null ? void 0 : a.get(n);
  if (r && !r.isGM) return r;
  if (t) {
    const u = (c = game.users) == null ? void 0 : c.find((s) => !s.isGM && se(t, s.id));
    if (u) return u;
  }
  return r ?? ((o = game.users) == null ? void 0 : o.get(n)) ?? null;
}
function X(e = {}, t, n) {
  const r = t === "failure" ? H() : O(), i = d(t === "failure" ? l.defaultFailureText : l.defaultText), a = t === "failure" ? "#ff4d7d" : "#69e8ff", c = t === "failure" ? e.failure ?? {} : e, o = Number(c.threshold);
  return {
    kind: t,
    enabled: c.enabled !== !1,
    threshold: Number.isInteger(o) && o >= 1 && o <= 20 ? o : r,
    animationStyle: Re(c.animationStyle),
    imagePath: c.imagePath || (n == null ? void 0 : n.img) || "",
    audioPath: c.audioPath || "",
    overlayText: c.overlayText || i,
    accentColor: c.accentColor || a
  };
}
function N(e, t, n = "success") {
  const r = ae(), i = t ? r[le("actor", t.id)] : null, a = e != null && e.isGM ? r[_e()] : null;
  return !t && !(e != null && e.isGM) && !i ? X({ enabled: !1 }, n, t) : X(i ?? a ?? {}, n, t);
}
function fe(e, t, n, r, i) {
  return i.enabled ? {
    id: foundry.utils.randomID(),
    messageId: e.id,
    userId: (r == null ? void 0 : r.id) ?? null,
    actorId: (n == null ? void 0 : n.id) ?? null,
    userName: (r == null ? void 0 : r.name) ?? "",
    actorName: (n == null ? void 0 : n.name) ?? (r == null ? void 0 : r.name) ?? "",
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
    textEnabled: d(l.textEnabled),
    duration: d(l.duration),
    volume: d(l.volume),
    audience: d(l.audience)
  } : (E("Cut-in disabled for target.", { userId: r == null ? void 0 : r.id, actorId: n == null ? void 0 : n.id }), null);
}
function Y(e, t, n = "success") {
  const r = Ie(e);
  if (!(e != null && e.isRoll) && !r.length) return null;
  for (const i of r) {
    if (oe(e, i)) continue;
    const a = De(i), c = n === "failure" ? a.find((o) => o <= t) : a.find((o) => o >= t);
    if (c) return c;
  }
  return null;
}
function Z(e, t, n, r = "success") {
  const i = $e(t);
  return !i.length || oe(e, {}) ? null : r === "failure" ? i.find((a) => a <= n) ?? null : i.find((a) => a >= n) ?? null;
}
function ee() {
  var n, r;
  const t = (((n = game.users) == null ? void 0 : n.filter((i) => i.active && i.isGM)) ?? []).sort((i, a) => i.id.localeCompare(a.id))[0];
  return ((r = game.user) == null ? void 0 : r.isGM) && (!t || t.id === game.user.id);
}
function I(e) {
  T.add(e);
  const t = T.values().next().value;
  T.size > 200 && t && T.delete(t);
}
function he(e) {
  var f;
  if (!(e != null && e.id) || T.has(e.id)) return !0;
  const t = ue(e), n = de(e, t), r = N(n, t, "success"), i = N(n, t, "failure"), a = Y(e, i.threshold, "failure"), c = a ? null : Y(e, r.threshold, "success"), o = a ?? c;
  if (!o) return !1;
  const s = fe(e, o, t, n, a ? i : r);
  return s ? (I(e.id), E("Triggering cut-in.", s), (f = game.socket) == null || f.emit(D, { type: "play", payload: s }), P(s), !0) : (I(e.id), !0);
}
function He(e, t) {
  var g;
  if (!(e != null && e.id) || T.has(e.id)) return !0;
  const n = ue(e), r = de(e, n), i = N(r, n, "success"), a = N(r, n, "failure"), c = Z(e, t, a.threshold, "failure"), o = c ? null : Z(e, t, i.threshold, "success"), u = c ?? o;
  if (!u) return !1;
  const f = fe(e, u, n, r, c ? a : i);
  return f ? (I(e.id), E("Triggering cut-in from rendered chat card.", f), (g = game.socket) == null || g.emit(D, { type: "play", payload: f }), P(f), !0) : (I(e.id), !0);
}
function R(e, t) {
  e != null && e.id && globalThis.setTimeout(() => {
    var r;
    if (T.has(e.id)) return;
    const n = ((r = game.messages) == null ? void 0 : r.get(e.id)) ?? e;
    he(n);
  }, t);
}
function Ge() {
  var e;
  Hooks.on("createChatMessage", (t) => {
    d(l.enabled) && ee() && (he(t) || (R(t, 100), R(t, 500), R(t, 1500)));
  }), Hooks.on("renderChatMessage", (t, n) => {
    d(l.enabled) && ee() && He(t, n);
  }), (e = game.socket) == null || e.on(D, (t) => {
    (t == null ? void 0 : t.type) === "play" && d(l.enabled) && P(t.payload);
  });
}
function ge(e, t = {}) {
  var c, o;
  const n = (c = game.users) == null ? void 0 : c.get(e), r = t.actorId ? (o = game.actors) == null ? void 0 : o.get(t.actorId) : (n == null ? void 0 : n.character) ?? null, i = t.triggerKind === "failure" ? "failure" : "success", a = N(n, r, i);
  return {
    id: foundry.utils.randomID(),
    userId: e,
    actorId: (r == null ? void 0 : r.id) ?? null,
    userName: (n == null ? void 0 : n.name) ?? "",
    actorName: (r == null ? void 0 : r.name) ?? (n == null ? void 0 : n.name) ?? "",
    naturalResult: t.naturalResult ?? 20,
    triggerKind: i,
    threshold: t.threshold ?? a.threshold ?? O(),
    animationStyle: t.animationStyle ?? a.animationStyle ?? "strike",
    imagePath: t.imagePath ?? a.imagePath ?? "",
    audioPath: t.audioPath ?? a.audioPath ?? "",
    overlayText: t.overlayText ?? a.overlayText ?? d(l.defaultText),
    accentColor: t.accentColor ?? a.accentColor ?? "#69e8ff",
    textEnabled: t.textEnabled ?? d(l.textEnabled),
    duration: t.duration ?? d(l.duration),
    volume: t.volume ?? d(l.volume),
    audience: t.audience ?? d(l.audience)
  };
}
function qe(e, t = {}) {
  var i, a;
  const n = (i = game.actors) == null ? void 0 : i.get(e), r = ((a = game.users) == null ? void 0 : a.find((c) => !c.isGM && se(n, c.id))) ?? game.user;
  return ge(r == null ? void 0 : r.id, { ...t, actorId: e });
}
function te(e) {
  var t;
  (t = game.socket) == null || t.emit(D, { type: "play", payload: e }), P(e);
}
function me() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) ?? null;
}
function pe() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : n.api) ?? null;
}
function Ve(e = {}, t = {}) {
  var r, i, a;
  const n = ((i = (r = globalThis.foundry) == null ? void 0 : r.utils) == null ? void 0 : i.mergeObject) ?? ((a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.mergeObject);
  return typeof n == "function" ? n(e, t, { inplace: !1 }) : { ...e, ...t };
}
function je() {
  var e, t, n, r, i;
  return ((n = (t = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : t.randomID) == null ? void 0 : n.call(t, 8)) ?? ((i = (r = foundry == null ? void 0 : foundry.utils) == null ? void 0 : r.randomID) == null ? void 0 : i.call(r, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function ie(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${je()}`),
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
    constructor(r = {}) {
      const i = Ve(new.target.defaultOptions ?? {}, r);
      super(ie(i));
      $(this, "_v1Options");
      this._v1Options = i;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return ie(this.defaultOptions ?? {});
    }
    activateListeners(r) {
    }
    async _renderHTML(r, i) {
      var s, f, g;
      const a = typeof this.getData == "function" ? await this.getData() : {}, c = ((s = this._v1Options) == null ? void 0 : s.template) ?? ((f = this.options) == null ? void 0 : f.template) ?? ((g = this.constructor.defaultOptions) == null ? void 0 : g.template);
      if (!c) return document.createDocumentFragment();
      const o = await globalThis.renderTemplate(c, a), u = document.createElement("template");
      return u.innerHTML = o.trim(), u.content;
    }
    _activateV1Form(r) {
      var a, c;
      if (typeof this._updateObject != "function") return;
      const i = (a = r.matches) != null && a.call(r, "form") ? r : (c = r.querySelector) == null ? void 0 : c.call(r, "form");
      i instanceof HTMLFormElement && i.addEventListener("submit", async (o) => {
        var s;
        o.preventDefault(), o.stopPropagation();
        const u = new FormData(i);
        await this._updateObject(o, u), ((s = this._v1Options) == null ? void 0 : s.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(r, i, a) {
      var f, g, p, M;
      i.replaceChildren(r);
      const c = globalThis.jQuery ?? globalThis.$, o = ((f = i.closest) == null ? void 0 : f.call(i, ".window-app, .app, .application")) ?? i, u = c ? c(o) : o;
      try {
        Object.defineProperty(this, "element", {
          value: u,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = u;
        } catch {
        }
      }
      const s = (g = this._v1Options) == null ? void 0 : g.classes;
      Array.isArray(s) && s.length && (i.classList.add(...s), (M = (p = i.closest) == null ? void 0 : p.call(i, ".window-app, .app, .application")) == null || M.classList.add(...s)), this._activateV1Form(i), typeof this.activateListeners == "function" && this.activateListeners(c ? c(i) : i);
    }
  };
}
function ze() {
  const e = me(), t = pe(), n = globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (n) return n;
  const r = e == null ? void 0 : e.ApplicationV2;
  return r ? ye(r) : null;
}
function Ke() {
  const e = me(), t = pe(), n = globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (n) return n;
  const r = e == null ? void 0 : e.ApplicationV2;
  return r ? ye(r) : ze();
}
const Ue = Ke();
function ve(e, t) {
  return `${e}:${t}`;
}
function Be() {
  return ve("gm", "default");
}
function Qe(e, t) {
  var r, i, a, c;
  const n = ((i = (r = globalThis.CONST) == null ? void 0 : r.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : i.OWNER) ?? 3;
  return Number(((a = t == null ? void 0 : t.ownership) == null ? void 0 : a[e.id]) ?? ((c = t == null ? void 0 : t.ownership) == null ? void 0 : c.default) ?? 0) >= n;
}
function ne(e = {}, { defaultAccent: t = "#69e8ff" } = {}) {
  const n = Number(e.threshold), r = ["strike", "breach", "signal"].includes(e.animationStyle) ? e.animationStyle : "strike";
  return {
    enabled: e.enabled !== !1,
    threshold: Number.isInteger(n) && n >= 1 && n <= 20 ? n : "",
    animationStyle: r,
    animationStyles: [
      { value: "strike", label: "Neon Strike", selected: r === "strike" },
      { value: "breach", label: "Panel Breach", selected: r === "breach" },
      { value: "signal", label: "Signal Bloom", selected: r === "signal" }
    ],
    imagePath: String(e.imagePath ?? ""),
    audioPath: String(e.audioPath ?? ""),
    overlayText: String(e.overlayText ?? ""),
    accentColor: String(e.accentColor ?? t)
  };
}
function We(e = {}) {
  return {
    success: ne(e, { defaultAccent: "#69e8ff" }),
    failure: ne(e.failure, { defaultAccent: "#ff4d7d" })
  };
}
function Je() {
  var n, r, i;
  const e = ((n = game.users) == null ? void 0 : n.find((a) => a.isGM && a.active)) ?? ((r = game.users) == null ? void 0 : r.find((a) => a.isGM)) ?? game.user, t = [{
    key: Be(),
    type: "gm",
    typeLabel: "GM",
    id: "default",
    name: "GM Cut-In",
    portrait: (e == null ? void 0 : e.avatar) || "icons/svg/mystery-man.svg"
  }];
  for (const a of game.actors ?? []) {
    const c = ((i = game.users) == null ? void 0 : i.filter((o) => !o.isGM && Qe(o, a)).map((o) => o.name)) ?? [];
    c.length && t.push({
      key: ve("actor", a.id),
      type: "actor",
      typeLabel: "Actor",
      id: a.id,
      name: `${a.name} (${c.join(", ")})`,
      portrait: a.img || "icons/svg/mystery-man.svg"
    });
  }
  return t.sort((a, c) => a.type === "gm" ? -1 : c.type === "gm" ? 1 : a.name.localeCompare(c.name));
}
class be extends Ue {
  constructor(n = {}) {
    super(n);
    $(this, "activeTabs");
    this.activeTabs = /* @__PURE__ */ new Map();
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "hcci-player-config",
      title: `${re} Configuration`,
      template: Pe,
      classes: ["hcci-config-window"],
      width: 1320,
      height: 760,
      resizable: !0,
      closeOnSubmit: !1,
      submitOnChange: !1
    });
  }
  async getData() {
    const n = ae(), r = Je().map((i) => {
      const a = We(n[i.key]), c = a.success.imagePath || i.portrait, o = a.failure.imagePath || i.portrait, u = this.activeTabs.get(i.key) === "failure" ? "failure" : "success";
      return {
        ...i,
        successActive: u === "success",
        failureActive: u === "failure",
        success: {
          ...a.success,
          preview: c,
          imageStatus: a.success.imagePath ? "Custom image configured." : "No custom image configured.",
          audioStatus: a.success.audioPath ? "Audio sample configured." : "No audio sample configured."
        },
        failure: {
          ...a.failure,
          preview: o,
          imageStatus: a.failure.imagePath ? "Custom image configured." : "No custom image configured.",
          audioStatus: a.failure.audioPath ? "Audio sample configured." : "No audio sample configured."
        }
      };
    });
    return {
      moduleId: h,
      threshold: O(),
      failureThreshold: H(),
      duration: d(l.duration),
      defaultText: d(l.defaultText),
      defaultFailureText: d(l.defaultFailureText),
      rows: r
    };
  }
  activateListeners(n) {
    super.activateListeners(n);
    const r = () => {
      var i;
      (i = n.closest(".app")) == null || i.addClass("hcci-config-dirty"), n.find("[data-hcci-dirty]").prop("hidden", !1);
    };
    n.find("input, select").on("input change", (i) => {
      if (r(), i.currentTarget.dataset.hcciField !== "imagePath") return;
      const a = i.currentTarget.closest("[data-hcci-panel]"), c = a == null ? void 0 : a.querySelector("[data-hcci-preview]");
      c && (c.src = i.currentTarget.value || c.dataset.fallbackSrc || "icons/svg/mystery-man.svg");
    }), n.find("[data-hcci-browse]").on("click", (i) => {
      i.preventDefault();
      const a = i.currentTarget, c = a.closest("[data-hcci-panel]"), o = a.dataset.hcciBrowse, u = c == null ? void 0 : c.querySelector(`[data-hcci-field="${o}"]`);
      if (!u) return;
      new FilePicker({
        type: o === "audioPath" ? "audio" : "image",
        current: u.value,
        callback: (f) => {
          if (u.value = f, u.dispatchEvent(new Event("change", { bubbles: !0 })), o === "imagePath") {
            const g = c.querySelector("[data-hcci-preview]");
            g && (g.src = f || g.dataset.fallbackSrc || "icons/svg/mystery-man.svg");
          }
        }
      }).browse();
    }), n.find("[data-hcci-tab]").on("click", (i) => {
      i.preventDefault();
      const a = i.currentTarget.dataset.hcciTab, c = i.currentTarget.closest("[data-hcci-row]");
      c != null && c.dataset.hcciRow && this.activeTabs.set(c.dataset.hcciRow, a), c == null || c.querySelectorAll("[data-hcci-tab]").forEach((o) => o.classList.toggle("is-active", o.dataset.hcciTab === a)), c == null || c.querySelectorAll("[data-hcci-panel]").forEach((o) => o.classList.toggle("is-active", o.dataset.hcciPanel === a));
    }), n.find("[data-hcci-action='reset']").on("click", async (i) => {
      var a;
      i.preventDefault(), await J({}), (a = ui.notifications) == null || a.info("Critical Cut-In player configuration reset."), this.render(!1);
    });
  }
  async _updateObject(n) {
    var s, f, g, p, M, F;
    const r = n.currentTarget, i = {}, a = (v, w) => {
      var G, q, V, j, z, K, U, B, Q;
      const y = v.querySelector(`[data-hcci-panel="${w}"]`), C = (A) => y == null ? void 0 : y.querySelector(`[data-hcci-field="${A}"]`);
      return {
        enabled: ((G = y == null ? void 0 : y.querySelector('[data-hcci-field="enabled"]')) == null ? void 0 : G.checked) === !0,
        threshold: (() => {
          var W;
          const A = Number((W = C("threshold")) == null ? void 0 : W.value);
          return Number.isInteger(A) && A >= 1 && A <= 20 ? A : "";
        })(),
        animationStyle: ((q = C("animationStyle")) == null ? void 0 : q.value) || "strike",
        imagePath: ((j = (V = C("imagePath")) == null ? void 0 : V.value) == null ? void 0 : j.trim()) ?? "",
        audioPath: ((K = (z = C("audioPath")) == null ? void 0 : z.value) == null ? void 0 : K.trim()) ?? "",
        overlayText: ((B = (U = C("overlayText")) == null ? void 0 : U.value) == null ? void 0 : B.trim()) ?? "",
        accentColor: ((Q = C("accentColor")) == null ? void 0 : Q.value) || (w === "failure" ? "#ff4d7d" : "#69e8ff")
      };
    };
    for (const v of r.querySelectorAll("[data-hcci-row]")) {
      const w = v.dataset.hcciRow, y = (s = v.querySelector("[data-hcci-panel].is-active")) == null ? void 0 : s.dataset.hcciPanel;
      y && this.activeTabs.set(w, y), i[w] = a(v, "success"), i[w].failure = a(v, "failure");
    }
    const c = Number(((f = r.querySelector('[name="threshold"]')) == null ? void 0 : f.value) ?? O()), o = Number(((g = r.querySelector('[name="failureThreshold"]')) == null ? void 0 : g.value) ?? H()), u = Number(((p = r.querySelector('[name="duration"]')) == null ? void 0 : p.value) ?? d(l.duration));
    await L(l.threshold, Math.min(20, Math.max(1, c))), await L(l.failureThreshold, Math.min(20, Math.max(1, o))), await L(l.duration, Math.min(8e3, Math.max(800, u))), await J(i), (M = ui.notifications) == null || M.info("Critical Cut-In configuration saved."), (F = this.element) == null || F.removeClass("hcci-config-dirty"), this.render(!1);
  }
}
function Te() {
  var e, t;
  return (e = game.user) != null && e.isGM ? new be().render(!0) : ((t = ui.notifications) == null || t.warn("Only the GM can configure Critical Cut-In."), null);
}
function Xe() {
  var n, r, i, a;
  const e = (n = game.modules.get("holosuite")) != null && n.active ? (r = game.modules.get("holosuite")) == null ? void 0 : r.api : null, t = (i = game.modules.get("holosuite-core")) != null && i.active ? (a = game.modules.get("holosuite-core")) == null ? void 0 : a.api : null;
  return e ?? t ?? game.holosuite ?? null;
}
function we() {
  const e = Xe();
  return e != null && e.registerApp ? (e.registerApp({
    id: h,
    title: "Critical Cut-In",
    icon: "fa-solid fa-bolt-lightning",
    premium: !1,
    playerVisible: !1,
    description: "JRPG-style critical hit cut-in animation for natural d20 results.",
    enabled: d(l.enabled),
    open: () => Te()
  }), console.log(`${h} | Registered with HoloSuite.`), !0) : !1;
}
function Ce() {
  const e = {
    playCutinForUser(n, r = {}) {
      var a;
      const i = ge(n, r);
      return (a = game.user) != null && a.isGM ? te(i) : P(i), i;
    },
    playCutinForActor(n, r = {}) {
      var a;
      const i = qe(n, r);
      return (a = game.user) != null && a.isGM ? te(i) : P(i), i;
    },
    openConfig: Te
  }, t = game.modules.get(h);
  return t && (t.api = e), game.holosuiteCriticalCutin = e, e;
}
Hooks.once("init", async () => {
  Me(be), Ce(), await loadTemplates([`modules/${h}/templates/player-config.hbs`]);
});
Hooks.once("ready", () => {
  Ce(), Ge(), we(), console.log(`${h} | Ready. API available at game.modules.get("${h}").api`);
});
Hooks.on("hotReload", () => {
  we();
});
console.log(`${re} | Loading.`);
