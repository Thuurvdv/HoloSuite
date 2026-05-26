const a = "holosuite-core", v = "licenseKey", S = "mockAllowedFeatures", c = /* @__PURE__ */ new Map();
let s = null, l = null;
var k, y;
const A = globalThis.Application ?? ((y = (k = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : k.api) == null ? void 0 : y.Application);
function d(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function H(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), o = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !t || !n || !o || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${a} | Ignoring invalid app registration.`, e), null) : {
    id: t,
    title: n,
    icon: o,
    premium: e.premium === !0,
    description: String(e.description ?? "").trim(),
    featureId: String(e.featureId ?? t).trim() || t,
    open: e.open
  };
}
function I(e) {
  var r, p, h;
  if (!((r = game.user) != null && r.isGM)) return;
  const t = () => g.openLauncher(), n = {
    name: "holosuite-core-launcher",
    title: "HoloSuite",
    icon: "fa-solid fa-mobile-screen-button",
    button: !0,
    visible: !0,
    onClick: t,
    onChange: t
  };
  if (Array.isArray(e)) {
    const u = e.find((m) => m.name === "token") ?? e[0];
    u != null && u.tools && !((h = (p = u.tools).some) != null && h.call(p, (m) => m.name === n.name)) && u.tools.push(n);
    return;
  }
  const o = e, i = (o == null ? void 0 : o.tokens) ?? (o == null ? void 0 : o.token) ?? Object.values(o ?? {})[0];
  !(i != null && i.tools) || i.tools[n.name] || (i.tools[n.name] = { ...n, order: Object.keys(i.tools).length });
}
function O() {
  game.settings.register(a, v, {
    name: "HoloSuite License Key",
    hint: "Optional supporter validation key. This is not DRM; use it for supporter status, downloads, and update access.",
    scope: "world",
    config: !0,
    type: String,
    default: ""
  }), game.settings.register(a, S, {
    name: "Mock Allowed Premium Features",
    hint: "Development-only comma-separated feature ids returned by the local mock license checker.",
    scope: "world",
    config: !0,
    type: String,
    default: ""
  });
}
async function f(e = !1) {
  if (l && !e) return l;
  const t = String(game.settings.get(a, v) ?? "").trim(), n = String(game.settings.get(a, S) ?? "").split(",").map((r) => r.trim()).filter(Boolean), o = new Set(n), i = t.toLowerCase();
  if (i.includes("supporter") || i.includes("valid"))
    for (const r of c.values())
      r.premium && o.add(r.featureId ?? r.id);
  return l = {
    valid: !!t && (o.size > 0 || i.includes("valid")),
    allowedFeatureIds: [...o].sort(),
    checkedAt: (/* @__PURE__ */ new Date()).toISOString(),
    message: t ? "Mock license check complete." : "No license key configured."
  }, await (s == null ? void 0 : s.render(!1)), l;
}
function w(e) {
  return e ? (l == null ? void 0 : l.allowedFeatureIds.includes(e)) ?? !1 : !1;
}
function b(e) {
  return !e.premium || w(e.featureId ?? e.id);
}
async function M(e) {
  var n, o, i, r;
  const t = c.get(e);
  return t ? (await f(), b(t) ? t.open() : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, `${t.title} is locked for this world.`), null)) : ((o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, `HoloSuite app "${e}" is not registered.`), null);
}
function E() {
  const e = [...c.values()].sort((o, i) => o.title.localeCompare(i.title)), t = l != null && l.valid ? "Supporter link active" : "Free core mode", n = e.length ? e.map((o) => {
    const i = !b(o), r = o.description ? `<p>${d(o.description)}</p>` : "";
    return `
        <button type="button" class="holosuite-app-tile ${i ? "is-locked" : ""}" data-holosuite-app="${d(o.id)}" ${i ? "disabled" : ""}>
          <span class="holosuite-app-icon"><i class="${d(o.icon)}"></i></span>
          <span class="holosuite-app-title">${d(o.title)}</span>
          ${r}
          ${o.premium ? `<span class="holosuite-app-badge">${i ? "Locked" : "Premium"}</span>` : ""}
        </button>
      `;
  }).join("") : '<p class="holosuite-empty">No HoloSuite apps have registered yet.</p>';
  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
          <span>${d(t)}</span>
        </header>
        <main class="holosuite-screen">
          <div class="holosuite-screen-heading">
            <div>
              <span class="holosuite-kicker">GM Command Deck</span>
              <h2>Apps</h2>
            </div>
            <button type="button" class="holosuite-refresh" data-holosuite-action="check-license" title="Check license">
              <i class="fa-solid fa-arrows-rotate"></i>
            </button>
          </div>
          <div class="holosuite-app-grid">
            ${n}
          </div>
        </main>
        <footer class="holosuite-dock">
          <button type="button" data-holosuite-action="close" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
        </footer>
      </div>
    </section>
  `;
}
class F extends A {
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
    super.activateListeners(t), t.find("[data-holosuite-app]").on("click", (n) => {
      M(n.currentTarget.dataset.holosuiteApp);
    }), t.find("[data-holosuite-action='check-license']").on("click", () => f(!0)), t.find("[data-holosuite-action='close']").on("click", () => this.close());
  }
  async close(t = {}) {
    return s = null, super.close(t);
  }
}
const g = {
  registerApp(e) {
    const t = H(e);
    return t ? (c.set(t.id, t), l = null, s == null || s.render(!1), t) : null;
  },
  unregisterApp(e) {
    const t = c.delete(String(e ?? ""));
    return t && (s == null || s.render(!1)), t;
  },
  getApps() {
    return [...c.values()];
  },
  async openLauncher() {
    var e, t, n;
    return (e = game.user) != null && e.isGM ? (await f(), s || (s = new F()), await s.render(!0), s) : ((n = (t = ui.notifications) == null ? void 0 : t.warn) == null || n.call(t, "Only the GM can open HoloSuite."), null);
  },
  checkLicense: f,
  isFeatureAllowed: w
};
function L() {
  const e = game.modules.get(a);
  e && (e.api = g), game.holosuite = g;
}
Hooks.once("init", () => {
  O(), L();
});
Hooks.on("getSceneControlButtons", I);
Hooks.once("ready", async () => {
  L(), await f(!0), console.log(`${a} | Ready. API available at game.modules.get("${a}").api`);
});
