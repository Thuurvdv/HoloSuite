export const OVERRIDE_STYLE = "reality-override";
export const OVERRIDE_EXIT = 300;
/** Sound-design cue points on the uncompressed timeline, in milliseconds. */
export const OVERRIDE_CUES = { cut: 20, flip: 150, impact: 640 } as const;

const LOUVERS = 5;
const PHASE = { cut: 20, flip: 150, wind: 520, impact: 640, settle: 820 };
const STRIKE = "cubic-bezier(.14,.82,.2,1)";
const CUT = "steps(1, end)";
// Signed slip of each slice along the cut axis while the image is still "unregistered".
const SLIP = [1, -.7, .5, -1, .8];

/** Static layers only. Everything that carries the portrait is built by prepareOverride. */
export function overrideMarkup(detail: string) {
  const chips = detail === "low" ? 0 : detail === "high" ? 8 : 4;
  return `<div class="hcci-ovr-freeze"></div>
    <div class="hcci-ovr-slab"></div>
    <div class="hcci-ovr-chips">${Array.from({ length: chips }, (_, i) => `<i style="--k:${i}"></i>`).join("")}</div>
    <div class="hcci-ovr-flash"></div>`;
}

/**
 * Slices the configured artwork into slanted louvers and adds the depth layers.
 * Safe to call again after the shared image error handler swaps the artwork.
 */
export function prepareOverride(overlay: HTMLElement) {
  const visual = overlay.querySelector<HTMLElement>(".hcci-visual");
  const portrait = overlay.querySelector<HTMLElement>(".hcci-portrait-frame > .hcci-portrait");
  if (!visual || !portrait) return;
  visual.querySelectorAll(".hcci-ovr-echo, .hcci-ovr-panel, .hcci-ovr-cuts, .hcci-ovr-band").forEach(node => node.remove());
  const art = (name: string) => {
    const node = portrait.cloneNode(true) as HTMLElement;
    node.classList.remove("hcci-portrait");
    node.classList.add(name);
    return node;
  };
  const make = (name: string, index?: number) => {
    const node = document.createElement(name.startsWith("i.") ? "i" : "div");
    node.className = name.replace(/^i\./, "");
    if (index !== undefined) node.style.setProperty("--i", String(index));
    return node;
  };
  const echo = make("hcci-ovr-echo");
  echo.append(art("hcci-ovr-echo-art"));
  const panel = make("hcci-ovr-panel");
  for (let index = 0; index < LOUVERS; index++) {
    const louver = make("hcci-ovr-louver", index);
    louver.append(art("hcci-ovr-art"), make("i.hcci-ovr-tint"), make("i.hcci-ovr-face"), make("i.hcci-ovr-neg"));
    panel.append(louver);
  }
  const cuts = make("hcci-ovr-cuts");
  for (let index = 0; index <= LOUVERS; index++) cuts.append(make("i.hcci-ovr-cut", index));
  visual.append(echo, panel, cuts, make("hcci-ovr-band"));
}

export function startOverrideIntro(overlay: HTMLElement, holdAt: number) {
  const animations: Animation[] = [];
  if (!overlay.classList.contains("hcci-motion-full") || !overlay.animate) return { animations, audioDelay: 0 };
  // Longer durations extend the hold; only the shortest settings squeeze the entrance.
  const speed = Math.min(1, (holdAt - 100) / PHASE.settle);
  const track = (node: Element | null, frames: Keyframe[], start: number, end: number, easing = "linear", fill: FillMode = "both") => {
    if (node) animations.push(node.animate(frames, { delay: start * speed, duration: Math.max(1, (end - start) * speed), easing, fill }));
  };
  const hold = (node: Element | null, frames: Keyframe[], from: number) => {
    const delay = from * speed;
    if (node && holdAt > delay) animations.push(node.animate(frames, { delay, duration: holdAt - delay, fill: "forwards" }));
  };
  const find = (selector: string) => overlay.querySelector(selector);
  const all = (selector: string) => Array.from(overlay.querySelectorAll<HTMLElement>(selector));

  // The louvers hinge on the cut itself, so the axis is measured from the laid-out slant.
  const cuts = all(".hcci-ovr-cut");
  const height = overlay.clientHeight || 1;
  const lean = Math.max(0, (cuts[0]?.getBoundingClientRect().width ?? 3) - 3);
  const length = Math.hypot(lean, height);
  const ax = lean / length;
  const ay = -height / length;
  const hinge = (angle: number) => `rotate3d(${ax.toFixed(4)},${ay.toFixed(4)},0,${angle}deg)`;
  const along = (amount: number) => `translate(${(ax * amount * height).toFixed(1)}px,${(ay * amount * height).toFixed(1)}px) scale(1.07)`;

  // Anticipation: the live scene freezes, then hairline cuts race through it in alternating directions.
  track(find(".hcci-ovr-freeze"), [{ opacity: 0 }, { opacity: 1 }], 0, 45);
  const lineTop = "polygon(var(--ovr-lean) 0, calc(var(--ovr-lean) + 3px) 0, calc(var(--ovr-lean) + 3px) 0, var(--ovr-lean) 0)";
  const lineBottom = "polygon(0 100%, 3px 100%, 3px 100%, 0 100%)";
  const lineFull = "polygon(var(--ovr-lean) 0, calc(var(--ovr-lean) + 3px) 0, 3px 100%, 0 100%)";
  for (const [index, cut] of cuts.entries()) {
    const start = PHASE.cut + index * 14;
    track(cut, [{ clipPath: index % 2 ? lineBottom : lineTop }, { clipPath: lineFull }], start, start + 95, "cubic-bezier(.7,0,.3,1)");
    // Inner seams exist only until the image locks; the outer two stay as the panel edge.
    if (index > 0 && index < LOUVERS) track(cut, [{ opacity: 1 }, { opacity: 1 }], 0, PHASE.impact, "linear", "backwards");
  }

  // Introduction: flat planes arrive from opposite ends, then each band flips open on its cut.
  track(find(".hcci-ovr-slab"), [
    { transform: "translate(calc(var(--ovr-lean) * 1.15), -115vh)" }, { transform: "none" }
  ], PHASE.flip, PHASE.flip + 230, STRIKE);
  track(find(".hcci-ovr-echo"), [
    { transform: "translate(calc(var(--ovr-lean) * -1.15), 115vh)" }, { transform: "none" }
  ], PHASE.flip + 40, PHASE.flip + 300, STRIKE);
  for (const [index, louver] of all(".hcci-ovr-louver").entries()) {
    const start = PHASE.flip + index * 38;
    track(louver, [
      { opacity: 0, transform: hinge(-98) },
      { opacity: 1, transform: hinge(-98), offset: .02 },
      { opacity: 1, transform: hinge(10), offset: .68 },
      { opacity: 1, transform: hinge(0) }
    ], start, start + 230, STRIKE);
    track(louver.querySelector(".hcci-ovr-face"), [{ opacity: 1 }, { opacity: 1, offset: .42 }, { opacity: 0 }], start, start + 230, "linear", "backwards");
    // Escalation: slices creep toward alignment, then lock in a single frame at the impact.
    const art = louver.querySelector(".hcci-ovr-art");
    track(art, [
      { transform: along(SLIP[index] * .055) },
      { transform: along(SLIP[index] * .024), offset: .97, easing: CUT },
      { transform: "none" }
    ], start, PHASE.impact, "linear", "backwards");
    track(louver.querySelector(".hcci-ovr-tint"), [{ opacity: 1 }, { opacity: 1 }], 0, PHASE.impact, "linear", "backwards");
    if (!overlay.classList.contains("hcci-flash-off")) {
      track(louver.querySelector(".hcci-ovr-neg"), [{ opacity: 1 }, { opacity: 1 }], PHASE.impact, PHASE.impact + 48, "linear", "none");
    }
    hold(art, [{ transform: "none" }, { transform: "scale(1.04)" }], PHASE.impact);
  }

  // Climax: a white line crosses the frame, then opens into the title band as the image locks.
  const band = find(".hcci-ovr-band");
  track(band, [
    { clipPath: "inset(49% 100% 49% 0)", backgroundColor: "#fff" },
    { clipPath: "inset(49% 0 49% 0)", backgroundColor: "#fff" }
  ], PHASE.wind, PHASE.impact, "cubic-bezier(.6,0,.9,.4)", "backwards");
  track(band, [
    { clipPath: "inset(49% 0 49% 0)", backgroundColor: "#fff" },
    { clipPath: "inset(0 0 0 0)", backgroundColor: "#fff", offset: .55 },
    { clipPath: "inset(0 0 0 0)" }
  ], PHASE.impact, PHASE.impact + 110, STRIKE, "none");
  // The stamp scales the title only, so the copy block itself never leaves the screen.
  track(find(".hcci-copy"), [{ opacity: 0, easing: CUT }, { opacity: 1 }], 0, PHASE.impact + 14);
  track(find(".hcci-title"), [
    { transform: "skewX(-9deg) scale(1.55)" },
    { transform: "skewX(-9deg) scale(.96)", offset: .4, easing: CUT },
    { transform: "skewX(-9deg) scale(.96)", offset: .62 },
    { transform: "skewX(-9deg)" }
  ], PHASE.impact + 14, PHASE.impact + 150, STRIKE, "none");
  track(find(".hcci-ovr-flash"), [
    { opacity: 0 }, { opacity: "var(--flash-peak, .14)", offset: .1 }, { opacity: 0 }
  ], PHASE.impact, PHASE.impact + 140);
  // One directional recoil along the band instead of a shake.
  track(find(".hcci-stage"), [
    { transform: "none" },
    { transform: "translate(calc(var(--hcci-shake) * 1.4), calc(var(--hcci-shake) * -.5))", offset: .16 },
    { transform: "none" }
  ], PHASE.impact, PHASE.impact + 180, "ease-out", "none");
  for (const [index, chip] of all(".hcci-ovr-chips i").entries()) {
    const side = index % 2 ? 1 : -1;
    track(chip, [
      { opacity: 1, transform: "rotate(var(--ovr-tilt)) translateX(0)" },
      { opacity: 1, offset: .65 },
      { opacity: 0, transform: `rotate(var(--ovr-tilt)) translateX(${side * (34 + index * 5)}vw) rotate(${side * 160}deg)` }
    ], PHASE.impact, PHASE.impact + 300 + index * 12, "cubic-bezier(.1,.7,.3,1)", "none");
  }

  // Resolution: the depth layers keep separating slowly for as long as the hold lasts.
  hold(find(".hcci-ovr-echo-art"), [{ transform: "scale(1.45)" }, { transform: "scale(1.45) translateX(-1.6vw)" }], PHASE.flip + 300);
  hold(find(".hcci-ovr-slab"), [{ transform: "none" }, { transform: "translate(calc(var(--ovr-lean) * -.05), 5vh)" }], PHASE.flip + 230);
  return { animations, audioDelay: PHASE.cut * speed };
}

export function startOverrideExit(overlay: HTMLElement, duration: number) {
  if (!overlay.classList.contains("hcci-motion-full") || !overlay.animate) return [];
  const animations: Animation[] = [];
  const leave = (node: Element | null, frames: Keyframe[], start: number, end: number, easing = "cubic-bezier(.6,.02,.9,.5)") => {
    if (node) animations.push(node.animate(frames, { delay: start * duration, duration: (end - start) * duration, easing, fill: "forwards" }));
  };
  const find = (selector: string) => overlay.querySelector(selector);
  leave(find(".hcci-copy"), [{ opacity: 0, transform: "rotate(var(--ovr-tilt)) translateX(7vw)" }], 0, .28);
  // The band closes back to the line it opened from, and the line leaves the way it was heading.
  leave(find(".hcci-ovr-band"), [
    { clipPath: "inset(0 0 0 0)" },
    { clipPath: "inset(49% 0 49% 0)", backgroundColor: "#fff", offset: .5 },
    { clipPath: "inset(49% 0 49% 100%)", backgroundColor: "#fff" }
  ], 0, .6, "linear");
  const louvers = Array.from(overlay.querySelectorAll(".hcci-ovr-louver"));
  const height = overlay.clientHeight || 1;
  const lean = Math.max(0, (overlay.querySelector(".hcci-ovr-cut")?.getBoundingClientRect().width ?? 3) - 3);
  const length = Math.hypot(lean, height);
  for (const [index, louver] of louvers.entries()) {
    const start = .08 + (louvers.length - 1 - index) * .07;
    leave(louver, [
      { opacity: 1, transform: `rotate3d(${(lean / length).toFixed(4)},${(-height / length).toFixed(4)},0,96deg)`, offset: .98, easing: CUT },
      { opacity: 0, transform: `rotate3d(${(lean / length).toFixed(4)},${(-height / length).toFixed(4)},0,96deg)` }
    ], start, start + .42);
  }
  for (const cut of overlay.querySelectorAll(".hcci-ovr-cut")) leave(cut, [{ opacity: 0 }], .08, .2, CUT);
  leave(find(".hcci-ovr-slab"), [{ transform: "translate(calc(var(--ovr-lean) * -1.15), 115vh)" }], .12, .82);
  leave(find(".hcci-ovr-echo"), [{ transform: "translate(calc(var(--ovr-lean) * 1.15), -115vh)" }], .06, .76);
  leave(find(".hcci-ovr-freeze"), [{ opacity: 0 }], .62, 1, "linear");
  return animations;
}
