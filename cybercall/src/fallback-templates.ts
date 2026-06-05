type EscapeHTML = (value: unknown) => string;

function makeFallbackImageMarkup(call: any, escapeHTML: EscapeHTML) {
  if (call.image) {
    return `<img src="${escapeHTML(call.image)}" alt="${escapeHTML(call.callerName)}">`;
  }
  return `<div class="cybercall-initials" aria-hidden="true">${escapeHTML(call.initials)}</div>`;
}

export function renderFallbackTemplate(call: any, escapeHTML: EscapeHTML) {
  const signalStyle = `--cybercall-signal: ${call.signal}%;`;
  const fullscreenClass = call.fullscreen ? "cybercall-broadcast" : "";
  const ringingClass = call.ringing ? "cybercall-ringing-panel" : "";
  const connectedClass = call.accepted ? "cybercall-connected-panel" : "";
  const broadcastButton = call.showBroadcast
    ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>'
    : "";
  const headerMarkup = call.accepted
    ? ""
    : `
      <header class="cybercall-header">
        <div>
          <div class="cybercall-kicker">${escapeHTML(call.kicker)}</div>
          <h2>${escapeHTML(call.callerName)}</h2>
          <p>${escapeHTML(call.subtitle)}</p>
        </div>
        <div class="cybercall-signal">
          <span>${call.signal}%</span>
          <div class="cybercall-signal-bar" aria-hidden="true"><i></i></div>
        </div>
      </header>
    `;
  const messageMarkup = call.accepted ? "" : `<blockquote>${escapeHTML(call.message)}</blockquote>`;
  const actionsMarkup = call.accepted
    ? '<button type="button" data-cybercall-action="end">End Call</button>'
    : call.outgoing
      ? '<button type="button" data-cybercall-action="end">End Call</button>'
      : `
        ${call.canAccept ? '<button type="button" data-cybercall-action="accept">Accept</button>' : ""}
        <button type="button" data-cybercall-action="decline">Decline</button>
        ${broadcastButton}
      `;
  return `
    <div class="cybercall-panel cybercall-${call.variant} ${fullscreenClass} ${ringingClass} ${connectedClass}" style="${signalStyle}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${headerMarkup}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${makeFallbackImageMarkup(call, escapeHTML)}</div>
        ${messageMarkup}
      </main>
      <footer class="cybercall-actions">
        ${actionsMarkup}
      </footer>
    </div>
  `;
}

export function renderComposerFallbackTemplate(data: any, escapeHTML: EscapeHTML) {
  const call = data.call;
  const actorOptions = data.actors
    .map((actor: any) => `<option value="${escapeHTML(actor.id)}">${escapeHTML(actor.name)}</option>`)
    .join("");

  return `
    <form class="cybercall-composer" data-cybercall-composer>
      <label>Actor Portrait
        <select name="actorId">
          <option value="">Manual / no actor</option>
          ${actorOptions}
        </select>
      </label>
      <label>Caller Name <input type="text" name="callerName" value="${escapeHTML(call.callerName)}"></label>
      <label>Subtitle / Faction <input type="text" name="subtitle" value="${escapeHTML(call.subtitle)}"></label>
      <label>Portrait Image Path <span class="cybercall-composer-path-row"><input type="text" name="image" value="${escapeHTML(call.image)}"><button type="button" data-cybercall-compose-action="browse-image">Browse</button></span></label>
      <label>Message <textarea name="message" rows="5">${escapeHTML(call.message)}</textarea></label>
      <label>Signal <input type="range" name="signal" min="0" max="100" value="${call.signal}"></label>
      <label>Variant
        <select name="variant">
          <option value="standard" ${call.variant === "standard" ? "selected" : ""}>Standard Blue</option>
          <option value="emergency" ${call.variant === "emergency" ? "selected" : ""}>Emergency Red</option>
          <option value="corrupted" ${call.variant === "corrupted" ? "selected" : ""}>Corrupted Green</option>
        </select>
      </label>
      <label><input type="checkbox" name="fullscreen" ${call.fullscreen ? "checked" : ""}> Fullscreen Broadcast</label>
      <label><input type="checkbox" name="ringing" ${call.ringing ? "checked" : ""}> Ringing Animation / Sound</label>
      <div class="cybercall-composer-ringtone">
        <label class="cybercall-ringtone-select">
          <span>Ringtone</span>
          <select data-cybercall-ringtone>
            ${(data.ringtoneChoices ?? []).map((choice: any) =>
              `<option value="${escapeHTML(choice.value)}" ${choice.selected ? "selected" : ""}>${escapeHTML(choice.label)}</option>`
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

export function renderContactsFallbackTemplate(data: any, escapeHTML: EscapeHTML) {
  const renderContactList = (contacts: any[], scope: string) => contacts.length
    ? contacts.map((contact) => `
        <li>
          <div class="cybercall-contact-avatar">
            ${contact.image ? `<img src="${escapeHTML(contact.image)}" alt="">` : `<span>${escapeHTML(contact.initials)}</span>`}
          </div>
          <div class="cybercall-contact-id">
            <strong>${escapeHTML(contact.name)}</strong>
            <span>${escapeHTML(contact.number)}</span>
          </div>
          <div class="cybercall-contact-actions">
            <button type="button" data-cybercall-contact-action="call" data-contact-scope="${scope}" data-contact-id="${escapeHTML(contact.id)}">Call</button>
            <button type="button" data-cybercall-contact-action="remove" data-contact-scope="${scope}" data-contact-id="${escapeHTML(contact.id)}">Remove</button>
          </div>
        </li>
      `).join("")
    : '<li class="cybercall-contacts-empty">No contacts stored.</li>';
  const personalActive = data.activeTab !== "group";
  const groupActive = data.activeTab === "group";

  return `
    <section class="cybercall-contacts">
      <header class="cybercall-contacts-header">
        <div>
          <div class="cybercall-contacts-kicker">Personal Comms Directory</div>
          <h2>CyberCall Contacts</h2>
        </div>
      </header>
      <nav class="cybercall-contact-tabs">
        <button type="button" class="${personalActive ? "active" : ""}" data-cybercall-contact-tab="personal">Personal</button>
        <button type="button" class="${groupActive ? "active" : ""}" data-cybercall-contact-tab="group">Group</button>
      </nav>
      <section data-cybercall-contact-panel="personal" ${personalActive ? "" : "hidden"}>
        <ul class="cybercall-contacts-list">${renderContactList(data.contacts, "personal")}</ul>
      </section>
      <section data-cybercall-contact-panel="group" ${groupActive ? "" : "hidden"}>
        <ul class="cybercall-contacts-list">${renderContactList(data.groupContacts, "group")}</ul>
      </section>
      <form class="cybercall-contacts-form" data-cybercall-contacts-form>
        <input type="hidden" name="scope" value="${escapeHTML(data.activeTab)}">
        <label>Name <input type="text" name="name" required></label>
        <label>Number <input type="text" name="number" required></label>
        <label>Picture <input type="text" name="image" placeholder="icons/..."></label>
        <button type="submit">Add Contact</button>
      </form>
      <footer class="cybercall-contacts-footer">
        <label class="cybercall-ringtone-select">
          <span>Ringtone</span>
          <select data-cybercall-ringtone>
            ${(data.ringtoneChoices ?? []).map((choice: any) =>
              `<option value="${escapeHTML(choice.value)}" ${choice.selected ? "selected" : ""}>${escapeHTML(choice.label)}</option>`
            ).join("")}
          </select>
        </label>
      </footer>
    </section>
  `;
}
