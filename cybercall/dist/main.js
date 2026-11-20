var Yn = Object.defineProperty;
var Jn = (e, t, n) => t in e ? Yn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var R = (e, t, n) => Jn(e, typeof t != "symbol" ? t + "" : t, n);
function Qn(e, t) {
  return e.image ? `<img src="${t(e.image)}" alt="${t(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${t(e.initials)}</div>`;
}
function wt(e, t) {
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
    `, c = e.accepted ? "" : `<blockquote>${t(e.message)}</blockquote>`, u = e.accepted || e.outgoing ? '<button type="button" data-cybercall-action="end">End Call</button>' : `
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
        <div class="cybercall-portrait">${Qn(e, t)}</div>
        <div class="cybercall-waveform" aria-hidden="true"></div>
        ${c}
      </main>
      <footer class="cybercall-actions">
        ${u}
      </footer>
    </div>
  `;
}
function Ht(e, t) {
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
function vt(e, t) {
  var c;
  const n = (u, l) => u.length ? u.map((p) => `
        <li>
          <div class="cybercall-contact-avatar">
            ${p.image ? `<img src="${t(p.image)}" alt="">` : `<span>${t(p.initials)}</span>`}
          </div>
          <div class="cybercall-contact-id">
            <strong>${t(p.name)}</strong>
            <span>${t(p.number)}</span>
          </div>
          <div class="cybercall-contact-actions">
            <button type="button" data-cybercall-contact-action="call" data-contact-scope="${l}" data-contact-id="${t(p.id)}">Call</button>
            <button type="button" data-cybercall-contact-action="message" data-contact-scope="${l}" data-contact-id="${t(p.id)}">Message</button>
            <button type="button" data-cybercall-contact-action="remove" data-contact-scope="${l}" data-contact-id="${t(p.id)}">Remove</button>
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
function St(e, t) {
  var M;
  const n = e.threads ?? [], a = e.activeThread ?? null, r = e.allContacts ?? [], s = n.length ? n.map((m) => `
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
      `).join("") : '<div class="cybercall-messages-empty">No messages yet.</div>', o = r.map((m) => `<option value="${t(m.id)}" ${e.selectedContactId === m.id ? "selected" : ""}>${t(m.name)} - ${t(m.number)}</option>`).join(""), i = e.canReplyAs ? `
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
          ${o}
        </select>
      </label>
    `, l = (M = a == null ? void 0 : a.messages) != null && M.length ? a.messages.map((m) => `
        <article class="cybercall-message ${m.isMine ? "mine" : ""} ${m.isEvent ? "event" : ""}">
          <strong>${t(m.senderName)}</strong>
          <p>${t(m.body)}</p>
          ${e.showMessageTimestamps ? `<time>${t(m.createdAtLabel ?? m.createdAt)}</time>` : ""}
        </article>
      `).join("") : '<div class="cybercall-messages-empty">Select a thread or send a new message.</div>', y = `
    <form class="cybercall-group-form" data-cybercall-group-form>
      <label class="cybercall-group-name">
        <span>Group Name</span>
        <input type="text" name="groupName" maxlength="80" autocomplete="off" placeholder="Night City Crew" required>
      </label>
      <fieldset>
        <legend>Players</legend>
        <div class="cybercall-group-members">${(e.groupMemberChoices ?? []).length ? (e.groupMemberChoices ?? []).map((m) => `
        <label>
          <input type="checkbox" name="memberUserIds" value="${t(m.id)}">
          <span>${t(m.name)}${m.active ? "" : " (offline)"}</span>
        </label>
      `).join("") : "<p>No other player users are available.</p>"}</div>
      </fieldset>
      <button type="submit" ${e.hasGroupMemberChoices ? "" : "disabled"}>Create Group</button>
    </form>
  `, v = a != null && a.showNpcLinkPanel ? `
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
        ${v}
        ${e.isComposingNewGroup ? y : `
          <div class="cybercall-message-log">${l}</div>
          <form class="cybercall-message-form ${e.canReplyAs ? "has-reply-as" : ""} ${e.canSendAs ? "has-send-as" : ""}" data-cybercall-message-form>
            ${u}
            ${i}
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
}, Zn = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]);
function tn(e) {
  const t = Number(e);
  return Number.isNaN(t) ? K.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function Xn(e) {
  const t = tn(e), n = (100 - t) / 100;
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
function Ne() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function re(e = {}) {
  var r;
  const t = Array.isArray(e.targetUserIds) ? e.targetUserIds.map((s) => String(s)).filter(Boolean) : [], n = Array.isArray(e.targetUserNames) ? e.targetUserNames.map((s) => String(s)).filter(Boolean) : [], a = {
    ...K,
    ...e,
    id: String(e.id ?? Ne()),
    callerName: String(e.callerName ?? K.callerName),
    subtitle: String(e.subtitle ?? K.subtitle),
    image: String(e.image ?? K.image),
    message: String(e.message ?? K.message),
    signal: tn(e.signal ?? K.signal),
    variant: Zn.has(e.variant) ? e.variant : K.variant,
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
  return a.initials = ne(a.callerName), Object.assign(a, Xn(a.signal)), a.showBroadcast = !!((r = game == null ? void 0 : game.user) != null && r.isGM && a.allowBroadcast), a.isStandard = a.variant === "standard", a.isEmergency = a.variant === "emergency", a.isCorrupted = a.variant === "corrupted", a.isIncoming = !a.accepted, a.hasTargets = a.targetUserIds.length > 0, a.recipientLabel = a.hasTargets ? a.targetUserNames.join(", ") : "All players", a.directionLabel = a.outgoing ? `Calling ${a.recipientLabel}` : `From ${a.callerName}`, a.kicker = a.outgoing ? "Calling" : a.isEmergency ? "Emergency transmission" : a.isCorrupted ? "Unstable transmission" : a.fullscreen ? "Incoming broadcast" : "Incoming transmission", a;
}
function O(e = {}) {
  const t = Array.isArray(e.userIds) ? e.userIds.map((n) => String(n)).filter(Boolean) : e.userId ? [String(e.userId)] : [];
  return {
    id: String(e.id ?? Ne()),
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
function ea(e) {
  var a, r, s;
  const t = (e == null ? void 0 : e.document) ?? e, n = String(
    ((a = t == null ? void 0 : t.getTextureSrc) == null ? void 0 : a.call(t)) || ((r = t == null ? void 0 : t.texture) == null ? void 0 : r.src) || (t == null ? void 0 : t.img) || ((s = e == null ? void 0 : e.texture) == null ? void 0 : s.src) || ""
  ).trim();
  return n.includes("*") ? "" : n;
}
function nt(e) {
  return !e || /(?:^|\/)mystery-man(?:-[^/.]+)?\.svg(?:$|\?)/i.test(e);
}
function Me(e) {
  var m, b, S, N, A, k, P, T, J, F, G, W;
  if (!e) return "";
  const t = globalThis.game, n = globalThis.canvas, a = String(e.avatar ?? ((m = e._source) == null ? void 0 : m.avatar) ?? "").trim();
  if (e.isGM === !0) return nt(a) ? "" : a;
  const r = e.character ?? e.characterId ?? ((b = e._source) == null ? void 0 : b.character), s = typeof r == "string" ? r : String((r == null ? void 0 : r.id) ?? (r == null ? void 0 : r._id) ?? ""), o = nn(e), i = Array.isArray((S = n == null ? void 0 : n.tokens) == null ? void 0 : S.placeables) ? n.tokens.placeables : [], c = String(((N = t == null ? void 0 : t.user) == null ? void 0 : N.id) ?? "") === String(e.id ?? "") ? ((A = n == null ? void 0 : n.tokens) == null ? void 0 : A.controlled) ?? [] : [], u = ((k = o == null ? void 0 : o.getActiveTokens) == null ? void 0 : k.call(o, !0, !0)) ?? [], l = i.find((D) => {
    var H, q;
    const U = String(((H = D == null ? void 0 : D.actor) == null ? void 0 : H.id) ?? ((q = D == null ? void 0 : D.document) == null ? void 0 : q.actorId) ?? (D == null ? void 0 : D.actorId) ?? "");
    return s && U === s;
  }), p = i.find((D) => {
    var H, q;
    const U = (D == null ? void 0 : D.actor) ?? ((H = D == null ? void 0 : D.document) == null ? void 0 : H.actor);
    return Number(((q = U == null ? void 0 : U.ownership) == null ? void 0 : q[e.id]) ?? 0) >= 3;
  }), y = [...c, ...u, l, p].filter(Boolean).map(ea).find(Boolean) ?? "";
  if (y) return y;
  const v = String(
    ((T = (P = o == null ? void 0 : o.prototypeToken) == null ? void 0 : P.texture) == null ? void 0 : T.src) || ((G = (F = (J = o == null ? void 0 : o._source) == null ? void 0 : J.prototypeToken) == null ? void 0 : F.texture) == null ? void 0 : G.src) || ""
  ).trim();
  if (v && !v.includes("*") && !nt(v))
    return v;
  const M = String((o == null ? void 0 : o.img) ?? ((W = o == null ? void 0 : o._source) == null ? void 0 : W.img) ?? "").trim();
  return nt(M) ? nt(a) ? "" : a : M;
}
function nn(e) {
  var r, s, o;
  if (!e) return null;
  const t = globalThis.game, n = e.character ?? e.characterId ?? ((r = e._source) == null ? void 0 : r.character), a = typeof n == "string" ? n : String((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n._id) ?? "");
  return (a ? (o = (s = t == null ? void 0 : t.actors) == null ? void 0 : s.get) == null ? void 0 : o.call(s, a) : null) ?? (typeof n == "object" ? n : null);
}
function Z(e, t = "") {
  var a;
  const n = String(((a = nn(e)) == null ? void 0 : a.name) ?? "").trim();
  return n || String((e == null ? void 0 : e.name) ?? "").trim() || t;
}
function an() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) ?? null;
}
function rn() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : n.api) ?? null;
}
function ta(e = {}, t = {}) {
  var a, r, s;
  const n = ((r = (a = globalThis.foundry) == null ? void 0 : a.utils) == null ? void 0 : r.mergeObject) ?? ((s = foundry == null ? void 0 : foundry.utils) == null ? void 0 : s.mergeObject);
  return typeof n == "function" ? n(e, t, { inplace: !1 }) : { ...e, ...t };
}
function na() {
  var e, t, n, a, r;
  return ((n = (t = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : t.randomID) == null ? void 0 : n.call(t, 8)) ?? ((r = (a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.randomID) == null ? void 0 : r.call(a, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function Kt(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${na()}`),
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
function aa() {
  var t, n, a;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((a = game == null ? void 0 : game.release) == null ? void 0 : a.generation));
  return Number.isFinite(e) ? e : null;
}
function ra() {
  const e = aa();
  return e === null || e >= 13;
}
function sn(e) {
  return class extends e {
    constructor(a = {}) {
      const r = ta(new.target.defaultOptions ?? {}, a);
      super(Kt(r));
      R(this, "_v1Options");
      this._v1Options = r;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return Kt(this.defaultOptions ?? {});
    }
    activateListeners(a) {
    }
    async _renderHTML(a, r) {
      var u, l, p;
      const s = typeof this.getData == "function" ? await this.getData() : {}, o = ((u = this._v1Options) == null ? void 0 : u.template) ?? ((l = this.options) == null ? void 0 : l.template) ?? ((p = this.constructor.defaultOptions) == null ? void 0 : p.template);
      if (!o) return document.createDocumentFragment();
      const i = await globalThis.renderTemplate(o, s), c = document.createElement("template");
      return c.innerHTML = i.trim(), c.content;
    }
    _activateV1Form(a) {
      var s, o;
      if (typeof this._updateObject != "function") return;
      const r = (s = a.matches) != null && s.call(a, "form") ? a : (o = a.querySelector) == null ? void 0 : o.call(a, "form");
      r instanceof HTMLFormElement && r.addEventListener("submit", async (i) => {
        var u;
        i.preventDefault(), i.stopPropagation();
        const c = new FormData(r);
        await this._updateObject(i, c), ((u = this._v1Options) == null ? void 0 : u.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(a, r, s) {
      var l, p, y, v;
      r.replaceChildren(a);
      const o = globalThis.jQuery ?? globalThis.$, i = ((l = r.closest) == null ? void 0 : l.call(r, ".window-app, .app, .application")) ?? r, c = o ? o(i) : i;
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
      const u = (p = this._v1Options) == null ? void 0 : p.classes;
      Array.isArray(u) && u.length && (r.classList.add(...u), (v = (y = r.closest) == null ? void 0 : y.call(r, ".window-app, .app, .application")) == null || v.classList.add(...u)), this._activateV1Form(r), typeof this.activateListeners == "function" && this.activateListeners(o ? o(r) : r);
    }
  };
}
function sa() {
  const e = an(), t = rn(), n = globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (n) return n;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? sn(a) : null;
}
function ia() {
  const e = an(), t = rn(), n = globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (n) return n;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? sn(a) : sa();
}
function oa() {
  var n, a, r, s, o, i;
  const e = ((a = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : a.api) ?? ((r = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : r.api) ?? null, t = ((o = (s = globalThis.foundry) == null ? void 0 : s.applications) == null ? void 0 : o.api) ?? ((i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function ca(e) {
  var Le, Re, be, Oe;
  const {
    moduleId: t,
    templatePath: n,
    composerTemplatePath: a,
    contactsTemplatePath: r,
    messagesTemplatePath: s,
    phoneTemplatePath: o,
    escapeHTML: i,
    getDefaultComposerData: c,
    getActorChoices: u,
    getPlayerChoices: l,
    getContacts: p,
    getGroupContacts: y,
    getMessageContext: v,
    getCallHistory: M,
    bindPhoneNavigation: m,
    getRingtoneChoices: b,
    getMessageSoundOptions: S,
    getSoundPath: N,
    getActiveContactsTab: A,
    getContactsPlayerChoices: k,
    getSelectedContactsPlayerId: P,
    getPlayerContacts: T,
    canEditContactImages: J,
    bindCallControls: F,
    bindComposerControls: G,
    bindContactsControls: W,
    bindMessagesControls: D,
    stopRinging: U,
    clearActiveCall: H,
    clearActiveComposer: q,
    clearActiveContacts: Ee,
    clearActiveMessages: V,
    clearActivePhone: ke
  } = e, Q = (Re = (Le = foundry == null ? void 0 : foundry.applications) == null ? void 0 : Le.api) == null ? void 0 : Re.ApplicationV2, j = (Oe = (be = foundry == null ? void 0 : foundry.applications) == null ? void 0 : be.api) == null ? void 0 : Oe.HandlebarsApplicationMixin, me = oa(), pe = ra();
  function Pe() {
    var L;
    const g = p(), C = y(), f = A(), h = P(), { unreadCount: E } = v();
    return {
      contacts: g,
      groupContacts: C,
      hasContacts: g.length > 0,
      hasGroupContacts: C.length > 0,
      activeTab: f,
      isPersonalTab: f === "personal",
      isPlayerTab: f === "player",
      players: k(),
      playerContacts: (L = game.user) != null && L.isGM ? T(h) : [],
      hideContactEditor: f === "player" && !h,
      isGroupTab: f === "group",
      canEditContactImages: J(),
      canManageNpcContacts: J(),
      actors: u(),
      unreadMessageCount: E,
      hasUnreadMessages: E > 0,
      ringtoneChoices: b(),
      messageSoundOptions: S(),
      currentRingtone: N()
    };
  }
  function Ge() {
    const g = c();
    return {
      call: g,
      previewCall: re({ ...g, fullscreen: !1 }),
      actors: u(),
      players: l(),
      ringtoneChoices: b(),
      phoneNumberFormat: game.settings.get(t, "phoneNumberFormat"),
      deviceEmblem: game.settings.get(t, "deviceEmblem")
    };
  }
  function Ue(g, C = null, f = null) {
    if (f) return { call: f, isCallScreen: !0 };
    const h = g === "messages", E = g === "history", L = g === "settings", Kn = !h && !E && !L;
    return {
      ...h ? v(C) : Pe(),
      mode: g,
      inPhone: !0,
      isMessagesMode: h,
      isHistoryMode: E,
      isSettingsMode: L,
      isContactsMode: Kn,
      history: E ? M() : []
    };
  }
  let Ce;
  async function fe() {
    var f, h;
    const g = (f = foundry == null ? void 0 : foundry.applications) == null ? void 0 : f.handlebars, C = ((h = g == null ? void 0 : g.loadTemplates) == null ? void 0 : h.bind(g)) ?? globalThis.loadTemplates;
    Ce ?? (Ce = Promise.resolve(C([
      n,
      r,
      s
    ])).catch((E) => {
      throw Ce = void 0, E;
    })), await Ce;
  }
  function Be(g) {
    return g.isCallScreen ? wt(g.call, i) : g.isMessagesMode ? St(g, i) : vt(g, i);
  }
  function ie(g) {
    const C = document.createElement("template");
    C.innerHTML = g.trim();
    const f = C.content.firstElementChild;
    return {
      main: f instanceof HTMLElement ? f : document.createElement("div")
    };
  }
  function De(g, C = null) {
    if (g.callData) {
      F(g, C);
      return;
    }
    m(g, C), g.mode === "messages" ? D(g, C) : W(g, C);
  }
  class He extends me {
    constructor(f, h = {}) {
      super(h);
      R(this, "callData");
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
      } catch (h) {
        return console.warn(`${t} | Template render failed, using inline fallback.`, h), $(wt(this.callData, i));
      }
    }
    activateListeners(f) {
      super.activateListeners(f), F(this, f);
    }
    async close(f) {
      return H(this), U(), super.close(f);
    }
  }
  class Ke extends me {
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
      return Ge();
    }
    async _renderInner(C) {
      try {
        return await fe(), await super._renderInner(C);
      } catch (f) {
        return console.warn(`${t} | Composer template render failed, using inline fallback.`, f), $(Ht(C, i));
      }
    }
    activateListeners(C) {
      super.activateListeners(C), G(this, C);
    }
    async close(C) {
      return q(this), super.close(C);
    }
  }
  class Ye extends me {
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
      return Pe();
    }
    async _renderInner(C) {
      try {
        return await super._renderInner(C);
      } catch (f) {
        return console.warn(`${t} | Contacts template render failed, using inline fallback.`, f), $(vt(C, i));
      }
    }
    activateListeners(C) {
      super.activateListeners(C), W(this, C);
    }
    async close(C) {
      return Ee(this), super.close(C);
    }
  }
  class Je extends me {
    constructor(f = "calls", h = null, E = {}) {
      super(E);
      R(this, "mode");
      R(this, "contact");
      R(this, "callData", null);
      this.mode = f, this.contact = h;
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
        return await fe(), await super._renderInner(f);
      } catch (h) {
        return console.warn(`${t} | Phone template render failed, using inline fallback.`, h), $(Be(f));
      }
    }
    activateListeners(f) {
      super.activateListeners(f), De(this, f);
    }
    async close(f) {
      return ke(this), super.close(f);
    }
  }
  class Qe extends me {
    constructor(f = null, h = {}) {
      super(h);
      R(this, "contact");
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
      return v(this.contact);
    }
    async _renderInner(f) {
      try {
        return await super._renderInner(f);
      } catch (h) {
        return console.warn(`${t} | Messages template render failed, using inline fallback.`, h), $(St(f, i));
      }
    }
    activateListeners(f) {
      super.activateListeners(f), D(this, f);
    }
    async close(f) {
      return V(this), super.close(f);
    }
  }
  function Ze() {
    var g;
    return !pe || !Q || !j ? null : (g = class extends j(Q) {
      constructor(h, E = {}) {
        super(E);
        R(this, "callData");
        this.callData = re(h);
      }
      async _prepareContext(h) {
        return {
          ...await super._prepareContext(h),
          call: this.callData
        };
      }
      async _renderHTML(h, E) {
        try {
          return await super._renderHTML(h, E);
        } catch (L) {
          return console.warn(`${t} | Template render failed, using inline fallback.`, L), ie(wt(this.callData, i));
        }
      }
      _onRender(h, E) {
        var L;
        (L = super._onRender) == null || L.call(this, h, E), F(this);
      }
      async close(h) {
        return H(this), U(), super.close(h);
      }
    }, R(g, "DEFAULT_OPTIONS", {
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
    }), R(g, "PARTS", {
      main: {
        template: n
      }
    }), g);
  }
  function Xe() {
    var g;
    return !pe || !Q || !j ? null : (g = class extends j(Q) {
      async _prepareContext(f) {
        return {
          ...await super._prepareContext(f),
          ...Ge()
        };
      }
      async _renderHTML(f, h) {
        try {
          return await fe(), await super._renderHTML(f, h);
        } catch (E) {
          return console.warn(`${t} | Composer template render failed, using inline fallback.`, E), ie(Ht(f, i));
        }
      }
      _onRender(f, h) {
        var E;
        (E = super._onRender) == null || E.call(this, f, h), G(this);
      }
      async close(f) {
        return q(this), super.close(f);
      }
    }, R(g, "DEFAULT_OPTIONS", {
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
    }), R(g, "PARTS", {
      main: {
        template: a
      }
    }), g);
  }
  function et() {
    var g;
    return !pe || !Q || !j ? null : (g = class extends j(Q) {
      async _prepareContext(f) {
        return {
          ...await super._prepareContext(f),
          ...Pe()
        };
      }
      async _renderHTML(f, h) {
        try {
          return await super._renderHTML(f, h);
        } catch (E) {
          return console.warn(`${t} | Contacts template render failed, using inline fallback.`, E), ie(vt(f, i));
        }
      }
      _onRender(f, h) {
        var E;
        (E = super._onRender) == null || E.call(this, f, h), W(this);
      }
      async close(f) {
        return Ee(this), super.close(f);
      }
    }, R(g, "DEFAULT_OPTIONS", {
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
    }), R(g, "PARTS", {
      main: {
        template: r
      }
    }), g);
  }
  function tt() {
    var g;
    return !pe || !Q || !j ? null : (g = class extends j(Q) {
      constructor(h = "calls", E = null, L = {}) {
        super(L);
        R(this, "mode");
        R(this, "contact");
        R(this, "callData", null);
        this.mode = h, this.contact = E;
      }
      async _prepareContext(h) {
        return {
          ...await super._prepareContext(h),
          ...Ue(this.mode, this.contact, this.callData)
        };
      }
      async _renderHTML(h, E) {
        try {
          return await fe(), await super._renderHTML(h, E);
        } catch (L) {
          return console.warn(`${t} | Phone template render failed, using inline fallback.`, L), ie(Be(h));
        }
      }
      _onRender(h, E) {
        var L;
        (L = super._onRender) == null || L.call(this, h, E), De(this);
      }
      async close(h) {
        return ke(this), super.close(h);
      }
    }, R(g, "DEFAULT_OPTIONS", {
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
    }), R(g, "PARTS", {
      main: {
        template: o
      }
    }), g);
  }
  function we() {
    var g;
    return !pe || !Q || !j ? null : (g = class extends j(Q) {
      constructor(h = null, E = {}) {
        super(E);
        R(this, "contact");
        this.contact = h;
      }
      async _prepareContext(h) {
        return {
          ...await super._prepareContext(h),
          ...v(this.contact)
        };
      }
      async _renderHTML(h, E) {
        try {
          return await super._renderHTML(h, E);
        } catch (L) {
          return console.warn(`${t} | Messages template render failed, using inline fallback.`, L), ie(St(h, i));
        }
      }
      _onRender(h, E) {
        var L;
        (L = super._onRender) == null || L.call(this, h, E), D(this);
      }
      async close(h) {
        return V(this), super.close(h);
      }
    }, R(g, "DEFAULT_OPTIONS", {
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
    }), R(g, "PARTS", {
      main: {
        template: s
      }
    }), g);
  }
  return {
    CyberCallApplication: Ze() ?? He,
    CyberCallComposer: Xe() ?? Ke,
    CyberCallContacts: et() ?? Ye,
    CyberCallMessages: we() ?? Qe,
    CyberCallPhone: tt() ?? Je
  };
}
const d = "cybercall", se = `module.${d}`, la = `modules/${d}/templates/cybercall.hbs`, ua = `modules/${d}/templates/cybercall-composer.hbs`, da = `modules/${d}/templates/cybercall-contacts.hbs`, ga = `modules/${d}/templates/cybercall-messages.hbs`, ma = `modules/${d}/templates/cybercall-phone.hbs`, pa = `modules/${d}/templates/ringtone-settings.hbs`, le = "phoneMessage", on = 3, $t = {
  "": "Silent",
  [`modules/${d}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${d}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${d}/audio/Ringtone3.ogg`]: "Ringtone 3"
}, cn = `modules/${d}/audio/Ringtone1.ogg`;
function st(e) {
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
function fa(e, t) {
  var n;
  for (const a of ["cybercall", "holosuite-core"])
    try {
      const r = ((n = e == null ? void 0 : e.getBranding) == null ? void 0 : n.call(e, a)) ?? {}, s = st(r.logo) || st(r.iconImage);
      if (s) return { image: s, icon: "" };
      if (typeof r.icon == "string" && /^fa-[a-z0-9-]+$/.test(r.icon)) return { image: "", icon: r.icon };
    } catch {
    }
  return { image: st(t), icon: "" };
}
function ot(e) {
  var a, r, s;
  let t = "";
  try {
    t = game.settings.get("cybercall", "deviceEmblem") ?? "";
  } catch {
  }
  const n = fa((s = (r = (a = game.modules) == null ? void 0 : a.get) == null ? void 0 : r.call(a, "holosuite-core")) == null ? void 0 : s.api, t);
  e.querySelectorAll(".cybercall-hardware-emblem").forEach((o) => {
    const i = n.image || n.icon;
    if ((o.dataset.cybercallEmblem ?? "") !== i) {
      if (o.dataset.cybercallEmblem = i, o.replaceChildren(), o.classList.toggle("cybercall-custom-emblem", !!i), n.image) {
        const c = document.createElement("img");
        c.alt = "", c.src = n.image, c.addEventListener("error", () => {
          c.parentElement === o && (o.replaceChildren(), o.classList.remove("cybercall-custom-emblem"));
        }, { once: !0 }), o.append(c);
      } else if (n.icon) {
        const c = document.createElement("i");
        c.className = `fa-solid ${n.icon}`, o.append(c);
      }
    }
  });
}
function ct() {
  return String(game.settings.get(d, "phoneNumberFormat") ?? "").trim();
}
function gt(e) {
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
function ba(e) {
  if (!e) return !0;
  const t = gt(e), n = (t == null ? void 0 : t.filter((a) => a.pattern).length) ?? 0;
  return t !== null && n > 0 && n <= 32;
}
function Yt(e, t) {
  if (!t) return e;
  const n = gt(t);
  if (!n) return e;
  let a = "", r = "", s = 0, o = 0;
  for (let i = 0; i < n.length; i++) {
    const c = n[i];
    if (c.literal !== void 0) {
      r += c.literal;
      const u = n.slice(i + 1).some((l) => l.pattern);
      e.startsWith(c.literal, s) && (!u || e.length - s > c.literal.length) && (s += c.literal.length);
      continue;
    }
    for (; s < e.length && !c.pattern.test(e[s]); ) s++;
    if (s >= e.length) break;
    a += r + e[s++], r = "", o++;
  }
  return o && o === n.filter((i) => i.pattern).length && (a += r), o ? a : "";
}
function ya(e, t) {
  if (!t) return !0;
  const n = gt(t);
  if (!n) return !1;
  const a = n.map((r) => {
    var s;
    return ((s = r.pattern) == null ? void 0 : s.source) ?? r.literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("");
  return new RegExp(`^${a}$`).test(e);
}
function ln(e) {
  e.querySelectorAll('[data-cybercall-contacts-form] input[name="number"]').forEach((t) => {
    const n = ct(), a = gt(n), r = a == null ? void 0 : a.some((s) => {
      var o;
      return (o = s.pattern) == null ? void 0 : o.test("A");
    });
    t.type = r ? "text" : "tel", t.inputMode = r ? "text" : n ? "numeric" : "tel", t.placeholder = n || "Phone number", t.title = n ? `Format: ${n} (# = digit, A = letter, * = letter or digit)` : "Phone number", n ? t.maxLength = (a == null ? void 0 : a.reduce((s, o) => {
      var i;
      return s + (((i = o.literal) == null ? void 0 : i.length) ?? 1);
    }, 0)) ?? n.length : t.removeAttribute("maxlength"), t.setCustomValidity(""), !t.dataset.cybercallNumberBound && (t.dataset.cybercallNumberBound = "true", t.addEventListener("input", () => {
      const s = ct();
      if (s) {
        const o = t.selectionStart ?? t.value.length, i = Yt(t.value.slice(0, o), s);
        t.value = Yt(t.value, s);
        const c = Math.min(i.length, t.value.length);
        t.setSelectionRange(c, c);
      }
      t.setCustomValidity("");
    }));
  });
}
const ha = ia();
function un(e) {
  var n;
  const t = ((n = e.split("/").pop()) == null ? void 0 : n.replace(/\.[^.]+$/, "")) ?? "Custom ringtone";
  try {
    return decodeURIComponent(t);
  } catch {
    return t;
  }
}
function ue(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  return e.flatMap((n) => {
    const a = String((n == null ? void 0 : n.path) ?? "").trim();
    return !a || t.has(a) ? [] : (t.add(a), [{ label: String((n == null ? void 0 : n.label) ?? "").trim() || un(a), path: a }]);
  });
}
function mt() {
  var n, a, r, s, o, i, c, u, l;
  const e = globalThis.foundry;
  return [
    typeof FilePicker < "u" ? FilePicker : null,
    globalThis.FilePicker,
    (r = (a = (n = e == null ? void 0 : e.applications) == null ? void 0 : n.apps) == null ? void 0 : a.FilePicker) == null ? void 0 : r.implementation,
    (o = (s = e == null ? void 0 : e.applications) == null ? void 0 : s.apps) == null ? void 0 : o.FilePicker,
    (c = (i = e == null ? void 0 : e.applications) == null ? void 0 : i.api) == null ? void 0 : c.FilePicker,
    (l = (u = e == null ? void 0 : e.appv1) == null ? void 0 : u.api) == null ? void 0 : l.FilePicker
  ].find((p) => typeof p == "function") ?? null;
}
function Ca(e, t) {
  var a;
  const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? ((a = e.element) == null ? void 0 : a[0]) ?? e.element ?? null;
  return n instanceof HTMLElement ? n : null;
}
function wa(e) {
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
class dn extends ha {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-ringtone-settings",
      title: "CyberCall Ringtones",
      template: pa,
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
      ringtones: ue(game.settings.get(d, "customRingtones"))
    };
  }
  activateListeners(t) {
    var r;
    super.activateListeners(t);
    const n = Ca(this, t), a = n == null ? void 0 : n.querySelector("[data-ringtone-list]");
    !n || !a || ((r = n.querySelector("[data-ringtone-add]")) == null || r.addEventListener("click", () => {
      var o;
      const s = wa(a.querySelectorAll("[data-ringtone-row]").length);
      (o = a.querySelector("[data-ringtone-empty]")) == null || o.before(s);
    }), n.addEventListener("click", (s) => {
      var v, M, m, b, S, N;
      const o = s.target, i = (v = o == null ? void 0 : o.closest) == null ? void 0 : v.call(o, "[data-ringtone-remove]");
      if (i) {
        (M = i.closest("[data-ringtone-row]")) == null || M.remove();
        return;
      }
      const c = (m = o == null ? void 0 : o.closest) == null ? void 0 : m.call(o, "[data-ringtone-browse]");
      if (!c) return;
      const u = c.closest("[data-ringtone-row]"), l = u == null ? void 0 : u.querySelector("[data-ringtone-path]"), p = mt();
      if (!l || !p) {
        (S = (b = ui.notifications) == null ? void 0 : b.warn) == null || S.call(b, "Foundry FilePicker is unavailable.");
        return;
      }
      const y = new p({
        type: "audio",
        current: l.value,
        callback: (A) => {
          l.value = A;
          const k = u == null ? void 0 : u.querySelector("[data-ringtone-label]");
          k && !k.value.trim() && (k.value = un(A));
        }
      });
      typeof y.browse == "function" ? y.browse() : (N = y.render) == null || N.call(y, !0);
    }));
  }
  async _updateObject(t) {
    var r, s;
    const a = [...t.currentTarget.querySelectorAll("[data-ringtone-row]")].map((o) => {
      var i, c;
      return {
        label: ((i = o.querySelector("[data-ringtone-label]")) == null ? void 0 : i.value) ?? "",
        path: ((c = o.querySelector("[data-ringtone-path]")) == null ? void 0 : c.value) ?? ""
      };
    });
    await game.settings.set(d, "customRingtones", ue(a)), (s = (r = ui.notifications) == null ? void 0 : r.info) == null || s.call(r, "CyberCall ringtones saved.");
  }
}
function va(e, t) {
  var s, o;
  const n = t.querySelector('[name="phoneNumberFormat"]'), a = t.querySelector('[name="deviceEmblem"]'), r = e.querySelector("[data-cybercall-configuration-status]");
  (s = e.querySelector("[data-cybercall-emblem-browse]")) == null || s.addEventListener("click", () => {
    var u, l;
    if (!((u = game.user) != null && u.isGM)) return;
    const i = mt();
    if (!a || !i) return;
    const c = new i({
      type: "image",
      current: a.value,
      callback: (p) => {
        a.value = p, a.dispatchEvent(new Event("input", { bubbles: !0 }));
      }
    });
    typeof c.browse == "function" ? c.browse() : (l = c.render) == null || l.call(c, !0);
  }), (o = e.querySelector("[data-cybercall-save-configuration]")) == null || o.addEventListener("click", async () => {
    var u;
    if (!((u = game.user) != null && u.isGM) || !n || !a) return;
    const i = n.value.trim();
    if (!ba(i)) {
      n.setCustomValidity("Use # for digits, A for letters, or * for letters or digits (maximum 32 placeholders). Other printable characters are fixed text. Escape a literal placeholder with a backslash."), n.reportValidity();
      return;
    }
    const c = a.value.trim();
    if (c && !st(c)) {
      a.setCustomValidity("Choose a PNG, WebP, SVG, JPEG, GIF, or AVIF image."), a.reportValidity();
      return;
    }
    await game.settings.set(d, "phoneNumberFormat", i), await game.settings.set(d, "deviceEmblem", c), r && (r.textContent = "Configuration saved.");
  });
  for (const i of [n, a])
    i == null || i.addEventListener("input", () => {
      i.setCustomValidity(""), r && (r.textContent = "");
    });
}
function pt(e) {
  if (!e) return;
  if (Sa(e), e.querySelector(":scope > .cybercall-hardware")) {
    ot(e);
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
    <span class="cybercall-hardware-light cybercall-hardware-light-br"></span>`, e.append(t), ot(e);
}
function Sa(e) {
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
      const c = document.createElement("button");
      c.type = "button", c.dataset.cybercallWindowAction = a, a === "toggle" && (c.classList.add("header-control"), c.dataset.action = "toggleControls"), c.setAttribute("aria-label", s), c.title = s, c.innerHTML = `<i class="fa-solid ${o}" aria-hidden="true"></i>`, c.addEventListener("click", (u) => {
        if (u.preventDefault(), a === "toggle") {
          const l = e.querySelector(":scope > .controls-dropdown");
          if (l) {
            const p = e.getBoundingClientRect(), y = c.getBoundingClientRect();
            l.style.top = `${(y.bottom - p.top) / (p.height / e.offsetHeight) + 4}px`, l.style.right = `${(p.right - y.right) / (p.width / e.offsetWidth)}px`;
          }
          return;
        }
        u.stopPropagation(), i.click();
      }), n.append(c);
    }
}
function At(e) {
  var c, u;
  const t = new FormData(e), n = (c = game.actors) == null ? void 0 : c.get(t.get("actorId")), a = String(t.get("image") ?? "").trim() || (n == null ? void 0 : n.img) || "", r = String(t.get("callerName") ?? "").trim() || (n == null ? void 0 : n.name) || "UNKNOWN CALLER", s = t.getAll("targetUserIds").map((l) => String(l)).filter(Boolean), o = new Map((((u = game.users) == null ? void 0 : u.contents) ?? []).map((l) => [l.id, l])), i = s.map((l) => Z(o.get(l)) || l);
  return re({
    callerName: r,
    subtitle: String(t.get("subtitle") ?? "").trim(),
    image: a,
    message: String(t.get("message") ?? "").trim(),
    signal: t.get("signal"),
    variant: String(t.get("variant") ?? K.variant),
    fullscreen: t.get("fullscreen") === "on",
    ringing: t.get("ringing") === "on",
    targetUserIds: s,
    targetUserNames: i
  });
}
function at(e) {
  const t = At(e), n = e.querySelector("[data-cybercall-signal-output]");
  n && (n.textContent = `${t.signal}%`);
  const a = e.querySelector("[data-cybercall-live-preview]"), r = a == null ? void 0 : a.querySelector(".cybercall-panel");
  if (!r) return;
  a.classList.toggle("cybercall-preview-wide", t.fullscreen), pt(a);
  for (const u of ["standard", "emergency", "corrupted"])
    r.classList.toggle(`cybercall-${u}`, t.variant === u);
  r.classList.toggle("cybercall-broadcast", t.fullscreen), r.classList.toggle("cybercall-ringing-panel", t.ringing), r.style.setProperty("--cybercall-signal", `${t.signal}%`), r.dataset.cybercallSignalQuality = t.signalQuality, r.style.setProperty("--cybercall-glitch-shift", `${t.glitchShift}px`), r.style.setProperty("--cybercall-glitch-interval", `${t.glitchInterval}s`), r.querySelector("[data-cybercall-preview-name]").textContent = t.callerName;
  const s = r.querySelector("[data-cybercall-preview-subtitle]");
  s && (s.textContent = t.subtitle), r.querySelector("[data-cybercall-preview-message]").textContent = t.message, r.querySelector("[data-cybercall-preview-signal]").textContent = `${t.signal}%`;
  const o = r.querySelector("[data-cybercall-preview-status]");
  o.querySelector("span").textContent = t.kicker, o.querySelector("i").className = `fa-solid ${t.isEmergency ? "fa-triangle-exclamation" : "fa-satellite-dish"}`;
  const i = r.querySelector("[data-cybercall-preview-portrait]"), c = i.querySelector("img");
  if (t.image) {
    const u = c ?? document.createElement("img");
    u.getAttribute("src") !== t.image && u.setAttribute("src", t.image), u.alt = t.callerName, c || i.replaceChildren(u);
  } else {
    const u = i.querySelector(".cybercall-initials") ?? document.createElement("span");
    u.className = "cybercall-initials", u.textContent = t.initials, u.parentNode !== i && i.replaceChildren(u);
  }
}
function Tt() {
  var n, a;
  const e = ((n = game.user) == null ? void 0 : n.getFlag(d, "messageSound")) ?? {}, t = (a = game.user) != null && a.isGM || game.settings.get(d, "shareMessageSounds") !== !1 ? ue(game.settings.get(d, "customMessageSounds")) : [];
  return ue([
    ...e.path ? [{ label: e.label || "My uploaded sound", path: e.path }] : [],
    ...t
  ]);
}
function gn() {
  var t, n;
  const e = (n = (t = game.user) == null ? void 0 : t.getFlag(d, "messageSound")) == null ? void 0 : n.selected;
  return Tt().some((a) => a.path === e) ? e : "";
}
function Ia() {
  const e = gn();
  return [
    { value: "", label: "Built-in notification tone", selected: !e },
    ...Tt().map(({ path: t, label: n }) => ({ value: t, label: n, selected: t === e }))
  ];
}
async function Aa(e) {
  if (e && !Tt().some((n) => n.path === e)) return;
  const t = game.user.getFlag(d, "messageSound") ?? {};
  await game.user.setFlag(d, "messageSound", { ...t, selected: e });
}
class Na extends dn {
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
      ringtones: ue(game.settings.get(d, "customMessageSounds"))
    };
  }
  async _updateObject(t) {
    var r, s, o, i;
    if (!((r = game.user) != null && r.isGM)) return;
    const n = t.currentTarget, a = [...n.querySelectorAll("[data-ringtone-row]")].map((c) => {
      var u, l;
      return {
        label: ((u = c.querySelector("[data-ringtone-label]")) == null ? void 0 : u.value) ?? "",
        path: ((l = c.querySelector("[data-ringtone-path]")) == null ? void 0 : l.value) ?? ""
      };
    });
    await game.settings.set(d, "customMessageSounds", ue(a)), await game.settings.set(d, "shareMessageSounds", ((s = n.querySelector("[data-share-message-sounds]")) == null ? void 0 : s.checked) === !0), (i = (o = ui.notifications) == null ? void 0 : o.info) == null || i.call(o, "CyberCall notification sound library saved.");
  }
}
function ve(e) {
  var n;
  if ((n = foundry == null ? void 0 : foundry.utils) != null && n.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
const Ma = 100, $a = /* @__PURE__ */ new Set(["outgoing", "connected", "ended", "missed"]);
function mn(e) {
  var n, a;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[d]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, d, "message"));
  return (t == null ? void 0 : t.kind) === le ? t : t == null ? void 0 : t.message;
}
function Et(e) {
  const t = mn(e);
  return (t == null ? void 0 : t.kind) === le && t.messageType === "event" && $a.has(t.eventType);
}
function Ta(e) {
  return e.filter(Et).map((t) => {
    var n;
    return {
      id: t.id,
      time: Date.parse((n = mn(t)) == null ? void 0 : n.createdAt) || Number(t.timestamp) || 0
    };
  }).sort((t, n) => n.time - t.time || String(n.id).localeCompare(String(t.id))).slice(Ma).map((t) => t.id);
}
function Jt() {
  var t, n;
  if (!((t = game.user) != null && t.isGM)) return !1;
  const e = (((n = game.users) == null ? void 0 : n.contents) ?? []).filter((a) => a.isGM && a.active).sort((a, r) => a.id.localeCompare(r.id))[0];
  return !e || e.id === game.user.id;
}
let xe = null, It = !1;
function pn() {
  return Jt() ? (It = !0, xe || (xe = Promise.resolve().then(async () => {
    var t, n;
    const e = ((t = game.messages) == null ? void 0 : t.documentClass) ?? globalThis.ChatMessage;
    if (e != null && e.deleteDocuments)
      for (; It; ) {
        It = !1, await new Promise((r) => setTimeout(r, 1e3));
        const a = Ta(((n = game.messages) == null ? void 0 : n.contents) ?? []);
        for (let r = 0; r < a.length; r += 100) {
          if (!Jt()) return;
          await e.deleteDocuments(a.slice(r, r + 100));
        }
      }
  }).catch((e) => {
    console.warn(`${d} | Could not trim call history. It will be retried on the next call event.`, e);
  }).finally(() => {
    xe = null;
  }), xe)) : Promise.resolve();
}
function B(e, t = "") {
  return String(e ?? t).trim();
}
function ye(e) {
  return [...new Set(e.map((t) => B(t)).filter(Boolean))];
}
function Ea() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function fn(e) {
  const t = B(e, "cybercall");
  let n = 0;
  for (let a = 0; a < t.length; a += 1)
    n = (n << 5) - n + t.charCodeAt(a) | 0;
  return `tone-${Math.abs(n) % 8 + 1}`;
}
function Qt(e, t) {
  return ["direct", ...[e, t].sort()].join(":");
}
function ka() {
  return `msg-${Ne()}`;
}
function Pa(e = Ne()) {
  return `group:${B(e)}`;
}
function ze(e, t = ((a) => (a = game == null ? void 0 : game.user) == null ? void 0 : a.id)(), n = {}) {
  const r = O(e), s = B(n.senderNumber) || B(n.senderActorId), o = s ? `contact:${s}` : `user:${B(t, "unknown")}`;
  if (e != null && e.userId)
    return Qt(o, `user:${B(e.userId)}`);
  const i = r.number || r.actorId || r.id || r.name;
  return Qt(o, `contact:${i}`);
}
function kt(e = {}) {
  var t;
  return {
    id: B(e.id) || ka(),
    threadId: B(e.threadId) || ze({ number: ((t = e.recipientNumbers) == null ? void 0 : t[0]) ?? e.senderNumber }),
    senderUserId: B(e.senderUserId),
    senderActorId: B(e.senderActorId),
    senderName: B(e.senderName, "Unknown Sender"),
    senderNumber: B(e.senderNumber),
    senderImage: B(e.senderImage),
    recipientUserIds: ye(e.recipientUserIds ?? []),
    recipientActorIds: ye(e.recipientActorIds ?? []),
    recipientNumbers: ye(e.recipientNumbers ?? []),
    contactName: B(e.contactName),
    contactImage: B(e.contactImage),
    contactUserId: B(e.contactUserId),
    contactManagedByGM: e.contactManagedByGM === !0,
    contactIsNpc: e.contactIsNpc === !0,
    body: B(e.body),
    messageType: B(e.messageType, "text") || "text",
    eventType: B(e.eventType),
    conversationType: B(e.conversationType, e.groupId ? "group" : "direct") || "direct",
    groupId: B(e.groupId),
    groupName: B(e.groupName),
    groupMemberUserIds: ye(e.groupMemberUserIds ?? []),
    groupMemberNames: ye(e.groupMemberNames ?? []),
    createdAt: B(e.createdAt) || Ea(),
    chatMessageId: B(e.chatMessageId),
    schemaVersion: Number(e.schemaVersion ?? on)
  };
}
function bn(e, t = [], n = "", a = {}) {
  const r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (const i of t) {
    const c = O(i), u = { ...c, userId: i == null ? void 0 : i.userId, userIds: (i == null ? void 0 : i.userIds) ?? c.userIds };
    c.number && r.set(c.number, u), i != null && i.userId && s.set(String(i.userId), u);
  }
  const o = /* @__PURE__ */ new Map();
  for (const i of e.map(kt).filter((c) => c.body)) {
    const c = o.get(i.threadId) ?? [];
    c.push(i), o.set(i.threadId, c);
  }
  return [...o.entries()].map(([i, c]) => {
    var Ue, Ce, fe, Be, ie, De, He, Ke, Ye, Je, Qe, Ze, Xe, et, tt, we, Le, Re, be, Oe;
    const u = c.sort((g, C) => g.createdAt.localeCompare(C.createdAt)), l = u[u.length - 1] ?? null, p = [...u].reverse().find((g) => g.conversationType === "group" || g.groupId), y = !!p, v = (p == null ? void 0 : p.groupId) || (y ? i.replace(/^group:/, "") : ""), M = (p == null ? void 0 : p.groupName) || (y ? "Group Chat" : ""), m = y ? ye(u.flatMap((g) => [
      ...g.groupMemberUserIds,
      g.senderUserId,
      ...g.recipientUserIds
    ])) : [], b = y ? ye(u.flatMap((g) => g.groupMemberNames)) : [], S = b.length ? b : m.map((g) => {
      var C, f;
      return Z((f = (C = game.users) == null ? void 0 : C.get) == null ? void 0 : f.call(C, g));
    }).filter(Boolean), N = (l == null ? void 0 : l.senderUserId) === ((Ue = game == null ? void 0 : game.user) == null ? void 0 : Ue.id) ? (Ce = l == null ? void 0 : l.recipientUserIds) == null ? void 0 : Ce.find((g) => {
      var C;
      return g !== ((C = game == null ? void 0 : game.user) == null ? void 0 : C.id);
    }) : l == null ? void 0 : l.senderUserId, A = (l == null ? void 0 : l.senderUserId) === ((fe = game == null ? void 0 : game.user) == null ? void 0 : fe.id) ? ((Be = l == null ? void 0 : l.recipientNumbers) == null ? void 0 : Be[0]) || "" : (l == null ? void 0 : l.senderNumber) || ((ie = l == null ? void 0 : l.recipientNumbers) == null ? void 0 : ie[0]) || "", k = l != null && l.contactName && !(l != null && l.contactUserId) && (l.contactIsNpc || l.contactManagedByGM) ? {
      id: `contact-${((De = l.recipientNumbers) == null ? void 0 : De[0]) || l.senderNumber || i}`,
      name: l.contactName,
      number: ((He = l.recipientNumbers) == null ? void 0 : He[0]) || l.senderNumber || "",
      image: l.contactImage || "",
      actorId: ((Ke = l.recipientActorIds) == null ? void 0 : Ke[0]) ?? l.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: ne(l.contactName)
    } : null, P = (l == null ? void 0 : l.senderUserId) !== ((Ye = game == null ? void 0 : game.user) == null ? void 0 : Ye.id) && (l != null && l.senderNumber) && (l != null && l.contactName) ? {
      id: `contact-${l.senderNumber || i}`,
      name: l.contactName,
      number: l.senderNumber,
      image: l.contactImage || "",
      actorId: l.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: ne(l.contactName)
    } : null, T = [...u].reverse().find(
      (g) => {
        var C, f, h;
        return ((h = (f = (C = game.users) == null ? void 0 : C.get) == null ? void 0 : f.call(C, g.senderUserId)) == null ? void 0 : h.isGM) === !0 && g.contactIsNpc && g.senderNumber && g.senderName === g.contactName && g.contactUserId;
      }
    ), J = T ? O({
      id: `contact-${T.senderNumber}`,
      name: T.senderName,
      number: T.senderNumber,
      image: T.senderImage,
      actorId: T.senderActorId,
      managedByGM: !0,
      isNpc: !0
    }) : null, G = (y ? {
      id: `group-${v || i}`,
      name: M,
      number: `${m.length} member${m.length === 1 ? "" : "s"}`,
      image: "",
      actorId: "",
      userId: "",
      userIds: m.filter((g) => {
        var C;
        return g !== ((C = game == null ? void 0 : game.user) == null ? void 0 : C.id);
      }),
      managedByGM: !1,
      isNpc: !1,
      isGroup: !0,
      initials: ne(M)
    } : null) ?? k ?? J ?? P ?? s.get(N) ?? r.get(A) ?? {
      id: `contact-${A || i}`,
      name: (l == null ? void 0 : l.contactName) || ((l == null ? void 0 : l.senderUserId) === ((Je = game == null ? void 0 : game.user) == null ? void 0 : Je.id) ? A || "Unknown Contact" : (l == null ? void 0 : l.senderName) || A || "Unknown Contact"),
      number: A,
      image: (l == null ? void 0 : l.contactImage) || "",
      actorId: ((Qe = l == null ? void 0 : l.recipientActorIds) == null ? void 0 : Qe[0]) ?? "",
      userId: "",
      userIds: [],
      managedByGM: !!(l != null && l.contactName || (Ze = l == null ? void 0 : l.recipientActorIds) != null && Ze[0]),
      isNpc: !!(l != null && l.contactName || (Xe = l == null ? void 0 : l.recipientActorIds) != null && Xe[0]),
      initials: ne((l == null ? void 0 : l.contactName) || (l == null ? void 0 : l.senderName) || A)
    }, W = y ? null : [...u].reverse().find(
      (g) => g.senderUserId === N && g.senderImage
    ), D = [...u].reverse().find((g) => {
      var f, h;
      const C = (h = (f = game.users) == null ? void 0 : f.get) == null ? void 0 : h.call(f, g.senderUserId);
      return g.senderUserId && (C == null ? void 0 : C.isGM) !== !0 && !g.contactUserId && !!g.contactName && (g.contactIsNpc || g.contactManagedByGM);
    }) ?? null, U = ((et = game == null ? void 0 : game.user) == null ? void 0 : et.isGM) === !0 ? D : null, H = ((tt = game == null ? void 0 : game.user) == null ? void 0 : tt.isGM) === !0 ? T == null ? void 0 : T.contactUserId : "", q = s.get(H), Ee = U || H ? `Replying as: ${G.name}` : "", V = U ? s.get(U.senderUserId) : null, ke = (U == null ? void 0 : U.senderName) || (V == null ? void 0 : V.name) || (q == null ? void 0 : q.name) || (H ? Z((Le = (we = game.users) == null ? void 0 : we.get) == null ? void 0 : Le.call(we, H)) : "") || G.name || (l == null ? void 0 : l.senderName) || "Unknown Contact", Q = U ? (V == null ? void 0 : V.number) || `@${U.senderName}` : G.number || (l == null ? void 0 : l.senderNumber) || "", j = !y && ((Re = game == null ? void 0 : game.user) != null && Re.isGM) ? (U == null ? void 0 : U.senderUserId) || H : "", me = j ? ne(ke) : G.initials || ne(G.name || (l == null ? void 0 : l.senderName)), pe = j ? (U == null ? void 0 : U.senderImage) || (V == null ? void 0 : V.image) || (q == null ? void 0 : q.image) || Me((Oe = (be = game.users) == null ? void 0 : be.get) == null ? void 0 : Oe.call(be, j)) || "" : (U == null ? void 0 : U.senderImage) || (V == null ? void 0 : V.image) || (W == null ? void 0 : W.senderImage) || G.image || "", Pe = a[i] ?? "", Ge = u.filter(
      (g) => {
        var C;
        return g.senderUserId !== ((C = game == null ? void 0 : game.user) == null ? void 0 : C.id) && g.createdAt > Pe;
      }
    );
    return {
      id: i,
      title: ke,
      subtitle: /^NPC:/i.test(Q) ? "Direct message" : Q,
      initials: me,
      image: pe,
      avatarTone: fn(y ? v || i : j || G.userId || G.number || i),
      routeLabel: Ee,
      hasRouteLabel: !!Ee,
      isNpcRouted: !!(D || T),
      contact: G,
      messages: u.map((g) => {
        var C;
        return {
          ...g,
          isMine: g.senderUserId === ((C = game == null ? void 0 : game.user) == null ? void 0 : C.id),
          isEvent: g.messageType !== "text"
        };
      }),
      lastMessage: l,
      lastPreview: (l == null ? void 0 : l.body) ?? "",
      updatedAt: (l == null ? void 0 : l.createdAt) ?? "",
      unread: Ge.length > 0,
      unreadCount: Ge.length,
      active: i === n,
      isGroup: y,
      groupId: v,
      groupName: M,
      groupMemberUserIds: m,
      groupMemberNames: S
    };
  }).sort((i, c) => c.updatedAt.localeCompare(i.updatedAt));
}
const Ve = "playerContactDirectory", $e = "playerPersonalContactDirectory";
function Ga(e) {
  var n, a, r, s;
  const t = ((n = e.getFlag(d, Ve)) == null ? void 0 : n.playerId) ?? ((a = e.getFlag(d, $e)) == null ? void 0 : a.playerId);
  return !!(t && ((r = game.user) != null && r.isGM || ((s = game.user) == null ? void 0 : s.id) === t));
}
function ft(e) {
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
  const t = (n = ft(e)) == null ? void 0 : n.getFlag(d, $e);
  return t != null && t.initialized ? Object.values(t.contacts ?? {}).map(O).filter((a) => a.name && a.number).sort((a, r) => a.name.localeCompare(r.name)) : null;
}
function yn(e) {
  const t = new Map((Te(e) ?? []).map((n) => [n.id, n]));
  for (const n of bt(e)) t.set(n.id, n);
  return [...t.values()].sort((n, a) => n.name.localeCompare(a.name));
}
let _e = null;
async function Pt() {
  var n, a;
  if (!((n = game.user) != null && n.isGM)) return;
  const e = (((a = game.users) == null ? void 0 : a.contents) ?? []).filter((r) => r.isGM && r.active).sort((r, s) => r.id.localeCompare(s.id))[0];
  if (e && e.id !== game.user.id) return;
  if (_e) return _e;
  const t = CONST.DOCUMENT_OWNERSHIP_LEVELS;
  _e = (async () => {
    var r;
    for (const s of ((r = game.users) == null ? void 0 : r.contents) ?? [])
      s.isGM || ft(s.id) || await game.journal.documentClass.create({
        name: `CyberCall Personal Contacts · ${s.name}`,
        ownership: { default: t.NONE, [s.id]: t.OWNER },
        flags: { [d]: { [$e]: { playerId: s.id, initialized: !1, contacts: {} } } }
      }, { render: !1 });
  })();
  try {
    await _e;
  } finally {
    _e = null;
  }
}
async function hn(e, t, n = null) {
  const a = ft(e);
  if (!a || !t) return !1;
  const r = `flags.${d}.${$e}`;
  return await a.update({
    [`${r}.initialized`]: !0,
    [`${r}.contacts.${n ? t : `-=${t}`}`]: n
  }, { render: !1 }), !0;
}
async function Cn(e, t) {
  const n = ft(e);
  if (!n) return !1;
  const a = Te(e) ?? [], r = `flags.${d}.${$e}`, s = { [`${r}.initialized`]: !0 }, o = new Set(t.map((i) => i.id));
  for (const i of t) s[`${r}.contacts.${i.id}`] = O(i);
  for (const i of a) o.has(i.id) || (s[`${r}.contacts.-=${i.id}`] = null);
  return await n.update(s, { render: !1 }), !0;
}
function wn(e) {
  var t, n, a, r;
  return !e || !((t = game.user) != null && t.isGM) && ((n = game.user) == null ? void 0 : n.id) !== e ? null : ((r = (a = game.journal) == null ? void 0 : a.contents) == null ? void 0 : r.find(
    (s) => {
      var o;
      return ((o = s.getFlag(d, Ve)) == null ? void 0 : o.playerId) === e && s.testUserPermission(game.user, "OBSERVER");
    }
  )) ?? null;
}
function bt(e) {
  var n, a;
  const t = ((a = (n = wn(e)) == null ? void 0 : n.getFlag(d, Ve)) == null ? void 0 : a.contacts) ?? {};
  return Object.values(t).map(O).filter((r) => r.name && r.number).sort((r, s) => r.name.localeCompare(s.name));
}
async function vn(e, t, n = null) {
  var i, c;
  if (!((i = game.user) != null && i.isGM)) return;
  const a = (c = game.users) == null ? void 0 : c.get(e);
  if (!a || a.isGM) return;
  const r = wn(e);
  if (!r) {
    if (!n) return;
    const u = game.journal.documentClass, l = CONST.DOCUMENT_OWNERSHIP_LEVELS;
    await u.create({
      name: `CyberCall Contacts · ${a.name}`,
      ownership: { default: l.NONE, [e]: l.OBSERVER },
      flags: { [d]: { [Ve]: { playerId: e, contacts: { [t]: n } } } }
    }, { render: !1 });
    return;
  }
  const s = `flags.${d}.${Ve}.contacts`, o = n ? t : `-=${t}`;
  await r.update({ [`${s}.${o}`]: n }, { render: !1 });
}
function Ua(e) {
  var n, a, r;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[d]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, d, "message"));
  return (t == null ? void 0 : t.kind) === le ? t : ((r = t == null ? void 0 : t.message) == null ? void 0 : r.kind) === le ? t.message : null;
}
function Ba(e) {
  return String(e != null && e.timestamp ? new Date(e.timestamp).toISOString() : (e == null ? void 0 : e.createdTime) ?? "");
}
function Da() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => t.id);
}
function Gt(e) {
  return [...new Set(e.map((t) => String(t ?? "").trim()).filter(Boolean))];
}
function La(e) {
  const t = Array.isArray(e == null ? void 0 : e.whisper) ? e.whisper : [];
  return Gt(t.map((n) => (n == null ? void 0 : n.id) ?? n));
}
function Ra(e, t) {
  var s, o;
  const n = String(((s = game.user) == null ? void 0 : s.id) ?? "").trim();
  if (!n) return !1;
  if (e.senderUserId === n || e.recipientUserIds.includes(n)) return !0;
  if (((o = game.user) == null ? void 0 : o.isGM) === !0)
    return !e.contactUserId && (e.contactManagedByGM || e.contactIsNpc) ? !0 : game.settings.get(d, "gmViewPlayerMessages") === !0;
  const r = La(t);
  return r.length && !r.includes(n), !1;
}
function Oa(e) {
  const t = Array.isArray(e == null ? void 0 : e.userIds) ? e.userIds : e != null && e.userId ? [e.userId] : [], n = Gt(t);
  return n.length ? n : Da();
}
function xa(e) {
  return !!(e != null && e.userId || Array.isArray(e == null ? void 0 : e.userIds) && e.userIds.length);
}
function _a(e, t) {
  const n = e.senderName || "CyberCall", a = t != null && t.name ? `<span>${ve(t.name)}</span>` : "";
  return `
    <div class="cybercall-chat-card${e.messageType !== "text" ? " cybercall-chat-card--event" : ""}" data-cybercall-thread-id="${ve(e.threadId)}">
      <strong>${ve(n)}</strong>
      ${a}
      <p>${ve(e.body)}</p>
      <button type="button" data-cybercall-open-thread data-cybercall-thread-id="${ve(e.threadId)}">Open CyberCall</button>
    </div>
  `;
}
function Fa() {
  var t;
  return (((t = game.messages) == null ? void 0 : t.contents) ?? []).map((n) => {
    const a = Ua(n);
    if (!a) return null;
    const r = kt({
      ...a,
      chatMessageId: n.id,
      createdAt: a.createdAt || Ba(n)
    });
    return Ra(r, n) ? r : null;
  }).filter(Boolean);
}
async function Ut(e, t, n = {}) {
  var M;
  const a = O(e), r = String(t ?? "").trim();
  if (!r) return null;
  const s = game.user, o = n.recipientUserIds ? Gt(n.recipientUserIds) : Oa(e), i = !xa(e), c = String(n.threadId ?? ze(e, s == null ? void 0 : s.id, n)), u = String(n.senderName ?? "").trim() || Z(s, "Unknown Sender"), l = String(n.senderActorId ?? ((M = s == null ? void 0 : s.character) == null ? void 0 : M.id) ?? "").trim(), p = String(n.senderNumber ?? "").trim(), y = kt({
    threadId: c,
    senderUserId: (s == null ? void 0 : s.id) ?? "",
    senderActorId: l,
    senderName: u,
    senderNumber: p,
    senderImage: String(n.senderImage ?? Me(s)).trim(),
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
    schemaVersion: on
  }), v = [...new Set([s == null ? void 0 : s.id, ...o].filter(Boolean))];
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: y.senderName }),
    whisper: v,
    content: _a(y, a),
    flags: {
      [d]: {
        kind: le,
        ...y
      }
    }
  });
}
async function qa(e, t, n = {}) {
  return Ut(e, t, {
    ...n,
    messageType: n.messageType ?? "event"
  });
}
let w = null, I = null, X = null, Se = null, te = null, oe = "personal", Sn = "", x = "", ee = !1, Y = !1, ce = null, Nt = 0, Ie = null;
function Va() {
  var e, t, n, a, r, s, o, i;
  return re({
    callerName: ((e = w == null ? void 0 : w.callData) == null ? void 0 : e.callerName) ?? K.callerName,
    subtitle: ((t = w == null ? void 0 : w.callData) == null ? void 0 : t.subtitle) ?? K.subtitle,
    image: ((n = w == null ? void 0 : w.callData) == null ? void 0 : n.image) ?? "",
    message: ((a = w == null ? void 0 : w.callData) == null ? void 0 : a.message) ?? K.message,
    signal: ((r = w == null ? void 0 : w.callData) == null ? void 0 : r.signal) ?? game.settings.get(d, "defaultSignal"),
    variant: ((s = w == null ? void 0 : w.callData) == null ? void 0 : s.variant) ?? "standard",
    fullscreen: ((o = w == null ? void 0 : w.callData) == null ? void 0 : o.fullscreen) ?? !1,
    ringing: ((i = w == null ? void 0 : w.callData) == null ? void 0 : i.ringing) ?? !0
  });
}
function ja() {
  var e;
  return (((e = game.actors) == null ? void 0 : e.contents) ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    img: t.img ?? ""
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function In() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => !t.isGM).map((t) => ({
    id: t.id,
    name: Z(t, "Unknown Player"),
    active: t.active === !0
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function za() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => {
    var n;
    return !t.isGM && t.id !== ((n = game.user) == null ? void 0 : n.id);
  }).map((t) => ({
    id: String(t.id),
    name: Z(t, "Unknown Player"),
    active: t.active === !0
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function Wa() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => {
    var n;
    return t.id !== ((n = game.user) == null ? void 0 : n.id);
  }).map((t) => {
    const n = Z(t, "Unknown Player");
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
function he() {
  var e, t;
  return String(((e = game.world) == null ? void 0 : e.id) ?? ((t = game.world) == null ? void 0 : t.title) ?? "default");
}
function Bt() {
  const e = game.settings.get(d, "contacts");
  return Array.isArray(e) ? { [he()]: e } : !e || typeof e != "object" ? {} : e;
}
function Dt() {
  var t, n;
  if (!((t = game.user) != null && t.isGM)) {
    const a = Te((n = game.user) == null ? void 0 : n.id);
    if (a !== null) return a;
  }
  const e = Bt()[he()];
  return Array.isArray(e) ? e.map(O).filter((a) => a.name && a.number).sort((a, r) => a.name.localeCompare(r.name)) : [];
}
function yt() {
  var t, n;
  const e = (t = game.user) != null && t.isGM ? [] : bt((n = game.user) == null ? void 0 : n.id);
  return [
    ...Dt(),
    ...e.map((a) => ({ ...a, assignedToPlayer: !0 }))
  ].sort((a, r) => a.name.localeCompare(r.name));
}
function An() {
  var n;
  if (!((n = game.user) != null && n.isGM)) return [];
  const e = In(), t = e.find((a) => a.id === Sn) ?? e[0];
  return e.map((a) => ({ ...a, selected: a.id === (t == null ? void 0 : t.id) }));
}
function We() {
  var e;
  return ((e = An().find((t) => t.selected)) == null ? void 0 : e.id) ?? "";
}
function Ha(e) {
  return e === "player" ? yn(We()) : e === "group" ? de() : yt();
}
function de() {
  if (Array.isArray(Ie))
    return Ie.map(O).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name));
  const e = game.settings.get(d, "groupContacts");
  return Array.isArray(e) ? e.map(O).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function Lt() {
  const e = /* @__PURE__ */ new Map();
  for (const t of [...Wa(), ...de(), ...yt()]) {
    const n = t.userId ? `user:${t.userId}` : `number:${t.number || t.id}`;
    e.has(n) || e.set(n, t);
  }
  return [...e.values()].sort((t, n) => t.name.localeCompare(n.name));
}
async function Nn(e) {
  var t;
  (t = game.user) != null && t.isGM || await Cn(game.user.id, e), await game.settings.set(d, "contacts", {
    ...Bt(),
    [he()]: e.map(O)
  });
}
let rt = null;
async function Mn() {
  var t, n;
  if ((t = game.user) != null && t.isGM || rt || Te((n = game.user) == null ? void 0 : n.id) !== null) return;
  const e = Bt()[he()];
  rt = Cn(game.user.id, Array.isArray(e) ? e : []);
  try {
    await rt;
  } finally {
    rt = null;
  }
}
async function lt(e) {
  Ie = e.map(O), await game.settings.set(d, "groupContacts", Ie), game.socket.emit(se, {
    action: "groupContactsChanged",
    contacts: Ie
  });
}
function Rt() {
  const e = game.settings.get(d, "messageReadState");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function $n() {
  const e = game.settings.get(d, "messageDeletedBefore");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function ut() {
  const e = game.settings.get(d, "npcThreadBindings");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
async function it(e, t) {
  var a;
  if (!((a = game.user) != null && a.isGM) || !e) return;
  const n = { ...ut() };
  t === null ? delete n[e] : n[e] = { ...n[e] ?? {}, ...t }, await game.settings.set(d, "npcThreadBindings", n);
}
function Ot() {
  const e = $n();
  return Fa().filter((t) => {
    const n = e[t.threadId];
    return !n || t.createdAt > n;
  });
}
function Tn() {
  return bn(Ot(), Lt(), "", Rt()).reduce((e, t) => e + Number(t.unreadCount ?? 0), 0);
}
async function Ka(e, t = (/* @__PURE__ */ new Date()).toISOString()) {
  e && await game.settings.set(d, "messageReadState", {
    ...Rt(),
    [e]: t
  });
}
async function qe() {
  x && await Ka(x);
}
async function Ya(e) {
  e && (await game.settings.set(d, "messageDeletedBefore", {
    ...$n(),
    [e]: (/* @__PURE__ */ new Date()).toISOString()
  }), x === e && (x = "", ee = !1, Y = !1, te && (te.contact = null), (I == null ? void 0 : I.mode) === "messages" && (I.contact = null)), await _(), await z());
}
async function Ja(e, t, n = "personal", a = "", r = {}) {
  var u, l, p, y, v, M, m, b, S, N;
  if (n === "player" && !((u = game.user) != null && u.isGM)) return !1;
  const s = r.actorId ? (l = game.actors) == null ? void 0 : l.get(r.actorId) : null, o = O({
    id: r.id || void 0,
    name: String(e ?? "").trim() || (s == null ? void 0 : s.name),
    number: t,
    image: Fe() && (String(a ?? "").trim() || (s == null ? void 0 : s.img)) || "",
    actorId: Fe() ? r.actorId : "",
    managedByGM: Fe() ? r.managedByGM === !0 : !1,
    isNpc: Fe() ? r.isNpc === !0 || r.managedByGM === !0 || !!r.actorId : !1
  });
  if (!o.name || !o.number)
    return (y = (p = ui.notifications) == null ? void 0 : p.warn) == null || y.call(p, "Contact name and number are required."), !1;
  if (!ya(o.number, ct()))
    return (M = (v = ui.notifications) == null ? void 0 : v.warn) == null || M.call(v, `Enter a phone number matching ${ct()} (# = digit, A = letter, * = letter or digit).`), !1;
  if (n === "player") {
    const A = We();
    if (!A) return !1;
    const k = Te(A) ?? [];
    return !bt(A).some((T) => T.id === o.id) && k.some((T) => T.id === o.id) ? await hn(A, o.id, o) : await vn(A, o.id, o), !0;
  }
  if (n === "group" && !game.user.isGM)
    return r.id ? !1 : xt() ? (game.socket.emit(se, {
      action: "groupContactAdd",
      contact: o
    }), (N = (S = ui.notifications) == null ? void 0 : S.info) == null || N.call(S, "Group contact update sent to the GM."), !0) : ((b = (m = ui.notifications) == null ? void 0 : m.warn) == null || b.call(m, "A GM must be connected to update group contacts."), !1);
  const i = n === "group" ? de() : Dt(), c = i.findIndex((A) => A.id === o.id);
  return c === -1 ? i.push(o) : i[c] = { ...i[c], ...o }, n === "group" ? await lt(i) : await Nn(i), await z(), !0;
}
async function Qa(e, t = "personal") {
  var n, a, r, s;
  if (t === "player") {
    const o = We(), i = bt(o).some((u) => u.id === e), c = (Te(o) ?? []).some((u) => u.id === e);
    !i && c ? await hn(o, e) : await vn(o, e);
    return;
  } else if (t === "group") {
    if (!game.user.isGM) {
      if (!xt()) {
        (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(se, {
        action: "groupContactRemove",
        contactId: e
      }), (s = (r = ui.notifications) == null ? void 0 : r.info) == null || s.call(r, "Group contact removal sent to the GM.");
      return;
    }
    await lt(de().filter((o) => o.id !== e));
  } else
    await Nn(Dt().filter((o) => o.id !== e));
  await z();
}
function xt() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function ht(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(d, "minimumRole");
  } catch (n) {
    console.warn(`${d} | Permission setting unavailable, using Player role fallback.`, n);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function Fe(e = game.user) {
  return !!(e != null && e.isGM);
}
function ae(e, t = null) {
  var n;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (n = e == null ? void 0 : e.element) != null && n[0] ? e.element[0] : (e == null ? void 0 : e.element) ?? null;
}
const Za = 24;
function En(e) {
  var s, o, i;
  const t = ae(e), n = (s = t == null ? void 0 : t.querySelector) == null ? void 0 : s.call(t, ".cybercall-message-log");
  if (!(n instanceof HTMLElement)) return null;
  const a = (o = t.querySelector) == null ? void 0 : o.call(t, "[data-cybercall-active-thread]"), r = n.scrollHeight - n.clientHeight - n.scrollTop;
  return {
    threadId: String(((i = a == null ? void 0 : a.dataset) == null ? void 0 : i.cybercallActiveThread) ?? ""),
    scrollTop: n.scrollTop,
    stickToBottom: r <= Za
  };
}
function Xa(e, t) {
  var u;
  const n = t.querySelector(".cybercall-message-log");
  if (!(n instanceof HTMLElement)) return;
  const a = e == null ? void 0 : e._cybercallMessageScrollState, r = t.querySelector("[data-cybercall-active-thread]"), s = String(((u = r == null ? void 0 : r.dataset) == null ? void 0 : u.cybercallActiveThread) ?? ""), o = !a || a.scrollToBottom === !0 || a.stickToBottom === !0 || a.threadId !== s;
  delete e._cybercallMessageScrollState;
  const i = {};
  e._cybercallMessageScrollRestoreToken = i;
  const c = () => {
    if (e._cybercallMessageScrollRestoreToken !== i || !n.isConnected) return;
    const l = Math.max(0, n.scrollHeight - n.clientHeight);
    n.scrollTop = o ? l : Math.min(a.scrollTop, l);
  };
  c(), requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      c(), e._cybercallMessageScrollRestoreToken === i && delete e._cybercallMessageScrollRestoreToken;
    });
  });
}
function Mt(e) {
  var a;
  const t = e.querySelector("[data-cybercall-active-thread]"), n = String(((a = t == null ? void 0 : t.dataset) == null ? void 0 : a.cybercallActiveThread) ?? "");
  return n ? `thread:${n}` : e.querySelector("form[data-cybercall-group-form]") ? "new-group" : "new-message";
}
function kn(e) {
  const t = ae(e);
  if (!(t instanceof HTMLElement)) return null;
  const n = t.querySelector("form[data-cybercall-group-form]");
  if (n) {
    const o = n.elements.namedItem("groupName");
    return {
      key: Mt(t),
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
    key: Mt(t),
    body: (r == null ? void 0 : r.value) ?? "",
    contactId: s("contactId"),
    replyAs: s("replyAs"),
    sendAs: s("sendAs"),
    bodyWasFocused: document.activeElement === r,
    selectionStart: (r == null ? void 0 : r.selectionStart) ?? null,
    selectionEnd: (r == null ? void 0 : r.selectionEnd) ?? null
  };
}
function er(e, t) {
  const n = e == null ? void 0 : e._cybercallMessageComposerState;
  if (delete e._cybercallMessageComposerState, !n || n.key !== Mt(t)) return;
  const a = t.querySelector("form[data-cybercall-group-form]");
  if (a) {
    const i = a.elements.namedItem("groupName");
    i && (i.value = n.groupName ?? "");
    const c = new Set(n.memberUserIds ?? []);
    a.querySelectorAll('input[name="memberUserIds"]').forEach((u) => {
      u.checked = c.has(u.value);
    });
    return;
  }
  const r = t.querySelector("form[data-cybercall-message-form]");
  if (!r) return;
  const s = (i, c) => {
    const u = r.elements.namedItem(i);
    u && [...u instanceof HTMLSelectElement ? u.options : []].some((l) => l.value === c) && (u.value = c);
  };
  s("contactId", n.contactId), s("replyAs", n.replyAs), s("sendAs", n.sendAs);
  const o = r.elements.namedItem("body");
  o && (o.value = n.body ?? "", n.bodyWasFocused && requestAnimationFrame(() => {
    o.isConnected && (o.focus({ preventScroll: !0 }), n.selectionStart !== null && n.selectionEnd !== null && o.setSelectionRange(n.selectionStart, n.selectionEnd));
  }));
}
function tr(e, t = null) {
  const n = ae(e, t);
  if (!n) return;
  const a = n.closest(".cybercall-app, .cybercall-phone-app") ?? ae(e);
  a == null || a.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), pt(a), a == null || a.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), a == null || a.classList.toggle("cybercall-connected", e.callData.accepted), n.querySelectorAll("[data-cybercall-action]").forEach((r) => {
    r.addEventListener("click", async (s) => {
      const o = s.currentTarget.dataset.cybercallAction;
      if (o === "accept") {
        await Sr(e.callData.id);
        return;
      }
      if (o === "broadcast") {
        zt({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (o === "decline" || o === "end") && await Rn(e.callData.id);
    });
  });
}
function nr(e) {
  var n, a;
  const t = "form[data-cybercall-composer]";
  return (n = e == null ? void 0 : e.matches) != null && n.call(e, t) ? e : (a = e == null ? void 0 : e.querySelector) == null ? void 0 : a.call(e, t);
}
function ar(e, t = null) {
  var o;
  const n = ae(e, t), a = nr(n);
  if (!n || !a) return;
  pt(n.closest(".cybercall-composer-app"));
  function r(i) {
    e._cybercallConsoleTab = i, n.querySelectorAll("[data-cybercall-console-panel]").forEach((c) => {
      c.hidden = c.dataset.cybercallConsolePanel !== i;
    }), n.querySelectorAll("[data-cybercall-console-tab]").forEach((c) => {
      c.setAttribute("aria-selected", String(c.dataset.cybercallConsoleTab === i));
    });
  }
  n.querySelectorAll("[data-cybercall-console-tab]").forEach((i) => {
    i.addEventListener("click", () => r(i.dataset.cybercallConsoleTab));
  }), r(e._cybercallConsoleTab ?? "transmission"), va(n, a), at(a);
  const s = n.querySelector("[data-cybercall-ringtone]");
  s && s.addEventListener("change", async (i) => {
    await qn(i.currentTarget.value);
  }), a.addEventListener("input", () => at(a)), (o = a.elements.actorId) == null || o.addEventListener("change", () => {
    var c;
    const i = (c = game.actors) == null ? void 0 : c.get(a.elements.actorId.value);
    i && (a.elements.callerName.value = i.name, a.elements.image.value = i.img ?? "");
  }), a.addEventListener("change", () => at(a)), a.addEventListener("submit", (i) => {
    var c;
    if (i.preventDefault(), e._cybercallConsoleTab === "configuration") {
      (c = n.querySelector("[data-cybercall-save-configuration]")) == null || c.click();
      return;
    }
    ge(At(a));
  }), n.querySelectorAll("[data-cybercall-compose-action]").forEach((i) => {
    i.addEventListener("click", async (c) => {
      var p, y, v, M;
      const u = c.currentTarget.dataset.cybercallComposeAction, l = At(a);
      if (u === "preview") {
        await ge(l);
        return;
      }
      if (u === "broadcast") {
        await zt(l);
        return;
      }
      if (u === "close-active") {
        Rn((p = w == null ? void 0 : w.callData) == null ? void 0 : p.id);
        return;
      }
      if (u === "browse-image") {
        const m = a.elements.image, b = mt();
        if (!m || !b) {
          (v = (y = ui.notifications) == null ? void 0 : y.warn) == null || v.call(y, "Foundry FilePicker is unavailable.");
          return;
        }
        const S = new b({
          type: "image",
          current: m.value,
          callback: (N) => {
            m.value = N, m.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof S.browse == "function" ? S.browse() : (M = S.render) == null || M.call(S, !0);
        return;
      }
      if (u === "reset") {
        a.reset(), at(a);
        return;
      }
      u === "open-messages" && await Ae(), u === "open-contacts" && (oe = "group", await Ct());
    });
  });
}
function rr(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function sr(e, t = null) {
  var p, y, v, M, m;
  const n = ae(e, t), a = rr(n);
  if (!n) return;
  const r = n.querySelector("[data-cybercall-ringtone]");
  if (r && r.addEventListener("change", async (b) => {
    await qn(b.currentTarget.value);
  }), (p = n.querySelector("[data-cybercall-message-sound]")) == null || p.addEventListener("change", async (b) => {
    await Aa(b.currentTarget.value);
  }), !a) return;
  ln(n), (y = a.querySelector("[data-cybercall-contact-browse]")) == null || y.addEventListener("click", () => {
    var A, k;
    if (!((A = game.user) != null && A.isGM)) return;
    const b = a.elements.image, S = mt();
    if (!b || !S) return;
    const N = new S({
      type: "image",
      current: b.value,
      callback: (P) => {
        b.value = P, b.dispatchEvent(new Event("change", { bubbles: !0 }));
      }
    });
    typeof N.browse == "function" ? N.browse() : (k = N.render) == null || k.call(N, !0);
  });
  const s = (b) => {
    n.querySelectorAll("[data-cybercall-contact-row]").forEach((S) => {
      S.classList.toggle("selected", S.dataset.cybercallContactRow === b);
    });
  };
  s(e.selectedContactId);
  const o = n.querySelector("[data-cybercall-contact-search]");
  if (o) {
    o.value = e.contactSearch ?? "";
    const b = () => {
      e.contactSearch = o.value;
      const S = o.value.trim().toLocaleLowerCase();
      n.querySelectorAll("[data-cybercall-contact-panel]").forEach((N) => {
        const A = [...N.querySelectorAll("[data-cybercall-contact-row]")];
        for (const P of A) {
          const T = P.querySelector(".cybercall-contact-id").textContent;
          P.hidden = !T.toLocaleLowerCase().includes(S);
        }
        const k = N.querySelector("[data-cybercall-empty-search]");
        k && (k.hidden = !A.length || A.some((P) => !P.hidden));
      });
    };
    o.addEventListener("input", b), b();
  }
  a.addEventListener("submit", async (b) => {
    var A, k, P;
    b.preventDefault();
    const S = new FormData(a), N = String(S.get("scope") ?? oe);
    u.disabled = !0;
    try {
      await Ja(S.get("name"), S.get("number"), N, S.get("image"), {
        id: S.get("contactId"),
        actorId: S.get("actorId"),
        managedByGM: S.get("managedByGM") === "on",
        isNpc: S.get("managedByGM") === "on" || !!S.get("actorId")
      }) && (l(), (A = a.elements.name) == null || A.focus());
    } catch (T) {
      console.warn(`${d} | Could not save contact.`, T), (P = (k = ui.notifications) == null ? void 0 : k.error) == null || P.call(k, "CyberCall could not save this contact.");
    } finally {
      u.disabled = !1;
    }
  });
  const i = n.querySelector("[data-cybercall-contact-player]");
  i == null || i.addEventListener("change", () => {
    Sn = i.value, z();
  });
  const c = a.closest("details"), u = a.querySelector('button[type="submit"]');
  function l() {
    a.reset(), a.elements.scope.value = oe, u.textContent = "Add Contact", c && (c.querySelector("summary").textContent = "Add contact");
  }
  (v = a.querySelector("[data-cybercall-cancel-contact]")) == null || v.addEventListener("click", () => {
    l(), c && (c.open = !1);
  }), (M = a.elements.actorId) == null || M.addEventListener("change", () => {
    var S;
    const b = (S = game.actors) == null ? void 0 : S.get(a.elements.actorId.value);
    b && (a.elements.name.value || (a.elements.name.value = b.name), a.elements.image && !a.elements.image.value && (a.elements.image.value = b.img ?? ""), a.elements.managedByGM && (a.elements.managedByGM.checked = !0));
  }), n.querySelectorAll("[data-cybercall-contact-tab]").forEach((b) => {
    b.addEventListener("click", (S) => {
      var k;
      const N = S.currentTarget.dataset.cybercallContactTab;
      if (N === "player" && !((k = game.user) != null && k.isGM) || N === oe) return;
      oe = N, l(), c && (c.open = !1);
      const A = N !== "player" || !!We();
      c && (c.hidden = !A), n.querySelectorAll("[data-cybercall-contact-tab]").forEach((P) => {
        P.classList.toggle("active", P.dataset.cybercallContactTab === oe);
      }), n.querySelectorAll("[data-cybercall-contact-panel]").forEach((P) => {
        P.hidden = P.dataset.cybercallContactPanel !== oe;
      });
    });
  }), n.querySelectorAll("[data-cybercall-contact-action]").forEach((b) => {
    b.addEventListener("click", async (S) => {
      var J, F, G;
      const N = S.currentTarget.dataset.cybercallContactAction, A = S.currentTarget.dataset.contactId, k = S.currentTarget.dataset.contactScope ?? "personal", T = Ha(k).find((W) => W.id === A);
      if (N === "edit" && T && ((J = game.user) != null && J.isGM)) {
        if (!c || !a.elements.contactId) return;
        a.elements.contactId.value = T.id, a.elements.name.value = T.name, a.elements.number.value = T.number, a.elements.actorId.value = T.actorId, a.elements.image.value = T.image, a.elements.managedByGM.checked = T.managedByGM, c.querySelector("summary").textContent = "Edit contact", u.textContent = "Save Contact", c.open = !0, a.elements.name.focus();
        return;
      }
      if (N === "remove" && T && !("assignedToPlayer" in T)) {
        try {
          await Qa(A, k);
        } catch (W) {
          console.warn(`${d} | Could not remove contact.`, W), (G = (F = ui.notifications) == null ? void 0 : F.error) == null || G.call(F, "CyberCall could not remove this contact.");
        }
        return;
      }
      if (T && (N === "call" || N === "message") && (e.selectedContactId = A, s(A)), N === "call" && T) {
        await Mr(T);
        return;
      }
      N === "message" && T && await Ae(T);
    });
  }), (m = n.querySelector("[data-cybercall-open-messages]")) == null || m.addEventListener("click", async () => {
    await Ae();
  });
}
function Pn(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
function ir(e) {
  var l, p, y, v, M, m, b;
  const t = ut()[e.id] ?? null, n = ((l = game.user) == null ? void 0 : l.isGM) === !0, a = !!(!e.isGroup && e.contact && !e.contact.userId && (e.contact.isNpc || e.contact.managedByGM || e.isNpcRouted)), r = t != null && t.actorId ? (y = (p = game.actors) == null ? void 0 : p.get) == null ? void 0 : y.call(p, t.actorId) : null, s = String((r == null ? void 0 : r.name) ?? (t == null ? void 0 : t.actorName) ?? "").trim(), o = String((t == null ? void 0 : t.image) ?? ((M = (v = r == null ? void 0 : r.prototypeToken) == null ? void 0 : v.texture) == null ? void 0 : M.src) ?? (r == null ? void 0 : r.img) ?? "").trim(), i = (t == null ? void 0 : t.revealPortrait) === !0, c = e.isNpcRouted === !0, u = t || c ? {
    ...e.contact,
    actorId: t && n ? String(t.actorId ?? e.contact.actorId ?? "") : e.contact.actorId,
    image: t && i ? o : ""
  } : e.contact;
  return {
    ...e,
    contact: u,
    image: !n && c ? t && i ? o : "" : e.image,
    canLinkNpc: n && a,
    showNpcLinkPanel: n && (a || !!t),
    hasNpcBinding: !!t,
    npcBindingName: s || ((m = e.contact) == null ? void 0 : m.name) || "Linked NPC",
    npcBindingImage: o,
    npcBindingInitials: ne(s || ((b = e.contact) == null ? void 0 : b.name) || "NPC"),
    npcPortraitRevealed: i,
    npcBindingStatusLabel: t ? `Linked to ${s || "Actor"}` : "Unlinked NPC contact"
  };
}
function _t(e = null) {
  var v, M, m;
  let t = Lt();
  const n = e ?? t[0] ?? null;
  n && !t.some((b) => b.id === n.id || b.number === n.number) && (t = [...t, O(n)].sort((b, S) => b.name.localeCompare(S.name)));
  const a = ee || Y ? "" : x, r = bn(Ot(), t, a, Rt()).map((b) => ({
    ...ir(b),
    messages: b.messages.map((S) => ({
      ...S,
      createdAtLabel: Pn(S.createdAt)
    }))
  })), s = ee || Y ? null : r.find((b) => b.id === x) ?? null;
  s != null && s.contact && !t.some((b) => b.id === s.contact.id || b.number === s.contact.number) && (t = [...t, s.contact].sort((b, S) => b.name.localeCompare(S.name)));
  const o = ((v = s == null ? void 0 : s.contact) == null ? void 0 : v.id) ?? (n == null ? void 0 : n.id) ?? "", i = Tn(), c = Gn(s, { excludeGMs: !1 }), u = lr(s), l = Un(), p = ((M = game.user) == null ? void 0 : M.isGM) === !0 && !s && l.length > 1, y = za();
  return {
    threads: r,
    hasThreads: r.length > 0,
    unreadCount: i,
    hasUnreadMessages: i > 0,
    activeThread: s,
    activeThreadId: (s == null ? void 0 : s.id) ?? a,
    allContacts: t.map((b) => ({
      ...b,
      selected: b.id === o
    })),
    hasContacts: t.length > 0,
    selectedContactId: o,
    isThreadReply: !!s,
    showConversation: !!(s || ee || Y || e),
    isComposingNewMessage: !s && !Y,
    isComposingNewGroup: Y,
    groupMemberChoices: y,
    hasGroupMemberChoices: y.length > 0,
    canDeleteThread: !!s,
    threadReplyLabel: s ? `${s.title}${s.subtitle ? ` (${s.subtitle})` : ""}` : "",
    canReplyAs: u.length > 1,
    replyAsChoices: u,
    canSendAs: p,
    sendAsChoices: l,
    activeThreadRecipientUserIds: c,
    showMessageTimestamps: game.settings.get(d, "showMessageTimestamps") === !0,
    gmViewPlayerMessagesEnabled: game.settings.get(d, "gmViewPlayerMessages") === !0,
    isFoundryV13Plus: Number(((m = game.release) == null ? void 0 : m.generation) ?? 0) >= 13
  };
}
function or(e, t = _t()) {
  const n = String(new FormData(e).get("contactId") ?? "");
  return t.allContacts.find((a) => a.id === n) ?? null;
}
function Gn(e, t = {}) {
  var s, o, i;
  if (!((s = e == null ? void 0 : e.messages) != null && s.length)) return [];
  const n = String(((o = game.user) == null ? void 0 : o.id) ?? ""), a = new Set((((i = game.users) == null ? void 0 : i.contents) ?? []).filter((c) => c.isGM).map((c) => String(c.id))), r = /* @__PURE__ */ new Set();
  for (const c of e.messages) {
    c.senderUserId && c.senderUserId !== n && !(t.excludeGMs && a.has(c.senderUserId)) && r.add(c.senderUserId);
    for (const u of c.recipientUserIds ?? [])
      u && u !== n && !(t.excludeGMs && a.has(u)) && r.add(u);
  }
  return [...r];
}
function cr() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => String(t.id)).filter(Boolean);
}
function lr(e) {
  var a, r;
  const t = !!((a = game.user) != null && a.isGM && (e != null && e.contact) && !e.contact.userId && (e.contact.isNpc || e.contact.managedByGM)), n = [{
    id: "self",
    label: Z(game.user, "Me"),
    selected: !t
  }];
  return !((r = game.user) != null && r.isGM) || !(e != null && e.contact) || e.contact.userId || n.push({
    id: "contact",
    label: e.contact.name,
    selected: t
  }), n;
}
function Un() {
  var n, a;
  const e = [{
    id: "self",
    label: Z(game.user, "Me"),
    selected: !0,
    contact: null
  }];
  if (!((n = game.user) != null && n.isGM)) return e;
  const t = /* @__PURE__ */ new Set();
  for (const r of [...de(), ...yt()].map(O)) {
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
      contact: O({
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
function Zt(e) {
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
function ur(e, t) {
  var s, o;
  const n = new FormData(e);
  if (t.activeThread)
    return String(n.get("replyAs") ?? "self") === "contact" && ((s = game.user) != null && s.isGM) && t.activeThread.contact ? Zt(t.activeThread.contact) : {};
  const a = String(n.get("sendAs") ?? "self");
  if (a === "self" || !((o = game.user) != null && o.isGM)) return {};
  const r = Un().find((i) => i.id === a);
  return Zt(r == null ? void 0 : r.contact);
}
function dr(e) {
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
function Xt(e) {
  var n, a, r, s, o, i;
  const t = String(
    ((n = e == null ? void 0 : e.getTextureSrc) == null ? void 0 : n.call(e)) || ((a = e == null ? void 0 : e.texture) == null ? void 0 : a.src) || ((s = (r = e == null ? void 0 : e.document) == null ? void 0 : r.texture) == null ? void 0 : s.src) || ((i = (o = e == null ? void 0 : e.prototypeToken) == null ? void 0 : o.texture) == null ? void 0 : i.src) || (e == null ? void 0 : e.img) || ""
  ).trim();
  return t.includes("*") ? String((e == null ? void 0 : e.img) ?? "").trim() : t;
}
async function gr(e) {
  var o, i, c, u, l, p, y, v;
  const t = dr(e), n = globalThis.fromUuid;
  let a = t.uuid && n ? await n(t.uuid) : null;
  !a && t.sceneId && t.tokenId && (a = ((l = (u = (c = (i = (o = game.scenes) == null ? void 0 : o.get) == null ? void 0 : i.call(o, t.sceneId)) == null ? void 0 : c.tokens) == null ? void 0 : u.get) == null ? void 0 : l.call(u, t.tokenId)) ?? null);
  const r = String(
    ((p = a == null ? void 0 : a.actor) == null ? void 0 : p.id) || (a == null ? void 0 : a.actorId) || ((a == null ? void 0 : a.documentName) === "Actor" ? a.id : "") || t.actorId || (t.type === "Actor" ? t.id : "") || ""
  ).trim(), s = (a == null ? void 0 : a.documentName) === "Actor" ? a : (a == null ? void 0 : a.actor) ?? (r ? (v = (y = game.actors) == null ? void 0 : y.get) == null ? void 0 : v.call(y, r) : null);
  return s ? {
    actorId: String(s.id ?? r),
    actorUuid: String(s.uuid ?? `Actor.${s.id ?? r}`),
    actorName: String(s.name ?? "Linked NPC"),
    image: Xt(a) || Xt(s),
    revealPortrait: !1,
    linkedAt: (/* @__PURE__ */ new Date()).toISOString()
  } : null;
}
async function mr(e, t) {
  var a, r, s, o, i;
  if (!((a = game.user) != null && a.isGM) || !t) return;
  e.preventDefault(), e.stopPropagation();
  const n = await gr(e);
  if (!n) {
    (s = (r = ui.notifications) == null ? void 0 : r.warn) == null || s.call(r, "Drop an Actor or an Actor-backed Token to link this NPC contact.");
    return;
  }
  await it(t, n), (i = (o = ui.notifications) == null ? void 0 : o.info) == null || i.call(o, `Linked this NPC conversation to ${n.actorName}.`), await _();
}
async function pr(e, t) {
  var v, M, m, b, S;
  const n = new FormData(e), a = String(n.get("groupName") ?? "").trim(), r = [...new Set(n.getAll("memberUserIds").map((N) => String(N)).filter(Boolean))];
  if (!a) {
    (M = (v = ui.notifications) == null ? void 0 : v.warn) == null || M.call(v, "Enter a name for the group chat.");
    return;
  }
  if (!r.length) {
    (b = (m = ui.notifications) == null ? void 0 : m.warn) == null || b.call(m, "Select at least one other player for the group chat.");
    return;
  }
  const s = String(((S = game.user) == null ? void 0 : S.id) ?? ""), o = [...new Set([s, ...r].filter(Boolean))], i = o.map((N) => {
    var A, k;
    return Z((k = (A = game.users) == null ? void 0 : A.get) == null ? void 0 : k.call(A, N));
  }).filter(Boolean), c = Ne(), u = Pa(c), l = Z(game.user, "A player"), p = {
    id: `group-${c}`,
    name: a,
    number: `${o.length} members`,
    userIds: r,
    isGroup: !0
  };
  await Ut(p, `${l} created the group.`, {
    threadId: u,
    recipientUserIds: r,
    recipientNumbers: [],
    messageType: "event",
    eventType: "group-created",
    conversationType: "group",
    groupId: c,
    groupName: a,
    groupMemberUserIds: o,
    groupMemberNames: i
  }) && (x = u, ee = !1, Y = !1, t && (t.contact = p), (I == null ? void 0 : I.mode) === "messages" && (I.contact = p), await qe(), await _());
}
function fr(e, t = null) {
  const n = ae(e, t);
  if (!n) return;
  Xa(e, n), er(e, n), n.querySelectorAll("[data-cybercall-npc-link-drop]").forEach((s) => {
    s.addEventListener("dragover", (o) => {
      var i;
      (i = game.user) != null && i.isGM && (o.preventDefault(), o.dataTransfer.dropEffect = "link", s.classList.add("drag-over"));
    }), s.addEventListener("dragleave", () => s.classList.remove("drag-over")), s.addEventListener("drop", async (o) => {
      s.classList.remove("drag-over");
      const i = s.dataset.cybercallNpcThreadId || s.dataset.cybercallThreadId || x;
      await mr(o, i);
    });
  }), n.querySelectorAll("[data-cybercall-npc-action]").forEach((s) => {
    s.addEventListener("click", async (o) => {
      var l, p, y, v, M;
      o.preventDefault(), o.stopPropagation();
      const i = o.currentTarget.dataset.cybercallNpcAction, c = o.currentTarget.dataset.cybercallNpcThreadId || x, u = ut()[c];
      if (i === "toggle-reveal" && u) {
        await it(c, { revealPortrait: u.revealPortrait !== !0 }), await _();
        return;
      }
      if (i === "unlink" && u) {
        await it(c, null), (p = (l = ui.notifications) == null ? void 0 : l.info) == null || p.call(l, "NPC identity link removed."), await _();
        return;
      }
      i === "change" && ((y = o.currentTarget.closest("[data-cybercall-npc-link-drop]")) == null || y.classList.add("awaiting-drop"), (M = (v = ui.notifications) == null ? void 0 : v.info) == null || M.call(v, "Drag a different Actor or Token onto the NPC identity panel."));
    });
  }), n.querySelectorAll("[data-cybercall-thread-id]").forEach((s) => {
    s.addEventListener("click", async (o) => {
      ee = !1, Y = !1, x = o.currentTarget.dataset.cybercallThreadId, await qe(), await _();
    });
  }), n.querySelectorAll("[data-cybercall-message-action]").forEach((s) => {
    s.addEventListener("click", async (o) => {
      var c;
      const i = o.currentTarget.dataset.cybercallMessageAction;
      if (i === "back") {
        x = "", ee = !1, Y = !1, e.contact = null, await _();
        return;
      }
      if (i === "refresh") {
        await _();
        return;
      }
      if (i === "open-calls") {
        await On();
        return;
      }
      if (i === "new") {
        ee = !0, Y = !1, x = "", te && (te.contact = null), await _();
        return;
      }
      if (i === "new-group") {
        ee = !1, Y = !0, x = "", te && (te.contact = null), (I == null ? void 0 : I.mode) === "messages" && (I.contact = null), await _();
        return;
      }
      if (i === "delete-thread") {
        o.preventDefault(), o.stopPropagation();
        const u = n.querySelector("[data-cybercall-active-thread]"), l = x || ((c = u == null ? void 0 : u.dataset) == null ? void 0 : c.cybercallActiveThread) || "";
        if (!l) return;
        if (e._cybercallPendingDeleteThreadId !== l) {
          e._cybercallPendingDeleteThreadId = l, o.currentTarget.classList.add("confirming"), o.currentTarget.textContent = "Confirm Delete", o.currentTarget.setAttribute("aria-label", "Confirm delete thread"), o.currentTarget.title = "Click again to delete this thread";
          return;
        }
        e._cybercallPendingDeleteThreadId = "", await Ya(l);
      }
    });
  });
  const a = n.querySelector("form[data-cybercall-group-form]");
  a == null || a.addEventListener("submit", async (s) => {
    s.preventDefault(), await pr(a, e);
  });
  const r = n.querySelector("form[data-cybercall-message-form]");
  r == null || r.addEventListener("submit", async (s) => {
    var m, b, S, N, A, k, P, T, J, F;
    s.preventDefault();
    const o = _t(), i = o.activeThread, c = (i == null ? void 0 : i.contact) ?? or(r, o), u = ((m = r.elements.body) == null ? void 0 : m.value) ?? "", l = ur(r, o), p = !!(i != null && i.contact && !i.contact.userId && (i.contact.managedByGM || i.contact.isNpc)), y = i ? Gn(i, { excludeGMs: ((b = game.user) == null ? void 0 : b.isGM) === !0 && !p }) : null;
    if (!c) {
      (N = (S = ui.notifications) == null ? void 0 : S.warn) == null || N.call(S, "Select a contact before sending a message.");
      return;
    }
    const v = (i == null ? void 0 : i.id) ?? ze(c, (A = game.user) == null ? void 0 : A.id, l);
    if (await Ut(c, u, {
      ...l,
      threadId: v,
      recipientUserIds: y != null && y.length ? y : void 0,
      recipientNumbers: l.senderNumber ? [] : void 0,
      conversationType: i != null && i.isGroup ? "group" : "direct",
      groupId: (i == null ? void 0 : i.groupId) ?? "",
      groupName: (i == null ? void 0 : i.groupName) ?? "",
      groupMemberUserIds: (i == null ? void 0 : i.groupMemberUserIds) ?? [],
      groupMemberNames: (i == null ? void 0 : i.groupMemberNames) ?? []
    })) {
      if ((k = game.user) != null && k.isGM && !i && l.senderActorId && !ut()[v]) {
        const G = (T = (P = game.actors) == null ? void 0 : P.get) == null ? void 0 : T.call(P, l.senderActorId);
        G && await it(v, {
          actorId: G.id,
          actorUuid: G.uuid ?? `Actor.${G.id}`,
          actorName: G.name,
          image: l.senderImage || ((F = (J = G.prototypeToken) == null ? void 0 : J.texture) == null ? void 0 : F.src) || G.img || "",
          revealPortrait: !1,
          linkedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      x = v, e && (e.contact = c), (I == null ? void 0 : I.mode) === "messages" && (I.contact = c), ee = !1, Y = !1, r.elements.body.value = "", await qe(), await _({ scrollToBottom: !0, preserveDraft: !1 });
    }
  }), qe();
}
function br() {
  const e = /* @__PURE__ */ new Set(["outgoing", "connected", "ended", "missed"]), t = game.settings.get(d, "showMessageTimestamps") === !0;
  return Ot().filter((n) => n.messageType === "event" && e.has(n.eventType)).sort((n, a) => a.createdAt.localeCompare(n.createdAt)).map((n) => ({
    body: n.body,
    eventType: n.eventType,
    createdAtLabel: t ? Pn(n.createdAt) : ""
  }));
}
function yr(e, t = null) {
  const n = ae(e, t);
  pt(n == null ? void 0 : n.closest(".cybercall-phone-app")), n == null || n.querySelectorAll("[data-cybercall-screen]").forEach((a) => {
    a.addEventListener("click", () => {
      const r = a.dataset.cybercallScreen;
      r !== e.mode && (r === "messages" ? Ae() : jt(r));
    });
  });
}
const { CyberCallApplication: hr, CyberCallComposer: Cr, CyberCallPhone: Bn } = ca({
  moduleId: d,
  templatePath: la,
  composerTemplatePath: ua,
  contactsTemplatePath: da,
  messagesTemplatePath: ga,
  phoneTemplatePath: ma,
  escapeHTML: ve,
  getDefaultComposerData: Va,
  getActorChoices: ja,
  getPlayerChoices: In,
  getContacts: yt,
  getGroupContacts: de,
  getMessageContext: _t,
  getCallHistory: br,
  bindPhoneNavigation: yr,
  getRingtoneChoices: Vn,
  getMessageSoundOptions: Ia,
  getSoundPath: Wt,
  getActiveContactsTab: () => oe,
  getContactsPlayerChoices: An,
  getSelectedContactsPlayerId: We,
  getPlayerContacts: yn,
  canEditContactImages: Fe,
  bindCallControls: tr,
  bindComposerControls: ar,
  bindContactsControls: sr,
  bindMessagesControls: fr,
  stopRinging: je,
  clearActiveCall: (e) => {
    w === e && (w = null);
  },
  clearActiveComposer: (e) => {
    X === e && (X = null);
  },
  clearActiveContacts: (e) => {
    Se === e && (Se = null);
  },
  clearActiveMessages: (e) => {
    te === e && (te = null);
  },
  clearActivePhone: (e) => {
    w === e && (w = null, je()), I === e && (I = null, Se = null, te = null);
  }
});
async function ge(e = {}) {
  var a, r, s, o;
  if (!ht())
    return (r = (a = ui.notifications) == null ? void 0 : a.warn) == null || r.call(a, "You do not have permission to open CyberCall transmissions."), null;
  await Ft();
  const t = re(e);
  !t.fullscreen && !game.user.isGM ? (I ?? (I = new Bn()), xn(I), I.callData = t, w = I) : w = new hr(t, t.fullscreen ? { classes: ["cybercall-app", "cybercall-fullscreen"] } : {});
  const n = w;
  return await n.render(!0), w === n && ((s = n.callData) == null ? void 0 : s.id) === t.id && (_n(n), (o = n.bringToFront) == null || o.call(n), Er(n.callData)), n;
}
async function Ft() {
  if (!w) return;
  const e = w;
  if (w = null, e === I) {
    je(), e.callData = null, Se = e.mode === "calls" ? e : null, te = e.mode === "messages" ? e : null, await e.render(!0);
    return;
  }
  await e.close();
}
function wr(e) {
  var t;
  return !!((t = w == null ? void 0 : w.callData) != null && t.id) && w.callData.id === e;
}
async function vr() {
  w && (await w.render(!0), _n(w));
}
async function Dn(e) {
  wr(e) && (w.callData.accepted = !0, w.callData.ringing = !1, je(), await vr());
}
async function Sr(e) {
  e && (await dt(w == null ? void 0 : w.callData, "connected"), game.socket.emit(se, {
    action: "acceptCall",
    callId: e
  }), await Dn(e));
}
async function Ln(e) {
  var t;
  e && ((t = w == null ? void 0 : w.callData) != null && t.id) && w.callData.id !== e || await Ft();
}
async function Rn(e) {
  var t;
  await dt(w == null ? void 0 : w.callData, (t = w == null ? void 0 : w.callData) != null && t.accepted ? "ended" : "missed"), game.socket.emit(se, {
    action: "endCall",
    callId: e
  }), await Ln(e);
}
function Ir(e, t = "Player") {
  var r, s, o, i, c;
  const n = ((s = (r = game.users) == null ? void 0 : r.get) == null ? void 0 : s.call(r, e)) ?? ((c = (i = (o = game.users) == null ? void 0 : o.contents) == null ? void 0 : i.find) == null ? void 0 : c.call(i, (u) => u.id === e)), a = Z(n, t);
  return {
    id: `user-${e}`,
    name: a,
    number: `@${a}`,
    image: Me(n),
    userId: e,
    userIds: e ? [e] : []
  };
}
function Ar(e) {
  var t;
  return e ? e.contactNumber ? Lt().find((a) => a.number === e.contactNumber) ?? {
    id: `contact-${e.contactNumber}`,
    name: e.contactName || e.callerName,
    number: e.contactNumber,
    image: e.contactImage || e.image,
    actorId: e.contactActorId ?? "",
    managedByGM: !0,
    isNpc: !0
  } : (t = game.user) != null && t.isGM && e.callerUserId ? Ir(e.callerUserId, e.callerName) : null : null;
}
function Nr(e, t) {
  var a;
  const n = /* @__PURE__ */ new Set();
  for (const r of (t == null ? void 0 : t.userIds) ?? []) n.add(String(r));
  if (t != null && t.userId && n.add(String(t.userId)), e != null && e.callerUserId && n.add(String(e.callerUserId)), !(t != null && t.userId) && (t != null && t.managedByGM || t != null && t.isNpc || e != null && e.contactNumber))
    for (const r of cr()) n.add(r);
  return n.delete(String(((a = game.user) == null ? void 0 : a.id) ?? "")), [...n].filter(Boolean);
}
async function dt(e, t) {
  var s;
  const n = Ar(e);
  if (!n) return null;
  const a = (e == null ? void 0 : e.callerUserId) || ((s = game.user) == null ? void 0 : s.id), r = {
    outgoing: `Outgoing call to ${n.name}.`,
    connected: `Call connected with ${n.name}.`,
    ended: `Call ended with ${n.name}.`,
    missed: `Call missed or declined with ${n.name}.`
  };
  return qa(n, r[t] ?? "Call event.", {
    threadId: ze(n, a),
    eventType: t,
    senderName: "CyberCall",
    senderNumber: n.number,
    senderActorId: n.actorId,
    recipientUserIds: Nr(e, n),
    recipientNumbers: n.userId ? [] : [n.number]
  });
}
async function Mr(e) {
  var i, c;
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
    return await dt(u, "outgoing"), ge(u);
  }
  if (!xt())
    return (c = (i = ui.notifications) == null ? void 0 : i.warn) == null || c.call(i, "No GM is connected to receive the CyberCall."), null;
  const t = Ne(), n = Me(game.user), a = Z(game.user, "Unknown Caller"), r = {
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
  }), await dt(s, "outgoing"), ge(s);
}
async function qt() {
  var e, t, n;
  return game.user.isGM ? (X || (X = new Cr()), X.rendered || await X.render(!0), (n = X.bringToFront) == null || n.call(X), X) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function Ct() {
  var e, t, n, a;
  return ht() ? w && !((n = game.user) != null && n.isGM) ? ((a = w.bringToFront) == null || a.call(w), w) : jt("calls") : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function z() {
  !I || I.callData || I.mode === "messages" || await I.render(!0);
}
async function Ae(e = null) {
  var n, a;
  if (!ht())
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "You do not have permission to use CyberCall messages."), null;
  e && (x = ze(e), ee = !1, Y = !1);
  const t = await jt("messages", e);
  return t != null && t.callData || await qe(), t;
}
async function Vt(e) {
  return e && (x = String(e), ee = !1, Y = !1), Ae();
}
async function On() {
  var e;
  return (e = game.user) != null && e.isGM ? qt() : Ct();
}
async function _(e = {}) {
  !I || I.callData || I.mode !== "messages" || (I._cybercallMessageComposerState = e.preserveDraft === !1 ? null : kn(I), I._cybercallMessageScrollState = {
    ...En(I),
    scrollToBottom: e.scrollToBottom === !0
  }, await I.render(!0));
}
function xn(e) {
  if (e.mode !== "messages" || e.callData) return;
  const t = kn(e);
  t && (e._cybercallMessageComposerState = t);
  const n = En(e);
  n && (e._cybercallMessageScrollState = n);
}
async function jt(e = "calls", t = null) {
  var a;
  I ? (xn(I), (e !== I.mode || t) && (I.contact = t ?? I.contact), I.mode = e) : I = new Bn(e, t), Se = e === "calls" ? I : null, te = e === "messages" ? I : null;
  const n = I;
  return n.callData || await n.render(!0), (a = n.bringToFront) == null || a.call(n), n;
}
async function zt(e = {}) {
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
  }), ge({ ...t, outgoing: !0 });
}
async function $r(e) {
  var t, n, a, r;
  if (e.action === "personalContactDirectories") {
    (t = game.user) != null && t.isGM && await Pt();
    return;
  }
  if (e && !(Array.isArray(e.targetUserIds) && e.targetUserIds.length && !e.targetUserIds.includes((n = game.user) == null ? void 0 : n.id)) && !(Array.isArray((a = e.callData) == null ? void 0 : a.targetUserIds) && e.callData.targetUserIds.length && !e.callData.targetUserIds.includes((r = game.user) == null ? void 0 : r.id))) {
    if (e.action === "openCall") {
      if (!ht()) return;
      ge(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      ge(e.callData);
      return;
    }
    if (e.action === "acceptCall") {
      Dn(e.callId);
      return;
    }
    if (e.action === "endCall") {
      Ln(e.callId);
      return;
    }
    if (e.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const s = O({
        ...e.contact,
        image: ""
      });
      if (!s.name || !s.number) return;
      const o = de();
      o.push(s), await lt(o), await z();
      return;
    }
    if (e.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await lt(de().filter((s) => s.id !== e.contactId)), await z();
      return;
    }
    e.action === "groupContactsChanged" && (Ie = Array.isArray(e.contacts) ? e.contacts.map(O) : null, await z());
  }
}
function _n(e) {
  var t, n;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((n = e.setPosition) == null || n.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function Fn() {
  const e = game.settings.get(d, "ringSoundsByWorld");
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function Tr() {
  return /* @__PURE__ */ new Set([
    ...Object.keys($t),
    ...ue(game.settings.get(d, "customRingtones")).map((e) => e.path)
  ]);
}
function Wt() {
  const e = he(), t = Fn(), n = Object.prototype.hasOwnProperty.call(t, e), a = String(n ? t[e] : game.settings.get(d, "ringSound") ?? "").trim();
  return Tr().has(a) ? a : cn;
}
async function qn(e) {
  const t = he();
  await game.settings.set(d, "ringSoundsByWorld", {
    ...Fn(),
    [t]: String(e ?? "").trim()
  });
}
function Vn() {
  const e = Wt(), t = ue(game.settings.get(d, "customRingtones")), n = new Map(Object.entries($t));
  for (const a of t)
    n.has(a.path) || n.set(a.path, a.label);
  return [...n].map(([a, r]) => ({
    value: a,
    label: r,
    selected: a === e
  }));
}
function je() {
  if (Nt += 1, !ce) return;
  const e = ce;
  ce = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function Er(e) {
  var s;
  if (je(), !e.ringing) return;
  const t = Wt();
  if (!t) return;
  const a = 0.65 * (Math.max(0, Math.min(100, Number(game.settings.get(d, "ringVolume") ?? 100))) / 100), r = ((s = foundry == null ? void 0 : foundry.audio) == null ? void 0 : s.AudioHelper) ?? globalThis.AudioHelper;
  if (r != null && r.play) {
    const o = Nt;
    r.play({ src: t, volume: a, autoplay: !0, loop: !0, channel: "interface" }, !1).then((i) => {
      var c;
      o === Nt ? ce = i : typeof (i == null ? void 0 : i.stop) == "function" ? i.stop() : (c = i == null ? void 0 : i.pause) == null || c.call(i);
    }).catch((i) => {
      console.warn(`${d} | Unable to play ringing sound.`, i);
    });
  } else {
    const o = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5);
    ce = new Audio(t), ce.loop = !0, ce.volume = a * o, ce.play().catch((i) => {
      console.warn(`${d} | Unable to play ringing sound.`, i);
    });
  }
}
function kr() {
  var i;
  const e = gn();
  if (e) {
    const c = ((i = foundry == null ? void 0 : foundry.audio) == null ? void 0 : i.AudioHelper) ?? globalThis.AudioHelper;
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
  const n = new t(), a = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), r = Math.max(1e-4, Math.min(0.18, 0.18 * a)), s = (c, u, l) => {
    const p = n.createOscillator(), y = n.createGain(), v = n.currentTime + u, M = v + l;
    p.type = "sine", p.frequency.setValueAtTime(c, v), p.frequency.exponentialRampToValueAtTime(c * 1.18, M), y.gain.setValueAtTime(1e-4, v), y.gain.exponentialRampToValueAtTime(r, v + 0.025), y.gain.exponentialRampToValueAtTime(1e-4, M), p.connect(y), y.connect(n.destination), p.start(v), p.stop(M);
  };
  (async () => {
    n.state === "suspended" && await n.resume(), s(620, 0, 0.16), s(930, 0.11, 0.2), window.setTimeout(() => {
      var c;
      return (c = n.close) == null ? void 0 : c.call(n);
    }, 500);
  })().catch(() => {
    var c;
    return (c = n.close) == null ? void 0 : c.call(n);
  });
}
function Pr(e) {
  var n, a, r, s, o;
  if (e.senderImage) return String(e.senderImage);
  if (e.contactIsNpc && e.senderNumber) return "";
  const t = ((a = (n = game.users) == null ? void 0 : n.get) == null ? void 0 : a.call(n, e.senderUserId)) ?? ((o = (s = (r = game.users) == null ? void 0 : r.contents) == null ? void 0 : s.find) == null ? void 0 : o.call(s, (i) => i.id === e.senderUserId));
  return (t == null ? void 0 : t.isGM) === !0 ? "" : Me(t);
}
function en(e) {
  e != null && e.isConnected && (e.classList.add("leaving"), window.setTimeout(() => e.remove(), 220));
}
function Gr(e) {
  let t = document.querySelector("[data-cybercall-message-notifications]");
  t || (t = document.createElement("div"), t.className = "cybercall-message-notifications", t.dataset.cybercallMessageNotifications = "", t.setAttribute("aria-live", "polite"), document.body.append(t));
  const n = String(e.senderName || "New message").trim(), a = String(e.groupName || "").trim(), r = document.createElement("button");
  r.type = "button", r.className = "cybercall-incoming-message", r.title = "Open CyberCall conversation";
  const s = document.createElement("span");
  s.className = `cybercall-incoming-avatar ${fn(e.senderUserId || n)}`;
  const o = Pr(e);
  if (o) {
    const p = document.createElement("img");
    p.src = o, p.alt = "", s.append(p);
  } else
    s.textContent = ne(n);
  const i = document.createElement("i");
  i.className = "fa-solid fa-message cybercall-incoming-badge", i.setAttribute("aria-hidden", "true"), s.append(i);
  const c = document.createElement("span");
  c.className = "cybercall-incoming-copy";
  const u = document.createElement("strong");
  u.textContent = a ? `${n} · ${a}` : n;
  const l = document.createElement("small");
  l.textContent = String(e.body || "New CyberCall message").trim(), c.append(u, l), r.append(s, c), r.addEventListener("click", () => {
    en(r), Vt(String(e.threadId || ""));
  }), t.append(r), kr(), window.setTimeout(() => en(r), 4200);
}
function Ur(e) {
  var n, a, r;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[d]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, d, "message"));
  return (t == null ? void 0 : t.kind) === le ? t : ((r = t == null ? void 0 : t.message) == null ? void 0 : r.kind) === le ? t.message : null;
}
function jn(e, t) {
  var a, r, s, o, i, c, u;
  if (!e) return;
  const n = (a = e.matches) != null && a.call(e, ".chat-message") ? e : ((r = e.closest) == null ? void 0 : r.call(e, ".chat-message")) ?? ((s = e.querySelector) == null ? void 0 : s.call(e, ".chat-message")) ?? e;
  (i = (o = n.classList) == null ? void 0 : o.toggle) == null || i.call(o, "cybercall-chat-message-hidden", !t), t ? (c = n.removeAttribute) == null || c.call(n, "aria-hidden") : (u = n.setAttribute) == null || u.call(n, "aria-hidden", "true");
}
function zn(e, t) {
  if (!Ur(e)) return;
  const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? (t == null ? void 0 : t.element) ?? null;
  jn(n, game.settings.get(d, "showChatCards") === !0);
}
function Wn() {
  const e = game.settings.get(d, "showChatCards") === !0;
  document.querySelectorAll(".cybercall-chat-card").forEach((t) => {
    jn(t, e);
  });
}
function Hn() {
  const e = game.modules.get(d);
  e && (e.api = {
    openCall: ge,
    closeCall: Ft,
    broadcastCall: zt,
    openComposer: qt,
    openContacts: Ct,
    openMessages: Ae,
    openMessagesThread: Vt,
    openCallPanel: On,
    getUnreadMessageCount: Tn,
    get activeCall() {
      return w;
    },
    get activeComposer() {
      return X;
    },
    get activeContacts() {
      return Se;
    },
    get activeMessages() {
      return te;
    }
  });
}
function Br() {
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
      return (a = game.user) != null && a.isGM ? qt() : Ct();
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
function Dr() {
  game.settings.register(d, "deviceEmblem", {
    name: "Device emblem",
    scope: "world",
    config: !1,
    type: String,
    default: "",
    onChange: () => ot(document)
  }), game.settings.register(d, "phoneNumberFormat", {
    name: "Phone number format",
    hint: "Use # for digits, A for letters, or * for letters or digits. Other characters are fixed text. Leave blank for unrestricted numbers.",
    scope: "world",
    config: !1,
    type: String,
    default: "",
    onChange: () => ln(document)
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
    default: cn,
    choices: $t
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
      const n = (a = ae(X)) == null ? void 0 : a.querySelector("[data-cybercall-ringtone]");
      n instanceof HTMLSelectElement && n.replaceChildren(...Vn().map(
        ({ label: r, value: s, selected: o }) => new Option(r, s, o, o)
      ));
    }
  }), game.settings.registerMenu(d, "customRingtonesMenu", {
    name: "Additional Ringtones",
    label: "Manage Ringtones",
    hint: "Add one or more audio files to the ringtone list for this world.",
    icon: "fa-solid fa-bell",
    type: dn,
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
      _(), z();
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
    type: Na,
    restricted: !0
  }), game.settings.register(d, "showChatCards", {
    name: "Show CyberCall Chat Cards",
    hint: "Show CyberCall message cards in Foundry's standard chat log. Disabled by default because CyberCall has its own inbox and notifications.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: () => Wn()
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
      _(), z();
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
async function Lr() {
  const e = game.settings.get(d, "contacts");
  Array.isArray(e) && await game.settings.set(d, "contacts", {
    [he()]: e.map(O)
  });
}
Hooks.once("init", () => {
  Dr(), Hn();
});
Hooks.once("ready", async () => {
  var e;
  await Lr(), Hn(), Br(), game.socket.on(se, $r), await Pt(), await Mn(), await pn(), (e = game.user) != null && e.isGM || game.socket.emit(se, { action: "personalContactDirectories" }), Wn(), console.log(`${d} | Ready. Use game.modules.get("${d}").api.openCall({...})`);
});
Hooks.on("renderChatMessage", (e, t) => {
  zn(e, t);
});
Hooks.on("createUser", () => Pt());
Hooks.on("holosuite-core.brandingChanged", () => ot(document));
Hooks.on("renderJournalDirectory", (e, t) => {
  const n = ae(e, t);
  n == null || n.querySelectorAll("[data-document-id], [data-entry-id]").forEach((a) => {
    var s, o;
    const r = (o = (s = game.journal) == null ? void 0 : s.get) == null ? void 0 : o.call(s, a.dataset.documentId ?? a.dataset.entryId);
    r != null && r.getFlag(d, "playerPersonalContactDirectory") && (a.hidden = !0);
  });
});
Hooks.on("renderChatMessageHTML", (e, t) => {
  zn(e, t);
});
for (const e of ["create", "update", "delete"])
  Hooks.on(`${e}JournalEntry`, (t) => {
    Ga(t) && (e === "create" && Mn(), z(), _());
  });
Hooks.on("createChatMessage", async (e) => {
  var i, c, u;
  Et(e) && await pn();
  const t = (i = e == null ? void 0 : e.flags) == null ? void 0 : i[d];
  if ((t == null ? void 0 : t.kind) !== le) return;
  const n = String(((c = game.user) == null ? void 0 : c.id) ?? ""), a = Array.isArray(t.recipientUserIds) ? t.recipientUserIds.map((l) => String(l)) : [], r = ((u = game.user) == null ? void 0 : u.isGM) === !0 && !String(t.contactUserId ?? "") && (t.contactManagedByGM === !0 || t.contactIsNpc === !0), s = String(t.senderUserId ?? "") !== n && (a.includes(n) || r), o = String(t.messageType ?? "text") === "text" || t.eventType === "group-created";
  s && o && game.settings.get(d, "messageNotifications") !== !1 && Gr(t), await _(), await z();
});
document.addEventListener("click", (e) => {
  var a;
  const t = e.target, n = (a = t == null ? void 0 : t.closest) == null ? void 0 : a.call(t, "[data-cybercall-open-thread]");
  n && (e.preventDefault(), Vt(n.dataset.cybercallThreadId));
});
Hooks.on("deleteChatMessage", (e) => {
  Et(e) && (_(), z());
});
