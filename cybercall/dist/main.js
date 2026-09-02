var Vt = Object.defineProperty;
var qt = (e, t, n) => t in e ? Vt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var D = (e, t, n) => qt(e, typeof t != "symbol" ? t + "" : t, n);
function jt(e, t) {
  return e.image ? `<img src="${t(e.image)}" alt="${t(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${t(e.initials)}</div>`;
}
function pt(e, t) {
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
    `, l = e.accepted ? "" : `<blockquote>${t(e.message)}</blockquote>`, u = e.accepted || e.outgoing ? '<button type="button" data-cybercall-action="end">End Call</button>' : `
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
        <div class="cybercall-portrait">${jt(e, t)}</div>
        ${l}
      </main>
      <footer class="cybercall-actions">
        ${u}
      </footer>
    </div>
  `;
}
function ze(e, t) {
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
      </footer>
    </section>
  `;
}
function We(e, t) {
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
      `).join("") : '<div class="cybercall-messages-empty">No messages yet.</div>', o = r.map((d) => `<option value="${t(d.id)}" ${e.selectedContactId === d.id ? "selected" : ""}>${t(d.name)} - ${t(d.number)}</option>`).join(""), i = e.canReplyAs ? `
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
      `).join("") : '<div class="cybercall-messages-empty">Select a thread or send a new message.</div>', h = `
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
  `, f = a != null && a.showNpcLinkPanel ? `
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
        ${f}
        ${e.isComposingNewGroup ? h : `
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
}, zt = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]);
function It(e) {
  const t = Number(e);
  return Number.isNaN(t) ? V.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function X(e) {
  return String(e).split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var n;
    return (n = t[0]) == null ? void 0 : n.toUpperCase();
  }).join("") || "?";
}
function be() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function le(e = {}) {
  var r;
  const t = Array.isArray(e.targetUserIds) ? e.targetUserIds.map((s) => String(s)).filter(Boolean) : [], n = Array.isArray(e.targetUserNames) ? e.targetUserNames.map((s) => String(s)).filter(Boolean) : [], a = {
    ...V,
    ...e,
    id: String(e.id ?? be()),
    callerName: String(e.callerName ?? V.callerName),
    subtitle: String(e.subtitle ?? V.subtitle),
    image: String(e.image ?? V.image),
    message: String(e.message ?? V.message),
    signal: It(e.signal ?? V.signal),
    variant: zt.has(e.variant) ? e.variant : V.variant,
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
  return a.initials = X(a.callerName), a.showBroadcast = !!((r = game == null ? void 0 : game.user) != null && r.isGM && a.allowBroadcast), a.isStandard = a.variant === "standard", a.isEmergency = a.variant === "emergency", a.isCorrupted = a.variant === "corrupted", a.isIncoming = !a.accepted, a.hasTargets = a.targetUserIds.length > 0, a.recipientLabel = a.hasTargets ? a.targetUserNames.join(", ") : "All players", a.directionLabel = a.outgoing ? `Calling ${a.recipientLabel}` : `From ${a.callerName}`, a.kicker = a.outgoing ? "Outgoing CyberCall" : a.fullscreen ? "System-wide Broadcast" : "Incoming CyberCall", a;
}
function L(e = {}) {
  const t = Array.isArray(e.userIds) ? e.userIds.map((n) => String(n)).filter(Boolean) : e.userId ? [String(e.userId)] : [];
  return {
    id: String(e.id ?? be()),
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
function Kt(e) {
  var a, r, s;
  const t = (e == null ? void 0 : e.document) ?? e, n = String(
    ((a = t == null ? void 0 : t.getTextureSrc) == null ? void 0 : a.call(t)) || ((r = t == null ? void 0 : t.texture) == null ? void 0 : r.src) || (t == null ? void 0 : t.img) || ((s = e == null ? void 0 : e.texture) == null ? void 0 : s.src) || ""
  ).trim();
  return n.includes("*") ? "" : n;
}
function Oe(e) {
  return !e || /(?:^|\/)mystery-man(?:-[^/.]+)?\.svg(?:$|\?)/i.test(e);
}
function $e(e) {
  var d, w, k, R, P, _, J, ue, F, H, te, U;
  if (!e) return "";
  const t = globalThis.game, n = globalThis.canvas, a = String(e.avatar ?? ((d = e._source) == null ? void 0 : d.avatar) ?? "").trim();
  if (e.isGM === !0) return Oe(a) ? "" : a;
  const r = e.character ?? e.characterId ?? ((w = e._source) == null ? void 0 : w.character), s = typeof r == "string" ? r : String((r == null ? void 0 : r.id) ?? (r == null ? void 0 : r._id) ?? ""), o = wt(e), i = Array.isArray((k = n == null ? void 0 : n.tokens) == null ? void 0 : k.placeables) ? n.tokens.placeables : [], l = String(((R = t == null ? void 0 : t.user) == null ? void 0 : R.id) ?? "") === String(e.id ?? "") ? ((P = n == null ? void 0 : n.tokens) == null ? void 0 : P.controlled) ?? [] : [], u = ((_ = o == null ? void 0 : o.getActiveTokens) == null ? void 0 : _.call(o, !0, !0)) ?? [], c = i.find((B) => {
    var E, q;
    const M = String(((E = B == null ? void 0 : B.actor) == null ? void 0 : E.id) ?? ((q = B == null ? void 0 : B.document) == null ? void 0 : q.actorId) ?? (B == null ? void 0 : B.actorId) ?? "");
    return s && M === s;
  }), b = i.find((B) => {
    var E, q;
    const M = (B == null ? void 0 : B.actor) ?? ((E = B == null ? void 0 : B.document) == null ? void 0 : E.actor);
    return Number(((q = M == null ? void 0 : M.ownership) == null ? void 0 : q[e.id]) ?? 0) >= 3;
  }), h = [...l, ...u, c, b].filter(Boolean).map(Kt).find(Boolean) ?? "";
  if (h) return h;
  const f = String(
    ((ue = (J = o == null ? void 0 : o.prototypeToken) == null ? void 0 : J.texture) == null ? void 0 : ue.src) || ((te = (H = (F = o == null ? void 0 : o._source) == null ? void 0 : F.prototypeToken) == null ? void 0 : H.texture) == null ? void 0 : te.src) || ""
  ).trim();
  if (f && !f.includes("*") && !Oe(f))
    return f;
  const I = String((o == null ? void 0 : o.img) ?? ((U = o == null ? void 0 : o._source) == null ? void 0 : U.img) ?? "").trim();
  return Oe(I) ? Oe(a) ? "" : a : I;
}
function wt(e) {
  var r, s, o;
  if (!e) return null;
  const t = globalThis.game, n = e.character ?? e.characterId ?? ((r = e._source) == null ? void 0 : r.character), a = typeof n == "string" ? n : String((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n._id) ?? "");
  return (a ? (o = (s = t == null ? void 0 : t.actors) == null ? void 0 : s.get) == null ? void 0 : o.call(s, a) : null) ?? (typeof n == "object" ? n : null);
}
function K(e, t = "") {
  var a;
  const n = String(((a = wt(e)) == null ? void 0 : a.name) ?? "").trim();
  return n || String((e == null ? void 0 : e.name) ?? "").trim() || t;
}
function Wt() {
  var t, n, a;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((a = game == null ? void 0 : game.release) == null ? void 0 : a.generation));
  return Number.isFinite(e) ? e : null;
}
function Yt() {
  const e = Wt();
  return e === null || e >= 13;
}
function Jt() {
  var n, a, r, s, o, i;
  const e = ((a = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : a.api) ?? ((r = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : r.api) ?? null, t = ((o = (s = globalThis.foundry) == null ? void 0 : s.applications) == null ? void 0 : o.api) ?? ((i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function Qt(e) {
  var we, v, T, Q;
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
    getContacts: b,
    getGroupContacts: h,
    getMessageContext: f,
    getRingtoneChoices: I,
    getSoundPath: d,
    getActiveContactsTab: w,
    canEditContactImages: k,
    bindCallControls: R,
    bindComposerControls: P,
    bindContactsControls: _,
    bindMessagesControls: J,
    stopRinging: ue,
    clearActiveCall: F,
    clearActiveComposer: H,
    clearActiveContacts: te,
    clearActiveMessages: U,
    clearActivePhone: B
  } = e, M = (v = (we = foundry == null ? void 0 : foundry.applications) == null ? void 0 : we.api) == null ? void 0 : v.ApplicationV2, E = (Q = (T = foundry == null ? void 0 : foundry.applications) == null ? void 0 : T.api) == null ? void 0 : Q.HandlebarsApplicationMixin, q = Jt(), ce = Yt();
  function fe() {
    const C = b(), N = h(), g = w();
    return {
      contacts: C,
      groupContacts: N,
      hasContacts: C.length > 0,
      hasGroupContacts: N.length > 0,
      activeTab: g,
      isPersonalTab: g !== "group",
      isGroupTab: g === "group",
      canEditContactImages: k(),
      canManageNpcContacts: k(),
      actors: u(),
      unreadMessageCount: f().unreadCount,
      hasUnreadMessages: f().unreadCount > 0,
      ringtoneChoices: I(),
      currentRingtone: d()
    };
  }
  function je() {
    return {
      call: l(),
      actors: u(),
      players: c(),
      ringtoneChoices: I()
    };
  }
  function he(C, N = null) {
    var gt, mt;
    const g = C === "messages", y = !g && ((gt = game.user) == null ? void 0 : gt.isGM), A = !g && !((mt = game.user) != null && mt.isGM);
    return {
      ...g ? f(N) : y ? je() : fe(),
      mode: C,
      isMessagesMode: g,
      isComposerMode: y,
      isContactsMode: A,
      isCallsMode: !g
    };
  }
  function Ce(C, N) {
    var g;
    return C === "messages" ? We(N, i) : (g = game.user) != null && g.isGM ? ze(N, i) : Ke(N, i);
  }
  function ne(C) {
    const N = document.createElement("template");
    N.innerHTML = C.trim();
    const g = N.content.firstElementChild;
    return {
      main: g instanceof HTMLElement ? g : document.createElement("div")
    };
  }
  function Ie(C, N = null) {
    var g;
    if (C.mode === "messages") {
      J(C, N);
      return;
    }
    (g = game.user) != null && g.isGM ? P(C, N) : _(C, N);
  }
  class Ge extends q {
    constructor(g, y = {}) {
      super(y);
      D(this, "callData");
      this.callData = le(g);
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
      } catch (y) {
        return console.warn(`${t} | Template render failed, using inline fallback.`, y), $(pt(this.callData, i));
      }
    }
    activateListeners(g) {
      super.activateListeners(g), R(this, g);
    }
    async close(g) {
      return F(this), ue(), super.close(g);
    }
  }
  class ke extends q {
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
    async _renderInner(N) {
      try {
        return await super._renderInner(N);
      } catch (g) {
        return console.warn(`${t} | Composer template render failed, using inline fallback.`, g), $(ze(N, i));
      }
    }
    activateListeners(N) {
      super.activateListeners(N), P(this, N);
    }
    async close(N) {
      return H(this), super.close(N);
    }
  }
  class Ue extends q {
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
      return fe();
    }
    async _renderInner(N) {
      try {
        return await super._renderInner(N);
      } catch (g) {
        return console.warn(`${t} | Contacts template render failed, using inline fallback.`, g), $(Ke(N, i));
      }
    }
    activateListeners(N) {
      super.activateListeners(N), _(this, N);
    }
    async close(N) {
      return te(this), super.close(N);
    }
  }
  class Be extends q {
    constructor(g = "calls", y = null, A = {}) {
      super(A);
      D(this, "mode");
      D(this, "contact");
      this.mode = g, this.contact = y;
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
      return he(this.mode, this.contact);
    }
    async _renderInner(g) {
      try {
        return await super._renderInner(g);
      } catch (y) {
        return console.warn(`${t} | Phone template render failed, using inline fallback.`, y), $(Ce(this.mode, g));
      }
    }
    activateListeners(g) {
      super.activateListeners(g), Ie(this, g);
    }
    async close(g) {
      return B(this), super.close(g);
    }
  }
  class Pe extends q {
    constructor(g = null, y = {}) {
      super(y);
      D(this, "contact");
      this.contact = g;
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
      return f(this.contact);
    }
    async _renderInner(g) {
      try {
        return await super._renderInner(g);
      } catch (y) {
        return console.warn(`${t} | Messages template render failed, using inline fallback.`, y), $(We(g, i));
      }
    }
    activateListeners(g) {
      super.activateListeners(g), J(this, g);
    }
    async close(g) {
      return U(this), super.close(g);
    }
  }
  function Ee() {
    var C;
    return !ce || !M || !E ? null : (C = class extends E(M) {
      constructor(y, A = {}) {
        super(A);
        D(this, "callData");
        this.callData = le(y);
      }
      async _prepareContext(y) {
        return {
          ...await super._prepareContext(y),
          call: this.callData
        };
      }
      async _renderHTML(y, A) {
        try {
          return await super._renderHTML(y, A);
        } catch (x) {
          return console.warn(`${t} | Template render failed, using inline fallback.`, x), ne(pt(this.callData, i));
        }
      }
      _onRender(y, A) {
        var x;
        (x = super._onRender) == null || x.call(this, y, A), R(this);
      }
      async close(y) {
        return F(this), ue(), super.close(y);
      }
    }, D(C, "DEFAULT_OPTIONS", {
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
    }), D(C, "PARTS", {
      main: {
        template: n
      }
    }), C);
  }
  function De() {
    var C;
    return !ce || !M || !E ? null : (C = class extends E(M) {
      async _prepareContext(g) {
        return {
          ...await super._prepareContext(g),
          call: l(),
          actors: u(),
          players: c(),
          ringtoneChoices: I()
        };
      }
      async _renderHTML(g, y) {
        try {
          return await super._renderHTML(g, y);
        } catch (A) {
          return console.warn(`${t} | Composer template render failed, using inline fallback.`, A), ne(ze(g, i));
        }
      }
      _onRender(g, y) {
        var A;
        (A = super._onRender) == null || A.call(this, g, y), P(this);
      }
      async close(g) {
        return H(this), super.close(g);
      }
    }, D(C, "DEFAULT_OPTIONS", {
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
    }), D(C, "PARTS", {
      main: {
        template: a
      }
    }), C);
  }
  function Re() {
    var C;
    return !ce || !M || !E ? null : (C = class extends E(M) {
      async _prepareContext(g) {
        return {
          ...await super._prepareContext(g),
          ...fe()
        };
      }
      async _renderHTML(g, y) {
        try {
          return await super._renderHTML(g, y);
        } catch (A) {
          return console.warn(`${t} | Contacts template render failed, using inline fallback.`, A), ne(Ke(g, i));
        }
      }
      _onRender(g, y) {
        var A;
        (A = super._onRender) == null || A.call(this, g, y), _(this);
      }
      async close(g) {
        return te(this), super.close(g);
      }
    }, D(C, "DEFAULT_OPTIONS", {
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
    }), D(C, "PARTS", {
      main: {
        template: r
      }
    }), C);
  }
  function _e() {
    var C;
    return !ce || !M || !E ? null : (C = class extends E(M) {
      constructor(y = "calls", A = null, x = {}) {
        super(x);
        D(this, "mode");
        D(this, "contact");
        this.mode = y, this.contact = A;
      }
      async _prepareContext(y) {
        return {
          ...await super._prepareContext(y),
          ...he(this.mode, this.contact)
        };
      }
      async _renderHTML(y, A) {
        try {
          return await super._renderHTML(y, A);
        } catch (x) {
          return console.warn(`${t} | Phone template render failed, using inline fallback.`, x), ne(Ce(this.mode, y));
        }
      }
      _onRender(y, A) {
        var x;
        (x = super._onRender) == null || x.call(this, y, A), Ie(this);
      }
      async close(y) {
        return B(this), super.close(y);
      }
    }, D(C, "DEFAULT_OPTIONS", {
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
    }), D(C, "PARTS", {
      main: {
        template: o
      }
    }), C);
  }
  function xe() {
    var C;
    return !ce || !M || !E ? null : (C = class extends E(M) {
      constructor(y = null, A = {}) {
        super(A);
        D(this, "contact");
        this.contact = y;
      }
      async _prepareContext(y) {
        return {
          ...await super._prepareContext(y),
          ...f(this.contact)
        };
      }
      async _renderHTML(y, A) {
        try {
          return await super._renderHTML(y, A);
        } catch (x) {
          return console.warn(`${t} | Messages template render failed, using inline fallback.`, x), ne(We(y, i));
        }
      }
      _onRender(y, A) {
        var x;
        (x = super._onRender) == null || x.call(this, y, A), J(this);
      }
      async close(y) {
        return U(this), super.close(y);
      }
    }, D(C, "DEFAULT_OPTIONS", {
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
    }), D(C, "PARTS", {
      main: {
        template: s
      }
    }), C);
  }
  return {
    CyberCallApplication: Ee() ?? Ge,
    CyberCallComposer: De() ?? ke,
    CyberCallContacts: Re() ?? Ue,
    CyberCallMessages: xe() ?? Pe,
    CyberCallPhone: _e() ?? Be
  };
}
const p = "cybercall", ie = `module.${p}`, Xt = `modules/${p}/templates/cybercall.hbs`, Zt = `modules/${p}/templates/cybercall-composer.hbs`, Ht = `modules/${p}/templates/cybercall-contacts.hbs`, en = `modules/${p}/templates/cybercall-messages.hbs`, tn = `modules/${p}/templates/cybercall-phone.hbs`, pe = "phoneMessage", Nt = 3, vt = {
  "": "Silent",
  [`modules/${p}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${p}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${p}/audio/Ringtone3.ogg`]: "Ringtone 3"
};
function de(e) {
  var n;
  if ((n = foundry == null ? void 0 : foundry.utils) != null && n.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
function G(e, t = "") {
  return String(e ?? t).trim();
}
function oe(e) {
  return [...new Set(e.map((t) => G(t)).filter(Boolean))];
}
function nn() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function St(e) {
  const t = G(e, "cybercall");
  let n = 0;
  for (let a = 0; a < t.length; a += 1)
    n = (n << 5) - n + t.charCodeAt(a) | 0;
  return `tone-${Math.abs(n) % 8 + 1}`;
}
function bt(e, t) {
  return ["direct", ...[e, t].sort()].join(":");
}
function an() {
  return `msg-${be()}`;
}
function rn(e = be()) {
  return `group:${G(e)}`;
}
function Me(e, t = ((n) => (n = game == null ? void 0 : game.user) == null ? void 0 : n.id)()) {
  const a = L(e);
  if (e != null && e.userId)
    return bt(`user:${G(t, "unknown")}`, `user:${G(e.userId)}`);
  const r = a.number || a.id || a.name;
  return bt(`user:${G(t, "unknown")}`, `contact:${r}`);
}
function Qe(e = {}) {
  var t;
  return {
    id: G(e.id) || an(),
    threadId: G(e.threadId) || Me({ number: ((t = e.recipientNumbers) == null ? void 0 : t[0]) ?? e.senderNumber }),
    senderUserId: G(e.senderUserId),
    senderActorId: G(e.senderActorId),
    senderName: G(e.senderName, "Unknown Sender"),
    senderNumber: G(e.senderNumber),
    senderImage: G(e.senderImage),
    recipientUserIds: oe(e.recipientUserIds ?? []),
    recipientActorIds: oe(e.recipientActorIds ?? []),
    recipientNumbers: oe(e.recipientNumbers ?? []),
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
    groupMemberUserIds: oe(e.groupMemberUserIds ?? []),
    groupMemberNames: oe(e.groupMemberNames ?? []),
    createdAt: G(e.createdAt) || nn(),
    chatMessageId: G(e.chatMessageId),
    schemaVersion: Number(e.schemaVersion ?? Nt)
  };
}
function At(e, t = [], n = "", a = {}) {
  const r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (const i of t) {
    const l = L(i), u = { ...l, userId: i == null ? void 0 : i.userId, userIds: (i == null ? void 0 : i.userIds) ?? l.userIds };
    l.number && r.set(l.number, u), i != null && i.userId && s.set(String(i.userId), u);
  }
  const o = /* @__PURE__ */ new Map();
  for (const i of e.map(Qe).filter((l) => l.body)) {
    const l = o.get(i.threadId) ?? [];
    l.push(i), o.set(i.threadId, l);
  }
  return [...o.entries()].map(([i, l]) => {
    var Ce, ne, Ie, Ge, ke, Ue, Be, Pe, Ee, De, Re, _e, xe, we;
    const u = l.sort((v, T) => v.createdAt.localeCompare(T.createdAt)), c = u[u.length - 1] ?? null, b = [...u].reverse().find((v) => v.conversationType === "group" || v.groupId), h = !!b, f = (b == null ? void 0 : b.groupId) || (h ? i.replace(/^group:/, "") : ""), I = (b == null ? void 0 : b.groupName) || (h ? "Group Chat" : ""), d = h ? oe(u.flatMap((v) => [
      ...v.groupMemberUserIds,
      v.senderUserId,
      ...v.recipientUserIds
    ])) : [], w = h ? oe(u.flatMap((v) => v.groupMemberNames)) : [], k = w.length ? w : d.map((v) => {
      var T, Q;
      return K((Q = (T = game.users) == null ? void 0 : T.get) == null ? void 0 : Q.call(T, v));
    }).filter(Boolean), R = (c == null ? void 0 : c.senderUserId) === ((Ce = game == null ? void 0 : game.user) == null ? void 0 : Ce.id) ? (ne = c == null ? void 0 : c.recipientUserIds) == null ? void 0 : ne.find((v) => {
      var T;
      return v !== ((T = game == null ? void 0 : game.user) == null ? void 0 : T.id);
    }) : c == null ? void 0 : c.senderUserId, P = (c == null ? void 0 : c.senderUserId) === ((Ie = game == null ? void 0 : game.user) == null ? void 0 : Ie.id) ? ((Ge = c == null ? void 0 : c.recipientNumbers) == null ? void 0 : Ge[0]) || "" : (c == null ? void 0 : c.senderNumber) || ((ke = c == null ? void 0 : c.recipientNumbers) == null ? void 0 : ke[0]) || "", _ = c != null && c.contactName && !(c != null && c.contactUserId) && (c.contactIsNpc || c.contactManagedByGM) ? {
      id: `contact-${((Ue = c.recipientNumbers) == null ? void 0 : Ue[0]) || c.senderNumber || i}`,
      name: c.contactName,
      number: ((Be = c.recipientNumbers) == null ? void 0 : Be[0]) || c.senderNumber || "",
      image: c.contactImage || "",
      actorId: ((Pe = c.recipientActorIds) == null ? void 0 : Pe[0]) ?? c.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: X(c.contactName)
    } : null, J = (c == null ? void 0 : c.senderUserId) !== ((Ee = game == null ? void 0 : game.user) == null ? void 0 : Ee.id) && (c != null && c.senderNumber) && (c != null && c.contactName) ? {
      id: `contact-${c.senderNumber || i}`,
      name: c.contactName,
      number: c.senderNumber,
      image: c.contactImage || "",
      actorId: c.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: X(c.contactName)
    } : null, F = (h ? {
      id: `group-${f || i}`,
      name: I,
      number: `${d.length} member${d.length === 1 ? "" : "s"}`,
      image: "",
      actorId: "",
      userId: "",
      userIds: d.filter((v) => {
        var T;
        return v !== ((T = game == null ? void 0 : game.user) == null ? void 0 : T.id);
      }),
      managedByGM: !1,
      isNpc: !1,
      isGroup: !0,
      initials: X(I)
    } : null) ?? _ ?? J ?? s.get(R) ?? r.get(P) ?? {
      id: `contact-${P || i}`,
      name: (c == null ? void 0 : c.contactName) || ((c == null ? void 0 : c.senderUserId) === ((De = game == null ? void 0 : game.user) == null ? void 0 : De.id) ? P || "Unknown Contact" : (c == null ? void 0 : c.senderName) || P || "Unknown Contact"),
      number: P,
      image: (c == null ? void 0 : c.contactImage) || "",
      actorId: ((Re = c == null ? void 0 : c.recipientActorIds) == null ? void 0 : Re[0]) ?? "",
      userId: "",
      userIds: [],
      managedByGM: !!(c != null && c.contactName || (_e = c == null ? void 0 : c.recipientActorIds) != null && _e[0]),
      isNpc: !!(c != null && c.contactName || (xe = c == null ? void 0 : c.recipientActorIds) != null && xe[0]),
      initials: X((c == null ? void 0 : c.contactName) || (c == null ? void 0 : c.senderName) || P)
    }, H = h ? null : [...u].reverse().find(
      (v) => v.senderUserId === R && v.senderImage
    ), te = [...u].reverse().find((v) => {
      var Q, C;
      const T = (C = (Q = game.users) == null ? void 0 : Q.get) == null ? void 0 : C.call(Q, v.senderUserId);
      return v.senderUserId && (T == null ? void 0 : T.isGM) !== !0 && !v.contactUserId && !!v.contactName && (v.contactIsNpc || v.contactManagedByGM);
    }) ?? null, U = ((we = game == null ? void 0 : game.user) == null ? void 0 : we.isGM) === !0 ? te : null, B = U ? `TO: ${U.contactName}` : "", M = U ? s.get(U.senderUserId) : null, E = (U == null ? void 0 : U.senderName) || (M == null ? void 0 : M.name) || F.name || (c == null ? void 0 : c.senderName) || "Unknown Contact", q = U ? (M == null ? void 0 : M.number) || `@${U.senderName}` : F.number || (c == null ? void 0 : c.senderNumber) || "", ce = U ? X(E) : F.initials || X(F.name || (c == null ? void 0 : c.senderName)), fe = (U == null ? void 0 : U.senderImage) || (M == null ? void 0 : M.image) || (H == null ? void 0 : H.senderImage) || F.image || "", je = a[i] ?? "", he = u.filter(
      (v) => {
        var T;
        return v.senderUserId !== ((T = game == null ? void 0 : game.user) == null ? void 0 : T.id) && v.createdAt > je;
      }
    );
    return {
      id: i,
      title: E,
      subtitle: q,
      initials: ce,
      image: fe,
      avatarTone: St(h ? f || i : (U == null ? void 0 : U.senderUserId) || F.userId || F.number || i),
      routeLabel: B,
      hasRouteLabel: !!B,
      isNpcRouted: !!te,
      contact: F,
      messages: u.map((v) => {
        var T;
        return {
          ...v,
          isMine: v.senderUserId === ((T = game == null ? void 0 : game.user) == null ? void 0 : T.id),
          isEvent: v.messageType !== "text"
        };
      }),
      lastMessage: c,
      lastPreview: (c == null ? void 0 : c.body) ?? "",
      updatedAt: (c == null ? void 0 : c.createdAt) ?? "",
      unread: he.length > 0,
      unreadCount: he.length,
      active: i === n,
      isGroup: h,
      groupId: f,
      groupName: I,
      groupMemberUserIds: d,
      groupMemberNames: k
    };
  }).sort((i, l) => l.updatedAt.localeCompare(i.updatedAt));
}
function sn(e) {
  var n, a, r;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[p]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, p, "message"));
  return (t == null ? void 0 : t.kind) === pe ? t : ((r = t == null ? void 0 : t.message) == null ? void 0 : r.kind) === pe ? t.message : null;
}
function cn(e) {
  return String(e != null && e.timestamp ? new Date(e.timestamp).toISOString() : (e == null ? void 0 : e.createdTime) ?? "");
}
function on() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => t.id);
}
function Xe(e) {
  return [...new Set(e.map((t) => String(t ?? "").trim()).filter(Boolean))];
}
function ln(e) {
  const t = Array.isArray(e == null ? void 0 : e.whisper) ? e.whisper : [];
  return Xe(t.map((n) => (n == null ? void 0 : n.id) ?? n));
}
function un(e, t) {
  var s, o;
  const n = String(((s = game.user) == null ? void 0 : s.id) ?? "").trim();
  if (!n) return !1;
  if (e.senderUserId === n || e.recipientUserIds.includes(n)) return !0;
  if (((o = game.user) == null ? void 0 : o.isGM) === !0)
    return !e.contactUserId && (e.contactManagedByGM || e.contactIsNpc) ? !0 : game.settings.get(p, "gmViewPlayerMessages") === !0;
  const r = ln(t);
  return r.length && !r.includes(n), !1;
}
function dn(e) {
  const t = Array.isArray(e == null ? void 0 : e.userIds) ? e.userIds : e != null && e.userId ? [e.userId] : [], n = Xe(t);
  return n.length ? n : on();
}
function gn(e) {
  return !!(e != null && e.userId || Array.isArray(e == null ? void 0 : e.userIds) && e.userIds.length);
}
function mn(e, t) {
  const n = e.senderName || "CyberCall", a = t != null && t.name ? `<span>${de(t.name)}</span>` : "";
  return `
    <div class="cybercall-chat-card${e.messageType !== "text" ? " cybercall-chat-card--event" : ""}" data-cybercall-thread-id="${de(e.threadId)}">
      <strong>${de(n)}</strong>
      ${a}
      <p>${de(e.body)}</p>
      <button type="button" data-cybercall-open-thread data-cybercall-thread-id="${de(e.threadId)}">Open CyberCall</button>
    </div>
  `;
}
function pn() {
  var t;
  return (((t = game.messages) == null ? void 0 : t.contents) ?? []).map((n) => {
    const a = sn(n);
    if (!a) return null;
    const r = Qe({
      ...a,
      chatMessageId: n.id,
      createdAt: a.createdAt || cn(n)
    });
    return un(r, n) ? r : null;
  }).filter(Boolean);
}
async function Ze(e, t, n = {}) {
  var I;
  const a = L(e), r = String(t ?? "").trim();
  if (!r) return null;
  const s = game.user, o = n.recipientUserIds ? Xe(n.recipientUserIds) : dn(e), i = !gn(e), l = String(n.threadId ?? Me(e, s == null ? void 0 : s.id)), u = String(n.senderName ?? "").trim() || K(s, "Unknown Sender"), c = String(n.senderActorId ?? ((I = s == null ? void 0 : s.character) == null ? void 0 : I.id) ?? "").trim(), b = String(n.senderNumber ?? "").trim(), h = Qe({
    threadId: l,
    senderUserId: (s == null ? void 0 : s.id) ?? "",
    senderActorId: c,
    senderName: u,
    senderNumber: b,
    senderImage: String(n.senderImage ?? $e(s)).trim(),
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
    schemaVersion: Nt
  }), f = [...new Set([s == null ? void 0 : s.id, ...o].filter(Boolean))];
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: h.senderName }),
    whisper: f,
    content: mn(h, a),
    flags: {
      [p]: {
        kind: pe,
        ...h
      }
    }
  });
}
async function bn(e, t, n = {}) {
  return Ze(e, t, {
    ...n,
    messageType: n.messageType ?? "event"
  });
}
let m = null, S = null, ve = null, Z = null, W = null, ge = "personal", O = "", Y = !1, z = !1, ae = null, me = null;
function yn() {
  var e, t, n, a, r, s, o, i;
  return le({
    callerName: ((e = m == null ? void 0 : m.callData) == null ? void 0 : e.callerName) ?? V.callerName,
    subtitle: ((t = m == null ? void 0 : m.callData) == null ? void 0 : t.subtitle) ?? V.subtitle,
    image: ((n = m == null ? void 0 : m.callData) == null ? void 0 : n.image) ?? "",
    message: ((a = m == null ? void 0 : m.callData) == null ? void 0 : a.message) ?? V.message,
    signal: ((r = m == null ? void 0 : m.callData) == null ? void 0 : r.signal) ?? game.settings.get(p, "defaultSignal"),
    variant: ((s = m == null ? void 0 : m.callData) == null ? void 0 : s.variant) ?? "standard",
    fullscreen: ((o = m == null ? void 0 : m.callData) == null ? void 0 : o.fullscreen) ?? !1,
    ringing: ((i = m == null ? void 0 : m.callData) == null ? void 0 : i.ringing) ?? !0
  });
}
function fn() {
  var e;
  return (((e = game.actors) == null ? void 0 : e.contents) ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    img: t.img ?? ""
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function hn() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => !t.isGM).map((t) => ({
    id: t.id,
    name: K(t, "Unknown Player"),
    active: t.active === !0
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function Cn() {
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
function In() {
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
      image: $e(t),
      userId: t.id,
      userIds: [t.id],
      isNpc: !1,
      managedByGM: !1
    };
  }).sort((t, n) => t.name.localeCompare(n.name));
}
function Ve() {
  var e, t;
  return String(((e = game.world) == null ? void 0 : e.id) ?? ((t = game.world) == null ? void 0 : t.title) ?? "default");
}
function $t() {
  const e = game.settings.get(p, "contacts");
  return Array.isArray(e) ? { [Ve()]: e } : !e || typeof e != "object" ? {} : e;
}
function ye() {
  const e = $t()[Ve()];
  return Array.isArray(e) ? e.map(L).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function re() {
  if (Array.isArray(me))
    return me.map(L).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name));
  const e = game.settings.get(p, "groupContacts");
  return Array.isArray(e) ? e.map(L).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function He() {
  const e = /* @__PURE__ */ new Map();
  for (const t of [...In(), ...re(), ...ye()]) {
    const n = t.userId ? `user:${t.userId}` : `number:${t.number || t.id}`;
    e.has(n) || e.set(n, t);
  }
  return [...e.values()].sort((t, n) => t.name.localeCompare(n.name));
}
async function Mt(e) {
  await game.settings.set(p, "contacts", {
    ...$t(),
    [Ve()]: e.map(L)
  });
}
async function Le(e) {
  me = e.map(L), await game.settings.set(p, "groupContacts", me), game.socket.emit(ie, {
    action: "groupContactsChanged",
    contacts: me
  });
}
function et() {
  const e = game.settings.get(p, "messageReadState");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function Tt() {
  const e = game.settings.get(p, "messageDeletedBefore");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function tt() {
  const e = game.settings.get(p, "npcThreadBindings");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
async function Je(e, t) {
  var a;
  if (!((a = game.user) != null && a.isGM) || !e) return;
  const n = { ...tt() };
  t === null ? delete n[e] : n[e] = { ...n[e] ?? {}, ...t }, await game.settings.set(p, "npcThreadBindings", n);
}
function Gt() {
  const e = Tt();
  return pn().filter((t) => {
    const n = e[t.threadId];
    return !n || t.createdAt > n;
  });
}
function kt() {
  return At(Gt(), He(), "", et()).reduce((e, t) => e + Number(t.unreadCount ?? 0), 0);
}
async function wn(e, t = (/* @__PURE__ */ new Date()).toISOString()) {
  e && await game.settings.set(p, "messageReadState", {
    ...et(),
    [e]: t
  });
}
async function Se() {
  O && await wn(O);
}
async function Nn(e) {
  e && (await game.settings.set(p, "messageDeletedBefore", {
    ...Tt(),
    [e]: (/* @__PURE__ */ new Date()).toISOString()
  }), O === e && (O = "", Y = !0, z = !1, W && (W.contact = null), (S == null ? void 0 : S.mode) === "messages" && (S.contact = null)), await j(), await ee());
}
async function vn(e, t, n = "personal", a = "", r = {}) {
  var l, u, c, b, h, f, I;
  const s = r.actorId ? (l = game.actors) == null ? void 0 : l.get(r.actorId) : null, o = L({
    name: String(e ?? "").trim() || (s == null ? void 0 : s.name),
    number: t,
    image: Ne() && (String(a ?? "").trim() || (s == null ? void 0 : s.img)) || "",
    actorId: Ne() ? r.actorId : "",
    managedByGM: Ne() ? r.managedByGM === !0 : !1,
    isNpc: Ne() ? r.isNpc === !0 || r.managedByGM === !0 || !!r.actorId : !1
  });
  if (!o.name || !o.number) {
    (c = (u = ui.notifications) == null ? void 0 : u.warn) == null || c.call(u, "Contact name and number are required.");
    return;
  }
  if (n === "group" && !game.user.isGM) {
    if (!nt()) {
      (h = (b = ui.notifications) == null ? void 0 : b.warn) == null || h.call(b, "A GM must be connected to update group contacts.");
      return;
    }
    game.socket.emit(ie, {
      action: "groupContactAdd",
      contact: o
    }), (I = (f = ui.notifications) == null ? void 0 : f.info) == null || I.call(f, "Group contact update sent to the GM.");
    return;
  }
  const i = n === "group" ? re() : ye();
  i.push(o), n === "group" ? await Le(i) : await Mt(i), await ee();
}
async function Sn(e, t = "personal") {
  var n, a, r, s;
  if (t === "group") {
    if (!game.user.isGM) {
      if (!nt()) {
        (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(ie, {
        action: "groupContactRemove",
        contactId: e
      }), (s = (r = ui.notifications) == null ? void 0 : r.info) == null || s.call(r, "Group contact removal sent to the GM.");
      return;
    }
    await Le(re().filter((o) => o.id !== e));
  } else
    await Mt(ye().filter((o) => o.id !== e));
  await ee();
}
function nt() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function qe(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(p, "minimumRole");
  } catch (n) {
    console.warn(`${p} | Permission setting unavailable, using Player role fallback.`, n);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function Ne(e = game.user) {
  return !!(e != null && e.isGM);
}
function Te(e, t = null) {
  var n;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (n = e.element) != null && n[0] ? e.element[0] : e.element ?? null;
}
const An = 24;
function $n(e) {
  var s, o, i;
  const t = Te(e), n = (s = t == null ? void 0 : t.querySelector) == null ? void 0 : s.call(t, ".cybercall-message-log");
  if (!(n instanceof HTMLElement)) return null;
  const a = (o = t.querySelector) == null ? void 0 : o.call(t, "[data-cybercall-active-thread]"), r = n.scrollHeight - n.clientHeight - n.scrollTop;
  return {
    threadId: String(((i = a == null ? void 0 : a.dataset) == null ? void 0 : i.cybercallActiveThread) ?? ""),
    scrollTop: n.scrollTop,
    stickToBottom: r <= An
  };
}
function Mn(e, t) {
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
function Tn(e, t = null) {
  const n = Te(e, t);
  n && (n.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), n.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), n.classList.toggle("cybercall-connected", e.callData.accepted), n.querySelectorAll("[data-cybercall-action]").forEach((a) => {
    a.addEventListener("click", async (r) => {
      const s = r.currentTarget.dataset.cybercallAction;
      if (s === "accept") {
        await Yn(e.callData.id);
        return;
      }
      if (s === "broadcast") {
        lt({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (s === "decline" || s === "end") && await Dt(e.callData.id);
    });
  }));
}
function Gn(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-composer]");
}
function yt(e) {
  var l, u;
  const t = new FormData(e), n = (l = game.actors) == null ? void 0 : l.get(t.get("actorId")), a = String(t.get("image") ?? "").trim() || (n == null ? void 0 : n.img) || "", r = String(t.get("callerName") ?? "").trim() || (n == null ? void 0 : n.name) || "UNKNOWN CALLER", s = t.getAll("targetUserIds").map((c) => String(c)).filter(Boolean), o = new Map((((u = game.users) == null ? void 0 : u.contents) ?? []).map((c) => [c.id, c])), i = s.map((c) => K(o.get(c)) || c);
  return le({
    callerName: r,
    subtitle: String(t.get("subtitle") ?? "").trim(),
    image: a,
    message: String(t.get("message") ?? "").trim(),
    signal: t.get("signal"),
    variant: String(t.get("variant") ?? V.variant),
    fullscreen: t.get("fullscreen") === "on",
    ringing: t.get("ringing") === "on",
    targetUserIds: s,
    targetUserNames: i
  });
}
function Ye(e) {
  var a, r;
  const t = (a = e == null ? void 0 : e.elements) == null ? void 0 : a.signal, n = (r = e == null ? void 0 : e.querySelector) == null ? void 0 : r.call(e, "[data-cybercall-signal-output]");
  !t || !n || (n.textContent = `${It(t.value)}%`);
}
function kn(e, t = null) {
  var s, o;
  const n = Te(e, t), a = Gn(n);
  if (!n || !a) return;
  Ye(a);
  const r = n.querySelector("[data-cybercall-ringtone]");
  r && r.addEventListener("change", async (i) => {
    await game.settings.set(p, "ringSound", i.currentTarget.value);
  }), (s = a.elements.signal) == null || s.addEventListener("input", () => Ye(a)), (o = a.elements.actorId) == null || o.addEventListener("change", () => {
    var l;
    const i = (l = game.actors) == null ? void 0 : l.get(a.elements.actorId.value);
    i && (a.elements.callerName.value = i.name, a.elements.image.value = i.img ?? "");
  }), a.addEventListener("submit", (i) => {
    i.preventDefault(), se(yt(a));
  }), n.querySelectorAll("[data-cybercall-compose-action]").forEach((i) => {
    i.addEventListener("click", async (l) => {
      var b, h, f, I, d, w, k;
      const u = l.currentTarget.dataset.cybercallComposeAction, c = yt(a);
      if (u === "preview") {
        await se(c);
        return;
      }
      if (u === "broadcast") {
        await lt(c);
        return;
      }
      if (u === "close-active") {
        Dt((b = m == null ? void 0 : m.callData) == null ? void 0 : b.id);
        return;
      }
      if (u === "browse-image") {
        const R = a.elements.image, P = globalThis.FilePicker ?? ((I = (f = (h = globalThis.foundry) == null ? void 0 : h.applications) == null ? void 0 : f.apps) == null ? void 0 : I.FilePicker);
        if (!R || !P) {
          (w = (d = ui.notifications) == null ? void 0 : d.warn) == null || w.call(d, "Foundry FilePicker is unavailable.");
          return;
        }
        const _ = new P({
          type: "image",
          current: R.value,
          callback: (J) => {
            R.value = J, R.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof _.browse == "function" ? _.browse() : (k = _.render) == null || k.call(_, !0);
        return;
      }
      if (u === "reset") {
        a.reset(), Ye(a);
        return;
      }
      u === "open-messages" && await Ae();
    });
  });
}
function Un(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function Bn(e, t = null) {
  var s, o;
  const n = Te(e, t), a = Un(n);
  if (!n || !a) return;
  a.addEventListener("submit", async (i) => {
    var c;
    i.preventDefault();
    const l = new FormData(a), u = String(l.get("scope") ?? ge);
    await vn(l.get("name"), l.get("number"), u, l.get("image"), {
      actorId: l.get("actorId"),
      managedByGM: l.get("managedByGM") === "on",
      isNpc: l.get("managedByGM") === "on" || !!l.get("actorId")
    }), a.reset(), a.elements.scope.value = u, (c = a.elements.name) == null || c.focus();
  }), (s = a.elements.actorId) == null || s.addEventListener("change", () => {
    var l;
    const i = (l = game.actors) == null ? void 0 : l.get(a.elements.actorId.value);
    i && (a.elements.name.value || (a.elements.name.value = i.name), a.elements.image && !a.elements.image.value && (a.elements.image.value = i.img ?? ""), a.elements.managedByGM && (a.elements.managedByGM.checked = !0));
  }), n.querySelectorAll("[data-cybercall-contact-tab]").forEach((i) => {
    i.addEventListener("click", (l) => {
      ge = l.currentTarget.dataset.cybercallContactTab, n.querySelectorAll("[data-cybercall-contact-tab]").forEach((u) => {
        u.classList.toggle("active", u.dataset.cybercallContactTab === ge);
      }), n.querySelectorAll("[data-cybercall-contact-panel]").forEach((u) => {
        u.hidden = u.dataset.cybercallContactPanel !== ge;
      }), a.elements.scope && (a.elements.scope.value = ge);
    });
  });
  const r = n.querySelector("[data-cybercall-ringtone]");
  r && r.addEventListener("change", async (i) => {
    await game.settings.set(p, "ringSound", i.currentTarget.value);
  }), n.querySelectorAll("[data-cybercall-contact-action]").forEach((i) => {
    i.addEventListener("click", async (l) => {
      const u = l.currentTarget.dataset.cybercallContactAction, c = l.currentTarget.dataset.contactId, b = l.currentTarget.dataset.contactScope ?? "personal", f = (b === "group" ? re() : ye()).find((I) => I.id === c);
      if (u === "remove") {
        await Sn(c, b);
        return;
      }
      if (u === "call" && f) {
        await Zn(f) && Z === e && await e.close();
        return;
      }
      u === "message" && f && await Ae(f);
    });
  }), (o = n.querySelector("[data-cybercall-open-messages]")) == null || o.addEventListener("click", async () => {
    await Ae();
  });
}
function Pn(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
function En(e) {
  var c, b, h, f, I, d, w;
  const t = tt()[e.id] ?? null, n = ((c = game.user) == null ? void 0 : c.isGM) === !0, a = !!(!e.isGroup && e.contact && !e.contact.userId && (e.contact.isNpc || e.contact.managedByGM || e.isNpcRouted)), r = t != null && t.actorId ? (h = (b = game.actors) == null ? void 0 : b.get) == null ? void 0 : h.call(b, t.actorId) : null, s = String((r == null ? void 0 : r.name) ?? (t == null ? void 0 : t.actorName) ?? "").trim(), o = String((t == null ? void 0 : t.image) ?? ((I = (f = r == null ? void 0 : r.prototypeToken) == null ? void 0 : f.texture) == null ? void 0 : I.src) ?? (r == null ? void 0 : r.img) ?? "").trim(), i = (t == null ? void 0 : t.revealPortrait) === !0, l = e.isNpcRouted === !0, u = t || l ? {
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
    npcBindingName: s || ((d = e.contact) == null ? void 0 : d.name) || "Linked NPC",
    npcBindingImage: o,
    npcBindingInitials: X(s || ((w = e.contact) == null ? void 0 : w.name) || "NPC"),
    npcPortraitRevealed: i,
    npcBindingStatusLabel: t ? `Linked to ${s || "Actor"}` : "Unlinked NPC contact"
  };
}
function at(e = null) {
  var f, I, d;
  let t = He();
  const n = e ?? t[0] ?? null;
  n && !t.some((w) => w.id === n.id || w.number === n.number) && (t = [...t, L(n)].sort((w, k) => w.name.localeCompare(k.name)));
  const a = Y || z ? "" : O, r = At(Gt(), t, a, et()).map((w) => ({
    ...En(w),
    messages: w.messages.map((k) => ({
      ...k,
      createdAtLabel: Pn(k.createdAt)
    }))
  })), s = Y || z ? null : r.find((w) => w.id === O) ?? null;
  s != null && s.contact && !t.some((w) => w.id === s.contact.id || w.number === s.contact.number) && (t = [...t, s.contact].sort((w, k) => w.name.localeCompare(k.name)));
  const o = ((f = s == null ? void 0 : s.contact) == null ? void 0 : f.id) ?? (n == null ? void 0 : n.id) ?? "", i = kt(), l = Ut(s, { excludeGMs: !1 }), u = _n(s), c = Bt(), b = ((I = game.user) == null ? void 0 : I.isGM) === !0 && !s && c.length > 1, h = Cn();
  return {
    threads: r,
    hasThreads: r.length > 0,
    unreadCount: i,
    hasUnreadMessages: i > 0,
    activeThread: s,
    activeThreadId: (s == null ? void 0 : s.id) ?? a,
    allContacts: t.map((w) => ({
      ...w,
      selected: w.id === o
    })),
    hasContacts: t.length > 0,
    selectedContactId: o,
    isThreadReply: !!s,
    isComposingNewMessage: !s && !z,
    isComposingNewGroup: z,
    groupMemberChoices: h,
    hasGroupMemberChoices: h.length > 0,
    canDeleteThread: !!s,
    threadReplyLabel: s ? `${s.title}${s.subtitle ? ` (${s.subtitle})` : ""}` : "",
    canReplyAs: u.length > 1,
    replyAsChoices: u,
    canSendAs: b,
    sendAsChoices: c,
    activeThreadRecipientUserIds: l,
    showMessageTimestamps: game.settings.get(p, "showMessageTimestamps") === !0,
    gmViewPlayerMessagesEnabled: game.settings.get(p, "gmViewPlayerMessages") === !0,
    isFoundryV13Plus: Number(((d = game.release) == null ? void 0 : d.generation) ?? 0) >= 13
  };
}
function Dn(e, t = at()) {
  const n = String(new FormData(e).get("contactId") ?? "");
  return t.allContacts.find((a) => a.id === n) ?? null;
}
function Ut(e, t = {}) {
  var s, o, i;
  if (!((s = e == null ? void 0 : e.messages) != null && s.length)) return [];
  const n = String(((o = game.user) == null ? void 0 : o.id) ?? ""), a = new Set((((i = game.users) == null ? void 0 : i.contents) ?? []).filter((l) => l.isGM).map((l) => String(l.id))), r = /* @__PURE__ */ new Set();
  for (const l of e.messages) {
    l.senderUserId && l.senderUserId !== n && !(t.excludeGMs && a.has(l.senderUserId)) && r.add(l.senderUserId);
    for (const u of l.recipientUserIds ?? [])
      u && u !== n && !(t.excludeGMs && a.has(u)) && r.add(u);
  }
  return [...r];
}
function Rn() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => String(t.id)).filter(Boolean);
}
function _n(e) {
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
function Bt() {
  var n, a;
  const e = [{
    id: "self",
    label: K(game.user, "Me"),
    selected: !0,
    contact: null
  }];
  if (!((n = game.user) != null && n.isGM)) return e;
  const t = /* @__PURE__ */ new Set();
  for (const r of [...re(), ...ye()].map(L)) {
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
function ft(e) {
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
function xn(e, t) {
  var s, o;
  const n = new FormData(e);
  if (t.activeThread)
    return String(n.get("replyAs") ?? "self") === "contact" && ((s = game.user) != null && s.isGM) && t.activeThread.contact ? ft(t.activeThread.contact) : {};
  const a = String(n.get("sendAs") ?? "self");
  if (a === "self" || !((o = game.user) != null && o.isGM)) return {};
  const r = Bt().find((i) => i.id === a);
  return ft(r == null ? void 0 : r.contact);
}
function On(e) {
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
function ht(e) {
  var n, a, r, s, o, i;
  const t = String(
    ((n = e == null ? void 0 : e.getTextureSrc) == null ? void 0 : n.call(e)) || ((a = e == null ? void 0 : e.texture) == null ? void 0 : a.src) || ((s = (r = e == null ? void 0 : e.document) == null ? void 0 : r.texture) == null ? void 0 : s.src) || ((i = (o = e == null ? void 0 : e.prototypeToken) == null ? void 0 : o.texture) == null ? void 0 : i.src) || (e == null ? void 0 : e.img) || ""
  ).trim();
  return t.includes("*") ? String((e == null ? void 0 : e.img) ?? "").trim() : t;
}
async function Ln(e) {
  var o, i, l, u, c, b, h, f;
  const t = On(e), n = globalThis.fromUuid;
  let a = t.uuid && n ? await n(t.uuid) : null;
  !a && t.sceneId && t.tokenId && (a = ((c = (u = (l = (i = (o = game.scenes) == null ? void 0 : o.get) == null ? void 0 : i.call(o, t.sceneId)) == null ? void 0 : l.tokens) == null ? void 0 : u.get) == null ? void 0 : c.call(u, t.tokenId)) ?? null);
  const r = String(
    ((b = a == null ? void 0 : a.actor) == null ? void 0 : b.id) || (a == null ? void 0 : a.actorId) || ((a == null ? void 0 : a.documentName) === "Actor" ? a.id : "") || t.actorId || (t.type === "Actor" ? t.id : "") || ""
  ).trim(), s = (a == null ? void 0 : a.documentName) === "Actor" ? a : (a == null ? void 0 : a.actor) ?? (r ? (f = (h = game.actors) == null ? void 0 : h.get) == null ? void 0 : f.call(h, r) : null);
  return s ? {
    actorId: String(s.id ?? r),
    actorUuid: String(s.uuid ?? `Actor.${s.id ?? r}`),
    actorName: String(s.name ?? "Linked NPC"),
    image: ht(a) || ht(s),
    revealPortrait: !1,
    linkedAt: (/* @__PURE__ */ new Date()).toISOString()
  } : null;
}
async function Fn(e, t) {
  var a, r, s, o, i;
  if (!((a = game.user) != null && a.isGM) || !t) return;
  e.preventDefault(), e.stopPropagation();
  const n = await Ln(e);
  if (!n) {
    (s = (r = ui.notifications) == null ? void 0 : r.warn) == null || s.call(r, "Drop an Actor or an Actor-backed Token to link this NPC contact.");
    return;
  }
  await Je(t, n), (i = (o = ui.notifications) == null ? void 0 : o.info) == null || i.call(o, `Linked this NPC conversation to ${n.actorName}.`), await j();
}
async function Vn(e, t) {
  var f, I, d, w, k;
  const n = new FormData(e), a = String(n.get("groupName") ?? "").trim(), r = [...new Set(n.getAll("memberUserIds").map((R) => String(R)).filter(Boolean))];
  if (!a) {
    (I = (f = ui.notifications) == null ? void 0 : f.warn) == null || I.call(f, "Enter a name for the group chat.");
    return;
  }
  if (!r.length) {
    (w = (d = ui.notifications) == null ? void 0 : d.warn) == null || w.call(d, "Select at least one other player for the group chat.");
    return;
  }
  const s = String(((k = game.user) == null ? void 0 : k.id) ?? ""), o = [...new Set([s, ...r].filter(Boolean))], i = o.map((R) => {
    var P, _;
    return K((_ = (P = game.users) == null ? void 0 : P.get) == null ? void 0 : _.call(P, R));
  }).filter(Boolean), l = be(), u = rn(l), c = K(game.user, "A player"), b = {
    id: `group-${l}`,
    name: a,
    number: `${o.length} members`,
    userIds: r,
    isGroup: !0
  };
  await Ze(b, `${c} created the group.`, {
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
  }) && (O = u, Y = !1, z = !1, t && (t.contact = b), (S == null ? void 0 : S.mode) === "messages" && (S.contact = b), await Se(), await j());
}
function qn(e, t = null) {
  const n = Te(e, t);
  if (!n) return;
  Mn(e, n), n.querySelectorAll("[data-cybercall-npc-link-drop]").forEach((s) => {
    s.addEventListener("dragover", (o) => {
      var i;
      (i = game.user) != null && i.isGM && (o.preventDefault(), o.dataTransfer.dropEffect = "link", s.classList.add("drag-over"));
    }), s.addEventListener("dragleave", () => s.classList.remove("drag-over")), s.addEventListener("drop", async (o) => {
      s.classList.remove("drag-over");
      const i = s.dataset.cybercallNpcThreadId || s.dataset.cybercallThreadId || O;
      await Fn(o, i);
    });
  }), n.querySelectorAll("[data-cybercall-npc-action]").forEach((s) => {
    s.addEventListener("click", async (o) => {
      var c, b, h, f, I;
      o.preventDefault(), o.stopPropagation();
      const i = o.currentTarget.dataset.cybercallNpcAction, l = o.currentTarget.dataset.cybercallNpcThreadId || O, u = tt()[l];
      if (i === "toggle-reveal" && u) {
        await Je(l, { revealPortrait: u.revealPortrait !== !0 }), await j();
        return;
      }
      if (i === "unlink" && u) {
        await Je(l, null), (b = (c = ui.notifications) == null ? void 0 : c.info) == null || b.call(c, "NPC identity link removed."), await j();
        return;
      }
      i === "change" && ((h = o.currentTarget.closest("[data-cybercall-npc-link-drop]")) == null || h.classList.add("awaiting-drop"), (I = (f = ui.notifications) == null ? void 0 : f.info) == null || I.call(f, "Drag a different Actor or Token onto the NPC identity panel."));
    });
  }), n.querySelectorAll("[data-cybercall-thread-id]").forEach((s) => {
    s.addEventListener("click", async (o) => {
      Y = !1, z = !1, O = o.currentTarget.dataset.cybercallThreadId, await Se(), await j();
    });
  }), n.querySelectorAll("[data-cybercall-message-action]").forEach((s) => {
    s.addEventListener("click", async (o) => {
      var l;
      const i = o.currentTarget.dataset.cybercallMessageAction;
      if (i === "refresh") {
        await j();
        return;
      }
      if (i === "open-calls") {
        await Rt();
        return;
      }
      if (i === "new") {
        Y = !0, z = !1, O = "", W && (W.contact = null), await j();
        return;
      }
      if (i === "new-group") {
        Y = !1, z = !0, O = "", W && (W.contact = null), (S == null ? void 0 : S.mode) === "messages" && (S.contact = null), await j();
        return;
      }
      if (i === "delete-thread") {
        o.preventDefault(), o.stopPropagation();
        const u = n.querySelector("[data-cybercall-active-thread]"), c = O || ((l = u == null ? void 0 : u.dataset) == null ? void 0 : l.cybercallActiveThread) || "";
        if (!c) return;
        if (e._cybercallPendingDeleteThreadId !== c) {
          e._cybercallPendingDeleteThreadId = c, o.currentTarget.classList.add("confirming"), o.currentTarget.textContent = "Confirm Delete", o.currentTarget.title = "Click again to delete this thread";
          return;
        }
        e._cybercallPendingDeleteThreadId = "", await Nn(c);
      }
    });
  });
  const a = n.querySelector("form[data-cybercall-group-form]");
  a == null || a.addEventListener("submit", async (s) => {
    s.preventDefault(), await Vn(a, e);
  });
  const r = n.querySelector("form[data-cybercall-message-form]");
  r == null || r.addEventListener("submit", async (s) => {
    var I, d, w, k;
    s.preventDefault();
    const o = at(), i = o.activeThread, l = (i == null ? void 0 : i.contact) ?? Dn(r, o), u = ((I = r.elements.body) == null ? void 0 : I.value) ?? "", c = xn(r, o), b = !!(i != null && i.contact && !i.contact.userId && (i.contact.managedByGM || i.contact.isNpc)), h = i ? Ut(i, { excludeGMs: ((d = game.user) == null ? void 0 : d.isGM) === !0 && !b }) : null;
    if (!l) {
      (k = (w = ui.notifications) == null ? void 0 : w.warn) == null || k.call(w, "Select a contact before sending a message.");
      return;
    }
    await Ze(l, u, {
      ...c,
      threadId: i ? i.id : void 0,
      recipientUserIds: h != null && h.length ? h : void 0,
      recipientNumbers: c.senderNumber ? [] : void 0,
      conversationType: i != null && i.isGroup ? "group" : "direct",
      groupId: (i == null ? void 0 : i.groupId) ?? "",
      groupName: (i == null ? void 0 : i.groupName) ?? "",
      groupMemberUserIds: (i == null ? void 0 : i.groupMemberUserIds) ?? [],
      groupMemberNames: (i == null ? void 0 : i.groupMemberNames) ?? []
    }) && (O = i ? i.id : Me(l), e && (e.contact = l), (S == null ? void 0 : S.mode) === "messages" && (S.contact = l), Y = !1, z = !1, r.elements.body.value = "", await Se(), await j({ scrollToBottom: !0 }));
  }), Se();
}
const { CyberCallApplication: jn, CyberCallPhone: zn } = Qt({
  moduleId: p,
  templatePath: Xt,
  composerTemplatePath: Zt,
  contactsTemplatePath: Ht,
  messagesTemplatePath: en,
  phoneTemplatePath: tn,
  escapeHTML: de,
  getDefaultComposerData: yn,
  getActorChoices: fn,
  getPlayerChoices: hn,
  getContacts: ye,
  getGroupContacts: re,
  getMessageContext: at,
  getRingtoneChoices: ea,
  getSoundPath: ut,
  getActiveContactsTab: () => ge,
  canEditContactImages: Ne,
  bindCallControls: Tn,
  bindComposerControls: kn,
  bindContactsControls: Bn,
  bindMessagesControls: qn,
  stopRinging: dt,
  clearActiveCall: (e) => {
    m === e && (m = null);
  },
  clearActiveComposer: (e) => {
    ve === e && (ve = null);
  },
  clearActiveContacts: (e) => {
    Z === e && (Z = null);
  },
  clearActiveMessages: (e) => {
    W === e && (W = null);
  },
  clearActivePhone: (e) => {
    S === e && (S = null, ve = null, Z = null, W = null);
  }
});
async function se(e = {}) {
  var t, n;
  return qe() ? (Z && await Z.close(), await rt(), m = new jn(e), await m.render(!0), _t(m), ta(m.callData), m) : ((n = (t = ui.notifications) == null ? void 0 : t.warn) == null || n.call(t, "You do not have permission to open CyberCall transmissions."), null);
}
async function rt() {
  if (!m) return;
  const e = m;
  m = null, await e.close();
}
function Kn(e) {
  var t;
  return !!((t = m == null ? void 0 : m.callData) != null && t.id) && m.callData.id === e;
}
async function Wn() {
  m && (await m.render(!0), _t(m));
}
async function Pt(e) {
  Kn(e) && (m.callData.accepted = !0, m.callData.ringing = !1, dt(), await Wn());
}
async function Yn(e) {
  e && (await Fe(m == null ? void 0 : m.callData, "connected"), game.socket.emit(ie, {
    action: "acceptCall",
    callId: e
  }), await Pt(e));
}
async function Et(e) {
  var t;
  e && ((t = m == null ? void 0 : m.callData) != null && t.id) && m.callData.id !== e || await rt();
}
async function Dt(e) {
  var t;
  await Fe(m == null ? void 0 : m.callData, (t = m == null ? void 0 : m.callData) != null && t.accepted ? "ended" : "missed"), game.socket.emit(ie, {
    action: "endCall",
    callId: e
  }), await Et(e);
}
function Jn(e, t = "Player") {
  var r, s, o, i, l;
  const n = ((s = (r = game.users) == null ? void 0 : r.get) == null ? void 0 : s.call(r, e)) ?? ((l = (i = (o = game.users) == null ? void 0 : o.contents) == null ? void 0 : i.find) == null ? void 0 : l.call(i, (u) => u.id === e)), a = K(n, t);
  return {
    id: `user-${e}`,
    name: a,
    number: `@${a}`,
    image: $e(n),
    userId: e,
    userIds: e ? [e] : []
  };
}
function Qn(e) {
  var t;
  return e ? e.contactNumber ? He().find((a) => a.number === e.contactNumber) ?? {
    id: `contact-${e.contactNumber}`,
    name: e.contactName || e.callerName,
    number: e.contactNumber,
    image: e.contactImage || e.image,
    actorId: e.contactActorId ?? "",
    managedByGM: !0,
    isNpc: !0
  } : (t = game.user) != null && t.isGM && e.callerUserId ? Jn(e.callerUserId, e.callerName) : null : null;
}
function Xn(e, t) {
  var a;
  const n = /* @__PURE__ */ new Set();
  for (const r of (t == null ? void 0 : t.userIds) ?? []) n.add(String(r));
  if (t != null && t.userId && n.add(String(t.userId)), e != null && e.callerUserId && n.add(String(e.callerUserId)), !(t != null && t.userId) && (t != null && t.managedByGM || t != null && t.isNpc || e != null && e.contactNumber))
    for (const r of Rn()) n.add(r);
  return n.delete(String(((a = game.user) == null ? void 0 : a.id) ?? "")), [...n].filter(Boolean);
}
async function Fe(e, t) {
  var s;
  const n = Qn(e);
  if (!n) return null;
  const a = (e == null ? void 0 : e.callerUserId) || ((s = game.user) == null ? void 0 : s.id), r = {
    outgoing: `Outgoing call to ${n.name}.`,
    connected: `Call connected with ${n.name}.`,
    ended: `Call ended with ${n.name}.`,
    missed: `Call missed or declined with ${n.name}.`
  };
  return bn(n, r[t] ?? "Call event.", {
    threadId: Me(n, a),
    eventType: t,
    senderName: "CyberCall",
    senderNumber: n.number,
    senderActorId: n.actorId,
    recipientUserIds: Xn(e, n),
    recipientNumbers: n.userId ? [] : [n.number]
  });
}
async function Zn(e) {
  var i, l;
  if (game.user.isGM) {
    const u = {
      callerName: e.name,
      subtitle: `Comms ${e.number}`,
      image: e.image,
      message: `Opening channel ${e.number}...`,
      signal: game.settings.get(p, "defaultSignal"),
      variant: "standard",
      contactNumber: e.number,
      ringing: !1
    };
    return await Fe(u, "outgoing"), se(u);
  }
  if (!nt())
    return (l = (i = ui.notifications) == null ? void 0 : i.warn) == null || l.call(i, "No GM is connected to receive the CyberCall."), null;
  const t = be(), n = $e(game.user), a = K(game.user, "Unknown Caller"), r = {
    id: t,
    signal: game.settings.get(p, "defaultSignal"),
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
  }, s = le({
    ...r,
    callerName: e.name,
    subtitle: `Comms ${e.number}`,
    image: e.image,
    message: `Awaiting connection to ${e.name} on ${e.number}...`,
    canAccept: !1,
    canDecline: !1,
    outgoing: !0,
    ringing: !0
  }), o = le({
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
    callData: o
  }), await Fe(s, "outgoing"), se(s);
}
async function st() {
  var e, t;
  return game.user.isGM ? ot("calls") : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function it() {
  var e, t, n;
  return qe() ? m ? ((n = m.bringToFront) == null || n.call(m), m) : ot("calls") : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function ee() {
  Z && await Z.render(!0);
}
async function Ae(e = null) {
  var n, a;
  if (!qe())
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "You do not have permission to use CyberCall messages."), null;
  e ? (O = Me(e), Y = !1, z = !1) : O || z || (Y = !0);
  const t = await ot("messages", e);
  return await Se(), t;
}
async function ct(e) {
  return e && (O = String(e), Y = !1, z = !1), Ae();
}
async function Rt() {
  var e;
  return (e = game.user) != null && e.isGM ? st() : it();
}
async function j(e = {}) {
  !S || S.mode !== "messages" || (S._cybercallMessageScrollState = {
    ...$n(S),
    scrollToBottom: e.scrollToBottom === !0
  }, await S.render(!0));
}
async function ot(e = "calls", t = null) {
  var n, a, r;
  return S ? (S.mode = e, S.contact = t, await S.render(!0), (n = S.bringToFront) == null || n.call(S)) : (S = new zn(e, t), await S.render(!0)), ve = (a = game.user) != null && a.isGM && e === "calls" ? S : null, Z = !((r = game.user) != null && r.isGM) && e === "calls" ? S : null, W = e === "messages" ? S : null, S;
}
async function lt(e = {}) {
  var n, a;
  if (!game.user.isGM)
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Only the GM can broadcast CyberCalls to all players."), null;
  const t = le({
    ...e,
    fullscreen: e.fullscreen ?? !0,
    ringing: !0
  });
  return game.socket.emit(ie, {
    action: "openCall",
    callData: t,
    targetUserIds: t.targetUserIds
  }), se({ ...t, outgoing: !0 });
}
async function Hn(e) {
  var t, n, a;
  if (e && !(Array.isArray(e.targetUserIds) && e.targetUserIds.length && !e.targetUserIds.includes((t = game.user) == null ? void 0 : t.id)) && !(Array.isArray((n = e.callData) == null ? void 0 : n.targetUserIds) && e.callData.targetUserIds.length && !e.callData.targetUserIds.includes((a = game.user) == null ? void 0 : a.id))) {
    if (e.action === "openCall") {
      if (!qe()) return;
      se(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      se(e.callData);
      return;
    }
    if (e.action === "acceptCall") {
      Pt(e.callId);
      return;
    }
    if (e.action === "endCall") {
      Et(e.callId);
      return;
    }
    if (e.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const r = L({
        ...e.contact,
        image: ""
      });
      if (!r.name || !r.number) return;
      const s = re();
      s.push(r), await Le(s), await ee();
      return;
    }
    if (e.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await Le(re().filter((r) => r.id !== e.contactId)), await ee();
      return;
    }
    e.action === "groupContactsChanged" && (me = Array.isArray(e.contacts) ? e.contacts.map(L) : null, await ee());
  }
}
function _t(e) {
  var t, n;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((n = e.setPosition) == null || n.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function ut() {
  return String(game.settings.get(p, "ringSound") ?? "").trim();
}
function ea() {
  const e = ut();
  return Object.entries(vt).map(([t, n]) => ({
    value: t,
    label: n,
    selected: t === e
  }));
}
function dt() {
  if (!ae) return;
  const e = ae;
  ae = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function ta(e) {
  var s;
  if (dt(), !e.ringing) return;
  const t = ut();
  if (!t) return;
  const a = 0.65 * Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), r = ((s = foundry == null ? void 0 : foundry.audio) == null ? void 0 : s.AudioHelper) ?? globalThis.AudioHelper;
  r != null && r.play ? r.play({ src: t, volume: a, autoplay: !0, loop: !0 }, !1).then((o) => {
    ae = o;
  }).catch((o) => {
    console.warn(`${p} | Unable to play ringing sound.`, o);
  }) : (ae = new Audio(t), ae.loop = !0, ae.volume = a, ae.play().catch((o) => {
    console.warn(`${p} | Unable to play ringing sound.`, o);
  }));
}
function na() {
  const e = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  if (!e) return;
  const t = new e(), n = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), a = Math.max(1e-4, Math.min(0.18, 0.18 * n)), r = (o, i, l) => {
    const u = t.createOscillator(), c = t.createGain(), b = t.currentTime + i, h = b + l;
    u.type = "sine", u.frequency.setValueAtTime(o, b), u.frequency.exponentialRampToValueAtTime(o * 1.18, h), c.gain.setValueAtTime(1e-4, b), c.gain.exponentialRampToValueAtTime(a, b + 0.025), c.gain.exponentialRampToValueAtTime(1e-4, h), u.connect(c), c.connect(t.destination), u.start(b), u.stop(h);
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
function aa(e) {
  var n, a, r, s, o;
  if (e.senderImage) return String(e.senderImage);
  if (e.contactIsNpc && e.senderNumber) return "";
  const t = ((a = (n = game.users) == null ? void 0 : n.get) == null ? void 0 : a.call(n, e.senderUserId)) ?? ((o = (s = (r = game.users) == null ? void 0 : r.contents) == null ? void 0 : s.find) == null ? void 0 : o.call(s, (i) => i.id === e.senderUserId));
  return (t == null ? void 0 : t.isGM) === !0 ? "" : $e(t);
}
function Ct(e) {
  e != null && e.isConnected && (e.classList.add("leaving"), window.setTimeout(() => e.remove(), 220));
}
function ra(e) {
  let t = document.querySelector("[data-cybercall-message-notifications]");
  t || (t = document.createElement("div"), t.className = "cybercall-message-notifications", t.dataset.cybercallMessageNotifications = "", t.setAttribute("aria-live", "polite"), document.body.append(t));
  const n = String(e.senderName || "New message").trim(), a = String(e.groupName || "").trim(), r = document.createElement("button");
  r.type = "button", r.className = "cybercall-incoming-message", r.title = "Open CyberCall conversation";
  const s = document.createElement("span");
  s.className = `cybercall-incoming-avatar ${St(e.senderUserId || n)}`;
  const o = aa(e);
  if (o) {
    const b = document.createElement("img");
    b.src = o, b.alt = "", s.append(b);
  } else
    s.textContent = X(n);
  const i = document.createElement("i");
  i.className = "fa-solid fa-message cybercall-incoming-badge", i.setAttribute("aria-hidden", "true"), s.append(i);
  const l = document.createElement("span");
  l.className = "cybercall-incoming-copy";
  const u = document.createElement("strong");
  u.textContent = a ? `${n} · ${a}` : n;
  const c = document.createElement("small");
  c.textContent = String(e.body || "New CyberCall message").trim(), l.append(u, c), r.append(s, l), r.addEventListener("click", () => {
    Ct(r), ct(String(e.threadId || ""));
  }), t.append(r), na(), window.setTimeout(() => Ct(r), 4200);
}
function sa(e) {
  var n, a, r;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[p]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, p, "message"));
  return (t == null ? void 0 : t.kind) === pe ? t : ((r = t == null ? void 0 : t.message) == null ? void 0 : r.kind) === pe ? t.message : null;
}
function xt(e, t) {
  var a, r, s, o, i, l, u;
  if (!e) return;
  const n = (a = e.matches) != null && a.call(e, ".chat-message") ? e : ((r = e.closest) == null ? void 0 : r.call(e, ".chat-message")) ?? ((s = e.querySelector) == null ? void 0 : s.call(e, ".chat-message")) ?? e;
  (i = (o = n.classList) == null ? void 0 : o.toggle) == null || i.call(o, "cybercall-chat-message-hidden", !t), t ? (l = n.removeAttribute) == null || l.call(n, "aria-hidden") : (u = n.setAttribute) == null || u.call(n, "aria-hidden", "true");
}
function Ot(e, t) {
  if (!sa(e)) return;
  const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? (t == null ? void 0 : t.element) ?? null;
  xt(n, game.settings.get(p, "showChatCards") === !0);
}
function Lt() {
  const e = game.settings.get(p, "showChatCards") === !0;
  document.querySelectorAll(".cybercall-chat-card").forEach((t) => {
    xt(t, e);
  });
}
function Ft() {
  const e = game.modules.get(p);
  e && (e.api = {
    openCall: se,
    closeCall: rt,
    broadcastCall: lt,
    openComposer: st,
    openContacts: it,
    openMessages: Ae,
    openMessagesThread: ct,
    openCallPanel: Rt,
    getUnreadMessageCount: kt,
    get activeCall() {
      return m;
    },
    get activeComposer() {
      return ve;
    },
    get activeContacts() {
      return Z;
    },
    get activeMessages() {
      return W;
    }
  });
}
function ia() {
  var n;
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: p,
    title: "CyberCall",
    icon: "fa-solid fa-satellite-dish",
    premium: !1,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => {
      var a;
      return (a = game.user) != null && a.isGM ? st() : it();
    }
  }), (n = t.registerWhatsNew) == null || n.call(t, {
    moduleId: p,
    title: "CyberCall",
    tier: "free",
    version: "1.0.5",
    updated: "2026-07-14",
    icon: "fa-solid fa-satellite-dish",
    entries: [
      {
        title: "Messages in CyberCall",
        summary: "CyberCall now includes message threads, contact-based conversations, unread tracking, and player-facing message access.",
        tags: ["Messages", "Comms"]
      }
    ]
  }), !0) : !1;
}
function ca() {
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
  game.settings.register(p, "defaultSignal", {
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
  }), game.settings.register(p, "ringSound", {
    name: "Incoming Call Ringtone",
    hint: "Ringtone played locally while a CyberCall is ringing. This is a client setting, so each user can choose their own ringtone.",
    scope: "client",
    config: !1,
    type: String,
    default: "",
    choices: vt
  }), game.settings.register(p, "minimumRole", {
    name: "Minimum Player Role",
    hint: "Minimum role allowed to open CyberCall overlays and receive GM broadcasts.",
    scope: "world",
    config: !0,
    type: Number,
    default: e.PLAYER,
    choices: t
  }), game.settings.register(p, "contacts", {
    name: "CyberCall Contacts",
    hint: "Player contact directory stored locally for this client and isolated per world.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(p, "groupContacts", {
    name: "CyberCall Group Contacts",
    hint: "Shared group contact directory for all players in this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: []
  }), game.settings.register(p, "npcThreadBindings", {
    name: "CyberCall NPC Conversation Links",
    hint: "Stores GM-managed links between pseudo-NPC conversations and Foundry Actors.",
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: () => {
      j(), ee();
    }
  }), game.settings.register(p, "messageNotifications", {
    name: "Incoming Message Alerts",
    hint: "Show a brief sender notification and play a short tone when a new CyberCall message arrives.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(p, "showChatCards", {
    name: "Show CyberCall Chat Cards",
    hint: "Show CyberCall message cards in Foundry's standard chat log. Disabled by default because CyberCall has its own inbox and notifications.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: () => Lt()
  }), game.settings.register(p, "showMessageTimestamps", {
    name: "Show Message Timestamps",
    hint: "Display the sent date and time beneath messages in CyberCall conversations.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(p, "gmViewPlayerMessages", {
    name: "GM: View Player Conversations",
    hint: "Allow GMs to see private CyberCall conversations where no GM or GM-managed NPC is a participant. Disabled by default.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: () => {
      j(), ee();
    }
  }), game.settings.register(p, "messageReadState", {
    name: "CyberCall Message Read State",
    hint: "Tracks which message threads this client has read.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(p, "messageDeletedBefore", {
    name: "CyberCall Deleted Message Threads",
    hint: "Tracks locally deleted message threads for this client.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  });
}
async function oa() {
  const e = game.settings.get(p, "contacts");
  Array.isArray(e) && await game.settings.set(p, "contacts", {
    [Ve()]: e.map(L)
  });
}
Hooks.once("init", () => {
  ca(), Ft();
});
Hooks.once("ready", async () => {
  await oa(), Ft(), ia(), game.socket.on(ie, Hn), Lt(), console.log(`${p} | Ready. Use game.modules.get("${p}").api.openCall({...})`);
});
Hooks.on("renderChatMessage", (e, t) => {
  Ot(e, t);
});
Hooks.on("renderChatMessageHTML", (e, t) => {
  Ot(e, t);
});
Hooks.on("createChatMessage", async (e) => {
  var i, l, u;
  const t = (i = e == null ? void 0 : e.flags) == null ? void 0 : i[p];
  if ((t == null ? void 0 : t.kind) !== pe) return;
  const n = String(((l = game.user) == null ? void 0 : l.id) ?? ""), a = Array.isArray(t.recipientUserIds) ? t.recipientUserIds.map((c) => String(c)) : [], r = ((u = game.user) == null ? void 0 : u.isGM) === !0 && !String(t.contactUserId ?? "") && (t.contactManagedByGM === !0 || t.contactIsNpc === !0), s = String(t.senderUserId ?? "") !== n && (a.includes(n) || r), o = String(t.messageType ?? "text") === "text" || t.eventType === "group-created";
  s && o && game.settings.get(p, "messageNotifications") !== !1 && ra(t), await j(), await ee();
});
document.addEventListener("click", (e) => {
  var a;
  const t = e.target, n = (a = t == null ? void 0 : t.closest) == null ? void 0 : a.call(t, "[data-cybercall-open-thread]");
  n && (e.preventDefault(), ct(n.dataset.cybercallThreadId));
});
