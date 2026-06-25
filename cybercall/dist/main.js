var Oe = Object.defineProperty;
var Ue = (e, t, a) => t in e ? Oe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var S = (e, t, a) => Ue(e, typeof t != "symbol" ? t + "" : t, a);
function Me(e, t) {
  return e.image ? `<img src="${t(e.image)}" alt="${t(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${t(e.initials)}</div>`;
}
function ge(e, t) {
  const a = `--cybercall-signal: ${e.signal}%;`, n = e.fullscreen ? "cybercall-broadcast" : "", r = e.ringing ? "cybercall-ringing-panel" : "", i = e.accepted ? "cybercall-connected-panel" : "", l = e.showBroadcast ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>' : "", o = e.accepted ? "" : `
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
        ${l}
      `;
  return `
    <div class="cybercall-panel cybercall-${e.variant} ${n} ${r} ${i}" style="${a}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${o}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${Me(e, t)}</div>
        ${s}
      </main>
      <footer class="cybercall-actions">
        ${m}
      </footer>
    </div>
  `;
}
function de(e, t) {
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
function me(e, t) {
  const a = (l, o) => l.length ? l.map((s) => `
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
      `).join("") : '<li class="cybercall-contacts-empty">No contacts stored.</li>', n = e.activeTab !== "group", r = e.activeTab === "group", i = e.canEditContactImages ? '<label>Picture <input type="text" name="image" placeholder="icons/..."></label>' : "";
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
        ${i}
        <button type="submit">Add Contact</button>
      </form>
      <footer class="cybercall-contacts-footer">
        <label class="cybercall-ringtone-select">
          <span>Ringtone</span>
          <select data-cybercall-ringtone>
            ${(e.ringtoneChoices ?? []).map(
    (l) => `<option value="${t(l.value)}" ${l.selected ? "selected" : ""}>${t(l.label)}</option>`
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
}, Ge = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]);
function be(e) {
  const t = Number(e);
  return Number.isNaN(t) ? w.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function ye(e) {
  return String(e).split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var a;
    return (a = t[0]) == null ? void 0 : a.toUpperCase();
  }).join("") || "?";
}
function X() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function L(e = {}) {
  var r;
  const t = Array.isArray(e.targetUserIds) ? e.targetUserIds.map((i) => String(i)).filter(Boolean) : [], a = Array.isArray(e.targetUserNames) ? e.targetUserNames.map((i) => String(i)).filter(Boolean) : [], n = {
    ...w,
    ...e,
    id: String(e.id ?? X()),
    callerName: String(e.callerName ?? w.callerName),
    subtitle: String(e.subtitle ?? w.subtitle),
    image: String(e.image ?? w.image),
    message: String(e.message ?? w.message),
    signal: be(e.signal ?? w.signal),
    variant: Ge.has(e.variant) ? e.variant : w.variant,
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
  return n.initials = ye(n.callerName), n.showBroadcast = !!((r = game == null ? void 0 : game.user) != null && r.isGM && n.allowBroadcast), n.isStandard = n.variant === "standard", n.isEmergency = n.variant === "emergency", n.isCorrupted = n.variant === "corrupted", n.isIncoming = !n.accepted, n.hasTargets = n.targetUserIds.length > 0, n.recipientLabel = n.hasTargets ? n.targetUserNames.join(", ") : "All players", n.directionLabel = n.outgoing ? `Calling ${n.recipientLabel}` : `From ${n.callerName}`, n.kicker = n.outgoing ? "Outgoing CyberCall" : n.fullscreen ? "System-wide Broadcast" : "Incoming CyberCall", n;
}
function T(e = {}) {
  return {
    id: String(e.id ?? X()),
    name: String(e.name ?? "").trim(),
    number: String(e.number ?? "").trim(),
    image: String(e.image ?? e.img ?? "").trim(),
    initials: ye(e.name)
  };
}
function _e() {
  var t, a, n;
  const e = Number(((a = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : a.generation) ?? ((n = game == null ? void 0 : game.release) == null ? void 0 : n.generation));
  return Number.isFinite(e) ? e : null;
}
function Fe() {
  const e = _e();
  return e === null || e >= 13;
}
function xe() {
  var a, n, r, i, l, o;
  const e = ((n = (a = globalThis.foundry) == null ? void 0 : a.appv1) == null ? void 0 : n.api) ?? ((r = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : r.api) ?? null, t = ((l = (i = globalThis.foundry) == null ? void 0 : i.applications) == null ? void 0 : l.api) ?? ((o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function Be(e) {
  var ie, le, oe, se;
  const {
    moduleId: t,
    templatePath: a,
    composerTemplatePath: n,
    contactsTemplatePath: r,
    escapeHTML: i,
    getDefaultComposerData: l,
    getActorChoices: o,
    getPlayerChoices: s,
    getContacts: m,
    getGroupContacts: p,
    getRingtoneChoices: C,
    getSoundPath: D,
    getActiveContactsTab: F,
    canEditContactImages: x,
    bindCallControls: k,
    bindComposerControls: B,
    bindContactsControls: q,
    stopRinging: P,
    clearActiveCall: V,
    clearActiveComposer: E,
    clearActiveContacts: z
  } = e, O = (le = (ie = foundry == null ? void 0 : foundry.applications) == null ? void 0 : ie.api) == null ? void 0 : le.ApplicationV2, U = (se = (oe = foundry == null ? void 0 : foundry.applications) == null ? void 0 : oe.api) == null ? void 0 : se.HandlebarsApplicationMixin, K = xe(), J = Fe();
  class Ne extends K {
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
        return console.warn(`${t} | Template render failed, using inline fallback.`, d), $(ge(this.callData, i));
      }
    }
    activateListeners(u) {
      super.activateListeners(u), k(this, u);
    }
    async close(u) {
      return V(this), P(), super.close(u);
    }
  }
  class Ie extends K {
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
        call: l(),
        actors: o(),
        players: s(),
        ringtoneChoices: C()
      };
    }
    async _renderInner(b) {
      try {
        return await super._renderInner(b);
      } catch (u) {
        return console.warn(`${t} | Composer template render failed, using inline fallback.`, u), $(de(b, i));
      }
    }
    activateListeners(b) {
      super.activateListeners(b), B(this, b);
    }
    async close(b) {
      return E(this), super.close(b);
    }
  }
  class Re extends K {
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
        currentRingtone: D()
      };
    }
    async _renderInner(b) {
      try {
        return await super._renderInner(b);
      } catch (u) {
        return console.warn(`${t} | Contacts template render failed, using inline fallback.`, u), $(me(b, i));
      }
    }
    activateListeners(b) {
      super.activateListeners(b), q(this, b);
    }
    async close(b) {
      return z(this), super.close(b);
    }
  }
  function ke() {
    var f;
    return !J || !O || !U ? null : (f = class extends U(O) {
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
          const ue = document.createElement("template");
          return ue.innerHTML = ge(this.callData, i).trim(), ue.content;
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
  function Pe() {
    var f;
    return !J || !O || !U ? null : (f = class extends U(O) {
      async _prepareContext(u) {
        return {
          ...await super._prepareContext(u),
          call: l(),
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
          return v.innerHTML = de(u, i).trim(), v.content;
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
  function Le() {
    var f;
    return !J || !O || !U ? null : (f = class extends U(O) {
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
          currentRingtone: D()
        };
      }
      async _renderHTML(u, d) {
        try {
          return await super._renderHTML(u, d);
        } catch (y) {
          console.warn(`${t} | Contacts template render failed, using inline fallback.`, y);
          const v = document.createElement("template");
          return v.innerHTML = me(u, i).trim(), v.content;
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
    CyberCallApplication: ke() ?? Ne,
    CyberCallComposer: Pe() ?? Ie,
    CyberCallContacts: Le() ?? Re
  };
}
const g = "cybercall", R = `module.${g}`, qe = `modules/${g}/templates/cybercall.hbs`, Ve = `modules/${g}/templates/cybercall-composer.hbs`, je = `modules/${g}/templates/cybercall-contacts.hbs`, fe = {
  "": "Silent",
  [`modules/${g}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${g}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${g}/audio/Ringtone3.ogg`]: "Ringtone 3"
};
function ze(e) {
  var a;
  if ((a = foundry == null ? void 0 : foundry.utils) != null && a.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
let c = null, A = null, h = null, M = "personal", N = null, G = null;
function He() {
  var e, t, a, n, r, i, l, o;
  return L({
    callerName: ((e = c == null ? void 0 : c.callData) == null ? void 0 : e.callerName) ?? w.callerName,
    subtitle: ((t = c == null ? void 0 : c.callData) == null ? void 0 : t.subtitle) ?? w.subtitle,
    image: ((a = c == null ? void 0 : c.callData) == null ? void 0 : a.image) ?? "",
    message: ((n = c == null ? void 0 : c.callData) == null ? void 0 : n.message) ?? w.message,
    signal: ((r = c == null ? void 0 : c.callData) == null ? void 0 : r.signal) ?? game.settings.get(g, "defaultSignal"),
    variant: ((i = c == null ? void 0 : c.callData) == null ? void 0 : i.variant) ?? "standard",
    fullscreen: ((l = c == null ? void 0 : c.callData) == null ? void 0 : l.fullscreen) ?? !1,
    ringing: ((o = c == null ? void 0 : c.callData) == null ? void 0 : o.ringing) ?? !0
  });
}
function We() {
  var e;
  return (((e = game.actors) == null ? void 0 : e.contents) ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    img: t.img ?? ""
  })).sort((t, a) => t.name.localeCompare(a.name));
}
function Ye() {
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
function Ce() {
  const e = game.settings.get(g, "contacts");
  return Array.isArray(e) ? { [W()]: e } : !e || typeof e != "object" ? {} : e;
}
function Y() {
  const e = Ce()[W()];
  return Array.isArray(e) ? e.map(T).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name)) : [];
}
function _() {
  if (Array.isArray(G))
    return G.map(T).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name));
  const e = game.settings.get(g, "groupContacts");
  return Array.isArray(e) ? e.map(T).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name)) : [];
}
async function he(e) {
  await game.settings.set(g, "contacts", {
    ...Ce(),
    [W()]: e.map(T)
  });
}
async function H(e) {
  G = e.map(T), await game.settings.set(g, "groupContacts", G), game.socket.emit(R, {
    action: "groupContactsChanged",
    contacts: G
  });
}
async function Ke(e, t, a = "personal", n = "") {
  var l, o, s, m, p, C;
  const r = T({
    name: e,
    number: t,
    image: ve() ? n : ""
  });
  if (!r.name || !r.number) {
    (o = (l = ui.notifications) == null ? void 0 : l.warn) == null || o.call(l, "Contact name and number are required.");
    return;
  }
  if (a === "group" && !game.user.isGM) {
    if (!Z()) {
      (m = (s = ui.notifications) == null ? void 0 : s.warn) == null || m.call(s, "A GM must be connected to update group contacts.");
      return;
    }
    game.socket.emit(R, {
      action: "groupContactAdd",
      contact: r
    }), (C = (p = ui.notifications) == null ? void 0 : p.info) == null || C.call(p, "Group contact update sent to the GM.");
    return;
  }
  const i = a === "group" ? _() : Y();
  i.push(r), a === "group" ? await H(i) : await he(i), await j();
}
async function Je(e, t = "personal") {
  var a, n, r, i;
  if (t === "group") {
    if (!game.user.isGM) {
      if (!Z()) {
        (n = (a = ui.notifications) == null ? void 0 : a.warn) == null || n.call(a, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(R, {
        action: "groupContactRemove",
        contactId: e
      }), (i = (r = ui.notifications) == null ? void 0 : r.info) == null || i.call(r, "Group contact removal sent to the GM.");
      return;
    }
    await H(_().filter((l) => l.id !== e));
  } else
    await he(Y().filter((l) => l.id !== e));
  await j();
}
function Z() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function ee(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(g, "minimumRole");
  } catch (a) {
    console.warn(`${g} | Permission setting unavailable, using Player role fallback.`, a);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function ve(e = game.user) {
  return !!(e != null && e.isGM);
}
function te(e, t = null) {
  var a;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (a = e.element) != null && a[0] ? e.element[0] : e.element ?? null;
}
function Qe(e, t = null) {
  const a = te(e, t);
  a && (a.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), a.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), a.classList.toggle("cybercall-connected", e.callData.accepted), a.querySelectorAll("[data-cybercall-action]").forEach((n) => {
    n.addEventListener("click", (r) => {
      const i = r.currentTarget.dataset.cybercallAction;
      if (i === "accept") {
        lt(e.callData.id);
        return;
      }
      if (i === "broadcast") {
        ne({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (i === "decline" || i === "end") && Se(e.callData.id);
    });
  }));
}
function Xe(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-composer]");
}
function pe(e) {
  var s, m;
  const t = new FormData(e), a = (s = game.actors) == null ? void 0 : s.get(t.get("actorId")), n = String(t.get("image") ?? "").trim() || (a == null ? void 0 : a.img) || "", r = String(t.get("callerName") ?? "").trim() || (a == null ? void 0 : a.name) || "UNKNOWN CALLER", i = t.getAll("targetUserIds").map((p) => String(p)).filter(Boolean), l = new Map((((m = game.users) == null ? void 0 : m.contents) ?? []).map((p) => [p.id, p])), o = i.map((p) => {
    var C;
    return ((C = l.get(p)) == null ? void 0 : C.name) ?? p;
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
    targetUserIds: i,
    targetUserNames: o
  });
}
function Q(e) {
  var n, r;
  const t = (n = e == null ? void 0 : e.elements) == null ? void 0 : n.signal, a = (r = e == null ? void 0 : e.querySelector) == null ? void 0 : r.call(e, "[data-cybercall-signal-output]");
  !t || !a || (a.textContent = `${be(t.value)}%`);
}
function Ze(e, t = null) {
  var i, l;
  const a = te(e, t), n = Xe(a);
  if (!a || !n) return;
  Q(n);
  const r = a.querySelector("[data-cybercall-ringtone]");
  r && r.addEventListener("change", async (o) => {
    await game.settings.set(g, "ringSound", o.currentTarget.value);
  }), (i = n.elements.signal) == null || i.addEventListener("input", () => Q(n)), (l = n.elements.actorId) == null || l.addEventListener("change", () => {
    var s;
    const o = (s = game.actors) == null ? void 0 : s.get(n.elements.actorId.value);
    o && (n.elements.callerName.value = o.name, n.elements.image.value = o.img ?? "");
  }), n.addEventListener("submit", (o) => {
    o.preventDefault(), I(pe(n));
  }), a.querySelectorAll("[data-cybercall-compose-action]").forEach((o) => {
    o.addEventListener("click", async (s) => {
      var C, D, F, x, k, B, q;
      const m = s.currentTarget.dataset.cybercallComposeAction, p = pe(n);
      if (m === "preview") {
        await I(p);
        return;
      }
      if (m === "broadcast") {
        await ne(p);
        return;
      }
      if (m === "close-active") {
        Se((C = c == null ? void 0 : c.callData) == null ? void 0 : C.id);
        return;
      }
      if (m === "browse-image") {
        const P = n.elements.image, V = globalThis.FilePicker ?? ((x = (F = (D = globalThis.foundry) == null ? void 0 : D.applications) == null ? void 0 : F.apps) == null ? void 0 : x.FilePicker);
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
      m === "reset" && (n.reset(), Q(n));
    });
  });
}
function et(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function tt(e, t = null) {
  const a = te(e, t), n = et(a);
  if (!a || !n) return;
  n.addEventListener("submit", async (i) => {
    var s;
    i.preventDefault();
    const l = new FormData(n), o = String(l.get("scope") ?? M);
    await Ke(l.get("name"), l.get("number"), o, l.get("image")), n.reset(), n.elements.scope.value = o, (s = n.elements.name) == null || s.focus();
  }), a.querySelectorAll("[data-cybercall-contact-tab]").forEach((i) => {
    i.addEventListener("click", (l) => {
      M = l.currentTarget.dataset.cybercallContactTab, a.querySelectorAll("[data-cybercall-contact-tab]").forEach((o) => {
        o.classList.toggle("active", o.dataset.cybercallContactTab === M);
      }), a.querySelectorAll("[data-cybercall-contact-panel]").forEach((o) => {
        o.hidden = o.dataset.cybercallContactPanel !== M;
      }), n.elements.scope && (n.elements.scope.value = M);
    });
  });
  const r = a.querySelector("[data-cybercall-ringtone]");
  r && r.addEventListener("change", async (i) => {
    await game.settings.set(g, "ringSound", i.currentTarget.value);
  }), a.querySelectorAll("[data-cybercall-contact-action]").forEach((i) => {
    i.addEventListener("click", async (l) => {
      const o = l.currentTarget.dataset.cybercallContactAction, s = l.currentTarget.dataset.contactId, m = l.currentTarget.dataset.contactScope ?? "personal", C = (m === "group" ? _() : Y()).find((D) => D.id === s);
      if (o === "remove") {
        await Je(s, m);
        return;
      }
      o === "call" && C && await ot(C) && h === e && await e.close();
    });
  });
}
const { CyberCallApplication: at, CyberCallComposer: nt, CyberCallContacts: rt } = Be({
  moduleId: g,
  templatePath: qe,
  composerTemplatePath: Ve,
  contactsTemplatePath: je,
  escapeHTML: ze,
  getDefaultComposerData: He,
  getActorChoices: We,
  getPlayerChoices: Ye,
  getContacts: Y,
  getGroupContacts: _,
  getRingtoneChoices: ut,
  getSoundPath: re,
  getActiveContactsTab: () => M,
  canEditContactImages: ve,
  bindCallControls: Qe,
  bindComposerControls: Ze,
  bindContactsControls: tt,
  stopRinging: ce,
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
  return ee() ? (h && await h.close(), await ae(), c = new at(e), await c.render(!0), De(c), gt(c.callData), c) : ((a = (t = ui.notifications) == null ? void 0 : t.warn) == null || a.call(t, "You do not have permission to open CyberCall transmissions."), null);
}
async function ae() {
  if (!c) return;
  const e = c;
  c = null, await e.close();
}
function ct(e) {
  var t;
  return !!((t = c == null ? void 0 : c.callData) != null && t.id) && c.callData.id === e;
}
async function it() {
  c && (await c.render(!0), De(c));
}
async function we(e) {
  ct(e) && (c.callData.accepted = !0, c.callData.ringing = !1, ce(), await it());
}
function lt(e) {
  e && (game.socket.emit(R, {
    action: "acceptCall",
    callId: e
  }), we(e));
}
async function Ae(e) {
  var t;
  e && ((t = c == null ? void 0 : c.callData) != null && t.id) && c.callData.id !== e || await ae();
}
function Se(e) {
  game.socket.emit(R, {
    action: "endCall",
    callId: e
  }), Ae(e);
}
async function ot(e) {
  var l, o, s, m, p;
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
  if (!Z())
    return (o = (l = ui.notifications) == null ? void 0 : l.warn) == null || o.call(l, "No GM is connected to receive the CyberCall."), null;
  const t = X(), a = String(((s = game.user) == null ? void 0 : s.avatar) ?? ((p = (m = game.user) == null ? void 0 : m.character) == null ? void 0 : p.img) ?? "").trim(), n = {
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
  }), i = L({
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
    callData: i
  }), I(r);
}
async function $e() {
  var e, t, a;
  return game.user.isGM ? A ? ((a = A.bringToFront) == null || a.call(A), A) : (A = new nt(), await A.render(!0), A) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function Te() {
  var e, t, a, n;
  return ee() ? c ? ((a = c.bringToFront) == null || a.call(c), c) : h ? ((n = h.bringToFront) == null || n.call(h), h) : (h = new rt(), await h.render(!0), h) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function j() {
  h && await h.render(!0);
}
async function ne(e = {}) {
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
async function st(e) {
  var t, a, n;
  if (e && !(Array.isArray(e.targetUserIds) && e.targetUserIds.length && !e.targetUserIds.includes((t = game.user) == null ? void 0 : t.id)) && !(Array.isArray((a = e.callData) == null ? void 0 : a.targetUserIds) && e.callData.targetUserIds.length && !e.callData.targetUserIds.includes((n = game.user) == null ? void 0 : n.id))) {
    if (e.action === "openCall") {
      if (!ee()) return;
      I(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      I(e.callData);
      return;
    }
    if (e.action === "acceptCall") {
      we(e.callId);
      return;
    }
    if (e.action === "endCall") {
      Ae(e.callId);
      return;
    }
    if (e.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const r = T({
        ...e.contact,
        image: ""
      });
      if (!r.name || !r.number) return;
      const i = _();
      i.push(r), await H(i), await j();
      return;
    }
    if (e.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await H(_().filter((r) => r.id !== e.contactId)), await j();
      return;
    }
    e.action === "groupContactsChanged" && (G = Array.isArray(e.contacts) ? e.contacts.map(T) : null, await j());
  }
}
function De(e) {
  var t, a;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((a = e.setPosition) == null || a.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function re() {
  return String(game.settings.get(g, "ringSound") ?? "").trim();
}
function ut() {
  const e = re();
  return Object.entries(fe).map(([t, a]) => ({
    value: t,
    label: a,
    selected: t === e
  }));
}
function ce() {
  if (!N) return;
  const e = N;
  N = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function gt(e) {
  var i;
  if (ce(), !e.ringing) return;
  const t = re();
  if (!t) return;
  const n = 0.65 * Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), r = ((i = foundry == null ? void 0 : foundry.audio) == null ? void 0 : i.AudioHelper) ?? globalThis.AudioHelper;
  r != null && r.play ? r.play({ src: t, volume: n, autoplay: !0, loop: !0 }, !1).then((l) => {
    N = l;
  }).catch((l) => {
    console.warn(`${g} | Unable to play ringing sound.`, l);
  }) : (N = new Audio(t), N.loop = !0, N.volume = n, N.play().catch((l) => {
    console.warn(`${g} | Unable to play ringing sound.`, l);
  }));
}
function Ee() {
  const e = game.modules.get(g);
  e && (e.api = {
    openCall: I,
    closeCall: ae,
    broadcastCall: ne,
    openComposer: $e,
    openContacts: Te,
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
function dt() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: g,
    title: "CyberCall",
    icon: "fa-solid fa-satellite-dish",
    premium: !1,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => {
      var a;
      return (a = game.user) != null && a.isGM ? $e() : Te();
    }
  }), !0) : !1;
}
function mt() {
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
    choices: fe
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
async function pt() {
  const e = game.settings.get(g, "contacts");
  Array.isArray(e) && await game.settings.set(g, "contacts", {
    [W()]: e.map(T)
  });
}
Hooks.once("init", () => {
  mt(), Ee();
});
Hooks.once("ready", async () => {
  await pt(), Ee(), dt(), game.socket.on(R, st), console.log(`${g} | Ready. Use game.modules.get("${g}").api.openCall({...})`);
});
