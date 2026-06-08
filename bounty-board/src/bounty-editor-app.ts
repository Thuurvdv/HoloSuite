import { BOUNTY_STATUSES, MODULE_ID, TEMPLATE_ROOT, THREAT_LEVELS } from "./bounty-constants";
import { getBounty, normalizeBounty, upsertBounty } from "./bounty-service";
import { refreshBountyBoard } from "./bounty-board-app";

declare const foundry: any;
declare const Application: any;
declare const game: any;
declare const ui: any;
declare const FilePicker: any;

const ApplicationV2 = foundry.applications?.api?.ApplicationV2 ?? Application;
const HandlebarsApplicationMixin = foundry.applications?.api?.HandlebarsApplicationMixin;
const BaseApplication = HandlebarsApplicationMixin ? HandlebarsApplicationMixin(ApplicationV2) : ApplicationV2;

function getDocuments(collection: any) {
  return (collection?.contents ?? []).map((document) => ({ id: document.id, name: document.name }));
}

function parseForm(form: HTMLFormElement): Record<string, any> {
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
    linkedJournalId: String(formData.get("linkedJournalId") ?? "")
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

  constructor({ bountyId = null }: { bountyId?: string | null } = {}) {
    super();
    this.bountyId = bountyId;
  }

  get title() {
    return this.bountyId ? "Edit Bounty" : "Create Bounty";
  }

  async _prepareContext(options: any) {
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

  _onRender(context: any, options: any) {
    super._onRender?.(context, options);
    const root = this.element;
    root.querySelector("[name='title']")?.focus();
  }

  static async #onSubmit(event: Event, form: HTMLFormElement, formData: any) {
    event.preventDefault();
    if (!game.user?.isGM) {
      ui.notifications?.warn?.("Only a GM can edit bounties.");
      return;
    }
    const bounty = await upsertBounty(parseForm(form));
    if (bounty) refreshBountyBoard();
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
}
