var Ue = Object.defineProperty;
var Ye = (t, e, i) => e in t ? Ue(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i;
var gt = (t, e, i) => Ye(t, typeof e != "symbol" ? e + "" : e, i);
const We = [4, 6, 8, 10, 12, 20, 100];
function Se(t = 20) {
  var a, r, n;
  const e = ee(t), i = /* @__PURE__ */ new Set([...We, e]), o = ((n = (r = (a = globalThis.CONFIG) == null ? void 0 : a.Dice) == null ? void 0 : r.fulfillment) == null ? void 0 : n.dice) ?? {};
  for (const c of Object.keys(o)) {
    const s = /^d([1-9]\d*)$/i.exec(c);
    if (!s) continue;
    const l = Number(s[1]);
    l >= 2 && l <= 1e4 && i.add(l);
  }
  return [...i].sort((c, s) => c - s).map((c) => ({ value: c, label: `d${c}`, selected: c === e }));
}
function Ut(t, e) {
  const i = ee(t), o = Ce(e) === "low";
  return { success: o ? 1 : i, failure: o ? i : 1 };
}
function ee(t) {
  const e = Number(t);
  return Number.isInteger(e) && e >= 2 && e <= 1e4 ? e : 20;
}
function Ce(t) {
  return t === "low" ? "low" : "high";
}
const C = "holosuite-critical-cutin", ke = "HoloSuite Critical Cut-In", Ht = `module.${C}`, Qe = `modules/${C}/templates/player-config.hbs`, d = {
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
}, ct = {
  everyone: "everyone",
  gm: "gm",
  triggeringPlayer: "triggeringPlayer"
};
function Je(t) {
  game.settings.register(C, d.effectIntensity, {
    name: "Local Effect Detail",
    hint: "Choose the density of decorative particles and the strength of glow on this device.",
    scope: "client",
    config: !0,
    type: String,
    default: "standard",
    choices: { low: "Low", standard: "Standard", high: "High" }
  }), game.settings.register(C, d.shakeIntensity, {
    name: "Local Impact Shake",
    hint: "Shake the cut-in at impact. Reduced and still motion always disable shake.",
    scope: "client",
    config: !0,
    type: Number,
    default: 0.5,
    range: { min: 0, max: 1, step: 0.1 }
  }), game.settings.register(C, d.enabled, {
    name: "Enable Critical Cut-In",
    hint: "Play a configured cut-in when a qualifying natural result is rolled on the selected die.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(C, d.dieSides, {
    name: "Check Die",
    hint: "Configured in Configure Player Cut-Ins, where changes confirm the reset of all listed roll thresholds.",
    scope: "world",
    config: !1,
    type: Number,
    default: 20
  }), game.settings.register(C, d.rollDirection, {
    name: "Positive Rolls",
    hint: "Configured in Configure Player Cut-Ins, together with the check die and roll thresholds.",
    scope: "world",
    config: !1,
    type: String,
    default: "high",
    choices: { high: "High rolls are positive", low: "Low rolls are positive" }
  }), game.settings.register(C, d.threshold, {
    name: "Default Trigger Threshold",
    hint: "0 automatically uses the best die face. Otherwise success triggers at or above this value for high rolls, or at or below it for low rolls.",
    scope: "world",
    config: !0,
    type: Number,
    default: 0
  }), game.settings.register(C, d.failureThreshold, {
    name: "Default Failure Trigger",
    hint: "0 automatically uses the worst die face. Otherwise failure triggers at or below this value for high rolls, or at or above it for low rolls.",
    scope: "world",
    config: !0,
    type: Number,
    default: 0
  }), game.settings.register(C, d.duration, {
    name: "Animation Duration",
    hint: "How long the cut-in remains visible, in milliseconds.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 800, max: 8e3, step: 100 },
    default: 2500
  }), game.settings.register(C, d.volume, {
    name: "Cut-In Audio Volume",
    hint: "Volume multiplier for configured cut-in audio samples.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 0.8
  }), game.settings.register(C, d.audience, {
    name: "Show Animation To",
    hint: "Choose who sees synchronized cut-in playback.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      [ct.everyone]: "Everyone",
      [ct.gm]: "GM only",
      [ct.triggeringPlayer]: "Triggering player only"
    },
    default: ct.everyone
  }), game.settings.register(C, d.animationFont, {
    name: "Animation Font",
    hint: "Typeface for the cut-in label and actor name.",
    scope: "world",
    config: !0,
    type: String,
    default: "aicon",
    choices: { aicon: "AICON", classic: "Classic (Orbitron / system fallback)" }
  }), game.settings.register(C, d.textEnabled, {
    name: "Enable Text Overlay",
    hint: "Show the configured label during the cut-in.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(C, d.defaultText, {
    name: "Default Overlay Text",
    hint: "Fallback label used when no player-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL"
  }), game.settings.register(C, d.defaultFailureText, {
    name: "Default Failure Overlay Text",
    hint: "Fallback label used when no failure-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL FAILURE"
  }), game.settings.register(C, d.motionMode, {
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
  }), game.settings.register(C, d.flashMode, {
    name: "Local Flash Intensity",
    hint: "Reduce or disable the bright opening flash on this device.",
    scope: "client",
    config: !0,
    type: String,
    choices: { full: "Full", soft: "Soft", off: "Off" },
    default: "soft"
  }), game.settings.register(C, d.localVolume, {
    name: "Local Cut-In Volume",
    hint: "Personal volume multiplier applied after the GM's cut-in volume setting.",
    scope: "client",
    config: !0,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 1
  }), game.settings.register(C, d.suppressCutins, {
    name: "Hide Cut-Ins On This Device",
    hint: "Do not show or play critical cut-ins for this client.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(C, d.debug, {
    name: "Debug Logging",
    hint: "Log roll detection and playback decisions to the console.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(C, d.playerConfigs, {
    name: "Per-Player Cut-In Configuration",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.registerMenu(C, "playerConfigMenu", {
    name: "Configure Player Cut-Ins",
    label: "Open Configuration",
    hint: "Choose the check die and positive roll direction, and set each user or actor's roll thresholds, portrait, audio, label, accent color, and enable state.",
    icon: "fa-solid fa-bolt",
    type: t,
    restricted: !0
  });
}
function S(t) {
  return game.settings.get(C, t);
}
async function Q(t, e) {
  return game.settings.set(C, t, e);
}
function Lt(t) {
  if (typeof t != "number" && typeof t != "string") return;
  const e = Number(t);
  return Number.isInteger(e) && e >= 800 && e <= 8e3 ? e : void 0;
}
function ae() {
  return Te(S(d.threshold), "success");
}
function Me() {
  return Te(S(d.failureThreshold), "failure");
}
function tt() {
  return ee(S(d.dieSides));
}
function qt() {
  return Ce(S(d.rollDirection)) === "low";
}
function Te(t, e) {
  const i = Number(t);
  return Number.isInteger(i) && i >= 1 && i <= tt() ? i : e === "success" === qt() ? 1 : tt();
}
function xe(t, e, i) {
  return i === "success" === qt() ? t <= e : t >= e;
}
function Yt() {
  const t = S(d.playerConfigs);
  return foundry.utils.deepClone(t && typeof t == "object" ? t : {});
}
async function ce(t) {
  return Q(d.playerConfigs, t && typeof t == "object" ? t : {});
}
function kt(...t) {
  S(d.debug) && console.log(`${C} |`, ...t);
}
const ie = "boxOfDoom", ht = "boxOfDoomState", ta = 850, ea = 5200, aa = 500;
let J = !1, Bt = !1, rt, Vt;
function ia() {
  var e;
  return (e = Array.from(game.users ?? []).filter((i) => i.isGM && i.active).sort((i, o) => i.id.localeCompare(o.id))[0]) == null ? void 0 : e.id;
}
function bt() {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) && (ia() ?? game.user.id) === game.user.id;
}
function pt() {
  const t = S(ht);
  return t != null && t.id && (t.phase !== "revealed" || t.expires > Date.now()) ? t : void 0;
}
function Ae(t) {
  return t.target === null ? "" : `Target ${t.low ? "≤" : "≥"} ${t.target}`;
}
function Wt(t) {
  return t.target === null ? "" : (t.low ? t.total <= t.target : t.total >= t.target) ? "Success" : "Failure";
}
function oa(t) {
  const e = document.createElement("span");
  return e.textContent = t, e.innerHTML;
}
function nt() {
  var u;
  clearTimeout(Vt);
  const t = pt(), e = ((u = game.user) == null ? void 0 : u.isGM) === !0, i = bt(), o = !e && S(d.suppressCutins) === !0;
  if (!t || o) {
    rt == null || rt.remove(), rt = void 0;
    return;
  }
  const a = `${t.id}:${t.phase}:${i}:${J}`;
  if ((rt == null ? void 0 : rt.dataset.state) === a) {
    t.phase === "revealed" && (Vt = setTimeout(nt, Math.max(1, t.expires - Date.now())));
    return;
  }
  const r = rt, n = i && (!r || r.contains(document.activeElement));
  r == null || r.remove();
  const c = document.createElement("section");
  c.className = "hcci-doom", c.dataset.holosuiteBranding = `${C}-box-of-doom`, c.dataset.state = a, c.dataset.phase = t.phase, c.dataset.animate = String((r == null ? void 0 : r.dataset.boxId) !== t.id || r.dataset.phase !== t.phase), c.dataset.boxId = t.id, c.dataset.control = String(i), c.dataset.motion = String(S(d.motionMode) ?? "system"), t.phase === "revealed" && (c.dataset.outcome = Wt(t).toLowerCase()), c.setAttribute("aria-label", "Box of Doom"), c.innerHTML = `
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
    </div>`, c.querySelector(".hcci-doom-stakes").textContent = t.stakes, c.querySelector(".hcci-doom-target").textContent = [`d${t.sides}`, Ae(t)].filter(Boolean).join(" · ");
  const s = c.querySelector(".hcci-doom-status");
  if (t.phase === "revealed") {
    const g = s.appendChild(document.createElement("strong"));
    g.textContent = String(t.total);
    const h = s.appendChild(document.createElement("span"));
    h.textContent = Wt(t) || "Result", Vt = setTimeout(nt, Math.max(1, t.expires - Date.now()));
  } else
    s.textContent = t.phase === "sealed" ? "Sealed" : "Opening…";
  const l = (g, h) => {
    const y = c.querySelector(".hcci-doom-controls").appendChild(document.createElement("button"));
    y.type = "button", y.textContent = g, y.addEventListener("click", () => void h().catch(Ee));
  };
  i && !J && t.phase === "sealed" && l("Roll & Reveal", () => ra(t.id)), i && !J && t.phase !== "revealed" && l("Cancel", () => se(t.id)), i && !J && t.phase === "revealed" && l("Close", () => se(t.id)), rt = c, document.body.append(c), Hooks.callAll("holosuite-core.renderBranding", c), n && (c.tabIndex = -1, (c.querySelector("button") ?? c).focus({ preventScroll: !0 }));
}
function Ee(t) {
  var e;
  console.error(`${C} | Box of Doom`, t), (e = ui.notifications) == null || e.error("Box of Doom could not complete the action. Check the chat and try again.");
}
async function se(t) {
  var e;
  if (!(!bt() || J || ((e = pt()) == null ? void 0 : e.id) !== t)) {
    J = !0, nt();
    try {
      await Q(ht, {});
    } finally {
      J = !1, nt();
    }
  }
}
const le = (t) => new Promise((e) => setTimeout(e, t));
async function ra(t) {
  var i, o;
  const e = pt();
  if (!(!bt() || J || (e == null ? void 0 : e.id) !== t || e.phase !== "sealed")) {
    J = !0, nt();
    try {
      const a = ((i = foundry.dice) == null ? void 0 : i.Roll) ?? globalThis.Roll;
      await Q(ht, { ...e, phase: "opening" });
      const r = await new a(`1d${e.sides}`).evaluate({ allowInteractive: !1 }), n = Number(r.total);
      if (!Number.isInteger(n) || n < 1 || n > e.sides) throw new Error("Unexpected die result.");
      await le(ta);
      const c = pt();
      if ((c == null ? void 0 : c.id) !== t || c.phase !== "opening") return;
      const s = { ...e, phase: "revealed", total: n, expires: Date.now() + ea };
      await Q(ht, s), await le(aa);
      const l = ((o = foundry.documents) == null ? void 0 : o.ChatMessage) ?? globalThis.ChatMessage, u = [`d${e.sides}: ${n}`, Ae(e), Wt(s)].filter(Boolean).join(" · ");
      await l.create({
        speaker: l.getSpeaker(),
        content: `<h3>Box of Doom</h3>${e.stakes ? `<p>${oa(e.stakes)}</p>` : ""}<p><strong>${u}</strong></p>`,
        whisper: [],
        blind: !1,
        flags: { [C]: { [ie]: t } }
      });
    } catch (a) {
      const r = pt();
      throw bt() && (r == null ? void 0 : r.phase) === "opening" && r.id === t && await Q(ht, e), a;
    } finally {
      J = !1, nt();
    }
  }
}
async function Le() {
  var t, e, i;
  if (!bt()) {
    (t = game.user) != null && t.isGM && ((e = ui.notifications) == null || e.warn("The active GM controls Box of Doom."));
    return;
  }
  if (!(J || Bt || pt())) {
    Bt = !0;
    try {
      const o = foundry.applications.api.DialogV2, a = Se(tt()), r = qt(), n = await o.prompt({
        window: { title: "Box of Doom" },
        modal: !0,
        rejectClose: !1,
        content: `<div class="hcci-doom-form" data-holosuite-branding="${C}-box-of-doom">
        <label>What’s at stake?<input name="stakes" type="text" maxlength="180" placeholder="Optional"></label>
        <label>Die<select name="sides">${a.map(({ value: c, label: s, selected: l }) => `<option value="${c}" ${l ? "selected" : ""}>${s}</option>`).join("")}</select></label>
        <label>Success target (${r ? "roll at or below" : "roll at or above"})<input name="target" type="number" min="1" max="10000" step="1" placeholder="Optional"></label>
      </div>`,
        ok: {
          label: "Show Box to Table",
          callback: (c, s) => {
            const l = new FormData(s.form), u = l.get("target");
            return {
              stakes: String(l.get("stakes") ?? "").trim(),
              sides: Number(l.get("sides")),
              target: u === "" || u == null ? null : Number(u)
            };
          }
        }
      });
      if (!n || !bt() || pt() || !a.some((c) => c.value === n.sides)) return;
      if (n.target !== null && (!Number.isInteger(n.target) || n.target < 1 || n.target > n.sides)) {
        (i = ui.notifications) == null || i.warn(`Choose a target between 1 and ${n.sides}, or leave it blank.`);
        return;
      }
      await Q(ht, { ...n, id: foundry.utils.randomID(), phase: "sealed", low: r });
    } catch (o) {
      Ee(o);
    } finally {
      Bt = !1;
    }
  }
}
function na() {
  game.settings.register(C, ht, {
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: nt
  });
}
const wt = "shattered-fate", $e = [53, 48], Rt = [
  [[49, 34], [43, 25], [41, 0]],
  [[64, 39], [69, 23], [100, 0]],
  [[68, 49], [79, 45], [100, 36]],
  [[66, 58], [81, 65], [100, 76]],
  [[61, 64], [66, 81], [78, 100]],
  [[50, 66], [46, 76], [39, 100]],
  [[41, 60], [29, 70], [0, 100]],
  [[34, 52], [22, 56], [0, 52]],
  [[43, 40], [31, 28], [0, 0]]
], ue = Rt.flatMap(([t, e, i], o) => {
  const [a, r, n] = Rt[(o + 1) % Rt.length], c = [(t[0] + a[0]) / 2 + (o % 2 ? 1.5 : -2), (t[1] + a[1]) / 2 + (o % 3 - 1) * 2];
  return [
    [$e, t, c, a],
    [t, e, i, ...o === 3 ? [[100, 100]] : [], n, r, a, c]
  ];
}), Pe = (t) => `polygon(${t.map(([e, i]) => `${e}% ${i}%`).join(",")})`, Qt = (t) => t.map((e) => e.join(",")).join(" "), Xt = [
  [[0, 0], [100, 0]],
  [[0, 16], [21, 23], [37, 15], [58, 29], [72, 20], [100, 26]],
  [[0, 42], [25, 48], [44, 37], [65, 49], [86, 42], [100, 50]],
  [[0, 62], [20, 70], [39, 58], [62, 73], [80, 61], [100, 67]],
  [[0, 83], [17, 88], [39, 77], [59, 91], [77, 79], [100, 89]],
  [[0, 100], [100, 100]]
];
function ca() {
  return `<svg class="hcci-fate-backdrop" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
    <path class="hcci-fate-slashes" d="M0 365 259 206 146 327 350 230 227 367 0 505ZM0 511l244-106L80 520l65-12L0 560Zm1000-407L712 250l104-114-113 44L919 0h81Zm0 390-192 66h-66l98-58-46 6 206-133Z"/>
    <path class="hcci-fate-streaks" d="m0 337 274-179L91 314Zm0 184 327-118L54 520ZM1000 25 733 193 960 25Zm0 215-208 108 208-76ZM675 560l250-124-177 124Z"/>
    <path class="hcci-fate-debris" d="m115 152 35-19-16 38Zm64 311 47-27-27 41Zm623-351 46-25-23 43Zm75 279 49-43-15 51ZM69 437l29-22-11 27Zm864-225 33-19-15 29Z"/>
  </svg><div class="hcci-fate-flash"></div>`;
}
function sa(t) {
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points="${Qt(t)}"/></svg>`;
}
function la(t) {
  const e = t.querySelector(".hcci-visual"), i = e.querySelector(".hcci-portrait"), o = e.querySelectorAll(".hcci-fate-shard");
  if (o.length) {
    for (const a of o) a.firstElementChild.replaceWith(i.cloneNode(!0));
    return;
  }
  for (const a of ue) {
    const r = document.createElement("div");
    r.className = "hcci-fate-shard", r.style.clipPath = Pe(a), r.append(i.cloneNode(!0)), r.insertAdjacentHTML("beforeend", sa(a)), e.append(r);
  }
  e.insertAdjacentHTML("beforeend", `<svg class="hcci-fate-cracks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <g class="hcci-fate-branches">${ue.filter((a, r) => r % 2 === 0).map((a) => `<polyline points="${Qt(a.slice(1))}"/>`).join("")}</g>
    <g class="hcci-fate-rays">${Rt.map((a) => `<polyline points="${Qt([$e, ...a])}"/>`).join("")}</g>
    <path class="hcci-fate-spark" d="m53 45 1 2 3 1-3 1-1 3-1-3-3-1 3-1Z"/>
  </svg>`);
}
const B = { fracture: 250, shatter: 450, impact: 740, settle: 1050 }, ua = 280, It = "steps(1, end)", Nt = "cubic-bezier(.13,.79,.19,1)", fa = [
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
function da(t, e) {
  const i = [];
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return { animations: i, audioDelay: 0 };
  const o = Math.min(1, (e - 140) / B.settle), a = (u, g, h, y, m = "linear") => {
    u && i.push(u.animate(g, {
      delay: h * o,
      duration: (y - h) * o,
      easing: m,
      fill: "both"
    }));
  }, r = (u) => t.querySelector(u);
  a(r(".hcci-visual"), [
    { transform: "translate(-3vw, 2vh) scale(1.09)", opacity: 0.42 },
    { transform: "none", opacity: 1 }
  ], 0, B.fracture, Nt), a(r(".hcci-portrait-frame"), [{ visibility: "visible" }, { visibility: "hidden" }], 0, B.shatter, It);
  for (const [u, g] of [[".hcci-fate-rays", 250], [".hcci-fate-branches", 310], [".hcci-fate-spark", 250]])
    a(r(u), [
      { opacity: 0 },
      { opacity: 1, offset: 0.06, easing: It },
      { opacity: 0 }
    ], g, B.shatter);
  for (const [u, g] of Array.from(t.querySelectorAll(".hcci-fate-shard")).entries()) {
    const h = u % 2 === 0, [y, m, w] = fa[Math.floor(u / 2)], v = h ? 40 : 55, b = h ? 33 + u % 3 * 12 : u % 3 * 8;
    a(g, [{ visibility: "hidden" }, { visibility: "visible" }], 0, B.shatter, It);
    const A = B.shatter + b, L = h ? 819 : 756;
    a(g, [
      { transform: "none", opacity: 1, easing: Nt },
      { transform: `perspective(850px) translate3d(${y * v * 0.52}vw,${m * v * 0.47}vh,${h ? 96 : -80}px) rotate(${w * 0.53}deg) rotateY(${y * 32}deg)`, opacity: 1, offset: (L - A) / (B.settle - A) },
      { transform: `perspective(850px) translate3d(${y * v}vw,${m * v}vh,${h ? 190 : -145}px) rotate(${w}deg) rotateY(${y * 62}deg)`, opacity: 0 }
    ], A, B.settle);
  }
  a(r(".hcci-copy"), [
    { opacity: 0, transform: "translate(13vw,3vh) rotate(-13deg) scale(1.3)" },
    { opacity: 1, transform: "translate(-1vw,0) rotate(-8deg) scale(1.035)", offset: 0.35, easing: It },
    { opacity: 1, transform: "translate(-1vw,0) rotate(-8deg) scale(1.035)", offset: 0.51, easing: Nt },
    { opacity: 1, transform: "rotate(-7deg)" }
  ], B.impact, B.settle, Nt);
  const n = r(".hcci-fate-flash"), c = [54, B.fracture, B.impact], s = B.impact + 50, l = c.flatMap((u, g) => [
    { offset: u / s, opacity: 0 },
    {
      offset: (u + 7) / s,
      opacity: `calc(var(--flash-peak, .14) * ${g === 0 ? 0.55 : 1})`,
      backgroundColor: g === 0 ? "var(--hcci-accent)" : "#fff"
    },
    { offset: (u + 50) / s, opacity: 0 }
  ]);
  return a(n, [{ opacity: 0, offset: 0 }, ...l], 0, s), a(r(".hcci-stage"), [
    { transform: "none" },
    { transform: "translateX(var(--hcci-shake))", offset: 0.2 },
    { transform: "translateX(calc(-.45 * var(--hcci-shake)))", offset: 0.51 },
    { transform: "none" }
  ], B.impact, B.impact + 75), { animations: i, audioDelay: B.shatter * o };
}
function ha(t, e) {
  var a;
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return [];
  const i = [], o = t.querySelector(".hcci-copy");
  if (Number(getComputedStyle(o).opacity) > 0.8 && ((a = o.textContent) != null && a.trim())) {
    const r = o.parentElement.appendChild(document.createElement("div"));
    r.className = "hcci-fate-exit-pieces";
    for (let n = 0; n < Xt.length - 1; n++) {
      const c = o.cloneNode(!0), s = r.appendChild(document.createElement("div"));
      s.style.clipPath = Pe([...Xt[n], ...Xt[n + 1].slice().reverse()]), s.append(c), i.push(s.animate([
        { transform: "none", opacity: 1 },
        { transform: `translate(${(n - 2) * 9 + (n % 2 ? 11 : -8)}vw,${7 + n * 6}vh) rotate(${(n - 2) * 12}deg)`, opacity: 0 }
      ], { duration: e - n * 9, delay: n * 9, easing: "cubic-bezier(.55,.04,.89,.54)", fill: "both" }));
    }
    o.style.visibility = "hidden";
  }
  return i.push(t.animate([{ opacity: 1 }, { opacity: 1, offset: 0.61 }, { opacity: 0 }], { duration: e, fill: "both" })), i;
}
const st = "manga-overdrive", oe = "#ec2846";
function pa(t) {
  return `<svg class="hcci-manga-ink" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
    <g class="hcci-manga-page">
      <path class="hcci-manga-paper" d="M0 0h1000v600H0Z"/>
      <path class="hcci-manga-black" d="M0 0h288l86 132-131-70 69 105-117-54 45 63-157-37 71 65L0 169Zm1000 0v213l-155 12 57-68-119 18 86-69-166 43L813 0ZM0 600V365l170-30-64 71 139-38-65 85 112-45-84 192Zm1000 0H742l-97-144 122 39-52-79 133 39-67-75 134 28-47-59 132 15Z"/>
      <path class="hcci-manga-black" d="M0 226l362-6-179 27L0 249Zm0 31 299 4L0 270Zm0 53 331-32L0 332Zm1000-73-294 17 294-3Zm0 19-362 24 362-14Zm0 40-321-5 321 21ZM322 0l110 160L362 0Zm97 0 38 111L438 0Zm144 0-42 144L587 0Zm92 0L553 178 703 0ZM312 600l129-181-94 181Zm99 0 53-154-27 154Zm89 0 8-158 22 158Zm134 0-78-169 113 169Z"/>
      <path class="hcci-manga-black" d="M53 151c26-12 67-8 91 3l61 29-58-15c-26-7-32 3-56-4-16-5-22-14-38-13Zm879 247c-22 7-24 19-54 21l-77-21 61 37c21 11 33 5 51-4l33-20ZM211 121c10 2 21 12 25 21-14 1-21-8-25-21Zm570 346c-8-5-12-15-9-21 10 4 18 16 9 21Z"/>
      <path class="hcci-manga-accent" d="m23 186 222 29-124-31Zm45 191 139-57-62 45ZM726 146l114-89-68 78ZM825 357l143-25-72 26Z"/>
      ${t === "low" ? "" : '<path class="hcci-manga-black" d="m272 204 29 5 20 17-28-3Zm383-59 8-31 28-22-17 35ZM247 365l40-23-10 25-30 9Zm544-38 32-7 26 17-41-2ZM401 434l21-38-1 30-10 19Z"/>'}
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
const k = { blackout: 0, ink: 80, silhouette: 180, halftone: 320, impact: 520, hold: 760 }, ft = "cubic-bezier(.12,.76,.18,1)", V = "steps(1, end)", ma = "grayscale(1) brightness(.40) contrast(1.8)", ga = "grayscale(1) contrast(1.55)";
function ya(t, e) {
  const i = [];
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return { animations: i, audioDelay: 0 };
  const o = Math.min(1, (e - 160) / k.hold), a = (n, c, s, l, u = "linear") => {
    for (const g of t.querySelectorAll(n))
      i.push(g.animate(c, { delay: s * o, duration: (l - s) * o, easing: u, fill: "both" }));
  }, r = (n) => n / k.impact;
  return a(".hcci-manga-page", [
    { opacity: 0, transform: "scale(.65)", easing: V },
    { opacity: 1, transform: "scale(.73)", offset: r(k.ink), easing: ft },
    { opacity: 1, transform: "scale(1.03)", offset: r(k.silhouette) },
    { opacity: 1, transform: "scale(1)", offset: r(k.halftone), easing: V },
    { opacity: 0, transform: "scale(1)" }
  ], k.blackout, k.impact), a(".hcci-manga-panel-glint", [
    { opacity: 0, transform: "scaleX(.1)" },
    { opacity: 1, transform: "scaleX(1)", offset: 0.32, easing: V },
    { opacity: 0, transform: "scaleX(1)" }
  ], 19, k.ink), a(".hcci-visual", [
    { opacity: 1, transform: "none", easing: V },
    { opacity: 0, transform: "none", offset: k.ink / k.hold, easing: V },
    { opacity: 1, transform: "translate(-16vw, 4vh) rotate(-12deg) scale(.84)", offset: k.silhouette / k.hold, easing: ft },
    { opacity: 1, transform: "translate(1.2vw,-.6vh) rotate(2deg) scale(.94)", offset: 255 / k.hold },
    { opacity: 1, transform: "scale(.92)", offset: k.halftone / k.hold, easing: ft },
    { opacity: 1, transform: "translate(-.3vw,.15vh) scale(.96)", offset: 352 / k.hold, easing: ft },
    { opacity: 1, transform: "none", offset: k.impact / k.hold },
    { opacity: 1, transform: "none" }
  ], k.blackout, k.hold), a(".hcci-portrait-frame", [
    { opacity: 0.065, easing: V },
    { opacity: 1 }
  ], k.blackout, k.silhouette), a(".hcci-manga-artwork", [
    { filter: "brightness(.16)", easing: V },
    { filter: ma, offset: r(k.silhouette), easing: V },
    { filter: ga, offset: r(k.halftone), easing: V },
    { filter: "none" }
  ], k.blackout, k.impact), a(".hcci-manga-reveal-lines", [
    { opacity: 0, easing: V },
    { opacity: 1 }
  ], k.blackout, k.halftone), a(".hcci-manga-dots", [
    { opacity: 0, easing: V },
    { opacity: 0.27, offset: r(k.halftone), easing: V },
    { opacity: 0 }
  ], k.blackout, k.impact), a(".hcci-manga-impact", [
    { opacity: 0, easing: V },
    { opacity: 1, offset: 0.01, transform: "scale(1.06)", easing: V },
    { opacity: 1, transform: "scale(1.06)", offset: 0.29, easing: ft },
    { opacity: 1, transform: "scale(1)" }
  ], k.impact, k.hold), a(".hcci-copy", [
    { opacity: 0, transform: "translate(12vw, -4vh) rotate(4deg) scale(1.16)" },
    { opacity: 1, transform: "translate(-.8vw, .4vh) rotate(-6deg) scale(1.035)", offset: 0.31, easing: V },
    { opacity: 1, transform: "translate(-.8vw, .4vh) rotate(-6deg) scale(1.035)", offset: 0.48, easing: ft },
    { opacity: 1, transform: "rotate(-4deg)" }
  ], k.impact, k.hold, ft), a(".hcci-manga-flash", [
    { opacity: 0 },
    { opacity: "var(--flash-peak, .14)", offset: 0.1 },
    { opacity: 0 }
  ], k.impact, k.impact + 38), a(".hcci-stage", [
    { transform: "none" },
    { transform: "translateX(var(--hcci-shake))", offset: 0.18 },
    { transform: "translateX(calc(-.5 * var(--hcci-shake)))", offset: 0.44 },
    { transform: "none" }
  ], k.impact, k.impact + 66), { animations: i, audioDelay: k.impact * o };
}
function va(t, e) {
  return !t.classList.contains("hcci-motion-full") || !t.animate ? [] : Array.from(t.querySelectorAll(".hcci-manga-exit"), (i, o) => i.animate([
    { transform: o === 0 ? "translate(-85%, -36%)" : "translate(85%, 36%)", opacity: 1 },
    { transform: o === 0 ? "translate(11%, 7%)" : "translate(-11%, -7%)", opacity: 1 }
  ], { duration: e - o * 17, delay: o * 17, easing: "cubic-bezier(.48,.05,.82,.71)", fill: "both" }));
}
function ba(t) {
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
    ${t === "low" ? "" : `
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
const G = {
  anticipation: 0,
  slash: 100,
  rupture: 245,
  reveal: 402,
  title: 505,
  hold: 695
}, wa = "cubic-bezier(.68,0,.88,.45)", Dt = "cubic-bezier(.12,.78,.24,1)", fe = "cubic-bezier(.15,.78,.18,1)", Sa = "cubic-bezier(.62,.02,.86,.45)";
function Mt(t) {
  const e = 91 - 0.74 * t;
  return `polygon(-10% 0, ${t - 12}% 0, ${t - 11}% ${e - 6}%, ${t}% ${e}%, ${t - 12}% ${e + 8}%, ${t - 15}% 100%, -10% 100%) view-box`;
}
function Ca(t, e) {
  const i = [];
  if (!t.classList.contains("hcci-motion-full") || !t.animate)
    return { animations: i, audioDelay: 0 };
  const o = Math.min(1, (e - 100) / G.hold), a = (r, n, c, s, l = "linear") => {
    for (const u of t.querySelectorAll(r))
      i.push(u.animate(n, {
        delay: c * o,
        duration: (s - c) * o,
        easing: l,
        fill: "both"
      }));
  };
  return a(".hcci-rift-geometry", [{ opacity: 0.62 }, { opacity: 1 }], G.anticipation, G.slash), a(".hcci-rift-edge, .hcci-rift-edge-light", [{ opacity: 0 }, { opacity: 1 }], G.slash + 82, G.rupture), a(".hcci-rift-upper", [{ transform: "none" }, { transform: "translate(8vw, -38vh) rotate(-3deg)" }], G.rupture, 535, Dt), a(".hcci-rift-lower", [{ transform: "none" }, { transform: "translate(-5vw, 40vh) rotate(-2deg)" }], G.rupture + 18, 585, Dt), a(".hcci-rift-slash", [
    { clipPath: Mt(1), opacity: 0.28 },
    { clipPath: Mt(13), opacity: 0.65, offset: 0.21, easing: wa },
    { clipPath: Mt(126), opacity: 1, offset: 0.62 },
    { clipPath: Mt(126), opacity: 0.76, offset: 0.72 },
    { clipPath: Mt(126), opacity: 0 }
  ], G.anticipation, 340), a(".hcci-rift-splinters-top", [
    { opacity: 0 },
    { opacity: 1, offset: 0.025 },
    { opacity: 0, transform: "translate(6vw, -16vh) rotate(5deg)" }
  ], G.rupture, 465, Dt), a(".hcci-rift-splinters-bottom", [
    { opacity: 0 },
    { opacity: 1, offset: 0.025 },
    { opacity: 0, transform: "translate(-4vw, 12vh) rotate(-4deg)" }
  ], G.rupture + 15, 485, Dt), a(".hcci-visual", [
    { transform: "translate(-6vw, 5vh) rotate(-5deg)", opacity: 0 },
    { transform: "translate(1.2vw, -1vh) rotate(1deg)", opacity: 1, offset: 0.58, easing: "steps(1, end)" },
    { transform: "translate(1.2vw, -1vh) rotate(1deg)", opacity: 1, offset: 0.69 },
    { transform: "none", opacity: 1 }
  ], G.reveal, 625, fe), a(".hcci-copy", [
    { opacity: 0, transform: "translate(8vw, -3vh) skewX(-12deg)" },
    { opacity: 1, transform: "translate(-1vw, .5vh) skewX(2deg)", offset: 0.6 },
    { opacity: 1, transform: "none" }
  ], G.title, G.hold, fe), a(".hcci-rift-flash", [
    { opacity: 0 },
    { opacity: "var(--flash-peak, .14)", offset: 0.08 },
    { opacity: 0 }
  ], G.slash + 82, G.rupture + 33), a(".hcci-stage", [
    { transform: "none" },
    { transform: "translateX(var(--hcci-shake))", offset: 0.28 },
    { transform: "translateX(calc(-.5 * var(--hcci-shake)))", offset: 0.58 },
    { transform: "none" }
  ], G.title + 38, 640), { animations: i, audioDelay: G.slash * o };
}
function ka(t, e) {
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return [];
  const i = [];
  for (const [o, a] of [
    [".hcci-visual", "translate(62vw, -43vh) rotate(-9deg)"],
    [".hcci-copy", "translate(75vw, -40vh) skewX(-12deg)"],
    [".hcci-rift-upper", "translate(20vw, -105vh) rotate(-6deg)"],
    [".hcci-rift-lower", "translate(-24vw, 100vh) rotate(-5deg)"]
  ]) {
    const r = t.querySelector(o);
    r && i.push(r.animate([{ transform: a }], { duration: e, easing: Sa, fill: "forwards" }));
  }
  return i;
}
const St = "reality-override", Ma = 300, Jt = 5, N = { cut: 20, flip: 150, wind: 520, impact: 640, settle: 820 }, Tt = "cubic-bezier(.14,.82,.2,1)", $t = "steps(1, end)", de = [1, -0.7, 0.5, -1, 0.8];
function Ta(t) {
  const e = t === "low" ? 0 : t === "high" ? 8 : 4;
  return `<div class="hcci-ovr-freeze"></div>
    <div class="hcci-ovr-slab"></div>
    <div class="hcci-ovr-chips">${Array.from({ length: e }, (i, o) => `<i style="--k:${o}"></i>`).join("")}</div>
    <div class="hcci-ovr-flash"></div>`;
}
function xa(t) {
  const e = t.querySelector(".hcci-visual"), i = t.querySelector(".hcci-portrait-frame > .hcci-portrait");
  if (!e || !i) return;
  e.querySelectorAll(".hcci-ovr-echo, .hcci-ovr-panel, .hcci-ovr-cuts, .hcci-ovr-band").forEach((s) => s.remove());
  const o = (s) => {
    const l = i.cloneNode(!0);
    return l.classList.remove("hcci-portrait"), l.classList.add(s), l;
  }, a = (s, l) => {
    const u = document.createElement(s.startsWith("i.") ? "i" : "div");
    return u.className = s.replace(/^i\./, ""), l !== void 0 && u.style.setProperty("--i", String(l)), u;
  }, r = a("hcci-ovr-echo");
  r.append(o("hcci-ovr-echo-art"));
  const n = a("hcci-ovr-panel");
  for (let s = 0; s < Jt; s++) {
    const l = a("hcci-ovr-louver", s);
    l.append(o("hcci-ovr-art"), a("i.hcci-ovr-tint"), a("i.hcci-ovr-face"), a("i.hcci-ovr-neg")), n.append(l);
  }
  const c = a("hcci-ovr-cuts");
  for (let s = 0; s <= Jt; s++) c.append(a("i.hcci-ovr-cut", s));
  e.append(r, n, c, a("hcci-ovr-band"));
}
function Aa(t, e) {
  var E;
  const i = [];
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return { animations: i, audioDelay: 0 };
  const o = Math.min(1, (e - 100) / N.settle), a = (p, O, Z, $, et = "linear", at = "both") => {
    p && i.push(p.animate(O, { delay: Z * o, duration: Math.max(1, ($ - Z) * o), easing: et, fill: at }));
  }, r = (p, O, Z) => {
    const $ = Z * o;
    p && e > $ && i.push(p.animate(O, { delay: $, duration: e - $, fill: "forwards" }));
  }, n = (p) => t.querySelector(p), c = (p) => Array.from(t.querySelectorAll(p)), s = c(".hcci-ovr-cut"), l = t.clientHeight || 1, u = Math.max(0, (((E = s[0]) == null ? void 0 : E.getBoundingClientRect().width) ?? 3) - 3), g = Math.hypot(u, l), h = u / g, y = -l / g, m = (p) => `rotate3d(${h.toFixed(4)},${y.toFixed(4)},0,${p}deg)`, w = (p) => `translate(${(h * p * l).toFixed(1)}px,${(y * p * l).toFixed(1)}px) scale(1.07)`;
  a(n(".hcci-ovr-freeze"), [{ opacity: 0 }, { opacity: 1 }], 0, 45);
  const v = "polygon(var(--ovr-lean) 0, calc(var(--ovr-lean) + 3px) 0, calc(var(--ovr-lean) + 3px) 0, var(--ovr-lean) 0)", b = "polygon(0 100%, 3px 100%, 3px 100%, 0 100%)", A = "polygon(var(--ovr-lean) 0, calc(var(--ovr-lean) + 3px) 0, 3px 100%, 0 100%)";
  for (const [p, O] of s.entries()) {
    const Z = N.cut + p * 14;
    a(O, [{ clipPath: p % 2 ? b : v }, { clipPath: A }], Z, Z + 95, "cubic-bezier(.7,0,.3,1)"), p > 0 && p < Jt && a(O, [{ opacity: 1 }, { opacity: 1 }], 0, N.impact, "linear", "backwards");
  }
  a(n(".hcci-ovr-slab"), [
    { transform: "translate(calc(var(--ovr-lean) * 1.15), -115vh)" },
    { transform: "none" }
  ], N.flip, N.flip + 230, Tt), a(n(".hcci-ovr-echo"), [
    { transform: "translate(calc(var(--ovr-lean) * -1.15), 115vh)" },
    { transform: "none" }
  ], N.flip + 40, N.flip + 300, Tt);
  for (const [p, O] of c(".hcci-ovr-louver").entries()) {
    const Z = N.flip + p * 38;
    a(O, [
      { opacity: 0, transform: m(-98) },
      { opacity: 1, transform: m(-98), offset: 0.02 },
      { opacity: 1, transform: m(10), offset: 0.68 },
      { opacity: 1, transform: m(0) }
    ], Z, Z + 230, Tt), a(O.querySelector(".hcci-ovr-face"), [{ opacity: 1 }, { opacity: 1, offset: 0.42 }, { opacity: 0 }], Z, Z + 230, "linear", "backwards");
    const $ = O.querySelector(".hcci-ovr-art");
    a($, [
      { transform: w(de[p] * 0.055) },
      { transform: w(de[p] * 0.024), offset: 0.97, easing: $t },
      { transform: "none" }
    ], Z, N.impact, "linear", "backwards"), a(O.querySelector(".hcci-ovr-tint"), [{ opacity: 1 }, { opacity: 1 }], 0, N.impact, "linear", "backwards"), t.classList.contains("hcci-flash-off") || a(O.querySelector(".hcci-ovr-neg"), [{ opacity: 1 }, { opacity: 1 }], N.impact, N.impact + 48, "linear", "none"), r($, [{ transform: "none" }, { transform: "scale(1.04)" }], N.impact);
  }
  const L = n(".hcci-ovr-band");
  a(L, [
    { clipPath: "inset(49% 100% 49% 0)", backgroundColor: "#fff" },
    { clipPath: "inset(49% 0 49% 0)", backgroundColor: "#fff" }
  ], N.wind, N.impact, "cubic-bezier(.6,0,.9,.4)", "backwards"), a(L, [
    { clipPath: "inset(49% 0 49% 0)", backgroundColor: "#fff" },
    { clipPath: "inset(0 0 0 0)", backgroundColor: "#fff", offset: 0.55 },
    { clipPath: "inset(0 0 0 0)" }
  ], N.impact, N.impact + 110, Tt, "none"), a(n(".hcci-copy"), [{ opacity: 0, easing: $t }, { opacity: 1 }], 0, N.impact + 14), a(n(".hcci-title"), [
    { transform: "skewX(-9deg) scale(1.55)" },
    { transform: "skewX(-9deg) scale(.96)", offset: 0.4, easing: $t },
    { transform: "skewX(-9deg) scale(.96)", offset: 0.62 },
    { transform: "skewX(-9deg)" }
  ], N.impact + 14, N.impact + 150, Tt, "none"), a(n(".hcci-ovr-flash"), [
    { opacity: 0 },
    { opacity: "var(--flash-peak, .14)", offset: 0.1 },
    { opacity: 0 }
  ], N.impact, N.impact + 140), a(n(".hcci-stage"), [
    { transform: "none" },
    { transform: "translate(calc(var(--hcci-shake) * 1.4), calc(var(--hcci-shake) * -.5))", offset: 0.16 },
    { transform: "none" }
  ], N.impact, N.impact + 180, "ease-out", "none");
  for (const [p, O] of c(".hcci-ovr-chips i").entries()) {
    const Z = p % 2 ? 1 : -1;
    a(O, [
      { opacity: 1, transform: "rotate(var(--ovr-tilt)) translateX(0)" },
      { opacity: 1, offset: 0.65 },
      { opacity: 0, transform: `rotate(var(--ovr-tilt)) translateX(${Z * (34 + p * 5)}vw) rotate(${Z * 160}deg)` }
    ], N.impact, N.impact + 300 + p * 12, "cubic-bezier(.1,.7,.3,1)", "none");
  }
  return r(n(".hcci-ovr-echo-art"), [{ transform: "scale(1.45)" }, { transform: "scale(1.45) translateX(-1.6vw)" }], N.flip + 300), r(n(".hcci-ovr-slab"), [{ transform: "none" }, { transform: "translate(calc(var(--ovr-lean) * -.05), 5vh)" }], N.flip + 230), { animations: i, audioDelay: N.cut * o };
}
function Ea(t, e) {
  var l;
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return [];
  const i = [], o = (u, g, h, y, m = "cubic-bezier(.6,.02,.9,.5)") => {
    u && i.push(u.animate(g, { delay: h * e, duration: (y - h) * e, easing: m, fill: "forwards" }));
  }, a = (u) => t.querySelector(u);
  o(a(".hcci-copy"), [{ opacity: 0, transform: "rotate(var(--ovr-tilt)) translateX(7vw)" }], 0, 0.28), o(a(".hcci-ovr-band"), [
    { clipPath: "inset(0 0 0 0)" },
    { clipPath: "inset(49% 0 49% 0)", backgroundColor: "#fff", offset: 0.5 },
    { clipPath: "inset(49% 0 49% 100%)", backgroundColor: "#fff" }
  ], 0, 0.6, "linear");
  const r = Array.from(t.querySelectorAll(".hcci-ovr-louver")), n = t.clientHeight || 1, c = Math.max(0, (((l = t.querySelector(".hcci-ovr-cut")) == null ? void 0 : l.getBoundingClientRect().width) ?? 3) - 3), s = Math.hypot(c, n);
  for (const [u, g] of r.entries()) {
    const h = 0.08 + (r.length - 1 - u) * 0.07;
    o(g, [
      { opacity: 1, transform: `rotate3d(${(c / s).toFixed(4)},${(-n / s).toFixed(4)},0,96deg)`, offset: 0.98, easing: $t },
      { opacity: 0, transform: `rotate3d(${(c / s).toFixed(4)},${(-n / s).toFixed(4)},0,96deg)` }
    ], h, h + 0.42);
  }
  for (const u of t.querySelectorAll(".hcci-ovr-cut")) o(u, [{ opacity: 0 }], 0.08, 0.2, $t);
  return o(a(".hcci-ovr-slab"), [{ transform: "translate(calc(var(--ovr-lean) * -1.15), 115vh)" }], 0.12, 0.82), o(a(".hcci-ovr-echo"), [{ transform: "translate(calc(var(--ovr-lean) * 1.15), -115vh)" }], 0.06, 0.76), o(a(".hcci-ovr-freeze"), [{ opacity: 0 }], 0.62, 1, "linear"), i;
}
const Ct = "system-collapse", La = 420, yt = 12, $a = 0.1, Pa = 0.07, x = { boot: 170, fault: 350, title: 560, freeze: 770, collapse: 880, impact: 1240, settle: 1400 }, W = "steps(1, end)", he = "cubic-bezier(.14,.82,.2,1)", Ia = [
  [250, 4, 1.5, 0],
  [284, 4, 0, 0],
  [350, 7, -4, 0],
  [350, 8, 2.5, 0],
  [350, 2, 0, 1],
  [384, 8, 0, 0],
  [480, 3, 6, 0],
  [480, 7, -4, 1],
  [480, 10, 0, 1],
  [560, 0, -3, 0],
  [560, 5, 0, 1],
  [560, 9, 8, 0],
  [620, 2, -7, 2],
  [620, 6, 0, 1],
  [620, 11, 3, 0],
  [668, 4, 5, 1],
  [668, 9, 8, 2],
  [668, 1, 0, 1],
  [668, 7, 2, 1],
  [706, 5, -9, 2],
  [706, 8, 0, 1],
  [706, 0, -3, 1],
  [734, 10, -5, 2],
  [734, 3, 6, 1],
  [734, 11, 3, 1],
  [734, 1, 4, 1],
  [752, 7, 2, 2],
  [752, 4, 5, 2],
  [752, 2, 10, 2],
  [752, 8, -6, 1]
], Na = [[560, 590, 3], [706, 730, 6], [752, 770, 9]], Da = [[[350, 384], [706, 734]], [[620, 668], [752, 770]], [[480, 520]]], Ra = [
  { drift: [[350, "translate(-.5vw,.4vh)"], [668, "translate(-1.1vw,.2vh) rotate(-3deg)"]], fall: 40, exit: "translate(-4vw,125vh) rotate(-80deg)" },
  { drift: [[560, "translate(.7vw,-.3vh)"], [734, "translate(.9vw,.8vh) rotate(5deg)"]], fall: 150, exit: "translate(5vw,125vh) rotate(95deg)" },
  { drift: [[620, "translate(-.3vw,1vh) rotate(-6deg)"]], fall: 230, exit: "translate(-2vw,60vh) rotate(-50deg)" },
  { drift: [[480, "translate(.4vw,.3vh)"], [706, "translate(1.3vw,.9vh) rotate(8deg)"]], fall: 300, exit: "translate(3vw,60vh) rotate(60deg)" }
];
function Za(t) {
  const e = t === "low" ? 0 : t === "high" ? 3 : 2;
  return `<div class="hcci-col-freeze"></div>
    <div class="hcci-col-tears">${"<i></i>".repeat(e)}</div>
    <div class="hcci-col-flash"></div>`;
}
function Oa(t, e) {
  const i = t.naturalWidth, o = t.naturalHeight;
  if (!i || !o) return !1;
  try {
    const a = document.createElement("canvas");
    a.width = 80, a.height = yt * 8;
    const r = a.getContext("2d");
    if (!r) return !1;
    const n = Math.min(i, o * 0.8), c = Math.min(o, i / 0.8);
    r.imageSmoothingQuality = "high";
    const s = a.width / n, l = a.height / c;
    r.drawImage(t, (n - i) / 2 * s, (c - o) * 0.25 * l, i * s, o * l);
    for (const [u, g] of e.entries()) {
      const [h, y] = Array.from(g.querySelectorAll("canvas"));
      h.width = 40, h.height = 4;
      const m = h.getContext("2d");
      m.imageSmoothingQuality = "high", m.drawImage(a, 0, u * 8, 80, 8, 0, 0, 40, 4), y.width = 10, y.height = 1;
      const w = y.getContext("2d");
      w.imageSmoothingQuality = "high", w.drawImage(h, 0, 0, 40, 4, 0, 0, 10, 1);
    }
    return !0;
  } catch {
    return !1;
  }
}
function Fa(t, e) {
  var u, g;
  const i = (((u = t.querySelector(".hcci-title")) == null ? void 0 : u.textContent) ?? "").trim().split(/\s+/).filter(Boolean);
  t.style.setProperty("--col-word", String(Math.max(6, ...i.map((h) => h.length)))), t.style.setProperty("--col-lines", String(Math.max(1, i.length)));
  const o = t.querySelector(".hcci-visual"), a = t.querySelector(".hcci-portrait-frame > .hcci-portrait");
  if (!e || !o || !a) return;
  o.querySelectorAll(".hcci-col-backing, .hcci-col-rows, .hcci-col-brackets, .hcci-col-floor, .hcci-col-beam").forEach((h) => h.remove()), (g = t.querySelector(".hcci-col-cursor")) == null || g.remove();
  const r = (h, y) => {
    const m = document.createElement(h);
    return m.className = y, m;
  }, n = r("div", "hcci-col-rows hcci-col-plain"), c = [];
  for (let h = 0; h < yt; h++) {
    const y = r("div", "hcci-col-row");
    y.style.setProperty("--r", String(h));
    const m = r("div", "hcci-col-fall"), w = r("div", "hcci-col-band"), v = a.cloneNode(!0);
    v.classList.remove("hcci-portrait"), v.classList.add("hcci-col-art"), w.append(v, r("canvas", "hcci-col-lod"), r("canvas", "hcci-col-lod"), r("i", "hcci-col-dead")), m.append(w), y.append(m), n.append(y), c.push(y);
  }
  const s = r("div", "hcci-col-brackets");
  s.innerHTML = "<i></i><i></i><i></i><i></i>", o.append(r("div", "hcci-col-backing"), n, s, r("div", "hcci-col-floor"), r("div", "hcci-col-beam"));
  const l = t.querySelector(".hcci-copy");
  if (l != null && l.children.length && l.append(r("i", "hcci-col-cursor")), a instanceof HTMLImageElement) {
    const h = () => n.classList.toggle("hcci-col-plain", !Oa(a, c));
    a.complete && h(), a.addEventListener("load", h, { once: !0 });
  }
}
function Ha(t, e) {
  const i = [];
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return { animations: i, audioDelay: 0 };
  const o = Math.min(1, (e - 100) / x.settle), a = (m, w, v, b, A = "linear", L = "both") => {
    m && i.push(m.animate(w, { delay: v * o, duration: Math.max(1, (b - v) * o), easing: A, fill: L }));
  }, r = (m) => t.querySelector(m), n = (m) => Array.from(t.querySelectorAll(m)), c = (m, w, v = w) => [
    { ...w, offset: 0, easing: W },
    ...m.map(([b, A]) => ({ ...A, offset: b / x.freeze, easing: W })),
    { ...v, offset: 1 }
  ];
  a(r(".hcci-col-freeze"), [{ opacity: 0 }, { opacity: 1 }], 0, x.boot);
  const s = [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }], l = r(".hcci-col-rows");
  a(l, s, 40, x.boot, "steps(6, end)", "backwards"), a(r(".hcci-col-brackets"), [{ opacity: 0, transform: "scale(.9)" }, { opacity: 1, transform: "none" }], 0, 120, he);
  for (const [m, w] of n(".hcci-col-row").entries()) {
    const v = Ia.filter((E) => E[1] === m);
    a(w, c(v.map(([E, , p]) => [E, { transform: `translateX(${p}%)` }]), { transform: "none" }), 0, x.freeze);
    const [b, A] = Array.from(w.querySelectorAll("canvas"));
    a(b, c(v.map(([E, , , p]) => [E, { opacity: p >= 1 ? 1 : 0 }]), { opacity: 0 }, { opacity: 1 }), 0, x.freeze), a(A, c(v.map(([E, , , p]) => [E, { opacity: p === 2 ? 1 : 0 }]), { opacity: 0 }, { opacity: 1 }), 0, x.freeze);
    const L = Na.filter((E) => E[2] === m);
    L.length && a(w.querySelector(".hcci-col-dead"), c(L.flatMap(([E, p]) => [[E, { opacity: 1 }], [p, { opacity: 0 }]]), { opacity: 0 }), 0, x.freeze);
  }
  a(l, c([[706, { transform: "translateY(2.5%)" }], [734, { transform: "none" }]], { transform: "none" }), 0, x.freeze);
  for (const [m, w] of n(".hcci-col-tears i").entries())
    a(w, c(Da[m].flatMap(([v, b]) => [[v, { opacity: 1 }], [b, { opacity: 0 }]]), { opacity: 0 }), 0, x.freeze);
  const u = n(".hcci-col-brackets i");
  for (const [m, w] of u.entries()) {
    const { drift: v, fall: b, exit: A } = Ra[m], L = { transform: v[v.length - 1][1] };
    a(w, c(v.map(([E, p]) => [E, { transform: p }]), { transform: "none" }, L), 0, x.freeze), a(w, [L, { transform: A }], x.collapse + b, x.collapse + b + 420, "cubic-bezier(.5,0,1,.6)", "forwards");
  }
  a(r(".hcci-copy"), [
    { opacity: 0, clipPath: "inset(0 0 100% 0)", easing: W },
    { opacity: 1, clipPath: "inset(0 0 66% 0)", offset: 0.34, easing: W },
    { opacity: 1, clipPath: "inset(0 0 33% 0)", offset: 0.67, easing: W },
    { opacity: 1, clipPath: "inset(-30%)" }
  ], x.title, x.title + 90);
  const g = x.impact - x.collapse;
  a(r(".hcci-col-backing"), [{ opacity: 1, easing: W }, { opacity: 0 }], 0, x.collapse);
  for (const [m, w] of n(".hcci-col-row").entries()) {
    const v = Math.sqrt(m / yt), b = Math.sqrt((m + 1) / yt);
    if (a(
      w.querySelector(".hcci-col-band"),
      [{ transform: "none" }, { transform: `scaleY(${Pa})` }],
      x.collapse + v * g,
      x.collapse + b * g,
      "ease-in",
      "both"
    ), m === yt - 1) continue;
    const A = `cubic-bezier(.3333,${(2 * b / (1 + b) / 3).toFixed(4)},.6667,${(1 - 2 / (1 + b) / 3).toFixed(4)})`;
    a(w.querySelector(".hcci-col-fall"), [
      { transform: "none" },
      { transform: `translateY(${((yt - 1 - m) * (1 - $a) * 100).toFixed(2)}%)` }
    ], x.collapse + b * g, x.impact, A, "both");
  }
  const h = r(".hcci-portrait-frame");
  a(h, [{ filter: "brightness(.45)" }, { filter: "brightness(.45)" }], 0, x.impact, "linear", "backwards"), a(h, [{ filter: "brightness(1.7)" }, { filter: "brightness(1)" }], x.impact, x.impact + 240, "ease-out", "none"), a(
    r(".hcci-col-floor"),
    [{ transform: "scaleX(0)", opacity: 1 }, { transform: "scaleX(1)", opacity: 1, offset: 0.5 }, { transform: "scaleX(1)", opacity: 0.55 }],
    x.impact,
    x.impact + 280,
    he
  ), a(r(".hcci-col-flash"), [
    { opacity: 0 },
    { opacity: "var(--flash-peak, .14)", offset: 0.1 },
    { opacity: 0 }
  ], x.impact, x.impact + 160), a(r(".hcci-stage"), [{ transform: "translateY(var(--hcci-shake))" }, { transform: "none" }], x.impact, x.impact + 170, "ease-out", "none"), a(l, [{ transform: "translateY(.5vh)" }, { transform: "none" }], x.impact, x.impact + 90, "ease-out", "none"), a(r(".hcci-copy"), [{ transform: "translateY(1.4vh)" }, { transform: "none" }], x.impact, x.impact + 110, "ease-out", "none");
  const y = x.settle * o;
  if (e > y) {
    const m = r(".hcci-portrait-frame > .hcci-portrait");
    m && i.push(m.animate(
      [{ transform: "none" }, { transform: "scale(1.035)" }],
      { delay: x.impact * o, duration: e - x.impact * o, fill: "forwards" }
    ));
    const w = r(".hcci-col-cursor");
    w && i.push(w.animate([
      { opacity: 1, easing: W },
      { opacity: 0, offset: 0.5, easing: W },
      { opacity: 1 }
    ], { delay: y, duration: 560, iterations: Math.max(1, Math.round((e - y) / 560)), fill: "forwards" }));
  }
  return { animations: i, audioDelay: x.fault * o };
}
function qa(t, e) {
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return [];
  const i = [], o = (r, n, c, s, l = "linear") => {
    r && i.push(r.animate(n, { delay: c * e, duration: (s - c) * e, easing: l, fill: "forwards" }));
  }, a = (r) => t.querySelector(r);
  o(a(".hcci-copy"), [
    { clipPath: "inset(-30% -30% 0 -30%)", easing: W },
    { clipPath: "inset(-30% -30% 34% -30%)", offset: 0.33, easing: W },
    { clipPath: "inset(-30% -30% 67% -30%)", offset: 0.66, easing: W },
    { clipPath: "inset(-30% -30% 100% -30%)", opacity: 0 }
  ], 0, 0.3), o(a(".hcci-col-floor"), [{ transform: "scaleX(0)" }], 0, 0.36, "cubic-bezier(.6,0,.9,.4)");
  for (const r of t.querySelectorAll(".hcci-col-brackets")) o(r, [{ opacity: 0 }], 0, 0.05);
  for (const r of [".hcci-portrait-frame", ".hcci-col-rows", ".hcci-col-backing"])
    o(a(r), [
      { transform: "scaleY(.004)", opacity: 1, offset: 0.97, easing: W },
      { transform: "scaleY(.004)", opacity: 0 }
    ], 0, 0.34, "cubic-bezier(.6,0,.9,.3)");
  return o(a(".hcci-col-beam"), [
    { opacity: 0, transform: "scaleX(.9)" },
    { opacity: 0, transform: "scaleX(.9)", offset: 0.26 },
    { opacity: 1, transform: "scaleX(1)", offset: 0.34 },
    { opacity: 1, transform: "scaleX(2.2)", offset: 0.5, easing: "cubic-bezier(.6,0,.9,.4)" },
    { opacity: 1, transform: "scaleX(.012)", offset: 0.8 },
    { opacity: 1, transform: "scaleX(.012)", offset: 0.88 },
    { opacity: 0, transform: "scaleX(0)" }
  ], 0, 1), o(a(".hcci-col-tears"), [{ opacity: 0 }], 0, 0.05), o(a(".hcci-col-freeze"), [{ opacity: 0 }], 0.6, 1), i;
}
const re = [
  { id: "strike", label: "Neon Strike", description: "A diagonal energy slash, speed trails and an impact wave.", shake: 0.7 },
  { id: "breach", label: "Panel Breach", description: "An energized seam opens to reveal the portrait between blast doors.", shake: 0.5 },
  { id: "signal", label: "Signal Bloom", description: "A holographic portrait resolves inside a precision targeting array.", shake: 0.15 },
  { id: "rift", label: "Rift Slash", description: "A jagged energy blade tears through armored plates and reveals the character.", shake: 0.4 },
  { id: "shatter", label: "Quantum Shatter", description: "Prismatic shards assemble around the portrait, then scatter into light.", shake: 0.65 },
  { id: "reactor", label: "Reactor Surge", description: "Charging rails ignite a vertical plasma column and overcharge halo.", shake: 0.85 },
  { id: "void", label: "Void Collapse", description: "An accretion disk contracts into an eclipse before releasing the portrait.", shake: 0.4 },
  { id: "railgun", label: "Railgun Salvo", description: "Targeting rails converge into a horizontal lance with a ballistic reveal.", shake: 1 },
  { id: "eclipse", label: "Astral Eclipse", description: "An orbital crown and star field frame a slow celestial reveal.", shake: 0 },
  { id: st, label: "Manga Overdrive", description: "A burst of ink cuts to a halftone portrait and a full-color manga impact.", shake: 0.7 },
  { id: wt, label: "Shattered Fate", description: "The portrait breaks into eighteen shards, exposing a fractured title behind it.", shake: 0.65 },
  { id: "overdrive", label: "Cyber Overdrive", description: "A perspective data tunnel accelerates into a segmented hologram.", shake: 0.45 },
  { id: St, label: "Reality Override", description: "The scene freezes and is cut into slanted louvers that flip open on the portrait, then lock under a title band.", shake: 0.8 },
  { id: Ct, label: "System Collapse", description: "The portrait loses sync and resolution row by row, freezes, then pancakes to the floor before powering off.", shake: 0.6 }
];
function _t(t) {
  var e;
  return ((e = re.find((i) => i.id === t)) == null ? void 0 : e.id) ?? "strike";
}
function Ot(t) {
  return re.find((e) => e.id === _t(t));
}
const R = (t, e = 1) => Array.from({ length: e }, (i, o) => `<i class="hcci-fx hcci-fx-${t}" style="--i:${o};--n:${e};--v:${o % 4};--d:${o % 5};--s:${o % 3}"></i>`).join("");
function _a(t, e = "standard") {
  const i = _t(t), o = e === "low" ? 8 : e === "high" ? 28 : 16, a = R("particle", o), r = R("wave", 2);
  switch (i) {
    case "strike":
      return R("slash", 2) + R("speed", 7) + r + a;
    case "breach":
      return '<div class="hcci-tear hcci-tear-top"><span></span></div><div class="hcci-tear hcci-tear-bottom"><span></span></div>' + R("door", 2) + a;
    case "signal":
      return R("reticle", 3) + R("tick", 12) + R("sweep") + r;
    case wt:
      return ca();
    case st:
      return pa(e);
    case "rift":
      return ba(e);
    case St:
      return Ta(e);
    case Ct:
      return Za(e);
    case "shatter":
      return R("shard", o) + R("prism", 2) + r;
    case "reactor":
      return R("rail", 6) + R("column") + R("corona", 2) + a;
    case "void":
      return R("disk", 2) + R("horizon") + R("infall", o) + r;
    case "railgun":
      return R("sight", 4) + R("lance") + R("wake", 7) + a;
    case "eclipse":
      return R("moon") + R("crown", 2) + R("star", o) + R("orbit", 3);
    case "overdrive":
      return R("gate", 5) + R("data", o) + R("sweep") + r;
  }
}
const vt = [], xt = /* @__PURE__ */ new Set();
let Zt = !1;
function At(t) {
  const e = document.createElement("div");
  return e.textContent = String(t ?? ""), e.innerHTML.replace(/"/g, "&quot;");
}
function za(t) {
  var i, o, a, r, n;
  if (!t.preview && S(d.suppressCutins) === !0 || t != null && t.blind && !((i = game.user) != null && i.isGM) || Array.isArray(t == null ? void 0 : t.whisper) && t.whisper.length && !t.whisper.includes((o = game.user) == null ? void 0 : o.id) && !((a = game.user) != null && a.isGM))
    return !1;
  const e = (t == null ? void 0 : t.audience) ?? S(d.audience);
  return e === ct.everyone ? !0 : e === ct.gm ? ((r = game.user) == null ? void 0 : r.isGM) === !0 : e === ct.triggeringPlayer ? ((n = game.user) == null ? void 0 : n.id) === (t == null ? void 0 : t.userId) : !0;
}
async function Ga(t, e) {
  var i, o;
  if (t)
    try {
      const a = Math.min(1, Math.max(0, Number(e ?? S(d.volume) ?? 0.8))), r = Math.min(1, Math.max(0, Number(S(d.localVolume) ?? 1))), n = a * r;
      if ((o = (i = foundry.audio) == null ? void 0 : i.AudioHelper) != null && o.play)
        return foundry.audio.AudioHelper.play({ src: t, volume: n, autoplay: !0, loop: !1 }, !1);
      const c = globalThis.AudioHelper;
      if (c != null && c.play)
        return c.play({ src: t, volume: n, autoplay: !0, loop: !1 }, !1);
      const s = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), l = new Audio(t);
      return l.volume = n * s, await l.play(), l;
    } catch (a) {
      return kt("Audio playback failed.", { src: t, error: a }), null;
    }
}
function jt(t) {
  try {
    if (!t) return;
    if (typeof t.stop == "function") {
      t.stop();
      return;
    }
    typeof t.pause == "function" && (t.pause(), t.currentTime = 0);
  } catch (e) {
    kt("Audio stop failed.", e);
  }
}
function Ba(t) {
  var it, ot;
  const e = Ot(t.animationStyle), i = e.id, o = t.triggerKind === "failure" ? "failure" : "success", a = i === "rift", r = i === st, n = i === wt, c = i === St, s = i === Ct, l = a || r || n || c || s, u = t.accentColor || (r ? oe : (a || n || c || s) && o === "failure" ? "#ff4d7d" : "#69e8ff"), g = t.imagePath ? `<img class="hcci-portrait" src="${At(t.imagePath)}" alt="">` : '<div class="hcci-portrait hcci-portrait-fallback"><i class="fa-solid fa-user-astronaut"></i></div>', h = Math.max(1, String(t.overlayText ?? "").length), y = String(t.overlayText ?? "").trim().split(/\s+/), m = n && y.length > 1 ? `${At(y.slice(0, -1).join(" "))} <span>${At(y.at(-1))}</span>` : At(t.overlayText), w = t.textEnabled && t.overlayText ? `<div class="hcci-title" style="--hcci-title-chars: ${h}">${m}</div>` : "", v = t.actorName || "", b = String(S(d.motionMode) ?? "system"), A = ((ot = (it = globalThis.matchMedia) == null ? void 0 : it.call(globalThis, "(prefers-reduced-motion: reduce)")) == null ? void 0 : ot.matches) === !0, L = b === "system" || l && A && b === "full" ? A ? "reduced" : "full" : ["full", "reduced", "still"].includes(b) ? b : "full", E = String(S(d.flashMode) ?? "soft"), p = ["full", "soft", "off"].includes(E) ? E : "soft", O = S(d.effectIntensity), Z = ["low", "standard", "high"].includes(O) ? O : "standard", $ = document.createElement("div");
  $.className = `hcci-overlay hcci-style-${i} hcci-kind-${o} hcci-motion-${L} hcci-flash-${p} hcci-detail-${Z}`, $.style.setProperty("--hcci-accent", u);
  const et = S(d.animationFont);
  $.style.setProperty("--hcci-font", et === "classic" ? '"Orbitron", "Eurostile", "Agency FB", Impact, sans-serif' : '"HCCI AICON", "Orbitron", sans-serif');
  const at = Number(S(d.shakeIntensity) ?? 0.5);
  $.style.setProperty("--hcci-shake", `${e.shake * (Number.isFinite(at) ? Math.max(0, Math.min(1, at)) : 0.5) * 9}px`), $.setAttribute("aria-hidden", "true");
  const K = L === "full" || r ? _a(i, Z) : "";
  $.innerHTML = `
    ${r || n || c || s ? "" : `<div class="${a ? "hcci-rift-flash" : "hcci-flash"}"></div>`}
    ${l ? K : ""}
    <div class="hcci-atmosphere"></div>
    <section class="hcci-stage">
      <div class="hcci-visual">
      <div class="hcci-effects">${l ? "" : K}</div>
      <div class="hcci-portrait-frame">
        ${r ? `<div class="hcci-manga-artwork">${g}</div><div class="hcci-manga-dots"></div>` : g}
      </div>
      ${r ? '<div class="hcci-manga-panel-glint"></div>' : ""}
      <div class="hcci-frame-accent"></div>
      </div>
      <div class="hcci-copy">
        ${w}
        ${v ? `<div class="hcci-subtitle">${At(v)}</div>` : ""}
      </div>
    </section>
  `;
  const U = n && L === "full", Y = () => {
    U && la($), c && L === "full" && xa($), s && Fa($, L === "full");
  };
  Y();
  const _ = $.querySelector("img.hcci-portrait");
  if (_ && L === "full" && (i === "shatter" || i === "overdrive")) {
    const q = [
      "polygon(0 0,50% 0,50% 50%)",
      "polygon(50% 0,100% 0,50% 50%)",
      "polygon(100% 0,100% 100%,50% 50%)",
      "polygon(100% 100%,50% 100%,50% 50%)",
      "polygon(50% 100%,0 100%,50% 50%)",
      "polygon(0 100%,0 0,50% 50%)"
    ];
    for (let H = 0; H < 6; H++) {
      const X = document.createElement("div");
      X.className = "hcci-portrait-echo", X.style.setProperty("--piece", String(H)), X.style.setProperty("--dx", `${H % 2 ? 1 : -1}`), X.style.setProperty("--dy", `${H < 3 ? -1 : 1}`), X.style.clipPath = i === "shatter" ? q[H] : `inset(${H * 100 / 6}% 0 ${100 - (H + 1) * 100 / 6}% 0)`;
      const lt = _.cloneNode();
      lt.className = "", X.appendChild(lt), $.querySelector(".hcci-visual").appendChild(X);
    }
  }
  return _ == null || _.addEventListener("error", () => {
    const q = t.preview ? t.fallbackImagePath : void 0;
    if (q && _.getAttribute("src") !== q) {
      _.src = q, $.querySelectorAll(".hcci-portrait-echo img").forEach((X) => {
        X.src = q;
      }), Y();
      return;
    }
    $.querySelectorAll(".hcci-portrait-echo").forEach((X) => X.remove());
    const H = document.createElement("div");
    H.className = "hcci-portrait hcci-portrait-fallback", H.innerHTML = '<i class="fa-solid fa-user-astronaut"></i>', _.replaceWith(H), Y();
  }), $;
}
async function Va(t) {
  if (!za(t)) return;
  const e = Number(t.duration ?? S(d.duration) ?? 2500), i = Math.min(8e3, Math.max(800, Number.isFinite(e) ? e : 2500)), o = Ba(t);
  o.style.setProperty("--hcci-duration", `${i}ms`), o.style.setProperty("--hcci-intro", `${Math.min(1e3, (i - 180) * 0.85)}ms`);
  let a = !1, r, n, c, s = [], l;
  try {
    document.body.appendChild(o);
    const u = o.classList.contains(`hcci-style-${wt}`), g = o.classList.contains(`hcci-style-${St}`), h = o.classList.contains(`hcci-style-${Ct}`), y = u ? ua : g ? Ma : h ? La : 180, m = i - y, w = o.classList.contains("hcci-style-rift"), v = o.classList.contains(`hcci-style-${st}`), b = g ? Aa(o, m) : h ? Ha(o, m) : u ? da(o, m) : v ? ya(o, m) : w ? Ca(o, m) : void 0;
    b && (s = b.animations);
    const A = () => {
      Ga(t.audioPath, t.volume).then((L) => {
        a ? jt(L) : r = L;
      });
    };
    t.audioPath && (b != null && b.audioDelay) ? c = window.setTimeout(A, b.audioDelay) : A(), await new Promise((L) => {
      n = window.setTimeout(E, m);
      function E() {
        window.clearTimeout(n), globalThis.removeEventListener("keydown", l), L();
      }
      l = (p) => {
        p.key === "Escape" && E();
      }, globalThis.addEventListener("keydown", l);
    }), a = !0, window.clearTimeout(c), jt(r), r = null, o.classList.add("hcci-exiting"), g ? s.push(...Ea(o, y)) : h ? s.push(...qa(o, y)) : u ? s.push(...ha(o, y)) : v ? s.push(...va(o, y)) : w && s.push(...ka(o, y)), await new Promise((L) => window.setTimeout(L, y));
  } finally {
    a = !0, window.clearTimeout(n), window.clearTimeout(c), s.forEach((u) => u.cancel()), l && globalThis.removeEventListener("keydown", l), jt(r), o.remove();
  }
}
async function Xa(t) {
  var e, i;
  return !((e = game.user) != null && e.isGM) || Zt ? !1 : (await mt({
    ...t,
    id: foundry.utils.randomID(),
    userId: ((i = game.user) == null ? void 0 : i.id) ?? null,
    audience: ct.gm,
    preview: !0
  }), !0);
}
async function ja() {
  if (!Zt) {
    Zt = !0;
    try {
      for (; vt.length; ) {
        const t = vt.shift();
        try {
          await Va(t);
        } catch (e) {
          kt("Cut-in playback failed; continuing queue.", e);
        }
      }
    } finally {
      Zt = !1;
    }
  }
}
function mt(t) {
  if (t) {
    if (t.id) {
      if (xt.has(t.id)) return;
      xt.add(t.id);
      const e = xt.values().next().value;
      xt.size > 100 && e && xt.delete(e);
    }
    return vt.push(t), vt.length > 3 && vt.splice(1, vt.length - 3), ja();
  }
}
const dt = /* @__PURE__ */ new Set(), te = /* @__PURE__ */ new Set();
function Ka(t) {
  return !!(t != null && t.id) && te.has(t.id);
}
function j(t) {
  return t ? Array.isArray(t) ? t : [t] : [];
}
function Ua(t) {
  var o, a, r, n;
  const e = [
    ...j(t == null ? void 0 : t.rolls),
    ...j(t == null ? void 0 : t.roll),
    ...j(t == null ? void 0 : t._rolls),
    ...j((a = (o = t == null ? void 0 : t.flags) == null ? void 0 : o.dnd5e) == null ? void 0 : a.roll),
    ...j((n = (r = t == null ? void 0 : t.flags) == null ? void 0 : r.dnd5e) == null ? void 0 : n.rolls)
  ], i = /* @__PURE__ */ new Set();
  return e.filter((c) => !c || i.has(c) ? !1 : (i.add(c), !0));
}
function Ya(t) {
  const e = [], i = [...j(t == null ? void 0 : t.terms), ...j(t == null ? void 0 : t.dice), ...j(t == null ? void 0 : t._terms), ...j(t == null ? void 0 : t._dice)], o = /* @__PURE__ */ new Set();
  for (; i.length; ) {
    const a = i.shift();
    !a || o.has(a) || (o.add(a), e.push(a), i.push(
      ...j(a.terms),
      ...j(a.dice),
      ...j(a.rolls),
      ...j(a._terms),
      ...j(a._dice)
    ));
  }
  return e;
}
function Ie(t, e) {
  var r, n, c, s, l, u, g, h;
  const i = (t == null ? void 0 : t.flags) ?? {}, o = ((n = (r = i.dnd5e) == null ? void 0 : r.roll) == null ? void 0 : n.type) ?? ((s = (c = i.dnd5e) == null ? void 0 : c.roll) == null ? void 0 : s.rollType), a = (u = (l = i.pf2e) == null ? void 0 : l.context) == null ? void 0 : u.type;
  return [(g = e == null ? void 0 : e.options) == null ? void 0 : g.type, (h = e == null ? void 0 : e.options) == null ? void 0 : h.rollType, o, a].some((y) => String(y ?? "").toLowerCase().includes("damage"));
}
function Wa(t) {
  const e = [];
  for (const i of Ya(t)) {
    const o = Number((i == null ? void 0 : i.faces) ?? (i == null ? void 0 : i._faces));
    if (!(o !== tt() || !Array.isArray(i.results)))
      for (const a of i.results) {
        if (a.active === !1 || a.discarded === !0 || a.rerolled === !0) continue;
        const r = Number(a.result ?? a.value ?? a.total);
        Number.isInteger(r) && r >= 1 && r <= o && e.push(r);
      }
  }
  return e;
}
function Qa(t) {
  return t ? t instanceof HTMLElement ? t : t[0] instanceof HTMLElement ? t[0] : null : null;
}
function Ja(t) {
  var n;
  const e = Qa(t);
  if (!e) return [];
  const i = [], o = `d${tt()}`, a = [
    `.dice-rolls .roll.${o}`,
    `.dice-rolls .roll.die.${o}`,
    `.dice-tooltip .roll.${o}`,
    `.dice-tooltip .dice.${o} .roll`
  ], r = /* @__PURE__ */ new Set();
  for (const c of a)
    e.querySelectorAll(c).forEach((s) => r.add(s));
  for (const c of r) {
    if (c.classList.contains("discarded") || c.classList.contains("rerolled") || c.classList.contains("ignored") || c.classList.contains("inactive"))
      continue;
    const s = Number((n = c.textContent) == null ? void 0 : n.trim());
    Number.isInteger(s) && s >= 1 && s <= tt() && i.push(s);
  }
  return i;
}
function Ne(t, e) {
  return `${t}:${e}`;
}
function ti() {
  return Ne("gm", "default");
}
function ei(t) {
  return _t(t);
}
function De(t, e) {
  var o, a, r, n;
  if (!t || !e) return !1;
  const i = ((a = (o = globalThis.CONST) == null ? void 0 : o.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3;
  return Number(((r = t.ownership) == null ? void 0 : r[e]) ?? ((n = t.ownership) == null ? void 0 : n.default) ?? 0) >= i;
}
function Re(t) {
  var i;
  const e = (t == null ? void 0 : t.speaker) ?? {};
  return e.actor ? ((i = game.actors) == null ? void 0 : i.get(e.actor)) ?? null : t != null && t.actor ? t.actor : null;
}
function ai(t) {
  var o, a, r;
  const e = (t == null ? void 0 : t.author) ?? (t == null ? void 0 : t.user);
  if (e && typeof e == "object") return e.id ? ((o = game.users) == null ? void 0 : o.get(e.id)) ?? e : null;
  const i = e ?? ((a = t == null ? void 0 : t._source) == null ? void 0 : a.author) ?? (t == null ? void 0 : t.userId);
  return i ? ((r = game.users) == null ? void 0 : r.get(i)) ?? null : null;
}
function Ze(t, e) {
  var o;
  const i = ai(t);
  if (i && !i.isGM) return i;
  if (e) {
    const a = (o = game.users) == null ? void 0 : o.find((r) => !r.isGM && De(e, r.id));
    if (a) return a;
  }
  return i ?? null;
}
function pe(t = {}, e, i, o = !1) {
  const a = e === "failure" ? Me() : ae(), r = S(e === "failure" ? d.defaultFailureText : d.defaultText), n = e === "failure" ? t.failure ?? {} : t, c = ei(n.animationStyle), s = c === st ? oe : e === "failure" ? "#ff4d7d" : "#69e8ff", l = Number(n.threshold);
  return {
    kind: e,
    enabled: n.enabled !== !1,
    threshold: Number.isInteger(l) && l >= 1 && l <= tt() ? l : a,
    duration: Lt(n.duration) ?? S(d.duration),
    animationStyle: c,
    imagePath: (o ? i == null ? void 0 : i.img : "") || n.imagePath || (i == null ? void 0 : i.img) || "",
    audioPath: n.audioPath || "",
    overlayText: n.overlayText || r,
    accentColor: n.accentColor || s
  };
}
function Pt(t, e, i = "success") {
  const o = Yt(), a = e ? o[Ne("actor", e.id)] : null, r = (t == null ? void 0 : t.isGM) === !0, n = r ? o[ti()] : null;
  if (!e && !r && !a)
    return pe({ enabled: !1 }, i, e);
  const c = r && !a && !!(e != null && e.img);
  return pe(a ?? n ?? {}, i, e, c);
}
function Oe(t, e, i, o, a) {
  return a.enabled ? {
    id: foundry.utils.randomID(),
    messageId: t.id,
    userId: (o == null ? void 0 : o.id) ?? null,
    actorId: (i == null ? void 0 : i.id) ?? null,
    userName: (o == null ? void 0 : o.name) ?? "",
    actorName: (i == null ? void 0 : i.name) ?? "",
    triggerKind: a.kind ?? "success",
    naturalResult: e,
    threshold: a.threshold,
    animationStyle: a.animationStyle,
    blind: t.blind === !0,
    whisper: Array.isArray(t.whisper) ? [...t.whisper] : [],
    imagePath: a.imagePath || "",
    audioPath: a.audioPath || "",
    overlayText: a.overlayText || "",
    accentColor: a.accentColor || "#69e8ff",
    textEnabled: S(d.textEnabled),
    duration: a.duration,
    volume: S(d.volume),
    audience: S(d.audience)
  } : (kt("Cut-in disabled for target.", { userId: o == null ? void 0 : o.id, actorId: i == null ? void 0 : i.id }), null);
}
function me(t, e, i = "success") {
  const o = Ua(t);
  if (!(t != null && t.isRoll) && !o.length) return null;
  for (const a of o) {
    if (Ie(t, a)) continue;
    const r = Wa(a).find((n) => xe(n, e, i));
    if (r) return r;
  }
  return null;
}
function ge(t, e, i, o = "success") {
  const a = Ja(e);
  return !a.length || Ie(t, {}) ? null : a.find((r) => xe(r, i, o)) ?? null;
}
function ye() {
  var i, o;
  const e = (((i = game.users) == null ? void 0 : i.filter((a) => a.active && a.isGM)) ?? []).sort((a, r) => a.id.localeCompare(r.id))[0];
  return ((o = game.user) == null ? void 0 : o.isGM) && (!e || e.id === game.user.id);
}
function Ft(t) {
  dt.add(t);
  const e = dt.values().next().value;
  dt.size > 200 && e && dt.delete(e);
}
function Fe(t) {
  var u, g, h;
  if (!(t != null && t.id) || (g = (u = t.flags) == null ? void 0 : u[C]) != null && g[ie] || dt.has(t.id)) return !0;
  const e = Re(t), i = Ze(t, e), o = Pt(i, e, "success"), a = Pt(i, e, "failure"), r = me(t, a.threshold, "failure"), n = r ? null : me(t, o.threshold, "success"), c = r ?? n;
  if (!c) return !1;
  const l = Oe(t, c, e, i, r ? a : o);
  return l ? (Ft(t.id), kt("Triggering cut-in.", l), (h = game.socket) == null || h.emit(Ht, { type: "play", payload: l }), mt(l), !0) : (Ft(t.id), !0);
}
function ii(t, e) {
  var g, h, y;
  if (!(t != null && t.id) || (h = (g = t.flags) == null ? void 0 : g[C]) != null && h[ie] || dt.has(t.id)) return !0;
  const i = Re(t), o = Ze(t, i), a = Pt(o, i, "success"), r = Pt(o, i, "failure"), n = ge(t, e, r.threshold, "failure"), c = n ? null : ge(t, e, a.threshold, "success"), s = n ?? c;
  if (!s) return !1;
  const u = Oe(t, s, i, o, n ? r : a);
  return u ? (Ft(t.id), kt("Triggering cut-in from rendered chat card.", u), (y = game.socket) == null || y.emit(Ht, { type: "play", payload: u }), mt(u), !0) : (Ft(t.id), !0);
}
function Kt(t, e) {
  t != null && t.id && globalThis.setTimeout(() => {
    var o;
    if (dt.has(t.id)) return;
    const i = ((o = game.messages) == null ? void 0 : o.get(t.id)) ?? t;
    Fe(i);
  }, e);
}
function oi() {
  var e;
  te.clear();
  for (const i of game.messages ?? [])
    i != null && i.id && te.add(i.id);
  Hooks.on("createChatMessage", (i) => {
    S(d.enabled) && ye() && (Fe(i) || (Kt(i, 100), Kt(i, 500), Kt(i, 1500)));
  });
  const t = (i, o) => {
    S(d.enabled) && (Ka(i) || ye() && ii(i, o));
  };
  Hooks.on("renderChatMessage", t), Hooks.on("renderChatMessageHTML", t), (e = game.socket) == null || e.on(Ht, (i) => {
    (i == null ? void 0 : i.type) === "play" && S(d.enabled) && mt(i.payload);
  });
}
function He(t, e = {}) {
  var n, c;
  const i = (n = game.users) == null ? void 0 : n.get(t), o = e.actorId ? (c = game.actors) == null ? void 0 : c.get(e.actorId) : (i == null ? void 0 : i.character) ?? null, a = e.triggerKind === "failure" ? "failure" : "success", r = Pt(i, o, a);
  return {
    id: foundry.utils.randomID(),
    userId: t,
    actorId: (o == null ? void 0 : o.id) ?? null,
    userName: (i == null ? void 0 : i.name) ?? "",
    actorName: (o == null ? void 0 : o.name) ?? "",
    naturalResult: e.naturalResult ?? r.threshold,
    triggerKind: a,
    threshold: e.threshold ?? r.threshold ?? ae(),
    animationStyle: e.animationStyle ?? r.animationStyle ?? "strike",
    imagePath: e.imagePath ?? r.imagePath ?? "",
    audioPath: e.audioPath ?? r.audioPath ?? "",
    overlayText: e.overlayText ?? r.overlayText ?? S(d.defaultText),
    accentColor: e.accentColor ?? r.accentColor ?? "#69e8ff",
    textEnabled: e.textEnabled ?? S(d.textEnabled),
    duration: e.duration ?? r.duration,
    volume: e.volume ?? S(d.volume),
    audience: e.audience ?? S(d.audience)
  };
}
function ri(t, e = {}) {
  var a, r;
  const i = (a = game.actors) == null ? void 0 : a.get(t), o = ((r = game.users) == null ? void 0 : r.find((n) => !n.isGM && De(i, n.id))) ?? game.user;
  return He(o == null ? void 0 : o.id, { ...e, actorId: t });
}
function ve(t) {
  var e;
  (e = game.socket) == null || e.emit(Ht, { type: "play", payload: t }), mt(t);
}
function qe() {
  var t, e, i;
  return ((e = (t = globalThis.foundry) == null ? void 0 : t.applications) == null ? void 0 : e.api) ?? ((i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) ?? null;
}
function _e() {
  var t, e, i;
  return ((e = (t = globalThis.foundry) == null ? void 0 : t.appv1) == null ? void 0 : e.api) ?? ((i = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : i.api) ?? null;
}
function ni(t = {}, e = {}) {
  var o, a, r;
  const i = ((a = (o = globalThis.foundry) == null ? void 0 : o.utils) == null ? void 0 : a.mergeObject) ?? ((r = foundry == null ? void 0 : foundry.utils) == null ? void 0 : r.mergeObject);
  return typeof i == "function" ? i(t, e, { inplace: !1 }) : { ...t, ...e };
}
function ci() {
  var t, e, i, o, a;
  return ((i = (e = (t = globalThis.foundry) == null ? void 0 : t.utils) == null ? void 0 : e.randomID) == null ? void 0 : i.call(e, 8)) ?? ((a = (o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.randomID) == null ? void 0 : a.call(o, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function be(t = {}) {
  return {
    id: String(t.id ?? `legacy-application-${ci()}`),
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
function ze(t) {
  return class extends t {
    constructor(o = {}) {
      const a = ni(new.target.defaultOptions ?? {}, o);
      super(be(a));
      gt(this, "_v1Options");
      this._v1Options = a;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return be(this.defaultOptions ?? {});
    }
    activateListeners(o) {
    }
    async _renderHTML(o, a) {
      var l, u, g;
      const r = typeof this.getData == "function" ? await this.getData() : {}, n = ((l = this._v1Options) == null ? void 0 : l.template) ?? ((u = this.options) == null ? void 0 : u.template) ?? ((g = this.constructor.defaultOptions) == null ? void 0 : g.template);
      if (!n) return document.createDocumentFragment();
      const c = await globalThis.renderTemplate(n, r), s = document.createElement("template");
      return s.innerHTML = c.trim(), s.content;
    }
    _activateV1Form(o) {
      var r, n;
      if (typeof this._updateObject != "function") return;
      const a = (r = o.matches) != null && r.call(o, "form") ? o : (n = o.querySelector) == null ? void 0 : n.call(o, "form");
      a instanceof HTMLFormElement && a.addEventListener("submit", async (c) => {
        var l;
        c.preventDefault(), c.stopPropagation();
        const s = new FormData(a);
        await this._updateObject(c, s), ((l = this._v1Options) == null ? void 0 : l.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(o, a, r) {
      var u, g, h, y;
      a.replaceChildren(o);
      const n = globalThis.jQuery ?? globalThis.$, c = ((u = a.closest) == null ? void 0 : u.call(a, ".window-app, .app, .application")) ?? a, s = n ? n(c) : c;
      try {
        Object.defineProperty(this, "element", {
          value: s,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = s;
        } catch {
        }
      }
      const l = (g = this._v1Options) == null ? void 0 : g.classes;
      Array.isArray(l) && l.length && (a.classList.add(...l), (y = (h = a.closest) == null ? void 0 : h.call(a, ".window-app, .app, .application")) == null || y.classList.add(...l)), this._activateV1Form(a), typeof this.activateListeners == "function" && this.activateListeners(n ? n(a) : a);
    }
  };
}
function si() {
  const t = qe(), e = _e(), i = globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication);
  if (i) return i;
  const o = t == null ? void 0 : t.ApplicationV2;
  return o ? ze(o) : null;
}
function li() {
  const t = qe(), e = _e(), i = globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1);
  if (i) return i;
  const o = t == null ? void 0 : t.ApplicationV2;
  return o ? ze(o) : si();
}
const Et = "icons/svg/mystery-man.svg", fi = li();
async function di(t, e, i) {
  var s, l, u, g;
  const { success: o, failure: a } = Ut(t, e), r = `<p>Change to <strong>d${t}</strong> with <strong>${e === "low" ? "low" : "high"} rolls positive</strong>?</p>
    <p>This resets the roll configuration for all ${i} listed character and GM entries, for both outcomes, and the global thresholds:</p>
    <ul><li>Success: <strong>${o}</strong></li><li>Failure: <strong>${a}</strong></li></ul>
    <p>Images, audio, animation, labels, colors, and enabled states stay unchanged. Click Save afterward to apply these changes.</p>`, n = (l = (s = foundry == null ? void 0 : foundry.applications) == null ? void 0 : s.api) == null ? void 0 : l.DialogV2;
  if (n != null && n.confirm)
    return await n.confirm({
      window: { title: "Reset Critical Cut-In Roll Configuration?" },
      content: r,
      modal: !0,
      rejectClose: !1,
      yes: { label: "Change and Reset Rolls" },
      no: { label: "Cancel", default: !0 }
    }) === !0;
  const c = globalThis.Dialog ?? ((g = (u = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : u.api) == null ? void 0 : g.Dialog);
  if (!(c != null && c.confirm)) throw new Error("Foundry confirmation dialog is unavailable.");
  return await c.confirm({ title: "Reset Critical Cut-In Roll Configuration?", content: r, defaultYes: !1, rejectClose: !1 }) === !0;
}
function Ge(t, e) {
  return `${t}:${e}`;
}
function hi() {
  return Ge("gm", "default");
}
function Be(t, e) {
  var o, a, r, n;
  const i = ((a = (o = globalThis.CONST) == null ? void 0 : o.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3;
  return Number(((r = e == null ? void 0 : e.ownership) == null ? void 0 : r[t.id]) ?? ((n = e == null ? void 0 : e.ownership) == null ? void 0 : n.default) ?? 0) >= i;
}
function we(t = {}, { defaultAccent: e = "#69e8ff" } = {}) {
  const i = Number(t.threshold), o = _t(t.animationStyle);
  return {
    enabled: t.enabled !== !1,
    threshold: Number.isInteger(i) && i >= 1 && i <= tt() ? i : "",
    duration: Lt(t.duration),
    animationStyle: o,
    effectDescription: Ot(o).description,
    animationStyles: re.map((a) => ({ value: a.id, label: a.label, description: a.description, selected: o === a.id })),
    imagePath: String(t.imagePath ?? ""),
    audioPath: String(t.audioPath ?? ""),
    overlayText: String(t.overlayText ?? ""),
    accentColor: String(t.accentColor ?? (o === st ? oe : e))
  };
}
function pi(t = {}) {
  return {
    success: we(t, { defaultAccent: "#69e8ff" }),
    failure: we(t.failure, { defaultAccent: "#ff4d7d" })
  };
}
function mi() {
  var i, o, a;
  const t = ((i = game.users) == null ? void 0 : i.find((r) => r.isGM && r.active)) ?? ((o = game.users) == null ? void 0 : o.find((r) => r.isGM)) ?? game.user, e = [{
    key: hi(),
    type: "gm",
    typeLabel: "GM",
    id: "default",
    name: "GM Cut-In",
    portrait: (t == null ? void 0 : t.avatar) || "icons/svg/mystery-man.svg"
  }];
  for (const r of game.actors ?? [])
    (a = game.users) != null && a.some((n) => !n.isGM && Be(n, r)) && e.push({
      key: Ge("actor", r.id),
      type: "actor",
      typeLabel: "Actor",
      id: r.id,
      name: r.name,
      portrait: r.img || "icons/svg/mystery-man.svg"
    });
  return e.sort((r, n) => r.type === "gm" ? -1 : n.type === "gm" ? 1 : r.name.localeCompare(n.name));
}
class Ve extends fi {
  constructor(i = {}) {
    super(i);
    gt(this, "activeTabs");
    gt(this, "selectedPlayer", "gm");
    gt(this, "selectedCharacters", /* @__PURE__ */ new Map());
    gt(this, "rollRuleChange", null);
    this.activeTabs = /* @__PURE__ */ new Map();
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "hcci-player-config",
      title: `${ke} Configuration`,
      template: Qe,
      classes: ["hcci-config-window"],
      width: 1320,
      height: 760,
      resizable: !0,
      closeOnSubmit: !1,
      submitOnChange: !1
    });
  }
  async getData() {
    const i = Yt(), o = mi(), a = [
      { id: "gm", name: "GM", avatar: o[0].portrait, targets: [o[0]] },
      ...Array.from(game.users ?? []).filter((n) => !n.isGM).map((n) => ({
        id: n.id,
        name: n.name,
        avatar: n.avatar || Et,
        targets: o.filter((c) => c.type === "actor" && Be(n, game.actors.get(c.id)))
      }))
    ], r = o.map((n) => {
      const c = pi(i[n.key]);
      return {
        ...n,
        ...c,
        actorId: n.type === "actor" ? n.id : "",
        outcomes: [
          { ...c.success, kind: "success", defaultText: S(d.defaultText) },
          { ...c.failure, kind: "failure", defaultText: S(d.defaultFailureText) }
        ]
      };
    });
    return {
      players: a.map((n) => ({
        ...n,
        characterHeading: n.id === "gm" ? "GM Configuration" : `${n.name}’s Characters`,
        tabDetail: n.id === "gm" ? "Global" : `${n.targets.length} ${n.targets.length === 1 ? "character" : "characters"}`
      })),
      featuredStyles: ["strike", "breach", "signal", "rift", st, wt, St, Ct].map(Ot),
      dieSides: tt(),
      dice: Se(tt()),
      lowRollsGood: qt(),
      threshold: S(d.threshold) ?? 0,
      failureThreshold: S(d.failureThreshold) ?? 0,
      duration: S(d.duration),
      rows: r
    };
  }
  activateListeners(i) {
    super.activateListeners(i);
    const o = i instanceof HTMLElement ? i : i[0], a = o.matches(".hcci-config") ? o : o.querySelector(".hcci-config"), r = (f) => a.querySelector(f), n = (f) => Array.from(a.querySelectorAll(f)), c = n("[data-hcci-player]"), s = n("[data-hcci-characters]"), l = n("[data-hcci-character]"), u = n("[data-hcci-tab]"), g = n("[data-hcci-row]"), h = n("[data-hcci-panel]"), y = r("[data-hcci-workspace]"), m = r("[data-hcci-art]"), w = n("[data-hcci-style]");
    let v, b, A = "success", L = "", E = "";
    const p = (f) => b == null ? void 0 : b.querySelector(`[data-hcci-field="${f}"]`), O = () => {
      if (!v || !b) return;
      const f = p("imagePath").value.trim(), M = v.dataset.hcciPortrait || Et;
      (f !== L || M !== E) && (L = f, E = M, m.src = f || M), m.parentElement.style.setProperty("--hcci-preview-accent", p("accentColor").value), r("[data-hcci-caption]").textContent = p("overlayText").value.trim() || p("overlayText").placeholder;
      const P = Ot(p("animationStyle").value);
      r("[data-hcci-effect-description]").textContent = P.description, w.forEach((I) => I.setAttribute("aria-pressed", String(I.dataset.hcciStyle === P.id)));
    };
    m.addEventListener("error", () => {
      const f = m.getAttribute("src");
      f !== E && f !== Et ? m.src = E : f !== Et && (m.src = Et);
    });
    const Z = (f, M) => {
      f.setAttribute("aria-selected", String(M)), f.tabIndex = M ? 0 : -1;
    }, $ = (f, M = this.selectedCharacters.get(f), P) => {
      this.selectedPlayer = f;
      const I = s.find((T) => T.dataset.hcciCharacters === f), D = l.filter((T) => I == null ? void 0 : I.contains(T)), F = D.find((T) => T.dataset.hcciCharacter === M) ?? D[0], z = F == null ? void 0 : F.dataset.hcciCharacter;
      A = P ?? this.activeTabs.get(z) ?? "success", z && (this.selectedCharacters.set(f, z), this.activeTabs.set(z, A)), v = g.find((T) => T.dataset.hcciRow === z), b = v == null ? void 0 : v.querySelector(`[data-hcci-panel="${A}"]`), c.forEach((T) => Z(T, T.dataset.hcciPlayer === f)), s.forEach((T) => {
        T.hidden = T !== I;
      }), l.forEach((T) => T.setAttribute("aria-pressed", String(T === F))), u.forEach((T) => Z(T, T.dataset.hcciTab === A)), g.forEach((T) => {
        T.hidden = T !== v;
      }), h.forEach((T) => {
        T.hidden = T !== b;
      }), r("#hcci-settings-panel").setAttribute("aria-labelledby", `hcci-${A}-tab`), y.hidden = !v, y.dataset.hcciKind = A, r("[data-hcci-preview-kind]").textContent = A === "failure" ? "Critical Failure" : "Critical Success", O();
    };
    c.forEach((f) => f.addEventListener("click", () => $(f.dataset.hcciPlayer))), l.forEach((f) => f.addEventListener("click", () => $(this.selectedPlayer, f.dataset.hcciCharacter))), u.forEach((f) => f.addEventListener("click", () => $(this.selectedPlayer, void 0, f.dataset.hcciTab)));
    for (const f of [c, u]) for (const [M, P] of f.entries())
      P.addEventListener("keydown", (I) => {
        const D = {
          Home: 0,
          End: f.length - 1,
          ArrowLeft: (M - 1 + f.length) % f.length,
          ArrowRight: (M + 1) % f.length
        }[I.key];
        D !== void 0 && (I.preventDefault(), f[D].focus(), f[D].click());
      });
    w.forEach((f) => f.addEventListener("click", () => {
      const M = p("animationStyle");
      M.value = f.dataset.hcciStyle, M.dispatchEvent(new Event("change", { bubbles: !0 }));
    })), $(c.some((f) => f.dataset.hcciPlayer === this.selectedPlayer) ? this.selectedPlayer : "gm");
    let et = !1;
    a.addEventListener("invalid", (f) => {
      var T, ut, zt;
      if (et) return;
      et = !0, queueMicrotask(() => {
        et = !1;
      });
      const M = f.target, P = M.closest("details");
      P && (P.open = !0);
      const I = (T = M.closest("[data-hcci-row]")) == null ? void 0 : T.dataset.hcciRow;
      if (!I) return;
      const D = l.filter((Gt) => Gt.dataset.hcciCharacter === I), F = D.find((Gt) => {
        var ne;
        return ((ne = Gt.closest("[data-hcci-characters]")) == null ? void 0 : ne.dataset.hcciCharacters) === this.selectedPlayer;
      }) ?? D[0], z = (ut = F == null ? void 0 : F.closest("[data-hcci-characters]")) == null ? void 0 : ut.dataset.hcciCharacters;
      z && $(z, I, (zt = M.closest("[data-hcci-panel]")) == null ? void 0 : zt.dataset.hcciPanel);
    }, !0);
    const at = () => {
      r("[data-hcci-dirty]").hidden = !1;
    }, K = r('[name="dieSides"]'), U = r('[name="rollDirection"]'), Y = r('[name="threshold"]'), _ = r('[name="failureThreshold"]'), it = n('[data-hcci-field="threshold"]'), ot = () => {
      const f = Number(K.value), M = U.value === "low";
      if (n("[data-hcci-success-label]").forEach((D) => {
        D.textContent = M ? "Success ≤" : "Success ≥";
      }), n("[data-hcci-failure-label]").forEach((D) => {
        D.textContent = M ? "Failure ≥" : "Failure ≤";
      }), !Number.isInteger(f) || f < 2 || f > 1e4) return;
      const P = Number(Y.value) || (M ? 1 : f), I = Number(_.value) || (M ? f : 1);
      for (const D of [Y, _, ...it]) D.max = String(f);
      for (const D of it)
        D.placeholder = String(D.closest('[data-hcci-panel="success"]') ? P : I);
    };
    ot();
    let q = Number(K.value), H = U.value;
    const X = () => {
      if (this.rollRuleChange) return;
      const f = Number(K.value), M = U.value;
      if (f === q && M === H) return;
      const P = [K, U, r('[type="submit"]')];
      P.forEach((I) => {
        I.disabled = !0;
      }), this.rollRuleChange = (async () => {
        var I, D;
        try {
          if (!await di(f, M, g.length)) return;
          const { success: F, failure: z } = Ut(f, M);
          Y.value = String(F), _.value = String(z);
          for (const T of it)
            T.value = String(T.closest('[data-hcci-panel="success"]') ? F : z);
          q = f, H = M, at();
        } catch (F) {
          console.error(`${C} | Could not confirm dice change.`, F), (D = (I = ui.notifications) == null ? void 0 : I.error) == null || D.call(I, "Could not confirm the dice change. Your roll configuration has not changed.");
        } finally {
          K.value = String(q), U.value = H, ot(), P.forEach((F) => {
            F.disabled = !1;
          }), this.rollRuleChange = null;
        }
      })();
    };
    K.addEventListener("change", X), U.addEventListener("change", X);
    for (const f of ["input", "change"]) a.addEventListener(f, (M) => {
      const P = M.target;
      !P.matches("input, select") || P === K || P === U || (at(), (P === Y || P === _) && ot(), b != null && b.contains(P) && O());
    });
    for (const f of n("[data-hcci-browse]")) f.addEventListener("click", () => {
      var F, z, T;
      const M = f.dataset.hcciBrowse, P = p(M);
      if (!P) return;
      const I = ((T = (z = (F = foundry == null ? void 0 : foundry.applications) == null ? void 0 : F.apps) == null ? void 0 : z.FilePicker) == null ? void 0 : T.implementation) ?? globalThis.FilePicker;
      new I({
        type: M === "audioPath" ? "audio" : "image",
        current: P.value,
        callback: (ut) => {
          P.value = ut, P.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).browse();
    });
    const lt = r("[data-hcci-test]");
    lt.addEventListener("click", async () => {
      var D, F, z, T, ut;
      if (!((D = game.user) != null && D.isGM) || !v || !b || lt.getAttribute("aria-disabled") === "true") return;
      const f = Ut(q, H), M = A === "failure" ? "failure" : "success", P = M === "failure" ? _.value : Y.value, I = p("animationStyle").value;
      lt.setAttribute("aria-disabled", "true");
      try {
        await Xa({
          actorId: v.dataset.hcciActorId || null,
          actorName: v.dataset.hcciActorId ? v.dataset.hcciName : "",
          triggerKind: M,
          naturalResult: f[M],
          threshold: Number((F = p("threshold")) == null ? void 0 : F.value) || Number(P) || f[M],
          animationStyle: I,
          imagePath: p("imagePath").value.trim() || E,
          fallbackImagePath: E,
          audioPath: p("audioPath").value.trim(),
          overlayText: p("overlayText").value.trim() || p("overlayText").placeholder,
          accentColor: p("accentColor").value,
          textEnabled: !["rift", st, wt, St, Ct].includes(I) || S(d.textEnabled) !== !1,
          duration: Lt((z = p("duration")) == null ? void 0 : z.value) ?? Lt(r('[name="duration"]').value) ?? S(d.duration),
          volume: S(d.volume)
        }) || (ut = (T = ui.notifications) == null ? void 0 : T.info) == null || ut.call(T, "A cut-in is already playing.");
      } finally {
        lt.removeAttribute("aria-disabled");
      }
    }), r("[data-hcci-action='reset']").addEventListener("click", async () => {
      var P, I, D;
      const f = (I = (P = foundry == null ? void 0 : foundry.applications) == null ? void 0 : P.api) == null ? void 0 : I.DialogV2;
      (f != null && f.confirm ? await f.confirm({
        window: { title: "Reset All Character Cut-Ins?" },
        content: "<p>This removes every GM and actor override. Global roll and presentation settings stay unchanged.</p>",
        modal: !0,
        rejectClose: !1,
        yes: { label: "Reset Overrides" },
        no: { label: "Cancel", default: !0 }
      }) === !0 : globalThis.confirm("Reset every GM and actor cut-in override?")) && (await ce({}), (D = ui.notifications) == null || D.info("Critical Cut-In player configuration reset."), this.render(!1));
    });
  }
  async _updateObject(i) {
    var g, h, y, m, w, v, b;
    if (!((g = game.user) != null && g.isGM) || this.rollRuleChange) return;
    const o = i.currentTarget;
    if (!o.reportValidity()) return;
    const a = Number(((h = o.querySelector('[name="dieSides"]')) == null ? void 0 : h.value) ?? tt()), r = ((y = o.querySelector('[name="rollDirection"]')) == null ? void 0 : y.value) === "low" ? "low" : "high", n = Yt(), c = (A, L) => {
      var Z, $, et, at, K, U, Y, _, it, ot;
      const E = A.querySelector(`[data-hcci-panel="${L}"]`), p = (q) => E == null ? void 0 : E.querySelector(`[data-hcci-field="${q}"]`), O = Lt((Z = p("duration")) == null ? void 0 : Z.value);
      return {
        ...O === void 0 ? {} : { duration: O },
        enabled: (($ = E == null ? void 0 : E.querySelector('[data-hcci-field="enabled"]')) == null ? void 0 : $.checked) === !0,
        threshold: (() => {
          var H;
          const q = Number((H = p("threshold")) == null ? void 0 : H.value);
          return Number.isInteger(q) && q >= 1 && q <= a ? q : "";
        })(),
        animationStyle: ((et = p("animationStyle")) == null ? void 0 : et.value) || "strike",
        imagePath: ((K = (at = p("imagePath")) == null ? void 0 : at.value) == null ? void 0 : K.trim()) ?? "",
        audioPath: ((Y = (U = p("audioPath")) == null ? void 0 : U.value) == null ? void 0 : Y.trim()) ?? "",
        overlayText: ((it = (_ = p("overlayText")) == null ? void 0 : _.value) == null ? void 0 : it.trim()) ?? "",
        accentColor: ((ot = p("accentColor")) == null ? void 0 : ot.value) || (L === "failure" ? "#ff4d7d" : "#69e8ff")
      };
    };
    for (const A of o.querySelectorAll("[data-hcci-row]")) {
      const L = A.dataset.hcciRow;
      n[L] = c(A, "success"), n[L].failure = c(A, "failure");
    }
    const s = Number(((m = o.querySelector('[name="threshold"]')) == null ? void 0 : m.value) ?? ae()), l = Number(((w = o.querySelector('[name="failureThreshold"]')) == null ? void 0 : w.value) ?? Me()), u = Number(((v = o.querySelector('[name="duration"]')) == null ? void 0 : v.value) ?? S(d.duration));
    await Q(d.dieSides, a), await Q(d.rollDirection, r), await Q(d.threshold, Math.min(a, Math.max(0, s))), await Q(d.failureThreshold, Math.min(a, Math.max(0, l))), await Q(d.duration, Math.min(8e3, Math.max(800, u))), await ce(n), (b = ui.notifications) == null || b.info("Critical Cut-In configuration saved."), this.render(!1);
  }
}
function Xe() {
  var t, e;
  return (t = game.user) != null && t.isGM ? new Ve().render(!0) : ((e = ui.notifications) == null || e.warn("Only the GM can configure Critical Cut-In."), null);
}
function gi() {
  var i, o, a, r;
  const t = (i = game.modules.get("holosuite")) != null && i.active ? (o = game.modules.get("holosuite")) == null ? void 0 : o.api : null, e = (a = game.modules.get("holosuite-core")) != null && a.active ? (r = game.modules.get("holosuite-core")) == null ? void 0 : r.api : null;
  return t ?? e ?? game.holosuite ?? null;
}
function je() {
  var e;
  const t = gi();
  return t != null && t.registerApp ? (t.registerApp({
    brandingInApp: !0,
    id: C,
    title: "Critical Cut-In",
    icon: "fa-solid fa-bolt-lightning",
    premium: !1,
    playerVisible: !1,
    description: "JRPG-style critical hit cut-in animation for natural d20 results.",
    enabled: S(d.enabled),
    open: () => Xe()
  }), t.registerApp({
    brandingInApp: !0,
    id: `${C}-box-of-doom`,
    title: "Box of Doom",
    icon: "fa-solid fa-box",
    premium: !1,
    playerVisible: !1,
    description: "Reveal a high-stakes roll to the whole table.",
    enabled: S(d.enabled),
    open: () => Le()
  }), (e = t.registerWhatsNew) == null || e.call(t, {
    moduleId: C,
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
  }), console.log(`${C} | Registered with HoloSuite.`), !0) : !1;
}
function Ke() {
  const t = {
    playCutinForUser(i, o = {}) {
      var r;
      const a = He(i, o);
      return (r = game.user) != null && r.isGM ? ve(a) : mt(a), a;
    },
    playCutinForActor(i, o = {}) {
      var r;
      const a = ri(i, o);
      return (r = game.user) != null && r.isGM ? ve(a) : mt(a), a;
    },
    openConfig: Xe,
    openBoxOfDoom: Le
  }, e = game.modules.get(C);
  return e && (e.api = t), game.holosuiteCriticalCutin = t, t;
}
Hooks.once("init", async () => {
  Je(Ve), na(), Ke(), await loadTemplates([`modules/${C}/templates/player-config.hbs`]);
});
Hooks.once("ready", () => {
  Ke(), oi(), nt(), Hooks.on("userConnected", nt), je(), console.log(`${C} | Ready. API available at game.modules.get("${C}").api`);
});
Hooks.on("hotReload", () => {
  je();
});
console.log(`${ke} | Loading.`);
