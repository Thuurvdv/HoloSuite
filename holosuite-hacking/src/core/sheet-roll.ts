import { actorIsOwnedByUser, escapeHtml, getSkillData, getSkillLabel } from "./actor-skills";

declare const game: any;
declare const Hooks: any;
declare const ui: any;

export type SheetRollCandidate = { id: string; messageId: string; rollIndex: number; total: number; label: string };

function getMessageRolls(message: any): any[] {
  const rolls = Array.isArray(message.rolls) ? message.rolls : [];
  if (rolls.length) return rolls;
  // RED v12 posts HTML-only cards, without ChatMessage.rolls or roll flags.
  // Read only its known final-result element, never arbitrary numbers in chat.
  // A template keeps the card inert; no scripts or image loads are executed.
  if (game.system?.id !== "cyberpunk-red-core" || typeof message.content !== "string") return [];
  const template = document.createElement("template");
  template.innerHTML = message.content;
  return [...template.content.querySelectorAll('.rollcard .d10-rollcard-data .d10-number-div [data-action="toggleVisibility"][data-visible-element="d10-data-details"]')]
    .flatMap(element => {
      const text = element.textContent?.trim() ?? "";
      if (!/^[+-]?\d+(?:\.\d+)?$/.test(text)) return [];
      const total = Number(text);
      return Number.isFinite(total) ? [{ total, formula: "Final result" }] : [];
    });
}

export function getSheetRollCandidates(message: any, actor: any): SheetRollCandidate[] {
  const author = message?.author?.id ?? message?.user?.id ?? message?.user;
  if (!game.user?.id || author !== game.user.id || !message?.id) return [];
  if (message.visible === false || message.isContentVisible === false || (message.blind && !game.user.isGM)) return [];
  const speaker = message.speaker ?? {};
  const speakerActor = speaker.actor?.id ?? speaker.actor;
  if (actor && speakerActor && speakerActor !== actor.id) return [];
  if (actor?.isToken && speaker.token && speaker.token !== actor.token?.id) return [];
  if (actor?.isToken && speaker.scene && actor.token?.parent?.id && speaker.scene !== actor.token.parent.id) return [];
  const rolls = getMessageRolls(message);
  const flavor = String(message.flavor || "Sheet roll").replace(/<[^>]*>/g, "").slice(0, 100);
  return rolls.flatMap((roll, index) => {
    if (roll?._evaluated === false || roll?.evaluated === false || typeof roll?.total !== "number" || !Number.isFinite(roll.total)) return [];
    return [{ id: `${message.id}:${index}`, messageId: message.id, rollIndex: index, total: roll.total,
      label: `${flavor} — ${String(roll.formula ?? "Roll").slice(0, 80)} = ${roll.total}${speaker.actor ? "" : " (actor not specified)"}` }];
  });
}

export function watchSheetRolls(actor: any, onChange: (candidates: SheetRollCandidate[]) => void) {
  const messages = new Map<string, any>();
  let disposed = false;
  const candidates = () => [...messages.values()].flatMap(message => getSheetRollCandidates(message, actor));
  const changed = () => { if (!disposed) onChange(candidates()); };
  const create = (message: any) => {
    if (disposed) return;
    const author = message?.author?.id ?? message?.user?.id ?? message?.user;
    if (author !== game.user?.id || !message?.id) return;
    messages.set(message.id, message);
    if (messages.size > 50) messages.delete(messages.keys().next().value);
    changed();
  };
  const update = (message: any) => {
    if (!disposed && messages.has(message.id)) { messages.set(message.id, message); changed(); }
  };
  const remove = (message: any) => { if (messages.delete(message.id)) changed(); };
  const hooks = [["createChatMessage", create], ["updateChatMessage", update], ["deleteChatMessage", remove]] as const;
  for (const [name, callback] of hooks) Hooks.on(name, callback);
  return {
    candidates,
    dispose() {
      disposed = true;
      for (const [name, callback] of hooks) Hooks.off(name, callback);
      messages.clear();
    }
  };
}

export function confirmSheetRoll(total: unknown, candidate?: SheetRollCandidate) {
  const value = candidate?.total ?? (typeof total === "string" && total.trim() ? Number(total) : typeof total === "number" ? total : NaN);
  if (!Number.isFinite(value)) throw new Error("Enter the final total shown by your system.");
  return { total: value, naturalRoll: null, systemOutcome: undefined,
    sheetMessageId: candidate?.messageId, sheetRollIndex: candidate?.rollIndex, roll: null };
}

let pendingSheetRoll = false;

export function rollFromCharacterSheet(actor: any, options: any = {}): Promise<ReturnType<typeof confirmSheetRoll> | null> {
  if (!actor) throw new Error("Choose a hacker character before using Roll from character sheet.");
  const canRoll = () => game.user?.isGM || actorIsOwnedByUser(actor, game.user);
  if (!canRoll()) throw new Error("You must own the hacker character to use its sheet roll.");
  if (pendingSheetRoll) throw new Error("Finish or cancel the pending character-sheet roll first.");
  pendingSheetRoll = true;
  return new Promise(resolve => {
    let settled = false;
    let notice: HTMLElement;
    let watcher: ReturnType<typeof watchSheetRolls>;
    const roots = new Map<string, Set<HTMLElement>>();
    const generation = Number(game.release?.generation ?? String(game.version ?? "12").split(".")[0]);
    const renderHook = generation >= 13 ? "renderChatMessageHTML" : "renderChatMessage";
    const clearButtons = (root: HTMLElement) => root.querySelectorAll(".hh-chat-roll-actions").forEach(node => node.remove());
    const finish = (result: ReturnType<typeof confirmSheetRoll> | null) => {
      if (settled) return;
      settled = true;
      watcher?.dispose();
      Hooks.off(renderHook, render);
      for (const set of roots.values()) for (const root of set) clearButtons(root);
      roots.clear();
      notice?.remove();
      pendingSheetRoll = false;
      resolve(result);
    };
    const useResult = (id: string) => {
      if (settled) return;
      if (!canRoll()) { finish(null); return; }
      // Re-read the current message, including privacy and updated totals.
      const candidate = watcher.candidates().find(choice => choice.id === id);
      if (!candidate) { sync(); ui.notifications?.warn?.("That roll is no longer available. Use a new, visible roll."); return; }
      finish(confirmSheetRoll(undefined, candidate));
    };
    const decorate = (root: HTMLElement, choices: SheetRollCandidate[]) => {
      clearButtons(root);
      if (settled || !choices.length) return;
      const actions = document.createElement("div");
      actions.className = "hh-chat-roll-actions";
      for (const choice of choices) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = `Use for hacking · ${choice.total}${choices.length > 1 ? ` (roll ${choice.rollIndex + 1})` : ""}`;
        button.setAttribute("aria-label", `Use for hacking: ${choice.label}`);
        button.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); useResult(choice.id); });
        actions.appendChild(button);
      }
      (root.querySelector(".message-content") ?? root).appendChild(actions);
    };
    const sync = () => {
      if (settled || !watcher) return;
      const choices = watcher.candidates();
      for (const [id, set] of roots) for (const root of set) decorate(root, choices.filter(choice => choice.messageId === id));
    };
    const render = (message: any, html: any) => {
      if (settled || !message?.id) return;
      const root = (html?.[0] ?? html) as HTMLElement;
      if (!root?.querySelectorAll) return;
      // Foundry can render before createChatMessage fires, and may render the
      // same card in the main chat and a popout. Keep both until creation/update.
      if (!roots.has(message.id)) roots.set(message.id, new Set());
      const set = roots.get(message.id);
      for (const old of set) if (!old.isConnected) { clearButtons(old); set.delete(old); }
      set.add(root);
      if (roots.size > 100) {
        const oldest = roots.keys().next().value;
        for (const old of roots.get(oldest)) clearButtons(old);
        roots.delete(oldest);
      }
      decorate(root, watcher?.candidates().filter(choice => choice.messageId === message.id) ?? []);
    };
    const openSheet = async () => {
      try {
        if (typeof actor.sheet?.render !== "function") throw new Error();
        await actor.sheet.render(true);
      } catch { ui.notifications?.warn?.("Open your character sheet manually, then roll and click Use for hacking in chat."); }
    };
    try {
      watcher = watchSheetRolls(actor, sync);
      Hooks.on(renderHook, render);
      const skill = getSkillData(actor, options.skillId);
      const skillName = options.skillLabel || (skill ? getSkillLabel(options.skillId, skill) : "the requested skill");
      notice = document.createElement("section");
      notice.className = "hh-sheet-waiting";
      notice.setAttribute("aria-label", "Pending hacking check");
      notice.innerHTML = `<p role="status"><strong>${escapeHtml(actor.name)} · Hacking check</strong><br>Roll ${escapeHtml(skillName)} on your sheet, then click <strong>Use for hacking</strong> on your new chat roll.</p>
        <p class="hh-sheet-hint">DC ${Number(options.dc ?? 15)} · ${options.rollDirection === "low" ? "Low" : "High"} rolls are positive. Use the final skill-check total.</p>
        <div class="hh-sheet-waiting-actions"><button type="button" data-open-sheet>Open sheet</button><button type="button" data-cancel-sheet>Cancel hack</button></div>
        <details><summary>Can't use your chat roll?</summary><p>For cards without a readable result, enter the final total or number of successes. No modifiers are added.</p>
          <form><label>Final total<input type="number" name="sheetTotal" step="any" required></label><button type="submit">Use for hacking</button></form>
        </details>`;
      notice.querySelector("[data-open-sheet]").addEventListener("click", openSheet);
      notice.querySelector("[data-cancel-sheet]").addEventListener("click", () => finish(null));
      notice.querySelector("form").addEventListener("submit", event => {
        event.preventDefault();
        if (settled) return;
        if (!canRoll()) { finish(null); return; }
        const input = notice.querySelector<HTMLInputElement>("[name='sheetTotal']");
        if (input.reportValidity()) finish(confirmSheetRoll(input.value));
      });
      document.body.appendChild(notice);
      ui.sidebar?.activateTab?.("chat");
      void openSheet();
    } catch (error) {
      finish(null);
      ui.notifications?.warn?.(`Could not start the sheet-roll check: ${error.message}`);
    }
  });
}
