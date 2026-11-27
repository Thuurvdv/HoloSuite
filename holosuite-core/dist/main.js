var nn = Object.defineProperty;
var on = (e, t, n) => t in e ? nn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var M = (e, t, n) => on(e, typeof t != "symbol" ? t + "" : t, n);
const Ne = [
  "modules/holosuite-core/styles/holosuite-tokens.css",
  "modules/holosuite-core/styles/holosuite-core.css"
], ne = "data-holosuite-core-stylesheet";
function rn(e, t) {
  const n = String(t ?? "").trim();
  return n ? `${e}?v=${encodeURIComponent(n)}` : e;
}
function sn(e, t = document, n = "") {
  const o = Array.from(
    t.querySelectorAll(`link[${ne}]`)
  );
  if (!e) {
    for (const a of o) a.remove();
    return;
  }
  const i = t.head;
  if (!i) return;
  const r = new Set(Ne), s = /* @__PURE__ */ new Set();
  for (const a of o) {
    const l = a.getAttribute(ne) ?? "";
    if (!r.has(l) || s.has(l)) {
      a.remove();
      continue;
    }
    s.add(l);
  }
  for (const a of Ne) {
    if (s.has(a)) continue;
    const l = t.createElement("link");
    l.rel = "stylesheet", l.href = rn(a, n), l.setAttribute(ne, a), i.append(l);
  }
}
function oe(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function ot(e, t) {
  return oe(e) ? t.includes(String(e.name ?? "")) : !1;
}
function it(e) {
  if (!oe(e) || !("tools" in e)) return !1;
  const t = String(e.name ?? "");
  return !["measure", "templates", "walls", "lighting", "sounds", "notes", "tiles", "drawings"].includes(t);
}
function an(e, t, n) {
  if (Array.isArray(e))
    return e.find((o) => ot(o, t)) ?? (n ? e.find(it) : null) ?? null;
  if (!oe(e)) return null;
  for (const o of t)
    if (oe(e[o])) return e[o];
  return Object.values(e).find((o) => ot(o, t)) ?? (n ? Object.values(e).find(it) : null) ?? null;
}
function ln(e) {
  const t = Object.values(e).map((n) => Number(n == null ? void 0 : n.order)).filter(Number.isFinite);
  return t.length ? Math.max(...t) + 1 : Object.keys(e).length;
}
function rt(e, t, n = ["tokens", "token"], o = {}) {
  const i = an(e, n, o.allowFallback === !0);
  if (!i) return !1;
  const r = i.tools;
  return Array.isArray(r) ? r.some((s) => (s == null ? void 0 : s.name) === t.name) ? !1 : (r.push(t), !0) : !oe(r) || r[t.name] ? !1 : (r[t.name] = { ...t, order: t.order ?? ln(r) }, !0);
}
const z = "branding", _ = "holosuite-core", wt = {
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
}, cn = {
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
function de(e) {
  if (typeof e != "string") return "";
  const t = e.trim();
  if (!t || t.length > 2048 || /[\x00-\x1f<>"'\\]/.test(t) || t.startsWith("//")) return "";
  try {
    const n = new URL(t, "https://world.invalid/");
    return !/^https?:$/.test(n.protocol) || n.username || n.password ? "" : /\.(png|webp)$/i.test(n.pathname) ? t : "";
  } catch {
    return "";
  }
}
function he(e) {
  if (!e || typeof e != "object") return {};
  const t = e, n = {};
  for (const [r, s] of Object.entries(cn)) {
    const a = t[r];
    typeof a == "string" && a.trim() && (n[r] = a.trim().slice(0, s));
  }
  for (const r of ["icon", "backIcon", "settingsIcon", "updatesIcon", "closeIcon"]) {
    const s = t[r];
    typeof s == "string" && Object.hasOwn(wt, s) && (n[r] = s);
  }
  const o = de(t.iconImage), i = de(t.logo);
  if (o && (n.iconImage = o), i && (n.logo = i), t.text && typeof t.text == "object") {
    const r = Object.entries(t.text).slice(0, 20).filter(([s, a]) => /^[a-z][a-zA-Z0-9]{0,39}$/.test(s) && typeof a == "string" && a.trim());
    r.length && (n.text = Object.fromEntries(r.map(([s, a]) => [s, a.trim().slice(0, 160)])));
  }
  return n;
}
const st = "[data-holosuite-branding]", Fe = "data-holosuite-branding-default", at = "data-holosuite-branding-override";
function te(e, t) {
  var o;
  (o = e.querySelector(`:scope > [${at}]`)) == null || o.remove();
  let n = e.querySelector(`:scope > [${Fe}]`);
  if (!t) {
    n && n.replaceWith(...n.childNodes);
    return;
  }
  n || (n = document.createElement("span"), n.setAttribute(Fe, ""), n.style.display = "none", n.append(...e.childNodes), e.append(n)), t.setAttribute(at, ""), e.append(t);
}
function ke(e) {
  if (!e) return;
  const t = document.createElement("span");
  return t.textContent = e, t;
}
function yt({ logo: e, iconImage: t, icon: n }) {
  const o = e || t;
  if (!o && !n) return;
  const i = document.createElement("span");
  if (i.className = "holosuite-module-brand-icon", i.setAttribute("aria-hidden", "true"), o) {
    const r = document.createElement("img");
    r.src = o, r.alt = "";
    const s = () => {
      if (!i.parentElement) return;
      const a = yt({ icon: n });
      a ? i.replaceChildren(...a.childNodes) : te(i.parentElement);
    };
    i.append(r), r.addEventListener("error", s, { once: !0 }), r.complete && !r.naturalWidth && queueMicrotask(s);
  } else {
    const r = document.createElement("i");
    r.className = `fa-solid ${n}`, i.append(r);
  }
  return i;
}
function Be(e, t) {
  var o, i, r;
  const n = [...e.querySelectorAll(st)];
  e instanceof HTMLElement && e.matches(st) && n.unshift(e);
  for (const s of n) {
    const a = t(s.dataset.holosuiteBranding);
    for (const m of s.querySelectorAll("[data-holosuite-brand-name]"))
      te(m, ke(a.name));
    for (const m of s.querySelectorAll("[data-holosuite-brand-text]")) {
      const g = m.dataset.holosuiteBrandText, w = m.hasAttribute("data-holosuite-brand-fallback-name") ? a.name : void 0;
      te(m, ke((g === "tagline" ? a.tagline : (o = a.text) == null ? void 0 : o[g]) || w));
    }
    for (const m of s.querySelectorAll("[data-holosuite-brand-icon]"))
      te(m, yt(a));
    const l = (i = s.closest(".app, .application")) == null ? void 0 : i.querySelector(":scope > .window-header"), f = l == null ? void 0 : l.querySelector(".window-title");
    if (f) {
      const m = ((r = f.querySelector(`:scope > [${Fe}]`)) == null ? void 0 : r.textContent) ?? f.textContent, g = a.name && s.hasAttribute("data-holosuite-brand-title-prefix") && m ? `${a.name} · ${m}` : a.name;
      te(f, ke(g));
    }
  }
}
const u = "holosuite-core", ye = "apiOnlyForDebugging", Se = "disableCoreCssForDebugging", ve = "disableVisualEffectsForDebugging", St = "disableForPlayers", We = "deviceStyle", vt = "forceDeviceStyle", qe = "formFactor", Et = "themedAppColors", Ge = "appOrder", Ve = "theme", je = "whatsNewLastSeen", un = "openLauncher", lt = "data-holosuite-foundry-generation", ct = "data-holosuite-debug-no-effects", dn = `modules/${u}/data/whats-new.json`, hn = Date.UTC(2026, 7, 1), fn = /* @__PURE__ */ new Set([
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
]), le = {
  base: "HoloSuite",
  "space-police": "Space Police",
  "cassette-futurism": "Cassette Futurism",
  waystone: "Waystone"
}, J = {
  base: le.base,
  "space-police": le["space-police"],
  "cassette-futurism": le["cassette-futurism"],
  waystone: le.waystone
}, gn = {
  "": "Allow User Choice",
  ...J
}, fe = {
  phone: "Compact",
  datapad: "Datapad",
  computer: "Computer"
}, $t = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
}, ut = {
  cybercall: { label: "Sending Stone", icon: "fa-solid fa-envelope" },
  "security-camera": { label: "Scrying Mirrors", icon: "fa-solid fa-eye" },
  "security-cameras": { label: "Scrying Mirrors", icon: "fa-solid fa-eye" },
  "bounty-board": { label: "Guild Board", icon: "fa-solid fa-scroll" },
  "galaxy-map": { label: "Astral Atlas", icon: "fa-solid fa-compass" },
  "holosuite-loot": { label: "Loot", icon: "fa-solid fa-box-archive" },
  "holosuite-security-cards": { label: "Wards", icon: "fa-solid fa-key" }
}, L = /* @__PURE__ */ new Map(), ge = /* @__PURE__ */ new Map();
function mn() {
  return [...new Map([...ge, ...L]).values()].sort((e, t) => e.title.localeCompare(t.title));
}
const G = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map();
let c = null, Ie = null, W = null, ue = !1, Ct = 0, me = !1, Tt = null, dt = !1, ee = null, R = !1, xe = 0;
function pn() {
  var n, o, i, r, s, a;
  const e = ((o = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : o.api) ?? ((i = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : i.api) ?? null, t = ((s = (r = globalThis.foundry) == null ? void 0 : r.applications) == null ? void 0 : s.api) ?? ((a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.api) ?? null;
  return globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV2);
}
const Ee = pn();
function Me(e) {
  return e ? !!e.getLauncherRoot({ includeDocumentFallback: !1 }) : !1;
}
function d(e) {
  return String(e ?? "").replace(/[&<>"']/g, (t) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[t]);
}
function ce(e, t, n = `${t}s`) {
  return `${e} ${e === 1 ? t : n}`;
}
function E(e, t) {
  try {
    return game.settings.get(e, t);
  } catch {
    return null;
  }
}
function A() {
  return Tt ?? E(u, ye) === !0;
}
function De(e) {
  var t;
  return ((t = game.modules.get(e)) == null ? void 0 : t.api) ?? null;
}
function bn() {
  var e, t, n;
  return String(((t = (e = game.user) == null ? void 0 : e.character) == null ? void 0 : t.name) ?? ((n = game.user) == null ? void 0 : n.name) ?? "Player");
}
function wn(e) {
  var t, n, o, i, r, s;
  if (e === "cybercall") {
    const a = P(E("cybercall", "contacts")), l = P(E("cybercall", "groupContacts"));
    return ce(a.length + l.length, "link");
  }
  if (e === "bounty-board") {
    const a = P((n = (t = De("bounty-board")) == null ? void 0 : t.getAllBounties) == null ? void 0 : n.call(t, { includeHidden: !1 }));
    return ce(a.length, "contract");
  }
  if (e === "csi-toolkit") {
    const a = Object.values(((i = (o = De("csi-toolkit")) == null ? void 0 : o.getCases) == null ? void 0 : i.call(o)) ?? {}).filter((l) => (l == null ? void 0 : l.visibility) !== "gm");
    return ce(a.length, "case");
  }
  if (e === "galaxy-map") {
    const a = P((s = (r = De("galaxy-map")) == null ? void 0 : r.getMaps) == null ? void 0 : s.call(r)).filter((l) => (l == null ? void 0 : l.visibility) === "players");
    return ce(a.length, "chart");
  }
  return "";
}
function P(e) {
  return Array.isArray(e) ? e : [];
}
function yn(e) {
  const t = String((e == null ? void 0 : e.title) ?? "").trim();
  if (!t) return null;
  const n = P(e == null ? void 0 : e.tags).map((i) => String(i ?? "").trim()).find((i) => /^foundry\b/i.test(i)), o = n ? [n.replace(/-v(?=\d)/i, "–")] : [];
  return {
    title: t,
    summary: String((e == null ? void 0 : e.summary) ?? "").trim(),
    tags: o
  };
}
function Lt(e) {
  const t = String((e == null ? void 0 : e.moduleId) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), o = P(e == null ? void 0 : e.entries).map((r) => yn(r)).filter((r) => !!r);
  if (!t || !n || o.length === 0)
    return console.warn(`${u} | Ignoring invalid what's new registration.`, e), null;
  const i = String((e == null ? void 0 : e.tier) ?? "free").toLowerCase() === "premium" ? "premium" : "free";
  return {
    moduleId: t,
    title: n,
    tier: i,
    version: String((e == null ? void 0 : e.version) ?? "").trim(),
    updated: String((e == null ? void 0 : e.updated) ?? "").trim(),
    icon: String((e == null ? void 0 : e.icon) ?? "").trim(),
    url: String((e == null ? void 0 : e.url) ?? "").trim(),
    entries: o
  };
}
function X(e) {
  const t = Date.parse(String(e.updated ?? ""));
  return Number.isFinite(t) ? t : 0;
}
function Ue(e, t) {
  return X(t) - X(e) || e.title.localeCompare(t.title);
}
function At(e) {
  var t, n;
  return ((n = (t = game.modules) == null ? void 0 : t.has) == null ? void 0 : n.call(t, e)) === !0;
}
function Sn() {
  const e = Number(E(u, je));
  return Number.isFinite(e) ? e : 0;
}
function vn() {
  const e = Sn();
  return [...G.values(), ...Y.values()].filter((t) => X(t) > e).reduce((t, n) => t + n.entries.length, 0);
}
function En() {
  try {
    game.settings.set(u, je, Date.now());
  } catch (e) {
    console.warn(`${u} | Could not update what's new read state.`, e);
  }
}
function ht(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), o = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !t || !n || !o || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${u} | Ignoring invalid app registration.`, e), null) : {
    id: t,
    title: n,
    icon: o,
    brandingHeader: e.brandingHeader,
    brandingInApp: e.brandingInApp === !0,
    premium: e.premium === !0,
    playerVisible: e.playerVisible !== !1,
    description: String(e.description ?? "").trim(),
    featureId: String(e.featureId ?? t).trim() || t,
    open: e.open,
    contextActions: (e.contextActions ?? []).filter((i) => (i == null ? void 0 : i.label) && typeof i.callback == "function")
  };
}
function kt(e) {
  return e.replace(/^HoloSuite\s*:?\s*/i, "").trim() || e;
}
function T(e) {
  const t = E(u, z);
  return !t || typeof t != "object" || !Object.hasOwn(t, e) ? {} : he(t[e]);
}
function It(e, t = T(_)) {
  const n = t.name || "HoloSuite";
  return e ? t.gmTitle || `${n} Command Deck` : t.playerTitle || `${n} Player View`;
}
function U(e, t) {
  const n = `<i class="${d(e.icon ? `fa-solid ${e.icon}` : t)}" aria-hidden="true"></i>`;
  return e.iconImage ? `<img class="holosuite-brand-image" src="${d(e.iconImage)}" alt="">${n}` : n;
}
function pe(e) {
  e.querySelectorAll("img.holosuite-brand-image").forEach((t) => {
    const n = () => {
      t.hidden = !0;
    };
    t.addEventListener("error", n, { once: !0 }), t.complete && !t.naturalWidth && n();
  });
}
function $n(e) {
  var i;
  if (A()) return;
  const t = ((i = game.user) == null ? void 0 : i.isGM) === !0;
  if (!t && Le()) return;
  const n = () => ({
    name: "holosuite-core-launcher",
    title: It(t),
    icon: _n(),
    button: !0,
    visible: !0,
    onClick: Ht,
    onChange: kn
  }), o = rt(e, n(), ["tiles", "tile"]);
  rt(e, n(), ["tokens", "token"], { allowFallback: !o });
}
function Cn() {
  var e;
  return !A() && (((e = game.user) == null ? void 0 : e.isGM) === !0 || !Le());
}
function $e() {
  A() || document.querySelectorAll(".holosuite-sidebar-launcher, .holosuite-floating-launcher").forEach((e) => e.remove());
}
function D(e) {
  var o;
  if (e instanceof HTMLElement) return e;
  if (Array.isArray(e) && e[0] instanceof HTMLElement) return e[0];
  const t = e, n = ((o = t == null ? void 0 : t.get) == null ? void 0 : o.call(t, 0)) ?? (t == null ? void 0 : t[0]);
  return n instanceof HTMLElement ? n : null;
}
function Tn(e) {
  var r;
  const t = new Set(document.querySelectorAll("#holosuite-launcher, .holosuite-launcher-window"));
  if (t.size <= 1) return;
  const n = e ? D(e.element) : null, i = ((r = n == null ? void 0 : n.closest) == null ? void 0 : r.call(n, "#holosuite-launcher, .holosuite-launcher-window")) ?? [...t].at(-1) ?? null;
  for (const s of t)
    s !== i && s.remove();
}
function Dt() {
  document.querySelectorAll("#holosuite-launcher, .holosuite-launcher-window").forEach((e) => {
    e.remove();
  });
}
function ze() {
  return document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone") !== null;
}
function Ln() {
  c = null, W = null, ue = !1;
}
function An(e) {
  const t = e.find((n) => typeof n == "boolean");
  return typeof t == "boolean" ? t : null;
}
function Ht() {
  return Ct = Date.now(), q.toggleLauncher();
}
function kn(...e) {
  const t = An(e);
  return t === !1 ? (Ae(), null) : t === null && Date.now() - Ct < 100 ? null : q.openLauncher();
}
function In(e) {
  var a;
  if (A()) return;
  const t = ((a = game.user) == null ? void 0 : a.isGM) === !0;
  if (!t && Le()) return;
  const n = D(e) ?? document.querySelector("#controls, #scene-controls");
  if (!n) return;
  const o = T(_), i = n.querySelectorAll("[data-tool='holosuite-core-launcher'], [data-action='holosuite-core-launcher']");
  if (i.length) {
    o.iconImage && i.forEach((l) => {
      l.querySelector("img.holosuite-brand-image") || (l.insertAdjacentHTML("afterbegin", `<img class="holosuite-brand-image" src="${d(o.iconImage)}" alt="">`), pe(l));
    });
    return;
  }
  const r = n.querySelector(
    ".control-tools.active, .sub-controls.active, .scene-control-tools.active, .control-tools, .sub-controls, .scene-control-tools"
  );
  if (!r) return;
  const s = document.createElement("li");
  s.className = "control-tool holosuite-scene-control", s.dataset.tool = "holosuite-core-launcher", s.title = It(t, o), s.innerHTML = U(o, Wt()), pe(s), s.addEventListener("click", (l) => {
    l.preventDefault(), l.stopPropagation(), Ht();
  }), r.appendChild(s);
}
function Dn(e, t) {
  var r;
  const n = D(t);
  if (!n) return;
  const i = [
    `input[name="${u}.${ye}"]`,
    `input[name="${u}.${Se}"]`,
    `input[name="${u}.${ve}"]`
  ].map((s) => {
    var a;
    return ((a = n.querySelector(s)) == null ? void 0 : a.closest(".form-group")) ?? null;
  }).filter((s) => s !== null);
  for (const s of i) (r = s.parentElement) == null || r.append(s);
}
function Hn() {
  game.settings.register(u, z, {
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: () => {
      Be(document, T), Hooks.callAll("holosuite-core.brandingChanged"), !(!me || A()) && (c == null || c.refreshCurrentView(), $e(), Pe());
    }
  }), game.settings.registerMenu(u, "brandingEditor", {
    name: "HoloSuite Branding",
    label: "Open HoloSuite Branding",
    hint: "Customize the device and app branding for this world.",
    icon: "fa-solid fa-palette",
    type: Ke,
    restricted: !0
  }), game.settings.register(u, ye, {
    name: "Debugging: API-Only Mode (This Browser)",
    hint: "Diagnostic only. Keeps Core's registration API active while disabling its launcher, scene-control UI, sidebar cleanup, and What's New catalog work on this browser.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => On(e)
  }), game.settings.register(u, Se, {
    name: "Debugging: Disable HoloSuite Core CSS (This Browser)",
    hint: "Diagnostic only. Temporarily removes Core's shared tokens and launcher styles from this browser. HoloSuite interfaces will appear unstyled. Leave this off during normal play.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => Ot(e)
  }), game.settings.register(u, ve, {
    name: "Debugging: Disable Core Visual Effects (This Browser)",
    hint: "Diagnostic only. Keeps Core's layout and colors while disabling launcher transitions, animations, filters, shadows, and glows on this browser.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => Nt(e)
  }), game.settings.register(u, We, {
    name: "HoloSuite Theme",
    hint: "Choose the HoloSuite launcher theme for this user.",
    scope: "client",
    config: !0,
    type: String,
    choices: J,
    default: "base",
    restricted: !1,
    onChange: () => {
      _e(), c == null || c.refreshCurrentView();
    }
  }), game.settings.register(u, vt, {
    name: "Force HoloSuite Theme",
    hint: "When set, every user sees this HoloSuite launcher theme instead of their personal choice.",
    scope: "world",
    config: !0,
    type: String,
    choices: gn,
    default: "",
    restricted: !0,
    onChange: () => {
      _e(), c == null || c.refreshCurrentView();
    }
  }), game.settings.register(u, qe, {
    name: "HoloSuite Size",
    hint: "Choose a compact, wide datapad, or large computer layout for this user.",
    scope: "client",
    config: !0,
    type: String,
    choices: fe,
    default: "phone",
    restricted: !1,
    onChange: () => {
      _t(), c == null || c.refreshCurrentView(), c == null || c.resizeForFormFactor();
    }
  }), game.settings.register(u, Et, {
    name: "Use Themed App Colors",
    hint: "Use the active device theme’s accent for app icons and interaction glow. Uploaded branding images keep their original colors.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: () => c == null ? void 0 : c.applyAppColors()
  }), game.settings.register(u, Ge, {
    name: "HoloSuite App Order",
    hint: "Stores this user's custom launcher order.",
    scope: "client",
    config: !1,
    type: Array,
    default: [],
    restricted: !1
  }), game.settings.register(u, Ve, {
    name: "HoloSuite Color Theme",
    hint: "Changes the shared color theme used by HoloSuite windows.",
    scope: "world",
    config: !0,
    type: String,
    choices: $t,
    default: "default",
    restricted: !0,
    onChange: (e) => Pt(e)
  }), game.settings.register(u, St, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !0
  }), game.settings.register(u, je, {
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
    type: we,
    restricted: !0
  }), game.settings.registerMenu(u, "diagnostics", {
    name: "HoloSuite Core Diagnostics",
    label: "Open Diagnostics",
    hint: "Inspect, copy, or download the current HoloSuite and Foundry test state.",
    icon: "fas fa-stethoscope",
    type: Qt,
    restricted: !0
  });
}
async function Pe() {
  var n;
  const e = ui.controls;
  if (typeof (e == null ? void 0 : e.render) != "function") return;
  const t = Number(((n = game.release) == null ? void 0 : n.generation) ?? 0);
  try {
    t >= 13 ? await e.render({ force: !0, reset: !0 }) : await e.render(!0);
  } catch (o) {
    console.warn(`${u} | Could not rebuild scene controls.`, o);
  }
}
function On(e = E(u, ye)) {
  const t = e === !0;
  if (Tt = t, t) {
    document.querySelectorAll(
      "[data-tool='holosuite-core-launcher'], .holosuite-scene-control, .holosuite-sidebar-launcher, .holosuite-floating-launcher"
    ).forEach((n) => n.remove()), (c || ze()) && Ae(), me && Pe(), console.warn(`${u} | API-only diagnostic mode is enabled on this browser.`);
    return;
  }
  me && (Vt(), Pe());
}
function Ot(e = E(u, Se)) {
  var o;
  const t = e === !0, n = String(((o = game.modules.get(u)) == null ? void 0 : o.version) ?? "");
  sn(!t, document, n), t && console.warn(`${u} | Core CSS is disabled on this browser for debugging.`);
}
function Nt(e = E(u, ve)) {
  const t = e === !0;
  for (const n of [document.documentElement, document.body].filter(Boolean))
    t ? n.setAttribute(ct, "true") : n.removeAttribute(ct);
  t && console.warn(`${u} | Core visual effects are disabled on this browser for debugging.`);
}
function Nn() {
  var e, t;
  (t = (e = game.keybindings) == null ? void 0 : e.register) == null || t.call(e, u, un, {
    name: "Open HoloSuite",
    hint: "Open the HoloSuite launcher and registered app deck.",
    editable: [],
    restricted: !1,
    onDown: () => {
      var n, o, i, r;
      return A() ? ((o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, "HoloSuite Core is in API-only diagnostic mode on this browser."), !1) : Cn() ? (q.toggleLauncher(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "HoloSuite is disabled for players in this world."), !1);
    }
  });
}
function Ye(e) {
  return Object.hasOwn(J, String(e)) ? String(e) : "base";
}
function Ce() {
  const e = String(E(u, vt) ?? "");
  return Object.hasOwn(J, e) ? e : null;
}
function Te() {
  return Ye(E(u, We));
}
function ie() {
  return Ce() ?? Te();
}
function Ft(e) {
  return Object.hasOwn($t, String(e)) ? String(e) : "default";
}
function Xe(e) {
  const t = String(e ?? "");
  return Object.hasOwn(fe, t) ? t : "phone";
}
function re() {
  return Xe(E(u, qe));
}
function Fn(e = re()) {
  const t = e === "computer" ? { width: 980, height: 700 } : e === "datapad" ? { width: 760, height: 680 } : { width: 483, height: 700 };
  return {
    width: Math.min(t.width, Math.max(1, window.innerWidth - 32)),
    height: Math.min(t.height, Math.max(1, window.innerHeight - 32))
  };
}
function xt() {
  return E(u, Et) === !0 ? "theme" : "original";
}
function Mt() {
  return P(E(u, Ge)).map((e) => String(e ?? "").trim()).filter((e, t, n) => !!e && n.indexOf(e) === t);
}
function xn(e) {
  const t = Ye(e);
  document.documentElement.toggleAttribute("data-holosuite-waystone", t === "waystone");
  const n = [document.documentElement, document.body].filter(Boolean);
  for (const o of n)
    t === "base" || t === "waystone" ? o.removeAttribute("data-holosuite-device-style") : o.setAttribute("data-holosuite-device-style", t);
}
function Pt(e) {
  const t = Ft(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const o of n)
    t === "default" ? o.removeAttribute("data-holosuite-theme") : o.setAttribute("data-holosuite-theme", t);
}
function Mn(e) {
  const t = Xe(e);
  for (const n of [document.documentElement, document.body].filter(Boolean))
    n.setAttribute("data-holosuite-form-factor", t);
}
function _e() {
  xn(ie());
}
function Pn() {
  Pt(E(u, Ve));
}
function _t() {
  Mn(re());
}
function Rt() {
  var t, n, o;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((o = game == null ? void 0 : game.release) == null ? void 0 : o.generation));
  return Number.isFinite(e) ? e : null;
}
function Bt() {
  const e = Rt(), t = [document.documentElement, document.body].filter(Boolean);
  for (const n of t)
    e === null ? n.removeAttribute(lt) : n.setAttribute(lt, String(e));
}
function Wt() {
  return Rt() === 12 ? "fa-solid fa-terminal" : "fa-solid fa-mobile-screen-button";
}
function _n() {
  const e = T(_).icon;
  return e ? `fa-solid ${e}` : Wt();
}
function Le() {
  try {
    return game.settings.get(u, St) === !0;
  } catch {
    return !1;
  }
}
function be(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 ? !0 : Le() ? !1 : e.playerVisible !== !1;
}
async function qt(e) {
  var n, o, i, r;
  const t = L.get(e);
  return t ? be(t) ? t.open() : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, `${t.title} is not available from the player view.`), null) : ((o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, `HoloSuite app "${e}" is not registered.`), null);
}
function Gt(e, t = {}) {
  const n = Lt(e);
  if (!n || X(n) < hn) return null;
  const o = G.get(n.moduleId);
  if (o) {
    const i = X(o), r = X(n);
    if (r < i || r === i && t.replace === !1) return o;
  }
  return G.set(n.moduleId, n), A() || c == null || c.render(!1), n;
}
function Rn(e, t = {}) {
  const n = Lt(e);
  return n ? t.replace === !1 && Y.has(n.moduleId) ? Y.get(n.moduleId) ?? null : (Y.set(n.moduleId, n), A() || c == null || c.render(!1), n) : null;
}
async function Vt() {
  if (!(A() || dt))
    return ee || (ee = (async () => {
      try {
        const e = await fetch(dn, { cache: "no-cache" });
        if (!e.ok) throw new Error(`HTTP ${e.status}`);
        const t = await e.json(), n = P(t == null ? void 0 : t.modules);
        for (const i of n)
          Gt(i, { replace: !1 });
        const o = P(t == null ? void 0 : t.releases);
        for (const i of o)
          Rn(i, { replace: !1 });
        dt = !0;
      } catch (e) {
        console.warn(`${u} | Could not load bundled what's new catalog.`, e);
      }
    })().finally(() => {
      ee = null;
    }), ee);
}
function jt(e) {
  const t = T(_), n = vn(), o = n > 0 ? `<span>${d(n)}</span>` : "";
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
      ${U({ icon: t.backIcon }, "fa-solid fa-arrow-left")}
    </button>
  `}
      <button
        type="button"
        class="holosuite-header-action ${e === "settings" ? "is-active" : ""}"
        data-holosuite-action="settings"
        title="Settings"
        aria-label="Settings"
      >
        ${U({ icon: t.settingsIcon }, "fa-solid fa-gear")}
      </button>
      <button
        type="button"
        class="holosuite-header-action ${e === "whats-new" ? "is-active" : ""}"
        data-holosuite-action="whats-new"
        title="What's New"
        aria-label="What's New"
      >
        ${U({ icon: t.updatesIcon }, "fa-solid fa-star")}
        ${o}
      </button>
      <button
        type="button"
        class="holosuite-header-action holosuite-header-close"
        data-holosuite-action="close"
        title="Close"
        aria-label="Close"
      >
        ${U({ icon: t.closeIcon }, "fa-solid fa-xmark")}
      </button>
    </div>
  `;
}
function Re(e, t = T(e.id)) {
  return `
    <span class="holosuite-app-icon ${t.icon ? "holosuite-brand-glyph" : ""}" data-holosuite-app-icon="${d(e.id)}">
      ${U(t, e.icon)}
    </span>
  `;
}
function Ut(e, t = T(e.id), n) {
  const o = kt(e.title);
  return t.label || t.name || n || o;
}
function zt(e, t, n, o = !1) {
  const i = e.description, r = o && Object.hasOwn(ut, e.id) ? ut[e.id] : void 0;
  return `${Re(r ? { ...e, icon: r.icon } : e, t)}
    <span class="holosuite-app-title">${d(Ut(e, t, r == null ? void 0 : r.label))}</span>
    ${n && i ? `<p>${d(i)}</p>` : ""}`;
}
function Yt() {
  var g;
  const e = ((g = game.user) == null ? void 0 : g.isGM) === !0, t = ie() === "waystone", n = Mt(), o = new Map(n.map((w, p) => [w, p])), i = [...L.values()].filter(be).sort((w, p) => {
    const b = o.get(w.id), C = o.get(p.id);
    return b !== void 0 || C !== void 0 ? b === void 0 ? 1 : C === void 0 ? -1 : b - C : w.title.localeCompare(p.title);
  }), r = T(_), s = e ? r.gmHeading || "GM Command Deck" : r.playerHeading || "Player Link", a = (e ? r.gmScreen : r.playerScreen) || (t ? r.name || "Waystone" : e ? "Apps" : "Commlink"), l = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", f = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">${d(r.userLabel || "Active User")}</span>
        <strong>${d(bn())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>${d(r.linkStatus || "LINK STABLE")}</span>
      </div>
    </section>
  `, m = i.map((w) => {
    const p = e ? "" : wn(w.id);
    return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${d(w.id)}">
          ${zt(w, T(w.id), e, t)}
          ${p ? `<span class="holosuite-app-count">${d(p)}</span>` : ""}
          ${t ? '<span class="holosuite-waystone-charge" aria-hidden="true"></span>' : ""}
        </button>
      `;
  }).join("");
  return `
    <div class="holosuite-screen-heading">
      <div>
        ${t && !(e ? r.gmHeading : r.playerHeading) ? "" : `<span class="holosuite-kicker">${d(s)}</span>`}
        <h2>${d(a)}</h2>
      </div>
    </div>
    ${f}
    <div class="holosuite-app-grid">
      ${i.length ? m : `<p class="holosuite-empty">${d(l)}</p>`}
    </div>
    ${i.length > 1 ? `
      <div class="holosuite-reorder-help" aria-live="polite">
        <span class="holosuite-reorder-help-idle"><i class="fa-solid fa-hand-pointer"></i> Press and hold an app to rearrange</span>
        <span class="holosuite-reorder-help-active"><i class="fa-solid fa-arrows-up-down-left-right"></i> Drag apps into place</span>
        <button type="button" data-holosuite-action="reorder-done">Done</button>
      </div>
    ` : ""}
  `;
}
function Bn(e) {
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
function Wn(e) {
  return `
    <nav class="holosuite-whats-new-tabs" aria-label="What's New tabs">
      ${[
    { id: "updates", label: "Updates", count: G.size },
    { id: "releases", label: "Releases", count: Y.size }
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
function qn(e) {
  return [...G.values()].filter((t) => e === "installed" ? At(t.moduleId) : e === "free" || e === "premium" ? t.tier === e : !0).sort(Ue);
}
function Gn(e) {
  return [...Y.values()].filter((t) => e === "installed" ? At(t.moduleId) : e === "free" || e === "premium" ? t.tier === e : !0).sort(Ue);
}
function Vn(e) {
  const t = e.icon || (e.tier === "premium" ? "fa-solid fa-gem" : "fa-solid fa-cube"), n = e.moduleId === "holosuite-buddy" ? "holo-assistant" : e.moduleId, o = L.get(e.moduleId) ?? L.get(n);
  return o ? Re(o) : fn.has(n) ? Re({ id: n, icon: t }) : U({}, t);
}
function jn(e, t) {
  return e.length ? e.map((n) => {
    const o = n.entries.map((r) => {
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
    }).join(""), i = n.url ? `
          <a class="holosuite-whats-new-link" href="${d(n.url)}" target="_blank" rel="noreferrer">
            <span>Find out more</span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        ` : "";
    return `
        <article class="holosuite-whats-new-card">
          <header>
            <span class="holosuite-whats-new-icon">${Vn(n)}</span>
            <div>
              <h3>${d(n.title)}</h3>
            </div>
          </header>
          <ul>${o}</ul>
          ${i}
        </article>
      `;
  }).join("") : `<p class="holosuite-empty">${d(t)}</p>`;
}
function Xt(e, t) {
  const n = qn(e), o = Gn(e), i = t === "releases" ? o : n, r = t === "releases" ? "No releases match this filter yet." : "No updates match this filter yet.";
  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">Release Feed</span>
        <h2>What's New</h2>
      </div>
    </div>
    ${Wn(t)}
    ${Bn(e)}
    <div class="holosuite-whats-new-list">
      ${jn(i, r)}
    </div>
  `;
}
function Jt() {
  var a;
  const e = Ce(), t = Te(), n = e ?? t, o = re(), i = e ? `
    <div class="holosuite-settings-notice">
      <i class="fa-solid fa-lock"></i>
      <span>The GM is overriding the HoloSuite visual theme for this world. Your personal choice is paused until the override is removed.</span>
    </div>
  ` : "", r = Object.entries(J).map(([l, f]) => `
    <button
      type="button"
      class="holosuite-theme-choice ${l === n ? "is-active" : ""}"
      data-holosuite-device-style="${d(l)}"
      ${e ? "disabled" : ""}
      aria-pressed="${l === n ? "true" : "false"}"
    >
      <span class="holosuite-theme-preview holosuite-theme-preview--${d(l)}"></span>
      <strong>${d(f)}</strong>
    </button>
  `).join(""), s = Object.entries(fe).map(([l, f]) => `
    <button
      type="button"
      class="holosuite-form-factor-choice ${l === o ? "is-active" : ""}"
      data-holosuite-form-factor-choice="${d(l)}"
      aria-pressed="${l === o ? "true" : "false"}"
    >
      <span class="holosuite-form-factor-preview holosuite-form-factor-preview--${d(l)}" aria-hidden="true"></span>
      <strong>${d(f)}</strong>
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
          <strong>${d(J[n])}</strong>
        </div>
      </div>
      <div class="holosuite-theme-choices" role="group" aria-label="Theme">
        ${r}
      </div>
      <div class="holosuite-settings-field">
        <div>
          <span class="holosuite-kicker">Size</span>
          <strong>${d(fe[o])}</strong>
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
function Kt(e = T(_)) {
  return `<span>${e.logo ? `<img class="holosuite-brand-image" src="${d(e.logo)}" alt="">` : ""}${d(e.name || "HoloSuite")}</span>`;
}
function Un(e, t) {
  ie() === "waystone" ? (e.dataset.holosuiteLauncherStyle = "waystone", t.tabIndex = 0, t.setAttribute("aria-label", "HoloSuite launcher content")) : e.hasAttribute("data-holosuite-launcher-style") && (delete e.dataset.holosuiteLauncherStyle, t.removeAttribute("tabindex"), t.removeAttribute("aria-label"));
}
function ft(e = "apps", t = "all", n = "releases") {
  const o = ie() === "waystone", i = e === "whats-new" ? "holosuite-screen--whats-new" : e === "settings" ? "holosuite-screen--settings" : "", r = e === "whats-new" ? Xt(t, n) : e === "settings" ? Jt() : Yt();
  return `
    <section class="holosuite-phone" data-holosuite-app-colors="${xt()}"${o ? ' data-holosuite-launcher-style="waystone"' : ""}>
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          ${Kt()}
          ${jt(e)}
        </header>
        <main class="holosuite-screen ${i}"${o ? ' tabindex="0" aria-label="HoloSuite launcher content"' : ""}>
          ${r}
        </main>
        <div class="holosuite-device-bottom-trim" aria-hidden="true"></div>
      </div>
    </section>
  `;
}
function He(e, t) {
  R = t, e.classList.toggle("is-reordering-apps", t);
}
async function zn(e) {
  const t = [...e.querySelectorAll("[data-holosuite-app]")].map((n) => n.dataset.holosuiteApp ?? "").filter(Boolean);
  await game.settings.set(u, Ge, t);
}
const Yn = 12;
function Xn(e, t, n, o) {
  if (e.length === 0) return 0;
  const i = (f) => Math.hypot(
    t - (f.left + f.width / 2),
    n - (f.top + f.height / 2)
  ), r = Math.min(Math.max(o, 0), e.length - 1), s = i(e[r]);
  let a = r, l = s;
  return e.forEach((f, m) => {
    const g = i(f);
    g < l && (a = m, l = g);
  }), a !== r && l + Yn >= s ? r : a;
}
function Jn(e, t, n, o) {
  const r = [...e.querySelectorAll("[data-holosuite-app]")].filter((s) => s !== t)[o] ?? null;
  r ? n.nextElementSibling !== r && e.insertBefore(n, r) : n.nextElementSibling && e.append(n);
}
function Kn(e) {
  var n;
  const t = e.querySelector(".holosuite-app-grid");
  t && (He(e, R), (n = e.querySelector("[data-holosuite-action='reorder-done']")) == null || n.addEventListener("click", (o) => {
    o.preventDefault(), o.stopPropagation(), He(e, !1);
  }), t.querySelectorAll("[data-holosuite-app]").forEach((o) => {
    let i = null, r = null, s = !1, a = 0, l = 0, f = 0, m = 0, g = null, w = [], p = 0;
    const b = (h) => {
      const v = o.getBoundingClientRect(), H = [...t.querySelectorAll("[data-holosuite-app]")];
      w = H.map((se) => se.getBoundingClientRect()), p = Math.max(0, H.indexOf(o)), He(e, !0), s = !0, xe = Date.now() + 700, f = a - v.left, m = l - v.top, g = document.createElement("div"), g.className = "holosuite-app-placeholder", g.style.height = `${v.height}px`, g.setAttribute("aria-hidden", "true"), o.before(g), o.style.height = `${v.height}px`, o.style.left = `${v.left}px`, o.style.top = `${v.top}px`, o.style.width = `${v.width}px`, o.classList.add("is-being-reordered");
      try {
        o.setPointerCapture(h);
      } catch {
      }
    };
    o.addEventListener("pointerdown", (h) => {
      !h.isPrimary || h.button !== 0 || (r = h.pointerId, a = h.clientX, l = h.clientY, R ? (h.preventDefault(), b(h.pointerId)) : i = window.setTimeout(() => b(h.pointerId), 550));
    }), o.addEventListener("pointermove", (h) => {
      if (h.pointerId !== r) return;
      if (!s) {
        Math.hypot(h.clientX - a, h.clientY - l) > 8 && i !== null && (window.clearTimeout(i), i = null);
        return;
      }
      h.preventDefault(), o.style.left = `${h.clientX - f}px`, o.style.top = `${h.clientY - m}px`;
      const v = t.getBoundingClientRect();
      if (g && h.clientX >= v.left && h.clientX <= v.right && h.clientY >= v.top && h.clientY <= v.bottom) {
        const H = Xn(
          w,
          h.clientX,
          h.clientY,
          p
        );
        H !== p && (Jn(t, o, g, H), p = H);
      }
    });
    const C = (h) => {
      h.pointerId === r && (i !== null && window.clearTimeout(i), i = null, r = null, s && (h.preventDefault(), s = !1, w = [], g == null || g.replaceWith(o), g = null, o.classList.remove("is-being-reordered"), o.style.removeProperty("height"), o.style.removeProperty("left"), o.style.removeProperty("top"), o.style.removeProperty("width"), xe = Date.now() + 450, zn(t)));
    };
    o.addEventListener("pointerup", C), o.addEventListener("pointercancel", C), o.addEventListener("contextmenu", (h) => {
      R && h.preventDefault();
    });
  }));
}
let F = null;
function gt(e, t, n, o) {
  var g, w, p;
  const i = L.get(e);
  if (!i || !be(i) || !((g = i.contextActions) != null && g.length)) return;
  F == null || F();
  const r = document.createElement("div");
  r.className = "holosuite-app-context-menu", r.setAttribute("role", "menu");
  const s = ((w = t.querySelector(".holosuite-app-title")) == null ? void 0 : w.textContent) || Ut(i);
  r.setAttribute("aria-label", s), Object.assign(r.style, { position: "fixed", zIndex: "100000", background: "#091923", border: "1px solid #58c8d5", borderRadius: "5px", padding: "5px", minWidth: "200px", boxShadow: "0 8px 30px #0009" });
  const a = new AbortController(), l = () => {
    a.abort(), r.remove(), F = null;
  };
  F = l;
  const f = [{ label: `Open ${s}`, callback: () => qt(e) }, ...i.contextActions];
  for (const b of f) {
    const C = document.createElement("button");
    C.type = "button", C.setAttribute("role", "menuitem"), C.textContent = b.label, Object.assign(C.style, { display: "block", width: "100%", textAlign: "left", color: "#d8faff", background: "#102c38", border: "1px solid #315967", padding: "8px 12px", margin: "3px 0" }), C.addEventListener("click", async () => {
      var h, v;
      if (l(), t.focus(), !!be(i))
        try {
          await b.callback();
        } catch (H) {
          console.error(`${u} | App action failed`, H), (v = (h = ui.notifications) == null ? void 0 : h.error) == null || v.call(h, `Could not complete ${b.label}.`);
        }
    }), r.appendChild(C);
  }
  document.body.appendChild(r);
  const m = r.getBoundingClientRect();
  r.style.left = `${Math.max(4, Math.min(n, window.innerWidth - m.width - 4))}px`, r.style.top = `${Math.max(4, Math.min(o, window.innerHeight - m.height - 4))}px`, (p = r.querySelector("button")) == null || p.focus(), document.addEventListener("pointerdown", (b) => {
    r.contains(b.target) || l();
  }, { capture: !0, signal: a.signal }), document.addEventListener("keydown", (b) => {
    var C;
    if (b.key === "Escape")
      b.preventDefault(), b.stopPropagation(), l(), t.focus();
    else if (b.key === "Tab") l();
    else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(b.key)) {
      b.preventDefault(), b.stopPropagation();
      const h = Array.from(r.querySelectorAll("button")), v = h.indexOf(document.activeElement), H = b.key === "Home" ? 0 : b.key === "End" ? h.length - 1 : (v + (b.key === "ArrowDown" ? 1 : -1) + h.length) % h.length;
      (C = h[H]) == null || C.focus();
    }
  }, { capture: !0, signal: a.signal });
}
function Oe(e) {
  var t;
  e && (pe(e), F == null || F(), e.querySelectorAll("[data-holosuite-app]").forEach((n) => {
    var i, r, s;
    const o = n.dataset.holosuiteApp ?? "";
    (r = (i = L.get(o)) == null ? void 0 : i.contextActions) != null && r.length && (n.setAttribute("aria-haspopup", "menu"), n.title = `${(s = n.querySelector(".holosuite-app-title")) == null ? void 0 : s.textContent} — Right-click for options`, n.addEventListener("contextmenu", (a) => {
      if (R) return;
      a.preventDefault(), a.stopPropagation();
      const l = n.getBoundingClientRect();
      gt(o, n, a.clientX || l.left, a.clientY || l.bottom);
    }), n.addEventListener("keydown", (a) => {
      if (a.key !== "ContextMenu" && !(a.shiftKey && a.key === "F10") || R) return;
      a.preventDefault(), a.stopPropagation();
      const l = n.getBoundingClientRect();
      gt(o, n, l.left, l.bottom);
    })), n.addEventListener("click", (a) => {
      if (R || Date.now() < xe) {
        a.preventDefault(), a.stopPropagation();
        return;
      }
      qt(a.currentTarget.dataset.holosuiteApp ?? "");
    });
  }), e.querySelectorAll("[data-holosuite-action='whats-new']").forEach((n) => {
    n.addEventListener("click", (o) => {
      o.preventDefault(), o.stopPropagation(), c == null || c.showWhatsNew();
    });
  }), e.querySelectorAll("[data-holosuite-action='apps']").forEach((n) => {
    n.addEventListener("click", (o) => {
      o.preventDefault(), o.stopPropagation(), c == null || c.showApps();
    });
  }), e.querySelectorAll("[data-holosuite-action='settings']").forEach((n) => {
    n.addEventListener("click", (o) => {
      o.preventDefault(), o.stopPropagation(), c == null || c.showSettings();
    });
  }), (t = e.querySelector("[data-holosuite-action='branding']")) == null || t.addEventListener("click", () => en()), e.querySelectorAll("[data-holosuite-device-style]").forEach((n) => {
    n.addEventListener("click", (o) => {
      const i = o.currentTarget.dataset.holosuiteDeviceStyle;
      c == null || c.setDeviceStyle(Ye(i));
    });
  }), e.querySelectorAll("[data-holosuite-form-factor-choice]").forEach((n) => {
    n.addEventListener("click", (o) => {
      const i = o.currentTarget.dataset.holosuiteFormFactorChoice;
      c == null || c.setFormFactor(Xe(i));
    });
  }), e.querySelectorAll("[data-holosuite-filter]").forEach((n) => {
    n.addEventListener("click", (o) => {
      const i = o.currentTarget.dataset.holosuiteFilter;
      c == null || c.setWhatsNewFilter(Zn(i));
    });
  }), e.querySelectorAll("[data-holosuite-whats-new-tab]").forEach((n) => {
    n.addEventListener("click", (o) => {
      const i = o.currentTarget.dataset.holosuiteWhatsNewTab;
      c == null || c.setWhatsNewTab(Qn(i));
    });
  }), e.querySelectorAll("[data-holosuite-action='close']").forEach((n) => {
    n.addEventListener("pointerdown", mt, { capture: !0 }), n.addEventListener("click", mt, { capture: !0 });
  }), Kn(e));
}
function Zn(e) {
  const t = String(e ?? "");
  return t === "free" || t === "premium" || t === "installed" ? t : "all";
}
function Qn(e) {
  return String(e ?? "") === "releases" ? "releases" : "updates";
}
function mt(e) {
  var t;
  e.preventDefault(), e.stopPropagation(), (t = e.stopImmediatePropagation) == null || t.call(e), Ae();
}
async function Ae() {
  var o, i;
  if (F == null || F(), ue) return;
  ue = !0;
  const e = c, t = e ? D(e.element) : document.querySelector("#holosuite-launcher"), n = ((o = t == null ? void 0 : t.closest) == null ? void 0 : o.call(t, "#holosuite-launcher, .holosuite-launcher-window")) ?? t;
  c = null, W = null;
  try {
    await ((i = e == null ? void 0 : e.close) == null ? void 0 : i.call(e, { force: !0 }));
  } catch (r) {
    console.warn(`${u} | Foundry did not close the launcher cleanly; removing stale launcher element.`, r);
  } finally {
    ue = !1;
  }
  window.setTimeout(() => {
    n != null && n.isConnected && n.remove(), c || Dt();
  }, 0);
}
function eo() {
  var n;
  const e = game.modules;
  return P((e == null ? void 0 : e.contents) ?? Array.from(((n = e == null ? void 0 : e.values) == null ? void 0 : n.call(e)) ?? [])).filter((o) => (o == null ? void 0 : o.active) === !0).map((o) => ({
    id: String(o.id ?? ""),
    title: String(o.title ?? o.id ?? ""),
    version: String(o.version ?? "")
  })).sort((o, i) => o.id.localeCompare(i.id));
}
function to() {
  const e = Array.from(
    document.querySelectorAll(`link[${ne}]`)
  );
  return Ne.map((t) => {
    const n = e.find((o) => o.getAttribute(ne) === t) ?? null;
    return {
      path: t,
      present: n !== null,
      loaded: (n == null ? void 0 : n.sheet) != null,
      href: (n == null ? void 0 : n.href) ?? null
    };
  });
}
function no() {
  var n;
  const e = game.messages, t = Number((e == null ? void 0 : e.size) ?? ((n = e == null ? void 0 : e.contents) == null ? void 0 : n.length) ?? 0);
  return Number.isFinite(t) ? t : 0;
}
function Je() {
  var a, l, f;
  const e = E(u, Se) === !0, t = A(), n = E(u, ve) === !0, o = to(), i = eo(), r = game.release, s = game.system;
  return {
    schemaVersion: 1,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    core: {
      version: String(((a = game.modules.get(u)) == null ? void 0 : a.version) ?? ""),
      diagnosticModeActive: t || e || n,
      apiOnly: t,
      cssDisabled: e,
      visualEffectsDisabled: n,
      stylesheets: o,
      launcherOpen: Me(c) || ze(),
      registeredApps: [...L.values()].map((m) => ({
        id: m.id,
        title: m.title,
        premium: m.premium === !0,
        playerVisible: m.playerVisible !== !1
      })),
      registeredWhatsNewModules: [...G.keys()].sort(),
      deviceStyle: {
        effective: ie(),
        client: Te(),
        forced: Ce()
      },
      formFactor: re(),
      appOrder: Mt(),
      colorTheme: Ft(E(u, Ve))
    },
    foundry: {
      version: String((r == null ? void 0 : r.version) ?? game.version ?? ""),
      generation: Number((r == null ? void 0 : r.generation) ?? 0) || null,
      build: Number((r == null ? void 0 : r.build) ?? 0) || null,
      systemId: String((s == null ? void 0 : s.id) ?? ""),
      systemVersion: String((s == null ? void 0 : s.version) ?? ""),
      worldId: String(((l = game.world) == null ? void 0 : l.id) ?? ""),
      isGM: ((f = game.user) == null ? void 0 : f.isGM) === !0
    },
    workload: {
      chatMessages: no(),
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
function Zt() {
  return JSON.stringify(Je(), null, 2);
}
async function oo() {
  var t, n, o, i, r, s;
  const e = Zt();
  try {
    if ((t = navigator.clipboard) != null && t.writeText)
      await navigator.clipboard.writeText(e);
    else if ((n = game.clipboard) != null && n.copyPlainText)
      await game.clipboard.copyPlainText(e);
    else
      throw new Error("No clipboard API is available.");
    (i = (o = ui.notifications) == null ? void 0 : o.info) == null || i.call(o, "HoloSuite Core diagnostics copied to the clipboard.");
  } catch (a) {
    console.warn(`${u} | Could not copy diagnostics.`, a), (s = (r = ui.notifications) == null ? void 0 : r.error) == null || s.call(r, "Could not copy diagnostics. Use Download JSON instead.");
  }
}
function io() {
  const e = new Blob([Zt()], { type: "application/json" }), t = URL.createObjectURL(e), n = document.createElement("a"), o = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  n.href = t, n.download = `holosuite-core-diagnostics-${o}.json`, n.click(), window.setTimeout(() => URL.revokeObjectURL(t), 0);
}
function pt() {
  const e = Je(), t = e.core, n = [
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
        <div class="form-group"><label>Core styles loaded</label><div class="form-fields"><strong>${t.stylesheets.filter((i) => i.present).length}/${t.stylesheets.length}</strong></div></div>
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
function bt(e, t) {
  var n, o, i;
  e && ((n = e.querySelector("[data-action='refresh']")) == null || n.addEventListener("click", () => t.render(!1)), (o = e.querySelector("[data-action='copy']")) == null || o.addEventListener("click", () => void oo()), (i = e.querySelector("[data-action='download']")) == null || i.addEventListener("click", io));
}
class Qt extends Ee {
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
    return $(pt());
  }
  activateListeners(t) {
    super.activateListeners(t), bt(D(t), this);
  }
  async _renderHTML() {
    const t = document.createElement("template");
    return t.innerHTML = pt().trim(), t.content;
  }
  _replaceHTML(t, n) {
    const o = D(n), i = (o == null ? void 0 : o.querySelector(".window-content")) ?? o;
    if (!i) return;
    const r = t instanceof DocumentFragment || t instanceof HTMLElement ? t : D(t);
    r ? i.replaceChildren(r) : i.innerHTML = String(t ?? ""), bt(i, this);
  }
  async _updateObject() {
  }
}
M(Qt, "DEFAULT_OPTIONS", {
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
function en(e) {
  var t, n, o, i;
  return (t = game.user) != null && t.isGM ? (Ie ?? (Ie = new Ke()), typeof e == "string" && Ie.selectTarget(e), Ie.render(Ee === ((i = (o = (n = globalThis.foundry) == null ? void 0 : n.applications) == null ? void 0 : o.api) == null ? void 0 : i.ApplicationV2) ? { force: !0 } : !0)) : null;
}
class Ke extends Ee {
  constructor() {
    super(...arguments);
    M(this, "selected", _);
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
  selectTarget(n) {
    this.selected = n;
  }
  renderEditor() {
    const n = mn();
    return `<section class="holosuite-branding-editor">
      <p>Choose a device or app. Blank fields use its defaults. Changes apply to this world.</p>
      <label>Branding for <select data-branding-select>
        <option value="${_}">HoloSuite device</option>
        <optgroup label="Apps">${n.map((o) => `<option value="${d(o.id)}">${d(o.title)}</option>`).join("")}</optgroup>
      </select></label>
      ${L.size ? '<details class="holosuite-branding-apps"><summary>Browse app tiles</summary><div class="holosuite-branding-grid" data-branding-grid></div></details>' : ""}
      <div data-branding-fields></div>
    </section>`;
  }
  bind(n) {
    var s;
    const o = n != null && n.matches(".holosuite-branding-editor") ? n : n == null ? void 0 : n.querySelector(".holosuite-branding-editor");
    if (!o || !((s = game.user) != null && s.isGM)) return;
    const i = o.querySelector("[data-branding-select]"), r = o.querySelector("[data-branding-fields]");
    !L.has(this.selected) && !ge.has(this.selected) && (this.selected = _), i.value = this.selected, i.addEventListener("change", () => {
      this.selected = i.value, this.renderFields(r), this.renderGrid(o);
    }), this.renderFields(r), this.renderGrid(o);
  }
  renderGrid(n) {
    const o = n.querySelector("[data-branding-grid]");
    if (!o) return;
    const i = n.querySelector("[data-branding-select]"), r = [...L.values()].sort((s, a) => s.title.localeCompare(a.title));
    o.innerHTML = r.map((s) => `<button type="button" class="holosuite-app-tile" data-holosuite-app="${d(s.id)}"
      aria-pressed="${s.id === this.selected}">${zt(s, T(s.id), !1)}</button>`).join(""), o.querySelectorAll("[data-holosuite-app]").forEach((s) => {
      s.addEventListener("click", () => {
        var a;
        i.value = s.dataset.holosuiteApp, i.dispatchEvent(new Event("change")), (a = n.querySelector('[name="name"]')) == null || a.focus();
      });
    }), pe(o);
  }
  renderFields(n) {
    var se, Ze, Qe, et, tt;
    const o = this.selected, i = L.get(o) ?? ge.get(o), r = L.has(o), s = (i == null ? void 0 : i.brandingInApp) === !0, a = this.drafts.get(o) ?? T(o), l = (S, y, k = "", I = 100, x = a[S], O = "") => `<label>${d(y)}${O ? `<small>${d(O)}</small>` : ""}<input name="${d(S)}" maxlength="${I}" value="${d(x)}" placeholder="${d(k)}"></label>`, f = (S, y) => `
      <fieldset class="holosuite-branding-asset" ${S === "iconImage" ? "data-custom-icon-image" : ""}>${l(S, y, "PNG or WebP", 2048)}
        <button type="button" data-branding-pick="${S}" aria-label="Browse or upload ${d(y)}"><i class="fa-solid fa-folder-open" aria-hidden="true"></i> Browse / Upload</button>
      </fieldset>`, m = this.drafts.has(o) ? a.icon : a.iconImage ? "custom" : a.icon, g = (S, y, k = a[S]) => `<label>${y}<select name="${S}"><option value="">Use default</option>${Object.entries(wt).map(([I, x]) => `<option value="${I}" ${k === I ? "selected" : ""}>${x}</option>`).join("")}
        ${S === "icon" ? `<option value="custom" ${k === "custom" ? "selected" : ""}>Custom image</option>` : ""}</select></label>`, w = Object.entries(((se = i == null ? void 0 : i.brandingHeader) == null ? void 0 : se.textFields) ?? {});
    n.innerHTML = `<form class="holosuite-branding-form">
      ${l("name", i ? "Display name" : "Device name", (i == null ? void 0 : i.title) || "HoloSuite")}
      ${r && i ? l(
      "label",
      "Launcher tile label (optional)",
      kt(i.title),
      48,
      a.label,
      "Only shown on the HoloSuite launcher tile. Leave blank to use the display name."
    ) : ""}
      ${g("icon", i ? "App icon" : "Launcher icon", m ?? "")}
      ${f("iconImage", s ? "App icon image" : i ? "Tile icon image" : "Launcher icon image")}
      ${!i || (Ze = i.brandingHeader) != null && Ze.taglineLabel || w.length ? `<details><summary>Advanced branding</summary>
        ${!i || (Qe = i.brandingHeader) != null && Qe.taglineLabel ? f("logo", i ? "Header logo" : "Device logo") : ""}
        ${w.map(([S, y]) => {
      var O;
      const { label: k, hint: I, placeholder: x } = typeof y == "string" ? { label: y } : y;
      return l(`text.${S}`, k, x, 160, (O = a.text) == null ? void 0 : O[S], I);
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
          ${g("backIcon", "Back to apps icon")}${g("settingsIcon", "Settings icon")}
          ${g("updatesIcon", "What’s New icon")}${g("closeIcon", "Close icon")}`}
      </details>` : ""}
      <footer><button type="button" data-branding-reset>Reset fields</button><button type="submit"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Save branding</button></footer>
    </form>`;
    const p = n.querySelector("form"), b = p.elements.namedItem("icon"), C = p.querySelector("[data-custom-icon-image]"), h = p.elements.namedItem("iconImage"), v = (S = !1) => {
      const y = Object.fromEntries(new FormData(p));
      (S || b.value === "custom") && (y.iconImage = h.value);
      const k = Object.fromEntries(w.map(([I]) => [I, y[`text.${I}`]]));
      return { ...y, text: k };
    }, H = () => {
      C.disabled = b.value !== "custom", this.drafts.set(o, v(!0));
    };
    p.addEventListener("input", H), (tt = p.querySelector("[data-branding-reset]")) == null || tt.addEventListener("click", () => {
      this.drafts.set(o, {}), this.renderFields(n);
    }), p.querySelectorAll("[data-branding-pick]").forEach((S) => {
      S.addEventListener("click", () => {
        var I, x, O, V, K, j, Z, B, Q;
        const y = p.elements.namedItem(S.dataset.brandingPick), k = ((V = (O = (x = (I = globalThis.foundry) == null ? void 0 : I.applications) == null ? void 0 : x.apps) == null ? void 0 : O.FilePicker) == null ? void 0 : V.implementation) ?? ((Z = (j = (K = globalThis.foundry) == null ? void 0 : K.applications) == null ? void 0 : j.apps) == null ? void 0 : Z.FilePicker) ?? globalThis.FilePicker;
        if (!k) return (Q = (B = ui.notifications) == null ? void 0 : B.warn) == null ? void 0 : Q.call(B, "Foundry’s file picker is unavailable.");
        new k({ type: "image", current: y.value, callback: (N) => {
          var ae, nt;
          if (!de(N)) return (nt = (ae = ui.notifications) == null ? void 0 : ae.warn) == null ? void 0 : nt.call(ae, "Choose a PNG or WebP image.");
          !p.isConnected || y.matches(":disabled") || (y.value = N, H());
        } }).browse();
      });
    }), p.addEventListener("submit", async (S) => {
      var O, V, K, j, Z, B, Q;
      if (S.preventDefault(), S.stopPropagation(), this.saving || !((O = game.user) != null && O.isGM)) return;
      const y = v();
      if ([y.iconImage, y.logo].some((N) => typeof N == "string" && N.trim() && !de(N))) {
        (K = (V = ui.notifications) == null ? void 0 : V.warn) == null || K.call(V, "Use a valid PNG or WebP image for branding.");
        return;
      }
      const k = { ...E(u, z) }, I = he(y), x = this.drafts.get(o);
      Object.keys(I).length ? Object.defineProperty(k, o, { value: I, enumerable: !0, configurable: !0 }) : delete k[o], this.saving = !0;
      try {
        await game.settings.set(u, z, k), this.drafts.get(o) === x && this.drafts.delete(o);
        const N = n.closest(".holosuite-branding-editor");
        N && this.renderGrid(N), (Z = (j = ui.notifications) == null ? void 0 : j.info) == null || Z.call(j, "HoloSuite branding saved.");
      } catch (N) {
        console.error(`${u} | Branding could not be saved.`, N), (Q = (B = ui.notifications) == null ? void 0 : B.error) == null || Q.call(B, "HoloSuite branding could not be saved. Try again.");
      } finally {
        this.saving = !1;
      }
    }), C.disabled = b.value !== "custom";
  }
  async _renderInner() {
    return $(this.renderEditor());
  }
  activateListeners(n) {
    this.bind(D(n));
  }
  async _renderHTML() {
    const n = document.createElement("template");
    return n.innerHTML = this.renderEditor(), n.content;
  }
  _replaceHTML(n, o) {
    const i = D(o);
    i && (i.replaceChildren(n), this.bind(i));
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
class we extends Ee {
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
    const n = T(_);
    return (((i = game.user) == null ? void 0 : i.isGM) === !0 ? n.gmTitle : n.playerTitle) || n.name || super.title;
  }
  render(...n) {
    var o, i;
    return A() ? ((i = (o = ui.notifications) == null ? void 0 : o.warn) == null || i.call(o, "HoloSuite Core is in API-only diagnostic mode on this browser."), this) : super.render(...n);
  }
  async _renderInner() {
    return $(ft(this.currentView, this.whatsNewFilter, this.whatsNewTab));
  }
  activateListeners(n) {
    super.activateListeners(n), Oe(D(n)), this.resizeForFormFactor();
  }
  async _renderHTML() {
    const n = document.createElement("template");
    return n.innerHTML = ft(this.currentView, this.whatsNewFilter, this.whatsNewTab).trim(), n.content;
  }
  _replaceHTML(n, o) {
    const i = this.getRenderTarget(o);
    if (!i) return;
    const r = n instanceof DocumentFragment || n instanceof HTMLElement ? n : D(n);
    r ? i.replaceChildren(r) : i.innerHTML = String(n ?? ""), Oe(i), this.resizeForFormFactor();
  }
  async close(n = {}) {
    return R = !1, c = null, super.close(n);
  }
  getLauncherRoot(n = {}) {
    var r;
    const o = D(this.element), i = (o == null ? void 0 : o.querySelector(".holosuite-phone")) ?? ((r = o == null ? void 0 : o.closest) == null ? void 0 : r.call(o, ".holosuite-phone")) ?? null;
    return i != null && i.isConnected ? i : n.includeDocumentFallback === !1 ? null : document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone");
  }
  getRenderTarget(n) {
    const o = D(n);
    return o ? o.querySelector(".window-content") ?? o.querySelector(".holosuite-launcher-window .window-content") ?? o : null;
  }
  updateRenderedView() {
    var m, g;
    const n = this.getLauncherRoot();
    if (!n) return !1;
    const o = n.querySelector(".holosuite-status-bar"), i = n.querySelector(".holosuite-screen");
    if (!o || !i) return !1;
    Un(n, i);
    const r = document.activeElement, s = r instanceof HTMLElement && i.contains(r) ? r : null, a = s == null ? void 0 : s.dataset.holosuiteDeviceStyle, l = s == null ? void 0 : s.dataset.holosuiteFormFactorChoice;
    o.innerHTML = `
      ${Kt()}
      ${jt(this.currentView)}
    `;
    const f = (m = n.closest(".holosuite-launcher-window")) == null ? void 0 : m.querySelector(".window-title");
    if (f && (f.textContent = this.title), i.innerHTML = this.currentView === "whats-new" ? Xt(this.whatsNewFilter, this.whatsNewTab) : this.currentView === "settings" ? Jt() : Yt(), i.classList.toggle("holosuite-screen--whats-new", this.currentView === "whats-new"), i.classList.toggle("holosuite-screen--settings", this.currentView === "settings"), Oe(n), a || l) {
      const w = a ? "[data-holosuite-device-style]" : "[data-holosuite-form-factor-choice]";
      (g = [...i.querySelectorAll(w)].find(
        (p) => a ? p.dataset.holosuiteDeviceStyle === a : p.dataset.holosuiteFormFactorChoice === l
      )) == null || g.focus({ preventScroll: !0 });
    }
    return !0;
  }
  showApps() {
    this.currentView = "apps", this.updateRenderedView() || this.render(!1);
  }
  showWhatsNew() {
    R = !1, this.currentView = "whats-new", En(), this.updateRenderedView() || this.render(!1);
  }
  showSettings() {
    R = !1, this.currentView = "settings", this.updateRenderedView() || this.render(!1);
  }
  async setDeviceStyle(n) {
    Ce() || n === Te() || await game.settings.set(u, We, n);
  }
  async setFormFactor(n) {
    n !== re() && await game.settings.set(u, qe, n);
  }
  applyAppColors() {
    const n = this.getLauncherRoot({ includeDocumentFallback: !1 });
    n && (n.dataset.holosuiteAppColors = xt());
  }
  resizeForFormFactor() {
    var f, m;
    const n = (f = this.getLauncherRoot({ includeDocumentFallback: !1 })) == null ? void 0 : f.closest("#holosuite-launcher, .holosuite-launcher-window");
    if (!n) return;
    const o = Fn(), { left: i, top: r, width: s, height: a } = n.getBoundingClientRect(), l = {
      ...o,
      left: Math.max(16, Math.min(i + (s - o.width) / 2, window.innerWidth - o.width - 16)),
      top: Math.max(16, Math.min(r + (a - o.height) / 2, window.innerHeight - o.height - 16))
    };
    n.style.setProperty("--hs-launcher-width", `${o.width}px`), n.style.setProperty("--hs-launcher-height", `${o.height}px`);
    try {
      (m = this.setPosition) == null || m.call(this, l);
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
M(we, "DEFAULT_OPTIONS", {
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
    const t = ht({ ...e, brandingInApp: !0, open: () => {
    } });
    t && ge.set(t.id, t);
  },
  registerApp(e) {
    const t = ht(e);
    return t ? (L.set(t.id, t), A() || c == null || c.render(!1), t) : null;
  },
  unregisterApp(e) {
    const t = L.delete(String(e ?? ""));
    return t && !A() && (c == null || c.render(!1)), t;
  },
  getApps() {
    return [...L.values()];
  },
  getBranding: T,
  hasBrandingMigration(e) {
    const t = E(u, z);
    return (t == null ? void 0 : t[`migration:${e}`]) === !0;
  },
  async migrateBranding(e, t) {
    var r;
    if (!((r = game.user) != null && r.isGM) || this.hasBrandingMigration(e)) return;
    const n = { ...E(u, z) }, o = T(e), i = he(t);
    n[e] = he({ ...o, ...i, text: { ...o.text, ...i.text } }), n[`migration:${e}`] = !0, await game.settings.set(u, z, n);
  },
  openBranding: en,
  getDiagnostics() {
    return Je();
  },
  registerWhatsNew(e) {
    return Gt(e);
  },
  unregisterWhatsNew(e) {
    const t = G.delete(String(e ?? ""));
    return t && !A() && (c == null || c.render(!1)), t;
  },
  getWhatsNew() {
    return [...G.values()].sort(Ue);
  },
  async openLauncher() {
    var e, t;
    return A() ? ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "HoloSuite Core is in API-only diagnostic mode on this browser."), null) : W || (W = (async () => {
      Me(c) || (c = null), c || (c = new we());
      try {
        await c.render(!0);
      } catch (n) {
        console.warn(`${u} | Recreating launcher after render failure.`, n), c = new we(), await c.render(!0);
      }
      return Tn(c), c;
    })().finally(() => {
      W = null;
    }), W);
  },
  async toggleLauncher() {
    return W || (Me(c) ? (await Ae(), null) : (ze() && Dt(), Ln(), q.openLauncher()));
  }
};
function tn() {
  const e = game.modules.get(u);
  if (game.holosuite = q, globalThis.HoloSuiteCoreApi = q, e)
    try {
      e.api = q;
    } catch (t) {
      console.warn(`${u} | Could not attach API to game.modules; using game.holosuite fallback.`, t);
    }
  Hooks.callAll(`${u}.apiReady`, q);
}
Hooks.once("init", () => {
  Bt(), Hn(), Ot(), Nt(), Nn(), tn(), window.addEventListener("resize", () => c == null ? void 0 : c.resizeForFormFactor());
});
Hooks.on("getSceneControlButtons", $n);
Hooks.on("renderSceneControls", (e, t) => In(t));
Hooks.on("renderSidebar", $e);
Hooks.on("renderSidebarTab", $e);
Hooks.on("renderSettingsConfig", Dn);
for (const e of ["renderApplication", "renderApplicationV1", "renderApplicationV2"])
  Hooks.on(e, (t, n) => {
    const o = D(t.element) ?? D(n);
    o && Be(o, T);
  });
Hooks.on("holosuite-core.renderBranding", (e) => Be(e, T));
Hooks.once("ready", () => {
  me = !0, tn(), Bt(), _e(), Pn(), _t(), A() ? console.warn(`${u} | API-only diagnostic mode is enabled on this browser.`) : ($e(), Vt()), console.log(`${u} | Ready. API available at game.modules.get("${u}").api`);
});
