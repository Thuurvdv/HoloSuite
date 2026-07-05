import { createCyberCallAppClasses } from "./apps";
import {
  DEFAULT_CALL,
  clampSignal,
  createCallId,
  normalizeCallData,
  normalizeContact
} from "./call-model";
import {
  COMPOSER_TEMPLATE_PATH,
  CONTACTS_TEMPLATE_PATH,
  MESSAGE_FLAG_KIND,
  MESSAGES_TEMPLATE_PATH,
  MODULE_ID,
  PHONE_TEMPLATE_PATH,
  RINGTONE_CHOICES,
  SOCKET_NAME,
  TEMPLATE_PATH
} from "./constants";
import { escapeHTML } from "./dom-utils";
import { createThreadIdForContact, prepareThreads } from "./message-model";
import { createMessageEvent, getStoredMessages, sendMessageToContact } from "./message-service";

let activeCall = null;
let activePhone = null;
let activeComposer = null;
let activeContacts = null;
let activeMessages = null;
let activeContactsTab = "personal";
let activeMessageThreadId = "";
let composingNewMessage = false;
let ringingAudio = null;
let groupContactsCache = null;

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

function getPlayerChoices() {
  return (game.users?.contents ?? [])
    .filter((user) => !user.isGM)
    .map((user) => ({
      id: user.id,
      name: user.name,
      active: user.active === true
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getUserMessageContacts() {
  return (game.users?.contents ?? [])
    .filter((user) => user.id !== game.user?.id)
    .map((user) => ({
      id: `user-${user.id}`,
      name: user.name,
      number: `@${user.name}`,
      image: user.avatar ?? user.character?.img ?? "",
      userId: user.id,
      userIds: [user.id],
      isNpc: false,
      managedByGM: false
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getWorldContactsKey() {
  return String(game.world?.id ?? game.world?.title ?? "default");
}

function getContactsStore() {
  const contacts = game.settings.get(MODULE_ID, "contacts");
  if (Array.isArray(contacts)) return { [getWorldContactsKey()]: contacts };
  if (!contacts || typeof contacts !== "object") return {};
  return contacts;
}

function getContacts() {
  const contacts = getContactsStore()[getWorldContactsKey()];
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

function getAllMessageContacts() {
  const contactsByKey = new Map<string, any>();
  for (const contact of [...getUserMessageContacts(), ...getGroupContacts(), ...getContacts()]) {
    const key = contact.userId ? `user:${contact.userId}` : `number:${contact.number || contact.id}`;
    if (!contactsByKey.has(key)) contactsByKey.set(key, contact);
  }
  return [...contactsByKey.values()].sort((a, b) => a.name.localeCompare(b.name));
}

async function saveContacts(contacts) {
  await game.settings.set(MODULE_ID, "contacts", {
    ...getContactsStore(),
    [getWorldContactsKey()]: contacts.map(normalizeContact)
  });
}

async function saveGroupContacts(contacts) {
  groupContactsCache = contacts.map(normalizeContact);
  await game.settings.set(MODULE_ID, "groupContacts", groupContactsCache);
  game.socket.emit(SOCKET_NAME, {
    action: "groupContactsChanged",
    contacts: groupContactsCache
  });
}

function getMessageReadState() {
  const state = game.settings.get(MODULE_ID, "messageReadState");
  if (!state || typeof state !== "object" || Array.isArray(state)) return {};
  return state;
}

function getMessageDeletedBeforeState() {
  const state = game.settings.get(MODULE_ID, "messageDeletedBefore");
  if (!state || typeof state !== "object" || Array.isArray(state)) return {};
  return state;
}

function getVisibleStoredMessages() {
  const deletedBefore = getMessageDeletedBeforeState();
  return getStoredMessages().filter((message) => {
    const deletedAt = deletedBefore[message.threadId];
    return !deletedAt || message.createdAt > deletedAt;
  });
}

function getUnreadMessageCount() {
  return prepareThreads(getVisibleStoredMessages(), getAllMessageContacts(), "", getMessageReadState())
    .reduce((total, thread) => total + Number(thread.unreadCount ?? 0), 0);
}

async function setThreadRead(threadId, timestamp = new Date().toISOString()) {
  if (!threadId) return;
  await game.settings.set(MODULE_ID, "messageReadState", {
    ...getMessageReadState(),
    [threadId]: timestamp
  });
}

async function markActiveThreadRead() {
  if (!activeMessageThreadId) return;
  await setThreadRead(activeMessageThreadId);
}

async function deleteMessageThread(threadId) {
  if (!threadId) return;
  await game.settings.set(MODULE_ID, "messageDeletedBefore", {
    ...getMessageDeletedBeforeState(),
    [threadId]: new Date().toISOString()
  });
  if (activeMessageThreadId === threadId) {
    activeMessageThreadId = "";
    composingNewMessage = true;
    if (activeMessages) activeMessages.contact = null;
    if (activePhone?.mode === "messages") activePhone.contact = null;
  }
  await refreshMessages();
  await refreshContacts();
}

async function addContact(name: any, number: any, scope = "personal", image: any = "", metadata: any = {}) {
  const actor = metadata.actorId ? game.actors?.get(metadata.actorId) : null;
  const contact = normalizeContact({
    name: String(name ?? "").trim() || actor?.name,
    number,
    image: canEditContactImages() ? (String(image ?? "").trim() || actor?.img || "") : "",
    actorId: canEditContactImages() ? metadata.actorId : "",
    managedByGM: canEditContactImages() ? metadata.managedByGM === true : false,
    isNpc: canEditContactImages() ? metadata.isNpc === true || metadata.managedByGM === true || Boolean(metadata.actorId) : false
  });
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

function canEditContactImages(user = game.user) {
  return Boolean(user?.isGM);
}

function getElement(app: any, html: any = null) {
  if (html?.[0]) return html[0];
  if (html instanceof HTMLElement) return html;
  if (app.element?.[0]) return app.element[0];
  return app.element ?? null;
}

function bindCallControls(app: any, html: any = null) {
  const element = getElement(app, html);
  if (!element) return;
  element.classList.toggle("cybercall-fullscreen", app.callData.fullscreen);
  element.classList.toggle("cybercall-ringing", app.callData.ringing && !app.callData.accepted);
  element.classList.toggle("cybercall-connected", app.callData.accepted);

  element.querySelectorAll("[data-cybercall-action]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const action = event.currentTarget.dataset.cybercallAction;
      if (action === "accept") {
        await acceptCallForEveryone(app.callData.id);
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
        await endCallForEveryone(app.callData.id);
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
  const targetUserIds = formData.getAll("targetUserIds").map((id) => String(id)).filter(Boolean);
  const usersById = new Map<string, any>((game.users?.contents ?? []).map((user) => [user.id, user]));
  const targetUserNames = targetUserIds.map((id) => usersById.get(id)?.name ?? id);

  return normalizeCallData({
    callerName,
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    image,
    message: String(formData.get("message") ?? "").trim(),
    signal: formData.get("signal"),
    variant: String(formData.get("variant") ?? DEFAULT_CALL.variant),
    fullscreen: formData.get("fullscreen") === "on",
    ringing: formData.get("ringing") === "on",
    targetUserIds,
    targetUserNames
  });
}

function updateComposerSignal(form) {
  const signal = form?.elements?.signal;
  const output = form?.querySelector?.("[data-cybercall-signal-output]");
  if (!signal || !output) return;
  output.textContent = `${clampSignal(signal.value)}%`;
}

function bindComposerControls(app: any, html: any = null) {
  const element = getElement(app, html);
  const form = getComposerForm(element);
  if (!element || !form) return;

  updateComposerSignal(form);

  const ringtoneSelect = element.querySelector("[data-cybercall-ringtone]");
  if (ringtoneSelect) {
    ringtoneSelect.addEventListener("change", async (event) => {
      await game.settings.set(MODULE_ID, "ringSound", event.currentTarget.value);
    });
  }

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
        const Picker = (globalThis as any).FilePicker ?? (globalThis as any).foundry?.applications?.apps?.FilePicker;
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
        return;
      }

      if (action === "open-messages") {
        await openMessages();
      }
    });
  });
}

function getContactsForm(element) {
  return element?.querySelector?.("form[data-cybercall-contacts-form]");
}

function bindContactsControls(app: any, html: any = null) {
  const element = getElement(app, html);
  const form = getContactsForm(element);
  if (!element || !form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const scope = String(formData.get("scope") ?? activeContactsTab);
    await addContact(formData.get("name"), formData.get("number"), scope, formData.get("image"), {
      actorId: formData.get("actorId"),
      managedByGM: formData.get("managedByGM") === "on",
      isNpc: formData.get("managedByGM") === "on" || Boolean(formData.get("actorId"))
    });
    form.reset();
    form.elements.scope.value = scope;
    form.elements.name?.focus();
  });

  form.elements.actorId?.addEventListener("change", () => {
    const actor = game.actors?.get(form.elements.actorId.value);
    if (!actor) return;
    if (!form.elements.name.value) form.elements.name.value = actor.name;
    if (form.elements.image && !form.elements.image.value) form.elements.image.value = actor.img ?? "";
    if (form.elements.managedByGM) form.elements.managedByGM.checked = true;
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
        return;
      }

      if (action === "message" && contact) {
        await openMessages(contact);
      }
    });
  });

  element.querySelector("[data-cybercall-open-messages]")?.addEventListener("click", async () => {
    await openMessages();
  });
}

function formatMessageTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
}

function getMessageContext(contact = null) {
  let allContacts = getAllMessageContacts();
  const selectedContact = contact ?? allContacts[0] ?? null;
  if (selectedContact && !allContacts.some((entry) => entry.id === selectedContact.id || entry.number === selectedContact.number)) {
    allContacts = [...allContacts, normalizeContact(selectedContact)].sort((left, right) => left.name.localeCompare(right.name));
  }
  const contextActiveThreadId = composingNewMessage ? "" : activeMessageThreadId;
  const threads = prepareThreads(getVisibleStoredMessages(), allContacts, contextActiveThreadId, getMessageReadState())
    .map((thread) => ({
      ...thread,
      messages: thread.messages.map((message) => ({
        ...message,
        createdAtLabel: formatMessageTimestamp(message.createdAt)
      }))
    }));
  const activeThread = composingNewMessage ? null : threads.find((thread) => thread.id === activeMessageThreadId) ?? null;
  if (activeThread?.contact && !allContacts.some((entry) => entry.id === activeThread.contact.id || entry.number === activeThread.contact.number)) {
    allContacts = [...allContacts, activeThread.contact].sort((left, right) => left.name.localeCompare(right.name));
  }
  const selectedContactId = activeThread?.contact?.id ?? selectedContact?.id ?? "";
  const unreadCount = getUnreadMessageCount();
  const activeThreadRecipientUserIds = getThreadRecipientUserIds(activeThread, { excludeGMs: false });
  const replyAsChoices = getReplyAsChoices(activeThread);
  const sendAsChoices = getSendAsChoices();
  const canSendAs = game.user?.isGM === true && !activeThread && sendAsChoices.length > 1;

  return {
    threads,
    hasThreads: threads.length > 0,
    unreadCount,
    hasUnreadMessages: unreadCount > 0,
    activeThread,
    activeThreadId: activeThread?.id ?? contextActiveThreadId,
    allContacts: allContacts.map((entry) => ({
      ...entry,
      selected: entry.id === selectedContactId
    })),
    hasContacts: allContacts.length > 0,
    selectedContactId,
    isThreadReply: Boolean(activeThread),
    isComposingNewMessage: !activeThread,
    canDeleteThread: Boolean(activeThread),
    threadReplyLabel: activeThread ? `${activeThread.title}${activeThread.subtitle ? ` (${activeThread.subtitle})` : ""}` : "",
    canReplyAs: replyAsChoices.length > 1,
    replyAsChoices,
    canSendAs,
    sendAsChoices,
    activeThreadRecipientUserIds,
    isFoundryV13Plus: Number(game.release?.generation ?? 0) >= 13
  };
}

function getSelectedMessageContact(form, context = getMessageContext()) {
  const contactId = String(new FormData(form).get("contactId") ?? "");
  return context.allContacts.find((contact) => contact.id === contactId) ?? null;
}

function getThreadRecipientUserIds(thread, options: any = {}) {
  if (!thread?.messages?.length) return [];
  const currentUserId = String(game.user?.id ?? "");
  const gmIds = new Set((game.users?.contents ?? []).filter((user) => user.isGM).map((user) => String(user.id)));
  const ids = new Set<string>();
  for (const message of thread.messages) {
    if (message.senderUserId && message.senderUserId !== currentUserId && !(options.excludeGMs && gmIds.has(message.senderUserId))) {
      ids.add(message.senderUserId);
    }
    for (const id of message.recipientUserIds ?? []) {
      if (id && id !== currentUserId && !(options.excludeGMs && gmIds.has(id))) ids.add(id);
    }
  }
  return [...ids];
}

function getGMUserIds() {
  return (game.users?.contents ?? [])
    .filter((user) => user.isGM)
    .map((user) => String(user.id))
    .filter(Boolean);
}

function getReplyAsChoices(thread) {
  const contactReplyDefault = Boolean(game.user?.isGM && thread?.contact && !thread.contact.userId && (thread.contact.isNpc || thread.contact.managedByGM));
  const choices = [{
    id: "self",
    label: game.user?.character?.name ?? game.user?.name ?? "Me",
    selected: !contactReplyDefault
  }];
  if (!game.user?.isGM || !thread?.contact || thread.contact.userId) return choices;
  choices.push({
    id: "contact",
    label: thread.contact.name,
    selected: contactReplyDefault
  });
  return choices;
}

function getSendAsChoices() {
  const choices = [{
    id: "self",
    label: game.user?.character?.name ?? game.user?.name ?? "Me",
    selected: true,
    contact: null
  }];
  if (!game.user?.isGM) return choices;

  const seen = new Set<string>();
  for (const contact of [...getGroupContacts(), ...getContacts()].map(normalizeContact)) {
    if (!contact.name || contact.userId) continue;
    if (!contact.managedByGM && !contact.actorId && !contact.isNpc) continue;
    const key = contact.actorId || contact.number || contact.id;
    if (seen.has(key)) continue;
    seen.add(key);
    choices.push({
      id: key,
      label: contact.name,
      selected: false,
      contact
    });
  }

  for (const actor of game.actors?.contents ?? []) {
    const key = `actor-${actor.id}`;
    if (seen.has(actor.id) || seen.has(key)) continue;
    seen.add(key);
    choices.push({
      id: key,
      label: actor.name,
      selected: false,
      contact: normalizeContact({
        id: key,
        name: actor.name,
        number: `NPC:${actor.id}`,
        image: actor.img ?? "",
        actorId: actor.id,
        managedByGM: true,
        isNpc: true
      })
    });
  }

  return choices;
}

function getIdentityFromContact(contact) {
  if (!contact) return {};
  return {
    senderName: contact.name,
    senderNumber: contact.number,
    senderActorId: contact.actorId,
    contactName: contact.name,
    contactImage: contact.image,
    contactManagedByGM: true,
    contactIsNpc: true
  };
}

function getMessageIdentity(form, context) {
  const formData = new FormData(form);
  if (context.activeThread) {
    const mode = String(formData.get("replyAs") ?? "self");
    if (mode === "contact" && game.user?.isGM && context.activeThread.contact) {
      return getIdentityFromContact(context.activeThread.contact);
    }
    return {};
  }

  const mode = String(formData.get("sendAs") ?? "self");
  if (mode === "self" || !game.user?.isGM) return {};
  const choice = getSendAsChoices().find((entry) => entry.id === mode);
  return getIdentityFromContact(choice?.contact);
}

function bindMessagesControls(app: any, html: any = null) {
  const element = getElement(app, html);
  if (!element) return;

  element.querySelectorAll("[data-cybercall-thread-id]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      composingNewMessage = false;
      activeMessageThreadId = event.currentTarget.dataset.cybercallThreadId;
      await markActiveThreadRead();
      await refreshMessages();
    });
  });

  element.querySelectorAll("[data-cybercall-message-action]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const action = event.currentTarget.dataset.cybercallMessageAction;
      if (action === "refresh") {
        await refreshMessages();
        return;
      }
      if (action === "open-calls") {
        await openCallPanel();
        return;
      }
      if (action === "new") {
        composingNewMessage = true;
        activeMessageThreadId = "";
        if (activeMessages) activeMessages.contact = null;
        await refreshMessages();
        return;
      }
      if (action === "delete-thread") {
        event.preventDefault();
        event.stopPropagation();
        const root = element.querySelector("[data-cybercall-active-thread]");
        const threadId = activeMessageThreadId || root?.dataset?.cybercallActiveThread || "";
        if (!threadId) return;
        if (app._cybercallPendingDeleteThreadId !== threadId) {
          app._cybercallPendingDeleteThreadId = threadId;
          event.currentTarget.classList.add("confirming");
          event.currentTarget.textContent = "Confirm Delete";
          event.currentTarget.title = "Click again to delete this thread";
          return;
        }
        app._cybercallPendingDeleteThreadId = "";
        await deleteMessageThread(threadId);
      }
    });
  });

  const form = element.querySelector("form[data-cybercall-message-form]");
  if (form) {
    form.inert = false;
    const textarea = form.elements.body;
    if (textarea) {
      textarea.disabled = false;
      textarea.readOnly = false;
      textarea.tabIndex = 0;
    }
  }
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const context = getMessageContext(app?.contact ?? (activePhone?.mode === "messages" ? activePhone.contact : null));
    const activeThread = context.activeThread;
    const contact = activeThread?.contact ?? getSelectedMessageContact(form, context);
    const body = form.elements.body?.value ?? "";
    const messageIdentity = getMessageIdentity(form, context);
    const preserveGMs = Boolean(activeThread?.contact && !activeThread.contact.userId && (activeThread.contact.managedByGM || activeThread.contact.isNpc));
    const recipientUserIds = activeThread
      ? getThreadRecipientUserIds(activeThread, { excludeGMs: game.user?.isGM === true && !preserveGMs })
      : null;
    if (!contact) {
      ui.notifications?.warn?.("Select a contact before sending a message.");
      return;
    }
    const document = await sendMessageToContact(contact, body, {
      ...messageIdentity,
      threadId: activeThread ? activeThread.id : undefined,
      recipientUserIds: recipientUserIds?.length ? recipientUserIds : undefined,
      recipientNumbers: messageIdentity.senderNumber ? [] : undefined
    });
    if (!document) return;
    activeMessageThreadId = activeThread ? activeThread.id : createThreadIdForContact(contact);
    if (app) app.contact = contact;
    if (activePhone?.mode === "messages") activePhone.contact = contact;
    composingNewMessage = false;
    form.elements.body.value = "";
    await markActiveThreadRead();
    await refreshMessages();
  });

  markActiveThreadRead();
}

const { CyberCallApplication, CyberCallComposer, CyberCallContacts, CyberCallMessages, CyberCallPhone } = createCyberCallAppClasses({
  moduleId: MODULE_ID,
  templatePath: TEMPLATE_PATH,
  composerTemplatePath: COMPOSER_TEMPLATE_PATH,
  contactsTemplatePath: CONTACTS_TEMPLATE_PATH,
  messagesTemplatePath: MESSAGES_TEMPLATE_PATH,
  phoneTemplatePath: PHONE_TEMPLATE_PATH,
  escapeHTML,
  getDefaultComposerData,
  getActorChoices,
  getPlayerChoices,
  getContacts,
  getGroupContacts,
  getMessageContext,
  getRingtoneChoices,
  getSoundPath,
  getActiveContactsTab: () => activeContactsTab,
  canEditContactImages,
  bindCallControls,
  bindComposerControls,
  bindContactsControls,
  bindMessagesControls,
  stopRinging,
  clearActiveCall: (app) => {
    if (activeCall === app) activeCall = null;
  },
  clearActiveComposer: (app) => {
    if (activeComposer === app) activeComposer = null;
  },
  clearActiveContacts: (app) => {
    if (activeContacts === app) activeContacts = null;
  },
  clearActiveMessages: (app) => {
    if (activeMessages === app) activeMessages = null;
  },
  clearActivePhone: (app) => {
    if (activePhone === app) {
      activePhone = null;
      activeComposer = null;
      activeContacts = null;
      activeMessages = null;
    }
  }
});

async function openCall(callData: any = {}) {
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

async function acceptCallForEveryone(callId) {
  if (!callId) return;
  await recordCallHistoryEvent(activeCall?.callData, "connected");
  game.socket.emit(SOCKET_NAME, {
    action: "acceptCall",
    callId
  });
  await acceptCall(callId);
}

async function endCall(callId) {
  if (callId && activeCall?.callData?.id && activeCall.callData.id !== callId) return;
  await closeCall();
}

async function endCallForEveryone(callId) {
  await recordCallHistoryEvent(activeCall?.callData, activeCall?.callData?.accepted ? "ended" : "missed");
  game.socket.emit(SOCKET_NAME, {
    action: "endCall",
    callId
  });
  await endCall(callId);
}

function getUserContact(userId, fallbackName = "Player") {
  const user = game.users?.get?.(userId) ?? game.users?.contents?.find?.((entry) => entry.id === userId);
  return {
    id: `user-${userId}`,
    name: user?.name ?? fallbackName,
    number: `@${user?.name ?? fallbackName}`,
    image: user?.avatar ?? user?.character?.img ?? "",
    userId,
    userIds: userId ? [userId] : []
  };
}

function getCallHistoryContact(callData) {
  if (!callData) return null;
  if (callData.contactNumber) {
    const contact = getAllMessageContacts().find((entry) => entry.number === callData.contactNumber);
    return contact ?? {
      id: `contact-${callData.contactNumber}`,
      name: callData.contactName || callData.callerName,
      number: callData.contactNumber,
      image: callData.contactImage || callData.image,
      actorId: callData.contactActorId ?? "",
      managedByGM: true,
      isNpc: true
    };
  }
  if (game.user?.isGM && callData.callerUserId) {
    return getUserContact(callData.callerUserId, callData.callerName);
  }
  return null;
}

function getCallHistoryRecipientUserIds(callData, contact) {
  const ids = new Set<string>();
  for (const id of contact?.userIds ?? []) ids.add(String(id));
  if (contact?.userId) ids.add(String(contact.userId));
  if (callData?.callerUserId) ids.add(String(callData.callerUserId));
  if (!contact?.userId && (contact?.managedByGM || contact?.isNpc || callData?.contactNumber)) {
    for (const id of getGMUserIds()) ids.add(id);
  }
  ids.delete(String(game.user?.id ?? ""));
  return [...ids].filter(Boolean);
}

async function recordCallHistoryEvent(callData, eventType) {
  const contact = getCallHistoryContact(callData);
  if (!contact) return null;
  const threadOwnerUserId = callData?.callerUserId || game.user?.id;
  const labels = {
    outgoing: `Outgoing call to ${contact.name}.`,
    connected: `Call connected with ${contact.name}.`,
    ended: `Call ended with ${contact.name}.`,
    missed: `Call missed or declined with ${contact.name}.`
  };
  return createMessageEvent(contact, labels[eventType] ?? "Call event.", {
    threadId: createThreadIdForContact(contact, threadOwnerUserId),
    eventType,
    senderName: "CyberCall",
    senderNumber: contact.number,
    senderActorId: contact.actorId,
    recipientUserIds: getCallHistoryRecipientUserIds(callData, contact),
    recipientNumbers: contact.userId ? [] : [contact.number]
  });
}

async function requestCallToGM(contact) {
  if (game.user.isGM) {
    const call = {
      callerName: contact.name,
      subtitle: `Comms ${contact.number}`,
      image: contact.image,
      message: `Opening channel ${contact.number}...`,
      signal: game.settings.get(MODULE_ID, "defaultSignal"),
      variant: "standard",
      contactNumber: contact.number,
      ringing: false
    };
    await recordCallHistoryEvent(call, "outgoing");
    return openCall(call);
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
    contactNumber: contact.number,
    contactName: contact.name,
    contactImage: contact.image,
    contactActorId: contact.actorId,
    contactManagedByGM: contact.managedByGM === true,
    contactIsNpc: contact.isNpc === true
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

  await recordCallHistoryEvent(callerCall, "outgoing");
  return openCall(callerCall);
}

async function openComposer() {
  if (!game.user.isGM) {
    ui.notifications?.warn?.("Only the GM can open the CyberCall composer.");
    return null;
  }
  return openPhone("calls");
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
  return openPhone("calls");
}

async function refreshContacts() {
  if (!activeContacts) return;
  await activeContacts.render(true);
}

async function openMessages(contact = null) {
  if (!canUseCyberCall()) {
    ui.notifications?.warn?.("You do not have permission to use CyberCall messages.");
    return null;
  }

  if (contact) {
    activeMessageThreadId = createThreadIdForContact(contact);
    composingNewMessage = false;
  } else if (!activeMessageThreadId) {
    composingNewMessage = true;
  }

  const phone = await openPhone("messages", contact);
  await markActiveThreadRead();
  return phone;
}

async function openMessagesThread(threadId) {
  if (threadId) {
    activeMessageThreadId = String(threadId);
    composingNewMessage = false;
  }
  return openMessages();
}

async function openCallPanel() {
  return game.user?.isGM ? openComposer() : openContacts();
}

async function refreshMessages() {
  if (!activePhone || activePhone.mode !== "messages") return;
  await activePhone.render(true);
}

async function openPhone(mode = "calls", contact = null) {
  if (activePhone) {
    activePhone.mode = mode;
    activePhone.contact = contact;
    await activePhone.render(true);
    activePhone.bringToFront?.();
  } else {
    activePhone = new CyberCallPhone(mode, contact);
    await activePhone.render(true);
  }

  activeComposer = game.user?.isGM && mode === "calls" ? activePhone : null;
  activeContacts = !game.user?.isGM && mode === "calls" ? activePhone : null;
  activeMessages = mode === "messages" ? activePhone : null;
  return activePhone;
}

async function broadcastCall(callData: any = {}) {
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
    callData: call,
    targetUserIds: call.targetUserIds
  });

  return openCall({ ...call, outgoing: true });
}

async function handleSocketMessage(message) {
  if (!message) return;
  if (Array.isArray(message.targetUserIds) && message.targetUserIds.length && !message.targetUserIds.includes(game.user?.id)) {
    return;
  }
  if (Array.isArray(message.callData?.targetUserIds) && message.callData.targetUserIds.length && !message.callData.targetUserIds.includes(game.user?.id)) {
    return;
  }

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
    const contact = normalizeContact({
      ...message.contact,
      image: ""
    });
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

function applyFullscreenPosition(app: any) {
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
  const handle = ringingAudio;
  ringingAudio = null;
  if (typeof handle.stop === "function") {
    handle.stop();
  } else {
    handle.pause();
    handle.currentTime = 0;
  }
}

function playRinging(callData) {
  stopRinging();
  if (!callData.ringing) return;

  const soundPath = getSoundPath();
  if (!soundPath) return;

  const interfaceVolume = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5);
  const volume = 0.65 * interfaceVolume;
  const AudioHelperClass = foundry?.audio?.AudioHelper ?? (globalThis as any).AudioHelper;
  if (AudioHelperClass?.play) {
    AudioHelperClass.play({ src: soundPath, volume, autoplay: true, loop: true }, false)
      .then((handle) => { ringingAudio = handle; })
      .catch((error) => {
        console.warn(`${MODULE_ID} | Unable to play ringing sound.`, error);
      });
  } else {
    ringingAudio = new Audio(soundPath);
    ringingAudio.loop = true;
    ringingAudio.volume = volume;
    ringingAudio.play().catch((error) => {
      console.warn(`${MODULE_ID} | Unable to play ringing sound.`, error);
    });
  }
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
    openMessages,
    openMessagesThread,
    openCallPanel,
    getUnreadMessageCount,
    get activeCall() {
      return activeCall;
    },
    get activeComposer() {
      return activeComposer;
    },
    get activeContacts() {
      return activeContacts;
    },
    get activeMessages() {
      return activeMessages;
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
    hint: "Player contact directory stored locally for this client and isolated per world.",
    scope: "client",
    config: false,
    type: Object,
    default: {}
  });

  game.settings.register(MODULE_ID, "groupContacts", {
    name: "CyberCall Group Contacts",
    hint: "Shared group contact directory for all players in this world.",
    scope: "world",
    config: false,
    type: Object,
    default: []
  });

  game.settings.register(MODULE_ID, "messageReadState", {
    name: "CyberCall Message Read State",
    hint: "Tracks which message threads this client has read.",
    scope: "client",
    config: false,
    type: Object,
    default: {}
  });

  game.settings.register(MODULE_ID, "messageDeletedBefore", {
    name: "CyberCall Deleted Message Threads",
    hint: "Tracks locally deleted message threads for this client.",
    scope: "client",
    config: false,
    type: Object,
    default: {}
  });
}

async function migrateLegacyContactsSetting() {
  const contacts = game.settings.get(MODULE_ID, "contacts");
  if (!Array.isArray(contacts)) return;
  await game.settings.set(MODULE_ID, "contacts", {
    [getWorldContactsKey()]: contacts.map(normalizeContact)
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

Hooks.once("ready", async () => {
  await migrateLegacyContactsSetting();
  registerApi();
  registerWithHoloSuite();
  game.socket.on(SOCKET_NAME, handleSocketMessage);
  console.log(`${MODULE_ID} | Ready. Use game.modules.get("${MODULE_ID}").api.openCall({...})`);
});

Hooks.on("createChatMessage", async (message) => {
  const flag = message?.flags?.[MODULE_ID];
  if (flag?.kind !== MESSAGE_FLAG_KIND) return;
  await refreshMessages();
  await refreshContacts();
});

document.addEventListener("click", (event) => {
  const target = event.target as Element | null;
  const button = target?.closest?.("[data-cybercall-open-thread]") as HTMLElement | null;
  if (!button) return;
  event.preventDefault();
  openMessagesThread(button.dataset.cybercallThreadId);
});
