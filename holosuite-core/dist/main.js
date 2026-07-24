var he = Object.defineProperty;
var de = (e, t, n) => t in e ? he(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var y = (e, t, n) => de(e, typeof t != "symbol" ? t + "" : t, n);
function v(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function R(e, t) {
  return v(e) ? t.includes(String(e.name ?? "")) : !1;
}
function _(e) {
  if (!v(e) || !("tools" in e)) return !1;
  const t = String(e.name ?? "");
  return !["measure", "templates", "walls", "lighting", "sounds", "notes", "tiles", "drawings"].includes(t);
}
function fe(e, t, n) {
  if (Array.isArray(e))
    return e.find((r) => R(r, t)) ?? (n ? e.find(_) : null) ?? null;
  if (!v(e)) return null;
  for (const r of t)
    if (v(e[r])) return e[r];
  return Object.values(e).find((r) => R(r, t)) ?? (n ? Object.values(e).find(_) : null) ?? null;
}
function me(e) {
  const t = Object.values(e).map((n) => Number(n == null ? void 0 : n.order)).filter(Number.isFinite);
  return t.length ? Math.max(...t) + 1 : Object.keys(e).length;
}
function P(e, t, n = ["tokens", "token"], r = {}) {
  const o = fe(e, n, r.allowFallback === !0);
  if (!o) return !1;
  const s = o.tools;
  return Array.isArray(s) ? s.some((c) => (c == null ? void 0 : c.name) === t.name) ? !1 : (s.push(t), !0) : !v(s) || s[t.name] ? !1 : (s[t.name] = { ...t, order: t.order ?? me(s) }, !0);
}
const u = "holosuite-core", j = "disableForPlayers", U = "deviceStyle", x = "theme", W = "whatsNewLastSeen", B = "data-holosuite-foundry-generation", ge = `modules/${u}/data/whats-new.json`, Y = {
  base: "Base",
  "space-police": "Space Police"
}, K = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
}, S = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
let i = null, d = null, T = !1, J = 0;
function we() {
  var n, r, o, s, c, h;
  const e = ((r = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : r.api) ?? ((o = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : o.api) ?? null, t = ((c = (s = globalThis.foundry) == null ? void 0 : s.applications) == null ? void 0 : c.api) ?? ((h = foundry == null ? void 0 : foundry.applications) == null ? void 0 : h.api) ?? null;
  return globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV2);
}
const pe = we();
function q(e) {
  return e ? !!e.getLauncherRoot({ includeDocumentFallback: !1 }) : !1;
}
function a(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function N(e, t, n = `${t}s`) {
  return `${e} ${e === 1 ? t : n}`;
}
function L(e, t) {
  try {
    return game.settings.get(e, t);
  } catch {
    return null;
  }
}
function H(e) {
  var t;
  return ((t = game.modules.get(e)) == null ? void 0 : t.api) ?? null;
}
function be() {
  var e, t, n;
  return String(((t = (e = game.user) == null ? void 0 : e.character) == null ? void 0 : t.name) ?? ((n = game.user) == null ? void 0 : n.name) ?? "Player");
}
function ye(e) {
  var t, n, r, o, s, c;
  if (e === "cybercall") {
    const h = f(L("cybercall", "contacts")), l = f(L("cybercall", "groupContacts"));
    return N(h.length + l.length, "link");
  }
  if (e === "bounty-board") {
    const h = f((n = (t = H("bounty-board")) == null ? void 0 : t.getAllBounties) == null ? void 0 : n.call(t, { includeHidden: !1 }));
    return N(h.length, "contract");
  }
  if (e === "csi-toolkit") {
    const h = Object.values(((o = (r = H("csi-toolkit")) == null ? void 0 : r.getCases) == null ? void 0 : o.call(r)) ?? {}).filter((l) => (l == null ? void 0 : l.visibility) !== "gm");
    return N(h.length, "case");
  }
  if (e === "galaxy-map") {
    const h = f((c = (s = H("galaxy-map")) == null ? void 0 : s.getMaps) == null ? void 0 : c.call(s)).filter((l) => (l == null ? void 0 : l.visibility) === "players");
    return N(h.length, "chart");
  }
  return "";
}
function f(e) {
  return Array.isArray(e) ? e : [];
}
function Se(e) {
  const t = String((e == null ? void 0 : e.title) ?? "").trim();
  if (!t) return null;
  const n = f(e == null ? void 0 : e.tags).map((r) => String(r ?? "").trim()).filter(Boolean).slice(0, 4);
  return {
    title: t,
    summary: String((e == null ? void 0 : e.summary) ?? "").trim(),
    tags: n
  };
}
function Q(e) {
  const t = String((e == null ? void 0 : e.moduleId) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), r = f(e == null ? void 0 : e.entries).map((s) => Se(s)).filter((s) => !!s);
  if (!t || !n || r.length === 0)
    return console.warn(`${u} | Ignoring invalid what's new registration.`, e), null;
  const o = String((e == null ? void 0 : e.tier) ?? "free").toLowerCase() === "premium" ? "premium" : "free";
  return {
    moduleId: t,
    title: n,
    tier: o,
    version: String((e == null ? void 0 : e.version) ?? "").trim(),
    updated: String((e == null ? void 0 : e.updated) ?? "").trim(),
    icon: String((e == null ? void 0 : e.icon) ?? "").trim(),
    url: String((e == null ? void 0 : e.url) ?? "").trim(),
    entries: r
  };
}
function E(e) {
  const t = Date.parse(String(e.updated ?? ""));
  return Number.isFinite(t) ? t : 0;
}
function I(e, t) {
  return E(t) - E(e) || e.title.localeCompare(t.title);
}
function F(e) {
  var t, n;
  return ((n = (t = game.modules) == null ? void 0 : t.has) == null ? void 0 : n.call(t, e)) === !0;
}
function ve() {
  const e = Number(L(u, W));
  return Number.isFinite(e) ? e : 0;
}
function $e() {
  const e = ve();
  return [...m.values(), ...b.values()].filter((t) => E(t) > e).reduce((t, n) => t + n.entries.length, 0);
}
function Le() {
  try {
    game.settings.set(u, W, Date.now());
  } catch (e) {
    console.warn(`${u} | Could not update what's new read state.`, e);
  }
}
function Ne(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), r = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !t || !n || !r || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${u} | Ignoring invalid app registration.`, e), null) : {
    id: t,
    title: n,
    icon: r,
    premium: e.premium === !0,
    playerVisible: e.playerVisible !== !1,
    description: String(e.description ?? "").trim(),
    featureId: String(e.featureId ?? t).trim() || t,
    open: e.open
  };
}
function Te(e) {
  var o;
  const t = ((o = game.user) == null ? void 0 : o.isGM) === !0;
  if (!t && D()) return;
  const n = () => ({
    name: "holosuite-core-launcher",
    title: t ? "HoloSuite Command Deck" : "HoloSuite Player View",
    icon: oe(),
    button: !0,
    visible: !0,
    onClick: Z,
    onChange: Ee
  }), r = P(e, n(), ["tiles", "tile"]);
  P(e, n(), ["tokens", "token"], { allowFallback: !r });
}
function M() {
  document.querySelectorAll(".holosuite-sidebar-launcher, .holosuite-floating-launcher").forEach((e) => e.remove());
}
function g(e) {
  var r;
  if (e instanceof HTMLElement) return e;
  if (Array.isArray(e) && e[0] instanceof HTMLElement) return e[0];
  const t = e, n = ((r = t == null ? void 0 : t.get) == null ? void 0 : r.call(t, 0)) ?? (t == null ? void 0 : t[0]);
  return n instanceof HTMLElement ? n : null;
}
function Ce(e) {
  var s;
  const t = new Set(document.querySelectorAll("#holosuite-launcher, .holosuite-launcher-window"));
  if (t.size <= 1) return;
  const n = e ? g(e.element) : null, o = ((s = n == null ? void 0 : n.closest) == null ? void 0 : s.call(n, "#holosuite-launcher, .holosuite-launcher-window")) ?? [...t].at(-1) ?? null;
  for (const c of t)
    c !== o && c.remove();
}
function X() {
  document.querySelectorAll("#holosuite-launcher, .holosuite-launcher-window").forEach((e) => {
    e.remove();
  });
}
function ke() {
  return document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone") !== null;
}
function He() {
  i = null, d = null, T = !1;
}
function Ae(e) {
  const t = e.find((n) => typeof n == "boolean");
  return typeof t == "boolean" ? t : null;
}
function Z() {
  return J = Date.now(), w.toggleLauncher();
}
function Ee(...e) {
  const t = Ae(e);
  return t === !1 ? (O(), null) : t === null && Date.now() - J < 100 ? null : w.openLauncher();
}
function We(e) {
  var s;
  const t = ((s = game.user) == null ? void 0 : s.isGM) === !0;
  if (!t && D()) return;
  const n = g(e) ?? document.querySelector("#controls, #scene-controls");
  if (!n || n.querySelector("[data-tool='holosuite-core-launcher']")) return;
  const r = n.querySelector(
    ".control-tools.active, .sub-controls.active, .scene-control-tools.active, .control-tools, .sub-controls, .scene-control-tools"
  );
  if (!r) return;
  const o = document.createElement("li");
  o.className = "control-tool holosuite-scene-control", o.dataset.tool = "holosuite-core-launcher", o.title = t ? "HoloSuite Command Deck" : "HoloSuite Player View", o.innerHTML = `<i class="${oe()}"></i>`, o.addEventListener("click", (c) => {
    c.preventDefault(), c.stopPropagation(), Z();
  }), r.appendChild(o);
}
function Ie() {
  game.settings.register(u, U, {
    name: "HoloSuite Device Style",
    hint: "Changes the launcher frame style without changing the launcher size.",
    scope: "world",
    config: !0,
    type: String,
    choices: Y,
    default: "base",
    restricted: !0,
    onChange: (e) => ee(e)
  }), game.settings.register(u, x, {
    name: "HoloSuite Theme",
    hint: "Changes the shared color theme used by HoloSuite windows.",
    scope: "world",
    config: !0,
    type: String,
    choices: K,
    default: "default",
    restricted: !0,
    onChange: (e) => te(e)
  }), game.settings.register(u, j, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !0
  }), game.settings.register(u, W, {
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
    type: C,
    restricted: !0
  });
}
function Fe(e) {
  return Object.hasOwn(Y, String(e)) ? String(e) : "base";
}
function Me(e) {
  return Object.hasOwn(K, String(e)) ? String(e) : "default";
}
function ee(e) {
  const t = Fe(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const r of n)
    t === "base" ? r.removeAttribute("data-holosuite-device-style") : r.setAttribute("data-holosuite-device-style", t);
}
function te(e) {
  const t = Me(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const r of n)
    t === "default" ? r.removeAttribute("data-holosuite-theme") : r.setAttribute("data-holosuite-theme", t);
}
function De() {
  ee(L(u, U));
}
function Oe() {
  te(L(u, x));
}
function ne() {
  var t, n, r;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((r = game == null ? void 0 : game.release) == null ? void 0 : r.generation));
  return Number.isFinite(e) ? e : null;
}
function re() {
  const e = ne(), t = [document.documentElement, document.body].filter(Boolean);
  for (const n of t)
    e === null ? n.removeAttribute(B) : n.setAttribute(B, String(e));
}
function oe() {
  return ne() === 12 ? "fa-solid fa-terminal" : "fa-solid fa-mobile-screen-button";
}
function D() {
  try {
    return game.settings.get(u, j) === !0;
  } catch {
    return !1;
  }
}
function se(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 ? !0 : D() ? !1 : e.playerVisible !== !1;
}
async function Ve(e) {
  var n, r, o, s;
  const t = S.get(e);
  return t ? se(t) ? t.open() : ((s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, `${t.title} is not available from the player view.`), null) : ((r = (n = ui.notifications) == null ? void 0 : n.warn) == null || r.call(n, `HoloSuite app "${e}" is not registered.`), null);
}
function ie(e, t = {}) {
  const n = Q(e);
  return n ? t.replace === !1 && m.has(n.moduleId) ? m.get(n.moduleId) ?? null : (m.set(n.moduleId, n), i == null || i.render(!1), n) : null;
}
function Re(e, t = {}) {
  const n = Q(e);
  return n ? t.replace === !1 && b.has(n.moduleId) ? b.get(n.moduleId) ?? null : (b.set(n.moduleId, n), i == null || i.render(!1), n) : null;
}
async function _e() {
  try {
    const e = await fetch(ge, { cache: "no-cache" });
    if (!e.ok) throw new Error(`HTTP ${e.status}`);
    const t = await e.json(), n = f(t == null ? void 0 : t.modules);
    for (const o of n)
      ie(o, { replace: !1 });
    const r = f(t == null ? void 0 : t.releases);
    for (const o of r)
      Re(o, { replace: !1 });
  } catch (e) {
    console.warn(`${u} | Could not load bundled what's new catalog.`, e);
  }
}
function ae(e) {
  const t = $e(), n = t > 0 ? `<span>${a(t)}</span>` : "", r = e === "whats-new" ? "apps" : "whats-new", o = e === "whats-new" ? "Back to HoloSuite apps" : "What's New", s = e === "whats-new" ? "fa-solid fa-arrow-left" : "fa-solid fa-star";
  return `
    <button
      type="button"
      class="holosuite-header-action ${e === "whats-new" ? "is-active" : ""}"
      data-holosuite-action="${a(r)}"
      title="${a(o)}"
      aria-label="${a(o)}"
    >
      <i class="${a(s)}"></i>
      ${n}
    </button>
  `;
}
function Pe(e) {
  return `
    <span class="holosuite-app-icon" data-holosuite-app-icon="${a(e.id)}">
      <i class="${a(e.icon)}"></i>
    </span>
  `;
}
function le() {
  var h;
  const e = ((h = game.user) == null ? void 0 : h.isGM) === !0, t = [...S.values()].filter(se).sort((l, p) => l.title.localeCompare(p.title)), n = e ? "GM Command Deck" : "Player Link", r = e ? "Apps" : "Commlink", o = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", s = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">Active User</span>
        <strong>${a(be())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>LINK STABLE</span>
      </div>
    </section>
  `, c = t.map((l) => {
    const p = l.title, k = e && l.description ? `<p>${a(l.description)}</p>` : "", V = e ? "" : ye(l.id);
    return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${a(l.id)}">
          ${Pe(l)}
          <span class="holosuite-app-title">${a(p)}</span>
          ${k}
          ${V ? `<span class="holosuite-app-count">${a(V)}</span>` : ""}
        </button>
      `;
  }).join("");
  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">${a(n)}</span>
        <h2>${a(r)}</h2>
      </div>
    </div>
    ${s}
    <div class="holosuite-app-grid">
      ${t.length ? c : `<p class="holosuite-empty">${a(o)}</p>`}
    </div>
  `;
}
function Be(e) {
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
function qe(e) {
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
function ze(e) {
  return [...m.values()].filter((t) => e === "installed" ? F(t.moduleId) : e === "free" || e === "premium" ? t.tier === e : !0).sort(I);
}
function Ge(e) {
  return [...b.values()].filter((t) => e === "installed" ? F(t.moduleId) : e === "free" || e === "premium" ? t.tier === e : !0).sort(I);
}
function je(e, t) {
  return e.length ? e.map((n) => {
    const r = F(n.moduleId), o = n.tier === "premium" ? "Premium" : "Free", s = n.icon || (n.tier === "premium" ? "fa-solid fa-gem" : "fa-solid fa-cube"), c = n.entries.map((l) => {
      var p;
      return `
        <li>
          <strong>${a(l.title)}</strong>
          ${l.summary ? `<span>${a(l.summary)}</span>` : ""}
          ${(p = l.tags) != null && p.length ? `
            <div class="holosuite-whats-new-tags">
              ${l.tags.map((k) => `<span>${a(k)}</span>`).join("")}
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
            <span class="holosuite-whats-new-icon"><i class="${a(s)}"></i></span>
            <div>
              <h3>${a(n.title)}</h3>
              <p>
                <span>${a(o)}</span>
                ${n.version ? `<span>v${a(n.version)}</span>` : ""}
                ${n.updated ? `<span>${a(n.updated)}</span>` : ""}
                <span>${r ? "Installed" : "Not installed"}</span>
              </p>
            </div>
          </header>
          <ul>${c}</ul>
          ${h}
        </article>
      `;
  }).join("") : `<p class="holosuite-empty">${a(t)}</p>`;
}
function ue(e, t) {
  const n = ze(e), r = Ge(e), o = t === "releases" ? r : n, s = t === "releases" ? "No releases match this filter yet." : "No updates match this filter yet.";
  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">Release Feed</span>
        <h2>What's New</h2>
      </div>
    </div>
    ${qe(t)}
    ${Be(e)}
    <div class="holosuite-whats-new-list">
      ${je(o, s)}
    </div>
  `;
}
function z(e = "apps", t = "all", n = "releases") {
  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
          ${ae(e)}
        </header>
        <main class="holosuite-screen ${e === "whats-new" ? "holosuite-screen--whats-new" : ""}">
          ${e === "whats-new" ? ue(t, n) : le()}
        </main>
        <footer class="holosuite-dock">
          <button type="button" data-holosuite-action="close" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
        </footer>
      </div>
    </section>
  `;
}
function A(e) {
  e && (e.querySelectorAll("[data-holosuite-app]").forEach((t) => {
    t.addEventListener("click", (n) => {
      Ve(n.currentTarget.dataset.holosuiteApp ?? "");
    });
  }), e.querySelectorAll("[data-holosuite-action='whats-new']").forEach((t) => {
    t.addEventListener("click", (n) => {
      n.preventDefault(), n.stopPropagation(), i == null || i.showWhatsNew();
    });
  }), e.querySelectorAll("[data-holosuite-action='apps']").forEach((t) => {
    t.addEventListener("click", (n) => {
      n.preventDefault(), n.stopPropagation(), i == null || i.showApps();
    });
  }), e.querySelectorAll("[data-holosuite-filter]").forEach((t) => {
    t.addEventListener("click", (n) => {
      const r = n.currentTarget.dataset.holosuiteFilter;
      i == null || i.setWhatsNewFilter(Ue(r));
    });
  }), e.querySelectorAll("[data-holosuite-whats-new-tab]").forEach((t) => {
    t.addEventListener("click", (n) => {
      const r = n.currentTarget.dataset.holosuiteWhatsNewTab;
      i == null || i.setWhatsNewTab(xe(r));
    });
  }), e.querySelectorAll("[data-holosuite-action='close']").forEach((t) => {
    t.addEventListener("pointerdown", G, { capture: !0 }), t.addEventListener("click", G, { capture: !0 });
  }));
}
function Ue(e) {
  const t = String(e ?? "");
  return t === "free" || t === "premium" || t === "installed" ? t : "all";
}
function xe(e) {
  return String(e ?? "") === "releases" ? "releases" : "updates";
}
function G(e) {
  var t;
  e.preventDefault(), e.stopPropagation(), (t = e.stopImmediatePropagation) == null || t.call(e), O();
}
async function O() {
  var r, o;
  if (T) return;
  T = !0;
  const e = i, t = e ? g(e.element) : document.querySelector("#holosuite-launcher"), n = ((r = t == null ? void 0 : t.closest) == null ? void 0 : r.call(t, "#holosuite-launcher, .holosuite-launcher-window")) ?? t;
  i = null, d = null;
  try {
    await ((o = e == null ? void 0 : e.close) == null ? void 0 : o.call(e, { force: !0 }));
  } catch (s) {
    console.warn(`${u} | Foundry did not close the launcher cleanly; removing stale launcher element.`, s);
  } finally {
    T = !1;
  }
  window.setTimeout(() => {
    n != null && n.isConnected && n.remove(), i || X();
  }, 0);
}
class C extends pe {
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
    return $(z(this.currentView, this.whatsNewFilter, this.whatsNewTab));
  }
  activateListeners(n) {
    super.activateListeners(n), A(g(n));
  }
  async _renderHTML() {
    const n = document.createElement("template");
    return n.innerHTML = z(this.currentView, this.whatsNewFilter, this.whatsNewTab).trim(), n.content;
  }
  _replaceHTML(n, r) {
    const o = this.getRenderTarget(r);
    if (!o) return;
    const s = n instanceof DocumentFragment || n instanceof HTMLElement ? n : g(n);
    s ? o.replaceChildren(s) : o.innerHTML = String(n ?? ""), A(o);
  }
  async close(n = {}) {
    return i = null, super.close(n);
  }
  getLauncherRoot(n = {}) {
    var s;
    const r = g(this.element), o = (r == null ? void 0 : r.querySelector(".holosuite-phone")) ?? ((s = r == null ? void 0 : r.closest) == null ? void 0 : s.call(r, ".holosuite-phone")) ?? null;
    return o != null && o.isConnected ? o : n.includeDocumentFallback === !1 ? null : document.querySelector("#holosuite-launcher .holosuite-phone, .holosuite-launcher-window .holosuite-phone");
  }
  getRenderTarget(n) {
    const r = g(n);
    return r ? r.querySelector(".window-content") ?? r.querySelector(".holosuite-launcher-window .window-content") ?? r : null;
  }
  updateRenderedView() {
    const n = this.getLauncherRoot();
    if (!n) return !1;
    const r = n.querySelector(".holosuite-status-bar"), o = n.querySelector(".holosuite-screen");
    return !r || !o ? !1 : (r.innerHTML = `
      <span>HoloSuite</span>
      ${ae(this.currentView)}
    `, o.innerHTML = this.currentView === "whats-new" ? ue(this.whatsNewFilter, this.whatsNewTab) : le(), o.classList.toggle("holosuite-screen--whats-new", this.currentView === "whats-new"), A(n), !0);
  }
  showApps() {
    this.currentView = "apps", this.updateRenderedView() || this.render(!1);
  }
  showWhatsNew() {
    this.currentView = "whats-new", Le(), this.updateRenderedView() || this.render(!1);
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
y(C, "DEFAULT_OPTIONS", {
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
const w = {
  registerApp(e) {
    const t = Ne(e);
    return t ? (S.set(t.id, t), i == null || i.render(!1), t) : null;
  },
  unregisterApp(e) {
    const t = S.delete(String(e ?? ""));
    return t && (i == null || i.render(!1)), t;
  },
  getApps() {
    return [...S.values()];
  },
  registerWhatsNew(e) {
    return ie(e);
  },
  unregisterWhatsNew(e) {
    const t = m.delete(String(e ?? ""));
    return t && (i == null || i.render(!1)), t;
  },
  getWhatsNew() {
    return [...m.values()].sort(I);
  },
  async openLauncher() {
    return d || (d = (async () => {
      q(i) || (i = null), i || (i = new C());
      try {
        await i.render(!0);
      } catch (e) {
        console.warn(`${u} | Recreating launcher after render failure.`, e), i = new C(), await i.render(!0);
      }
      return Ce(i), i;
    })().finally(() => {
      d = null;
    }), d);
  },
  async toggleLauncher() {
    return d || (q(i) ? (await O(), null) : (ke() && X(), He(), w.openLauncher()));
  }
};
function ce() {
  const e = game.modules.get(u);
  if (game.holosuite = w, globalThis.HoloSuiteCoreApi = w, e)
    try {
      e.api = w;
    } catch (t) {
      console.warn(`${u} | Could not attach API to game.modules; using game.holosuite fallback.`, t);
    }
  Hooks.callAll(`${u}.apiReady`, w);
}
Hooks.once("init", () => {
  re(), Ie(), ce();
});
Hooks.on("getSceneControlButtons", Te);
Hooks.on("renderSceneControls", (e, t) => We(t));
Hooks.on("renderSidebar", M);
Hooks.on("renderSidebarTab", M);
Hooks.once("ready", () => {
  ce(), re(), De(), Oe(), M(), _e(), console.log(`${u} | Ready. API available at game.modules.get("${u}").api`);
});
