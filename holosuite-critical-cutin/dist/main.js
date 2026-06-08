var de = Object.defineProperty;
var fe = (e, t, n) => t in e ? de(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var j = (e, t, n) => fe(e, typeof t != "symbol" ? t + "" : t, n);
const u = "holosuite-critical-cutin", te = "HoloSuite Critical Cut-In", I = `module.${u}`, ge = `modules/${u}/templates/player-config.hbs`, s = {
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
}, y = {
  everyone: "everyone",
  gm: "gm",
  triggeringPlayer: "triggeringPlayer"
};
function he(e) {
  game.settings.register(u, s.enabled, {
    name: "Enable Critical Cut-In",
    hint: "Play a configured cut-in when a qualifying natural d20 result is rolled.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(u, s.threshold, {
    name: "Default Trigger Threshold",
    hint: "Natural d20 results equal to or above this number trigger the cut-in. Example: 19 triggers on 19 and 20.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 1, max: 20, step: 1 },
    default: 20
  }), game.settings.register(u, s.failureThreshold, {
    name: "Default Failure Trigger",
    hint: "Natural d20 results equal to or below this number trigger the failure cut-in. Example: 1 triggers only on a natural 1.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 1, max: 20, step: 1 },
    default: 1
  }), game.settings.register(u, s.duration, {
    name: "Animation Duration",
    hint: "How long the cut-in remains visible, in milliseconds.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 800, max: 8e3, step: 100 },
    default: 2500
  }), game.settings.register(u, s.volume, {
    name: "Cut-In Audio Volume",
    hint: "Volume multiplier for configured cut-in audio samples.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 0.8
  }), game.settings.register(u, s.audience, {
    name: "Show Animation To",
    hint: "Choose who sees synchronized cut-in playback.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      [y.everyone]: "Everyone",
      [y.gm]: "GM only",
      [y.triggeringPlayer]: "Triggering player only"
    },
    default: y.everyone
  }), game.settings.register(u, s.textEnabled, {
    name: "Enable Text Overlay",
    hint: "Show the configured label during the cut-in.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(u, s.defaultText, {
    name: "Default Overlay Text",
    hint: "Fallback label used when no player-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL"
  }), game.settings.register(u, s.defaultFailureText, {
    name: "Default Failure Overlay Text",
    hint: "Fallback label used when no failure-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL FAILURE"
  }), game.settings.register(u, s.debug, {
    name: "Debug Logging",
    hint: "Log roll detection and playback decisions to the console.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(u, s.playerConfigs, {
    name: "Per-Player Cut-In Configuration",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.registerMenu(u, "playerConfigMenu", {
    name: "Configure Player Cut-Ins",
    label: "Open Configuration",
    hint: "Set each user or actor portrait, audio sample, label, accent color, and enable state.",
    icon: "fa-solid fa-bolt",
    type: e,
    restricted: !0
  });
}
function l(e) {
  return game.settings.get(u, e);
}
async function M(e, t) {
  return game.settings.set(u, e, t);
}
function N() {
  return Math.min(20, Math.max(1, Number(l(s.threshold) || 20)));
}
function $() {
  return Math.min(20, Math.max(1, Number(l(s.failureThreshold) || 1)));
}
function ie() {
  const e = l(s.playerConfigs);
  return foundry.utils.deepClone(e && typeof e == "object" ? e : {});
}
async function B(e) {
  return M(s.playerConfigs, e && typeof e == "object" ? e : {});
}
function k(...e) {
  l(s.debug) && console.log(`${u} |`, ...e);
}
const C = [], P = /* @__PURE__ */ new Set();
let E = !1;
function A(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function me(e) {
  var n, r, i, a, c;
  if (e != null && e.blind && !((n = game.user) != null && n.isGM) || Array.isArray(e == null ? void 0 : e.whisper) && e.whisper.length && !e.whisper.includes((r = game.user) == null ? void 0 : r.id) && !((i = game.user) != null && i.isGM))
    return !1;
  const t = (e == null ? void 0 : e.audience) ?? l(s.audience);
  return t === y.everyone ? !0 : t === y.gm ? ((a = game.user) == null ? void 0 : a.isGM) === !0 : t === y.triggeringPlayer ? ((c = game.user) == null ? void 0 : c.id) === (e == null ? void 0 : e.userId) : !0;
}
async function ve(e, t) {
  var n, r;
  if (e)
    try {
      const i = Math.min(1, Math.max(0, Number(t ?? l(s.volume) ?? 0.8)));
      if ((r = (n = foundry.audio) == null ? void 0 : n.AudioHelper) != null && r.play)
        return foundry.audio.AudioHelper.play({ src: e, volume: i, autoplay: !0, loop: !1 }, !1);
      const a = globalThis.AudioHelper;
      if (a != null && a.play)
        return a.play({ src: e, volume: i, autoplay: !0, loop: !1 }, !1);
      const c = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), o = new Audio(e);
      return o.volume = i * c, await o.play(), o;
    } catch (i) {
      return k("Audio playback failed.", { src: e, error: i }), null;
    }
}
function ye(e) {
  try {
    if (!e) return;
    if (typeof e.stop == "function") {
      e.stop();
      return;
    }
    typeof e.pause == "function" && (e.pause(), e.currentTime = 0);
  } catch (t) {
    k("Audio stop failed.", t);
  }
}
function pe(e) {
  const t = e.accentColor || "#69e8ff", n = ["strike", "breach", "signal"].includes(e.animationStyle) ? e.animationStyle : "strike", r = e.triggerKind === "failure" ? "failure" : "success", i = e.imagePath ? `<img class="hcci-portrait" src="${A(e.imagePath)}" alt="">` : '<div class="hcci-portrait hcci-portrait-fallback"><i class="fa-solid fa-user-astronaut"></i></div>', a = e.imagePath ? [0, 1, 2, 3].map((h) => `<div class="hcci-fracture hcci-fracture-${h + 1}" style="background-image: url('${A(e.imagePath)}')"></div>`).join("") : "", c = Math.max(1, String(e.overlayText ?? "").length), o = e.textEnabled && e.overlayText ? `<div class="hcci-title" style="--hcci-title-chars: ${c}">${A(e.overlayText)}</div>` : "", d = e.actorName || e.userName || "", f = document.createElement("div");
  return f.className = `hcci-overlay hcci-style-${n} hcci-kind-${r}`, f.style.setProperty("--hcci-accent", t), f.innerHTML = `
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
        ${d ? `<div class="hcci-subtitle">${A(d)}</div>` : ""}
      </div>
    </section>
  `, f;
}
async function be(e) {
  if (!me(e)) return;
  const t = Math.min(8e3, Math.max(800, Number(e.duration ?? l(s.duration) ?? 2500))), n = pe(e);
  n.style.setProperty("--hcci-duration", `${t}ms`), document.body.appendChild(n), document.body.classList.add("hcci-screen-shake");
  const r = ve(e.audioPath, e.volume);
  await new Promise((i) => window.setTimeout(i, Math.max(250, t - 250))), ye(await r), n.classList.add("hcci-exiting"), await new Promise((i) => window.setTimeout(i, 250)), n.remove(), document.body.classList.remove("hcci-screen-shake");
}
async function Te() {
  if (!E) {
    for (E = !0; C.length; ) {
      const e = C.shift();
      await be(e);
    }
    E = !1;
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
    C.push(e), C.length > 3 && C.splice(1, C.length - 3), Te();
  }
}
const S = /* @__PURE__ */ new Set();
function we(e, t) {
  var c, o, d, f, h, g;
  if ([...(t == null ? void 0 : t.terms) ?? [], ...(t == null ? void 0 : t.dice) ?? []].some((m) => m && m.faces === 20)) return !1;
  const r = (e == null ? void 0 : e.flags) ?? {}, i = ((o = (c = r.dnd5e) == null ? void 0 : c.roll) == null ? void 0 : o.type) ?? ((f = (d = r.dnd5e) == null ? void 0 : d.roll) == null ? void 0 : f.rollType), a = (g = (h = r.pf2e) == null ? void 0 : h.context) == null ? void 0 : g.type;
  return [i, a].some((m) => String(m ?? "").toLowerCase().includes("damage"));
}
function Ce(e) {
  const t = [], n = [...(e == null ? void 0 : e.terms) ?? [], ...(e == null ? void 0 : e.dice) ?? []], r = /* @__PURE__ */ new Set();
  for (const i of n)
    if (!r.has(i) && (r.add(i), !(!i || i.faces !== 20 || !Array.isArray(i.results))))
      for (const a of i.results) {
        if (a.active === !1 || a.discarded === !0) continue;
        const c = Number(a.result);
        Number.isInteger(c) && t.push(c);
      }
  return t;
}
function ne(e, t) {
  return `${e}:${t}`;
}
function Pe() {
  return ne("gm", "default");
}
function Se(e) {
  return ["strike", "breach", "signal"].includes(e) ? e : "strike";
}
function ae(e, t) {
  var r, i, a, c;
  if (!e || !t) return !1;
  const n = ((i = (r = globalThis.CONST) == null ? void 0 : r.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : i.OWNER) ?? 3;
  return Number(((a = e.ownership) == null ? void 0 : a[t]) ?? ((c = e.ownership) == null ? void 0 : c.default) ?? 0) >= n;
}
function xe(e) {
  var n;
  const t = (e == null ? void 0 : e.speaker) ?? {};
  return t.actor ? ((n = game.actors) == null ? void 0 : n.get(t.actor)) ?? null : e != null && e.actor ? e.actor : null;
}
function Ae(e, t) {
  var i, a, c, o;
  const n = ((i = e == null ? void 0 : e.user) == null ? void 0 : i.id) ?? (e == null ? void 0 : e.user) ?? (e == null ? void 0 : e.userId), r = (a = game.users) == null ? void 0 : a.get(n);
  if (r && !r.isGM) return r;
  if (t) {
    const d = (c = game.users) == null ? void 0 : c.find((f) => !f.isGM && ae(t, f.id));
    if (d) return d;
  }
  return r ?? ((o = game.users) == null ? void 0 : o.get(n)) ?? null;
}
function W(e = {}, t, n) {
  const r = t === "failure" ? $() : N(), i = l(t === "failure" ? s.defaultFailureText : s.defaultText), a = t === "failure" ? "#ff4d7d" : "#69e8ff", c = t === "failure" ? e.failure ?? {} : e, o = Number(c.threshold);
  return {
    kind: t,
    enabled: c.enabled !== !1,
    threshold: Number.isInteger(o) && o >= 1 && o <= 20 ? o : r,
    animationStyle: Se(c.animationStyle),
    imagePath: c.imagePath || (n == null ? void 0 : n.img) || "",
    audioPath: c.audioPath || "",
    overlayText: c.overlayText || i,
    accentColor: c.accentColor || a
  };
}
function L(e, t, n = "success") {
  const r = ie(), i = t ? r[ne("actor", t.id)] : null, a = e != null && e.isGM ? r[Pe()] : null;
  return !t && !(e != null && e.isGM) && !i ? W({ enabled: !1 }, n, t) : W(i ?? a ?? {}, n, t);
}
function Me(e, t, n, r, i) {
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
    textEnabled: l(s.textEnabled),
    duration: l(s.duration),
    volume: l(s.volume),
    audience: l(s.audience)
  } : (k("Cut-in disabled for target.", { userId: r == null ? void 0 : r.id, actorId: n == null ? void 0 : n.id }), null);
}
function Q(e, t, n = "success") {
  var r;
  if (!(e != null && e.isRoll) && !((r = e == null ? void 0 : e.rolls) != null && r.length)) return null;
  for (const i of e.rolls ?? []) {
    if (we(e, i)) continue;
    const a = Ce(i), c = n === "failure" ? a.find((o) => o <= t) : a.find((o) => o >= t);
    if (c) return c;
  }
  return null;
}
function Ne() {
  var n, r;
  const t = (((n = game.users) == null ? void 0 : n.filter((i) => i.active && i.isGM)) ?? []).sort((i, a) => i.id.localeCompare(a.id))[0];
  return ((r = game.user) == null ? void 0 : r.isGM) && (!t || t.id === game.user.id);
}
function ke() {
  var e;
  Hooks.on("createChatMessage", (t) => {
    var m;
    if (!l(s.enabled) || !Ne() || S.has(t.id)) return;
    S.add(t.id);
    const n = S.values().next().value;
    S.size > 200 && n && S.delete(n);
    const r = xe(t), i = Ae(t, r), a = L(i, r, "success"), c = L(i, r, "failure"), o = Q(t, c.threshold, "failure"), d = o ? null : Q(t, a.threshold, "success"), f = o ?? d;
    if (!f) return;
    const g = Me(t, f, r, i, o ? c : a);
    g && (k("Triggering cut-in.", g), (m = game.socket) == null || m.emit(I, { type: "play", payload: g }), x(g));
  }), (e = game.socket) == null || e.on(I, (t) => {
    (t == null ? void 0 : t.type) === "play" && l(s.enabled) && x(t.payload);
  });
}
function re(e, t = {}) {
  var c, o;
  const n = (c = game.users) == null ? void 0 : c.get(e), r = t.actorId ? (o = game.actors) == null ? void 0 : o.get(t.actorId) : (n == null ? void 0 : n.character) ?? null, i = t.triggerKind === "failure" ? "failure" : "success", a = L(n, r, i);
  return {
    id: foundry.utils.randomID(),
    userId: e,
    actorId: (r == null ? void 0 : r.id) ?? null,
    userName: (n == null ? void 0 : n.name) ?? "",
    actorName: (r == null ? void 0 : r.name) ?? (n == null ? void 0 : n.name) ?? "",
    naturalResult: t.naturalResult ?? 20,
    triggerKind: i,
    threshold: t.threshold ?? a.threshold ?? N(),
    animationStyle: t.animationStyle ?? a.animationStyle ?? "strike",
    imagePath: t.imagePath ?? a.imagePath ?? "",
    audioPath: t.audioPath ?? a.audioPath ?? "",
    overlayText: t.overlayText ?? a.overlayText ?? l(s.defaultText),
    accentColor: t.accentColor ?? a.accentColor ?? "#69e8ff",
    textEnabled: t.textEnabled ?? l(s.textEnabled),
    duration: t.duration ?? l(s.duration),
    volume: t.volume ?? l(s.volume),
    audience: t.audience ?? l(s.audience)
  };
}
function Ee(e, t = {}) {
  var i, a;
  const n = (i = game.actors) == null ? void 0 : i.get(e), r = ((a = game.users) == null ? void 0 : a.find((c) => !c.isGM && ae(n, c.id))) ?? game.user;
  return re(r == null ? void 0 : r.id, { ...t, actorId: e });
}
function J(e) {
  var t;
  (t = game.socket) == null || t.emit(I, { type: "play", payload: e }), x(e);
}
var Y, Z, ee;
const Ie = globalThis.FormApplication ?? ((ee = (Z = (Y = globalThis.foundry) == null ? void 0 : Y.appv1) == null ? void 0 : Z.api) == null ? void 0 : ee.FormApplication);
function ce(e, t) {
  return `${e}:${t}`;
}
function $e() {
  return ce("gm", "default");
}
function Le(e, t) {
  var r, i, a, c;
  const n = ((i = (r = globalThis.CONST) == null ? void 0 : r.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : i.OWNER) ?? 3;
  return Number(((a = t == null ? void 0 : t.ownership) == null ? void 0 : a[e.id]) ?? ((c = t == null ? void 0 : t.ownership) == null ? void 0 : c.default) ?? 0) >= n;
}
function X(e = {}, { defaultAccent: t = "#69e8ff" } = {}) {
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
function Oe(e = {}) {
  return {
    success: X(e, { defaultAccent: "#69e8ff" }),
    failure: X(e.failure, { defaultAccent: "#ff4d7d" })
  };
}
function Ge() {
  var n, r, i;
  const e = ((n = game.users) == null ? void 0 : n.find((a) => a.isGM && a.active)) ?? ((r = game.users) == null ? void 0 : r.find((a) => a.isGM)) ?? game.user, t = [{
    key: $e(),
    type: "gm",
    typeLabel: "GM",
    id: "default",
    name: "GM Cut-In",
    portrait: (e == null ? void 0 : e.avatar) || "icons/svg/mystery-man.svg"
  }];
  for (const a of game.actors ?? []) {
    const c = ((i = game.users) == null ? void 0 : i.filter((o) => !o.isGM && Le(o, a)).map((o) => o.name)) ?? [];
    c.length && t.push({
      key: ce("actor", a.id),
      type: "actor",
      typeLabel: "Actor",
      id: a.id,
      name: `${a.name} (${c.join(", ")})`,
      portrait: a.img || "icons/svg/mystery-man.svg"
    });
  }
  return t.sort((a, c) => a.type === "gm" ? -1 : c.type === "gm" ? 1 : a.name.localeCompare(c.name));
}
class oe extends Ie {
  constructor(n = {}) {
    super(n);
    j(this, "activeTabs");
    this.activeTabs = /* @__PURE__ */ new Map();
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "hcci-player-config",
      title: `${te} Configuration`,
      template: ge,
      classes: ["hcci-config-window"],
      width: 1320,
      height: "auto",
      resizable: !0,
      closeOnSubmit: !1,
      submitOnChange: !1
    });
  }
  async getData() {
    const n = ie(), r = Ge().map((i) => {
      const a = Oe(n[i.key]), c = a.success.imagePath || i.portrait, o = a.failure.imagePath || i.portrait, d = this.activeTabs.get(i.key) === "failure" ? "failure" : "success";
      return {
        ...i,
        successActive: d === "success",
        failureActive: d === "failure",
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
      moduleId: u,
      threshold: N(),
      failureThreshold: $(),
      duration: l(s.duration),
      defaultText: l(s.defaultText),
      defaultFailureText: l(s.defaultFailureText),
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
      const a = i.currentTarget, c = a.closest("[data-hcci-panel]"), o = a.dataset.hcciBrowse, d = c == null ? void 0 : c.querySelector(`[data-hcci-field="${o}"]`);
      if (!d) return;
      new FilePicker({
        type: o === "audioPath" ? "audio" : "image",
        current: d.value,
        callback: (h) => {
          if (d.value = h, d.dispatchEvent(new Event("change", { bubbles: !0 })), o === "imagePath") {
            const g = c.querySelector("[data-hcci-preview]");
            g && (g.src = h || g.dataset.fallbackSrc || "icons/svg/mystery-man.svg");
          }
        }
      }).browse();
    }), n.find("[data-hcci-tab]").on("click", (i) => {
      i.preventDefault();
      const a = i.currentTarget.dataset.hcciTab, c = i.currentTarget.closest("[data-hcci-row]");
      c != null && c.dataset.hcciRow && this.activeTabs.set(c.dataset.hcciRow, a), c == null || c.querySelectorAll("[data-hcci-tab]").forEach((o) => o.classList.toggle("is-active", o.dataset.hcciTab === a)), c == null || c.querySelectorAll("[data-hcci-panel]").forEach((o) => o.classList.toggle("is-active", o.dataset.hcciPanel === a));
    }), n.find("[data-hcci-action='reset']").on("click", async (i) => {
      var a;
      i.preventDefault(), await B({}), (a = ui.notifications) == null || a.info("Critical Cut-In player configuration reset."), this.render(!1);
    });
  }
  async _updateObject(n) {
    var f, h, g, m, O, G;
    const r = n.currentTarget, i = {}, a = (p, b) => {
      var D, R, F, H, q, K, U, _, z;
      const v = p.querySelector(`[data-hcci-panel="${b}"]`), T = (w) => v == null ? void 0 : v.querySelector(`[data-hcci-field="${w}"]`);
      return {
        enabled: ((D = v == null ? void 0 : v.querySelector('[data-hcci-field="enabled"]')) == null ? void 0 : D.checked) === !0,
        threshold: (() => {
          var V;
          const w = Number((V = T("threshold")) == null ? void 0 : V.value);
          return Number.isInteger(w) && w >= 1 && w <= 20 ? w : "";
        })(),
        animationStyle: ((R = T("animationStyle")) == null ? void 0 : R.value) || "strike",
        imagePath: ((H = (F = T("imagePath")) == null ? void 0 : F.value) == null ? void 0 : H.trim()) ?? "",
        audioPath: ((K = (q = T("audioPath")) == null ? void 0 : q.value) == null ? void 0 : K.trim()) ?? "",
        overlayText: ((_ = (U = T("overlayText")) == null ? void 0 : U.value) == null ? void 0 : _.trim()) ?? "",
        accentColor: ((z = T("accentColor")) == null ? void 0 : z.value) || (b === "failure" ? "#ff4d7d" : "#69e8ff")
      };
    };
    for (const p of r.querySelectorAll("[data-hcci-row]")) {
      const b = p.dataset.hcciRow, v = (f = p.querySelector("[data-hcci-panel].is-active")) == null ? void 0 : f.dataset.hcciPanel;
      v && this.activeTabs.set(b, v), i[b] = a(p, "success"), i[b].failure = a(p, "failure");
    }
    const c = Number(((h = r.querySelector('[name="threshold"]')) == null ? void 0 : h.value) ?? N()), o = Number(((g = r.querySelector('[name="failureThreshold"]')) == null ? void 0 : g.value) ?? $()), d = Number(((m = r.querySelector('[name="duration"]')) == null ? void 0 : m.value) ?? l(s.duration));
    await M(s.threshold, Math.min(20, Math.max(1, c))), await M(s.failureThreshold, Math.min(20, Math.max(1, o))), await M(s.duration, Math.min(8e3, Math.max(800, d))), await B(i), (O = ui.notifications) == null || O.info("Critical Cut-In configuration saved."), (G = this.element) == null || G.removeClass("hcci-config-dirty"), this.render(!1);
  }
}
function se() {
  var e, t;
  return (e = game.user) != null && e.isGM ? new oe().render(!0) : ((t = ui.notifications) == null || t.warn("Only the GM can configure Critical Cut-In."), null);
}
function De() {
  var n, r, i, a;
  const e = (n = game.modules.get("holosuite")) != null && n.active ? (r = game.modules.get("holosuite")) == null ? void 0 : r.api : null, t = (i = game.modules.get("holosuite-core")) != null && i.active ? (a = game.modules.get("holosuite-core")) == null ? void 0 : a.api : null;
  return e ?? t ?? game.holosuite ?? null;
}
function le() {
  const e = De();
  return e != null && e.registerApp ? (e.registerApp({
    id: u,
    title: "Critical Cut-In",
    icon: "fa-solid fa-bolt-lightning",
    premium: !1,
    playerVisible: !1,
    description: "JRPG-style critical hit cut-in animation for natural d20 results.",
    enabled: l(s.enabled),
    open: () => se()
  }), console.log(`${u} | Registered with HoloSuite.`), !0) : !1;
}
function ue() {
  const e = {
    playCutinForUser(n, r = {}) {
      var a;
      const i = re(n, r);
      return (a = game.user) != null && a.isGM ? J(i) : x(i), i;
    },
    playCutinForActor(n, r = {}) {
      var a;
      const i = Ee(n, r);
      return (a = game.user) != null && a.isGM ? J(i) : x(i), i;
    },
    openConfig: se
  }, t = game.modules.get(u);
  return t && (t.api = e), game.holosuiteCriticalCutin = e, e;
}
Hooks.once("init", async () => {
  he(oe), ue(), await loadTemplates([`modules/${u}/templates/player-config.hbs`]);
});
Hooks.once("ready", () => {
  ue(), ke(), le(), console.log(`${u} | Ready. API available at game.modules.get("${u}").api`);
});
Hooks.on("hotReload", () => {
  le();
});
console.log(`${te} | Loading.`);
