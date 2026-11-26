var ua = Object.defineProperty;
var da = (e, t, n) => t in e ? ua(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var F = (e, t, n) => da(e, typeof t != "symbol" ? t + "" : t, n);
function ga(e, t) {
  return e.image ? `<img src="${t(e.image)}" alt="${t(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${t(e.initials)}</div>`;
}
function Gt(e, t) {
  const n = `--cybercall-signal: ${e.signal}%; --cybercall-glitch-shift: ${e.glitchShift}px; --cybercall-glitch-interval: ${e.glitchInterval}s;`, a = e.fullscreen ? "cybercall-broadcast" : "", r = e.ringing ? "cybercall-ringing-panel" : "", o = e.accepted ? "cybercall-connected-panel" : "", i = e.showBroadcast ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>' : "", s = `
      <div class="cybercall-call-brand"><strong>CyberCall</strong><span class="cybercall-display-mark" aria-hidden="true">COMMLINK</span><span data-cybercall-window-controls></span></div>
      <header class="cybercall-header">
        <div class="cybercall-transmission-state">
          <div class="cybercall-kicker">${t(e.accepted ? "Connected" : e.kicker)}</div>
          <div class="cybercall-signal">
            <span>${e.signal}%</span>
            <div class="cybercall-signal-bar" aria-hidden="true"><i></i></div>
          </div>
        </div>
        <div class="cybercall-caller-identity">
          <h2>${t(e.callerName)}</h2>
          ${e.contactNumber ? `<small class="cybercall-call-channel">Channel ${t(e.contactNumber)}</small>` : `<p>${t(e.subtitle)}</p>`}
        </div>
      </header>
    `, c = e.accepted ? "" : `<blockquote>${t(e.message)}</blockquote>`, u = e.accepted || e.outgoing ? '<button type="button" data-cybercall-action="end">End Call</button>' : `
        ${e.canAccept ? '<button type="button" data-cybercall-action="accept">Accept</button>' : ""}
        <button type="button" data-cybercall-action="decline">Decline</button>
        ${i}
      `;
  return `
    <div data-cybercall-signal-quality="${e.signalQuality}" class="cybercall-panel cybercall-${e.variant} ${a} ${r} ${o}" style="${n}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${s}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${ga(e, t)}</div>
        <div class="cybercall-waveform" aria-hidden="true"></div>
        ${c}
      </main>
      <footer class="cybercall-actions">
        ${u}
      </footer>
    </div>
  `;
}
function an(e, t) {
  const n = e.call;
  return `
    <form class="cybercall-composer" data-cybercall-composer>
      <nav class="cybercall-mode-tabs">
        <button type="button" data-cybercall-console-tab="transmission" aria-selected="true">Transmission</button>
        <button type="button" data-cybercall-compose-action="open-messages" data-cybercall-mode-tab="messages">Messages</button>
        <button type="button" data-cybercall-console-tab="configuration" aria-selected="false">Configuration</button>
        <span data-cybercall-window-controls></span>
      </nav>
      <section data-cybercall-console-panel="transmission">
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
      </section>
      <section class="cybercall-console-configuration" data-cybercall-console-panel="configuration" hidden>
        <h3>Configuration</h3>
        <label>Phone number format <input type="text" name="phoneNumberFormat" value="${t(e.phoneNumberFormat ?? "")}" placeholder="###-###-####" maxlength="64"></label>
        <p>Use # for a digit, A for a letter, or * for a letter or digit. Examples: AAA-#### or ***-###. Fixed text and separators are inserted automatically. Leave blank for unrestricted numbers.</p>
        <label>Device emblem <span class="cybercall-composer-path-row"><input type="text" name="deviceEmblem" value="${t(e.deviceEmblem ?? "")}" placeholder="Path to an emblem image"><button type="button" data-cybercall-emblem-browse>Browse</button></span></label>
        <p>HoloSuite Branding’s artwork takes priority when configured. Otherwise this image is used.</p>
        <button type="button" data-cybercall-save-configuration>Save configuration</button>
        <output data-cybercall-configuration-status role="status"></output>
      </section>
    </form>
  `;
}
function Pt(e, t) {
  var c;
  const n = (u, l) => u.length ? u.map((g) => `
        <li>
          <div class="cybercall-contact-avatar">
            ${g.image ? `<img src="${t(g.image)}" alt="">` : `<span>${t(g.initials)}</span>`}
          </div>
          <div class="cybercall-contact-id">
            <strong>${t(g.name)}</strong>
            <span>${t(g.number)}</span>
          </div>
          <div class="cybercall-contact-actions">
            <button type="button" data-cybercall-contact-action="call" data-contact-scope="${l}" data-contact-id="${t(g.id)}">Call</button>
            <button type="button" data-cybercall-contact-action="message" data-contact-scope="${l}" data-contact-id="${t(g.id)}">Message</button>
            <button type="button" data-cybercall-contact-action="remove" data-contact-scope="${l}" data-contact-id="${t(g.id)}">Remove</button>
          </div>
        </li>
      `).join("") : '<li class="cybercall-contacts-empty">No contacts stored.</li>', a = e.activeTab !== "group", r = e.activeTab === "group", o = (e.actors ?? []).map((u) => `<option value="${t(u.id)}">${t(u.name)}</option>`).join(""), i = e.canEditContactImages ? `
        <label>Actor
          <select name="actorId">
            <option value="">No linked actor</option>
            ${o}
          </select>
        </label>
        <label>Picture <span class="cybercall-contact-picture-row"><input type="text" name="image" placeholder="icons/..."><button type="button" data-cybercall-contact-browse>Browse</button></span></label>
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
        ${i}
        <button type="submit">Add Contact</button>
      </form>
      <footer class="cybercall-contacts-footer">
        <label class="cybercall-ringtone-select">
          <span>Ringtone</span>
          <select data-cybercall-ringtone>
            ${(e.ringtoneChoices ?? []).map(
    (u) => `<option value="${t(u.value)}" ${u.selected ? "selected" : ""}>${t(u.label)}</option>`
  ).join("")}
          </select>
        </label>
        ${(c = e.messageSoundOptions) != null && c.length ? `
          <label class="cybercall-ringtone-select">
            <span>Notification sound</span>
            <select data-cybercall-message-sound>
              ${e.messageSoundOptions.map(
    (u) => `<option value="${t(u.value)}" ${u.selected ? "selected" : ""}>${t(u.label)}</option>`
  ).join("")}
            </select>
          </label>
        ` : ""}
      </footer>
    </section>
  `;
}
function kt(e, t) {
  var M;
  const n = e.threads ?? [], a = e.activeThread ?? null, r = e.allContacts ?? [], o = n.length ? n.map((m) => `
        <button type="button" class="cybercall-thread ${m.active ? "active" : ""} ${m.hasRouteLabel ? "routed" : ""} ${m.hasNpcBinding ? "npc-linked" : ""}" data-cybercall-thread-id="${t(m.id)}" ${m.canLinkNpc ? `data-cybercall-npc-link-drop data-cybercall-npc-thread-id="${t(m.id)}"` : ""}>
          <span class="cybercall-thread-avatar ${t(m.avatarTone)} ${m.isGroup ? "group" : ""}">
            ${m.image ? `<img src="${t(m.image)}" alt="">` : m.isGroup ? '<i class="fa-solid fa-user-group" aria-hidden="true"></i>' : t(m.initials)}
          </span>
          <span class="cybercall-thread-body">
            <strong>${t(m.title)}</strong>
            ${m.hasRouteLabel ? `
              <span class="cybercall-thread-route-row">
                <span class="cybercall-thread-route">${t(m.routeLabel)}</span>
                ${m.canLinkNpc ? `
                  <span class="cybercall-thread-npc-state ${m.hasNpcBinding ? "linked" : "unlinked"}" title="${t(m.npcBindingStatusLabel)}">
                    ${m.hasNpcBinding ? m.npcBindingImage ? `<img src="${t(m.npcBindingImage)}" alt="">` : '<i class="fa-solid fa-link" aria-hidden="true"></i>' : '<i class="fa-solid fa-link-slash" aria-hidden="true"></i>'}
                  </span>
                ` : ""}
              </span>
            ` : ""}
            <small>${t(m.lastPreview)}</small>
          </span>
          ${m.unread ? `<span class="cybercall-thread-unread">${m.unreadCount}</span>` : ""}
        </button>
      `).join("") : '<div class="cybercall-messages-empty">No messages yet.</div>', i = r.map((m) => `<option value="${t(m.id)}" ${e.selectedContactId === m.id ? "selected" : ""}>${t(m.name)} - ${t(m.number)}</option>`).join(""), s = e.canReplyAs ? `
      <label>
        <span>Reply As</span>
        <select name="replyAs">
          ${(e.replyAsChoices ?? []).map(
    (m) => `<option value="${t(m.id)}" ${m.selected ? "selected" : ""}>${t(m.label)}</option>`
  ).join("")}
        </select>
      </label>
    ` : "", c = e.canSendAs ? `
      <label>
        <span>Send As</span>
        <select name="sendAs">
          ${(e.sendAsChoices ?? []).map(
    (m) => `<option value="${t(m.id)}" ${m.selected ? "selected" : ""}>${t(m.label)}</option>`
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
          ${i}
        </select>
      </label>
    `, l = (M = a == null ? void 0 : a.messages) != null && M.length ? a.messages.map((m) => `
        <article class="cybercall-message ${m.isMine ? "mine" : ""} ${m.isEvent ? "event" : ""}">
          <strong>${t(m.senderName)}</strong>
          <p>${t(m.body)}</p>
          ${e.showMessageTimestamps ? `<time>${t(m.createdAtLabel ?? m.createdAt)}</time>` : ""}
        </article>
      `).join("") : '<div class="cybercall-messages-empty">Select a thread or send a new message.</div>', g = (e.groupMemberChoices ?? []).length ? (e.groupMemberChoices ?? []).map((m) => `
        <label>
          <input type="checkbox" name="memberUserIds" value="${t(m.id)}">
          <span>${t(m.name)}${m.active ? "" : " (offline)"}</span>
        </label>
      `).join("") : "<p>No other player users are available.</p>", b = (e.groupNpcMemberChoices ?? []).map((m) => `
        <label>
          <input type="checkbox" name="memberActorIds" value="${t(m.actorId)}">
          <span>${t(m.name)}</span>
        </label>
      `).join(""), w = `
    <form class="cybercall-group-form" data-cybercall-group-form>
      <label class="cybercall-group-name">
        <span>Group Name</span>
        <input type="text" name="groupName" maxlength="80" autocomplete="off" placeholder="Night City Crew" required>
      </label>
      <fieldset>
        <legend>Players</legend>
        <div class="cybercall-group-members">${g}</div>
      </fieldset>
      ${b ? `<fieldset>
        <legend>NPCs</legend>
        <div class="cybercall-group-members">${b}</div>
      </fieldset>` : ""}
      <button type="submit" ${e.hasGroupMemberChoices ? "" : "disabled"}>Create Group</button>
    </form>
  `, A = a != null && a.showNpcLinkPanel ? `
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
        ${e.pendingCount ? `<p role="status">Awaiting delivery: ${Number(e.pendingCount)}</p>` : ""}
        ${o}
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
              <div class="cybercall-contacts-kicker" ${a != null && a.isGroup ? `title="${t(a.groupRoster)}"` : ""}>${a ? t(a.subtitle) : e.isComposingNewGroup ? "Private Channel" : "Secure Channel"}</div>
              <h3>${a ? t(a.title) : e.isComposingNewGroup ? "Create Group Chat" : "New Message"}</h3>
            </div>
          </div>
          ${e.canDeleteThread ? '<button type="button" class="cybercall-delete-thread" data-cybercall-message-action="delete-thread">Delete Thread</button>' : ""}
        </header>
        ${A}
        ${e.isComposingNewGroup ? w : `
          <div class="cybercall-message-log">${l}</div>
          <form class="cybercall-message-form ${e.canReplyAs ? "has-reply-as" : ""} ${e.canSendAs ? "has-send-as" : ""}" data-cybercall-message-form>
            ${u}
            ${s}
            ${c}
            <textarea name="body" rows="3" placeholder="Type message..." required></textarea>
            <button type="submit" ${r.length ? "" : "disabled"}>Send</button>
          </form>
        `}
      </main>
    </section>
  `;
}
const K = {
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
}, ma = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]);
function dn(e) {
  const t = Number(e);
  return Number.isNaN(t) ? K.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function pa(e) {
  const t = dn(e), n = (100 - t) / 100;
  return {
    signalQuality: t >= 90 ? "clear" : t >= 65 ? "weak" : t >= 35 ? "poor" : "critical",
    glitchShift: Math.round(n * 7 * 100) / 100,
    glitchInterval: Math.round((1.4 + 6.6 * (1 - n)) * 100) / 100
  };
}
function ne(e) {
  return String(e).split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var n;
    return (n = t[0]) == null ? void 0 : n.toUpperCase();
  }).join("") || "?";
}
function Me() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function se(e = {}) {
  var r;
  const t = Array.isArray(e.targetUserIds) ? e.targetUserIds.map((o) => String(o)).filter(Boolean) : [], n = Array.isArray(e.targetUserNames) ? e.targetUserNames.map((o) => String(o)).filter(Boolean) : [], a = {
    ...K,
    ...e,
    id: String(e.id ?? Me()),
    callerName: String(e.callerName ?? K.callerName),
    subtitle: String(e.subtitle ?? K.subtitle),
    image: String(e.image ?? K.image),
    message: String(e.message ?? K.message),
    signal: dn(e.signal ?? K.signal),
    variant: ma.has(e.variant) ? e.variant : K.variant,
    fullscreen: !!(e.fullscreen ?? K.fullscreen),
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
  return a.initials = ne(a.callerName), Object.assign(a, pa(a.signal)), a.showBroadcast = !!((r = game == null ? void 0 : game.user) != null && r.isGM && a.allowBroadcast), a.isStandard = a.variant === "standard", a.isEmergency = a.variant === "emergency", a.isCorrupted = a.variant === "corrupted", a.isIncoming = !a.accepted, a.hasTargets = a.targetUserIds.length > 0, a.recipientLabel = a.hasTargets ? a.targetUserNames.join(", ") : "All players", a.directionLabel = a.outgoing ? `Calling ${a.recipientLabel}` : `From ${a.callerName}`, a.kicker = a.outgoing ? "Calling" : a.isEmergency ? "Emergency transmission" : a.isCorrupted ? "Unstable transmission" : a.fullscreen ? "Incoming broadcast" : "Incoming transmission", a;
}
function q(e = {}) {
  const t = Array.isArray(e.userIds) ? e.userIds.map((n) => String(n)).filter(Boolean) : e.userId ? [String(e.userId)] : [];
  return {
    id: String(e.id ?? Me()),
    name: String(e.name ?? "").trim(),
    number: String(e.number ?? "").trim(),
    image: String(e.image ?? e.img ?? "").trim(),
    actorId: String(e.actorId ?? "").trim(),
    userId: String(e.userId ?? t[0] ?? "").trim(),
    userIds: t,
    managedByGM: e.managedByGM === !0,
    isNpc: e.isNpc === !0 || !!e.actorId || e.managedByGM === !0,
    initials: ne(e.name)
  };
}
function fa(e) {
  var a, r, o;
  const t = (e == null ? void 0 : e.document) ?? e, n = String(
    ((a = t == null ? void 0 : t.getTextureSrc) == null ? void 0 : a.call(t)) || ((r = t == null ? void 0 : t.texture) == null ? void 0 : r.src) || (t == null ? void 0 : t.img) || ((o = e == null ? void 0 : e.texture) == null ? void 0 : o.src) || ""
  ).trim();
  return n.includes("*") ? "" : n;
}
function it(e) {
  return !e || /(?:^|\/)mystery-man(?:-[^/.]+)?\.svg(?:$|\?)/i.test(e);
}
function ze(e) {
  var M, m, v, y, N, E, k, P, R, U, z;
  if (!e) return "";
  const t = typeof game < "u" ? game : globalThis.game, n = typeof canvas < "u" ? canvas : globalThis.canvas, a = String(e.avatar ?? ((M = e._source) == null ? void 0 : M.avatar) ?? "").trim();
  if (e.isGM === !0) return it(a) ? "" : a;
  const r = gn(e), o = String((r == null ? void 0 : r.id) ?? (r == null ? void 0 : r._id) ?? ""), i = Array.isArray((m = n == null ? void 0 : n.tokens) == null ? void 0 : m.placeables) ? n.tokens.placeables : [], s = String(((v = t == null ? void 0 : t.user) == null ? void 0 : v.id) ?? "") === String(e.id ?? "") ? ((y = n == null ? void 0 : n.tokens) == null ? void 0 : y.controlled) ?? [] : [], c = ((N = r == null ? void 0 : r.getActiveTokens) == null ? void 0 : N.call(r, !0, !0)) ?? [], u = i.find((G) => {
    var L, ee;
    const O = String(((L = G == null ? void 0 : G.actor) == null ? void 0 : L.id) ?? ((ee = G == null ? void 0 : G.document) == null ? void 0 : ee.actorId) ?? (G == null ? void 0 : G.actorId) ?? "");
    return o && O === o;
  }), l = i.find((G) => {
    var L, ee;
    const O = (G == null ? void 0 : G.actor) ?? ((L = G == null ? void 0 : G.document) == null ? void 0 : L.actor);
    return Number(((ee = O == null ? void 0 : O.ownership) == null ? void 0 : ee[e.id]) ?? 0) >= 3;
  }), b = [...r ? s.filter(
    (G) => {
      var O, L;
      return String(((O = G == null ? void 0 : G.actor) == null ? void 0 : O.id) ?? ((L = G == null ? void 0 : G.document) == null ? void 0 : L.actorId) ?? (G == null ? void 0 : G.actorId) ?? "") === o;
    }
  ) : s, ...c, u, ...r ? [] : [l]].filter(Boolean).map(fa).find(Boolean) ?? "";
  if (b) return b;
  const w = String(
    ((k = (E = r == null ? void 0 : r.prototypeToken) == null ? void 0 : E.texture) == null ? void 0 : k.src) || ((U = (R = (P = r == null ? void 0 : r._source) == null ? void 0 : P.prototypeToken) == null ? void 0 : R.texture) == null ? void 0 : U.src) || ""
  ).trim();
  if (w && !w.includes("*") && !it(w))
    return w;
  const A = String((r == null ? void 0 : r.img) ?? ((z = r == null ? void 0 : r._source) == null ? void 0 : z.img) ?? "").trim();
  return it(A) ? it(a) ? "" : a : A;
}
function gn(e) {
  var a, r, o;
  if (!e) return null;
  const t = typeof game < "u" ? game : globalThis.game, n = [e.character, e.characterId, (a = e._source) == null ? void 0 : a.character];
  for (const i of n) {
    const s = typeof i == "string" ? i : (i == null ? void 0 : i.id) ?? (i == null ? void 0 : i._id), c = s ? (o = (r = t == null ? void 0 : t.actors) == null ? void 0 : r.get) == null ? void 0 : o.call(r, s) : null;
    if (c) return c;
    if (i && typeof i == "object" && i.name) return i;
  }
  return null;
}
function X(e, t = "") {
  var a;
  const n = String(((a = gn(e)) == null ? void 0 : a.name) ?? "").trim();
  return n || String((e == null ? void 0 : e.name) ?? "").trim() || t;
}
function mn(e, t = "Player") {
  const n = X(e, t), a = String((e == null ? void 0 : e.id) ?? "");
  return {
    id: `user-${a}`,
    name: n,
    number: `@${String((e == null ? void 0 : e.name) ?? "").trim() || n}`,
    image: ze(e),
    userId: a,
    userIds: a ? [a] : [],
    isNpc: !1,
    managedByGM: !1
  };
}
function pn() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) ?? null;
}
function fn() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : n.api) ?? null;
}
function ba(e = {}, t = {}) {
  var a, r, o;
  const n = ((r = (a = globalThis.foundry) == null ? void 0 : a.utils) == null ? void 0 : r.mergeObject) ?? ((o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.mergeObject);
  return typeof n == "function" ? n(e, t, { inplace: !1 }) : { ...e, ...t };
}
function ya() {
  var e, t, n, a, r;
  return ((n = (t = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : t.randomID) == null ? void 0 : n.call(t, 8)) ?? ((r = (a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.randomID) == null ? void 0 : r.call(a, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function rn(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${ya()}`),
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
function ha() {
  var t, n, a;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((a = game == null ? void 0 : game.release) == null ? void 0 : a.generation));
  return Number.isFinite(e) ? e : null;
}
function Ca() {
  const e = ha();
  return e === null || e >= 13;
}
function bn(e) {
  return class extends e {
    constructor(a = {}) {
      const r = ba(new.target.defaultOptions ?? {}, a);
      super(rn(r));
      F(this, "_v1Options");
      this._v1Options = r;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return rn(this.defaultOptions ?? {});
    }
    activateListeners(a) {
    }
    async _renderHTML(a, r) {
      var u, l, g;
      const o = typeof this.getData == "function" ? await this.getData() : {}, i = ((u = this._v1Options) == null ? void 0 : u.template) ?? ((l = this.options) == null ? void 0 : l.template) ?? ((g = this.constructor.defaultOptions) == null ? void 0 : g.template);
      if (!i) return document.createDocumentFragment();
      const s = await globalThis.renderTemplate(i, o), c = document.createElement("template");
      return c.innerHTML = s.trim(), c.content;
    }
    _activateV1Form(a) {
      var o, i;
      if (typeof this._updateObject != "function") return;
      const r = (o = a.matches) != null && o.call(a, "form") ? a : (i = a.querySelector) == null ? void 0 : i.call(a, "form");
      r instanceof HTMLFormElement && r.addEventListener("submit", async (s) => {
        var u;
        s.preventDefault(), s.stopPropagation();
        const c = new FormData(r);
        await this._updateObject(s, c), ((u = this._v1Options) == null ? void 0 : u.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(a, r, o) {
      var l, g, b, w;
      r.replaceChildren(a);
      const i = globalThis.jQuery ?? globalThis.$, s = ((l = r.closest) == null ? void 0 : l.call(r, ".window-app, .app, .application")) ?? r, c = i ? i(s) : s;
      try {
        Object.defineProperty(this, "element", {
          value: c,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = c;
        } catch {
        }
      }
      const u = (g = this._v1Options) == null ? void 0 : g.classes;
      Array.isArray(u) && u.length && (r.classList.add(...u), (w = (b = r.closest) == null ? void 0 : b.call(r, ".window-app, .app, .application")) == null || w.classList.add(...u)), this._activateV1Form(r), typeof this.activateListeners == "function" && this.activateListeners(i ? i(r) : r);
    }
  };
}
function wa() {
  const e = pn(), t = fn(), n = globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (n) return n;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? bn(a) : null;
}
function va() {
  const e = pn(), t = fn(), n = globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (n) return n;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? bn(a) : wa();
}
function Ia() {
  var n, a, r, o, i, s;
  const e = ((a = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : a.api) ?? ((r = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : r.api) ?? null, t = ((i = (o = globalThis.foundry) == null ? void 0 : o.applications) == null ? void 0 : i.api) ?? ((s = foundry == null ? void 0 : foundry.applications) == null ? void 0 : s.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function Sa(e) {
  var Ue, Ce, Be, De;
  const {
    moduleId: t,
    templatePath: n,
    composerTemplatePath: a,
    contactsTemplatePath: r,
    messagesTemplatePath: o,
    phoneTemplatePath: i,
    escapeHTML: s,
    getDefaultComposerData: c,
    getActorChoices: u,
    getPlayerChoices: l,
    getContacts: g,
    getGroupContacts: b,
    getMessageContext: w,
    getCallHistory: A,
    bindPhoneNavigation: M,
    getRingtoneChoices: m,
    getMessageSoundOptions: v,
    getSoundPath: y,
    getActiveContactsTab: N,
    getContactsPlayerChoices: E,
    getSelectedContactsPlayerId: k,
    getPlayerContacts: P,
    canEditContactImages: R,
    bindCallControls: U,
    bindComposerControls: z,
    bindContactsControls: G,
    bindMessagesControls: O,
    stopRinging: L,
    clearActiveCall: ee,
    clearActiveComposer: _,
    clearActiveContacts: ce,
    clearActiveMessages: re,
    clearActivePhone: Ee
  } = e, x = (Ce = (Ue = foundry == null ? void 0 : foundry.applications) == null ? void 0 : Ue.api) == null ? void 0 : Ce.ApplicationV2, J = (De = (Be = foundry == null ? void 0 : foundry.applications) == null ? void 0 : Be.api) == null ? void 0 : De.HandlebarsApplicationMixin, le = Ia(), te = Ca();
  function Ge() {
    var B;
    const h = g(), T = b(), p = N(), f = k(), { unreadCount: S } = w();
    return {
      contacts: h,
      groupContacts: T,
      hasContacts: h.length > 0,
      hasGroupContacts: T.length > 0,
      activeTab: p,
      isPersonalTab: p === "personal",
      isPlayerTab: p === "player",
      players: E(),
      playerContacts: (B = game.user) != null && B.isGM ? P(f) : [],
      hideContactEditor: p === "player" && !f,
      isGroupTab: p === "group",
      canEditContactImages: R(),
      canManageNpcContacts: R(),
      actors: u(),
      unreadMessageCount: S,
      hasUnreadMessages: S > 0,
      ringtoneChoices: m(),
      messageSoundOptions: v(),
      currentRingtone: y()
    };
  }
  function Ke() {
    const h = c();
    return {
      call: h,
      previewCall: se({ ...h, fullscreen: !1 }),
      actors: u(),
      players: l(),
      ringtoneChoices: m(),
      phoneNumberFormat: game.settings.get(t, "phoneNumberFormat"),
      deviceEmblem: game.settings.get(t, "deviceEmblem")
    };
  }
  function Je(h, T = null, p = null) {
    if (p) return { call: p, isCallScreen: !0 };
    const f = h === "messages", S = h === "history", B = h === "settings", la = !f && !S && !B;
    return {
      ...f ? w(T) : Ge(),
      mode: h,
      inPhone: !0,
      isMessagesMode: f,
      isHistoryMode: S,
      isSettingsMode: B,
      isContactsMode: la,
      history: S ? A() : []
    };
  }
  let ve;
  async function he() {
    var p, f;
    const h = (p = foundry == null ? void 0 : foundry.applications) == null ? void 0 : p.handlebars, T = ((f = h == null ? void 0 : h.loadTemplates) == null ? void 0 : f.bind(h)) ?? globalThis.loadTemplates;
    ve ?? (ve = Promise.resolve(T([
      n,
      r,
      o
    ])).catch((S) => {
      throw ve = void 0, S;
    })), await ve;
  }
  function Pe(h) {
    return h.isCallScreen ? Gt(h.call, s) : h.isMessagesMode ? kt(h, s) : Pt(h, s);
  }
  function ue(h) {
    const T = document.createElement("template");
    T.innerHTML = h.trim();
    const p = T.content.firstElementChild;
    return {
      main: p instanceof HTMLElement ? p : document.createElement("div")
    };
  }
  function ke(h, T = null) {
    if (h.callData) {
      U(h, T);
      return;
    }
    M(h, T), h.mode === "messages" ? O(h, T) : G(h, T);
  }
  class Ye extends le {
    constructor(p, f = {}) {
      super(f);
      F(this, "callData");
      this.callData = se(p);
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-overlay",
        title: "CyberCall",
        template: n,
        classes: ["cybercall-app"],
        popOut: !0,
        resizable: !0,
        width: Math.min(444, window.innerWidth - 16),
        height: Math.min(752, window.innerHeight - 24)
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
      } catch (f) {
        return console.warn(`${t} | Template render failed, using inline fallback.`, f), $(Gt(this.callData, s));
      }
    }
    activateListeners(p) {
      super.activateListeners(p), U(this, p);
    }
    async close(p) {
      return ee(this), L(), super.close(p);
    }
  }
  class Qe extends le {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-composer",
        title: "CyberCall Composer",
        template: a,
        classes: ["cybercall-composer-app"],
        popOut: !0,
        resizable: !0,
        width: Math.min(1080, window.innerWidth - 24),
        height: Math.min(730, window.innerHeight - 24)
      });
    }
    getData() {
      return Ke();
    }
    async _renderInner(T) {
      try {
        return await he(), await super._renderInner(T);
      } catch (p) {
        return console.warn(`${t} | Composer template render failed, using inline fallback.`, p), $(an(T, s));
      }
    }
    activateListeners(T) {
      super.activateListeners(T), z(this, T);
    }
    async close(T) {
      return _(this), super.close(T);
    }
  }
  class Ze extends le {
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
      return Ge();
    }
    async _renderInner(T) {
      try {
        return await super._renderInner(T);
      } catch (p) {
        return console.warn(`${t} | Contacts template render failed, using inline fallback.`, p), $(Pt(T, s));
      }
    }
    activateListeners(T) {
      super.activateListeners(T), G(this, T);
    }
    async close(T) {
      return ce(this), super.close(T);
    }
  }
  class Xe extends le {
    constructor(p = "calls", f = null, S = {}) {
      super(S);
      F(this, "mode");
      F(this, "contact");
      F(this, "callData", null);
      this.mode = p, this.contact = f;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-phone",
        title: "CyberCall",
        template: i,
        classes: ["cybercall-phone-app"],
        popOut: !0,
        resizable: !0,
        width: Math.min(444, window.innerWidth - 16),
        height: Math.min(752, window.innerHeight - 24)
      });
    }
    getData() {
      return Je(this.mode, this.contact, this.callData);
    }
    async _renderInner(p) {
      try {
        return await he(), await super._renderInner(p);
      } catch (f) {
        return console.warn(`${t} | Phone template render failed, using inline fallback.`, f), $(Pe(p));
      }
    }
    activateListeners(p) {
      super.activateListeners(p), ke(this, p);
    }
    async close(p) {
      return Ee(this), super.close(p);
    }
  }
  class et extends le {
    constructor(p = null, f = {}) {
      super(f);
      F(this, "contact");
      this.contact = p;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-messages",
        title: "CyberCall Messages",
        template: o,
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
    async _renderInner(p) {
      try {
        return await super._renderInner(p);
      } catch (f) {
        return console.warn(`${t} | Messages template render failed, using inline fallback.`, f), $(kt(p, s));
      }
    }
    activateListeners(p) {
      super.activateListeners(p), O(this, p);
    }
    async close(p) {
      return re(this), super.close(p);
    }
  }
  function tt() {
    var h;
    return !te || !x || !J ? null : (h = class extends J(x) {
      constructor(f, S = {}) {
        super(S);
        F(this, "callData");
        this.callData = se(f);
      }
      async _prepareContext(f) {
        return {
          ...await super._prepareContext(f),
          call: this.callData
        };
      }
      async _renderHTML(f, S) {
        try {
          return await super._renderHTML(f, S);
        } catch (B) {
          return console.warn(`${t} | Template render failed, using inline fallback.`, B), ue(Gt(this.callData, s));
        }
      }
      _onRender(f, S) {
        var B;
        (B = super._onRender) == null || B.call(this, f, S), U(this);
      }
      async close(f) {
        return ee(this), L(), super.close(f);
      }
    }, F(h, "DEFAULT_OPTIONS", {
      id: "cybercall-overlay",
      tag: "section",
      classes: ["cybercall-app"],
      window: {
        title: "CyberCall",
        resizable: !0
      },
      position: {
        width: Math.min(444, window.innerWidth - 16),
        height: Math.min(752, window.innerHeight - 24)
      }
    }), F(h, "PARTS", {
      main: {
        template: n
      }
    }), h);
  }
  function nt() {
    var h;
    return !te || !x || !J ? null : (h = class extends J(x) {
      async _prepareContext(p) {
        return {
          ...await super._prepareContext(p),
          ...Ke()
        };
      }
      async _renderHTML(p, f) {
        try {
          return await he(), await super._renderHTML(p, f);
        } catch (S) {
          return console.warn(`${t} | Composer template render failed, using inline fallback.`, S), ue(an(p, s));
        }
      }
      _onRender(p, f) {
        var S;
        (S = super._onRender) == null || S.call(this, p, f), z(this);
      }
      async close(p) {
        return _(this), super.close(p);
      }
    }, F(h, "DEFAULT_OPTIONS", {
      id: "cybercall-composer",
      tag: "section",
      classes: ["cybercall-composer-app"],
      window: {
        title: "CyberCall Composer",
        resizable: !0
      },
      position: {
        width: Math.min(1080, window.innerWidth - 24),
        height: Math.min(730, window.innerHeight - 24)
      }
    }), F(h, "PARTS", {
      main: {
        template: a
      }
    }), h);
  }
  function at() {
    var h;
    return !te || !x || !J ? null : (h = class extends J(x) {
      async _prepareContext(p) {
        return {
          ...await super._prepareContext(p),
          ...Ge()
        };
      }
      async _renderHTML(p, f) {
        try {
          return await super._renderHTML(p, f);
        } catch (S) {
          return console.warn(`${t} | Contacts template render failed, using inline fallback.`, S), ue(Pt(p, s));
        }
      }
      _onRender(p, f) {
        var S;
        (S = super._onRender) == null || S.call(this, p, f), G(this);
      }
      async close(p) {
        return ce(this), super.close(p);
      }
    }, F(h, "DEFAULT_OPTIONS", {
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
    }), F(h, "PARTS", {
      main: {
        template: r
      }
    }), h);
  }
  function rt() {
    var h;
    return !te || !x || !J ? null : (h = class extends J(x) {
      constructor(f = "calls", S = null, B = {}) {
        super(B);
        F(this, "mode");
        F(this, "contact");
        F(this, "callData", null);
        this.mode = f, this.contact = S;
      }
      async _prepareContext(f) {
        return {
          ...await super._prepareContext(f),
          ...Je(this.mode, this.contact, this.callData)
        };
      }
      async _renderHTML(f, S) {
        try {
          return await he(), await super._renderHTML(f, S);
        } catch (B) {
          return console.warn(`${t} | Phone template render failed, using inline fallback.`, B), ue(Pe(f));
        }
      }
      _onRender(f, S) {
        var B;
        (B = super._onRender) == null || B.call(this, f, S), ke(this);
      }
      async close(f) {
        return Ee(this), super.close(f);
      }
    }, F(h, "DEFAULT_OPTIONS", {
      id: "cybercall-phone",
      tag: "section",
      classes: ["cybercall-phone-app"],
      window: {
        title: "CyberCall",
        resizable: !0
      },
      position: {
        width: Math.min(444, window.innerWidth - 16),
        height: Math.min(752, window.innerHeight - 24)
      }
    }), F(h, "PARTS", {
      main: {
        template: i
      }
    }), h);
  }
  function st() {
    var h;
    return !te || !x || !J ? null : (h = class extends J(x) {
      constructor(f = null, S = {}) {
        super(S);
        F(this, "contact");
        this.contact = f;
      }
      async _prepareContext(f) {
        return {
          ...await super._prepareContext(f),
          ...w(this.contact)
        };
      }
      async _renderHTML(f, S) {
        try {
          return await super._renderHTML(f, S);
        } catch (B) {
          return console.warn(`${t} | Messages template render failed, using inline fallback.`, B), ue(kt(f, s));
        }
      }
      _onRender(f, S) {
        var B;
        (B = super._onRender) == null || B.call(this, f, S), O(this);
      }
      async close(f) {
        return re(this), super.close(f);
      }
    }, F(h, "DEFAULT_OPTIONS", {
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
    }), F(h, "PARTS", {
      main: {
        template: o
      }
    }), h);
  }
  return {
    CyberCallApplication: tt() ?? Ye,
    CyberCallComposer: nt() ?? Qe,
    CyberCallContacts: at() ?? Ze,
    CyberCallMessages: st() ?? et,
    CyberCallPhone: rt() ?? Xe
  };
}
const d = "cybercall", ie = `module.${d}`, Aa = `modules/${d}/templates/cybercall.hbs`, Na = `modules/${d}/templates/cybercall-composer.hbs`, Ma = `modules/${d}/templates/cybercall-contacts.hbs`, $a = `modules/${d}/templates/cybercall-messages.hbs`, Ta = `modules/${d}/templates/cybercall-phone.hbs`, Ea = `modules/${d}/templates/ringtone-settings.hbs`, oe = "phoneMessage", yn = 3, xt = {
  "": "Silent",
  [`modules/${d}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${d}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${d}/audio/Ringtone3.ogg`]: "Ringtone 3"
}, hn = `modules/${d}/audio/Ringtone1.ogg`;
function lt(e) {
  if (typeof e != "string") return "";
  const t = e.trim();
  if (!t || t.length > 2048 || /[\x00-\x1f<>"'\\]/.test(t) || t.startsWith("//")) return "";
  try {
    const n = new URL(t, "https://world.invalid/");
    return !/^https?:$/.test(n.protocol) || n.username || n.password ? "" : /\.(png|webp|svg|jpe?g|gif|avif)$/i.test(n.pathname) ? t : "";
  } catch {
    return "";
  }
}
function Ga(e, t) {
  var n;
  for (const a of ["cybercall", "holosuite-core"])
    try {
      const r = ((n = e == null ? void 0 : e.getBranding) == null ? void 0 : n.call(e, a)) ?? {}, o = lt(r.logo) || lt(r.iconImage);
      if (o) return { image: o, icon: "" };
      if (typeof r.icon == "string" && /^fa-[a-z0-9-]+$/.test(r.icon)) return { image: "", icon: r.icon };
    } catch {
    }
  return { image: lt(t), icon: "" };
}
function dt(e) {
  var a, r, o;
  let t = "";
  try {
    t = game.settings.get("cybercall", "deviceEmblem") ?? "";
  } catch {
  }
  const n = Ga((o = (r = (a = game.modules) == null ? void 0 : a.get) == null ? void 0 : r.call(a, "holosuite-core")) == null ? void 0 : o.api, t);
  e.querySelectorAll(".cybercall-hardware-emblem").forEach((i) => {
    const s = n.image || n.icon;
    if ((i.dataset.cybercallEmblem ?? "") !== s) {
      if (i.dataset.cybercallEmblem = s, i.replaceChildren(), i.classList.toggle("cybercall-custom-emblem", !!s), n.image) {
        const c = document.createElement("img");
        c.alt = "", c.src = n.image, c.addEventListener("error", () => {
          c.parentElement === i && (i.replaceChildren(), i.classList.remove("cybercall-custom-emblem"));
        }, { once: !0 }), i.append(c);
      } else if (n.icon) {
        const c = document.createElement("i");
        c.className = `fa-solid ${n.icon}`, i.append(c);
      }
    }
  });
}
function gt() {
  return String(game.settings.get(d, "phoneNumberFormat") ?? "").trim();
}
function Ct(e) {
  if (e.length > 64 || /[^\x20-\x7e]/.test(e)) return null;
  const t = [], n = (a) => {
    const r = t[t.length - 1];
    (r == null ? void 0 : r.literal) !== void 0 ? r.literal += a : t.push({ literal: a });
  };
  for (let a = 0; a < e.length; a++) {
    const r = e[a];
    if (r === "\\") {
      if (++a === e.length) return null;
      n(e[a]);
    } else r === "#" ? t.push({ pattern: /[0-9]/ }) : r === "A" ? t.push({ pattern: /[A-Za-z]/ }) : r === "*" ? t.push({ pattern: /[A-Za-z0-9]/ }) : n(r);
  }
  return t;
}
function Pa(e) {
  if (!e) return !0;
  const t = Ct(e), n = (t == null ? void 0 : t.filter((a) => a.pattern).length) ?? 0;
  return t !== null && n > 0 && n <= 32;
}
function sn(e, t) {
  if (!t) return e;
  const n = Ct(t);
  if (!n) return e;
  let a = "", r = "", o = 0, i = 0;
  for (let s = 0; s < n.length; s++) {
    const c = n[s];
    if (c.literal !== void 0) {
      r += c.literal;
      const u = n.slice(s + 1).some((l) => l.pattern);
      e.startsWith(c.literal, o) && (!u || e.length - o > c.literal.length) && (o += c.literal.length);
      continue;
    }
    for (; o < e.length && !c.pattern.test(e[o]); ) o++;
    if (o >= e.length) break;
    a += r + e[o++], r = "", i++;
  }
  return i && i === n.filter((s) => s.pattern).length && (a += r), i ? a : "";
}
function ka(e, t) {
  if (!t) return !0;
  const n = Ct(t);
  if (!n) return !1;
  const a = n.map((r) => {
    var o;
    return ((o = r.pattern) == null ? void 0 : o.source) ?? r.literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("");
  return new RegExp(`^${a}$`).test(e);
}
function Cn(e) {
  e.querySelectorAll('[data-cybercall-contacts-form] input[name="number"]').forEach((t) => {
    const n = gt(), a = Ct(n), r = a == null ? void 0 : a.some((o) => {
      var i;
      return (i = o.pattern) == null ? void 0 : i.test("A");
    });
    t.type = r ? "text" : "tel", t.inputMode = r ? "text" : n ? "numeric" : "tel", t.placeholder = n || "Phone number", t.title = n ? `Format: ${n} (# = digit, A = letter, * = letter or digit)` : "Phone number", n ? t.maxLength = (a == null ? void 0 : a.reduce((o, i) => {
      var s;
      return o + (((s = i.literal) == null ? void 0 : s.length) ?? 1);
    }, 0)) ?? n.length : t.removeAttribute("maxlength"), t.setCustomValidity(""), !t.dataset.cybercallNumberBound && (t.dataset.cybercallNumberBound = "true", t.addEventListener("input", () => {
      const o = gt();
      if (o) {
        const i = t.selectionStart ?? t.value.length, s = sn(t.value.slice(0, i), o);
        t.value = sn(t.value, o);
        const c = Math.min(s.length, t.value.length);
        t.setSelectionRange(c, c);
      }
      t.setCustomValidity("");
    }));
  });
}
const Ua = va();
function wn(e) {
  var n;
  const t = ((n = e.split("/").pop()) == null ? void 0 : n.replace(/\.[^.]+$/, "")) ?? "Custom ringtone";
  try {
    return decodeURIComponent(t);
  } catch {
    return t;
  }
}
function pe(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  return e.flatMap((n) => {
    const a = String((n == null ? void 0 : n.path) ?? "").trim();
    return !a || t.has(a) ? [] : (t.add(a), [{ label: String((n == null ? void 0 : n.label) ?? "").trim() || wn(a), path: a }]);
  });
}
function wt() {
  var n, a, r, o, i, s, c, u, l;
  const e = globalThis.foundry;
  return [
    typeof FilePicker < "u" ? FilePicker : null,
    globalThis.FilePicker,
    (r = (a = (n = e == null ? void 0 : e.applications) == null ? void 0 : n.apps) == null ? void 0 : a.FilePicker) == null ? void 0 : r.implementation,
    (i = (o = e == null ? void 0 : e.applications) == null ? void 0 : o.apps) == null ? void 0 : i.FilePicker,
    (c = (s = e == null ? void 0 : e.applications) == null ? void 0 : s.api) == null ? void 0 : c.FilePicker,
    (l = (u = e == null ? void 0 : e.appv1) == null ? void 0 : u.api) == null ? void 0 : l.FilePicker
  ].find((g) => typeof g == "function") ?? null;
}
function Ba(e, t) {
  var a;
  const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? ((a = e.element) == null ? void 0 : a[0]) ?? e.element ?? null;
  return n instanceof HTMLElement ? n : null;
}
function Da(e) {
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
class vn extends Ua {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-ringtone-settings",
      title: "CyberCall Ringtones",
      template: Ea,
      classes: ["cybercall-ringtone-settings-app"],
      width: 680,
      height: "auto",
      resizable: !0,
      closeOnSubmit: !0
    });
  }
  getData() {
    return {
      heading: "Additional Ringtones",
      description: "Add audio files that everyone can select as their personal CyberCall ringtone. The three built-in ringtones remain available.",
      emptyHeading: "No additional ringtones yet",
      addLabel: "Add another ringtone",
      footerDescription: "Saved ringtones become available to all users in this world.",
      ringtones: pe(game.settings.get(d, "customRingtones"))
    };
  }
  activateListeners(t) {
    var r;
    super.activateListeners(t);
    const n = Ba(this, t), a = n == null ? void 0 : n.querySelector("[data-ringtone-list]");
    !n || !a || ((r = n.querySelector("[data-ringtone-add]")) == null || r.addEventListener("click", () => {
      var i;
      const o = Da(a.querySelectorAll("[data-ringtone-row]").length);
      (i = a.querySelector("[data-ringtone-empty]")) == null || i.before(o);
    }), n.addEventListener("click", (o) => {
      var w, A, M, m, v, y;
      const i = o.target, s = (w = i == null ? void 0 : i.closest) == null ? void 0 : w.call(i, "[data-ringtone-remove]");
      if (s) {
        (A = s.closest("[data-ringtone-row]")) == null || A.remove();
        return;
      }
      const c = (M = i == null ? void 0 : i.closest) == null ? void 0 : M.call(i, "[data-ringtone-browse]");
      if (!c) return;
      const u = c.closest("[data-ringtone-row]"), l = u == null ? void 0 : u.querySelector("[data-ringtone-path]"), g = wt();
      if (!l || !g) {
        (v = (m = ui.notifications) == null ? void 0 : m.warn) == null || v.call(m, "Foundry FilePicker is unavailable.");
        return;
      }
      const b = new g({
        type: "audio",
        current: l.value,
        callback: (N) => {
          l.value = N;
          const E = u == null ? void 0 : u.querySelector("[data-ringtone-label]");
          E && !E.value.trim() && (E.value = wn(N));
        }
      });
      typeof b.browse == "function" ? b.browse() : (y = b.render) == null || y.call(b, !0);
    }));
  }
  async _updateObject(t) {
    var r, o;
    const a = [...t.currentTarget.querySelectorAll("[data-ringtone-row]")].map((i) => {
      var s, c;
      return {
        label: ((s = i.querySelector("[data-ringtone-label]")) == null ? void 0 : s.value) ?? "",
        path: ((c = i.querySelector("[data-ringtone-path]")) == null ? void 0 : c.value) ?? ""
      };
    });
    await game.settings.set(d, "customRingtones", pe(a)), (o = (r = ui.notifications) == null ? void 0 : r.info) == null || o.call(r, "CyberCall ringtones saved.");
  }
}
function Ra(e, t) {
  var o, i;
  const n = t.querySelector('[name="phoneNumberFormat"]'), a = t.querySelector('[name="deviceEmblem"]'), r = e.querySelector("[data-cybercall-configuration-status]");
  (o = e.querySelector("[data-cybercall-emblem-browse]")) == null || o.addEventListener("click", () => {
    var u, l;
    if (!((u = game.user) != null && u.isGM)) return;
    const s = wt();
    if (!a || !s) return;
    const c = new s({
      type: "image",
      current: a.value,
      callback: (g) => {
        a.value = g, a.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    });
    typeof c.browse == "function" ? c.browse() : (l = c.render) == null || l.call(c, !0);
  }), (i = e.querySelector("[data-cybercall-save-configuration]")) == null || i.addEventListener("click", async () => {
    var u;
    if (!((u = game.user) != null && u.isGM) || !n || !a) return;
    const s = n.value.trim();
    if (!Pa(s)) {
      n.setCustomValidity("Use # for digits, A for letters, or * for letters or digits (maximum 32 placeholders). Other printable characters are fixed text. Escape a literal placeholder with a backslash."), n.reportValidity();
      return;
    }
    const c = a.value.trim();
    if (c && !lt(c)) {
      a.setCustomValidity("Choose a PNG, WebP, SVG, JPEG, GIF, or AVIF image."), a.reportValidity();
      return;
    }
    await game.settings.set(d, "phoneNumberFormat", s), await game.settings.set(d, "deviceEmblem", c), r && (r.textContent = "Configuration saved.");
  });
  for (const s of [n, a])
    s == null || s.addEventListener("input", () => {
      s.setCustomValidity(""), r && (r.textContent = "");
    });
}
function vt(e) {
  if (!e) return;
  if (Oa(e), e.querySelector(":scope > .cybercall-hardware")) {
    dt(e);
    return;
  }
  const t = document.createElement("div");
  t.className = "cybercall-hardware", t.setAttribute("aria-hidden", "true"), t.innerHTML = `
    <span class="cybercall-hardware-crown"></span>
    <span class="cybercall-hardware-side cybercall-hardware-side-left"></span>
    <span class="cybercall-hardware-side cybercall-hardware-side-right"></span>
    <span class="cybercall-hardware-chin"></span>
    <span class="cybercall-hardware-emblem"></span>
    <span class="cybercall-hardware-light cybercall-hardware-light-tl"></span>
    <span class="cybercall-hardware-light cybercall-hardware-light-tr"></span>
    <span class="cybercall-hardware-light cybercall-hardware-light-bl"></span>
    <span class="cybercall-hardware-light cybercall-hardware-light-br"></span>`, e.append(t), dt(e);
}
function Oa(e) {
  const t = e.querySelector(":scope > .window-header");
  if (!t) return;
  if (e.classList.contains("cybercall-fullscreen")) {
    e.classList.remove("cybercall-inline-window-controls"), e.querySelectorAll("[data-cybercall-window-controls]").forEach((a) => a.replaceChildren());
    return;
  }
  let n = e.querySelector("[data-cybercall-window-controls]");
  if (!n) {
    const a = e.querySelector(".cybercall-console-nav, .cybercall-device-status, .cybercall-call-brand, .cybercall-mode-tabs");
    if (!a) return;
    n = document.createElement("span"), n.dataset.cybercallWindowControls = "", a.append(n);
  }
  if (e.classList.add("cybercall-inline-window-controls"), !n.childElementCount)
    for (const [a, r, o, i] of [
      ["toggle", '[data-action="toggleControls"], [data-action="toggle-controls"]', "Toggle Controls", "fa-ellipsis-vertical"],
      ["close", '[data-action="close"], .close', "Close Window", "fa-xmark"]
    ]) {
      const s = t.querySelector(r);
      if (!s || s.hidden || s.classList.contains("hidden")) continue;
      const c = document.createElement("button");
      c.type = "button", c.dataset.cybercallWindowAction = a, a === "toggle" && (c.classList.add("header-control"), c.dataset.action = "toggleControls"), c.setAttribute("aria-label", o), c.title = o, c.innerHTML = `<i class="fa-solid ${i}" aria-hidden="true"></i>`, c.addEventListener("click", (u) => {
        if (u.preventDefault(), a === "toggle") {
          const l = e.querySelector(":scope > .controls-dropdown");
          if (l) {
            const g = e.getBoundingClientRect(), b = c.getBoundingClientRect();
            l.style.top = `${(b.bottom - g.top) / (g.height / e.offsetHeight) + 4}px`, l.style.right = `${(g.right - b.right) / (g.width / e.offsetWidth)}px`;
          }
          return;
        }
        u.stopPropagation(), s.click();
      }), n.append(c);
    }
}
function Bt(e) {
  var c, u;
  const t = new FormData(e), n = (c = game.actors) == null ? void 0 : c.get(t.get("actorId")), a = String(t.get("image") ?? "").trim() || (n == null ? void 0 : n.img) || "", r = String(t.get("callerName") ?? "").trim() || (n == null ? void 0 : n.name) || "UNKNOWN CALLER", o = t.getAll("targetUserIds").map((l) => String(l)).filter(Boolean), i = new Map((((u = game.users) == null ? void 0 : u.contents) ?? []).map((l) => [l.id, l])), s = o.map((l) => X(i.get(l)) || l);
  return se({
    callerName: r,
    subtitle: String(t.get("subtitle") ?? "").trim(),
    image: a,
    message: String(t.get("message") ?? "").trim(),
    signal: t.get("signal"),
    variant: String(t.get("variant") ?? K.variant),
    fullscreen: t.get("fullscreen") === "on",
    ringing: t.get("ringing") === "on",
    targetUserIds: o,
    targetUserNames: s
  });
}
function ot(e) {
  const t = Bt(e), n = e.querySelector("[data-cybercall-signal-output]");
  n && (n.textContent = `${t.signal}%`);
  const a = e.querySelector("[data-cybercall-live-preview]"), r = a == null ? void 0 : a.querySelector(".cybercall-panel");
  if (!r) return;
  a.classList.toggle("cybercall-preview-wide", t.fullscreen), vt(a);
  for (const u of ["standard", "emergency", "corrupted"])
    r.classList.toggle(`cybercall-${u}`, t.variant === u);
  r.classList.toggle("cybercall-broadcast", t.fullscreen), r.classList.toggle("cybercall-ringing-panel", t.ringing), r.style.setProperty("--cybercall-signal", `${t.signal}%`), r.dataset.cybercallSignalQuality = t.signalQuality, r.style.setProperty("--cybercall-glitch-shift", `${t.glitchShift}px`), r.style.setProperty("--cybercall-glitch-interval", `${t.glitchInterval}s`), r.querySelector("[data-cybercall-preview-name]").textContent = t.callerName;
  const o = r.querySelector("[data-cybercall-preview-subtitle]");
  o && (o.textContent = t.subtitle), r.querySelector("[data-cybercall-preview-message]").textContent = t.message, r.querySelector("[data-cybercall-preview-signal]").textContent = `${t.signal}%`;
  const i = r.querySelector("[data-cybercall-preview-status]");
  i.querySelector("span").textContent = t.kicker, i.querySelector("i").className = `fa-solid ${t.isEmergency ? "fa-triangle-exclamation" : "fa-satellite-dish"}`;
  const s = r.querySelector("[data-cybercall-preview-portrait]"), c = s.querySelector("img");
  if (t.image) {
    const u = c ?? document.createElement("img");
    u.getAttribute("src") !== t.image && u.setAttribute("src", t.image), u.alt = t.callerName, c || s.replaceChildren(u);
  } else {
    const u = s.querySelector(".cybercall-initials") ?? document.createElement("span");
    u.className = "cybercall-initials", u.textContent = t.initials, u.parentNode !== s && s.replaceChildren(u);
  }
}
function Ft() {
  var n, a;
  const e = ((n = game.user) == null ? void 0 : n.getFlag(d, "messageSound")) ?? {}, t = (a = game.user) != null && a.isGM || game.settings.get(d, "shareMessageSounds") !== !1 ? pe(game.settings.get(d, "customMessageSounds")) : [];
  return pe([
    ...e.path ? [{ label: e.label || "My uploaded sound", path: e.path }] : [],
    ...t
  ]);
}
function In() {
  var t, n;
  const e = (n = (t = game.user) == null ? void 0 : t.getFlag(d, "messageSound")) == null ? void 0 : n.selected;
  return Ft().some((a) => a.path === e) ? e : "";
}
function La() {
  const e = In();
  return [
    { value: "", label: "Built-in notification tone", selected: !e },
    ...Ft().map(({ path: t, label: n }) => ({ value: t, label: n, selected: t === e }))
  ];
}
async function xa(e) {
  if (e && !Ft().some((n) => n.path === e)) return;
  const t = game.user.getFlag(d, "messageSound") ?? {};
  await game.user.setFlag(d, "messageSound", { ...t, selected: e });
}
class Fa extends vn {
  static get defaultOptions() {
    return { ...super.defaultOptions, id: "cybercall-message-sound-library", title: "CyberCall Message Notification Sounds" };
  }
  getData() {
    return {
      heading: "Additional Message Notification Sounds",
      description: "Browse or upload audio files, give them names, and save the library. Players choose their notification sound in CyberCall’s Settings screen.",
      emptyHeading: "No additional notification sounds yet",
      addLabel: "Add another notification sound",
      footerDescription: "The built-in notification tone remains available.",
      managesNotificationSounds: !0,
      shareSounds: game.settings.get(d, "shareMessageSounds") !== !1,
      ringtones: pe(game.settings.get(d, "customMessageSounds"))
    };
  }
  async _updateObject(t) {
    var r, o, i, s;
    if (!((r = game.user) != null && r.isGM)) return;
    const n = t.currentTarget, a = [...n.querySelectorAll("[data-ringtone-row]")].map((c) => {
      var u, l;
      return {
        label: ((u = c.querySelector("[data-ringtone-label]")) == null ? void 0 : u.value) ?? "",
        path: ((l = c.querySelector("[data-ringtone-path]")) == null ? void 0 : l.value) ?? ""
      };
    });
    await game.settings.set(d, "customMessageSounds", pe(a)), await game.settings.set(d, "shareMessageSounds", ((o = n.querySelector("[data-share-message-sounds]")) == null ? void 0 : o.checked) === !0), (s = (i = ui.notifications) == null ? void 0 : i.info) == null || s.call(i, "CyberCall notification sound library saved.");
  }
}
function xe(e) {
  var n;
  if ((n = foundry == null ? void 0 : foundry.utils) != null && n.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
function D(e, t = "") {
  return String(e ?? t).trim();
}
function Ie(e) {
  return [...new Set(e.map((t) => D(t)).filter(Boolean))];
}
function _a() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function Sn(e) {
  const t = D(e, "cybercall");
  let n = 0;
  for (let a = 0; a < t.length; a += 1)
    n = (n << 5) - n + t.charCodeAt(a) | 0;
  return `tone-${Math.abs(n) % 8 + 1}`;
}
function on(e, t) {
  return ["direct", ...[e, t].sort()].join(":");
}
function qa() {
  return `msg-${Me()}`;
}
function Va(e = Me()) {
  return `group:${D(e)}`;
}
function We(e, t = ((a) => (a = game == null ? void 0 : game.user) == null ? void 0 : a.id)(), n = {}) {
  const r = q(e), o = D(n.senderNumber) || D(n.senderActorId), i = o ? `contact:${o}` : `user:${D(t, "unknown")}`;
  if (e != null && e.userId)
    return on(i, `user:${D(e.userId)}`);
  const s = r.number || r.actorId || r.id || r.name;
  return on(i, `contact:${s}`);
}
function It(e = {}) {
  var t;
  return {
    id: D(e.id) || qa(),
    threadId: D(e.threadId) || We({ number: ((t = e.recipientNumbers) == null ? void 0 : t[0]) ?? e.senderNumber }),
    senderUserId: D(e.senderUserId),
    senderActorId: D(e.senderActorId),
    senderName: D(e.senderName, "Unknown Sender"),
    senderNumber: D(e.senderNumber),
    senderImage: D(e.senderImage),
    recipientUserIds: Ie(e.recipientUserIds ?? []),
    recipientActorIds: Ie(e.recipientActorIds ?? []),
    recipientNumbers: Ie(e.recipientNumbers ?? []),
    contactName: D(e.contactName),
    contactImage: D(e.contactImage),
    contactUserId: D(e.contactUserId),
    contactManagedByGM: e.contactManagedByGM === !0,
    contactIsNpc: e.contactIsNpc === !0,
    body: D(e.body),
    messageType: D(e.messageType, "text") || "text",
    eventType: D(e.eventType),
    conversationType: D(e.conversationType, e.groupId ? "group" : "direct") || "direct",
    groupId: D(e.groupId),
    groupName: D(e.groupName),
    groupMemberUserIds: Ie(e.groupMemberUserIds ?? []),
    groupMemberNames: Ie(e.groupMemberNames ?? []),
    groupNpcMembers: Array.isArray(e.groupNpcMembers) ? e.groupNpcMembers.map((n) => ({
      actorId: D(n == null ? void 0 : n.actorId),
      name: D(n == null ? void 0 : n.name),
      number: D(n == null ? void 0 : n.number)
    })).filter((n) => n.actorId && n.name) : [],
    createdAt: D(e.createdAt) || _a(),
    chatMessageId: D(e.chatMessageId),
    schemaVersion: Number(e.schemaVersion ?? yn)
  };
}
function An(e, t = [], n = "", a = {}) {
  const r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  for (const s of t) {
    const c = q(s), u = { ...c, userId: s == null ? void 0 : s.userId, userIds: (s == null ? void 0 : s.userIds) ?? c.userIds };
    c.number && r.set(c.number, u), s != null && s.userId && o.set(String(s.userId), u);
  }
  const i = /* @__PURE__ */ new Map();
  for (const s of e.map(It).filter((c) => c.body)) {
    const c = i.get(s.threadId) ?? [];
    c.push(s), i.set(s.threadId, c);
  }
  return [...i.entries()].map(([s, c]) => {
    var he, Pe, ue, ke, Ye, Qe, Ze, Xe, et, tt, nt, at, rt, st, Ue, Ce, Be, De, h, T;
    const u = c.sort((p, f) => p.createdAt.localeCompare(f.createdAt)), l = u[u.length - 1] ?? null, g = [...u].reverse().find((p) => p.conversationType === "group" || p.groupId), b = !!g, w = (g == null ? void 0 : g.groupId) || (b ? s.replace(/^group:/, "") : ""), A = (g == null ? void 0 : g.groupName) || (b ? "Group Chat" : ""), M = (g == null ? void 0 : g.groupNpcMembers) ?? [], m = M.length ? g.groupMemberUserIds : g ? Ie([g.senderUserId, ...g.recipientUserIds]) : [], v = m.length + M.length, y = (g == null ? void 0 : g.groupMemberNames) ?? [], N = y.length ? y : m.map((p) => {
      var f, S;
      return X((S = (f = game.users) == null ? void 0 : f.get) == null ? void 0 : S.call(f, p));
    }).filter(Boolean), E = (l == null ? void 0 : l.senderUserId) === ((he = game == null ? void 0 : game.user) == null ? void 0 : he.id) ? (Pe = l == null ? void 0 : l.recipientUserIds) == null ? void 0 : Pe.find((p) => {
      var f;
      return p !== ((f = game == null ? void 0 : game.user) == null ? void 0 : f.id);
    }) : l == null ? void 0 : l.senderUserId, k = (l == null ? void 0 : l.senderUserId) === ((ue = game == null ? void 0 : game.user) == null ? void 0 : ue.id) ? ((ke = l == null ? void 0 : l.recipientNumbers) == null ? void 0 : ke[0]) || "" : (l == null ? void 0 : l.senderNumber) || ((Ye = l == null ? void 0 : l.recipientNumbers) == null ? void 0 : Ye[0]) || "", P = l != null && l.contactName && !(l != null && l.contactUserId) && (l.contactIsNpc || l.contactManagedByGM) ? {
      id: `contact-${((Qe = l.recipientNumbers) == null ? void 0 : Qe[0]) || l.senderNumber || s}`,
      name: l.contactName,
      number: ((Ze = l.recipientNumbers) == null ? void 0 : Ze[0]) || l.senderNumber || "",
      image: l.contactImage || "",
      actorId: ((Xe = l.recipientActorIds) == null ? void 0 : Xe[0]) ?? l.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: ne(l.contactName)
    } : null, R = (l == null ? void 0 : l.senderUserId) !== ((et = game == null ? void 0 : game.user) == null ? void 0 : et.id) && (l != null && l.senderNumber) && (l != null && l.contactName) ? {
      id: `contact-${l.senderNumber || s}`,
      name: l.contactName,
      number: l.senderNumber,
      image: l.contactImage || "",
      actorId: l.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: ne(l.contactName)
    } : null, U = b ? null : [...u].reverse().find(
      (p) => {
        var f, S, B;
        return ((B = (S = (f = game.users) == null ? void 0 : f.get) == null ? void 0 : S.call(f, p.senderUserId)) == null ? void 0 : B.isGM) === !0 && p.contactIsNpc && p.senderNumber && p.senderName === p.contactName && p.contactUserId;
      }
    ), z = U ? q({
      id: `contact-${U.senderNumber}`,
      name: U.senderName,
      number: U.senderNumber,
      image: U.senderImage,
      actorId: U.senderActorId,
      managedByGM: !0,
      isNpc: !0
    }) : null, O = (b ? {
      id: `group-${w || s}`,
      name: A,
      number: `${v} member${v === 1 ? "" : "s"}`,
      image: "",
      actorId: "",
      userId: "",
      userIds: m.filter((p) => {
        var f;
        return p !== ((f = game == null ? void 0 : game.user) == null ? void 0 : f.id);
      }),
      managedByGM: !1,
      isNpc: !1,
      isGroup: !0,
      initials: ne(A)
    } : null) ?? P ?? z ?? R ?? o.get(E) ?? r.get(k) ?? {
      id: `contact-${k || s}`,
      name: (l == null ? void 0 : l.contactName) || ((l == null ? void 0 : l.senderUserId) === ((tt = game == null ? void 0 : game.user) == null ? void 0 : tt.id) ? k || "Unknown Contact" : (l == null ? void 0 : l.senderName) || k || "Unknown Contact"),
      number: k,
      image: (l == null ? void 0 : l.contactImage) || "",
      actorId: ((nt = l == null ? void 0 : l.recipientActorIds) == null ? void 0 : nt[0]) ?? "",
      userId: "",
      userIds: [],
      managedByGM: !!(l != null && l.contactName || (at = l == null ? void 0 : l.recipientActorIds) != null && at[0]),
      isNpc: !!(l != null && l.contactName || (rt = l == null ? void 0 : l.recipientActorIds) != null && rt[0]),
      initials: ne((l == null ? void 0 : l.contactName) || (l == null ? void 0 : l.senderName) || k)
    }, L = b ? null : [...u].reverse().find(
      (p) => p.senderUserId === E && p.senderImage
    ), ee = b ? null : [...u].reverse().find((p) => {
      var S, B;
      const f = (B = (S = game.users) == null ? void 0 : S.get) == null ? void 0 : B.call(S, p.senderUserId);
      return p.senderUserId && (f == null ? void 0 : f.isGM) !== !0 && !p.contactUserId && !!p.contactName && (p.contactIsNpc || p.contactManagedByGM);
    }) ?? null, _ = ((st = game == null ? void 0 : game.user) == null ? void 0 : st.isGM) === !0 ? ee : null, ce = ((Ue = game == null ? void 0 : game.user) == null ? void 0 : Ue.isGM) === !0 ? U == null ? void 0 : U.contactUserId : "", re = o.get(ce), Ee = _ || ce ? `Replying as: ${O.name}` : "", x = _ ? o.get(_.senderUserId) : null, J = (_ == null ? void 0 : _.senderName) || (x == null ? void 0 : x.name) || (re == null ? void 0 : re.name) || (ce ? X((Be = (Ce = game.users) == null ? void 0 : Ce.get) == null ? void 0 : Be.call(Ce, ce)) : "") || O.name || (l == null ? void 0 : l.senderName) || "Unknown Contact", le = _ ? (x == null ? void 0 : x.number) || `@${_.senderName}` : O.number || (l == null ? void 0 : l.senderNumber) || "", te = !b && ((De = game == null ? void 0 : game.user) != null && De.isGM) ? (_ == null ? void 0 : _.senderUserId) || ce : "", Ge = te ? ne(J) : O.initials || ne(O.name || (l == null ? void 0 : l.senderName)), Ke = te ? (_ == null ? void 0 : _.senderImage) || (x == null ? void 0 : x.image) || (re == null ? void 0 : re.image) || ze((T = (h = game.users) == null ? void 0 : h.get) == null ? void 0 : T.call(h, te)) || "" : (_ == null ? void 0 : _.senderImage) || (x == null ? void 0 : x.image) || (L == null ? void 0 : L.senderImage) || O.image || "", Je = a[s] ?? "", ve = u.filter(
      (p) => {
        var f;
        return p.senderUserId !== ((f = game == null ? void 0 : game.user) == null ? void 0 : f.id) && p.createdAt > Je;
      }
    );
    return {
      id: s,
      title: J,
      subtitle: /^NPC:/i.test(le) ? "Direct message" : le,
      initials: Ge,
      image: Ke,
      avatarTone: Sn(b ? w || s : te || O.userId || O.number || s),
      routeLabel: Ee,
      hasRouteLabel: !!Ee,
      isNpcRouted: !!(ee || U),
      contact: O,
      messages: u.map((p) => {
        var f;
        return {
          ...p,
          isMine: p.senderUserId === ((f = game == null ? void 0 : game.user) == null ? void 0 : f.id),
          isEvent: p.messageType !== "text"
        };
      }),
      lastMessage: l,
      lastPreview: (l == null ? void 0 : l.body) ?? "",
      updatedAt: (l == null ? void 0 : l.createdAt) ?? "",
      unread: ve.length > 0,
      unreadCount: ve.length,
      active: s === n,
      isGroup: b,
      groupId: w,
      groupName: A,
      groupMemberUserIds: m,
      groupMemberNames: N,
      groupNpcMembers: M
    };
  }).sort((s, c) => c.updatedAt.localeCompare(s.updatedAt));
}
const ja = 100, za = /* @__PURE__ */ new Set(["outgoing", "connected", "ended", "missed"]);
function Nn(e) {
  var n, a;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[d]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, d, "message"));
  return (t == null ? void 0 : t.kind) === oe ? t : t == null ? void 0 : t.message;
}
function _t(e) {
  const t = Nn(e);
  return (t == null ? void 0 : t.kind) === oe && t.messageType === "event" && za.has(t.eventType);
}
function Wa(e) {
  return e.filter(_t).map((t) => {
    var n;
    return {
      id: t.id,
      time: Date.parse((n = Nn(t)) == null ? void 0 : n.createdAt) || Number(t.timestamp) || 0
    };
  }).sort((t, n) => n.time - t.time || String(n.id).localeCompare(String(t.id))).slice(ja).map((t) => t.id);
}
const Dt = "conversationArchive", mt = "pendingMessages", pt = "messageArchiveMigrated", fe = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.flags) == null ? void 0 : t[d]) ?? {};
}, St = (e) => typeof fe(e)[Dt] == "string", Mn = (e) => St(e == null ? void 0 : e.parent) ? fe(e).message : null, Rt = () => {
  var e;
  return (((e = game.journal) == null ? void 0 : e.contents) ?? []).filter(St);
}, $n = (e) => [.../* @__PURE__ */ new Set([e.senderUserId, ...e.recipientUserIds])].sort();
function ft(e) {
  let t = 2166136261, n = 5381;
  for (let a = 0; a < e.length; a++)
    t = Math.imul(t ^ e.charCodeAt(a), 16777619), n = Math.imul(n, 33) ^ e.charCodeAt(a);
  return [t, n].map((a) => (a >>> 0).toString(16).padStart(8, "0")).join("");
}
function me() {
  var e, t;
  return ((e = game.user) == null ? void 0 : e.isGM) && ((t = game.users.activeGM) == null ? void 0 : t.id) === game.user.id;
}
function qt(e) {
  var s, c, u, l;
  const t = fe(e), n = t.kind === oe ? t : t.message;
  if ((n == null ? void 0 : n.kind) !== oe || t.archiveNotice) return null;
  const a = ((s = e.author) == null ? void 0 : s.id) ?? ((c = e.user) == null ? void 0 : c.id) ?? e.user ?? ((u = e._source) == null ? void 0 : u.author) ?? ((l = e._source) == null ? void 0 : l.user);
  if (!Array.isArray(e.whisper)) return null;
  const r = new Set(e.whisper.map((g) => (g == null ? void 0 : g.id) ?? g));
  if (!a || a !== n.senderUserId || !r.size || !Array.isArray(n.recipientUserIds)) return null;
  const o = /* @__PURE__ */ new Set([a, ...n.recipientUserIds]);
  if (n.recipientUserIds.some((g) => g !== a && !r.has(g)) || [...r].some((g) => !o.has(g))) return null;
  const i = new Date(n.createdAt || e.timestamp);
  if (!Number.isFinite(i.getTime()) || !n.threadId || !n.body) return null;
  for (const g of ["recipientActorIds", "recipientNumbers", "groupMemberUserIds", "groupMemberNames"])
    if (n[g] != null && !Array.isArray(n[g])) return null;
  return It({ ...n, id: n.id || e.id, chatMessageId: e.id, createdAt: i.toISOString() });
}
function Ha() {
  return Rt().flatMap((e) => e.pages.contents.map(Mn).filter(Boolean));
}
async function Tn(e, t, n) {
  const a = $n(e), r = JSON.stringify([e.threadId, a]), o = ft(r);
  let i = game.journal.get(o);
  if (!i) {
    const l = Object.fromEntries(a.map((g) => [g, 2]));
    i = await game.journal.documentClass.create({
      _id: o,
      name: "CyberCall Conversation",
      ownership: { ...l, default: 0 },
      flags: { [d]: { [Dt]: r } }
    }, { keepId: !0, renderSheet: !1 });
  }
  if (fe(i)[Dt] !== r) throw new Error("CyberCall journal ID conflict.");
  const s = ft(t), c = i.pages.get(s);
  if (c) {
    if (fe(c).origin !== t) throw new Error("CyberCall page ID conflict.");
    return !1;
  }
  const [u] = await i.createEmbeddedDocuments("JournalEntryPage", [{
    _id: s,
    name: "CyberCall Message",
    type: "text",
    text: { content: `<p>${xe(e.body)}</p>`, format: 1 },
    flags: { [d]: { origin: t, message: { ...e, kind: oe } } }
  }], { keepId: !0, renderSheet: !1, cybercallMigration: n });
  if (!u) throw new Error("Foundry did not save the CyberCall message.");
  return _t(u) && (bt = !0), !0;
}
async function Ka(e) {
  var r, o, i, s, c;
  const t = ft(e.id), n = game.user;
  try {
    await n.setFlag(d, `${mt}.${t}`, e);
  } catch (u) {
    throw (o = (r = ui.notifications) == null ? void 0 : r.error) == null || o.call(r, "CyberCall could not save the message to your outbox."), u;
  }
  return me() && await _e(), ((i = n.getFlag(d, mt)) == null ? void 0 : i[t]) && !game.users.activeGM && (e.messageType === "text" || e.eventType === "group-created") && ((c = (s = ui.notifications) == null ? void 0 : s.info) == null || c.call(s, "Message queued. A GM will deliver it when they connect.")), e;
}
async function Ja() {
  var t;
  if (game.settings.get(d, pt)) return;
  const e = [];
  for (const n of game.messages.contents) {
    const a = fe(n);
    if (!me()) return;
    if (a.archiveNotice || a.kind !== oe && ((t = a.message) == null ? void 0 : t.kind) !== oe) continue;
    const r = qt(n);
    r ? await Tn(r, `chat:${n.id}`, !0) : e.push(n.id);
  }
  me() && (await game.settings.set(d, pt, !0), bt = !0, e.length && (console.warn("CyberCall could not validate these legacy chat records:", e), ui.notifications.warn(`CyberCall left ${e.length} legacy chat records in chat for GM review. Their IDs are in the console.`)));
}
async function Ya(e, t, n) {
  if ((n == null ? void 0 : n.senderUserId) !== e.id || !n.id || ft(n.id) !== t || !Array.isArray(n.recipientUserIds) || !n.body || !n.threadId) return;
  const a = It({ ...n, chatMessageId: "" }), r = JSON.stringify([e.id, a.id]), o = await Tn(a, r, !1);
  if (await e.unsetFlag(d, `${mt}.${t}`), !!o)
    try {
      const i = game.messages.documentClass;
      await i.create({
        speaker: i.getSpeaker({ alias: a.senderName }),
        whisper: $n(a),
        content: `<div class="cybercall-chat-card"><strong>${xe(a.senderName)}</strong><p>${xe(a.body)}</p><button type="button" data-cybercall-open-thread data-cybercall-thread-id="${xe(a.threadId)}">Open CyberCall</button></div>`,
        flags: { [d]: { archiveNotice: !0, archiveOrigin: r } }
      });
    } catch (i) {
      console.warn("CyberCall saved the message but could not create its chat card.", i);
    }
}
async function Qa() {
  const e = Rt().flatMap((r) => r.pages.contents), t = new Set(Wa(e.map((r) => ({
    id: r.uuid,
    flags: r.flags
  }))));
  if (!t.size) return;
  const n = new Set(e.filter((r) => t.has(r.uuid)).map((r) => fe(r).origin)), a = game.messages.contents.filter((r) => {
    const o = fe(r);
    return o.archiveNotice ? n.has(o.archiveOrigin) : n.has(`chat:${r.id}`) && _t(r) && qt(r);
  });
  a.length && await game.messages.documentClass.deleteDocuments(a.map((r) => r.id));
  for (const r of Rt()) {
    if (!me()) return;
    const o = r.pages.contents.filter((i) => t.has(i.uuid)).map((i) => i.id);
    o.length && await r.deleteEmbeddedDocuments("JournalEntryPage", o);
  }
}
let bt = !0, Re, Ut = !1;
function _e() {
  return me() ? (Ut = !0, Re || (Re = Promise.resolve().then(async () => {
    for (; Ut && me(); ) {
      Ut = !1, await Ja();
      for (const e of game.users.contents) {
        const t = e.getFlag(d, mt) ?? {};
        for (const [n, a] of Object.entries(t)) {
          if (!me()) return;
          try {
            await Ya(e, n, a);
          } catch (r) {
            console.warn("CyberCall will retry the queued message.", r);
          }
        }
      }
      bt && me() && (await Qa(), bt = !1);
    }
  }).catch((e) => console.warn("CyberCall archive maintenance will retry.", e)).finally(() => {
    Re = void 0;
  }), Re)) : Promise.resolve();
}
const qe = "playerContactDirectory", $e = "playerPersonalContactDirectory";
function Za(e) {
  var n, a, r, o;
  const t = ((n = e.getFlag(d, qe)) == null ? void 0 : n.playerId) ?? ((a = e.getFlag(d, $e)) == null ? void 0 : a.playerId);
  return !!(t && ((r = game.user) != null && r.isGM || ((o = game.user) == null ? void 0 : o.id) === t));
}
function At(e) {
  var t, n, a, r;
  return !e || !((t = game.user) != null && t.isGM) && ((n = game.user) == null ? void 0 : n.id) !== e ? null : ((r = (a = game.journal) == null ? void 0 : a.contents) == null ? void 0 : r.find(
    (o) => {
      var i;
      return ((i = o.getFlag(d, $e)) == null ? void 0 : i.playerId) === e && o.testUserPermission(game.user, "OBSERVER");
    }
  )) ?? null;
}
function Te(e) {
  var n;
  const t = (n = At(e)) == null ? void 0 : n.getFlag(d, $e);
  return t != null && t.initialized ? Object.values(t.contacts ?? {}).map(q).filter((a) => a.name && a.number).sort((a, r) => a.name.localeCompare(r.name)) : null;
}
function En(e) {
  const t = new Map((Te(e) ?? []).map((n) => [n.id, n]));
  for (const n of Nt(e)) t.set(n.id, n);
  return [...t.values()].sort((n, a) => n.name.localeCompare(a.name));
}
let Oe = null;
async function Vt() {
  var n, a;
  if (!((n = game.user) != null && n.isGM)) return;
  const e = (((a = game.users) == null ? void 0 : a.contents) ?? []).filter((r) => r.isGM && r.active).sort((r, o) => r.id.localeCompare(o.id))[0];
  if (e && e.id !== game.user.id) return;
  if (Oe) return Oe;
  const t = CONST.DOCUMENT_OWNERSHIP_LEVELS;
  Oe = (async () => {
    var r;
    for (const o of ((r = game.users) == null ? void 0 : r.contents) ?? [])
      o.isGM || At(o.id) || await game.journal.documentClass.create({
        name: `CyberCall Personal Contacts · ${o.name}`,
        ownership: { default: t.NONE, [o.id]: t.OWNER },
        flags: { [d]: { [$e]: { playerId: o.id, initialized: !1, contacts: {} } } }
      }, { render: !1 });
  })();
  try {
    await Oe;
  } finally {
    Oe = null;
  }
}
async function Gn(e, t, n = null) {
  const a = At(e);
  if (!a || !t) return !1;
  const r = `flags.${d}.${$e}`;
  return await a.update({
    [`${r}.initialized`]: !0,
    [`${r}.contacts.${n ? t : `-=${t}`}`]: n
  }, { render: !1 }), !0;
}
async function Pn(e, t) {
  const n = At(e);
  if (!n) return !1;
  const a = Te(e) ?? [], r = `flags.${d}.${$e}`, o = { [`${r}.initialized`]: !0 }, i = new Set(t.map((s) => s.id));
  for (const s of t) o[`${r}.contacts.${s.id}`] = q(s);
  for (const s of a) i.has(s.id) || (o[`${r}.contacts.-=${s.id}`] = null);
  return await n.update(o, { render: !1 }), !0;
}
function kn(e) {
  var t, n, a, r;
  return !e || !((t = game.user) != null && t.isGM) && ((n = game.user) == null ? void 0 : n.id) !== e ? null : ((r = (a = game.journal) == null ? void 0 : a.contents) == null ? void 0 : r.find(
    (o) => {
      var i;
      return ((i = o.getFlag(d, qe)) == null ? void 0 : i.playerId) === e && o.testUserPermission(game.user, "OBSERVER");
    }
  )) ?? null;
}
function Nt(e) {
  var n, a;
  const t = ((a = (n = kn(e)) == null ? void 0 : n.getFlag(d, qe)) == null ? void 0 : a.contacts) ?? {};
  return Object.values(t).map(q).filter((r) => r.name && r.number).sort((r, o) => r.name.localeCompare(o.name));
}
async function Un(e, t, n = null) {
  var s, c;
  if (!((s = game.user) != null && s.isGM)) return;
  const a = (c = game.users) == null ? void 0 : c.get(e);
  if (!a || a.isGM) return;
  const r = kn(e);
  if (!r) {
    if (!n) return;
    const u = game.journal.documentClass, l = CONST.DOCUMENT_OWNERSHIP_LEVELS;
    await u.create({
      name: `CyberCall Contacts · ${a.name}`,
      ownership: { default: l.NONE, [e]: l.OBSERVER },
      flags: { [d]: { [qe]: { playerId: e, contacts: { [t]: n } } } }
    }, { render: !1 });
    return;
  }
  const o = `flags.${d}.${qe}.contacts`, i = n ? t : `-=${t}`;
  await r.update({ [`${o}.${i}`]: n }, { render: !1 });
}
function Xa() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => t.id);
}
function Bn(e) {
  return [...new Set(e.map((t) => String(t ?? "").trim()).filter(Boolean))];
}
function er(e) {
  var a, r;
  const t = String(((a = game.user) == null ? void 0 : a.id) ?? "").trim();
  return t ? e.senderUserId === t || e.recipientUserIds.includes(t) ? !0 : ((r = game.user) == null ? void 0 : r.isGM) === !0 ? !e.contactUserId && (e.contactManagedByGM || e.contactIsNpc) ? !0 : game.settings.get(d, "gmViewPlayerMessages") === !0 : !1 : !1;
}
function tr(e) {
  const t = Array.isArray(e == null ? void 0 : e.userIds) ? e.userIds : e != null && e.userId ? [e.userId] : [], n = Bn(t);
  return n.length ? n : Xa();
}
function nr(e) {
  return !!(e != null && e.userId || Array.isArray(e == null ? void 0 : e.userIds) && e.userIds.length);
}
function ar() {
  const e = Ha();
  if (!game.settings.get(d, pt)) {
    const t = new Set(e.map((n) => n.chatMessageId));
    for (const n of game.messages.contents) {
      if (t.has(n.id)) continue;
      const a = qt(n);
      a && e.push(a);
    }
  }
  return e.filter(er);
}
async function jt(e, t, n = {}) {
  var A;
  const a = q(e), r = String(t ?? "").trim();
  if (!r) return null;
  const o = game.user, i = n.recipientUserIds ? Bn(n.recipientUserIds) : tr(e), s = !nr(e), c = n.conversationType === "group", u = String(n.threadId ?? We(e, o == null ? void 0 : o.id, n)), l = String(n.senderName ?? "").trim() || X(o, "Unknown Sender"), g = String(n.senderActorId ?? ((A = o == null ? void 0 : o.character) == null ? void 0 : A.id) ?? "").trim(), b = String(n.senderNumber ?? "").trim(), w = It({
    threadId: u,
    senderUserId: (o == null ? void 0 : o.id) ?? "",
    senderActorId: g,
    senderName: l,
    senderNumber: b,
    senderImage: String(n.senderImage ?? ze(o)).trim(),
    recipientUserIds: i,
    recipientActorIds: a.actorId ? [a.actorId] : [],
    recipientNumbers: n.recipientNumbers ?? (a.number ? [a.number] : []),
    contactName: String(n.contactName ?? a.name ?? ""),
    contactImage: String(n.contactImage ?? a.image ?? ""),
    contactUserId: String(n.contactUserId ?? a.userId ?? ""),
    contactManagedByGM: !c && (n.contactManagedByGM ?? (a.managedByGM === !0 || s)),
    contactIsNpc: !c && (n.contactIsNpc ?? (a.isNpc === !0 || s)),
    body: r,
    messageType: String(n.messageType ?? "text"),
    eventType: String(n.eventType ?? ""),
    conversationType: String(n.conversationType ?? "direct"),
    groupId: String(n.groupId ?? ""),
    groupName: String(n.groupName ?? ""),
    groupMemberUserIds: n.groupMemberUserIds ?? [],
    groupMemberNames: n.groupMemberNames ?? [],
    groupNpcMembers: n.groupNpcMembers ?? [],
    schemaVersion: yn
  });
  return Ka(w);
}
async function rr(e, t, n = {}) {
  return jt(e, t, {
    ...n,
    messageType: n.messageType ?? "event"
  });
}
let C = null, I = null, Y = null, Se = null, Z = null, de = "personal", Dn = "", V = "", Q = !1, W = !1, ge = null, Ot = 0, Ae = null;
function sr() {
  var e, t, n, a, r, o, i, s;
  return se({
    callerName: ((e = C == null ? void 0 : C.callData) == null ? void 0 : e.callerName) ?? K.callerName,
    subtitle: ((t = C == null ? void 0 : C.callData) == null ? void 0 : t.subtitle) ?? K.subtitle,
    image: ((n = C == null ? void 0 : C.callData) == null ? void 0 : n.image) ?? "",
    message: ((a = C == null ? void 0 : C.callData) == null ? void 0 : a.message) ?? K.message,
    signal: ((r = C == null ? void 0 : C.callData) == null ? void 0 : r.signal) ?? game.settings.get(d, "defaultSignal"),
    variant: ((o = C == null ? void 0 : C.callData) == null ? void 0 : o.variant) ?? "standard",
    fullscreen: ((i = C == null ? void 0 : C.callData) == null ? void 0 : i.fullscreen) ?? !1,
    ringing: ((s = C == null ? void 0 : C.callData) == null ? void 0 : s.ringing) ?? !0
  });
}
function ir() {
  var e;
  return (((e = game.actors) == null ? void 0 : e.contents) ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    img: t.img ?? ""
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function Rn() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => !t.isGM).map((t) => ({
    id: t.id,
    name: X(t, "Unknown Player"),
    active: t.active === !0
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function or() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => {
    var n;
    return !t.isGM && t.id !== ((n = game.user) == null ? void 0 : n.id);
  }).map((t) => ({
    id: String(t.id),
    name: X(t, "Unknown Player"),
    active: t.active === !0
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function cr(e, t) {
  var o, i, s;
  const n = /* @__PURE__ */ new Map(), a = Ve(), r = [...e, ...t.filter((c) => !c.isGroup && !c.contact.userId && (c.contact.isNpc || c.isNpcRouted)).map((c) => {
    var u;
    return {
      ...c.contact,
      actorId: (u = a[c.id]) == null ? void 0 : u.actorId
    };
  })];
  for (const c of r) {
    const { actorId: u, name: l, number: g } = c;
    !u || !l || c.userId || n.has(u) || (o = game.user) != null && o.isGM && !((s = (i = game.actors) == null ? void 0 : i.get) != null && s.call(i, u)) || n.set(u, { actorId: u, name: l, number: g });
  }
  return [...n.values()].sort((c, u) => c.name.localeCompare(u.name));
}
function lr() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => {
    var n;
    return t.id !== ((n = game.user) == null ? void 0 : n.id);
  }).map((t) => mn(t, "Unknown Player")).sort((t, n) => t.name.localeCompare(n.name));
}
function we() {
  var e, t;
  return String(((e = game.world) == null ? void 0 : e.id) ?? ((t = game.world) == null ? void 0 : t.title) ?? "default");
}
function zt() {
  const e = game.settings.get(d, "contacts");
  return Array.isArray(e) ? { [we()]: e } : !e || typeof e != "object" ? {} : e;
}
function Wt() {
  var t, n;
  if (!((t = game.user) != null && t.isGM)) {
    const a = Te((n = game.user) == null ? void 0 : n.id);
    if (a !== null) return a;
  }
  const e = zt()[we()];
  return Array.isArray(e) ? e.map(q).filter((a) => a.name && a.number).sort((a, r) => a.name.localeCompare(r.name)) : [];
}
function Mt() {
  var t, n;
  const e = (t = game.user) != null && t.isGM ? [] : Nt((n = game.user) == null ? void 0 : n.id);
  return [
    ...Wt(),
    ...e.map((a) => ({ ...a, assignedToPlayer: !0 }))
  ].sort((a, r) => a.name.localeCompare(r.name));
}
function On() {
  var n;
  if (!((n = game.user) != null && n.isGM)) return [];
  const e = Rn(), t = e.find((a) => a.id === Dn) ?? e[0];
  return e.map((a) => ({ ...a, selected: a.id === (t == null ? void 0 : t.id) }));
}
function He() {
  var e;
  return ((e = On().find((t) => t.selected)) == null ? void 0 : e.id) ?? "";
}
function ur(e) {
  return e === "player" ? En(He()) : e === "group" ? be() : Mt();
}
function be() {
  if (Array.isArray(Ae))
    return Ae.map(q).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name));
  const e = game.settings.get(d, "groupContacts");
  return Array.isArray(e) ? e.map(q).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function Ht() {
  const e = /* @__PURE__ */ new Map();
  for (const t of [...lr(), ...be(), ...Mt()]) {
    const n = t.userId ? `user:${t.userId}` : `number:${t.number || t.id}`;
    e.has(n) || e.set(n, t);
  }
  return [...e.values()].sort((t, n) => t.name.localeCompare(n.name));
}
async function Ln(e) {
  var t;
  (t = game.user) != null && t.isGM || await Pn(game.user.id, e), await game.settings.set(d, "contacts", {
    ...zt(),
    [we()]: e.map(q)
  });
}
let ct = null;
async function xn() {
  var t, n;
  if ((t = game.user) != null && t.isGM || ct || Te((n = game.user) == null ? void 0 : n.id) !== null) return;
  const e = zt()[we()];
  ct = Pn(game.user.id, Array.isArray(e) ? e : []);
  try {
    await ct;
  } finally {
    ct = null;
  }
}
async function yt(e) {
  Ae = e.map(q), await game.settings.set(d, "groupContacts", Ae), game.socket.emit(ie, {
    action: "groupContactsChanged",
    contacts: Ae
  });
}
function Kt() {
  const e = game.settings.get(d, "messageReadState");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function Fn() {
  const e = game.settings.get(d, "messageDeletedBefore");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function Ve() {
  const e = game.settings.get(d, "npcThreadBindings");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
async function ut(e, t) {
  var a;
  if (!((a = game.user) != null && a.isGM) || !e) return;
  const n = { ...Ve() };
  t === null ? delete n[e] : n[e] = { ...n[e] ?? {}, ...t }, await game.settings.set(d, "npcThreadBindings", n);
}
function Jt() {
  const e = Fn();
  return ar().filter((t) => {
    const n = e[t.threadId];
    return !n || t.createdAt > n;
  });
}
function _n() {
  return An(Jt(), Ht(), "", Kt()).reduce((e, t) => e + Number(t.unreadCount ?? 0), 0);
}
async function dr(e, t = (/* @__PURE__ */ new Date()).toISOString()) {
  e && await game.settings.set(d, "messageReadState", {
    ...Kt(),
    [e]: t
  });
}
async function Fe() {
  V && await dr(V);
}
async function gr(e) {
  e && (await game.settings.set(d, "messageDeletedBefore", {
    ...Fn(),
    [e]: (/* @__PURE__ */ new Date()).toISOString()
  }), V === e && (V = "", Q = !1, W = !1, Z && (Z.contact = null), (I == null ? void 0 : I.mode) === "messages" && (I.contact = null)), await j(), await H());
}
async function mr(e, t, n = "personal", a = "", r = {}) {
  var u, l, g, b, w, A, M, m, v, y;
  if (n === "player" && !((u = game.user) != null && u.isGM)) return !1;
  const o = r.actorId ? (l = game.actors) == null ? void 0 : l.get(r.actorId) : null, i = q({
    id: r.id || void 0,
    name: String(e ?? "").trim() || (o == null ? void 0 : o.name),
    number: t,
    image: Le() && (String(a ?? "").trim() || (o == null ? void 0 : o.img)) || "",
    actorId: Le() ? r.actorId : "",
    managedByGM: Le() ? r.managedByGM === !0 : !1,
    isNpc: Le() ? r.isNpc === !0 || r.managedByGM === !0 || !!r.actorId : !1
  });
  if (!i.name || !i.number)
    return (b = (g = ui.notifications) == null ? void 0 : g.warn) == null || b.call(g, "Contact name and number are required."), !1;
  if (!ka(i.number, gt()))
    return (A = (w = ui.notifications) == null ? void 0 : w.warn) == null || A.call(w, `Enter a phone number matching ${gt()} (# = digit, A = letter, * = letter or digit).`), !1;
  if (n === "player") {
    const N = He();
    if (!N) return !1;
    const E = Te(N) ?? [];
    return !Nt(N).some((P) => P.id === i.id) && E.some((P) => P.id === i.id) ? await Gn(N, i.id, i) : await Un(N, i.id, i), !0;
  }
  if (n === "group" && !game.user.isGM)
    return r.id ? !1 : Yt() ? (game.socket.emit(ie, {
      action: "groupContactAdd",
      contact: i
    }), (y = (v = ui.notifications) == null ? void 0 : v.info) == null || y.call(v, "Group contact update sent to the GM."), !0) : ((m = (M = ui.notifications) == null ? void 0 : M.warn) == null || m.call(M, "A GM must be connected to update group contacts."), !1);
  const s = n === "group" ? be() : Wt(), c = s.findIndex((N) => N.id === i.id);
  return c === -1 ? s.push(i) : s[c] = { ...s[c], ...i }, n === "group" ? await yt(s) : await Ln(s), await H(), !0;
}
async function pr(e, t = "personal") {
  var n, a, r, o;
  if (t === "player") {
    const i = He(), s = Nt(i).some((u) => u.id === e), c = (Te(i) ?? []).some((u) => u.id === e);
    !s && c ? await Gn(i, e) : await Un(i, e);
    return;
  } else if (t === "group") {
    if (!game.user.isGM) {
      if (!Yt()) {
        (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(ie, {
        action: "groupContactRemove",
        contactId: e
      }), (o = (r = ui.notifications) == null ? void 0 : r.info) == null || o.call(r, "Group contact removal sent to the GM.");
      return;
    }
    await yt(be().filter((i) => i.id !== e));
  } else
    await Ln(Wt().filter((i) => i.id !== e));
  await H();
}
function Yt() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function $t(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(d, "minimumRole");
  } catch (n) {
    console.warn(`${d} | Permission setting unavailable, using Player role fallback.`, n);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function Le(e = game.user) {
  return !!(e != null && e.isGM);
}
function ae(e, t = null) {
  var n;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (n = e == null ? void 0 : e.element) != null && n[0] ? e.element[0] : (e == null ? void 0 : e.element) ?? null;
}
const fr = 24;
function qn(e) {
  var o, i, s;
  const t = ae(e), n = (o = t == null ? void 0 : t.querySelector) == null ? void 0 : o.call(t, ".cybercall-message-log");
  if (!(n instanceof HTMLElement)) return null;
  const a = (i = t.querySelector) == null ? void 0 : i.call(t, "[data-cybercall-active-thread]"), r = n.scrollHeight - n.clientHeight - n.scrollTop;
  return {
    threadId: String(((s = a == null ? void 0 : a.dataset) == null ? void 0 : s.cybercallActiveThread) ?? ""),
    scrollTop: n.scrollTop,
    stickToBottom: r <= fr
  };
}
function br(e, t) {
  var u;
  const n = t.querySelector(".cybercall-message-log");
  if (!(n instanceof HTMLElement)) return;
  const a = e == null ? void 0 : e._cybercallMessageScrollState, r = t.querySelector("[data-cybercall-active-thread]"), o = String(((u = r == null ? void 0 : r.dataset) == null ? void 0 : u.cybercallActiveThread) ?? ""), i = !a || a.scrollToBottom === !0 || a.stickToBottom === !0 || a.threadId !== o;
  delete e._cybercallMessageScrollState;
  const s = {};
  e._cybercallMessageScrollRestoreToken = s;
  const c = () => {
    if (e._cybercallMessageScrollRestoreToken !== s || !n.isConnected) return;
    const l = Math.max(0, n.scrollHeight - n.clientHeight);
    n.scrollTop = i ? l : Math.min(a.scrollTop, l);
  };
  c(), requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      c(), e._cybercallMessageScrollRestoreToken === s && delete e._cybercallMessageScrollRestoreToken;
    });
  });
}
function ht(e) {
  var a;
  const t = e.querySelector("[data-cybercall-active-thread]"), n = String(((a = t == null ? void 0 : t.dataset) == null ? void 0 : a.cybercallActiveThread) ?? "");
  return n ? `thread:${n}` : e.querySelector("form[data-cybercall-group-form]") ? "new-group" : "new-message";
}
function Vn(e) {
  const t = ae(e);
  if (!(t instanceof HTMLElement)) return null;
  const n = t.querySelector("form[data-cybercall-group-form]");
  if (n) {
    const i = n.elements.namedItem("groupName");
    return {
      key: ht(t),
      groupName: (i == null ? void 0 : i.value) ?? "",
      groupMembers: [...n.querySelectorAll('input[type="checkbox"]:checked')].map((s) => `${s.name}:${s.value}`)
    };
  }
  const a = t.querySelector("form[data-cybercall-message-form]");
  if (!a) return null;
  const r = a.elements.namedItem("body"), o = (i) => {
    var s;
    return ((s = a.elements.namedItem(i)) == null ? void 0 : s.value) ?? "";
  };
  return {
    key: ht(t),
    body: (r == null ? void 0 : r.value) ?? "",
    contactId: o("contactId"),
    replyAs: o("replyAs"),
    sendAs: o("sendAs"),
    bodyWasFocused: document.activeElement === r,
    selectionStart: (r == null ? void 0 : r.selectionStart) ?? null,
    selectionEnd: (r == null ? void 0 : r.selectionEnd) ?? null
  };
}
function yr(e, t) {
  const n = e == null ? void 0 : e._cybercallMessageComposerState;
  if (delete e._cybercallMessageComposerState, !n || n.key !== ht(t)) return;
  const a = t.querySelector("form[data-cybercall-group-form]");
  if (a) {
    const s = a.elements.namedItem("groupName");
    s && (s.value = n.groupName ?? "");
    const c = new Set(n.groupMembers ?? []);
    a.querySelectorAll('input[type="checkbox"]').forEach((u) => {
      u.checked = c.has(`${u.name}:${u.value}`);
    });
    return;
  }
  const r = t.querySelector("form[data-cybercall-message-form]");
  if (!r) return;
  const o = (s, c) => {
    const u = r.elements.namedItem(s);
    u && [...u instanceof HTMLSelectElement ? u.options : []].some((l) => l.value === c) && (u.value = c);
  };
  o("contactId", n.contactId), o("replyAs", n.replyAs), o("sendAs", n.sendAs);
  const i = r.elements.namedItem("body");
  i && (i.value = n.body ?? "", n.bodyWasFocused && requestAnimationFrame(() => {
    i.isConnected && (i.focus({ preventScroll: !0 }), n.selectionStart !== null && n.selectionEnd !== null && i.setSelectionRange(n.selectionStart, n.selectionEnd));
  }));
}
function hr(e, t = null) {
  const n = ae(e, t);
  if (!n) return;
  const a = n.closest(".cybercall-app, .cybercall-phone-app") ?? ae(e);
  a == null || a.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), vt(a), a == null || a.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), a == null || a.classList.toggle("cybercall-connected", e.callData.accepted), n.querySelectorAll("[data-cybercall-action]").forEach((r) => {
    r.addEventListener("click", async (o) => {
      const i = o.currentTarget.dataset.cybercallAction;
      if (i === "accept") {
        await Lr(e.callData.id);
        return;
      }
      if (i === "broadcast") {
        tn({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (i === "decline" || i === "end") && await Qn(e.callData.id);
    });
  });
}
function Cr(e) {
  var n, a;
  const t = "form[data-cybercall-composer]";
  return (n = e == null ? void 0 : e.matches) != null && n.call(e, t) ? e : (a = e == null ? void 0 : e.querySelector) == null ? void 0 : a.call(e, t);
}
function wr(e, t = null) {
  var i;
  const n = ae(e, t), a = Cr(n);
  if (!n || !a) return;
  vt(n.closest(".cybercall-composer-app"));
  function r(s) {
    e._cybercallConsoleTab = s, n.querySelectorAll("[data-cybercall-console-panel]").forEach((c) => {
      c.hidden = c.dataset.cybercallConsolePanel !== s;
    }), n.querySelectorAll("[data-cybercall-console-tab]").forEach((c) => {
      c.setAttribute("aria-selected", String(c.dataset.cybercallConsoleTab === s));
    });
  }
  n.querySelectorAll("[data-cybercall-console-tab]").forEach((s) => {
    s.addEventListener("click", () => r(s.dataset.cybercallConsoleTab));
  }), r(e._cybercallConsoleTab ?? "transmission"), Ra(n, a), ot(a);
  const o = n.querySelector("[data-cybercall-ringtone]");
  o && o.addEventListener("change", async (s) => {
    await aa(s.currentTarget.value);
  }), a.addEventListener("input", () => ot(a)), (i = a.elements.actorId) == null || i.addEventListener("change", () => {
    var c;
    const s = (c = game.actors) == null ? void 0 : c.get(a.elements.actorId.value);
    s && (a.elements.callerName.value = s.name, a.elements.image.value = s.img ?? "");
  }), a.addEventListener("change", () => ot(a)), a.addEventListener("submit", (s) => {
    var c;
    if (s.preventDefault(), e._cybercallConsoleTab === "configuration") {
      (c = n.querySelector("[data-cybercall-save-configuration]")) == null || c.click();
      return;
    }
    ye(Bt(a));
  }), n.querySelectorAll("[data-cybercall-compose-action]").forEach((s) => {
    s.addEventListener("click", async (c) => {
      var g, b, w, A;
      const u = c.currentTarget.dataset.cybercallComposeAction, l = Bt(a);
      if (u === "preview") {
        await ye(l);
        return;
      }
      if (u === "broadcast") {
        await tn(l);
        return;
      }
      if (u === "close-active") {
        Qn((g = C == null ? void 0 : C.callData) == null ? void 0 : g.id);
        return;
      }
      if (u === "browse-image") {
        const M = a.elements.image, m = wt();
        if (!M || !m) {
          (w = (b = ui.notifications) == null ? void 0 : b.warn) == null || w.call(b, "Foundry FilePicker is unavailable.");
          return;
        }
        const v = new m({
          type: "image",
          current: M.value,
          callback: (y) => {
            M.value = y, M.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof v.browse == "function" ? v.browse() : (A = v.render) == null || A.call(v, !0);
        return;
      }
      if (u === "reset") {
        a.reset(), ot(a);
        return;
      }
      u === "open-messages" && await Ne(), u === "open-contacts" && (de = "group", await Et());
    });
  });
}
function vr(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function Ir(e, t = null) {
  var g, b, w, A, M;
  const n = ae(e, t), a = vr(n);
  if (!n) return;
  const r = n.querySelector("[data-cybercall-ringtone]");
  if (r && r.addEventListener("change", async (m) => {
    await aa(m.currentTarget.value);
  }), (g = n.querySelector("[data-cybercall-message-sound]")) == null || g.addEventListener("change", async (m) => {
    await xa(m.currentTarget.value);
  }), !a) return;
  Cn(n), (b = a.querySelector("[data-cybercall-contact-browse]")) == null || b.addEventListener("click", () => {
    var N, E;
    if (!((N = game.user) != null && N.isGM)) return;
    const m = a.elements.image, v = wt();
    if (!m || !v) return;
    const y = new v({
      type: "image",
      current: m.value,
      callback: (k) => {
        m.value = k, m.dispatchEvent(new Event("change", { bubbles: !0 }));
      }
    });
    typeof y.browse == "function" ? y.browse() : (E = y.render) == null || E.call(y, !0);
  });
  const o = (m) => {
    n.querySelectorAll("[data-cybercall-contact-row]").forEach((v) => {
      v.classList.toggle("selected", v.dataset.cybercallContactRow === m);
    });
  };
  o(e.selectedContactId);
  const i = n.querySelector("[data-cybercall-contact-search]");
  if (i) {
    i.value = e.contactSearch ?? "";
    const m = () => {
      e.contactSearch = i.value;
      const v = i.value.trim().toLocaleLowerCase();
      n.querySelectorAll("[data-cybercall-contact-panel]").forEach((y) => {
        const N = [...y.querySelectorAll("[data-cybercall-contact-row]")];
        for (const k of N) {
          const P = k.querySelector(".cybercall-contact-id").textContent;
          k.hidden = !P.toLocaleLowerCase().includes(v);
        }
        const E = y.querySelector("[data-cybercall-empty-search]");
        E && (E.hidden = !N.length || N.some((k) => !k.hidden));
      });
    };
    i.addEventListener("input", m), m();
  }
  a.addEventListener("submit", async (m) => {
    var N, E, k;
    m.preventDefault();
    const v = new FormData(a), y = String(v.get("scope") ?? de);
    u.disabled = !0;
    try {
      await mr(v.get("name"), v.get("number"), y, v.get("image"), {
        id: v.get("contactId"),
        actorId: v.get("actorId"),
        managedByGM: v.get("managedByGM") === "on",
        isNpc: v.get("managedByGM") === "on" || !!v.get("actorId")
      }) && (l(), (N = a.elements.name) == null || N.focus());
    } catch (P) {
      console.warn(`${d} | Could not save contact.`, P), (k = (E = ui.notifications) == null ? void 0 : E.error) == null || k.call(E, "CyberCall could not save this contact.");
    } finally {
      u.disabled = !1;
    }
  });
  const s = n.querySelector("[data-cybercall-contact-player]");
  s == null || s.addEventListener("change", () => {
    Dn = s.value, H();
  });
  const c = a.closest("details"), u = a.querySelector('button[type="submit"]');
  function l() {
    a.reset(), a.elements.scope.value = de, u.textContent = "Add Contact", c && (c.querySelector("summary").textContent = "Add contact");
  }
  (w = a.querySelector("[data-cybercall-cancel-contact]")) == null || w.addEventListener("click", () => {
    l(), c && (c.open = !1);
  }), (A = a.elements.actorId) == null || A.addEventListener("change", () => {
    var v;
    const m = (v = game.actors) == null ? void 0 : v.get(a.elements.actorId.value);
    m && (a.elements.name.value || (a.elements.name.value = m.name), a.elements.image && !a.elements.image.value && (a.elements.image.value = m.img ?? ""), a.elements.managedByGM && (a.elements.managedByGM.checked = !0));
  }), n.querySelectorAll("[data-cybercall-contact-tab]").forEach((m) => {
    m.addEventListener("click", (v) => {
      var E;
      const y = v.currentTarget.dataset.cybercallContactTab;
      if (y === "player" && !((E = game.user) != null && E.isGM) || y === de) return;
      de = y, l(), c && (c.open = !1);
      const N = y !== "player" || !!He();
      c && (c.hidden = !N), n.querySelectorAll("[data-cybercall-contact-tab]").forEach((k) => {
        k.classList.toggle("active", k.dataset.cybercallContactTab === de);
      }), n.querySelectorAll("[data-cybercall-contact-panel]").forEach((k) => {
        k.hidden = k.dataset.cybercallContactPanel !== de;
      });
    });
  }), n.querySelectorAll("[data-cybercall-contact-action]").forEach((m) => {
    m.addEventListener("click", async (v) => {
      var R, U, z;
      const y = v.currentTarget.dataset.cybercallContactAction, N = v.currentTarget.dataset.contactId, E = v.currentTarget.dataset.contactScope ?? "personal", P = ur(E).find((G) => G.id === N);
      if (y === "edit" && P && ((R = game.user) != null && R.isGM)) {
        if (!c || !a.elements.contactId) return;
        a.elements.contactId.value = P.id, a.elements.name.value = P.name, a.elements.number.value = P.number, a.elements.actorId.value = P.actorId, a.elements.image.value = P.image, a.elements.managedByGM.checked = P.managedByGM, c.querySelector("summary").textContent = "Edit contact", u.textContent = "Save Contact", c.open = !0, a.elements.name.focus();
        return;
      }
      if (y === "remove" && P && !("assignedToPlayer" in P)) {
        try {
          await pr(N, E);
        } catch (G) {
          console.warn(`${d} | Could not remove contact.`, G), (z = (U = ui.notifications) == null ? void 0 : U.error) == null || z.call(U, "CyberCall could not remove this contact.");
        }
        return;
      }
      if (P && (y === "call" || y === "message") && (e.selectedContactId = N, o(N)), y === "call" && P) {
        await qr(P);
        return;
      }
      y === "message" && P && await Ne(P);
    });
  }), (M = n.querySelector("[data-cybercall-open-messages]")) == null || M.addEventListener("click", async () => {
    await Ne();
  });
}
function jn(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
function Sr(e) {
  var l, g, b, w, A, M, m;
  const t = Ve()[e.id] ?? null, n = ((l = game.user) == null ? void 0 : l.isGM) === !0, a = !!(!e.isGroup && e.contact && !e.contact.userId && (e.contact.isNpc || e.contact.managedByGM || e.isNpcRouted)), r = t != null && t.actorId ? (b = (g = game.actors) == null ? void 0 : g.get) == null ? void 0 : b.call(g, t.actorId) : null, o = String((r == null ? void 0 : r.name) ?? (t == null ? void 0 : t.actorName) ?? "").trim(), i = String((t == null ? void 0 : t.image) ?? ((A = (w = r == null ? void 0 : r.prototypeToken) == null ? void 0 : w.texture) == null ? void 0 : A.src) ?? (r == null ? void 0 : r.img) ?? "").trim(), s = (t == null ? void 0 : t.revealPortrait) === !0, c = e.isNpcRouted === !0, u = t || c ? {
    ...e.contact,
    actorId: t && n ? String(t.actorId ?? e.contact.actorId ?? "") : e.contact.actorId,
    image: t && s ? i : ""
  } : e.contact;
  return {
    ...e,
    contact: u,
    image: !n && c ? t && s ? i : "" : e.image,
    canLinkNpc: n && a,
    showNpcLinkPanel: n && (a || !!t),
    hasNpcBinding: !!t,
    npcBindingName: o || ((M = e.contact) == null ? void 0 : M.name) || "Linked NPC",
    npcBindingImage: i,
    npcBindingInitials: ne(o || ((m = e.contact) == null ? void 0 : m.name) || "NPC"),
    npcPortraitRevealed: s,
    npcBindingStatusLabel: t ? `Linked to ${o || "Actor"}` : "Unlinked NPC contact"
  };
}
function Tt(e = null) {
  var M, m, v;
  const t = Ht();
  let n = t;
  const a = e ?? n[0] ?? null;
  a && !n.some((y) => y.id === a.id || y.number === a.number) && (n = [...n, q(a)].sort((y, N) => y.name.localeCompare(N.name)));
  const r = Q || W ? "" : V, o = An(Jt(), n, r, Kt()).map((y) => ({
    ...Sr(y),
    groupRoster: y.groupMemberNames.join(", "),
    messages: y.messages.map((N) => ({
      ...N,
      createdAtLabel: jn(N.createdAt)
    }))
  })), i = Q || W ? null : o.find((y) => y.id === V) ?? null;
  i != null && i.contact && !n.some((y) => y.id === i.contact.id || y.number === i.contact.number) && (n = [...n, i.contact].sort((y, N) => y.name.localeCompare(N.name)));
  const s = ((M = i == null ? void 0 : i.contact) == null ? void 0 : M.id) ?? (a == null ? void 0 : a.id) ?? "", c = _n(), u = zn(i, { excludeGMs: !1 }), l = Nr(i), g = Hn(), b = ((m = game.user) == null ? void 0 : m.isGM) === !0 && !i && g.length > 1, w = or(), A = W ? cr(t, o) : [];
  return {
    threads: o,
    hasThreads: o.length > 0,
    pendingCount: Object.keys(game.user.getFlag(d, "pendingMessages") ?? {}).length,
    unreadCount: c,
    hasUnreadMessages: c > 0,
    activeThread: i,
    activeThreadId: (i == null ? void 0 : i.id) ?? r,
    allContacts: n.map((y) => ({
      ...y,
      selected: y.id === s
    })),
    hasContacts: n.length > 0,
    selectedContactId: s,
    isThreadReply: !!i,
    showConversation: !!(i || Q || W || e),
    isComposingNewMessage: !i && !W,
    isComposingNewGroup: W,
    groupMemberChoices: w,
    groupNpcMemberChoices: A,
    hasGroupMemberChoices: w.length > 0 || A.length > 0,
    canDeleteThread: !!i,
    threadReplyLabel: i ? `${i.title}${i.subtitle ? ` (${i.subtitle})` : ""}` : "",
    canReplyAs: l.length > 1,
    replyAsChoices: l,
    canSendAs: b,
    sendAsChoices: g,
    activeThreadRecipientUserIds: u,
    showMessageTimestamps: game.settings.get(d, "showMessageTimestamps") === !0,
    gmViewPlayerMessagesEnabled: game.settings.get(d, "gmViewPlayerMessages") === !0,
    isFoundryV13Plus: Number(((v = game.release) == null ? void 0 : v.generation) ?? 0) >= 13
  };
}
function Ar(e, t = Tt()) {
  const n = String(new FormData(e).get("contactId") ?? "");
  return t.allContacts.find((a) => a.id === n) ?? null;
}
function zn(e, t = {}) {
  var i, s, c;
  if (!((i = e == null ? void 0 : e.messages) != null && i.length)) return [];
  const n = String(((s = game.user) == null ? void 0 : s.id) ?? ""), a = new Set((((c = game.users) == null ? void 0 : c.contents) ?? []).filter((u) => u.isGM).map((u) => String(u.id))), r = /* @__PURE__ */ new Set(), o = e.isGroup ? e.messages.slice(-1) : e.messages;
  for (const u of o) {
    u.senderUserId && u.senderUserId !== n && !(t.excludeGMs && a.has(u.senderUserId)) && r.add(u.senderUserId);
    for (const l of u.recipientUserIds ?? [])
      l && l !== n && !(t.excludeGMs && a.has(l)) && r.add(l);
  }
  return [...r];
}
function Wn() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => String(t.id)).filter(Boolean);
}
function Nr(e) {
  var a, r, o, i;
  const t = !!((a = game.user) != null && a.isGM && (e != null && e.contact) && !e.contact.userId && (e.contact.isNpc || e.contact.managedByGM)), n = [{
    id: "self",
    label: X(game.user, "Me"),
    selected: !t
  }];
  if (!((r = game.user) != null && r.isGM) || !(e != null && e.contact) || e.contact.userId) return n;
  if (e.isGroup) {
    for (const s of e.groupNpcMembers)
      (i = (o = game.actors) == null ? void 0 : o.get) != null && i.call(o, s.actorId) && n.push({ id: `npc:${s.actorId}`, label: s.name, selected: !1 });
    return n;
  }
  return n.push({
    id: "contact",
    label: e.contact.name,
    selected: t
  }), n;
}
function Hn() {
  var n, a;
  const e = [{
    id: "self",
    label: X(game.user, "Me"),
    selected: !0,
    contact: null
  }];
  if (!((n = game.user) != null && n.isGM)) return e;
  const t = /* @__PURE__ */ new Set();
  for (const r of [...be(), ...Mt()].map(q)) {
    if (!r.name || r.userId || !r.managedByGM && !r.actorId && !r.isNpc) continue;
    const o = r.actorId || r.number || r.id;
    t.has(o) || (t.add(o), e.push({
      id: o,
      label: r.name,
      selected: !1,
      contact: r
    }));
  }
  for (const r of ((a = game.actors) == null ? void 0 : a.contents) ?? []) {
    const o = `actor-${r.id}`;
    t.has(r.id) || t.has(o) || (t.add(o), e.push({
      id: o,
      label: r.name,
      selected: !1,
      contact: q({
        id: o,
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
function cn(e) {
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
function Mr(e, t) {
  var o, i, s, c, u;
  const n = new FormData(e);
  if (t.activeThread) {
    const l = String(n.get("replyAs") ?? "self");
    if (t.activeThread.isGroup) {
      const g = t.activeThread.groupNpcMembers.find((b) => `npc:${b.actorId}` === l);
      return (o = game.user) != null && o.isGM && g && ((s = (i = game.actors) == null ? void 0 : i.get) != null && s.call(i, g.actorId)) ? { senderName: g.name, senderNumber: g.number, senderActorId: g.actorId, senderImage: "" } : {};
    }
    return l === "contact" && ((c = game.user) != null && c.isGM) && t.activeThread.contact ? cn(t.activeThread.contact) : {};
  }
  const a = String(n.get("sendAs") ?? "self");
  if (a === "self" || !((u = game.user) != null && u.isGM)) return {};
  const r = Hn().find((l) => l.id === a);
  return cn(r == null ? void 0 : r.contact);
}
function $r(e) {
  var n, a, r, o, i;
  const t = globalThis.TextEditor ?? ((r = (a = (n = globalThis.foundry) == null ? void 0 : n.applications) == null ? void 0 : a.ux) == null ? void 0 : r.TextEditor);
  try {
    const s = (o = t == null ? void 0 : t.getDragEventData) == null ? void 0 : o.call(t, e);
    if (s && Object.keys(s).length) return s;
  } catch {
  }
  try {
    return JSON.parse(((i = e.dataTransfer) == null ? void 0 : i.getData("text/plain")) || "{}");
  } catch {
    return {};
  }
}
function ln(e) {
  var n, a, r, o, i, s;
  const t = String(
    ((n = e == null ? void 0 : e.getTextureSrc) == null ? void 0 : n.call(e)) || ((a = e == null ? void 0 : e.texture) == null ? void 0 : a.src) || ((o = (r = e == null ? void 0 : e.document) == null ? void 0 : r.texture) == null ? void 0 : o.src) || ((s = (i = e == null ? void 0 : e.prototypeToken) == null ? void 0 : i.texture) == null ? void 0 : s.src) || (e == null ? void 0 : e.img) || ""
  ).trim();
  return t.includes("*") ? String((e == null ? void 0 : e.img) ?? "").trim() : t;
}
async function Tr(e) {
  var i, s, c, u, l, g, b, w;
  const t = $r(e), n = globalThis.fromUuid;
  let a = t.uuid && n ? await n(t.uuid) : null;
  !a && t.sceneId && t.tokenId && (a = ((l = (u = (c = (s = (i = game.scenes) == null ? void 0 : i.get) == null ? void 0 : s.call(i, t.sceneId)) == null ? void 0 : c.tokens) == null ? void 0 : u.get) == null ? void 0 : l.call(u, t.tokenId)) ?? null);
  const r = String(
    ((g = a == null ? void 0 : a.actor) == null ? void 0 : g.id) || (a == null ? void 0 : a.actorId) || ((a == null ? void 0 : a.documentName) === "Actor" ? a.id : "") || t.actorId || (t.type === "Actor" ? t.id : "") || ""
  ).trim(), o = (a == null ? void 0 : a.documentName) === "Actor" ? a : (a == null ? void 0 : a.actor) ?? (r ? (w = (b = game.actors) == null ? void 0 : b.get) == null ? void 0 : w.call(b, r) : null);
  return o ? {
    actorId: String(o.id ?? r),
    actorUuid: String(o.uuid ?? `Actor.${o.id ?? r}`),
    actorName: String(o.name ?? "Linked NPC"),
    image: ln(a) || ln(o),
    revealPortrait: !1,
    linkedAt: (/* @__PURE__ */ new Date()).toISOString()
  } : null;
}
async function Er(e, t) {
  var a, r, o, i, s;
  if (!((a = game.user) != null && a.isGM) || !t) return;
  e.preventDefault(), e.stopPropagation();
  const n = await Tr(e);
  if (!n) {
    (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, "Drop an Actor or an Actor-backed Token to link this NPC contact.");
    return;
  }
  await ut(t, n), (s = (i = ui.notifications) == null ? void 0 : i.info) == null || s.call(i, `Linked this NPC conversation to ${n.actorName}.`), await j();
}
async function Gr(e, t) {
  var y, N, E, k, P;
  const n = new FormData(e), a = String(n.get("groupName") ?? "").trim(), r = Tt(), o = new Set(n.getAll("memberUserIds")), i = new Set(n.getAll("memberActorIds")), s = r.groupMemberChoices.filter((R) => o.has(R.id)).map((R) => R.id), c = r.groupNpcMemberChoices.filter((R) => i.has(R.actorId));
  if (!a) {
    (N = (y = ui.notifications) == null ? void 0 : y.warn) == null || N.call(y, "Enter a name for the group chat.");
    return;
  }
  if (!s.length && !c.length) {
    (k = (E = ui.notifications) == null ? void 0 : E.warn) == null || k.call(E, "Select at least one player or linked NPC for the group chat.");
    return;
  }
  const u = String(((P = game.user) == null ? void 0 : P.id) ?? ""), l = [...new Set([u, ...s].filter(Boolean))], g = [
    ...l.map((R) => {
      var U, z;
      return X((z = (U = game.users) == null ? void 0 : U.get) == null ? void 0 : z.call(U, R));
    }),
    ...c.map((R) => R.name)
  ].filter(Boolean), b = [.../* @__PURE__ */ new Set([...s, ...c.length ? Wn() : []])].filter((R) => R !== u), w = Me(), A = Va(w), M = X(game.user, "A player"), m = {
    id: `group-${w}`,
    name: a,
    number: `${l.length + c.length} members`,
    userIds: b,
    isGroup: !0
  };
  await jt(m, `${M} created the group.`, {
    threadId: A,
    recipientUserIds: b,
    recipientNumbers: [],
    messageType: "event",
    eventType: "group-created",
    conversationType: "group",
    groupId: w,
    groupName: a,
    groupMemberUserIds: l,
    groupMemberNames: g,
    groupNpcMembers: c
  }) && (V = A, Q = !1, W = !1, t && (t.contact = m), (I == null ? void 0 : I.mode) === "messages" && (I.contact = m), await Fe(), await j());
}
function Pr(e, t = null) {
  const n = ae(e, t);
  if (!n) return;
  br(e, n), yr(e, n), n.querySelectorAll("[data-cybercall-npc-link-drop]").forEach((o) => {
    o.addEventListener("dragover", (i) => {
      var s;
      (s = game.user) != null && s.isGM && (i.preventDefault(), i.dataTransfer.dropEffect = "link", o.classList.add("drag-over"));
    }), o.addEventListener("dragleave", () => o.classList.remove("drag-over")), o.addEventListener("drop", async (i) => {
      o.classList.remove("drag-over");
      const s = o.dataset.cybercallNpcThreadId || o.dataset.cybercallThreadId || V;
      await Er(i, s);
    });
  }), n.querySelectorAll("[data-cybercall-npc-action]").forEach((o) => {
    o.addEventListener("click", async (i) => {
      var l, g, b, w, A;
      i.preventDefault(), i.stopPropagation();
      const s = i.currentTarget.dataset.cybercallNpcAction, c = i.currentTarget.dataset.cybercallNpcThreadId || V, u = Ve()[c];
      if (s === "toggle-reveal" && u) {
        await ut(c, { revealPortrait: u.revealPortrait !== !0 }), await j();
        return;
      }
      if (s === "unlink" && u) {
        await ut(c, null), (g = (l = ui.notifications) == null ? void 0 : l.info) == null || g.call(l, "NPC identity link removed."), await j();
        return;
      }
      s === "change" && ((b = i.currentTarget.closest("[data-cybercall-npc-link-drop]")) == null || b.classList.add("awaiting-drop"), (A = (w = ui.notifications) == null ? void 0 : w.info) == null || A.call(w, "Drag a different Actor or Token onto the NPC identity panel."));
    });
  }), n.querySelectorAll("[data-cybercall-thread-id]").forEach((o) => {
    o.addEventListener("click", async (i) => {
      Q = !1, W = !1, V = i.currentTarget.dataset.cybercallThreadId, await Fe(), await j();
    });
  }), n.querySelectorAll("[data-cybercall-message-action]").forEach((o) => {
    o.addEventListener("click", async (i) => {
      var c;
      const s = i.currentTarget.dataset.cybercallMessageAction;
      if (s === "back") {
        V = "", Q = !1, W = !1, e.contact = null, await j();
        return;
      }
      if (s === "refresh") {
        await j();
        return;
      }
      if (s === "open-calls") {
        await Xn();
        return;
      }
      if (s === "new") {
        Q = !0, W = !1, V = "", Z && (Z.contact = null), await j();
        return;
      }
      if (s === "new-group") {
        Q = !1, W = !0, V = "", Z && (Z.contact = null), (I == null ? void 0 : I.mode) === "messages" && (I.contact = null), await j();
        return;
      }
      if (s === "delete-thread") {
        i.preventDefault(), i.stopPropagation();
        const u = n.querySelector("[data-cybercall-active-thread]"), l = V || ((c = u == null ? void 0 : u.dataset) == null ? void 0 : c.cybercallActiveThread) || "";
        if (!l) return;
        if (e._cybercallPendingDeleteThreadId !== l) {
          e._cybercallPendingDeleteThreadId = l, i.currentTarget.classList.add("confirming"), i.currentTarget.textContent = "Confirm Delete", i.currentTarget.setAttribute("aria-label", "Confirm delete thread"), i.currentTarget.title = "Click again to delete this thread";
          return;
        }
        e._cybercallPendingDeleteThreadId = "", await gr(l);
      }
    });
  });
  const a = n.querySelector("form[data-cybercall-group-form]");
  a == null || a.addEventListener("submit", async (o) => {
    o.preventDefault(), await Gr(a, e);
  });
  const r = n.querySelector("form[data-cybercall-message-form]");
  r == null || r.addEventListener("submit", async (o) => {
    var v, y, N, E, k, P, R, U, z, G, O;
    o.preventDefault();
    const i = Tt(), s = i.activeThread, c = (s == null ? void 0 : s.contact) ?? Ar(r, i), u = ((v = r.elements.body) == null ? void 0 : v.value) ?? "", l = s != null && s.isGroup ? (y = r.elements.replyAs) == null ? void 0 : y.value : "", g = l ? { key: ht(n), replyAs: l } : null, b = Mr(r, i), w = (s == null ? void 0 : s.isGroup) || !!(s != null && s.contact && !s.contact.userId && (s.contact.managedByGM || s.contact.isNpc)), A = s ? zn(s, { excludeGMs: ((N = game.user) == null ? void 0 : N.isGM) === !0 && !w }) : null;
    if (!c) {
      (k = (E = ui.notifications) == null ? void 0 : E.warn) == null || k.call(E, "Select a contact before sending a message.");
      return;
    }
    const M = (s == null ? void 0 : s.id) ?? We(c, (P = game.user) == null ? void 0 : P.id, b);
    if (await jt(c, u, {
      ...b,
      threadId: M,
      recipientUserIds: s != null && s.isGroup || A != null && A.length ? A : void 0,
      recipientNumbers: b.senderNumber ? [] : void 0,
      conversationType: s != null && s.isGroup ? "group" : "direct",
      groupId: (s == null ? void 0 : s.groupId) ?? "",
      groupName: (s == null ? void 0 : s.groupName) ?? "",
      groupMemberUserIds: (s == null ? void 0 : s.groupMemberUserIds) ?? [],
      groupMemberNames: (s == null ? void 0 : s.groupMemberNames) ?? [],
      groupNpcMembers: (s == null ? void 0 : s.groupNpcMembers) ?? []
    })) {
      if ((R = game.user) != null && R.isGM && !s && b.senderActorId && !Ve()[M]) {
        const L = (z = (U = game.actors) == null ? void 0 : U.get) == null ? void 0 : z.call(U, b.senderActorId);
        L && await ut(M, {
          actorId: L.id,
          actorUuid: L.uuid ?? `Actor.${L.id}`,
          actorName: L.name,
          image: b.senderImage || ((O = (G = L.prototypeToken) == null ? void 0 : G.texture) == null ? void 0 : O.src) || L.img || "",
          revealPortrait: !1,
          linkedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      V = M, e && (e.contact = c), (I == null ? void 0 : I.mode) === "messages" && (I.contact = c), Q = !1, W = !1, r.elements.body.value = "", await Fe(), await j({ scrollToBottom: !0, composerState: g });
    }
  }), Fe();
}
function kr() {
  const e = /* @__PURE__ */ new Set(["outgoing", "connected", "ended", "missed"]), t = game.settings.get(d, "showMessageTimestamps") === !0;
  return Jt().filter((n) => n.messageType === "event" && e.has(n.eventType)).sort((n, a) => a.createdAt.localeCompare(n.createdAt)).map((n) => ({
    body: n.body,
    eventType: n.eventType,
    createdAtLabel: t ? jn(n.createdAt) : ""
  }));
}
function Ur(e, t = null) {
  const n = ae(e, t);
  vt(n == null ? void 0 : n.closest(".cybercall-phone-app")), n == null || n.querySelectorAll("[data-cybercall-screen]").forEach((a) => {
    a.addEventListener("click", () => {
      const r = a.dataset.cybercallScreen;
      r !== e.mode && (r === "messages" ? Ne() : en(r));
    });
  });
}
const { CyberCallApplication: Br, CyberCallComposer: Dr, CyberCallPhone: Kn } = Sa({
  moduleId: d,
  templatePath: Aa,
  composerTemplatePath: Na,
  contactsTemplatePath: Ma,
  messagesTemplatePath: $a,
  phoneTemplatePath: Ta,
  escapeHTML: xe,
  getDefaultComposerData: sr,
  getActorChoices: ir,
  getPlayerChoices: Rn,
  getContacts: Mt,
  getGroupContacts: be,
  getMessageContext: Tt,
  getCallHistory: kr,
  bindPhoneNavigation: Ur,
  getRingtoneChoices: ra,
  getMessageSoundOptions: La,
  getSoundPath: nn,
  getActiveContactsTab: () => de,
  getContactsPlayerChoices: On,
  getSelectedContactsPlayerId: He,
  getPlayerContacts: En,
  canEditContactImages: Le,
  bindCallControls: hr,
  bindComposerControls: wr,
  bindContactsControls: Ir,
  bindMessagesControls: Pr,
  stopRinging: je,
  clearActiveCall: (e) => {
    C === e && (C = null);
  },
  clearActiveComposer: (e) => {
    Y === e && (Y = null);
  },
  clearActiveContacts: (e) => {
    Se === e && (Se = null);
  },
  clearActiveMessages: (e) => {
    Z === e && (Z = null);
  },
  clearActivePhone: (e) => {
    C === e && (C = null, je()), I === e && (I = null, Se = null, Z = null);
  }
});
async function ye(e = {}) {
  var a, r, o, i;
  if (!$t())
    return (r = (a = ui.notifications) == null ? void 0 : a.warn) == null || r.call(a, "You do not have permission to open CyberCall transmissions."), null;
  await Qt();
  const t = se(e);
  !t.fullscreen && !game.user.isGM ? (I ?? (I = new Kn()), ea(I), I.callData = t, C = I) : C = new Br(t, t.fullscreen ? { classes: ["cybercall-app", "cybercall-fullscreen"] } : {});
  const n = C;
  return await n.render(!0), C === n && ((o = n.callData) == null ? void 0 : o.id) === t.id && (ta(n), (i = n.bringToFront) == null || i.call(n), zr(n.callData)), n;
}
async function Qt() {
  if (!C) return;
  const e = C;
  if (C = null, e === I) {
    je(), e.callData = null, Se = e.mode === "calls" ? e : null, Z = e.mode === "messages" ? e : null, await e.render(!0);
    return;
  }
  await e.close();
}
function Rr(e) {
  var t;
  return !!((t = C == null ? void 0 : C.callData) != null && t.id) && C.callData.id === e;
}
async function Or() {
  C && (await C.render(!0), ta(C));
}
async function Jn(e) {
  Rr(e) && (C.callData.accepted = !0, C.callData.ringing = !1, je(), await Or());
}
async function Lr(e) {
  if (!e) return;
  const t = C == null ? void 0 : C.callData;
  game.socket.emit(ie, {
    action: "acceptCall",
    callId: e
  });
  const n = Jn(e);
  Zn(t, "connected"), await n;
}
async function Yn(e) {
  var t;
  e && ((t = C == null ? void 0 : C.callData) != null && t.id) && C.callData.id !== e || await Qt();
}
async function Qn(e) {
  const t = C == null ? void 0 : C.callData, n = t != null && t.accepted ? "ended" : "missed";
  game.socket.emit(ie, {
    action: "endCall",
    callId: e
  });
  const a = Yn(e);
  Zn(t, n), await a;
}
function xr(e, t = "Player") {
  var a, r, o, i, s;
  const n = ((r = (a = game.users) == null ? void 0 : a.get) == null ? void 0 : r.call(a, e)) ?? ((s = (i = (o = game.users) == null ? void 0 : o.contents) == null ? void 0 : i.find) == null ? void 0 : s.call(i, (c) => c.id === e));
  return mn(n ?? { id: e }, t);
}
function Fr(e) {
  var t;
  return e ? e.contactNumber ? Ht().find((a) => a.number === e.contactNumber) ?? {
    id: `contact-${e.contactNumber}`,
    name: e.contactName || e.callerName,
    number: e.contactNumber,
    image: e.contactImage || e.image,
    actorId: e.contactActorId ?? "",
    managedByGM: !0,
    isNpc: !0
  } : (t = game.user) != null && t.isGM && e.callerUserId ? xr(e.callerUserId, e.callerName) : null : null;
}
function _r(e, t) {
  var a;
  const n = /* @__PURE__ */ new Set();
  for (const r of (t == null ? void 0 : t.userIds) ?? []) n.add(String(r));
  if (t != null && t.userId && n.add(String(t.userId)), e != null && e.callerUserId && n.add(String(e.callerUserId)), !(t != null && t.userId) && (t != null && t.managedByGM || t != null && t.isNpc || e != null && e.contactNumber))
    for (const r of Wn()) n.add(r);
  return n.delete(String(((a = game.user) == null ? void 0 : a.id) ?? "")), [...n].filter(Boolean);
}
async function Lt(e, t) {
  var o;
  const n = Fr(e);
  if (!n) return null;
  const a = (e == null ? void 0 : e.callerUserId) || ((o = game.user) == null ? void 0 : o.id), r = {
    outgoing: `Outgoing call to ${n.name}.`,
    connected: `Call connected with ${n.name}.`,
    ended: `Call ended with ${n.name}.`,
    missed: `Call missed or declined with ${n.name}.`
  };
  return rr(n, r[t] ?? "Call event.", {
    threadId: We(n, a),
    eventType: t,
    senderName: "CyberCall",
    senderNumber: n.number,
    senderActorId: n.actorId,
    recipientUserIds: _r(e, n),
    recipientNumbers: n.userId ? [] : [n.number]
  });
}
function Zn(e, t) {
  Lt(e, t).catch((n) => {
    console.warn(`${d} | Could not save call history for ${t}.`, n);
  });
}
async function qr(e) {
  var s, c;
  if (game.user.isGM) {
    const u = {
      callerName: e.name,
      subtitle: `Comms ${e.number}`,
      image: e.image,
      message: `Opening channel ${e.number}...`,
      signal: game.settings.get(d, "defaultSignal"),
      variant: "standard",
      contactNumber: e.number,
      ringing: !1
    };
    return await Lt(u, "outgoing"), ye(u);
  }
  if (!Yt())
    return (c = (s = ui.notifications) == null ? void 0 : s.warn) == null || c.call(s, "No GM is connected to receive the CyberCall."), null;
  const t = Me(), n = ze(game.user), a = X(game.user, "Unknown Caller"), r = {
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
  }, o = se({
    ...r,
    callerName: e.name,
    subtitle: `Comms ${e.number}`,
    image: e.image,
    message: `Awaiting connection to ${e.name} on ${e.number}...`,
    canAccept: !1,
    canDecline: !1,
    outgoing: !0,
    ringing: !0
  }), i = se({
    ...r,
    callerName: a,
    subtitle: `Call request from ${a}`,
    image: n,
    message: `${a} is calling ${e.name} on ${e.number}.`,
    canAccept: !0,
    ringing: !0
  });
  return game.socket.emit(ie, {
    action: "playerCallRequest",
    callData: i
  }), await Lt(o, "outgoing"), ye(o);
}
async function Zt() {
  var e, t, n;
  return game.user.isGM ? (Y || (Y = new Dr()), Y.rendered || await Y.render(!0), (n = Y.bringToFront) == null || n.call(Y), Y) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function Et() {
  var e, t, n, a;
  return $t() ? C && !((n = game.user) != null && n.isGM) ? ((a = C.bringToFront) == null || a.call(C), C) : en("calls") : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function H() {
  !I || I.callData || I.mode === "messages" || await I.render(!0);
}
async function Ne(e = null) {
  var n, a;
  if (!$t())
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "You do not have permission to use CyberCall messages."), null;
  e && (V = We(e), Q = !1, W = !1);
  const t = await en("messages", e);
  return t != null && t.callData || await Fe(), t;
}
async function Xt(e) {
  return e && (V = String(e), Q = !1, W = !1), Ne();
}
async function Xn() {
  var e;
  return (e = game.user) != null && e.isGM ? Zt() : Et();
}
async function j(e = {}) {
  !I || I.callData || I.mode !== "messages" || (I._cybercallMessageComposerState = e.composerState === void 0 ? Vn(I) : e.composerState, I._cybercallMessageScrollState = {
    ...qn(I),
    scrollToBottom: e.scrollToBottom === !0
  }, await I.render(!0));
}
function ea(e) {
  if (e.mode !== "messages" || e.callData) return;
  const t = Vn(e);
  t && (e._cybercallMessageComposerState = t);
  const n = qn(e);
  n && (e._cybercallMessageScrollState = n);
}
async function en(e = "calls", t = null) {
  var a;
  I ? (ea(I), (e !== I.mode || t) && (I.contact = t ?? I.contact), I.mode = e) : I = new Kn(e, t), Se = e === "calls" ? I : null, Z = e === "messages" ? I : null;
  const n = I;
  return n.callData || await n.render(!0), (a = n.bringToFront) == null || a.call(n), n;
}
async function tn(e = {}) {
  var n, a;
  if (!game.user.isGM)
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Only the GM can broadcast CyberCalls to all players."), null;
  const t = se({
    ...e,
    fullscreen: e.fullscreen ?? !0,
    ringing: e.ringing ?? !0
  });
  return game.socket.emit(ie, {
    action: "openCall",
    callData: t,
    targetUserIds: t.targetUserIds
  }), ye({ ...t, outgoing: !0 });
}
async function Vr(e) {
  var t, n, a, r;
  if (e.action === "personalContactDirectories") {
    (t = game.user) != null && t.isGM && await Vt();
    return;
  }
  if (e && !(Array.isArray(e.targetUserIds) && e.targetUserIds.length && !e.targetUserIds.includes((n = game.user) == null ? void 0 : n.id)) && !(Array.isArray((a = e.callData) == null ? void 0 : a.targetUserIds) && e.callData.targetUserIds.length && !e.callData.targetUserIds.includes((r = game.user) == null ? void 0 : r.id))) {
    if (e.action === "openCall") {
      if (!$t()) return;
      ye(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      ye(e.callData);
      return;
    }
    if (e.action === "acceptCall") {
      Jn(e.callId);
      return;
    }
    if (e.action === "endCall") {
      Yn(e.callId);
      return;
    }
    if (e.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const o = q({
        ...e.contact,
        image: ""
      });
      if (!o.name || !o.number) return;
      const i = be();
      i.push(o), await yt(i), await H();
      return;
    }
    if (e.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await yt(be().filter((o) => o.id !== e.contactId)), await H();
      return;
    }
    e.action === "groupContactsChanged" && (Ae = Array.isArray(e.contacts) ? e.contacts.map(q) : null, await H());
  }
}
function ta(e) {
  var t, n;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((n = e.setPosition) == null || n.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function na() {
  const e = game.settings.get(d, "ringSoundsByWorld");
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function jr() {
  return /* @__PURE__ */ new Set([
    ...Object.keys(xt),
    ...pe(game.settings.get(d, "customRingtones")).map((e) => e.path)
  ]);
}
function nn() {
  const e = we(), t = na(), n = Object.prototype.hasOwnProperty.call(t, e), a = String(n ? t[e] : game.settings.get(d, "ringSound") ?? "").trim();
  return jr().has(a) ? a : hn;
}
async function aa(e) {
  const t = we();
  await game.settings.set(d, "ringSoundsByWorld", {
    ...na(),
    [t]: String(e ?? "").trim()
  });
}
function ra() {
  const e = nn(), t = pe(game.settings.get(d, "customRingtones")), n = new Map(Object.entries(xt));
  for (const a of t)
    n.has(a.path) || n.set(a.path, a.label);
  return [...n].map(([a, r]) => ({
    value: a,
    label: r,
    selected: a === e
  }));
}
function je() {
  if (Ot += 1, !ge) return;
  const e = ge;
  ge = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function zr(e) {
  var o;
  if (je(), !e.ringing) return;
  const t = nn();
  if (!t) return;
  const a = 0.65 * (Math.max(0, Math.min(100, Number(game.settings.get(d, "ringVolume") ?? 100))) / 100), r = ((o = foundry == null ? void 0 : foundry.audio) == null ? void 0 : o.AudioHelper) ?? globalThis.AudioHelper;
  if (r != null && r.play) {
    const i = Ot;
    r.play({ src: t, volume: a, autoplay: !0, loop: !0, channel: "interface" }, !1).then((s) => {
      var c;
      i === Ot ? ge = s : typeof (s == null ? void 0 : s.stop) == "function" ? s.stop() : (c = s == null ? void 0 : s.pause) == null || c.call(s);
    }).catch((s) => {
      console.warn(`${d} | Unable to play ringing sound.`, s);
    });
  } else {
    const i = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5);
    ge = new Audio(t), ge.loop = !0, ge.volume = a * i, ge.play().catch((s) => {
      console.warn(`${d} | Unable to play ringing sound.`, s);
    });
  }
}
function Wr() {
  var s;
  const e = In();
  if (e) {
    const c = ((s = foundry == null ? void 0 : foundry.audio) == null ? void 0 : s.AudioHelper) ?? globalThis.AudioHelper;
    if (c != null && c.play)
      Promise.resolve(c.play({ src: e, volume: 0.65, loop: !1 }, !1)).catch((u) => console.warn(`${d} | Unable to play message notification sound.`, u));
    else {
      const u = new Audio(e);
      u.volume = 0.65 * Math.max(0, Math.min(1, Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5))), u.play().catch((l) => console.warn(`${d} | Unable to play message notification sound.`, l));
    }
    return;
  }
  const t = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  if (!t) return;
  const n = new t(), a = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), r = Math.max(1e-4, Math.min(0.18, 0.18 * a)), o = (c, u, l) => {
    const g = n.createOscillator(), b = n.createGain(), w = n.currentTime + u, A = w + l;
    g.type = "sine", g.frequency.setValueAtTime(c, w), g.frequency.exponentialRampToValueAtTime(c * 1.18, A), b.gain.setValueAtTime(1e-4, w), b.gain.exponentialRampToValueAtTime(r, w + 0.025), b.gain.exponentialRampToValueAtTime(1e-4, A), g.connect(b), b.connect(n.destination), g.start(w), g.stop(A);
  };
  (async () => {
    n.state === "suspended" && await n.resume(), o(620, 0, 0.16), o(930, 0.11, 0.2), window.setTimeout(() => {
      var c;
      return (c = n.close) == null ? void 0 : c.call(n);
    }, 500);
  })().catch(() => {
    var c;
    return (c = n.close) == null ? void 0 : c.call(n);
  });
}
function Hr(e) {
  var n, a, r, o, i;
  if (e.senderImage) return String(e.senderImage);
  if (e.contactIsNpc && e.senderNumber) return "";
  const t = ((a = (n = game.users) == null ? void 0 : n.get) == null ? void 0 : a.call(n, e.senderUserId)) ?? ((i = (o = (r = game.users) == null ? void 0 : r.contents) == null ? void 0 : o.find) == null ? void 0 : i.call(o, (s) => s.id === e.senderUserId));
  return (t == null ? void 0 : t.isGM) === !0 ? "" : ze(t);
}
function un(e) {
  e != null && e.isConnected && (e.classList.add("leaving"), window.setTimeout(() => e.remove(), 220));
}
function Kr(e) {
  let t = document.querySelector("[data-cybercall-message-notifications]");
  t || (t = document.createElement("div"), t.className = "cybercall-message-notifications", t.dataset.cybercallMessageNotifications = "", t.setAttribute("aria-live", "polite"), document.body.append(t));
  const n = String(e.senderName || "New message").trim(), a = String(e.groupName || "").trim(), r = document.createElement("button");
  r.type = "button", r.className = "cybercall-incoming-message", r.title = "Open CyberCall conversation";
  const o = document.createElement("span");
  o.className = `cybercall-incoming-avatar ${Sn(e.senderUserId || n)}`;
  const i = Hr(e);
  if (i) {
    const g = document.createElement("img");
    g.src = i, g.alt = "", o.append(g);
  } else
    o.textContent = ne(n);
  const s = document.createElement("i");
  s.className = "fa-solid fa-message cybercall-incoming-badge", s.setAttribute("aria-hidden", "true"), o.append(s);
  const c = document.createElement("span");
  c.className = "cybercall-incoming-copy";
  const u = document.createElement("strong");
  u.textContent = a ? `${n} · ${a}` : n;
  const l = document.createElement("small");
  l.textContent = String(e.body || "New CyberCall message").trim(), c.append(u, l), r.append(o, c), r.addEventListener("click", () => {
    un(r), Xt(String(e.threadId || ""));
  }), t.append(r), Wr(), window.setTimeout(() => un(r), 4200);
}
function Jr(e) {
  var n, a, r;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[d]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, d, "message"));
  return (t == null ? void 0 : t.kind) === oe ? t : ((r = t == null ? void 0 : t.message) == null ? void 0 : r.kind) === oe ? t.message : null;
}
function sa(e, t) {
  var a, r, o, i, s, c, u;
  if (!e) return;
  const n = (a = e.matches) != null && a.call(e, ".chat-message") ? e : ((r = e.closest) == null ? void 0 : r.call(e, ".chat-message")) ?? ((o = e.querySelector) == null ? void 0 : o.call(e, ".chat-message")) ?? e;
  (s = (i = n.classList) == null ? void 0 : i.toggle) == null || s.call(i, "cybercall-chat-message-hidden", !t), t ? (c = n.removeAttribute) == null || c.call(n, "aria-hidden") : (u = n.setAttribute) == null || u.call(n, "aria-hidden", "true");
}
function ia(e, t) {
  var a, r;
  if (!((r = (a = e == null ? void 0 : e.flags) == null ? void 0 : a[d]) != null && r.archiveNotice) && !Jr(e)) return;
  const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? (t == null ? void 0 : t.element) ?? null;
  sa(n, game.settings.get(d, "showChatCards") === !0);
}
function oa() {
  const e = game.settings.get(d, "showChatCards") === !0;
  document.querySelectorAll(".cybercall-chat-card").forEach((t) => {
    sa(t, e);
  });
}
function ca() {
  const e = game.modules.get(d);
  e && (e.api = {
    openCall: ye,
    closeCall: Qt,
    broadcastCall: tn,
    openComposer: Zt,
    openContacts: Et,
    openMessages: Ne,
    openMessagesThread: Xt,
    openCallPanel: Xn,
    getUnreadMessageCount: _n,
    get activeCall() {
      return C;
    },
    get activeComposer() {
      return Y;
    },
    get activeContacts() {
      return Se;
    },
    get activeMessages() {
      return Z;
    }
  });
}
function Yr() {
  var n;
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    brandingInApp: !0,
    brandingHeader: { textFields: {
      composerHeading: { label: "Composer heading", placeholder: "CyberCall Composer" },
      contactsHeading: { label: "Contacts heading", placeholder: "CyberCall Contacts" },
      messagesHeading: { label: "Messages heading", placeholder: "Messages" },
      transmissionSubtitle: { label: "Composer subtitle", placeholder: "Transmission Console" }
    } },
    id: d,
    title: "CyberCall",
    icon: "fa-solid fa-satellite-dish",
    premium: !1,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => {
      var a;
      return (a = game.user) != null && a.isGM ? Zt() : Et();
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
function Qr() {
  game.settings.register(d, pt, { scope: "world", config: !1, type: Boolean, default: !1 }), game.settings.register(d, "deviceEmblem", {
    name: "Device emblem",
    scope: "world",
    config: !1,
    type: String,
    default: "",
    onChange: () => dt(document)
  }), game.settings.register(d, "phoneNumberFormat", {
    name: "Phone number format",
    hint: "Use # for digits, A for letters, or * for letters or digits. Other characters are fixed text. Leave blank for unrestricted numbers.",
    scope: "world",
    config: !1,
    type: String,
    default: "",
    onChange: () => Cn(document)
  });
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
    default: K.signal,
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
    default: hn,
    choices: xt
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
      var a;
      (I == null ? void 0 : I.mode) === "settings" && H();
      const n = (a = ae(Y)) == null ? void 0 : a.querySelector("[data-cybercall-ringtone]");
      n instanceof HTMLSelectElement && n.replaceChildren(...ra().map(
        ({ label: r, value: o, selected: i }) => new Option(r, o, i, i)
      ));
    }
  }), game.settings.registerMenu(d, "customRingtonesMenu", {
    name: "Additional Ringtones",
    label: "Manage Ringtones",
    hint: "Add one or more audio files to the ringtone list for this world.",
    icon: "fa-solid fa-bell",
    type: vn,
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
      j(), H();
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
    default: [],
    onChange: () => {
      (I == null ? void 0 : I.mode) === "settings" && H();
    }
  }), game.settings.register(d, "shareMessageSounds", {
    name: "Allow Uploaded Notification Sounds to Be Used by Players",
    hint: "Let players select sounds from the GM message notification sound library. Turning this off restores the built-in tone for players using a shared sound. Personal uploads follow Foundry's file permissions.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0,
    onChange: () => {
      (I == null ? void 0 : I.mode) === "settings" && H();
    }
  }), game.settings.registerMenu(d, "messageSoundMenu", {
    name: "Message Notification Sound",
    label: "Manage Notification Sounds",
    hint: "Add one or more audio files to the notification list for this world.",
    icon: "fa-solid fa-music",
    type: Fa,
    restricted: !0
  }), game.settings.register(d, "showChatCards", {
    name: "Show CyberCall Chat Cards",
    hint: "Show CyberCall message cards in Foundry's standard chat log. Disabled by default because CyberCall has its own inbox and notifications.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: () => oa()
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
      j(), H();
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
async function Zr() {
  const e = game.settings.get(d, "contacts");
  Array.isArray(e) && await game.settings.set(d, "contacts", {
    [we()]: e.map(q)
  });
}
Hooks.once("init", () => {
  Qr(), ca();
});
Hooks.once("ready", async () => {
  var e;
  await Zr(), ca(), Yr(), game.socket.on(ie, Vr), await Vt(), await xn(), await _e(), game.user.isGM && window.setInterval(_e, 6e4), (e = game.user) != null && e.isGM || game.socket.emit(ie, { action: "personalContactDirectories" }), oa(), console.log(`${d} | Ready. Use game.modules.get("${d}").api.openCall({...})`);
});
Hooks.on("renderChatMessage", (e, t) => {
  ia(e, t);
});
Hooks.on("createUser", () => Vt());
Hooks.on("holosuite-core.brandingChanged", () => dt(document));
Hooks.on("renderJournalDirectory", (e, t) => {
  const n = ae(e, t);
  n == null || n.querySelectorAll("[data-document-id], [data-entry-id]").forEach((a) => {
    var o, i;
    const r = (i = (o = game.journal) == null ? void 0 : o.get) == null ? void 0 : i.call(o, a.dataset.documentId ?? a.dataset.entryId);
    (St(r) || r != null && r.getFlag(d, "playerPersonalContactDirectory")) && (a.hidden = !0);
  });
});
Hooks.on("renderChatMessageHTML", (e, t) => {
  ia(e, t);
});
for (const e of ["create", "update", "delete"])
  Hooks.on(`${e}JournalEntry`, (t) => {
    Za(t) && (e === "create" && xn(), H(), j());
  });
Hooks.on("userConnected", () => _e());
Hooks.on("updateUser", (e, t) => {
  var n, a;
  (a = (n = t.flags) == null ? void 0 : n[d]) != null && a.pendingMessages && (_e(), e.id === game.user.id && j());
});
Hooks.on("createJournalEntryPage", async (e, t) => {
  var c, u;
  const n = Mn(e);
  if (!n || t.cybercallMigration) return;
  const a = String(((c = game.user) == null ? void 0 : c.id) ?? ""), r = Array.isArray(n.recipientUserIds) ? n.recipientUserIds.map((l) => String(l)) : [], o = ((u = game.user) == null ? void 0 : u.isGM) === !0 && !String(n.contactUserId ?? "") && (n.contactManagedByGM === !0 || n.contactIsNpc === !0), i = String(n.senderUserId ?? "") !== a && (r.includes(a) || o), s = String(n.messageType ?? "text") === "text" || n.eventType === "group-created";
  i && s && game.settings.get(d, "messageNotifications") !== !1 && Kr(n), await j(), await H();
});
document.addEventListener("click", (e) => {
  var a;
  const t = e.target, n = (a = t == null ? void 0 : t.closest) == null ? void 0 : a.call(t, "[data-cybercall-open-thread]");
  n && (e.preventDefault(), Xt(n.dataset.cybercallThreadId));
});
Hooks.on("deleteJournalEntryPage", (e) => {
  St(e.parent) && (j(), H());
});
