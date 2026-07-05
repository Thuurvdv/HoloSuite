var Gt = Object.defineProperty;
var Et = (e, t, n) => t in e ? Gt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var S = (e, t, n) => Et(e, typeof t != "symbol" ? t + "" : t, n);
function kt(e, t) {
  return e.image ? `<img src="${t(e.image)}" alt="${t(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${t(e.initials)}</div>`;
}
function We(e, t) {
  const n = `--cybercall-signal: ${e.signal}%;`, a = e.fullscreen ? "cybercall-broadcast" : "", c = e.ringing ? "cybercall-ringing-panel" : "", s = e.accepted ? "cybercall-connected-panel" : "", l = e.showBroadcast ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>' : "", i = e.accepted ? "" : `
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
    `, o = e.accepted ? "" : `<blockquote>${t(e.message)}</blockquote>`, d = e.accepted || e.outgoing ? '<button type="button" data-cybercall-action="end">End Call</button>' : `
        ${e.canAccept ? '<button type="button" data-cybercall-action="accept">Accept</button>' : ""}
        <button type="button" data-cybercall-action="decline">Decline</button>
        ${l}
      `;
  return `
    <div class="cybercall-panel cybercall-${e.variant} ${a} ${c} ${s}" style="${n}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${i}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${kt(e, t)}</div>
        ${o}
      </main>
      <footer class="cybercall-actions">
        ${d}
      </footer>
    </div>
  `;
}
function ve(e, t) {
  const n = e.call;
  return `
    <form class="cybercall-composer" data-cybercall-composer>
      <nav class="cybercall-mode-tabs">
        <button type="button" class="active" data-cybercall-mode-tab="calls">Calls</button>
        <button type="button" data-cybercall-compose-action="open-messages" data-cybercall-mode-tab="messages">Messages</button>
      </nav>
      <label>Actor Portrait
        <select name="actorId">
          <option value="">Manual / no actor</option>
          ${e.actors.map((c) => `<option value="${t(c.id)}">${t(c.name)}</option>`).join("")}
        </select>
      </label>
      <label>Caller Name <input type="text" name="callerName" value="${t(n.callerName)}"></label>
      <label>Subtitle / Faction <input type="text" name="subtitle" value="${t(n.subtitle)}"></label>
      <label>Portrait Image Path <span class="cybercall-composer-path-row"><input type="text" name="image" value="${t(n.image)}"><button type="button" data-cybercall-compose-action="browse-image">Browse</button></span></label>
      <label>Message <textarea name="message" rows="5">${t(n.message)}</textarea></label>
      <label>Signal <input type="range" name="signal" min="0" max="100" value="${n.signal}"></label>
      <label>Variant
        <select name="variant">
          <option value="standard" ${n.variant === "standard" ? "selected" : ""}>Standard Blue</option>
          <option value="emergency" ${n.variant === "emergency" ? "selected" : ""}>Emergency Red</option>
          <option value="corrupted" ${n.variant === "corrupted" ? "selected" : ""}>Corrupted Green</option>
        </select>
      </label>
      <label><input type="checkbox" name="fullscreen" ${n.fullscreen ? "checked" : ""}> Fullscreen Broadcast</label>
      <label><input type="checkbox" name="ringing" ${n.ringing ? "checked" : ""}> Ringing Animation / Sound</label>
      <div class="cybercall-composer-ringtone">
        <label class="cybercall-ringtone-select">
          <span>Ringtone</span>
          <select data-cybercall-ringtone>
            ${(e.ringtoneChoices ?? []).map(
    (c) => `<option value="${t(c.value)}" ${c.selected ? "selected" : ""}>${t(c.label)}</option>`
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
function Ae(e, t) {
  const n = (o, d) => o.length ? o.map((r) => `
        <li>
          <div class="cybercall-contact-avatar">
            ${r.image ? `<img src="${t(r.image)}" alt="">` : `<span>${t(r.initials)}</span>`}
          </div>
          <div class="cybercall-contact-id">
            <strong>${t(r.name)}</strong>
            <span>${t(r.number)}</span>
          </div>
          <div class="cybercall-contact-actions">
            <button type="button" data-cybercall-contact-action="call" data-contact-scope="${d}" data-contact-id="${t(r.id)}">Call</button>
            <button type="button" data-cybercall-contact-action="message" data-contact-scope="${d}" data-contact-id="${t(r.id)}">Message</button>
            <button type="button" data-cybercall-contact-action="remove" data-contact-scope="${d}" data-contact-id="${t(r.id)}">Remove</button>
          </div>
        </li>
      `).join("") : '<li class="cybercall-contacts-empty">No contacts stored.</li>', a = e.activeTab !== "group", c = e.activeTab === "group", s = (e.actors ?? []).map((o) => `<option value="${t(o.id)}">${t(o.name)}</option>`).join(""), l = e.canEditContactImages ? `
        <label>Actor
          <select name="actorId">
            <option value="">No linked actor</option>
            ${s}
          </select>
        </label>
        <label>Picture <input type="text" name="image" placeholder="icons/..."></label>
        <label class="cybercall-contact-toggle"><input type="checkbox" name="managedByGM"> <span>GM replies as contact</span></label>
      ` : "";
  return `
    <section class="cybercall-contacts">
      <header class="cybercall-contacts-header">
        <div>
          <div class="cybercall-contacts-kicker">Personal Comms Directory</div>
          <h2>CyberCall Contacts${e.hasUnreadMessages ? ` <span class="cybercall-unread-label">${t(e.unreadMessageCount)}</span>` : ""}</h2>
        </div>
      </header>
      <nav class="cybercall-mode-tabs">
        <button type="button" class="active" data-cybercall-mode-tab="calls">Calls</button>
        <button type="button" data-cybercall-open-messages data-cybercall-mode-tab="messages">Messages</button>
      </nav>
      <nav class="cybercall-contact-tabs">
        <button type="button" class="${a ? "active" : ""}" data-cybercall-contact-tab="personal">Personal</button>
        <button type="button" class="${c ? "active" : ""}" data-cybercall-contact-tab="group">Group</button>
      </nav>
      <section data-cybercall-contact-panel="personal" ${a ? "" : "hidden"}>
        <ul class="cybercall-contacts-list">${n(e.contacts, "personal")}</ul>
      </section>
      <section data-cybercall-contact-panel="group" ${c ? "" : "hidden"}>
        <ul class="cybercall-contacts-list">${n(e.groupContacts, "group")}</ul>
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
    (o) => `<option value="${t(o.value)}" ${o.selected ? "selected" : ""}>${t(o.label)}</option>`
  ).join("")}
          </select>
        </label>
      </footer>
    </section>
  `;
}
function Se(e, t) {
  var C;
  const n = e.threads ?? [], a = e.activeThread ?? null, c = e.allContacts ?? [], s = n.length ? n.map((p) => `
        <button type="button" class="cybercall-thread ${p.active ? "active" : ""}" data-cybercall-thread-id="${t(p.id)}">
          <span class="cybercall-thread-initials">${t(p.initials)}</span>
          <span class="cybercall-thread-body">
            <strong>${t(p.title)}</strong>
            <small>${t(p.lastPreview)}</small>
          </span>
          ${p.unread ? `<span class="cybercall-thread-unread">${p.unreadCount}</span>` : ""}
        </button>
      `).join("") : '<div class="cybercall-messages-empty">No messages yet.</div>', l = c.map((p) => `<option value="${t(p.id)}" ${e.selectedContactId === p.id ? "selected" : ""}>${t(p.name)} - ${t(p.number)}</option>`).join(""), i = e.canReplyAs ? `
      <label>
        <span>Reply As</span>
        <select name="replyAs">
          ${(e.replyAsChoices ?? []).map(
    (p) => `<option value="${t(p.id)}" ${p.selected ? "selected" : ""}>${t(p.label)}</option>`
  ).join("")}
        </select>
      </label>
    ` : "", o = e.canSendAs ? `
      <label>
        <span>Send As</span>
        <select name="sendAs">
          ${(e.sendAsChoices ?? []).map(
    (p) => `<option value="${t(p.id)}" ${p.selected ? "selected" : ""}>${t(p.label)}</option>`
  ).join("")}
        </select>
      </label>
    ` : "", d = e.isThreadReply ? `
      <div class="cybercall-thread-reply-target">
        <span>To</span>
        <strong>${t(e.threadReplyLabel ?? "")}</strong>
      </div>
    ` : `
      <label>
        <span>To</span>
        <select name="contactId" ${c.length ? "" : "disabled"}>
          ${l}
        </select>
      </label>
    `, r = (C = a == null ? void 0 : a.messages) != null && C.length ? a.messages.map((p) => `
        <article class="cybercall-message ${p.isMine ? "mine" : ""} ${p.isEvent ? "event" : ""}">
          <strong>${t(p.senderName)}</strong>
          <p>${t(p.body)}</p>
          <time>${t(p.createdAtLabel ?? p.createdAt)}</time>
        </article>
      `).join("") : '<div class="cybercall-messages-empty">Select a thread or send a new message.</div>';
  return `
    <section class="cybercall-messages ${e.isFoundryV13Plus ? "cybercall-modern-messages" : ""}" data-cybercall-active-thread="${t(e.activeThreadId ?? "")}">
      <nav class="cybercall-mode-tabs">
        <button type="button" data-cybercall-message-action="open-calls" data-cybercall-mode-tab="calls">Calls</button>
        <button type="button" class="active" data-cybercall-mode-tab="messages">Messages</button>
      </nav>
      <aside class="cybercall-thread-list">
        <header>
          <h2>Messages</h2>
          <div class="cybercall-message-header-actions">
            <button type="button" data-cybercall-message-action="new">New</button>
            <button type="button" data-cybercall-message-action="refresh">Refresh</button>
          </div>
        </header>
        ${s}
      </aside>
      <main class="cybercall-conversation">
        <header>
          <div>
            <div class="cybercall-contacts-kicker">${a ? t(a.subtitle) : "Secure Channel"}</div>
            <h3>${a ? t(a.title) : "New Message"}</h3>
          </div>
          ${e.canDeleteThread ? '<button type="button" class="cybercall-delete-thread" data-cybercall-message-action="delete-thread">Delete Thread</button>' : ""}
        </header>
        <div class="cybercall-message-log">${r}</div>
        <form class="cybercall-message-form ${e.canReplyAs ? "has-reply-as" : ""} ${e.canSendAs ? "has-send-as" : ""}" data-cybercall-message-form>
          ${d}
          ${i}
          ${o}
          <textarea name="body" rows="3" placeholder="Type message..." required></textarea>
          <button type="submit" ${c.length ? "" : "disabled"}>Send</button>
        </form>
      </main>
    </section>
  `;
}
const U = {
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
}, Ut = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]);
function Ze(e) {
  const t = Number(e);
  return Number.isNaN(t) ? U.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function H(e) {
  return String(e).split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var n;
    return (n = t[0]) == null ? void 0 : n.toUpperCase();
  }).join("") || "?";
}
function he() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Q(e = {}) {
  var c;
  const t = Array.isArray(e.targetUserIds) ? e.targetUserIds.map((s) => String(s)).filter(Boolean) : [], n = Array.isArray(e.targetUserNames) ? e.targetUserNames.map((s) => String(s)).filter(Boolean) : [], a = {
    ...U,
    ...e,
    id: String(e.id ?? he()),
    callerName: String(e.callerName ?? U.callerName),
    subtitle: String(e.subtitle ?? U.subtitle),
    image: String(e.image ?? U.image),
    message: String(e.message ?? U.message),
    signal: Ze(e.signal ?? U.signal),
    variant: Ut.has(e.variant) ? e.variant : U.variant,
    fullscreen: !!(e.fullscreen ?? U.fullscreen),
    ringing: e.ringing !== !1 && e.accepted !== !0,
    accepted: e.accepted === !0,
    canAccept: e.canAccept !== !1,
    canDecline: e.canDecline !== !1,
    allowBroadcast: e.allowBroadcast !== !1,
    outgoing: e.outgoing === !0,
    callerUserId: String(e.callerUserId ?? ""),
    contactNumber: String(e.contactNumber ?? ""),
    targetUserIds: t,
    targetUserNames: n
  };
  return a.initials = H(a.callerName), a.showBroadcast = !!((c = game == null ? void 0 : game.user) != null && c.isGM && a.allowBroadcast), a.isStandard = a.variant === "standard", a.isEmergency = a.variant === "emergency", a.isCorrupted = a.variant === "corrupted", a.isIncoming = !a.accepted, a.hasTargets = a.targetUserIds.length > 0, a.recipientLabel = a.hasTargets ? a.targetUserNames.join(", ") : "All players", a.directionLabel = a.outgoing ? `Calling ${a.recipientLabel}` : `From ${a.callerName}`, a.kicker = a.outgoing ? "Outgoing CyberCall" : a.fullscreen ? "System-wide Broadcast" : "Incoming CyberCall", a;
}
function E(e = {}) {
  const t = Array.isArray(e.userIds) ? e.userIds.map((n) => String(n)).filter(Boolean) : e.userId ? [String(e.userId)] : [];
  return {
    id: String(e.id ?? he()),
    name: String(e.name ?? "").trim(),
    number: String(e.number ?? "").trim(),
    image: String(e.image ?? e.img ?? "").trim(),
    actorId: String(e.actorId ?? "").trim(),
    userId: String(e.userId ?? t[0] ?? "").trim(),
    userIds: t,
    managedByGM: e.managedByGM === !0,
    isNpc: e.isNpc === !0 || !!e.actorId || e.managedByGM === !0,
    initials: H(e.name)
  };
}
function Pt() {
  var t, n, a;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((a = game == null ? void 0 : game.release) == null ? void 0 : a.generation));
  return Number.isFinite(e) ? e : null;
}
function Rt() {
  const e = Pt();
  return e === null || e >= 13;
}
function Bt() {
  var n, a, c, s, l, i;
  const e = ((a = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : a.api) ?? ((c = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : c.api) ?? null, t = ((l = (s = globalThis.foundry) == null ? void 0 : s.applications) == null ? void 0 : l.api) ?? ((i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function Dt(e) {
  var Ve, qe, je, ze;
  const {
    moduleId: t,
    templatePath: n,
    composerTemplatePath: a,
    contactsTemplatePath: c,
    messagesTemplatePath: s,
    phoneTemplatePath: l,
    escapeHTML: i,
    getDefaultComposerData: o,
    getActorChoices: d,
    getPlayerChoices: r,
    getContacts: C,
    getGroupContacts: p,
    getMessageContext: w,
    getRingtoneChoices: A,
    getSoundPath: h,
    getActiveContactsTab: T,
    canEditContactImages: V,
    bindCallControls: O,
    bindComposerControls: x,
    bindContactsControls: D,
    bindMessagesControls: q,
    stopRinging: ae,
    clearActiveCall: re,
    clearActiveComposer: se,
    clearActiveContacts: ie,
    clearActiveMessages: ce,
    clearActivePhone: oe
  } = e, P = (qe = (Ve = foundry == null ? void 0 : foundry.applications) == null ? void 0 : Ve.api) == null ? void 0 : qe.ApplicationV2, R = (ze = (je = foundry == null ? void 0 : foundry.applications) == null ? void 0 : je.api) == null ? void 0 : ze.HandlebarsApplicationMixin, j = Bt(), G = Rt();
  function k() {
    const y = C(), f = p(), u = T();
    return {
      contacts: y,
      groupContacts: f,
      hasContacts: y.length > 0,
      hasGroupContacts: f.length > 0,
      activeTab: u,
      isPersonalTab: u !== "group",
      isGroupTab: u === "group",
      canEditContactImages: V(),
      canManageNpcContacts: V(),
      actors: d(),
      unreadMessageCount: w().unreadCount,
      hasUnreadMessages: w().unreadCount > 0,
      ringtoneChoices: A(),
      currentRingtone: h()
    };
  }
  function ht() {
    return {
      call: o(),
      actors: d(),
      players: r(),
      ringtoneChoices: A()
    };
  }
  function xe(y, f = null) {
    var Ke, Ye;
    const u = y === "messages", m = !u && ((Ke = game.user) == null ? void 0 : Ke.isGM), I = !u && !((Ye = game.user) != null && Ye.isGM);
    return {
      ...u ? w(f) : m ? ht() : k(),
      mode: y,
      isMessagesMode: u,
      isComposerMode: m,
      isContactsMode: I,
      isCallsMode: !u
    };
  }
  function Le(y, f) {
    var u;
    return y === "messages" ? Se(f, i) : (u = game.user) != null && u.isGM ? ve(f, i) : Ae(f, i);
  }
  function le(y) {
    const f = document.createElement("template");
    f.innerHTML = y.trim();
    const u = f.content.firstElementChild;
    return {
      main: u instanceof HTMLElement ? u : document.createElement("div")
    };
  }
  function Fe(y, f = null) {
    var u;
    if (y.mode === "messages") {
      q(y, f);
      return;
    }
    (u = game.user) != null && u.isGM ? x(y, f) : D(y, f);
  }
  class Ct extends j {
    constructor(u, m = {}) {
      super(m);
      S(this, "callData");
      this.callData = Q(u);
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-overlay",
        title: "CyberCall",
        template: n,
        classes: ["cybercall-app"],
        popOut: !0,
        resizable: !0,
        width: 440,
        height: 460
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
      } catch (m) {
        return console.warn(`${t} | Template render failed, using inline fallback.`, m), $(We(this.callData, i));
      }
    }
    activateListeners(u) {
      super.activateListeners(u), O(this, u);
    }
    async close(u) {
      return re(this), ae(), super.close(u);
    }
  }
  class It extends j {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-composer",
        title: "CyberCall Composer",
        template: a,
        classes: ["cybercall-composer-app"],
        popOut: !0,
        resizable: !0,
        width: 560,
        height: 560
      });
    }
    getData() {
      return {
        call: o(),
        actors: d(),
        players: r(),
        ringtoneChoices: A()
      };
    }
    async _renderInner(f) {
      try {
        return await super._renderInner(f);
      } catch (u) {
        return console.warn(`${t} | Composer template render failed, using inline fallback.`, u), $(ve(f, i));
      }
    }
    activateListeners(f) {
      super.activateListeners(f), x(this, f);
    }
    async close(f) {
      return se(this), super.close(f);
    }
  }
  class wt extends j {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-contacts",
        title: "CyberCall Contacts",
        template: c,
        classes: ["cybercall-contacts-app"],
        popOut: !0,
        resizable: !0,
        width: 500,
        height: 620
      });
    }
    getData() {
      return k();
    }
    async _renderInner(f) {
      try {
        return await super._renderInner(f);
      } catch (u) {
        return console.warn(`${t} | Contacts template render failed, using inline fallback.`, u), $(Ae(f, i));
      }
    }
    activateListeners(f) {
      super.activateListeners(f), D(this, f);
    }
    async close(f) {
      return ie(this), super.close(f);
    }
  }
  class vt extends j {
    constructor(u = "calls", m = null, I = {}) {
      super(I);
      S(this, "mode");
      S(this, "contact");
      this.mode = u, this.contact = m;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-phone",
        title: "CyberCall",
        template: l,
        classes: ["cybercall-phone-app"],
        popOut: !0,
        resizable: !0,
        width: 720,
        height: 640
      });
    }
    getData() {
      return xe(this.mode, this.contact);
    }
    async _renderInner(u) {
      try {
        return await super._renderInner(u);
      } catch (m) {
        return console.warn(`${t} | Phone template render failed, using inline fallback.`, m), $(Le(this.mode, u));
      }
    }
    activateListeners(u) {
      super.activateListeners(u), Fe(this, u);
    }
    async close(u) {
      return oe(this), super.close(u);
    }
  }
  class At extends j {
    constructor(u = null, m = {}) {
      super(m);
      S(this, "contact");
      this.contact = u;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-messages",
        title: "CyberCall Messages",
        template: s,
        classes: ["cybercall-messages-app"],
        popOut: !0,
        resizable: !0,
        width: 720,
        height: 640
      });
    }
    getData() {
      return w(this.contact);
    }
    async _renderInner(u) {
      try {
        return await super._renderInner(u);
      } catch (m) {
        return console.warn(`${t} | Messages template render failed, using inline fallback.`, m), $(Se(u, i));
      }
    }
    activateListeners(u) {
      super.activateListeners(u), q(this, u);
    }
    async close(u) {
      return ce(this), super.close(u);
    }
  }
  function St() {
    var y;
    return !G || !P || !R ? null : (y = class extends R(P) {
      constructor(m, I = {}) {
        super(I);
        S(this, "callData");
        this.callData = Q(m);
      }
      async _prepareContext(m) {
        return {
          ...await super._prepareContext(m),
          call: this.callData
        };
      }
      async _renderHTML(m, I) {
        try {
          return await super._renderHTML(m, I);
        } catch (M) {
          return console.warn(`${t} | Template render failed, using inline fallback.`, M), le(We(this.callData, i));
        }
      }
      _onRender(m, I) {
        var M;
        (M = super._onRender) == null || M.call(this, m, I), O(this);
      }
      async close(m) {
        return re(this), ae(), super.close(m);
      }
    }, S(y, "DEFAULT_OPTIONS", {
      id: "cybercall-overlay",
      tag: "section",
      classes: ["cybercall-app"],
      window: {
        title: "CyberCall",
        resizable: !0
      },
      position: {
        width: 440,
        height: 460
      }
    }), S(y, "PARTS", {
      main: {
        template: n
      }
    }), y);
  }
  function $t() {
    var y;
    return !G || !P || !R ? null : (y = class extends R(P) {
      async _prepareContext(u) {
        return {
          ...await super._prepareContext(u),
          call: o(),
          actors: d(),
          players: r(),
          ringtoneChoices: A()
        };
      }
      async _renderHTML(u, m) {
        try {
          return await super._renderHTML(u, m);
        } catch (I) {
          return console.warn(`${t} | Composer template render failed, using inline fallback.`, I), le(ve(u, i));
        }
      }
      _onRender(u, m) {
        var I;
        (I = super._onRender) == null || I.call(this, u, m), x(this);
      }
      async close(u) {
        return se(this), super.close(u);
      }
    }, S(y, "DEFAULT_OPTIONS", {
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
    }), S(y, "PARTS", {
      main: {
        template: a
      }
    }), y);
  }
  function Nt() {
    var y;
    return !G || !P || !R ? null : (y = class extends R(P) {
      async _prepareContext(u) {
        return {
          ...await super._prepareContext(u),
          ...k()
        };
      }
      async _renderHTML(u, m) {
        try {
          return await super._renderHTML(u, m);
        } catch (I) {
          return console.warn(`${t} | Contacts template render failed, using inline fallback.`, I), le(Ae(u, i));
        }
      }
      _onRender(u, m) {
        var I;
        (I = super._onRender) == null || I.call(this, u, m), D(this);
      }
      async close(u) {
        return ie(this), super.close(u);
      }
    }, S(y, "DEFAULT_OPTIONS", {
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
    }), S(y, "PARTS", {
      main: {
        template: c
      }
    }), y);
  }
  function Mt() {
    var y;
    return !G || !P || !R ? null : (y = class extends R(P) {
      constructor(m = "calls", I = null, M = {}) {
        super(M);
        S(this, "mode");
        S(this, "contact");
        this.mode = m, this.contact = I;
      }
      async _prepareContext(m) {
        return {
          ...await super._prepareContext(m),
          ...xe(this.mode, this.contact)
        };
      }
      async _renderHTML(m, I) {
        try {
          return await super._renderHTML(m, I);
        } catch (M) {
          return console.warn(`${t} | Phone template render failed, using inline fallback.`, M), le(Le(this.mode, m));
        }
      }
      _onRender(m, I) {
        var M;
        (M = super._onRender) == null || M.call(this, m, I), Fe(this);
      }
      async close(m) {
        return oe(this), super.close(m);
      }
    }, S(y, "DEFAULT_OPTIONS", {
      id: "cybercall-phone",
      tag: "section",
      classes: ["cybercall-phone-app"],
      window: {
        title: "CyberCall",
        resizable: !0
      },
      position: {
        width: 720,
        height: 640
      }
    }), S(y, "PARTS", {
      main: {
        template: l
      }
    }), y);
  }
  function Tt() {
    var y;
    return !G || !P || !R ? null : (y = class extends R(P) {
      constructor(m = null, I = {}) {
        super(I);
        S(this, "contact");
        this.contact = m;
      }
      async _prepareContext(m) {
        return {
          ...await super._prepareContext(m),
          ...w(this.contact)
        };
      }
      async _renderHTML(m, I) {
        try {
          return await super._renderHTML(m, I);
        } catch (M) {
          return console.warn(`${t} | Messages template render failed, using inline fallback.`, M), le(Se(m, i));
        }
      }
      _onRender(m, I) {
        var M;
        (M = super._onRender) == null || M.call(this, m, I), q(this);
      }
      async close(m) {
        return ce(this), super.close(m);
      }
    }, S(y, "DEFAULT_OPTIONS", {
      id: "cybercall-messages",
      tag: "section",
      classes: ["cybercall-messages-app"],
      window: {
        title: "CyberCall Messages",
        resizable: !0
      },
      position: {
        width: 720,
        height: 640
      }
    }), S(y, "PARTS", {
      main: {
        template: s
      }
    }), y);
  }
  return {
    CyberCallApplication: St() ?? Ct,
    CyberCallComposer: $t() ?? It,
    CyberCallContacts: Nt() ?? wt,
    CyberCallMessages: Tt() ?? At,
    CyberCallPhone: Mt() ?? vt
  };
}
const b = "cybercall", W = `module.${b}`, Ot = `modules/${b}/templates/cybercall.hbs`, _t = `modules/${b}/templates/cybercall-composer.hbs`, xt = `modules/${b}/templates/cybercall-contacts.hbs`, Lt = `modules/${b}/templates/cybercall-messages.hbs`, Ft = `modules/${b}/templates/cybercall-phone.hbs`, be = "phoneMessage", He = 1, et = {
  "": "Silent",
  [`modules/${b}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${b}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${b}/audio/Ringtone3.ogg`]: "Ringtone 3"
};
function X(e) {
  var n;
  if ((n = foundry == null ? void 0 : foundry.utils) != null && n.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
function N(e, t = "") {
  return String(e ?? t).trim();
}
function $e(e) {
  return [...new Set(e.map((t) => N(t)).filter(Boolean))];
}
function Vt() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function Je(e, t) {
  return ["direct", ...[e, t].sort()].join(":");
}
function qt() {
  return `msg-${he()}`;
}
function me(e, t = ((n) => (n = game == null ? void 0 : game.user) == null ? void 0 : n.id)()) {
  const a = E(e);
  if (e != null && e.userId)
    return Je(`user:${N(t, "unknown")}`, `user:${N(e.userId)}`);
  const c = a.number || a.id || a.name;
  return Je(`user:${N(t, "unknown")}`, `contact:${c}`);
}
function Me(e = {}) {
  var t;
  return {
    id: N(e.id) || qt(),
    threadId: N(e.threadId) || me({ number: ((t = e.recipientNumbers) == null ? void 0 : t[0]) ?? e.senderNumber }),
    senderUserId: N(e.senderUserId),
    senderActorId: N(e.senderActorId),
    senderName: N(e.senderName, "Unknown Sender"),
    senderNumber: N(e.senderNumber),
    recipientUserIds: $e(e.recipientUserIds ?? []),
    recipientActorIds: $e(e.recipientActorIds ?? []),
    recipientNumbers: $e(e.recipientNumbers ?? []),
    contactName: N(e.contactName),
    contactImage: N(e.contactImage),
    contactUserId: N(e.contactUserId),
    contactManagedByGM: e.contactManagedByGM === !0,
    contactIsNpc: e.contactIsNpc === !0,
    body: N(e.body),
    messageType: N(e.messageType, "text") || "text",
    eventType: N(e.eventType),
    createdAt: N(e.createdAt) || Vt(),
    chatMessageId: N(e.chatMessageId),
    schemaVersion: Number(e.schemaVersion ?? He)
  };
}
function tt(e, t = [], n = "", a = {}) {
  const c = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (const i of t) {
    const o = E(i), d = { ...o, userId: i == null ? void 0 : i.userId, userIds: (i == null ? void 0 : i.userIds) ?? o.userIds };
    o.number && c.set(o.number, d), i != null && i.userId && s.set(String(i.userId), d);
  }
  const l = /* @__PURE__ */ new Map();
  for (const i of e.map(Me).filter((o) => o.body)) {
    const o = l.get(i.threadId) ?? [];
    o.push(i), l.set(i.threadId, o);
  }
  return [...l.entries()].map(([i, o]) => {
    var O, x, D, q, ae, re, se, ie, ce, oe, P, R, j;
    const d = o.sort((G, k) => G.createdAt.localeCompare(k.createdAt)), r = d[d.length - 1] ?? null, C = (r == null ? void 0 : r.senderUserId) === ((O = game == null ? void 0 : game.user) == null ? void 0 : O.id) ? (x = r == null ? void 0 : r.recipientUserIds) == null ? void 0 : x.find((G) => {
      var k;
      return G !== ((k = game == null ? void 0 : game.user) == null ? void 0 : k.id);
    }) : r == null ? void 0 : r.senderUserId, p = (r == null ? void 0 : r.senderUserId) === ((D = game == null ? void 0 : game.user) == null ? void 0 : D.id) ? ((q = r == null ? void 0 : r.recipientNumbers) == null ? void 0 : q[0]) || "" : (r == null ? void 0 : r.senderNumber) || ((ae = r == null ? void 0 : r.recipientNumbers) == null ? void 0 : ae[0]) || "", w = r != null && r.contactName && !(r != null && r.contactUserId) && (r.contactIsNpc || r.contactManagedByGM) ? {
      id: `contact-${((re = r.recipientNumbers) == null ? void 0 : re[0]) || r.senderNumber || i}`,
      name: r.contactName,
      number: ((se = r.recipientNumbers) == null ? void 0 : se[0]) || r.senderNumber || "",
      image: r.contactImage || "",
      actorId: ((ie = r.recipientActorIds) == null ? void 0 : ie[0]) ?? r.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: H(r.contactName)
    } : null, A = (r == null ? void 0 : r.senderUserId) !== ((ce = game == null ? void 0 : game.user) == null ? void 0 : ce.id) && (r != null && r.senderNumber) && (r != null && r.contactName) ? {
      id: `contact-${r.senderNumber || i}`,
      name: r.contactName,
      number: r.senderNumber,
      image: r.contactImage || "",
      actorId: r.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: H(r.contactName)
    } : null, h = w ?? A ?? s.get(C) ?? c.get(p) ?? {
      id: `contact-${p || i}`,
      name: (r == null ? void 0 : r.contactName) || ((r == null ? void 0 : r.senderUserId) === ((oe = game == null ? void 0 : game.user) == null ? void 0 : oe.id) ? p || "Unknown Contact" : (r == null ? void 0 : r.senderName) || p || "Unknown Contact"),
      number: p,
      image: (r == null ? void 0 : r.contactImage) || "",
      actorId: ((P = r == null ? void 0 : r.recipientActorIds) == null ? void 0 : P[0]) ?? "",
      userId: "",
      userIds: [],
      managedByGM: !!(r != null && r.contactName || (R = r == null ? void 0 : r.recipientActorIds) != null && R[0]),
      isNpc: !!(r != null && r.contactName || (j = r == null ? void 0 : r.recipientActorIds) != null && j[0]),
      initials: H((r == null ? void 0 : r.contactName) || (r == null ? void 0 : r.senderName) || p)
    }, T = a[i] ?? "", V = d.filter(
      (G) => {
        var k;
        return G.senderUserId !== ((k = game == null ? void 0 : game.user) == null ? void 0 : k.id) && G.createdAt > T;
      }
    );
    return {
      id: i,
      title: h.name || (r == null ? void 0 : r.senderName) || "Unknown Contact",
      subtitle: h.number || (r == null ? void 0 : r.senderNumber) || "",
      initials: h.initials || H(h.name || (r == null ? void 0 : r.senderName)),
      contact: h,
      messages: d.map((G) => {
        var k;
        return {
          ...G,
          isMine: G.senderUserId === ((k = game == null ? void 0 : game.user) == null ? void 0 : k.id),
          isEvent: G.messageType !== "text"
        };
      }),
      lastMessage: r,
      lastPreview: (r == null ? void 0 : r.body) ?? "",
      updatedAt: (r == null ? void 0 : r.createdAt) ?? "",
      unread: V.length > 0,
      unreadCount: V.length,
      active: i === n
    };
  }).sort((i, o) => o.updatedAt.localeCompare(i.updatedAt));
}
function jt(e) {
  var n, a, c;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[b]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, b, "message"));
  return (t == null ? void 0 : t.kind) === be ? t : ((c = t == null ? void 0 : t.message) == null ? void 0 : c.kind) === be ? t.message : null;
}
function zt(e) {
  return String(e != null && e.timestamp ? new Date(e.timestamp).toISOString() : (e == null ? void 0 : e.createdTime) ?? "");
}
function Kt() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => t.id);
}
function nt(e) {
  return [...new Set(e.map((t) => String(t ?? "").trim()).filter(Boolean))];
}
function Yt(e) {
  const t = Array.isArray(e == null ? void 0 : e.userIds) ? e.userIds : e != null && e.userId ? [e.userId] : [], n = nt(t);
  return n.length ? n : Kt();
}
function Wt(e) {
  return !!(e != null && e.userId || Array.isArray(e == null ? void 0 : e.userIds) && e.userIds.length);
}
function Jt(e, t) {
  const n = e.senderName || "CyberCall", a = t != null && t.name ? `<span>${X(t.name)}</span>` : "";
  return `
    <div class="cybercall-chat-card${e.messageType !== "text" ? " cybercall-chat-card--event" : ""}" data-cybercall-thread-id="${X(e.threadId)}">
      <strong>${X(n)}</strong>
      ${a}
      <p>${X(e.body)}</p>
      <button type="button" data-cybercall-open-thread data-cybercall-thread-id="${X(e.threadId)}">Open CyberCall</button>
    </div>
  `;
}
function Qt() {
  var t;
  return (((t = game.messages) == null ? void 0 : t.contents) ?? []).map((n) => {
    const a = jt(n);
    return a ? Me({
      ...a,
      chatMessageId: n.id,
      createdAt: a.createdAt || zt(n)
    }) : null;
  }).filter(Boolean);
}
async function at(e, t, n = {}) {
  var A, h;
  const a = E(e), c = String(t ?? "").trim();
  if (!c) return null;
  const s = game.user, l = n.recipientUserIds ? nt(n.recipientUserIds) : Yt(e), i = !Wt(e), o = String(n.threadId ?? me(e, s == null ? void 0 : s.id)), d = String(n.senderName ?? ((A = s == null ? void 0 : s.character) == null ? void 0 : A.name) ?? (s == null ? void 0 : s.name) ?? "Unknown Sender").trim(), r = String(n.senderActorId ?? ((h = s == null ? void 0 : s.character) == null ? void 0 : h.id) ?? "").trim(), C = String(n.senderNumber ?? "").trim(), p = Me({
    threadId: o,
    senderUserId: (s == null ? void 0 : s.id) ?? "",
    senderActorId: r,
    senderName: d,
    senderNumber: C,
    recipientUserIds: l,
    recipientActorIds: a.actorId ? [a.actorId] : [],
    recipientNumbers: n.recipientNumbers ?? (a.number ? [a.number] : []),
    contactName: String(n.contactName ?? a.name ?? ""),
    contactImage: String(n.contactImage ?? a.image ?? ""),
    contactUserId: String(n.contactUserId ?? a.userId ?? ""),
    contactManagedByGM: n.contactManagedByGM ?? (a.managedByGM === !0 || i),
    contactIsNpc: n.contactIsNpc ?? (a.isNpc === !0 || i),
    body: c,
    messageType: String(n.messageType ?? "text"),
    eventType: String(n.eventType ?? ""),
    schemaVersion: He
  }), w = [...new Set([s == null ? void 0 : s.id, ...l].filter(Boolean))];
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: p.senderName }),
    whisper: w,
    content: Jt(p, a),
    flags: {
      [b]: {
        kind: be,
        ...p
      }
    }
  });
}
async function Xt(e, t, n = {}) {
  return at(e, t, {
    ...n,
    messageType: n.messageType ?? "event"
  });
}
let g = null, v = null, de = null, _ = null, L = null, Z = "personal", B = "", F = !1, z = null, te = null;
function Zt() {
  var e, t, n, a, c, s, l, i;
  return Q({
    callerName: ((e = g == null ? void 0 : g.callData) == null ? void 0 : e.callerName) ?? U.callerName,
    subtitle: ((t = g == null ? void 0 : g.callData) == null ? void 0 : t.subtitle) ?? U.subtitle,
    image: ((n = g == null ? void 0 : g.callData) == null ? void 0 : n.image) ?? "",
    message: ((a = g == null ? void 0 : g.callData) == null ? void 0 : a.message) ?? U.message,
    signal: ((c = g == null ? void 0 : g.callData) == null ? void 0 : c.signal) ?? game.settings.get(b, "defaultSignal"),
    variant: ((s = g == null ? void 0 : g.callData) == null ? void 0 : s.variant) ?? "standard",
    fullscreen: ((l = g == null ? void 0 : g.callData) == null ? void 0 : l.fullscreen) ?? !1,
    ringing: ((i = g == null ? void 0 : g.callData) == null ? void 0 : i.ringing) ?? !0
  });
}
function Ht() {
  var e;
  return (((e = game.actors) == null ? void 0 : e.contents) ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    img: t.img ?? ""
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function en() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => !t.isGM).map((t) => ({
    id: t.id,
    name: t.name,
    active: t.active === !0
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function tn() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => {
    var n;
    return t.id !== ((n = game.user) == null ? void 0 : n.id);
  }).map((t) => {
    var n;
    return {
      id: `user-${t.id}`,
      name: t.name,
      number: `@${t.name}`,
      image: t.avatar ?? ((n = t.character) == null ? void 0 : n.img) ?? "",
      userId: t.id,
      userIds: [t.id],
      isNpc: !1,
      managedByGM: !1
    };
  }).sort((t, n) => t.name.localeCompare(n.name));
}
function Ce() {
  var e, t;
  return String(((e = game.world) == null ? void 0 : e.id) ?? ((t = game.world) == null ? void 0 : t.title) ?? "default");
}
function rt() {
  const e = game.settings.get(b, "contacts");
  return Array.isArray(e) ? { [Ce()]: e } : !e || typeof e != "object" ? {} : e;
}
function ne() {
  const e = rt()[Ce()];
  return Array.isArray(e) ? e.map(E).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function K() {
  if (Array.isArray(te))
    return te.map(E).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name));
  const e = game.settings.get(b, "groupContacts");
  return Array.isArray(e) ? e.map(E).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function Te() {
  const e = /* @__PURE__ */ new Map();
  for (const t of [...tn(), ...K(), ...ne()]) {
    const n = t.userId ? `user:${t.userId}` : `number:${t.number || t.id}`;
    e.has(n) || e.set(n, t);
  }
  return [...e.values()].sort((t, n) => t.name.localeCompare(n.name));
}
async function st(e) {
  await game.settings.set(b, "contacts", {
    ...rt(),
    [Ce()]: e.map(E)
  });
}
async function ye(e) {
  te = e.map(E), await game.settings.set(b, "groupContacts", te), game.socket.emit(W, {
    action: "groupContactsChanged",
    contacts: te
  });
}
function Ge() {
  const e = game.settings.get(b, "messageReadState");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function it() {
  const e = game.settings.get(b, "messageDeletedBefore");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function ct() {
  const e = it();
  return Qt().filter((t) => {
    const n = e[t.threadId];
    return !n || t.createdAt > n;
  });
}
function ot() {
  return tt(ct(), Te(), "", Ge()).reduce((e, t) => e + Number(t.unreadCount ?? 0), 0);
}
async function nn(e, t = (/* @__PURE__ */ new Date()).toISOString()) {
  e && await game.settings.set(b, "messageReadState", {
    ...Ge(),
    [e]: t
  });
}
async function pe() {
  B && await nn(B);
}
async function an(e) {
  e && (await game.settings.set(b, "messageDeletedBefore", {
    ...it(),
    [e]: (/* @__PURE__ */ new Date()).toISOString()
  }), B === e && (B = "", F = !0, L && (L.contact = null), (v == null ? void 0 : v.mode) === "messages" && (v.contact = null)), await ee(), await J());
}
async function rn(e, t, n = "personal", a = "", c = {}) {
  var o, d, r, C, p, w, A;
  const s = c.actorId ? (o = game.actors) == null ? void 0 : o.get(c.actorId) : null, l = E({
    name: String(e ?? "").trim() || (s == null ? void 0 : s.name),
    number: t,
    image: ue() && (String(a ?? "").trim() || (s == null ? void 0 : s.img)) || "",
    actorId: ue() ? c.actorId : "",
    managedByGM: ue() ? c.managedByGM === !0 : !1,
    isNpc: ue() ? c.isNpc === !0 || c.managedByGM === !0 || !!c.actorId : !1
  });
  if (!l.name || !l.number) {
    (r = (d = ui.notifications) == null ? void 0 : d.warn) == null || r.call(d, "Contact name and number are required.");
    return;
  }
  if (n === "group" && !game.user.isGM) {
    if (!Ee()) {
      (p = (C = ui.notifications) == null ? void 0 : C.warn) == null || p.call(C, "A GM must be connected to update group contacts.");
      return;
    }
    game.socket.emit(W, {
      action: "groupContactAdd",
      contact: l
    }), (A = (w = ui.notifications) == null ? void 0 : w.info) == null || A.call(w, "Group contact update sent to the GM.");
    return;
  }
  const i = n === "group" ? K() : ne();
  i.push(l), n === "group" ? await ye(i) : await st(i), await J();
}
async function sn(e, t = "personal") {
  var n, a, c, s;
  if (t === "group") {
    if (!game.user.isGM) {
      if (!Ee()) {
        (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(W, {
        action: "groupContactRemove",
        contactId: e
      }), (s = (c = ui.notifications) == null ? void 0 : c.info) == null || s.call(c, "Group contact removal sent to the GM.");
      return;
    }
    await ye(K().filter((l) => l.id !== e));
  } else
    await st(ne().filter((l) => l.id !== e));
  await J();
}
function Ee() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function Ie(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(b, "minimumRole");
  } catch (n) {
    console.warn(`${b} | Permission setting unavailable, using Player role fallback.`, n);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function ue(e = game.user) {
  return !!(e != null && e.isGM);
}
function we(e, t = null) {
  var n;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (n = e.element) != null && n[0] ? e.element[0] : e.element ?? null;
}
function cn(e, t = null) {
  const n = we(e, t);
  n && (n.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), n.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), n.classList.toggle("cybercall-connected", e.callData.accepted), n.querySelectorAll("[data-cybercall-action]").forEach((a) => {
    a.addEventListener("click", async (c) => {
      const s = c.currentTarget.dataset.cybercallAction;
      if (s === "accept") {
        await vn(e.callData.id);
        return;
      }
      if (s === "broadcast") {
        De({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (s === "decline" || s === "end") && await mt(e.callData.id);
    });
  }));
}
function on(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-composer]");
}
function Qe(e) {
  var o, d;
  const t = new FormData(e), n = (o = game.actors) == null ? void 0 : o.get(t.get("actorId")), a = String(t.get("image") ?? "").trim() || (n == null ? void 0 : n.img) || "", c = String(t.get("callerName") ?? "").trim() || (n == null ? void 0 : n.name) || "UNKNOWN CALLER", s = t.getAll("targetUserIds").map((r) => String(r)).filter(Boolean), l = new Map((((d = game.users) == null ? void 0 : d.contents) ?? []).map((r) => [r.id, r])), i = s.map((r) => {
    var C;
    return ((C = l.get(r)) == null ? void 0 : C.name) ?? r;
  });
  return Q({
    callerName: c,
    subtitle: String(t.get("subtitle") ?? "").trim(),
    image: a,
    message: String(t.get("message") ?? "").trim(),
    signal: t.get("signal"),
    variant: String(t.get("variant") ?? U.variant),
    fullscreen: t.get("fullscreen") === "on",
    ringing: t.get("ringing") === "on",
    targetUserIds: s,
    targetUserNames: i
  });
}
function Ne(e) {
  var a, c;
  const t = (a = e == null ? void 0 : e.elements) == null ? void 0 : a.signal, n = (c = e == null ? void 0 : e.querySelector) == null ? void 0 : c.call(e, "[data-cybercall-signal-output]");
  !t || !n || (n.textContent = `${Ze(t.value)}%`);
}
function ln(e, t = null) {
  var s, l;
  const n = we(e, t), a = on(n);
  if (!n || !a) return;
  Ne(a);
  const c = n.querySelector("[data-cybercall-ringtone]");
  c && c.addEventListener("change", async (i) => {
    await game.settings.set(b, "ringSound", i.currentTarget.value);
  }), (s = a.elements.signal) == null || s.addEventListener("input", () => Ne(a)), (l = a.elements.actorId) == null || l.addEventListener("change", () => {
    var o;
    const i = (o = game.actors) == null ? void 0 : o.get(a.elements.actorId.value);
    i && (a.elements.callerName.value = i.name, a.elements.image.value = i.img ?? "");
  }), a.addEventListener("submit", (i) => {
    i.preventDefault(), Y(Qe(a));
  }), n.querySelectorAll("[data-cybercall-compose-action]").forEach((i) => {
    i.addEventListener("click", async (o) => {
      var C, p, w, A, h, T, V;
      const d = o.currentTarget.dataset.cybercallComposeAction, r = Qe(a);
      if (d === "preview") {
        await Y(r);
        return;
      }
      if (d === "broadcast") {
        await De(r);
        return;
      }
      if (d === "close-active") {
        mt((C = g == null ? void 0 : g.callData) == null ? void 0 : C.id);
        return;
      }
      if (d === "browse-image") {
        const O = a.elements.image, x = globalThis.FilePicker ?? ((A = (w = (p = globalThis.foundry) == null ? void 0 : p.applications) == null ? void 0 : w.apps) == null ? void 0 : A.FilePicker);
        if (!O || !x) {
          (T = (h = ui.notifications) == null ? void 0 : h.warn) == null || T.call(h, "Foundry FilePicker is unavailable.");
          return;
        }
        const D = new x({
          type: "image",
          current: O.value,
          callback: (q) => {
            O.value = q, O.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof D.browse == "function" ? D.browse() : (V = D.render) == null || V.call(D, !0);
        return;
      }
      if (d === "reset") {
        a.reset(), Ne(a);
        return;
      }
      d === "open-messages" && await ge();
    });
  });
}
function un(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function dn(e, t = null) {
  var s, l;
  const n = we(e, t), a = un(n);
  if (!n || !a) return;
  a.addEventListener("submit", async (i) => {
    var r;
    i.preventDefault();
    const o = new FormData(a), d = String(o.get("scope") ?? Z);
    await rn(o.get("name"), o.get("number"), d, o.get("image"), {
      actorId: o.get("actorId"),
      managedByGM: o.get("managedByGM") === "on",
      isNpc: o.get("managedByGM") === "on" || !!o.get("actorId")
    }), a.reset(), a.elements.scope.value = d, (r = a.elements.name) == null || r.focus();
  }), (s = a.elements.actorId) == null || s.addEventListener("change", () => {
    var o;
    const i = (o = game.actors) == null ? void 0 : o.get(a.elements.actorId.value);
    i && (a.elements.name.value || (a.elements.name.value = i.name), a.elements.image && !a.elements.image.value && (a.elements.image.value = i.img ?? ""), a.elements.managedByGM && (a.elements.managedByGM.checked = !0));
  }), n.querySelectorAll("[data-cybercall-contact-tab]").forEach((i) => {
    i.addEventListener("click", (o) => {
      Z = o.currentTarget.dataset.cybercallContactTab, n.querySelectorAll("[data-cybercall-contact-tab]").forEach((d) => {
        d.classList.toggle("active", d.dataset.cybercallContactTab === Z);
      }), n.querySelectorAll("[data-cybercall-contact-panel]").forEach((d) => {
        d.hidden = d.dataset.cybercallContactPanel !== Z;
      }), a.elements.scope && (a.elements.scope.value = Z);
    });
  });
  const c = n.querySelector("[data-cybercall-ringtone]");
  c && c.addEventListener("change", async (i) => {
    await game.settings.set(b, "ringSound", i.currentTarget.value);
  }), n.querySelectorAll("[data-cybercall-contact-action]").forEach((i) => {
    i.addEventListener("click", async (o) => {
      const d = o.currentTarget.dataset.cybercallContactAction, r = o.currentTarget.dataset.contactId, C = o.currentTarget.dataset.contactScope ?? "personal", w = (C === "group" ? K() : ne()).find((A) => A.id === r);
      if (d === "remove") {
        await sn(r, C);
        return;
      }
      if (d === "call" && w) {
        await Nn(w) && _ === e && await e.close();
        return;
      }
      d === "message" && w && await ge(w);
    });
  }), (l = n.querySelector("[data-cybercall-open-messages]")) == null || l.addEventListener("click", async () => {
    await ge();
  });
}
function gn(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
function ke(e = null) {
  var p, w, A;
  let t = Te();
  const n = e ?? t[0] ?? null;
  n && !t.some((h) => h.id === n.id || h.number === n.number) && (t = [...t, E(n)].sort((h, T) => h.name.localeCompare(T.name)));
  const a = F ? "" : B, c = tt(ct(), t, a, Ge()).map((h) => ({
    ...h,
    messages: h.messages.map((T) => ({
      ...T,
      createdAtLabel: gn(T.createdAt)
    }))
  })), s = F ? null : c.find((h) => h.id === B) ?? null;
  s != null && s.contact && !t.some((h) => h.id === s.contact.id || h.number === s.contact.number) && (t = [...t, s.contact].sort((h, T) => h.name.localeCompare(T.name)));
  const l = ((p = s == null ? void 0 : s.contact) == null ? void 0 : p.id) ?? (n == null ? void 0 : n.id) ?? "", i = ot(), o = lt(s, { excludeGMs: !1 }), d = bn(s), r = ut(), C = ((w = game.user) == null ? void 0 : w.isGM) === !0 && !s && r.length > 1;
  return {
    threads: c,
    hasThreads: c.length > 0,
    unreadCount: i,
    hasUnreadMessages: i > 0,
    activeThread: s,
    activeThreadId: (s == null ? void 0 : s.id) ?? a,
    allContacts: t.map((h) => ({
      ...h,
      selected: h.id === l
    })),
    hasContacts: t.length > 0,
    selectedContactId: l,
    isThreadReply: !!s,
    isComposingNewMessage: !s,
    canDeleteThread: !!s,
    threadReplyLabel: s ? `${s.title}${s.subtitle ? ` (${s.subtitle})` : ""}` : "",
    canReplyAs: d.length > 1,
    replyAsChoices: d,
    canSendAs: C,
    sendAsChoices: r,
    activeThreadRecipientUserIds: o,
    isFoundryV13Plus: Number(((A = game.release) == null ? void 0 : A.generation) ?? 0) >= 13
  };
}
function mn(e, t = ke()) {
  const n = String(new FormData(e).get("contactId") ?? "");
  return t.allContacts.find((a) => a.id === n) ?? null;
}
function lt(e, t = {}) {
  var s, l, i;
  if (!((s = e == null ? void 0 : e.messages) != null && s.length)) return [];
  const n = String(((l = game.user) == null ? void 0 : l.id) ?? ""), a = new Set((((i = game.users) == null ? void 0 : i.contents) ?? []).filter((o) => o.isGM).map((o) => String(o.id))), c = /* @__PURE__ */ new Set();
  for (const o of e.messages) {
    o.senderUserId && o.senderUserId !== n && !(t.excludeGMs && a.has(o.senderUserId)) && c.add(o.senderUserId);
    for (const d of o.recipientUserIds ?? [])
      d && d !== n && !(t.excludeGMs && a.has(d)) && c.add(d);
  }
  return [...c];
}
function pn() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => String(t.id)).filter(Boolean);
}
function bn(e) {
  var a, c, s, l, i;
  const t = !!((a = game.user) != null && a.isGM && (e != null && e.contact) && !e.contact.userId && (e.contact.isNpc || e.contact.managedByGM)), n = [{
    id: "self",
    label: ((s = (c = game.user) == null ? void 0 : c.character) == null ? void 0 : s.name) ?? ((l = game.user) == null ? void 0 : l.name) ?? "Me",
    selected: !t
  }];
  return !((i = game.user) != null && i.isGM) || !(e != null && e.contact) || e.contact.userId || n.push({
    id: "contact",
    label: e.contact.name,
    selected: t
  }), n;
}
function ut() {
  var n, a, c, s, l;
  const e = [{
    id: "self",
    label: ((a = (n = game.user) == null ? void 0 : n.character) == null ? void 0 : a.name) ?? ((c = game.user) == null ? void 0 : c.name) ?? "Me",
    selected: !0,
    contact: null
  }];
  if (!((s = game.user) != null && s.isGM)) return e;
  const t = /* @__PURE__ */ new Set();
  for (const i of [...K(), ...ne()].map(E)) {
    if (!i.name || i.userId || !i.managedByGM && !i.actorId && !i.isNpc) continue;
    const o = i.actorId || i.number || i.id;
    t.has(o) || (t.add(o), e.push({
      id: o,
      label: i.name,
      selected: !1,
      contact: i
    }));
  }
  for (const i of ((l = game.actors) == null ? void 0 : l.contents) ?? []) {
    const o = `actor-${i.id}`;
    t.has(i.id) || t.has(o) || (t.add(o), e.push({
      id: o,
      label: i.name,
      selected: !1,
      contact: E({
        id: o,
        name: i.name,
        number: `NPC:${i.id}`,
        image: i.img ?? "",
        actorId: i.id,
        managedByGM: !0,
        isNpc: !0
      })
    }));
  }
  return e;
}
function Xe(e) {
  return e ? {
    senderName: e.name,
    senderNumber: e.number,
    senderActorId: e.actorId,
    contactName: e.name,
    contactImage: e.image,
    contactManagedByGM: !0,
    contactIsNpc: !0
  } : {};
}
function yn(e, t) {
  var s, l;
  const n = new FormData(e);
  if (t.activeThread)
    return String(n.get("replyAs") ?? "self") === "contact" && ((s = game.user) != null && s.isGM) && t.activeThread.contact ? Xe(t.activeThread.contact) : {};
  const a = String(n.get("sendAs") ?? "self");
  if (a === "self" || !((l = game.user) != null && l.isGM)) return {};
  const c = ut().find((i) => i.id === a);
  return Xe(c == null ? void 0 : c.contact);
}
function fn(e, t = null) {
  const n = we(e, t);
  if (!n) return;
  n.querySelectorAll("[data-cybercall-thread-id]").forEach((c) => {
    c.addEventListener("click", async (s) => {
      F = !1, B = s.currentTarget.dataset.cybercallThreadId, await pe(), await ee();
    });
  }), n.querySelectorAll("[data-cybercall-message-action]").forEach((c) => {
    c.addEventListener("click", async (s) => {
      var i;
      const l = s.currentTarget.dataset.cybercallMessageAction;
      if (l === "refresh") {
        await ee();
        return;
      }
      if (l === "open-calls") {
        await bt();
        return;
      }
      if (l === "new") {
        F = !0, B = "", L && (L.contact = null), await ee();
        return;
      }
      if (l === "delete-thread") {
        s.preventDefault(), s.stopPropagation();
        const o = n.querySelector("[data-cybercall-active-thread]"), d = B || ((i = o == null ? void 0 : o.dataset) == null ? void 0 : i.cybercallActiveThread) || "";
        if (!d) return;
        if (e._cybercallPendingDeleteThreadId !== d) {
          e._cybercallPendingDeleteThreadId = d, s.currentTarget.classList.add("confirming"), s.currentTarget.textContent = "Confirm Delete", s.currentTarget.title = "Click again to delete this thread";
          return;
        }
        e._cybercallPendingDeleteThreadId = "", await an(d);
      }
    });
  });
  const a = n.querySelector("form[data-cybercall-message-form]");
  a == null || a.addEventListener("submit", async (c) => {
    var w, A, h, T;
    c.preventDefault();
    const s = ke(), l = s.activeThread, i = (l == null ? void 0 : l.contact) ?? mn(a, s), o = ((w = a.elements.body) == null ? void 0 : w.value) ?? "", d = yn(a, s), r = !!(l != null && l.contact && !l.contact.userId && (l.contact.managedByGM || l.contact.isNpc)), C = l ? lt(l, { excludeGMs: ((A = game.user) == null ? void 0 : A.isGM) === !0 && !r }) : null;
    if (!i) {
      (T = (h = ui.notifications) == null ? void 0 : h.warn) == null || T.call(h, "Select a contact before sending a message.");
      return;
    }
    await at(i, o, {
      ...d,
      threadId: l ? l.id : void 0,
      recipientUserIds: C != null && C.length ? C : void 0,
      recipientNumbers: d.senderNumber ? [] : void 0
    }) && (B = l ? l.id : me(i), e && (e.contact = i), (v == null ? void 0 : v.mode) === "messages" && (v.contact = i), F = !1, a.elements.body.value = "", await pe(), await ee());
  }), pe();
}
const { CyberCallApplication: hn, CyberCallPhone: Cn } = Dt({
  moduleId: b,
  templatePath: Ot,
  composerTemplatePath: _t,
  contactsTemplatePath: xt,
  messagesTemplatePath: Lt,
  phoneTemplatePath: Ft,
  escapeHTML: X,
  getDefaultComposerData: Zt,
  getActorChoices: Ht,
  getPlayerChoices: en,
  getContacts: ne,
  getGroupContacts: K,
  getMessageContext: ke,
  getRingtoneChoices: Tn,
  getSoundPath: Oe,
  getActiveContactsTab: () => Z,
  canEditContactImages: ue,
  bindCallControls: cn,
  bindComposerControls: ln,
  bindContactsControls: dn,
  bindMessagesControls: fn,
  stopRinging: _e,
  clearActiveCall: (e) => {
    g === e && (g = null);
  },
  clearActiveComposer: (e) => {
    de === e && (de = null);
  },
  clearActiveContacts: (e) => {
    _ === e && (_ = null);
  },
  clearActiveMessages: (e) => {
    L === e && (L = null);
  },
  clearActivePhone: (e) => {
    v === e && (v = null, de = null, _ = null, L = null);
  }
});
async function Y(e = {}) {
  var t, n;
  return Ie() ? (_ && await _.close(), await Ue(), g = new hn(e), await g.render(!0), yt(g), Gn(g.callData), g) : ((n = (t = ui.notifications) == null ? void 0 : t.warn) == null || n.call(t, "You do not have permission to open CyberCall transmissions."), null);
}
async function Ue() {
  if (!g) return;
  const e = g;
  g = null, await e.close();
}
function In(e) {
  var t;
  return !!((t = g == null ? void 0 : g.callData) != null && t.id) && g.callData.id === e;
}
async function wn() {
  g && (await g.render(!0), yt(g));
}
async function dt(e) {
  In(e) && (g.callData.accepted = !0, g.callData.ringing = !1, _e(), await wn());
}
async function vn(e) {
  e && (await fe(g == null ? void 0 : g.callData, "connected"), game.socket.emit(W, {
    action: "acceptCall",
    callId: e
  }), await dt(e));
}
async function gt(e) {
  var t;
  e && ((t = g == null ? void 0 : g.callData) != null && t.id) && g.callData.id !== e || await Ue();
}
async function mt(e) {
  var t;
  await fe(g == null ? void 0 : g.callData, (t = g == null ? void 0 : g.callData) != null && t.accepted ? "ended" : "missed"), game.socket.emit(W, {
    action: "endCall",
    callId: e
  }), await gt(e);
}
function An(e, t = "Player") {
  var a, c, s, l, i, o;
  const n = ((c = (a = game.users) == null ? void 0 : a.get) == null ? void 0 : c.call(a, e)) ?? ((i = (l = (s = game.users) == null ? void 0 : s.contents) == null ? void 0 : l.find) == null ? void 0 : i.call(l, (d) => d.id === e));
  return {
    id: `user-${e}`,
    name: (n == null ? void 0 : n.name) ?? t,
    number: `@${(n == null ? void 0 : n.name) ?? t}`,
    image: (n == null ? void 0 : n.avatar) ?? ((o = n == null ? void 0 : n.character) == null ? void 0 : o.img) ?? "",
    userId: e,
    userIds: e ? [e] : []
  };
}
function Sn(e) {
  var t;
  return e ? e.contactNumber ? Te().find((a) => a.number === e.contactNumber) ?? {
    id: `contact-${e.contactNumber}`,
    name: e.contactName || e.callerName,
    number: e.contactNumber,
    image: e.contactImage || e.image,
    actorId: e.contactActorId ?? "",
    managedByGM: !0,
    isNpc: !0
  } : (t = game.user) != null && t.isGM && e.callerUserId ? An(e.callerUserId, e.callerName) : null : null;
}
function $n(e, t) {
  var a;
  const n = /* @__PURE__ */ new Set();
  for (const c of (t == null ? void 0 : t.userIds) ?? []) n.add(String(c));
  if (t != null && t.userId && n.add(String(t.userId)), e != null && e.callerUserId && n.add(String(e.callerUserId)), !(t != null && t.userId) && (t != null && t.managedByGM || t != null && t.isNpc || e != null && e.contactNumber))
    for (const c of pn()) n.add(c);
  return n.delete(String(((a = game.user) == null ? void 0 : a.id) ?? "")), [...n].filter(Boolean);
}
async function fe(e, t) {
  var s;
  const n = Sn(e);
  if (!n) return null;
  const a = (e == null ? void 0 : e.callerUserId) || ((s = game.user) == null ? void 0 : s.id), c = {
    outgoing: `Outgoing call to ${n.name}.`,
    connected: `Call connected with ${n.name}.`,
    ended: `Call ended with ${n.name}.`,
    missed: `Call missed or declined with ${n.name}.`
  };
  return Xt(n, c[t] ?? "Call event.", {
    threadId: me(n, a),
    eventType: t,
    senderName: "CyberCall",
    senderNumber: n.number,
    senderActorId: n.actorId,
    recipientUserIds: $n(e, n),
    recipientNumbers: n.userId ? [] : [n.number]
  });
}
async function Nn(e) {
  var l, i, o, d, r;
  if (game.user.isGM) {
    const C = {
      callerName: e.name,
      subtitle: `Comms ${e.number}`,
      image: e.image,
      message: `Opening channel ${e.number}...`,
      signal: game.settings.get(b, "defaultSignal"),
      variant: "standard",
      contactNumber: e.number,
      ringing: !1
    };
    return await fe(C, "outgoing"), Y(C);
  }
  if (!Ee())
    return (i = (l = ui.notifications) == null ? void 0 : l.warn) == null || i.call(l, "No GM is connected to receive the CyberCall."), null;
  const t = he(), n = String(((o = game.user) == null ? void 0 : o.avatar) ?? ((r = (d = game.user) == null ? void 0 : d.character) == null ? void 0 : r.img) ?? "").trim(), a = {
    id: t,
    signal: game.settings.get(b, "defaultSignal"),
    variant: "standard",
    fullscreen: !1,
    accepted: !1,
    allowBroadcast: !1,
    callerUserId: game.user.id,
    contactNumber: e.number,
    contactName: e.name,
    contactImage: e.image,
    contactActorId: e.actorId,
    contactManagedByGM: e.managedByGM === !0,
    contactIsNpc: e.isNpc === !0
  }, c = Q({
    ...a,
    callerName: e.name,
    subtitle: `Comms ${e.number}`,
    image: e.image,
    message: `Awaiting connection to ${e.name} on ${e.number}...`,
    canAccept: !1,
    canDecline: !1,
    outgoing: !0,
    ringing: !0
  }), s = Q({
    ...a,
    callerName: game.user.name,
    subtitle: `Call request from ${game.user.name}`,
    image: n,
    message: `${game.user.name} is calling ${e.name} on ${e.number}.`,
    canAccept: !0,
    ringing: !0
  });
  return game.socket.emit(W, {
    action: "playerCallRequest",
    callData: s
  }), await fe(c, "outgoing"), Y(c);
}
async function Pe() {
  var e, t;
  return game.user.isGM ? Be("calls") : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function Re() {
  var e, t, n;
  return Ie() ? g ? ((n = g.bringToFront) == null || n.call(g), g) : Be("calls") : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function J() {
  _ && await _.render(!0);
}
async function ge(e = null) {
  var n, a;
  if (!Ie())
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "You do not have permission to use CyberCall messages."), null;
  e ? (B = me(e), F = !1) : B || (F = !0);
  const t = await Be("messages", e);
  return await pe(), t;
}
async function pt(e) {
  return e && (B = String(e), F = !1), ge();
}
async function bt() {
  var e;
  return (e = game.user) != null && e.isGM ? Pe() : Re();
}
async function ee() {
  !v || v.mode !== "messages" || await v.render(!0);
}
async function Be(e = "calls", t = null) {
  var n, a, c;
  return v ? (v.mode = e, v.contact = t, await v.render(!0), (n = v.bringToFront) == null || n.call(v)) : (v = new Cn(e, t), await v.render(!0)), de = (a = game.user) != null && a.isGM && e === "calls" ? v : null, _ = !((c = game.user) != null && c.isGM) && e === "calls" ? v : null, L = e === "messages" ? v : null, v;
}
async function De(e = {}) {
  var n, a;
  if (!game.user.isGM)
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Only the GM can broadcast CyberCalls to all players."), null;
  const t = Q({
    ...e,
    fullscreen: e.fullscreen ?? !0,
    ringing: !0
  });
  return game.socket.emit(W, {
    action: "openCall",
    callData: t,
    targetUserIds: t.targetUserIds
  }), Y({ ...t, outgoing: !0 });
}
async function Mn(e) {
  var t, n, a;
  if (e && !(Array.isArray(e.targetUserIds) && e.targetUserIds.length && !e.targetUserIds.includes((t = game.user) == null ? void 0 : t.id)) && !(Array.isArray((n = e.callData) == null ? void 0 : n.targetUserIds) && e.callData.targetUserIds.length && !e.callData.targetUserIds.includes((a = game.user) == null ? void 0 : a.id))) {
    if (e.action === "openCall") {
      if (!Ie()) return;
      Y(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      Y(e.callData);
      return;
    }
    if (e.action === "acceptCall") {
      dt(e.callId);
      return;
    }
    if (e.action === "endCall") {
      gt(e.callId);
      return;
    }
    if (e.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const c = E({
        ...e.contact,
        image: ""
      });
      if (!c.name || !c.number) return;
      const s = K();
      s.push(c), await ye(s), await J();
      return;
    }
    if (e.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await ye(K().filter((c) => c.id !== e.contactId)), await J();
      return;
    }
    e.action === "groupContactsChanged" && (te = Array.isArray(e.contacts) ? e.contacts.map(E) : null, await J());
  }
}
function yt(e) {
  var t, n;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((n = e.setPosition) == null || n.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function Oe() {
  return String(game.settings.get(b, "ringSound") ?? "").trim();
}
function Tn() {
  const e = Oe();
  return Object.entries(et).map(([t, n]) => ({
    value: t,
    label: n,
    selected: t === e
  }));
}
function _e() {
  if (!z) return;
  const e = z;
  z = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function Gn(e) {
  var s;
  if (_e(), !e.ringing) return;
  const t = Oe();
  if (!t) return;
  const a = 0.65 * Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), c = ((s = foundry == null ? void 0 : foundry.audio) == null ? void 0 : s.AudioHelper) ?? globalThis.AudioHelper;
  c != null && c.play ? c.play({ src: t, volume: a, autoplay: !0, loop: !0 }, !1).then((l) => {
    z = l;
  }).catch((l) => {
    console.warn(`${b} | Unable to play ringing sound.`, l);
  }) : (z = new Audio(t), z.loop = !0, z.volume = a, z.play().catch((l) => {
    console.warn(`${b} | Unable to play ringing sound.`, l);
  }));
}
function ft() {
  const e = game.modules.get(b);
  e && (e.api = {
    openCall: Y,
    closeCall: Ue,
    broadcastCall: De,
    openComposer: Pe,
    openContacts: Re,
    openMessages: ge,
    openMessagesThread: pt,
    openCallPanel: bt,
    getUnreadMessageCount: ot,
    get activeCall() {
      return g;
    },
    get activeComposer() {
      return de;
    },
    get activeContacts() {
      return _;
    },
    get activeMessages() {
      return L;
    }
  });
}
function En() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: b,
    title: "CyberCall",
    icon: "fa-solid fa-satellite-dish",
    premium: !1,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => {
      var n;
      return (n = game.user) != null && n.isGM ? Pe() : Re();
    }
  }), !0) : !1;
}
function kn() {
  const e = CONST.USER_ROLES, t = {};
  for (const [n, a] of [
    ["NONE", "None"],
    ["LIMITED", "Limited"],
    ["OBSERVER", "Observer"],
    ["PLAYER", "Player"],
    ["TRUSTED", "Trusted Player"],
    ["ASSISTANT", "Assistant GM"]
  ])
    Number.isFinite(Number(e[n])) && (t[e[n]] = a);
  game.settings.register(b, "defaultSignal", {
    name: "Default Signal Strength",
    hint: "Signal percentage used when a call does not provide one.",
    scope: "client",
    config: !0,
    type: Number,
    default: U.signal,
    range: {
      min: 0,
      max: 100,
      step: 1
    }
  }), game.settings.register(b, "ringSound", {
    name: "Incoming Call Ringtone",
    hint: "Ringtone played locally while a CyberCall is ringing. This is a client setting, so each user can choose their own ringtone.",
    scope: "client",
    config: !1,
    type: String,
    default: "",
    choices: et
  }), game.settings.register(b, "minimumRole", {
    name: "Minimum Player Role",
    hint: "Minimum role allowed to open CyberCall overlays and receive GM broadcasts.",
    scope: "world",
    config: !0,
    type: Number,
    default: e.PLAYER,
    choices: t
  }), game.settings.register(b, "contacts", {
    name: "CyberCall Contacts",
    hint: "Player contact directory stored locally for this client and isolated per world.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(b, "groupContacts", {
    name: "CyberCall Group Contacts",
    hint: "Shared group contact directory for all players in this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: []
  }), game.settings.register(b, "messageReadState", {
    name: "CyberCall Message Read State",
    hint: "Tracks which message threads this client has read.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(b, "messageDeletedBefore", {
    name: "CyberCall Deleted Message Threads",
    hint: "Tracks locally deleted message threads for this client.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  });
}
async function Un() {
  const e = game.settings.get(b, "contacts");
  Array.isArray(e) && await game.settings.set(b, "contacts", {
    [Ce()]: e.map(E)
  });
}
Hooks.once("init", () => {
  kn(), ft();
});
Hooks.once("ready", async () => {
  await Un(), ft(), En(), game.socket.on(W, Mn), console.log(`${b} | Ready. Use game.modules.get("${b}").api.openCall({...})`);
});
Hooks.on("createChatMessage", async (e) => {
  var n;
  const t = (n = e == null ? void 0 : e.flags) == null ? void 0 : n[b];
  (t == null ? void 0 : t.kind) === be && (await ee(), await J());
});
document.addEventListener("click", (e) => {
  var a;
  const t = e.target, n = (a = t == null ? void 0 : t.closest) == null ? void 0 : a.call(t, "[data-cybercall-open-thread]");
  n && (e.preventDefault(), pt(n.dataset.cybercallThreadId));
});
