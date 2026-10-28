import { MODULE_ID, SETTING_BOUNTIES, SETTING_BOARD_VISIBLE_TO_PLAYERS, TEMPLATE_ROOT } from "./bounty-constants";
import { getBounty, getRewardLabel, getStatusLabel, isBoardVisibleToPlayers, isBountyVisibleToPlayers } from "./bounty-service";
import { missionPresentation } from "./mission-types";

declare const foundry: any;
declare const Application: any;
declare const game: any;
declare const ui: any;
declare const Hooks: any;
declare const ChatMessage: any;
declare const renderTemplate: any;

const ApplicationV2 = foundry.applications?.api?.ApplicationV2 ?? Application;
const mixin = foundry.applications?.api?.HandlebarsApplicationMixin;
const BaseApplication = mixin ? mixin(ApplicationV2) : ApplicationV2;
const handouts = new Map<string, BountyHandoutApp>();

/** Only public presentation fields may enter the handout context. */
export function getHandoutData(id: string, { forPlayers = false } = {}) {
  if (typeof id !== "string" || !id) return null;
  const bounty = getBounty(id);
  if (!bounty) return null;
  const shareable = isBoardVisibleToPlayers() && isBountyVisibleToPlayers(bounty);
  if ((forPlayers || !game.user?.isGM) && !shareable) return null;
  const mission = missionPresentation(bounty);
  return {
    id: bounty.id,
    contractId: bounty.contractId,
    title: bounty.title,
    image: bounty.image,
    notesPublic: bounty.notesPublic,
    faction: bounty.faction,
    location: bounty.location,
    tags: [...bounty.tags],
    claimedBy: bounty.status === "claimed" ? bounty.claimedBy : "",
    status: bounty.status,
    statusLabel: getStatusLabel(bounty.status),
    rewardLabel: getRewardLabel(bounty),
    threatLevel: bounty.threatLevel,
    ...mission,
    shareable
  };
}

export class BountyHandoutApp extends BaseApplication {
  declare element: HTMLElement;
  bountyId: string;
  _tagObserver?: ResizeObserver;
  _fitOnRender = true;
  _fitFrame?: number;

  static DEFAULT_OPTIONS = {
    tag: "section",
    classes: ["bounty-handout-window"],
    window: { title: "BOUNTYBOARD.Handout.Title", icon: "fa-solid fa-file-lines", resizable: true, minimizable: false },
    position: { width: 600, height: 720 },
    actions: { showHandout: BountyHandoutApp.#onShow, closeHandout: BountyHandoutApp.#onClose }
  };

  static PARTS = { handout: { template: `${TEMPLATE_ROOT}/bounty-handout.hbs` } };

  constructor(bountyId: string) {
    super({ id: `bounty-handout-${foundry.utils.randomID()}` });
    this.bountyId = bountyId;
  }

  async _prepareContext() {
    const bounty = getHandoutData(this.bountyId);
    const tags = bounty?.tags.slice(0, 6) ?? [];
    const tagCallouts = tags.map((label, index) => {
      const side = index % 2 === 0 ? "left" : "right";
      const count = side === "left" ? Math.ceil(tags.length / 2) : Math.floor(tags.length / 2);
      const slot = Math.floor(index / 2);
      return { label, side, row: count === 1 ? 1 : count === 2 ? slot * 2 : slot };
    });
    return {
      bounty,
      tagCallouts,
      isGM: game.user?.isGM === true,
      canShare: game.user?.isGM === true && bounty?.shareable
    };
  }

  _onRender(context: any, options: any) {
    super._onRender?.(context, options);
    if (this._fitOnRender) {
      this._fitOnRender = false;
      if (this._fitFrame !== undefined) cancelAnimationFrame(this._fitFrame);
      // Foundry positions the frame during rendering. Measure after layout so
      // the opening height includes the full content and the inset controls.
      this._fitFrame = requestAnimationFrame(async () => {
        this._fitFrame = undefined;
        // The display face can wrap differently from its fallback on first open.
        await document.fonts.load('48px "Keania One"').catch(() => {});
        if (this.rendered) this.fitToContent();
      });
    }
    this._tagObserver?.disconnect();
    const stage = this.element.querySelector<HTMLElement>(".bb-handout-portrait-stage");
    const portrait = stage?.querySelector<HTMLElement>(".bb-handout-portrait");
    const connectors = stage?.querySelector<SVGSVGElement>(".bb-handout-tag-lines");
    if (stage && portrait && connectors) {
      const updateLines = () => {
        const bounds = stage.getBoundingClientRect();
        const ring = portrait.getBoundingClientRect();
        if (!bounds.width || !ring.width) return;
        connectors.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
        const cx = ring.left - bounds.left + ring.width / 2;
        const cy = ring.top - bounds.top + ring.height / 2;
        const radius = ring.width / 2 - 2;
        connectors.querySelectorAll<SVGPathElement>("path").forEach(path => {
          const row = Number(path.dataset.row);
          const direction = path.dataset.side === "left" ? -1 : 1;
          const dy = (row - 1) * radius * .52;
          const startX = cx + direction * Math.sqrt(radius * radius - dy * dy);
          const startY = cy + dy;
          const endY = bounds.height * (.14 + row * .36) + 10;
          const endX = direction === -1 ? 2 : bounds.width - 2;
          const elbowX = startX + direction * Math.min(18, bounds.width * .035);
          path.setAttribute("d", `M${startX},${startY} L${elbowX},${endY} L${endX},${endY}`);
        });
      };
      this._tagObserver = new ResizeObserver(updateLines);
      this._tagObserver.observe(stage);
      updateLines();
    }
    const handle = this.element.querySelector<HTMLElement>(".bb-handout-drag-handle");
    handle?.addEventListener("pointerdown", (event: PointerEvent) => {
      if (event.button !== 0) return;
      event.preventDefault();
      const { left, top } = this.position;
      const startX = event.clientX;
      const startY = event.clientY;
      handle.setPointerCapture(event.pointerId);
      const move = (next: PointerEvent) => {
        if (next.pointerId === event.pointerId) this.setPosition({ left: left + next.clientX - startX, top: top + next.clientY - startY });
      };
      const stop = () => {
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("lostpointercapture", stop);
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("lostpointercapture", stop);
    });
    const image = this.element.querySelector<HTMLImageElement>(".bb-handout-portrait > img");
    if (!image) return;
    const showFallback = () => {
      image.hidden = true;
      const fallback = this.element.querySelector<HTMLElement>(".bb-handout-fallback");
      if (fallback) fallback.hidden = false;
    };
    image.addEventListener("error", showFallback, { once: true });
    if (image.complete && !image.naturalWidth) showFallback();
  }

  static async #onShow(this: BountyHandoutApp) {
    await showBountyHandout(this.bountyId);
  }

  fitToContent() {
    if (!this.rendered) return;
    const scroll = this.element.querySelector<HTMLElement>(".bb-handout-scroll");
    if (!scroll) return;
    const bounds = scroll.getBoundingClientRect();
    const contentBottom = Math.max(0, ...Array.from(scroll.children).map((child: HTMLElement) => {
      if (!child.getClientRects().length) return 0;
      return child.getBoundingClientRect().bottom - bounds.top + scroll.scrollTop + (parseFloat(getComputedStyle(child).marginBottom) || 0);
    }));
    const padding = parseFloat(getComputedStyle(scroll).paddingBottom) || 0;
    const chrome = this.element.offsetHeight - scroll.clientHeight;
    const height = Math.min(window.innerHeight - 32, Math.ceil(contentBottom + padding + chrome + 3));
    this.setPosition({ height, top: Math.max(16, Math.min(this.position.top, window.innerHeight - height - 16)) });
  }

  static async #onClose(this: BountyHandoutApp) {
    await this.close();
  }

  async close(options: any = {}) {
    if (this._fitFrame !== undefined) cancelAnimationFrame(this._fitFrame);
    this._tagObserver?.disconnect();
    if (handouts.get(this.bountyId) === this) handouts.delete(this.bountyId);
    return super.close(options);
  }
}

export function openBountyHandout(id: string) {
  if (!getHandoutData(id)) {
    ui.notifications?.warn?.(game.i18n.localize("BOUNTYBOARD.Handout.Unavailable"));
    return false;
  }
  let app = handouts.get(id);
  if (!app) {
    app = new BountyHandoutApp(id);
    handouts.set(id, app);
  }
  app._fitOnRender = true;
  app.render({ force: true });
  if (app.rendered) app.bringToFront?.();
  return app;
}

export async function showBountyHandout(id: string) {
  if (!game.user?.isGM) return false;
  if (!getHandoutData(id, { forPlayers: true })) {
    ui.notifications?.warn?.(game.i18n.localize("BOUNTYBOARD.Handout.PublishFirst"));
    return false;
  }
  // Store a reference, never a snapshot of the full contract or GM-only fields.
  const content = await renderTemplate(`${TEMPLATE_ROOT}/bounty-handout-chat.hbs`, { bountyId: id });
  if (!getHandoutData(id, { forPlayers: true })) return false;
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: "Bounty Board" }),
    content,
    flags: { [MODULE_ID]: { bountyId: id, mode: "handout" } }
  });
}

export async function refreshBountyHandouts() {
  await Promise.all([...handouts.entries()].map(async ([id, app]) => {
    if (!getHandoutData(id)) await app.close();
    else await app.render({ force: true });
  }));
}

export function handleHandoutPresentation(message: any) {
  const flags = message.flags?.[MODULE_ID];
  const author = message.author ?? message.user;
  if (flags?.mode !== "handout" || author?.isGM !== true || message.visible === false || message.isContentVisible === false) return;
  // This hook handles new messages only; loading chat history never presents again.
  if (getHandoutData(flags.bountyId, { forPlayers: true })) openBountyHandout(flags.bountyId);
}

export function registerHandoutHooks() {
  const bindChat = (message: any, html: any) => {
    if (!message.flags?.[MODULE_ID]?.bountyId) return;
    const root = html?.[0] ?? html;
    root?.querySelectorAll?.("[data-bb-open-handout]").forEach((button: HTMLButtonElement) => {
      if (button.dataset.bbBound) return;
      button.dataset.bbBound = "true";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        openBountyHandout(message.flags[MODULE_ID].bountyId);
      });
    });
  };
  Hooks.on("renderChatMessage", bindChat);
  Hooks.on("renderChatMessageHTML", bindChat);
  Hooks.on("createChatMessage", handleHandoutPresentation);
  Hooks.on("updateSetting", (setting: any) => {
    if ([`${MODULE_ID}.${SETTING_BOUNTIES}`, `${MODULE_ID}.${SETTING_BOARD_VISIBLE_TO_PLAYERS}`].includes(setting.key)) {
      void refreshBountyHandouts();
    }
  });
}
