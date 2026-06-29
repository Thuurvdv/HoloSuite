var j = Object.defineProperty;
var z = (e, t, n) => t in e ? j(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var k = (e, t, n) => z(e, typeof t != "symbol" ? t + "" : t, n);
function h(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function L(e, t) {
  return h(e) ? t.includes(String(e.name ?? "")) : !1;
}
function C(e) {
  if (!h(e) || !("tools" in e)) return !1;
  const t = String(e.name ?? "");
  return !["measure", "templates", "walls", "lighting", "sounds", "notes", "tiles", "drawings"].includes(t);
}
function U(e, t, n) {
  if (Array.isArray(e))
    return e.find((o) => L(o, t)) ?? (n ? e.find(C) : null) ?? null;
  if (!h(e)) return null;
  for (const o of t)
    if (h(e[o])) return e[o];
  return Object.values(e).find((o) => L(o, t)) ?? (n ? Object.values(e).find(C) : null) ?? null;
}
function Y(e) {
  const t = Object.values(e).map((n) => Number(n == null ? void 0 : n.order)).filter(Number.isFinite);
  return t.length ? Math.max(...t) + 1 : Object.keys(e).length;
}
function w(e, t, n = ["tokens", "token"], o = {}) {
  const i = U(e, n, o.allowFallback === !0);
  if (!i) return !1;
  const r = i.tools;
  return Array.isArray(r) ? r.some((l) => (l == null ? void 0 : l.name) === t.name) ? !1 : (r.push(t), !0) : !h(r) || r[t.name] ? !1 : (r[t.name] = { ...t, order: t.order ?? Y(r) }, !0);
}
const c = "holosuite-core", N = "disableForPlayers", D = "theme", E = "data-holosuite-foundry-generation", G = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
}, g = /* @__PURE__ */ new Map();
let a = null;
function q() {
  var n, o, i, r, l, u;
  const e = ((o = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : o.api) ?? ((i = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : i.api) ?? null, t = ((l = (r = globalThis.foundry) == null ? void 0 : r.applications) == null ? void 0 : l.api) ?? ((u = foundry == null ? void 0 : foundry.applications) == null ? void 0 : u.api) ?? null;
  return globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV2);
}
const K = q();
function d(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function m(e, t, n = `${t}s`) {
  return `${e} ${e === 1 ? t : n}`;
}
function S(e, t) {
  try {
    return game.settings.get(e, t);
  } catch {
    return null;
  }
}
function b(e) {
  var t;
  return ((t = game.modules.get(e)) == null ? void 0 : t.api) ?? null;
}
function W() {
  var e, t, n;
  return String(((t = (e = game.user) == null ? void 0 : e.character) == null ? void 0 : t.name) ?? ((n = game.user) == null ? void 0 : n.name) ?? "Player");
}
function J(e) {
  var t, n, o, i, r, l;
  if (e === "cybercall") {
    const u = p(S("cybercall", "contacts")), s = p(S("cybercall", "groupContacts"));
    return m(u.length + s.length, "link");
  }
  if (e === "bounty-board") {
    const u = p((n = (t = b("bounty-board")) == null ? void 0 : t.getAllBounties) == null ? void 0 : n.call(t, { includeHidden: !1 }));
    return m(u.length, "contract");
  }
  if (e === "csi-toolkit") {
    const u = Object.values(((i = (o = b("csi-toolkit")) == null ? void 0 : o.getCases) == null ? void 0 : i.call(o)) ?? {}).filter((s) => (s == null ? void 0 : s.visibility) !== "gm");
    return m(u.length, "case");
  }
  if (e === "galaxy-map") {
    const u = p((l = (r = b("galaxy-map")) == null ? void 0 : r.getMaps) == null ? void 0 : l.call(r)).filter((s) => (s == null ? void 0 : s.visibility) === "players");
    return m(u.length, "chart");
  }
  return "";
}
function p(e) {
  return Array.isArray(e) ? e : [];
}
function Q(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), o = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !t || !n || !o || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${c} | Ignoring invalid app registration.`, e), null) : {
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
function X(e) {
  var r;
  const t = ((r = game.user) == null ? void 0 : r.isGM) === !0;
  if (!t && v()) return;
  const n = () => f.openLauncher(), o = () => ({
    name: "holosuite-core-launcher",
    title: t ? "HoloSuite Command Deck" : "HoloSuite Player View",
    icon: B(),
    button: !0,
    visible: !0,
    onClick: n,
    onChange: n
  }), i = w(e, o(), ["tiles", "tile"]);
  w(e, o(), ["tokens", "token"], { allowFallback: !i });
}
function A() {
  document.querySelectorAll(".holosuite-sidebar-launcher, .holosuite-floating-launcher").forEach((e) => e.remove());
}
function P(e) {
  var o;
  if (e instanceof HTMLElement) return e;
  if (Array.isArray(e) && e[0] instanceof HTMLElement) return e[0];
  const t = e, n = ((o = t == null ? void 0 : t.get) == null ? void 0 : o.call(t, 0)) ?? (t == null ? void 0 : t[0]);
  return n instanceof HTMLElement ? n : null;
}
function Z(e) {
  var r;
  const t = ((r = game.user) == null ? void 0 : r.isGM) === !0;
  if (!t && v()) return;
  const n = P(e) ?? document.querySelector("#controls, #scene-controls");
  if (!n || n.querySelector("[data-tool='holosuite-core-launcher']")) return;
  const o = n.querySelector(
    ".control-tools.active, .sub-controls.active, .scene-control-tools.active, .control-tools, .sub-controls, .scene-control-tools"
  );
  if (!o) return;
  const i = document.createElement("li");
  i.className = "control-tool holosuite-scene-control", i.dataset.tool = "holosuite-core-launcher", i.title = t ? "HoloSuite Command Deck" : "HoloSuite Player View", i.innerHTML = `<i class="${B()}"></i>`, i.addEventListener("click", (l) => {
    l.preventDefault(), l.stopPropagation(), f.openLauncher();
  }), o.appendChild(i);
}
function ee() {
  game.settings.register(c, D, {
    name: "HoloSuite Theme",
    hint: "Changes the shared color theme used by HoloSuite windows.",
    scope: "world",
    config: !0,
    type: String,
    choices: G,
    default: "default",
    restricted: !0,
    onChange: (e) => _(e)
  }), game.settings.register(c, N, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !0
  }), game.settings.registerMenu(c, "launcher", {
    name: "HoloSuite Command Deck",
    label: "Open HoloSuite",
    hint: "Open the HoloSuite launcher and registered app deck.",
    icon: "fas fa-terminal",
    type: T,
    restricted: !0
  });
}
function te(e) {
  return Object.hasOwn(G, String(e)) ? String(e) : "default";
}
function _(e) {
  const t = te(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const o of n)
    t === "default" ? o.removeAttribute("data-holosuite-theme") : o.setAttribute("data-holosuite-theme", t);
}
function ne() {
  _(S(c, D));
}
function F() {
  var t, n, o;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((o = game == null ? void 0 : game.release) == null ? void 0 : o.generation));
  return Number.isFinite(e) ? e : null;
}
function I() {
  const e = F(), t = [document.documentElement, document.body].filter(Boolean);
  for (const n of t)
    e === null ? n.removeAttribute(E) : n.setAttribute(E, String(e));
}
function B() {
  return F() === 12 ? "fa-solid fa-terminal" : "fa-solid fa-mobile-screen-button";
}
function v() {
  try {
    return game.settings.get(c, N) === !0;
  } catch {
    return !1;
  }
}
function R(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 ? !0 : v() ? !1 : e.playerVisible !== !1;
}
async function oe(e) {
  var n, o, i, r;
  const t = g.get(e);
  return t ? R(t) ? t.open() : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, `${t.title} is not available from the player view.`), null) : ((o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, `HoloSuite app "${e}" is not registered.`), null);
}
function M() {
  var u;
  const e = ((u = game.user) == null ? void 0 : u.isGM) === !0, t = [...g.values()].filter(R).sort((s, y) => s.title.localeCompare(y.title)), n = e ? "GM Command Deck" : "Player Link", o = e ? "Apps" : "Commlink", i = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", r = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">Active User</span>
        <strong>${d(W())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>LINK STABLE</span>
      </div>
    </section>
  `, l = t.length ? t.map((s) => {
    const y = s.title, V = e && s.description ? `<p>${d(s.description)}</p>` : "", H = e ? "" : J(s.id);
    return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${d(s.id)}">
          <span class="holosuite-app-icon"><i class="${d(s.icon)}"></i></span>
          <span class="holosuite-app-title">${d(y)}</span>
          ${V}
          ${H ? `<span class="holosuite-app-count">${d(H)}</span>` : ""}
        </button>
      `;
  }).join("") : `<p class="holosuite-empty">${d(i)}</p>`;
  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
        </header>
        <main class="holosuite-screen">
          <div class="holosuite-screen-heading">
            <div>
              <span class="holosuite-kicker">${d(n)}</span>
              <h2>${d(o)}</h2>
            </div>
          </div>
          ${r}
          <div class="holosuite-app-grid">
            ${l}
          </div>
        </main>
        <footer class="holosuite-dock">
          <button type="button" data-holosuite-action="close" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
        </footer>
      </div>
    </section>
  `;
}
function O(e) {
  e && (e.querySelectorAll("[data-holosuite-app]").forEach((t) => {
    t.addEventListener("click", (n) => {
      oe(n.currentTarget.dataset.holosuiteApp ?? "");
    });
  }), e.querySelectorAll("[data-holosuite-action='close']").forEach((t) => {
    t.addEventListener("click", () => a == null ? void 0 : a.close());
  }));
}
class T extends K {
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
    return $(M());
  }
  activateListeners(t) {
    super.activateListeners(t), O(P(t));
  }
  async _renderHTML() {
    const t = document.createElement("template");
    return t.innerHTML = M().trim(), t.content;
  }
  _replaceHTML(t, n) {
    n.replaceChildren(t), O(n);
  }
  async close(t = {}) {
    return a = null, super.close(t);
  }
  async _updateObject() {
  }
}
k(T, "DEFAULT_OPTIONS", {
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
const f = {
  registerApp(e) {
    const t = Q(e);
    return t ? (g.set(t.id, t), a == null || a.render(!1), t) : null;
  },
  unregisterApp(e) {
    const t = g.delete(String(e ?? ""));
    return t && (a == null || a.render(!1)), t;
  },
  getApps() {
    return [...g.values()];
  },
  async openLauncher() {
    return a || (a = new T()), await a.render(!0), a;
  }
};
function x() {
  const e = game.modules.get(c);
  if (game.holosuite = f, globalThis.HoloSuiteCoreApi = f, e)
    try {
      e.api = f;
    } catch (t) {
      console.warn(`${c} | Could not attach API to game.modules; using game.holosuite fallback.`, t);
    }
  Hooks.callAll(`${c}.apiReady`, f);
}
Hooks.once("init", () => {
  I(), ee(), x();
});
Hooks.on("getSceneControlButtons", X);
Hooks.on("renderSceneControls", (e, t) => Z(t));
Hooks.on("renderSidebar", A);
Hooks.on("renderSidebarTab", A);
Hooks.once("ready", () => {
  x(), I(), ne(), A(), console.log(`${c} | Ready. API available at game.modules.get("${c}").api`);
});
