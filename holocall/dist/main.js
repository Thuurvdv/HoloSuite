var dt = Object.defineProperty;
var pt = (t, e, a) => e in t ? dt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: a }) : t[e] = a;
var A = (t, e, a) => pt(t, typeof e != "symbol" ? e + "" : e, a);
const c = "holocall", w = `module.${c}`, z = `modules/${c}/templates/holocall.hbs`, Y = `modules/${c}/templates/holocall-composer.hbs`, W = `modules/${c}/templates/holocall-contacts.hbs`;
let o = null, p = null, u = null, f = "personal", C = null, D = null;
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
}, mt = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]), ft = {
  "": "Silent",
  [`modules/${c}/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${c}/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${c}/Ringtone3.ogg`]: "Ringtone 3"
};
function K(t) {
  const e = Number(t);
  return Number.isNaN(e) ? d.signal : Math.min(100, Math.max(0, Math.round(e)));
}
function ht(t) {
  return String(t).split(/\s+/).filter(Boolean).slice(0, 2).map((e) => {
    var a;
    return (a = e[0]) == null ? void 0 : a.toUpperCase();
  }).join("") || "?";
}
function g(t) {
  var a;
  if ((a = foundry == null ? void 0 : foundry.utils) != null && a.escapeHTML) return foundry.utils.escapeHTML(String(t));
  const e = document.createElement("div");
  return e.innerText = String(t), e.innerHTML;
}
function O() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function S(t = {}) {
  var a;
  const e = {
    ...d,
    ...t,
    id: String(t.id ?? O()),
    callerName: String(t.callerName ?? d.callerName),
    subtitle: String(t.subtitle ?? d.subtitle),
    image: String(t.image ?? d.image),
    message: String(t.message ?? d.message),
    signal: K(t.signal ?? d.signal),
    variant: mt.has(t.variant) ? t.variant : d.variant,
    fullscreen: !!(t.fullscreen ?? d.fullscreen),
    ringing: t.ringing !== !1 && t.accepted !== !0,
    accepted: t.accepted === !0,
    canAccept: t.canAccept !== !1,
    canDecline: t.canDecline !== !1,
    allowBroadcast: t.allowBroadcast !== !1,
    outgoing: t.outgoing === !0,
    callerUserId: String(t.callerUserId ?? ""),
    contactNumber: String(t.contactNumber ?? "")
  };
  return e.initials = ht(e.callerName), e.showBroadcast = !!((a = game == null ? void 0 : game.user) != null && a.isGM && e.allowBroadcast), e.isStandard = e.variant === "standard", e.isEmergency = e.variant === "emergency", e.isCorrupted = e.variant === "corrupted", e.isIncoming = !e.accepted, e.kicker = e.outgoing ? "Outgoing HoloCall" : e.fullscreen ? "System-wide Broadcast" : "Incoming HoloCall", e;
}
function J() {
  var t, e, a, n, l, r, i, s;
  return S({
    callerName: ((t = o == null ? void 0 : o.callData) == null ? void 0 : t.callerName) ?? d.callerName,
    subtitle: ((e = o == null ? void 0 : o.callData) == null ? void 0 : e.subtitle) ?? d.subtitle,
    image: ((a = o == null ? void 0 : o.callData) == null ? void 0 : a.image) ?? "",
    message: ((n = o == null ? void 0 : o.callData) == null ? void 0 : n.message) ?? d.message,
    signal: ((l = o == null ? void 0 : o.callData) == null ? void 0 : l.signal) ?? game.settings.get(c, "defaultSignal"),
    variant: ((r = o == null ? void 0 : o.callData) == null ? void 0 : r.variant) ?? "standard",
    fullscreen: ((i = o == null ? void 0 : o.callData) == null ? void 0 : i.fullscreen) ?? !1,
    ringing: ((s = o == null ? void 0 : o.callData) == null ? void 0 : s.ringing) ?? !0
  });
}
function Q() {
  var t;
  return (((t = game.actors) == null ? void 0 : t.contents) ?? []).map((e) => ({
    id: e.id,
    name: e.name,
    img: e.img ?? ""
  })).sort((e, a) => e.name.localeCompare(a.name));
}
function y(t = {}) {
  return {
    id: String(t.id ?? O()),
    name: String(t.name ?? "").trim(),
    number: String(t.number ?? "").trim()
  };
}
function N() {
  const t = game.settings.get(c, "contacts");
  return Array.isArray(t) ? t.map(y).filter((e) => e.name && e.number).sort((e, a) => e.name.localeCompare(a.name)) : [];
}
function T() {
  if (Array.isArray(D))
    return D.map(y).filter((e) => e.name && e.number).sort((e, a) => e.name.localeCompare(a.name));
  const t = game.settings.get(c, "groupContacts");
  return Array.isArray(t) ? t.map(y).filter((e) => e.name && e.number).sort((e, a) => e.name.localeCompare(a.name)) : [];
}
async function X(t) {
  await game.settings.set(c, "contacts", t.map(y));
}
async function H(t) {
  D = t.map(y), await game.settings.set(c, "groupContacts", D), game.socket.emit(w, {
    action: "groupContactsChanged",
    contacts: D
  });
}
async function bt(t, e, a = "personal") {
  var r, i, s, m, h, b;
  const n = y({ name: t, number: e });
  if (!n.name || !n.number) {
    (i = (r = ui.notifications) == null ? void 0 : r.warn) == null || i.call(r, "Contact name and number are required.");
    return;
  }
  if (a === "group" && !game.user.isGM) {
    if (!_()) {
      (m = (s = ui.notifications) == null ? void 0 : s.warn) == null || m.call(s, "A GM must be connected to update group contacts.");
      return;
    }
    game.socket.emit(w, {
      action: "groupContactAdd",
      contact: n
    }), (b = (h = ui.notifications) == null ? void 0 : h.info) == null || b.call(h, "Group contact update sent to the GM.");
    return;
  }
  const l = a === "group" ? T() : N();
  l.push(n), a === "group" ? await H(l) : await X(l), await E();
}
async function Ct(t, e = "personal") {
  var a, n, l, r;
  if (e === "group") {
    if (!game.user.isGM) {
      if (!_()) {
        (n = (a = ui.notifications) == null ? void 0 : a.warn) == null || n.call(a, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(w, {
        action: "groupContactRemove",
        contactId: t
      }), (r = (l = ui.notifications) == null ? void 0 : l.info) == null || r.call(l, "Group contact removal sent to the GM.");
      return;
    }
    await H(T().filter((i) => i.id !== t));
  } else
    await X(N().filter((i) => i.id !== t));
  await E();
}
function _() {
  var t;
  return ((t = game.users) == null ? void 0 : t.some((e) => e.isGM && e.active)) ?? !1;
}
function I(t = game.user) {
  if (t != null && t.isGM) return !0;
  let e = CONST.USER_ROLES.PLAYER;
  try {
    e = game.settings.get(c, "minimumRole");
  } catch (a) {
    console.warn(`${c} | Permission setting unavailable, using Player role fallback.`, a);
  }
  return Number((t == null ? void 0 : t.role) ?? 0) >= Number(e);
}
function P(t, e) {
  var a;
  return e != null && e[0] ? e[0] : e instanceof HTMLElement ? e : (a = t.element) != null && a[0] ? t.element[0] : t.element ?? null;
}
function Z(t, e) {
  const a = P(t, e);
  a && (a.classList.toggle("holocall-fullscreen", t.callData.fullscreen), a.classList.toggle("holocall-ringing", t.callData.ringing && !t.callData.accepted), a.classList.toggle("holocall-connected", t.callData.accepted), a.querySelectorAll("[data-holocall-action]").forEach((n) => {
    n.addEventListener("click", (l) => {
      const r = l.currentTarget.dataset.holocallAction;
      if (r === "accept") {
        Rt(t.callData.id);
        return;
      }
      if (r === "broadcast") {
        x({
          ...t.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (r === "decline" || r === "end") && it(t.callData.id);
    });
  }));
}
function yt(t) {
  var e;
  return (e = t == null ? void 0 : t.querySelector) == null ? void 0 : e.call(t, "form[data-holocall-composer]");
}
function U(t) {
  var r;
  const e = new FormData(t), a = (r = game.actors) == null ? void 0 : r.get(e.get("actorId")), n = String(e.get("image") ?? "").trim() || (a == null ? void 0 : a.img) || "", l = String(e.get("callerName") ?? "").trim() || (a == null ? void 0 : a.name) || "UNKNOWN CALLER";
  return S({
    callerName: l,
    subtitle: String(e.get("subtitle") ?? "").trim(),
    image: n,
    message: String(e.get("message") ?? "").trim(),
    signal: e.get("signal"),
    variant: String(e.get("variant") ?? d.variant),
    fullscreen: e.get("fullscreen") === "on",
    ringing: e.get("ringing") === "on"
  });
}
function R(t) {
  var n, l;
  const e = (n = t == null ? void 0 : t.elements) == null ? void 0 : n.signal, a = (l = t == null ? void 0 : t.querySelector) == null ? void 0 : l.call(t, "[data-holocall-signal-output]");
  !e || !a || (a.textContent = `${K(e.value)}%`);
}
function tt(t, e) {
  var l, r;
  const a = P(t, e), n = yt(a);
  !a || !n || (R(n), (l = n.elements.signal) == null || l.addEventListener("input", () => R(n)), (r = n.elements.actorId) == null || r.addEventListener("change", () => {
    var s;
    const i = (s = game.actors) == null ? void 0 : s.get(n.elements.actorId.value);
    i && (n.elements.callerName.value = i.name, n.elements.image.value = i.img ?? "");
  }), n.addEventListener("submit", (i) => {
    i.preventDefault(), v(U(n));
  }), a.querySelectorAll("[data-holocall-compose-action]").forEach((i) => {
    i.addEventListener("click", async (s) => {
      var b;
      const m = s.currentTarget.dataset.holocallComposeAction, h = U(n);
      if (m === "preview") {
        await v(h);
        return;
      }
      if (m === "broadcast") {
        await x(h);
        return;
      }
      if (m === "close-active") {
        it((b = o == null ? void 0 : o.callData) == null ? void 0 : b.id);
        return;
      }
      m === "reset" && (n.reset(), R(n));
    });
  }));
}
function vt(t) {
  var e;
  return (e = t == null ? void 0 : t.querySelector) == null ? void 0 : e.call(t, "form[data-holocall-contacts-form]");
}
function et(t, e) {
  const a = P(t, e), n = vt(a);
  !a || !n || (n.addEventListener("submit", async (l) => {
    var s;
    l.preventDefault();
    const r = new FormData(n), i = String(r.get("scope") ?? f);
    await bt(r.get("name"), r.get("number"), i), n.reset(), n.elements.scope.value = i, (s = n.elements.name) == null || s.focus();
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
      const i = r.currentTarget.dataset.holocallContactAction, s = r.currentTarget.dataset.contactId, m = r.currentTarget.dataset.contactScope ?? "personal", b = (m === "group" ? T() : N()).find((F) => F.id === s);
      if (i === "remove") {
        await Ct(s, m);
        return;
      }
      i === "call" && b && await Ot(b) && u === t && await t.close();
    });
  }));
}
function wt(t) {
  return t.image ? `<img src="${g(t.image)}" alt="${g(t.callerName)}">` : `<div class="holocall-initials" aria-hidden="true">${g(t.initials)}</div>`;
}
function at(t) {
  const e = `--holocall-signal: ${t.signal}%;`, a = t.fullscreen ? "holocall-broadcast" : "", n = t.ringing ? "holocall-ringing-panel" : "", l = t.accepted ? "holocall-connected-panel" : "", r = t.showBroadcast ? '<button type="button" data-holocall-action="broadcast">Broadcast</button>' : "", i = t.accepted ? "" : `
      <header class="holocall-header">
        <div>
          <div class="holocall-kicker">${g(t.kicker)}</div>
          <h2>${g(t.callerName)}</h2>
          <p>${g(t.subtitle)}</p>
        </div>
        <div class="holocall-signal">
          <span>${t.signal}%</span>
          <div class="holocall-signal-bar" aria-hidden="true"><i></i></div>
        </div>
      </header>
    `, s = t.accepted ? "" : `<blockquote>${g(t.message)}</blockquote>`, m = t.accepted ? '<button type="button" data-holocall-action="end">End Call</button>' : `
        ${t.canAccept ? '<button type="button" data-holocall-action="accept">Accept</button>' : ""}
        ${t.canDecline ? '<button type="button" data-holocall-action="decline">Decline</button>' : ""}
        ${r}
        <button type="button" data-holocall-action="end">End Call</button>
      `;
  return `
    <div class="holocall-panel holocall-${t.variant} ${a} ${n} ${l}" style="${e}">
      <div class="holocall-static" aria-hidden="true"></div>
      <div class="holocall-reticle" aria-hidden="true"></div>
      ${i}
      <main class="holocall-body">
        <div class="holocall-portrait">${wt(t)}</div>
        ${s}
      </main>
      <footer class="holocall-actions">
        ${m}
      </footer>
    </div>
  `;
}
function nt(t) {
  const e = t.call;
  return `
    <form class="holocall-composer" data-holocall-composer>
      <label>Actor Portrait
        <select name="actorId">
          <option value="">Manual / no actor</option>
          ${t.actors.map((n) => `<option value="${g(n.id)}">${g(n.name)}</option>`).join("")}
        </select>
      </label>
      <label>Caller Name <input type="text" name="callerName" value="${g(e.callerName)}"></label>
      <label>Subtitle / Faction <input type="text" name="subtitle" value="${g(e.subtitle)}"></label>
      <label>Portrait Image Path <input type="text" name="image" value="${g(e.image)}"></label>
      <label>Message <textarea name="message" rows="5">${g(e.message)}</textarea></label>
      <label>Signal <input type="range" name="signal" min="0" max="100" value="${e.signal}"></label>
      <label>Variant
        <select name="variant">
          <option value="standard" ${e.variant === "standard" ? "selected" : ""}>Standard Blue</option>
          <option value="emergency" ${e.variant === "emergency" ? "selected" : ""}>Emergency Red</option>
          <option value="corrupted" ${e.variant === "corrupted" ? "selected" : ""}>Corrupted Green</option>
        </select>
      </label>
      <label><input type="checkbox" name="fullscreen" ${e.fullscreen ? "checked" : ""}> Fullscreen Broadcast</label>
      <label><input type="checkbox" name="ringing" ${e.ringing ? "checked" : ""}> Ringing Animation / Sound</label>
      <div class="holocall-composer-actions">
        <button type="button" data-holocall-compose-action="preview">Preview Locally</button>
        <button type="button" data-holocall-compose-action="broadcast">Broadcast to Players</button>
        <button type="button" data-holocall-compose-action="close-active">Close Active Call</button>
      </div>
    </form>
  `;
}
function ot(t) {
  const e = (l, r) => l.length ? l.map((i) => `
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
      `).join("") : '<li class="holocall-contacts-empty">No contacts stored.</li>', a = t.activeTab !== "group", n = t.activeTab === "group";
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
        <ul class="holocall-contacts-list">${e(t.contacts, "personal")}</ul>
      </section>
      <section data-holocall-contact-panel="group" ${n ? "" : "hidden"}>
        <ul class="holocall-contacts-list">${e(t.groupContacts, "group")}</ul>
      </section>
      <form class="holocall-contacts-form" data-holocall-contacts-form>
        <input type="hidden" name="scope" value="${g(t.activeTab)}">
        <label>Name <input type="text" name="name" required></label>
        <label>Number <input type="text" name="number" required></label>
        <button type="submit">Add Contact</button>
      </form>
    </section>
  `;
}
var q, B;
const M = (B = (q = foundry == null ? void 0 : foundry.applications) == null ? void 0 : q.api) == null ? void 0 : B.ApplicationV2;
var V, j;
const L = (j = (V = foundry == null ? void 0 : foundry.applications) == null ? void 0 : V.api) == null ? void 0 : j.HandlebarsApplicationMixin;
class At extends Application {
  constructor(e, a = {}) {
    super(a), this.callData = S(e);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holocall-overlay",
      title: "HoloCall",
      template: z,
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
  async _renderInner(e) {
    try {
      return await super._renderInner(e);
    } catch (a) {
      return console.warn(`${c} | Template render failed, using inline fallback.`, a), $(at(this.callData));
    }
  }
  activateListeners(e) {
    super.activateListeners(e), Z(this, e);
  }
  async close(e) {
    return o === this && (o = null), k(), super.close(e);
  }
}
class St extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holocall-composer",
      title: "HoloCall Composer",
      template: Y,
      classes: ["holocall-composer-app"],
      popOut: !0,
      resizable: !0,
      width: 560,
      height: "auto"
    });
  }
  getData() {
    return {
      call: J(),
      actors: Q()
    };
  }
  async _renderInner(e) {
    try {
      return await super._renderInner(e);
    } catch (a) {
      return console.warn(`${c} | Composer template render failed, using inline fallback.`, a), $(nt(e));
    }
  }
  activateListeners(e) {
    super.activateListeners(e), tt(this, e);
  }
  async close(e) {
    return p === this && (p = null), super.close(e);
  }
}
class $t extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holocall-contacts",
      title: "HoloCall Contacts",
      template: W,
      classes: ["holocall-contacts-app"],
      popOut: !0,
      resizable: !0,
      width: 500,
      height: "auto"
    });
  }
  getData() {
    const e = N(), a = T();
    return {
      contacts: e,
      groupContacts: a,
      hasContacts: e.length > 0,
      hasGroupContacts: a.length > 0,
      activeTab: f,
      isPersonalTab: f !== "group",
      isGroupTab: f === "group"
    };
  }
  async _renderInner(e) {
    try {
      return await super._renderInner(e);
    } catch (a) {
      return console.warn(`${c} | Contacts template render failed, using inline fallback.`, a), $(ot(e));
    }
  }
  activateListeners(e) {
    super.activateListeners(e), et(this, e);
  }
  async close(e) {
    return u === this && (u = null), super.close(e);
  }
}
function Tt() {
  var t;
  return !M || !L ? null : (t = class extends L(M) {
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
        return r.innerHTML = at(this.callData).trim(), r.content;
      }
    }
    _onRender(a, n) {
      var l;
      (l = super._onRender) == null || l.call(this, a, n), Z(this);
    }
    async close(a) {
      return o === this && (o = null), k(), super.close(a);
    }
  }, A(t, "DEFAULT_OPTIONS", {
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
  }), A(t, "PARTS", {
    main: {
      template: z
    }
  }), t);
}
const Dt = Tt() ?? At;
function Mt() {
  var t;
  return !M || !L ? null : (t = class extends L(M) {
    async _prepareContext(a) {
      return {
        ...await super._prepareContext(a),
        call: J(),
        actors: Q()
      };
    }
    async _renderHTML(a, n) {
      try {
        return await super._renderHTML(a, n);
      } catch (l) {
        console.warn(`${c} | Composer template render failed, using inline fallback.`, l);
        const r = document.createElement("template");
        return r.innerHTML = nt(a).trim(), r.content;
      }
    }
    _onRender(a, n) {
      var l;
      (l = super._onRender) == null || l.call(this, a, n), tt(this);
    }
    async close(a) {
      return p === this && (p = null), super.close(a);
    }
  }, A(t, "DEFAULT_OPTIONS", {
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
  }), A(t, "PARTS", {
    main: {
      template: Y
    }
  }), t);
}
const Lt = Mt() ?? St;
function Et() {
  var t;
  return !M || !L ? null : (t = class extends L(M) {
    async _prepareContext(a) {
      const n = N(), l = T();
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
        return r.innerHTML = ot(a).trim(), r.content;
      }
    }
    _onRender(a, n) {
      var l;
      (l = super._onRender) == null || l.call(this, a, n), et(this);
    }
    async close(a) {
      return u === this && (u = null), super.close(a);
    }
  }, A(t, "DEFAULT_OPTIONS", {
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
  }), A(t, "PARTS", {
    main: {
      template: W
    }
  }), t);
}
const Nt = Et() ?? $t;
async function v(t = {}) {
  var e, a;
  return I() ? (u && await u.close(), await G(), o = new Dt(t), await o.render(!0), ut(o), Pt(o.callData), o) : ((a = (e = ui.notifications) == null ? void 0 : e.warn) == null || a.call(e, "You do not have permission to open HoloCall transmissions."), null);
}
async function G() {
  if (!o) return;
  const t = o;
  o = null, await t.close();
}
function Ht(t) {
  var e;
  return !!((e = o == null ? void 0 : o.callData) != null && e.id) && o.callData.id === t;
}
async function kt() {
  o && (await o.render(!0), ut(o));
}
async function lt(t) {
  Ht(t) && (o.callData.accepted = !0, o.callData.ringing = !1, k(), await kt());
}
function Rt(t) {
  t && (game.socket.emit(w, {
    action: "acceptCall",
    callId: t
  }), lt(t));
}
async function rt(t) {
  var e;
  t && ((e = o == null ? void 0 : o.callData) != null && e.id) && o.callData.id !== t || await G();
}
function it(t) {
  game.socket.emit(w, {
    action: "endCall",
    callId: t
  }), rt(t);
}
async function Ot(t) {
  var r, i;
  if (game.user.isGM)
    return v({
      callerName: t.name,
      subtitle: `Comms ${t.number}`,
      message: `Opening channel ${t.number}...`,
      signal: game.settings.get(c, "defaultSignal"),
      variant: "standard",
      ringing: !1
    });
  if (!_())
    return (i = (r = ui.notifications) == null ? void 0 : r.warn) == null || i.call(r, "No GM is connected to receive the HoloCall."), null;
  const a = {
    id: O(),
    callerName: t.name,
    subtitle: `Comms ${t.number}`,
    image: "",
    signal: game.settings.get(c, "defaultSignal"),
    variant: "standard",
    fullscreen: !1,
    accepted: !1,
    allowBroadcast: !1,
    callerUserId: game.user.id,
    contactNumber: t.number
  }, n = S({
    ...a,
    message: `Awaiting connection to ${t.name} on ${t.number}...`,
    canAccept: !1,
    canDecline: !1,
    outgoing: !0,
    ringing: !0
  }), l = S({
    ...a,
    subtitle: `Call request from ${game.user.name}`,
    message: `${game.user.name} is calling ${t.name} on ${t.number}.`,
    canAccept: !0,
    ringing: !0
  });
  return game.socket.emit(w, {
    action: "playerCallRequest",
    callData: l
  }), v(n);
}
async function ct() {
  var t, e, a;
  return game.user.isGM ? p ? ((a = p.bringToFront) == null || a.call(p), p) : (p = new Lt(), await p.render(!0), p) : ((e = (t = ui.notifications) == null ? void 0 : t.warn) == null || e.call(t, "Only the GM can open the HoloCall composer."), null);
}
async function st() {
  var t, e, a, n;
  return I() ? o ? ((a = o.bringToFront) == null || a.call(o), o) : u ? ((n = u.bringToFront) == null || n.call(u), u) : (u = new Nt(), await u.render(!0), u) : ((e = (t = ui.notifications) == null ? void 0 : t.warn) == null || e.call(t, "You do not have permission to use HoloCall contacts."), null);
}
async function E() {
  u && await u.render(!0);
}
async function x(t = {}) {
  var a, n;
  if (!game.user.isGM)
    return (n = (a = ui.notifications) == null ? void 0 : a.warn) == null || n.call(a, "Only the GM can broadcast HoloCalls to all players."), null;
  const e = S({
    ...t,
    fullscreen: t.fullscreen ?? !0,
    ringing: !0
  });
  return game.socket.emit(w, {
    action: "openCall",
    callData: e
  }), v(e);
}
async function _t(t) {
  if (t) {
    if (t.action === "openCall") {
      if (!I()) return;
      v(t.callData);
      return;
    }
    if (t.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      v(t.callData);
      return;
    }
    if (t.action === "acceptCall") {
      lt(t.callId);
      return;
    }
    if (t.action === "endCall") {
      rt(t.callId);
      return;
    }
    if (t.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const e = y(t.contact);
      if (!e.name || !e.number) return;
      const a = T();
      a.push(e), await H(a), await E();
      return;
    }
    if (t.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await H(T().filter((e) => e.id !== t.contactId)), await E();
      return;
    }
    t.action === "groupContactsChanged" && (D = Array.isArray(t.contacts) ? t.contacts.map(y) : null, await E());
  }
}
function ut(t) {
  var e, a;
  (e = t == null ? void 0 : t.callData) != null && e.fullscreen && ((a = t.setPosition) == null || a.call(t, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function It() {
  return String(game.settings.get(c, "ringSound") ?? "").trim();
}
function k() {
  C && (C.pause(), C.currentTime = 0, C = null);
}
function Pt(t) {
  if (k(), !t.ringing) return;
  const e = It();
  e && (C = new Audio(e), C.loop = !0, C.volume = 0.65, C.play().catch((a) => {
    console.warn(`${c} | Unable to play ringing sound.`, a);
  }));
}
function gt() {
  const t = game.modules.get(c);
  t && (t.api = {
    openCall: v,
    closeCall: G,
    broadcastCall: x,
    openComposer: ct,
    openContacts: st,
    get activeCall() {
      return o;
    },
    get activeComposer() {
      return p;
    },
    get activeContacts() {
      return u;
    }
  });
}
function Gt() {
  const t = game.modules.get("holosuite-core"), e = t != null && t.active ? t.api : null;
  return e != null && e.registerApp ? (e.registerApp({
    id: c,
    title: "HoloCall",
    icon: "fa-solid fa-satellite-dish",
    premium: !1,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => {
      var a;
      return (a = game.user) != null && a.isGM ? ct() : st();
    }
  }), !0) : !1;
}
function xt() {
  const t = CONST.USER_ROLES, e = {};
  for (const [a, n] of [
    ["NONE", "None"],
    ["LIMITED", "Limited"],
    ["OBSERVER", "Observer"],
    ["PLAYER", "Player"],
    ["TRUSTED", "Trusted Player"],
    ["ASSISTANT", "Assistant GM"]
  ])
    Number.isFinite(Number(t[a])) && (e[t[a]] = n);
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
    choices: ft
  }), game.settings.register(c, "minimumRole", {
    name: "Minimum Player Role",
    hint: "Minimum role allowed to open HoloCall overlays and receive GM broadcasts.",
    scope: "world",
    config: !0,
    type: Number,
    default: t.PLAYER,
    choices: e
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
  xt(), gt();
});
Hooks.once("ready", () => {
  gt(), Gt(), game.socket.on(w, _t), console.log(`${c} | Ready. Use game.modules.get("${c}").api.openCall({...})`);
});
