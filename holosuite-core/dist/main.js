var Ve = Object.defineProperty;
var Be = (e, t, n) => t in e ? Ve(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var v = (e, t, n) => Be(e, typeof t != "symbol" ? t + "" : t, n);
const G = [
  "modules/holosuite-core/styles/holosuite-tokens.css",
  "modules/holosuite-core/styles/holosuite-core.css"
], L = "data-holosuite-core-stylesheet";
function Ge(e, t) {
  const n = String(t ?? "").trim();
  return n ? `${e}?v=${encodeURIComponent(n)}` : e;
}
function qe(e, t = document, n = "") {
  const o = Array.from(
    t.querySelectorAll(`link[${L}]`)
  );
  if (!e) {
    for (const d of o) d.remove();
    return;
  }
  const s = t.head;
  if (!s) return;
  const i = new Set(G), l = /* @__PURE__ */ new Set();
  for (const d of o) {
    const c = d.getAttribute(L) ?? "";
    if (!i.has(c) || l.has(c)) {
      d.remove();
      continue;
    }
    l.add(c);
  }
  for (const d of G) {
    if (l.has(d)) continue;
    const c = t.createElement("link");
    c.rel = "stylesheet", c.href = Ge(d, n), c.setAttribute(L, d), s.append(c);
  }
}
function N(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function ne(e, t) {
  return N(e) ? t.includes(String(e.name ?? "")) : !1;
}
function oe(e) {
  if (!N(e) || !("tools" in e)) return !1;
  const t = String(e.name ?? "");
  return !["measure", "templates", "walls", "lighting", "sounds", "notes", "tiles", "drawings"].includes(t);
}
function Ue(e, t, n) {
  if (Array.isArray(e))
    return e.find((o) => ne(o, t)) ?? (n ? e.find(oe) : null) ?? null;
  if (!N(e)) return null;
  for (const o of t)
    if (N(e[o])) return e[o];
  return Object.values(e).find((o) => ne(o, t)) ?? (n ? Object.values(e).find(oe) : null) ?? null;
}
function je(e) {
  const t = Object.values(e).map((n) => Number(n == null ? void 0 : n.order)).filter(Number.isFinite);
  return t.length ? Math.max(...t) + 1 : Object.keys(e).length;
}
function se(e, t, n = ["tokens", "token"], o = {}) {
  const s = Ue(e, n, o.allowFallback === !0);
  if (!s) return !1;
  const i = s.tools;
  return Array.isArray(i) ? i.some((l) => (l == null ? void 0 : l.name) === t.name) ? !1 : (i.push(t), !0) : !N(i) || i[t.name] ? !1 : (i[t.name] = { ...t, order: t.order ?? je(i) }, !0);
}
const a = "holosuite-core", _ = "apiOnlyForDebugging", F = "disableCoreCssForDebugging", W = "disableVisualEffectsForDebugging", fe = "disableForPlayers", j = "deviceStyle", ge = "forceDeviceStyle", x = "theme", z = "whatsNewLastSeen", xe = "openLauncher", ie = "data-holosuite-foundry-generation", re = "data-holosuite-debug-no-effects", ze = `modules/${a}/data/whats-new.json`, Ye = Date.UTC(2026, 7, 1), A = {
  base: "Base",
  "space-police": "Space Police"
}, Je = {
  "": "Allow User Choice",
  base: "Base",
  "space-police": "Space Police"
}, me = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
}, C = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map();
let r = null, w = null, D = !1, we = 0, q = !1, pe = null, ae = !1, E = null;
function Ke() {
  var n, o, s, i, l, d;
  const e = ((o = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : o.api) ?? ((s = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : s.api) ?? null, t = ((l = (i = globalThis.foundry) == null ? void 0 : i.applications) == null ? void 0 : l.api) ?? ((d = foundry == null ? void 0 : foundry.applications) == null ? void 0 : d.api) ?? null;
  return globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV2);
}
const be = Ke();
function U(e) {
  return e ? !!e.getLauncherRoot({ includeDocumentFallback: !1 }) : !1;
}
function u(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function H(e, t, n = `${t}s`) {
  return `${e} ${e === 1 ? t : n}`;
}
function f(e, t) {
  try {
    return game.settings.get(e, t);
  } catch {
    return null;
  }
}
function h() {
  return pe ?? f(a, _) === !0;
}
function V(e) {
  var t;
  return ((t = game.modules.get(e)) == null ? void 0 : t.api) ?? null;
}
function Qe() {
  var e, t, n;
  return String(((t = (e = game.user) == null ? void 0 : e.character) == null ? void 0 : t.name) ?? ((n = game.user) == null ? void 0 : n.name) ?? "Player");
}
function Xe(e) {
  var t, n, o, s, i, l;
  if (e === "cybercall") {
    const d = p(f("cybercall", "contacts")), c = p(f("cybercall", "groupContacts"));
    return H(d.length + c.length, "link");
  }
  if (e === "bounty-board") {
    const d = p((n = (t = V("bounty-board")) == null ? void 0 : t.getAllBounties) == null ? void 0 : n.call(t, { includeHidden: !1 }));
    return H(d.length, "contract");
  }
  if (e === "csi-toolkit") {
    const d = Object.values(((s = (o = V("csi-toolkit")) == null ? void 0 : o.getCases) == null ? void 0 : s.call(o)) ?? {}).filter((c) => (c == null ? void 0 : c.visibility) !== "gm");
    return H(d.length, "case");
  }
  if (e === "galaxy-map") {
    const d = p((l = (i = V("galaxy-map")) == null ? void 0 : i.getMaps) == null ? void 0 : l.call(i)).filter((c) => (c == null ? void 0 : c.visibility) === "players");
    return H(d.length, "chart");
  }
  return "";
}
function p(e) {
  return Array.isArray(e) ? e : [];
}
function Ze(e) {
  const t = String((e == null ? void 0 : e.title) ?? "").trim();
  if (!t) return null;
  const n = p(e == null ? void 0 : e.tags).map((o) => String(o ?? "").trim()).filter(Boolean).slice(0, 4);
  return {
    title: t,
    summary: String((e == null ? void 0 : e.summary) ?? "").trim(),
    tags: n
  };
}
function ye(e) {
  const t = String((e == null ? void 0 : e.moduleId) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), o = p(e == null ? void 0 : e.entries).map((i) => Ze(i)).filter((i) => !!i);
  if (!t || !n || o.length === 0)
    return console.warn(`${a} | Ignoring invalid what's new registration.`, e), null;
  const s = String((e == null ? void 0 : e.tier) ?? "free").toLowerCase() === "premium" ? "premium" : "free";
  return {
    moduleId: t,
    title: n,
    tier: s,
    version: String((e == null ? void 0 : e.version) ?? "").trim(),
    updated: String((e == null ? void 0 : e.updated) ?? "").trim(),
    icon: String((e == null ? void 0 : e.icon) ?? "").trim(),
    url: String((e == null ? void 0 : e.url) ?? "").trim(),
    entries: o
  };
}
function k(e) {
  const t = Date.parse(String(e.updated ?? ""));
  return Number.isFinite(t) ? t : 0;
}
function Y(e, t) {
  return k(t) - k(e) || e.title.localeCompare(t.title);
}
function J(e) {
  var t, n;
  return ((n = (t = game.modules) == null ? void 0 : t.has) == null ? void 0 : n.call(t, e)) === !0;
}
function et() {
  const e = Number(f(a, z));
  return Number.isFinite(e) ? e : 0;
}
function tt() {
  const e = et();
  return [...b.values(), ...T.values()].filter((t) => k(t) > e).reduce((t, n) => t + n.entries.length, 0);
}
function nt() {
  try {
    game.settings.set(a, z, Date.now());
  } catch (e) {
    console.warn(`${a} | Could not update what's new read state.`, e);
  }
}
function ot(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), o = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !t || !n || !o || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${a} | Ignoring invalid app registration.`, e), null) : {
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
function st(e) {
  var s;
  if (h()) return;
  const t = ((s = game.user) == null ? void 0 : s.isGM) === !0;
  if (!t && M()) return;
  const n = () => ({
    name: "holosuite-core-launcher",
    title: t ? "HoloSuite Command Deck" : "HoloSuite Player View",
    icon: He(),
    button: !0,
    visible: !0,
    onClick: ve,
    onChange: ct
  }), o = se(e, n(), ["tiles", "tile"]);
  se(e, n(), ["tokens", "token"], { allowFallback: !o });
}
function it() {
  var e;
  return !h() && (((e = game.user) == null ? void 0 : e.isGM) === !0 || !M());
}
function K() {
  h() || document.querySelectorAll(".holosuite-sidebar-launcher, .holosuite-floating-launcher").forEach((e) => e.remove());
}
function g(e) {
  var o;
  if (e instanceof HTMLElement) return e;
  if (Array.isArray(e) && e[0] instanceof HTMLElement) return e[0];
  const t = e, n = ((o = t == null ? void 0 : t.get) == null ? void 0 : o.call(t, 0)) ?? (t == null ? void 0 : t[0]);
  return n instanceof HTMLElement ? n : null;
}
function rt(e) {
  var i;
  const t = new Set(document.querySelectorAll("#holosuite-launcher, .holosuite-launcher-window"));
  if (t.size <= 1) return;
  const n = e ? g(e.element) : null, s = ((i = n == null ? void 0 : n.closest) == null ? void 0 : i.call(n, "#holosuite-launcher, .holosuite-launcher-window")) ?? [...t].at(-1) ?? null;
  for (const l of t)
    l !== s && l.remove();
}
function Se() {
  document.querySelectorAll("#holosuite-launcher, .holosuite-launcher-window").forEach((e) => {
    e.remove();
  });
}
function Q() {
  return document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone") !== null;
}
function at() {
  r = null, w = null, D = !1;
}
function lt(e) {
  const t = e.find((n) => typeof n == "boolean");
  return typeof t == "boolean" ? t : null;
}
function ve() {
  return we = Date.now(), S.toggleLauncher();
}
function ct(...e) {
  const t = lt(e);
  return t === !1 ? (R(), null) : t === null && Date.now() - we < 100 ? null : S.openLauncher();
}
function ut(e) {
  var i;
  if (h()) return;
  const t = ((i = game.user) == null ? void 0 : i.isGM) === !0;
  if (!t && M()) return;
  const n = g(e) ?? document.querySelector("#controls, #scene-controls");
  if (!n || n.querySelector("[data-tool='holosuite-core-launcher']")) return;
  const o = n.querySelector(
    ".control-tools.active, .sub-controls.active, .scene-control-tools.active, .control-tools, .sub-controls, .scene-control-tools"
  );
  if (!o) return;
  const s = document.createElement("li");
  s.className = "control-tool holosuite-scene-control", s.dataset.tool = "holosuite-core-launcher", s.title = t ? "HoloSuite Command Deck" : "HoloSuite Player View", s.innerHTML = `<i class="${He()}"></i>`, s.addEventListener("click", (l) => {
    l.preventDefault(), l.stopPropagation(), ve();
  }), o.appendChild(s);
}
function dt(e, t) {
  var i;
  const n = g(t);
  if (!n) return;
  const s = [
    `input[name="${a}.${_}"]`,
    `input[name="${a}.${F}"]`,
    `input[name="${a}.${W}"]`
  ].map((l) => {
    var d;
    return ((d = n.querySelector(l)) == null ? void 0 : d.closest(".form-group")) ?? null;
  }).filter((l) => l !== null);
  for (const l of s) (i = l.parentElement) == null || i.append(l);
}
function ht() {
  game.settings.register(a, _, {
    name: "Debugging: API-Only Mode (This Browser)",
    hint: "Diagnostic only. Keeps Core's registration API active while disabling its launcher, scene-control UI, sidebar cleanup, and What's New catalog work on this browser.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => ft(e)
  }), game.settings.register(a, F, {
    name: "Debugging: Disable HoloSuite Core CSS (This Browser)",
    hint: "Diagnostic only. Temporarily removes Core's shared tokens and launcher styles from this browser. HoloSuite interfaces will appear unstyled. Leave this off during normal play.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => Ce(e)
  }), game.settings.register(a, W, {
    name: "Debugging: Disable Core Visual Effects (This Browser)",
    hint: "Diagnostic only. Keeps Core's layout and colors while disabling launcher transitions, animations, filters, shadows, and glows on this browser.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => Te(e)
  }), game.settings.register(a, j, {
    name: "HoloSuite Theme",
    hint: "Choose the HoloSuite launcher theme for this user.",
    scope: "client",
    config: !0,
    type: String,
    choices: A,
    default: "base",
    restricted: !1,
    onChange: () => {
      I(), r == null || r.refreshCurrentView();
    }
  }), game.settings.register(a, ge, {
    name: "Force HoloSuite Theme",
    hint: "When set, every user sees this HoloSuite launcher theme instead of their personal choice.",
    scope: "world",
    config: !0,
    type: String,
    choices: Je,
    default: "",
    restricted: !0,
    onChange: () => {
      I(), r == null || r.refreshCurrentView();
    }
  }), game.settings.register(a, x, {
    name: "HoloSuite Color Theme",
    hint: "Changes the shared color theme used by HoloSuite windows.",
    scope: "world",
    config: !0,
    type: String,
    choices: me,
    default: "default",
    restricted: !0,
    onChange: (e) => Le(e)
  }), game.settings.register(a, fe, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !0
  }), game.settings.register(a, z, {
    name: "HoloSuite What's New Last Seen",
    hint: "Tracks when this client last opened the HoloSuite What's New view.",
    scope: "client",
    config: !1,
    type: Number,
    default: 0
  }), game.settings.registerMenu(a, "launcher", {
    name: "HoloSuite Command Deck",
    label: "Open HoloSuite",
    hint: "Open the HoloSuite launcher and registered app deck.",
    icon: "fas fa-terminal",
    type: O,
    restricted: !0
  }), game.settings.registerMenu(a, "diagnostics", {
    name: "HoloSuite Core Diagnostics",
    label: "Open Diagnostics",
    hint: "Inspect, copy, or download the current HoloSuite and Foundry test state.",
    icon: "fas fa-stethoscope",
    type: Me,
    restricted: !0
  });
}
async function le() {
  var n;
  const e = ui.controls;
  if (typeof (e == null ? void 0 : e.render) != "function") return;
  const t = Number(((n = game.release) == null ? void 0 : n.generation) ?? 0);
  try {
    t >= 13 ? await e.render({ force: !0, reset: !0 }) : await e.render(!0);
  } catch (o) {
    console.warn(`${a} | Could not rebuild scene controls after changing API-only mode.`, o);
  }
}
function ft(e = f(a, _)) {
  const t = e === !0;
  if (pe = t, t) {
    document.querySelectorAll(
      "[data-tool='holosuite-core-launcher'], .holosuite-scene-control, .holosuite-sidebar-launcher, .holosuite-floating-launcher"
    ).forEach((n) => n.remove()), (r || Q()) && R(), q && le(), console.warn(`${a} | API-only diagnostic mode is enabled on this browser.`);
    return;
  }
  q && (Ie(), le());
}
function Ce(e = f(a, F)) {
  var o;
  const t = e === !0, n = String(((o = game.modules.get(a)) == null ? void 0 : o.version) ?? "");
  qe(!t, document, n), t && console.warn(`${a} | Core CSS is disabled on this browser for debugging.`);
}
function Te(e = f(a, W)) {
  const t = e === !0;
  for (const n of [document.documentElement, document.body].filter(Boolean))
    t ? n.setAttribute(re, "true") : n.removeAttribute(re);
  t && console.warn(`${a} | Core visual effects are disabled on this browser for debugging.`);
}
function gt() {
  var e, t;
  (t = (e = game.keybindings) == null ? void 0 : e.register) == null || t.call(e, a, xe, {
    name: "Open HoloSuite",
    hint: "Open the HoloSuite launcher and registered app deck.",
    editable: [],
    restricted: !1,
    onDown: () => {
      var n, o, s, i;
      return h() ? ((o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, "HoloSuite Core is in API-only diagnostic mode on this browser."), !1) : it() ? (S.toggleLauncher(), !0) : ((i = (s = ui.notifications) == null ? void 0 : s.warn) == null || i.call(s, "HoloSuite is disabled for players in this world."), !1);
    }
  });
}
function X(e) {
  return Object.hasOwn(A, String(e)) ? String(e) : "base";
}
function P() {
  const e = String(f(a, ge) ?? "");
  return Object.hasOwn(A, e) ? e : null;
}
function Z() {
  return X(f(a, j));
}
function Ee() {
  return P() ?? Z();
}
function $e(e) {
  return Object.hasOwn(me, String(e)) ? String(e) : "default";
}
function mt(e) {
  const t = X(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const o of n)
    t === "base" ? o.removeAttribute("data-holosuite-device-style") : o.setAttribute("data-holosuite-device-style", t);
}
function Le(e) {
  const t = $e(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const o of n)
    t === "default" ? o.removeAttribute("data-holosuite-theme") : o.setAttribute("data-holosuite-theme", t);
}
function I() {
  mt(Ee());
}
function wt() {
  Le(f(a, x));
}
function Ne() {
  var t, n, o;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((o = game == null ? void 0 : game.release) == null ? void 0 : o.generation));
  return Number.isFinite(e) ? e : null;
}
function Ae() {
  const e = Ne(), t = [document.documentElement, document.body].filter(Boolean);
  for (const n of t)
    e === null ? n.removeAttribute(ie) : n.setAttribute(ie, String(e));
}
function He() {
  return Ne() === 12 ? "fa-solid fa-terminal" : "fa-solid fa-mobile-screen-button";
}
function M() {
  try {
    return game.settings.get(a, fe) === !0;
  } catch {
    return !1;
  }
}
function De(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 ? !0 : M() ? !1 : e.playerVisible !== !1;
}
async function pt(e) {
  var n, o, s, i;
  const t = C.get(e);
  return t ? De(t) ? t.open() : ((i = (s = ui.notifications) == null ? void 0 : s.warn) == null || i.call(s, `${t.title} is not available from the player view.`), null) : ((o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, `HoloSuite app "${e}" is not registered.`), null);
}
function ke(e, t = {}) {
  const n = ye(e);
  return !n || k(n) < Ye ? null : t.replace === !1 && b.has(n.moduleId) ? b.get(n.moduleId) ?? null : (b.set(n.moduleId, n), h() || r == null || r.render(!1), n);
}
function bt(e, t = {}) {
  const n = ye(e);
  return n ? t.replace === !1 && T.has(n.moduleId) ? T.get(n.moduleId) ?? null : (T.set(n.moduleId, n), h() || r == null || r.render(!1), n) : null;
}
async function Ie() {
  if (!(h() || ae))
    return E || (E = (async () => {
      try {
        const e = await fetch(ze, { cache: "no-cache" });
        if (!e.ok) throw new Error(`HTTP ${e.status}`);
        const t = await e.json(), n = p(t == null ? void 0 : t.modules);
        for (const s of n)
          ke(s, { replace: !1 });
        const o = p(t == null ? void 0 : t.releases);
        for (const s of o)
          bt(s, { replace: !1 });
        ae = !0;
      } catch (e) {
        console.warn(`${a} | Could not load bundled what's new catalog.`, e);
      }
    })().finally(() => {
      E = null;
    }), E);
}
function Oe(e) {
  const t = tt(), n = t > 0 ? `<span>${u(t)}</span>` : "";
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
function yt(e) {
  return `
    <span class="holosuite-app-icon" data-holosuite-app-icon="${u(e.id)}">
      <i class="${u(e.icon)}"></i>
    </span>
  `;
}
function _e() {
  var d;
  const e = ((d = game.user) == null ? void 0 : d.isGM) === !0, t = [...C.values()].filter(De).sort((c, m) => c.title.localeCompare(m.title)), n = e ? "GM Command Deck" : "Player Link", o = e ? "Apps" : "Commlink", s = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", i = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">Active User</span>
        <strong>${u(Qe())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>LINK STABLE</span>
      </div>
    </section>
  `, l = t.map((c) => {
    const m = c.title, y = e && c.description ? `<p>${u(c.description)}</p>` : "", te = e ? "" : Xe(c.id);
    return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${u(c.id)}">
          ${yt(c)}
          <span class="holosuite-app-title">${u(m)}</span>
          ${y}
          ${te ? `<span class="holosuite-app-count">${u(te)}</span>` : ""}
        </button>
      `;
  }).join("");
  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">${u(n)}</span>
        <h2>${u(o)}</h2>
      </div>
    </div>
    ${i}
    <div class="holosuite-app-grid">
      ${t.length ? l : `<p class="holosuite-empty">${u(s)}</p>`}
    </div>
  `;
}
function St(e) {
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
          data-holosuite-filter="${u(n.id)}"
        >${u(n.label)}</button>
      `).join("")}
    </nav>
  `;
}
function vt(e) {
  return `
    <nav class="holosuite-whats-new-tabs" aria-label="What's New tabs">
      ${[
    { id: "updates", label: "Updates", count: b.size },
    { id: "releases", label: "Releases", count: T.size }
  ].map((n) => `
        <button
          type="button"
          class="${n.id === e ? "is-active" : ""}"
          data-holosuite-whats-new-tab="${u(n.id)}"
        >
          <span>${u(n.label)}</span>
          <strong>${u(n.count)}</strong>
        </button>
      `).join("")}
    </nav>
  `;
}
function Ct(e) {
  return [...b.values()].filter((t) => e === "installed" ? J(t.moduleId) : e === "free" || e === "premium" ? t.tier === e : !0).sort(Y);
}
function Tt(e) {
  return [...T.values()].filter((t) => e === "installed" ? J(t.moduleId) : e === "free" || e === "premium" ? t.tier === e : !0).sort(Y);
}
function Et(e, t) {
  return e.length ? e.map((n) => {
    const o = J(n.moduleId), s = n.tier === "premium" ? "Premium" : "Free", i = n.icon || (n.tier === "premium" ? "fa-solid fa-gem" : "fa-solid fa-cube"), l = n.entries.map((c) => {
      var m;
      return `
        <li>
          <strong>${u(c.title)}</strong>
          ${c.summary ? `<span>${u(c.summary)}</span>` : ""}
          ${(m = c.tags) != null && m.length ? `
            <div class="holosuite-whats-new-tags">
              ${c.tags.map((y) => `<span>${u(y)}</span>`).join("")}
            </div>
          ` : ""}
        </li>
      `;
    }).join(""), d = n.url ? `
          <a class="holosuite-whats-new-link" href="${u(n.url)}" target="_blank" rel="noreferrer">
            <span>Find out more</span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        ` : "";
    return `
        <article class="holosuite-whats-new-card">
          <header>
            <span class="holosuite-whats-new-icon" data-holosuite-app-icon="${u(n.moduleId)}"><i class="${u(i)}"></i></span>
            <div>
              <h3>${u(n.title)}</h3>
              <p>
                <span>${u(s)}</span>
                ${n.version ? `<span>v${u(n.version)}</span>` : ""}
                ${n.updated ? `<span>${u(n.updated)}</span>` : ""}
                <span>${o ? "Installed" : "Not installed"}</span>
              </p>
            </div>
          </header>
          <ul>${l}</ul>
          ${d}
        </article>
      `;
  }).join("") : `<p class="holosuite-empty">${u(t)}</p>`;
}
function Fe(e, t) {
  const n = Ct(e), o = Tt(e), s = t === "releases" ? o : n, i = t === "releases" ? "No releases match this filter yet." : "No updates match this filter yet.";
  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">Release Feed</span>
        <h2>What's New</h2>
      </div>
    </div>
    ${vt(t)}
    ${St(e)}
    <div class="holosuite-whats-new-list">
      ${Et(s, i)}
    </div>
  `;
}
function We() {
  const e = P(), t = Z(), n = e ?? t, o = e ? `
    <div class="holosuite-settings-notice">
      <i class="fa-solid fa-lock"></i>
      <span>The GM is overriding the HoloSuite theme for this world. Your personal choice is paused until the override is removed.</span>
    </div>
  ` : "", s = Object.entries(A).map(([i, l]) => `
    <button
      type="button"
      class="holosuite-theme-choice ${i === n ? "is-active" : ""}"
      data-holosuite-device-style="${u(i)}"
      ${e ? "disabled" : ""}
      aria-pressed="${i === n ? "true" : "false"}"
    >
      <span class="holosuite-theme-preview holosuite-theme-preview--${u(i)}"></span>
      <strong>${u(l)}</strong>
      <span>${i === "base" ? "Classic HoloSuite cyan interface." : "Space Police tactical hardware and amber controls."}</span>
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
          <strong>${u(A[n])}</strong>
        </div>
      </div>
      <div class="holosuite-theme-choices">
        ${s}
      </div>
    </section>
  `;
}
function ce(e = "apps", t = "all", n = "releases") {
  const o = e === "whats-new" ? "holosuite-screen--whats-new" : e === "settings" ? "holosuite-screen--settings" : "", s = e === "whats-new" ? Fe(t, n) : e === "settings" ? We() : _e();
  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
          ${Oe(e)}
        </header>
        <main class="holosuite-screen ${o}">
          ${s}
        </main>
        <footer class="holosuite-dock">
          <button type="button" data-holosuite-action="close" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
        </footer>
      </div>
    </section>
  `;
}
function B(e) {
  e && (e.querySelectorAll("[data-holosuite-app]").forEach((t) => {
    t.addEventListener("click", (n) => {
      pt(n.currentTarget.dataset.holosuiteApp ?? "");
    });
  }), e.querySelectorAll("[data-holosuite-action='whats-new']").forEach((t) => {
    t.addEventListener("click", (n) => {
      n.preventDefault(), n.stopPropagation(), r == null || r.showWhatsNew();
    });
  }), e.querySelectorAll("[data-holosuite-action='apps']").forEach((t) => {
    t.addEventListener("click", (n) => {
      n.preventDefault(), n.stopPropagation(), r == null || r.showApps();
    });
  }), e.querySelectorAll("[data-holosuite-action='settings']").forEach((t) => {
    t.addEventListener("click", (n) => {
      n.preventDefault(), n.stopPropagation(), r == null || r.showSettings();
    });
  }), e.querySelectorAll("[data-holosuite-device-style]").forEach((t) => {
    t.addEventListener("click", (n) => {
      const o = n.currentTarget.dataset.holosuiteDeviceStyle;
      r == null || r.setDeviceStyle(X(o));
    });
  }), e.querySelectorAll("[data-holosuite-filter]").forEach((t) => {
    t.addEventListener("click", (n) => {
      const o = n.currentTarget.dataset.holosuiteFilter;
      r == null || r.setWhatsNewFilter($t(o));
    });
  }), e.querySelectorAll("[data-holosuite-whats-new-tab]").forEach((t) => {
    t.addEventListener("click", (n) => {
      const o = n.currentTarget.dataset.holosuiteWhatsNewTab;
      r == null || r.setWhatsNewTab(Lt(o));
    });
  }), e.querySelectorAll("[data-holosuite-action='close']").forEach((t) => {
    t.addEventListener("pointerdown", ue, { capture: !0 }), t.addEventListener("click", ue, { capture: !0 });
  }));
}
function $t(e) {
  const t = String(e ?? "");
  return t === "free" || t === "premium" || t === "installed" ? t : "all";
}
function Lt(e) {
  return String(e ?? "") === "releases" ? "releases" : "updates";
}
function ue(e) {
  var t;
  e.preventDefault(), e.stopPropagation(), (t = e.stopImmediatePropagation) == null || t.call(e), R();
}
async function R() {
  var o, s;
  if (D) return;
  D = !0;
  const e = r, t = e ? g(e.element) : document.querySelector("#holosuite-launcher"), n = ((o = t == null ? void 0 : t.closest) == null ? void 0 : o.call(t, "#holosuite-launcher, .holosuite-launcher-window")) ?? t;
  r = null, w = null;
  try {
    await ((s = e == null ? void 0 : e.close) == null ? void 0 : s.call(e, { force: !0 }));
  } catch (i) {
    console.warn(`${a} | Foundry did not close the launcher cleanly; removing stale launcher element.`, i);
  } finally {
    D = !1;
  }
  window.setTimeout(() => {
    n != null && n.isConnected && n.remove(), r || Se();
  }, 0);
}
function Nt() {
  var n;
  const e = game.modules;
  return p((e == null ? void 0 : e.contents) ?? Array.from(((n = e == null ? void 0 : e.values) == null ? void 0 : n.call(e)) ?? [])).filter((o) => (o == null ? void 0 : o.active) === !0).map((o) => ({
    id: String(o.id ?? ""),
    title: String(o.title ?? o.id ?? ""),
    version: String(o.version ?? "")
  })).sort((o, s) => o.id.localeCompare(s.id));
}
function At() {
  const e = Array.from(
    document.querySelectorAll(`link[${L}]`)
  );
  return G.map((t) => {
    const n = e.find((o) => o.getAttribute(L) === t) ?? null;
    return {
      path: t,
      present: n !== null,
      loaded: (n == null ? void 0 : n.sheet) != null,
      href: (n == null ? void 0 : n.href) ?? null
    };
  });
}
function Ht() {
  var n;
  const e = game.messages, t = Number((e == null ? void 0 : e.size) ?? ((n = e == null ? void 0 : e.contents) == null ? void 0 : n.length) ?? 0);
  return Number.isFinite(t) ? t : 0;
}
function ee() {
  var d, c, m;
  const e = f(a, F) === !0, t = h(), n = f(a, W) === !0, o = At(), s = Nt(), i = game.release, l = game.system;
  return {
    schemaVersion: 1,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    core: {
      version: String(((d = game.modules.get(a)) == null ? void 0 : d.version) ?? ""),
      diagnosticModeActive: t || e || n,
      apiOnly: t,
      cssDisabled: e,
      visualEffectsDisabled: n,
      stylesheets: o,
      launcherOpen: U(r) || Q(),
      registeredApps: [...C.values()].map((y) => ({
        id: y.id,
        title: y.title,
        premium: y.premium === !0,
        playerVisible: y.playerVisible !== !1
      })),
      registeredWhatsNewModules: [...b.keys()].sort(),
      deviceStyle: {
        effective: Ee(),
        client: Z(),
        forced: P()
      },
      colorTheme: $e(f(a, x))
    },
    foundry: {
      version: String((i == null ? void 0 : i.version) ?? game.version ?? ""),
      generation: Number((i == null ? void 0 : i.generation) ?? 0) || null,
      build: Number((i == null ? void 0 : i.build) ?? 0) || null,
      systemId: String((l == null ? void 0 : l.id) ?? ""),
      systemVersion: String((l == null ? void 0 : l.version) ?? ""),
      worldId: String(((c = game.world) == null ? void 0 : c.id) ?? ""),
      isGM: ((m = game.user) == null ? void 0 : m.isGM) === !0
    },
    workload: {
      chatMessages: Ht(),
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
    activeModules: s
  };
}
function Pe() {
  return JSON.stringify(ee(), null, 2);
}
async function Dt() {
  var t, n, o, s, i, l;
  const e = Pe();
  try {
    if ((t = navigator.clipboard) != null && t.writeText)
      await navigator.clipboard.writeText(e);
    else if ((n = game.clipboard) != null && n.copyPlainText)
      await game.clipboard.copyPlainText(e);
    else
      throw new Error("No clipboard API is available.");
    (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "HoloSuite Core diagnostics copied to the clipboard.");
  } catch (d) {
    console.warn(`${a} | Could not copy diagnostics.`, d), (l = (i = ui.notifications) == null ? void 0 : i.error) == null || l.call(i, "Could not copy diagnostics. Use Download JSON instead.");
  }
}
function kt() {
  const e = new Blob([Pe()], { type: "application/json" }), t = URL.createObjectURL(e), n = document.createElement("a"), o = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  n.href = t, n.download = `holosuite-core-diagnostics-${o}.json`, n.click(), window.setTimeout(() => URL.revokeObjectURL(t), 0);
}
function de() {
  const e = ee(), t = e.core, n = [
    t.apiOnly ? "API-only" : null,
    t.cssDisabled ? "CSS disabled" : null,
    t.visualEffectsDisabled ? "visual effects disabled" : null
  ].filter(Boolean), o = n.length > 0 ? n.join(", ") : "Normal";
  return `
    <form class="standard-form holosuite-core-diagnostics">
      <p>This report stays on this browser until you copy or download it. It includes module versions and browser/workload counts, but no actor, chat-message, or campaign content.</p>
      <fieldset>
        <legend>Current test state</legend>
        <div class="form-group"><label>Diagnostic mode</label><div class="form-fields"><strong>${u(o)}</strong></div></div>
        <div class="form-group"><label>Core version</label><div class="form-fields"><code>${u(t.version)}</code></div></div>
        <div class="form-group"><label>Core styles loaded</label><div class="form-fields"><strong>${t.stylesheets.filter((s) => s.present).length}/${t.stylesheets.length}</strong></div></div>
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
        <pre style="max-height: 360px; overflow: auto; user-select: text; white-space: pre-wrap;">${u(JSON.stringify(e, null, 2))}</pre>
      </details>
    </form>
  `;
}
function he(e, t) {
  var n, o, s;
  e && ((n = e.querySelector("[data-action='refresh']")) == null || n.addEventListener("click", () => t.render(!1)), (o = e.querySelector("[data-action='copy']")) == null || o.addEventListener("click", () => void Dt()), (s = e.querySelector("[data-action='download']")) == null || s.addEventListener("click", kt));
}
class Me extends be {
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
    return $(de());
  }
  activateListeners(t) {
    super.activateListeners(t), he(g(t), this);
  }
  async _renderHTML() {
    const t = document.createElement("template");
    return t.innerHTML = de().trim(), t.content;
  }
  _replaceHTML(t, n) {
    const o = g(n), s = (o == null ? void 0 : o.querySelector(".window-content")) ?? o;
    if (!s) return;
    const i = t instanceof DocumentFragment || t instanceof HTMLElement ? t : g(t);
    i ? s.replaceChildren(i) : s.innerHTML = String(t ?? ""), he(s, this);
  }
  async _updateObject() {
  }
}
v(Me, "DEFAULT_OPTIONS", {
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
class O extends be {
  constructor() {
    super(...arguments);
    v(this, "currentView", "apps");
    v(this, "whatsNewFilter", "all");
    v(this, "whatsNewTab", "releases");
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
    var o, s;
    return h() ? ((s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, "HoloSuite Core is in API-only diagnostic mode on this browser."), this) : super.render(...n);
  }
  async _renderInner() {
    return $(ce(this.currentView, this.whatsNewFilter, this.whatsNewTab));
  }
  activateListeners(n) {
    super.activateListeners(n), B(g(n));
  }
  async _renderHTML() {
    const n = document.createElement("template");
    return n.innerHTML = ce(this.currentView, this.whatsNewFilter, this.whatsNewTab).trim(), n.content;
  }
  _replaceHTML(n, o) {
    const s = this.getRenderTarget(o);
    if (!s) return;
    const i = n instanceof DocumentFragment || n instanceof HTMLElement ? n : g(n);
    i ? s.replaceChildren(i) : s.innerHTML = String(n ?? ""), B(s);
  }
  async close(n = {}) {
    return r = null, super.close(n);
  }
  getLauncherRoot(n = {}) {
    var i;
    const o = g(this.element), s = (o == null ? void 0 : o.querySelector(".holosuite-phone")) ?? ((i = o == null ? void 0 : o.closest) == null ? void 0 : i.call(o, ".holosuite-phone")) ?? null;
    return s != null && s.isConnected ? s : n.includeDocumentFallback === !1 ? null : document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone");
  }
  getRenderTarget(n) {
    const o = g(n);
    return o ? o.querySelector(".window-content") ?? o.querySelector(".holosuite-launcher-window .window-content") ?? o : null;
  }
  updateRenderedView() {
    const n = this.getLauncherRoot();
    if (!n) return !1;
    const o = n.querySelector(".holosuite-status-bar"), s = n.querySelector(".holosuite-screen");
    return !o || !s ? !1 : (o.innerHTML = `
      <span>HoloSuite</span>
      ${Oe(this.currentView)}
    `, s.innerHTML = this.currentView === "whats-new" ? Fe(this.whatsNewFilter, this.whatsNewTab) : this.currentView === "settings" ? We() : _e(), s.classList.toggle("holosuite-screen--whats-new", this.currentView === "whats-new"), s.classList.toggle("holosuite-screen--settings", this.currentView === "settings"), B(n), !0);
  }
  showApps() {
    this.currentView = "apps", this.updateRenderedView() || this.render(!1);
  }
  showWhatsNew() {
    this.currentView = "whats-new", nt(), this.updateRenderedView() || this.render(!1);
  }
  showSettings() {
    this.currentView = "settings", this.updateRenderedView() || this.render(!1);
  }
  async setDeviceStyle(n) {
    P() || (await game.settings.set(a, j, n), this.currentView = "settings", I(), this.refreshCurrentView());
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
v(O, "DEFAULT_OPTIONS", {
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
const S = {
  registerApp(e) {
    const t = ot(e);
    return t ? (C.set(t.id, t), h() || r == null || r.render(!1), t) : null;
  },
  unregisterApp(e) {
    const t = C.delete(String(e ?? ""));
    return t && !h() && (r == null || r.render(!1)), t;
  },
  getApps() {
    return [...C.values()];
  },
  getDiagnostics() {
    return ee();
  },
  registerWhatsNew(e) {
    return ke(e);
  },
  unregisterWhatsNew(e) {
    const t = b.delete(String(e ?? ""));
    return t && !h() && (r == null || r.render(!1)), t;
  },
  getWhatsNew() {
    return [...b.values()].sort(Y);
  },
  async openLauncher() {
    var e, t;
    return h() ? ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "HoloSuite Core is in API-only diagnostic mode on this browser."), null) : w || (w = (async () => {
      U(r) || (r = null), r || (r = new O());
      try {
        await r.render(!0);
      } catch (n) {
        console.warn(`${a} | Recreating launcher after render failure.`, n), r = new O(), await r.render(!0);
      }
      return rt(r), r;
    })().finally(() => {
      w = null;
    }), w);
  },
  async toggleLauncher() {
    return w || (U(r) ? (await R(), null) : (Q() && Se(), at(), S.openLauncher()));
  }
};
function Re() {
  const e = game.modules.get(a);
  if (game.holosuite = S, globalThis.HoloSuiteCoreApi = S, e)
    try {
      e.api = S;
    } catch (t) {
      console.warn(`${a} | Could not attach API to game.modules; using game.holosuite fallback.`, t);
    }
  Hooks.callAll(`${a}.apiReady`, S);
}
Hooks.once("init", () => {
  Ae(), ht(), Ce(), Te(), gt(), Re();
});
Hooks.on("getSceneControlButtons", st);
Hooks.on("renderSceneControls", (e, t) => ut(t));
Hooks.on("renderSidebar", K);
Hooks.on("renderSidebarTab", K);
Hooks.on("renderSettingsConfig", dt);
Hooks.once("ready", () => {
  q = !0, Re(), Ae(), I(), wt(), h() ? console.warn(`${a} | API-only diagnostic mode is enabled on this browser.`) : (K(), Ie()), console.log(`${a} | Ready. API available at game.modules.get("${a}").api`);
});
