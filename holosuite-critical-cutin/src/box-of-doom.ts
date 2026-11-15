import { getDieOptions } from "../../shared/src/dice-checks";
import { MODULE_ID, SETTINGS, getDieSides, lowRollsAreGood, setting, setSetting } from "./settings";

declare const game: any;
declare const foundry: any;
declare const ui: any;

export const BOX_FLAG = "boxOfDoom";
const STATE = "boxOfDoomState";
const OPEN_MS = 850;
const HOLD_MS = 5200;
const CHAT_DELAY_MS = 500;

type Box = {
  id: string;
  stakes: string;
  sides: number;
  target: number | null;
  low: boolean;
} & ({ phase: "sealed" | "opening" } | { phase: "revealed"; total: number; expires: number });

let busy = false;
let configuring = false;
let overlay: HTMLElement | undefined;
let expiry: ReturnType<typeof setTimeout> | undefined;

function activeGM() {
  const gms = Array.from<any>(game.users ?? []).filter(user => user.isGM && user.active);
  return gms.sort((a, b) => a.id.localeCompare(b.id))[0]?.id;
}

function canControl() {
  return game.user?.isGM && (activeGM() ?? game.user.id) === game.user.id;
}

function currentBox(): Box | undefined {
  const box = setting(STATE) as Box | undefined;
  return box?.id && (box.phase !== "revealed" || box.expires > Date.now()) ? box : undefined;
}

function targetLabel(box: Box) {
  return box.target === null ? "" : `Target ${box.low ? "≤" : "≥"} ${box.target}`;
}

function outcome(box: Extract<Box, { phase: "revealed" }>) {
  if (box.target === null) return "";
  return (box.low ? box.total <= box.target : box.total >= box.target) ? "Success" : "Failure";
}

function htmlText(value: string) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

export function renderBoxOfDoom() {
  clearTimeout(expiry);
  const box = currentBox();
  const isGM = game.user?.isGM === true;
  const control = canControl();
  const hidden = !isGM && setting(SETTINGS.suppressCutins) === true;
  if (!box || hidden) {
    overlay?.remove();
    overlay = undefined;
    return;
  }
  const stateKey = `${box.id}:${box.phase}:${control}:${busy}`;
  if (overlay?.dataset.state === stateKey) {
    if (box.phase === "revealed") expiry = setTimeout(renderBoxOfDoom, Math.max(1, box.expires - Date.now()));
    return;
  }

  const previous = overlay;
  const moveFocus = control && (!previous || previous.contains(document.activeElement));
  previous?.remove();
  const root = document.createElement("section");
  root.className = "hcci-doom";
  root.dataset.holosuiteBranding = `${MODULE_ID}-box-of-doom`;
  root.dataset.state = stateKey;
  root.dataset.phase = box.phase;
  root.dataset.animate = String(previous?.dataset.boxId !== box.id || previous.dataset.phase !== box.phase);
  root.dataset.boxId = box.id;
  root.dataset.control = String(control);
  root.dataset.motion = String(setting(SETTINGS.motionMode) ?? "system");
  if (box.phase === "revealed") root.dataset.outcome = outcome(box).toLowerCase();
  root.setAttribute("aria-label", "Box of Doom");
  root.innerHTML = `
    <div class="hcci-doom-stage">
      <h2><span data-holosuite-brand-icon></span><span data-holosuite-brand-name>Box of Doom</span></h2>
      <p class="hcci-doom-stakes"></p>
      <p class="hcci-doom-target"></p>
      <div class="hcci-doom-vault" aria-hidden="true">
        <svg viewBox="0 0 400 210" focusable="false">
          <path class="hcci-doom-shell" d="M48 37 84 12h232l36 25 30 33v102l-29 25H47l-29-25V70Z"/>
          <path class="hcci-doom-core" d="M72 74 100 51h200l28 23v62l-28 23H100l-28-23Z"/>
          <g class="hcci-doom-lid">
            <path d="M48 37 84 12h232l36 25 30 33-43 20H61L18 70Z"/>
            <path d="M91 38h218l22 22H69Z"/>
          </g>
          <g class="hcci-doom-base">
            <path d="M18 110h119l18 25h90l18-25h119v62l-29 25H47l-29-25Z"/>
            <path d="M48 145h68l14 22H63Zm236 0h68l-15 22h-67Z"/>
          </g>
          <path class="hcci-doom-lock" d="m200 68 31 18v37l-31 18-31-18V86Z"/>
        </svg>
      </div>
      <div class="hcci-doom-status" role="status" aria-live="polite" aria-atomic="true"></div>
      <div class="hcci-doom-controls"></div>
    </div>`;
  root.querySelector(".hcci-doom-stakes")!.textContent = box.stakes;
  root.querySelector(".hcci-doom-target")!.textContent = [`d${box.sides}`, targetLabel(box)].filter(Boolean).join(" · ");
  const status = root.querySelector(".hcci-doom-status")!;
  if (box.phase === "revealed") {
    const result = status.appendChild(document.createElement("strong"));
    result.textContent = String(box.total);
    const label = status.appendChild(document.createElement("span"));
    label.textContent = outcome(box) || "Result";
    expiry = setTimeout(renderBoxOfDoom, Math.max(1, box.expires - Date.now()));
  } else {
    status.textContent = box.phase === "sealed" ? "Sealed" : "Opening…";
  }

  const addButton = (label: string, action: () => Promise<void>) => {
    const button = root.querySelector(".hcci-doom-controls")!.appendChild(document.createElement("button"));
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", () => void action().catch(reportError));
  };
  if (control && !busy && box.phase === "sealed") addButton("Roll & Reveal", () => rollBox(box.id));
  if (control && !busy && box.phase !== "revealed") addButton("Cancel", () => cancelBox(box.id));
  if (control && !busy && box.phase === "revealed") addButton("Close", () => cancelBox(box.id));

  overlay = root;
  document.body.append(root);
  Hooks.callAll("holosuite-core.renderBranding", root);
  if (moveFocus) {
    root.tabIndex = -1;
    (root.querySelector("button") ?? root).focus({ preventScroll: true });
  }
}

function reportError(error: unknown) {
  console.error(`${MODULE_ID} | Box of Doom`, error);
  ui.notifications?.error("Box of Doom could not complete the action. Check the chat and try again.");
}

async function cancelBox(id: string) {
  if (!canControl() || busy || currentBox()?.id !== id) return;
  busy = true;
  renderBoxOfDoom();
  try {
    await setSetting(STATE, {});
  } finally {
    busy = false;
    renderBoxOfDoom();
  }
}

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

async function rollBox(id: string) {
  const box = currentBox();
  if (!canControl() || busy || box?.id !== id || box.phase !== "sealed") return;
  busy = true;
  renderBoxOfDoom();
  try {
    const Roll = foundry.dice?.Roll ?? (globalThis as any).Roll;
    await setSetting(STATE, { ...box, phase: "opening" });
    const roll = await new Roll(`1d${box.sides}`).evaluate({ allowInteractive: false });
    const total = Number(roll.total);
    if (!Number.isInteger(total) || total < 1 || total > box.sides) throw new Error("Unexpected die result.");
    await wait(OPEN_MS);
    const pending = currentBox();
    if (pending?.id !== id || pending.phase !== "opening") return;
    const revealed: Box = { ...box, phase: "revealed", total, expires: Date.now() + HOLD_MS };
    await setSetting(STATE, revealed);
    await wait(CHAT_DELAY_MS);
    const ChatMessage = foundry.documents?.ChatMessage ?? (globalThis as any).ChatMessage;
    const details = [`d${box.sides}: ${total}`, targetLabel(box), outcome(revealed)].filter(Boolean).join(" · ");
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker(),
      content: `<h3>Box of Doom</h3>${box.stakes ? `<p>${htmlText(box.stakes)}</p>` : ""}<p><strong>${details}</strong></p>`,
      whisper: [],
      blind: false,
      flags: { [MODULE_ID]: { [BOX_FLAG]: id } }
    });
  } catch (error) {
    // A failed roll leaves a sealed box available for retry. Keep a revealed result visible if chat fails.
    const pending = currentBox();
    if (canControl() && pending?.phase === "opening" && pending.id === id) await setSetting(STATE, box);
    throw error;
  } finally {
    busy = false;
    renderBoxOfDoom();
  }
}

export async function openBoxOfDoom() {
  if (!canControl()) {
    if (game.user?.isGM) ui.notifications?.warn("The active GM controls Box of Doom.");
    return;
  }
  if (busy || configuring || currentBox()) return;
  configuring = true;
  try {
    const DialogV2 = foundry.applications.api.DialogV2;
    const options = getDieOptions(getDieSides());
    const low = lowRollsAreGood();
    const selection = await DialogV2.prompt({
      window: { title: "Box of Doom" },
      modal: true,
      rejectClose: false,
      content: `<div class="hcci-doom-form" data-holosuite-branding="${MODULE_ID}-box-of-doom">
        <label>What’s at stake?<input name="stakes" type="text" maxlength="180" placeholder="Optional"></label>
        <label>Die<select name="sides">${options.map(({ value, label, selected }) => `<option value="${value}" ${selected ? "selected" : ""}>${label}</option>`).join("")}</select></label>
        <label>Success target (${low ? "roll at or below" : "roll at or above"})<input name="target" type="number" min="1" max="10000" step="1" placeholder="Optional"></label>
      </div>`,
      ok: {
        label: "Show Box to Table",
        callback: (_event: Event, button: HTMLButtonElement) => {
          const form = new FormData(button.form!);
          const target = form.get("target");
          return { stakes: String(form.get("stakes") ?? "").trim(), sides: Number(form.get("sides")),
            target: target === "" || target == null ? null : Number(target) };
        }
      }
    });
    if (!selection || !canControl() || currentBox()) return;
    if (!options.some(option => option.value === selection.sides)) return;
    if (selection.target !== null && (!Number.isInteger(selection.target) || selection.target < 1 || selection.target > selection.sides)) {
      ui.notifications?.warn(`Choose a target between 1 and ${selection.sides}, or leave it blank.`);
      return;
    }
    await setSetting(STATE, { ...selection, id: foundry.utils.randomID(), phase: "sealed", low });
  } catch (error) {
    reportError(error);
  } finally {
    configuring = false;
  }
}

export function registerBoxOfDoom() {
  game.settings.register(MODULE_ID, STATE, {
    scope: "world", config: false, type: Object, default: {},
    onChange: renderBoxOfDoom
  });
}
