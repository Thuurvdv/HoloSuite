var Ee = Object.defineProperty;
var Ne = (e, t, a) => t in e ? Ee(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var D = (e, t, a) => Ne(e, typeof t != "symbol" ? t + "" : t, a);
function Re(e, t) {
  return e.image ? `<img src="${t(e.image)}" alt="${t(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${t(e.initials)}</div>`;
}
function le(e, t) {
  const a = `--cybercall-signal: ${e.signal}%;`, n = e.fullscreen ? "cybercall-broadcast" : "", l = e.ringing ? "cybercall-ringing-panel" : "", c = e.accepted ? "cybercall-connected-panel" : "", i = e.showBroadcast ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>' : "", o = e.accepted ? "" : `
      <header class="cybercall-header">
        <div>
          <div class="cybercall-kicker">${t(e.kicker)}</div>
          <h2>${t(e.callerName)}</h2>
          <p>${t(e.subtitle)}</p>
        </div>
        <div class="cybercall-signal">
          <span>${e.signal}%</span>
          <div class="cybercall-signal-bar" aria-hidden="true"><i></i></div>
        </div>
      </header>
    `, d = e.accepted ? "" : `<blockquote>${t(e.message)}</blockquote>`, p = e.accepted || e.outgoing ? '<button type="button" data-cybercall-action="end">End Call</button>' : `
        ${e.canAccept ? '<button type="button" data-cybercall-action="accept">Accept</button>' : ""}
        <button type="button" data-cybercall-action="decline">Decline</button>
        ${i}
      `;
  return `
    <div class="cybercall-panel cybercall-${e.variant} ${n} ${l} ${c}" style="${a}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${o}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${Re(e, t)}</div>
        ${d}
      </main>
      <footer class="cybercall-actions">
        ${p}
      </footer>
    </div>
  `;
}
function ie(e, t) {
  const a = e.call;
  return `
    <form class="cybercall-composer" data-cybercall-composer>
      <label>Actor Portrait
        <select name="actorId">
          <option value="">Manual / no actor</option>
          ${e.actors.map((l) => `<option value="${t(l.id)}">${t(l.name)}</option>`).join("")}
        </select>
      </label>
      <label>Caller Name <input type="text" name="callerName" value="${t(a.callerName)}"></label>
      <label>Subtitle / Faction <input type="text" name="subtitle" value="${t(a.subtitle)}"></label>
      <label>Portrait Image Path <span class="cybercall-composer-path-row"><input type="text" name="image" value="${t(a.image)}"><button type="button" data-cybercall-compose-action="browse-image">Browse</button></span></label>
      <label>Message <textarea name="message" rows="5">${t(a.message)}</textarea></label>
      <label>Signal <input type="range" name="signal" min="0" max="100" value="${a.signal}"></label>
      <label>Variant
        <select name="variant">
          <option value="standard" ${a.variant === "standard" ? "selected" : ""}>Standard Blue</option>
          <option value="emergency" ${a.variant === "emergency" ? "selected" : ""}>Emergency Red</option>
          <option value="corrupted" ${a.variant === "corrupted" ? "selected" : ""}>Corrupted Green</option>
        </select>
      </label>
      <label><input type="checkbox" name="fullscreen" ${a.fullscreen ? "checked" : ""}> Fullscreen Broadcast</label>
      <label><input type="checkbox" name="ringing" ${a.ringing ? "checked" : ""}> Ringing Animation / Sound</label>
      <div class="cybercall-composer-ringtone">
        <label class="cybercall-ringtone-select">
          <span>Ringtone</span>
          <select data-cybercall-ringtone>
            ${(e.ringtoneChoices ?? []).map(
    (l) => `<option value="${t(l.value)}" ${l.selected ? "selected" : ""}>${t(l.label)}</option>`
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
function oe(e, t) {
  const a = (c, i) => c.length ? c.map((o) => `
        <li>
          <div class="cybercall-contact-avatar">
            ${o.image ? `<img src="${t(o.image)}" alt="">` : `<span>${t(o.initials)}</span>`}
          </div>
          <div class="cybercall-contact-id">
            <strong>${t(o.name)}</strong>
            <span>${t(o.number)}</span>
          </div>
          <div class="cybercall-contact-actions">
            <button type="button" data-cybercall-contact-action="call" data-contact-scope="${i}" data-contact-id="${t(o.id)}">Call</button>
            <button type="button" data-cybercall-contact-action="remove" data-contact-scope="${i}" data-contact-id="${t(o.id)}">Remove</button>
          </div>
        </li>
      `).join("") : '<li class="cybercall-contacts-empty">No contacts stored.</li>', n = e.activeTab !== "group", l = e.activeTab === "group";
  return `
    <section class="cybercall-contacts">
      <header class="cybercall-contacts-header">
        <div>
          <div class="cybercall-contacts-kicker">Personal Comms Directory</div>
          <h2>CyberCall Contacts</h2>
        </div>
      </header>
      <nav class="cybercall-contact-tabs">
        <button type="button" class="${n ? "active" : ""}" data-cybercall-contact-tab="personal">Personal</button>
        <button type="button" class="${l ? "active" : ""}" data-cybercall-contact-tab="group">Group</button>
      </nav>
      <section data-cybercall-contact-panel="personal" ${n ? "" : "hidden"}>
        <ul class="cybercall-contacts-list">${a(e.contacts, "personal")}</ul>
      </section>
      <section data-cybercall-contact-panel="group" ${l ? "" : "hidden"}>
        <ul class="cybercall-contacts-list">${a(e.groupContacts, "group")}</ul>
      </section>
      <form class="cybercall-contacts-form" data-cybercall-contacts-form>
        <input type="hidden" name="scope" value="${t(e.activeTab)}">
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
    (c) => `<option value="${t(c.value)}" ${c.selected ? "selected" : ""}>${t(c.label)}</option>`
  ).join("")}
          </select>
        </label>
      </footer>
    </section>
  `;
}
const v = {
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
}, ke = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]);
function ue(e) {
  const t = Number(e);
  return Number.isNaN(t) ? v.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function ge(e) {
  return String(e).split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var a;
    return (a = t[0]) == null ? void 0 : a.toUpperCase();
  }).join("") || "?";
}
function Y() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function L(e = {}) {
  var a;
  const t = {
    ...v,
    ...e,
    id: String(e.id ?? Y()),
    callerName: String(e.callerName ?? v.callerName),
    subtitle: String(e.subtitle ?? v.subtitle),
    image: String(e.image ?? v.image),
    message: String(e.message ?? v.message),
    signal: ue(e.signal ?? v.signal),
    variant: ke.has(e.variant) ? e.variant : v.variant,
    fullscreen: !!(e.fullscreen ?? v.fullscreen),
    ringing: e.ringing !== !1 && e.accepted !== !0,
    accepted: e.accepted === !0,
    canAccept: e.canAccept !== !1,
    canDecline: e.canDecline !== !1,
    allowBroadcast: e.allowBroadcast !== !1,
    outgoing: e.outgoing === !0,
    callerUserId: String(e.callerUserId ?? ""),
    contactNumber: String(e.contactNumber ?? "")
  };
  return t.initials = ge(t.callerName), t.showBroadcast = !!((a = game == null ? void 0 : game.user) != null && a.isGM && t.allowBroadcast), t.isStandard = t.variant === "standard", t.isEmergency = t.variant === "emergency", t.isCorrupted = t.variant === "corrupted", t.isIncoming = !t.accepted, t.kicker = t.outgoing ? "Outgoing CyberCall" : t.fullscreen ? "System-wide Broadcast" : "Incoming CyberCall", t;
}
function R(e = {}) {
  return {
    id: String(e.id ?? Y()),
    name: String(e.name ?? "").trim(),
    number: String(e.number ?? "").trim(),
    image: String(e.image ?? e.img ?? "").trim(),
    initials: ge(e.name)
  };
}
function Pe(e) {
  var te, ae, ne, re;
  const {
    moduleId: t,
    templatePath: a,
    composerTemplatePath: n,
    contactsTemplatePath: l,
    escapeHTML: c,
    getDefaultComposerData: i,
    getActorChoices: o,
    getContacts: d,
    getGroupContacts: p,
    getRingtoneChoices: y,
    getSoundPath: A,
    getActiveContactsTab: T,
    bindCallControls: x,
    bindComposerControls: F,
    bindContactsControls: O,
    stopRinging: U,
    clearActiveCall: q,
    clearActiveComposer: I,
    clearActiveContacts: B
  } = e, w = (ae = (te = foundry == null ? void 0 : foundry.applications) == null ? void 0 : te.api) == null ? void 0 : ae.ApplicationV2, E = (re = (ne = foundry == null ? void 0 : foundry.applications) == null ? void 0 : ne.api) == null ? void 0 : re.HandlebarsApplicationMixin;
  class we extends Application {
    constructor(s, g = {}) {
      super(g);
      D(this, "callData");
      this.callData = L(s);
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-overlay",
        title: "CyberCall",
        template: a,
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
    async _renderInner(s) {
      try {
        return await super._renderInner(s);
      } catch (g) {
        return console.warn(`${t} | Template render failed, using inline fallback.`, g), $(le(this.callData, c));
      }
    }
    activateListeners(s) {
      super.activateListeners(s), x(this, s);
    }
    async close(s) {
      return q(this), U(), super.close(s);
    }
  }
  class Ae extends Application {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-composer",
        title: "CyberCall Composer",
        template: n,
        classes: ["cybercall-composer-app"],
        popOut: !0,
        resizable: !0,
        width: 560,
        height: "auto"
      });
    }
    getData() {
      return {
        call: i(),
        actors: o(),
        ringtoneChoices: y()
      };
    }
    async _renderInner(m) {
      try {
        return await super._renderInner(m);
      } catch (s) {
        return console.warn(`${t} | Composer template render failed, using inline fallback.`, s), $(ie(m, c));
      }
    }
    activateListeners(m) {
      super.activateListeners(m), F(this, m);
    }
    async close(m) {
      return I(this), super.close(m);
    }
  }
  class $e extends Application {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-contacts",
        title: "CyberCall Contacts",
        template: l,
        classes: ["cybercall-contacts-app"],
        popOut: !0,
        resizable: !0,
        width: 500,
        height: "auto"
      });
    }
    getData() {
      const m = d(), s = p(), g = T();
      return {
        contacts: m,
        groupContacts: s,
        hasContacts: m.length > 0,
        hasGroupContacts: s.length > 0,
        activeTab: g,
        isPersonalTab: g !== "group",
        isGroupTab: g === "group",
        ringtoneChoices: y(),
        currentRingtone: A()
      };
    }
    async _renderInner(m) {
      try {
        return await super._renderInner(m);
      } catch (s) {
        return console.warn(`${t} | Contacts template render failed, using inline fallback.`, s), $(oe(m, c));
      }
    }
    activateListeners(m) {
      super.activateListeners(m), O(this, m);
    }
    async close(m) {
      return B(this), super.close(m);
    }
  }
  function Se() {
    var f;
    return !w || !E ? null : (f = class extends E(w) {
      constructor(g, b = {}) {
        super(b);
        D(this, "callData");
        this.callData = L(g);
      }
      async _prepareContext(g) {
        return {
          ...await super._prepareContext(g),
          call: this.callData
        };
      }
      async _renderHTML(g, b) {
        try {
          return await super._renderHTML(g, b);
        } catch (h) {
          console.warn(`${t} | Template render failed, using inline fallback.`, h);
          const ce = document.createElement("template");
          return ce.innerHTML = le(this.callData, c).trim(), ce.content;
        }
      }
      _onRender(g, b) {
        var h;
        (h = super._onRender) == null || h.call(this, g, b), x(this);
      }
      async close(g) {
        return q(this), U(), super.close(g);
      }
    }, D(f, "DEFAULT_OPTIONS", {
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
    }), D(f, "PARTS", {
      main: {
        template: a
      }
    }), f);
  }
  function De() {
    var f;
    return !w || !E ? null : (f = class extends E(w) {
      async _prepareContext(s) {
        return {
          ...await super._prepareContext(s),
          call: i(),
          actors: o(),
          ringtoneChoices: y()
        };
      }
      async _renderHTML(s, g) {
        try {
          return await super._renderHTML(s, g);
        } catch (b) {
          console.warn(`${t} | Composer template render failed, using inline fallback.`, b);
          const h = document.createElement("template");
          return h.innerHTML = ie(s, c).trim(), h.content;
        }
      }
      _onRender(s, g) {
        var b;
        (b = super._onRender) == null || b.call(this, s, g), F(this);
      }
      async close(s) {
        return I(this), super.close(s);
      }
    }, D(f, "DEFAULT_OPTIONS", {
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
    }), D(f, "PARTS", {
      main: {
        template: n
      }
    }), f);
  }
  function Te() {
    var f;
    return !w || !E ? null : (f = class extends E(w) {
      async _prepareContext(s) {
        const g = d(), b = p(), h = T();
        return {
          ...await super._prepareContext(s),
          contacts: g,
          groupContacts: b,
          hasContacts: g.length > 0,
          hasGroupContacts: b.length > 0,
          activeTab: h,
          isPersonalTab: h !== "group",
          isGroupTab: h === "group",
          ringtoneChoices: y(),
          currentRingtone: A()
        };
      }
      async _renderHTML(s, g) {
        try {
          return await super._renderHTML(s, g);
        } catch (b) {
          console.warn(`${t} | Contacts template render failed, using inline fallback.`, b);
          const h = document.createElement("template");
          return h.innerHTML = oe(s, c).trim(), h.content;
        }
      }
      _onRender(s, g) {
        var b;
        (b = super._onRender) == null || b.call(this, s, g), O(this);
      }
      async close(s) {
        return B(this), super.close(s);
      }
    }, D(f, "DEFAULT_OPTIONS", {
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
    }), D(f, "PARTS", {
      main: {
        template: l
      }
    }), f);
  }
  return {
    CyberCallApplication: Se() ?? we,
    CyberCallComposer: De() ?? Ae,
    CyberCallContacts: Te() ?? $e
  };
}
const u = "cybercall", P = `module.${u}`, Oe = `modules/${u}/templates/cybercall.hbs`, Ie = `modules/${u}/templates/cybercall-composer.hbs`, Le = `modules/${u}/templates/cybercall-contacts.hbs`;
let r = null, S = null, C = null, M = "personal", N = null, _ = null;
const de = {
  "": "Silent",
  [`modules/${u}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${u}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${u}/audio/Ringtone3.ogg`]: "Ringtone 3"
};
function Me(e) {
  var a;
  if ((a = foundry == null ? void 0 : foundry.utils) != null && a.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
function _e() {
  var e, t, a, n, l, c, i, o;
  return L({
    callerName: ((e = r == null ? void 0 : r.callData) == null ? void 0 : e.callerName) ?? v.callerName,
    subtitle: ((t = r == null ? void 0 : r.callData) == null ? void 0 : t.subtitle) ?? v.subtitle,
    image: ((a = r == null ? void 0 : r.callData) == null ? void 0 : a.image) ?? "",
    message: ((n = r == null ? void 0 : r.callData) == null ? void 0 : n.message) ?? v.message,
    signal: ((l = r == null ? void 0 : r.callData) == null ? void 0 : l.signal) ?? game.settings.get(u, "defaultSignal"),
    variant: ((c = r == null ? void 0 : r.callData) == null ? void 0 : c.variant) ?? "standard",
    fullscreen: ((i = r == null ? void 0 : r.callData) == null ? void 0 : i.fullscreen) ?? !1,
    ringing: ((o = r == null ? void 0 : r.callData) == null ? void 0 : o.ringing) ?? !0
  });
}
function Ge() {
  var e;
  return (((e = game.actors) == null ? void 0 : e.contents) ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    img: t.img ?? ""
  })).sort((t, a) => t.name.localeCompare(a.name));
}
function z() {
  const e = game.settings.get(u, "contacts");
  return Array.isArray(e) ? e.map(R).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name)) : [];
}
function G() {
  if (Array.isArray(_))
    return _.map(R).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name));
  const e = game.settings.get(u, "groupContacts");
  return Array.isArray(e) ? e.map(R).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name)) : [];
}
async function me(e) {
  await game.settings.set(u, "contacts", e.map(R));
}
async function j(e) {
  _ = e.map(R), await game.settings.set(u, "groupContacts", _), game.socket.emit(P, {
    action: "groupContactsChanged",
    contacts: _
  });
}
async function xe(e, t, a = "personal", n = "") {
  var i, o, d, p, y, A;
  const l = R({ name: e, number: t, image: n });
  if (!l.name || !l.number) {
    (o = (i = ui.notifications) == null ? void 0 : i.warn) == null || o.call(i, "Contact name and number are required.");
    return;
  }
  if (a === "group" && !game.user.isGM) {
    if (!W()) {
      (p = (d = ui.notifications) == null ? void 0 : d.warn) == null || p.call(d, "A GM must be connected to update group contacts.");
      return;
    }
    game.socket.emit(P, {
      action: "groupContactAdd",
      contact: l
    }), (A = (y = ui.notifications) == null ? void 0 : y.info) == null || A.call(y, "Group contact update sent to the GM.");
    return;
  }
  const c = a === "group" ? G() : z();
  c.push(l), a === "group" ? await j(c) : await me(c), await V();
}
async function Fe(e, t = "personal") {
  var a, n, l, c;
  if (t === "group") {
    if (!game.user.isGM) {
      if (!W()) {
        (n = (a = ui.notifications) == null ? void 0 : a.warn) == null || n.call(a, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(P, {
        action: "groupContactRemove",
        contactId: e
      }), (c = (l = ui.notifications) == null ? void 0 : l.info) == null || c.call(l, "Group contact removal sent to the GM.");
      return;
    }
    await j(G().filter((i) => i.id !== e));
  } else
    await me(z().filter((i) => i.id !== e));
  await V();
}
function W() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function K(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(u, "minimumRole");
  } catch (a) {
    console.warn(`${u} | Permission setting unavailable, using Player role fallback.`, a);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function J(e, t = null) {
  var a;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (a = e.element) != null && a[0] ? e.element[0] : e.element ?? null;
}
function Ue(e, t = null) {
  const a = J(e, t);
  a && (a.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), a.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), a.classList.toggle("cybercall-connected", e.callData.accepted), a.querySelectorAll("[data-cybercall-action]").forEach((n) => {
    n.addEventListener("click", (l) => {
      const c = l.currentTarget.dataset.cybercallAction;
      if (c === "accept") {
        Je(e.callData.id);
        return;
      }
      if (c === "broadcast") {
        X({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (c === "decline" || c === "end") && fe(e.callData.id);
    });
  }));
}
function qe(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-composer]");
}
function se(e) {
  var c;
  const t = new FormData(e), a = (c = game.actors) == null ? void 0 : c.get(t.get("actorId")), n = String(t.get("image") ?? "").trim() || (a == null ? void 0 : a.img) || "", l = String(t.get("callerName") ?? "").trim() || (a == null ? void 0 : a.name) || "UNKNOWN CALLER";
  return L({
    callerName: l,
    subtitle: String(t.get("subtitle") ?? "").trim(),
    image: n,
    message: String(t.get("message") ?? "").trim(),
    signal: t.get("signal"),
    variant: String(t.get("variant") ?? v.variant),
    fullscreen: t.get("fullscreen") === "on",
    ringing: t.get("ringing") === "on"
  });
}
function H(e) {
  var n, l;
  const t = (n = e == null ? void 0 : e.elements) == null ? void 0 : n.signal, a = (l = e == null ? void 0 : e.querySelector) == null ? void 0 : l.call(e, "[data-cybercall-signal-output]");
  !t || !a || (a.textContent = `${ue(t.value)}%`);
}
function Be(e, t = null) {
  var c, i;
  const a = J(e, t), n = qe(a);
  if (!a || !n) return;
  H(n);
  const l = a.querySelector("[data-cybercall-ringtone]");
  l && l.addEventListener("change", async (o) => {
    await game.settings.set(u, "ringSound", o.currentTarget.value);
  }), (c = n.elements.signal) == null || c.addEventListener("input", () => H(n)), (i = n.elements.actorId) == null || i.addEventListener("change", () => {
    var d;
    const o = (d = game.actors) == null ? void 0 : d.get(n.elements.actorId.value);
    o && (n.elements.callerName.value = o.name, n.elements.image.value = o.img ?? "");
  }), n.addEventListener("submit", (o) => {
    o.preventDefault(), k(se(n));
  }), a.querySelectorAll("[data-cybercall-compose-action]").forEach((o) => {
    o.addEventListener("click", async (d) => {
      var A, T, x, F, O, U, q;
      const p = d.currentTarget.dataset.cybercallComposeAction, y = se(n);
      if (p === "preview") {
        await k(y);
        return;
      }
      if (p === "broadcast") {
        await X(y);
        return;
      }
      if (p === "close-active") {
        fe((A = r == null ? void 0 : r.callData) == null ? void 0 : A.id);
        return;
      }
      if (p === "browse-image") {
        const I = n.elements.image, B = globalThis.FilePicker ?? ((F = (x = (T = globalThis.foundry) == null ? void 0 : T.applications) == null ? void 0 : x.apps) == null ? void 0 : F.FilePicker);
        if (!I || !B) {
          (U = (O = ui.notifications) == null ? void 0 : O.warn) == null || U.call(O, "Foundry FilePicker is unavailable.");
          return;
        }
        const w = new B({
          type: "image",
          current: I.value,
          callback: (E) => {
            I.value = E, I.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof w.browse == "function" ? w.browse() : (q = w.render) == null || q.call(w, !0);
        return;
      }
      p === "reset" && (n.reset(), H(n));
    });
  });
}
function Ve(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function je(e, t = null) {
  const a = J(e, t), n = Ve(a);
  if (!a || !n) return;
  n.addEventListener("submit", async (c) => {
    var d;
    c.preventDefault();
    const i = new FormData(n), o = String(i.get("scope") ?? M);
    await xe(i.get("name"), i.get("number"), o, i.get("image")), n.reset(), n.elements.scope.value = o, (d = n.elements.name) == null || d.focus();
  }), a.querySelectorAll("[data-cybercall-contact-tab]").forEach((c) => {
    c.addEventListener("click", (i) => {
      M = i.currentTarget.dataset.cybercallContactTab, a.querySelectorAll("[data-cybercall-contact-tab]").forEach((o) => {
        o.classList.toggle("active", o.dataset.cybercallContactTab === M);
      }), a.querySelectorAll("[data-cybercall-contact-panel]").forEach((o) => {
        o.hidden = o.dataset.cybercallContactPanel !== M;
      }), n.elements.scope && (n.elements.scope.value = M);
    });
  });
  const l = a.querySelector("[data-cybercall-ringtone]");
  l && l.addEventListener("change", async (c) => {
    await game.settings.set(u, "ringSound", c.currentTarget.value);
  }), a.querySelectorAll("[data-cybercall-contact-action]").forEach((c) => {
    c.addEventListener("click", async (i) => {
      const o = i.currentTarget.dataset.cybercallContactAction, d = i.currentTarget.dataset.contactId, p = i.currentTarget.dataset.contactScope ?? "personal", A = (p === "group" ? G() : z()).find((T) => T.id === d);
      if (o === "remove") {
        await Fe(d, p);
        return;
      }
      o === "call" && A && await Qe(A) && C === e && await e.close();
    });
  });
}
const { CyberCallApplication: ze, CyberCallComposer: He, CyberCallContacts: Ye } = Pe({
  moduleId: u,
  templatePath: Oe,
  composerTemplatePath: Ie,
  contactsTemplatePath: Le,
  escapeHTML: Me,
  getDefaultComposerData: _e,
  getActorChoices: Ge,
  getContacts: z,
  getGroupContacts: G,
  getRingtoneChoices: Ze,
  getSoundPath: Z,
  getActiveContactsTab: () => M,
  bindCallControls: Ue,
  bindComposerControls: Be,
  bindContactsControls: je,
  stopRinging: ee,
  clearActiveCall: (e) => {
    r === e && (r = null);
  },
  clearActiveComposer: (e) => {
    S === e && (S = null);
  },
  clearActiveContacts: (e) => {
    C === e && (C = null);
  }
});
async function k(e = {}) {
  var t, a;
  return K() ? (C && await C.close(), await Q(), r = new ze(e), await r.render(!0), he(r), et(r.callData), r) : ((a = (t = ui.notifications) == null ? void 0 : t.warn) == null || a.call(t, "You do not have permission to open CyberCall transmissions."), null);
}
async function Q() {
  if (!r) return;
  const e = r;
  r = null, await e.close();
}
function We(e) {
  var t;
  return !!((t = r == null ? void 0 : r.callData) != null && t.id) && r.callData.id === e;
}
async function Ke() {
  r && (await r.render(!0), he(r));
}
async function pe(e) {
  We(e) && (r.callData.accepted = !0, r.callData.ringing = !1, ee(), await Ke());
}
function Je(e) {
  e && (game.socket.emit(P, {
    action: "acceptCall",
    callId: e
  }), pe(e));
}
async function be(e) {
  var t;
  e && ((t = r == null ? void 0 : r.callData) != null && t.id) && r.callData.id !== e || await Q();
}
function fe(e) {
  game.socket.emit(P, {
    action: "endCall",
    callId: e
  }), be(e);
}
async function Qe(e) {
  var i, o, d, p, y;
  if (game.user.isGM)
    return k({
      callerName: e.name,
      subtitle: `Comms ${e.number}`,
      image: e.image,
      message: `Opening channel ${e.number}...`,
      signal: game.settings.get(u, "defaultSignal"),
      variant: "standard",
      ringing: !1
    });
  if (!W())
    return (o = (i = ui.notifications) == null ? void 0 : i.warn) == null || o.call(i, "No GM is connected to receive the CyberCall."), null;
  const t = Y(), a = String(((d = game.user) == null ? void 0 : d.avatar) ?? ((y = (p = game.user) == null ? void 0 : p.character) == null ? void 0 : y.img) ?? "").trim(), n = {
    id: t,
    signal: game.settings.get(u, "defaultSignal"),
    variant: "standard",
    fullscreen: !1,
    accepted: !1,
    allowBroadcast: !1,
    callerUserId: game.user.id,
    contactNumber: e.number
  }, l = L({
    ...n,
    callerName: e.name,
    subtitle: `Comms ${e.number}`,
    image: e.image,
    message: `Awaiting connection to ${e.name} on ${e.number}...`,
    canAccept: !1,
    canDecline: !1,
    outgoing: !0,
    ringing: !0
  }), c = L({
    ...n,
    callerName: game.user.name,
    subtitle: `Call request from ${game.user.name}`,
    image: a,
    message: `${game.user.name} is calling ${e.name} on ${e.number}.`,
    canAccept: !0,
    ringing: !0
  });
  return game.socket.emit(P, {
    action: "playerCallRequest",
    callData: c
  }), k(l);
}
async function ye() {
  var e, t, a;
  return game.user.isGM ? S ? ((a = S.bringToFront) == null || a.call(S), S) : (S = new He(), await S.render(!0), S) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function Ce() {
  var e, t, a, n;
  return K() ? r ? ((a = r.bringToFront) == null || a.call(r), r) : C ? ((n = C.bringToFront) == null || n.call(C), C) : (C = new Ye(), await C.render(!0), C) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function V() {
  C && await C.render(!0);
}
async function X(e = {}) {
  var a, n;
  if (!game.user.isGM)
    return (n = (a = ui.notifications) == null ? void 0 : a.warn) == null || n.call(a, "Only the GM can broadcast CyberCalls to all players."), null;
  const t = L({
    ...e,
    fullscreen: e.fullscreen ?? !0,
    ringing: !0
  });
  return game.socket.emit(P, {
    action: "openCall",
    callData: t
  }), k({ ...t, outgoing: !0 });
}
async function Xe(e) {
  if (e) {
    if (e.action === "openCall") {
      if (!K()) return;
      k(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      k(e.callData);
      return;
    }
    if (e.action === "acceptCall") {
      pe(e.callId);
      return;
    }
    if (e.action === "endCall") {
      be(e.callId);
      return;
    }
    if (e.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const t = R(e.contact);
      if (!t.name || !t.number) return;
      const a = G();
      a.push(t), await j(a), await V();
      return;
    }
    if (e.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await j(G().filter((t) => t.id !== e.contactId)), await V();
      return;
    }
    e.action === "groupContactsChanged" && (_ = Array.isArray(e.contacts) ? e.contacts.map(R) : null, await V());
  }
}
function he(e) {
  var t, a;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((a = e.setPosition) == null || a.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function Z() {
  return String(game.settings.get(u, "ringSound") ?? "").trim();
}
function Ze() {
  const e = Z();
  return Object.entries(de).map(([t, a]) => ({
    value: t,
    label: a,
    selected: t === e
  }));
}
function ee() {
  if (!N) return;
  const e = N;
  N = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function et(e) {
  var c;
  if (ee(), !e.ringing) return;
  const t = Z();
  if (!t) return;
  const n = 0.65 * Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), l = ((c = foundry == null ? void 0 : foundry.audio) == null ? void 0 : c.AudioHelper) ?? globalThis.AudioHelper;
  l != null && l.play ? l.play({ src: t, volume: n, autoplay: !0, loop: !0 }, !1).then((i) => {
    N = i;
  }).catch((i) => {
    console.warn(`${u} | Unable to play ringing sound.`, i);
  }) : (N = new Audio(t), N.loop = !0, N.volume = n, N.play().catch((i) => {
    console.warn(`${u} | Unable to play ringing sound.`, i);
  }));
}
function ve() {
  const e = game.modules.get(u);
  e && (e.api = {
    openCall: k,
    closeCall: Q,
    broadcastCall: X,
    openComposer: ye,
    openContacts: Ce,
    get activeCall() {
      return r;
    },
    get activeComposer() {
      return S;
    },
    get activeContacts() {
      return C;
    }
  });
}
function tt() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: u,
    title: "CyberCall",
    icon: "fa-solid fa-satellite-dish",
    premium: !1,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => {
      var a;
      return (a = game.user) != null && a.isGM ? ye() : Ce();
    }
  }), !0) : !1;
}
function at() {
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
  game.settings.register(u, "defaultSignal", {
    name: "Default Signal Strength",
    hint: "Signal percentage used when a call does not provide one.",
    scope: "client",
    config: !0,
    type: Number,
    default: v.signal,
    range: {
      min: 0,
      max: 100,
      step: 1
    }
  }), game.settings.register(u, "ringSound", {
    name: "Incoming Call Ringtone",
    hint: "Ringtone played locally while a CyberCall is ringing. This is a client setting, so each user can choose their own ringtone.",
    scope: "client",
    config: !1,
    type: String,
    default: "",
    choices: de
  }), game.settings.register(u, "minimumRole", {
    name: "Minimum Player Role",
    hint: "Minimum role allowed to open CyberCall overlays and receive GM broadcasts.",
    scope: "world",
    config: !0,
    type: Number,
    default: e.PLAYER,
    choices: t
  }), game.settings.register(u, "contacts", {
    name: "CyberCall Contacts",
    hint: "Player contact directory stored locally for this client.",
    scope: "client",
    config: !1,
    type: Object,
    default: []
  }), game.settings.register(u, "groupContacts", {
    name: "CyberCall Group Contacts",
    hint: "Shared group contact directory for all players in this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: []
  });
}
Hooks.once("init", () => {
  at(), ve();
});
Hooks.once("ready", () => {
  ve(), tt(), game.socket.on(P, Xe), console.log(`${u} | Ready. Use game.modules.get("${u}").api.openCall({...})`);
});
