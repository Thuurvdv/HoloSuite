const s = "holosuite-critical-cutin", F = "HoloSuite Critical Cut-In", k = `module.${s}`, Y = `modules/${s}/templates/player-config.hbs`, c = {
  enabled: "enabled",
  threshold: "threshold",
  duration: "duration",
  volume: "volume",
  audience: "audience",
  textEnabled: "textEnabled",
  defaultText: "defaultText",
  debug: "debug",
  playerConfigs: "playerConfigs"
}, g = {
  everyone: "everyone",
  gm: "gm",
  triggeringPlayer: "triggeringPlayer"
};
function Z(e) {
  game.settings.register(s, c.enabled, {
    name: "Enable Critical Cut-In",
    hint: "Play a configured cut-in when a qualifying natural d20 result is rolled.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(s, c.threshold, {
    name: "Default Trigger Threshold",
    hint: "Natural d20 results equal to or above this number trigger the cut-in. Example: 19 triggers on 19 and 20.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 1, max: 20, step: 1 },
    default: 20
  }), game.settings.register(s, c.duration, {
    name: "Animation Duration",
    hint: "How long the cut-in remains visible, in milliseconds.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 800, max: 8e3, step: 100 },
    default: 2500
  }), game.settings.register(s, c.volume, {
    name: "Cut-In Audio Volume",
    hint: "Volume multiplier for configured cut-in audio samples.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 0.8
  }), game.settings.register(s, c.audience, {
    name: "Show Animation To",
    hint: "Choose who sees synchronized cut-in playback.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      [g.everyone]: "Everyone",
      [g.gm]: "GM only",
      [g.triggeringPlayer]: "Triggering player only"
    },
    default: g.everyone
  }), game.settings.register(s, c.textEnabled, {
    name: "Enable Text Overlay",
    hint: "Show the configured label during the cut-in.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(s, c.defaultText, {
    name: "Default Overlay Text",
    hint: "Fallback label used when no player-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL"
  }), game.settings.register(s, c.debug, {
    name: "Debug Logging",
    hint: "Log roll detection and playback decisions to the console.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(s, c.playerConfigs, {
    name: "Per-Player Cut-In Configuration",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.registerMenu(s, "playerConfigMenu", {
    name: "Configure Player Cut-Ins",
    label: "Open Configuration",
    hint: "Set each user or actor portrait, audio sample, label, accent color, and enable state.",
    icon: "fa-solid fa-bolt",
    type: e,
    restricted: !0
  });
}
function u(e) {
  return game.settings.get(s, e);
}
async function N(e, t) {
  return game.settings.set(s, e, t);
}
function C() {
  return Math.min(20, Math.max(1, Number(u(c.threshold) || 20)));
}
function _() {
  const e = u(c.playerConfigs);
  return foundry.utils.deepClone(e && typeof e == "object" ? e : {});
}
async function O(e) {
  return N(c.playerConfigs, e && typeof e == "object" ? e : {});
}
function x(...e) {
  u(c.debug) && console.log(`${s} |`, ...e);
}
const m = [], b = /* @__PURE__ */ new Set();
let M = !1;
function A(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function ee(e) {
  var i, n, a, r, o;
  if (e != null && e.blind && !((i = game.user) != null && i.isGM) || Array.isArray(e == null ? void 0 : e.whisper) && e.whisper.length && !e.whisper.includes((n = game.user) == null ? void 0 : n.id) && !((a = game.user) != null && a.isGM))
    return !1;
  const t = (e == null ? void 0 : e.audience) ?? u(c.audience);
  return t === g.everyone ? !0 : t === g.gm ? ((r = game.user) == null ? void 0 : r.isGM) === !0 : t === g.triggeringPlayer ? ((o = game.user) == null ? void 0 : o.id) === (e == null ? void 0 : e.userId) : !0;
}
async function te(e, t) {
  var i, n, a;
  if (e)
    try {
      const r = Math.min(1, Math.max(0, Number(t ?? u(c.volume) ?? 0.8)));
      if ((n = (i = foundry.audio) == null ? void 0 : i.AudioHelper) != null && n.play)
        return foundry.audio.AudioHelper.play({ src: e, volume: r, autoplay: !0, loop: !1 }, !1);
      if ((a = globalThis.AudioHelper) != null && a.play)
        return globalThis.AudioHelper.play({ src: e, volume: r, autoplay: !0, loop: !1 }, !1);
      const o = new Audio(e);
      return o.volume = r, await o.play(), o;
    } catch (r) {
      return x("Audio playback failed.", { src: e, error: r }), null;
    }
}
function ie(e) {
  try {
    if (!e) return;
    if (typeof e.stop == "function") {
      e.stop();
      return;
    }
    typeof e.pause == "function" && (e.pause(), e.currentTime = 0);
  } catch (t) {
    x("Audio stop failed.", t);
  }
}
function ne(e) {
  const t = e.accentColor || "#69e8ff", i = ["strike", "breach", "signal"].includes(e.animationStyle) ? e.animationStyle : "strike", n = e.imagePath ? `<img class="hcci-portrait" src="${A(e.imagePath)}" alt="">` : '<div class="hcci-portrait hcci-portrait-fallback"><i class="fa-solid fa-user-astronaut"></i></div>', a = Math.max(1, String(e.overlayText ?? "").length), r = e.textEnabled && e.overlayText ? `<div class="hcci-title" style="--hcci-title-chars: ${a}">${A(e.overlayText)}</div>` : "", o = e.actorName || e.userName || "", l = document.createElement("div");
  return l.className = `hcci-overlay hcci-style-${i}`, l.style.setProperty("--hcci-accent", t), l.innerHTML = `
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
        ${n}
        <div class="hcci-frame-lightning hcci-frame-lightning-a"></div>
        <div class="hcci-frame-lightning hcci-frame-lightning-b"></div>
      </div>
      <div class="hcci-copy">
        ${r}
        ${o ? `<div class="hcci-subtitle">${A(o)}</div>` : ""}
      </div>
    </section>
  `, l;
}
async function ae(e) {
  if (!ee(e)) return;
  const t = Math.min(8e3, Math.max(800, Number(e.duration ?? u(c.duration) ?? 2500))), i = ne(e);
  i.style.setProperty("--hcci-duration", `${t}ms`), document.body.appendChild(i), document.body.classList.add("hcci-screen-shake");
  const n = te(e.audioPath, e.volume);
  await new Promise((a) => window.setTimeout(a, Math.max(250, t - 250))), ie(await n), i.classList.add("hcci-exiting"), await new Promise((a) => window.setTimeout(a, 250)), i.remove(), document.body.classList.remove("hcci-screen-shake");
}
async function re() {
  if (!M) {
    for (M = !0; m.length; ) {
      const e = m.shift();
      await ae(e);
    }
    M = !1;
  }
}
function S(e) {
  if (e) {
    if (e.id) {
      if (b.has(e.id)) return;
      b.add(e.id), b.size > 100 && b.delete(b.values().next().value);
    }
    m.push(e), m.length > 3 && m.splice(1, m.length - 3), re();
  }
}
const w = /* @__PURE__ */ new Set();
function oe(e, t) {
  var l, f, d, y, v, p;
  const i = (e == null ? void 0 : e.flags) ?? {}, n = ((f = (l = i.dnd5e) == null ? void 0 : l.roll) == null ? void 0 : f.type) ?? ((y = (d = i.dnd5e) == null ? void 0 : d.roll) == null ? void 0 : y.rollType), a = (p = (v = i.pf2e) == null ? void 0 : v.context) == null ? void 0 : p.type, r = String((e == null ? void 0 : e.content) ?? "").toLowerCase(), o = String((t == null ? void 0 : t.formula) ?? "").toLowerCase();
  return [n, a].some((T) => String(T ?? "").toLowerCase().includes("damage")) || r.includes("damage roll") || o.includes("damage");
}
function ce(e) {
  const t = [], i = [...(e == null ? void 0 : e.terms) ?? [], ...(e == null ? void 0 : e.dice) ?? []], n = /* @__PURE__ */ new Set();
  for (const a of i)
    if (!n.has(a) && (n.add(a), !(!a || a.faces !== 20 || !Array.isArray(a.results))))
      for (const r of a.results) {
        if (r.active === !1 || r.discarded === !0) continue;
        const o = Number(r.result);
        Number.isInteger(o) && t.push(o);
      }
  return t;
}
function U(e, t) {
  return `${e}:${t}`;
}
function le() {
  return U("gm", "default");
}
function se(e) {
  return ["strike", "breach", "signal"].includes(e) ? e : "strike";
}
function B(e, t) {
  var n, a, r, o;
  if (!e || !t) return !1;
  const i = ((a = (n = globalThis.CONST) == null ? void 0 : n.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3;
  return Number(((r = e.ownership) == null ? void 0 : r[t]) ?? ((o = e.ownership) == null ? void 0 : o.default) ?? 0) >= i;
}
function ue(e) {
  var i;
  const t = (e == null ? void 0 : e.speaker) ?? {};
  return t.actor ? ((i = game.actors) == null ? void 0 : i.get(t.actor)) ?? null : e != null && e.actor ? e.actor : null;
}
function de(e, t) {
  var a, r, o, l;
  const i = ((a = e == null ? void 0 : e.user) == null ? void 0 : a.id) ?? (e == null ? void 0 : e.user) ?? (e == null ? void 0 : e.userId), n = (r = game.users) == null ? void 0 : r.get(i);
  if (n && !n.isGM) return n;
  if (t) {
    const f = (o = game.users) == null ? void 0 : o.find((d) => !d.isGM && B(t, d.id));
    if (f) return f;
  }
  return n ?? ((l = game.users) == null ? void 0 : l.get(i)) ?? null;
}
function j(e, t) {
  const i = _(), n = t ? i[U("actor", t.id)] : null, a = e != null && e.isGM ? i[le()] : null;
  if (!t && !(e != null && e.isGM) && !n) return { enabled: !1, threshold: C() };
  const r = n ?? a ?? {}, o = Number(r.threshold);
  return {
    enabled: r.enabled !== !1,
    threshold: Number.isInteger(o) && o >= 1 && o <= 20 ? o : C(),
    animationStyle: se(r.animationStyle),
    imagePath: r.imagePath || (t == null ? void 0 : t.img) || "",
    audioPath: r.audioPath || "",
    overlayText: r.overlayText || u(c.defaultText),
    accentColor: r.accentColor || "#69e8ff"
  };
}
function fe(e, t, i, n, a) {
  return a.enabled ? {
    id: foundry.utils.randomID(),
    messageId: e.id,
    userId: (n == null ? void 0 : n.id) ?? null,
    actorId: (i == null ? void 0 : i.id) ?? null,
    userName: (n == null ? void 0 : n.name) ?? "",
    actorName: (i == null ? void 0 : i.name) ?? (n == null ? void 0 : n.name) ?? "",
    naturalResult: t,
    threshold: a.threshold,
    animationStyle: a.animationStyle,
    blind: e.blind === !0,
    whisper: Array.isArray(e.whisper) ? [...e.whisper] : [],
    imagePath: a.imagePath || "",
    audioPath: a.audioPath || "",
    overlayText: a.overlayText || "",
    accentColor: a.accentColor || "#69e8ff",
    textEnabled: u(c.textEnabled),
    duration: u(c.duration),
    volume: u(c.volume),
    audience: u(c.audience)
  } : (x("Cut-in disabled for target.", { userId: n == null ? void 0 : n.id, actorId: i == null ? void 0 : i.id }), null);
}
function he(e, t) {
  var i;
  if (!(e != null && e.isRoll) && !((i = e == null ? void 0 : e.rolls) != null && i.length)) return null;
  for (const n of e.rolls ?? []) {
    if (oe(e, n)) continue;
    const r = ce(n).find((o) => o >= t);
    if (r) return r;
  }
  return null;
}
function ge() {
  var i, n;
  const t = (((i = game.users) == null ? void 0 : i.filter((a) => a.active && a.isGM)) ?? []).sort((a, r) => a.id.localeCompare(r.id))[0];
  return ((n = game.user) == null ? void 0 : n.isGM) && (!t || t.id === game.user.id);
}
function me() {
  var e;
  Hooks.on("createChatMessage", (t) => {
    var l;
    if (!u(c.enabled) || !ge() || w.has(t.id)) return;
    w.add(t.id), w.size > 200 && w.delete(w.values().next().value);
    const i = ue(t), n = de(t, i), a = j(n, i), r = he(t, a.threshold);
    if (!r) return;
    const o = fe(t, r, i, n, a);
    o && (x("Triggering cut-in.", o), (l = game.socket) == null || l.emit(k, { type: "play", payload: o }), S(o));
  }), (e = game.socket) == null || e.on(k, (t) => {
    (t == null ? void 0 : t.type) === "play" && u(c.enabled) && S(t.payload);
  });
}
function z(e, t = {}) {
  var r, o;
  const i = (r = game.users) == null ? void 0 : r.get(e), n = t.actorId ? (o = game.actors) == null ? void 0 : o.get(t.actorId) : (i == null ? void 0 : i.character) ?? null, a = j(i, n);
  return {
    id: foundry.utils.randomID(),
    userId: e,
    actorId: (n == null ? void 0 : n.id) ?? null,
    userName: (i == null ? void 0 : i.name) ?? "",
    actorName: (n == null ? void 0 : n.name) ?? (i == null ? void 0 : i.name) ?? "",
    naturalResult: t.naturalResult ?? 20,
    threshold: t.threshold ?? a.threshold ?? C(),
    animationStyle: t.animationStyle ?? a.animationStyle ?? "strike",
    imagePath: t.imagePath ?? a.imagePath ?? "",
    audioPath: t.audioPath ?? a.audioPath ?? "",
    overlayText: t.overlayText ?? a.overlayText ?? u(c.defaultText),
    accentColor: t.accentColor ?? a.accentColor ?? "#69e8ff",
    textEnabled: t.textEnabled ?? u(c.textEnabled),
    duration: t.duration ?? u(c.duration),
    volume: t.volume ?? u(c.volume),
    audience: t.audience ?? u(c.audience)
  };
}
function ye(e, t = {}) {
  var a, r;
  const i = (a = game.actors) == null ? void 0 : a.get(e), n = ((r = game.users) == null ? void 0 : r.find((o) => !o.isGM && B(i, o.id))) ?? game.user;
  return z(n == null ? void 0 : n.id, { ...t, actorId: e });
}
function H(e) {
  var t;
  (t = game.socket) == null || t.emit(k, { type: "play", payload: e }), S(e);
}
var D, R, q;
const ve = globalThis.FormApplication ?? ((q = (R = (D = globalThis.foundry) == null ? void 0 : D.appv1) == null ? void 0 : R.api) == null ? void 0 : q.FormApplication);
function V(e, t) {
  return `${e}:${t}`;
}
function pe() {
  return V("gm", "default");
}
function be(e, t) {
  var n, a, r, o;
  const i = ((a = (n = globalThis.CONST) == null ? void 0 : n.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3;
  return Number(((r = t == null ? void 0 : t.ownership) == null ? void 0 : r[e.id]) ?? ((o = t == null ? void 0 : t.ownership) == null ? void 0 : o.default) ?? 0) >= i;
}
function we(e = {}) {
  const t = Number(e.threshold), i = ["strike", "breach", "signal"].includes(e.animationStyle) ? e.animationStyle : "strike";
  return {
    enabled: e.enabled !== !1,
    threshold: Number.isInteger(t) && t >= 1 && t <= 20 ? t : "",
    animationStyle: i,
    animationStyles: [
      { value: "strike", label: "Neon Strike", selected: i === "strike" },
      { value: "breach", label: "Panel Breach", selected: i === "breach" },
      { value: "signal", label: "Signal Bloom", selected: i === "signal" }
    ],
    imagePath: String(e.imagePath ?? ""),
    audioPath: String(e.audioPath ?? ""),
    overlayText: String(e.overlayText ?? ""),
    accentColor: String(e.accentColor ?? "#69e8ff")
  };
}
function Ce() {
  var i, n, a;
  const e = ((i = game.users) == null ? void 0 : i.find((r) => r.isGM && r.active)) ?? ((n = game.users) == null ? void 0 : n.find((r) => r.isGM)) ?? game.user, t = [{
    key: pe(),
    type: "gm",
    typeLabel: "GM",
    id: "default",
    name: "GM Cut-In",
    portrait: (e == null ? void 0 : e.avatar) || "icons/svg/mystery-man.svg"
  }];
  for (const r of game.actors ?? []) {
    const o = ((a = game.users) == null ? void 0 : a.filter((l) => !l.isGM && be(l, r)).map((l) => l.name)) ?? [];
    o.length && t.push({
      key: V("actor", r.id),
      type: "actor",
      typeLabel: "Actor",
      id: r.id,
      name: `${r.name} (${o.join(", ")})`,
      portrait: r.img || "icons/svg/mystery-man.svg"
    });
  }
  return t.sort((r, o) => r.type === "gm" ? -1 : o.type === "gm" ? 1 : r.name.localeCompare(o.name));
}
class K extends ve {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "hcci-player-config",
      title: `${F} Configuration`,
      template: Y,
      classes: ["hcci-config-window"],
      width: 1120,
      height: "auto",
      resizable: !0,
      closeOnSubmit: !1,
      submitOnChange: !1
    });
  }
  async getData() {
    const t = _(), i = Ce().map((n) => {
      const a = we(t[n.key]), r = a.imagePath || n.portrait;
      return {
        ...n,
        ...a,
        preview: r,
        imageStatus: a.imagePath ? "Custom image configured." : "No custom image configured.",
        audioStatus: a.audioPath ? "Audio sample configured." : "No audio sample configured."
      };
    });
    return {
      moduleId: s,
      threshold: C(),
      duration: u(c.duration),
      defaultText: u(c.defaultText),
      rows: i
    };
  }
  activateListeners(t) {
    super.activateListeners(t), t.find("[data-hcci-browse]").on("click", (i) => {
      i.preventDefault();
      const n = i.currentTarget, a = n.closest("[data-hcci-row]"), r = n.dataset.hcciBrowse, o = a == null ? void 0 : a.querySelector(`[data-hcci-field="${r}"]`);
      if (!o) return;
      new FilePicker({
        type: r === "audioPath" ? "audio" : "image",
        current: o.value,
        callback: (f) => {
          if (o.value = f, o.dispatchEvent(new Event("change", { bubbles: !0 })), r === "imagePath") {
            const d = a.querySelector("[data-hcci-preview]");
            d && (d.src = f || d.dataset.fallbackSrc || "icons/svg/mystery-man.svg");
          }
        }
      }).browse();
    }), t.find("[data-hcci-action='reset']").on("click", async (i) => {
      var n;
      i.preventDefault(), await O({}), (n = ui.notifications) == null || n.info("Critical Cut-In player configuration reset."), this.render(!1);
    });
  }
  async _updateObject(t) {
    var o, l, f, d, y, v, p, T, E, I, L, $;
    const i = t.currentTarget, n = {};
    for (const h of i.querySelectorAll("[data-hcci-row]")) {
      const X = h.dataset.hcciRow;
      n[X] = {
        enabled: ((o = h.querySelector('[data-hcci-field="enabled"]')) == null ? void 0 : o.checked) === !0,
        threshold: (() => {
          var G;
          const P = Number((G = h.querySelector('[data-hcci-field="threshold"]')) == null ? void 0 : G.value);
          return Number.isInteger(P) && P >= 1 && P <= 20 ? P : "";
        })(),
        animationStyle: ((l = h.querySelector('[data-hcci-field="animationStyle"]')) == null ? void 0 : l.value) || "strike",
        imagePath: ((d = (f = h.querySelector('[data-hcci-field="imagePath"]')) == null ? void 0 : f.value) == null ? void 0 : d.trim()) ?? "",
        audioPath: ((v = (y = h.querySelector('[data-hcci-field="audioPath"]')) == null ? void 0 : y.value) == null ? void 0 : v.trim()) ?? "",
        overlayText: ((T = (p = h.querySelector('[data-hcci-field="overlayText"]')) == null ? void 0 : p.value) == null ? void 0 : T.trim()) ?? "",
        accentColor: ((E = h.querySelector('[data-hcci-field="accentColor"]')) == null ? void 0 : E.value) || "#69e8ff"
      };
    }
    const a = Number(((I = i.querySelector('[name="threshold"]')) == null ? void 0 : I.value) ?? C()), r = Number(((L = i.querySelector('[name="duration"]')) == null ? void 0 : L.value) ?? u(c.duration));
    await N(c.threshold, Math.min(20, Math.max(1, a))), await N(c.duration, Math.min(8e3, Math.max(800, r))), await O(n), ($ = ui.notifications) == null || $.info("Critical Cut-In configuration saved."), this.render(!1);
  }
}
function W() {
  var e, t;
  return (e = game.user) != null && e.isGM ? new K().render(!0) : ((t = ui.notifications) == null || t.warn("Only the GM can configure Critical Cut-In."), null);
}
function Se() {
  var i, n, a, r;
  const e = (i = game.modules.get("holosuite")) != null && i.active ? (n = game.modules.get("holosuite")) == null ? void 0 : n.api : null, t = (a = game.modules.get("holosuite-core")) != null && a.active ? (r = game.modules.get("holosuite-core")) == null ? void 0 : r.api : null;
  return e ?? t ?? game.holosuite ?? null;
}
function Q() {
  const e = Se();
  return e != null && e.registerApp ? (e.registerApp({
    id: s,
    title: "Critical Cut-In",
    icon: "fa-solid fa-bolt-lightning",
    premium: !1,
    playerVisible: !1,
    description: "JRPG-style critical hit cut-in animation for natural d20 results.",
    enabled: u(c.enabled),
    open: () => W()
  }), console.log(`${s} | Registered with HoloSuite.`), !0) : !1;
}
function J() {
  const e = {
    playCutinForUser(i, n = {}) {
      var r;
      const a = z(i, n);
      return (r = game.user) != null && r.isGM ? H(a) : S(a), a;
    },
    playCutinForActor(i, n = {}) {
      var r;
      const a = ye(i, n);
      return (r = game.user) != null && r.isGM ? H(a) : S(a), a;
    },
    openConfig: W
  }, t = game.modules.get(s);
  return t && (t.api = e), game.holosuiteCriticalCutin = e, e;
}
Hooks.once("init", async () => {
  Z(K), J(), await loadTemplates([`modules/${s}/templates/player-config.hbs`]);
});
Hooks.once("ready", () => {
  J(), me(), Q(), console.log(`${s} | Ready. API available at game.modules.get("${s}").api`);
});
Hooks.on("hotReload", () => {
  Q();
});
console.log(`${F} | Loading.`);
