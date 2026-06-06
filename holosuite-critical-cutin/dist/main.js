const d = "holosuite-critical-cutin", X = "HoloSuite Critical Cut-In", E = `module.${d}`, le = `modules/${d}/templates/player-config.hbs`, l = {
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
function ue(e) {
  game.settings.register(d, l.enabled, {
    name: "Enable Critical Cut-In",
    hint: "Play a configured cut-in when a qualifying natural d20 result is rolled.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(d, l.threshold, {
    name: "Default Trigger Threshold",
    hint: "Natural d20 results equal to or above this number trigger the cut-in. Example: 19 triggers on 19 and 20.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 1, max: 20, step: 1 },
    default: 20
  }), game.settings.register(d, l.failureThreshold, {
    name: "Default Failure Trigger",
    hint: "Natural d20 results equal to or below this number trigger the failure cut-in. Example: 1 triggers only on a natural 1.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 1, max: 20, step: 1 },
    default: 1
  }), game.settings.register(d, l.duration, {
    name: "Animation Duration",
    hint: "How long the cut-in remains visible, in milliseconds.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 800, max: 8e3, step: 100 },
    default: 2500
  }), game.settings.register(d, l.volume, {
    name: "Cut-In Audio Volume",
    hint: "Volume multiplier for configured cut-in audio samples.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 0.8
  }), game.settings.register(d, l.audience, {
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
  }), game.settings.register(d, l.textEnabled, {
    name: "Enable Text Overlay",
    hint: "Show the configured label during the cut-in.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(d, l.defaultText, {
    name: "Default Overlay Text",
    hint: "Fallback label used when no player-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL"
  }), game.settings.register(d, l.defaultFailureText, {
    name: "Default Failure Overlay Text",
    hint: "Fallback label used when no failure-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL FAILURE"
  }), game.settings.register(d, l.debug, {
    name: "Debug Logging",
    hint: "Log roll detection and playback decisions to the console.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(d, l.playerConfigs, {
    name: "Per-Player Cut-In Configuration",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.registerMenu(d, "playerConfigMenu", {
    name: "Configure Player Cut-Ins",
    label: "Open Configuration",
    hint: "Set each user or actor portrait, audio sample, label, accent color, and enable state.",
    icon: "fa-solid fa-bolt",
    type: e,
    restricted: !0
  });
}
function u(e) {
  return game.settings.get(d, e);
}
async function M(e, t) {
  return game.settings.set(d, e, t);
}
function P() {
  return Math.min(20, Math.max(1, Number(u(l.threshold) || 20)));
}
function k() {
  return Math.min(20, Math.max(1, Number(u(l.failureThreshold) || 1)));
}
function Y() {
  const e = u(l.playerConfigs);
  return foundry.utils.deepClone(e && typeof e == "object" ? e : {});
}
async function U(e) {
  return M(l.playerConfigs, e && typeof e == "object" ? e : {});
}
function w(...e) {
  u(l.debug) && console.log(`${d} |`, ...e);
}
const T = [], S = /* @__PURE__ */ new Set();
let I = !1;
function N(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function se(e) {
  var a, i, r, n, c, o, f;
  if (e != null && e.blind && !((a = game.user) != null && a.isGM) || Array.isArray(e == null ? void 0 : e.whisper) && e.whisper.length && !e.whisper.includes((i = game.user) == null ? void 0 : i.id) && !((r = game.user) != null && r.isGM))
    return !1;
  const t = (e == null ? void 0 : e.audience) ?? u(l.audience);
  return t === v.everyone ? !0 : t === v.gm ? ((n = game.user) == null ? void 0 : n.isGM) === !0 : t === v.triggeringPlayer ? ((c = game.user) == null ? void 0 : c.isGM) === !0 || ((o = game.user) == null ? void 0 : o.id) === (e == null ? void 0 : e.userId) || ((f = game.user) == null ? void 0 : f.id) === (e == null ? void 0 : e.authorId) : !0;
}
async function de(e, t) {
  var a, i, r;
  if (e)
    try {
      const n = Math.min(1, Math.max(0, Number(t ?? u(l.volume) ?? 0.8)));
      if ((i = (a = foundry.audio) == null ? void 0 : a.AudioHelper) != null && i.play)
        return foundry.audio.AudioHelper.play({ src: e, volume: n, autoplay: !0, loop: !1 }, !1);
      if ((r = globalThis.AudioHelper) != null && r.play)
        return globalThis.AudioHelper.play({ src: e, volume: n, autoplay: !0, loop: !1 }, !1);
      const c = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), o = new Audio(e);
      return o.volume = n * c, await o.play(), o;
    } catch (n) {
      return w("Audio playback failed.", { src: e, error: n }), null;
    }
}
function fe(e) {
  try {
    if (!e) return;
    if (typeof e.stop == "function") {
      e.stop();
      return;
    }
    typeof e.pause == "function" && (e.pause(), e.currentTime = 0);
  } catch (t) {
    w("Audio stop failed.", t);
  }
}
function he(e) {
  const t = e.accentColor || "#69e8ff", a = ["strike", "breach", "signal"].includes(e.animationStyle) ? e.animationStyle : "strike", i = e.triggerKind === "failure" ? "failure" : "success", r = e.imagePath ? `<img class="hcci-portrait" src="${N(e.imagePath)}" alt="">` : '<div class="hcci-portrait hcci-portrait-fallback"><i class="fa-solid fa-user-astronaut"></i></div>', n = e.imagePath ? [0, 1, 2, 3].map((h) => `<div class="hcci-fracture hcci-fracture-${h + 1}" style="background-image: url('${N(e.imagePath)}')"></div>`).join("") : "", c = Math.max(1, String(e.overlayText ?? "").length), o = e.textEnabled && e.overlayText ? `<div class="hcci-title" style="--hcci-title-chars: ${c}">${N(e.overlayText)}</div>` : "", f = e.actorName || e.userName || "", g = document.createElement("div");
  return g.className = `hcci-overlay hcci-style-${a} hcci-kind-${i}`, g.style.setProperty("--hcci-accent", t), g.innerHTML = `
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
        ${n}
        <div class="hcci-frame-lightning hcci-frame-lightning-a"></div>
        <div class="hcci-frame-lightning hcci-frame-lightning-b"></div>
      </div>
      <div class="hcci-copy">
        ${o}
        ${f ? `<div class="hcci-subtitle">${N(f)}</div>` : ""}
      </div>
    </section>
  `, g;
}
async function ge(e) {
  if (!se(e)) return;
  const t = Math.min(8e3, Math.max(800, Number(e.duration ?? u(l.duration) ?? 2500))), a = he(e);
  a.style.setProperty("--hcci-duration", `${t}ms`), document.body.appendChild(a), document.body.classList.add("hcci-screen-shake");
  const i = de(e.audioPath, e.volume);
  await new Promise((r) => window.setTimeout(r, Math.max(250, t - 250))), fe(await i), a.classList.add("hcci-exiting"), await new Promise((r) => window.setTimeout(r, 250)), a.remove(), document.body.classList.remove("hcci-screen-shake");
}
async function me() {
  if (!I) {
    for (I = !0; T.length; ) {
      const e = T.shift();
      await ge(e);
    }
    I = !1;
  }
}
function A(e) {
  if (e) {
    if (e.id) {
      if (S.has(e.id)) return;
      S.add(e.id), S.size > 100 && S.delete(S.values().next().value);
    }
    T.push(e), T.length > 3 && T.splice(1, T.length - 3), me();
  }
}
const C = /* @__PURE__ */ new Set();
function ye(e, t) {
  var c, o, f, g, h, m;
  if ([...(t == null ? void 0 : t.terms) ?? [], ...(t == null ? void 0 : t.dice) ?? []].some((y) => y && y.faces === 20)) return !1;
  const i = (e == null ? void 0 : e.flags) ?? {}, r = ((o = (c = i.dnd5e) == null ? void 0 : c.roll) == null ? void 0 : o.type) ?? ((g = (f = i.dnd5e) == null ? void 0 : f.roll) == null ? void 0 : g.rollType), n = (m = (h = i.pf2e) == null ? void 0 : h.context) == null ? void 0 : m.type;
  return [r, n].some((y) => String(y ?? "").toLowerCase().includes("damage"));
}
function ve(e) {
  var a;
  const t = [];
  return Array.isArray(e == null ? void 0 : e.rolls) && t.push(...e.rolls), e != null && e.roll && t.push(e.roll), Array.isArray((a = e == null ? void 0 : e._source) == null ? void 0 : a.rolls) && t.push(...e._source.rolls), t.map((i) => {
    var r;
    if (!i || typeof i != "string") return i;
    try {
      if ((r = globalThis.Roll) != null && r.fromJSON) return globalThis.Roll.fromJSON(i);
    } catch (n) {
      w("Roll.fromJSON failed; falling back to raw JSON parse.", n);
    }
    try {
      return JSON.parse(i);
    } catch (n) {
      return w("Unable to parse serialized roll data.", { roll: i, error: n }), null;
    }
  }).filter(Boolean);
}
function pe(e) {
  const t = [], a = [...(e == null ? void 0 : e.terms) ?? [], ...(e == null ? void 0 : e.dice) ?? []], i = /* @__PURE__ */ new Set();
  for (const r of a)
    if (!i.has(r) && (i.add(r), !(!r || r.faces !== 20 || !Array.isArray(r.results))))
      for (const n of r.results) {
        if (n.active === !1 || n.discarded === !0) continue;
        const c = Number(n.result);
        Number.isInteger(c) && t.push(c);
      }
  return t;
}
function Z(e, t) {
  return `${e}:${t}`;
}
function be() {
  return Z("gm", "default");
}
function Te(e) {
  return ["strike", "breach", "signal"].includes(e) ? e : "strike";
}
function ee(e, t) {
  var i, r, n, c;
  if (!e || !t) return !1;
  const a = ((r = (i = globalThis.CONST) == null ? void 0 : i.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : r.OWNER) ?? 3;
  return Number(((n = e.ownership) == null ? void 0 : n[t]) ?? ((c = e.ownership) == null ? void 0 : c.default) ?? 0) >= a;
}
function te(e) {
  var a, i, r;
  const t = ((a = e == null ? void 0 : e.user) == null ? void 0 : a.id) ?? (e == null ? void 0 : e.userId) ?? ((i = e == null ? void 0 : e._source) == null ? void 0 : i.user) ?? (typeof (e == null ? void 0 : e.user) == "string" ? e.user : null);
  return t ? String(t) : e != null && e.isAuthor ? ((r = game.user) == null ? void 0 : r.id) ?? null : null;
}
function we(e) {
  var a;
  const t = (e == null ? void 0 : e.speaker) ?? {};
  return e != null && e.speakerActor ? e.speakerActor : t.actor ? ((a = game.actors) == null ? void 0 : a.get(t.actor)) ?? null : e != null && e.actor ? e.actor : null;
}
function Se(e, t) {
  var r, n;
  const a = te(e), i = a ? (r = game.users) == null ? void 0 : r.get(a) : null;
  if (!i && (e != null && e.isAuthor) && game.user) return game.user;
  if (i) return i;
  if (t) {
    const c = (n = game.users) == null ? void 0 : n.find((o) => !o.isGM && ee(t, o.id));
    if (c) return c;
  }
  return i ?? null;
}
function Ce(e = {}, t, a) {
  const i = t === "failure" ? k() : P(), r = u(t === "failure" ? l.defaultFailureText : l.defaultText), n = t === "failure" ? "#ff4d7d" : "#69e8ff", c = t === "failure" ? e.failure ?? {} : e, o = Number(c.threshold);
  return {
    kind: t,
    enabled: c.enabled !== !1,
    threshold: Number.isInteger(o) && o >= 1 && o <= 20 ? o : i,
    animationStyle: Te(c.animationStyle),
    imagePath: c.imagePath || (a == null ? void 0 : a.img) || "",
    audioPath: c.audioPath || "",
    overlayText: c.overlayText || r,
    accentColor: c.accentColor || n
  };
}
function $(e, t, a = "success") {
  const i = Y(), r = t ? i[Z("actor", t.id)] : null, n = e != null && e.isGM ? i[be()] : null;
  return !t && !(e != null && e.isGM) && !r ? { enabled: !1, threshold: a === "failure" ? k() : P() } : Ce(r ?? n ?? {}, a, t);
}
function Pe(e, t, a, i, r) {
  if (!r.enabled)
    return w("Cut-in disabled for target.", { userId: i == null ? void 0 : i.id, actorId: a == null ? void 0 : a.id }), null;
  const n = te(e);
  return {
    id: foundry.utils.randomID(),
    messageId: e.id,
    userId: (i == null ? void 0 : i.id) ?? null,
    authorId: n ?? (i == null ? void 0 : i.id) ?? null,
    actorId: (a == null ? void 0 : a.id) ?? null,
    userName: (i == null ? void 0 : i.name) ?? "",
    actorName: (a == null ? void 0 : a.name) ?? (i == null ? void 0 : i.name) ?? "",
    triggerKind: r.kind ?? "success",
    naturalResult: t,
    threshold: r.threshold,
    animationStyle: r.animationStyle,
    blind: e.blind === !0,
    whisper: Array.isArray(e.whisper) ? [...e.whisper] : [],
    imagePath: r.imagePath || "",
    audioPath: r.audioPath || "",
    overlayText: r.overlayText || "",
    accentColor: r.accentColor || "#69e8ff",
    textEnabled: u(l.textEnabled),
    duration: u(l.duration),
    volume: u(l.volume),
    audience: u(l.audience)
  };
}
function B(e, t, a = "success") {
  const i = ve(e);
  if (!(e != null && e.isRoll) && !i.length) return null;
  for (const r of i) {
    if (ye(e, r)) continue;
    const n = pe(r), c = a === "failure" ? n.find((o) => o <= t) : n.find((o) => o >= t);
    if (c) return c;
  }
  return null;
}
function Ae() {
  var a, i;
  const t = (((a = game.users) == null ? void 0 : a.filter((r) => r.active && r.isGM)) ?? []).sort((r, n) => r.id.localeCompare(n.id))[0];
  return ((i = game.user) == null ? void 0 : i.isGM) && (!t || t.id === game.user.id);
}
function xe() {
  var e;
  Hooks.on("createChatMessage", (t) => {
    var m;
    if (!u(l.enabled) || !Ae() || C.has(t.id)) return;
    C.add(t.id), C.size > 200 && C.delete(C.values().next().value);
    const a = we(t), i = Se(t, a), r = $(i, a, "success"), n = $(i, a, "failure"), c = B(t, n.threshold, "failure"), o = c ? null : B(t, r.threshold, "success"), f = c ?? o;
    if (!f) return;
    const h = Pe(t, f, a, i, c ? n : r);
    h && (w("Triggering cut-in.", h), (m = game.socket) == null || m.emit(E, { type: "play", payload: h }), A(h));
  }), (e = game.socket) == null || e.on(E, (t) => {
    (t == null ? void 0 : t.type) === "play" && u(l.enabled) && A(t.payload);
  });
}
function ie(e, t = {}) {
  var c, o, f;
  const a = (c = game.users) == null ? void 0 : c.get(e), i = t.actorId ? (o = game.actors) == null ? void 0 : o.get(t.actorId) : (a == null ? void 0 : a.character) ?? null, r = t.triggerKind === "failure" ? "failure" : "success", n = $(a, i, r);
  return {
    id: foundry.utils.randomID(),
    userId: e,
    authorId: ((f = game.user) == null ? void 0 : f.id) ?? e,
    actorId: (i == null ? void 0 : i.id) ?? null,
    userName: (a == null ? void 0 : a.name) ?? "",
    actorName: (i == null ? void 0 : i.name) ?? (a == null ? void 0 : a.name) ?? "",
    naturalResult: t.naturalResult ?? 20,
    triggerKind: r,
    threshold: t.threshold ?? n.threshold ?? P(),
    animationStyle: t.animationStyle ?? n.animationStyle ?? "strike",
    imagePath: t.imagePath ?? n.imagePath ?? "",
    audioPath: t.audioPath ?? n.audioPath ?? "",
    overlayText: t.overlayText ?? n.overlayText ?? u(l.defaultText),
    accentColor: t.accentColor ?? n.accentColor ?? "#69e8ff",
    textEnabled: t.textEnabled ?? u(l.textEnabled),
    duration: t.duration ?? u(l.duration),
    volume: t.volume ?? u(l.volume),
    audience: t.audience ?? u(l.audience)
  };
}
function Ne(e, t = {}) {
  var r, n;
  const a = (r = game.actors) == null ? void 0 : r.get(e), i = ((n = game.users) == null ? void 0 : n.find((c) => !c.isGM && ee(a, c.id))) ?? game.user;
  return ie(i == null ? void 0 : i.id, { ...t, actorId: e });
}
function V(e) {
  var t;
  (t = game.socket) == null || t.emit(E, { type: "play", payload: e }), A(e);
}
var J, W, Q;
const Me = globalThis.FormApplication ?? ((Q = (W = (J = globalThis.foundry) == null ? void 0 : J.appv1) == null ? void 0 : W.api) == null ? void 0 : Q.FormApplication);
function re(e, t) {
  return `${e}:${t}`;
}
function ke() {
  return re("gm", "default");
}
function Ie(e, t) {
  var i, r, n, c;
  const a = ((r = (i = globalThis.CONST) == null ? void 0 : i.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : r.OWNER) ?? 3;
  return Number(((n = t == null ? void 0 : t.ownership) == null ? void 0 : n[e.id]) ?? ((c = t == null ? void 0 : t.ownership) == null ? void 0 : c.default) ?? 0) >= a;
}
function j(e = {}, { defaultAccent: t = "#69e8ff" } = {}) {
  const a = Number(e.threshold), i = ["strike", "breach", "signal"].includes(e.animationStyle) ? e.animationStyle : "strike";
  return {
    enabled: e.enabled !== !1,
    threshold: Number.isInteger(a) && a >= 1 && a <= 20 ? a : "",
    animationStyle: i,
    animationStyles: [
      { value: "strike", label: "Neon Strike", selected: i === "strike" },
      { value: "breach", label: "Panel Breach", selected: i === "breach" },
      { value: "signal", label: "Signal Bloom", selected: i === "signal" }
    ],
    imagePath: String(e.imagePath ?? ""),
    audioPath: String(e.audioPath ?? ""),
    overlayText: String(e.overlayText ?? ""),
    accentColor: String(e.accentColor ?? t)
  };
}
function Ee(e = {}) {
  return {
    success: j(e, { defaultAccent: "#69e8ff" }),
    failure: j(e.failure, { defaultAccent: "#ff4d7d" })
  };
}
function $e() {
  var a, i, r;
  const e = ((a = game.users) == null ? void 0 : a.find((n) => n.isGM && n.active)) ?? ((i = game.users) == null ? void 0 : i.find((n) => n.isGM)) ?? game.user, t = [{
    key: ke(),
    type: "gm",
    typeLabel: "GM",
    id: "default",
    name: "GM Cut-In",
    portrait: (e == null ? void 0 : e.avatar) || "icons/svg/mystery-man.svg"
  }];
  for (const n of game.actors ?? []) {
    const c = ((r = game.users) == null ? void 0 : r.filter((o) => !o.isGM && Ie(o, n)).map((o) => o.name)) ?? [];
    c.length && t.push({
      key: re("actor", n.id),
      type: "actor",
      typeLabel: "Actor",
      id: n.id,
      name: `${n.name} (${c.join(", ")})`,
      portrait: n.img || "icons/svg/mystery-man.svg"
    });
  }
  return t.sort((n, c) => n.type === "gm" ? -1 : c.type === "gm" ? 1 : n.name.localeCompare(c.name));
}
class ne extends Me {
  constructor(t = {}) {
    super(t), this.activeTabs = /* @__PURE__ */ new Map();
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "hcci-player-config",
      title: `${X} Configuration`,
      template: le,
      classes: ["hcci-config-window"],
      width: 1320,
      height: "auto",
      resizable: !0,
      closeOnSubmit: !1,
      submitOnChange: !1
    });
  }
  async getData() {
    const t = Y(), a = $e().map((i) => {
      const r = Ee(t[i.key]), n = r.success.imagePath || i.portrait, c = r.failure.imagePath || i.portrait, o = this.activeTabs.get(i.key) === "failure" ? "failure" : "success";
      return {
        ...i,
        successActive: o === "success",
        failureActive: o === "failure",
        success: {
          ...r.success,
          preview: n,
          imageStatus: r.success.imagePath ? "Custom image configured." : "No custom image configured.",
          audioStatus: r.success.audioPath ? "Audio sample configured." : "No audio sample configured."
        },
        failure: {
          ...r.failure,
          preview: c,
          imageStatus: r.failure.imagePath ? "Custom image configured." : "No custom image configured.",
          audioStatus: r.failure.audioPath ? "Audio sample configured." : "No audio sample configured."
        }
      };
    });
    return {
      moduleId: d,
      threshold: P(),
      failureThreshold: k(),
      duration: u(l.duration),
      defaultText: u(l.defaultText),
      defaultFailureText: u(l.defaultFailureText),
      rows: a
    };
  }
  activateListeners(t) {
    super.activateListeners(t);
    const a = () => {
      var i;
      (i = t.closest(".app")) == null || i.addClass("hcci-config-dirty"), t.find("[data-hcci-dirty]").prop("hidden", !1);
    };
    t.find("input, select").on("input change", (i) => {
      if (a(), i.currentTarget.dataset.hcciField !== "imagePath") return;
      const r = i.currentTarget.closest("[data-hcci-panel]"), n = r == null ? void 0 : r.querySelector("[data-hcci-preview]");
      n && (n.src = i.currentTarget.value || n.dataset.fallbackSrc || "icons/svg/mystery-man.svg");
    }), t.find("[data-hcci-browse]").on("click", (i) => {
      i.preventDefault();
      const r = i.currentTarget, n = r.closest("[data-hcci-panel]"), c = r.dataset.hcciBrowse, o = n == null ? void 0 : n.querySelector(`[data-hcci-field="${c}"]`);
      if (!o) return;
      new FilePicker({
        type: c === "audioPath" ? "audio" : "image",
        current: o.value,
        callback: (g) => {
          if (o.value = g, o.dispatchEvent(new Event("change", { bubbles: !0 })), c === "imagePath") {
            const h = n.querySelector("[data-hcci-preview]");
            h && (h.src = g || h.dataset.fallbackSrc || "icons/svg/mystery-man.svg");
          }
        }
      }).browse();
    }), t.find("[data-hcci-tab]").on("click", (i) => {
      i.preventDefault();
      const r = i.currentTarget.dataset.hcciTab, n = i.currentTarget.closest("[data-hcci-row]");
      n != null && n.dataset.hcciRow && this.activeTabs.set(n.dataset.hcciRow, r), n == null || n.querySelectorAll("[data-hcci-tab]").forEach((c) => c.classList.toggle("is-active", c.dataset.hcciTab === r)), n == null || n.querySelectorAll("[data-hcci-panel]").forEach((c) => c.classList.toggle("is-active", c.dataset.hcciPanel === r));
    }), t.find("[data-hcci-action='reset']").on("click", async (i) => {
      var r;
      i.preventDefault(), await U({}), (r = ui.notifications) == null || r.info("Critical Cut-In player configuration reset."), this.render(!1);
    });
  }
  async _updateObject(t) {
    var f, g, h, m, y, O;
    const a = t.currentTarget, i = {}, r = (p, b) => {
      var L, R, G, D, q, F, H, _, z;
      const s = p.querySelector(`[data-hcci-panel="${b}"]`);
      return {
        enabled: ((L = s == null ? void 0 : s.querySelector('[data-hcci-field="enabled"]')) == null ? void 0 : L.checked) === !0,
        threshold: (() => {
          var K;
          const x = Number((K = s == null ? void 0 : s.querySelector('[data-hcci-field="threshold"]')) == null ? void 0 : K.value);
          return Number.isInteger(x) && x >= 1 && x <= 20 ? x : "";
        })(),
        animationStyle: ((R = s == null ? void 0 : s.querySelector('[data-hcci-field="animationStyle"]')) == null ? void 0 : R.value) || "strike",
        imagePath: ((D = (G = s == null ? void 0 : s.querySelector('[data-hcci-field="imagePath"]')) == null ? void 0 : G.value) == null ? void 0 : D.trim()) ?? "",
        audioPath: ((F = (q = s == null ? void 0 : s.querySelector('[data-hcci-field="audioPath"]')) == null ? void 0 : q.value) == null ? void 0 : F.trim()) ?? "",
        overlayText: ((_ = (H = s == null ? void 0 : s.querySelector('[data-hcci-field="overlayText"]')) == null ? void 0 : H.value) == null ? void 0 : _.trim()) ?? "",
        accentColor: ((z = s == null ? void 0 : s.querySelector('[data-hcci-field="accentColor"]')) == null ? void 0 : z.value) || (b === "failure" ? "#ff4d7d" : "#69e8ff")
      };
    };
    for (const p of a.querySelectorAll("[data-hcci-row]")) {
      const b = p.dataset.hcciRow, s = (f = p.querySelector("[data-hcci-panel].is-active")) == null ? void 0 : f.dataset.hcciPanel;
      s && this.activeTabs.set(b, s), i[b] = r(p, "success"), i[b].failure = r(p, "failure");
    }
    const n = Number(((g = a.querySelector('[name="threshold"]')) == null ? void 0 : g.value) ?? P()), c = Number(((h = a.querySelector('[name="failureThreshold"]')) == null ? void 0 : h.value) ?? k()), o = Number(((m = a.querySelector('[name="duration"]')) == null ? void 0 : m.value) ?? u(l.duration));
    await M(l.threshold, Math.min(20, Math.max(1, n))), await M(l.failureThreshold, Math.min(20, Math.max(1, c))), await M(l.duration, Math.min(8e3, Math.max(800, o))), await U(i), (y = ui.notifications) == null || y.info("Critical Cut-In configuration saved."), (O = this.element) == null || O.removeClass("hcci-config-dirty"), this.render(!1);
  }
}
function ae() {
  var e, t;
  return (e = game.user) != null && e.isGM ? new ne().render(!0) : ((t = ui.notifications) == null || t.warn("Only the GM can configure Critical Cut-In."), null);
}
function Oe() {
  var a, i, r, n;
  const e = (a = game.modules.get("holosuite")) != null && a.active ? (i = game.modules.get("holosuite")) == null ? void 0 : i.api : null, t = (r = game.modules.get("holosuite-core")) != null && r.active ? (n = game.modules.get("holosuite-core")) == null ? void 0 : n.api : null;
  return e ?? t ?? game.holosuite ?? null;
}
function ce() {
  const e = Oe();
  return e != null && e.registerApp ? (e.registerApp({
    id: d,
    title: "Critical Cut-In",
    icon: "fa-solid fa-bolt-lightning",
    premium: !1,
    playerVisible: !1,
    description: "JRPG-style critical hit cut-in animation for natural d20 results.",
    enabled: u(l.enabled),
    open: () => ae()
  }), console.log(`${d} | Registered with HoloSuite.`), !0) : !1;
}
function oe() {
  const e = {
    playCutinForUser(a, i = {}) {
      var n;
      const r = ie(a, i);
      return (n = game.user) != null && n.isGM ? V(r) : A(r), r;
    },
    playCutinForActor(a, i = {}) {
      var n;
      const r = Ne(a, i);
      return (n = game.user) != null && n.isGM ? V(r) : A(r), r;
    },
    openConfig: ae
  }, t = game.modules.get(d);
  return t && (t.api = e), game.holosuiteCriticalCutin = e, e;
}
Hooks.once("init", async () => {
  ue(ne), oe(), await loadTemplates([`modules/${d}/templates/player-config.hbs`]);
});
Hooks.once("ready", () => {
  oe(), xe(), ce(), console.log(`${d} | Ready. API available at game.modules.get("${d}").api`);
});
Hooks.on("hotReload", () => {
  ce();
});
console.log(`${X} | Loading.`);
