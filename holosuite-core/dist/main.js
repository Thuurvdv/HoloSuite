var lt = Object.defineProperty;
var ct = (e, t, n) => t in e ? lt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var I = (e, t, n) => ct(e, typeof t != "symbol" ? t + "" : t, n);
const te = [
  "modules/holosuite-core/styles/holosuite-tokens.css",
  "modules/holosuite-core/styles/holosuite-core.css"
], R = "data-holosuite-core-stylesheet";
function ut(e, t) {
  const n = String(t ?? "").trim();
  return n ? `${e}?v=${encodeURIComponent(n)}` : e;
}
function dt(e, t = document, n = "") {
  const o = Array.from(
    t.querySelectorAll(`link[${R}]`)
  );
  if (!e) {
    for (const c of o) c.remove();
    return;
  }
  const r = t.head;
  if (!r) return;
  const i = new Set(te), s = /* @__PURE__ */ new Set();
  for (const c of o) {
    const u = c.getAttribute(R) ?? "";
    if (!i.has(u) || s.has(u)) {
      c.remove();
      continue;
    }
    s.add(u);
  }
  for (const c of te) {
    if (s.has(c)) continue;
    const u = t.createElement("link");
    u.rel = "stylesheet", u.href = ut(c, n), u.setAttribute(R, c), r.append(u);
  }
}
function P(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function be(e, t) {
  return P(e) ? t.includes(String(e.name ?? "")) : !1;
}
function Se(e) {
  if (!P(e) || !("tools" in e)) return !1;
  const t = String(e.name ?? "");
  return !["measure", "templates", "walls", "lighting", "sounds", "notes", "tiles", "drawings"].includes(t);
}
function ht(e, t, n) {
  if (Array.isArray(e))
    return e.find((o) => be(o, t)) ?? (n ? e.find(Se) : null) ?? null;
  if (!P(e)) return null;
  for (const o of t)
    if (P(e[o])) return e[o];
  return Object.values(e).find((o) => be(o, t)) ?? (n ? Object.values(e).find(Se) : null) ?? null;
}
function ft(e) {
  const t = Object.values(e).map((n) => Number(n == null ? void 0 : n.order)).filter(Number.isFinite);
  return t.length ? Math.max(...t) + 1 : Object.keys(e).length;
}
function ve(e, t, n = ["tokens", "token"], o = {}) {
  const r = ht(e, n, o.allowFallback === !0);
  if (!r) return !1;
  const i = r.tools;
  return Array.isArray(i) ? i.some((s) => (s == null ? void 0 : s.name) === t.name) ? !1 : (i.push(t), !0) : !P(i) || i[t.name] ? !1 : (i[t.name] = { ...t, order: t.order ?? ft(i) }, !0);
}
const l = "holosuite-core", U = "apiOnlyForDebugging", j = "disableCoreCssForDebugging", z = "disableVisualEffectsForDebugging", Oe = "disableForPlayers", ie = "deviceStyle", Ie = "forceDeviceStyle", se = "formFactor", ae = "appOrder", le = "theme", ce = "whatsNewLastSeen", gt = "openLauncher", Ee = "data-holosuite-foundry-generation", Ce = "data-holosuite-debug-no-effects", mt = `modules/${l}/data/whats-new.json`, pt = Date.UTC(2026, 7, 1), Te = {
  base: "HoloSuite",
  "space-police": "Space Police"
}, K = {
  "": "Allow User Choice",
  base: "HoloSuite",
  "space-police": "Space Police"
}, x = {
  base: Te.base,
  "space-police": Te["space-police"]
}, wt = {
  "": K[""],
  base: K.base,
  "space-police": K["space-police"]
}, yt = {
  phone: "Phone",
  datapad: "Datapad",
  computer: "Computer"
}, Fe = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
}, D = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map();
let a = null, A = null, W = !1, _e = 0, ne = !1, Re = null, Le = !1, _ = null, L = !1, oe = 0;
function bt() {
  var n, o, r, i, s, c;
  const e = ((o = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : o.api) ?? ((r = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : r.api) ?? null, t = ((s = (i = globalThis.foundry) == null ? void 0 : i.applications) == null ? void 0 : s.api) ?? ((c = foundry == null ? void 0 : foundry.applications) == null ? void 0 : c.api) ?? null;
  return globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV2);
}
const Pe = bt();
function re(e) {
  return e ? !!e.getLauncherRoot({ includeDocumentFallback: !1 }) : !1;
}
function h(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function M(e, t, n = `${t}s`) {
  return `${e} ${e === 1 ? t : n}`;
}
function b(e, t) {
  try {
    return game.settings.get(e, t);
  } catch {
    return null;
  }
}
function y() {
  return Re ?? b(l, U) === !0;
}
function Q(e) {
  var t;
  return ((t = game.modules.get(e)) == null ? void 0 : t.api) ?? null;
}
function St() {
  var e, t, n;
  return String(((t = (e = game.user) == null ? void 0 : e.character) == null ? void 0 : t.name) ?? ((n = game.user) == null ? void 0 : n.name) ?? "Player");
}
function vt(e) {
  var t, n, o, r, i, s;
  if (e === "cybercall") {
    const c = T(b("cybercall", "contacts")), u = T(b("cybercall", "groupContacts"));
    return M(c.length + u.length, "link");
  }
  if (e === "bounty-board") {
    const c = T((n = (t = Q("bounty-board")) == null ? void 0 : t.getAllBounties) == null ? void 0 : n.call(t, { includeHidden: !1 }));
    return M(c.length, "contract");
  }
  if (e === "csi-toolkit") {
    const c = Object.values(((r = (o = Q("csi-toolkit")) == null ? void 0 : o.getCases) == null ? void 0 : r.call(o)) ?? {}).filter((u) => (u == null ? void 0 : u.visibility) !== "gm");
    return M(c.length, "case");
  }
  if (e === "galaxy-map") {
    const c = T((s = (i = Q("galaxy-map")) == null ? void 0 : i.getMaps) == null ? void 0 : s.call(i)).filter((u) => (u == null ? void 0 : u.visibility) === "players");
    return M(c.length, "chart");
  }
  return "";
}
function T(e) {
  return Array.isArray(e) ? e : [];
}
function Et(e) {
  const t = String((e == null ? void 0 : e.title) ?? "").trim();
  if (!t) return null;
  const o = T(e == null ? void 0 : e.tags).some((r) => /^foundry\b/i.test(String(r ?? "").trim())) ? ["Foundry v12–14"] : [];
  return {
    title: t,
    summary: String((e == null ? void 0 : e.summary) ?? "").trim(),
    tags: o
  };
}
function xe(e) {
  const t = String((e == null ? void 0 : e.moduleId) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), o = T(e == null ? void 0 : e.entries).map((i) => Et(i)).filter((i) => !!i);
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
function V(e) {
  const t = Date.parse(String(e.updated ?? ""));
  return Number.isFinite(t) ? t : 0;
}
function ue(e, t) {
  return V(t) - V(e) || e.title.localeCompare(t.title);
}
function Me(e) {
  var t, n;
  return ((n = (t = game.modules) == null ? void 0 : t.has) == null ? void 0 : n.call(t, e)) === !0;
}
function Ct() {
  const e = Number(b(l, ce));
  return Number.isFinite(e) ? e : 0;
}
function Tt() {
  const e = Ct();
  return [...N.values(), ...F.values()].filter((t) => V(t) > e).reduce((t, n) => t + n.entries.length, 0);
}
function Lt() {
  try {
    game.settings.set(l, ce, Date.now());
  } catch (e) {
    console.warn(`${l} | Could not update what's new read state.`, e);
  }
}
function $t(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), o = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !t || !n || !o || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${l} | Ignoring invalid app registration.`, e), null) : {
    id: t,
    title: n,
    icon: o,
    premium: e.premium === !0,
    playerVisible: e.playerVisible !== !1,
    description: String(e.description ?? "").trim(),
    featureId: String(e.featureId ?? t).trim() || t,
    open: e.open,
    contextActions: (e.contextActions ?? []).filter((r) => (r == null ? void 0 : r.label) && typeof r.callback == "function")
  };
}
function At(e) {
  return e.replace(/^HoloSuite\s*:?\s*/i, "").trim() || e;
}
function Dt(e) {
  var r;
  if (y()) return;
  const t = ((r = game.user) == null ? void 0 : r.isGM) === !0;
  if (!t && X()) return;
  const n = () => ({
    name: "holosuite-core-launcher",
    title: t ? "HoloSuite Command Deck" : "HoloSuite Player View",
    icon: Je(),
    button: !0,
    visible: !0,
    onClick: Ve,
    onChange: It
  }), o = ve(e, n(), ["tiles", "tile"]);
  ve(e, n(), ["tokens", "token"], { allowFallback: !o });
}
function Nt() {
  var e;
  return !y() && (((e = game.user) == null ? void 0 : e.isGM) === !0 || !X());
}
function de() {
  y() || document.querySelectorAll(".holosuite-sidebar-launcher, .holosuite-floating-launcher").forEach((e) => e.remove());
}
function v(e) {
  var o;
  if (e instanceof HTMLElement) return e;
  if (Array.isArray(e) && e[0] instanceof HTMLElement) return e[0];
  const t = e, n = ((o = t == null ? void 0 : t.get) == null ? void 0 : o.call(t, 0)) ?? (t == null ? void 0 : t[0]);
  return n instanceof HTMLElement ? n : null;
}
function kt(e) {
  var i;
  const t = new Set(document.querySelectorAll("#holosuite-launcher, .holosuite-launcher-window"));
  if (t.size <= 1) return;
  const n = e ? v(e.element) : null, r = ((i = n == null ? void 0 : n.closest) == null ? void 0 : i.call(n, "#holosuite-launcher, .holosuite-launcher-window")) ?? [...t].at(-1) ?? null;
  for (const s of t)
    s !== r && s.remove();
}
function We() {
  document.querySelectorAll("#holosuite-launcher, .holosuite-launcher-window").forEach((e) => {
    e.remove();
  });
}
function he() {
  return document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone") !== null;
}
function Ht() {
  a = null, A = null, W = !1;
}
function Ot(e) {
  const t = e.find((n) => typeof n == "boolean");
  return typeof t == "boolean" ? t : null;
}
function Ve() {
  return _e = Date.now(), k.toggleLauncher();
}
function It(...e) {
  const t = Ot(e);
  return t === !1 ? (J(), null) : t === null && Date.now() - _e < 100 ? null : k.openLauncher();
}
function Ft(e) {
  var i;
  if (y()) return;
  const t = ((i = game.user) == null ? void 0 : i.isGM) === !0;
  if (!t && X()) return;
  const n = v(e) ?? document.querySelector("#controls, #scene-controls");
  if (!n || n.querySelector("[data-tool='holosuite-core-launcher']")) return;
  const o = n.querySelector(
    ".control-tools.active, .sub-controls.active, .scene-control-tools.active, .control-tools, .sub-controls, .scene-control-tools"
  );
  if (!o) return;
  const r = document.createElement("li");
  r.className = "control-tool holosuite-scene-control", r.dataset.tool = "holosuite-core-launcher", r.title = t ? "HoloSuite Command Deck" : "HoloSuite Player View", r.innerHTML = `<i class="${Je()}"></i>`, r.addEventListener("click", (s) => {
    s.preventDefault(), s.stopPropagation(), Ve();
  }), o.appendChild(r);
}
function _t(e, t) {
  var i;
  const n = v(t);
  if (!n) return;
  const r = [
    `input[name="${l}.${U}"]`,
    `input[name="${l}.${j}"]`,
    `input[name="${l}.${z}"]`
  ].map((s) => {
    var c;
    return ((c = n.querySelector(s)) == null ? void 0 : c.closest(".form-group")) ?? null;
  }).filter((s) => s !== null);
  for (const s of r) (i = s.parentElement) == null || i.append(s);
}
function Rt() {
  game.settings.register(l, U, {
    name: "Debugging: API-Only Mode (This Browser)",
    hint: "Diagnostic only. Keeps Core's registration API active while disabling its launcher, scene-control UI, sidebar cleanup, and What's New catalog work on this browser.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => Pt(e)
  }), game.settings.register(l, j, {
    name: "Debugging: Disable HoloSuite Core CSS (This Browser)",
    hint: "Diagnostic only. Temporarily removes Core's shared tokens and launcher styles from this browser. HoloSuite interfaces will appear unstyled. Leave this off during normal play.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => Be(e)
  }), game.settings.register(l, z, {
    name: "Debugging: Disable Core Visual Effects (This Browser)",
    hint: "Diagnostic only. Keeps Core's layout and colors while disabling launcher transitions, animations, filters, shadows, and glows on this browser.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => qe(e)
  }), game.settings.register(l, ie, {
    name: "HoloSuite Theme",
    hint: "Choose the HoloSuite launcher theme for this user.",
    scope: "client",
    config: !0,
    type: String,
    choices: x,
    default: "base",
    restricted: !1,
    onChange: () => {
      B(), a == null || a.refreshCurrentView();
    }
  }), game.settings.register(l, Ie, {
    name: "Force HoloSuite Theme",
    hint: "When set, every user sees this HoloSuite launcher theme instead of their personal choice.",
    scope: "world",
    config: !0,
    type: String,
    choices: wt,
    default: "",
    restricted: !0,
    onChange: () => {
      B(), a == null || a.refreshCurrentView();
    }
  }), game.settings.register(l, se, {
    name: "HoloSuite Form Factor",
    hint: "Choose the launcher shape for this user: phone, wide datapad, or large computer display.",
    scope: "client",
    config: !1,
    type: String,
    choices: yt,
    default: "phone",
    restricted: !1,
    onChange: () => {
      we(), a == null || a.refreshCurrentView(), a == null || a.resizeForFormFactor();
    }
  }), game.settings.register(l, ae, {
    name: "HoloSuite App Order",
    hint: "Stores this user's custom launcher order.",
    scope: "client",
    config: !1,
    type: Array,
    default: [],
    restricted: !1
  }), game.settings.register(l, le, {
    name: "HoloSuite Color Theme",
    hint: "Changes the shared color theme used by HoloSuite windows.",
    scope: "world",
    config: !0,
    type: String,
    choices: Fe,
    default: "default",
    restricted: !0,
    onChange: (e) => ze(e)
  }), game.settings.register(l, Oe, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !0
  }), game.settings.register(l, ce, {
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
    type: G,
    restricted: !0
  }), game.settings.registerMenu(l, "diagnostics", {
    name: "HoloSuite Core Diagnostics",
    label: "Open Diagnostics",
    hint: "Inspect, copy, or download the current HoloSuite and Foundry test state.",
    icon: "fas fa-stethoscope",
    type: it,
    restricted: !0
  });
}
async function $e() {
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
function Pt(e = b(l, U)) {
  const t = e === !0;
  if (Re = t, t) {
    document.querySelectorAll(
      "[data-tool='holosuite-core-launcher'], .holosuite-scene-control, .holosuite-sidebar-launcher, .holosuite-floating-launcher"
    ).forEach((n) => n.remove()), (a || he()) && J(), ne && $e(), console.warn(`${l} | API-only diagnostic mode is enabled on this browser.`);
    return;
  }
  ne && (Ze(), $e());
}
function Be(e = b(l, j)) {
  var o;
  const t = e === !0, n = String(((o = game.modules.get(l)) == null ? void 0 : o.version) ?? "");
  dt(!t, document, n), t && console.warn(`${l} | Core CSS is disabled on this browser for debugging.`);
}
function qe(e = b(l, z)) {
  const t = e === !0;
  for (const n of [document.documentElement, document.body].filter(Boolean))
    t ? n.setAttribute(Ce, "true") : n.removeAttribute(Ce);
  t && console.warn(`${l} | Core visual effects are disabled on this browser for debugging.`);
}
function xt() {
  var e, t;
  (t = (e = game.keybindings) == null ? void 0 : e.register) == null || t.call(e, l, gt, {
    name: "Open HoloSuite",
    hint: "Open the HoloSuite launcher and registered app deck.",
    editable: [],
    restricted: !1,
    onDown: () => {
      var n, o, r, i;
      return y() ? ((o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, "HoloSuite Core is in API-only diagnostic mode on this browser."), !1) : Nt() ? (k.toggleLauncher(), !0) : ((i = (r = ui.notifications) == null ? void 0 : r.warn) == null || i.call(r, "HoloSuite is disabled for players in this world."), !1);
    }
  });
}
function fe(e) {
  return Object.hasOwn(x, String(e)) ? String(e) : "base";
}
function Y() {
  const e = String(b(l, Ie) ?? "");
  return Object.hasOwn(x, e) ? e : null;
}
function ge() {
  return fe(b(l, ie));
}
function Ge() {
  return Y() ?? ge();
}
function Ue(e) {
  return Object.hasOwn(Fe, String(e)) ? String(e) : "default";
}
function me(e) {
  return "phone";
}
function pe() {
  return me(b(l, se));
}
function Mt(e = pe()) {
  const t = e === "computer" ? { width: 980, height: 720 } : e === "datapad" ? { width: 760, height: 680 } : { width: 483, height: 736 };
  return {
    width: Math.min(t.width, Math.max(420, window.innerWidth - 32)),
    height: Math.min(t.height, Math.max(560, window.innerHeight - 48))
  };
}
function je() {
  return T(b(l, ae)).map((e) => String(e ?? "").trim()).filter((e, t, n) => !!e && n.indexOf(e) === t);
}
function Wt(e) {
  const t = fe(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const o of n)
    t === "base" ? o.removeAttribute("data-holosuite-device-style") : o.setAttribute("data-holosuite-device-style", t);
}
function ze(e) {
  const t = Ue(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const o of n)
    t === "default" ? o.removeAttribute("data-holosuite-theme") : o.setAttribute("data-holosuite-theme", t);
}
function Vt(e) {
  const t = me();
  for (const n of [document.documentElement, document.body].filter(Boolean))
    n.setAttribute("data-holosuite-form-factor", t);
}
function B() {
  Wt(Ge());
}
function Bt() {
  ze(b(l, le));
}
function we() {
  Vt(pe());
}
function Ye() {
  var t, n, o;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((o = game == null ? void 0 : game.release) == null ? void 0 : o.generation));
  return Number.isFinite(e) ? e : null;
}
function Xe() {
  const e = Ye(), t = [document.documentElement, document.body].filter(Boolean);
  for (const n of t)
    e === null ? n.removeAttribute(Ee) : n.setAttribute(Ee, String(e));
}
function Je() {
  return Ye() === 12 ? "fa-solid fa-terminal" : "fa-solid fa-mobile-screen-button";
}
function X() {
  try {
    return game.settings.get(l, Oe) === !0;
  } catch {
    return !1;
  }
}
function q(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 ? !0 : X() ? !1 : e.playerVisible !== !1;
}
async function Ke(e) {
  var n, o, r, i;
  const t = D.get(e);
  return t ? q(t) ? t.open() : ((i = (r = ui.notifications) == null ? void 0 : r.warn) == null || i.call(r, `${t.title} is not available from the player view.`), null) : ((o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, `HoloSuite app "${e}" is not registered.`), null);
}
function Qe(e, t = {}) {
  const n = xe(e);
  return !n || V(n) < pt ? null : t.replace === !1 && N.has(n.moduleId) ? N.get(n.moduleId) ?? null : (N.set(n.moduleId, n), y() || a == null || a.render(!1), n);
}
function qt(e, t = {}) {
  const n = xe(e);
  return n ? t.replace === !1 && F.has(n.moduleId) ? F.get(n.moduleId) ?? null : (F.set(n.moduleId, n), y() || a == null || a.render(!1), n) : null;
}
async function Ze() {
  if (!(y() || Le))
    return _ || (_ = (async () => {
      try {
        const e = await fetch(mt, { cache: "no-cache" });
        if (!e.ok) throw new Error(`HTTP ${e.status}`);
        const t = await e.json(), n = T(t == null ? void 0 : t.modules);
        for (const r of n)
          Qe(r, { replace: !1 });
        const o = T(t == null ? void 0 : t.releases);
        for (const r of o)
          qt(r, { replace: !1 });
        Le = !0;
      } catch (e) {
        console.warn(`${l} | Could not load bundled what's new catalog.`, e);
      }
    })().finally(() => {
      _ = null;
    }), _);
}
function et(e) {
  const t = Tt(), n = t > 0 ? `<span>${h(t)}</span>` : "";
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
function Gt(e) {
  return `
    <span class="holosuite-app-icon" data-holosuite-app-icon="${h(e.id)}">
      <i class="${h(e.icon)}"></i>
    </span>
  `;
}
function tt() {
  var w;
  const e = ((w = game.user) == null ? void 0 : w.isGM) === !0, t = je(), n = new Map(t.map((g, m) => [g, m])), o = [...D.values()].filter(q).sort((g, m) => {
    const f = n.get(g.id), p = n.get(m.id);
    return f !== void 0 || p !== void 0 ? f === void 0 ? 1 : p === void 0 ? -1 : f - p : g.title.localeCompare(m.title);
  }), r = e ? "GM Command Deck" : "Player Link", i = e ? "Apps" : "Commlink", s = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", c = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">Active User</span>
        <strong>${h(St())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>LINK STABLE</span>
      </div>
    </section>
  `, u = o.map((g) => {
    const m = At(g.title), f = e && g.description ? `<p>${h(g.description)}</p>` : "", p = e ? "" : vt(g.id);
    return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${h(g.id)}">
          ${Gt(g)}
          <span class="holosuite-app-title">${h(m)}</span>
          ${f}
          ${p ? `<span class="holosuite-app-count">${h(p)}</span>` : ""}
        </button>
      `;
  }).join("");
  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">${h(r)}</span>
        <h2>${h(i)}</h2>
      </div>
    </div>
    ${c}
    <div class="holosuite-app-grid">
      ${o.length ? u : `<p class="holosuite-empty">${h(s)}</p>`}
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
function Ut(e) {
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
          data-holosuite-filter="${h(n.id)}"
        >${h(n.label)}</button>
      `).join("")}
    </nav>
  `;
}
function jt(e) {
  return `
    <nav class="holosuite-whats-new-tabs" aria-label="What's New tabs">
      ${[
    { id: "updates", label: "Updates", count: N.size },
    { id: "releases", label: "Releases", count: F.size }
  ].map((n) => `
        <button
          type="button"
          class="${n.id === e ? "is-active" : ""}"
          data-holosuite-whats-new-tab="${h(n.id)}"
        >
          <span>${h(n.label)}</span>
          <strong>${h(n.count)}</strong>
        </button>
      `).join("")}
    </nav>
  `;
}
function zt(e) {
  return [...N.values()].filter((t) => e === "installed" ? Me(t.moduleId) : e === "free" || e === "premium" ? t.tier === e : !0).sort(ue);
}
function Yt(e) {
  return [...F.values()].filter((t) => e === "installed" ? Me(t.moduleId) : e === "free" || e === "premium" ? t.tier === e : !0).sort(ue);
}
function Xt(e, t) {
  return e.length ? e.map((n) => {
    const o = n.icon || (n.tier === "premium" ? "fa-solid fa-gem" : "fa-solid fa-cube"), r = n.entries.map((s) => {
      var c;
      return `
        <li>
          <strong>${h(s.title)}</strong>
          ${s.summary ? `<span>${h(s.summary)}</span>` : ""}
          ${(c = s.tags) != null && c.length ? `
            <div class="holosuite-whats-new-tags">
              ${s.tags.map((u) => `<span>${h(u)}</span>`).join("")}
            </div>
          ` : ""}
        </li>
      `;
    }).join(""), i = n.url ? `
          <a class="holosuite-whats-new-link" href="${h(n.url)}" target="_blank" rel="noreferrer">
            <span>Find out more</span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        ` : "";
    return `
        <article class="holosuite-whats-new-card">
          <header>
            <span class="holosuite-whats-new-icon" data-holosuite-app-icon="${h(n.moduleId)}"><i class="${h(o)}"></i></span>
            <div>
              <h3>${h(n.title)}</h3>
            </div>
          </header>
          <ul>${r}</ul>
          ${i}
        </article>
      `;
  }).join("") : `<p class="holosuite-empty">${h(t)}</p>`;
}
function nt(e, t) {
  const n = zt(e), o = Yt(e), r = t === "releases" ? o : n, i = t === "releases" ? "No releases match this filter yet." : "No updates match this filter yet.";
  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">Release Feed</span>
        <h2>What's New</h2>
      </div>
    </div>
    ${jt(t)}
    ${Ut(e)}
    <div class="holosuite-whats-new-list">
      ${Xt(r, i)}
    </div>
  `;
}
function ot() {
  const e = Y(), t = ge(), n = e ?? t, o = e ? `
    <div class="holosuite-settings-notice">
      <i class="fa-solid fa-lock"></i>
      <span>The GM is overriding the HoloSuite visual theme for this world. Your personal choice is paused until the override is removed.</span>
    </div>
  ` : "", r = Object.entries(x).map(([i, s]) => `
    <button
      type="button"
      class="holosuite-theme-choice ${i === n ? "is-active" : ""}"
      data-holosuite-device-style="${h(i)}"
      ${e ? "disabled" : ""}
      aria-pressed="${i === n ? "true" : "false"}"
    >
      <span class="holosuite-theme-preview holosuite-theme-preview--${h(i)}"></span>
      <strong>${h(s)}</strong>
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
          <strong>${h(x[n])}</strong>
        </div>
      </div>
      <div class="holosuite-theme-choices">
        ${r}
      </div>
    </section>
  `;
}
function Ae(e = "apps", t = "all", n = "releases") {
  const o = e === "whats-new" ? "holosuite-screen--whats-new" : e === "settings" ? "holosuite-screen--settings" : "", r = e === "whats-new" ? nt(t, n) : e === "settings" ? ot() : tt();
  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
          ${et(e)}
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
function Z(e, t) {
  L = t, e.classList.toggle("is-reordering-apps", t);
}
async function Jt(e) {
  const t = [...e.querySelectorAll("[data-holosuite-app]")].map((n) => n.dataset.holosuiteApp ?? "").filter(Boolean);
  await game.settings.set(l, ae, t);
}
const Kt = 12;
function Qt(e, t, n, o) {
  if (e.length === 0) return 0;
  const r = (w) => Math.hypot(
    t - (w.left + w.width / 2),
    n - (w.top + w.height / 2)
  ), i = Math.min(Math.max(o, 0), e.length - 1), s = r(e[i]);
  let c = i, u = s;
  return e.forEach((w, g) => {
    const m = r(w);
    m < u && (c = g, u = m);
  }), c !== i && u + Kt >= s ? i : c;
}
function Zt(e, t, n, o) {
  const i = [...e.querySelectorAll("[data-holosuite-app]")].filter((s) => s !== t)[o] ?? null;
  i ? n.nextElementSibling !== i && e.insertBefore(n, i) : n.nextElementSibling && e.append(n);
}
function en(e) {
  var n;
  const t = e.querySelector(".holosuite-app-grid");
  t && (Z(e, L), (n = e.querySelector("[data-holosuite-action='reorder-done']")) == null || n.addEventListener("click", (o) => {
    o.preventDefault(), o.stopPropagation(), Z(e, !1);
  }), t.querySelectorAll("[data-holosuite-app]").forEach((o) => {
    let r = null, i = null, s = !1, c = 0, u = 0, w = 0, g = 0, m = null, f = [], p = 0;
    const S = (d) => {
      const E = o.getBoundingClientRect(), O = [...t.querySelectorAll("[data-holosuite-app]")];
      f = O.map((at) => at.getBoundingClientRect()), p = Math.max(0, O.indexOf(o)), Z(e, !0), s = !0, oe = Date.now() + 700, w = c - E.left, g = u - E.top, m = document.createElement("div"), m.className = "holosuite-app-placeholder", m.style.height = `${E.height}px`, m.setAttribute("aria-hidden", "true"), o.before(m), o.style.height = `${E.height}px`, o.style.left = `${E.left}px`, o.style.top = `${E.top}px`, o.style.width = `${E.width}px`, o.classList.add("is-being-reordered");
      try {
        o.setPointerCapture(d);
      } catch {
      }
    };
    o.addEventListener("pointerdown", (d) => {
      !d.isPrimary || d.button !== 0 || (i = d.pointerId, c = d.clientX, u = d.clientY, L ? (d.preventDefault(), S(d.pointerId)) : r = window.setTimeout(() => S(d.pointerId), 550));
    }), o.addEventListener("pointermove", (d) => {
      if (d.pointerId !== i) return;
      if (!s) {
        Math.hypot(d.clientX - c, d.clientY - u) > 8 && r !== null && (window.clearTimeout(r), r = null);
        return;
      }
      d.preventDefault(), o.style.left = `${d.clientX - w}px`, o.style.top = `${d.clientY - g}px`;
      const E = t.getBoundingClientRect();
      if (m && d.clientX >= E.left && d.clientX <= E.right && d.clientY >= E.top && d.clientY <= E.bottom) {
        const O = Qt(
          f,
          d.clientX,
          d.clientY,
          p
        );
        O !== p && (Zt(t, o, m, O), p = O);
      }
    });
    const H = (d) => {
      d.pointerId === i && (r !== null && window.clearTimeout(r), r = null, i = null, s && (d.preventDefault(), s = !1, f = [], m == null || m.replaceWith(o), m = null, o.classList.remove("is-being-reordered"), o.style.removeProperty("height"), o.style.removeProperty("left"), o.style.removeProperty("top"), o.style.removeProperty("width"), oe = Date.now() + 450, Jt(t)));
    };
    o.addEventListener("pointerup", H), o.addEventListener("pointercancel", H), o.addEventListener("contextmenu", (d) => {
      L && d.preventDefault();
    });
  }));
}
let C = null;
function De(e, t, n, o) {
  var g, m;
  const r = D.get(e);
  if (!r || !q(r) || !((g = r.contextActions) != null && g.length)) return;
  C == null || C();
  const i = document.createElement("div");
  i.className = "holosuite-app-context-menu", i.setAttribute("role", "menu"), i.setAttribute("aria-label", r.title), Object.assign(i.style, { position: "fixed", zIndex: "100000", background: "#091923", border: "1px solid #58c8d5", borderRadius: "5px", padding: "5px", minWidth: "200px", boxShadow: "0 8px 30px #0009" });
  const s = new AbortController(), c = () => {
    s.abort(), i.remove(), C = null;
  };
  C = c;
  const u = [{ label: `Open ${r.title}`, callback: () => Ke(e) }, ...r.contextActions];
  for (const f of u) {
    const p = document.createElement("button");
    p.type = "button", p.setAttribute("role", "menuitem"), p.textContent = f.label, Object.assign(p.style, { display: "block", width: "100%", textAlign: "left", color: "#d8faff", background: "#102c38", border: "1px solid #315967", padding: "8px 12px", margin: "3px 0" }), p.addEventListener("click", async () => {
      var S, H;
      if (c(), t.focus(), !!q(r))
        try {
          await f.callback();
        } catch (d) {
          console.error(`${l} | App action failed`, d), (H = (S = ui.notifications) == null ? void 0 : S.error) == null || H.call(S, `Could not complete ${f.label}.`);
        }
    }), i.appendChild(p);
  }
  document.body.appendChild(i);
  const w = i.getBoundingClientRect();
  i.style.left = `${Math.max(4, Math.min(n, window.innerWidth - w.width - 4))}px`, i.style.top = `${Math.max(4, Math.min(o, window.innerHeight - w.height - 4))}px`, (m = i.querySelector("button")) == null || m.focus(), document.addEventListener("pointerdown", (f) => {
    i.contains(f.target) || c();
  }, { capture: !0, signal: s.signal }), document.addEventListener("keydown", (f) => {
    var p;
    if (f.key === "Escape")
      f.preventDefault(), f.stopPropagation(), c(), t.focus();
    else if (f.key === "Tab") c();
    else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(f.key)) {
      f.preventDefault(), f.stopPropagation();
      const S = Array.from(i.querySelectorAll("button")), H = S.indexOf(document.activeElement), d = f.key === "Home" ? 0 : f.key === "End" ? S.length - 1 : (H + (f.key === "ArrowDown" ? 1 : -1) + S.length) % S.length;
      (p = S[d]) == null || p.focus();
    }
  }, { capture: !0, signal: s.signal });
}
function ee(e) {
  e && (C == null || C(), e.querySelectorAll("[data-holosuite-app]").forEach((t) => {
    var o, r, i;
    const n = t.dataset.holosuiteApp ?? "";
    (r = (o = D.get(n)) == null ? void 0 : o.contextActions) != null && r.length && (t.setAttribute("aria-haspopup", "menu"), t.title = `${t.title || ((i = D.get(n)) == null ? void 0 : i.title)} � Right-click for options`, t.addEventListener("contextmenu", (s) => {
      if (L) return;
      s.preventDefault(), s.stopPropagation();
      const c = t.getBoundingClientRect();
      De(n, t, s.clientX || c.left, s.clientY || c.bottom);
    }), t.addEventListener("keydown", (s) => {
      if (s.key !== "ContextMenu" && !(s.shiftKey && s.key === "F10") || L) return;
      s.preventDefault(), s.stopPropagation();
      const c = t.getBoundingClientRect();
      De(n, t, c.left, c.bottom);
    })), t.addEventListener("click", (s) => {
      if (L || Date.now() < oe) {
        s.preventDefault(), s.stopPropagation();
        return;
      }
      Ke(s.currentTarget.dataset.holosuiteApp ?? "");
    });
  }), e.querySelectorAll("[data-holosuite-action='whats-new']").forEach((t) => {
    t.addEventListener("click", (n) => {
      n.preventDefault(), n.stopPropagation(), a == null || a.showWhatsNew();
    });
  }), e.querySelectorAll("[data-holosuite-action='apps']").forEach((t) => {
    t.addEventListener("click", (n) => {
      n.preventDefault(), n.stopPropagation(), a == null || a.showApps();
    });
  }), e.querySelectorAll("[data-holosuite-action='settings']").forEach((t) => {
    t.addEventListener("click", (n) => {
      n.preventDefault(), n.stopPropagation(), a == null || a.showSettings();
    });
  }), e.querySelectorAll("[data-holosuite-device-style]").forEach((t) => {
    t.addEventListener("click", (n) => {
      const o = n.currentTarget.dataset.holosuiteDeviceStyle;
      a == null || a.setDeviceStyle(fe(o));
    });
  }), e.querySelectorAll("[data-holosuite-form-factor-choice]").forEach((t) => {
    t.addEventListener("click", (n) => {
      n.currentTarget.dataset.holosuiteFormFactorChoice, a == null || a.setFormFactor(me());
    });
  }), e.querySelectorAll("[data-holosuite-filter]").forEach((t) => {
    t.addEventListener("click", (n) => {
      const o = n.currentTarget.dataset.holosuiteFilter;
      a == null || a.setWhatsNewFilter(tn(o));
    });
  }), e.querySelectorAll("[data-holosuite-whats-new-tab]").forEach((t) => {
    t.addEventListener("click", (n) => {
      const o = n.currentTarget.dataset.holosuiteWhatsNewTab;
      a == null || a.setWhatsNewTab(nn(o));
    });
  }), e.querySelectorAll("[data-holosuite-action='close']").forEach((t) => {
    t.addEventListener("pointerdown", Ne, { capture: !0 }), t.addEventListener("click", Ne, { capture: !0 });
  }), en(e));
}
function tn(e) {
  const t = String(e ?? "");
  return t === "free" || t === "premium" || t === "installed" ? t : "all";
}
function nn(e) {
  return String(e ?? "") === "releases" ? "releases" : "updates";
}
function Ne(e) {
  var t;
  e.preventDefault(), e.stopPropagation(), (t = e.stopImmediatePropagation) == null || t.call(e), J();
}
async function J() {
  var o, r;
  if (C == null || C(), W) return;
  W = !0;
  const e = a, t = e ? v(e.element) : document.querySelector("#holosuite-launcher"), n = ((o = t == null ? void 0 : t.closest) == null ? void 0 : o.call(t, "#holosuite-launcher, .holosuite-launcher-window")) ?? t;
  a = null, A = null;
  try {
    await ((r = e == null ? void 0 : e.close) == null ? void 0 : r.call(e, { force: !0 }));
  } catch (i) {
    console.warn(`${l} | Foundry did not close the launcher cleanly; removing stale launcher element.`, i);
  } finally {
    W = !1;
  }
  window.setTimeout(() => {
    n != null && n.isConnected && n.remove(), a || We();
  }, 0);
}
function on() {
  var n;
  const e = game.modules;
  return T((e == null ? void 0 : e.contents) ?? Array.from(((n = e == null ? void 0 : e.values) == null ? void 0 : n.call(e)) ?? [])).filter((o) => (o == null ? void 0 : o.active) === !0).map((o) => ({
    id: String(o.id ?? ""),
    title: String(o.title ?? o.id ?? ""),
    version: String(o.version ?? "")
  })).sort((o, r) => o.id.localeCompare(r.id));
}
function rn() {
  const e = Array.from(
    document.querySelectorAll(`link[${R}]`)
  );
  return te.map((t) => {
    const n = e.find((o) => o.getAttribute(R) === t) ?? null;
    return {
      path: t,
      present: n !== null,
      loaded: (n == null ? void 0 : n.sheet) != null,
      href: (n == null ? void 0 : n.href) ?? null
    };
  });
}
function sn() {
  var n;
  const e = game.messages, t = Number((e == null ? void 0 : e.size) ?? ((n = e == null ? void 0 : e.contents) == null ? void 0 : n.length) ?? 0);
  return Number.isFinite(t) ? t : 0;
}
function ye() {
  var c, u, w;
  const e = b(l, j) === !0, t = y(), n = b(l, z) === !0, o = rn(), r = on(), i = game.release, s = game.system;
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
      launcherOpen: re(a) || he(),
      registeredApps: [...D.values()].map((g) => ({
        id: g.id,
        title: g.title,
        premium: g.premium === !0,
        playerVisible: g.playerVisible !== !1
      })),
      registeredWhatsNewModules: [...N.keys()].sort(),
      deviceStyle: {
        effective: Ge(),
        client: ge(),
        forced: Y()
      },
      formFactor: pe(),
      appOrder: je(),
      colorTheme: Ue(b(l, le))
    },
    foundry: {
      version: String((i == null ? void 0 : i.version) ?? game.version ?? ""),
      generation: Number((i == null ? void 0 : i.generation) ?? 0) || null,
      build: Number((i == null ? void 0 : i.build) ?? 0) || null,
      systemId: String((s == null ? void 0 : s.id) ?? ""),
      systemVersion: String((s == null ? void 0 : s.version) ?? ""),
      worldId: String(((u = game.world) == null ? void 0 : u.id) ?? ""),
      isGM: ((w = game.user) == null ? void 0 : w.isGM) === !0
    },
    workload: {
      chatMessages: sn(),
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
function rt() {
  return JSON.stringify(ye(), null, 2);
}
async function an() {
  var t, n, o, r, i, s;
  const e = rt();
  try {
    if ((t = navigator.clipboard) != null && t.writeText)
      await navigator.clipboard.writeText(e);
    else if ((n = game.clipboard) != null && n.copyPlainText)
      await game.clipboard.copyPlainText(e);
    else
      throw new Error("No clipboard API is available.");
    (r = (o = ui.notifications) == null ? void 0 : o.info) == null || r.call(o, "HoloSuite Core diagnostics copied to the clipboard.");
  } catch (c) {
    console.warn(`${l} | Could not copy diagnostics.`, c), (s = (i = ui.notifications) == null ? void 0 : i.error) == null || s.call(i, "Could not copy diagnostics. Use Download JSON instead.");
  }
}
function ln() {
  const e = new Blob([rt()], { type: "application/json" }), t = URL.createObjectURL(e), n = document.createElement("a"), o = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  n.href = t, n.download = `holosuite-core-diagnostics-${o}.json`, n.click(), window.setTimeout(() => URL.revokeObjectURL(t), 0);
}
function ke() {
  const e = ye(), t = e.core, n = [
    t.apiOnly ? "API-only" : null,
    t.cssDisabled ? "CSS disabled" : null,
    t.visualEffectsDisabled ? "visual effects disabled" : null
  ].filter(Boolean), o = n.length > 0 ? n.join(", ") : "Normal";
  return `
    <form class="standard-form holosuite-core-diagnostics">
      <p>This report stays on this browser until you copy or download it. It includes module versions and browser/workload counts, but no actor, chat-message, or campaign content.</p>
      <fieldset>
        <legend>Current test state</legend>
        <div class="form-group"><label>Diagnostic mode</label><div class="form-fields"><strong>${h(o)}</strong></div></div>
        <div class="form-group"><label>Core version</label><div class="form-fields"><code>${h(t.version)}</code></div></div>
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
        <pre style="max-height: 360px; overflow: auto; user-select: text; white-space: pre-wrap;">${h(JSON.stringify(e, null, 2))}</pre>
      </details>
    </form>
  `;
}
function He(e, t) {
  var n, o, r;
  e && ((n = e.querySelector("[data-action='refresh']")) == null || n.addEventListener("click", () => t.render(!1)), (o = e.querySelector("[data-action='copy']")) == null || o.addEventListener("click", () => void an()), (r = e.querySelector("[data-action='download']")) == null || r.addEventListener("click", ln));
}
class it extends Pe {
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
    return $(ke());
  }
  activateListeners(t) {
    super.activateListeners(t), He(v(t), this);
  }
  async _renderHTML() {
    const t = document.createElement("template");
    return t.innerHTML = ke().trim(), t.content;
  }
  _replaceHTML(t, n) {
    const o = v(n), r = (o == null ? void 0 : o.querySelector(".window-content")) ?? o;
    if (!r) return;
    const i = t instanceof DocumentFragment || t instanceof HTMLElement ? t : v(t);
    i ? r.replaceChildren(i) : r.innerHTML = String(t ?? ""), He(r, this);
  }
  async _updateObject() {
  }
}
I(it, "DEFAULT_OPTIONS", {
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
class G extends Pe {
  constructor() {
    super(...arguments);
    I(this, "currentView", "apps");
    I(this, "whatsNewFilter", "all");
    I(this, "whatsNewTab", "releases");
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
    return y() ? ((r = (o = ui.notifications) == null ? void 0 : o.warn) == null || r.call(o, "HoloSuite Core is in API-only diagnostic mode on this browser."), this) : super.render(...n);
  }
  async _renderInner() {
    return $(Ae(this.currentView, this.whatsNewFilter, this.whatsNewTab));
  }
  activateListeners(n) {
    super.activateListeners(n), ee(v(n)), this.resizeForFormFactor();
  }
  async _renderHTML() {
    const n = document.createElement("template");
    return n.innerHTML = Ae(this.currentView, this.whatsNewFilter, this.whatsNewTab).trim(), n.content;
  }
  _replaceHTML(n, o) {
    const r = this.getRenderTarget(o);
    if (!r) return;
    const i = n instanceof DocumentFragment || n instanceof HTMLElement ? n : v(n);
    i ? r.replaceChildren(i) : r.innerHTML = String(n ?? ""), ee(r), this.resizeForFormFactor();
  }
  async close(n = {}) {
    return L = !1, a = null, super.close(n);
  }
  getLauncherRoot(n = {}) {
    var i;
    const o = v(this.element), r = (o == null ? void 0 : o.querySelector(".holosuite-phone")) ?? ((i = o == null ? void 0 : o.closest) == null ? void 0 : i.call(o, ".holosuite-phone")) ?? null;
    return r != null && r.isConnected ? r : n.includeDocumentFallback === !1 ? null : document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone");
  }
  getRenderTarget(n) {
    const o = v(n);
    return o ? o.querySelector(".window-content") ?? o.querySelector(".holosuite-launcher-window .window-content") ?? o : null;
  }
  updateRenderedView() {
    const n = this.getLauncherRoot();
    if (!n) return !1;
    const o = n.querySelector(".holosuite-status-bar"), r = n.querySelector(".holosuite-screen");
    return !o || !r ? !1 : (o.innerHTML = `
      <span>HoloSuite</span>
      ${et(this.currentView)}
    `, r.innerHTML = this.currentView === "whats-new" ? nt(this.whatsNewFilter, this.whatsNewTab) : this.currentView === "settings" ? ot() : tt(), r.classList.toggle("holosuite-screen--whats-new", this.currentView === "whats-new"), r.classList.toggle("holosuite-screen--settings", this.currentView === "settings"), ee(n), !0);
  }
  showApps() {
    this.currentView = "apps", this.updateRenderedView() || this.render(!1);
  }
  showWhatsNew() {
    L = !1, this.currentView = "whats-new", Lt(), this.updateRenderedView() || this.render(!1);
  }
  showSettings() {
    L = !1, this.currentView = "settings", this.updateRenderedView() || this.render(!1);
  }
  async setDeviceStyle(n) {
    Y() || (await game.settings.set(l, ie, n), this.currentView = "settings", B(), this.refreshCurrentView());
  }
  async setFormFactor(n) {
    await game.settings.set(l, se, n), this.currentView = "settings", we(), this.resizeForFormFactor(), this.refreshCurrentView();
  }
  resizeForFormFactor() {
    var r, i;
    const n = Mt(), o = ((r = v(this.element)) == null ? void 0 : r.closest("#holosuite-launcher, .holosuite-launcher-window")) ?? v(this.element);
    o == null || o.style.setProperty("--hs-launcher-width", `${n.width}px`), o == null || o.style.setProperty("--hs-launcher-height", `${n.height}px`), o == null || o.style.setProperty("width", `${n.width}px`, "important"), o == null || o.style.setProperty("height", `${n.height}px`, "important");
    try {
      (i = this.setPosition) == null || i.call(this, n);
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
I(G, "DEFAULT_OPTIONS", {
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
const k = {
  registerApp(e) {
    const t = $t(e);
    return t ? (D.set(t.id, t), y() || a == null || a.render(!1), t) : null;
  },
  unregisterApp(e) {
    const t = D.delete(String(e ?? ""));
    return t && !y() && (a == null || a.render(!1)), t;
  },
  getApps() {
    return [...D.values()];
  },
  getDiagnostics() {
    return ye();
  },
  registerWhatsNew(e) {
    return Qe(e);
  },
  unregisterWhatsNew(e) {
    const t = N.delete(String(e ?? ""));
    return t && !y() && (a == null || a.render(!1)), t;
  },
  getWhatsNew() {
    return [...N.values()].sort(ue);
  },
  async openLauncher() {
    var e, t;
    return y() ? ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "HoloSuite Core is in API-only diagnostic mode on this browser."), null) : A || (A = (async () => {
      re(a) || (a = null), a || (a = new G());
      try {
        await a.render(!0);
      } catch (n) {
        console.warn(`${l} | Recreating launcher after render failure.`, n), a = new G(), await a.render(!0);
      }
      return kt(a), a;
    })().finally(() => {
      A = null;
    }), A);
  },
  async toggleLauncher() {
    return A || (re(a) ? (await J(), null) : (he() && We(), Ht(), k.openLauncher()));
  }
};
function st() {
  const e = game.modules.get(l);
  if (game.holosuite = k, globalThis.HoloSuiteCoreApi = k, e)
    try {
      e.api = k;
    } catch (t) {
      console.warn(`${l} | Could not attach API to game.modules; using game.holosuite fallback.`, t);
    }
  Hooks.callAll(`${l}.apiReady`, k);
}
Hooks.once("init", () => {
  Xe(), Rt(), Be(), qe(), xt(), st();
});
Hooks.on("getSceneControlButtons", Dt);
Hooks.on("renderSceneControls", (e, t) => Ft(t));
Hooks.on("renderSidebar", de);
Hooks.on("renderSidebarTab", de);
Hooks.on("renderSettingsConfig", _t);
Hooks.once("ready", () => {
  ne = !0, st(), Xe(), B(), Bt(), we(), y() ? console.warn(`${l} | API-only diagnostic mode is enabled on this browser.`) : (de(), Ze()), console.log(`${l} | Ready. API available at game.modules.get("${l}").api`);
});
