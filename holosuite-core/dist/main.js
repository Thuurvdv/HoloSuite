var tn = Object.defineProperty;
var nn = (e, n, t) => n in e ? tn(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t;
var M = (e, n, t) => nn(e, typeof n != "symbol" ? n + "" : n, t);
const He = [
  "modules/holosuite-core/styles/holosuite-tokens.css",
  "modules/holosuite-core/styles/holosuite-core.css"
], ne = "data-holosuite-core-stylesheet";
function on(e, n) {
  const t = String(n ?? "").trim();
  return t ? `${e}?v=${encodeURIComponent(t)}` : e;
}
function rn(e, n = document, t = "") {
  const o = Array.from(
    n.querySelectorAll(`link[${ne}]`)
  );
  if (!e) {
    for (const a of o) a.remove();
    return;
  }
  const i = n.head;
  if (!i) return;
  const r = new Set(He), s = /* @__PURE__ */ new Set();
  for (const a of o) {
    const l = a.getAttribute(ne) ?? "";
    if (!r.has(l) || s.has(l)) {
      a.remove();
      continue;
    }
    s.add(l);
  }
  for (const a of He) {
    if (s.has(a)) continue;
    const l = n.createElement("link");
    l.rel = "stylesheet", l.href = on(a, t), l.setAttribute(ne, a), i.append(l);
  }
}
function oe(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function ot(e, n) {
  return oe(e) ? n.includes(String(e.name ?? "")) : !1;
}
function it(e) {
  if (!oe(e) || !("tools" in e)) return !1;
  const n = String(e.name ?? "");
  return !["measure", "templates", "walls", "lighting", "sounds", "notes", "tiles", "drawings"].includes(n);
}
function sn(e, n, t) {
  if (Array.isArray(e))
    return e.find((o) => ot(o, n)) ?? (t ? e.find(it) : null) ?? null;
  if (!oe(e)) return null;
  for (const o of n)
    if (oe(e[o])) return e[o];
  return Object.values(e).find((o) => ot(o, n)) ?? (t ? Object.values(e).find(it) : null) ?? null;
}
function an(e) {
  const n = Object.values(e).map((t) => Number(t == null ? void 0 : t.order)).filter(Number.isFinite);
  return n.length ? Math.max(...n) + 1 : Object.keys(e).length;
}
function rt(e, n, t = ["tokens", "token"], o = {}) {
  const i = sn(e, t, o.allowFallback === !0);
  if (!i) return !1;
  const r = i.tools;
  return Array.isArray(r) ? r.some((s) => (s == null ? void 0 : s.name) === n.name) ? !1 : (r.push(n), !0) : !oe(r) || r[n.name] ? !1 : (r[n.name] = { ...n, order: n.order ?? an(r) }, !0);
}
const z = "branding", N = "holosuite-core", bt = {
  "fa-mobile-screen-button": "Phone",
  "fa-terminal": "Terminal",
  "fa-building-columns": "Bank",
  "fa-rocket": "Rocket",
  "fa-shuttle-space": "Shuttle",
  "fa-satellite-dish": "Satellite dish",
  "fa-tower-broadcast": "Broadcast tower",
  "fa-database": "Database",
  "fa-fingerprint": "Fingerprint",
  "fa-id-card": "ID card",
  "fa-shield-halved": "Shield",
  "fa-wave-square": "Waveform",
  "fa-video": "Video camera",
  "fa-draw-polygon": "Blueprint",
  "fa-bezier-curve": "Path",
  "fa-atom": "Atom",
  "fa-tornado": "Vortex",
  "fa-crosshairs": "Crosshairs",
  "fa-route": "Route",
  "fa-store": "Shop",
  "fa-file-import": "Import",
  "fa-microchip": "Microchip",
  "fa-robot": "Robot",
  "fa-wand-magic-sparkles": "Sparkles",
  "fa-bolt-lightning": "Lightning",
  "fa-cube": "Cube",
  "fa-star": "Star",
  "fa-gear": "Gear",
  "fa-arrow-left": "Left arrow",
  "fa-circle-xmark": "Close circle"
}, ln = {
  name: 100,
  label: 48,
  tagline: 160,
  gmTitle: 100,
  gmHeading: 60,
  gmScreen: 48,
  playerTitle: 100,
  playerHeading: 60,
  playerScreen: 48,
  userLabel: 48,
  linkStatus: 48
};
function ce(e) {
  if (typeof e != "string") return "";
  const n = e.trim();
  if (!n || n.length > 2048 || /[\x00-\x1f<>"'\\]/.test(n) || n.startsWith("//")) return "";
  try {
    const t = new URL(n, "https://world.invalid/");
    return !/^https?:$/.test(t.protocol) || t.username || t.password ? "" : /\.(png|webp)$/i.test(t.pathname) ? n : "";
  } catch {
    return "";
  }
}
function ue(e) {
  if (!e || typeof e != "object") return {};
  const n = e, t = {};
  for (const [r, s] of Object.entries(ln)) {
    const a = n[r];
    typeof a == "string" && a.trim() && (t[r] = a.trim().slice(0, s));
  }
  for (const r of ["icon", "backIcon", "settingsIcon", "updatesIcon", "closeIcon"]) {
    const s = n[r];
    typeof s == "string" && Object.hasOwn(bt, s) && (t[r] = s);
  }
  const o = ce(n.iconImage), i = ce(n.logo);
  if (o && (t.iconImage = o), i && (t.logo = i), n.text && typeof n.text == "object") {
    const r = Object.entries(n.text).slice(0, 20).filter(([s, a]) => /^[a-z][a-zA-Z0-9]{0,39}$/.test(s) && typeof a == "string" && a.trim());
    r.length && (t.text = Object.fromEntries(r.map(([s, a]) => [s, a.trim().slice(0, 160)])));
  }
  return t;
}
const st = "[data-holosuite-branding]", Oe = "data-holosuite-branding-default", at = "data-holosuite-branding-override";
function te(e, n) {
  var o;
  (o = e.querySelector(`:scope > [${at}]`)) == null || o.remove();
  let t = e.querySelector(`:scope > [${Oe}]`);
  if (!n) {
    t && t.replaceWith(...t.childNodes);
    return;
  }
  t || (t = document.createElement("span"), t.setAttribute(Oe, ""), t.style.display = "none", t.append(...e.childNodes), e.append(t)), n.setAttribute(at, ""), e.append(n);
}
function Le(e) {
  if (!e) return;
  const n = document.createElement("span");
  return n.textContent = e, n;
}
function wt({ logo: e, iconImage: n, icon: t }) {
  const o = e || n;
  if (!o && !t) return;
  const i = document.createElement("span");
  if (i.className = "holosuite-module-brand-icon", i.setAttribute("aria-hidden", "true"), o) {
    const r = document.createElement("img");
    r.src = o, r.alt = "";
    const s = () => {
      if (!i.parentElement) return;
      const a = wt({ icon: t });
      a ? i.replaceChildren(...a.childNodes) : te(i.parentElement);
    };
    i.append(r), r.addEventListener("error", s, { once: !0 }), r.complete && !r.naturalWidth && queueMicrotask(s);
  } else {
    const r = document.createElement("i");
    r.className = `fa-solid ${t}`, i.append(r);
  }
  return i;
}
function Re(e, n) {
  var o, i, r;
  const t = [...e.querySelectorAll(st)];
  e instanceof HTMLElement && e.matches(st) && t.unshift(e);
  for (const s of t) {
    const a = n(s.dataset.holosuiteBranding);
    for (const p of s.querySelectorAll("[data-holosuite-brand-name]"))
      te(p, Le(a.name));
    for (const p of s.querySelectorAll("[data-holosuite-brand-text]")) {
      const h = p.dataset.holosuiteBrandText, b = p.hasAttribute("data-holosuite-brand-fallback-name") ? a.name : void 0;
      te(p, Le((h === "tagline" ? a.tagline : (o = a.text) == null ? void 0 : o[h]) || b));
    }
    for (const p of s.querySelectorAll("[data-holosuite-brand-icon]"))
      te(p, wt(a));
    const l = (i = s.closest(".app, .application")) == null ? void 0 : i.querySelector(":scope > .window-header"), m = l == null ? void 0 : l.querySelector(".window-title");
    if (m) {
      const p = ((r = m.querySelector(`:scope > [${Oe}]`)) == null ? void 0 : r.textContent) ?? m.textContent, h = a.name && s.hasAttribute("data-holosuite-brand-title-prefix") && p ? `${a.name} · ${p}` : a.name;
      te(m, Le(h));
    }
  }
}
const u = "holosuite-core", be = "apiOnlyForDebugging", we = "disableCoreCssForDebugging", ye = "disableVisualEffectsForDebugging", yt = "disableForPlayers", Be = "deviceStyle", St = "forceDeviceStyle", We = "formFactor", vt = "themedAppColors", qe = "appOrder", Ge = "theme", Ve = "whatsNewLastSeen", cn = "openLauncher", lt = "data-holosuite-foundry-generation", ct = "data-holosuite-debug-no-effects", un = `modules/${u}/data/whats-new.json`, dn = Date.UTC(2026, 7, 1), hn = /* @__PURE__ */ new Set([
  "bounty-board",
  "csi-toolkit",
  "cybercall",
  "galaxy-map",
  "holo-assistant",
  "holodock",
  "holosuite-blueprint",
  "holosuite-critical-cutin",
  "holosuite-galactic-records",
  "holosuite-hacking",
  "holosuite-loot",
  "holosuite-terminal",
  "holosuite-vending-machines",
  "pulse-scanner",
  "security-camera",
  "security-cameras"
]), Ae = {
  base: "HoloSuite",
  "space-police": "Space Police",
  "cassette-futurism": "Cassette Futurism"
}, J = {
  base: Ae.base,
  "space-police": Ae["space-police"],
  "cassette-futurism": Ae["cassette-futurism"]
}, fn = {
  "": "Allow User Choice",
  ...J
}, de = {
  phone: "Compact",
  datapad: "Datapad",
  computer: "Computer"
}, Et = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
}, C = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map();
function gn() {
  return [...new Map([...he, ...C]).values()].sort((e, n) => e.title.localeCompare(n.title));
}
const V = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map();
let c = null, ke = null, W = null, le = !1, $t = 0, fe = !1, Tt = null, ut = !1, ee = null, _ = !1, Fe = 0;
function mn() {
  var t, o, i, r, s, a;
  const e = ((o = (t = globalThis.foundry) == null ? void 0 : t.appv1) == null ? void 0 : o.api) ?? ((i = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : i.api) ?? null, n = ((s = (r = globalThis.foundry) == null ? void 0 : r.applications) == null ? void 0 : s.api) ?? ((a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.api) ?? null;
  return globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (n == null ? void 0 : n.ApplicationV2);
}
const Se = mn();
function xe(e) {
  return e ? !!e.getLauncherRoot({ includeDocumentFallback: !1 }) : !1;
}
function d(e) {
  return String(e ?? "").replace(/[&<>"']/g, (n) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[n]);
}
function ae(e, n, t = `${n}s`) {
  return `${e} ${e === 1 ? n : t}`;
}
function v(e, n) {
  try {
    return game.settings.get(e, n);
  } catch {
    return null;
  }
}
function A() {
  return Tt ?? v(u, be) === !0;
}
function Ie(e) {
  var n;
  return ((n = game.modules.get(e)) == null ? void 0 : n.api) ?? null;
}
function pn() {
  var e, n, t;
  return String(((n = (e = game.user) == null ? void 0 : e.character) == null ? void 0 : n.name) ?? ((t = game.user) == null ? void 0 : t.name) ?? "Player");
}
function bn(e) {
  var n, t, o, i, r, s;
  if (e === "cybercall") {
    const a = P(v("cybercall", "contacts")), l = P(v("cybercall", "groupContacts"));
    return ae(a.length + l.length, "link");
  }
  if (e === "bounty-board") {
    const a = P((t = (n = Ie("bounty-board")) == null ? void 0 : n.getAllBounties) == null ? void 0 : t.call(n, { includeHidden: !1 }));
    return ae(a.length, "contract");
  }
  if (e === "csi-toolkit") {
    const a = Object.values(((i = (o = Ie("csi-toolkit")) == null ? void 0 : o.getCases) == null ? void 0 : i.call(o)) ?? {}).filter((l) => (l == null ? void 0 : l.visibility) !== "gm");
    return ae(a.length, "case");
  }
  if (e === "galaxy-map") {
    const a = P((s = (r = Ie("galaxy-map")) == null ? void 0 : r.getMaps) == null ? void 0 : s.call(r)).filter((l) => (l == null ? void 0 : l.visibility) === "players");
    return ae(a.length, "chart");
  }
  return "";
}
function P(e) {
  return Array.isArray(e) ? e : [];
}
function wn(e) {
  const n = String((e == null ? void 0 : e.title) ?? "").trim();
  if (!n) return null;
  const t = P(e == null ? void 0 : e.tags).map((i) => String(i ?? "").trim()).find((i) => /^foundry\b/i.test(i)), o = t ? [t.replace(/-v(?=\d)/i, "–")] : [];
  return {
    title: n,
    summary: String((e == null ? void 0 : e.summary) ?? "").trim(),
    tags: o
  };
}
function Ct(e) {
  const n = String((e == null ? void 0 : e.moduleId) ?? "").trim(), t = String((e == null ? void 0 : e.title) ?? "").trim(), o = P(e == null ? void 0 : e.entries).map((r) => wn(r)).filter((r) => !!r);
  if (!n || !t || o.length === 0)
    return console.warn(`${u} | Ignoring invalid what's new registration.`, e), null;
  const i = String((e == null ? void 0 : e.tier) ?? "free").toLowerCase() === "premium" ? "premium" : "free";
  return {
    moduleId: n,
    title: t,
    tier: i,
    version: String((e == null ? void 0 : e.version) ?? "").trim(),
    updated: String((e == null ? void 0 : e.updated) ?? "").trim(),
    icon: String((e == null ? void 0 : e.icon) ?? "").trim(),
    url: String((e == null ? void 0 : e.url) ?? "").trim(),
    entries: o
  };
}
function X(e) {
  const n = Date.parse(String(e.updated ?? ""));
  return Number.isFinite(n) ? n : 0;
}
function je(e, n) {
  return X(n) - X(e) || e.title.localeCompare(n.title);
}
function Lt(e) {
  var n, t;
  return ((t = (n = game.modules) == null ? void 0 : n.has) == null ? void 0 : t.call(n, e)) === !0;
}
function yn() {
  const e = Number(v(u, Ve));
  return Number.isFinite(e) ? e : 0;
}
function Sn() {
  const e = yn();
  return [...V.values(), ...Y.values()].filter((n) => X(n) > e).reduce((n, t) => n + t.entries.length, 0);
}
function vn() {
  try {
    game.settings.set(u, Ve, Date.now());
  } catch (e) {
    console.warn(`${u} | Could not update what's new read state.`, e);
  }
}
function dt(e) {
  const n = String((e == null ? void 0 : e.id) ?? "").trim(), t = String((e == null ? void 0 : e.title) ?? "").trim(), o = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !n || !t || !o || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${u} | Ignoring invalid app registration.`, e), null) : {
    id: n,
    title: t,
    icon: o,
    brandingHeader: e.brandingHeader,
    brandingInApp: e.brandingInApp === !0,
    premium: e.premium === !0,
    playerVisible: e.playerVisible !== !1,
    description: String(e.description ?? "").trim(),
    featureId: String(e.featureId ?? n).trim() || n,
    open: e.open,
    contextActions: (e.contextActions ?? []).filter((i) => (i == null ? void 0 : i.label) && typeof i.callback == "function")
  };
}
function At(e) {
  return e.replace(/^HoloSuite\s*:?\s*/i, "").trim() || e;
}
function T(e) {
  const n = v(u, z);
  return !n || typeof n != "object" || !Object.hasOwn(n, e) ? {} : ue(n[e]);
}
function kt(e, n = T(N)) {
  const t = n.name || "HoloSuite";
  return e ? n.gmTitle || `${t} Command Deck` : n.playerTitle || `${t} Player View`;
}
function G(e, n) {
  const t = `<i class="${d(e.icon ? `fa-solid ${e.icon}` : n)}" aria-hidden="true"></i>`;
  return e.iconImage ? `<img class="holosuite-brand-image" src="${d(e.iconImage)}" alt="">${t}` : t;
}
function ge(e) {
  e.querySelectorAll("img.holosuite-brand-image").forEach((n) => {
    const t = () => {
      n.hidden = !0;
    };
    n.addEventListener("error", t, { once: !0 }), n.complete && !n.naturalWidth && t();
  });
}
function En(e) {
  var i;
  if (A()) return;
  const n = ((i = game.user) == null ? void 0 : i.isGM) === !0;
  if (!n && Te()) return;
  const t = () => ({
    name: "holosuite-core-launcher",
    title: kt(n),
    icon: Pn(),
    button: !0,
    visible: !0,
    onClick: Dt,
    onChange: An
  }), o = rt(e, t(), ["tiles", "tile"]);
  rt(e, t(), ["tokens", "token"], { allowFallback: !o });
}
function $n() {
  var e;
  return !A() && (((e = game.user) == null ? void 0 : e.isGM) === !0 || !Te());
}
function ve() {
  A() || document.querySelectorAll(".holosuite-sidebar-launcher, .holosuite-floating-launcher").forEach((e) => e.remove());
}
function D(e) {
  var o;
  if (e instanceof HTMLElement) return e;
  if (Array.isArray(e) && e[0] instanceof HTMLElement) return e[0];
  const n = e, t = ((o = n == null ? void 0 : n.get) == null ? void 0 : o.call(n, 0)) ?? (n == null ? void 0 : n[0]);
  return t instanceof HTMLElement ? t : null;
}
function Tn(e) {
  var r;
  const n = new Set(document.querySelectorAll("#holosuite-launcher, .holosuite-launcher-window"));
  if (n.size <= 1) return;
  const t = e ? D(e.element) : null, i = ((r = t == null ? void 0 : t.closest) == null ? void 0 : r.call(t, "#holosuite-launcher, .holosuite-launcher-window")) ?? [...n].at(-1) ?? null;
  for (const s of n)
    s !== i && s.remove();
}
function It() {
  document.querySelectorAll("#holosuite-launcher, .holosuite-launcher-window").forEach((e) => {
    e.remove();
  });
}
function Ue() {
  return document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone") !== null;
}
function Cn() {
  c = null, W = null, le = !1;
}
function Ln(e) {
  const n = e.find((t) => typeof t == "boolean");
  return typeof n == "boolean" ? n : null;
}
function Dt() {
  return $t = Date.now(), q.toggleLauncher();
}
function An(...e) {
  const n = Ln(e);
  return n === !1 ? (Ce(), null) : n === null && Date.now() - $t < 100 ? null : q.openLauncher();
}
function kn(e) {
  var a;
  if (A()) return;
  const n = ((a = game.user) == null ? void 0 : a.isGM) === !0;
  if (!n && Te()) return;
  const t = D(e) ?? document.querySelector("#controls, #scene-controls");
  if (!t) return;
  const o = T(N), i = t.querySelectorAll("[data-tool='holosuite-core-launcher'], [data-action='holosuite-core-launcher']");
  if (i.length) {
    o.iconImage && i.forEach((l) => {
      l.querySelector("img.holosuite-brand-image") || (l.insertAdjacentHTML("afterbegin", `<img class="holosuite-brand-image" src="${d(o.iconImage)}" alt="">`), ge(l));
    });
    return;
  }
  const r = t.querySelector(
    ".control-tools.active, .sub-controls.active, .scene-control-tools.active, .control-tools, .sub-controls, .scene-control-tools"
  );
  if (!r) return;
  const s = document.createElement("li");
  s.className = "control-tool holosuite-scene-control", s.dataset.tool = "holosuite-core-launcher", s.title = kt(n, o), s.innerHTML = G(o, Wt()), ge(s), s.addEventListener("click", (l) => {
    l.preventDefault(), l.stopPropagation(), Dt();
  }), r.appendChild(s);
}
function In(e, n) {
  var r;
  const t = D(n);
  if (!t) return;
  const i = [
    `input[name="${u}.${be}"]`,
    `input[name="${u}.${we}"]`,
    `input[name="${u}.${ye}"]`
  ].map((s) => {
    var a;
    return ((a = t.querySelector(s)) == null ? void 0 : a.closest(".form-group")) ?? null;
  }).filter((s) => s !== null);
  for (const s of i) (r = s.parentElement) == null || r.append(s);
}
function Dn() {
  game.settings.register(u, z, {
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: () => {
      Re(document, T), Hooks.callAll("holosuite-core.brandingChanged"), !(!fe || A()) && (c == null || c.refreshCurrentView(), ve(), Me());
    }
  }), game.settings.registerMenu(u, "brandingEditor", {
    name: "HoloSuite Branding",
    label: "Open HoloSuite Branding",
    hint: "Customize the device and app branding for this world.",
    icon: "fa-solid fa-palette",
    type: Ke,
    restricted: !0
  }), game.settings.register(u, be, {
    name: "Debugging: API-Only Mode (This Browser)",
    hint: "Diagnostic only. Keeps Core's registration API active while disabling its launcher, scene-control UI, sidebar cleanup, and What's New catalog work on this browser.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => Nn(e)
  }), game.settings.register(u, we, {
    name: "Debugging: Disable HoloSuite Core CSS (This Browser)",
    hint: "Diagnostic only. Temporarily removes Core's shared tokens and launcher styles from this browser. HoloSuite interfaces will appear unstyled. Leave this off during normal play.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => Nt(e)
  }), game.settings.register(u, ye, {
    name: "Debugging: Disable Core Visual Effects (This Browser)",
    hint: "Diagnostic only. Keeps Core's layout and colors while disabling launcher transitions, animations, filters, shadows, and glows on this browser.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => Ht(e)
  }), game.settings.register(u, Be, {
    name: "HoloSuite Theme",
    hint: "Choose the HoloSuite launcher theme for this user.",
    scope: "client",
    config: !0,
    type: String,
    choices: J,
    default: "base",
    restricted: !1,
    onChange: () => {
      Pe(), c == null || c.refreshCurrentView();
    }
  }), game.settings.register(u, St, {
    name: "Force HoloSuite Theme",
    hint: "When set, every user sees this HoloSuite launcher theme instead of their personal choice.",
    scope: "world",
    config: !0,
    type: String,
    choices: fn,
    default: "",
    restricted: !0,
    onChange: () => {
      Pe(), c == null || c.refreshCurrentView();
    }
  }), game.settings.register(u, We, {
    name: "HoloSuite Size",
    hint: "Choose a compact, wide datapad, or large computer layout for this user.",
    scope: "client",
    config: !0,
    type: String,
    choices: de,
    default: "phone",
    restricted: !1,
    onChange: () => {
      _t(), c == null || c.refreshCurrentView(), c == null || c.resizeForFormFactor();
    }
  }), game.settings.register(u, vt, {
    name: "Use Themed App Colors",
    hint: "Use the active device theme’s accent for app icons and buttons. Uploaded branding images keep their original colors.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: () => c == null ? void 0 : c.applyAppColors()
  }), game.settings.register(u, qe, {
    name: "HoloSuite App Order",
    hint: "Stores this user's custom launcher order.",
    scope: "client",
    config: !1,
    type: Array,
    default: [],
    restricted: !1
  }), game.settings.register(u, Ge, {
    name: "HoloSuite Color Theme",
    hint: "Changes the shared color theme used by HoloSuite windows.",
    scope: "world",
    config: !0,
    type: String,
    choices: Et,
    default: "default",
    restricted: !0,
    onChange: (e) => Pt(e)
  }), game.settings.register(u, yt, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !0
  }), game.settings.register(u, Ve, {
    name: "HoloSuite What's New Last Seen",
    hint: "Tracks when this client last opened the HoloSuite What's New view.",
    scope: "client",
    config: !1,
    type: Number,
    default: 0
  }), game.settings.registerMenu(u, "launcher", {
    name: "HoloSuite Command Deck",
    label: "Open HoloSuite",
    hint: "Open the HoloSuite launcher and registered app deck.",
    icon: "fas fa-terminal",
    type: pe,
    restricted: !0
  }), game.settings.registerMenu(u, "diagnostics", {
    name: "HoloSuite Core Diagnostics",
    label: "Open Diagnostics",
    hint: "Inspect, copy, or download the current HoloSuite and Foundry test state.",
    icon: "fas fa-stethoscope",
    type: Zt,
    restricted: !0
  });
}
async function Me() {
  var t;
  const e = ui.controls;
  if (typeof (e == null ? void 0 : e.render) != "function") return;
  const n = Number(((t = game.release) == null ? void 0 : t.generation) ?? 0);
  try {
    n >= 13 ? await e.render({ force: !0, reset: !0 }) : await e.render(!0);
  } catch (o) {
    console.warn(`${u} | Could not rebuild scene controls.`, o);
  }
}
function Nn(e = v(u, be)) {
  const n = e === !0;
  if (Tt = n, n) {
    document.querySelectorAll(
      "[data-tool='holosuite-core-launcher'], .holosuite-scene-control, .holosuite-sidebar-launcher, .holosuite-floating-launcher"
    ).forEach((t) => t.remove()), (c || Ue()) && Ce(), fe && Me(), console.warn(`${u} | API-only diagnostic mode is enabled on this browser.`);
    return;
  }
  fe && (Vt(), Me());
}
function Nt(e = v(u, we)) {
  var o;
  const n = e === !0, t = String(((o = game.modules.get(u)) == null ? void 0 : o.version) ?? "");
  rn(!n, document, t), n && console.warn(`${u} | Core CSS is disabled on this browser for debugging.`);
}
function Ht(e = v(u, ye)) {
  const n = e === !0;
  for (const t of [document.documentElement, document.body].filter(Boolean))
    n ? t.setAttribute(ct, "true") : t.removeAttribute(ct);
  n && console.warn(`${u} | Core visual effects are disabled on this browser for debugging.`);
}
function Hn() {
  var e, n;
  (n = (e = game.keybindings) == null ? void 0 : e.register) == null || n.call(e, u, cn, {
    name: "Open HoloSuite",
    hint: "Open the HoloSuite launcher and registered app deck.",
    editable: [],
    restricted: !1,
    onDown: () => {
      var t, o, i, r;
      return A() ? ((o = (t = ui.notifications) == null ? void 0 : t.warn) == null || o.call(t, "HoloSuite Core is in API-only diagnostic mode on this browser."), !1) : $n() ? (q.toggleLauncher(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "HoloSuite is disabled for players in this world."), !1);
    }
  });
}
function ze(e) {
  return Object.hasOwn(J, String(e)) ? String(e) : "base";
}
function Ee() {
  const e = String(v(u, St) ?? "");
  return Object.hasOwn(J, e) ? e : null;
}
function $e() {
  return ze(v(u, Be));
}
function Ot() {
  return Ee() ?? $e();
}
function Ft(e) {
  return Object.hasOwn(Et, String(e)) ? String(e) : "default";
}
function Ye(e) {
  const n = String(e ?? "");
  return Object.hasOwn(de, n) ? n : "phone";
}
function ie() {
  return Ye(v(u, We));
}
function On(e = ie()) {
  const n = e === "computer" ? { width: 980, height: 720 } : e === "datapad" ? { width: 760, height: 680 } : { width: 483, height: 736 };
  return {
    width: Math.min(n.width, Math.max(1, window.innerWidth - 32)),
    height: Math.min(n.height, Math.max(1, window.innerHeight - 32))
  };
}
function xt() {
  return v(u, vt) === !0 ? "theme" : "original";
}
function Mt() {
  return P(v(u, qe)).map((e) => String(e ?? "").trim()).filter((e, n, t) => !!e && t.indexOf(e) === n);
}
function Fn(e) {
  const n = ze(e), t = [document.documentElement, document.body].filter(Boolean);
  for (const o of t)
    n === "base" ? o.removeAttribute("data-holosuite-device-style") : o.setAttribute("data-holosuite-device-style", n);
}
function Pt(e) {
  const n = Ft(e), t = [document.documentElement, document.body].filter(Boolean);
  for (const o of t)
    n === "default" ? o.removeAttribute("data-holosuite-theme") : o.setAttribute("data-holosuite-theme", n);
}
function xn(e) {
  const n = Ye(e);
  for (const t of [document.documentElement, document.body].filter(Boolean))
    t.setAttribute("data-holosuite-form-factor", n);
}
function Pe() {
  Fn(Ot());
}
function Mn() {
  Pt(v(u, Ge));
}
function _t() {
  xn(ie());
}
function Rt() {
  var n, t, o;
  const e = Number(((t = (n = globalThis.game) == null ? void 0 : n.release) == null ? void 0 : t.generation) ?? ((o = game == null ? void 0 : game.release) == null ? void 0 : o.generation));
  return Number.isFinite(e) ? e : null;
}
function Bt() {
  const e = Rt(), n = [document.documentElement, document.body].filter(Boolean);
  for (const t of n)
    e === null ? t.removeAttribute(lt) : t.setAttribute(lt, String(e));
}
function Wt() {
  return Rt() === 12 ? "fa-solid fa-terminal" : "fa-solid fa-mobile-screen-button";
}
function Pn() {
  const e = T(N).icon;
  return e ? `fa-solid ${e}` : Wt();
}
function Te() {
  try {
    return game.settings.get(u, yt) === !0;
  } catch {
    return !1;
  }
}
function me(e) {
  var n;
  return ((n = game.user) == null ? void 0 : n.isGM) === !0 ? !0 : Te() ? !1 : e.playerVisible !== !1;
}
async function qt(e) {
  var t, o, i, r;
  const n = C.get(e);
  return n ? me(n) ? n.open() : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, `${n.title} is not available from the player view.`), null) : ((o = (t = ui.notifications) == null ? void 0 : t.warn) == null || o.call(t, `HoloSuite app "${e}" is not registered.`), null);
}
function Gt(e, n = {}) {
  const t = Ct(e);
  if (!t || X(t) < dn) return null;
  const o = V.get(t.moduleId);
  if (o) {
    const i = X(o), r = X(t);
    if (r < i || r === i && n.replace === !1) return o;
  }
  return V.set(t.moduleId, t), A() || c == null || c.render(!1), t;
}
function _n(e, n = {}) {
  const t = Ct(e);
  return t ? n.replace === !1 && Y.has(t.moduleId) ? Y.get(t.moduleId) ?? null : (Y.set(t.moduleId, t), A() || c == null || c.render(!1), t) : null;
}
async function Vt() {
  if (!(A() || ut))
    return ee || (ee = (async () => {
      try {
        const e = await fetch(un, { cache: "no-cache" });
        if (!e.ok) throw new Error(`HTTP ${e.status}`);
        const n = await e.json(), t = P(n == null ? void 0 : n.modules);
        for (const i of t)
          Gt(i, { replace: !1 });
        const o = P(n == null ? void 0 : n.releases);
        for (const i of o)
          _n(i, { replace: !1 });
        ut = !0;
      } catch (e) {
        console.warn(`${u} | Could not load bundled what's new catalog.`, e);
      }
    })().finally(() => {
      ee = null;
    }), ee);
}
function jt(e) {
  const n = T(N), t = Sn(), o = t > 0 ? `<span>${d(t)}</span>` : "";
  return `
    <div class="holosuite-header-actions">
      ${e === "apps" ? "" : `
    <button
      type="button"
      class="holosuite-header-action"
      data-holosuite-action="apps"
      title="Back to apps"
      aria-label="Back to apps"
    >
      ${G({ icon: n.backIcon }, "fa-solid fa-arrow-left")}
    </button>
  `}
      <button
        type="button"
        class="holosuite-header-action ${e === "settings" ? "is-active" : ""}"
        data-holosuite-action="settings"
        title="Settings"
        aria-label="Settings"
      >
        ${G({ icon: n.settingsIcon }, "fa-solid fa-gear")}
      </button>
      <button
        type="button"
        class="holosuite-header-action ${e === "whats-new" ? "is-active" : ""}"
        data-holosuite-action="whats-new"
        title="What's New"
        aria-label="What's New"
      >
        ${G({ icon: n.updatesIcon }, "fa-solid fa-star")}
        ${o}
      </button>
    </div>
  `;
}
function _e(e, n = T(e.id)) {
  return `
    <span class="holosuite-app-icon ${n.icon ? "holosuite-brand-glyph" : ""}" data-holosuite-app-icon="${d(e.id)}">
      ${G(n, e.icon)}
    </span>
  `;
}
function Xe(e, n = T(e.id)) {
  const t = At(e.title);
  return n.label || n.name || t;
}
function Ut(e, n, t) {
  const o = e.description;
  return `${_e(e, n)}
    <span class="holosuite-app-title">${d(Xe(e, n))}</span>
    ${t && o ? `<p>${d(o)}</p>` : ""}`;
}
function zt() {
  var p;
  const e = ((p = game.user) == null ? void 0 : p.isGM) === !0, n = Mt(), t = new Map(n.map((h, b) => [h, b])), o = [...C.values()].filter(me).sort((h, b) => {
    const f = t.get(h.id), w = t.get(b.id);
    return f !== void 0 || w !== void 0 ? f === void 0 ? 1 : w === void 0 ? -1 : f - w : h.title.localeCompare(b.title);
  }), i = T(N), r = e ? i.gmHeading || "GM Command Deck" : i.playerHeading || "Player Link", s = e ? i.gmScreen || "Apps" : i.playerScreen || "Commlink", a = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", l = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">${d(i.userLabel || "Active User")}</span>
        <strong>${d(pn())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>${d(i.linkStatus || "LINK STABLE")}</span>
      </div>
    </section>
  `, m = o.map((h) => {
    const b = e ? "" : bn(h.id);
    return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${d(h.id)}">
          ${Ut(h, T(h.id), e)}
          ${b ? `<span class="holosuite-app-count">${d(b)}</span>` : ""}
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
    ${l}
    <div class="holosuite-app-grid">
      ${o.length ? m : `<p class="holosuite-empty">${d(a)}</p>`}
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
function Rn(e) {
  return `
    <nav class="holosuite-whats-new-filters" aria-label="What's New filters">
      ${[
    { id: "all", label: "All" },
    { id: "free", label: "Free" },
    { id: "premium", label: "Premium" },
    { id: "installed", label: "Installed" }
  ].map((t) => `
        <button
          type="button"
          class="${t.id === e ? "is-active" : ""}"
          data-holosuite-filter="${d(t.id)}"
        >${d(t.label)}</button>
      `).join("")}
    </nav>
  `;
}
function Bn(e) {
  return `
    <nav class="holosuite-whats-new-tabs" aria-label="What's New tabs">
      ${[
    { id: "updates", label: "Updates", count: V.size },
    { id: "releases", label: "Releases", count: Y.size }
  ].map((t) => `
        <button
          type="button"
          class="${t.id === e ? "is-active" : ""}"
          data-holosuite-whats-new-tab="${d(t.id)}"
        >
          <span>${d(t.label)}</span>
          <strong>${d(t.count)}</strong>
        </button>
      `).join("")}
    </nav>
  `;
}
function Wn(e) {
  return [...V.values()].filter((n) => e === "installed" ? Lt(n.moduleId) : e === "free" || e === "premium" ? n.tier === e : !0).sort(je);
}
function qn(e) {
  return [...Y.values()].filter((n) => e === "installed" ? Lt(n.moduleId) : e === "free" || e === "premium" ? n.tier === e : !0).sort(je);
}
function Gn(e) {
  const n = e.icon || (e.tier === "premium" ? "fa-solid fa-gem" : "fa-solid fa-cube"), t = e.moduleId === "holosuite-buddy" ? "holo-assistant" : e.moduleId, o = C.get(e.moduleId) ?? C.get(t);
  return o ? _e(o) : hn.has(t) ? _e({ id: t, icon: n }) : G({}, n);
}
function Vn(e, n) {
  return e.length ? e.map((t) => {
    const o = t.entries.map((r) => {
      var s;
      return `
        <li>
          <strong>${d(r.title)}</strong>
          ${r.summary ? `<span>${d(r.summary)}</span>` : ""}
          ${(s = r.tags) != null && s.length ? `
            <div class="holosuite-whats-new-tags">
              ${r.tags.map((a) => `<span>${d(a)}</span>`).join("")}
            </div>
          ` : ""}
        </li>
      `;
    }).join(""), i = t.url ? `
          <a class="holosuite-whats-new-link" href="${d(t.url)}" target="_blank" rel="noreferrer">
            <span>Find out more</span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        ` : "";
    return `
        <article class="holosuite-whats-new-card">
          <header>
            <span class="holosuite-whats-new-icon">${Gn(t)}</span>
            <div>
              <h3>${d(t.title)}</h3>
            </div>
          </header>
          <ul>${o}</ul>
          ${i}
        </article>
      `;
  }).join("") : `<p class="holosuite-empty">${d(n)}</p>`;
}
function Yt(e, n) {
  const t = Wn(e), o = qn(e), i = n === "releases" ? o : t, r = n === "releases" ? "No releases match this filter yet." : "No updates match this filter yet.";
  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">Release Feed</span>
        <h2>What's New</h2>
      </div>
    </div>
    ${Bn(n)}
    ${Rn(e)}
    <div class="holosuite-whats-new-list">
      ${Vn(i, r)}
    </div>
  `;
}
function Xt() {
  var a;
  const e = Ee(), n = $e(), t = e ?? n, o = ie(), i = e ? `
    <div class="holosuite-settings-notice">
      <i class="fa-solid fa-lock"></i>
      <span>The GM is overriding the HoloSuite visual theme for this world. Your personal choice is paused until the override is removed.</span>
    </div>
  ` : "", r = Object.entries(J).map(([l, m]) => `
    <button
      type="button"
      class="holosuite-theme-choice ${l === t ? "is-active" : ""}"
      data-holosuite-device-style="${d(l)}"
      ${e ? "disabled" : ""}
      aria-pressed="${l === t ? "true" : "false"}"
    >
      <span class="holosuite-theme-preview holosuite-theme-preview--${d(l)}"></span>
      <strong>${d(m)}</strong>
    </button>
  `).join(""), s = Object.entries(de).map(([l, m]) => `
    <button
      type="button"
      class="holosuite-form-factor-choice ${l === o ? "is-active" : ""}"
      data-holosuite-form-factor-choice="${d(l)}"
      aria-pressed="${l === o ? "true" : "false"}"
    >
      <span class="holosuite-form-factor-preview holosuite-form-factor-preview--${d(l)}" aria-hidden="true"></span>
      <strong>${d(m)}</strong>
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
      ${i}
      <div class="holosuite-settings-field">
        <div>
          <span class="holosuite-kicker">Theme</span>
          <strong>${d(J[t])}</strong>
        </div>
      </div>
      <div class="holosuite-theme-choices" role="group" aria-label="Theme">
        ${r}
      </div>
      <div class="holosuite-settings-field">
        <div>
          <span class="holosuite-kicker">Size</span>
          <strong>${d(de[o])}</strong>
        </div>
      </div>
      <div class="holosuite-form-factor-choices" role="group" aria-label="Size">
        ${s}
      </div>
      ${(a = game.user) != null && a.isGM ? `
        <div class="holosuite-branding-action">
          <button type="button" data-holosuite-action="branding">Open HoloSuite Branding</button>
          <span class="holosuite-branding-warning" tabindex="0" role="img" aria-label="Experimental feature" data-tooltip="Experimental feature">
            <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
          </span>
        </div>
      ` : ""}
    </section>
  `;
}
function Jt(e = T(N)) {
  return `<span>${e.logo ? `<img class="holosuite-brand-image" src="${d(e.logo)}" alt="">` : ""}${d(e.name || "HoloSuite")}</span>`;
}
function ht(e = "apps", n = "all", t = "releases") {
  const o = e === "whats-new" ? "holosuite-screen--whats-new" : e === "settings" ? "holosuite-screen--settings" : "", i = e === "whats-new" ? Yt(n, t) : e === "settings" ? Xt() : zt();
  return `
    <section class="holosuite-phone" data-holosuite-app-colors="${xt()}">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          ${Jt()}
          ${jt(e)}
        </header>
        <main class="holosuite-screen ${o}">
          ${i}
        </main>
        <footer class="holosuite-dock">
          <button type="button" data-holosuite-action="close" title="Close" aria-label="Close">${G({ icon: T(N).closeIcon }, "fa-solid fa-circle-xmark")}</button>
        </footer>
      </div>
    </section>
  `;
}
function De(e, n) {
  _ = n, e.classList.toggle("is-reordering-apps", n);
}
async function jn(e) {
  const n = [...e.querySelectorAll("[data-holosuite-app]")].map((t) => t.dataset.holosuiteApp ?? "").filter(Boolean);
  await game.settings.set(u, qe, n);
}
const Un = 12;
function zn(e, n, t, o) {
  if (e.length === 0) return 0;
  const i = (m) => Math.hypot(
    n - (m.left + m.width / 2),
    t - (m.top + m.height / 2)
  ), r = Math.min(Math.max(o, 0), e.length - 1), s = i(e[r]);
  let a = r, l = s;
  return e.forEach((m, p) => {
    const h = i(m);
    h < l && (a = p, l = h);
  }), a !== r && l + Un >= s ? r : a;
}
function Yn(e, n, t, o) {
  const r = [...e.querySelectorAll("[data-holosuite-app]")].filter((s) => s !== n)[o] ?? null;
  r ? t.nextElementSibling !== r && e.insertBefore(t, r) : t.nextElementSibling && e.append(t);
}
function Xn(e) {
  var t;
  const n = e.querySelector(".holosuite-app-grid");
  n && (De(e, _), (t = e.querySelector("[data-holosuite-action='reorder-done']")) == null || t.addEventListener("click", (o) => {
    o.preventDefault(), o.stopPropagation(), De(e, !1);
  }), n.querySelectorAll("[data-holosuite-app]").forEach((o) => {
    let i = null, r = null, s = !1, a = 0, l = 0, m = 0, p = 0, h = null, b = [], f = 0;
    const w = (g) => {
      const E = o.getBoundingClientRect(), R = [...n.querySelectorAll("[data-holosuite-app]")];
      b = R.map((re) => re.getBoundingClientRect()), f = Math.max(0, R.indexOf(o)), De(e, !0), s = !0, Fe = Date.now() + 700, m = a - E.left, p = l - E.top, h = document.createElement("div"), h.className = "holosuite-app-placeholder", h.style.height = `${E.height}px`, h.setAttribute("aria-hidden", "true"), o.before(h), o.style.height = `${E.height}px`, o.style.left = `${E.left}px`, o.style.top = `${E.top}px`, o.style.width = `${E.width}px`, o.classList.add("is-being-reordered");
      try {
        o.setPointerCapture(g);
      } catch {
      }
    };
    o.addEventListener("pointerdown", (g) => {
      !g.isPrimary || g.button !== 0 || (r = g.pointerId, a = g.clientX, l = g.clientY, _ ? (g.preventDefault(), w(g.pointerId)) : i = window.setTimeout(() => w(g.pointerId), 550));
    }), o.addEventListener("pointermove", (g) => {
      if (g.pointerId !== r) return;
      if (!s) {
        Math.hypot(g.clientX - a, g.clientY - l) > 8 && i !== null && (window.clearTimeout(i), i = null);
        return;
      }
      g.preventDefault(), o.style.left = `${g.clientX - m}px`, o.style.top = `${g.clientY - p}px`;
      const E = n.getBoundingClientRect();
      if (h && g.clientX >= E.left && g.clientX <= E.right && g.clientY >= E.top && g.clientY <= E.bottom) {
        const R = zn(
          b,
          g.clientX,
          g.clientY,
          f
        );
        R !== f && (Yn(n, o, h, R), f = R);
      }
    });
    const L = (g) => {
      g.pointerId === r && (i !== null && window.clearTimeout(i), i = null, r = null, s && (g.preventDefault(), s = !1, b = [], h == null || h.replaceWith(o), h = null, o.classList.remove("is-being-reordered"), o.style.removeProperty("height"), o.style.removeProperty("left"), o.style.removeProperty("top"), o.style.removeProperty("width"), Fe = Date.now() + 450, jn(n)));
    };
    o.addEventListener("pointerup", L), o.addEventListener("pointercancel", L), o.addEventListener("contextmenu", (g) => {
      _ && g.preventDefault();
    });
  }));
}
let F = null;
function ft(e, n, t, o) {
  var h, b;
  const i = C.get(e);
  if (!i || !me(i) || !((h = i.contextActions) != null && h.length)) return;
  F == null || F();
  const r = document.createElement("div");
  r.className = "holosuite-app-context-menu", r.setAttribute("role", "menu");
  const s = Xe(i);
  r.setAttribute("aria-label", s), Object.assign(r.style, { position: "fixed", zIndex: "100000", background: "#091923", border: "1px solid #58c8d5", borderRadius: "5px", padding: "5px", minWidth: "200px", boxShadow: "0 8px 30px #0009" });
  const a = new AbortController(), l = () => {
    a.abort(), r.remove(), F = null;
  };
  F = l;
  const m = [{ label: `Open ${s}`, callback: () => qt(e) }, ...i.contextActions];
  for (const f of m) {
    const w = document.createElement("button");
    w.type = "button", w.setAttribute("role", "menuitem"), w.textContent = f.label, Object.assign(w.style, { display: "block", width: "100%", textAlign: "left", color: "#d8faff", background: "#102c38", border: "1px solid #315967", padding: "8px 12px", margin: "3px 0" }), w.addEventListener("click", async () => {
      var L, g;
      if (l(), n.focus(), !!me(i))
        try {
          await f.callback();
        } catch (E) {
          console.error(`${u} | App action failed`, E), (g = (L = ui.notifications) == null ? void 0 : L.error) == null || g.call(L, `Could not complete ${f.label}.`);
        }
    }), r.appendChild(w);
  }
  document.body.appendChild(r);
  const p = r.getBoundingClientRect();
  r.style.left = `${Math.max(4, Math.min(t, window.innerWidth - p.width - 4))}px`, r.style.top = `${Math.max(4, Math.min(o, window.innerHeight - p.height - 4))}px`, (b = r.querySelector("button")) == null || b.focus(), document.addEventListener("pointerdown", (f) => {
    r.contains(f.target) || l();
  }, { capture: !0, signal: a.signal }), document.addEventListener("keydown", (f) => {
    var w;
    if (f.key === "Escape")
      f.preventDefault(), f.stopPropagation(), l(), n.focus();
    else if (f.key === "Tab") l();
    else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(f.key)) {
      f.preventDefault(), f.stopPropagation();
      const L = Array.from(r.querySelectorAll("button")), g = L.indexOf(document.activeElement), E = f.key === "Home" ? 0 : f.key === "End" ? L.length - 1 : (g + (f.key === "ArrowDown" ? 1 : -1) + L.length) % L.length;
      (w = L[E]) == null || w.focus();
    }
  }, { capture: !0, signal: a.signal });
}
function Ne(e) {
  var n;
  e && (ge(e), F == null || F(), e.querySelectorAll("[data-holosuite-app]").forEach((t) => {
    var i, r;
    const o = t.dataset.holosuiteApp ?? "";
    (r = (i = C.get(o)) == null ? void 0 : i.contextActions) != null && r.length && (t.setAttribute("aria-haspopup", "menu"), t.title = `${Xe(C.get(o))} — Right-click for options`, t.addEventListener("contextmenu", (s) => {
      if (_) return;
      s.preventDefault(), s.stopPropagation();
      const a = t.getBoundingClientRect();
      ft(o, t, s.clientX || a.left, s.clientY || a.bottom);
    }), t.addEventListener("keydown", (s) => {
      if (s.key !== "ContextMenu" && !(s.shiftKey && s.key === "F10") || _) return;
      s.preventDefault(), s.stopPropagation();
      const a = t.getBoundingClientRect();
      ft(o, t, a.left, a.bottom);
    })), t.addEventListener("click", (s) => {
      if (_ || Date.now() < Fe) {
        s.preventDefault(), s.stopPropagation();
        return;
      }
      qt(s.currentTarget.dataset.holosuiteApp ?? "");
    });
  }), e.querySelectorAll("[data-holosuite-action='whats-new']").forEach((t) => {
    t.addEventListener("click", (o) => {
      o.preventDefault(), o.stopPropagation(), c == null || c.showWhatsNew();
    });
  }), e.querySelectorAll("[data-holosuite-action='apps']").forEach((t) => {
    t.addEventListener("click", (o) => {
      o.preventDefault(), o.stopPropagation(), c == null || c.showApps();
    });
  }), e.querySelectorAll("[data-holosuite-action='settings']").forEach((t) => {
    t.addEventListener("click", (o) => {
      o.preventDefault(), o.stopPropagation(), c == null || c.showSettings();
    });
  }), (n = e.querySelector("[data-holosuite-action='branding']")) == null || n.addEventListener("click", () => Qt()), e.querySelectorAll("[data-holosuite-device-style]").forEach((t) => {
    t.addEventListener("click", (o) => {
      const i = o.currentTarget.dataset.holosuiteDeviceStyle;
      c == null || c.setDeviceStyle(ze(i));
    });
  }), e.querySelectorAll("[data-holosuite-form-factor-choice]").forEach((t) => {
    t.addEventListener("click", (o) => {
      const i = o.currentTarget.dataset.holosuiteFormFactorChoice;
      c == null || c.setFormFactor(Ye(i));
    });
  }), e.querySelectorAll("[data-holosuite-filter]").forEach((t) => {
    t.addEventListener("click", (o) => {
      const i = o.currentTarget.dataset.holosuiteFilter;
      c == null || c.setWhatsNewFilter(Jn(i));
    });
  }), e.querySelectorAll("[data-holosuite-whats-new-tab]").forEach((t) => {
    t.addEventListener("click", (o) => {
      const i = o.currentTarget.dataset.holosuiteWhatsNewTab;
      c == null || c.setWhatsNewTab(Kn(i));
    });
  }), e.querySelectorAll("[data-holosuite-action='close']").forEach((t) => {
    t.addEventListener("pointerdown", gt, { capture: !0 }), t.addEventListener("click", gt, { capture: !0 });
  }), Xn(e));
}
function Jn(e) {
  const n = String(e ?? "");
  return n === "free" || n === "premium" || n === "installed" ? n : "all";
}
function Kn(e) {
  return String(e ?? "") === "releases" ? "releases" : "updates";
}
function gt(e) {
  var n;
  e.preventDefault(), e.stopPropagation(), (n = e.stopImmediatePropagation) == null || n.call(e), Ce();
}
async function Ce() {
  var o, i;
  if (F == null || F(), le) return;
  le = !0;
  const e = c, n = e ? D(e.element) : document.querySelector("#holosuite-launcher"), t = ((o = n == null ? void 0 : n.closest) == null ? void 0 : o.call(n, "#holosuite-launcher, .holosuite-launcher-window")) ?? n;
  c = null, W = null;
  try {
    await ((i = e == null ? void 0 : e.close) == null ? void 0 : i.call(e, { force: !0 }));
  } catch (r) {
    console.warn(`${u} | Foundry did not close the launcher cleanly; removing stale launcher element.`, r);
  } finally {
    le = !1;
  }
  window.setTimeout(() => {
    t != null && t.isConnected && t.remove(), c || It();
  }, 0);
}
function Zn() {
  var t;
  const e = game.modules;
  return P((e == null ? void 0 : e.contents) ?? Array.from(((t = e == null ? void 0 : e.values) == null ? void 0 : t.call(e)) ?? [])).filter((o) => (o == null ? void 0 : o.active) === !0).map((o) => ({
    id: String(o.id ?? ""),
    title: String(o.title ?? o.id ?? ""),
    version: String(o.version ?? "")
  })).sort((o, i) => o.id.localeCompare(i.id));
}
function Qn() {
  const e = Array.from(
    document.querySelectorAll(`link[${ne}]`)
  );
  return He.map((n) => {
    const t = e.find((o) => o.getAttribute(ne) === n) ?? null;
    return {
      path: n,
      present: t !== null,
      loaded: (t == null ? void 0 : t.sheet) != null,
      href: (t == null ? void 0 : t.href) ?? null
    };
  });
}
function eo() {
  var t;
  const e = game.messages, n = Number((e == null ? void 0 : e.size) ?? ((t = e == null ? void 0 : e.contents) == null ? void 0 : t.length) ?? 0);
  return Number.isFinite(n) ? n : 0;
}
function Je() {
  var a, l, m;
  const e = v(u, we) === !0, n = A(), t = v(u, ye) === !0, o = Qn(), i = Zn(), r = game.release, s = game.system;
  return {
    schemaVersion: 1,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    core: {
      version: String(((a = game.modules.get(u)) == null ? void 0 : a.version) ?? ""),
      diagnosticModeActive: n || e || t,
      apiOnly: n,
      cssDisabled: e,
      visualEffectsDisabled: t,
      stylesheets: o,
      launcherOpen: xe(c) || Ue(),
      registeredApps: [...C.values()].map((p) => ({
        id: p.id,
        title: p.title,
        premium: p.premium === !0,
        playerVisible: p.playerVisible !== !1
      })),
      registeredWhatsNewModules: [...V.keys()].sort(),
      deviceStyle: {
        effective: Ot(),
        client: $e(),
        forced: Ee()
      },
      formFactor: ie(),
      appOrder: Mt(),
      colorTheme: Ft(v(u, Ge))
    },
    foundry: {
      version: String((r == null ? void 0 : r.version) ?? game.version ?? ""),
      generation: Number((r == null ? void 0 : r.generation) ?? 0) || null,
      build: Number((r == null ? void 0 : r.build) ?? 0) || null,
      systemId: String((s == null ? void 0 : s.id) ?? ""),
      systemVersion: String((s == null ? void 0 : s.version) ?? ""),
      worldId: String(((l = game.world) == null ? void 0 : l.id) ?? ""),
      isGM: ((m = game.user) == null ? void 0 : m.isGM) === !0
    },
    workload: {
      chatMessages: eo(),
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
    activeModules: i
  };
}
function Kt() {
  return JSON.stringify(Je(), null, 2);
}
async function to() {
  var n, t, o, i, r, s;
  const e = Kt();
  try {
    if ((n = navigator.clipboard) != null && n.writeText)
      await navigator.clipboard.writeText(e);
    else if ((t = game.clipboard) != null && t.copyPlainText)
      await game.clipboard.copyPlainText(e);
    else
      throw new Error("No clipboard API is available.");
    (i = (o = ui.notifications) == null ? void 0 : o.info) == null || i.call(o, "HoloSuite Core diagnostics copied to the clipboard.");
  } catch (a) {
    console.warn(`${u} | Could not copy diagnostics.`, a), (s = (r = ui.notifications) == null ? void 0 : r.error) == null || s.call(r, "Could not copy diagnostics. Use Download JSON instead.");
  }
}
function no() {
  const e = new Blob([Kt()], { type: "application/json" }), n = URL.createObjectURL(e), t = document.createElement("a"), o = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  t.href = n, t.download = `holosuite-core-diagnostics-${o}.json`, t.click(), window.setTimeout(() => URL.revokeObjectURL(n), 0);
}
function mt() {
  const e = Je(), n = e.core, t = [
    n.apiOnly ? "API-only" : null,
    n.cssDisabled ? "CSS disabled" : null,
    n.visualEffectsDisabled ? "visual effects disabled" : null
  ].filter(Boolean), o = t.length > 0 ? t.join(", ") : "Normal";
  return `
    <form class="standard-form holosuite-core-diagnostics">
      <p>This report stays on this browser until you copy or download it. It includes module versions and browser/workload counts, but no actor, chat-message, or campaign content.</p>
      <fieldset>
        <legend>Current test state</legend>
        <div class="form-group"><label>Diagnostic mode</label><div class="form-fields"><strong>${d(o)}</strong></div></div>
        <div class="form-group"><label>Core version</label><div class="form-fields"><code>${d(n.version)}</code></div></div>
        <div class="form-group"><label>Core styles loaded</label><div class="form-fields"><strong>${n.stylesheets.filter((i) => i.present).length}/${n.stylesheets.length}</strong></div></div>
        <div class="form-group"><label>Launcher</label><div class="form-fields"><strong>${n.launcherOpen ? "Open" : "Closed"}</strong></div></div>
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
function pt(e, n) {
  var t, o, i;
  e && ((t = e.querySelector("[data-action='refresh']")) == null || t.addEventListener("click", () => n.render(!1)), (o = e.querySelector("[data-action='copy']")) == null || o.addEventListener("click", () => void to()), (i = e.querySelector("[data-action='download']")) == null || i.addEventListener("click", no));
}
class Zt extends Se {
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
    return $(mt());
  }
  activateListeners(n) {
    super.activateListeners(n), pt(D(n), this);
  }
  async _renderHTML() {
    const n = document.createElement("template");
    return n.innerHTML = mt().trim(), n.content;
  }
  _replaceHTML(n, t) {
    const o = D(t), i = (o == null ? void 0 : o.querySelector(".window-content")) ?? o;
    if (!i) return;
    const r = n instanceof DocumentFragment || n instanceof HTMLElement ? n : D(n);
    r ? i.replaceChildren(r) : i.innerHTML = String(n ?? ""), pt(i, this);
  }
  async _updateObject() {
  }
}
M(Zt, "DEFAULT_OPTIONS", {
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
function Qt(e) {
  var n, t, o, i;
  return (n = game.user) != null && n.isGM ? (ke ?? (ke = new Ke()), typeof e == "string" && ke.selectTarget(e), ke.render(Se === ((i = (o = (t = globalThis.foundry) == null ? void 0 : t.applications) == null ? void 0 : o.api) == null ? void 0 : i.ApplicationV2) ? { force: !0 } : !0)) : null;
}
class Ke extends Se {
  constructor() {
    super(...arguments);
    M(this, "selected", N);
    M(this, "drafts", /* @__PURE__ */ new Map());
    M(this, "saving", !1);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-branding",
      title: "HoloSuite Branding",
      classes: ["holosuite-branding-window"],
      width: 660,
      height: "auto",
      resizable: !0,
      closeOnSubmit: !1
    });
  }
  selectTarget(t) {
    this.selected = t;
  }
  renderEditor() {
    const t = gn();
    return `<section class="holosuite-branding-editor">
      <p>Choose a device or app. Blank fields use its defaults. Changes apply to this world.</p>
      <label>Branding for <select data-branding-select>
        <option value="${N}">HoloSuite device</option>
        <optgroup label="Apps">${t.map((o) => `<option value="${d(o.id)}">${d(o.title)}</option>`).join("")}</optgroup>
      </select></label>
      ${C.size ? '<details class="holosuite-branding-apps"><summary>Browse app tiles</summary><div class="holosuite-branding-grid" data-branding-grid></div></details>' : ""}
      <div data-branding-fields></div>
    </section>`;
  }
  bind(t) {
    var s;
    const o = t != null && t.matches(".holosuite-branding-editor") ? t : t == null ? void 0 : t.querySelector(".holosuite-branding-editor");
    if (!o || !((s = game.user) != null && s.isGM)) return;
    const i = o.querySelector("[data-branding-select]"), r = o.querySelector("[data-branding-fields]");
    !C.has(this.selected) && !he.has(this.selected) && (this.selected = N), i.value = this.selected, i.addEventListener("change", () => {
      this.selected = i.value, this.renderFields(r), this.renderGrid(o);
    }), this.renderFields(r), this.renderGrid(o);
  }
  renderGrid(t) {
    const o = t.querySelector("[data-branding-grid]");
    if (!o) return;
    const i = t.querySelector("[data-branding-select]"), r = [...C.values()].sort((s, a) => s.title.localeCompare(a.title));
    o.innerHTML = r.map((s) => `<button type="button" class="holosuite-app-tile" data-holosuite-app="${d(s.id)}"
      aria-pressed="${s.id === this.selected}">${Ut(s, T(s.id), !1)}</button>`).join(""), o.querySelectorAll("[data-holosuite-app]").forEach((s) => {
      s.addEventListener("click", () => {
        var a;
        i.value = s.dataset.holosuiteApp, i.dispatchEvent(new Event("change")), (a = t.querySelector('[name="name"]')) == null || a.focus();
      });
    }), ge(o);
  }
  renderFields(t) {
    var re, Ze, Qe, et, tt;
    const o = this.selected, i = C.get(o) ?? he.get(o), r = C.has(o), s = (i == null ? void 0 : i.brandingInApp) === !0, a = this.drafts.get(o) ?? T(o), l = (S, y, k = "", I = 100, x = a[S], H = "") => `<label>${d(y)}${H ? `<small>${d(H)}</small>` : ""}<input name="${d(S)}" maxlength="${I}" value="${d(x)}" placeholder="${d(k)}"></label>`, m = (S, y) => `
      <fieldset class="holosuite-branding-asset" ${S === "iconImage" ? "data-custom-icon-image" : ""}>${l(S, y, "PNG or WebP", 2048)}
        <button type="button" data-branding-pick="${S}" aria-label="Browse or upload ${d(y)}"><i class="fa-solid fa-folder-open" aria-hidden="true"></i> Browse / Upload</button>
      </fieldset>`, p = this.drafts.has(o) ? a.icon : a.iconImage ? "custom" : a.icon, h = (S, y, k = a[S]) => `<label>${y}<select name="${S}"><option value="">Use default</option>${Object.entries(bt).map(([I, x]) => `<option value="${I}" ${k === I ? "selected" : ""}>${x}</option>`).join("")}
        ${S === "icon" ? `<option value="custom" ${k === "custom" ? "selected" : ""}>Custom image</option>` : ""}</select></label>`, b = Object.entries(((re = i == null ? void 0 : i.brandingHeader) == null ? void 0 : re.textFields) ?? {});
    t.innerHTML = `<form class="holosuite-branding-form">
      ${l("name", i ? "Display name" : "Device name", (i == null ? void 0 : i.title) || "HoloSuite")}
      ${r && i ? l(
      "label",
      "Launcher tile label (optional)",
      At(i.title),
      48,
      a.label,
      "Only shown on the HoloSuite launcher tile. Leave blank to use the display name."
    ) : ""}
      ${h("icon", i ? "App icon" : "Launcher icon", p ?? "")}
      ${m("iconImage", s ? "App icon image" : i ? "Tile icon image" : "Launcher icon image")}
      ${!i || (Ze = i.brandingHeader) != null && Ze.taglineLabel || b.length ? `<details><summary>Advanced branding</summary>
        ${!i || (Qe = i.brandingHeader) != null && Qe.taglineLabel ? m("logo", i ? "Header logo" : "Device logo") : ""}
        ${b.map(([S, y]) => {
      var H;
      const { label: k, hint: I, placeholder: x } = typeof y == "string" ? { label: y } : y;
      return l(`text.${S}`, k, x, 160, (H = a.text) == null ? void 0 : H[S], I);
    }).join("")}
        ${i ? `${(et = i.brandingHeader) != null && et.taglineLabel ? l("tagline", i.brandingHeader.taglineLabel, "", 160) : ""}` : `
          ${l("gmTitle", "GM window title", "HoloSuite Command Deck")}
          ${l("gmHeading", "GM home header", "GM Command Deck", 60)}
          ${l("gmScreen", "GM home title", "Apps", 48)}
          ${l("playerTitle", "Player window title", "HoloSuite Player View")}
          ${l("playerHeading", "Player home header", "Player Link", 60)}
          ${l("playerScreen", "Player home title", "Commlink", 48)}
          ${l("userLabel", "Player name label", "Active User", 48)}
          ${l("linkStatus", "Player connection label", "LINK STABLE", 48)}
          ${h("backIcon", "Back to apps icon")}${h("settingsIcon", "Settings icon")}
          ${h("updatesIcon", "What’s New icon")}${h("closeIcon", "Close icon")}`}
      </details>` : ""}
      <footer><button type="button" data-branding-reset>Reset fields</button><button type="submit"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Save branding</button></footer>
    </form>`;
    const f = t.querySelector("form"), w = f.elements.namedItem("icon"), L = f.querySelector("[data-custom-icon-image]"), g = f.elements.namedItem("iconImage"), E = (S = !1) => {
      const y = Object.fromEntries(new FormData(f));
      (S || w.value === "custom") && (y.iconImage = g.value);
      const k = Object.fromEntries(b.map(([I]) => [I, y[`text.${I}`]]));
      return { ...y, text: k };
    }, R = () => {
      L.disabled = w.value !== "custom", this.drafts.set(o, E(!0));
    };
    f.addEventListener("input", R), (tt = f.querySelector("[data-branding-reset]")) == null || tt.addEventListener("click", () => {
      this.drafts.set(o, {}), this.renderFields(t);
    }), f.querySelectorAll("[data-branding-pick]").forEach((S) => {
      S.addEventListener("click", () => {
        var I, x, H, j, K, U, Z, B, Q;
        const y = f.elements.namedItem(S.dataset.brandingPick), k = ((j = (H = (x = (I = globalThis.foundry) == null ? void 0 : I.applications) == null ? void 0 : x.apps) == null ? void 0 : H.FilePicker) == null ? void 0 : j.implementation) ?? ((Z = (U = (K = globalThis.foundry) == null ? void 0 : K.applications) == null ? void 0 : U.apps) == null ? void 0 : Z.FilePicker) ?? globalThis.FilePicker;
        if (!k) return (Q = (B = ui.notifications) == null ? void 0 : B.warn) == null ? void 0 : Q.call(B, "Foundry’s file picker is unavailable.");
        new k({ type: "image", current: y.value, callback: (O) => {
          var se, nt;
          if (!ce(O)) return (nt = (se = ui.notifications) == null ? void 0 : se.warn) == null ? void 0 : nt.call(se, "Choose a PNG or WebP image.");
          !f.isConnected || y.matches(":disabled") || (y.value = O, R());
        } }).browse();
      });
    }), f.addEventListener("submit", async (S) => {
      var H, j, K, U, Z, B, Q;
      if (S.preventDefault(), S.stopPropagation(), this.saving || !((H = game.user) != null && H.isGM)) return;
      const y = E();
      if ([y.iconImage, y.logo].some((O) => typeof O == "string" && O.trim() && !ce(O))) {
        (K = (j = ui.notifications) == null ? void 0 : j.warn) == null || K.call(j, "Use a valid PNG or WebP image for branding.");
        return;
      }
      const k = { ...v(u, z) }, I = ue(y), x = this.drafts.get(o);
      Object.keys(I).length ? Object.defineProperty(k, o, { value: I, enumerable: !0, configurable: !0 }) : delete k[o], this.saving = !0;
      try {
        await game.settings.set(u, z, k), this.drafts.get(o) === x && this.drafts.delete(o);
        const O = t.closest(".holosuite-branding-editor");
        O && this.renderGrid(O), (Z = (U = ui.notifications) == null ? void 0 : U.info) == null || Z.call(U, "HoloSuite branding saved.");
      } catch (O) {
        console.error(`${u} | Branding could not be saved.`, O), (Q = (B = ui.notifications) == null ? void 0 : B.error) == null || Q.call(B, "HoloSuite branding could not be saved. Try again.");
      } finally {
        this.saving = !1;
      }
    }), L.disabled = w.value !== "custom";
  }
  async _renderInner() {
    return $(this.renderEditor());
  }
  activateListeners(t) {
    this.bind(D(t));
  }
  async _renderHTML() {
    const t = document.createElement("template");
    return t.innerHTML = this.renderEditor(), t.content;
  }
  _replaceHTML(t, o) {
    const i = D(o);
    i && (i.replaceChildren(t), this.bind(i));
  }
  async _updateObject() {
  }
}
M(Ke, "DEFAULT_OPTIONS", {
  id: "holosuite-branding",
  tag: "section",
  classes: ["holosuite-branding-window"],
  window: { title: "HoloSuite Branding", resizable: !0 },
  position: { width: 660, height: "auto" }
});
class pe extends Se {
  constructor() {
    super(...arguments);
    M(this, "currentView", "apps");
    M(this, "whatsNewFilter", "all");
    M(this, "whatsNewTab", "releases");
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
  get title() {
    var i;
    const t = T(N);
    return (((i = game.user) == null ? void 0 : i.isGM) === !0 ? t.gmTitle : t.playerTitle) || t.name || super.title;
  }
  render(...t) {
    var o, i;
    return A() ? ((i = (o = ui.notifications) == null ? void 0 : o.warn) == null || i.call(o, "HoloSuite Core is in API-only diagnostic mode on this browser."), this) : super.render(...t);
  }
  async _renderInner() {
    return $(ht(this.currentView, this.whatsNewFilter, this.whatsNewTab));
  }
  activateListeners(t) {
    super.activateListeners(t), Ne(D(t)), this.resizeForFormFactor();
  }
  async _renderHTML() {
    const t = document.createElement("template");
    return t.innerHTML = ht(this.currentView, this.whatsNewFilter, this.whatsNewTab).trim(), t.content;
  }
  _replaceHTML(t, o) {
    const i = this.getRenderTarget(o);
    if (!i) return;
    const r = t instanceof DocumentFragment || t instanceof HTMLElement ? t : D(t);
    r ? i.replaceChildren(r) : i.innerHTML = String(t ?? ""), Ne(i), this.resizeForFormFactor();
  }
  async close(t = {}) {
    return _ = !1, c = null, super.close(t);
  }
  getLauncherRoot(t = {}) {
    var r;
    const o = D(this.element), i = (o == null ? void 0 : o.querySelector(".holosuite-phone")) ?? ((r = o == null ? void 0 : o.closest) == null ? void 0 : r.call(o, ".holosuite-phone")) ?? null;
    return i != null && i.isConnected ? i : t.includeDocumentFallback === !1 ? null : document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone");
  }
  getRenderTarget(t) {
    const o = D(t);
    return o ? o.querySelector(".window-content") ?? o.querySelector(".holosuite-launcher-window .window-content") ?? o : null;
  }
  updateRenderedView() {
    var h, b;
    const t = this.getLauncherRoot();
    if (!t) return !1;
    const o = t.querySelector(".holosuite-status-bar"), i = t.querySelector(".holosuite-screen");
    if (!o || !i) return !1;
    const r = document.activeElement, s = r instanceof HTMLElement && i.contains(r) ? r : null, a = s == null ? void 0 : s.dataset.holosuiteDeviceStyle, l = s == null ? void 0 : s.dataset.holosuiteFormFactorChoice;
    o.innerHTML = `
      ${Jt()}
      ${jt(this.currentView)}
    `;
    const m = t.querySelector("[data-holosuite-action='close']");
    m && (m.innerHTML = G({ icon: T(N).closeIcon }, "fa-solid fa-circle-xmark"));
    const p = (h = t.closest(".holosuite-launcher-window")) == null ? void 0 : h.querySelector(".window-title");
    if (p && (p.textContent = this.title), i.innerHTML = this.currentView === "whats-new" ? Yt(this.whatsNewFilter, this.whatsNewTab) : this.currentView === "settings" ? Xt() : zt(), i.classList.toggle("holosuite-screen--whats-new", this.currentView === "whats-new"), i.classList.toggle("holosuite-screen--settings", this.currentView === "settings"), Ne(t), a || l) {
      const f = a ? "[data-holosuite-device-style]" : "[data-holosuite-form-factor-choice]";
      (b = [...i.querySelectorAll(f)].find(
        (w) => a ? w.dataset.holosuiteDeviceStyle === a : w.dataset.holosuiteFormFactorChoice === l
      )) == null || b.focus({ preventScroll: !0 });
    }
    return !0;
  }
  showApps() {
    this.currentView = "apps", this.updateRenderedView() || this.render(!1);
  }
  showWhatsNew() {
    _ = !1, this.currentView = "whats-new", vn(), this.updateRenderedView() || this.render(!1);
  }
  showSettings() {
    _ = !1, this.currentView = "settings", this.updateRenderedView() || this.render(!1);
  }
  async setDeviceStyle(t) {
    Ee() || t === $e() || await game.settings.set(u, Be, t);
  }
  async setFormFactor(t) {
    t !== ie() && await game.settings.set(u, We, t);
  }
  applyAppColors() {
    const t = this.getLauncherRoot({ includeDocumentFallback: !1 });
    t && (t.dataset.holosuiteAppColors = xt());
  }
  resizeForFormFactor() {
    var m, p;
    const t = (m = this.getLauncherRoot({ includeDocumentFallback: !1 })) == null ? void 0 : m.closest("#holosuite-launcher, .holosuite-launcher-window");
    if (!t) return;
    const o = On(), { left: i, top: r, width: s, height: a } = t.getBoundingClientRect(), l = {
      ...o,
      left: Math.max(16, Math.min(i + (s - o.width) / 2, window.innerWidth - o.width - 16)),
      top: Math.max(16, Math.min(r + (a - o.height) / 2, window.innerHeight - o.height - 16))
    };
    t.style.setProperty("--hs-launcher-width", `${o.width}px`), t.style.setProperty("--hs-launcher-height", `${o.height}px`);
    try {
      (p = this.setPosition) == null || p.call(this, l);
    } catch {
    }
  }
  refreshCurrentView() {
    this.updateRenderedView() || this.render(!1);
  }
  setWhatsNewFilter(t) {
    this.currentView = "whats-new", this.whatsNewFilter = t, this.updateRenderedView() || this.render(!1);
  }
  setWhatsNewTab(t) {
    this.currentView = "whats-new", this.whatsNewTab = t, this.updateRenderedView() || this.render(!1);
  }
  async _updateObject() {
  }
}
M(pe, "DEFAULT_OPTIONS", {
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
const q = {
  registerBrandingTarget(e) {
    const n = dt({ ...e, brandingInApp: !0, open: () => {
    } });
    n && he.set(n.id, n);
  },
  registerApp(e) {
    const n = dt(e);
    return n ? (C.set(n.id, n), A() || c == null || c.render(!1), n) : null;
  },
  unregisterApp(e) {
    const n = C.delete(String(e ?? ""));
    return n && !A() && (c == null || c.render(!1)), n;
  },
  getApps() {
    return [...C.values()];
  },
  getBranding: T,
  hasBrandingMigration(e) {
    const n = v(u, z);
    return (n == null ? void 0 : n[`migration:${e}`]) === !0;
  },
  async migrateBranding(e, n) {
    var r;
    if (!((r = game.user) != null && r.isGM) || this.hasBrandingMigration(e)) return;
    const t = { ...v(u, z) }, o = T(e), i = ue(n);
    t[e] = ue({ ...o, ...i, text: { ...o.text, ...i.text } }), t[`migration:${e}`] = !0, await game.settings.set(u, z, t);
  },
  openBranding: Qt,
  getDiagnostics() {
    return Je();
  },
  registerWhatsNew(e) {
    return Gt(e);
  },
  unregisterWhatsNew(e) {
    const n = V.delete(String(e ?? ""));
    return n && !A() && (c == null || c.render(!1)), n;
  },
  getWhatsNew() {
    return [...V.values()].sort(je);
  },
  async openLauncher() {
    var e, n;
    return A() ? ((n = (e = ui.notifications) == null ? void 0 : e.warn) == null || n.call(e, "HoloSuite Core is in API-only diagnostic mode on this browser."), null) : W || (W = (async () => {
      xe(c) || (c = null), c || (c = new pe());
      try {
        await c.render(!0);
      } catch (t) {
        console.warn(`${u} | Recreating launcher after render failure.`, t), c = new pe(), await c.render(!0);
      }
      return Tn(c), c;
    })().finally(() => {
      W = null;
    }), W);
  },
  async toggleLauncher() {
    return W || (xe(c) ? (await Ce(), null) : (Ue() && It(), Cn(), q.openLauncher()));
  }
};
function en() {
  const e = game.modules.get(u);
  if (game.holosuite = q, globalThis.HoloSuiteCoreApi = q, e)
    try {
      e.api = q;
    } catch (n) {
      console.warn(`${u} | Could not attach API to game.modules; using game.holosuite fallback.`, n);
    }
  Hooks.callAll(`${u}.apiReady`, q);
}
Hooks.once("init", () => {
  Bt(), Dn(), Nt(), Ht(), Hn(), en(), window.addEventListener("resize", () => c == null ? void 0 : c.resizeForFormFactor());
});
Hooks.on("getSceneControlButtons", En);
Hooks.on("renderSceneControls", (e, n) => kn(n));
Hooks.on("renderSidebar", ve);
Hooks.on("renderSidebarTab", ve);
Hooks.on("renderSettingsConfig", In);
for (const e of ["renderApplication", "renderApplicationV1", "renderApplicationV2"])
  Hooks.on(e, (n, t) => {
    const o = D(n.element) ?? D(t);
    o && Re(o, T);
  });
Hooks.on("holosuite-core.renderBranding", (e) => Re(e, T));
Hooks.once("ready", () => {
  fe = !0, en(), Bt(), Pe(), Mn(), _t(), A() ? console.warn(`${u} | API-only diagnostic mode is enabled on this browser.`) : (ve(), Vt()), console.log(`${u} | Ready. API available at game.modules.get("${u}").api`);
});
