var Qt = Object.defineProperty;
var en = (e, n, t) => n in e ? Qt(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t;
var P = (e, n, t) => en(e, typeof n != "symbol" ? n + "" : n, t);
const De = [
  "modules/holosuite-core/styles/holosuite-tokens.css",
  "modules/holosuite-core/styles/holosuite-core.css"
], te = "data-holosuite-core-stylesheet";
function tn(e, n) {
  const t = String(n ?? "").trim();
  return t ? `${e}?v=${encodeURIComponent(t)}` : e;
}
function nn(e, n = document, t = "") {
  const o = Array.from(
    n.querySelectorAll(`link[${te}]`)
  );
  if (!e) {
    for (const a of o) a.remove();
    return;
  }
  const i = n.head;
  if (!i) return;
  const r = new Set(De), s = /* @__PURE__ */ new Set();
  for (const a of o) {
    const u = a.getAttribute(te) ?? "";
    if (!r.has(u) || s.has(u)) {
      a.remove();
      continue;
    }
    s.add(u);
  }
  for (const a of De) {
    if (s.has(a)) continue;
    const u = n.createElement("link");
    u.rel = "stylesheet", u.href = tn(a, t), u.setAttribute(te, a), i.append(u);
  }
}
function ne(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function ot(e, n) {
  return ne(e) ? n.includes(String(e.name ?? "")) : !1;
}
function it(e) {
  if (!ne(e) || !("tools" in e)) return !1;
  const n = String(e.name ?? "");
  return !["measure", "templates", "walls", "lighting", "sounds", "notes", "tiles", "drawings"].includes(n);
}
function on(e, n, t) {
  if (Array.isArray(e))
    return e.find((o) => ot(o, n)) ?? (t ? e.find(it) : null) ?? null;
  if (!ne(e)) return null;
  for (const o of n)
    if (ne(e[o])) return e[o];
  return Object.values(e).find((o) => ot(o, n)) ?? (t ? Object.values(e).find(it) : null) ?? null;
}
function rn(e) {
  const n = Object.values(e).map((t) => Number(t == null ? void 0 : t.order)).filter(Number.isFinite);
  return n.length ? Math.max(...n) + 1 : Object.keys(e).length;
}
function rt(e, n, t = ["tokens", "token"], o = {}) {
  const i = on(e, t, o.allowFallback === !0);
  if (!i) return !1;
  const r = i.tools;
  return Array.isArray(r) ? r.some((s) => (s == null ? void 0 : s.name) === n.name) ? !1 : (r.push(n), !0) : !ne(r) || r[n.name] ? !1 : (r[n.name] = { ...n, order: n.order ?? rn(r) }, !0);
}
const z = "branding", N = "holosuite-core", wt = {
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
}, sn = {
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
function le(e) {
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
function ce(e) {
  if (!e || typeof e != "object") return {};
  const n = e, t = {};
  for (const [r, s] of Object.entries(sn)) {
    const a = n[r];
    typeof a == "string" && a.trim() && (t[r] = a.trim().slice(0, s));
  }
  for (const r of ["icon", "backIcon", "settingsIcon", "updatesIcon", "closeIcon"]) {
    const s = n[r];
    typeof s == "string" && Object.hasOwn(wt, s) && (t[r] = s);
  }
  const o = le(n.iconImage), i = le(n.logo);
  if (o && (t.iconImage = o), i && (t.logo = i), n.text && typeof n.text == "object") {
    const r = Object.entries(n.text).slice(0, 20).filter(([s, a]) => /^[a-z][a-zA-Z0-9]{0,39}$/.test(s) && typeof a == "string" && a.trim());
    r.length && (t.text = Object.fromEntries(r.map(([s, a]) => [s, a.trim().slice(0, 160)])));
  }
  return t;
}
const st = "[data-holosuite-branding]", Ne = "data-holosuite-branding-default", at = "data-holosuite-branding-override";
function ee(e, n) {
  var o;
  (o = e.querySelector(`:scope > [${at}]`)) == null || o.remove();
  let t = e.querySelector(`:scope > [${Ne}]`);
  if (!n) {
    t && t.replaceWith(...t.childNodes);
    return;
  }
  t || (t = document.createElement("span"), t.setAttribute(Ne, ""), t.style.display = "none", t.append(...e.childNodes), e.append(t)), n.setAttribute(at, ""), e.append(n);
}
function Te(e) {
  if (!e) return;
  const n = document.createElement("span");
  return n.textContent = e, n;
}
function yt({ logo: e, iconImage: n, icon: t }) {
  const o = e || n;
  if (!o && !t) return;
  const i = document.createElement("span");
  if (i.className = "holosuite-module-brand-icon", i.setAttribute("aria-hidden", "true"), o) {
    const r = document.createElement("img");
    r.src = o, r.alt = "";
    const s = () => {
      if (!i.parentElement) return;
      const a = yt({ icon: t });
      a ? i.replaceChildren(...a.childNodes) : ee(i.parentElement);
    };
    i.append(r), r.addEventListener("error", s, { once: !0 }), r.complete && !r.naturalWidth && queueMicrotask(s);
  } else {
    const r = document.createElement("i");
    r.className = `fa-solid ${t}`, i.append(r);
  }
  return i;
}
function Pe(e, n) {
  var o, i, r;
  const t = [...e.querySelectorAll(st)];
  e instanceof HTMLElement && e.matches(st) && t.unshift(e);
  for (const s of t) {
    const a = n(s.dataset.holosuiteBranding);
    for (const m of s.querySelectorAll("[data-holosuite-brand-name]"))
      ee(m, Te(a.name));
    for (const m of s.querySelectorAll("[data-holosuite-brand-text]")) {
      const h = m.dataset.holosuiteBrandText, y = m.hasAttribute("data-holosuite-brand-fallback-name") ? a.name : void 0;
      ee(m, Te((h === "tagline" ? a.tagline : (o = a.text) == null ? void 0 : o[h]) || y));
    }
    for (const m of s.querySelectorAll("[data-holosuite-brand-icon]"))
      ee(m, yt(a));
    const u = (i = s.closest(".app, .application")) == null ? void 0 : i.querySelector(":scope > .window-header"), p = u == null ? void 0 : u.querySelector(".window-title");
    if (p) {
      const m = ((r = p.querySelector(`:scope > [${Ne}]`)) == null ? void 0 : r.textContent) ?? p.textContent, h = a.name && s.hasAttribute("data-holosuite-brand-title-prefix") && m ? `${a.name} · ${m}` : a.name;
      ee(p, Te(h));
    }
  }
}
const c = "holosuite-core", pe = "apiOnlyForDebugging", be = "disableCoreCssForDebugging", we = "disableVisualEffectsForDebugging", St = "disableForPlayers", Me = "deviceStyle", vt = "forceDeviceStyle", _e = "formFactor", Re = "appOrder", Be = "theme", We = "whatsNewLastSeen", an = "openLauncher", lt = "data-holosuite-foundry-generation", ct = "data-holosuite-debug-no-effects", ln = `modules/${c}/data/whats-new.json`, cn = Date.UTC(2026, 7, 1), un = /* @__PURE__ */ new Set([
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
]), ut = {
  base: "HoloSuite",
  "space-police": "Space Police"
}, Ce = {
  "": "Allow User Choice",
  base: "HoloSuite",
  "space-police": "Space Police"
}, oe = {
  base: ut.base,
  "space-police": ut["space-police"]
}, dn = {
  "": Ce[""],
  base: Ce.base,
  "space-police": Ce["space-police"]
}, hn = {
  phone: "Phone",
  datapad: "Datapad",
  computer: "Computer"
}, Et = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
}, L = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map();
function fn() {
  return [...new Map([...ue, ...L]).values()].sort((e, n) => e.title.localeCompare(n.title));
}
const V = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map();
let l = null, Le = null, W = null, ae = !1, $t = 0, de = !1, Tt = null, dt = !1, Q = null, _ = !1, He = 0;
function gn() {
  var t, o, i, r, s, a;
  const e = ((o = (t = globalThis.foundry) == null ? void 0 : t.appv1) == null ? void 0 : o.api) ?? ((i = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : i.api) ?? null, n = ((s = (r = globalThis.foundry) == null ? void 0 : r.applications) == null ? void 0 : s.api) ?? ((a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.api) ?? null;
  return globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (n == null ? void 0 : n.ApplicationV2);
}
const ye = gn();
function Oe(e) {
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
function se(e, n, t = `${n}s`) {
  return `${e} ${e === 1 ? n : t}`;
}
function E(e, n) {
  try {
    return game.settings.get(e, n);
  } catch {
    return null;
  }
}
function k() {
  return Tt ?? E(c, pe) === !0;
}
function Ae(e) {
  var n;
  return ((n = game.modules.get(e)) == null ? void 0 : n.api) ?? null;
}
function mn() {
  var e, n, t;
  return String(((n = (e = game.user) == null ? void 0 : e.character) == null ? void 0 : n.name) ?? ((t = game.user) == null ? void 0 : t.name) ?? "Player");
}
function pn(e) {
  var n, t, o, i, r, s;
  if (e === "cybercall") {
    const a = M(E("cybercall", "contacts")), u = M(E("cybercall", "groupContacts"));
    return se(a.length + u.length, "link");
  }
  if (e === "bounty-board") {
    const a = M((t = (n = Ae("bounty-board")) == null ? void 0 : n.getAllBounties) == null ? void 0 : t.call(n, { includeHidden: !1 }));
    return se(a.length, "contract");
  }
  if (e === "csi-toolkit") {
    const a = Object.values(((i = (o = Ae("csi-toolkit")) == null ? void 0 : o.getCases) == null ? void 0 : i.call(o)) ?? {}).filter((u) => (u == null ? void 0 : u.visibility) !== "gm");
    return se(a.length, "case");
  }
  if (e === "galaxy-map") {
    const a = M((s = (r = Ae("galaxy-map")) == null ? void 0 : r.getMaps) == null ? void 0 : s.call(r)).filter((u) => (u == null ? void 0 : u.visibility) === "players");
    return se(a.length, "chart");
  }
  return "";
}
function M(e) {
  return Array.isArray(e) ? e : [];
}
function bn(e) {
  const n = String((e == null ? void 0 : e.title) ?? "").trim();
  if (!n) return null;
  const t = M(e == null ? void 0 : e.tags).map((i) => String(i ?? "").trim()).find((i) => /^foundry\b/i.test(i)), o = t ? [t.replace(/-v(?=\d)/i, "–")] : [];
  return {
    title: n,
    summary: String((e == null ? void 0 : e.summary) ?? "").trim(),
    tags: o
  };
}
function Ct(e) {
  const n = String((e == null ? void 0 : e.moduleId) ?? "").trim(), t = String((e == null ? void 0 : e.title) ?? "").trim(), o = M(e == null ? void 0 : e.entries).map((r) => bn(r)).filter((r) => !!r);
  if (!n || !t || o.length === 0)
    return console.warn(`${c} | Ignoring invalid what's new registration.`, e), null;
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
function qe(e, n) {
  return X(n) - X(e) || e.title.localeCompare(n.title);
}
function Lt(e) {
  var n, t;
  return ((t = (n = game.modules) == null ? void 0 : n.has) == null ? void 0 : t.call(n, e)) === !0;
}
function wn() {
  const e = Number(E(c, We));
  return Number.isFinite(e) ? e : 0;
}
function yn() {
  const e = wn();
  return [...V.values(), ...Y.values()].filter((n) => X(n) > e).reduce((n, t) => n + t.entries.length, 0);
}
function Sn() {
  try {
    game.settings.set(c, We, Date.now());
  } catch (e) {
    console.warn(`${c} | Could not update what's new read state.`, e);
  }
}
function ht(e) {
  const n = String((e == null ? void 0 : e.id) ?? "").trim(), t = String((e == null ? void 0 : e.title) ?? "").trim(), o = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !n || !t || !o || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${c} | Ignoring invalid app registration.`, e), null) : {
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
  const n = E(c, z);
  return !n || typeof n != "object" || !Object.hasOwn(n, e) ? {} : ce(n[e]);
}
function kt(e, n = T(N)) {
  const t = n.name || "HoloSuite";
  return e ? n.gmTitle || `${t} Command Deck` : n.playerTitle || `${t} Player View`;
}
function G(e, n) {
  const t = `<i class="${d(e.icon ? `fa-solid ${e.icon}` : n)}" aria-hidden="true"></i>`;
  return e.iconImage ? `<img class="holosuite-brand-image" src="${d(e.iconImage)}" alt="">${t}` : t;
}
function he(e) {
  e.querySelectorAll("img.holosuite-brand-image").forEach((n) => {
    const t = () => {
      n.hidden = !0;
    };
    n.addEventListener("error", t, { once: !0 }), n.complete && !n.naturalWidth && t();
  });
}
function vn(e) {
  var i;
  if (k()) return;
  const n = ((i = game.user) == null ? void 0 : i.isGM) === !0;
  if (!n && Ee()) return;
  const t = () => ({
    name: "holosuite-core-launcher",
    title: kt(n),
    icon: Pn(),
    button: !0,
    visible: !0,
    onClick: Dt,
    onChange: Ln
  }), o = rt(e, t(), ["tiles", "tile"]);
  rt(e, t(), ["tokens", "token"], { allowFallback: !o });
}
function En() {
  var e;
  return !k() && (((e = game.user) == null ? void 0 : e.isGM) === !0 || !Ee());
}
function Se() {
  k() || document.querySelectorAll(".holosuite-sidebar-launcher, .holosuite-floating-launcher").forEach((e) => e.remove());
}
function C(e) {
  var o;
  if (e instanceof HTMLElement) return e;
  if (Array.isArray(e) && e[0] instanceof HTMLElement) return e[0];
  const n = e, t = ((o = n == null ? void 0 : n.get) == null ? void 0 : o.call(n, 0)) ?? (n == null ? void 0 : n[0]);
  return t instanceof HTMLElement ? t : null;
}
function $n(e) {
  var r;
  const n = new Set(document.querySelectorAll("#holosuite-launcher, .holosuite-launcher-window"));
  if (n.size <= 1) return;
  const t = e ? C(e.element) : null, i = ((r = t == null ? void 0 : t.closest) == null ? void 0 : r.call(t, "#holosuite-launcher, .holosuite-launcher-window")) ?? [...n].at(-1) ?? null;
  for (const s of n)
    s !== i && s.remove();
}
function It() {
  document.querySelectorAll("#holosuite-launcher, .holosuite-launcher-window").forEach((e) => {
    e.remove();
  });
}
function Ge() {
  return document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone") !== null;
}
function Tn() {
  l = null, W = null, ae = !1;
}
function Cn(e) {
  const n = e.find((t) => typeof t == "boolean");
  return typeof n == "boolean" ? n : null;
}
function Dt() {
  return $t = Date.now(), q.toggleLauncher();
}
function Ln(...e) {
  const n = Cn(e);
  return n === !1 ? ($e(), null) : n === null && Date.now() - $t < 100 ? null : q.openLauncher();
}
function An(e) {
  var a;
  if (k()) return;
  const n = ((a = game.user) == null ? void 0 : a.isGM) === !0;
  if (!n && Ee()) return;
  const t = C(e) ?? document.querySelector("#controls, #scene-controls");
  if (!t) return;
  const o = T(N), i = t.querySelectorAll("[data-tool='holosuite-core-launcher'], [data-action='holosuite-core-launcher']");
  if (i.length) {
    o.iconImage && i.forEach((u) => {
      u.querySelector("img.holosuite-brand-image") || (u.insertAdjacentHTML("afterbegin", `<img class="holosuite-brand-image" src="${d(o.iconImage)}" alt="">`), he(u));
    });
    return;
  }
  const r = t.querySelector(
    ".control-tools.active, .sub-controls.active, .scene-control-tools.active, .control-tools, .sub-controls, .scene-control-tools"
  );
  if (!r) return;
  const s = document.createElement("li");
  s.className = "control-tool holosuite-scene-control", s.dataset.tool = "holosuite-core-launcher", s.title = kt(n, o), s.innerHTML = G(o, Rt()), he(s), s.addEventListener("click", (u) => {
    u.preventDefault(), u.stopPropagation(), Dt();
  }), r.appendChild(s);
}
function kn(e, n) {
  var r;
  const t = C(n);
  if (!t) return;
  const i = [
    `input[name="${c}.${pe}"]`,
    `input[name="${c}.${be}"]`,
    `input[name="${c}.${we}"]`
  ].map((s) => {
    var a;
    return ((a = t.querySelector(s)) == null ? void 0 : a.closest(".form-group")) ?? null;
  }).filter((s) => s !== null);
  for (const s of i) (r = s.parentElement) == null || r.append(s);
}
function In() {
  game.settings.register(c, z, {
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: () => {
      Pe(document, T), Hooks.callAll("holosuite-core.brandingChanged"), !(!de || k()) && (l == null || l.refreshCurrentView(), Se(), Fe());
    }
  }), game.settings.registerMenu(c, "brandingEditor", {
    name: "HoloSuite Branding",
    label: "Open HoloSuite Branding",
    hint: "Customize the device and app branding for this world.",
    icon: "fa-solid fa-palette",
    type: Ke,
    restricted: !0
  }), game.settings.register(c, pe, {
    name: "Debugging: API-Only Mode (This Browser)",
    hint: "Diagnostic only. Keeps Core's registration API active while disabling its launcher, scene-control UI, sidebar cleanup, and What's New catalog work on this browser.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => Dn(e)
  }), game.settings.register(c, be, {
    name: "Debugging: Disable HoloSuite Core CSS (This Browser)",
    hint: "Diagnostic only. Temporarily removes Core's shared tokens and launcher styles from this browser. HoloSuite interfaces will appear unstyled. Leave this off during normal play.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => Nt(e)
  }), game.settings.register(c, we, {
    name: "Debugging: Disable Core Visual Effects (This Browser)",
    hint: "Diagnostic only. Keeps Core's layout and colors while disabling launcher transitions, animations, filters, shadows, and glows on this browser.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !1,
    onChange: (e) => Ht(e)
  }), game.settings.register(c, Me, {
    name: "HoloSuite Theme",
    hint: "Choose the HoloSuite launcher theme for this user.",
    scope: "client",
    config: !0,
    type: String,
    choices: oe,
    default: "base",
    restricted: !1,
    onChange: () => {
      fe(), l == null || l.refreshCurrentView();
    }
  }), game.settings.register(c, vt, {
    name: "Force HoloSuite Theme",
    hint: "When set, every user sees this HoloSuite launcher theme instead of their personal choice.",
    scope: "world",
    config: !0,
    type: String,
    choices: dn,
    default: "",
    restricted: !0,
    onChange: () => {
      fe(), l == null || l.refreshCurrentView();
    }
  }), game.settings.register(c, _e, {
    name: "HoloSuite Form Factor",
    hint: "Choose the launcher shape for this user: phone, wide datapad, or large computer display.",
    scope: "client",
    config: !1,
    type: String,
    choices: hn,
    default: "phone",
    restricted: !1,
    onChange: () => {
      Ye(), l == null || l.refreshCurrentView(), l == null || l.resizeForFormFactor();
    }
  }), game.settings.register(c, Re, {
    name: "HoloSuite App Order",
    hint: "Stores this user's custom launcher order.",
    scope: "client",
    config: !1,
    type: Array,
    default: [],
    restricted: !1
  }), game.settings.register(c, Be, {
    name: "HoloSuite Color Theme",
    hint: "Changes the shared color theme used by HoloSuite windows.",
    scope: "world",
    config: !0,
    type: String,
    choices: Et,
    default: "default",
    restricted: !0,
    onChange: (e) => Pt(e)
  }), game.settings.register(c, St, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !0
  }), game.settings.register(c, We, {
    name: "HoloSuite What's New Last Seen",
    hint: "Tracks when this client last opened the HoloSuite What's New view.",
    scope: "client",
    config: !1,
    type: Number,
    default: 0
  }), game.settings.registerMenu(c, "launcher", {
    name: "HoloSuite Command Deck",
    label: "Open HoloSuite",
    hint: "Open the HoloSuite launcher and registered app deck.",
    icon: "fas fa-terminal",
    type: me,
    restricted: !0
  }), game.settings.registerMenu(c, "diagnostics", {
    name: "HoloSuite Core Diagnostics",
    label: "Open Diagnostics",
    hint: "Inspect, copy, or download the current HoloSuite and Foundry test state.",
    icon: "fas fa-stethoscope",
    type: Jt,
    restricted: !0
  });
}
async function Fe() {
  var t;
  const e = ui.controls;
  if (typeof (e == null ? void 0 : e.render) != "function") return;
  const n = Number(((t = game.release) == null ? void 0 : t.generation) ?? 0);
  try {
    n >= 13 ? await e.render({ force: !0, reset: !0 }) : await e.render(!0);
  } catch (o) {
    console.warn(`${c} | Could not rebuild scene controls.`, o);
  }
}
function Dn(e = E(c, pe)) {
  const n = e === !0;
  if (Tt = n, n) {
    document.querySelectorAll(
      "[data-tool='holosuite-core-launcher'], .holosuite-scene-control, .holosuite-sidebar-launcher, .holosuite-floating-launcher"
    ).forEach((t) => t.remove()), (l || Ge()) && $e(), de && Fe(), console.warn(`${c} | API-only diagnostic mode is enabled on this browser.`);
    return;
  }
  de && (qt(), Fe());
}
function Nt(e = E(c, be)) {
  var o;
  const n = e === !0, t = String(((o = game.modules.get(c)) == null ? void 0 : o.version) ?? "");
  nn(!n, document, t), n && console.warn(`${c} | Core CSS is disabled on this browser for debugging.`);
}
function Ht(e = E(c, we)) {
  const n = e === !0;
  for (const t of [document.documentElement, document.body].filter(Boolean))
    n ? t.setAttribute(ct, "true") : t.removeAttribute(ct);
  n && console.warn(`${c} | Core visual effects are disabled on this browser for debugging.`);
}
function Nn() {
  var e, n;
  (n = (e = game.keybindings) == null ? void 0 : e.register) == null || n.call(e, c, an, {
    name: "Open HoloSuite",
    hint: "Open the HoloSuite launcher and registered app deck.",
    editable: [],
    restricted: !1,
    onDown: () => {
      var t, o, i, r;
      return k() ? ((o = (t = ui.notifications) == null ? void 0 : t.warn) == null || o.call(t, "HoloSuite Core is in API-only diagnostic mode on this browser."), !1) : En() ? (q.toggleLauncher(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "HoloSuite is disabled for players in this world."), !1);
    }
  });
}
function Ve(e) {
  return Object.hasOwn(oe, String(e)) ? String(e) : "base";
}
function ve() {
  const e = String(E(c, vt) ?? "");
  return Object.hasOwn(oe, e) ? e : null;
}
function je() {
  return Ve(E(c, Me));
}
function Ot() {
  return ve() ?? je();
}
function Ft(e) {
  return Object.hasOwn(Et, String(e)) ? String(e) : "default";
}
function Ue(e) {
  return "phone";
}
function ze() {
  return Ue(E(c, _e));
}
function Hn(e = ze()) {
  const n = e === "computer" ? { width: 980, height: 720 } : e === "datapad" ? { width: 760, height: 680 } : { width: 483, height: 736 };
  return {
    width: Math.min(n.width, Math.max(420, window.innerWidth - 32)),
    height: Math.min(n.height, Math.max(560, window.innerHeight - 48))
  };
}
function xt() {
  return M(E(c, Re)).map((e) => String(e ?? "").trim()).filter((e, n, t) => !!e && t.indexOf(e) === n);
}
function On(e) {
  const n = Ve(e), t = [document.documentElement, document.body].filter(Boolean);
  for (const o of t)
    n === "base" ? o.removeAttribute("data-holosuite-device-style") : o.setAttribute("data-holosuite-device-style", n);
}
function Pt(e) {
  const n = Ft(e), t = [document.documentElement, document.body].filter(Boolean);
  for (const o of t)
    n === "default" ? o.removeAttribute("data-holosuite-theme") : o.setAttribute("data-holosuite-theme", n);
}
function Fn(e) {
  const n = Ue();
  for (const t of [document.documentElement, document.body].filter(Boolean))
    t.setAttribute("data-holosuite-form-factor", n);
}
function fe() {
  On(Ot());
}
function xn() {
  Pt(E(c, Be));
}
function Ye() {
  Fn(ze());
}
function Mt() {
  var n, t, o;
  const e = Number(((t = (n = globalThis.game) == null ? void 0 : n.release) == null ? void 0 : t.generation) ?? ((o = game == null ? void 0 : game.release) == null ? void 0 : o.generation));
  return Number.isFinite(e) ? e : null;
}
function _t() {
  const e = Mt(), n = [document.documentElement, document.body].filter(Boolean);
  for (const t of n)
    e === null ? t.removeAttribute(lt) : t.setAttribute(lt, String(e));
}
function Rt() {
  return Mt() === 12 ? "fa-solid fa-terminal" : "fa-solid fa-mobile-screen-button";
}
function Pn() {
  const e = T(N).icon;
  return e ? `fa-solid ${e}` : Rt();
}
function Ee() {
  try {
    return game.settings.get(c, St) === !0;
  } catch {
    return !1;
  }
}
function ge(e) {
  var n;
  return ((n = game.user) == null ? void 0 : n.isGM) === !0 ? !0 : Ee() ? !1 : e.playerVisible !== !1;
}
async function Bt(e) {
  var t, o, i, r;
  const n = L.get(e);
  return n ? ge(n) ? n.open() : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, `${n.title} is not available from the player view.`), null) : ((o = (t = ui.notifications) == null ? void 0 : t.warn) == null || o.call(t, `HoloSuite app "${e}" is not registered.`), null);
}
function Wt(e, n = {}) {
  const t = Ct(e);
  if (!t || X(t) < cn) return null;
  const o = V.get(t.moduleId);
  if (o) {
    const i = X(o), r = X(t);
    if (r < i || r === i && n.replace === !1) return o;
  }
  return V.set(t.moduleId, t), k() || l == null || l.render(!1), t;
}
function Mn(e, n = {}) {
  const t = Ct(e);
  return t ? n.replace === !1 && Y.has(t.moduleId) ? Y.get(t.moduleId) ?? null : (Y.set(t.moduleId, t), k() || l == null || l.render(!1), t) : null;
}
async function qt() {
  if (!(k() || dt))
    return Q || (Q = (async () => {
      try {
        const e = await fetch(ln, { cache: "no-cache" });
        if (!e.ok) throw new Error(`HTTP ${e.status}`);
        const n = await e.json(), t = M(n == null ? void 0 : n.modules);
        for (const i of t)
          Wt(i, { replace: !1 });
        const o = M(n == null ? void 0 : n.releases);
        for (const i of o)
          Mn(i, { replace: !1 });
        dt = !0;
      } catch (e) {
        console.warn(`${c} | Could not load bundled what's new catalog.`, e);
      }
    })().finally(() => {
      Q = null;
    }), Q);
}
function Gt(e) {
  const n = T(N), t = yn(), o = t > 0 ? `<span>${d(t)}</span>` : "";
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
function xe(e, n = T(e.id)) {
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
function Vt(e, n, t) {
  const o = e.description;
  return `${xe(e, n)}
    <span class="holosuite-app-title">${d(Xe(e, n))}</span>
    ${t && o ? `<p>${d(o)}</p>` : ""}`;
}
function jt() {
  var m;
  const e = ((m = game.user) == null ? void 0 : m.isGM) === !0, n = xt(), t = new Map(n.map((h, y) => [h, y])), o = [...L.values()].filter(ge).sort((h, y) => {
    const f = t.get(h.id), S = t.get(y.id);
    return f !== void 0 || S !== void 0 ? f === void 0 ? 1 : S === void 0 ? -1 : f - S : h.title.localeCompare(y.title);
  }), i = T(N), r = e ? i.gmHeading || "GM Command Deck" : i.playerHeading || "Player Link", s = e ? i.gmScreen || "Apps" : i.playerScreen || "Commlink", a = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", u = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">${d(i.userLabel || "Active User")}</span>
        <strong>${d(mn())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>${d(i.linkStatus || "LINK STABLE")}</span>
      </div>
    </section>
  `, p = o.map((h) => {
    const y = e ? "" : pn(h.id);
    return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${d(h.id)}">
          ${Vt(h, T(h.id), e)}
          ${y ? `<span class="holosuite-app-count">${d(y)}</span>` : ""}
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
    ${u}
    <div class="holosuite-app-grid">
      ${o.length ? p : `<p class="holosuite-empty">${d(a)}</p>`}
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
function _n(e) {
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
function Rn(e) {
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
function Bn(e) {
  return [...V.values()].filter((n) => e === "installed" ? Lt(n.moduleId) : e === "free" || e === "premium" ? n.tier === e : !0).sort(qe);
}
function Wn(e) {
  return [...Y.values()].filter((n) => e === "installed" ? Lt(n.moduleId) : e === "free" || e === "premium" ? n.tier === e : !0).sort(qe);
}
function qn(e) {
  const n = e.icon || (e.tier === "premium" ? "fa-solid fa-gem" : "fa-solid fa-cube"), t = e.moduleId === "holosuite-buddy" ? "holo-assistant" : e.moduleId, o = L.get(e.moduleId) ?? L.get(t);
  return o ? xe(o) : un.has(t) ? xe({ id: t, icon: n }) : G({}, n);
}
function Gn(e, n) {
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
            <span class="holosuite-whats-new-icon">${qn(t)}</span>
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
function Ut(e, n) {
  const t = Bn(e), o = Wn(e), i = n === "releases" ? o : t, r = n === "releases" ? "No releases match this filter yet." : "No updates match this filter yet.";
  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">Release Feed</span>
        <h2>What's New</h2>
      </div>
    </div>
    ${Rn(n)}
    ${_n(e)}
    <div class="holosuite-whats-new-list">
      ${Gn(i, r)}
    </div>
  `;
}
function zt() {
  var r;
  const e = ve(), n = je(), t = e ?? n, o = e ? `
    <div class="holosuite-settings-notice">
      <i class="fa-solid fa-lock"></i>
      <span>The GM is overriding the HoloSuite visual theme for this world. Your personal choice is paused until the override is removed.</span>
    </div>
  ` : "", i = Object.entries(oe).map(([s, a]) => `
    <button
      type="button"
      class="holosuite-theme-choice ${s === t ? "is-active" : ""}"
      data-holosuite-device-style="${d(s)}"
      ${e ? "disabled" : ""}
      aria-pressed="${s === t ? "true" : "false"}"
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
          <strong>${d(oe[t])}</strong>
        </div>
      </div>
      <div class="holosuite-theme-choices">
        ${i}
      </div>
      ${(r = game.user) != null && r.isGM ? `
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
function Yt(e = T(N)) {
  return `<span>${e.logo ? `<img class="holosuite-brand-image" src="${d(e.logo)}" alt="">` : ""}${d(e.name || "HoloSuite")}</span>`;
}
function ft(e = "apps", n = "all", t = "releases") {
  const o = e === "whats-new" ? "holosuite-screen--whats-new" : e === "settings" ? "holosuite-screen--settings" : "", i = e === "whats-new" ? Ut(n, t) : e === "settings" ? zt() : jt();
  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          ${Yt()}
          ${Gt(e)}
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
function ke(e, n) {
  _ = n, e.classList.toggle("is-reordering-apps", n);
}
async function Vn(e) {
  const n = [...e.querySelectorAll("[data-holosuite-app]")].map((t) => t.dataset.holosuiteApp ?? "").filter(Boolean);
  await game.settings.set(c, Re, n);
}
const jn = 12;
function Un(e, n, t, o) {
  if (e.length === 0) return 0;
  const i = (p) => Math.hypot(
    n - (p.left + p.width / 2),
    t - (p.top + p.height / 2)
  ), r = Math.min(Math.max(o, 0), e.length - 1), s = i(e[r]);
  let a = r, u = s;
  return e.forEach((p, m) => {
    const h = i(p);
    h < u && (a = m, u = h);
  }), a !== r && u + jn >= s ? r : a;
}
function zn(e, n, t, o) {
  const r = [...e.querySelectorAll("[data-holosuite-app]")].filter((s) => s !== n)[o] ?? null;
  r ? t.nextElementSibling !== r && e.insertBefore(t, r) : t.nextElementSibling && e.append(t);
}
function Yn(e) {
  var t;
  const n = e.querySelector(".holosuite-app-grid");
  n && (ke(e, _), (t = e.querySelector("[data-holosuite-action='reorder-done']")) == null || t.addEventListener("click", (o) => {
    o.preventDefault(), o.stopPropagation(), ke(e, !1);
  }), n.querySelectorAll("[data-holosuite-app]").forEach((o) => {
    let i = null, r = null, s = !1, a = 0, u = 0, p = 0, m = 0, h = null, y = [], f = 0;
    const S = (g) => {
      const v = o.getBoundingClientRect(), R = [...n.querySelectorAll("[data-holosuite-app]")];
      y = R.map((ie) => ie.getBoundingClientRect()), f = Math.max(0, R.indexOf(o)), ke(e, !0), s = !0, He = Date.now() + 700, p = a - v.left, m = u - v.top, h = document.createElement("div"), h.className = "holosuite-app-placeholder", h.style.height = `${v.height}px`, h.setAttribute("aria-hidden", "true"), o.before(h), o.style.height = `${v.height}px`, o.style.left = `${v.left}px`, o.style.top = `${v.top}px`, o.style.width = `${v.width}px`, o.classList.add("is-being-reordered");
      try {
        o.setPointerCapture(g);
      } catch {
      }
    };
    o.addEventListener("pointerdown", (g) => {
      !g.isPrimary || g.button !== 0 || (r = g.pointerId, a = g.clientX, u = g.clientY, _ ? (g.preventDefault(), S(g.pointerId)) : i = window.setTimeout(() => S(g.pointerId), 550));
    }), o.addEventListener("pointermove", (g) => {
      if (g.pointerId !== r) return;
      if (!s) {
        Math.hypot(g.clientX - a, g.clientY - u) > 8 && i !== null && (window.clearTimeout(i), i = null);
        return;
      }
      g.preventDefault(), o.style.left = `${g.clientX - p}px`, o.style.top = `${g.clientY - m}px`;
      const v = n.getBoundingClientRect();
      if (h && g.clientX >= v.left && g.clientX <= v.right && g.clientY >= v.top && g.clientY <= v.bottom) {
        const R = Un(
          y,
          g.clientX,
          g.clientY,
          f
        );
        R !== f && (zn(n, o, h, R), f = R);
      }
    });
    const A = (g) => {
      g.pointerId === r && (i !== null && window.clearTimeout(i), i = null, r = null, s && (g.preventDefault(), s = !1, y = [], h == null || h.replaceWith(o), h = null, o.classList.remove("is-being-reordered"), o.style.removeProperty("height"), o.style.removeProperty("left"), o.style.removeProperty("top"), o.style.removeProperty("width"), He = Date.now() + 450, Vn(n)));
    };
    o.addEventListener("pointerup", A), o.addEventListener("pointercancel", A), o.addEventListener("contextmenu", (g) => {
      _ && g.preventDefault();
    });
  }));
}
let F = null;
function gt(e, n, t, o) {
  var h, y;
  const i = L.get(e);
  if (!i || !ge(i) || !((h = i.contextActions) != null && h.length)) return;
  F == null || F();
  const r = document.createElement("div");
  r.className = "holosuite-app-context-menu", r.setAttribute("role", "menu");
  const s = Xe(i);
  r.setAttribute("aria-label", s), Object.assign(r.style, { position: "fixed", zIndex: "100000", background: "#091923", border: "1px solid #58c8d5", borderRadius: "5px", padding: "5px", minWidth: "200px", boxShadow: "0 8px 30px #0009" });
  const a = new AbortController(), u = () => {
    a.abort(), r.remove(), F = null;
  };
  F = u;
  const p = [{ label: `Open ${s}`, callback: () => Bt(e) }, ...i.contextActions];
  for (const f of p) {
    const S = document.createElement("button");
    S.type = "button", S.setAttribute("role", "menuitem"), S.textContent = f.label, Object.assign(S.style, { display: "block", width: "100%", textAlign: "left", color: "#d8faff", background: "#102c38", border: "1px solid #315967", padding: "8px 12px", margin: "3px 0" }), S.addEventListener("click", async () => {
      var A, g;
      if (u(), n.focus(), !!ge(i))
        try {
          await f.callback();
        } catch (v) {
          console.error(`${c} | App action failed`, v), (g = (A = ui.notifications) == null ? void 0 : A.error) == null || g.call(A, `Could not complete ${f.label}.`);
        }
    }), r.appendChild(S);
  }
  document.body.appendChild(r);
  const m = r.getBoundingClientRect();
  r.style.left = `${Math.max(4, Math.min(t, window.innerWidth - m.width - 4))}px`, r.style.top = `${Math.max(4, Math.min(o, window.innerHeight - m.height - 4))}px`, (y = r.querySelector("button")) == null || y.focus(), document.addEventListener("pointerdown", (f) => {
    r.contains(f.target) || u();
  }, { capture: !0, signal: a.signal }), document.addEventListener("keydown", (f) => {
    var S;
    if (f.key === "Escape")
      f.preventDefault(), f.stopPropagation(), u(), n.focus();
    else if (f.key === "Tab") u();
    else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(f.key)) {
      f.preventDefault(), f.stopPropagation();
      const A = Array.from(r.querySelectorAll("button")), g = A.indexOf(document.activeElement), v = f.key === "Home" ? 0 : f.key === "End" ? A.length - 1 : (g + (f.key === "ArrowDown" ? 1 : -1) + A.length) % A.length;
      (S = A[v]) == null || S.focus();
    }
  }, { capture: !0, signal: a.signal });
}
function Ie(e) {
  var n;
  e && (he(e), F == null || F(), e.querySelectorAll("[data-holosuite-app]").forEach((t) => {
    var i, r;
    const o = t.dataset.holosuiteApp ?? "";
    (r = (i = L.get(o)) == null ? void 0 : i.contextActions) != null && r.length && (t.setAttribute("aria-haspopup", "menu"), t.title = `${Xe(L.get(o))} — Right-click for options`, t.addEventListener("contextmenu", (s) => {
      if (_) return;
      s.preventDefault(), s.stopPropagation();
      const a = t.getBoundingClientRect();
      gt(o, t, s.clientX || a.left, s.clientY || a.bottom);
    }), t.addEventListener("keydown", (s) => {
      if (s.key !== "ContextMenu" && !(s.shiftKey && s.key === "F10") || _) return;
      s.preventDefault(), s.stopPropagation();
      const a = t.getBoundingClientRect();
      gt(o, t, a.left, a.bottom);
    })), t.addEventListener("click", (s) => {
      if (_ || Date.now() < He) {
        s.preventDefault(), s.stopPropagation();
        return;
      }
      Bt(s.currentTarget.dataset.holosuiteApp ?? "");
    });
  }), e.querySelectorAll("[data-holosuite-action='whats-new']").forEach((t) => {
    t.addEventListener("click", (o) => {
      o.preventDefault(), o.stopPropagation(), l == null || l.showWhatsNew();
    });
  }), e.querySelectorAll("[data-holosuite-action='apps']").forEach((t) => {
    t.addEventListener("click", (o) => {
      o.preventDefault(), o.stopPropagation(), l == null || l.showApps();
    });
  }), e.querySelectorAll("[data-holosuite-action='settings']").forEach((t) => {
    t.addEventListener("click", (o) => {
      o.preventDefault(), o.stopPropagation(), l == null || l.showSettings();
    });
  }), (n = e.querySelector("[data-holosuite-action='branding']")) == null || n.addEventListener("click", () => Kt()), e.querySelectorAll("[data-holosuite-device-style]").forEach((t) => {
    t.addEventListener("click", (o) => {
      const i = o.currentTarget.dataset.holosuiteDeviceStyle;
      l == null || l.setDeviceStyle(Ve(i));
    });
  }), e.querySelectorAll("[data-holosuite-form-factor-choice]").forEach((t) => {
    t.addEventListener("click", (o) => {
      o.currentTarget.dataset.holosuiteFormFactorChoice, l == null || l.setFormFactor(Ue());
    });
  }), e.querySelectorAll("[data-holosuite-filter]").forEach((t) => {
    t.addEventListener("click", (o) => {
      const i = o.currentTarget.dataset.holosuiteFilter;
      l == null || l.setWhatsNewFilter(Xn(i));
    });
  }), e.querySelectorAll("[data-holosuite-whats-new-tab]").forEach((t) => {
    t.addEventListener("click", (o) => {
      const i = o.currentTarget.dataset.holosuiteWhatsNewTab;
      l == null || l.setWhatsNewTab(Jn(i));
    });
  }), e.querySelectorAll("[data-holosuite-action='close']").forEach((t) => {
    t.addEventListener("pointerdown", mt, { capture: !0 }), t.addEventListener("click", mt, { capture: !0 });
  }), Yn(e));
}
function Xn(e) {
  const n = String(e ?? "");
  return n === "free" || n === "premium" || n === "installed" ? n : "all";
}
function Jn(e) {
  return String(e ?? "") === "releases" ? "releases" : "updates";
}
function mt(e) {
  var n;
  e.preventDefault(), e.stopPropagation(), (n = e.stopImmediatePropagation) == null || n.call(e), $e();
}
async function $e() {
  var o, i;
  if (F == null || F(), ae) return;
  ae = !0;
  const e = l, n = e ? C(e.element) : document.querySelector("#holosuite-launcher"), t = ((o = n == null ? void 0 : n.closest) == null ? void 0 : o.call(n, "#holosuite-launcher, .holosuite-launcher-window")) ?? n;
  l = null, W = null;
  try {
    await ((i = e == null ? void 0 : e.close) == null ? void 0 : i.call(e, { force: !0 }));
  } catch (r) {
    console.warn(`${c} | Foundry did not close the launcher cleanly; removing stale launcher element.`, r);
  } finally {
    ae = !1;
  }
  window.setTimeout(() => {
    t != null && t.isConnected && t.remove(), l || It();
  }, 0);
}
function Kn() {
  var t;
  const e = game.modules;
  return M((e == null ? void 0 : e.contents) ?? Array.from(((t = e == null ? void 0 : e.values) == null ? void 0 : t.call(e)) ?? [])).filter((o) => (o == null ? void 0 : o.active) === !0).map((o) => ({
    id: String(o.id ?? ""),
    title: String(o.title ?? o.id ?? ""),
    version: String(o.version ?? "")
  })).sort((o, i) => o.id.localeCompare(i.id));
}
function Zn() {
  const e = Array.from(
    document.querySelectorAll(`link[${te}]`)
  );
  return De.map((n) => {
    const t = e.find((o) => o.getAttribute(te) === n) ?? null;
    return {
      path: n,
      present: t !== null,
      loaded: (t == null ? void 0 : t.sheet) != null,
      href: (t == null ? void 0 : t.href) ?? null
    };
  });
}
function Qn() {
  var t;
  const e = game.messages, n = Number((e == null ? void 0 : e.size) ?? ((t = e == null ? void 0 : e.contents) == null ? void 0 : t.length) ?? 0);
  return Number.isFinite(n) ? n : 0;
}
function Je() {
  var a, u, p;
  const e = E(c, be) === !0, n = k(), t = E(c, we) === !0, o = Zn(), i = Kn(), r = game.release, s = game.system;
  return {
    schemaVersion: 1,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    core: {
      version: String(((a = game.modules.get(c)) == null ? void 0 : a.version) ?? ""),
      diagnosticModeActive: n || e || t,
      apiOnly: n,
      cssDisabled: e,
      visualEffectsDisabled: t,
      stylesheets: o,
      launcherOpen: Oe(l) || Ge(),
      registeredApps: [...L.values()].map((m) => ({
        id: m.id,
        title: m.title,
        premium: m.premium === !0,
        playerVisible: m.playerVisible !== !1
      })),
      registeredWhatsNewModules: [...V.keys()].sort(),
      deviceStyle: {
        effective: Ot(),
        client: je(),
        forced: ve()
      },
      formFactor: ze(),
      appOrder: xt(),
      colorTheme: Ft(E(c, Be))
    },
    foundry: {
      version: String((r == null ? void 0 : r.version) ?? game.version ?? ""),
      generation: Number((r == null ? void 0 : r.generation) ?? 0) || null,
      build: Number((r == null ? void 0 : r.build) ?? 0) || null,
      systemId: String((s == null ? void 0 : s.id) ?? ""),
      systemVersion: String((s == null ? void 0 : s.version) ?? ""),
      worldId: String(((u = game.world) == null ? void 0 : u.id) ?? ""),
      isGM: ((p = game.user) == null ? void 0 : p.isGM) === !0
    },
    workload: {
      chatMessages: Qn(),
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
function Xt() {
  return JSON.stringify(Je(), null, 2);
}
async function eo() {
  var n, t, o, i, r, s;
  const e = Xt();
  try {
    if ((n = navigator.clipboard) != null && n.writeText)
      await navigator.clipboard.writeText(e);
    else if ((t = game.clipboard) != null && t.copyPlainText)
      await game.clipboard.copyPlainText(e);
    else
      throw new Error("No clipboard API is available.");
    (i = (o = ui.notifications) == null ? void 0 : o.info) == null || i.call(o, "HoloSuite Core diagnostics copied to the clipboard.");
  } catch (a) {
    console.warn(`${c} | Could not copy diagnostics.`, a), (s = (r = ui.notifications) == null ? void 0 : r.error) == null || s.call(r, "Could not copy diagnostics. Use Download JSON instead.");
  }
}
function to() {
  const e = new Blob([Xt()], { type: "application/json" }), n = URL.createObjectURL(e), t = document.createElement("a"), o = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  t.href = n, t.download = `holosuite-core-diagnostics-${o}.json`, t.click(), window.setTimeout(() => URL.revokeObjectURL(n), 0);
}
function pt() {
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
function bt(e, n) {
  var t, o, i;
  e && ((t = e.querySelector("[data-action='refresh']")) == null || t.addEventListener("click", () => n.render(!1)), (o = e.querySelector("[data-action='copy']")) == null || o.addEventListener("click", () => void eo()), (i = e.querySelector("[data-action='download']")) == null || i.addEventListener("click", to));
}
class Jt extends ye {
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
  activateListeners(n) {
    super.activateListeners(n), bt(C(n), this);
  }
  async _renderHTML() {
    const n = document.createElement("template");
    return n.innerHTML = pt().trim(), n.content;
  }
  _replaceHTML(n, t) {
    const o = C(t), i = (o == null ? void 0 : o.querySelector(".window-content")) ?? o;
    if (!i) return;
    const r = n instanceof DocumentFragment || n instanceof HTMLElement ? n : C(n);
    r ? i.replaceChildren(r) : i.innerHTML = String(n ?? ""), bt(i, this);
  }
  async _updateObject() {
  }
}
P(Jt, "DEFAULT_OPTIONS", {
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
function Kt(e) {
  var n, t, o, i;
  return (n = game.user) != null && n.isGM ? (Le ?? (Le = new Ke()), typeof e == "string" && Le.selectTarget(e), Le.render(ye === ((i = (o = (t = globalThis.foundry) == null ? void 0 : t.applications) == null ? void 0 : o.api) == null ? void 0 : i.ApplicationV2) ? { force: !0 } : !0)) : null;
}
class Ke extends ye {
  constructor() {
    super(...arguments);
    P(this, "selected", N);
    P(this, "drafts", /* @__PURE__ */ new Map());
    P(this, "saving", !1);
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
    const t = fn();
    return `<section class="holosuite-branding-editor">
      <p>Choose a device or app. Blank fields use its defaults. Changes apply to this world.</p>
      <label>Branding for <select data-branding-select>
        <option value="${N}">HoloSuite device</option>
        <optgroup label="Apps">${t.map((o) => `<option value="${d(o.id)}">${d(o.title)}</option>`).join("")}</optgroup>
      </select></label>
      ${L.size ? '<details class="holosuite-branding-apps"><summary>Browse app tiles</summary><div class="holosuite-branding-grid" data-branding-grid></div></details>' : ""}
      <div data-branding-fields></div>
    </section>`;
  }
  bind(t) {
    var s;
    const o = t != null && t.matches(".holosuite-branding-editor") ? t : t == null ? void 0 : t.querySelector(".holosuite-branding-editor");
    if (!o || !((s = game.user) != null && s.isGM)) return;
    const i = o.querySelector("[data-branding-select]"), r = o.querySelector("[data-branding-fields]");
    !L.has(this.selected) && !ue.has(this.selected) && (this.selected = N), i.value = this.selected, i.addEventListener("change", () => {
      this.selected = i.value, this.renderFields(r), this.renderGrid(o);
    }), this.renderFields(r), this.renderGrid(o);
  }
  renderGrid(t) {
    const o = t.querySelector("[data-branding-grid]");
    if (!o) return;
    const i = t.querySelector("[data-branding-select]"), r = [...L.values()].sort((s, a) => s.title.localeCompare(a.title));
    o.innerHTML = r.map((s) => `<button type="button" class="holosuite-app-tile" data-holosuite-app="${d(s.id)}"
      aria-pressed="${s.id === this.selected}">${Vt(s, T(s.id), !1)}</button>`).join(""), o.querySelectorAll("[data-holosuite-app]").forEach((s) => {
      s.addEventListener("click", () => {
        var a;
        i.value = s.dataset.holosuiteApp, i.dispatchEvent(new Event("change")), (a = t.querySelector('[name="name"]')) == null || a.focus();
      });
    }), he(o);
  }
  renderFields(t) {
    var ie, Ze, Qe, et, tt;
    const o = this.selected, i = L.get(o) ?? ue.get(o), r = L.has(o), s = (i == null ? void 0 : i.brandingInApp) === !0, a = this.drafts.get(o) ?? T(o), u = (w, b, I = "", D = 100, x = a[w], H = "") => `<label>${d(b)}${H ? `<small>${d(H)}</small>` : ""}<input name="${d(w)}" maxlength="${D}" value="${d(x)}" placeholder="${d(I)}"></label>`, p = (w, b) => `
      <fieldset class="holosuite-branding-asset" ${w === "iconImage" ? "data-custom-icon-image" : ""}>${u(w, b, "PNG or WebP", 2048)}
        <button type="button" data-branding-pick="${w}" aria-label="Browse or upload ${d(b)}"><i class="fa-solid fa-folder-open" aria-hidden="true"></i> Browse / Upload</button>
      </fieldset>`, m = this.drafts.has(o) ? a.icon : a.iconImage ? "custom" : a.icon, h = (w, b, I = a[w]) => `<label>${b}<select name="${w}"><option value="">Use default</option>${Object.entries(wt).map(([D, x]) => `<option value="${D}" ${I === D ? "selected" : ""}>${x}</option>`).join("")}
        ${w === "icon" ? `<option value="custom" ${I === "custom" ? "selected" : ""}>Custom image</option>` : ""}</select></label>`, y = Object.entries(((ie = i == null ? void 0 : i.brandingHeader) == null ? void 0 : ie.textFields) ?? {});
    t.innerHTML = `<form class="holosuite-branding-form">
      ${u("name", i ? "Display name" : "Device name", (i == null ? void 0 : i.title) || "HoloSuite")}
      ${r && i ? u(
      "label",
      "Launcher tile label (optional)",
      At(i.title),
      48,
      a.label,
      "Only shown on the HoloSuite launcher tile. Leave blank to use the display name."
    ) : ""}
      ${h("icon", i ? "App icon" : "Launcher icon", m ?? "")}
      ${p("iconImage", s ? "App icon image" : i ? "Tile icon image" : "Launcher icon image")}
      ${!i || (Ze = i.brandingHeader) != null && Ze.taglineLabel || y.length ? `<details><summary>Advanced branding</summary>
        ${!i || (Qe = i.brandingHeader) != null && Qe.taglineLabel ? p("logo", i ? "Header logo" : "Device logo") : ""}
        ${y.map(([w, b]) => {
      var H;
      const { label: I, hint: D, placeholder: x } = typeof b == "string" ? { label: b } : b;
      return u(`text.${w}`, I, x, 160, (H = a.text) == null ? void 0 : H[w], D);
    }).join("")}
        ${i ? `${(et = i.brandingHeader) != null && et.taglineLabel ? u("tagline", i.brandingHeader.taglineLabel, "", 160) : ""}` : `
          ${u("gmTitle", "GM window title", "HoloSuite Command Deck")}
          ${u("gmHeading", "GM home header", "GM Command Deck", 60)}
          ${u("gmScreen", "GM home title", "Apps", 48)}
          ${u("playerTitle", "Player window title", "HoloSuite Player View")}
          ${u("playerHeading", "Player home header", "Player Link", 60)}
          ${u("playerScreen", "Player home title", "Commlink", 48)}
          ${u("userLabel", "Player name label", "Active User", 48)}
          ${u("linkStatus", "Player connection label", "LINK STABLE", 48)}
          ${h("backIcon", "Back to apps icon")}${h("settingsIcon", "Settings icon")}
          ${h("updatesIcon", "What’s New icon")}${h("closeIcon", "Close icon")}`}
      </details>` : ""}
      <footer><button type="button" data-branding-reset>Reset fields</button><button type="submit"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Save branding</button></footer>
    </form>`;
    const f = t.querySelector("form"), S = f.elements.namedItem("icon"), A = f.querySelector("[data-custom-icon-image]"), g = f.elements.namedItem("iconImage"), v = (w = !1) => {
      const b = Object.fromEntries(new FormData(f));
      (w || S.value === "custom") && (b.iconImage = g.value);
      const I = Object.fromEntries(y.map(([D]) => [D, b[`text.${D}`]]));
      return { ...b, text: I };
    }, R = () => {
      A.disabled = S.value !== "custom", this.drafts.set(o, v(!0));
    };
    f.addEventListener("input", R), (tt = f.querySelector("[data-branding-reset]")) == null || tt.addEventListener("click", () => {
      this.drafts.set(o, {}), this.renderFields(t);
    }), f.querySelectorAll("[data-branding-pick]").forEach((w) => {
      w.addEventListener("click", () => {
        var D, x, H, j, J, U, K, B, Z;
        const b = f.elements.namedItem(w.dataset.brandingPick), I = ((j = (H = (x = (D = globalThis.foundry) == null ? void 0 : D.applications) == null ? void 0 : x.apps) == null ? void 0 : H.FilePicker) == null ? void 0 : j.implementation) ?? ((K = (U = (J = globalThis.foundry) == null ? void 0 : J.applications) == null ? void 0 : U.apps) == null ? void 0 : K.FilePicker) ?? globalThis.FilePicker;
        if (!I) return (Z = (B = ui.notifications) == null ? void 0 : B.warn) == null ? void 0 : Z.call(B, "Foundry’s file picker is unavailable.");
        new I({ type: "image", current: b.value, callback: (O) => {
          var re, nt;
          if (!le(O)) return (nt = (re = ui.notifications) == null ? void 0 : re.warn) == null ? void 0 : nt.call(re, "Choose a PNG or WebP image.");
          !f.isConnected || b.matches(":disabled") || (b.value = O, R());
        } }).browse();
      });
    }), f.addEventListener("submit", async (w) => {
      var H, j, J, U, K, B, Z;
      if (w.preventDefault(), w.stopPropagation(), this.saving || !((H = game.user) != null && H.isGM)) return;
      const b = v();
      if ([b.iconImage, b.logo].some((O) => typeof O == "string" && O.trim() && !le(O))) {
        (J = (j = ui.notifications) == null ? void 0 : j.warn) == null || J.call(j, "Use a valid PNG or WebP image for branding.");
        return;
      }
      const I = { ...E(c, z) }, D = ce(b), x = this.drafts.get(o);
      Object.keys(D).length ? Object.defineProperty(I, o, { value: D, enumerable: !0, configurable: !0 }) : delete I[o], this.saving = !0;
      try {
        await game.settings.set(c, z, I), this.drafts.get(o) === x && this.drafts.delete(o);
        const O = t.closest(".holosuite-branding-editor");
        O && this.renderGrid(O), (K = (U = ui.notifications) == null ? void 0 : U.info) == null || K.call(U, "HoloSuite branding saved.");
      } catch (O) {
        console.error(`${c} | Branding could not be saved.`, O), (Z = (B = ui.notifications) == null ? void 0 : B.error) == null || Z.call(B, "HoloSuite branding could not be saved. Try again.");
      } finally {
        this.saving = !1;
      }
    }), A.disabled = S.value !== "custom";
  }
  async _renderInner() {
    return $(this.renderEditor());
  }
  activateListeners(t) {
    this.bind(C(t));
  }
  async _renderHTML() {
    const t = document.createElement("template");
    return t.innerHTML = this.renderEditor(), t.content;
  }
  _replaceHTML(t, o) {
    const i = C(o);
    i && (i.replaceChildren(t), this.bind(i));
  }
  async _updateObject() {
  }
}
P(Ke, "DEFAULT_OPTIONS", {
  id: "holosuite-branding",
  tag: "section",
  classes: ["holosuite-branding-window"],
  window: { title: "HoloSuite Branding", resizable: !0 },
  position: { width: 660, height: "auto" }
});
class me extends ye {
  constructor() {
    super(...arguments);
    P(this, "currentView", "apps");
    P(this, "whatsNewFilter", "all");
    P(this, "whatsNewTab", "releases");
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
    return k() ? ((i = (o = ui.notifications) == null ? void 0 : o.warn) == null || i.call(o, "HoloSuite Core is in API-only diagnostic mode on this browser."), this) : super.render(...t);
  }
  async _renderInner() {
    return $(ft(this.currentView, this.whatsNewFilter, this.whatsNewTab));
  }
  activateListeners(t) {
    super.activateListeners(t), Ie(C(t)), this.resizeForFormFactor();
  }
  async _renderHTML() {
    const t = document.createElement("template");
    return t.innerHTML = ft(this.currentView, this.whatsNewFilter, this.whatsNewTab).trim(), t.content;
  }
  _replaceHTML(t, o) {
    const i = this.getRenderTarget(o);
    if (!i) return;
    const r = t instanceof DocumentFragment || t instanceof HTMLElement ? t : C(t);
    r ? i.replaceChildren(r) : i.innerHTML = String(t ?? ""), Ie(i), this.resizeForFormFactor();
  }
  async close(t = {}) {
    return _ = !1, l = null, super.close(t);
  }
  getLauncherRoot(t = {}) {
    var r;
    const o = C(this.element), i = (o == null ? void 0 : o.querySelector(".holosuite-phone")) ?? ((r = o == null ? void 0 : o.closest) == null ? void 0 : r.call(o, ".holosuite-phone")) ?? null;
    return i != null && i.isConnected ? i : t.includeDocumentFallback === !1 ? null : document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone");
  }
  getRenderTarget(t) {
    const o = C(t);
    return o ? o.querySelector(".window-content") ?? o.querySelector(".holosuite-launcher-window .window-content") ?? o : null;
  }
  updateRenderedView() {
    var a;
    const t = this.getLauncherRoot();
    if (!t) return !1;
    const o = t.querySelector(".holosuite-status-bar"), i = t.querySelector(".holosuite-screen");
    if (!o || !i) return !1;
    o.innerHTML = `
      ${Yt()}
      ${Gt(this.currentView)}
    `;
    const r = t.querySelector("[data-holosuite-action='close']");
    r && (r.innerHTML = G({ icon: T(N).closeIcon }, "fa-solid fa-circle-xmark"));
    const s = (a = t.closest(".holosuite-launcher-window")) == null ? void 0 : a.querySelector(".window-title");
    return s && (s.textContent = this.title), i.innerHTML = this.currentView === "whats-new" ? Ut(this.whatsNewFilter, this.whatsNewTab) : this.currentView === "settings" ? zt() : jt(), i.classList.toggle("holosuite-screen--whats-new", this.currentView === "whats-new"), i.classList.toggle("holosuite-screen--settings", this.currentView === "settings"), Ie(t), !0;
  }
  showApps() {
    this.currentView = "apps", this.updateRenderedView() || this.render(!1);
  }
  showWhatsNew() {
    _ = !1, this.currentView = "whats-new", Sn(), this.updateRenderedView() || this.render(!1);
  }
  showSettings() {
    _ = !1, this.currentView = "settings", this.updateRenderedView() || this.render(!1);
  }
  async setDeviceStyle(t) {
    ve() || (await game.settings.set(c, Me, t), this.currentView = "settings", fe(), this.refreshCurrentView());
  }
  async setFormFactor(t) {
    await game.settings.set(c, _e, t), this.currentView = "settings", Ye(), this.resizeForFormFactor(), this.refreshCurrentView();
  }
  resizeForFormFactor() {
    var i, r;
    const t = Hn(), o = ((i = C(this.element)) == null ? void 0 : i.closest("#holosuite-launcher, .holosuite-launcher-window")) ?? C(this.element);
    o == null || o.style.setProperty("--hs-launcher-width", `${t.width}px`), o == null || o.style.setProperty("--hs-launcher-height", `${t.height}px`), o == null || o.style.setProperty("width", `${t.width}px`, "important"), o == null || o.style.setProperty("height", `${t.height}px`, "important");
    try {
      (r = this.setPosition) == null || r.call(this, t);
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
P(me, "DEFAULT_OPTIONS", {
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
    const n = ht({ ...e, brandingInApp: !0, open: () => {
    } });
    n && ue.set(n.id, n);
  },
  registerApp(e) {
    const n = ht(e);
    return n ? (L.set(n.id, n), k() || l == null || l.render(!1), n) : null;
  },
  unregisterApp(e) {
    const n = L.delete(String(e ?? ""));
    return n && !k() && (l == null || l.render(!1)), n;
  },
  getApps() {
    return [...L.values()];
  },
  getBranding: T,
  hasBrandingMigration(e) {
    const n = E(c, z);
    return (n == null ? void 0 : n[`migration:${e}`]) === !0;
  },
  async migrateBranding(e, n) {
    var r;
    if (!((r = game.user) != null && r.isGM) || this.hasBrandingMigration(e)) return;
    const t = { ...E(c, z) }, o = T(e), i = ce(n);
    t[e] = ce({ ...o, ...i, text: { ...o.text, ...i.text } }), t[`migration:${e}`] = !0, await game.settings.set(c, z, t);
  },
  openBranding: Kt,
  getDiagnostics() {
    return Je();
  },
  registerWhatsNew(e) {
    return Wt(e);
  },
  unregisterWhatsNew(e) {
    const n = V.delete(String(e ?? ""));
    return n && !k() && (l == null || l.render(!1)), n;
  },
  getWhatsNew() {
    return [...V.values()].sort(qe);
  },
  async openLauncher() {
    var e, n;
    return k() ? ((n = (e = ui.notifications) == null ? void 0 : e.warn) == null || n.call(e, "HoloSuite Core is in API-only diagnostic mode on this browser."), null) : W || (W = (async () => {
      Oe(l) || (l = null), l || (l = new me());
      try {
        await l.render(!0);
      } catch (t) {
        console.warn(`${c} | Recreating launcher after render failure.`, t), l = new me(), await l.render(!0);
      }
      return $n(l), l;
    })().finally(() => {
      W = null;
    }), W);
  },
  async toggleLauncher() {
    return W || (Oe(l) ? (await $e(), null) : (Ge() && It(), Tn(), q.openLauncher()));
  }
};
function Zt() {
  const e = game.modules.get(c);
  if (game.holosuite = q, globalThis.HoloSuiteCoreApi = q, e)
    try {
      e.api = q;
    } catch (n) {
      console.warn(`${c} | Could not attach API to game.modules; using game.holosuite fallback.`, n);
    }
  Hooks.callAll(`${c}.apiReady`, q);
}
Hooks.once("init", () => {
  _t(), In(), Nt(), Ht(), Nn(), Zt();
});
Hooks.on("getSceneControlButtons", vn);
Hooks.on("renderSceneControls", (e, n) => An(n));
Hooks.on("renderSidebar", Se);
Hooks.on("renderSidebarTab", Se);
Hooks.on("renderSettingsConfig", kn);
for (const e of ["renderApplication", "renderApplicationV1", "renderApplicationV2"])
  Hooks.on(e, (n, t) => {
    const o = C(n.element) ?? C(t);
    o && Pe(o, T);
  });
Hooks.on("holosuite-core.renderBranding", (e) => Pe(e, T));
Hooks.once("ready", () => {
  de = !0, Zt(), _t(), fe(), xn(), Ye(), k() ? console.warn(`${c} | API-only diagnostic mode is enabled on this browser.`) : (Se(), qt()), console.log(`${c} | Ready. API available at game.modules.get("${c}").api`);
});
