// @ts-nocheck
(() => {
  "use strict";

  const MODULE_ID = "csi-toolkit";
  const MODULE_TITLE = "CSI Toolkit";
  const SOCKET_NAME = `module.${MODULE_ID}`;
  const SAMPLE_CASE_PATH = `modules/${MODULE_ID}/samples/glass-orchid.json`;
  const TEMPLATE_PATHS = [
    `modules/${MODULE_ID}/templates/case-manager.hbs`,
    `modules/${MODULE_ID}/templates/case-browser.hbs`,
    `modules/${MODULE_ID}/templates/case-board.hbs`,
    `modules/${MODULE_ID}/templates/item-card.hbs`,
    `modules/${MODULE_ID}/templates/board-item-editor.hbs`
  ];

  const CASE_STATUSES = ["open", "cold", "solved", "classified"];
  const VISIBILITIES = ["gm", "players"];
  const THEMES = ["database", "noir"];
  const EVIDENCE_TYPES = ["physical", "digital", "biological", "weapon", "document", "testimony", "other"];
  const EVIDENCE_STATUSES = ["unknown", "relevant", "red_herring", "confirmed"];
  const SUSPECT_STATUSES = ["unknown", "cleared", "person_of_interest", "prime_suspect", "arrested", "dead"];
  const CONNECTION_TYPES = ["link", "supports", "contradicts", "location", "timeline", "identity"];
  const CONNECTION_STYLES = ["solid", "dashed", "dotted"];
  const CONNECTION_COLORS = ["cyan", "green", "red", "amber", "violet", "orange", "white"];
  const COLLECTIONS = ["evidence", "suspects", "locations", "timeline", "connections"];
  const BOARD_ADD_COLLECTIONS = ["evidence", "suspects", "locations", "timeline", "connections"];
  const CARD_WIDTH = 220;
  const CARD_HEIGHT = 246;
  const BOARD_WIDTH = 5200;
  const BOARD_HEIGHT = 3600;
  const LegacyApplication = globalThis.Application ?? foundry.appv1?.api?.Application;

  const state = {
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

  /*
  HoloSuite Core is the suite launcher; keep this module out of the scene-control toolbar.
  Hooks.on("getSceneControlButtons", controls => {
    const tool = {
      name: "csi-toolkit-manager",
      title: "CSI Toolkit",
      icon: "fas fa-fingerprint",
      button: true,
      visible: true,
      onClick: () => game.user?.isGM ? openCaseManager() : openCaseBrowser()
    };

    if (Array.isArray(controls)) {
      const tokenControls = controls.find(control => control.name === "token") ?? controls[0];
      if (tokenControls?.tools) tokenControls.tools.push(tool);
      return;
    }

    const tokenControls = controls?.tokens ?? controls?.token ?? Object.values(controls ?? {})[0];
    if (tokenControls?.tools) tokenControls.tools["csi-toolkit-manager"] = tool;
  });
  */

  function registerSettings() {
    game.settings.register(MODULE_ID, "cases", {
      name: "CSI Toolkit Cases",
      hint: "Stores all investigation cases for this world.",
      scope: "world",
      config: false,
      type: Object,
      default: {}
    });

  }

  function registerHandlebarsHelpers() {
    Handlebars.registerHelper("csiEq", (left, right) => left === right);
    Handlebars.registerHelper("csiLabel", value => labelize(value));
    Handlebars.registerHelper("csiCount", value => Array.isArray(value) ? value.length : 0);
    Handlebars.registerHelper("csiFallback", (value, fallback) => value || fallback);
    Handlebars.registerHelper("csiJoin", value => Array.isArray(value) ? value.join(", ") : "");
    Handlebars.registerHelper("csiOption", (value, selected) => value === selected ? "selected" : "");
    Handlebars.registerHelper("csiChecked", value => value === "players" ? "checked" : "");
  }

  function buildPublicApi() {
    return {
      openCaseBoard: (caseId, options = {}) => openCaseBoard(caseId, options),
      openCaseManager: () => openCaseManager(),
      openCaseBrowser: () => openCaseBrowser(),
      createCase: caseData => createCase(caseData),
      getCases: () => getCases(),
      exportCase: caseId => exportCase(caseId),
      importCase: caseData => importCase(caseData),
      importSampleCase: () => importSampleCase()
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

  function getCase(caseId) {
    const cases = getCases();
    return cases[caseId] ? normalizeCase(cases[caseId]) : null;
  }

  async function saveCase(caseData, { notify = true, render = true } = {}) {
    const csiCase = normalizeCase(caseData);
    const cases = getCases();
    cases[csiCase.id] = csiCase;
    await setCases(cases);
    if (notify) broadcastCaseUpdated(csiCase.id);
    if (render) renderOpenSurfaces(csiCase.id);
    return csiCase;
  }

  async function createCase(caseData = {}) {
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

  async function importSampleCase() {
    const response = await fetch(SAMPLE_CASE_PATH);
    if (!response.ok) throw new Error(`Could not load ${SAMPLE_CASE_PATH}`);
    return importCase(await response.json());
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

  function openCaseBoard(caseId, options = {}) {
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

  function broadcastCaseUpdated(caseId) {
    game.socket?.emit(SOCKET_NAME, { type: "case-updated", caseId, userId: game.user?.id });
  }

  function handleSocketMessage(message) {
    if (!message) return;

    if (message.type === "case-updated" && message.caseId) {
      if (message.userId && message.userId === game.user?.id) return;
      renderOpenSurfaces(message.caseId);
      return;
    }

  }

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
    constructor(options = {}) {
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
      html.find("[data-action='import-sample']").on("click", () => this._importSample());
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

      const Picker = globalThis.FilePicker ?? globalThis.foundry?.applications?.apps?.FilePicker;
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

    async _importSample() {
      try {
        const imported = await importSampleCase();
        this.selectedCaseId = imported.id;
        this.render(false);
      } catch (error) {
        console.error(`${MODULE_TITLE} | Sample import failed`, error);
        ui.notifications?.error(`${MODULE_TITLE}: Could not import sample case.`);
      }
    }

    async close(options = {}) {
      state.manager = null;
      return super.close(options);
    }
  }

  class CSICaseBoard extends LegacyApplication {
    constructor(caseId, options = {}) {
      super(options);
      this.caseId = caseId;
      this.playerMode = Boolean(options.playerMode);
      this._drag = null;
      this._pan = null;
      this._localLayout = null;
      this._layoutDraft = null;
      this._pendingConnection = null;
      this._contextBoardPosition = null;
      this._boundContextClose = null;
      this._dimmedKinds = new Set();
      this._saveTimer = null;
    }

    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: "CSI Toolkit Case Board",
        template: `modules/${MODULE_ID}/templates/case-board.hbs`,
        classes: ["csi-toolkit", "csi-case-board-window"],
        width: 1220,
        height: 840,
        resizable: true
      });
    }

    get id() {
      return `csi-case-board-${this.caseId}-${this.playerMode ? "player" : "gm"}`;
    }

    get title() {
      const csiCase = getCase(this.caseId);
      const suffix = this.playerMode ? "Player Board" : "GM Board";
      return csiCase ? `${csiCase.title} - ${suffix}` : `CSI Toolkit - ${suffix}`;
    }

    async getData() {
      return prepareBoardData(this.caseId, { playerMode: this.playerMode, layoutOverride: this._localLayout });
    }

    activateListeners(html) {
      super.activateListeners(html);
      html.find("[data-action='open-manager']").on("click", () => openCaseManager());
      html.find("[data-action='refresh-board']").on("click", () => this.render(false));
      html.find("[data-action='zoom-in']").on("click", () => this._zoomBy(0.1));
      html.find("[data-action='zoom-out']").on("click", () => this._zoomBy(-0.1));
      html.find("[data-action='context-add-board-item']").on("click", event => this._addBoardItemFromContext(event));
      html.find("[data-action='edit-card']").on("click", event => this._editCard(event.currentTarget.dataset.collection, event.currentTarget.dataset.itemId));
      html.find("[data-action='delete-board-item']").on("click", event => this._deleteBoardItem(event.currentTarget.dataset.collection, event.currentTarget.dataset.itemId));
      html.find("[data-action='move-timeline-item']").on("click", event => this._moveTimelineItem(event.currentTarget.dataset.itemId, event.currentTarget.dataset.direction));
      html.find("[data-csi-connection-hit]").on("dblclick", event => this._editCard("connections", event.currentTarget.dataset.connectionId));
      html.find("[data-action='start-connection']").on("click", event => this._startConnection(event));
      html.find("[data-csi-dim-kind]").on("change", event => this._toggleDimKind(event.currentTarget));

      const viewport = html[0].querySelector("[data-csi-board-viewport]");
      if (viewport) {
        viewport.addEventListener("wheel", event => this._onWheel(event), { passive: false });
        viewport.addEventListener("mousedown", event => this._onViewportMouseDown(event));
        viewport.addEventListener("contextmenu", event => this._openContextMenu(event));
      }

      html.find("[data-csi-board-card]").on("mousedown", event => this._onCardMouseDown(event));
      html.find("[data-csi-board-card]").on("click", event => this._completeConnection(event));
      html.find(".csi-card-image").on("load", () => this._queueConnectionLineUpdate());
      this._syncDimControls();
      this._applyDimmedKinds();
      this._queueConnectionLineUpdate();
    }

    _onCardMouseDown(event) {
      if (!canUserEditBoard(this.caseId) || event.button !== 0 || event.target.closest("button")) return;
      const card = event.currentTarget;
      const view = this._getView();
      const layout = this._getLayout();
      const itemId = card.dataset.itemId;
      const current = layout.cards[itemId] ?? { x: Number(card.dataset.x) || 0, y: Number(card.dataset.y) || 0 };

      event.preventDefault();
      this._drag = {
        itemId,
        card,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startX: current.x,
        startY: current.y,
        scale: view.scale
      };

      document.addEventListener("mousemove", this._boundDragMove = moveEvent => this._onCardDrag(moveEvent));
      document.addEventListener("mouseup", this._boundDragEnd = () => this._endDrag());
    }

    _onCardDrag(event) {
      if (!this._drag) return;
      const x = Math.round(this._drag.startX + (event.clientX - this._drag.startClientX) / this._drag.scale);
      const y = Math.round(this._drag.startY + (event.clientY - this._drag.startClientY) / this._drag.scale);
      this._drag.card.style.left = `${x}px`;
      this._drag.card.style.top = `${y}px`;
      this._drag.card.dataset.x = x;
      this._drag.card.dataset.y = y;
      this._updateConnectionLines();
    }

    _endDrag() {
      if (!this._drag) return;
      document.removeEventListener("mousemove", this._boundDragMove);
      document.removeEventListener("mouseup", this._boundDragEnd);
      const layout = this._getLayout();
      layout.cards[this._drag.itemId] = {
        ...(layout.cards[this._drag.itemId] ?? {}),
        x: Number(this._drag.card.dataset.x),
        y: Number(this._drag.card.dataset.y)
      };
      this._drag = null;
      this._saveLayout(layout);
    }

    _onViewportMouseDown(event) {
      if (event.button !== 0 || event.target.closest("[data-csi-board-card], [data-csi-context-menu], [data-csi-connection-hit], button")) return;
      this._hideContextMenu();
      const view = this._getView();
      event.preventDefault();
      this._pan = {
        startClientX: event.clientX,
        startClientY: event.clientY,
        startX: view.x,
        startY: view.y
      };
      document.addEventListener("mousemove", this._boundPanMove = moveEvent => this._onPan(moveEvent));
      document.addEventListener("mouseup", this._boundPanEnd = () => this._endPan());
    }

    _onPan(event) {
      if (!this._pan) return;
      const layout = this._getLayout();
      layout.view.x = Math.round(this._pan.startX + event.clientX - this._pan.startClientX);
      layout.view.y = Math.round(this._pan.startY + event.clientY - this._pan.startClientY);
      this._layoutDraft = layout;
      this._applyView(layout.view);
    }

    _endPan() {
      if (!this._pan) return;
      document.removeEventListener("mousemove", this._boundPanMove);
      document.removeEventListener("mouseup", this._boundPanEnd);
      const layout = this._layoutDraft ?? this._getLayout();
      this._pan = null;
      this._saveLayout(layout);
      this._layoutDraft = null;
    }

    _onWheel(event) {
      event.preventDefault();
      this._hideContextMenu();
      this._zoomBy(event.deltaY > 0 ? -0.08 : 0.08);
    }

    _zoomBy(delta) {
      const layout = this._getLayout();
      layout.view.scale = clamp(Number(layout.view.scale) + delta, 0.45, 1.8);
      this._applyView(layout.view);
      this._saveLayout(layout);
    }

    _applyView(view) {
      const canvas = this.element[0]?.querySelector("[data-csi-board-canvas]");
      if (!canvas) return;
      canvas.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
      const zoom = this.element[0]?.querySelector("[data-csi-zoom]");
      if (zoom) zoom.textContent = `${Math.round(view.scale * 100)}%`;
    }

    _getView() {
      return this._getLayout().view;
    }

    _getLayout() {
      const csiCase = getCase(this.caseId);
      return normalizeBoardLayout(this._layoutDraft ?? this._localLayout ?? csiCase?.boardLayout);
    }

    async _saveLayout(layout) {
      this._localLayout = normalizeBoardLayout(layout);
      if (!game.user?.isGM) return;
      clearTimeout(this._saveTimer);
      this._saveTimer = setTimeout(async () => {
        const csiCase = getCase(this.caseId);
        if (!csiCase) return;
        csiCase.boardLayout = normalizeBoardLayout(layout);
        await saveCase(csiCase, { render: false });
      }, 180);
    }

    _updateConnectionLines() {
      const root = this.element[0];
      if (!root) return;
      const cards = new Map(Array.from(root.querySelectorAll("[data-csi-board-card]")).map(card => [card.dataset.itemId, card]));
      for (const group of root.querySelectorAll("[data-csi-connection-group]")) {
        const from = cards.get(group.dataset.fromId);
        const to = cards.get(group.dataset.toId);
        if (!from || !to) continue;
        const fromRect = this._getCardBoardRect(from);
        const toRect = this._getCardBoardRect(to);
        const start = getRectEdgeAnchor(fromRect, toRect);
        const end = getRectEdgeAnchor(toRect, fromRect);
        if (!isFinitePoint(start) || !isFinitePoint(end)) continue;
        for (const line of group.querySelectorAll("[data-csi-connection-line], [data-csi-connection-hit]")) {
          line.setAttribute("x1", start.x);
          line.setAttribute("y1", start.y);
          line.setAttribute("x2", end.x);
          line.setAttribute("y2", end.y);
        }
        const label = group.querySelector("[data-csi-connection-label]");
        if (label) {
          label.setAttribute("x", Math.round((start.x + end.x) / 2));
          label.setAttribute("y", Math.round((start.y + end.y) / 2 - 10));
        }
      }
    }

    _queueConnectionLineUpdate() {
      const update = () => this._updateConnectionLines();
      if (globalThis.requestAnimationFrame) globalThis.requestAnimationFrame(update);
      else globalThis.setTimeout(update, 0);
    }

    _getCardBoardRect(card) {
      const x = Number(card.dataset.x) || Number.parseFloat(card.style.left) || 0;
      const y = Number(card.dataset.y) || Number.parseFloat(card.style.top) || 0;
      const width = card.offsetWidth || CARD_WIDTH;
      const height = card.offsetHeight || CARD_HEIGHT;
      return {
        x,
        y,
        width,
        height,
        centerX: x + width / 2,
        centerY: y + height / 2
      };
    }

    _editCard(collection, itemId) {
      if (!canUserEditBoard(this.caseId)) return;
      new CSIBoardItemEditor(this.caseId, collection, itemId).render(true);
    }

    async _deleteBoardItem(collection, itemId) {
      if (!canUserEditBoard(this.caseId) || !COLLECTIONS.includes(collection) || !itemId) return;
      await deleteBoardItem(this.caseId, collection, itemId);
    }

    async _moveTimelineItem(itemId, direction) {
      if (!canUserEditBoard(this.caseId) || !itemId) return;
      const csiCase = getCase(this.caseId);
      const index = csiCase?.timeline?.findIndex(item => item.id === itemId) ?? -1;
      const offset = direction === "up" ? -1 : direction === "down" ? 1 : 0;
      const nextIndex = index + offset;
      if (!csiCase || index < 0 || nextIndex < 0 || nextIndex >= csiCase.timeline.length) return;
      const [item] = csiCase.timeline.splice(index, 1);
      csiCase.timeline.splice(nextIndex, 0, item);
      await saveCase(csiCase);
    }

    _toggleDimKind(input) {
      const kind = input?.value;
      if (!["evidence", "suspects", "locations", "timeline"].includes(kind)) return;
      if (input.checked) this._dimmedKinds.add(kind);
      else this._dimmedKinds.delete(kind);
      this._applyDimmedKinds();
    }

    _syncDimControls() {
      for (const input of this.element[0]?.querySelectorAll("[data-csi-dim-kind]") ?? []) {
        input.checked = this._dimmedKinds.has(input.value);
      }
    }

    _applyDimmedKinds() {
      const root = this.element[0];
      if (!root) return;
      for (const card of root.querySelectorAll("[data-csi-board-card]")) {
        card.classList.toggle("is-type-dimmed", this._dimmedKinds.has(card.dataset.collection));
      }
      for (const row of root.querySelectorAll("[data-csi-timeline-row]")) {
        row.classList.toggle("is-type-dimmed", this._dimmedKinds.has(row.dataset.collection));
      }
    }

    _addBoardItemFromContext(event) {
      event.preventDefault();
      event.stopPropagation();
      const collection = event.currentTarget.dataset.collection;
      this._addBoardItem(collection, this._contextBoardPosition);
      this._hideContextMenu();
    }

    _addBoardItem(collection = "evidence", boardPosition = null) {
      if (!canUserEditBoard(this.caseId)) return;
      if (!BOARD_ADD_COLLECTIONS.includes(collection)) return;
      new CSIBoardItemEditor(this.caseId, collection, null, { boardPosition }).render(true);
    }

    _openContextMenu(event) {
      if (!canUserEditBoard(this.caseId)) return;
      if (event.target.closest("[data-csi-board-card], button, input, select, textarea")) return;

      const menu = this.element[0]?.querySelector("[data-csi-context-menu]");
      const viewport = this.element[0]?.querySelector("[data-csi-board-viewport]");
      if (!menu || !viewport) return;

      event.preventDefault();
      event.stopPropagation();
      this._contextBoardPosition = this._clientToBoardPosition(event.clientX, event.clientY);
      menu.hidden = false;
      const menuWidth = menu.offsetWidth || 156;
      const menuHeight = menu.offsetHeight || 180;
      const maxLeft = Math.max(4, globalThis.innerWidth - menuWidth - 4);
      const maxTop = Math.max(4, globalThis.innerHeight - menuHeight - 4);
      menu.style.left = `${clamp(event.clientX, 4, maxLeft)}px`;
      menu.style.top = `${clamp(event.clientY, 4, maxTop)}px`;

      if (this._boundContextClose) document.removeEventListener("click", this._boundContextClose);
      this._boundContextClose = () => this._hideContextMenu();
      globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: true }), 0);
    }

    _hideContextMenu() {
      const menu = this.element[0]?.querySelector("[data-csi-context-menu]");
      if (menu) menu.hidden = true;
      if (this._boundContextClose) document.removeEventListener("click", this._boundContextClose);
      this._boundContextClose = null;
    }

    _clientToBoardPosition(clientX, clientY) {
      const viewport = this.element[0]?.querySelector("[data-csi-board-viewport]");
      const rect = viewport?.getBoundingClientRect();
      const view = this._getView();
      if (!rect) return null;
      return {
        x: Math.round((clientX - rect.left - view.x) / view.scale - CARD_WIDTH / 2),
        y: Math.round((clientY - rect.top - view.y) / view.scale - 32)
      };
    }

    _startConnection(event) {
      event.preventDefault();
      event.stopPropagation();
      if (!canUserEditBoard(this.caseId)) return;

      const button = event.currentTarget;
      const itemId = button.dataset.itemId;
      if (!itemId) return;

      this._pendingConnection = { fromId: itemId };
      for (const card of this.element[0].querySelectorAll("[data-csi-board-card]")) card.classList.toggle("is-link-source", card.dataset.itemId === itemId);
      ui.notifications?.info(`${MODULE_TITLE}: Select another card to create a connection.`);
    }

    async _completeConnection(event) {
      if (!this._pendingConnection || event.target.closest("button, input, select, textarea")) return;
      if (!canUserEditBoard(this.caseId)) return;

      const toId = event.currentTarget.dataset.itemId;
      const fromId = this._pendingConnection.fromId;
      this._pendingConnection = null;
      for (const card of this.element[0].querySelectorAll("[data-csi-board-card]")) card.classList.remove("is-link-source");
      if (!toId || toId === fromId) return;

      const csiCase = getCase(this.caseId);
      if (!csiCase) return;

      const connection = normalizeConnection({
        id: randomId(),
        fromId,
        toId,
        label: "linked to",
        type: "link",
        style: "solid",
        color: "cyan",
        visibility: "players"
      });
      csiCase.connections.push(connection);
      await saveCase(csiCase);
      new CSIBoardItemEditor(this.caseId, "connections", connection.id).render(true);
    }

    async close(options = {}) {
      this._hideContextMenu();
      state.boards.delete(`${this.caseId}:${this.playerMode ? "player" : "gm"}`);
      if (state.playerBoard === this) state.playerBoard = null;
      return super.close(options);
    }
  }

  class CSIBoardItemEditor extends LegacyApplication {
    constructor(caseId, collection, itemId, options = {}) {
      super(options);
      this.caseId = caseId;
      this.collection = collection;
      this.itemId = itemId || randomId();
      this.isNew = !itemId;
      this.boardPosition = options.boardPosition ? {
        x: Number(options.boardPosition.x) || 0,
        y: Number(options.boardPosition.y) || 0
      } : null;
    }

    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: "Edit CSI Board Card",
        template: `modules/${MODULE_ID}/templates/board-item-editor.hbs`,
        classes: ["csi-toolkit", "csi-board-item-editor"],
        width: 560,
        height: 520,
        resizable: true
      });
    }

    get title() {
      const item = this._getItem();
      return this.isNew ? `Add ${singularLabel(this.collection)}` : item ? `Edit ${getItemTitle(item, this.collection)}` : "Edit CSI Board Card";
    }

    async getData() {
      const csiCase = getCase(this.caseId);
      const item = this._getItem();
      return {
        caseId: this.caseId,
        collection: this.collection,
        item,
        isNew: this.isNew,
        itemChoices: csiCase ? buildItemChoices(csiCase, !game.user?.isGM) : [],
        isEvidence: this.collection === "evidence",
        isSuspect: this.collection === "suspects",
        isLocation: this.collection === "locations",
        isTimeline: this.collection === "timeline",
        isConnection: this.collection === "connections",
        options: {
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
      const root = html[0];
      const form = root?.matches?.("[data-csi-board-item-form]") ? root : root?.querySelector?.("[data-csi-board-item-form]");
      if (form) form.addEventListener("submit", event => this._save(event));
      html.find("[data-action='pick-image']").on("click", event => this._pickImage(event.currentTarget));
      html.find("[data-action='delete-board-item']").on("click", event => this._delete(event));
    }

    _getItem() {
      const csiCase = getCase(this.caseId);
      const item = csiCase?.[this.collection]?.find(candidate => candidate.id === this.itemId);
      if (item) return item;
      if (!this.isNew) return null;
      return defaultItem(this.collection, "players", this.itemId);
    }

    async _save(event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();

      const form = event.currentTarget;
      const csiCase = getCase(this.caseId);
      if (!csiCase) {
        ui.notifications?.warn(`${MODULE_TITLE}: The case could not be found.`);
        return false;
      }

      const index = csiCase[this.collection].findIndex(item => item.id === this.itemId);
      if (index < 0 && !this.isNew) {
        ui.notifications?.warn(`${MODULE_TITLE}: The item could not be found.`);
        return false;
      }

      const updated = parseItemElement(this.collection, form);
      updated.id = this.itemId;
      updated.visibility = "players";
      updated.hidden = index >= 0 ? Boolean(csiCase[this.collection][index].hidden) : false;
      if (index >= 0) csiCase[this.collection][index] = updated;
      else csiCase[this.collection].push(updated);
      if (this.isNew && this.collection !== "connections") {
        csiCase.boardLayout.cards[this.itemId] = this.boardPosition ?? defaultBoardPosition(csiCase.evidence.length + csiCase.suspects.length + csiCase.locations.length + csiCase.timeline.length);
      }
      await saveCase(csiCase);
      this.close();
      return false;
    }

    async _delete(event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      if (this.isNew) return false;
      const deleted = await deleteBoardItem(this.caseId, this.collection, this.itemId, { confirm: true });
      if (deleted) this.close();
      return false;
    }

    _pickImage(button) {
      const field = button.closest(".csi-image-field")?.querySelector("input");
      const Picker = globalThis.FilePicker ?? globalThis.foundry?.applications?.apps?.FilePicker;
      if (!field || !Picker) return;
      new Picker({
        type: "image",
        current: field.value,
        callback: path => {
          field.value = path;
          field.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }).render(true);
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

    const cards = buildBoardCards(boardCase, playerMode);
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

  function normalizeCase(data = {}, { forceNewId = false } = {}) {
    return {
      id: forceNewId ? randomId() : data.id || randomId(),
      title: String(data.title || "Untitled Case"),
      subtitle: String(data.subtitle || ""),
      status: normalizeEnum(data.status, CASE_STATUSES, "open"),
      description: String(data.description || ""),
      image: String(data.image || ""),
      visibility: normalizeEnum(data.visibility, VISIBILITIES, "players"),
      evidence: normalizeCollection(data.evidence, normalizeEvidence),
      suspects: normalizeCollection(data.suspects, normalizeSuspect),
      locations: normalizeCollection(data.locations, normalizeLocation),
      timeline: normalizeCollection(data.timeline, normalizeTimelineItem),
      connections: normalizeCollection(data.connections, normalizeConnection),
      boardLayout: normalizeBoardLayout(data.boardLayout)
    };
  }

  function normalizeEvidence(data = {}) {
    return {
      id: data.id || randomId(),
      title: String(data.title || "Untitled Evidence"),
      type: normalizeEnum(data.type, EVIDENCE_TYPES, "other"),
      description: String(data.description || ""),
      image: String(data.image || ""),
      status: normalizeEnum(data.status, EVIDENCE_STATUSES, "unknown"),
      visibility: normalizeEnum(data.visibility, VISIBILITIES, "players"),
      hidden: Boolean(data.hidden),
      notes: String(data.notes || "")
    };
  }

  function normalizeSuspect(data = {}) {
    return {
      id: data.id || randomId(),
      name: String(data.name || "Unknown Suspect"),
      alias: String(data.alias || ""),
      image: String(data.image || ""),
      motive: String(data.motive || ""),
      alibi: String(data.alibi || ""),
      status: normalizeEnum(data.status, SUSPECT_STATUSES, "unknown"),
      visibility: normalizeEnum(data.visibility, VISIBILITIES, "players"),
      hidden: Boolean(data.hidden),
      notes: String(data.notes || "")
    };
  }

  function normalizeLocation(data = {}) {
    return {
      id: data.id || randomId(),
      name: String(data.name || "Unknown Location"),
      sceneId: String(data.sceneId || ""),
      image: String(data.image || ""),
      description: String(data.description || ""),
      visibility: normalizeEnum(data.visibility, VISIBILITIES, "players"),
      hidden: Boolean(data.hidden),
      notes: String(data.notes || "")
    };
  }

  function normalizeTimelineItem(data = {}) {
    return {
      id: data.id || randomId(),
      time: String(data.time || ""),
      title: String(data.title || "Timeline Event"),
      description: String(data.description || ""),
      linkedItemIds: Array.isArray(data.linkedItemIds) ? data.linkedItemIds.map(String) : [],
      visibility: normalizeEnum(data.visibility, VISIBILITIES, "players"),
      hidden: Boolean(data.hidden)
    };
  }

  function normalizeConnection(data = {}) {
    return {
      id: data.id || randomId(),
      fromId: String(data.fromId || ""),
      toId: String(data.toId || ""),
      label: String(data.label || ""),
      type: normalizeEnum(data.type, CONNECTION_TYPES, "link"),
      style: normalizeEnum(data.style, CONNECTION_STYLES, "solid"),
      color: normalizeEnum(data.color, CONNECTION_COLORS, connectionDefaultColor(data.type)),
      visibility: normalizeEnum(data.visibility, VISIBILITIES, "players")
    };
  }

  function normalizeBoardLayout(data = {}) {
    return {
      theme: normalizeEnum(data.theme, THEMES, "database"),
      view: {
        x: Number(data.view?.x) || 0,
        y: Number(data.view?.y) || 0,
        scale: clamp(Number(data.view?.scale) || 1, 0.45, 1.8)
      },
      cards: Object.fromEntries(Object.entries(data.cards ?? {}).map(([id, position]) => [id, {
        x: Number(position?.x) || 0,
        y: Number(position?.y) || 0
      }]))
    };
  }

  function defaultItem(collection, visibility = "players", id = randomId()) {
    if (collection === "evidence") return normalizeEvidence({ id, visibility });
    if (collection === "suspects") return normalizeSuspect({ id, visibility });
    if (collection === "locations") return normalizeLocation({ id, visibility });
    if (collection === "timeline") return normalizeTimelineItem({ id, visibility });
    return normalizeConnection({ id, visibility });
  }

  function normalizeCollection(collection, normalizer) {
    return Array.isArray(collection) ? collection.map(item => normalizer(item)) : [];
  }

  function normalizeEnum(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback;
  }

  function renderOpenSurfaces(caseId) {
    if (state.manager?.rendered) state.manager.render(false);
    for (const [key, board] of state.boards.entries()) {
      if (key.startsWith(`${caseId}:`) && board.rendered) board.render(false);
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

  function randomId() {
    if (foundry.utils.randomID) return foundry.utils.randomID();
    return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 12);
  }

  function labelize(value) {
    return String(value ?? "").replace(/_/g, " ").replace(/\b\w/g, letter => letter.toUpperCase());
  }

  function slugify(value) {
    return String(value || "case").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "case";
  }

  function singularLabel(collection) {
    if (collection === "suspects") return "suspect";
    if (collection === "locations") return "location";
    if (collection === "timeline") return "timeline item";
    if (collection === "connections") return "connection";
    return "evidence";
  }

  function connectionDefaultColor(type) {
    if (type === "supports") return "green";
    if (type === "contradicts") return "red";
    if (type === "location") return "amber";
    if (type === "timeline") return "violet";
    if (type === "identity") return "orange";
    return "cyan";
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

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function confirmDialog(options) {
    const DialogClass = globalThis.Dialog ?? globalThis.foundry?.appv1?.api?.Dialog;
    if (DialogClass?.confirm) return DialogClass.confirm(options);
    return Promise.resolve(globalThis.confirm?.(options.content?.replace(/<[^>]+>/g, "") ?? options.title));
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
  }
})();
