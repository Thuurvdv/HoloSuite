export const MANGA_STYLE = "manga-overdrive";
export const MANGA_ACCENT = "#ec2846";

export function mangaMarkup(detail: string) {
  return `<svg class="hcci-manga-ink" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
    <g class="hcci-manga-page">
      <path class="hcci-manga-paper" d="M0 0h1000v600H0Z"/>
      <path class="hcci-manga-black" d="M0 0h288l86 132-131-70 69 105-117-54 45 63-157-37 71 65L0 169Zm1000 0v213l-155 12 57-68-119 18 86-69-166 43L813 0ZM0 600V365l170-30-64 71 139-38-65 85 112-45-84 192Zm1000 0H742l-97-144 122 39-52-79 133 39-67-75 134 28-47-59 132 15Z"/>
      <path class="hcci-manga-black" d="M0 226l362-6-179 27L0 249Zm0 31 299 4L0 270Zm0 53 331-32L0 332Zm1000-73-294 17 294-3Zm0 19-362 24 362-14Zm0 40-321-5 321 21ZM322 0l110 160L362 0Zm97 0 38 111L438 0Zm144 0-42 144L587 0Zm92 0L553 178 703 0ZM312 600l129-181-94 181Zm99 0 53-154-27 154Zm89 0 8-158 22 158Zm134 0-78-169 113 169Z"/>
      <path class="hcci-manga-black" d="M53 151c26-12 67-8 91 3l61 29-58-15c-26-7-32 3-56-4-16-5-22-14-38-13Zm879 247c-22 7-24 19-54 21l-77-21 61 37c21 11 33 5 51-4l33-20ZM211 121c10 2 21 12 25 21-14 1-21-8-25-21Zm570 346c-8-5-12-15-9-21 10 4 18 16 9 21Z"/>
      <path class="hcci-manga-accent" d="m23 186 222 29-124-31Zm45 191 139-57-62 45ZM726 146l114-89-68 78ZM825 357l143-25-72 26Z"/>
      ${detail === "low" ? "" : '<path class="hcci-manga-black" d="m272 204 29 5 20 17-28-3Zm383-59 8-31 28-22-17 35ZM247 365l40-23-10 25-30 9Zm544-38 32-7 26 17-41-2ZM401 434l21-38-1 30-10 19Z"/>'}
      <path class="hcci-manga-black hcci-manga-reveal-lines" d="m0 197 302 19L0 204Zm0 154 285-34L0 359ZM1000 218l-268 14 268-6Zm0 126-281-32 281 24ZM374 0l71 150L389 0Zm260 600-56-151 72 151Z"/>
    </g>
    <g class="hcci-manga-impact">
      <path class="hcci-manga-accent" d="M0 0h1000v600H0Z"/>
      <path class="hcci-manga-black" d="M0 0h207l57 55-83-9 67 75-93-29 32 53L0 114Zm1000 0v128l-221 91 104-96-77 16 78-75-100 37L865 0ZM0 600V471l174-75-44 61 118-60-55 72 89-36-70 83 59-18-93 102Zm1000 0H754l-60-60 80 21-62-67 93 17-47-63 104 30-50-64 188 37Z"/>
      <path class="hcci-manga-paper" d="M0 110l249 47-105-42 240 55L196 91l251 68L269 42l220 99-58-92 116 97 105-113-30 92 191-85-98 94 196-61-99 91 188-46-180 94 180-15-203 56 203 19-230 17 230 62-250-21 250 107-264-57 112 78-173-61 110 109-201-77 30 81-100-81-127 94 57-100-218 83 106-116L98 520l92-88L0 499l189-110L0 421l171-83L0 367l195-63L0 302l207-39L0 244l225-21L0 178l245 19Z"/>
      <path class="hcci-manga-black" d="M0 155l203 43L0 169Zm0 228 209-51L0 397Zm82 217 203-145-175 145Zm918-406-203 61 203-45Zm0 182-173-37 173 51Zm0 126-181-82 181 103ZM565 0l-35 131L582 0Z"/>
      <path class="hcci-manga-accent" d="m82 115 33 6 53 38-34-7Zm658-35 19-33 40-23-24 35ZM144 488l52-43-10 30-36 27Zm730-108 48 3 49 34-35-5Z"/>
    </g>
  </svg>
  <svg class="hcci-manga-exit-ink" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
    <path class="hcci-manga-exit" d="M-130-85H715L625 0l42 14-113 45 35 27-98 45 42 28-128 65 28 30-86 40 35 23-95 62 22 25-107 68 28 15-118 90 32 18-124 78h-214Z"/>
    <path class="hcci-manga-exit" d="M1130 685H175l97-81-37-21 109-48-30-25 112-67-43-23 112-50-34-32 107-52-39-29 102-48-27-26 123-58-24-20 92-66-26-18L941-60h189Z"/>
  </svg>
  <div class="hcci-manga-flash"></div>`;
}

const PHASE = { blackout: 0, ink: 80, silhouette: 180, halftone: 320, impact: 520, hold: 760 };
const STRIKE = "cubic-bezier(.12,.76,.18,1)";
const CUT = "steps(1, end)";
const SILHOUETTE = "grayscale(1) brightness(.40) contrast(1.8)";
const HALFTONE = "grayscale(1) contrast(1.55)";

export function startMangaIntro(overlay: HTMLElement, holdAt: number) {
  const animations: Animation[] = [];
  if (!overlay.classList.contains("hcci-motion-full") || !overlay.animate) return { animations, audioDelay: 0 };
  // Reserve readable hold time at 800 ms. Beyond the reference duration only the hold grows.
  const speed = Math.min(1, (holdAt - 160) / PHASE.hold);
  const track = (selector: string, frames: Keyframe[], start: number, end: number, easing = "linear") => {
    for (const node of overlay.querySelectorAll(selector)) {
      animations.push(node.animate(frames, { delay: start * speed, duration: (end - start) * speed, easing, fill: "both" }));
    }
  };
  const offset = (time: number) => time / PHASE.impact;
  track(".hcci-manga-page", [
    { opacity: 0, transform: "scale(.65)", easing: CUT },
    { opacity: 1, transform: "scale(.73)", offset: offset(PHASE.ink), easing: STRIKE },
    { opacity: 1, transform: "scale(1.03)", offset: offset(PHASE.silhouette) },
    { opacity: 1, transform: "scale(1)", offset: offset(PHASE.halftone), easing: CUT },
    { opacity: 0, transform: "scale(1)" }
  ], PHASE.blackout, PHASE.impact);
  track(".hcci-manga-panel-glint", [
    { opacity: 0, transform: "scaleX(.1)" },
    { opacity: 1, transform: "scaleX(1)", offset: .32, easing: CUT },
    { opacity: 0, transform: "scaleX(1)" }
  ], 19, PHASE.ink);
  track(".hcci-visual", [
    { opacity: 1, transform: "none", easing: CUT },
    { opacity: 0, transform: "none", offset: PHASE.ink / PHASE.hold, easing: CUT },
    { opacity: 1, transform: "translate(-16vw, 4vh) rotate(-12deg) scale(.84)", offset: PHASE.silhouette / PHASE.hold, easing: STRIKE },
    { opacity: 1, transform: "translate(1.2vw,-.6vh) rotate(2deg) scale(.94)", offset: 255 / PHASE.hold },
    { opacity: 1, transform: "scale(.92)", offset: PHASE.halftone / PHASE.hold, easing: STRIKE },
    { opacity: 1, transform: "translate(-.3vw,.15vh) scale(.96)", offset: 352 / PHASE.hold, easing: STRIKE },
    { opacity: 1, transform: "none", offset: PHASE.impact / PHASE.hold },
    { opacity: 1, transform: "none" }
  ], PHASE.blackout, PHASE.hold);
  track(".hcci-portrait-frame", [
    { opacity: .065, easing: CUT }, { opacity: 1 }
  ], PHASE.blackout, PHASE.silhouette);
  track(".hcci-manga-artwork", [
    { filter: "brightness(.16)", easing: CUT },
    { filter: SILHOUETTE, offset: offset(PHASE.silhouette), easing: CUT },
    { filter: HALFTONE, offset: offset(PHASE.halftone), easing: CUT },
    { filter: "none" }
  ], PHASE.blackout, PHASE.impact);
  track(".hcci-manga-reveal-lines", [
    { opacity: 0, easing: CUT }, { opacity: 1 }
  ], PHASE.blackout, PHASE.halftone);
  track(".hcci-manga-dots", [
    { opacity: 0, easing: CUT }, { opacity: .27, offset: offset(PHASE.halftone), easing: CUT }, { opacity: 0 }
  ], PHASE.blackout, PHASE.impact);
  track(".hcci-manga-impact", [
    { opacity: 0, easing: CUT }, { opacity: 1, offset: .01, transform: "scale(1.06)", easing: CUT },
    { opacity: 1, transform: "scale(1.06)", offset: .29, easing: STRIKE },
    { opacity: 1, transform: "scale(1)" }
  ], PHASE.impact, PHASE.hold);
  track(".hcci-copy", [
    { opacity: 0, transform: "translate(12vw, -4vh) rotate(4deg) scale(1.16)" },
    { opacity: 1, transform: "translate(-.8vw, .4vh) rotate(-6deg) scale(1.035)", offset: .31, easing: CUT },
    { opacity: 1, transform: "translate(-.8vw, .4vh) rotate(-6deg) scale(1.035)", offset: .48, easing: STRIKE },
    { opacity: 1, transform: "rotate(-4deg)" }
  ], PHASE.impact, PHASE.hold, STRIKE);
  track(".hcci-manga-flash", [
    { opacity: 0 }, { opacity: "var(--flash-peak, .14)", offset: .1 }, { opacity: 0 }
  ], PHASE.impact, PHASE.impact + 38);
  track(".hcci-stage", [
    { transform: "none" }, { transform: "translateX(var(--hcci-shake))", offset: .18 },
    { transform: "translateX(calc(-.5 * var(--hcci-shake)))", offset: .44 }, { transform: "none" }
  ], PHASE.impact, PHASE.impact + 66);
  return { animations, audioDelay: PHASE.impact * speed };
}

export function startMangaExit(overlay: HTMLElement, duration: number) {
  if (!overlay.classList.contains("hcci-motion-full") || !overlay.animate) return [];
  return Array.from(overlay.querySelectorAll(".hcci-manga-exit"), (ink, index) => ink.animate([
    { transform: index === 0 ? "translate(-85%, -36%)" : "translate(85%, 36%)", opacity: 1 },
    { transform: index === 0 ? "translate(11%, 7%)" : "translate(-11%, -7%)", opacity: 1 }
  ], { duration: duration - index * 17, delay: index * 17, easing: "cubic-bezier(.48,.05,.82,.71)", fill: "both" }));
}
