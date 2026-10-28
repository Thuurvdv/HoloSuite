import { updateMissionFields } from "./mission-types";
import { BOUNTY_STATUSES, MODULE_ID, TEMPLATE_ROOT, THREAT_LEVELS } from "./bounty-constants";
import { deleteBounty, getBounty, getMissionTypes, normalizeBounty, upsertBounty } from "./bounty-service";
import { refreshBountyBoard } from "./bounty-board-app";

declare const foundry: any;
declare const Application: any;
declare const game: any;
declare const ui: any;
declare const FilePicker: any;

const ApplicationV2 = foundry.applications?.api?.ApplicationV2 ?? Application;
const HandlebarsApplicationMixin = foundry.applications?.api?.HandlebarsApplicationMixin;
const BaseApplication = HandlebarsApplicationMixin ? HandlebarsApplicationMixin(ApplicationV2) : ApplicationV2;

function getDocuments(collection: any, selectedId = "", missingLabel = "Missing document") {
  const documents = (collection?.contents ?? []).map((document) => ({ id: String(document.id), name: String(document.name ?? document.id) }));
  if (selectedId && !documents.some((document) => document.id === selectedId)) {
    documents.push({ id: selectedId, name: `${missingLabel} (${selectedId})` });
  }
  return documents;
}

function parseForm(form: HTMLFormElement): Record<string, any> {
  const formData = new FormData(form);
  return {
    id: String(formData.get("id") ?? ""),
    contractId: String(formData.get("contractId") ?? ""),
    title: String(formData.get("title") ?? ""),
    missionType: String(formData.get(formData.get("missionTypeChoice") === "" ? "missionTypeName" : "missionTypeChoice") ?? "Bounty"),
    objective: String(formData.get("objective") ?? ""),
    cargo: String(formData.get("cargo") ?? ""),
    pickup: String(formData.get("pickup") ?? ""),
    destination: String(formData.get("destination") ?? ""),
    deadline: String(formData.get("deadline") ?? ""),
    region: String(formData.get("region") ?? ""),
    hazards: String(formData.get("hazards") ?? ""),
    targetName: String(formData.get("targetName") ?? ""),
    description: String(formData.get("description") ?? ""),
    longDescription: String(formData.get("longDescription") ?? ""),
    rewardAmount: Number(formData.get("rewardAmount") ?? 0),
    rewardCurrency: String(formData.get("rewardCurrency") ?? ""),
    threatLevel: String(formData.get("threatLevel") ?? ""),
    faction: String(formData.get("faction") ?? ""),
    location: String(formData.get("location") ?? ""),
    tags: String(formData.get("tags") ?? ""),
    status: String(formData.get("status") ?? BOUNTY_STATUSES.AVAILABLE),
    image: String(formData.get("image") ?? ""),
    published: formData.get("published") === "on",
    linkedJournalId: String(formData.get("linkedJournalId") ?? ""),
    sceneId: String(formData.get("sceneId") ?? "")
  };
}

export class BountyEditorApp extends BaseApplication {
  bountyId: string | null;

  static DEFAULT_OPTIONS = {
    id: "bounty-editor-app",
    tag: "form",
    form: {
      handler: BountyEditorApp.#onSubmit,
      submitOnChange: false,
      closeOnSubmit: true
    },
    window: {
      title: "Bounty Contract",
      icon: "fa-solid fa-file-signature",
      resizable: true
    },
    position: {
      width: 660,
      height: 720
    },
    classes: ["bounty-editor-window"],
    actions: {
      browseImage: BountyEditorApp.#onBrowseImage,
      deleteContract: BountyEditorApp.#onDelete
    }
  };

  static PARTS = {
    editor: {
      template: `${TEMPLATE_ROOT}/bounty-editor.hbs`
    }
  };

  constructor({ bountyId = null }: { bountyId?: string | null } = {}) {
    super();
    this.bountyId = bountyId;
  }

  get title() {
    return this.bountyId ? "Edit Contract" : "Create Contract";
  }

  async _prepareContext(options: any) {
    const bounty = this.bountyId ? getBounty(this.bountyId) : normalizeBounty({});
    return {
      bounty: {
        ...bounty,
        tagsText: bounty.tags.join(", ")
      },
      missionTypes: getMissionTypes(),
      statuses: Object.values(BOUNTY_STATUSES),
      threatLevels: THREAT_LEVELS,
      journals: getDocuments(game.journal, bounty.linkedJournalId, "Missing journal"),
      scenes: getDocuments(game.scenes, bounty.sceneId, "Missing scene"),
      canEdit: game.user?.isGM === true,
      canDelete: Boolean(this.bountyId)
    };
  }

  _onRender(context: any, options: any) {
    super._onRender?.(context, options);
    const root = this.element;
    updateMissionFields(root);
    root.querySelector("[name='missionTypeChoice']")?.addEventListener("change", () => updateMissionFields(root));
    root.querySelector("[name='missionTypeName']")?.addEventListener("input", () => updateMissionFields(root));
    root.querySelector("[name='title']")?.focus();
  }

  static async #onSubmit(event: Event, form: HTMLFormElement, formData: any) {
    event.preventDefault();
    if (!game.user?.isGM) {
      ui.notifications?.warn?.("Only a GM can edit bounties.");
      return;
    }
    const bounty = await upsertBounty(parseForm(form));
    if (bounty) await refreshBountyBoard(bounty);
  }

  static #onBrowseImage(event: Event) {
    event.preventDefault();
    const input = this.element.querySelector("[name='image']");
    if (!input) return;
    new FilePicker({
      type: "image",
      current: input.value,
      callback: (path: string) => {
        input.value = path;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }).browse();
  }

  static async #onDelete(this: BountyEditorApp) {
    if (!game.user?.isGM || !this.bountyId) return;
    if (await deleteBounty(this.bountyId)) {
      await refreshBountyBoard();
      await this.close();
    }
  }
}
