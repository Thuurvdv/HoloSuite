const m = "holosuite-core", b = "licenseKey", w = "mockAllowedFeatures", p = /* @__PURE__ */ new Map();
let r = null, c = null;
var k, v;
const M = globalThis.Application ?? ((v = (k = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : k.api) == null ? void 0 : v.Application);
function f(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function I(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim(), s = String((e == null ? void 0 : e.title) ?? "").trim(), o = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !t || !s || !o || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${m} | Ignoring invalid app registration.`, e), null) : {
    id: t,
    title: s,
    icon: o,
    premium: e.premium === !0,
    playerVisible: e.playerVisible !== !1,
    description: String(e.description ?? "").trim(),
    featureId: String(e.featureId ?? t).trim() || t,
    open: e.open
  };
}
function O(e) {
  var u, d, l;
  const t = () => y.openLauncher(), o = {
    name: "holosuite-core-launcher",
    title: ((u = game.user) == null ? void 0 : u.isGM) === !0 ? "HoloSuite Command Deck" : "HoloSuite Player View",
    icon: "fa-solid fa-mobile-screen-button",
    button: !0,
    visible: !0,
    onClick: t,
    onChange: t
  };
  if (Array.isArray(e)) {
    const a = e.find((g) => g.name === "token") ?? e[0];
    a != null && a.tools && !((l = (d = a.tools).some) != null && l.call(d, (g) => g.name === o.name)) && a.tools.push(o);
    return;
  }
  const i = e, n = (i == null ? void 0 : i.tokens) ?? (i == null ? void 0 : i.token) ?? Object.values(i ?? {})[0];
  !(n != null && n.tools) || n.tools[o.name] || (n.tools[o.name] = { ...o, order: Object.keys(n.tools).length });
}
function T() {
  game.settings.register(m, b, {
    name: "HoloSuite License Key",
    hint: "Optional supporter validation key. This is not DRM; use it for supporter status, downloads, and update access.",
    scope: "world",
    config: !0,
    type: String,
    default: ""
  }), game.settings.register(m, w, {
    name: "Mock Allowed Premium Features",
    hint: "Development-only comma-separated feature ids returned by the local mock license checker.",
    scope: "world",
    config: !0,
    type: String,
    default: ""
  });
}
async function h(e = !1) {
  if (c && !e) return c;
  const t = String(game.settings.get(m, b) ?? "").trim(), s = String(game.settings.get(m, w) ?? "").split(",").map((n) => n.trim()).filter(Boolean), o = new Set(s), i = t.toLowerCase();
  if (i.includes("supporter") || i.includes("valid"))
    for (const n of p.values())
      n.premium && o.add(n.featureId ?? n.id);
  return c = {
    valid: !!t && (o.size > 0 || i.includes("valid")),
    allowedFeatureIds: [...o].sort(),
    checkedAt: (/* @__PURE__ */ new Date()).toISOString(),
    message: t ? "Mock license check complete." : "No license key configured."
  }, await (r == null ? void 0 : r.render(!1)), c;
}
function S(e) {
  return e ? (c == null ? void 0 : c.allowedFeatureIds.includes(e)) ?? !1 : !1;
}
function L(e) {
  return !e.premium || S(e.featureId ?? e.id);
}
function A(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 || e.playerVisible !== !1;
}
async function C(e) {
  var s, o, i, n, u, d;
  const t = p.get(e);
  return t ? A(t) ? (await h(), L(t) ? t.open() : ((d = (u = ui.notifications) == null ? void 0 : u.warn) == null || d.call(u, `${t.title} is locked for this world.`), null)) : ((n = (i = ui.notifications) == null ? void 0 : i.warn) == null || n.call(i, `${t.title} is not available from the player view.`), null) : ((o = (s = ui.notifications) == null ? void 0 : s.warn) == null || o.call(s, `HoloSuite app "${e}" is not registered.`), null);
}
function E() {
  var d;
  const e = ((d = game.user) == null ? void 0 : d.isGM) === !0, t = [...p.values()].filter(A).sort((l, a) => l.title.localeCompare(a.title)), s = c != null && c.valid ? "Supporter link active" : "Free core mode", o = e ? "GM Command Deck" : "Player Link", i = e ? "Apps" : "Commlink", n = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", u = t.length ? t.map((l) => {
    const a = !L(l), g = l.description ? `<p>${f(l.description)}</p>` : "";
    return `
        <button type="button" class="holosuite-app-tile ${a ? "is-locked" : ""}" data-holosuite-app="${f(l.id)}" ${a ? "disabled" : ""}>
          <span class="holosuite-app-icon"><i class="${f(l.icon)}"></i></span>
          <span class="holosuite-app-title">${f(l.title)}</span>
          ${g}
          ${l.premium ? `<span class="holosuite-app-badge">${a ? "Locked" : "Premium"}</span>` : ""}
        </button>
      `;
  }).join("") : `<p class="holosuite-empty">${f(n)}</p>`;
  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
          <span>${f(s)}</span>
        </header>
        <main class="holosuite-screen">
          <div class="holosuite-screen-heading">
            <div>
              <span class="holosuite-kicker">${f(o)}</span>
              <h2>${f(i)}</h2>
            </div>
            <button type="button" class="holosuite-refresh" data-holosuite-action="check-license" title="Check license">
              <i class="fa-solid fa-arrows-rotate"></i>
            </button>
          </div>
          <div class="holosuite-app-grid">
            ${u}
          </div>
        </main>
        <footer class="holosuite-dock">
          <button type="button" data-holosuite-action="close" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
        </footer>
      </div>
    </section>
  `;
}
class F extends M {
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
    return $(E());
  }
  activateListeners(t) {
    super.activateListeners(t), t.find("[data-holosuite-app]").on("click", (s) => {
      C(s.currentTarget.dataset.holosuiteApp);
    }), t.find("[data-holosuite-action='check-license']").on("click", () => h(!0)), t.find("[data-holosuite-action='close']").on("click", () => this.close());
  }
  async close(t = {}) {
    return r = null, super.close(t);
  }
}
const y = {
  registerApp(e) {
    const t = I(e);
    return t ? (p.set(t.id, t), c = null, r == null || r.render(!1), t) : null;
  },
  unregisterApp(e) {
    const t = p.delete(String(e ?? ""));
    return t && (r == null || r.render(!1)), t;
  },
  getApps() {
    return [...p.values()];
  },
  async openLauncher() {
    return await h(), r || (r = new F()), await r.render(!0), r;
  },
  checkLicense: h,
  isFeatureAllowed: S
};
function H() {
  const e = game.modules.get(m);
  e && (e.api = y), game.holosuite = y;
}
Hooks.once("init", () => {
  T(), H();
});
Hooks.on("getSceneControlButtons", O);
Hooks.once("ready", async () => {
  H(), await h(!0), console.log(`${m} | Ready. API available at game.modules.get("${m}").api`);
});
