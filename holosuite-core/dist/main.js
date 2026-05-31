const g = "holosuite-core", L = "disableForPlayers", h = /* @__PURE__ */ new Map();
let a = null;
var A, k;
const O = globalThis.Application ?? ((k = (A = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : A.api) == null ? void 0 : k.Application);
function c(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function p(e, t, n = `${t}s`) {
  return `${e} ${e === 1 ? t : n}`;
}
function S(e, t) {
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
function P() {
  var e, t, n;
  return String(((t = (e = game.user) == null ? void 0 : e.character) == null ? void 0 : t.name) ?? ((n = game.user) == null ? void 0 : n.name) ?? "Player");
}
function C(e) {
  var t, n, i, s, r, d;
  if (e === "cybercall") {
    const l = m(S("cybercall", "contacts")), o = m(S("cybercall", "groupContacts"));
    return p(l.length + o.length, "link");
  }
  if (e === "bounty-board") {
    const l = m((n = (t = y("bounty-board")) == null ? void 0 : t.getAllBounties) == null ? void 0 : n.call(t, { includeHidden: !1 }));
    return p(l.length, "contract");
  }
  if (e === "csi-toolkit") {
    const l = Object.values(((s = (i = y("csi-toolkit")) == null ? void 0 : i.getCases) == null ? void 0 : s.call(i)) ?? {}).filter((o) => (o == null ? void 0 : o.visibility) !== "gm");
    return p(l.length, "case");
  }
  if (e === "galaxy-map") {
    const l = m((d = (r = y("galaxy-map")) == null ? void 0 : r.getMaps) == null ? void 0 : d.call(r)).filter((o) => (o == null ? void 0 : o.visibility) === "players");
    return p(l.length, "chart");
  }
  return "";
}
function m(e) {
  return Array.isArray(e) ? e : [];
}
function D(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), i = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !t || !n || !i || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${g} | Ignoring invalid app registration.`, e), null) : {
    id: t,
    title: n,
    icon: i,
    premium: e.premium === !0,
    playerVisible: e.playerVisible !== !1,
    description: String(e.description ?? "").trim(),
    featureId: String(e.featureId ?? t).trim() || t,
    open: e.open
  };
}
function G(e) {
  var d, l, o;
  const t = ((d = game.user) == null ? void 0 : d.isGM) === !0;
  if (!t && H()) return;
  const n = () => b.openLauncher(), i = {
    name: "holosuite-core-launcher",
    title: t ? "HoloSuite Command Deck" : "HoloSuite Player View",
    icon: "fa-solid fa-mobile-screen-button",
    button: !0,
    visible: !0,
    onClick: n,
    onChange: n
  };
  if (Array.isArray(e)) {
    const u = e.find((f) => f.name === "token") ?? e[0];
    u != null && u.tools && !((o = (l = u.tools).some) != null && o.call(l, (f) => f.name === i.name)) && u.tools.push(i);
    return;
  }
  const s = e, r = (s == null ? void 0 : s.tokens) ?? (s == null ? void 0 : s.token) ?? Object.values(s ?? {})[0];
  !(r != null && r.tools) || r.tools[i.name] || (r.tools[i.name] = { ...i, order: Object.keys(r.tools).length });
}
function T() {
  game.settings.register(g, L, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  });
}
function H() {
  try {
    return game.settings.get(g, L) === !0;
  } catch {
    return !1;
  }
}
function w(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 ? !0 : H() ? !1 : e.playerVisible !== !1;
}
async function x(e) {
  var n, i, s, r;
  const t = h.get(e);
  return t ? w(t) ? t.open() : ((r = (s = ui.notifications) == null ? void 0 : s.warn) == null || r.call(s, `${t.title} is not available from the player view.`), null) : ((i = (n = ui.notifications) == null ? void 0 : n.warn) == null || i.call(n, `HoloSuite app "${e}" is not registered.`), null);
}
function B() {
  var l;
  const e = ((l = game.user) == null ? void 0 : l.isGM) === !0, t = [...h.values()].filter(w).sort((o, u) => o.title.localeCompare(u.title)), n = e ? "GM Command Deck" : "Player Link", i = e ? "Apps" : "Commlink", s = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", r = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">Active User</span>
        <strong>${c(P())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>LINK STABLE</span>
      </div>
    </section>
  `, d = t.length ? t.map((o) => {
    const u = o.title, f = e && o.description ? `<p>${c(o.description)}</p>` : "", v = e ? "" : C(o.id);
    return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${c(o.id)}">
          <span class="holosuite-app-icon"><i class="${c(o.icon)}"></i></span>
          <span class="holosuite-app-title">${c(u)}</span>
          ${f}
          ${v ? `<span class="holosuite-app-count">${c(v)}</span>` : ""}
        </button>
      `;
  }).join("") : `<p class="holosuite-empty">${c(s)}</p>`;
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
              <h2>${c(i)}</h2>
            </div>
          </div>
          ${r}
          <div class="holosuite-app-grid">
            ${d}
          </div>
        </main>
        <footer class="holosuite-dock">
          <button type="button" data-holosuite-action="close" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
        </footer>
      </div>
    </section>
  `;
}
class E extends O {
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
    return $(B());
  }
  activateListeners(t) {
    super.activateListeners(t), t.find("[data-holosuite-app]").on("click", (n) => {
      x(n.currentTarget.dataset.holosuiteApp);
    }), t.find("[data-holosuite-action='close']").on("click", () => this.close());
  }
  async close(t = {}) {
    return a = null, super.close(t);
  }
}
const b = {
  registerApp(e) {
    const t = D(e);
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
    return a || (a = new E()), await a.render(!0), a;
  }
};
function M() {
  const e = game.modules.get(g);
  e && (e.api = b), game.holosuite = b;
}
Hooks.once("init", () => {
  T(), M();
});
Hooks.on("getSceneControlButtons", G);
Hooks.once("ready", () => {
  M(), console.log(`${g} | Ready. API available at game.modules.get("${g}").api`);
});
