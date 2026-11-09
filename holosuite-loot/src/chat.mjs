import { MODULE_ID } from "./model.mjs";

const escape = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);

export async function postQuantityRoll({ roll, itemName, quantity }) {
  const { game } = globalThis;
  const flavor = game.i18n.format("HL.QuantityRollChat", { item: escape(itemName), quantity });
  const options = game.release?.generation >= 14 ? { messageMode: "self" } : { rollMode: "selfroll" };
  await roll.toMessage({ flavor }, options);
}

export async function postPickupRoll(entry, adapter) {
  const { game, foundry, ChatMessage } = globalThis;
  const result = entry.claim.quantityRoll;
  const item = adapter.preview ? adapter.preview(entry) : entry.data;
  const Roll = foundry?.dice?.Roll ?? globalThis.Roll;
  const roll = Roll.fromData(result.roll);
  const flavor = game.i18n.format("HL.PickupRollChat", { item: escape(item.name), quantity: result.quantity });
  const message = await roll.toMessage({ flavor }, { create: false });
  await ChatMessage.create({ ...message, whisper: [entry.claim.userId], blind: false });
}

/** Runs on the authority only, after the transfer is durably committed. */
export async function postLootChat({ token, actor, entry, adapter }) {
  const { game, ChatMessage } = globalThis;
  if (!game.settings.get(MODULE_ID, "chatLog")) return;
  const item = adapter.preview ? adapter.preview(entry) : entry.data;
  const text = game.i18n.format("HL.ChatLooted", {
    actor: escape(actor.name), source: escape(token.name), item: escape(item.name),
    quantity: escape(entry.wholeItem ? 1 : entry.currency?.amount ?? item.system?.quantity ?? 1)
  });
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `<p>${text}</p>`,
    whisper: [], blind: false,
    flags: { [MODULE_ID]: { claimId: entry.claim.id, userId: entry.claim.userId } }
  });
}
