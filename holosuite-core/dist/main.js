const m = "holosuite-core", M = "licenseKey", T = "mockAllowedFeatures", p = /* @__PURE__ */ new Map();
let c = null, g = null;
var A, L;
const D = globalThis.Application ?? ((L = (A = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : A.api) == null ? void 0 : L.Application), G = {
  cybercall: "Comms",
  "bounty-board": "Contracts",
  "csi-toolkit": "Case Files",
  "galaxy-map": "NavMap"
};
function d(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function y(e, t, n = `${t}s`) {
  return `${e} ${e === 1 ? t : n}`;
}
function w(e, t) {
  try {
    return game.settings.get(e, t);
  } catch {
    return null;
  }
}
function k(e) {
  var t;
  return ((t = game.modules.get(e)) == null ? void 0 : t.api) ?? null;
}
function F() {
  var e, t, n;
  return String(((t = (e = game.user) == null ? void 0 : e.character) == null ? void 0 : t.name) ?? ((n = game.user) == null ? void 0 : n.name) ?? "Player");
}
function N() {
  return (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function _(e) {
  return G[e.id] ?? e.title;
}
function x(e) {
  var t, n, o, s, i, u;
  if (e === "cybercall") {
    const l = b(w("cybercall", "contacts")), a = b(w("cybercall", "groupContacts"));
    return y(l.length + a.length, "link");
  }
  if (e === "bounty-board") {
    const l = b((n = (t = k("bounty-board")) == null ? void 0 : t.getAllBounties) == null ? void 0 : n.call(t, { includeHidden: !1 }));
    return y(l.length, "contract");
  }
  if (e === "csi-toolkit") {
    const l = Object.values(((s = (o = k("csi-toolkit")) == null ? void 0 : o.getCases) == null ? void 0 : s.call(o)) ?? {}).filter((a) => (a == null ? void 0 : a.visibility) !== "gm");
    return y(l.length, "case");
  }
  if (e === "galaxy-map") {
    const l = b((u = (i = k("galaxy-map")) == null ? void 0 : i.getMaps) == null ? void 0 : u.call(i)).filter((a) => (a == null ? void 0 : a.visibility) === "players");
    return y(l.length, "chart");
  }
  return "";
}
function b(e) {
  return Array.isArray(e) ? e : [];
}
function z(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), o = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !t || !n || !o || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${m} | Ignoring invalid app registration.`, e), null) : {
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
  var u, l, a;
  const t = () => v.openLauncher(), o = {
    name: "holosuite-core-launcher",
    title: ((u = game.user) == null ? void 0 : u.isGM) === !0 ? "HoloSuite Command Deck" : "HoloSuite Player View",
    icon: "fa-solid fa-mobile-screen-button",
    button: !0,
    visible: !0,
    onClick: t,
    onChange: t
  };
  if (Array.isArray(e)) {
    const r = e.find((f) => f.name === "token") ?? e[0];
    r != null && r.tools && !((a = (l = r.tools).some) != null && a.call(l, (f) => f.name === o.name)) && r.tools.push(o);
    return;
  }
  const s = e, i = (s == null ? void 0 : s.tokens) ?? (s == null ? void 0 : s.token) ?? Object.values(s ?? {})[0];
  !(i != null && i.tools) || i.tools[o.name] || (i.tools[o.name] = { ...o, order: Object.keys(i.tools).length });
}
function K() {
  game.settings.register(m, M, {
    name: "HoloSuite License Key",
    hint: "Optional supporter validation key. This is not DRM; use it for supporter status, downloads, and update access.",
    scope: "world",
    config: !0,
    type: String,
    default: ""
  }), game.settings.register(m, T, {
    name: "Mock Allowed Premium Features",
    hint: "Development-only comma-separated feature ids returned by the local mock license checker.",
    scope: "world",
    config: !0,
    type: String,
    default: ""
  });
}
async function h(e = !1) {
  if (g && !e) return g;
  const t = String(game.settings.get(m, M) ?? "").trim(), n = String(game.settings.get(m, T) ?? "").split(",").map((i) => i.trim()).filter(Boolean), o = new Set(n), s = t.toLowerCase();
  if (s.includes("supporter") || s.includes("valid"))
    for (const i of p.values())
      i.premium && o.add(i.featureId ?? i.id);
  return g = {
    valid: !!t && (o.size > 0 || s.includes("valid")),
    allowedFeatureIds: [...o].sort(),
    checkedAt: (/* @__PURE__ */ new Date()).toISOString(),
    message: t ? "Mock license check complete." : "No license key configured."
  }, await (c == null ? void 0 : c.render(!1)), g;
}
function H(e) {
  return e ? (g == null ? void 0 : g.allowedFeatureIds.includes(e)) ?? !1 : !1;
}
function C(e) {
  return !e.premium || H(e.featureId ?? e.id);
}
function E(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 || e.playerVisible !== !1;
}
async function j(e) {
  var n, o, s, i, u, l;
  const t = p.get(e);
  return t ? E(t) ? (await h(), C(t) ? t.open() : ((l = (u = ui.notifications) == null ? void 0 : u.warn) == null || l.call(u, `${t.title} is locked for this world.`), null)) : ((i = (s = ui.notifications) == null ? void 0 : s.warn) == null || i.call(s, `${t.title} is not available from the player view.`), null) : ((o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, `HoloSuite app "${e}" is not registered.`), null);
}
function R() {
  var a;
  const e = ((a = game.user) == null ? void 0 : a.isGM) === !0, t = [...p.values()].filter(E).sort((r, f) => r.title.localeCompare(f.title)), n = g != null && g.valid ? "Supporter link active" : "", o = e ? "GM Command Deck" : "Player Link", s = e ? "Apps" : "Commlink", i = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", u = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">Active User</span>
        <strong>${d(F())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>LINK STABLE</span>
        <span>${d(N())}</span>
      </div>
    </section>
  `, l = t.length ? t.map((r) => {
    const f = !C(r), I = e ? r.title : _(r), P = e && r.description ? `<p>${d(r.description)}</p>` : "", S = e ? "" : x(r.id);
    return `
        <button type="button" class="holosuite-app-tile ${f ? "is-locked" : ""}" data-holosuite-app="${d(r.id)}" ${f ? "disabled" : ""}>
          <span class="holosuite-app-icon"><i class="${d(r.icon)}"></i></span>
          <span class="holosuite-app-title">${d(I)}</span>
          ${P}
          ${S ? `<span class="holosuite-app-count">${d(S)}</span>` : ""}
          ${r.premium ? `<span class="holosuite-app-badge">${f ? "Locked" : "Premium"}</span>` : ""}
        </button>
      `;
  }).join("") : `<p class="holosuite-empty">${d(i)}</p>`;
  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
          ${n ? `<span>${d(n)}</span>` : ""}
        </header>
        <main class="holosuite-screen">
          <div class="holosuite-screen-heading">
            <div>
              <span class="holosuite-kicker">${d(o)}</span>
              <h2>${d(s)}</h2>
            </div>
            <button type="button" class="holosuite-refresh" data-holosuite-action="check-license" title="Check license">
              <i class="fa-solid fa-arrows-rotate"></i>
            </button>
          </div>
          ${u}
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
class V extends D {
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
    return $(R());
  }
  activateListeners(t) {
    super.activateListeners(t), t.find("[data-holosuite-app]").on("click", (n) => {
      j(n.currentTarget.dataset.holosuiteApp);
    }), t.find("[data-holosuite-action='check-license']").on("click", () => h(!0)), t.find("[data-holosuite-action='close']").on("click", () => this.close());
  }
  async close(t = {}) {
    return c = null, super.close(t);
  }
}
const v = {
  registerApp(e) {
    const t = z(e);
    return t ? (p.set(t.id, t), g = null, c == null || c.render(!1), t) : null;
  },
  unregisterApp(e) {
    const t = p.delete(String(e ?? ""));
    return t && (c == null || c.render(!1)), t;
  },
  getApps() {
    return [...p.values()];
  },
  async openLauncher() {
    return await h(), c || (c = new V()), await c.render(!0), c;
  },
  checkLicense: h,
  isFeatureAllowed: H
};
function O() {
  const e = game.modules.get(m);
  e && (e.api = v), game.holosuite = v;
}
Hooks.once("init", () => {
  K(), O();
});
Hooks.on("getSceneControlButtons", B);
Hooks.once("ready", async () => {
  O(), await h(!0), console.log(`${m} | Ready. API available at game.modules.get("${m}").api`);
});
