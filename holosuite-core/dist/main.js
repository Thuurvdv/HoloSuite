var st = Object.defineProperty;
var it = (e, t, n) => t in e ? st(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var A = (e, t, n) => it(e, typeof t != "symbol" ? t + "" : t, n);
const K = [
  "modules/holosuite-core/styles/holosuite-tokens.css",
  "modules/holosuite-core/styles/holosuite-core.css"
], O = "data-holosuite-core-stylesheet";
function at(e, t) {
  const n = String(t ?? "").trim();
  return n ? `${e}?v=${encodeURIComponent(n)}` : e;
}
function lt(e, t = document, n = "") {
  const o = Array.from(
    t.querySelectorAll(`link[${O}]`)
  );
  if (!e) {
    for (const c of o) c.remove();
    return;
  }
  const r = t.head;
  if (!r) return;
  const s = new Set(K), a = /* @__PURE__ */ new Set();
  for (const c of o) {
    const u = c.getAttribute(O) ?? "";
    if (!s.has(u) || a.has(u)) {
      c.remove();
      continue;
    }
    a.add(u);
  }
  for (const c of K) {
    if (a.has(c)) continue;
    const u = t.createElement("link");
    u.rel = "stylesheet", u.href = at(c, n), u.setAttribute(O, c), r.append(u);
  }
}
function k(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function we(e, t) {
  return k(e) ? t.includes(String(e.name ?? "")) : !1;
}
function ye(e) {
  if (!k(e) || !("tools" in e)) return !1;
  const t = String(e.name ?? "");
  return !["measure", "templates", "walls", "lighting", "sounds", "notes", "tiles", "drawings"].includes(t);
}
function ct(e, t, n) {
  if (Array.isArray(e))
    return e.find((o) => we(o, t)) ?? (n ? e.find(ye) : null) ?? null;
  if (!k(e)) return null;
  for (const o of t)
    if (k(e[o])) return e[o];
  return Object.values(e).find((o) => we(o, t)) ?? (n ? Object.values(e).find(ye) : null) ?? null;
}
function ut(e) {
  const t = Object.values(e).map((n) => Number(n == null ? void 0 : n.order)).filter(Number.isFinite);
  return t.length ? Math.max(...t) + 1 : Object.keys(e).length;
}
function be(e, t, n = ["tokens", "token"], o = {}) {
  const r = ct(e, n, o.allowFallback === !0);
  if (!r) return !1;
  const s = r.tools;
  return Array.isArray(s) ? s.some((a) => (a == null ? void 0 : a.name) === t.name) ? !1 : (s.push(t), !0) : !k(s) || s[t.name] ? !1 : (s[t.name] = { ...t, order: t.order ?? ut(s) }, !0);
}
const l = "holosuite-core", x = "apiOnlyForDebugging", B = "disableCoreCssForDebugging", G = "disableVisualEffectsForDebugging", Ae = "disableForPlayers", te = "deviceStyle", He = "forceDeviceStyle", ne = "formFactor", oe = "appOrder", re = "theme", se = "whatsNewLastSeen", dt = "openLauncher", Se = "data-holosuite-foundry-generation", ve = "data-holosuite-debug-no-effects", ht = `modules/${l}/data/whats-new.json`, ft = Date.UTC(2026, 7, 1), Ee = {
  base: "HoloSuite",
  "space-police": "Space Police"
}, j = {
  "": "Allow User Choice",
  base: "HoloSuite",
  "space-police": "Space Police"
}, _ = {
  base: Ee.base,
  "space-police": Ee["space-police"]
}, gt = {
  "": j[""],
  base: j.base,
  "space-police": j["space-police"]
}, mt = {
  phone: "Phone",
  datapad: "Datapad",
  computer: "Computer"
}, Ie = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
}, H = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
let i = null, C = null, R = !1, Fe = 0, Q = !1, Oe = null, Ce = !1, F = null, D = !1, Z = 0;
function pt() {
  var n, o, r, s, a, c;
  const e = ((o = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : o.api) ?? ((r = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : r.api) ?? null, t = ((a = (s = globalThis.foundry) == null ? void 0 : s.applications) == null ? void 0 : a.api) ?? ((c = foundry == null ? void 0 : foundry.applications) == null ? void 0 : c.api) ?? null;
  return globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV2);
}
const ke = pt();
function ee(e) {
  return e ? !!e.getLauncherRoot({ includeDocumentFallback: !1 }) : !1;
}
function d(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function P(e, t, n = `${t}s`) {
  return `${e} ${e === 1 ? t : n}`;
}
function w(e, t) {
  try {
    return game.settings.get(e, t);
  } catch {
    return null;
  }
}
function p() {
  return Oe ?? w(l, x) === !0;
}
function Y(e) {
  var t;
  return ((t = game.modules.get(e)) == null ? void 0 : t.api) ?? null;
}
function wt() {
  var e, t, n;
  return String(((t = (e = game.user) == null ? void 0 : e.character) == null ? void 0 : t.name) ?? ((n = game.user) == null ? void 0 : n.name) ?? "Player");
}
function yt(e) {
  var t, n, o, r, s, a;
  if (e === "cybercall") {
    const c = v(w("cybercall", "contacts")), u = v(w("cybercall", "groupContacts"));
    return P(c.length + u.length, "link");
  }
  if (e === "bounty-board") {
    const c = v((n = (t = Y("bounty-board")) == null ? void 0 : t.getAllBounties) == null ? void 0 : n.call(t, { includeHidden: !1 }));
    return P(c.length, "contract");
  }
  if (e === "csi-toolkit") {
    const c = Object.values(((r = (o = Y("csi-toolkit")) == null ? void 0 : o.getCases) == null ? void 0 : r.call(o)) ?? {}).filter((u) => (u == null ? void 0 : u.visibility) !== "gm");
    return P(c.length, "case");
  }
  if (e === "galaxy-map") {
    const c = v((a = (s = Y("galaxy-map")) == null ? void 0 : s.getMaps) == null ? void 0 : a.call(s)).filter((u) => (u == null ? void 0 : u.visibility) === "players");
    return P(c.length, "chart");
  }
  return "";
}
function v(e) {
  return Array.isArray(e) ? e : [];
}
function bt(e) {
  const t = String((e == null ? void 0 : e.title) ?? "").trim();
  if (!t) return null;
  const o = v(e == null ? void 0 : e.tags).some((r) => /^foundry\b/i.test(String(r ?? "").trim())) ? ["Foundry v12–14"] : [];
  return {
    title: t,
    summary: String((e == null ? void 0 : e.summary) ?? "").trim(),
    tags: o
  };
}
function _e(e) {
  const t = String((e == null ? void 0 : e.moduleId) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), o = v(e == null ? void 0 : e.entries).map((s) => bt(s)).filter((s) => !!s);
  if (!t || !n || o.length === 0)
    return console.warn(`${l} | Ignoring invalid what's new registration.`, e), null;
  const r = String((e == null ? void 0 : e.tier) ?? "free").toLowerCase() === "premium" ? "premium" : "free";
  return {
    moduleId: t,
    title: n,
    tier: r,
    version: String((e == null ? void 0 : e.version) ?? "").trim(),
    updated: String((e == null ? void 0 : e.updated) ?? "").trim(),
    icon: String((e == null ? void 0 : e.icon) ?? "").trim(),
    url: String((e == null ? void 0 : e.url) ?? "").trim(),
    entries: o
  };
}
function M(e) {
  const t = Date.parse(String(e.updated ?? ""));
  return Number.isFinite(t) ? t : 0;
}
function ie(e, t) {
  return M(t) - M(e) || e.title.localeCompare(t.title);
}
function Pe(e) {
  var t, n;
  return ((n = (t = game.modules) == null ? void 0 : t.has) == null ? void 0 : n.call(t, e)) === !0;
}
function St() {
  const e = Number(w(l, se));
  return Number.isFinite(e) ? e : 0;
}
function vt() {
  const e = St();
  return [...T.values(), ...I.values()].filter((t) => M(t) > e).reduce((t, n) => t + n.entries.length, 0);
}
function Et() {
  try {
    game.settings.set(l, se, Date.now());
  } catch (e) {
    console.warn(`${l} | Could not update what's new read state.`, e);
  }
}
function Ct(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), o = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !t || !n || !o || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${l} | Ignoring invalid app registration.`, e), null) : {
    id: t,
    title: n,
    icon: o,
    premium: e.premium === !0,
    playerVisible: e.playerVisible !== !1,
    description: String(e.description ?? "").trim(),
    featureId: String(e.featureId ?? t).trim() || t,
    open: e.open
  };
}
function Tt(e) {
  var r;
  if (p()) return;
  const t = ((r = game.user) == null ? void 0 : r.isGM) === !0;
  if (!t && U()) return;
  const n = () => ({
    name: "holosuite-core-launcher",
    title: t ? "HoloSuite Command Deck" : "HoloSuite Player View",
    icon: je(),
    button: !0,
    visible: !0,
    onClick: Me,
    onChange: At
  }), o = be(e, n(), ["tiles", "tile"]);
  be(e, n(), ["tokens", "token"], { allowFallback: !o });
}
function Lt() {
  var e;
  return !p() && (((e = game.user) == null ? void 0 : e.isGM) === !0 || !U());
}
function ae() {
  p() || document.querySelectorAll(".holosuite-sidebar-launcher, .holosuite-floating-launcher").forEach((e) => e.remove());
}
function y(e) {
  var o;
  if (e instanceof HTMLElement) return e;
  if (Array.isArray(e) && e[0] instanceof HTMLElement) return e[0];
  const t = e, n = ((o = t == null ? void 0 : t.get) == null ? void 0 : o.call(t, 0)) ?? (t == null ? void 0 : t[0]);
  return n instanceof HTMLElement ? n : null;
}
function $t(e) {
  var s;
  const t = new Set(document.querySelectorAll("#holosuite-launcher, .holosuite-launcher-window"));
  if (t.size <= 1) return;
  const n = e ? y(e.element) : null, r = ((s = n == null ? void 0 : n.closest) == null ? void 0 : s.call(n, "#holosuite-launcher, .holosuite-launcher-window")) ?? [...t].at(-1) ?? null;
  for (const a of t)
    a !== r && a.remove();
}
function Re() {
  document.querySelectorAll("#holosuite-launcher, .holosuite-launcher-window").forEach((e) => {
    e.remove();
  });
}
function le() {
  return document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone") !== null;
}
function Dt() {
  i = null, C = null, R = !1;
}
function Nt(e) {
  const t = e.find((n) => typeof n == "boolean");
  return typeof t == "boolean" ? t : null;
}
function Me() {
  return Fe = Date.now(), L.toggleLauncher();
}
function At(...e) {
  const t = Nt(e);
  return t === !1 ? (z(), null) : t === null && Date.now() - Fe < 100 ? null : L.openLauncher();
}
function Ht(e) {
  var s;
  if (p()) return;
  const t = ((s = game.user) == null ? void 0 : s.isGM) === !0;
  if (!t && U()) return;
  const n = y(e) ?? document.querySelector("#controls, #scene-controls");
  if (!n || n.querySelector("[data-tool='holosuite-core-launcher']")) return;
  const o = n.querySelector(
    ".control-tools.active, .sub-controls.active, .scene-control-tools.active, .control-tools, .sub-controls, .scene-control-tools"
  );
  if (!o) return;
  const r = document.createElement("li");
  r.className = "control-tool holosuite-scene-control", r.dataset.tool = "holosuite-core-launcher", r.title = t ? "HoloSuite Command Deck" : "HoloSuite Player View", r.innerHTML = `<i class="${je()}"></i>`, r.addEventListener("click", (a) => {
    a.preventDefault(), a.stopPropagation(), Me();
  }), o.appendChild(r);
}
function It(e, t) {
  var s;
  const n = y(t);
  if (!n) return;
  const r = [
    `input[name="${l}.${x}"]`,
    `input[name="${l}.${B}"]`,
    `input[name="${l}.${G}"]`
  ].map((a) => {
    var c;
    return ((c = n.querySelector(a)) == null ? void 0 : c.closest(".form-group")) ?? null;
  }).filter((a) => a !== null);
  for (const a of r) (s = a.parentElement) == null || s.append(a);
}
function Ft() {
  game.settings.register(l, x, {
    name: "Debugging: API-Only Mode (This Browser)",
    hint: "Diagnostic only. Keeps Core's registration API active while disabling its launcher, scene-control UI, sidebar cleanup, and What's New catalog work on this browser.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => Ot(e)
  }), game.settings.register(l, B, {
    name: "Debugging: Disable HoloSuite Core CSS (This Browser)",
    hint: "Diagnostic only. Temporarily removes Core's shared tokens and launcher styles from this browser. HoloSuite interfaces will appear unstyled. Leave this off during normal play.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => We(e)
  }), game.settings.register(l, G, {
    name: "Debugging: Disable Core Visual Effects (This Browser)",
    hint: "Diagnostic only. Keeps Core's layout and colors while disabling launcher transitions, animations, filters, shadows, and glows on this browser.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => Ve(e)
  }), game.settings.register(l, te, {
    name: "HoloSuite Theme",
    hint: "Choose the HoloSuite launcher theme for this user.",
    scope: "client",
    config: !0,
    type: String,
    choices: _,
    default: "base",
    restricted: !1,
    onChange: () => {
      W(), i == null || i.refreshCurrentView();
    }
  }), game.settings.register(l, He, {
    name: "Force HoloSuite Theme",
    hint: "When set, every user sees this HoloSuite launcher theme instead of their personal choice.",
    scope: "world",
    config: !0,
    type: String,
    choices: gt,
    default: "",
    restricted: !0,
    onChange: () => {
      W(), i == null || i.refreshCurrentView();
    }
  }), game.settings.register(l, ne, {
    name: "HoloSuite Form Factor",
    hint: "Choose the launcher shape for this user: phone, wide datapad, or large computer display.",
    scope: "client",
    config: !1,
    type: String,
    choices: mt,
    default: "phone",
    restricted: !1,
    onChange: () => {
      fe(), i == null || i.refreshCurrentView(), i == null || i.resizeForFormFactor();
    }
  }), game.settings.register(l, oe, {
    name: "HoloSuite App Order",
    hint: "Stores this user's custom launcher order.",
    scope: "client",
    config: !1,
    type: Array,
    default: [],
    restricted: !1
  }), game.settings.register(l, re, {
    name: "HoloSuite Color Theme",
    hint: "Changes the shared color theme used by HoloSuite windows.",
    scope: "world",
    config: !0,
    type: String,
    choices: Ie,
    default: "default",
    restricted: !0,
    onChange: (e) => qe(e)
  }), game.settings.register(l, Ae, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !0
  }), game.settings.register(l, se, {
    name: "HoloSuite What's New Last Seen",
    hint: "Tracks when this client last opened the HoloSuite What's New view.",
    scope: "client",
    config: !1,
    type: Number,
    default: 0
  }), game.settings.registerMenu(l, "launcher", {
    name: "HoloSuite Command Deck",
    label: "Open HoloSuite",
    hint: "Open the HoloSuite launcher and registered app deck.",
    icon: "fas fa-terminal",
    type: V,
    restricted: !0
  }), game.settings.registerMenu(l, "diagnostics", {
    name: "HoloSuite Core Diagnostics",
    label: "Open Diagnostics",
    hint: "Inspect, copy, or download the current HoloSuite and Foundry test state.",
    icon: "fas fa-stethoscope",
    type: nt,
    restricted: !0
  });
}
async function Te() {
  var n;
  const e = ui.controls;
  if (typeof (e == null ? void 0 : e.render) != "function") return;
  const t = Number(((n = game.release) == null ? void 0 : n.generation) ?? 0);
  try {
    t >= 13 ? await e.render({ force: !0, reset: !0 }) : await e.render(!0);
  } catch (o) {
    console.warn(`${l} | Could not rebuild scene controls after changing API-only mode.`, o);
  }
}
function Ot(e = w(l, x)) {
  const t = e === !0;
  if (Oe = t, t) {
    document.querySelectorAll(
      "[data-tool='holosuite-core-launcher'], .holosuite-scene-control, .holosuite-sidebar-launcher, .holosuite-floating-launcher"
    ).forEach((n) => n.remove()), (i || le()) && z(), Q && Te(), console.warn(`${l} | API-only diagnostic mode is enabled on this browser.`);
    return;
  }
  Q && (Je(), Te());
}
function We(e = w(l, B)) {
  var o;
  const t = e === !0, n = String(((o = game.modules.get(l)) == null ? void 0 : o.version) ?? "");
  lt(!t, document, n), t && console.warn(`${l} | Core CSS is disabled on this browser for debugging.`);
}
function Ve(e = w(l, G)) {
  const t = e === !0;
  for (const n of [document.documentElement, document.body].filter(Boolean))
    t ? n.setAttribute(ve, "true") : n.removeAttribute(ve);
  t && console.warn(`${l} | Core visual effects are disabled on this browser for debugging.`);
}
function kt() {
  var e, t;
  (t = (e = game.keybindings) == null ? void 0 : e.register) == null || t.call(e, l, dt, {
    name: "Open HoloSuite",
    hint: "Open the HoloSuite launcher and registered app deck.",
    editable: [],
    restricted: !1,
    onDown: () => {
      var n, o, r, s;
      return p() ? ((o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, "HoloSuite Core is in API-only diagnostic mode on this browser."), !1) : Lt() ? (L.toggleLauncher(), !0) : ((s = (r = ui.notifications) == null ? void 0 : r.warn) == null || s.call(r, "HoloSuite is disabled for players in this world."), !1);
    }
  });
}
function ce(e) {
  return Object.hasOwn(_, String(e)) ? String(e) : "base";
}
function q() {
  const e = String(w(l, He) ?? "");
  return Object.hasOwn(_, e) ? e : null;
}
function ue() {
  return ce(w(l, te));
}
function xe() {
  return q() ?? ue();
}
function Be(e) {
  return Object.hasOwn(Ie, String(e)) ? String(e) : "default";
}
function de(e) {
  return "phone";
}
function he() {
  return de(w(l, ne));
}
function _t(e = he()) {
  const t = e === "computer" ? { width: 980, height: 720 } : e === "datapad" ? { width: 760, height: 680 } : { width: 483, height: 736 };
  return {
    width: Math.min(t.width, Math.max(420, window.innerWidth - 32)),
    height: Math.min(t.height, Math.max(560, window.innerHeight - 48))
  };
}
function Ge() {
  return v(w(l, oe)).map((e) => String(e ?? "").trim()).filter((e, t, n) => !!e && n.indexOf(e) === t);
}
function Pt(e) {
  const t = ce(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const o of n)
    t === "base" ? o.removeAttribute("data-holosuite-device-style") : o.setAttribute("data-holosuite-device-style", t);
}
function qe(e) {
  const t = Be(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const o of n)
    t === "default" ? o.removeAttribute("data-holosuite-theme") : o.setAttribute("data-holosuite-theme", t);
}
function Rt(e) {
  const t = de();
  for (const n of [document.documentElement, document.body].filter(Boolean))
    n.setAttribute("data-holosuite-form-factor", t);
}
function W() {
  Pt(xe());
}
function Mt() {
  qe(w(l, re));
}
function fe() {
  Rt(he());
}
function Ue() {
  var t, n, o;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((o = game == null ? void 0 : game.release) == null ? void 0 : o.generation));
  return Number.isFinite(e) ? e : null;
}
function ze() {
  const e = Ue(), t = [document.documentElement, document.body].filter(Boolean);
  for (const n of t)
    e === null ? n.removeAttribute(Se) : n.setAttribute(Se, String(e));
}
function je() {
  return Ue() === 12 ? "fa-solid fa-terminal" : "fa-solid fa-mobile-screen-button";
}
function U() {
  try {
    return game.settings.get(l, Ae) === !0;
  } catch {
    return !1;
  }
}
function Ye(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 ? !0 : U() ? !1 : e.playerVisible !== !1;
}
async function Wt(e) {
  var n, o, r, s;
  const t = H.get(e);
  return t ? Ye(t) ? t.open() : ((s = (r = ui.notifications) == null ? void 0 : r.warn) == null || s.call(r, `${t.title} is not available from the player view.`), null) : ((o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, `HoloSuite app "${e}" is not registered.`), null);
}
function Xe(e, t = {}) {
  const n = _e(e);
  return !n || M(n) < ft ? null : t.replace === !1 && T.has(n.moduleId) ? T.get(n.moduleId) ?? null : (T.set(n.moduleId, n), p() || i == null || i.render(!1), n);
}
function Vt(e, t = {}) {
  const n = _e(e);
  return n ? t.replace === !1 && I.has(n.moduleId) ? I.get(n.moduleId) ?? null : (I.set(n.moduleId, n), p() || i == null || i.render(!1), n) : null;
}
async function Je() {
  if (!(p() || Ce))
    return F || (F = (async () => {
      try {
        const e = await fetch(ht, { cache: "no-cache" });
        if (!e.ok) throw new Error(`HTTP ${e.status}`);
        const t = await e.json(), n = v(t == null ? void 0 : t.modules);
        for (const r of n)
          Xe(r, { replace: !1 });
        const o = v(t == null ? void 0 : t.releases);
        for (const r of o)
          Vt(r, { replace: !1 });
        Ce = !0;
      } catch (e) {
        console.warn(`${l} | Could not load bundled what's new catalog.`, e);
      }
    })().finally(() => {
      F = null;
    }), F);
}
function Ke(e) {
  const t = vt(), n = t > 0 ? `<span>${d(t)}</span>` : "";
  return `
    <div class="holosuite-header-actions">
      ${e === "apps" ? "" : `
    <button
      type="button"
      class="holosuite-header-action"
      data-holosuite-action="apps"
      title="Back to HoloSuite apps"
      aria-label="Back to HoloSuite apps"
    >
      <i class="fa-solid fa-arrow-left"></i>
    </button>
  `}
      <button
        type="button"
        class="holosuite-header-action ${e === "settings" ? "is-active" : ""}"
        data-holosuite-action="settings"
        title="HoloSuite Settings"
        aria-label="HoloSuite Settings"
      >
        <i class="fa-solid fa-gear"></i>
      </button>
      <button
        type="button"
        class="holosuite-header-action ${e === "whats-new" ? "is-active" : ""}"
        data-holosuite-action="whats-new"
        title="What's New"
        aria-label="What's New"
      >
        <i class="fa-solid fa-star"></i>
        ${n}
      </button>
    </div>
  `;
}
function xt(e) {
  return `
    <span class="holosuite-app-icon" data-holosuite-app-icon="${d(e.id)}">
      <i class="${d(e.icon)}"></i>
    </span>
  `;
}
function Qe() {
  var m;
  const e = ((m = game.user) == null ? void 0 : m.isGM) === !0, t = Ge(), n = new Map(t.map((f, g) => [f, g])), o = [...H.values()].filter(Ye).sort((f, g) => {
    const E = n.get(f.id), S = n.get(g.id);
    return E !== void 0 || S !== void 0 ? E === void 0 ? 1 : S === void 0 ? -1 : E - S : f.title.localeCompare(g.title);
  }), r = e ? "GM Command Deck" : "Player Link", s = e ? "Apps" : "Commlink", a = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", c = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">Active User</span>
        <strong>${d(wt())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>LINK STABLE</span>
      </div>
    </section>
  `, u = o.map((f) => {
    const g = f.title, E = e && f.description ? `<p>${d(f.description)}</p>` : "", S = e ? "" : yt(f.id);
    return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${d(f.id)}">
          ${xt(f)}
          <span class="holosuite-app-title">${d(g)}</span>
          ${E}
          ${S ? `<span class="holosuite-app-count">${d(S)}</span>` : ""}
        </button>
      `;
  }).join("");
  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">${d(r)}</span>
        <h2>${d(s)}</h2>
      </div>
    </div>
    ${c}
    <div class="holosuite-app-grid">
      ${o.length ? u : `<p class="holosuite-empty">${d(a)}</p>`}
    </div>
    ${o.length > 1 ? `
      <div class="holosuite-reorder-help" aria-live="polite">
        <span class="holosuite-reorder-help-idle"><i class="fa-solid fa-hand-pointer"></i> Press and hold an app to rearrange</span>
        <span class="holosuite-reorder-help-active"><i class="fa-solid fa-arrows-up-down-left-right"></i> Drag apps into place</span>
        <button type="button" data-holosuite-action="reorder-done">Done</button>
      </div>
    ` : ""}
  `;
}
function Bt(e) {
  return `
    <nav class="holosuite-whats-new-filters" aria-label="What's New filters">
      ${[
    { id: "all", label: "All" },
    { id: "free", label: "Free" },
    { id: "premium", label: "Premium" },
    { id: "installed", label: "Installed" }
  ].map((n) => `
        <button
          type="button"
          class="${n.id === e ? "is-active" : ""}"
          data-holosuite-filter="${d(n.id)}"
        >${d(n.label)}</button>
      `).join("")}
    </nav>
  `;
}
function Gt(e) {
  return `
    <nav class="holosuite-whats-new-tabs" aria-label="What's New tabs">
      ${[
    { id: "updates", label: "Updates", count: T.size },
    { id: "releases", label: "Releases", count: I.size }
  ].map((n) => `
        <button
          type="button"
          class="${n.id === e ? "is-active" : ""}"
          data-holosuite-whats-new-tab="${d(n.id)}"
        >
          <span>${d(n.label)}</span>
          <strong>${d(n.count)}</strong>
        </button>
      `).join("")}
    </nav>
  `;
}
function qt(e) {
  return [...T.values()].filter((t) => e === "installed" ? Pe(t.moduleId) : e === "free" || e === "premium" ? t.tier === e : !0).sort(ie);
}
function Ut(e) {
  return [...I.values()].filter((t) => e === "installed" ? Pe(t.moduleId) : e === "free" || e === "premium" ? t.tier === e : !0).sort(ie);
}
function zt(e, t) {
  return e.length ? e.map((n) => {
    const o = n.icon || (n.tier === "premium" ? "fa-solid fa-gem" : "fa-solid fa-cube"), r = n.entries.map((a) => {
      var c;
      return `
        <li>
          <strong>${d(a.title)}</strong>
          ${a.summary ? `<span>${d(a.summary)}</span>` : ""}
          ${(c = a.tags) != null && c.length ? `
            <div class="holosuite-whats-new-tags">
              ${a.tags.map((u) => `<span>${d(u)}</span>`).join("")}
            </div>
          ` : ""}
        </li>
      `;
    }).join(""), s = n.url ? `
          <a class="holosuite-whats-new-link" href="${d(n.url)}" target="_blank" rel="noreferrer">
            <span>Find out more</span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        ` : "";
    return `
        <article class="holosuite-whats-new-card">
          <header>
            <span class="holosuite-whats-new-icon" data-holosuite-app-icon="${d(n.moduleId)}"><i class="${d(o)}"></i></span>
            <div>
              <h3>${d(n.title)}</h3>
            </div>
          </header>
          <ul>${r}</ul>
          ${s}
        </article>
      `;
  }).join("") : `<p class="holosuite-empty">${d(t)}</p>`;
}
function Ze(e, t) {
  const n = qt(e), o = Ut(e), r = t === "releases" ? o : n, s = t === "releases" ? "No releases match this filter yet." : "No updates match this filter yet.";
  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">Release Feed</span>
        <h2>What's New</h2>
      </div>
    </div>
    ${Gt(t)}
    ${Bt(e)}
    <div class="holosuite-whats-new-list">
      ${zt(r, s)}
    </div>
  `;
}
function et() {
  const e = q(), t = ue(), n = e ?? t, o = e ? `
    <div class="holosuite-settings-notice">
      <i class="fa-solid fa-lock"></i>
      <span>The GM is overriding the HoloSuite visual theme for this world. Your personal choice is paused until the override is removed.</span>
    </div>
  ` : "", r = Object.entries(_).map(([s, a]) => `
    <button
      type="button"
      class="holosuite-theme-choice ${s === n ? "is-active" : ""}"
      data-holosuite-device-style="${d(s)}"
      ${e ? "disabled" : ""}
      aria-pressed="${s === n ? "true" : "false"}"
    >
      <span class="holosuite-theme-preview holosuite-theme-preview--${d(s)}"></span>
      <strong>${d(a)}</strong>
    </button>
  `).join("");
  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">Personal Console</span>
        <h2>Settings</h2>
      </div>
    </div>
    <section class="holosuite-settings-panel">
      ${o}
      <div class="holosuite-settings-field">
        <div>
          <span class="holosuite-kicker">Theme</span>
          <strong>${d(_[n])}</strong>
        </div>
      </div>
      <div class="holosuite-theme-choices">
        ${r}
      </div>
    </section>
  `;
}
function Le(e = "apps", t = "all", n = "releases") {
  const o = e === "whats-new" ? "holosuite-screen--whats-new" : e === "settings" ? "holosuite-screen--settings" : "", r = e === "whats-new" ? Ze(t, n) : e === "settings" ? et() : Qe();
  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
          ${Ke(e)}
        </header>
        <main class="holosuite-screen ${o}">
          ${r}
        </main>
        <footer class="holosuite-dock">
          <button type="button" data-holosuite-action="close" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
        </footer>
      </div>
    </section>
  `;
}
function X(e, t) {
  D = t, e.classList.toggle("is-reordering-apps", t);
}
async function jt(e) {
  const t = [...e.querySelectorAll("[data-holosuite-app]")].map((n) => n.dataset.holosuiteApp ?? "").filter(Boolean);
  await game.settings.set(l, oe, t);
}
const Yt = 12;
function Xt(e, t, n, o) {
  if (e.length === 0) return 0;
  const r = (m) => Math.hypot(
    t - (m.left + m.width / 2),
    n - (m.top + m.height / 2)
  ), s = Math.min(Math.max(o, 0), e.length - 1), a = r(e[s]);
  let c = s, u = a;
  return e.forEach((m, f) => {
    const g = r(m);
    g < u && (c = f, u = g);
  }), c !== s && u + Yt >= a ? s : c;
}
function Jt(e, t, n, o) {
  const s = [...e.querySelectorAll("[data-holosuite-app]")].filter((a) => a !== t)[o] ?? null;
  s ? n.nextElementSibling !== s && e.insertBefore(n, s) : n.nextElementSibling && e.append(n);
}
function Kt(e) {
  var n;
  const t = e.querySelector(".holosuite-app-grid");
  t && (X(e, D), (n = e.querySelector("[data-holosuite-action='reorder-done']")) == null || n.addEventListener("click", (o) => {
    o.preventDefault(), o.stopPropagation(), X(e, !1);
  }), t.querySelectorAll("[data-holosuite-app]").forEach((o) => {
    let r = null, s = null, a = !1, c = 0, u = 0, m = 0, f = 0, g = null, E = [], S = 0;
    const me = (h) => {
      const b = o.getBoundingClientRect(), N = [...t.querySelectorAll("[data-holosuite-app]")];
      E = N.map((rt) => rt.getBoundingClientRect()), S = Math.max(0, N.indexOf(o)), X(e, !0), a = !0, Z = Date.now() + 700, m = c - b.left, f = u - b.top, g = document.createElement("div"), g.className = "holosuite-app-placeholder", g.style.height = `${b.height}px`, g.setAttribute("aria-hidden", "true"), o.before(g), o.style.height = `${b.height}px`, o.style.left = `${b.left}px`, o.style.top = `${b.top}px`, o.style.width = `${b.width}px`, o.classList.add("is-being-reordered");
      try {
        o.setPointerCapture(h);
      } catch {
      }
    };
    o.addEventListener("pointerdown", (h) => {
      !h.isPrimary || h.button !== 0 || (s = h.pointerId, c = h.clientX, u = h.clientY, D ? (h.preventDefault(), me(h.pointerId)) : r = window.setTimeout(() => me(h.pointerId), 550));
    }), o.addEventListener("pointermove", (h) => {
      if (h.pointerId !== s) return;
      if (!a) {
        Math.hypot(h.clientX - c, h.clientY - u) > 8 && r !== null && (window.clearTimeout(r), r = null);
        return;
      }
      h.preventDefault(), o.style.left = `${h.clientX - m}px`, o.style.top = `${h.clientY - f}px`;
      const b = t.getBoundingClientRect();
      if (g && h.clientX >= b.left && h.clientX <= b.right && h.clientY >= b.top && h.clientY <= b.bottom) {
        const N = Xt(
          E,
          h.clientX,
          h.clientY,
          S
        );
        N !== S && (Jt(t, o, g, N), S = N);
      }
    });
    const pe = (h) => {
      h.pointerId === s && (r !== null && window.clearTimeout(r), r = null, s = null, a && (h.preventDefault(), a = !1, E = [], g == null || g.replaceWith(o), g = null, o.classList.remove("is-being-reordered"), o.style.removeProperty("height"), o.style.removeProperty("left"), o.style.removeProperty("top"), o.style.removeProperty("width"), Z = Date.now() + 450, jt(t)));
    };
    o.addEventListener("pointerup", pe), o.addEventListener("pointercancel", pe), o.addEventListener("contextmenu", (h) => {
      D && h.preventDefault();
    });
  }));
}
function J(e) {
  e && (e.querySelectorAll("[data-holosuite-app]").forEach((t) => {
    t.addEventListener("click", (n) => {
      if (D || Date.now() < Z) {
        n.preventDefault(), n.stopPropagation();
        return;
      }
      Wt(n.currentTarget.dataset.holosuiteApp ?? "");
    });
  }), e.querySelectorAll("[data-holosuite-action='whats-new']").forEach((t) => {
    t.addEventListener("click", (n) => {
      n.preventDefault(), n.stopPropagation(), i == null || i.showWhatsNew();
    });
  }), e.querySelectorAll("[data-holosuite-action='apps']").forEach((t) => {
    t.addEventListener("click", (n) => {
      n.preventDefault(), n.stopPropagation(), i == null || i.showApps();
    });
  }), e.querySelectorAll("[data-holosuite-action='settings']").forEach((t) => {
    t.addEventListener("click", (n) => {
      n.preventDefault(), n.stopPropagation(), i == null || i.showSettings();
    });
  }), e.querySelectorAll("[data-holosuite-device-style]").forEach((t) => {
    t.addEventListener("click", (n) => {
      const o = n.currentTarget.dataset.holosuiteDeviceStyle;
      i == null || i.setDeviceStyle(ce(o));
    });
  }), e.querySelectorAll("[data-holosuite-form-factor-choice]").forEach((t) => {
    t.addEventListener("click", (n) => {
      n.currentTarget.dataset.holosuiteFormFactorChoice, i == null || i.setFormFactor(de());
    });
  }), e.querySelectorAll("[data-holosuite-filter]").forEach((t) => {
    t.addEventListener("click", (n) => {
      const o = n.currentTarget.dataset.holosuiteFilter;
      i == null || i.setWhatsNewFilter(Qt(o));
    });
  }), e.querySelectorAll("[data-holosuite-whats-new-tab]").forEach((t) => {
    t.addEventListener("click", (n) => {
      const o = n.currentTarget.dataset.holosuiteWhatsNewTab;
      i == null || i.setWhatsNewTab(Zt(o));
    });
  }), e.querySelectorAll("[data-holosuite-action='close']").forEach((t) => {
    t.addEventListener("pointerdown", $e, { capture: !0 }), t.addEventListener("click", $e, { capture: !0 });
  }), Kt(e));
}
function Qt(e) {
  const t = String(e ?? "");
  return t === "free" || t === "premium" || t === "installed" ? t : "all";
}
function Zt(e) {
  return String(e ?? "") === "releases" ? "releases" : "updates";
}
function $e(e) {
  var t;
  e.preventDefault(), e.stopPropagation(), (t = e.stopImmediatePropagation) == null || t.call(e), z();
}
async function z() {
  var o, r;
  if (R) return;
  R = !0;
  const e = i, t = e ? y(e.element) : document.querySelector("#holosuite-launcher"), n = ((o = t == null ? void 0 : t.closest) == null ? void 0 : o.call(t, "#holosuite-launcher, .holosuite-launcher-window")) ?? t;
  i = null, C = null;
  try {
    await ((r = e == null ? void 0 : e.close) == null ? void 0 : r.call(e, { force: !0 }));
  } catch (s) {
    console.warn(`${l} | Foundry did not close the launcher cleanly; removing stale launcher element.`, s);
  } finally {
    R = !1;
  }
  window.setTimeout(() => {
    n != null && n.isConnected && n.remove(), i || Re();
  }, 0);
}
function en() {
  var n;
  const e = game.modules;
  return v((e == null ? void 0 : e.contents) ?? Array.from(((n = e == null ? void 0 : e.values) == null ? void 0 : n.call(e)) ?? [])).filter((o) => (o == null ? void 0 : o.active) === !0).map((o) => ({
    id: String(o.id ?? ""),
    title: String(o.title ?? o.id ?? ""),
    version: String(o.version ?? "")
  })).sort((o, r) => o.id.localeCompare(r.id));
}
function tn() {
  const e = Array.from(
    document.querySelectorAll(`link[${O}]`)
  );
  return K.map((t) => {
    const n = e.find((o) => o.getAttribute(O) === t) ?? null;
    return {
      path: t,
      present: n !== null,
      loaded: (n == null ? void 0 : n.sheet) != null,
      href: (n == null ? void 0 : n.href) ?? null
    };
  });
}
function nn() {
  var n;
  const e = game.messages, t = Number((e == null ? void 0 : e.size) ?? ((n = e == null ? void 0 : e.contents) == null ? void 0 : n.length) ?? 0);
  return Number.isFinite(t) ? t : 0;
}
function ge() {
  var c, u, m;
  const e = w(l, B) === !0, t = p(), n = w(l, G) === !0, o = tn(), r = en(), s = game.release, a = game.system;
  return {
    schemaVersion: 1,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    core: {
      version: String(((c = game.modules.get(l)) == null ? void 0 : c.version) ?? ""),
      diagnosticModeActive: t || e || n,
      apiOnly: t,
      cssDisabled: e,
      visualEffectsDisabled: n,
      stylesheets: o,
      launcherOpen: ee(i) || le(),
      registeredApps: [...H.values()].map((f) => ({
        id: f.id,
        title: f.title,
        premium: f.premium === !0,
        playerVisible: f.playerVisible !== !1
      })),
      registeredWhatsNewModules: [...T.keys()].sort(),
      deviceStyle: {
        effective: xe(),
        client: ue(),
        forced: q()
      },
      formFactor: he(),
      appOrder: Ge(),
      colorTheme: Be(w(l, re))
    },
    foundry: {
      version: String((s == null ? void 0 : s.version) ?? game.version ?? ""),
      generation: Number((s == null ? void 0 : s.generation) ?? 0) || null,
      build: Number((s == null ? void 0 : s.build) ?? 0) || null,
      systemId: String((a == null ? void 0 : a.id) ?? ""),
      systemVersion: String((a == null ? void 0 : a.version) ?? ""),
      worldId: String(((u = game.world) == null ? void 0 : u.id) ?? ""),
      isGM: ((m = game.user) == null ? void 0 : m.isGM) === !0
    },
    workload: {
      chatMessages: nn(),
      renderedChatMessages: document.querySelectorAll(".chat-message").length,
      domElements: document.getElementsByTagName("*").length,
      openApplicationWindows: document.querySelectorAll(".window-app, .application").length
    },
    browser: {
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
      },
      hardwareConcurrency: navigator.hardwareConcurrency ?? null,
      deviceMemoryGb: Number(navigator.deviceMemory ?? 0) || null
    },
    activeModules: r
  };
}
function tt() {
  return JSON.stringify(ge(), null, 2);
}
async function on() {
  var t, n, o, r, s, a;
  const e = tt();
  try {
    if ((t = navigator.clipboard) != null && t.writeText)
      await navigator.clipboard.writeText(e);
    else if ((n = game.clipboard) != null && n.copyPlainText)
      await game.clipboard.copyPlainText(e);
    else
      throw new Error("No clipboard API is available.");
    (r = (o = ui.notifications) == null ? void 0 : o.info) == null || r.call(o, "HoloSuite Core diagnostics copied to the clipboard.");
  } catch (c) {
    console.warn(`${l} | Could not copy diagnostics.`, c), (a = (s = ui.notifications) == null ? void 0 : s.error) == null || a.call(s, "Could not copy diagnostics. Use Download JSON instead.");
  }
}
function rn() {
  const e = new Blob([tt()], { type: "application/json" }), t = URL.createObjectURL(e), n = document.createElement("a"), o = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  n.href = t, n.download = `holosuite-core-diagnostics-${o}.json`, n.click(), window.setTimeout(() => URL.revokeObjectURL(t), 0);
}
function De() {
  const e = ge(), t = e.core, n = [
    t.apiOnly ? "API-only" : null,
    t.cssDisabled ? "CSS disabled" : null,
    t.visualEffectsDisabled ? "visual effects disabled" : null
  ].filter(Boolean), o = n.length > 0 ? n.join(", ") : "Normal";
  return `
    <form class="standard-form holosuite-core-diagnostics">
      <p>This report stays on this browser until you copy or download it. It includes module versions and browser/workload counts, but no actor, chat-message, or campaign content.</p>
      <fieldset>
        <legend>Current test state</legend>
        <div class="form-group"><label>Diagnostic mode</label><div class="form-fields"><strong>${d(o)}</strong></div></div>
        <div class="form-group"><label>Core version</label><div class="form-fields"><code>${d(t.version)}</code></div></div>
        <div class="form-group"><label>Core styles loaded</label><div class="form-fields"><strong>${t.stylesheets.filter((r) => r.present).length}/${t.stylesheets.length}</strong></div></div>
        <div class="form-group"><label>Launcher</label><div class="form-fields"><strong>${t.launcherOpen ? "Open" : "Closed"}</strong></div></div>
        <div class="form-group"><label>Chat messages</label><div class="form-fields"><strong>${e.workload.chatMessages} stored / ${e.workload.renderedChatMessages} rendered</strong></div></div>
        <div class="form-group"><label>Active modules</label><div class="form-fields"><strong>${e.activeModules.length}</strong></div></div>
      </fieldset>
      <footer class="form-footer">
        <button type="button" data-action="refresh"><i class="fas fa-rotate"></i> Refresh</button>
        <button type="button" data-action="copy"><i class="fas fa-copy"></i> Copy JSON</button>
        <button type="button" data-action="download"><i class="fas fa-download"></i> Download JSON</button>
      </footer>
      <details>
        <summary>JSON preview</summary>
        <pre style="max-height: 360px; overflow: auto; user-select: text; white-space: pre-wrap;">${d(JSON.stringify(e, null, 2))}</pre>
      </details>
    </form>
  `;
}
function Ne(e, t) {
  var n, o, r;
  e && ((n = e.querySelector("[data-action='refresh']")) == null || n.addEventListener("click", () => t.render(!1)), (o = e.querySelector("[data-action='copy']")) == null || o.addEventListener("click", () => void on()), (r = e.querySelector("[data-action='download']")) == null || r.addEventListener("click", rn));
}
class nt extends ke {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-core-diagnostics",
      title: "HoloSuite Core Diagnostics",
      classes: ["holosuite-core-diagnostics-window"],
      popOut: !0,
      resizable: !0,
      width: 720,
      height: 720
    });
  }
  async _renderInner() {
    return $(De());
  }
  activateListeners(t) {
    super.activateListeners(t), Ne(y(t), this);
  }
  async _renderHTML() {
    const t = document.createElement("template");
    return t.innerHTML = De().trim(), t.content;
  }
  _replaceHTML(t, n) {
    const o = y(n), r = (o == null ? void 0 : o.querySelector(".window-content")) ?? o;
    if (!r) return;
    const s = t instanceof DocumentFragment || t instanceof HTMLElement ? t : y(t);
    s ? r.replaceChildren(s) : r.innerHTML = String(t ?? ""), Ne(r, this);
  }
  async _updateObject() {
  }
}
A(nt, "DEFAULT_OPTIONS", {
  id: "holosuite-core-diagnostics",
  tag: "section",
  classes: ["holosuite-core-diagnostics-window"],
  window: {
    title: "HoloSuite Core Diagnostics",
    resizable: !0
  },
  position: {
    width: 720,
    height: 720
  }
});
class V extends ke {
  constructor() {
    super(...arguments);
    A(this, "currentView", "apps");
    A(this, "whatsNewFilter", "all");
    A(this, "whatsNewTab", "releases");
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-launcher",
      title: "HoloSuite",
      classes: ["holosuite-launcher-window"],
      popOut: !0,
      resizable: !1,
      width: 483,
      height: "auto"
    });
  }
  render(...n) {
    var o, r;
    return p() ? ((r = (o = ui.notifications) == null ? void 0 : o.warn) == null || r.call(o, "HoloSuite Core is in API-only diagnostic mode on this browser."), this) : super.render(...n);
  }
  async _renderInner() {
    return $(Le(this.currentView, this.whatsNewFilter, this.whatsNewTab));
  }
  activateListeners(n) {
    super.activateListeners(n), J(y(n)), this.resizeForFormFactor();
  }
  async _renderHTML() {
    const n = document.createElement("template");
    return n.innerHTML = Le(this.currentView, this.whatsNewFilter, this.whatsNewTab).trim(), n.content;
  }
  _replaceHTML(n, o) {
    const r = this.getRenderTarget(o);
    if (!r) return;
    const s = n instanceof DocumentFragment || n instanceof HTMLElement ? n : y(n);
    s ? r.replaceChildren(s) : r.innerHTML = String(n ?? ""), J(r), this.resizeForFormFactor();
  }
  async close(n = {}) {
    return D = !1, i = null, super.close(n);
  }
  getLauncherRoot(n = {}) {
    var s;
    const o = y(this.element), r = (o == null ? void 0 : o.querySelector(".holosuite-phone")) ?? ((s = o == null ? void 0 : o.closest) == null ? void 0 : s.call(o, ".holosuite-phone")) ?? null;
    return r != null && r.isConnected ? r : n.includeDocumentFallback === !1 ? null : document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone");
  }
  getRenderTarget(n) {
    const o = y(n);
    return o ? o.querySelector(".window-content") ?? o.querySelector(".holosuite-launcher-window .window-content") ?? o : null;
  }
  updateRenderedView() {
    const n = this.getLauncherRoot();
    if (!n) return !1;
    const o = n.querySelector(".holosuite-status-bar"), r = n.querySelector(".holosuite-screen");
    return !o || !r ? !1 : (o.innerHTML = `
      <span>HoloSuite</span>
      ${Ke(this.currentView)}
    `, r.innerHTML = this.currentView === "whats-new" ? Ze(this.whatsNewFilter, this.whatsNewTab) : this.currentView === "settings" ? et() : Qe(), r.classList.toggle("holosuite-screen--whats-new", this.currentView === "whats-new"), r.classList.toggle("holosuite-screen--settings", this.currentView === "settings"), J(n), !0);
  }
  showApps() {
    this.currentView = "apps", this.updateRenderedView() || this.render(!1);
  }
  showWhatsNew() {
    D = !1, this.currentView = "whats-new", Et(), this.updateRenderedView() || this.render(!1);
  }
  showSettings() {
    D = !1, this.currentView = "settings", this.updateRenderedView() || this.render(!1);
  }
  async setDeviceStyle(n) {
    q() || (await game.settings.set(l, te, n), this.currentView = "settings", W(), this.refreshCurrentView());
  }
  async setFormFactor(n) {
    await game.settings.set(l, ne, n), this.currentView = "settings", fe(), this.resizeForFormFactor(), this.refreshCurrentView();
  }
  resizeForFormFactor() {
    var r, s;
    const n = _t(), o = ((r = y(this.element)) == null ? void 0 : r.closest("#holosuite-launcher, .holosuite-launcher-window")) ?? y(this.element);
    o == null || o.style.setProperty("--hs-launcher-width", `${n.width}px`), o == null || o.style.setProperty("--hs-launcher-height", `${n.height}px`), o == null || o.style.setProperty("width", `${n.width}px`, "important"), o == null || o.style.setProperty("height", `${n.height}px`, "important");
    try {
      (s = this.setPosition) == null || s.call(this, n);
    } catch {
    }
  }
  refreshCurrentView() {
    this.updateRenderedView() || this.render(!1);
  }
  setWhatsNewFilter(n) {
    this.currentView = "whats-new", this.whatsNewFilter = n, this.updateRenderedView() || this.render(!1);
  }
  setWhatsNewTab(n) {
    this.currentView = "whats-new", this.whatsNewTab = n, this.updateRenderedView() || this.render(!1);
  }
  async _updateObject() {
  }
}
A(V, "DEFAULT_OPTIONS", {
  id: "holosuite-launcher",
  tag: "section",
  classes: ["holosuite-launcher-window"],
  window: {
    title: "HoloSuite",
    resizable: !1
  },
  position: {
    width: 483,
    height: "auto"
  }
});
const L = {
  registerApp(e) {
    const t = Ct(e);
    return t ? (H.set(t.id, t), p() || i == null || i.render(!1), t) : null;
  },
  unregisterApp(e) {
    const t = H.delete(String(e ?? ""));
    return t && !p() && (i == null || i.render(!1)), t;
  },
  getApps() {
    return [...H.values()];
  },
  getDiagnostics() {
    return ge();
  },
  registerWhatsNew(e) {
    return Xe(e);
  },
  unregisterWhatsNew(e) {
    const t = T.delete(String(e ?? ""));
    return t && !p() && (i == null || i.render(!1)), t;
  },
  getWhatsNew() {
    return [...T.values()].sort(ie);
  },
  async openLauncher() {
    var e, t;
    return p() ? ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "HoloSuite Core is in API-only diagnostic mode on this browser."), null) : C || (C = (async () => {
      ee(i) || (i = null), i || (i = new V());
      try {
        await i.render(!0);
      } catch (n) {
        console.warn(`${l} | Recreating launcher after render failure.`, n), i = new V(), await i.render(!0);
      }
      return $t(i), i;
    })().finally(() => {
      C = null;
    }), C);
  },
  async toggleLauncher() {
    return C || (ee(i) ? (await z(), null) : (le() && Re(), Dt(), L.openLauncher()));
  }
};
function ot() {
  const e = game.modules.get(l);
  if (game.holosuite = L, globalThis.HoloSuiteCoreApi = L, e)
    try {
      e.api = L;
    } catch (t) {
      console.warn(`${l} | Could not attach API to game.modules; using game.holosuite fallback.`, t);
    }
  Hooks.callAll(`${l}.apiReady`, L);
}
Hooks.once("init", () => {
  ze(), Ft(), We(), Ve(), kt(), ot();
});
Hooks.on("getSceneControlButtons", Tt);
Hooks.on("renderSceneControls", (e, t) => Ht(t));
Hooks.on("renderSidebar", ae);
Hooks.on("renderSidebarTab", ae);
Hooks.on("renderSettingsConfig", It);
Hooks.once("ready", () => {
  Q = !0, ot(), ze(), W(), Mt(), fe(), p() ? console.warn(`${l} | API-only diagnostic mode is enabled on this browser.`) : (ae(), Je()), console.log(`${l} | Ready. API available at game.modules.get("${l}").api`);
});
