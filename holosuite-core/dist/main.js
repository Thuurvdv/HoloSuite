var x = Object.defineProperty;
var B = (e, t, n) => t in e ? x(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var L = (e, t, n) => B(e, typeof t != "symbol" ? t + "" : t, n);
function g(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function T(e, t) {
  return g(e) ? t.includes(String(e.name ?? "")) : !1;
}
function C(e) {
  if (!g(e) || !("tools" in e)) return !1;
  const t = String(e.name ?? "");
  return !["measure", "templates", "walls", "lighting", "sounds", "notes", "tiles", "drawings"].includes(t);
}
function V(e, t, n) {
  if (Array.isArray(e))
    return e.find((o) => T(o, t)) ?? (n ? e.find(C) : null) ?? null;
  if (!g(e)) return null;
  for (const o of t)
    if (g(e[o])) return e[o];
  return Object.values(e).find((o) => T(o, t)) ?? (n ? Object.values(e).find(C) : null) ?? null;
}
function R(e) {
  const t = Object.values(e).map((n) => Number(n == null ? void 0 : n.order)).filter(Number.isFinite);
  return t.length ? Math.max(...t) + 1 : Object.keys(e).length;
}
function w(e, t, n = ["tokens", "token"], o = {}) {
  const i = V(e, n, o.allowFallback === !0);
  if (!i) return !1;
  const r = i.tools;
  return Array.isArray(r) ? r.some((l) => (l == null ? void 0 : l.name) === t.name) ? !1 : (r.push(t), !0) : !g(r) || r[t.name] ? !1 : (r[t.name] = { ...t, order: t.order ?? R(r) }, !0);
}
const u = "holosuite-core", O = "disableForPlayers", P = "theme", D = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
}, h = /* @__PURE__ */ new Map();
let a = null;
function j() {
  var n, o, i, r, l, c;
  const e = ((o = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : o.api) ?? ((i = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : i.api) ?? null, t = ((l = (r = globalThis.foundry) == null ? void 0 : r.applications) == null ? void 0 : l.api) ?? ((c = foundry == null ? void 0 : foundry.applications) == null ? void 0 : c.api) ?? null;
  return globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV2);
}
const z = j();
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
function U() {
  var e, t, n;
  return String(((t = (e = game.user) == null ? void 0 : e.character) == null ? void 0 : t.name) ?? ((n = game.user) == null ? void 0 : n.name) ?? "Player");
}
function q(e) {
  var t, n, o, i, r, l;
  if (e === "cybercall") {
    const c = p(S("cybercall", "contacts")), s = p(S("cybercall", "groupContacts"));
    return m(c.length + s.length, "link");
  }
  if (e === "bounty-board") {
    const c = p((n = (t = b("bounty-board")) == null ? void 0 : t.getAllBounties) == null ? void 0 : n.call(t, { includeHidden: !1 }));
    return m(c.length, "contract");
  }
  if (e === "csi-toolkit") {
    const c = Object.values(((i = (o = b("csi-toolkit")) == null ? void 0 : o.getCases) == null ? void 0 : i.call(o)) ?? {}).filter((s) => (s == null ? void 0 : s.visibility) !== "gm");
    return m(c.length, "case");
  }
  if (e === "galaxy-map") {
    const c = p((l = (r = b("galaxy-map")) == null ? void 0 : r.getMaps) == null ? void 0 : l.call(r)).filter((s) => (s == null ? void 0 : s.visibility) === "players");
    return m(c.length, "chart");
  }
  return "";
}
function p(e) {
  return Array.isArray(e) ? e : [];
}
function K(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), o = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !t || !n || !o || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${u} | Ignoring invalid app registration.`, e), null) : {
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
function W(e) {
  var r;
  const t = ((r = game.user) == null ? void 0 : r.isGM) === !0;
  if (!t && A()) return;
  const n = () => f.openLauncher(), o = () => ({
    name: "holosuite-core-launcher",
    title: t ? "HoloSuite Command Deck" : "HoloSuite Player View",
    icon: "fa-solid fa-terminal",
    button: !0,
    visible: !0,
    onClick: n,
    onChange: n
  }), i = w(e, o(), ["tiles", "tile"]);
  w(e, o(), ["tokens", "token"], { allowFallback: !i });
}
function v() {
  document.querySelectorAll(".holosuite-sidebar-launcher, .holosuite-floating-launcher").forEach((e) => e.remove());
}
function _(e) {
  var o;
  if (e instanceof HTMLElement) return e;
  if (Array.isArray(e) && e[0] instanceof HTMLElement) return e[0];
  const t = e, n = ((o = t == null ? void 0 : t.get) == null ? void 0 : o.call(t, 0)) ?? (t == null ? void 0 : t[0]);
  return n instanceof HTMLElement ? n : null;
}
function Y(e) {
  var r;
  const t = ((r = game.user) == null ? void 0 : r.isGM) === !0;
  if (!t && A()) return;
  const n = _(e) ?? document.querySelector("#controls, #scene-controls");
  if (!n || n.querySelector("[data-tool='holosuite-core-launcher']")) return;
  const o = n.querySelector(
    ".control-tools.active, .sub-controls.active, .scene-control-tools.active, .control-tools, .sub-controls, .scene-control-tools"
  );
  if (!o) return;
  const i = document.createElement("li");
  i.className = "control-tool holosuite-scene-control", i.dataset.tool = "holosuite-core-launcher", i.title = t ? "HoloSuite Command Deck" : "HoloSuite Player View", i.innerHTML = '<i class="fa-solid fa-terminal"></i>', i.addEventListener("click", (l) => {
    l.preventDefault(), l.stopPropagation(), f.openLauncher();
  }), o.appendChild(i);
}
function J() {
  game.settings.register(u, P, {
    name: "HoloSuite Theme",
    hint: "Changes the shared color theme used by HoloSuite windows.",
    scope: "world",
    config: !0,
    type: String,
    choices: D,
    default: "default",
    restricted: !0,
    onChange: (e) => G(e)
  }), game.settings.register(u, O, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !0
  }), game.settings.registerMenu(u, "launcher", {
    name: "HoloSuite Command Deck",
    label: "Open HoloSuite",
    hint: "Open the HoloSuite launcher and registered app deck.",
    icon: "fas fa-terminal",
    type: H,
    restricted: !0
  });
}
function Q(e) {
  return Object.hasOwn(D, String(e)) ? String(e) : "default";
}
function G(e) {
  const t = Q(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const o of n)
    t === "default" ? o.removeAttribute("data-holosuite-theme") : o.setAttribute("data-holosuite-theme", t);
}
function X() {
  G(S(u, P));
}
function A() {
  try {
    return game.settings.get(u, O) === !0;
  } catch {
    return !1;
  }
}
function N(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 ? !0 : A() ? !1 : e.playerVisible !== !1;
}
async function Z(e) {
  var n, o, i, r;
  const t = h.get(e);
  return t ? N(t) ? t.open() : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, `${t.title} is not available from the player view.`), null) : ((o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, `HoloSuite app "${e}" is not registered.`), null);
}
function M() {
  var c;
  const e = ((c = game.user) == null ? void 0 : c.isGM) === !0, t = [...h.values()].filter(N).sort((s, y) => s.title.localeCompare(y.title)), n = e ? "GM Command Deck" : "Player Link", o = e ? "Apps" : "Commlink", i = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", r = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">Active User</span>
        <strong>${d(U())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>LINK STABLE</span>
      </div>
    </section>
  `, l = t.length ? t.map((s) => {
    const y = s.title, I = e && s.description ? `<p>${d(s.description)}</p>` : "", k = e ? "" : q(s.id);
    return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${d(s.id)}">
          <span class="holosuite-app-icon"><i class="${d(s.icon)}"></i></span>
          <span class="holosuite-app-title">${d(y)}</span>
          ${I}
          ${k ? `<span class="holosuite-app-count">${d(k)}</span>` : ""}
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
function E(e) {
  e && (e.querySelectorAll("[data-holosuite-app]").forEach((t) => {
    t.addEventListener("click", (n) => {
      Z(n.currentTarget.dataset.holosuiteApp ?? "");
    });
  }), e.querySelectorAll("[data-holosuite-action='close']").forEach((t) => {
    t.addEventListener("click", () => a == null ? void 0 : a.close());
  }));
}
class H extends z {
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
    super.activateListeners(t), E(_(t));
  }
  async _renderHTML() {
    const t = document.createElement("template");
    return t.innerHTML = M().trim(), t.content;
  }
  _replaceHTML(t, n) {
    n.replaceChildren(t), E(n);
  }
  async close(t = {}) {
    return a = null, super.close(t);
  }
  async _updateObject() {
  }
}
L(H, "DEFAULT_OPTIONS", {
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
    const t = K(e);
    return t ? (h.set(t.id, t), a == null || a.render(!1), t) : null;
  },
  unregisterApp(e) {
    const t = h.delete(String(e ?? ""));
    return t && (a == null || a.render(!1)), t;
  },
  getApps() {
    return [...h.values()];
  },
  async openLauncher() {
    return a || (a = new H()), await a.render(!0), a;
  }
};
function F() {
  const e = game.modules.get(u);
  if (game.holosuite = f, globalThis.HoloSuiteCoreApi = f, e)
    try {
      e.api = f;
    } catch (t) {
      console.warn(`${u} | Could not attach API to game.modules; using game.holosuite fallback.`, t);
    }
  Hooks.callAll(`${u}.apiReady`, f);
}
Hooks.once("init", () => {
  J(), F();
});
Hooks.on("getSceneControlButtons", W);
Hooks.on("renderSceneControls", (e, t) => Y(t));
Hooks.on("renderSidebar", v);
Hooks.on("renderSidebarTab", v);
Hooks.once("ready", () => {
  F(), X(), v(), console.log(`${u} | Ready. API available at game.modules.get("${u}").api`);
});
