const d = "holosuite-core", H = "disableForPlayers", L = "theme", w = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
}, h = /* @__PURE__ */ new Map();
let a = null;
var A, k;
const O = globalThis.Application ?? ((k = (A = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : A.api) == null ? void 0 : k.Application);
function c(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function m(e, t, n = `${t}s`) {
  return `${e} ${e === 1 ? t : n}`;
}
function b(e, t) {
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
function D(e) {
  var t, n, o, s, r, g;
  if (e === "cybercall") {
    const l = p(b("cybercall", "contacts")), i = p(b("cybercall", "groupContacts"));
    return m(l.length + i.length, "link");
  }
  if (e === "bounty-board") {
    const l = p((n = (t = y("bounty-board")) == null ? void 0 : t.getAllBounties) == null ? void 0 : n.call(t, { includeHidden: !1 }));
    return m(l.length, "contract");
  }
  if (e === "csi-toolkit") {
    const l = Object.values(((s = (o = y("csi-toolkit")) == null ? void 0 : o.getCases) == null ? void 0 : s.call(o)) ?? {}).filter((i) => (i == null ? void 0 : i.visibility) !== "gm");
    return m(l.length, "case");
  }
  if (e === "galaxy-map") {
    const l = p((g = (r = y("galaxy-map")) == null ? void 0 : r.getMaps) == null ? void 0 : g.call(r)).filter((i) => (i == null ? void 0 : i.visibility) === "players");
    return m(l.length, "chart");
  }
  return "";
}
function p(e) {
  return Array.isArray(e) ? e : [];
}
function G(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), o = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !t || !n || !o || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${d} | Ignoring invalid app registration.`, e), null) : {
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
function B(e) {
  var g, l, i;
  const t = ((g = game.user) == null ? void 0 : g.isGM) === !0;
  if (!t && C()) return;
  const n = () => v.openLauncher(), o = {
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
    u != null && u.tools && !((i = (l = u.tools).some) != null && i.call(l, (f) => f.name === o.name)) && u.tools.push(o);
    return;
  }
  const s = e, r = (s == null ? void 0 : s.tokens) ?? (s == null ? void 0 : s.token) ?? Object.values(s ?? {})[0];
  !(r != null && r.tools) || r.tools[o.name] || (r.tools[o.name] = { ...o, order: Object.keys(r.tools).length });
}
function I() {
  game.settings.register(d, L, {
    name: "HoloSuite Theme",
    hint: "Changes the shared color theme used by HoloSuite windows.",
    scope: "world",
    config: !0,
    type: String,
    choices: w,
    default: "default",
    onChange: (e) => T(e)
  }), game.settings.register(d, H, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  });
}
function _(e) {
  return Object.hasOwn(w, String(e)) ? String(e) : "default";
}
function T(e) {
  const t = _(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const o of n)
    t === "default" ? o.removeAttribute("data-holosuite-theme") : o.setAttribute("data-holosuite-theme", t);
}
function j() {
  T(b(d, L));
}
function C() {
  try {
    return game.settings.get(d, H) === !0;
  } catch {
    return !1;
  }
}
function E(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 ? !0 : C() ? !1 : e.playerVisible !== !1;
}
async function x(e) {
  var n, o, s, r;
  const t = h.get(e);
  return t ? E(t) ? t.open() : ((r = (s = ui.notifications) == null ? void 0 : s.warn) == null || r.call(s, `${t.title} is not available from the player view.`), null) : ((o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, `HoloSuite app "${e}" is not registered.`), null);
}
function N() {
  var l;
  const e = ((l = game.user) == null ? void 0 : l.isGM) === !0, t = [...h.values()].filter(E).sort((i, u) => i.title.localeCompare(u.title)), n = e ? "GM Command Deck" : "Player Link", o = e ? "Apps" : "Commlink", s = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", r = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">Active User</span>
        <strong>${c(P())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>LINK STABLE</span>
      </div>
    </section>
  `, g = t.length ? t.map((i) => {
    const u = i.title, f = e && i.description ? `<p>${c(i.description)}</p>` : "", S = e ? "" : D(i.id);
    return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${c(i.id)}">
          <span class="holosuite-app-icon"><i class="${c(i.icon)}"></i></span>
          <span class="holosuite-app-title">${c(u)}</span>
          ${f}
          ${S ? `<span class="holosuite-app-count">${c(S)}</span>` : ""}
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
              <h2>${c(o)}</h2>
            </div>
          </div>
          ${r}
          <div class="holosuite-app-grid">
            ${g}
          </div>
        </main>
        <footer class="holosuite-dock">
          <button type="button" data-holosuite-action="close" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
        </footer>
      </div>
    </section>
  `;
}
class V extends O {
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
    return $(N());
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
const v = {
  registerApp(e) {
    const t = G(e);
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
    return a || (a = new V()), await a.render(!0), a;
  }
};
function M() {
  const e = game.modules.get(d);
  e && (e.api = v), game.holosuite = v;
}
Hooks.once("init", () => {
  I(), M();
});
Hooks.on("getSceneControlButtons", B);
Hooks.once("ready", () => {
  M(), j(), console.log(`${d} | Ready. API available at game.modules.get("${d}").api`);
});
