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
