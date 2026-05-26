import { BOUNTY_STATUSES, MODULE_ID, TEMPLATE_ROOT, THREAT_LEVELS } from "./bounty-constants.js";
import { getBounty, normalizeBounty, upsertBounty } from "./bounty-service.js";
import { refreshBountyBoard } from "./bounty-board-app.js";

const ApplicationV2 = foundry.applications?.api?.ApplicationV2 ?? Application;
const HandlebarsApplicationMixin = foundry.applications?.api?.HandlebarsApplicationMixin;
const BaseApplication = HandlebarsApplicationMixin ? HandlebarsApplicationMixin(ApplicationV2) : ApplicationV2;

function getDocuments(collection) {
  return (collection?.contents ?? []).map((document) => ({ id: document.id, name: document.name }));
}

function parseForm(form) {
  const formData = new FormData(form);
  return {
    id: String(formData.get("id") ?? ""),
    title: String(formData.get("title") ?? ""),
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
    claimedBy: String(formData.get("claimedBy") ?? ""),
    linkedJournalId: String(formData.get("linkedJournalId") ?? ""),
    linkedSceneId: ""
  };
}

export class BountyEditorApp extends BaseApplication {
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
      height: "auto"
    },
    classes: ["bounty-editor-window"],
    actions: {
      browseImage: BountyEditorApp.#onBrowseImage
    }
  };

  static PARTS = {
    editor: {
      template: `${TEMPLATE_ROOT}/bounty-editor.hbs`
    }
  };

  constructor({ bountyId = null } = {}) {
    super();
    this.bountyId = bountyId;
  }

  get title() {
    return this.bountyId ? "Edit Bounty" : "Create Bounty";
  }

  async _prepareContext(options) {
    const bounty = this.bountyId ? getBounty(this.bountyId) : normalizeBounty({});
    return {
      bounty: {
        ...bounty,
        tagsText: bounty.tags.join(", ")
      },
      statuses: Object.values(BOUNTY_STATUSES),
      threatLevels: THREAT_LEVELS,
      journals: getDocuments(game.journal),
      canEdit: game.user?.isGM === true
    };
  }

  _onRender(context, options) {
    super._onRender?.(context, options);
    const root = this.element;
    root.querySelector("[name='title']")?.focus();
  }

  static async #onSubmit(event, form, formData) {
    event.preventDefault();
    if (!game.user?.isGM) {
      ui.notifications?.warn?.("Only a GM can edit bounties.");
      return;
    }
    const bounty = await upsertBounty(parseForm(form));
    if (bounty) refreshBountyBoard();
  }

  static #onBrowseImage(event) {
    event.preventDefault();
    const input = this.element.querySelector("[name='image']");
    if (!input) return;
    new FilePicker({
      type: "image",
      current: input.value,
      callback: (path) => {
        input.value = path;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }).browse();
  }
}
