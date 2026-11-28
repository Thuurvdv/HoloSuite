declare const game: any;
declare const foundry: any;

export type GloryDiceRoll = { data: object; userId: string };

const POOL_SCALE = [1, .78, .65, .5];

function poolScale(roll: any) {
  let count = 0;
  for (const die of roll.dice) {
    const visible = die.results.filter((result: { hidden?: boolean }) => !result.hidden).length;
    // Percentile and larger decimal dice use one physical die per digit in Dice So Nice.
    const bodies = [100, 1000, 10000].includes(die.faces) ? Math.log10(die.faces) : 1;
    count += visible * bodies;
  }
  return POOL_SCALE[Math.min(POOL_SCALE.length - 1, Math.floor((Math.max(1, count) - 1) / 5))];
}

export function showGloryDice(arena: HTMLElement, savedRoll: GloryDiceRoll) {
  const dice = game.dice3d;
  const box = dice?.box;
  const canvas = dice?.canvas instanceof HTMLElement ? dice.canvas : dice?.canvas?.[0];
  const margins = box?.display?.containerMarginPx ?? box?.display?.containerMargin;
  const roller = game.users?.get(savedRoll.userId);
  if (!dice?.isEnabled?.() || !dice.showForRoll || !box?.updateBoundaries || !margins || !roller
    || !(canvas instanceof HTMLElement) || !canvas.isConnected || !canvas.parentNode || box.rolling
    || (box.diceList ?? box.throwEngine?.diceList)?.length || (box.deadDiceList ?? box.throwEngine?.deadDiceList)?.length
    || box.persistentDiceList?.length) return;

  const Roll = foundry.dice?.Roll ?? (globalThis as any).Roll;
  if (!Roll?.fromData) return;
  const width = canvas.clientWidth || parseFloat(canvas.style.width);
  const height = canvas.clientHeight || parseFloat(canvas.style.height);
  const bounds = arena.getBoundingClientRect();
  const diameter = Math.min(bounds.width, bounds.height);
  // Dice So Nice uses rectangular physics walls. Fit them inside the visible circle.
  const square = Math.min(diameter / Math.SQRT2 - 12, width, height);
  if (!(square >= 80)) return;

  let roll: any;
  try { roll = Roll.fromData(savedRoll.data); }
  catch (error) { console.warn("Glory Roll | Could not read the Dice So Nice roll.", error); return; }

  const originalMargins = { ...margins };
  const scaleConfig = box.diceScene?.config ?? box.config;
  const originalScale = scaleConfig && Number.isFinite(scaleConfig.scale) && typeof box.updateScale === "function"
    ? { scale: scaleConfig.scale, autoscale: scaleConfig.autoscale } : null;
  // Match the v6 arena size on the full canvas. v5 applies the same percentage to the smaller inner area.
  const userScale = originalScale?.autoscale ? 75 : originalScale?.scale ?? 75;
  const areaRatio = Math.hypot(square, square) / Math.hypot(width, height);
  const reducedScale = Math.min(34, userScale * .5) * areaRatio;
  const arenaScale = (userScale + reducedScale) / 2 * poolScale(roll);
  const originalParent = canvas.parentNode;
  const nextSibling = canvas.nextSibling;
  const previousStyles = ["left", "top", "clip-path", "visibility"].map(name =>
    [name, canvas.style.getPropertyValue(name), canvas.style.getPropertyPriority(name)] as const);
  const restore = () => {
    for (const [name, value, priority] of previousStyles) canvas.style.setProperty(name, value, priority);
    canvas.classList.remove("hcci-glory-dice-canvas");
    if (canvas.isConnected && canvas.parentNode !== originalParent && originalParent.isConnected) {
      originalParent.insertBefore(canvas, nextSibling?.parentNode === originalParent ? nextSibling : null);
    }
    if (game.dice3d?.box === box) {
      try {
        box.updateBoundaries({ margin: originalMargins });
        if (originalScale) box.updateScale(originalScale.scale, originalScale.autoscale);
      }
      catch (error) { console.warn("Glory Roll | Could not restore the Dice So Nice boundaries.", error); }
    }
  };

  let displayed = false;
  let complete = false;
  let released = false;
  const finished = Promise.resolve().then(async () => {
    if (released) return false;
    if (originalParent !== document.body) document.body.append(canvas);
    canvas.classList.add("hcci-glory-dice-canvas");
    canvas.style.left = `${bounds.left + (bounds.width - width) / 2}px`;
    canvas.style.top = `${bounds.top + (bounds.height - height) / 2}px`;
    canvas.style.clipPath = `circle(${diameter / 2 - 3}px at 50% 50%)`;
    box.updateBoundaries({ margin: {
      left: (width - square) / 2, right: (width - square) / 2,
      top: (height - square) / 2, bottom: (height - square) / 2
    } });
    if (originalScale) {
      box.updateScale(arenaScale, false);
      if (!box.display.containerMarginPx && Number.isFinite(box.display.scale) && box.dicefactory?.setScale) {
        // The v5 percentage slider caps at 100, so normalize the resulting mesh scale directly.
        box.display.scale /= areaRatio;
        box.dicefactory.setScale(box.display.scale);
      }
    }
    displayed = await dice.showForRoll(roll, roller, false, null, false) !== false;
    return displayed;
  }).catch(error => {
    console.warn("Glory Roll | Dice So Nice could not present the roll.", error);
    return false;
  }).finally(() => { complete = true; });

  return {
    finished,
    get complete() { return complete; },
    release() {
      if (released) return;
      released = true;
      if (displayed && game.dice3d?.box === box && !box.rolling && box.clearAll) {
        canvas.style.visibility = "hidden";
        void Promise.resolve().then(() => box.clearAll()).catch(error =>
          console.warn("Glory Roll | Could not clear the arena dice.", error)).finally(restore);
      } else restore();
    }
  };
}
