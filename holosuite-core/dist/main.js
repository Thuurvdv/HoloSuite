var X = Object.defineProperty;
var Z = (e, t, n) => t in e ? X(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var S = (e, t, n) => Z(e, typeof t != "symbol" ? t + "" : t, n);
function b(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function W(e, t) {
  return b(e) ? t.includes(String(e.name ?? "")) : !1;
}
function F(e) {
  if (!b(e) || !("tools" in e)) return !1;
  const t = String(e.name ?? "");
  return !["measure", "templates", "walls", "lighting", "sounds", "notes", "tiles", "drawings"].includes(t);
}
function ee(e, t, n) {
  if (Array.isArray(e))
    return e.find((r) => W(r, t)) ?? (n ? e.find(F) : null) ?? null;
  if (!b(e)) return null;
  for (const r of t)
    if (b(e[r])) return e[r];
  return Object.values(e).find((r) => W(r, t)) ?? (n ? Object.values(e).find(F) : null) ?? null;
}
function te(e) {
  const t = Object.values(e).map((n) => Number(n == null ? void 0 : n.order)).filter(Number.isFinite);
  return t.length ? Math.max(...t) + 1 : Object.keys(e).length;
}
function I(e, t, n = ["tokens", "token"], r = {}) {
  const o = ee(e, n, r.allowFallback === !0);
  if (!o) return !1;
  const s = o.tools;
  return Array.isArray(s) ? s.some((u) => (u == null ? void 0 : u.name) === t.name) ? !1 : (s.push(t), !0) : !b(s) || s[t.name] ? !1 : (s[t.name] = { ...t, order: t.order ?? te(s) }, !0);
}
const c = "holosuite-core", R = "disableForPlayers", _ = "theme", k = "whatsNewLastSeen", O = "data-holosuite-foundry-generation", ne = `modules/${c}/data/whats-new.json`, P = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
}, p = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map();
let i = null;
function re() {
  var n, r, o, s, u, d;
  const e = ((r = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : r.api) ?? ((o = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : o.api) ?? null, t = ((u = (s = globalThis.foundry) == null ? void 0 : s.applications) == null ? void 0 : u.api) ?? ((d = foundry == null ? void 0 : foundry.applications) == null ? void 0 : d.api) ?? null;
  return globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV2);
}
const oe = re();
function l(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function y(e, t, n = `${t}s`) {
  return `${e} ${e === 1 ? t : n}`;
}
function v(e, t) {
  try {
    return game.settings.get(e, t);
  } catch {
    return null;
  }
}
function L(e) {
  var t;
  return ((t = game.modules.get(e)) == null ? void 0 : t.api) ?? null;
}
function se() {
  var e, t, n;
  return String(((t = (e = game.user) == null ? void 0 : e.character) == null ? void 0 : t.name) ?? ((n = game.user) == null ? void 0 : n.name) ?? "Player");
}
function ie(e) {
  var t, n, r, o, s, u;
  if (e === "cybercall") {
    const d = h(v("cybercall", "contacts")), a = h(v("cybercall", "groupContacts"));
    return y(d.length + a.length, "link");
  }
  if (e === "bounty-board") {
    const d = h((n = (t = L("bounty-board")) == null ? void 0 : t.getAllBounties) == null ? void 0 : n.call(t, { includeHidden: !1 }));
    return y(d.length, "contract");
  }
  if (e === "csi-toolkit") {
    const d = Object.values(((o = (r = L("csi-toolkit")) == null ? void 0 : r.getCases) == null ? void 0 : o.call(r)) ?? {}).filter((a) => (a == null ? void 0 : a.visibility) !== "gm");
    return y(d.length, "case");
  }
  if (e === "galaxy-map") {
    const d = h((u = (s = L("galaxy-map")) == null ? void 0 : s.getMaps) == null ? void 0 : u.call(s)).filter((a) => (a == null ? void 0 : a.visibility) === "players");
    return y(d.length, "chart");
  }
  return "";
}
function h(e) {
  return Array.isArray(e) ? e : [];
}
function ae(e) {
  const t = String((e == null ? void 0 : e.title) ?? "").trim();
  if (!t) return null;
  const n = h(e == null ? void 0 : e.tags).map((r) => String(r ?? "").trim()).filter(Boolean).slice(0, 4);
  return {
    title: t,
    summary: String((e == null ? void 0 : e.summary) ?? "").trim(),
    tags: n
  };
}
function le(e) {
  const t = String((e == null ? void 0 : e.moduleId) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), r = h(e == null ? void 0 : e.entries).map((s) => ae(s)).filter((s) => !!s);
  if (!t || !n || r.length === 0)
    return console.warn(`${c} | Ignoring invalid what's new registration.`, e), null;
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
function A(e) {
  const t = Date.parse(String(e.updated ?? ""));
  return Number.isFinite(t) ? t : 0;
}
function D(e, t) {
  return A(t) - A(e) || e.title.localeCompare(t.title);
}
function B(e) {
  var t, n;
  return ((n = (t = game.modules) == null ? void 0 : t.has) == null ? void 0 : n.call(t, e)) === !0;
}
function ce() {
  const e = Number(v(c, k));
  return Number.isFinite(e) ? e : 0;
}
function ue() {
  const e = ce();
  return [...f.values()].filter((t) => A(t) > e).reduce((t, n) => t + n.entries.length, 0);
}
function de() {
  try {
    game.settings.set(c, k, Date.now());
  } catch (e) {
    console.warn(`${c} | Could not update what's new read state.`, e);
  }
}
function he(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), r = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !t || !n || !r || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${c} | Ignoring invalid app registration.`, e), null) : {
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
function fe(e) {
  var s;
  const t = ((s = game.user) == null ? void 0 : s.isGM) === !0;
  if (!t && C()) return;
  const n = () => g.openLauncher(), r = () => ({
    name: "holosuite-core-launcher",
    title: t ? "HoloSuite Command Deck" : "HoloSuite Player View",
    icon: z(),
    button: !0,
    visible: !0,
    onClick: n,
    onChange: n
  }), o = I(e, r(), ["tiles", "tile"]);
  I(e, r(), ["tokens", "token"], { allowFallback: !o });
}
function E() {
  document.querySelectorAll(".holosuite-sidebar-launcher, .holosuite-floating-launcher").forEach((e) => e.remove());
}
function w(e) {
  var r;
  if (e instanceof HTMLElement) return e;
  if (Array.isArray(e) && e[0] instanceof HTMLElement) return e[0];
  const t = e, n = ((r = t == null ? void 0 : t.get) == null ? void 0 : r.call(t, 0)) ?? (t == null ? void 0 : t[0]);
  return n instanceof HTMLElement ? n : null;
}
function me(e) {
  var s;
  const t = ((s = game.user) == null ? void 0 : s.isGM) === !0;
  if (!t && C()) return;
  const n = w(e) ?? document.querySelector("#controls, #scene-controls");
  if (!n || n.querySelector("[data-tool='holosuite-core-launcher']")) return;
  const r = n.querySelector(
    ".control-tools.active, .sub-controls.active, .scene-control-tools.active, .control-tools, .sub-controls, .scene-control-tools"
  );
  if (!r) return;
  const o = document.createElement("li");
  o.className = "control-tool holosuite-scene-control", o.dataset.tool = "holosuite-core-launcher", o.title = t ? "HoloSuite Command Deck" : "HoloSuite Player View", o.innerHTML = `<i class="${z()}"></i>`, o.addEventListener("click", (u) => {
    u.preventDefault(), u.stopPropagation(), g.openLauncher();
  }), r.appendChild(o);
}
function ge() {
  game.settings.register(c, _, {
    name: "HoloSuite Theme",
    hint: "Changes the shared color theme used by HoloSuite windows.",
    scope: "world",
    config: !0,
    type: String,
    choices: P,
    default: "default",
    restricted: !0,
    onChange: (e) => G(e)
  }), game.settings.register(c, R, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !0
  }), game.settings.register(c, k, {
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
    type: N,
    restricted: !0
  });
}
function we(e) {
  return Object.hasOwn(P, String(e)) ? String(e) : "default";
}
function G(e) {
  const t = we(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const r of n)
    t === "default" ? r.removeAttribute("data-holosuite-theme") : r.setAttribute("data-holosuite-theme", t);
}
function pe() {
  G(v(c, _));
}
function j() {
  var t, n, r;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((r = game == null ? void 0 : game.release) == null ? void 0 : r.generation));
  return Number.isFinite(e) ? e : null;
}
function q() {
  const e = j(), t = [document.documentElement, document.body].filter(Boolean);
  for (const n of t)
    e === null ? n.removeAttribute(O) : n.setAttribute(O, String(e));
}
function z() {
  return j() === 12 ? "fa-solid fa-terminal" : "fa-solid fa-mobile-screen-button";
}
function C() {
  try {
    return game.settings.get(c, R) === !0;
  } catch {
    return !1;
  }
}
function x(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 ? !0 : C() ? !1 : e.playerVisible !== !1;
}
async function be(e) {
  var n, r, o, s;
  const t = p.get(e);
  return t ? x(t) ? t.open() : ((s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, `${t.title} is not available from the player view.`), null) : ((r = (n = ui.notifications) == null ? void 0 : n.warn) == null || r.call(n, `HoloSuite app "${e}" is not registered.`), null);
}
function U(e, t = {}) {
  const n = le(e);
  return n ? t.replace === !1 && f.has(n.moduleId) ? f.get(n.moduleId) ?? null : (f.set(n.moduleId, n), i == null || i.render(!1), n) : null;
}
async function Se() {
  try {
    const e = await fetch(ne, { cache: "no-cache" });
    if (!e.ok) throw new Error(`HTTP ${e.status}`);
    const t = await e.json(), n = h(t == null ? void 0 : t.modules);
    for (const r of n)
      U(r, { replace: !1 });
  } catch (e) {
    console.warn(`${c} | Could not load bundled what's new catalog.`, e);
  }
}
function Y(e) {
  const t = ue(), n = t > 0 ? `<span>${l(t)}</span>` : "", r = e === "whats-new" ? "apps" : "whats-new", o = e === "whats-new" ? "Back to HoloSuite apps" : "What's New", s = e === "whats-new" ? "fa-solid fa-arrow-left" : "fa-solid fa-star";
  return `
    <button
      type="button"
      class="holosuite-header-action ${e === "whats-new" ? "is-active" : ""}"
      data-holosuite-action="${l(r)}"
      title="${l(o)}"
      aria-label="${l(o)}"
    >
      <i class="${l(s)}"></i>
      ${n}
    </button>
  `;
}
function K() {
  var d;
  const e = ((d = game.user) == null ? void 0 : d.isGM) === !0, t = [...p.values()].filter(x).sort((a, m) => a.title.localeCompare(m.title)), n = e ? "GM Command Deck" : "Player Link", r = e ? "Apps" : "Commlink", o = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", s = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">Active User</span>
        <strong>${l(se())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>LINK STABLE</span>
      </div>
    </section>
  `, u = t.map((a) => {
    const m = a.title, T = e && a.description ? `<p>${l(a.description)}</p>` : "", M = e ? "" : ie(a.id);
    return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${l(a.id)}">
          <span class="holosuite-app-icon"><i class="${l(a.icon)}"></i></span>
          <span class="holosuite-app-title">${l(m)}</span>
          ${T}
          ${M ? `<span class="holosuite-app-count">${l(M)}</span>` : ""}
        </button>
      `;
  }).join("");
  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">${l(n)}</span>
        <h2>${l(r)}</h2>
      </div>
    </div>
    ${s}
    <div class="holosuite-app-grid">
      ${t.length ? u : `<p class="holosuite-empty">${l(o)}</p>`}
    </div>
  `;
}
function ye(e) {
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
          data-holosuite-filter="${l(n.id)}"
        >${l(n.label)}</button>
      `).join("")}
    </nav>
  `;
}
function ve(e) {
  return [...f.values()].filter((t) => e === "installed" ? B(t.moduleId) : e === "free" || e === "premium" ? t.tier === e : !0).sort(D);
}
function J(e) {
  const t = ve(e), n = t.length ? t.map((r) => {
    const o = B(r.moduleId), s = r.tier === "premium" ? "Premium" : "Free", u = r.icon || (r.tier === "premium" ? "fa-solid fa-gem" : "fa-solid fa-cube"), d = r.entries.map((a) => {
      var m;
      return `
        <li>
          <strong>${l(a.title)}</strong>
          ${a.summary ? `<span>${l(a.summary)}</span>` : ""}
          ${(m = a.tags) != null && m.length ? `
            <div class="holosuite-whats-new-tags">
              ${a.tags.map((T) => `<span>${l(T)}</span>`).join("")}
            </div>
          ` : ""}
        </li>
      `;
    }).join("");
    return `
        <article class="holosuite-whats-new-card">
          <header>
            <span class="holosuite-whats-new-icon"><i class="${l(u)}"></i></span>
            <div>
              <h3>${l(r.title)}</h3>
              <p>
                <span>${l(s)}</span>
                ${r.version ? `<span>v${l(r.version)}</span>` : ""}
                ${r.updated ? `<span>${l(r.updated)}</span>` : ""}
                <span>${o ? "Installed" : "Not installed"}</span>
              </p>
            </div>
          </header>
          <ul>${d}</ul>
        </article>
      `;
  }).join("") : '<p class="holosuite-empty">No updates match this filter yet.</p>';
  return `
    <div class="holosuite-screen-heading">
      <div>
        <span class="holosuite-kicker">Release Feed</span>
        <h2>What's New</h2>
      </div>
    </div>
    ${ye(e)}
    <div class="holosuite-whats-new-list">
      ${n}
    </div>
  `;
}
function V(e = "apps", t = "all") {
  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
          ${Y(e)}
        </header>
        <main class="holosuite-screen ${e === "whats-new" ? "holosuite-screen--whats-new" : ""}">
          ${e === "whats-new" ? J(t) : K()}
        </main>
        <footer class="holosuite-dock">
          <button type="button" data-holosuite-action="close" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
        </footer>
      </div>
    </section>
  `;
}
function H(e) {
  e && (e.querySelectorAll("[data-holosuite-app]").forEach((t) => {
    t.addEventListener("click", (n) => {
      be(n.currentTarget.dataset.holosuiteApp ?? "");
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
      i == null || i.setWhatsNewFilter($e(r));
    });
  }), e.querySelectorAll("[data-holosuite-action='close']").forEach((t) => {
    t.addEventListener("click", () => i == null ? void 0 : i.close());
  }));
}
function $e(e) {
  const t = String(e ?? "");
  return t === "free" || t === "premium" || t === "installed" ? t : "all";
}
class N extends oe {
  constructor() {
    super(...arguments);
    S(this, "currentView", "apps");
    S(this, "whatsNewFilter", "all");
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-launcher",
      title: "HoloSuite",
      classes: ["holosuite-launcher-window"],
      popOut: !0,
      resizable: !1,
      width: 420,
      height: "auto"
    });
  }
  async _renderInner() {
    return $(V(this.currentView, this.whatsNewFilter));
  }
  activateListeners(n) {
    super.activateListeners(n), H(w(n));
  }
  async _renderHTML() {
    const n = document.createElement("template");
    return n.innerHTML = V(this.currentView, this.whatsNewFilter).trim(), n.content;
  }
  _replaceHTML(n, r) {
    const o = this.getRenderTarget(r);
    if (!o) return;
    const s = n instanceof DocumentFragment || n instanceof HTMLElement ? n : w(n);
    s ? o.replaceChildren(s) : o.innerHTML = String(n ?? ""), H(o);
  }
  async close(n = {}) {
    return i = null, super.close(n);
  }
  getLauncherRoot() {
    var r;
    const n = w(this.element);
    return (n == null ? void 0 : n.querySelector(".holosuite-phone")) ?? ((r = n == null ? void 0 : n.closest) == null ? void 0 : r.call(n, ".holosuite-phone")) ?? document.querySelector("#holosuite-launcher .holosuite-phone");
  }
  getRenderTarget(n) {
    const r = w(n);
    return r ? r.querySelector(".window-content") ?? r.querySelector(".holosuite-launcher-window .window-content") ?? r : null;
  }
  updateRenderedView() {
    const n = this.getLauncherRoot();
    if (!n) return !1;
    const r = n.querySelector(".holosuite-status-bar"), o = n.querySelector(".holosuite-screen");
    return !r || !o ? !1 : (r.innerHTML = `
      <span>HoloSuite</span>
      ${Y(this.currentView)}
    `, o.innerHTML = this.currentView === "whats-new" ? J(this.whatsNewFilter) : K(), o.classList.toggle("holosuite-screen--whats-new", this.currentView === "whats-new"), H(n), !0);
  }
  showApps() {
    this.currentView = "apps", this.updateRenderedView() || this.render(!1);
  }
  showWhatsNew() {
    this.currentView = "whats-new", de(), this.updateRenderedView() || this.render(!1);
  }
  setWhatsNewFilter(n) {
    this.currentView = "whats-new", this.whatsNewFilter = n, this.updateRenderedView() || this.render(!1);
  }
  async _updateObject() {
  }
}
S(N, "DEFAULT_OPTIONS", {
  id: "holosuite-launcher",
  tag: "section",
  classes: ["holosuite-launcher-window"],
  window: {
    title: "HoloSuite",
    resizable: !1
  },
  position: {
    width: 420,
    height: "auto"
  }
});
const g = {
  registerApp(e) {
    const t = he(e);
    return t ? (p.set(t.id, t), i == null || i.render(!1), t) : null;
  },
  unregisterApp(e) {
    const t = p.delete(String(e ?? ""));
    return t && (i == null || i.render(!1)), t;
  },
  getApps() {
    return [...p.values()];
  },
  registerWhatsNew(e) {
    return U(e);
  },
  unregisterWhatsNew(e) {
    const t = f.delete(String(e ?? ""));
    return t && (i == null || i.render(!1)), t;
  },
  getWhatsNew() {
    return [...f.values()].sort(D);
  },
  async openLauncher() {
    i && i.rendered && !i.getLauncherRoot() && (i = null), i || (i = new N());
    try {
      await i.render(!0);
    } catch (e) {
      console.warn(`${c} | Recreating launcher after render failure.`, e), i = new N(), await i.render(!0);
    }
    return i;
  }
};
function Q() {
  const e = game.modules.get(c);
  if (game.holosuite = g, globalThis.HoloSuiteCoreApi = g, e)
    try {
      e.api = g;
    } catch (t) {
      console.warn(`${c} | Could not attach API to game.modules; using game.holosuite fallback.`, t);
    }
  Hooks.callAll(`${c}.apiReady`, g);
}
Hooks.once("init", () => {
  q(), ge(), Q();
});
Hooks.on("getSceneControlButtons", fe);
Hooks.on("renderSceneControls", (e, t) => me(t));
Hooks.on("renderSidebar", E);
Hooks.on("renderSidebarTab", E);
Hooks.once("ready", () => {
  Q(), q(), pe(), E(), Se(), console.log(`${c} | Ready. API available at game.modules.get("${c}").api`);
});
