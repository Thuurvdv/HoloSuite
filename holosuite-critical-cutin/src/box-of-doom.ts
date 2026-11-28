import { MODULE_ID, SETTINGS, getDieSides, lowRollsAreGood, setting, setSetting } from "./settings";
import { showGloryDice, type GloryDiceRoll } from "./glory-roll-dice";

declare const game: any;
declare const foundry: any;
declare const ui: any;

export const BOX_FLAG = "boxOfDoom";
const STATE = "boxOfDoomState";
const ROLL_REQUEST = "gloryRollRequest";
const OPEN_MS = 850;
const DICE_WAIT_MS = 7000;
const DICE_GRACE_MS = 2600;
const HOLD_MS = 5200;
const CHAT_DELAY_MS = 500;

type Box = {
  id: string;
  stakes: string;
  target: number | null;
  low: boolean;
  rollerId?: string;
} & ({ formula: string; sides?: never } | { formula?: undefined; sides: number })
  & ({ phase: "sealed" } | { phase: "opening"; dice?: GloryDiceRoll } | { phase: "revealed"; total: number; expires: number });

let busy = false;
let configuring = false;
let requesting = false;
let overlay: HTMLElement | undefined;
let expiry: ReturnType<typeof setTimeout> | undefined;
let arenaDice: ReturnType<typeof showGloryDice>;
let arenaDiceId: string | undefined;
let waitingForLocalReveal = false;

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

function assignedRollerId(box: Box) {
  return box.rollerId ?? activeGM() ?? (game.user?.isGM ? game.user.id : undefined);
}

function targetLabel(box: Box) {
  return box.target === null ? "" : `Target ${box.low ? "≤" : "≥"} ${box.target}`;
}

function rollFormula(box: Box) {
  return box.formula ?? `1d${box.sides}`;
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

function rollBreakdown(roll: any, formula: string) {
  const dice = [...new Set<any>(roll.dice ?? [])].filter(die => typeof die.expression === "string" && Number.isFinite(die.total));
  if (!dice.length) return formula;
  const diceLabel = (die: any) => `${die.expression}(${die.total})`;
  const terms = roll.terms ?? [];
  if (dice.every(die => terms.includes(die)) && terms.every(term => typeof term.expression === "string")) {
    return terms.map(term => dice.includes(term) ? diceLabel(term) : term.expression.trim()).join("");
  }
  return `${formula} [${dice.map(diceLabel).join(", ")}]`;
}

function renderOutcomeEffect(root: HTMLElement, result: string) {
  if (!result || root.dataset.animate !== "true") return;
  const effect = document.createElement("div");
  effect.className = `hcci-glory-effect hcci-glory-effect-${result}`;
  effect.setAttribute("aria-hidden", "true");
  if (result === "success") {
    for (const [edge, side] of ["top", "right", "bottom", "left"].entries()) {
      for (let index = 0; index < 12; index++) {
        const seed = edge * 12 + index;
        const spark = document.createElement("i");
        const along = 28 + (seed * 17) % 40;
        const drift = (seed * 23) % 39 - 19;
        const direction = edge === 1 || edge === 2 ? -1 : 1;
        const fromSide = edge % 2 === 1;
        spark.dataset.edge = side;
        spark.style.setProperty("--glory-spawn", `${5 + ((index + .5) / 12) * 90}%`);
        spark.style.setProperty("--glory-x", `${fromSide ? direction * along : drift}vw`);
        spark.style.setProperty("--glory-y", `${fromSide ? drift : direction * along}vh`);
        spark.style.setProperty("--glory-spin", `${direction * (130 + (seed * 83) % 540)}deg`);
        spark.style.setProperty("--glory-delay", `${(seed * 37) % 235}ms`);
        spark.style.setProperty("--glory-duration", `${820 + (seed * 53) % 490}ms`);
        spark.style.setProperty("--glory-size", `${4 + (seed * 5) % 8}px`);
        effect.append(spark);
      }
    }
  }
  root.prepend(effect);
}

export function renderGloryRoll() {
  clearTimeout(expiry);
  const box = currentBox();
  const isGM = game.user?.isGM === true;
  const control = canControl();
  const rollerId = box ? assignedRollerId(box) : undefined;
  const isRoller = Boolean(rollerId && rollerId === game.user?.id);
  const canRoll = isRoller && box?.phase === "sealed";
  const interactive = control || canRoll;
  const hidden = !isGM && !isRoller && setting(SETTINGS.suppressCutins) === true;
  if (!hidden && box?.phase === "revealed" && arenaDiceId === box.id && arenaDice && !arenaDice.complete) {
    if (!waitingForLocalReveal) {
      waitingForLocalReveal = true;
      const presentation = arenaDice;
      void waitForDice(presentation.finished).then(() => {
        if (arenaDice !== presentation) return;
        releaseArenaDice();
        renderGloryRoll();
      });
    }
    return;
  }
  if (hidden || box?.phase !== "opening" || (arenaDiceId && arenaDiceId !== box.id)) {
    releaseArenaDice();
  }
  if (!box || hidden) {
    overlay?.remove();
    overlay = undefined;
    return;
  }
  const dice = box.phase === "opening" ? box.dice : undefined;
  const stateKey = `${box.id}:${box.phase}:${control}:${canRoll}:${requesting}:${box.phase !== "revealed" && busy}:${Boolean(dice)}`;
  if (overlay?.dataset.state === stateKey) {
    if (box.phase === "revealed") {
      const close = overlay.querySelector<HTMLButtonElement>(".hcci-glory-controls button");
      if (close) close.disabled = busy;
      expiry = setTimeout(renderGloryRoll, Math.max(1, box.expires - Date.now()));
    }
    return;
  }

  const previous = overlay;
  const moveFocus = interactive && (!previous || previous.contains(document.activeElement));
  previous?.remove();
  const root = document.createElement("section");
  root.className = "hcci-glory";
  root.dataset.holosuiteBranding = `${MODULE_ID}-glory-roll`;
  root.dataset.state = stateKey;
  root.dataset.phase = box.phase;
  root.dataset.animate = String(previous?.dataset.boxId !== box.id || previous.dataset.phase !== box.phase);
  root.dataset.boxId = box.id;
  root.dataset.control = String(interactive);
  const motion = String(setting(SETTINGS.motionMode) ?? "system");
  root.dataset.motion = motion;
  if (box.phase === "revealed") root.dataset.outcome = outcome(box).toLowerCase();
  root.setAttribute("aria-label", "Glory Roll");
  root.innerHTML = `
    <div class="hcci-glory-stage">
      <header class="hcci-glory-heading">
        <h2>Glory Roll</h2>
        <p class="hcci-glory-stakes"></p>
        <p class="hcci-glory-target"></p>
      </header>
      <div class="hcci-glory-arena">
        <div class="hcci-glory-status" role="status" aria-live="polite" aria-atomic="true"></div>
      </div>
      <div class="hcci-glory-controls"></div>
    </div>`;
  root.querySelector(".hcci-glory-stakes")!.textContent = box.stakes;
  root.querySelector(".hcci-glory-target")!.textContent = [rollFormula(box), targetLabel(box)].filter(Boolean).join(" · ");
  const status = root.querySelector(".hcci-glory-status")!;
  if (box.phase === "revealed") {
    renderOutcomeEffect(root, root.dataset.outcome!);
    const result = status.appendChild(document.createElement("strong"));
    result.textContent = String(box.total);
    const label = status.appendChild(document.createElement("span"));
    label.textContent = outcome(box) || "Result";
    expiry = setTimeout(renderGloryRoll, Math.max(1, box.expires - Date.now()));
  } else {
    const roller = rollerId ? game.users?.get(rollerId) : null;
    status.textContent = box.phase === "sealed" ? roller ? `Ready for ${roller.name}` : "Ready" : "Rolling…";
  }

  const addButton = (label: string, action: () => Promise<void>, disabled = false) => {
    const button = root.querySelector(".hcci-glory-controls")!.appendChild(document.createElement("button"));
    button.type = "button";
    button.disabled = disabled;
    button.textContent = label;
    button.addEventListener("click", () => void action().catch(reportError));
  };
  if (canRoll) addButton("Roll & Reveal", () => requestGloryRoll(box.id), busy || requesting);
  if (control && !busy && box.phase !== "revealed") addButton("Cancel", () => cancelGloryRoll(box.id));
  if (control && box.phase === "revealed") addButton("Close", () => cancelGloryRoll(box.id), busy);

  overlay = root;
  document.body.append(root);
  if (dice && arenaDiceId !== box.id) {
    arenaDiceId = box.id;
    if (motion !== "reduced" && motion !== "still" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const presentation = showGloryDice(root.querySelector<HTMLElement>(".hcci-glory-arena")!, dice);
      arenaDice = presentation;
      void presentation?.finished.then(displayed => {
        if (!displayed && arenaDice === presentation && overlay) delete overlay.dataset.diceActive;
      });
    }
  }
  if (arenaDice) root.dataset.diceActive = "true";
  Hooks.callAll("holosuite-core.renderBranding", root);
  if (moveFocus) {
    root.tabIndex = -1;
    (root.querySelector<HTMLButtonElement>("button:not(:disabled)") ?? root).focus({ preventScroll: true });
  }
}

async function requestGloryRoll(id: string) {
  const box = currentBox();
  if (requesting || box?.id !== id || box.phase !== "sealed" || assignedRollerId(box) !== game.user?.id) return;
  if (canControl()) return rollGloryDie(id);

  requesting = true;
  renderGloryRoll();
  try {
    // User document updates carry Foundry's authenticated author ID to the GM.
    await game.user.setFlag(MODULE_ID, ROLL_REQUEST, `${id}:${foundry.utils.randomID()}`);
  } finally {
    requesting = false;
    renderGloryRoll();
  }
}

function reportError(error: unknown) {
  console.error(`${MODULE_ID} | Glory Roll`, error);
  ui.notifications?.error("Glory Roll failed. See the browser console for details.");
}

async function cancelGloryRoll(id: string) {
  if (!canControl() || busy || currentBox()?.id !== id) return;
  busy = true;
  renderGloryRoll();
  try {
    await setSetting(STATE, {});
  } finally {
    busy = false;
    renderGloryRoll();
  }
}

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

function releaseArenaDice() {
  arenaDice?.release();
  arenaDice = undefined;
  arenaDiceId = undefined;
  waitingForLocalReveal = false;
}

function waitForDice(finished: Promise<boolean>) {
  let timer: ReturnType<typeof setTimeout>;
  const cutoff = new Promise<boolean>(resolve => { timer = setTimeout(() => resolve(false), DICE_WAIT_MS); });
  return Promise.race([finished, cutoff]).finally(() => clearTimeout(timer));
}

async function rollGloryDie(id: string) {
  const box = currentBox();
  if (!canControl() || busy || box?.id !== id || box.phase !== "sealed") return;
  busy = true;
  renderGloryRoll();
  try {
    const Roll = foundry.dice?.Roll ?? (globalThis as any).Roll;
    const rollerId = assignedRollerId(box) ?? game.user.id;
    const roll = await new Roll(rollFormula(box)).evaluate({ allowInteractive: false });
    const total = roll.total;
    if (!Number.isFinite(total)) throw new Error("Unexpected roll total.");
    const dice: GloryDiceRoll | undefined = game.modules?.get("dice-so-nice")?.active && typeof roll.toJSON === "function"
      ? { data: roll.toJSON(), userId: rollerId } : undefined;
    await setSetting(STATE, { ...box, phase: "opening", ...(dice && { dice }) });
    if (dice) {
      renderGloryRoll();
      if (arenaDice) {
        const [displayed] = await Promise.all([waitForDice(arenaDice.finished), wait(OPEN_MS)]);
        if (!displayed && arenaDice?.complete) await wait(DICE_GRACE_MS - OPEN_MS);
      } else await wait(DICE_GRACE_MS);
    } else await wait(OPEN_MS);
    const pending = currentBox();
    if (pending?.id !== id || pending.phase !== "opening") return;
    const revealed: Box = { ...box, phase: "revealed", total, expires: Date.now() + HOLD_MS };
    await setSetting(STATE, revealed);
    await wait(CHAT_DELAY_MS);
    const ChatMessage = (globalThis as any).CONFIG?.ChatMessage?.documentClass
      ?? foundry.documents?.ChatMessage ?? (globalThis as any).ChatMessage;
    const roller = game.users?.get(rollerId);
    const speaker = !roller || rollerId === game.user.id ? ChatMessage.getSpeaker()
      : roller.character ? ChatMessage.getSpeaker({ actor: roller.character, alias: roller.name }) : { alias: roller.name };
    const details = [`${rollBreakdown(roll, rollFormula(box))}: ${total}`, targetLabel(box), outcome(revealed)].filter(Boolean).join(" · ");
    await ChatMessage.create({
      speaker,
      content: `<h3>Glory Roll</h3>${box.stakes ? `<p>${htmlText(box.stakes)}</p>` : ""}<p><strong>${htmlText(details)}</strong></p>`,
      whisper: [],
      blind: false,
      flags: { [MODULE_ID]: { [BOX_FLAG]: id } }
    });
  } catch (error) {
    // Let the GM retry a failed roll. Keep a revealed result visible if chat fails.
    const pending = currentBox();
    if (canControl() && pending?.phase === "opening" && pending.id === id) await setSetting(STATE, box);
    throw error;
  } finally {
    busy = false;
    renderGloryRoll();
  }
}

export async function openGloryRoll() {
  if (!canControl()) {
    if (game.user?.isGM) ui.notifications?.warn("The active GM controls Glory Roll.");
    return;
  }
  if (busy || configuring || currentBox()) return;
  configuring = true;
  try {
    const DialogV2 = foundry.applications.api.DialogV2;
    const low = lowRollsAreGood();
    const rollerOptions = [{ id: game.user.id, label: `GM (${game.user.name})` },
      ...Array.from<any>(game.users ?? []).filter(user => !user.isGM).map(user => ({
        id: user.id, label: `${user.name}${user.active ? "" : " (offline)"}`
      }))].map(({ id, label }) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = label;
      return option.outerHTML;
    }).join("");
    const selection = await DialogV2.prompt({
      window: { title: "Glory Roll" },
      modal: true,
      rejectClose: false,
      content: `<div class="hcci-glory-form" data-holosuite-branding="${MODULE_ID}-glory-roll">
        <label>Roller<select name="rollerId">${rollerOptions}</select></label>
        <label>What’s at stake?<input name="stakes" type="text" maxlength="180" placeholder="Optional"></label>
        <label>Roll formula<input name="formula" type="text" value="1d${getDieSides()}" placeholder="2d6 + 3" autocomplete="off" spellcheck="false" required></label>
        <label>Success target (${low ? "roll at or below" : "roll at or above"})<input name="target" type="number" step="any" placeholder="Optional"></label>
      </div>`,
      ok: {
        label: "Show Arena to Table",
        callback: (_event: Event, button: HTMLButtonElement) => {
          const form = new FormData(button.form!);
          const target = form.get("target");
          return { rollerId: String(form.get("rollerId") ?? ""), stakes: String(form.get("stakes") ?? "").trim(), formula: String(form.get("formula") ?? "").trim(),
            target: target === "" || target == null ? null : Number(target) };
        }
      }
    });
    if (!selection || !canControl() || currentBox()) return;
    const roller = game.users?.get(selection.rollerId);
    if (selection.rollerId !== game.user.id && (!roller || roller.isGM)) return;
    const Roll = foundry.dice?.Roll ?? (globalThis as any).Roll;
    try {
      if (!selection.formula || new Roll(selection.formula).isDeterministic === true) throw new Error("A die is required.");
    } catch {
      ui.notifications?.warn("Enter a valid dice formula, such as 2d6 + 3.");
      return;
    }
    if (selection.target !== null && !Number.isFinite(selection.target)) {
      ui.notifications?.warn("Enter a numeric success target, or leave it blank.");
      return;
    }
    await setSetting(STATE, { ...selection, id: foundry.utils.randomID(), phase: "sealed", low });
  } catch (error) {
    reportError(error);
  } finally {
    configuring = false;
  }
}

export function registerGloryRoll() {
  game.settings.register(MODULE_ID, STATE, {
    scope: "world", config: false, type: Object, default: {},
    onChange: renderGloryRoll
  });
  Hooks.on("updateUser", (user, changes, _options, authorId) => {
    const request = changes.flags?.[MODULE_ID]?.[ROLL_REQUEST];
    const box = currentBox();
    if (box?.phase !== "sealed" || typeof request !== "string" || !request.startsWith(`${box.id}:`) || !canControl()) return;
    if (authorId !== user.id || assignedRollerId(box) !== user.id) return;
    void rollGloryDie(box.id).catch(reportError);
  });
}
