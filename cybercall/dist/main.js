var Pe = Object.defineProperty;
var Le = (e, t, a) => t in e ? Pe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var S = (e, t, a) => Le(e, typeof t != "symbol" ? t + "" : t, a);
function Oe(e, t) {
  return e.image ? `<img src="${t(e.image)}" alt="${t(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${t(e.initials)}</div>`;
}
function se(e, t) {
  const a = `--cybercall-signal: ${e.signal}%;`, n = e.fullscreen ? "cybercall-broadcast" : "", r = e.ringing ? "cybercall-ringing-panel" : "", l = e.accepted ? "cybercall-connected-panel" : "", i = e.showBroadcast ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>' : "", o = e.accepted ? "" : `
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
    `, s = e.accepted ? "" : `<blockquote>${t(e.message)}</blockquote>`, m = e.accepted || e.outgoing ? '<button type="button" data-cybercall-action="end">End Call</button>' : `
        ${e.canAccept ? '<button type="button" data-cybercall-action="accept">Accept</button>' : ""}
        <button type="button" data-cybercall-action="decline">Decline</button>
        ${i}
      `;
  return `
    <div class="cybercall-panel cybercall-${e.variant} ${n} ${r} ${l}" style="${a}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${o}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${Oe(e, t)}</div>
        ${s}
      </main>
      <footer class="cybercall-actions">
        ${m}
      </footer>
    </div>
  `;
}
function ue(e, t) {
  const a = e.call;
  return `
    <form class="cybercall-composer" data-cybercall-composer>
      <label>Actor Portrait
        <select name="actorId">
          <option value="">Manual / no actor</option>
          ${e.actors.map((r) => `<option value="${t(r.id)}">${t(r.name)}</option>`).join("")}
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
    (r) => `<option value="${t(r.value)}" ${r.selected ? "selected" : ""}>${t(r.label)}</option>`
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
function ge(e, t) {
  const a = (i, o) => i.length ? i.map((s) => `
        <li>
          <div class="cybercall-contact-avatar">
            ${s.image ? `<img src="${t(s.image)}" alt="">` : `<span>${t(s.initials)}</span>`}
          </div>
          <div class="cybercall-contact-id">
            <strong>${t(s.name)}</strong>
            <span>${t(s.number)}</span>
          </div>
          <div class="cybercall-contact-actions">
            <button type="button" data-cybercall-contact-action="call" data-contact-scope="${o}" data-contact-id="${t(s.id)}">Call</button>
            <button type="button" data-cybercall-contact-action="remove" data-contact-scope="${o}" data-contact-id="${t(s.id)}">Remove</button>
          </div>
        </li>
      `).join("") : '<li class="cybercall-contacts-empty">No contacts stored.</li>', n = e.activeTab !== "group", r = e.activeTab === "group", l = e.canEditContactImages ? '<label>Picture <input type="text" name="image" placeholder="icons/..."></label>' : "";
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
        <button type="button" class="${r ? "active" : ""}" data-cybercall-contact-tab="group">Group</button>
      </nav>
      <section data-cybercall-contact-panel="personal" ${n ? "" : "hidden"}>
        <ul class="cybercall-contacts-list">${a(e.contacts, "personal")}</ul>
      </section>
      <section data-cybercall-contact-panel="group" ${r ? "" : "hidden"}>
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
    (i) => `<option value="${t(i.value)}" ${i.selected ? "selected" : ""}>${t(i.label)}</option>`
  ).join("")}
          </select>
        </label>
      </footer>
    </section>
  `;
}
const w = {
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
}, Me = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]);
function me(e) {
  const t = Number(e);
  return Number.isNaN(t) ? w.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function pe(e) {
  return String(e).split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var a;
    return (a = t[0]) == null ? void 0 : a.toUpperCase();
  }).join("") || "?";
}
function J() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function L(e = {}) {
  var r;
  const t = Array.isArray(e.targetUserIds) ? e.targetUserIds.map((l) => String(l)).filter(Boolean) : [], a = Array.isArray(e.targetUserNames) ? e.targetUserNames.map((l) => String(l)).filter(Boolean) : [], n = {
    ...w,
    ...e,
    id: String(e.id ?? J()),
    callerName: String(e.callerName ?? w.callerName),
    subtitle: String(e.subtitle ?? w.subtitle),
    image: String(e.image ?? w.image),
    message: String(e.message ?? w.message),
    signal: me(e.signal ?? w.signal),
    variant: Me.has(e.variant) ? e.variant : w.variant,
    fullscreen: !!(e.fullscreen ?? w.fullscreen),
    ringing: e.ringing !== !1 && e.accepted !== !0,
    accepted: e.accepted === !0,
    canAccept: e.canAccept !== !1,
    canDecline: e.canDecline !== !1,
    allowBroadcast: e.allowBroadcast !== !1,
    outgoing: e.outgoing === !0,
    callerUserId: String(e.callerUserId ?? ""),
    contactNumber: String(e.contactNumber ?? ""),
    targetUserIds: t,
    targetUserNames: a
  };
  return n.initials = pe(n.callerName), n.showBroadcast = !!((r = game == null ? void 0 : game.user) != null && r.isGM && n.allowBroadcast), n.isStandard = n.variant === "standard", n.isEmergency = n.variant === "emergency", n.isCorrupted = n.variant === "corrupted", n.isIncoming = !n.accepted, n.hasTargets = n.targetUserIds.length > 0, n.recipientLabel = n.hasTargets ? n.targetUserNames.join(", ") : "All players", n.directionLabel = n.outgoing ? `Calling ${n.recipientLabel}` : `From ${n.callerName}`, n.kicker = n.outgoing ? "Outgoing CyberCall" : n.fullscreen ? "System-wide Broadcast" : "Incoming CyberCall", n;
}
function D(e = {}) {
  return {
    id: String(e.id ?? J()),
    name: String(e.name ?? "").trim(),
    number: String(e.number ?? "").trim(),
    image: String(e.image ?? e.img ?? "").trim(),
    initials: pe(e.name)
  };
}
function Ue(e) {
  var re, ce, le, ie;
  const {
    moduleId: t,
    templatePath: a,
    composerTemplatePath: n,
    contactsTemplatePath: r,
    escapeHTML: l,
    getDefaultComposerData: i,
    getActorChoices: o,
    getPlayerChoices: s,
    getContacts: m,
    getGroupContacts: p,
    getRingtoneChoices: C,
    getSoundPath: T,
    getActiveContactsTab: F,
    canEditContactImages: x,
    bindCallControls: k,
    bindComposerControls: B,
    bindContactsControls: q,
    stopRinging: P,
    clearActiveCall: V,
    clearActiveComposer: E,
    clearActiveContacts: z
  } = e, O = (ce = (re = foundry == null ? void 0 : foundry.applications) == null ? void 0 : re.api) == null ? void 0 : ce.ApplicationV2, M = (ie = (le = foundry == null ? void 0 : foundry.applications) == null ? void 0 : le.api) == null ? void 0 : ie.HandlebarsApplicationMixin;
  class Te extends Application {
    constructor(u, d = {}) {
      super(d);
      S(this, "callData");
      this.callData = L(u);
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
        height: 420
      });
    }
    getData() {
      return {
        call: this.callData
      };
    }
    async _renderInner(u) {
      try {
        return await super._renderInner(u);
      } catch (d) {
        return console.warn(`${t} | Template render failed, using inline fallback.`, d), $(se(this.callData, l));
      }
    }
    activateListeners(u) {
      super.activateListeners(u), k(this, u);
    }
    async close(u) {
      return V(this), P(), super.close(u);
    }
  }
  class Ee extends Application {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-composer",
        title: "CyberCall Composer",
        template: n,
        classes: ["cybercall-composer-app"],
        popOut: !0,
        resizable: !0,
        width: 560,
        height: 560
      });
    }
    getData() {
      return {
        call: i(),
        actors: o(),
        players: s(),
        ringtoneChoices: C()
      };
    }
    async _renderInner(b) {
      try {
        return await super._renderInner(b);
      } catch (u) {
        return console.warn(`${t} | Composer template render failed, using inline fallback.`, u), $(ue(b, l));
      }
    }
    activateListeners(b) {
      super.activateListeners(b), B(this, b);
    }
    async close(b) {
      return E(this), super.close(b);
    }
  }
  class Ne extends Application {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-contacts",
        title: "CyberCall Contacts",
        template: r,
        classes: ["cybercall-contacts-app"],
        popOut: !0,
        resizable: !0,
        width: 500,
        height: 620
      });
    }
    getData() {
      const b = m(), u = p(), d = F();
      return {
        contacts: b,
        groupContacts: u,
        hasContacts: b.length > 0,
        hasGroupContacts: u.length > 0,
        activeTab: d,
        isPersonalTab: d !== "group",
        isGroupTab: d === "group",
        canEditContactImages: x(),
        ringtoneChoices: C(),
        currentRingtone: T()
      };
    }
    async _renderInner(b) {
      try {
        return await super._renderInner(b);
      } catch (u) {
        return console.warn(`${t} | Contacts template render failed, using inline fallback.`, u), $(ge(b, l));
      }
    }
    activateListeners(b) {
      super.activateListeners(b), q(this, b);
    }
    async close(b) {
      return z(this), super.close(b);
    }
  }
  function Ie() {
    var f;
    return !O || !M ? null : (f = class extends M(O) {
      constructor(d, y = {}) {
        super(y);
        S(this, "callData");
        this.callData = L(d);
      }
      async _prepareContext(d) {
        return {
          ...await super._prepareContext(d),
          call: this.callData
        };
      }
      async _renderHTML(d, y) {
        try {
          return await super._renderHTML(d, y);
        } catch (v) {
          console.warn(`${t} | Template render failed, using inline fallback.`, v);
          const oe = document.createElement("template");
          return oe.innerHTML = se(this.callData, l).trim(), oe.content;
        }
      }
      _onRender(d, y) {
        var v;
        (v = super._onRender) == null || v.call(this, d, y), k(this);
      }
      async close(d) {
        return V(this), P(), super.close(d);
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
        height: 420
      }
    }), S(f, "PARTS", {
      main: {
        template: a
      }
    }), f);
  }
  function Re() {
    var f;
    return !O || !M ? null : (f = class extends M(O) {
      async _prepareContext(u) {
        return {
          ...await super._prepareContext(u),
          call: i(),
          actors: o(),
          players: s(),
          ringtoneChoices: C()
        };
      }
      async _renderHTML(u, d) {
        try {
          return await super._renderHTML(u, d);
        } catch (y) {
          console.warn(`${t} | Composer template render failed, using inline fallback.`, y);
          const v = document.createElement("template");
          return v.innerHTML = ue(u, l).trim(), v.content;
        }
      }
      _onRender(u, d) {
        var y;
        (y = super._onRender) == null || y.call(this, u, d), B(this);
      }
      async close(u) {
        return E(this), super.close(u);
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
        height: 560
      }
    }), S(f, "PARTS", {
      main: {
        template: n
      }
    }), f);
  }
  function ke() {
    var f;
    return !O || !M ? null : (f = class extends M(O) {
      async _prepareContext(u) {
        const d = m(), y = p(), v = F();
        return {
          ...await super._prepareContext(u),
          contacts: d,
          groupContacts: y,
          hasContacts: d.length > 0,
          hasGroupContacts: y.length > 0,
          activeTab: v,
          isPersonalTab: v !== "group",
          isGroupTab: v === "group",
          canEditContactImages: x(),
          ringtoneChoices: C(),
          currentRingtone: T()
        };
      }
      async _renderHTML(u, d) {
        try {
          return await super._renderHTML(u, d);
        } catch (y) {
          console.warn(`${t} | Contacts template render failed, using inline fallback.`, y);
          const v = document.createElement("template");
          return v.innerHTML = ge(u, l).trim(), v.content;
        }
      }
      _onRender(u, d) {
        var y;
        (y = super._onRender) == null || y.call(this, u, d), q(this);
      }
      async close(u) {
        return z(this), super.close(u);
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
        height: 620
      }
    }), S(f, "PARTS", {
      main: {
        template: r
      }
    }), f);
  }
  return {
    CyberCallApplication: Ie() ?? Te,
    CyberCallComposer: Re() ?? Ee,
    CyberCallContacts: ke() ?? Ne
  };
}
const g = "cybercall", R = `module.${g}`, Ge = `modules/${g}/templates/cybercall.hbs`, _e = `modules/${g}/templates/cybercall-composer.hbs`, Fe = `modules/${g}/templates/cybercall-contacts.hbs`, be = {
  "": "Silent",
  [`modules/${g}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${g}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${g}/audio/Ringtone3.ogg`]: "Ringtone 3"
};
function xe(e) {
  var a;
  if ((a = foundry == null ? void 0 : foundry.utils) != null && a.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
let c = null, A = null, h = null, U = "personal", N = null, G = null;
function Be() {
  var e, t, a, n, r, l, i, o;
  return L({
    callerName: ((e = c == null ? void 0 : c.callData) == null ? void 0 : e.callerName) ?? w.callerName,
    subtitle: ((t = c == null ? void 0 : c.callData) == null ? void 0 : t.subtitle) ?? w.subtitle,
    image: ((a = c == null ? void 0 : c.callData) == null ? void 0 : a.image) ?? "",
    message: ((n = c == null ? void 0 : c.callData) == null ? void 0 : n.message) ?? w.message,
    signal: ((r = c == null ? void 0 : c.callData) == null ? void 0 : r.signal) ?? game.settings.get(g, "defaultSignal"),
    variant: ((l = c == null ? void 0 : c.callData) == null ? void 0 : l.variant) ?? "standard",
    fullscreen: ((i = c == null ? void 0 : c.callData) == null ? void 0 : i.fullscreen) ?? !1,
    ringing: ((o = c == null ? void 0 : c.callData) == null ? void 0 : o.ringing) ?? !0
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
function Ve() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => !t.isGM).map((t) => ({
    id: t.id,
    name: t.name,
    active: t.active === !0
  })).sort((t, a) => t.name.localeCompare(a.name));
}
function W() {
  var e, t;
  return String(((e = game.world) == null ? void 0 : e.id) ?? ((t = game.world) == null ? void 0 : t.title) ?? "default");
}
function ye() {
  const e = game.settings.get(g, "contacts");
  return Array.isArray(e) ? { [W()]: e } : !e || typeof e != "object" ? {} : e;
}
function Y() {
  const e = ye()[W()];
  return Array.isArray(e) ? e.map(D).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name)) : [];
}
function _() {
  if (Array.isArray(G))
    return G.map(D).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name));
  const e = game.settings.get(g, "groupContacts");
  return Array.isArray(e) ? e.map(D).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name)) : [];
}
async function fe(e) {
  await game.settings.set(g, "contacts", {
    ...ye(),
    [W()]: e.map(D)
  });
}
async function H(e) {
  G = e.map(D), await game.settings.set(g, "groupContacts", G), game.socket.emit(R, {
    action: "groupContactsChanged",
    contacts: G
  });
}
async function je(e, t, a = "personal", n = "") {
  var i, o, s, m, p, C;
  const r = D({
    name: e,
    number: t,
    image: Ce() ? n : ""
  });
  if (!r.name || !r.number) {
    (o = (i = ui.notifications) == null ? void 0 : i.warn) == null || o.call(i, "Contact name and number are required.");
    return;
  }
  if (a === "group" && !game.user.isGM) {
    if (!Q()) {
      (m = (s = ui.notifications) == null ? void 0 : s.warn) == null || m.call(s, "A GM must be connected to update group contacts.");
      return;
    }
    game.socket.emit(R, {
      action: "groupContactAdd",
      contact: r
    }), (C = (p = ui.notifications) == null ? void 0 : p.info) == null || C.call(p, "Group contact update sent to the GM.");
    return;
  }
  const l = a === "group" ? _() : Y();
  l.push(r), a === "group" ? await H(l) : await fe(l), await j();
}
async function ze(e, t = "personal") {
  var a, n, r, l;
  if (t === "group") {
    if (!game.user.isGM) {
      if (!Q()) {
        (n = (a = ui.notifications) == null ? void 0 : a.warn) == null || n.call(a, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(R, {
        action: "groupContactRemove",
        contactId: e
      }), (l = (r = ui.notifications) == null ? void 0 : r.info) == null || l.call(r, "Group contact removal sent to the GM.");
      return;
    }
    await H(_().filter((i) => i.id !== e));
  } else
    await fe(Y().filter((i) => i.id !== e));
  await j();
}
function Q() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function X(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(g, "minimumRole");
  } catch (a) {
    console.warn(`${g} | Permission setting unavailable, using Player role fallback.`, a);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function Ce(e = game.user) {
  return !!(e != null && e.isGM);
}
function Z(e, t = null) {
  var a;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (a = e.element) != null && a[0] ? e.element[0] : e.element ?? null;
}
function He(e, t = null) {
  const a = Z(e, t);
  a && (a.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), a.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), a.classList.toggle("cybercall-connected", e.callData.accepted), a.querySelectorAll("[data-cybercall-action]").forEach((n) => {
    n.addEventListener("click", (r) => {
      const l = r.currentTarget.dataset.cybercallAction;
      if (l === "accept") {
        at(e.callData.id);
        return;
      }
      if (l === "broadcast") {
        te({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (l === "decline" || l === "end") && we(e.callData.id);
    });
  }));
}
function We(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-composer]");
}
function de(e) {
  var s, m;
  const t = new FormData(e), a = (s = game.actors) == null ? void 0 : s.get(t.get("actorId")), n = String(t.get("image") ?? "").trim() || (a == null ? void 0 : a.img) || "", r = String(t.get("callerName") ?? "").trim() || (a == null ? void 0 : a.name) || "UNKNOWN CALLER", l = t.getAll("targetUserIds").map((p) => String(p)).filter(Boolean), i = new Map((((m = game.users) == null ? void 0 : m.contents) ?? []).map((p) => [p.id, p])), o = l.map((p) => {
    var C;
    return ((C = i.get(p)) == null ? void 0 : C.name) ?? p;
  });
  return L({
    callerName: r,
    subtitle: String(t.get("subtitle") ?? "").trim(),
    image: n,
    message: String(t.get("message") ?? "").trim(),
    signal: t.get("signal"),
    variant: String(t.get("variant") ?? w.variant),
    fullscreen: t.get("fullscreen") === "on",
    ringing: t.get("ringing") === "on",
    targetUserIds: l,
    targetUserNames: o
  });
}
function K(e) {
  var n, r;
  const t = (n = e == null ? void 0 : e.elements) == null ? void 0 : n.signal, a = (r = e == null ? void 0 : e.querySelector) == null ? void 0 : r.call(e, "[data-cybercall-signal-output]");
  !t || !a || (a.textContent = `${me(t.value)}%`);
}
function Ye(e, t = null) {
  var l, i;
  const a = Z(e, t), n = We(a);
  if (!a || !n) return;
  K(n);
  const r = a.querySelector("[data-cybercall-ringtone]");
  r && r.addEventListener("change", async (o) => {
    await game.settings.set(g, "ringSound", o.currentTarget.value);
  }), (l = n.elements.signal) == null || l.addEventListener("input", () => K(n)), (i = n.elements.actorId) == null || i.addEventListener("change", () => {
    var s;
    const o = (s = game.actors) == null ? void 0 : s.get(n.elements.actorId.value);
    o && (n.elements.callerName.value = o.name, n.elements.image.value = o.img ?? "");
  }), n.addEventListener("submit", (o) => {
    o.preventDefault(), I(de(n));
  }), a.querySelectorAll("[data-cybercall-compose-action]").forEach((o) => {
    o.addEventListener("click", async (s) => {
      var C, T, F, x, k, B, q;
      const m = s.currentTarget.dataset.cybercallComposeAction, p = de(n);
      if (m === "preview") {
        await I(p);
        return;
      }
      if (m === "broadcast") {
        await te(p);
        return;
      }
      if (m === "close-active") {
        we((C = c == null ? void 0 : c.callData) == null ? void 0 : C.id);
        return;
      }
      if (m === "browse-image") {
        const P = n.elements.image, V = globalThis.FilePicker ?? ((x = (F = (T = globalThis.foundry) == null ? void 0 : T.applications) == null ? void 0 : F.apps) == null ? void 0 : x.FilePicker);
        if (!P || !V) {
          (B = (k = ui.notifications) == null ? void 0 : k.warn) == null || B.call(k, "Foundry FilePicker is unavailable.");
          return;
        }
        const E = new V({
          type: "image",
          current: P.value,
          callback: (z) => {
            P.value = z, P.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof E.browse == "function" ? E.browse() : (q = E.render) == null || q.call(E, !0);
        return;
      }
      m === "reset" && (n.reset(), K(n));
    });
  });
}
function Ke(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function Je(e, t = null) {
  const a = Z(e, t), n = Ke(a);
  if (!a || !n) return;
  n.addEventListener("submit", async (l) => {
    var s;
    l.preventDefault();
    const i = new FormData(n), o = String(i.get("scope") ?? U);
    await je(i.get("name"), i.get("number"), o, i.get("image")), n.reset(), n.elements.scope.value = o, (s = n.elements.name) == null || s.focus();
  }), a.querySelectorAll("[data-cybercall-contact-tab]").forEach((l) => {
    l.addEventListener("click", (i) => {
      U = i.currentTarget.dataset.cybercallContactTab, a.querySelectorAll("[data-cybercall-contact-tab]").forEach((o) => {
        o.classList.toggle("active", o.dataset.cybercallContactTab === U);
      }), a.querySelectorAll("[data-cybercall-contact-panel]").forEach((o) => {
        o.hidden = o.dataset.cybercallContactPanel !== U;
      }), n.elements.scope && (n.elements.scope.value = U);
    });
  });
  const r = a.querySelector("[data-cybercall-ringtone]");
  r && r.addEventListener("change", async (l) => {
    await game.settings.set(g, "ringSound", l.currentTarget.value);
  }), a.querySelectorAll("[data-cybercall-contact-action]").forEach((l) => {
    l.addEventListener("click", async (i) => {
      const o = i.currentTarget.dataset.cybercallContactAction, s = i.currentTarget.dataset.contactId, m = i.currentTarget.dataset.contactScope ?? "personal", C = (m === "group" ? _() : Y()).find((T) => T.id === s);
      if (o === "remove") {
        await ze(s, m);
        return;
      }
      o === "call" && C && await nt(C) && h === e && await e.close();
    });
  });
}
const { CyberCallApplication: Qe, CyberCallComposer: Xe, CyberCallContacts: Ze } = Ue({
  moduleId: g,
  templatePath: Ge,
  composerTemplatePath: _e,
  contactsTemplatePath: Fe,
  escapeHTML: xe,
  getDefaultComposerData: Be,
  getActorChoices: qe,
  getPlayerChoices: Ve,
  getContacts: Y,
  getGroupContacts: _,
  getRingtoneChoices: ct,
  getSoundPath: ae,
  getActiveContactsTab: () => U,
  canEditContactImages: Ce,
  bindCallControls: He,
  bindComposerControls: Ye,
  bindContactsControls: Je,
  stopRinging: ne,
  clearActiveCall: (e) => {
    c === e && (c = null);
  },
  clearActiveComposer: (e) => {
    A === e && (A = null);
  },
  clearActiveContacts: (e) => {
    h === e && (h = null);
  }
});
async function I(e = {}) {
  var t, a;
  return X() ? (h && await h.close(), await ee(), c = new Qe(e), await c.render(!0), $e(c), lt(c.callData), c) : ((a = (t = ui.notifications) == null ? void 0 : t.warn) == null || a.call(t, "You do not have permission to open CyberCall transmissions."), null);
}
async function ee() {
  if (!c) return;
  const e = c;
  c = null, await e.close();
}
function et(e) {
  var t;
  return !!((t = c == null ? void 0 : c.callData) != null && t.id) && c.callData.id === e;
}
async function tt() {
  c && (await c.render(!0), $e(c));
}
async function he(e) {
  et(e) && (c.callData.accepted = !0, c.callData.ringing = !1, ne(), await tt());
}
function at(e) {
  e && (game.socket.emit(R, {
    action: "acceptCall",
    callId: e
  }), he(e));
}
async function ve(e) {
  var t;
  e && ((t = c == null ? void 0 : c.callData) != null && t.id) && c.callData.id !== e || await ee();
}
function we(e) {
  game.socket.emit(R, {
    action: "endCall",
    callId: e
  }), ve(e);
}
async function nt(e) {
  var i, o, s, m, p;
  if (game.user.isGM)
    return I({
      callerName: e.name,
      subtitle: `Comms ${e.number}`,
      image: e.image,
      message: `Opening channel ${e.number}...`,
      signal: game.settings.get(g, "defaultSignal"),
      variant: "standard",
      ringing: !1
    });
  if (!Q())
    return (o = (i = ui.notifications) == null ? void 0 : i.warn) == null || o.call(i, "No GM is connected to receive the CyberCall."), null;
  const t = J(), a = String(((s = game.user) == null ? void 0 : s.avatar) ?? ((p = (m = game.user) == null ? void 0 : m.character) == null ? void 0 : p.img) ?? "").trim(), n = {
    id: t,
    signal: game.settings.get(g, "defaultSignal"),
    variant: "standard",
    fullscreen: !1,
    accepted: !1,
    allowBroadcast: !1,
    callerUserId: game.user.id,
    contactNumber: e.number
  }, r = L({
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
  return game.socket.emit(R, {
    action: "playerCallRequest",
    callData: l
  }), I(r);
}
async function Ae() {
  var e, t, a;
  return game.user.isGM ? A ? ((a = A.bringToFront) == null || a.call(A), A) : (A = new Xe(), await A.render(!0), A) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function Se() {
  var e, t, a, n;
  return X() ? c ? ((a = c.bringToFront) == null || a.call(c), c) : h ? ((n = h.bringToFront) == null || n.call(h), h) : (h = new Ze(), await h.render(!0), h) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function j() {
  h && await h.render(!0);
}
async function te(e = {}) {
  var a, n;
  if (!game.user.isGM)
    return (n = (a = ui.notifications) == null ? void 0 : a.warn) == null || n.call(a, "Only the GM can broadcast CyberCalls to all players."), null;
  const t = L({
    ...e,
    fullscreen: e.fullscreen ?? !0,
    ringing: !0
  });
  return game.socket.emit(R, {
    action: "openCall",
    callData: t,
    targetUserIds: t.targetUserIds
  }), I({ ...t, outgoing: !0 });
}
async function rt(e) {
  var t, a, n;
  if (e && !(Array.isArray(e.targetUserIds) && e.targetUserIds.length && !e.targetUserIds.includes((t = game.user) == null ? void 0 : t.id)) && !(Array.isArray((a = e.callData) == null ? void 0 : a.targetUserIds) && e.callData.targetUserIds.length && !e.callData.targetUserIds.includes((n = game.user) == null ? void 0 : n.id))) {
    if (e.action === "openCall") {
      if (!X()) return;
      I(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      I(e.callData);
      return;
    }
    if (e.action === "acceptCall") {
      he(e.callId);
      return;
    }
    if (e.action === "endCall") {
      ve(e.callId);
      return;
    }
    if (e.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const r = D({
        ...e.contact,
        image: ""
      });
      if (!r.name || !r.number) return;
      const l = _();
      l.push(r), await H(l), await j();
      return;
    }
    if (e.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await H(_().filter((r) => r.id !== e.contactId)), await j();
      return;
    }
    e.action === "groupContactsChanged" && (G = Array.isArray(e.contacts) ? e.contacts.map(D) : null, await j());
  }
}
function $e(e) {
  var t, a;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((a = e.setPosition) == null || a.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function ae() {
  return String(game.settings.get(g, "ringSound") ?? "").trim();
}
function ct() {
  const e = ae();
  return Object.entries(be).map(([t, a]) => ({
    value: t,
    label: a,
    selected: t === e
  }));
}
function ne() {
  if (!N) return;
  const e = N;
  N = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function lt(e) {
  var l;
  if (ne(), !e.ringing) return;
  const t = ae();
  if (!t) return;
  const n = 0.65 * Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), r = ((l = foundry == null ? void 0 : foundry.audio) == null ? void 0 : l.AudioHelper) ?? globalThis.AudioHelper;
  r != null && r.play ? r.play({ src: t, volume: n, autoplay: !0, loop: !0 }, !1).then((i) => {
    N = i;
  }).catch((i) => {
    console.warn(`${g} | Unable to play ringing sound.`, i);
  }) : (N = new Audio(t), N.loop = !0, N.volume = n, N.play().catch((i) => {
    console.warn(`${g} | Unable to play ringing sound.`, i);
  }));
}
function De() {
  const e = game.modules.get(g);
  e && (e.api = {
    openCall: I,
    closeCall: ee,
    broadcastCall: te,
    openComposer: Ae,
    openContacts: Se,
    get activeCall() {
      return c;
    },
    get activeComposer() {
      return A;
    },
    get activeContacts() {
      return h;
    }
  });
}
function it() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: g,
    title: "CyberCall",
    icon: "fa-solid fa-satellite-dish",
    premium: !1,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => {
      var a;
      return (a = game.user) != null && a.isGM ? Ae() : Se();
    }
  }), !0) : !1;
}
function ot() {
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
  game.settings.register(g, "defaultSignal", {
    name: "Default Signal Strength",
    hint: "Signal percentage used when a call does not provide one.",
    scope: "client",
    config: !0,
    type: Number,
    default: w.signal,
    range: {
      min: 0,
      max: 100,
      step: 1
    }
  }), game.settings.register(g, "ringSound", {
    name: "Incoming Call Ringtone",
    hint: "Ringtone played locally while a CyberCall is ringing. This is a client setting, so each user can choose their own ringtone.",
    scope: "client",
    config: !1,
    type: String,
    default: "",
    choices: be
  }), game.settings.register(g, "minimumRole", {
    name: "Minimum Player Role",
    hint: "Minimum role allowed to open CyberCall overlays and receive GM broadcasts.",
    scope: "world",
    config: !0,
    type: Number,
    default: e.PLAYER,
    choices: t
  }), game.settings.register(g, "contacts", {
    name: "CyberCall Contacts",
    hint: "Player contact directory stored locally for this client and isolated per world.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(g, "groupContacts", {
    name: "CyberCall Group Contacts",
    hint: "Shared group contact directory for all players in this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: []
  });
}
async function st() {
  const e = game.settings.get(g, "contacts");
  Array.isArray(e) && await game.settings.set(g, "contacts", {
    [W()]: e.map(D)
  });
}
Hooks.once("init", () => {
  ot(), De();
});
Hooks.once("ready", async () => {
  await st(), De(), it(), game.socket.on(R, rt), console.log(`${g} | Ready. Use game.modules.get("${g}").api.openCall({...})`);
});
