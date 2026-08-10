var we = Object.defineProperty;
var pe = (e, t, n) => t in e ? we(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var y = (e, t, n) => pe(e, typeof t != "symbol" ? t + "" : t, n);
function T(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function q(e, t) {
  return T(e) ? t.includes(String(e.name ?? "")) : !1;
}
function j(e) {
  if (!T(e) || !("tools" in e)) return !1;
  const t = String(e.name ?? "");
  return !["measure", "templates", "walls", "lighting", "sounds", "notes", "tiles", "drawings"].includes(t);
}
function be(e, t, n) {
  if (Array.isArray(e))
    return e.find((s) => q(s, t)) ?? (n ? e.find(j) : null) ?? null;
  if (!T(e)) return null;
  for (const s of t)
    if (T(e[s])) return e[s];
  return Object.values(e).find((s) => q(s, t)) ?? (n ? Object.values(e).find(j) : null) ?? null;
}
function Se(e) {
  const t = Object.values(e).map((n) => Number(n == null ? void 0 : n.order)).filter(Number.isFinite);
  return t.length ? Math.max(...t) + 1 : Object.keys(e).length;
}
function z(e, t, n = ["tokens", "token"], s = {}) {
  const o = be(e, n, s.allowFallback === !0);
  if (!o) return !1;
  const i = o.tools;
  return Array.isArray(i) ? i.some((u) => (u == null ? void 0 : u.name) === t.name) ? !1 : (i.push(t), !0) : !T(i) || i[t.name] ? !1 : (i[t.name] = { ...t, order: t.order ?? Se(i) }, !0);
}
const l = "holosuite-core", J = "disableForPlayers", V = "deviceStyle", Q = "forceDeviceStyle", X = "theme", O = "whatsNewLastSeen", ye = "openLauncher", U = "data-holosuite-foundry-generation", ve = `modules/${l}/data/whats-new.json`, Te = Date.UTC(2026, 7, 1), L = {
  base: "Base",
  "space-police": "Space Police"
}, $e = {
  "": "Allow User Choice",
  base: "Base",
  "space-police": "Space Police"
}, Z = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
}, v = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
let r = null, d = null, C = !1, ee = 0;
function Le() {
  var n, s, o, i, u, h;
  const e = ((s = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : s.api) ?? ((o = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : o.api) ?? null, t = ((u = (i = globalThis.foundry) == null ? void 0 : i.applications) == null ? void 0 : u.api) ?? ((h = foundry == null ? void 0 : foundry.applications) == null ? void 0 : h.api) ?? null;
  return globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV2);
}
const Ne = Le();
function x(e) {
  return e ? !!e.getLauncherRoot({ includeDocumentFallback: !1 }) : !1;
}
function a(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function N(e, t, n = `${t}s`) {
  return `${e} ${e === 1 ? t : n}`;
}
function S(e, t) {
  try {
    return game.settings.get(e, t);
  } catch {
    return null;
  }
}
function I(e) {
  var t;
  return ((t = game.modules.get(e)) == null ? void 0 : t.api) ?? null;
}
function Ce() {
  var e, t, n;
  return String(((t = (e = game.user) == null ? void 0 : e.character) == null ? void 0 : t.name) ?? ((n = game.user) == null ? void 0 : n.name) ?? "Player");
}
function Ee(e) {
  var t, n, s, o, i, u;
  if (e === "cybercall") {
    const h = f(S("cybercall", "contacts")), c = f(S("cybercall", "groupContacts"));
    return N(h.length + c.length, "link");
  }
  if (e === "bounty-board") {
    const h = f((n = (t = I("bounty-board")) == null ? void 0 : t.getAllBounties) == null ? void 0 : n.call(t, { includeHidden: !1 }));
    return N(h.length, "contract");
  }
  if (e === "csi-toolkit") {
    const h = Object.values(((o = (s = I("csi-toolkit")) == null ? void 0 : s.getCases) == null ? void 0 : o.call(s)) ?? {}).filter((c) => (c == null ? void 0 : c.visibility) !== "gm");
    return N(h.length, "case");
  }
  if (e === "galaxy-map") {
    const h = f((u = (i = I("galaxy-map")) == null ? void 0 : i.getMaps) == null ? void 0 : u.call(i)).filter((c) => (c == null ? void 0 : c.visibility) === "players");
    return N(h.length, "chart");
  }
  return "";
}
function f(e) {
  return Array.isArray(e) ? e : [];
}
function He(e) {
  const t = String((e == null ? void 0 : e.title) ?? "").trim();
  if (!t) return null;
  const n = f(e == null ? void 0 : e.tags).map((s) => String(s ?? "").trim()).filter(Boolean).slice(0, 4);
  return {
    title: t,
    summary: String((e == null ? void 0 : e.summary) ?? "").trim(),
    tags: n
  };
}
function te(e) {
  const t = String((e == null ? void 0 : e.moduleId) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), s = f(e == null ? void 0 : e.entries).map((i) => He(i)).filter((i) => !!i);
  if (!t || !n || s.length === 0)
    return console.warn(`${l} | Ignoring invalid what's new registration.`, e), null;
  const o = String((e == null ? void 0 : e.tier) ?? "free").toLowerCase() === "premium" ? "premium" : "free";
  return {
    moduleId: t,
    title: n,
    tier: o,
    version: String((e == null ? void 0 : e.version) ?? "").trim(),
    updated: String((e == null ? void 0 : e.updated) ?? "").trim(),
    icon: String((e == null ? void 0 : e.icon) ?? "").trim(),
    url: String((e == null ? void 0 : e.url) ?? "").trim(),
    entries: s
  };
}
function E(e) {
  const t = Date.parse(String(e.updated ?? ""));
  return Number.isFinite(t) ? t : 0;
}
function F(e, t) {
  return E(t) - E(e) || e.title.localeCompare(t.title);
}
function _(e) {
  var t, n;
  return ((n = (t = game.modules) == null ? void 0 : t.has) == null ? void 0 : n.call(t, e)) === !0;
}
function ke() {
  const e = Number(S(l, O));
  return Number.isFinite(e) ? e : 0;
}
function Ae() {
  const e = ke();
  return [...m.values(), ...b.values()].filter((t) => E(t) > e).reduce((t, n) => t + n.entries.length, 0);
}
function We() {
  try {
    game.settings.set(l, O, Date.now());
  } catch (e) {
    console.warn(`${l} | Could not update what's new read state.`, e);
  }
}
function Ie(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), s = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !t || !n || !s || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${l} | Ignoring invalid app registration.`, e), null) : {
    id: t,
    title: n,
    icon: s,
    premium: e.premium === !0,
    playerVisible: e.playerVisible !== !1,
    description: String(e.description ?? "").trim(),
    featureId: String(e.featureId ?? t).trim() || t,
    open: e.open
  };
}
function De(e) {
  var o;
  const t = ((o = game.user) == null ? void 0 : o.isGM) === !0;
  if (!t && A()) return;
  const n = () => ({
    name: "holosuite-core-launcher",
    title: t ? "HoloSuite Command Deck" : "HoloSuite Player View",
    icon: le(),
    button: !0,
    visible: !0,
    onClick: se,
    onChange: Pe
  }), s = z(e, n(), ["tiles", "tile"]);
  z(e, n(), ["tokens", "token"], { allowFallback: !s });
}
function Ve() {
  var e;
  return ((e = game.user) == null ? void 0 : e.isGM) === !0 || !A();
}
function M() {
  document.querySelectorAll(".holosuite-sidebar-launcher, .holosuite-floating-launcher").forEach((e) => e.remove());
}
function w(e) {
  var s;
  if (e instanceof HTMLElement) return e;
  if (Array.isArray(e) && e[0] instanceof HTMLElement) return e[0];
  const t = e, n = ((s = t == null ? void 0 : t.get) == null ? void 0 : s.call(t, 0)) ?? (t == null ? void 0 : t[0]);
  return n instanceof HTMLElement ? n : null;
}
function Oe(e) {
  var i;
  const t = new Set(document.querySelectorAll("#holosuite-launcher, .holosuite-launcher-window"));
  if (t.size <= 1) return;
  const n = e ? w(e.element) : null, o = ((i = n == null ? void 0 : n.closest) == null ? void 0 : i.call(n, "#holosuite-launcher, .holosuite-launcher-window")) ?? [...t].at(-1) ?? null;
  for (const u of t)
    u !== o && u.remove();
}
function ne() {
  document.querySelectorAll("#holosuite-launcher, .holosuite-launcher-window").forEach((e) => {
    e.remove();
  });
}
function Fe() {
  return document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone") !== null;
}
function _e() {
  r = null, d = null, C = !1;
}
function Me(e) {
  const t = e.find((n) => typeof n == "boolean");
  return typeof t == "boolean" ? t : null;
}
function se() {
  return ee = Date.now(), g.toggleLauncher();
}
function Pe(...e) {
  const t = Me(e);
  return t === !1 ? (B(), null) : t === null && Date.now() - ee < 100 ? null : g.openLauncher();
}
function Re(e) {
  var i;
  const t = ((i = game.user) == null ? void 0 : i.isGM) === !0;
  if (!t && A()) return;
  const n = w(e) ?? document.querySelector("#controls, #scene-controls");
  if (!n || n.querySelector("[data-tool='holosuite-core-launcher']")) return;
  const s = n.querySelector(
    ".control-tools.active, .sub-controls.active, .scene-control-tools.active, .control-tools, .sub-controls, .scene-control-tools"
  );
  if (!s) return;
  const o = document.createElement("li");
  o.className = "control-tool holosuite-scene-control", o.dataset.tool = "holosuite-core-launcher", o.title = t ? "HoloSuite Command Deck" : "HoloSuite Player View", o.innerHTML = `<i class="${le()}"></i>`, o.addEventListener("click", (u) => {
    u.preventDefault(), u.stopPropagation(), se();
  }), s.appendChild(o);
}
function Be() {
  game.settings.register(l, V, {
    name: "HoloSuite Theme",
    hint: "Choose the HoloSuite launcher theme for this user.",
    scope: "client",
    config: !0,
    type: String,
    choices: L,
    default: "base",
    restricted: !1,
    onChange: () => {
      H(), r == null || r.refreshCurrentView();
    }
  }), game.settings.register(l, Q, {
    name: "Force HoloSuite Theme",
    hint: "When set, every user sees this HoloSuite launcher theme instead of their personal choice.",
    scope: "world",
    config: !0,
    type: String,
    choices: $e,
    default: "",
    restricted: !0,
    onChange: () => {
      H(), r == null || r.refreshCurrentView();
    }
  }), game.settings.register(l, X, {
    name: "HoloSuite Color Theme",
    hint: "Changes the shared color theme used by HoloSuite windows.",
    scope: "world",
    config: !0,
    type: String,
    choices: Z,
    default: "default",
    restricted: !0,
    onChange: (e) => re(e)
  }), game.settings.register(l, J, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !0
  }), game.settings.register(l, O, {
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
    type: k,
    restricted: !0
  });
}
function Ge() {
  var e, t;
  (t = (e = game.keybindings) == null ? void 0 : e.register) == null || t.call(e, l, ye, {
    name: "Open HoloSuite",
    hint: "Open the HoloSuite launcher and registered app deck.",
    editable: [],
    restricted: !1,
    onDown: () => {
      var n, s;
      return Ve() ? (g.toggleLauncher(), !0) : ((s = (n = ui.notifications) == null ? void 0 : n.warn) == null || s.call(n, "HoloSuite is disabled for players in this world."), !1);
    }
  });
}
function P(e) {
  return Object.hasOwn(L, String(e)) ? String(e) : "base";
}
function R() {
  const e = String(S(l, Q) ?? "");
  return Object.hasOwn(L, e) ? e : null;
}
function oe() {
  return P(S(l, V));
}
function qe() {
  return R() ?? oe();
}
function je(e) {
  return Object.hasOwn(Z, String(e)) ? String(e) : "default";
}
function ze(e) {
  const t = P(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const s of n)
    t === "base" ? s.removeAttribute("data-holosuite-device-style") : s.setAttribute("data-holosuite-device-style", t);
}
function re(e) {
  const t = je(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const s of n)
    t === "default" ? s.removeAttribute("data-holosuite-theme") : s.setAttribute("data-holosuite-theme", t);
}
function H() {
  ze(qe());
}
function Ue() {
  re(S(l, X));
}
function ie() {
  var t, n, s;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((s = game == null ? void 0 : game.release) == null ? void 0 : s.generation));
  return Number.isFinite(e) ? e : null;
}
function ae() {
  const e = ie(), t = [document.documentElement, document.body].filter(Boolean);
  for (const n of t)
    e === null ? n.removeAttribute(U) : n.setAttribute(U, String(e));
}
function le() {
  return ie() === 12 ? "fa-solid fa-terminal" : "fa-solid fa-mobile-screen-button";
}
function A() {
  try {
    return game.settings.get(l, J) === !0;
  } catch {
    return !1;
  }
}
function ce(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 ? !0 : A() ? !1 : e.playerVisible !== !1;
}
async function xe(e) {
  var n, s, o, i;
  const t = v.get(e);
  return t ? ce(t) ? t.open() : ((i = (o = ui.notifications) == null ? void 0 : o.warn) == null || i.call(o, `${t.title} is not available from the player view.`), null) : ((s = (n = ui.notifications) == null ? void 0 : n.warn) == null || s.call(n, `HoloSuite app "${e}" is not registered.`), null);
}
function ue(e, t = {}) {
  const n = te(e);
  return !n || E(n) < Te ? null : t.replace === !1 && m.has(n.moduleId) ? m.get(n.moduleId) ?? null : (m.set(n.moduleId, n), r == null || r.render(!1), n);
}
function Ye(e, t = {}) {
  const n = te(e);
  return n ? t.replace === !1 && b.has(n.moduleId) ? b.get(n.moduleId) ?? null : (b.set(n.moduleId, n), r == null || r.render(!1), n) : null;
}
async function Ke() {
  try {
    const e = await fetch(ve, { cache: "no-cache" });
    if (!e.ok) throw new Error(`HTTP ${e.status}`);
    const t = await e.json(), n = f(t == null ? void 0 : t.modules);
    for (const o of n)
      ue(o, { replace: !1 });
    const s = f(t == null ? void 0 : t.releases);
    for (const o of s)
      Ye(o, { replace: !1 });
  } catch (e) {
    console.warn(`${l} | Could not load bundled what's new catalog.`, e);
  }
}
function he(e) {
  const t = Ae(), n = t > 0 ? `<span>${a(t)}</span>` : "";
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
function Je(e) {
  return `
    <span class="holosuite-app-icon" data-holosuite-app-icon="${a(e.id)}">
      <i class="${a(e.icon)}"></i>
    </span>
  `;
}
function de() {
  var h;
  const e = ((h = game.user) == null ? void 0 : h.isGM) === !0, t = [...v.values()].filter(ce).sort((c, p) => c.title.localeCompare(p.title)), n = e ? "GM Command Deck" : "Player Link", s = e ? "Apps" : "Commlink", o = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", i = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">Active User</span>
        <strong>${a(Ce())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>LINK STABLE</span>
      </div>
    </section>
  `, u = t.map((c) => {
    const p = c.title, W = e && c.description ? `<p>${a(c.description)}</p>` : "", G = e ? "" : Ee(c.id);
    return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${a(c.id)}">
          ${Je(c)}
          <span class="holosuite-app-title">${a(p)}</span>
          ${W}
          ${G ? `<span class="holosuite-app-count">${a(G)}</span>` : ""}
        </button>
      `;
  }).join("");
  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">${a(n)}</span>
        <h2>${a(s)}</h2>
      </div>
    </div>
    ${i}
    <div class="holosuite-app-grid">
      ${t.length ? u : `<p class="holosuite-empty">${a(o)}</p>`}
    </div>
  `;
}
function Qe(e) {
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
          data-holosuite-filter="${a(n.id)}"
        >${a(n.label)}</button>
      `).join("")}
    </nav>
  `;
}
function Xe(e) {
  return `
    <nav class="holosuite-whats-new-tabs" aria-label="What's New tabs">
      ${[
    { id: "updates", label: "Updates", count: m.size },
    { id: "releases", label: "Releases", count: b.size }
  ].map((n) => `
        <button
          type="button"
          class="${n.id === e ? "is-active" : ""}"
          data-holosuite-whats-new-tab="${a(n.id)}"
        >
          <span>${a(n.label)}</span>
          <strong>${a(n.count)}</strong>
        </button>
      `).join("")}
    </nav>
  `;
}
function Ze(e) {
  return [...m.values()].filter((t) => e === "installed" ? _(t.moduleId) : e === "free" || e === "premium" ? t.tier === e : !0).sort(F);
}
function et(e) {
  return [...b.values()].filter((t) => e === "installed" ? _(t.moduleId) : e === "free" || e === "premium" ? t.tier === e : !0).sort(F);
}
function tt(e, t) {
  return e.length ? e.map((n) => {
    const s = _(n.moduleId), o = n.tier === "premium" ? "Premium" : "Free", i = n.icon || (n.tier === "premium" ? "fa-solid fa-gem" : "fa-solid fa-cube"), u = n.entries.map((c) => {
      var p;
      return `
        <li>
          <strong>${a(c.title)}</strong>
          ${c.summary ? `<span>${a(c.summary)}</span>` : ""}
          ${(p = c.tags) != null && p.length ? `
            <div class="holosuite-whats-new-tags">
              ${c.tags.map((W) => `<span>${a(W)}</span>`).join("")}
            </div>
          ` : ""}
        </li>
      `;
    }).join(""), h = n.url ? `
          <a class="holosuite-whats-new-link" href="${a(n.url)}" target="_blank" rel="noreferrer">
            <span>Find out more</span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        ` : "";
    return `
        <article class="holosuite-whats-new-card">
          <header>
            <span class="holosuite-whats-new-icon" data-holosuite-app-icon="${a(n.moduleId)}"><i class="${a(i)}"></i></span>
            <div>
              <h3>${a(n.title)}</h3>
              <p>
                <span>${a(o)}</span>
                ${n.version ? `<span>v${a(n.version)}</span>` : ""}
                ${n.updated ? `<span>${a(n.updated)}</span>` : ""}
                <span>${s ? "Installed" : "Not installed"}</span>
              </p>
            </div>
          </header>
          <ul>${u}</ul>
          ${h}
        </article>
      `;
  }).join("") : `<p class="holosuite-empty">${a(t)}</p>`;
}
function fe(e, t) {
  const n = Ze(e), s = et(e), o = t === "releases" ? s : n, i = t === "releases" ? "No releases match this filter yet." : "No updates match this filter yet.";
  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">Release Feed</span>
        <h2>What's New</h2>
      </div>
    </div>
    ${Xe(t)}
    ${Qe(e)}
    <div class="holosuite-whats-new-list">
      ${tt(o, i)}
    </div>
  `;
}
function ge() {
  const e = R(), t = oe(), n = e ?? t, s = e ? `
    <div class="holosuite-settings-notice">
      <i class="fa-solid fa-lock"></i>
      <span>The GM is overriding the HoloSuite theme for this world. Your personal choice is paused until the override is removed.</span>
    </div>
  ` : "", o = Object.entries(L).map(([i, u]) => `
    <button
      type="button"
      class="holosuite-theme-choice ${i === n ? "is-active" : ""}"
      data-holosuite-device-style="${a(i)}"
      ${e ? "disabled" : ""}
      aria-pressed="${i === n ? "true" : "false"}"
    >
      <span class="holosuite-theme-preview holosuite-theme-preview--${a(i)}"></span>
      <strong>${a(u)}</strong>
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
      ${s}
      <div class="holosuite-settings-field">
        <div>
          <span class="holosuite-kicker">Theme</span>
          <strong>${a(L[n])}</strong>
        </div>
      </div>
      <div class="holosuite-theme-choices">
        ${o}
      </div>
    </section>
  `;
}
function Y(e = "apps", t = "all", n = "releases") {
  const s = e === "whats-new" ? "holosuite-screen--whats-new" : e === "settings" ? "holosuite-screen--settings" : "", o = e === "whats-new" ? fe(t, n) : e === "settings" ? ge() : de();
  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
          ${he(e)}
        </header>
        <main class="holosuite-screen ${s}">
          ${o}
        </main>
        <footer class="holosuite-dock">
          <button type="button" data-holosuite-action="close" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
        </footer>
      </div>
    </section>
  `;
}
function D(e) {
  e && (e.querySelectorAll("[data-holosuite-app]").forEach((t) => {
    t.addEventListener("click", (n) => {
      xe(n.currentTarget.dataset.holosuiteApp ?? "");
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
      const s = n.currentTarget.dataset.holosuiteDeviceStyle;
      r == null || r.setDeviceStyle(P(s));
    });
  }), e.querySelectorAll("[data-holosuite-filter]").forEach((t) => {
    t.addEventListener("click", (n) => {
      const s = n.currentTarget.dataset.holosuiteFilter;
      r == null || r.setWhatsNewFilter(nt(s));
    });
  }), e.querySelectorAll("[data-holosuite-whats-new-tab]").forEach((t) => {
    t.addEventListener("click", (n) => {
      const s = n.currentTarget.dataset.holosuiteWhatsNewTab;
      r == null || r.setWhatsNewTab(st(s));
    });
  }), e.querySelectorAll("[data-holosuite-action='close']").forEach((t) => {
    t.addEventListener("pointerdown", K, { capture: !0 }), t.addEventListener("click", K, { capture: !0 });
  }));
}
function nt(e) {
  const t = String(e ?? "");
  return t === "free" || t === "premium" || t === "installed" ? t : "all";
}
function st(e) {
  return String(e ?? "") === "releases" ? "releases" : "updates";
}
function K(e) {
  var t;
  e.preventDefault(), e.stopPropagation(), (t = e.stopImmediatePropagation) == null || t.call(e), B();
}
async function B() {
  var s, o;
  if (C) return;
  C = !0;
  const e = r, t = e ? w(e.element) : document.querySelector("#holosuite-launcher"), n = ((s = t == null ? void 0 : t.closest) == null ? void 0 : s.call(t, "#holosuite-launcher, .holosuite-launcher-window")) ?? t;
  r = null, d = null;
  try {
    await ((o = e == null ? void 0 : e.close) == null ? void 0 : o.call(e, { force: !0 }));
  } catch (i) {
    console.warn(`${l} | Foundry did not close the launcher cleanly; removing stale launcher element.`, i);
  } finally {
    C = !1;
  }
  window.setTimeout(() => {
    n != null && n.isConnected && n.remove(), r || ne();
  }, 0);
}
class k extends Ne {
  constructor() {
    super(...arguments);
    y(this, "currentView", "apps");
    y(this, "whatsNewFilter", "all");
    y(this, "whatsNewTab", "releases");
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
  async _renderInner() {
    return $(Y(this.currentView, this.whatsNewFilter, this.whatsNewTab));
  }
  activateListeners(n) {
    super.activateListeners(n), D(w(n));
  }
  async _renderHTML() {
    const n = document.createElement("template");
    return n.innerHTML = Y(this.currentView, this.whatsNewFilter, this.whatsNewTab).trim(), n.content;
  }
  _replaceHTML(n, s) {
    const o = this.getRenderTarget(s);
    if (!o) return;
    const i = n instanceof DocumentFragment || n instanceof HTMLElement ? n : w(n);
    i ? o.replaceChildren(i) : o.innerHTML = String(n ?? ""), D(o);
  }
  async close(n = {}) {
    return r = null, super.close(n);
  }
  getLauncherRoot(n = {}) {
    var i;
    const s = w(this.element), o = (s == null ? void 0 : s.querySelector(".holosuite-phone")) ?? ((i = s == null ? void 0 : s.closest) == null ? void 0 : i.call(s, ".holosuite-phone")) ?? null;
    return o != null && o.isConnected ? o : n.includeDocumentFallback === !1 ? null : document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone");
  }
  getRenderTarget(n) {
    const s = w(n);
    return s ? s.querySelector(".window-content") ?? s.querySelector(".holosuite-launcher-window .window-content") ?? s : null;
  }
  updateRenderedView() {
    const n = this.getLauncherRoot();
    if (!n) return !1;
    const s = n.querySelector(".holosuite-status-bar"), o = n.querySelector(".holosuite-screen");
    return !s || !o ? !1 : (s.innerHTML = `
      <span>HoloSuite</span>
      ${he(this.currentView)}
    `, o.innerHTML = this.currentView === "whats-new" ? fe(this.whatsNewFilter, this.whatsNewTab) : this.currentView === "settings" ? ge() : de(), o.classList.toggle("holosuite-screen--whats-new", this.currentView === "whats-new"), o.classList.toggle("holosuite-screen--settings", this.currentView === "settings"), D(n), !0);
  }
  showApps() {
    this.currentView = "apps", this.updateRenderedView() || this.render(!1);
  }
  showWhatsNew() {
    this.currentView = "whats-new", We(), this.updateRenderedView() || this.render(!1);
  }
  showSettings() {
    this.currentView = "settings", this.updateRenderedView() || this.render(!1);
  }
  async setDeviceStyle(n) {
    R() || (await game.settings.set(l, V, n), this.currentView = "settings", H(), this.refreshCurrentView());
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
y(k, "DEFAULT_OPTIONS", {
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
const g = {
  registerApp(e) {
    const t = Ie(e);
    return t ? (v.set(t.id, t), r == null || r.render(!1), t) : null;
  },
  unregisterApp(e) {
    const t = v.delete(String(e ?? ""));
    return t && (r == null || r.render(!1)), t;
  },
  getApps() {
    return [...v.values()];
  },
  registerWhatsNew(e) {
    return ue(e);
  },
  unregisterWhatsNew(e) {
    const t = m.delete(String(e ?? ""));
    return t && (r == null || r.render(!1)), t;
  },
  getWhatsNew() {
    return [...m.values()].sort(F);
  },
  async openLauncher() {
    return d || (d = (async () => {
      x(r) || (r = null), r || (r = new k());
      try {
        await r.render(!0);
      } catch (e) {
        console.warn(`${l} | Recreating launcher after render failure.`, e), r = new k(), await r.render(!0);
      }
      return Oe(r), r;
    })().finally(() => {
      d = null;
    }), d);
  },
  async toggleLauncher() {
    return d || (x(r) ? (await B(), null) : (Fe() && ne(), _e(), g.openLauncher()));
  }
};
function me() {
  const e = game.modules.get(l);
  if (game.holosuite = g, globalThis.HoloSuiteCoreApi = g, e)
    try {
      e.api = g;
    } catch (t) {
      console.warn(`${l} | Could not attach API to game.modules; using game.holosuite fallback.`, t);
    }
  Hooks.callAll(`${l}.apiReady`, g);
}
Hooks.once("init", () => {
  ae(), Be(), Ge(), me();
});
Hooks.on("getSceneControlButtons", De);
Hooks.on("renderSceneControls", (e, t) => Re(t));
Hooks.on("renderSidebar", M);
Hooks.on("renderSidebarTab", M);
Hooks.once("ready", () => {
  me(), ae(), H(), Ue(), M(), Ke(), console.log(`${l} | Ready. API available at game.modules.get("${l}").api`);
});
