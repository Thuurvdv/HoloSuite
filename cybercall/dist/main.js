var Pe = Object.defineProperty;
var Ie = (e, t, a) => t in e ? Pe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var S = (e, t, a) => Ie(e, typeof t != "symbol" ? t + "" : t, a);
function Oe(e, t) {
  return e.image ? `<img src="${t(e.image)}" alt="${t(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${t(e.initials)}</div>`;
}
function oe(e, t) {
  const a = `--cybercall-signal: ${e.signal}%;`, n = e.fullscreen ? "cybercall-broadcast" : "", i = e.ringing ? "cybercall-ringing-panel" : "", l = e.accepted ? "cybercall-connected-panel" : "", c = e.showBroadcast ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>' : "", o = e.accepted ? "" : `
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
    `, g = e.accepted ? "" : `<blockquote>${t(e.message)}</blockquote>`, p = e.accepted || e.outgoing ? '<button type="button" data-cybercall-action="end">End Call</button>' : `
        ${e.canAccept ? '<button type="button" data-cybercall-action="accept">Accept</button>' : ""}
        <button type="button" data-cybercall-action="decline">Decline</button>
        ${c}
      `;
  return `
    <div class="cybercall-panel cybercall-${e.variant} ${n} ${i} ${l}" style="${a}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${o}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${Oe(e, t)}</div>
        ${g}
      </main>
      <footer class="cybercall-actions">
        ${p}
      </footer>
    </div>
  `;
}
function se(e, t) {
  const a = e.call;
  return `
    <form class="cybercall-composer" data-cybercall-composer>
      <label>Actor Portrait
        <select name="actorId">
          <option value="">Manual / no actor</option>
          ${e.actors.map((i) => `<option value="${t(i.id)}">${t(i.name)}</option>`).join("")}
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
    (i) => `<option value="${t(i.value)}" ${i.selected ? "selected" : ""}>${t(i.label)}</option>`
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
function ue(e, t) {
  const a = (c, o) => c.length ? c.map((g) => `
        <li>
          <div class="cybercall-contact-avatar">
            ${g.image ? `<img src="${t(g.image)}" alt="">` : `<span>${t(g.initials)}</span>`}
          </div>
          <div class="cybercall-contact-id">
            <strong>${t(g.name)}</strong>
            <span>${t(g.number)}</span>
          </div>
          <div class="cybercall-contact-actions">
            <button type="button" data-cybercall-contact-action="call" data-contact-scope="${o}" data-contact-id="${t(g.id)}">Call</button>
            <button type="button" data-cybercall-contact-action="remove" data-contact-scope="${o}" data-contact-id="${t(g.id)}">Remove</button>
          </div>
        </li>
      `).join("") : '<li class="cybercall-contacts-empty">No contacts stored.</li>', n = e.activeTab !== "group", i = e.activeTab === "group", l = e.canEditContactImages ? '<label>Picture <input type="text" name="image" placeholder="icons/..."></label>' : "";
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
        <button type="button" class="${i ? "active" : ""}" data-cybercall-contact-tab="group">Group</button>
      </nav>
      <section data-cybercall-contact-panel="personal" ${n ? "" : "hidden"}>
        <ul class="cybercall-contacts-list">${a(e.contacts, "personal")}</ul>
      </section>
      <section data-cybercall-contact-panel="group" ${i ? "" : "hidden"}>
        <ul class="cybercall-contacts-list">${a(e.groupContacts, "group")}</ul>
      </section>
      <form class="cybercall-contacts-form" data-cybercall-contacts-form>
        <input type="hidden" name="scope" value="${t(e.activeTab)}">
        <label>Name <input type="text" name="name" required></label>
        <label>Number <input type="text" name="number" required></label>
        ${l}
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
}, Le = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]);
function de(e) {
  const t = Number(e);
  return Number.isNaN(t) ? v.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function me(e) {
  return String(e).split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var a;
    return (a = t[0]) == null ? void 0 : a.toUpperCase();
  }).join("") || "?";
}
function K() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function L(e = {}) {
  var a;
  const t = {
    ...v,
    ...e,
    id: String(e.id ?? K()),
    callerName: String(e.callerName ?? v.callerName),
    subtitle: String(e.subtitle ?? v.subtitle),
    image: String(e.image ?? v.image),
    message: String(e.message ?? v.message),
    signal: de(e.signal ?? v.signal),
    variant: Le.has(e.variant) ? e.variant : v.variant,
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
  return t.initials = me(t.callerName), t.showBroadcast = !!((a = game == null ? void 0 : game.user) != null && a.isGM && t.allowBroadcast), t.isStandard = t.variant === "standard", t.isEmergency = t.variant === "emergency", t.isCorrupted = t.variant === "corrupted", t.isIncoming = !t.accepted, t.kicker = t.outgoing ? "Outgoing CyberCall" : t.fullscreen ? "System-wide Broadcast" : "Incoming CyberCall", t;
}
function D(e = {}) {
  return {
    id: String(e.id ?? K()),
    name: String(e.name ?? "").trim(),
    number: String(e.number ?? "").trim(),
    image: String(e.image ?? e.img ?? "").trim(),
    initials: me(e.name)
  };
}
function Me(e) {
  var ne, re, ce, ie;
  const {
    moduleId: t,
    templatePath: a,
    composerTemplatePath: n,
    contactsTemplatePath: i,
    escapeHTML: l,
    getDefaultComposerData: c,
    getActorChoices: o,
    getContacts: g,
    getGroupContacts: p,
    getRingtoneChoices: y,
    getSoundPath: w,
    getActiveContactsTab: T,
    canEditContactImages: F,
    bindCallControls: U,
    bindComposerControls: I,
    bindContactsControls: q,
    stopRinging: B,
    clearActiveCall: O,
    clearActiveComposer: V,
    clearActiveContacts: E
  } = e, N = (re = (ne = foundry == null ? void 0 : foundry.applications) == null ? void 0 : ne.api) == null ? void 0 : re.ApplicationV2, M = (ie = (ce = foundry == null ? void 0 : foundry.applications) == null ? void 0 : ce.api) == null ? void 0 : ie.HandlebarsApplicationMixin;
  class De extends Application {
    constructor(s, d = {}) {
      super(d);
      S(this, "callData");
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
      } catch (d) {
        return console.warn(`${t} | Template render failed, using inline fallback.`, d), $(oe(this.callData, l));
      }
    }
    activateListeners(s) {
      super.activateListeners(s), U(this, s);
    }
    async close(s) {
      return O(this), B(), super.close(s);
    }
  }
  class Te extends Application {
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
        call: c(),
        actors: o(),
        ringtoneChoices: y()
      };
    }
    async _renderInner(m) {
      try {
        return await super._renderInner(m);
      } catch (s) {
        return console.warn(`${t} | Composer template render failed, using inline fallback.`, s), $(se(m, l));
      }
    }
    activateListeners(m) {
      super.activateListeners(m), I(this, m);
    }
    async close(m) {
      return V(this), super.close(m);
    }
  }
  class Ee extends Application {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-contacts",
        title: "CyberCall Contacts",
        template: i,
        classes: ["cybercall-contacts-app"],
        popOut: !0,
        resizable: !0,
        width: 500,
        height: "auto"
      });
    }
    getData() {
      const m = g(), s = p(), d = T();
      return {
        contacts: m,
        groupContacts: s,
        hasContacts: m.length > 0,
        hasGroupContacts: s.length > 0,
        activeTab: d,
        isPersonalTab: d !== "group",
        isGroupTab: d === "group",
        canEditContactImages: F(),
        ringtoneChoices: y(),
        currentRingtone: w()
      };
    }
    async _renderInner(m) {
      try {
        return await super._renderInner(m);
      } catch (s) {
        return console.warn(`${t} | Contacts template render failed, using inline fallback.`, s), $(ue(m, l));
      }
    }
    activateListeners(m) {
      super.activateListeners(m), q(this, m);
    }
    async close(m) {
      return E(this), super.close(m);
    }
  }
  function Ne() {
    var f;
    return !N || !M ? null : (f = class extends M(N) {
      constructor(d, b = {}) {
        super(b);
        S(this, "callData");
        this.callData = L(d);
      }
      async _prepareContext(d) {
        return {
          ...await super._prepareContext(d),
          call: this.callData
        };
      }
      async _renderHTML(d, b) {
        try {
          return await super._renderHTML(d, b);
        } catch (h) {
          console.warn(`${t} | Template render failed, using inline fallback.`, h);
          const le = document.createElement("template");
          return le.innerHTML = oe(this.callData, l).trim(), le.content;
        }
      }
      _onRender(d, b) {
        var h;
        (h = super._onRender) == null || h.call(this, d, b), U(this);
      }
      async close(d) {
        return O(this), B(), super.close(d);
      }
    }, S(f, "DEFAULT_OPTIONS", {
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
    }), S(f, "PARTS", {
      main: {
        template: a
      }
    }), f);
  }
  function Re() {
    var f;
    return !N || !M ? null : (f = class extends M(N) {
      async _prepareContext(s) {
        return {
          ...await super._prepareContext(s),
          call: c(),
          actors: o(),
          ringtoneChoices: y()
        };
      }
      async _renderHTML(s, d) {
        try {
          return await super._renderHTML(s, d);
        } catch (b) {
          console.warn(`${t} | Composer template render failed, using inline fallback.`, b);
          const h = document.createElement("template");
          return h.innerHTML = se(s, l).trim(), h.content;
        }
      }
      _onRender(s, d) {
        var b;
        (b = super._onRender) == null || b.call(this, s, d), I(this);
      }
      async close(s) {
        return V(this), super.close(s);
      }
    }, S(f, "DEFAULT_OPTIONS", {
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
    }), S(f, "PARTS", {
      main: {
        template: n
      }
    }), f);
  }
  function ke() {
    var f;
    return !N || !M ? null : (f = class extends M(N) {
      async _prepareContext(s) {
        const d = g(), b = p(), h = T();
        return {
          ...await super._prepareContext(s),
          contacts: d,
          groupContacts: b,
          hasContacts: d.length > 0,
          hasGroupContacts: b.length > 0,
          activeTab: h,
          isPersonalTab: h !== "group",
          isGroupTab: h === "group",
          canEditContactImages: F(),
          ringtoneChoices: y(),
          currentRingtone: w()
        };
      }
      async _renderHTML(s, d) {
        try {
          return await super._renderHTML(s, d);
        } catch (b) {
          console.warn(`${t} | Contacts template render failed, using inline fallback.`, b);
          const h = document.createElement("template");
          return h.innerHTML = ue(s, l).trim(), h.content;
        }
      }
      _onRender(s, d) {
        var b;
        (b = super._onRender) == null || b.call(this, s, d), q(this);
      }
      async close(s) {
        return E(this), super.close(s);
      }
    }, S(f, "DEFAULT_OPTIONS", {
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
    }), S(f, "PARTS", {
      main: {
        template: i
      }
    }), f);
  }
  return {
    CyberCallApplication: Ne() ?? De,
    CyberCallComposer: Re() ?? Te,
    CyberCallContacts: ke() ?? Ee
  };
}
const u = "cybercall", P = `module.${u}`, _e = `modules/${u}/templates/cybercall.hbs`, Ge = `modules/${u}/templates/cybercall-composer.hbs`, xe = `modules/${u}/templates/cybercall-contacts.hbs`;
let r = null, A = null, C = null, _ = "personal", R = null, G = null;
const pe = {
  "": "Silent",
  [`modules/${u}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${u}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${u}/audio/Ringtone3.ogg`]: "Ringtone 3"
};
function Fe(e) {
  var a;
  if ((a = foundry == null ? void 0 : foundry.utils) != null && a.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
function Ue() {
  var e, t, a, n, i, l, c, o;
  return L({
    callerName: ((e = r == null ? void 0 : r.callData) == null ? void 0 : e.callerName) ?? v.callerName,
    subtitle: ((t = r == null ? void 0 : r.callData) == null ? void 0 : t.subtitle) ?? v.subtitle,
    image: ((a = r == null ? void 0 : r.callData) == null ? void 0 : a.image) ?? "",
    message: ((n = r == null ? void 0 : r.callData) == null ? void 0 : n.message) ?? v.message,
    signal: ((i = r == null ? void 0 : r.callData) == null ? void 0 : i.signal) ?? game.settings.get(u, "defaultSignal"),
    variant: ((l = r == null ? void 0 : r.callData) == null ? void 0 : l.variant) ?? "standard",
    fullscreen: ((c = r == null ? void 0 : r.callData) == null ? void 0 : c.fullscreen) ?? !1,
    ringing: ((o = r == null ? void 0 : r.callData) == null ? void 0 : o.ringing) ?? !0
  });
}
function qe() {
  var e;
  return (((e = game.actors) == null ? void 0 : e.contents) ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    img: t.img ?? ""
  })).sort((t, a) => t.name.localeCompare(a.name));
}
function H() {
  var e, t;
  return String(((e = game.world) == null ? void 0 : e.id) ?? ((t = game.world) == null ? void 0 : t.title) ?? "default");
}
function be() {
  const e = game.settings.get(u, "contacts");
  return Array.isArray(e) ? { [H()]: e } : !e || typeof e != "object" ? {} : e;
}
function W() {
  const e = be()[H()];
  return Array.isArray(e) ? e.map(D).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name)) : [];
}
function x() {
  if (Array.isArray(G))
    return G.map(D).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name));
  const e = game.settings.get(u, "groupContacts");
  return Array.isArray(e) ? e.map(D).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name)) : [];
}
async function fe(e) {
  await game.settings.set(u, "contacts", {
    ...be(),
    [H()]: e.map(D)
  });
}
async function z(e) {
  G = e.map(D), await game.settings.set(u, "groupContacts", G), game.socket.emit(P, {
    action: "groupContactsChanged",
    contacts: G
  });
}
async function Be(e, t, a = "personal", n = "") {
  var c, o, g, p, y, w;
  const i = D({
    name: e,
    number: t,
    image: ye() ? n : ""
  });
  if (!i.name || !i.number) {
    (o = (c = ui.notifications) == null ? void 0 : c.warn) == null || o.call(c, "Contact name and number are required.");
    return;
  }
  if (a === "group" && !game.user.isGM) {
    if (!J()) {
      (p = (g = ui.notifications) == null ? void 0 : g.warn) == null || p.call(g, "A GM must be connected to update group contacts.");
      return;
    }
    game.socket.emit(P, {
      action: "groupContactAdd",
      contact: i
    }), (w = (y = ui.notifications) == null ? void 0 : y.info) == null || w.call(y, "Group contact update sent to the GM.");
    return;
  }
  const l = a === "group" ? x() : W();
  l.push(i), a === "group" ? await z(l) : await fe(l), await j();
}
async function Ve(e, t = "personal") {
  var a, n, i, l;
  if (t === "group") {
    if (!game.user.isGM) {
      if (!J()) {
        (n = (a = ui.notifications) == null ? void 0 : a.warn) == null || n.call(a, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(P, {
        action: "groupContactRemove",
        contactId: e
      }), (l = (i = ui.notifications) == null ? void 0 : i.info) == null || l.call(i, "Group contact removal sent to the GM.");
      return;
    }
    await z(x().filter((c) => c.id !== e));
  } else
    await fe(W().filter((c) => c.id !== e));
  await j();
}
function J() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function Q(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(u, "minimumRole");
  } catch (a) {
    console.warn(`${u} | Permission setting unavailable, using Player role fallback.`, a);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function ye(e = game.user) {
  return !!(e != null && e.isGM);
}
function X(e, t = null) {
  var a;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (a = e.element) != null && a[0] ? e.element[0] : e.element ?? null;
}
function je(e, t = null) {
  const a = X(e, t);
  a && (a.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), a.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), a.classList.toggle("cybercall-connected", e.callData.accepted), a.querySelectorAll("[data-cybercall-action]").forEach((n) => {
    n.addEventListener("click", (i) => {
      const l = i.currentTarget.dataset.cybercallAction;
      if (l === "accept") {
        et(e.callData.id);
        return;
      }
      if (l === "broadcast") {
        ee({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (l === "decline" || l === "end") && ve(e.callData.id);
    });
  }));
}
function ze(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-composer]");
}
function ge(e) {
  var l;
  const t = new FormData(e), a = (l = game.actors) == null ? void 0 : l.get(t.get("actorId")), n = String(t.get("image") ?? "").trim() || (a == null ? void 0 : a.img) || "", i = String(t.get("callerName") ?? "").trim() || (a == null ? void 0 : a.name) || "UNKNOWN CALLER";
  return L({
    callerName: i,
    subtitle: String(t.get("subtitle") ?? "").trim(),
    image: n,
    message: String(t.get("message") ?? "").trim(),
    signal: t.get("signal"),
    variant: String(t.get("variant") ?? v.variant),
    fullscreen: t.get("fullscreen") === "on",
    ringing: t.get("ringing") === "on"
  });
}
function Y(e) {
  var n, i;
  const t = (n = e == null ? void 0 : e.elements) == null ? void 0 : n.signal, a = (i = e == null ? void 0 : e.querySelector) == null ? void 0 : i.call(e, "[data-cybercall-signal-output]");
  !t || !a || (a.textContent = `${de(t.value)}%`);
}
function He(e, t = null) {
  var l, c;
  const a = X(e, t), n = ze(a);
  if (!a || !n) return;
  Y(n);
  const i = a.querySelector("[data-cybercall-ringtone]");
  i && i.addEventListener("change", async (o) => {
    await game.settings.set(u, "ringSound", o.currentTarget.value);
  }), (l = n.elements.signal) == null || l.addEventListener("input", () => Y(n)), (c = n.elements.actorId) == null || c.addEventListener("change", () => {
    var g;
    const o = (g = game.actors) == null ? void 0 : g.get(n.elements.actorId.value);
    o && (n.elements.callerName.value = o.name, n.elements.image.value = o.img ?? "");
  }), n.addEventListener("submit", (o) => {
    o.preventDefault(), k(ge(n));
  }), a.querySelectorAll("[data-cybercall-compose-action]").forEach((o) => {
    o.addEventListener("click", async (g) => {
      var w, T, F, U, I, q, B;
      const p = g.currentTarget.dataset.cybercallComposeAction, y = ge(n);
      if (p === "preview") {
        await k(y);
        return;
      }
      if (p === "broadcast") {
        await ee(y);
        return;
      }
      if (p === "close-active") {
        ve((w = r == null ? void 0 : r.callData) == null ? void 0 : w.id);
        return;
      }
      if (p === "browse-image") {
        const O = n.elements.image, V = globalThis.FilePicker ?? ((U = (F = (T = globalThis.foundry) == null ? void 0 : T.applications) == null ? void 0 : F.apps) == null ? void 0 : U.FilePicker);
        if (!O || !V) {
          (q = (I = ui.notifications) == null ? void 0 : I.warn) == null || q.call(I, "Foundry FilePicker is unavailable.");
          return;
        }
        const E = new V({
          type: "image",
          current: O.value,
          callback: (N) => {
            O.value = N, O.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof E.browse == "function" ? E.browse() : (B = E.render) == null || B.call(E, !0);
        return;
      }
      p === "reset" && (n.reset(), Y(n));
    });
  });
}
function We(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function Ye(e, t = null) {
  const a = X(e, t), n = We(a);
  if (!a || !n) return;
  n.addEventListener("submit", async (l) => {
    var g;
    l.preventDefault();
    const c = new FormData(n), o = String(c.get("scope") ?? _);
    await Be(c.get("name"), c.get("number"), o, c.get("image")), n.reset(), n.elements.scope.value = o, (g = n.elements.name) == null || g.focus();
  }), a.querySelectorAll("[data-cybercall-contact-tab]").forEach((l) => {
    l.addEventListener("click", (c) => {
      _ = c.currentTarget.dataset.cybercallContactTab, a.querySelectorAll("[data-cybercall-contact-tab]").forEach((o) => {
        o.classList.toggle("active", o.dataset.cybercallContactTab === _);
      }), a.querySelectorAll("[data-cybercall-contact-panel]").forEach((o) => {
        o.hidden = o.dataset.cybercallContactPanel !== _;
      }), n.elements.scope && (n.elements.scope.value = _);
    });
  });
  const i = a.querySelector("[data-cybercall-ringtone]");
  i && i.addEventListener("change", async (l) => {
    await game.settings.set(u, "ringSound", l.currentTarget.value);
  }), a.querySelectorAll("[data-cybercall-contact-action]").forEach((l) => {
    l.addEventListener("click", async (c) => {
      const o = c.currentTarget.dataset.cybercallContactAction, g = c.currentTarget.dataset.contactId, p = c.currentTarget.dataset.contactScope ?? "personal", w = (p === "group" ? x() : W()).find((T) => T.id === g);
      if (o === "remove") {
        await Ve(g, p);
        return;
      }
      o === "call" && w && await tt(w) && C === e && await e.close();
    });
  });
}
const { CyberCallApplication: Ke, CyberCallComposer: Je, CyberCallContacts: Qe } = Me({
  moduleId: u,
  templatePath: _e,
  composerTemplatePath: Ge,
  contactsTemplatePath: xe,
  escapeHTML: Fe,
  getDefaultComposerData: Ue,
  getActorChoices: qe,
  getContacts: W,
  getGroupContacts: x,
  getRingtoneChoices: nt,
  getSoundPath: te,
  getActiveContactsTab: () => _,
  canEditContactImages: ye,
  bindCallControls: je,
  bindComposerControls: He,
  bindContactsControls: Ye,
  stopRinging: ae,
  clearActiveCall: (e) => {
    r === e && (r = null);
  },
  clearActiveComposer: (e) => {
    A === e && (A = null);
  },
  clearActiveContacts: (e) => {
    C === e && (C = null);
  }
});
async function k(e = {}) {
  var t, a;
  return Q() ? (C && await C.close(), await Z(), r = new Ke(e), await r.render(!0), Se(r), rt(r.callData), r) : ((a = (t = ui.notifications) == null ? void 0 : t.warn) == null || a.call(t, "You do not have permission to open CyberCall transmissions."), null);
}
async function Z() {
  if (!r) return;
  const e = r;
  r = null, await e.close();
}
function Xe(e) {
  var t;
  return !!((t = r == null ? void 0 : r.callData) != null && t.id) && r.callData.id === e;
}
async function Ze() {
  r && (await r.render(!0), Se(r));
}
async function Ce(e) {
  Xe(e) && (r.callData.accepted = !0, r.callData.ringing = !1, ae(), await Ze());
}
function et(e) {
  e && (game.socket.emit(P, {
    action: "acceptCall",
    callId: e
  }), Ce(e));
}
async function he(e) {
  var t;
  e && ((t = r == null ? void 0 : r.callData) != null && t.id) && r.callData.id !== e || await Z();
}
function ve(e) {
  game.socket.emit(P, {
    action: "endCall",
    callId: e
  }), he(e);
}
async function tt(e) {
  var c, o, g, p, y;
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
  if (!J())
    return (o = (c = ui.notifications) == null ? void 0 : c.warn) == null || o.call(c, "No GM is connected to receive the CyberCall."), null;
  const t = K(), a = String(((g = game.user) == null ? void 0 : g.avatar) ?? ((y = (p = game.user) == null ? void 0 : p.character) == null ? void 0 : y.img) ?? "").trim(), n = {
    id: t,
    signal: game.settings.get(u, "defaultSignal"),
    variant: "standard",
    fullscreen: !1,
    accepted: !1,
    allowBroadcast: !1,
    callerUserId: game.user.id,
    contactNumber: e.number
  }, i = L({
    ...n,
    callerName: e.name,
    subtitle: `Comms ${e.number}`,
    image: e.image,
    message: `Awaiting connection to ${e.name} on ${e.number}...`,
    canAccept: !1,
    canDecline: !1,
    outgoing: !0,
    ringing: !0
  }), l = L({
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
    callData: l
  }), k(i);
}
async function we() {
  var e, t, a;
  return game.user.isGM ? A ? ((a = A.bringToFront) == null || a.call(A), A) : (A = new Je(), await A.render(!0), A) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function Ae() {
  var e, t, a, n;
  return Q() ? r ? ((a = r.bringToFront) == null || a.call(r), r) : C ? ((n = C.bringToFront) == null || n.call(C), C) : (C = new Qe(), await C.render(!0), C) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function j() {
  C && await C.render(!0);
}
async function ee(e = {}) {
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
async function at(e) {
  if (e) {
    if (e.action === "openCall") {
      if (!Q()) return;
      k(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      k(e.callData);
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
      const t = D({
        ...e.contact,
        image: ""
      });
      if (!t.name || !t.number) return;
      const a = x();
      a.push(t), await z(a), await j();
      return;
    }
    if (e.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await z(x().filter((t) => t.id !== e.contactId)), await j();
      return;
    }
    e.action === "groupContactsChanged" && (G = Array.isArray(e.contacts) ? e.contacts.map(D) : null, await j());
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
function te() {
  return String(game.settings.get(u, "ringSound") ?? "").trim();
}
function nt() {
  const e = te();
  return Object.entries(pe).map(([t, a]) => ({
    value: t,
    label: a,
    selected: t === e
  }));
}
function ae() {
  if (!R) return;
  const e = R;
  R = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function rt(e) {
  var l;
  if (ae(), !e.ringing) return;
  const t = te();
  if (!t) return;
  const n = 0.65 * Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), i = ((l = foundry == null ? void 0 : foundry.audio) == null ? void 0 : l.AudioHelper) ?? globalThis.AudioHelper;
  i != null && i.play ? i.play({ src: t, volume: n, autoplay: !0, loop: !0 }, !1).then((c) => {
    R = c;
  }).catch((c) => {
    console.warn(`${u} | Unable to play ringing sound.`, c);
  }) : (R = new Audio(t), R.loop = !0, R.volume = n, R.play().catch((c) => {
    console.warn(`${u} | Unable to play ringing sound.`, c);
  }));
}
function $e() {
  const e = game.modules.get(u);
  e && (e.api = {
    openCall: k,
    closeCall: Z,
    broadcastCall: ee,
    openComposer: we,
    openContacts: Ae,
    get activeCall() {
      return r;
    },
    get activeComposer() {
      return A;
    },
    get activeContacts() {
      return C;
    }
  });
}
function ct() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: u,
    title: "CyberCall",
    icon: "fa-solid fa-satellite-dish",
    premium: !1,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => {
      var a;
      return (a = game.user) != null && a.isGM ? we() : Ae();
    }
  }), !0) : !1;
}
function it() {
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
    choices: pe
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
    hint: "Player contact directory stored locally for this client and isolated per world.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(u, "groupContacts", {
    name: "CyberCall Group Contacts",
    hint: "Shared group contact directory for all players in this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: []
  });
}
async function lt() {
  const e = game.settings.get(u, "contacts");
  Array.isArray(e) && await game.settings.set(u, "contacts", {
    [H()]: e.map(D)
  });
}
Hooks.once("init", () => {
  it(), $e();
});
Hooks.once("ready", async () => {
  await lt(), $e(), ct(), game.socket.on(P, at), console.log(`${u} | Ready. Use game.modules.get("${u}").api.openCall({...})`);
});
