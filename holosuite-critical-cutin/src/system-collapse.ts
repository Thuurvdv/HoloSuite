export const COLLAPSE_STYLE = "system-collapse";
export const COLLAPSE_EXIT = 420;
/** Sound-design cue points on the uncompressed timeline, in milliseconds. */
export const COLLAPSE_CUES = { fault: 350, freeze: 770, collapse: 880, impact: 1240 } as const;

const ROWS = 12;
// Collapsed rows keep a tenth of their pitch, so the whole portrait ends as a short stack.
const PITCH = .1;
const THIN = .07;
const PHASE = { boot: 170, fault: 350, title: 560, freeze: 770, collapse: 880, impact: 1240, settle: 1400 };
const STEP = "steps(1, end)";
const STRIKE = "cubic-bezier(.14,.82,.2,1)";

// Authored failure script: [time, row, sideways slip in % of the viewport, level of detail lost].
// The gaps are the rhythm: a tick, a fault, silence, then intervals that halve until the freeze.
const FAULTS: [number, number, number, number][] = [
  [250, 4, 1.5, 0], [284, 4, 0, 0],
  [350, 7, -4, 0], [350, 8, 2.5, 0], [350, 2, 0, 1], [384, 8, 0, 0],
  [480, 3, 6, 0], [480, 7, -4, 1], [480, 10, 0, 1],
  [560, 0, -3, 0], [560, 5, 0, 1], [560, 9, 8, 0],
  [620, 2, -7, 2], [620, 6, 0, 1], [620, 11, 3, 0],
  [668, 4, 5, 1], [668, 9, 8, 2], [668, 1, 0, 1], [668, 7, 2, 1],
  [706, 5, -9, 2], [706, 8, 0, 1], [706, 0, -3, 1],
  [734, 10, -5, 2], [734, 3, 6, 1], [734, 11, 3, 1], [734, 1, 4, 1],
  [752, 7, 2, 2], [752, 4, 5, 2], [752, 2, 10, 2], [752, 8, -6, 1]
];
// Rows that briefly drop out to a flat bar: [from, to, row].
const DROPOUTS = [[560, 590, 3], [706, 730, 6], [752, 770, 9]];
// Bands of the live screen behind the cut-in that invert for a few frames: [from, to] per band.
const TEARS = [[[350, 384], [706, 734]], [[620, 668], [752, 770]], [[480, 520]]];
// Frame brackets lose their registration one at a time, then fall once the picture gives way.
const BRACKETS: { drift: [number, string][]; fall: number; exit: string }[] = [
  { drift: [[350, "translate(-.5vw,.4vh)"], [668, "translate(-1.1vw,.2vh) rotate(-3deg)"]], fall: 40, exit: "translate(-4vw,125vh) rotate(-80deg)" },
  { drift: [[560, "translate(.7vw,-.3vh)"], [734, "translate(.9vw,.8vh) rotate(5deg)"]], fall: 150, exit: "translate(5vw,125vh) rotate(95deg)" },
  { drift: [[620, "translate(-.3vw,1vh) rotate(-6deg)"]], fall: 230, exit: "translate(-2vw,60vh) rotate(-50deg)" },
  { drift: [[480, "translate(.4vw,.3vh)"], [706, "translate(1.3vw,.9vh) rotate(8deg)"]], fall: 300, exit: "translate(3vw,60vh) rotate(60deg)" }
];

export function collapseMarkup(detail: string) {
  const tears = detail === "low" ? 0 : detail === "high" ? 3 : 2;
  return `<div class="hcci-col-freeze"></div>
    <div class="hcci-col-tears">${"<i></i>".repeat(tears)}</div>
    <div class="hcci-col-flash"></div>`;
}

/**
 * Renders the mosaic levels with one-off canvas draws; nothing is read back,
 * so artwork from other origins works. Returns false when the image has no pixels yet.
 */
function drawMosaics(image: HTMLImageElement, rows: HTMLElement[]) {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  if (!width || !height) return false;
  try {
    const mip = document.createElement("canvas");
    mip.width = 80;
    mip.height = ROWS * 8;
    const context = mip.getContext("2d");
    if (!context) return false;
    // Same crop as object-fit: cover at 50% 25% inside the 4:5 viewport.
    const cropWidth = Math.min(width, height * .8);
    const cropHeight = Math.min(height, width / .8);
    context.imageSmoothingQuality = "high";
    // Destination-only form: vector artwork without intrinsic pixels ignores source rectangles.
    const scaleX = mip.width / cropWidth;
    const scaleY = mip.height / cropHeight;
    context.drawImage(image, (cropWidth - width) / 2 * scaleX, (cropHeight - height) * .25 * scaleY, width * scaleX, height * scaleY);
    for (const [index, row] of rows.entries()) {
      const [coarse, block] = Array.from(row.querySelectorAll("canvas"));
      coarse.width = 40;
      coarse.height = 4;
      const coarseContext = coarse.getContext("2d")!;
      coarseContext.imageSmoothingQuality = "high";
      coarseContext.drawImage(mip, 0, index * 8, 80, 8, 0, 0, 40, 4);
      block.width = 10;
      block.height = 1;
      const blockContext = block.getContext("2d")!;
      blockContext.imageSmoothingQuality = "high";
      blockContext.drawImage(coarse, 0, 0, 40, 4, 0, 0, 10, 1);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Sizes the stacked title and, for full motion, rebuilds the portrait as twelve rows.
 * Safe to call again after the shared image error handler swaps the artwork.
 */
export function prepareCollapse(overlay: HTMLElement, animated: boolean) {
  const words = (overlay.querySelector(".hcci-title")?.textContent ?? "").trim().split(/\s+/).filter(Boolean);
  overlay.style.setProperty("--col-word", String(Math.max(6, ...words.map(word => word.length))));
  overlay.style.setProperty("--col-lines", String(Math.max(1, words.length)));
  const visual = overlay.querySelector<HTMLElement>(".hcci-visual");
  const portrait = overlay.querySelector<HTMLElement>(".hcci-portrait-frame > .hcci-portrait");
  if (!animated || !visual || !portrait) return;
  visual.querySelectorAll(".hcci-col-backing, .hcci-col-rows, .hcci-col-brackets, .hcci-col-floor, .hcci-col-beam").forEach(node => node.remove());
  overlay.querySelector(".hcci-col-cursor")?.remove();
  const make = (tag: string, name: string) => {
    const node = document.createElement(tag);
    node.className = name;
    return node;
  };
  const rows = make("div", "hcci-col-rows hcci-col-plain");
  const list: HTMLElement[] = [];
  for (let index = 0; index < ROWS; index++) {
    const row = make("div", "hcci-col-row");
    row.style.setProperty("--r", String(index));
    const fall = make("div", "hcci-col-fall");
    const band = make("div", "hcci-col-band");
    const art = portrait.cloneNode(true) as HTMLElement;
    art.classList.remove("hcci-portrait");
    art.classList.add("hcci-col-art");
    band.append(art, make("canvas", "hcci-col-lod"), make("canvas", "hcci-col-lod"), make("i", "hcci-col-dead"));
    fall.append(band);
    row.append(fall);
    rows.append(row);
    list.push(row);
  }
  const brackets = make("div", "hcci-col-brackets");
  brackets.innerHTML = "<i></i><i></i><i></i><i></i>";
  visual.append(make("div", "hcci-col-backing"), rows, brackets, make("div", "hcci-col-floor"), make("div", "hcci-col-beam"));
  const copy = overlay.querySelector(".hcci-copy");
  if (copy?.children.length) copy.append(make("i", "hcci-col-cursor"));
  if (portrait instanceof HTMLImageElement) {
    const draw = () => rows.classList.toggle("hcci-col-plain", !drawMosaics(portrait, list));
    if (portrait.complete) draw();
    portrait.addEventListener("load", draw, { once: true });
  }
}

export function startCollapseIntro(overlay: HTMLElement, holdAt: number) {
  const animations: Animation[] = [];
  if (!overlay.classList.contains("hcci-motion-full") || !overlay.animate) return { animations, audioDelay: 0 };
  const speed = Math.min(1, (holdAt - 100) / PHASE.settle);
  const track = (node: Element | null | undefined, frames: Keyframe[], start: number, end: number, easing = "linear", fill: FillMode = "both") => {
    if (node) animations.push(node.animate(frames, { delay: start * speed, duration: Math.max(1, (end - start) * speed), easing, fill }));
  };
  const find = (selector: string) => overlay.querySelector(selector);
  const all = (selector: string) => Array.from(overlay.querySelectorAll<HTMLElement>(selector));
  // Stepped keyframes: every value holds until the next authored event.
  const stepped = (events: [number, Keyframe][], rest: Keyframe, last: Keyframe = rest): Keyframe[] => [
    { ...rest, offset: 0, easing: STEP },
    ...events.map(([time, frame]) => ({ ...frame, offset: time / PHASE.freeze, easing: STEP })),
    { ...last, offset: 1 }
  ];

  // Anticipation: the scene drains, the frame registers, the portrait scans in and holds perfectly still.
  track(find(".hcci-col-freeze"), [{ opacity: 0 }, { opacity: 1 }], 0, PHASE.boot);
  const scan = [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }];
  const rows = find(".hcci-col-rows");
  track(rows, scan, 40, PHASE.boot, "steps(6, end)", "backwards");
  track(find(".hcci-col-brackets"), [{ opacity: 0, transform: "scale(.9)" }, { opacity: 1, transform: "none" }], 0, 120, STRIKE);

  // Introduction and escalation: scripted faults, each row following its own stepped track.
  for (const [index, row] of all(".hcci-col-row").entries()) {
    const events = FAULTS.filter(fault => fault[1] === index);
    track(row, stepped(events.map(([time, , slip]) => [time, { transform: `translateX(${slip}%)` }]), { transform: "none" }), 0, PHASE.freeze);
    const [coarse, block] = Array.from(row.querySelectorAll("canvas"));
    track(coarse, stepped(events.map(([time, , , level]) => [time, { opacity: level >= 1 ? 1 : 0 }]), { opacity: 0 }, { opacity: 1 }), 0, PHASE.freeze);
    track(block, stepped(events.map(([time, , , level]) => [time, { opacity: level === 2 ? 1 : 0 }]), { opacity: 0 }, { opacity: 1 }), 0, PHASE.freeze);
    const dropouts = DROPOUTS.filter(dropout => dropout[2] === index);
    if (dropouts.length) {
      track(row.querySelector(".hcci-col-dead"), stepped(dropouts.flatMap(([from, to]) =>
        [[from, { opacity: 1 }], [to, { opacity: 0 }]] as [number, Keyframe][]), { opacity: 0 }), 0, PHASE.freeze);
    }
  }
  // Vertical hold slips once, late, when the row faults are already too fast to count.
  track(rows, stepped([[706, { transform: "translateY(2.5%)" }], [734, { transform: "none" }]], { transform: "none" }), 0, PHASE.freeze);
  for (const [index, tear] of all(".hcci-col-tears i").entries()) {
    track(tear, stepped(TEARS[index].flatMap(([from, to]) =>
      [[from, { opacity: 1 }], [to, { opacity: 0 }]] as [number, Keyframe][]), { opacity: 0 }), 0, PHASE.freeze);
  }
  const brackets = all(".hcci-col-brackets i");
  for (const [index, bracket] of brackets.entries()) {
    const { drift, fall, exit } = BRACKETS[index];
    const settled = { transform: drift[drift.length - 1][1] };
    track(bracket, stepped(drift.map(([time, transform]) => [time, { transform }]), { transform: "none" }, settled), 0, PHASE.freeze);
    track(bracket, [settled, { transform: exit }], PHASE.collapse + fall, PHASE.collapse + fall + 420, "cubic-bezier(.5,0,1,.6)", "forwards");
  }
  track(find(".hcci-copy"), [
    { opacity: 0, clipPath: "inset(0 0 100% 0)", easing: STEP },
    { opacity: 1, clipPath: "inset(0 0 66% 0)", offset: .34, easing: STEP },
    { opacity: 1, clipPath: "inset(0 0 33% 0)", offset: .67, easing: STEP },
    { opacity: 1, clipPath: "inset(-30%)" }
  ], PHASE.title, PHASE.title + 90);

  // Stillness: from freeze to collapse nothing moves. Every row is a flat strip of blocks.
  // Climax: the picture pancakes. A collapse front accelerates down the rows under gravity;
  // each row is crushed as the front passes, then rides the front down to the floor.
  const span = PHASE.impact - PHASE.collapse;
  track(find(".hcci-col-backing"), [{ opacity: 1, easing: STEP }, { opacity: 0 }], 0, PHASE.collapse);
  for (const [index, row] of all(".hcci-col-row").entries()) {
    const crushAt = Math.sqrt(index / ROWS);
    const rideAt = Math.sqrt((index + 1) / ROWS);
    track(row.querySelector(".hcci-col-band"), [{ transform: "none" }, { transform: `scaleY(${THIN})` }],
      PHASE.collapse + crushAt * span, PHASE.collapse + rideAt * span, "ease-in", "both");
    if (index === ROWS - 1) continue;
    // Exact cubic for the remaining arc of the parabola, so the stack never separates.
    const ease = `cubic-bezier(.3333,${(2 * rideAt / (1 + rideAt) / 3).toFixed(4)},.6667,${(1 - 2 / (1 + rideAt) / 3).toFixed(4)})`;
    track(row.querySelector(".hcci-col-fall"), [
      { transform: "none" }, { transform: `translateY(${((ROWS - 1 - index) * (1 - PITCH) * 100).toFixed(2)}%)` }
    ], PHASE.collapse + rideAt * span, PHASE.impact, ease, "both");
  }

  // Impact: the stack lands. The floor line fires across the screen and the portrait behind is exposed.
  const frame = find(".hcci-portrait-frame");
  track(frame, [{ filter: "brightness(.45)" }, { filter: "brightness(.45)" }], 0, PHASE.impact, "linear", "backwards");
  track(frame, [{ filter: "brightness(1.7)" }, { filter: "brightness(1)" }], PHASE.impact, PHASE.impact + 240, "ease-out", "none");
  track(find(".hcci-col-floor"), [{ transform: "scaleX(0)", opacity: 1 }, { transform: "scaleX(1)", opacity: 1, offset: .5 }, { transform: "scaleX(1)", opacity: .55 }],
    PHASE.impact, PHASE.impact + 280, STRIKE);
  track(find(".hcci-col-flash"), [
    { opacity: 0 }, { opacity: "var(--flash-peak, .14)", offset: .1 }, { opacity: 0 }
  ], PHASE.impact, PHASE.impact + 160);
  track(find(".hcci-stage"), [{ transform: "translateY(var(--hcci-shake))" }, { transform: "none" }], PHASE.impact, PHASE.impact + 170, "ease-out", "none");
  track(rows, [{ transform: "translateY(.5vh)" }, { transform: "none" }], PHASE.impact, PHASE.impact + 90, "ease-out", "none");
  track(find(".hcci-copy"), [{ transform: "translateY(1.4vh)" }, { transform: "none" }], PHASE.impact, PHASE.impact + 110, "ease-out", "none");

  // Resolution: a still, exposed portrait. Only a slow push and a halted cursor remain.
  const settle = PHASE.settle * speed;
  if (holdAt > settle) {
    const portrait = find(".hcci-portrait-frame > .hcci-portrait");
    if (portrait) animations.push(portrait.animate([{ transform: "none" }, { transform: "scale(1.035)" }],
      { delay: PHASE.impact * speed, duration: holdAt - PHASE.impact * speed, fill: "forwards" }));
    const cursor = find(".hcci-col-cursor");
    if (cursor) animations.push(cursor.animate([
      { opacity: 1, easing: STEP }, { opacity: 0, offset: .5, easing: STEP }, { opacity: 1 }
    ], { delay: settle, duration: 560, iterations: Math.max(1, Math.round((holdAt - settle) / 560)), fill: "forwards" }));
  }
  return { animations, audioDelay: PHASE.fault * speed };
}

export function startCollapseExit(overlay: HTMLElement, duration: number) {
  if (!overlay.classList.contains("hcci-motion-full") || !overlay.animate) return [];
  const animations: Animation[] = [];
  const leave = (node: Element | null, frames: Keyframe[], start: number, end: number, easing = "linear") => {
    if (node) animations.push(node.animate(frames, { delay: start * duration, duration: (end - start) * duration, easing, fill: "forwards" }));
  };
  const find = (selector: string) => overlay.querySelector(selector);
  // The copy is deleted line by line while the floor retracts.
  leave(find(".hcci-copy"), [
    { clipPath: "inset(-30% -30% 0 -30%)", easing: STEP },
    { clipPath: "inset(-30% -30% 34% -30%)", offset: .33, easing: STEP },
    { clipPath: "inset(-30% -30% 67% -30%)", offset: .66, easing: STEP },
    { clipPath: "inset(-30% -30% 100% -30%)", opacity: 0 }
  ], 0, .3);
  leave(find(".hcci-col-floor"), [{ transform: "scaleX(0)" }], 0, .36, "cubic-bezier(.6,0,.9,.4)");
  for (const bracket of overlay.querySelectorAll(".hcci-col-brackets")) leave(bracket, [{ opacity: 0 }], 0, .05);
  // Power-off: the picture folds into its own centre line, the line overshoots, then closes to a point.
  for (const selector of [".hcci-portrait-frame", ".hcci-col-rows", ".hcci-col-backing"]) {
    leave(find(selector), [
      { transform: "scaleY(.004)", opacity: 1, offset: .97, easing: STEP },
      { transform: "scaleY(.004)", opacity: 0 }
    ], 0, .34, "cubic-bezier(.6,0,.9,.3)");
  }
  leave(find(".hcci-col-beam"), [
    { opacity: 0, transform: "scaleX(.9)" },
    { opacity: 0, transform: "scaleX(.9)", offset: .26 },
    { opacity: 1, transform: "scaleX(1)", offset: .34 },
    { opacity: 1, transform: "scaleX(2.2)", offset: .5, easing: "cubic-bezier(.6,0,.9,.4)" },
    { opacity: 1, transform: "scaleX(.012)", offset: .8 },
    { opacity: 1, transform: "scaleX(.012)", offset: .88 },
    { opacity: 0, transform: "scaleX(0)" }
  ], 0, 1);
  leave(find(".hcci-col-tears"), [{ opacity: 0 }], 0, .05);
  leave(find(".hcci-col-freeze"), [{ opacity: 0 }], .6, 1);
  return animations;
}
