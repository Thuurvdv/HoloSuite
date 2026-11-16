var Ue = Object.defineProperty;
var We = (t, e, i) => e in t ? Ue(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i;
var gt = (t, e, i) => We(t, typeof e != "symbol" ? e + "" : e, i);
const Qe = [4, 6, 8, 10, 12, 20, 100];
function Ce(t = 20) {
  var a, o, n;
  const e = ae(t), i = /* @__PURE__ */ new Set([...Qe, e]), r = ((n = (o = (a = globalThis.CONFIG) == null ? void 0 : a.Dice) == null ? void 0 : o.fulfillment) == null ? void 0 : n.dice) ?? {};
  for (const c of Object.keys(r)) {
    const l = /^d([1-9]\d*)$/i.exec(c);
    if (!l) continue;
    const s = Number(l[1]);
    s >= 2 && s <= 1e4 && i.add(s);
  }
  return [...i].sort((c, l) => c - l).map((c) => ({ value: c, label: `d${c}`, selected: c === e }));
}
function Ut(t, e) {
  const i = ae(t), r = ke(e) === "low";
  return { success: r ? 1 : i, failure: r ? i : 1 };
}
function ae(t) {
  const e = Number(t);
  return Number.isInteger(e) && e >= 2 && e <= 1e4 ? e : 20;
}
function ke(t) {
  return t === "low" ? "low" : "high";
}
const C = "holosuite-critical-cutin", Me = "HoloSuite Critical Cut-In", qt = `module.${C}`, Je = `modules/${C}/templates/player-config.hbs`, m = {
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
function ta(t) {
  game.settings.register(C, m.effectIntensity, {
    name: "Local Effect Detail",
    hint: "Choose the density of decorative particles and the strength of glow on this device.",
    scope: "client",
    config: !0,
    type: String,
    default: "standard",
    choices: { low: "Low", standard: "Standard", high: "High" }
  }), game.settings.register(C, m.shakeIntensity, {
    name: "Local Impact Shake",
    hint: "Shake the cut-in at impact. Reduced and still motion always disable shake.",
    scope: "client",
    config: !0,
    type: Number,
    default: 0.5,
    range: { min: 0, max: 1, step: 0.1 }
  }), game.settings.register(C, m.enabled, {
    name: "Enable Critical Cut-In",
    hint: "Play a configured cut-in when a qualifying natural result is rolled on the selected die.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(C, m.dieSides, {
    name: "Check Die",
    hint: "Configured in Configure Player Cut-Ins, where changes confirm the reset of all listed roll thresholds.",
    scope: "world",
    config: !1,
    type: Number,
    default: 20
  }), game.settings.register(C, m.rollDirection, {
    name: "Positive Rolls",
    hint: "Configured in Configure Player Cut-Ins, together with the check die and roll thresholds.",
    scope: "world",
    config: !1,
    type: String,
    default: "high",
    choices: { high: "High rolls are positive", low: "Low rolls are positive" }
  }), game.settings.register(C, m.threshold, {
    name: "Default Trigger Threshold",
    hint: "0 automatically uses the best die face. Otherwise success triggers at or above this value for high rolls, or at or below it for low rolls.",
    scope: "world",
    config: !0,
    type: Number,
    default: 0
  }), game.settings.register(C, m.failureThreshold, {
    name: "Default Failure Trigger",
    hint: "0 automatically uses the worst die face. Otherwise failure triggers at or below this value for high rolls, or at or above it for low rolls.",
    scope: "world",
    config: !0,
    type: Number,
    default: 0
  }), game.settings.register(C, m.duration, {
    name: "Animation Duration",
    hint: "How long the cut-in remains visible, in milliseconds.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 800, max: 8e3, step: 100 },
    default: 2500
  }), game.settings.register(C, m.volume, {
    name: "Cut-In Audio Volume",
    hint: "Volume multiplier for configured cut-in audio samples.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 0.8
  }), game.settings.register(C, m.audience, {
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
  }), game.settings.register(C, m.animationFont, {
    name: "Animation Font",
    hint: "Typeface for the cut-in label and actor name.",
    scope: "world",
    config: !0,
    type: String,
    default: "aicon",
    choices: { aicon: "AICON", classic: "Classic (Orbitron / system fallback)" }
  }), game.settings.register(C, m.textEnabled, {
    name: "Enable Text Overlay",
    hint: "Show the configured label during the cut-in.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(C, m.defaultText, {
    name: "Default Overlay Text",
    hint: "Fallback label used when no player-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL"
  }), game.settings.register(C, m.defaultFailureText, {
    name: "Default Failure Overlay Text",
    hint: "Fallback label used when no failure-specific label is configured.",
    scope: "world",
    config: !0,
    type: String,
    default: "CRITICAL FAILURE"
  }), game.settings.register(C, m.motionMode, {
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
  }), game.settings.register(C, m.flashMode, {
    name: "Local Flash Intensity",
    hint: "Reduce or disable the bright opening flash on this device.",
    scope: "client",
    config: !0,
    type: String,
    choices: { full: "Full", soft: "Soft", off: "Off" },
    default: "soft"
  }), game.settings.register(C, m.localVolume, {
    name: "Local Cut-In Volume",
    hint: "Personal volume multiplier applied after the GM's cut-in volume setting.",
    scope: "client",
    config: !0,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 1
  }), game.settings.register(C, m.suppressCutins, {
    name: "Hide Cut-Ins On This Device",
    hint: "Do not show or play critical cut-ins for this client.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(C, m.debug, {
    name: "Debug Logging",
    hint: "Log roll detection and playback decisions to the console.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(C, m.playerConfigs, {
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
function ie() {
  return xe(S(m.threshold), "success");
}
function Te() {
  return xe(S(m.failureThreshold), "failure");
}
function tt() {
  return ae(S(m.dieSides));
}
function Ht() {
  return ke(S(m.rollDirection)) === "low";
}
function xe(t, e) {
  const i = Number(t);
  return Number.isInteger(i) && i >= 1 && i <= tt() ? i : e === "success" === Ht() ? 1 : tt();
}
function Ae(t, e, i) {
  return i === "success" === Ht() ? t <= e : t >= e;
}
function Wt() {
  const t = S(m.playerConfigs);
  return foundry.utils.deepClone(t && typeof t == "object" ? t : {});
}
async function se(t) {
  return Q(m.playerConfigs, t && typeof t == "object" ? t : {});
}
function kt(...t) {
  S(m.debug) && console.log(`${C} |`, ...t);
}
const re = "boxOfDoom", ht = "boxOfDoomState", ea = 850, aa = 5200, ia = 500;
let J = !1, Xt = !1, ot, Vt;
function ra() {
  var e;
  return (e = Array.from(game.users ?? []).filter((i) => i.isGM && i.active).sort((i, r) => i.id.localeCompare(r.id))[0]) == null ? void 0 : e.id;
}
function bt() {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) && (ra() ?? game.user.id) === game.user.id;
}
function pt() {
  const t = S(ht);
  return t != null && t.id && (t.phase !== "revealed" || t.expires > Date.now()) ? t : void 0;
}
function Ee(t) {
  return t.target === null ? "" : `Target ${t.low ? "≤" : "≥"} ${t.target}`;
}
function Qt(t) {
  return t.target === null ? "" : (t.low ? t.total <= t.target : t.total >= t.target) ? "Success" : "Failure";
}
function oa(t) {
  const e = document.createElement("span");
  return e.textContent = t, e.innerHTML;
}
function nt() {
  var u;
  clearTimeout(Vt);
  const t = pt(), e = ((u = game.user) == null ? void 0 : u.isGM) === !0, i = bt(), r = !e && S(m.suppressCutins) === !0;
  if (!t || r) {
    ot == null || ot.remove(), ot = void 0;
    return;
  }
  const a = `${t.id}:${t.phase}:${i}:${J}`;
  if ((ot == null ? void 0 : ot.dataset.state) === a) {
    t.phase === "revealed" && (Vt = setTimeout(nt, Math.max(1, t.expires - Date.now())));
    return;
  }
  const o = ot, n = i && (!o || o.contains(document.activeElement));
  o == null || o.remove();
  const c = document.createElement("section");
  c.className = "hcci-doom", c.dataset.holosuiteBranding = `${C}-box-of-doom`, c.dataset.state = a, c.dataset.phase = t.phase, c.dataset.animate = String((o == null ? void 0 : o.dataset.boxId) !== t.id || o.dataset.phase !== t.phase), c.dataset.boxId = t.id, c.dataset.control = String(i), c.dataset.motion = String(S(m.motionMode) ?? "system"), t.phase === "revealed" && (c.dataset.outcome = Qt(t).toLowerCase()), c.setAttribute("aria-label", "Box of Doom"), c.innerHTML = `
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
    const f = l.appendChild(document.createElement("strong"));
    f.textContent = String(t.total);
    const d = l.appendChild(document.createElement("span"));
    d.textContent = Qt(t) || "Result", Vt = setTimeout(nt, Math.max(1, t.expires - Date.now()));
  } else
    l.textContent = t.phase === "sealed" ? "Sealed" : "Opening…";
  const s = (f, d) => {
    const g = c.querySelector(".hcci-doom-controls").appendChild(document.createElement("button"));
    g.type = "button", g.textContent = f, g.addEventListener("click", () => void d().catch(Le));
  };
  i && !J && t.phase === "sealed" && s("Roll & Reveal", () => na(t.id)), i && !J && t.phase !== "revealed" && s("Cancel", () => le(t.id)), i && !J && t.phase === "revealed" && s("Close", () => le(t.id)), ot = c, document.body.append(c), Hooks.callAll("holosuite-core.renderBranding", c), n && (c.tabIndex = -1, (c.querySelector("button") ?? c).focus({ preventScroll: !0 }));
}
function Le(t) {
  var e;
  console.error(`${C} | Box of Doom`, t), (e = ui.notifications) == null || e.error("Box of Doom could not complete the action. Check the chat and try again.");
}
async function le(t) {
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
const ue = (t) => new Promise((e) => setTimeout(e, t));
async function na(t) {
  var i, r;
  const e = pt();
  if (!(!bt() || J || (e == null ? void 0 : e.id) !== t || e.phase !== "sealed")) {
    J = !0, nt();
    try {
      const a = ((i = foundry.dice) == null ? void 0 : i.Roll) ?? globalThis.Roll;
      await Q(ht, { ...e, phase: "opening" });
      const o = await new a(`1d${e.sides}`).evaluate({ allowInteractive: !1 }), n = Number(o.total);
      if (!Number.isInteger(n) || n < 1 || n > e.sides) throw new Error("Unexpected die result.");
      await ue(ea);
      const c = pt();
      if ((c == null ? void 0 : c.id) !== t || c.phase !== "opening") return;
      const l = { ...e, phase: "revealed", total: n, expires: Date.now() + aa };
      await Q(ht, l), await ue(ia);
      const s = ((r = foundry.documents) == null ? void 0 : r.ChatMessage) ?? globalThis.ChatMessage, u = [`d${e.sides}: ${n}`, Ee(e), Qt(l)].filter(Boolean).join(" · ");
      await s.create({
        speaker: s.getSpeaker(),
        content: `<h3>Box of Doom</h3>${e.stakes ? `<p>${oa(e.stakes)}</p>` : ""}<p><strong>${u}</strong></p>`,
        whisper: [],
        blind: !1,
        flags: { [C]: { [re]: t } }
      });
    } catch (a) {
      const o = pt();
      throw bt() && (o == null ? void 0 : o.phase) === "opening" && o.id === t && await Q(ht, e), a;
    } finally {
      J = !1, nt();
    }
  }
}
async function $e() {
  var t, e, i;
  if (!bt()) {
    (t = game.user) != null && t.isGM && ((e = ui.notifications) == null || e.warn("The active GM controls Box of Doom."));
    return;
  }
  if (!(J || Xt || pt())) {
    Xt = !0;
    try {
      const r = foundry.applications.api.DialogV2, a = Ce(tt()), o = Ht(), n = await r.prompt({
        window: { title: "Box of Doom" },
        modal: !0,
        rejectClose: !1,
        content: `<div class="hcci-doom-form" data-holosuite-branding="${C}-box-of-doom">
        <label>What’s at stake?<input name="stakes" type="text" maxlength="180" placeholder="Optional"></label>
        <label>Die<select name="sides">${a.map(({ value: c, label: l, selected: s }) => `<option value="${c}" ${s ? "selected" : ""}>${l}</option>`).join("")}</select></label>
        <label>Success target (${o ? "roll at or below" : "roll at or above"})<input name="target" type="number" min="1" max="10000" step="1" placeholder="Optional"></label>
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
      if (!n || !bt() || pt() || !a.some((c) => c.value === n.sides)) return;
      if (n.target !== null && (!Number.isInteger(n.target) || n.target < 1 || n.target > n.sides)) {
        (i = ui.notifications) == null || i.warn(`Choose a target between 1 and ${n.sides}, or leave it blank.`);
        return;
      }
      await Q(ht, { ...n, id: foundry.utils.randomID(), phase: "sealed", low: o });
    } catch (r) {
      Le(r);
    } finally {
      Xt = !1;
    }
  }
}
function ca() {
  game.settings.register(C, ht, {
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: nt
  });
}
const wt = "shattered-fate", Pe = [53, 48], Rt = [
  [[49, 34], [43, 25], [41, 0]],
  [[64, 39], [69, 23], [100, 0]],
  [[68, 49], [79, 45], [100, 36]],
  [[66, 58], [81, 65], [100, 76]],
  [[61, 64], [66, 81], [78, 100]],
  [[50, 66], [46, 76], [39, 100]],
  [[41, 60], [29, 70], [0, 100]],
  [[34, 52], [22, 56], [0, 52]],
  [[43, 40], [31, 28], [0, 0]]
], de = Rt.flatMap(([t, e, i], r) => {
  const [a, o, n] = Rt[(r + 1) % Rt.length], c = [(t[0] + a[0]) / 2 + (r % 2 ? 1.5 : -2), (t[1] + a[1]) / 2 + (r % 3 - 1) * 2];
  return [
    [Pe, t, c, a],
    [t, e, i, ...r === 3 ? [[100, 100]] : [], n, o, a, c]
  ];
}), Ie = (t) => `polygon(${t.map(([e, i]) => `${e}% ${i}%`).join(",")})`, Jt = (t) => t.map((e) => e.join(",")).join(" "), jt = [
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
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points="${Jt(t)}"/></svg>`;
}
function ua(t) {
  const e = t.querySelector(".hcci-visual"), i = e.querySelector(".hcci-portrait"), r = e.querySelectorAll(".hcci-fate-shard");
  if (r.length) {
    for (const a of r) a.firstElementChild.replaceWith(i.cloneNode(!0));
    return;
  }
  for (const a of de) {
    const o = document.createElement("div");
    o.className = "hcci-fate-shard", o.style.clipPath = Ie(a), o.append(i.cloneNode(!0)), o.insertAdjacentHTML("beforeend", la(a)), e.append(o);
  }
  e.insertAdjacentHTML("beforeend", `<svg class="hcci-fate-cracks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <g class="hcci-fate-branches">${de.filter((a, o) => o % 2 === 0).map((a) => `<polyline points="${Jt(a.slice(1))}"/>`).join("")}</g>
    <g class="hcci-fate-rays">${Rt.map((a) => `<polyline points="${Jt([Pe, ...a])}"/>`).join("")}</g>
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
  const r = Math.min(1, (e - 140) / B.settle), a = (u, f, d, g, p = "linear") => {
    u && i.push(u.animate(f, {
      delay: d * r,
      duration: (g - d) * r,
      easing: p,
      fill: "both"
    }));
  }, o = (u) => t.querySelector(u);
  a(o(".hcci-visual"), [
    { transform: "translate(-3vw, 2vh) scale(1.09)", opacity: 0.42 },
    { transform: "none", opacity: 1 }
  ], 0, B.fracture, Nt), a(o(".hcci-portrait-frame"), [{ visibility: "visible" }, { visibility: "hidden" }], 0, B.shatter, It);
  for (const [u, f] of [[".hcci-fate-rays", 250], [".hcci-fate-branches", 310], [".hcci-fate-spark", 250]])
    a(o(u), [
      { opacity: 0 },
      { opacity: 1, offset: 0.06, easing: It },
      { opacity: 0 }
    ], f, B.shatter);
  for (const [u, f] of Array.from(t.querySelectorAll(".hcci-fate-shard")).entries()) {
    const d = u % 2 === 0, [g, p, v] = fa[Math.floor(u / 2)], b = d ? 40 : 55, w = d ? 33 + u % 3 * 12 : u % 3 * 8;
    a(f, [{ visibility: "hidden" }, { visibility: "visible" }], 0, B.shatter, It);
    const A = B.shatter + w, E = d ? 819 : 756;
    a(f, [
      { transform: "none", opacity: 1, easing: Nt },
      { transform: `perspective(850px) translate3d(${g * b * 0.52}vw,${p * b * 0.47}vh,${d ? 96 : -80}px) rotate(${v * 0.53}deg) rotateY(${g * 32}deg)`, opacity: 1, offset: (E - A) / (B.settle - A) },
      { transform: `perspective(850px) translate3d(${g * b}vw,${p * b}vh,${d ? 190 : -145}px) rotate(${v}deg) rotateY(${g * 62}deg)`, opacity: 0 }
    ], A, B.settle);
  }
  a(o(".hcci-copy"), [
    { opacity: 0, transform: "translate(13vw,3vh) rotate(-13deg) scale(1.3)" },
    { opacity: 1, transform: "translate(-1vw,0) rotate(-8deg) scale(1.035)", offset: 0.35, easing: It },
    { opacity: 1, transform: "translate(-1vw,0) rotate(-8deg) scale(1.035)", offset: 0.51, easing: Nt },
    { opacity: 1, transform: "rotate(-7deg)" }
  ], B.impact, B.settle, Nt);
  const n = o(".hcci-fate-flash"), c = [54, B.fracture, B.impact], l = B.impact + 50, s = c.flatMap((u, f) => [
    { offset: u / l, opacity: 0 },
    {
      offset: (u + 7) / l,
      opacity: `calc(var(--flash-peak, .14) * ${f === 0 ? 0.55 : 1})`,
      backgroundColor: f === 0 ? "var(--hcci-accent)" : "#fff"
    },
    { offset: (u + 50) / l, opacity: 0 }
  ]);
  return a(n, [{ opacity: 0, offset: 0 }, ...s], 0, l), a(o(".hcci-stage"), [
    { transform: "none" },
    { transform: "translateX(var(--hcci-shake))", offset: 0.2 },
    { transform: "translateX(calc(-.45 * var(--hcci-shake)))", offset: 0.51 },
    { transform: "none" }
  ], B.impact, B.impact + 75), { animations: i, audioDelay: B.shatter * r };
}
function pa(t, e) {
  var a;
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return [];
  const i = [], r = t.querySelector(".hcci-copy");
  if (Number(getComputedStyle(r).opacity) > 0.8 && ((a = r.textContent) != null && a.trim())) {
    const o = r.parentElement.appendChild(document.createElement("div"));
    o.className = "hcci-fate-exit-pieces";
    for (let n = 0; n < jt.length - 1; n++) {
      const c = r.cloneNode(!0), l = o.appendChild(document.createElement("div"));
      l.style.clipPath = Ie([...jt[n], ...jt[n + 1].slice().reverse()]), l.append(c), i.push(l.animate([
        { transform: "none", opacity: 1 },
        { transform: `translate(${(n - 2) * 9 + (n % 2 ? 11 : -8)}vw,${7 + n * 6}vh) rotate(${(n - 2) * 12}deg)`, opacity: 0 }
      ], { duration: e - n * 9, delay: n * 9, easing: "cubic-bezier(.55,.04,.89,.54)", fill: "both" }));
    }
    r.style.visibility = "hidden";
  }
  return i.push(t.animate([{ opacity: 1 }, { opacity: 1, offset: 0.61 }, { opacity: 0 }], { duration: e, fill: "both" })), i;
}
const st = "manga-overdrive", oe = "#ec2846";
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
const k = { blackout: 0, ink: 80, silhouette: 180, halftone: 320, impact: 520, hold: 760 }, dt = "cubic-bezier(.12,.76,.18,1)", X = "steps(1, end)", ga = "grayscale(1) brightness(.40) contrast(1.8)", ya = "grayscale(1) contrast(1.55)";
function va(t, e) {
  const i = [];
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return { animations: i, audioDelay: 0 };
  const r = Math.min(1, (e - 160) / k.hold), a = (n, c, l, s, u = "linear") => {
    for (const f of t.querySelectorAll(n))
      i.push(f.animate(c, { delay: l * r, duration: (s - l) * r, easing: u, fill: "both" }));
  }, o = (n) => n / k.impact;
  return a(".hcci-manga-page", [
    { opacity: 0, transform: "scale(.65)", easing: X },
    { opacity: 1, transform: "scale(.73)", offset: o(k.ink), easing: dt },
    { opacity: 1, transform: "scale(1.03)", offset: o(k.silhouette) },
    { opacity: 1, transform: "scale(1)", offset: o(k.halftone), easing: X },
    { opacity: 0, transform: "scale(1)" }
  ], k.blackout, k.impact), a(".hcci-manga-panel-glint", [
    { opacity: 0, transform: "scaleX(.1)" },
    { opacity: 1, transform: "scaleX(1)", offset: 0.32, easing: X },
    { opacity: 0, transform: "scaleX(1)" }
  ], 19, k.ink), a(".hcci-visual", [
    { opacity: 1, transform: "none", easing: X },
    { opacity: 0, transform: "none", offset: k.ink / k.hold, easing: X },
    { opacity: 1, transform: "translate(-16vw, 4vh) rotate(-12deg) scale(.84)", offset: k.silhouette / k.hold, easing: dt },
    { opacity: 1, transform: "translate(1.2vw,-.6vh) rotate(2deg) scale(.94)", offset: 255 / k.hold },
    { opacity: 1, transform: "scale(.92)", offset: k.halftone / k.hold, easing: dt },
    { opacity: 1, transform: "translate(-.3vw,.15vh) scale(.96)", offset: 352 / k.hold, easing: dt },
    { opacity: 1, transform: "none", offset: k.impact / k.hold },
    { opacity: 1, transform: "none" }
  ], k.blackout, k.hold), a(".hcci-portrait-frame", [
    { opacity: 0.065, easing: X },
    { opacity: 1 }
  ], k.blackout, k.silhouette), a(".hcci-manga-artwork", [
    { filter: "brightness(.16)", easing: X },
    { filter: ga, offset: o(k.silhouette), easing: X },
    { filter: ya, offset: o(k.halftone), easing: X },
    { filter: "none" }
  ], k.blackout, k.impact), a(".hcci-manga-reveal-lines", [
    { opacity: 0, easing: X },
    { opacity: 1 }
  ], k.blackout, k.halftone), a(".hcci-manga-dots", [
    { opacity: 0, easing: X },
    { opacity: 0.27, offset: o(k.halftone), easing: X },
    { opacity: 0 }
  ], k.blackout, k.impact), a(".hcci-manga-impact", [
    { opacity: 0, easing: X },
    { opacity: 1, offset: 0.01, transform: "scale(1.06)", easing: X },
    { opacity: 1, transform: "scale(1.06)", offset: 0.29, easing: dt },
    { opacity: 1, transform: "scale(1)" }
  ], k.impact, k.hold), a(".hcci-copy", [
    { opacity: 0, transform: "translate(12vw, -4vh) rotate(4deg) scale(1.16)" },
    { opacity: 1, transform: "translate(-.8vw, .4vh) rotate(-6deg) scale(1.035)", offset: 0.31, easing: X },
    { opacity: 1, transform: "translate(-.8vw, .4vh) rotate(-6deg) scale(1.035)", offset: 0.48, easing: dt },
    { opacity: 1, transform: "rotate(-4deg)" }
  ], k.impact, k.hold, dt), a(".hcci-manga-flash", [
    { opacity: 0 },
    { opacity: "var(--flash-peak, .14)", offset: 0.1 },
    { opacity: 0 }
  ], k.impact, k.impact + 38), a(".hcci-stage", [
    { transform: "none" },
    { transform: "translateX(var(--hcci-shake))", offset: 0.18 },
    { transform: "translateX(calc(-.5 * var(--hcci-shake)))", offset: 0.44 },
    { transform: "none" }
  ], k.impact, k.impact + 66), { animations: i, audioDelay: k.impact * r };
}
function ba(t, e) {
  return !t.classList.contains("hcci-motion-full") || !t.animate ? [] : Array.from(t.querySelectorAll(".hcci-manga-exit"), (i, r) => i.animate([
    { transform: r === 0 ? "translate(-85%, -36%)" : "translate(85%, 36%)", opacity: 1 },
    { transform: r === 0 ? "translate(11%, 7%)" : "translate(-11%, -7%)", opacity: 1 }
  ], { duration: e - r * 17, delay: r * 17, easing: "cubic-bezier(.48,.05,.82,.71)", fill: "both" }));
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
const G = {
  anticipation: 0,
  slash: 100,
  rupture: 245,
  reveal: 402,
  title: 505,
  hold: 695
}, Sa = "cubic-bezier(.68,0,.88,.45)", Dt = "cubic-bezier(.12,.78,.24,1)", fe = "cubic-bezier(.15,.78,.18,1)", Ca = "cubic-bezier(.62,.02,.86,.45)";
function Mt(t) {
  const e = 91 - 0.74 * t;
  return `polygon(-10% 0, ${t - 12}% 0, ${t - 11}% ${e - 6}%, ${t}% ${e}%, ${t - 12}% ${e + 8}%, ${t - 15}% 100%, -10% 100%) view-box`;
}
function ka(t, e) {
  const i = [];
  if (!t.classList.contains("hcci-motion-full") || !t.animate)
    return { animations: i, audioDelay: 0 };
  const r = Math.min(1, (e - 100) / G.hold), a = (o, n, c, l, s = "linear") => {
    for (const u of t.querySelectorAll(o))
      i.push(u.animate(n, {
        delay: c * r,
        duration: (l - c) * r,
        easing: s,
        fill: "both"
      }));
  };
  return a(".hcci-rift-geometry", [{ opacity: 0.62 }, { opacity: 1 }], G.anticipation, G.slash), a(".hcci-rift-edge, .hcci-rift-edge-light", [{ opacity: 0 }, { opacity: 1 }], G.slash + 82, G.rupture), a(".hcci-rift-upper", [{ transform: "none" }, { transform: "translate(8vw, -38vh) rotate(-3deg)" }], G.rupture, 535, Dt), a(".hcci-rift-lower", [{ transform: "none" }, { transform: "translate(-5vw, 40vh) rotate(-2deg)" }], G.rupture + 18, 585, Dt), a(".hcci-rift-slash", [
    { clipPath: Mt(1), opacity: 0.28 },
    { clipPath: Mt(13), opacity: 0.65, offset: 0.21, easing: Sa },
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
  ], G.title + 38, 640), { animations: i, audioDelay: G.slash * r };
}
function Ma(t, e) {
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return [];
  const i = [];
  for (const [r, a] of [
    [".hcci-visual", "translate(62vw, -43vh) rotate(-9deg)"],
    [".hcci-copy", "translate(75vw, -40vh) skewX(-12deg)"],
    [".hcci-rift-upper", "translate(20vw, -105vh) rotate(-6deg)"],
    [".hcci-rift-lower", "translate(-24vw, 100vh) rotate(-5deg)"]
  ]) {
    const o = t.querySelector(r);
    o && i.push(o.animate([{ transform: a }], { duration: e, easing: Ca, fill: "forwards" }));
  }
  return i;
}
const St = "reality-override", Ta = 300, te = 5, N = { cut: 20, flip: 150, wind: 520, impact: 640, settle: 820 }, Tt = "cubic-bezier(.14,.82,.2,1)", $t = "steps(1, end)", he = [1, -0.7, 0.5, -1, 0.8];
function xa(t) {
  const e = t === "low" ? 0 : t === "high" ? 8 : 4;
  return `<div class="hcci-ovr-freeze"></div>
    <div class="hcci-ovr-slab"></div>
    <div class="hcci-ovr-chips">${Array.from({ length: e }, (i, r) => `<i style="--k:${r}"></i>`).join("")}</div>
    <div class="hcci-ovr-flash"></div>`;
}
function Aa(t) {
  const e = t.querySelector(".hcci-visual"), i = t.querySelector(".hcci-portrait-frame > .hcci-portrait");
  if (!e || !i) return;
  e.querySelectorAll(".hcci-ovr-echo, .hcci-ovr-panel, .hcci-ovr-cuts, .hcci-ovr-band").forEach((l) => l.remove());
  const r = (l) => {
    const s = i.cloneNode(!0);
    return s.classList.remove("hcci-portrait"), s.classList.add(l), s;
  }, a = (l, s) => {
    const u = document.createElement(l.startsWith("i.") ? "i" : "div");
    return u.className = l.replace(/^i\./, ""), s !== void 0 && u.style.setProperty("--i", String(s)), u;
  }, o = a("hcci-ovr-echo");
  o.append(r("hcci-ovr-echo-art"));
  const n = a("hcci-ovr-panel");
  for (let l = 0; l < te; l++) {
    const s = a("hcci-ovr-louver", l);
    s.append(r("hcci-ovr-art"), a("i.hcci-ovr-tint"), a("i.hcci-ovr-face"), a("i.hcci-ovr-neg")), n.append(s);
  }
  const c = a("hcci-ovr-cuts");
  for (let l = 0; l <= te; l++) c.append(a("i.hcci-ovr-cut", l));
  e.append(o, n, c, a("hcci-ovr-band"));
}
function Ea(t, e) {
  var L;
  const i = [];
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return { animations: i, audioDelay: 0 };
  const r = Math.min(1, (e - 100) / N.settle), a = (y, O, R, $, et = "linear", at = "both") => {
    y && i.push(y.animate(O, { delay: R * r, duration: Math.max(1, ($ - R) * r), easing: et, fill: at }));
  }, o = (y, O, R) => {
    const $ = R * r;
    y && e > $ && i.push(y.animate(O, { delay: $, duration: e - $, fill: "forwards" }));
  }, n = (y) => t.querySelector(y), c = (y) => Array.from(t.querySelectorAll(y)), l = c(".hcci-ovr-cut"), s = t.clientHeight || 1, u = Math.max(0, (((L = l[0]) == null ? void 0 : L.getBoundingClientRect().width) ?? 3) - 3), f = Math.hypot(u, s), d = u / f, g = -s / f, p = (y) => `rotate3d(${d.toFixed(4)},${g.toFixed(4)},0,${y}deg)`, v = (y) => `translate(${(d * y * s).toFixed(1)}px,${(g * y * s).toFixed(1)}px) scale(1.07)`;
  a(n(".hcci-ovr-freeze"), [{ opacity: 0 }, { opacity: 1 }], 0, 45);
  const b = "polygon(var(--ovr-lean) 0, calc(var(--ovr-lean) + 3px) 0, calc(var(--ovr-lean) + 3px) 0, var(--ovr-lean) 0)", w = "polygon(0 100%, 3px 100%, 3px 100%, 0 100%)", A = "polygon(var(--ovr-lean) 0, calc(var(--ovr-lean) + 3px) 0, 3px 100%, 0 100%)";
  for (const [y, O] of l.entries()) {
    const R = N.cut + y * 14;
    a(O, [{ clipPath: y % 2 ? w : b }, { clipPath: A }], R, R + 95, "cubic-bezier(.7,0,.3,1)"), y > 0 && y < te && a(O, [{ opacity: 1 }, { opacity: 1 }], 0, N.impact, "linear", "backwards");
  }
  a(n(".hcci-ovr-slab"), [
    { transform: "translate(calc(var(--ovr-lean) * 1.15), -115vh)" },
    { transform: "none" }
  ], N.flip, N.flip + 230, Tt), a(n(".hcci-ovr-echo"), [
    { transform: "translate(calc(var(--ovr-lean) * -1.15), 115vh)" },
    { transform: "none" }
  ], N.flip + 40, N.flip + 300, Tt);
  for (const [y, O] of c(".hcci-ovr-louver").entries()) {
    const R = N.flip + y * 38;
    a(O, [
      { opacity: 0, transform: p(-98) },
      { opacity: 1, transform: p(-98), offset: 0.02 },
      { opacity: 1, transform: p(10), offset: 0.68 },
      { opacity: 1, transform: p(0) }
    ], R, R + 230, Tt), a(O.querySelector(".hcci-ovr-face"), [{ opacity: 1 }, { opacity: 1, offset: 0.42 }, { opacity: 0 }], R, R + 230, "linear", "backwards");
    const $ = O.querySelector(".hcci-ovr-art");
    a($, [
      { transform: v(he[y] * 0.055) },
      { transform: v(he[y] * 0.024), offset: 0.97, easing: $t },
      { transform: "none" }
    ], R, N.impact, "linear", "backwards"), a(O.querySelector(".hcci-ovr-tint"), [{ opacity: 1 }, { opacity: 1 }], 0, N.impact, "linear", "backwards"), t.classList.contains("hcci-flash-off") || a(O.querySelector(".hcci-ovr-neg"), [{ opacity: 1 }, { opacity: 1 }], N.impact, N.impact + 48, "linear", "none"), o($, [{ transform: "none" }, { transform: "scale(1.04)" }], N.impact);
  }
  const E = n(".hcci-ovr-band");
  a(E, [
    { clipPath: "inset(49% 100% 49% 0)", backgroundColor: "#fff" },
    { clipPath: "inset(49% 0 49% 0)", backgroundColor: "#fff" }
  ], N.wind, N.impact, "cubic-bezier(.6,0,.9,.4)", "backwards"), a(E, [
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
  for (const [y, O] of c(".hcci-ovr-chips i").entries()) {
    const R = y % 2 ? 1 : -1;
    a(O, [
      { opacity: 1, transform: "rotate(var(--ovr-tilt)) translateX(0)" },
      { opacity: 1, offset: 0.65 },
      { opacity: 0, transform: `rotate(var(--ovr-tilt)) translateX(${R * (34 + y * 5)}vw) rotate(${R * 160}deg)` }
    ], N.impact, N.impact + 300 + y * 12, "cubic-bezier(.1,.7,.3,1)", "none");
  }
  return o(n(".hcci-ovr-echo-art"), [{ transform: "scale(1.45)" }, { transform: "scale(1.45) translateX(-1.6vw)" }], N.flip + 300), o(n(".hcci-ovr-slab"), [{ transform: "none" }, { transform: "translate(calc(var(--ovr-lean) * -.05), 5vh)" }], N.flip + 230), { animations: i, audioDelay: N.cut * r };
}
function La(t, e) {
  var s;
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return [];
  const i = [], r = (u, f, d, g, p = "cubic-bezier(.6,.02,.9,.5)") => {
    u && i.push(u.animate(f, { delay: d * e, duration: (g - d) * e, easing: p, fill: "forwards" }));
  }, a = (u) => t.querySelector(u);
  r(a(".hcci-copy"), [{ opacity: 0, transform: "rotate(var(--ovr-tilt)) translateX(7vw)" }], 0, 0.28), r(a(".hcci-ovr-band"), [
    { clipPath: "inset(0 0 0 0)" },
    { clipPath: "inset(49% 0 49% 0)", backgroundColor: "#fff", offset: 0.5 },
    { clipPath: "inset(49% 0 49% 100%)", backgroundColor: "#fff" }
  ], 0, 0.6, "linear");
  const o = Array.from(t.querySelectorAll(".hcci-ovr-louver")), n = t.clientHeight || 1, c = Math.max(0, (((s = t.querySelector(".hcci-ovr-cut")) == null ? void 0 : s.getBoundingClientRect().width) ?? 3) - 3), l = Math.hypot(c, n);
  for (const [u, f] of o.entries()) {
    const d = 0.08 + (o.length - 1 - u) * 0.07;
    r(f, [
      { opacity: 1, transform: `rotate3d(${(c / l).toFixed(4)},${(-n / l).toFixed(4)},0,96deg)`, offset: 0.98, easing: $t },
      { opacity: 0, transform: `rotate3d(${(c / l).toFixed(4)},${(-n / l).toFixed(4)},0,96deg)` }
    ], d, d + 0.42);
  }
  for (const u of t.querySelectorAll(".hcci-ovr-cut")) r(u, [{ opacity: 0 }], 0.08, 0.2, $t);
  return r(a(".hcci-ovr-slab"), [{ transform: "translate(calc(var(--ovr-lean) * -1.15), 115vh)" }], 0.12, 0.82), r(a(".hcci-ovr-echo"), [{ transform: "translate(calc(var(--ovr-lean) * 1.15), -115vh)" }], 0.06, 0.76), r(a(".hcci-ovr-freeze"), [{ opacity: 0 }], 0.62, 1, "linear"), i;
}
const Ct = "system-collapse", $a = 420, yt = 12, Pa = 0.1, Ia = 0.07, x = { boot: 170, fault: 350, title: 560, freeze: 770, collapse: 880, impact: 1240, settle: 1400 }, W = "steps(1, end)", pe = "cubic-bezier(.14,.82,.2,1)", Na = [
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
  const i = t.naturalWidth, r = t.naturalHeight;
  if (!i || !r) return !1;
  try {
    const a = document.createElement("canvas");
    a.width = 80, a.height = yt * 8;
    const o = a.getContext("2d");
    if (!o) return !1;
    const n = Math.min(i, r * 0.8), c = Math.min(r, i / 0.8);
    o.imageSmoothingQuality = "high";
    const l = a.width / n, s = a.height / c;
    o.drawImage(t, (n - i) / 2 * l, (c - r) * 0.25 * s, i * l, r * s);
    for (const [u, f] of e.entries()) {
      const [d, g] = Array.from(f.querySelectorAll("canvas"));
      d.width = 40, d.height = 4;
      const p = d.getContext("2d");
      p.imageSmoothingQuality = "high", p.drawImage(a, 0, u * 8, 80, 8, 0, 0, 40, 4), g.width = 10, g.height = 1;
      const v = g.getContext("2d");
      v.imageSmoothingQuality = "high", v.drawImage(d, 0, 0, 40, 4, 0, 0, 10, 1);
    }
    return !0;
  } catch {
    return !1;
  }
}
function qa(t, e) {
  var u, f;
  const i = (((u = t.querySelector(".hcci-title")) == null ? void 0 : u.textContent) ?? "").trim().split(/\s+/).filter(Boolean);
  t.style.setProperty("--col-word", String(Math.max(6, ...i.map((d) => d.length)))), t.style.setProperty("--col-lines", String(Math.max(1, i.length)));
  const r = t.querySelector(".hcci-visual"), a = t.querySelector(".hcci-portrait-frame > .hcci-portrait");
  if (!e || !r || !a) return;
  r.querySelectorAll(".hcci-col-backing, .hcci-col-rows, .hcci-col-brackets, .hcci-col-floor, .hcci-col-beam").forEach((d) => d.remove()), (f = t.querySelector(".hcci-col-cursor")) == null || f.remove();
  const o = (d, g) => {
    const p = document.createElement(d);
    return p.className = g, p;
  }, n = o("div", "hcci-col-rows hcci-col-plain"), c = [];
  for (let d = 0; d < yt; d++) {
    const g = o("div", "hcci-col-row");
    g.style.setProperty("--r", String(d));
    const p = o("div", "hcci-col-fall"), v = o("div", "hcci-col-band"), b = a.cloneNode(!0);
    b.classList.remove("hcci-portrait"), b.classList.add("hcci-col-art"), v.append(b, o("canvas", "hcci-col-lod"), o("canvas", "hcci-col-lod"), o("i", "hcci-col-dead")), p.append(v), g.append(p), n.append(g), c.push(g);
  }
  const l = o("div", "hcci-col-brackets");
  l.innerHTML = "<i></i><i></i><i></i><i></i>", r.append(o("div", "hcci-col-backing"), n, l, o("div", "hcci-col-floor"), o("div", "hcci-col-beam"));
  const s = t.querySelector(".hcci-copy");
  if (s != null && s.children.length && s.append(o("i", "hcci-col-cursor")), a instanceof HTMLImageElement) {
    const d = () => n.classList.toggle("hcci-col-plain", !Fa(a, c));
    a.complete && d(), a.addEventListener("load", d, { once: !0 });
  }
}
function Ha(t, e) {
  const i = [];
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return { animations: i, audioDelay: 0 };
  const r = Math.min(1, (e - 100) / x.settle), a = (p, v, b, w, A = "linear", E = "both") => {
    p && i.push(p.animate(v, { delay: b * r, duration: Math.max(1, (w - b) * r), easing: A, fill: E }));
  }, o = (p) => t.querySelector(p), n = (p) => Array.from(t.querySelectorAll(p)), c = (p, v, b = v) => [
    { ...v, offset: 0, easing: W },
    ...p.map(([w, A]) => ({ ...A, offset: w / x.freeze, easing: W })),
    { ...b, offset: 1 }
  ];
  a(o(".hcci-col-freeze"), [{ opacity: 0 }, { opacity: 1 }], 0, x.boot);
  const l = [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }], s = o(".hcci-col-rows");
  a(s, l, 40, x.boot, "steps(6, end)", "backwards"), a(o(".hcci-col-brackets"), [{ opacity: 0, transform: "scale(.9)" }, { opacity: 1, transform: "none" }], 0, 120, pe);
  for (const [p, v] of n(".hcci-col-row").entries()) {
    const b = Na.filter((L) => L[1] === p);
    a(v, c(b.map(([L, , y]) => [L, { transform: `translateX(${y}%)` }]), { transform: "none" }), 0, x.freeze);
    const [w, A] = Array.from(v.querySelectorAll("canvas"));
    a(w, c(b.map(([L, , , y]) => [L, { opacity: y >= 1 ? 1 : 0 }]), { opacity: 0 }, { opacity: 1 }), 0, x.freeze), a(A, c(b.map(([L, , , y]) => [L, { opacity: y === 2 ? 1 : 0 }]), { opacity: 0 }, { opacity: 1 }), 0, x.freeze);
    const E = Da.filter((L) => L[2] === p);
    E.length && a(v.querySelector(".hcci-col-dead"), c(E.flatMap(([L, y]) => [[L, { opacity: 1 }], [y, { opacity: 0 }]]), { opacity: 0 }), 0, x.freeze);
  }
  a(s, c([[706, { transform: "translateY(2.5%)" }], [734, { transform: "none" }]], { transform: "none" }), 0, x.freeze);
  for (const [p, v] of n(".hcci-col-tears i").entries())
    a(v, c(Ra[p].flatMap(([b, w]) => [[b, { opacity: 1 }], [w, { opacity: 0 }]]), { opacity: 0 }), 0, x.freeze);
  const u = n(".hcci-col-brackets i");
  for (const [p, v] of u.entries()) {
    const { drift: b, fall: w, exit: A } = Za[p], E = { transform: b[b.length - 1][1] };
    a(v, c(b.map(([L, y]) => [L, { transform: y }]), { transform: "none" }, E), 0, x.freeze), a(v, [E, { transform: A }], x.collapse + w, x.collapse + w + 420, "cubic-bezier(.5,0,1,.6)", "forwards");
  }
  a(o(".hcci-copy"), [
    { opacity: 0, clipPath: "inset(0 0 100% 0)", easing: W },
    { opacity: 1, clipPath: "inset(0 0 66% 0)", offset: 0.34, easing: W },
    { opacity: 1, clipPath: "inset(0 0 33% 0)", offset: 0.67, easing: W },
    { opacity: 1, clipPath: "inset(-30%)" }
  ], x.title, x.title + 90);
  const f = x.impact - x.collapse;
  a(o(".hcci-col-backing"), [{ opacity: 1, easing: W }, { opacity: 0 }], 0, x.collapse);
  for (const [p, v] of n(".hcci-col-row").entries()) {
    const b = Math.sqrt(p / yt), w = Math.sqrt((p + 1) / yt);
    if (a(
      v.querySelector(".hcci-col-band"),
      [{ transform: "none" }, { transform: `scaleY(${Ia})` }],
      x.collapse + b * f,
      x.collapse + w * f,
      "ease-in",
      "both"
    ), p === yt - 1) continue;
    const A = `cubic-bezier(.3333,${(2 * w / (1 + w) / 3).toFixed(4)},.6667,${(1 - 2 / (1 + w) / 3).toFixed(4)})`;
    a(v.querySelector(".hcci-col-fall"), [
      { transform: "none" },
      { transform: `translateY(${((yt - 1 - p) * (1 - Pa) * 100).toFixed(2)}%)` }
    ], x.collapse + w * f, x.impact, A, "both");
  }
  const d = o(".hcci-portrait-frame");
  a(d, [{ filter: "brightness(.45)" }, { filter: "brightness(.45)" }], 0, x.impact, "linear", "backwards"), a(d, [{ filter: "brightness(1.7)" }, { filter: "brightness(1)" }], x.impact, x.impact + 240, "ease-out", "none"), a(
    o(".hcci-col-floor"),
    [{ transform: "scaleX(0)", opacity: 1 }, { transform: "scaleX(1)", opacity: 1, offset: 0.5 }, { transform: "scaleX(1)", opacity: 0.55 }],
    x.impact,
    x.impact + 280,
    pe
  ), a(o(".hcci-col-flash"), [
    { opacity: 0 },
    { opacity: "var(--flash-peak, .14)", offset: 0.1 },
    { opacity: 0 }
  ], x.impact, x.impact + 160), a(o(".hcci-stage"), [{ transform: "translateY(var(--hcci-shake))" }, { transform: "none" }], x.impact, x.impact + 170, "ease-out", "none"), a(s, [{ transform: "translateY(.5vh)" }, { transform: "none" }], x.impact, x.impact + 90, "ease-out", "none"), a(o(".hcci-copy"), [{ transform: "translateY(1.4vh)" }, { transform: "none" }], x.impact, x.impact + 110, "ease-out", "none");
  const g = x.settle * r;
  if (e > g) {
    const p = o(".hcci-portrait-frame > .hcci-portrait");
    p && i.push(p.animate(
      [{ transform: "none" }, { transform: "scale(1.035)" }],
      { delay: x.impact * r, duration: e - x.impact * r, fill: "forwards" }
    ));
    const v = o(".hcci-col-cursor");
    v && i.push(v.animate([
      { opacity: 1, easing: W },
      { opacity: 0, offset: 0.5, easing: W },
      { opacity: 1 }
    ], { delay: g, duration: 560, iterations: Math.max(1, Math.round((e - g) / 560)), fill: "forwards" }));
  }
  return { animations: i, audioDelay: x.fault * r };
}
function _a(t, e) {
  if (!t.classList.contains("hcci-motion-full") || !t.animate) return [];
  const i = [], r = (o, n, c, l, s = "linear") => {
    o && i.push(o.animate(n, { delay: c * e, duration: (l - c) * e, easing: s, fill: "forwards" }));
  }, a = (o) => t.querySelector(o);
  r(a(".hcci-copy"), [
    { clipPath: "inset(-30% -30% 0 -30%)", easing: W },
    { clipPath: "inset(-30% -30% 34% -30%)", offset: 0.33, easing: W },
    { clipPath: "inset(-30% -30% 67% -30%)", offset: 0.66, easing: W },
    { clipPath: "inset(-30% -30% 100% -30%)", opacity: 0 }
  ], 0, 0.3), r(a(".hcci-col-floor"), [{ transform: "scaleX(0)" }], 0, 0.36, "cubic-bezier(.6,0,.9,.4)");
  for (const o of t.querySelectorAll(".hcci-col-brackets")) r(o, [{ opacity: 0 }], 0, 0.05);
  for (const o of [".hcci-portrait-frame", ".hcci-col-rows", ".hcci-col-backing"])
    r(a(o), [
      { transform: "scaleY(.004)", opacity: 1, offset: 0.97, easing: W },
      { transform: "scaleY(.004)", opacity: 0 }
    ], 0, 0.34, "cubic-bezier(.6,0,.9,.3)");
  return r(a(".hcci-col-beam"), [
    { opacity: 0, transform: "scaleX(.9)" },
    { opacity: 0, transform: "scaleX(.9)", offset: 0.26 },
    { opacity: 1, transform: "scaleX(1)", offset: 0.34 },
    { opacity: 1, transform: "scaleX(2.2)", offset: 0.5, easing: "cubic-bezier(.6,0,.9,.4)" },
    { opacity: 1, transform: "scaleX(.012)", offset: 0.8 },
    { opacity: 1, transform: "scaleX(.012)", offset: 0.88 },
    { opacity: 0, transform: "scaleX(0)" }
  ], 0, 1), r(a(".hcci-col-tears"), [{ opacity: 0 }], 0, 0.05), r(a(".hcci-col-freeze"), [{ opacity: 0 }], 0.6, 1), i;
}
const _t = "crosshair-sever";
function za() {
  return '<div class="hcci-sever-crosshair"><i></i></div><div class="hcci-sever-cut hcci-sever-cut-horizontal"></div><div class="hcci-sever-cut hcci-sever-cut-vertical"></div>';
}
function Ga(t, e) {
  const i = t.querySelector(".hcci-visual"), r = i.querySelector(".hcci-portrait-frame .hcci-portrait"), a = i.querySelector(".hcci-sever-pieces");
  if (a) {
    for (const s of a.querySelectorAll(".hcci-portrait")) s.replaceWith(r.cloneNode(!0));
    return;
  }
  const o = document.createElement("div");
  o.className = "hcci-sever-pieces";
  const n = e === "low" ? 2 : e === "high" ? 4 : 3, c = 50 / n, l = (s, u, f, d) => {
    const g = document.createElement("div");
    return g.className = s, g.style.clipPath = `inset(${f}% ${100 - u - d}% ${100 - f - d}% ${u}%)`, g.append(r.cloneNode(!0)), g;
  };
  for (const [s, u] of [[0, 0], [50, 0], [0, 50], [50, 50]]) {
    const f = document.createElement("div");
    f.className = "hcci-sever-quadrant", f.style.setProperty("--qx", s === 0 ? "-1" : "1"), f.style.setProperty("--qy", u === 0 ? "-1" : "1"), f.append(l("hcci-sever-solid", s, u, 50));
    for (let d = 0; d < n; d++)
      for (let g = 0; g < n; g++) {
        const p = d * n + g, v = l("hcci-sever-tile", s + g * c, u + d * c, c);
        v.style.setProperty("--drift-x", String(0.25 + (p * 7 + s) % 13 / 12)), v.style.setProperty("--drift-y", String(0.25 + (p * 11 + u) % 17 / 16)), v.style.setProperty("--lag", String((p * 7 + s + u) % 11)), v.style.setProperty("--spin", `${(p % 5 - 2) * 14}deg`), v.style.transformOrigin = `${s + (g + 0.5) * c}% ${u + (d + 0.5) * c}%`, f.append(v);
      }
    o.append(f);
  }
  i.append(o);
}
const ne = [
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
  { id: Ct, label: "System Collapse", description: "The portrait loses sync and resolution row by row, freezes, then pancakes to the floor before powering off.", shake: 0.6 },
  { id: _t, label: "Crosshair Sever", description: "A crosshair locks onto the portrait. Plasma cuts along both axes, splitting the image into four pieces that disintegrate.", shake: 0.55 }
];
function zt(t) {
  var e;
  return ((e = ne.find((i) => i.id === t)) == null ? void 0 : e.id) ?? "strike";
}
function Ot(t) {
  return ne.find((e) => e.id === zt(t));
}
const Z = (t, e = 1) => Array.from({ length: e }, (i, r) => `<i class="hcci-fx hcci-fx-${t}" style="--i:${r};--n:${e};--v:${r % 4};--d:${r % 5};--s:${r % 3}"></i>`).join("");
function Ba(t, e = "standard") {
  const i = zt(t), r = e === "low" ? 8 : e === "high" ? 28 : 16, a = Z("particle", r), o = Z("wave", 2);
  switch (i) {
    case "strike":
      return Z("slash", 2) + Z("speed", 7) + o + a;
    case "breach":
      return '<div class="hcci-tear hcci-tear-top"><span></span></div><div class="hcci-tear hcci-tear-bottom"><span></span></div>' + Z("door", 2) + a;
    case "signal":
      return Z("reticle", 3) + Z("tick", 12) + Z("sweep") + o;
    case wt:
      return sa();
    case st:
      return ma(e);
    case "rift":
      return wa(e);
    case St:
      return xa(e);
    case Ct:
      return Oa(e);
    case _t:
      return za();
    case "shatter":
      return Z("shard", r) + Z("prism", 2) + o;
    case "reactor":
      return Z("rail", 6) + Z("column") + Z("corona", 2) + a;
    case "void":
      return Z("disk", 2) + Z("horizon") + Z("infall", r) + o;
    case "railgun":
      return Z("sight", 4) + Z("lance") + Z("wake", 7) + a;
    case "eclipse":
      return Z("moon") + Z("crown", 2) + Z("star", r) + Z("orbit", 3);
    case "overdrive":
      return Z("gate", 5) + Z("data", r) + Z("sweep") + o;
  }
}
const vt = [], xt = /* @__PURE__ */ new Set();
let Zt = !1;
function At(t) {
  const e = document.createElement("div");
  return e.textContent = String(t ?? ""), e.innerHTML.replace(/"/g, "&quot;");
}
function Xa(t) {
  var i, r, a, o, n;
  if (!t.preview && S(m.suppressCutins) === !0 || t != null && t.blind && !((i = game.user) != null && i.isGM) || Array.isArray(t == null ? void 0 : t.whisper) && t.whisper.length && !t.whisper.includes((r = game.user) == null ? void 0 : r.id) && !((a = game.user) != null && a.isGM))
    return !1;
  const e = (t == null ? void 0 : t.audience) ?? S(m.audience);
  return e === ct.everyone ? !0 : e === ct.gm ? ((o = game.user) == null ? void 0 : o.isGM) === !0 : e === ct.triggeringPlayer ? ((n = game.user) == null ? void 0 : n.id) === (t == null ? void 0 : t.userId) : !0;
}
async function Va(t, e) {
  var i, r;
  if (t)
    try {
      const a = Math.min(1, Math.max(0, Number(e ?? S(m.volume) ?? 0.8))), o = Math.min(1, Math.max(0, Number(S(m.localVolume) ?? 1))), n = a * o;
      if ((r = (i = foundry.audio) == null ? void 0 : i.AudioHelper) != null && r.play)
        return foundry.audio.AudioHelper.play({ src: t, volume: n, autoplay: !0, loop: !1 }, !1);
      const c = globalThis.AudioHelper;
      if (c != null && c.play)
        return c.play({ src: t, volume: n, autoplay: !0, loop: !1 }, !1);
      const l = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), s = new Audio(t);
      return s.volume = n * l, await s.play(), s;
    } catch (a) {
      return kt("Audio playback failed.", { src: t, error: a }), null;
    }
}
function Yt(t) {
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
function ja(t) {
  var it, rt;
  const e = Ot(t.animationStyle), i = e.id, r = t.triggerKind === "failure" ? "failure" : "success", a = i === "rift", o = i === st, n = i === wt, c = i === St, l = i === Ct, s = a || o || n || c || l, u = t.accentColor || (o ? oe : (a || n || c || l) && r === "failure" ? "#ff4d7d" : "#69e8ff"), f = t.imagePath ? `<img class="hcci-portrait" src="${At(t.imagePath)}" alt="">` : '<div class="hcci-portrait hcci-portrait-fallback"><i class="fa-solid fa-user-astronaut"></i></div>', d = Math.max(1, String(t.overlayText ?? "").length), g = String(t.overlayText ?? "").trim().split(/\s+/), p = n && g.length > 1 ? `${At(g.slice(0, -1).join(" "))} <span>${At(g.at(-1))}</span>` : At(t.overlayText), v = t.textEnabled && t.overlayText ? `<div class="hcci-title" style="--hcci-title-chars: ${d}">${p}</div>` : "", b = t.actorName || "", w = String(S(m.motionMode) ?? "system"), A = ((rt = (it = globalThis.matchMedia) == null ? void 0 : it.call(globalThis, "(prefers-reduced-motion: reduce)")) == null ? void 0 : rt.matches) === !0, E = w === "system" || s && A && w === "full" ? A ? "reduced" : "full" : ["full", "reduced", "still"].includes(w) ? w : "full", L = String(S(m.flashMode) ?? "soft"), y = ["full", "soft", "off"].includes(L) ? L : "soft", O = S(m.effectIntensity), R = ["low", "standard", "high"].includes(O) ? O : "standard", $ = document.createElement("div");
  $.className = `hcci-overlay hcci-style-${i} hcci-kind-${r} hcci-motion-${E} hcci-flash-${y} hcci-detail-${R}`, $.style.setProperty("--hcci-accent", u);
  const et = S(m.animationFont);
  $.style.setProperty("--hcci-font", et === "classic" ? '"Orbitron", "Eurostile", "Agency FB", Impact, sans-serif' : '"HCCI AICON", "Orbitron", sans-serif');
  const at = Number(S(m.shakeIntensity) ?? 0.5);
  $.style.setProperty("--hcci-shake", `${e.shake * (Number.isFinite(at) ? Math.max(0, Math.min(1, at)) : 0.5) * 9}px`), $.setAttribute("aria-hidden", "true");
  const Y = E === "full" || o ? Ba(i, R) : "";
  $.innerHTML = `
    ${o || n || c || l ? "" : `<div class="${a ? "hcci-rift-flash" : "hcci-flash"}"></div>`}
    ${s ? Y : ""}
    <div class="hcci-atmosphere"></div>
    <section class="hcci-stage">
      <div class="hcci-visual">
      <div class="hcci-effects">${s ? "" : Y}</div>
      <div class="hcci-portrait-frame">
        ${o ? `<div class="hcci-manga-artwork">${f}</div><div class="hcci-manga-dots"></div>` : f}
      </div>
      ${o ? '<div class="hcci-manga-panel-glint"></div>' : ""}
      <div class="hcci-frame-accent"></div>
      </div>
      <div class="hcci-copy">
        ${v}
        ${b ? `<div class="hcci-subtitle">${At(b)}</div>` : ""}
      </div>
    </section>
  `;
  const K = n && E === "full", U = () => {
    K && ua($), c && E === "full" && Aa($), l && qa($, E === "full"), i === _t && E === "full" && Ga($, R);
  };
  U();
  const _ = $.querySelector("img.hcci-portrait");
  if (_ && E === "full" && (i === "shatter" || i === "overdrive")) {
    const H = [
      "polygon(0 0,50% 0,50% 50%)",
      "polygon(50% 0,100% 0,50% 50%)",
      "polygon(100% 0,100% 100%,50% 50%)",
      "polygon(100% 100%,50% 100%,50% 50%)",
      "polygon(50% 100%,0 100%,50% 50%)",
      "polygon(0 100%,0 0,50% 50%)"
    ];
    for (let q = 0; q < 6; q++) {
      const V = document.createElement("div");
      V.className = "hcci-portrait-echo", V.style.setProperty("--piece", String(q)), V.style.setProperty("--dx", `${q % 2 ? 1 : -1}`), V.style.setProperty("--dy", `${q < 3 ? -1 : 1}`), V.style.clipPath = i === "shatter" ? H[q] : `inset(${q * 100 / 6}% 0 ${100 - (q + 1) * 100 / 6}% 0)`;
      const lt = _.cloneNode();
      lt.className = "", V.appendChild(lt), $.querySelector(".hcci-visual").appendChild(V);
    }
  }
  return _ == null || _.addEventListener("error", () => {
    const H = t.preview ? t.fallbackImagePath : void 0;
    if (H && _.getAttribute("src") !== H) {
      _.src = H, $.querySelectorAll(".hcci-portrait-echo img").forEach((V) => {
        V.src = H;
      }), U();
      return;
    }
    $.querySelectorAll(".hcci-portrait-echo").forEach((V) => V.remove());
    const q = document.createElement("div");
    q.className = "hcci-portrait hcci-portrait-fallback", q.innerHTML = '<i class="fa-solid fa-user-astronaut"></i>', _.replaceWith(q), U();
  }), $;
}
async function Ya(t) {
  if (!Xa(t)) return;
  const e = Number(t.duration ?? S(m.duration) ?? 2500), i = Math.min(8e3, Math.max(800, Number.isFinite(e) ? e : 2500)), r = ja(t);
  r.style.setProperty("--hcci-duration", `${i}ms`), r.style.setProperty("--hcci-intro", `${Math.min(1e3, (i - 180) * 0.85)}ms`);
  let a = !1, o, n, c, l = [], s;
  try {
    document.body.appendChild(r);
    const u = r.classList.contains(`hcci-style-${wt}`), f = r.classList.contains(`hcci-style-${St}`), d = r.classList.contains(`hcci-style-${Ct}`), g = u ? da : f ? Ta : d ? $a : 180, p = i - g, v = r.classList.contains("hcci-style-rift"), b = r.classList.contains(`hcci-style-${st}`), w = f ? Ea(r, p) : d ? Ha(r, p) : u ? ha(r, p) : b ? va(r, p) : v ? ka(r, p) : void 0;
    w && (l = w.animations);
    const A = () => {
      Va(t.audioPath, t.volume).then((E) => {
        a ? Yt(E) : o = E;
      });
    };
    t.audioPath && (w != null && w.audioDelay) ? c = window.setTimeout(A, w.audioDelay) : A(), await new Promise((E) => {
      n = window.setTimeout(L, p);
      function L() {
        window.clearTimeout(n), globalThis.removeEventListener("keydown", s), E();
      }
      s = (y) => {
        y.key === "Escape" && L();
      }, globalThis.addEventListener("keydown", s);
    }), a = !0, window.clearTimeout(c), Yt(o), o = null, r.classList.add("hcci-exiting"), f ? l.push(...La(r, g)) : d ? l.push(..._a(r, g)) : u ? l.push(...pa(r, g)) : b ? l.push(...ba(r, g)) : v && l.push(...Ma(r, g)), await new Promise((E) => window.setTimeout(E, g));
  } finally {
    a = !0, window.clearTimeout(n), window.clearTimeout(c), l.forEach((u) => u.cancel()), s && globalThis.removeEventListener("keydown", s), Yt(o), r.remove();
  }
}
async function Ka(t) {
  var e, i;
  return !((e = game.user) != null && e.isGM) || Zt ? !1 : (await mt({
    ...t,
    id: foundry.utils.randomID(),
    userId: ((i = game.user) == null ? void 0 : i.id) ?? null,
    audience: ct.gm,
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
    return vt.push(t), vt.length > 3 && vt.splice(1, vt.length - 3), Ua();
  }
}
const ft = /* @__PURE__ */ new Set(), ee = /* @__PURE__ */ new Set();
function Wa(t) {
  return !!(t != null && t.id) && ee.has(t.id);
}
function j(t) {
  return t ? Array.isArray(t) ? t : [t] : [];
}
function Qa(t) {
  var r, a, o, n;
  const e = [
    ...j(t == null ? void 0 : t.rolls),
    ...j(t == null ? void 0 : t.roll),
    ...j(t == null ? void 0 : t._rolls),
    ...j((a = (r = t == null ? void 0 : t.flags) == null ? void 0 : r.dnd5e) == null ? void 0 : a.roll),
    ...j((n = (o = t == null ? void 0 : t.flags) == null ? void 0 : o.dnd5e) == null ? void 0 : n.rolls)
  ], i = /* @__PURE__ */ new Set();
  return e.filter((c) => !c || i.has(c) ? !1 : (i.add(c), !0));
}
function Ja(t) {
  const e = [], i = [...j(t == null ? void 0 : t.terms), ...j(t == null ? void 0 : t.dice), ...j(t == null ? void 0 : t._terms), ...j(t == null ? void 0 : t._dice)], r = /* @__PURE__ */ new Set();
  for (; i.length; ) {
    const a = i.shift();
    !a || r.has(a) || (r.add(a), e.push(a), i.push(
      ...j(a.terms),
      ...j(a.dice),
      ...j(a.rolls),
      ...j(a._terms),
      ...j(a._dice)
    ));
  }
  return e;
}
function Ne(t, e) {
  var o, n, c, l, s, u, f, d;
  const i = (t == null ? void 0 : t.flags) ?? {}, r = ((n = (o = i.dnd5e) == null ? void 0 : o.roll) == null ? void 0 : n.type) ?? ((l = (c = i.dnd5e) == null ? void 0 : c.roll) == null ? void 0 : l.rollType), a = (u = (s = i.pf2e) == null ? void 0 : s.context) == null ? void 0 : u.type;
  return [(f = e == null ? void 0 : e.options) == null ? void 0 : f.type, (d = e == null ? void 0 : e.options) == null ? void 0 : d.rollType, r, a].some((g) => String(g ?? "").toLowerCase().includes("damage"));
}
function ti(t) {
  const e = [];
  for (const i of Ja(t)) {
    const r = Number((i == null ? void 0 : i.faces) ?? (i == null ? void 0 : i._faces));
    if (!(r !== tt() || !Array.isArray(i.results)))
      for (const a of i.results) {
        if (a.active === !1 || a.discarded === !0 || a.rerolled === !0) continue;
        const o = Number(a.result ?? a.value ?? a.total);
        Number.isInteger(o) && o >= 1 && o <= r && e.push(o);
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
  const i = [], r = `d${tt()}`, a = [
    `.dice-rolls .roll.${r}`,
    `.dice-rolls .roll.die.${r}`,
    `.dice-tooltip .roll.${r}`,
    `.dice-tooltip .dice.${r} .roll`
  ], o = /* @__PURE__ */ new Set();
  for (const c of a)
    e.querySelectorAll(c).forEach((l) => o.add(l));
  for (const c of o) {
    if (c.classList.contains("discarded") || c.classList.contains("rerolled") || c.classList.contains("ignored") || c.classList.contains("inactive"))
      continue;
    const l = Number((n = c.textContent) == null ? void 0 : n.trim());
    Number.isInteger(l) && l >= 1 && l <= tt() && i.push(l);
  }
  return i;
}
function De(t, e) {
  return `${t}:${e}`;
}
function ii() {
  return De("gm", "default");
}
function ri(t) {
  return zt(t);
}
function Re(t, e) {
  var r, a, o, n;
  if (!t || !e) return !1;
  const i = ((a = (r = globalThis.CONST) == null ? void 0 : r.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3;
  return Number(((o = t.ownership) == null ? void 0 : o[e]) ?? ((n = t.ownership) == null ? void 0 : n.default) ?? 0) >= i;
}
function Ze(t) {
  var i;
  const e = (t == null ? void 0 : t.speaker) ?? {};
  return e.actor ? ((i = game.actors) == null ? void 0 : i.get(e.actor)) ?? null : t != null && t.actor ? t.actor : null;
}
function oi(t) {
  var r, a, o;
  const e = (t == null ? void 0 : t.author) ?? (t == null ? void 0 : t.user);
  if (e && typeof e == "object") return e.id ? ((r = game.users) == null ? void 0 : r.get(e.id)) ?? e : null;
  const i = e ?? ((a = t == null ? void 0 : t._source) == null ? void 0 : a.author) ?? (t == null ? void 0 : t.userId);
  return i ? ((o = game.users) == null ? void 0 : o.get(i)) ?? null : null;
}
function Oe(t, e) {
  var r;
  const i = oi(t);
  if (i && !i.isGM) return i;
  if (e) {
    const a = (r = game.users) == null ? void 0 : r.find((o) => !o.isGM && Re(e, o.id));
    if (a) return a;
  }
  return i ?? null;
}
function me(t = {}, e, i, r = !1) {
  const a = e === "failure" ? Te() : ie(), o = S(e === "failure" ? m.defaultFailureText : m.defaultText), n = e === "failure" ? t.failure ?? {} : t, c = ri(n.animationStyle), l = c === st ? oe : e === "failure" ? "#ff4d7d" : "#69e8ff", s = Number(n.threshold);
  return {
    kind: e,
    enabled: n.enabled !== !1,
    threshold: Number.isInteger(s) && s >= 1 && s <= tt() ? s : a,
    duration: Lt(n.duration) ?? S(m.duration),
    animationStyle: c,
    imagePath: (r ? i == null ? void 0 : i.img : "") || n.imagePath || (i == null ? void 0 : i.img) || "",
    audioPath: n.audioPath || "",
    overlayText: n.overlayText || o,
    accentColor: n.accentColor || l
  };
}
function Pt(t, e, i = "success") {
  const r = Wt(), a = e ? r[De("actor", e.id)] : null, o = (t == null ? void 0 : t.isGM) === !0, n = o ? r[ii()] : null;
  if (!e && !o && !a)
    return me({ enabled: !1 }, i, e);
  const c = o && !a && !!(e != null && e.img);
  return me(a ?? n ?? {}, i, e, c);
}
function Fe(t, e, i, r, a) {
  return a.enabled ? {
    id: foundry.utils.randomID(),
    messageId: t.id,
    userId: (r == null ? void 0 : r.id) ?? null,
    actorId: (i == null ? void 0 : i.id) ?? null,
    userName: (r == null ? void 0 : r.name) ?? "",
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
    textEnabled: S(m.textEnabled),
    duration: a.duration,
    volume: S(m.volume),
    audience: S(m.audience)
  } : (kt("Cut-in disabled for target.", { userId: r == null ? void 0 : r.id, actorId: i == null ? void 0 : i.id }), null);
}
function ge(t, e, i = "success") {
  const r = Qa(t);
  if (!(t != null && t.isRoll) && !r.length) return null;
  for (const a of r) {
    if (Ne(t, a)) continue;
    const o = ti(a).find((n) => Ae(n, e, i));
    if (o) return o;
  }
  return null;
}
function ye(t, e, i, r = "success") {
  const a = ai(e);
  return !a.length || Ne(t, {}) ? null : a.find((o) => Ae(o, i, r)) ?? null;
}
function ve() {
  var i, r;
  const e = (((i = game.users) == null ? void 0 : i.filter((a) => a.active && a.isGM)) ?? []).sort((a, o) => a.id.localeCompare(o.id))[0];
  return ((r = game.user) == null ? void 0 : r.isGM) && (!e || e.id === game.user.id);
}
function Ft(t) {
  ft.add(t);
  const e = ft.values().next().value;
  ft.size > 200 && e && ft.delete(e);
}
function qe(t) {
  var u, f, d;
  if (!(t != null && t.id) || (f = (u = t.flags) == null ? void 0 : u[C]) != null && f[re] || ft.has(t.id)) return !0;
  const e = Ze(t), i = Oe(t, e), r = Pt(i, e, "success"), a = Pt(i, e, "failure"), o = ge(t, a.threshold, "failure"), n = o ? null : ge(t, r.threshold, "success"), c = o ?? n;
  if (!c) return !1;
  const s = Fe(t, c, e, i, o ? a : r);
  return s ? (Ft(t.id), kt("Triggering cut-in.", s), (d = game.socket) == null || d.emit(qt, { type: "play", payload: s }), mt(s), !0) : (Ft(t.id), !0);
}
function ni(t, e) {
  var f, d, g;
  if (!(t != null && t.id) || (d = (f = t.flags) == null ? void 0 : f[C]) != null && d[re] || ft.has(t.id)) return !0;
  const i = Ze(t), r = Oe(t, i), a = Pt(r, i, "success"), o = Pt(r, i, "failure"), n = ye(t, e, o.threshold, "failure"), c = n ? null : ye(t, e, a.threshold, "success"), l = n ?? c;
  if (!l) return !1;
  const u = Fe(t, l, i, r, n ? o : a);
  return u ? (Ft(t.id), kt("Triggering cut-in from rendered chat card.", u), (g = game.socket) == null || g.emit(qt, { type: "play", payload: u }), mt(u), !0) : (Ft(t.id), !0);
}
function Kt(t, e) {
  t != null && t.id && globalThis.setTimeout(() => {
    var r;
    if (ft.has(t.id)) return;
    const i = ((r = game.messages) == null ? void 0 : r.get(t.id)) ?? t;
    qe(i);
  }, e);
}
function ci() {
  var e;
  ee.clear();
  for (const i of game.messages ?? [])
    i != null && i.id && ee.add(i.id);
  Hooks.on("createChatMessage", (i) => {
    S(m.enabled) && ve() && (qe(i) || (Kt(i, 100), Kt(i, 500), Kt(i, 1500)));
  });
  const t = (i, r) => {
    S(m.enabled) && (Wa(i) || ve() && ni(i, r));
  };
  Hooks.on("renderChatMessage", t), Hooks.on("renderChatMessageHTML", t), (e = game.socket) == null || e.on(qt, (i) => {
    (i == null ? void 0 : i.type) === "play" && S(m.enabled) && mt(i.payload);
  });
}
function He(t, e = {}) {
  var n, c;
  const i = (n = game.users) == null ? void 0 : n.get(t), r = e.actorId ? (c = game.actors) == null ? void 0 : c.get(e.actorId) : (i == null ? void 0 : i.character) ?? null, a = e.triggerKind === "failure" ? "failure" : "success", o = Pt(i, r, a);
  return {
    id: foundry.utils.randomID(),
    userId: t,
    actorId: (r == null ? void 0 : r.id) ?? null,
    userName: (i == null ? void 0 : i.name) ?? "",
    actorName: (r == null ? void 0 : r.name) ?? "",
    naturalResult: e.naturalResult ?? o.threshold,
    triggerKind: a,
    threshold: e.threshold ?? o.threshold ?? ie(),
    animationStyle: e.animationStyle ?? o.animationStyle ?? "strike",
    imagePath: e.imagePath ?? o.imagePath ?? "",
    audioPath: e.audioPath ?? o.audioPath ?? "",
    overlayText: e.overlayText ?? o.overlayText ?? S(m.defaultText),
    accentColor: e.accentColor ?? o.accentColor ?? "#69e8ff",
    textEnabled: e.textEnabled ?? S(m.textEnabled),
    duration: e.duration ?? o.duration,
    volume: e.volume ?? S(m.volume),
    audience: e.audience ?? S(m.audience)
  };
}
function si(t, e = {}) {
  var a, o;
  const i = (a = game.actors) == null ? void 0 : a.get(t), r = ((o = game.users) == null ? void 0 : o.find((n) => !n.isGM && Re(i, n.id))) ?? game.user;
  return He(r == null ? void 0 : r.id, { ...e, actorId: t });
}
function be(t) {
  var e;
  (e = game.socket) == null || e.emit(qt, { type: "play", payload: t }), mt(t);
}
function _e() {
  var t, e, i;
  return ((e = (t = globalThis.foundry) == null ? void 0 : t.applications) == null ? void 0 : e.api) ?? ((i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) ?? null;
}
function ze() {
  var t, e, i;
  return ((e = (t = globalThis.foundry) == null ? void 0 : t.appv1) == null ? void 0 : e.api) ?? ((i = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : i.api) ?? null;
}
function li(t = {}, e = {}) {
  var r, a, o;
  const i = ((a = (r = globalThis.foundry) == null ? void 0 : r.utils) == null ? void 0 : a.mergeObject) ?? ((o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.mergeObject);
  return typeof i == "function" ? i(t, e, { inplace: !1 }) : { ...t, ...e };
}
function di() {
  var t, e, i, r, a;
  return ((i = (e = (t = globalThis.foundry) == null ? void 0 : t.utils) == null ? void 0 : e.randomID) == null ? void 0 : i.call(e, 8)) ?? ((a = (r = foundry == null ? void 0 : foundry.utils) == null ? void 0 : r.randomID) == null ? void 0 : a.call(r, 8)) ?? Math.random().toString(36).slice(2, 10);
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
    constructor(r = {}) {
      const a = li(new.target.defaultOptions ?? {}, r);
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
    activateListeners(r) {
    }
    async _renderHTML(r, a) {
      var s, u, f;
      const o = typeof this.getData == "function" ? await this.getData() : {}, n = ((s = this._v1Options) == null ? void 0 : s.template) ?? ((u = this.options) == null ? void 0 : u.template) ?? ((f = this.constructor.defaultOptions) == null ? void 0 : f.template);
      if (!n) return document.createDocumentFragment();
      const c = await globalThis.renderTemplate(n, o), l = document.createElement("template");
      return l.innerHTML = c.trim(), l.content;
    }
    _activateV1Form(r) {
      var o, n;
      if (typeof this._updateObject != "function") return;
      const a = (o = r.matches) != null && o.call(r, "form") ? r : (n = r.querySelector) == null ? void 0 : n.call(r, "form");
      a instanceof HTMLFormElement && a.addEventListener("submit", async (c) => {
        var s;
        c.preventDefault(), c.stopPropagation();
        const l = new FormData(a);
        await this._updateObject(c, l), ((s = this._v1Options) == null ? void 0 : s.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(r, a, o) {
      var u, f, d, g;
      a.replaceChildren(r);
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
      const s = (f = this._v1Options) == null ? void 0 : f.classes;
      Array.isArray(s) && s.length && (a.classList.add(...s), (g = (d = a.closest) == null ? void 0 : d.call(a, ".window-app, .app, .application")) == null || g.classList.add(...s)), this._activateV1Form(a), typeof this.activateListeners == "function" && this.activateListeners(n ? n(a) : a);
    }
  };
}
function fi() {
  const t = _e(), e = ze(), i = globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication);
  if (i) return i;
  const r = t == null ? void 0 : t.ApplicationV2;
  return r ? Ge(r) : null;
}
function hi() {
  const t = _e(), e = ze(), i = globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1);
  if (i) return i;
  const r = t == null ? void 0 : t.ApplicationV2;
  return r ? Ge(r) : fi();
}
const Et = "icons/svg/mystery-man.svg", pi = hi();
async function mi(t, e, i) {
  var l, s, u, f;
  const { success: r, failure: a } = Ut(t, e), o = `<p>Change to <strong>d${t}</strong> with <strong>${e === "low" ? "low" : "high"} rolls positive</strong>?</p>
    <p>This resets the roll configuration for all ${i} listed character and GM entries, for both outcomes, and the global thresholds:</p>
    <ul><li>Success: <strong>${r}</strong></li><li>Failure: <strong>${a}</strong></li></ul>
    <p>Images, audio, animation, labels, colors, and enabled states stay unchanged. Click Save afterward to apply these changes.</p>`, n = (s = (l = foundry == null ? void 0 : foundry.applications) == null ? void 0 : l.api) == null ? void 0 : s.DialogV2;
  if (n != null && n.confirm)
    return await n.confirm({
      window: { title: "Reset Critical Cut-In Roll Configuration?" },
      content: o,
      modal: !0,
      rejectClose: !1,
      yes: { label: "Change and Reset Rolls" },
      no: { label: "Cancel", default: !0 }
    }) === !0;
  const c = globalThis.Dialog ?? ((f = (u = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : u.api) == null ? void 0 : f.Dialog);
  if (!(c != null && c.confirm)) throw new Error("Foundry confirmation dialog is unavailable.");
  return await c.confirm({ title: "Reset Critical Cut-In Roll Configuration?", content: o, defaultYes: !1, rejectClose: !1 }) === !0;
}
function Be(t, e) {
  return `${t}:${e}`;
}
function gi() {
  return Be("gm", "default");
}
function Xe(t, e) {
  var r, a, o, n;
  const i = ((a = (r = globalThis.CONST) == null ? void 0 : r.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : a.OWNER) ?? 3;
  return Number(((o = e == null ? void 0 : e.ownership) == null ? void 0 : o[t.id]) ?? ((n = e == null ? void 0 : e.ownership) == null ? void 0 : n.default) ?? 0) >= i;
}
function Se(t = {}, { defaultAccent: e = "#69e8ff" } = {}) {
  const i = Number(t.threshold), r = zt(t.animationStyle);
  return {
    enabled: t.enabled !== !1,
    threshold: Number.isInteger(i) && i >= 1 && i <= tt() ? i : "",
    duration: Lt(t.duration),
    animationStyle: r,
    effectDescription: Ot(r).description,
    animationStyles: ne.map((a) => ({ value: a.id, label: a.label, description: a.description, selected: r === a.id })),
    imagePath: String(t.imagePath ?? ""),
    audioPath: String(t.audioPath ?? ""),
    overlayText: String(t.overlayText ?? ""),
    accentColor: String(t.accentColor ?? (r === st ? oe : e))
  };
}
function yi(t = {}) {
  return {
    success: Se(t, { defaultAccent: "#69e8ff" }),
    failure: Se(t.failure, { defaultAccent: "#ff4d7d" })
  };
}
function vi() {
  var i, r, a;
  const t = ((i = game.users) == null ? void 0 : i.find((o) => o.isGM && o.active)) ?? ((r = game.users) == null ? void 0 : r.find((o) => o.isGM)) ?? game.user, e = [{
    key: gi(),
    type: "gm",
    typeLabel: "GM",
    id: "default",
    name: "GM Cut-In",
    portrait: (t == null ? void 0 : t.avatar) || "icons/svg/mystery-man.svg"
  }];
  for (const o of game.actors ?? [])
    (a = game.users) != null && a.some((n) => !n.isGM && Xe(n, o)) && e.push({
      key: Be("actor", o.id),
      type: "actor",
      typeLabel: "Actor",
      id: o.id,
      name: o.name,
      portrait: o.img || "icons/svg/mystery-man.svg"
    });
  return e.sort((o, n) => o.type === "gm" ? -1 : n.type === "gm" ? 1 : o.name.localeCompare(n.name));
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
    const i = Wt(), r = vi(), a = [
      { id: "gm", name: "GM", avatar: r[0].portrait, targets: [r[0]] },
      ...Array.from(game.users ?? []).filter((n) => !n.isGM).map((n) => ({
        id: n.id,
        name: n.name,
        avatar: n.avatar || Et,
        targets: r.filter((c) => c.type === "actor" && Xe(n, game.actors.get(c.id)))
      }))
    ], o = r.map((n) => {
      const c = yi(i[n.key]);
      return {
        ...n,
        ...c,
        actorId: n.type === "actor" ? n.id : "",
        outcomes: [
          { ...c.success, kind: "success", defaultText: S(m.defaultText) },
          { ...c.failure, kind: "failure", defaultText: S(m.defaultFailureText) }
        ]
      };
    });
    return {
      players: a.map((n) => ({
        ...n,
        characterHeading: n.id === "gm" ? "GM Configuration" : `${n.name}’s Characters`,
        tabDetail: n.id === "gm" ? "Global" : `${n.targets.length} ${n.targets.length === 1 ? "character" : "characters"}`
      })),
      featuredStyles: ["strike", "breach", "signal", "rift", st, wt, St, Ct, _t].map(Ot),
      dieSides: tt(),
      dice: Ce(tt()),
      lowRollsGood: Ht(),
      threshold: S(m.threshold) ?? 0,
      failureThreshold: S(m.failureThreshold) ?? 0,
      duration: S(m.duration),
      rows: o
    };
  }
  activateListeners(i) {
    super.activateListeners(i);
    const r = i instanceof HTMLElement ? i : i[0], a = r.matches(".hcci-config") ? r : r.querySelector(".hcci-config"), o = (h) => a.querySelector(h), n = (h) => Array.from(a.querySelectorAll(h));
    o("[data-hcci-action='close']").addEventListener("click", () => this.close()), this.activateWindowDrag(o("[data-hcci-window-drag]"), a.closest(".window-app, .application"));
    const c = n("[data-hcci-player]"), l = n("[data-hcci-characters]"), s = n("[data-hcci-character]"), u = n("[data-hcci-tab]"), f = n("[data-hcci-row]"), d = n("[data-hcci-panel]"), g = o("[data-hcci-workspace]"), p = o("[data-hcci-art]"), v = n("[data-hcci-style]");
    let b, w, A = "success", E = "", L = "";
    const y = (h) => w == null ? void 0 : w.querySelector(`[data-hcci-field="${h}"]`), O = () => {
      if (!b || !w) return;
      const h = y("imagePath").value.trim(), M = b.dataset.hcciPortrait || Et;
      (h !== E || M !== L) && (E = h, L = M, p.src = h || M), p.parentElement.style.setProperty("--hcci-preview-accent", y("accentColor").value), o("[data-hcci-caption]").textContent = y("overlayText").value.trim() || y("overlayText").placeholder;
      const P = Ot(y("animationStyle").value);
      o("[data-hcci-effect-description]").textContent = P.description, v.forEach((I) => I.setAttribute("aria-pressed", String(I.dataset.hcciStyle === P.id)));
    };
    p.addEventListener("error", () => {
      const h = p.getAttribute("src");
      h !== L && h !== Et ? p.src = L : h !== Et && (p.src = Et);
    });
    const R = (h, M) => {
      h.setAttribute("aria-selected", String(M)), h.tabIndex = M ? 0 : -1;
    }, $ = (h, M = this.selectedCharacters.get(h), P) => {
      this.selectedPlayer = h;
      const I = l.find((T) => T.dataset.hcciCharacters === h), D = s.filter((T) => I == null ? void 0 : I.contains(T)), F = D.find((T) => T.dataset.hcciCharacter === M) ?? D[0], z = F == null ? void 0 : F.dataset.hcciCharacter;
      A = P ?? this.activeTabs.get(z) ?? "success", z && (this.selectedCharacters.set(h, z), this.activeTabs.set(z, A)), b = f.find((T) => T.dataset.hcciRow === z), w = b == null ? void 0 : b.querySelector(`[data-hcci-panel="${A}"]`), c.forEach((T) => R(T, T.dataset.hcciPlayer === h)), l.forEach((T) => {
        T.hidden = T !== I;
      }), s.forEach((T) => T.setAttribute("aria-pressed", String(T === F))), u.forEach((T) => R(T, T.dataset.hcciTab === A)), f.forEach((T) => {
        T.hidden = T !== b;
      }), d.forEach((T) => {
        T.hidden = T !== w;
      }), o("#hcci-settings-panel").setAttribute("aria-labelledby", `hcci-${A}-tab`), g.hidden = !b, g.dataset.hcciKind = A, o("[data-hcci-preview-kind]").textContent = A === "failure" ? "Critical Failure" : "Critical Success", O();
    };
    c.forEach((h) => h.addEventListener("click", () => $(h.dataset.hcciPlayer))), s.forEach((h) => h.addEventListener("click", () => $(this.selectedPlayer, h.dataset.hcciCharacter))), u.forEach((h) => h.addEventListener("click", () => $(this.selectedPlayer, void 0, h.dataset.hcciTab)));
    for (const h of [c, u]) for (const [M, P] of h.entries())
      P.addEventListener("keydown", (I) => {
        const D = {
          Home: 0,
          End: h.length - 1,
          ArrowLeft: (M - 1 + h.length) % h.length,
          ArrowRight: (M + 1) % h.length
        }[I.key];
        D !== void 0 && (I.preventDefault(), h[D].focus(), h[D].click());
      });
    v.forEach((h) => h.addEventListener("click", () => {
      const M = y("animationStyle");
      M.value = h.dataset.hcciStyle, M.dispatchEvent(new Event("change", { bubbles: !0 }));
    })), $(c.some((h) => h.dataset.hcciPlayer === this.selectedPlayer) ? this.selectedPlayer : "gm");
    let et = !1;
    a.addEventListener("invalid", (h) => {
      var T, ut, Gt;
      if (et) return;
      et = !0, queueMicrotask(() => {
        et = !1;
      });
      const M = h.target, P = M.closest("details");
      P && (P.open = !0);
      const I = (T = M.closest("[data-hcci-row]")) == null ? void 0 : T.dataset.hcciRow;
      if (!I) return;
      const D = s.filter((Bt) => Bt.dataset.hcciCharacter === I), F = D.find((Bt) => {
        var ce;
        return ((ce = Bt.closest("[data-hcci-characters]")) == null ? void 0 : ce.dataset.hcciCharacters) === this.selectedPlayer;
      }) ?? D[0], z = (ut = F == null ? void 0 : F.closest("[data-hcci-characters]")) == null ? void 0 : ut.dataset.hcciCharacters;
      z && $(z, I, (Gt = M.closest("[data-hcci-panel]")) == null ? void 0 : Gt.dataset.hcciPanel);
    }, !0);
    const at = () => {
      o("[data-hcci-dirty]").hidden = !1;
    }, Y = o('[name="dieSides"]'), K = o('[name="rollDirection"]'), U = o('[name="threshold"]'), _ = o('[name="failureThreshold"]'), it = n('[data-hcci-field="threshold"]'), rt = () => {
      const h = Number(Y.value), M = K.value === "low";
      if (n("[data-hcci-success-label]").forEach((D) => {
        D.textContent = M ? "Success ≤" : "Success ≥";
      }), n("[data-hcci-failure-label]").forEach((D) => {
        D.textContent = M ? "Failure ≥" : "Failure ≤";
      }), !Number.isInteger(h) || h < 2 || h > 1e4) return;
      const P = Number(U.value) || (M ? 1 : h), I = Number(_.value) || (M ? h : 1);
      for (const D of [U, _, ...it]) D.max = String(h);
      for (const D of it)
        D.placeholder = String(D.closest('[data-hcci-panel="success"]') ? P : I);
    };
    rt();
    let H = Number(Y.value), q = K.value;
    const V = () => {
      if (this.rollRuleChange) return;
      const h = Number(Y.value), M = K.value;
      if (h === H && M === q) return;
      const P = [Y, K, o('[type="submit"]')];
      P.forEach((I) => {
        I.disabled = !0;
      }), this.rollRuleChange = (async () => {
        var I, D;
        try {
          if (!await mi(h, M, f.length)) return;
          const { success: F, failure: z } = Ut(h, M);
          U.value = String(F), _.value = String(z);
          for (const T of it)
            T.value = String(T.closest('[data-hcci-panel="success"]') ? F : z);
          H = h, q = M, at();
        } catch (F) {
          console.error(`${C} | Could not confirm dice change.`, F), (D = (I = ui.notifications) == null ? void 0 : I.error) == null || D.call(I, "Could not confirm the dice change. Your roll configuration has not changed.");
        } finally {
          Y.value = String(H), K.value = q, rt(), P.forEach((F) => {
            F.disabled = !1;
          }), this.rollRuleChange = null;
        }
      })();
    };
    Y.addEventListener("change", V), K.addEventListener("change", V);
    for (const h of ["input", "change"]) a.addEventListener(h, (M) => {
      const P = M.target;
      !P.matches("input, select") || P === Y || P === K || (at(), (P === U || P === _) && rt(), w != null && w.contains(P) && O());
    });
    for (const h of n("[data-hcci-browse]")) h.addEventListener("click", () => {
      var F, z, T;
      const M = h.dataset.hcciBrowse, P = y(M);
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
    const lt = o("[data-hcci-test]");
    lt.addEventListener("click", async () => {
      var D, F, z, T, ut;
      if (!((D = game.user) != null && D.isGM) || !b || !w || lt.getAttribute("aria-disabled") === "true") return;
      const h = Ut(H, q), M = A === "failure" ? "failure" : "success", P = M === "failure" ? _.value : U.value, I = y("animationStyle").value;
      lt.setAttribute("aria-disabled", "true");
      try {
        await Ka({
          actorId: b.dataset.hcciActorId || null,
          actorName: b.dataset.hcciActorId ? b.dataset.hcciName : "",
          triggerKind: M,
          naturalResult: h[M],
          threshold: Number((F = y("threshold")) == null ? void 0 : F.value) || Number(P) || h[M],
          animationStyle: I,
          imagePath: y("imagePath").value.trim() || L,
          fallbackImagePath: L,
          audioPath: y("audioPath").value.trim(),
          overlayText: y("overlayText").value.trim() || y("overlayText").placeholder,
          accentColor: y("accentColor").value,
          textEnabled: !["rift", st, wt, St, Ct].includes(I) || S(m.textEnabled) !== !1,
          duration: Lt((z = y("duration")) == null ? void 0 : z.value) ?? Lt(o('[name="duration"]').value) ?? S(m.duration),
          volume: S(m.volume)
        }) || (ut = (T = ui.notifications) == null ? void 0 : T.info) == null || ut.call(T, "A cut-in is already playing.");
      } finally {
        lt.removeAttribute("aria-disabled");
      }
    }), o("[data-hcci-action='reset']").addEventListener("click", async () => {
      var P, I, D;
      const h = (I = (P = foundry == null ? void 0 : foundry.applications) == null ? void 0 : P.api) == null ? void 0 : I.DialogV2;
      (h != null && h.confirm ? await h.confirm({
        window: { title: "Reset All Character Cut-Ins?" },
        content: "<p>This removes every GM and actor override. Global roll and presentation settings stay unchanged.</p>",
        modal: !0,
        rejectClose: !1,
        yes: { label: "Reset Overrides" },
        no: { label: "Cancel", default: !0 }
      }) === !0 : globalThis.confirm("Reset every GM and actor cut-in override?")) && (await se({}), (D = ui.notifications) == null || D.info("Critical Cut-In player configuration reset."), this.render(!1));
    });
  }
  activateWindowDrag(i, r) {
    if (!r) return;
    let a = null;
    i.addEventListener("pointerdown", (o) => {
      var c;
      if (o.button !== 0 || a) return;
      const n = r.getBoundingClientRect();
      (c = this.bringToFront ?? this.bringToTop) == null || c.call(this), i.setPointerCapture(o.pointerId), a = {
        pointerId: o.pointerId,
        offsetX: o.clientX - n.left,
        offsetY: o.clientY - n.top
      }, o.preventDefault();
    }), i.addEventListener("pointermove", (o) => {
      !a || o.pointerId !== a.pointerId || this.setPosition({
        left: Math.max(0, Math.min(window.innerWidth - 48, o.clientX - a.offsetX)),
        top: Math.max(0, Math.min(window.innerHeight - 48, o.clientY - a.offsetY))
      });
    }), i.addEventListener("lostpointercapture", (o) => {
      o.pointerId === (a == null ? void 0 : a.pointerId) && (a = null);
    });
  }
  async _updateObject(i) {
    var f, d, g, p, v, b, w;
    if (!((f = game.user) != null && f.isGM) || this.rollRuleChange) return;
    const r = i.currentTarget;
    if (!r.reportValidity()) return;
    const a = Number(((d = r.querySelector('[name="dieSides"]')) == null ? void 0 : d.value) ?? tt()), o = ((g = r.querySelector('[name="rollDirection"]')) == null ? void 0 : g.value) === "low" ? "low" : "high", n = Wt(), c = (A, E) => {
      var R, $, et, at, Y, K, U, _, it, rt;
      const L = A.querySelector(`[data-hcci-panel="${E}"]`), y = (H) => L == null ? void 0 : L.querySelector(`[data-hcci-field="${H}"]`), O = Lt((R = y("duration")) == null ? void 0 : R.value);
      return {
        ...O === void 0 ? {} : { duration: O },
        enabled: (($ = L == null ? void 0 : L.querySelector('[data-hcci-field="enabled"]')) == null ? void 0 : $.checked) === !0,
        threshold: (() => {
          var q;
          const H = Number((q = y("threshold")) == null ? void 0 : q.value);
          return Number.isInteger(H) && H >= 1 && H <= a ? H : "";
        })(),
        animationStyle: ((et = y("animationStyle")) == null ? void 0 : et.value) || "strike",
        imagePath: ((Y = (at = y("imagePath")) == null ? void 0 : at.value) == null ? void 0 : Y.trim()) ?? "",
        audioPath: ((U = (K = y("audioPath")) == null ? void 0 : K.value) == null ? void 0 : U.trim()) ?? "",
        overlayText: ((it = (_ = y("overlayText")) == null ? void 0 : _.value) == null ? void 0 : it.trim()) ?? "",
        accentColor: ((rt = y("accentColor")) == null ? void 0 : rt.value) || (E === "failure" ? "#ff4d7d" : "#69e8ff")
      };
    };
    for (const A of r.querySelectorAll("[data-hcci-row]")) {
      const E = A.dataset.hcciRow;
      n[E] = c(A, "success"), n[E].failure = c(A, "failure");
    }
    const l = Number(((p = r.querySelector('[name="threshold"]')) == null ? void 0 : p.value) ?? ie()), s = Number(((v = r.querySelector('[name="failureThreshold"]')) == null ? void 0 : v.value) ?? Te()), u = Number(((b = r.querySelector('[name="duration"]')) == null ? void 0 : b.value) ?? S(m.duration));
    await Q(m.dieSides, a), await Q(m.rollDirection, o), await Q(m.threshold, Math.min(a, Math.max(0, l))), await Q(m.failureThreshold, Math.min(a, Math.max(0, s))), await Q(m.duration, Math.min(8e3, Math.max(800, u))), await se(n), (w = ui.notifications) == null || w.info("Critical Cut-In configuration saved."), this.render(!1);
  }
}
function je() {
  var t, e;
  return (t = game.user) != null && t.isGM ? new Ve().render(!0) : ((e = ui.notifications) == null || e.warn("Only the GM can configure Critical Cut-In."), null);
}
function bi() {
  var i, r, a, o;
  const t = (i = game.modules.get("holosuite")) != null && i.active ? (r = game.modules.get("holosuite")) == null ? void 0 : r.api : null, e = (a = game.modules.get("holosuite-core")) != null && a.active ? (o = game.modules.get("holosuite-core")) == null ? void 0 : o.api : null;
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
    enabled: S(m.enabled),
    open: () => je()
  }), t.registerApp({
    brandingInApp: !0,
    id: `${C}-box-of-doom`,
    title: "Box of Doom",
    icon: "fa-solid fa-box",
    premium: !1,
    playerVisible: !1,
    description: "Reveal a high-stakes roll to the whole table.",
    enabled: S(m.enabled),
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
    playCutinForUser(i, r = {}) {
      var o;
      const a = He(i, r);
      return (o = game.user) != null && o.isGM ? be(a) : mt(a), a;
    },
    playCutinForActor(i, r = {}) {
      var o;
      const a = si(i, r);
      return (o = game.user) != null && o.isGM ? be(a) : mt(a), a;
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
  Ke(), ci(), nt(), Hooks.on("userConnected", nt), Ye(), console.log(`${C} | Ready. API available at game.modules.get("${C}").api`);
});
Hooks.on("hotReload", () => {
  Ye();
});
console.log(`${Me} | Loading.`);
