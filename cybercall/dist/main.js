var Zt = Object.defineProperty;
var en = (e, t, n) => t in e ? Zt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var P = (e, t, n) => en(e, typeof t != "symbol" ? t + "" : t, n);
function tn(e, t) {
  return e.image ? `<img src="${t(e.image)}" alt="${t(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${t(e.initials)}</div>`;
}
function yt(e, t) {
  const n = `--cybercall-signal: ${e.signal}%;`, a = e.fullscreen ? "cybercall-broadcast" : "", r = e.ringing ? "cybercall-ringing-panel" : "", i = e.accepted ? "cybercall-connected-panel" : "", o = e.showBroadcast ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>' : "", s = e.accepted ? "" : `
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
    `, l = e.accepted ? "" : `<blockquote>${t(e.message)}</blockquote>`, u = e.accepted || e.outgoing ? '<button type="button" data-cybercall-action="end">End Call</button>' : `
        ${e.canAccept ? '<button type="button" data-cybercall-action="accept">Accept</button>' : ""}
        <button type="button" data-cybercall-action="decline">Decline</button>
        ${o}
      `;
  return `
    <div class="cybercall-panel cybercall-${e.variant} ${a} ${r} ${i}" style="${n}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${s}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${tn(e, t)}</div>
        ${l}
      </main>
      <footer class="cybercall-actions">
        ${u}
      </footer>
    </div>
  `;
}
function We(e, t) {
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
function Ke(e, t) {
  const n = (l, u) => l.length ? l.map((c) => `
        <li>
          <div class="cybercall-contact-avatar">
            ${c.image ? `<img src="${t(c.image)}" alt="">` : `<span>${t(c.initials)}</span>`}
          </div>
          <div class="cybercall-contact-id">
            <strong>${t(c.name)}</strong>
            <span>${t(c.number)}</span>
          </div>
          <div class="cybercall-contact-actions">
            <button type="button" data-cybercall-contact-action="call" data-contact-scope="${u}" data-contact-id="${t(c.id)}">Call</button>
            <button type="button" data-cybercall-contact-action="message" data-contact-scope="${u}" data-contact-id="${t(c.id)}">Message</button>
            <button type="button" data-cybercall-contact-action="remove" data-contact-scope="${u}" data-contact-id="${t(c.id)}">Remove</button>
          </div>
        </li>
      `).join("") : '<li class="cybercall-contacts-empty">No contacts stored.</li>', a = e.activeTab !== "group", r = e.activeTab === "group", i = (e.actors ?? []).map((l) => `<option value="${t(l.id)}">${t(l.name)}</option>`).join(""), o = e.canEditContactImages ? `
        <label>Actor
          <select name="actorId">
            <option value="">No linked actor</option>
            ${i}
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
      </footer>
    </section>
  `;
}
function Ye(e, t) {
  var I;
  const n = e.threads ?? [], a = e.activeThread ?? null, r = e.allContacts ?? [], i = n.length ? n.map((d) => `
        <button type="button" class="cybercall-thread ${d.active ? "active" : ""} ${d.hasRouteLabel ? "routed" : ""} ${d.hasNpcBinding ? "npc-linked" : ""}" data-cybercall-thread-id="${t(d.id)}" ${d.canLinkNpc ? `data-cybercall-npc-link-drop data-cybercall-npc-thread-id="${t(d.id)}"` : ""}>
          <span class="cybercall-thread-avatar ${t(d.avatarTone)} ${d.isGroup ? "group" : ""}">
            ${d.image ? `<img src="${t(d.image)}" alt="">` : d.isGroup ? '<i class="fa-solid fa-user-group" aria-hidden="true"></i>' : t(d.initials)}
          </span>
          <span class="cybercall-thread-body">
            <strong>${t(d.title)}</strong>
            ${d.hasRouteLabel ? `
              <span class="cybercall-thread-route-row">
                <span class="cybercall-thread-route">${t(d.routeLabel)}</span>
                ${d.canLinkNpc ? `
                  <span class="cybercall-thread-npc-state ${d.hasNpcBinding ? "linked" : "unlinked"}" title="${t(d.npcBindingStatusLabel)}">
                    ${d.hasNpcBinding ? d.npcBindingImage ? `<img src="${t(d.npcBindingImage)}" alt="">` : '<i class="fa-solid fa-link" aria-hidden="true"></i>' : '<i class="fa-solid fa-link-slash" aria-hidden="true"></i>'}
                  </span>
                ` : ""}
              </span>
            ` : ""}
            <small>${t(d.lastPreview)}</small>
          </span>
          ${d.unread ? `<span class="cybercall-thread-unread">${d.unreadCount}</span>` : ""}
        </button>
      `).join("") : '<div class="cybercall-messages-empty">No messages yet.</div>', o = r.map((d) => `<option value="${t(d.id)}" ${e.selectedContactId === d.id ? "selected" : ""}>${t(d.name)} - ${t(d.number)}</option>`).join(""), s = e.canReplyAs ? `
      <label>
        <span>Reply As</span>
        <select name="replyAs">
          ${(e.replyAsChoices ?? []).map(
    (d) => `<option value="${t(d.id)}" ${d.selected ? "selected" : ""}>${t(d.label)}</option>`
  ).join("")}
        </select>
      </label>
    ` : "", l = e.canSendAs ? `
      <label>
        <span>Send As</span>
        <select name="sendAs">
          ${(e.sendAsChoices ?? []).map(
    (d) => `<option value="${t(d.id)}" ${d.selected ? "selected" : ""}>${t(d.label)}</option>`
  ).join("")}
        </select>
      </label>
    ` : "", u = e.isThreadReply ? `
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
    `, c = (I = a == null ? void 0 : a.messages) != null && I.length ? a.messages.map((d) => `
        <article class="cybercall-message ${d.isMine ? "mine" : ""} ${d.isEvent ? "event" : ""}">
          <strong>${t(d.senderName)}</strong>
          <p>${t(d.body)}</p>
          ${e.showMessageTimestamps ? `<time>${t(d.createdAtLabel ?? d.createdAt)}</time>` : ""}
        </article>
      `).join("") : '<div class="cybercall-messages-empty">Select a thread or send a new message.</div>', f = `
    <form class="cybercall-group-form" data-cybercall-group-form>
      <label class="cybercall-group-name">
        <span>Group Name</span>
        <input type="text" name="groupName" maxlength="80" autocomplete="off" placeholder="Night City Crew" required>
      </label>
      <fieldset>
        <legend>Players</legend>
        <div class="cybercall-group-members">${(e.groupMemberChoices ?? []).length ? (e.groupMemberChoices ?? []).map((d) => `
        <label>
          <input type="checkbox" name="memberUserIds" value="${t(d.id)}">
          <span>${t(d.name)}${d.active ? "" : " (offline)"}</span>
        </label>
      `).join("") : "<p>No other player users are available.</p>"}</div>
      </fieldset>
      <p class="cybercall-group-hint">Members can read the full conversation and every reply is sent privately to the whole group.</p>
      <button type="submit" ${e.hasGroupMemberChoices ? "" : "disabled"}>Create Group</button>
    </form>
  `, y = a != null && a.showNpcLinkPanel ? `
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
        ${i}
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
        ${y}
        ${e.isComposingNewGroup ? f : `
          <div class="cybercall-message-log">${c}</div>
          <form class="cybercall-message-form ${e.canReplyAs ? "has-reply-as" : ""} ${e.canSendAs ? "has-send-as" : ""}" data-cybercall-message-form>
            ${u}
            ${s}
            ${l}
            <textarea name="body" rows="3" placeholder="Type message..." required></textarea>
            <button type="submit" ${r.length ? "" : "disabled"}>Send</button>
          </form>
        `}
      </main>
    </section>
  `;
}
const q = {
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
}, nn = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]);
function At(e) {
  const t = Number(e);
  return Number.isNaN(t) ? q.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function H(e) {
  return String(e).split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var n;
    return (n = t[0]) == null ? void 0 : n.toUpperCase();
  }).join("") || "?";
}
function fe() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function ue(e = {}) {
  var r;
  const t = Array.isArray(e.targetUserIds) ? e.targetUserIds.map((i) => String(i)).filter(Boolean) : [], n = Array.isArray(e.targetUserNames) ? e.targetUserNames.map((i) => String(i)).filter(Boolean) : [], a = {
    ...q,
    ...e,
    id: String(e.id ?? fe()),
    callerName: String(e.callerName ?? q.callerName),
    subtitle: String(e.subtitle ?? q.subtitle),
    image: String(e.image ?? q.image),
    message: String(e.message ?? q.message),
    signal: At(e.signal ?? q.signal),
    variant: nn.has(e.variant) ? e.variant : q.variant,
    fullscreen: !!(e.fullscreen ?? q.fullscreen),
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
function x(e = {}) {
  const t = Array.isArray(e.userIds) ? e.userIds.map((n) => String(n)).filter(Boolean) : e.userId ? [String(e.userId)] : [];
  return {
    id: String(e.id ?? fe()),
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
function an(e) {
  var a, r, i;
  const t = (e == null ? void 0 : e.document) ?? e, n = String(
    ((a = t == null ? void 0 : t.getTextureSrc) == null ? void 0 : a.call(t)) || ((r = t == null ? void 0 : t.texture) == null ? void 0 : r.src) || (t == null ? void 0 : t.img) || ((i = e == null ? void 0 : e.texture) == null ? void 0 : i.src) || ""
  ).trim();
  return n.includes("*") ? "" : n;
}
function Fe(e) {
  return !e || /(?:^|\/)mystery-man(?:-[^/.]+)?\.svg(?:$|\?)/i.test(e);
}
function Te(e) {
  var d, w, M, D, B, L, te, de, V, X, ne, U;
  if (!e) return "";
  const t = globalThis.game, n = globalThis.canvas, a = String(e.avatar ?? ((d = e._source) == null ? void 0 : d.avatar) ?? "").trim();
  if (e.isGM === !0) return Fe(a) ? "" : a;
  const r = e.character ?? e.characterId ?? ((w = e._source) == null ? void 0 : w.character), i = typeof r == "string" ? r : String((r == null ? void 0 : r.id) ?? (r == null ? void 0 : r._id) ?? ""), o = Nt(e), s = Array.isArray((M = n == null ? void 0 : n.tokens) == null ? void 0 : M.placeables) ? n.tokens.placeables : [], l = String(((D = t == null ? void 0 : t.user) == null ? void 0 : D.id) ?? "") === String(e.id ?? "") ? ((B = n == null ? void 0 : n.tokens) == null ? void 0 : B.controlled) ?? [] : [], u = ((L = o == null ? void 0 : o.getActiveTokens) == null ? void 0 : L.call(o, !0, !0)) ?? [], c = s.find((E) => {
    var R, j;
    const T = String(((R = E == null ? void 0 : E.actor) == null ? void 0 : R.id) ?? ((j = E == null ? void 0 : E.document) == null ? void 0 : j.actorId) ?? (E == null ? void 0 : E.actorId) ?? "");
    return i && T === i;
  }), p = s.find((E) => {
    var R, j;
    const T = (E == null ? void 0 : E.actor) ?? ((R = E == null ? void 0 : E.document) == null ? void 0 : R.actor);
    return Number(((j = T == null ? void 0 : T.ownership) == null ? void 0 : j[e.id]) ?? 0) >= 3;
  }), f = [...l, ...u, c, p].filter(Boolean).map(an).find(Boolean) ?? "";
  if (f) return f;
  const y = String(
    ((de = (te = o == null ? void 0 : o.prototypeToken) == null ? void 0 : te.texture) == null ? void 0 : de.src) || ((ne = (X = (V = o == null ? void 0 : o._source) == null ? void 0 : V.prototypeToken) == null ? void 0 : X.texture) == null ? void 0 : ne.src) || ""
  ).trim();
  if (y && !y.includes("*") && !Fe(y))
    return y;
  const I = String((o == null ? void 0 : o.img) ?? ((U = o == null ? void 0 : o._source) == null ? void 0 : U.img) ?? "").trim();
  return Fe(I) ? Fe(a) ? "" : a : I;
}
function Nt(e) {
  var r, i, o;
  if (!e) return null;
  const t = globalThis.game, n = e.character ?? e.characterId ?? ((r = e._source) == null ? void 0 : r.character), a = typeof n == "string" ? n : String((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n._id) ?? "");
  return (a ? (o = (i = t == null ? void 0 : t.actors) == null ? void 0 : i.get) == null ? void 0 : o.call(i, a) : null) ?? (typeof n == "object" ? n : null);
}
function K(e, t = "") {
  var a;
  const n = String(((a = Nt(e)) == null ? void 0 : a.name) ?? "").trim();
  return n || String((e == null ? void 0 : e.name) ?? "").trim() || t;
}
function $t() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) ?? null;
}
function Mt() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : n.api) ?? null;
}
function rn(e = {}, t = {}) {
  var a, r, i;
  const n = ((r = (a = globalThis.foundry) == null ? void 0 : a.utils) == null ? void 0 : r.mergeObject) ?? ((i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.mergeObject);
  return typeof n == "function" ? n(e, t, { inplace: !1 }) : { ...e, ...t };
}
function sn() {
  var e, t, n, a, r;
  return ((n = (t = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : t.randomID) == null ? void 0 : n.call(t, 8)) ?? ((r = (a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.randomID) == null ? void 0 : r.call(a, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function ht(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${sn()}`),
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
function on() {
  var t, n, a;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((a = game == null ? void 0 : game.release) == null ? void 0 : a.generation));
  return Number.isFinite(e) ? e : null;
}
function cn() {
  const e = on();
  return e === null || e >= 13;
}
function Tt(e) {
  return class extends e {
    constructor(a = {}) {
      const r = rn(new.target.defaultOptions ?? {}, a);
      super(ht(r));
      P(this, "_v1Options");
      this._v1Options = r;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return ht(this.defaultOptions ?? {});
    }
    activateListeners(a) {
    }
    async _renderHTML(a, r) {
      var u, c, p;
      const i = typeof this.getData == "function" ? await this.getData() : {}, o = ((u = this._v1Options) == null ? void 0 : u.template) ?? ((c = this.options) == null ? void 0 : c.template) ?? ((p = this.constructor.defaultOptions) == null ? void 0 : p.template);
      if (!o) return document.createDocumentFragment();
      const s = await globalThis.renderTemplate(o, i), l = document.createElement("template");
      return l.innerHTML = s.trim(), l.content;
    }
    _activateV1Form(a) {
      var i, o;
      if (typeof this._updateObject != "function") return;
      const r = (i = a.matches) != null && i.call(a, "form") ? a : (o = a.querySelector) == null ? void 0 : o.call(a, "form");
      r instanceof HTMLFormElement && r.addEventListener("submit", async (s) => {
        var u;
        s.preventDefault(), s.stopPropagation();
        const l = new FormData(r);
        await this._updateObject(s, l), ((u = this._v1Options) == null ? void 0 : u.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(a, r, i) {
      var c, p, f, y;
      r.replaceChildren(a);
      const o = globalThis.jQuery ?? globalThis.$, s = ((c = r.closest) == null ? void 0 : c.call(r, ".window-app, .app, .application")) ?? r, l = o ? o(s) : s;
      try {
        Object.defineProperty(this, "element", {
          value: l,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = l;
        } catch {
        }
      }
      const u = (p = this._v1Options) == null ? void 0 : p.classes;
      Array.isArray(u) && u.length && (r.classList.add(...u), (y = (f = r.closest) == null ? void 0 : f.call(r, ".window-app, .app, .application")) == null || y.classList.add(...u)), this._activateV1Form(r), typeof this.activateListeners == "function" && this.activateListeners(o ? o(r) : r);
    }
  };
}
function ln() {
  const e = $t(), t = Mt(), n = globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (n) return n;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? Tt(a) : null;
}
function un() {
  const e = $t(), t = Mt(), n = globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (n) return n;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? Tt(a) : ln();
}
function dn() {
  var n, a, r, i, o, s;
  const e = ((a = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : a.api) ?? ((r = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : r.api) ?? null, t = ((o = (i = globalThis.foundry) == null ? void 0 : i.applications) == null ? void 0 : o.api) ?? ((s = foundry == null ? void 0 : foundry.applications) == null ? void 0 : s.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function gn(e) {
  var Ae, A, k, Q;
  const {
    moduleId: t,
    templatePath: n,
    composerTemplatePath: a,
    contactsTemplatePath: r,
    messagesTemplatePath: i,
    phoneTemplatePath: o,
    escapeHTML: s,
    getDefaultComposerData: l,
    getActorChoices: u,
    getPlayerChoices: c,
    getContacts: p,
    getGroupContacts: f,
    getMessageContext: y,
    getRingtoneChoices: I,
    getSoundPath: d,
    getActiveContactsTab: w,
    canEditContactImages: M,
    bindCallControls: D,
    bindComposerControls: B,
    bindContactsControls: L,
    bindMessagesControls: te,
    stopRinging: de,
    clearActiveCall: V,
    clearActiveComposer: X,
    clearActiveContacts: ne,
    clearActiveMessages: U,
    clearActivePhone: E
  } = e, T = (A = (Ae = foundry == null ? void 0 : foundry.applications) == null ? void 0 : Ae.api) == null ? void 0 : A.ApplicationV2, R = (Q = (k = foundry == null ? void 0 : foundry.applications) == null ? void 0 : k.api) == null ? void 0 : Q.HandlebarsApplicationMixin, j = dn(), ce = cn();
  function Ie() {
    const C = p(), S = f(), g = w();
    return {
      contacts: C,
      groupContacts: S,
      hasContacts: C.length > 0,
      hasGroupContacts: S.length > 0,
      activeTab: g,
      isPersonalTab: g !== "group",
      isGroupTab: g === "group",
      canEditContactImages: M(),
      canManageNpcContacts: M(),
      actors: u(),
      unreadMessageCount: y().unreadCount,
      hasUnreadMessages: y().unreadCount > 0,
      ringtoneChoices: I(),
      currentRingtone: d()
    };
  }
  function ze() {
    return {
      call: l(),
      actors: u(),
      players: c(),
      ringtoneChoices: I()
    };
  }
  function we(C, S = null) {
    var bt, ft;
    const g = C === "messages", h = !g && ((bt = game.user) == null ? void 0 : bt.isGM), N = !g && !((ft = game.user) != null && ft.isGM);
    return {
      ...g ? y(S) : h ? ze() : Ie(),
      mode: C,
      isMessagesMode: g,
      isComposerMode: h,
      isContactsMode: N,
      isCallsMode: !g
    };
  }
  function ve(C, S) {
    var g;
    return C === "messages" ? Ye(S, s) : (g = game.user) != null && g.isGM ? We(S, s) : Ke(S, s);
  }
  function ae(C) {
    const S = document.createElement("template");
    S.innerHTML = C.trim();
    const g = S.content.firstElementChild;
    return {
      main: g instanceof HTMLElement ? g : document.createElement("div")
    };
  }
  function Se(C, S = null) {
    var g;
    if (C.mode === "messages") {
      te(C, S);
      return;
    }
    (g = game.user) != null && g.isGM ? B(C, S) : L(C, S);
  }
  class Ge extends j {
    constructor(g, h = {}) {
      super(h);
      P(this, "callData");
      this.callData = ue(g);
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
    async _renderInner(g) {
      try {
        return await super._renderInner(g);
      } catch (h) {
        return console.warn(`${t} | Template render failed, using inline fallback.`, h), $(yt(this.callData, s));
      }
    }
    activateListeners(g) {
      super.activateListeners(g), D(this, g);
    }
    async close(g) {
      return V(this), de(), super.close(g);
    }
  }
  class Ue extends j {
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
        call: l(),
        actors: u(),
        players: c(),
        ringtoneChoices: I()
      };
    }
    async _renderInner(S) {
      try {
        return await super._renderInner(S);
      } catch (g) {
        return console.warn(`${t} | Composer template render failed, using inline fallback.`, g), $(We(S, s));
      }
    }
    activateListeners(S) {
      super.activateListeners(S), B(this, S);
    }
    async close(S) {
      return X(this), super.close(S);
    }
  }
  class Ee extends j {
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
      return Ie();
    }
    async _renderInner(S) {
      try {
        return await super._renderInner(S);
      } catch (g) {
        return console.warn(`${t} | Contacts template render failed, using inline fallback.`, g), $(Ke(S, s));
      }
    }
    activateListeners(S) {
      super.activateListeners(S), L(this, S);
    }
    async close(S) {
      return ne(this), super.close(S);
    }
  }
  class Be extends j {
    constructor(g = "calls", h = null, N = {}) {
      super(N);
      P(this, "mode");
      P(this, "contact");
      this.mode = g, this.contact = h;
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
      return we(this.mode, this.contact);
    }
    async _renderInner(g) {
      try {
        return await super._renderInner(g);
      } catch (h) {
        return console.warn(`${t} | Phone template render failed, using inline fallback.`, h), $(ve(this.mode, g));
      }
    }
    activateListeners(g) {
      super.activateListeners(g), Se(this, g);
    }
    async close(g) {
      return E(this), super.close(g);
    }
  }
  class Pe extends j {
    constructor(g = null, h = {}) {
      super(h);
      P(this, "contact");
      this.contact = g;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-messages",
        title: "CyberCall Messages",
        template: i,
        classes: ["cybercall-messages-app"],
        popOut: !0,
        resizable: !0,
        width: 720,
        height: 640
      });
    }
    getData() {
      return y(this.contact);
    }
    async _renderInner(g) {
      try {
        return await super._renderInner(g);
      } catch (h) {
        return console.warn(`${t} | Messages template render failed, using inline fallback.`, h), $(Ye(g, s));
      }
    }
    activateListeners(g) {
      super.activateListeners(g), te(this, g);
    }
    async close(g) {
      return U(this), super.close(g);
    }
  }
  function Re() {
    var C;
    return !ce || !T || !R ? null : (C = class extends R(T) {
      constructor(h, N = {}) {
        super(N);
        P(this, "callData");
        this.callData = ue(h);
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
          return console.warn(`${t} | Template render failed, using inline fallback.`, _), ae(yt(this.callData, s));
        }
      }
      _onRender(h, N) {
        var _;
        (_ = super._onRender) == null || _.call(this, h, N), D(this);
      }
      async close(h) {
        return V(this), de(), super.close(h);
      }
    }, P(C, "DEFAULT_OPTIONS", {
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
    }), P(C, "PARTS", {
      main: {
        template: n
      }
    }), C);
  }
  function De() {
    var C;
    return !ce || !T || !R ? null : (C = class extends R(T) {
      async _prepareContext(g) {
        return {
          ...await super._prepareContext(g),
          call: l(),
          actors: u(),
          players: c(),
          ringtoneChoices: I()
        };
      }
      async _renderHTML(g, h) {
        try {
          return await super._renderHTML(g, h);
        } catch (N) {
          return console.warn(`${t} | Composer template render failed, using inline fallback.`, N), ae(We(g, s));
        }
      }
      _onRender(g, h) {
        var N;
        (N = super._onRender) == null || N.call(this, g, h), B(this);
      }
      async close(g) {
        return X(this), super.close(g);
      }
    }, P(C, "DEFAULT_OPTIONS", {
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
    }), P(C, "PARTS", {
      main: {
        template: a
      }
    }), C);
  }
  function _e() {
    var C;
    return !ce || !T || !R ? null : (C = class extends R(T) {
      async _prepareContext(g) {
        return {
          ...await super._prepareContext(g),
          ...Ie()
        };
      }
      async _renderHTML(g, h) {
        try {
          return await super._renderHTML(g, h);
        } catch (N) {
          return console.warn(`${t} | Contacts template render failed, using inline fallback.`, N), ae(Ke(g, s));
        }
      }
      _onRender(g, h) {
        var N;
        (N = super._onRender) == null || N.call(this, g, h), L(this);
      }
      async close(g) {
        return ne(this), super.close(g);
      }
    }, P(C, "DEFAULT_OPTIONS", {
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
    }), P(C, "PARTS", {
      main: {
        template: r
      }
    }), C);
  }
  function Oe() {
    var C;
    return !ce || !T || !R ? null : (C = class extends R(T) {
      constructor(h = "calls", N = null, _ = {}) {
        super(_);
        P(this, "mode");
        P(this, "contact");
        this.mode = h, this.contact = N;
      }
      async _prepareContext(h) {
        return {
          ...await super._prepareContext(h),
          ...we(this.mode, this.contact)
        };
      }
      async _renderHTML(h, N) {
        try {
          return await super._renderHTML(h, N);
        } catch (_) {
          return console.warn(`${t} | Phone template render failed, using inline fallback.`, _), ae(ve(this.mode, h));
        }
      }
      _onRender(h, N) {
        var _;
        (_ = super._onRender) == null || _.call(this, h, N), Se(this);
      }
      async close(h) {
        return E(this), super.close(h);
      }
    }, P(C, "DEFAULT_OPTIONS", {
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
    }), P(C, "PARTS", {
      main: {
        template: o
      }
    }), C);
  }
  function Le() {
    var C;
    return !ce || !T || !R ? null : (C = class extends R(T) {
      constructor(h = null, N = {}) {
        super(N);
        P(this, "contact");
        this.contact = h;
      }
      async _prepareContext(h) {
        return {
          ...await super._prepareContext(h),
          ...y(this.contact)
        };
      }
      async _renderHTML(h, N) {
        try {
          return await super._renderHTML(h, N);
        } catch (_) {
          return console.warn(`${t} | Messages template render failed, using inline fallback.`, _), ae(Ye(h, s));
        }
      }
      _onRender(h, N) {
        var _;
        (_ = super._onRender) == null || _.call(this, h, N), te(this);
      }
      async close(h) {
        return U(this), super.close(h);
      }
    }, P(C, "DEFAULT_OPTIONS", {
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
    }), P(C, "PARTS", {
      main: {
        template: i
      }
    }), C);
  }
  return {
    CyberCallApplication: Re() ?? Ge,
    CyberCallComposer: De() ?? Ue,
    CyberCallContacts: _e() ?? Ee,
    CyberCallMessages: Le() ?? Pe,
    CyberCallPhone: Oe() ?? Be
  };
}
const m = "cybercall", oe = `module.${m}`, mn = `modules/${m}/templates/cybercall.hbs`, pn = `modules/${m}/templates/cybercall-composer.hbs`, bn = `modules/${m}/templates/cybercall-contacts.hbs`, fn = `modules/${m}/templates/cybercall-messages.hbs`, yn = `modules/${m}/templates/cybercall-phone.hbs`, hn = `modules/${m}/templates/ringtone-settings.hbs`, be = "phoneMessage", kt = 3, Xe = {
  "": "Silent",
  [`modules/${m}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${m}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${m}/audio/Ringtone3.ogg`]: "Ringtone 3"
}, Gt = `modules/${m}/audio/Ringtone1.ogg`, Cn = un();
function Ut(e) {
  var n;
  const t = ((n = e.split("/").pop()) == null ? void 0 : n.replace(/\.[^.]+$/, "")) ?? "Custom ringtone";
  try {
    return decodeURIComponent(t);
  } catch {
    return t;
  }
}
function xe(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  return e.flatMap((n) => {
    const a = String((n == null ? void 0 : n.path) ?? "").trim();
    return !a || t.has(a) ? [] : (t.add(a), [{ label: String((n == null ? void 0 : n.label) ?? "").trim() || Ut(a), path: a }]);
  });
}
function Et() {
  var n, a, r, i, o, s, l, u, c;
  const e = globalThis.foundry;
  return [
    typeof FilePicker < "u" ? FilePicker : null,
    globalThis.FilePicker,
    (r = (a = (n = e == null ? void 0 : e.applications) == null ? void 0 : n.apps) == null ? void 0 : a.FilePicker) == null ? void 0 : r.implementation,
    (o = (i = e == null ? void 0 : e.applications) == null ? void 0 : i.apps) == null ? void 0 : o.FilePicker,
    (l = (s = e == null ? void 0 : e.applications) == null ? void 0 : s.api) == null ? void 0 : l.FilePicker,
    (c = (u = e == null ? void 0 : e.appv1) == null ? void 0 : u.api) == null ? void 0 : c.FilePicker
  ].find((p) => typeof p == "function") ?? null;
}
function In(e, t) {
  var a;
  const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? ((a = e.element) == null ? void 0 : a[0]) ?? e.element ?? null;
  return n instanceof HTMLElement ? n : null;
}
function wn(e) {
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
class vn extends Cn {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-ringtone-settings",
      title: "CyberCall Ringtones",
      template: hn,
      classes: ["cybercall-ringtone-settings-app"],
      width: 680,
      height: "auto",
      resizable: !0,
      closeOnSubmit: !0
    });
  }
  getData() {
    return {
      ringtones: xe(game.settings.get(m, "customRingtones"))
    };
  }
  activateListeners(t) {
    var r;
    super.activateListeners(t);
    const n = In(this, t), a = n == null ? void 0 : n.querySelector("[data-ringtone-list]");
    !n || !a || ((r = n.querySelector("[data-ringtone-add]")) == null || r.addEventListener("click", () => {
      var o;
      const i = wn(a.querySelectorAll("[data-ringtone-row]").length);
      (o = a.querySelector("[data-ringtone-empty]")) == null || o.before(i);
    }), n.addEventListener("click", (i) => {
      var y, I, d, w, M, D;
      const o = i.target, s = (y = o == null ? void 0 : o.closest) == null ? void 0 : y.call(o, "[data-ringtone-remove]");
      if (s) {
        (I = s.closest("[data-ringtone-row]")) == null || I.remove();
        return;
      }
      const l = (d = o == null ? void 0 : o.closest) == null ? void 0 : d.call(o, "[data-ringtone-browse]");
      if (!l) return;
      const u = l.closest("[data-ringtone-row]"), c = u == null ? void 0 : u.querySelector("[data-ringtone-path]"), p = Et();
      if (!c || !p) {
        (M = (w = ui.notifications) == null ? void 0 : w.warn) == null || M.call(w, "Foundry FilePicker is unavailable.");
        return;
      }
      const f = new p({
        type: "audio",
        current: c.value,
        callback: (B) => {
          c.value = B;
          const L = u == null ? void 0 : u.querySelector("[data-ringtone-label]");
          L && !L.value.trim() && (L.value = Ut(B));
        }
      });
      typeof f.browse == "function" ? f.browse() : (D = f.render) == null || D.call(f, !0);
    }));
  }
  async _updateObject(t) {
    var r, i;
    const a = [...t.currentTarget.querySelectorAll("[data-ringtone-row]")].map((o) => {
      var s, l;
      return {
        label: ((s = o.querySelector("[data-ringtone-label]")) == null ? void 0 : s.value) ?? "",
        path: ((l = o.querySelector("[data-ringtone-path]")) == null ? void 0 : l.value) ?? ""
      };
    });
    await game.settings.set(m, "customRingtones", xe(a)), (i = (r = ui.notifications) == null ? void 0 : r.info) == null || i.call(r, "CyberCall ringtones saved.");
  }
}
function ge(e) {
  var n;
  if ((n = foundry == null ? void 0 : foundry.utils) != null && n.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
function G(e, t = "") {
  return String(e ?? t).trim();
}
function le(e) {
  return [...new Set(e.map((t) => G(t)).filter(Boolean))];
}
function Sn() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function Bt(e) {
  const t = G(e, "cybercall");
  let n = 0;
  for (let a = 0; a < t.length; a += 1)
    n = (n << 5) - n + t.charCodeAt(a) | 0;
  return `tone-${Math.abs(n) % 8 + 1}`;
}
function Ct(e, t) {
  return ["direct", ...[e, t].sort()].join(":");
}
function An() {
  return `msg-${fe()}`;
}
function Nn(e = fe()) {
  return `group:${G(e)}`;
}
function ke(e, t = ((n) => (n = game == null ? void 0 : game.user) == null ? void 0 : n.id)()) {
  const a = x(e);
  if (e != null && e.userId)
    return Ct(`user:${G(t, "unknown")}`, `user:${G(e.userId)}`);
  const r = a.number || a.id || a.name;
  return Ct(`user:${G(t, "unknown")}`, `contact:${r}`);
}
function Ze(e = {}) {
  var t;
  return {
    id: G(e.id) || An(),
    threadId: G(e.threadId) || ke({ number: ((t = e.recipientNumbers) == null ? void 0 : t[0]) ?? e.senderNumber }),
    senderUserId: G(e.senderUserId),
    senderActorId: G(e.senderActorId),
    senderName: G(e.senderName, "Unknown Sender"),
    senderNumber: G(e.senderNumber),
    senderImage: G(e.senderImage),
    recipientUserIds: le(e.recipientUserIds ?? []),
    recipientActorIds: le(e.recipientActorIds ?? []),
    recipientNumbers: le(e.recipientNumbers ?? []),
    contactName: G(e.contactName),
    contactImage: G(e.contactImage),
    contactUserId: G(e.contactUserId),
    contactManagedByGM: e.contactManagedByGM === !0,
    contactIsNpc: e.contactIsNpc === !0,
    body: G(e.body),
    messageType: G(e.messageType, "text") || "text",
    eventType: G(e.eventType),
    conversationType: G(e.conversationType, e.groupId ? "group" : "direct") || "direct",
    groupId: G(e.groupId),
    groupName: G(e.groupName),
    groupMemberUserIds: le(e.groupMemberUserIds ?? []),
    groupMemberNames: le(e.groupMemberNames ?? []),
    createdAt: G(e.createdAt) || Sn(),
    chatMessageId: G(e.chatMessageId),
    schemaVersion: Number(e.schemaVersion ?? kt)
  };
}
function Pt(e, t = [], n = "", a = {}) {
  const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (const s of t) {
    const l = x(s), u = { ...l, userId: s == null ? void 0 : s.userId, userIds: (s == null ? void 0 : s.userIds) ?? l.userIds };
    l.number && r.set(l.number, u), s != null && s.userId && i.set(String(s.userId), u);
  }
  const o = /* @__PURE__ */ new Map();
  for (const s of e.map(Ze).filter((l) => l.body)) {
    const l = o.get(s.threadId) ?? [];
    l.push(s), o.set(s.threadId, l);
  }
  return [...o.entries()].map(([s, l]) => {
    var ve, ae, Se, Ge, Ue, Ee, Be, Pe, Re, De, _e, Oe, Le, Ae;
    const u = l.sort((A, k) => A.createdAt.localeCompare(k.createdAt)), c = u[u.length - 1] ?? null, p = [...u].reverse().find((A) => A.conversationType === "group" || A.groupId), f = !!p, y = (p == null ? void 0 : p.groupId) || (f ? s.replace(/^group:/, "") : ""), I = (p == null ? void 0 : p.groupName) || (f ? "Group Chat" : ""), d = f ? le(u.flatMap((A) => [
      ...A.groupMemberUserIds,
      A.senderUserId,
      ...A.recipientUserIds
    ])) : [], w = f ? le(u.flatMap((A) => A.groupMemberNames)) : [], M = w.length ? w : d.map((A) => {
      var k, Q;
      return K((Q = (k = game.users) == null ? void 0 : k.get) == null ? void 0 : Q.call(k, A));
    }).filter(Boolean), D = (c == null ? void 0 : c.senderUserId) === ((ve = game == null ? void 0 : game.user) == null ? void 0 : ve.id) ? (ae = c == null ? void 0 : c.recipientUserIds) == null ? void 0 : ae.find((A) => {
      var k;
      return A !== ((k = game == null ? void 0 : game.user) == null ? void 0 : k.id);
    }) : c == null ? void 0 : c.senderUserId, B = (c == null ? void 0 : c.senderUserId) === ((Se = game == null ? void 0 : game.user) == null ? void 0 : Se.id) ? ((Ge = c == null ? void 0 : c.recipientNumbers) == null ? void 0 : Ge[0]) || "" : (c == null ? void 0 : c.senderNumber) || ((Ue = c == null ? void 0 : c.recipientNumbers) == null ? void 0 : Ue[0]) || "", L = c != null && c.contactName && !(c != null && c.contactUserId) && (c.contactIsNpc || c.contactManagedByGM) ? {
      id: `contact-${((Ee = c.recipientNumbers) == null ? void 0 : Ee[0]) || c.senderNumber || s}`,
      name: c.contactName,
      number: ((Be = c.recipientNumbers) == null ? void 0 : Be[0]) || c.senderNumber || "",
      image: c.contactImage || "",
      actorId: ((Pe = c.recipientActorIds) == null ? void 0 : Pe[0]) ?? c.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: H(c.contactName)
    } : null, te = (c == null ? void 0 : c.senderUserId) !== ((Re = game == null ? void 0 : game.user) == null ? void 0 : Re.id) && (c != null && c.senderNumber) && (c != null && c.contactName) ? {
      id: `contact-${c.senderNumber || s}`,
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
      id: `group-${y || s}`,
      name: I,
      number: `${d.length} member${d.length === 1 ? "" : "s"}`,
      image: "",
      actorId: "",
      userId: "",
      userIds: d.filter((A) => {
        var k;
        return A !== ((k = game == null ? void 0 : game.user) == null ? void 0 : k.id);
      }),
      managedByGM: !1,
      isNpc: !1,
      isGroup: !0,
      initials: H(I)
    } : null) ?? L ?? te ?? i.get(D) ?? r.get(B) ?? {
      id: `contact-${B || s}`,
      name: (c == null ? void 0 : c.contactName) || ((c == null ? void 0 : c.senderUserId) === ((De = game == null ? void 0 : game.user) == null ? void 0 : De.id) ? B || "Unknown Contact" : (c == null ? void 0 : c.senderName) || B || "Unknown Contact"),
      number: B,
      image: (c == null ? void 0 : c.contactImage) || "",
      actorId: ((_e = c == null ? void 0 : c.recipientActorIds) == null ? void 0 : _e[0]) ?? "",
      userId: "",
      userIds: [],
      managedByGM: !!(c != null && c.contactName || (Oe = c == null ? void 0 : c.recipientActorIds) != null && Oe[0]),
      isNpc: !!(c != null && c.contactName || (Le = c == null ? void 0 : c.recipientActorIds) != null && Le[0]),
      initials: H((c == null ? void 0 : c.contactName) || (c == null ? void 0 : c.senderName) || B)
    }, X = f ? null : [...u].reverse().find(
      (A) => A.senderUserId === D && A.senderImage
    ), ne = [...u].reverse().find((A) => {
      var Q, C;
      const k = (C = (Q = game.users) == null ? void 0 : Q.get) == null ? void 0 : C.call(Q, A.senderUserId);
      return A.senderUserId && (k == null ? void 0 : k.isGM) !== !0 && !A.contactUserId && !!A.contactName && (A.contactIsNpc || A.contactManagedByGM);
    }) ?? null, U = ((Ae = game == null ? void 0 : game.user) == null ? void 0 : Ae.isGM) === !0 ? ne : null, E = U ? `TO: ${U.contactName}` : "", T = U ? i.get(U.senderUserId) : null, R = (U == null ? void 0 : U.senderName) || (T == null ? void 0 : T.name) || V.name || (c == null ? void 0 : c.senderName) || "Unknown Contact", j = U ? (T == null ? void 0 : T.number) || `@${U.senderName}` : V.number || (c == null ? void 0 : c.senderNumber) || "", ce = U ? H(R) : V.initials || H(V.name || (c == null ? void 0 : c.senderName)), Ie = (U == null ? void 0 : U.senderImage) || (T == null ? void 0 : T.image) || (X == null ? void 0 : X.senderImage) || V.image || "", ze = a[s] ?? "", we = u.filter(
      (A) => {
        var k;
        return A.senderUserId !== ((k = game == null ? void 0 : game.user) == null ? void 0 : k.id) && A.createdAt > ze;
      }
    );
    return {
      id: s,
      title: R,
      subtitle: j,
      initials: ce,
      image: Ie,
      avatarTone: Bt(f ? y || s : (U == null ? void 0 : U.senderUserId) || V.userId || V.number || s),
      routeLabel: E,
      hasRouteLabel: !!E,
      isNpcRouted: !!ne,
      contact: V,
      messages: u.map((A) => {
        var k;
        return {
          ...A,
          isMine: A.senderUserId === ((k = game == null ? void 0 : game.user) == null ? void 0 : k.id),
          isEvent: A.messageType !== "text"
        };
      }),
      lastMessage: c,
      lastPreview: (c == null ? void 0 : c.body) ?? "",
      updatedAt: (c == null ? void 0 : c.createdAt) ?? "",
      unread: we.length > 0,
      unreadCount: we.length,
      active: s === n,
      isGroup: f,
      groupId: y,
      groupName: I,
      groupMemberUserIds: d,
      groupMemberNames: M
    };
  }).sort((s, l) => l.updatedAt.localeCompare(s.updatedAt));
}
function $n(e) {
  var n, a, r;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[m]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, m, "message"));
  return (t == null ? void 0 : t.kind) === be ? t : ((r = t == null ? void 0 : t.message) == null ? void 0 : r.kind) === be ? t.message : null;
}
function Mn(e) {
  return String(e != null && e.timestamp ? new Date(e.timestamp).toISOString() : (e == null ? void 0 : e.createdTime) ?? "");
}
function Tn() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => t.id);
}
function et(e) {
  return [...new Set(e.map((t) => String(t ?? "").trim()).filter(Boolean))];
}
function kn(e) {
  const t = Array.isArray(e == null ? void 0 : e.whisper) ? e.whisper : [];
  return et(t.map((n) => (n == null ? void 0 : n.id) ?? n));
}
function Gn(e, t) {
  var i, o;
  const n = String(((i = game.user) == null ? void 0 : i.id) ?? "").trim();
  if (!n) return !1;
  if (e.senderUserId === n || e.recipientUserIds.includes(n)) return !0;
  if (((o = game.user) == null ? void 0 : o.isGM) === !0)
    return !e.contactUserId && (e.contactManagedByGM || e.contactIsNpc) ? !0 : game.settings.get(m, "gmViewPlayerMessages") === !0;
  const r = kn(t);
  return r.length && !r.includes(n), !1;
}
function Un(e) {
  const t = Array.isArray(e == null ? void 0 : e.userIds) ? e.userIds : e != null && e.userId ? [e.userId] : [], n = et(t);
  return n.length ? n : Tn();
}
function En(e) {
  return !!(e != null && e.userId || Array.isArray(e == null ? void 0 : e.userIds) && e.userIds.length);
}
function Bn(e, t) {
  const n = e.senderName || "CyberCall", a = t != null && t.name ? `<span>${ge(t.name)}</span>` : "";
  return `
    <div class="cybercall-chat-card${e.messageType !== "text" ? " cybercall-chat-card--event" : ""}" data-cybercall-thread-id="${ge(e.threadId)}">
      <strong>${ge(n)}</strong>
      ${a}
      <p>${ge(e.body)}</p>
      <button type="button" data-cybercall-open-thread data-cybercall-thread-id="${ge(e.threadId)}">Open CyberCall</button>
    </div>
  `;
}
function Pn() {
  var t;
  return (((t = game.messages) == null ? void 0 : t.contents) ?? []).map((n) => {
    const a = $n(n);
    if (!a) return null;
    const r = Ze({
      ...a,
      chatMessageId: n.id,
      createdAt: a.createdAt || Mn(n)
    });
    return Gn(r, n) ? r : null;
  }).filter(Boolean);
}
async function tt(e, t, n = {}) {
  var I;
  const a = x(e), r = String(t ?? "").trim();
  if (!r) return null;
  const i = game.user, o = n.recipientUserIds ? et(n.recipientUserIds) : Un(e), s = !En(e), l = String(n.threadId ?? ke(e, i == null ? void 0 : i.id)), u = String(n.senderName ?? "").trim() || K(i, "Unknown Sender"), c = String(n.senderActorId ?? ((I = i == null ? void 0 : i.character) == null ? void 0 : I.id) ?? "").trim(), p = String(n.senderNumber ?? "").trim(), f = Ze({
    threadId: l,
    senderUserId: (i == null ? void 0 : i.id) ?? "",
    senderActorId: c,
    senderName: u,
    senderNumber: p,
    senderImage: String(n.senderImage ?? Te(i)).trim(),
    recipientUserIds: o,
    recipientActorIds: a.actorId ? [a.actorId] : [],
    recipientNumbers: n.recipientNumbers ?? (a.number ? [a.number] : []),
    contactName: String(n.contactName ?? a.name ?? ""),
    contactImage: String(n.contactImage ?? a.image ?? ""),
    contactUserId: String(n.contactUserId ?? a.userId ?? ""),
    contactManagedByGM: n.contactManagedByGM ?? (a.managedByGM === !0 || s),
    contactIsNpc: n.contactIsNpc ?? (a.isNpc === !0 || s),
    body: r,
    messageType: String(n.messageType ?? "text"),
    eventType: String(n.eventType ?? ""),
    conversationType: String(n.conversationType ?? "direct"),
    groupId: String(n.groupId ?? ""),
    groupName: String(n.groupName ?? ""),
    groupMemberUserIds: n.groupMemberUserIds ?? [],
    groupMemberNames: n.groupMemberNames ?? [],
    schemaVersion: kt
  }), y = [...new Set([i == null ? void 0 : i.id, ...o].filter(Boolean))];
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: f.senderName }),
    whisper: y,
    content: Bn(f, a),
    flags: {
      [m]: {
        kind: be,
        ...f
      }
    }
  });
}
async function Rn(e, t, n = {}) {
  return tt(e, t, {
    ...n,
    messageType: n.messageType ?? "event"
  });
}
let b = null, v = null, Z = null, F = null, Y = null, me = "personal", O = "", J = !1, W = !1, re = null, pe = null;
function Dn() {
  var e, t, n, a, r, i, o, s;
  return ue({
    callerName: ((e = b == null ? void 0 : b.callData) == null ? void 0 : e.callerName) ?? q.callerName,
    subtitle: ((t = b == null ? void 0 : b.callData) == null ? void 0 : t.subtitle) ?? q.subtitle,
    image: ((n = b == null ? void 0 : b.callData) == null ? void 0 : n.image) ?? "",
    message: ((a = b == null ? void 0 : b.callData) == null ? void 0 : a.message) ?? q.message,
    signal: ((r = b == null ? void 0 : b.callData) == null ? void 0 : r.signal) ?? game.settings.get(m, "defaultSignal"),
    variant: ((i = b == null ? void 0 : b.callData) == null ? void 0 : i.variant) ?? "standard",
    fullscreen: ((o = b == null ? void 0 : b.callData) == null ? void 0 : o.fullscreen) ?? !1,
    ringing: ((s = b == null ? void 0 : b.callData) == null ? void 0 : s.ringing) ?? !0
  });
}
function _n() {
  var e;
  return (((e = game.actors) == null ? void 0 : e.contents) ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    img: t.img ?? ""
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function On() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => !t.isGM).map((t) => ({
    id: t.id,
    name: K(t, "Unknown Player"),
    active: t.active === !0
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function Ln() {
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
function Fn() {
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
      image: Te(t),
      userId: t.id,
      userIds: [t.id],
      isNpc: !1,
      managedByGM: !1
    };
  }).sort((t, n) => t.name.localeCompare(n.name));
}
function ye() {
  var e, t;
  return String(((e = game.world) == null ? void 0 : e.id) ?? ((t = game.world) == null ? void 0 : t.title) ?? "default");
}
function Rt() {
  const e = game.settings.get(m, "contacts");
  return Array.isArray(e) ? { [ye()]: e } : !e || typeof e != "object" ? {} : e;
}
function he() {
  const e = Rt()[ye()];
  return Array.isArray(e) ? e.map(x).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function se() {
  if (Array.isArray(pe))
    return pe.map(x).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name));
  const e = game.settings.get(m, "groupContacts");
  return Array.isArray(e) ? e.map(x).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function nt() {
  const e = /* @__PURE__ */ new Map();
  for (const t of [...Fn(), ...se(), ...he()]) {
    const n = t.userId ? `user:${t.userId}` : `number:${t.number || t.id}`;
    e.has(n) || e.set(n, t);
  }
  return [...e.values()].sort((t, n) => t.name.localeCompare(n.name));
}
async function Dt(e) {
  await game.settings.set(m, "contacts", {
    ...Rt(),
    [ye()]: e.map(x)
  });
}
async function Ve(e) {
  pe = e.map(x), await game.settings.set(m, "groupContacts", pe), game.socket.emit(oe, {
    action: "groupContactsChanged",
    contacts: pe
  });
}
function at() {
  const e = game.settings.get(m, "messageReadState");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function _t() {
  const e = game.settings.get(m, "messageDeletedBefore");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function rt() {
  const e = game.settings.get(m, "npcThreadBindings");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
async function Qe(e, t) {
  var a;
  if (!((a = game.user) != null && a.isGM) || !e) return;
  const n = { ...rt() };
  t === null ? delete n[e] : n[e] = { ...n[e] ?? {}, ...t }, await game.settings.set(m, "npcThreadBindings", n);
}
function Ot() {
  const e = _t();
  return Pn().filter((t) => {
    const n = e[t.threadId];
    return !n || t.createdAt > n;
  });
}
function Lt() {
  return Pt(Ot(), nt(), "", at()).reduce((e, t) => e + Number(t.unreadCount ?? 0), 0);
}
async function xn(e, t = (/* @__PURE__ */ new Date()).toISOString()) {
  e && await game.settings.set(m, "messageReadState", {
    ...at(),
    [e]: t
  });
}
async function $e() {
  O && await xn(O);
}
async function Vn(e) {
  e && (await game.settings.set(m, "messageDeletedBefore", {
    ..._t(),
    [e]: (/* @__PURE__ */ new Date()).toISOString()
  }), O === e && (O = "", J = !0, W = !1, Y && (Y.contact = null), (v == null ? void 0 : v.mode) === "messages" && (v.contact = null)), await z(), await ee());
}
async function qn(e, t, n = "personal", a = "", r = {}) {
  var l, u, c, p, f, y, I;
  const i = r.actorId ? (l = game.actors) == null ? void 0 : l.get(r.actorId) : null, o = x({
    name: String(e ?? "").trim() || (i == null ? void 0 : i.name),
    number: t,
    image: Ne() && (String(a ?? "").trim() || (i == null ? void 0 : i.img)) || "",
    actorId: Ne() ? r.actorId : "",
    managedByGM: Ne() ? r.managedByGM === !0 : !1,
    isNpc: Ne() ? r.isNpc === !0 || r.managedByGM === !0 || !!r.actorId : !1
  });
  if (!o.name || !o.number) {
    (c = (u = ui.notifications) == null ? void 0 : u.warn) == null || c.call(u, "Contact name and number are required.");
    return;
  }
  if (n === "group" && !game.user.isGM) {
    if (!st()) {
      (f = (p = ui.notifications) == null ? void 0 : p.warn) == null || f.call(p, "A GM must be connected to update group contacts.");
      return;
    }
    game.socket.emit(oe, {
      action: "groupContactAdd",
      contact: o
    }), (I = (y = ui.notifications) == null ? void 0 : y.info) == null || I.call(y, "Group contact update sent to the GM.");
    return;
  }
  const s = n === "group" ? se() : he();
  s.push(o), n === "group" ? await Ve(s) : await Dt(s), await ee();
}
async function jn(e, t = "personal") {
  var n, a, r, i;
  if (t === "group") {
    if (!game.user.isGM) {
      if (!st()) {
        (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(oe, {
        action: "groupContactRemove",
        contactId: e
      }), (i = (r = ui.notifications) == null ? void 0 : r.info) == null || i.call(r, "Group contact removal sent to the GM.");
      return;
    }
    await Ve(se().filter((o) => o.id !== e));
  } else
    await Dt(he().filter((o) => o.id !== e));
  await ee();
}
function st() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function je(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(m, "minimumRole");
  } catch (n) {
    console.warn(`${m} | Permission setting unavailable, using Player role fallback.`, n);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function Ne(e = game.user) {
  return !!(e != null && e.isGM);
}
function Ce(e, t = null) {
  var n;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (n = e.element) != null && n[0] ? e.element[0] : e.element ?? null;
}
const zn = 24;
function Wn(e) {
  var i, o, s;
  const t = Ce(e), n = (i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, ".cybercall-message-log");
  if (!(n instanceof HTMLElement)) return null;
  const a = (o = t.querySelector) == null ? void 0 : o.call(t, "[data-cybercall-active-thread]"), r = n.scrollHeight - n.clientHeight - n.scrollTop;
  return {
    threadId: String(((s = a == null ? void 0 : a.dataset) == null ? void 0 : s.cybercallActiveThread) ?? ""),
    scrollTop: n.scrollTop,
    stickToBottom: r <= zn
  };
}
function Kn(e, t) {
  var u;
  const n = t.querySelector(".cybercall-message-log");
  if (!(n instanceof HTMLElement)) return;
  const a = e == null ? void 0 : e._cybercallMessageScrollState, r = t.querySelector("[data-cybercall-active-thread]"), i = String(((u = r == null ? void 0 : r.dataset) == null ? void 0 : u.cybercallActiveThread) ?? ""), o = !a || a.scrollToBottom === !0 || a.stickToBottom === !0 || a.threadId !== i;
  delete e._cybercallMessageScrollState;
  const s = {};
  e._cybercallMessageScrollRestoreToken = s;
  const l = () => {
    if (e._cybercallMessageScrollRestoreToken !== s || !n.isConnected) return;
    const c = Math.max(0, n.scrollHeight - n.clientHeight);
    n.scrollTop = o ? c : Math.min(a.scrollTop, c);
  };
  l(), requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      l(), e._cybercallMessageScrollRestoreToken === s && delete e._cybercallMessageScrollRestoreToken;
    });
  });
}
function He(e) {
  var a;
  const t = e.querySelector("[data-cybercall-active-thread]"), n = String(((a = t == null ? void 0 : t.dataset) == null ? void 0 : a.cybercallActiveThread) ?? "");
  return n ? `thread:${n}` : e.querySelector("form[data-cybercall-group-form]") ? "new-group" : "new-message";
}
function Yn(e) {
  const t = Ce(e);
  if (!(t instanceof HTMLElement)) return null;
  const n = t.querySelector("form[data-cybercall-group-form]");
  if (n) {
    const o = n.elements.namedItem("groupName");
    return {
      key: He(t),
      groupName: (o == null ? void 0 : o.value) ?? "",
      memberUserIds: [...n.querySelectorAll('input[name="memberUserIds"]:checked')].map((s) => s.value)
    };
  }
  const a = t.querySelector("form[data-cybercall-message-form]");
  if (!a) return null;
  const r = a.elements.namedItem("body"), i = (o) => {
    var s;
    return ((s = a.elements.namedItem(o)) == null ? void 0 : s.value) ?? "";
  };
  return {
    key: He(t),
    body: (r == null ? void 0 : r.value) ?? "",
    contactId: i("contactId"),
    replyAs: i("replyAs"),
    sendAs: i("sendAs"),
    bodyWasFocused: document.activeElement === r,
    selectionStart: (r == null ? void 0 : r.selectionStart) ?? null,
    selectionEnd: (r == null ? void 0 : r.selectionEnd) ?? null
  };
}
function Jn(e, t) {
  const n = e == null ? void 0 : e._cybercallMessageComposerState;
  if (delete e._cybercallMessageComposerState, !n || n.key !== He(t)) return;
  const a = t.querySelector("form[data-cybercall-group-form]");
  if (a) {
    const s = a.elements.namedItem("groupName");
    s && (s.value = n.groupName ?? "");
    const l = new Set(n.memberUserIds ?? []);
    a.querySelectorAll('input[name="memberUserIds"]').forEach((u) => {
      u.checked = l.has(u.value);
    });
    return;
  }
  const r = t.querySelector("form[data-cybercall-message-form]");
  if (!r) return;
  const i = (s, l) => {
    const u = r.elements.namedItem(s);
    u && [...u instanceof HTMLSelectElement ? u.options : []].some((c) => c.value === l) && (u.value = l);
  };
  i("contactId", n.contactId), i("replyAs", n.replyAs), i("sendAs", n.sendAs);
  const o = r.elements.namedItem("body");
  o && (o.value = n.body ?? "", n.bodyWasFocused && requestAnimationFrame(() => {
    o.isConnected && (o.focus({ preventScroll: !0 }), n.selectionStart !== null && n.selectionEnd !== null && o.setSelectionRange(n.selectionStart, n.selectionEnd));
  }));
}
function Qn(e, t = null) {
  const n = Ce(e, t);
  n && (n.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), n.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), n.classList.toggle("cybercall-connected", e.callData.accepted), n.querySelectorAll("[data-cybercall-action]").forEach((a) => {
    a.addEventListener("click", async (r) => {
      const i = r.currentTarget.dataset.cybercallAction;
      if (i === "accept") {
        await fa(e.callData.id);
        return;
      }
      if (i === "broadcast") {
        gt({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (i === "decline" || i === "end") && await jt(e.callData.id);
    });
  }));
}
function Hn(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-composer]");
}
function It(e) {
  var l, u;
  const t = new FormData(e), n = (l = game.actors) == null ? void 0 : l.get(t.get("actorId")), a = String(t.get("image") ?? "").trim() || (n == null ? void 0 : n.img) || "", r = String(t.get("callerName") ?? "").trim() || (n == null ? void 0 : n.name) || "UNKNOWN CALLER", i = t.getAll("targetUserIds").map((c) => String(c)).filter(Boolean), o = new Map((((u = game.users) == null ? void 0 : u.contents) ?? []).map((c) => [c.id, c])), s = i.map((c) => K(o.get(c)) || c);
  return ue({
    callerName: r,
    subtitle: String(t.get("subtitle") ?? "").trim(),
    image: a,
    message: String(t.get("message") ?? "").trim(),
    signal: t.get("signal"),
    variant: String(t.get("variant") ?? q.variant),
    fullscreen: t.get("fullscreen") === "on",
    ringing: t.get("ringing") === "on",
    targetUserIds: i,
    targetUserNames: s
  });
}
function Je(e) {
  var a, r;
  const t = (a = e == null ? void 0 : e.elements) == null ? void 0 : a.signal, n = (r = e == null ? void 0 : e.querySelector) == null ? void 0 : r.call(e, "[data-cybercall-signal-output]");
  !t || !n || (n.textContent = `${At(t.value)}%`);
}
function Xn(e, t = null) {
  var i, o;
  const n = Ce(e, t), a = Hn(n);
  if (!n || !a) return;
  Je(a);
  const r = n.querySelector("[data-cybercall-ringtone]");
  r && r.addEventListener("change", async (s) => {
    await Yt(s.currentTarget.value);
  }), (i = a.elements.signal) == null || i.addEventListener("input", () => Je(a)), (o = a.elements.actorId) == null || o.addEventListener("change", () => {
    var l;
    const s = (l = game.actors) == null ? void 0 : l.get(a.elements.actorId.value);
    s && (a.elements.callerName.value = s.name, a.elements.image.value = s.img ?? "");
  }), a.addEventListener("submit", (s) => {
    s.preventDefault(), ie(It(a));
  }), n.querySelectorAll("[data-cybercall-compose-action]").forEach((s) => {
    s.addEventListener("click", async (l) => {
      var p, f, y, I;
      const u = l.currentTarget.dataset.cybercallComposeAction, c = It(a);
      if (u === "preview") {
        await ie(c);
        return;
      }
      if (u === "broadcast") {
        await gt(c);
        return;
      }
      if (u === "close-active") {
        jt((p = b == null ? void 0 : b.callData) == null ? void 0 : p.id);
        return;
      }
      if (u === "browse-image") {
        const d = a.elements.image, w = Et();
        if (!d || !w) {
          (y = (f = ui.notifications) == null ? void 0 : f.warn) == null || y.call(f, "Foundry FilePicker is unavailable.");
          return;
        }
        const M = new w({
          type: "image",
          current: d.value,
          callback: (D) => {
            d.value = D, d.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof M.browse == "function" ? M.browse() : (I = M.render) == null || I.call(M, !0);
        return;
      }
      if (u === "reset") {
        a.reset(), Je(a);
        return;
      }
      u === "open-messages" && await Me();
    });
  });
}
function Zn(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function ea(e, t = null) {
  var i, o;
  const n = Ce(e, t), a = Zn(n);
  if (!n || !a) return;
  a.addEventListener("submit", async (s) => {
    var c;
    s.preventDefault();
    const l = new FormData(a), u = String(l.get("scope") ?? me);
    await qn(l.get("name"), l.get("number"), u, l.get("image"), {
      actorId: l.get("actorId"),
      managedByGM: l.get("managedByGM") === "on",
      isNpc: l.get("managedByGM") === "on" || !!l.get("actorId")
    }), a.reset(), a.elements.scope.value = u, (c = a.elements.name) == null || c.focus();
  }), (i = a.elements.actorId) == null || i.addEventListener("change", () => {
    var l;
    const s = (l = game.actors) == null ? void 0 : l.get(a.elements.actorId.value);
    s && (a.elements.name.value || (a.elements.name.value = s.name), a.elements.image && !a.elements.image.value && (a.elements.image.value = s.img ?? ""), a.elements.managedByGM && (a.elements.managedByGM.checked = !0));
  }), n.querySelectorAll("[data-cybercall-contact-tab]").forEach((s) => {
    s.addEventListener("click", (l) => {
      me = l.currentTarget.dataset.cybercallContactTab, n.querySelectorAll("[data-cybercall-contact-tab]").forEach((u) => {
        u.classList.toggle("active", u.dataset.cybercallContactTab === me);
      }), n.querySelectorAll("[data-cybercall-contact-panel]").forEach((u) => {
        u.hidden = u.dataset.cybercallContactPanel !== me;
      }), a.elements.scope && (a.elements.scope.value = me);
    });
  });
  const r = n.querySelector("[data-cybercall-ringtone]");
  r && r.addEventListener("change", async (s) => {
    await Yt(s.currentTarget.value);
  }), n.querySelectorAll("[data-cybercall-contact-action]").forEach((s) => {
    s.addEventListener("click", async (l) => {
      const u = l.currentTarget.dataset.cybercallContactAction, c = l.currentTarget.dataset.contactId, p = l.currentTarget.dataset.contactScope ?? "personal", y = (p === "group" ? se() : he()).find((I) => I.id === c);
      if (u === "remove") {
        await jn(c, p);
        return;
      }
      if (u === "call" && y) {
        await Ia(y) && F === e && await e.close();
        return;
      }
      u === "message" && y && await Me(y);
    });
  }), (o = n.querySelector("[data-cybercall-open-messages]")) == null || o.addEventListener("click", async () => {
    await Me();
  });
}
function ta(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
function na(e) {
  var c, p, f, y, I, d, w;
  const t = rt()[e.id] ?? null, n = ((c = game.user) == null ? void 0 : c.isGM) === !0, a = !!(!e.isGroup && e.contact && !e.contact.userId && (e.contact.isNpc || e.contact.managedByGM || e.isNpcRouted)), r = t != null && t.actorId ? (f = (p = game.actors) == null ? void 0 : p.get) == null ? void 0 : f.call(p, t.actorId) : null, i = String((r == null ? void 0 : r.name) ?? (t == null ? void 0 : t.actorName) ?? "").trim(), o = String((t == null ? void 0 : t.image) ?? ((I = (y = r == null ? void 0 : r.prototypeToken) == null ? void 0 : y.texture) == null ? void 0 : I.src) ?? (r == null ? void 0 : r.img) ?? "").trim(), s = (t == null ? void 0 : t.revealPortrait) === !0, l = e.isNpcRouted === !0, u = t || l ? {
    ...e.contact,
    actorId: t && n ? String(t.actorId ?? e.contact.actorId ?? "") : e.contact.actorId,
    image: t && s ? o : ""
  } : e.contact;
  return {
    ...e,
    contact: u,
    image: !n && l ? t && s ? o : "" : e.image,
    canLinkNpc: n && a,
    showNpcLinkPanel: n && (a || !!t),
    hasNpcBinding: !!t,
    npcBindingName: i || ((d = e.contact) == null ? void 0 : d.name) || "Linked NPC",
    npcBindingImage: o,
    npcBindingInitials: H(i || ((w = e.contact) == null ? void 0 : w.name) || "NPC"),
    npcPortraitRevealed: s,
    npcBindingStatusLabel: t ? `Linked to ${i || "Actor"}` : "Unlinked NPC contact"
  };
}
function it(e = null) {
  var y, I, d;
  let t = nt();
  const n = e ?? t[0] ?? null;
  n && !t.some((w) => w.id === n.id || w.number === n.number) && (t = [...t, x(n)].sort((w, M) => w.name.localeCompare(M.name)));
  const a = J || W ? "" : O, r = Pt(Ot(), t, a, at()).map((w) => ({
    ...na(w),
    messages: w.messages.map((M) => ({
      ...M,
      createdAtLabel: ta(M.createdAt)
    }))
  })), i = J || W ? null : r.find((w) => w.id === O) ?? null;
  i != null && i.contact && !t.some((w) => w.id === i.contact.id || w.number === i.contact.number) && (t = [...t, i.contact].sort((w, M) => w.name.localeCompare(M.name)));
  const o = ((y = i == null ? void 0 : i.contact) == null ? void 0 : y.id) ?? (n == null ? void 0 : n.id) ?? "", s = Lt(), l = Ft(i, { excludeGMs: !1 }), u = sa(i), c = xt(), p = ((I = game.user) == null ? void 0 : I.isGM) === !0 && !i && c.length > 1, f = Ln();
  return {
    threads: r,
    hasThreads: r.length > 0,
    unreadCount: s,
    hasUnreadMessages: s > 0,
    activeThread: i,
    activeThreadId: (i == null ? void 0 : i.id) ?? a,
    allContacts: t.map((w) => ({
      ...w,
      selected: w.id === o
    })),
    hasContacts: t.length > 0,
    selectedContactId: o,
    isThreadReply: !!i,
    isComposingNewMessage: !i && !W,
    isComposingNewGroup: W,
    groupMemberChoices: f,
    hasGroupMemberChoices: f.length > 0,
    canDeleteThread: !!i,
    threadReplyLabel: i ? `${i.title}${i.subtitle ? ` (${i.subtitle})` : ""}` : "",
    canReplyAs: u.length > 1,
    replyAsChoices: u,
    canSendAs: p,
    sendAsChoices: c,
    activeThreadRecipientUserIds: l,
    showMessageTimestamps: game.settings.get(m, "showMessageTimestamps") === !0,
    gmViewPlayerMessagesEnabled: game.settings.get(m, "gmViewPlayerMessages") === !0,
    isFoundryV13Plus: Number(((d = game.release) == null ? void 0 : d.generation) ?? 0) >= 13
  };
}
function aa(e, t = it()) {
  const n = String(new FormData(e).get("contactId") ?? "");
  return t.allContacts.find((a) => a.id === n) ?? null;
}
function Ft(e, t = {}) {
  var i, o, s;
  if (!((i = e == null ? void 0 : e.messages) != null && i.length)) return [];
  const n = String(((o = game.user) == null ? void 0 : o.id) ?? ""), a = new Set((((s = game.users) == null ? void 0 : s.contents) ?? []).filter((l) => l.isGM).map((l) => String(l.id))), r = /* @__PURE__ */ new Set();
  for (const l of e.messages) {
    l.senderUserId && l.senderUserId !== n && !(t.excludeGMs && a.has(l.senderUserId)) && r.add(l.senderUserId);
    for (const u of l.recipientUserIds ?? [])
      u && u !== n && !(t.excludeGMs && a.has(u)) && r.add(u);
  }
  return [...r];
}
function ra() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => String(t.id)).filter(Boolean);
}
function sa(e) {
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
function xt() {
  var n, a;
  const e = [{
    id: "self",
    label: K(game.user, "Me"),
    selected: !0,
    contact: null
  }];
  if (!((n = game.user) != null && n.isGM)) return e;
  const t = /* @__PURE__ */ new Set();
  for (const r of [...se(), ...he()].map(x)) {
    if (!r.name || r.userId || !r.managedByGM && !r.actorId && !r.isNpc) continue;
    const i = r.actorId || r.number || r.id;
    t.has(i) || (t.add(i), e.push({
      id: i,
      label: r.name,
      selected: !1,
      contact: r
    }));
  }
  for (const r of ((a = game.actors) == null ? void 0 : a.contents) ?? []) {
    const i = `actor-${r.id}`;
    t.has(r.id) || t.has(i) || (t.add(i), e.push({
      id: i,
      label: r.name,
      selected: !1,
      contact: x({
        id: i,
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
function wt(e) {
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
function ia(e, t) {
  var i, o;
  const n = new FormData(e);
  if (t.activeThread)
    return String(n.get("replyAs") ?? "self") === "contact" && ((i = game.user) != null && i.isGM) && t.activeThread.contact ? wt(t.activeThread.contact) : {};
  const a = String(n.get("sendAs") ?? "self");
  if (a === "self" || !((o = game.user) != null && o.isGM)) return {};
  const r = xt().find((s) => s.id === a);
  return wt(r == null ? void 0 : r.contact);
}
function oa(e) {
  var n, a, r, i, o;
  const t = globalThis.TextEditor ?? ((r = (a = (n = globalThis.foundry) == null ? void 0 : n.applications) == null ? void 0 : a.ux) == null ? void 0 : r.TextEditor);
  try {
    const s = (i = t == null ? void 0 : t.getDragEventData) == null ? void 0 : i.call(t, e);
    if (s && Object.keys(s).length) return s;
  } catch {
  }
  try {
    return JSON.parse(((o = e.dataTransfer) == null ? void 0 : o.getData("text/plain")) || "{}");
  } catch {
    return {};
  }
}
function vt(e) {
  var n, a, r, i, o, s;
  const t = String(
    ((n = e == null ? void 0 : e.getTextureSrc) == null ? void 0 : n.call(e)) || ((a = e == null ? void 0 : e.texture) == null ? void 0 : a.src) || ((i = (r = e == null ? void 0 : e.document) == null ? void 0 : r.texture) == null ? void 0 : i.src) || ((s = (o = e == null ? void 0 : e.prototypeToken) == null ? void 0 : o.texture) == null ? void 0 : s.src) || (e == null ? void 0 : e.img) || ""
  ).trim();
  return t.includes("*") ? String((e == null ? void 0 : e.img) ?? "").trim() : t;
}
async function ca(e) {
  var o, s, l, u, c, p, f, y;
  const t = oa(e), n = globalThis.fromUuid;
  let a = t.uuid && n ? await n(t.uuid) : null;
  !a && t.sceneId && t.tokenId && (a = ((c = (u = (l = (s = (o = game.scenes) == null ? void 0 : o.get) == null ? void 0 : s.call(o, t.sceneId)) == null ? void 0 : l.tokens) == null ? void 0 : u.get) == null ? void 0 : c.call(u, t.tokenId)) ?? null);
  const r = String(
    ((p = a == null ? void 0 : a.actor) == null ? void 0 : p.id) || (a == null ? void 0 : a.actorId) || ((a == null ? void 0 : a.documentName) === "Actor" ? a.id : "") || t.actorId || (t.type === "Actor" ? t.id : "") || ""
  ).trim(), i = (a == null ? void 0 : a.documentName) === "Actor" ? a : (a == null ? void 0 : a.actor) ?? (r ? (y = (f = game.actors) == null ? void 0 : f.get) == null ? void 0 : y.call(f, r) : null);
  return i ? {
    actorId: String(i.id ?? r),
    actorUuid: String(i.uuid ?? `Actor.${i.id ?? r}`),
    actorName: String(i.name ?? "Linked NPC"),
    image: vt(a) || vt(i),
    revealPortrait: !1,
    linkedAt: (/* @__PURE__ */ new Date()).toISOString()
  } : null;
}
async function la(e, t) {
  var a, r, i, o, s;
  if (!((a = game.user) != null && a.isGM) || !t) return;
  e.preventDefault(), e.stopPropagation();
  const n = await ca(e);
  if (!n) {
    (i = (r = ui.notifications) == null ? void 0 : r.warn) == null || i.call(r, "Drop an Actor or an Actor-backed Token to link this NPC contact.");
    return;
  }
  await Qe(t, n), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, `Linked this NPC conversation to ${n.actorName}.`), await z();
}
async function ua(e, t) {
  var y, I, d, w, M;
  const n = new FormData(e), a = String(n.get("groupName") ?? "").trim(), r = [...new Set(n.getAll("memberUserIds").map((D) => String(D)).filter(Boolean))];
  if (!a) {
    (I = (y = ui.notifications) == null ? void 0 : y.warn) == null || I.call(y, "Enter a name for the group chat.");
    return;
  }
  if (!r.length) {
    (w = (d = ui.notifications) == null ? void 0 : d.warn) == null || w.call(d, "Select at least one other player for the group chat.");
    return;
  }
  const i = String(((M = game.user) == null ? void 0 : M.id) ?? ""), o = [...new Set([i, ...r].filter(Boolean))], s = o.map((D) => {
    var B, L;
    return K((L = (B = game.users) == null ? void 0 : B.get) == null ? void 0 : L.call(B, D));
  }).filter(Boolean), l = fe(), u = Nn(l), c = K(game.user, "A player"), p = {
    id: `group-${l}`,
    name: a,
    number: `${o.length} members`,
    userIds: r,
    isGroup: !0
  };
  await tt(p, `${c} created the group.`, {
    threadId: u,
    recipientUserIds: r,
    recipientNumbers: [],
    messageType: "event",
    eventType: "group-created",
    conversationType: "group",
    groupId: l,
    groupName: a,
    groupMemberUserIds: o,
    groupMemberNames: s
  }) && (O = u, J = !1, W = !1, t && (t.contact = p), (v == null ? void 0 : v.mode) === "messages" && (v.contact = p), await $e(), await z());
}
function da(e, t = null) {
  const n = Ce(e, t);
  if (!n) return;
  Kn(e, n), Jn(e, n), n.querySelectorAll("[data-cybercall-npc-link-drop]").forEach((i) => {
    i.addEventListener("dragover", (o) => {
      var s;
      (s = game.user) != null && s.isGM && (o.preventDefault(), o.dataTransfer.dropEffect = "link", i.classList.add("drag-over"));
    }), i.addEventListener("dragleave", () => i.classList.remove("drag-over")), i.addEventListener("drop", async (o) => {
      i.classList.remove("drag-over");
      const s = i.dataset.cybercallNpcThreadId || i.dataset.cybercallThreadId || O;
      await la(o, s);
    });
  }), n.querySelectorAll("[data-cybercall-npc-action]").forEach((i) => {
    i.addEventListener("click", async (o) => {
      var c, p, f, y, I;
      o.preventDefault(), o.stopPropagation();
      const s = o.currentTarget.dataset.cybercallNpcAction, l = o.currentTarget.dataset.cybercallNpcThreadId || O, u = rt()[l];
      if (s === "toggle-reveal" && u) {
        await Qe(l, { revealPortrait: u.revealPortrait !== !0 }), await z();
        return;
      }
      if (s === "unlink" && u) {
        await Qe(l, null), (p = (c = ui.notifications) == null ? void 0 : c.info) == null || p.call(c, "NPC identity link removed."), await z();
        return;
      }
      s === "change" && ((f = o.currentTarget.closest("[data-cybercall-npc-link-drop]")) == null || f.classList.add("awaiting-drop"), (I = (y = ui.notifications) == null ? void 0 : y.info) == null || I.call(y, "Drag a different Actor or Token onto the NPC identity panel."));
    });
  }), n.querySelectorAll("[data-cybercall-thread-id]").forEach((i) => {
    i.addEventListener("click", async (o) => {
      J = !1, W = !1, O = o.currentTarget.dataset.cybercallThreadId, await $e(), await z();
    });
  }), n.querySelectorAll("[data-cybercall-message-action]").forEach((i) => {
    i.addEventListener("click", async (o) => {
      var l;
      const s = o.currentTarget.dataset.cybercallMessageAction;
      if (s === "refresh") {
        await z();
        return;
      }
      if (s === "open-calls") {
        await zt();
        return;
      }
      if (s === "new") {
        J = !0, W = !1, O = "", Y && (Y.contact = null), await z();
        return;
      }
      if (s === "new-group") {
        J = !1, W = !0, O = "", Y && (Y.contact = null), (v == null ? void 0 : v.mode) === "messages" && (v.contact = null), await z();
        return;
      }
      if (s === "delete-thread") {
        o.preventDefault(), o.stopPropagation();
        const u = n.querySelector("[data-cybercall-active-thread]"), c = O || ((l = u == null ? void 0 : u.dataset) == null ? void 0 : l.cybercallActiveThread) || "";
        if (!c) return;
        if (e._cybercallPendingDeleteThreadId !== c) {
          e._cybercallPendingDeleteThreadId = c, o.currentTarget.classList.add("confirming"), o.currentTarget.textContent = "Confirm Delete", o.currentTarget.title = "Click again to delete this thread";
          return;
        }
        e._cybercallPendingDeleteThreadId = "", await Vn(c);
      }
    });
  });
  const a = n.querySelector("form[data-cybercall-group-form]");
  a == null || a.addEventListener("submit", async (i) => {
    i.preventDefault(), await ua(a, e);
  });
  const r = n.querySelector("form[data-cybercall-message-form]");
  r == null || r.addEventListener("submit", async (i) => {
    var I, d, w, M;
    i.preventDefault();
    const o = it(), s = o.activeThread, l = (s == null ? void 0 : s.contact) ?? aa(r, o), u = ((I = r.elements.body) == null ? void 0 : I.value) ?? "", c = ia(r, o), p = !!(s != null && s.contact && !s.contact.userId && (s.contact.managedByGM || s.contact.isNpc)), f = s ? Ft(s, { excludeGMs: ((d = game.user) == null ? void 0 : d.isGM) === !0 && !p }) : null;
    if (!l) {
      (M = (w = ui.notifications) == null ? void 0 : w.warn) == null || M.call(w, "Select a contact before sending a message.");
      return;
    }
    await tt(l, u, {
      ...c,
      threadId: s ? s.id : void 0,
      recipientUserIds: f != null && f.length ? f : void 0,
      recipientNumbers: c.senderNumber ? [] : void 0,
      conversationType: s != null && s.isGroup ? "group" : "direct",
      groupId: (s == null ? void 0 : s.groupId) ?? "",
      groupName: (s == null ? void 0 : s.groupName) ?? "",
      groupMemberUserIds: (s == null ? void 0 : s.groupMemberUserIds) ?? [],
      groupMemberNames: (s == null ? void 0 : s.groupMemberNames) ?? []
    }) && (O = s ? s.id : ke(l), e && (e.contact = l), (v == null ? void 0 : v.mode) === "messages" && (v.contact = l), J = !1, W = !1, r.elements.body.value = "", await $e(), await z({ scrollToBottom: !0, preserveDraft: !1 }));
  }), $e();
}
const { CyberCallApplication: ga, CyberCallPhone: ma } = gn({
  moduleId: m,
  templatePath: mn,
  composerTemplatePath: pn,
  contactsTemplatePath: bn,
  messagesTemplatePath: fn,
  phoneTemplatePath: yn,
  escapeHTML: ge,
  getDefaultComposerData: Dn,
  getActorChoices: _n,
  getPlayerChoices: On,
  getContacts: he,
  getGroupContacts: se,
  getMessageContext: it,
  getRingtoneChoices: Sa,
  getSoundPath: mt,
  getActiveContactsTab: () => me,
  canEditContactImages: Ne,
  bindCallControls: Qn,
  bindComposerControls: Xn,
  bindContactsControls: ea,
  bindMessagesControls: da,
  stopRinging: pt,
  clearActiveCall: (e) => {
    b === e && (b = null);
  },
  clearActiveComposer: (e) => {
    Z === e && (Z = null);
  },
  clearActiveContacts: (e) => {
    F === e && (F = null);
  },
  clearActiveMessages: (e) => {
    Y === e && (Y = null);
  },
  clearActivePhone: (e) => {
    v === e && (v = null, Z = null, F = null, Y = null);
  }
});
async function ie(e = {}) {
  var t, n;
  return je() ? (F && await F.close(), await ot(), b = new ga(e), await b.render(!0), Wt(b), Aa(b.callData), b) : ((n = (t = ui.notifications) == null ? void 0 : t.warn) == null || n.call(t, "You do not have permission to open CyberCall transmissions."), null);
}
async function ot() {
  if (!b) return;
  const e = b;
  b = null, await e.close();
}
function pa(e) {
  var t;
  return !!((t = b == null ? void 0 : b.callData) != null && t.id) && b.callData.id === e;
}
async function ba() {
  b && (await b.render(!0), Wt(b));
}
async function Vt(e) {
  pa(e) && (b.callData.accepted = !0, b.callData.ringing = !1, pt(), await ba());
}
async function fa(e) {
  e && (await qe(b == null ? void 0 : b.callData, "connected"), game.socket.emit(oe, {
    action: "acceptCall",
    callId: e
  }), await Vt(e));
}
async function qt(e) {
  var t;
  e && ((t = b == null ? void 0 : b.callData) != null && t.id) && b.callData.id !== e || await ot();
}
async function jt(e) {
  var t;
  await qe(b == null ? void 0 : b.callData, (t = b == null ? void 0 : b.callData) != null && t.accepted ? "ended" : "missed"), game.socket.emit(oe, {
    action: "endCall",
    callId: e
  }), await qt(e);
}
function ya(e, t = "Player") {
  var r, i, o, s, l;
  const n = ((i = (r = game.users) == null ? void 0 : r.get) == null ? void 0 : i.call(r, e)) ?? ((l = (s = (o = game.users) == null ? void 0 : o.contents) == null ? void 0 : s.find) == null ? void 0 : l.call(s, (u) => u.id === e)), a = K(n, t);
  return {
    id: `user-${e}`,
    name: a,
    number: `@${a}`,
    image: Te(n),
    userId: e,
    userIds: e ? [e] : []
  };
}
function ha(e) {
  var t;
  return e ? e.contactNumber ? nt().find((a) => a.number === e.contactNumber) ?? {
    id: `contact-${e.contactNumber}`,
    name: e.contactName || e.callerName,
    number: e.contactNumber,
    image: e.contactImage || e.image,
    actorId: e.contactActorId ?? "",
    managedByGM: !0,
    isNpc: !0
  } : (t = game.user) != null && t.isGM && e.callerUserId ? ya(e.callerUserId, e.callerName) : null : null;
}
function Ca(e, t) {
  var a;
  const n = /* @__PURE__ */ new Set();
  for (const r of (t == null ? void 0 : t.userIds) ?? []) n.add(String(r));
  if (t != null && t.userId && n.add(String(t.userId)), e != null && e.callerUserId && n.add(String(e.callerUserId)), !(t != null && t.userId) && (t != null && t.managedByGM || t != null && t.isNpc || e != null && e.contactNumber))
    for (const r of ra()) n.add(r);
  return n.delete(String(((a = game.user) == null ? void 0 : a.id) ?? "")), [...n].filter(Boolean);
}
async function qe(e, t) {
  var i;
  const n = ha(e);
  if (!n) return null;
  const a = (e == null ? void 0 : e.callerUserId) || ((i = game.user) == null ? void 0 : i.id), r = {
    outgoing: `Outgoing call to ${n.name}.`,
    connected: `Call connected with ${n.name}.`,
    ended: `Call ended with ${n.name}.`,
    missed: `Call missed or declined with ${n.name}.`
  };
  return Rn(n, r[t] ?? "Call event.", {
    threadId: ke(n, a),
    eventType: t,
    senderName: "CyberCall",
    senderNumber: n.number,
    senderActorId: n.actorId,
    recipientUserIds: Ca(e, n),
    recipientNumbers: n.userId ? [] : [n.number]
  });
}
async function Ia(e) {
  var s, l;
  if (game.user.isGM) {
    const u = {
      callerName: e.name,
      subtitle: `Comms ${e.number}`,
      image: e.image,
      message: `Opening channel ${e.number}...`,
      signal: game.settings.get(m, "defaultSignal"),
      variant: "standard",
      contactNumber: e.number,
      ringing: !1
    };
    return await qe(u, "outgoing"), ie(u);
  }
  if (!st())
    return (l = (s = ui.notifications) == null ? void 0 : s.warn) == null || l.call(s, "No GM is connected to receive the CyberCall."), null;
  const t = fe(), n = Te(game.user), a = K(game.user, "Unknown Caller"), r = {
    id: t,
    signal: game.settings.get(m, "defaultSignal"),
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
  }, i = ue({
    ...r,
    callerName: e.name,
    subtitle: `Comms ${e.number}`,
    image: e.image,
    message: `Awaiting connection to ${e.name} on ${e.number}...`,
    canAccept: !1,
    canDecline: !1,
    outgoing: !0,
    ringing: !0
  }), o = ue({
    ...r,
    callerName: a,
    subtitle: `Call request from ${a}`,
    image: n,
    message: `${a} is calling ${e.name} on ${e.number}.`,
    canAccept: !0,
    ringing: !0
  });
  return game.socket.emit(oe, {
    action: "playerCallRequest",
    callData: o
  }), await qe(i, "outgoing"), ie(i);
}
async function ct() {
  var e, t;
  return game.user.isGM ? dt("calls") : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function lt() {
  var e, t, n;
  return je() ? b ? ((n = b.bringToFront) == null || n.call(b), b) : dt("calls") : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function ee() {
  F && await F.render(!0);
}
async function Me(e = null) {
  var n, a;
  if (!je())
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "You do not have permission to use CyberCall messages."), null;
  e ? (O = ke(e), J = !1, W = !1) : O || W || (J = !0);
  const t = await dt("messages", e);
  return await $e(), t;
}
async function ut(e) {
  return e && (O = String(e), J = !1, W = !1), Me();
}
async function zt() {
  var e;
  return (e = game.user) != null && e.isGM ? ct() : lt();
}
async function z(e = {}) {
  !v || v.mode !== "messages" || (v._cybercallMessageComposerState = e.preserveDraft === !1 ? null : Yn(v), v._cybercallMessageScrollState = {
    ...Wn(v),
    scrollToBottom: e.scrollToBottom === !0
  }, await v.render(!0));
}
async function dt(e = "calls", t = null) {
  var n, a, r;
  return v ? (v.mode = e, v.contact = t, await v.render(!0), (n = v.bringToFront) == null || n.call(v)) : (v = new ma(e, t), await v.render(!0)), Z = (a = game.user) != null && a.isGM && e === "calls" ? v : null, F = !((r = game.user) != null && r.isGM) && e === "calls" ? v : null, Y = e === "messages" ? v : null, v;
}
async function gt(e = {}) {
  var n, a;
  if (!game.user.isGM)
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Only the GM can broadcast CyberCalls to all players."), null;
  const t = ue({
    ...e,
    fullscreen: e.fullscreen ?? !0,
    ringing: !0
  });
  return game.socket.emit(oe, {
    action: "openCall",
    callData: t,
    targetUserIds: t.targetUserIds
  }), ie({ ...t, outgoing: !0 });
}
async function wa(e) {
  var t, n, a;
  if (e && !(Array.isArray(e.targetUserIds) && e.targetUserIds.length && !e.targetUserIds.includes((t = game.user) == null ? void 0 : t.id)) && !(Array.isArray((n = e.callData) == null ? void 0 : n.targetUserIds) && e.callData.targetUserIds.length && !e.callData.targetUserIds.includes((a = game.user) == null ? void 0 : a.id))) {
    if (e.action === "openCall") {
      if (!je()) return;
      ie(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      ie(e.callData);
      return;
    }
    if (e.action === "acceptCall") {
      Vt(e.callId);
      return;
    }
    if (e.action === "endCall") {
      qt(e.callId);
      return;
    }
    if (e.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const r = x({
        ...e.contact,
        image: ""
      });
      if (!r.name || !r.number) return;
      const i = se();
      i.push(r), await Ve(i), await ee();
      return;
    }
    if (e.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await Ve(se().filter((r) => r.id !== e.contactId)), await ee();
      return;
    }
    e.action === "groupContactsChanged" && (pe = Array.isArray(e.contacts) ? e.contacts.map(x) : null, await ee());
  }
}
function Wt(e) {
  var t, n;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((n = e.setPosition) == null || n.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function Kt() {
  const e = game.settings.get(m, "ringSoundsByWorld");
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function va() {
  return /* @__PURE__ */ new Set([
    ...Object.keys(Xe),
    ...xe(game.settings.get(m, "customRingtones")).map((e) => e.path)
  ]);
}
function mt() {
  const e = ye(), t = Kt(), n = Object.prototype.hasOwnProperty.call(t, e), a = String(n ? t[e] : game.settings.get(m, "ringSound") ?? "").trim();
  return va().has(a) ? a : Gt;
}
async function Yt(e) {
  const t = ye();
  await game.settings.set(m, "ringSoundsByWorld", {
    ...Kt(),
    [t]: String(e ?? "").trim()
  });
}
function Sa() {
  const e = mt(), t = xe(game.settings.get(m, "customRingtones")), n = new Map(Object.entries(Xe));
  for (const a of t)
    n.has(a.path) || n.set(a.path, a.label);
  return [...n].map(([a, r]) => ({
    value: a,
    label: r,
    selected: a === e
  }));
}
function pt() {
  if (!re) return;
  const e = re;
  re = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function Aa(e) {
  var i;
  if (pt(), !e.ringing) return;
  const t = mt();
  if (!t) return;
  const a = 0.65 * (Math.max(0, Math.min(100, Number(game.settings.get(m, "ringVolume") ?? 100))) / 100), r = ((i = foundry == null ? void 0 : foundry.audio) == null ? void 0 : i.AudioHelper) ?? globalThis.AudioHelper;
  if (r != null && r.play)
    r.play({ src: t, volume: a, autoplay: !0, loop: !0, channel: "interface" }, !1).then((o) => {
      re = o;
    }).catch((o) => {
      console.warn(`${m} | Unable to play ringing sound.`, o);
    });
  else {
    const o = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5);
    re = new Audio(t), re.loop = !0, re.volume = a * o, re.play().catch((s) => {
      console.warn(`${m} | Unable to play ringing sound.`, s);
    });
  }
}
function Na() {
  const e = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  if (!e) return;
  const t = new e(), n = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), a = Math.max(1e-4, Math.min(0.18, 0.18 * n)), r = (o, s, l) => {
    const u = t.createOscillator(), c = t.createGain(), p = t.currentTime + s, f = p + l;
    u.type = "sine", u.frequency.setValueAtTime(o, p), u.frequency.exponentialRampToValueAtTime(o * 1.18, f), c.gain.setValueAtTime(1e-4, p), c.gain.exponentialRampToValueAtTime(a, p + 0.025), c.gain.exponentialRampToValueAtTime(1e-4, f), u.connect(c), c.connect(t.destination), u.start(p), u.stop(f);
  };
  (async () => {
    t.state === "suspended" && await t.resume(), r(620, 0, 0.16), r(930, 0.11, 0.2), window.setTimeout(() => {
      var o;
      return (o = t.close) == null ? void 0 : o.call(t);
    }, 500);
  })().catch(() => {
    var o;
    return (o = t.close) == null ? void 0 : o.call(t);
  });
}
function $a(e) {
  var n, a, r, i, o;
  if (e.senderImage) return String(e.senderImage);
  if (e.contactIsNpc && e.senderNumber) return "";
  const t = ((a = (n = game.users) == null ? void 0 : n.get) == null ? void 0 : a.call(n, e.senderUserId)) ?? ((o = (i = (r = game.users) == null ? void 0 : r.contents) == null ? void 0 : i.find) == null ? void 0 : o.call(i, (s) => s.id === e.senderUserId));
  return (t == null ? void 0 : t.isGM) === !0 ? "" : Te(t);
}
function St(e) {
  e != null && e.isConnected && (e.classList.add("leaving"), window.setTimeout(() => e.remove(), 220));
}
function Ma(e) {
  let t = document.querySelector("[data-cybercall-message-notifications]");
  t || (t = document.createElement("div"), t.className = "cybercall-message-notifications", t.dataset.cybercallMessageNotifications = "", t.setAttribute("aria-live", "polite"), document.body.append(t));
  const n = String(e.senderName || "New message").trim(), a = String(e.groupName || "").trim(), r = document.createElement("button");
  r.type = "button", r.className = "cybercall-incoming-message", r.title = "Open CyberCall conversation";
  const i = document.createElement("span");
  i.className = `cybercall-incoming-avatar ${Bt(e.senderUserId || n)}`;
  const o = $a(e);
  if (o) {
    const p = document.createElement("img");
    p.src = o, p.alt = "", i.append(p);
  } else
    i.textContent = H(n);
  const s = document.createElement("i");
  s.className = "fa-solid fa-message cybercall-incoming-badge", s.setAttribute("aria-hidden", "true"), i.append(s);
  const l = document.createElement("span");
  l.className = "cybercall-incoming-copy";
  const u = document.createElement("strong");
  u.textContent = a ? `${n} · ${a}` : n;
  const c = document.createElement("small");
  c.textContent = String(e.body || "New CyberCall message").trim(), l.append(u, c), r.append(i, l), r.addEventListener("click", () => {
    St(r), ut(String(e.threadId || ""));
  }), t.append(r), Na(), window.setTimeout(() => St(r), 4200);
}
function Ta(e) {
  var n, a, r;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[m]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, m, "message"));
  return (t == null ? void 0 : t.kind) === be ? t : ((r = t == null ? void 0 : t.message) == null ? void 0 : r.kind) === be ? t.message : null;
}
function Jt(e, t) {
  var a, r, i, o, s, l, u;
  if (!e) return;
  const n = (a = e.matches) != null && a.call(e, ".chat-message") ? e : ((r = e.closest) == null ? void 0 : r.call(e, ".chat-message")) ?? ((i = e.querySelector) == null ? void 0 : i.call(e, ".chat-message")) ?? e;
  (s = (o = n.classList) == null ? void 0 : o.toggle) == null || s.call(o, "cybercall-chat-message-hidden", !t), t ? (l = n.removeAttribute) == null || l.call(n, "aria-hidden") : (u = n.setAttribute) == null || u.call(n, "aria-hidden", "true");
}
function Qt(e, t) {
  if (!Ta(e)) return;
  const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? (t == null ? void 0 : t.element) ?? null;
  Jt(n, game.settings.get(m, "showChatCards") === !0);
}
function Ht() {
  const e = game.settings.get(m, "showChatCards") === !0;
  document.querySelectorAll(".cybercall-chat-card").forEach((t) => {
    Jt(t, e);
  });
}
function Xt() {
  const e = game.modules.get(m);
  e && (e.api = {
    openCall: ie,
    closeCall: ot,
    broadcastCall: gt,
    openComposer: ct,
    openContacts: lt,
    openMessages: Me,
    openMessagesThread: ut,
    openCallPanel: zt,
    getUnreadMessageCount: Lt,
    get activeCall() {
      return b;
    },
    get activeComposer() {
      return Z;
    },
    get activeContacts() {
      return F;
    },
    get activeMessages() {
      return Y;
    }
  });
}
function ka() {
  var n;
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: m,
    title: "CyberCall",
    icon: "fa-solid fa-satellite-dish",
    premium: !1,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => {
      var a;
      return (a = game.user) != null && a.isGM ? ct() : lt();
    }
  }), (n = t.registerWhatsNew) == null || n.call(t, {
    moduleId: m,
    title: "CyberCall",
    tier: "free",
    version: "1.0.10",
    updated: "2026-09-04",
    icon: "fa-solid fa-satellite-dish",
    entries: [
      {
        title: "Make CyberCall sound like your world",
        summary: "GMs can add a set of ringtones for the world. Each player can pick their favorite and adjust its volume without changing the rest of Foundry's interface sounds.",
        tags: ["Foundry v12-v14"]
      },
      {
        title: "Ringtones behave more reliably",
        summary: "Choosing a sound, browsing for a file, and playing it now work consistently across supported Foundry versions, with a clearer setup screen and an audible default."
      }
    ]
  }), !0) : !1;
}
function Ga() {
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
  game.settings.register(m, "defaultSignal", {
    name: "Default Signal Strength",
    hint: "Signal percentage used when a call does not provide one.",
    scope: "client",
    config: !0,
    type: Number,
    default: q.signal,
    range: {
      min: 0,
      max: 100,
      step: 1
    }
  }), game.settings.register(m, "ringSound", {
    name: "Incoming Call Ringtone",
    hint: "Ringtone played locally while a CyberCall is ringing. This is a client setting, so each user can choose their own ringtone.",
    scope: "client",
    config: !1,
    type: String,
    default: Gt,
    choices: Xe
  }), game.settings.register(m, "ringSoundsByWorld", {
    name: "CyberCall Ringtone Selections",
    hint: "Stores this client's ringtone choice separately for each world.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(m, "ringVolume", {
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
  }), game.settings.register(m, "customRingtones", {
    name: "Additional CyberCall Ringtones",
    hint: "GM-managed ringtone audio files available to everyone in this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: [],
    onChange: () => {
      var n, a, r;
      v ? (n = v.render) == null || n.call(v, !0) : Z ? (a = Z.render) == null || a.call(Z, !0) : (r = F == null ? void 0 : F.render) == null || r.call(F, !0);
    }
  }), game.settings.registerMenu(m, "customRingtonesMenu", {
    name: "Additional Ringtones",
    label: "Manage Ringtones",
    hint: "Add one or more audio files to the ringtone list for this world.",
    icon: "fa-solid fa-bell",
    type: vn,
    restricted: !0
  }), game.settings.register(m, "minimumRole", {
    name: "Minimum Player Role",
    hint: "Minimum role allowed to open CyberCall overlays and receive GM broadcasts.",
    scope: "world",
    config: !0,
    type: Number,
    default: e.PLAYER,
    choices: t
  }), game.settings.register(m, "contacts", {
    name: "CyberCall Contacts",
    hint: "Player contact directory stored locally for this client and isolated per world.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(m, "groupContacts", {
    name: "CyberCall Group Contacts",
    hint: "Shared group contact directory for all players in this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: []
  }), game.settings.register(m, "npcThreadBindings", {
    name: "CyberCall NPC Conversation Links",
    hint: "Stores GM-managed links between pseudo-NPC conversations and Foundry Actors.",
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: () => {
      z(), ee();
    }
  }), game.settings.register(m, "messageNotifications", {
    name: "Incoming Message Alerts",
    hint: "Show a brief sender notification and play a short tone when a new CyberCall message arrives.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(m, "showChatCards", {
    name: "Show CyberCall Chat Cards",
    hint: "Show CyberCall message cards in Foundry's standard chat log. Disabled by default because CyberCall has its own inbox and notifications.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: () => Ht()
  }), game.settings.register(m, "showMessageTimestamps", {
    name: "Show Message Timestamps",
    hint: "Display the sent date and time beneath messages in CyberCall conversations.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(m, "gmViewPlayerMessages", {
    name: "GM: View Player Conversations",
    hint: "Allow GMs to see private CyberCall conversations where no GM or GM-managed NPC is a participant. Disabled by default.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: () => {
      z(), ee();
    }
  }), game.settings.register(m, "messageReadState", {
    name: "CyberCall Message Read State",
    hint: "Tracks which message threads this client has read.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(m, "messageDeletedBefore", {
    name: "CyberCall Deleted Message Threads",
    hint: "Tracks locally deleted message threads for this client.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  });
}
async function Ua() {
  const e = game.settings.get(m, "contacts");
  Array.isArray(e) && await game.settings.set(m, "contacts", {
    [ye()]: e.map(x)
  });
}
Hooks.once("init", () => {
  Ga(), Xt();
});
Hooks.once("ready", async () => {
  await Ua(), Xt(), ka(), game.socket.on(oe, wa), Ht(), console.log(`${m} | Ready. Use game.modules.get("${m}").api.openCall({...})`);
});
Hooks.on("renderChatMessage", (e, t) => {
  Qt(e, t);
});
Hooks.on("renderChatMessageHTML", (e, t) => {
  Qt(e, t);
});
Hooks.on("createChatMessage", async (e) => {
  var s, l, u;
  const t = (s = e == null ? void 0 : e.flags) == null ? void 0 : s[m];
  if ((t == null ? void 0 : t.kind) !== be) return;
  const n = String(((l = game.user) == null ? void 0 : l.id) ?? ""), a = Array.isArray(t.recipientUserIds) ? t.recipientUserIds.map((c) => String(c)) : [], r = ((u = game.user) == null ? void 0 : u.isGM) === !0 && !String(t.contactUserId ?? "") && (t.contactManagedByGM === !0 || t.contactIsNpc === !0), i = String(t.senderUserId ?? "") !== n && (a.includes(n) || r), o = String(t.messageType ?? "text") === "text" || t.eventType === "group-created";
  i && o && game.settings.get(m, "messageNotifications") !== !1 && Ma(t), await z(), await ee();
});
document.addEventListener("click", (e) => {
  var a;
  const t = e.target, n = (a = t == null ? void 0 : t.closest) == null ? void 0 : a.call(t, "[data-cybercall-open-thread]");
  n && (e.preventDefault(), ut(n.dataset.cybercallThreadId));
});
