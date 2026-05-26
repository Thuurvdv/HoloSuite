var ve = Object.defineProperty;
var Ae = (e, t, a) => t in e ? ve(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var A = (e, t, a) => Ae(e, typeof t != "symbol" ? t + "" : t, a);
const c = "holocall", v = `module.${c}`, ee = `modules/${c}/templates/holocall.hbs`, te = `modules/${c}/templates/holocall-composer.hbs`, ae = `modules/${c}/templates/holocall-contacts.hbs`;
let o = null, m = null, u = null, f = "personal", C = null, D = null;
const d = {
  callerName: "UNKNOWN CALLER",
  subtitle: "Unidentified Signal",
  image: "",
  message: "Incoming transmission...",
  signal: 100,
  variant: "standard",
  fullscreen: !1,
  ringing: !0,
  accepted: !1,
  canAccept: !0,
  canDecline: !0,
  allowBroadcast: !0,
  outgoing: !1
}, Se = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]), $e = {
  "": "Silent",
  [`modules/${c}/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${c}/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${c}/Ringtone3.ogg`]: "Ringtone 3"
};
function ne(e) {
  const t = Number(e);
  return Number.isNaN(t) ? d.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function Te(e) {
  return String(e).split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var a;
    return (a = t[0]) == null ? void 0 : a.toUpperCase();
  }).join("") || "?";
}
function g(e) {
  var a;
  if ((a = foundry == null ? void 0 : foundry.utils) != null && a.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
function G() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function S(e = {}) {
  var a;
  const t = {
    ...d,
    ...e,
    id: String(e.id ?? G()),
    callerName: String(e.callerName ?? d.callerName),
    subtitle: String(e.subtitle ?? d.subtitle),
    image: String(e.image ?? d.image),
    message: String(e.message ?? d.message),
    signal: ne(e.signal ?? d.signal),
    variant: Se.has(e.variant) ? e.variant : d.variant,
    fullscreen: !!(e.fullscreen ?? d.fullscreen),
    ringing: e.ringing !== !1 && e.accepted !== !0,
    accepted: e.accepted === !0,
    canAccept: e.canAccept !== !1,
    canDecline: e.canDecline !== !1,
    allowBroadcast: e.allowBroadcast !== !1,
    outgoing: e.outgoing === !0,
    callerUserId: String(e.callerUserId ?? ""),
    contactNumber: String(e.contactNumber ?? "")
  };
  return t.initials = Te(t.callerName), t.showBroadcast = !!((a = game == null ? void 0 : game.user) != null && a.isGM && t.allowBroadcast), t.isStandard = t.variant === "standard", t.isEmergency = t.variant === "emergency", t.isCorrupted = t.variant === "corrupted", t.isIncoming = !t.accepted, t.kicker = t.outgoing ? "Outgoing HoloCall" : t.fullscreen ? "System-wide Broadcast" : "Incoming HoloCall", t;
}
function oe() {
  var e, t, a, n, l, r, i, s;
  return S({
    callerName: ((e = o == null ? void 0 : o.callData) == null ? void 0 : e.callerName) ?? d.callerName,
    subtitle: ((t = o == null ? void 0 : o.callData) == null ? void 0 : t.subtitle) ?? d.subtitle,
    image: ((a = o == null ? void 0 : o.callData) == null ? void 0 : a.image) ?? "",
    message: ((n = o == null ? void 0 : o.callData) == null ? void 0 : n.message) ?? d.message,
    signal: ((l = o == null ? void 0 : o.callData) == null ? void 0 : l.signal) ?? game.settings.get(c, "defaultSignal"),
    variant: ((r = o == null ? void 0 : o.callData) == null ? void 0 : r.variant) ?? "standard",
    fullscreen: ((i = o == null ? void 0 : o.callData) == null ? void 0 : i.fullscreen) ?? !1,
    ringing: ((s = o == null ? void 0 : o.callData) == null ? void 0 : s.ringing) ?? !0
  });
}
function le() {
  var e;
  return (((e = game.actors) == null ? void 0 : e.contents) ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    img: t.img ?? ""
  })).sort((t, a) => t.name.localeCompare(a.name));
}
function y(e = {}) {
  return {
    id: String(e.id ?? G()),
    name: String(e.name ?? "").trim(),
    number: String(e.number ?? "").trim()
  };
}
function k() {
  const e = game.settings.get(c, "contacts");
  return Array.isArray(e) ? e.map(y).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name)) : [];
}
function T() {
  if (Array.isArray(D))
    return D.map(y).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name));
  const e = game.settings.get(c, "groupContacts");
  return Array.isArray(e) ? e.map(y).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name)) : [];
}
async function re(e) {
  await game.settings.set(c, "contacts", e.map(y));
}
async function P(e) {
  D = e.map(y), await game.settings.set(c, "groupContacts", D), game.socket.emit(v, {
    action: "groupContactsChanged",
    contacts: D
  });
}
async function De(e, t, a = "personal") {
  var r, i, s, p, h, b;
  const n = y({ name: e, number: t });
  if (!n.name || !n.number) {
    (i = (r = ui.notifications) == null ? void 0 : r.warn) == null || i.call(r, "Contact name and number are required.");
    return;
  }
  if (a === "group" && !game.user.isGM) {
    if (!x()) {
      (p = (s = ui.notifications) == null ? void 0 : s.warn) == null || p.call(s, "A GM must be connected to update group contacts.");
      return;
    }
    game.socket.emit(v, {
      action: "groupContactAdd",
      contact: n
    }), (b = (h = ui.notifications) == null ? void 0 : h.info) == null || b.call(h, "Group contact update sent to the GM.");
    return;
  }
  const l = a === "group" ? T() : k();
  l.push(n), a === "group" ? await P(l) : await re(l), await H();
}
async function Me(e, t = "personal") {
  var a, n, l, r;
  if (t === "group") {
    if (!game.user.isGM) {
      if (!x()) {
        (n = (a = ui.notifications) == null ? void 0 : a.warn) == null || n.call(a, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(v, {
        action: "groupContactRemove",
        contactId: e
      }), (r = (l = ui.notifications) == null ? void 0 : l.info) == null || r.call(l, "Group contact removal sent to the GM.");
      return;
    }
    await P(T().filter((i) => i.id !== e));
  } else
    await re(k().filter((i) => i.id !== e));
  await H();
}
function x() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function F(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(c, "minimumRole");
  } catch (a) {
    console.warn(`${c} | Permission setting unavailable, using Player role fallback.`, a);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function U(e, t) {
  var a;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (a = e.element) != null && a[0] ? e.element[0] : e.element ?? null;
}
function ie(e, t) {
  const a = U(e, t);
  a && (a.classList.toggle("holocall-fullscreen", e.callData.fullscreen), a.classList.toggle("holocall-ringing", e.callData.ringing && !e.callData.accepted), a.classList.toggle("holocall-connected", e.callData.accepted), a.querySelectorAll("[data-holocall-action]").forEach((n) => {
    n.addEventListener("click", (l) => {
      const r = l.currentTarget.dataset.holocallAction;
      if (r === "accept") {
        qe(e.callData.id);
        return;
      }
      if (r === "broadcast") {
        B({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (r === "decline" || r === "end") && fe(e.callData.id);
    });
  }));
}
function Ee(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-holocall-composer]");
}
function K(e) {
  var r;
  const t = new FormData(e), a = (r = game.actors) == null ? void 0 : r.get(t.get("actorId")), n = String(t.get("image") ?? "").trim() || (a == null ? void 0 : a.img) || "", l = String(t.get("callerName") ?? "").trim() || (a == null ? void 0 : a.name) || "UNKNOWN CALLER";
  return S({
    callerName: l,
    subtitle: String(t.get("subtitle") ?? "").trim(),
    image: n,
    message: String(t.get("message") ?? "").trim(),
    signal: t.get("signal"),
    variant: String(t.get("variant") ?? d.variant),
    fullscreen: t.get("fullscreen") === "on",
    ringing: t.get("ringing") === "on"
  });
}
function I(e) {
  var n, l;
  const t = (n = e == null ? void 0 : e.elements) == null ? void 0 : n.signal, a = (l = e == null ? void 0 : e.querySelector) == null ? void 0 : l.call(e, "[data-holocall-signal-output]");
  !t || !a || (a.textContent = `${ne(t.value)}%`);
}
function ce(e, t) {
  var l, r;
  const a = U(e, t), n = Ee(a);
  !a || !n || (I(n), (l = n.elements.signal) == null || l.addEventListener("input", () => I(n)), (r = n.elements.actorId) == null || r.addEventListener("change", () => {
    var s;
    const i = (s = game.actors) == null ? void 0 : s.get(n.elements.actorId.value);
    i && (n.elements.callerName.value = i.name, n.elements.image.value = i.img ?? "");
  }), n.addEventListener("submit", (i) => {
    i.preventDefault(), w(K(n));
  }), a.querySelectorAll("[data-holocall-compose-action]").forEach((i) => {
    i.addEventListener("click", async (s) => {
      var b, L, V, j, R, z, Y;
      const p = s.currentTarget.dataset.holocallComposeAction, h = K(n);
      if (p === "preview") {
        await w(h);
        return;
      }
      if (p === "broadcast") {
        await B(h);
        return;
      }
      if (p === "close-active") {
        fe((b = o == null ? void 0 : o.callData) == null ? void 0 : b.id);
        return;
      }
      if (p === "browse-image") {
        const O = n.elements.image, W = globalThis.FilePicker ?? ((j = (V = (L = globalThis.foundry) == null ? void 0 : L.applications) == null ? void 0 : V.apps) == null ? void 0 : j.FilePicker);
        if (!O || !W) {
          (z = (R = ui.notifications) == null ? void 0 : R.warn) == null || z.call(R, "Foundry FilePicker is unavailable.");
          return;
        }
        const N = new W({
          type: "image",
          current: O.value,
          callback: (we) => {
            O.value = we, O.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof N.browse == "function" ? N.browse() : (Y = N.render) == null || Y.call(N, !0);
        return;
      }
      p === "reset" && (n.reset(), I(n));
    });
  }));
}
function Le(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-holocall-contacts-form]");
}
function se(e, t) {
  const a = U(e, t), n = Le(a);
  !a || !n || (n.addEventListener("submit", async (l) => {
    var s;
    l.preventDefault();
    const r = new FormData(n), i = String(r.get("scope") ?? f);
    await De(r.get("name"), r.get("number"), i), n.reset(), n.elements.scope.value = i, (s = n.elements.name) == null || s.focus();
  }), a.querySelectorAll("[data-holocall-contact-tab]").forEach((l) => {
    l.addEventListener("click", (r) => {
      f = r.currentTarget.dataset.holocallContactTab, a.querySelectorAll("[data-holocall-contact-tab]").forEach((i) => {
        i.classList.toggle("active", i.dataset.holocallContactTab === f);
      }), a.querySelectorAll("[data-holocall-contact-panel]").forEach((i) => {
        i.hidden = i.dataset.holocallContactPanel !== f;
      }), n.elements.scope && (n.elements.scope.value = f);
    });
  }), a.querySelectorAll("[data-holocall-contact-action]").forEach((l) => {
    l.addEventListener("click", async (r) => {
      const i = r.currentTarget.dataset.holocallContactAction, s = r.currentTarget.dataset.contactId, p = r.currentTarget.dataset.contactScope ?? "personal", b = (p === "group" ? T() : k()).find((L) => L.id === s);
      if (i === "remove") {
        await Me(s, p);
        return;
      }
      i === "call" && b && await Be(b) && u === e && await e.close();
    });
  }));
}
function Ne(e) {
  return e.image ? `<img src="${g(e.image)}" alt="${g(e.callerName)}">` : `<div class="holocall-initials" aria-hidden="true">${g(e.initials)}</div>`;
}
function ue(e) {
  const t = `--holocall-signal: ${e.signal}%;`, a = e.fullscreen ? "holocall-broadcast" : "", n = e.ringing ? "holocall-ringing-panel" : "", l = e.accepted ? "holocall-connected-panel" : "", r = e.showBroadcast ? '<button type="button" data-holocall-action="broadcast">Broadcast</button>' : "", i = e.accepted ? "" : `
      <header class="holocall-header">
        <div>
          <div class="holocall-kicker">${g(e.kicker)}</div>
          <h2>${g(e.callerName)}</h2>
          <p>${g(e.subtitle)}</p>
        </div>
        <div class="holocall-signal">
          <span>${e.signal}%</span>
          <div class="holocall-signal-bar" aria-hidden="true"><i></i></div>
        </div>
      </header>
    `, s = e.accepted ? "" : `<blockquote>${g(e.message)}</blockquote>`, p = e.accepted ? '<button type="button" data-holocall-action="end">End Call</button>' : `
        ${e.canAccept ? '<button type="button" data-holocall-action="accept">Accept</button>' : ""}
        ${e.canDecline ? '<button type="button" data-holocall-action="decline">Decline</button>' : ""}
        ${r}
        <button type="button" data-holocall-action="end">End Call</button>
      `;
  return `
    <div class="holocall-panel holocall-${e.variant} ${a} ${n} ${l}" style="${t}">
      <div class="holocall-static" aria-hidden="true"></div>
      <div class="holocall-reticle" aria-hidden="true"></div>
      ${i}
      <main class="holocall-body">
        <div class="holocall-portrait">${Ne(e)}</div>
        ${s}
      </main>
      <footer class="holocall-actions">
        ${p}
      </footer>
    </div>
  `;
}
function ge(e) {
  const t = e.call;
  return `
    <form class="holocall-composer" data-holocall-composer>
      <label>Actor Portrait
        <select name="actorId">
          <option value="">Manual / no actor</option>
          ${e.actors.map((n) => `<option value="${g(n.id)}">${g(n.name)}</option>`).join("")}
        </select>
      </label>
      <label>Caller Name <input type="text" name="callerName" value="${g(t.callerName)}"></label>
      <label>Subtitle / Faction <input type="text" name="subtitle" value="${g(t.subtitle)}"></label>
      <label>Portrait Image Path <span class="holocall-composer-path-row"><input type="text" name="image" value="${g(t.image)}"><button type="button" data-holocall-compose-action="browse-image">Browse</button></span></label>
      <label>Message <textarea name="message" rows="5">${g(t.message)}</textarea></label>
      <label>Signal <input type="range" name="signal" min="0" max="100" value="${t.signal}"></label>
      <label>Variant
        <select name="variant">
          <option value="standard" ${t.variant === "standard" ? "selected" : ""}>Standard Blue</option>
          <option value="emergency" ${t.variant === "emergency" ? "selected" : ""}>Emergency Red</option>
          <option value="corrupted" ${t.variant === "corrupted" ? "selected" : ""}>Corrupted Green</option>
        </select>
      </label>
      <label><input type="checkbox" name="fullscreen" ${t.fullscreen ? "checked" : ""}> Fullscreen Broadcast</label>
      <label><input type="checkbox" name="ringing" ${t.ringing ? "checked" : ""}> Ringing Animation / Sound</label>
      <div class="holocall-composer-actions">
        <button type="button" data-holocall-compose-action="preview">Preview Locally</button>
        <button type="button" data-holocall-compose-action="broadcast">Broadcast to Players</button>
        <button type="button" data-holocall-compose-action="close-active">Close Active Call</button>
      </div>
    </form>
  `;
}
function de(e) {
  const t = (l, r) => l.length ? l.map((i) => `
        <li>
          <div class="holocall-contact-id">
            <strong>${g(i.name)}</strong>
            <span>${g(i.number)}</span>
          </div>
          <div class="holocall-contact-actions">
            <button type="button" data-holocall-contact-action="call" data-contact-scope="${r}" data-contact-id="${g(i.id)}">Call</button>
            <button type="button" data-holocall-contact-action="remove" data-contact-scope="${r}" data-contact-id="${g(i.id)}">Remove</button>
          </div>
        </li>
      `).join("") : '<li class="holocall-contacts-empty">No contacts stored.</li>', a = e.activeTab !== "group", n = e.activeTab === "group";
  return `
    <section class="holocall-contacts">
      <header class="holocall-contacts-header">
        <div>
          <div class="holocall-contacts-kicker">Personal Comms Directory</div>
          <h2>HoloCall Contacts</h2>
        </div>
      </header>
      <nav class="holocall-contact-tabs">
        <button type="button" class="${a ? "active" : ""}" data-holocall-contact-tab="personal">Personal</button>
        <button type="button" class="${n ? "active" : ""}" data-holocall-contact-tab="group">Group</button>
      </nav>
      <section data-holocall-contact-panel="personal" ${a ? "" : "hidden"}>
        <ul class="holocall-contacts-list">${t(e.contacts, "personal")}</ul>
      </section>
      <section data-holocall-contact-panel="group" ${n ? "" : "hidden"}>
        <ul class="holocall-contacts-list">${t(e.groupContacts, "group")}</ul>
      </section>
      <form class="holocall-contacts-form" data-holocall-contacts-form>
        <input type="hidden" name="scope" value="${g(e.activeTab)}">
        <label>Name <input type="text" name="name" required></label>
        <label>Number <input type="text" name="number" required></label>
        <button type="submit">Add Contact</button>
      </form>
    </section>
  `;
}
var J, Q;
const M = (Q = (J = foundry == null ? void 0 : foundry.applications) == null ? void 0 : J.api) == null ? void 0 : Q.ApplicationV2;
var X, Z;
const E = (Z = (X = foundry == null ? void 0 : foundry.applications) == null ? void 0 : X.api) == null ? void 0 : Z.HandlebarsApplicationMixin;
class He extends Application {
  constructor(t, a = {}) {
    super(a), this.callData = S(t);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holocall-overlay",
      title: "HoloCall",
      template: ee,
      classes: ["holocall-app"],
      popOut: !0,
      resizable: !0,
      width: 440,
      height: "auto"
    });
  }
  getData() {
    return {
      call: this.callData
    };
  }
  async _renderInner(t) {
    try {
      return await super._renderInner(t);
    } catch (a) {
      return console.warn(`${c} | Template render failed, using inline fallback.`, a), $(ue(this.callData));
    }
  }
  activateListeners(t) {
    super.activateListeners(t), ie(this, t);
  }
  async close(t) {
    return o === this && (o = null), _(), super.close(t);
  }
}
class ke extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holocall-composer",
      title: "HoloCall Composer",
      template: te,
      classes: ["holocall-composer-app"],
      popOut: !0,
      resizable: !0,
      width: 560,
      height: "auto"
    });
  }
  getData() {
    return {
      call: oe(),
      actors: le()
    };
  }
  async _renderInner(t) {
    try {
      return await super._renderInner(t);
    } catch (a) {
      return console.warn(`${c} | Composer template render failed, using inline fallback.`, a), $(ge(t));
    }
  }
  activateListeners(t) {
    super.activateListeners(t), ce(this, t);
  }
  async close(t) {
    return m === this && (m = null), super.close(t);
  }
}
class Re extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holocall-contacts",
      title: "HoloCall Contacts",
      template: ae,
      classes: ["holocall-contacts-app"],
      popOut: !0,
      resizable: !0,
      width: 500,
      height: "auto"
    });
  }
  getData() {
    const t = k(), a = T();
    return {
      contacts: t,
      groupContacts: a,
      hasContacts: t.length > 0,
      hasGroupContacts: a.length > 0,
      activeTab: f,
      isPersonalTab: f !== "group",
      isGroupTab: f === "group"
    };
  }
  async _renderInner(t) {
    try {
      return await super._renderInner(t);
    } catch (a) {
      return console.warn(`${c} | Contacts template render failed, using inline fallback.`, a), $(de(t));
    }
  }
  activateListeners(t) {
    super.activateListeners(t), se(this, t);
  }
  async close(t) {
    return u === this && (u = null), super.close(t);
  }
}
function Oe() {
  var e;
  return !M || !E ? null : (e = class extends E(M) {
    constructor(a, n = {}) {
      super(n), this.callData = S(a);
    }
    async _prepareContext(a) {
      return {
        ...await super._prepareContext(a),
        call: this.callData
      };
    }
    async _renderHTML(a, n) {
      try {
        return await super._renderHTML(a, n);
      } catch (l) {
        console.warn(`${c} | Template render failed, using inline fallback.`, l);
        const r = document.createElement("template");
        return r.innerHTML = ue(this.callData).trim(), r.content;
      }
    }
    _onRender(a, n) {
      var l;
      (l = super._onRender) == null || l.call(this, a, n), ie(this);
    }
    async close(a) {
      return o === this && (o = null), _(), super.close(a);
    }
  }, A(e, "DEFAULT_OPTIONS", {
    id: "holocall-overlay",
    tag: "section",
    classes: ["holocall-app"],
    window: {
      title: "HoloCall",
      resizable: !0
    },
    position: {
      width: 440,
      height: "auto"
    }
  }), A(e, "PARTS", {
    main: {
      template: ee
    }
  }), e);
}
const Pe = Oe() ?? He;
function _e() {
  var e;
  return !M || !E ? null : (e = class extends E(M) {
    async _prepareContext(a) {
      return {
        ...await super._prepareContext(a),
        call: oe(),
        actors: le()
      };
    }
    async _renderHTML(a, n) {
      try {
        return await super._renderHTML(a, n);
      } catch (l) {
        console.warn(`${c} | Composer template render failed, using inline fallback.`, l);
        const r = document.createElement("template");
        return r.innerHTML = ge(a).trim(), r.content;
      }
    }
    _onRender(a, n) {
      var l;
      (l = super._onRender) == null || l.call(this, a, n), ce(this);
    }
    async close(a) {
      return m === this && (m = null), super.close(a);
    }
  }, A(e, "DEFAULT_OPTIONS", {
    id: "holocall-composer",
    tag: "section",
    classes: ["holocall-composer-app"],
    window: {
      title: "HoloCall Composer",
      resizable: !0
    },
    position: {
      width: 560,
      height: "auto"
    }
  }), A(e, "PARTS", {
    main: {
      template: te
    }
  }), e);
}
const Ie = _e() ?? ke;
function Ge() {
  var e;
  return !M || !E ? null : (e = class extends E(M) {
    async _prepareContext(a) {
      const n = k(), l = T();
      return {
        ...await super._prepareContext(a),
        contacts: n,
        groupContacts: l,
        hasContacts: n.length > 0,
        hasGroupContacts: l.length > 0,
        activeTab: f,
        isPersonalTab: f !== "group",
        isGroupTab: f === "group"
      };
    }
    async _renderHTML(a, n) {
      try {
        return await super._renderHTML(a, n);
      } catch (l) {
        console.warn(`${c} | Contacts template render failed, using inline fallback.`, l);
        const r = document.createElement("template");
        return r.innerHTML = de(a).trim(), r.content;
      }
    }
    _onRender(a, n) {
      var l;
      (l = super._onRender) == null || l.call(this, a, n), se(this);
    }
    async close(a) {
      return u === this && (u = null), super.close(a);
    }
  }, A(e, "DEFAULT_OPTIONS", {
    id: "holocall-contacts",
    tag: "section",
    classes: ["holocall-contacts-app"],
    window: {
      title: "HoloCall Contacts",
      resizable: !0
    },
    position: {
      width: 500,
      height: "auto"
    }
  }), A(e, "PARTS", {
    main: {
      template: ae
    }
  }), e);
}
const xe = Ge() ?? Re;
async function w(e = {}) {
  var t, a;
  return F() ? (u && await u.close(), await q(), o = new Pe(e), await o.render(!0), Ce(o), ze(o.callData), o) : ((a = (t = ui.notifications) == null ? void 0 : t.warn) == null || a.call(t, "You do not have permission to open HoloCall transmissions."), null);
}
async function q() {
  if (!o) return;
  const e = o;
  o = null, await e.close();
}
function Fe(e) {
  var t;
  return !!((t = o == null ? void 0 : o.callData) != null && t.id) && o.callData.id === e;
}
async function Ue() {
  o && (await o.render(!0), Ce(o));
}
async function pe(e) {
  Fe(e) && (o.callData.accepted = !0, o.callData.ringing = !1, _(), await Ue());
}
function qe(e) {
  e && (game.socket.emit(v, {
    action: "acceptCall",
    callId: e
  }), pe(e));
}
async function me(e) {
  var t;
  e && ((t = o == null ? void 0 : o.callData) != null && t.id) && o.callData.id !== e || await q();
}
function fe(e) {
  game.socket.emit(v, {
    action: "endCall",
    callId: e
  }), me(e);
}
async function Be(e) {
  var r, i;
  if (game.user.isGM)
    return w({
      callerName: e.name,
      subtitle: `Comms ${e.number}`,
      message: `Opening channel ${e.number}...`,
      signal: game.settings.get(c, "defaultSignal"),
      variant: "standard",
      ringing: !1
    });
  if (!x())
    return (i = (r = ui.notifications) == null ? void 0 : r.warn) == null || i.call(r, "No GM is connected to receive the HoloCall."), null;
  const a = {
    id: G(),
    callerName: e.name,
    subtitle: `Comms ${e.number}`,
    image: "",
    signal: game.settings.get(c, "defaultSignal"),
    variant: "standard",
    fullscreen: !1,
    accepted: !1,
    allowBroadcast: !1,
    callerUserId: game.user.id,
    contactNumber: e.number
  }, n = S({
    ...a,
    message: `Awaiting connection to ${e.name} on ${e.number}...`,
    canAccept: !1,
    canDecline: !1,
    outgoing: !0,
    ringing: !0
  }), l = S({
    ...a,
    subtitle: `Call request from ${game.user.name}`,
    message: `${game.user.name} is calling ${e.name} on ${e.number}.`,
    canAccept: !0,
    ringing: !0
  });
  return game.socket.emit(v, {
    action: "playerCallRequest",
    callData: l
  }), w(n);
}
async function he() {
  var e, t, a;
  return game.user.isGM ? m ? ((a = m.bringToFront) == null || a.call(m), m) : (m = new Ie(), await m.render(!0), m) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the HoloCall composer."), null);
}
async function be() {
  var e, t, a, n;
  return F() ? o ? ((a = o.bringToFront) == null || a.call(o), o) : u ? ((n = u.bringToFront) == null || n.call(u), u) : (u = new xe(), await u.render(!0), u) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use HoloCall contacts."), null);
}
async function H() {
  u && await u.render(!0);
}
async function B(e = {}) {
  var a, n;
  if (!game.user.isGM)
    return (n = (a = ui.notifications) == null ? void 0 : a.warn) == null || n.call(a, "Only the GM can broadcast HoloCalls to all players."), null;
  const t = S({
    ...e,
    fullscreen: e.fullscreen ?? !0,
    ringing: !0
  });
  return game.socket.emit(v, {
    action: "openCall",
    callData: t
  }), w(t);
}
async function Ve(e) {
  if (e) {
    if (e.action === "openCall") {
      if (!F()) return;
      w(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      w(e.callData);
      return;
    }
    if (e.action === "acceptCall") {
      pe(e.callId);
      return;
    }
    if (e.action === "endCall") {
      me(e.callId);
      return;
    }
    if (e.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const t = y(e.contact);
      if (!t.name || !t.number) return;
      const a = T();
      a.push(t), await P(a), await H();
      return;
    }
    if (e.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await P(T().filter((t) => t.id !== e.contactId)), await H();
      return;
    }
    e.action === "groupContactsChanged" && (D = Array.isArray(e.contacts) ? e.contacts.map(y) : null, await H());
  }
}
function Ce(e) {
  var t, a;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((a = e.setPosition) == null || a.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function je() {
  return String(game.settings.get(c, "ringSound") ?? "").trim();
}
function _() {
  C && (C.pause(), C.currentTime = 0, C = null);
}
function ze(e) {
  if (_(), !e.ringing) return;
  const t = je();
  t && (C = new Audio(t), C.loop = !0, C.volume = 0.65, C.play().catch((a) => {
    console.warn(`${c} | Unable to play ringing sound.`, a);
  }));
}
function ye() {
  const e = game.modules.get(c);
  e && (e.api = {
    openCall: w,
    closeCall: q,
    broadcastCall: B,
    openComposer: he,
    openContacts: be,
    get activeCall() {
      return o;
    },
    get activeComposer() {
      return m;
    },
    get activeContacts() {
      return u;
    }
  });
}
function Ye() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: c,
    title: "HoloCall",
    icon: "fa-solid fa-satellite-dish",
    premium: !1,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => {
      var a;
      return (a = game.user) != null && a.isGM ? he() : be();
    }
  }), !0) : !1;
}
function We() {
  const e = CONST.USER_ROLES, t = {};
  for (const [a, n] of [
    ["NONE", "None"],
    ["LIMITED", "Limited"],
    ["OBSERVER", "Observer"],
    ["PLAYER", "Player"],
    ["TRUSTED", "Trusted Player"],
    ["ASSISTANT", "Assistant GM"]
  ])
    Number.isFinite(Number(e[a])) && (t[e[a]] = n);
  game.settings.register(c, "defaultSignal", {
    name: "Default Signal Strength",
    hint: "Signal percentage used when a call does not provide one.",
    scope: "client",
    config: !0,
    type: Number,
    default: d.signal,
    range: {
      min: 0,
      max: 100,
      step: 1
    }
  }), game.settings.register(c, "ringSound", {
    name: "Incoming Call Ringtone",
    hint: "Ringtone played locally while a HoloCall is ringing. This is a client setting, so each user can choose their own ringtone.",
    scope: "client",
    config: !0,
    type: String,
    default: "",
    choices: $e
  }), game.settings.register(c, "minimumRole", {
    name: "Minimum Player Role",
    hint: "Minimum role allowed to open HoloCall overlays and receive GM broadcasts.",
    scope: "world",
    config: !0,
    type: Number,
    default: e.PLAYER,
    choices: t
  }), game.settings.register(c, "contacts", {
    name: "HoloCall Contacts",
    hint: "Player contact directory stored locally for this client.",
    scope: "client",
    config: !1,
    type: Object,
    default: []
  }), game.settings.register(c, "groupContacts", {
    name: "HoloCall Group Contacts",
    hint: "Shared group contact directory for all players in this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: []
  });
}
Hooks.once("init", () => {
  We(), ye();
});
Hooks.once("ready", () => {
  ye(), Ye(), game.socket.on(v, Ve), console.log(`${c} | Ready. Use game.modules.get("${c}").api.openCall({...})`);
});
