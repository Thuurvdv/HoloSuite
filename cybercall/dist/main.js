var rn = Object.defineProperty;
var sn = (e, t, n) => t in e ? rn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var B = (e, t, n) => sn(e, typeof t != "symbol" ? t + "" : t, n);
function on(e, t) {
  return e.image ? `<img src="${t(e.image)}" alt="${t(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${t(e.initials)}</div>`;
}
function St(e, t) {
  const n = `--cybercall-signal: ${e.signal}%;`, a = e.fullscreen ? "cybercall-broadcast" : "", r = e.ringing ? "cybercall-ringing-panel" : "", s = e.accepted ? "cybercall-connected-panel" : "", o = e.showBroadcast ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>' : "", i = e.accepted ? "" : `
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
    `, u = e.accepted ? "" : `<blockquote>${t(e.message)}</blockquote>`, l = e.accepted || e.outgoing ? '<button type="button" data-cybercall-action="end">End Call</button>' : `
        ${e.canAccept ? '<button type="button" data-cybercall-action="accept">Accept</button>' : ""}
        <button type="button" data-cybercall-action="decline">Decline</button>
        ${o}
      `;
  return `
    <div class="cybercall-panel cybercall-${e.variant} ${a} ${r} ${s}" style="${n}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${i}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${on(e, t)}</div>
        ${u}
      </main>
      <footer class="cybercall-actions">
        ${l}
      </footer>
    </div>
  `;
}
function Ye(e, t) {
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
          ${e.actors.map((r) => `<option value="${t(r.id)}">${t(r.name)}</option>`).join("")}
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
function Je(e, t) {
  var u;
  const n = (l, c) => l.length ? l.map((m) => `
        <li>
          <div class="cybercall-contact-avatar">
            ${m.image ? `<img src="${t(m.image)}" alt="">` : `<span>${t(m.initials)}</span>`}
          </div>
          <div class="cybercall-contact-id">
            <strong>${t(m.name)}</strong>
            <span>${t(m.number)}</span>
          </div>
          <div class="cybercall-contact-actions">
            <button type="button" data-cybercall-contact-action="call" data-contact-scope="${c}" data-contact-id="${t(m.id)}">Call</button>
            <button type="button" data-cybercall-contact-action="message" data-contact-scope="${c}" data-contact-id="${t(m.id)}">Message</button>
            <button type="button" data-cybercall-contact-action="remove" data-contact-scope="${c}" data-contact-id="${t(m.id)}">Remove</button>
          </div>
        </li>
      `).join("") : '<li class="cybercall-contacts-empty">No contacts stored.</li>', a = e.activeTab !== "group", r = e.activeTab === "group", s = (e.actors ?? []).map((l) => `<option value="${t(l.id)}">${t(l.name)}</option>`).join(""), o = e.canEditContactImages ? `
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
        <button type="button" class="${r ? "active" : ""}" data-cybercall-contact-tab="group">Group</button>
      </nav>
      <section data-cybercall-contact-panel="personal" ${a ? "" : "hidden"}>
        <ul class="cybercall-contacts-list">${n(e.contacts, "personal")}</ul>
      </section>
      <section data-cybercall-contact-panel="group" ${r ? "" : "hidden"}>
        <ul class="cybercall-contacts-list">${n(e.groupContacts, "group")}</ul>
      </section>
      <form class="cybercall-contacts-form" data-cybercall-contacts-form>
        <input type="hidden" name="scope" value="${t(e.activeTab)}">
        <label>Name <input type="text" name="name" required></label>
        <label>Number <input type="text" name="number" required></label>
        ${o}
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
        ${(u = e.messageSoundOptions) != null && u.length ? `
          <label class="cybercall-ringtone-select">
            <span>Notification sound</span>
            <select data-cybercall-message-sound>
              ${e.messageSoundOptions.map(
    (l) => `<option value="${t(l.value)}" ${l.selected ? "selected" : ""}>${t(l.label)}</option>`
  ).join("")}
            </select>
          </label>
        ` : ""}
      </footer>
    </section>
  `;
}
function Qe(e, t) {
  var C;
  const n = e.threads ?? [], a = e.activeThread ?? null, r = e.allContacts ?? [], s = n.length ? n.map((g) => `
        <button type="button" class="cybercall-thread ${g.active ? "active" : ""} ${g.hasRouteLabel ? "routed" : ""} ${g.hasNpcBinding ? "npc-linked" : ""}" data-cybercall-thread-id="${t(g.id)}" ${g.canLinkNpc ? `data-cybercall-npc-link-drop data-cybercall-npc-thread-id="${t(g.id)}"` : ""}>
          <span class="cybercall-thread-avatar ${t(g.avatarTone)} ${g.isGroup ? "group" : ""}">
            ${g.image ? `<img src="${t(g.image)}" alt="">` : g.isGroup ? '<i class="fa-solid fa-user-group" aria-hidden="true"></i>' : t(g.initials)}
          </span>
          <span class="cybercall-thread-body">
            <strong>${t(g.title)}</strong>
            ${g.hasRouteLabel ? `
              <span class="cybercall-thread-route-row">
                <span class="cybercall-thread-route">${t(g.routeLabel)}</span>
                ${g.canLinkNpc ? `
                  <span class="cybercall-thread-npc-state ${g.hasNpcBinding ? "linked" : "unlinked"}" title="${t(g.npcBindingStatusLabel)}">
                    ${g.hasNpcBinding ? g.npcBindingImage ? `<img src="${t(g.npcBindingImage)}" alt="">` : '<i class="fa-solid fa-link" aria-hidden="true"></i>' : '<i class="fa-solid fa-link-slash" aria-hidden="true"></i>'}
                  </span>
                ` : ""}
              </span>
            ` : ""}
            <small>${t(g.lastPreview)}</small>
          </span>
          ${g.unread ? `<span class="cybercall-thread-unread">${g.unreadCount}</span>` : ""}
        </button>
      `).join("") : '<div class="cybercall-messages-empty">No messages yet.</div>', o = r.map((g) => `<option value="${t(g.id)}" ${e.selectedContactId === g.id ? "selected" : ""}>${t(g.name)} - ${t(g.number)}</option>`).join(""), i = e.canReplyAs ? `
      <label>
        <span>Reply As</span>
        <select name="replyAs">
          ${(e.replyAsChoices ?? []).map(
    (g) => `<option value="${t(g.id)}" ${g.selected ? "selected" : ""}>${t(g.label)}</option>`
  ).join("")}
        </select>
      </label>
    ` : "", u = e.canSendAs ? `
      <label>
        <span>Send As</span>
        <select name="sendAs">
          ${(e.sendAsChoices ?? []).map(
    (g) => `<option value="${t(g.id)}" ${g.selected ? "selected" : ""}>${t(g.label)}</option>`
  ).join("")}
        </select>
      </label>
    ` : "", l = e.isThreadReply ? `
      <div class="cybercall-thread-reply-target">
        <span>To</span>
        <strong>${t(e.threadReplyLabel ?? "")}</strong>
      </div>
    ` : `
      <label>
        <span>To</span>
        <select name="contactId" ${r.length ? "" : "disabled"}>
          ${o}
        </select>
      </label>
    `, c = (C = a == null ? void 0 : a.messages) != null && C.length ? a.messages.map((g) => `
        <article class="cybercall-message ${g.isMine ? "mine" : ""} ${g.isEvent ? "event" : ""}">
          <strong>${t(g.senderName)}</strong>
          <p>${t(g.body)}</p>
          ${e.showMessageTimestamps ? `<time>${t(g.createdAtLabel ?? g.createdAt)}</time>` : ""}
        </article>
      `).join("") : '<div class="cybercall-messages-empty">Select a thread or send a new message.</div>', f = `
    <form class="cybercall-group-form" data-cybercall-group-form>
      <label class="cybercall-group-name">
        <span>Group Name</span>
        <input type="text" name="groupName" maxlength="80" autocomplete="off" placeholder="Night City Crew" required>
      </label>
      <fieldset>
        <legend>Players</legend>
        <div class="cybercall-group-members">${(e.groupMemberChoices ?? []).length ? (e.groupMemberChoices ?? []).map((g) => `
        <label>
          <input type="checkbox" name="memberUserIds" value="${t(g.id)}">
          <span>${t(g.name)}${g.active ? "" : " (offline)"}</span>
        </label>
      `).join("") : "<p>No other player users are available.</p>"}</div>
      </fieldset>
      <p class="cybercall-group-hint">Members can read the full conversation and every reply is sent privately to the whole group.</p>
      <button type="submit" ${e.hasGroupMemberChoices ? "" : "disabled"}>Create Group</button>
    </form>
  `, b = a != null && a.showNpcLinkPanel ? `
    <section class="cybercall-npc-link-panel ${a.hasNpcBinding ? "linked" : "unlinked"}" data-cybercall-npc-link-drop data-cybercall-npc-thread-id="${t(a.id)}">
      <span class="cybercall-npc-link-avatar">
        ${a.npcBindingImage ? `<img src="${t(a.npcBindingImage)}" alt="">` : `<span>${t(a.npcBindingInitials)}</span>`}
      </span>
      <span class="cybercall-npc-link-copy">
        <small>NPC Identity</small>
        <strong>${t(a.npcBindingStatusLabel)}</strong>
        <em>${a.hasNpcBinding ? a.npcPortraitRevealed ? "Portrait shared with player" : "Portrait visible to GM only" : "Drop an Actor or Actor-backed Token here to link it."}</em>
      </span>
      ${a.hasNpcBinding ? `
        <span class="cybercall-npc-link-actions">
          <button type="button" data-cybercall-npc-action="toggle-reveal" data-cybercall-npc-thread-id="${t(a.id)}">${a.npcPortraitRevealed ? "Hide Portrait" : "Share Portrait"}</button>
          <button type="button" data-cybercall-npc-action="change" data-cybercall-npc-thread-id="${t(a.id)}">Change</button>
          <button type="button" data-cybercall-npc-action="unlink" data-cybercall-npc-thread-id="${t(a.id)}">Unlink</button>
        </span>
      ` : ""}
    </section>
  ` : "";
  return `
    <section class="cybercall-messages ${e.isFoundryV13Plus ? "cybercall-modern-messages" : ""}" data-cybercall-active-thread="${t(e.activeThreadId ?? "")}">
      <nav class="cybercall-mode-tabs">
        <button type="button" data-cybercall-message-action="open-calls" data-cybercall-mode-tab="calls">Calls</button>
        <button type="button" class="active" data-cybercall-mode-tab="messages">Messages</button>
      </nav>
      <aside class="cybercall-thread-list">
        <header>
          <h2>
            Messages
            ${e.gmViewPlayerMessagesEnabled ? `
              <span class="cybercall-gm-visibility" title="GM visibility is enabled: GMs can view player conversations." aria-label="GM visibility is enabled: GMs can view player conversations." tabindex="0">
                <i class="fa-solid fa-eye" aria-hidden="true"></i>
              </span>
            ` : ""}
          </h2>
          <div class="cybercall-message-header-actions">
            <button type="button" data-cybercall-message-action="new">New</button>
            <button type="button" data-cybercall-message-action="new-group">New Group</button>
            <button type="button" data-cybercall-message-action="refresh">Refresh</button>
          </div>
        </header>
        ${s}
      </aside>
      <main class="cybercall-conversation ${a != null && a.showNpcLinkPanel ? "has-npc-link" : ""}">
        <header>
          <div class="cybercall-conversation-identity">
            ${a ? `
              <span class="cybercall-conversation-avatar ${t(a.avatarTone)} ${a.isGroup ? "group" : ""}">
                ${a.image ? `<img src="${t(a.image)}" alt="">` : a.isGroup ? '<i class="fa-solid fa-user-group" aria-hidden="true"></i>' : t(a.initials)}
              </span>
            ` : ""}
            <div>
              <div class="cybercall-contacts-kicker">${a ? t(a.subtitle) : e.isComposingNewGroup ? "Private Player Channel" : "Secure Channel"}</div>
              <h3>${a ? t(a.title) : e.isComposingNewGroup ? "Create Group Chat" : "New Message"}</h3>
            </div>
          </div>
          ${e.canDeleteThread ? '<button type="button" class="cybercall-delete-thread" data-cybercall-message-action="delete-thread">Delete Thread</button>' : ""}
        </header>
        ${b}
        ${e.isComposingNewGroup ? f : `
          <div class="cybercall-message-log">${c}</div>
          <form class="cybercall-message-form ${e.canReplyAs ? "has-reply-as" : ""} ${e.canSendAs ? "has-send-as" : ""}" data-cybercall-message-form>
            ${l}
            ${i}
            ${u}
            <textarea name="body" rows="3" placeholder="Type message..." required></textarea>
            <button type="submit" ${r.length ? "" : "disabled"}>Send</button>
          </form>
        `}
      </main>
    </section>
  `;
}
const j = {
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
}, cn = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]);
function kt(e) {
  const t = Number(e);
  return Number.isNaN(t) ? j.signal : Math.min(100, Math.max(0, Math.round(t)));
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
function me(e = {}) {
  var r;
  const t = Array.isArray(e.targetUserIds) ? e.targetUserIds.map((s) => String(s)).filter(Boolean) : [], n = Array.isArray(e.targetUserNames) ? e.targetUserNames.map((s) => String(s)).filter(Boolean) : [], a = {
    ...j,
    ...e,
    id: String(e.id ?? he()),
    callerName: String(e.callerName ?? j.callerName),
    subtitle: String(e.subtitle ?? j.subtitle),
    image: String(e.image ?? j.image),
    message: String(e.message ?? j.message),
    signal: kt(e.signal ?? j.signal),
    variant: cn.has(e.variant) ? e.variant : j.variant,
    fullscreen: !!(e.fullscreen ?? j.fullscreen),
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
  return a.initials = H(a.callerName), a.showBroadcast = !!((r = game == null ? void 0 : game.user) != null && r.isGM && a.allowBroadcast), a.isStandard = a.variant === "standard", a.isEmergency = a.variant === "emergency", a.isCorrupted = a.variant === "corrupted", a.isIncoming = !a.accepted, a.hasTargets = a.targetUserIds.length > 0, a.recipientLabel = a.hasTargets ? a.targetUserNames.join(", ") : "All players", a.directionLabel = a.outgoing ? `Calling ${a.recipientLabel}` : `From ${a.callerName}`, a.kicker = a.outgoing ? "Outgoing CyberCall" : a.fullscreen ? "System-wide Broadcast" : "Incoming CyberCall", a;
}
function q(e = {}) {
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
function ln(e) {
  var a, r, s;
  const t = (e == null ? void 0 : e.document) ?? e, n = String(
    ((a = t == null ? void 0 : t.getTextureSrc) == null ? void 0 : a.call(t)) || ((r = t == null ? void 0 : t.texture) == null ? void 0 : r.src) || (t == null ? void 0 : t.img) || ((s = e == null ? void 0 : e.texture) == null ? void 0 : s.src) || ""
  ).trim();
  return n.includes("*") ? "" : n;
}
function je(e) {
  return !e || /(?:^|\/)mystery-man(?:-[^/.]+)?\.svg(?:$|\?)/i.test(e);
}
function Ue(e) {
  var g, I, M, D, E, L, te, le, V, X, ne, G;
  if (!e) return "";
  const t = globalThis.game, n = globalThis.canvas, a = String(e.avatar ?? ((g = e._source) == null ? void 0 : g.avatar) ?? "").trim();
  if (e.isGM === !0) return je(a) ? "" : a;
  const r = e.character ?? e.characterId ?? ((I = e._source) == null ? void 0 : I.character), s = typeof r == "string" ? r : String((r == null ? void 0 : r.id) ?? (r == null ? void 0 : r._id) ?? ""), o = Gt(e), i = Array.isArray((M = n == null ? void 0 : n.tokens) == null ? void 0 : M.placeables) ? n.tokens.placeables : [], u = String(((D = t == null ? void 0 : t.user) == null ? void 0 : D.id) ?? "") === String(e.id ?? "") ? ((E = n == null ? void 0 : n.tokens) == null ? void 0 : E.controlled) ?? [] : [], l = ((L = o == null ? void 0 : o.getActiveTokens) == null ? void 0 : L.call(o, !0, !0)) ?? [], c = i.find((U) => {
    var P, O;
    const R = String(((P = U == null ? void 0 : U.actor) == null ? void 0 : P.id) ?? ((O = U == null ? void 0 : U.document) == null ? void 0 : O.actorId) ?? (U == null ? void 0 : U.actorId) ?? "");
    return s && R === s;
  }), m = i.find((U) => {
    var P, O;
    const R = (U == null ? void 0 : U.actor) ?? ((P = U == null ? void 0 : U.document) == null ? void 0 : P.actor);
    return Number(((O = R == null ? void 0 : R.ownership) == null ? void 0 : O[e.id]) ?? 0) >= 3;
  }), f = [...u, ...l, c, m].filter(Boolean).map(ln).find(Boolean) ?? "";
  if (f) return f;
  const b = String(
    ((le = (te = o == null ? void 0 : o.prototypeToken) == null ? void 0 : te.texture) == null ? void 0 : le.src) || ((ne = (X = (V = o == null ? void 0 : o._source) == null ? void 0 : V.prototypeToken) == null ? void 0 : X.texture) == null ? void 0 : ne.src) || ""
  ).trim();
  if (b && !b.includes("*") && !je(b))
    return b;
  const C = String((o == null ? void 0 : o.img) ?? ((G = o == null ? void 0 : o._source) == null ? void 0 : G.img) ?? "").trim();
  return je(C) ? je(a) ? "" : a : C;
}
function Gt(e) {
  var r, s, o;
  if (!e) return null;
  const t = globalThis.game, n = e.character ?? e.characterId ?? ((r = e._source) == null ? void 0 : r.character), a = typeof n == "string" ? n : String((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n._id) ?? "");
  return (a ? (o = (s = t == null ? void 0 : t.actors) == null ? void 0 : s.get) == null ? void 0 : o.call(s, a) : null) ?? (typeof n == "object" ? n : null);
}
function K(e, t = "") {
  var a;
  const n = String(((a = Gt(e)) == null ? void 0 : a.name) ?? "").trim();
  return n || String((e == null ? void 0 : e.name) ?? "").trim() || t;
}
function Ut() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) ?? null;
}
function Et() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : n.api) ?? null;
}
function un(e = {}, t = {}) {
  var a, r, s;
  const n = ((r = (a = globalThis.foundry) == null ? void 0 : a.utils) == null ? void 0 : r.mergeObject) ?? ((s = foundry == null ? void 0 : foundry.utils) == null ? void 0 : s.mergeObject);
  return typeof n == "function" ? n(e, t, { inplace: !1 }) : { ...e, ...t };
}
function dn() {
  var e, t, n, a, r;
  return ((n = (t = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : t.randomID) == null ? void 0 : n.call(t, 8)) ?? ((r = (a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.randomID) == null ? void 0 : r.call(a, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function vt(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${dn()}`),
    tag: e.tag ?? "section",
    classes: Array.isArray(e.classes) ? e.classes : [],
    window: {
      title: e.title ?? "",
      icon: e.icon,
      resizable: e.resizable === !0
    },
    position: {
      width: Number(e.width ?? 600),
      height: e.height === "auto" ? "auto" : Number(e.height ?? 600)
    }
  };
}
function gn() {
  var t, n, a;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((a = game == null ? void 0 : game.release) == null ? void 0 : a.generation));
  return Number.isFinite(e) ? e : null;
}
function mn() {
  const e = gn();
  return e === null || e >= 13;
}
function Bt(e) {
  return class extends e {
    constructor(a = {}) {
      const r = un(new.target.defaultOptions ?? {}, a);
      super(vt(r));
      B(this, "_v1Options");
      this._v1Options = r;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return vt(this.defaultOptions ?? {});
    }
    activateListeners(a) {
    }
    async _renderHTML(a, r) {
      var l, c, m;
      const s = typeof this.getData == "function" ? await this.getData() : {}, o = ((l = this._v1Options) == null ? void 0 : l.template) ?? ((c = this.options) == null ? void 0 : c.template) ?? ((m = this.constructor.defaultOptions) == null ? void 0 : m.template);
      if (!o) return document.createDocumentFragment();
      const i = await globalThis.renderTemplate(o, s), u = document.createElement("template");
      return u.innerHTML = i.trim(), u.content;
    }
    _activateV1Form(a) {
      var s, o;
      if (typeof this._updateObject != "function") return;
      const r = (s = a.matches) != null && s.call(a, "form") ? a : (o = a.querySelector) == null ? void 0 : o.call(a, "form");
      r instanceof HTMLFormElement && r.addEventListener("submit", async (i) => {
        var l;
        i.preventDefault(), i.stopPropagation();
        const u = new FormData(r);
        await this._updateObject(i, u), ((l = this._v1Options) == null ? void 0 : l.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(a, r, s) {
      var c, m, f, b;
      r.replaceChildren(a);
      const o = globalThis.jQuery ?? globalThis.$, i = ((c = r.closest) == null ? void 0 : c.call(r, ".window-app, .app, .application")) ?? r, u = o ? o(i) : i;
      try {
        Object.defineProperty(this, "element", {
          value: u,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = u;
        } catch {
        }
      }
      const l = (m = this._v1Options) == null ? void 0 : m.classes;
      Array.isArray(l) && l.length && (r.classList.add(...l), (b = (f = r.closest) == null ? void 0 : f.call(r, ".window-app, .app, .application")) == null || b.classList.add(...l)), this._activateV1Form(r), typeof this.activateListeners == "function" && this.activateListeners(o ? o(r) : r);
    }
  };
}
function pn() {
  const e = Ut(), t = Et(), n = globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (n) return n;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? Bt(a) : null;
}
function fn() {
  const e = Ut(), t = Et(), n = globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (n) return n;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? Bt(a) : pn();
}
function bn() {
  var n, a, r, s, o, i;
  const e = ((a = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : a.api) ?? ((r = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : r.api) ?? null, t = ((o = (s = globalThis.foundry) == null ? void 0 : s.applications) == null ? void 0 : o.api) ?? ((i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function yn(e) {
  var A, T, Q, Me;
  const {
    moduleId: t,
    templatePath: n,
    composerTemplatePath: a,
    contactsTemplatePath: r,
    messagesTemplatePath: s,
    phoneTemplatePath: o,
    escapeHTML: i,
    getDefaultComposerData: u,
    getActorChoices: l,
    getPlayerChoices: c,
    getContacts: m,
    getGroupContacts: f,
    getMessageContext: b,
    getRingtoneChoices: C,
    getMessageSoundOptions: g,
    getSoundPath: I,
    getActiveContactsTab: M,
    canEditContactImages: D,
    bindCallControls: E,
    bindComposerControls: L,
    bindContactsControls: te,
    bindMessagesControls: le,
    stopRinging: V,
    clearActiveCall: X,
    clearActiveComposer: ne,
    clearActiveContacts: G,
    clearActiveMessages: U,
    clearActivePhone: R
  } = e, P = (T = (A = foundry == null ? void 0 : foundry.applications) == null ? void 0 : A.api) == null ? void 0 : T.ApplicationV2, O = (Me = (Q = foundry == null ? void 0 : foundry.applications) == null ? void 0 : Q.api) == null ? void 0 : Me.HandlebarsApplicationMixin, ue = bn(), de = mn();
  function Se() {
    var h;
    const w = m(), v = f(), p = M();
    return {
      contacts: w,
      groupContacts: v,
      hasContacts: w.length > 0,
      hasGroupContacts: v.length > 0,
      activeTab: p,
      isPersonalTab: p !== "group",
      isGroupTab: p === "group",
      canEditContactImages: D(),
      canManageNpcContacts: D(),
      actors: l(),
      unreadMessageCount: b().unreadCount,
      hasUnreadMessages: b().unreadCount > 0,
      ringtoneChoices: C(),
      messageSoundOptions: (h = game.user) != null && h.isGM ? [] : g(),
      currentRingtone: I()
    };
  }
  function Be() {
    return {
      call: u(),
      actors: l(),
      players: c(),
      ringtoneChoices: C()
    };
  }
  function ve(w, v = null) {
    var It, wt;
    const p = w === "messages", h = !p && ((It = game.user) == null ? void 0 : It.isGM), N = !p && !((wt = game.user) != null && wt.isGM);
    return {
      ...p ? b(v) : h ? Be() : Se(),
      mode: w,
      isMessagesMode: p,
      isComposerMode: h,
      isContactsMode: N,
      isCallsMode: !p
    };
  }
  function Ae(w, v) {
    var p;
    return w === "messages" ? Qe(v, i) : (p = game.user) != null && p.isGM ? Ye(v, i) : Je(v, i);
  }
  function ae(w) {
    const v = document.createElement("template");
    v.innerHTML = w.trim();
    const p = v.content.firstElementChild;
    return {
      main: p instanceof HTMLElement ? p : document.createElement("div")
    };
  }
  function Ne(w, v = null) {
    var p;
    if (w.mode === "messages") {
      le(w, v);
      return;
    }
    (p = game.user) != null && p.isGM ? L(w, v) : te(w, v);
  }
  class Pe extends ue {
    constructor(p, h = {}) {
      super(h);
      B(this, "callData");
      this.callData = me(p);
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
    async _renderInner(p) {
      try {
        return await super._renderInner(p);
      } catch (h) {
        return console.warn(`${t} | Template render failed, using inline fallback.`, h), $(St(this.callData, i));
      }
    }
    activateListeners(p) {
      super.activateListeners(p), E(this, p);
    }
    async close(p) {
      return X(this), V(), super.close(p);
    }
  }
  class Re extends ue {
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
        call: u(),
        actors: l(),
        players: c(),
        ringtoneChoices: C()
      };
    }
    async _renderInner(v) {
      try {
        return await super._renderInner(v);
      } catch (p) {
        return console.warn(`${t} | Composer template render failed, using inline fallback.`, p), $(Ye(v, i));
      }
    }
    activateListeners(v) {
      super.activateListeners(v), L(this, v);
    }
    async close(v) {
      return ne(this), super.close(v);
    }
  }
  class Oe extends ue {
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
      return Se();
    }
    async _renderInner(v) {
      try {
        return await super._renderInner(v);
      } catch (p) {
        return console.warn(`${t} | Contacts template render failed, using inline fallback.`, p), $(Je(v, i));
      }
    }
    activateListeners(v) {
      super.activateListeners(v), te(this, v);
    }
    async close(v) {
      return G(this), super.close(v);
    }
  }
  class De extends ue {
    constructor(p = "calls", h = null, N = {}) {
      super(N);
      B(this, "mode");
      B(this, "contact");
      this.mode = p, this.contact = h;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-phone",
        title: "CyberCall",
        template: o,
        classes: ["cybercall-phone-app"],
        popOut: !0,
        resizable: !0,
        width: 720,
        height: 640
      });
    }
    getData() {
      return ve(this.mode, this.contact);
    }
    async _renderInner(p) {
      try {
        return await super._renderInner(p);
      } catch (h) {
        return console.warn(`${t} | Phone template render failed, using inline fallback.`, h), $(Ae(this.mode, p));
      }
    }
    activateListeners(p) {
      super.activateListeners(p), Ne(this, p);
    }
    async close(p) {
      return R(this), super.close(p);
    }
  }
  class _e extends ue {
    constructor(p = null, h = {}) {
      super(h);
      B(this, "contact");
      this.contact = p;
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
      return b(this.contact);
    }
    async _renderInner(p) {
      try {
        return await super._renderInner(p);
      } catch (h) {
        return console.warn(`${t} | Messages template render failed, using inline fallback.`, h), $(Qe(p, i));
      }
    }
    activateListeners(p) {
      super.activateListeners(p), le(this, p);
    }
    async close(p) {
      return U(this), super.close(p);
    }
  }
  function Fe() {
    var w;
    return !de || !P || !O ? null : (w = class extends O(P) {
      constructor(h, N = {}) {
        super(N);
        B(this, "callData");
        this.callData = me(h);
      }
      async _prepareContext(h) {
        return {
          ...await super._prepareContext(h),
          call: this.callData
        };
      }
      async _renderHTML(h, N) {
        try {
          return await super._renderHTML(h, N);
        } catch (_) {
          return console.warn(`${t} | Template render failed, using inline fallback.`, _), ae(St(this.callData, i));
        }
      }
      _onRender(h, N) {
        var _;
        (_ = super._onRender) == null || _.call(this, h, N), E(this);
      }
      async close(h) {
        return X(this), V(), super.close(h);
      }
    }, B(w, "DEFAULT_OPTIONS", {
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
    }), B(w, "PARTS", {
      main: {
        template: n
      }
    }), w);
  }
  function Le() {
    var w;
    return !de || !P || !O ? null : (w = class extends O(P) {
      async _prepareContext(p) {
        return {
          ...await super._prepareContext(p),
          call: u(),
          actors: l(),
          players: c(),
          ringtoneChoices: C()
        };
      }
      async _renderHTML(p, h) {
        try {
          return await super._renderHTML(p, h);
        } catch (N) {
          return console.warn(`${t} | Composer template render failed, using inline fallback.`, N), ae(Ye(p, i));
        }
      }
      _onRender(p, h) {
        var N;
        (N = super._onRender) == null || N.call(this, p, h), L(this);
      }
      async close(p) {
        return ne(this), super.close(p);
      }
    }, B(w, "DEFAULT_OPTIONS", {
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
    }), B(w, "PARTS", {
      main: {
        template: a
      }
    }), w);
  }
  function xe() {
    var w;
    return !de || !P || !O ? null : (w = class extends O(P) {
      async _prepareContext(p) {
        return {
          ...await super._prepareContext(p),
          ...Se()
        };
      }
      async _renderHTML(p, h) {
        try {
          return await super._renderHTML(p, h);
        } catch (N) {
          return console.warn(`${t} | Contacts template render failed, using inline fallback.`, N), ae(Je(p, i));
        }
      }
      _onRender(p, h) {
        var N;
        (N = super._onRender) == null || N.call(this, p, h), te(this);
      }
      async close(p) {
        return G(this), super.close(p);
      }
    }, B(w, "DEFAULT_OPTIONS", {
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
    }), B(w, "PARTS", {
      main: {
        template: r
      }
    }), w);
  }
  function qe() {
    var w;
    return !de || !P || !O ? null : (w = class extends O(P) {
      constructor(h = "calls", N = null, _ = {}) {
        super(_);
        B(this, "mode");
        B(this, "contact");
        this.mode = h, this.contact = N;
      }
      async _prepareContext(h) {
        return {
          ...await super._prepareContext(h),
          ...ve(this.mode, this.contact)
        };
      }
      async _renderHTML(h, N) {
        try {
          return await super._renderHTML(h, N);
        } catch (_) {
          return console.warn(`${t} | Phone template render failed, using inline fallback.`, _), ae(Ae(this.mode, h));
        }
      }
      _onRender(h, N) {
        var _;
        (_ = super._onRender) == null || _.call(this, h, N), Ne(this);
      }
      async close(h) {
        return R(this), super.close(h);
      }
    }, B(w, "DEFAULT_OPTIONS", {
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
    }), B(w, "PARTS", {
      main: {
        template: o
      }
    }), w);
  }
  function Ve() {
    var w;
    return !de || !P || !O ? null : (w = class extends O(P) {
      constructor(h = null, N = {}) {
        super(N);
        B(this, "contact");
        this.contact = h;
      }
      async _prepareContext(h) {
        return {
          ...await super._prepareContext(h),
          ...b(this.contact)
        };
      }
      async _renderHTML(h, N) {
        try {
          return await super._renderHTML(h, N);
        } catch (_) {
          return console.warn(`${t} | Messages template render failed, using inline fallback.`, _), ae(Qe(h, i));
        }
      }
      _onRender(h, N) {
        var _;
        (_ = super._onRender) == null || _.call(this, h, N), le(this);
      }
      async close(h) {
        return U(this), super.close(h);
      }
    }, B(w, "DEFAULT_OPTIONS", {
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
    }), B(w, "PARTS", {
      main: {
        template: s
      }
    }), w);
  }
  return {
    CyberCallApplication: Fe() ?? Pe,
    CyberCallComposer: Le() ?? Re,
    CyberCallContacts: xe() ?? Oe,
    CyberCallMessages: Ve() ?? _e,
    CyberCallPhone: qe() ?? De
  };
}
const d = "cybercall", ce = `module.${d}`, hn = `modules/${d}/templates/cybercall.hbs`, Cn = `modules/${d}/templates/cybercall-composer.hbs`, In = `modules/${d}/templates/cybercall-contacts.hbs`, wn = `modules/${d}/templates/cybercall-messages.hbs`, Sn = `modules/${d}/templates/cybercall-phone.hbs`, vn = `modules/${d}/templates/ringtone-settings.hbs`, ye = "phoneMessage", Pt = 3, tt = {
  "": "Silent",
  [`modules/${d}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${d}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${d}/audio/Ringtone3.ogg`]: "Ringtone 3"
}, Rt = `modules/${d}/audio/Ringtone1.ogg`, An = fn();
function Ot(e) {
  var n;
  const t = ((n = e.split("/").pop()) == null ? void 0 : n.replace(/\.[^.]+$/, "")) ?? "Custom ringtone";
  try {
    return decodeURIComponent(t);
  } catch {
    return t;
  }
}
function se(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  return e.flatMap((n) => {
    const a = String((n == null ? void 0 : n.path) ?? "").trim();
    return !a || t.has(a) ? [] : (t.add(a), [{ label: String((n == null ? void 0 : n.label) ?? "").trim() || Ot(a), path: a }]);
  });
}
function nt() {
  var n, a, r, s, o, i, u, l, c;
  const e = globalThis.foundry;
  return [
    typeof FilePicker < "u" ? FilePicker : null,
    globalThis.FilePicker,
    (r = (a = (n = e == null ? void 0 : e.applications) == null ? void 0 : n.apps) == null ? void 0 : a.FilePicker) == null ? void 0 : r.implementation,
    (o = (s = e == null ? void 0 : e.applications) == null ? void 0 : s.apps) == null ? void 0 : o.FilePicker,
    (u = (i = e == null ? void 0 : e.applications) == null ? void 0 : i.api) == null ? void 0 : u.FilePicker,
    (c = (l = e == null ? void 0 : e.appv1) == null ? void 0 : l.api) == null ? void 0 : c.FilePicker
  ].find((m) => typeof m == "function") ?? null;
}
function Nn(e, t) {
  var a;
  const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? ((a = e.element) == null ? void 0 : a[0]) ?? e.element ?? null;
  return n instanceof HTMLElement ? n : null;
}
function Mn(e) {
  const t = document.createElement("div");
  return t.className = "cybercall-ringtone-config-row", t.dataset.ringtoneRow = "", t.innerHTML = `
    <label class="cybercall-ringtone-config-field">
      <span>Display name</span>
      <input type="text" data-ringtone-label name="ringtones.${e}.label" placeholder="For example: Urgent Call">
    </label>
    <label class="cybercall-ringtone-config-field">
      <span>Audio file</span>
      <div class="cybercall-ringtone-config-path">
        <input type="text" data-ringtone-path name="ringtones.${e}.path" placeholder="Choose an audio file…">
        <button type="button" class="cybercall-ringtone-browse" data-ringtone-browse title="Choose audio file" aria-label="Choose audio file"><i class="fa-solid fa-folder-open"></i></button>
      </div>
    </label>
    <button type="button" class="cybercall-ringtone-remove" data-ringtone-remove title="Remove ringtone" aria-label="Remove ringtone"><i class="fa-solid fa-trash"></i></button>`, t;
}
class Dt extends An {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-ringtone-settings",
      title: "CyberCall Ringtones",
      template: vn,
      classes: ["cybercall-ringtone-settings-app"],
      width: 680,
      height: "auto",
      resizable: !0,
      closeOnSubmit: !0
    });
  }
  getData() {
    return {
      ringtones: se(game.settings.get(d, "customRingtones"))
    };
  }
  activateListeners(t) {
    var r;
    super.activateListeners(t);
    const n = Nn(this, t), a = n == null ? void 0 : n.querySelector("[data-ringtone-list]");
    !n || !a || ((r = n.querySelector("[data-ringtone-add]")) == null || r.addEventListener("click", () => {
      var o;
      const s = Mn(a.querySelectorAll("[data-ringtone-row]").length);
      (o = a.querySelector("[data-ringtone-empty]")) == null || o.before(s);
    }), n.addEventListener("click", (s) => {
      var b, C, g, I, M, D;
      const o = s.target, i = (b = o == null ? void 0 : o.closest) == null ? void 0 : b.call(o, "[data-ringtone-remove]");
      if (i) {
        (C = i.closest("[data-ringtone-row]")) == null || C.remove();
        return;
      }
      const u = (g = o == null ? void 0 : o.closest) == null ? void 0 : g.call(o, "[data-ringtone-browse]");
      if (!u) return;
      const l = u.closest("[data-ringtone-row]"), c = l == null ? void 0 : l.querySelector("[data-ringtone-path]"), m = nt();
      if (!c || !m) {
        (M = (I = ui.notifications) == null ? void 0 : I.warn) == null || M.call(I, "Foundry FilePicker is unavailable.");
        return;
      }
      const f = new m({
        type: "audio",
        current: c.value,
        callback: (E) => {
          c.value = E;
          const L = l == null ? void 0 : l.querySelector("[data-ringtone-label]");
          L && !L.value.trim() && (L.value = Ot(E));
        }
      });
      typeof f.browse == "function" ? f.browse() : (D = f.render) == null || D.call(f, !0);
    }));
  }
  async _updateObject(t) {
    var r, s;
    const a = [...t.currentTarget.querySelectorAll("[data-ringtone-row]")].map((o) => {
      var i, u;
      return {
        label: ((i = o.querySelector("[data-ringtone-label]")) == null ? void 0 : i.value) ?? "",
        path: ((u = o.querySelector("[data-ringtone-path]")) == null ? void 0 : u.value) ?? ""
      };
    });
    await game.settings.set(d, "customRingtones", se(a)), (s = (r = ui.notifications) == null ? void 0 : r.info) == null || s.call(r, "CyberCall ringtones saved.");
  }
}
function ke() {
  var n, a;
  const e = ((n = game.user) == null ? void 0 : n.getFlag(d, "messageSound")) ?? {}, t = (a = game.user) != null && a.isGM || game.settings.get(d, "shareMessageSounds") !== !1 ? se(game.settings.get(d, "customMessageSounds")) : [];
  return se([
    ...e.path ? [{ label: e.label || "My uploaded sound", path: e.path }] : [],
    ...t
  ]);
}
function at() {
  var t, n;
  const e = (n = (t = game.user) == null ? void 0 : t.getFlag(d, "messageSound")) == null ? void 0 : n.selected;
  return ke().some((a) => a.path === e) ? e : "";
}
function $n() {
  const e = at();
  return [
    { value: "", label: "Built-in notification tone", selected: !e },
    ...ke().map(({ path: t, label: n }) => ({ value: t, label: n, selected: t === e }))
  ];
}
async function Tn(e) {
  if (e && !ke().some((n) => n.path === e)) return;
  const t = game.user.getFlag(d, "messageSound") ?? {};
  await game.user.setFlag(d, "messageSound", { ...t, selected: e });
}
function He() {
  var e, t, n;
  return ((e = game.user) == null ? void 0 : e.isGM) || ((n = (t = game.user) == null ? void 0 : t.can) == null ? void 0 : n.call(t, "FILES_BROWSE")) === !0;
}
class kn extends Dt {
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      id: "cybercall-message-sound-settings",
      title: "CyberCall Message Notification Sounds",
      template: `modules/${d}/templates/message-sound-settings.hbs`
    };
  }
  getData() {
    var a, r, s, o, i;
    const t = ((a = game.user) == null ? void 0 : a.getFlag(d, "messageSound")) ?? {}, n = at();
    return {
      isGM: ((r = game.user) == null ? void 0 : r.isGM) === !0,
      shareSounds: game.settings.get(d, "shareMessageSounds") !== !1,
      canChooseFile: He(),
      canUpload: ((s = game.user) == null ? void 0 : s.isGM) || ((i = (o = game.user) == null ? void 0 : o.can) == null ? void 0 : i.call(o, "FILES_UPLOAD")) === !0,
      personal: t,
      usePersonal: !!t.path && n === t.path,
      useDefault: !n,
      sounds: ke().filter((u) => u.path !== t.path).map((u) => ({ ...u, selected: n === u.path })),
      ringtones: se(game.settings.get(d, "customMessageSounds"))
    };
  }
  activateListeners(t) {
    var i;
    super.activateListeners(t);
    const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? ((i = this.element) == null ? void 0 : i[0]) ?? this.element, a = n == null ? void 0 : n.querySelector("[data-message-sound-selection]"), r = n == null ? void 0 : n.querySelector("[data-personal-sound]"), s = n == null ? void 0 : n.querySelector("[data-message-sound-browse]");
    if (!a || !r || !s) return;
    const o = () => {
      r.disabled = s.disabled = a.value === "";
    };
    a.addEventListener("change", o), o(), s.addEventListener("click", () => {
      var c, m, f;
      if (s.disabled || !He()) return;
      const u = nt();
      if (!u) return (m = (c = ui.notifications) == null ? void 0 : c.warn) == null ? void 0 : m.call(c, "Foundry FilePicker is unavailable.");
      const l = new u({
        type: "audio",
        current: r.value,
        callback: (b) => {
          r.value = b, a.value = "personal", o();
        }
      });
      typeof l.browse == "function" ? l.browse() : (f = l.render) == null || f.call(l, !0);
    });
  }
  async _updateObject(t) {
    var u, l, c, m, f;
    const n = t.currentTarget, a = game.user.getFlag(d, "messageSound") ?? {}, r = He() ? ((u = n.querySelector("[data-personal-sound]")) == null ? void 0 : u.value.trim()) ?? "" : a.path ?? "";
    if (game.user.isGM) {
      const b = [...n.querySelectorAll("[data-ringtone-row]")].map((C) => {
        var g, I;
        return {
          label: (g = C.querySelector("[data-ringtone-label]")) == null ? void 0 : g.value,
          path: (I = C.querySelector("[data-ringtone-path]")) == null ? void 0 : I.value
        };
      });
      r && r !== a.path && b.push({ label: "", path: r }), await game.settings.set(d, "customMessageSounds", se(b)), await game.settings.set(d, "shareMessageSounds", ((l = n.querySelector("[data-share-message-sounds]")) == null ? void 0 : l.checked) === !0);
    }
    const s = ((c = n.querySelector("[data-message-sound-selection]")) == null ? void 0 : c.value) ?? "", o = s === "personal" ? r : s, i = o === r || ke().some((b) => b.path === o);
    await game.user.setFlag(d, "messageSound", { path: r, selected: i ? o : "" }), (f = (m = ui.notifications) == null ? void 0 : m.info) == null || f.call(m, "CyberCall message notification sound saved.");
  }
}
function pe(e) {
  var n;
  if ((n = foundry == null ? void 0 : foundry.utils) != null && n.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
function k(e, t = "") {
  return String(e ?? t).trim();
}
function ge(e) {
  return [...new Set(e.map((t) => k(t)).filter(Boolean))];
}
function Gn() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function _t(e) {
  const t = k(e, "cybercall");
  let n = 0;
  for (let a = 0; a < t.length; a += 1)
    n = (n << 5) - n + t.charCodeAt(a) | 0;
  return `tone-${Math.abs(n) % 8 + 1}`;
}
function At(e, t) {
  return ["direct", ...[e, t].sort()].join(":");
}
function Un() {
  return `msg-${he()}`;
}
function En(e = he()) {
  return `group:${k(e)}`;
}
function Ee(e, t = ((n) => (n = game == null ? void 0 : game.user) == null ? void 0 : n.id)()) {
  const a = q(e);
  if (e != null && e.userId)
    return At(`user:${k(t, "unknown")}`, `user:${k(e.userId)}`);
  const r = a.number || a.id || a.name;
  return At(`user:${k(t, "unknown")}`, `contact:${r}`);
}
function rt(e = {}) {
  var t;
  return {
    id: k(e.id) || Un(),
    threadId: k(e.threadId) || Ee({ number: ((t = e.recipientNumbers) == null ? void 0 : t[0]) ?? e.senderNumber }),
    senderUserId: k(e.senderUserId),
    senderActorId: k(e.senderActorId),
    senderName: k(e.senderName, "Unknown Sender"),
    senderNumber: k(e.senderNumber),
    senderImage: k(e.senderImage),
    recipientUserIds: ge(e.recipientUserIds ?? []),
    recipientActorIds: ge(e.recipientActorIds ?? []),
    recipientNumbers: ge(e.recipientNumbers ?? []),
    contactName: k(e.contactName),
    contactImage: k(e.contactImage),
    contactUserId: k(e.contactUserId),
    contactManagedByGM: e.contactManagedByGM === !0,
    contactIsNpc: e.contactIsNpc === !0,
    body: k(e.body),
    messageType: k(e.messageType, "text") || "text",
    eventType: k(e.eventType),
    conversationType: k(e.conversationType, e.groupId ? "group" : "direct") || "direct",
    groupId: k(e.groupId),
    groupName: k(e.groupName),
    groupMemberUserIds: ge(e.groupMemberUserIds ?? []),
    groupMemberNames: ge(e.groupMemberNames ?? []),
    createdAt: k(e.createdAt) || Gn(),
    chatMessageId: k(e.chatMessageId),
    schemaVersion: Number(e.schemaVersion ?? Pt)
  };
}
function Ft(e, t = [], n = "", a = {}) {
  const r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (const i of t) {
    const u = q(i), l = { ...u, userId: i == null ? void 0 : i.userId, userIds: (i == null ? void 0 : i.userIds) ?? u.userIds };
    u.number && r.set(u.number, l), i != null && i.userId && s.set(String(i.userId), l);
  }
  const o = /* @__PURE__ */ new Map();
  for (const i of e.map(rt).filter((u) => u.body)) {
    const u = o.get(i.threadId) ?? [];
    u.push(i), o.set(i.threadId, u);
  }
  return [...o.entries()].map(([i, u]) => {
    var ve, Ae, ae, Ne, Pe, Re, Oe, De, _e, Fe, Le, xe, qe, Ve;
    const l = u.sort((A, T) => A.createdAt.localeCompare(T.createdAt)), c = l[l.length - 1] ?? null, m = [...l].reverse().find((A) => A.conversationType === "group" || A.groupId), f = !!m, b = (m == null ? void 0 : m.groupId) || (f ? i.replace(/^group:/, "") : ""), C = (m == null ? void 0 : m.groupName) || (f ? "Group Chat" : ""), g = f ? ge(l.flatMap((A) => [
      ...A.groupMemberUserIds,
      A.senderUserId,
      ...A.recipientUserIds
    ])) : [], I = f ? ge(l.flatMap((A) => A.groupMemberNames)) : [], M = I.length ? I : g.map((A) => {
      var T, Q;
      return K((Q = (T = game.users) == null ? void 0 : T.get) == null ? void 0 : Q.call(T, A));
    }).filter(Boolean), D = (c == null ? void 0 : c.senderUserId) === ((ve = game == null ? void 0 : game.user) == null ? void 0 : ve.id) ? (Ae = c == null ? void 0 : c.recipientUserIds) == null ? void 0 : Ae.find((A) => {
      var T;
      return A !== ((T = game == null ? void 0 : game.user) == null ? void 0 : T.id);
    }) : c == null ? void 0 : c.senderUserId, E = (c == null ? void 0 : c.senderUserId) === ((ae = game == null ? void 0 : game.user) == null ? void 0 : ae.id) ? ((Ne = c == null ? void 0 : c.recipientNumbers) == null ? void 0 : Ne[0]) || "" : (c == null ? void 0 : c.senderNumber) || ((Pe = c == null ? void 0 : c.recipientNumbers) == null ? void 0 : Pe[0]) || "", L = c != null && c.contactName && !(c != null && c.contactUserId) && (c.contactIsNpc || c.contactManagedByGM) ? {
      id: `contact-${((Re = c.recipientNumbers) == null ? void 0 : Re[0]) || c.senderNumber || i}`,
      name: c.contactName,
      number: ((Oe = c.recipientNumbers) == null ? void 0 : Oe[0]) || c.senderNumber || "",
      image: c.contactImage || "",
      actorId: ((De = c.recipientActorIds) == null ? void 0 : De[0]) ?? c.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: H(c.contactName)
    } : null, te = (c == null ? void 0 : c.senderUserId) !== ((_e = game == null ? void 0 : game.user) == null ? void 0 : _e.id) && (c != null && c.senderNumber) && (c != null && c.contactName) ? {
      id: `contact-${c.senderNumber || i}`,
      name: c.contactName,
      number: c.senderNumber,
      image: c.contactImage || "",
      actorId: c.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: H(c.contactName)
    } : null, V = (f ? {
      id: `group-${b || i}`,
      name: C,
      number: `${g.length} member${g.length === 1 ? "" : "s"}`,
      image: "",
      actorId: "",
      userId: "",
      userIds: g.filter((A) => {
        var T;
        return A !== ((T = game == null ? void 0 : game.user) == null ? void 0 : T.id);
      }),
      managedByGM: !1,
      isNpc: !1,
      isGroup: !0,
      initials: H(C)
    } : null) ?? L ?? te ?? s.get(D) ?? r.get(E) ?? {
      id: `contact-${E || i}`,
      name: (c == null ? void 0 : c.contactName) || ((c == null ? void 0 : c.senderUserId) === ((Fe = game == null ? void 0 : game.user) == null ? void 0 : Fe.id) ? E || "Unknown Contact" : (c == null ? void 0 : c.senderName) || E || "Unknown Contact"),
      number: E,
      image: (c == null ? void 0 : c.contactImage) || "",
      actorId: ((Le = c == null ? void 0 : c.recipientActorIds) == null ? void 0 : Le[0]) ?? "",
      userId: "",
      userIds: [],
      managedByGM: !!(c != null && c.contactName || (xe = c == null ? void 0 : c.recipientActorIds) != null && xe[0]),
      isNpc: !!(c != null && c.contactName || (qe = c == null ? void 0 : c.recipientActorIds) != null && qe[0]),
      initials: H((c == null ? void 0 : c.contactName) || (c == null ? void 0 : c.senderName) || E)
    }, X = f ? null : [...l].reverse().find(
      (A) => A.senderUserId === D && A.senderImage
    ), ne = [...l].reverse().find((A) => {
      var Q, Me;
      const T = (Me = (Q = game.users) == null ? void 0 : Q.get) == null ? void 0 : Me.call(Q, A.senderUserId);
      return A.senderUserId && (T == null ? void 0 : T.isGM) !== !0 && !A.contactUserId && !!A.contactName && (A.contactIsNpc || A.contactManagedByGM);
    }) ?? null, G = ((Ve = game == null ? void 0 : game.user) == null ? void 0 : Ve.isGM) === !0 ? ne : null, U = G ? `TO: ${G.contactName}` : "", R = G ? s.get(G.senderUserId) : null, P = (G == null ? void 0 : G.senderName) || (R == null ? void 0 : R.name) || V.name || (c == null ? void 0 : c.senderName) || "Unknown Contact", O = G ? (R == null ? void 0 : R.number) || `@${G.senderName}` : V.number || (c == null ? void 0 : c.senderNumber) || "", ue = G ? H(P) : V.initials || H(V.name || (c == null ? void 0 : c.senderName)), de = (G == null ? void 0 : G.senderImage) || (R == null ? void 0 : R.image) || (X == null ? void 0 : X.senderImage) || V.image || "", Se = a[i] ?? "", Be = l.filter(
      (A) => {
        var T;
        return A.senderUserId !== ((T = game == null ? void 0 : game.user) == null ? void 0 : T.id) && A.createdAt > Se;
      }
    );
    return {
      id: i,
      title: P,
      subtitle: O,
      initials: ue,
      image: de,
      avatarTone: _t(f ? b || i : (G == null ? void 0 : G.senderUserId) || V.userId || V.number || i),
      routeLabel: U,
      hasRouteLabel: !!U,
      isNpcRouted: !!ne,
      contact: V,
      messages: l.map((A) => {
        var T;
        return {
          ...A,
          isMine: A.senderUserId === ((T = game == null ? void 0 : game.user) == null ? void 0 : T.id),
          isEvent: A.messageType !== "text"
        };
      }),
      lastMessage: c,
      lastPreview: (c == null ? void 0 : c.body) ?? "",
      updatedAt: (c == null ? void 0 : c.createdAt) ?? "",
      unread: Be.length > 0,
      unreadCount: Be.length,
      active: i === n,
      isGroup: f,
      groupId: b,
      groupName: C,
      groupMemberUserIds: g,
      groupMemberNames: M
    };
  }).sort((i, u) => u.updatedAt.localeCompare(i.updatedAt));
}
function Bn(e) {
  var n, a, r;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[d]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, d, "message"));
  return (t == null ? void 0 : t.kind) === ye ? t : ((r = t == null ? void 0 : t.message) == null ? void 0 : r.kind) === ye ? t.message : null;
}
function Pn(e) {
  return String(e != null && e.timestamp ? new Date(e.timestamp).toISOString() : (e == null ? void 0 : e.createdTime) ?? "");
}
function Rn() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => t.id);
}
function st(e) {
  return [...new Set(e.map((t) => String(t ?? "").trim()).filter(Boolean))];
}
function On(e) {
  const t = Array.isArray(e == null ? void 0 : e.whisper) ? e.whisper : [];
  return st(t.map((n) => (n == null ? void 0 : n.id) ?? n));
}
function Dn(e, t) {
  var s, o;
  const n = String(((s = game.user) == null ? void 0 : s.id) ?? "").trim();
  if (!n) return !1;
  if (e.senderUserId === n || e.recipientUserIds.includes(n)) return !0;
  if (((o = game.user) == null ? void 0 : o.isGM) === !0)
    return !e.contactUserId && (e.contactManagedByGM || e.contactIsNpc) ? !0 : game.settings.get(d, "gmViewPlayerMessages") === !0;
  const r = On(t);
  return r.length && !r.includes(n), !1;
}
function _n(e) {
  const t = Array.isArray(e == null ? void 0 : e.userIds) ? e.userIds : e != null && e.userId ? [e.userId] : [], n = st(t);
  return n.length ? n : Rn();
}
function Fn(e) {
  return !!(e != null && e.userId || Array.isArray(e == null ? void 0 : e.userIds) && e.userIds.length);
}
function Ln(e, t) {
  const n = e.senderName || "CyberCall", a = t != null && t.name ? `<span>${pe(t.name)}</span>` : "";
  return `
    <div class="cybercall-chat-card${e.messageType !== "text" ? " cybercall-chat-card--event" : ""}" data-cybercall-thread-id="${pe(e.threadId)}">
      <strong>${pe(n)}</strong>
      ${a}
      <p>${pe(e.body)}</p>
      <button type="button" data-cybercall-open-thread data-cybercall-thread-id="${pe(e.threadId)}">Open CyberCall</button>
    </div>
  `;
}
function xn() {
  var t;
  return (((t = game.messages) == null ? void 0 : t.contents) ?? []).map((n) => {
    const a = Bn(n);
    if (!a) return null;
    const r = rt({
      ...a,
      chatMessageId: n.id,
      createdAt: a.createdAt || Pn(n)
    });
    return Dn(r, n) ? r : null;
  }).filter(Boolean);
}
async function it(e, t, n = {}) {
  var C;
  const a = q(e), r = String(t ?? "").trim();
  if (!r) return null;
  const s = game.user, o = n.recipientUserIds ? st(n.recipientUserIds) : _n(e), i = !Fn(e), u = String(n.threadId ?? Ee(e, s == null ? void 0 : s.id)), l = String(n.senderName ?? "").trim() || K(s, "Unknown Sender"), c = String(n.senderActorId ?? ((C = s == null ? void 0 : s.character) == null ? void 0 : C.id) ?? "").trim(), m = String(n.senderNumber ?? "").trim(), f = rt({
    threadId: u,
    senderUserId: (s == null ? void 0 : s.id) ?? "",
    senderActorId: c,
    senderName: l,
    senderNumber: m,
    senderImage: String(n.senderImage ?? Ue(s)).trim(),
    recipientUserIds: o,
    recipientActorIds: a.actorId ? [a.actorId] : [],
    recipientNumbers: n.recipientNumbers ?? (a.number ? [a.number] : []),
    contactName: String(n.contactName ?? a.name ?? ""),
    contactImage: String(n.contactImage ?? a.image ?? ""),
    contactUserId: String(n.contactUserId ?? a.userId ?? ""),
    contactManagedByGM: n.contactManagedByGM ?? (a.managedByGM === !0 || i),
    contactIsNpc: n.contactIsNpc ?? (a.isNpc === !0 || i),
    body: r,
    messageType: String(n.messageType ?? "text"),
    eventType: String(n.eventType ?? ""),
    conversationType: String(n.conversationType ?? "direct"),
    groupId: String(n.groupId ?? ""),
    groupName: String(n.groupName ?? ""),
    groupMemberUserIds: n.groupMemberUserIds ?? [],
    groupMemberNames: n.groupMemberNames ?? [],
    schemaVersion: Pt
  }), b = [...new Set([s == null ? void 0 : s.id, ...o].filter(Boolean))];
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: f.senderName }),
    whisper: b,
    content: Ln(f, a),
    flags: {
      [d]: {
        kind: ye,
        ...f
      }
    }
  });
}
async function qn(e, t, n = {}) {
  return it(e, t, {
    ...n,
    messageType: n.messageType ?? "event"
  });
}
let y = null, S = null, Z = null, x = null, Y = null, fe = "personal", F = "", J = !1, W = !1, re = null, be = null;
function Vn() {
  var e, t, n, a, r, s, o, i;
  return me({
    callerName: ((e = y == null ? void 0 : y.callData) == null ? void 0 : e.callerName) ?? j.callerName,
    subtitle: ((t = y == null ? void 0 : y.callData) == null ? void 0 : t.subtitle) ?? j.subtitle,
    image: ((n = y == null ? void 0 : y.callData) == null ? void 0 : n.image) ?? "",
    message: ((a = y == null ? void 0 : y.callData) == null ? void 0 : a.message) ?? j.message,
    signal: ((r = y == null ? void 0 : y.callData) == null ? void 0 : r.signal) ?? game.settings.get(d, "defaultSignal"),
    variant: ((s = y == null ? void 0 : y.callData) == null ? void 0 : s.variant) ?? "standard",
    fullscreen: ((o = y == null ? void 0 : y.callData) == null ? void 0 : o.fullscreen) ?? !1,
    ringing: ((i = y == null ? void 0 : y.callData) == null ? void 0 : i.ringing) ?? !0
  });
}
function jn() {
  var e;
  return (((e = game.actors) == null ? void 0 : e.contents) ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    img: t.img ?? ""
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function zn() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => !t.isGM).map((t) => ({
    id: t.id,
    name: K(t, "Unknown Player"),
    active: t.active === !0
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function Wn() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => {
    var n;
    return !t.isGM && t.id !== ((n = game.user) == null ? void 0 : n.id);
  }).map((t) => ({
    id: String(t.id),
    name: K(t, "Unknown Player"),
    active: t.active === !0
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function Kn() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => {
    var n;
    return t.id !== ((n = game.user) == null ? void 0 : n.id);
  }).map((t) => {
    const n = K(t, "Unknown Player");
    return {
      id: `user-${t.id}`,
      name: n,
      number: `@${n}`,
      image: Ue(t),
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
function Lt() {
  const e = game.settings.get(d, "contacts");
  return Array.isArray(e) ? { [Ce()]: e } : !e || typeof e != "object" ? {} : e;
}
function Ie() {
  const e = Lt()[Ce()];
  return Array.isArray(e) ? e.map(q).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function ie() {
  if (Array.isArray(be))
    return be.map(q).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name));
  const e = game.settings.get(d, "groupContacts");
  return Array.isArray(e) ? e.map(q).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function ot() {
  const e = /* @__PURE__ */ new Map();
  for (const t of [...Kn(), ...ie(), ...Ie()]) {
    const n = t.userId ? `user:${t.userId}` : `number:${t.number || t.id}`;
    e.has(n) || e.set(n, t);
  }
  return [...e.values()].sort((t, n) => t.name.localeCompare(n.name));
}
async function xt(e) {
  await game.settings.set(d, "contacts", {
    ...Lt(),
    [Ce()]: e.map(q)
  });
}
async function ze(e) {
  be = e.map(q), await game.settings.set(d, "groupContacts", be), game.socket.emit(ce, {
    action: "groupContactsChanged",
    contacts: be
  });
}
function ct() {
  const e = game.settings.get(d, "messageReadState");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function qt() {
  const e = game.settings.get(d, "messageDeletedBefore");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function lt() {
  const e = game.settings.get(d, "npcThreadBindings");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
async function Ze(e, t) {
  var a;
  if (!((a = game.user) != null && a.isGM) || !e) return;
  const n = { ...lt() };
  t === null ? delete n[e] : n[e] = { ...n[e] ?? {}, ...t }, await game.settings.set(d, "npcThreadBindings", n);
}
function Vt() {
  const e = qt();
  return xn().filter((t) => {
    const n = e[t.threadId];
    return !n || t.createdAt > n;
  });
}
function jt() {
  return Ft(Vt(), ot(), "", ct()).reduce((e, t) => e + Number(t.unreadCount ?? 0), 0);
}
async function Yn(e, t = (/* @__PURE__ */ new Date()).toISOString()) {
  e && await game.settings.set(d, "messageReadState", {
    ...ct(),
    [e]: t
  });
}
async function Te() {
  F && await Yn(F);
}
async function Jn(e) {
  e && (await game.settings.set(d, "messageDeletedBefore", {
    ...qt(),
    [e]: (/* @__PURE__ */ new Date()).toISOString()
  }), F === e && (F = "", J = !0, W = !1, Y && (Y.contact = null), (S == null ? void 0 : S.mode) === "messages" && (S.contact = null)), await z(), await ee());
}
async function Qn(e, t, n = "personal", a = "", r = {}) {
  var u, l, c, m, f, b, C;
  const s = r.actorId ? (u = game.actors) == null ? void 0 : u.get(r.actorId) : null, o = q({
    name: String(e ?? "").trim() || (s == null ? void 0 : s.name),
    number: t,
    image: $e() && (String(a ?? "").trim() || (s == null ? void 0 : s.img)) || "",
    actorId: $e() ? r.actorId : "",
    managedByGM: $e() ? r.managedByGM === !0 : !1,
    isNpc: $e() ? r.isNpc === !0 || r.managedByGM === !0 || !!r.actorId : !1
  });
  if (!o.name || !o.number) {
    (c = (l = ui.notifications) == null ? void 0 : l.warn) == null || c.call(l, "Contact name and number are required.");
    return;
  }
  if (n === "group" && !game.user.isGM) {
    if (!ut()) {
      (f = (m = ui.notifications) == null ? void 0 : m.warn) == null || f.call(m, "A GM must be connected to update group contacts.");
      return;
    }
    game.socket.emit(ce, {
      action: "groupContactAdd",
      contact: o
    }), (C = (b = ui.notifications) == null ? void 0 : b.info) == null || C.call(b, "Group contact update sent to the GM.");
    return;
  }
  const i = n === "group" ? ie() : Ie();
  i.push(o), n === "group" ? await ze(i) : await xt(i), await ee();
}
async function Hn(e, t = "personal") {
  var n, a, r, s;
  if (t === "group") {
    if (!game.user.isGM) {
      if (!ut()) {
        (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(ce, {
        action: "groupContactRemove",
        contactId: e
      }), (s = (r = ui.notifications) == null ? void 0 : r.info) == null || s.call(r, "Group contact removal sent to the GM.");
      return;
    }
    await ze(ie().filter((o) => o.id !== e));
  } else
    await xt(Ie().filter((o) => o.id !== e));
  await ee();
}
function ut() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function Ke(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(d, "minimumRole");
  } catch (n) {
    console.warn(`${d} | Permission setting unavailable, using Player role fallback.`, n);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function $e(e = game.user) {
  return !!(e != null && e.isGM);
}
function we(e, t = null) {
  var n;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (n = e.element) != null && n[0] ? e.element[0] : e.element ?? null;
}
const Xn = 24;
function Zn(e) {
  var s, o, i;
  const t = we(e), n = (s = t == null ? void 0 : t.querySelector) == null ? void 0 : s.call(t, ".cybercall-message-log");
  if (!(n instanceof HTMLElement)) return null;
  const a = (o = t.querySelector) == null ? void 0 : o.call(t, "[data-cybercall-active-thread]"), r = n.scrollHeight - n.clientHeight - n.scrollTop;
  return {
    threadId: String(((i = a == null ? void 0 : a.dataset) == null ? void 0 : i.cybercallActiveThread) ?? ""),
    scrollTop: n.scrollTop,
    stickToBottom: r <= Xn
  };
}
function ea(e, t) {
  var l;
  const n = t.querySelector(".cybercall-message-log");
  if (!(n instanceof HTMLElement)) return;
  const a = e == null ? void 0 : e._cybercallMessageScrollState, r = t.querySelector("[data-cybercall-active-thread]"), s = String(((l = r == null ? void 0 : r.dataset) == null ? void 0 : l.cybercallActiveThread) ?? ""), o = !a || a.scrollToBottom === !0 || a.stickToBottom === !0 || a.threadId !== s;
  delete e._cybercallMessageScrollState;
  const i = {};
  e._cybercallMessageScrollRestoreToken = i;
  const u = () => {
    if (e._cybercallMessageScrollRestoreToken !== i || !n.isConnected) return;
    const c = Math.max(0, n.scrollHeight - n.clientHeight);
    n.scrollTop = o ? c : Math.min(a.scrollTop, c);
  };
  u(), requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      u(), e._cybercallMessageScrollRestoreToken === i && delete e._cybercallMessageScrollRestoreToken;
    });
  });
}
function et(e) {
  var a;
  const t = e.querySelector("[data-cybercall-active-thread]"), n = String(((a = t == null ? void 0 : t.dataset) == null ? void 0 : a.cybercallActiveThread) ?? "");
  return n ? `thread:${n}` : e.querySelector("form[data-cybercall-group-form]") ? "new-group" : "new-message";
}
function ta(e) {
  const t = we(e);
  if (!(t instanceof HTMLElement)) return null;
  const n = t.querySelector("form[data-cybercall-group-form]");
  if (n) {
    const o = n.elements.namedItem("groupName");
    return {
      key: et(t),
      groupName: (o == null ? void 0 : o.value) ?? "",
      memberUserIds: [...n.querySelectorAll('input[name="memberUserIds"]:checked')].map((i) => i.value)
    };
  }
  const a = t.querySelector("form[data-cybercall-message-form]");
  if (!a) return null;
  const r = a.elements.namedItem("body"), s = (o) => {
    var i;
    return ((i = a.elements.namedItem(o)) == null ? void 0 : i.value) ?? "";
  };
  return {
    key: et(t),
    body: (r == null ? void 0 : r.value) ?? "",
    contactId: s("contactId"),
    replyAs: s("replyAs"),
    sendAs: s("sendAs"),
    bodyWasFocused: document.activeElement === r,
    selectionStart: (r == null ? void 0 : r.selectionStart) ?? null,
    selectionEnd: (r == null ? void 0 : r.selectionEnd) ?? null
  };
}
function na(e, t) {
  const n = e == null ? void 0 : e._cybercallMessageComposerState;
  if (delete e._cybercallMessageComposerState, !n || n.key !== et(t)) return;
  const a = t.querySelector("form[data-cybercall-group-form]");
  if (a) {
    const i = a.elements.namedItem("groupName");
    i && (i.value = n.groupName ?? "");
    const u = new Set(n.memberUserIds ?? []);
    a.querySelectorAll('input[name="memberUserIds"]').forEach((l) => {
      l.checked = u.has(l.value);
    });
    return;
  }
  const r = t.querySelector("form[data-cybercall-message-form]");
  if (!r) return;
  const s = (i, u) => {
    const l = r.elements.namedItem(i);
    l && [...l instanceof HTMLSelectElement ? l.options : []].some((c) => c.value === u) && (l.value = u);
  };
  s("contactId", n.contactId), s("replyAs", n.replyAs), s("sendAs", n.sendAs);
  const o = r.elements.namedItem("body");
  o && (o.value = n.body ?? "", n.bodyWasFocused && requestAnimationFrame(() => {
    o.isConnected && (o.focus({ preventScroll: !0 }), n.selectionStart !== null && n.selectionEnd !== null && o.setSelectionRange(n.selectionStart, n.selectionEnd));
  }));
}
function aa(e, t = null) {
  const n = we(e, t);
  n && (n.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), n.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), n.classList.toggle("cybercall-connected", e.callData.accepted), n.querySelectorAll("[data-cybercall-action]").forEach((a) => {
    a.addEventListener("click", async (r) => {
      const s = r.currentTarget.dataset.cybercallAction;
      if (s === "accept") {
        await va(e.callData.id);
        return;
      }
      if (s === "broadcast") {
        yt({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (s === "decline" || s === "end") && await Jt(e.callData.id);
    });
  }));
}
function ra(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-composer]");
}
function Nt(e) {
  var u, l;
  const t = new FormData(e), n = (u = game.actors) == null ? void 0 : u.get(t.get("actorId")), a = String(t.get("image") ?? "").trim() || (n == null ? void 0 : n.img) || "", r = String(t.get("callerName") ?? "").trim() || (n == null ? void 0 : n.name) || "UNKNOWN CALLER", s = t.getAll("targetUserIds").map((c) => String(c)).filter(Boolean), o = new Map((((l = game.users) == null ? void 0 : l.contents) ?? []).map((c) => [c.id, c])), i = s.map((c) => K(o.get(c)) || c);
  return me({
    callerName: r,
    subtitle: String(t.get("subtitle") ?? "").trim(),
    image: a,
    message: String(t.get("message") ?? "").trim(),
    signal: t.get("signal"),
    variant: String(t.get("variant") ?? j.variant),
    fullscreen: t.get("fullscreen") === "on",
    ringing: t.get("ringing") === "on",
    targetUserIds: s,
    targetUserNames: i
  });
}
function Xe(e) {
  var a, r;
  const t = (a = e == null ? void 0 : e.elements) == null ? void 0 : a.signal, n = (r = e == null ? void 0 : e.querySelector) == null ? void 0 : r.call(e, "[data-cybercall-signal-output]");
  !t || !n || (n.textContent = `${kt(t.value)}%`);
}
function sa(e, t = null) {
  var s, o;
  const n = we(e, t), a = ra(n);
  if (!n || !a) return;
  Xe(a);
  const r = n.querySelector("[data-cybercall-ringtone]");
  r && r.addEventListener("change", async (i) => {
    await Zt(i.currentTarget.value);
  }), (s = a.elements.signal) == null || s.addEventListener("input", () => Xe(a)), (o = a.elements.actorId) == null || o.addEventListener("change", () => {
    var u;
    const i = (u = game.actors) == null ? void 0 : u.get(a.elements.actorId.value);
    i && (a.elements.callerName.value = i.name, a.elements.image.value = i.img ?? "");
  }), a.addEventListener("submit", (i) => {
    i.preventDefault(), oe(Nt(a));
  }), n.querySelectorAll("[data-cybercall-compose-action]").forEach((i) => {
    i.addEventListener("click", async (u) => {
      var m, f, b, C;
      const l = u.currentTarget.dataset.cybercallComposeAction, c = Nt(a);
      if (l === "preview") {
        await oe(c);
        return;
      }
      if (l === "broadcast") {
        await yt(c);
        return;
      }
      if (l === "close-active") {
        Jt((m = y == null ? void 0 : y.callData) == null ? void 0 : m.id);
        return;
      }
      if (l === "browse-image") {
        const g = a.elements.image, I = nt();
        if (!g || !I) {
          (b = (f = ui.notifications) == null ? void 0 : f.warn) == null || b.call(f, "Foundry FilePicker is unavailable.");
          return;
        }
        const M = new I({
          type: "image",
          current: g.value,
          callback: (D) => {
            g.value = D, g.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof M.browse == "function" ? M.browse() : (C = M.render) == null || C.call(M, !0);
        return;
      }
      if (l === "reset") {
        a.reset(), Xe(a);
        return;
      }
      l === "open-messages" && await Ge();
    });
  });
}
function ia(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function oa(e, t = null) {
  var s, o, i;
  const n = we(e, t), a = ia(n);
  if (!n || !a) return;
  a.addEventListener("submit", async (u) => {
    var m;
    u.preventDefault();
    const l = new FormData(a), c = String(l.get("scope") ?? fe);
    await Qn(l.get("name"), l.get("number"), c, l.get("image"), {
      actorId: l.get("actorId"),
      managedByGM: l.get("managedByGM") === "on",
      isNpc: l.get("managedByGM") === "on" || !!l.get("actorId")
    }), a.reset(), a.elements.scope.value = c, (m = a.elements.name) == null || m.focus();
  }), (s = a.elements.actorId) == null || s.addEventListener("change", () => {
    var l;
    const u = (l = game.actors) == null ? void 0 : l.get(a.elements.actorId.value);
    u && (a.elements.name.value || (a.elements.name.value = u.name), a.elements.image && !a.elements.image.value && (a.elements.image.value = u.img ?? ""), a.elements.managedByGM && (a.elements.managedByGM.checked = !0));
  }), n.querySelectorAll("[data-cybercall-contact-tab]").forEach((u) => {
    u.addEventListener("click", (l) => {
      fe = l.currentTarget.dataset.cybercallContactTab, n.querySelectorAll("[data-cybercall-contact-tab]").forEach((c) => {
        c.classList.toggle("active", c.dataset.cybercallContactTab === fe);
      }), n.querySelectorAll("[data-cybercall-contact-panel]").forEach((c) => {
        c.hidden = c.dataset.cybercallContactPanel !== fe;
      }), a.elements.scope && (a.elements.scope.value = fe);
    });
  });
  const r = n.querySelector("[data-cybercall-ringtone]");
  r && r.addEventListener("change", async (u) => {
    await Zt(u.currentTarget.value);
  }), (o = n.querySelector("[data-cybercall-message-sound]")) == null || o.addEventListener("change", async (u) => {
    await Tn(u.currentTarget.value);
  }), n.querySelectorAll("[data-cybercall-contact-action]").forEach((u) => {
    u.addEventListener("click", async (l) => {
      const c = l.currentTarget.dataset.cybercallContactAction, m = l.currentTarget.dataset.contactId, f = l.currentTarget.dataset.contactScope ?? "personal", C = (f === "group" ? ie() : Ie()).find((g) => g.id === m);
      if (c === "remove") {
        await Hn(m, f);
        return;
      }
      if (c === "call" && C) {
        await $a(C) && x === e && await e.close();
        return;
      }
      c === "message" && C && await Ge(C);
    });
  }), (i = n.querySelector("[data-cybercall-open-messages]")) == null || i.addEventListener("click", async () => {
    await Ge();
  });
}
function ca(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
function la(e) {
  var c, m, f, b, C, g, I;
  const t = lt()[e.id] ?? null, n = ((c = game.user) == null ? void 0 : c.isGM) === !0, a = !!(!e.isGroup && e.contact && !e.contact.userId && (e.contact.isNpc || e.contact.managedByGM || e.isNpcRouted)), r = t != null && t.actorId ? (f = (m = game.actors) == null ? void 0 : m.get) == null ? void 0 : f.call(m, t.actorId) : null, s = String((r == null ? void 0 : r.name) ?? (t == null ? void 0 : t.actorName) ?? "").trim(), o = String((t == null ? void 0 : t.image) ?? ((C = (b = r == null ? void 0 : r.prototypeToken) == null ? void 0 : b.texture) == null ? void 0 : C.src) ?? (r == null ? void 0 : r.img) ?? "").trim(), i = (t == null ? void 0 : t.revealPortrait) === !0, u = e.isNpcRouted === !0, l = t || u ? {
    ...e.contact,
    actorId: t && n ? String(t.actorId ?? e.contact.actorId ?? "") : e.contact.actorId,
    image: t && i ? o : ""
  } : e.contact;
  return {
    ...e,
    contact: l,
    image: !n && u ? t && i ? o : "" : e.image,
    canLinkNpc: n && a,
    showNpcLinkPanel: n && (a || !!t),
    hasNpcBinding: !!t,
    npcBindingName: s || ((g = e.contact) == null ? void 0 : g.name) || "Linked NPC",
    npcBindingImage: o,
    npcBindingInitials: H(s || ((I = e.contact) == null ? void 0 : I.name) || "NPC"),
    npcPortraitRevealed: i,
    npcBindingStatusLabel: t ? `Linked to ${s || "Actor"}` : "Unlinked NPC contact"
  };
}
function dt(e = null) {
  var b, C, g;
  let t = ot();
  const n = e ?? t[0] ?? null;
  n && !t.some((I) => I.id === n.id || I.number === n.number) && (t = [...t, q(n)].sort((I, M) => I.name.localeCompare(M.name)));
  const a = J || W ? "" : F, r = Ft(Vt(), t, a, ct()).map((I) => ({
    ...la(I),
    messages: I.messages.map((M) => ({
      ...M,
      createdAtLabel: ca(M.createdAt)
    }))
  })), s = J || W ? null : r.find((I) => I.id === F) ?? null;
  s != null && s.contact && !t.some((I) => I.id === s.contact.id || I.number === s.contact.number) && (t = [...t, s.contact].sort((I, M) => I.name.localeCompare(M.name)));
  const o = ((b = s == null ? void 0 : s.contact) == null ? void 0 : b.id) ?? (n == null ? void 0 : n.id) ?? "", i = jt(), u = zt(s, { excludeGMs: !1 }), l = ga(s), c = Wt(), m = ((C = game.user) == null ? void 0 : C.isGM) === !0 && !s && c.length > 1, f = Wn();
  return {
    threads: r,
    hasThreads: r.length > 0,
    unreadCount: i,
    hasUnreadMessages: i > 0,
    activeThread: s,
    activeThreadId: (s == null ? void 0 : s.id) ?? a,
    allContacts: t.map((I) => ({
      ...I,
      selected: I.id === o
    })),
    hasContacts: t.length > 0,
    selectedContactId: o,
    isThreadReply: !!s,
    isComposingNewMessage: !s && !W,
    isComposingNewGroup: W,
    groupMemberChoices: f,
    hasGroupMemberChoices: f.length > 0,
    canDeleteThread: !!s,
    threadReplyLabel: s ? `${s.title}${s.subtitle ? ` (${s.subtitle})` : ""}` : "",
    canReplyAs: l.length > 1,
    replyAsChoices: l,
    canSendAs: m,
    sendAsChoices: c,
    activeThreadRecipientUserIds: u,
    showMessageTimestamps: game.settings.get(d, "showMessageTimestamps") === !0,
    gmViewPlayerMessagesEnabled: game.settings.get(d, "gmViewPlayerMessages") === !0,
    isFoundryV13Plus: Number(((g = game.release) == null ? void 0 : g.generation) ?? 0) >= 13
  };
}
function ua(e, t = dt()) {
  const n = String(new FormData(e).get("contactId") ?? "");
  return t.allContacts.find((a) => a.id === n) ?? null;
}
function zt(e, t = {}) {
  var s, o, i;
  if (!((s = e == null ? void 0 : e.messages) != null && s.length)) return [];
  const n = String(((o = game.user) == null ? void 0 : o.id) ?? ""), a = new Set((((i = game.users) == null ? void 0 : i.contents) ?? []).filter((u) => u.isGM).map((u) => String(u.id))), r = /* @__PURE__ */ new Set();
  for (const u of e.messages) {
    u.senderUserId && u.senderUserId !== n && !(t.excludeGMs && a.has(u.senderUserId)) && r.add(u.senderUserId);
    for (const l of u.recipientUserIds ?? [])
      l && l !== n && !(t.excludeGMs && a.has(l)) && r.add(l);
  }
  return [...r];
}
function da() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => String(t.id)).filter(Boolean);
}
function ga(e) {
  var a, r;
  const t = !!((a = game.user) != null && a.isGM && (e != null && e.contact) && !e.contact.userId && (e.contact.isNpc || e.contact.managedByGM)), n = [{
    id: "self",
    label: K(game.user, "Me"),
    selected: !t
  }];
  return !((r = game.user) != null && r.isGM) || !(e != null && e.contact) || e.contact.userId || n.push({
    id: "contact",
    label: e.contact.name,
    selected: t
  }), n;
}
function Wt() {
  var n, a;
  const e = [{
    id: "self",
    label: K(game.user, "Me"),
    selected: !0,
    contact: null
  }];
  if (!((n = game.user) != null && n.isGM)) return e;
  const t = /* @__PURE__ */ new Set();
  for (const r of [...ie(), ...Ie()].map(q)) {
    if (!r.name || r.userId || !r.managedByGM && !r.actorId && !r.isNpc) continue;
    const s = r.actorId || r.number || r.id;
    t.has(s) || (t.add(s), e.push({
      id: s,
      label: r.name,
      selected: !1,
      contact: r
    }));
  }
  for (const r of ((a = game.actors) == null ? void 0 : a.contents) ?? []) {
    const s = `actor-${r.id}`;
    t.has(r.id) || t.has(s) || (t.add(s), e.push({
      id: s,
      label: r.name,
      selected: !1,
      contact: q({
        id: s,
        name: r.name,
        number: `NPC:${r.id}`,
        image: r.img ?? "",
        actorId: r.id,
        managedByGM: !0,
        isNpc: !0
      })
    }));
  }
  return e;
}
function Mt(e) {
  return e ? {
    senderName: e.name,
    senderNumber: e.number,
    senderActorId: e.actorId,
    senderImage: e.image,
    contactName: e.name,
    contactImage: e.image,
    contactManagedByGM: !0,
    contactIsNpc: !0
  } : {};
}
function ma(e, t) {
  var s, o;
  const n = new FormData(e);
  if (t.activeThread)
    return String(n.get("replyAs") ?? "self") === "contact" && ((s = game.user) != null && s.isGM) && t.activeThread.contact ? Mt(t.activeThread.contact) : {};
  const a = String(n.get("sendAs") ?? "self");
  if (a === "self" || !((o = game.user) != null && o.isGM)) return {};
  const r = Wt().find((i) => i.id === a);
  return Mt(r == null ? void 0 : r.contact);
}
function pa(e) {
  var n, a, r, s, o;
  const t = globalThis.TextEditor ?? ((r = (a = (n = globalThis.foundry) == null ? void 0 : n.applications) == null ? void 0 : a.ux) == null ? void 0 : r.TextEditor);
  try {
    const i = (s = t == null ? void 0 : t.getDragEventData) == null ? void 0 : s.call(t, e);
    if (i && Object.keys(i).length) return i;
  } catch {
  }
  try {
    return JSON.parse(((o = e.dataTransfer) == null ? void 0 : o.getData("text/plain")) || "{}");
  } catch {
    return {};
  }
}
function $t(e) {
  var n, a, r, s, o, i;
  const t = String(
    ((n = e == null ? void 0 : e.getTextureSrc) == null ? void 0 : n.call(e)) || ((a = e == null ? void 0 : e.texture) == null ? void 0 : a.src) || ((s = (r = e == null ? void 0 : e.document) == null ? void 0 : r.texture) == null ? void 0 : s.src) || ((i = (o = e == null ? void 0 : e.prototypeToken) == null ? void 0 : o.texture) == null ? void 0 : i.src) || (e == null ? void 0 : e.img) || ""
  ).trim();
  return t.includes("*") ? String((e == null ? void 0 : e.img) ?? "").trim() : t;
}
async function fa(e) {
  var o, i, u, l, c, m, f, b;
  const t = pa(e), n = globalThis.fromUuid;
  let a = t.uuid && n ? await n(t.uuid) : null;
  !a && t.sceneId && t.tokenId && (a = ((c = (l = (u = (i = (o = game.scenes) == null ? void 0 : o.get) == null ? void 0 : i.call(o, t.sceneId)) == null ? void 0 : u.tokens) == null ? void 0 : l.get) == null ? void 0 : c.call(l, t.tokenId)) ?? null);
  const r = String(
    ((m = a == null ? void 0 : a.actor) == null ? void 0 : m.id) || (a == null ? void 0 : a.actorId) || ((a == null ? void 0 : a.documentName) === "Actor" ? a.id : "") || t.actorId || (t.type === "Actor" ? t.id : "") || ""
  ).trim(), s = (a == null ? void 0 : a.documentName) === "Actor" ? a : (a == null ? void 0 : a.actor) ?? (r ? (b = (f = game.actors) == null ? void 0 : f.get) == null ? void 0 : b.call(f, r) : null);
  return s ? {
    actorId: String(s.id ?? r),
    actorUuid: String(s.uuid ?? `Actor.${s.id ?? r}`),
    actorName: String(s.name ?? "Linked NPC"),
    image: $t(a) || $t(s),
    revealPortrait: !1,
    linkedAt: (/* @__PURE__ */ new Date()).toISOString()
  } : null;
}
async function ba(e, t) {
  var a, r, s, o, i;
  if (!((a = game.user) != null && a.isGM) || !t) return;
  e.preventDefault(), e.stopPropagation();
  const n = await fa(e);
  if (!n) {
    (s = (r = ui.notifications) == null ? void 0 : r.warn) == null || s.call(r, "Drop an Actor or an Actor-backed Token to link this NPC contact.");
    return;
  }
  await Ze(t, n), (i = (o = ui.notifications) == null ? void 0 : o.info) == null || i.call(o, `Linked this NPC conversation to ${n.actorName}.`), await z();
}
async function ya(e, t) {
  var b, C, g, I, M;
  const n = new FormData(e), a = String(n.get("groupName") ?? "").trim(), r = [...new Set(n.getAll("memberUserIds").map((D) => String(D)).filter(Boolean))];
  if (!a) {
    (C = (b = ui.notifications) == null ? void 0 : b.warn) == null || C.call(b, "Enter a name for the group chat.");
    return;
  }
  if (!r.length) {
    (I = (g = ui.notifications) == null ? void 0 : g.warn) == null || I.call(g, "Select at least one other player for the group chat.");
    return;
  }
  const s = String(((M = game.user) == null ? void 0 : M.id) ?? ""), o = [...new Set([s, ...r].filter(Boolean))], i = o.map((D) => {
    var E, L;
    return K((L = (E = game.users) == null ? void 0 : E.get) == null ? void 0 : L.call(E, D));
  }).filter(Boolean), u = he(), l = En(u), c = K(game.user, "A player"), m = {
    id: `group-${u}`,
    name: a,
    number: `${o.length} members`,
    userIds: r,
    isGroup: !0
  };
  await it(m, `${c} created the group.`, {
    threadId: l,
    recipientUserIds: r,
    recipientNumbers: [],
    messageType: "event",
    eventType: "group-created",
    conversationType: "group",
    groupId: u,
    groupName: a,
    groupMemberUserIds: o,
    groupMemberNames: i
  }) && (F = l, J = !1, W = !1, t && (t.contact = m), (S == null ? void 0 : S.mode) === "messages" && (S.contact = m), await Te(), await z());
}
function ha(e, t = null) {
  const n = we(e, t);
  if (!n) return;
  ea(e, n), na(e, n), n.querySelectorAll("[data-cybercall-npc-link-drop]").forEach((s) => {
    s.addEventListener("dragover", (o) => {
      var i;
      (i = game.user) != null && i.isGM && (o.preventDefault(), o.dataTransfer.dropEffect = "link", s.classList.add("drag-over"));
    }), s.addEventListener("dragleave", () => s.classList.remove("drag-over")), s.addEventListener("drop", async (o) => {
      s.classList.remove("drag-over");
      const i = s.dataset.cybercallNpcThreadId || s.dataset.cybercallThreadId || F;
      await ba(o, i);
    });
  }), n.querySelectorAll("[data-cybercall-npc-action]").forEach((s) => {
    s.addEventListener("click", async (o) => {
      var c, m, f, b, C;
      o.preventDefault(), o.stopPropagation();
      const i = o.currentTarget.dataset.cybercallNpcAction, u = o.currentTarget.dataset.cybercallNpcThreadId || F, l = lt()[u];
      if (i === "toggle-reveal" && l) {
        await Ze(u, { revealPortrait: l.revealPortrait !== !0 }), await z();
        return;
      }
      if (i === "unlink" && l) {
        await Ze(u, null), (m = (c = ui.notifications) == null ? void 0 : c.info) == null || m.call(c, "NPC identity link removed."), await z();
        return;
      }
      i === "change" && ((f = o.currentTarget.closest("[data-cybercall-npc-link-drop]")) == null || f.classList.add("awaiting-drop"), (C = (b = ui.notifications) == null ? void 0 : b.info) == null || C.call(b, "Drag a different Actor or Token onto the NPC identity panel."));
    });
  }), n.querySelectorAll("[data-cybercall-thread-id]").forEach((s) => {
    s.addEventListener("click", async (o) => {
      J = !1, W = !1, F = o.currentTarget.dataset.cybercallThreadId, await Te(), await z();
    });
  }), n.querySelectorAll("[data-cybercall-message-action]").forEach((s) => {
    s.addEventListener("click", async (o) => {
      var u;
      const i = o.currentTarget.dataset.cybercallMessageAction;
      if (i === "refresh") {
        await z();
        return;
      }
      if (i === "open-calls") {
        await Qt();
        return;
      }
      if (i === "new") {
        J = !0, W = !1, F = "", Y && (Y.contact = null), await z();
        return;
      }
      if (i === "new-group") {
        J = !1, W = !0, F = "", Y && (Y.contact = null), (S == null ? void 0 : S.mode) === "messages" && (S.contact = null), await z();
        return;
      }
      if (i === "delete-thread") {
        o.preventDefault(), o.stopPropagation();
        const l = n.querySelector("[data-cybercall-active-thread]"), c = F || ((u = l == null ? void 0 : l.dataset) == null ? void 0 : u.cybercallActiveThread) || "";
        if (!c) return;
        if (e._cybercallPendingDeleteThreadId !== c) {
          e._cybercallPendingDeleteThreadId = c, o.currentTarget.classList.add("confirming"), o.currentTarget.textContent = "Confirm Delete", o.currentTarget.title = "Click again to delete this thread";
          return;
        }
        e._cybercallPendingDeleteThreadId = "", await Jn(c);
      }
    });
  });
  const a = n.querySelector("form[data-cybercall-group-form]");
  a == null || a.addEventListener("submit", async (s) => {
    s.preventDefault(), await ya(a, e);
  });
  const r = n.querySelector("form[data-cybercall-message-form]");
  r == null || r.addEventListener("submit", async (s) => {
    var C, g, I, M;
    s.preventDefault();
    const o = dt(), i = o.activeThread, u = (i == null ? void 0 : i.contact) ?? ua(r, o), l = ((C = r.elements.body) == null ? void 0 : C.value) ?? "", c = ma(r, o), m = !!(i != null && i.contact && !i.contact.userId && (i.contact.managedByGM || i.contact.isNpc)), f = i ? zt(i, { excludeGMs: ((g = game.user) == null ? void 0 : g.isGM) === !0 && !m }) : null;
    if (!u) {
      (M = (I = ui.notifications) == null ? void 0 : I.warn) == null || M.call(I, "Select a contact before sending a message.");
      return;
    }
    await it(u, l, {
      ...c,
      threadId: i ? i.id : void 0,
      recipientUserIds: f != null && f.length ? f : void 0,
      recipientNumbers: c.senderNumber ? [] : void 0,
      conversationType: i != null && i.isGroup ? "group" : "direct",
      groupId: (i == null ? void 0 : i.groupId) ?? "",
      groupName: (i == null ? void 0 : i.groupName) ?? "",
      groupMemberUserIds: (i == null ? void 0 : i.groupMemberUserIds) ?? [],
      groupMemberNames: (i == null ? void 0 : i.groupMemberNames) ?? []
    }) && (F = i ? i.id : Ee(u), e && (e.contact = u), (S == null ? void 0 : S.mode) === "messages" && (S.contact = u), J = !1, W = !1, r.elements.body.value = "", await Te(), await z({ scrollToBottom: !0, preserveDraft: !1 }));
  }), Te();
}
const { CyberCallApplication: Ca, CyberCallPhone: Ia } = yn({
  moduleId: d,
  templatePath: hn,
  composerTemplatePath: Cn,
  contactsTemplatePath: In,
  messagesTemplatePath: wn,
  phoneTemplatePath: Sn,
  escapeHTML: pe,
  getDefaultComposerData: Vn,
  getActorChoices: jn,
  getPlayerChoices: zn,
  getContacts: Ie,
  getGroupContacts: ie,
  getMessageContext: dt,
  getRingtoneChoices: Ga,
  getMessageSoundOptions: $n,
  getSoundPath: ht,
  getActiveContactsTab: () => fe,
  canEditContactImages: $e,
  bindCallControls: aa,
  bindComposerControls: sa,
  bindContactsControls: oa,
  bindMessagesControls: ha,
  stopRinging: Ct,
  clearActiveCall: (e) => {
    y === e && (y = null);
  },
  clearActiveComposer: (e) => {
    Z === e && (Z = null);
  },
  clearActiveContacts: (e) => {
    x === e && (x = null);
  },
  clearActiveMessages: (e) => {
    Y === e && (Y = null);
  },
  clearActivePhone: (e) => {
    S === e && (S = null, Z = null, x = null, Y = null);
  }
});
async function oe(e = {}) {
  var t, n;
  return Ke() ? (x && await x.close(), await gt(), y = new Ca(e), await y.render(!0), Ht(y), Ua(y.callData), y) : ((n = (t = ui.notifications) == null ? void 0 : t.warn) == null || n.call(t, "You do not have permission to open CyberCall transmissions."), null);
}
async function gt() {
  if (!y) return;
  const e = y;
  y = null, await e.close();
}
function wa(e) {
  var t;
  return !!((t = y == null ? void 0 : y.callData) != null && t.id) && y.callData.id === e;
}
async function Sa() {
  y && (await y.render(!0), Ht(y));
}
async function Kt(e) {
  wa(e) && (y.callData.accepted = !0, y.callData.ringing = !1, Ct(), await Sa());
}
async function va(e) {
  e && (await We(y == null ? void 0 : y.callData, "connected"), game.socket.emit(ce, {
    action: "acceptCall",
    callId: e
  }), await Kt(e));
}
async function Yt(e) {
  var t;
  e && ((t = y == null ? void 0 : y.callData) != null && t.id) && y.callData.id !== e || await gt();
}
async function Jt(e) {
  var t;
  await We(y == null ? void 0 : y.callData, (t = y == null ? void 0 : y.callData) != null && t.accepted ? "ended" : "missed"), game.socket.emit(ce, {
    action: "endCall",
    callId: e
  }), await Yt(e);
}
function Aa(e, t = "Player") {
  var r, s, o, i, u;
  const n = ((s = (r = game.users) == null ? void 0 : r.get) == null ? void 0 : s.call(r, e)) ?? ((u = (i = (o = game.users) == null ? void 0 : o.contents) == null ? void 0 : i.find) == null ? void 0 : u.call(i, (l) => l.id === e)), a = K(n, t);
  return {
    id: `user-${e}`,
    name: a,
    number: `@${a}`,
    image: Ue(n),
    userId: e,
    userIds: e ? [e] : []
  };
}
function Na(e) {
  var t;
  return e ? e.contactNumber ? ot().find((a) => a.number === e.contactNumber) ?? {
    id: `contact-${e.contactNumber}`,
    name: e.contactName || e.callerName,
    number: e.contactNumber,
    image: e.contactImage || e.image,
    actorId: e.contactActorId ?? "",
    managedByGM: !0,
    isNpc: !0
  } : (t = game.user) != null && t.isGM && e.callerUserId ? Aa(e.callerUserId, e.callerName) : null : null;
}
function Ma(e, t) {
  var a;
  const n = /* @__PURE__ */ new Set();
  for (const r of (t == null ? void 0 : t.userIds) ?? []) n.add(String(r));
  if (t != null && t.userId && n.add(String(t.userId)), e != null && e.callerUserId && n.add(String(e.callerUserId)), !(t != null && t.userId) && (t != null && t.managedByGM || t != null && t.isNpc || e != null && e.contactNumber))
    for (const r of da()) n.add(r);
  return n.delete(String(((a = game.user) == null ? void 0 : a.id) ?? "")), [...n].filter(Boolean);
}
async function We(e, t) {
  var s;
  const n = Na(e);
  if (!n) return null;
  const a = (e == null ? void 0 : e.callerUserId) || ((s = game.user) == null ? void 0 : s.id), r = {
    outgoing: `Outgoing call to ${n.name}.`,
    connected: `Call connected with ${n.name}.`,
    ended: `Call ended with ${n.name}.`,
    missed: `Call missed or declined with ${n.name}.`
  };
  return qn(n, r[t] ?? "Call event.", {
    threadId: Ee(n, a),
    eventType: t,
    senderName: "CyberCall",
    senderNumber: n.number,
    senderActorId: n.actorId,
    recipientUserIds: Ma(e, n),
    recipientNumbers: n.userId ? [] : [n.number]
  });
}
async function $a(e) {
  var i, u;
  if (game.user.isGM) {
    const l = {
      callerName: e.name,
      subtitle: `Comms ${e.number}`,
      image: e.image,
      message: `Opening channel ${e.number}...`,
      signal: game.settings.get(d, "defaultSignal"),
      variant: "standard",
      contactNumber: e.number,
      ringing: !1
    };
    return await We(l, "outgoing"), oe(l);
  }
  if (!ut())
    return (u = (i = ui.notifications) == null ? void 0 : i.warn) == null || u.call(i, "No GM is connected to receive the CyberCall."), null;
  const t = he(), n = Ue(game.user), a = K(game.user, "Unknown Caller"), r = {
    id: t,
    signal: game.settings.get(d, "defaultSignal"),
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
  }, s = me({
    ...r,
    callerName: e.name,
    subtitle: `Comms ${e.number}`,
    image: e.image,
    message: `Awaiting connection to ${e.name} on ${e.number}...`,
    canAccept: !1,
    canDecline: !1,
    outgoing: !0,
    ringing: !0
  }), o = me({
    ...r,
    callerName: a,
    subtitle: `Call request from ${a}`,
    image: n,
    message: `${a} is calling ${e.name} on ${e.number}.`,
    canAccept: !0,
    ringing: !0
  });
  return game.socket.emit(ce, {
    action: "playerCallRequest",
    callData: o
  }), await We(s, "outgoing"), oe(s);
}
async function mt() {
  var e, t;
  return game.user.isGM ? bt("calls") : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function pt() {
  var e, t, n;
  return Ke() ? y ? ((n = y.bringToFront) == null || n.call(y), y) : bt("calls") : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function ee() {
  x && await x.render(!0);
}
async function Ge(e = null) {
  var n, a;
  if (!Ke())
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "You do not have permission to use CyberCall messages."), null;
  e ? (F = Ee(e), J = !1, W = !1) : F || W || (J = !0);
  const t = await bt("messages", e);
  return await Te(), t;
}
async function ft(e) {
  return e && (F = String(e), J = !1, W = !1), Ge();
}
async function Qt() {
  var e;
  return (e = game.user) != null && e.isGM ? mt() : pt();
}
async function z(e = {}) {
  !S || S.mode !== "messages" || (S._cybercallMessageComposerState = e.preserveDraft === !1 ? null : ta(S), S._cybercallMessageScrollState = {
    ...Zn(S),
    scrollToBottom: e.scrollToBottom === !0
  }, await S.render(!0));
}
async function bt(e = "calls", t = null) {
  var n, a, r;
  return S ? (S.mode = e, S.contact = t, await S.render(!0), (n = S.bringToFront) == null || n.call(S)) : (S = new Ia(e, t), await S.render(!0)), Z = (a = game.user) != null && a.isGM && e === "calls" ? S : null, x = !((r = game.user) != null && r.isGM) && e === "calls" ? S : null, Y = e === "messages" ? S : null, S;
}
async function yt(e = {}) {
  var n, a;
  if (!game.user.isGM)
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Only the GM can broadcast CyberCalls to all players."), null;
  const t = me({
    ...e,
    fullscreen: e.fullscreen ?? !0,
    ringing: !0
  });
  return game.socket.emit(ce, {
    action: "openCall",
    callData: t,
    targetUserIds: t.targetUserIds
  }), oe({ ...t, outgoing: !0 });
}
async function Ta(e) {
  var t, n, a;
  if (e && !(Array.isArray(e.targetUserIds) && e.targetUserIds.length && !e.targetUserIds.includes((t = game.user) == null ? void 0 : t.id)) && !(Array.isArray((n = e.callData) == null ? void 0 : n.targetUserIds) && e.callData.targetUserIds.length && !e.callData.targetUserIds.includes((a = game.user) == null ? void 0 : a.id))) {
    if (e.action === "openCall") {
      if (!Ke()) return;
      oe(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      oe(e.callData);
      return;
    }
    if (e.action === "acceptCall") {
      Kt(e.callId);
      return;
    }
    if (e.action === "endCall") {
      Yt(e.callId);
      return;
    }
    if (e.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const r = q({
        ...e.contact,
        image: ""
      });
      if (!r.name || !r.number) return;
      const s = ie();
      s.push(r), await ze(s), await ee();
      return;
    }
    if (e.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await ze(ie().filter((r) => r.id !== e.contactId)), await ee();
      return;
    }
    e.action === "groupContactsChanged" && (be = Array.isArray(e.contacts) ? e.contacts.map(q) : null, await ee());
  }
}
function Ht(e) {
  var t, n;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((n = e.setPosition) == null || n.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function Xt() {
  const e = game.settings.get(d, "ringSoundsByWorld");
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function ka() {
  return /* @__PURE__ */ new Set([
    ...Object.keys(tt),
    ...se(game.settings.get(d, "customRingtones")).map((e) => e.path)
  ]);
}
function ht() {
  const e = Ce(), t = Xt(), n = Object.prototype.hasOwnProperty.call(t, e), a = String(n ? t[e] : game.settings.get(d, "ringSound") ?? "").trim();
  return ka().has(a) ? a : Rt;
}
async function Zt(e) {
  const t = Ce();
  await game.settings.set(d, "ringSoundsByWorld", {
    ...Xt(),
    [t]: String(e ?? "").trim()
  });
}
function Ga() {
  const e = ht(), t = se(game.settings.get(d, "customRingtones")), n = new Map(Object.entries(tt));
  for (const a of t)
    n.has(a.path) || n.set(a.path, a.label);
  return [...n].map(([a, r]) => ({
    value: a,
    label: r,
    selected: a === e
  }));
}
function Ct() {
  if (!re) return;
  const e = re;
  re = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function Ua(e) {
  var s;
  if (Ct(), !e.ringing) return;
  const t = ht();
  if (!t) return;
  const a = 0.65 * (Math.max(0, Math.min(100, Number(game.settings.get(d, "ringVolume") ?? 100))) / 100), r = ((s = foundry == null ? void 0 : foundry.audio) == null ? void 0 : s.AudioHelper) ?? globalThis.AudioHelper;
  if (r != null && r.play)
    r.play({ src: t, volume: a, autoplay: !0, loop: !0, channel: "interface" }, !1).then((o) => {
      re = o;
    }).catch((o) => {
      console.warn(`${d} | Unable to play ringing sound.`, o);
    });
  else {
    const o = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5);
    re = new Audio(t), re.loop = !0, re.volume = a * o, re.play().catch((i) => {
      console.warn(`${d} | Unable to play ringing sound.`, i);
    });
  }
}
function Ea() {
  var i;
  const e = at();
  if (e) {
    const u = ((i = foundry == null ? void 0 : foundry.audio) == null ? void 0 : i.AudioHelper) ?? globalThis.AudioHelper;
    if (u != null && u.play)
      Promise.resolve(u.play({ src: e, volume: 0.65, loop: !1 }, !1)).catch((l) => console.warn(`${d} | Unable to play message notification sound.`, l));
    else {
      const l = new Audio(e);
      l.volume = 0.65 * Math.max(0, Math.min(1, Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5))), l.play().catch((c) => console.warn(`${d} | Unable to play message notification sound.`, c));
    }
    return;
  }
  const t = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  if (!t) return;
  const n = new t(), a = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), r = Math.max(1e-4, Math.min(0.18, 0.18 * a)), s = (u, l, c) => {
    const m = n.createOscillator(), f = n.createGain(), b = n.currentTime + l, C = b + c;
    m.type = "sine", m.frequency.setValueAtTime(u, b), m.frequency.exponentialRampToValueAtTime(u * 1.18, C), f.gain.setValueAtTime(1e-4, b), f.gain.exponentialRampToValueAtTime(r, b + 0.025), f.gain.exponentialRampToValueAtTime(1e-4, C), m.connect(f), f.connect(n.destination), m.start(b), m.stop(C);
  };
  (async () => {
    n.state === "suspended" && await n.resume(), s(620, 0, 0.16), s(930, 0.11, 0.2), window.setTimeout(() => {
      var u;
      return (u = n.close) == null ? void 0 : u.call(n);
    }, 500);
  })().catch(() => {
    var u;
    return (u = n.close) == null ? void 0 : u.call(n);
  });
}
function Ba(e) {
  var n, a, r, s, o;
  if (e.senderImage) return String(e.senderImage);
  if (e.contactIsNpc && e.senderNumber) return "";
  const t = ((a = (n = game.users) == null ? void 0 : n.get) == null ? void 0 : a.call(n, e.senderUserId)) ?? ((o = (s = (r = game.users) == null ? void 0 : r.contents) == null ? void 0 : s.find) == null ? void 0 : o.call(s, (i) => i.id === e.senderUserId));
  return (t == null ? void 0 : t.isGM) === !0 ? "" : Ue(t);
}
function Tt(e) {
  e != null && e.isConnected && (e.classList.add("leaving"), window.setTimeout(() => e.remove(), 220));
}
function Pa(e) {
  let t = document.querySelector("[data-cybercall-message-notifications]");
  t || (t = document.createElement("div"), t.className = "cybercall-message-notifications", t.dataset.cybercallMessageNotifications = "", t.setAttribute("aria-live", "polite"), document.body.append(t));
  const n = String(e.senderName || "New message").trim(), a = String(e.groupName || "").trim(), r = document.createElement("button");
  r.type = "button", r.className = "cybercall-incoming-message", r.title = "Open CyberCall conversation";
  const s = document.createElement("span");
  s.className = `cybercall-incoming-avatar ${_t(e.senderUserId || n)}`;
  const o = Ba(e);
  if (o) {
    const m = document.createElement("img");
    m.src = o, m.alt = "", s.append(m);
  } else
    s.textContent = H(n);
  const i = document.createElement("i");
  i.className = "fa-solid fa-message cybercall-incoming-badge", i.setAttribute("aria-hidden", "true"), s.append(i);
  const u = document.createElement("span");
  u.className = "cybercall-incoming-copy";
  const l = document.createElement("strong");
  l.textContent = a ? `${n} · ${a}` : n;
  const c = document.createElement("small");
  c.textContent = String(e.body || "New CyberCall message").trim(), u.append(l, c), r.append(s, u), r.addEventListener("click", () => {
    Tt(r), ft(String(e.threadId || ""));
  }), t.append(r), Ea(), window.setTimeout(() => Tt(r), 4200);
}
function Ra(e) {
  var n, a, r;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[d]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, d, "message"));
  return (t == null ? void 0 : t.kind) === ye ? t : ((r = t == null ? void 0 : t.message) == null ? void 0 : r.kind) === ye ? t.message : null;
}
function en(e, t) {
  var a, r, s, o, i, u, l;
  if (!e) return;
  const n = (a = e.matches) != null && a.call(e, ".chat-message") ? e : ((r = e.closest) == null ? void 0 : r.call(e, ".chat-message")) ?? ((s = e.querySelector) == null ? void 0 : s.call(e, ".chat-message")) ?? e;
  (i = (o = n.classList) == null ? void 0 : o.toggle) == null || i.call(o, "cybercall-chat-message-hidden", !t), t ? (u = n.removeAttribute) == null || u.call(n, "aria-hidden") : (l = n.setAttribute) == null || l.call(n, "aria-hidden", "true");
}
function tn(e, t) {
  if (!Ra(e)) return;
  const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? (t == null ? void 0 : t.element) ?? null;
  en(n, game.settings.get(d, "showChatCards") === !0);
}
function nn() {
  const e = game.settings.get(d, "showChatCards") === !0;
  document.querySelectorAll(".cybercall-chat-card").forEach((t) => {
    en(t, e);
  });
}
function an() {
  const e = game.modules.get(d);
  e && (e.api = {
    openCall: oe,
    closeCall: gt,
    broadcastCall: yt,
    openComposer: mt,
    openContacts: pt,
    openMessages: Ge,
    openMessagesThread: ft,
    openCallPanel: Qt,
    getUnreadMessageCount: jt,
    get activeCall() {
      return y;
    },
    get activeComposer() {
      return Z;
    },
    get activeContacts() {
      return x;
    },
    get activeMessages() {
      return Y;
    }
  });
}
function Oa() {
  var n;
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: d,
    title: "CyberCall",
    icon: "fa-solid fa-satellite-dish",
    premium: !1,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => {
      var a;
      return (a = game.user) != null && a.isGM ? mt() : pt();
    }
  }), (n = t.registerWhatsNew) == null || n.call(t, {
    moduleId: d,
    title: "CyberCall",
    tier: "free",
    version: "1.0.11",
    updated: "2026-10-03",
    icon: "fa-solid fa-satellite-dish",
    entries: [
      {
        title: "Keep writing while messages update",
        summary: "CyberCall now keeps your unfinished message, selected contact, and cursor position when the conversation refreshes, so an incoming update no longer clears what you were typing.",
        tags: ["Foundry v12-v14"]
      }
    ]
  }), !0) : !1;
}
function Da() {
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
  game.settings.register(d, "defaultSignal", {
    name: "Default Signal Strength",
    hint: "Signal percentage used when a call does not provide one.",
    scope: "client",
    config: !0,
    type: Number,
    default: j.signal,
    range: {
      min: 0,
      max: 100,
      step: 1
    }
  }), game.settings.register(d, "ringSound", {
    name: "Incoming Call Ringtone",
    hint: "Ringtone played locally while a CyberCall is ringing. This is a client setting, so each user can choose their own ringtone.",
    scope: "client",
    config: !1,
    type: String,
    default: Rt,
    choices: tt
  }), game.settings.register(d, "ringSoundsByWorld", {
    name: "CyberCall Ringtone Selections",
    hint: "Stores this client's ringtone choice separately for each world.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(d, "ringVolume", {
    name: "Incoming Call Volume",
    hint: "Personal CyberCall ringtone volume. This is multiplied by Foundry's Interface volume, so the global audio control still applies.",
    scope: "client",
    config: !0,
    type: Number,
    default: 100,
    range: {
      min: 0,
      max: 100,
      step: 5
    }
  }), game.settings.register(d, "customRingtones", {
    name: "Additional CyberCall Ringtones",
    hint: "GM-managed ringtone audio files available to everyone in this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: [],
    onChange: () => {
      var n, a, r;
      S ? (n = S.render) == null || n.call(S, !0) : Z ? (a = Z.render) == null || a.call(Z, !0) : (r = x == null ? void 0 : x.render) == null || r.call(x, !0);
    }
  }), game.settings.registerMenu(d, "customRingtonesMenu", {
    name: "Additional Ringtones",
    label: "Manage Ringtones",
    hint: "Add one or more audio files to the ringtone list for this world.",
    icon: "fa-solid fa-bell",
    type: Dt,
    restricted: !0
  }), game.settings.register(d, "minimumRole", {
    name: "Minimum Player Role",
    hint: "Minimum role allowed to open CyberCall overlays and receive GM broadcasts.",
    scope: "world",
    config: !0,
    type: Number,
    default: e.PLAYER,
    choices: t
  }), game.settings.register(d, "contacts", {
    name: "CyberCall Contacts",
    hint: "Player contact directory stored locally for this client and isolated per world.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(d, "groupContacts", {
    name: "CyberCall Group Contacts",
    hint: "Shared group contact directory for all players in this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: []
  }), game.settings.register(d, "npcThreadBindings", {
    name: "CyberCall NPC Conversation Links",
    hint: "Stores GM-managed links between pseudo-NPC conversations and Foundry Actors.",
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: () => {
      z(), ee();
    }
  }), game.settings.register(d, "messageNotifications", {
    name: "Incoming Message Alerts",
    hint: "Show a brief sender notification and play a short tone when a new CyberCall message arrives.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(d, "customMessageSounds", {
    name: "GM Message Notification Sounds",
    scope: "world",
    config: !1,
    type: Object,
    default: []
  }), game.settings.register(d, "shareMessageSounds", {
    name: "Allow Uploaded Notification Sounds to Be Used by Players",
    hint: "Let players select sounds from the GM message notification sound library. Turning this off restores the built-in tone for players using a shared sound. Personal uploads follow Foundry's file permissions.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.registerMenu(d, "messageSoundMenu", {
    name: "Message Notification Sound",
    label: "Choose or Upload Sound",
    hint: "Add one or more audio files to the notification list for this world.",
    icon: "fa-solid fa-music",
    type: kn,
    restricted: !0
  }), game.settings.register(d, "showChatCards", {
    name: "Show CyberCall Chat Cards",
    hint: "Show CyberCall message cards in Foundry's standard chat log. Disabled by default because CyberCall has its own inbox and notifications.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: () => nn()
  }), game.settings.register(d, "showMessageTimestamps", {
    name: "Show Message Timestamps",
    hint: "Display the sent date and time beneath messages in CyberCall conversations.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(d, "gmViewPlayerMessages", {
    name: "GM: View Player Conversations",
    hint: "Allow GMs to see private CyberCall conversations where no GM or GM-managed NPC is a participant. Disabled by default.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: () => {
      z(), ee();
    }
  }), game.settings.register(d, "messageReadState", {
    name: "CyberCall Message Read State",
    hint: "Tracks which message threads this client has read.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(d, "messageDeletedBefore", {
    name: "CyberCall Deleted Message Threads",
    hint: "Tracks locally deleted message threads for this client.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  });
}
async function _a() {
  const e = game.settings.get(d, "contacts");
  Array.isArray(e) && await game.settings.set(d, "contacts", {
    [Ce()]: e.map(q)
  });
}
Hooks.once("init", () => {
  Da(), an();
});
Hooks.once("ready", async () => {
  await _a(), an(), Oa(), game.socket.on(ce, Ta), nn(), console.log(`${d} | Ready. Use game.modules.get("${d}").api.openCall({...})`);
});
Hooks.on("renderChatMessage", (e, t) => {
  tn(e, t);
});
Hooks.on("renderChatMessageHTML", (e, t) => {
  tn(e, t);
});
Hooks.on("createChatMessage", async (e) => {
  var i, u, l;
  const t = (i = e == null ? void 0 : e.flags) == null ? void 0 : i[d];
  if ((t == null ? void 0 : t.kind) !== ye) return;
  const n = String(((u = game.user) == null ? void 0 : u.id) ?? ""), a = Array.isArray(t.recipientUserIds) ? t.recipientUserIds.map((c) => String(c)) : [], r = ((l = game.user) == null ? void 0 : l.isGM) === !0 && !String(t.contactUserId ?? "") && (t.contactManagedByGM === !0 || t.contactIsNpc === !0), s = String(t.senderUserId ?? "") !== n && (a.includes(n) || r), o = String(t.messageType ?? "text") === "text" || t.eventType === "group-created";
  s && o && game.settings.get(d, "messageNotifications") !== !1 && Pa(t), await z(), await ee();
});
document.addEventListener("click", (e) => {
  var a;
  const t = e.target, n = (a = t == null ? void 0 : t.closest) == null ? void 0 : a.call(t, "[data-cybercall-open-thread]");
  n && (e.preventDefault(), ft(n.dataset.cybercallThreadId));
});
