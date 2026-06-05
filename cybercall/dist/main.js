var Re = Object.defineProperty;
var ke = (e, t, a) => t in e ? Re(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var S = (e, t, a) => ke(e, typeof t != "symbol" ? t + "" : t, a);
function Pe(e, t) {
  return e.image ? `<img src="${t(e.image)}" alt="${t(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${t(e.initials)}</div>`;
}
function ie(e, t) {
  const a = `--cybercall-signal: ${e.signal}%;`, n = e.fullscreen ? "cybercall-broadcast" : "", l = e.ringing ? "cybercall-ringing-panel" : "", i = e.accepted ? "cybercall-connected-panel" : "", c = e.showBroadcast ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>' : "", o = e.accepted ? "" : `
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
    `, u = e.accepted ? "" : `<blockquote>${t(e.message)}</blockquote>`, p = e.accepted || e.outgoing ? '<button type="button" data-cybercall-action="end">End Call</button>' : `
        ${e.canAccept ? '<button type="button" data-cybercall-action="accept">Accept</button>' : ""}
        <button type="button" data-cybercall-action="decline">Decline</button>
        ${c}
      `;
  return `
    <div class="cybercall-panel cybercall-${e.variant} ${n} ${l} ${i}" style="${a}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${o}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${Pe(e, t)}</div>
        ${u}
      </main>
      <footer class="cybercall-actions">
        ${p}
      </footer>
    </div>
  `;
}
function oe(e, t) {
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
function se(e, t) {
  const a = (c, o) => c.length ? c.map((u) => `
        <li>
          <div class="cybercall-contact-avatar">
            ${u.image ? `<img src="${t(u.image)}" alt="">` : `<span>${t(u.initials)}</span>`}
          </div>
          <div class="cybercall-contact-id">
            <strong>${t(u.name)}</strong>
            <span>${t(u.number)}</span>
          </div>
          <div class="cybercall-contact-actions">
            <button type="button" data-cybercall-contact-action="call" data-contact-scope="${o}" data-contact-id="${t(u.id)}">Call</button>
            <button type="button" data-cybercall-contact-action="remove" data-contact-scope="${o}" data-contact-id="${t(u.id)}">Remove</button>
          </div>
        </li>
      `).join("") : '<li class="cybercall-contacts-empty">No contacts stored.</li>', n = e.activeTab !== "group", l = e.activeTab === "group", i = e.canEditContactImages ? '<label>Picture <input type="text" name="image" placeholder="icons/..."></label>' : "";
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
        ${i}
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
}, Ie = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]);
function ge(e) {
  const t = Number(e);
  return Number.isNaN(t) ? v.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function de(e) {
  return String(e).split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var a;
    return (a = t[0]) == null ? void 0 : a.toUpperCase();
  }).join("") || "?";
}
function W() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function M(e = {}) {
  var a;
  const t = {
    ...v,
    ...e,
    id: String(e.id ?? W()),
    callerName: String(e.callerName ?? v.callerName),
    subtitle: String(e.subtitle ?? v.subtitle),
    image: String(e.image ?? v.image),
    message: String(e.message ?? v.message),
    signal: ge(e.signal ?? v.signal),
    variant: Ie.has(e.variant) ? e.variant : v.variant,
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
  return t.initials = de(t.callerName), t.showBroadcast = !!((a = game == null ? void 0 : game.user) != null && a.isGM && t.allowBroadcast), t.isStandard = t.variant === "standard", t.isEmergency = t.variant === "emergency", t.isCorrupted = t.variant === "corrupted", t.isIncoming = !t.accepted, t.kicker = t.outgoing ? "Outgoing CyberCall" : t.fullscreen ? "System-wide Broadcast" : "Incoming CyberCall", t;
}
function R(e = {}) {
  return {
    id: String(e.id ?? W()),
    name: String(e.name ?? "").trim(),
    number: String(e.number ?? "").trim(),
    image: String(e.image ?? e.img ?? "").trim(),
    initials: de(e.name)
  };
}
function Oe(e) {
  var ae, ne, re, ce;
  const {
    moduleId: t,
    templatePath: a,
    composerTemplatePath: n,
    contactsTemplatePath: l,
    escapeHTML: i,
    getDefaultComposerData: c,
    getActorChoices: o,
    getContacts: u,
    getGroupContacts: p,
    getRingtoneChoices: y,
    getSoundPath: w,
    getActiveContactsTab: D,
    canEditContactImages: F,
    bindCallControls: U,
    bindComposerControls: I,
    bindContactsControls: q,
    stopRinging: B,
    clearActiveCall: O,
    clearActiveComposer: V,
    clearActiveContacts: T
  } = e, E = (ne = (ae = foundry == null ? void 0 : foundry.applications) == null ? void 0 : ae.api) == null ? void 0 : ne.ApplicationV2, L = (ce = (re = foundry == null ? void 0 : foundry.applications) == null ? void 0 : re.api) == null ? void 0 : ce.HandlebarsApplicationMixin;
  class $e extends Application {
    constructor(s, d = {}) {
      super(d);
      S(this, "callData");
      this.callData = M(s);
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
        return console.warn(`${t} | Template render failed, using inline fallback.`, d), $(ie(this.callData, i));
      }
    }
    activateListeners(s) {
      super.activateListeners(s), U(this, s);
    }
    async close(s) {
      return O(this), B(), super.close(s);
    }
  }
  class Se extends Application {
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
        return console.warn(`${t} | Composer template render failed, using inline fallback.`, s), $(oe(m, i));
      }
    }
    activateListeners(m) {
      super.activateListeners(m), I(this, m);
    }
    async close(m) {
      return V(this), super.close(m);
    }
  }
  class De extends Application {
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
      const m = u(), s = p(), d = D();
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
        return console.warn(`${t} | Contacts template render failed, using inline fallback.`, s), $(se(m, i));
      }
    }
    activateListeners(m) {
      super.activateListeners(m), q(this, m);
    }
    async close(m) {
      return T(this), super.close(m);
    }
  }
  function Te() {
    var f;
    return !E || !L ? null : (f = class extends L(E) {
      constructor(d, b = {}) {
        super(b);
        S(this, "callData");
        this.callData = M(d);
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
          return le.innerHTML = ie(this.callData, i).trim(), le.content;
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
  function Ee() {
    var f;
    return !E || !L ? null : (f = class extends L(E) {
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
          return h.innerHTML = oe(s, i).trim(), h.content;
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
  function Ne() {
    var f;
    return !E || !L ? null : (f = class extends L(E) {
      async _prepareContext(s) {
        const d = u(), b = p(), h = D();
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
          return h.innerHTML = se(s, i).trim(), h.content;
        }
      }
      _onRender(s, d) {
        var b;
        (b = super._onRender) == null || b.call(this, s, d), q(this);
      }
      async close(s) {
        return T(this), super.close(s);
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
        template: l
      }
    }), f);
  }
  return {
    CyberCallApplication: Te() ?? $e,
    CyberCallComposer: Ee() ?? Se,
    CyberCallContacts: Ne() ?? De
  };
}
const g = "cybercall", P = `module.${g}`, Me = `modules/${g}/templates/cybercall.hbs`, Le = `modules/${g}/templates/cybercall-composer.hbs`, _e = `modules/${g}/templates/cybercall-contacts.hbs`;
let r = null, A = null, C = null, _ = "personal", N = null, G = null;
const me = {
  "": "Silent",
  [`modules/${g}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${g}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${g}/audio/Ringtone3.ogg`]: "Ringtone 3"
};
function Ge(e) {
  var a;
  if ((a = foundry == null ? void 0 : foundry.utils) != null && a.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
function xe() {
  var e, t, a, n, l, i, c, o;
  return M({
    callerName: ((e = r == null ? void 0 : r.callData) == null ? void 0 : e.callerName) ?? v.callerName,
    subtitle: ((t = r == null ? void 0 : r.callData) == null ? void 0 : t.subtitle) ?? v.subtitle,
    image: ((a = r == null ? void 0 : r.callData) == null ? void 0 : a.image) ?? "",
    message: ((n = r == null ? void 0 : r.callData) == null ? void 0 : n.message) ?? v.message,
    signal: ((l = r == null ? void 0 : r.callData) == null ? void 0 : l.signal) ?? game.settings.get(g, "defaultSignal"),
    variant: ((i = r == null ? void 0 : r.callData) == null ? void 0 : i.variant) ?? "standard",
    fullscreen: ((c = r == null ? void 0 : r.callData) == null ? void 0 : c.fullscreen) ?? !1,
    ringing: ((o = r == null ? void 0 : r.callData) == null ? void 0 : o.ringing) ?? !0
  });
}
function Fe() {
  var e;
  return (((e = game.actors) == null ? void 0 : e.contents) ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    img: t.img ?? ""
  })).sort((t, a) => t.name.localeCompare(a.name));
}
function H() {
  const e = game.settings.get(g, "contacts");
  return Array.isArray(e) ? e.map(R).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name)) : [];
}
function x() {
  if (Array.isArray(G))
    return G.map(R).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name));
  const e = game.settings.get(g, "groupContacts");
  return Array.isArray(e) ? e.map(R).filter((t) => t.name && t.number).sort((t, a) => t.name.localeCompare(a.name)) : [];
}
async function pe(e) {
  await game.settings.set(g, "contacts", e.map(R));
}
async function z(e) {
  G = e.map(R), await game.settings.set(g, "groupContacts", G), game.socket.emit(P, {
    action: "groupContactsChanged",
    contacts: G
  });
}
async function Ue(e, t, a = "personal", n = "") {
  var c, o, u, p, y, w;
  const l = R({
    name: e,
    number: t,
    image: be() ? n : ""
  });
  if (!l.name || !l.number) {
    (o = (c = ui.notifications) == null ? void 0 : c.warn) == null || o.call(c, "Contact name and number are required.");
    return;
  }
  if (a === "group" && !game.user.isGM) {
    if (!K()) {
      (p = (u = ui.notifications) == null ? void 0 : u.warn) == null || p.call(u, "A GM must be connected to update group contacts.");
      return;
    }
    game.socket.emit(P, {
      action: "groupContactAdd",
      contact: l
    }), (w = (y = ui.notifications) == null ? void 0 : y.info) == null || w.call(y, "Group contact update sent to the GM.");
    return;
  }
  const i = a === "group" ? x() : H();
  i.push(l), a === "group" ? await z(i) : await pe(i), await j();
}
async function qe(e, t = "personal") {
  var a, n, l, i;
  if (t === "group") {
    if (!game.user.isGM) {
      if (!K()) {
        (n = (a = ui.notifications) == null ? void 0 : a.warn) == null || n.call(a, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(P, {
        action: "groupContactRemove",
        contactId: e
      }), (i = (l = ui.notifications) == null ? void 0 : l.info) == null || i.call(l, "Group contact removal sent to the GM.");
      return;
    }
    await z(x().filter((c) => c.id !== e));
  } else
    await pe(H().filter((c) => c.id !== e));
  await j();
}
function K() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function J(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(g, "minimumRole");
  } catch (a) {
    console.warn(`${g} | Permission setting unavailable, using Player role fallback.`, a);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function be(e = game.user) {
  return !!(e != null && e.isGM);
}
function Q(e, t = null) {
  var a;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (a = e.element) != null && a[0] ? e.element[0] : e.element ?? null;
}
function Be(e, t = null) {
  const a = Q(e, t);
  a && (a.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), a.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), a.classList.toggle("cybercall-connected", e.callData.accepted), a.querySelectorAll("[data-cybercall-action]").forEach((n) => {
    n.addEventListener("click", (l) => {
      const i = l.currentTarget.dataset.cybercallAction;
      if (i === "accept") {
        Xe(e.callData.id);
        return;
      }
      if (i === "broadcast") {
        Z({
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
function Ve(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-composer]");
}
function ue(e) {
  var i;
  const t = new FormData(e), a = (i = game.actors) == null ? void 0 : i.get(t.get("actorId")), n = String(t.get("image") ?? "").trim() || (a == null ? void 0 : a.img) || "", l = String(t.get("callerName") ?? "").trim() || (a == null ? void 0 : a.name) || "UNKNOWN CALLER";
  return M({
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
function Y(e) {
  var n, l;
  const t = (n = e == null ? void 0 : e.elements) == null ? void 0 : n.signal, a = (l = e == null ? void 0 : e.querySelector) == null ? void 0 : l.call(e, "[data-cybercall-signal-output]");
  !t || !a || (a.textContent = `${ge(t.value)}%`);
}
function je(e, t = null) {
  var i, c;
  const a = Q(e, t), n = Ve(a);
  if (!a || !n) return;
  Y(n);
  const l = a.querySelector("[data-cybercall-ringtone]");
  l && l.addEventListener("change", async (o) => {
    await game.settings.set(g, "ringSound", o.currentTarget.value);
  }), (i = n.elements.signal) == null || i.addEventListener("input", () => Y(n)), (c = n.elements.actorId) == null || c.addEventListener("change", () => {
    var u;
    const o = (u = game.actors) == null ? void 0 : u.get(n.elements.actorId.value);
    o && (n.elements.callerName.value = o.name, n.elements.image.value = o.img ?? "");
  }), n.addEventListener("submit", (o) => {
    o.preventDefault(), k(ue(n));
  }), a.querySelectorAll("[data-cybercall-compose-action]").forEach((o) => {
    o.addEventListener("click", async (u) => {
      var w, D, F, U, I, q, B;
      const p = u.currentTarget.dataset.cybercallComposeAction, y = ue(n);
      if (p === "preview") {
        await k(y);
        return;
      }
      if (p === "broadcast") {
        await Z(y);
        return;
      }
      if (p === "close-active") {
        Ce((w = r == null ? void 0 : r.callData) == null ? void 0 : w.id);
        return;
      }
      if (p === "browse-image") {
        const O = n.elements.image, V = globalThis.FilePicker ?? ((U = (F = (D = globalThis.foundry) == null ? void 0 : D.applications) == null ? void 0 : F.apps) == null ? void 0 : U.FilePicker);
        if (!O || !V) {
          (q = (I = ui.notifications) == null ? void 0 : I.warn) == null || q.call(I, "Foundry FilePicker is unavailable.");
          return;
        }
        const T = new V({
          type: "image",
          current: O.value,
          callback: (E) => {
            O.value = E, O.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof T.browse == "function" ? T.browse() : (B = T.render) == null || B.call(T, !0);
        return;
      }
      p === "reset" && (n.reset(), Y(n));
    });
  });
}
function ze(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function He(e, t = null) {
  const a = Q(e, t), n = ze(a);
  if (!a || !n) return;
  n.addEventListener("submit", async (i) => {
    var u;
    i.preventDefault();
    const c = new FormData(n), o = String(c.get("scope") ?? _);
    await Ue(c.get("name"), c.get("number"), o, c.get("image")), n.reset(), n.elements.scope.value = o, (u = n.elements.name) == null || u.focus();
  }), a.querySelectorAll("[data-cybercall-contact-tab]").forEach((i) => {
    i.addEventListener("click", (c) => {
      _ = c.currentTarget.dataset.cybercallContactTab, a.querySelectorAll("[data-cybercall-contact-tab]").forEach((o) => {
        o.classList.toggle("active", o.dataset.cybercallContactTab === _);
      }), a.querySelectorAll("[data-cybercall-contact-panel]").forEach((o) => {
        o.hidden = o.dataset.cybercallContactPanel !== _;
      }), n.elements.scope && (n.elements.scope.value = _);
    });
  });
  const l = a.querySelector("[data-cybercall-ringtone]");
  l && l.addEventListener("change", async (i) => {
    await game.settings.set(g, "ringSound", i.currentTarget.value);
  }), a.querySelectorAll("[data-cybercall-contact-action]").forEach((i) => {
    i.addEventListener("click", async (c) => {
      const o = c.currentTarget.dataset.cybercallContactAction, u = c.currentTarget.dataset.contactId, p = c.currentTarget.dataset.contactScope ?? "personal", w = (p === "group" ? x() : H()).find((D) => D.id === u);
      if (o === "remove") {
        await qe(u, p);
        return;
      }
      o === "call" && w && await Ze(w) && C === e && await e.close();
    });
  });
}
const { CyberCallApplication: Ye, CyberCallComposer: We, CyberCallContacts: Ke } = Oe({
  moduleId: g,
  templatePath: Me,
  composerTemplatePath: Le,
  contactsTemplatePath: _e,
  escapeHTML: Ge,
  getDefaultComposerData: xe,
  getActorChoices: Fe,
  getContacts: H,
  getGroupContacts: x,
  getRingtoneChoices: tt,
  getSoundPath: ee,
  getActiveContactsTab: () => _,
  canEditContactImages: be,
  bindCallControls: Be,
  bindComposerControls: je,
  bindContactsControls: He,
  stopRinging: te,
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
  return J() ? (C && await C.close(), await X(), r = new Ye(e), await r.render(!0), we(r), at(r.callData), r) : ((a = (t = ui.notifications) == null ? void 0 : t.warn) == null || a.call(t, "You do not have permission to open CyberCall transmissions."), null);
}
async function X() {
  if (!r) return;
  const e = r;
  r = null, await e.close();
}
function Je(e) {
  var t;
  return !!((t = r == null ? void 0 : r.callData) != null && t.id) && r.callData.id === e;
}
async function Qe() {
  r && (await r.render(!0), we(r));
}
async function fe(e) {
  Je(e) && (r.callData.accepted = !0, r.callData.ringing = !1, te(), await Qe());
}
function Xe(e) {
  e && (game.socket.emit(P, {
    action: "acceptCall",
    callId: e
  }), fe(e));
}
async function ye(e) {
  var t;
  e && ((t = r == null ? void 0 : r.callData) != null && t.id) && r.callData.id !== e || await X();
}
function Ce(e) {
  game.socket.emit(P, {
    action: "endCall",
    callId: e
  }), ye(e);
}
async function Ze(e) {
  var c, o, u, p, y;
  if (game.user.isGM)
    return k({
      callerName: e.name,
      subtitle: `Comms ${e.number}`,
      image: e.image,
      message: `Opening channel ${e.number}...`,
      signal: game.settings.get(g, "defaultSignal"),
      variant: "standard",
      ringing: !1
    });
  if (!K())
    return (o = (c = ui.notifications) == null ? void 0 : c.warn) == null || o.call(c, "No GM is connected to receive the CyberCall."), null;
  const t = W(), a = String(((u = game.user) == null ? void 0 : u.avatar) ?? ((y = (p = game.user) == null ? void 0 : p.character) == null ? void 0 : y.img) ?? "").trim(), n = {
    id: t,
    signal: game.settings.get(g, "defaultSignal"),
    variant: "standard",
    fullscreen: !1,
    accepted: !1,
    allowBroadcast: !1,
    callerUserId: game.user.id,
    contactNumber: e.number
  }, l = M({
    ...n,
    callerName: e.name,
    subtitle: `Comms ${e.number}`,
    image: e.image,
    message: `Awaiting connection to ${e.name} on ${e.number}...`,
    canAccept: !1,
    canDecline: !1,
    outgoing: !0,
    ringing: !0
  }), i = M({
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
    callData: i
  }), k(l);
}
async function he() {
  var e, t, a;
  return game.user.isGM ? A ? ((a = A.bringToFront) == null || a.call(A), A) : (A = new We(), await A.render(!0), A) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function ve() {
  var e, t, a, n;
  return J() ? r ? ((a = r.bringToFront) == null || a.call(r), r) : C ? ((n = C.bringToFront) == null || n.call(C), C) : (C = new Ke(), await C.render(!0), C) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function j() {
  C && await C.render(!0);
}
async function Z(e = {}) {
  var a, n;
  if (!game.user.isGM)
    return (n = (a = ui.notifications) == null ? void 0 : a.warn) == null || n.call(a, "Only the GM can broadcast CyberCalls to all players."), null;
  const t = M({
    ...e,
    fullscreen: e.fullscreen ?? !0,
    ringing: !0
  });
  return game.socket.emit(P, {
    action: "openCall",
    callData: t
  }), k({ ...t, outgoing: !0 });
}
async function et(e) {
  if (e) {
    if (e.action === "openCall") {
      if (!J()) return;
      k(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      k(e.callData);
      return;
    }
    if (e.action === "acceptCall") {
      fe(e.callId);
      return;
    }
    if (e.action === "endCall") {
      ye(e.callId);
      return;
    }
    if (e.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const t = R({
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
    e.action === "groupContactsChanged" && (G = Array.isArray(e.contacts) ? e.contacts.map(R) : null, await j());
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
function ee() {
  return String(game.settings.get(g, "ringSound") ?? "").trim();
}
function tt() {
  const e = ee();
  return Object.entries(me).map(([t, a]) => ({
    value: t,
    label: a,
    selected: t === e
  }));
}
function te() {
  if (!N) return;
  const e = N;
  N = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function at(e) {
  var i;
  if (te(), !e.ringing) return;
  const t = ee();
  if (!t) return;
  const n = 0.65 * Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), l = ((i = foundry == null ? void 0 : foundry.audio) == null ? void 0 : i.AudioHelper) ?? globalThis.AudioHelper;
  l != null && l.play ? l.play({ src: t, volume: n, autoplay: !0, loop: !0 }, !1).then((c) => {
    N = c;
  }).catch((c) => {
    console.warn(`${g} | Unable to play ringing sound.`, c);
  }) : (N = new Audio(t), N.loop = !0, N.volume = n, N.play().catch((c) => {
    console.warn(`${g} | Unable to play ringing sound.`, c);
  }));
}
function Ae() {
  const e = game.modules.get(g);
  e && (e.api = {
    openCall: k,
    closeCall: X,
    broadcastCall: Z,
    openComposer: he,
    openContacts: ve,
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
function nt() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: g,
    title: "CyberCall",
    icon: "fa-solid fa-satellite-dish",
    premium: !1,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => {
      var a;
      return (a = game.user) != null && a.isGM ? he() : ve();
    }
  }), !0) : !1;
}
function rt() {
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
    default: v.signal,
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
    choices: me
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
    hint: "Player contact directory stored locally for this client.",
    scope: "client",
    config: !1,
    type: Object,
    default: []
  }), game.settings.register(g, "groupContacts", {
    name: "CyberCall Group Contacts",
    hint: "Shared group contact directory for all players in this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: []
  });
}
Hooks.once("init", () => {
  rt(), Ae();
});
Hooks.once("ready", () => {
  Ae(), nt(), game.socket.on(P, et), console.log(`${g} | Ready. Use game.modules.get("${g}").api.openCall({...})`);
});
