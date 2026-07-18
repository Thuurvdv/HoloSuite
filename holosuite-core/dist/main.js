var te = Object.defineProperty;
var ne = (e, t, n) => t in e ? te(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var y = (e, t, n) => ne(e, typeof t != "symbol" ? t + "" : t, n);
function b(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function W(e, t) {
  return b(e) ? t.includes(String(e.name ?? "")) : !1;
}
function I(e) {
  if (!b(e) || !("tools" in e)) return !1;
  const t = String(e.name ?? "");
  return !["measure", "templates", "walls", "lighting", "sounds", "notes", "tiles", "drawings"].includes(t);
}
function re(e, t, n) {
  if (Array.isArray(e))
    return e.find((r) => W(r, t)) ?? (n ? e.find(I) : null) ?? null;
  if (!b(e)) return null;
  for (const r of t)
    if (b(e[r])) return e[r];
  return Object.values(e).find((r) => W(r, t)) ?? (n ? Object.values(e).find(I) : null) ?? null;
}
function oe(e) {
  const t = Object.values(e).map((n) => Number(n == null ? void 0 : n.order)).filter(Number.isFinite);
  return t.length ? Math.max(...t) + 1 : Object.keys(e).length;
}
function F(e, t, n = ["tokens", "token"], r = {}) {
  const o = re(e, n, r.allowFallback === !0);
  if (!o) return !1;
  const s = o.tools;
  return Array.isArray(s) ? s.some((u) => (u == null ? void 0 : u.name) === t.name) ? !1 : (s.push(t), !0) : !b(s) || s[t.name] ? !1 : (s[t.name] = { ...t, order: t.order ?? oe(s) }, !0);
}
const c = "holosuite-core", V = "disableForPlayers", _ = "deviceStyle", P = "theme", E = "whatsNewLastSeen", O = "data-holosuite-foundry-generation", se = `modules/${c}/data/whats-new.json`, R = {
  base: "Base",
  "space-police": "Space Police"
}, B = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
}, p = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map();
let i = null;
function ie() {
  var n, r, o, s, u, d;
  const e = ((r = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : r.api) ?? ((o = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : o.api) ?? null, t = ((u = (s = globalThis.foundry) == null ? void 0 : s.applications) == null ? void 0 : u.api) ?? ((d = foundry == null ? void 0 : foundry.applications) == null ? void 0 : d.api) ?? null;
  return globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV2);
}
const ae = ie();
function a(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function v(e, t, n = `${t}s`) {
  return `${e} ${e === 1 ? t : n}`;
}
function S(e, t) {
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
function le() {
  var e, t, n;
  return String(((t = (e = game.user) == null ? void 0 : e.character) == null ? void 0 : t.name) ?? ((n = game.user) == null ? void 0 : n.name) ?? "Player");
}
function ce(e) {
  var t, n, r, o, s, u;
  if (e === "cybercall") {
    const d = h(S("cybercall", "contacts")), l = h(S("cybercall", "groupContacts"));
    return v(d.length + l.length, "link");
  }
  if (e === "bounty-board") {
    const d = h((n = (t = L("bounty-board")) == null ? void 0 : t.getAllBounties) == null ? void 0 : n.call(t, { includeHidden: !1 }));
    return v(d.length, "contract");
  }
  if (e === "csi-toolkit") {
    const d = Object.values(((o = (r = L("csi-toolkit")) == null ? void 0 : r.getCases) == null ? void 0 : o.call(r)) ?? {}).filter((l) => (l == null ? void 0 : l.visibility) !== "gm");
    return v(d.length, "case");
  }
  if (e === "galaxy-map") {
    const d = h((u = (s = L("galaxy-map")) == null ? void 0 : s.getMaps) == null ? void 0 : u.call(s)).filter((l) => (l == null ? void 0 : l.visibility) === "players");
    return v(d.length, "chart");
  }
  return "";
}
function h(e) {
  return Array.isArray(e) ? e : [];
}
function ue(e) {
  const t = String((e == null ? void 0 : e.title) ?? "").trim();
  if (!t) return null;
  const n = h(e == null ? void 0 : e.tags).map((r) => String(r ?? "").trim()).filter(Boolean).slice(0, 4);
  return {
    title: t,
    summary: String((e == null ? void 0 : e.summary) ?? "").trim(),
    tags: n
  };
}
function de(e) {
  const t = String((e == null ? void 0 : e.moduleId) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), r = h(e == null ? void 0 : e.entries).map((s) => ue(s)).filter((s) => !!s);
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
function G(e, t) {
  return A(t) - A(e) || e.title.localeCompare(t.title);
}
function j(e) {
  var t, n;
  return ((n = (t = game.modules) == null ? void 0 : t.has) == null ? void 0 : n.call(t, e)) === !0;
}
function he() {
  const e = Number(S(c, E));
  return Number.isFinite(e) ? e : 0;
}
function fe() {
  const e = he();
  return [...f.values()].filter((t) => A(t) > e).reduce((t, n) => t + n.entries.length, 0);
}
function ge() {
  try {
    game.settings.set(c, E, Date.now());
  } catch (e) {
    console.warn(`${c} | Could not update what's new read state.`, e);
  }
}
function me(e) {
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
function we(e) {
  var s;
  const t = ((s = game.user) == null ? void 0 : s.isGM) === !0;
  if (!t && C()) return;
  const n = () => m.openLauncher(), r = () => ({
    name: "holosuite-core-launcher",
    title: t ? "HoloSuite Command Deck" : "HoloSuite Player View",
    icon: Y(),
    button: !0,
    visible: !0,
    onClick: n,
    onChange: n
  }), o = F(e, r(), ["tiles", "tile"]);
  F(e, r(), ["tokens", "token"], { allowFallback: !o });
}
function k() {
  document.querySelectorAll(".holosuite-sidebar-launcher, .holosuite-floating-launcher").forEach((e) => e.remove());
}
function w(e) {
  var r;
  if (e instanceof HTMLElement) return e;
  if (Array.isArray(e) && e[0] instanceof HTMLElement) return e[0];
  const t = e, n = ((r = t == null ? void 0 : t.get) == null ? void 0 : r.call(t, 0)) ?? (t == null ? void 0 : t[0]);
  return n instanceof HTMLElement ? n : null;
}
function pe(e) {
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
  o.className = "control-tool holosuite-scene-control", o.dataset.tool = "holosuite-core-launcher", o.title = t ? "HoloSuite Command Deck" : "HoloSuite Player View", o.innerHTML = `<i class="${Y()}"></i>`, o.addEventListener("click", (u) => {
    u.preventDefault(), u.stopPropagation(), m.openLauncher();
  }), r.appendChild(o);
}
function be() {
  game.settings.register(c, _, {
    name: "HoloSuite Device Style",
    hint: "Changes the launcher frame style without changing the launcher size.",
    scope: "world",
    config: !0,
    type: String,
    choices: R,
    default: "base",
    restricted: !0,
    onChange: (e) => z(e)
  }), game.settings.register(c, P, {
    name: "HoloSuite Theme",
    hint: "Changes the shared color theme used by HoloSuite windows.",
    scope: "world",
    config: !0,
    type: String,
    choices: B,
    default: "default",
    restricted: !0,
    onChange: (e) => q(e)
  }), game.settings.register(c, V, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !0
  }), game.settings.register(c, E, {
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
    type: T,
    restricted: !0
  });
}
function Se(e) {
  return Object.hasOwn(R, String(e)) ? String(e) : "base";
}
function ye(e) {
  return Object.hasOwn(B, String(e)) ? String(e) : "default";
}
function z(e) {
  const t = Se(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const r of n)
    t === "base" ? r.removeAttribute("data-holosuite-device-style") : r.setAttribute("data-holosuite-device-style", t);
}
function q(e) {
  const t = ye(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const r of n)
    t === "default" ? r.removeAttribute("data-holosuite-theme") : r.setAttribute("data-holosuite-theme", t);
}
function ve() {
  z(S(c, _));
}
function $e() {
  q(S(c, P));
}
function x() {
  var t, n, r;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((r = game == null ? void 0 : game.release) == null ? void 0 : r.generation));
  return Number.isFinite(e) ? e : null;
}
function U() {
  const e = x(), t = [document.documentElement, document.body].filter(Boolean);
  for (const n of t)
    e === null ? n.removeAttribute(O) : n.setAttribute(O, String(e));
}
function Y() {
  return x() === 12 ? "fa-solid fa-terminal" : "fa-solid fa-mobile-screen-button";
}
function C() {
  try {
    return game.settings.get(c, V) === !0;
  } catch {
    return !1;
  }
}
function K(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 ? !0 : C() ? !1 : e.playerVisible !== !1;
}
async function Te(e) {
  var n, r, o, s;
  const t = p.get(e);
  return t ? K(t) ? t.open() : ((s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, `${t.title} is not available from the player view.`), null) : ((r = (n = ui.notifications) == null ? void 0 : n.warn) == null || r.call(n, `HoloSuite app "${e}" is not registered.`), null);
}
function J(e, t = {}) {
  const n = de(e);
  return n ? t.replace === !1 && f.has(n.moduleId) ? f.get(n.moduleId) ?? null : (f.set(n.moduleId, n), i == null || i.render(!1), n) : null;
}
async function Ne() {
  try {
    const e = await fetch(se, { cache: "no-cache" });
    if (!e.ok) throw new Error(`HTTP ${e.status}`);
    const t = await e.json(), n = h(t == null ? void 0 : t.modules);
    for (const r of n)
      J(r, { replace: !1 });
  } catch (e) {
    console.warn(`${c} | Could not load bundled what's new catalog.`, e);
  }
}
function Q(e) {
  const t = fe(), n = t > 0 ? `<span>${a(t)}</span>` : "", r = e === "whats-new" ? "apps" : "whats-new", o = e === "whats-new" ? "Back to HoloSuite apps" : "What's New", s = e === "whats-new" ? "fa-solid fa-arrow-left" : "fa-solid fa-star";
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
function Le(e) {
  return `
    <span class="holosuite-app-icon" data-holosuite-app-icon="${a(e.id)}">
      <i class="${a(e.icon)}"></i>
    </span>
  `;
}
function X() {
  var d;
  const e = ((d = game.user) == null ? void 0 : d.isGM) === !0, t = [...p.values()].filter(K).sort((l, g) => l.title.localeCompare(g.title)), n = e ? "GM Command Deck" : "Player Link", r = e ? "Apps" : "Commlink", o = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", s = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">Active User</span>
        <strong>${a(le())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>LINK STABLE</span>
      </div>
    </section>
  `, u = t.map((l) => {
    const g = l.title, N = e && l.description ? `<p>${a(l.description)}</p>` : "", M = e ? "" : ce(l.id);
    return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${a(l.id)}">
          ${Le(l)}
          <span class="holosuite-app-title">${a(g)}</span>
          ${N}
          ${M ? `<span class="holosuite-app-count">${a(M)}</span>` : ""}
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
      ${t.length ? u : `<p class="holosuite-empty">${a(o)}</p>`}
    </div>
  `;
}
function He(e) {
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
function Ae(e) {
  return [...f.values()].filter((t) => e === "installed" ? j(t.moduleId) : e === "free" || e === "premium" ? t.tier === e : !0).sort(G);
}
function Z(e) {
  const t = Ae(e), n = t.length ? t.map((r) => {
    const o = j(r.moduleId), s = r.tier === "premium" ? "Premium" : "Free", u = r.icon || (r.tier === "premium" ? "fa-solid fa-gem" : "fa-solid fa-cube"), d = r.entries.map((l) => {
      var g;
      return `
        <li>
          <strong>${a(l.title)}</strong>
          ${l.summary ? `<span>${a(l.summary)}</span>` : ""}
          ${(g = l.tags) != null && g.length ? `
            <div class="holosuite-whats-new-tags">
              ${l.tags.map((N) => `<span>${a(N)}</span>`).join("")}
            </div>
          ` : ""}
        </li>
      `;
    }).join("");
    return `
        <article class="holosuite-whats-new-card">
          <header>
            <span class="holosuite-whats-new-icon"><i class="${a(u)}"></i></span>
            <div>
              <h3>${a(r.title)}</h3>
              <p>
                <span>${a(s)}</span>
                ${r.version ? `<span>v${a(r.version)}</span>` : ""}
                ${r.updated ? `<span>${a(r.updated)}</span>` : ""}
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
    ${He(e)}
    <div class="holosuite-whats-new-list">
      ${n}
    </div>
  `;
}
function D(e = "apps", t = "all") {
  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
          ${Q(e)}
        </header>
        <main class="holosuite-screen ${e === "whats-new" ? "holosuite-screen--whats-new" : ""}">
          ${e === "whats-new" ? Z(t) : X()}
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
      Te(n.currentTarget.dataset.holosuiteApp ?? "");
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
      i == null || i.setWhatsNewFilter(Ee(r));
    });
  }), e.querySelectorAll("[data-holosuite-action='close']").forEach((t) => {
    t.addEventListener("click", () => i == null ? void 0 : i.close());
  }));
}
function Ee(e) {
  const t = String(e ?? "");
  return t === "free" || t === "premium" || t === "installed" ? t : "all";
}
class T extends ae {
  constructor() {
    super(...arguments);
    y(this, "currentView", "apps");
    y(this, "whatsNewFilter", "all");
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
    return $(D(this.currentView, this.whatsNewFilter));
  }
  activateListeners(n) {
    super.activateListeners(n), H(w(n));
  }
  async _renderHTML() {
    const n = document.createElement("template");
    return n.innerHTML = D(this.currentView, this.whatsNewFilter).trim(), n.content;
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
      ${Q(this.currentView)}
    `, o.innerHTML = this.currentView === "whats-new" ? Z(this.whatsNewFilter) : X(), o.classList.toggle("holosuite-screen--whats-new", this.currentView === "whats-new"), H(n), !0);
  }
  showApps() {
    this.currentView = "apps", this.updateRenderedView() || this.render(!1);
  }
  showWhatsNew() {
    this.currentView = "whats-new", ge(), this.updateRenderedView() || this.render(!1);
  }
  setWhatsNewFilter(n) {
    this.currentView = "whats-new", this.whatsNewFilter = n, this.updateRenderedView() || this.render(!1);
  }
  async _updateObject() {
  }
}
y(T, "DEFAULT_OPTIONS", {
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
const m = {
  registerApp(e) {
    const t = me(e);
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
    return J(e);
  },
  unregisterWhatsNew(e) {
    const t = f.delete(String(e ?? ""));
    return t && (i == null || i.render(!1)), t;
  },
  getWhatsNew() {
    return [...f.values()].sort(G);
  },
  async openLauncher() {
    i && i.rendered && !i.getLauncherRoot() && (i = null), i || (i = new T());
    try {
      await i.render(!0);
    } catch (e) {
      console.warn(`${c} | Recreating launcher after render failure.`, e), i = new T(), await i.render(!0);
    }
    return i;
  }
};
function ee() {
  const e = game.modules.get(c);
  if (game.holosuite = m, globalThis.HoloSuiteCoreApi = m, e)
    try {
      e.api = m;
    } catch (t) {
      console.warn(`${c} | Could not attach API to game.modules; using game.holosuite fallback.`, t);
    }
  Hooks.callAll(`${c}.apiReady`, m);
}
Hooks.once("init", () => {
  U(), be(), ee();
});
Hooks.on("getSceneControlButtons", we);
Hooks.on("renderSceneControls", (e, t) => pe(t));
Hooks.on("renderSidebar", k);
Hooks.on("renderSidebarTab", k);
Hooks.once("ready", () => {
  ee(), U(), ve(), $e(), k(), Ne(), console.log(`${c} | Ready. API available at game.modules.get("${c}").api`);
});
