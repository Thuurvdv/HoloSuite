var la = Object.defineProperty;
var ua = (e, t, n) => t in e ? la(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var O = (e, t, n) => ua(e, typeof t != "symbol" ? t + "" : t, n);
function da(e, t) {
  return e.image ? `<img src="${t(e.image)}" alt="${t(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${t(e.initials)}</div>`;
}
function Tt(e, t) {
  const n = `--cybercall-signal: ${e.signal}%; --cybercall-glitch-shift: ${e.glitchShift}px; --cybercall-glitch-interval: ${e.glitchInterval}s;`, a = e.fullscreen ? "cybercall-broadcast" : "", r = e.ringing ? "cybercall-ringing-panel" : "", s = e.accepted ? "cybercall-connected-panel" : "", o = e.showBroadcast ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>' : "", i = `
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
    `, l = e.accepted ? "" : `<blockquote>${t(e.message)}</blockquote>`, u = e.accepted || e.outgoing ? '<button type="button" data-cybercall-action="end">End Call</button>' : `
        ${e.canAccept ? '<button type="button" data-cybercall-action="accept">Accept</button>' : ""}
        <button type="button" data-cybercall-action="decline">Decline</button>
        ${o}
      `;
  return `
    <div data-cybercall-signal-quality="${e.signalQuality}" class="cybercall-panel cybercall-${e.variant} ${a} ${r} ${s}" style="${n}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${i}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${da(e, t)}</div>
        <div class="cybercall-waveform" aria-hidden="true"></div>
        ${l}
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
function Et(e, t) {
  var l;
  const n = (u, c) => u.length ? u.map((g) => `
        <li>
          <div class="cybercall-contact-avatar">
            ${g.image ? `<img src="${t(g.image)}" alt="">` : `<span>${t(g.initials)}</span>`}
          </div>
          <div class="cybercall-contact-id">
            <strong>${t(g.name)}</strong>
            <span>${t(g.number)}</span>
          </div>
          <div class="cybercall-contact-actions">
            <button type="button" data-cybercall-contact-action="call" data-contact-scope="${c}" data-contact-id="${t(g.id)}">Call</button>
            <button type="button" data-cybercall-contact-action="message" data-contact-scope="${c}" data-contact-id="${t(g.id)}">Message</button>
            <button type="button" data-cybercall-contact-action="remove" data-contact-scope="${c}" data-contact-id="${t(g.id)}">Remove</button>
          </div>
        </li>
      `).join("") : '<li class="cybercall-contacts-empty">No contacts stored.</li>', a = e.activeTab !== "group", r = e.activeTab === "group", s = (e.actors ?? []).map((u) => `<option value="${t(u.id)}">${t(u.name)}</option>`).join(""), o = e.canEditContactImages ? `
        <label>Actor
          <select name="actorId">
            <option value="">No linked actor</option>
            ${s}
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
        ${o}
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
        ${(l = e.messageSoundOptions) != null && l.length ? `
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
function Pt(e, t) {
  var T;
  const n = e.threads ?? [], a = e.activeThread ?? null, r = e.allContacts ?? [], s = n.length ? n.map((p) => `
        <button type="button" class="cybercall-thread ${p.active ? "active" : ""} ${p.hasRouteLabel ? "routed" : ""} ${p.hasNpcBinding ? "npc-linked" : ""}" data-cybercall-thread-id="${t(p.id)}" ${p.canLinkNpc ? `data-cybercall-npc-link-drop data-cybercall-npc-thread-id="${t(p.id)}"` : ""}>
          <span class="cybercall-thread-avatar ${t(p.avatarTone)} ${p.isGroup ? "group" : ""}">
            ${p.image ? `<img src="${t(p.image)}" alt="">` : p.isGroup ? '<i class="fa-solid fa-user-group" aria-hidden="true"></i>' : t(p.initials)}
          </span>
          <span class="cybercall-thread-body">
            <strong>${t(p.title)}</strong>
            ${p.hasRouteLabel ? `
              <span class="cybercall-thread-route-row">
                <span class="cybercall-thread-route">${t(p.routeLabel)}</span>
                ${p.canLinkNpc ? `
                  <span class="cybercall-thread-npc-state ${p.hasNpcBinding ? "linked" : "unlinked"}" title="${t(p.npcBindingStatusLabel)}">
                    ${p.hasNpcBinding ? p.npcBindingImage ? `<img src="${t(p.npcBindingImage)}" alt="">` : '<i class="fa-solid fa-link" aria-hidden="true"></i>' : '<i class="fa-solid fa-link-slash" aria-hidden="true"></i>'}
                  </span>
                ` : ""}
              </span>
            ` : ""}
            <small>${t(p.lastPreview)}</small>
          </span>
          ${p.unread ? `<span class="cybercall-thread-unread">${p.unreadCount}</span>` : ""}
        </button>
      `).join("") : '<div class="cybercall-messages-empty">No messages yet.</div>', o = r.map((p) => `<option value="${t(p.id)}" ${e.selectedContactId === p.id ? "selected" : ""}>${t(p.name)} - ${t(p.number)}</option>`).join(""), i = e.canReplyAs ? `
      <label>
        <span>Reply As</span>
        <select name="replyAs">
          ${(e.replyAsChoices ?? []).map(
    (p) => `<option value="${t(p.id)}" ${p.selected ? "selected" : ""}>${t(p.label)}</option>`
  ).join("")}
        </select>
      </label>
    ` : "", l = e.canSendAs ? `
      <label>
        <span>Send As</span>
        <select name="sendAs">
          ${(e.sendAsChoices ?? []).map(
    (p) => `<option value="${t(p.id)}" ${p.selected ? "selected" : ""}>${t(p.label)}</option>`
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
    `, c = (T = a == null ? void 0 : a.messages) != null && T.length ? a.messages.map((p) => `
        <article class="cybercall-message ${p.isMine ? "mine" : ""} ${p.isEvent ? "event" : ""}">
          <strong>${t(p.senderName)}</strong>
          <p>${t(p.body)}</p>
          ${e.showMessageTimestamps ? `<time>${t(p.createdAtLabel ?? p.createdAt)}</time>` : ""}
        </article>
      `).join("") : '<div class="cybercall-messages-empty">Select a thread or send a new message.</div>', C = `
    <form class="cybercall-group-form" data-cybercall-group-form>
      <label class="cybercall-group-name">
        <span>Group Name</span>
        <input type="text" name="groupName" maxlength="80" autocomplete="off" placeholder="Night City Crew" required>
      </label>
      <fieldset>
        <legend>Players</legend>
        <div class="cybercall-group-members">${(e.groupMemberChoices ?? []).length ? (e.groupMemberChoices ?? []).map((p) => `
        <label>
          <input type="checkbox" name="memberUserIds" value="${t(p.id)}">
          <span>${t(p.name)}${p.active ? "" : " (offline)"}</span>
        </label>
      `).join("") : "<p>No other player users are available.</p>"}</div>
      </fieldset>
      <button type="submit" ${e.hasGroupMemberChoices ? "" : "disabled"}>Create Group</button>
    </form>
  `, w = a != null && a.showNpcLinkPanel ? `
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
        ${w}
        ${e.isComposingNewGroup ? C : `
          <div class="cybercall-message-log">${c}</div>
          <form class="cybercall-message-form ${e.canReplyAs ? "has-reply-as" : ""} ${e.canSendAs ? "has-send-as" : ""}" data-cybercall-message-form>
            ${u}
            ${i}
            ${l}
            <textarea name="body" rows="3" placeholder="Type message..." required></textarea>
            <button type="submit" ${r.length ? "" : "disabled"}>Send</button>
          </form>
        `}
      </main>
    </section>
  `;
}
const W = {
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
}, ga = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]);
function dn(e) {
  const t = Number(e);
  return Number.isNaN(t) ? W.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function ma(e) {
  const t = dn(e), n = (100 - t) / 100;
  return {
    signalQuality: t >= 90 ? "clear" : t >= 65 ? "weak" : t >= 35 ? "poor" : "critical",
    glitchShift: Math.round(n * 7 * 100) / 100,
    glitchInterval: Math.round((1.4 + 6.6 * (1 - n)) * 100) / 100
  };
}
function te(e) {
  return String(e).split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var n;
    return (n = t[0]) == null ? void 0 : n.toUpperCase();
  }).join("") || "?";
}
function Me() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function re(e = {}) {
  var r;
  const t = Array.isArray(e.targetUserIds) ? e.targetUserIds.map((s) => String(s)).filter(Boolean) : [], n = Array.isArray(e.targetUserNames) ? e.targetUserNames.map((s) => String(s)).filter(Boolean) : [], a = {
    ...W,
    ...e,
    id: String(e.id ?? Me()),
    callerName: String(e.callerName ?? W.callerName),
    subtitle: String(e.subtitle ?? W.subtitle),
    image: String(e.image ?? W.image),
    message: String(e.message ?? W.message),
    signal: dn(e.signal ?? W.signal),
    variant: ga.has(e.variant) ? e.variant : W.variant,
    fullscreen: !!(e.fullscreen ?? W.fullscreen),
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
  return a.initials = te(a.callerName), Object.assign(a, ma(a.signal)), a.showBroadcast = !!((r = game == null ? void 0 : game.user) != null && r.isGM && a.allowBroadcast), a.isStandard = a.variant === "standard", a.isEmergency = a.variant === "emergency", a.isCorrupted = a.variant === "corrupted", a.isIncoming = !a.accepted, a.hasTargets = a.targetUserIds.length > 0, a.recipientLabel = a.hasTargets ? a.targetUserNames.join(", ") : "All players", a.directionLabel = a.outgoing ? `Calling ${a.recipientLabel}` : `From ${a.callerName}`, a.kicker = a.outgoing ? "Calling" : a.isEmergency ? "Emergency transmission" : a.isCorrupted ? "Unstable transmission" : a.fullscreen ? "Incoming broadcast" : "Incoming transmission", a;
}
function L(e = {}) {
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
    initials: te(e.name)
  };
}
function pa(e) {
  var a, r, s;
  const t = (e == null ? void 0 : e.document) ?? e, n = String(
    ((a = t == null ? void 0 : t.getTextureSrc) == null ? void 0 : a.call(t)) || ((r = t == null ? void 0 : t.texture) == null ? void 0 : r.src) || (t == null ? void 0 : t.img) || ((s = e == null ? void 0 : e.texture) == null ? void 0 : s.src) || ""
  ).trim();
  return n.includes("*") ? "" : n;
}
function st(e) {
  return !e || /(?:^|\/)mystery-man(?:-[^/.]+)?\.svg(?:$|\?)/i.test(e);
}
function We(e) {
  var p, y, S, N, A, G, k, M, J, _, B;
  if (!e) return "";
  const t = typeof game < "u" ? game : globalThis.game, n = typeof canvas < "u" ? canvas : globalThis.canvas, a = String(e.avatar ?? ((p = e._source) == null ? void 0 : p.avatar) ?? "").trim();
  if (e.isGM === !0) return st(a) ? "" : a;
  const r = gn(e), s = String((r == null ? void 0 : r.id) ?? (r == null ? void 0 : r._id) ?? ""), o = Array.isArray((y = n == null ? void 0 : n.tokens) == null ? void 0 : y.placeables) ? n.tokens.placeables : [], i = String(((S = t == null ? void 0 : t.user) == null ? void 0 : S.id) ?? "") === String(e.id ?? "") ? ((N = n == null ? void 0 : n.tokens) == null ? void 0 : N.controlled) ?? [] : [], l = ((A = r == null ? void 0 : r.getActiveTokens) == null ? void 0 : A.call(r, !0, !0)) ?? [], u = o.find((E) => {
    var U, H;
    const q = String(((U = E == null ? void 0 : E.actor) == null ? void 0 : U.id) ?? ((H = E == null ? void 0 : E.document) == null ? void 0 : H.actorId) ?? (E == null ? void 0 : E.actorId) ?? "");
    return s && q === s;
  }), c = o.find((E) => {
    var U, H;
    const q = (E == null ? void 0 : E.actor) ?? ((U = E == null ? void 0 : E.document) == null ? void 0 : U.actor);
    return Number(((H = q == null ? void 0 : q.ownership) == null ? void 0 : H[e.id]) ?? 0) >= 3;
  }), C = [...r ? i.filter(
    (E) => {
      var q, U;
      return String(((q = E == null ? void 0 : E.actor) == null ? void 0 : q.id) ?? ((U = E == null ? void 0 : E.document) == null ? void 0 : U.actorId) ?? (E == null ? void 0 : E.actorId) ?? "") === s;
    }
  ) : i, ...l, u, ...r ? [] : [c]].filter(Boolean).map(pa).find(Boolean) ?? "";
  if (C) return C;
  const w = String(
    ((k = (G = r == null ? void 0 : r.prototypeToken) == null ? void 0 : G.texture) == null ? void 0 : k.src) || ((_ = (J = (M = r == null ? void 0 : r._source) == null ? void 0 : M.prototypeToken) == null ? void 0 : J.texture) == null ? void 0 : _.src) || ""
  ).trim();
  if (w && !w.includes("*") && !st(w))
    return w;
  const T = String((r == null ? void 0 : r.img) ?? ((B = r == null ? void 0 : r._source) == null ? void 0 : B.img) ?? "").trim();
  return st(T) ? st(a) ? "" : a : T;
}
function gn(e) {
  var a, r, s;
  if (!e) return null;
  const t = typeof game < "u" ? game : globalThis.game, n = [e.character, e.characterId, (a = e._source) == null ? void 0 : a.character];
  for (const o of n) {
    const i = typeof o == "string" ? o : (o == null ? void 0 : o.id) ?? (o == null ? void 0 : o._id), l = i ? (s = (r = t == null ? void 0 : t.actors) == null ? void 0 : r.get) == null ? void 0 : s.call(r, i) : null;
    if (l) return l;
    if (o && typeof o == "object" && o.name) return o;
  }
  return null;
}
function ee(e, t = "") {
  var a;
  const n = String(((a = gn(e)) == null ? void 0 : a.name) ?? "").trim();
  return n || String((e == null ? void 0 : e.name) ?? "").trim() || t;
}
function mn(e, t = "Player") {
  const n = ee(e, t), a = String((e == null ? void 0 : e.id) ?? "");
  return {
    id: `user-${a}`,
    name: n,
    number: `@${String((e == null ? void 0 : e.name) ?? "").trim() || n}`,
    image: We(e),
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
function fa(e = {}, t = {}) {
  var a, r, s;
  const n = ((r = (a = globalThis.foundry) == null ? void 0 : a.utils) == null ? void 0 : r.mergeObject) ?? ((s = foundry == null ? void 0 : foundry.utils) == null ? void 0 : s.mergeObject);
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
function ba() {
  var t, n, a;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((a = game == null ? void 0 : game.release) == null ? void 0 : a.generation));
  return Number.isFinite(e) ? e : null;
}
function ha() {
  const e = ba();
  return e === null || e >= 13;
}
function yn(e) {
  return class extends e {
    constructor(a = {}) {
      const r = fa(new.target.defaultOptions ?? {}, a);
      super(rn(r));
      O(this, "_v1Options");
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
      var u, c, g;
      const s = typeof this.getData == "function" ? await this.getData() : {}, o = ((u = this._v1Options) == null ? void 0 : u.template) ?? ((c = this.options) == null ? void 0 : c.template) ?? ((g = this.constructor.defaultOptions) == null ? void 0 : g.template);
      if (!o) return document.createDocumentFragment();
      const i = await globalThis.renderTemplate(o, s), l = document.createElement("template");
      return l.innerHTML = i.trim(), l.content;
    }
    _activateV1Form(a) {
      var s, o;
      if (typeof this._updateObject != "function") return;
      const r = (s = a.matches) != null && s.call(a, "form") ? a : (o = a.querySelector) == null ? void 0 : o.call(a, "form");
      r instanceof HTMLFormElement && r.addEventListener("submit", async (i) => {
        var u;
        i.preventDefault(), i.stopPropagation();
        const l = new FormData(r);
        await this._updateObject(i, l), ((u = this._v1Options) == null ? void 0 : u.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(a, r, s) {
      var c, g, C, w;
      r.replaceChildren(a);
      const o = globalThis.jQuery ?? globalThis.$, i = ((c = r.closest) == null ? void 0 : c.call(r, ".window-app, .app, .application")) ?? r, l = o ? o(i) : i;
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
      const u = (g = this._v1Options) == null ? void 0 : g.classes;
      Array.isArray(u) && u.length && (r.classList.add(...u), (w = (C = r.closest) == null ? void 0 : C.call(r, ".window-app, .app, .application")) == null || w.classList.add(...u)), this._activateV1Form(r), typeof this.activateListeners == "function" && this.activateListeners(o ? o(r) : r);
    }
  };
}
function Ca() {
  const e = pn(), t = fn(), n = globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (n) return n;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? yn(a) : null;
}
function wa() {
  const e = pn(), t = fn(), n = globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (n) return n;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? yn(a) : Ca();
}
function va() {
  var n, a, r, s, o, i;
  const e = ((a = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : a.api) ?? ((r = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : r.api) ?? null, t = ((o = (s = globalThis.foundry) == null ? void 0 : s.applications) == null ? void 0 : o.api) ?? ((i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function Sa(e) {
  var Re, Oe, he, Le;
  const {
    moduleId: t,
    templatePath: n,
    composerTemplatePath: a,
    contactsTemplatePath: r,
    messagesTemplatePath: s,
    phoneTemplatePath: o,
    escapeHTML: i,
    getDefaultComposerData: l,
    getActorChoices: u,
    getPlayerChoices: c,
    getContacts: g,
    getGroupContacts: C,
    getMessageContext: w,
    getCallHistory: T,
    bindPhoneNavigation: p,
    getRingtoneChoices: y,
    getMessageSoundOptions: S,
    getSoundPath: N,
    getActiveContactsTab: A,
    getContactsPlayerChoices: G,
    getSelectedContactsPlayerId: k,
    getPlayerContacts: M,
    canEditContactImages: J,
    bindCallControls: _,
    bindComposerControls: B,
    bindContactsControls: E,
    bindMessagesControls: q,
    stopRinging: U,
    clearActiveCall: H,
    clearActiveComposer: ae,
    clearActiveContacts: Ee,
    clearActiveMessages: V,
    clearActivePhone: Pe
  } = e, Y = (Oe = (Re = foundry == null ? void 0 : foundry.applications) == null ? void 0 : Re.api) == null ? void 0 : Oe.ApplicationV2, j = (Le = (he = foundry == null ? void 0 : foundry.applications) == null ? void 0 : he.api) == null ? void 0 : Le.HandlebarsApplicationMixin, fe = va(), ye = ha();
  function Ge() {
    var R;
    const m = g(), h = C(), f = A(), b = k(), { unreadCount: P } = w();
    return {
      contacts: m,
      groupContacts: h,
      hasContacts: m.length > 0,
      hasGroupContacts: h.length > 0,
      activeTab: f,
      isPersonalTab: f === "personal",
      isPlayerTab: f === "player",
      players: G(),
      playerContacts: (R = game.user) != null && R.isGM ? M(b) : [],
      hideContactEditor: f === "player" && !b,
      isGroupTab: f === "group",
      canEditContactImages: J(),
      canManageNpcContacts: J(),
      actors: u(),
      unreadMessageCount: P,
      hasUnreadMessages: P > 0,
      ringtoneChoices: y(),
      messageSoundOptions: S(),
      currentRingtone: N()
    };
  }
  function ke() {
    const m = l();
    return {
      call: m,
      previewCall: re({ ...m, fullscreen: !1 }),
      actors: u(),
      players: c(),
      ringtoneChoices: y(),
      phoneNumberFormat: game.settings.get(t, "phoneNumberFormat"),
      deviceEmblem: game.settings.get(t, "deviceEmblem")
    };
  }
  function Ue(m, h = null, f = null) {
    if (f) return { call: f, isCallScreen: !0 };
    const b = m === "messages", P = m === "history", R = m === "settings", ca = !b && !P && !R;
    return {
      ...b ? w(h) : Ge(),
      mode: m,
      inPhone: !0,
      isMessagesMode: b,
      isHistoryMode: P,
      isSettingsMode: R,
      isContactsMode: ca,
      history: P ? T() : []
    };
  }
  let we;
  async function be() {
    var f, b;
    const m = (f = foundry == null ? void 0 : foundry.applications) == null ? void 0 : f.handlebars, h = ((b = m == null ? void 0 : m.loadTemplates) == null ? void 0 : b.bind(m)) ?? globalThis.loadTemplates;
    we ?? (we = Promise.resolve(h([
      n,
      r,
      s
    ])).catch((P) => {
      throw we = void 0, P;
    })), await we;
  }
  function Be(m) {
    return m.isCallScreen ? Tt(m.call, i) : m.isMessagesMode ? Pt(m, i) : Et(m, i);
  }
  function oe(m) {
    const h = document.createElement("template");
    h.innerHTML = m.trim();
    const f = h.content.firstElementChild;
    return {
      main: f instanceof HTMLElement ? f : document.createElement("div")
    };
  }
  function De(m, h = null) {
    if (m.callData) {
      _(m, h);
      return;
    }
    p(m, h), m.mode === "messages" ? q(m, h) : E(m, h);
  }
  class Ye extends fe {
    constructor(f, b = {}) {
      super(b);
      O(this, "callData");
      this.callData = re(f);
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
    async _renderInner(f) {
      try {
        return await super._renderInner(f);
      } catch (b) {
        return console.warn(`${t} | Template render failed, using inline fallback.`, b), $(Tt(this.callData, i));
      }
    }
    activateListeners(f) {
      super.activateListeners(f), _(this, f);
    }
    async close(f) {
      return H(this), U(), super.close(f);
    }
  }
  class Qe extends fe {
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
      return ke();
    }
    async _renderInner(h) {
      try {
        return await be(), await super._renderInner(h);
      } catch (f) {
        return console.warn(`${t} | Composer template render failed, using inline fallback.`, f), $(an(h, i));
      }
    }
    activateListeners(h) {
      super.activateListeners(h), B(this, h);
    }
    async close(h) {
      return ae(this), super.close(h);
    }
  }
  class Ze extends fe {
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
    async _renderInner(h) {
      try {
        return await super._renderInner(h);
      } catch (f) {
        return console.warn(`${t} | Contacts template render failed, using inline fallback.`, f), $(Et(h, i));
      }
    }
    activateListeners(h) {
      super.activateListeners(h), E(this, h);
    }
    async close(h) {
      return Ee(this), super.close(h);
    }
  }
  class Xe extends fe {
    constructor(f = "calls", b = null, P = {}) {
      super(P);
      O(this, "mode");
      O(this, "contact");
      O(this, "callData", null);
      this.mode = f, this.contact = b;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-phone",
        title: "CyberCall",
        template: o,
        classes: ["cybercall-phone-app"],
        popOut: !0,
        resizable: !0,
        width: Math.min(444, window.innerWidth - 16),
        height: Math.min(752, window.innerHeight - 24)
      });
    }
    getData() {
      return Ue(this.mode, this.contact, this.callData);
    }
    async _renderInner(f) {
      try {
        return await be(), await super._renderInner(f);
      } catch (b) {
        return console.warn(`${t} | Phone template render failed, using inline fallback.`, b), $(Be(f));
      }
    }
    activateListeners(f) {
      super.activateListeners(f), De(this, f);
    }
    async close(f) {
      return Pe(this), super.close(f);
    }
  }
  class et extends fe {
    constructor(f = null, b = {}) {
      super(b);
      O(this, "contact");
      this.contact = f;
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
    async _renderInner(f) {
      try {
        return await super._renderInner(f);
      } catch (b) {
        return console.warn(`${t} | Messages template render failed, using inline fallback.`, b), $(Pt(f, i));
      }
    }
    activateListeners(f) {
      super.activateListeners(f), q(this, f);
    }
    async close(f) {
      return V(this), super.close(f);
    }
  }
  function tt() {
    var m;
    return !ye || !Y || !j ? null : (m = class extends j(Y) {
      constructor(b, P = {}) {
        super(P);
        O(this, "callData");
        this.callData = re(b);
      }
      async _prepareContext(b) {
        return {
          ...await super._prepareContext(b),
          call: this.callData
        };
      }
      async _renderHTML(b, P) {
        try {
          return await super._renderHTML(b, P);
        } catch (R) {
          return console.warn(`${t} | Template render failed, using inline fallback.`, R), oe(Tt(this.callData, i));
        }
      }
      _onRender(b, P) {
        var R;
        (R = super._onRender) == null || R.call(this, b, P), _(this);
      }
      async close(b) {
        return H(this), U(), super.close(b);
      }
    }, O(m, "DEFAULT_OPTIONS", {
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
    }), O(m, "PARTS", {
      main: {
        template: n
      }
    }), m);
  }
  function nt() {
    var m;
    return !ye || !Y || !j ? null : (m = class extends j(Y) {
      async _prepareContext(f) {
        return {
          ...await super._prepareContext(f),
          ...ke()
        };
      }
      async _renderHTML(f, b) {
        try {
          return await be(), await super._renderHTML(f, b);
        } catch (P) {
          return console.warn(`${t} | Composer template render failed, using inline fallback.`, P), oe(an(f, i));
        }
      }
      _onRender(f, b) {
        var P;
        (P = super._onRender) == null || P.call(this, f, b), B(this);
      }
      async close(f) {
        return ae(this), super.close(f);
      }
    }, O(m, "DEFAULT_OPTIONS", {
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
    }), O(m, "PARTS", {
      main: {
        template: a
      }
    }), m);
  }
  function at() {
    var m;
    return !ye || !Y || !j ? null : (m = class extends j(Y) {
      async _prepareContext(f) {
        return {
          ...await super._prepareContext(f),
          ...Ge()
        };
      }
      async _renderHTML(f, b) {
        try {
          return await super._renderHTML(f, b);
        } catch (P) {
          return console.warn(`${t} | Contacts template render failed, using inline fallback.`, P), oe(Et(f, i));
        }
      }
      _onRender(f, b) {
        var P;
        (P = super._onRender) == null || P.call(this, f, b), E(this);
      }
      async close(f) {
        return Ee(this), super.close(f);
      }
    }, O(m, "DEFAULT_OPTIONS", {
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
    }), O(m, "PARTS", {
      main: {
        template: r
      }
    }), m);
  }
  function rt() {
    var m;
    return !ye || !Y || !j ? null : (m = class extends j(Y) {
      constructor(b = "calls", P = null, R = {}) {
        super(R);
        O(this, "mode");
        O(this, "contact");
        O(this, "callData", null);
        this.mode = b, this.contact = P;
      }
      async _prepareContext(b) {
        return {
          ...await super._prepareContext(b),
          ...Ue(this.mode, this.contact, this.callData)
        };
      }
      async _renderHTML(b, P) {
        try {
          return await be(), await super._renderHTML(b, P);
        } catch (R) {
          return console.warn(`${t} | Phone template render failed, using inline fallback.`, R), oe(Be(b));
        }
      }
      _onRender(b, P) {
        var R;
        (R = super._onRender) == null || R.call(this, b, P), De(this);
      }
      async close(b) {
        return Pe(this), super.close(b);
      }
    }, O(m, "DEFAULT_OPTIONS", {
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
    }), O(m, "PARTS", {
      main: {
        template: o
      }
    }), m);
  }
  function ve() {
    var m;
    return !ye || !Y || !j ? null : (m = class extends j(Y) {
      constructor(b = null, P = {}) {
        super(P);
        O(this, "contact");
        this.contact = b;
      }
      async _prepareContext(b) {
        return {
          ...await super._prepareContext(b),
          ...w(this.contact)
        };
      }
      async _renderHTML(b, P) {
        try {
          return await super._renderHTML(b, P);
        } catch (R) {
          return console.warn(`${t} | Messages template render failed, using inline fallback.`, R), oe(Pt(b, i));
        }
      }
      _onRender(b, P) {
        var R;
        (R = super._onRender) == null || R.call(this, b, P), q(this);
      }
      async close(b) {
        return V(this), super.close(b);
      }
    }, O(m, "DEFAULT_OPTIONS", {
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
    }), O(m, "PARTS", {
      main: {
        template: s
      }
    }), m);
  }
  return {
    CyberCallApplication: tt() ?? Ye,
    CyberCallComposer: nt() ?? Qe,
    CyberCallContacts: at() ?? Ze,
    CyberCallMessages: ve() ?? et,
    CyberCallPhone: rt() ?? Xe
  };
}
const d = "cybercall", se = `module.${d}`, Ia = `modules/${d}/templates/cybercall.hbs`, Aa = `modules/${d}/templates/cybercall-composer.hbs`, Na = `modules/${d}/templates/cybercall-contacts.hbs`, Ma = `modules/${d}/templates/cybercall-messages.hbs`, $a = `modules/${d}/templates/cybercall-phone.hbs`, Ta = `modules/${d}/templates/ringtone-settings.hbs`, ie = "phoneMessage", bn = 3, Lt = {
  "": "Silent",
  [`modules/${d}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${d}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${d}/audio/Ringtone3.ogg`]: "Ringtone 3"
}, hn = `modules/${d}/audio/Ringtone1.ogg`;
function ct(e) {
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
function Ea(e, t) {
  var n;
  for (const a of ["cybercall", "holosuite-core"])
    try {
      const r = ((n = e == null ? void 0 : e.getBranding) == null ? void 0 : n.call(e, a)) ?? {}, s = ct(r.logo) || ct(r.iconImage);
      if (s) return { image: s, icon: "" };
      if (typeof r.icon == "string" && /^fa-[a-z0-9-]+$/.test(r.icon)) return { image: "", icon: r.icon };
    } catch {
    }
  return { image: ct(t), icon: "" };
}
function ut(e) {
  var a, r, s;
  let t = "";
  try {
    t = game.settings.get("cybercall", "deviceEmblem") ?? "";
  } catch {
  }
  const n = Ea((s = (r = (a = game.modules) == null ? void 0 : a.get) == null ? void 0 : r.call(a, "holosuite-core")) == null ? void 0 : s.api, t);
  e.querySelectorAll(".cybercall-hardware-emblem").forEach((o) => {
    const i = n.image || n.icon;
    if ((o.dataset.cybercallEmblem ?? "") !== i) {
      if (o.dataset.cybercallEmblem = i, o.replaceChildren(), o.classList.toggle("cybercall-custom-emblem", !!i), n.image) {
        const l = document.createElement("img");
        l.alt = "", l.src = n.image, l.addEventListener("error", () => {
          l.parentElement === o && (o.replaceChildren(), o.classList.remove("cybercall-custom-emblem"));
        }, { once: !0 }), o.append(l);
      } else if (n.icon) {
        const l = document.createElement("i");
        l.className = `fa-solid ${n.icon}`, o.append(l);
      }
    }
  });
}
function dt() {
  return String(game.settings.get(d, "phoneNumberFormat") ?? "").trim();
}
function ht(e) {
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
  const t = ht(e), n = (t == null ? void 0 : t.filter((a) => a.pattern).length) ?? 0;
  return t !== null && n > 0 && n <= 32;
}
function sn(e, t) {
  if (!t) return e;
  const n = ht(t);
  if (!n) return e;
  let a = "", r = "", s = 0, o = 0;
  for (let i = 0; i < n.length; i++) {
    const l = n[i];
    if (l.literal !== void 0) {
      r += l.literal;
      const u = n.slice(i + 1).some((c) => c.pattern);
      e.startsWith(l.literal, s) && (!u || e.length - s > l.literal.length) && (s += l.literal.length);
      continue;
    }
    for (; s < e.length && !l.pattern.test(e[s]); ) s++;
    if (s >= e.length) break;
    a += r + e[s++], r = "", o++;
  }
  return o && o === n.filter((i) => i.pattern).length && (a += r), o ? a : "";
}
function Ga(e, t) {
  if (!t) return !0;
  const n = ht(t);
  if (!n) return !1;
  const a = n.map((r) => {
    var s;
    return ((s = r.pattern) == null ? void 0 : s.source) ?? r.literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("");
  return new RegExp(`^${a}$`).test(e);
}
function Cn(e) {
  e.querySelectorAll('[data-cybercall-contacts-form] input[name="number"]').forEach((t) => {
    const n = dt(), a = ht(n), r = a == null ? void 0 : a.some((s) => {
      var o;
      return (o = s.pattern) == null ? void 0 : o.test("A");
    });
    t.type = r ? "text" : "tel", t.inputMode = r ? "text" : n ? "numeric" : "tel", t.placeholder = n || "Phone number", t.title = n ? `Format: ${n} (# = digit, A = letter, * = letter or digit)` : "Phone number", n ? t.maxLength = (a == null ? void 0 : a.reduce((s, o) => {
      var i;
      return s + (((i = o.literal) == null ? void 0 : i.length) ?? 1);
    }, 0)) ?? n.length : t.removeAttribute("maxlength"), t.setCustomValidity(""), !t.dataset.cybercallNumberBound && (t.dataset.cybercallNumberBound = "true", t.addEventListener("input", () => {
      const s = dt();
      if (s) {
        const o = t.selectionStart ?? t.value.length, i = sn(t.value.slice(0, o), s);
        t.value = sn(t.value, s);
        const l = Math.min(i.length, t.value.length);
        t.setSelectionRange(l, l);
      }
      t.setCustomValidity("");
    }));
  });
}
const ka = wa();
function wn(e) {
  var n;
  const t = ((n = e.split("/").pop()) == null ? void 0 : n.replace(/\.[^.]+$/, "")) ?? "Custom ringtone";
  try {
    return decodeURIComponent(t);
  } catch {
    return t;
  }
}
function de(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  return e.flatMap((n) => {
    const a = String((n == null ? void 0 : n.path) ?? "").trim();
    return !a || t.has(a) ? [] : (t.add(a), [{ label: String((n == null ? void 0 : n.label) ?? "").trim() || wn(a), path: a }]);
  });
}
function Ct() {
  var n, a, r, s, o, i, l, u, c;
  const e = globalThis.foundry;
  return [
    typeof FilePicker < "u" ? FilePicker : null,
    globalThis.FilePicker,
    (r = (a = (n = e == null ? void 0 : e.applications) == null ? void 0 : n.apps) == null ? void 0 : a.FilePicker) == null ? void 0 : r.implementation,
    (o = (s = e == null ? void 0 : e.applications) == null ? void 0 : s.apps) == null ? void 0 : o.FilePicker,
    (l = (i = e == null ? void 0 : e.applications) == null ? void 0 : i.api) == null ? void 0 : l.FilePicker,
    (c = (u = e == null ? void 0 : e.appv1) == null ? void 0 : u.api) == null ? void 0 : c.FilePicker
  ].find((g) => typeof g == "function") ?? null;
}
function Ua(e, t) {
  var a;
  const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? ((a = e.element) == null ? void 0 : a[0]) ?? e.element ?? null;
  return n instanceof HTMLElement ? n : null;
}
function Ba(e) {
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
class vn extends ka {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-ringtone-settings",
      title: "CyberCall Ringtones",
      template: Ta,
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
      ringtones: de(game.settings.get(d, "customRingtones"))
    };
  }
  activateListeners(t) {
    var r;
    super.activateListeners(t);
    const n = Ua(this, t), a = n == null ? void 0 : n.querySelector("[data-ringtone-list]");
    !n || !a || ((r = n.querySelector("[data-ringtone-add]")) == null || r.addEventListener("click", () => {
      var o;
      const s = Ba(a.querySelectorAll("[data-ringtone-row]").length);
      (o = a.querySelector("[data-ringtone-empty]")) == null || o.before(s);
    }), n.addEventListener("click", (s) => {
      var w, T, p, y, S, N;
      const o = s.target, i = (w = o == null ? void 0 : o.closest) == null ? void 0 : w.call(o, "[data-ringtone-remove]");
      if (i) {
        (T = i.closest("[data-ringtone-row]")) == null || T.remove();
        return;
      }
      const l = (p = o == null ? void 0 : o.closest) == null ? void 0 : p.call(o, "[data-ringtone-browse]");
      if (!l) return;
      const u = l.closest("[data-ringtone-row]"), c = u == null ? void 0 : u.querySelector("[data-ringtone-path]"), g = Ct();
      if (!c || !g) {
        (S = (y = ui.notifications) == null ? void 0 : y.warn) == null || S.call(y, "Foundry FilePicker is unavailable.");
        return;
      }
      const C = new g({
        type: "audio",
        current: c.value,
        callback: (A) => {
          c.value = A;
          const G = u == null ? void 0 : u.querySelector("[data-ringtone-label]");
          G && !G.value.trim() && (G.value = wn(A));
        }
      });
      typeof C.browse == "function" ? C.browse() : (N = C.render) == null || N.call(C, !0);
    }));
  }
  async _updateObject(t) {
    var r, s;
    const a = [...t.currentTarget.querySelectorAll("[data-ringtone-row]")].map((o) => {
      var i, l;
      return {
        label: ((i = o.querySelector("[data-ringtone-label]")) == null ? void 0 : i.value) ?? "",
        path: ((l = o.querySelector("[data-ringtone-path]")) == null ? void 0 : l.value) ?? ""
      };
    });
    await game.settings.set(d, "customRingtones", de(a)), (s = (r = ui.notifications) == null ? void 0 : r.info) == null || s.call(r, "CyberCall ringtones saved.");
  }
}
function Da(e, t) {
  var s, o;
  const n = t.querySelector('[name="phoneNumberFormat"]'), a = t.querySelector('[name="deviceEmblem"]'), r = e.querySelector("[data-cybercall-configuration-status]");
  (s = e.querySelector("[data-cybercall-emblem-browse]")) == null || s.addEventListener("click", () => {
    var u, c;
    if (!((u = game.user) != null && u.isGM)) return;
    const i = Ct();
    if (!a || !i) return;
    const l = new i({
      type: "image",
      current: a.value,
      callback: (g) => {
        a.value = g, a.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    });
    typeof l.browse == "function" ? l.browse() : (c = l.render) == null || c.call(l, !0);
  }), (o = e.querySelector("[data-cybercall-save-configuration]")) == null || o.addEventListener("click", async () => {
    var u;
    if (!((u = game.user) != null && u.isGM) || !n || !a) return;
    const i = n.value.trim();
    if (!Pa(i)) {
      n.setCustomValidity("Use # for digits, A for letters, or * for letters or digits (maximum 32 placeholders). Other printable characters are fixed text. Escape a literal placeholder with a backslash."), n.reportValidity();
      return;
    }
    const l = a.value.trim();
    if (l && !ct(l)) {
      a.setCustomValidity("Choose a PNG, WebP, SVG, JPEG, GIF, or AVIF image."), a.reportValidity();
      return;
    }
    await game.settings.set(d, "phoneNumberFormat", i), await game.settings.set(d, "deviceEmblem", l), r && (r.textContent = "Configuration saved.");
  });
  for (const i of [n, a])
    i == null || i.addEventListener("input", () => {
      i.setCustomValidity(""), r && (r.textContent = "");
    });
}
function wt(e) {
  if (!e) return;
  if (Ra(e), e.querySelector(":scope > .cybercall-hardware")) {
    ut(e);
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
    <span class="cybercall-hardware-light cybercall-hardware-light-br"></span>`, e.append(t), ut(e);
}
function Ra(e) {
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
    for (const [a, r, s, o] of [
      ["toggle", '[data-action="toggleControls"], [data-action="toggle-controls"]', "Toggle Controls", "fa-ellipsis-vertical"],
      ["close", '[data-action="close"], .close', "Close Window", "fa-xmark"]
    ]) {
      const i = t.querySelector(r);
      if (!i || i.hidden || i.classList.contains("hidden")) continue;
      const l = document.createElement("button");
      l.type = "button", l.dataset.cybercallWindowAction = a, a === "toggle" && (l.classList.add("header-control"), l.dataset.action = "toggleControls"), l.setAttribute("aria-label", s), l.title = s, l.innerHTML = `<i class="fa-solid ${o}" aria-hidden="true"></i>`, l.addEventListener("click", (u) => {
        if (u.preventDefault(), a === "toggle") {
          const c = e.querySelector(":scope > .controls-dropdown");
          if (c) {
            const g = e.getBoundingClientRect(), C = l.getBoundingClientRect();
            c.style.top = `${(C.bottom - g.top) / (g.height / e.offsetHeight) + 4}px`, c.style.right = `${(g.right - C.right) / (g.width / e.offsetWidth)}px`;
          }
          return;
        }
        u.stopPropagation(), i.click();
      }), n.append(l);
    }
}
function kt(e) {
  var l, u;
  const t = new FormData(e), n = (l = game.actors) == null ? void 0 : l.get(t.get("actorId")), a = String(t.get("image") ?? "").trim() || (n == null ? void 0 : n.img) || "", r = String(t.get("callerName") ?? "").trim() || (n == null ? void 0 : n.name) || "UNKNOWN CALLER", s = t.getAll("targetUserIds").map((c) => String(c)).filter(Boolean), o = new Map((((u = game.users) == null ? void 0 : u.contents) ?? []).map((c) => [c.id, c])), i = s.map((c) => ee(o.get(c)) || c);
  return re({
    callerName: r,
    subtitle: String(t.get("subtitle") ?? "").trim(),
    image: a,
    message: String(t.get("message") ?? "").trim(),
    signal: t.get("signal"),
    variant: String(t.get("variant") ?? W.variant),
    fullscreen: t.get("fullscreen") === "on",
    ringing: t.get("ringing") === "on",
    targetUserIds: s,
    targetUserNames: i
  });
}
function it(e) {
  const t = kt(e), n = e.querySelector("[data-cybercall-signal-output]");
  n && (n.textContent = `${t.signal}%`);
  const a = e.querySelector("[data-cybercall-live-preview]"), r = a == null ? void 0 : a.querySelector(".cybercall-panel");
  if (!r) return;
  a.classList.toggle("cybercall-preview-wide", t.fullscreen), wt(a);
  for (const u of ["standard", "emergency", "corrupted"])
    r.classList.toggle(`cybercall-${u}`, t.variant === u);
  r.classList.toggle("cybercall-broadcast", t.fullscreen), r.classList.toggle("cybercall-ringing-panel", t.ringing), r.style.setProperty("--cybercall-signal", `${t.signal}%`), r.dataset.cybercallSignalQuality = t.signalQuality, r.style.setProperty("--cybercall-glitch-shift", `${t.glitchShift}px`), r.style.setProperty("--cybercall-glitch-interval", `${t.glitchInterval}s`), r.querySelector("[data-cybercall-preview-name]").textContent = t.callerName;
  const s = r.querySelector("[data-cybercall-preview-subtitle]");
  s && (s.textContent = t.subtitle), r.querySelector("[data-cybercall-preview-message]").textContent = t.message, r.querySelector("[data-cybercall-preview-signal]").textContent = `${t.signal}%`;
  const o = r.querySelector("[data-cybercall-preview-status]");
  o.querySelector("span").textContent = t.kicker, o.querySelector("i").className = `fa-solid ${t.isEmergency ? "fa-triangle-exclamation" : "fa-satellite-dish"}`;
  const i = r.querySelector("[data-cybercall-preview-portrait]"), l = i.querySelector("img");
  if (t.image) {
    const u = l ?? document.createElement("img");
    u.getAttribute("src") !== t.image && u.setAttribute("src", t.image), u.alt = t.callerName, l || i.replaceChildren(u);
  } else {
    const u = i.querySelector(".cybercall-initials") ?? document.createElement("span");
    u.className = "cybercall-initials", u.textContent = t.initials, u.parentNode !== i && i.replaceChildren(u);
  }
}
function xt() {
  var n, a;
  const e = ((n = game.user) == null ? void 0 : n.getFlag(d, "messageSound")) ?? {}, t = (a = game.user) != null && a.isGM || game.settings.get(d, "shareMessageSounds") !== !1 ? de(game.settings.get(d, "customMessageSounds")) : [];
  return de([
    ...e.path ? [{ label: e.label || "My uploaded sound", path: e.path }] : [],
    ...t
  ]);
}
function Sn() {
  var t, n;
  const e = (n = (t = game.user) == null ? void 0 : t.getFlag(d, "messageSound")) == null ? void 0 : n.selected;
  return xt().some((a) => a.path === e) ? e : "";
}
function Oa() {
  const e = Sn();
  return [
    { value: "", label: "Built-in notification tone", selected: !e },
    ...xt().map(({ path: t, label: n }) => ({ value: t, label: n, selected: t === e }))
  ];
}
async function La(e) {
  if (e && !xt().some((n) => n.path === e)) return;
  const t = game.user.getFlag(d, "messageSound") ?? {};
  await game.user.setFlag(d, "messageSound", { ...t, selected: e });
}
class xa extends vn {
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
      ringtones: de(game.settings.get(d, "customMessageSounds"))
    };
  }
  async _updateObject(t) {
    var r, s, o, i;
    if (!((r = game.user) != null && r.isGM)) return;
    const n = t.currentTarget, a = [...n.querySelectorAll("[data-ringtone-row]")].map((l) => {
      var u, c;
      return {
        label: ((u = l.querySelector("[data-ringtone-label]")) == null ? void 0 : u.value) ?? "",
        path: ((c = l.querySelector("[data-ringtone-path]")) == null ? void 0 : c.value) ?? ""
      };
    });
    await game.settings.set(d, "customMessageSounds", de(a)), await game.settings.set(d, "shareMessageSounds", ((s = n.querySelector("[data-share-message-sounds]")) == null ? void 0 : s.checked) === !0), (i = (o = ui.notifications) == null ? void 0 : o.info) == null || i.call(o, "CyberCall notification sound library saved.");
  }
}
function qe(e) {
  var n;
  if ((n = foundry == null ? void 0 : foundry.utils) != null && n.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
function D(e, t = "") {
  return String(e ?? t).trim();
}
function Se(e) {
  return [...new Set(e.map((t) => D(t)).filter(Boolean))];
}
function Fa() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function In(e) {
  const t = D(e, "cybercall");
  let n = 0;
  for (let a = 0; a < t.length; a += 1)
    n = (n << 5) - n + t.charCodeAt(a) | 0;
  return `tone-${Math.abs(n) % 8 + 1}`;
}
function on(e, t) {
  return ["direct", ...[e, t].sort()].join(":");
}
function _a() {
  return `msg-${Me()}`;
}
function qa(e = Me()) {
  return `group:${D(e)}`;
}
function Ke(e, t = ((a) => (a = game == null ? void 0 : game.user) == null ? void 0 : a.id)(), n = {}) {
  const r = L(e), s = D(n.senderNumber) || D(n.senderActorId), o = s ? `contact:${s}` : `user:${D(t, "unknown")}`;
  if (e != null && e.userId)
    return on(o, `user:${D(e.userId)}`);
  const i = r.number || r.actorId || r.id || r.name;
  return on(o, `contact:${i}`);
}
function vt(e = {}) {
  var t;
  return {
    id: D(e.id) || _a(),
    threadId: D(e.threadId) || Ke({ number: ((t = e.recipientNumbers) == null ? void 0 : t[0]) ?? e.senderNumber }),
    senderUserId: D(e.senderUserId),
    senderActorId: D(e.senderActorId),
    senderName: D(e.senderName, "Unknown Sender"),
    senderNumber: D(e.senderNumber),
    senderImage: D(e.senderImage),
    recipientUserIds: Se(e.recipientUserIds ?? []),
    recipientActorIds: Se(e.recipientActorIds ?? []),
    recipientNumbers: Se(e.recipientNumbers ?? []),
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
    groupMemberUserIds: Se(e.groupMemberUserIds ?? []),
    groupMemberNames: Se(e.groupMemberNames ?? []),
    createdAt: D(e.createdAt) || Fa(),
    chatMessageId: D(e.chatMessageId),
    schemaVersion: Number(e.schemaVersion ?? bn)
  };
}
function An(e, t = [], n = "", a = {}) {
  const r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (const i of t) {
    const l = L(i), u = { ...l, userId: i == null ? void 0 : i.userId, userIds: (i == null ? void 0 : i.userIds) ?? l.userIds };
    l.number && r.set(l.number, u), i != null && i.userId && s.set(String(i.userId), u);
  }
  const o = /* @__PURE__ */ new Map();
  for (const i of e.map(vt).filter((l) => l.body)) {
    const l = o.get(i.threadId) ?? [];
    l.push(i), o.set(i.threadId, l);
  }
  return [...o.entries()].map(([i, l]) => {
    var Ue, we, be, Be, oe, De, Ye, Qe, Ze, Xe, et, tt, nt, at, rt, ve, Re, Oe, he, Le;
    const u = l.sort((m, h) => m.createdAt.localeCompare(h.createdAt)), c = u[u.length - 1] ?? null, g = [...u].reverse().find((m) => m.conversationType === "group" || m.groupId), C = !!g, w = (g == null ? void 0 : g.groupId) || (C ? i.replace(/^group:/, "") : ""), T = (g == null ? void 0 : g.groupName) || (C ? "Group Chat" : ""), p = g ? Se([
      g.senderUserId,
      ...g.recipientUserIds
    ]) : [], y = (g == null ? void 0 : g.groupMemberNames) ?? [], S = y.length ? y : p.map((m) => {
      var h, f;
      return ee((f = (h = game.users) == null ? void 0 : h.get) == null ? void 0 : f.call(h, m));
    }).filter(Boolean), N = (c == null ? void 0 : c.senderUserId) === ((Ue = game == null ? void 0 : game.user) == null ? void 0 : Ue.id) ? (we = c == null ? void 0 : c.recipientUserIds) == null ? void 0 : we.find((m) => {
      var h;
      return m !== ((h = game == null ? void 0 : game.user) == null ? void 0 : h.id);
    }) : c == null ? void 0 : c.senderUserId, A = (c == null ? void 0 : c.senderUserId) === ((be = game == null ? void 0 : game.user) == null ? void 0 : be.id) ? ((Be = c == null ? void 0 : c.recipientNumbers) == null ? void 0 : Be[0]) || "" : (c == null ? void 0 : c.senderNumber) || ((oe = c == null ? void 0 : c.recipientNumbers) == null ? void 0 : oe[0]) || "", G = c != null && c.contactName && !(c != null && c.contactUserId) && (c.contactIsNpc || c.contactManagedByGM) ? {
      id: `contact-${((De = c.recipientNumbers) == null ? void 0 : De[0]) || c.senderNumber || i}`,
      name: c.contactName,
      number: ((Ye = c.recipientNumbers) == null ? void 0 : Ye[0]) || c.senderNumber || "",
      image: c.contactImage || "",
      actorId: ((Qe = c.recipientActorIds) == null ? void 0 : Qe[0]) ?? c.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: te(c.contactName)
    } : null, k = (c == null ? void 0 : c.senderUserId) !== ((Ze = game == null ? void 0 : game.user) == null ? void 0 : Ze.id) && (c != null && c.senderNumber) && (c != null && c.contactName) ? {
      id: `contact-${c.senderNumber || i}`,
      name: c.contactName,
      number: c.senderNumber,
      image: c.contactImage || "",
      actorId: c.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: te(c.contactName)
    } : null, M = [...u].reverse().find(
      (m) => {
        var h, f, b;
        return ((b = (f = (h = game.users) == null ? void 0 : h.get) == null ? void 0 : f.call(h, m.senderUserId)) == null ? void 0 : b.isGM) === !0 && m.contactIsNpc && m.senderNumber && m.senderName === m.contactName && m.contactUserId;
      }
    ), J = M ? L({
      id: `contact-${M.senderNumber}`,
      name: M.senderName,
      number: M.senderNumber,
      image: M.senderImage,
      actorId: M.senderActorId,
      managedByGM: !0,
      isNpc: !0
    }) : null, B = (C ? {
      id: `group-${w || i}`,
      name: T,
      number: `${p.length} member${p.length === 1 ? "" : "s"}`,
      image: "",
      actorId: "",
      userId: "",
      userIds: p.filter((m) => {
        var h;
        return m !== ((h = game == null ? void 0 : game.user) == null ? void 0 : h.id);
      }),
      managedByGM: !1,
      isNpc: !1,
      isGroup: !0,
      initials: te(T)
    } : null) ?? G ?? J ?? k ?? s.get(N) ?? r.get(A) ?? {
      id: `contact-${A || i}`,
      name: (c == null ? void 0 : c.contactName) || ((c == null ? void 0 : c.senderUserId) === ((Xe = game == null ? void 0 : game.user) == null ? void 0 : Xe.id) ? A || "Unknown Contact" : (c == null ? void 0 : c.senderName) || A || "Unknown Contact"),
      number: A,
      image: (c == null ? void 0 : c.contactImage) || "",
      actorId: ((et = c == null ? void 0 : c.recipientActorIds) == null ? void 0 : et[0]) ?? "",
      userId: "",
      userIds: [],
      managedByGM: !!(c != null && c.contactName || (tt = c == null ? void 0 : c.recipientActorIds) != null && tt[0]),
      isNpc: !!(c != null && c.contactName || (nt = c == null ? void 0 : c.recipientActorIds) != null && nt[0]),
      initials: te((c == null ? void 0 : c.contactName) || (c == null ? void 0 : c.senderName) || A)
    }, E = C ? null : [...u].reverse().find(
      (m) => m.senderUserId === N && m.senderImage
    ), q = [...u].reverse().find((m) => {
      var f, b;
      const h = (b = (f = game.users) == null ? void 0 : f.get) == null ? void 0 : b.call(f, m.senderUserId);
      return m.senderUserId && (h == null ? void 0 : h.isGM) !== !0 && !m.contactUserId && !!m.contactName && (m.contactIsNpc || m.contactManagedByGM);
    }) ?? null, U = ((at = game == null ? void 0 : game.user) == null ? void 0 : at.isGM) === !0 ? q : null, H = ((rt = game == null ? void 0 : game.user) == null ? void 0 : rt.isGM) === !0 ? M == null ? void 0 : M.contactUserId : "", ae = s.get(H), Ee = U || H ? `Replying as: ${B.name}` : "", V = U ? s.get(U.senderUserId) : null, Pe = (U == null ? void 0 : U.senderName) || (V == null ? void 0 : V.name) || (ae == null ? void 0 : ae.name) || (H ? ee((Re = (ve = game.users) == null ? void 0 : ve.get) == null ? void 0 : Re.call(ve, H)) : "") || B.name || (c == null ? void 0 : c.senderName) || "Unknown Contact", Y = U ? (V == null ? void 0 : V.number) || `@${U.senderName}` : B.number || (c == null ? void 0 : c.senderNumber) || "", j = !C && ((Oe = game == null ? void 0 : game.user) != null && Oe.isGM) ? (U == null ? void 0 : U.senderUserId) || H : "", fe = j ? te(Pe) : B.initials || te(B.name || (c == null ? void 0 : c.senderName)), ye = j ? (U == null ? void 0 : U.senderImage) || (V == null ? void 0 : V.image) || (ae == null ? void 0 : ae.image) || We((Le = (he = game.users) == null ? void 0 : he.get) == null ? void 0 : Le.call(he, j)) || "" : (U == null ? void 0 : U.senderImage) || (V == null ? void 0 : V.image) || (E == null ? void 0 : E.senderImage) || B.image || "", Ge = a[i] ?? "", ke = u.filter(
      (m) => {
        var h;
        return m.senderUserId !== ((h = game == null ? void 0 : game.user) == null ? void 0 : h.id) && m.createdAt > Ge;
      }
    );
    return {
      id: i,
      title: Pe,
      subtitle: /^NPC:/i.test(Y) ? "Direct message" : Y,
      initials: fe,
      image: ye,
      avatarTone: In(C ? w || i : j || B.userId || B.number || i),
      routeLabel: Ee,
      hasRouteLabel: !!Ee,
      isNpcRouted: !!(q || M),
      contact: B,
      messages: u.map((m) => {
        var h;
        return {
          ...m,
          isMine: m.senderUserId === ((h = game == null ? void 0 : game.user) == null ? void 0 : h.id),
          isEvent: m.messageType !== "text"
        };
      }),
      lastMessage: c,
      lastPreview: (c == null ? void 0 : c.body) ?? "",
      updatedAt: (c == null ? void 0 : c.createdAt) ?? "",
      unread: ke.length > 0,
      unreadCount: ke.length,
      active: i === n,
      isGroup: C,
      groupId: w,
      groupName: T,
      groupMemberUserIds: p,
      groupMemberNames: S
    };
  }).sort((i, l) => l.updatedAt.localeCompare(i.updatedAt));
}
const Va = 100, ja = /* @__PURE__ */ new Set(["outgoing", "connected", "ended", "missed"]);
function Nn(e) {
  var n, a;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[d]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, d, "message"));
  return (t == null ? void 0 : t.kind) === ie ? t : t == null ? void 0 : t.message;
}
function Ft(e) {
  const t = Nn(e);
  return (t == null ? void 0 : t.kind) === ie && t.messageType === "event" && ja.has(t.eventType);
}
function za(e) {
  return e.filter(Ft).map((t) => {
    var n;
    return {
      id: t.id,
      time: Date.parse((n = Nn(t)) == null ? void 0 : n.createdAt) || Number(t.timestamp) || 0
    };
  }).sort((t, n) => n.time - t.time || String(n.id).localeCompare(String(t.id))).slice(Va).map((t) => t.id);
}
const Ut = "conversationArchive", gt = "pendingMessages", mt = "messageArchiveMigrated", ge = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.flags) == null ? void 0 : t[d]) ?? {};
}, St = (e) => typeof ge(e)[Ut] == "string", Mn = (e) => St(e == null ? void 0 : e.parent) ? ge(e).message : null, Bt = () => {
  var e;
  return (((e = game.journal) == null ? void 0 : e.contents) ?? []).filter(St);
}, $n = (e) => [.../* @__PURE__ */ new Set([e.senderUserId, ...e.recipientUserIds])].sort();
function pt(e) {
  let t = 2166136261, n = 5381;
  for (let a = 0; a < e.length; a++)
    t = Math.imul(t ^ e.charCodeAt(a), 16777619), n = Math.imul(n, 33) ^ e.charCodeAt(a);
  return [t, n].map((a) => (a >>> 0).toString(16).padStart(8, "0")).join("");
}
function ue() {
  var e, t;
  return ((e = game.user) == null ? void 0 : e.isGM) && ((t = game.users.activeGM) == null ? void 0 : t.id) === game.user.id;
}
function _t(e) {
  var i, l, u, c;
  const t = ge(e), n = t.kind === ie ? t : t.message;
  if ((n == null ? void 0 : n.kind) !== ie || t.archiveNotice) return null;
  const a = ((i = e.author) == null ? void 0 : i.id) ?? ((l = e.user) == null ? void 0 : l.id) ?? e.user ?? ((u = e._source) == null ? void 0 : u.author) ?? ((c = e._source) == null ? void 0 : c.user);
  if (!Array.isArray(e.whisper)) return null;
  const r = new Set(e.whisper.map((g) => (g == null ? void 0 : g.id) ?? g));
  if (!a || a !== n.senderUserId || !r.size || !Array.isArray(n.recipientUserIds)) return null;
  const s = /* @__PURE__ */ new Set([a, ...n.recipientUserIds]);
  if (n.recipientUserIds.some((g) => g !== a && !r.has(g)) || [...r].some((g) => !s.has(g))) return null;
  const o = new Date(n.createdAt || e.timestamp);
  if (!Number.isFinite(o.getTime()) || !n.threadId || !n.body) return null;
  for (const g of ["recipientActorIds", "recipientNumbers", "groupMemberUserIds", "groupMemberNames"])
    if (n[g] != null && !Array.isArray(n[g])) return null;
  return vt({ ...n, id: n.id || e.id, chatMessageId: e.id, createdAt: o.toISOString() });
}
function Ha() {
  return Bt().flatMap((e) => e.pages.contents.map(Mn).filter(Boolean));
}
async function Tn(e, t, n) {
  const a = $n(e), r = JSON.stringify([e.threadId, a]), s = pt(r);
  let o = game.journal.get(s);
  if (!o) {
    const c = Object.fromEntries(a.map((g) => [g, 2]));
    o = await game.journal.documentClass.create({
      _id: s,
      name: "CyberCall Conversation",
      ownership: { ...c, default: 0 },
      flags: { [d]: { [Ut]: r } }
    }, { keepId: !0, renderSheet: !1 });
  }
  if (ge(o)[Ut] !== r) throw new Error("CyberCall journal ID conflict.");
  const i = pt(t), l = o.pages.get(i);
  if (l) {
    if (ge(l).origin !== t) throw new Error("CyberCall page ID conflict.");
    return !1;
  }
  const [u] = await o.createEmbeddedDocuments("JournalEntryPage", [{
    _id: i,
    name: "CyberCall Message",
    type: "text",
    text: { content: `<p>${qe(e.body)}</p>`, format: 1 },
    flags: { [d]: { origin: t, message: { ...e, kind: ie } } }
  }], { keepId: !0, renderSheet: !1, cybercallMigration: n });
  if (!u) throw new Error("Foundry did not save the CyberCall message.");
  return Ft(u) && (ft = !0), !0;
}
async function Wa(e) {
  var r, s, o, i, l;
  const t = pt(e.id), n = game.user;
  try {
    await n.setFlag(d, `${gt}.${t}`, e);
  } catch (u) {
    throw (s = (r = ui.notifications) == null ? void 0 : r.error) == null || s.call(r, "CyberCall could not save the message to your outbox."), u;
  }
  return ue() && await je(), ((o = n.getFlag(d, gt)) == null ? void 0 : o[t]) && !game.users.activeGM && (e.messageType === "text" || e.eventType === "group-created") && ((l = (i = ui.notifications) == null ? void 0 : i.info) == null || l.call(i, "Message queued. A GM will deliver it when they connect.")), e;
}
async function Ka() {
  var t;
  if (game.settings.get(d, mt)) return;
  const e = [];
  for (const n of game.messages.contents) {
    const a = ge(n);
    if (!ue()) return;
    if (a.archiveNotice || a.kind !== ie && ((t = a.message) == null ? void 0 : t.kind) !== ie) continue;
    const r = _t(n);
    r ? await Tn(r, `chat:${n.id}`, !0) : e.push(n.id);
  }
  ue() && (await game.settings.set(d, mt, !0), ft = !0, e.length && (console.warn("CyberCall could not validate these legacy chat records:", e), ui.notifications.warn(`CyberCall left ${e.length} legacy chat records in chat for GM review. Their IDs are in the console.`)));
}
async function Ja(e, t, n) {
  if ((n == null ? void 0 : n.senderUserId) !== e.id || !n.id || pt(n.id) !== t || !Array.isArray(n.recipientUserIds) || !n.body || !n.threadId) return;
  const a = vt({ ...n, chatMessageId: "" }), r = JSON.stringify([e.id, a.id]), s = await Tn(a, r, !1);
  if (await e.unsetFlag(d, `${gt}.${t}`), !!s)
    try {
      const o = game.messages.documentClass;
      await o.create({
        speaker: o.getSpeaker({ alias: a.senderName }),
        whisper: $n(a),
        content: `<div class="cybercall-chat-card"><strong>${qe(a.senderName)}</strong><p>${qe(a.body)}</p><button type="button" data-cybercall-open-thread data-cybercall-thread-id="${qe(a.threadId)}">Open CyberCall</button></div>`,
        flags: { [d]: { archiveNotice: !0, archiveOrigin: r } }
      });
    } catch (o) {
      console.warn("CyberCall saved the message but could not create its chat card.", o);
    }
}
async function Ya() {
  const e = Bt().flatMap((r) => r.pages.contents), t = new Set(za(e.map((r) => ({
    id: r.uuid,
    flags: r.flags
  }))));
  if (!t.size) return;
  const n = new Set(e.filter((r) => t.has(r.uuid)).map((r) => ge(r).origin)), a = game.messages.contents.filter((r) => {
    const s = ge(r);
    return s.archiveNotice ? n.has(s.archiveOrigin) : n.has(`chat:${r.id}`) && Ft(r) && _t(r);
  });
  a.length && await game.messages.documentClass.deleteDocuments(a.map((r) => r.id));
  for (const r of Bt()) {
    if (!ue()) return;
    const s = r.pages.contents.filter((o) => t.has(o.uuid)).map((o) => o.id);
    s.length && await r.deleteEmbeddedDocuments("JournalEntryPage", s);
  }
}
let ft = !0, xe, Gt = !1;
function je() {
  return ue() ? (Gt = !0, xe || (xe = Promise.resolve().then(async () => {
    for (; Gt && ue(); ) {
      Gt = !1, await Ka();
      for (const e of game.users.contents) {
        const t = e.getFlag(d, gt) ?? {};
        for (const [n, a] of Object.entries(t)) {
          if (!ue()) return;
          try {
            await Ja(e, n, a);
          } catch (r) {
            console.warn("CyberCall will retry the queued message.", r);
          }
        }
      }
      ft && ue() && (await Ya(), ft = !1);
    }
  }).catch((e) => console.warn("CyberCall archive maintenance will retry.", e)).finally(() => {
    xe = void 0;
  }), xe)) : Promise.resolve();
}
const ze = "playerContactDirectory", $e = "playerPersonalContactDirectory";
function Qa(e) {
  var n, a, r, s;
  const t = ((n = e.getFlag(d, ze)) == null ? void 0 : n.playerId) ?? ((a = e.getFlag(d, $e)) == null ? void 0 : a.playerId);
  return !!(t && ((r = game.user) != null && r.isGM || ((s = game.user) == null ? void 0 : s.id) === t));
}
function It(e) {
  var t, n, a, r;
  return !e || !((t = game.user) != null && t.isGM) && ((n = game.user) == null ? void 0 : n.id) !== e ? null : ((r = (a = game.journal) == null ? void 0 : a.contents) == null ? void 0 : r.find(
    (s) => {
      var o;
      return ((o = s.getFlag(d, $e)) == null ? void 0 : o.playerId) === e && s.testUserPermission(game.user, "OBSERVER");
    }
  )) ?? null;
}
function Te(e) {
  var n;
  const t = (n = It(e)) == null ? void 0 : n.getFlag(d, $e);
  return t != null && t.initialized ? Object.values(t.contacts ?? {}).map(L).filter((a) => a.name && a.number).sort((a, r) => a.name.localeCompare(r.name)) : null;
}
function En(e) {
  const t = new Map((Te(e) ?? []).map((n) => [n.id, n]));
  for (const n of At(e)) t.set(n.id, n);
  return [...t.values()].sort((n, a) => n.name.localeCompare(a.name));
}
let Fe = null;
async function qt() {
  var n, a;
  if (!((n = game.user) != null && n.isGM)) return;
  const e = (((a = game.users) == null ? void 0 : a.contents) ?? []).filter((r) => r.isGM && r.active).sort((r, s) => r.id.localeCompare(s.id))[0];
  if (e && e.id !== game.user.id) return;
  if (Fe) return Fe;
  const t = CONST.DOCUMENT_OWNERSHIP_LEVELS;
  Fe = (async () => {
    var r;
    for (const s of ((r = game.users) == null ? void 0 : r.contents) ?? [])
      s.isGM || It(s.id) || await game.journal.documentClass.create({
        name: `CyberCall Personal Contacts · ${s.name}`,
        ownership: { default: t.NONE, [s.id]: t.OWNER },
        flags: { [d]: { [$e]: { playerId: s.id, initialized: !1, contacts: {} } } }
      }, { render: !1 });
  })();
  try {
    await Fe;
  } finally {
    Fe = null;
  }
}
async function Pn(e, t, n = null) {
  const a = It(e);
  if (!a || !t) return !1;
  const r = `flags.${d}.${$e}`;
  return await a.update({
    [`${r}.initialized`]: !0,
    [`${r}.contacts.${n ? t : `-=${t}`}`]: n
  }, { render: !1 }), !0;
}
async function Gn(e, t) {
  const n = It(e);
  if (!n) return !1;
  const a = Te(e) ?? [], r = `flags.${d}.${$e}`, s = { [`${r}.initialized`]: !0 }, o = new Set(t.map((i) => i.id));
  for (const i of t) s[`${r}.contacts.${i.id}`] = L(i);
  for (const i of a) o.has(i.id) || (s[`${r}.contacts.-=${i.id}`] = null);
  return await n.update(s, { render: !1 }), !0;
}
function kn(e) {
  var t, n, a, r;
  return !e || !((t = game.user) != null && t.isGM) && ((n = game.user) == null ? void 0 : n.id) !== e ? null : ((r = (a = game.journal) == null ? void 0 : a.contents) == null ? void 0 : r.find(
    (s) => {
      var o;
      return ((o = s.getFlag(d, ze)) == null ? void 0 : o.playerId) === e && s.testUserPermission(game.user, "OBSERVER");
    }
  )) ?? null;
}
function At(e) {
  var n, a;
  const t = ((a = (n = kn(e)) == null ? void 0 : n.getFlag(d, ze)) == null ? void 0 : a.contacts) ?? {};
  return Object.values(t).map(L).filter((r) => r.name && r.number).sort((r, s) => r.name.localeCompare(s.name));
}
async function Un(e, t, n = null) {
  var i, l;
  if (!((i = game.user) != null && i.isGM)) return;
  const a = (l = game.users) == null ? void 0 : l.get(e);
  if (!a || a.isGM) return;
  const r = kn(e);
  if (!r) {
    if (!n) return;
    const u = game.journal.documentClass, c = CONST.DOCUMENT_OWNERSHIP_LEVELS;
    await u.create({
      name: `CyberCall Contacts · ${a.name}`,
      ownership: { default: c.NONE, [e]: c.OBSERVER },
      flags: { [d]: { [ze]: { playerId: e, contacts: { [t]: n } } } }
    }, { render: !1 });
    return;
  }
  const s = `flags.${d}.${ze}.contacts`, o = n ? t : `-=${t}`;
  await r.update({ [`${s}.${o}`]: n }, { render: !1 });
}
function Za() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => t.id);
}
function Bn(e) {
  return [...new Set(e.map((t) => String(t ?? "").trim()).filter(Boolean))];
}
function Xa(e) {
  var a, r;
  const t = String(((a = game.user) == null ? void 0 : a.id) ?? "").trim();
  return t ? e.senderUserId === t || e.recipientUserIds.includes(t) ? !0 : ((r = game.user) == null ? void 0 : r.isGM) === !0 ? !e.contactUserId && (e.contactManagedByGM || e.contactIsNpc) ? !0 : game.settings.get(d, "gmViewPlayerMessages") === !0 : !1 : !1;
}
function er(e) {
  const t = Array.isArray(e == null ? void 0 : e.userIds) ? e.userIds : e != null && e.userId ? [e.userId] : [], n = Bn(t);
  return n.length ? n : Za();
}
function tr(e) {
  return !!(e != null && e.userId || Array.isArray(e == null ? void 0 : e.userIds) && e.userIds.length);
}
function nr() {
  const e = Ha();
  if (!game.settings.get(d, mt)) {
    const t = new Set(e.map((n) => n.chatMessageId));
    for (const n of game.messages.contents) {
      if (t.has(n.id)) continue;
      const a = _t(n);
      a && e.push(a);
    }
  }
  return e.filter(Xa);
}
async function Vt(e, t, n = {}) {
  var w;
  const a = L(e), r = String(t ?? "").trim();
  if (!r) return null;
  const s = game.user, o = n.recipientUserIds ? Bn(n.recipientUserIds) : er(e), i = !tr(e), l = String(n.threadId ?? Ke(e, s == null ? void 0 : s.id, n)), u = String(n.senderName ?? "").trim() || ee(s, "Unknown Sender"), c = String(n.senderActorId ?? ((w = s == null ? void 0 : s.character) == null ? void 0 : w.id) ?? "").trim(), g = String(n.senderNumber ?? "").trim(), C = vt({
    threadId: l,
    senderUserId: (s == null ? void 0 : s.id) ?? "",
    senderActorId: c,
    senderName: u,
    senderNumber: g,
    senderImage: String(n.senderImage ?? We(s)).trim(),
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
    schemaVersion: bn
  });
  return Wa(C);
}
async function ar(e, t, n = {}) {
  return Vt(e, t, {
    ...n,
    messageType: n.messageType ?? "event"
  });
}
let v = null, I = null, Q = null, Ie = null, X = null, ce = "personal", Dn = "", x = "", Z = !1, K = !1, le = null, Dt = 0, Ae = null;
function rr() {
  var e, t, n, a, r, s, o, i;
  return re({
    callerName: ((e = v == null ? void 0 : v.callData) == null ? void 0 : e.callerName) ?? W.callerName,
    subtitle: ((t = v == null ? void 0 : v.callData) == null ? void 0 : t.subtitle) ?? W.subtitle,
    image: ((n = v == null ? void 0 : v.callData) == null ? void 0 : n.image) ?? "",
    message: ((a = v == null ? void 0 : v.callData) == null ? void 0 : a.message) ?? W.message,
    signal: ((r = v == null ? void 0 : v.callData) == null ? void 0 : r.signal) ?? game.settings.get(d, "defaultSignal"),
    variant: ((s = v == null ? void 0 : v.callData) == null ? void 0 : s.variant) ?? "standard",
    fullscreen: ((o = v == null ? void 0 : v.callData) == null ? void 0 : o.fullscreen) ?? !1,
    ringing: ((i = v == null ? void 0 : v.callData) == null ? void 0 : i.ringing) ?? !0
  });
}
function sr() {
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
    name: ee(t, "Unknown Player"),
    active: t.active === !0
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function ir() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => {
    var n;
    return !t.isGM && t.id !== ((n = game.user) == null ? void 0 : n.id);
  }).map((t) => ({
    id: String(t.id),
    name: ee(t, "Unknown Player"),
    active: t.active === !0
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function or() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => {
    var n;
    return t.id !== ((n = game.user) == null ? void 0 : n.id);
  }).map((t) => mn(t, "Unknown Player")).sort((t, n) => t.name.localeCompare(n.name));
}
function Ce() {
  var e, t;
  return String(((e = game.world) == null ? void 0 : e.id) ?? ((t = game.world) == null ? void 0 : t.title) ?? "default");
}
function jt() {
  const e = game.settings.get(d, "contacts");
  return Array.isArray(e) ? { [Ce()]: e } : !e || typeof e != "object" ? {} : e;
}
function zt() {
  var t, n;
  if (!((t = game.user) != null && t.isGM)) {
    const a = Te((n = game.user) == null ? void 0 : n.id);
    if (a !== null) return a;
  }
  const e = jt()[Ce()];
  return Array.isArray(e) ? e.map(L).filter((a) => a.name && a.number).sort((a, r) => a.name.localeCompare(r.name)) : [];
}
function Nt() {
  var t, n;
  const e = (t = game.user) != null && t.isGM ? [] : At((n = game.user) == null ? void 0 : n.id);
  return [
    ...zt(),
    ...e.map((a) => ({ ...a, assignedToPlayer: !0 }))
  ].sort((a, r) => a.name.localeCompare(r.name));
}
function On() {
  var n;
  if (!((n = game.user) != null && n.isGM)) return [];
  const e = Rn(), t = e.find((a) => a.id === Dn) ?? e[0];
  return e.map((a) => ({ ...a, selected: a.id === (t == null ? void 0 : t.id) }));
}
function Je() {
  var e;
  return ((e = On().find((t) => t.selected)) == null ? void 0 : e.id) ?? "";
}
function cr(e) {
  return e === "player" ? En(Je()) : e === "group" ? me() : Nt();
}
function me() {
  if (Array.isArray(Ae))
    return Ae.map(L).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name));
  const e = game.settings.get(d, "groupContacts");
  return Array.isArray(e) ? e.map(L).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function Ht() {
  const e = /* @__PURE__ */ new Map();
  for (const t of [...or(), ...me(), ...Nt()]) {
    const n = t.userId ? `user:${t.userId}` : `number:${t.number || t.id}`;
    e.has(n) || e.set(n, t);
  }
  return [...e.values()].sort((t, n) => t.name.localeCompare(n.name));
}
async function Ln(e) {
  var t;
  (t = game.user) != null && t.isGM || await Gn(game.user.id, e), await game.settings.set(d, "contacts", {
    ...jt(),
    [Ce()]: e.map(L)
  });
}
let ot = null;
async function xn() {
  var t, n;
  if ((t = game.user) != null && t.isGM || ot || Te((n = game.user) == null ? void 0 : n.id) !== null) return;
  const e = jt()[Ce()];
  ot = Gn(game.user.id, Array.isArray(e) ? e : []);
  try {
    await ot;
  } finally {
    ot = null;
  }
}
async function yt(e) {
  Ae = e.map(L), await game.settings.set(d, "groupContacts", Ae), game.socket.emit(se, {
    action: "groupContactsChanged",
    contacts: Ae
  });
}
function Wt() {
  const e = game.settings.get(d, "messageReadState");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function Fn() {
  const e = game.settings.get(d, "messageDeletedBefore");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function bt() {
  const e = game.settings.get(d, "npcThreadBindings");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
async function lt(e, t) {
  var a;
  if (!((a = game.user) != null && a.isGM) || !e) return;
  const n = { ...bt() };
  t === null ? delete n[e] : n[e] = { ...n[e] ?? {}, ...t }, await game.settings.set(d, "npcThreadBindings", n);
}
function Kt() {
  const e = Fn();
  return nr().filter((t) => {
    const n = e[t.threadId];
    return !n || t.createdAt > n;
  });
}
function _n() {
  return An(Kt(), Ht(), "", Wt()).reduce((e, t) => e + Number(t.unreadCount ?? 0), 0);
}
async function lr(e, t = (/* @__PURE__ */ new Date()).toISOString()) {
  e && await game.settings.set(d, "messageReadState", {
    ...Wt(),
    [e]: t
  });
}
async function Ve() {
  x && await lr(x);
}
async function ur(e) {
  e && (await game.settings.set(d, "messageDeletedBefore", {
    ...Fn(),
    [e]: (/* @__PURE__ */ new Date()).toISOString()
  }), x === e && (x = "", Z = !1, K = !1, X && (X.contact = null), (I == null ? void 0 : I.mode) === "messages" && (I.contact = null)), await F(), await z());
}
async function dr(e, t, n = "personal", a = "", r = {}) {
  var u, c, g, C, w, T, p, y, S, N;
  if (n === "player" && !((u = game.user) != null && u.isGM)) return !1;
  const s = r.actorId ? (c = game.actors) == null ? void 0 : c.get(r.actorId) : null, o = L({
    id: r.id || void 0,
    name: String(e ?? "").trim() || (s == null ? void 0 : s.name),
    number: t,
    image: _e() && (String(a ?? "").trim() || (s == null ? void 0 : s.img)) || "",
    actorId: _e() ? r.actorId : "",
    managedByGM: _e() ? r.managedByGM === !0 : !1,
    isNpc: _e() ? r.isNpc === !0 || r.managedByGM === !0 || !!r.actorId : !1
  });
  if (!o.name || !o.number)
    return (C = (g = ui.notifications) == null ? void 0 : g.warn) == null || C.call(g, "Contact name and number are required."), !1;
  if (!Ga(o.number, dt()))
    return (T = (w = ui.notifications) == null ? void 0 : w.warn) == null || T.call(w, `Enter a phone number matching ${dt()} (# = digit, A = letter, * = letter or digit).`), !1;
  if (n === "player") {
    const A = Je();
    if (!A) return !1;
    const G = Te(A) ?? [];
    return !At(A).some((M) => M.id === o.id) && G.some((M) => M.id === o.id) ? await Pn(A, o.id, o) : await Un(A, o.id, o), !0;
  }
  if (n === "group" && !game.user.isGM)
    return r.id ? !1 : Jt() ? (game.socket.emit(se, {
      action: "groupContactAdd",
      contact: o
    }), (N = (S = ui.notifications) == null ? void 0 : S.info) == null || N.call(S, "Group contact update sent to the GM."), !0) : ((y = (p = ui.notifications) == null ? void 0 : p.warn) == null || y.call(p, "A GM must be connected to update group contacts."), !1);
  const i = n === "group" ? me() : zt(), l = i.findIndex((A) => A.id === o.id);
  return l === -1 ? i.push(o) : i[l] = { ...i[l], ...o }, n === "group" ? await yt(i) : await Ln(i), await z(), !0;
}
async function gr(e, t = "personal") {
  var n, a, r, s;
  if (t === "player") {
    const o = Je(), i = At(o).some((u) => u.id === e), l = (Te(o) ?? []).some((u) => u.id === e);
    !i && l ? await Pn(o, e) : await Un(o, e);
    return;
  } else if (t === "group") {
    if (!game.user.isGM) {
      if (!Jt()) {
        (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(se, {
        action: "groupContactRemove",
        contactId: e
      }), (s = (r = ui.notifications) == null ? void 0 : r.info) == null || s.call(r, "Group contact removal sent to the GM.");
      return;
    }
    await yt(me().filter((o) => o.id !== e));
  } else
    await Ln(zt().filter((o) => o.id !== e));
  await z();
}
function Jt() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function Mt(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(d, "minimumRole");
  } catch (n) {
    console.warn(`${d} | Permission setting unavailable, using Player role fallback.`, n);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function _e(e = game.user) {
  return !!(e != null && e.isGM);
}
function ne(e, t = null) {
  var n;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (n = e == null ? void 0 : e.element) != null && n[0] ? e.element[0] : (e == null ? void 0 : e.element) ?? null;
}
const mr = 24;
function qn(e) {
  var s, o, i;
  const t = ne(e), n = (s = t == null ? void 0 : t.querySelector) == null ? void 0 : s.call(t, ".cybercall-message-log");
  if (!(n instanceof HTMLElement)) return null;
  const a = (o = t.querySelector) == null ? void 0 : o.call(t, "[data-cybercall-active-thread]"), r = n.scrollHeight - n.clientHeight - n.scrollTop;
  return {
    threadId: String(((i = a == null ? void 0 : a.dataset) == null ? void 0 : i.cybercallActiveThread) ?? ""),
    scrollTop: n.scrollTop,
    stickToBottom: r <= mr
  };
}
function pr(e, t) {
  var u;
  const n = t.querySelector(".cybercall-message-log");
  if (!(n instanceof HTMLElement)) return;
  const a = e == null ? void 0 : e._cybercallMessageScrollState, r = t.querySelector("[data-cybercall-active-thread]"), s = String(((u = r == null ? void 0 : r.dataset) == null ? void 0 : u.cybercallActiveThread) ?? ""), o = !a || a.scrollToBottom === !0 || a.stickToBottom === !0 || a.threadId !== s;
  delete e._cybercallMessageScrollState;
  const i = {};
  e._cybercallMessageScrollRestoreToken = i;
  const l = () => {
    if (e._cybercallMessageScrollRestoreToken !== i || !n.isConnected) return;
    const c = Math.max(0, n.scrollHeight - n.clientHeight);
    n.scrollTop = o ? c : Math.min(a.scrollTop, c);
  };
  l(), requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      l(), e._cybercallMessageScrollRestoreToken === i && delete e._cybercallMessageScrollRestoreToken;
    });
  });
}
function Rt(e) {
  var a;
  const t = e.querySelector("[data-cybercall-active-thread]"), n = String(((a = t == null ? void 0 : t.dataset) == null ? void 0 : a.cybercallActiveThread) ?? "");
  return n ? `thread:${n}` : e.querySelector("form[data-cybercall-group-form]") ? "new-group" : "new-message";
}
function Vn(e) {
  const t = ne(e);
  if (!(t instanceof HTMLElement)) return null;
  const n = t.querySelector("form[data-cybercall-group-form]");
  if (n) {
    const o = n.elements.namedItem("groupName");
    return {
      key: Rt(t),
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
    key: Rt(t),
    body: (r == null ? void 0 : r.value) ?? "",
    contactId: s("contactId"),
    replyAs: s("replyAs"),
    sendAs: s("sendAs"),
    bodyWasFocused: document.activeElement === r,
    selectionStart: (r == null ? void 0 : r.selectionStart) ?? null,
    selectionEnd: (r == null ? void 0 : r.selectionEnd) ?? null
  };
}
function fr(e, t) {
  const n = e == null ? void 0 : e._cybercallMessageComposerState;
  if (delete e._cybercallMessageComposerState, !n || n.key !== Rt(t)) return;
  const a = t.querySelector("form[data-cybercall-group-form]");
  if (a) {
    const i = a.elements.namedItem("groupName");
    i && (i.value = n.groupName ?? "");
    const l = new Set(n.memberUserIds ?? []);
    a.querySelectorAll('input[name="memberUserIds"]').forEach((u) => {
      u.checked = l.has(u.value);
    });
    return;
  }
  const r = t.querySelector("form[data-cybercall-message-form]");
  if (!r) return;
  const s = (i, l) => {
    const u = r.elements.namedItem(i);
    u && [...u instanceof HTMLSelectElement ? u.options : []].some((c) => c.value === l) && (u.value = l);
  };
  s("contactId", n.contactId), s("replyAs", n.replyAs), s("sendAs", n.sendAs);
  const o = r.elements.namedItem("body");
  o && (o.value = n.body ?? "", n.bodyWasFocused && requestAnimationFrame(() => {
    o.isConnected && (o.focus({ preventScroll: !0 }), n.selectionStart !== null && n.selectionEnd !== null && o.setSelectionRange(n.selectionStart, n.selectionEnd));
  }));
}
function yr(e, t = null) {
  const n = ne(e, t);
  if (!n) return;
  const a = n.closest(".cybercall-app, .cybercall-phone-app") ?? ne(e);
  a == null || a.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), wt(a), a == null || a.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), a == null || a.classList.toggle("cybercall-connected", e.callData.accepted), n.querySelectorAll("[data-cybercall-action]").forEach((r) => {
    r.addEventListener("click", async (s) => {
      const o = s.currentTarget.dataset.cybercallAction;
      if (o === "accept") {
        await Or(e.callData.id);
        return;
      }
      if (o === "broadcast") {
        tn({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (o === "decline" || o === "end") && await Yn(e.callData.id);
    });
  });
}
function br(e) {
  var n, a;
  const t = "form[data-cybercall-composer]";
  return (n = e == null ? void 0 : e.matches) != null && n.call(e, t) ? e : (a = e == null ? void 0 : e.querySelector) == null ? void 0 : a.call(e, t);
}
function hr(e, t = null) {
  var o;
  const n = ne(e, t), a = br(n);
  if (!n || !a) return;
  wt(n.closest(".cybercall-composer-app"));
  function r(i) {
    e._cybercallConsoleTab = i, n.querySelectorAll("[data-cybercall-console-panel]").forEach((l) => {
      l.hidden = l.dataset.cybercallConsolePanel !== i;
    }), n.querySelectorAll("[data-cybercall-console-tab]").forEach((l) => {
      l.setAttribute("aria-selected", String(l.dataset.cybercallConsoleTab === i));
    });
  }
  n.querySelectorAll("[data-cybercall-console-tab]").forEach((i) => {
    i.addEventListener("click", () => r(i.dataset.cybercallConsoleTab));
  }), r(e._cybercallConsoleTab ?? "transmission"), Da(n, a), it(a);
  const s = n.querySelector("[data-cybercall-ringtone]");
  s && s.addEventListener("change", async (i) => {
    await na(i.currentTarget.value);
  }), a.addEventListener("input", () => it(a)), (o = a.elements.actorId) == null || o.addEventListener("change", () => {
    var l;
    const i = (l = game.actors) == null ? void 0 : l.get(a.elements.actorId.value);
    i && (a.elements.callerName.value = i.name, a.elements.image.value = i.img ?? "");
  }), a.addEventListener("change", () => it(a)), a.addEventListener("submit", (i) => {
    var l;
    if (i.preventDefault(), e._cybercallConsoleTab === "configuration") {
      (l = n.querySelector("[data-cybercall-save-configuration]")) == null || l.click();
      return;
    }
    pe(kt(a));
  }), n.querySelectorAll("[data-cybercall-compose-action]").forEach((i) => {
    i.addEventListener("click", async (l) => {
      var g, C, w, T;
      const u = l.currentTarget.dataset.cybercallComposeAction, c = kt(a);
      if (u === "preview") {
        await pe(c);
        return;
      }
      if (u === "broadcast") {
        await tn(c);
        return;
      }
      if (u === "close-active") {
        Yn((g = v == null ? void 0 : v.callData) == null ? void 0 : g.id);
        return;
      }
      if (u === "browse-image") {
        const p = a.elements.image, y = Ct();
        if (!p || !y) {
          (w = (C = ui.notifications) == null ? void 0 : C.warn) == null || w.call(C, "Foundry FilePicker is unavailable.");
          return;
        }
        const S = new y({
          type: "image",
          current: p.value,
          callback: (N) => {
            p.value = N, p.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof S.browse == "function" ? S.browse() : (T = S.render) == null || T.call(S, !0);
        return;
      }
      if (u === "reset") {
        a.reset(), it(a);
        return;
      }
      u === "open-messages" && await Ne(), u === "open-contacts" && (ce = "group", await $t());
    });
  });
}
function Cr(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function wr(e, t = null) {
  var g, C, w, T, p;
  const n = ne(e, t), a = Cr(n);
  if (!n) return;
  const r = n.querySelector("[data-cybercall-ringtone]");
  if (r && r.addEventListener("change", async (y) => {
    await na(y.currentTarget.value);
  }), (g = n.querySelector("[data-cybercall-message-sound]")) == null || g.addEventListener("change", async (y) => {
    await La(y.currentTarget.value);
  }), !a) return;
  Cn(n), (C = a.querySelector("[data-cybercall-contact-browse]")) == null || C.addEventListener("click", () => {
    var A, G;
    if (!((A = game.user) != null && A.isGM)) return;
    const y = a.elements.image, S = Ct();
    if (!y || !S) return;
    const N = new S({
      type: "image",
      current: y.value,
      callback: (k) => {
        y.value = k, y.dispatchEvent(new Event("change", { bubbles: !0 }));
      }
    });
    typeof N.browse == "function" ? N.browse() : (G = N.render) == null || G.call(N, !0);
  });
  const s = (y) => {
    n.querySelectorAll("[data-cybercall-contact-row]").forEach((S) => {
      S.classList.toggle("selected", S.dataset.cybercallContactRow === y);
    });
  };
  s(e.selectedContactId);
  const o = n.querySelector("[data-cybercall-contact-search]");
  if (o) {
    o.value = e.contactSearch ?? "";
    const y = () => {
      e.contactSearch = o.value;
      const S = o.value.trim().toLocaleLowerCase();
      n.querySelectorAll("[data-cybercall-contact-panel]").forEach((N) => {
        const A = [...N.querySelectorAll("[data-cybercall-contact-row]")];
        for (const k of A) {
          const M = k.querySelector(".cybercall-contact-id").textContent;
          k.hidden = !M.toLocaleLowerCase().includes(S);
        }
        const G = N.querySelector("[data-cybercall-empty-search]");
        G && (G.hidden = !A.length || A.some((k) => !k.hidden));
      });
    };
    o.addEventListener("input", y), y();
  }
  a.addEventListener("submit", async (y) => {
    var A, G, k;
    y.preventDefault();
    const S = new FormData(a), N = String(S.get("scope") ?? ce);
    u.disabled = !0;
    try {
      await dr(S.get("name"), S.get("number"), N, S.get("image"), {
        id: S.get("contactId"),
        actorId: S.get("actorId"),
        managedByGM: S.get("managedByGM") === "on",
        isNpc: S.get("managedByGM") === "on" || !!S.get("actorId")
      }) && (c(), (A = a.elements.name) == null || A.focus());
    } catch (M) {
      console.warn(`${d} | Could not save contact.`, M), (k = (G = ui.notifications) == null ? void 0 : G.error) == null || k.call(G, "CyberCall could not save this contact.");
    } finally {
      u.disabled = !1;
    }
  });
  const i = n.querySelector("[data-cybercall-contact-player]");
  i == null || i.addEventListener("change", () => {
    Dn = i.value, z();
  });
  const l = a.closest("details"), u = a.querySelector('button[type="submit"]');
  function c() {
    a.reset(), a.elements.scope.value = ce, u.textContent = "Add Contact", l && (l.querySelector("summary").textContent = "Add contact");
  }
  (w = a.querySelector("[data-cybercall-cancel-contact]")) == null || w.addEventListener("click", () => {
    c(), l && (l.open = !1);
  }), (T = a.elements.actorId) == null || T.addEventListener("change", () => {
    var S;
    const y = (S = game.actors) == null ? void 0 : S.get(a.elements.actorId.value);
    y && (a.elements.name.value || (a.elements.name.value = y.name), a.elements.image && !a.elements.image.value && (a.elements.image.value = y.img ?? ""), a.elements.managedByGM && (a.elements.managedByGM.checked = !0));
  }), n.querySelectorAll("[data-cybercall-contact-tab]").forEach((y) => {
    y.addEventListener("click", (S) => {
      var G;
      const N = S.currentTarget.dataset.cybercallContactTab;
      if (N === "player" && !((G = game.user) != null && G.isGM) || N === ce) return;
      ce = N, c(), l && (l.open = !1);
      const A = N !== "player" || !!Je();
      l && (l.hidden = !A), n.querySelectorAll("[data-cybercall-contact-tab]").forEach((k) => {
        k.classList.toggle("active", k.dataset.cybercallContactTab === ce);
      }), n.querySelectorAll("[data-cybercall-contact-panel]").forEach((k) => {
        k.hidden = k.dataset.cybercallContactPanel !== ce;
      });
    });
  }), n.querySelectorAll("[data-cybercall-contact-action]").forEach((y) => {
    y.addEventListener("click", async (S) => {
      var J, _, B;
      const N = S.currentTarget.dataset.cybercallContactAction, A = S.currentTarget.dataset.contactId, G = S.currentTarget.dataset.contactScope ?? "personal", M = cr(G).find((E) => E.id === A);
      if (N === "edit" && M && ((J = game.user) != null && J.isGM)) {
        if (!l || !a.elements.contactId) return;
        a.elements.contactId.value = M.id, a.elements.name.value = M.name, a.elements.number.value = M.number, a.elements.actorId.value = M.actorId, a.elements.image.value = M.image, a.elements.managedByGM.checked = M.managedByGM, l.querySelector("summary").textContent = "Edit contact", u.textContent = "Save Contact", l.open = !0, a.elements.name.focus();
        return;
      }
      if (N === "remove" && M && !("assignedToPlayer" in M)) {
        try {
          await gr(A, G);
        } catch (E) {
          console.warn(`${d} | Could not remove contact.`, E), (B = (_ = ui.notifications) == null ? void 0 : _.error) == null || B.call(_, "CyberCall could not remove this contact.");
        }
        return;
      }
      if (M && (N === "call" || N === "message") && (e.selectedContactId = A, s(A)), N === "call" && M) {
        await _r(M);
        return;
      }
      N === "message" && M && await Ne(M);
    });
  }), (p = n.querySelector("[data-cybercall-open-messages]")) == null || p.addEventListener("click", async () => {
    await Ne();
  });
}
function jn(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
function vr(e) {
  var c, g, C, w, T, p, y;
  const t = bt()[e.id] ?? null, n = ((c = game.user) == null ? void 0 : c.isGM) === !0, a = !!(!e.isGroup && e.contact && !e.contact.userId && (e.contact.isNpc || e.contact.managedByGM || e.isNpcRouted)), r = t != null && t.actorId ? (C = (g = game.actors) == null ? void 0 : g.get) == null ? void 0 : C.call(g, t.actorId) : null, s = String((r == null ? void 0 : r.name) ?? (t == null ? void 0 : t.actorName) ?? "").trim(), o = String((t == null ? void 0 : t.image) ?? ((T = (w = r == null ? void 0 : r.prototypeToken) == null ? void 0 : w.texture) == null ? void 0 : T.src) ?? (r == null ? void 0 : r.img) ?? "").trim(), i = (t == null ? void 0 : t.revealPortrait) === !0, l = e.isNpcRouted === !0, u = t || l ? {
    ...e.contact,
    actorId: t && n ? String(t.actorId ?? e.contact.actorId ?? "") : e.contact.actorId,
    image: t && i ? o : ""
  } : e.contact;
  return {
    ...e,
    contact: u,
    image: !n && l ? t && i ? o : "" : e.image,
    canLinkNpc: n && a,
    showNpcLinkPanel: n && (a || !!t),
    hasNpcBinding: !!t,
    npcBindingName: s || ((p = e.contact) == null ? void 0 : p.name) || "Linked NPC",
    npcBindingImage: o,
    npcBindingInitials: te(s || ((y = e.contact) == null ? void 0 : y.name) || "NPC"),
    npcPortraitRevealed: i,
    npcBindingStatusLabel: t ? `Linked to ${s || "Actor"}` : "Unlinked NPC contact"
  };
}
function Yt(e = null) {
  var w, T, p;
  let t = Ht();
  const n = e ?? t[0] ?? null;
  n && !t.some((y) => y.id === n.id || y.number === n.number) && (t = [...t, L(n)].sort((y, S) => y.name.localeCompare(S.name)));
  const a = Z || K ? "" : x, r = An(Kt(), t, a, Wt()).map((y) => ({
    ...vr(y),
    messages: y.messages.map((S) => ({
      ...S,
      createdAtLabel: jn(S.createdAt)
    }))
  })), s = Z || K ? null : r.find((y) => y.id === x) ?? null;
  s != null && s.contact && !t.some((y) => y.id === s.contact.id || y.number === s.contact.number) && (t = [...t, s.contact].sort((y, S) => y.name.localeCompare(S.name)));
  const o = ((w = s == null ? void 0 : s.contact) == null ? void 0 : w.id) ?? (n == null ? void 0 : n.id) ?? "", i = _n(), l = zn(s, { excludeGMs: !1 }), u = Ar(s), c = Hn(), g = ((T = game.user) == null ? void 0 : T.isGM) === !0 && !s && c.length > 1, C = ir();
  return {
    threads: r,
    hasThreads: r.length > 0,
    pendingCount: Object.keys(game.user.getFlag(d, "pendingMessages") ?? {}).length,
    unreadCount: i,
    hasUnreadMessages: i > 0,
    activeThread: s,
    activeThreadId: (s == null ? void 0 : s.id) ?? a,
    allContacts: t.map((y) => ({
      ...y,
      selected: y.id === o
    })),
    hasContacts: t.length > 0,
    selectedContactId: o,
    isThreadReply: !!s,
    showConversation: !!(s || Z || K || e),
    isComposingNewMessage: !s && !K,
    isComposingNewGroup: K,
    groupMemberChoices: C,
    hasGroupMemberChoices: C.length > 0,
    canDeleteThread: !!s,
    threadReplyLabel: s ? `${s.title}${s.subtitle ? ` (${s.subtitle})` : ""}` : "",
    canReplyAs: u.length > 1,
    replyAsChoices: u,
    canSendAs: g,
    sendAsChoices: c,
    activeThreadRecipientUserIds: l,
    showMessageTimestamps: game.settings.get(d, "showMessageTimestamps") === !0,
    gmViewPlayerMessagesEnabled: game.settings.get(d, "gmViewPlayerMessages") === !0,
    isFoundryV13Plus: Number(((p = game.release) == null ? void 0 : p.generation) ?? 0) >= 13
  };
}
function Sr(e, t = Yt()) {
  const n = String(new FormData(e).get("contactId") ?? "");
  return t.allContacts.find((a) => a.id === n) ?? null;
}
function zn(e, t = {}) {
  var o, i, l;
  if (!((o = e == null ? void 0 : e.messages) != null && o.length)) return [];
  const n = String(((i = game.user) == null ? void 0 : i.id) ?? ""), a = new Set((((l = game.users) == null ? void 0 : l.contents) ?? []).filter((u) => u.isGM).map((u) => String(u.id))), r = /* @__PURE__ */ new Set(), s = e.isGroup ? e.messages.slice(-1) : e.messages;
  for (const u of s) {
    u.senderUserId && u.senderUserId !== n && !(t.excludeGMs && a.has(u.senderUserId)) && r.add(u.senderUserId);
    for (const c of u.recipientUserIds ?? [])
      c && c !== n && !(t.excludeGMs && a.has(c)) && r.add(c);
  }
  return [...r];
}
function Ir() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => String(t.id)).filter(Boolean);
}
function Ar(e) {
  var a, r;
  const t = !!((a = game.user) != null && a.isGM && (e != null && e.contact) && !e.contact.userId && (e.contact.isNpc || e.contact.managedByGM)), n = [{
    id: "self",
    label: ee(game.user, "Me"),
    selected: !t
  }];
  return !((r = game.user) != null && r.isGM) || !(e != null && e.contact) || e.contact.userId || n.push({
    id: "contact",
    label: e.contact.name,
    selected: t
  }), n;
}
function Hn() {
  var n, a;
  const e = [{
    id: "self",
    label: ee(game.user, "Me"),
    selected: !0,
    contact: null
  }];
  if (!((n = game.user) != null && n.isGM)) return e;
  const t = /* @__PURE__ */ new Set();
  for (const r of [...me(), ...Nt()].map(L)) {
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
      contact: L({
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
function Nr(e, t) {
  var s, o;
  const n = new FormData(e);
  if (t.activeThread)
    return String(n.get("replyAs") ?? "self") === "contact" && ((s = game.user) != null && s.isGM) && t.activeThread.contact ? cn(t.activeThread.contact) : {};
  const a = String(n.get("sendAs") ?? "self");
  if (a === "self" || !((o = game.user) != null && o.isGM)) return {};
  const r = Hn().find((i) => i.id === a);
  return cn(r == null ? void 0 : r.contact);
}
function Mr(e) {
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
function ln(e) {
  var n, a, r, s, o, i;
  const t = String(
    ((n = e == null ? void 0 : e.getTextureSrc) == null ? void 0 : n.call(e)) || ((a = e == null ? void 0 : e.texture) == null ? void 0 : a.src) || ((s = (r = e == null ? void 0 : e.document) == null ? void 0 : r.texture) == null ? void 0 : s.src) || ((i = (o = e == null ? void 0 : e.prototypeToken) == null ? void 0 : o.texture) == null ? void 0 : i.src) || (e == null ? void 0 : e.img) || ""
  ).trim();
  return t.includes("*") ? String((e == null ? void 0 : e.img) ?? "").trim() : t;
}
async function $r(e) {
  var o, i, l, u, c, g, C, w;
  const t = Mr(e), n = globalThis.fromUuid;
  let a = t.uuid && n ? await n(t.uuid) : null;
  !a && t.sceneId && t.tokenId && (a = ((c = (u = (l = (i = (o = game.scenes) == null ? void 0 : o.get) == null ? void 0 : i.call(o, t.sceneId)) == null ? void 0 : l.tokens) == null ? void 0 : u.get) == null ? void 0 : c.call(u, t.tokenId)) ?? null);
  const r = String(
    ((g = a == null ? void 0 : a.actor) == null ? void 0 : g.id) || (a == null ? void 0 : a.actorId) || ((a == null ? void 0 : a.documentName) === "Actor" ? a.id : "") || t.actorId || (t.type === "Actor" ? t.id : "") || ""
  ).trim(), s = (a == null ? void 0 : a.documentName) === "Actor" ? a : (a == null ? void 0 : a.actor) ?? (r ? (w = (C = game.actors) == null ? void 0 : C.get) == null ? void 0 : w.call(C, r) : null);
  return s ? {
    actorId: String(s.id ?? r),
    actorUuid: String(s.uuid ?? `Actor.${s.id ?? r}`),
    actorName: String(s.name ?? "Linked NPC"),
    image: ln(a) || ln(s),
    revealPortrait: !1,
    linkedAt: (/* @__PURE__ */ new Date()).toISOString()
  } : null;
}
async function Tr(e, t) {
  var a, r, s, o, i;
  if (!((a = game.user) != null && a.isGM) || !t) return;
  e.preventDefault(), e.stopPropagation();
  const n = await $r(e);
  if (!n) {
    (s = (r = ui.notifications) == null ? void 0 : r.warn) == null || s.call(r, "Drop an Actor or an Actor-backed Token to link this NPC contact.");
    return;
  }
  await lt(t, n), (i = (o = ui.notifications) == null ? void 0 : o.info) == null || i.call(o, `Linked this NPC conversation to ${n.actorName}.`), await F();
}
async function Er(e, t) {
  var w, T, p, y, S;
  const n = new FormData(e), a = String(n.get("groupName") ?? "").trim(), r = [...new Set(n.getAll("memberUserIds").map((N) => String(N)).filter(Boolean))];
  if (!a) {
    (T = (w = ui.notifications) == null ? void 0 : w.warn) == null || T.call(w, "Enter a name for the group chat.");
    return;
  }
  if (!r.length) {
    (y = (p = ui.notifications) == null ? void 0 : p.warn) == null || y.call(p, "Select at least one other player for the group chat.");
    return;
  }
  const s = String(((S = game.user) == null ? void 0 : S.id) ?? ""), o = [...new Set([s, ...r].filter(Boolean))], i = o.map((N) => {
    var A, G;
    return ee((G = (A = game.users) == null ? void 0 : A.get) == null ? void 0 : G.call(A, N));
  }).filter(Boolean), l = Me(), u = qa(l), c = ee(game.user, "A player"), g = {
    id: `group-${l}`,
    name: a,
    number: `${o.length} members`,
    userIds: r,
    isGroup: !0
  };
  await Vt(g, `${c} created the group.`, {
    threadId: u,
    recipientUserIds: r,
    recipientNumbers: [],
    messageType: "event",
    eventType: "group-created",
    conversationType: "group",
    groupId: l,
    groupName: a,
    groupMemberUserIds: o,
    groupMemberNames: i
  }) && (x = u, Z = !1, K = !1, t && (t.contact = g), (I == null ? void 0 : I.mode) === "messages" && (I.contact = g), await Ve(), await F());
}
function Pr(e, t = null) {
  const n = ne(e, t);
  if (!n) return;
  pr(e, n), fr(e, n), n.querySelectorAll("[data-cybercall-npc-link-drop]").forEach((s) => {
    s.addEventListener("dragover", (o) => {
      var i;
      (i = game.user) != null && i.isGM && (o.preventDefault(), o.dataTransfer.dropEffect = "link", s.classList.add("drag-over"));
    }), s.addEventListener("dragleave", () => s.classList.remove("drag-over")), s.addEventListener("drop", async (o) => {
      s.classList.remove("drag-over");
      const i = s.dataset.cybercallNpcThreadId || s.dataset.cybercallThreadId || x;
      await Tr(o, i);
    });
  }), n.querySelectorAll("[data-cybercall-npc-action]").forEach((s) => {
    s.addEventListener("click", async (o) => {
      var c, g, C, w, T;
      o.preventDefault(), o.stopPropagation();
      const i = o.currentTarget.dataset.cybercallNpcAction, l = o.currentTarget.dataset.cybercallNpcThreadId || x, u = bt()[l];
      if (i === "toggle-reveal" && u) {
        await lt(l, { revealPortrait: u.revealPortrait !== !0 }), await F();
        return;
      }
      if (i === "unlink" && u) {
        await lt(l, null), (g = (c = ui.notifications) == null ? void 0 : c.info) == null || g.call(c, "NPC identity link removed."), await F();
        return;
      }
      i === "change" && ((C = o.currentTarget.closest("[data-cybercall-npc-link-drop]")) == null || C.classList.add("awaiting-drop"), (T = (w = ui.notifications) == null ? void 0 : w.info) == null || T.call(w, "Drag a different Actor or Token onto the NPC identity panel."));
    });
  }), n.querySelectorAll("[data-cybercall-thread-id]").forEach((s) => {
    s.addEventListener("click", async (o) => {
      Z = !1, K = !1, x = o.currentTarget.dataset.cybercallThreadId, await Ve(), await F();
    });
  }), n.querySelectorAll("[data-cybercall-message-action]").forEach((s) => {
    s.addEventListener("click", async (o) => {
      var l;
      const i = o.currentTarget.dataset.cybercallMessageAction;
      if (i === "back") {
        x = "", Z = !1, K = !1, e.contact = null, await F();
        return;
      }
      if (i === "refresh") {
        await F();
        return;
      }
      if (i === "open-calls") {
        await Zn();
        return;
      }
      if (i === "new") {
        Z = !0, K = !1, x = "", X && (X.contact = null), await F();
        return;
      }
      if (i === "new-group") {
        Z = !1, K = !0, x = "", X && (X.contact = null), (I == null ? void 0 : I.mode) === "messages" && (I.contact = null), await F();
        return;
      }
      if (i === "delete-thread") {
        o.preventDefault(), o.stopPropagation();
        const u = n.querySelector("[data-cybercall-active-thread]"), c = x || ((l = u == null ? void 0 : u.dataset) == null ? void 0 : l.cybercallActiveThread) || "";
        if (!c) return;
        if (e._cybercallPendingDeleteThreadId !== c) {
          e._cybercallPendingDeleteThreadId = c, o.currentTarget.classList.add("confirming"), o.currentTarget.textContent = "Confirm Delete", o.currentTarget.setAttribute("aria-label", "Confirm delete thread"), o.currentTarget.title = "Click again to delete this thread";
          return;
        }
        e._cybercallPendingDeleteThreadId = "", await ur(c);
      }
    });
  });
  const a = n.querySelector("form[data-cybercall-group-form]");
  a == null || a.addEventListener("submit", async (s) => {
    s.preventDefault(), await Er(a, e);
  });
  const r = n.querySelector("form[data-cybercall-message-form]");
  r == null || r.addEventListener("submit", async (s) => {
    var p, y, S, N, A, G, k, M, J, _;
    s.preventDefault();
    const o = Yt(), i = o.activeThread, l = (i == null ? void 0 : i.contact) ?? Sr(r, o), u = ((p = r.elements.body) == null ? void 0 : p.value) ?? "", c = Nr(r, o), g = !!(i != null && i.contact && !i.contact.userId && (i.contact.managedByGM || i.contact.isNpc)), C = i ? zn(i, { excludeGMs: ((y = game.user) == null ? void 0 : y.isGM) === !0 && !g }) : null;
    if (!l) {
      (N = (S = ui.notifications) == null ? void 0 : S.warn) == null || N.call(S, "Select a contact before sending a message.");
      return;
    }
    const w = (i == null ? void 0 : i.id) ?? Ke(l, (A = game.user) == null ? void 0 : A.id, c);
    if (await Vt(l, u, {
      ...c,
      threadId: w,
      recipientUserIds: C != null && C.length ? C : void 0,
      recipientNumbers: c.senderNumber ? [] : void 0,
      conversationType: i != null && i.isGroup ? "group" : "direct",
      groupId: (i == null ? void 0 : i.groupId) ?? "",
      groupName: (i == null ? void 0 : i.groupName) ?? "",
      groupMemberUserIds: (i == null ? void 0 : i.groupMemberUserIds) ?? [],
      groupMemberNames: (i == null ? void 0 : i.groupMemberNames) ?? []
    })) {
      if ((G = game.user) != null && G.isGM && !i && c.senderActorId && !bt()[w]) {
        const B = (M = (k = game.actors) == null ? void 0 : k.get) == null ? void 0 : M.call(k, c.senderActorId);
        B && await lt(w, {
          actorId: B.id,
          actorUuid: B.uuid ?? `Actor.${B.id}`,
          actorName: B.name,
          image: c.senderImage || ((_ = (J = B.prototypeToken) == null ? void 0 : J.texture) == null ? void 0 : _.src) || B.img || "",
          revealPortrait: !1,
          linkedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      x = w, e && (e.contact = l), (I == null ? void 0 : I.mode) === "messages" && (I.contact = l), Z = !1, K = !1, r.elements.body.value = "", await Ve(), await F({ scrollToBottom: !0, preserveDraft: !1 });
    }
  }), Ve();
}
function Gr() {
  const e = /* @__PURE__ */ new Set(["outgoing", "connected", "ended", "missed"]), t = game.settings.get(d, "showMessageTimestamps") === !0;
  return Kt().filter((n) => n.messageType === "event" && e.has(n.eventType)).sort((n, a) => a.createdAt.localeCompare(n.createdAt)).map((n) => ({
    body: n.body,
    eventType: n.eventType,
    createdAtLabel: t ? jn(n.createdAt) : ""
  }));
}
function kr(e, t = null) {
  const n = ne(e, t);
  wt(n == null ? void 0 : n.closest(".cybercall-phone-app")), n == null || n.querySelectorAll("[data-cybercall-screen]").forEach((a) => {
    a.addEventListener("click", () => {
      const r = a.dataset.cybercallScreen;
      r !== e.mode && (r === "messages" ? Ne() : en(r));
    });
  });
}
const { CyberCallApplication: Ur, CyberCallComposer: Br, CyberCallPhone: Wn } = Sa({
  moduleId: d,
  templatePath: Ia,
  composerTemplatePath: Aa,
  contactsTemplatePath: Na,
  messagesTemplatePath: Ma,
  phoneTemplatePath: $a,
  escapeHTML: qe,
  getDefaultComposerData: rr,
  getActorChoices: sr,
  getPlayerChoices: Rn,
  getContacts: Nt,
  getGroupContacts: me,
  getMessageContext: Yt,
  getCallHistory: Gr,
  bindPhoneNavigation: kr,
  getRingtoneChoices: aa,
  getMessageSoundOptions: Oa,
  getSoundPath: nn,
  getActiveContactsTab: () => ce,
  getContactsPlayerChoices: On,
  getSelectedContactsPlayerId: Je,
  getPlayerContacts: En,
  canEditContactImages: _e,
  bindCallControls: yr,
  bindComposerControls: hr,
  bindContactsControls: wr,
  bindMessagesControls: Pr,
  stopRinging: He,
  clearActiveCall: (e) => {
    v === e && (v = null);
  },
  clearActiveComposer: (e) => {
    Q === e && (Q = null);
  },
  clearActiveContacts: (e) => {
    Ie === e && (Ie = null);
  },
  clearActiveMessages: (e) => {
    X === e && (X = null);
  },
  clearActivePhone: (e) => {
    v === e && (v = null, He()), I === e && (I = null, Ie = null, X = null);
  }
});
async function pe(e = {}) {
  var a, r, s, o;
  if (!Mt())
    return (r = (a = ui.notifications) == null ? void 0 : a.warn) == null || r.call(a, "You do not have permission to open CyberCall transmissions."), null;
  await Qt();
  const t = re(e);
  !t.fullscreen && !game.user.isGM ? (I ?? (I = new Wn()), Xn(I), I.callData = t, v = I) : v = new Ur(t, t.fullscreen ? { classes: ["cybercall-app", "cybercall-fullscreen"] } : {});
  const n = v;
  return await n.render(!0), v === n && ((s = n.callData) == null ? void 0 : s.id) === t.id && (ea(n), (o = n.bringToFront) == null || o.call(n), jr(n.callData)), n;
}
async function Qt() {
  if (!v) return;
  const e = v;
  if (v = null, e === I) {
    He(), e.callData = null, Ie = e.mode === "calls" ? e : null, X = e.mode === "messages" ? e : null, await e.render(!0);
    return;
  }
  await e.close();
}
function Dr(e) {
  var t;
  return !!((t = v == null ? void 0 : v.callData) != null && t.id) && v.callData.id === e;
}
async function Rr() {
  v && (await v.render(!0), ea(v));
}
async function Kn(e) {
  Dr(e) && (v.callData.accepted = !0, v.callData.ringing = !1, He(), await Rr());
}
async function Or(e) {
  if (!e) return;
  const t = v == null ? void 0 : v.callData;
  game.socket.emit(se, {
    action: "acceptCall",
    callId: e
  });
  const n = Kn(e);
  Qn(t, "connected"), await n;
}
async function Jn(e) {
  var t;
  e && ((t = v == null ? void 0 : v.callData) != null && t.id) && v.callData.id !== e || await Qt();
}
async function Yn(e) {
  const t = v == null ? void 0 : v.callData, n = t != null && t.accepted ? "ended" : "missed";
  game.socket.emit(se, {
    action: "endCall",
    callId: e
  });
  const a = Jn(e);
  Qn(t, n), await a;
}
function Lr(e, t = "Player") {
  var a, r, s, o, i;
  const n = ((r = (a = game.users) == null ? void 0 : a.get) == null ? void 0 : r.call(a, e)) ?? ((i = (o = (s = game.users) == null ? void 0 : s.contents) == null ? void 0 : o.find) == null ? void 0 : i.call(o, (l) => l.id === e));
  return mn(n ?? { id: e }, t);
}
function xr(e) {
  var t;
  return e ? e.contactNumber ? Ht().find((a) => a.number === e.contactNumber) ?? {
    id: `contact-${e.contactNumber}`,
    name: e.contactName || e.callerName,
    number: e.contactNumber,
    image: e.contactImage || e.image,
    actorId: e.contactActorId ?? "",
    managedByGM: !0,
    isNpc: !0
  } : (t = game.user) != null && t.isGM && e.callerUserId ? Lr(e.callerUserId, e.callerName) : null : null;
}
function Fr(e, t) {
  var a;
  const n = /* @__PURE__ */ new Set();
  for (const r of (t == null ? void 0 : t.userIds) ?? []) n.add(String(r));
  if (t != null && t.userId && n.add(String(t.userId)), e != null && e.callerUserId && n.add(String(e.callerUserId)), !(t != null && t.userId) && (t != null && t.managedByGM || t != null && t.isNpc || e != null && e.contactNumber))
    for (const r of Ir()) n.add(r);
  return n.delete(String(((a = game.user) == null ? void 0 : a.id) ?? "")), [...n].filter(Boolean);
}
async function Ot(e, t) {
  var s;
  const n = xr(e);
  if (!n) return null;
  const a = (e == null ? void 0 : e.callerUserId) || ((s = game.user) == null ? void 0 : s.id), r = {
    outgoing: `Outgoing call to ${n.name}.`,
    connected: `Call connected with ${n.name}.`,
    ended: `Call ended with ${n.name}.`,
    missed: `Call missed or declined with ${n.name}.`
  };
  return ar(n, r[t] ?? "Call event.", {
    threadId: Ke(n, a),
    eventType: t,
    senderName: "CyberCall",
    senderNumber: n.number,
    senderActorId: n.actorId,
    recipientUserIds: Fr(e, n),
    recipientNumbers: n.userId ? [] : [n.number]
  });
}
function Qn(e, t) {
  Ot(e, t).catch((n) => {
    console.warn(`${d} | Could not save call history for ${t}.`, n);
  });
}
async function _r(e) {
  var i, l;
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
    return await Ot(u, "outgoing"), pe(u);
  }
  if (!Jt())
    return (l = (i = ui.notifications) == null ? void 0 : i.warn) == null || l.call(i, "No GM is connected to receive the CyberCall."), null;
  const t = Me(), n = We(game.user), a = ee(game.user, "Unknown Caller"), r = {
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
  }, s = re({
    ...r,
    callerName: e.name,
    subtitle: `Comms ${e.number}`,
    image: e.image,
    message: `Awaiting connection to ${e.name} on ${e.number}...`,
    canAccept: !1,
    canDecline: !1,
    outgoing: !0,
    ringing: !0
  }), o = re({
    ...r,
    callerName: a,
    subtitle: `Call request from ${a}`,
    image: n,
    message: `${a} is calling ${e.name} on ${e.number}.`,
    canAccept: !0,
    ringing: !0
  });
  return game.socket.emit(se, {
    action: "playerCallRequest",
    callData: o
  }), await Ot(s, "outgoing"), pe(s);
}
async function Zt() {
  var e, t, n;
  return game.user.isGM ? (Q || (Q = new Br()), Q.rendered || await Q.render(!0), (n = Q.bringToFront) == null || n.call(Q), Q) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function $t() {
  var e, t, n, a;
  return Mt() ? v && !((n = game.user) != null && n.isGM) ? ((a = v.bringToFront) == null || a.call(v), v) : en("calls") : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function z() {
  !I || I.callData || I.mode === "messages" || await I.render(!0);
}
async function Ne(e = null) {
  var n, a;
  if (!Mt())
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "You do not have permission to use CyberCall messages."), null;
  e && (x = Ke(e), Z = !1, K = !1);
  const t = await en("messages", e);
  return t != null && t.callData || await Ve(), t;
}
async function Xt(e) {
  return e && (x = String(e), Z = !1, K = !1), Ne();
}
async function Zn() {
  var e;
  return (e = game.user) != null && e.isGM ? Zt() : $t();
}
async function F(e = {}) {
  !I || I.callData || I.mode !== "messages" || (I._cybercallMessageComposerState = e.preserveDraft === !1 ? null : Vn(I), I._cybercallMessageScrollState = {
    ...qn(I),
    scrollToBottom: e.scrollToBottom === !0
  }, await I.render(!0));
}
function Xn(e) {
  if (e.mode !== "messages" || e.callData) return;
  const t = Vn(e);
  t && (e._cybercallMessageComposerState = t);
  const n = qn(e);
  n && (e._cybercallMessageScrollState = n);
}
async function en(e = "calls", t = null) {
  var a;
  I ? (Xn(I), (e !== I.mode || t) && (I.contact = t ?? I.contact), I.mode = e) : I = new Wn(e, t), Ie = e === "calls" ? I : null, X = e === "messages" ? I : null;
  const n = I;
  return n.callData || await n.render(!0), (a = n.bringToFront) == null || a.call(n), n;
}
async function tn(e = {}) {
  var n, a;
  if (!game.user.isGM)
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Only the GM can broadcast CyberCalls to all players."), null;
  const t = re({
    ...e,
    fullscreen: e.fullscreen ?? !0,
    ringing: e.ringing ?? !0
  });
  return game.socket.emit(se, {
    action: "openCall",
    callData: t,
    targetUserIds: t.targetUserIds
  }), pe({ ...t, outgoing: !0 });
}
async function qr(e) {
  var t, n, a, r;
  if (e.action === "personalContactDirectories") {
    (t = game.user) != null && t.isGM && await qt();
    return;
  }
  if (e && !(Array.isArray(e.targetUserIds) && e.targetUserIds.length && !e.targetUserIds.includes((n = game.user) == null ? void 0 : n.id)) && !(Array.isArray((a = e.callData) == null ? void 0 : a.targetUserIds) && e.callData.targetUserIds.length && !e.callData.targetUserIds.includes((r = game.user) == null ? void 0 : r.id))) {
    if (e.action === "openCall") {
      if (!Mt()) return;
      pe(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      pe(e.callData);
      return;
    }
    if (e.action === "acceptCall") {
      Kn(e.callId);
      return;
    }
    if (e.action === "endCall") {
      Jn(e.callId);
      return;
    }
    if (e.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const s = L({
        ...e.contact,
        image: ""
      });
      if (!s.name || !s.number) return;
      const o = me();
      o.push(s), await yt(o), await z();
      return;
    }
    if (e.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await yt(me().filter((s) => s.id !== e.contactId)), await z();
      return;
    }
    e.action === "groupContactsChanged" && (Ae = Array.isArray(e.contacts) ? e.contacts.map(L) : null, await z());
  }
}
function ea(e) {
  var t, n;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((n = e.setPosition) == null || n.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function ta() {
  const e = game.settings.get(d, "ringSoundsByWorld");
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function Vr() {
  return /* @__PURE__ */ new Set([
    ...Object.keys(Lt),
    ...de(game.settings.get(d, "customRingtones")).map((e) => e.path)
  ]);
}
function nn() {
  const e = Ce(), t = ta(), n = Object.prototype.hasOwnProperty.call(t, e), a = String(n ? t[e] : game.settings.get(d, "ringSound") ?? "").trim();
  return Vr().has(a) ? a : hn;
}
async function na(e) {
  const t = Ce();
  await game.settings.set(d, "ringSoundsByWorld", {
    ...ta(),
    [t]: String(e ?? "").trim()
  });
}
function aa() {
  const e = nn(), t = de(game.settings.get(d, "customRingtones")), n = new Map(Object.entries(Lt));
  for (const a of t)
    n.has(a.path) || n.set(a.path, a.label);
  return [...n].map(([a, r]) => ({
    value: a,
    label: r,
    selected: a === e
  }));
}
function He() {
  if (Dt += 1, !le) return;
  const e = le;
  le = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function jr(e) {
  var s;
  if (He(), !e.ringing) return;
  const t = nn();
  if (!t) return;
  const a = 0.65 * (Math.max(0, Math.min(100, Number(game.settings.get(d, "ringVolume") ?? 100))) / 100), r = ((s = foundry == null ? void 0 : foundry.audio) == null ? void 0 : s.AudioHelper) ?? globalThis.AudioHelper;
  if (r != null && r.play) {
    const o = Dt;
    r.play({ src: t, volume: a, autoplay: !0, loop: !0, channel: "interface" }, !1).then((i) => {
      var l;
      o === Dt ? le = i : typeof (i == null ? void 0 : i.stop) == "function" ? i.stop() : (l = i == null ? void 0 : i.pause) == null || l.call(i);
    }).catch((i) => {
      console.warn(`${d} | Unable to play ringing sound.`, i);
    });
  } else {
    const o = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5);
    le = new Audio(t), le.loop = !0, le.volume = a * o, le.play().catch((i) => {
      console.warn(`${d} | Unable to play ringing sound.`, i);
    });
  }
}
function zr() {
  var i;
  const e = Sn();
  if (e) {
    const l = ((i = foundry == null ? void 0 : foundry.audio) == null ? void 0 : i.AudioHelper) ?? globalThis.AudioHelper;
    if (l != null && l.play)
      Promise.resolve(l.play({ src: e, volume: 0.65, loop: !1 }, !1)).catch((u) => console.warn(`${d} | Unable to play message notification sound.`, u));
    else {
      const u = new Audio(e);
      u.volume = 0.65 * Math.max(0, Math.min(1, Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5))), u.play().catch((c) => console.warn(`${d} | Unable to play message notification sound.`, c));
    }
    return;
  }
  const t = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  if (!t) return;
  const n = new t(), a = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), r = Math.max(1e-4, Math.min(0.18, 0.18 * a)), s = (l, u, c) => {
    const g = n.createOscillator(), C = n.createGain(), w = n.currentTime + u, T = w + c;
    g.type = "sine", g.frequency.setValueAtTime(l, w), g.frequency.exponentialRampToValueAtTime(l * 1.18, T), C.gain.setValueAtTime(1e-4, w), C.gain.exponentialRampToValueAtTime(r, w + 0.025), C.gain.exponentialRampToValueAtTime(1e-4, T), g.connect(C), C.connect(n.destination), g.start(w), g.stop(T);
  };
  (async () => {
    n.state === "suspended" && await n.resume(), s(620, 0, 0.16), s(930, 0.11, 0.2), window.setTimeout(() => {
      var l;
      return (l = n.close) == null ? void 0 : l.call(n);
    }, 500);
  })().catch(() => {
    var l;
    return (l = n.close) == null ? void 0 : l.call(n);
  });
}
function Hr(e) {
  var n, a, r, s, o;
  if (e.senderImage) return String(e.senderImage);
  if (e.contactIsNpc && e.senderNumber) return "";
  const t = ((a = (n = game.users) == null ? void 0 : n.get) == null ? void 0 : a.call(n, e.senderUserId)) ?? ((o = (s = (r = game.users) == null ? void 0 : r.contents) == null ? void 0 : s.find) == null ? void 0 : o.call(s, (i) => i.id === e.senderUserId));
  return (t == null ? void 0 : t.isGM) === !0 ? "" : We(t);
}
function un(e) {
  e != null && e.isConnected && (e.classList.add("leaving"), window.setTimeout(() => e.remove(), 220));
}
function Wr(e) {
  let t = document.querySelector("[data-cybercall-message-notifications]");
  t || (t = document.createElement("div"), t.className = "cybercall-message-notifications", t.dataset.cybercallMessageNotifications = "", t.setAttribute("aria-live", "polite"), document.body.append(t));
  const n = String(e.senderName || "New message").trim(), a = String(e.groupName || "").trim(), r = document.createElement("button");
  r.type = "button", r.className = "cybercall-incoming-message", r.title = "Open CyberCall conversation";
  const s = document.createElement("span");
  s.className = `cybercall-incoming-avatar ${In(e.senderUserId || n)}`;
  const o = Hr(e);
  if (o) {
    const g = document.createElement("img");
    g.src = o, g.alt = "", s.append(g);
  } else
    s.textContent = te(n);
  const i = document.createElement("i");
  i.className = "fa-solid fa-message cybercall-incoming-badge", i.setAttribute("aria-hidden", "true"), s.append(i);
  const l = document.createElement("span");
  l.className = "cybercall-incoming-copy";
  const u = document.createElement("strong");
  u.textContent = a ? `${n} · ${a}` : n;
  const c = document.createElement("small");
  c.textContent = String(e.body || "New CyberCall message").trim(), l.append(u, c), r.append(s, l), r.addEventListener("click", () => {
    un(r), Xt(String(e.threadId || ""));
  }), t.append(r), zr(), window.setTimeout(() => un(r), 4200);
}
function Kr(e) {
  var n, a, r;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[d]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, d, "message"));
  return (t == null ? void 0 : t.kind) === ie ? t : ((r = t == null ? void 0 : t.message) == null ? void 0 : r.kind) === ie ? t.message : null;
}
function ra(e, t) {
  var a, r, s, o, i, l, u;
  if (!e) return;
  const n = (a = e.matches) != null && a.call(e, ".chat-message") ? e : ((r = e.closest) == null ? void 0 : r.call(e, ".chat-message")) ?? ((s = e.querySelector) == null ? void 0 : s.call(e, ".chat-message")) ?? e;
  (i = (o = n.classList) == null ? void 0 : o.toggle) == null || i.call(o, "cybercall-chat-message-hidden", !t), t ? (l = n.removeAttribute) == null || l.call(n, "aria-hidden") : (u = n.setAttribute) == null || u.call(n, "aria-hidden", "true");
}
function sa(e, t) {
  var a, r;
  if (!((r = (a = e == null ? void 0 : e.flags) == null ? void 0 : a[d]) != null && r.archiveNotice) && !Kr(e)) return;
  const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? (t == null ? void 0 : t.element) ?? null;
  ra(n, game.settings.get(d, "showChatCards") === !0);
}
function ia() {
  const e = game.settings.get(d, "showChatCards") === !0;
  document.querySelectorAll(".cybercall-chat-card").forEach((t) => {
    ra(t, e);
  });
}
function oa() {
  const e = game.modules.get(d);
  e && (e.api = {
    openCall: pe,
    closeCall: Qt,
    broadcastCall: tn,
    openComposer: Zt,
    openContacts: $t,
    openMessages: Ne,
    openMessagesThread: Xt,
    openCallPanel: Zn,
    getUnreadMessageCount: _n,
    get activeCall() {
      return v;
    },
    get activeComposer() {
      return Q;
    },
    get activeContacts() {
      return Ie;
    },
    get activeMessages() {
      return X;
    }
  });
}
function Jr() {
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
      return (a = game.user) != null && a.isGM ? Zt() : $t();
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
function Yr() {
  game.settings.register(d, mt, { scope: "world", config: !1, type: Boolean, default: !1 }), game.settings.register(d, "deviceEmblem", {
    name: "Device emblem",
    scope: "world",
    config: !1,
    type: String,
    default: "",
    onChange: () => ut(document)
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
    default: W.signal,
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
    choices: Lt
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
      (I == null ? void 0 : I.mode) === "settings" && z();
      const n = (a = ne(Q)) == null ? void 0 : a.querySelector("[data-cybercall-ringtone]");
      n instanceof HTMLSelectElement && n.replaceChildren(...aa().map(
        ({ label: r, value: s, selected: o }) => new Option(r, s, o, o)
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
      F(), z();
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
      (I == null ? void 0 : I.mode) === "settings" && z();
    }
  }), game.settings.register(d, "shareMessageSounds", {
    name: "Allow Uploaded Notification Sounds to Be Used by Players",
    hint: "Let players select sounds from the GM message notification sound library. Turning this off restores the built-in tone for players using a shared sound. Personal uploads follow Foundry's file permissions.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0,
    onChange: () => {
      (I == null ? void 0 : I.mode) === "settings" && z();
    }
  }), game.settings.registerMenu(d, "messageSoundMenu", {
    name: "Message Notification Sound",
    label: "Manage Notification Sounds",
    hint: "Add one or more audio files to the notification list for this world.",
    icon: "fa-solid fa-music",
    type: xa,
    restricted: !0
  }), game.settings.register(d, "showChatCards", {
    name: "Show CyberCall Chat Cards",
    hint: "Show CyberCall message cards in Foundry's standard chat log. Disabled by default because CyberCall has its own inbox and notifications.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: () => ia()
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
      F(), z();
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
async function Qr() {
  const e = game.settings.get(d, "contacts");
  Array.isArray(e) && await game.settings.set(d, "contacts", {
    [Ce()]: e.map(L)
  });
}
Hooks.once("init", () => {
  Yr(), oa();
});
Hooks.once("ready", async () => {
  var e;
  await Qr(), oa(), Jr(), game.socket.on(se, qr), await qt(), await xn(), await je(), game.user.isGM && window.setInterval(je, 6e4), (e = game.user) != null && e.isGM || game.socket.emit(se, { action: "personalContactDirectories" }), ia(), console.log(`${d} | Ready. Use game.modules.get("${d}").api.openCall({...})`);
});
Hooks.on("renderChatMessage", (e, t) => {
  sa(e, t);
});
Hooks.on("createUser", () => qt());
Hooks.on("holosuite-core.brandingChanged", () => ut(document));
Hooks.on("renderJournalDirectory", (e, t) => {
  const n = ne(e, t);
  n == null || n.querySelectorAll("[data-document-id], [data-entry-id]").forEach((a) => {
    var s, o;
    const r = (o = (s = game.journal) == null ? void 0 : s.get) == null ? void 0 : o.call(s, a.dataset.documentId ?? a.dataset.entryId);
    (St(r) || r != null && r.getFlag(d, "playerPersonalContactDirectory")) && (a.hidden = !0);
  });
});
Hooks.on("renderChatMessageHTML", (e, t) => {
  sa(e, t);
});
for (const e of ["create", "update", "delete"])
  Hooks.on(`${e}JournalEntry`, (t) => {
    Qa(t) && (e === "create" && xn(), z(), F());
  });
Hooks.on("userConnected", () => je());
Hooks.on("updateUser", (e, t) => {
  var n, a;
  (a = (n = t.flags) == null ? void 0 : n[d]) != null && a.pendingMessages && (je(), e.id === game.user.id && F());
});
Hooks.on("createJournalEntryPage", async (e, t) => {
  var l, u;
  const n = Mn(e);
  if (!n || t.cybercallMigration) return;
  const a = String(((l = game.user) == null ? void 0 : l.id) ?? ""), r = Array.isArray(n.recipientUserIds) ? n.recipientUserIds.map((c) => String(c)) : [], s = ((u = game.user) == null ? void 0 : u.isGM) === !0 && !String(n.contactUserId ?? "") && (n.contactManagedByGM === !0 || n.contactIsNpc === !0), o = String(n.senderUserId ?? "") !== a && (r.includes(a) || s), i = String(n.messageType ?? "text") === "text" || n.eventType === "group-created";
  o && i && game.settings.get(d, "messageNotifications") !== !1 && Wr(n), await F(), await z();
});
document.addEventListener("click", (e) => {
  var a;
  const t = e.target, n = (a = t == null ? void 0 : t.closest) == null ? void 0 : a.call(t, "[data-cybercall-open-thread]");
  n && (e.preventDefault(), Xt(n.dataset.cybercallThreadId));
});
Hooks.on("deleteJournalEntryPage", (e) => {
  St(e.parent) && (F(), z());
});
