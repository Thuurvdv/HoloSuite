var Oe = Object.defineProperty;
var Re = (e, i, t) => i in e ? Oe(e, i, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[i] = t;
var E = (e, i, t) => Re(e, typeof i != "symbol" ? i + "" : i, t);
const Fe = [4, 6, 8, 10, 12, 20, 100];
function $e(e = 20) {
  var r, a, c;
  const i = z(e), t = /* @__PURE__ */ new Set([...Fe, i]), n = ((c = (a = (r = globalThis.CONFIG) == null ? void 0 : r.Dice) == null ? void 0 : a.fulfillment) == null ? void 0 : c.dice) ?? {};
  for (const o of Object.keys(n)) {
    const l = /^d([1-9]\d*)$/i.exec(o);
    if (!l) continue;
    const s = Number(l[1]);
    s >= 2 && s <= 1e4 && t.add(s);
  }
  return [...t].sort((o, l) => o - l).map((o) => ({ value: o, label: `d${o}`, selected: o === i }));
}
function he(e, i) {
  const t = z(e), n = ge(i) === "low";
  return { success: n ? 1 : t, failure: n ? t : 1 };
}
function z(e) {
  const i = Number(e);
  return Number.isInteger(i) && i >= 2 && i <= 1e4 ? i : 20;
}
function ge(e) {
  return e === "low" ? "low" : "high";
}
const h = "holosuite-critical-cutin", me = "HoloSuite Critical Cut-In", $ = `module.${h}`, _e = `modules/${h}/templates/player-config.hbs`, u = {
  enabled: "enabled",
  dieSides: "dieSides",
  rollDirection: "rollDirection",
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
}, T = {
  everyone: "everyone",
  gm: "gm",
  triggeringPlayer: "triggeringPlayer"
};
function He(e) {
  game.settings.register(h, u.enabled, {
    name: "Enable Critical Cut-In",
    hint: "Play a configured cut-in when a qualifying natural result is rolled on the selected die.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(h, u.dieSides, {
    name: "Check Die",
    hint: "Configured in Configure Player Cut-Ins, where changes confirm the reset of all listed roll thresholds.",
    scope: "world",
    config: !1,
    type: Number,
    default: 20
  }), game.settings.register(h, u.rollDirection, {
    name: "Positive Rolls",
    hint: "Configured in Configure Player Cut-Ins, together with the check die and roll thresholds.",
    scope: "world",
    config: !1,
    type: String,
    default: "high",
    choices: { high: "High rolls are positive", low: "Low rolls are positive" }
  }), game.settings.register(h, u.threshold, {
    name: "Default Trigger Threshold",
    hint: "0 automatically uses the best die face. Otherwise success triggers at or above this value for high rolls, or at or below it for low rolls.",
    scope: "world",
    config: !0,
    type: Number,
    default: 0
  }), game.settings.register(h, u.failureThreshold, {
    name: "Default Failure Trigger",
    hint: "0 automatically uses the worst die face. Otherwise failure triggers at or below this value for high rolls, or at or above it for low rolls.",
    scope: "world",
    config: !0,
    type: Number,
    default: 0
  }), game.settings.register(h, u.duration, {
    name: "Animation Duration",
    hint: "How long the cut-in remains visible, in milliseconds.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 800, max: 8e3, step: 100 },
    default: 2500
  }), game.settings.register(h, u.volume, {
    name: "Cut-In Audio Volume",
    hint: "Volume multiplier for configured cut-in audio samples.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 0.8
  }), game.settings.register(h, u.audience, {
    name: "Show Animation To",
    hint: "Choose who sees synchronized cut-in playback.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      [T.everyone]: "Everyone",
      [T.gm]: "GM only",
      [T.triggeringPlayer]: "Triggering player only"
    },
    default: T.everyone
  }), game.settings.register(h, u.textEnabled, {
    name: "Enable Text Overlay",
    hint: "Show the configured label during the cut-in.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(h, u.defaultText, {
    name: "Default Overlay Text",
    hint: "Fallback label used when no player-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL"
  }), game.settings.register(h, u.defaultFailureText, {
    name: "Default Failure Overlay Text",
    hint: "Fallback label used when no failure-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL FAILURE"
  }), game.settings.register(h, u.debug, {
    name: "Debug Logging",
    hint: "Log roll detection and playback decisions to the console.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(h, u.playerConfigs, {
    name: "Per-Player Cut-In Configuration",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.registerMenu(h, "playerConfigMenu", {
    name: "Configure Player Cut-Ins",
    label: "Open Configuration",
    hint: "Choose the check die and positive roll direction, and set each user or actor's roll thresholds, portrait, audio, label, accent color, and enable state.",
    icon: "fa-solid fa-bolt",
    type: e,
    restricted: !0
  });
}
function f(e) {
  return game.settings.get(h, e);
}
async function M(e, i) {
  return game.settings.set(h, e, i);
}
function R() {
  return pe(f(u.threshold), "success");
}
function q() {
  return pe(f(u.failureThreshold), "failure");
}
function v() {
  return z(f(u.dieSides));
}
function B() {
  return ge(f(u.rollDirection)) === "low";
}
function pe(e, i) {
  const t = Number(e);
  return Number.isInteger(t) && t >= 1 && t <= v() ? t : i === "success" === B() ? 1 : v();
}
function ye(e, i, t) {
  return t === "success" === B() ? e <= i : e >= i;
}
function V() {
  const e = f(u.playerConfigs);
  return foundry.utils.deepClone(e && typeof e == "object" ? e : {});
}
async function ae(e) {
  return M(u.playerConfigs, e && typeof e == "object" ? e : {});
}
function L(...e) {
  f(u.debug) && console.log(`${h} |`, ...e);
}
const x = [], I = /* @__PURE__ */ new Set();
let H = !1;
function O(e) {
  const i = document.createElement("div");
  return i.textContent = String(e ?? ""), i.innerHTML;
}
function Ge(e) {
  var t, n, r, a, c;
  if (e != null && e.blind && !((t = game.user) != null && t.isGM) || Array.isArray(e == null ? void 0 : e.whisper) && e.whisper.length && !e.whisper.includes((n = game.user) == null ? void 0 : n.id) && !((r = game.user) != null && r.isGM))
    return !1;
  const i = (e == null ? void 0 : e.audience) ?? f(u.audience);
  return i === T.everyone ? !0 : i === T.gm ? ((a = game.user) == null ? void 0 : a.isGM) === !0 : i === T.triggeringPlayer ? ((c = game.user) == null ? void 0 : c.id) === (e == null ? void 0 : e.userId) : !0;
}
async function qe(e, i) {
  var t, n;
  if (e)
    try {
      const r = Math.min(1, Math.max(0, Number(i ?? f(u.volume) ?? 0.8)));
      if ((n = (t = foundry.audio) == null ? void 0 : t.AudioHelper) != null && n.play)
        return foundry.audio.AudioHelper.play({ src: e, volume: r, autoplay: !0, loop: !1 }, !1);
      const a = globalThis.AudioHelper;
      if (a != null && a.play)
        return a.play({ src: e, volume: r, autoplay: !0, loop: !1 }, !1);
      const c = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), o = new Audio(e);
      return o.volume = r * c, await o.play(), o;
    } catch (r) {
      return L("Audio playback failed.", { src: e, error: r }), null;
    }
}
function Ve(e) {
  try {
    if (!e) return;
    if (typeof e.stop == "function") {
      e.stop();
      return;
    }
    typeof e.pause == "function" && (e.pause(), e.currentTime = 0);
  } catch (i) {
    L("Audio stop failed.", i);
  }
}
function je(e) {
  const i = e.accentColor || "#69e8ff", t = ["strike", "breach", "signal"].includes(e.animationStyle) ? e.animationStyle : "strike", n = e.triggerKind === "failure" ? "failure" : "success", r = e.imagePath ? `<img class="hcci-portrait" src="${O(e.imagePath)}" alt="">` : '<div class="hcci-portrait hcci-portrait-fallback"><i class="fa-solid fa-user-astronaut"></i></div>', a = e.imagePath ? [0, 1, 2, 3].map((d) => `<div class="hcci-fracture hcci-fracture-${d + 1}" style="background-image: url('${O(e.imagePath)}')"></div>`).join("") : "", c = Math.max(1, String(e.overlayText ?? "").length), o = e.textEnabled && e.overlayText ? `<div class="hcci-title" style="--hcci-title-chars: ${c}">${O(e.overlayText)}</div>` : "", l = e.actorName || e.userName || "", s = document.createElement("div");
  return s.className = `hcci-overlay hcci-style-${t} hcci-kind-${n}`, s.style.setProperty("--hcci-accent", i), s.innerHTML = `
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
        ${r}
        ${a}
        <div class="hcci-frame-lightning hcci-frame-lightning-a"></div>
        <div class="hcci-frame-lightning hcci-frame-lightning-b"></div>
      </div>
      <div class="hcci-copy">
        ${o}
        ${l ? `<div class="hcci-subtitle">${O(l)}</div>` : ""}
      </div>
    </section>
  `, s;
}
async function ze(e) {
  if (!Ge(e)) return;
  const i = Math.min(8e3, Math.max(800, Number(e.duration ?? f(u.duration) ?? 2500))), t = je(e);
  t.style.setProperty("--hcci-duration", `${i}ms`), document.body.appendChild(t), document.body.classList.add("hcci-screen-shake");
  const n = qe(e.audioPath, e.volume);
  await new Promise((r) => window.setTimeout(r, Math.max(250, i - 250))), Ve(await n), t.classList.add("hcci-exiting"), await new Promise((r) => window.setTimeout(r, 250)), t.remove(), document.body.classList.remove("hcci-screen-shake");
}
async function Be() {
  if (!H) {
    for (H = !0; x.length; ) {
      const e = x.shift();
      await ze(e);
    }
    H = !1;
  }
}
function D(e) {
  if (e) {
    if (e.id) {
      if (I.has(e.id)) return;
      I.add(e.id);
      const i = I.values().next().value;
      I.size > 100 && i && I.delete(i);
    }
    x.push(e), x.length > 3 && x.splice(1, x.length - 3), Be();
  }
}
const C = /* @__PURE__ */ new Set(), j = /* @__PURE__ */ new Set();
function Ke(e) {
  return !!(e != null && e.id) && j.has(e.id);
}
function m(e) {
  return e ? Array.isArray(e) ? e : [e] : [];
}
function Ue(e) {
  var n, r, a, c;
  const i = [
    ...m(e == null ? void 0 : e.rolls),
    ...m(e == null ? void 0 : e.roll),
    ...m(e == null ? void 0 : e._rolls),
    ...m((r = (n = e == null ? void 0 : e.flags) == null ? void 0 : n.dnd5e) == null ? void 0 : r.roll),
    ...m((c = (a = e == null ? void 0 : e.flags) == null ? void 0 : a.dnd5e) == null ? void 0 : c.rolls)
  ], t = /* @__PURE__ */ new Set();
  return i.filter((o) => !o || t.has(o) ? !1 : (t.add(o), !0));
}
function Qe(e) {
  const i = [], t = [...m(e == null ? void 0 : e.terms), ...m(e == null ? void 0 : e.dice), ...m(e == null ? void 0 : e._terms), ...m(e == null ? void 0 : e._dice)], n = /* @__PURE__ */ new Set();
  for (; t.length; ) {
    const r = t.shift();
    !r || n.has(r) || (n.add(r), i.push(r), t.push(
      ...m(r.terms),
      ...m(r.dice),
      ...m(r.rolls),
      ...m(r._terms),
      ...m(r._dice)
    ));
  }
  return i;
}
function ve(e, i) {
  var a, c, o, l, s, d, g, p;
  const t = (e == null ? void 0 : e.flags) ?? {}, n = ((c = (a = t.dnd5e) == null ? void 0 : a.roll) == null ? void 0 : c.type) ?? ((l = (o = t.dnd5e) == null ? void 0 : o.roll) == null ? void 0 : l.rollType), r = (d = (s = t.pf2e) == null ? void 0 : s.context) == null ? void 0 : d.type;
  return [(g = i == null ? void 0 : i.options) == null ? void 0 : g.type, (p = i == null ? void 0 : i.options) == null ? void 0 : p.rollType, n, r].some((y) => String(y ?? "").toLowerCase().includes("damage"));
}
function We(e) {
  const i = [];
  for (const t of Qe(e)) {
    const n = Number((t == null ? void 0 : t.faces) ?? (t == null ? void 0 : t._faces));
    if (!(n !== v() || !Array.isArray(t.results)))
      for (const r of t.results) {
        if (r.active === !1 || r.discarded === !0 || r.rerolled === !0) continue;
        const a = Number(r.result ?? r.value ?? r.total);
        Number.isInteger(a) && a >= 1 && a <= n && i.push(a);
      }
  }
  return i;
}
function Ye(e) {
  return e ? e instanceof HTMLElement ? e : e[0] instanceof HTMLElement ? e[0] : null : null;
}
function Je(e) {
  var c;
  const i = Ye(e);
  if (!i) return [];
  const t = [], n = `d${v()}`, r = [
    `.dice-rolls .roll.${n}`,
    `.dice-rolls .roll.die.${n}`,
    `.dice-tooltip .roll.${n}`,
    `.dice-tooltip .dice.${n} .roll`
  ], a = /* @__PURE__ */ new Set();
  for (const o of r)
    i.querySelectorAll(o).forEach((l) => a.add(l));
  for (const o of a) {
    if (o.classList.contains("discarded") || o.classList.contains("rerolled") || o.classList.contains("ignored") || o.classList.contains("inactive"))
      continue;
    const l = Number((c = o.textContent) == null ? void 0 : c.trim());
    Number.isInteger(l) && l >= 1 && l <= v() && t.push(l);
  }
  return t;
}
function be(e, i) {
  return `${e}:${i}`;
}
function Xe() {
  return be("gm", "default");
}
function Ze(e) {
  return ["strike", "breach", "signal"].includes(e) ? e : "strike";
}
function we(e, i) {
  var n, r, a, c;
  if (!e || !i) return !1;
  const t = ((r = (n = globalThis.CONST) == null ? void 0 : n.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : r.OWNER) ?? 3;
  return Number(((a = e.ownership) == null ? void 0 : a[i]) ?? ((c = e.ownership) == null ? void 0 : c.default) ?? 0) >= t;
}
function Te(e) {
  var t;
  const i = (e == null ? void 0 : e.speaker) ?? {};
  return i.actor ? ((t = game.actors) == null ? void 0 : t.get(i.actor)) ?? null : e != null && e.actor ? e.actor : null;
}
function et(e) {
  var n, r, a;
  const i = (e == null ? void 0 : e.author) ?? (e == null ? void 0 : e.user);
  if (i && typeof i == "object") return i.id ? ((n = game.users) == null ? void 0 : n.get(i.id)) ?? i : null;
  const t = i ?? ((r = e == null ? void 0 : e._source) == null ? void 0 : r.author) ?? (e == null ? void 0 : e.userId);
  return t ? ((a = game.users) == null ? void 0 : a.get(t)) ?? null : null;
}
function Ce(e, i) {
  var n;
  const t = et(e);
  if (t && !t.isGM) return t;
  if (i) {
    const r = (n = game.users) == null ? void 0 : n.find((a) => !a.isGM && we(i, a.id));
    if (r) return r;
  }
  return t ?? null;
}
function oe(e = {}, i, t, n = !1) {
  const r = i === "failure" ? q() : R(), a = f(i === "failure" ? u.defaultFailureText : u.defaultText), c = i === "failure" ? "#ff4d7d" : "#69e8ff", o = i === "failure" ? e.failure ?? {} : e, l = Number(o.threshold);
  return {
    kind: i,
    enabled: o.enabled !== !1,
    threshold: Number.isInteger(l) && l >= 1 && l <= v() ? l : r,
    animationStyle: Ze(o.animationStyle),
    imagePath: (n ? t == null ? void 0 : t.img : "") || o.imagePath || (t == null ? void 0 : t.img) || "",
    audioPath: o.audioPath || "",
    overlayText: o.overlayText || a,
    accentColor: o.accentColor || c
  };
}
function k(e, i, t = "success") {
  const n = V(), r = i ? n[be("actor", i.id)] : null, a = (e == null ? void 0 : e.isGM) === !0, c = a ? n[Xe()] : null;
  if (!i && !a && !r)
    return oe({ enabled: !1 }, t, i);
  const o = a && !r && !!(i != null && i.img);
  return oe(r ?? c ?? {}, t, i, o);
}
function Se(e, i, t, n, r) {
  return r.enabled ? {
    id: foundry.utils.randomID(),
    messageId: e.id,
    userId: (n == null ? void 0 : n.id) ?? null,
    actorId: (t == null ? void 0 : t.id) ?? null,
    userName: (n == null ? void 0 : n.name) ?? "",
    actorName: (t == null ? void 0 : t.name) ?? (n == null ? void 0 : n.name) ?? "",
    triggerKind: r.kind ?? "success",
    naturalResult: i,
    threshold: r.threshold,
    animationStyle: r.animationStyle,
    blind: e.blind === !0,
    whisper: Array.isArray(e.whisper) ? [...e.whisper] : [],
    imagePath: r.imagePath || "",
    audioPath: r.audioPath || "",
    overlayText: r.overlayText || "",
    accentColor: r.accentColor || "#69e8ff",
    textEnabled: f(u.textEnabled),
    duration: f(u.duration),
    volume: f(u.volume),
    audience: f(u.audience)
  } : (L("Cut-in disabled for target.", { userId: n == null ? void 0 : n.id, actorId: t == null ? void 0 : t.id }), null);
}
function ce(e, i, t = "success") {
  const n = Ue(e);
  if (!(e != null && e.isRoll) && !n.length) return null;
  for (const r of n) {
    if (ve(e, r)) continue;
    const a = We(r).find((c) => ye(c, i, t));
    if (a) return a;
  }
  return null;
}
function le(e, i, t, n = "success") {
  const r = Je(i);
  return !r.length || ve(e, {}) ? null : r.find((a) => ye(a, t, n)) ?? null;
}
function se() {
  var t, n;
  const i = (((t = game.users) == null ? void 0 : t.filter((r) => r.active && r.isGM)) ?? []).sort((r, a) => r.id.localeCompare(a.id))[0];
  return ((n = game.user) == null ? void 0 : n.isGM) && (!i || i.id === game.user.id);
}
function F(e) {
  C.add(e);
  const i = C.values().next().value;
  C.size > 200 && i && C.delete(i);
}
function Ae(e) {
  var d;
  if (!(e != null && e.id) || C.has(e.id)) return !0;
  const i = Te(e), t = Ce(e, i), n = k(t, i, "success"), r = k(t, i, "failure"), a = ce(e, r.threshold, "failure"), c = a ? null : ce(e, n.threshold, "success"), o = a ?? c;
  if (!o) return !1;
  const s = Se(e, o, i, t, a ? r : n);
  return s ? (F(e.id), L("Triggering cut-in.", s), (d = game.socket) == null || d.emit($, { type: "play", payload: s }), D(s), !0) : (F(e.id), !0);
}
function tt(e, i) {
  var g;
  if (!(e != null && e.id) || C.has(e.id)) return !0;
  const t = Te(e), n = Ce(e, t), r = k(n, t, "success"), a = k(n, t, "failure"), c = le(e, i, a.threshold, "failure"), o = c ? null : le(e, i, r.threshold, "success"), l = c ?? o;
  if (!l) return !1;
  const d = Se(e, l, t, n, c ? a : r);
  return d ? (F(e.id), L("Triggering cut-in from rendered chat card.", d), (g = game.socket) == null || g.emit($, { type: "play", payload: d }), D(d), !0) : (F(e.id), !0);
}
function G(e, i) {
  e != null && e.id && globalThis.setTimeout(() => {
    var n;
    if (C.has(e.id)) return;
    const t = ((n = game.messages) == null ? void 0 : n.get(e.id)) ?? e;
    Ae(t);
  }, i);
}
function it() {
  var i;
  j.clear();
  for (const t of game.messages ?? [])
    t != null && t.id && j.add(t.id);
  Hooks.on("createChatMessage", (t) => {
    f(u.enabled) && se() && (Ae(t) || (G(t, 100), G(t, 500), G(t, 1500)));
  });
  const e = (t, n) => {
    f(u.enabled) && (Ke(t) || se() && tt(t, n));
  };
  Hooks.on("renderChatMessage", e), Hooks.on("renderChatMessageHTML", e), (i = game.socket) == null || i.on($, (t) => {
    (t == null ? void 0 : t.type) === "play" && f(u.enabled) && D(t.payload);
  });
}
function Pe(e, i = {}) {
  var c, o;
  const t = (c = game.users) == null ? void 0 : c.get(e), n = i.actorId ? (o = game.actors) == null ? void 0 : o.get(i.actorId) : (t == null ? void 0 : t.character) ?? null, r = i.triggerKind === "failure" ? "failure" : "success", a = k(t, n, r);
  return {
    id: foundry.utils.randomID(),
    userId: e,
    actorId: (n == null ? void 0 : n.id) ?? null,
    userName: (t == null ? void 0 : t.name) ?? "",
    actorName: (n == null ? void 0 : n.name) ?? (t == null ? void 0 : t.name) ?? "",
    naturalResult: i.naturalResult ?? a.threshold,
    triggerKind: r,
    threshold: i.threshold ?? a.threshold ?? R(),
    animationStyle: i.animationStyle ?? a.animationStyle ?? "strike",
    imagePath: i.imagePath ?? a.imagePath ?? "",
    audioPath: i.audioPath ?? a.audioPath ?? "",
    overlayText: i.overlayText ?? a.overlayText ?? f(u.defaultText),
    accentColor: i.accentColor ?? a.accentColor ?? "#69e8ff",
    textEnabled: i.textEnabled ?? f(u.textEnabled),
    duration: i.duration ?? f(u.duration),
    volume: i.volume ?? f(u.volume),
    audience: i.audience ?? f(u.audience)
  };
}
function nt(e, i = {}) {
  var r, a;
  const t = (r = game.actors) == null ? void 0 : r.get(e), n = ((a = game.users) == null ? void 0 : a.find((c) => !c.isGM && we(t, c.id))) ?? game.user;
  return Pe(n == null ? void 0 : n.id, { ...i, actorId: e });
}
function ue(e) {
  var i;
  (i = game.socket) == null || i.emit($, { type: "play", payload: e }), D(e);
}
function Ne() {
  var e, i, t;
  return ((i = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : i.api) ?? ((t = foundry == null ? void 0 : foundry.applications) == null ? void 0 : t.api) ?? null;
}
function Me() {
  var e, i, t;
  return ((i = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : i.api) ?? ((t = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : t.api) ?? null;
}
function rt(e = {}, i = {}) {
  var n, r, a;
  const t = ((r = (n = globalThis.foundry) == null ? void 0 : n.utils) == null ? void 0 : r.mergeObject) ?? ((a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.mergeObject);
  return typeof t == "function" ? t(e, i, { inplace: !1 }) : { ...e, ...i };
}
function at() {
  var e, i, t, n, r;
  return ((t = (i = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : i.randomID) == null ? void 0 : t.call(i, 8)) ?? ((r = (n = foundry == null ? void 0 : foundry.utils) == null ? void 0 : n.randomID) == null ? void 0 : r.call(n, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function de(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${at()}`),
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
function xe(e) {
  return class extends e {
    constructor(n = {}) {
      const r = rt(new.target.defaultOptions ?? {}, n);
      super(de(r));
      E(this, "_v1Options");
      this._v1Options = r;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return de(this.defaultOptions ?? {});
    }
    activateListeners(n) {
    }
    async _renderHTML(n, r) {
      var s, d, g;
      const a = typeof this.getData == "function" ? await this.getData() : {}, c = ((s = this._v1Options) == null ? void 0 : s.template) ?? ((d = this.options) == null ? void 0 : d.template) ?? ((g = this.constructor.defaultOptions) == null ? void 0 : g.template);
      if (!c) return document.createDocumentFragment();
      const o = await globalThis.renderTemplate(c, a), l = document.createElement("template");
      return l.innerHTML = o.trim(), l.content;
    }
    _activateV1Form(n) {
      var a, c;
      if (typeof this._updateObject != "function") return;
      const r = (a = n.matches) != null && a.call(n, "form") ? n : (c = n.querySelector) == null ? void 0 : c.call(n, "form");
      r instanceof HTMLFormElement && r.addEventListener("submit", async (o) => {
        var s;
        o.preventDefault(), o.stopPropagation();
        const l = new FormData(r);
        await this._updateObject(o, l), ((s = this._v1Options) == null ? void 0 : s.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(n, r, a) {
      var d, g, p, y;
      r.replaceChildren(n);
      const c = globalThis.jQuery ?? globalThis.$, o = ((d = r.closest) == null ? void 0 : d.call(r, ".window-app, .app, .application")) ?? r, l = c ? c(o) : o;
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
      const s = (g = this._v1Options) == null ? void 0 : g.classes;
      Array.isArray(s) && s.length && (r.classList.add(...s), (y = (p = r.closest) == null ? void 0 : p.call(r, ".window-app, .app, .application")) == null || y.classList.add(...s)), this._activateV1Form(r), typeof this.activateListeners == "function" && this.activateListeners(c ? c(r) : r);
    }
  };
}
function ot() {
  const e = Ne(), i = Me(), t = globalThis.Application ?? (i == null ? void 0 : i.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (i == null ? void 0 : i.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (t) return t;
  const n = e == null ? void 0 : e.ApplicationV2;
  return n ? xe(n) : null;
}
function ct() {
  const e = Ne(), i = Me(), t = globalThis.FormApplication ?? (i == null ? void 0 : i.FormApplication) ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (i == null ? void 0 : i.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (t) return t;
  const n = e == null ? void 0 : e.ApplicationV2;
  return n ? xe(n) : ot();
}
const lt = ct();
async function st(e, i, t) {
  var l, s, d, g;
  const { success: n, failure: r } = he(e, i), a = `<p>Change to <strong>d${e}</strong> with <strong>${i === "low" ? "low" : "high"} rolls positive</strong>?</p>
    <p>This resets the roll configuration for all ${t} listed players/GM entries, in both tabs, and the global thresholds:</p>
    <ul><li>Success: <strong>${n}</strong></li><li>Failure: <strong>${r}</strong></li></ul>
    <p>Images, audio, animation, labels, colors, and enabled states stay unchanged. Click Save afterward to apply these changes.</p>`, c = (s = (l = foundry == null ? void 0 : foundry.applications) == null ? void 0 : l.api) == null ? void 0 : s.DialogV2;
  if (c != null && c.confirm)
    return await c.confirm({
      window: { title: "Reset Critical Cut-In Roll Configuration?" },
      content: a,
      modal: !0,
      rejectClose: !1,
      yes: { label: "Change and Reset Rolls" },
      no: { label: "Cancel", default: !0 }
    }) === !0;
  const o = globalThis.Dialog ?? ((g = (d = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : d.api) == null ? void 0 : g.Dialog);
  if (!(o != null && o.confirm)) throw new Error("Foundry confirmation dialog is unavailable.");
  return await o.confirm({ title: "Reset Critical Cut-In Roll Configuration?", content: a, defaultYes: !1, rejectClose: !1 }) === !0;
}
function De(e, i) {
  return `${e}:${i}`;
}
function ut() {
  return De("gm", "default");
}
function dt(e, i) {
  var n, r, a, c;
  const t = ((r = (n = globalThis.CONST) == null ? void 0 : n.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : r.OWNER) ?? 3;
  return Number(((a = i == null ? void 0 : i.ownership) == null ? void 0 : a[e.id]) ?? ((c = i == null ? void 0 : i.ownership) == null ? void 0 : c.default) ?? 0) >= t;
}
function fe(e = {}, { defaultAccent: i = "#69e8ff" } = {}) {
  const t = Number(e.threshold), n = ["strike", "breach", "signal"].includes(e.animationStyle) ? e.animationStyle : "strike";
  return {
    enabled: e.enabled !== !1,
    threshold: Number.isInteger(t) && t >= 1 && t <= v() ? t : "",
    animationStyle: n,
    animationStyles: [
      { value: "strike", label: "Neon Strike", selected: n === "strike" },
      { value: "breach", label: "Panel Breach", selected: n === "breach" },
      { value: "signal", label: "Signal Bloom", selected: n === "signal" }
    ],
    imagePath: String(e.imagePath ?? ""),
    audioPath: String(e.audioPath ?? ""),
    overlayText: String(e.overlayText ?? ""),
    accentColor: String(e.accentColor ?? i)
  };
}
function ft(e = {}) {
  return {
    success: fe(e, { defaultAccent: "#69e8ff" }),
    failure: fe(e.failure, { defaultAccent: "#ff4d7d" })
  };
}
function ht() {
  var t, n, r;
  const e = ((t = game.users) == null ? void 0 : t.find((a) => a.isGM && a.active)) ?? ((n = game.users) == null ? void 0 : n.find((a) => a.isGM)) ?? game.user, i = [{
    key: ut(),
    type: "gm",
    typeLabel: "GM",
    id: "default",
    name: "GM Cut-In",
    portrait: (e == null ? void 0 : e.avatar) || "icons/svg/mystery-man.svg"
  }];
  for (const a of game.actors ?? []) {
    const c = ((r = game.users) == null ? void 0 : r.filter((o) => !o.isGM && dt(o, a)).map((o) => o.name)) ?? [];
    c.length && i.push({
      key: De("actor", a.id),
      type: "actor",
      typeLabel: "Actor",
      id: a.id,
      name: `${a.name} (${c.join(", ")})`,
      portrait: a.img || "icons/svg/mystery-man.svg"
    });
  }
  return i.sort((a, c) => a.type === "gm" ? -1 : c.type === "gm" ? 1 : a.name.localeCompare(c.name));
}
class Ie extends lt {
  constructor(t = {}) {
    super(t);
    E(this, "activeTabs");
    E(this, "rollRuleChange", null);
    this.activeTabs = /* @__PURE__ */ new Map();
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "hcci-player-config",
      title: `${me} Configuration`,
      template: _e,
      classes: ["hcci-config-window"],
      width: 1320,
      height: 760,
      resizable: !0,
      closeOnSubmit: !1,
      submitOnChange: !1
    });
  }
  async getData() {
    const t = V(), n = ht().map((r) => {
      const a = ft(t[r.key]), c = a.success.imagePath || r.portrait, o = a.failure.imagePath || r.portrait, l = this.activeTabs.get(r.key) === "failure" ? "failure" : "success";
      return {
        ...r,
        successActive: l === "success",
        failureActive: l === "failure",
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
      dieSides: v(),
      dice: $e(v()),
      lowRollsGood: B(),
      threshold: f(u.threshold) ?? 0,
      failureThreshold: f(u.failureThreshold) ?? 0,
      effectiveThreshold: R(),
      effectiveFailureThreshold: q(),
      duration: f(u.duration),
      defaultText: f(u.defaultText),
      defaultFailureText: f(u.defaultFailureText),
      rows: n
    };
  }
  activateListeners(t) {
    super.activateListeners(t);
    const n = () => {
      var o;
      (o = t.closest(".app")) == null || o.addClass("hcci-config-dirty"), t.find("[data-hcci-dirty]").prop("hidden", !1);
    }, r = () => {
      const o = Number(t.find("[name='dieSides']").val()), l = t.find("[name='rollDirection']").val() === "low";
      if (t.find("[data-hcci-success-label]").text(l ? "Success ≤" : "Success ≥"), t.find("[data-hcci-failure-label]").text(l ? "Failure ≥" : "Failure ≤"), !Number.isInteger(o) || o < 2 || o > 1e4) return;
      t.find("[name='threshold'], [name='failureThreshold'], [data-hcci-field='threshold']").attr("max", o);
      const s = Number(t.find("[name='threshold']").val()) || (l ? 1 : o), d = Number(t.find("[name='failureThreshold']").val()) || (l ? o : 1);
      t.find("[data-hcci-panel='success'] [data-hcci-field='threshold']").attr("placeholder", s), t.find("[data-hcci-panel='failure'] [data-hcci-field='threshold']").attr("placeholder", d);
    };
    t.find("[name='threshold'], [name='failureThreshold']").on("input change", r), r();
    let a = Number(t.find("[name='dieSides']").val()), c = String(t.find("[name='rollDirection']").val());
    t.find("[name='dieSides'], [name='rollDirection']").on("change", () => {
      if (this.rollRuleChange) return;
      const o = Number(t.find("[name='dieSides']").val()), l = String(t.find("[name='rollDirection']").val());
      if (o === a && l === c) return;
      const s = t.find("[name='dieSides'], [name='rollDirection'], [type='submit']");
      s.prop("disabled", !0), this.rollRuleChange = (async () => {
        var d, g;
        try {
          if (!await st(o, l, t.find("[data-hcci-row]").length)) return;
          const { success: y, failure: b } = he(o, l);
          t.find("[name='threshold'], [data-hcci-panel='success'] [data-hcci-field='threshold']").val(y), t.find("[name='failureThreshold'], [data-hcci-panel='failure'] [data-hcci-field='threshold']").val(b), a = o, c = l, n();
        } catch (p) {
          console.error(`${h} | Could not confirm dice change.`, p), (g = (d = ui.notifications) == null ? void 0 : d.error) == null || g.call(d, "Could not confirm the dice change. Your roll configuration has not changed.");
        } finally {
          t.find("[name='dieSides']").val(a), t.find("[name='rollDirection']").val(c), r(), s.prop("disabled", !1), this.rollRuleChange = null;
        }
      })();
    }), t.find("input, select").on("input change", (o) => {
      if (["dieSides", "rollDirection"].includes(o.currentTarget.name) || (n(), o.currentTarget.dataset.hcciField !== "imagePath")) return;
      const l = o.currentTarget.closest("[data-hcci-panel]"), s = l == null ? void 0 : l.querySelector("[data-hcci-preview]");
      s && (s.src = o.currentTarget.value || s.dataset.fallbackSrc || "icons/svg/mystery-man.svg");
    }), t.find("[data-hcci-browse]").on("click", (o) => {
      o.preventDefault();
      const l = o.currentTarget, s = l.closest("[data-hcci-panel]"), d = l.dataset.hcciBrowse, g = s == null ? void 0 : s.querySelector(`[data-hcci-field="${d}"]`);
      if (!g) return;
      new FilePicker({
        type: d === "audioPath" ? "audio" : "image",
        current: g.value,
        callback: (y) => {
          if (g.value = y, g.dispatchEvent(new Event("change", { bubbles: !0 })), d === "imagePath") {
            const b = s.querySelector("[data-hcci-preview]");
            b && (b.src = y || b.dataset.fallbackSrc || "icons/svg/mystery-man.svg");
          }
        }
      }).browse();
    }), t.find("[data-hcci-tab]").on("click", (o) => {
      o.preventDefault();
      const l = o.currentTarget.dataset.hcciTab, s = o.currentTarget.closest("[data-hcci-row]");
      s != null && s.dataset.hcciRow && this.activeTabs.set(s.dataset.hcciRow, l), s == null || s.querySelectorAll("[data-hcci-tab]").forEach((d) => d.classList.toggle("is-active", d.dataset.hcciTab === l)), s == null || s.querySelectorAll("[data-hcci-panel]").forEach((d) => d.classList.toggle("is-active", d.dataset.hcciPanel === l));
    }), t.find("[data-hcci-action='reset']").on("click", async (o) => {
      var l;
      o.preventDefault(), await ae({}), (l = ui.notifications) == null || l.info("Critical Cut-In player configuration reset."), this.render(!1);
    });
  }
  async _updateObject(t) {
    var g, p, y, b, _, K, U, Q;
    if (this.rollRuleChange) return;
    const n = t.currentTarget;
    if (!n.reportValidity()) return;
    const r = Number(((g = n.querySelector('[name="dieSides"]')) == null ? void 0 : g.value) ?? v()), a = ((p = n.querySelector('[name="rollDirection"]')) == null ? void 0 : p.value) === "low" ? "low" : "high", c = V(), o = (S, A) => {
      var W, Y, J, X, Z, ee, te, ie, ne;
      const w = S.querySelector(`[data-hcci-panel="${A}"]`), P = (N) => w == null ? void 0 : w.querySelector(`[data-hcci-field="${N}"]`);
      return {
        enabled: ((W = w == null ? void 0 : w.querySelector('[data-hcci-field="enabled"]')) == null ? void 0 : W.checked) === !0,
        threshold: (() => {
          var re;
          const N = Number((re = P("threshold")) == null ? void 0 : re.value);
          return Number.isInteger(N) && N >= 1 && N <= r ? N : "";
        })(),
        animationStyle: ((Y = P("animationStyle")) == null ? void 0 : Y.value) || "strike",
        imagePath: ((X = (J = P("imagePath")) == null ? void 0 : J.value) == null ? void 0 : X.trim()) ?? "",
        audioPath: ((ee = (Z = P("audioPath")) == null ? void 0 : Z.value) == null ? void 0 : ee.trim()) ?? "",
        overlayText: ((ie = (te = P("overlayText")) == null ? void 0 : te.value) == null ? void 0 : ie.trim()) ?? "",
        accentColor: ((ne = P("accentColor")) == null ? void 0 : ne.value) || (A === "failure" ? "#ff4d7d" : "#69e8ff")
      };
    };
    for (const S of n.querySelectorAll("[data-hcci-row]")) {
      const A = S.dataset.hcciRow, w = (y = S.querySelector("[data-hcci-panel].is-active")) == null ? void 0 : y.dataset.hcciPanel;
      w && this.activeTabs.set(A, w), c[A] = o(S, "success"), c[A].failure = o(S, "failure");
    }
    const l = Number(((b = n.querySelector('[name="threshold"]')) == null ? void 0 : b.value) ?? R()), s = Number(((_ = n.querySelector('[name="failureThreshold"]')) == null ? void 0 : _.value) ?? q()), d = Number(((K = n.querySelector('[name="duration"]')) == null ? void 0 : K.value) ?? f(u.duration));
    await M(u.dieSides, r), await M(u.rollDirection, a), await M(u.threshold, Math.min(r, Math.max(0, l))), await M(u.failureThreshold, Math.min(r, Math.max(0, s))), await M(u.duration, Math.min(8e3, Math.max(800, d))), await ae(c), (U = ui.notifications) == null || U.info("Critical Cut-In configuration saved."), (Q = this.element) == null || Q.removeClass("hcci-config-dirty"), this.render(!1);
  }
}
function ke() {
  var e, i;
  return (e = game.user) != null && e.isGM ? new Ie().render(!0) : ((i = ui.notifications) == null || i.warn("Only the GM can configure Critical Cut-In."), null);
}
function gt() {
  var t, n, r, a;
  const e = (t = game.modules.get("holosuite")) != null && t.active ? (n = game.modules.get("holosuite")) == null ? void 0 : n.api : null, i = (r = game.modules.get("holosuite-core")) != null && r.active ? (a = game.modules.get("holosuite-core")) == null ? void 0 : a.api : null;
  return e ?? i ?? game.holosuite ?? null;
}
function Le() {
  var i;
  const e = gt();
  return e != null && e.registerApp ? (e.registerApp({
    id: h,
    title: "Critical Cut-In",
    icon: "fa-solid fa-bolt-lightning",
    premium: !1,
    playerVisible: !1,
    description: "JRPG-style critical hit cut-in animation for natural d20 results.",
    enabled: f(u.enabled),
    open: () => ke()
  }), (i = e.registerWhatsNew) == null || i.call(e, {
    moduleId: h,
    title: "Critical Cut-In",
    tier: "free",
    version: "1.0.6",
    updated: "2026-09-02",
    icon: "fa-solid fa-bolt-lightning",
    entries: [
      {
        title: "Critical cut-ins for more dice",
        summary: "Choose from standard and registered dice, decide whether high or low results are positive, and configure separate success and failure thresholds for each character.",
        tags: ["Critical Cut-In", "Dice", "Thresholds", "Customization"]
      },
      {
        title: "More reliable cut-in detection",
        summary: "Improved Foundry 14 support and prevented old chat rolls, damage rolls, discarded dice, and rerolls from triggering unwanted animations.",
        tags: ["Critical Cut-In", "Bug Fix", "Foundry v12-v14", "Chat"]
      }
    ]
  }), console.log(`${h} | Registered with HoloSuite.`), !0) : !1;
}
function Ee() {
  const e = {
    playCutinForUser(t, n = {}) {
      var a;
      const r = Pe(t, n);
      return (a = game.user) != null && a.isGM ? ue(r) : D(r), r;
    },
    playCutinForActor(t, n = {}) {
      var a;
      const r = nt(t, n);
      return (a = game.user) != null && a.isGM ? ue(r) : D(r), r;
    },
    openConfig: ke
  }, i = game.modules.get(h);
  return i && (i.api = e), game.holosuiteCriticalCutin = e, e;
}
Hooks.once("init", async () => {
  He(Ie), Ee(), await loadTemplates([`modules/${h}/templates/player-config.hbs`]);
});
Hooks.once("ready", () => {
  Ee(), it(), Le(), console.log(`${h} | Ready. API available at game.modules.get("${h}").api`);
});
Hooks.on("hotReload", () => {
  Le();
});
console.log(`${me} | Loading.`);
