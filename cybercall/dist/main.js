var Lt = Object.defineProperty;
var Ft = (e, t, n) => t in e ? Lt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var E = (e, t, n) => Ft(e, typeof t != "symbol" ? t + "" : t, n);
function Vt(e, t) {
  return e.image ? `<img src="${t(e.image)}" alt="${t(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${t(e.initials)}</div>`;
}
function mt(e, t) {
  const n = `--cybercall-signal: ${e.signal}%;`, a = e.fullscreen ? "cybercall-broadcast" : "", s = e.ringing ? "cybercall-ringing-panel" : "", i = e.accepted ? "cybercall-connected-panel" : "", o = e.showBroadcast ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>' : "", r = e.accepted ? "" : `
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
    <div class="cybercall-panel cybercall-${e.variant} ${a} ${s} ${i}" style="${n}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${r}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${Vt(e, t)}</div>
        ${l}
      </main>
      <footer class="cybercall-actions">
        ${u}
      </footer>
    </div>
  `;
}
function je(e, t) {
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
          ${e.actors.map((s) => `<option value="${t(s.id)}">${t(s.name)}</option>`).join("")}
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
    (s) => `<option value="${t(s.value)}" ${s.selected ? "selected" : ""}>${t(s.label)}</option>`
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
function ze(e, t) {
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
      `).join("") : '<li class="cybercall-contacts-empty">No contacts stored.</li>', a = e.activeTab !== "group", s = e.activeTab === "group", i = (e.actors ?? []).map((l) => `<option value="${t(l.id)}">${t(l.name)}</option>`).join(""), o = e.canEditContactImages ? `
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
        <button type="button" class="${s ? "active" : ""}" data-cybercall-contact-tab="group">Group</button>
      </nav>
      <section data-cybercall-contact-panel="personal" ${a ? "" : "hidden"}>
        <ul class="cybercall-contacts-list">${n(e.contacts, "personal")}</ul>
      </section>
      <section data-cybercall-contact-panel="group" ${s ? "" : "hidden"}>
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
function Ke(e, t) {
  var I;
  const n = e.threads ?? [], a = e.activeThread ?? null, s = e.allContacts ?? [], i = n.length ? n.map((d) => `
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
      `).join("") : '<div class="cybercall-messages-empty">No messages yet.</div>', o = s.map((d) => `<option value="${t(d.id)}" ${e.selectedContactId === d.id ? "selected" : ""}>${t(d.name)} - ${t(d.number)}</option>`).join(""), r = e.canReplyAs ? `
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
        <select name="contactId" ${s.length ? "" : "disabled"}>
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
        ${f}
        ${e.isComposingNewGroup ? h : `
          <div class="cybercall-message-log">${c}</div>
          <form class="cybercall-message-form ${e.canReplyAs ? "has-reply-as" : ""} ${e.canSendAs ? "has-send-as" : ""}" data-cybercall-message-form>
            ${u}
            ${r}
            ${l}
            <textarea name="body" rows="3" placeholder="Type message..." required></textarea>
            <button type="submit" ${s.length ? "" : "disabled"}>Send</button>
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
}, qt = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]);
function Ct(e) {
  const t = Number(e);
  return Number.isNaN(t) ? V.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function H(e) {
  return String(e).split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var n;
    return (n = t[0]) == null ? void 0 : n.toUpperCase();
  }).join("") || "?";
}
function be() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function ue(e = {}) {
  var s;
  const t = Array.isArray(e.targetUserIds) ? e.targetUserIds.map((i) => String(i)).filter(Boolean) : [], n = Array.isArray(e.targetUserNames) ? e.targetUserNames.map((i) => String(i)).filter(Boolean) : [], a = {
    ...V,
    ...e,
    id: String(e.id ?? be()),
    callerName: String(e.callerName ?? V.callerName),
    subtitle: String(e.subtitle ?? V.subtitle),
    image: String(e.image ?? V.image),
    message: String(e.message ?? V.message),
    signal: Ct(e.signal ?? V.signal),
    variant: qt.has(e.variant) ? e.variant : V.variant,
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
  return a.initials = H(a.callerName), a.showBroadcast = !!((s = game == null ? void 0 : game.user) != null && s.isGM && a.allowBroadcast), a.isStandard = a.variant === "standard", a.isEmergency = a.variant === "emergency", a.isCorrupted = a.variant === "corrupted", a.isIncoming = !a.accepted, a.hasTargets = a.targetUserIds.length > 0, a.recipientLabel = a.hasTargets ? a.targetUserNames.join(", ") : "All players", a.directionLabel = a.outgoing ? `Calling ${a.recipientLabel}` : `From ${a.callerName}`, a.kicker = a.outgoing ? "Outgoing CyberCall" : a.fullscreen ? "System-wide Broadcast" : "Incoming CyberCall", a;
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
    initials: H(e.name)
  };
}
function jt(e) {
  var a, s, i;
  const t = (e == null ? void 0 : e.document) ?? e, n = String(
    ((a = t == null ? void 0 : t.getTextureSrc) == null ? void 0 : a.call(t)) || ((s = t == null ? void 0 : t.texture) == null ? void 0 : s.src) || (t == null ? void 0 : t.img) || ((i = e == null ? void 0 : e.texture) == null ? void 0 : i.src) || ""
  ).trim();
  return n.includes("*") ? "" : n;
}
function xe(e) {
  return !e || /(?:^|\/)mystery-man(?:-[^/.]+)?\.svg(?:$|\?)/i.test(e);
}
function Se(e) {
  var d, w, T, _, P, D, F, Y, R, W, ne, B, ae, U;
  if (!e) return "";
  const t = globalThis.game, n = globalThis.canvas, a = String(e.avatar ?? ((d = e._source) == null ? void 0 : d.avatar) ?? "").trim();
  if (e.isGM === !0) return xe(a) ? "" : a;
  const s = e.character ?? e.characterId ?? ((w = e._source) == null ? void 0 : w.character), i = typeof s == "string" ? s : String((s == null ? void 0 : s.id) ?? (s == null ? void 0 : s._id) ?? ""), o = (i ? (_ = (T = t == null ? void 0 : t.actors) == null ? void 0 : T.get) == null ? void 0 : _.call(T, i) : null) ?? (typeof s == "object" ? s : null), r = Array.isArray((P = n == null ? void 0 : n.tokens) == null ? void 0 : P.placeables) ? n.tokens.placeables : [], l = String(((D = t == null ? void 0 : t.user) == null ? void 0 : D.id) ?? "") === String(e.id ?? "") ? ((F = n == null ? void 0 : n.tokens) == null ? void 0 : F.controlled) ?? [] : [], u = ((Y = o == null ? void 0 : o.getActiveTokens) == null ? void 0 : Y.call(o, !0, !0)) ?? [], c = r.find((M) => {
    var j, J;
    const q = String(((j = M == null ? void 0 : M.actor) == null ? void 0 : j.id) ?? ((J = M == null ? void 0 : M.document) == null ? void 0 : J.actorId) ?? (M == null ? void 0 : M.actorId) ?? "");
    return i && q === i;
  }), b = r.find((M) => {
    var j, J;
    const q = (M == null ? void 0 : M.actor) ?? ((j = M == null ? void 0 : M.document) == null ? void 0 : j.actor);
    return Number(((J = q == null ? void 0 : q.ownership) == null ? void 0 : J[e.id]) ?? 0) >= 3;
  }), h = [...l, ...u, c, b].filter(Boolean).map(jt).find(Boolean) ?? "";
  if (h) return h;
  const f = String(
    ((W = (R = o == null ? void 0 : o.prototypeToken) == null ? void 0 : R.texture) == null ? void 0 : W.src) || ((ae = (B = (ne = o == null ? void 0 : o._source) == null ? void 0 : ne.prototypeToken) == null ? void 0 : B.texture) == null ? void 0 : ae.src) || ""
  ).trim();
  if (f && !f.includes("*") && !xe(f))
    return f;
  const I = String((o == null ? void 0 : o.img) ?? ((U = o == null ? void 0 : o._source) == null ? void 0 : U.img) ?? "").trim();
  return xe(I) ? xe(a) ? "" : a : I;
}
function zt() {
  var t, n, a;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((a = game == null ? void 0 : game.release) == null ? void 0 : a.generation));
  return Number.isFinite(e) ? e : null;
}
function Kt() {
  const e = zt();
  return e === null || e >= 13;
}
function Wt() {
  var n, a, s, i, o, r;
  const e = ((a = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : a.api) ?? ((s = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : s.api) ?? null, t = ((o = (i = globalThis.foundry) == null ? void 0 : i.applications) == null ? void 0 : o.api) ?? ((r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function Yt(e) {
  var Ie, v, G, Z;
  const {
    moduleId: t,
    templatePath: n,
    composerTemplatePath: a,
    contactsTemplatePath: s,
    messagesTemplatePath: i,
    phoneTemplatePath: o,
    escapeHTML: r,
    getDefaultComposerData: l,
    getActorChoices: u,
    getPlayerChoices: c,
    getContacts: b,
    getGroupContacts: h,
    getMessageContext: f,
    getRingtoneChoices: I,
    getSoundPath: d,
    getActiveContactsTab: w,
    canEditContactImages: T,
    bindCallControls: _,
    bindComposerControls: P,
    bindContactsControls: D,
    bindMessagesControls: F,
    stopRinging: Y,
    clearActiveCall: R,
    clearActiveComposer: W,
    clearActiveContacts: ne,
    clearActiveMessages: B,
    clearActivePhone: ae
  } = e, U = (v = (Ie = foundry == null ? void 0 : foundry.applications) == null ? void 0 : Ie.api) == null ? void 0 : v.ApplicationV2, M = (Z = (G = foundry == null ? void 0 : foundry.applications) == null ? void 0 : G.api) == null ? void 0 : Z.HandlebarsApplicationMixin, q = Wt(), j = Kt();
  function J() {
    const C = b(), N = h(), g = w();
    return {
      contacts: C,
      groupContacts: N,
      hasContacts: C.length > 0,
      hasGroupContacts: N.length > 0,
      activeTab: g,
      isPersonalTab: g !== "group",
      isGroupTab: g === "group",
      canEditContactImages: T(),
      canManageNpcContacts: T(),
      actors: u(),
      unreadMessageCount: f().unreadCount,
      hasUnreadMessages: f().unreadCount > 0,
      ringtoneChoices: I(),
      currentRingtone: d()
    };
  }
  function qe() {
    return {
      call: l(),
      actors: u(),
      players: c(),
      ringtoneChoices: I()
    };
  }
  function fe(C, N = null) {
    var dt, gt;
    const g = C === "messages", y = !g && ((dt = game.user) == null ? void 0 : dt.isGM), S = !g && !((gt = game.user) != null && gt.isGM);
    return {
      ...g ? f(N) : y ? qe() : J(),
      mode: C,
      isMessagesMode: g,
      isComposerMode: y,
      isContactsMode: S,
      isCallsMode: !g
    };
  }
  function he(C, N) {
    var g;
    return C === "messages" ? Ke(N, r) : (g = game.user) != null && g.isGM ? je(N, r) : ze(N, r);
  }
  function re(C) {
    const N = document.createElement("template");
    N.innerHTML = C.trim();
    const g = N.content.firstElementChild;
    return {
      main: g instanceof HTMLElement ? g : document.createElement("div")
    };
  }
  function Ce(C, N = null) {
    var g;
    if (C.mode === "messages") {
      F(C, N);
      return;
    }
    (g = game.user) != null && g.isGM ? P(C, N) : D(C, N);
  }
  class Me extends q {
    constructor(g, y = {}) {
      super(y);
      E(this, "callData");
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
      } catch (y) {
        return console.warn(`${t} | Template render failed, using inline fallback.`, y), $(mt(this.callData, r));
      }
    }
    activateListeners(g) {
      super.activateListeners(g), _(this, g);
    }
    async close(g) {
      return R(this), Y(), super.close(g);
    }
  }
  class Te extends q {
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
        return console.warn(`${t} | Composer template render failed, using inline fallback.`, g), $(je(N, r));
      }
    }
    activateListeners(N) {
      super.activateListeners(N), P(this, N);
    }
    async close(N) {
      return W(this), super.close(N);
    }
  }
  class Ge extends q {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-contacts",
        title: "CyberCall Contacts",
        template: s,
        classes: ["cybercall-contacts-app"],
        popOut: !0,
        resizable: !0,
        width: 500,
        height: 620
      });
    }
    getData() {
      return J();
    }
    async _renderInner(N) {
      try {
        return await super._renderInner(N);
      } catch (g) {
        return console.warn(`${t} | Contacts template render failed, using inline fallback.`, g), $(ze(N, r));
      }
    }
    activateListeners(N) {
      super.activateListeners(N), D(this, N);
    }
    async close(N) {
      return ne(this), super.close(N);
    }
  }
  class ke extends q {
    constructor(g = "calls", y = null, S = {}) {
      super(S);
      E(this, "mode");
      E(this, "contact");
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
      return fe(this.mode, this.contact);
    }
    async _renderInner(g) {
      try {
        return await super._renderInner(g);
      } catch (y) {
        return console.warn(`${t} | Phone template render failed, using inline fallback.`, y), $(he(this.mode, g));
      }
    }
    activateListeners(g) {
      super.activateListeners(g), Ce(this, g);
    }
    async close(g) {
      return ae(this), super.close(g);
    }
  }
  class Ue extends q {
    constructor(g = null, y = {}) {
      super(y);
      E(this, "contact");
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
      return f(this.contact);
    }
    async _renderInner(g) {
      try {
        return await super._renderInner(g);
      } catch (y) {
        return console.warn(`${t} | Messages template render failed, using inline fallback.`, y), $(Ke(g, r));
      }
    }
    activateListeners(g) {
      super.activateListeners(g), F(this, g);
    }
    async close(g) {
      return B(this), super.close(g);
    }
  }
  function Be() {
    var C;
    return !j || !U || !M ? null : (C = class extends M(U) {
      constructor(y, S = {}) {
        super(S);
        E(this, "callData");
        this.callData = ue(y);
      }
      async _prepareContext(y) {
        return {
          ...await super._prepareContext(y),
          call: this.callData
        };
      }
      async _renderHTML(y, S) {
        try {
          return await super._renderHTML(y, S);
        } catch (x) {
          return console.warn(`${t} | Template render failed, using inline fallback.`, x), re(mt(this.callData, r));
        }
      }
      _onRender(y, S) {
        var x;
        (x = super._onRender) == null || x.call(this, y, S), _(this);
      }
      async close(y) {
        return R(this), Y(), super.close(y);
      }
    }, E(C, "DEFAULT_OPTIONS", {
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
    }), E(C, "PARTS", {
      main: {
        template: n
      }
    }), C);
  }
  function Pe() {
    var C;
    return !j || !U || !M ? null : (C = class extends M(U) {
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
        } catch (S) {
          return console.warn(`${t} | Composer template render failed, using inline fallback.`, S), re(je(g, r));
        }
      }
      _onRender(g, y) {
        var S;
        (S = super._onRender) == null || S.call(this, g, y), P(this);
      }
      async close(g) {
        return W(this), super.close(g);
      }
    }, E(C, "DEFAULT_OPTIONS", {
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
    }), E(C, "PARTS", {
      main: {
        template: a
      }
    }), C);
  }
  function Ee() {
    var C;
    return !j || !U || !M ? null : (C = class extends M(U) {
      async _prepareContext(g) {
        return {
          ...await super._prepareContext(g),
          ...J()
        };
      }
      async _renderHTML(g, y) {
        try {
          return await super._renderHTML(g, y);
        } catch (S) {
          return console.warn(`${t} | Contacts template render failed, using inline fallback.`, S), re(ze(g, r));
        }
      }
      _onRender(g, y) {
        var S;
        (S = super._onRender) == null || S.call(this, g, y), D(this);
      }
      async close(g) {
        return ne(this), super.close(g);
      }
    }, E(C, "DEFAULT_OPTIONS", {
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
    }), E(C, "PARTS", {
      main: {
        template: s
      }
    }), C);
  }
  function De() {
    var C;
    return !j || !U || !M ? null : (C = class extends M(U) {
      constructor(y = "calls", S = null, x = {}) {
        super(x);
        E(this, "mode");
        E(this, "contact");
        this.mode = y, this.contact = S;
      }
      async _prepareContext(y) {
        return {
          ...await super._prepareContext(y),
          ...fe(this.mode, this.contact)
        };
      }
      async _renderHTML(y, S) {
        try {
          return await super._renderHTML(y, S);
        } catch (x) {
          return console.warn(`${t} | Phone template render failed, using inline fallback.`, x), re(he(this.mode, y));
        }
      }
      _onRender(y, S) {
        var x;
        (x = super._onRender) == null || x.call(this, y, S), Ce(this);
      }
      async close(y) {
        return ae(this), super.close(y);
      }
    }, E(C, "DEFAULT_OPTIONS", {
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
    }), E(C, "PARTS", {
      main: {
        template: o
      }
    }), C);
  }
  function Re() {
    var C;
    return !j || !U || !M ? null : (C = class extends M(U) {
      constructor(y = null, S = {}) {
        super(S);
        E(this, "contact");
        this.contact = y;
      }
      async _prepareContext(y) {
        return {
          ...await super._prepareContext(y),
          ...f(this.contact)
        };
      }
      async _renderHTML(y, S) {
        try {
          return await super._renderHTML(y, S);
        } catch (x) {
          return console.warn(`${t} | Messages template render failed, using inline fallback.`, x), re(Ke(y, r));
        }
      }
      _onRender(y, S) {
        var x;
        (x = super._onRender) == null || x.call(this, y, S), F(this);
      }
      async close(y) {
        return B(this), super.close(y);
      }
    }, E(C, "DEFAULT_OPTIONS", {
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
    }), E(C, "PARTS", {
      main: {
        template: i
      }
    }), C);
  }
  return {
    CyberCallApplication: Be() ?? Me,
    CyberCallComposer: Pe() ?? Te,
    CyberCallContacts: Ee() ?? Ge,
    CyberCallMessages: Re() ?? Ue,
    CyberCallPhone: De() ?? ke
  };
}
const p = "cybercall", oe = `module.${p}`, Jt = `modules/${p}/templates/cybercall.hbs`, Qt = `modules/${p}/templates/cybercall-composer.hbs`, Xt = `modules/${p}/templates/cybercall-contacts.hbs`, Zt = `modules/${p}/templates/cybercall-messages.hbs`, Ht = `modules/${p}/templates/cybercall-phone.hbs`, pe = "phoneMessage", It = 3, wt = {
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
function k(e, t = "") {
  return String(e ?? t).trim();
}
function le(e) {
  return [...new Set(e.map((t) => k(t)).filter(Boolean))];
}
function en() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function Nt(e) {
  const t = k(e, "cybercall");
  let n = 0;
  for (let a = 0; a < t.length; a += 1)
    n = (n << 5) - n + t.charCodeAt(a) | 0;
  return `tone-${Math.abs(n) % 8 + 1}`;
}
function pt(e, t) {
  return ["direct", ...[e, t].sort()].join(":");
}
function tn() {
  return `msg-${be()}`;
}
function nn(e = be()) {
  return `group:${k(e)}`;
}
function $e(e, t = ((n) => (n = game == null ? void 0 : game.user) == null ? void 0 : n.id)()) {
  const a = L(e);
  if (e != null && e.userId)
    return pt(`user:${k(t, "unknown")}`, `user:${k(e.userId)}`);
  const s = a.number || a.id || a.name;
  return pt(`user:${k(t, "unknown")}`, `contact:${s}`);
}
function Je(e = {}) {
  var t;
  return {
    id: k(e.id) || tn(),
    threadId: k(e.threadId) || $e({ number: ((t = e.recipientNumbers) == null ? void 0 : t[0]) ?? e.senderNumber }),
    senderUserId: k(e.senderUserId),
    senderActorId: k(e.senderActorId),
    senderName: k(e.senderName, "Unknown Sender"),
    senderNumber: k(e.senderNumber),
    senderImage: k(e.senderImage),
    recipientUserIds: le(e.recipientUserIds ?? []),
    recipientActorIds: le(e.recipientActorIds ?? []),
    recipientNumbers: le(e.recipientNumbers ?? []),
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
    groupMemberUserIds: le(e.groupMemberUserIds ?? []),
    groupMemberNames: le(e.groupMemberNames ?? []),
    createdAt: k(e.createdAt) || en(),
    chatMessageId: k(e.chatMessageId),
    schemaVersion: Number(e.schemaVersion ?? It)
  };
}
function vt(e, t = [], n = "", a = {}) {
  const s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (const r of t) {
    const l = L(r), u = { ...l, userId: r == null ? void 0 : r.userId, userIds: (r == null ? void 0 : r.userIds) ?? l.userIds };
    l.number && s.set(l.number, u), r != null && r.userId && i.set(String(r.userId), u);
  }
  const o = /* @__PURE__ */ new Map();
  for (const r of e.map(Je).filter((l) => l.body)) {
    const l = o.get(r.threadId) ?? [];
    l.push(r), o.set(r.threadId, l);
  }
  return [...o.entries()].map(([r, l]) => {
    var he, re, Ce, Me, Te, Ge, ke, Ue, Be, Pe, Ee, De, Re, Ie;
    const u = l.sort((v, G) => v.createdAt.localeCompare(G.createdAt)), c = u[u.length - 1] ?? null, b = [...u].reverse().find((v) => v.conversationType === "group" || v.groupId), h = !!b, f = (b == null ? void 0 : b.groupId) || (h ? r.replace(/^group:/, "") : ""), I = (b == null ? void 0 : b.groupName) || (h ? "Group Chat" : ""), d = h ? le(u.flatMap((v) => [
      ...v.groupMemberUserIds,
      v.senderUserId,
      ...v.recipientUserIds
    ])) : [], w = h ? le(u.flatMap((v) => v.groupMemberNames)) : [], T = w.length ? w : d.map((v) => {
      var G, Z, C;
      return (C = (Z = (G = game.users) == null ? void 0 : G.get) == null ? void 0 : Z.call(G, v)) == null ? void 0 : C.name;
    }).filter(Boolean), _ = (c == null ? void 0 : c.senderUserId) === ((he = game == null ? void 0 : game.user) == null ? void 0 : he.id) ? (re = c == null ? void 0 : c.recipientUserIds) == null ? void 0 : re.find((v) => {
      var G;
      return v !== ((G = game == null ? void 0 : game.user) == null ? void 0 : G.id);
    }) : c == null ? void 0 : c.senderUserId, P = (c == null ? void 0 : c.senderUserId) === ((Ce = game == null ? void 0 : game.user) == null ? void 0 : Ce.id) ? ((Me = c == null ? void 0 : c.recipientNumbers) == null ? void 0 : Me[0]) || "" : (c == null ? void 0 : c.senderNumber) || ((Te = c == null ? void 0 : c.recipientNumbers) == null ? void 0 : Te[0]) || "", D = c != null && c.contactName && !(c != null && c.contactUserId) && (c.contactIsNpc || c.contactManagedByGM) ? {
      id: `contact-${((Ge = c.recipientNumbers) == null ? void 0 : Ge[0]) || c.senderNumber || r}`,
      name: c.contactName,
      number: ((ke = c.recipientNumbers) == null ? void 0 : ke[0]) || c.senderNumber || "",
      image: c.contactImage || "",
      actorId: ((Ue = c.recipientActorIds) == null ? void 0 : Ue[0]) ?? c.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: H(c.contactName)
    } : null, F = (c == null ? void 0 : c.senderUserId) !== ((Be = game == null ? void 0 : game.user) == null ? void 0 : Be.id) && (c != null && c.senderNumber) && (c != null && c.contactName) ? {
      id: `contact-${c.senderNumber || r}`,
      name: c.contactName,
      number: c.senderNumber,
      image: c.contactImage || "",
      actorId: c.senderActorId ?? "",
      userId: "",
      userIds: [],
      managedByGM: !0,
      isNpc: !0,
      initials: H(c.contactName)
    } : null, R = (h ? {
      id: `group-${f || r}`,
      name: I,
      number: `${d.length} member${d.length === 1 ? "" : "s"}`,
      image: "",
      actorId: "",
      userId: "",
      userIds: d.filter((v) => {
        var G;
        return v !== ((G = game == null ? void 0 : game.user) == null ? void 0 : G.id);
      }),
      managedByGM: !1,
      isNpc: !1,
      isGroup: !0,
      initials: H(I)
    } : null) ?? D ?? F ?? i.get(_) ?? s.get(P) ?? {
      id: `contact-${P || r}`,
      name: (c == null ? void 0 : c.contactName) || ((c == null ? void 0 : c.senderUserId) === ((Pe = game == null ? void 0 : game.user) == null ? void 0 : Pe.id) ? P || "Unknown Contact" : (c == null ? void 0 : c.senderName) || P || "Unknown Contact"),
      number: P,
      image: (c == null ? void 0 : c.contactImage) || "",
      actorId: ((Ee = c == null ? void 0 : c.recipientActorIds) == null ? void 0 : Ee[0]) ?? "",
      userId: "",
      userIds: [],
      managedByGM: !!(c != null && c.contactName || (De = c == null ? void 0 : c.recipientActorIds) != null && De[0]),
      isNpc: !!(c != null && c.contactName || (Re = c == null ? void 0 : c.recipientActorIds) != null && Re[0]),
      initials: H((c == null ? void 0 : c.contactName) || (c == null ? void 0 : c.senderName) || P)
    }, W = h ? null : [...u].reverse().find(
      (v) => v.senderUserId === _ && v.senderImage
    ), ne = [...u].reverse().find((v) => {
      var Z, C;
      const G = (C = (Z = game.users) == null ? void 0 : Z.get) == null ? void 0 : C.call(Z, v.senderUserId);
      return v.senderUserId && (G == null ? void 0 : G.isGM) !== !0 && !v.contactUserId && !!v.contactName && (v.contactIsNpc || v.contactManagedByGM);
    }) ?? null, B = ((Ie = game == null ? void 0 : game.user) == null ? void 0 : Ie.isGM) === !0 ? ne : null, ae = B ? `TO: ${B.contactName}` : "", U = B ? i.get(B.senderUserId) : null, M = (B == null ? void 0 : B.senderName) || (U == null ? void 0 : U.name) || R.name || (c == null ? void 0 : c.senderName) || "Unknown Contact", q = B ? (U == null ? void 0 : U.number) || `@${B.senderName}` : R.number || (c == null ? void 0 : c.senderNumber) || "", j = B ? H(M) : R.initials || H(R.name || (c == null ? void 0 : c.senderName)), J = (B == null ? void 0 : B.senderImage) || (U == null ? void 0 : U.image) || (W == null ? void 0 : W.senderImage) || R.image || "", qe = a[r] ?? "", fe = u.filter(
      (v) => {
        var G;
        return v.senderUserId !== ((G = game == null ? void 0 : game.user) == null ? void 0 : G.id) && v.createdAt > qe;
      }
    );
    return {
      id: r,
      title: M,
      subtitle: q,
      initials: j,
      image: J,
      avatarTone: Nt(h ? f || r : (B == null ? void 0 : B.senderUserId) || R.userId || R.number || r),
      routeLabel: ae,
      hasRouteLabel: !!ae,
      isNpcRouted: !!ne,
      contact: R,
      messages: u.map((v) => {
        var G;
        return {
          ...v,
          isMine: v.senderUserId === ((G = game == null ? void 0 : game.user) == null ? void 0 : G.id),
          isEvent: v.messageType !== "text"
        };
      }),
      lastMessage: c,
      lastPreview: (c == null ? void 0 : c.body) ?? "",
      updatedAt: (c == null ? void 0 : c.createdAt) ?? "",
      unread: fe.length > 0,
      unreadCount: fe.length,
      active: r === n,
      isGroup: h,
      groupId: f,
      groupName: I,
      groupMemberUserIds: d,
      groupMemberNames: T
    };
  }).sort((r, l) => l.updatedAt.localeCompare(r.updatedAt));
}
function an(e) {
  var n, a, s;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[p]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, p, "message"));
  return (t == null ? void 0 : t.kind) === pe ? t : ((s = t == null ? void 0 : t.message) == null ? void 0 : s.kind) === pe ? t.message : null;
}
function rn(e) {
  return String(e != null && e.timestamp ? new Date(e.timestamp).toISOString() : (e == null ? void 0 : e.createdTime) ?? "");
}
function sn() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => t.id);
}
function Qe(e) {
  return [...new Set(e.map((t) => String(t ?? "").trim()).filter(Boolean))];
}
function cn(e) {
  const t = Array.isArray(e == null ? void 0 : e.whisper) ? e.whisper : [];
  return Qe(t.map((n) => (n == null ? void 0 : n.id) ?? n));
}
function on(e, t) {
  var i, o;
  const n = String(((i = game.user) == null ? void 0 : i.id) ?? "").trim();
  if (!n) return !1;
  if (e.senderUserId === n || e.recipientUserIds.includes(n)) return !0;
  if (((o = game.user) == null ? void 0 : o.isGM) === !0)
    return !e.contactUserId && (e.contactManagedByGM || e.contactIsNpc) ? !0 : game.settings.get(p, "gmViewPlayerMessages") === !0;
  const s = cn(t);
  return s.length && !s.includes(n), !1;
}
function ln(e) {
  const t = Array.isArray(e == null ? void 0 : e.userIds) ? e.userIds : e != null && e.userId ? [e.userId] : [], n = Qe(t);
  return n.length ? n : sn();
}
function un(e) {
  return !!(e != null && e.userId || Array.isArray(e == null ? void 0 : e.userIds) && e.userIds.length);
}
function dn(e, t) {
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
function gn() {
  var t;
  return (((t = game.messages) == null ? void 0 : t.contents) ?? []).map((n) => {
    const a = an(n);
    if (!a) return null;
    const s = Je({
      ...a,
      chatMessageId: n.id,
      createdAt: a.createdAt || rn(n)
    });
    return on(s, n) ? s : null;
  }).filter(Boolean);
}
async function Xe(e, t, n = {}) {
  var I, d;
  const a = L(e), s = String(t ?? "").trim();
  if (!s) return null;
  const i = game.user, o = n.recipientUserIds ? Qe(n.recipientUserIds) : ln(e), r = !un(e), l = String(n.threadId ?? $e(e, i == null ? void 0 : i.id)), u = String(n.senderName ?? ((I = i == null ? void 0 : i.character) == null ? void 0 : I.name) ?? (i == null ? void 0 : i.name) ?? "Unknown Sender").trim(), c = String(n.senderActorId ?? ((d = i == null ? void 0 : i.character) == null ? void 0 : d.id) ?? "").trim(), b = String(n.senderNumber ?? "").trim(), h = Je({
    threadId: l,
    senderUserId: (i == null ? void 0 : i.id) ?? "",
    senderActorId: c,
    senderName: u,
    senderNumber: b,
    senderImage: String(n.senderImage ?? Se(i)).trim(),
    recipientUserIds: o,
    recipientActorIds: a.actorId ? [a.actorId] : [],
    recipientNumbers: n.recipientNumbers ?? (a.number ? [a.number] : []),
    contactName: String(n.contactName ?? a.name ?? ""),
    contactImage: String(n.contactImage ?? a.image ?? ""),
    contactUserId: String(n.contactUserId ?? a.userId ?? ""),
    contactManagedByGM: n.contactManagedByGM ?? (a.managedByGM === !0 || r),
    contactIsNpc: n.contactIsNpc ?? (a.isNpc === !0 || r),
    body: s,
    messageType: String(n.messageType ?? "text"),
    eventType: String(n.eventType ?? ""),
    conversationType: String(n.conversationType ?? "direct"),
    groupId: String(n.groupId ?? ""),
    groupName: String(n.groupName ?? ""),
    groupMemberUserIds: n.groupMemberUserIds ?? [],
    groupMemberNames: n.groupMemberNames ?? [],
    schemaVersion: It
  }), f = [...new Set([i == null ? void 0 : i.id, ...o].filter(Boolean))];
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: h.senderName }),
    whisper: f,
    content: dn(h, a),
    flags: {
      [p]: {
        kind: pe,
        ...h
      }
    }
  });
}
async function mn(e, t, n = {}) {
  return Xe(e, t, {
    ...n,
    messageType: n.messageType ?? "event"
  });
}
let m = null, A = null, Ne = null, ee = null, Q = null, ge = "personal", O = "", X = !1, K = !1, se = null, me = null;
function pn() {
  var e, t, n, a, s, i, o, r;
  return ue({
    callerName: ((e = m == null ? void 0 : m.callData) == null ? void 0 : e.callerName) ?? V.callerName,
    subtitle: ((t = m == null ? void 0 : m.callData) == null ? void 0 : t.subtitle) ?? V.subtitle,
    image: ((n = m == null ? void 0 : m.callData) == null ? void 0 : n.image) ?? "",
    message: ((a = m == null ? void 0 : m.callData) == null ? void 0 : a.message) ?? V.message,
    signal: ((s = m == null ? void 0 : m.callData) == null ? void 0 : s.signal) ?? game.settings.get(p, "defaultSignal"),
    variant: ((i = m == null ? void 0 : m.callData) == null ? void 0 : i.variant) ?? "standard",
    fullscreen: ((o = m == null ? void 0 : m.callData) == null ? void 0 : o.fullscreen) ?? !1,
    ringing: ((r = m == null ? void 0 : m.callData) == null ? void 0 : r.ringing) ?? !0
  });
}
function bn() {
  var e;
  return (((e = game.actors) == null ? void 0 : e.contents) ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    img: t.img ?? ""
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function yn() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => !t.isGM).map((t) => ({
    id: t.id,
    name: t.name,
    active: t.active === !0
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function fn() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => {
    var n;
    return !t.isGM && t.id !== ((n = game.user) == null ? void 0 : n.id);
  }).map((t) => ({
    id: String(t.id),
    name: String(t.name ?? "Unknown Player"),
    active: t.active === !0
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function hn() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => {
    var n;
    return t.id !== ((n = game.user) == null ? void 0 : n.id);
  }).map((t) => ({
    id: `user-${t.id}`,
    name: t.name,
    number: `@${t.name}`,
    image: Se(t),
    userId: t.id,
    userIds: [t.id],
    isNpc: !1,
    managedByGM: !1
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function Le() {
  var e, t;
  return String(((e = game.world) == null ? void 0 : e.id) ?? ((t = game.world) == null ? void 0 : t.title) ?? "default");
}
function At() {
  const e = game.settings.get(p, "contacts");
  return Array.isArray(e) ? { [Le()]: e } : !e || typeof e != "object" ? {} : e;
}
function ye() {
  const e = At()[Le()];
  return Array.isArray(e) ? e.map(L).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function ie() {
  if (Array.isArray(me))
    return me.map(L).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name));
  const e = game.settings.get(p, "groupContacts");
  return Array.isArray(e) ? e.map(L).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
function Ze() {
  const e = /* @__PURE__ */ new Map();
  for (const t of [...hn(), ...ie(), ...ye()]) {
    const n = t.userId ? `user:${t.userId}` : `number:${t.number || t.id}`;
    e.has(n) || e.set(n, t);
  }
  return [...e.values()].sort((t, n) => t.name.localeCompare(n.name));
}
async function St(e) {
  await game.settings.set(p, "contacts", {
    ...At(),
    [Le()]: e.map(L)
  });
}
async function Oe(e) {
  me = e.map(L), await game.settings.set(p, "groupContacts", me), game.socket.emit(oe, {
    action: "groupContactsChanged",
    contacts: me
  });
}
function He() {
  const e = game.settings.get(p, "messageReadState");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function $t() {
  const e = game.settings.get(p, "messageDeletedBefore");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function et() {
  const e = game.settings.get(p, "npcThreadBindings");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
async function Ye(e, t) {
  var a;
  if (!((a = game.user) != null && a.isGM) || !e) return;
  const n = { ...et() };
  t === null ? delete n[e] : n[e] = { ...n[e] ?? {}, ...t }, await game.settings.set(p, "npcThreadBindings", n);
}
function Mt() {
  const e = $t();
  return gn().filter((t) => {
    const n = e[t.threadId];
    return !n || t.createdAt > n;
  });
}
function Tt() {
  return vt(Mt(), Ze(), "", He()).reduce((e, t) => e + Number(t.unreadCount ?? 0), 0);
}
async function Cn(e, t = (/* @__PURE__ */ new Date()).toISOString()) {
  e && await game.settings.set(p, "messageReadState", {
    ...He(),
    [e]: t
  });
}
async function ve() {
  O && await Cn(O);
}
async function In(e) {
  e && (await game.settings.set(p, "messageDeletedBefore", {
    ...$t(),
    [e]: (/* @__PURE__ */ new Date()).toISOString()
  }), O === e && (O = "", X = !0, K = !1, Q && (Q.contact = null), (A == null ? void 0 : A.mode) === "messages" && (A.contact = null)), await z(), await te());
}
async function wn(e, t, n = "personal", a = "", s = {}) {
  var l, u, c, b, h, f, I;
  const i = s.actorId ? (l = game.actors) == null ? void 0 : l.get(s.actorId) : null, o = L({
    name: String(e ?? "").trim() || (i == null ? void 0 : i.name),
    number: t,
    image: we() && (String(a ?? "").trim() || (i == null ? void 0 : i.img)) || "",
    actorId: we() ? s.actorId : "",
    managedByGM: we() ? s.managedByGM === !0 : !1,
    isNpc: we() ? s.isNpc === !0 || s.managedByGM === !0 || !!s.actorId : !1
  });
  if (!o.name || !o.number) {
    (c = (u = ui.notifications) == null ? void 0 : u.warn) == null || c.call(u, "Contact name and number are required.");
    return;
  }
  if (n === "group" && !game.user.isGM) {
    if (!tt()) {
      (h = (b = ui.notifications) == null ? void 0 : b.warn) == null || h.call(b, "A GM must be connected to update group contacts.");
      return;
    }
    game.socket.emit(oe, {
      action: "groupContactAdd",
      contact: o
    }), (I = (f = ui.notifications) == null ? void 0 : f.info) == null || I.call(f, "Group contact update sent to the GM.");
    return;
  }
  const r = n === "group" ? ie() : ye();
  r.push(o), n === "group" ? await Oe(r) : await St(r), await te();
}
async function Nn(e, t = "personal") {
  var n, a, s, i;
  if (t === "group") {
    if (!game.user.isGM) {
      if (!tt()) {
        (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(oe, {
        action: "groupContactRemove",
        contactId: e
      }), (i = (s = ui.notifications) == null ? void 0 : s.info) == null || i.call(s, "Group contact removal sent to the GM.");
      return;
    }
    await Oe(ie().filter((o) => o.id !== e));
  } else
    await St(ye().filter((o) => o.id !== e));
  await te();
}
function tt() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function Fe(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(p, "minimumRole");
  } catch (n) {
    console.warn(`${p} | Permission setting unavailable, using Player role fallback.`, n);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function we(e = game.user) {
  return !!(e != null && e.isGM);
}
function Ve(e, t = null) {
  var n;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (n = e.element) != null && n[0] ? e.element[0] : e.element ?? null;
}
function vn(e, t = null) {
  const n = Ve(e, t);
  n && (n.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), n.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), n.classList.toggle("cybercall-connected", e.callData.accepted), n.querySelectorAll("[data-cybercall-action]").forEach((a) => {
    a.addEventListener("click", async (s) => {
      const i = s.currentTarget.dataset.cybercallAction;
      if (i === "accept") {
        await qn(e.callData.id);
        return;
      }
      if (i === "broadcast") {
        ot({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (i === "decline" || i === "end") && await Pt(e.callData.id);
    });
  }));
}
function An(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-composer]");
}
function bt(e) {
  var l, u;
  const t = new FormData(e), n = (l = game.actors) == null ? void 0 : l.get(t.get("actorId")), a = String(t.get("image") ?? "").trim() || (n == null ? void 0 : n.img) || "", s = String(t.get("callerName") ?? "").trim() || (n == null ? void 0 : n.name) || "UNKNOWN CALLER", i = t.getAll("targetUserIds").map((c) => String(c)).filter(Boolean), o = new Map((((u = game.users) == null ? void 0 : u.contents) ?? []).map((c) => [c.id, c])), r = i.map((c) => {
    var b;
    return ((b = o.get(c)) == null ? void 0 : b.name) ?? c;
  });
  return ue({
    callerName: s,
    subtitle: String(t.get("subtitle") ?? "").trim(),
    image: a,
    message: String(t.get("message") ?? "").trim(),
    signal: t.get("signal"),
    variant: String(t.get("variant") ?? V.variant),
    fullscreen: t.get("fullscreen") === "on",
    ringing: t.get("ringing") === "on",
    targetUserIds: i,
    targetUserNames: r
  });
}
function We(e) {
  var a, s;
  const t = (a = e == null ? void 0 : e.elements) == null ? void 0 : a.signal, n = (s = e == null ? void 0 : e.querySelector) == null ? void 0 : s.call(e, "[data-cybercall-signal-output]");
  !t || !n || (n.textContent = `${Ct(t.value)}%`);
}
function Sn(e, t = null) {
  var i, o;
  const n = Ve(e, t), a = An(n);
  if (!n || !a) return;
  We(a);
  const s = n.querySelector("[data-cybercall-ringtone]");
  s && s.addEventListener("change", async (r) => {
    await game.settings.set(p, "ringSound", r.currentTarget.value);
  }), (i = a.elements.signal) == null || i.addEventListener("input", () => We(a)), (o = a.elements.actorId) == null || o.addEventListener("change", () => {
    var l;
    const r = (l = game.actors) == null ? void 0 : l.get(a.elements.actorId.value);
    r && (a.elements.callerName.value = r.name, a.elements.image.value = r.img ?? "");
  }), a.addEventListener("submit", (r) => {
    r.preventDefault(), ce(bt(a));
  }), n.querySelectorAll("[data-cybercall-compose-action]").forEach((r) => {
    r.addEventListener("click", async (l) => {
      var b, h, f, I, d, w, T;
      const u = l.currentTarget.dataset.cybercallComposeAction, c = bt(a);
      if (u === "preview") {
        await ce(c);
        return;
      }
      if (u === "broadcast") {
        await ot(c);
        return;
      }
      if (u === "close-active") {
        Pt((b = m == null ? void 0 : m.callData) == null ? void 0 : b.id);
        return;
      }
      if (u === "browse-image") {
        const _ = a.elements.image, P = globalThis.FilePicker ?? ((I = (f = (h = globalThis.foundry) == null ? void 0 : h.applications) == null ? void 0 : f.apps) == null ? void 0 : I.FilePicker);
        if (!_ || !P) {
          (w = (d = ui.notifications) == null ? void 0 : d.warn) == null || w.call(d, "Foundry FilePicker is unavailable.");
          return;
        }
        const D = new P({
          type: "image",
          current: _.value,
          callback: (F) => {
            _.value = F, _.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof D.browse == "function" ? D.browse() : (T = D.render) == null || T.call(D, !0);
        return;
      }
      if (u === "reset") {
        a.reset(), We(a);
        return;
      }
      u === "open-messages" && await Ae();
    });
  });
}
function $n(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function Mn(e, t = null) {
  var i, o;
  const n = Ve(e, t), a = $n(n);
  if (!n || !a) return;
  a.addEventListener("submit", async (r) => {
    var c;
    r.preventDefault();
    const l = new FormData(a), u = String(l.get("scope") ?? ge);
    await wn(l.get("name"), l.get("number"), u, l.get("image"), {
      actorId: l.get("actorId"),
      managedByGM: l.get("managedByGM") === "on",
      isNpc: l.get("managedByGM") === "on" || !!l.get("actorId")
    }), a.reset(), a.elements.scope.value = u, (c = a.elements.name) == null || c.focus();
  }), (i = a.elements.actorId) == null || i.addEventListener("change", () => {
    var l;
    const r = (l = game.actors) == null ? void 0 : l.get(a.elements.actorId.value);
    r && (a.elements.name.value || (a.elements.name.value = r.name), a.elements.image && !a.elements.image.value && (a.elements.image.value = r.img ?? ""), a.elements.managedByGM && (a.elements.managedByGM.checked = !0));
  }), n.querySelectorAll("[data-cybercall-contact-tab]").forEach((r) => {
    r.addEventListener("click", (l) => {
      ge = l.currentTarget.dataset.cybercallContactTab, n.querySelectorAll("[data-cybercall-contact-tab]").forEach((u) => {
        u.classList.toggle("active", u.dataset.cybercallContactTab === ge);
      }), n.querySelectorAll("[data-cybercall-contact-panel]").forEach((u) => {
        u.hidden = u.dataset.cybercallContactPanel !== ge;
      }), a.elements.scope && (a.elements.scope.value = ge);
    });
  });
  const s = n.querySelector("[data-cybercall-ringtone]");
  s && s.addEventListener("change", async (r) => {
    await game.settings.set(p, "ringSound", r.currentTarget.value);
  }), n.querySelectorAll("[data-cybercall-contact-action]").forEach((r) => {
    r.addEventListener("click", async (l) => {
      const u = l.currentTarget.dataset.cybercallContactAction, c = l.currentTarget.dataset.contactId, b = l.currentTarget.dataset.contactScope ?? "personal", f = (b === "group" ? ie() : ye()).find((I) => I.id === c);
      if (u === "remove") {
        await Nn(c, b);
        return;
      }
      if (u === "call" && f) {
        await Wn(f) && ee === e && await e.close();
        return;
      }
      u === "message" && f && await Ae(f);
    });
  }), (o = n.querySelector("[data-cybercall-open-messages]")) == null || o.addEventListener("click", async () => {
    await Ae();
  });
}
function Tn(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
function Gn(e) {
  var c, b, h, f, I, d, w;
  const t = et()[e.id] ?? null, n = ((c = game.user) == null ? void 0 : c.isGM) === !0, a = !!(!e.isGroup && e.contact && !e.contact.userId && (e.contact.isNpc || e.contact.managedByGM || e.isNpcRouted)), s = t != null && t.actorId ? (h = (b = game.actors) == null ? void 0 : b.get) == null ? void 0 : h.call(b, t.actorId) : null, i = String((s == null ? void 0 : s.name) ?? (t == null ? void 0 : t.actorName) ?? "").trim(), o = String((t == null ? void 0 : t.image) ?? ((I = (f = s == null ? void 0 : s.prototypeToken) == null ? void 0 : f.texture) == null ? void 0 : I.src) ?? (s == null ? void 0 : s.img) ?? "").trim(), r = (t == null ? void 0 : t.revealPortrait) === !0, l = e.isNpcRouted === !0, u = t || l ? {
    ...e.contact,
    actorId: t && n ? String(t.actorId ?? e.contact.actorId ?? "") : e.contact.actorId,
    image: t && r ? o : ""
  } : e.contact;
  return {
    ...e,
    contact: u,
    image: !n && l ? t && r ? o : "" : e.image,
    canLinkNpc: n && a,
    showNpcLinkPanel: n && (a || !!t),
    hasNpcBinding: !!t,
    npcBindingName: i || ((d = e.contact) == null ? void 0 : d.name) || "Linked NPC",
    npcBindingImage: o,
    npcBindingInitials: H(i || ((w = e.contact) == null ? void 0 : w.name) || "NPC"),
    npcPortraitRevealed: r,
    npcBindingStatusLabel: t ? `Linked to ${i || "Actor"}` : "Unlinked NPC contact"
  };
}
function nt(e = null) {
  var f, I, d;
  let t = Ze();
  const n = e ?? t[0] ?? null;
  n && !t.some((w) => w.id === n.id || w.number === n.number) && (t = [...t, L(n)].sort((w, T) => w.name.localeCompare(T.name)));
  const a = X || K ? "" : O, s = vt(Mt(), t, a, He()).map((w) => ({
    ...Gn(w),
    messages: w.messages.map((T) => ({
      ...T,
      createdAtLabel: Tn(T.createdAt)
    }))
  })), i = X || K ? null : s.find((w) => w.id === O) ?? null;
  i != null && i.contact && !t.some((w) => w.id === i.contact.id || w.number === i.contact.number) && (t = [...t, i.contact].sort((w, T) => w.name.localeCompare(T.name)));
  const o = ((f = i == null ? void 0 : i.contact) == null ? void 0 : f.id) ?? (n == null ? void 0 : n.id) ?? "", r = Tt(), l = Gt(i, { excludeGMs: !1 }), u = Bn(i), c = kt(), b = ((I = game.user) == null ? void 0 : I.isGM) === !0 && !i && c.length > 1, h = fn();
  return {
    threads: s,
    hasThreads: s.length > 0,
    unreadCount: r,
    hasUnreadMessages: r > 0,
    activeThread: i,
    activeThreadId: (i == null ? void 0 : i.id) ?? a,
    allContacts: t.map((w) => ({
      ...w,
      selected: w.id === o
    })),
    hasContacts: t.length > 0,
    selectedContactId: o,
    isThreadReply: !!i,
    isComposingNewMessage: !i && !K,
    isComposingNewGroup: K,
    groupMemberChoices: h,
    hasGroupMemberChoices: h.length > 0,
    canDeleteThread: !!i,
    threadReplyLabel: i ? `${i.title}${i.subtitle ? ` (${i.subtitle})` : ""}` : "",
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
function kn(e, t = nt()) {
  const n = String(new FormData(e).get("contactId") ?? "");
  return t.allContacts.find((a) => a.id === n) ?? null;
}
function Gt(e, t = {}) {
  var i, o, r;
  if (!((i = e == null ? void 0 : e.messages) != null && i.length)) return [];
  const n = String(((o = game.user) == null ? void 0 : o.id) ?? ""), a = new Set((((r = game.users) == null ? void 0 : r.contents) ?? []).filter((l) => l.isGM).map((l) => String(l.id))), s = /* @__PURE__ */ new Set();
  for (const l of e.messages) {
    l.senderUserId && l.senderUserId !== n && !(t.excludeGMs && a.has(l.senderUserId)) && s.add(l.senderUserId);
    for (const u of l.recipientUserIds ?? [])
      u && u !== n && !(t.excludeGMs && a.has(u)) && s.add(u);
  }
  return [...s];
}
function Un() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => t.isGM).map((t) => String(t.id)).filter(Boolean);
}
function Bn(e) {
  var a, s, i, o, r;
  const t = !!((a = game.user) != null && a.isGM && (e != null && e.contact) && !e.contact.userId && (e.contact.isNpc || e.contact.managedByGM)), n = [{
    id: "self",
    label: ((i = (s = game.user) == null ? void 0 : s.character) == null ? void 0 : i.name) ?? ((o = game.user) == null ? void 0 : o.name) ?? "Me",
    selected: !t
  }];
  return !((r = game.user) != null && r.isGM) || !(e != null && e.contact) || e.contact.userId || n.push({
    id: "contact",
    label: e.contact.name,
    selected: t
  }), n;
}
function kt() {
  var n, a, s, i, o;
  const e = [{
    id: "self",
    label: ((a = (n = game.user) == null ? void 0 : n.character) == null ? void 0 : a.name) ?? ((s = game.user) == null ? void 0 : s.name) ?? "Me",
    selected: !0,
    contact: null
  }];
  if (!((i = game.user) != null && i.isGM)) return e;
  const t = /* @__PURE__ */ new Set();
  for (const r of [...ie(), ...ye()].map(L)) {
    if (!r.name || r.userId || !r.managedByGM && !r.actorId && !r.isNpc) continue;
    const l = r.actorId || r.number || r.id;
    t.has(l) || (t.add(l), e.push({
      id: l,
      label: r.name,
      selected: !1,
      contact: r
    }));
  }
  for (const r of ((o = game.actors) == null ? void 0 : o.contents) ?? []) {
    const l = `actor-${r.id}`;
    t.has(r.id) || t.has(l) || (t.add(l), e.push({
      id: l,
      label: r.name,
      selected: !1,
      contact: L({
        id: l,
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
function yt(e) {
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
function Pn(e, t) {
  var i, o;
  const n = new FormData(e);
  if (t.activeThread)
    return String(n.get("replyAs") ?? "self") === "contact" && ((i = game.user) != null && i.isGM) && t.activeThread.contact ? yt(t.activeThread.contact) : {};
  const a = String(n.get("sendAs") ?? "self");
  if (a === "self" || !((o = game.user) != null && o.isGM)) return {};
  const s = kt().find((r) => r.id === a);
  return yt(s == null ? void 0 : s.contact);
}
function En(e) {
  var n, a, s, i, o;
  const t = globalThis.TextEditor ?? ((s = (a = (n = globalThis.foundry) == null ? void 0 : n.applications) == null ? void 0 : a.ux) == null ? void 0 : s.TextEditor);
  try {
    const r = (i = t == null ? void 0 : t.getDragEventData) == null ? void 0 : i.call(t, e);
    if (r && Object.keys(r).length) return r;
  } catch {
  }
  try {
    return JSON.parse(((o = e.dataTransfer) == null ? void 0 : o.getData("text/plain")) || "{}");
  } catch {
    return {};
  }
}
function ft(e) {
  var n, a, s, i, o, r;
  const t = String(
    ((n = e == null ? void 0 : e.getTextureSrc) == null ? void 0 : n.call(e)) || ((a = e == null ? void 0 : e.texture) == null ? void 0 : a.src) || ((i = (s = e == null ? void 0 : e.document) == null ? void 0 : s.texture) == null ? void 0 : i.src) || ((r = (o = e == null ? void 0 : e.prototypeToken) == null ? void 0 : o.texture) == null ? void 0 : r.src) || (e == null ? void 0 : e.img) || ""
  ).trim();
  return t.includes("*") ? String((e == null ? void 0 : e.img) ?? "").trim() : t;
}
async function Dn(e) {
  var o, r, l, u, c, b, h, f;
  const t = En(e), n = globalThis.fromUuid;
  let a = t.uuid && n ? await n(t.uuid) : null;
  !a && t.sceneId && t.tokenId && (a = ((c = (u = (l = (r = (o = game.scenes) == null ? void 0 : o.get) == null ? void 0 : r.call(o, t.sceneId)) == null ? void 0 : l.tokens) == null ? void 0 : u.get) == null ? void 0 : c.call(u, t.tokenId)) ?? null);
  const s = String(
    ((b = a == null ? void 0 : a.actor) == null ? void 0 : b.id) || (a == null ? void 0 : a.actorId) || ((a == null ? void 0 : a.documentName) === "Actor" ? a.id : "") || t.actorId || (t.type === "Actor" ? t.id : "") || ""
  ).trim(), i = (a == null ? void 0 : a.documentName) === "Actor" ? a : (a == null ? void 0 : a.actor) ?? (s ? (f = (h = game.actors) == null ? void 0 : h.get) == null ? void 0 : f.call(h, s) : null);
  return i ? {
    actorId: String(i.id ?? s),
    actorUuid: String(i.uuid ?? `Actor.${i.id ?? s}`),
    actorName: String(i.name ?? "Linked NPC"),
    image: ft(a) || ft(i),
    revealPortrait: !1,
    linkedAt: (/* @__PURE__ */ new Date()).toISOString()
  } : null;
}
async function Rn(e, t) {
  var a, s, i, o, r;
  if (!((a = game.user) != null && a.isGM) || !t) return;
  e.preventDefault(), e.stopPropagation();
  const n = await Dn(e);
  if (!n) {
    (i = (s = ui.notifications) == null ? void 0 : s.warn) == null || i.call(s, "Drop an Actor or an Actor-backed Token to link this NPC contact.");
    return;
  }
  await Ye(t, n), (r = (o = ui.notifications) == null ? void 0 : o.info) == null || r.call(o, `Linked this NPC conversation to ${n.actorName}.`), await z();
}
async function xn(e, t) {
  var f, I, d, w, T, _, P, D;
  const n = new FormData(e), a = String(n.get("groupName") ?? "").trim(), s = [...new Set(n.getAll("memberUserIds").map((F) => String(F)).filter(Boolean))];
  if (!a) {
    (I = (f = ui.notifications) == null ? void 0 : f.warn) == null || I.call(f, "Enter a name for the group chat.");
    return;
  }
  if (!s.length) {
    (w = (d = ui.notifications) == null ? void 0 : d.warn) == null || w.call(d, "Select at least one other player for the group chat.");
    return;
  }
  const i = String(((T = game.user) == null ? void 0 : T.id) ?? ""), o = [...new Set([i, ...s].filter(Boolean))], r = o.map((F) => {
    var Y, R, W;
    return String(((W = (R = (Y = game.users) == null ? void 0 : Y.get) == null ? void 0 : R.call(Y, F)) == null ? void 0 : W.name) ?? "").trim();
  }).filter(Boolean), l = be(), u = nn(l), c = String(((P = (_ = game.user) == null ? void 0 : _.character) == null ? void 0 : P.name) ?? ((D = game.user) == null ? void 0 : D.name) ?? "A player").trim(), b = {
    id: `group-${l}`,
    name: a,
    number: `${o.length} members`,
    userIds: s,
    isGroup: !0
  };
  await Xe(b, `${c} created the group.`, {
    threadId: u,
    recipientUserIds: s,
    recipientNumbers: [],
    messageType: "event",
    eventType: "group-created",
    conversationType: "group",
    groupId: l,
    groupName: a,
    groupMemberUserIds: o,
    groupMemberNames: r
  }) && (O = u, X = !1, K = !1, t && (t.contact = b), (A == null ? void 0 : A.mode) === "messages" && (A.contact = b), await ve(), await z());
}
function On(e, t = null) {
  const n = Ve(e, t);
  if (!n) return;
  n.querySelectorAll("[data-cybercall-npc-link-drop]").forEach((i) => {
    i.addEventListener("dragover", (o) => {
      var r;
      (r = game.user) != null && r.isGM && (o.preventDefault(), o.dataTransfer.dropEffect = "link", i.classList.add("drag-over"));
    }), i.addEventListener("dragleave", () => i.classList.remove("drag-over")), i.addEventListener("drop", async (o) => {
      i.classList.remove("drag-over");
      const r = i.dataset.cybercallNpcThreadId || i.dataset.cybercallThreadId || O;
      await Rn(o, r);
    });
  }), n.querySelectorAll("[data-cybercall-npc-action]").forEach((i) => {
    i.addEventListener("click", async (o) => {
      var c, b, h, f, I;
      o.preventDefault(), o.stopPropagation();
      const r = o.currentTarget.dataset.cybercallNpcAction, l = o.currentTarget.dataset.cybercallNpcThreadId || O, u = et()[l];
      if (r === "toggle-reveal" && u) {
        await Ye(l, { revealPortrait: u.revealPortrait !== !0 }), await z();
        return;
      }
      if (r === "unlink" && u) {
        await Ye(l, null), (b = (c = ui.notifications) == null ? void 0 : c.info) == null || b.call(c, "NPC identity link removed."), await z();
        return;
      }
      r === "change" && ((h = o.currentTarget.closest("[data-cybercall-npc-link-drop]")) == null || h.classList.add("awaiting-drop"), (I = (f = ui.notifications) == null ? void 0 : f.info) == null || I.call(f, "Drag a different Actor or Token onto the NPC identity panel."));
    });
  }), n.querySelectorAll("[data-cybercall-thread-id]").forEach((i) => {
    i.addEventListener("click", async (o) => {
      X = !1, K = !1, O = o.currentTarget.dataset.cybercallThreadId, await ve(), await z();
    });
  }), n.querySelectorAll("[data-cybercall-message-action]").forEach((i) => {
    i.addEventListener("click", async (o) => {
      var l;
      const r = o.currentTarget.dataset.cybercallMessageAction;
      if (r === "refresh") {
        await z();
        return;
      }
      if (r === "open-calls") {
        await Et();
        return;
      }
      if (r === "new") {
        X = !0, K = !1, O = "", Q && (Q.contact = null), await z();
        return;
      }
      if (r === "new-group") {
        X = !1, K = !0, O = "", Q && (Q.contact = null), (A == null ? void 0 : A.mode) === "messages" && (A.contact = null), await z();
        return;
      }
      if (r === "delete-thread") {
        o.preventDefault(), o.stopPropagation();
        const u = n.querySelector("[data-cybercall-active-thread]"), c = O || ((l = u == null ? void 0 : u.dataset) == null ? void 0 : l.cybercallActiveThread) || "";
        if (!c) return;
        if (e._cybercallPendingDeleteThreadId !== c) {
          e._cybercallPendingDeleteThreadId = c, o.currentTarget.classList.add("confirming"), o.currentTarget.textContent = "Confirm Delete", o.currentTarget.title = "Click again to delete this thread";
          return;
        }
        e._cybercallPendingDeleteThreadId = "", await In(c);
      }
    });
  });
  const a = n.querySelector("form[data-cybercall-group-form]");
  a == null || a.addEventListener("submit", async (i) => {
    i.preventDefault(), await xn(a, e);
  });
  const s = n.querySelector("form[data-cybercall-message-form]");
  s == null || s.addEventListener("submit", async (i) => {
    var I, d, w, T;
    i.preventDefault();
    const o = nt(), r = o.activeThread, l = (r == null ? void 0 : r.contact) ?? kn(s, o), u = ((I = s.elements.body) == null ? void 0 : I.value) ?? "", c = Pn(s, o), b = !!(r != null && r.contact && !r.contact.userId && (r.contact.managedByGM || r.contact.isNpc)), h = r ? Gt(r, { excludeGMs: ((d = game.user) == null ? void 0 : d.isGM) === !0 && !b }) : null;
    if (!l) {
      (T = (w = ui.notifications) == null ? void 0 : w.warn) == null || T.call(w, "Select a contact before sending a message.");
      return;
    }
    await Xe(l, u, {
      ...c,
      threadId: r ? r.id : void 0,
      recipientUserIds: h != null && h.length ? h : void 0,
      recipientNumbers: c.senderNumber ? [] : void 0,
      conversationType: r != null && r.isGroup ? "group" : "direct",
      groupId: (r == null ? void 0 : r.groupId) ?? "",
      groupName: (r == null ? void 0 : r.groupName) ?? "",
      groupMemberUserIds: (r == null ? void 0 : r.groupMemberUserIds) ?? [],
      groupMemberNames: (r == null ? void 0 : r.groupMemberNames) ?? []
    }) && (O = r ? r.id : $e(l), e && (e.contact = l), (A == null ? void 0 : A.mode) === "messages" && (A.contact = l), X = !1, K = !1, s.elements.body.value = "", await ve(), await z());
  }), ve();
}
const { CyberCallApplication: _n, CyberCallPhone: Ln } = Yt({
  moduleId: p,
  templatePath: Jt,
  composerTemplatePath: Qt,
  contactsTemplatePath: Xt,
  messagesTemplatePath: Zt,
  phoneTemplatePath: Ht,
  escapeHTML: de,
  getDefaultComposerData: pn,
  getActorChoices: bn,
  getPlayerChoices: yn,
  getContacts: ye,
  getGroupContacts: ie,
  getMessageContext: nt,
  getRingtoneChoices: Jn,
  getSoundPath: lt,
  getActiveContactsTab: () => ge,
  canEditContactImages: we,
  bindCallControls: vn,
  bindComposerControls: Sn,
  bindContactsControls: Mn,
  bindMessagesControls: On,
  stopRinging: ut,
  clearActiveCall: (e) => {
    m === e && (m = null);
  },
  clearActiveComposer: (e) => {
    Ne === e && (Ne = null);
  },
  clearActiveContacts: (e) => {
    ee === e && (ee = null);
  },
  clearActiveMessages: (e) => {
    Q === e && (Q = null);
  },
  clearActivePhone: (e) => {
    A === e && (A = null, Ne = null, ee = null, Q = null);
  }
});
async function ce(e = {}) {
  var t, n;
  return Fe() ? (ee && await ee.close(), await at(), m = new _n(e), await m.render(!0), Dt(m), Qn(m.callData), m) : ((n = (t = ui.notifications) == null ? void 0 : t.warn) == null || n.call(t, "You do not have permission to open CyberCall transmissions."), null);
}
async function at() {
  if (!m) return;
  const e = m;
  m = null, await e.close();
}
function Fn(e) {
  var t;
  return !!((t = m == null ? void 0 : m.callData) != null && t.id) && m.callData.id === e;
}
async function Vn() {
  m && (await m.render(!0), Dt(m));
}
async function Ut(e) {
  Fn(e) && (m.callData.accepted = !0, m.callData.ringing = !1, ut(), await Vn());
}
async function qn(e) {
  e && (await _e(m == null ? void 0 : m.callData, "connected"), game.socket.emit(oe, {
    action: "acceptCall",
    callId: e
  }), await Ut(e));
}
async function Bt(e) {
  var t;
  e && ((t = m == null ? void 0 : m.callData) != null && t.id) && m.callData.id !== e || await at();
}
async function Pt(e) {
  var t;
  await _e(m == null ? void 0 : m.callData, (t = m == null ? void 0 : m.callData) != null && t.accepted ? "ended" : "missed"), game.socket.emit(oe, {
    action: "endCall",
    callId: e
  }), await Bt(e);
}
function jn(e, t = "Player") {
  var a, s, i, o, r;
  const n = ((s = (a = game.users) == null ? void 0 : a.get) == null ? void 0 : s.call(a, e)) ?? ((r = (o = (i = game.users) == null ? void 0 : i.contents) == null ? void 0 : o.find) == null ? void 0 : r.call(o, (l) => l.id === e));
  return {
    id: `user-${e}`,
    name: (n == null ? void 0 : n.name) ?? t,
    number: `@${(n == null ? void 0 : n.name) ?? t}`,
    image: Se(n),
    userId: e,
    userIds: e ? [e] : []
  };
}
function zn(e) {
  var t;
  return e ? e.contactNumber ? Ze().find((a) => a.number === e.contactNumber) ?? {
    id: `contact-${e.contactNumber}`,
    name: e.contactName || e.callerName,
    number: e.contactNumber,
    image: e.contactImage || e.image,
    actorId: e.contactActorId ?? "",
    managedByGM: !0,
    isNpc: !0
  } : (t = game.user) != null && t.isGM && e.callerUserId ? jn(e.callerUserId, e.callerName) : null : null;
}
function Kn(e, t) {
  var a;
  const n = /* @__PURE__ */ new Set();
  for (const s of (t == null ? void 0 : t.userIds) ?? []) n.add(String(s));
  if (t != null && t.userId && n.add(String(t.userId)), e != null && e.callerUserId && n.add(String(e.callerUserId)), !(t != null && t.userId) && (t != null && t.managedByGM || t != null && t.isNpc || e != null && e.contactNumber))
    for (const s of Un()) n.add(s);
  return n.delete(String(((a = game.user) == null ? void 0 : a.id) ?? "")), [...n].filter(Boolean);
}
async function _e(e, t) {
  var i;
  const n = zn(e);
  if (!n) return null;
  const a = (e == null ? void 0 : e.callerUserId) || ((i = game.user) == null ? void 0 : i.id), s = {
    outgoing: `Outgoing call to ${n.name}.`,
    connected: `Call connected with ${n.name}.`,
    ended: `Call ended with ${n.name}.`,
    missed: `Call missed or declined with ${n.name}.`
  };
  return mn(n, s[t] ?? "Call event.", {
    threadId: $e(n, a),
    eventType: t,
    senderName: "CyberCall",
    senderNumber: n.number,
    senderActorId: n.actorId,
    recipientUserIds: Kn(e, n),
    recipientNumbers: n.userId ? [] : [n.number]
  });
}
async function Wn(e) {
  var o, r;
  if (game.user.isGM) {
    const l = {
      callerName: e.name,
      subtitle: `Comms ${e.number}`,
      image: e.image,
      message: `Opening channel ${e.number}...`,
      signal: game.settings.get(p, "defaultSignal"),
      variant: "standard",
      contactNumber: e.number,
      ringing: !1
    };
    return await _e(l, "outgoing"), ce(l);
  }
  if (!tt())
    return (r = (o = ui.notifications) == null ? void 0 : o.warn) == null || r.call(o, "No GM is connected to receive the CyberCall."), null;
  const t = be(), n = Se(game.user), a = {
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
  }, s = ue({
    ...a,
    callerName: e.name,
    subtitle: `Comms ${e.number}`,
    image: e.image,
    message: `Awaiting connection to ${e.name} on ${e.number}...`,
    canAccept: !1,
    canDecline: !1,
    outgoing: !0,
    ringing: !0
  }), i = ue({
    ...a,
    callerName: game.user.name,
    subtitle: `Call request from ${game.user.name}`,
    image: n,
    message: `${game.user.name} is calling ${e.name} on ${e.number}.`,
    canAccept: !0,
    ringing: !0
  });
  return game.socket.emit(oe, {
    action: "playerCallRequest",
    callData: i
  }), await _e(s, "outgoing"), ce(s);
}
async function rt() {
  var e, t;
  return game.user.isGM ? ct("calls") : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function st() {
  var e, t, n;
  return Fe() ? m ? ((n = m.bringToFront) == null || n.call(m), m) : ct("calls") : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function te() {
  ee && await ee.render(!0);
}
async function Ae(e = null) {
  var n, a;
  if (!Fe())
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "You do not have permission to use CyberCall messages."), null;
  e ? (O = $e(e), X = !1, K = !1) : O || K || (X = !0);
  const t = await ct("messages", e);
  return await ve(), t;
}
async function it(e) {
  return e && (O = String(e), X = !1, K = !1), Ae();
}
async function Et() {
  var e;
  return (e = game.user) != null && e.isGM ? rt() : st();
}
async function z() {
  !A || A.mode !== "messages" || await A.render(!0);
}
async function ct(e = "calls", t = null) {
  var n, a, s;
  return A ? (A.mode = e, A.contact = t, await A.render(!0), (n = A.bringToFront) == null || n.call(A)) : (A = new Ln(e, t), await A.render(!0)), Ne = (a = game.user) != null && a.isGM && e === "calls" ? A : null, ee = !((s = game.user) != null && s.isGM) && e === "calls" ? A : null, Q = e === "messages" ? A : null, A;
}
async function ot(e = {}) {
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
  }), ce({ ...t, outgoing: !0 });
}
async function Yn(e) {
  var t, n, a;
  if (e && !(Array.isArray(e.targetUserIds) && e.targetUserIds.length && !e.targetUserIds.includes((t = game.user) == null ? void 0 : t.id)) && !(Array.isArray((n = e.callData) == null ? void 0 : n.targetUserIds) && e.callData.targetUserIds.length && !e.callData.targetUserIds.includes((a = game.user) == null ? void 0 : a.id))) {
    if (e.action === "openCall") {
      if (!Fe()) return;
      ce(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      ce(e.callData);
      return;
    }
    if (e.action === "acceptCall") {
      Ut(e.callId);
      return;
    }
    if (e.action === "endCall") {
      Bt(e.callId);
      return;
    }
    if (e.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const s = L({
        ...e.contact,
        image: ""
      });
      if (!s.name || !s.number) return;
      const i = ie();
      i.push(s), await Oe(i), await te();
      return;
    }
    if (e.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await Oe(ie().filter((s) => s.id !== e.contactId)), await te();
      return;
    }
    e.action === "groupContactsChanged" && (me = Array.isArray(e.contacts) ? e.contacts.map(L) : null, await te());
  }
}
function Dt(e) {
  var t, n;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((n = e.setPosition) == null || n.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function lt() {
  return String(game.settings.get(p, "ringSound") ?? "").trim();
}
function Jn() {
  const e = lt();
  return Object.entries(wt).map(([t, n]) => ({
    value: t,
    label: n,
    selected: t === e
  }));
}
function ut() {
  if (!se) return;
  const e = se;
  se = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function Qn(e) {
  var i;
  if (ut(), !e.ringing) return;
  const t = lt();
  if (!t) return;
  const a = 0.65 * Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), s = ((i = foundry == null ? void 0 : foundry.audio) == null ? void 0 : i.AudioHelper) ?? globalThis.AudioHelper;
  s != null && s.play ? s.play({ src: t, volume: a, autoplay: !0, loop: !0 }, !1).then((o) => {
    se = o;
  }).catch((o) => {
    console.warn(`${p} | Unable to play ringing sound.`, o);
  }) : (se = new Audio(t), se.loop = !0, se.volume = a, se.play().catch((o) => {
    console.warn(`${p} | Unable to play ringing sound.`, o);
  }));
}
function Xn() {
  const e = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  if (!e) return;
  const t = new e(), n = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), a = Math.max(1e-4, Math.min(0.18, 0.18 * n)), s = (o, r, l) => {
    const u = t.createOscillator(), c = t.createGain(), b = t.currentTime + r, h = b + l;
    u.type = "sine", u.frequency.setValueAtTime(o, b), u.frequency.exponentialRampToValueAtTime(o * 1.18, h), c.gain.setValueAtTime(1e-4, b), c.gain.exponentialRampToValueAtTime(a, b + 0.025), c.gain.exponentialRampToValueAtTime(1e-4, h), u.connect(c), c.connect(t.destination), u.start(b), u.stop(h);
  };
  (async () => {
    t.state === "suspended" && await t.resume(), s(620, 0, 0.16), s(930, 0.11, 0.2), window.setTimeout(() => {
      var o;
      return (o = t.close) == null ? void 0 : o.call(t);
    }, 500);
  })().catch(() => {
    var o;
    return (o = t.close) == null ? void 0 : o.call(t);
  });
}
function Zn(e) {
  var n, a, s, i, o;
  if (e.senderImage) return String(e.senderImage);
  if (e.contactIsNpc && e.senderNumber) return "";
  const t = ((a = (n = game.users) == null ? void 0 : n.get) == null ? void 0 : a.call(n, e.senderUserId)) ?? ((o = (i = (s = game.users) == null ? void 0 : s.contents) == null ? void 0 : i.find) == null ? void 0 : o.call(i, (r) => r.id === e.senderUserId));
  return (t == null ? void 0 : t.isGM) === !0 ? "" : Se(t);
}
function ht(e) {
  e != null && e.isConnected && (e.classList.add("leaving"), window.setTimeout(() => e.remove(), 220));
}
function Hn(e) {
  let t = document.querySelector("[data-cybercall-message-notifications]");
  t || (t = document.createElement("div"), t.className = "cybercall-message-notifications", t.dataset.cybercallMessageNotifications = "", t.setAttribute("aria-live", "polite"), document.body.append(t));
  const n = String(e.senderName || "New message").trim(), a = String(e.groupName || "").trim(), s = document.createElement("button");
  s.type = "button", s.className = "cybercall-incoming-message", s.title = "Open CyberCall conversation";
  const i = document.createElement("span");
  i.className = `cybercall-incoming-avatar ${Nt(e.senderUserId || n)}`;
  const o = Zn(e);
  if (o) {
    const b = document.createElement("img");
    b.src = o, b.alt = "", i.append(b);
  } else
    i.textContent = H(n);
  const r = document.createElement("i");
  r.className = "fa-solid fa-message cybercall-incoming-badge", r.setAttribute("aria-hidden", "true"), i.append(r);
  const l = document.createElement("span");
  l.className = "cybercall-incoming-copy";
  const u = document.createElement("strong");
  u.textContent = a ? `${n} · ${a}` : n;
  const c = document.createElement("small");
  c.textContent = String(e.body || "New CyberCall message").trim(), l.append(u, c), s.append(i, l), s.addEventListener("click", () => {
    ht(s), it(String(e.threadId || ""));
  }), t.append(s), Xn(), window.setTimeout(() => ht(s), 4200);
}
function ea(e) {
  var n, a, s;
  const t = ((n = e == null ? void 0 : e.flags) == null ? void 0 : n[p]) ?? ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, p, "message"));
  return (t == null ? void 0 : t.kind) === pe ? t : ((s = t == null ? void 0 : t.message) == null ? void 0 : s.kind) === pe ? t.message : null;
}
function Rt(e, t) {
  var a, s, i, o, r, l, u;
  if (!e) return;
  const n = (a = e.matches) != null && a.call(e, ".chat-message") ? e : ((s = e.closest) == null ? void 0 : s.call(e, ".chat-message")) ?? ((i = e.querySelector) == null ? void 0 : i.call(e, ".chat-message")) ?? e;
  (r = (o = n.classList) == null ? void 0 : o.toggle) == null || r.call(o, "cybercall-chat-message-hidden", !t), t ? (l = n.removeAttribute) == null || l.call(n, "aria-hidden") : (u = n.setAttribute) == null || u.call(n, "aria-hidden", "true");
}
function xt(e, t) {
  if (!ea(e)) return;
  const n = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) ?? (t == null ? void 0 : t.element) ?? null;
  Rt(n, game.settings.get(p, "showChatCards") === !0);
}
function Ot() {
  const e = game.settings.get(p, "showChatCards") === !0;
  document.querySelectorAll(".cybercall-chat-card").forEach((t) => {
    Rt(t, e);
  });
}
function _t() {
  const e = game.modules.get(p);
  e && (e.api = {
    openCall: ce,
    closeCall: at,
    broadcastCall: ot,
    openComposer: rt,
    openContacts: st,
    openMessages: Ae,
    openMessagesThread: it,
    openCallPanel: Et,
    getUnreadMessageCount: Tt,
    get activeCall() {
      return m;
    },
    get activeComposer() {
      return Ne;
    },
    get activeContacts() {
      return ee;
    },
    get activeMessages() {
      return Q;
    }
  });
}
function ta() {
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
      return (a = game.user) != null && a.isGM ? rt() : st();
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
function na() {
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
    choices: wt
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
      z(), te();
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
    onChange: () => Ot()
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
      z(), te();
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
async function aa() {
  const e = game.settings.get(p, "contacts");
  Array.isArray(e) && await game.settings.set(p, "contacts", {
    [Le()]: e.map(L)
  });
}
Hooks.once("init", () => {
  na(), _t();
});
Hooks.once("ready", async () => {
  await aa(), _t(), ta(), game.socket.on(oe, Yn), Ot(), console.log(`${p} | Ready. Use game.modules.get("${p}").api.openCall({...})`);
});
Hooks.on("renderChatMessage", (e, t) => {
  xt(e, t);
});
Hooks.on("renderChatMessageHTML", (e, t) => {
  xt(e, t);
});
Hooks.on("createChatMessage", async (e) => {
  var r, l, u;
  const t = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[p];
  if ((t == null ? void 0 : t.kind) !== pe) return;
  const n = String(((l = game.user) == null ? void 0 : l.id) ?? ""), a = Array.isArray(t.recipientUserIds) ? t.recipientUserIds.map((c) => String(c)) : [], s = ((u = game.user) == null ? void 0 : u.isGM) === !0 && !String(t.contactUserId ?? "") && (t.contactManagedByGM === !0 || t.contactIsNpc === !0), i = String(t.senderUserId ?? "") !== n && (a.includes(n) || s), o = String(t.messageType ?? "text") === "text" || t.eventType === "group-created";
  i && o && game.settings.get(p, "messageNotifications") !== !1 && Hn(t), await z(), await te();
});
document.addEventListener("click", (e) => {
  var a;
  const t = e.target, n = (a = t == null ? void 0 : t.closest) == null ? void 0 : a.call(t, "[data-cybercall-open-thread]");
  n && (e.preventDefault(), it(n.dataset.cybercallThreadId));
});
