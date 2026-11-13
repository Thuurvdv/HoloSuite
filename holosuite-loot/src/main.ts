import { MODULE_ID, BUILD_VERSION, eligible, LootError, resolveCharacter } from "./model.mjs";
import { getAdapter, registerAdapter } from "./adapters.mjs";
import { LootTransactions } from "./transactions.mjs";
import { loadState, rollLootQuantity, saveState, summary } from "./persistence";
import { authority, DEFAULT_LOOT_RANGE, environment, isAuthority, lootRange, LOOT_RANGE_SETTING } from "./permissions";
import { startTransport, requestLoot } from "./transport";
import { LootPanel, LootConfig, report, t } from "./ui";
import { LootMarkers } from "./markers";
import { postLootChat, postPickupRoll } from "./chat.mjs";
import { RULE_SETTING } from "./rules.mjs";
declare const Hooks: any;
declare const game: any;
declare const canvas: any;
declare const foundry: any;
declare const ui: any;

const panels = new Map<string, LootPanel>();
let markers: LootMarkers | null = null;
let started = false;
let openAttempt = 0;
const adapter = () => getAdapter(game.system.id);
const lootEnvironment = () => environment(adapter());
const configurable = (token: any) => token?.actor && (adapter().manual ? !!token.actor.items : token.actor.type === "npc");
const defaultRecipient = (user: any, system: any, token: any) =>
  resolveCharacter(user, game.actors.contents, game.scenes.get(user.viewedScene)?.tokens, system, token);
const transactions = new LootTransactions({
  moduleId: MODULE_ID, authority: isAuthority, environment: lootEnvironment, adapter,
  token: async (uuid: string) => {
    if (!/^Scene\.[^.]+\.Token\.[^.]+$/.test(uuid)) throw new LootError("InvalidRequest");
    const resolve = foundry.utils.fromUuid ?? (globalThis as any).fromUuid;
    const doc = await resolve(uuid);
    return doc?.documentName === "Token" ? doc : null;
  },
  actor: (id: string) => game.actors.get(id) ?? (foundry.utils.fromUuid ?? (globalThis as any).fromUuid)(id),
  id: () => foundry.utils.randomID(),
  destination: (request: any, user: any, token: any) => {
    if (game.settings.get(MODULE_ID, "characterSelector")) return request.actorId ? transactions.io.actor(request.actorId) : null;
    return defaultRecipient(user, adapter(), token);
  },
  load: loadState, save: saveState, summary, collected: postLootChat,
  rollQuantity: rollLootQuantity, quantityRolled: postPickupRoll
});
const send = (request: any) => requestLoot(request, transactions);

function canOffer(token: any) {
  return started && eligible(token, lootEnvironment())
    && (game.user.isGM || (!token.hidden && token.object?.isVisible));
}
async function open(token: any) {
  token = token?.document ?? token;
  const system = adapter();
  if (!system) { report(new LootError("Unsupported")); return; }
  if (game.user.isGM) return configure(token);
  if (!canOffer(token)) { report(new LootError("Unavailable")); return; }
  const attempt = ++openAttempt;
  let initialData;
  if (lootRange() > 0 && (!panels.has(token.uuid) || panels.get(token.uuid)?.disposed)) {
    try {
      initialData = await send({ action: "view", tokenUuid: token.uuid });
    } catch (error) {
      if (attempt === openAttempt && canvas.scene?.id === token.parent?.id) report(error);
      return;
    }
    if (attempt !== openAttempt || canvas.scene?.id !== token.parent?.id) return;
  }
  for (const [uuid, other] of panels) {
    if (uuid !== token.uuid && !other.disposed) await other.close();
  }
  if (attempt !== openAttempt) return;
  let panel = panels.get(token.uuid);
  if (!panel || panel.disposed) {
    panel = new LootPanel(token, send, system); panels.set(token.uuid, panel);
    await panel.show(initialData);
    if (initialData !== undefined) return;
  }
  if (panel.disposed) return;
  await panel.refresh();
}
async function configure(token: any) {
  if (!game.user.isGM || !adapter()) return;
  if (token?.parent?.documentName !== "Scene" || !configurable(token)) { ui.notifications.info(t("SelectToken")); return; }
  try { new LootConfig(token, adapter(), transactions.queue).render(true); }
  catch (error) { report(error); }
}
function refresh(uuid: string) {
  const panel = panels.get(uuid);
  if (panel && !panel.disposed) void panel.refresh();
}
function initialize(token: any) {
  if (!started || !isAuthority() || adapter().manual || token.getFlag(MODULE_ID, "state") || !eligible(token, lootEnvironment())) return;
  void transactions.queue.run(token.uuid, async () => {
    if (isAuthority() && eligible(token, lootEnvironment()) && !token.getFlag(MODULE_ID, "state")) await loadState(token, adapter());
  }).catch((error: any) => console.warn("HoloSuite Loot | Snapshot initialization failed", token.uuid, error));
}
function scanScene() {
  for (const token of canvas.scene?.tokens ?? []) initialize(token);
  markers?.refreshScene();
}
function selectedToken() {
  const candidates = [...new Set([...canvas.tokens.controlled, ...game.user.targets])];
  if (candidates.length !== 1) { ui.notifications.info(t("SelectToken")); return; }
  const token: any = candidates[0];
  if (game.user.isGM) void configure(token.document);
  else void open(token.document);
}
function register() {
  const core = game.modules.get("holosuite-core")?.api ?? game.holosuite;
  if (!core?.registerApp) return false;
  core.registerApp({ id: MODULE_ID, title: t("Title"), icon: "fa-solid fa-box-open", playerVisible: false,
    premium: false, description: t("SelectToken"), open: selectedToken });
  return true;
}

let canvasElement: HTMLElement | null;
let hovered: any;
let pointerToken = "";
let pointerTime = 0;
function contextLoot(event: MouseEvent) {
  // Native HUD permission checks exclude non-owned NPCs. Observe the browser
  // gesture in capture phase and hit-test visible tokens independently of HUD ownership.
  // Do not cancel the event or change native GM controls.
  if (game.user.isGM || !started || (event.type === "pointerdown" && event.button !== 2)) return;
  const rect = canvasElement?.getBoundingClientRect();
  const screen = canvas.app?.renderer?.screen;
  if (!rect?.width || !rect.height || !screen || !canvas.stage) return;
  const point = canvas.stage.worldTransform.applyInverse({
    x: (event.clientX - rect.left) * screen.width / rect.width,
    y: (event.clientY - rect.top) * screen.height / rect.height
  });
  const contains = (token: any) => token?.isVisible && (token.bounds?.contains(point.x, point.y)
    ?? (point.x >= token.document.x && point.y >= token.document.y
      && point.x <= token.document.x + token.w && point.y <= token.document.y + token.h));
  const target = contains(hovered) ? hovered : [...canvas.tokens.placeables].reverse().find(contains);
  const token = target?.document;
  if (!canOffer(token)) {
    for (const panel of panels.values()) if (!panel.disposed) void panel.close();
    return;
  }
  if (event.type === "contextmenu" && pointerToken === token.uuid && Date.now() - pointerTime < 1000) return;
  if (event.type === "pointerdown") { pointerToken = token.uuid; pointerTime = Date.now(); }
  const panel = panels.get(token.uuid);
  if (panel && !panel.disposed) void panel.close();
  else void open(token);
}
function bindCanvas() {
  markers?.destroy();
  markers = started ? new LootMarkers(token => eligible(token, lootEnvironment())) : null;
  canvasElement?.removeEventListener("contextmenu", contextLoot, true);
  canvasElement?.removeEventListener("pointerdown", contextLoot, true);
  canvasElement = canvas.app?.canvas ?? canvas.app?.view;
  canvasElement?.addEventListener("contextmenu", contextLoot, true);
  canvasElement?.addEventListener("pointerdown", contextLoot, true);
}

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, RULE_SETTING, { scope: "world", config: false, type: Object, default: {} });
  game.settings.register(MODULE_ID, "zeroHP", {
    name: "HL.ZeroHP", hint: "HL.ZeroHPHint", scope: "world", config: true, type: Boolean, default: true,
    onChange: () => { scanScene(); for (const uuid of panels.keys()) refresh(uuid); }
  });
  game.settings.register(MODULE_ID, "hideGmLootButton", {
    name: "HL.HideGmLootButton", hint: "HL.HideGmLootButtonHint", scope: "world", config: true, type: Boolean, default: false
  });
  game.settings.register(MODULE_ID, "characterSelector", {
    name: "HL.CharacterSelector", hint: "HL.CharacterSelectorHint", scope: "world", config: true, type: Boolean, default: false
  });
  game.settings.register(MODULE_ID, LOOT_RANGE_SETTING, {
    name: "HL.LootRange", hint: "HL.LootRangeHint", scope: "world", config: true, type: Number, default: DEFAULT_LOOT_RANGE,
    onChange: () => { for (const uuid of panels.keys()) refresh(uuid); }
  });
  game.settings.register(MODULE_ID, "chatLog", {
    name: "HL.ChatLog", hint: "HL.ChatLogHint", scope: "world", config: true, type: Boolean, default: false
  });
  game.settings.register(MODULE_ID, "panelTheme", {
    name: "HL.PanelTheme", hint: "HL.PanelThemeHint", scope: "world", config: true, type: String, default: "holo",
    choices: { holo: "HL.ThemeHolo", neutral: "HL.ThemeNeutral", fantasy: "HL.ThemeFantasy" },
    onChange: () => { for (const panel of panels.values()) if (!panel.disposed) panel.render(false); }
  });
});
Hooks.once("ready", async () => {
  if (!game.modules.get("holosuite-core")?.active) { ui.notifications.error(t("CoreMissing")); return; }
  try { await startTransport(transactions, refresh); }
  catch (error) { report(error); return; }
  started = true;
  game.modules.get(MODULE_ID).api = { version: BUILD_VERSION, open, configure, registerAdapter,
    // Requests still pass every authority and permission check, including calls from macros.
    request: send, authority: () => authority()?.id };
  register(); setTimeout(register, 500);
  bindCanvas();
  scanScene();
  console.info(`HoloSuite Loot | ${BUILD_VERSION} ready; Foundry ${game.version}, ${game.system.id} ${game.system.version}`);
});
Hooks.on("canvasReady", () => { bindCanvas(); scanScene(); });
Hooks.on("hoverToken", (token: any, hover: boolean) => { if (hover) hovered = token; else if (hovered === token) hovered = null; });
Hooks.on("canvasTearDown", () => {
  markers?.destroy(); markers = null;
  hovered = null; canvasElement?.removeEventListener("contextmenu", contextLoot, true);
  canvasElement?.removeEventListener("pointerdown", contextLoot, true); canvasElement = null;
  for (const panel of panels.values()) void panel.close(); panels.clear();
});
Hooks.on("renderTokenHUD", (hud: any, html: any) => {
  if (!started) return;
  const token = hud.object?.document;
  if (!configurable(token)) return;
  const root: HTMLElement = html instanceof HTMLElement ? html : html[0];
  const column = root.querySelector(".col.right") ?? root;
  root.querySelectorAll(".hl-token-action").forEach(element => element.remove());
  const add = (label: string, icon: string, action: () => void) => {
    const button = document.createElement("button"); button.type = "button";
    button.className = "control-icon hl-token-action"; button.title = label; button.setAttribute("aria-label", label);
    const glyph = document.createElement("i"); glyph.className = icon; button.append(glyph);
    button.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); action(); });
    column.append(button);
  };
  if (game.user.isGM) {
    if (adapter() && !game.settings.get(MODULE_ID, "hideGmLootButton")) add(t("Loot"), "fa-solid fa-box-open", () => void configure(token));
  }
  else if (canOffer(token)) add(t("Loot"), "fa-solid fa-box-open", () => void open(token));
});
Hooks.on("renderTokenConfig", (app: any, html: any) => {
  if (!started || !game.user.isGM || !adapter()) return;
  const token = app.document ?? app.object;
  if (token?.parent?.documentName !== "Scene" || !configurable(token)) return;
  const root: HTMLElement = html instanceof HTMLElement ? html : html[0];
  if (root.querySelector(".hl-token-config")) return;
  const button = document.createElement("button"); button.type = "button"; button.className = "hl-token-config";
  button.textContent = t("Configure"); button.addEventListener("click", () => configure(token));
  (root.querySelector('[data-tab="character"]') ?? root.querySelector("form") ?? root).append(button);
});
Hooks.on("drawToken", (token: any) => markers?.refresh(token));
Hooks.on("refreshToken", (token: any, flags: any) => {
  if (!flags || flags.refreshSize || flags.refreshShape) markers?.refresh(token);
});
Hooks.on("destroyToken", (token: any) => markers?.remove(token));
Hooks.on("updateToken", (token: any, changes: any) => {
  initialize(token); markers?.refresh(token.object); refresh(token.uuid);
  if (!panels.size || !lootRange() || token.parent?.id !== canvas.scene?.id
    || !token.actor || !adapter()?.destination(token.actor) || !token.actor.testUserPermission(game.user, "OWNER")
    || !["x", "y", "elevation", "width", "height", "hidden"].some(key => key in changes)) return;
  for (const uuid of panels.keys()) if (uuid !== token.uuid) refresh(uuid);
});
Hooks.on("createToken", initialize);
Hooks.on("createCombatant", scanScene);
Hooks.on("updateCombatant", scanScene);
Hooks.on("deleteCombatant", scanScene);
Hooks.on("updateCombat", scanScene);
Hooks.on("deleteCombat", scanScene);
Hooks.on("updateActor", scanScene);
Hooks.on("createActiveEffect", scanScene);
Hooks.on("updateActiveEffect", scanScene);
Hooks.on("deleteActiveEffect", scanScene);
Hooks.on("userConnected", scanScene);
Hooks.on("deleteToken", (token: any) => {
  void panels.get(token.uuid)?.close(); panels.delete(token.uuid);
  if (!isAuthority()) return;
  // Vaults are token-owned backing data; token deletion is their lifetime boundary.
  for (const journal of game.journal.contents) {
    if (journal.getFlag(MODULE_ID, "tokenUuid") === token.uuid) void journal.delete().catch(console.warn);
  }
});
