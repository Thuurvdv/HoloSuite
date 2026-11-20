var Ue = Object.defineProperty;
var We = (t, e, i) => e in t ? Ue(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i;
var gt = (t, e, i) => We(t, typeof e != "symbol" ? e + "" : e, i);
const Qe = [4, 6, 8, 10, 12, 20, 100];
function Ce(t = 20) {
  var a, r, n;
  const e = ee(t), i = /* @__PURE__ */ new Set([...Qe, e]), o = ((n = (r = (a = globalThis.CONFIG) == null ? void 0 : a.Dice) == null ? void 0 : r.fulfillment) == null ? void 0 : n.dice) ?? {};
  for (const c of Object.keys(o)) {
    const l = /^d([1-9]\d*)$/i.exec(c);
    if (!l) continue;
    const s = Number(l[1]);
    s >= 2 && s <= 1e4 && i.add(s);
  }
  return [...i].sort((c, l) => c - l).map((c) => ({ value: c, label: `d${c}`, selected: c === e }));
}
function Kt(t, e) {
  const i = ee(t), o = ke(e) === "low";
  return { success: o ? 1 : i, failure: o ? i : 1 };
}
function ee(t) {
  const e = Number(t);
  return Number.isInteger(e) && e >= 2 && e <= 1e4 ? e : 20;
}
function ke(t) {
  return t === "low" ? "low" : "high";
}
const C = "holosuite-critical-cutin", Me = "HoloSuite Critical Cut-In", Ft = `module.${C}`, Je = `modules/${C}/templates/player-config.hbs`, g = {
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
}, st = {
  everyone: "everyone",
  gm: "gm",
  triggeringPlayer: "triggeringPlayer"
};
function ta(t) {
  game.settings.register(C, g.effectIntensity, {
    name: "Local Effect Detail",
    hint: "Choose the density of decorative particles and the strength of glow on this device.",
    scope: "client",
    config: !0,
    type: String,
    default: "standard",
    choices: { low: "Low", standard: "Standard", high: "High" }
  }), game.settings.register(C, g.shakeIntensity, {
    name: "Local Impact Shake",
    hint: "Shake the cut-in at impact. Reduced and still motion always disable shake.",
    scope: "client",
    config: !0,
    type: Number,
    default: 0.5,
    range: { min: 0, max: 1, step: 0.1 }
  }), game.settings.register(C, g.enabled, {
    name: "Enable Critical Cut-In",
    hint: "Play a configured cut-in when a qualifying natural result is rolled on the selected die.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(C, g.dieSides, {
    name: "Check Die",
    hint: "Configured in Configure Player Cut-Ins, where changes confirm the reset of all listed roll thresholds.",
    scope: "world",
    config: !1,
    type: Number,
    default: 20
  }), game.settings.register(C, g.rollDirection, {
    name: "Positive Rolls",
    hint: "Configured in Configure Player Cut-Ins, together with the check die and roll thresholds.",
    scope: "world",
    config: !1,
    type: String,
    default: "high",
    choices: { high: "High rolls are positive", low: "Low rolls are positive" }
  }), game.settings.register(C, g.threshold, {
    name: "Default Trigger Threshold",
    hint: "0 automatically uses the best die face. Otherwise success triggers at or above this value for high rolls, or at or below it for low rolls.",
    scope: "world",
    config: !0,
    type: Number,
    default: 0
  }), game.settings.register(C, g.failureThreshold, {
    name: "Default Failure Trigger",
    hint: "0 automatically uses the worst die face. Otherwise failure triggers at or below this value for high rolls, or at or above it for low rolls.",
    scope: "world",
    config: !0,
    type: Number,
    default: 0
  }), game.settings.register(C, g.duration, {
    name: "Animation Duration",
    hint: "How long the cut-in remains visible, in milliseconds.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 800, max: 8e3, step: 100 },
    default: 2500
  }), game.settings.register(C, g.volume, {
    name: "Cut-In Audio Volume",
    hint: "Volume multiplier for configured cut-in audio samples.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 0.8
  }), game.settings.register(C, g.audience, {
    name: "Show Animation To",
    hint: "Choose who sees synchronized cut-in playback.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      [st.everyone]: "Everyone",
      [st.gm]: "GM only",
      [st.triggeringPlayer]: "Triggering player only"
    },
    default: st.everyone
  }), game.settings.register(C, g.animationFont, {
    name: "Animation Font",
    hint: "Typeface for the cut-in label and actor name.",
    scope: "world",
    config: !0,
    type: String,
    default: "aicon",
    choices: { aicon: "AICON", classic: "Classic (Orbitron / system fallback)" }
  }), game.settings.register(C, g.textEnabled, {
    name: "Enable Text Overlay",
    hint: "Show the configured label during the cut-in.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(C, g.defaultText, {
    name: "Default Overlay Text",
    hint: "Fallback label used when no player-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL"
  }), game.settings.register(C, g.defaultFailureText, {
    name: "Default Failure Overlay Text",
    hint: "Fallback label used when no failure-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL FAILURE"
  }), game.settings.register(C, g.motionMode, {
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
  }), game.settings.register(C, g.flashMode, {
    name: "Local Flash Intensity",
    hint: "Reduce or disable the bright opening flash on this device.",
    scope: "client",
    config: !0,
    type: String,
    choices: { full: "Full", soft: "Soft", off: "Off" },
    default: "soft"
  }), game.settings.register(C, g.localVolume, {
    name: "Local Cut-In Volume",
    hint: "Personal volume multiplier applied after the GM's cut-in volume setting.",
    scope: "client",
    config: !0,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 1
  }), game.settings.register(C, g.suppressCutins, {
    name: "Hide Cut-Ins On This Device",
    hint: "Do not show or play critical cut-ins for this client.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(C, g.debug, {
    name: "Debug Logging",
    hint: "Log roll detection and playback decisions to the console.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(C, g.playerConfigs, {
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
async function tt(t, e) {
  return game.settings.set(C, t, e);
}
function xt(t) {
  if (typeof t != "number" && typeof t != "string") return;
  const e = Number(t);
  return Number.isInteger(e) && e >= 800 && e <= 8e3 ? e : void 0;
}
function ae() {
  return xe(S(g.threshold), "success");
}
function Te() {
  return xe(S(g.failureThreshold), "failure");
}
function at() {
  return ee(S(g.dieSides));
}
function qt() {
  return ke(S(g.rollDirection)) === "low";
}
function xe(t, e) {
  const i = Number(t);
  return Number.isInteger(i) && i >= 1 && i <= at() ? i : e === "success" === qt() ? 1 : at();
}
function Ae(t, e, i) {
  return i === "success" === qt() ? t <= e : t >= e;
}
function Ut() {
  const t = S(g.playerConfigs);
  return foundry.utils.deepClone(t && typeof t == "object" ? t : {});
}
async function se(t) {
  return tt(g.playerConfigs, t && typeof t == "object" ? t : {});
}
function wt(...t) {
  S(g.debug) && console.log(`${C} |`, ...t);
}
const ie = "boxOfDoom", ft = "boxOfDoomState", ea = 850, aa = 5200, ia = 500;
let et = !1, Bt = !1, nt, Xt;
function oa() {
  var e;
  return (e = Array.from(game.users ?? []).filter((i) => i.isGM && i.active).sort((i, o) => i.id.localeCompare(o.id))[0]) == null ? void 0 : e.id;
}
function bt() {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) && (oa() ?? game.user.id) === game.user.id;
}
function ht() {
  const t = S(ft);
  return t != null && t.id && (t.phase !== "revealed" || t.expires > Date.now()) ? t : void 0;
}
function Ee(t) {
  return t.target === null ? "" : `Target ${t.low ? "≤" : "≥"} ${t.target}`;
}
function Wt(t) {
  return t.target === null ? "" : (t.low ? t.total <= t.target : t.total >= t.target) ? "Success" : "Failure";
}
function ra(t) {
  const e = document.createElement("span");
  return e.textContent = t, e.innerHTML;
}
function ct() {
  var u;
  clearTimeout(Xt);
  const t = ht(), e = ((u = game.user) == null ? void 0 : u.isGM) === !0, i = bt(), o = !e && S(g.suppressCutins) === !0;
  if (!t || o) {
    nt == null || nt.remove(), nt = void 0;
    return;
  }
  const a = `${t.id}:${t.phase}:${i}:${et}`;
  if ((nt == null ? void 0 : nt.dataset.state) === a) {
    t.phase === "revealed" && (Xt = setTimeout(ct, Math.max(1, t.expires - Date.now())));
    return;
  }
  const r = nt, n = i && (!r || r.contains(document.activeElement));
  r == null || r.remove();
  const c = document.createElement("section");
  c.className = "hcci-doom", c.dataset.holosuiteBranding = `${C}-box-of-doom`, c.dataset.state = a, c.dataset.phase = t.phase, c.dataset.animate = String((r == null ? void 0 : r.dataset.boxId) !== t.id || r.dataset.phase !== t.phase), c.dataset.boxId = t.id, c.dataset.control = String(i), c.dataset.motion = String(S(g.motionMode) ?? "system"), t.phase === "revealed" && (c.dataset.outcome = Wt(t).toLowerCase()), c.setAttribute("aria-label", "Box of Doom"), c.innerHTML = `
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
    </div>`, c.querySelector(".hcci-doom-stakes").textContent = t.stakes, c.querySelector(".hcci-doom-target").textContent = [`d${t.sides}`, Ee(t)].filter(Boolean).join(" · ");
  const l = c.querySelector(".hcci-doom-status");
  if (t.phase === "revealed") {
    const h = l.appendChild(document.createElement("strong"));
    h.textContent = String(t.total);
    const d = l.appendChild(document.createElement("span"));
    d.textContent = Wt(t) || "Result", Xt = setTimeout(ct, Math.max(1, t.expires - Date.now()));
  } else
    l.textContent = t.phase === "sealed" ? "Sealed" : "Opening…";
  const s = (h, d) => {
    const m = c.querySelector(".hcci-doom-controls").appendChild(document.createElement("button"));
    m.type = "button", m.textContent = h, m.addEventListener("click", () => void d().catch(Le));
  };
  i && !et && t.phase === "sealed" && s("Roll & Reveal", () => na(t.id)), i && !et && t.phase !== "revealed" && s("Cancel", () => le(t.id)), i && !et && t.phase === "revealed" && s("Close", () => le(t.id)), nt = c, document.body.append(c), Hooks.callAll("holosuite-core.renderBranding", c), n && (c.tabIndex = -1, (c.querySelector("button") ?? c).focus({ preventScroll: !0 }));
}
function Le(t) {
  var e;
  console.error(`${C} | Box of Doom`, t), (e = ui.notifications) == null || e.error("Box of Doom could not complete the action. Check the chat and try again.");
}
async function le(t) {
  var e;
  if (!(!bt() || et || ((e = ht()) == null ? void 0 : e.id) !== t)) {
    et = !0, ct();
    try {
      await tt(ft, {});
    } finally {
      et = !1, ct();
    }
  }
}
const ue = (t) => new Promise((e) => setTimeout(e, t));
async function na(t) {
  var i, o;
  const e = ht();
  if (!(!bt() || et || (e == null ? void 0 : e.id) !== t || e.phase !== "sealed")) {
    et = !0, ct();
    try {
      const a = ((i = foundry.dice) == null ? void 0 : i.Roll) ?? globalThis.Roll;
      await tt(ft, { ...e, phase: "opening" });
      const r = await new a(`1d${e.sides}`).evaluate({ allowInteractive: !1 }), n = Number(r.total);
      if (!Number.isInteger(n) || n < 1 || n > e.sides) throw new Error("Unexpected die result.");
      await ue(ea);
      const c = ht();
      if ((c == null ? void 0 : c.id) !== t || c.phase !== "opening") return;
      const l = { ...e, phase: "revealed", total: n, expires: Date.now() + aa };
      await tt(ft, l), await ue(ia);
      const s = ((o = foundry.documents) == null ? void 0 : o.ChatMessage) ?? globalThis.ChatMessage, u = [`d${e.sides}: ${n}`, Ee(e), Wt(l)].filter(Boolean).join(" · ");
      await s.create({
        speaker: s.getSpeaker(),
        content: `<h3>Box of Doom</h3>${e.stakes ? `<p>${ra(e.stakes)}</p>` : ""}<p><strong>${u}</strong></p>`,
        whisper: [],
        blind: !1,
        flags: { [C]: { [ie]: t } }
      });
    } catch (a) {
      const r = ht();
      throw bt() && (r == null ? void 0 : r.phase) === "opening" && r.id === t && await tt(ft, e), a;
    } finally {
      et = !1, ct();
    }
  }
}
async function $e() {
  var t, e, i;
  if (!bt()) {
    (t = game.user) != null && t.isGM && ((e = ui.notifications) == null || e.warn("The active GM controls Box of Doom."));
    return;
  }
  if (!(et || Bt || ht())) {
    Bt = !0;
    try {
      const o = foundry.applications.api.DialogV2, a = Ce(at()), r = qt(), n = await o.prompt({
        window: { title: "Box of Doom" },
        modal: !0,
        rejectClose: !1,
        content: `<div class="hcci-doom-form" data-holosuite-branding="${C}-box-of-doom">
        <label>What’s at stake?<input name="stakes" type="text" maxlength="180" placeholder="Optional"></label>
        <label>Die<select name="sides">${a.map(({ value: c, label: l, selected: s }) => `<option value="${c}" ${s ? "selected" : ""}>${l}</option>`).join("")}</select></label>
        <label>Success target (${r ? "roll at or below" : "roll at or above"})<input name="target" type="number" min="1" max="10000" step="1" placeholder="Optional"></label>
      </div>`,
        ok: {
          label: "Show Box to Table",
          callback: (c, l) => {
            const s = new FormData(l.form), u = s.get("target");
            return {
              stakes: String(s.get("stakes") ?? "").trim(),
              sides: Number(s.get("sides")),
              target: u === "" || u == null ? null : Number(u)
            };
          }
        }
      });
      if (!n || !bt() || ht() || !a.some((c) => c.value === n.sides)) return;
      if (n.target !== null && (!Number.isInteger(n.target) || n.target < 1 || n.target > n.sides)) {
        (i = ui.notifications) == null || i.warn(`Choose a target between 1 and ${n.sides}, or leave it blank.`);
        return;
      }
      await tt(ft, { ...n, id: foundry.utils.randomID(), phase: "sealed", low: r });
    } catch (o) {
      Le(o);
    } finally {
      Bt = !1;
    }
  }
}
function ca() {
  game.settings.register(C, ft, {
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: ct
  });
}
const Lt = "shattered-fate", Pe = [53, 48], Rt = [
  [[49, 34], [43, 25], [41, 0]],
  [[64, 39], [69, 23], [100, 0]],
  [[68, 49], [79, 45], [100, 36]],
  [[66, 58], [81, 65], [100, 76]],
  [[61, 64], [66, 81], [78, 100]],
  [[50, 66], [46, 76], [39, 100]],
  [[41, 60], [29, 70], [0, 100]],
  [[34, 52], [22, 56], [0, 52]],
  [[43, 40], [31, 28], [0, 0]]
], de = Rt.flatMap(([t, e, i], o) => {
  const [a, r, n] = Rt[(o + 1) % Rt.length], c = [(t[0] + a[0]) / 2 + (o % 2 ? 1.5 : -2), (t[1] + a[1]) / 2 + (o % 3 - 1) * 2];
  return [
    [Pe, t, c, a],
    [t, e, i, ...o === 3 ? [[100, 100]] : [], n, r, a, c]
  ];
}), Ie = (t) => `polygon(${t.map(([e, i]) => `${e}% ${i}%`).join(",")})`, Qt = (t) => t.map((e) => e.join(",")).join(" "), Vt = [
  [[0, 0], [100, 0]],
  [[0, 16], [21, 23], [37, 15], [58, 29], [72, 20], [100, 26]],
  [[0, 42], [25, 48], [44, 37], [65, 49], [86, 42], [100, 50]],
  [[0, 62], [20, 70], [39, 58], [62, 73], [80, 61], [100, 67]],
  [[0, 83], [17, 88], [39, 77], [59, 91], [77, 79], [100, 89]],
  [[0, 100], [100, 100]]
];
function sa() {
  return `<svg class="hcci-fate-backdrop" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
    <path class="hcci-fate-slashes" d="M0 365 259 206 146 327 350 230 227 367 0 505ZM0 511l244-106L80 520l65-12L0 560Zm1000-407L712 250l104-114-113 44L919 0h81Zm0 390-192 66h-66l98-58-46 6 206-133Z"/>
    <path class="hcci-fate-streaks" d="m0 337 274-179L91 314Zm0 184 327-118L54 520ZM1000 25 733 193 960 25Zm0 215-208 108 208-76ZM675 560l250-124-177 124Z"/>
    <path class="hcci-fate-debris" d="m115 152 35-19-16 38Zm64 311 47-27-27 41Zm623-351 46-25-23 43Zm75 279 49-43-15 51ZM69 437l29-22-11 27Zm864-225 33-19-15 29Z"/>
  </svg><div class="hcci-fate-flash"></div>`;
}
function la(t) {
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points="${Qt(t)}"/></svg>`;
}
function ua(t) {
  const e = t.querySelector(".hcci-visual"), i = e.querySelector(".hcci-portrait"), o = e.querySelectorAll(".hcci-fate-shard");
  if (o.length) {
    for (const a of o) a.firstElementChild.replaceWith(i.cloneNode(!0));
    return;
  }
  for (const a of de) {
    const r = document.createElement("div");
    r.className = "hcci-fate-shard", r.style.clipPath = Ie(a), r.append(i.cloneNode(!0)), r.insertAdjacentHTML("beforeend", la(a)), e.append(r);
  }
  e.insertAdjacentHTML("beforeend", `<svg class="hcci-fate-cracks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <g class="hcci-fate-branches">${de.filter((a, r) => r % 2 === 0).map((a) => `<polyline points="${Qt(a.slice(1))}"/>`).join("")}</g>
    <g class="hcci-fate-rays">${Rt.map((a) => `<polyline points="${Qt([Pe, ...a])}"/>`).join("")}</g>
    <path class="hcci-fate-spark" d="m53 45 1 2 3 1-3 1-1 3-1-3-3-1 3-1Z"/>
  </svg>`);
}
const B = { fracture: 250, shatter: 450, impact: 740, settle: 1050 }, da = 280, It = "steps(1, end)", Nt = "cubic-bezier(.13,.79,.19,1)", fa = [
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
function ha(t, e) {
  const i = [];
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return { animations: i, audioDelay: 0 };
  const o = Math.min(1, (e - 140) / B.settle), a = (u, h, d, m, p = "linear") => {
    u && i.push(u.animate(h, {
      delay: d * o,
      duration: (m - d) * o,
      easing: p,
      fill: "both"
    }));
  }, r = (u) => t.querySelector(u);
  a(r(".hcci-visual"), [
    { transform: "translate(-3vw, 2vh) scale(1.09)", opacity: 0.42 },
    { transform: "none", opacity: 1 }
  ], 0, B.fracture, Nt), a(r(".hcci-portrait-frame"), [{ visibility: "visible" }, { visibility: "hidden" }], 0, B.shatter, It);
  for (const [u, h] of [[".hcci-fate-rays", 250], [".hcci-fate-branches", 310], [".hcci-fate-spark", 250]])
    a(r(u), [
      { opacity: 0 },
      { opacity: 1, offset: 0.06, easing: It },
      { opacity: 0 }
    ], h, B.shatter);
  for (const [u, h] of Array.from(t.querySelectorAll(".hcci-fate-shard")).entries()) {
    const d = u % 2 === 0, [m, p, v] = fa[Math.floor(u / 2)], b = d ? 40 : 55, w = d ? 33 + u % 3 * 12 : u % 3 * 8;
    a(h, [{ visibility: "hidden" }, { visibility: "visible" }], 0, B.shatter, It);
    const E = B.shatter + w, L = d ? 819 : 756;
    a(h, [
      { transform: "none", opacity: 1, easing: Nt },
      { transform: `perspective(850px) translate3d(${m * b * 0.52}vw,${p * b * 0.47}vh,${d ? 96 : -80}px) rotate(${v * 0.53}deg) rotateY(${m * 32}deg)`, opacity: 1, offset: (L - E) / (B.settle - E) },
      { transform: `perspective(850px) translate3d(${m * b}vw,${p * b}vh,${d ? 190 : -145}px) rotate(${v}deg) rotateY(${m * 62}deg)`, opacity: 0 }
    ], E, B.settle);
  }
  a(r(".hcci-copy"), [
    { opacity: 0, transform: "translate(13vw,3vh) rotate(-13deg) scale(1.3)" },
    { opacity: 1, transform: "translate(-1vw,0) rotate(-8deg) scale(1.035)", offset: 0.35, easing: It },
    { opacity: 1, transform: "translate(-1vw,0) rotate(-8deg) scale(1.035)", offset: 0.51, easing: Nt },
    { opacity: 1, transform: "rotate(-7deg)" }
  ], B.impact, B.settle, Nt);
  const n = r(".hcci-fate-flash"), c = [54, B.fracture, B.impact], l = B.impact + 50, s = c.flatMap((u, h) => [
    { offset: u / l, opacity: 0 },
    {
      offset: (u + 7) / l,
      opacity: `calc(var(--flash-peak, .14) * ${h === 0 ? 0.55 : 1})`,
      backgroundColor: h === 0 ? "var(--hcci-accent)" : "#fff"
    },
    { offset: (u + 50) / l, opacity: 0 }
  ]);
  return a(n, [{ opacity: 0, offset: 0 }, ...s], 0, l), a(r(".hcci-stage"), [
    { transform: "none" },
    { transform: "translateX(var(--hcci-shake))", offset: 0.2 },
    { transform: "translateX(calc(-.45 * var(--hcci-shake)))", offset: 0.51 },
    { transform: "none" }
  ], B.impact, B.impact + 75), { animations: i, audioDelay: B.shatter * o };
}
function pa(t, e) {
  var a;
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return [];
  const i = [], o = t.querySelector(".hcci-copy");
  if (Number(getComputedStyle(o).opacity) > 0.8 && ((a = o.textContent) != null && a.trim())) {
    const r = o.parentElement.appendChild(document.createElement("div"));
    r.className = "hcci-fate-exit-pieces";
    for (let n = 0; n < Vt.length - 1; n++) {
      const c = o.cloneNode(!0), l = r.appendChild(document.createElement("div"));
      l.style.clipPath = Ie([...Vt[n], ...Vt[n + 1].slice().reverse()]), l.append(c), i.push(l.animate([
        { transform: "none", opacity: 1 },
        { transform: `translate(${(n - 2) * 9 + (n % 2 ? 11 : -8)}vw,${7 + n * 6}vh) rotate(${(n - 2) * 12}deg)`, opacity: 0 }
      ], { duration: e - n * 9, delay: n * 9, easing: "cubic-bezier(.55,.04,.89,.54)", fill: "both" }));
    }
    o.style.visibility = "hidden";
  }
  return i.push(t.animate([{ opacity: 1 }, { opacity: 1, offset: 0.61 }, { opacity: 0 }], { duration: e, fill: "both" })), i;
}
const mt = "manga-overdrive", oe = "#ec2846";
function ma(t) {
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
const M = { blackout: 0, ink: 80, silhouette: 180, halftone: 320, impact: 520, hold: 760 }, ut = "cubic-bezier(.12,.76,.18,1)", j = "steps(1, end)", ga = "grayscale(1) brightness(.40) contrast(1.8)", ya = "grayscale(1) contrast(1.55)";
function va(t, e) {
  const i = [];
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return { animations: i, audioDelay: 0 };
  const o = Math.min(1, (e - 160) / M.hold), a = (n, c, l, s, u = "linear") => {
    for (const h of t.querySelectorAll(n))
      i.push(h.animate(c, { delay: l * o, duration: (s - l) * o, easing: u, fill: "both" }));
  }, r = (n) => n / M.impact;
  return a(".hcci-manga-page", [
    { opacity: 0, transform: "scale(.65)", easing: j },
    { opacity: 1, transform: "scale(.73)", offset: r(M.ink), easing: ut },
    { opacity: 1, transform: "scale(1.03)", offset: r(M.silhouette) },
    { opacity: 1, transform: "scale(1)", offset: r(M.halftone), easing: j },
    { opacity: 0, transform: "scale(1)" }
  ], M.blackout, M.impact), a(".hcci-manga-panel-glint", [
    { opacity: 0, transform: "scaleX(.1)" },
    { opacity: 1, transform: "scaleX(1)", offset: 0.32, easing: j },
    { opacity: 0, transform: "scaleX(1)" }
  ], 19, M.ink), a(".hcci-visual", [
    { opacity: 1, transform: "none", easing: j },
    { opacity: 0, transform: "none", offset: M.ink / M.hold, easing: j },
    { opacity: 1, transform: "translate(-16vw, 4vh) rotate(-12deg) scale(.84)", offset: M.silhouette / M.hold, easing: ut },
    { opacity: 1, transform: "translate(1.2vw,-.6vh) rotate(2deg) scale(.94)", offset: 255 / M.hold },
    { opacity: 1, transform: "scale(.92)", offset: M.halftone / M.hold, easing: ut },
    { opacity: 1, transform: "translate(-.3vw,.15vh) scale(.96)", offset: 352 / M.hold, easing: ut },
    { opacity: 1, transform: "none", offset: M.impact / M.hold },
    { opacity: 1, transform: "none" }
  ], M.blackout, M.hold), a(".hcci-portrait-frame", [
    { opacity: 0.065, easing: j },
    { opacity: 1 }
  ], M.blackout, M.silhouette), a(".hcci-manga-artwork", [
    { filter: "brightness(.16)", easing: j },
    { filter: ga, offset: r(M.silhouette), easing: j },
    { filter: ya, offset: r(M.halftone), easing: j },
    { filter: "none" }
  ], M.blackout, M.impact), a(".hcci-manga-reveal-lines", [
    { opacity: 0, easing: j },
    { opacity: 1 }
  ], M.blackout, M.halftone), a(".hcci-manga-dots", [
    { opacity: 0, easing: j },
    { opacity: 0.27, offset: r(M.halftone), easing: j },
    { opacity: 0 }
  ], M.blackout, M.impact), a(".hcci-manga-impact", [
    { opacity: 0, easing: j },
    { opacity: 1, offset: 0.01, transform: "scale(1.06)", easing: j },
    { opacity: 1, transform: "scale(1.06)", offset: 0.29, easing: ut },
    { opacity: 1, transform: "scale(1)" }
  ], M.impact, M.hold), a(".hcci-copy", [
    { opacity: 0, transform: "translate(12vw, -4vh) rotate(4deg) scale(1.16)" },
    { opacity: 1, transform: "translate(-.8vw, .4vh) rotate(-6deg) scale(1.035)", offset: 0.31, easing: j },
    { opacity: 1, transform: "translate(-.8vw, .4vh) rotate(-6deg) scale(1.035)", offset: 0.48, easing: ut },
    { opacity: 1, transform: "rotate(-4deg)" }
  ], M.impact, M.hold, ut), a(".hcci-manga-flash", [
    { opacity: 0 },
    { opacity: "var(--flash-peak, .14)", offset: 0.1 },
    { opacity: 0 }
  ], M.impact, M.impact + 38), a(".hcci-stage", [
    { transform: "none" },
    { transform: "translateX(var(--hcci-shake))", offset: 0.18 },
    { transform: "translateX(calc(-.5 * var(--hcci-shake)))", offset: 0.44 },
    { transform: "none" }
  ], M.impact, M.impact + 66), { animations: i, audioDelay: M.impact * o };
}
function ba(t, e) {
  return !t.classList.contains("hcci-motion-full") || !t.animate ? [] : Array.from(t.querySelectorAll(".hcci-manga-exit"), (i, o) => i.animate([
    { transform: o === 0 ? "translate(-85%, -36%)" : "translate(85%, 36%)", opacity: 1 },
    { transform: o === 0 ? "translate(11%, 7%)" : "translate(-11%, -7%)", opacity: 1 }
  ], { duration: e - o * 17, delay: o * 17, easing: "cubic-bezier(.48,.05,.82,.71)", fill: "both" }));
}
function wa(t) {
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
const z = {
  anticipation: 0,
  slash: 100,
  rupture: 245,
  reveal: 402,
  title: 505,
  hold: 695
}, Sa = "cubic-bezier(.68,0,.88,.45)", Dt = "cubic-bezier(.12,.78,.24,1)", fe = "cubic-bezier(.15,.78,.18,1)", Ca = "cubic-bezier(.62,.02,.86,.45)";
function St(t) {
  const e = 91 - 0.74 * t;
  return `polygon(-10% 0, ${t - 12}% 0, ${t - 11}% ${e - 6}%, ${t}% ${e}%, ${t - 12}% ${e + 8}%, ${t - 15}% 100%, -10% 100%) view-box`;
}
function ka(t, e) {
  const i = [];
  if (!t.classList.contains("hcci-motion-full") || !t.animate)
    return { animations: i, audioDelay: 0 };
  const o = Math.min(1, (e - 100) / z.hold), a = (r, n, c, l, s = "linear") => {
    for (const u of t.querySelectorAll(r))
      i.push(u.animate(n, {
        delay: c * o,
        duration: (l - c) * o,
        easing: s,
        fill: "both"
      }));
  };
  return a(".hcci-rift-geometry", [{ opacity: 0.62 }, { opacity: 1 }], z.anticipation, z.slash), a(".hcci-rift-edge, .hcci-rift-edge-light", [{ opacity: 0 }, { opacity: 1 }], z.slash + 82, z.rupture), a(".hcci-rift-upper", [{ transform: "none" }, { transform: "translate(8vw, -38vh) rotate(-3deg)" }], z.rupture, 535, Dt), a(".hcci-rift-lower", [{ transform: "none" }, { transform: "translate(-5vw, 40vh) rotate(-2deg)" }], z.rupture + 18, 585, Dt), a(".hcci-rift-slash", [
    { clipPath: St(1), opacity: 0.28 },
    { clipPath: St(13), opacity: 0.65, offset: 0.21, easing: Sa },
    { clipPath: St(126), opacity: 1, offset: 0.62 },
    { clipPath: St(126), opacity: 0.76, offset: 0.72 },
    { clipPath: St(126), opacity: 0 }
  ], z.anticipation, 340), a(".hcci-rift-splinters-top", [
    { opacity: 0 },
    { opacity: 1, offset: 0.025 },
    { opacity: 0, transform: "translate(6vw, -16vh) rotate(5deg)" }
  ], z.rupture, 465, Dt), a(".hcci-rift-splinters-bottom", [
    { opacity: 0 },
    { opacity: 1, offset: 0.025 },
    { opacity: 0, transform: "translate(-4vw, 12vh) rotate(-4deg)" }
  ], z.rupture + 15, 485, Dt), a(".hcci-visual", [
    { transform: "translate(-6vw, 5vh) rotate(-5deg)", opacity: 0 },
    { transform: "translate(1.2vw, -1vh) rotate(1deg)", opacity: 1, offset: 0.58, easing: "steps(1, end)" },
    { transform: "translate(1.2vw, -1vh) rotate(1deg)", opacity: 1, offset: 0.69 },
    { transform: "none", opacity: 1 }
  ], z.reveal, 625, fe), a(".hcci-copy", [
    { opacity: 0, transform: "translate(8vw, -3vh) skewX(-12deg)" },
    { opacity: 1, transform: "translate(-1vw, .5vh) skewX(2deg)", offset: 0.6 },
    { opacity: 1, transform: "none" }
  ], z.title, z.hold, fe), a(".hcci-rift-flash", [
    { opacity: 0 },
    { opacity: "var(--flash-peak, .14)", offset: 0.08 },
    { opacity: 0 }
  ], z.slash + 82, z.rupture + 33), a(".hcci-stage", [
    { transform: "none" },
    { transform: "translateX(var(--hcci-shake))", offset: 0.28 },
    { transform: "translateX(calc(-.5 * var(--hcci-shake)))", offset: 0.58 },
    { transform: "none" }
  ], z.title + 38, 640), { animations: i, audioDelay: z.slash * o };
}
function Ma(t, e) {
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return [];
  const i = [];
  for (const [o, a] of [
    [".hcci-visual", "translate(62vw, -43vh) rotate(-9deg)"],
    [".hcci-copy", "translate(75vw, -40vh) skewX(-12deg)"],
    [".hcci-rift-upper", "translate(20vw, -105vh) rotate(-6deg)"],
    [".hcci-rift-lower", "translate(-24vw, 100vh) rotate(-5deg)"]
  ]) {
    const r = t.querySelector(o);
    r && i.push(r.animate([{ transform: a }], { duration: e, easing: Ca, fill: "forwards" }));
  }
  return i;
}
const $t = "reality-override", Ta = 300, Jt = 5, I = { cut: 20, flip: 150, wind: 520, impact: 640, settle: 820 }, Ct = "cubic-bezier(.14,.82,.2,1)", At = "steps(1, end)", he = [1, -0.7, 0.5, -1, 0.8];
function xa(t) {
  const e = t === "low" ? 0 : t === "high" ? 8 : 4;
  return `<div class="hcci-ovr-freeze"></div>
    <div class="hcci-ovr-slab"></div>
    <div class="hcci-ovr-chips">${Array.from({ length: e }, (i, o) => `<i style="--k:${o}"></i>`).join("")}</div>
    <div class="hcci-ovr-flash"></div>`;
}
function Aa(t) {
  const e = t.querySelector(".hcci-visual"), i = t.querySelector(".hcci-portrait-frame > .hcci-portrait");
  if (!e || !i) return;
  e.querySelectorAll(".hcci-ovr-echo, .hcci-ovr-panel, .hcci-ovr-cuts, .hcci-ovr-band").forEach((l) => l.remove());
  const o = (l) => {
    const s = i.cloneNode(!0);
    return s.classList.remove("hcci-portrait"), s.classList.add(l), s;
  }, a = (l, s) => {
    const u = document.createElement(l.startsWith("i.") ? "i" : "div");
    return u.className = l.replace(/^i\./, ""), s !== void 0 && u.style.setProperty("--i", String(s)), u;
  }, r = a("hcci-ovr-echo");
  r.append(o("hcci-ovr-echo-art"));
  const n = a("hcci-ovr-panel");
  for (let l = 0; l < Jt; l++) {
    const s = a("hcci-ovr-louver", l);
    s.append(o("hcci-ovr-art"), a("i.hcci-ovr-tint"), a("i.hcci-ovr-face"), a("i.hcci-ovr-neg")), n.append(s);
  }
  const c = a("hcci-ovr-cuts");
  for (let l = 0; l <= Jt; l++) c.append(a("i.hcci-ovr-cut", l));
  e.append(r, n, c, a("hcci-ovr-band"));
}
function Ea(t, e) {
  var k;
  const i = [];
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return { animations: i, audioDelay: 0 };
  const o = Math.min(1, (e - 100) / I.settle), a = (y, O, R, F, Z = "linear", ot = "both") => {
    y && i.push(y.animate(O, { delay: R * o, duration: Math.max(1, (F - R) * o), easing: Z, fill: ot }));
  }, r = (y, O, R) => {
    const F = R * o;
    y && e > F && i.push(y.animate(O, { delay: F, duration: e - F, fill: "forwards" }));
  }, n = (y) => t.querySelector(y), c = (y) => Array.from(t.querySelectorAll(y)), l = c(".hcci-ovr-cut"), s = t.clientHeight || 1, u = Math.max(0, (((k = l[0]) == null ? void 0 : k.getBoundingClientRect().width) ?? 3) - 3), h = Math.hypot(u, s), d = u / h, m = -s / h, p = (y) => `rotate3d(${d.toFixed(4)},${m.toFixed(4)},0,${y}deg)`, v = (y) => `translate(${(d * y * s).toFixed(1)}px,${(m * y * s).toFixed(1)}px) scale(1.07)`;
  a(n(".hcci-ovr-freeze"), [{ opacity: 0 }, { opacity: 1 }], 0, 45);
  const b = "polygon(var(--ovr-lean) 0, calc(var(--ovr-lean) + 3px) 0, calc(var(--ovr-lean) + 3px) 0, var(--ovr-lean) 0)", w = "polygon(0 100%, 3px 100%, 3px 100%, 0 100%)", E = "polygon(var(--ovr-lean) 0, calc(var(--ovr-lean) + 3px) 0, 3px 100%, 0 100%)";
  for (const [y, O] of l.entries()) {
    const R = I.cut + y * 14;
    a(O, [{ clipPath: y % 2 ? w : b }, { clipPath: E }], R, R + 95, "cubic-bezier(.7,0,.3,1)"), y > 0 && y < Jt && a(O, [{ opacity: 1 }, { opacity: 1 }], 0, I.impact, "linear", "backwards");
  }
  a(n(".hcci-ovr-slab"), [
    { transform: "translate(calc(var(--ovr-lean) * 1.15), -115vh)" },
    { transform: "none" }
  ], I.flip, I.flip + 230, Ct), a(n(".hcci-ovr-echo"), [
    { transform: "translate(calc(var(--ovr-lean) * -1.15), 115vh)" },
    { transform: "none" }
  ], I.flip + 40, I.flip + 300, Ct);
  for (const [y, O] of c(".hcci-ovr-louver").entries()) {
    const R = I.flip + y * 38;
    a(O, [
      { opacity: 0, transform: p(-98) },
      { opacity: 1, transform: p(-98), offset: 0.02 },
      { opacity: 1, transform: p(10), offset: 0.68 },
      { opacity: 1, transform: p(0) }
    ], R, R + 230, Ct), a(O.querySelector(".hcci-ovr-face"), [{ opacity: 1 }, { opacity: 1, offset: 0.42 }, { opacity: 0 }], R, R + 230, "linear", "backwards");
    const F = O.querySelector(".hcci-ovr-art");
    a(F, [
      { transform: v(he[y] * 0.055) },
      { transform: v(he[y] * 0.024), offset: 0.97, easing: At },
      { transform: "none" }
    ], R, I.impact, "linear", "backwards"), a(O.querySelector(".hcci-ovr-tint"), [{ opacity: 1 }, { opacity: 1 }], 0, I.impact, "linear", "backwards"), t.classList.contains("hcci-flash-off") || a(O.querySelector(".hcci-ovr-neg"), [{ opacity: 1 }, { opacity: 1 }], I.impact, I.impact + 48, "linear", "none"), r(F, [{ transform: "none" }, { transform: "scale(1.04)" }], I.impact);
  }
  const L = n(".hcci-ovr-band");
  a(L, [
    { clipPath: "inset(49% 100% 49% 0)", backgroundColor: "#fff" },
    { clipPath: "inset(49% 0 49% 0)", backgroundColor: "#fff" }
  ], I.wind, I.impact, "cubic-bezier(.6,0,.9,.4)", "backwards"), a(L, [
    { clipPath: "inset(49% 0 49% 0)", backgroundColor: "#fff" },
    { clipPath: "inset(0 0 0 0)", backgroundColor: "#fff", offset: 0.55 },
    { clipPath: "inset(0 0 0 0)" }
  ], I.impact, I.impact + 110, Ct, "none"), a(n(".hcci-copy"), [{ opacity: 0, easing: At }, { opacity: 1 }], 0, I.impact + 14), a(n(".hcci-title"), [
    { transform: "skewX(-9deg) scale(1.55)" },
    { transform: "skewX(-9deg) scale(.96)", offset: 0.4, easing: At },
    { transform: "skewX(-9deg) scale(.96)", offset: 0.62 },
    { transform: "skewX(-9deg)" }
  ], I.impact + 14, I.impact + 150, Ct, "none"), a(n(".hcci-ovr-flash"), [
    { opacity: 0 },
    { opacity: "var(--flash-peak, .14)", offset: 0.1 },
    { opacity: 0 }
  ], I.impact, I.impact + 140), a(n(".hcci-stage"), [
    { transform: "none" },
    { transform: "translate(calc(var(--hcci-shake) * 1.4), calc(var(--hcci-shake) * -.5))", offset: 0.16 },
    { transform: "none" }
  ], I.impact, I.impact + 180, "ease-out", "none");
  for (const [y, O] of c(".hcci-ovr-chips i").entries()) {
    const R = y % 2 ? 1 : -1;
    a(O, [
      { opacity: 1, transform: "rotate(var(--ovr-tilt)) translateX(0)" },
      { opacity: 1, offset: 0.65 },
      { opacity: 0, transform: `rotate(var(--ovr-tilt)) translateX(${R * (34 + y * 5)}vw) rotate(${R * 160}deg)` }
    ], I.impact, I.impact + 300 + y * 12, "cubic-bezier(.1,.7,.3,1)", "none");
  }
  return r(n(".hcci-ovr-echo-art"), [{ transform: "scale(1.45)" }, { transform: "scale(1.45) translateX(-1.6vw)" }], I.flip + 300), r(n(".hcci-ovr-slab"), [{ transform: "none" }, { transform: "translate(calc(var(--ovr-lean) * -.05), 5vh)" }], I.flip + 230), { animations: i, audioDelay: I.cut * o };
}
function La(t, e) {
  var s;
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return [];
  const i = [], o = (u, h, d, m, p = "cubic-bezier(.6,.02,.9,.5)") => {
    u && i.push(u.animate(h, { delay: d * e, duration: (m - d) * e, easing: p, fill: "forwards" }));
  }, a = (u) => t.querySelector(u);
  o(a(".hcci-copy"), [{ opacity: 0, transform: "rotate(var(--ovr-tilt)) translateX(7vw)" }], 0, 0.28), o(a(".hcci-ovr-band"), [
    { clipPath: "inset(0 0 0 0)" },
    { clipPath: "inset(49% 0 49% 0)", backgroundColor: "#fff", offset: 0.5 },
    { clipPath: "inset(49% 0 49% 100%)", backgroundColor: "#fff" }
  ], 0, 0.6, "linear");
  const r = Array.from(t.querySelectorAll(".hcci-ovr-louver")), n = t.clientHeight || 1, c = Math.max(0, (((s = t.querySelector(".hcci-ovr-cut")) == null ? void 0 : s.getBoundingClientRect().width) ?? 3) - 3), l = Math.hypot(c, n);
  for (const [u, h] of r.entries()) {
    const d = 0.08 + (r.length - 1 - u) * 0.07;
    o(h, [
      { opacity: 1, transform: `rotate3d(${(c / l).toFixed(4)},${(-n / l).toFixed(4)},0,96deg)`, offset: 0.98, easing: At },
      { opacity: 0, transform: `rotate3d(${(c / l).toFixed(4)},${(-n / l).toFixed(4)},0,96deg)` }
    ], d, d + 0.42);
  }
  for (const u of t.querySelectorAll(".hcci-ovr-cut")) o(u, [{ opacity: 0 }], 0.08, 0.2, At);
  return o(a(".hcci-ovr-slab"), [{ transform: "translate(calc(var(--ovr-lean) * -1.15), 115vh)" }], 0.12, 0.82), o(a(".hcci-ovr-echo"), [{ transform: "translate(calc(var(--ovr-lean) * 1.15), -115vh)" }], 0.06, 0.76), o(a(".hcci-ovr-freeze"), [{ opacity: 0 }], 0.62, 1, "linear"), i;
}
const Pt = "system-collapse", $a = 420, yt = 12, Pa = 0.1, Ia = 0.07, A = { boot: 170, fault: 350, title: 560, freeze: 770, collapse: 880, impact: 1240, settle: 1400 }, J = "steps(1, end)", pe = "cubic-bezier(.14,.82,.2,1)", Na = [
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
], Da = [[560, 590, 3], [706, 730, 6], [752, 770, 9]], Ra = [[[350, 384], [706, 734]], [[620, 668], [752, 770]], [[480, 520]]], Za = [
  { drift: [[350, "translate(-.5vw,.4vh)"], [668, "translate(-1.1vw,.2vh) rotate(-3deg)"]], fall: 40, exit: "translate(-4vw,125vh) rotate(-80deg)" },
  { drift: [[560, "translate(.7vw,-.3vh)"], [734, "translate(.9vw,.8vh) rotate(5deg)"]], fall: 150, exit: "translate(5vw,125vh) rotate(95deg)" },
  { drift: [[620, "translate(-.3vw,1vh) rotate(-6deg)"]], fall: 230, exit: "translate(-2vw,60vh) rotate(-50deg)" },
  { drift: [[480, "translate(.4vw,.3vh)"], [706, "translate(1.3vw,.9vh) rotate(8deg)"]], fall: 300, exit: "translate(3vw,60vh) rotate(60deg)" }
];
function Oa(t) {
  const e = t === "low" ? 0 : t === "high" ? 3 : 2;
  return `<div class="hcci-col-freeze"></div>
    <div class="hcci-col-tears">${"<i></i>".repeat(e)}</div>
    <div class="hcci-col-flash"></div>`;
}
function Fa(t, e) {
  const i = t.naturalWidth, o = t.naturalHeight;
  if (!i || !o) return !1;
  try {
    const a = document.createElement("canvas");
    a.width = 80, a.height = yt * 8;
    const r = a.getContext("2d");
    if (!r) return !1;
    const n = Math.min(i, o * 0.8), c = Math.min(o, i / 0.8);
    r.imageSmoothingQuality = "high";
    const l = a.width / n, s = a.height / c;
    r.drawImage(t, (n - i) / 2 * l, (c - o) * 0.25 * s, i * l, o * s);
    for (const [u, h] of e.entries()) {
      const [d, m] = Array.from(h.querySelectorAll("canvas"));
      d.width = 40, d.height = 4;
      const p = d.getContext("2d");
      p.imageSmoothingQuality = "high", p.drawImage(a, 0, u * 8, 80, 8, 0, 0, 40, 4), m.width = 10, m.height = 1;
      const v = m.getContext("2d");
      v.imageSmoothingQuality = "high", v.drawImage(d, 0, 0, 40, 4, 0, 0, 10, 1);
    }
    return !0;
  } catch {
    return !1;
  }
}
function qa(t, e) {
  var u, h;
  const i = (((u = t.querySelector(".hcci-title")) == null ? void 0 : u.textContent) ?? "").trim().split(/\s+/).filter(Boolean);
  t.style.setProperty("--col-word", String(Math.max(6, ...i.map((d) => d.length)))), t.style.setProperty("--col-lines", String(Math.max(1, i.length)));
  const o = t.querySelector(".hcci-visual"), a = t.querySelector(".hcci-portrait-frame > .hcci-portrait");
  if (!e || !o || !a) return;
  o.querySelectorAll(".hcci-col-backing, .hcci-col-rows, .hcci-col-brackets, .hcci-col-floor, .hcci-col-beam").forEach((d) => d.remove()), (h = t.querySelector(".hcci-col-cursor")) == null || h.remove();
  const r = (d, m) => {
    const p = document.createElement(d);
    return p.className = m, p;
  }, n = r("div", "hcci-col-rows hcci-col-plain"), c = [];
  for (let d = 0; d < yt; d++) {
    const m = r("div", "hcci-col-row");
    m.style.setProperty("--r", String(d));
    const p = r("div", "hcci-col-fall"), v = r("div", "hcci-col-band"), b = a.cloneNode(!0);
    b.classList.remove("hcci-portrait"), b.classList.add("hcci-col-art"), v.append(b, r("canvas", "hcci-col-lod"), r("canvas", "hcci-col-lod"), r("i", "hcci-col-dead")), p.append(v), m.append(p), n.append(m), c.push(m);
  }
  const l = r("div", "hcci-col-brackets");
  l.innerHTML = "<i></i><i></i><i></i><i></i>", o.append(r("div", "hcci-col-backing"), n, l, r("div", "hcci-col-floor"), r("div", "hcci-col-beam"));
  const s = t.querySelector(".hcci-copy");
  if (s != null && s.children.length && s.append(r("i", "hcci-col-cursor")), a instanceof HTMLImageElement) {
    const d = () => n.classList.toggle("hcci-col-plain", !Fa(a, c));
    a.complete && d(), a.addEventListener("load", d, { once: !0 });
  }
}
function Ha(t, e) {
  const i = [];
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return { animations: i, audioDelay: 0 };
  const o = Math.min(1, (e - 100) / A.settle), a = (p, v, b, w, E = "linear", L = "both") => {
    p && i.push(p.animate(v, { delay: b * o, duration: Math.max(1, (w - b) * o), easing: E, fill: L }));
  }, r = (p) => t.querySelector(p), n = (p) => Array.from(t.querySelectorAll(p)), c = (p, v, b = v) => [
    { ...v, offset: 0, easing: J },
    ...p.map(([w, E]) => ({ ...E, offset: w / A.freeze, easing: J })),
    { ...b, offset: 1 }
  ];
  a(r(".hcci-col-freeze"), [{ opacity: 0 }, { opacity: 1 }], 0, A.boot);
  const l = [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }], s = r(".hcci-col-rows");
  a(s, l, 40, A.boot, "steps(6, end)", "backwards"), a(r(".hcci-col-brackets"), [{ opacity: 0, transform: "scale(.9)" }, { opacity: 1, transform: "none" }], 0, 120, pe);
  for (const [p, v] of n(".hcci-col-row").entries()) {
    const b = Na.filter((k) => k[1] === p);
    a(v, c(b.map(([k, , y]) => [k, { transform: `translateX(${y}%)` }]), { transform: "none" }), 0, A.freeze);
    const [w, E] = Array.from(v.querySelectorAll("canvas"));
    a(w, c(b.map(([k, , , y]) => [k, { opacity: y >= 1 ? 1 : 0 }]), { opacity: 0 }, { opacity: 1 }), 0, A.freeze), a(E, c(b.map(([k, , , y]) => [k, { opacity: y === 2 ? 1 : 0 }]), { opacity: 0 }, { opacity: 1 }), 0, A.freeze);
    const L = Da.filter((k) => k[2] === p);
    L.length && a(v.querySelector(".hcci-col-dead"), c(L.flatMap(([k, y]) => [[k, { opacity: 1 }], [y, { opacity: 0 }]]), { opacity: 0 }), 0, A.freeze);
  }
  a(s, c([[706, { transform: "translateY(2.5%)" }], [734, { transform: "none" }]], { transform: "none" }), 0, A.freeze);
  for (const [p, v] of n(".hcci-col-tears i").entries())
    a(v, c(Ra[p].flatMap(([b, w]) => [[b, { opacity: 1 }], [w, { opacity: 0 }]]), { opacity: 0 }), 0, A.freeze);
  const u = n(".hcci-col-brackets i");
  for (const [p, v] of u.entries()) {
    const { drift: b, fall: w, exit: E } = Za[p], L = { transform: b[b.length - 1][1] };
    a(v, c(b.map(([k, y]) => [k, { transform: y }]), { transform: "none" }, L), 0, A.freeze), a(v, [L, { transform: E }], A.collapse + w, A.collapse + w + 420, "cubic-bezier(.5,0,1,.6)", "forwards");
  }
  a(r(".hcci-copy"), [
    { opacity: 0, clipPath: "inset(0 0 100% 0)", easing: J },
    { opacity: 1, clipPath: "inset(0 0 66% 0)", offset: 0.34, easing: J },
    { opacity: 1, clipPath: "inset(0 0 33% 0)", offset: 0.67, easing: J },
    { opacity: 1, clipPath: "inset(-30%)" }
  ], A.title, A.title + 90);
  const h = A.impact - A.collapse;
  a(r(".hcci-col-backing"), [{ opacity: 1, easing: J }, { opacity: 0 }], 0, A.collapse);
  for (const [p, v] of n(".hcci-col-row").entries()) {
    const b = Math.sqrt(p / yt), w = Math.sqrt((p + 1) / yt);
    if (a(
      v.querySelector(".hcci-col-band"),
      [{ transform: "none" }, { transform: `scaleY(${Ia})` }],
      A.collapse + b * h,
      A.collapse + w * h,
      "ease-in",
      "both"
    ), p === yt - 1) continue;
    const E = `cubic-bezier(.3333,${(2 * w / (1 + w) / 3).toFixed(4)},.6667,${(1 - 2 / (1 + w) / 3).toFixed(4)})`;
    a(v.querySelector(".hcci-col-fall"), [
      { transform: "none" },
      { transform: `translateY(${((yt - 1 - p) * (1 - Pa) * 100).toFixed(2)}%)` }
    ], A.collapse + w * h, A.impact, E, "both");
  }
  const d = r(".hcci-portrait-frame");
  a(d, [{ filter: "brightness(.45)" }, { filter: "brightness(.45)" }], 0, A.impact, "linear", "backwards"), a(d, [{ filter: "brightness(1.7)" }, { filter: "brightness(1)" }], A.impact, A.impact + 240, "ease-out", "none"), a(
    r(".hcci-col-floor"),
    [{ transform: "scaleX(0)", opacity: 1 }, { transform: "scaleX(1)", opacity: 1, offset: 0.5 }, { transform: "scaleX(1)", opacity: 0.55 }],
    A.impact,
    A.impact + 280,
    pe
  ), a(r(".hcci-col-flash"), [
    { opacity: 0 },
    { opacity: "var(--flash-peak, .14)", offset: 0.1 },
    { opacity: 0 }
  ], A.impact, A.impact + 160), a(r(".hcci-stage"), [{ transform: "translateY(var(--hcci-shake))" }, { transform: "none" }], A.impact, A.impact + 170, "ease-out", "none"), a(s, [{ transform: "translateY(.5vh)" }, { transform: "none" }], A.impact, A.impact + 90, "ease-out", "none"), a(r(".hcci-copy"), [{ transform: "translateY(1.4vh)" }, { transform: "none" }], A.impact, A.impact + 110, "ease-out", "none");
  const m = A.settle * o;
  if (e > m) {
    const p = r(".hcci-portrait-frame > .hcci-portrait");
    p && i.push(p.animate(
      [{ transform: "none" }, { transform: "scale(1.035)" }],
      { delay: A.impact * o, duration: e - A.impact * o, fill: "forwards" }
    ));
    const v = r(".hcci-col-cursor");
    v && i.push(v.animate([
      { opacity: 1, easing: J },
      { opacity: 0, offset: 0.5, easing: J },
      { opacity: 1 }
    ], { delay: m, duration: 560, iterations: Math.max(1, Math.round((e - m) / 560)), fill: "forwards" }));
  }
  return { animations: i, audioDelay: A.fault * o };
}
function za(t, e) {
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return [];
  const i = [], o = (r, n, c, l, s = "linear") => {
    r && i.push(r.animate(n, { delay: c * e, duration: (l - c) * e, easing: s, fill: "forwards" }));
  }, a = (r) => t.querySelector(r);
  o(a(".hcci-copy"), [
    { clipPath: "inset(-30% -30% 0 -30%)", easing: J },
    { clipPath: "inset(-30% -30% 34% -30%)", offset: 0.33, easing: J },
    { clipPath: "inset(-30% -30% 67% -30%)", offset: 0.66, easing: J },
    { clipPath: "inset(-30% -30% 100% -30%)", opacity: 0 }
  ], 0, 0.3), o(a(".hcci-col-floor"), [{ transform: "scaleX(0)" }], 0, 0.36, "cubic-bezier(.6,0,.9,.4)");
  for (const r of t.querySelectorAll(".hcci-col-brackets")) o(r, [{ opacity: 0 }], 0, 0.05);
  for (const r of [".hcci-portrait-frame", ".hcci-col-rows", ".hcci-col-backing"])
    o(a(r), [
      { transform: "scaleY(.004)", opacity: 1, offset: 0.97, easing: J },
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
const re = "crosshair-sever";
function _a() {
  return '<div class="hcci-sever-crosshair"><i></i></div><div class="hcci-sever-cut hcci-sever-cut-horizontal"></div><div class="hcci-sever-cut hcci-sever-cut-vertical"></div>';
}
function Ga(t, e) {
  const i = t.querySelector(".hcci-visual"), o = i.querySelector(".hcci-portrait-frame .hcci-portrait"), a = i.querySelector(".hcci-sever-pieces");
  if (a) {
    for (const s of a.querySelectorAll(".hcci-portrait")) s.replaceWith(o.cloneNode(!0));
    return;
  }
  const r = document.createElement("div");
  r.className = "hcci-sever-pieces";
  const n = e === "low" ? 2 : e === "high" ? 4 : 3, c = 50 / n, l = (s, u, h, d) => {
    const m = document.createElement("div");
    return m.className = s, m.style.clipPath = `inset(${h}% ${100 - u - d}% ${100 - h - d}% ${u}%)`, m.append(o.cloneNode(!0)), m;
  };
  for (const [s, u] of [[0, 0], [50, 0], [0, 50], [50, 50]]) {
    const h = document.createElement("div");
    h.className = "hcci-sever-quadrant", h.style.setProperty("--qx", s === 0 ? "-1" : "1"), h.style.setProperty("--qy", u === 0 ? "-1" : "1"), h.append(l("hcci-sever-solid", s, u, 50));
    for (let d = 0; d < n; d++)
      for (let m = 0; m < n; m++) {
        const p = d * n + m, v = l("hcci-sever-tile", s + m * c, u + d * c, c);
        v.style.setProperty("--drift-x", String(0.25 + (p * 7 + s) % 13 / 12)), v.style.setProperty("--drift-y", String(0.25 + (p * 11 + u) % 17 / 16)), v.style.setProperty("--lag", String((p * 7 + s + u) % 11)), v.style.setProperty("--spin", `${(p % 5 - 2) * 14}deg`), v.style.transformOrigin = `${s + (m + 0.5) * c}% ${u + (d + 0.5) * c}%`, h.append(v);
      }
    r.append(h);
  }
  i.append(r);
}
const Ht = [
  { id: "strike", label: "Neon Strike", description: "A diagonal energy slash, speed trails and an impact wave.", shake: 0.7 },
  { id: "breach", label: "Panel Breach", description: "An energized seam opens to reveal the portrait between blast doors.", shake: 0.5 },
  { id: "signal", label: "Signal Bloom", description: "A holographic portrait resolves inside a precision targeting array.", shake: 0.15 },
  { id: "rift", label: "Rift Slash", description: "A jagged energy blade tears through armored plates and reveals the character.", shake: 0.4 },
  { id: "shatter", label: "Quantum Shatter", description: "Prismatic shards assemble around the portrait, then scatter into light.", shake: 0.65 },
  { id: "reactor", label: "Reactor Surge", description: "Charging rails ignite a vertical plasma column and overcharge halo.", shake: 0.85 },
  { id: "void", label: "Void Collapse", description: "An accretion disk contracts into an eclipse before releasing the portrait.", shake: 0.4 },
  { id: "railgun", label: "Railgun Salvo", description: "Targeting rails converge into a horizontal lance with a ballistic reveal.", shake: 1 },
  { id: "eclipse", label: "Astral Eclipse", description: "An orbital crown and star field frame a slow celestial reveal.", shake: 0 },
  { id: mt, label: "COMIC", description: "A burst of ink cuts to a halftone portrait and a full-color manga impact.", shake: 0.7 },
  { id: Lt, label: "SHATTER", description: "The portrait breaks into eighteen shards, exposing a fractured title behind it.", shake: 0.65 },
  { id: "overdrive", label: "Cyber Overdrive", description: "A perspective data tunnel accelerates into a segmented hologram.", shake: 0.45 },
  { id: $t, label: "Reality Override", description: "The scene freezes and is cut into slanted louvers that flip open on the portrait, then lock under a title band.", shake: 0.8 },
  { id: Pt, label: "System Collapse", description: "The portrait loses sync and resolution row by row, freezes, then pancakes to the floor before powering off.", shake: 0.6 },
  { id: re, label: "SPLIT", description: "A crosshair locks onto the portrait. Plasma cuts along both axes, splitting the image into four pieces that disintegrate.", shake: 0.55 }
];
function zt(t) {
  var e;
  return ((e = Ht.find((i) => i.id === t)) == null ? void 0 : e.id) ?? "strike";
}
function ne(t) {
  return Ht.find((e) => e.id === zt(t));
}
const D = (t, e = 1) => Array.from({ length: e }, (i, o) => `<i class="hcci-fx hcci-fx-${t}" style="--i:${o};--n:${e};--v:${o % 4};--d:${o % 5};--s:${o % 3}"></i>`).join("");
function Ba(t, e = "standard") {
  const i = zt(t), o = e === "low" ? 8 : e === "high" ? 28 : 16, a = D("particle", o), r = D("wave", 2);
  switch (i) {
    case "strike":
      return D("slash", 2) + D("speed", 7) + r + a;
    case "breach":
      return '<div class="hcci-tear hcci-tear-top"><span></span></div><div class="hcci-tear hcci-tear-bottom"><span></span></div>' + D("door", 2) + a;
    case "signal":
      return D("reticle", 3) + D("tick", 12) + D("sweep") + r;
    case Lt:
      return sa();
    case mt:
      return ma(e);
    case "rift":
      return wa(e);
    case $t:
      return xa(e);
    case Pt:
      return Oa(e);
    case re:
      return _a();
    case "shatter":
      return D("shard", o) + D("prism", 2) + r;
    case "reactor":
      return D("rail", 6) + D("column") + D("corona", 2) + a;
    case "void":
      return D("disk", 2) + D("horizon") + D("infall", o) + r;
    case "railgun":
      return D("sight", 4) + D("lance") + D("wake", 7) + a;
    case "eclipse":
      return D("moon") + D("crown", 2) + D("star", o) + D("orbit", 3);
    case "overdrive":
      return D("gate", 5) + D("data", o) + D("sweep") + r;
  }
}
const vt = [], kt = /* @__PURE__ */ new Set();
let Zt = !1;
function Mt(t) {
  const e = document.createElement("div");
  return e.textContent = String(t ?? ""), e.innerHTML.replace(/"/g, "&quot;");
}
function Xa(t) {
  var i, o, a, r, n;
  if (!t.preview && S(g.suppressCutins) === !0 || t != null && t.blind && !((i = game.user) != null && i.isGM) || Array.isArray(t == null ? void 0 : t.whisper) && t.whisper.length && !t.whisper.includes((o = game.user) == null ? void 0 : o.id) && !((a = game.user) != null && a.isGM))
    return !1;
  const e = (t == null ? void 0 : t.audience) ?? S(g.audience);
  return e === st.everyone ? !0 : e === st.gm ? ((r = game.user) == null ? void 0 : r.isGM) === !0 : e === st.triggeringPlayer ? ((n = game.user) == null ? void 0 : n.id) === (t == null ? void 0 : t.userId) : !0;
}
async function Va(t, e) {
  var i, o;
  if (t)
    try {
      const a = Math.min(1, Math.max(0, Number(e ?? S(g.volume) ?? 0.8))), r = Math.min(1, Math.max(0, Number(S(g.localVolume) ?? 1))), n = a * r;
      if ((o = (i = foundry.audio) == null ? void 0 : i.AudioHelper) != null && o.play)
        return foundry.audio.AudioHelper.play({ src: t, volume: n, autoplay: !0, loop: !1 }, !1);
      const c = globalThis.AudioHelper;
      if (c != null && c.play)
        return c.play({ src: t, volume: n, autoplay: !0, loop: !1 }, !1);
      const l = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), s = new Audio(t);
      return s.volume = n * l, await s.play(), s;
    } catch (a) {
      return wt("Audio playback failed.", { src: t, error: a }), null;
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
    wt("Audio stop failed.", e);
  }
}
function ja(t) {
  var rt, Y;
  const e = ne(t.animationStyle), i = e.id, o = t.triggerKind === "failure" ? "failure" : "success", a = i === "rift", r = i === mt, n = i === Lt, c = i === $t, l = i === Pt, s = a || r || n || c || l, u = t.accentColor || (r ? oe : (a || n || c || l) && o === "failure" ? "#ff4d7d" : "#69e8ff"), h = t.imagePath ? `<img class="hcci-portrait" src="${Mt(t.imagePath)}" alt="">` : '<div class="hcci-portrait hcci-portrait-fallback"><i class="fa-solid fa-user-astronaut"></i></div>', d = Math.max(1, String(t.overlayText ?? "").length), m = String(t.overlayText ?? "").trim().split(/\s+/), p = n ? `; --hcci-title-longest-word: ${Math.max(1, ...m.map((_) => _.length))}` : "", v = n && m.length > 1 ? `${Mt(m.slice(0, -1).join(" "))} <span>${Mt(m.at(-1))}</span>` : Mt(t.overlayText), b = t.textEnabled && t.overlayText ? `<div class="hcci-title" style="--hcci-title-chars: ${d}${p}">${v}</div>` : "", w = t.actorName || "", E = String(S(g.motionMode) ?? "system"), L = ((Y = (rt = globalThis.matchMedia) == null ? void 0 : rt.call(globalThis, "(prefers-reduced-motion: reduce)")) == null ? void 0 : Y.matches) === !0, k = E === "system" || s && L && E === "full" ? L ? "reduced" : "full" : ["full", "reduced", "still"].includes(E) ? E : "full", y = String(S(g.flashMode) ?? "soft"), O = ["full", "soft", "off"].includes(y) ? y : "soft", R = S(g.effectIntensity), F = ["low", "standard", "high"].includes(R) ? R : "standard", Z = document.createElement("div");
  Z.className = `hcci-overlay hcci-style-${i} hcci-kind-${o} hcci-motion-${k} hcci-flash-${O} hcci-detail-${F}`, Z.style.setProperty("--hcci-accent", u);
  const ot = S(g.animationFont);
  Z.style.setProperty("--hcci-font", ot === "classic" ? '"Orbitron", "Eurostile", "Agency FB", Impact, sans-serif' : '"HCCI AICON", "Orbitron", sans-serif');
  const U = Number(S(g.shakeIntensity) ?? 0.5);
  Z.style.setProperty("--hcci-shake", `${e.shake * (Number.isFinite(U) ? Math.max(0, Math.min(1, U)) : 0.5) * 9}px`), Z.setAttribute("aria-hidden", "true");
  const W = k === "full" || r ? Ba(i, F) : "";
  Z.innerHTML = `
    ${r || n || c || l ? "" : `<div class="${a ? "hcci-rift-flash" : "hcci-flash"}"></div>`}
    ${s ? W : ""}
    <div class="hcci-atmosphere"></div>
    <section class="hcci-stage">
      <div class="hcci-visual">
      <div class="hcci-effects">${s ? "" : W}</div>
      <div class="hcci-portrait-frame">
        ${r ? `<div class="hcci-manga-artwork">${h}</div><div class="hcci-manga-dots"></div>` : h}
      </div>
      ${r ? '<div class="hcci-manga-panel-glint"></div>' : ""}
      <div class="hcci-frame-accent"></div>
      </div>
      <div class="hcci-copy">
        ${b}
        ${w ? `<div class="hcci-subtitle">${Mt(w)}</div>` : ""}
      </div>
    </section>
  `;
  const it = n && k === "full", Q = () => {
    it && ua(Z), c && k === "full" && Aa(Z), l && qa(Z, k === "full"), i === re && k === "full" && Ga(Z, F);
  };
  Q();
  const X = Z.querySelector("img.hcci-portrait");
  if (X && k === "full" && (i === "shatter" || i === "overdrive")) {
    const _ = [
      "polygon(0 0,50% 0,50% 50%)",
      "polygon(50% 0,100% 0,50% 50%)",
      "polygon(100% 0,100% 100%,50% 50%)",
      "polygon(100% 100%,50% 100%,50% 50%)",
      "polygon(50% 100%,0 100%,50% 50%)",
      "polygon(0 100%,0 0,50% 50%)"
    ];
    for (let V = 0; V < 6; V++) {
      const G = document.createElement("div");
      G.className = "hcci-portrait-echo", G.style.setProperty("--piece", String(V)), G.style.setProperty("--dx", `${V % 2 ? 1 : -1}`), G.style.setProperty("--dy", `${V < 3 ? -1 : 1}`), G.style.clipPath = i === "shatter" ? _[V] : `inset(${V * 100 / 6}% 0 ${100 - (V + 1) * 100 / 6}% 0)`;
      const f = X.cloneNode();
      f.className = "", G.appendChild(f), Z.querySelector(".hcci-visual").appendChild(G);
    }
  }
  return X == null || X.addEventListener("error", () => {
    const _ = t.preview ? t.fallbackImagePath : void 0;
    if (_ && X.getAttribute("src") !== _) {
      X.src = _, Z.querySelectorAll(".hcci-portrait-echo img").forEach((G) => {
        G.src = _;
      }), Q();
      return;
    }
    Z.querySelectorAll(".hcci-portrait-echo").forEach((G) => G.remove());
    const V = document.createElement("div");
    V.className = "hcci-portrait hcci-portrait-fallback", V.innerHTML = '<i class="fa-solid fa-user-astronaut"></i>', X.replaceWith(V), Q();
  }), Z;
}
async function Ya(t) {
  if (!Xa(t)) return;
  const e = Number(t.duration ?? S(g.duration) ?? 2500), i = Math.min(8e3, Math.max(800, Number.isFinite(e) ? e : 2500)), o = ja(t);
  o.style.setProperty("--hcci-duration", `${i}ms`), o.style.setProperty("--hcci-intro", `${Math.min(1e3, (i - 180) * 0.85)}ms`);
  let a = !1, r, n, c, l = [], s;
  try {
    document.body.appendChild(o);
    const u = o.classList.contains(`hcci-style-${Lt}`), h = o.classList.contains(`hcci-style-${$t}`), d = o.classList.contains(`hcci-style-${Pt}`), m = u ? da : h ? Ta : d ? $a : 180, p = i - m, v = o.classList.contains("hcci-style-rift"), b = o.classList.contains(`hcci-style-${mt}`), w = h ? Ea(o, p) : d ? Ha(o, p) : u ? ha(o, p) : b ? va(o, p) : v ? ka(o, p) : void 0;
    w && (l = w.animations);
    const E = () => {
      Va(t.audioPath, t.volume).then((L) => {
        a ? jt(L) : r = L;
      });
    };
    t.audioPath && (w != null && w.audioDelay) ? c = window.setTimeout(E, w.audioDelay) : E(), await new Promise((L) => {
      n = window.setTimeout(k, p);
      function k() {
        window.clearTimeout(n), globalThis.removeEventListener("keydown", s), L();
      }
      s = (y) => {
        y.key === "Escape" && k();
      }, globalThis.addEventListener("keydown", s);
    }), a = !0, window.clearTimeout(c), jt(r), r = null, o.classList.add("hcci-exiting"), h ? l.push(...La(o, m)) : d ? l.push(...za(o, m)) : u ? l.push(...pa(o, m)) : b ? l.push(...ba(o, m)) : v && l.push(...Ma(o, m)), await new Promise((L) => window.setTimeout(L, m));
  } finally {
    a = !0, window.clearTimeout(n), window.clearTimeout(c), l.forEach((u) => u.cancel()), s && globalThis.removeEventListener("keydown", s), jt(r), o.remove();
  }
}
async function Ka(t) {
  var e, i;
  return !((e = game.user) != null && e.isGM) || Zt ? !1 : (await pt({
    ...t,
    id: foundry.utils.randomID(),
    userId: ((i = game.user) == null ? void 0 : i.id) ?? null,
    audience: st.gm,
    preview: !0
  }), !0);
}
async function Ua() {
  if (!Zt) {
    Zt = !0;
    try {
      for (; vt.length; ) {
        const t = vt.shift();
        try {
          await Ya(t);
        } catch (e) {
          wt("Cut-in playback failed; continuing queue.", e);
        }
      }
    } finally {
      Zt = !1;
    }
  }
}
function pt(t) {
  if (t) {
    if (t.id) {
      if (kt.has(t.id)) return;
      kt.add(t.id);
      const e = kt.values().next().value;
      kt.size > 100 && e && kt.delete(e);
    }
    return vt.push(t), vt.length > 3 && vt.splice(1, vt.length - 3), Ua();
  }
}
const dt = /* @__PURE__ */ new Set(), te = /* @__PURE__ */ new Set();
function Wa(t) {
  return !!(t != null && t.id) && te.has(t.id);
}
function K(t) {
  return t ? Array.isArray(t) ? t : [t] : [];
}
function Qa(t) {
  var o, a, r, n;
  const e = [
    ...K(t == null ? void 0 : t.rolls),
    ...K(t == null ? void 0 : t.roll),
    ...K(t == null ? void 0 : t._rolls),
    ...K((a = (o = t == null ? void 0 : t.flags) == null ? void 0 : o.dnd5e) == null ? void 0 : a.roll),
    ...K((n = (r = t == null ? void 0 : t.flags) == null ? void 0 : r.dnd5e) == null ? void 0 : n.rolls)
  ], i = /* @__PURE__ */ new Set();
  return e.filter((c) => !c || i.has(c) ? !1 : (i.add(c), !0));
}
function Ja(t) {
  const e = [], i = [...K(t == null ? void 0 : t.terms), ...K(t == null ? void 0 : t.dice), ...K(t == null ? void 0 : t._terms), ...K(t == null ? void 0 : t._dice)], o = /* @__PURE__ */ new Set();
  for (; i.length; ) {
    const a = i.shift();
    !a || o.has(a) || (o.add(a), e.push(a), i.push(
      ...K(a.terms),
      ...K(a.dice),
      ...K(a.rolls),
      ...K(a._terms),
      ...K(a._dice)
    ));
  }
  return e;
}
function Ne(t, e) {
  var r, n, c, l, s, u, h, d;
  const i = (t == null ? void 0 : t.flags) ?? {}, o = ((n = (r = i.dnd5e) == null ? void 0 : r.roll) == null ? void 0 : n.type) ?? ((l = (c = i.dnd5e) == null ? void 0 : c.roll) == null ? void 0 : l.rollType), a = (u = (s = i.pf2e) == null ? void 0 : s.context) == null ? void 0 : u.type;
  return [(h = e == null ? void 0 : e.options) == null ? void 0 : h.type, (d = e == null ? void 0 : e.options) == null ? void 0 : d.rollType, o, a].some((m) => String(m ?? "").toLowerCase().includes("damage"));
}
function ti(t) {
  const e = [];
  for (const i of Ja(t)) {
    const o = Number((i == null ? void 0 : i.faces) ?? (i == null ? void 0 : i._faces));
    if (!(o !== at() || !Array.isArray(i.results)))
      for (const a of i.results) {
        if (a.active === !1 || a.discarded === !0 || a.rerolled === !0) continue;
        const r = Number(a.result ?? a.value ?? a.total);
        Number.isInteger(r) && r >= 1 && r <= o && e.push(r);
      }
  }
  return e;
}
function ei(t) {
  return t ? t instanceof HTMLElement ? t : t[0] instanceof HTMLElement ? t[0] : null : null;
}
function ai(t) {
  var n;
  const e = ei(t);
  if (!e) return [];
  const i = [], o = `d${at()}`, a = [
    `.dice-rolls .roll.${o}`,
    `.dice-rolls .roll.die.${o}`,
    `.dice-tooltip .roll.${o}`,
    `.dice-tooltip .dice.${o} .roll`
  ], r = /* @__PURE__ */ new Set();
  for (const c of a)
    e.querySelectorAll(c).forEach((l) => r.add(l));
  for (const c of r) {
    if (c.classList.contains("discarded") || c.classList.contains("rerolled") || c.classList.contains("ignored") || c.classList.contains("inactive"))
      continue;
    const l = Number((n = c.textContent) == null ? void 0 : n.trim());
    Number.isInteger(l) && l >= 1 && l <= at() && i.push(l);
  }
  return i;
}
function De(t, e) {
  return `${t}:${e}`;
}
function ii() {
  return De("gm", "default");
}
function oi(t) {
  return zt(t);
}
function Re(t, e) {
  var o, a, r, n;
  if (!t || !e) return !1;
  const i = ((a = (o = globalThis.CONST) == null ? void 0 : o.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3;
  return Number(((r = t.ownership) == null ? void 0 : r[e]) ?? ((n = t.ownership) == null ? void 0 : n.default) ?? 0) >= i;
}
function Ze(t) {
  var i;
  const e = (t == null ? void 0 : t.speaker) ?? {};
  return e.actor ? ((i = game.actors) == null ? void 0 : i.get(e.actor)) ?? null : t != null && t.actor ? t.actor : null;
}
function ri(t) {
  var o, a, r;
  const e = (t == null ? void 0 : t.author) ?? (t == null ? void 0 : t.user);
  if (e && typeof e == "object") return e.id ? ((o = game.users) == null ? void 0 : o.get(e.id)) ?? e : null;
  const i = e ?? ((a = t == null ? void 0 : t._source) == null ? void 0 : a.author) ?? (t == null ? void 0 : t.userId);
  return i ? ((r = game.users) == null ? void 0 : r.get(i)) ?? null : null;
}
function Oe(t, e) {
  var o;
  const i = ri(t);
  if (i && !i.isGM) return i;
  if (e) {
    const a = (o = game.users) == null ? void 0 : o.find((r) => !r.isGM && Re(e, r.id));
    if (a) return a;
  }
  return i ?? null;
}
function me(t = {}, e, i, o = !1) {
  const a = e === "failure" ? Te() : ae(), r = S(e === "failure" ? g.defaultFailureText : g.defaultText), n = e === "failure" ? t.failure ?? {} : t, c = oi(n.animationStyle), l = c === mt ? oe : e === "failure" ? "#ff4d7d" : "#69e8ff", s = Number(n.threshold);
  return {
    kind: e,
    enabled: n.enabled !== !1,
    threshold: Number.isInteger(s) && s >= 1 && s <= at() ? s : a,
    duration: xt(n.duration) ?? S(g.duration),
    animationStyle: c,
    imagePath: (o ? i == null ? void 0 : i.img : "") || n.imagePath || (i == null ? void 0 : i.img) || "",
    audioPath: n.audioPath || "",
    overlayText: n.overlayText || r,
    accentColor: n.accentColor || l
  };
}
function Et(t, e, i = "success") {
  const o = Ut(), a = e ? o[De("actor", e.id)] : null, r = (t == null ? void 0 : t.isGM) === !0, n = r ? o[ii()] : null;
  if (!e && !r && !a)
    return me({ enabled: !1 }, i, e);
  const c = r && !a && !!(e != null && e.img);
  return me(a ?? n ?? {}, i, e, c);
}
function Fe(t, e, i, o, a) {
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
    textEnabled: S(g.textEnabled),
    duration: a.duration,
    volume: S(g.volume),
    audience: S(g.audience)
  } : (wt("Cut-in disabled for target.", { userId: o == null ? void 0 : o.id, actorId: i == null ? void 0 : i.id }), null);
}
function ge(t, e, i = "success") {
  const o = Qa(t);
  if (!(t != null && t.isRoll) && !o.length) return null;
  for (const a of o) {
    if (Ne(t, a)) continue;
    const r = ti(a).find((n) => Ae(n, e, i));
    if (r) return r;
  }
  return null;
}
function ye(t, e, i, o = "success") {
  const a = ai(e);
  return !a.length || Ne(t, {}) ? null : a.find((r) => Ae(r, i, o)) ?? null;
}
function ve() {
  var i, o;
  const e = (((i = game.users) == null ? void 0 : i.filter((a) => a.active && a.isGM)) ?? []).sort((a, r) => a.id.localeCompare(r.id))[0];
  return ((o = game.user) == null ? void 0 : o.isGM) && (!e || e.id === game.user.id);
}
function Ot(t) {
  dt.add(t);
  const e = dt.values().next().value;
  dt.size > 200 && e && dt.delete(e);
}
function qe(t) {
  var u, h, d;
  if (!(t != null && t.id) || (h = (u = t.flags) == null ? void 0 : u[C]) != null && h[ie] || dt.has(t.id)) return !0;
  const e = Ze(t), i = Oe(t, e), o = Et(i, e, "success"), a = Et(i, e, "failure"), r = ge(t, a.threshold, "failure"), n = r ? null : ge(t, o.threshold, "success"), c = r ?? n;
  if (!c) return !1;
  const s = Fe(t, c, e, i, r ? a : o);
  return s ? (Ot(t.id), wt("Triggering cut-in.", s), (d = game.socket) == null || d.emit(Ft, { type: "play", payload: s }), pt(s), !0) : (Ot(t.id), !0);
}
function ni(t, e) {
  var h, d, m;
  if (!(t != null && t.id) || (d = (h = t.flags) == null ? void 0 : h[C]) != null && d[ie] || dt.has(t.id)) return !0;
  const i = Ze(t), o = Oe(t, i), a = Et(o, i, "success"), r = Et(o, i, "failure"), n = ye(t, e, r.threshold, "failure"), c = n ? null : ye(t, e, a.threshold, "success"), l = n ?? c;
  if (!l) return !1;
  const u = Fe(t, l, i, o, n ? r : a);
  return u ? (Ot(t.id), wt("Triggering cut-in from rendered chat card.", u), (m = game.socket) == null || m.emit(Ft, { type: "play", payload: u }), pt(u), !0) : (Ot(t.id), !0);
}
function Yt(t, e) {
  t != null && t.id && globalThis.setTimeout(() => {
    var o;
    if (dt.has(t.id)) return;
    const i = ((o = game.messages) == null ? void 0 : o.get(t.id)) ?? t;
    qe(i);
  }, e);
}
function ci() {
  var e;
  te.clear();
  for (const i of game.messages ?? [])
    i != null && i.id && te.add(i.id);
  Hooks.on("createChatMessage", (i) => {
    S(g.enabled) && ve() && (qe(i) || (Yt(i, 100), Yt(i, 500), Yt(i, 1500)));
  });
  const t = (i, o) => {
    S(g.enabled) && (Wa(i) || ve() && ni(i, o));
  };
  Hooks.on("renderChatMessage", t), Hooks.on("renderChatMessageHTML", t), (e = game.socket) == null || e.on(Ft, (i) => {
    (i == null ? void 0 : i.type) === "play" && S(g.enabled) && pt(i.payload);
  });
}
function He(t, e = {}) {
  var n, c;
  const i = (n = game.users) == null ? void 0 : n.get(t), o = e.actorId ? (c = game.actors) == null ? void 0 : c.get(e.actorId) : (i == null ? void 0 : i.character) ?? null, a = e.triggerKind === "failure" ? "failure" : "success", r = Et(i, o, a);
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
    overlayText: e.overlayText ?? r.overlayText ?? S(g.defaultText),
    accentColor: e.accentColor ?? r.accentColor ?? "#69e8ff",
    textEnabled: e.textEnabled ?? S(g.textEnabled),
    duration: e.duration ?? r.duration,
    volume: e.volume ?? S(g.volume),
    audience: e.audience ?? S(g.audience)
  };
}
function si(t, e = {}) {
  var a, r;
  const i = (a = game.actors) == null ? void 0 : a.get(t), o = ((r = game.users) == null ? void 0 : r.find((n) => !n.isGM && Re(i, n.id))) ?? game.user;
  return He(o == null ? void 0 : o.id, { ...e, actorId: t });
}
function be(t) {
  var e;
  (e = game.socket) == null || e.emit(Ft, { type: "play", payload: t }), pt(t);
}
function ze() {
  var t, e, i;
  return ((e = (t = globalThis.foundry) == null ? void 0 : t.applications) == null ? void 0 : e.api) ?? ((i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) ?? null;
}
function _e() {
  var t, e, i;
  return ((e = (t = globalThis.foundry) == null ? void 0 : t.appv1) == null ? void 0 : e.api) ?? ((i = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : i.api) ?? null;
}
function li(t = {}, e = {}) {
  var o, a, r;
  const i = ((a = (o = globalThis.foundry) == null ? void 0 : o.utils) == null ? void 0 : a.mergeObject) ?? ((r = foundry == null ? void 0 : foundry.utils) == null ? void 0 : r.mergeObject);
  return typeof i == "function" ? i(t, e, { inplace: !1 }) : { ...t, ...e };
}
function di() {
  var t, e, i, o, a;
  return ((i = (e = (t = globalThis.foundry) == null ? void 0 : t.utils) == null ? void 0 : e.randomID) == null ? void 0 : i.call(e, 8)) ?? ((a = (o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.randomID) == null ? void 0 : a.call(o, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function we(t = {}) {
  return {
    id: String(t.id ?? `legacy-application-${di()}`),
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
    constructor(o = {}) {
      const a = li(new.target.defaultOptions ?? {}, o);
      super(we(a));
      gt(this, "_v1Options");
      this._v1Options = a;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return we(this.defaultOptions ?? {});
    }
    activateListeners(o) {
    }
    async _renderHTML(o, a) {
      var s, u, h;
      const r = typeof this.getData == "function" ? await this.getData() : {}, n = ((s = this._v1Options) == null ? void 0 : s.template) ?? ((u = this.options) == null ? void 0 : u.template) ?? ((h = this.constructor.defaultOptions) == null ? void 0 : h.template);
      if (!n) return document.createDocumentFragment();
      const c = await globalThis.renderTemplate(n, r), l = document.createElement("template");
      return l.innerHTML = c.trim(), l.content;
    }
    _activateV1Form(o) {
      var r, n;
      if (typeof this._updateObject != "function") return;
      const a = (r = o.matches) != null && r.call(o, "form") ? o : (n = o.querySelector) == null ? void 0 : n.call(o, "form");
      a instanceof HTMLFormElement && a.addEventListener("submit", async (c) => {
        var s;
        c.preventDefault(), c.stopPropagation();
        const l = new FormData(a);
        await this._updateObject(c, l), ((s = this._v1Options) == null ? void 0 : s.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(o, a, r) {
      var u, h, d, m;
      a.replaceChildren(o);
      const n = globalThis.jQuery ?? globalThis.$, c = ((u = a.closest) == null ? void 0 : u.call(a, ".window-app, .app, .application")) ?? a, l = n ? n(c) : c;
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
      const s = (h = this._v1Options) == null ? void 0 : h.classes;
      Array.isArray(s) && s.length && (a.classList.add(...s), (m = (d = a.closest) == null ? void 0 : d.call(a, ".window-app, .app, .application")) == null || m.classList.add(...s)), this._activateV1Form(a), typeof this.activateListeners == "function" && this.activateListeners(n ? n(a) : a);
    }
  };
}
function fi() {
  const t = ze(), e = _e(), i = globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication);
  if (i) return i;
  const o = t == null ? void 0 : t.ApplicationV2;
  return o ? Ge(o) : null;
}
function hi() {
  const t = ze(), e = _e(), i = globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1);
  if (i) return i;
  const o = t == null ? void 0 : t.ApplicationV2;
  return o ? Ge(o) : fi();
}
const Tt = "icons/svg/mystery-man.svg", pi = hi();
async function mi(t, e, i) {
  var l, s, u, h;
  const { success: o, failure: a } = Kt(t, e), r = `<p>Change to <strong>d${t}</strong> with <strong>${e === "low" ? "low" : "high"} rolls positive</strong>?</p>
    <p>This resets the roll configuration for all ${i} listed character and GM entries, for both outcomes, and the global thresholds:</p>
    <ul><li>Success: <strong>${o}</strong></li><li>Failure: <strong>${a}</strong></li></ul>
    <p>Images, audio, animation, labels, colors, and enabled states stay unchanged. Click Save afterward to apply these changes.</p>`, n = (s = (l = foundry == null ? void 0 : foundry.applications) == null ? void 0 : l.api) == null ? void 0 : s.DialogV2;
  if (n != null && n.confirm)
    return await n.confirm({
      window: { title: "Reset Critical Cut-In Roll Configuration?" },
      content: r,
      modal: !0,
      rejectClose: !1,
      yes: { label: "Change and Reset Rolls" },
      no: { label: "Cancel", default: !0 }
    }) === !0;
  const c = globalThis.Dialog ?? ((h = (u = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : u.api) == null ? void 0 : h.Dialog);
  if (!(c != null && c.confirm)) throw new Error("Foundry confirmation dialog is unavailable.");
  return await c.confirm({ title: "Reset Critical Cut-In Roll Configuration?", content: r, defaultYes: !1, rejectClose: !1 }) === !0;
}
function Be(t, e) {
  return `${t}:${e}`;
}
function gi() {
  return Be("gm", "default");
}
function Xe(t, e) {
  var o, a, r, n;
  const i = ((a = (o = globalThis.CONST) == null ? void 0 : o.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3;
  return Number(((r = e == null ? void 0 : e.ownership) == null ? void 0 : r[t.id]) ?? ((n = e == null ? void 0 : e.ownership) == null ? void 0 : n.default) ?? 0) >= i;
}
function Se(t = {}, { defaultAccent: e = "#69e8ff" } = {}) {
  const i = Number(t.threshold), o = zt(t.animationStyle);
  return {
    enabled: t.enabled !== !1,
    threshold: Number.isInteger(i) && i >= 1 && i <= at() ? i : "",
    duration: xt(t.duration),
    animationStyle: o,
    effectDescription: ne(o).description,
    animationStyles: Ht.map((a) => ({ value: a.id, label: a.label, description: a.description, selected: o === a.id })),
    imagePath: String(t.imagePath ?? ""),
    audioPath: String(t.audioPath ?? ""),
    overlayText: String(t.overlayText ?? ""),
    accentColor: String(t.accentColor ?? (o === mt ? oe : e))
  };
}
function yi(t = {}) {
  return {
    success: Se(t, { defaultAccent: "#69e8ff" }),
    failure: Se(t.failure, { defaultAccent: "#ff4d7d" })
  };
}
function vi() {
  var i, o, a;
  const t = ((i = game.users) == null ? void 0 : i.find((r) => r.isGM && r.active)) ?? ((o = game.users) == null ? void 0 : o.find((r) => r.isGM)) ?? game.user, e = [{
    key: gi(),
    type: "gm",
    typeLabel: "GM",
    id: "default",
    name: "GM Cut-In",
    portrait: (t == null ? void 0 : t.avatar) || "icons/svg/mystery-man.svg"
  }];
  for (const r of game.actors ?? [])
    (a = game.users) != null && a.some((n) => !n.isGM && Xe(n, r)) && e.push({
      key: Be("actor", r.id),
      type: "actor",
      typeLabel: "Actor",
      id: r.id,
      name: r.name,
      portrait: r.img || "icons/svg/mystery-man.svg"
    });
  return e.sort((r, n) => r.type === "gm" ? -1 : n.type === "gm" ? 1 : r.name.localeCompare(n.name));
}
class Ve extends pi {
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
      title: `${Me} Configuration`,
      template: Je,
      classes: ["hcci-config-window"],
      width: 1320,
      height: 760,
      resizable: !0,
      closeOnSubmit: !1,
      submitOnChange: !1
    });
  }
  async getData() {
    const i = Ut(), o = vi(), a = [
      { id: "gm", name: "GM", avatar: o[0].portrait, targets: [o[0]] },
      ...Array.from(game.users ?? []).filter((n) => !n.isGM).map((n) => ({
        id: n.id,
        name: n.name,
        avatar: n.avatar || Tt,
        targets: o.filter((c) => c.type === "actor" && Xe(n, game.actors.get(c.id)))
      }))
    ], r = o.map((n) => {
      const c = yi(i[n.key]);
      return {
        ...n,
        ...c,
        actorId: n.type === "actor" ? n.id : "",
        outcomes: [
          { ...c.success, kind: "success", defaultText: S(g.defaultText) },
          { ...c.failure, kind: "failure", defaultText: S(g.defaultFailureText) }
        ]
      };
    });
    return {
      players: a.map((n) => ({
        ...n,
        characterHeading: n.id === "gm" ? "GM Configuration" : `${n.name}’s Characters`,
        tabDetail: n.id === "gm" ? "Global" : `${n.targets.length} ${n.targets.length === 1 ? "character" : "characters"}`
      })),
      animationStyles: Ht,
      dieSides: at(),
      dice: Ce(at()),
      lowRollsGood: qt(),
      threshold: S(g.threshold) ?? 0,
      failureThreshold: S(g.failureThreshold) ?? 0,
      duration: S(g.duration),
      rows: r
    };
  }
  activateListeners(i) {
    super.activateListeners(i);
    const o = i instanceof HTMLElement ? i : i[0], a = o.matches(".hcci-config") ? o : o.querySelector(".hcci-config"), r = (f) => a.querySelector(f), n = (f) => Array.from(a.querySelectorAll(f));
    r("[data-hcci-action='close']").addEventListener("click", () => this.close()), this.activateWindowDrag(r("[data-hcci-window-drag]"), a.closest(".window-app, .application"));
    const c = n("[data-hcci-player]"), l = n("[data-hcci-characters]"), s = n("[data-hcci-character]"), u = n("[data-hcci-tab]"), h = n("[data-hcci-row]"), d = n("[data-hcci-panel]"), m = r("[data-hcci-workspace]"), p = r("[data-hcci-art]"), v = n("[data-hcci-style]");
    let b, w, E = "success", L = "", k = "";
    const y = (f) => w == null ? void 0 : w.querySelector(`[data-hcci-field="${f}"]`), O = () => {
      if (!b || !w) return;
      const f = y("imagePath").value.trim(), T = b.dataset.hcciPortrait || Tt;
      (f !== L || T !== k) && (L = f, k = T, p.src = f || T), p.parentElement.style.setProperty("--hcci-preview-accent", y("accentColor").value), r("[data-hcci-caption]").textContent = y("overlayText").value.trim() || y("overlayText").placeholder;
      const $ = ne(y("animationStyle").value);
      r("[data-hcci-effect-description]").textContent = $.description, v.forEach((P) => P.setAttribute("aria-pressed", String(P.dataset.hcciStyle === $.id)));
    };
    p.addEventListener("error", () => {
      const f = p.getAttribute("src");
      f !== k && f !== Tt ? p.src = k : f !== Tt && (p.src = Tt);
    });
    const R = (f, T) => {
      f.setAttribute("aria-selected", String(T)), f.tabIndex = T ? 0 : -1;
    }, F = (f, T = this.selectedCharacters.get(f), $) => {
      this.selectedPlayer = f;
      const P = l.find((x) => x.dataset.hcciCharacters === f), N = s.filter((x) => P == null ? void 0 : P.contains(x)), q = N.find((x) => x.dataset.hcciCharacter === T) ?? N[0], H = q == null ? void 0 : q.dataset.hcciCharacter;
      E = $ ?? this.activeTabs.get(H) ?? "success", H && (this.selectedCharacters.set(f, H), this.activeTabs.set(H, E)), b = h.find((x) => x.dataset.hcciRow === H), w = b == null ? void 0 : b.querySelector(`[data-hcci-panel="${E}"]`), c.forEach((x) => R(x, x.dataset.hcciPlayer === f)), l.forEach((x) => {
        x.hidden = x !== P;
      }), s.forEach((x) => x.setAttribute("aria-pressed", String(x === q))), u.forEach((x) => R(x, x.dataset.hcciTab === E)), h.forEach((x) => {
        x.hidden = x !== b;
      }), d.forEach((x) => {
        x.hidden = x !== w;
      }), r("#hcci-settings-panel").setAttribute("aria-labelledby", `hcci-${E}-tab`), m.hidden = !b, m.dataset.hcciKind = E, r("[data-hcci-preview-kind]").textContent = E === "failure" ? "Critical Failure" : "Critical Success", O();
    };
    c.forEach((f) => f.addEventListener("click", () => F(f.dataset.hcciPlayer))), s.forEach((f) => f.addEventListener("click", () => F(this.selectedPlayer, f.dataset.hcciCharacter))), u.forEach((f) => f.addEventListener("click", () => F(this.selectedPlayer, void 0, f.dataset.hcciTab)));
    for (const f of [c, u]) for (const [T, $] of f.entries())
      $.addEventListener("keydown", (P) => {
        const N = {
          Home: 0,
          End: f.length - 1,
          ArrowLeft: (T - 1 + f.length) % f.length,
          ArrowRight: (T + 1) % f.length
        }[P.key];
        N !== void 0 && (P.preventDefault(), f[N].focus(), f[N].click());
      });
    v.forEach((f) => f.addEventListener("click", () => {
      const T = y("animationStyle");
      T.value = f.dataset.hcciStyle, T.dispatchEvent(new Event("change", { bubbles: !0 }));
    })), F(c.some((f) => f.dataset.hcciPlayer === this.selectedPlayer) ? this.selectedPlayer : "gm");
    let Z = !1;
    a.addEventListener("invalid", (f) => {
      var x, lt, _t;
      if (Z) return;
      Z = !0, queueMicrotask(() => {
        Z = !1;
      });
      const T = f.target, $ = T.closest("details");
      $ && ($.open = !0);
      const P = (x = T.closest("[data-hcci-row]")) == null ? void 0 : x.dataset.hcciRow;
      if (!P) return;
      const N = s.filter((Gt) => Gt.dataset.hcciCharacter === P), q = N.find((Gt) => {
        var ce;
        return ((ce = Gt.closest("[data-hcci-characters]")) == null ? void 0 : ce.dataset.hcciCharacters) === this.selectedPlayer;
      }) ?? N[0], H = (lt = q == null ? void 0 : q.closest("[data-hcci-characters]")) == null ? void 0 : lt.dataset.hcciCharacters;
      H && F(H, P, (_t = T.closest("[data-hcci-panel]")) == null ? void 0 : _t.dataset.hcciPanel);
    }, !0);
    const ot = () => {
      r("[data-hcci-dirty]").hidden = !1;
    }, U = r('[name="dieSides"]'), W = r('[name="rollDirection"]'), it = r('[name="threshold"]'), Q = r('[name="failureThreshold"]'), X = n('[data-hcci-field="threshold"]'), rt = () => {
      const f = Number(U.value), T = W.value === "low";
      if (n("[data-hcci-success-label]").forEach((N) => {
        N.textContent = T ? "Success ≤" : "Success ≥";
      }), n("[data-hcci-failure-label]").forEach((N) => {
        N.textContent = T ? "Failure ≥" : "Failure ≤";
      }), !Number.isInteger(f) || f < 2 || f > 1e4) return;
      const $ = Number(it.value) || (T ? 1 : f), P = Number(Q.value) || (T ? f : 1);
      for (const N of [it, Q, ...X]) N.max = String(f);
      for (const N of X)
        N.placeholder = String(N.closest('[data-hcci-panel="success"]') ? $ : P);
    };
    rt();
    let Y = Number(U.value), _ = W.value;
    const V = () => {
      if (this.rollRuleChange) return;
      const f = Number(U.value), T = W.value;
      if (f === Y && T === _) return;
      const $ = [U, W, r('[type="submit"]')];
      $.forEach((P) => {
        P.disabled = !0;
      }), this.rollRuleChange = (async () => {
        var P, N;
        try {
          if (!await mi(f, T, h.length)) return;
          const { success: q, failure: H } = Kt(f, T);
          it.value = String(q), Q.value = String(H);
          for (const x of X)
            x.value = String(x.closest('[data-hcci-panel="success"]') ? q : H);
          Y = f, _ = T, ot();
        } catch (q) {
          console.error(`${C} | Could not confirm dice change.`, q), (N = (P = ui.notifications) == null ? void 0 : P.error) == null || N.call(P, "Could not confirm the dice change. Your roll configuration has not changed.");
        } finally {
          U.value = String(Y), W.value = _, rt(), $.forEach((q) => {
            q.disabled = !1;
          }), this.rollRuleChange = null;
        }
      })();
    };
    U.addEventListener("change", V), W.addEventListener("change", V);
    for (const f of ["input", "change"]) a.addEventListener(f, (T) => {
      const $ = T.target;
      !$.matches("input, select") || $ === U || $ === W || (ot(), ($ === it || $ === Q) && rt(), w != null && w.contains($) && O());
    });
    for (const f of n("[data-hcci-browse]")) f.addEventListener("click", () => {
      var q, H, x;
      const T = f.dataset.hcciBrowse, $ = y(T);
      if (!$) return;
      const P = ((x = (H = (q = foundry == null ? void 0 : foundry.applications) == null ? void 0 : q.apps) == null ? void 0 : H.FilePicker) == null ? void 0 : x.implementation) ?? globalThis.FilePicker;
      new P({
        type: T === "audioPath" ? "audio" : "image",
        current: $.value,
        callback: (lt) => {
          $.value = lt, $.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).browse();
    });
    const G = r("[data-hcci-test]");
    G.addEventListener("click", async () => {
      var N, q, H, x, lt;
      if (!((N = game.user) != null && N.isGM) || !b || !w || G.getAttribute("aria-disabled") === "true") return;
      const f = Kt(Y, _), T = E === "failure" ? "failure" : "success", $ = T === "failure" ? Q.value : it.value, P = y("animationStyle").value;
      G.setAttribute("aria-disabled", "true");
      try {
        await Ka({
          actorId: b.dataset.hcciActorId || null,
          actorName: b.dataset.hcciActorId ? b.dataset.hcciName : "",
          triggerKind: T,
          naturalResult: f[T],
          threshold: Number((q = y("threshold")) == null ? void 0 : q.value) || Number($) || f[T],
          animationStyle: P,
          imagePath: y("imagePath").value.trim() || k,
          fallbackImagePath: k,
          audioPath: y("audioPath").value.trim(),
          overlayText: y("overlayText").value.trim() || y("overlayText").placeholder,
          accentColor: y("accentColor").value,
          textEnabled: !["rift", mt, Lt, $t, Pt].includes(P) || S(g.textEnabled) !== !1,
          duration: xt((H = y("duration")) == null ? void 0 : H.value) ?? xt(r('[name="duration"]').value) ?? S(g.duration),
          volume: S(g.volume)
        }) || (lt = (x = ui.notifications) == null ? void 0 : x.info) == null || lt.call(x, "A cut-in is already playing.");
      } finally {
        G.removeAttribute("aria-disabled");
      }
    }), r("[data-hcci-action='reset']").addEventListener("click", async () => {
      var $, P, N;
      const f = (P = ($ = foundry == null ? void 0 : foundry.applications) == null ? void 0 : $.api) == null ? void 0 : P.DialogV2;
      (f != null && f.confirm ? await f.confirm({
        window: { title: "Reset All Character Cut-Ins?" },
        content: "<p>This removes every GM and actor override. Global roll and presentation settings stay unchanged.</p>",
        modal: !0,
        rejectClose: !1,
        yes: { label: "Reset Overrides" },
        no: { label: "Cancel", default: !0 }
      }) === !0 : globalThis.confirm("Reset every GM and actor cut-in override?")) && (await se({}), (N = ui.notifications) == null || N.info("Critical Cut-In player configuration reset."), this.render(!1));
    });
  }
  activateWindowDrag(i, o) {
    if (!o) return;
    let a = null;
    i.addEventListener("pointerdown", (r) => {
      var c;
      if (r.button !== 0 || a) return;
      const n = o.getBoundingClientRect();
      (c = this.bringToFront ?? this.bringToTop) == null || c.call(this), i.setPointerCapture(r.pointerId), a = {
        pointerId: r.pointerId,
        offsetX: r.clientX - n.left,
        offsetY: r.clientY - n.top
      }, r.preventDefault();
    }), i.addEventListener("pointermove", (r) => {
      !a || r.pointerId !== a.pointerId || this.setPosition({
        left: Math.max(0, Math.min(window.innerWidth - 48, r.clientX - a.offsetX)),
        top: Math.max(0, Math.min(window.innerHeight - 48, r.clientY - a.offsetY))
      });
    }), i.addEventListener("lostpointercapture", (r) => {
      r.pointerId === (a == null ? void 0 : a.pointerId) && (a = null);
    });
  }
  async _updateObject(i) {
    var h, d, m, p, v, b, w;
    if (!((h = game.user) != null && h.isGM) || this.rollRuleChange) return;
    const o = i.currentTarget;
    if (!o.reportValidity()) return;
    const a = Number(((d = o.querySelector('[name="dieSides"]')) == null ? void 0 : d.value) ?? at()), r = ((m = o.querySelector('[name="rollDirection"]')) == null ? void 0 : m.value) === "low" ? "low" : "high", n = Ut(), c = (E, L) => {
      var R, F, Z, ot, U, W, it, Q, X, rt;
      const k = E.querySelector(`[data-hcci-panel="${L}"]`), y = (Y) => k == null ? void 0 : k.querySelector(`[data-hcci-field="${Y}"]`), O = xt((R = y("duration")) == null ? void 0 : R.value);
      return {
        ...O === void 0 ? {} : { duration: O },
        enabled: ((F = k == null ? void 0 : k.querySelector('[data-hcci-field="enabled"]')) == null ? void 0 : F.checked) === !0,
        threshold: (() => {
          var _;
          const Y = Number((_ = y("threshold")) == null ? void 0 : _.value);
          return Number.isInteger(Y) && Y >= 1 && Y <= a ? Y : "";
        })(),
        animationStyle: ((Z = y("animationStyle")) == null ? void 0 : Z.value) || "strike",
        imagePath: ((U = (ot = y("imagePath")) == null ? void 0 : ot.value) == null ? void 0 : U.trim()) ?? "",
        audioPath: ((it = (W = y("audioPath")) == null ? void 0 : W.value) == null ? void 0 : it.trim()) ?? "",
        overlayText: ((X = (Q = y("overlayText")) == null ? void 0 : Q.value) == null ? void 0 : X.trim()) ?? "",
        accentColor: ((rt = y("accentColor")) == null ? void 0 : rt.value) || (L === "failure" ? "#ff4d7d" : "#69e8ff")
      };
    };
    for (const E of o.querySelectorAll("[data-hcci-row]")) {
      const L = E.dataset.hcciRow;
      n[L] = c(E, "success"), n[L].failure = c(E, "failure");
    }
    const l = Number(((p = o.querySelector('[name="threshold"]')) == null ? void 0 : p.value) ?? ae()), s = Number(((v = o.querySelector('[name="failureThreshold"]')) == null ? void 0 : v.value) ?? Te()), u = Number(((b = o.querySelector('[name="duration"]')) == null ? void 0 : b.value) ?? S(g.duration));
    await tt(g.dieSides, a), await tt(g.rollDirection, r), await tt(g.threshold, Math.min(a, Math.max(0, l))), await tt(g.failureThreshold, Math.min(a, Math.max(0, s))), await tt(g.duration, Math.min(8e3, Math.max(800, u))), await se(n), (w = ui.notifications) == null || w.info("Critical Cut-In configuration saved."), this.render(!1);
  }
}
function je() {
  var t, e;
  return (t = game.user) != null && t.isGM ? new Ve().render(!0) : ((e = ui.notifications) == null || e.warn("Only the GM can configure Critical Cut-In."), null);
}
function bi() {
  var i, o, a, r;
  const t = (i = game.modules.get("holosuite")) != null && i.active ? (o = game.modules.get("holosuite")) == null ? void 0 : o.api : null, e = (a = game.modules.get("holosuite-core")) != null && a.active ? (r = game.modules.get("holosuite-core")) == null ? void 0 : r.api : null;
  return t ?? e ?? game.holosuite ?? null;
}
function Ye() {
  var e;
  const t = bi();
  return t != null && t.registerApp ? (t.registerApp({
    brandingInApp: !0,
    id: C,
    title: "Critical Cut-In",
    icon: "fa-solid fa-bolt-lightning",
    premium: !1,
    playerVisible: !1,
    description: "JRPG-style critical hit cut-in animation for natural d20 results.",
    enabled: S(g.enabled),
    open: () => je()
  }), t.registerApp({
    brandingInApp: !0,
    id: `${C}-box-of-doom`,
    title: "Box of Doom",
    icon: "fa-solid fa-box",
    premium: !1,
    playerVisible: !1,
    description: "Reveal a high-stakes roll to the whole table.",
    enabled: S(g.enabled),
    open: () => $e()
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
      return (r = game.user) != null && r.isGM ? be(a) : pt(a), a;
    },
    playCutinForActor(i, o = {}) {
      var r;
      const a = si(i, o);
      return (r = game.user) != null && r.isGM ? be(a) : pt(a), a;
    },
    openConfig: je,
    openBoxOfDoom: $e
  }, e = game.modules.get(C);
  return e && (e.api = t), game.holosuiteCriticalCutin = t, t;
}
Hooks.once("init", async () => {
  ta(Ve), ca(), Ke(), await loadTemplates([`modules/${C}/templates/player-config.hbs`]);
});
Hooks.once("ready", () => {
  Ke(), ci(), ct(), Hooks.on("userConnected", ct), Ye(), console.log(`${C} | Ready. API available at game.modules.get("${C}").api`);
});
Hooks.on("hotReload", () => {
  Ye();
});
console.log(`${Me} | Loading.`);
