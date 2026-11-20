import { MESSAGE_FLAG_KIND, MODULE_ID } from "./constants";

export const CALL_HISTORY_LIMIT = 100;
const CALL_EVENTS = new Set(["outgoing", "connected", "ended", "missed"]);

function messageFlag(document: any) {
  const source = document?.flags?.[MODULE_ID] ?? document?.getFlag?.(MODULE_ID, "message");
  return source?.kind === MESSAGE_FLAG_KIND ? source : source?.message;
}

export function isCallHistoryEvent(document: any) {
  const flag = messageFlag(document);
  return flag?.kind === MESSAGE_FLAG_KIND && flag.messageType === "event" && CALL_EVENTS.has(flag.eventType);
}

export function getExpiredCallEventIds(documents: any[]) {
  return documents.filter(isCallHistoryEvent)
    .map((document) => ({
      id: document.id,
      time: Date.parse(messageFlag(document)?.createdAt) || Number(document.timestamp) || 0
    }))
    .sort((left, right) => right.time - left.time || String(right.id).localeCompare(String(left.id)))
    .slice(CALL_HISTORY_LIMIT)
    .map((event) => event.id);
}

function isHistoryManager() {
  if (!game.user?.isGM) return false;
  const gm = (game.users?.contents ?? []).filter((user) => user.isGM && user.active)
    .sort((left, right) => left.id.localeCompare(right.id))[0];
  return !gm || gm.id === game.user.id;
}

let pruning: Promise<void> | null = null;
let requested = false;

export function pruneCallHistory(): Promise<void> {
  if (!isHistoryManager()) return Promise.resolve();
  requested = true;
  if (pruning) return pruning;
  pruning = Promise.resolve().then(async () => {
    const Message = game.messages?.documentClass ?? (globalThis as any).ChatMessage;
    if (!Message?.deleteDocuments) return;
    while (requested) {
      requested = false;
      // Foundry animates new chat notifications asynchronously. Let those finish
      // before deleting records, including during bulk creation/imports.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const ids = getExpiredCallEventIds(game.messages?.contents ?? []);
      for (let index = 0; index < ids.length; index += 100) {
        if (!isHistoryManager()) return;
        await Message.deleteDocuments(ids.slice(index, index + 100));
      }
    }
  }).catch((error) => {
    console.warn(`${MODULE_ID} | Could not trim call history. It will be retried on the next call event.`, error);
  }).finally(() => { pruning = null; });
  return pruning;
}
