const d = "holosuite-critical-cutin", X = "HoloSuite Critical Cut-In", I = `module.${d}`, oe = `modules/${d}/templates/player-config.hbs`, s = {
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
function se(e) {
  game.settings.register(d, s.enabled, {
    name: "Enable Critical Cut-In",
    hint: "Play a configured cut-in when a qualifying natural d20 result is rolled.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(d, s.threshold, {
    name: "Default Trigger Threshold",
    hint: "Natural d20 results equal to or above this number trigger the cut-in. Example: 19 triggers on 19 and 20.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 1, max: 20, step: 1 },
    default: 20
  }), game.settings.register(d, s.failureThreshold, {
    name: "Default Failure Trigger",
    hint: "Natural d20 results equal to or below this number trigger the failure cut-in. Example: 1 triggers only on a natural 1.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 1, max: 20, step: 1 },
    default: 1
  }), game.settings.register(d, s.duration, {
    name: "Animation Duration",
    hint: "How long the cut-in remains visible, in milliseconds.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 800, max: 8e3, step: 100 },
    default: 2500
  }), game.settings.register(d, s.volume, {
    name: "Cut-In Audio Volume",
    hint: "Volume multiplier for configured cut-in audio samples.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 0.8
  }), game.settings.register(d, s.audience, {
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
  }), game.settings.register(d, s.textEnabled, {
    name: "Enable Text Overlay",
    hint: "Show the configured label during the cut-in.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(d, s.defaultText, {
    name: "Default Overlay Text",
    hint: "Fallback label used when no player-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL"
  }), game.settings.register(d, s.defaultFailureText, {
    name: "Default Failure Overlay Text",
    hint: "Fallback label used when no failure-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL FAILURE"
  }), game.settings.register(d, s.debug, {
    name: "Debug Logging",
    hint: "Log roll detection and playback decisions to the console.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(d, s.playerConfigs, {
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
function l(e) {
  return game.settings.get(d, e);
}
async function M(e, t) {
  return game.settings.set(d, e, t);
}
function S() {
  return Math.min(20, Math.max(1, Number(l(s.threshold) || 20)));
}
function N() {
  return Math.min(20, Math.max(1, Number(l(s.failureThreshold) || 1)));
}
function Y() {
  const e = l(s.playerConfigs);
  return foundry.utils.deepClone(e && typeof e == "object" ? e : {});
}
async function z(e) {
  return M(s.playerConfigs, e && typeof e == "object" ? e : {});
}
function k(...e) {
  l(s.debug) && console.log(`${d} |`, ...e);
}
const T = [], w = /* @__PURE__ */ new Set();
let E = !1;
function A(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function le(e) {
  var r, i, a, n, c;
  if (e != null && e.blind && !((r = game.user) != null && r.isGM) || Array.isArray(e == null ? void 0 : e.whisper) && e.whisper.length && !e.whisper.includes((i = game.user) == null ? void 0 : i.id) && !((a = game.user) != null && a.isGM))
    return !1;
  const t = (e == null ? void 0 : e.audience) ?? l(s.audience);
  return t === v.everyone ? !0 : t === v.gm ? ((n = game.user) == null ? void 0 : n.isGM) === !0 : t === v.triggeringPlayer ? ((c = game.user) == null ? void 0 : c.id) === (e == null ? void 0 : e.userId) : !0;
}
async function ue(e, t) {
  var r, i, a;
  if (e)
    try {
      const n = Math.min(1, Math.max(0, Number(t ?? l(s.volume) ?? 0.8)));
      if ((i = (r = foundry.audio) == null ? void 0 : r.AudioHelper) != null && i.play)
        return foundry.audio.AudioHelper.play({ src: e, volume: n, autoplay: !0, loop: !1 }, !1);
      if ((a = globalThis.AudioHelper) != null && a.play)
        return globalThis.AudioHelper.play({ src: e, volume: n, autoplay: !0, loop: !1 }, !1);
      const c = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), o = new Audio(e);
      return o.volume = n * c, await o.play(), o;
    } catch (n) {
      return k("Audio playback failed.", { src: e, error: n }), null;
    }
}
function de(e) {
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
function fe(e) {
  const t = e.accentColor || "#69e8ff", r = ["strike", "breach", "signal"].includes(e.animationStyle) ? e.animationStyle : "strike", i = e.triggerKind === "failure" ? "failure" : "success", a = e.imagePath ? `<img class="hcci-portrait" src="${A(e.imagePath)}" alt="">` : '<div class="hcci-portrait hcci-portrait-fallback"><i class="fa-solid fa-user-astronaut"></i></div>', n = e.imagePath ? [0, 1, 2, 3].map((g) => `<div class="hcci-fracture hcci-fracture-${g + 1}" style="background-image: url('${A(e.imagePath)}')"></div>`).join("") : "", c = Math.max(1, String(e.overlayText ?? "").length), o = e.textEnabled && e.overlayText ? `<div class="hcci-title" style="--hcci-title-chars: ${c}">${A(e.overlayText)}</div>` : "", h = e.actorName || e.userName || "", f = document.createElement("div");
  return f.className = `hcci-overlay hcci-style-${r} hcci-kind-${i}`, f.style.setProperty("--hcci-accent", t), f.innerHTML = `
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
        ${a}
        ${n}
        <div class="hcci-frame-lightning hcci-frame-lightning-a"></div>
        <div class="hcci-frame-lightning hcci-frame-lightning-b"></div>
      </div>
      <div class="hcci-copy">
        ${o}
        ${h ? `<div class="hcci-subtitle">${A(h)}</div>` : ""}
      </div>
    </section>
  `, f;
}
async function ge(e) {
  if (!le(e)) return;
  const t = Math.min(8e3, Math.max(800, Number(e.duration ?? l(s.duration) ?? 2500))), r = fe(e);
  r.style.setProperty("--hcci-duration", `${t}ms`), document.body.appendChild(r), document.body.classList.add("hcci-screen-shake");
  const i = ue(e.audioPath, e.volume);
  await new Promise((a) => window.setTimeout(a, Math.max(250, t - 250))), de(await i), r.classList.add("hcci-exiting"), await new Promise((a) => window.setTimeout(a, 250)), r.remove(), document.body.classList.remove("hcci-screen-shake");
}
async function he() {
  if (!E) {
    for (E = !0; T.length; ) {
      const e = T.shift();
      await ge(e);
    }
    E = !1;
  }
}
function P(e) {
  if (e) {
    if (e.id) {
      if (w.has(e.id)) return;
      w.add(e.id), w.size > 100 && w.delete(w.values().next().value);
    }
    T.push(e), T.length > 3 && T.splice(1, T.length - 3), he();
  }
}
const C = /* @__PURE__ */ new Set();
function me(e, t) {
  var c, o, h, f, g, m;
  if ([...(t == null ? void 0 : t.terms) ?? [], ...(t == null ? void 0 : t.dice) ?? []].some((y) => y && y.faces === 20)) return !1;
  const i = (e == null ? void 0 : e.flags) ?? {}, a = ((o = (c = i.dnd5e) == null ? void 0 : c.roll) == null ? void 0 : o.type) ?? ((f = (h = i.dnd5e) == null ? void 0 : h.roll) == null ? void 0 : f.rollType), n = (m = (g = i.pf2e) == null ? void 0 : g.context) == null ? void 0 : m.type;
  return [a, n].some((y) => String(y ?? "").toLowerCase().includes("damage"));
}
function ye(e) {
  const t = [], r = [...(e == null ? void 0 : e.terms) ?? [], ...(e == null ? void 0 : e.dice) ?? []], i = /* @__PURE__ */ new Set();
  for (const a of r)
    if (!i.has(a) && (i.add(a), !(!a || a.faces !== 20 || !Array.isArray(a.results))))
      for (const n of a.results) {
        if (n.active === !1 || n.discarded === !0) continue;
        const c = Number(n.result);
        Number.isInteger(c) && t.push(c);
      }
  return t;
}
function Z(e, t) {
  return `${e}:${t}`;
}
function ve() {
  return Z("gm", "default");
}
function pe(e) {
  return ["strike", "breach", "signal"].includes(e) ? e : "strike";
}
function ee(e, t) {
  var i, a, n, c;
  if (!e || !t) return !1;
  const r = ((a = (i = globalThis.CONST) == null ? void 0 : i.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3;
  return Number(((n = e.ownership) == null ? void 0 : n[t]) ?? ((c = e.ownership) == null ? void 0 : c.default) ?? 0) >= r;
}
function be(e) {
  var r;
  const t = (e == null ? void 0 : e.speaker) ?? {};
  return t.actor ? ((r = game.actors) == null ? void 0 : r.get(t.actor)) ?? null : e != null && e.actor ? e.actor : null;
}
function Te(e, t) {
  var a, n, c, o;
  const r = ((a = e == null ? void 0 : e.user) == null ? void 0 : a.id) ?? (e == null ? void 0 : e.user) ?? (e == null ? void 0 : e.userId), i = (n = game.users) == null ? void 0 : n.get(r);
  if (i && !i.isGM) return i;
  if (t) {
    const h = (c = game.users) == null ? void 0 : c.find((f) => !f.isGM && ee(t, f.id));
    if (h) return h;
  }
  return i ?? ((o = game.users) == null ? void 0 : o.get(r)) ?? null;
}
function we(e = {}, t, r) {
  const i = t === "failure" ? N() : S(), a = l(t === "failure" ? s.defaultFailureText : s.defaultText), n = t === "failure" ? "#ff4d7d" : "#69e8ff", c = t === "failure" ? e.failure ?? {} : e, o = Number(c.threshold);
  return {
    kind: t,
    enabled: c.enabled !== !1,
    threshold: Number.isInteger(o) && o >= 1 && o <= 20 ? o : i,
    animationStyle: pe(c.animationStyle),
    imagePath: c.imagePath || (r == null ? void 0 : r.img) || "",
    audioPath: c.audioPath || "",
    overlayText: c.overlayText || a,
    accentColor: c.accentColor || n
  };
}
function $(e, t, r = "success") {
  const i = Y(), a = t ? i[Z("actor", t.id)] : null, n = e != null && e.isGM ? i[ve()] : null;
  return !t && !(e != null && e.isGM) && !a ? { enabled: !1, threshold: r === "failure" ? N() : S() } : we(a ?? n ?? {}, r, t);
}
function Ce(e, t, r, i, a) {
  return a.enabled ? {
    id: foundry.utils.randomID(),
    messageId: e.id,
    userId: (i == null ? void 0 : i.id) ?? null,
    actorId: (r == null ? void 0 : r.id) ?? null,
    userName: (i == null ? void 0 : i.name) ?? "",
    actorName: (r == null ? void 0 : r.name) ?? (i == null ? void 0 : i.name) ?? "",
    triggerKind: a.kind ?? "success",
    naturalResult: t,
    threshold: a.threshold,
    animationStyle: a.animationStyle,
    blind: e.blind === !0,
    whisper: Array.isArray(e.whisper) ? [...e.whisper] : [],
    imagePath: a.imagePath || "",
    audioPath: a.audioPath || "",
    overlayText: a.overlayText || "",
    accentColor: a.accentColor || "#69e8ff",
    textEnabled: l(s.textEnabled),
    duration: l(s.duration),
    volume: l(s.volume),
    audience: l(s.audience)
  } : (k("Cut-in disabled for target.", { userId: i == null ? void 0 : i.id, actorId: r == null ? void 0 : r.id }), null);
}
function V(e, t, r = "success") {
  var i;
  if (!(e != null && e.isRoll) && !((i = e == null ? void 0 : e.rolls) != null && i.length)) return null;
  for (const a of e.rolls ?? []) {
    if (me(e, a)) continue;
    const n = ye(a), c = r === "failure" ? n.find((o) => o <= t) : n.find((o) => o >= t);
    if (c) return c;
  }
  return null;
}
function Se() {
  var r, i;
  const t = (((r = game.users) == null ? void 0 : r.filter((a) => a.active && a.isGM)) ?? []).sort((a, n) => a.id.localeCompare(n.id))[0];
  return ((i = game.user) == null ? void 0 : i.isGM) && (!t || t.id === game.user.id);
}
function Pe() {
  var e;
  Hooks.on("createChatMessage", (t) => {
    var m;
    if (!l(s.enabled) || !Se() || C.has(t.id)) return;
    C.add(t.id), C.size > 200 && C.delete(C.values().next().value);
    const r = be(t), i = Te(t, r), a = $(i, r, "success"), n = $(i, r, "failure"), c = V(t, n.threshold, "failure"), o = c ? null : V(t, a.threshold, "success"), h = c ?? o;
    if (!h) return;
    const g = Ce(t, h, r, i, c ? n : a);
    g && (k("Triggering cut-in.", g), (m = game.socket) == null || m.emit(I, { type: "play", payload: g }), P(g));
  }), (e = game.socket) == null || e.on(I, (t) => {
    (t == null ? void 0 : t.type) === "play" && l(s.enabled) && P(t.payload);
  });
}
function te(e, t = {}) {
  var c, o;
  const r = (c = game.users) == null ? void 0 : c.get(e), i = t.actorId ? (o = game.actors) == null ? void 0 : o.get(t.actorId) : (r == null ? void 0 : r.character) ?? null, a = t.triggerKind === "failure" ? "failure" : "success", n = $(r, i, a);
  return {
    id: foundry.utils.randomID(),
    userId: e,
    actorId: (i == null ? void 0 : i.id) ?? null,
    userName: (r == null ? void 0 : r.name) ?? "",
    actorName: (i == null ? void 0 : i.name) ?? (r == null ? void 0 : r.name) ?? "",
    naturalResult: t.naturalResult ?? 20,
    triggerKind: a,
    threshold: t.threshold ?? n.threshold ?? S(),
    animationStyle: t.animationStyle ?? n.animationStyle ?? "strike",
    imagePath: t.imagePath ?? n.imagePath ?? "",
    audioPath: t.audioPath ?? n.audioPath ?? "",
    overlayText: t.overlayText ?? n.overlayText ?? l(s.defaultText),
    accentColor: t.accentColor ?? n.accentColor ?? "#69e8ff",
    textEnabled: t.textEnabled ?? l(s.textEnabled),
    duration: t.duration ?? l(s.duration),
    volume: t.volume ?? l(s.volume),
    audience: t.audience ?? l(s.audience)
  };
}
function xe(e, t = {}) {
  var a, n;
  const r = (a = game.actors) == null ? void 0 : a.get(e), i = ((n = game.users) == null ? void 0 : n.find((c) => !c.isGM && ee(r, c.id))) ?? game.user;
  return te(i == null ? void 0 : i.id, { ...t, actorId: e });
}
function j(e) {
  var t;
  (t = game.socket) == null || t.emit(I, { type: "play", payload: e }), P(e);
}
var W, Q, J;
const Ae = globalThis.FormApplication ?? ((J = (Q = (W = globalThis.foundry) == null ? void 0 : W.appv1) == null ? void 0 : Q.api) == null ? void 0 : J.FormApplication);
function ie(e, t) {
  return `${e}:${t}`;
}
function Me() {
  return ie("gm", "default");
}
function Ne(e, t) {
  var i, a, n, c;
  const r = ((a = (i = globalThis.CONST) == null ? void 0 : i.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3;
  return Number(((n = t == null ? void 0 : t.ownership) == null ? void 0 : n[e.id]) ?? ((c = t == null ? void 0 : t.ownership) == null ? void 0 : c.default) ?? 0) >= r;
}
function B(e = {}, { defaultAccent: t = "#69e8ff" } = {}) {
  const r = Number(e.threshold), i = ["strike", "breach", "signal"].includes(e.animationStyle) ? e.animationStyle : "strike";
  return {
    enabled: e.enabled !== !1,
    threshold: Number.isInteger(r) && r >= 1 && r <= 20 ? r : "",
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
function ke(e = {}) {
  return {
    success: B(e, { defaultAccent: "#69e8ff" }),
    failure: B(e.failure, { defaultAccent: "#ff4d7d" })
  };
}
function Ee() {
  var r, i, a;
  const e = ((r = game.users) == null ? void 0 : r.find((n) => n.isGM && n.active)) ?? ((i = game.users) == null ? void 0 : i.find((n) => n.isGM)) ?? game.user, t = [{
    key: Me(),
    type: "gm",
    typeLabel: "GM",
    id: "default",
    name: "GM Cut-In",
    portrait: (e == null ? void 0 : e.avatar) || "icons/svg/mystery-man.svg"
  }];
  for (const n of game.actors ?? []) {
    const c = ((a = game.users) == null ? void 0 : a.filter((o) => !o.isGM && Ne(o, n)).map((o) => o.name)) ?? [];
    c.length && t.push({
      key: ie("actor", n.id),
      type: "actor",
      typeLabel: "Actor",
      id: n.id,
      name: `${n.name} (${c.join(", ")})`,
      portrait: n.img || "icons/svg/mystery-man.svg"
    });
  }
  return t.sort((n, c) => n.type === "gm" ? -1 : c.type === "gm" ? 1 : n.name.localeCompare(c.name));
}
class ae extends Ae {
  constructor(t = {}) {
    super(t), this.activeTabs = /* @__PURE__ */ new Map();
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "hcci-player-config",
      title: `${X} Configuration`,
      template: oe,
      classes: ["hcci-config-window"],
      width: 1320,
      height: "auto",
      resizable: !0,
      closeOnSubmit: !1,
      submitOnChange: !1
    });
  }
  async getData() {
    const t = Y(), r = Ee().map((i) => {
      const a = ke(t[i.key]), n = a.success.imagePath || i.portrait, c = a.failure.imagePath || i.portrait, o = this.activeTabs.get(i.key) === "failure" ? "failure" : "success";
      return {
        ...i,
        successActive: o === "success",
        failureActive: o === "failure",
        success: {
          ...a.success,
          preview: n,
          imageStatus: a.success.imagePath ? "Custom image configured." : "No custom image configured.",
          audioStatus: a.success.audioPath ? "Audio sample configured." : "No audio sample configured."
        },
        failure: {
          ...a.failure,
          preview: c,
          imageStatus: a.failure.imagePath ? "Custom image configured." : "No custom image configured.",
          audioStatus: a.failure.audioPath ? "Audio sample configured." : "No audio sample configured."
        }
      };
    });
    return {
      moduleId: d,
      threshold: S(),
      failureThreshold: N(),
      duration: l(s.duration),
      defaultText: l(s.defaultText),
      defaultFailureText: l(s.defaultFailureText),
      rows: r
    };
  }
  activateListeners(t) {
    super.activateListeners(t);
    const r = () => {
      var i;
      (i = t.closest(".app")) == null || i.addClass("hcci-config-dirty"), t.find("[data-hcci-dirty]").prop("hidden", !1);
    };
    t.find("input, select").on("input change", (i) => {
      if (r(), i.currentTarget.dataset.hcciField !== "imagePath") return;
      const a = i.currentTarget.closest("[data-hcci-panel]"), n = a == null ? void 0 : a.querySelector("[data-hcci-preview]");
      n && (n.src = i.currentTarget.value || n.dataset.fallbackSrc || "icons/svg/mystery-man.svg");
    }), t.find("[data-hcci-browse]").on("click", (i) => {
      i.preventDefault();
      const a = i.currentTarget, n = a.closest("[data-hcci-panel]"), c = a.dataset.hcciBrowse, o = n == null ? void 0 : n.querySelector(`[data-hcci-field="${c}"]`);
      if (!o) return;
      new FilePicker({
        type: c === "audioPath" ? "audio" : "image",
        current: o.value,
        callback: (f) => {
          if (o.value = f, o.dispatchEvent(new Event("change", { bubbles: !0 })), c === "imagePath") {
            const g = n.querySelector("[data-hcci-preview]");
            g && (g.src = f || g.dataset.fallbackSrc || "icons/svg/mystery-man.svg");
          }
        }
      }).browse();
    }), t.find("[data-hcci-tab]").on("click", (i) => {
      i.preventDefault();
      const a = i.currentTarget.dataset.hcciTab, n = i.currentTarget.closest("[data-hcci-row]");
      n != null && n.dataset.hcciRow && this.activeTabs.set(n.dataset.hcciRow, a), n == null || n.querySelectorAll("[data-hcci-tab]").forEach((c) => c.classList.toggle("is-active", c.dataset.hcciTab === a)), n == null || n.querySelectorAll("[data-hcci-panel]").forEach((c) => c.classList.toggle("is-active", c.dataset.hcciPanel === a));
    }), t.find("[data-hcci-action='reset']").on("click", async (i) => {
      var a;
      i.preventDefault(), await z({}), (a = ui.notifications) == null || a.info("Critical Cut-In player configuration reset."), this.render(!1);
    });
  }
  async _updateObject(t) {
    var h, f, g, m, y, L;
    const r = t.currentTarget, i = {}, a = (p, b) => {
      var O, G, D, q, R, F, H, K, U;
      const u = p.querySelector(`[data-hcci-panel="${b}"]`);
      return {
        enabled: ((O = u == null ? void 0 : u.querySelector('[data-hcci-field="enabled"]')) == null ? void 0 : O.checked) === !0,
        threshold: (() => {
          var _;
          const x = Number((_ = u == null ? void 0 : u.querySelector('[data-hcci-field="threshold"]')) == null ? void 0 : _.value);
          return Number.isInteger(x) && x >= 1 && x <= 20 ? x : "";
        })(),
        animationStyle: ((G = u == null ? void 0 : u.querySelector('[data-hcci-field="animationStyle"]')) == null ? void 0 : G.value) || "strike",
        imagePath: ((q = (D = u == null ? void 0 : u.querySelector('[data-hcci-field="imagePath"]')) == null ? void 0 : D.value) == null ? void 0 : q.trim()) ?? "",
        audioPath: ((F = (R = u == null ? void 0 : u.querySelector('[data-hcci-field="audioPath"]')) == null ? void 0 : R.value) == null ? void 0 : F.trim()) ?? "",
        overlayText: ((K = (H = u == null ? void 0 : u.querySelector('[data-hcci-field="overlayText"]')) == null ? void 0 : H.value) == null ? void 0 : K.trim()) ?? "",
        accentColor: ((U = u == null ? void 0 : u.querySelector('[data-hcci-field="accentColor"]')) == null ? void 0 : U.value) || (b === "failure" ? "#ff4d7d" : "#69e8ff")
      };
    };
    for (const p of r.querySelectorAll("[data-hcci-row]")) {
      const b = p.dataset.hcciRow, u = (h = p.querySelector("[data-hcci-panel].is-active")) == null ? void 0 : h.dataset.hcciPanel;
      u && this.activeTabs.set(b, u), i[b] = a(p, "success"), i[b].failure = a(p, "failure");
    }
    const n = Number(((f = r.querySelector('[name="threshold"]')) == null ? void 0 : f.value) ?? S()), c = Number(((g = r.querySelector('[name="failureThreshold"]')) == null ? void 0 : g.value) ?? N()), o = Number(((m = r.querySelector('[name="duration"]')) == null ? void 0 : m.value) ?? l(s.duration));
    await M(s.threshold, Math.min(20, Math.max(1, n))), await M(s.failureThreshold, Math.min(20, Math.max(1, c))), await M(s.duration, Math.min(8e3, Math.max(800, o))), await z(i), (y = ui.notifications) == null || y.info("Critical Cut-In configuration saved."), (L = this.element) == null || L.removeClass("hcci-config-dirty"), this.render(!1);
  }
}
function ne() {
  var e, t;
  return (e = game.user) != null && e.isGM ? new ae().render(!0) : ((t = ui.notifications) == null || t.warn("Only the GM can configure Critical Cut-In."), null);
}
function Ie() {
  var r, i, a, n;
  const e = (r = game.modules.get("holosuite")) != null && r.active ? (i = game.modules.get("holosuite")) == null ? void 0 : i.api : null, t = (a = game.modules.get("holosuite-core")) != null && a.active ? (n = game.modules.get("holosuite-core")) == null ? void 0 : n.api : null;
  return e ?? t ?? game.holosuite ?? null;
}
function re() {
  const e = Ie();
  return e != null && e.registerApp ? (e.registerApp({
    id: d,
    title: "Critical Cut-In",
    icon: "fa-solid fa-bolt-lightning",
    premium: !1,
    description: "Audio & Animations for specific d20 rolls",
    playerVisible: !1,
    enabled: l(s.enabled),
    open: () => ne()
  }), console.log(`${d} | Registered with HoloSuite.`), !0) : !1;
}
function ce() {
  const e = {
    playCutinForUser(r, i = {}) {
      var n;
      const a = te(r, i);
      return (n = game.user) != null && n.isGM ? j(a) : P(a), a;
    },
    playCutinForActor(r, i = {}) {
      var n;
      const a = xe(r, i);
      return (n = game.user) != null && n.isGM ? j(a) : P(a), a;
    },
    openConfig: ne
  }, t = game.modules.get(d);
  return t && (t.api = e), game.holosuiteCriticalCutin = e, e;
}
Hooks.once("init", async () => {
  se(ae), ce(), await loadTemplates([`modules/${d}/templates/player-config.hbs`]);
});
Hooks.once("ready", () => {
  ce(), Pe(), re(), console.log(`${d} | Ready. API available at game.modules.get("${d}").api`);
});
Hooks.on("hotReload", () => {
  re();
});
console.log(`${X} | Loading.`);
