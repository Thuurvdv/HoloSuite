// @ts-nocheck
const MODULE_ID = "cybercall";
const SOCKET_NAME = `module.${MODULE_ID}`;
const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/cybercall.hbs`;
const COMPOSER_TEMPLATE_PATH = `modules/${MODULE_ID}/templates/cybercall-composer.hbs`;
const CONTACTS_TEMPLATE_PATH = `modules/${MODULE_ID}/templates/cybercall-contacts.hbs`;

let activeCall = null;
let activeComposer = null;
let activeContacts = null;
let activeContactsTab = "personal";
let ringingAudio = null;
let groupContactsCache = null;

const DEFAULT_CALL = {
  callerName: "UNKNOWN CALLER",
  subtitle: "Unidentified Signal",
  image: "",
  message: "Incoming transmission...",
  signal: 100,
  variant: "standard",
  fullscreen: false,
  ringing: true,
  accepted: false,
  canAccept: true,
  canDecline: true,
  allowBroadcast: true,
  outgoing: false
};

const VARIANTS = new Set(["standard", "emergency", "corrupted"]);
const RINGTONE_CHOICES = {
  "": "Silent",
  [`modules/${MODULE_ID}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${MODULE_ID}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${MODULE_ID}/audio/Ringtone3.ogg`]: "Ringtone 3"
};

function clampSignal(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return DEFAULT_CALL.signal;
  return Math.min(100, Math.max(0, Math.round(number)));
}

function getInitials(name) {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";
}

function escapeHTML(value) {
  if (foundry?.utils?.escapeHTML) return foundry.utils.escapeHTML(String(value));
  const element = document.createElement("div");
  element.innerText = String(value);
  return element.innerHTML;
}

function createCallId() {
  if (foundry?.utils?.randomID) return foundry.utils.randomID();
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeCallData(data = {}) {
  const call = {
    ...DEFAULT_CALL,
    ...data,
    id: String(data.id ?? createCallId()),
    callerName: String(data.callerName ?? DEFAULT_CALL.callerName),
    subtitle: String(data.subtitle ?? DEFAULT_CALL.subtitle),
    image: String(data.image ?? DEFAULT_CALL.image),
    message: String(data.message ?? DEFAULT_CALL.message),
    signal: clampSignal(data.signal ?? DEFAULT_CALL.signal),
    variant: VARIANTS.has(data.variant) ? data.variant : DEFAULT_CALL.variant,
    fullscreen: Boolean(data.fullscreen ?? DEFAULT_CALL.fullscreen),
    ringing: data.ringing !== false && data.accepted !== true,
    accepted: data.accepted === true,
    canAccept: data.canAccept !== false,
    canDecline: data.canDecline !== false,
    allowBroadcast: data.allowBroadcast !== false,
    outgoing: data.outgoing === true,
    callerUserId: String(data.callerUserId ?? ""),
    contactNumber: String(data.contactNumber ?? "")
  };
  call.initials = getInitials(call.callerName);
  call.showBroadcast = Boolean(game?.user?.isGM && call.allowBroadcast);
  call.isStandard = call.variant === "standard";
  call.isEmergency = call.variant === "emergency";
  call.isCorrupted = call.variant === "corrupted";
  call.isIncoming = !call.accepted;
  call.kicker = call.outgoing ? "Outgoing CyberCall" : call.fullscreen ? "System-wide Broadcast" : "Incoming CyberCall";
  return call;
}

function getDefaultComposerData() {
  return normalizeCallData({
    callerName: activeCall?.callData?.callerName ?? DEFAULT_CALL.callerName,
    subtitle: activeCall?.callData?.subtitle ?? DEFAULT_CALL.subtitle,
    image: activeCall?.callData?.image ?? "",
    message: activeCall?.callData?.message ?? DEFAULT_CALL.message,
    signal: activeCall?.callData?.signal ?? game.settings.get(MODULE_ID, "defaultSignal"),
    variant: activeCall?.callData?.variant ?? "standard",
    fullscreen: activeCall?.callData?.fullscreen ?? false,
    ringing: activeCall?.callData?.ringing ?? true
  });
}

function getActorChoices() {
  return (game.actors?.contents ?? [])
    .map((actor) => ({
      id: actor.id,
      name: actor.name,
      img: actor.img ?? ""
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function normalizeContact(contact = {}) {
  return {
    id: String(contact.id ?? createCallId()),
    name: String(contact.name ?? "").trim(),
    number: String(contact.number ?? "").trim(),
    image: String(contact.image ?? contact.img ?? "").trim(),
    initials: getInitials(contact.name)
  };
}

function getContacts() {
  const contacts = game.settings.get(MODULE_ID, "contacts");
  if (!Array.isArray(contacts)) return [];

  return contacts
    .map(normalizeContact)
    .filter((contact) => contact.name && contact.number)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getGroupContacts() {
  if (Array.isArray(groupContactsCache)) {
    return groupContactsCache
      .map(normalizeContact)
      .filter((contact) => contact.name && contact.number)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  const contacts = game.settings.get(MODULE_ID, "groupContacts");
  if (!Array.isArray(contacts)) return [];

  return contacts
    .map(normalizeContact)
    .filter((contact) => contact.name && contact.number)
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function saveContacts(contacts) {
  await game.settings.set(MODULE_ID, "contacts", contacts.map(normalizeContact));
}

async function saveGroupContacts(contacts) {
  groupContactsCache = contacts.map(normalizeContact);
  await game.settings.set(MODULE_ID, "groupContacts", groupContactsCache);
  game.socket.emit(SOCKET_NAME, {
    action: "groupContactsChanged",
    contacts: groupContactsCache
  });
}

async function addContact(name, number, scope = "personal", image = "") {
  const contact = normalizeContact({ name, number, image });
  if (!contact.name || !contact.number) {
    ui.notifications?.warn?.("Contact name and number are required.");
    return;
  }

  if (scope === "group" && !game.user.isGM) {
    if (!hasActiveGM()) {
      ui.notifications?.warn?.("A GM must be connected to update group contacts.");
      return;
    }

    game.socket.emit(SOCKET_NAME, {
      action: "groupContactAdd",
      contact
    });
    ui.notifications?.info?.("Group contact update sent to the GM.");
    return;
  }

  const contacts = scope === "group" ? getGroupContacts() : getContacts();
  contacts.push(contact);
  if (scope === "group") await saveGroupContacts(contacts);
  else await saveContacts(contacts);
  await refreshContacts();
}

async function removeContact(contactId, scope = "personal") {
  if (scope === "group") {
    if (!game.user.isGM) {
      if (!hasActiveGM()) {
        ui.notifications?.warn?.("A GM must be connected to update group contacts.");
        return;
      }

      game.socket.emit(SOCKET_NAME, {
        action: "groupContactRemove",
        contactId
      });
      ui.notifications?.info?.("Group contact removal sent to the GM.");
      return;
    }

    await saveGroupContacts(getGroupContacts().filter((contact) => contact.id !== contactId));
  } else {
    await saveContacts(getContacts().filter((contact) => contact.id !== contactId));
  }
  await refreshContacts();
}

function hasActiveGM() {
  return game.users?.some((user) => user.isGM && user.active) ?? false;
}

function canUseCyberCall(user = game.user) {
  if (user?.isGM) return true;
  let requiredRole = CONST.USER_ROLES.PLAYER;
  try {
    requiredRole = game.settings.get(MODULE_ID, "minimumRole");
  } catch (error) {
    console.warn(`${MODULE_ID} | Permission setting unavailable, using Player role fallback.`, error);
  }
  return Number(user?.role ?? 0) >= Number(requiredRole);
}

function getElement(app, html) {
  if (html?.[0]) return html[0];
  if (html instanceof HTMLElement) return html;
  if (app.element?.[0]) return app.element[0];
  return app.element ?? null;
}

function bindCallControls(app, html) {
  const element = getElement(app, html);
  if (!element) return;
  element.classList.toggle("cybercall-fullscreen", app.callData.fullscreen);
  element.classList.toggle("cybercall-ringing", app.callData.ringing && !app.callData.accepted);
  element.classList.toggle("cybercall-connected", app.callData.accepted);

  element.querySelectorAll("[data-cybercall-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const action = event.currentTarget.dataset.cybercallAction;
      if (action === "accept") {
        acceptCallForEveryone(app.callData.id);
        return;
      }

      if (action === "broadcast") {
        broadcastCall({
          ...app.callData,
          fullscreen: true,
          ringing: true
        });
        return;
      }

      if (action === "decline" || action === "end") {
        endCallForEveryone(app.callData.id);
      }
    });
  });
}

function getComposerForm(element) {
  return element?.querySelector?.("form[data-cybercall-composer]");
}

function readComposerForm(form) {
  const formData = new FormData(form);
  const actor = game.actors?.get(formData.get("actorId"));
  const image = String(formData.get("image") ?? "").trim() || actor?.img || "";
  const callerName = String(formData.get("callerName") ?? "").trim() || actor?.name || "UNKNOWN CALLER";

  return normalizeCallData({
    callerName,
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    image,
    message: String(formData.get("message") ?? "").trim(),
    signal: formData.get("signal"),
    variant: String(formData.get("variant") ?? DEFAULT_CALL.variant),
    fullscreen: formData.get("fullscreen") === "on",
    ringing: formData.get("ringing") === "on"
  });
}

function updateComposerSignal(form) {
  const signal = form?.elements?.signal;
  const output = form?.querySelector?.("[data-cybercall-signal-output]");
  if (!signal || !output) return;
  output.textContent = `${clampSignal(signal.value)}%`;
}

function bindComposerControls(app, html) {
  const element = getElement(app, html);
  const form = getComposerForm(element);
  if (!element || !form) return;

  updateComposerSignal(form);

  form.elements.signal?.addEventListener("input", () => updateComposerSignal(form));
  form.elements.actorId?.addEventListener("change", () => {
    const actor = game.actors?.get(form.elements.actorId.value);
    if (!actor) return;
    form.elements.callerName.value = actor.name;
    form.elements.image.value = actor.img ?? "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    openCall(readComposerForm(form));
  });

  element.querySelectorAll("[data-cybercall-compose-action]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const action = event.currentTarget.dataset.cybercallComposeAction;
      const callData = readComposerForm(form);

      if (action === "preview") {
        await openCall(callData);
        return;
      }

      if (action === "broadcast") {
        await broadcastCall(callData);
        return;
      }

      if (action === "close-active") {
        endCallForEveryone(activeCall?.callData?.id);
        return;
      }

      if (action === "browse-image") {
        const input = form.elements.image;
        const Picker = globalThis.FilePicker ?? globalThis.foundry?.applications?.apps?.FilePicker;
        if (!input || !Picker) {
          ui.notifications?.warn?.("Foundry FilePicker is unavailable.");
          return;
        }
        const picker = new Picker({
          type: "image",
          current: input.value,
          callback: (path) => {
            input.value = path;
            input.dispatchEvent(new Event("change", { bubbles: true }));
          }
        });
        if (typeof picker.browse === "function") picker.browse();
        else picker.render?.(true);
        return;
      }

      if (action === "reset") {
        form.reset();
        updateComposerSignal(form);
      }
    });
  });
}

function getContactsForm(element) {
  return element?.querySelector?.("form[data-cybercall-contacts-form]");
}

function bindContactsControls(app, html) {
  const element = getElement(app, html);
  const form = getContactsForm(element);
  if (!element || !form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const scope = String(formData.get("scope") ?? activeContactsTab);
    await addContact(formData.get("name"), formData.get("number"), scope, formData.get("image"));
    form.reset();
    form.elements.scope.value = scope;
    form.elements.name?.focus();
  });

  element.querySelectorAll("[data-cybercall-contact-tab]").forEach((button) => {
    button.addEventListener("click", (event) => {
      activeContactsTab = event.currentTarget.dataset.cybercallContactTab;
      element.querySelectorAll("[data-cybercall-contact-tab]").forEach((tabButton) => {
        tabButton.classList.toggle("active", tabButton.dataset.cybercallContactTab === activeContactsTab);
      });
      element.querySelectorAll("[data-cybercall-contact-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.cybercallContactPanel !== activeContactsTab;
      });
      if (form.elements.scope) form.elements.scope.value = activeContactsTab;
    });
  });

  const ringtoneSelect = element.querySelector("[data-cybercall-ringtone]");
  if (ringtoneSelect) {
    ringtoneSelect.addEventListener("change", async (event) => {
      await game.settings.set(MODULE_ID, "ringSound", event.currentTarget.value);
    });
  }

  element.querySelectorAll("[data-cybercall-contact-action]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const action = event.currentTarget.dataset.cybercallContactAction;
      const contactId = event.currentTarget.dataset.contactId;
      const scope = event.currentTarget.dataset.contactScope ?? "personal";
      const contactList = scope === "group" ? getGroupContacts() : getContacts();
      const contact = contactList.find((entry) => entry.id === contactId);

      if (action === "remove") {
        await removeContact(contactId, scope);
        return;
      }

      if (action === "call" && contact) {
        const call = await requestCallToGM(contact);
        if (call && activeContacts === app) await app.close();
      }
    });
  });
}

function makeFallbackImageMarkup(call) {
  if (call.image) {
    return `<img src="${escapeHTML(call.image)}" alt="${escapeHTML(call.callerName)}">`;
  }
  return `<div class="cybercall-initials" aria-hidden="true">${escapeHTML(call.initials)}</div>`;
}

function renderFallbackTemplate(call) {
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
    : `
        ${call.canAccept ? '<button type="button" data-cybercall-action="accept">Accept</button>' : ""}
        ${call.canDecline ? '<button type="button" data-cybercall-action="decline">Decline</button>' : ""}
        ${broadcastButton}
        <button type="button" data-cybercall-action="end">End Call</button>
      `;
  return `
    <div class="cybercall-panel cybercall-${call.variant} ${fullscreenClass} ${ringingClass} ${connectedClass}" style="${signalStyle}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${headerMarkup}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${makeFallbackImageMarkup(call)}</div>
        ${messageMarkup}
      </main>
      <footer class="cybercall-actions">
        ${actionsMarkup}
      </footer>
    </div>
  `;
}

function renderComposerFallbackTemplate(data) {
  const call = data.call;
  const actorOptions = data.actors
    .map((actor) => `<option value="${escapeHTML(actor.id)}">${escapeHTML(actor.name)}</option>`)
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
      <div class="cybercall-composer-actions">
        <button type="button" data-cybercall-compose-action="preview">Preview Locally</button>
        <button type="button" data-cybercall-compose-action="broadcast">Broadcast to Players</button>
        <button type="button" data-cybercall-compose-action="close-active">Close Active Call</button>
      </div>
    </form>
  `;
}

function renderContactsFallbackTemplate(data) {
  const renderContactList = (contacts, scope) => contacts.length
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
            ${(data.ringtoneChoices ?? []).map((choice) =>
              `<option value="${escapeHTML(choice.value)}" ${choice.selected ? "selected" : ""}>${escapeHTML(choice.label)}</option>`
            ).join("")}
          </select>
        </label>
      </footer>
    </section>
  `;
}

const ApplicationV2 = foundry?.applications?.api?.ApplicationV2;
const HandlebarsApplicationMixin = foundry?.applications?.api?.HandlebarsApplicationMixin;

class CyberCallApplicationV1 extends Application {
  constructor(callData, options = {}) {
    super(options);
    this.callData = normalizeCallData(callData);
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-overlay",
      title: "CyberCall",
      template: TEMPLATE_PATH,
      classes: ["cybercall-app"],
      popOut: true,
      resizable: true,
      width: 440,
      height: "auto"
    });
  }

  getData() {
    return {
      call: this.callData
    };
  }

  async _renderInner(data) {
    try {
      return await super._renderInner(data);
    } catch (error) {
      console.warn(`${MODULE_ID} | Template render failed, using inline fallback.`, error);
      return $(renderFallbackTemplate(this.callData));
    }
  }

  activateListeners(html) {
    super.activateListeners(html);
    bindCallControls(this, html);
  }

  async close(options) {
    if (activeCall === this) activeCall = null;
    stopRinging();
    return super.close(options);
  }
}

class CyberCallComposerV1 extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-composer",
      title: "CyberCall Composer",
      template: COMPOSER_TEMPLATE_PATH,
      classes: ["cybercall-composer-app"],
      popOut: true,
      resizable: true,
      width: 560,
      height: "auto"
    });
  }

  getData() {
    return {
      call: getDefaultComposerData(),
      actors: getActorChoices()
    };
  }

  async _renderInner(data) {
    try {
      return await super._renderInner(data);
    } catch (error) {
      console.warn(`${MODULE_ID} | Composer template render failed, using inline fallback.`, error);
      return $(renderComposerFallbackTemplate(data));
    }
  }

  activateListeners(html) {
    super.activateListeners(html);
    bindComposerControls(this, html);
  }

  async close(options) {
    if (activeComposer === this) activeComposer = null;
    return super.close(options);
  }
}

class CyberCallContactsV1 extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "cybercall-contacts",
      title: "CyberCall Contacts",
      template: CONTACTS_TEMPLATE_PATH,
      classes: ["cybercall-contacts-app"],
      popOut: true,
      resizable: true,
      width: 500,
      height: "auto"
    });
  }

  getData() {
    const contacts = getContacts();
    const groupContacts = getGroupContacts();
    return {
      contacts,
      groupContacts,
      hasContacts: contacts.length > 0,
      hasGroupContacts: groupContacts.length > 0,
      activeTab: activeContactsTab,
      isPersonalTab: activeContactsTab !== "group",
      isGroupTab: activeContactsTab === "group",
      ringtoneChoices: getRingtoneChoices(),
      currentRingtone: getSoundPath()
    };
  }

  async _renderInner(data) {
    try {
      return await super._renderInner(data);
    } catch (error) {
      console.warn(`${MODULE_ID} | Contacts template render failed, using inline fallback.`, error);
      return $(renderContactsFallbackTemplate(data));
    }
  }

  activateListeners(html) {
    super.activateListeners(html);
    bindContactsControls(this, html);
  }

  async close(options) {
    if (activeContacts === this) activeContacts = null;
    return super.close(options);
  }
}

function createApplicationV2Class() {
  if (!ApplicationV2 || !HandlebarsApplicationMixin) return null;

  return class CyberCallApplicationV2 extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
      id: "cybercall-overlay",
      tag: "section",
      classes: ["cybercall-app"],
      window: {
        title: "CyberCall",
        resizable: true
      },
      position: {
        width: 440,
        height: "auto"
      }
    };

    static PARTS = {
      main: {
        template: TEMPLATE_PATH
      }
    };

    constructor(callData, options = {}) {
      super(options);
      this.callData = normalizeCallData(callData);
    }

    async _prepareContext(options) {
      return {
        ...(await super._prepareContext(options)),
        call: this.callData
      };
    }

    async _renderHTML(context, options) {
      try {
        return await super._renderHTML(context, options);
      } catch (error) {
        console.warn(`${MODULE_ID} | Template render failed, using inline fallback.`, error);
        const wrapper = document.createElement("template");
        wrapper.innerHTML = renderFallbackTemplate(this.callData).trim();
        return wrapper.content;
      }
    }

    _onRender(context, options) {
      super._onRender?.(context, options);
      bindCallControls(this);
    }

    async close(options) {
      if (activeCall === this) activeCall = null;
      stopRinging();
      return super.close(options);
    }
  };
}

const CyberCallApplication = createApplicationV2Class() ?? CyberCallApplicationV1;

function createComposerV2Class() {
  if (!ApplicationV2 || !HandlebarsApplicationMixin) return null;

  return class CyberCallComposerV2 extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
      id: "cybercall-composer",
      tag: "section",
      classes: ["cybercall-composer-app"],
      window: {
        title: "CyberCall Composer",
        resizable: true
      },
      position: {
        width: 560,
        height: "auto"
      }
    };

    static PARTS = {
      main: {
        template: COMPOSER_TEMPLATE_PATH
      }
    };

    async _prepareContext(options) {
      return {
        ...(await super._prepareContext(options)),
        call: getDefaultComposerData(),
        actors: getActorChoices()
      };
    }

    async _renderHTML(context, options) {
      try {
        return await super._renderHTML(context, options);
      } catch (error) {
        console.warn(`${MODULE_ID} | Composer template render failed, using inline fallback.`, error);
        const wrapper = document.createElement("template");
        wrapper.innerHTML = renderComposerFallbackTemplate(context).trim();
        return wrapper.content;
      }
    }

    _onRender(context, options) {
      super._onRender?.(context, options);
      bindComposerControls(this);
    }

    async close(options) {
      if (activeComposer === this) activeComposer = null;
      return super.close(options);
    }
  };
}

const CyberCallComposer = createComposerV2Class() ?? CyberCallComposerV1;

function createContactsV2Class() {
  if (!ApplicationV2 || !HandlebarsApplicationMixin) return null;

  return class CyberCallContactsV2 extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
      id: "cybercall-contacts",
      tag: "section",
      classes: ["cybercall-contacts-app"],
      window: {
        title: "CyberCall Contacts",
        resizable: true
      },
      position: {
        width: 500,
        height: "auto"
      }
    };

    static PARTS = {
      main: {
        template: CONTACTS_TEMPLATE_PATH
      }
    };

    async _prepareContext(options) {
      const contacts = getContacts();
      const groupContacts = getGroupContacts();
      return {
        ...(await super._prepareContext(options)),
        contacts,
        groupContacts,
        hasContacts: contacts.length > 0,
        hasGroupContacts: groupContacts.length > 0,
        activeTab: activeContactsTab,
        isPersonalTab: activeContactsTab !== "group",
        isGroupTab: activeContactsTab === "group",
        ringtoneChoices: getRingtoneChoices(),
        currentRingtone: getSoundPath()
      };
    }

    async _renderHTML(context, options) {
      try {
        return await super._renderHTML(context, options);
      } catch (error) {
        console.warn(`${MODULE_ID} | Contacts template render failed, using inline fallback.`, error);
        const wrapper = document.createElement("template");
        wrapper.innerHTML = renderContactsFallbackTemplate(context).trim();
        return wrapper.content;
      }
    }

    _onRender(context, options) {
      super._onRender?.(context, options);
      bindContactsControls(this);
    }

    async close(options) {
      if (activeContacts === this) activeContacts = null;
      return super.close(options);
    }
  };
}

const CyberCallContacts = createContactsV2Class() ?? CyberCallContactsV1;

async function openCall(callData = {}) {
  if (!canUseCyberCall()) {
    ui.notifications?.warn?.("You do not have permission to open CyberCall transmissions.");
    return null;
  }

  if (activeContacts) await activeContacts.close();
  await closeCall();
  activeCall = new CyberCallApplication(callData);
  await activeCall.render(true);
  applyFullscreenPosition(activeCall);
  playRinging(activeCall.callData);
  return activeCall;
}

async function closeCall() {
  if (!activeCall) return;
  const call = activeCall;
  activeCall = null;
  await call.close();
}

function isActiveCallId(callId) {
  return Boolean(activeCall?.callData?.id) && activeCall.callData.id === callId;
}

async function refreshActiveCall() {
  if (!activeCall) return;
  await activeCall.render(true);
  applyFullscreenPosition(activeCall);
}

async function acceptCall(callId) {
  if (!isActiveCallId(callId)) return;
  activeCall.callData.accepted = true;
  activeCall.callData.ringing = false;
  stopRinging();
  await refreshActiveCall();
}

function acceptCallForEveryone(callId) {
  if (!callId) return;
  game.socket.emit(SOCKET_NAME, {
    action: "acceptCall",
    callId
  });
  acceptCall(callId);
}

async function endCall(callId) {
  if (callId && activeCall?.callData?.id && activeCall.callData.id !== callId) return;
  await closeCall();
}

function endCallForEveryone(callId) {
  game.socket.emit(SOCKET_NAME, {
    action: "endCall",
    callId
  });
  endCall(callId);
}

async function requestCallToGM(contact) {
  if (game.user.isGM) {
    return openCall({
      callerName: contact.name,
      subtitle: `Comms ${contact.number}`,
      image: contact.image,
      message: `Opening channel ${contact.number}...`,
      signal: game.settings.get(MODULE_ID, "defaultSignal"),
      variant: "standard",
      ringing: false
    });
  }

  if (!hasActiveGM()) {
    ui.notifications?.warn?.("No GM is connected to receive the CyberCall.");
    return null;
  }

  const callId = createCallId();
  const callerImage = String(game.user?.avatar ?? game.user?.character?.img ?? "").trim();
  const baseCall = {
    id: callId,
    signal: game.settings.get(MODULE_ID, "defaultSignal"),
    variant: "standard",
    fullscreen: false,
    accepted: false,
    allowBroadcast: false,
    callerUserId: game.user.id,
    contactNumber: contact.number
  };
  const callerCall = normalizeCallData({
    ...baseCall,
    callerName: contact.name,
    subtitle: `Comms ${contact.number}`,
    image: contact.image,
    message: `Awaiting connection to ${contact.name} on ${contact.number}...`,
    canAccept: false,
    canDecline: false,
    outgoing: true,
    ringing: true
  });
  const gmCall = normalizeCallData({
    ...baseCall,
    callerName: game.user.name,
    subtitle: `Call request from ${game.user.name}`,
    image: callerImage,
    message: `${game.user.name} is calling ${contact.name} on ${contact.number}.`,
    canAccept: true,
    ringing: true
  });

  game.socket.emit(SOCKET_NAME, {
    action: "playerCallRequest",
    callData: gmCall
  });

  return openCall(callerCall);
}

async function openComposer() {
  if (!game.user.isGM) {
    ui.notifications?.warn?.("Only the GM can open the CyberCall composer.");
    return null;
  }

  if (activeComposer) {
    activeComposer.bringToFront?.();
    return activeComposer;
  }

  activeComposer = new CyberCallComposer();
  await activeComposer.render(true);
  return activeComposer;
}

async function openContacts() {
  if (!canUseCyberCall()) {
    ui.notifications?.warn?.("You do not have permission to use CyberCall contacts.");
    return null;
  }

  if (activeCall) {
    activeCall.bringToFront?.();
    return activeCall;
  }

  if (activeContacts) {
    activeContacts.bringToFront?.();
    return activeContacts;
  }

  activeContacts = new CyberCallContacts();
  await activeContacts.render(true);
  return activeContacts;
}

async function refreshContacts() {
  if (!activeContacts) return;
  await activeContacts.render(true);
}

async function broadcastCall(callData = {}) {
  if (!game.user.isGM) {
    ui.notifications?.warn?.("Only the GM can broadcast CyberCalls to all players.");
    return null;
  }

  const call = normalizeCallData({
    ...callData,
    fullscreen: callData.fullscreen ?? true,
    ringing: true
  });

  game.socket.emit(SOCKET_NAME, {
    action: "openCall",
    callData: call
  });

  return openCall(call);
}

async function handleSocketMessage(message) {
  if (!message) return;

  if (message.action === "openCall") {
    if (!canUseCyberCall()) return;
    openCall(message.callData);
    return;
  }

  if (message.action === "playerCallRequest") {
    if (!game.user.isGM) return;
    openCall(message.callData);
    return;
  }

  if (message.action === "acceptCall") {
    acceptCall(message.callId);
    return;
  }

  if (message.action === "endCall") {
    endCall(message.callId);
    return;
  }

  if (message.action === "groupContactAdd") {
    if (!game.user.isGM) return;
    const contact = normalizeContact(message.contact);
    if (!contact.name || !contact.number) return;
    const contacts = getGroupContacts();
    contacts.push(contact);
    await saveGroupContacts(contacts);
    await refreshContacts();
    return;
  }

  if (message.action === "groupContactRemove") {
    if (!game.user.isGM) return;
    await saveGroupContacts(getGroupContacts().filter((contact) => contact.id !== message.contactId));
    await refreshContacts();
    return;
  }

  if (message.action === "groupContactsChanged") {
    groupContactsCache = Array.isArray(message.contacts) ? message.contacts.map(normalizeContact) : null;
    await refreshContacts();
  }
}

function applyFullscreenPosition(app) {
  if (!app?.callData?.fullscreen) return;
  app.setPosition?.({
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  });
}

function getSoundPath() {
  return String(game.settings.get(MODULE_ID, "ringSound") ?? "").trim();
}

function getRingtoneChoices() {
  const current = getSoundPath();
  return Object.entries(RINGTONE_CHOICES).map(([value, label]) => ({
    value,
    label,
    selected: value === current
  }));
}

function stopRinging() {
  if (!ringingAudio) return;
  ringingAudio.pause();
  ringingAudio.currentTime = 0;
  ringingAudio = null;
}

function playRinging(callData) {
  stopRinging();
  if (!callData.ringing) return;

  const soundPath = getSoundPath();
  if (!soundPath) return;

  ringingAudio = new Audio(soundPath);
  ringingAudio.loop = true;
  ringingAudio.volume = 0.65;
  ringingAudio.play().catch((error) => {
    console.warn(`${MODULE_ID} | Unable to play ringing sound.`, error);
  });
}

function registerApi() {
  const module = game.modules.get(MODULE_ID);
  if (!module) return;

  module.api = {
    openCall,
    closeCall,
    broadcastCall,
    openComposer,
    openContacts,
    get activeCall() {
      return activeCall;
    },
    get activeComposer() {
      return activeComposer;
    },
    get activeContacts() {
      return activeContacts;
    }
  };
}

function registerWithHoloSuite() {
  const holosuite = game.modules.get("holosuite-core");
  const api = holosuite?.active ? holosuite.api : null;
  if (!api?.registerApp) return false;

  api.registerApp({
    id: MODULE_ID,
    title: "CyberCall",
    icon: "fa-solid fa-satellite-dish",
    premium: false,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => game.user?.isGM ? openComposer() : openContacts()
  });
  return true;
}

function registerSettings() {
  const roles = CONST.USER_ROLES;
  const roleChoices = {};
  for (const [key, label] of [
    ["NONE", "None"],
    ["LIMITED", "Limited"],
    ["OBSERVER", "Observer"],
    ["PLAYER", "Player"],
    ["TRUSTED", "Trusted Player"],
    ["ASSISTANT", "Assistant GM"]
  ]) {
    if (Number.isFinite(Number(roles[key]))) roleChoices[roles[key]] = label;
  }

  game.settings.register(MODULE_ID, "defaultSignal", {
    name: "Default Signal Strength",
    hint: "Signal percentage used when a call does not provide one.",
    scope: "client",
    config: true,
    type: Number,
    default: DEFAULT_CALL.signal,
    range: {
      min: 0,
      max: 100,
      step: 1
    }
  });

  game.settings.register(MODULE_ID, "ringSound", {
    name: "Incoming Call Ringtone",
    hint: "Ringtone played locally while a CyberCall is ringing. This is a client setting, so each user can choose their own ringtone.",
    scope: "client",
    config: false,
    type: String,
    default: "",
    choices: RINGTONE_CHOICES
  });

  game.settings.register(MODULE_ID, "minimumRole", {
    name: "Minimum Player Role",
    hint: "Minimum role allowed to open CyberCall overlays and receive GM broadcasts.",
    scope: "world",
    config: true,
    type: Number,
    default: roles.PLAYER,
    choices: roleChoices
  });

  game.settings.register(MODULE_ID, "contacts", {
    name: "CyberCall Contacts",
    hint: "Player contact directory stored locally for this client.",
    scope: "client",
    config: false,
    type: Object,
    default: []
  });

  game.settings.register(MODULE_ID, "groupContacts", {
    name: "CyberCall Group Contacts",
    hint: "Shared group contact directory for all players in this world.",
    scope: "world",
    config: false,
    type: Object,
    default: []
  });
}

function addSceneControl(controls) {
  if (!canUseCyberCall()) return;

  const openDemoCall = () => game.user.isGM ? openComposer() : openContacts();

  const tool = {
    name: "cybercall",
    title: game.user.isGM ? "Compose CyberCall" : "CyberCall Contacts",
    icon: "fas fa-satellite-dish",
    button: true,
    visible: true,
    onClick: openDemoCall,
    onChange: openDemoCall
  };

  if (!Array.isArray(controls)) {
    const tokenControls = controls.tokens ?? controls.token;
    if (!tokenControls?.tools) return;
    const order = Object.keys(tokenControls.tools).length;
    tokenControls.tools.cybercall = { ...tool, order };
    return;
  }

  const tokenControls = controls.find((control) => control.name === "token");
  if (!tokenControls?.tools) return;
  tokenControls.tools.push(tool);
}

Hooks.once("init", () => {
  registerSettings();
  registerApi();
});

// HoloSuite Core is the suite launcher; keep this module out of the scene-control toolbar.

Hooks.once("ready", () => {
  registerApi();
  registerWithHoloSuite();
  game.socket.on(SOCKET_NAME, handleSocketMessage);
  console.log(`${MODULE_ID} | Ready. Use game.modules.get("${MODULE_ID}").api.openCall({...})`);
});
