var xa = Object.defineProperty;
var $a = (e, a, r) => a in e ? xa(e, a, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[a] = r;
var ke = (e, a, r) => $a(e, typeof a != "symbol" ? a + "" : a, r);
const Ia = [4, 6, 8, 10, 12, 20, 100];
function Ra(e = 20) {
  var t, o, n;
  const a = Wt(e), r = /* @__PURE__ */ new Set([...Ia, a]), i = ((n = (o = (t = globalThis.CONFIG) == null ? void 0 : t.Dice) == null ? void 0 : o.fulfillment) == null ? void 0 : n.dice) ?? {};
  for (const c of Object.keys(i)) {
    const l = /^d([1-9]\d*)$/i.exec(c);
    if (!l) continue;
    const s = Number(l[1]);
    s >= 2 && s <= 1e4 && r.add(s);
  }
  return [...r].sort((c, l) => c - l).map((c) => ({ value: c, label: `d${c}`, selected: c === a }));
}
function Wt(e) {
  const a = Number(e);
  return Number.isInteger(a) && a >= 2 && a <= 1e4 ? a : 20;
}
function Na(e) {
  return e === "low" ? "low" : "high";
}
const C = "holosuite-critical-cutin", Jt = "HoloSuite Critical Cut-In", Je = `module.${C}`, Da = `modules/${C}/templates/player-config.hbs`, g = {
  enabled: "enabled",
  dieSides: "dieSides",
  diceQuantity: "diceQuantity",
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
  defaultSuccessAudio: "defaultSuccessAudio",
  defaultFailureAudio: "defaultFailureAudio",
  motionMode: "motionMode",
  flashMode: "flashMode",
  effectIntensity: "effectIntensity",
  shakeIntensity: "shakeIntensity",
  localVolume: "localVolume",
  suppressCutins: "suppressCutins",
  debug: "debug",
  playerConfigs: "playerConfigs",
  characterOrder: "characterOrder"
}, ye = {
  everyone: "everyone",
  gm: "gm",
  triggeringPlayer: "triggeringPlayer"
};
function Oa(e) {
  game.settings.register(C, g.effectIntensity, {
    name: "Local Effect Detail",
    hint: "Adjust the particles and glow on this device.",
    scope: "client",
    config: !0,
    type: String,
    default: "standard",
    choices: { low: "Low", standard: "Standard", high: "High" }
  }), game.settings.register(C, g.shakeIntensity, {
    name: "Local Impact Shake",
    hint: "Shake the screen when a cut-in hits. Reduced and still motion turn off shake.",
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
  }), game.settings.register(C, g.diceQuantity, {
    name: "Amount of Dice",
    scope: "world",
    config: !1,
    type: Number,
    default: 1
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
    hint: "0 uses the best natural total. Otherwise success triggers at or above this value for high rolls, or at or below it for low rolls.",
    scope: "world",
    config: !0,
    type: Number,
    default: 0
  }), game.settings.register(C, g.failureThreshold, {
    name: "Default Failure Trigger",
    hint: "0 uses the worst natural total. Otherwise failure triggers at or below this value for high rolls, or at or above it for low rolls.",
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
    hint: "Choose who sees cut-ins.",
    scope: "world",
    config: !0,
    type: String,
    choices: {
      [ye.everyone]: "Everyone",
      [ye.gm]: "GM only",
      [ye.triggeringPlayer]: "Triggering player only"
    },
    default: ye.everyone
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
  }), game.settings.register(C, g.defaultSuccessAudio, {
    name: "Default Success Audio",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  }), game.settings.register(C, g.defaultFailureAudio, {
    name: "Default Failure Audio",
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
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
  }), game.settings.register(C, g.characterOrder, {
    name: "Cut-In Character Order",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.registerMenu(C, "playerConfigMenu", {
    name: "Configure Player Cut-Ins",
    label: "Open Configuration",
    hint: "Set the dice and thresholds, then customize each character's cut-in.",
    icon: "fa-solid fa-bolt",
    type: e,
    restricted: !0
  });
}
function T(e) {
  return game.settings.get(C, e);
}
async function re(e, a) {
  return game.settings.set(C, e, a);
}
function ea(e, a, r) {
  const i = typeof a == "string" ? a.trim() : "";
  if (i) return i;
  const t = e === "failure" ? g.defaultFailureAudio : g.defaultSuccessAudio;
  return r ?? T(t) === !0 ? `modules/${C}/assets/sounds/critical-${e}.ogg` : "";
}
function Ge(e) {
  if (typeof e != "number" && typeof e != "string") return;
  const a = Number(e);
  return Number.isInteger(a) && a >= 800 && a <= 8e3 ? a : void 0;
}
function Ke() {
  return aa(T(g.threshold), "success");
}
function ft() {
  return aa(T(g.failureThreshold), "failure");
}
function xe() {
  return Wt(T(g.dieSides));
}
const ta = Math.floor(Number.MAX_SAFE_INTEGER / 1e4);
function et() {
  const e = Number(T(g.diceQuantity));
  return Number.isInteger(e) && e >= 1 && e <= ta ? e : 1;
}
function Ae(e = xe(), a = et()) {
  return { min: a, max: e * a };
}
function tt() {
  return Na(T(g.rollDirection)) === "low";
}
function aa(e, a) {
  const r = Number(e), { min: i, max: t } = Ae();
  return Number.isInteger(r) && r >= i && r <= t ? r : a === "success" === tt() ? i : t;
}
function $t(e, a, r) {
  return r === "success" === tt() ? e <= a : e >= a;
}
function ht() {
  const e = T(g.playerConfigs);
  return foundry.utils.deepClone(e && typeof e == "object" ? e : {});
}
async function It(e) {
  return re(g.playerConfigs, e && typeof e == "object" ? e : {});
}
function $e(...e) {
  T(g.debug) && console.log(`${C} |`, ...e);
}
const Rt = [1, 0.78, 0.65, 0.5];
function Fa(e) {
  let a = 0;
  for (const r of e.dice) {
    const i = r.results.filter((o) => !o.hidden).length, t = [100, 1e3, 1e4].includes(r.faces) ? Math.log10(r.faces) : 1;
    a += i * t;
  }
  return Rt[Math.min(Rt.length - 1, Math.floor((Math.max(1, a) - 1) / 5))];
}
function qa(e, a) {
  var _, ee, ne, B, Q, U, V, z, j, le, he, pe;
  const r = game.dice3d, i = r == null ? void 0 : r.box, t = (r == null ? void 0 : r.canvas) instanceof HTMLElement ? r.canvas : (_ = r == null ? void 0 : r.canvas) == null ? void 0 : _[0], o = ((ee = i == null ? void 0 : i.display) == null ? void 0 : ee.containerMarginPx) ?? ((ne = i == null ? void 0 : i.display) == null ? void 0 : ne.containerMargin), n = (B = game.users) == null ? void 0 : B.get(a.userId);
  if (!((Q = r == null ? void 0 : r.isEnabled) != null && Q.call(r)) || !r.showForRoll || !(i != null && i.updateBoundaries) || !o || !n || !(t instanceof HTMLElement) || !t.isConnected || !t.parentNode || i.rolling || (V = i.diceList ?? ((U = i.throwEngine) == null ? void 0 : U.diceList)) != null && V.length || (j = i.deadDiceList ?? ((z = i.throwEngine) == null ? void 0 : z.deadDiceList)) != null && j.length || (le = i.persistentDiceList) != null && le.length) return;
  const c = ((he = foundry.dice) == null ? void 0 : he.Roll) ?? globalThis.Roll;
  if (!(c != null && c.fromData)) return;
  const l = t.clientWidth || parseFloat(t.style.width), s = t.clientHeight || parseFloat(t.style.height), u = e.getBoundingClientRect(), f = Math.min(u.width, u.height), d = Math.min(f / Math.SQRT2 - 12, l, s);
  if (!(d >= 80)) return;
  let m;
  try {
    m = c.fromData(a.data);
  } catch (G) {
    console.warn("Glory Roll | Could not read the Dice So Nice roll.", G);
    return;
  }
  const h = { ...o }, v = ((pe = i.diceScene) == null ? void 0 : pe.config) ?? i.config, w = v && Number.isFinite(v.scale) && typeof i.updateScale == "function" ? { scale: v.scale, autoscale: v.autoscale } : null, M = w != null && w.autoscale ? 75 : (w == null ? void 0 : w.scale) ?? 75, P = Math.hypot(d, d) / Math.hypot(l, s), y = Math.min(34, M * 0.5) * P, A = (M + y) / 2 * Fa(m), b = t.parentNode, k = t.nextSibling, I = ["left", "top", "clip-path", "visibility"].map((G) => [G, t.style.getPropertyValue(G), t.style.getPropertyPriority(G)]), R = () => {
    var G;
    for (const [K, me, rt] of I) t.style.setProperty(K, me, rt);
    if (t.classList.remove("hcci-glory-dice-canvas"), t.isConnected && t.parentNode !== b && b.isConnected && b.insertBefore(t, (k == null ? void 0 : k.parentNode) === b ? k : null), ((G = game.dice3d) == null ? void 0 : G.box) === i)
      try {
        i.updateBoundaries({ margin: h }), w && i.updateScale(w.scale, w.autoscale);
      } catch (K) {
        console.warn("Glory Roll | Could not restore the Dice So Nice boundaries.", K);
      }
  };
  let q = !1, se = !1, Y = !1;
  return {
    finished: Promise.resolve().then(async () => {
      var G;
      return Y ? !1 : (b !== document.body && document.body.append(t), t.classList.add("hcci-glory-dice-canvas"), t.style.left = `${u.left + (u.width - l) / 2}px`, t.style.top = `${u.top + (u.height - s) / 2}px`, t.style.clipPath = `circle(${f / 2 - 3}px at 50% 50%)`, i.updateBoundaries({ margin: {
        left: (l - d) / 2,
        right: (l - d) / 2,
        top: (s - d) / 2,
        bottom: (s - d) / 2
      } }), w && (i.updateScale(A, !1), !i.display.containerMarginPx && Number.isFinite(i.display.scale) && ((G = i.dicefactory) != null && G.setScale) && (i.display.scale /= P, i.dicefactory.setScale(i.display.scale))), q = await r.showForRoll(m, n, !1, null, !1) !== !1, q);
    }).catch((G) => (console.warn("Glory Roll | Dice So Nice could not present the roll.", G), !1)).finally(() => {
      se = !0;
    }),
    get complete() {
      return se;
    },
    release() {
      var G;
      Y || (Y = !0, q && ((G = game.dice3d) == null ? void 0 : G.box) === i && !i.rolling && i.clearAll ? (t.style.visibility = "hidden", Promise.resolve().then(() => i.clearAll()).catch((K) => console.warn("Glory Roll | Could not clear the arena dice.", K)).finally(R)) : R());
    }
  };
}
const Mt = "boxOfDoom", Te = "boxOfDoomState", ia = "gloryRollRequest", nt = 850, Za = 7e3, Nt = 2600, Ga = 5200, Ha = 500;
let fe = !1, ct = !1, He = !1, ue, st, ae, Ee, pt = !1;
function ra() {
  var a;
  return (a = Array.from(game.users ?? []).filter((r) => r.isGM && r.active).sort((r, i) => r.id.localeCompare(i.id))[0]) == null ? void 0 : a.id;
}
function ve() {
  var e;
  return ((e = game.user) == null ? void 0 : e.isGM) && (ra() ?? game.user.id) === game.user.id;
}
function ge() {
  const e = T(Te);
  return e != null && e.id && (e.phase !== "revealed" || e.expires > Date.now()) ? e : void 0;
}
function at(e) {
  var a;
  return e.rollerId ?? ra() ?? ((a = game.user) != null && a.isGM ? game.user.id : void 0);
}
function oa(e) {
  return e.target === null ? "" : `Target ${e.low ? "≤" : "≥"} ${e.target}`;
}
function mt(e) {
  return e.formula ?? `1d${e.sides}`;
}
function gt(e) {
  return e.target === null ? "" : (e.low ? e.total <= e.target : e.total >= e.target) ? "Success" : "Failure";
}
function Dt(e) {
  const a = document.createElement("span");
  return a.textContent = e, a.innerHTML;
}
function _a(e, a) {
  const r = [...new Set(e.dice ?? [])].filter((o) => typeof o.expression == "string" && Number.isFinite(o.total));
  if (!r.length) return a;
  const i = (o) => `${o.expression}(${o.total})`, t = e.terms ?? [];
  return r.every((o) => t.includes(o)) && t.every((o) => typeof o.expression == "string") ? t.map((o) => r.includes(o) ? i(o) : o.expression.trim()).join("") : `${a} [${r.map(i).join(", ")}]`;
}
function za(e, a) {
  if (!a || e.dataset.animate !== "true") return;
  const r = document.createElement("div");
  if (r.className = `hcci-glory-effect hcci-glory-effect-${a}`, r.setAttribute("aria-hidden", "true"), a === "success")
    for (const [i, t] of ["top", "right", "bottom", "left"].entries())
      for (let o = 0; o < 12; o++) {
        const n = i * 12 + o, c = document.createElement("i"), l = 28 + n * 17 % 40, s = n * 23 % 39 - 19, u = i === 1 || i === 2 ? -1 : 1, f = i % 2 === 1;
        c.dataset.edge = t, c.style.setProperty("--glory-spawn", `${5 + (o + 0.5) / 12 * 90}%`), c.style.setProperty("--glory-x", `${f ? u * l : s}vw`), c.style.setProperty("--glory-y", `${f ? s : u * l}vh`), c.style.setProperty("--glory-spin", `${u * (130 + n * 83 % 540)}deg`), c.style.setProperty("--glory-delay", `${n * 37 % 235}ms`), c.style.setProperty("--glory-duration", `${820 + n * 53 % 490}ms`), c.style.setProperty("--glory-size", `${4 + n * 5 % 8}px`), r.append(c);
      }
  e.prepend(r);
}
function ce() {
  var w, M, P;
  clearTimeout(st);
  const e = ge(), a = ((w = game.user) == null ? void 0 : w.isGM) === !0, r = ve(), i = e ? at(e) : void 0, t = !!(i && i === ((M = game.user) == null ? void 0 : M.id)), o = t && (e == null ? void 0 : e.phase) === "sealed", n = r || o, c = !a && !t && T(g.suppressCutins) === !0;
  if (!c && (e == null ? void 0 : e.phase) === "revealed" && Ee === e.id && ae && !ae.complete) {
    if (!pt) {
      pt = !0;
      const y = ae;
      na(y.finished).then(() => {
        ae === y && (Ft(), ce());
      });
    }
    return;
  }
  if ((c || (e == null ? void 0 : e.phase) !== "opening" || Ee && Ee !== e.id) && Ft(), !e || c) {
    ue == null || ue.remove(), ue = void 0;
    return;
  }
  const l = e.phase === "opening" ? e.dice : void 0, s = `${e.id}:${e.phase}:${r}:${o}:${He}:${e.phase !== "revealed" && fe}:${!!l}`;
  if ((ue == null ? void 0 : ue.dataset.state) === s) {
    if (e.phase === "revealed") {
      const y = ue.querySelector(".hcci-glory-controls button");
      y && (y.disabled = fe), st = setTimeout(ce, Math.max(1, e.expires - Date.now()));
    }
    return;
  }
  const u = ue, f = n && (!u || u.contains(document.activeElement));
  u == null || u.remove();
  const d = document.createElement("section");
  d.className = "hcci-glory", d.dataset.holosuiteBranding = `${C}-glory-roll`, d.dataset.state = s, d.dataset.phase = e.phase, d.dataset.animate = String((u == null ? void 0 : u.dataset.boxId) !== e.id || u.dataset.phase !== e.phase), d.dataset.boxId = e.id, d.dataset.control = String(n);
  const m = String(T(g.motionMode) ?? "system");
  d.dataset.motion = m, e.phase === "revealed" && (d.dataset.outcome = gt(e).toLowerCase()), d.setAttribute("aria-label", "Glory Roll"), d.innerHTML = `
    <div class="hcci-glory-stage">
      <header class="hcci-glory-heading">
        <h2>Glory Roll</h2>
        <p class="hcci-glory-stakes"></p>
        <p class="hcci-glory-target"></p>
      </header>
      <div class="hcci-glory-arena">
        <div class="hcci-glory-status" role="status" aria-live="polite" aria-atomic="true"></div>
      </div>
      <div class="hcci-glory-controls"></div>
    </div>`, d.querySelector(".hcci-glory-stakes").textContent = e.stakes, d.querySelector(".hcci-glory-target").textContent = [mt(e), oa(e)].filter(Boolean).join(" · ");
  const h = d.querySelector(".hcci-glory-status");
  if (e.phase === "revealed") {
    za(d, d.dataset.outcome);
    const y = h.appendChild(document.createElement("strong"));
    y.textContent = String(e.total);
    const A = h.appendChild(document.createElement("span"));
    A.textContent = gt(e) || "Result", st = setTimeout(ce, Math.max(1, e.expires - Date.now()));
  } else {
    const y = i ? (P = game.users) == null ? void 0 : P.get(i) : null;
    h.textContent = e.phase === "sealed" ? y ? `Ready for ${y.name}` : "Ready" : "Rolling…";
  }
  const v = (y, A, b = !1) => {
    const k = d.querySelector(".hcci-glory-controls").appendChild(document.createElement("button"));
    k.type = "button", k.disabled = b, k.textContent = y, k.addEventListener("click", () => void A().catch(kt));
  };
  if (o && v("Roll & Reveal", () => Ba(e.id), fe || He), r && !fe && e.phase !== "revealed" && v("Cancel", () => Ot(e.id)), r && e.phase === "revealed" && v("Close", () => Ot(e.id), fe), ue = d, document.body.append(d), l && Ee !== e.id && (Ee = e.id, m !== "reduced" && m !== "still" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    const y = qa(d.querySelector(".hcci-glory-arena"), l);
    ae = y, y == null || y.finished.then((A) => {
      !A && ae === y && ue && delete ue.dataset.diceActive;
    });
  }
  ae && (d.dataset.diceActive = "true"), Hooks.callAll("holosuite-core.renderBranding", d), f && (d.tabIndex = -1, (d.querySelector("button:not(:disabled)") ?? d).focus({ preventScroll: !0 }));
}
async function Ba(e) {
  var r;
  const a = ge();
  if (!(He || (a == null ? void 0 : a.id) !== e || a.phase !== "sealed" || at(a) !== ((r = game.user) == null ? void 0 : r.id))) {
    if (ve()) return ca(e);
    He = !0, ce();
    try {
      await game.user.setFlag(C, ia, `${e}:${foundry.utils.randomID()}`);
    } finally {
      He = !1, ce();
    }
  }
}
function kt(e) {
  var a;
  console.error(`${C} | Glory Roll`, e), (a = ui.notifications) == null || a.error("Glory Roll failed. See the browser console for details.");
}
async function Ot(e) {
  var a;
  if (!(!ve() || fe || ((a = ge()) == null ? void 0 : a.id) !== e)) {
    fe = !0, ce();
    try {
      await re(Te, {});
    } finally {
      fe = !1, ce();
    }
  }
}
const De = (e) => new Promise((a) => setTimeout(a, e));
function Ft() {
  ae == null || ae.release(), ae = void 0, Ee = void 0, pt = !1;
}
function na(e) {
  let a;
  const r = new Promise((i) => {
    a = setTimeout(() => i(!1), Za);
  });
  return Promise.race([e, r]).finally(() => clearTimeout(a));
}
async function ca(e) {
  var r, i, t, o, n, c, l;
  const a = ge();
  if (!(!ve() || fe || (a == null ? void 0 : a.id) !== e || a.phase !== "sealed")) {
    fe = !0, ce();
    try {
      const s = ((r = foundry.dice) == null ? void 0 : r.Roll) ?? globalThis.Roll, u = at(a) ?? game.user.id, f = await new s(mt(a)).evaluate({ allowInteractive: !1 }), d = f.total;
      if (!Number.isFinite(d)) throw new Error("Unexpected roll total.");
      const m = (t = (i = game.modules) == null ? void 0 : i.get("dice-so-nice")) != null && t.active && typeof f.toJSON == "function" ? { data: f.toJSON(), userId: u } : void 0;
      if (await re(Te, { ...a, phase: "opening", ...m && { dice: m } }), m)
        if (ce(), ae) {
          const [A] = await Promise.all([na(ae.finished), De(nt)]);
          !A && (ae != null && ae.complete) && await De(Nt - nt);
        } else await De(Nt);
      else await De(nt);
      const h = ge();
      if ((h == null ? void 0 : h.id) !== e || h.phase !== "opening") return;
      const v = { ...a, phase: "revealed", total: d, expires: Date.now() + Ga };
      await re(Te, v), await De(Ha);
      const w = ((n = (o = globalThis.CONFIG) == null ? void 0 : o.ChatMessage) == null ? void 0 : n.documentClass) ?? ((c = foundry.documents) == null ? void 0 : c.ChatMessage) ?? globalThis.ChatMessage, M = (l = game.users) == null ? void 0 : l.get(u), P = !M || u === game.user.id ? w.getSpeaker() : M.character ? w.getSpeaker({ actor: M.character, alias: M.name }) : { alias: M.name }, y = [`${_a(f, mt(a))}: ${d}`, oa(a), gt(v)].filter(Boolean).join(" · ");
      await w.create({
        speaker: P,
        content: `<h3>Glory Roll</h3>${a.stakes ? `<p>${Dt(a.stakes)}</p>` : ""}<p><strong>${Dt(y)}</strong></p>`,
        whisper: [],
        blind: !1,
        flags: { [C]: { [Mt]: e } }
      });
    } catch (s) {
      const u = ge();
      throw ve() && (u == null ? void 0 : u.phase) === "opening" && u.id === e && await re(Te, a), s;
    } finally {
      fe = !1, ce();
    }
  }
}
async function yt() {
  var e, a, r, i, t, o;
  if (!ve()) {
    (e = game.user) != null && e.isGM && ((a = ui.notifications) == null || a.warn("The active GM controls Glory Roll."));
    return;
  }
  if (!(fe || ct || ge())) {
    ct = !0;
    try {
      const n = foundry.applications.api.DialogV2, c = tt(), l = [
        { id: game.user.id, label: `GM (${game.user.name})` },
        ...Array.from(game.users ?? []).filter((d) => !d.isGM).map((d) => ({
          id: d.id,
          label: `${d.name}${d.active ? "" : " (offline)"}`
        }))
      ].map(({ id: d, label: m }) => {
        const h = document.createElement("option");
        return h.value = d, h.textContent = m, h.outerHTML;
      }).join(""), s = await n.prompt({
        window: { title: "Glory Roll" },
        modal: !0,
        rejectClose: !1,
        content: `<div class="hcci-glory-form" data-holosuite-branding="${C}-glory-roll">
        <label>Roller<select name="rollerId">${l}</select></label>
        <label>What’s at stake?<input name="stakes" type="text" maxlength="180" placeholder="Optional"></label>
        <label>Roll formula<input name="formula" type="text" value="1d${xe()}" placeholder="2d6 + 3" autocomplete="off" spellcheck="false" required></label>
        <label>Success target (${c ? "roll at or below" : "roll at or above"})<input name="target" type="number" step="any" placeholder="Optional"></label>
      </div>`,
        ok: {
          label: "Show Arena to Table",
          callback: (d, m) => {
            const h = new FormData(m.form), v = h.get("target");
            return {
              rollerId: String(h.get("rollerId") ?? ""),
              stakes: String(h.get("stakes") ?? "").trim(),
              formula: String(h.get("formula") ?? "").trim(),
              target: v === "" || v == null ? null : Number(v)
            };
          }
        }
      });
      if (!s || !ve() || ge()) return;
      const u = (r = game.users) == null ? void 0 : r.get(s.rollerId);
      if (s.rollerId !== game.user.id && (!u || u.isGM)) return;
      const f = ((i = foundry.dice) == null ? void 0 : i.Roll) ?? globalThis.Roll;
      try {
        if (!s.formula || new f(s.formula).isDeterministic === !0) throw new Error("A die is required.");
      } catch {
        (t = ui.notifications) == null || t.warn("Enter a valid dice formula, such as 2d6 + 3.");
        return;
      }
      if (s.target !== null && !Number.isFinite(s.target)) {
        (o = ui.notifications) == null || o.warn("Enter a numeric success target, or leave it blank.");
        return;
      }
      await re(Te, { ...s, id: foundry.utils.randomID(), phase: "sealed", low: c });
    } catch (n) {
      kt(n);
    } finally {
      ct = !1;
    }
  }
}
function Xa() {
  game.settings.register(C, Te, {
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: ce
  }), Hooks.on("updateUser", (e, a, r, i) => {
    var n, c;
    const t = (c = (n = a.flags) == null ? void 0 : n[C]) == null ? void 0 : c[ia], o = ge();
    (o == null ? void 0 : o.phase) !== "sealed" || typeof t != "string" || !t.startsWith(`${o.id}:`) || !ve() || i !== e.id || at(o) !== e.id || ca(o.id).catch(kt);
  });
}
const Ie = "shattered-fate", sa = [53, 48], Ye = [
  [[49, 34], [43, 25], [41, 0]],
  [[64, 39], [69, 23], [100, 0]],
  [[68, 49], [79, 45], [100, 36]],
  [[66, 58], [81, 65], [100, 76]],
  [[61, 64], [66, 81], [78, 100]],
  [[50, 66], [46, 76], [39, 100]],
  [[41, 60], [29, 70], [0, 100]],
  [[34, 52], [22, 56], [0, 52]],
  [[43, 40], [31, 28], [0, 0]]
], qt = Ye.flatMap(([e, a, r], i) => {
  const [t, o, n] = Ye[(i + 1) % Ye.length], c = [(e[0] + t[0]) / 2 + (i % 2 ? 1.5 : -2), (e[1] + t[1]) / 2 + (i % 3 - 1) * 2];
  return [
    [sa, e, c, t],
    [e, a, r, ...i === 3 ? [[100, 100]] : [], n, o, t, c]
  ];
}), la = (e) => `polygon(${e.map(([a, r]) => `${a}% ${r}%`).join(",")})`, vt = (e) => e.map((a) => a.join(",")).join(" "), lt = [
  [[0, 0], [100, 0]],
  [[0, 16], [21, 23], [37, 15], [58, 29], [72, 20], [100, 26]],
  [[0, 42], [25, 48], [44, 37], [65, 49], [86, 42], [100, 50]],
  [[0, 62], [20, 70], [39, 58], [62, 73], [80, 61], [100, 67]],
  [[0, 83], [17, 88], [39, 77], [59, 91], [77, 79], [100, 89]],
  [[0, 100], [100, 100]]
];
function Va() {
  return `<svg class="hcci-fate-backdrop" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
    <path class="hcci-fate-slashes" d="M0 365 259 206 146 327 350 230 227 367 0 505ZM0 511l244-106L80 520l65-12L0 560Zm1000-407L712 250l104-114-113 44L919 0h81Zm0 390-192 66h-66l98-58-46 6 206-133Z"/>
    <path class="hcci-fate-streaks" d="m0 337 274-179L91 314Zm0 184 327-118L54 520ZM1000 25 733 193 960 25Zm0 215-208 108 208-76ZM675 560l250-124-177 124Z"/>
    <path class="hcci-fate-debris" d="m115 152 35-19-16 38Zm64 311 47-27-27 41Zm623-351 46-25-23 43Zm75 279 49-43-15 51ZM69 437l29-22-11 27Zm864-225 33-19-15 29Z"/>
  </svg><div class="hcci-fate-flash"></div>`;
}
function ja(e) {
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points="${vt(e)}"/></svg>`;
}
function Ya(e) {
  const a = e.querySelector(".hcci-visual"), r = a.querySelector(".hcci-portrait"), i = a.querySelectorAll(".hcci-fate-shard");
  if (i.length) {
    for (const t of i) t.firstElementChild.replaceWith(r.cloneNode(!0));
    return;
  }
  for (const t of qt) {
    const o = document.createElement("div");
    o.className = "hcci-fate-shard", o.style.clipPath = la(t), o.append(r.cloneNode(!0)), o.insertAdjacentHTML("beforeend", ja(t)), a.append(o);
  }
  a.insertAdjacentHTML("beforeend", `<svg class="hcci-fate-cracks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <g class="hcci-fate-branches">${qt.filter((t, o) => o % 2 === 0).map((t) => `<polyline points="${vt(t.slice(1))}"/>`).join("")}</g>
    <g class="hcci-fate-rays">${Ye.map((t) => `<polyline points="${vt([sa, ...t])}"/>`).join("")}</g>
    <path class="hcci-fate-spark" d="m53 45 1 2 3 1-3 1-1 3-1-3-3-1 3-1Z"/>
  </svg>`);
}
const te = { fracture: 250, shatter: 450, impact: 740, settle: 1050 }, Qa = 280, Xe = "steps(1, end)", Ve = "cubic-bezier(.13,.79,.19,1)", Ua = [
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
function Ka(e, a) {
  const r = [];
  if (!e.classList.contains("hcci-motion-full") || !e.animate) return { animations: r, audioDelay: 0 };
  const i = Math.min(1, (a - 140) / te.settle), t = (u, f, d, m, h = "linear") => {
    u && r.push(u.animate(f, {
      delay: d * i,
      duration: (m - d) * i,
      easing: h,
      fill: "both"
    }));
  }, o = (u) => e.querySelector(u);
  t(o(".hcci-visual"), [
    { transform: "translate(-3vw, 2vh) scale(1.09)", opacity: 0.42 },
    { transform: "none", opacity: 1 }
  ], 0, te.fracture, Ve), t(o(".hcci-portrait-frame"), [{ visibility: "visible" }, { visibility: "hidden" }], 0, te.shatter, Xe);
  for (const [u, f] of [[".hcci-fate-rays", 250], [".hcci-fate-branches", 310], [".hcci-fate-spark", 250]])
    t(o(u), [
      { opacity: 0 },
      { opacity: 1, offset: 0.06, easing: Xe },
      { opacity: 0 }
    ], f, te.shatter);
  for (const [u, f] of Array.from(e.querySelectorAll(".hcci-fate-shard")).entries()) {
    const d = u % 2 === 0, [m, h, v] = Ua[Math.floor(u / 2)], w = d ? 40 : 55, M = d ? 33 + u % 3 * 12 : u % 3 * 8;
    t(f, [{ visibility: "hidden" }, { visibility: "visible" }], 0, te.shatter, Xe);
    const P = te.shatter + M, y = d ? 819 : 756;
    t(f, [
      { transform: "none", opacity: 1, easing: Ve },
      { transform: `perspective(850px) translate3d(${m * w * 0.52}vw,${h * w * 0.47}vh,${d ? 96 : -80}px) rotate(${v * 0.53}deg) rotateY(${m * 32}deg)`, opacity: 1, offset: (y - P) / (te.settle - P) },
      { transform: `perspective(850px) translate3d(${m * w}vw,${h * w}vh,${d ? 190 : -145}px) rotate(${v}deg) rotateY(${m * 62}deg)`, opacity: 0 }
    ], P, te.settle);
  }
  t(o(".hcci-copy"), [
    { opacity: 0, transform: "translate(13vw,3vh) rotate(-13deg) scale(1.3)" },
    { opacity: 1, transform: "translate(-1vw,0) rotate(-8deg) scale(1.035)", offset: 0.35, easing: Xe },
    { opacity: 1, transform: "translate(-1vw,0) rotate(-8deg) scale(1.035)", offset: 0.51, easing: Ve },
    { opacity: 1, transform: "rotate(-7deg)" }
  ], te.impact, te.settle, Ve);
  const n = o(".hcci-fate-flash"), c = [54, te.fracture, te.impact], l = te.impact + 50, s = c.flatMap((u, f) => [
    { offset: u / l, opacity: 0 },
    {
      offset: (u + 7) / l,
      opacity: `calc(var(--flash-peak, .14) * ${f === 0 ? 0.55 : 1})`,
      backgroundColor: f === 0 ? "var(--hcci-accent)" : "#fff"
    },
    { offset: (u + 50) / l, opacity: 0 }
  ]);
  return t(n, [{ opacity: 0, offset: 0 }, ...s], 0, l), t(o(".hcci-stage"), [
    { transform: "none" },
    { transform: "translateX(var(--hcci-shake))", offset: 0.2 },
    { transform: "translateX(calc(-.45 * var(--hcci-shake)))", offset: 0.51 },
    { transform: "none" }
  ], te.impact, te.impact + 75), { animations: r, audioDelay: te.shatter * i };
}
function Wa(e, a) {
  var t;
  if (!e.classList.contains("hcci-motion-full") || !e.animate) return [];
  const r = [], i = e.querySelector(".hcci-copy");
  if (Number(getComputedStyle(i).opacity) > 0.8 && ((t = i.textContent) != null && t.trim())) {
    const o = i.parentElement.appendChild(document.createElement("div"));
    o.className = "hcci-fate-exit-pieces";
    for (let n = 0; n < lt.length - 1; n++) {
      const c = i.cloneNode(!0), l = o.appendChild(document.createElement("div"));
      l.style.clipPath = la([...lt[n], ...lt[n + 1].slice().reverse()]), l.append(c), r.push(l.animate([
        { transform: "none", opacity: 1 },
        { transform: `translate(${(n - 2) * 9 + (n % 2 ? 11 : -8)}vw,${7 + n * 6}vh) rotate(${(n - 2) * 12}deg)`, opacity: 0 }
      ], { duration: a - n * 9, delay: n * 9, easing: "cubic-bezier(.55,.04,.89,.54)", fill: "both" }));
    }
    i.style.visibility = "hidden";
  }
  return r.push(e.animate([{ opacity: 1 }, { opacity: 1, offset: 0.61 }, { opacity: 0 }], { duration: a, fill: "both" })), r;
}
const be = "manga-overdrive", Et = "#ec2846";
function Ja(e) {
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
const L = { blackout: 0, ink: 80, silhouette: 180, halftone: 320, impact: 520, hold: 760 }, we = "cubic-bezier(.12,.76,.18,1)", ie = "steps(1, end)", ei = "grayscale(1) brightness(.40) contrast(1.8)", ti = "grayscale(1) contrast(1.55)";
function ai(e, a) {
  const r = [];
  if (!e.classList.contains("hcci-motion-full") || !e.animate) return { animations: r, audioDelay: 0 };
  const i = Math.min(1, (a - 160) / L.hold), t = (n, c, l, s, u = "linear") => {
    for (const f of e.querySelectorAll(n))
      r.push(f.animate(c, { delay: l * i, duration: (s - l) * i, easing: u, fill: "both" }));
  }, o = (n) => n / L.impact;
  return t(".hcci-manga-page", [
    { opacity: 0, transform: "scale(.65)", easing: ie },
    { opacity: 1, transform: "scale(.73)", offset: o(L.ink), easing: we },
    { opacity: 1, transform: "scale(1.03)", offset: o(L.silhouette) },
    { opacity: 1, transform: "scale(1)", offset: o(L.halftone), easing: ie },
    { opacity: 0, transform: "scale(1)" }
  ], L.blackout, L.impact), t(".hcci-manga-panel-glint", [
    { opacity: 0, transform: "scaleX(.1)" },
    { opacity: 1, transform: "scaleX(1)", offset: 0.32, easing: ie },
    { opacity: 0, transform: "scaleX(1)" }
  ], 19, L.ink), t(".hcci-visual", [
    { opacity: 1, transform: "none", easing: ie },
    { opacity: 0, transform: "none", offset: L.ink / L.hold, easing: ie },
    { opacity: 1, transform: "translate(-16vw, 4vh) rotate(-12deg) scale(.84)", offset: L.silhouette / L.hold, easing: we },
    { opacity: 1, transform: "translate(1.2vw,-.6vh) rotate(2deg) scale(.94)", offset: 255 / L.hold },
    { opacity: 1, transform: "scale(.92)", offset: L.halftone / L.hold, easing: we },
    { opacity: 1, transform: "translate(-.3vw,.15vh) scale(.96)", offset: 352 / L.hold, easing: we },
    { opacity: 1, transform: "none", offset: L.impact / L.hold },
    { opacity: 1, transform: "none" }
  ], L.blackout, L.hold), t(".hcci-portrait-frame", [
    { opacity: 0.065, easing: ie },
    { opacity: 1 }
  ], L.blackout, L.silhouette), t(".hcci-manga-artwork", [
    { filter: "brightness(.16)", easing: ie },
    { filter: ei, offset: o(L.silhouette), easing: ie },
    { filter: ti, offset: o(L.halftone), easing: ie },
    { filter: "none" }
  ], L.blackout, L.impact), t(".hcci-manga-reveal-lines", [
    { opacity: 0, easing: ie },
    { opacity: 1 }
  ], L.blackout, L.halftone), t(".hcci-manga-dots", [
    { opacity: 0, easing: ie },
    { opacity: 0.27, offset: o(L.halftone), easing: ie },
    { opacity: 0 }
  ], L.blackout, L.impact), t(".hcci-manga-impact", [
    { opacity: 0, easing: ie },
    { opacity: 1, offset: 0.01, transform: "scale(1.06)", easing: ie },
    { opacity: 1, transform: "scale(1.06)", offset: 0.29, easing: we },
    { opacity: 1, transform: "scale(1)" }
  ], L.impact, L.hold), t(".hcci-copy", [
    { opacity: 0, transform: "translate(12vw, -4vh) rotate(4deg) scale(1.16)" },
    { opacity: 1, transform: "translate(-.8vw, .4vh) rotate(-6deg) scale(1.035)", offset: 0.31, easing: ie },
    { opacity: 1, transform: "translate(-.8vw, .4vh) rotate(-6deg) scale(1.035)", offset: 0.48, easing: we },
    { opacity: 1, transform: "rotate(-4deg)" }
  ], L.impact, L.hold, we), t(".hcci-manga-flash", [
    { opacity: 0 },
    { opacity: "var(--flash-peak, .14)", offset: 0.1 },
    { opacity: 0 }
  ], L.impact, L.impact + 38), t(".hcci-stage", [
    { transform: "none" },
    { transform: "translateX(var(--hcci-shake))", offset: 0.18 },
    { transform: "translateX(calc(-.5 * var(--hcci-shake)))", offset: 0.44 },
    { transform: "none" }
  ], L.impact, L.impact + 66), { animations: r, audioDelay: L.impact * i };
}
function ii(e, a) {
  return !e.classList.contains("hcci-motion-full") || !e.animate ? [] : Array.from(e.querySelectorAll(".hcci-manga-exit"), (r, i) => r.animate([
    { transform: i === 0 ? "translate(-85%, -36%)" : "translate(85%, 36%)", opacity: 1 },
    { transform: i === 0 ? "translate(11%, 7%)" : "translate(-11%, -7%)", opacity: 1 }
  ], { duration: a - i * 17, delay: i * 17, easing: "cubic-bezier(.48,.05,.82,.71)", fill: "both" }));
}
function ri(e) {
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
const W = {
  anticipation: 0,
  slash: 100,
  rupture: 245,
  reveal: 402,
  title: 505,
  hold: 695
}, oi = "cubic-bezier(.68,0,.88,.45)", je = "cubic-bezier(.12,.78,.24,1)", Zt = "cubic-bezier(.15,.78,.18,1)", ni = "cubic-bezier(.62,.02,.86,.45)";
function Oe(e) {
  const a = 91 - 0.74 * e;
  return `polygon(-10% 0, ${e - 12}% 0, ${e - 11}% ${a - 6}%, ${e}% ${a}%, ${e - 12}% ${a + 8}%, ${e - 15}% 100%, -10% 100%) view-box`;
}
function ci(e, a) {
  const r = [];
  if (!e.classList.contains("hcci-motion-full") || !e.animate)
    return { animations: r, audioDelay: 0 };
  const i = Math.min(1, (a - 100) / W.hold), t = (o, n, c, l, s = "linear") => {
    for (const u of e.querySelectorAll(o))
      r.push(u.animate(n, {
        delay: c * i,
        duration: (l - c) * i,
        easing: s,
        fill: "both"
      }));
  };
  return t(".hcci-rift-geometry", [{ opacity: 0.62 }, { opacity: 1 }], W.anticipation, W.slash), t(".hcci-rift-edge, .hcci-rift-edge-light", [{ opacity: 0 }, { opacity: 1 }], W.slash + 82, W.rupture), t(".hcci-rift-upper", [{ transform: "none" }, { transform: "translateY(var(--rift-open-upper))" }], W.rupture, 535, je), t(".hcci-rift-lower", [{ transform: "none" }, { transform: "translateY(var(--rift-open-lower))" }], W.rupture + 18, 585, je), t(".hcci-rift-slash", [
    { clipPath: Oe(1), opacity: 0.28 },
    { clipPath: Oe(13), opacity: 0.65, offset: 0.21, easing: oi },
    { clipPath: Oe(126), opacity: 1, offset: 0.62 },
    { clipPath: Oe(126), opacity: 0.76, offset: 0.72 },
    { clipPath: Oe(126), opacity: 0 }
  ], W.anticipation, 340), t(".hcci-rift-splinters-top", [
    { opacity: 0 },
    { opacity: 1, offset: 0.025 },
    { opacity: 0, transform: "translate(6vw, -16vh) rotate(5deg)" }
  ], W.rupture, 465, je), t(".hcci-rift-splinters-bottom", [
    { opacity: 0 },
    { opacity: 1, offset: 0.025 },
    { opacity: 0, transform: "translate(-4vw, 12vh) rotate(-4deg)" }
  ], W.rupture + 15, 485, je), t(".hcci-visual", [
    { transform: "scale(1.09)", opacity: 0 },
    { transform: "scale(1.04)", opacity: 1, offset: 0.58, easing: "steps(1, end)" },
    { transform: "scale(1.04)", opacity: 1, offset: 0.69 },
    { transform: "none", opacity: 1 }
  ], W.reveal, 625, Zt), t(".hcci-copy", [
    { opacity: 0, transform: "translate(8vw, -3vh) skewX(-12deg)" },
    { opacity: 1, transform: "translate(-1vw, .5vh) skewX(2deg)", offset: 0.6 },
    { opacity: 1, transform: "none" }
  ], W.title, W.hold, Zt), t(".hcci-rift-flash", [
    { opacity: 0 },
    { opacity: "var(--flash-peak, .14)", offset: 0.08 },
    { opacity: 0 }
  ], W.slash + 82, W.rupture + 33), t(".hcci-stage", [
    { transform: "none" },
    { transform: "translateX(var(--hcci-shake))", offset: 0.28 },
    { transform: "translateX(calc(-.5 * var(--hcci-shake)))", offset: 0.58 },
    { transform: "none" }
  ], W.title + 38, 640), { animations: r, audioDelay: W.slash * i };
}
function si(e, a) {
  if (!e.classList.contains("hcci-motion-full") || !e.animate) return [];
  const r = [];
  for (const [i, t] of [
    [".hcci-copy", "translate(75vw, -40vh) skewX(-12deg)"],
    [".hcci-rift-upper", "none"],
    [".hcci-rift-lower", "none"]
  ]) {
    const o = e.querySelector(i);
    o && r.push(o.animate([{ transform: t }], { duration: a, easing: ni, fill: "forwards" }));
  }
  return r;
}
const Re = "reality-override", li = 300, Gt = { cut: 20, flip: 150, impact: 640 }, bt = 5, O = { cut: 20, flip: 150, wind: 520, impact: 640, settle: 820 }, Fe = "cubic-bezier(.14,.82,.2,1)", _e = "steps(1, end)", Ht = [1, -0.7, 0.5, -1, 0.8];
function di(e) {
  const a = e === "low" ? 0 : e === "high" ? 8 : 4;
  return `<div class="hcci-ovr-freeze"></div>
    <div class="hcci-ovr-slab"></div>
    <div class="hcci-ovr-chips">${Array.from({ length: a }, (r, i) => `<i style="--k:${i}"></i>`).join("")}</div>
    <div class="hcci-ovr-flash"></div>`;
}
function fi(e) {
  const a = e.querySelector(".hcci-visual"), r = e.querySelector(".hcci-portrait-frame > .hcci-portrait");
  if (!a || !r) return;
  a.querySelectorAll(".hcci-ovr-echo, .hcci-ovr-panel, .hcci-ovr-cuts, .hcci-ovr-band").forEach((l) => l.remove());
  const i = (l) => {
    const s = r.cloneNode(!0);
    return s.classList.remove("hcci-portrait"), s.classList.add(l), s;
  }, t = (l, s) => {
    const u = document.createElement(l.startsWith("i.") ? "i" : "div");
    return u.className = l.replace(/^i\./, ""), s !== void 0 && u.style.setProperty("--i", String(s)), u;
  }, o = t("hcci-ovr-echo");
  o.append(i("hcci-ovr-echo-art"));
  const n = t("hcci-ovr-panel");
  for (let l = 0; l < bt; l++) {
    const s = t("hcci-ovr-louver", l);
    s.append(i("hcci-ovr-art"), t("i.hcci-ovr-tint"), t("i.hcci-ovr-face"), t("i.hcci-ovr-neg")), n.append(s);
  }
  const c = t("hcci-ovr-cuts");
  for (let l = 0; l <= bt; l++) c.append(t("i.hcci-ovr-cut", l));
  a.append(o, n, c, t("hcci-ovr-band"));
}
function hi(e, a) {
  var A;
  const r = [];
  if (!e.classList.contains("hcci-motion-full") || !e.animate) return { animations: r, audioDelay: 0 };
  const i = Math.min(1, (a - 100) / O.settle), t = (b, k, I, R, q = "linear", se = "both") => {
    b && r.push(b.animate(k, { delay: I * i, duration: Math.max(1, (R - I) * i), easing: q, fill: se }));
  }, o = (b, k, I) => {
    const R = I * i;
    b && a > R && r.push(b.animate(k, { delay: R, duration: a - R, fill: "forwards" }));
  }, n = (b) => e.querySelector(b), c = (b) => Array.from(e.querySelectorAll(b)), l = c(".hcci-ovr-cut"), s = e.clientHeight || 1, u = Math.max(0, (((A = l[0]) == null ? void 0 : A.getBoundingClientRect().width) ?? 3) - 3), f = Math.hypot(u, s), d = u / f, m = -s / f, h = (b) => `rotate3d(${d.toFixed(4)},${m.toFixed(4)},0,${b}deg)`, v = (b) => `translate(${(d * b * s).toFixed(1)}px,${(m * b * s).toFixed(1)}px) scale(1.07)`;
  t(n(".hcci-ovr-freeze"), [{ opacity: 0 }, { opacity: 1 }], 0, 45);
  const w = "polygon(var(--ovr-lean) 0, calc(var(--ovr-lean) + 3px) 0, calc(var(--ovr-lean) + 3px) 0, var(--ovr-lean) 0)", M = "polygon(0 100%, 3px 100%, 3px 100%, 0 100%)", P = "polygon(var(--ovr-lean) 0, calc(var(--ovr-lean) + 3px) 0, 3px 100%, 0 100%)";
  for (const [b, k] of l.entries()) {
    const I = O.cut + b * 14;
    t(k, [{ clipPath: b % 2 ? M : w }, { clipPath: P }], I, I + 95, "cubic-bezier(.7,0,.3,1)"), b > 0 && b < bt && t(k, [{ opacity: 1 }, { opacity: 1 }], 0, O.impact, "linear", "backwards");
  }
  t(n(".hcci-ovr-slab"), [
    { transform: "translate(calc(var(--ovr-lean) * 1.15), -115vh)" },
    { transform: "none" }
  ], O.flip, O.flip + 230, Fe), t(n(".hcci-ovr-echo"), [
    { transform: "translate(calc(var(--ovr-lean) * -1.15), 115vh)" },
    { transform: "none" }
  ], O.flip + 40, O.flip + 300, Fe);
  for (const [b, k] of c(".hcci-ovr-louver").entries()) {
    const I = O.flip + b * 38;
    t(k, [
      { opacity: 0, transform: h(-98) },
      { opacity: 1, transform: h(-98), offset: 0.02 },
      { opacity: 1, transform: h(10), offset: 0.68 },
      { opacity: 1, transform: h(0) }
    ], I, I + 230, Fe), t(k.querySelector(".hcci-ovr-face"), [{ opacity: 1 }, { opacity: 1, offset: 0.42 }, { opacity: 0 }], I, I + 230, "linear", "backwards");
    const R = k.querySelector(".hcci-ovr-art");
    t(R, [
      { transform: v(Ht[b] * 0.055) },
      { transform: v(Ht[b] * 0.024), offset: 0.97, easing: _e },
      { transform: "none" }
    ], I, O.impact, "linear", "backwards"), t(k.querySelector(".hcci-ovr-tint"), [{ opacity: 1 }, { opacity: 1 }], 0, O.impact, "linear", "backwards"), e.classList.contains("hcci-flash-off") || t(k.querySelector(".hcci-ovr-neg"), [{ opacity: 1 }, { opacity: 1 }], O.impact, O.impact + 48, "linear", "none"), o(R, [{ transform: "none" }, { transform: "scale(1.04)" }], O.impact);
  }
  const y = n(".hcci-ovr-band");
  t(y, [
    { clipPath: "inset(49% 100% 49% 0)", backgroundColor: "#fff" },
    { clipPath: "inset(49% 0 49% 0)", backgroundColor: "#fff" }
  ], O.wind, O.impact, "cubic-bezier(.6,0,.9,.4)", "backwards"), t(y, [
    { clipPath: "inset(49% 0 49% 0)", backgroundColor: "#fff" },
    { clipPath: "inset(0 0 0 0)", backgroundColor: "#fff", offset: 0.55 },
    { clipPath: "inset(0 0 0 0)" }
  ], O.impact, O.impact + 110, Fe, "none"), t(n(".hcci-copy"), [{ opacity: 0, easing: _e }, { opacity: 1 }], 0, O.impact + 14), t(n(".hcci-title"), [
    { transform: "skewX(-9deg) scale(1.55)" },
    { transform: "skewX(-9deg) scale(.96)", offset: 0.4, easing: _e },
    { transform: "skewX(-9deg) scale(.96)", offset: 0.62 },
    { transform: "skewX(-9deg)" }
  ], O.impact + 14, O.impact + 150, Fe, "none"), t(n(".hcci-ovr-flash"), [
    { opacity: 0 },
    { opacity: "var(--flash-peak, .14)", offset: 0.1 },
    { opacity: 0 }
  ], O.impact, O.impact + 140), t(n(".hcci-stage"), [
    { transform: "none" },
    { transform: "translate(calc(var(--hcci-shake) * 1.4), calc(var(--hcci-shake) * -.5))", offset: 0.16 },
    { transform: "none" }
  ], O.impact, O.impact + 180, "ease-out", "none");
  for (const [b, k] of c(".hcci-ovr-chips i").entries()) {
    const I = b % 2 ? 1 : -1;
    t(k, [
      { opacity: 1, transform: "rotate(var(--ovr-tilt)) translateX(0)" },
      { opacity: 1, offset: 0.65 },
      { opacity: 0, transform: `rotate(var(--ovr-tilt)) translateX(${I * (34 + b * 5)}vw) rotate(${I * 160}deg)` }
    ], O.impact, O.impact + 300 + b * 12, "cubic-bezier(.1,.7,.3,1)", "none");
  }
  return o(n(".hcci-ovr-echo-art"), [{ transform: "scale(1.45)" }, { transform: "scale(1.45) translateX(-1.6vw)" }], O.flip + 300), o(n(".hcci-ovr-slab"), [{ transform: "none" }, { transform: "translate(calc(var(--ovr-lean) * -.05), 5vh)" }], O.flip + 230), { animations: r, audioDelay: O.cut * i };
}
function pi(e, a) {
  var s;
  if (!e.classList.contains("hcci-motion-full") || !e.animate) return [];
  const r = [], i = (u, f, d, m, h = "cubic-bezier(.6,.02,.9,.5)") => {
    u && r.push(u.animate(f, { delay: d * a, duration: (m - d) * a, easing: h, fill: "forwards" }));
  }, t = (u) => e.querySelector(u);
  i(t(".hcci-copy"), [{ opacity: 0, transform: "rotate(var(--ovr-tilt)) translateX(7vw)" }], 0, 0.28), i(t(".hcci-ovr-band"), [
    { clipPath: "inset(0 0 0 0)" },
    { clipPath: "inset(49% 0 49% 0)", backgroundColor: "#fff", offset: 0.5 },
    { clipPath: "inset(49% 0 49% 100%)", backgroundColor: "#fff" }
  ], 0, 0.6, "linear");
  const o = Array.from(e.querySelectorAll(".hcci-ovr-louver")), n = e.clientHeight || 1, c = Math.max(0, (((s = e.querySelector(".hcci-ovr-cut")) == null ? void 0 : s.getBoundingClientRect().width) ?? 3) - 3), l = Math.hypot(c, n);
  for (const [u, f] of o.entries()) {
    const d = 0.08 + (o.length - 1 - u) * 0.07;
    i(f, [
      { opacity: 1, transform: `rotate3d(${(c / l).toFixed(4)},${(-n / l).toFixed(4)},0,96deg)`, offset: 0.98, easing: _e },
      { opacity: 0, transform: `rotate3d(${(c / l).toFixed(4)},${(-n / l).toFixed(4)},0,96deg)` }
    ], d, d + 0.42);
  }
  for (const u of e.querySelectorAll(".hcci-ovr-cut")) i(u, [{ opacity: 0 }], 0.08, 0.2, _e);
  return i(t(".hcci-ovr-slab"), [{ transform: "translate(calc(var(--ovr-lean) * -1.15), 115vh)" }], 0.12, 0.82), i(t(".hcci-ovr-echo"), [{ transform: "translate(calc(var(--ovr-lean) * 1.15), -115vh)" }], 0.06, 0.76), i(t(".hcci-ovr-freeze"), [{ opacity: 0 }], 0.62, 1, "linear"), r;
}
const Ne = "system-collapse", mi = 420, _t = { fault: 350, freeze: 770, collapse: 880, impact: 1240 }, Le = 12, gi = 0.1, yi = 0.07, $ = { boot: 170, fault: 350, title: 560, freeze: 770, collapse: 880, impact: 1240, settle: 1400 }, de = "steps(1, end)", zt = "cubic-bezier(.14,.82,.2,1)", vi = [
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
], bi = [[560, 590, 3], [706, 730, 6], [752, 770, 9]], wi = [[[350, 384], [706, 734]], [[620, 668], [752, 770]], [[480, 520]]], Si = [
  { drift: [[350, "translate(-.5vw,.4vh)"], [668, "translate(-1.1vw,.2vh) rotate(-3deg)"]], fall: 40, exit: "translate(-4vw,125vh) rotate(-80deg)" },
  { drift: [[560, "translate(.7vw,-.3vh)"], [734, "translate(.9vw,.8vh) rotate(5deg)"]], fall: 150, exit: "translate(5vw,125vh) rotate(95deg)" },
  { drift: [[620, "translate(-.3vw,1vh) rotate(-6deg)"]], fall: 230, exit: "translate(-2vw,60vh) rotate(-50deg)" },
  { drift: [[480, "translate(.4vw,.3vh)"], [706, "translate(1.3vw,.9vh) rotate(8deg)"]], fall: 300, exit: "translate(3vw,60vh) rotate(60deg)" }
];
function Ci(e) {
  const a = e === "low" ? 0 : e === "high" ? 3 : 2;
  return `<div class="hcci-col-freeze"></div>
    <div class="hcci-col-tears">${"<i></i>".repeat(a)}</div>
    <div class="hcci-col-flash"></div>`;
}
function Ai(e, a) {
  const r = e.naturalWidth, i = e.naturalHeight;
  if (!r || !i) return !1;
  try {
    const t = document.createElement("canvas");
    t.width = 80, t.height = Le * 8;
    const o = t.getContext("2d");
    if (!o) return !1;
    const n = Math.min(r, i * 0.8), c = Math.min(i, r / 0.8);
    o.imageSmoothingQuality = "high";
    const l = t.width / n, s = t.height / c;
    o.drawImage(e, (n - r) / 2 * l, (c - i) * 0.25 * s, r * l, i * s);
    for (const [u, f] of a.entries()) {
      const [d, m] = Array.from(f.querySelectorAll("canvas"));
      d.width = 40, d.height = 4;
      const h = d.getContext("2d");
      h.imageSmoothingQuality = "high", h.drawImage(t, 0, u * 8, 80, 8, 0, 0, 40, 4), m.width = 10, m.height = 1;
      const v = m.getContext("2d");
      v.imageSmoothingQuality = "high", v.drawImage(d, 0, 0, 40, 4, 0, 0, 10, 1);
    }
    return !0;
  } catch {
    return !1;
  }
}
function Ti(e, a) {
  var u, f;
  const r = (((u = e.querySelector(".hcci-title")) == null ? void 0 : u.textContent) ?? "").trim().split(/\s+/).filter(Boolean);
  e.style.setProperty("--col-word", String(Math.max(6, ...r.map((d) => d.length)))), e.style.setProperty("--col-lines", String(Math.max(1, r.length)));
  const i = e.querySelector(".hcci-visual"), t = e.querySelector(".hcci-portrait-frame > .hcci-portrait");
  if (!a || !i || !t) return;
  i.querySelectorAll(".hcci-col-backing, .hcci-col-rows, .hcci-col-brackets, .hcci-col-floor, .hcci-col-beam").forEach((d) => d.remove()), (f = e.querySelector(".hcci-col-cursor")) == null || f.remove();
  const o = (d, m) => {
    const h = document.createElement(d);
    return h.className = m, h;
  }, n = o("div", "hcci-col-rows hcci-col-plain"), c = [];
  for (let d = 0; d < Le; d++) {
    const m = o("div", "hcci-col-row");
    m.style.setProperty("--r", String(d));
    const h = o("div", "hcci-col-fall"), v = o("div", "hcci-col-band"), w = t.cloneNode(!0);
    w.classList.remove("hcci-portrait"), w.classList.add("hcci-col-art"), v.append(w, o("canvas", "hcci-col-lod"), o("canvas", "hcci-col-lod"), o("i", "hcci-col-dead")), h.append(v), m.append(h), n.append(m), c.push(m);
  }
  const l = o("div", "hcci-col-brackets");
  l.innerHTML = "<i></i><i></i><i></i><i></i>", i.append(o("div", "hcci-col-backing"), n, l, o("div", "hcci-col-floor"), o("div", "hcci-col-beam"));
  const s = e.querySelector(".hcci-copy");
  if (s != null && s.children.length && s.append(o("i", "hcci-col-cursor")), t instanceof HTMLImageElement) {
    const d = () => n.classList.toggle("hcci-col-plain", !Ai(t, c));
    t.complete && d(), t.addEventListener("load", d, { once: !0 });
  }
}
function Mi(e, a) {
  const r = [];
  if (!e.classList.contains("hcci-motion-full") || !e.animate) return { animations: r, audioDelay: 0 };
  const i = Math.min(1, (a - 100) / $.settle), t = (h, v, w, M, P = "linear", y = "both") => {
    h && r.push(h.animate(v, { delay: w * i, duration: Math.max(1, (M - w) * i), easing: P, fill: y }));
  }, o = (h) => e.querySelector(h), n = (h) => Array.from(e.querySelectorAll(h)), c = (h, v, w = v) => [
    { ...v, offset: 0, easing: de },
    ...h.map(([M, P]) => ({ ...P, offset: M / $.freeze, easing: de })),
    { ...w, offset: 1 }
  ];
  t(o(".hcci-col-freeze"), [{ opacity: 0 }, { opacity: 1 }], 0, $.boot);
  const l = [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }], s = o(".hcci-col-rows");
  t(s, l, 40, $.boot, "steps(6, end)", "backwards"), t(o(".hcci-col-brackets"), [{ opacity: 0, transform: "scale(.9)" }, { opacity: 1, transform: "none" }], 0, 120, zt);
  for (const [h, v] of n(".hcci-col-row").entries()) {
    const w = vi.filter((A) => A[1] === h);
    t(v, c(w.map(([A, , b]) => [A, { transform: `translateX(${b}%)` }]), { transform: "none" }), 0, $.freeze);
    const [M, P] = Array.from(v.querySelectorAll("canvas"));
    t(M, c(w.map(([A, , , b]) => [A, { opacity: b >= 1 ? 1 : 0 }]), { opacity: 0 }, { opacity: 1 }), 0, $.freeze), t(P, c(w.map(([A, , , b]) => [A, { opacity: b === 2 ? 1 : 0 }]), { opacity: 0 }, { opacity: 1 }), 0, $.freeze);
    const y = bi.filter((A) => A[2] === h);
    y.length && t(v.querySelector(".hcci-col-dead"), c(y.flatMap(([A, b]) => [[A, { opacity: 1 }], [b, { opacity: 0 }]]), { opacity: 0 }), 0, $.freeze);
  }
  t(s, c([[706, { transform: "translateY(2.5%)" }], [734, { transform: "none" }]], { transform: "none" }), 0, $.freeze);
  for (const [h, v] of n(".hcci-col-tears i").entries())
    t(v, c(wi[h].flatMap(([w, M]) => [[w, { opacity: 1 }], [M, { opacity: 0 }]]), { opacity: 0 }), 0, $.freeze);
  const u = n(".hcci-col-brackets i");
  for (const [h, v] of u.entries()) {
    const { drift: w, fall: M, exit: P } = Si[h], y = { transform: w[w.length - 1][1] };
    t(v, c(w.map(([A, b]) => [A, { transform: b }]), { transform: "none" }, y), 0, $.freeze), t(v, [y, { transform: P }], $.collapse + M, $.collapse + M + 420, "cubic-bezier(.5,0,1,.6)", "forwards");
  }
  t(o(".hcci-copy"), [
    { opacity: 0, clipPath: "inset(0 0 100% 0)", easing: de },
    { opacity: 1, clipPath: "inset(0 0 66% 0)", offset: 0.34, easing: de },
    { opacity: 1, clipPath: "inset(0 0 33% 0)", offset: 0.67, easing: de },
    { opacity: 1, clipPath: "inset(-30%)" }
  ], $.title, $.title + 90);
  const f = $.impact - $.collapse;
  t(o(".hcci-col-backing"), [{ opacity: 1, easing: de }, { opacity: 0 }], 0, $.collapse);
  for (const [h, v] of n(".hcci-col-row").entries()) {
    const w = Math.sqrt(h / Le), M = Math.sqrt((h + 1) / Le);
    if (t(
      v.querySelector(".hcci-col-band"),
      [{ transform: "none" }, { transform: `scaleY(${yi})` }],
      $.collapse + w * f,
      $.collapse + M * f,
      "ease-in",
      "both"
    ), h === Le - 1) continue;
    const P = `cubic-bezier(.3333,${(2 * M / (1 + M) / 3).toFixed(4)},.6667,${(1 - 2 / (1 + M) / 3).toFixed(4)})`;
    t(v.querySelector(".hcci-col-fall"), [
      { transform: "none" },
      { transform: `translateY(${((Le - 1 - h) * (1 - gi) * 100).toFixed(2)}%)` }
    ], $.collapse + M * f, $.impact, P, "both");
  }
  const d = o(".hcci-portrait-frame");
  t(d, [{ filter: "brightness(.45)" }, { filter: "brightness(.45)" }], 0, $.impact, "linear", "backwards"), t(d, [{ filter: "brightness(1.7)" }, { filter: "brightness(1)" }], $.impact, $.impact + 240, "ease-out", "none"), t(
    o(".hcci-col-floor"),
    [{ transform: "scaleX(0)", opacity: 1 }, { transform: "scaleX(1)", opacity: 1, offset: 0.5 }, { transform: "scaleX(1)", opacity: 0.55 }],
    $.impact,
    $.impact + 280,
    zt
  ), t(o(".hcci-col-flash"), [
    { opacity: 0 },
    { opacity: "var(--flash-peak, .14)", offset: 0.1 },
    { opacity: 0 }
  ], $.impact, $.impact + 160), t(o(".hcci-stage"), [{ transform: "translateY(var(--hcci-shake))" }, { transform: "none" }], $.impact, $.impact + 170, "ease-out", "none"), t(s, [{ transform: "translateY(.5vh)" }, { transform: "none" }], $.impact, $.impact + 90, "ease-out", "none"), t(o(".hcci-copy"), [{ transform: "translateY(1.4vh)" }, { transform: "none" }], $.impact, $.impact + 110, "ease-out", "none");
  const m = $.settle * i;
  if (a > m) {
    const h = o(".hcci-portrait-frame > .hcci-portrait");
    h && r.push(h.animate(
      [{ transform: "none" }, { transform: "scale(1.035)" }],
      { delay: $.impact * i, duration: a - $.impact * i, fill: "forwards" }
    ));
    const v = o(".hcci-col-cursor");
    v && r.push(v.animate([
      { opacity: 1, easing: de },
      { opacity: 0, offset: 0.5, easing: de },
      { opacity: 1 }
    ], { delay: m, duration: 560, iterations: Math.max(1, Math.round((a - m) / 560)), fill: "forwards" }));
  }
  return { animations: r, audioDelay: $.fault * i };
}
function ki(e, a) {
  if (!e.classList.contains("hcci-motion-full") || !e.animate) return [];
  const r = [], i = (o, n, c, l, s = "linear") => {
    o && r.push(o.animate(n, { delay: c * a, duration: (l - c) * a, easing: s, fill: "forwards" }));
  }, t = (o) => e.querySelector(o);
  i(t(".hcci-copy"), [
    { clipPath: "inset(-30% -30% 0 -30%)", easing: de },
    { clipPath: "inset(-30% -30% 34% -30%)", offset: 0.33, easing: de },
    { clipPath: "inset(-30% -30% 67% -30%)", offset: 0.66, easing: de },
    { clipPath: "inset(-30% -30% 100% -30%)", opacity: 0 }
  ], 0, 0.3), i(t(".hcci-col-floor"), [{ transform: "scaleX(0)" }], 0, 0.36, "cubic-bezier(.6,0,.9,.4)");
  for (const o of e.querySelectorAll(".hcci-col-brackets")) i(o, [{ opacity: 0 }], 0, 0.05);
  for (const o of [".hcci-portrait-frame", ".hcci-col-rows", ".hcci-col-backing"])
    i(t(o), [
      { transform: "scaleY(.004)", opacity: 1, offset: 0.97, easing: de },
      { transform: "scaleY(.004)", opacity: 0 }
    ], 0, 0.34, "cubic-bezier(.6,0,.9,.3)");
  return i(t(".hcci-col-beam"), [
    { opacity: 0, transform: "scaleX(.9)" },
    { opacity: 0, transform: "scaleX(.9)", offset: 0.26 },
    { opacity: 1, transform: "scaleX(1)", offset: 0.34 },
    { opacity: 1, transform: "scaleX(2.2)", offset: 0.5, easing: "cubic-bezier(.6,0,.9,.4)" },
    { opacity: 1, transform: "scaleX(.012)", offset: 0.8 },
    { opacity: 1, transform: "scaleX(.012)", offset: 0.88 },
    { opacity: 0, transform: "scaleX(0)" }
  ], 0, 1), i(t(".hcci-col-tears"), [{ opacity: 0 }], 0, 0.05), i(t(".hcci-col-freeze"), [{ opacity: 0 }], 0.6, 1), r;
}
const Lt = "crosshair-sever";
function Ei() {
  return '<div class="hcci-sever-crosshair"><i></i></div><div class="hcci-sever-cut hcci-sever-cut-horizontal"></div><div class="hcci-sever-cut hcci-sever-cut-vertical"></div>';
}
function Li(e, a) {
  const r = e.querySelector(".hcci-visual"), i = r.querySelector(".hcci-portrait-frame .hcci-portrait"), t = r.querySelector(".hcci-sever-pieces");
  if (t) {
    for (const s of t.querySelectorAll(".hcci-portrait")) s.replaceWith(i.cloneNode(!0));
    return;
  }
  const o = document.createElement("div");
  o.className = "hcci-sever-pieces";
  const n = a === "low" ? 2 : a === "high" ? 4 : 3, c = 50 / n, l = (s, u, f, d) => {
    const m = document.createElement("div");
    return m.className = s, m.style.clipPath = `inset(${f}% ${100 - u - d}% ${100 - f - d}% ${u}%)`, m.append(i.cloneNode(!0)), m;
  };
  for (const [s, u] of [[0, 0], [50, 0], [0, 50], [50, 50]]) {
    const f = document.createElement("div");
    f.className = "hcci-sever-quadrant", f.style.setProperty("--qx", s === 0 ? "-1" : "1"), f.style.setProperty("--qy", u === 0 ? "-1" : "1"), f.append(l("hcci-sever-solid", s, u, 50));
    for (let d = 0; d < n; d++)
      for (let m = 0; m < n; m++) {
        const h = d * n + m, v = l("hcci-sever-tile", s + m * c, u + d * c, c);
        v.style.setProperty("--drift-x", String(0.25 + (h * 7 + s) % 13 / 12)), v.style.setProperty("--drift-y", String(0.25 + (h * 11 + u) % 17 / 16)), v.style.setProperty("--lag", String((h * 7 + s + u) % 11)), v.style.setProperty("--spin", `${(h % 5 - 2) * 14}deg`), v.style.transformOrigin = `${s + (m + 0.5) * c}% ${u + (d + 0.5) * c}%`, f.append(v);
      }
    o.append(f);
  }
  r.append(o);
}
const it = [
  { id: "strike", label: "Neon Strike", description: "A slash streaks across the portrait.", shake: 0.7 },
  { id: "breach", label: "Panel Breach", description: "Blast doors open to reveal the portrait.", shake: 0.5 },
  { id: "signal", label: "Signal Bloom", description: "The portrait appears as a hologram.", shake: 0.15 },
  { id: "rift", label: "Rift Slash", description: "The portrait stays inside a jagged tear.", shake: 0.4 },
  { id: "shatter", label: "Quantum Shatter", description: "Shards come together to form the portrait.", shake: 0.65 },
  { id: "reactor", label: "Reactor Surge", description: "A plasma column lights up behind the portrait.", shake: 0.85 },
  { id: "void", label: "Void Collapse", description: "An eclipse closes around the portrait.", shake: 0.4 },
  { id: "railgun", label: "Railgun Salvo", description: "Crosshairs line up before the shot.", shake: 1 },
  { id: "eclipse", label: "Astral Eclipse", description: "Stars and rings frame the portrait.", shake: 0 },
  { id: be, label: "COMIC", description: "An ink splash cuts to a full-color comic panel.", shake: 0.7 },
  { id: Ie, label: "SHATTER", description: "The portrait breaks into pieces and reveals the title.", shake: 0.65 },
  { id: "overdrive", label: "Cyber Overdrive", description: "A data tunnel opens into a hologram.", shake: 0.45 },
  { id: Re, label: "Reality Override", description: "The scene freezes and flips open in strips.", shake: 0.8 },
  { id: Ne, label: "System Collapse", description: "The portrait glitches, falls, and flickers out.", shake: 0.6 },
  { id: Lt, label: "SPLIT", description: "A crosshair locks on and splits the portrait in four.", shake: 0.55 }
];
function Be(e) {
  var a;
  return ((a = it.find((r) => r.id === e)) == null ? void 0 : a.id) ?? "strike";
}
function ua(e) {
  return it.find((a) => a.id === Be(e));
}
const Z = (e, a = 1) => Array.from({ length: a }, (r, i) => `<i class="hcci-fx hcci-fx-${e}" style="--i:${i};--n:${a};--v:${i % 4};--d:${i % 5};--s:${i % 3}"></i>`).join("");
function Pi(e, a = "standard") {
  const r = Be(e), i = a === "low" ? 8 : a === "high" ? 28 : 16, t = Z("particle", i), o = Z("wave", 2);
  switch (r) {
    case "strike":
      return Z("slash", 2) + Z("speed", 7) + o + t;
    case "breach":
      return '<div class="hcci-tear hcci-tear-top"><span></span></div><div class="hcci-tear hcci-tear-bottom"><span></span></div>' + Z("door", 2) + t;
    case "signal":
      return Z("reticle", 3) + Z("tick", 12) + Z("sweep") + o;
    case Ie:
      return Va();
    case be:
      return Ja(a);
    case "rift":
      return ri(a);
    case Re:
      return di(a);
    case Ne:
      return Ci(a);
    case Lt:
      return Ei();
    case "shatter":
      return Z("shard", i) + Z("prism", 2) + o;
    case "reactor":
      return Z("rail", 6) + Z("column") + Z("corona", 2) + t;
    case "void":
      return Z("disk", 2) + Z("horizon") + Z("infall", i) + o;
    case "railgun":
      return Z("sight", 4) + Z("lance") + Z("wake", 7) + t;
    case "eclipse":
      return Z("moon") + Z("crown", 2) + Z("star", i) + Z("orbit", 3);
    case "overdrive":
      return Z("gate", 5) + Z("data", i) + Z("sweep") + o;
  }
}
const Pe = [], qe = /* @__PURE__ */ new Set();
let Qe = !1;
function Ze(e) {
  const a = document.createElement("div");
  return a.textContent = String(e ?? ""), a.innerHTML.replace(/"/g, "&quot;");
}
function xi(e) {
  var r, i, t, o, n;
  if (!e.preview && T(g.suppressCutins) === !0 || e != null && e.blind && !((r = game.user) != null && r.isGM) || Array.isArray(e == null ? void 0 : e.whisper) && e.whisper.length && !e.whisper.includes((i = game.user) == null ? void 0 : i.id) && !((t = game.user) != null && t.isGM))
    return !1;
  const a = (e == null ? void 0 : e.audience) ?? T(g.audience);
  return a === ye.everyone ? !0 : a === ye.gm ? ((o = game.user) == null ? void 0 : o.isGM) === !0 : a === ye.triggeringPlayer ? ((n = game.user) == null ? void 0 : n.id) === (e == null ? void 0 : e.userId) : !0;
}
async function $i(e, a) {
  var r, i;
  if (e)
    try {
      const t = Math.min(1, Math.max(0, Number(a ?? T(g.volume) ?? 0.8))), o = Math.min(1, Math.max(0, Number(T(g.localVolume) ?? 1))), n = t * o;
      if ((i = (r = foundry.audio) == null ? void 0 : r.AudioHelper) != null && i.play)
        return foundry.audio.AudioHelper.play({ src: e, volume: n, autoplay: !0, loop: !1 }, !1);
      const c = globalThis.AudioHelper;
      if (c != null && c.play)
        return c.play({ src: e, volume: n, autoplay: !0, loop: !1 }, !1);
      const l = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), s = new Audio(e);
      return s.volume = n * l, await s.play(), s;
    } catch (t) {
      return $e("Audio playback failed.", { src: e, error: t }), null;
    }
}
function ut(e) {
  try {
    if (!e) return;
    if (typeof e.stop == "function") {
      e.stop();
      return;
    }
    typeof e.pause == "function" && (e.pause(), e.currentTime = 0);
  } catch (a) {
    $e("Audio stop failed.", a);
  }
}
function Ii(e) {
  var Q, U;
  const a = ua(e.animationStyle), r = a.id, i = e.triggerKind === "failure" ? "failure" : "success", t = r === "rift", o = r === be, n = r === Ie, c = r === Re, l = r === Ne, s = t || o || n || c || l, u = e.accentColor || (o ? Et : (t || n || c || l) && i === "failure" ? "#ff4d7d" : "#69e8ff"), f = e.imagePath ? `<img class="hcci-portrait" src="${Ze(e.imagePath)}" alt="">` : '<div class="hcci-portrait hcci-portrait-fallback"><i class="fa-solid fa-user-astronaut"></i></div>', d = Math.max(1, String(e.overlayText ?? "").length), m = String(e.overlayText ?? "").trim().split(/\s+/), h = n ? `; --hcci-title-longest-word: ${Math.max(1, ...m.map((V) => V.length))}` : "", v = n && m.length > 1 ? `${Ze(m.slice(0, -1).join(" "))} <span>${Ze(m.at(-1))}</span>` : Ze(e.overlayText), w = e.textEnabled && e.overlayText ? `<div class="hcci-title" style="--hcci-title-chars: ${d}${h}">${v}</div>` : "", M = e.actorName || "", P = String(T(g.motionMode) ?? "system"), y = ((U = (Q = globalThis.matchMedia) == null ? void 0 : Q.call(globalThis, "(prefers-reduced-motion: reduce)")) == null ? void 0 : U.matches) === !0, A = P === "system" || s && y && P === "full" ? y ? "reduced" : "full" : ["full", "reduced", "still"].includes(P) ? P : "full", b = String(T(g.flashMode) ?? "soft"), k = ["full", "soft", "off"].includes(b) ? b : "soft", I = T(g.effectIntensity), R = ["low", "standard", "high"].includes(I) ? I : "standard", q = document.createElement("div");
  q.className = `hcci-overlay hcci-style-${r} hcci-kind-${i} hcci-motion-${A} hcci-flash-${k} hcci-detail-${R}`, q.style.setProperty("--hcci-accent", u);
  const se = T(g.animationFont);
  q.style.setProperty("--hcci-font", se === "classic" ? '"Orbitron", "Eurostile", "Agency FB", Impact, sans-serif' : '"HCCI AICON", "Orbitron", sans-serif');
  const Y = Number(T(g.shakeIntensity) ?? 0.5), J = A === "full" && !y ? Number.isFinite(Y) ? Math.max(0, Math.min(1, Y)) : 0.5 : 0;
  q.style.setProperty("--hcci-shake", `${a.shake * J * 9}px`), q.style.setProperty("--hcci-screen-impact", `${(0.55 + 0.45 * a.shake) * J * 18}px`), q.setAttribute("aria-hidden", "true");
  const _ = A === "full" || o || t ? Pi(r, R) : "";
  q.innerHTML = `
    ${o || n || c || l ? "" : `<div class="${t ? "hcci-rift-flash" : "hcci-flash"}"></div>`}
    ${s && !t ? _ : ""}
    <div class="hcci-atmosphere"></div>
    <section class="hcci-stage">
      <div class="hcci-visual">
      <div class="hcci-effects">${s ? "" : _}</div>
      <div class="hcci-portrait-frame">
        ${o ? `<div class="hcci-manga-artwork">${f}</div><div class="hcci-manga-dots"></div>` : f}
      </div>
      ${o ? '<div class="hcci-manga-panel-glint"></div>' : ""}
      <div class="hcci-frame-accent"></div>
      </div>
      ${t ? _ : ""}
      <div class="hcci-copy">
        ${w}
        ${M ? `<div class="hcci-subtitle">${Ze(M)}</div>` : ""}
      </div>
    </section>
  `;
  const ee = n && A === "full", ne = () => {
    ee && Ya(q), c && A === "full" && fi(q), l && Ti(q, A === "full"), r === Lt && A === "full" && Li(q, R);
  };
  ne();
  const B = q.querySelector("img.hcci-portrait");
  if (B && A === "full" && (r === "shatter" || r === "overdrive")) {
    const V = [
      "polygon(0 0,50% 0,50% 50%)",
      "polygon(50% 0,100% 0,50% 50%)",
      "polygon(100% 0,100% 100%,50% 50%)",
      "polygon(100% 100%,50% 100%,50% 50%)",
      "polygon(50% 100%,0 100%,50% 50%)",
      "polygon(0 100%,0 0,50% 50%)"
    ];
    for (let z = 0; z < 6; z++) {
      const j = document.createElement("div");
      j.className = "hcci-portrait-echo", j.style.setProperty("--piece", String(z)), j.style.setProperty("--dx", `${z % 2 ? 1 : -1}`), j.style.setProperty("--dy", `${z < 3 ? -1 : 1}`), j.style.clipPath = r === "shatter" ? V[z] : `inset(${z * 100 / 6}% 0 ${100 - (z + 1) * 100 / 6}% 0)`;
      const le = B.cloneNode();
      le.className = "", j.appendChild(le), q.querySelector(".hcci-visual").appendChild(j);
    }
  }
  return B == null || B.addEventListener("error", () => {
    const V = e.preview ? e.fallbackImagePath : void 0;
    if (V && B.getAttribute("src") !== V) {
      B.src = V, q.querySelectorAll(".hcci-portrait-echo img").forEach((j) => {
        j.src = V;
      }), ne();
      return;
    }
    q.querySelectorAll(".hcci-portrait-echo").forEach((j) => j.remove());
    const z = document.createElement("div");
    z.className = "hcci-portrait hcci-portrait-fallback", z.innerHTML = '<i class="fa-solid fa-user-astronaut"></i>', B.replaceWith(z), ne();
  }), q;
}
function Ri(e, a, r) {
  switch (a) {
    case Re:
      return hi(e, r);
    case Ne:
      return Mi(e, r);
    case Ie:
      return Ka(e, r);
    case be:
      return ai(e, r);
    case "rift":
      return ci(e, r);
  }
}
function Ni(e, a) {
  const r = Number.parseFloat(e.style.getPropertyValue("--hcci-screen-impact"));
  if (!(r > 0) || !e.animate) return [];
  const i = Array.from(document.querySelectorAll("#board, #interface, #ui, #ui-top, #ui-left, #ui-right, #ui-bottom, #hud")), t = i.filter((c) => !i.some((l) => l !== c && l.contains(c)));
  t.push(e.querySelector(".hcci-stage"));
  const n = [[0, 0], [1, -0.48], [-0.7, 0.3], [0.37, 0.1], [-0.2, -0.1], [0, 0]].map(([c, l]) => ({ translate: `${c * r}px ${l * r}px` }));
  return t.map((c) => c.animate(n, { id: "hcci-screen-impact", delay: a, duration: 240 }));
}
async function Di(e) {
  if (!xi(e)) return;
  const a = Number(e.duration ?? T(g.duration) ?? 2500), r = Math.min(8e3, Math.max(800, Number.isFinite(a) ? a : 2500)), i = Ii(e);
  i.style.setProperty("--hcci-duration", `${r}ms`);
  const t = Math.min(1e3, (r - 180) * 0.85);
  i.style.setProperty("--hcci-intro", `${t}ms`);
  let o = !1, n, c, l, s = [], u = [], f;
  try {
    document.body.appendChild(i);
    const d = i.classList.contains(`hcci-style-${Ie}`), m = i.classList.contains(`hcci-style-${Re}`), h = i.classList.contains(`hcci-style-${Ne}`), v = d ? Qa : m ? li : h ? mi : 180, w = r - v, M = i.classList.contains("hcci-style-rift"), P = i.classList.contains(`hcci-style-${be}`), y = Ri(i, ua(e.animationStyle).id, w);
    y && (s = y.animations);
    const A = m ? ((y == null ? void 0 : y.audioDelay) ?? 0) * Gt.impact / Gt.cut : h ? ((y == null ? void 0 : y.audioDelay) ?? 0) * _t.impact / _t.fault : (y == null ? void 0 : y.audioDelay) || t * 0.32;
    u = Ni(i, Math.min(A, w - 100));
    const b = () => {
      $i(e.audioPath, e.volume).then((k) => {
        o ? ut(k) : n = k;
      });
    };
    e.audioPath && (y != null && y.audioDelay) ? l = window.setTimeout(b, y.audioDelay) : b(), await new Promise((k) => {
      c = window.setTimeout(I, w);
      function I() {
        window.clearTimeout(c), globalThis.removeEventListener("keydown", f), k();
      }
      f = (R) => {
        R.key === "Escape" && I();
      }, globalThis.addEventListener("keydown", f);
    }), o = !0, u.forEach((k) => k.cancel()), window.clearTimeout(l), ut(n), n = null, i.classList.add("hcci-exiting"), m ? s.push(...pi(i, v)) : h ? s.push(...ki(i, v)) : d ? s.push(...Wa(i, v)) : P ? s.push(...ii(i, v)) : M && s.push(...si(i, v)), await new Promise((k) => window.setTimeout(k, v));
  } finally {
    o = !0, window.clearTimeout(c), window.clearTimeout(l), s.forEach((d) => d.cancel()), u.forEach((d) => d.cancel()), f && globalThis.removeEventListener("keydown", f), ut(n), i.remove();
  }
}
async function Oi(e) {
  var a, r;
  return !((a = game.user) != null && a.isGM) || Qe ? !1 : (await Me({
    ...e,
    id: foundry.utils.randomID(),
    userId: ((r = game.user) == null ? void 0 : r.id) ?? null,
    audience: ye.gm,
    preview: !0
  }), !0);
}
async function Fi() {
  if (!Qe) {
    Qe = !0;
    try {
      for (; Pe.length; ) {
        const e = Pe.shift();
        try {
          await Di(e);
        } catch (a) {
          $e("Cut-in playback failed; continuing queue.", a);
        }
      }
    } finally {
      Qe = !1;
    }
  }
}
function Me(e) {
  if (e) {
    if (e.id) {
      if (qe.has(e.id)) return;
      qe.add(e.id);
      const a = qe.values().next().value;
      qe.size > 100 && a && qe.delete(a);
    }
    return Pe.push(e), Pe.length > 3 && Pe.splice(1, Pe.length - 3), Fi();
  }
}
const Ce = /* @__PURE__ */ new Set(), wt = /* @__PURE__ */ new Set();
function qi(e) {
  return !!(e != null && e.id) && wt.has(e.id);
}
function oe(e) {
  return e ? Array.isArray(e) ? e : [e] : [];
}
function da(e) {
  var i, t, o, n;
  const a = [
    ...oe(e == null ? void 0 : e.rolls),
    ...oe(e == null ? void 0 : e.roll),
    ...oe(e == null ? void 0 : e._rolls),
    ...oe((t = (i = e == null ? void 0 : e.flags) == null ? void 0 : i.dnd5e) == null ? void 0 : t.roll),
    ...oe((n = (o = e == null ? void 0 : e.flags) == null ? void 0 : o.dnd5e) == null ? void 0 : n.rolls)
  ], r = /* @__PURE__ */ new Set();
  return a.filter((c) => !c || r.has(c) ? !1 : (r.add(c), !0));
}
function St(e) {
  const a = [], r = [...oe(e == null ? void 0 : e.terms), ...oe(e == null ? void 0 : e.dice), ...oe(e == null ? void 0 : e._terms), ...oe(e == null ? void 0 : e._dice)], i = /* @__PURE__ */ new Set();
  for (; r.length; ) {
    const t = r.shift();
    !t || i.has(t) || (i.add(t), a.push(t), r.push(
      ...oe(t.terms),
      ...oe(t.dice),
      ...oe(t.rolls),
      ...t.roll && typeof t.roll == "object" ? [t.roll] : [],
      ...oe(t._terms),
      ...oe(t._dice)
    ));
  }
  return a;
}
function Ct(e, a) {
  var o, n, c, l, s, u, f, d;
  const r = (e == null ? void 0 : e.flags) ?? {}, i = ((n = (o = r.dnd5e) == null ? void 0 : o.roll) == null ? void 0 : n.type) ?? ((l = (c = r.dnd5e) == null ? void 0 : c.roll) == null ? void 0 : l.rollType), t = (u = (s = r.pf2e) == null ? void 0 : s.context) == null ? void 0 : u.type;
  return [(f = a == null ? void 0 : a.options) == null ? void 0 : f.type, (d = a == null ? void 0 : a.options) == null ? void 0 : d.rollType, i, t].some((m) => String(m ?? "").toLowerCase().includes("damage"));
}
function Bt(e) {
  return (e == null ? void 0 : e.active) === !1 || (e == null ? void 0 : e.discarded) === !0 || (e == null ? void 0 : e.rerolled) === !0;
}
function Zi(e, a) {
  const r = [], i = xe(), t = St(e), o = /* @__PURE__ */ new Set();
  if (a) {
    for (const n of t)
      if (!(!Array.isArray(n.rolls) || !Array.isArray(n.results))) {
        for (const [c, l] of n.rolls.entries())
          if (Bt(n.results[c]))
            for (const s of St(l)) o.add(s);
      }
  }
  for (const n of t) {
    const c = Number((n == null ? void 0 : n.faces) ?? (n == null ? void 0 : n._faces));
    if (!(c !== i || o.has(n) || !Array.isArray(n.results)))
      for (const l of n.results) {
        if (!l || Bt(l)) continue;
        const s = Number(l.result ?? l.value ?? l.total);
        Number.isInteger(s) && s >= 1 && s <= c && r.push(s);
      }
  }
  return r;
}
function Gi(e) {
  return e ? e instanceof HTMLElement ? e : e[0] instanceof HTMLElement ? e[0] : null : null;
}
function Xt(e) {
  var n;
  const a = [], r = xe(), i = `d${r}`, t = [
    `.dice-rolls .roll.${i}`,
    `.dice-rolls .roll.die.${i}`,
    `.dice-tooltip .roll.${i}`,
    `.dice-tooltip .dice.${i} .roll`
  ], o = /* @__PURE__ */ new Set();
  for (const c of t)
    e.querySelectorAll(c).forEach((l) => o.add(l));
  for (const c of o) {
    if (c.classList.contains("discarded") || c.classList.contains("rerolled") || c.classList.contains("ignored") || c.classList.contains("inactive"))
      continue;
    const l = Number((n = c.textContent) == null ? void 0 : n.trim());
    Number.isInteger(l) && l >= 1 && l <= r && a.push(l);
  }
  return a;
}
function fa(e, a) {
  return `${e}:${a}`;
}
function Hi() {
  return fa("gm", "default");
}
function _i(e) {
  return Be(e);
}
function ha(e, a) {
  var i, t, o, n;
  if (!e || !a) return !1;
  const r = ((t = (i = globalThis.CONST) == null ? void 0 : i.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : t.OWNER) ?? 3;
  return Number(((o = e.ownership) == null ? void 0 : o[a]) ?? ((n = e.ownership) == null ? void 0 : n.default) ?? 0) >= r;
}
function pa(e) {
  var t, o, n;
  const { scene: a, token: r } = (e == null ? void 0 : e.speaker) ?? {};
  if (!r) return null;
  const i = a ? (t = game.scenes) == null ? void 0 : t.get(a) : (o = globalThis.canvas) == null ? void 0 : o.scene;
  return ((n = i == null ? void 0 : i.tokens) == null ? void 0 : n.get(r)) ?? null;
}
function ma(e, a) {
  var i;
  const r = (e == null ? void 0 : e.speaker) ?? {};
  return (r.actor ? (i = game.actors) == null ? void 0 : i.get(r.actor) : null) ?? (a == null ? void 0 : a.actor) ?? (e == null ? void 0 : e.actor) ?? null;
}
function zi(e) {
  var i, t, o;
  const a = (e == null ? void 0 : e.author) ?? (e == null ? void 0 : e.user);
  if (a && typeof a == "object") return a.id ? ((i = game.users) == null ? void 0 : i.get(a.id)) ?? a : null;
  const r = a ?? ((t = e == null ? void 0 : e._source) == null ? void 0 : t.author) ?? (e == null ? void 0 : e.userId);
  return r ? ((o = game.users) == null ? void 0 : o.get(r)) ?? null : null;
}
function ga(e, a) {
  var i;
  const r = zi(e);
  if (r && !r.isGM) return r;
  if (a) {
    const t = (i = game.users) == null ? void 0 : i.find((o) => !o.isGM && ha(a, o.id));
    if (t) return t;
  }
  return r ?? null;
}
function Vt(e = {}, a, r, i = "") {
  const t = a === "failure" ? ft() : Ke(), o = T(a === "failure" ? g.defaultFailureText : g.defaultText), n = a === "failure" ? e.failure ?? {} : e, c = _i(n.animationStyle), l = c === be ? Et : a === "failure" ? "#ff4d7d" : "#69e8ff", s = Number(n.threshold), { min: u, max: f } = Ae();
  return {
    kind: a,
    enabled: n.enabled !== !1,
    threshold: Number.isInteger(s) && s >= u && s <= f ? s : t,
    duration: Ge(n.duration) ?? T(g.duration),
    animationStyle: c,
    imagePath: i || n.imagePath || (r == null ? void 0 : r.img) || "",
    audioPath: ea(a, n.audioPath),
    overlayText: n.overlayText || o,
    accentColor: n.accentColor || l
  };
}
function ze(e, a, r, i) {
  var s;
  const t = ht(), o = a ? t[fa("actor", a.id)] : null, n = (e == null ? void 0 : e.isGM) === !0, c = n ? t[Hi()] : null;
  if (!a && !n && !o)
    return Vt({ enabled: !1 }, r, a);
  const l = n && !o && (c == null ? void 0 : c.useTokenPortrait) !== !1 ? ((s = i == null ? void 0 : i.texture) == null ? void 0 : s.src) || (a == null ? void 0 : a.img) : "";
  return Vt(o ?? c ?? {}, r, a, l);
}
function ya(e, a, r, i, t) {
  return t.enabled ? {
    id: foundry.utils.randomID(),
    messageId: e.id,
    userId: (i == null ? void 0 : i.id) ?? null,
    actorId: (r == null ? void 0 : r.id) ?? null,
    userName: (i == null ? void 0 : i.name) ?? "",
    actorName: (r == null ? void 0 : r.name) ?? "",
    triggerKind: t.kind ?? "success",
    naturalResult: a,
    threshold: t.threshold,
    animationStyle: t.animationStyle,
    blind: e.blind === !0,
    whisper: Array.isArray(e.whisper) ? [...e.whisper] : [],
    imagePath: t.imagePath || "",
    audioPath: t.audioPath || "",
    overlayText: t.overlayText || "",
    accentColor: t.accentColor || "#69e8ff",
    textEnabled: T(g.textEnabled),
    duration: t.duration,
    volume: T(g.volume),
    audience: T(g.audience)
  } : ($e("Cut-in disabled for target.", { userId: i == null ? void 0 : i.id, actorId: r == null ? void 0 : r.id }), null);
}
function At(e, a, r, i) {
  if (a === 1) return e.find((o) => $t(o, r, i)) ?? null;
  if (e.length !== a) return null;
  const t = e.reduce((o, n) => o + n, 0);
  return $t(t, r, i) ? t : null;
}
function Tt(e, a, r = "success") {
  const i = da(e);
  if (!(e != null && e.isRoll) && !i.length) return null;
  const t = et();
  for (const o of i) {
    if (Ct(e, o)) continue;
    const n = At(Zi(o, t > 1), t, a, r);
    if (n !== null) return n;
  }
  return null;
}
function jt(e, a, r, i = "success") {
  const t = Gi(a);
  if (!t || Ct(e, {})) return null;
  const o = et();
  if (o === 1) return At(Xt(t), o, r, i);
  const n = da(e);
  if (n.some((l) => St(l).some((s) => {
    var u;
    return (u = s.results) == null ? void 0 : u.length;
  })))
    return Tt(e, r, i);
  if (n.some((l) => Ct(e, l))) return null;
  const c = Array.from(t.querySelectorAll(".dice-roll")).filter((l) => !l.querySelector(".dice-roll"));
  if (!c.length && n.length > 1 && !t.matches(".dice-roll")) return null;
  for (const l of c.length ? c : [t]) {
    const s = At(Xt(l), o, r, i);
    if (s !== null) return s;
  }
  return null;
}
function Yt() {
  var r, i;
  const a = (((r = game.users) == null ? void 0 : r.filter((t) => t.active && t.isGM)) ?? []).sort((t, o) => t.id.localeCompare(o.id))[0];
  return ((i = game.user) == null ? void 0 : i.isGM) && (!a || a.id === game.user.id);
}
function We(e) {
  Ce.add(e);
  const a = Ce.values().next().value;
  Ce.size > 200 && a && Ce.delete(a);
}
function va(e) {
  var f, d, m;
  if (!(e != null && e.id) || (d = (f = e.flags) == null ? void 0 : f[C]) != null && d[Mt] || Ce.has(e.id)) return !0;
  const a = pa(e), r = ma(e, a), i = ga(e, r), t = ze(i, r, "success", a), o = ze(i, r, "failure", a), n = Tt(e, o.threshold, "failure"), c = n ? null : Tt(e, t.threshold, "success"), l = n ?? c;
  if (!l) return !1;
  const u = ya(e, l, r, i, n ? o : t);
  return u ? (We(e.id), $e("Triggering cut-in.", u), (m = game.socket) == null || m.emit(Je, { type: "play", payload: u }), Me(u), !0) : (We(e.id), !0);
}
function Bi(e, a) {
  var d, m, h;
  if (!(e != null && e.id) || (m = (d = e.flags) == null ? void 0 : d[C]) != null && m[Mt] || Ce.has(e.id)) return !0;
  const r = pa(e), i = ma(e, r), t = ga(e, i), o = ze(t, i, "success", r), n = ze(t, i, "failure", r), c = jt(e, a, n.threshold, "failure"), l = c ? null : jt(e, a, o.threshold, "success"), s = c ?? l;
  if (!s) return !1;
  const f = ya(e, s, i, t, c ? n : o);
  return f ? (We(e.id), $e("Triggering cut-in from rendered chat card.", f), (h = game.socket) == null || h.emit(Je, { type: "play", payload: f }), Me(f), !0) : (We(e.id), !0);
}
function dt(e, a) {
  e != null && e.id && globalThis.setTimeout(() => {
    var i;
    if (Ce.has(e.id)) return;
    const r = ((i = game.messages) == null ? void 0 : i.get(e.id)) ?? e;
    va(r);
  }, a);
}
function Xi() {
  var a;
  wt.clear();
  for (const r of game.messages ?? [])
    r != null && r.id && wt.add(r.id);
  Hooks.on("createChatMessage", (r) => {
    T(g.enabled) && Yt() && (va(r) || (dt(r, 100), dt(r, 500), dt(r, 1500)));
  });
  const e = (r, i) => {
    T(g.enabled) && (qi(r) || Yt() && Bi(r, i));
  };
  Hooks.on("renderChatMessage", e), Hooks.on("renderChatMessageHTML", e), (a = game.socket) == null || a.on(Je, (r) => {
    (r == null ? void 0 : r.type) === "play" && T(g.enabled) && Me(r.payload);
  });
}
function ba(e, a = {}) {
  var c, l, s, u, f, d, m;
  const r = (c = game.users) == null ? void 0 : c.get(e), i = a.actorId ? (l = game.actors) == null ? void 0 : l.get(a.actorId) : (r == null ? void 0 : r.character) ?? null, t = a.triggerKind === "failure" ? "failure" : "success", o = i && (r != null && r.isGM) && r.id === ((s = game.user) == null ? void 0 : s.id) ? (m = (d = (f = (u = globalThis.canvas) == null ? void 0 : u.tokens) == null ? void 0 : f.controlled) == null ? void 0 : d.find((h) => {
    var v;
    return ((v = h.actor) == null ? void 0 : v.id) === i.id;
  })) == null ? void 0 : m.document : null, n = ze(r, i, t, o);
  return {
    id: foundry.utils.randomID(),
    userId: e,
    actorId: (i == null ? void 0 : i.id) ?? null,
    userName: (r == null ? void 0 : r.name) ?? "",
    actorName: (i == null ? void 0 : i.name) ?? "",
    naturalResult: a.naturalResult ?? n.threshold,
    triggerKind: t,
    threshold: a.threshold ?? n.threshold ?? Ke(),
    animationStyle: a.animationStyle ?? n.animationStyle ?? "strike",
    imagePath: a.imagePath ?? n.imagePath ?? "",
    audioPath: a.audioPath ?? n.audioPath ?? "",
    overlayText: a.overlayText ?? n.overlayText ?? T(g.defaultText),
    accentColor: a.accentColor ?? n.accentColor ?? "#69e8ff",
    textEnabled: a.textEnabled ?? T(g.textEnabled),
    duration: a.duration ?? n.duration,
    volume: a.volume ?? T(g.volume),
    audience: a.audience ?? T(g.audience)
  };
}
function Vi(e, a = {}) {
  var t, o;
  const r = (t = game.actors) == null ? void 0 : t.get(e), i = ((o = game.users) == null ? void 0 : o.find((n) => !n.isGM && ha(r, n.id))) ?? game.user;
  return ba(i == null ? void 0 : i.id, { ...a, actorId: e });
}
function Qt(e) {
  var a;
  (a = game.socket) == null || a.emit(Je, { type: "play", payload: e }), Me(e);
}
function wa() {
  var e, a, r;
  return ((a = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : a.api) ?? ((r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.api) ?? null;
}
function Sa() {
  var e, a, r;
  return ((a = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : a.api) ?? ((r = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : r.api) ?? null;
}
function ji(e = {}, a = {}) {
  var i, t, o;
  const r = ((t = (i = globalThis.foundry) == null ? void 0 : i.utils) == null ? void 0 : t.mergeObject) ?? ((o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.mergeObject);
  return typeof r == "function" ? r(e, a, { inplace: !1 }) : { ...e, ...a };
}
function Yi() {
  var e, a, r, i, t;
  return ((r = (a = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : a.randomID) == null ? void 0 : r.call(a, 8)) ?? ((t = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.randomID) == null ? void 0 : t.call(i, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function Ut(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${Yi()}`),
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
function Ca(e) {
  return class extends e {
    constructor(i = {}) {
      const t = ji(new.target.defaultOptions ?? {}, i);
      super(Ut(t));
      ke(this, "_v1Options");
      this._v1Options = t;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return Ut(this.defaultOptions ?? {});
    }
    activateListeners(i) {
    }
    async _renderHTML(i, t) {
      var s, u, f;
      const o = typeof this.getData == "function" ? await this.getData() : {}, n = ((s = this._v1Options) == null ? void 0 : s.template) ?? ((u = this.options) == null ? void 0 : u.template) ?? ((f = this.constructor.defaultOptions) == null ? void 0 : f.template);
      if (!n) return document.createDocumentFragment();
      const c = await globalThis.renderTemplate(n, o), l = document.createElement("template");
      return l.innerHTML = c.trim(), l.content;
    }
    _activateV1Form(i) {
      var o, n;
      if (typeof this._updateObject != "function") return;
      const t = (o = i.matches) != null && o.call(i, "form") ? i : (n = i.querySelector) == null ? void 0 : n.call(i, "form");
      t instanceof HTMLFormElement && t.addEventListener("submit", async (c) => {
        var s;
        c.preventDefault(), c.stopPropagation();
        const l = new FormData(t);
        await this._updateObject(c, l), ((s = this._v1Options) == null ? void 0 : s.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(i, t, o) {
      var u, f, d, m;
      t.replaceChildren(i);
      const n = globalThis.jQuery ?? globalThis.$, c = ((u = t.closest) == null ? void 0 : u.call(t, ".window-app, .app, .application")) ?? t, l = n ? n(c) : c;
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
      Array.isArray(s) && s.length && (t.classList.add(...s), (m = (d = t.closest) == null ? void 0 : d.call(t, ".window-app, .app, .application")) == null || m.classList.add(...s)), this._activateV1Form(t), typeof this.activateListeners == "function" && this.activateListeners(n ? n(t) : t);
    }
  };
}
function Qi() {
  const e = wa(), a = Sa(), r = globalThis.Application ?? (a == null ? void 0 : a.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (a == null ? void 0 : a.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (r) return r;
  const i = e == null ? void 0 : e.ApplicationV2;
  return i ? Ca(i) : null;
}
function Ui() {
  const e = wa(), a = Sa(), r = globalThis.FormApplication ?? (a == null ? void 0 : a.FormApplication) ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (a == null ? void 0 : a.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (r) return r;
  const i = e == null ? void 0 : e.ApplicationV2;
  return i ? Ca(i) : Qi();
}
const Se = "icons/svg/mystery-man.svg", Ki = Ui();
function Ue(e, a, r) {
  const { min: i, max: t } = Ae(e, r);
  return a === "low" ? { success: i, failure: t } : { success: t, failure: i };
}
async function Wi(e, a, r, i = 1) {
  var s, u, f, d;
  const { success: t, failure: o } = Ue(e, a, i), n = `<p>Change to <strong>${i === 1 ? "" : i}d${e}</strong> with <strong>${a === "low" ? "low" : "high"} rolls positive</strong>?</p>
    <p>This resets the roll configuration for all ${r} listed character and GM entries, for both outcomes, and the global thresholds:</p>
    <ul><li>Success: <strong>${t}</strong></li><li>Failure: <strong>${o}</strong></li></ul>
    <p>Images, audio, animation, labels, colors, and enabled states stay unchanged. Click Save afterward to apply these changes.</p>`, c = (u = (s = foundry == null ? void 0 : foundry.applications) == null ? void 0 : s.api) == null ? void 0 : u.DialogV2;
  if (c != null && c.confirm)
    return await c.confirm({
      window: { title: "Reset Critical Cut-In Roll Configuration?" },
      content: n,
      modal: !0,
      rejectClose: !1,
      yes: { label: "Change and Reset Rolls" },
      no: { label: "Cancel", default: !0 }
    }) === !0;
  const l = globalThis.Dialog ?? ((d = (f = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : f.api) == null ? void 0 : d.Dialog);
  if (!(l != null && l.confirm)) throw new Error("Foundry confirmation dialog is unavailable.");
  return await l.confirm({ title: "Reset Critical Cut-In Roll Configuration?", content: n, defaultYes: !1, rejectClose: !1 }) === !0;
}
function Aa(e, a) {
  return `${e}:${a}`;
}
function Ta() {
  return Aa("gm", "default");
}
function Ma(e, a) {
  var i, t, o, n;
  const r = ((t = (i = globalThis.CONST) == null ? void 0 : i.DOCUMENT_OWNERSHIP_LEVELS) == null ? void 0 : t.OWNER) ?? 3;
  return Number(((o = a == null ? void 0 : a.ownership) == null ? void 0 : o[e.id]) ?? ((n = a == null ? void 0 : a.ownership) == null ? void 0 : n.default) ?? 0) >= r;
}
function Kt(e = {}, { defaultAccent: a = "#69e8ff" } = {}) {
  const r = Number(e.threshold), { min: i, max: t } = Ae(), o = Be(e.animationStyle);
  return {
    enabled: e.enabled !== !1,
    threshold: Number.isInteger(r) && r >= i && r <= t ? r : "",
    duration: Ge(e.duration),
    animationStyle: o,
    animationStyles: it.map((n) => ({ value: n.id, label: n.label, selected: o === n.id })),
    imagePath: String(e.imagePath ?? ""),
    audioPath: String(e.audioPath ?? ""),
    overlayText: String(e.overlayText ?? ""),
    accentColor: String(e.accentColor ?? (o === be ? Et : a))
  };
}
function Ji(e = {}) {
  return {
    success: Kt(e, { defaultAccent: "#69e8ff" }),
    failure: Kt(e.failure, { defaultAccent: "#ff4d7d" })
  };
}
function er() {
  var r, i, t, o;
  const e = ((r = game.users) == null ? void 0 : r.find((n) => n.isGM && n.active)) ?? ((i = game.users) == null ? void 0 : i.find((n) => n.isGM)) ?? game.user, a = [{
    key: Ta(),
    type: "gm",
    typeLabel: "GM",
    id: "default",
    name: "GM Cut-In",
    portrait: ((t = e == null ? void 0 : e.character) == null ? void 0 : t.img) || (e == null ? void 0 : e.avatar) || Se
  }];
  for (const n of game.actors ?? [])
    (o = game.users) != null && o.some((c) => !c.isGM && Ma(c, n)) && a.push({
      key: Aa("actor", n.id),
      type: "actor",
      typeLabel: "Actor",
      id: n.id,
      name: n.name,
      portrait: n.img || Se
    });
  return a.sort((n, c) => n.type === "gm" ? -1 : c.type === "gm" ? 1 : n.name.localeCompare(c.name));
}
class ka extends Ki {
  constructor(r = {}) {
    super(r);
    ke(this, "activeTabs");
    ke(this, "selectedPlayer", "gm");
    ke(this, "selectedCharacters", /* @__PURE__ */ new Map());
    ke(this, "rollRuleChange", null);
    this.activeTabs = /* @__PURE__ */ new Map();
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "hcci-player-config",
      title: `${Jt} Configuration`,
      template: Da,
      classes: ["hcci-config-window"],
      width: 1320,
      height: 760,
      resizable: !0,
      closeOnSubmit: !1,
      submitOnChange: !1
    });
  }
  async getData() {
    var u;
    const r = ht(), i = er(), t = T(g.characterOrder) ?? {}, o = r[Ta()], n = [
      { id: "gm", name: "GM", avatar: (o == null ? void 0 : o.imagePath) || ((u = o == null ? void 0 : o.failure) == null ? void 0 : u.imagePath) || i[0].portrait, targets: [i[0]] },
      ...Array.from(game.users ?? []).filter((f) => !f.isGM).map((f) => {
        var v;
        const d = i.filter((w) => w.type === "actor" && Ma(f, game.actors.get(w.id))), m = t[f.id], h = new Map(Array.isArray(m) ? m.map((w, M) => [w, M]) : []);
        return d.sort((w, M) => (h.get(w.key) ?? h.size) - (h.get(M.key) ?? h.size)), { id: f.id, name: f.name, avatar: ((v = d[0]) == null ? void 0 : v.portrait) || f.avatar || Se, targets: d };
      })
    ], c = i.map((f) => {
      const d = Ji(r[f.key]);
      return {
        ...f,
        ...d,
        isGm: f.type === "gm",
        useTokenPortrait: (o == null ? void 0 : o.useTokenPortrait) !== !1,
        actorId: f.type === "actor" ? f.id : "",
        outcomes: [
          { ...d.success, kind: "success", defaultText: T(g.defaultText) },
          { ...d.failure, kind: "failure", defaultText: T(g.defaultFailureText) }
        ]
      };
    }), { min: l, max: s } = Ae();
    return {
      players: n.map((f) => ({
        ...f,
        reorderable: f.targets.length > 1,
        characterHeading: f.id === "gm" ? "GM Configuration" : `${f.name}’s Characters`,
        tabDetail: f.id === "gm" ? "Global" : `${f.targets.length} ${f.targets.length === 1 ? "character" : "characters"}`
      })),
      animationStyles: it,
      diceQuantity: l,
      maxDiceQuantity: ta,
      maxRollTotal: s,
      dice: Ra(xe()),
      lowRollsGood: tt(),
      threshold: T(g.threshold) ? Ke() : 0,
      failureThreshold: T(g.failureThreshold) ? ft() : 0,
      duration: T(g.duration),
      defaultSuccessAudio: T(g.defaultSuccessAudio) === !0,
      defaultFailureAudio: T(g.defaultFailureAudio) === !0,
      rows: c
    };
  }
  activateListeners(r) {
    super.activateListeners(r);
    const i = r instanceof HTMLElement ? r : r[0], t = i.matches(".hcci-config") ? i : i.querySelector(".hcci-config"), o = (p) => t.querySelector(p), n = (p) => Array.from(t.querySelectorAll(p));
    o("[data-hcci-action='close']").addEventListener("click", () => this.close()), o("[data-hcci-glory-roll]").addEventListener("click", () => void yt()), this.activateWindowDrag(o("[data-hcci-window-drag]"), t.closest(".window-app, .application"));
    const c = n("[data-hcci-player]"), l = n("[data-hcci-characters]"), s = n("[data-hcci-character]"), u = n("[data-hcci-tab]"), f = n("[data-hcci-row]"), d = n("[data-hcci-panel]"), m = o("[data-hcci-workspace]"), h = o("[data-hcci-art]"), v = o("[data-hcci-caption]"), w = o("[data-hcci-preview-name]"), M = n("[data-hcci-style]"), P = o(".hcci-style-list");
    P.addEventListener("wheel", (p) => {
      if (p.ctrlKey || Math.abs(p.deltaX) >= Math.abs(p.deltaY)) return;
      const S = P.scrollLeft, x = p.deltaMode === 1 ? 16 : p.deltaMode === 2 ? P.clientWidth : 1;
      P.scrollLeft += p.deltaY * x, P.scrollLeft !== S && p.preventDefault();
    }, { passive: !1 });
    let y, A, b = "success", k = "", I = "";
    const R = (p) => A == null ? void 0 : A.querySelector(`[data-hcci-field="${p}"]`), q = () => {
      var x, D, N, X, F, E, H;
      const S = ((x = y == null ? void 0 : y.querySelector("[data-hcci-gm-token-portrait]")) == null ? void 0 : x.checked) ? (X = (N = (D = globalThis.canvas) == null ? void 0 : D.tokens) == null ? void 0 : N.controlled) == null ? void 0 : X[0] : null;
      return ((E = (F = S == null ? void 0 : S.document) == null ? void 0 : F.texture) == null ? void 0 : E.src) || ((H = S == null ? void 0 : S.actor) == null ? void 0 : H.img) || R("imagePath").value.trim();
    }, se = () => {
      const p = (y == null ? void 0 : y.dataset.hcciPortrait) || Se, S = Be(R("animationStyle").value);
      return {
        animationStyle: S,
        actorName: y != null && y.dataset.hcciActorId ? y.dataset.hcciName : "",
        triggerKind: b,
        imagePath: q() || p,
        fallbackImagePath: p,
        overlayText: R("overlayText").value.trim() || R("overlayText").placeholder,
        accentColor: R("accentColor").value,
        textEnabled: !["rift", be, Ie, Re, Ne].includes(S) || T(g.textEnabled) !== !1
      };
    }, Y = () => {
      if (!y || !A) return;
      const p = se();
      (p.imagePath !== k || p.fallbackImagePath !== I) && (k = p.imagePath, I = p.fallbackImagePath, h.src = k), h.parentElement.style.setProperty("--hcci-preview-accent", p.accentColor), v.textContent = p.textEnabled ? p.overlayText : "", w.textContent = p.actorName, M.forEach((S) => S.setAttribute("aria-pressed", String(S.dataset.hcciStyle === p.animationStyle)));
    };
    h.addEventListener("error", () => {
      const p = h.getAttribute("src");
      p !== I && p !== Se ? h.src = I : p !== Se && (h.src = Se);
    });
    const J = (p, S) => {
      p.setAttribute("aria-selected", String(S)), p.tabIndex = S ? 0 : -1;
    }, _ = (p, S = this.selectedCharacters.get(p), x) => {
      this.selectedPlayer = p;
      const D = l.find((E) => E.dataset.hcciCharacters === p), N = Array.from((D == null ? void 0 : D.querySelectorAll("[data-hcci-character]")) ?? []), X = N.find((E) => E.dataset.hcciCharacter === S) ?? N[0], F = X == null ? void 0 : X.dataset.hcciCharacter;
      b = x ?? this.activeTabs.get(F) ?? "success", F && (this.selectedCharacters.set(p, F), this.activeTabs.set(F, b)), y = f.find((E) => E.dataset.hcciRow === F), A = y == null ? void 0 : y.querySelector(`[data-hcci-panel="${b}"]`), c.forEach((E) => J(E, E.dataset.hcciPlayer === p)), l.forEach((E) => {
        E.hidden = E !== D;
      }), s.forEach((E) => E.setAttribute("aria-pressed", String(E === X))), u.forEach((E) => J(E, E.dataset.hcciTab === b)), f.forEach((E) => {
        E.hidden = E !== y;
      }), d.forEach((E) => {
        E.hidden = E !== A;
      }), o("#hcci-settings-panel").setAttribute("aria-labelledby", `hcci-${b}-tab`), m.hidden = !y, m.dataset.hcciKind = b, o("[data-hcci-preview-kind]").textContent = b === "failure" ? "Critical Failure" : "Critical Success", Y();
    };
    c.forEach((p) => p.addEventListener("click", () => _(p.dataset.hcciPlayer))), s.forEach((p) => p.addEventListener("click", () => _(this.selectedPlayer, p.dataset.hcciCharacter))), u.forEach((p) => p.addEventListener("click", () => _(this.selectedPlayer, void 0, p.dataset.hcciTab)));
    for (const p of [c, u]) for (const [S, x] of p.entries())
      x.addEventListener("keydown", (D) => {
        const N = {
          Home: 0,
          End: p.length - 1,
          ArrowLeft: (S - 1 + p.length) % p.length,
          ArrowRight: (S + 1) % p.length
        }[D.key];
        N !== void 0 && (D.preventDefault(), p[N].focus(), p[N].click());
      });
    M.forEach((p) => p.addEventListener("click", () => {
      const S = R("animationStyle");
      S.value = p.dataset.hcciStyle, S.dispatchEvent(new Event("change", { bubbles: !0 }));
    })), _(c.some((p) => p.dataset.hcciPlayer === this.selectedPlayer) ? this.selectedPlayer : "gm");
    let ee = !1;
    t.addEventListener("invalid", (p) => {
      var E, H, Pt;
      if (ee) return;
      ee = !0, queueMicrotask(() => {
        ee = !1;
      });
      const S = p.target, x = S.closest("details");
      x && (x.open = !0);
      const D = (E = S.closest("[data-hcci-row]")) == null ? void 0 : E.dataset.hcciRow;
      if (!D) return;
      const N = s.filter((ot) => ot.dataset.hcciCharacter === D), X = N.find((ot) => {
        var xt;
        return ((xt = ot.closest("[data-hcci-characters]")) == null ? void 0 : xt.dataset.hcciCharacters) === this.selectedPlayer;
      }) ?? N[0], F = (H = X == null ? void 0 : X.closest("[data-hcci-characters]")) == null ? void 0 : H.dataset.hcciCharacters;
      F && _(F, D, (Pt = S.closest("[data-hcci-panel]")) == null ? void 0 : Pt.dataset.hcciPanel);
    }, !0);
    const ne = () => {
      o("[data-hcci-dirty]").hidden = !1;
    };
    for (const p of l) {
      const S = c.find((x) => x.dataset.hcciPlayer === p.dataset.hcciCharacters);
      this.activateCharacterOrdering(p.querySelector(".hcci-character-list"), S, ne);
    }
    const B = o('[name="dieSides"]'), Q = o('[name="diceQuantity"]'), U = o('[name="rollDirection"]'), V = o('[name="threshold"]'), z = o('[name="failureThreshold"]'), j = n('[data-hcci-field="threshold"]'), le = () => {
      const p = Number(B.value), S = Number(Q.value), x = U.value === "low";
      if (n("[data-hcci-success-label]").forEach((H) => {
        H.textContent = x ? "Success ≤" : "Success ≥";
      }), n("[data-hcci-failure-label]").forEach((H) => {
        H.textContent = x ? "Failure ≥" : "Failure ≤";
      }), !Q.validity.valid || !Number.isInteger(p) || p < 2 || p > 1e4) return;
      const { min: D, max: N } = Ae(p, S), X = Ue(p, U.value, S), F = Number(V.value) || X.success, E = Number(z.value) || X.failure;
      for (const H of [V, z])
        H.max = String(N), H.setCustomValidity(Number(H.value) > 0 && Number(H.value) < D ? `Enter 0 or a total from ${D} to ${N}.` : "");
      for (const H of j)
        H.min = String(D), H.max = String(N), H.placeholder = String(H.closest('[data-hcci-panel="success"]') ? F : E);
    };
    le();
    let he = Number(B.value), pe = Number(Q.value), G = U.value;
    const K = () => {
      if (this.rollRuleChange) return;
      const p = Number(B.value), S = Number(Q.value), x = U.value;
      if (!Q.reportValidity() || p === he && S === pe && x === G) return;
      const D = [B, Q, U, o('[type="submit"]')];
      D.forEach((N) => {
        N.disabled = !0;
      }), this.rollRuleChange = (async () => {
        var N, X;
        try {
          if (!await Wi(p, x, f.length, S)) return;
          const { success: F, failure: E } = Ue(p, x, S);
          V.value = String(F), z.value = String(E);
          for (const H of j)
            H.value = String(H.closest('[data-hcci-panel="success"]') ? F : E);
          he = p, pe = S, G = x, ne();
        } catch (F) {
          console.error(`${C} | Could not confirm dice change.`, F), (X = (N = ui.notifications) == null ? void 0 : N.error) == null || X.call(N, "Could not confirm the dice change. Your roll configuration has not changed.");
        } finally {
          B.value = String(he), Q.value = String(pe), U.value = G, D.forEach((F) => {
            F.disabled = !1;
          }), le(), this.rollRuleChange = null;
        }
      })();
    };
    B.addEventListener("change", K), Q.addEventListener("change", K), U.addEventListener("change", K), t.addEventListener("submit", (p) => {
      Number(B.value) === he && Number(Q.value) === pe && U.value === G || (p.preventDefault(), p.stopImmediatePropagation(), K());
    }, !0);
    for (const p of ["input", "change"]) t.addEventListener(p, (S) => {
      const x = S.target;
      !x.matches("input, select") || x === B || x === Q || x === U || (ne(), (x === V || x === z) && le(), y != null && y.contains(x) && Y());
    });
    for (const p of n("[data-hcci-browse]")) p.addEventListener("click", () => {
      var X, F, E;
      const S = p.dataset.hcciBrowse, x = R(S);
      if (!x) return;
      const D = ((E = (F = (X = foundry == null ? void 0 : foundry.applications) == null ? void 0 : X.apps) == null ? void 0 : F.FilePicker) == null ? void 0 : E.implementation) ?? globalThis.FilePicker;
      new D({
        type: S === "audioPath" ? "audio" : "image",
        current: x.value,
        callback: (H) => {
          x.value = H, x.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).browse();
    });
    const me = o("[data-hcci-test]"), rt = {
      success: o('[name="defaultSuccessAudio"]'),
      failure: o('[name="defaultFailureAudio"]')
    };
    me.addEventListener("click", async () => {
      var D, N, X, F, E;
      if (!((D = game.user) != null && D.isGM) || !y || !A || me.getAttribute("aria-disabled") === "true") return;
      const p = Ue(he, G, pe), S = b === "failure" ? "failure" : "success", x = S === "failure" ? z.value : V.value;
      me.setAttribute("aria-disabled", "true");
      try {
        await Oi({
          ...se(),
          actorId: y.dataset.hcciActorId || null,
          naturalResult: p[S],
          threshold: Number((N = R("threshold")) == null ? void 0 : N.value) || Number(x) || p[S],
          audioPath: ea(S, R("audioPath").value, rt[S].checked),
          duration: Ge((X = R("duration")) == null ? void 0 : X.value) ?? Ge(o('[name="duration"]').value) ?? T(g.duration),
          volume: T(g.volume)
        }) || (E = (F = ui.notifications) == null ? void 0 : F.info) == null || E.call(F, "A cut-in is already playing.");
      } finally {
        me.removeAttribute("aria-disabled");
      }
    }), o("[data-hcci-action='reset']").addEventListener("click", async () => {
      var x, D, N;
      const p = (D = (x = foundry == null ? void 0 : foundry.applications) == null ? void 0 : x.api) == null ? void 0 : D.DialogV2;
      (p != null && p.confirm ? await p.confirm({
        window: { title: "Reset All Character Cut-Ins?" },
        content: "<p>This removes every GM and actor override. Global roll and presentation settings stay unchanged.</p>",
        modal: !0,
        rejectClose: !1,
        yes: { label: "Reset Overrides" },
        no: { label: "Cancel", default: !0 }
      }) === !0 : globalThis.confirm("Reset every GM and actor cut-in override?")) && (await It({}), (N = ui.notifications) == null || N.info("Critical Cut-In player configuration reset."), this.render(!1));
    });
  }
  activateCharacterOrdering(r, i, t) {
    const o = "[data-hcci-character][draggable='true']", n = (s) => s.target.closest(o);
    let c = null;
    const l = (s, u) => {
      !!(s.compareDocumentPosition(u) & Node.DOCUMENT_POSITION_FOLLOWING) ? u.after(s) : u.before(s), i.querySelector("img").src = r.querySelector("img").getAttribute("src"), s.focus(), t();
    };
    r.addEventListener("dragstart", (s) => {
      c = n(s), !(!c || !s.dataTransfer) && (s.dataTransfer.effectAllowed = "move", s.dataTransfer.setData("text/plain", c.dataset.hcciCharacter));
    }), r.addEventListener("dragover", (s) => {
      !c || !n(s) || (s.preventDefault(), s.dataTransfer && (s.dataTransfer.dropEffect = "move"));
    }), r.addEventListener("drop", (s) => {
      const u = n(s);
      !c || !u || (s.preventDefault(), u !== c && l(c, u), c = null);
    }), r.addEventListener("dragend", () => {
      c = null;
    }), r.addEventListener("keydown", (s) => {
      const u = n(s);
      if (!u || !s.altKey || !["ArrowUp", "ArrowDown"].includes(s.key)) return;
      s.preventDefault();
      const f = s.key === "ArrowUp" ? u.previousElementSibling : u.nextElementSibling;
      f && l(u, f);
    });
  }
  activateWindowDrag(r, i) {
    if (!i) return;
    let t = null;
    r.addEventListener("pointerdown", (o) => {
      var c;
      if (o.button !== 0 || t) return;
      const n = i.getBoundingClientRect();
      (c = this.bringToFront ?? this.bringToTop) == null || c.call(this), r.setPointerCapture(o.pointerId), t = {
        pointerId: o.pointerId,
        offsetX: o.clientX - n.left,
        offsetY: o.clientY - n.top
      }, o.preventDefault();
    }), r.addEventListener("pointermove", (o) => {
      !t || o.pointerId !== t.pointerId || this.setPosition({
        left: Math.max(0, Math.min(window.innerWidth - 48, o.clientX - t.offsetX)),
        top: Math.max(0, Math.min(window.innerHeight - 48, o.clientY - t.offsetY))
      });
    }), r.addEventListener("lostpointercapture", (o) => {
      o.pointerId === (t == null ? void 0 : t.pointerId) && (t = null);
    });
  }
  async _updateObject(r) {
    var M, P, y, A, b, k, I, R, q, se;
    if (!((M = game.user) != null && M.isGM) || this.rollRuleChange) return;
    const i = r.currentTarget;
    if (!i.reportValidity()) return;
    const t = Number(((P = i.querySelector('[name="dieSides"]')) == null ? void 0 : P.value) ?? xe()), o = Number(((y = i.querySelector('[name="diceQuantity"]')) == null ? void 0 : y.value) ?? et()), { min: n, max: c } = Ae(t, o), l = ((A = i.querySelector('[name="rollDirection"]')) == null ? void 0 : A.value) === "low" ? "low" : "high", s = ht(), u = (Y, J) => {
      var B, Q, U, V, z, j, le, he, pe, G;
      const _ = Y.querySelector(`[data-hcci-panel="${J}"]`), ee = (K) => _ == null ? void 0 : _.querySelector(`[data-hcci-field="${K}"]`), ne = Ge((B = ee("duration")) == null ? void 0 : B.value);
      return {
        ...ne === void 0 ? {} : { duration: ne },
        enabled: ((Q = _ == null ? void 0 : _.querySelector('[data-hcci-field="enabled"]')) == null ? void 0 : Q.checked) === !0,
        threshold: (() => {
          var me;
          const K = Number((me = ee("threshold")) == null ? void 0 : me.value);
          return Number.isInteger(K) && K >= n && K <= c ? K : "";
        })(),
        animationStyle: ((U = ee("animationStyle")) == null ? void 0 : U.value) || "strike",
        imagePath: ((z = (V = ee("imagePath")) == null ? void 0 : V.value) == null ? void 0 : z.trim()) ?? "",
        audioPath: ((le = (j = ee("audioPath")) == null ? void 0 : j.value) == null ? void 0 : le.trim()) ?? "",
        overlayText: ((pe = (he = ee("overlayText")) == null ? void 0 : he.value) == null ? void 0 : pe.trim()) ?? "",
        accentColor: ((G = ee("accentColor")) == null ? void 0 : G.value) || (J === "failure" ? "#ff4d7d" : "#69e8ff")
      };
    };
    for (const Y of i.querySelectorAll("[data-hcci-row]")) {
      const J = Y.dataset.hcciRow;
      s[J] = u(Y, "success"), s[J].failure = u(Y, "failure");
      const _ = Y.querySelector("[data-hcci-gm-token-portrait]");
      _ && (s[J].useTokenPortrait = _.checked);
    }
    const f = { ...T(g.characterOrder) };
    for (const Y of i.querySelectorAll("[data-hcci-characters]")) {
      const J = Y.dataset.hcciCharacters;
      J !== "gm" && (f[J] = Array.from(Y.querySelectorAll("[data-hcci-character]"), (_) => _.dataset.hcciCharacter));
    }
    const d = Number(((b = i.querySelector('[name="threshold"]')) == null ? void 0 : b.value) ?? Ke()), m = Number(((k = i.querySelector('[name="failureThreshold"]')) == null ? void 0 : k.value) ?? ft()), h = Number(((I = i.querySelector('[name="duration"]')) == null ? void 0 : I.value) ?? T(g.duration)), v = ((R = i.querySelector('[name="defaultSuccessAudio"]')) == null ? void 0 : R.checked) === !0, w = ((q = i.querySelector('[name="defaultFailureAudio"]')) == null ? void 0 : q.checked) === !0;
    await re(g.dieSides, t), await re(g.diceQuantity, o), await re(g.rollDirection, l), await re(g.threshold, d >= n && d <= c ? d : 0), await re(g.failureThreshold, m >= n && m <= c ? m : 0), await re(g.duration, Math.min(8e3, Math.max(800, h))), await re(g.defaultSuccessAudio, v), await re(g.defaultFailureAudio, w), await It(s), await re(g.characterOrder, f), (se = ui.notifications) == null || se.info("Critical Cut-In configuration saved."), this.render(!1);
  }
}
function Ea() {
  var e, a;
  return (e = game.user) != null && e.isGM ? new ka().render(!0) : ((a = ui.notifications) == null || a.warn("Only the GM can configure Critical Cut-In."), null);
}
function tr() {
  var r, i, t, o;
  const e = (r = game.modules.get("holosuite")) != null && r.active ? (i = game.modules.get("holosuite")) == null ? void 0 : i.api : null, a = (t = game.modules.get("holosuite-core")) != null && t.active ? (o = game.modules.get("holosuite-core")) == null ? void 0 : o.api : null;
  return e ?? a ?? game.holosuite ?? null;
}
function La() {
  var a, r;
  const e = tr();
  return e != null && e.registerApp ? ((a = e.unregisterApp) == null || a.call(e, `${C}-box-of-doom`), e.registerApp({
    brandingInApp: !0,
    id: C,
    title: "Critical Cut-In",
    icon: "fa-solid fa-bolt-lightning",
    premium: !1,
    playerVisible: !1,
    description: "Set up cut-ins for critical rolls or start a Glory Roll.",
    enabled: T(g.enabled),
    open: () => Ea()
  }), (r = e.registerWhatsNew) == null || r.call(e, {
    moduleId: C,
    title: "Critical Cut-In",
    tier: "free",
    version: "2.0.0",
    updated: "2026-11-28",
    icon: "fa-solid fa-bolt-lightning",
    entries: [
      {
        title: "New cut-in editor",
        summary: "Browse 15 animations, reorder characters, and set up criticals for rolls like 2d6.",
        tags: ["Foundry v12-v14"]
      },
      {
        title: "Glory Roll",
        summary: "Pick who rolls, enter a formula, and show the result to the table."
      }
    ]
  }), console.log(`${C} | Registered with HoloSuite.`), !0) : !1;
}
function Pa() {
  const e = {
    playCutinForUser(r, i = {}) {
      var o;
      const t = ba(r, i);
      return (o = game.user) != null && o.isGM ? Qt(t) : Me(t), t;
    },
    playCutinForActor(r, i = {}) {
      var o;
      const t = Vi(r, i);
      return (o = game.user) != null && o.isGM ? Qt(t) : Me(t), t;
    },
    openConfig: Ea,
    openGloryRoll: yt,
    openBoxOfDoom: yt
  }, a = game.modules.get(C);
  return a && (a.api = e), game.holosuiteCriticalCutin = e, e;
}
Hooks.once("init", async () => {
  Oa(ka), Xa(), Pa(), await loadTemplates([`modules/${C}/templates/player-config.hbs`]);
});
Hooks.once("ready", () => {
  Pa(), Xi(), ce(), Hooks.on("userConnected", ce), La(), console.log(`${C} | Ready. API available at game.modules.get("${C}").api`);
});
Hooks.on("hotReload", () => {
  La();
});
console.log(`${Jt} | Loading.`);
