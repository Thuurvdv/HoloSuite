var De = Object.defineProperty;
var Ee = (e, t, a) => t in e ? De(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var A = (e, t, a) => Ee(e, typeof t != "symbol" ? t + "" : t, a);
const o = "cybercall", S = `module.${o}`, ne = `modules/${o}/templates/cybercall.hbs`, re = `modules/${o}/templates/cybercall-composer.hbs`, ce = `modules/${o}/templates/cybercall-contacts.hbs`;
let c = null, b = null, d = null, y = "personal", h = null, E = null;
const m = {
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
}, Le = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]), ie = {
  "": "Silent",
  [`modules/${o}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${o}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${o}/audio/Ringtone3.ogg`]: "Ringtone 3"
};
function le(e) {
  const t = Number(e);
  return Number.isNaN(t) ? m.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function oe(e) {
  return String(e).split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var a;
    return (a = t[0]) == null ? void 0 : a.toUpperCase();
  }).join("") || "?";
}
function u(e) {
  var a;
  if ((a = foundry == null ? void 0 : foundry.utils) != null && a.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
function U() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function T(e = {}) {
  var a;
  const t = {
    ...m,
    ...e,
    id: String(e.id ?? U()),
    callerName: String(e.callerName ?? m.callerName),
    subtitle: String(e.subtitle ?? m.subtitle),
    image: String(e.image ?? m.image),
    message: String(e.message ?? m.message),
    signal: le(e.signal ?? m.signal),
    variant: Le.has(e.variant) ? e.variant : m.variant,
    fullscreen: !!(e.fullscreen ?? m.fullscreen),
    ringing: e.ringing !== !1 && e.accepted !== !0,
    accepted: e.accepted === !0,
    canAccept: e.canAccept !== !1,
    canDecline: e.canDecline !== !1,
    allowBroadcast: e.allowBroadcast !== !1,
    outgoing: e.outgoing === !0,
    callerUserId: String(e.callerUserId ?? ""),
    contactNumber: String(e.contactNumber ?? "")
  };
  return t.initials = oe(t.callerName), t.showBroadcast = !!((a = game == null ? void 0 : game.user) != null && a.isGM && t.allowBroadcast), t.isStandard = t.variant === "standard", t.isEmergency = t.variant === "emergency", t.isCorrupted = t.variant === "corrupted", t.isIncoming = !t.accepted, t.kicker = t.outgoing ? "Outgoing CyberCall" : t.fullscreen ? "System-wide Broadcast" : "Incoming CyberCall", t;
}
function se() {
  var e, t, a, n, r, i, l, s;
  return T({
    callerName: ((e = c == null ? void 0 : c.callData) == null ? void 0 : e.callerName) ?? m.callerName,
    subtitle: ((t = c == null ? void 0 : c.callData) == null ? void 0 : t.subtitle) ?? m.subtitle,
    image: ((a = c == null ? void 0 : c.callData) == null ? void 0 : a.image) ?? "",
    message: ((n = c == null ? void 0 : c.callData) == null ? void 0 : n.message) ?? m.message,
    signal: ((r = c == null ? void 0 : c.callData) == null ? void 0 : r.signal) ?? game.settings.get(o, "defaultSignal"),
    variant: ((i = c == null ? void 0 : c.callData) == null ? void 0 : i.variant) ?? "standard",
    fullscreen: ((l = c == null ? void 0 : c.callData) == null ? void 0 : l.fullscreen) ?? !1,
    ringing: ((s = c == null ? void 0 : c.callData) == null ? void 0 : s.ringing) ?? !0
  });
}
function ue() {
  var e;
  return (((e = game.actors) == null ? void 0 : e.contents) ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    img: t.img ?? ""
  })).sort((t, a) => t.name.localeCompare(a.name));
}
function v(e = {}) {
  return {
    id: String(e.id ?? U()),
    name: String(e.name ?? "").trim(),
    number: String(e.number ?? "").trim(),
    image: String(e.image ?? e.img ?? "").trim(),
    initials: oe(e.name)
  };
}
function O() {
  const e = game.settings.get(o, "contacts");
  return Array.isArray(e) ? e.map(v).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name)) : [];
}
function D() {
  if (Array.isArray(E))
    return E.map(v).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name));
  const e = game.settings.get(o, "groupContacts");
  return Array.isArray(e) ? e.map(v).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name)) : [];
}
async function ge(e) {
  await game.settings.set(o, "contacts", e.map(v));
}
async function _(e) {
  E = e.map(v), await game.settings.set(o, "groupContacts", E), game.socket.emit(S, {
    action: "groupContactsChanged",
    contacts: E
  });
}
async function Me(e, t, a = "personal", n = "") {
  var l, s, g, p, f, C;
  const r = v({ name: e, number: t, image: n });
  if (!r.name || !r.number) {
    (s = (l = ui.notifications) == null ? void 0 : l.warn) == null || s.call(l, "Contact name and number are required.");
    return;
  }
  if (a === "group" && !game.user.isGM) {
    if (!q()) {
      (p = (g = ui.notifications) == null ? void 0 : g.warn) == null || p.call(g, "A GM must be connected to update group contacts.");
      return;
    }
    game.socket.emit(S, {
      action: "groupContactAdd",
      contact: r
    }), (C = (f = ui.notifications) == null ? void 0 : f.info) == null || C.call(f, "Group contact update sent to the GM.");
    return;
  }
  const i = a === "group" ? D() : O();
  i.push(r), a === "group" ? await _(i) : await ge(i), await k();
}
async function Ne(e, t = "personal") {
  var a, n, r, i;
  if (t === "group") {
    if (!game.user.isGM) {
      if (!q()) {
        (n = (a = ui.notifications) == null ? void 0 : a.warn) == null || n.call(a, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(S, {
        action: "groupContactRemove",
        contactId: e
      }), (i = (r = ui.notifications) == null ? void 0 : r.info) == null || i.call(r, "Group contact removal sent to the GM.");
      return;
    }
    await _(D().filter((l) => l.id !== e));
  } else
    await ge(O().filter((l) => l.id !== e));
  await k();
}
function q() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function B(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(o, "minimumRole");
  } catch (a) {
    console.warn(`${o} | Permission setting unavailable, using Player role fallback.`, a);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function V(e, t) {
  var a;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (a = e.element) != null && a[0] ? e.element[0] : e.element ?? null;
}
function de(e, t) {
  const a = V(e, t);
  a && (a.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), a.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), a.classList.toggle("cybercall-connected", e.callData.accepted), a.querySelectorAll("[data-cybercall-action]").forEach((n) => {
    n.addEventListener("click", (r) => {
      const i = r.currentTarget.dataset.cybercallAction;
      if (i === "accept") {
        je(e.callData.id);
        return;
      }
      if (i === "broadcast") {
        z({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (i === "decline" || i === "end") && ve(e.callData.id);
    });
  }));
}
function Re(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-composer]");
}
function X(e) {
  var i;
  const t = new FormData(e), a = (i = game.actors) == null ? void 0 : i.get(t.get("actorId")), n = String(t.get("image") ?? "").trim() || (a == null ? void 0 : a.img) || "", r = String(t.get("callerName") ?? "").trim() || (a == null ? void 0 : a.name) || "UNKNOWN CALLER";
  return T({
    callerName: r,
    subtitle: String(t.get("subtitle") ?? "").trim(),
    image: n,
    message: String(t.get("message") ?? "").trim(),
    signal: t.get("signal"),
    variant: String(t.get("variant") ?? m.variant),
    fullscreen: t.get("fullscreen") === "on",
    ringing: t.get("ringing") === "on"
  });
}
function H(e) {
  var n, r;
  const t = (n = e == null ? void 0 : e.elements) == null ? void 0 : n.signal, a = (r = e == null ? void 0 : e.querySelector) == null ? void 0 : r.call(e, "[data-cybercall-signal-output]");
  !t || !a || (a.textContent = `${le(t.value)}%`);
}
function pe(e, t) {
  var i, l;
  const a = V(e, t), n = Re(a);
  if (!a || !n) return;
  H(n);
  const r = a.querySelector("[data-cybercall-ringtone]");
  r && r.addEventListener("change", async (s) => {
    await game.settings.set(o, "ringSound", s.currentTarget.value);
  }), (i = n.elements.signal) == null || i.addEventListener("input", () => H(n)), (l = n.elements.actorId) == null || l.addEventListener("change", () => {
    var g;
    const s = (g = game.actors) == null ? void 0 : g.get(n.elements.actorId.value);
    s && (n.elements.callerName.value = s.name, n.elements.image.value = s.img ?? "");
  }), n.addEventListener("submit", (s) => {
    s.preventDefault(), w(X(n));
  }), a.querySelectorAll("[data-cybercall-compose-action]").forEach((s) => {
    s.addEventListener("click", async (g) => {
      var C, N, Y, W, P, K, J;
      const p = g.currentTarget.dataset.cybercallComposeAction, f = X(n);
      if (p === "preview") {
        await w(f);
        return;
      }
      if (p === "broadcast") {
        await z(f);
        return;
      }
      if (p === "close-active") {
        ve((C = c == null ? void 0 : c.callData) == null ? void 0 : C.id);
        return;
      }
      if (p === "browse-image") {
        const I = n.elements.image, Q = globalThis.FilePicker ?? ((W = (Y = (N = globalThis.foundry) == null ? void 0 : N.applications) == null ? void 0 : Y.apps) == null ? void 0 : W.FilePicker);
        if (!I || !Q) {
          (K = (P = ui.notifications) == null ? void 0 : P.warn) == null || K.call(P, "Foundry FilePicker is unavailable.");
          return;
        }
        const R = new Q({
          type: "image",
          current: I.value,
          callback: (Te) => {
            I.value = Te, I.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof R.browse == "function" ? R.browse() : (J = R.render) == null || J.call(R, !0);
        return;
      }
      p === "reset" && (n.reset(), H(n));
    });
  });
}
function ke(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function me(e, t) {
  const a = V(e, t), n = ke(a);
  if (!a || !n) return;
  n.addEventListener("submit", async (i) => {
    var g;
    i.preventDefault();
    const l = new FormData(n), s = String(l.get("scope") ?? y);
    await Me(l.get("name"), l.get("number"), s, l.get("image")), n.reset(), n.elements.scope.value = s, (g = n.elements.name) == null || g.focus();
  }), a.querySelectorAll("[data-cybercall-contact-tab]").forEach((i) => {
    i.addEventListener("click", (l) => {
      y = l.currentTarget.dataset.cybercallContactTab, a.querySelectorAll("[data-cybercall-contact-tab]").forEach((s) => {
        s.classList.toggle("active", s.dataset.cybercallContactTab === y);
      }), a.querySelectorAll("[data-cybercall-contact-panel]").forEach((s) => {
        s.hidden = s.dataset.cybercallContactPanel !== y;
      }), n.elements.scope && (n.elements.scope.value = y);
    });
  });
  const r = a.querySelector("[data-cybercall-ringtone]");
  r && r.addEventListener("change", async (i) => {
    await game.settings.set(o, "ringSound", i.currentTarget.value);
  }), a.querySelectorAll("[data-cybercall-contact-action]").forEach((i) => {
    i.addEventListener("click", async (l) => {
      const s = l.currentTarget.dataset.cybercallContactAction, g = l.currentTarget.dataset.contactId, p = l.currentTarget.dataset.contactScope ?? "personal", C = (p === "group" ? D() : O()).find((N) => N.id === g);
      if (s === "remove") {
        await Ne(g, p);
        return;
      }
      s === "call" && C && await ze(C) && d === e && await e.close();
    });
  });
}
function Oe(e) {
  return e.image ? `<img src="${u(e.image)}" alt="${u(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${u(e.initials)}</div>`;
}
function be(e) {
  const t = `--cybercall-signal: ${e.signal}%;`, a = e.fullscreen ? "cybercall-broadcast" : "", n = e.ringing ? "cybercall-ringing-panel" : "", r = e.accepted ? "cybercall-connected-panel" : "", i = e.showBroadcast ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>' : "", l = e.accepted ? "" : `
      <header class="cybercall-header">
        <div>
          <div class="cybercall-kicker">${u(e.kicker)}</div>
          <h2>${u(e.callerName)}</h2>
          <p>${u(e.subtitle)}</p>
        </div>
        <div class="cybercall-signal">
          <span>${e.signal}%</span>
          <div class="cybercall-signal-bar" aria-hidden="true"><i></i></div>
        </div>
      </header>
    `, s = e.accepted ? "" : `<blockquote>${u(e.message)}</blockquote>`, g = e.accepted || e.outgoing ? '<button type="button" data-cybercall-action="end">End Call</button>' : `
        ${e.canAccept ? '<button type="button" data-cybercall-action="accept">Accept</button>' : ""}
        <button type="button" data-cybercall-action="decline">Decline</button>
        ${i}
      `;
  return `
    <div class="cybercall-panel cybercall-${e.variant} ${a} ${n} ${r}" style="${t}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${l}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${Oe(e)}</div>
        ${s}
      </main>
      <footer class="cybercall-actions">
        ${g}
      </footer>
    </div>
  `;
}
function fe(e) {
  const t = e.call;
  return `
    <form class="cybercall-composer" data-cybercall-composer>
      <label>Actor Portrait
        <select name="actorId">
          <option value="">Manual / no actor</option>
          ${e.actors.map((n) => `<option value="${u(n.id)}">${u(n.name)}</option>`).join("")}
        </select>
      </label>
      <label>Caller Name <input type="text" name="callerName" value="${u(t.callerName)}"></label>
      <label>Subtitle / Faction <input type="text" name="subtitle" value="${u(t.subtitle)}"></label>
      <label>Portrait Image Path <span class="cybercall-composer-path-row"><input type="text" name="image" value="${u(t.image)}"><button type="button" data-cybercall-compose-action="browse-image">Browse</button></span></label>
      <label>Message <textarea name="message" rows="5">${u(t.message)}</textarea></label>
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
      <div class="cybercall-composer-ringtone">
        <label class="cybercall-ringtone-select">
          <span>Ringtone</span>
          <select data-cybercall-ringtone>
            ${(e.ringtoneChoices ?? []).map(
    (n) => `<option value="${u(n.value)}" ${n.selected ? "selected" : ""}>${u(n.label)}</option>`
  ).join("")}
          </select>
        </label>
      </div>
      <div class="cybercall-composer-actions">
        <button type="button" data-cybercall-compose-action="preview">Preview Locally</button>
        <button type="button" data-cybercall-compose-action="broadcast">Broadcast to Players</button>
        <button type="button" data-cybercall-compose-action="close-active">Close Active Call</button>
      </div>
    </form>
  `;
}
function ye(e) {
  const t = (r, i) => r.length ? r.map((l) => `
        <li>
          <div class="cybercall-contact-avatar">
            ${l.image ? `<img src="${u(l.image)}" alt="">` : `<span>${u(l.initials)}</span>`}
          </div>
          <div class="cybercall-contact-id">
            <strong>${u(l.name)}</strong>
            <span>${u(l.number)}</span>
          </div>
          <div class="cybercall-contact-actions">
            <button type="button" data-cybercall-contact-action="call" data-contact-scope="${i}" data-contact-id="${u(l.id)}">Call</button>
            <button type="button" data-cybercall-contact-action="remove" data-contact-scope="${i}" data-contact-id="${u(l.id)}">Remove</button>
          </div>
        </li>
      `).join("") : '<li class="cybercall-contacts-empty">No contacts stored.</li>', a = e.activeTab !== "group", n = e.activeTab === "group";
  return `
    <section class="cybercall-contacts">
      <header class="cybercall-contacts-header">
        <div>
          <div class="cybercall-contacts-kicker">Personal Comms Directory</div>
          <h2>CyberCall Contacts</h2>
        </div>
      </header>
      <nav class="cybercall-contact-tabs">
        <button type="button" class="${a ? "active" : ""}" data-cybercall-contact-tab="personal">Personal</button>
        <button type="button" class="${n ? "active" : ""}" data-cybercall-contact-tab="group">Group</button>
      </nav>
      <section data-cybercall-contact-panel="personal" ${a ? "" : "hidden"}>
        <ul class="cybercall-contacts-list">${t(e.contacts, "personal")}</ul>
      </section>
      <section data-cybercall-contact-panel="group" ${n ? "" : "hidden"}>
        <ul class="cybercall-contacts-list">${t(e.groupContacts, "group")}</ul>
      </section>
      <form class="cybercall-contacts-form" data-cybercall-contacts-form>
        <input type="hidden" name="scope" value="${u(e.activeTab)}">
        <label>Name <input type="text" name="name" required></label>
        <label>Number <input type="text" name="number" required></label>
        <label>Picture <input type="text" name="image" placeholder="icons/..."></label>
        <button type="submit">Add Contact</button>
      </form>
      <footer class="cybercall-contacts-footer">
        <label class="cybercall-ringtone-select">
          <span>Ringtone</span>
          <select data-cybercall-ringtone>
            ${(e.ringtoneChoices ?? []).map(
    (r) => `<option value="${u(r.value)}" ${r.selected ? "selected" : ""}>${u(r.label)}</option>`
  ).join("")}
          </select>
        </label>
      </footer>
    </section>
  `;
}
var Z, ee;
const L = (ee = (Z = foundry == null ? void 0 : foundry.applications) == null ? void 0 : Z.api) == null ? void 0 : ee.ApplicationV2;
var te, ae;
const M = (ae = (te = foundry == null ? void 0 : foundry.applications) == null ? void 0 : te.api) == null ? void 0 : ae.HandlebarsApplicationMixin;
class Pe extends Application {
  constructor(t, a = {}) {
    super(a), this.callData = T(t);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-overlay",
      title: "CyberCall",
      template: ne,
      classes: ["cybercall-app"],
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
      return console.warn(`${o} | Template render failed, using inline fallback.`, a), $(be(this.callData));
    }
  }
  activateListeners(t) {
    super.activateListeners(t), de(this, t);
  }
  async close(t) {
    return c === this && (c = null), F(), super.close(t);
  }
}
class Ie extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-composer",
      title: "CyberCall Composer",
      template: re,
      classes: ["cybercall-composer-app"],
      popOut: !0,
      resizable: !0,
      width: 560,
      height: "auto"
    });
  }
  getData() {
    return {
      call: se(),
      actors: ue(),
      ringtoneChoices: x()
    };
  }
  async _renderInner(t) {
    try {
      return await super._renderInner(t);
    } catch (a) {
      return console.warn(`${o} | Composer template render failed, using inline fallback.`, a), $(fe(t));
    }
  }
  activateListeners(t) {
    super.activateListeners(t), pe(this, t);
  }
  async close(t) {
    return b === this && (b = null), super.close(t);
  }
}
class _e extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-contacts",
      title: "CyberCall Contacts",
      template: ce,
      classes: ["cybercall-contacts-app"],
      popOut: !0,
      resizable: !0,
      width: 500,
      height: "auto"
    });
  }
  getData() {
    const t = O(), a = D();
    return {
      contacts: t,
      groupContacts: a,
      hasContacts: t.length > 0,
      hasGroupContacts: a.length > 0,
      activeTab: y,
      isPersonalTab: y !== "group",
      isGroupTab: y === "group",
      ringtoneChoices: x(),
      currentRingtone: G()
    };
  }
  async _renderInner(t) {
    try {
      return await super._renderInner(t);
    } catch (a) {
      return console.warn(`${o} | Contacts template render failed, using inline fallback.`, a), $(ye(t));
    }
  }
  activateListeners(t) {
    super.activateListeners(t), me(this, t);
  }
  async close(t) {
    return d === this && (d = null), super.close(t);
  }
}
function Ge() {
  var e;
  return !L || !M ? null : (e = class extends M(L) {
    constructor(a, n = {}) {
      super(n), this.callData = T(a);
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
      } catch (r) {
        console.warn(`${o} | Template render failed, using inline fallback.`, r);
        const i = document.createElement("template");
        return i.innerHTML = be(this.callData).trim(), i.content;
      }
    }
    _onRender(a, n) {
      var r;
      (r = super._onRender) == null || r.call(this, a, n), de(this);
    }
    async close(a) {
      return c === this && (c = null), F(), super.close(a);
    }
  }, A(e, "DEFAULT_OPTIONS", {
    id: "cybercall-overlay",
    tag: "section",
    classes: ["cybercall-app"],
    window: {
      title: "CyberCall",
      resizable: !0
    },
    position: {
      width: 440,
      height: "auto"
    }
  }), A(e, "PARTS", {
    main: {
      template: ne
    }
  }), e);
}
const xe = Ge() ?? Pe;
function Fe() {
  var e;
  return !L || !M ? null : (e = class extends M(L) {
    async _prepareContext(a) {
      return {
        ...await super._prepareContext(a),
        call: se(),
        actors: ue(),
        ringtoneChoices: x()
      };
    }
    async _renderHTML(a, n) {
      try {
        return await super._renderHTML(a, n);
      } catch (r) {
        console.warn(`${o} | Composer template render failed, using inline fallback.`, r);
        const i = document.createElement("template");
        return i.innerHTML = fe(a).trim(), i.content;
      }
    }
    _onRender(a, n) {
      var r;
      (r = super._onRender) == null || r.call(this, a, n), pe(this);
    }
    async close(a) {
      return b === this && (b = null), super.close(a);
    }
  }, A(e, "DEFAULT_OPTIONS", {
    id: "cybercall-composer",
    tag: "section",
    classes: ["cybercall-composer-app"],
    window: {
      title: "CyberCall Composer",
      resizable: !0
    },
    position: {
      width: 560,
      height: "auto"
    }
  }), A(e, "PARTS", {
    main: {
      template: re
    }
  }), e);
}
const He = Fe() ?? Ie;
function Ue() {
  var e;
  return !L || !M ? null : (e = class extends M(L) {
    async _prepareContext(a) {
      const n = O(), r = D();
      return {
        ...await super._prepareContext(a),
        contacts: n,
        groupContacts: r,
        hasContacts: n.length > 0,
        hasGroupContacts: r.length > 0,
        activeTab: y,
        isPersonalTab: y !== "group",
        isGroupTab: y === "group",
        ringtoneChoices: x(),
        currentRingtone: G()
      };
    }
    async _renderHTML(a, n) {
      try {
        return await super._renderHTML(a, n);
      } catch (r) {
        console.warn(`${o} | Contacts template render failed, using inline fallback.`, r);
        const i = document.createElement("template");
        return i.innerHTML = ye(a).trim(), i.content;
      }
    }
    _onRender(a, n) {
      var r;
      (r = super._onRender) == null || r.call(this, a, n), me(this);
    }
    async close(a) {
      return d === this && (d = null), super.close(a);
    }
  }, A(e, "DEFAULT_OPTIONS", {
    id: "cybercall-contacts",
    tag: "section",
    classes: ["cybercall-contacts-app"],
    window: {
      title: "CyberCall Contacts",
      resizable: !0
    },
    position: {
      width: 500,
      height: "auto"
    }
  }), A(e, "PARTS", {
    main: {
      template: ce
    }
  }), e);
}
const qe = Ue() ?? _e;
async function w(e = {}) {
  var t, a;
  return B() ? (d && await d.close(), await j(), c = new xe(e), await c.render(!0), Se(c), We(c.callData), c) : ((a = (t = ui.notifications) == null ? void 0 : t.warn) == null || a.call(t, "You do not have permission to open CyberCall transmissions."), null);
}
async function j() {
  if (!c) return;
  const e = c;
  c = null, await e.close();
}
function Be(e) {
  var t;
  return !!((t = c == null ? void 0 : c.callData) != null && t.id) && c.callData.id === e;
}
async function Ve() {
  c && (await c.render(!0), Se(c));
}
async function Ce(e) {
  Be(e) && (c.callData.accepted = !0, c.callData.ringing = !1, F(), await Ve());
}
function je(e) {
  e && (game.socket.emit(S, {
    action: "acceptCall",
    callId: e
  }), Ce(e));
}
async function he(e) {
  var t;
  e && ((t = c == null ? void 0 : c.callData) != null && t.id) && c.callData.id !== e || await j();
}
function ve(e) {
  game.socket.emit(S, {
    action: "endCall",
    callId: e
  }), he(e);
}
async function ze(e) {
  var l, s, g, p, f;
  if (game.user.isGM)
    return w({
      callerName: e.name,
      subtitle: `Comms ${e.number}`,
      image: e.image,
      message: `Opening channel ${e.number}...`,
      signal: game.settings.get(o, "defaultSignal"),
      variant: "standard",
      ringing: !1
    });
  if (!q())
    return (s = (l = ui.notifications) == null ? void 0 : l.warn) == null || s.call(l, "No GM is connected to receive the CyberCall."), null;
  const t = U(), a = String(((g = game.user) == null ? void 0 : g.avatar) ?? ((f = (p = game.user) == null ? void 0 : p.character) == null ? void 0 : f.img) ?? "").trim(), n = {
    id: t,
    signal: game.settings.get(o, "defaultSignal"),
    variant: "standard",
    fullscreen: !1,
    accepted: !1,
    allowBroadcast: !1,
    callerUserId: game.user.id,
    contactNumber: e.number
  }, r = T({
    ...n,
    callerName: e.name,
    subtitle: `Comms ${e.number}`,
    image: e.image,
    message: `Awaiting connection to ${e.name} on ${e.number}...`,
    canAccept: !1,
    canDecline: !1,
    outgoing: !0,
    ringing: !0
  }), i = T({
    ...n,
    callerName: game.user.name,
    subtitle: `Call request from ${game.user.name}`,
    image: a,
    message: `${game.user.name} is calling ${e.name} on ${e.number}.`,
    canAccept: !0,
    ringing: !0
  });
  return game.socket.emit(S, {
    action: "playerCallRequest",
    callData: i
  }), w(r);
}
async function we() {
  var e, t, a;
  return game.user.isGM ? b ? ((a = b.bringToFront) == null || a.call(b), b) : (b = new He(), await b.render(!0), b) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function $e() {
  var e, t, a, n;
  return B() ? c ? ((a = c.bringToFront) == null || a.call(c), c) : d ? ((n = d.bringToFront) == null || n.call(d), d) : (d = new qe(), await d.render(!0), d) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function k() {
  d && await d.render(!0);
}
async function z(e = {}) {
  var a, n;
  if (!game.user.isGM)
    return (n = (a = ui.notifications) == null ? void 0 : a.warn) == null || n.call(a, "Only the GM can broadcast CyberCalls to all players."), null;
  const t = T({
    ...e,
    fullscreen: e.fullscreen ?? !0,
    ringing: !0
  });
  return game.socket.emit(S, {
    action: "openCall",
    callData: t
  }), w({ ...t, outgoing: !0 });
}
async function Ye(e) {
  if (e) {
    if (e.action === "openCall") {
      if (!B()) return;
      w(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      w(e.callData);
      return;
    }
    if (e.action === "acceptCall") {
      Ce(e.callId);
      return;
    }
    if (e.action === "endCall") {
      he(e.callId);
      return;
    }
    if (e.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const t = v(e.contact);
      if (!t.name || !t.number) return;
      const a = D();
      a.push(t), await _(a), await k();
      return;
    }
    if (e.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await _(D().filter((t) => t.id !== e.contactId)), await k();
      return;
    }
    e.action === "groupContactsChanged" && (E = Array.isArray(e.contacts) ? e.contacts.map(v) : null, await k());
  }
}
function Se(e) {
  var t, a;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((a = e.setPosition) == null || a.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function G() {
  return String(game.settings.get(o, "ringSound") ?? "").trim();
}
function x() {
  const e = G();
  return Object.entries(ie).map(([t, a]) => ({
    value: t,
    label: a,
    selected: t === e
  }));
}
function F() {
  if (!h) return;
  const e = h;
  h = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function We(e) {
  var i;
  if (F(), !e.ringing) return;
  const t = G();
  if (!t) return;
  const n = 0.65 * Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), r = ((i = foundry == null ? void 0 : foundry.audio) == null ? void 0 : i.AudioHelper) ?? globalThis.AudioHelper;
  r != null && r.play ? r.play({ src: t, volume: n, autoplay: !0, loop: !0 }, !1).then((l) => {
    h = l;
  }).catch((l) => {
    console.warn(`${o} | Unable to play ringing sound.`, l);
  }) : (h = new Audio(t), h.loop = !0, h.volume = n, h.play().catch((l) => {
    console.warn(`${o} | Unable to play ringing sound.`, l);
  }));
}
function Ae() {
  const e = game.modules.get(o);
  e && (e.api = {
    openCall: w,
    closeCall: j,
    broadcastCall: z,
    openComposer: we,
    openContacts: $e,
    get activeCall() {
      return c;
    },
    get activeComposer() {
      return b;
    },
    get activeContacts() {
      return d;
    }
  });
}
function Ke() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: o,
    title: "CyberCall",
    icon: "fa-solid fa-satellite-dish",
    premium: !1,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => {
      var a;
      return (a = game.user) != null && a.isGM ? we() : $e();
    }
  }), !0) : !1;
}
function Je() {
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
  game.settings.register(o, "defaultSignal", {
    name: "Default Signal Strength",
    hint: "Signal percentage used when a call does not provide one.",
    scope: "client",
    config: !0,
    type: Number,
    default: m.signal,
    range: {
      min: 0,
      max: 100,
      step: 1
    }
  }), game.settings.register(o, "ringSound", {
    name: "Incoming Call Ringtone",
    hint: "Ringtone played locally while a CyberCall is ringing. This is a client setting, so each user can choose their own ringtone.",
    scope: "client",
    config: !1,
    type: String,
    default: "",
    choices: ie
  }), game.settings.register(o, "minimumRole", {
    name: "Minimum Player Role",
    hint: "Minimum role allowed to open CyberCall overlays and receive GM broadcasts.",
    scope: "world",
    config: !0,
    type: Number,
    default: e.PLAYER,
    choices: t
  }), game.settings.register(o, "contacts", {
    name: "CyberCall Contacts",
    hint: "Player contact directory stored locally for this client.",
    scope: "client",
    config: !1,
    type: Object,
    default: []
  }), game.settings.register(o, "groupContacts", {
    name: "CyberCall Group Contacts",
    hint: "Shared group contact directory for all players in this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: []
  });
}
Hooks.once("init", () => {
  Je(), Ae();
});
Hooks.once("ready", () => {
  Ae(), Ke(), game.socket.on(S, Ye), console.log(`${o} | Ready. Use game.modules.get("${o}").api.openCall({...})`);
});
