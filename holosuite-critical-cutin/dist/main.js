var Ht = Object.defineProperty;
var Gt = (e, t, a) => t in e ? Ht(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var de = (e, t, a) => Gt(e, typeof t != "symbol" ? t + "" : t, a);
const _t = [4, 6, 8, 10, 12, 20, 100];
function dt(e = 20) {
  var n, r, o;
  const t = ze(e), a = /* @__PURE__ */ new Set([..._t, t]), i = ((o = (r = (n = globalThis.CONFIG) == null ? void 0 : n.Dice) == null ? void 0 : r.fulfillment) == null ? void 0 : o.dice) ?? {};
  for (const s of Object.keys(i)) {
    const c = /^d([1-9]\d*)$/i.exec(s);
    if (!c) continue;
    const u = Number(c[1]);
    u >= 2 && u <= 1e4 && a.add(u);
  }
  return [...a].sort((s, c) => s - c).map((s) => ({ value: s, label: `d${s}`, selected: s === t }));
}
function _e(e, t) {
  const a = ze(e), i = ft(t) === "low";
  return { success: i ? 1 : a, failure: i ? a : 1 };
}
function ze(e) {
  const t = Number(e);
  return Number.isInteger(t) && t >= 2 && t <= 1e4 ? t : 20;
}
function ft(e) {
  return e === "low" ? "low" : "high";
}
const p = "holosuite-critical-cutin", ht = "HoloSuite Critical Cut-In", $e = `module.${p}`, qt = `modules/${p}/templates/player-config.hbs`, d = {
  enabled: "enabled",
  dieSides: "dieSides",
  rollDirection: "rollDirection",
  threshold: "threshold",
  failureThreshold: "failureThreshold",
  duration: "duration",
  volume: "volume",
  audience: "audience",
  textEnabled: "textEnabled",
  animationFont: "animationFont",
  defaultText: "defaultText",
  defaultFailureText: "defaultFailureText",
  motionMode: "motionMode",
  flashMode: "flashMode",
  effectIntensity: "effectIntensity",
  shakeIntensity: "shakeIntensity",
  localVolume: "localVolume",
  suppressCutins: "suppressCutins",
  debug: "debug",
  playerConfigs: "playerConfigs"
}, te = {
  everyone: "everyone",
  gm: "gm",
  triggeringPlayer: "triggeringPlayer"
};
function Bt(e) {
  game.settings.register(p, d.effectIntensity, {
    name: "Local Effect Detail",
    hint: "Choose the density of decorative particles and the strength of glow on this device.",
    scope: "client",
    config: !0,
    type: String,
    default: "standard",
    choices: { low: "Low", standard: "Standard", high: "High" }
  }), game.settings.register(p, d.shakeIntensity, {
    name: "Local Impact Shake",
    hint: "Shake the cut-in at impact. Reduced and still motion always disable shake.",
    scope: "client",
    config: !0,
    type: Number,
    default: 0.5,
    range: { min: 0, max: 1, step: 0.1 }
  }), game.settings.register(p, d.enabled, {
    name: "Enable Critical Cut-In",
    hint: "Play a configured cut-in when a qualifying natural result is rolled on the selected die.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(p, d.dieSides, {
    name: "Check Die",
    hint: "Configured in Configure Player Cut-Ins, where changes confirm the reset of all listed roll thresholds.",
    scope: "world",
    config: !1,
    type: Number,
    default: 20
  }), game.settings.register(p, d.rollDirection, {
    name: "Positive Rolls",
    hint: "Configured in Configure Player Cut-Ins, together with the check die and roll thresholds.",
    scope: "world",
    config: !1,
    type: String,
    default: "high",
    choices: { high: "High rolls are positive", low: "Low rolls are positive" }
  }), game.settings.register(p, d.threshold, {
    name: "Default Trigger Threshold",
    hint: "0 automatically uses the best die face. Otherwise success triggers at or above this value for high rolls, or at or below it for low rolls.",
    scope: "world",
    config: !0,
    type: Number,
    default: 0
  }), game.settings.register(p, d.failureThreshold, {
    name: "Default Failure Trigger",
    hint: "0 automatically uses the worst die face. Otherwise failure triggers at or below this value for high rolls, or at or above it for low rolls.",
    scope: "world",
    config: !0,
    type: Number,
    default: 0
  }), game.settings.register(p, d.duration, {
    name: "Animation Duration",
    hint: "How long the cut-in remains visible, in milliseconds.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 800, max: 8e3, step: 100 },
    default: 2500
  }), game.settings.register(p, d.volume, {
    name: "Cut-In Audio Volume",
    hint: "Volume multiplier for configured cut-in audio samples.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 0.8
  }), game.settings.register(p, d.audience, {
    name: "Show Animation To",
    hint: "Choose who sees synchronized cut-in playback.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      [te.everyone]: "Everyone",
      [te.gm]: "GM only",
      [te.triggeringPlayer]: "Triggering player only"
    },
    default: te.everyone
  }), game.settings.register(p, d.animationFont, {
    name: "Animation Font",
    hint: "Typeface for the cut-in label and actor name.",
    scope: "world",
    config: !0,
    type: String,
    default: "aicon",
    choices: { aicon: "AICON", classic: "Classic (Orbitron / system fallback)" }
  }), game.settings.register(p, d.textEnabled, {
    name: "Enable Text Overlay",
    hint: "Show the configured label during the cut-in.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(p, d.defaultText, {
    name: "Default Overlay Text",
    hint: "Fallback label used when no player-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL"
  }), game.settings.register(p, d.defaultFailureText, {
    name: "Default Failure Overlay Text",
    hint: "Fallback label used when no failure-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL FAILURE"
  }), game.settings.register(p, d.motionMode, {
    name: "Local Motion",
    hint: "Control cut-in motion on this device. System follows your operating-system reduced-motion preference.",
    scope: "client",
    config: !0,
    type: String,
    choices: {
      system: "Follow system preference",
      full: "Full cinematic motion",
      reduced: "Reduced motion",
      still: "Still presentation"
    },
    default: "system"
  }), game.settings.register(p, d.flashMode, {
    name: "Local Flash Intensity",
    hint: "Reduce or disable the bright opening flash on this device.",
    scope: "client",
    config: !0,
    type: String,
    choices: { full: "Full", soft: "Soft", off: "Off" },
    default: "soft"
  }), game.settings.register(p, d.localVolume, {
    name: "Local Cut-In Volume",
    hint: "Personal volume multiplier applied after the GM's cut-in volume setting.",
    scope: "client",
    config: !0,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 1
  }), game.settings.register(p, d.suppressCutins, {
    name: "Hide Cut-Ins On This Device",
    hint: "Do not show or play critical cut-ins for this client.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(p, d.debug, {
    name: "Debug Logging",
    hint: "Log roll detection and playback decisions to the console.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(p, d.playerConfigs, {
    name: "Per-Player Cut-In Configuration",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.registerMenu(p, "playerConfigMenu", {
    name: "Configure Player Cut-Ins",
    label: "Open Configuration",
    hint: "Choose the check die and positive roll direction, and set each user or actor's roll thresholds, portrait, audio, label, accent color, and enable state.",
    icon: "fa-solid fa-bolt",
    type: e,
    restricted: !0
  });
}
function m(e) {
  return game.settings.get(p, e);
}
async function X(e, t) {
  return game.settings.set(p, e, t);
}
function we(e) {
  if (typeof e != "number" && typeof e != "string") return;
  const t = Number(e);
  return Number.isInteger(t) && t >= 800 && t <= 8e3 ? t : void 0;
}
function Ke() {
  return pt(m(d.threshold), "success");
}
function mt() {
  return pt(m(d.failureThreshold), "failure");
}
function W() {
  return ze(m(d.dieSides));
}
function Pe() {
  return ft(m(d.rollDirection)) === "low";
}
function pt(e, t) {
  const a = Number(e);
  return Number.isInteger(a) && a >= 1 && a <= W() ? a : t === "success" === Pe() ? 1 : W();
}
function gt(e, t, a) {
  return a === "success" === Pe() ? e <= t : e >= t;
}
function qe() {
  const e = m(d.playerConfigs);
  return foundry.utils.deepClone(e && typeof e == "object" ? e : {});
}
async function Je(e) {
  return X(d.playerConfigs, e && typeof e == "object" ? e : {});
}
function pe(...e) {
  m(d.debug) && console.log(`${p} |`, ...e);
}
const Xe = "boxOfDoom", ce = "boxOfDoomState", Vt = 850, jt = 5200, zt = 500;
let U = !1, De = !1, J, Re;
function Kt() {
  var t;
  return (t = Array.from(game.users ?? []).filter((a) => a.isGM && a.active).sort((a, i) => a.id.localeCompare(i.id))[0]) == null ? void 0 : t.id;
}
function he() {
  var e;
  return ((e = game.user) == null ? void 0 : e.isGM) && (Kt() ?? game.user.id) === game.user.id;
}
function le() {
  const e = m(ce);
  return e != null && e.id && (e.phase !== "revealed" || e.expires > Date.now()) ? e : void 0;
}
function yt(e) {
  return e.target === null ? "" : `Target ${e.low ? "≤" : "≥"} ${e.target}`;
}
function Be(e) {
  return e.target === null ? "" : (e.low ? e.total <= e.target : e.total >= e.target) ? "Success" : "Failure";
}
function Xt(e) {
  const t = document.createElement("span");
  return t.textContent = e, t.innerHTML;
}
function ee() {
  var f;
  clearTimeout(Re);
  const e = le(), t = ((f = game.user) == null ? void 0 : f.isGM) === !0, a = he(), i = !t && m(d.suppressCutins) === !0;
  if (!e || i) {
    J == null || J.remove(), J = void 0;
    return;
  }
  const n = `${e.id}:${e.phase}:${a}:${U}`;
  if ((J == null ? void 0 : J.dataset.state) === n) {
    e.phase === "revealed" && (Re = setTimeout(ee, Math.max(1, e.expires - Date.now())));
    return;
  }
  const r = J, o = a && (!r || r.contains(document.activeElement));
  r == null || r.remove();
  const s = document.createElement("section");
  s.className = "hcci-doom", s.dataset.holosuiteBranding = `${p}-box-of-doom`, s.dataset.state = n, s.dataset.phase = e.phase, s.dataset.animate = String((r == null ? void 0 : r.dataset.boxId) !== e.id || r.dataset.phase !== e.phase), s.dataset.boxId = e.id, s.dataset.control = String(a), s.dataset.motion = String(m(d.motionMode) ?? "system"), e.phase === "revealed" && (s.dataset.outcome = Be(e).toLowerCase()), s.setAttribute("aria-label", "Box of Doom"), s.innerHTML = `
    <div class="hcci-doom-stage">
      <h2><span data-holosuite-brand-icon></span><span data-holosuite-brand-name>Box of Doom</span></h2>
      <p class="hcci-doom-stakes"></p>
      <p class="hcci-doom-target"></p>
      <div class="hcci-doom-vault" aria-hidden="true">
        <svg viewBox="0 0 400 210" focusable="false">
          <path class="hcci-doom-shell" d="M48 37 84 12h232l36 25 30 33v102l-29 25H47l-29-25V70Z"/>
          <path class="hcci-doom-core" d="M72 74 100 51h200l28 23v62l-28 23H100l-28-23Z"/>
          <g class="hcci-doom-lid">
            <path d="M48 37 84 12h232l36 25 30 33-43 20H61L18 70Z"/>
            <path d="M91 38h218l22 22H69Z"/>
          </g>
          <g class="hcci-doom-base">
            <path d="M18 110h119l18 25h90l18-25h119v62l-29 25H47l-29-25Z"/>
            <path d="M48 145h68l14 22H63Zm236 0h68l-15 22h-67Z"/>
          </g>
          <path class="hcci-doom-lock" d="m200 68 31 18v37l-31 18-31-18V86Z"/>
        </svg>
      </div>
      <div class="hcci-doom-status" role="status" aria-live="polite" aria-atomic="true"></div>
      <div class="hcci-doom-controls"></div>
    </div>`, s.querySelector(".hcci-doom-stakes").textContent = e.stakes, s.querySelector(".hcci-doom-target").textContent = [`d${e.sides}`, yt(e)].filter(Boolean).join(" · ");
  const c = s.querySelector(".hcci-doom-status");
  if (e.phase === "revealed") {
    const h = c.appendChild(document.createElement("strong"));
    h.textContent = String(e.total);
    const b = c.appendChild(document.createElement("span"));
    b.textContent = Be(e) || "Result", Re = setTimeout(ee, Math.max(1, e.expires - Date.now()));
  } else
    c.textContent = e.phase === "sealed" ? "Sealed" : "Opening…";
  const u = (h, b) => {
    const M = s.querySelector(".hcci-doom-controls").appendChild(document.createElement("button"));
    M.type = "button", M.textContent = h, M.addEventListener("click", () => void b().catch(vt));
  };
  a && !U && e.phase === "sealed" && u("Roll & Reveal", () => Ut(e.id)), a && !U && e.phase !== "revealed" && u("Cancel", () => et(e.id)), a && !U && e.phase === "revealed" && u("Close", () => et(e.id)), J = s, document.body.append(s), Hooks.callAll("holosuite-core.renderBranding", s), o && (s.tabIndex = -1, (s.querySelector("button") ?? s).focus({ preventScroll: !0 }));
}
function vt(e) {
  var t;
  console.error(`${p} | Box of Doom`, e), (t = ui.notifications) == null || t.error("Box of Doom could not complete the action. Check the chat and try again.");
}
async function et(e) {
  var t;
  if (!(!he() || U || ((t = le()) == null ? void 0 : t.id) !== e)) {
    U = !0, ee();
    try {
      await X(ce, {});
    } finally {
      U = !1, ee();
    }
  }
}
const tt = (e) => new Promise((t) => setTimeout(t, e));
async function Ut(e) {
  var a, i;
  const t = le();
  if (!(!he() || U || (t == null ? void 0 : t.id) !== e || t.phase !== "sealed")) {
    U = !0, ee();
    try {
      const n = ((a = foundry.dice) == null ? void 0 : a.Roll) ?? globalThis.Roll;
      await X(ce, { ...t, phase: "opening" });
      const r = await new n(`1d${t.sides}`).evaluate({ allowInteractive: !1 }), o = Number(r.total);
      if (!Number.isInteger(o) || o < 1 || o > t.sides) throw new Error("Unexpected die result.");
      await tt(Vt);
      const s = le();
      if ((s == null ? void 0 : s.id) !== e || s.phase !== "opening") return;
      const c = { ...t, phase: "revealed", total: o, expires: Date.now() + jt };
      await X(ce, c), await tt(zt);
      const u = ((i = foundry.documents) == null ? void 0 : i.ChatMessage) ?? globalThis.ChatMessage, f = [`d${t.sides}: ${o}`, yt(t), Be(c)].filter(Boolean).join(" · ");
      await u.create({
        speaker: u.getSpeaker(),
        content: `<h3>Box of Doom</h3>${t.stakes ? `<p>${Xt(t.stakes)}</p>` : ""}<p><strong>${f}</strong></p>`,
        whisper: [],
        blind: !1,
        flags: { [p]: { [Xe]: e } }
      });
    } catch (n) {
      const r = le();
      throw he() && (r == null ? void 0 : r.phase) === "opening" && r.id === e && await X(ce, t), n;
    } finally {
      U = !1, ee();
    }
  }
}
async function bt() {
  var e, t, a;
  if (!he()) {
    (e = game.user) != null && e.isGM && ((t = ui.notifications) == null || t.warn("The active GM controls Box of Doom."));
    return;
  }
  if (!(U || De || le())) {
    De = !0;
    try {
      const i = foundry.applications.api.DialogV2, n = dt(W()), r = Pe(), o = await i.prompt({
        window: { title: "Box of Doom" },
        modal: !0,
        rejectClose: !1,
        content: `<div class="hcci-doom-form" data-holosuite-branding="${p}-box-of-doom">
        <label>What’s at stake?<input name="stakes" type="text" maxlength="180" placeholder="Optional"></label>
        <label>Die<select name="sides">${n.map(({ value: s, label: c, selected: u }) => `<option value="${s}" ${u ? "selected" : ""}>${c}</option>`).join("")}</select></label>
        <label>Success target (${r ? "roll at or below" : "roll at or above"})<input name="target" type="number" min="1" max="10000" step="1" placeholder="Optional"></label>
      </div>`,
        ok: {
          label: "Show Box to Table",
          callback: (s, c) => {
            const u = new FormData(c.form), f = u.get("target");
            return {
              stakes: String(u.get("stakes") ?? "").trim(),
              sides: Number(u.get("sides")),
              target: f === "" || f == null ? null : Number(f)
            };
          }
        }
      });
      if (!o || !he() || le() || !n.some((s) => s.value === o.sides)) return;
      if (o.target !== null && (!Number.isInteger(o.target) || o.target < 1 || o.target > o.sides)) {
        (a = ui.notifications) == null || a.warn(`Choose a target between 1 and ${o.sides}, or leave it blank.`);
        return;
      }
      await X(ce, { ...o, id: foundry.utils.randomID(), phase: "sealed", low: r });
    } catch (i) {
      vt(i);
    } finally {
      De = !1;
    }
  }
}
function Wt() {
  game.settings.register(p, ce, {
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: ee
  });
}
const me = "shattered-fate", wt = [53, 48], Ae = [
  [[49, 34], [43, 25], [41, 0]],
  [[64, 39], [69, 23], [100, 0]],
  [[68, 49], [79, 45], [100, 36]],
  [[66, 58], [81, 65], [100, 76]],
  [[61, 64], [66, 81], [78, 100]],
  [[50, 66], [46, 76], [39, 100]],
  [[41, 60], [29, 70], [0, 100]],
  [[34, 52], [22, 56], [0, 52]],
  [[43, 40], [31, 28], [0, 0]]
], at = Ae.flatMap(([e, t, a], i) => {
  const [n, r, o] = Ae[(i + 1) % Ae.length], s = [(e[0] + n[0]) / 2 + (i % 2 ? 1.5 : -2), (e[1] + n[1]) / 2 + (i % 3 - 1) * 2];
  return [
    [wt, e, s, n],
    [e, t, a, ...i === 3 ? [[100, 100]] : [], o, r, n, s]
  ];
}), Ct = (e) => `polygon(${e.map(([t, a]) => `${t}% ${a}%`).join(",")})`, Ve = (e) => e.map((t) => t.join(",")).join(" "), Oe = [
  [[0, 0], [100, 0]],
  [[0, 16], [21, 23], [37, 15], [58, 29], [72, 20], [100, 26]],
  [[0, 42], [25, 48], [44, 37], [65, 49], [86, 42], [100, 50]],
  [[0, 62], [20, 70], [39, 58], [62, 73], [80, 61], [100, 67]],
  [[0, 83], [17, 88], [39, 77], [59, 91], [77, 79], [100, 89]],
  [[0, 100], [100, 100]]
];
function Qt() {
  return `<svg class="hcci-fate-backdrop" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
    <path class="hcci-fate-slashes" d="M0 365 259 206 146 327 350 230 227 367 0 505ZM0 511l244-106L80 520l65-12L0 560Zm1000-407L712 250l104-114-113 44L919 0h81Zm0 390-192 66h-66l98-58-46 6 206-133Z"/>
    <path class="hcci-fate-streaks" d="m0 337 274-179L91 314Zm0 184 327-118L54 520ZM1000 25 733 193 960 25Zm0 215-208 108 208-76ZM675 560l250-124-177 124Z"/>
    <path class="hcci-fate-debris" d="m115 152 35-19-16 38Zm64 311 47-27-27 41Zm623-351 46-25-23 43Zm75 279 49-43-15 51ZM69 437l29-22-11 27Zm864-225 33-19-15 29Z"/>
  </svg><div class="hcci-fate-flash"></div>`;
}
function Yt(e) {
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points="${Ve(e)}"/></svg>`;
}
function Fe(e) {
  const t = e.querySelector(".hcci-visual"), a = t.querySelector(".hcci-portrait"), i = t.querySelectorAll(".hcci-fate-shard");
  if (i.length) {
    for (const n of i) n.firstElementChild.replaceWith(a.cloneNode(!0));
    return;
  }
  for (const n of at) {
    const r = document.createElement("div");
    r.className = "hcci-fate-shard", r.style.clipPath = Ct(n), r.append(a.cloneNode(!0)), r.insertAdjacentHTML("beforeend", Yt(n)), t.append(r);
  }
  t.insertAdjacentHTML("beforeend", `<svg class="hcci-fate-cracks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <g class="hcci-fate-branches">${at.filter((n, r) => r % 2 === 0).map((n) => `<polyline points="${Ve(n.slice(1))}"/>`).join("")}</g>
    <g class="hcci-fate-rays">${Ae.map((n) => `<polyline points="${Ve([wt, ...n])}"/>`).join("")}</g>
    <path class="hcci-fate-spark" d="m53 45 1 2 3 1-3 1-1 3-1-3-3-1 3-1Z"/>
  </svg>`);
}
const H = { fracture: 250, shatter: 450, impact: 740, settle: 1050 }, Jt = 280, Te = "steps(1, end)", Se = "cubic-bezier(.13,.79,.19,1)", ea = [
  [-0.34, -0.92, -27],
  [0.38, -0.86, 20],
  [0.91, -0.35, 32],
  [0.86, 0.39, -24],
  [0.46, 0.85, 37],
  [-0.21, 0.99, -31],
  [-0.68, 0.66, 27],
  [-1, 0.12, -34],
  [-0.8, -0.59, 18]
];
function ta(e, t) {
  const a = [];
  if (!e.classList.contains("hcci-motion-full") || !e.animate) return { animations: a, audioDelay: 0 };
  const i = Math.min(1, (t - 140) / H.settle), n = (f, h, b, M, x = "linear") => {
    f && a.push(f.animate(h, {
      delay: b * i,
      duration: (M - b) * i,
      easing: x,
      fill: "both"
    }));
  }, r = (f) => e.querySelector(f);
  n(r(".hcci-visual"), [
    { transform: "translate(-3vw, 2vh) scale(1.09)", opacity: 0.42 },
    { transform: "none", opacity: 1 }
  ], 0, H.fracture, Se), n(r(".hcci-portrait-frame"), [{ visibility: "visible" }, { visibility: "hidden" }], 0, H.shatter, Te);
  for (const [f, h] of [[".hcci-fate-rays", 250], [".hcci-fate-branches", 310], [".hcci-fate-spark", 250]])
    n(r(f), [
      { opacity: 0 },
      { opacity: 1, offset: 0.06, easing: Te },
      { opacity: 0 }
    ], h, H.shatter);
  for (const [f, h] of Array.from(e.querySelectorAll(".hcci-fate-shard")).entries()) {
    const b = f % 2 === 0, [M, x, $] = ea[Math.floor(f / 2)], k = b ? 40 : 55, S = b ? 33 + f % 3 * 12 : f % 3 * 8;
    n(h, [{ visibility: "hidden" }, { visibility: "visible" }], 0, H.shatter, Te);
    const L = H.shatter + S, q = b ? 819 : 756;
    n(h, [
      { transform: "none", opacity: 1, easing: Se },
      { transform: `perspective(850px) translate3d(${M * k * 0.52}vw,${x * k * 0.47}vh,${b ? 96 : -80}px) rotate(${$ * 0.53}deg) rotateY(${M * 32}deg)`, opacity: 1, offset: (q - L) / (H.settle - L) },
      { transform: `perspective(850px) translate3d(${M * k}vw,${x * k}vh,${b ? 190 : -145}px) rotate(${$}deg) rotateY(${M * 62}deg)`, opacity: 0 }
    ], L, H.settle);
  }
  n(r(".hcci-copy"), [
    { opacity: 0, transform: "translate(13vw,3vh) rotate(-13deg) scale(1.3)" },
    { opacity: 1, transform: "translate(-1vw,0) rotate(-8deg) scale(1.035)", offset: 0.35, easing: Te },
    { opacity: 1, transform: "translate(-1vw,0) rotate(-8deg) scale(1.035)", offset: 0.51, easing: Se },
    { opacity: 1, transform: "rotate(-7deg)" }
  ], H.impact, H.settle, Se);
  const o = r(".hcci-fate-flash"), s = [54, H.fracture, H.impact], c = H.impact + 50, u = s.flatMap((f, h) => [
    { offset: f / c, opacity: 0 },
    {
      offset: (f + 7) / c,
      opacity: `calc(var(--flash-peak, .14) * ${h === 0 ? 0.55 : 1})`,
      backgroundColor: h === 0 ? "var(--hcci-accent)" : "#fff"
    },
    { offset: (f + 50) / c, opacity: 0 }
  ]);
  return n(o, [{ opacity: 0, offset: 0 }, ...u], 0, c), n(r(".hcci-stage"), [
    { transform: "none" },
    { transform: "translateX(var(--hcci-shake))", offset: 0.2 },
    { transform: "translateX(calc(-.45 * var(--hcci-shake)))", offset: 0.51 },
    { transform: "none" }
  ], H.impact, H.impact + 75), { animations: a, audioDelay: H.shatter * i };
}
function aa(e, t) {
  var n;
  if (!e.classList.contains("hcci-motion-full") || !e.animate) return [];
  const a = [], i = e.querySelector(".hcci-copy");
  if (Number(getComputedStyle(i).opacity) > 0.8 && ((n = i.textContent) != null && n.trim())) {
    const r = i.parentElement.appendChild(document.createElement("div"));
    r.className = "hcci-fate-exit-pieces";
    for (let o = 0; o < Oe.length - 1; o++) {
      const s = i.cloneNode(!0), c = r.appendChild(document.createElement("div"));
      c.style.clipPath = Ct([...Oe[o], ...Oe[o + 1].slice().reverse()]), c.append(s), a.push(c.animate([
        { transform: "none", opacity: 1 },
        { transform: `translate(${(o - 2) * 9 + (o % 2 ? 11 : -8)}vw,${7 + o * 6}vh) rotate(${(o - 2) * 12}deg)`, opacity: 0 }
      ], { duration: t - o * 9, delay: o * 9, easing: "cubic-bezier(.55,.04,.89,.54)", fill: "both" }));
    }
    i.style.visibility = "hidden";
  }
  return a.push(e.animate([{ opacity: 1 }, { opacity: 1, offset: 0.61 }, { opacity: 0 }], { duration: t, fill: "both" })), a;
}
const ae = "manga-overdrive", Ue = "#ec2846";
function ia(e) {
  return `<svg class="hcci-manga-ink" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
    <g class="hcci-manga-page">
      <path class="hcci-manga-paper" d="M0 0h1000v600H0Z"/>
      <path class="hcci-manga-black" d="M0 0h288l86 132-131-70 69 105-117-54 45 63-157-37 71 65L0 169Zm1000 0v213l-155 12 57-68-119 18 86-69-166 43L813 0ZM0 600V365l170-30-64 71 139-38-65 85 112-45-84 192Zm1000 0H742l-97-144 122 39-52-79 133 39-67-75 134 28-47-59 132 15Z"/>
      <path class="hcci-manga-black" d="M0 226l362-6-179 27L0 249Zm0 31 299 4L0 270Zm0 53 331-32L0 332Zm1000-73-294 17 294-3Zm0 19-362 24 362-14Zm0 40-321-5 321 21ZM322 0l110 160L362 0Zm97 0 38 111L438 0Zm144 0-42 144L587 0Zm92 0L553 178 703 0ZM312 600l129-181-94 181Zm99 0 53-154-27 154Zm89 0 8-158 22 158Zm134 0-78-169 113 169Z"/>
      <path class="hcci-manga-black" d="M53 151c26-12 67-8 91 3l61 29-58-15c-26-7-32 3-56-4-16-5-22-14-38-13Zm879 247c-22 7-24 19-54 21l-77-21 61 37c21 11 33 5 51-4l33-20ZM211 121c10 2 21 12 25 21-14 1-21-8-25-21Zm570 346c-8-5-12-15-9-21 10 4 18 16 9 21Z"/>
      <path class="hcci-manga-accent" d="m23 186 222 29-124-31Zm45 191 139-57-62 45ZM726 146l114-89-68 78ZM825 357l143-25-72 26Z"/>
      ${e === "low" ? "" : '<path class="hcci-manga-black" d="m272 204 29 5 20 17-28-3Zm383-59 8-31 28-22-17 35ZM247 365l40-23-10 25-30 9Zm544-38 32-7 26 17-41-2ZM401 434l21-38-1 30-10 19Z"/>'}
      <path class="hcci-manga-black hcci-manga-reveal-lines" d="m0 197 302 19L0 204Zm0 154 285-34L0 359ZM1000 218l-268 14 268-6Zm0 126-281-32 281 24ZM374 0l71 150L389 0Zm260 600-56-151 72 151Z"/>
    </g>
    <g class="hcci-manga-impact">
      <path class="hcci-manga-accent" d="M0 0h1000v600H0Z"/>
      <path class="hcci-manga-black" d="M0 0h207l57 55-83-9 67 75-93-29 32 53L0 114Zm1000 0v128l-221 91 104-96-77 16 78-75-100 37L865 0ZM0 600V471l174-75-44 61 118-60-55 72 89-36-70 83 59-18-93 102Zm1000 0H754l-60-60 80 21-62-67 93 17-47-63 104 30-50-64 188 37Z"/>
      <path class="hcci-manga-paper" d="M0 110l249 47-105-42 240 55L196 91l251 68L269 42l220 99-58-92 116 97 105-113-30 92 191-85-98 94 196-61-99 91 188-46-180 94 180-15-203 56 203 19-230 17 230 62-250-21 250 107-264-57 112 78-173-61 110 109-201-77 30 81-100-81-127 94 57-100-218 83 106-116L98 520l92-88L0 499l189-110L0 421l171-83L0 367l195-63L0 302l207-39L0 244l225-21L0 178l245 19Z"/>
      <path class="hcci-manga-black" d="M0 155l203 43L0 169Zm0 228 209-51L0 397Zm82 217 203-145-175 145Zm918-406-203 61 203-45Zm0 182-173-37 173 51Zm0 126-181-82 181 103ZM565 0l-35 131L582 0Z"/>
      <path class="hcci-manga-accent" d="m82 115 33 6 53 38-34-7Zm658-35 19-33 40-23-24 35ZM144 488l52-43-10 30-36 27Zm730-108 48 3 49 34-35-5Z"/>
    </g>
  </svg>
  <svg class="hcci-manga-exit-ink" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
    <path class="hcci-manga-exit" d="M-130-85H715L625 0l42 14-113 45 35 27-98 45 42 28-128 65 28 30-86 40 35 23-95 62 22 25-107 68 28 15-118 90 32 18-124 78h-214Z"/>
    <path class="hcci-manga-exit" d="M1130 685H175l97-81-37-21 109-48-30-25 112-67-43-23 112-50-34-32 107-52-39-29 102-48-27-26 123-58-24-20 92-66-26-18L941-60h189Z"/>
  </svg>
  <div class="hcci-manga-flash"></div>`;
}
const g = { blackout: 0, ink: 80, silhouette: 180, halftone: 320, impact: 520, hold: 760 }, oe = "cubic-bezier(.12,.76,.18,1)", _ = "steps(1, end)", na = "grayscale(1) brightness(.40) contrast(1.8)", ra = "grayscale(1) contrast(1.55)";
function oa(e, t) {
  const a = [];
  if (!e.classList.contains("hcci-motion-full") || !e.animate) return { animations: a, audioDelay: 0 };
  const i = Math.min(1, (t - 160) / g.hold), n = (o, s, c, u, f = "linear") => {
    for (const h of e.querySelectorAll(o))
      a.push(h.animate(s, { delay: c * i, duration: (u - c) * i, easing: f, fill: "both" }));
  }, r = (o) => o / g.impact;
  return n(".hcci-manga-page", [
    { opacity: 0, transform: "scale(.65)", easing: _ },
    { opacity: 1, transform: "scale(.73)", offset: r(g.ink), easing: oe },
    { opacity: 1, transform: "scale(1.03)", offset: r(g.silhouette) },
    { opacity: 1, transform: "scale(1)", offset: r(g.halftone), easing: _ },
    { opacity: 0, transform: "scale(1)" }
  ], g.blackout, g.impact), n(".hcci-manga-panel-glint", [
    { opacity: 0, transform: "scaleX(.1)" },
    { opacity: 1, transform: "scaleX(1)", offset: 0.32, easing: _ },
    { opacity: 0, transform: "scaleX(1)" }
  ], 19, g.ink), n(".hcci-visual", [
    { opacity: 1, transform: "none", easing: _ },
    { opacity: 0, transform: "none", offset: g.ink / g.hold, easing: _ },
    { opacity: 1, transform: "translate(-16vw, 4vh) rotate(-12deg) scale(.84)", offset: g.silhouette / g.hold, easing: oe },
    { opacity: 1, transform: "translate(1.2vw,-.6vh) rotate(2deg) scale(.94)", offset: 255 / g.hold },
    { opacity: 1, transform: "scale(.92)", offset: g.halftone / g.hold, easing: oe },
    { opacity: 1, transform: "translate(-.3vw,.15vh) scale(.96)", offset: 352 / g.hold, easing: oe },
    { opacity: 1, transform: "none", offset: g.impact / g.hold },
    { opacity: 1, transform: "none" }
  ], g.blackout, g.hold), n(".hcci-portrait-frame", [
    { opacity: 0.065, easing: _ },
    { opacity: 1 }
  ], g.blackout, g.silhouette), n(".hcci-manga-artwork", [
    { filter: "brightness(.16)", easing: _ },
    { filter: na, offset: r(g.silhouette), easing: _ },
    { filter: ra, offset: r(g.halftone), easing: _ },
    { filter: "none" }
  ], g.blackout, g.impact), n(".hcci-manga-reveal-lines", [
    { opacity: 0, easing: _ },
    { opacity: 1 }
  ], g.blackout, g.halftone), n(".hcci-manga-dots", [
    { opacity: 0, easing: _ },
    { opacity: 0.27, offset: r(g.halftone), easing: _ },
    { opacity: 0 }
  ], g.blackout, g.impact), n(".hcci-manga-impact", [
    { opacity: 0, easing: _ },
    { opacity: 1, offset: 0.01, transform: "scale(1.06)", easing: _ },
    { opacity: 1, transform: "scale(1.06)", offset: 0.29, easing: oe },
    { opacity: 1, transform: "scale(1)" }
  ], g.impact, g.hold), n(".hcci-copy", [
    { opacity: 0, transform: "translate(12vw, -4vh) rotate(4deg) scale(1.16)" },
    { opacity: 1, transform: "translate(-.8vw, .4vh) rotate(-6deg) scale(1.035)", offset: 0.31, easing: _ },
    { opacity: 1, transform: "translate(-.8vw, .4vh) rotate(-6deg) scale(1.035)", offset: 0.48, easing: oe },
    { opacity: 1, transform: "rotate(-4deg)" }
  ], g.impact, g.hold, oe), n(".hcci-manga-flash", [
    { opacity: 0 },
    { opacity: "var(--flash-peak, .14)", offset: 0.1 },
    { opacity: 0 }
  ], g.impact, g.impact + 38), n(".hcci-stage", [
    { transform: "none" },
    { transform: "translateX(var(--hcci-shake))", offset: 0.18 },
    { transform: "translateX(calc(-.5 * var(--hcci-shake)))", offset: 0.44 },
    { transform: "none" }
  ], g.impact, g.impact + 66), { animations: a, audioDelay: g.impact * i };
}
function sa(e, t) {
  return !e.classList.contains("hcci-motion-full") || !e.animate ? [] : Array.from(e.querySelectorAll(".hcci-manga-exit"), (a, i) => a.animate([
    { transform: i === 0 ? "translate(-85%, -36%)" : "translate(85%, 36%)", opacity: 1 },
    { transform: i === 0 ? "translate(11%, 7%)" : "translate(-11%, -7%)", opacity: 1 }
  ], { duration: t - i * 17, delay: i * 17, easing: "cubic-bezier(.48,.05,.82,.71)", fill: "both" }));
}
function ca(e) {
  return `<svg class="hcci-rift-geometry" viewBox="0 0 960 540" preserveAspectRatio="none" aria-hidden="true">
    <g class="hcci-rift-plate hcci-rift-upper">
      <path class="hcci-rift-metal" d="M-165-8H970V77L901 107 865 108 852 129 780 151 742 174 722 169 692 194 639 202 600 234 567 231 535 260 482 278 458 276 437 302 363 323 337 347 304 343 253 382 219 382 198 404 158 410 111 442 79 437 51 460-8 480-165 534Z"/>
      <path class="hcci-rift-facet" d="M0 63 344 0H680L531 57 462 60 386 102 300 111 0 266ZM960 0v43L713 128l-55 5-110 55-110 19 148-91 96-33 62-34Z"/>
      <path class="hcci-rift-score" d="M0 304 247 213l78-5 68-43 81-21 33-22M620 166l81-42 84-26 60-37 115-29M45 386l91-31 46-41 33-9m-92 77 16-8m30-14 23-14m21-12 28-12"/>
      <path class="hcci-rift-edge" d="M-165 534-8 480 51 460 79 437 111 442 158 410 198 404 219 382 253 382 304 343 337 347 363 323 437 302 458 276 482 278 535 260 567 231 600 234 639 202 692 194 722 169 742 174 780 151 852 129 865 108 901 107 970 77 1115 24"/>
      <path class="hcci-rift-edge-light" d="m79 437 32 5 47-32 40-6m139-57 26-24 74-21 21-26 24 2m210-84 30-25 20 5 38-23"/>
    </g>
    <g class="hcci-rift-plate hcci-rift-lower">
      <path class="hcci-rift-metal" d="M-165 534-8 480 51 460 79 437 111 442 158 410 198 404 219 382 253 382 304 343 337 347 363 323 437 302 458 276 482 278 535 260 567 231 600 234 639 202 692 194 722 169 742 174 780 151 852 129 865 108 901 107 970 77 1115 24V550H-165Z"/>
      <path class="hcci-rift-facet" d="M0 540v-19l151-62 45-5 121-71 84-16-95 62-53 10-114 101Zm960-313v159L602 522l-161 18h-94l180-78 81-9 97-65 80-27Z"/>
      <path class="hcci-rift-score" d="M301 514l134-65 89-24 52-43 63-19M648 330l53-24 72-56 38-4 92-52m-30 68 15-9m12-7 25-13m10-8 25-16"/>
      <path class="hcci-rift-edge" d="M-165 534-8 480 51 460 79 437 111 442 158 410 198 404 219 382 253 382 304 343 337 347 363 323 437 302 458 276 482 278 535 260 567 231 600 234 639 202 692 194 722 169 742 174 780 151 852 129 865 108 901 107 970 77 1115 24"/>
      <path class="hcci-rift-edge-light" d="m219 382 34 0 51-39 33 4m145-69 53-18 32-29 33 3 39-32m141-51 72-22 13-21 36-1"/>
    </g>
    <g class="hcci-rift-slash">
      <path class="hcci-rift-trail" d="M-20 506 141 453 255 390 327 376 441 303 528 288 630 228 743 196 880 126 984 89 875 147 751 214 624 253 551 298 439 332 340 391 259 413 144 472Z"/>
      <path d="M-25 495 77 451 116 453 207 392 249 388 307 346 343 350 383 316 442 302 479 268 510 274 561 232 609 231 655 199 723 174 750 178 799 144 861 128 884 109 986 74 929 116 861 145 825 172 759 182 706 221 661 219 607 262 578 254 534 293 489 296 444 328 401 330 344 376 309 369 242 415 195 420 149 448 108 464Z"/>
      <path class="hcci-rift-white" d="M41 468 115 453 207 392 249 388 307 346 343 350 383 316 442 302 479 268 510 274 561 232 609 231 655 199 723 174 750 178 799 144 861 128 884 109 977 77 887 116 866 137 803 153 752 187 724 183 659 209 611 242 565 241 514 283 482 277 446 311 390 323 345 358 309 355 251 396 208 401 119 459Z"/>
    </g>
    ${e === "low" ? "" : `
    <g class="hcci-rift-splinters hcci-rift-splinters-top">
      <path d="m218 368 56-28-26 35Zm251-67 32-35-13 33Zm244-124 30-20-9 28Z"/>
      <path class="hcci-rift-white" d="m389 305 24-12-17 19Zm167-69 20-7-14 14Z"/>
    </g>
    <g class="hcci-rift-splinters hcci-rift-splinters-bottom">
      <path d="m247 439 48-27-27 34Zm262-95 50-27-32 35Zm185-95 24-15-11 23Z"/>
      <path class="hcci-rift-white" d="m345 398 23-12-12 16Zm268-105 31-12-24 20Z"/>
    </g>`}
  </svg>`;
}
const O = {
  anticipation: 0,
  slash: 100,
  rupture: 245,
  reveal: 402,
  title: 505,
  hold: 695
}, la = "cubic-bezier(.68,0,.88,.45)", ke = "cubic-bezier(.12,.78,.24,1)", it = "cubic-bezier(.15,.78,.18,1)", ua = "cubic-bezier(.62,.02,.86,.45)";
function ge(e) {
  const t = 91 - 0.74 * e;
  return `polygon(-10% 0, ${e - 12}% 0, ${e - 11}% ${t - 6}%, ${e}% ${t}%, ${e - 12}% ${t + 8}%, ${e - 15}% 100%, -10% 100%) view-box`;
}
function da(e, t) {
  const a = [];
  if (!e.classList.contains("hcci-motion-full") || !e.animate)
    return { animations: a, audioDelay: 0 };
  const i = Math.min(1, (t - 100) / O.hold), n = (r, o, s, c, u = "linear") => {
    for (const f of e.querySelectorAll(r))
      a.push(f.animate(o, {
        delay: s * i,
        duration: (c - s) * i,
        easing: u,
        fill: "both"
      }));
  };
  return n(".hcci-rift-geometry", [{ opacity: 0.62 }, { opacity: 1 }], O.anticipation, O.slash), n(".hcci-rift-edge, .hcci-rift-edge-light", [{ opacity: 0 }, { opacity: 1 }], O.slash + 82, O.rupture), n(".hcci-rift-upper", [{ transform: "none" }, { transform: "translate(8vw, -38vh) rotate(-3deg)" }], O.rupture, 535, ke), n(".hcci-rift-lower", [{ transform: "none" }, { transform: "translate(-5vw, 40vh) rotate(-2deg)" }], O.rupture + 18, 585, ke), n(".hcci-rift-slash", [
    { clipPath: ge(1), opacity: 0.28 },
    { clipPath: ge(13), opacity: 0.65, offset: 0.21, easing: la },
    { clipPath: ge(126), opacity: 1, offset: 0.62 },
    { clipPath: ge(126), opacity: 0.76, offset: 0.72 },
    { clipPath: ge(126), opacity: 0 }
  ], O.anticipation, 340), n(".hcci-rift-splinters-top", [
    { opacity: 0 },
    { opacity: 1, offset: 0.025 },
    { opacity: 0, transform: "translate(6vw, -16vh) rotate(5deg)" }
  ], O.rupture, 465, ke), n(".hcci-rift-splinters-bottom", [
    { opacity: 0 },
    { opacity: 1, offset: 0.025 },
    { opacity: 0, transform: "translate(-4vw, 12vh) rotate(-4deg)" }
  ], O.rupture + 15, 485, ke), n(".hcci-visual", [
    { transform: "translate(-6vw, 5vh) rotate(-5deg)", opacity: 0 },
    { transform: "translate(1.2vw, -1vh) rotate(1deg)", opacity: 1, offset: 0.58, easing: "steps(1, end)" },
    { transform: "translate(1.2vw, -1vh) rotate(1deg)", opacity: 1, offset: 0.69 },
    { transform: "none", opacity: 1 }
  ], O.reveal, 625, it), n(".hcci-copy", [
    { opacity: 0, transform: "translate(8vw, -3vh) skewX(-12deg)" },
    { opacity: 1, transform: "translate(-1vw, .5vh) skewX(2deg)", offset: 0.6 },
    { opacity: 1, transform: "none" }
  ], O.title, O.hold, it), n(".hcci-rift-flash", [
    { opacity: 0 },
    { opacity: "var(--flash-peak, .14)", offset: 0.08 },
    { opacity: 0 }
  ], O.slash + 82, O.rupture + 33), n(".hcci-stage", [
    { transform: "none" },
    { transform: "translateX(var(--hcci-shake))", offset: 0.28 },
    { transform: "translateX(calc(-.5 * var(--hcci-shake)))", offset: 0.58 },
    { transform: "none" }
  ], O.title + 38, 640), { animations: a, audioDelay: O.slash * i };
}
function fa(e, t) {
  if (!e.classList.contains("hcci-motion-full") || !e.animate) return [];
  const a = [];
  for (const [i, n] of [
    [".hcci-visual", "translate(62vw, -43vh) rotate(-9deg)"],
    [".hcci-copy", "translate(75vw, -40vh) skewX(-12deg)"],
    [".hcci-rift-upper", "translate(20vw, -105vh) rotate(-6deg)"],
    [".hcci-rift-lower", "translate(-24vw, 100vh) rotate(-5deg)"]
  ]) {
    const r = e.querySelector(i);
    r && a.push(r.animate([{ transform: n }], { duration: t, easing: ua, fill: "forwards" }));
  }
  return a;
}
const We = [
  { id: "strike", label: "Neon Strike", description: "A diagonal energy slash, speed trails and an impact wave.", shake: 0.7 },
  { id: "breach", label: "Panel Breach", description: "An energized seam opens to reveal the portrait between blast doors.", shake: 0.5 },
  { id: "signal", label: "Signal Bloom", description: "A holographic portrait resolves inside a precision targeting array.", shake: 0.15 },
  { id: "rift", label: "Rift Slash", description: "A jagged energy blade tears through armored plates and reveals the character.", shake: 0.4 },
  { id: "shatter", label: "Quantum Shatter", description: "Prismatic shards assemble around the portrait, then scatter into light.", shake: 0.65 },
  { id: "reactor", label: "Reactor Surge", description: "Charging rails ignite a vertical plasma column and overcharge halo.", shake: 0.85 },
  { id: "void", label: "Void Collapse", description: "An accretion disk contracts into an eclipse before releasing the portrait.", shake: 0.4 },
  { id: "railgun", label: "Railgun Salvo", description: "Targeting rails converge into a horizontal lance with a ballistic reveal.", shake: 1 },
  { id: "eclipse", label: "Astral Eclipse", description: "An orbital crown and star field frame a slow celestial reveal.", shake: 0 },
  { id: ae, label: "Manga Overdrive", description: "A burst of ink cuts to a halftone portrait and a full-color manga impact.", shake: 0.7 },
  { id: me, label: "Shattered Fate", description: "The portrait breaks into eighteen shards, exposing a fractured title behind it.", shake: 0.65 },
  { id: "overdrive", label: "Cyber Overdrive", description: "A perspective data tunnel accelerates into a segmented hologram.", shake: 0.45 }
];
function Ie(e) {
  var t;
  return ((t = We.find((a) => a.id === e)) == null ? void 0 : t.id) ?? "strike";
}
function Le(e) {
  return We.find((t) => t.id === Ie(e));
}
const E = (e, t = 1) => Array.from({ length: t }, (a, i) => `<i class="hcci-fx hcci-fx-${e}" style="--i:${i};--n:${t};--v:${i % 4};--d:${i % 5};--s:${i % 3}"></i>`).join("");
function ha(e, t = "standard") {
  const a = Ie(e), i = t === "low" ? 8 : t === "high" ? 28 : 16, n = E("particle", i), r = E("wave", 2);
  switch (a) {
    case "strike":
      return E("slash", 2) + E("speed", 7) + r + n;
    case "breach":
      return '<div class="hcci-tear hcci-tear-top"><span></span></div><div class="hcci-tear hcci-tear-bottom"><span></span></div>' + E("door", 2) + n;
    case "signal":
      return E("reticle", 3) + E("tick", 12) + E("sweep") + r;
    case me:
      return Qt();
    case ae:
      return ia(t);
    case "rift":
      return ca(t);
    case "shatter":
      return E("shard", i) + E("prism", 2) + r;
    case "reactor":
      return E("rail", 6) + E("column") + E("corona", 2) + n;
    case "void":
      return E("disk", 2) + E("horizon") + E("infall", i) + r;
    case "railgun":
      return E("sight", 4) + E("lance") + E("wake", 7) + n;
    case "eclipse":
      return E("moon") + E("crown", 2) + E("star", i) + E("orbit", 3);
    case "overdrive":
      return E("gate", 5) + E("data", i) + E("sweep") + r;
  }
}
const fe = [], ye = /* @__PURE__ */ new Set();
let Ee = !1;
function ve(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML.replace(/"/g, "&quot;");
}
function ma(e) {
  var a, i, n, r, o;
  if (!e.preview && m(d.suppressCutins) === !0 || e != null && e.blind && !((a = game.user) != null && a.isGM) || Array.isArray(e == null ? void 0 : e.whisper) && e.whisper.length && !e.whisper.includes((i = game.user) == null ? void 0 : i.id) && !((n = game.user) != null && n.isGM))
    return !1;
  const t = (e == null ? void 0 : e.audience) ?? m(d.audience);
  return t === te.everyone ? !0 : t === te.gm ? ((r = game.user) == null ? void 0 : r.isGM) === !0 : t === te.triggeringPlayer ? ((o = game.user) == null ? void 0 : o.id) === (e == null ? void 0 : e.userId) : !0;
}
async function pa(e, t) {
  var a, i;
  if (e)
    try {
      const n = Math.min(1, Math.max(0, Number(t ?? m(d.volume) ?? 0.8))), r = Math.min(1, Math.max(0, Number(m(d.localVolume) ?? 1))), o = n * r;
      if ((i = (a = foundry.audio) == null ? void 0 : a.AudioHelper) != null && i.play)
        return foundry.audio.AudioHelper.play({ src: e, volume: o, autoplay: !0, loop: !1 }, !1);
      const s = globalThis.AudioHelper;
      if (s != null && s.play)
        return s.play({ src: e, volume: o, autoplay: !0, loop: !1 }, !1);
      const c = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), u = new Audio(e);
      return u.volume = o * c, await u.play(), u;
    } catch (n) {
      return pe("Audio playback failed.", { src: e, error: n }), null;
    }
}
function He(e) {
  try {
    if (!e) return;
    if (typeof e.stop == "function") {
      e.stop();
      return;
    }
    typeof e.pause == "function" && (e.pause(), e.currentTime = 0);
  } catch (t) {
    pe("Audio stop failed.", t);
  }
}
function ga(e) {
  var j, K;
  const t = Le(e.animationStyle), a = t.id, i = e.triggerKind === "failure" ? "failure" : "success", n = a === "rift", r = a === ae, o = a === me, s = n || r || o, c = e.accentColor || (r ? Ue : (n || o) && i === "failure" ? "#ff4d7d" : "#69e8ff"), u = e.imagePath ? `<img class="hcci-portrait" src="${ve(e.imagePath)}" alt="">` : '<div class="hcci-portrait hcci-portrait-fallback"><i class="fa-solid fa-user-astronaut"></i></div>', f = Math.max(1, String(e.overlayText ?? "").length), h = String(e.overlayText ?? "").trim().split(/\s+/), b = o && h.length > 1 ? `${ve(h.slice(0, -1).join(" "))} <span>${ve(h.at(-1))}</span>` : ve(e.overlayText), M = e.textEnabled && e.overlayText ? `<div class="hcci-title" style="--hcci-title-chars: ${f}">${b}</div>` : "", x = e.actorName || "", $ = String(m(d.motionMode) ?? "system"), k = ((K = (j = globalThis.matchMedia) == null ? void 0 : j.call(globalThis, "(prefers-reduced-motion: reduce)")) == null ? void 0 : K.matches) === !0, S = $ === "system" || s && k && $ === "full" ? k ? "reduced" : "full" : ["full", "reduced", "still"].includes($) ? $ : "full", L = String(m(d.flashMode) ?? "soft"), q = ["full", "soft", "off"].includes(L) ? L : "soft", F = m(d.effectIntensity), A = ["low", "standard", "high"].includes(F) ? F : "standard", I = document.createElement("div");
  I.className = `hcci-overlay hcci-style-${a} hcci-kind-${i} hcci-motion-${S} hcci-flash-${q} hcci-detail-${A}`, I.style.setProperty("--hcci-accent", c);
  const ie = m(d.animationFont);
  I.style.setProperty("--hcci-font", ie === "classic" ? '"Orbitron", "Eurostile", "Agency FB", Impact, sans-serif' : '"HCCI AICON", "Orbitron", sans-serif');
  const z = Number(m(d.shakeIntensity) ?? 0.5);
  I.style.setProperty("--hcci-shake", `${t.shake * (Number.isFinite(z) ? Math.max(0, Math.min(1, z)) : 0.5) * 9}px`), I.setAttribute("aria-hidden", "true");
  const Q = S === "full" || r ? ha(a, A) : "";
  I.innerHTML = `
    ${r || o ? "" : `<div class="${n ? "hcci-rift-flash" : "hcci-flash"}"></div>`}
    ${s ? Q : ""}
    <div class="hcci-atmosphere"></div>
    <section class="hcci-stage">
      <div class="hcci-visual">
      <div class="hcci-effects">${s ? "" : Q}</div>
      <div class="hcci-portrait-frame">
        ${r ? `<div class="hcci-manga-artwork">${u}</div><div class="hcci-manga-dots"></div>` : u}
      </div>
      ${r ? '<div class="hcci-manga-panel-glint"></div>' : ""}
      <div class="hcci-frame-accent"></div>
      </div>
      <div class="hcci-copy">
        ${M}
        ${x ? `<div class="hcci-subtitle">${ve(x)}</div>` : ""}
      </div>
    </section>
  `;
  const Y = o && S === "full";
  Y && Fe(I);
  const N = I.querySelector("img.hcci-portrait");
  if (N && S === "full" && (a === "shatter" || a === "overdrive")) {
    const G = [
      "polygon(0 0,50% 0,50% 50%)",
      "polygon(50% 0,100% 0,50% 50%)",
      "polygon(100% 0,100% 100%,50% 50%)",
      "polygon(100% 100%,50% 100%,50% 50%)",
      "polygon(50% 100%,0 100%,50% 50%)",
      "polygon(0 100%,0 0,50% 50%)"
    ];
    for (let Z = 0; Z < 6; Z++) {
      const D = document.createElement("div");
      D.className = "hcci-portrait-echo", D.style.setProperty("--piece", String(Z)), D.style.setProperty("--dx", `${Z % 2 ? 1 : -1}`), D.style.setProperty("--dy", `${Z < 3 ? -1 : 1}`), D.style.clipPath = a === "shatter" ? G[Z] : `inset(${Z * 100 / 6}% 0 ${100 - (Z + 1) * 100 / 6}% 0)`;
      const B = N.cloneNode();
      B.className = "", D.appendChild(B), I.querySelector(".hcci-visual").appendChild(D);
    }
  }
  return N == null || N.addEventListener("error", () => {
    const G = e.preview ? e.fallbackImagePath : void 0;
    if (G && N.getAttribute("src") !== G) {
      N.src = G, I.querySelectorAll(".hcci-portrait-echo img").forEach((D) => {
        D.src = G;
      }), Y && Fe(I);
      return;
    }
    I.querySelectorAll(".hcci-portrait-echo").forEach((D) => D.remove());
    const Z = document.createElement("div");
    Z.className = "hcci-portrait hcci-portrait-fallback", Z.innerHTML = '<i class="fa-solid fa-user-astronaut"></i>', N.replaceWith(Z), Y && Fe(I);
  }), I;
}
async function ya(e) {
  if (!ma(e)) return;
  const t = Number(e.duration ?? m(d.duration) ?? 2500), a = Math.min(8e3, Math.max(800, Number.isFinite(t) ? t : 2500)), i = ga(e);
  i.style.setProperty("--hcci-duration", `${a}ms`), i.style.setProperty("--hcci-intro", `${Math.min(1e3, (a - 180) * 0.85)}ms`);
  let n = !1, r, o, s, c = [], u;
  try {
    document.body.appendChild(i);
    const f = i.classList.contains(`hcci-style-${me}`), h = f ? Jt : 180, b = a - h, M = i.classList.contains("hcci-style-rift"), x = i.classList.contains(`hcci-style-${ae}`), $ = f ? ta(i, b) : x ? oa(i, b) : M ? da(i, b) : void 0;
    $ && (c = $.animations);
    const k = () => {
      pa(e.audioPath, e.volume).then((S) => {
        n ? He(S) : r = S;
      });
    };
    e.audioPath && ($ != null && $.audioDelay) ? s = window.setTimeout(k, $.audioDelay) : k(), await new Promise((S) => {
      o = window.setTimeout(L, b);
      function L() {
        window.clearTimeout(o), globalThis.removeEventListener("keydown", u), S();
      }
      u = (q) => {
        q.key === "Escape" && L();
      }, globalThis.addEventListener("keydown", u);
    }), n = !0, window.clearTimeout(s), He(r), r = null, i.classList.add("hcci-exiting"), f ? c.push(...aa(i, h)) : x ? c.push(...sa(i, h)) : M && c.push(...fa(i, h)), await new Promise((S) => window.setTimeout(S, h));
  } finally {
    n = !0, window.clearTimeout(o), window.clearTimeout(s), c.forEach((f) => f.cancel()), u && globalThis.removeEventListener("keydown", u), He(r), i.remove();
  }
}
async function va(e) {
  var t, a;
  return !((t = game.user) != null && t.isGM) || Ee ? !1 : (await ue({
    ...e,
    id: foundry.utils.randomID(),
    userId: ((a = game.user) == null ? void 0 : a.id) ?? null,
    audience: te.gm,
    preview: !0
  }), !0);
}
async function ba() {
  if (!Ee) {
    Ee = !0;
    try {
      for (; fe.length; ) {
        const e = fe.shift();
        try {
          await ya(e);
        } catch (t) {
          pe("Cut-in playback failed; continuing queue.", t);
        }
      }
    } finally {
      Ee = !1;
    }
  }
}
function ue(e) {
  if (e) {
    if (e.id) {
      if (ye.has(e.id)) return;
      ye.add(e.id);
      const t = ye.values().next().value;
      ye.size > 100 && t && ye.delete(t);
    }
    return fe.push(e), fe.length > 3 && fe.splice(1, fe.length - 3), ba();
  }
}
const se = /* @__PURE__ */ new Set(), je = /* @__PURE__ */ new Set();
function wa(e) {
  return !!(e != null && e.id) && je.has(e.id);
}
function V(e) {
  return e ? Array.isArray(e) ? e : [e] : [];
}
function Ca(e) {
  var i, n, r, o;
  const t = [
    ...V(e == null ? void 0 : e.rolls),
    ...V(e == null ? void 0 : e.roll),
    ...V(e == null ? void 0 : e._rolls),
    ...V((n = (i = e == null ? void 0 : e.flags) == null ? void 0 : i.dnd5e) == null ? void 0 : n.roll),
    ...V((o = (r = e == null ? void 0 : e.flags) == null ? void 0 : r.dnd5e) == null ? void 0 : o.rolls)
  ], a = /* @__PURE__ */ new Set();
  return t.filter((s) => !s || a.has(s) ? !1 : (a.add(s), !0));
}
function Ma(e) {
  const t = [], a = [...V(e == null ? void 0 : e.terms), ...V(e == null ? void 0 : e.dice), ...V(e == null ? void 0 : e._terms), ...V(e == null ? void 0 : e._dice)], i = /* @__PURE__ */ new Set();
  for (; a.length; ) {
    const n = a.shift();
    !n || i.has(n) || (i.add(n), t.push(n), a.push(
      ...V(n.terms),
      ...V(n.dice),
      ...V(n.rolls),
      ...V(n._terms),
      ...V(n._dice)
    ));
  }
  return t;
}
function Mt(e, t) {
  var r, o, s, c, u, f, h, b;
  const a = (e == null ? void 0 : e.flags) ?? {}, i = ((o = (r = a.dnd5e) == null ? void 0 : r.roll) == null ? void 0 : o.type) ?? ((c = (s = a.dnd5e) == null ? void 0 : s.roll) == null ? void 0 : c.rollType), n = (f = (u = a.pf2e) == null ? void 0 : u.context) == null ? void 0 : f.type;
  return [(h = t == null ? void 0 : t.options) == null ? void 0 : h.type, (b = t == null ? void 0 : t.options) == null ? void 0 : b.rollType, i, n].some((M) => String(M ?? "").toLowerCase().includes("damage"));
}
function Ta(e) {
  const t = [];
  for (const a of Ma(e)) {
    const i = Number((a == null ? void 0 : a.faces) ?? (a == null ? void 0 : a._faces));
    if (!(i !== W() || !Array.isArray(a.results)))
      for (const n of a.results) {
        if (n.active === !1 || n.discarded === !0 || n.rerolled === !0) continue;
        const r = Number(n.result ?? n.value ?? n.total);
        Number.isInteger(r) && r >= 1 && r <= i && t.push(r);
      }
  }
  return t;
}
function Sa(e) {
  return e ? e instanceof HTMLElement ? e : e[0] instanceof HTMLElement ? e[0] : null : null;
}
function ka(e) {
  var o;
  const t = Sa(e);
  if (!t) return [];
  const a = [], i = `d${W()}`, n = [
    `.dice-rolls .roll.${i}`,
    `.dice-rolls .roll.die.${i}`,
    `.dice-tooltip .roll.${i}`,
    `.dice-tooltip .dice.${i} .roll`
  ], r = /* @__PURE__ */ new Set();
  for (const s of n)
    t.querySelectorAll(s).forEach((c) => r.add(c));
  for (const s of r) {
    if (s.classList.contains("discarded") || s.classList.contains("rerolled") || s.classList.contains("ignored") || s.classList.contains("inactive"))
      continue;
    const c = Number((o = s.textContent) == null ? void 0 : o.trim());
    Number.isInteger(c) && c >= 1 && c <= W() && a.push(c);
  }
  return a;
}
function Tt(e, t) {
  return `${e}:${t}`;
}
function Aa() {
  return Tt("gm", "default");
}
function Ea(e) {
  return Ie(e);
}
function St(e, t) {
  var i, n, r, o;
  if (!e || !t) return !1;
  const a = ((n = (i = globalThis.CONST) == null ? void 0 : i.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : n.OWNER) ?? 3;
  return Number(((r = e.ownership) == null ? void 0 : r[t]) ?? ((o = e.ownership) == null ? void 0 : o.default) ?? 0) >= a;
}
function kt(e) {
  var a;
  const t = (e == null ? void 0 : e.speaker) ?? {};
  return t.actor ? ((a = game.actors) == null ? void 0 : a.get(t.actor)) ?? null : e != null && e.actor ? e.actor : null;
}
function La(e) {
  var i, n, r;
  const t = (e == null ? void 0 : e.author) ?? (e == null ? void 0 : e.user);
  if (t && typeof t == "object") return t.id ? ((i = game.users) == null ? void 0 : i.get(t.id)) ?? t : null;
  const a = t ?? ((n = e == null ? void 0 : e._source) == null ? void 0 : n.author) ?? (e == null ? void 0 : e.userId);
  return a ? ((r = game.users) == null ? void 0 : r.get(a)) ?? null : null;
}
function At(e, t) {
  var i;
  const a = La(e);
  if (a && !a.isGM) return a;
  if (t) {
    const n = (i = game.users) == null ? void 0 : i.find((r) => !r.isGM && St(t, r.id));
    if (n) return n;
  }
  return a ?? null;
}
function nt(e = {}, t, a, i = !1) {
  const n = t === "failure" ? mt() : Ke(), r = m(t === "failure" ? d.defaultFailureText : d.defaultText), o = t === "failure" ? e.failure ?? {} : e, s = Ea(o.animationStyle), c = s === ae ? Ue : t === "failure" ? "#ff4d7d" : "#69e8ff", u = Number(o.threshold);
  return {
    kind: t,
    enabled: o.enabled !== !1,
    threshold: Number.isInteger(u) && u >= 1 && u <= W() ? u : n,
    duration: we(o.duration) ?? m(d.duration),
    animationStyle: s,
    imagePath: (i ? a == null ? void 0 : a.img : "") || o.imagePath || (a == null ? void 0 : a.img) || "",
    audioPath: o.audioPath || "",
    overlayText: o.overlayText || r,
    accentColor: o.accentColor || c
  };
}
function Ce(e, t, a = "success") {
  const i = qe(), n = t ? i[Tt("actor", t.id)] : null, r = (e == null ? void 0 : e.isGM) === !0, o = r ? i[Aa()] : null;
  if (!t && !r && !n)
    return nt({ enabled: !1 }, a, t);
  const s = r && !n && !!(t != null && t.img);
  return nt(n ?? o ?? {}, a, t, s);
}
function Et(e, t, a, i, n) {
  return n.enabled ? {
    id: foundry.utils.randomID(),
    messageId: e.id,
    userId: (i == null ? void 0 : i.id) ?? null,
    actorId: (a == null ? void 0 : a.id) ?? null,
    userName: (i == null ? void 0 : i.name) ?? "",
    actorName: (a == null ? void 0 : a.name) ?? "",
    triggerKind: n.kind ?? "success",
    naturalResult: t,
    threshold: n.threshold,
    animationStyle: n.animationStyle,
    blind: e.blind === !0,
    whisper: Array.isArray(e.whisper) ? [...e.whisper] : [],
    imagePath: n.imagePath || "",
    audioPath: n.audioPath || "",
    overlayText: n.overlayText || "",
    accentColor: n.accentColor || "#69e8ff",
    textEnabled: m(d.textEnabled),
    duration: n.duration,
    volume: m(d.volume),
    audience: m(d.audience)
  } : (pe("Cut-in disabled for target.", { userId: i == null ? void 0 : i.id, actorId: a == null ? void 0 : a.id }), null);
}
function rt(e, t, a = "success") {
  const i = Ca(e);
  if (!(e != null && e.isRoll) && !i.length) return null;
  for (const n of i) {
    if (Mt(e, n)) continue;
    const r = Ta(n).find((o) => gt(o, t, a));
    if (r) return r;
  }
  return null;
}
function ot(e, t, a, i = "success") {
  const n = ka(t);
  return !n.length || Mt(e, {}) ? null : n.find((r) => gt(r, a, i)) ?? null;
}
function st() {
  var a, i;
  const t = (((a = game.users) == null ? void 0 : a.filter((n) => n.active && n.isGM)) ?? []).sort((n, r) => n.id.localeCompare(r.id))[0];
  return ((i = game.user) == null ? void 0 : i.isGM) && (!t || t.id === game.user.id);
}
function xe(e) {
  se.add(e);
  const t = se.values().next().value;
  se.size > 200 && t && se.delete(t);
}
function Lt(e) {
  var f, h, b;
  if (!(e != null && e.id) || (h = (f = e.flags) == null ? void 0 : f[p]) != null && h[Xe] || se.has(e.id)) return !0;
  const t = kt(e), a = At(e, t), i = Ce(a, t, "success"), n = Ce(a, t, "failure"), r = rt(e, n.threshold, "failure"), o = r ? null : rt(e, i.threshold, "success"), s = r ?? o;
  if (!s) return !1;
  const u = Et(e, s, t, a, r ? n : i);
  return u ? (xe(e.id), pe("Triggering cut-in.", u), (b = game.socket) == null || b.emit($e, { type: "play", payload: u }), ue(u), !0) : (xe(e.id), !0);
}
function xa(e, t) {
  var h, b, M;
  if (!(e != null && e.id) || (b = (h = e.flags) == null ? void 0 : h[p]) != null && b[Xe] || se.has(e.id)) return !0;
  const a = kt(e), i = At(e, a), n = Ce(i, a, "success"), r = Ce(i, a, "failure"), o = ot(e, t, r.threshold, "failure"), s = o ? null : ot(e, t, n.threshold, "success"), c = o ?? s;
  if (!c) return !1;
  const f = Et(e, c, a, i, o ? r : n);
  return f ? (xe(e.id), pe("Triggering cut-in from rendered chat card.", f), (M = game.socket) == null || M.emit($e, { type: "play", payload: f }), ue(f), !0) : (xe(e.id), !0);
}
function Ge(e, t) {
  e != null && e.id && globalThis.setTimeout(() => {
    var i;
    if (se.has(e.id)) return;
    const a = ((i = game.messages) == null ? void 0 : i.get(e.id)) ?? e;
    Lt(a);
  }, t);
}
function $a() {
  var t;
  je.clear();
  for (const a of game.messages ?? [])
    a != null && a.id && je.add(a.id);
  Hooks.on("createChatMessage", (a) => {
    m(d.enabled) && st() && (Lt(a) || (Ge(a, 100), Ge(a, 500), Ge(a, 1500)));
  });
  const e = (a, i) => {
    m(d.enabled) && (wa(a) || st() && xa(a, i));
  };
  Hooks.on("renderChatMessage", e), Hooks.on("renderChatMessageHTML", e), (t = game.socket) == null || t.on($e, (a) => {
    (a == null ? void 0 : a.type) === "play" && m(d.enabled) && ue(a.payload);
  });
}
function xt(e, t = {}) {
  var o, s;
  const a = (o = game.users) == null ? void 0 : o.get(e), i = t.actorId ? (s = game.actors) == null ? void 0 : s.get(t.actorId) : (a == null ? void 0 : a.character) ?? null, n = t.triggerKind === "failure" ? "failure" : "success", r = Ce(a, i, n);
  return {
    id: foundry.utils.randomID(),
    userId: e,
    actorId: (i == null ? void 0 : i.id) ?? null,
    userName: (a == null ? void 0 : a.name) ?? "",
    actorName: (i == null ? void 0 : i.name) ?? "",
    naturalResult: t.naturalResult ?? r.threshold,
    triggerKind: n,
    threshold: t.threshold ?? r.threshold ?? Ke(),
    animationStyle: t.animationStyle ?? r.animationStyle ?? "strike",
    imagePath: t.imagePath ?? r.imagePath ?? "",
    audioPath: t.audioPath ?? r.audioPath ?? "",
    overlayText: t.overlayText ?? r.overlayText ?? m(d.defaultText),
    accentColor: t.accentColor ?? r.accentColor ?? "#69e8ff",
    textEnabled: t.textEnabled ?? m(d.textEnabled),
    duration: t.duration ?? r.duration,
    volume: t.volume ?? m(d.volume),
    audience: t.audience ?? m(d.audience)
  };
}
function Pa(e, t = {}) {
  var n, r;
  const a = (n = game.actors) == null ? void 0 : n.get(e), i = ((r = game.users) == null ? void 0 : r.find((o) => !o.isGM && St(a, o.id))) ?? game.user;
  return xt(i == null ? void 0 : i.id, { ...t, actorId: e });
}
function ct(e) {
  var t;
  (t = game.socket) == null || t.emit($e, { type: "play", payload: e }), ue(e);
}
function $t() {
  var e, t, a;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : t.api) ?? ((a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.api) ?? null;
}
function Pt() {
  var e, t, a;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : t.api) ?? ((a = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : a.api) ?? null;
}
function Ia(e = {}, t = {}) {
  var i, n, r;
  const a = ((n = (i = globalThis.foundry) == null ? void 0 : i.utils) == null ? void 0 : n.mergeObject) ?? ((r = foundry == null ? void 0 : foundry.utils) == null ? void 0 : r.mergeObject);
  return typeof a == "function" ? a(e, t, { inplace: !1 }) : { ...e, ...t };
}
function Na() {
  var e, t, a, i, n;
  return ((a = (t = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : t.randomID) == null ? void 0 : a.call(t, 8)) ?? ((n = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.randomID) == null ? void 0 : n.call(i, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function lt(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${Na()}`),
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
function It(e) {
  return class extends e {
    constructor(i = {}) {
      const n = Ia(new.target.defaultOptions ?? {}, i);
      super(lt(n));
      de(this, "_v1Options");
      this._v1Options = n;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return lt(this.defaultOptions ?? {});
    }
    activateListeners(i) {
    }
    async _renderHTML(i, n) {
      var u, f, h;
      const r = typeof this.getData == "function" ? await this.getData() : {}, o = ((u = this._v1Options) == null ? void 0 : u.template) ?? ((f = this.options) == null ? void 0 : f.template) ?? ((h = this.constructor.defaultOptions) == null ? void 0 : h.template);
      if (!o) return document.createDocumentFragment();
      const s = await globalThis.renderTemplate(o, r), c = document.createElement("template");
      return c.innerHTML = s.trim(), c.content;
    }
    _activateV1Form(i) {
      var r, o;
      if (typeof this._updateObject != "function") return;
      const n = (r = i.matches) != null && r.call(i, "form") ? i : (o = i.querySelector) == null ? void 0 : o.call(i, "form");
      n instanceof HTMLFormElement && n.addEventListener("submit", async (s) => {
        var u;
        s.preventDefault(), s.stopPropagation();
        const c = new FormData(n);
        await this._updateObject(s, c), ((u = this._v1Options) == null ? void 0 : u.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(i, n, r) {
      var f, h, b, M;
      n.replaceChildren(i);
      const o = globalThis.jQuery ?? globalThis.$, s = ((f = n.closest) == null ? void 0 : f.call(n, ".window-app, .app, .application")) ?? n, c = o ? o(s) : s;
      try {
        Object.defineProperty(this, "element", {
          value: c,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = c;
        } catch {
        }
      }
      const u = (h = this._v1Options) == null ? void 0 : h.classes;
      Array.isArray(u) && u.length && (n.classList.add(...u), (M = (b = n.closest) == null ? void 0 : b.call(n, ".window-app, .app, .application")) == null || M.classList.add(...u)), this._activateV1Form(n), typeof this.activateListeners == "function" && this.activateListeners(o ? o(n) : n);
    }
  };
}
function Za() {
  const e = $t(), t = Pt(), a = globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (a) return a;
  const i = e == null ? void 0 : e.ApplicationV2;
  return i ? It(i) : null;
}
function Da() {
  const e = $t(), t = Pt(), a = globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (a) return a;
  const i = e == null ? void 0 : e.ApplicationV2;
  return i ? It(i) : Za();
}
const be = "icons/svg/mystery-man.svg", Ra = Da();
async function Oa(e, t, a) {
  var c, u, f, h;
  const { success: i, failure: n } = _e(e, t), r = `<p>Change to <strong>d${e}</strong> with <strong>${t === "low" ? "low" : "high"} rolls positive</strong>?</p>
    <p>This resets the roll configuration for all ${a} listed character and GM entries, for both outcomes, and the global thresholds:</p>
    <ul><li>Success: <strong>${i}</strong></li><li>Failure: <strong>${n}</strong></li></ul>
    <p>Images, audio, animation, labels, colors, and enabled states stay unchanged. Click Save afterward to apply these changes.</p>`, o = (u = (c = foundry == null ? void 0 : foundry.applications) == null ? void 0 : c.api) == null ? void 0 : u.DialogV2;
  if (o != null && o.confirm)
    return await o.confirm({
      window: { title: "Reset Critical Cut-In Roll Configuration?" },
      content: r,
      modal: !0,
      rejectClose: !1,
      yes: { label: "Change and Reset Rolls" },
      no: { label: "Cancel", default: !0 }
    }) === !0;
  const s = globalThis.Dialog ?? ((h = (f = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : f.api) == null ? void 0 : h.Dialog);
  if (!(s != null && s.confirm)) throw new Error("Foundry confirmation dialog is unavailable.");
  return await s.confirm({ title: "Reset Critical Cut-In Roll Configuration?", content: r, defaultYes: !1, rejectClose: !1 }) === !0;
}
function Nt(e, t) {
  return `${e}:${t}`;
}
function Fa() {
  return Nt("gm", "default");
}
function Zt(e, t) {
  var i, n, r, o;
  const a = ((n = (i = globalThis.CONST) == null ? void 0 : i.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : n.OWNER) ?? 3;
  return Number(((r = t == null ? void 0 : t.ownership) == null ? void 0 : r[e.id]) ?? ((o = t == null ? void 0 : t.ownership) == null ? void 0 : o.default) ?? 0) >= a;
}
function ut(e = {}, { defaultAccent: t = "#69e8ff" } = {}) {
  const a = Number(e.threshold), i = Ie(e.animationStyle);
  return {
    enabled: e.enabled !== !1,
    threshold: Number.isInteger(a) && a >= 1 && a <= W() ? a : "",
    duration: we(e.duration),
    animationStyle: i,
    effectDescription: Le(i).description,
    animationStyles: We.map((n) => ({ value: n.id, label: n.label, description: n.description, selected: i === n.id })),
    imagePath: String(e.imagePath ?? ""),
    audioPath: String(e.audioPath ?? ""),
    overlayText: String(e.overlayText ?? ""),
    accentColor: String(e.accentColor ?? (i === ae ? Ue : t))
  };
}
function Ha(e = {}) {
  return {
    success: ut(e, { defaultAccent: "#69e8ff" }),
    failure: ut(e.failure, { defaultAccent: "#ff4d7d" })
  };
}
function Ga() {
  var a, i, n;
  const e = ((a = game.users) == null ? void 0 : a.find((r) => r.isGM && r.active)) ?? ((i = game.users) == null ? void 0 : i.find((r) => r.isGM)) ?? game.user, t = [{
    key: Fa(),
    type: "gm",
    typeLabel: "GM",
    id: "default",
    name: "GM Cut-In",
    portrait: (e == null ? void 0 : e.avatar) || "icons/svg/mystery-man.svg"
  }];
  for (const r of game.actors ?? [])
    (n = game.users) != null && n.some((o) => !o.isGM && Zt(o, r)) && t.push({
      key: Nt("actor", r.id),
      type: "actor",
      typeLabel: "Actor",
      id: r.id,
      name: r.name,
      portrait: r.img || "icons/svg/mystery-man.svg"
    });
  return t.sort((r, o) => r.type === "gm" ? -1 : o.type === "gm" ? 1 : r.name.localeCompare(o.name));
}
class Dt extends Ra {
  constructor(a = {}) {
    super(a);
    de(this, "activeTabs");
    de(this, "selectedPlayer", "gm");
    de(this, "selectedCharacters", /* @__PURE__ */ new Map());
    de(this, "rollRuleChange", null);
    this.activeTabs = /* @__PURE__ */ new Map();
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "hcci-player-config",
      title: `${ht} Configuration`,
      template: qt,
      classes: ["hcci-config-window"],
      width: 1320,
      height: 760,
      resizable: !0,
      closeOnSubmit: !1,
      submitOnChange: !1
    });
  }
  async getData() {
    const a = qe(), i = Ga(), n = [
      { id: "gm", name: "GM", avatar: i[0].portrait, targets: [i[0]] },
      ...Array.from(game.users ?? []).filter((o) => !o.isGM).map((o) => ({
        id: o.id,
        name: o.name,
        avatar: o.avatar || be,
        targets: i.filter((s) => s.type === "actor" && Zt(o, game.actors.get(s.id)))
      }))
    ], r = i.map((o) => {
      const s = Ha(a[o.key]);
      return {
        ...o,
        ...s,
        actorId: o.type === "actor" ? o.id : "",
        outcomes: [
          { ...s.success, kind: "success", defaultText: m(d.defaultText) },
          { ...s.failure, kind: "failure", defaultText: m(d.defaultFailureText) }
        ]
      };
    });
    return {
      players: n.map((o) => ({
        ...o,
        characterHeading: o.id === "gm" ? "GM Configuration" : `${o.name}’s Characters`,
        tabDetail: o.id === "gm" ? "Global" : `${o.targets.length} ${o.targets.length === 1 ? "character" : "characters"}`
      })),
      featuredStyles: ["strike", "breach", "signal", "rift", ae, me].map(Le),
      dieSides: W(),
      dice: dt(W()),
      lowRollsGood: Pe(),
      threshold: m(d.threshold) ?? 0,
      failureThreshold: m(d.failureThreshold) ?? 0,
      duration: m(d.duration),
      rows: r
    };
  }
  activateListeners(a) {
    super.activateListeners(a);
    const i = a instanceof HTMLElement ? a : a[0], n = i.matches(".hcci-config") ? i : i.querySelector(".hcci-config"), r = (l) => n.querySelector(l), o = (l) => Array.from(n.querySelectorAll(l)), s = o("[data-hcci-player]"), c = o("[data-hcci-characters]"), u = o("[data-hcci-character]"), f = o("[data-hcci-tab]"), h = o("[data-hcci-row]"), b = o("[data-hcci-panel]"), M = r("[data-hcci-workspace]"), x = r("[data-hcci-art]"), $ = o("[data-hcci-style]");
    let k, S, L = "success", q = "", F = "";
    const A = (l) => S == null ? void 0 : S.querySelector(`[data-hcci-field="${l}"]`), I = () => {
      if (!k || !S) return;
      const l = A("imagePath").value.trim(), y = k.dataset.hcciPortrait || be;
      (l !== q || y !== F) && (q = l, F = y, x.src = l || y), x.parentElement.style.setProperty("--hcci-preview-accent", A("accentColor").value), r("[data-hcci-caption]").textContent = A("overlayText").value.trim() || A("overlayText").placeholder;
      const w = Le(A("animationStyle").value);
      r("[data-hcci-effect-description]").textContent = w.description, $.forEach((C) => C.setAttribute("aria-pressed", String(C.dataset.hcciStyle === w.id)));
    };
    x.addEventListener("error", () => {
      const l = x.getAttribute("src");
      l !== F && l !== be ? x.src = F : l !== be && (x.src = be);
    });
    const ie = (l, y) => {
      l.setAttribute("aria-selected", String(y)), l.tabIndex = y ? 0 : -1;
    }, z = (l, y = this.selectedCharacters.get(l), w) => {
      this.selectedPlayer = l;
      const C = c.find((v) => v.dataset.hcciCharacters === l), T = u.filter((v) => C == null ? void 0 : C.contains(v)), P = T.find((v) => v.dataset.hcciCharacter === y) ?? T[0], R = P == null ? void 0 : P.dataset.hcciCharacter;
      L = w ?? this.activeTabs.get(R) ?? "success", R && (this.selectedCharacters.set(l, R), this.activeTabs.set(R, L)), k = h.find((v) => v.dataset.hcciRow === R), S = k == null ? void 0 : k.querySelector(`[data-hcci-panel="${L}"]`), s.forEach((v) => ie(v, v.dataset.hcciPlayer === l)), c.forEach((v) => {
        v.hidden = v !== C;
      }), u.forEach((v) => v.setAttribute("aria-pressed", String(v === P))), f.forEach((v) => ie(v, v.dataset.hcciTab === L)), h.forEach((v) => {
        v.hidden = v !== k;
      }), b.forEach((v) => {
        v.hidden = v !== S;
      }), r("#hcci-settings-panel").setAttribute("aria-labelledby", `hcci-${L}-tab`), M.hidden = !k, M.dataset.hcciKind = L, r("[data-hcci-preview-kind]").textContent = L === "failure" ? "Critical Failure" : "Critical Success", I();
    };
    s.forEach((l) => l.addEventListener("click", () => z(l.dataset.hcciPlayer))), u.forEach((l) => l.addEventListener("click", () => z(this.selectedPlayer, l.dataset.hcciCharacter))), f.forEach((l) => l.addEventListener("click", () => z(this.selectedPlayer, void 0, l.dataset.hcciTab)));
    for (const l of [s, f]) for (const [y, w] of l.entries())
      w.addEventListener("keydown", (C) => {
        const T = {
          Home: 0,
          End: l.length - 1,
          ArrowLeft: (y - 1 + l.length) % l.length,
          ArrowRight: (y + 1) % l.length
        }[C.key];
        T !== void 0 && (C.preventDefault(), l[T].focus(), l[T].click());
      });
    $.forEach((l) => l.addEventListener("click", () => {
      const y = A("animationStyle");
      y.value = l.dataset.hcciStyle, y.dispatchEvent(new Event("change", { bubbles: !0 }));
    })), z(s.some((l) => l.dataset.hcciPlayer === this.selectedPlayer) ? this.selectedPlayer : "gm");
    let Q = !1;
    n.addEventListener("invalid", (l) => {
      var v, re, Ne;
      if (Q) return;
      Q = !0, queueMicrotask(() => {
        Q = !1;
      });
      const y = l.target, w = y.closest("details");
      w && (w.open = !0);
      const C = (v = y.closest("[data-hcci-row]")) == null ? void 0 : v.dataset.hcciRow;
      if (!C) return;
      const T = u.filter((Ze) => Ze.dataset.hcciCharacter === C), P = T.find((Ze) => {
        var Ye;
        return ((Ye = Ze.closest("[data-hcci-characters]")) == null ? void 0 : Ye.dataset.hcciCharacters) === this.selectedPlayer;
      }) ?? T[0], R = (re = P == null ? void 0 : P.closest("[data-hcci-characters]")) == null ? void 0 : re.dataset.hcciCharacters;
      R && z(R, C, (Ne = y.closest("[data-hcci-panel]")) == null ? void 0 : Ne.dataset.hcciPanel);
    }, !0);
    const Y = () => {
      r("[data-hcci-dirty]").hidden = !1;
    }, N = r('[name="dieSides"]'), j = r('[name="rollDirection"]'), K = r('[name="threshold"]'), G = r('[name="failureThreshold"]'), Z = o('[data-hcci-field="threshold"]'), D = () => {
      const l = Number(N.value), y = j.value === "low";
      if (o("[data-hcci-success-label]").forEach((T) => {
        T.textContent = y ? "Success ≤" : "Success ≥";
      }), o("[data-hcci-failure-label]").forEach((T) => {
        T.textContent = y ? "Failure ≥" : "Failure ≤";
      }), !Number.isInteger(l) || l < 2 || l > 1e4) return;
      const w = Number(K.value) || (y ? 1 : l), C = Number(G.value) || (y ? l : 1);
      for (const T of [K, G, ...Z]) T.max = String(l);
      for (const T of Z)
        T.placeholder = String(T.closest('[data-hcci-panel="success"]') ? w : C);
    };
    D();
    let B = Number(N.value), ne = j.value;
    const Qe = () => {
      if (this.rollRuleChange) return;
      const l = Number(N.value), y = j.value;
      if (l === B && y === ne) return;
      const w = [N, j, r('[type="submit"]')];
      w.forEach((C) => {
        C.disabled = !0;
      }), this.rollRuleChange = (async () => {
        var C, T;
        try {
          if (!await Oa(l, y, h.length)) return;
          const { success: P, failure: R } = _e(l, y);
          K.value = String(P), G.value = String(R);
          for (const v of Z)
            v.value = String(v.closest('[data-hcci-panel="success"]') ? P : R);
          B = l, ne = y, Y();
        } catch (P) {
          console.error(`${p} | Could not confirm dice change.`, P), (T = (C = ui.notifications) == null ? void 0 : C.error) == null || T.call(C, "Could not confirm the dice change. Your roll configuration has not changed.");
        } finally {
          N.value = String(B), j.value = ne, D(), w.forEach((P) => {
            P.disabled = !1;
          }), this.rollRuleChange = null;
        }
      })();
    };
    N.addEventListener("change", Qe), j.addEventListener("change", Qe);
    for (const l of ["input", "change"]) n.addEventListener(l, (y) => {
      const w = y.target;
      !w.matches("input, select") || w === N || w === j || (Y(), (w === K || w === G) && D(), S != null && S.contains(w) && I());
    });
    for (const l of o("[data-hcci-browse]")) l.addEventListener("click", () => {
      var P, R, v;
      const y = l.dataset.hcciBrowse, w = A(y);
      if (!w) return;
      const C = ((v = (R = (P = foundry == null ? void 0 : foundry.applications) == null ? void 0 : P.apps) == null ? void 0 : R.FilePicker) == null ? void 0 : v.implementation) ?? globalThis.FilePicker;
      new C({
        type: y === "audioPath" ? "audio" : "image",
        current: w.value,
        callback: (re) => {
          w.value = re, w.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).browse();
    });
    const Me = r("[data-hcci-test]");
    Me.addEventListener("click", async () => {
      var T, P, R, v, re;
      if (!((T = game.user) != null && T.isGM) || !k || !S || Me.getAttribute("aria-disabled") === "true") return;
      const l = _e(B, ne), y = L === "failure" ? "failure" : "success", w = y === "failure" ? G.value : K.value, C = A("animationStyle").value;
      Me.setAttribute("aria-disabled", "true");
      try {
        await va({
          actorId: k.dataset.hcciActorId || null,
          actorName: k.dataset.hcciActorId ? k.dataset.hcciName : "",
          triggerKind: y,
          naturalResult: l[y],
          threshold: Number((P = A("threshold")) == null ? void 0 : P.value) || Number(w) || l[y],
          animationStyle: C,
          imagePath: A("imagePath").value.trim() || F,
          fallbackImagePath: F,
          audioPath: A("audioPath").value.trim(),
          overlayText: A("overlayText").value.trim() || A("overlayText").placeholder,
          accentColor: A("accentColor").value,
          textEnabled: !["rift", ae, me].includes(C) || m(d.textEnabled) !== !1,
          duration: we((R = A("duration")) == null ? void 0 : R.value) ?? we(r('[name="duration"]').value) ?? m(d.duration),
          volume: m(d.volume)
        }) || (re = (v = ui.notifications) == null ? void 0 : v.info) == null || re.call(v, "A cut-in is already playing.");
      } finally {
        Me.removeAttribute("aria-disabled");
      }
    }), r("[data-hcci-action='reset']").addEventListener("click", async () => {
      var w, C, T;
      const l = (C = (w = foundry == null ? void 0 : foundry.applications) == null ? void 0 : w.api) == null ? void 0 : C.DialogV2;
      (l != null && l.confirm ? await l.confirm({
        window: { title: "Reset All Character Cut-Ins?" },
        content: "<p>This removes every GM and actor override. Global roll and presentation settings stay unchanged.</p>",
        modal: !0,
        rejectClose: !1,
        yes: { label: "Reset Overrides" },
        no: { label: "Cancel", default: !0 }
      }) === !0 : globalThis.confirm("Reset every GM and actor cut-in override?")) && (await Je({}), (T = ui.notifications) == null || T.info("Critical Cut-In player configuration reset."), this.render(!1));
    });
  }
  async _updateObject(a) {
    var h, b, M, x, $, k, S;
    if (!((h = game.user) != null && h.isGM) || this.rollRuleChange) return;
    const i = a.currentTarget;
    if (!i.reportValidity()) return;
    const n = Number(((b = i.querySelector('[name="dieSides"]')) == null ? void 0 : b.value) ?? W()), r = ((M = i.querySelector('[name="rollDirection"]')) == null ? void 0 : M.value) === "low" ? "low" : "high", o = qe(), s = (L, q) => {
      var ie, z, Q, Y, N, j, K, G, Z, D;
      const F = L.querySelector(`[data-hcci-panel="${q}"]`), A = (B) => F == null ? void 0 : F.querySelector(`[data-hcci-field="${B}"]`), I = we((ie = A("duration")) == null ? void 0 : ie.value);
      return {
        ...I === void 0 ? {} : { duration: I },
        enabled: ((z = F == null ? void 0 : F.querySelector('[data-hcci-field="enabled"]')) == null ? void 0 : z.checked) === !0,
        threshold: (() => {
          var ne;
          const B = Number((ne = A("threshold")) == null ? void 0 : ne.value);
          return Number.isInteger(B) && B >= 1 && B <= n ? B : "";
        })(),
        animationStyle: ((Q = A("animationStyle")) == null ? void 0 : Q.value) || "strike",
        imagePath: ((N = (Y = A("imagePath")) == null ? void 0 : Y.value) == null ? void 0 : N.trim()) ?? "",
        audioPath: ((K = (j = A("audioPath")) == null ? void 0 : j.value) == null ? void 0 : K.trim()) ?? "",
        overlayText: ((Z = (G = A("overlayText")) == null ? void 0 : G.value) == null ? void 0 : Z.trim()) ?? "",
        accentColor: ((D = A("accentColor")) == null ? void 0 : D.value) || (q === "failure" ? "#ff4d7d" : "#69e8ff")
      };
    };
    for (const L of i.querySelectorAll("[data-hcci-row]")) {
      const q = L.dataset.hcciRow;
      o[q] = s(L, "success"), o[q].failure = s(L, "failure");
    }
    const c = Number(((x = i.querySelector('[name="threshold"]')) == null ? void 0 : x.value) ?? Ke()), u = Number((($ = i.querySelector('[name="failureThreshold"]')) == null ? void 0 : $.value) ?? mt()), f = Number(((k = i.querySelector('[name="duration"]')) == null ? void 0 : k.value) ?? m(d.duration));
    await X(d.dieSides, n), await X(d.rollDirection, r), await X(d.threshold, Math.min(n, Math.max(0, c))), await X(d.failureThreshold, Math.min(n, Math.max(0, u))), await X(d.duration, Math.min(8e3, Math.max(800, f))), await Je(o), (S = ui.notifications) == null || S.info("Critical Cut-In configuration saved."), this.render(!1);
  }
}
function Rt() {
  var e, t;
  return (e = game.user) != null && e.isGM ? new Dt().render(!0) : ((t = ui.notifications) == null || t.warn("Only the GM can configure Critical Cut-In."), null);
}
function _a() {
  var a, i, n, r;
  const e = (a = game.modules.get("holosuite")) != null && a.active ? (i = game.modules.get("holosuite")) == null ? void 0 : i.api : null, t = (n = game.modules.get("holosuite-core")) != null && n.active ? (r = game.modules.get("holosuite-core")) == null ? void 0 : r.api : null;
  return e ?? t ?? game.holosuite ?? null;
}
function Ot() {
  var t;
  const e = _a();
  return e != null && e.registerApp ? (e.registerApp({
    brandingInApp: !0,
    id: p,
    title: "Critical Cut-In",
    icon: "fa-solid fa-bolt-lightning",
    premium: !1,
    playerVisible: !1,
    description: "JRPG-style critical hit cut-in animation for natural d20 results.",
    enabled: m(d.enabled),
    open: () => Rt()
  }), e.registerApp({
    brandingInApp: !0,
    id: `${p}-box-of-doom`,
    title: "Box of Doom",
    icon: "fa-solid fa-box",
    premium: !1,
    playerVisible: !1,
    description: "Reveal a high-stakes roll to the whole table.",
    enabled: m(d.enabled),
    open: () => bt()
  }), (t = e.registerWhatsNew) == null || t.call(e, {
    moduleId: p,
    title: "Critical Cut-In",
    tier: "free",
    version: "1.0.6",
    updated: "2026-09-02",
    icon: "fa-solid fa-bolt-lightning",
    entries: [
      {
        title: "More control over critical cut-ins",
        summary: "Choose the die, decide whether high or low results are good, and give each character their own success and failure thresholds.",
        tags: ["Foundry v12-v14"]
      },
      {
        title: "Fewer accidental cut-ins",
        summary: "Old chat rolls, damage rolls, discarded dice, and rerolls no longer set off an animation when they should not."
      }
    ]
  }), console.log(`${p} | Registered with HoloSuite.`), !0) : !1;
}
function Ft() {
  const e = {
    playCutinForUser(a, i = {}) {
      var r;
      const n = xt(a, i);
      return (r = game.user) != null && r.isGM ? ct(n) : ue(n), n;
    },
    playCutinForActor(a, i = {}) {
      var r;
      const n = Pa(a, i);
      return (r = game.user) != null && r.isGM ? ct(n) : ue(n), n;
    },
    openConfig: Rt,
    openBoxOfDoom: bt
  }, t = game.modules.get(p);
  return t && (t.api = e), game.holosuiteCriticalCutin = e, e;
}
Hooks.once("init", async () => {
  Bt(Dt), Wt(), Ft(), await loadTemplates([`modules/${p}/templates/player-config.hbs`]);
});
Hooks.once("ready", () => {
  Ft(), $a(), ee(), Hooks.on("userConnected", ee), Ot(), console.log(`${p} | Ready. API available at game.modules.get("${p}").api`);
});
Hooks.on("hotReload", () => {
  Ot();
});
console.log(`${ht} | Loading.`);
