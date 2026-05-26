import { MODULE_ID, STATUS_LABELS, TEMPLATE_ROOT } from "./bounty-constants.js";

function normalizeForChat(bounty = {}) {
  const amount = Number(bounty.rewardAmount ?? 0);
  const currency = bounty.rewardCurrency || "credits";
  return {
    ...bounty,
    title: String(bounty.title ?? "Untitled Bounty"),
    targetName: String(bounty.targetName ?? ""),
    threatLevel: String(bounty.threatLevel ?? "Moderate"),
    faction: String(bounty.faction ?? ""),
    status: String(bounty.status ?? "available"),
    rewardLabel: `${Number.isFinite(amount) ? amount.toLocaleString() : "0"} ${currency}`,
    statusLabel: STATUS_LABELS[bounty.status] ?? "Available"
  };
}

export async function postBountyChatCard(bounty, mode = "published") {
  const normalized = normalizeForChat(bounty);
  const content = await renderTemplate(`${TEMPLATE_ROOT}/bounty-chat-card.hbs`, {
    bounty: normalized,
    mode,
    isResult: mode === "result",
    isPublished: mode === "published"
  });

  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: "Bounty Board" }),
    content,
    flags: {
      [MODULE_ID]: {
        bountyId: normalized.id,
        mode
      }
    }
  });
}
