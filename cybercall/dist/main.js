var Te = Object.defineProperty;
var De = (e, t, a) => t in e ? Te(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var A = (e, t, a) => De(e, typeof t != "symbol" ? t + "" : t, a);
const c = "cybercall", S = `module.${c}`, te = `modules/${c}/templates/cybercall.hbs`, ae = `modules/${c}/templates/cybercall-composer.hbs`, ne = `modules/${c}/templates/cybercall-contacts.hbs`;
let o = null, p = null, d = null, b = "personal", y = null, E = null;
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
}, Ee = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]), oe = {
  "": "Silent",
  [`modules/${c}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${c}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${c}/audio/Ringtone3.ogg`]: "Ringtone 3"
};
function le(e) {
  const t = Number(e);
  return Number.isNaN(t) ? m.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function re(e) {
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
function F() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function T(e = {}) {
  var a;
  const t = {
    ...m,
    ...e,
    id: String(e.id ?? F()),
    callerName: String(e.callerName ?? m.callerName),
    subtitle: String(e.subtitle ?? m.subtitle),
    image: String(e.image ?? m.image),
    message: String(e.message ?? m.message),
    signal: le(e.signal ?? m.signal),
    variant: Ee.has(e.variant) ? e.variant : m.variant,
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
  return t.initials = re(t.callerName), t.showBroadcast = !!((a = game == null ? void 0 : game.user) != null && a.isGM && t.allowBroadcast), t.isStandard = t.variant === "standard", t.isEmergency = t.variant === "emergency", t.isCorrupted = t.variant === "corrupted", t.isIncoming = !t.accepted, t.kicker = t.outgoing ? "Outgoing CyberCall" : t.fullscreen ? "System-wide Broadcast" : "Incoming CyberCall", t;
}
function ie() {
  var e, t, a, n, l, i, r, s;
  return T({
    callerName: ((e = o == null ? void 0 : o.callData) == null ? void 0 : e.callerName) ?? m.callerName,
    subtitle: ((t = o == null ? void 0 : o.callData) == null ? void 0 : t.subtitle) ?? m.subtitle,
    image: ((a = o == null ? void 0 : o.callData) == null ? void 0 : a.image) ?? "",
    message: ((n = o == null ? void 0 : o.callData) == null ? void 0 : n.message) ?? m.message,
    signal: ((l = o == null ? void 0 : o.callData) == null ? void 0 : l.signal) ?? game.settings.get(c, "defaultSignal"),
    variant: ((i = o == null ? void 0 : o.callData) == null ? void 0 : i.variant) ?? "standard",
    fullscreen: ((r = o == null ? void 0 : o.callData) == null ? void 0 : r.fullscreen) ?? !1,
    ringing: ((s = o == null ? void 0 : o.callData) == null ? void 0 : s.ringing) ?? !0
  });
}
function ce() {
  var e;
  return (((e = game.actors) == null ? void 0 : e.contents) ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    img: t.img ?? ""
  })).sort((t, a) => t.name.localeCompare(a.name));
}
function v(e = {}) {
  return {
    id: String(e.id ?? F()),
    name: String(e.name ?? "").trim(),
    number: String(e.number ?? "").trim(),
    image: String(e.image ?? e.img ?? "").trim(),
    initials: re(e.name)
  };
}
function R() {
  const e = game.settings.get(c, "contacts");
  return Array.isArray(e) ? e.map(v).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name)) : [];
}
function D() {
  if (Array.isArray(E))
    return E.map(v).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name));
  const e = game.settings.get(c, "groupContacts");
  return Array.isArray(e) ? e.map(v).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name)) : [];
}
async function se(e) {
  await game.settings.set(c, "contacts", e.map(v));
}
async function _(e) {
  E = e.map(v), await game.settings.set(c, "groupContacts", E), game.socket.emit(S, {
    action: "groupContactsChanged",
    contacts: E
  });
}
async function Me(e, t, a = "personal", n = "") {
  var r, s, g, f, h, C;
  const l = v({ name: e, number: t, image: n });
  if (!l.name || !l.number) {
    (s = (r = ui.notifications) == null ? void 0 : r.warn) == null || s.call(r, "Contact name and number are required.");
    return;
  }
  if (a === "group" && !game.user.isGM) {
    if (!U()) {
      (f = (g = ui.notifications) == null ? void 0 : g.warn) == null || f.call(g, "A GM must be connected to update group contacts.");
      return;
    }
    game.socket.emit(S, {
      action: "groupContactAdd",
      contact: l
    }), (C = (h = ui.notifications) == null ? void 0 : h.info) == null || C.call(h, "Group contact update sent to the GM.");
    return;
  }
  const i = a === "group" ? D() : R();
  i.push(l), a === "group" ? await _(i) : await se(i), await k();
}
async function Le(e, t = "personal") {
  var a, n, l, i;
  if (t === "group") {
    if (!game.user.isGM) {
      if (!U()) {
        (n = (a = ui.notifications) == null ? void 0 : a.warn) == null || n.call(a, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(S, {
        action: "groupContactRemove",
        contactId: e
      }), (i = (l = ui.notifications) == null ? void 0 : l.info) == null || i.call(l, "Group contact removal sent to the GM.");
      return;
    }
    await _(D().filter((r) => r.id !== e));
  } else
    await se(R().filter((r) => r.id !== e));
  await k();
}
function U() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function q(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(c, "minimumRole");
  } catch (a) {
    console.warn(`${c} | Permission setting unavailable, using Player role fallback.`, a);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function B(e, t) {
  var a;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (a = e.element) != null && a[0] ? e.element[0] : e.element ?? null;
}
function ue(e, t) {
  const a = B(e, t);
  a && (a.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), a.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), a.classList.toggle("cybercall-connected", e.callData.accepted), a.querySelectorAll("[data-cybercall-action]").forEach((n) => {
    n.addEventListener("click", (l) => {
      const i = l.currentTarget.dataset.cybercallAction;
      if (i === "accept") {
        Ve(e.callData.id);
        return;
      }
      if (i === "broadcast") {
        j({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (i === "decline" || i === "end") && Ce(e.callData.id);
    });
  }));
}
function Ne(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-composer]");
}
function J(e) {
  var i;
  const t = new FormData(e), a = (i = game.actors) == null ? void 0 : i.get(t.get("actorId")), n = String(t.get("image") ?? "").trim() || (a == null ? void 0 : a.img) || "", l = String(t.get("callerName") ?? "").trim() || (a == null ? void 0 : a.name) || "UNKNOWN CALLER";
  return T({
    callerName: l,
    subtitle: String(t.get("subtitle") ?? "").trim(),
    image: n,
    message: String(t.get("message") ?? "").trim(),
    signal: t.get("signal"),
    variant: String(t.get("variant") ?? m.variant),
    fullscreen: t.get("fullscreen") === "on",
    ringing: t.get("ringing") === "on"
  });
}
function x(e) {
  var n, l;
  const t = (n = e == null ? void 0 : e.elements) == null ? void 0 : n.signal, a = (l = e == null ? void 0 : e.querySelector) == null ? void 0 : l.call(e, "[data-cybercall-signal-output]");
  !t || !a || (a.textContent = `${le(t.value)}%`);
}
function ge(e, t) {
  var l, i;
  const a = B(e, t), n = Ne(a);
  !a || !n || (x(n), (l = n.elements.signal) == null || l.addEventListener("input", () => x(n)), (i = n.elements.actorId) == null || i.addEventListener("change", () => {
    var s;
    const r = (s = game.actors) == null ? void 0 : s.get(n.elements.actorId.value);
    r && (n.elements.callerName.value = r.name, n.elements.image.value = r.img ?? "");
  }), n.addEventListener("submit", (r) => {
    r.preventDefault(), w(J(n));
  }), a.querySelectorAll("[data-cybercall-compose-action]").forEach((r) => {
    r.addEventListener("click", async (s) => {
      var h, C, N, z, O, Y, W;
      const g = s.currentTarget.dataset.cybercallComposeAction, f = J(n);
      if (g === "preview") {
        await w(f);
        return;
      }
      if (g === "broadcast") {
        await j(f);
        return;
      }
      if (g === "close-active") {
        Ce((h = o == null ? void 0 : o.callData) == null ? void 0 : h.id);
        return;
      }
      if (g === "browse-image") {
        const P = n.elements.image, K = globalThis.FilePicker ?? ((z = (N = (C = globalThis.foundry) == null ? void 0 : C.applications) == null ? void 0 : N.apps) == null ? void 0 : z.FilePicker);
        if (!P || !K) {
          (Y = (O = ui.notifications) == null ? void 0 : O.warn) == null || Y.call(O, "Foundry FilePicker is unavailable.");
          return;
        }
        const H = new K({
          type: "image",
          current: P.value,
          callback: (Ae) => {
            P.value = Ae, P.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof H.browse == "function" ? H.browse() : (W = H.render) == null || W.call(H, !0);
        return;
      }
      g === "reset" && (n.reset(), x(n));
    });
  }));
}
function He(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function de(e, t) {
  const a = B(e, t), n = He(a);
  if (!a || !n) return;
  n.addEventListener("submit", async (i) => {
    var g;
    i.preventDefault();
    const r = new FormData(n), s = String(r.get("scope") ?? b);
    await Me(r.get("name"), r.get("number"), s, r.get("image")), n.reset(), n.elements.scope.value = s, (g = n.elements.name) == null || g.focus();
  }), a.querySelectorAll("[data-cybercall-contact-tab]").forEach((i) => {
    i.addEventListener("click", (r) => {
      b = r.currentTarget.dataset.cybercallContactTab, a.querySelectorAll("[data-cybercall-contact-tab]").forEach((s) => {
        s.classList.toggle("active", s.dataset.cybercallContactTab === b);
      }), a.querySelectorAll("[data-cybercall-contact-panel]").forEach((s) => {
        s.hidden = s.dataset.cybercallContactPanel !== b;
      }), n.elements.scope && (n.elements.scope.value = b);
    });
  });
  const l = a.querySelector("[data-cybercall-ringtone]");
  l && l.addEventListener("change", async (i) => {
    await game.settings.set(c, "ringSound", i.currentTarget.value);
  }), a.querySelectorAll("[data-cybercall-contact-action]").forEach((i) => {
    i.addEventListener("click", async (r) => {
      const s = r.currentTarget.dataset.cybercallContactAction, g = r.currentTarget.dataset.contactId, f = r.currentTarget.dataset.contactScope ?? "personal", C = (f === "group" ? D() : R()).find((N) => N.id === g);
      if (s === "remove") {
        await Le(g, f);
        return;
      }
      s === "call" && C && await je(C) && d === e && await e.close();
    });
  });
}
function ke(e) {
  return e.image ? `<img src="${u(e.image)}" alt="${u(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${u(e.initials)}</div>`;
}
function me(e) {
  const t = `--cybercall-signal: ${e.signal}%;`, a = e.fullscreen ? "cybercall-broadcast" : "", n = e.ringing ? "cybercall-ringing-panel" : "", l = e.accepted ? "cybercall-connected-panel" : "", i = e.showBroadcast ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>' : "", r = e.accepted ? "" : `
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
    `, s = e.accepted ? "" : `<blockquote>${u(e.message)}</blockquote>`, g = e.accepted ? '<button type="button" data-cybercall-action="end">End Call</button>' : `
        ${e.canAccept ? '<button type="button" data-cybercall-action="accept">Accept</button>' : ""}
        ${e.canDecline ? '<button type="button" data-cybercall-action="decline">Decline</button>' : ""}
        ${i}
        <button type="button" data-cybercall-action="end">End Call</button>
      `;
  return `
    <div class="cybercall-panel cybercall-${e.variant} ${a} ${n} ${l}" style="${t}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${r}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${ke(e)}</div>
        ${s}
      </main>
      <footer class="cybercall-actions">
        ${g}
      </footer>
    </div>
  `;
}
function pe(e) {
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
      <div class="cybercall-composer-actions">
        <button type="button" data-cybercall-compose-action="preview">Preview Locally</button>
        <button type="button" data-cybercall-compose-action="broadcast">Broadcast to Players</button>
        <button type="button" data-cybercall-compose-action="close-active">Close Active Call</button>
      </div>
    </form>
  `;
}
function fe(e) {
  const t = (l, i) => l.length ? l.map((r) => `
        <li>
          <div class="cybercall-contact-avatar">
            ${r.image ? `<img src="${u(r.image)}" alt="">` : `<span>${u(r.initials)}</span>`}
          </div>
          <div class="cybercall-contact-id">
            <strong>${u(r.name)}</strong>
            <span>${u(r.number)}</span>
          </div>
          <div class="cybercall-contact-actions">
            <button type="button" data-cybercall-contact-action="call" data-contact-scope="${i}" data-contact-id="${u(r.id)}">Call</button>
            <button type="button" data-cybercall-contact-action="remove" data-contact-scope="${i}" data-contact-id="${u(r.id)}">Remove</button>
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
    (l) => `<option value="${u(l.value)}" ${l.selected ? "selected" : ""}>${u(l.label)}</option>`
  ).join("")}
          </select>
        </label>
      </footer>
    </section>
  `;
}
var Q, X;
const M = (X = (Q = foundry == null ? void 0 : foundry.applications) == null ? void 0 : Q.api) == null ? void 0 : X.ApplicationV2;
var Z, ee;
const L = (ee = (Z = foundry == null ? void 0 : foundry.applications) == null ? void 0 : Z.api) == null ? void 0 : ee.HandlebarsApplicationMixin;
class Re extends Application {
  constructor(t, a = {}) {
    super(a), this.callData = T(t);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-overlay",
      title: "CyberCall",
      template: te,
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
      return console.warn(`${c} | Template render failed, using inline fallback.`, a), $(me(this.callData));
    }
  }
  activateListeners(t) {
    super.activateListeners(t), ue(this, t);
  }
  async close(t) {
    return o === this && (o = null), G(), super.close(t);
  }
}
class Oe extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-composer",
      title: "CyberCall Composer",
      template: ae,
      classes: ["cybercall-composer-app"],
      popOut: !0,
      resizable: !0,
      width: 560,
      height: "auto"
    });
  }
  getData() {
    return {
      call: ie(),
      actors: ce()
    };
  }
  async _renderInner(t) {
    try {
      return await super._renderInner(t);
    } catch (a) {
      return console.warn(`${c} | Composer template render failed, using inline fallback.`, a), $(pe(t));
    }
  }
  activateListeners(t) {
    super.activateListeners(t), ge(this, t);
  }
  async close(t) {
    return p === this && (p = null), super.close(t);
  }
}
class Pe extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-contacts",
      title: "CyberCall Contacts",
      template: ne,
      classes: ["cybercall-contacts-app"],
      popOut: !0,
      resizable: !0,
      width: 500,
      height: "auto"
    });
  }
  getData() {
    const t = R(), a = D();
    return {
      contacts: t,
      groupContacts: a,
      hasContacts: t.length > 0,
      hasGroupContacts: a.length > 0,
      activeTab: b,
      isPersonalTab: b !== "group",
      isGroupTab: b === "group",
      ringtoneChoices: $e(),
      currentRingtone: I()
    };
  }
  async _renderInner(t) {
    try {
      return await super._renderInner(t);
    } catch (a) {
      return console.warn(`${c} | Contacts template render failed, using inline fallback.`, a), $(fe(t));
    }
  }
  activateListeners(t) {
    super.activateListeners(t), de(this, t);
  }
  async close(t) {
    return d === this && (d = null), super.close(t);
  }
}
function _e() {
  var e;
  return !M || !L ? null : (e = class extends L(M) {
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
      } catch (l) {
        console.warn(`${c} | Template render failed, using inline fallback.`, l);
        const i = document.createElement("template");
        return i.innerHTML = me(this.callData).trim(), i.content;
      }
    }
    _onRender(a, n) {
      var l;
      (l = super._onRender) == null || l.call(this, a, n), ue(this);
    }
    async close(a) {
      return o === this && (o = null), G(), super.close(a);
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
      template: te
    }
  }), e);
}
const Ie = _e() ?? Re;
function Ge() {
  var e;
  return !M || !L ? null : (e = class extends L(M) {
    async _prepareContext(a) {
      return {
        ...await super._prepareContext(a),
        call: ie(),
        actors: ce()
      };
    }
    async _renderHTML(a, n) {
      try {
        return await super._renderHTML(a, n);
      } catch (l) {
        console.warn(`${c} | Composer template render failed, using inline fallback.`, l);
        const i = document.createElement("template");
        return i.innerHTML = pe(a).trim(), i.content;
      }
    }
    _onRender(a, n) {
      var l;
      (l = super._onRender) == null || l.call(this, a, n), ge(this);
    }
    async close(a) {
      return p === this && (p = null), super.close(a);
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
      template: ae
    }
  }), e);
}
const xe = Ge() ?? Oe;
function Fe() {
  var e;
  return !M || !L ? null : (e = class extends L(M) {
    async _prepareContext(a) {
      const n = R(), l = D();
      return {
        ...await super._prepareContext(a),
        contacts: n,
        groupContacts: l,
        hasContacts: n.length > 0,
        hasGroupContacts: l.length > 0,
        activeTab: b,
        isPersonalTab: b !== "group",
        isGroupTab: b === "group",
        ringtoneChoices: $e(),
        currentRingtone: I()
      };
    }
    async _renderHTML(a, n) {
      try {
        return await super._renderHTML(a, n);
      } catch (l) {
        console.warn(`${c} | Contacts template render failed, using inline fallback.`, l);
        const i = document.createElement("template");
        return i.innerHTML = fe(a).trim(), i.content;
      }
    }
    _onRender(a, n) {
      var l;
      (l = super._onRender) == null || l.call(this, a, n), de(this);
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
      template: ne
    }
  }), e);
}
const Ue = Fe() ?? Pe;
async function w(e = {}) {
  var t, a;
  return q() ? (d && await d.close(), await V(), o = new Ie(e), await o.render(!0), we(o), Ye(o.callData), o) : ((a = (t = ui.notifications) == null ? void 0 : t.warn) == null || a.call(t, "You do not have permission to open CyberCall transmissions."), null);
}
async function V() {
  if (!o) return;
  const e = o;
  o = null, await e.close();
}
function qe(e) {
  var t;
  return !!((t = o == null ? void 0 : o.callData) != null && t.id) && o.callData.id === e;
}
async function Be() {
  o && (await o.render(!0), we(o));
}
async function he(e) {
  qe(e) && (o.callData.accepted = !0, o.callData.ringing = !1, G(), await Be());
}
function Ve(e) {
  e && (game.socket.emit(S, {
    action: "acceptCall",
    callId: e
  }), he(e));
}
async function be(e) {
  var t;
  e && ((t = o == null ? void 0 : o.callData) != null && t.id) && o.callData.id !== e || await V();
}
function Ce(e) {
  game.socket.emit(S, {
    action: "endCall",
    callId: e
  }), be(e);
}
async function je(e) {
  var r, s, g, f, h;
  if (game.user.isGM)
    return w({
      callerName: e.name,
      subtitle: `Comms ${e.number}`,
      image: e.image,
      message: `Opening channel ${e.number}...`,
      signal: game.settings.get(c, "defaultSignal"),
      variant: "standard",
      ringing: !1
    });
  if (!U())
    return (s = (r = ui.notifications) == null ? void 0 : r.warn) == null || s.call(r, "No GM is connected to receive the CyberCall."), null;
  const t = F(), a = String(((g = game.user) == null ? void 0 : g.avatar) ?? ((h = (f = game.user) == null ? void 0 : f.character) == null ? void 0 : h.img) ?? "").trim(), n = {
    id: t,
    signal: game.settings.get(c, "defaultSignal"),
    variant: "standard",
    fullscreen: !1,
    accepted: !1,
    allowBroadcast: !1,
    callerUserId: game.user.id,
    contactNumber: e.number
  }, l = T({
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
  }), w(l);
}
async function ye() {
  var e, t, a;
  return game.user.isGM ? p ? ((a = p.bringToFront) == null || a.call(p), p) : (p = new xe(), await p.render(!0), p) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function ve() {
  var e, t, a, n;
  return q() ? o ? ((a = o.bringToFront) == null || a.call(o), o) : d ? ((n = d.bringToFront) == null || n.call(d), d) : (d = new Ue(), await d.render(!0), d) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function k() {
  d && await d.render(!0);
}
async function j(e = {}) {
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
  }), w(t);
}
async function ze(e) {
  if (e) {
    if (e.action === "openCall") {
      if (!q()) return;
      w(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      w(e.callData);
      return;
    }
    if (e.action === "acceptCall") {
      he(e.callId);
      return;
    }
    if (e.action === "endCall") {
      be(e.callId);
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
function we(e) {
  var t, a;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((a = e.setPosition) == null || a.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function I() {
  return String(game.settings.get(c, "ringSound") ?? "").trim();
}
function $e() {
  const e = I();
  return Object.entries(oe).map(([t, a]) => ({
    value: t,
    label: a,
    selected: t === e
  }));
}
function G() {
  y && (y.pause(), y.currentTime = 0, y = null);
}
function Ye(e) {
  if (G(), !e.ringing) return;
  const t = I();
  t && (y = new Audio(t), y.loop = !0, y.volume = 0.65, y.play().catch((a) => {
    console.warn(`${c} | Unable to play ringing sound.`, a);
  }));
}
function Se() {
  const e = game.modules.get(c);
  e && (e.api = {
    openCall: w,
    closeCall: V,
    broadcastCall: j,
    openComposer: ye,
    openContacts: ve,
    get activeCall() {
      return o;
    },
    get activeComposer() {
      return p;
    },
    get activeContacts() {
      return d;
    }
  });
}
function We() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: c,
    title: "CyberCall",
    icon: "fa-solid fa-satellite-dish",
    premium: !1,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => {
      var a;
      return (a = game.user) != null && a.isGM ? ye() : ve();
    }
  }), !0) : !1;
}
function Ke() {
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
    default: m.signal,
    range: {
      min: 0,
      max: 100,
      step: 1
    }
  }), game.settings.register(c, "ringSound", {
    name: "Incoming Call Ringtone",
    hint: "Ringtone played locally while a CyberCall is ringing. This is a client setting, so each user can choose their own ringtone.",
    scope: "client",
    config: !1,
    type: String,
    default: "",
    choices: oe
  }), game.settings.register(c, "minimumRole", {
    name: "Minimum Player Role",
    hint: "Minimum role allowed to open CyberCall overlays and receive GM broadcasts.",
    scope: "world",
    config: !0,
    type: Number,
    default: e.PLAYER,
    choices: t
  }), game.settings.register(c, "contacts", {
    name: "CyberCall Contacts",
    hint: "Player contact directory stored locally for this client.",
    scope: "client",
    config: !1,
    type: Object,
    default: []
  }), game.settings.register(c, "groupContacts", {
    name: "CyberCall Group Contacts",
    hint: "Shared group contact directory for all players in this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: []
  });
}
Hooks.once("init", () => {
  Ke(), Se();
});
Hooks.once("ready", () => {
  Se(), We(), game.socket.on(S, ze), console.log(`${c} | Ready. Use game.modules.get("${c}").api.openCall({...})`);
});
