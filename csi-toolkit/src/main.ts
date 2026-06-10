import {
  BOARD_ADD_COLLECTIONS,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CARD_WIDTH,
  CASE_STATUSES,
  COLLECTIONS,
  CONNECTION_COLORS,
  CONNECTION_STYLES,
  CONNECTION_TYPES,
  EVIDENCE_STATUSES,
  EVIDENCE_TYPES,
  SUSPECT_STATUSES,
  THEMES,
  VISIBILITIES,
  defaultItem,
  normalizeBoardLayout,
  normalizeCase,
  normalizeConnection,
  normalizeEvidence,
  normalizeLocation,
  normalizeSuspect,
  normalizeTimelineItem,
  randomId
} from "./case-model";
import { createCSICaseBoardClass } from "./board-app";
import { createCSIBoardItemEditorClass } from "./item-editor-app";
import { MODULE_ID, MODULE_TITLE, SOCKET_NAME, TEMPLATE_PATHS } from "./constants";
import { registerSettings } from "./settings";
import { registerHandlebarsHelpers } from "./handlebars";
import { escapeHtml, labelize, slugify } from "./text-utils";

declare const foundry: any;
declare const game: any;
declare const Hooks: any;
declare const Handlebars: any;
declare const loadTemplates: any;
declare const ui: any;

(() => {
  "use strict";

  const LegacyApplication = (globalThis as any).Application ?? foundry.appv1?.api?.Application;

  const state: any = {
    manager: null,
    browser: null,
    boards: new Map(),
    playerBoard: null
  };

  Hooks.once("init", async () => {
    registerSettings();
    registerHandlebarsHelpers();
    await loadTemplates(TEMPLATE_PATHS);
    console.log(`${MODULE_TITLE} | Initialized`);
  });

  Hooks.once("ready", () => {
    game.csiToolkit = buildPublicApi();
    const module = game.modules.get(MODULE_ID);
    if (module) module.api = game.csiToolkit;
    registerWithHoloSuite();
    game.socket.on(SOCKET_NAME, handleSocketMessage);
    console.log(`${MODULE_TITLE} | API available at game.csiToolkit`);
  });

  function buildPublicApi() {
    return {
      openCaseBoard: (caseId, options = {}) => openCaseBoard(caseId, options),
      openCaseManager: () => openCaseManager(),
      openCaseBrowser: () => openCaseBrowser(),
      createCase: caseData => createCase(caseData),
      getCases: () => getCases(),
      exportCase: caseId => exportCase(caseId),
      importCase: caseData => importCase(caseData)
    };
  }

  function registerWithHoloSuite() {
    const holosuite = game.modules.get("holosuite-core");
    const api = holosuite?.active ? holosuite.api : null;
    if (!api?.registerApp) return false;

    api.registerApp({
      id: MODULE_ID,
      title: "CSI Toolkit",
      icon: "fa-solid fa-fingerprint",
      premium: false,
      featureId: MODULE_ID,
      description: "Open case files, evidence boards, and investigation tools.",
      open: () => game.user?.isGM ? openCaseManager() : openCaseBrowser()
    });
    return true;
  }

  function getCases() {
    return duplicateData(game.settings.get(MODULE_ID, "cases") ?? {});
  }

  async function setCases(cases) {
    return game.settings.set(MODULE_ID, "cases", cases ?? {});
  }

  function hasActiveGM() {
    const users = game.users?.contents ?? Array.from(game.users ?? []);
    return users.some(user => user?.isGM && user?.active);
  }

  function getCase(caseId) {
    const cases = getCases();
    return cases[caseId] ? normalizeCase(cases[caseId]) : null;
  }

  async function saveCase(caseData: any, { notify = true, render = true, updateReason = null, userName = null } = {}) {
    const csiCase = normalizeCase(caseData);
    if (!game.user?.isGM) return requestCaseSave(csiCase, { notify, render });

    const cases = getCases();
    cases[csiCase.id] = csiCase;
    await setCases(cases);
    if (notify) broadcastCaseUpdated(csiCase.id, { reason: updateReason, userName });
    if (render) renderOpenSurfaces(csiCase.id);
    return csiCase;
  }

  async function requestCaseSave(csiCase: any, { render = true, notify = true } = {}) {
    if (!game.socket?.emit) {
      ui.notifications?.warn(`${MODULE_TITLE}: A GM must be connected to save board changes.`);
      return csiCase;
    }

    if (!hasActiveGM()) {
      ui.notifications?.warn(`${MODULE_TITLE}: No active GM is connected to save board changes.`);
      return csiCase;
    }

    game.socket.emit(SOCKET_NAME, {
      type: "save-case-request",
      caseData: csiCase,
      userId: game.user?.id,
      userName: game.user?.name
    });
    if (notify) ui.notifications?.info(`${MODULE_TITLE}: Board update sent to the GM.`);
    return csiCase;
  }

  async function createCase(caseData: any = {}) {
    const csiCase = normalizeCase(caseData, { forceNewId: !caseData.id });
    const cases = getCases();
    cases[csiCase.id] = csiCase;
    await setCases(cases);
    broadcastCaseUpdated(csiCase.id);
    ui.notifications?.info(`${MODULE_TITLE}: Created case "${csiCase.title}".`);
    return csiCase;
  }

  async function deleteCase(caseId) {
    const cases = getCases();
    const csiCase = cases[caseId];
    if (!csiCase) return false;
    delete cases[caseId];
    await setCases(cases);
    closeBoard(caseId);
    broadcastCaseUpdated(caseId);
    ui.notifications?.info(`${MODULE_TITLE}: Deleted case "${csiCase.title}".`);
    return true;
  }

  async function deleteBoardItem(caseId, collection, itemId, { confirm = true } = {}) {
    if (!COLLECTIONS.includes(collection) || !itemId) return false;
    const csiCase = getCase(caseId);
    if (!csiCase) return false;

    const item = csiCase[collection]?.find(candidate => candidate.id === itemId);
    if (!item) return false;
    const itemTitle = getItemTitle(item, collection);

    if (confirm) {
      const confirmed = await confirmDialog({
        title: `Delete ${labelize(singularLabel(collection))}`,
        content: `<p>Delete <strong>${escapeHtml(itemTitle)}</strong>?${collection === "connections" ? "" : " Any attached connections will also be deleted."}</p>`,
        yes: () => true,
        no: () => false,
        defaultYes: false
      });
      if (!confirmed) return false;
    }

    csiCase[collection] = csiCase[collection].filter(candidate => candidate.id !== itemId);

    if (collection !== "connections") {
      csiCase.connections = csiCase.connections.filter(connection => connection.fromId !== itemId && connection.toId !== itemId);
      csiCase.timeline = csiCase.timeline.map(item => ({
        ...item,
        linkedItemIds: (item.linkedItemIds ?? []).filter(linkedId => linkedId !== itemId)
      }));
      delete csiCase.boardLayout.cards[itemId];
    }

    await saveCase(csiCase);
    ui.notifications?.info(`${MODULE_TITLE}: Deleted "${itemTitle}".`);
    return true;
  }

  async function duplicateCase(caseId) {
    const source = getCase(caseId);
    if (!source) return null;
    const copy = normalizeCase({
      ...source,
      id: randomId(),
      title: `${source.title} Copy`
    });
    const cases = getCases();
    cases[copy.id] = copy;
    await setCases(cases);
    broadcastCaseUpdated(copy.id);
    ui.notifications?.info(`${MODULE_TITLE}: Duplicated case "${source.title}".`);
    return copy;
  }

  async function importCase(caseData) {
    const imported = normalizeCase({
      ...caseData,
      id: caseData.id || randomId()
    });
    const cases = getCases();
    if (cases[imported.id]) imported.id = randomId();
    cases[imported.id] = imported;
    await setCases(cases);
    broadcastCaseUpdated(imported.id);
    ui.notifications?.info(`${MODULE_TITLE}: Imported case "${imported.title}".`);
    return imported;
  }

  function exportCase(caseId) {
    const csiCase = getCase(caseId);
    if (!csiCase) return false;

    const blob = new Blob([JSON.stringify(csiCase, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slugify(csiCase.title)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    return true;
  }

  function openCaseManager() {
    if (!game.user?.isGM) {
      return openCaseBrowser();
    }

    if (!state.manager) state.manager = new CSICaseManager();
    state.manager.render(true);
    return state.manager;
  }

  function openCaseBrowser() {
    if (!state.browser) state.browser = new CSICaseBrowser();
    state.browser.render(true);
    return state.browser;
  }

  function openCaseBoard(caseId, options: any = {}) {
    if (!caseId) {
      ui.notifications?.warn(`${MODULE_TITLE}: No case id provided.`);
      return null;
    }

    const csiCase = getCase(caseId);
    if (!csiCase) {
      ui.notifications?.warn(`${MODULE_TITLE}: Case "${caseId}" was not found.`);
      return null;
    }

    const playerMode = options.playerMode ?? !game.user?.isGM;
    const key = `${caseId}:${playerMode ? "player" : "gm"}`;
    const existing = state.boards.get(key);
    if (existing) {
      existing.render(true);
      return existing;
    }

    const board = new CSICaseBoard(caseId, { playerMode });
    state.boards.set(key, board);
    board.render(true);
    return board;
  }

  async function requestLayoutPublish(caseId, layout) {
    const normalized = normalizeBoardLayout(layout);
    if (!game.socket?.emit) {
      ui.notifications?.warn(`${MODULE_TITLE}: A GM must be connected to publish the board layout.`);
      return false;
    }

    if (!hasActiveGM()) {
      ui.notifications?.warn(`${MODULE_TITLE}: No active GM is connected to publish the board layout.`);
      return false;
    }

    game.socket.emit(SOCKET_NAME, {
      type: "publish-layout-request",
      caseId,
      boardLayout: normalized,
      userId: game.user?.id,
      userName: game.user?.name
    });
    ui.notifications?.info(`${MODULE_TITLE}: Layout publish request sent to the GM.`);
    return true;
  }

  async function publishSharedLayout(caseId, layout, { userId = game.user?.id, userName = game.user?.name } = {}) {
    const csiCase = getCase(caseId);
    if (!csiCase) return false;

    const currentLayout = normalizeBoardLayout(csiCase.boardLayout);
    const publishedLayout = normalizeBoardLayout(layout);
    csiCase.boardLayout = normalizeBoardLayout({
      ...currentLayout,
      cards: publishedLayout.cards
    });

    await saveCase(csiCase, {
      render: false,
      updateReason: "layout-published",
      userName
    });
    renderOpenSurfaces(caseId, { resetLayout: true });
    ui.notifications?.info(`${MODULE_TITLE}: Published shared board layout${userName ? ` from ${userName}` : ""}.`);
    return true;
  }

  function broadcastCaseUpdated(caseId, { reason = null, userName = null } = {}) {
    game.socket?.emit(SOCKET_NAME, { type: "case-updated", caseId, reason, userName, userId: game.user?.id });
  }

  function handleSocketMessage(message) {
    if (!message) return;

    if (message.type === "save-case-request") {
      if (!game.user?.isGM || !message.caseData) return;
      saveCase(message.caseData, { render: false })
        .then(csiCase => {
          if (csiCase) {
            renderOpenSurfaces(csiCase.id);
            ui.notifications?.info(`${MODULE_TITLE}: Saved player board update from ${message.userName ?? "a player"}.`);
          }
        })
        .catch(error => {
          console.error(`${MODULE_TITLE} | Could not save player board update`, error);
          ui.notifications?.error(`${MODULE_TITLE}: Player board update could not be saved.`);
        });
      return;
    }

    if (message.type === "publish-layout-request") {
      if (!game.user?.isGM || !message.caseId || !message.boardLayout) return;
      publishSharedLayout(message.caseId, message.boardLayout, {
        userId: message.userId,
        userName: message.userName
      }).catch(error => {
        console.error(`${MODULE_TITLE} | Could not publish player layout`, error);
        ui.notifications?.error(`${MODULE_TITLE}: Player layout could not be published.`);
      });
      return;
    }

    if (message.type === "case-updated" && message.caseId) {
      if (message.userId && message.userId === game.user?.id) return;
      renderOpenSurfaces(message.caseId, { resetLayout: message.reason === "layout-published" });
      if (message.reason === "layout-published") {
        ui.notifications?.info(`${MODULE_TITLE}: ${message.userName ?? "Someone"} published a shared board layout.`);
      }
      return;
    }

  }

  const CSIBoardItemEditor = createCSIBoardItemEditorClass({
    LegacyApplication,
    moduleId: MODULE_ID,
    moduleTitle: MODULE_TITLE,
    singularLabel,
    getItemTitle,
    getCase,
    buildItemChoices,
    parseItemElement,
    saveCase,
    deleteBoardItem,
    defaultBoardPosition
  });

  const CSICaseBoard = createCSICaseBoardClass({
    LegacyApplication,
    moduleId: MODULE_ID,
    moduleTitle: MODULE_TITLE,
    CSIBoardItemEditor,
    getCase,
    prepareBoardData,
    openCaseManager,
    canUserEditBoard,
    publishSharedLayout,
    requestLayoutPublish,
    deleteBoardItem,
    saveCase,
    defaultBoardPosition,
    getRectEdgeAnchor,
    isFinitePoint,
    clearBoardApp: (board: any) => {
      state.boards.delete(`${board.caseId}:${board.playerMode ? "player" : "gm"}`);
      if (state.playerBoard === board) state.playerBoard = null;
    }
  });

  class CSICaseBrowser extends LegacyApplication {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "csi-case-browser",
        title: "CSI Toolkit Case Files",
        template: `modules/${MODULE_ID}/templates/case-browser.hbs`,
        classes: ["csi-toolkit", "csi-case-browser"],
        width: 520,
        height: 620,
        resizable: true
      });
    }

    async getData() {
      const cases = Object.values(getCases())
        .map(csiCase => normalizeCase(csiCase))
        .sort((left, right) => left.title.localeCompare(right.title));

      return {
        cases,
        isGM: game.user?.isGM,
        canContribute: canUserContribute()
      };
    }

    activateListeners(html) {
      super.activateListeners(html);
      html.find("[data-action='open-board']").on("click", event => {
        openCaseBoard(event.currentTarget.dataset.caseId, { playerMode: !game.user?.isGM });
      });
      html.find("[data-action='open-manager']").on("click", () => openCaseManager());
    }

    async close(options = {}) {
      state.browser = null;
      return super.close(options);
    }
  }

  class CSICaseManager extends LegacyApplication {
    constructor(options: any = {}) {
      super(options);
      this.selectedCaseId = options.caseId ?? null;
    }

    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "csi-case-manager",
        title: "CSI Toolkit Case Manager",
        template: `modules/${MODULE_ID}/templates/case-manager.hbs`,
        classes: ["csi-toolkit", "csi-case-manager"],
        width: 1180,
        height: 820,
        resizable: true
      });
    }

    async getData() {
      const casesObject = getCases();
      const cases = Object.values(casesObject)
        .map(csiCase => normalizeCase(csiCase))
        .sort((left, right) => left.title.localeCompare(right.title));

      if (!this.selectedCaseId && cases.length) this.selectedCaseId = cases[0].id;
      if (this.selectedCaseId && !casesObject[this.selectedCaseId]) this.selectedCaseId = cases[0]?.id ?? null;

      const selected = this.selectedCaseId ? normalizeCase(casesObject[this.selectedCaseId]) : null;
      const itemChoices = selected ? buildItemChoices(selected) : [];

      return {
        cases,
        selected,
        itemChoices,
        options: {
          caseStatuses: CASE_STATUSES,
          themes: THEMES,
          evidenceTypes: EVIDENCE_TYPES,
          evidenceStatuses: EVIDENCE_STATUSES,
          suspectStatuses: SUSPECT_STATUSES,
          connectionTypes: CONNECTION_TYPES,
          connectionStyles: CONNECTION_STYLES,
          connectionColors: CONNECTION_COLORS
        }
      };
    }

    activateListeners(html) {
      super.activateListeners(html);

      html.find("[data-action='select-case']").on("click", event => {
        this.selectedCaseId = event.currentTarget.dataset.caseId;
        this.render(false);
      });

      html.find("[data-action='new-case']").on("click", () => this._createNewCase());
      html.find("[data-csi-case-form]").on("submit", event => this._saveSelectedCase(event));
      html.find("[data-action='save-case']").on("click", event => this._saveSelectedCase(event));
      html.find("[data-action='delete-case']").on("click", () => this._deleteSelectedCase());
      html.find("[data-action='duplicate-case']").on("click", () => this._duplicateSelectedCase());
      html.find("[data-action='open-board']").on("click", () => openCaseBoard(this.selectedCaseId));
      html.find("[data-action='pick-image']").on("click", event => this._pickImage(event.currentTarget));
      html.find("[data-action='export-case']").on("click", () => exportCase(this.selectedCaseId));
      html.find("[data-action='import-case']").on("click", () => this.element[0].querySelector("[data-csi-import-file]")?.click());
      html.find("[data-csi-import-file]").on("change", event => this._importFromFile(event.currentTarget));
    }

    _readCurrentCase() {
      const form = this.element[0].querySelector("[data-csi-case-form]");
      return form ? parseCaseForm(form, this.selectedCaseId) : getCase(this.selectedCaseId);
    }

    async _createNewCase() {
      const csiCase = await createCase({
        title: "New Investigation",
        subtitle: "Unfiled case",
        description: "Describe the incident, victim, premise, or central mystery.",
        visibility: "players"
      });
      this.selectedCaseId = csiCase.id;
      this.render(false);
    }

    async _saveSelectedCase(event) {
      event.preventDefault();
      if (!this.selectedCaseId) return;

      try {
        const csiCase = this._readCurrentCase();
        await saveCase(csiCase);
        this.selectedCaseId = csiCase.id;
        ui.notifications?.info(`${MODULE_TITLE}: Saved case "${csiCase.title}".`);
        this.render(false);
      } catch (error) {
        console.error(`${MODULE_TITLE} | Could not save case`, error);
        ui.notifications?.error(`${MODULE_TITLE}: ${error.message}`);
      }
    }

    async _deleteSelectedCase() {
      if (!this.selectedCaseId) return;
      const csiCase = getCase(this.selectedCaseId);
      if (!csiCase) return;

      const confirmed = await confirmDialog({
        title: "Delete CSI Case",
        content: `<p>Delete <strong>${escapeHtml(csiCase.title)}</strong>? This cannot be undone.</p>`,
        yes: () => true,
        no: () => false,
        defaultYes: false
      });

      if (!confirmed) return;
      await deleteCase(this.selectedCaseId);
      this.selectedCaseId = null;
      this.render(false);
    }

    async _duplicateSelectedCase() {
      if (!this.selectedCaseId) return;
      const copy = await duplicateCase(this.selectedCaseId);
      if (!copy) return;
      this.selectedCaseId = copy.id;
      this.render(false);
    }

    _pickImage(button) {
      const field = button.closest(".csi-image-field")?.querySelector("input");
      if (!field) return;

      const Picker = (globalThis as any).FilePicker ?? (globalThis as any).foundry?.applications?.apps?.FilePicker;
      if (!Picker) {
        ui.notifications?.warn(`${MODULE_TITLE}: Foundry FilePicker is unavailable.`);
        return;
      }

      new Picker({
        type: "image",
        current: field.value,
        callback: path => {
          field.value = path;
          field.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }).render(true);
    }

    async _importFromFile(input) {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const imported = await importCase(JSON.parse(text));
        this.selectedCaseId = imported.id;
        this.render(false);
      } catch (error) {
        console.error(`${MODULE_TITLE} | Import failed`, error);
        ui.notifications?.error(`${MODULE_TITLE}: Import failed. ${error.message}`);
      } finally {
        input.value = "";
      }
    }

    async close(options = {}) {
      state.manager = null;
      return super.close(options);
    }
  }

  function parseCaseForm(form, caseId) {
    const formData = new FormData(form);
    const existing = getCase(caseId) ?? normalizeCase({ id: caseId });
    const csiCase = normalizeCase({
      id: caseId,
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      status: formData.get("status"),
      description: formData.get("description"),
      image: formData.get("image"),
      visibility: "players",
      evidence: existing.evidence,
      suspects: existing.suspects,
      locations: existing.locations,
      timeline: existing.timeline,
      connections: existing.connections,
      boardLayout: {
        ...existing.boardLayout,
        theme: formData.get("theme")
      }
    });

    return normalizeCase(csiCase);
  }

  function parseItemElement(collection, element) {
    const field = name => element.querySelector(`[name="${name}"]`)?.value ?? "";
    const visibility = "players";
    const base = { id: element.dataset.itemId || randomId(), visibility };

    if (collection === "evidence") {
      return normalizeEvidence({
        ...base,
        title: field("title"),
        type: field("type"),
        status: field("status"),
        description: field("description"),
        image: field("image"),
        notes: field("notes")
      });
    }

    if (collection === "suspects") {
      return normalizeSuspect({
        ...base,
        name: field("name"),
        alias: field("alias"),
        status: field("status"),
        motive: field("motive"),
        alibi: field("alibi"),
        image: field("image"),
        notes: field("notes")
      });
    }

    if (collection === "locations") {
      return normalizeLocation({
        ...base,
        name: field("name"),
        sceneId: field("sceneId"),
        image: field("image"),
        description: field("description"),
        notes: field("notes")
      });
    }

    if (collection === "timeline") {
      return normalizeTimelineItem({
        ...base,
        time: field("time"),
        title: field("title"),
        description: field("description"),
        linkedItemIds: field("linkedItemIds").split(",").map(value => value.trim()).filter(Boolean)
      });
    }

    return normalizeConnection({
      id: base.id,
      visibility,
      fromId: field("fromId"),
      toId: field("toId"),
      label: field("label"),
      type: field("type"),
      style: field("style"),
      color: field("color")
    });
  }

  function prepareBoardData(caseId, { playerMode = false, layoutOverride = null } = {}) {
    const csiCase = getCase(caseId);
    if (!csiCase) return { isMissing: true, playerMode, isGM: game.user?.isGM };

    const boardCase = duplicateData(csiCase);
    if (layoutOverride) boardCase.boardLayout = normalizeBoardLayout(layoutOverride);
    boardCase.evidence = visibleCollection(boardCase.evidence);
    boardCase.suspects = visibleCollection(boardCase.suspects);
    boardCase.locations = visibleCollection(boardCase.locations);
    boardCase.timeline = visibleCollection(boardCase.timeline);

    const cards = buildBoardCards(boardCase);
    const index = new Map(cards.map(card => [card.id, card]));

    boardCase.timeline = boardCase.timeline.map(item => ({
      ...item,
      linkedLabels: (item.linkedItemIds ?? []).map(id => index.get(id)?.label).filter(Boolean)
    }));

    const connections = visibleCollection(boardCase.connections)
      .map(connection => {
        const from = index.get(connection.fromId);
        const to = index.get(connection.toId);
        return {
          ...connection,
          fromLabel: from?.label ?? connection.fromId,
          toLabel: to?.label ?? connection.toId,
          x1: from ? from.x + CARD_WIDTH / 2 : 0,
          y1: from ? from.y + 94 : 0,
          x2: to ? to.x + CARD_WIDTH / 2 : 0,
          y2: to ? to.y + 94 : 0,
          labelX: from && to ? Math.round((from.x + to.x + CARD_WIDTH) / 2) : 0,
          labelY: from && to ? Math.round((from.y + to.y) / 2 + 84) : 0,
          typeClass: `csi-connection--${connection.type}`,
          styleClass: `csi-connection-line--${connection.style}`,
          colorClass: `csi-connection-color--${connection.color}`,
          hasVisibleEnds: Boolean(from && to)
        };
      })
      .filter(connection => connection.hasVisibleEnds);

    return {
      case: boardCase,
      cards,
      connections,
      boardSize: { width: BOARD_WIDTH, height: BOARD_HEIGHT },
      viewStyle: `transform: translate(${boardCase.boardLayout.view.x}px, ${boardCase.boardLayout.view.y}px) scale(${boardCase.boardLayout.view.scale});`,
      zoomPercent: Math.round(boardCase.boardLayout.view.scale * 100),
      themeClass: `csi-theme-${boardCase.boardLayout.theme}`,
      playerMode,
      isGM: game.user?.isGM,
      canEditBoard: canUserEditBoard(csiCase),
      addCollections: BOARD_ADD_COLLECTIONS.map(collection => ({
        id: collection,
        label: labelize(singularLabel(collection))
      })),
      counts: {
        evidence: boardCase.evidence.length,
        suspects: boardCase.suspects.length,
        locations: boardCase.locations.length,
        timeline: boardCase.timeline.length,
        connections: connections.length
      }
    };
  }

  function visibleCollection(collection) {
    const items = Array.isArray(collection) ? collection : [];
    return items;
  }

  function buildBoardCards(csiCase) {
    const layout = normalizeBoardLayout(csiCase.boardLayout);
    const cards = [];

    for (const item of csiCase.evidence) cards.push(makeBoardCard(item, "evidence", "Evidence", item.title, layout, cards.length));
    for (const item of csiCase.suspects) cards.push(makeBoardCard(item, "suspects", "Suspect", item.name, layout, cards.length));
    for (const item of csiCase.locations) cards.push(makeBoardCard(item, "locations", "Location", item.name, layout, cards.length));
    for (const item of csiCase.timeline) cards.push(makeBoardCard(item, "timeline", "Timeline", item.title, layout, cards.length));

    return cards;
  }

  function makeBoardCard(item, collection, kindLabel, label, layout, index) {
    const position = layout.cards[item.id] ?? defaultBoardPosition(index);
    return {
      ...item,
      collection,
      kind: collection === "suspects" ? "suspect" : collection === "locations" ? "location" : collection === "timeline" ? "timeline" : "evidence",
      kindLabel,
      label,
      x: Number(position.x) || 0,
      y: Number(position.y) || 0,
      layer: "public",
      style: `left: ${Number(position.x) || 0}px; top: ${Number(position.y) || 0}px;`
    };
  }

  function defaultBoardPosition(index) {
    const columns = 5;
    return {
      x: 80 + (index % columns) * 300,
      y: 90 + Math.floor(index / columns) * 330
    };
  }

  function buildItemChoices(csiCase) {
    const choices = [];
    for (const item of csiCase.evidence) choices.push({ id: item.id, label: `Evidence: ${item.title}` });
    for (const item of csiCase.suspects) choices.push({ id: item.id, label: `Suspect: ${item.name}` });
    for (const item of csiCase.locations) choices.push({ id: item.id, label: `Location: ${item.name}` });
    for (const item of csiCase.timeline) choices.push({ id: item.id, label: `Timeline: ${item.title}` });
    return choices;
  }

  function renderOpenSurfaces(caseId, { resetLayout = false } = {}) {
    if (state.manager?.rendered) state.manager.render(true);
    for (const [key, board] of state.boards.entries()) {
      if (resetLayout && key.startsWith(`${caseId}:`)) board._localLayout = null;
      if (key.startsWith(`${caseId}:`) && board.rendered) board.render(true);
    }
  }

  function canUserEditBoard(caseOrId) {
    const csiCase = typeof caseOrId === "string" ? getCase(caseOrId) : caseOrId;
    return Boolean(csiCase);
  }

  function canUserContribute() {
    return true;
  }

  function closeBoard(caseId) {
    for (const [key, board] of state.boards.entries()) {
      if (!key.startsWith(`${caseId}:`)) continue;
      board.close();
    }
  }

  function duplicateData(value) {
    if (foundry.utils.deepClone) return foundry.utils.deepClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function singularLabel(collection) {
    if (collection === "suspects") return "suspect";
    if (collection === "locations") return "location";
    if (collection === "timeline") return "timeline item";
    if (collection === "connections") return "connection";
    return "evidence";
  }

  function getItemTitle(item, collection) {
    if (collection === "connections") return item.label || `${item.fromId} -> ${item.toId}`;
    if (collection === "suspects" || collection === "locations") return item.name;
    return item.title;
  }

  function getRectEdgeAnchor(source, target) {
    const dx = target.centerX - source.centerX;
    const dy = target.centerY - source.centerY;
    if (!dx && !dy) return { x: Math.round(source.centerX), y: Math.round(source.centerY) };

    const scaleX = dx === 0 ? Number.POSITIVE_INFINITY : Math.abs((source.width / 2) / dx);
    const scaleY = dy === 0 ? Number.POSITIVE_INFINITY : Math.abs((source.height / 2) / dy);
    const scale = Math.min(scaleX, scaleY);
    if (!Number.isFinite(scale) || scale <= 0) return { x: Math.round(source.centerX), y: Math.round(source.centerY) };

    return {
      x: Math.round(source.centerX + dx * scale),
      y: Math.round(source.centerY + dy * scale)
    };
  }

  function isFinitePoint(point) {
    return Number.isFinite(point?.x) && Number.isFinite(point?.y);
  }

  function confirmDialog(options) {
    const DialogClass = (globalThis as any).Dialog ?? (globalThis as any).foundry?.appv1?.api?.Dialog;
    if (DialogClass?.confirm) return DialogClass.confirm(options);
    return Promise.resolve(globalThis.confirm?.(options.content?.replace(/<[^>]+>/g, "") ?? options.title));
  }

})();
