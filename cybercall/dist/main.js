var Zt = Object.defineProperty;
var Ht = (e, t, n) => t in e ? Zt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var P = (e, t, n) => Ht(e, typeof t != "symbol" ? t + "" : t, n);
function en(e, t) {
  return e.image ? `<img src="${t(e.image)}" alt="${t(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${t(e.initials)}</div>`;
}
function ft(e, t) {
  const n = `--cybercall-signal: ${e.signal}%;`, a = e.fullscreen ? "cybercall-broadcast" : "", r = e.ringing ? "cybercall-ringing-panel" : "", i = e.accepted ? "cybercall-connected-panel" : "", c = e.showBroadcast ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>' : "", s = e.accepted ? "" : `
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
        ${c}
      `;
  return `
    <div class="cybercall-panel cybercall-${e.variant} ${a} ${r} ${i}" style="${n}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${s}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${en(e, t)}</div>
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
  const n = (l, u) => l.length ? l.map((o) => `
        <li>
          <div class="cybercall-contact-avatar">
            ${o.image ? `<img src="${t(o.image)}" alt="">` : `<span>${t(o.initials)}</span>`}
          </div>
          <div class="cybercall-contact-id">
            <strong>${t(o.name)}</strong>
            <span>${t(o.number)}</span>
          </div>
          <div class="cybercall-contact-actions">
            <button type="button" data-cybercall-contact-action="call" data-contact-scope="${u}" data-contact-id="${t(o.id)}">Call</button>
            <button type="button" data-cybercall-contact-action="message" data-contact-scope="${u}" data-contact-id="${t(o.id)}">Message</button>
            <button type="button" data-cybercall-contact-action="remove" data-contact-scope="${u}" data-contact-id="${t(o.id)}">Remove</button>
          </div>
        </li>
      `).join("") : '<li class="cybercall-contacts-empty">No contacts stored.</li>', a = e.activeTab !== "group", r = e.activeTab === "group", i = (e.actors ?? []).map((l) => `<option value="${t(l.id)}">${t(l.name)}</option>`).join(""), c = e.canEditContactImages ? `
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
        ${c}
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
      `).join("") : '<div class="cybercall-messages-empty">No messages yet.</div>', c = r.map((d) => `<option value="${t(d.id)}" ${e.selectedContactId === d.id ? "selected" : ""}>${t(d.name)} - ${t(d.number)}</option>`).join(""), s = e.canReplyAs ? `
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
          ${c}
        </select>
      </label>
    `, o = (I = a == null ? void 0 : a.messages) != null && I.length ? a.messages.map((d) => `
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
          <div class="cybercall-message-log">${o}</div>
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
}, tn = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]);
function At(e) {
  const t = Number(e);
  return Number.isNaN(t) ? q.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function X(e) {
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
    variant: tn.has(e.variant) ? e.variant : q.variant,
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
  return a.initials = X(a.callerName), a.showBroadcast = !!((r = game == null ? void 0 : game.user) != null && r.isGM && a.allowBroadcast), a.isStandard = a.variant === "standard", a.isEmergency = a.variant === "emergency", a.isCorrupted = a.variant === "corrupted", a.isIncoming = !a.accepted, a.hasTargets = a.targetUserIds.length > 0, a.recipientLabel = a.hasTargets ? a.targetUserNames.join(", ") : "All players", a.directionLabel = a.outgoing ? `Calling ${a.recipientLabel}` : `From ${a.callerName}`, a.kicker = a.outgoing ? "Outgoing CyberCall" : a.fullscreen ? "System-wide Broadcast" : "Incoming CyberCall", a;
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
    initials: X(e.name)
  };
}
function nn(e) {
  var a, r, i;
  const t = (e == null ? void 0 : e.document) ?? e, n = String(
    ((a = t == null ? void 0 : t.getTextureSrc) == null ? void 0 : a.call(t)) || ((r = t == null ? void 0 : t.texture) == null ? void 0 : r.src) || (t == null ? void 0 : t.img) || ((i = e == null ? void 0 : e.texture) == null ? void 0 : i.src) || ""
  ).trim();
  return n.includes("*") ? "" : n;
}
function Fe(e) {
  return !e || /(?:^|\/)mystery-man(?:-[^/.]+)?\.svg(?:$|\?)/i.test(e);
}
function Me(e) {
  var d, w, M, D, E, L, te, de, V, Z, ne, U;
  if (!e) return "";
  const t = globalThis.game, n = globalThis.canvas, a = String(e.avatar ?? ((d = e._source) == null ? void 0 : d.avatar) ?? "").trim();
  if (e.isGM === !0) return Fe(a) ? "" : a;
  const r = e.character ?? e.characterId ?? ((w = e._source) == null ? void 0 : w.character), i = typeof r == "string" ? r : String((r == null ? void 0 : r.id) ?? (r == null ? void 0 : r._id) ?? ""), c = Nt(e), s = Array.isArray((M = n == null ? void 0 : n.tokens) == null ? void 0 : M.placeables) ? n.tokens.placeables : [], l = String(((D = t == null ? void 0 : t.user) == null ? void 0 : D.id) ?? "") === String(e.id ?? "") ? ((E = n == null ? void 0 : n.tokens) == null ? void 0 : E.controlled) ?? [] : [], u = ((L = c == null ? void 0 : c.getActiveTokens) == null ? void 0 : L.call(c, !0, !0)) ?? [], o = s.find((B) => {
    var R, j;
    const T = String(((R = B == null ? void 0 : B.actor) == null ? void 0 : R.id) ?? ((j = B == null ? void 0 : B.document) == null ? void 0 : j.actorId) ?? (B == null ? void 0 : B.actorId) ?? "");
    return i && T === i;
  }), p = s.find((B) => {
    var R, j;
    const T = (B == null ? void 0 : B.actor) ?? ((R = B == null ? void 0 : B.document) == null ? void 0 : R.actor);
    return Number(((j = T == null ? void 0 : T.ownership) == null ? void 0 : j[e.id]) ?? 0) >= 3;
  }), f = [...l, ...u, o, p].filter(Boolean).map(nn).find(Boolean) ?? "";
  if (f) return f;
  const y = String(
    ((de = (te = c == null ? void 0 : c.prototypeToken) == null ? void 0 : te.texture) == null ? void 0 : de.src) || ((ne = (Z = (V = c == null ? void 0 : c._source) == null ? void 0 : V.prototypeToken) == null ? void 0 : Z.texture) == null ? void 0 : ne.src) || ""
  ).trim();
  if (y && !y.includes("*") && !Fe(y))
    return y;
  const I = String((c == null ? void 0 : c.img) ?? ((U = c == null ? void 0 : c._source) == null ? void 0 : U.img) ?? "").trim();
  return Fe(I) ? Fe(a) ? "" : a : I;
}
function Nt(e) {
  var r, i, c;
  if (!e) return null;
  const t = globalThis.game, n = e.character ?? e.characterId ?? ((r = e._source) == null ? void 0 : r.character), a = typeof n == "string" ? n : String((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n._id) ?? "");
  return (a ? (c = (i = t == null ? void 0 : t.actors) == null ? void 0 : i.get) == null ? void 0 : c.call(i, a) : null) ?? (typeof n == "object" ? n : null);
}
function K(e, t = "") {
  var a;
  const n = String(((a = Nt(e)) == null ? void 0 : a.name) ?? "").trim();
  return n || String((e == null ? void 0 : e.name) ?? "").trim() || t;
}
function St() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) ?? null;
}
function $t() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : n.api) ?? null;
}
function an(e = {}, t = {}) {
  var a, r, i;
  const n = ((r = (a = globalThis.foundry) == null ? void 0 : a.utils) == null ? void 0 : r.mergeObject) ?? ((i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.mergeObject);
  return typeof n == "function" ? n(e, t, { inplace: !1 }) : { ...e, ...t };
}
function rn() {
  var e, t, n, a, r;
  return ((n = (t = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : t.randomID) == null ? void 0 : n.call(t, 8)) ?? ((r = (a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.randomID) == null ? void 0 : r.call(a, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function yt(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${rn()}`),
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
function sn() {
  var t, n, a;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((a = game == null ? void 0 : game.release) == null ? void 0 : a.generation));
  return Number.isFinite(e) ? e : null;
}
function on() {
  const e = sn();
  return e === null || e >= 13;
}
function Mt(e) {
  return class extends e {
    constructor(a = {}) {
      const r = an(new.target.defaultOptions ?? {}, a);
      super(yt(r));
      P(this, "_v1Options");
      this._v1Options = r;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return yt(this.defaultOptions ?? {});
    }
    activateListeners(a) {
    }
    async _renderHTML(a, r) {
      var u, o, p;
      const i = typeof this.getData == "function" ? await this.getData() : {}, c = ((u = this._v1Options) == null ? void 0 : u.template) ?? ((o = this.options) == null ? void 0 : o.template) ?? ((p = this.constructor.defaultOptions) == null ? void 0 : p.template);
      if (!c) return document.createDocumentFragment();
      const s = await globalThis.renderTemplate(c, i), l = document.createElement("template");
      return l.innerHTML = s.trim(), l.content;
    }
    _activateV1Form(a) {
      var i, c;
      if (typeof this._updateObject != "function") return;
      const r = (i = a.matches) != null && i.call(a, "form") ? a : (c = a.querySelector) == null ? void 0 : c.call(a, "form");
      r instanceof HTMLFormElement && r.addEventListener("submit", async (s) => {
        var u;
        s.preventDefault(), s.stopPropagation();
        const l = new FormData(r);
        await this._updateObject(s, l), ((u = this._v1Options) == null ? void 0 : u.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(a, r, i) {
      var o, p, f, y;
      r.replaceChildren(a);
      const c = globalThis.jQuery ?? globalThis.$, s = ((o = r.closest) == null ? void 0 : o.call(r, ".window-app, .app, .application")) ?? r, l = c ? c(s) : s;
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
      Array.isArray(u) && u.length && (r.classList.add(...u), (y = (f = r.closest) == null ? void 0 : f.call(r, ".window-app, .app, .application")) == null || y.classList.add(...u)), this._activateV1Form(r), typeof this.activateListeners == "function" && this.activateListeners(c ? c(r) : r);
    }
  };
}
function cn() {
  const e = St(), t = $t(), n = globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (n) return n;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? Mt(a) : null;
}
function ln() {
  const e = St(), t = $t(), n = globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (n) return n;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? Mt(a) : cn();
}
function un() {
  var n, a, r, i, c, s;
  const e = ((a = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : a.api) ?? ((r = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : r.api) ?? null, t = ((c = (i = globalThis.foundry) == null ? void 0 : i.applications) == null ? void 0 : c.api) ?? ((s = foundry == null ? void 0 : foundry.applications) == null ? void 0 : s.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function dn(e) {
  var Ae, N, k, Q;
  const {
    moduleId: t,
    templatePath: n,
    composerTemplatePath: a,
    contactsTemplatePath: r,
    messagesTemplatePath: i,
    phoneTemplatePath: c,
    escapeHTML: s,
    getDefaultComposerData: l,
    getActorChoices: u,
    getPlayerChoices: o,
    getContacts: p,
    getGroupContacts: f,
    getMessageContext: y,
    getRingtoneChoices: I,
    getSoundPath: d,
    getActiveContactsTab: w,
    canEditContactImages: M,
    bindCallControls: D,
    bindComposerControls: E,
    bindContactsControls: L,
    bindMessagesControls: te,
    stopRinging: de,
    clearActiveCall: V,
    clearActiveComposer: Z,
    clearActiveContacts: ne,
    clearActiveMessages: U,
    clearActivePhone: B
  } = e, T = (N = (Ae = foundry == null ? void 0 : foundry.applications) == null ? void 0 : Ae.api) == null ? void 0 : N.ApplicationV2, R = (Q = (k = foundry == null ? void 0 : foundry.applications) == null ? void 0 : k.api) == null ? void 0 : Q.HandlebarsApplicationMixin, j = un(), ce = on();
  function Ce() {
    const C = p(), A = f(), g = w();
    return {
      contacts: C,
      groupContacts: A,
      hasContacts: C.length > 0,
      hasGroupContacts: A.length > 0,
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
      players: o(),
      ringtoneChoices: I()
    };
  }
  function Ie(C, A = null) {
    var pt, bt;
    const g = C === "messages", h = !g && ((pt = game.user) == null ? void 0 : pt.isGM), S = !g && !((bt = game.user) != null && bt.isGM);
    return {
      ...g ? y(A) : h ? ze() : Ce(),
      mode: C,
      isMessagesMode: g,
      isComposerMode: h,
      isContactsMode: S,
      isCallsMode: !g
    };
  }
  function we(C, A) {
    var g;
    return C === "messages" ? Ye(A, s) : (g = game.user) != null && g.isGM ? We(A, s) : Ke(A, s);
  }
  function ae(C) {
    const A = document.createElement("template");
    A.innerHTML = C.trim();
    const g = A.content.firstElementChild;
    return {
      main: g instanceof HTMLElement ? g : document.createElement("div")
    };
  }
  function ve(C, A = null) {
    var g;
    if (C.mode === "messages") {
      te(C, A);
      return;
    }
    (g = game.user) != null && g.isGM ? E(C, A) : L(C, A);
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
        return console.warn(`${t} | Template render failed, using inline fallback.`, h), $(ft(this.callData, s));
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
        players: o(),
        ringtoneChoices: I()
      };
    }
    async _renderInner(A) {
      try {
        return await super._renderInner(A);
      } catch (g) {
        return console.warn(`${t} | Composer template render failed, using inline fallback.`, g), $(We(A, s));
      }
    }
    activateListeners(A) {
      super.activateListeners(A), E(this, A);
    }
    async close(A) {
      return Z(this), super.close(A);
    }
  }
  class Be extends j {
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
      return Ce();
    }
    async _renderInner(A) {
      try {
        return await super._renderInner(A);
      } catch (g) {
        return console.warn(`${t} | Contacts template render failed, using inline fallback.`, g), $(Ke(A, s));
      }
    }
    activateListeners(A) {
      super.activateListeners(A), L(this, A);
    }
    async close(A) {
      return ne(this), super.close(A);
    }
  }
  class Ee extends j {
    constructor(g = "calls", h = null, S = {}) {
      super(S);
      P(this, "mode");
      P(this, "contact");
      this.mode = g, this.contact = h;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-phone",
        title: "CyberCall",
        template: c,
        classes: ["cybercall-phone-app"],
        popOut: !0,
        resizable: !0,
        width: 720,
        height: 640
      });
    }
    getData() {
      return Ie(this.mode, this.contact);
    }
    async _renderInner(g) {
      try {
        return await super._renderInner(g);
      } catch (h) {
        return console.warn(`${t} | Phone template render failed, using inline fallback.`, h), $(we(this.mode, g));
      }
    }
    activateListeners(g) {
      super.activateListeners(g), ve(this, g);
    }
    async close(g) {
      return B(this), super.close(g);
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
      constructor(h, S = {}) {
        super(S);
        P(this, "callData");
        this.callData = ue(h);
      }
      async _prepareContext(h) {
        return {
          ...await super._prepareContext(h),
          call: this.callData
        };
      }
      async _renderHTML(h, S) {
        try {
          return await super._renderHTML(h, S);
        } catch (O) {
          return console.warn(`${t} | Template render failed, using inline fallback.`, O), ae(ft(this.callData, s));
        }
      }
      _onRender(h, S) {
        var O;
        (O = super._onRender) == null || O.call(this, h, S), D(this);
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
          players: o(),
          ringtoneChoices: I()
        };
      }
      async _renderHTML(g, h) {
        try {
          return await super._renderHTML(g, h);
        } catch (S) {
          return console.warn(`${t} | Composer template render failed, using inline fallback.`, S), ae(We(g, s));
        }
      }
      _onRender(g, h) {
        var S;
        (S = super._onRender) == null || S.call(this, g, h), E(this);
      }
      async close(g) {
        return Z(this), super.close(g);
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
  function Oe() {
    var C;
    return !ce || !T || !R ? null : (C = class extends R(T) {
      async _prepareContext(g) {
        return {
          ...await super._prepareContext(g),
          ...Ce()
        };
      }
      async _renderHTML(g, h) {
        try {
          return await super._renderHTML(g, h);
        } catch (S) {
          return console.warn(`${t} | Contacts template render failed, using inline fallback.`, S), ae(Ke(g, s));
        }
      }
      _onRender(g, h) {
        var S;
        (S = super._onRender) == null || S.call(this, g, h), L(this);
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
  function _e() {
    var C;
    return !ce || !T || !R ? null : (C = class extends R(T) {
      constructor(h = "calls", S = null, O = {}) {
        super(O);
        P(this, "mode");
        P(this, "contact");
        this.mode = h, this.contact = S;
      }
      async _prepareContext(h) {
        return {
          ...await super._prepareContext(h),
          ...Ie(this.mode, this.contact)
        };
      }
      async _renderHTML(h, S) {
        try {
          return await super._renderHTML(h, S);
        } catch (O) {
          return console.warn(`${t} | Phone template render failed, using inline fallback.`, O), ae(we(this.mode, h));
        }
      }
      _onRender(h, S) {
        var O;
        (O = super._onRender) == null || O.call(this, h, S), ve(this);
      }
      async close(h) {
        return B(this), super.close(h);
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
        template: c
      }
    }), C);
  }
  function Le() {
    var C;
    return !ce || !T || !R ? null : (C = class extends R(T) {
      constructor(h = null, S = {}) {
        super(S);
        P(this, "contact");
        this.contact = h;
      }
      async _prepareContext(h) {
        return {
          ...await super._prepareContext(h),
          ...y(this.contact)
        };
      }
      async _renderHTML(h, S) {
        try {
          return await super._renderHTML(h, S);
        } catch (O) {
          return console.warn(`${t} | Messages template render failed, using inline fallback.`, O), ae(Ye(h, s));
        }
      }
      _onRender(h, S) {
        var O;
        (O = super._onRender) == null || O.call(this, h, S), te(this);
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
    CyberCallContacts: Oe() ?? Be,
    CyberCallMessages: Le() ?? Pe,
    CyberCallPhone: _e() ?? Ee
  };
}
const m = "cybercall", oe = `module.${m}`, gn = `modules/${m}/templates/cybercall.hbs`, mn = `modules/${m}/templates/cybercall-composer.hbs`, pn = `modules/${m}/templates/cybercall-contacts.hbs`, bn = `modules/${m}/templates/cybercall-messages.hbs`, fn = `modules/${m}/templates/cybercall-phone.hbs`, yn = `modules/${m}/templates/ringtone-settings.hbs`, be = "phoneMessage", Tt = 3, Xe = {
  "": "Silent",
  [`modules/${m}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${m}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${m}/audio/Ringtone3.ogg`]: "Ringtone 3"
}, kt = `modules/${m}/audio/Ringtone1.ogg`, hn = ln();
function Gt(e) {
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
    return !a || t.has(a) ? [] : (t.add(a), [{ label: String((n == null ? void 0 : n.label) ?? "").trim() || Gt(a), path: a }]);
  });
}
function Ut() {
  var n, a, r, i, c, s, l, u, o;
  const e = globalThis.foundry;
  return [
    typeof FilePicker < "u" ? FilePicker : null,
    globalThis.FilePicker,
    (r = (a = (n = e == null ? void 0 : e.applications) == null ? void 0 : n.apps) == null ? void 0 : a.FilePicker) == null ? void 0 : r.implementation,
    (c = (i = e == null ? void 0 : e.applications) == null ? void 0 : i.apps) == null ? void 0 : c.FilePicker,
    (l = (s = e == null ? void 0 : e.applications) == null ? void 0 : s.api) == null ? void 0 : l.FilePicker,
    (o = (u = e == null ? void 0 : e.appv1) == null ? void 0 : u.api) == null ? void 0 : o.FilePicker
  ].find((p) => typeof p == "function") ?? null;
}
function Cn(e, t) {
  var a;
  const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? ((a = e.element) == null ? void 0 : a[0]) ?? e.element ?? null;
  return n instanceof HTMLElement ? n : null;
}
function In(e) {
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
class wn extends hn {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-ringtone-settings",
      title: "CyberCall Ringtones",
      template: yn,
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
    const n = Cn(this, t), a = n == null ? void 0 : n.querySelector("[data-ringtone-list]");
    !n || !a || ((r = n.querySelector("[data-ringtone-add]")) == null || r.addEventListener("click", () => {
      var c;
      const i = In(a.querySelectorAll("[data-ringtone-row]").length);
      (c = a.querySelector("[data-ringtone-empty]")) == null || c.before(i);
    }), n.addEventListener("click", (i) => {
      var y, I, d, w, M, D;
      const c = i.target, s = (y = c == null ? void 0 : c.closest) == null ? void 0 : y.call(c, "[data-ringtone-remove]");
      if (s) {
        (I = s.closest("[data-ringtone-row]")) == null || I.remove();
        return;
      }
      const l = (d = c == null ? void 0 : c.closest) == null ? void 0 : d.call(c, "[data-ringtone-browse]");
      if (!l) return;
      const u = l.closest("[data-ringtone-row]"), o = u == null ? void 0 : u.querySelector("[data-ringtone-path]"), p = Ut();
      if (!o || !p) {
        (M = (w = ui.notifications) == null ? void 0 : w.warn) == null || M.call(w, "Foundry FilePicker is unavailable.");
        return;
      }
      const f = new p({
        type: "audio",
        current: o.value,
        callback: (E) => {
          o.value = E;
          const L = u == null ? void 0 : u.querySelector("[data-ringtone-label]");
          L && !L.value.trim() && (L.value = Gt(E));
        }
      });
      typeof f.browse == "function" ? f.browse() : (D = f.render) == null || D.call(f, !0);
    }));
  }
  async _updateObject(t) {
    var r, i;
    const a = [...t.currentTarget.querySelectorAll("[data-ringtone-row]")].map((c) => {
      var s, l;
      return {
        label: ((s = c.querySelector("[data-ringtone-label]")) == null ? void 0 : s.value) ?? "",
        path: ((l = c.querySelector("[data-ringtone-path]")) == null ? void 0 : l.value) ?? ""
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
function vn() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function Bt(e) {
  const t = G(e, "cybercall");
  let n = 0;
  for (let a = 0; a < t.length; a += 1)
    n = (n << 5) - n + t.charCodeAt(a) | 0;
  return `tone-${Math.abs(n) % 8 + 1}`;
}
function ht(e, t) {
  return ["direct", ...[e, t].sort()].join(":");
}
function An() {
  return `msg-${fe()}`;
}
function Nn(e = fe()) {
  return `group:${G(e)}`;
}
function Te(e, t = ((n) => (n = game == null ? void 0 : game.user) == null ? void 0 : n.id)()) {
  const a = x(e);
  if (e != null && e.userId)
    return ht(`user:${G(t, "unknown")}`, `user:${G(e.userId)}`);
  const r = a.number || a.id || a.name;
  return ht(`user:${G(t, "unknown")}`, `contact:${r}`);
}
function Ze(e = {}) {
  var t;
  return {
    id: G(e.id) || An(),
    threadId: G(e.threadId) || Te({ number: ((t = e.recipientNumbers) == null ? void 0 : t[0]) ?? e.senderNumber }),
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
    createdAt: G(e.createdAt) || vn(),
    chatMessageId: G(e.chatMessageId),
    schemaVersion: Number(e.schemaVersion ?? Tt)
  };
}
function Et(e, t = [], n = "", a = {}) {
  const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (const s of t) {
    const l = x(s), u = { ...l, userId: s == null ? void 0 : s.userId, userIds: (s == null ? void 0 : s.userIds) ?? l.userIds };
    l.number && r.set(l.number, u), s != null && s.userId && i.set(String(s.userId), u);
  }
  const c = /* @__PURE__ */ new Map();
  for (const s of e.map(Ze).filter((l) => l.body)) {
    const l = c.get(s.threadId) ?? [];
    l.push(s), c.set(s.threadId, l);
  }
  return [...c.entries()].map(([s, l]) => {
    var we, ae, ve, Ge, Ue, Be, Ee, Pe, Re, De, Oe, _e, Le, Ae;
    const u = l.sort((N, k) => N.createdAt.localeCompare(k.createdAt)), o = u[u.length - 1] ?? null, p = [...u].reverse().find((N) => N.conversationType === "group" || N.groupId), f = !!p, y = (p == null ? void 0 : p.groupId) || (f ? s.replace(/^group:/, "") : ""), I = (p == null ? void 0 : p.groupName) || (f ? "Group Chat" : ""), d = f ? le(u.flatMap((N) => [
      ...N.groupMemberUserIds,
      N.senderUserId,
      ...N.recipientUserIds
    ])) : [], w = f ? le(u.flatMap((N) => N.groupMemberNames)) : [], M = w.length ? w : d.map((N) => {
      var k, Q;
      return K((Q = (k = game.users) == null ? void 0 : k.get) == null ? void 0 : Q.call(k, N));
    }).filter(Boolean), D = (o == null ? void 0 : o.senderUserId) === ((we = game == null ? void 0 : game.user) == null ? void 0 : we.id) ? (ae = o == null ? void 0 : o.recipientUserIds) == null ? void 0 : ae.find((N) => {
      var k;
      return N !== ((k = game == null ? void 0 : game.user) == null ? void 0 : k.id);
    }) : o == null ? void 0 : o.senderUserId, E = (o == null ? void 0 : o.senderUserId) === ((ve = game == null ? void 0 : game.user) == null ? void 0 : ve.id) ? ((Ge = o == null ? void 0 : o.recipientNumbers) == null ? void 0 : Ge[0]) || "" : (o == null ? void 0 : o.senderNumber) || ((Ue = o == null ? void 0 : o.recipientNumbers) == null ? void 0 : Ue[0]) || "", L = o != null && o.contactName && !(o != null && o.contactUserId) && (o.contactIsNpc || o.contactManagedByGM) ? {
      id: `contact-${((Be = o.recipientNumbers) == null ? void 0 : Be[0]) || o.senderNumber || s}`,
      name: o.contactName,
      number: ((Ee = o.recipientNumbers) == null ? void 0 : Ee[0]) || o.senderNumber || "",
      image: o.contactImage || "",
      actorId: ((Pe = o.recipientActorIds) == null ? void 0 : Pe[0]) ?? o.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: X(o.contactName)
    } : null, te = (o == null ? void 0 : o.senderUserId) !== ((Re = game == null ? void 0 : game.user) == null ? void 0 : Re.id) && (o != null && o.senderNumber) && (o != null && o.contactName) ? {
      id: `contact-${o.senderNumber || s}`,
      name: o.contactName,
      number: o.senderNumber,
      image: o.contactImage || "",
      actorId: o.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: X(o.contactName)
    } : null, V = (f ? {
      id: `group-${y || s}`,
      name: I,
      number: `${d.length} member${d.length === 1 ? "" : "s"}`,
      image: "",
      actorId: "",
      userId: "",
      userIds: d.filter((N) => {
        var k;
        return N !== ((k = game == null ? void 0 : game.user) == null ? void 0 : k.id);
      }),
      managedByGM: !1,
      isNpc: !1,
      isGroup: !0,
      initials: X(I)
    } : null) ?? L ?? te ?? i.get(D) ?? r.get(E) ?? {
      id: `contact-${E || s}`,
      name: (o == null ? void 0 : o.contactName) || ((o == null ? void 0 : o.senderUserId) === ((De = game == null ? void 0 : game.user) == null ? void 0 : De.id) ? E || "Unknown Contact" : (o == null ? void 0 : o.senderName) || E || "Unknown Contact"),
      number: E,
      image: (o == null ? void 0 : o.contactImage) || "",
      actorId: ((Oe = o == null ? void 0 : o.recipientActorIds) == null ? void 0 : Oe[0]) ?? "",
      userId: "",
      userIds: [],
      managedByGM: !!(o != null && o.contactName || (_e = o == null ? void 0 : o.recipientActorIds) != null && _e[0]),
      isNpc: !!(o != null && o.contactName || (Le = o == null ? void 0 : o.recipientActorIds) != null && Le[0]),
      initials: X((o == null ? void 0 : o.contactName) || (o == null ? void 0 : o.senderName) || E)
    }, Z = f ? null : [...u].reverse().find(
      (N) => N.senderUserId === D && N.senderImage
    ), ne = [...u].reverse().find((N) => {
      var Q, C;
      const k = (C = (Q = game.users) == null ? void 0 : Q.get) == null ? void 0 : C.call(Q, N.senderUserId);
      return N.senderUserId && (k == null ? void 0 : k.isGM) !== !0 && !N.contactUserId && !!N.contactName && (N.contactIsNpc || N.contactManagedByGM);
    }) ?? null, U = ((Ae = game == null ? void 0 : game.user) == null ? void 0 : Ae.isGM) === !0 ? ne : null, B = U ? `TO: ${U.contactName}` : "", T = U ? i.get(U.senderUserId) : null, R = (U == null ? void 0 : U.senderName) || (T == null ? void 0 : T.name) || V.name || (o == null ? void 0 : o.senderName) || "Unknown Contact", j = U ? (T == null ? void 0 : T.number) || `@${U.senderName}` : V.number || (o == null ? void 0 : o.senderNumber) || "", ce = U ? X(R) : V.initials || X(V.name || (o == null ? void 0 : o.senderName)), Ce = (U == null ? void 0 : U.senderImage) || (T == null ? void 0 : T.image) || (Z == null ? void 0 : Z.senderImage) || V.image || "", ze = a[s] ?? "", Ie = u.filter(
      (N) => {
        var k;
        return N.senderUserId !== ((k = game == null ? void 0 : game.user) == null ? void 0 : k.id) && N.createdAt > ze;
      }
    );
    return {
      id: s,
      title: R,
      subtitle: j,
      initials: ce,
      image: Ce,
      avatarTone: Bt(f ? y || s : (U == null ? void 0 : U.senderUserId) || V.userId || V.number || s),
      routeLabel: B,
      hasRouteLabel: !!B,
      isNpcRouted: !!ne,
      contact: V,
      messages: u.map((N) => {
        var k;
        return {
          ...N,
          isMine: N.senderUserId === ((k = game == null ? void 0 : game.user) == null ? void 0 : k.id),
          isEvent: N.messageType !== "text"
        };
      }),
      lastMessage: o,
      lastPreview: (o == null ? void 0 : o.body) ?? "",
      updatedAt: (o == null ? void 0 : o.createdAt) ?? "",
      unread: Ie.length > 0,
      unreadCount: Ie.length,
      active: s === n,
      isGroup: f,
      groupId: y,
      groupName: I,
      groupMemberUserIds: d,
      groupMemberNames: M
    };
  }).sort((s, l) => l.updatedAt.localeCompare(s.updatedAt));
}
function Sn(e) {
  var n, a, r;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[m]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, m, "message"));
  return (t == null ? void 0 : t.kind) === be ? t : ((r = t == null ? void 0 : t.message) == null ? void 0 : r.kind) === be ? t.message : null;
}
function $n(e) {
  return String(e != null && e.timestamp ? new Date(e.timestamp).toISOString() : (e == null ? void 0 : e.createdTime) ?? "");
}
function Mn() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => t.id);
}
function He(e) {
  return [...new Set(e.map((t) => String(t ?? "").trim()).filter(Boolean))];
}
function Tn(e) {
  const t = Array.isArray(e == null ? void 0 : e.whisper) ? e.whisper : [];
  return He(t.map((n) => (n == null ? void 0 : n.id) ?? n));
}
function kn(e, t) {
  var i, c;
  const n = String(((i = game.user) == null ? void 0 : i.id) ?? "").trim();
  if (!n) return !1;
  if (e.senderUserId === n || e.recipientUserIds.includes(n)) return !0;
  if (((c = game.user) == null ? void 0 : c.isGM) === !0)
    return !e.contactUserId && (e.contactManagedByGM || e.contactIsNpc) ? !0 : game.settings.get(m, "gmViewPlayerMessages") === !0;
  const r = Tn(t);
  return r.length && !r.includes(n), !1;
}
function Gn(e) {
  const t = Array.isArray(e == null ? void 0 : e.userIds) ? e.userIds : e != null && e.userId ? [e.userId] : [], n = He(t);
  return n.length ? n : Mn();
}
function Un(e) {
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
function En() {
  var t;
  return (((t = game.messages) == null ? void 0 : t.contents) ?? []).map((n) => {
    const a = Sn(n);
    if (!a) return null;
    const r = Ze({
      ...a,
      chatMessageId: n.id,
      createdAt: a.createdAt || $n(n)
    });
    return kn(r, n) ? r : null;
  }).filter(Boolean);
}
async function et(e, t, n = {}) {
  var I;
  const a = x(e), r = String(t ?? "").trim();
  if (!r) return null;
  const i = game.user, c = n.recipientUserIds ? He(n.recipientUserIds) : Gn(e), s = !Un(e), l = String(n.threadId ?? Te(e, i == null ? void 0 : i.id)), u = String(n.senderName ?? "").trim() || K(i, "Unknown Sender"), o = String(n.senderActorId ?? ((I = i == null ? void 0 : i.character) == null ? void 0 : I.id) ?? "").trim(), p = String(n.senderNumber ?? "").trim(), f = Ze({
    threadId: l,
    senderUserId: (i == null ? void 0 : i.id) ?? "",
    senderActorId: o,
    senderName: u,
    senderNumber: p,
    senderImage: String(n.senderImage ?? Me(i)).trim(),
    recipientUserIds: c,
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
    schemaVersion: Tt
  }), y = [...new Set([i == null ? void 0 : i.id, ...c].filter(Boolean))];
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
async function Pn(e, t, n = {}) {
  return et(e, t, {
    ...n,
    messageType: n.messageType ?? "event"
  });
}
let b = null, v = null, H = null, F = null, Y = null, me = "personal", _ = "", J = !1, W = !1, re = null, pe = null;
function Rn() {
  var e, t, n, a, r, i, c, s;
  return ue({
    callerName: ((e = b == null ? void 0 : b.callData) == null ? void 0 : e.callerName) ?? q.callerName,
    subtitle: ((t = b == null ? void 0 : b.callData) == null ? void 0 : t.subtitle) ?? q.subtitle,
    image: ((n = b == null ? void 0 : b.callData) == null ? void 0 : n.image) ?? "",
    message: ((a = b == null ? void 0 : b.callData) == null ? void 0 : a.message) ?? q.message,
    signal: ((r = b == null ? void 0 : b.callData) == null ? void 0 : r.signal) ?? game.settings.get(m, "defaultSignal"),
    variant: ((i = b == null ? void 0 : b.callData) == null ? void 0 : i.variant) ?? "standard",
    fullscreen: ((c = b == null ? void 0 : b.callData) == null ? void 0 : c.fullscreen) ?? !1,
    ringing: ((s = b == null ? void 0 : b.callData) == null ? void 0 : s.ringing) ?? !0
  });
}
function Dn() {
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
function _n() {
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
function Ln() {
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
      image: Me(t),
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
function Pt() {
  const e = game.settings.get(m, "contacts");
  return Array.isArray(e) ? { [ye()]: e } : !e || typeof e != "object" ? {} : e;
}
function he() {
  const e = Pt()[ye()];
  return Array.isArray(e) ? e.map(x).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function se() {
  if (Array.isArray(pe))
    return pe.map(x).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name));
  const e = game.settings.get(m, "groupContacts");
  return Array.isArray(e) ? e.map(x).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function tt() {
  const e = /* @__PURE__ */ new Map();
  for (const t of [...Ln(), ...se(), ...he()]) {
    const n = t.userId ? `user:${t.userId}` : `number:${t.number || t.id}`;
    e.has(n) || e.set(n, t);
  }
  return [...e.values()].sort((t, n) => t.name.localeCompare(n.name));
}
async function Rt(e) {
  await game.settings.set(m, "contacts", {
    ...Pt(),
    [ye()]: e.map(x)
  });
}
async function Ve(e) {
  pe = e.map(x), await game.settings.set(m, "groupContacts", pe), game.socket.emit(oe, {
    action: "groupContactsChanged",
    contacts: pe
  });
}
function nt() {
  const e = game.settings.get(m, "messageReadState");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function Dt() {
  const e = game.settings.get(m, "messageDeletedBefore");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function at() {
  const e = game.settings.get(m, "npcThreadBindings");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
async function Qe(e, t) {
  var a;
  if (!((a = game.user) != null && a.isGM) || !e) return;
  const n = { ...at() };
  t === null ? delete n[e] : n[e] = { ...n[e] ?? {}, ...t }, await game.settings.set(m, "npcThreadBindings", n);
}
function Ot() {
  const e = Dt();
  return En().filter((t) => {
    const n = e[t.threadId];
    return !n || t.createdAt > n;
  });
}
function _t() {
  return Et(Ot(), tt(), "", nt()).reduce((e, t) => e + Number(t.unreadCount ?? 0), 0);
}
async function Fn(e, t = (/* @__PURE__ */ new Date()).toISOString()) {
  e && await game.settings.set(m, "messageReadState", {
    ...nt(),
    [e]: t
  });
}
async function Se() {
  _ && await Fn(_);
}
async function xn(e) {
  e && (await game.settings.set(m, "messageDeletedBefore", {
    ...Dt(),
    [e]: (/* @__PURE__ */ new Date()).toISOString()
  }), _ === e && (_ = "", J = !0, W = !1, Y && (Y.contact = null), (v == null ? void 0 : v.mode) === "messages" && (v.contact = null)), await z(), await ee());
}
async function Vn(e, t, n = "personal", a = "", r = {}) {
  var l, u, o, p, f, y, I;
  const i = r.actorId ? (l = game.actors) == null ? void 0 : l.get(r.actorId) : null, c = x({
    name: String(e ?? "").trim() || (i == null ? void 0 : i.name),
    number: t,
    image: Ne() && (String(a ?? "").trim() || (i == null ? void 0 : i.img)) || "",
    actorId: Ne() ? r.actorId : "",
    managedByGM: Ne() ? r.managedByGM === !0 : !1,
    isNpc: Ne() ? r.isNpc === !0 || r.managedByGM === !0 || !!r.actorId : !1
  });
  if (!c.name || !c.number) {
    (o = (u = ui.notifications) == null ? void 0 : u.warn) == null || o.call(u, "Contact name and number are required.");
    return;
  }
  if (n === "group" && !game.user.isGM) {
    if (!rt()) {
      (f = (p = ui.notifications) == null ? void 0 : p.warn) == null || f.call(p, "A GM must be connected to update group contacts.");
      return;
    }
    game.socket.emit(oe, {
      action: "groupContactAdd",
      contact: c
    }), (I = (y = ui.notifications) == null ? void 0 : y.info) == null || I.call(y, "Group contact update sent to the GM.");
    return;
  }
  const s = n === "group" ? se() : he();
  s.push(c), n === "group" ? await Ve(s) : await Rt(s), await ee();
}
async function qn(e, t = "personal") {
  var n, a, r, i;
  if (t === "group") {
    if (!game.user.isGM) {
      if (!rt()) {
        (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(oe, {
        action: "groupContactRemove",
        contactId: e
      }), (i = (r = ui.notifications) == null ? void 0 : r.info) == null || i.call(r, "Group contact removal sent to the GM.");
      return;
    }
    await Ve(se().filter((c) => c.id !== e));
  } else
    await Rt(he().filter((c) => c.id !== e));
  await ee();
}
function rt() {
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
function ke(e, t = null) {
  var n;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (n = e.element) != null && n[0] ? e.element[0] : e.element ?? null;
}
const jn = 24;
function zn(e) {
  var i, c, s;
  const t = ke(e), n = (i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, ".cybercall-message-log");
  if (!(n instanceof HTMLElement)) return null;
  const a = (c = t.querySelector) == null ? void 0 : c.call(t, "[data-cybercall-active-thread]"), r = n.scrollHeight - n.clientHeight - n.scrollTop;
  return {
    threadId: String(((s = a == null ? void 0 : a.dataset) == null ? void 0 : s.cybercallActiveThread) ?? ""),
    scrollTop: n.scrollTop,
    stickToBottom: r <= jn
  };
}
function Wn(e, t) {
  var u;
  const n = t.querySelector(".cybercall-message-log");
  if (!(n instanceof HTMLElement)) return;
  const a = e == null ? void 0 : e._cybercallMessageScrollState, r = t.querySelector("[data-cybercall-active-thread]"), i = String(((u = r == null ? void 0 : r.dataset) == null ? void 0 : u.cybercallActiveThread) ?? ""), c = !a || a.scrollToBottom === !0 || a.stickToBottom === !0 || a.threadId !== i;
  delete e._cybercallMessageScrollState;
  const s = {};
  e._cybercallMessageScrollRestoreToken = s;
  const l = () => {
    if (e._cybercallMessageScrollRestoreToken !== s || !n.isConnected) return;
    const o = Math.max(0, n.scrollHeight - n.clientHeight);
    n.scrollTop = c ? o : Math.min(a.scrollTop, o);
  };
  l(), requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      l(), e._cybercallMessageScrollRestoreToken === s && delete e._cybercallMessageScrollRestoreToken;
    });
  });
}
function Kn(e, t = null) {
  const n = ke(e, t);
  n && (n.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), n.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), n.classList.toggle("cybercall-connected", e.callData.accepted), n.querySelectorAll("[data-cybercall-action]").forEach((a) => {
    a.addEventListener("click", async (r) => {
      const i = r.currentTarget.dataset.cybercallAction;
      if (i === "accept") {
        await ma(e.callData.id);
        return;
      }
      if (i === "broadcast") {
        dt({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (i === "decline" || i === "end") && await qt(e.callData.id);
    });
  }));
}
function Yn(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-composer]");
}
function Ct(e) {
  var l, u;
  const t = new FormData(e), n = (l = game.actors) == null ? void 0 : l.get(t.get("actorId")), a = String(t.get("image") ?? "").trim() || (n == null ? void 0 : n.img) || "", r = String(t.get("callerName") ?? "").trim() || (n == null ? void 0 : n.name) || "UNKNOWN CALLER", i = t.getAll("targetUserIds").map((o) => String(o)).filter(Boolean), c = new Map((((u = game.users) == null ? void 0 : u.contents) ?? []).map((o) => [o.id, o])), s = i.map((o) => K(c.get(o)) || o);
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
function Jn(e, t = null) {
  var i, c;
  const n = ke(e, t), a = Yn(n);
  if (!n || !a) return;
  Je(a);
  const r = n.querySelector("[data-cybercall-ringtone]");
  r && r.addEventListener("change", async (s) => {
    await Kt(s.currentTarget.value);
  }), (i = a.elements.signal) == null || i.addEventListener("input", () => Je(a)), (c = a.elements.actorId) == null || c.addEventListener("change", () => {
    var l;
    const s = (l = game.actors) == null ? void 0 : l.get(a.elements.actorId.value);
    s && (a.elements.callerName.value = s.name, a.elements.image.value = s.img ?? "");
  }), a.addEventListener("submit", (s) => {
    s.preventDefault(), ie(Ct(a));
  }), n.querySelectorAll("[data-cybercall-compose-action]").forEach((s) => {
    s.addEventListener("click", async (l) => {
      var p, f, y, I;
      const u = l.currentTarget.dataset.cybercallComposeAction, o = Ct(a);
      if (u === "preview") {
        await ie(o);
        return;
      }
      if (u === "broadcast") {
        await dt(o);
        return;
      }
      if (u === "close-active") {
        qt((p = b == null ? void 0 : b.callData) == null ? void 0 : p.id);
        return;
      }
      if (u === "browse-image") {
        const d = a.elements.image, w = Ut();
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
      u === "open-messages" && await $e();
    });
  });
}
function Qn(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function Xn(e, t = null) {
  var i, c;
  const n = ke(e, t), a = Qn(n);
  if (!n || !a) return;
  a.addEventListener("submit", async (s) => {
    var o;
    s.preventDefault();
    const l = new FormData(a), u = String(l.get("scope") ?? me);
    await Vn(l.get("name"), l.get("number"), u, l.get("image"), {
      actorId: l.get("actorId"),
      managedByGM: l.get("managedByGM") === "on",
      isNpc: l.get("managedByGM") === "on" || !!l.get("actorId")
    }), a.reset(), a.elements.scope.value = u, (o = a.elements.name) == null || o.focus();
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
    await Kt(s.currentTarget.value);
  }), n.querySelectorAll("[data-cybercall-contact-action]").forEach((s) => {
    s.addEventListener("click", async (l) => {
      const u = l.currentTarget.dataset.cybercallContactAction, o = l.currentTarget.dataset.contactId, p = l.currentTarget.dataset.contactScope ?? "personal", y = (p === "group" ? se() : he()).find((I) => I.id === o);
      if (u === "remove") {
        await qn(o, p);
        return;
      }
      if (u === "call" && y) {
        await ya(y) && F === e && await e.close();
        return;
      }
      u === "message" && y && await $e(y);
    });
  }), (c = n.querySelector("[data-cybercall-open-messages]")) == null || c.addEventListener("click", async () => {
    await $e();
  });
}
function Zn(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
function Hn(e) {
  var o, p, f, y, I, d, w;
  const t = at()[e.id] ?? null, n = ((o = game.user) == null ? void 0 : o.isGM) === !0, a = !!(!e.isGroup && e.contact && !e.contact.userId && (e.contact.isNpc || e.contact.managedByGM || e.isNpcRouted)), r = t != null && t.actorId ? (f = (p = game.actors) == null ? void 0 : p.get) == null ? void 0 : f.call(p, t.actorId) : null, i = String((r == null ? void 0 : r.name) ?? (t == null ? void 0 : t.actorName) ?? "").trim(), c = String((t == null ? void 0 : t.image) ?? ((I = (y = r == null ? void 0 : r.prototypeToken) == null ? void 0 : y.texture) == null ? void 0 : I.src) ?? (r == null ? void 0 : r.img) ?? "").trim(), s = (t == null ? void 0 : t.revealPortrait) === !0, l = e.isNpcRouted === !0, u = t || l ? {
    ...e.contact,
    actorId: t && n ? String(t.actorId ?? e.contact.actorId ?? "") : e.contact.actorId,
    image: t && s ? c : ""
  } : e.contact;
  return {
    ...e,
    contact: u,
    image: !n && l ? t && s ? c : "" : e.image,
    canLinkNpc: n && a,
    showNpcLinkPanel: n && (a || !!t),
    hasNpcBinding: !!t,
    npcBindingName: i || ((d = e.contact) == null ? void 0 : d.name) || "Linked NPC",
    npcBindingImage: c,
    npcBindingInitials: X(i || ((w = e.contact) == null ? void 0 : w.name) || "NPC"),
    npcPortraitRevealed: s,
    npcBindingStatusLabel: t ? `Linked to ${i || "Actor"}` : "Unlinked NPC contact"
  };
}
function st(e = null) {
  var y, I, d;
  let t = tt();
  const n = e ?? t[0] ?? null;
  n && !t.some((w) => w.id === n.id || w.number === n.number) && (t = [...t, x(n)].sort((w, M) => w.name.localeCompare(M.name)));
  const a = J || W ? "" : _, r = Et(Ot(), t, a, nt()).map((w) => ({
    ...Hn(w),
    messages: w.messages.map((M) => ({
      ...M,
      createdAtLabel: Zn(M.createdAt)
    }))
  })), i = J || W ? null : r.find((w) => w.id === _) ?? null;
  i != null && i.contact && !t.some((w) => w.id === i.contact.id || w.number === i.contact.number) && (t = [...t, i.contact].sort((w, M) => w.name.localeCompare(M.name)));
  const c = ((y = i == null ? void 0 : i.contact) == null ? void 0 : y.id) ?? (n == null ? void 0 : n.id) ?? "", s = _t(), l = Lt(i, { excludeGMs: !1 }), u = na(i), o = Ft(), p = ((I = game.user) == null ? void 0 : I.isGM) === !0 && !i && o.length > 1, f = _n();
  return {
    threads: r,
    hasThreads: r.length > 0,
    unreadCount: s,
    hasUnreadMessages: s > 0,
    activeThread: i,
    activeThreadId: (i == null ? void 0 : i.id) ?? a,
    allContacts: t.map((w) => ({
      ...w,
      selected: w.id === c
    })),
    hasContacts: t.length > 0,
    selectedContactId: c,
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
    sendAsChoices: o,
    activeThreadRecipientUserIds: l,
    showMessageTimestamps: game.settings.get(m, "showMessageTimestamps") === !0,
    gmViewPlayerMessagesEnabled: game.settings.get(m, "gmViewPlayerMessages") === !0,
    isFoundryV13Plus: Number(((d = game.release) == null ? void 0 : d.generation) ?? 0) >= 13
  };
}
function ea(e, t = st()) {
  const n = String(new FormData(e).get("contactId") ?? "");
  return t.allContacts.find((a) => a.id === n) ?? null;
}
function Lt(e, t = {}) {
  var i, c, s;
  if (!((i = e == null ? void 0 : e.messages) != null && i.length)) return [];
  const n = String(((c = game.user) == null ? void 0 : c.id) ?? ""), a = new Set((((s = game.users) == null ? void 0 : s.contents) ?? []).filter((l) => l.isGM).map((l) => String(l.id))), r = /* @__PURE__ */ new Set();
  for (const l of e.messages) {
    l.senderUserId && l.senderUserId !== n && !(t.excludeGMs && a.has(l.senderUserId)) && r.add(l.senderUserId);
    for (const u of l.recipientUserIds ?? [])
      u && u !== n && !(t.excludeGMs && a.has(u)) && r.add(u);
  }
  return [...r];
}
function ta() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => String(t.id)).filter(Boolean);
}
function na(e) {
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
function Ft() {
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
function It(e) {
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
function aa(e, t) {
  var i, c;
  const n = new FormData(e);
  if (t.activeThread)
    return String(n.get("replyAs") ?? "self") === "contact" && ((i = game.user) != null && i.isGM) && t.activeThread.contact ? It(t.activeThread.contact) : {};
  const a = String(n.get("sendAs") ?? "self");
  if (a === "self" || !((c = game.user) != null && c.isGM)) return {};
  const r = Ft().find((s) => s.id === a);
  return It(r == null ? void 0 : r.contact);
}
function ra(e) {
  var n, a, r, i, c;
  const t = globalThis.TextEditor ?? ((r = (a = (n = globalThis.foundry) == null ? void 0 : n.applications) == null ? void 0 : a.ux) == null ? void 0 : r.TextEditor);
  try {
    const s = (i = t == null ? void 0 : t.getDragEventData) == null ? void 0 : i.call(t, e);
    if (s && Object.keys(s).length) return s;
  } catch {
  }
  try {
    return JSON.parse(((c = e.dataTransfer) == null ? void 0 : c.getData("text/plain")) || "{}");
  } catch {
    return {};
  }
}
function wt(e) {
  var n, a, r, i, c, s;
  const t = String(
    ((n = e == null ? void 0 : e.getTextureSrc) == null ? void 0 : n.call(e)) || ((a = e == null ? void 0 : e.texture) == null ? void 0 : a.src) || ((i = (r = e == null ? void 0 : e.document) == null ? void 0 : r.texture) == null ? void 0 : i.src) || ((s = (c = e == null ? void 0 : e.prototypeToken) == null ? void 0 : c.texture) == null ? void 0 : s.src) || (e == null ? void 0 : e.img) || ""
  ).trim();
  return t.includes("*") ? String((e == null ? void 0 : e.img) ?? "").trim() : t;
}
async function sa(e) {
  var c, s, l, u, o, p, f, y;
  const t = ra(e), n = globalThis.fromUuid;
  let a = t.uuid && n ? await n(t.uuid) : null;
  !a && t.sceneId && t.tokenId && (a = ((o = (u = (l = (s = (c = game.scenes) == null ? void 0 : c.get) == null ? void 0 : s.call(c, t.sceneId)) == null ? void 0 : l.tokens) == null ? void 0 : u.get) == null ? void 0 : o.call(u, t.tokenId)) ?? null);
  const r = String(
    ((p = a == null ? void 0 : a.actor) == null ? void 0 : p.id) || (a == null ? void 0 : a.actorId) || ((a == null ? void 0 : a.documentName) === "Actor" ? a.id : "") || t.actorId || (t.type === "Actor" ? t.id : "") || ""
  ).trim(), i = (a == null ? void 0 : a.documentName) === "Actor" ? a : (a == null ? void 0 : a.actor) ?? (r ? (y = (f = game.actors) == null ? void 0 : f.get) == null ? void 0 : y.call(f, r) : null);
  return i ? {
    actorId: String(i.id ?? r),
    actorUuid: String(i.uuid ?? `Actor.${i.id ?? r}`),
    actorName: String(i.name ?? "Linked NPC"),
    image: wt(a) || wt(i),
    revealPortrait: !1,
    linkedAt: (/* @__PURE__ */ new Date()).toISOString()
  } : null;
}
async function ia(e, t) {
  var a, r, i, c, s;
  if (!((a = game.user) != null && a.isGM) || !t) return;
  e.preventDefault(), e.stopPropagation();
  const n = await sa(e);
  if (!n) {
    (i = (r = ui.notifications) == null ? void 0 : r.warn) == null || i.call(r, "Drop an Actor or an Actor-backed Token to link this NPC contact.");
    return;
  }
  await Qe(t, n), (s = (c = ui.notifications) == null ? void 0 : c.info) == null || s.call(c, `Linked this NPC conversation to ${n.actorName}.`), await z();
}
async function oa(e, t) {
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
  const i = String(((M = game.user) == null ? void 0 : M.id) ?? ""), c = [...new Set([i, ...r].filter(Boolean))], s = c.map((D) => {
    var E, L;
    return K((L = (E = game.users) == null ? void 0 : E.get) == null ? void 0 : L.call(E, D));
  }).filter(Boolean), l = fe(), u = Nn(l), o = K(game.user, "A player"), p = {
    id: `group-${l}`,
    name: a,
    number: `${c.length} members`,
    userIds: r,
    isGroup: !0
  };
  await et(p, `${o} created the group.`, {
    threadId: u,
    recipientUserIds: r,
    recipientNumbers: [],
    messageType: "event",
    eventType: "group-created",
    conversationType: "group",
    groupId: l,
    groupName: a,
    groupMemberUserIds: c,
    groupMemberNames: s
  }) && (_ = u, J = !1, W = !1, t && (t.contact = p), (v == null ? void 0 : v.mode) === "messages" && (v.contact = p), await Se(), await z());
}
function ca(e, t = null) {
  const n = ke(e, t);
  if (!n) return;
  Wn(e, n), n.querySelectorAll("[data-cybercall-npc-link-drop]").forEach((i) => {
    i.addEventListener("dragover", (c) => {
      var s;
      (s = game.user) != null && s.isGM && (c.preventDefault(), c.dataTransfer.dropEffect = "link", i.classList.add("drag-over"));
    }), i.addEventListener("dragleave", () => i.classList.remove("drag-over")), i.addEventListener("drop", async (c) => {
      i.classList.remove("drag-over");
      const s = i.dataset.cybercallNpcThreadId || i.dataset.cybercallThreadId || _;
      await ia(c, s);
    });
  }), n.querySelectorAll("[data-cybercall-npc-action]").forEach((i) => {
    i.addEventListener("click", async (c) => {
      var o, p, f, y, I;
      c.preventDefault(), c.stopPropagation();
      const s = c.currentTarget.dataset.cybercallNpcAction, l = c.currentTarget.dataset.cybercallNpcThreadId || _, u = at()[l];
      if (s === "toggle-reveal" && u) {
        await Qe(l, { revealPortrait: u.revealPortrait !== !0 }), await z();
        return;
      }
      if (s === "unlink" && u) {
        await Qe(l, null), (p = (o = ui.notifications) == null ? void 0 : o.info) == null || p.call(o, "NPC identity link removed."), await z();
        return;
      }
      s === "change" && ((f = c.currentTarget.closest("[data-cybercall-npc-link-drop]")) == null || f.classList.add("awaiting-drop"), (I = (y = ui.notifications) == null ? void 0 : y.info) == null || I.call(y, "Drag a different Actor or Token onto the NPC identity panel."));
    });
  }), n.querySelectorAll("[data-cybercall-thread-id]").forEach((i) => {
    i.addEventListener("click", async (c) => {
      J = !1, W = !1, _ = c.currentTarget.dataset.cybercallThreadId, await Se(), await z();
    });
  }), n.querySelectorAll("[data-cybercall-message-action]").forEach((i) => {
    i.addEventListener("click", async (c) => {
      var l;
      const s = c.currentTarget.dataset.cybercallMessageAction;
      if (s === "refresh") {
        await z();
        return;
      }
      if (s === "open-calls") {
        await jt();
        return;
      }
      if (s === "new") {
        J = !0, W = !1, _ = "", Y && (Y.contact = null), await z();
        return;
      }
      if (s === "new-group") {
        J = !1, W = !0, _ = "", Y && (Y.contact = null), (v == null ? void 0 : v.mode) === "messages" && (v.contact = null), await z();
        return;
      }
      if (s === "delete-thread") {
        c.preventDefault(), c.stopPropagation();
        const u = n.querySelector("[data-cybercall-active-thread]"), o = _ || ((l = u == null ? void 0 : u.dataset) == null ? void 0 : l.cybercallActiveThread) || "";
        if (!o) return;
        if (e._cybercallPendingDeleteThreadId !== o) {
          e._cybercallPendingDeleteThreadId = o, c.currentTarget.classList.add("confirming"), c.currentTarget.textContent = "Confirm Delete", c.currentTarget.title = "Click again to delete this thread";
          return;
        }
        e._cybercallPendingDeleteThreadId = "", await xn(o);
      }
    });
  });
  const a = n.querySelector("form[data-cybercall-group-form]");
  a == null || a.addEventListener("submit", async (i) => {
    i.preventDefault(), await oa(a, e);
  });
  const r = n.querySelector("form[data-cybercall-message-form]");
  r == null || r.addEventListener("submit", async (i) => {
    var I, d, w, M;
    i.preventDefault();
    const c = st(), s = c.activeThread, l = (s == null ? void 0 : s.contact) ?? ea(r, c), u = ((I = r.elements.body) == null ? void 0 : I.value) ?? "", o = aa(r, c), p = !!(s != null && s.contact && !s.contact.userId && (s.contact.managedByGM || s.contact.isNpc)), f = s ? Lt(s, { excludeGMs: ((d = game.user) == null ? void 0 : d.isGM) === !0 && !p }) : null;
    if (!l) {
      (M = (w = ui.notifications) == null ? void 0 : w.warn) == null || M.call(w, "Select a contact before sending a message.");
      return;
    }
    await et(l, u, {
      ...o,
      threadId: s ? s.id : void 0,
      recipientUserIds: f != null && f.length ? f : void 0,
      recipientNumbers: o.senderNumber ? [] : void 0,
      conversationType: s != null && s.isGroup ? "group" : "direct",
      groupId: (s == null ? void 0 : s.groupId) ?? "",
      groupName: (s == null ? void 0 : s.groupName) ?? "",
      groupMemberUserIds: (s == null ? void 0 : s.groupMemberUserIds) ?? [],
      groupMemberNames: (s == null ? void 0 : s.groupMemberNames) ?? []
    }) && (_ = s ? s.id : Te(l), e && (e.contact = l), (v == null ? void 0 : v.mode) === "messages" && (v.contact = l), J = !1, W = !1, r.elements.body.value = "", await Se(), await z({ scrollToBottom: !0 }));
  }), Se();
}
const { CyberCallApplication: la, CyberCallPhone: ua } = dn({
  moduleId: m,
  templatePath: gn,
  composerTemplatePath: mn,
  contactsTemplatePath: pn,
  messagesTemplatePath: bn,
  phoneTemplatePath: fn,
  escapeHTML: ge,
  getDefaultComposerData: Rn,
  getActorChoices: Dn,
  getPlayerChoices: On,
  getContacts: he,
  getGroupContacts: se,
  getMessageContext: st,
  getRingtoneChoices: Ia,
  getSoundPath: gt,
  getActiveContactsTab: () => me,
  canEditContactImages: Ne,
  bindCallControls: Kn,
  bindComposerControls: Jn,
  bindContactsControls: Xn,
  bindMessagesControls: ca,
  stopRinging: mt,
  clearActiveCall: (e) => {
    b === e && (b = null);
  },
  clearActiveComposer: (e) => {
    H === e && (H = null);
  },
  clearActiveContacts: (e) => {
    F === e && (F = null);
  },
  clearActiveMessages: (e) => {
    Y === e && (Y = null);
  },
  clearActivePhone: (e) => {
    v === e && (v = null, H = null, F = null, Y = null);
  }
});
async function ie(e = {}) {
  var t, n;
  return je() ? (F && await F.close(), await it(), b = new la(e), await b.render(!0), zt(b), wa(b.callData), b) : ((n = (t = ui.notifications) == null ? void 0 : t.warn) == null || n.call(t, "You do not have permission to open CyberCall transmissions."), null);
}
async function it() {
  if (!b) return;
  const e = b;
  b = null, await e.close();
}
function da(e) {
  var t;
  return !!((t = b == null ? void 0 : b.callData) != null && t.id) && b.callData.id === e;
}
async function ga() {
  b && (await b.render(!0), zt(b));
}
async function xt(e) {
  da(e) && (b.callData.accepted = !0, b.callData.ringing = !1, mt(), await ga());
}
async function ma(e) {
  e && (await qe(b == null ? void 0 : b.callData, "connected"), game.socket.emit(oe, {
    action: "acceptCall",
    callId: e
  }), await xt(e));
}
async function Vt(e) {
  var t;
  e && ((t = b == null ? void 0 : b.callData) != null && t.id) && b.callData.id !== e || await it();
}
async function qt(e) {
  var t;
  await qe(b == null ? void 0 : b.callData, (t = b == null ? void 0 : b.callData) != null && t.accepted ? "ended" : "missed"), game.socket.emit(oe, {
    action: "endCall",
    callId: e
  }), await Vt(e);
}
function pa(e, t = "Player") {
  var r, i, c, s, l;
  const n = ((i = (r = game.users) == null ? void 0 : r.get) == null ? void 0 : i.call(r, e)) ?? ((l = (s = (c = game.users) == null ? void 0 : c.contents) == null ? void 0 : s.find) == null ? void 0 : l.call(s, (u) => u.id === e)), a = K(n, t);
  return {
    id: `user-${e}`,
    name: a,
    number: `@${a}`,
    image: Me(n),
    userId: e,
    userIds: e ? [e] : []
  };
}
function ba(e) {
  var t;
  return e ? e.contactNumber ? tt().find((a) => a.number === e.contactNumber) ?? {
    id: `contact-${e.contactNumber}`,
    name: e.contactName || e.callerName,
    number: e.contactNumber,
    image: e.contactImage || e.image,
    actorId: e.contactActorId ?? "",
    managedByGM: !0,
    isNpc: !0
  } : (t = game.user) != null && t.isGM && e.callerUserId ? pa(e.callerUserId, e.callerName) : null : null;
}
function fa(e, t) {
  var a;
  const n = /* @__PURE__ */ new Set();
  for (const r of (t == null ? void 0 : t.userIds) ?? []) n.add(String(r));
  if (t != null && t.userId && n.add(String(t.userId)), e != null && e.callerUserId && n.add(String(e.callerUserId)), !(t != null && t.userId) && (t != null && t.managedByGM || t != null && t.isNpc || e != null && e.contactNumber))
    for (const r of ta()) n.add(r);
  return n.delete(String(((a = game.user) == null ? void 0 : a.id) ?? "")), [...n].filter(Boolean);
}
async function qe(e, t) {
  var i;
  const n = ba(e);
  if (!n) return null;
  const a = (e == null ? void 0 : e.callerUserId) || ((i = game.user) == null ? void 0 : i.id), r = {
    outgoing: `Outgoing call to ${n.name}.`,
    connected: `Call connected with ${n.name}.`,
    ended: `Call ended with ${n.name}.`,
    missed: `Call missed or declined with ${n.name}.`
  };
  return Pn(n, r[t] ?? "Call event.", {
    threadId: Te(n, a),
    eventType: t,
    senderName: "CyberCall",
    senderNumber: n.number,
    senderActorId: n.actorId,
    recipientUserIds: fa(e, n),
    recipientNumbers: n.userId ? [] : [n.number]
  });
}
async function ya(e) {
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
  if (!rt())
    return (l = (s = ui.notifications) == null ? void 0 : s.warn) == null || l.call(s, "No GM is connected to receive the CyberCall."), null;
  const t = fe(), n = Me(game.user), a = K(game.user, "Unknown Caller"), r = {
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
  }), c = ue({
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
    callData: c
  }), await qe(i, "outgoing"), ie(i);
}
async function ot() {
  var e, t;
  return game.user.isGM ? ut("calls") : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function ct() {
  var e, t, n;
  return je() ? b ? ((n = b.bringToFront) == null || n.call(b), b) : ut("calls") : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function ee() {
  F && await F.render(!0);
}
async function $e(e = null) {
  var n, a;
  if (!je())
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "You do not have permission to use CyberCall messages."), null;
  e ? (_ = Te(e), J = !1, W = !1) : _ || W || (J = !0);
  const t = await ut("messages", e);
  return await Se(), t;
}
async function lt(e) {
  return e && (_ = String(e), J = !1, W = !1), $e();
}
async function jt() {
  var e;
  return (e = game.user) != null && e.isGM ? ot() : ct();
}
async function z(e = {}) {
  !v || v.mode !== "messages" || (v._cybercallMessageScrollState = {
    ...zn(v),
    scrollToBottom: e.scrollToBottom === !0
  }, await v.render(!0));
}
async function ut(e = "calls", t = null) {
  var n, a, r;
  return v ? (v.mode = e, v.contact = t, await v.render(!0), (n = v.bringToFront) == null || n.call(v)) : (v = new ua(e, t), await v.render(!0)), H = (a = game.user) != null && a.isGM && e === "calls" ? v : null, F = !((r = game.user) != null && r.isGM) && e === "calls" ? v : null, Y = e === "messages" ? v : null, v;
}
async function dt(e = {}) {
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
async function ha(e) {
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
      xt(e.callId);
      return;
    }
    if (e.action === "endCall") {
      Vt(e.callId);
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
function zt(e) {
  var t, n;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((n = e.setPosition) == null || n.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function Wt() {
  const e = game.settings.get(m, "ringSoundsByWorld");
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function Ca() {
  return /* @__PURE__ */ new Set([
    ...Object.keys(Xe),
    ...xe(game.settings.get(m, "customRingtones")).map((e) => e.path)
  ]);
}
function gt() {
  const e = ye(), t = Wt(), n = Object.prototype.hasOwnProperty.call(t, e), a = String(n ? t[e] : game.settings.get(m, "ringSound") ?? "").trim();
  return Ca().has(a) ? a : kt;
}
async function Kt(e) {
  const t = ye();
  await game.settings.set(m, "ringSoundsByWorld", {
    ...Wt(),
    [t]: String(e ?? "").trim()
  });
}
function Ia() {
  const e = gt(), t = xe(game.settings.get(m, "customRingtones")), n = new Map(Object.entries(Xe));
  for (const a of t)
    n.has(a.path) || n.set(a.path, a.label);
  return [...n].map(([a, r]) => ({
    value: a,
    label: r,
    selected: a === e
  }));
}
function mt() {
  if (!re) return;
  const e = re;
  re = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function wa(e) {
  var i;
  if (mt(), !e.ringing) return;
  const t = gt();
  if (!t) return;
  const a = 0.65 * (Math.max(0, Math.min(100, Number(game.settings.get(m, "ringVolume") ?? 100))) / 100), r = ((i = foundry == null ? void 0 : foundry.audio) == null ? void 0 : i.AudioHelper) ?? globalThis.AudioHelper;
  if (r != null && r.play)
    r.play({ src: t, volume: a, autoplay: !0, loop: !0, channel: "interface" }, !1).then((c) => {
      re = c;
    }).catch((c) => {
      console.warn(`${m} | Unable to play ringing sound.`, c);
    });
  else {
    const c = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5);
    re = new Audio(t), re.loop = !0, re.volume = a * c, re.play().catch((s) => {
      console.warn(`${m} | Unable to play ringing sound.`, s);
    });
  }
}
function va() {
  const e = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  if (!e) return;
  const t = new e(), n = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), a = Math.max(1e-4, Math.min(0.18, 0.18 * n)), r = (c, s, l) => {
    const u = t.createOscillator(), o = t.createGain(), p = t.currentTime + s, f = p + l;
    u.type = "sine", u.frequency.setValueAtTime(c, p), u.frequency.exponentialRampToValueAtTime(c * 1.18, f), o.gain.setValueAtTime(1e-4, p), o.gain.exponentialRampToValueAtTime(a, p + 0.025), o.gain.exponentialRampToValueAtTime(1e-4, f), u.connect(o), o.connect(t.destination), u.start(p), u.stop(f);
  };
  (async () => {
    t.state === "suspended" && await t.resume(), r(620, 0, 0.16), r(930, 0.11, 0.2), window.setTimeout(() => {
      var c;
      return (c = t.close) == null ? void 0 : c.call(t);
    }, 500);
  })().catch(() => {
    var c;
    return (c = t.close) == null ? void 0 : c.call(t);
  });
}
function Aa(e) {
  var n, a, r, i, c;
  if (e.senderImage) return String(e.senderImage);
  if (e.contactIsNpc && e.senderNumber) return "";
  const t = ((a = (n = game.users) == null ? void 0 : n.get) == null ? void 0 : a.call(n, e.senderUserId)) ?? ((c = (i = (r = game.users) == null ? void 0 : r.contents) == null ? void 0 : i.find) == null ? void 0 : c.call(i, (s) => s.id === e.senderUserId));
  return (t == null ? void 0 : t.isGM) === !0 ? "" : Me(t);
}
function vt(e) {
  e != null && e.isConnected && (e.classList.add("leaving"), window.setTimeout(() => e.remove(), 220));
}
function Na(e) {
  let t = document.querySelector("[data-cybercall-message-notifications]");
  t || (t = document.createElement("div"), t.className = "cybercall-message-notifications", t.dataset.cybercallMessageNotifications = "", t.setAttribute("aria-live", "polite"), document.body.append(t));
  const n = String(e.senderName || "New message").trim(), a = String(e.groupName || "").trim(), r = document.createElement("button");
  r.type = "button", r.className = "cybercall-incoming-message", r.title = "Open CyberCall conversation";
  const i = document.createElement("span");
  i.className = `cybercall-incoming-avatar ${Bt(e.senderUserId || n)}`;
  const c = Aa(e);
  if (c) {
    const p = document.createElement("img");
    p.src = c, p.alt = "", i.append(p);
  } else
    i.textContent = X(n);
  const s = document.createElement("i");
  s.className = "fa-solid fa-message cybercall-incoming-badge", s.setAttribute("aria-hidden", "true"), i.append(s);
  const l = document.createElement("span");
  l.className = "cybercall-incoming-copy";
  const u = document.createElement("strong");
  u.textContent = a ? `${n} · ${a}` : n;
  const o = document.createElement("small");
  o.textContent = String(e.body || "New CyberCall message").trim(), l.append(u, o), r.append(i, l), r.addEventListener("click", () => {
    vt(r), lt(String(e.threadId || ""));
  }), t.append(r), va(), window.setTimeout(() => vt(r), 4200);
}
function Sa(e) {
  var n, a, r;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[m]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, m, "message"));
  return (t == null ? void 0 : t.kind) === be ? t : ((r = t == null ? void 0 : t.message) == null ? void 0 : r.kind) === be ? t.message : null;
}
function Yt(e, t) {
  var a, r, i, c, s, l, u;
  if (!e) return;
  const n = (a = e.matches) != null && a.call(e, ".chat-message") ? e : ((r = e.closest) == null ? void 0 : r.call(e, ".chat-message")) ?? ((i = e.querySelector) == null ? void 0 : i.call(e, ".chat-message")) ?? e;
  (s = (c = n.classList) == null ? void 0 : c.toggle) == null || s.call(c, "cybercall-chat-message-hidden", !t), t ? (l = n.removeAttribute) == null || l.call(n, "aria-hidden") : (u = n.setAttribute) == null || u.call(n, "aria-hidden", "true");
}
function Jt(e, t) {
  if (!Sa(e)) return;
  const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? (t == null ? void 0 : t.element) ?? null;
  Yt(n, game.settings.get(m, "showChatCards") === !0);
}
function Qt() {
  const e = game.settings.get(m, "showChatCards") === !0;
  document.querySelectorAll(".cybercall-chat-card").forEach((t) => {
    Yt(t, e);
  });
}
function Xt() {
  const e = game.modules.get(m);
  e && (e.api = {
    openCall: ie,
    closeCall: it,
    broadcastCall: dt,
    openComposer: ot,
    openContacts: ct,
    openMessages: $e,
    openMessagesThread: lt,
    openCallPanel: jt,
    getUnreadMessageCount: _t,
    get activeCall() {
      return b;
    },
    get activeComposer() {
      return H;
    },
    get activeContacts() {
      return F;
    },
    get activeMessages() {
      return Y;
    }
  });
}
function $a() {
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
      return (a = game.user) != null && a.isGM ? ot() : ct();
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
        title: "Custom ringtones and volume controls",
        summary: "GMs can add multiple world ringtones, while each user can choose a per-world ringtone and set its volume relative to Foundry's Interface volume.",
        tags: ["CyberCall", "Ringtones", "Audio", "Settings"]
      },
      {
        title: "Foundry v12–v14 audio compatibility",
        summary: "Ringtone selection, file browsing, and playback now behave consistently across supported Foundry versions, with clearer configuration contrast and an audible default.",
        tags: ["CyberCall", "Compatibility", "Foundry v12", "Foundry v14"]
      }
    ]
  }), !0) : !1;
}
function Ma() {
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
    default: kt,
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
      v ? (n = v.render) == null || n.call(v, !0) : H ? (a = H.render) == null || a.call(H, !0) : (r = F == null ? void 0 : F.render) == null || r.call(F, !0);
    }
  }), game.settings.registerMenu(m, "customRingtonesMenu", {
    name: "Additional Ringtones",
    label: "Manage Ringtones",
    hint: "Add one or more audio files to the ringtone list for this world.",
    icon: "fa-solid fa-bell",
    type: wn,
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
    onChange: () => Qt()
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
async function Ta() {
  const e = game.settings.get(m, "contacts");
  Array.isArray(e) && await game.settings.set(m, "contacts", {
    [ye()]: e.map(x)
  });
}
Hooks.once("init", () => {
  Ma(), Xt();
});
Hooks.once("ready", async () => {
  await Ta(), Xt(), $a(), game.socket.on(oe, ha), Qt(), console.log(`${m} | Ready. Use game.modules.get("${m}").api.openCall({...})`);
});
Hooks.on("renderChatMessage", (e, t) => {
  Jt(e, t);
});
Hooks.on("renderChatMessageHTML", (e, t) => {
  Jt(e, t);
});
Hooks.on("createChatMessage", async (e) => {
  var s, l, u;
  const t = (s = e == null ? void 0 : e.flags) == null ? void 0 : s[m];
  if ((t == null ? void 0 : t.kind) !== be) return;
  const n = String(((l = game.user) == null ? void 0 : l.id) ?? ""), a = Array.isArray(t.recipientUserIds) ? t.recipientUserIds.map((o) => String(o)) : [], r = ((u = game.user) == null ? void 0 : u.isGM) === !0 && !String(t.contactUserId ?? "") && (t.contactManagedByGM === !0 || t.contactIsNpc === !0), i = String(t.senderUserId ?? "") !== n && (a.includes(n) || r), c = String(t.messageType ?? "text") === "text" || t.eventType === "group-created";
  i && c && game.settings.get(m, "messageNotifications") !== !1 && Na(t), await z(), await ee();
});
document.addEventListener("click", (e) => {
  var a;
  const t = e.target, n = (a = t == null ? void 0 : t.closest) == null ? void 0 : a.call(t, "[data-cybercall-open-thread]");
  n && (e.preventDefault(), lt(n.dataset.cybercallThreadId));
});
