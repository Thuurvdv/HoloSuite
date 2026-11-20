var Mn = Object.defineProperty;
var $n = (e, t, n) => t in e ? Mn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var O = (e, t, n) => $n(e, typeof t != "symbol" ? t + "" : t, n);
function Tn(e, t) {
  return e.image ? `<img src="${t(e.image)}" alt="${t(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${t(e.initials)}</div>`;
}
function ot(e, t) {
  const n = `--cybercall-signal: ${e.signal}%;`, a = e.fullscreen ? "cybercall-broadcast" : "", r = e.ringing ? "cybercall-ringing-panel" : "", s = e.accepted ? "cybercall-connected-panel" : "", i = e.showBroadcast ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>' : "", o = `
      <header class="cybercall-header">
        <div>
          <div class="cybercall-kicker">${t(e.accepted ? "Connected" : e.kicker)}</div>
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
        ${i}
      `;
  return `
    <div class="cybercall-panel cybercall-${e.variant} ${a} ${r} ${s}" style="${n}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${o}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${Tn(e, t)}</div>
        ${l}
      </main>
      <footer class="cybercall-actions">
        ${u}
      </footer>
    </div>
  `;
}
function Dt(e, t) {
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
function ct(e, t) {
  var l;
  const n = (u, c) => u.length ? u.map((m) => `
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
      `).join("") : '<li class="cybercall-contacts-empty">No contacts stored.</li>', a = e.activeTab !== "group", r = e.activeTab === "group", s = (e.actors ?? []).map((u) => `<option value="${t(u.id)}">${t(u.name)}</option>`).join(""), i = e.canEditContactImages ? `
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
function lt(e, t) {
  var I;
  const n = e.threads ?? [], a = e.activeThread ?? null, r = e.allContacts ?? [], s = n.length ? n.map((d) => `
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
      `).join("") : '<div class="cybercall-messages-empty">No messages yet.</div>', i = r.map((d) => `<option value="${t(d.id)}" ${e.selectedContactId === d.id ? "selected" : ""}>${t(d.name)} - ${t(d.number)}</option>`).join(""), o = e.canReplyAs ? `
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
          ${i}
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
            ${u}
            ${o}
            ${l}
            <textarea name="body" rows="3" placeholder="Type message..." required></textarea>
            <button type="submit" ${r.length ? "" : "disabled"}>Send</button>
          </form>
        `}
      </main>
    </section>
  `;
}
const V = {
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
}, Gn = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]);
function kn(e) {
  const t = Number(e);
  return Number.isNaN(t) ? V.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function se(e) {
  return String(e).split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var n;
    return (n = t[0]) == null ? void 0 : n.toUpperCase();
  }).join("") || "?";
}
function Te() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function ie(e = {}) {
  var r;
  const t = Array.isArray(e.targetUserIds) ? e.targetUserIds.map((s) => String(s)).filter(Boolean) : [], n = Array.isArray(e.targetUserNames) ? e.targetUserNames.map((s) => String(s)).filter(Boolean) : [], a = {
    ...V,
    ...e,
    id: String(e.id ?? Te()),
    callerName: String(e.callerName ?? V.callerName),
    subtitle: String(e.subtitle ?? V.subtitle),
    image: String(e.image ?? V.image),
    message: String(e.message ?? V.message),
    signal: kn(e.signal ?? V.signal),
    variant: Gn.has(e.variant) ? e.variant : V.variant,
    fullscreen: !!(e.fullscreen ?? V.fullscreen),
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
  return a.initials = se(a.callerName), a.showBroadcast = !!((r = game == null ? void 0 : game.user) != null && r.isGM && a.allowBroadcast), a.isStandard = a.variant === "standard", a.isEmergency = a.variant === "emergency", a.isCorrupted = a.variant === "corrupted", a.isIncoming = !a.accepted, a.hasTargets = a.targetUserIds.length > 0, a.recipientLabel = a.hasTargets ? a.targetUserNames.join(", ") : "All players", a.directionLabel = a.outgoing ? `Calling ${a.recipientLabel}` : `From ${a.callerName}`, a.kicker = a.outgoing ? "Calling" : a.isEmergency ? "Emergency transmission" : a.isCorrupted ? "Unstable transmission" : a.fullscreen ? "Incoming broadcast" : "Incoming transmission", a;
}
function x(e = {}) {
  const t = Array.isArray(e.userIds) ? e.userIds.map((n) => String(n)).filter(Boolean) : e.userId ? [String(e.userId)] : [];
  return {
    id: String(e.id ?? Te()),
    name: String(e.name ?? "").trim(),
    number: String(e.number ?? "").trim(),
    image: String(e.image ?? e.img ?? "").trim(),
    actorId: String(e.actorId ?? "").trim(),
    userId: String(e.userId ?? t[0] ?? "").trim(),
    userIds: t,
    managedByGM: e.managedByGM === !0,
    isNpc: e.isNpc === !0 || !!e.actorId || e.managedByGM === !0,
    initials: se(e.name)
  };
}
function En(e) {
  var a, r, s;
  const t = (e == null ? void 0 : e.document) ?? e, n = String(
    ((a = t == null ? void 0 : t.getTextureSrc) == null ? void 0 : a.call(t)) || ((r = t == null ? void 0 : t.texture) == null ? void 0 : r.src) || (t == null ? void 0 : t.img) || ((s = e == null ? void 0 : e.texture) == null ? void 0 : s.src) || ""
  ).trim();
  return n.includes("*") ? "" : n;
}
function et(e) {
  return !e || /(?:^|\/)mystery-man(?:-[^/.]+)?\.svg(?:$|\?)/i.test(e);
}
function xe(e) {
  var d, p, S, G, T, E, P, _, K, ae, L, re;
  if (!e) return "";
  const t = globalThis.game, n = globalThis.canvas, a = String(e.avatar ?? ((d = e._source) == null ? void 0 : d.avatar) ?? "").trim();
  if (e.isGM === !0) return et(a) ? "" : a;
  const r = e.character ?? e.characterId ?? ((p = e._source) == null ? void 0 : p.character), s = typeof r == "string" ? r : String((r == null ? void 0 : r.id) ?? (r == null ? void 0 : r._id) ?? ""), i = xt(e), o = Array.isArray((S = n == null ? void 0 : n.tokens) == null ? void 0 : S.placeables) ? n.tokens.placeables : [], l = String(((G = t == null ? void 0 : t.user) == null ? void 0 : G.id) ?? "") === String(e.id ?? "") ? ((T = n == null ? void 0 : n.tokens) == null ? void 0 : T.controlled) ?? [] : [], u = ((E = i == null ? void 0 : i.getActiveTokens) == null ? void 0 : E.call(i, !0, !0)) ?? [], c = o.find((D) => {
    var z, Y;
    const B = String(((z = D == null ? void 0 : D.actor) == null ? void 0 : z.id) ?? ((Y = D == null ? void 0 : D.document) == null ? void 0 : Y.actorId) ?? (D == null ? void 0 : D.actorId) ?? "");
    return s && B === s;
  }), m = o.find((D) => {
    var z, Y;
    const B = (D == null ? void 0 : D.actor) ?? ((z = D == null ? void 0 : D.document) == null ? void 0 : z.actor);
    return Number(((Y = B == null ? void 0 : B.ownership) == null ? void 0 : Y[e.id]) ?? 0) >= 3;
  }), f = [...l, ...u, c, m].filter(Boolean).map(En).find(Boolean) ?? "";
  if (f) return f;
  const b = String(
    ((_ = (P = i == null ? void 0 : i.prototypeToken) == null ? void 0 : P.texture) == null ? void 0 : _.src) || ((L = (ae = (K = i == null ? void 0 : i._source) == null ? void 0 : K.prototypeToken) == null ? void 0 : ae.texture) == null ? void 0 : L.src) || ""
  ).trim();
  if (b && !b.includes("*") && !et(b))
    return b;
  const I = String((i == null ? void 0 : i.img) ?? ((re = i == null ? void 0 : i._source) == null ? void 0 : re.img) ?? "").trim();
  return et(I) ? et(a) ? "" : a : I;
}
function xt(e) {
  var r, s, i;
  if (!e) return null;
  const t = globalThis.game, n = e.character ?? e.characterId ?? ((r = e._source) == null ? void 0 : r.character), a = typeof n == "string" ? n : String((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n._id) ?? "");
  return (a ? (i = (s = t == null ? void 0 : t.actors) == null ? void 0 : s.get) == null ? void 0 : i.call(s, a) : null) ?? (typeof n == "object" ? n : null);
}
function H(e, t = "") {
  var a;
  const n = String(((a = xt(e)) == null ? void 0 : a.name) ?? "").trim();
  return n || String((e == null ? void 0 : e.name) ?? "").trim() || t;
}
function qt() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) ?? null;
}
function Vt() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : n.api) ?? null;
}
function Pn(e = {}, t = {}) {
  var a, r, s;
  const n = ((r = (a = globalThis.foundry) == null ? void 0 : a.utils) == null ? void 0 : r.mergeObject) ?? ((s = foundry == null ? void 0 : foundry.utils) == null ? void 0 : s.mergeObject);
  return typeof n == "function" ? n(e, t, { inplace: !1 }) : { ...e, ...t };
}
function Un() {
  var e, t, n, a, r;
  return ((n = (t = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : t.randomID) == null ? void 0 : n.call(t, 8)) ?? ((r = (a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.randomID) == null ? void 0 : r.call(a, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function Rt(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${Un()}`),
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
function Bn() {
  var t, n, a;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((a = game == null ? void 0 : game.release) == null ? void 0 : a.generation));
  return Number.isFinite(e) ? e : null;
}
function Dn() {
  const e = Bn();
  return e === null || e >= 13;
}
function jt(e) {
  return class extends e {
    constructor(a = {}) {
      const r = Pn(new.target.defaultOptions ?? {}, a);
      super(Rt(r));
      O(this, "_v1Options");
      this._v1Options = r;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return Rt(this.defaultOptions ?? {});
    }
    activateListeners(a) {
    }
    async _renderHTML(a, r) {
      var u, c, m;
      const s = typeof this.getData == "function" ? await this.getData() : {}, i = ((u = this._v1Options) == null ? void 0 : u.template) ?? ((c = this.options) == null ? void 0 : c.template) ?? ((m = this.constructor.defaultOptions) == null ? void 0 : m.template);
      if (!i) return document.createDocumentFragment();
      const o = await globalThis.renderTemplate(i, s), l = document.createElement("template");
      return l.innerHTML = o.trim(), l.content;
    }
    _activateV1Form(a) {
      var s, i;
      if (typeof this._updateObject != "function") return;
      const r = (s = a.matches) != null && s.call(a, "form") ? a : (i = a.querySelector) == null ? void 0 : i.call(a, "form");
      r instanceof HTMLFormElement && r.addEventListener("submit", async (o) => {
        var u;
        o.preventDefault(), o.stopPropagation();
        const l = new FormData(r);
        await this._updateObject(o, l), ((u = this._v1Options) == null ? void 0 : u.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(a, r, s) {
      var c, m, f, b;
      r.replaceChildren(a);
      const i = globalThis.jQuery ?? globalThis.$, o = ((c = r.closest) == null ? void 0 : c.call(r, ".window-app, .app, .application")) ?? r, l = i ? i(o) : o;
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
      const u = (m = this._v1Options) == null ? void 0 : m.classes;
      Array.isArray(u) && u.length && (r.classList.add(...u), (b = (f = r.closest) == null ? void 0 : f.call(r, ".window-app, .app, .application")) == null || b.classList.add(...u)), this._activateV1Form(r), typeof this.activateListeners == "function" && this.activateListeners(i ? i(r) : r);
    }
  };
}
function Rn() {
  const e = qt(), t = Vt(), n = globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (n) return n;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? jt(a) : null;
}
function On() {
  const e = qt(), t = Vt(), n = globalThis.FormApplication ?? (t == null ? void 0 : t.FormApplication) ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (n) return n;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? jt(a) : Rn();
}
function Ln() {
  var n, a, r, s, i, o;
  const e = ((a = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : a.api) ?? ((r = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : r.api) ?? null, t = ((i = (s = globalThis.foundry) == null ? void 0 : s.applications) == null ? void 0 : i.api) ?? ((o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function _n(e) {
  var A, k, W, le;
  const {
    moduleId: t,
    templatePath: n,
    composerTemplatePath: a,
    contactsTemplatePath: r,
    messagesTemplatePath: s,
    phoneTemplatePath: i,
    escapeHTML: o,
    getDefaultComposerData: l,
    getActorChoices: u,
    getPlayerChoices: c,
    getContacts: m,
    getGroupContacts: f,
    getMessageContext: b,
    getCallHistory: I,
    bindPhoneNavigation: d,
    getRingtoneChoices: p,
    getMessageSoundOptions: S,
    getSoundPath: G,
    getActiveContactsTab: T,
    getContactsPlayerChoices: E,
    getSelectedContactsPlayerId: P,
    getAssignedContacts: _,
    canEditContactImages: K,
    bindCallControls: ae,
    bindComposerControls: L,
    bindContactsControls: re,
    bindMessagesControls: D,
    stopRinging: B,
    clearActiveCall: z,
    clearActiveComposer: Y,
    clearActiveContacts: ke,
    clearActiveMessages: J,
    clearActivePhone: Ee
  } = e, Q = (k = (A = foundry == null ? void 0 : foundry.applications) == null ? void 0 : A.api) == null ? void 0 : k.ApplicationV2, X = (le = (W = foundry == null ? void 0 : foundry.applications) == null ? void 0 : W.api) == null ? void 0 : le.HandlebarsApplicationMixin, be = Ln(), ye = Dn();
  function we() {
    var R, Ze;
    const w = m(), N = f(), y = T(), C = P(), { unreadCount: M } = b();
    return {
      contacts: w,
      groupContacts: N,
      hasContacts: w.length > 0,
      hasGroupContacts: N.length > 0,
      activeTab: y,
      isPersonalTab: y === "personal",
      isPlayerTab: y === "player",
      players: E(),
      assignedContacts: (R = game.user) != null && R.isGM ? _(C) : [],
      hideContactEditor: y === "player" && !C,
      isGroupTab: y === "group",
      canEditContactImages: K(),
      canManageNpcContacts: K(),
      actors: u(),
      unreadMessageCount: M,
      hasUnreadMessages: M > 0,
      ringtoneChoices: p(),
      messageSoundOptions: (Ze = game.user) != null && Ze.isGM ? [] : S(),
      currentRingtone: G()
    };
  }
  function Pe() {
    const w = l();
    return {
      call: w,
      previewCall: ie({ ...w, fullscreen: !1 }),
      actors: u(),
      players: c(),
      ringtoneChoices: p()
    };
  }
  function Ue(w, N = null, y = null) {
    if (y) return { call: y, isCallScreen: !0 };
    const C = w === "messages", M = w === "history", R = w === "settings", Ze = !C && !M && !R;
    return {
      ...C ? b(N) : we(),
      mode: w,
      inPhone: !0,
      isMessagesMode: C,
      isHistoryMode: M,
      isSettingsMode: R,
      isContactsMode: Ze,
      history: M ? I() : []
    };
  }
  let Ie;
  async function he() {
    var y, C;
    const w = (y = foundry == null ? void 0 : foundry.applications) == null ? void 0 : y.handlebars, N = ((C = w == null ? void 0 : w.loadTemplates) == null ? void 0 : C.bind(w)) ?? globalThis.loadTemplates;
    Ie ?? (Ie = Promise.resolve(N([
      n,
      r,
      s
    ])).catch((M) => {
      throw Ie = void 0, M;
    })), await Ie;
  }
  function Be(w) {
    return w.isCallScreen ? ot(w.call, o) : w.isMessagesMode ? lt(w, o) : ct(w, o);
  }
  function ce(w) {
    const N = document.createElement("template");
    N.innerHTML = w.trim();
    const y = N.content.firstElementChild;
    return {
      main: y instanceof HTMLElement ? y : document.createElement("div")
    };
  }
  function De(w, N = null) {
    if (w.callData) {
      ae(w, N);
      return;
    }
    d(w, N), w.mode === "messages" ? D(w, N) : re(w, N);
  }
  class je extends be {
    constructor(y, C = {}) {
      super(C);
      O(this, "callData");
      this.callData = ie(y);
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
    async _renderInner(y) {
      try {
        return await super._renderInner(y);
      } catch (C) {
        return console.warn(`${t} | Template render failed, using inline fallback.`, C), $(ot(this.callData, o));
      }
    }
    activateListeners(y) {
      super.activateListeners(y), ae(this, y);
    }
    async close(y) {
      return z(this), B(), super.close(y);
    }
  }
  class ze extends be {
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
      return Pe();
    }
    async _renderInner(N) {
      try {
        return await he(), await super._renderInner(N);
      } catch (y) {
        return console.warn(`${t} | Composer template render failed, using inline fallback.`, y), $(Dt(N, o));
      }
    }
    activateListeners(N) {
      super.activateListeners(N), L(this, N);
    }
    async close(N) {
      return Y(this), super.close(N);
    }
  }
  class We extends be {
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
      return we();
    }
    async _renderInner(N) {
      try {
        return await super._renderInner(N);
      } catch (y) {
        return console.warn(`${t} | Contacts template render failed, using inline fallback.`, y), $(ct(N, o));
      }
    }
    activateListeners(N) {
      super.activateListeners(N), re(this, N);
    }
    async close(N) {
      return ke(this), super.close(N);
    }
  }
  class He extends be {
    constructor(y = "calls", C = null, M = {}) {
      super(M);
      O(this, "mode");
      O(this, "contact");
      O(this, "callData", null);
      this.mode = y, this.contact = C;
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
      return Ue(this.mode, this.contact, this.callData);
    }
    async _renderInner(y) {
      try {
        return await he(), await super._renderInner(y);
      } catch (C) {
        return console.warn(`${t} | Phone template render failed, using inline fallback.`, C), $(Be(y));
      }
    }
    activateListeners(y) {
      super.activateListeners(y), De(this, y);
    }
    async close(y) {
      return Ee(this), super.close(y);
    }
  }
  class Ke extends be {
    constructor(y = null, C = {}) {
      super(C);
      O(this, "contact");
      this.contact = y;
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
    async _renderInner(y) {
      try {
        return await super._renderInner(y);
      } catch (C) {
        return console.warn(`${t} | Messages template render failed, using inline fallback.`, C), $(lt(y, o));
      }
    }
    activateListeners(y) {
      super.activateListeners(y), D(this, y);
    }
    async close(y) {
      return J(this), super.close(y);
    }
  }
  function Ye() {
    var w;
    return !ye || !Q || !X ? null : (w = class extends X(Q) {
      constructor(C, M = {}) {
        super(M);
        O(this, "callData");
        this.callData = ie(C);
      }
      async _prepareContext(C) {
        return {
          ...await super._prepareContext(C),
          call: this.callData
        };
      }
      async _renderHTML(C, M) {
        try {
          return await super._renderHTML(C, M);
        } catch (R) {
          return console.warn(`${t} | Template render failed, using inline fallback.`, R), ce(ot(this.callData, o));
        }
      }
      _onRender(C, M) {
        var R;
        (R = super._onRender) == null || R.call(this, C, M), ae(this);
      }
      async close(C) {
        return z(this), B(), super.close(C);
      }
    }, O(w, "DEFAULT_OPTIONS", {
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
    }), O(w, "PARTS", {
      main: {
        template: n
      }
    }), w);
  }
  function Je() {
    var w;
    return !ye || !Q || !X ? null : (w = class extends X(Q) {
      async _prepareContext(y) {
        return {
          ...await super._prepareContext(y),
          ...Pe()
        };
      }
      async _renderHTML(y, C) {
        try {
          return await he(), await super._renderHTML(y, C);
        } catch (M) {
          return console.warn(`${t} | Composer template render failed, using inline fallback.`, M), ce(Dt(y, o));
        }
      }
      _onRender(y, C) {
        var M;
        (M = super._onRender) == null || M.call(this, y, C), L(this);
      }
      async close(y) {
        return Y(this), super.close(y);
      }
    }, O(w, "DEFAULT_OPTIONS", {
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
    }), O(w, "PARTS", {
      main: {
        template: a
      }
    }), w);
  }
  function Qe() {
    var w;
    return !ye || !Q || !X ? null : (w = class extends X(Q) {
      async _prepareContext(y) {
        return {
          ...await super._prepareContext(y),
          ...we()
        };
      }
      async _renderHTML(y, C) {
        try {
          return await super._renderHTML(y, C);
        } catch (M) {
          return console.warn(`${t} | Contacts template render failed, using inline fallback.`, M), ce(ct(y, o));
        }
      }
      _onRender(y, C) {
        var M;
        (M = super._onRender) == null || M.call(this, y, C), re(this);
      }
      async close(y) {
        return ke(this), super.close(y);
      }
    }, O(w, "DEFAULT_OPTIONS", {
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
    }), O(w, "PARTS", {
      main: {
        template: r
      }
    }), w);
  }
  function Se() {
    var w;
    return !ye || !Q || !X ? null : (w = class extends X(Q) {
      constructor(C = "calls", M = null, R = {}) {
        super(R);
        O(this, "mode");
        O(this, "contact");
        O(this, "callData", null);
        this.mode = C, this.contact = M;
      }
      async _prepareContext(C) {
        return {
          ...await super._prepareContext(C),
          ...Ue(this.mode, this.contact, this.callData)
        };
      }
      async _renderHTML(C, M) {
        try {
          return await he(), await super._renderHTML(C, M);
        } catch (R) {
          return console.warn(`${t} | Phone template render failed, using inline fallback.`, R), ce(Be(C));
        }
      }
      _onRender(C, M) {
        var R;
        (R = super._onRender) == null || R.call(this, C, M), De(this);
      }
      async close(C) {
        return Ee(this), super.close(C);
      }
    }, O(w, "DEFAULT_OPTIONS", {
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
    }), O(w, "PARTS", {
      main: {
        template: i
      }
    }), w);
  }
  function Xe() {
    var w;
    return !ye || !Q || !X ? null : (w = class extends X(Q) {
      constructor(C = null, M = {}) {
        super(M);
        O(this, "contact");
        this.contact = C;
      }
      async _prepareContext(C) {
        return {
          ...await super._prepareContext(C),
          ...b(this.contact)
        };
      }
      async _renderHTML(C, M) {
        try {
          return await super._renderHTML(C, M);
        } catch (R) {
          return console.warn(`${t} | Messages template render failed, using inline fallback.`, R), ce(lt(C, o));
        }
      }
      _onRender(C, M) {
        var R;
        (R = super._onRender) == null || R.call(this, C, M), D(this);
      }
      async close(C) {
        return J(this), super.close(C);
      }
    }, O(w, "DEFAULT_OPTIONS", {
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
    }), O(w, "PARTS", {
      main: {
        template: s
      }
    }), w);
  }
  return {
    CyberCallApplication: Ye() ?? je,
    CyberCallComposer: Je() ?? ze,
    CyberCallContacts: Qe() ?? We,
    CyberCallMessages: Xe() ?? Ke,
    CyberCallPhone: Se() ?? He
  };
}
const g = "cybercall", fe = `module.${g}`, Fn = `modules/${g}/templates/cybercall.hbs`, xn = `modules/${g}/templates/cybercall-composer.hbs`, qn = `modules/${g}/templates/cybercall-contacts.hbs`, Vn = `modules/${g}/templates/cybercall-messages.hbs`, jn = `modules/${g}/templates/cybercall-phone.hbs`, zn = `modules/${g}/templates/ringtone-settings.hbs`, Me = "phoneMessage", zt = 3, ft = {
  "": "Silent",
  [`modules/${g}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${g}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${g}/audio/Ringtone3.ogg`]: "Ringtone 3"
}, Wt = `modules/${g}/audio/Ringtone1.ogg`, Wn = On();
function Ht(e) {
  var n;
  const t = ((n = e.split("/").pop()) == null ? void 0 : n.replace(/\.[^.]+$/, "")) ?? "Custom ringtone";
  try {
    return decodeURIComponent(t);
  } catch {
    return t;
  }
}
function ge(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set();
  return e.flatMap((n) => {
    const a = String((n == null ? void 0 : n.path) ?? "").trim();
    return !a || t.has(a) ? [] : (t.add(a), [{ label: String((n == null ? void 0 : n.label) ?? "").trim() || Ht(a), path: a }]);
  });
}
function bt() {
  var n, a, r, s, i, o, l, u, c;
  const e = globalThis.foundry;
  return [
    typeof FilePicker < "u" ? FilePicker : null,
    globalThis.FilePicker,
    (r = (a = (n = e == null ? void 0 : e.applications) == null ? void 0 : n.apps) == null ? void 0 : a.FilePicker) == null ? void 0 : r.implementation,
    (i = (s = e == null ? void 0 : e.applications) == null ? void 0 : s.apps) == null ? void 0 : i.FilePicker,
    (l = (o = e == null ? void 0 : e.applications) == null ? void 0 : o.api) == null ? void 0 : l.FilePicker,
    (c = (u = e == null ? void 0 : e.appv1) == null ? void 0 : u.api) == null ? void 0 : c.FilePicker
  ].find((m) => typeof m == "function") ?? null;
}
function Hn(e, t) {
  var a;
  const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? ((a = e.element) == null ? void 0 : a[0]) ?? e.element ?? null;
  return n instanceof HTMLElement ? n : null;
}
function Kn(e) {
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
class Kt extends Wn {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-ringtone-settings",
      title: "CyberCall Ringtones",
      template: zn,
      classes: ["cybercall-ringtone-settings-app"],
      width: 680,
      height: "auto",
      resizable: !0,
      closeOnSubmit: !0
    });
  }
  getData() {
    return {
      ringtones: ge(game.settings.get(g, "customRingtones"))
    };
  }
  activateListeners(t) {
    var r;
    super.activateListeners(t);
    const n = Hn(this, t), a = n == null ? void 0 : n.querySelector("[data-ringtone-list]");
    !n || !a || ((r = n.querySelector("[data-ringtone-add]")) == null || r.addEventListener("click", () => {
      var i;
      const s = Kn(a.querySelectorAll("[data-ringtone-row]").length);
      (i = a.querySelector("[data-ringtone-empty]")) == null || i.before(s);
    }), n.addEventListener("click", (s) => {
      var b, I, d, p, S, G;
      const i = s.target, o = (b = i == null ? void 0 : i.closest) == null ? void 0 : b.call(i, "[data-ringtone-remove]");
      if (o) {
        (I = o.closest("[data-ringtone-row]")) == null || I.remove();
        return;
      }
      const l = (d = i == null ? void 0 : i.closest) == null ? void 0 : d.call(i, "[data-ringtone-browse]");
      if (!l) return;
      const u = l.closest("[data-ringtone-row]"), c = u == null ? void 0 : u.querySelector("[data-ringtone-path]"), m = bt();
      if (!c || !m) {
        (S = (p = ui.notifications) == null ? void 0 : p.warn) == null || S.call(p, "Foundry FilePicker is unavailable.");
        return;
      }
      const f = new m({
        type: "audio",
        current: c.value,
        callback: (T) => {
          c.value = T;
          const E = u == null ? void 0 : u.querySelector("[data-ringtone-label]");
          E && !E.value.trim() && (E.value = Ht(T));
        }
      });
      typeof f.browse == "function" ? f.browse() : (G = f.render) == null || G.call(f, !0);
    }));
  }
  async _updateObject(t) {
    var r, s;
    const a = [...t.currentTarget.querySelectorAll("[data-ringtone-row]")].map((i) => {
      var o, l;
      return {
        label: ((o = i.querySelector("[data-ringtone-label]")) == null ? void 0 : o.value) ?? "",
        path: ((l = i.querySelector("[data-ringtone-path]")) == null ? void 0 : l.value) ?? ""
      };
    });
    await game.settings.set(g, "customRingtones", ge(a)), (s = (r = ui.notifications) == null ? void 0 : r.info) == null || s.call(r, "CyberCall ringtones saved.");
  }
}
function Le() {
  var n, a;
  const e = ((n = game.user) == null ? void 0 : n.getFlag(g, "messageSound")) ?? {}, t = (a = game.user) != null && a.isGM || game.settings.get(g, "shareMessageSounds") !== !1 ? ge(game.settings.get(g, "customMessageSounds")) : [];
  return ge([
    ...e.path ? [{ label: e.label || "My uploaded sound", path: e.path }] : [],
    ...t
  ]);
}
function yt() {
  var t, n;
  const e = (n = (t = game.user) == null ? void 0 : t.getFlag(g, "messageSound")) == null ? void 0 : n.selected;
  return Le().some((a) => a.path === e) ? e : "";
}
function Yn() {
  const e = yt();
  return [
    { value: "", label: "Built-in notification tone", selected: !e },
    ...Le().map(({ path: t, label: n }) => ({ value: t, label: n, selected: t === e }))
  ];
}
async function Jn(e) {
  if (e && !Le().some((n) => n.path === e)) return;
  const t = game.user.getFlag(g, "messageSound") ?? {};
  await game.user.setFlag(g, "messageSound", { ...t, selected: e });
}
function ut() {
  var e, t, n;
  return ((e = game.user) == null ? void 0 : e.isGM) || ((n = (t = game.user) == null ? void 0 : t.can) == null ? void 0 : n.call(t, "FILES_BROWSE")) === !0;
}
class Qn extends Kt {
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      id: "cybercall-message-sound-settings",
      title: "CyberCall Message Notification Sounds",
      template: `modules/${g}/templates/message-sound-settings.hbs`
    };
  }
  getData() {
    var a, r, s, i, o;
    const t = ((a = game.user) == null ? void 0 : a.getFlag(g, "messageSound")) ?? {}, n = yt();
    return {
      isGM: ((r = game.user) == null ? void 0 : r.isGM) === !0,
      shareSounds: game.settings.get(g, "shareMessageSounds") !== !1,
      canChooseFile: ut(),
      canUpload: ((s = game.user) == null ? void 0 : s.isGM) || ((o = (i = game.user) == null ? void 0 : i.can) == null ? void 0 : o.call(i, "FILES_UPLOAD")) === !0,
      personal: t,
      usePersonal: !!t.path && n === t.path,
      useDefault: !n,
      sounds: Le().filter((l) => l.path !== t.path).map((l) => ({ ...l, selected: n === l.path })),
      ringtones: ge(game.settings.get(g, "customMessageSounds"))
    };
  }
  activateListeners(t) {
    var o;
    super.activateListeners(t);
    const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? ((o = this.element) == null ? void 0 : o[0]) ?? this.element, a = n == null ? void 0 : n.querySelector("[data-message-sound-selection]"), r = n == null ? void 0 : n.querySelector("[data-personal-sound]"), s = n == null ? void 0 : n.querySelector("[data-message-sound-browse]");
    if (!a || !r || !s) return;
    const i = () => {
      r.disabled = s.disabled = a.value === "";
    };
    a.addEventListener("change", i), i(), s.addEventListener("click", () => {
      var c, m, f;
      if (s.disabled || !ut()) return;
      const l = bt();
      if (!l) return (m = (c = ui.notifications) == null ? void 0 : c.warn) == null ? void 0 : m.call(c, "Foundry FilePicker is unavailable.");
      const u = new l({
        type: "audio",
        current: r.value,
        callback: (b) => {
          r.value = b, a.value = "personal", i();
        }
      });
      typeof u.browse == "function" ? u.browse() : (f = u.render) == null || f.call(u, !0);
    });
  }
  async _updateObject(t) {
    var l, u, c, m, f;
    const n = t.currentTarget, a = game.user.getFlag(g, "messageSound") ?? {}, r = ut() ? ((l = n.querySelector("[data-personal-sound]")) == null ? void 0 : l.value.trim()) ?? "" : a.path ?? "";
    if (game.user.isGM) {
      const b = [...n.querySelectorAll("[data-ringtone-row]")].map((I) => {
        var d, p;
        return {
          label: (d = I.querySelector("[data-ringtone-label]")) == null ? void 0 : d.value,
          path: (p = I.querySelector("[data-ringtone-path]")) == null ? void 0 : p.value
        };
      });
      r && r !== a.path && b.push({ label: "", path: r }), await game.settings.set(g, "customMessageSounds", ge(b)), await game.settings.set(g, "shareMessageSounds", ((u = n.querySelector("[data-share-message-sounds]")) == null ? void 0 : u.checked) === !0);
    }
    const s = ((c = n.querySelector("[data-message-sound-selection]")) == null ? void 0 : c.value) ?? "", i = s === "personal" ? r : s, o = i === r || Le().some((b) => b.path === i);
    await game.user.setFlag(g, "messageSound", { path: r, selected: o ? i : "" }), (f = (m = ui.notifications) == null ? void 0 : m.info) == null || f.call(m, "CyberCall message notification sound saved.");
  }
}
function ve(e) {
  var n;
  if ((n = foundry == null ? void 0 : foundry.utils) != null && n.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
function U(e, t = "") {
  return String(e ?? t).trim();
}
function Ce(e) {
  return [...new Set(e.map((t) => U(t)).filter(Boolean))];
}
function Xn() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function Yt(e) {
  const t = U(e, "cybercall");
  let n = 0;
  for (let a = 0; a < t.length; a += 1)
    n = (n << 5) - n + t.charCodeAt(a) | 0;
  return `tone-${Math.abs(n) % 8 + 1}`;
}
function Ot(e, t) {
  return ["direct", ...[e, t].sort()].join(":");
}
function Zn() {
  return `msg-${Te()}`;
}
function ea(e = Te()) {
  return `group:${U(e)}`;
}
function qe(e, t = ((a) => (a = game == null ? void 0 : game.user) == null ? void 0 : a.id)(), n = {}) {
  const r = x(e), s = U(n.senderNumber) || U(n.senderActorId), i = s ? `contact:${s}` : `user:${U(t, "unknown")}`;
  if (e != null && e.userId)
    return Ot(i, `user:${U(e.userId)}`);
  const o = r.number || r.actorId || r.id || r.name;
  return Ot(i, `contact:${o}`);
}
function ht(e = {}) {
  var t;
  return {
    id: U(e.id) || Zn(),
    threadId: U(e.threadId) || qe({ number: ((t = e.recipientNumbers) == null ? void 0 : t[0]) ?? e.senderNumber }),
    senderUserId: U(e.senderUserId),
    senderActorId: U(e.senderActorId),
    senderName: U(e.senderName, "Unknown Sender"),
    senderNumber: U(e.senderNumber),
    senderImage: U(e.senderImage),
    recipientUserIds: Ce(e.recipientUserIds ?? []),
    recipientActorIds: Ce(e.recipientActorIds ?? []),
    recipientNumbers: Ce(e.recipientNumbers ?? []),
    contactName: U(e.contactName),
    contactImage: U(e.contactImage),
    contactUserId: U(e.contactUserId),
    contactManagedByGM: e.contactManagedByGM === !0,
    contactIsNpc: e.contactIsNpc === !0,
    body: U(e.body),
    messageType: U(e.messageType, "text") || "text",
    eventType: U(e.eventType),
    conversationType: U(e.conversationType, e.groupId ? "group" : "direct") || "direct",
    groupId: U(e.groupId),
    groupName: U(e.groupName),
    groupMemberUserIds: Ce(e.groupMemberUserIds ?? []),
    groupMemberNames: Ce(e.groupMemberNames ?? []),
    createdAt: U(e.createdAt) || Xn(),
    chatMessageId: U(e.chatMessageId),
    schemaVersion: Number(e.schemaVersion ?? zt)
  };
}
function Jt(e, t = [], n = "", a = {}) {
  const r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (const o of t) {
    const l = x(o), u = { ...l, userId: o == null ? void 0 : o.userId, userIds: (o == null ? void 0 : o.userIds) ?? l.userIds };
    l.number && r.set(l.number, u), o != null && o.userId && s.set(String(o.userId), u);
  }
  const i = /* @__PURE__ */ new Map();
  for (const o of e.map(ht).filter((l) => l.body)) {
    const l = i.get(o.threadId) ?? [];
    l.push(o), i.set(o.threadId, l);
  }
  return [...i.entries()].map(([o, l]) => {
    var Pe, Ue, Ie, he, Be, ce, De, je, ze, We, He, Ke, Ye, Je, Qe, Se, Xe;
    const u = l.sort((A, k) => A.createdAt.localeCompare(k.createdAt)), c = u[u.length - 1] ?? null, m = [...u].reverse().find((A) => A.conversationType === "group" || A.groupId), f = !!m, b = (m == null ? void 0 : m.groupId) || (f ? o.replace(/^group:/, "") : ""), I = (m == null ? void 0 : m.groupName) || (f ? "Group Chat" : ""), d = f ? Ce(u.flatMap((A) => [
      ...A.groupMemberUserIds,
      A.senderUserId,
      ...A.recipientUserIds
    ])) : [], p = f ? Ce(u.flatMap((A) => A.groupMemberNames)) : [], S = p.length ? p : d.map((A) => {
      var k, W;
      return H((W = (k = game.users) == null ? void 0 : k.get) == null ? void 0 : W.call(k, A));
    }).filter(Boolean), G = (c == null ? void 0 : c.senderUserId) === ((Pe = game == null ? void 0 : game.user) == null ? void 0 : Pe.id) ? (Ue = c == null ? void 0 : c.recipientUserIds) == null ? void 0 : Ue.find((A) => {
      var k;
      return A !== ((k = game == null ? void 0 : game.user) == null ? void 0 : k.id);
    }) : c == null ? void 0 : c.senderUserId, T = (c == null ? void 0 : c.senderUserId) === ((Ie = game == null ? void 0 : game.user) == null ? void 0 : Ie.id) ? ((he = c == null ? void 0 : c.recipientNumbers) == null ? void 0 : he[0]) || "" : (c == null ? void 0 : c.senderNumber) || ((Be = c == null ? void 0 : c.recipientNumbers) == null ? void 0 : Be[0]) || "", E = c != null && c.contactName && !(c != null && c.contactUserId) && (c.contactIsNpc || c.contactManagedByGM) ? {
      id: `contact-${((ce = c.recipientNumbers) == null ? void 0 : ce[0]) || c.senderNumber || o}`,
      name: c.contactName,
      number: ((De = c.recipientNumbers) == null ? void 0 : De[0]) || c.senderNumber || "",
      image: c.contactImage || "",
      actorId: ((je = c.recipientActorIds) == null ? void 0 : je[0]) ?? c.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: se(c.contactName)
    } : null, P = (c == null ? void 0 : c.senderUserId) !== ((ze = game == null ? void 0 : game.user) == null ? void 0 : ze.id) && (c != null && c.senderNumber) && (c != null && c.contactName) ? {
      id: `contact-${c.senderNumber || o}`,
      name: c.contactName,
      number: c.senderNumber,
      image: c.contactImage || "",
      actorId: c.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: se(c.contactName)
    } : null, _ = [...u].reverse().find(
      (A) => {
        var k, W, le;
        return ((le = (W = (k = game.users) == null ? void 0 : k.get) == null ? void 0 : W.call(k, A.senderUserId)) == null ? void 0 : le.isGM) === !0 && A.contactIsNpc && A.senderNumber && A.senderName === A.contactName && A.contactUserId;
      }
    ), K = _ ? x({
      id: `contact-${_.senderNumber}`,
      name: _.senderName,
      number: _.senderNumber,
      image: _.senderImage,
      actorId: _.senderActorId,
      managedByGM: !0,
      isNpc: !0
    }) : null, L = (f ? {
      id: `group-${b || o}`,
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
      initials: se(I)
    } : null) ?? E ?? K ?? P ?? s.get(G) ?? r.get(T) ?? {
      id: `contact-${T || o}`,
      name: (c == null ? void 0 : c.contactName) || ((c == null ? void 0 : c.senderUserId) === ((We = game == null ? void 0 : game.user) == null ? void 0 : We.id) ? T || "Unknown Contact" : (c == null ? void 0 : c.senderName) || T || "Unknown Contact"),
      number: T,
      image: (c == null ? void 0 : c.contactImage) || "",
      actorId: ((He = c == null ? void 0 : c.recipientActorIds) == null ? void 0 : He[0]) ?? "",
      userId: "",
      userIds: [],
      managedByGM: !!(c != null && c.contactName || (Ke = c == null ? void 0 : c.recipientActorIds) != null && Ke[0]),
      isNpc: !!(c != null && c.contactName || (Ye = c == null ? void 0 : c.recipientActorIds) != null && Ye[0]),
      initials: se((c == null ? void 0 : c.contactName) || (c == null ? void 0 : c.senderName) || T)
    }, re = f ? null : [...u].reverse().find(
      (A) => A.senderUserId === G && A.senderImage
    ), D = [...u].reverse().find((A) => {
      var W, le;
      const k = (le = (W = game.users) == null ? void 0 : W.get) == null ? void 0 : le.call(W, A.senderUserId);
      return A.senderUserId && (k == null ? void 0 : k.isGM) !== !0 && !A.contactUserId && !!A.contactName && (A.contactIsNpc || A.contactManagedByGM);
    }) ?? null, B = ((Je = game == null ? void 0 : game.user) == null ? void 0 : Je.isGM) === !0 ? D : null, z = ((Qe = game == null ? void 0 : game.user) == null ? void 0 : Qe.isGM) === !0 ? _ == null ? void 0 : _.contactUserId : "", Y = s.get(z), ke = B || z ? `TO: ${L.name}` : "", J = B ? s.get(B.senderUserId) : null, Ee = (B == null ? void 0 : B.senderName) || (J == null ? void 0 : J.name) || (Y == null ? void 0 : Y.name) || (z ? H((Xe = (Se = game.users) == null ? void 0 : Se.get) == null ? void 0 : Xe.call(Se, z)) : "") || L.name || (c == null ? void 0 : c.senderName) || "Unknown Contact", Q = B ? (J == null ? void 0 : J.number) || `@${B.senderName}` : L.number || (c == null ? void 0 : c.senderNumber) || "", X = B ? se(Ee) : L.initials || se(L.name || (c == null ? void 0 : c.senderName)), be = (B == null ? void 0 : B.senderImage) || (J == null ? void 0 : J.image) || (re == null ? void 0 : re.senderImage) || L.image || "", ye = a[o] ?? "", we = u.filter(
      (A) => {
        var k;
        return A.senderUserId !== ((k = game == null ? void 0 : game.user) == null ? void 0 : k.id) && A.createdAt > ye;
      }
    );
    return {
      id: o,
      title: Ee,
      subtitle: Q,
      initials: X,
      image: be,
      avatarTone: Yt(f ? b || o : (B == null ? void 0 : B.senderUserId) || L.userId || L.number || o),
      routeLabel: ke,
      hasRouteLabel: !!ke,
      isNpcRouted: !!(D || _),
      contact: L,
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
      active: o === n,
      isGroup: f,
      groupId: b,
      groupName: I,
      groupMemberUserIds: d,
      groupMemberNames: S
    };
  }).sort((o, l) => l.updatedAt.localeCompare(o.updatedAt));
}
const _e = "playerContactDirectory";
function ta(e) {
  var n, a, r;
  const t = (n = e.getFlag(g, _e)) == null ? void 0 : n.playerId;
  return !!(t && ((a = game.user) != null && a.isGM || ((r = game.user) == null ? void 0 : r.id) === t));
}
function Qt(e) {
  var t, n, a, r;
  return !e || !((t = game.user) != null && t.isGM) && ((n = game.user) == null ? void 0 : n.id) !== e ? null : ((r = (a = game.journal) == null ? void 0 : a.contents) == null ? void 0 : r.find(
    (s) => {
      var i;
      return ((i = s.getFlag(g, _e)) == null ? void 0 : i.playerId) === e && s.testUserPermission(game.user, "OBSERVER");
    }
  )) ?? null;
}
function Ct(e) {
  var n, a;
  const t = ((a = (n = Qt(e)) == null ? void 0 : n.getFlag(g, _e)) == null ? void 0 : a.contacts) ?? {};
  return Object.values(t).map(x).filter((r) => r.name && r.number).sort((r, s) => r.name.localeCompare(s.name));
}
async function Xt(e, t, n = null) {
  var o, l;
  if (!((o = game.user) != null && o.isGM)) return;
  const a = (l = game.users) == null ? void 0 : l.get(e);
  if (!a || a.isGM) return;
  const r = Qt(e);
  if (!r) {
    if (!n) return;
    const u = game.journal.documentClass, c = CONST.DOCUMENT_OWNERSHIP_LEVELS;
    await u.create({
      name: `CyberCall Contacts · ${a.name}`,
      ownership: { default: c.NONE, [e]: c.OBSERVER },
      flags: { [g]: { [_e]: { playerId: e, contacts: { [t]: n } } } }
    }, { render: !1 });
    return;
  }
  const s = `flags.${g}.${_e}.contacts`, i = n ? t : `-=${t}`;
  await r.update({ [`${s}.${i}`]: n }, { render: !1 });
}
function na(e) {
  var n, a, r;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[g]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, g, "message"));
  return (t == null ? void 0 : t.kind) === Me ? t : ((r = t == null ? void 0 : t.message) == null ? void 0 : r.kind) === Me ? t.message : null;
}
function aa(e) {
  return String(e != null && e.timestamp ? new Date(e.timestamp).toISOString() : (e == null ? void 0 : e.createdTime) ?? "");
}
function ra() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => t.id);
}
function wt(e) {
  return [...new Set(e.map((t) => String(t ?? "").trim()).filter(Boolean))];
}
function sa(e) {
  const t = Array.isArray(e == null ? void 0 : e.whisper) ? e.whisper : [];
  return wt(t.map((n) => (n == null ? void 0 : n.id) ?? n));
}
function ia(e, t) {
  var s, i;
  const n = String(((s = game.user) == null ? void 0 : s.id) ?? "").trim();
  if (!n) return !1;
  if (e.senderUserId === n || e.recipientUserIds.includes(n)) return !0;
  if (((i = game.user) == null ? void 0 : i.isGM) === !0)
    return !e.contactUserId && (e.contactManagedByGM || e.contactIsNpc) ? !0 : game.settings.get(g, "gmViewPlayerMessages") === !0;
  const r = sa(t);
  return r.length && !r.includes(n), !1;
}
function oa(e) {
  const t = Array.isArray(e == null ? void 0 : e.userIds) ? e.userIds : e != null && e.userId ? [e.userId] : [], n = wt(t);
  return n.length ? n : ra();
}
function ca(e) {
  return !!(e != null && e.userId || Array.isArray(e == null ? void 0 : e.userIds) && e.userIds.length);
}
function la(e, t) {
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
function ua() {
  var t;
  return (((t = game.messages) == null ? void 0 : t.contents) ?? []).map((n) => {
    const a = na(n);
    if (!a) return null;
    const r = ht({
      ...a,
      chatMessageId: n.id,
      createdAt: a.createdAt || aa(n)
    });
    return ia(r, n) ? r : null;
  }).filter(Boolean);
}
async function It(e, t, n = {}) {
  var I;
  const a = x(e), r = String(t ?? "").trim();
  if (!r) return null;
  const s = game.user, i = n.recipientUserIds ? wt(n.recipientUserIds) : oa(e), o = !ca(e), l = String(n.threadId ?? qe(e, s == null ? void 0 : s.id, n)), u = String(n.senderName ?? "").trim() || H(s, "Unknown Sender"), c = String(n.senderActorId ?? ((I = s == null ? void 0 : s.character) == null ? void 0 : I.id) ?? "").trim(), m = String(n.senderNumber ?? "").trim(), f = ht({
    threadId: l,
    senderUserId: (s == null ? void 0 : s.id) ?? "",
    senderActorId: c,
    senderName: u,
    senderNumber: m,
    senderImage: String(n.senderImage ?? xe(s)).trim(),
    recipientUserIds: i,
    recipientActorIds: a.actorId ? [a.actorId] : [],
    recipientNumbers: n.recipientNumbers ?? (a.number ? [a.number] : []),
    contactName: String(n.contactName ?? a.name ?? ""),
    contactImage: String(n.contactImage ?? a.image ?? ""),
    contactUserId: String(n.contactUserId ?? a.userId ?? ""),
    contactManagedByGM: n.contactManagedByGM ?? (a.managedByGM === !0 || o),
    contactIsNpc: n.contactIsNpc ?? (a.isNpc === !0 || o),
    body: r,
    messageType: String(n.messageType ?? "text"),
    eventType: String(n.eventType ?? ""),
    conversationType: String(n.conversationType ?? "direct"),
    groupId: String(n.groupId ?? ""),
    groupName: String(n.groupName ?? ""),
    groupMemberUserIds: n.groupMemberUserIds ?? [],
    groupMemberNames: n.groupMemberNames ?? [],
    schemaVersion: zt
  }), b = [...new Set([s == null ? void 0 : s.id, ...i].filter(Boolean))];
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: f.senderName }),
    whisper: b,
    content: la(f, a),
    flags: {
      [g]: {
        kind: Me,
        ...f
      }
    }
  });
}
async function da(e, t, n = {}) {
  return It(e, t, {
    ...n,
    messageType: n.messageType ?? "event"
  });
}
let h = null, v = null, Z = null, Ae = null, te = null, ue = "personal", Zt = "", F = "", ee = !1, j = !1, de = null, dt = 0, Ne = null;
function ga() {
  var e, t, n, a, r, s, i, o;
  return ie({
    callerName: ((e = h == null ? void 0 : h.callData) == null ? void 0 : e.callerName) ?? V.callerName,
    subtitle: ((t = h == null ? void 0 : h.callData) == null ? void 0 : t.subtitle) ?? V.subtitle,
    image: ((n = h == null ? void 0 : h.callData) == null ? void 0 : n.image) ?? "",
    message: ((a = h == null ? void 0 : h.callData) == null ? void 0 : a.message) ?? V.message,
    signal: ((r = h == null ? void 0 : h.callData) == null ? void 0 : r.signal) ?? game.settings.get(g, "defaultSignal"),
    variant: ((s = h == null ? void 0 : h.callData) == null ? void 0 : s.variant) ?? "standard",
    fullscreen: ((i = h == null ? void 0 : h.callData) == null ? void 0 : i.fullscreen) ?? !1,
    ringing: ((o = h == null ? void 0 : h.callData) == null ? void 0 : o.ringing) ?? !0
  });
}
function ma() {
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
    name: H(t, "Unknown Player"),
    active: t.active === !0
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function pa() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => {
    var n;
    return !t.isGM && t.id !== ((n = game.user) == null ? void 0 : n.id);
  }).map((t) => ({
    id: String(t.id),
    name: H(t, "Unknown Player"),
    active: t.active === !0
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function fa() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => {
    var n;
    return t.id !== ((n = game.user) == null ? void 0 : n.id);
  }).map((t) => {
    const n = H(t, "Unknown Player");
    return {
      id: `user-${t.id}`,
      name: n,
      number: `@${n}`,
      image: xe(t),
      userId: t.id,
      userIds: [t.id],
      isNpc: !1,
      managedByGM: !1
    };
  }).sort((t, n) => t.name.localeCompare(n.name));
}
function Ge() {
  var e, t;
  return String(((e = game.world) == null ? void 0 : e.id) ?? ((t = game.world) == null ? void 0 : t.title) ?? "default");
}
function tn() {
  const e = game.settings.get(g, "contacts");
  return Array.isArray(e) ? { [Ge()]: e } : !e || typeof e != "object" ? {} : e;
}
function St() {
  const e = tn()[Ge()];
  return Array.isArray(e) ? e.map(x).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function rt() {
  var t, n;
  const e = (t = game.user) != null && t.isGM ? [] : Ct((n = game.user) == null ? void 0 : n.id);
  return [
    ...St(),
    ...e.map((a) => ({ ...a, assignedToPlayer: !0 }))
  ].sort((a, r) => a.name.localeCompare(r.name));
}
function nn() {
  var n;
  if (!((n = game.user) != null && n.isGM)) return [];
  const e = en(), t = e.find((a) => a.id === Zt) ?? e[0];
  return e.map((a) => ({ ...a, selected: a.id === (t == null ? void 0 : t.id) }));
}
function Ve() {
  var e;
  return ((e = nn().find((t) => t.selected)) == null ? void 0 : e.id) ?? "";
}
function ba(e) {
  return e === "player" ? Ct(Ve()) : e === "group" ? me() : rt();
}
function me() {
  if (Array.isArray(Ne))
    return Ne.map(x).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name));
  const e = game.settings.get(g, "groupContacts");
  return Array.isArray(e) ? e.map(x).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function vt() {
  const e = /* @__PURE__ */ new Map();
  for (const t of [...fa(), ...me(), ...rt()]) {
    const n = t.userId ? `user:${t.userId}` : `number:${t.number || t.id}`;
    e.has(n) || e.set(n, t);
  }
  return [...e.values()].sort((t, n) => t.name.localeCompare(n.name));
}
async function an(e) {
  await game.settings.set(g, "contacts", {
    ...tn(),
    [Ge()]: e.map(x)
  });
}
async function nt(e) {
  Ne = e.map(x), await game.settings.set(g, "groupContacts", Ne), game.socket.emit(fe, {
    action: "groupContactsChanged",
    contacts: Ne
  });
}
function At() {
  const e = game.settings.get(g, "messageReadState");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function rn() {
  const e = game.settings.get(g, "messageDeletedBefore");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function Nt() {
  const e = game.settings.get(g, "npcThreadBindings");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
async function gt(e, t) {
  var a;
  if (!((a = game.user) != null && a.isGM) || !e) return;
  const n = { ...Nt() };
  t === null ? delete n[e] : n[e] = { ...n[e] ?? {}, ...t }, await game.settings.set(g, "npcThreadBindings", n);
}
function Mt() {
  const e = rn();
  return ua().filter((t) => {
    const n = e[t.threadId];
    return !n || t.createdAt > n;
  });
}
function sn() {
  return Jt(Mt(), vt(), "", At()).reduce((e, t) => e + Number(t.unreadCount ?? 0), 0);
}
async function ya(e, t = (/* @__PURE__ */ new Date()).toISOString()) {
  e && await game.settings.set(g, "messageReadState", {
    ...At(),
    [e]: t
  });
}
async function Oe() {
  F && await ya(F);
}
async function ha(e) {
  e && (await game.settings.set(g, "messageDeletedBefore", {
    ...rn(),
    [e]: (/* @__PURE__ */ new Date()).toISOString()
  }), F === e && (F = "", ee = !1, j = !1, te && (te.contact = null), (v == null ? void 0 : v.mode) === "messages" && (v.contact = null)), await q(), await ne());
}
async function Ca(e, t, n = "personal", a = "", r = {}) {
  var u, c, m, f, b, I, d, p;
  if (n === "player" && !((u = game.user) != null && u.isGM)) return !1;
  const s = r.actorId ? (c = game.actors) == null ? void 0 : c.get(r.actorId) : null, i = x({
    id: r.id || void 0,
    name: String(e ?? "").trim() || (s == null ? void 0 : s.name),
    number: t,
    image: Re() && (String(a ?? "").trim() || (s == null ? void 0 : s.img)) || "",
    actorId: Re() ? r.actorId : "",
    managedByGM: Re() ? r.managedByGM === !0 : !1,
    isNpc: Re() ? r.isNpc === !0 || r.managedByGM === !0 || !!r.actorId : !1
  });
  if (!i.name || !i.number)
    return (f = (m = ui.notifications) == null ? void 0 : m.warn) == null || f.call(m, "Contact name and number are required."), !1;
  if (n === "player") {
    const S = Ve();
    return S ? (await Xt(S, i.id, i), !0) : !1;
  }
  if (n === "group" && !game.user.isGM)
    return r.id ? !1 : $t() ? (game.socket.emit(fe, {
      action: "groupContactAdd",
      contact: i
    }), (p = (d = ui.notifications) == null ? void 0 : d.info) == null || p.call(d, "Group contact update sent to the GM."), !0) : ((I = (b = ui.notifications) == null ? void 0 : b.warn) == null || I.call(b, "A GM must be connected to update group contacts."), !1);
  const o = n === "group" ? me() : St(), l = o.findIndex((S) => S.id === i.id);
  return l === -1 ? o.push(i) : o[l] = { ...o[l], ...i }, n === "group" ? await nt(o) : await an(o), await ne(), !0;
}
async function wa(e, t = "personal") {
  var n, a, r, s;
  if (t === "player") {
    await Xt(Ve(), e);
    return;
  } else if (t === "group") {
    if (!game.user.isGM) {
      if (!$t()) {
        (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(fe, {
        action: "groupContactRemove",
        contactId: e
      }), (s = (r = ui.notifications) == null ? void 0 : r.info) == null || s.call(r, "Group contact removal sent to the GM.");
      return;
    }
    await nt(me().filter((i) => i.id !== e));
  } else
    await an(St().filter((i) => i.id !== e));
  await ne();
}
function $t() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function st(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(g, "minimumRole");
  } catch (n) {
    console.warn(`${g} | Permission setting unavailable, using Player role fallback.`, n);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function Re(e = game.user) {
  return !!(e != null && e.isGM);
}
function oe(e, t = null) {
  var n;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (n = e == null ? void 0 : e.element) != null && n[0] ? e.element[0] : (e == null ? void 0 : e.element) ?? null;
}
const Ia = 24;
function on(e) {
  var s, i, o;
  const t = oe(e), n = (s = t == null ? void 0 : t.querySelector) == null ? void 0 : s.call(t, ".cybercall-message-log");
  if (!(n instanceof HTMLElement)) return null;
  const a = (i = t.querySelector) == null ? void 0 : i.call(t, "[data-cybercall-active-thread]"), r = n.scrollHeight - n.clientHeight - n.scrollTop;
  return {
    threadId: String(((o = a == null ? void 0 : a.dataset) == null ? void 0 : o.cybercallActiveThread) ?? ""),
    scrollTop: n.scrollTop,
    stickToBottom: r <= Ia
  };
}
function Sa(e, t) {
  var u;
  const n = t.querySelector(".cybercall-message-log");
  if (!(n instanceof HTMLElement)) return;
  const a = e == null ? void 0 : e._cybercallMessageScrollState, r = t.querySelector("[data-cybercall-active-thread]"), s = String(((u = r == null ? void 0 : r.dataset) == null ? void 0 : u.cybercallActiveThread) ?? ""), i = !a || a.scrollToBottom === !0 || a.stickToBottom === !0 || a.threadId !== s;
  delete e._cybercallMessageScrollState;
  const o = {};
  e._cybercallMessageScrollRestoreToken = o;
  const l = () => {
    if (e._cybercallMessageScrollRestoreToken !== o || !n.isConnected) return;
    const c = Math.max(0, n.scrollHeight - n.clientHeight);
    n.scrollTop = i ? c : Math.min(a.scrollTop, c);
  };
  l(), requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      l(), e._cybercallMessageScrollRestoreToken === o && delete e._cybercallMessageScrollRestoreToken;
    });
  });
}
function mt(e) {
  var a;
  const t = e.querySelector("[data-cybercall-active-thread]"), n = String(((a = t == null ? void 0 : t.dataset) == null ? void 0 : a.cybercallActiveThread) ?? "");
  return n ? `thread:${n}` : e.querySelector("form[data-cybercall-group-form]") ? "new-group" : "new-message";
}
function cn(e) {
  const t = oe(e);
  if (!(t instanceof HTMLElement)) return null;
  const n = t.querySelector("form[data-cybercall-group-form]");
  if (n) {
    const i = n.elements.namedItem("groupName");
    return {
      key: mt(t),
      groupName: (i == null ? void 0 : i.value) ?? "",
      memberUserIds: [...n.querySelectorAll('input[name="memberUserIds"]:checked')].map((o) => o.value)
    };
  }
  const a = t.querySelector("form[data-cybercall-message-form]");
  if (!a) return null;
  const r = a.elements.namedItem("body"), s = (i) => {
    var o;
    return ((o = a.elements.namedItem(i)) == null ? void 0 : o.value) ?? "";
  };
  return {
    key: mt(t),
    body: (r == null ? void 0 : r.value) ?? "",
    contactId: s("contactId"),
    replyAs: s("replyAs"),
    sendAs: s("sendAs"),
    bodyWasFocused: document.activeElement === r,
    selectionStart: (r == null ? void 0 : r.selectionStart) ?? null,
    selectionEnd: (r == null ? void 0 : r.selectionEnd) ?? null
  };
}
function va(e, t) {
  const n = e == null ? void 0 : e._cybercallMessageComposerState;
  if (delete e._cybercallMessageComposerState, !n || n.key !== mt(t)) return;
  const a = t.querySelector("form[data-cybercall-group-form]");
  if (a) {
    const o = a.elements.namedItem("groupName");
    o && (o.value = n.groupName ?? "");
    const l = new Set(n.memberUserIds ?? []);
    a.querySelectorAll('input[name="memberUserIds"]').forEach((u) => {
      u.checked = l.has(u.value);
    });
    return;
  }
  const r = t.querySelector("form[data-cybercall-message-form]");
  if (!r) return;
  const s = (o, l) => {
    const u = r.elements.namedItem(o);
    u && [...u instanceof HTMLSelectElement ? u.options : []].some((c) => c.value === l) && (u.value = l);
  };
  s("contactId", n.contactId), s("replyAs", n.replyAs), s("sendAs", n.sendAs);
  const i = r.elements.namedItem("body");
  i && (i.value = n.body ?? "", n.bodyWasFocused && requestAnimationFrame(() => {
    i.isConnected && (i.focus({ preventScroll: !0 }), n.selectionStart !== null && n.selectionEnd !== null && i.setSelectionRange(n.selectionStart, n.selectionEnd));
  }));
}
function Aa(e, t = null) {
  const n = oe(e, t);
  if (!n) return;
  const a = n.closest(".cybercall-app, .cybercall-phone-app") ?? oe(e);
  a == null || a.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), a == null || a.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), a == null || a.classList.toggle("cybercall-connected", e.callData.accepted), n.querySelectorAll("[data-cybercall-action]").forEach((r) => {
    r.addEventListener("click", async (s) => {
      const i = s.currentTarget.dataset.cybercallAction;
      if (i === "accept") {
        await za(e.callData.id);
        return;
      }
      if (i === "broadcast") {
        Ut({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (i === "decline" || i === "end") && await fn(e.callData.id);
    });
  });
}
function Na(e) {
  var n, a;
  const t = "form[data-cybercall-composer]";
  return (n = e == null ? void 0 : e.matches) != null && n.call(e, t) ? e : (a = e == null ? void 0 : e.querySelector) == null ? void 0 : a.call(e, t);
}
function pt(e) {
  var l, u;
  const t = new FormData(e), n = (l = game.actors) == null ? void 0 : l.get(t.get("actorId")), a = String(t.get("image") ?? "").trim() || (n == null ? void 0 : n.img) || "", r = String(t.get("callerName") ?? "").trim() || (n == null ? void 0 : n.name) || "UNKNOWN CALLER", s = t.getAll("targetUserIds").map((c) => String(c)).filter(Boolean), i = new Map((((u = game.users) == null ? void 0 : u.contents) ?? []).map((c) => [c.id, c])), o = s.map((c) => H(i.get(c)) || c);
  return ie({
    callerName: r,
    subtitle: String(t.get("subtitle") ?? "").trim(),
    image: a,
    message: String(t.get("message") ?? "").trim(),
    signal: t.get("signal"),
    variant: String(t.get("variant") ?? V.variant),
    fullscreen: t.get("fullscreen") === "on",
    ringing: t.get("ringing") === "on",
    targetUserIds: s,
    targetUserNames: o
  });
}
function tt(e) {
  const t = pt(e), n = e.querySelector("[data-cybercall-signal-output]");
  n && (n.textContent = `${t.signal}%`);
  const a = e.querySelector("[data-cybercall-live-preview]"), r = a == null ? void 0 : a.querySelector(".cybercall-panel");
  if (!r) return;
  a.classList.toggle("cybercall-preview-wide", t.fullscreen);
  for (const l of ["standard", "emergency", "corrupted"])
    r.classList.toggle(`cybercall-${l}`, t.variant === l);
  r.classList.toggle("cybercall-broadcast", t.fullscreen), r.classList.toggle("cybercall-ringing-panel", t.ringing), r.style.setProperty("--cybercall-signal", `${t.signal}%`), r.querySelector("[data-cybercall-preview-name]").textContent = t.callerName, r.querySelector("[data-cybercall-preview-subtitle]").textContent = t.subtitle, r.querySelector("[data-cybercall-preview-message]").textContent = t.message, r.querySelector("[data-cybercall-preview-signal]").textContent = `${t.signal}%`;
  const s = r.querySelector("[data-cybercall-preview-status]");
  s.querySelector("span").textContent = t.kicker, s.querySelector("i").className = `fa-solid ${t.isEmergency ? "fa-triangle-exclamation" : "fa-satellite-dish"}`;
  const i = r.querySelector("[data-cybercall-preview-portrait]"), o = i.querySelector("img");
  if (t.image) {
    const l = o ?? document.createElement("img");
    l.getAttribute("src") !== t.image && l.setAttribute("src", t.image), l.alt = t.callerName, o || i.replaceChildren(l);
  } else {
    const l = i.querySelector(".cybercall-initials") ?? document.createElement("span");
    l.className = "cybercall-initials", l.textContent = t.initials, l.parentNode !== i && i.replaceChildren(l);
  }
}
function Ma(e, t = null) {
  var s;
  const n = oe(e, t), a = Na(n);
  if (!n || !a) return;
  tt(a);
  const r = n.querySelector("[data-cybercall-ringtone]");
  r && r.addEventListener("change", async (i) => {
    await wn(i.currentTarget.value);
  }), a.addEventListener("input", () => tt(a)), (s = a.elements.actorId) == null || s.addEventListener("change", () => {
    var o;
    const i = (o = game.actors) == null ? void 0 : o.get(a.elements.actorId.value);
    i && (a.elements.callerName.value = i.name, a.elements.image.value = i.img ?? "");
  }), a.addEventListener("change", () => tt(a)), a.addEventListener("submit", (i) => {
    i.preventDefault(), pe(pt(a));
  }), n.querySelectorAll("[data-cybercall-compose-action]").forEach((i) => {
    i.addEventListener("click", async (o) => {
      var c, m, f, b;
      const l = o.currentTarget.dataset.cybercallComposeAction, u = pt(a);
      if (l === "preview") {
        await pe(u);
        return;
      }
      if (l === "broadcast") {
        await Ut(u);
        return;
      }
      if (l === "close-active") {
        fn((c = h == null ? void 0 : h.callData) == null ? void 0 : c.id);
        return;
      }
      if (l === "browse-image") {
        const I = a.elements.image, d = bt();
        if (!I || !d) {
          (f = (m = ui.notifications) == null ? void 0 : m.warn) == null || f.call(m, "Foundry FilePicker is unavailable.");
          return;
        }
        const p = new d({
          type: "image",
          current: I.value,
          callback: (S) => {
            I.value = S, I.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof p.browse == "function" ? p.browse() : (b = p.render) == null || b.call(p, !0);
        return;
      }
      if (l === "reset") {
        a.reset(), tt(a);
        return;
      }
      l === "open-messages" && await $e(), l === "open-contacts" && (ue = "group", await it());
    });
  });
}
function $a(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function Ta(e, t = null) {
  var m, f, b, I;
  const n = oe(e, t), a = $a(n);
  if (!n) return;
  const r = n.querySelector("[data-cybercall-ringtone]");
  if (r && r.addEventListener("change", async (d) => {
    await wn(d.currentTarget.value);
  }), (m = n.querySelector("[data-cybercall-message-sound]")) == null || m.addEventListener("change", async (d) => {
    await Jn(d.currentTarget.value);
  }), !a) return;
  const s = (d) => {
    n.querySelectorAll("[data-cybercall-contact-row]").forEach((p) => {
      p.classList.toggle("selected", p.dataset.cybercallContactRow === d);
    });
  };
  s(e.selectedContactId);
  const i = n.querySelector("[data-cybercall-contact-search]");
  if (i) {
    i.value = e.contactSearch ?? "";
    const d = () => {
      e.contactSearch = i.value;
      const p = i.value.trim().toLocaleLowerCase();
      n.querySelectorAll("[data-cybercall-contact-panel]").forEach((S) => {
        const G = [...S.querySelectorAll("[data-cybercall-contact-row]")];
        for (const E of G) {
          const P = E.querySelector(".cybercall-contact-id").textContent;
          E.hidden = !P.toLocaleLowerCase().includes(p);
        }
        const T = S.querySelector("[data-cybercall-empty-search]");
        T && (T.hidden = !G.length || G.some((E) => !E.hidden));
      });
    };
    i.addEventListener("input", d), d();
  }
  a.addEventListener("submit", async (d) => {
    var G, T, E;
    d.preventDefault();
    const p = new FormData(a), S = String(p.get("scope") ?? ue);
    u.disabled = !0;
    try {
      await Ca(p.get("name"), p.get("number"), S, p.get("image"), {
        id: p.get("contactId"),
        actorId: p.get("actorId"),
        managedByGM: p.get("managedByGM") === "on",
        isNpc: p.get("managedByGM") === "on" || !!p.get("actorId")
      }) && (c(), (G = a.elements.name) == null || G.focus());
    } catch (P) {
      console.warn(`${g} | Could not save contact.`, P), (E = (T = ui.notifications) == null ? void 0 : T.error) == null || E.call(T, "CyberCall could not save this contact.");
    } finally {
      u.disabled = !1;
    }
  });
  const o = n.querySelector("[data-cybercall-contact-player]");
  o == null || o.addEventListener("change", () => {
    Zt = o.value, ne();
  });
  const l = a.closest("details"), u = a.querySelector('button[type="submit"]');
  function c() {
    a.reset(), a.elements.scope.value = ue, u.textContent = "Add Contact", l && (l.querySelector("summary").textContent = "Add contact");
  }
  (f = a.querySelector("[data-cybercall-cancel-contact]")) == null || f.addEventListener("click", () => {
    c(), l && (l.open = !1);
  }), (b = a.elements.actorId) == null || b.addEventListener("change", () => {
    var p;
    const d = (p = game.actors) == null ? void 0 : p.get(a.elements.actorId.value);
    d && (a.elements.name.value || (a.elements.name.value = d.name), a.elements.image && !a.elements.image.value && (a.elements.image.value = d.img ?? ""), a.elements.managedByGM && (a.elements.managedByGM.checked = !0));
  }), n.querySelectorAll("[data-cybercall-contact-tab]").forEach((d) => {
    d.addEventListener("click", (p) => {
      var T;
      const S = p.currentTarget.dataset.cybercallContactTab;
      if (S === "player" && !((T = game.user) != null && T.isGM) || S === ue) return;
      ue = S, c(), l && (l.open = !1);
      const G = S !== "player" || !!Ve();
      l && (l.hidden = !G), n.querySelectorAll("[data-cybercall-contact-tab]").forEach((E) => {
        E.classList.toggle("active", E.dataset.cybercallContactTab === ue);
      }), n.querySelectorAll("[data-cybercall-contact-panel]").forEach((E) => {
        E.hidden = E.dataset.cybercallContactPanel !== ue;
      });
    });
  }), n.querySelectorAll("[data-cybercall-contact-action]").forEach((d) => {
    d.addEventListener("click", async (p) => {
      var _, K, ae;
      const S = p.currentTarget.dataset.cybercallContactAction, G = p.currentTarget.dataset.contactId, T = p.currentTarget.dataset.contactScope ?? "personal", P = ba(T).find((L) => L.id === G);
      if (S === "edit" && P && ((_ = game.user) != null && _.isGM)) {
        if (!l || !a.elements.contactId) return;
        a.elements.contactId.value = P.id, a.elements.name.value = P.name, a.elements.number.value = P.number, a.elements.actorId.value = P.actorId, a.elements.image.value = P.image, a.elements.managedByGM.checked = P.managedByGM, l.querySelector("summary").textContent = "Edit contact", u.textContent = "Save Contact", l.open = !0, a.elements.name.focus();
        return;
      }
      if (S === "remove" && P && !("assignedToPlayer" in P)) {
        try {
          await wa(G, T);
        } catch (L) {
          console.warn(`${g} | Could not remove contact.`, L), (ae = (K = ui.notifications) == null ? void 0 : K.error) == null || ae.call(K, "CyberCall could not remove this contact.");
        }
        return;
      }
      if (P && (S === "call" || S === "message") && (e.selectedContactId = G, s(G)), S === "call" && P) {
        await Ya(P);
        return;
      }
      S === "message" && P && await $e(P);
    });
  }), (I = n.querySelector("[data-cybercall-open-messages]")) == null || I.addEventListener("click", async () => {
    await $e();
  });
}
function ln(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
function Ga(e) {
  var c, m, f, b, I, d, p;
  const t = Nt()[e.id] ?? null, n = ((c = game.user) == null ? void 0 : c.isGM) === !0, a = !!(!e.isGroup && e.contact && !e.contact.userId && (e.contact.isNpc || e.contact.managedByGM || e.isNpcRouted)), r = t != null && t.actorId ? (f = (m = game.actors) == null ? void 0 : m.get) == null ? void 0 : f.call(m, t.actorId) : null, s = String((r == null ? void 0 : r.name) ?? (t == null ? void 0 : t.actorName) ?? "").trim(), i = String((t == null ? void 0 : t.image) ?? ((I = (b = r == null ? void 0 : r.prototypeToken) == null ? void 0 : b.texture) == null ? void 0 : I.src) ?? (r == null ? void 0 : r.img) ?? "").trim(), o = (t == null ? void 0 : t.revealPortrait) === !0, l = e.isNpcRouted === !0, u = t || l ? {
    ...e.contact,
    actorId: t && n ? String(t.actorId ?? e.contact.actorId ?? "") : e.contact.actorId,
    image: t && o ? i : ""
  } : e.contact;
  return {
    ...e,
    contact: u,
    image: !n && l ? t && o ? i : "" : e.image,
    canLinkNpc: n && a,
    showNpcLinkPanel: n && (a || !!t),
    hasNpcBinding: !!t,
    npcBindingName: s || ((d = e.contact) == null ? void 0 : d.name) || "Linked NPC",
    npcBindingImage: i,
    npcBindingInitials: se(s || ((p = e.contact) == null ? void 0 : p.name) || "NPC"),
    npcPortraitRevealed: o,
    npcBindingStatusLabel: t ? `Linked to ${s || "Actor"}` : "Unlinked NPC contact"
  };
}
function Tt(e = null) {
  var b, I, d;
  let t = vt();
  const n = e ?? t[0] ?? null;
  n && !t.some((p) => p.id === n.id || p.number === n.number) && (t = [...t, x(n)].sort((p, S) => p.name.localeCompare(S.name)));
  const a = ee || j ? "" : F, r = Jt(Mt(), t, a, At()).map((p) => ({
    ...Ga(p),
    messages: p.messages.map((S) => ({
      ...S,
      createdAtLabel: ln(S.createdAt)
    }))
  })), s = ee || j ? null : r.find((p) => p.id === F) ?? null;
  s != null && s.contact && !t.some((p) => p.id === s.contact.id || p.number === s.contact.number) && (t = [...t, s.contact].sort((p, S) => p.name.localeCompare(S.name)));
  const i = ((b = s == null ? void 0 : s.contact) == null ? void 0 : b.id) ?? (n == null ? void 0 : n.id) ?? "", o = sn(), l = un(s, { excludeGMs: !1 }), u = Pa(s), c = dn(), m = ((I = game.user) == null ? void 0 : I.isGM) === !0 && !s && c.length > 1, f = pa();
  return {
    threads: r,
    hasThreads: r.length > 0,
    unreadCount: o,
    hasUnreadMessages: o > 0,
    activeThread: s,
    activeThreadId: (s == null ? void 0 : s.id) ?? a,
    allContacts: t.map((p) => ({
      ...p,
      selected: p.id === i
    })),
    hasContacts: t.length > 0,
    selectedContactId: i,
    isThreadReply: !!s,
    showConversation: !!(s || ee || j || e),
    isComposingNewMessage: !s && !j,
    isComposingNewGroup: j,
    groupMemberChoices: f,
    hasGroupMemberChoices: f.length > 0,
    canDeleteThread: !!s,
    threadReplyLabel: s ? `${s.title}${s.subtitle ? ` (${s.subtitle})` : ""}` : "",
    canReplyAs: u.length > 1,
    replyAsChoices: u,
    canSendAs: m,
    sendAsChoices: c,
    activeThreadRecipientUserIds: l,
    showMessageTimestamps: game.settings.get(g, "showMessageTimestamps") === !0,
    gmViewPlayerMessagesEnabled: game.settings.get(g, "gmViewPlayerMessages") === !0,
    isFoundryV13Plus: Number(((d = game.release) == null ? void 0 : d.generation) ?? 0) >= 13
  };
}
function ka(e, t = Tt()) {
  const n = String(new FormData(e).get("contactId") ?? "");
  return t.allContacts.find((a) => a.id === n) ?? null;
}
function un(e, t = {}) {
  var s, i, o;
  if (!((s = e == null ? void 0 : e.messages) != null && s.length)) return [];
  const n = String(((i = game.user) == null ? void 0 : i.id) ?? ""), a = new Set((((o = game.users) == null ? void 0 : o.contents) ?? []).filter((l) => l.isGM).map((l) => String(l.id))), r = /* @__PURE__ */ new Set();
  for (const l of e.messages) {
    l.senderUserId && l.senderUserId !== n && !(t.excludeGMs && a.has(l.senderUserId)) && r.add(l.senderUserId);
    for (const u of l.recipientUserIds ?? [])
      u && u !== n && !(t.excludeGMs && a.has(u)) && r.add(u);
  }
  return [...r];
}
function Ea() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => String(t.id)).filter(Boolean);
}
function Pa(e) {
  var a, r;
  const t = !!((a = game.user) != null && a.isGM && (e != null && e.contact) && !e.contact.userId && (e.contact.isNpc || e.contact.managedByGM)), n = [{
    id: "self",
    label: H(game.user, "Me"),
    selected: !t
  }];
  return !((r = game.user) != null && r.isGM) || !(e != null && e.contact) || e.contact.userId || n.push({
    id: "contact",
    label: e.contact.name,
    selected: t
  }), n;
}
function dn() {
  var n, a;
  const e = [{
    id: "self",
    label: H(game.user, "Me"),
    selected: !0,
    contact: null
  }];
  if (!((n = game.user) != null && n.isGM)) return e;
  const t = /* @__PURE__ */ new Set();
  for (const r of [...me(), ...rt()].map(x)) {
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
      contact: x({
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
function Lt(e) {
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
function Ua(e, t) {
  var s, i;
  const n = new FormData(e);
  if (t.activeThread)
    return String(n.get("replyAs") ?? "self") === "contact" && ((s = game.user) != null && s.isGM) && t.activeThread.contact ? Lt(t.activeThread.contact) : {};
  const a = String(n.get("sendAs") ?? "self");
  if (a === "self" || !((i = game.user) != null && i.isGM)) return {};
  const r = dn().find((o) => o.id === a);
  return Lt(r == null ? void 0 : r.contact);
}
function Ba(e) {
  var n, a, r, s, i;
  const t = globalThis.TextEditor ?? ((r = (a = (n = globalThis.foundry) == null ? void 0 : n.applications) == null ? void 0 : a.ux) == null ? void 0 : r.TextEditor);
  try {
    const o = (s = t == null ? void 0 : t.getDragEventData) == null ? void 0 : s.call(t, e);
    if (o && Object.keys(o).length) return o;
  } catch {
  }
  try {
    return JSON.parse(((i = e.dataTransfer) == null ? void 0 : i.getData("text/plain")) || "{}");
  } catch {
    return {};
  }
}
function _t(e) {
  var n, a, r, s, i, o;
  const t = String(
    ((n = e == null ? void 0 : e.getTextureSrc) == null ? void 0 : n.call(e)) || ((a = e == null ? void 0 : e.texture) == null ? void 0 : a.src) || ((s = (r = e == null ? void 0 : e.document) == null ? void 0 : r.texture) == null ? void 0 : s.src) || ((o = (i = e == null ? void 0 : e.prototypeToken) == null ? void 0 : i.texture) == null ? void 0 : o.src) || (e == null ? void 0 : e.img) || ""
  ).trim();
  return t.includes("*") ? String((e == null ? void 0 : e.img) ?? "").trim() : t;
}
async function Da(e) {
  var i, o, l, u, c, m, f, b;
  const t = Ba(e), n = globalThis.fromUuid;
  let a = t.uuid && n ? await n(t.uuid) : null;
  !a && t.sceneId && t.tokenId && (a = ((c = (u = (l = (o = (i = game.scenes) == null ? void 0 : i.get) == null ? void 0 : o.call(i, t.sceneId)) == null ? void 0 : l.tokens) == null ? void 0 : u.get) == null ? void 0 : c.call(u, t.tokenId)) ?? null);
  const r = String(
    ((m = a == null ? void 0 : a.actor) == null ? void 0 : m.id) || (a == null ? void 0 : a.actorId) || ((a == null ? void 0 : a.documentName) === "Actor" ? a.id : "") || t.actorId || (t.type === "Actor" ? t.id : "") || ""
  ).trim(), s = (a == null ? void 0 : a.documentName) === "Actor" ? a : (a == null ? void 0 : a.actor) ?? (r ? (b = (f = game.actors) == null ? void 0 : f.get) == null ? void 0 : b.call(f, r) : null);
  return s ? {
    actorId: String(s.id ?? r),
    actorUuid: String(s.uuid ?? `Actor.${s.id ?? r}`),
    actorName: String(s.name ?? "Linked NPC"),
    image: _t(a) || _t(s),
    revealPortrait: !1,
    linkedAt: (/* @__PURE__ */ new Date()).toISOString()
  } : null;
}
async function Ra(e, t) {
  var a, r, s, i, o;
  if (!((a = game.user) != null && a.isGM) || !t) return;
  e.preventDefault(), e.stopPropagation();
  const n = await Da(e);
  if (!n) {
    (s = (r = ui.notifications) == null ? void 0 : r.warn) == null || s.call(r, "Drop an Actor or an Actor-backed Token to link this NPC contact.");
    return;
  }
  await gt(t, n), (o = (i = ui.notifications) == null ? void 0 : i.info) == null || o.call(i, `Linked this NPC conversation to ${n.actorName}.`), await q();
}
async function Oa(e, t) {
  var b, I, d, p, S;
  const n = new FormData(e), a = String(n.get("groupName") ?? "").trim(), r = [...new Set(n.getAll("memberUserIds").map((G) => String(G)).filter(Boolean))];
  if (!a) {
    (I = (b = ui.notifications) == null ? void 0 : b.warn) == null || I.call(b, "Enter a name for the group chat.");
    return;
  }
  if (!r.length) {
    (p = (d = ui.notifications) == null ? void 0 : d.warn) == null || p.call(d, "Select at least one other player for the group chat.");
    return;
  }
  const s = String(((S = game.user) == null ? void 0 : S.id) ?? ""), i = [...new Set([s, ...r].filter(Boolean))], o = i.map((G) => {
    var T, E;
    return H((E = (T = game.users) == null ? void 0 : T.get) == null ? void 0 : E.call(T, G));
  }).filter(Boolean), l = Te(), u = ea(l), c = H(game.user, "A player"), m = {
    id: `group-${l}`,
    name: a,
    number: `${i.length} members`,
    userIds: r,
    isGroup: !0
  };
  await It(m, `${c} created the group.`, {
    threadId: u,
    recipientUserIds: r,
    recipientNumbers: [],
    messageType: "event",
    eventType: "group-created",
    conversationType: "group",
    groupId: l,
    groupName: a,
    groupMemberUserIds: i,
    groupMemberNames: o
  }) && (F = u, ee = !1, j = !1, t && (t.contact = m), (v == null ? void 0 : v.mode) === "messages" && (v.contact = m), await Oe(), await q());
}
function La(e, t = null) {
  const n = oe(e, t);
  if (!n) return;
  Sa(e, n), va(e, n), n.querySelectorAll("[data-cybercall-npc-link-drop]").forEach((s) => {
    s.addEventListener("dragover", (i) => {
      var o;
      (o = game.user) != null && o.isGM && (i.preventDefault(), i.dataTransfer.dropEffect = "link", s.classList.add("drag-over"));
    }), s.addEventListener("dragleave", () => s.classList.remove("drag-over")), s.addEventListener("drop", async (i) => {
      s.classList.remove("drag-over");
      const o = s.dataset.cybercallNpcThreadId || s.dataset.cybercallThreadId || F;
      await Ra(i, o);
    });
  }), n.querySelectorAll("[data-cybercall-npc-action]").forEach((s) => {
    s.addEventListener("click", async (i) => {
      var c, m, f, b, I;
      i.preventDefault(), i.stopPropagation();
      const o = i.currentTarget.dataset.cybercallNpcAction, l = i.currentTarget.dataset.cybercallNpcThreadId || F, u = Nt()[l];
      if (o === "toggle-reveal" && u) {
        await gt(l, { revealPortrait: u.revealPortrait !== !0 }), await q();
        return;
      }
      if (o === "unlink" && u) {
        await gt(l, null), (m = (c = ui.notifications) == null ? void 0 : c.info) == null || m.call(c, "NPC identity link removed."), await q();
        return;
      }
      o === "change" && ((f = i.currentTarget.closest("[data-cybercall-npc-link-drop]")) == null || f.classList.add("awaiting-drop"), (I = (b = ui.notifications) == null ? void 0 : b.info) == null || I.call(b, "Drag a different Actor or Token onto the NPC identity panel."));
    });
  }), n.querySelectorAll("[data-cybercall-thread-id]").forEach((s) => {
    s.addEventListener("click", async (i) => {
      ee = !1, j = !1, F = i.currentTarget.dataset.cybercallThreadId, await Oe(), await q();
    });
  }), n.querySelectorAll("[data-cybercall-message-action]").forEach((s) => {
    s.addEventListener("click", async (i) => {
      var l;
      const o = i.currentTarget.dataset.cybercallMessageAction;
      if (o === "back") {
        F = "", ee = !1, j = !1, e.contact = null, await q();
        return;
      }
      if (o === "refresh") {
        await q();
        return;
      }
      if (o === "open-calls") {
        await bn();
        return;
      }
      if (o === "new") {
        ee = !0, j = !1, F = "", te && (te.contact = null), await q();
        return;
      }
      if (o === "new-group") {
        ee = !1, j = !0, F = "", te && (te.contact = null), (v == null ? void 0 : v.mode) === "messages" && (v.contact = null), await q();
        return;
      }
      if (o === "delete-thread") {
        i.preventDefault(), i.stopPropagation();
        const u = n.querySelector("[data-cybercall-active-thread]"), c = F || ((l = u == null ? void 0 : u.dataset) == null ? void 0 : l.cybercallActiveThread) || "";
        if (!c) return;
        if (e._cybercallPendingDeleteThreadId !== c) {
          e._cybercallPendingDeleteThreadId = c, i.currentTarget.classList.add("confirming"), i.currentTarget.textContent = "Confirm Delete", i.currentTarget.setAttribute("aria-label", "Confirm delete thread"), i.currentTarget.title = "Click again to delete this thread";
          return;
        }
        e._cybercallPendingDeleteThreadId = "", await ha(c);
      }
    });
  });
  const a = n.querySelector("form[data-cybercall-group-form]");
  a == null || a.addEventListener("submit", async (s) => {
    s.preventDefault(), await Oa(a, e);
  });
  const r = n.querySelector("form[data-cybercall-message-form]");
  r == null || r.addEventListener("submit", async (s) => {
    var d, p, S, G, T;
    s.preventDefault();
    const i = Tt(), o = i.activeThread, l = (o == null ? void 0 : o.contact) ?? ka(r, i), u = ((d = r.elements.body) == null ? void 0 : d.value) ?? "", c = Ua(r, i), m = !!(o != null && o.contact && !o.contact.userId && (o.contact.managedByGM || o.contact.isNpc)), f = o ? un(o, { excludeGMs: ((p = game.user) == null ? void 0 : p.isGM) === !0 && !m }) : null;
    if (!l) {
      (G = (S = ui.notifications) == null ? void 0 : S.warn) == null || G.call(S, "Select a contact before sending a message.");
      return;
    }
    const b = (o == null ? void 0 : o.id) ?? qe(l, (T = game.user) == null ? void 0 : T.id, c);
    await It(l, u, {
      ...c,
      threadId: b,
      recipientUserIds: f != null && f.length ? f : void 0,
      recipientNumbers: c.senderNumber ? [] : void 0,
      conversationType: o != null && o.isGroup ? "group" : "direct",
      groupId: (o == null ? void 0 : o.groupId) ?? "",
      groupName: (o == null ? void 0 : o.groupName) ?? "",
      groupMemberUserIds: (o == null ? void 0 : o.groupMemberUserIds) ?? [],
      groupMemberNames: (o == null ? void 0 : o.groupMemberNames) ?? []
    }) && (F = b, e && (e.contact = l), (v == null ? void 0 : v.mode) === "messages" && (v.contact = l), ee = !1, j = !1, r.elements.body.value = "", await Oe(), await q({ scrollToBottom: !0, preserveDraft: !1 }));
  }), Oe();
}
function _a() {
  const e = /* @__PURE__ */ new Set(["outgoing", "connected", "ended", "missed"]), t = game.settings.get(g, "showMessageTimestamps") === !0;
  return Mt().filter((n) => n.messageType === "event" && e.has(n.eventType)).sort((n, a) => a.createdAt.localeCompare(n.createdAt)).map((n) => ({
    body: n.body,
    createdAtLabel: t ? ln(n.createdAt) : ""
  }));
}
function Fa(e, t = null) {
  const n = oe(e, t);
  n == null || n.querySelectorAll("[data-cybercall-screen]").forEach((a) => {
    a.addEventListener("click", () => {
      const r = a.dataset.cybercallScreen;
      r !== e.mode && (r === "messages" ? $e() : Pt(r));
    });
  });
}
const { CyberCallApplication: xa, CyberCallComposer: qa, CyberCallPhone: gn } = _n({
  moduleId: g,
  templatePath: Fn,
  composerTemplatePath: xn,
  contactsTemplatePath: qn,
  messagesTemplatePath: Vn,
  phoneTemplatePath: jn,
  escapeHTML: ve,
  getDefaultComposerData: ga,
  getActorChoices: ma,
  getPlayerChoices: en,
  getContacts: rt,
  getGroupContacts: me,
  getMessageContext: Tt,
  getCallHistory: _a,
  bindPhoneNavigation: Fa,
  getRingtoneChoices: In,
  getMessageSoundOptions: Yn,
  getSoundPath: Bt,
  getActiveContactsTab: () => ue,
  getContactsPlayerChoices: nn,
  getSelectedContactsPlayerId: Ve,
  getAssignedContacts: Ct,
  canEditContactImages: Re,
  bindCallControls: Aa,
  bindComposerControls: Ma,
  bindContactsControls: Ta,
  bindMessagesControls: La,
  stopRinging: Fe,
  clearActiveCall: (e) => {
    h === e && (h = null);
  },
  clearActiveComposer: (e) => {
    Z === e && (Z = null);
  },
  clearActiveContacts: (e) => {
    Ae === e && (Ae = null);
  },
  clearActiveMessages: (e) => {
    te === e && (te = null);
  },
  clearActivePhone: (e) => {
    h === e && (h = null, Fe()), v === e && (v = null, Ae = null, te = null);
  }
});
async function pe(e = {}) {
  var a, r, s, i;
  if (!st())
    return (r = (a = ui.notifications) == null ? void 0 : a.warn) == null || r.call(a, "You do not have permission to open CyberCall transmissions."), null;
  await Gt();
  const t = ie(e);
  !t.fullscreen && !game.user.isGM ? (v ?? (v = new gn()), yn(v), v.callData = t, h = v) : h = new xa(t, t.fullscreen ? { classes: ["cybercall-app", "cybercall-fullscreen"] } : {});
  const n = h;
  return await n.render(!0), h === n && ((s = n.callData) == null ? void 0 : s.id) === t.id && (hn(n), (i = n.bringToFront) == null || i.call(n), Xa(n.callData)), n;
}
async function Gt() {
  if (!h) return;
  const e = h;
  if (h = null, e === v) {
    Fe(), e.callData = null, Ae = e.mode === "calls" ? e : null, te = e.mode === "messages" ? e : null, await e.render(!0);
    return;
  }
  await e.close();
}
function Va(e) {
  var t;
  return !!((t = h == null ? void 0 : h.callData) != null && t.id) && h.callData.id === e;
}
async function ja() {
  h && (await h.render(!0), hn(h));
}
async function mn(e) {
  Va(e) && (h.callData.accepted = !0, h.callData.ringing = !1, Fe(), await ja());
}
async function za(e) {
  e && (await at(h == null ? void 0 : h.callData, "connected"), game.socket.emit(fe, {
    action: "acceptCall",
    callId: e
  }), await mn(e));
}
async function pn(e) {
  var t;
  e && ((t = h == null ? void 0 : h.callData) != null && t.id) && h.callData.id !== e || await Gt();
}
async function fn(e) {
  var t;
  await at(h == null ? void 0 : h.callData, (t = h == null ? void 0 : h.callData) != null && t.accepted ? "ended" : "missed"), game.socket.emit(fe, {
    action: "endCall",
    callId: e
  }), await pn(e);
}
function Wa(e, t = "Player") {
  var r, s, i, o, l;
  const n = ((s = (r = game.users) == null ? void 0 : r.get) == null ? void 0 : s.call(r, e)) ?? ((l = (o = (i = game.users) == null ? void 0 : i.contents) == null ? void 0 : o.find) == null ? void 0 : l.call(o, (u) => u.id === e)), a = H(n, t);
  return {
    id: `user-${e}`,
    name: a,
    number: `@${a}`,
    image: xe(n),
    userId: e,
    userIds: e ? [e] : []
  };
}
function Ha(e) {
  var t;
  return e ? e.contactNumber ? vt().find((a) => a.number === e.contactNumber) ?? {
    id: `contact-${e.contactNumber}`,
    name: e.contactName || e.callerName,
    number: e.contactNumber,
    image: e.contactImage || e.image,
    actorId: e.contactActorId ?? "",
    managedByGM: !0,
    isNpc: !0
  } : (t = game.user) != null && t.isGM && e.callerUserId ? Wa(e.callerUserId, e.callerName) : null : null;
}
function Ka(e, t) {
  var a;
  const n = /* @__PURE__ */ new Set();
  for (const r of (t == null ? void 0 : t.userIds) ?? []) n.add(String(r));
  if (t != null && t.userId && n.add(String(t.userId)), e != null && e.callerUserId && n.add(String(e.callerUserId)), !(t != null && t.userId) && (t != null && t.managedByGM || t != null && t.isNpc || e != null && e.contactNumber))
    for (const r of Ea()) n.add(r);
  return n.delete(String(((a = game.user) == null ? void 0 : a.id) ?? "")), [...n].filter(Boolean);
}
async function at(e, t) {
  var s;
  const n = Ha(e);
  if (!n) return null;
  const a = (e == null ? void 0 : e.callerUserId) || ((s = game.user) == null ? void 0 : s.id), r = {
    outgoing: `Outgoing call to ${n.name}.`,
    connected: `Call connected with ${n.name}.`,
    ended: `Call ended with ${n.name}.`,
    missed: `Call missed or declined with ${n.name}.`
  };
  return da(n, r[t] ?? "Call event.", {
    threadId: qe(n, a),
    eventType: t,
    senderName: "CyberCall",
    senderNumber: n.number,
    senderActorId: n.actorId,
    recipientUserIds: Ka(e, n),
    recipientNumbers: n.userId ? [] : [n.number]
  });
}
async function Ya(e) {
  var o, l;
  if (game.user.isGM) {
    const u = {
      callerName: e.name,
      subtitle: `Comms ${e.number}`,
      image: e.image,
      message: `Opening channel ${e.number}...`,
      signal: game.settings.get(g, "defaultSignal"),
      variant: "standard",
      contactNumber: e.number,
      ringing: !1
    };
    return await at(u, "outgoing"), pe(u);
  }
  if (!$t())
    return (l = (o = ui.notifications) == null ? void 0 : o.warn) == null || l.call(o, "No GM is connected to receive the CyberCall."), null;
  const t = Te(), n = xe(game.user), a = H(game.user, "Unknown Caller"), r = {
    id: t,
    signal: game.settings.get(g, "defaultSignal"),
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
  }, s = ie({
    ...r,
    callerName: e.name,
    subtitle: `Comms ${e.number}`,
    image: e.image,
    message: `Awaiting connection to ${e.name} on ${e.number}...`,
    canAccept: !1,
    canDecline: !1,
    outgoing: !0,
    ringing: !0
  }), i = ie({
    ...r,
    callerName: a,
    subtitle: `Call request from ${a}`,
    image: n,
    message: `${a} is calling ${e.name} on ${e.number}.`,
    canAccept: !0,
    ringing: !0
  });
  return game.socket.emit(fe, {
    action: "playerCallRequest",
    callData: i
  }), await at(s, "outgoing"), pe(s);
}
async function kt() {
  var e, t, n;
  return game.user.isGM ? (Z || (Z = new qa()), Z.rendered || await Z.render(!0), (n = Z.bringToFront) == null || n.call(Z), Z) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function it() {
  var e, t, n, a;
  return st() ? h && !((n = game.user) != null && n.isGM) ? ((a = h.bringToFront) == null || a.call(h), h) : Pt("calls") : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function ne() {
  !v || v.callData || v.mode === "messages" || await v.render(!0);
}
async function $e(e = null) {
  var n, a;
  if (!st())
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "You do not have permission to use CyberCall messages."), null;
  e && (F = qe(e), ee = !1, j = !1);
  const t = await Pt("messages", e);
  return t != null && t.callData || await Oe(), t;
}
async function Et(e) {
  return e && (F = String(e), ee = !1, j = !1), $e();
}
async function bn() {
  var e;
  return (e = game.user) != null && e.isGM ? kt() : it();
}
async function q(e = {}) {
  !v || v.callData || v.mode !== "messages" || (v._cybercallMessageComposerState = e.preserveDraft === !1 ? null : cn(v), v._cybercallMessageScrollState = {
    ...on(v),
    scrollToBottom: e.scrollToBottom === !0
  }, await v.render(!0));
}
function yn(e) {
  if (e.mode !== "messages" || e.callData) return;
  const t = cn(e);
  t && (e._cybercallMessageComposerState = t);
  const n = on(e);
  n && (e._cybercallMessageScrollState = n);
}
async function Pt(e = "calls", t = null) {
  var a;
  v ? (yn(v), (e !== v.mode || t) && (v.contact = t ?? v.contact), v.mode = e) : v = new gn(e, t), Ae = e === "calls" ? v : null, te = e === "messages" ? v : null;
  const n = v;
  return n.callData || await n.render(!0), (a = n.bringToFront) == null || a.call(n), n;
}
async function Ut(e = {}) {
  var n, a;
  if (!game.user.isGM)
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Only the GM can broadcast CyberCalls to all players."), null;
  const t = ie({
    ...e,
    fullscreen: e.fullscreen ?? !0,
    ringing: e.ringing ?? !0
  });
  return game.socket.emit(fe, {
    action: "openCall",
    callData: t,
    targetUserIds: t.targetUserIds
  }), pe({ ...t, outgoing: !0 });
}
async function Ja(e) {
  var t, n, a;
  if (e && !(Array.isArray(e.targetUserIds) && e.targetUserIds.length && !e.targetUserIds.includes((t = game.user) == null ? void 0 : t.id)) && !(Array.isArray((n = e.callData) == null ? void 0 : n.targetUserIds) && e.callData.targetUserIds.length && !e.callData.targetUserIds.includes((a = game.user) == null ? void 0 : a.id))) {
    if (e.action === "openCall") {
      if (!st()) return;
      pe(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      pe(e.callData);
      return;
    }
    if (e.action === "acceptCall") {
      mn(e.callId);
      return;
    }
    if (e.action === "endCall") {
      pn(e.callId);
      return;
    }
    if (e.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const r = x({
        ...e.contact,
        image: ""
      });
      if (!r.name || !r.number) return;
      const s = me();
      s.push(r), await nt(s), await ne();
      return;
    }
    if (e.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await nt(me().filter((r) => r.id !== e.contactId)), await ne();
      return;
    }
    e.action === "groupContactsChanged" && (Ne = Array.isArray(e.contacts) ? e.contacts.map(x) : null, await ne());
  }
}
function hn(e) {
  var t, n;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((n = e.setPosition) == null || n.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function Cn() {
  const e = game.settings.get(g, "ringSoundsByWorld");
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function Qa() {
  return /* @__PURE__ */ new Set([
    ...Object.keys(ft),
    ...ge(game.settings.get(g, "customRingtones")).map((e) => e.path)
  ]);
}
function Bt() {
  const e = Ge(), t = Cn(), n = Object.prototype.hasOwnProperty.call(t, e), a = String(n ? t[e] : game.settings.get(g, "ringSound") ?? "").trim();
  return Qa().has(a) ? a : Wt;
}
async function wn(e) {
  const t = Ge();
  await game.settings.set(g, "ringSoundsByWorld", {
    ...Cn(),
    [t]: String(e ?? "").trim()
  });
}
function In() {
  const e = Bt(), t = ge(game.settings.get(g, "customRingtones")), n = new Map(Object.entries(ft));
  for (const a of t)
    n.has(a.path) || n.set(a.path, a.label);
  return [...n].map(([a, r]) => ({
    value: a,
    label: r,
    selected: a === e
  }));
}
function Fe() {
  if (dt += 1, !de) return;
  const e = de;
  de = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function Xa(e) {
  var s;
  if (Fe(), !e.ringing) return;
  const t = Bt();
  if (!t) return;
  const a = 0.65 * (Math.max(0, Math.min(100, Number(game.settings.get(g, "ringVolume") ?? 100))) / 100), r = ((s = foundry == null ? void 0 : foundry.audio) == null ? void 0 : s.AudioHelper) ?? globalThis.AudioHelper;
  if (r != null && r.play) {
    const i = dt;
    r.play({ src: t, volume: a, autoplay: !0, loop: !0, channel: "interface" }, !1).then((o) => {
      var l;
      i === dt ? de = o : typeof (o == null ? void 0 : o.stop) == "function" ? o.stop() : (l = o == null ? void 0 : o.pause) == null || l.call(o);
    }).catch((o) => {
      console.warn(`${g} | Unable to play ringing sound.`, o);
    });
  } else {
    const i = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5);
    de = new Audio(t), de.loop = !0, de.volume = a * i, de.play().catch((o) => {
      console.warn(`${g} | Unable to play ringing sound.`, o);
    });
  }
}
function Za() {
  var o;
  const e = yt();
  if (e) {
    const l = ((o = foundry == null ? void 0 : foundry.audio) == null ? void 0 : o.AudioHelper) ?? globalThis.AudioHelper;
    if (l != null && l.play)
      Promise.resolve(l.play({ src: e, volume: 0.65, loop: !1 }, !1)).catch((u) => console.warn(`${g} | Unable to play message notification sound.`, u));
    else {
      const u = new Audio(e);
      u.volume = 0.65 * Math.max(0, Math.min(1, Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5))), u.play().catch((c) => console.warn(`${g} | Unable to play message notification sound.`, c));
    }
    return;
  }
  const t = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  if (!t) return;
  const n = new t(), a = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), r = Math.max(1e-4, Math.min(0.18, 0.18 * a)), s = (l, u, c) => {
    const m = n.createOscillator(), f = n.createGain(), b = n.currentTime + u, I = b + c;
    m.type = "sine", m.frequency.setValueAtTime(l, b), m.frequency.exponentialRampToValueAtTime(l * 1.18, I), f.gain.setValueAtTime(1e-4, b), f.gain.exponentialRampToValueAtTime(r, b + 0.025), f.gain.exponentialRampToValueAtTime(1e-4, I), m.connect(f), f.connect(n.destination), m.start(b), m.stop(I);
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
function er(e) {
  var n, a, r, s, i;
  if (e.senderImage) return String(e.senderImage);
  if (e.contactIsNpc && e.senderNumber) return "";
  const t = ((a = (n = game.users) == null ? void 0 : n.get) == null ? void 0 : a.call(n, e.senderUserId)) ?? ((i = (s = (r = game.users) == null ? void 0 : r.contents) == null ? void 0 : s.find) == null ? void 0 : i.call(s, (o) => o.id === e.senderUserId));
  return (t == null ? void 0 : t.isGM) === !0 ? "" : xe(t);
}
function Ft(e) {
  e != null && e.isConnected && (e.classList.add("leaving"), window.setTimeout(() => e.remove(), 220));
}
function tr(e) {
  let t = document.querySelector("[data-cybercall-message-notifications]");
  t || (t = document.createElement("div"), t.className = "cybercall-message-notifications", t.dataset.cybercallMessageNotifications = "", t.setAttribute("aria-live", "polite"), document.body.append(t));
  const n = String(e.senderName || "New message").trim(), a = String(e.groupName || "").trim(), r = document.createElement("button");
  r.type = "button", r.className = "cybercall-incoming-message", r.title = "Open CyberCall conversation";
  const s = document.createElement("span");
  s.className = `cybercall-incoming-avatar ${Yt(e.senderUserId || n)}`;
  const i = er(e);
  if (i) {
    const m = document.createElement("img");
    m.src = i, m.alt = "", s.append(m);
  } else
    s.textContent = se(n);
  const o = document.createElement("i");
  o.className = "fa-solid fa-message cybercall-incoming-badge", o.setAttribute("aria-hidden", "true"), s.append(o);
  const l = document.createElement("span");
  l.className = "cybercall-incoming-copy";
  const u = document.createElement("strong");
  u.textContent = a ? `${n} · ${a}` : n;
  const c = document.createElement("small");
  c.textContent = String(e.body || "New CyberCall message").trim(), l.append(u, c), r.append(s, l), r.addEventListener("click", () => {
    Ft(r), Et(String(e.threadId || ""));
  }), t.append(r), Za(), window.setTimeout(() => Ft(r), 4200);
}
function nr(e) {
  var n, a, r;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[g]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, g, "message"));
  return (t == null ? void 0 : t.kind) === Me ? t : ((r = t == null ? void 0 : t.message) == null ? void 0 : r.kind) === Me ? t.message : null;
}
function Sn(e, t) {
  var a, r, s, i, o, l, u;
  if (!e) return;
  const n = (a = e.matches) != null && a.call(e, ".chat-message") ? e : ((r = e.closest) == null ? void 0 : r.call(e, ".chat-message")) ?? ((s = e.querySelector) == null ? void 0 : s.call(e, ".chat-message")) ?? e;
  (o = (i = n.classList) == null ? void 0 : i.toggle) == null || o.call(i, "cybercall-chat-message-hidden", !t), t ? (l = n.removeAttribute) == null || l.call(n, "aria-hidden") : (u = n.setAttribute) == null || u.call(n, "aria-hidden", "true");
}
function vn(e, t) {
  if (!nr(e)) return;
  const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? (t == null ? void 0 : t.element) ?? null;
  Sn(n, game.settings.get(g, "showChatCards") === !0);
}
function An() {
  const e = game.settings.get(g, "showChatCards") === !0;
  document.querySelectorAll(".cybercall-chat-card").forEach((t) => {
    Sn(t, e);
  });
}
function Nn() {
  const e = game.modules.get(g);
  e && (e.api = {
    openCall: pe,
    closeCall: Gt,
    broadcastCall: Ut,
    openComposer: kt,
    openContacts: it,
    openMessages: $e,
    openMessagesThread: Et,
    openCallPanel: bn,
    getUnreadMessageCount: sn,
    get activeCall() {
      return h;
    },
    get activeComposer() {
      return Z;
    },
    get activeContacts() {
      return Ae;
    },
    get activeMessages() {
      return te;
    }
  });
}
function ar() {
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
    id: g,
    title: "CyberCall",
    icon: "fa-solid fa-satellite-dish",
    premium: !1,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => {
      var a;
      return (a = game.user) != null && a.isGM ? kt() : it();
    }
  }), (n = t.registerWhatsNew) == null || n.call(t, {
    moduleId: g,
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
function rr() {
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
  game.settings.register(g, "defaultSignal", {
    name: "Default Signal Strength",
    hint: "Signal percentage used when a call does not provide one.",
    scope: "client",
    config: !0,
    type: Number,
    default: V.signal,
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
    default: Wt,
    choices: ft
  }), game.settings.register(g, "ringSoundsByWorld", {
    name: "CyberCall Ringtone Selections",
    hint: "Stores this client's ringtone choice separately for each world.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(g, "ringVolume", {
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
  }), game.settings.register(g, "customRingtones", {
    name: "Additional CyberCall Ringtones",
    hint: "GM-managed ringtone audio files available to everyone in this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: [],
    onChange: () => {
      var a;
      (v == null ? void 0 : v.mode) === "settings" && ne();
      const n = (a = oe(Z)) == null ? void 0 : a.querySelector("[data-cybercall-ringtone]");
      n instanceof HTMLSelectElement && n.replaceChildren(...In().map(
        ({ label: r, value: s, selected: i }) => new Option(r, s, i, i)
      ));
    }
  }), game.settings.registerMenu(g, "customRingtonesMenu", {
    name: "Additional Ringtones",
    label: "Manage Ringtones",
    hint: "Add one or more audio files to the ringtone list for this world.",
    icon: "fa-solid fa-bell",
    type: Kt,
    restricted: !0
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
  }), game.settings.register(g, "npcThreadBindings", {
    name: "CyberCall NPC Conversation Links",
    hint: "Stores GM-managed links between pseudo-NPC conversations and Foundry Actors.",
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: () => {
      q(), ne();
    }
  }), game.settings.register(g, "messageNotifications", {
    name: "Incoming Message Alerts",
    hint: "Show a brief sender notification and play a short tone when a new CyberCall message arrives.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(g, "customMessageSounds", {
    name: "GM Message Notification Sounds",
    scope: "world",
    config: !1,
    type: Object,
    default: []
  }), game.settings.register(g, "shareMessageSounds", {
    name: "Allow Uploaded Notification Sounds to Be Used by Players",
    hint: "Let players select sounds from the GM message notification sound library. Turning this off restores the built-in tone for players using a shared sound. Personal uploads follow Foundry's file permissions.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.registerMenu(g, "messageSoundMenu", {
    name: "Message Notification Sound",
    label: "Choose or Upload Sound",
    hint: "Add one or more audio files to the notification list for this world.",
    icon: "fa-solid fa-music",
    type: Qn,
    restricted: !0
  }), game.settings.register(g, "showChatCards", {
    name: "Show CyberCall Chat Cards",
    hint: "Show CyberCall message cards in Foundry's standard chat log. Disabled by default because CyberCall has its own inbox and notifications.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: () => An()
  }), game.settings.register(g, "showMessageTimestamps", {
    name: "Show Message Timestamps",
    hint: "Display the sent date and time beneath messages in CyberCall conversations.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(g, "gmViewPlayerMessages", {
    name: "GM: View Player Conversations",
    hint: "Allow GMs to see private CyberCall conversations where no GM or GM-managed NPC is a participant. Disabled by default.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: () => {
      q(), ne();
    }
  }), game.settings.register(g, "messageReadState", {
    name: "CyberCall Message Read State",
    hint: "Tracks which message threads this client has read.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(g, "messageDeletedBefore", {
    name: "CyberCall Deleted Message Threads",
    hint: "Tracks locally deleted message threads for this client.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  });
}
async function sr() {
  const e = game.settings.get(g, "contacts");
  Array.isArray(e) && await game.settings.set(g, "contacts", {
    [Ge()]: e.map(x)
  });
}
Hooks.once("init", () => {
  rr(), Nn();
});
Hooks.once("ready", async () => {
  await sr(), Nn(), ar(), game.socket.on(fe, Ja), An(), console.log(`${g} | Ready. Use game.modules.get("${g}").api.openCall({...})`);
});
Hooks.on("renderChatMessage", (e, t) => {
  vn(e, t);
});
Hooks.on("renderChatMessageHTML", (e, t) => {
  vn(e, t);
});
for (const e of ["create", "update", "delete"])
  Hooks.on(`${e}JournalEntry`, (t) => {
    ta(t) && (ne(), q());
  });
Hooks.on("createChatMessage", async (e) => {
  var o, l, u;
  const t = (o = e == null ? void 0 : e.flags) == null ? void 0 : o[g];
  if ((t == null ? void 0 : t.kind) !== Me) return;
  const n = String(((l = game.user) == null ? void 0 : l.id) ?? ""), a = Array.isArray(t.recipientUserIds) ? t.recipientUserIds.map((c) => String(c)) : [], r = ((u = game.user) == null ? void 0 : u.isGM) === !0 && !String(t.contactUserId ?? "") && (t.contactManagedByGM === !0 || t.contactIsNpc === !0), s = String(t.senderUserId ?? "") !== n && (a.includes(n) || r), i = String(t.messageType ?? "text") === "text" || t.eventType === "group-created";
  s && i && game.settings.get(g, "messageNotifications") !== !1 && tr(t), await q(), await ne();
});
document.addEventListener("click", (e) => {
  var a;
  const t = e.target, n = (a = t == null ? void 0 : t.closest) == null ? void 0 : a.call(t, "[data-cybercall-open-thread]");
  n && (e.preventDefault(), Et(n.dataset.cybercallThreadId));
});
