import { createHoloSuiteSocket } from "../../shared/src/index";
import { MODULE_ID, BUILD_VERSION, REQUEST_FLAG, RESPONSE_FLAG, LootError, SerialQueue, authenticatedRequest, validLootRequest } from "./model.mjs";
import { authority, isAuthority } from "./permissions";
declare const game: any;
declare const Hooks: any;
declare const foundry: any;

const socket = createHoloSuiteSocket(MODULE_ID, { title: "HoloSuite Loot" });
const pending = new Map<string, any>();
const requests = new SerialQueue();

export async function startTransport(transactions: any, onRefresh: (uuid: string) => void) {
  game.socket.on(socket.socketName, (message: any) => {
    if (message?.type === "refresh" && typeof message.tokenUuid === "string") onRefresh(message.tokenUuid);
  });
  Hooks.on("updateUser", (user: any, change: any, _options: any, userId: string) => {
    if (user.id === game.user.id && change.flags?.[MODULE_ID]?.[RESPONSE_FLAG]) {
      let response: any;
      try { response = JSON.parse(user.getFlag(MODULE_ID, RESPONSE_FLAG)); } catch { return; }
      const waiting = pending.get(response?.id);
      // Foundry's document-operation sender authenticates the reply. A claimed
      // GM user ID in a module socket is never enough to authorize anything.
      if (waiting && waiting.gm === userId && game.users.get(userId)?.isGM) {
        clearTimeout(waiting.timer); pending.delete(response.id);
        response.result.error ? waiting.reject(new LootError(response.result.error)) : waiting.resolve(structuredClone(response.result));
      }
    }
    const request = authenticatedRequest(user, change, userId, REQUEST_FLAG);
    if (!request || !isAuthority()) return;
    if (typeof request.id !== "string" || !/^[\w-]{1,64}$/.test(request.id)) return;
    void requests.run(user.id, async () => {
      if (!isAuthority()) return;
      let result;
      try {
        if (!validLootRequest(request)) throw new LootError("InvalidRequest");
        result = await transactions.execute(request, user);
      }
      catch (error) { console.warn("HoloSuite Loot | Request failed", error); result = { error: error.code ?? "TransferFailed" }; }
      // A string replaces the previous result completely, rather than merging
      // a previous failure's error field into a later successful response.
      await user.setFlag(MODULE_ID, RESPONSE_FLAG, JSON.stringify({ id: request.id, result }));
      if (validLootRequest(request) && ["take", "all"].includes(request.action)) socket.emit({ type: "refresh", tokenUuid: request.tokenUuid });
    }).catch((error: any) => console.warn("HoloSuite Loot | Could not deliver reply", error));
  });
  if (game.user.isGM) await game.user.setFlag(MODULE_ID, "transportVersion", BUILD_VERSION);
}
export async function requestLoot(request: any, transactions?: any) {
  if (!validLootRequest(request)) throw new LootError("InvalidRequest");
  const gm = authority();
  if (!gm) throw new LootError(game.users.contents.some((user: any) => user.active && user.isGM) ? "BuildMismatch" : "NoGM");
  if (gm.id === game.user.id && transactions) return transactions.execute(request, game.user);
  const id = foundry.utils.randomID();
  return new Promise<any>((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(id); reject(new LootError("Timeout")); }, request.action === "view" ? 8000 : 20000);
    pending.set(id, { resolve, reject, timer, gm: gm.id });
    game.user.setFlag(MODULE_ID, REQUEST_FLAG, { ...request, id }).catch((error: any) => {
      clearTimeout(timer); pending.delete(id); reject(error);
    });
  });
}
