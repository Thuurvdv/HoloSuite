var G = Object.defineProperty;
var N = (e, t, n) => t in e ? G(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var S = (e, t, n) => N(e, typeof t != "symbol" ? t + "" : t, n);
const f = "holosuite-core", O = "disableForPlayers", g = /* @__PURE__ */ new Map();
let u = null;
var H, w;
const x = globalThis.Application ?? ((w = (H = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : H.api) == null ? void 0 : w.Application);
var T, M;
const L = (M = (T = foundry == null ? void 0 : foundry.applications) == null ? void 0 : T.api) == null ? void 0 : M.ApplicationV2;
function c(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function m(e, t, n = `${t}s`) {
  return `${e} ${e === 1 ? t : n}`;
}
function k(e, t) {
  try {
    return game.settings.get(e, t);
  } catch {
    return null;
  }
}
function y(e) {
  var t;
  return ((t = game.modules.get(e)) == null ? void 0 : t.api) ?? null;
}
function B() {
  var e, t, n;
  return String(((t = (e = game.user) == null ? void 0 : e.character) == null ? void 0 : t.name) ?? ((n = game.user) == null ? void 0 : n.name) ?? "Player");
}
function I(e) {
  var t, n, o, i, r, a;
  if (e === "cybercall") {
    const l = p(k("cybercall", "contacts")), s = p(k("cybercall", "groupContacts"));
    return m(l.length + s.length, "link");
  }
  if (e === "bounty-board") {
    const l = p((n = (t = y("bounty-board")) == null ? void 0 : t.getAllBounties) == null ? void 0 : n.call(t, { includeHidden: !1 }));
    return m(l.length, "contract");
  }
  if (e === "csi-toolkit") {
    const l = Object.values(((i = (o = y("csi-toolkit")) == null ? void 0 : o.getCases) == null ? void 0 : i.call(o)) ?? {}).filter((s) => (s == null ? void 0 : s.visibility) !== "gm");
    return m(l.length, "case");
  }
  if (e === "galaxy-map") {
    const l = p((a = (r = y("galaxy-map")) == null ? void 0 : r.getMaps) == null ? void 0 : a.call(r)).filter((s) => (s == null ? void 0 : s.visibility) === "players");
    return m(l.length, "chart");
  }
  return "";
}
function p(e) {
  return Array.isArray(e) ? e : [];
}
function F(e) {
  var t;
  return !!((t = e == null ? void 0 : e.constructor) != null && t.DEFAULT_OPTIONS);
}
function b(e, t = !1) {
  var n;
  return F(e) ? e.render({ force: t }) : (n = e == null ? void 0 : e.render) == null ? void 0 : n.call(e, t);
}
function R(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), o = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !t || !n || !o || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${f} | Ignoring invalid app registration.`, e), null) : {
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
function j(e) {
  var a, l, s;
  const t = ((a = game.user) == null ? void 0 : a.isGM) === !0;
  if (!t && E()) return;
  const n = () => A.openLauncher(), o = {
    name: "holosuite-core-launcher",
    title: t ? "HoloSuite Command Deck" : "HoloSuite Player View",
    icon: "fa-solid fa-mobile-screen-button",
    button: !0,
    visible: !0,
    onClick: n,
    onChange: n
  };
  if (Array.isArray(e)) {
    const d = e.find((h) => h.name === "token") ?? e[0];
    d != null && d.tools && !((s = (l = d.tools).some) != null && s.call(l, (h) => h.name === o.name)) && d.tools.push(o);
    return;
  }
  const i = e, r = (i == null ? void 0 : i.tokens) ?? (i == null ? void 0 : i.token) ?? Object.values(i ?? {})[0];
  !(r != null && r.tools) || r.tools[o.name] || (r.tools[o.name] = { ...o, order: Object.keys(r.tools).length });
}
function z() {
  game.settings.register(f, O, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  });
}
function E() {
  try {
    return game.settings.get(f, O) === !0;
  } catch {
    return !1;
  }
}
function P(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 ? !0 : E() ? !1 : e.playerVisible !== !1;
}
async function C(e) {
  var n, o, i, r;
  const t = g.get(e);
  return t ? P(t) ? t.open() : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, `${t.title} is not available from the player view.`), null) : ((o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, `HoloSuite app "${e}" is not registered.`), null);
}
function D() {
  var l;
  const e = ((l = game.user) == null ? void 0 : l.isGM) === !0, t = [...g.values()].filter(P).sort((s, d) => s.title.localeCompare(d.title)), n = e ? "GM Command Deck" : "Player Link", o = e ? "Apps" : "Commlink", i = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", r = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">Active User</span>
        <strong>${c(B())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>LINK STABLE</span>
      </div>
    </section>
  `, a = t.length ? t.map((s) => {
    const d = s.title, h = e && s.description ? s.description : "", v = e ? "" : I(s.id), _ = h ? ` title="${c(h)}" data-tooltip="${c(h)}"` : "";
    return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${c(s.id)}"${_}>
          <span class="holosuite-app-icon"><i class="${c(s.icon)}"></i></span>
          <span class="holosuite-app-title">${c(d)}</span>
          ${v ? `<span class="holosuite-app-count">${c(v)}</span>` : ""}
        </button>
      `;
  }).join("") : `<p class="holosuite-empty">${c(i)}</p>`;
  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
        </header>
        <main class="holosuite-screen">
          <div class="holosuite-screen-heading">
            <div>
              <span class="holosuite-kicker">${c(n)}</span>
              <h2>${c(o)}</h2>
            </div>
          </div>
          ${r}
          <div class="holosuite-app-grid">
            ${a}
          </div>
        </main>
        <footer class="holosuite-dock">
          <button type="button" data-holosuite-action="close" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
        </footer>
      </div>
    </section>
  `;
}
class U extends x {
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
    return $(D());
  }
  activateListeners(t) {
    super.activateListeners(t), t.find("[data-holosuite-app]").on("click", (n) => {
      C(n.currentTarget.dataset.holosuiteApp);
    }), t.find("[data-holosuite-action='close']").on("click", () => this.close());
  }
  async close(t = {}) {
    return u = null, super.close(t);
  }
}
function q() {
  var e;
  return L ? (e = class extends L {
    async _renderHTML() {
      const n = document.createElement("template");
      return n.innerHTML = D().trim(), n.content;
    }
    _replaceHTML(n, o) {
      const i = n instanceof DocumentFragment ? [...n.childNodes] : [n];
      o.replaceChildren(...i);
    }
    _onRender(n, o) {
      var i, r;
      (i = super._onRender) == null || i.call(this, n, o), this.element.querySelectorAll("[data-holosuite-app]").forEach((a) => {
        a.addEventListener("click", () => C(a.dataset.holosuiteApp ?? ""));
      }), (r = this.element.querySelector("[data-holosuite-action='close']")) == null || r.addEventListener("click", () => this.close());
    }
    async close(n = {}) {
      return u = null, super.close(n);
    }
  }, S(e, "DEFAULT_OPTIONS", {
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
  }), e) : null;
}
const K = q() ?? U, A = {
  registerApp(e) {
    const t = R(e);
    return t ? (g.set(t.id, t), u && b(u, !1), t) : null;
  },
  unregisterApp(e) {
    const t = g.delete(String(e ?? ""));
    return t && u && b(u, !1), t;
  },
  getApps() {
    return [...g.values()];
  },
  async openLauncher() {
    return u || (u = new K()), await b(u, !0), u;
  }
};
function V() {
  const e = game.modules.get(f);
  e && (e.api = A), game.holosuite = A;
}
Hooks.once("init", () => {
  z(), V();
});
Hooks.on("getSceneControlButtons", j);
Hooks.once("ready", () => {
  V(), console.log(`${f} | Ready. API available at game.modules.get("${f}").api`);
});
