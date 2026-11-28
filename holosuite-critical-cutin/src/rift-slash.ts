/**
 * Each plate is an authored SVG silhouette with its own facets and scoring.
 * The plates are scaled once by the viewport; the timeline only moves the groups.
 */
export function riftSlashMarkup(detail: string) {
  const fragments = detail === "low" ? "" : `
    <g class="hcci-rift-splinters hcci-rift-splinters-top">
      <path d="m218 368 56-28-26 35Zm251-67 32-35-13 33Zm244-124 30-20-9 28Z"/>
      <path class="hcci-rift-white" d="m389 305 24-12-17 19Zm167-69 20-7-14 14Z"/>
    </g>
    <g class="hcci-rift-splinters hcci-rift-splinters-bottom">
      <path d="m247 439 48-27-27 34Zm262-95 50-27-32 35Zm185-95 24-15-11 23Z"/>
      <path class="hcci-rift-white" d="m345 398 23-12-12 16Zm268-105 31-12-24 20Z"/>
    </g>`;
  return `<svg class="hcci-rift-geometry" viewBox="0 0 960 540" preserveAspectRatio="none" aria-hidden="true">
    <g class="hcci-rift-plate hcci-rift-upper">
      <path class="hcci-rift-metal" d="M-165-8H970V77L901 107 865 108 852 129 780 151 742 174 722 169 692 194 639 202 600 234 567 231 535 260 482 278 458 276 437 302 363 323 337 347 304 343 253 382 219 382 198 404 158 410 111 442 79 437 51 460-8 480-165 534Z"/>
      <path class="hcci-rift-facet" d="M0 63 344 0H680L531 57 462 60 386 102 300 111 0 266ZM960 0v43L713 128l-55 5-110 55-110 19 148-91 96-33 62-34Z"/>
      <path class="hcci-rift-score" d="M0 304 247 213l78-5 68-43 81-21 33-22M620 166l81-42 84-26 60-37 115-29M45 386l91-31 46-41 33-9m-92 77 16-8m30-14 23-14m21-12 28-12"/>
      <path class="hcci-rift-edge" d="M-165 534-8 480 51 460 79 437 111 442 158 410 198 404 219 382 253 382 304 343 337 347 363 323 437 302 458 276 482 278 535 260 567 231 600 234 639 202 692 194 722 169 742 174 780 151 852 129 865 108 901 107 970 77 1115 24"/>
      <path class="hcci-rift-edge-light" d="m79 437 32 5 47-32 40-6m139-57 26-24 74-21 21-26 24 2m210-84 30-25 20 5 38-23"/>
    </g>
    <g class="hcci-rift-plate hcci-rift-lower">
      <path class="hcci-rift-metal" d="M-165 534-8 480 51 460 79 437 111 442 158 410 198 404 219 382 253 382 304 343 337 347 363 323 437 302 458 276 482 278 535 260 567 231 600 234 639 202 692 194 722 169 742 174 780 151 852 129 865 108 901 107 970 77 1115 24V550H-165Z"/>
      <path class="hcci-rift-facet" d="M0 540v-19l151-62 45-5 121-71 84-16-95 62-53 10-114 101Zm960-313v159L602 522l-161 18h-94l180-78 81-9 97-65 80-27Z"/>
      <path class="hcci-rift-score" d="M301 514l134-65 89-24 52-43 63-19M648 330l53-24 72-56 38-4 92-52m-30 68 15-9m12-7 25-13m10-8 25-16"/>
      <path class="hcci-rift-edge" d="M-165 534-8 480 51 460 79 437 111 442 158 410 198 404 219 382 253 382 304 343 337 347 363 323 437 302 458 276 482 278 535 260 567 231 600 234 639 202 692 194 722 169 742 174 780 151 852 129 865 108 901 107 970 77 1115 24"/>
      <path class="hcci-rift-edge-light" d="m219 382 34 0 51-39 33 4m145-69 53-18 32-29 33 3 39-32m141-51 72-22 13-21 36-1"/>
    </g>
    <g class="hcci-rift-slash">
      <path class="hcci-rift-trail" d="M-20 506 141 453 255 390 327 376 441 303 528 288 630 228 743 196 880 126 984 89 875 147 751 214 624 253 551 298 439 332 340 391 259 413 144 472Z"/>
      <path d="M-25 495 77 451 116 453 207 392 249 388 307 346 343 350 383 316 442 302 479 268 510 274 561 232 609 231 655 199 723 174 750 178 799 144 861 128 884 109 986 74 929 116 861 145 825 172 759 182 706 221 661 219 607 262 578 254 534 293 489 296 444 328 401 330 344 376 309 369 242 415 195 420 149 448 108 464Z"/>
      <path class="hcci-rift-white" d="M41 468 115 453 207 392 249 388 307 346 343 350 383 316 442 302 479 268 510 274 561 232 609 231 655 199 723 174 750 178 799 144 861 128 884 109 977 77 887 116 866 137 803 153 752 187 724 183 659 209 611 242 565 241 514 283 482 277 446 311 390 323 345 358 309 355 251 396 208 401 119 459Z"/>
    </g>
    ${fragments}
  </svg>`;
}

const PHASE = {
  anticipation: 0,
  slash: 100,
  rupture: 245,
  reveal: 402,
  title: 505,
  hold: 695
};
const BLADE = "cubic-bezier(.68,0,.88,.45)";
const SEPARATE = "cubic-bezier(.12,.78,.24,1)";
const IMPACT = "cubic-bezier(.15,.78,.18,1)";
const EXIT = "cubic-bezier(.62,.02,.86,.45)";

// The moving aperture tapers toward the blade tip as it follows the authored diagonal.
function bladeAperture(x: number) {
  const y = 91 - .74 * x;
  return `polygon(-10% 0, ${x - 12}% 0, ${x - 11}% ${y - 6}%, ${x}% ${y}%, ${x - 12}% ${y + 8}%, ${x - 15}% 100%, -10% 100%) view-box`;
}

export function startRiftIntro(overlay: HTMLElement, holdAt: number) {
  const animations: Animation[] = [];
  if (!overlay.classList.contains("hcci-motion-full") || !overlay.animate) {
    return { animations, audioDelay: 0 };
  }
  // Only squeeze the entrance when the minimum setting would leave a short hold.
  const speed = Math.min(1, (holdAt - 100) / PHASE.hold);
  const play = (selector: string, frames: Keyframe[], start: number, end: number, easing = "linear") => {
    for (const element of overlay.querySelectorAll(selector)) {
      animations.push(element.animate(frames, {
        delay: start * speed, duration: (end - start) * speed, easing, fill: "both"
      }));
    }
  };
  play(".hcci-rift-geometry", [{ opacity: .62 }, { opacity: 1 }], PHASE.anticipation, PHASE.slash);
  play(".hcci-rift-edge, .hcci-rift-edge-light", [{ opacity: 0 }, { opacity: 1 }], PHASE.slash + 82, PHASE.rupture);
  play(".hcci-rift-upper", [{ transform: "none" }, { transform: "translateY(var(--rift-open-upper))" }], PHASE.rupture, 535, SEPARATE);
  play(".hcci-rift-lower", [{ transform: "none" }, { transform: "translateY(var(--rift-open-lower))" }], PHASE.rupture + 18, 585, SEPARATE);
  play(".hcci-rift-slash", [
    { clipPath: bladeAperture(1), opacity: .28 },
    { clipPath: bladeAperture(13), opacity: .65, offset: .21, easing: BLADE },
    { clipPath: bladeAperture(126), opacity: 1, offset: .62 },
    { clipPath: bladeAperture(126), opacity: .76, offset: .72 },
    { clipPath: bladeAperture(126), opacity: 0 }
  ], PHASE.anticipation, 340);
  play(".hcci-rift-splinters-top", [
    { opacity: 0 }, { opacity: 1, offset: .025 }, { opacity: 0, transform: "translate(6vw, -16vh) rotate(5deg)" }
  ], PHASE.rupture, 465, SEPARATE);
  play(".hcci-rift-splinters-bottom", [
    { opacity: 0 }, { opacity: 1, offset: .025 }, { opacity: 0, transform: "translate(-4vw, 12vh) rotate(-4deg)" }
  ], PHASE.rupture + 15, 485, SEPARATE);
  play(".hcci-visual", [
    { transform: "scale(1.09)", opacity: 0 },
    { transform: "scale(1.04)", opacity: 1, offset: .58, easing: "steps(1, end)" },
    { transform: "scale(1.04)", opacity: 1, offset: .69 },
    { transform: "none", opacity: 1 }
  ], PHASE.reveal, 625, IMPACT);
  play(".hcci-copy", [
    { opacity: 0, transform: "translate(8vw, -3vh) skewX(-12deg)" },
    { opacity: 1, transform: "translate(-1vw, .5vh) skewX(2deg)", offset: .6 },
    { opacity: 1, transform: "none" }
  ], PHASE.title, PHASE.hold, IMPACT);
  play(".hcci-rift-flash", [
    { opacity: 0 }, { opacity: "var(--flash-peak, .14)", offset: .08 }, { opacity: 0 }
  ], PHASE.slash + 82, PHASE.rupture + 33);
  play(".hcci-stage", [
    { transform: "none" },
    { transform: "translateX(var(--hcci-shake))", offset: .28 },
    { transform: "translateX(calc(-.5 * var(--hcci-shake)))", offset: .58 },
    { transform: "none" }
  ], PHASE.title + 38, 640);
  return { animations, audioDelay: PHASE.slash * speed };
}

export function startRiftExit(overlay: HTMLElement, duration: number) {
  if (!overlay.classList.contains("hcci-motion-full") || !overlay.animate) return [];
  const animations: Animation[] = [];
  for (const [selector, transform] of [
    [".hcci-copy", "translate(75vw, -40vh) skewX(-12deg)"],
    [".hcci-rift-upper", "none"],
    [".hcci-rift-lower", "none"]
  ]) {
    const element = overlay.querySelector(selector);
    if (element) animations.push(element.animate([{ transform }], { duration, easing: EXIT, fill: "forwards" }));
  }
  return animations;
}
