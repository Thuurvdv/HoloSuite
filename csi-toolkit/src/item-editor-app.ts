import {
  CONNECTION_COLORS,
  CONNECTION_STYLES,
  CONNECTION_TYPES,
  EVIDENCE_STATUSES,
  EVIDENCE_TYPES,
  SUSPECT_STATUSES,
  defaultItem,
  randomId
} from "./case-model";

declare const foundry: any;
declare const game: any;
declare const globalThis: any;
declare const ui: any;

export function createCSIBoardItemEditorClass(deps: any) {
  const {
    LegacyApplication,
    moduleId,
    moduleTitle,
    singularLabel,
    getItemTitle,
    getCase,
    buildItemChoices,
    parseItemElement,
    saveCase,
    deleteBoardItem,
    defaultBoardPosition
  } = deps;

  return class CSIBoardItemEditor extends LegacyApplication {
    caseId: string;
    collection: string;
    itemId: string;
    isNew: boolean;
    boardPosition: any;

    constructor(caseId: string, collection: string, itemId: string | null, options: any = {}) {
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
        template: `modules/${moduleId}/templates/board-item-editor.hbs`,
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

    activateListeners(html: any) {
      super.activateListeners(html);
      const root = html[0];
      const form = root?.matches?.("[data-csi-board-item-form]") ? root : root?.querySelector?.("[data-csi-board-item-form]");
      if (form) form.addEventListener("submit", (event: any) => this._save(event));
      html.find("[data-action='pick-image']").on("click", (event: any) => this._pickImage(event.currentTarget));
      html.find("[data-action='delete-board-item']").on("click", (event: any) => this._delete(event));
    }

    _getItem() {
      const csiCase = getCase(this.caseId);
      const item = csiCase?.[this.collection]?.find((candidate: any) => candidate.id === this.itemId);
      if (item) return item;
      if (!this.isNew) return null;
      return defaultItem(this.collection, "players", this.itemId);
    }

    async _save(event: any) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();

      const form = event.currentTarget;
      const csiCase = getCase(this.caseId);
      if (!csiCase) {
        ui.notifications?.warn(`${moduleTitle}: The case could not be found.`);
        return false;
      }

      const index = csiCase[this.collection].findIndex((item: any) => item.id === this.itemId);
      if (index < 0 && !this.isNew) {
        ui.notifications?.warn(`${moduleTitle}: The item could not be found.`);
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

    async _delete(event: any) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      if (this.isNew) return false;
      const deleted = await deleteBoardItem(this.caseId, this.collection, this.itemId, { confirm: true });
      if (deleted) this.close();
      return false;
    }

    _pickImage(button: any) {
      const field = button.closest(".csi-image-field")?.querySelector("input");
      const Picker = globalThis.FilePicker ?? globalThis.foundry?.applications?.apps?.FilePicker;
      if (!field || !Picker) return;
      new Picker({
        type: "image",
        current: field.value,
        callback: (path: string) => {
          field.value = path;
          field.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }).render(true);
    }
  };
}
