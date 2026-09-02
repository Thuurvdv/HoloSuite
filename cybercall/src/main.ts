import { createCyberCallAppClasses } from "./apps";
import {
  DEFAULT_CALL,
  clampSignal,
  createCallId,
  getInitials,
  getUserDisplayName,
  getUserTokenImage,
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
import { createGroupThreadId, createThreadIdForContact, getAvatarTone, prepareThreads } from "./message-model";
import { createMessageEvent, getStoredMessages, sendMessageToContact } from "./message-service";

let activeCall = null;
let activePhone = null;
let activeComposer = null;
let activeContacts = null;
let activeMessages = null;
let activeContactsTab = "personal";
let activeMessageThreadId = "";
let composingNewMessage = false;
let composingNewGroup = false;
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
      name: getUserDisplayName(user, "Unknown Player"),
      active: user.active === true
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getGroupMessageMemberChoices() {
  return (game.users?.contents ?? [])
    .filter((user) => !user.isGM && user.id !== game.user?.id)
    .map((user) => ({
      id: String(user.id),
      name: getUserDisplayName(user, "Unknown Player"),
      active: user.active === true
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function getUserMessageContacts() {
  return (game.users?.contents ?? [])
    .filter((user) => user.id !== game.user?.id)
    .map((user) => {
      const name = getUserDisplayName(user, "Unknown Player");
      return {
        id: `user-${user.id}`,
        name,
        number: `@${name}`,
        image: getUserTokenImage(user),
        userId: user.id,
        userIds: [user.id],
        isNpc: false,
        managedByGM: false
      };
    })
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

function getNpcThreadBindings() {
  const bindings = game.settings.get(MODULE_ID, "npcThreadBindings");
  if (!bindings || typeof bindings !== "object" || Array.isArray(bindings)) return {};
  return bindings;
}

async function updateNpcThreadBinding(threadId, update) {
  if (!game.user?.isGM || !threadId) return;
  const bindings = { ...getNpcThreadBindings() };
  if (update === null) delete bindings[threadId];
  else bindings[threadId] = { ...(bindings[threadId] ?? {}), ...update };
  await game.settings.set(MODULE_ID, "npcThreadBindings", bindings);
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
    composingNewGroup = false;
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

const MESSAGE_LOG_BOTTOM_THRESHOLD = 24;

function captureMessageScrollState(app: any) {
  const element = getElement(app);
  const messageLog = element?.querySelector?.(".cybercall-message-log");
  if (!(messageLog instanceof HTMLElement)) return null;
  const root = element.querySelector?.("[data-cybercall-active-thread]");
  const distanceFromBottom = messageLog.scrollHeight - messageLog.clientHeight - messageLog.scrollTop;
  return {
    threadId: String(root?.dataset?.cybercallActiveThread ?? ""),
    scrollTop: messageLog.scrollTop,
    stickToBottom: distanceFromBottom <= MESSAGE_LOG_BOTTOM_THRESHOLD
  };
}

function restoreMessageScrollState(app: any, element: HTMLElement) {
  const messageLog = element.querySelector(".cybercall-message-log");
  if (!(messageLog instanceof HTMLElement)) return;
  const state = app?._cybercallMessageScrollState;
  const root = element.querySelector("[data-cybercall-active-thread]") as HTMLElement | null;
  const threadId = String(root?.dataset?.cybercallActiveThread ?? "");
  const scrollToBottom = !state
    || state.scrollToBottom === true
    || state.stickToBottom === true
    || state.threadId !== threadId;

  delete app._cybercallMessageScrollState;

  const restoreToken = {};
  app._cybercallMessageScrollRestoreToken = restoreToken;
  const applyScrollPosition = () => {
    if (app._cybercallMessageScrollRestoreToken !== restoreToken || !messageLog.isConnected) return;
    const maximumScrollTop = Math.max(0, messageLog.scrollHeight - messageLog.clientHeight);
    messageLog.scrollTop = scrollToBottom
      ? maximumScrollTop
      : Math.min(state.scrollTop, maximumScrollTop);
  };

  // ApplicationV2 calls _onRender before the replacement content has completed
  // layout. Reapply after two frames so scrollHeight reflects the rendered log.
  applyScrollPosition();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      applyScrollPosition();
      if (app._cybercallMessageScrollRestoreToken === restoreToken) {
        delete app._cybercallMessageScrollRestoreToken;
      }
    });
  });
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
  const targetUserNames = targetUserIds.map((id) => getUserDisplayName(usersById.get(id)) || id);

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

function decorateThreadNpcBinding(thread) {
  const binding = getNpcThreadBindings()[thread.id] ?? null;
  const isGm = game.user?.isGM === true;
  const isNpcRoute = Boolean(
    !thread.isGroup
    && thread.contact
    && !thread.contact.userId
    && (thread.contact.isNpc || thread.contact.managedByGM || thread.isNpcRouted)
  );
  const actor = binding?.actorId ? game.actors?.get?.(binding.actorId) : null;
  const actorName = String(actor?.name ?? binding?.actorName ?? "").trim();
  const bindingImage = String(binding?.image ?? actor?.prototypeToken?.texture?.src ?? actor?.img ?? "").trim();
  const portraitRevealed = binding?.revealPortrait === true;
  const controlsRoutedPortrait = thread.isNpcRouted === true;
  const contact = binding || controlsRoutedPortrait ? {
    ...thread.contact,
    actorId: binding && isGm ? String(binding.actorId ?? thread.contact.actorId ?? "") : thread.contact.actorId,
    image: binding && portraitRevealed ? bindingImage : ""
  } : thread.contact;

  return {
    ...thread,
    contact,
    image: !isGm && controlsRoutedPortrait
      ? binding && portraitRevealed ? bindingImage : ""
      : thread.image,
    canLinkNpc: isGm && isNpcRoute,
    showNpcLinkPanel: isGm && (isNpcRoute || Boolean(binding)),
    hasNpcBinding: Boolean(binding),
    npcBindingName: actorName || thread.contact?.name || "Linked NPC",
    npcBindingImage: bindingImage,
    npcBindingInitials: getInitials(actorName || thread.contact?.name || "NPC"),
    npcPortraitRevealed: portraitRevealed,
    npcBindingStatusLabel: binding ? `Linked to ${actorName || "Actor"}` : "Unlinked NPC contact"
  };
}

function getMessageContext(contact = null) {
  let allContacts = getAllMessageContacts();
  const selectedContact = contact ?? allContacts[0] ?? null;
  if (selectedContact && !allContacts.some((entry) => entry.id === selectedContact.id || entry.number === selectedContact.number)) {
    allContacts = [...allContacts, normalizeContact(selectedContact)].sort((left, right) => left.name.localeCompare(right.name));
  }
  const contextActiveThreadId = composingNewMessage || composingNewGroup ? "" : activeMessageThreadId;
  const threads = prepareThreads(getVisibleStoredMessages(), allContacts, contextActiveThreadId, getMessageReadState())
    .map((thread) => ({
      ...decorateThreadNpcBinding(thread),
      messages: thread.messages.map((message) => ({
        ...message,
        createdAtLabel: formatMessageTimestamp(message.createdAt)
      }))
    }));
  const activeThread = composingNewMessage || composingNewGroup ? null : threads.find((thread) => thread.id === activeMessageThreadId) ?? null;
  if (activeThread?.contact && !allContacts.some((entry) => entry.id === activeThread.contact.id || entry.number === activeThread.contact.number)) {
    allContacts = [...allContacts, activeThread.contact].sort((left, right) => left.name.localeCompare(right.name));
  }
  const selectedContactId = activeThread?.contact?.id ?? selectedContact?.id ?? "";
  const unreadCount = getUnreadMessageCount();
  const activeThreadRecipientUserIds = getThreadRecipientUserIds(activeThread, { excludeGMs: false });
  const replyAsChoices = getReplyAsChoices(activeThread);
  const sendAsChoices = getSendAsChoices();
  const canSendAs = game.user?.isGM === true && !activeThread && sendAsChoices.length > 1;
  const groupMemberChoices = getGroupMessageMemberChoices();

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
    isComposingNewMessage: !activeThread && !composingNewGroup,
    isComposingNewGroup: composingNewGroup,
    groupMemberChoices,
    hasGroupMemberChoices: groupMemberChoices.length > 0,
    canDeleteThread: Boolean(activeThread),
    threadReplyLabel: activeThread ? `${activeThread.title}${activeThread.subtitle ? ` (${activeThread.subtitle})` : ""}` : "",
    canReplyAs: replyAsChoices.length > 1,
    replyAsChoices,
    canSendAs,
    sendAsChoices,
    activeThreadRecipientUserIds,
    showMessageTimestamps: game.settings.get(MODULE_ID, "showMessageTimestamps") === true,
    gmViewPlayerMessagesEnabled: game.settings.get(MODULE_ID, "gmViewPlayerMessages") === true,
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
    label: getUserDisplayName(game.user, "Me"),
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
    label: getUserDisplayName(game.user, "Me"),
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
    senderImage: contact.image,
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

function getCyberCallDropData(event) {
  const TextEditorClass = (globalThis as any).TextEditor ?? (globalThis as any).foundry?.applications?.ux?.TextEditor;
  try {
    const data = TextEditorClass?.getDragEventData?.(event);
    if (data && Object.keys(data).length) return data;
  } catch (_error) {
    // Fall through to the raw transfer payload used by older Foundry versions.
  }
  try {
    return JSON.parse(event.dataTransfer?.getData("text/plain") || "{}");
  } catch (_error) {
    return {};
  }
}

function getDocumentImage(document) {
  const source = String(
    document?.getTextureSrc?.()
    || document?.texture?.src
    || document?.document?.texture?.src
    || document?.prototypeToken?.texture?.src
    || document?.img
    || ""
  ).trim();
  return source.includes("*") ? String(document?.img ?? "").trim() : source;
}

async function resolveDroppedNpcIdentity(event) {
  const data = getCyberCallDropData(event);
  const fromUuidFunction = (globalThis as any).fromUuid;
  let document = data.uuid && fromUuidFunction ? await fromUuidFunction(data.uuid) : null;
  if (!document && data.sceneId && data.tokenId) {
    document = game.scenes?.get?.(data.sceneId)?.tokens?.get?.(data.tokenId) ?? null;
  }
  const actorId = String(
    document?.actor?.id
    || document?.actorId
    || (document?.documentName === "Actor" ? document.id : "")
    || data.actorId
    || (data.type === "Actor" ? data.id : "")
    || ""
  ).trim();
  const actor = document?.documentName === "Actor"
    ? document
    : document?.actor ?? (actorId ? game.actors?.get?.(actorId) : null);
  if (!actor) return null;
  return {
    actorId: String(actor.id ?? actorId),
    actorUuid: String(actor.uuid ?? `Actor.${actor.id ?? actorId}`),
    actorName: String(actor.name ?? "Linked NPC"),
    image: getDocumentImage(document) || getDocumentImage(actor),
    revealPortrait: false,
    linkedAt: new Date().toISOString()
  };
}

async function linkNpcThreadFromDrop(event, threadId) {
  if (!game.user?.isGM || !threadId) return;
  event.preventDefault();
  event.stopPropagation();
  const binding = await resolveDroppedNpcIdentity(event);
  if (!binding) {
    ui.notifications?.warn?.("Drop an Actor or an Actor-backed Token to link this NPC contact.");
    return;
  }
  await updateNpcThreadBinding(threadId, binding);
  ui.notifications?.info?.(`Linked this NPC conversation to ${binding.actorName}.`);
  await refreshMessages();
}

async function createPlayerGroup(form, app) {
  const formData = new FormData(form);
  const groupName = String(formData.get("groupName") ?? "").trim();
  const selectedUserIds = [...new Set(formData.getAll("memberUserIds").map((id) => String(id)).filter(Boolean))];
  if (!groupName) {
    ui.notifications?.warn?.("Enter a name for the group chat.");
    return;
  }
  if (!selectedUserIds.length) {
    ui.notifications?.warn?.("Select at least one other player for the group chat.");
    return;
  }

  const senderUserId = String(game.user?.id ?? "");
  const groupMemberUserIds = [...new Set([senderUserId, ...selectedUserIds].filter(Boolean))];
  const groupMemberNames = groupMemberUserIds
    .map((id) => getUserDisplayName(game.users?.get?.(id)))
    .filter(Boolean);
  const groupId = createCallId();
  const threadId = createGroupThreadId(groupId);
  const creatorName = getUserDisplayName(game.user, "A player");
  const groupContact = {
    id: `group-${groupId}`,
    name: groupName,
    number: `${groupMemberUserIds.length} members`,
    userIds: selectedUserIds,
    isGroup: true
  };
  const document = await sendMessageToContact(groupContact, `${creatorName} created the group.`, {
    threadId,
    recipientUserIds: selectedUserIds,
    recipientNumbers: [],
    messageType: "event",
    eventType: "group-created",
    conversationType: "group",
    groupId,
    groupName,
    groupMemberUserIds,
    groupMemberNames
  });
  if (!document) return;

  activeMessageThreadId = threadId;
  composingNewMessage = false;
  composingNewGroup = false;
  if (app) app.contact = groupContact;
  if (activePhone?.mode === "messages") activePhone.contact = groupContact;
  await markActiveThreadRead();
  await refreshMessages();
}

function bindMessagesControls(app: any, html: any = null) {
  const element = getElement(app, html);
  if (!element) return;

  restoreMessageScrollState(app, element);

  element.querySelectorAll("[data-cybercall-npc-link-drop]").forEach((dropTarget) => {
    dropTarget.addEventListener("dragover", (event) => {
      if (!game.user?.isGM) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "link";
      dropTarget.classList.add("drag-over");
    });
    dropTarget.addEventListener("dragleave", () => dropTarget.classList.remove("drag-over"));
    dropTarget.addEventListener("drop", async (event) => {
      dropTarget.classList.remove("drag-over");
      const threadId = dropTarget.dataset.cybercallNpcThreadId
        || dropTarget.dataset.cybercallThreadId
        || activeMessageThreadId;
      await linkNpcThreadFromDrop(event, threadId);
    });
  });

  element.querySelectorAll("[data-cybercall-npc-action]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const action = event.currentTarget.dataset.cybercallNpcAction;
      const threadId = event.currentTarget.dataset.cybercallNpcThreadId || activeMessageThreadId;
      const binding = getNpcThreadBindings()[threadId];
      if (action === "toggle-reveal" && binding) {
        await updateNpcThreadBinding(threadId, { revealPortrait: binding.revealPortrait !== true });
        await refreshMessages();
        return;
      }
      if (action === "unlink" && binding) {
        await updateNpcThreadBinding(threadId, null);
        ui.notifications?.info?.("NPC identity link removed.");
        await refreshMessages();
        return;
      }
      if (action === "change") {
        event.currentTarget.closest("[data-cybercall-npc-link-drop]")?.classList.add("awaiting-drop");
        ui.notifications?.info?.("Drag a different Actor or Token onto the NPC identity panel.");
      }
    });
  });

  element.querySelectorAll("[data-cybercall-thread-id]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      composingNewMessage = false;
      composingNewGroup = false;
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
        composingNewGroup = false;
        activeMessageThreadId = "";
        if (activeMessages) activeMessages.contact = null;
        await refreshMessages();
        return;
      }
      if (action === "new-group") {
        composingNewMessage = false;
        composingNewGroup = true;
        activeMessageThreadId = "";
        if (activeMessages) activeMessages.contact = null;
        if (activePhone?.mode === "messages") activePhone.contact = null;
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

  const groupForm = element.querySelector("form[data-cybercall-group-form]");
  groupForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await createPlayerGroup(groupForm, app);
  });

  const form = element.querySelector("form[data-cybercall-message-form]");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const context = getMessageContext();
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
      recipientNumbers: messageIdentity.senderNumber ? [] : undefined,
      conversationType: activeThread?.isGroup ? "group" : "direct",
      groupId: activeThread?.groupId ?? "",
      groupName: activeThread?.groupName ?? "",
      groupMemberUserIds: activeThread?.groupMemberUserIds ?? [],
      groupMemberNames: activeThread?.groupMemberNames ?? []
    });
    if (!document) return;
    activeMessageThreadId = activeThread ? activeThread.id : createThreadIdForContact(contact);
    if (app) app.contact = contact;
    if (activePhone?.mode === "messages") activePhone.contact = contact;
    composingNewMessage = false;
    composingNewGroup = false;
    form.elements.body.value = "";
    await markActiveThreadRead();
    await refreshMessages({ scrollToBottom: true });
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
  const name = getUserDisplayName(user, fallbackName);
  return {
    id: `user-${userId}`,
    name,
    number: `@${name}`,
    image: getUserTokenImage(user),
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
  const callerImage = getUserTokenImage(game.user);
  const callerDisplayName = getUserDisplayName(game.user, "Unknown Caller");
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
    callerName: callerDisplayName,
    subtitle: `Call request from ${callerDisplayName}`,
    image: callerImage,
    message: `${callerDisplayName} is calling ${contact.name} on ${contact.number}.`,
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
    composingNewGroup = false;
  } else if (!activeMessageThreadId) {
    if (!composingNewGroup) composingNewMessage = true;
  }

  const phone = await openPhone("messages", contact);
  await markActiveThreadRead();
  return phone;
}

async function openMessagesThread(threadId) {
  if (threadId) {
    activeMessageThreadId = String(threadId);
    composingNewMessage = false;
    composingNewGroup = false;
  }
  return openMessages();
}

async function openCallPanel() {
  return game.user?.isGM ? openComposer() : openContacts();
}

async function refreshMessages(options: any = {}) {
  if (!activePhone || activePhone.mode !== "messages") return;
  activePhone._cybercallMessageScrollState = {
    ...captureMessageScrollState(activePhone),
    scrollToBottom: options.scrollToBottom === true
  };
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

function playIncomingMessageSound() {
  const AudioContextClass = (globalThis as any).AudioContext ?? (globalThis as any).webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const interfaceVolume = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5);
  const peakVolume = Math.max(0.0001, Math.min(0.18, 0.18 * interfaceVolume));
  const playTone = (frequency, startOffset, duration) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startsAt = context.currentTime + startOffset;
    const endsAt = startsAt + duration;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, startsAt);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.18, endsAt);
    gain.gain.setValueAtTime(0.0001, startsAt);
    gain.gain.exponentialRampToValueAtTime(peakVolume, startsAt + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, endsAt);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startsAt);
    oscillator.stop(endsAt);
  };

  const start = async () => {
    if (context.state === "suspended") await context.resume();
    playTone(620, 0, 0.16);
    playTone(930, 0.11, 0.2);
    window.setTimeout(() => context.close?.(), 500);
  };
  start().catch(() => context.close?.());
}

function getIncomingMessagePortrait(flag) {
  if (flag.senderImage) return String(flag.senderImage);
  if (flag.contactIsNpc && flag.senderNumber) return "";
  const sender = game.users?.get?.(flag.senderUserId)
    ?? game.users?.contents?.find?.((user) => user.id === flag.senderUserId);
  if (sender?.isGM === true) return "";
  return getUserTokenImage(sender);
}

function dismissIncomingMessageNotification(notification) {
  if (!notification?.isConnected) return;
  notification.classList.add("leaving");
  window.setTimeout(() => notification.remove(), 220);
}

function showIncomingMessageNotification(flag) {
  let container = document.querySelector("[data-cybercall-message-notifications]") as HTMLElement | null;
  if (!container) {
    container = document.createElement("div");
    container.className = "cybercall-message-notifications";
    container.dataset.cybercallMessageNotifications = "";
    container.setAttribute("aria-live", "polite");
    document.body.append(container);
  }

  const senderName = String(flag.senderName || "New message").trim();
  const groupName = String(flag.groupName || "").trim();
  const notification = document.createElement("button");
  notification.type = "button";
  notification.className = "cybercall-incoming-message";
  notification.title = "Open CyberCall conversation";

  const avatar = document.createElement("span");
  avatar.className = `cybercall-incoming-avatar ${getAvatarTone(flag.senderUserId || senderName)}`;
  const portrait = getIncomingMessagePortrait(flag);
  if (portrait) {
    const image = document.createElement("img");
    image.src = portrait;
    image.alt = "";
    avatar.append(image);
  } else {
    avatar.textContent = getInitials(senderName);
  }
  const badge = document.createElement("i");
  badge.className = "fa-solid fa-message cybercall-incoming-badge";
  badge.setAttribute("aria-hidden", "true");
  avatar.append(badge);

  const copy = document.createElement("span");
  copy.className = "cybercall-incoming-copy";
  const title = document.createElement("strong");
  title.textContent = groupName ? `${senderName} · ${groupName}` : senderName;
  const preview = document.createElement("small");
  preview.textContent = String(flag.body || "New CyberCall message").trim();
  copy.append(title, preview);
  notification.append(avatar, copy);

  notification.addEventListener("click", () => {
    dismissIncomingMessageNotification(notification);
    openMessagesThread(String(flag.threadId || ""));
  });
  container.append(notification);
  playIncomingMessageSound();
  window.setTimeout(() => dismissIncomingMessageNotification(notification), 4200);
}

function getCyberCallMessageFlag(message) {
  const flag = message?.flags?.[MODULE_ID] ?? message?.getFlag?.(MODULE_ID, "message");
  if (flag?.kind === MESSAGE_FLAG_KIND) return flag;
  if (flag?.message?.kind === MESSAGE_FLAG_KIND) return flag.message;
  return null;
}

function setChatCardElementVisibility(element, visible) {
  if (!element) return;
  const messageElement = element.matches?.(".chat-message")
    ? element
    : element.closest?.(".chat-message") ?? element.querySelector?.(".chat-message") ?? element;
  messageElement.classList?.toggle?.("cybercall-chat-message-hidden", !visible);
  if (visible) messageElement.removeAttribute?.("aria-hidden");
  else messageElement.setAttribute?.("aria-hidden", "true");
}

function applyCyberCallChatCardVisibility(message, html) {
  if (!getCyberCallMessageFlag(message)) return;
  const element = html instanceof HTMLElement ? html : html?.[0] ?? html?.element ?? null;
  setChatCardElementVisibility(element, game.settings.get(MODULE_ID, "showChatCards") === true);
}

function refreshRenderedCyberCallChatCards() {
  const visible = game.settings.get(MODULE_ID, "showChatCards") === true;
  document.querySelectorAll(".cybercall-chat-card").forEach((card) => {
    setChatCardElementVisibility(card, visible);
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
  api.registerWhatsNew?.({
    moduleId: MODULE_ID,
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

  game.settings.register(MODULE_ID, "npcThreadBindings", {
    name: "CyberCall NPC Conversation Links",
    hint: "Stores GM-managed links between pseudo-NPC conversations and Foundry Actors.",
    scope: "world",
    config: false,
    type: Object,
    default: {},
    onChange: () => {
      refreshMessages();
      refreshContacts();
    }
  });

  game.settings.register(MODULE_ID, "messageNotifications", {
    name: "Incoming Message Alerts",
    hint: "Show a brief sender notification and play a short tone when a new CyberCall message arrives.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "showChatCards", {
    name: "Show CyberCall Chat Cards",
    hint: "Show CyberCall message cards in Foundry's standard chat log. Disabled by default because CyberCall has its own inbox and notifications.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    onChange: () => refreshRenderedCyberCallChatCards()
  });

  game.settings.register(MODULE_ID, "showMessageTimestamps", {
    name: "Show Message Timestamps",
    hint: "Display the sent date and time beneath messages in CyberCall conversations.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, "gmViewPlayerMessages", {
    name: "GM: View Player Conversations",
    hint: "Allow GMs to see private CyberCall conversations where no GM or GM-managed NPC is a participant. Disabled by default.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: () => {
      refreshMessages();
      refreshContacts();
    }
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
  refreshRenderedCyberCallChatCards();
  console.log(`${MODULE_ID} | Ready. Use game.modules.get("${MODULE_ID}").api.openCall({...})`);
});

Hooks.on("renderChatMessage", (message, html) => {
  applyCyberCallChatCardVisibility(message, html);
});

Hooks.on("renderChatMessageHTML", (message, html) => {
  applyCyberCallChatCardVisibility(message, html);
});

Hooks.on("createChatMessage", async (message) => {
  const flag = message?.flags?.[MODULE_ID];
  if (flag?.kind !== MESSAGE_FLAG_KIND) return;
  const currentUserId = String(game.user?.id ?? "");
  const recipientUserIds = Array.isArray(flag.recipientUserIds)
    ? flag.recipientUserIds.map((id) => String(id))
    : [];
  const routesToNpcManager = game.user?.isGM === true
    && !String(flag.contactUserId ?? "")
    && (flag.contactManagedByGM === true || flag.contactIsNpc === true);
  const isIncoming = String(flag.senderUserId ?? "") !== currentUserId
    && (recipientUserIds.includes(currentUserId) || routesToNpcManager);
  const isMessageAlert = String(flag.messageType ?? "text") === "text" || flag.eventType === "group-created";
  if (isIncoming && isMessageAlert && game.settings.get(MODULE_ID, "messageNotifications") !== false) {
    showIncomingMessageNotification(flag);
  }
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
