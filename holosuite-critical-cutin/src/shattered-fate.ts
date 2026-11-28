export const FATE_STYLE = "shattered-fate";

type Point = readonly [number, number];
const origin: Point = [53, 48];
// Clockwise rays, with a bend and an intermediate junction on each.
const rays: readonly (readonly [Point, Point, Point])[] = [
  [[49, 34], [43, 25], [41, 0]],
  [[64, 39], [69, 23], [100, 0]],
  [[68, 49], [79, 45], [100, 36]],
  [[66, 58], [81, 65], [100, 76]],
  [[61, 64], [66, 81], [78, 100]],
  [[50, 66], [46, 76], [39, 100]],
  [[41, 60], [29, 70], [0, 100]],
  [[34, 52], [22, 56], [0, 52]],
  [[43, 40], [31, 28], [0, 0]]
];
// The bottom-right corner belongs to the outer shard between rays 3 and 4.
export const fatePieces = rays.flatMap(([joint, bend, edge], index) => {
  const [nextJoint, nextBend, nextEdge] = rays[(index + 1) % rays.length];
  const seam: Point = [(joint[0] + nextJoint[0]) / 2 + (index % 2 ? 1.5 : -2), (joint[1] + nextJoint[1]) / 2 + (index % 3 - 1) * 2];
  return [
    [origin, joint, seam, nextJoint],
    [joint, bend, edge, ...(index === 3 ? [[100, 100] as const] : []), nextEdge, nextBend, nextJoint, seam]
  ];
});

const polygon = (points: readonly Point[]) => `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(",")})`;
const pointsAttribute = (points: readonly Point[]) => points.map(point => point.join(",")).join(" ");
const titleSeams: Point[][] = [
  [[0, 0], [100, 0]],
  [[0, 16], [21, 23], [37, 15], [58, 29], [72, 20], [100, 26]],
  [[0, 42], [25, 48], [44, 37], [65, 49], [86, 42], [100, 50]],
  [[0, 62], [20, 70], [39, 58], [62, 73], [80, 61], [100, 67]],
  [[0, 83], [17, 88], [39, 77], [59, 91], [77, 79], [100, 89]],
  [[0, 100], [100, 100]]
];

export function fateMarkup() {
  return `<svg class="hcci-fate-backdrop" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
    <path class="hcci-fate-slashes" d="M0 365 259 206 146 327 350 230 227 367 0 505ZM0 511l244-106L80 520l65-12L0 560Zm1000-407L712 250l104-114-113 44L919 0h81Zm0 390-192 66h-66l98-58-46 6 206-133Z"/>
    <path class="hcci-fate-streaks" d="m0 337 274-179L91 314Zm0 184 327-118L54 520ZM1000 25 733 193 960 25Zm0 215-208 108 208-76ZM675 560l250-124-177 124Z"/>
    <path class="hcci-fate-debris" d="m115 152 35-19-16 38Zm64 311 47-27-27 41Zm623-351 46-25-23 43Zm75 279 49-43-15 51ZM69 437l29-22-11 27Zm864-225 33-19-15 29Z"/>
  </svg><div class="hcci-fate-flash"></div>`;
}

function edgeMarkup(points: readonly Point[]) {
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points="${pointsAttribute(points)}"/></svg>`;
}

export function prepareFatePortrait(overlay: HTMLElement) {
  const visual = overlay.querySelector(".hcci-visual")!;
  const portrait = visual.querySelector(".hcci-portrait")!;
  const shards = visual.querySelectorAll(".hcci-fate-shard");
  if (shards.length) {
    // Keep the animated wrappers in place if the shared image error handler swaps artwork.
    for (const shard of shards) shard.firstElementChild!.replaceWith(portrait.cloneNode(true));
    return;
  }
  for (const points of fatePieces) {
    const shard = document.createElement("div");
    shard.className = "hcci-fate-shard";
    shard.style.clipPath = polygon(points);
    shard.append(portrait.cloneNode(true));
    shard.insertAdjacentHTML("beforeend", edgeMarkup(points));
    visual.append(shard);
  }
  visual.insertAdjacentHTML("beforeend", `<svg class="hcci-fate-cracks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <g class="hcci-fate-branches">${fatePieces.filter((_, i) => i % 2 === 0).map(points =>
      `<polyline points="${pointsAttribute(points.slice(1))}"/>`).join("")}</g>
    <g class="hcci-fate-rays">${rays.map(ray => `<polyline points="${pointsAttribute([origin, ...ray])}"/>`).join("")}</g>
    <path class="hcci-fate-spark" d="m53 45 1 2 3 1-3 1-1 3-1-3-3-1 3-1Z"/>
  </svg>`);
}

const PHASE = { fracture: 250, shatter: 450, impact: 740, settle: 1050 };
export const FATE_EXIT = 280;
const CUT = "steps(1, end)";
const STRIKE = "cubic-bezier(.13,.79,.19,1)";
// Clockwise directions follow the fracture rays. Inner shards move farther forward.
const throws = [
  [-.34,-.92,-27], [.38,-.86,20], [.91,-.35,32], [.86,.39,-24], [.46,.85,37],
  [-.21,.99,-31], [-.68,.66,27], [-1,.12,-34], [-.8,-.59,18]
];

export function startFateIntro(overlay: HTMLElement, holdAt: number) {
  const animations: Animation[] = [];
  if (!overlay.classList.contains("hcci-motion-full") || !overlay.animate) return { animations, audioDelay: 0 };
  const compression = Math.min(1, (holdAt - 140) / PHASE.settle);
  const track = (node: Element | null, frames: Keyframe[], start: number, end: number, easing = "linear") => {
    if (node) animations.push(node.animate(frames, {
      delay: start * compression, duration: (end - start) * compression, easing, fill: "both"
    }));
  };
  const find = (selector: string) => overlay.querySelector(selector);
  track(find(".hcci-visual"), [
    { transform: "translate(-3vw, 2vh) scale(1.09)", opacity: .42 },
    { transform: "none", opacity: 1 }
  ], 0, PHASE.fracture, STRIKE);
  track(find(".hcci-portrait-frame"), [{ visibility: "visible" }, { visibility: "hidden" }], 0, PHASE.shatter, CUT);
  for (const [selector, time] of [[".hcci-fate-rays", 250], [".hcci-fate-branches", 310], [".hcci-fate-spark", 250]] as const) {
    track(find(selector), [
      { opacity: 0 }, { opacity: 1, offset: .06, easing: CUT }, { opacity: 0 }
    ], time, PHASE.shatter);
  }
  for (const [index, shard] of Array.from(overlay.querySelectorAll(".hcci-fate-shard")).entries()) {
    const inner = index % 2 === 0;
    const [x, y, spin] = throws[Math.floor(index / 2)];
    const distance = inner ? 40 : 55;
    const lag = inner ? 33 + (index % 3) * 12 : (index % 3) * 8;
    track(shard, [{ visibility: "hidden" }, { visibility: "visible" }], 0, PHASE.shatter, CUT);
    const motionStart = PHASE.shatter + lag;
    const throwAt = inner ? 819 : 756;
    track(shard, [
      { transform: "none", opacity: 1, easing: STRIKE },
      { transform: `perspective(850px) translate3d(${x * distance * .52}vw,${y * distance * .47}vh,${inner ? 96 : -80}px) rotate(${spin * .53}deg) rotateY(${x * 32}deg)`, opacity: 1, offset: (throwAt - motionStart) / (PHASE.settle - motionStart) },
      { transform: `perspective(850px) translate3d(${x * distance}vw,${y * distance}vh,${inner ? 190 : -145}px) rotate(${spin}deg) rotateY(${x * 62}deg)`, opacity: 0 }
    ], motionStart, PHASE.settle);
  }
  track(find(".hcci-copy"), [
    { opacity: 0, transform: "translate(13vw,3vh) rotate(-13deg) scale(1.3)" },
    { opacity: 1, transform: "translate(-1vw,0) rotate(-8deg) scale(1.035)", offset: .35, easing: CUT },
    { opacity: 1, transform: "translate(-1vw,0) rotate(-8deg) scale(1.035)", offset: .51, easing: STRIKE },
    { opacity: 1, transform: "rotate(-7deg)" }
  ], PHASE.impact, PHASE.settle, STRIKE);
  const flash = find(".hcci-fate-flash");
  const pulses = [54, PHASE.fracture, PHASE.impact];
  const flashEnd = PHASE.impact + 50;
  const frames: Keyframe[] = pulses.flatMap((time, i) => [
    { offset: time / flashEnd, opacity: 0 },
    { offset: (time + 7) / flashEnd, opacity: `calc(var(--flash-peak, .14) * ${i === 0 ? .55 : 1})`,
      backgroundColor: i === 0 ? "var(--hcci-accent)" : "#fff" },
    { offset: (time + 50) / flashEnd, opacity: 0 }
  ]);
  track(flash, [{ opacity: 0, offset: 0 }, ...frames], 0, flashEnd);
  track(find(".hcci-stage"), [
    { transform: "none" }, { transform: "translateX(var(--hcci-shake))", offset: .2 },
    { transform: "translateX(calc(-.45 * var(--hcci-shake)))", offset: .51 }, { transform: "none" }
  ], PHASE.impact, PHASE.impact + 75);
  return { animations, audioDelay: PHASE.shatter * compression };
}

export function startFateExit(overlay: HTMLElement, duration: number) {
  if (!overlay.classList.contains("hcci-motion-full") || !overlay.animate) return [];
  const animations: Animation[] = [];
  const copy = overlay.querySelector<HTMLElement>(".hcci-copy")!;
  if (Number(getComputedStyle(copy).opacity) > .8 && copy.textContent?.trim()) {
    const layer = copy.parentElement!.appendChild(document.createElement("div"));
    layer.className = "hcci-fate-exit-pieces";
    for (let i = 0; i < titleSeams.length - 1; i++) {
      const piece = copy.cloneNode(true) as HTMLElement;
      const mask = layer.appendChild(document.createElement("div"));
      mask.style.clipPath = polygon([...titleSeams[i], ...titleSeams[i + 1].slice().reverse()]);
      mask.append(piece);
      animations.push(mask.animate([
        { transform: "none", opacity: 1 },
        { transform: `translate(${(i - 2) * 9 + (i % 2 ? 11 : -8)}vw,${7 + i * 6}vh) rotate(${(i - 2) * 12}deg)`, opacity: 0 }
      ], { duration: duration - i * 9, delay: i * 9, easing: "cubic-bezier(.55,.04,.89,.54)", fill: "both" }));
    }
    copy.style.visibility = "hidden";
  }
  animations.push(overlay.animate([{ opacity: 1 }, { opacity: 1, offset: .61 }, { opacity: 0 }], { duration, fill: "both" }));
  return animations;
}
