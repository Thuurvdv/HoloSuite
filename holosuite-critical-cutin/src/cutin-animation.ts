import { AUDIENCE, SETTINGS, debugLog, setting } from "./settings";
import { effectMarkup, getEffectPreset } from "./effect-presets";
import { MANGA_ACCENT, MANGA_STYLE, startMangaExit, startMangaIntro } from "./manga-overdrive";
import { startRiftExit, startRiftIntro } from "./rift-slash";

import { FATE_EXIT, FATE_STYLE, prepareFatePortrait, startFateExit, startFateIntro } from "./shattered-fate";

declare const foundry: any;
declare const game: any;

export type CutinPayload = {
  id?: string;
  messageId?: string;
  userId?: string | null;
  actorId?: string | null;
  userName?: string;
  actorName?: string;
  triggerKind?: "success" | "failure" | string;
  naturalResult?: number;
  threshold?: number;
  animationStyle?: string;
  blind?: boolean;
  whisper?: string[];
  imagePath?: string;
  fallbackImagePath?: string;
  audioPath?: string;
  overlayText?: string;
  accentColor?: string;
  textEnabled?: boolean;
  duration?: number;
  volume?: number;
  audience?: string;
  preview?: boolean;
};

const activeQueue: CutinPayload[] = [];
const seenPayloads = new Set<string>();
let playing = false;

function escapeHtml(value: any) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML.replace(/"/g, "&quot;");
}

function shouldPlayForAudience(payload: CutinPayload) {
  if (!payload.preview && setting(SETTINGS.suppressCutins) === true) return false;
  if (payload?.blind && !game.user?.isGM) return false;
  if (Array.isArray(payload?.whisper) && payload.whisper.length && !payload.whisper.includes(game.user?.id) && !game.user?.isGM) {
    return false;
  }

  const audience = payload?.audience ?? setting(SETTINGS.audience);
  if (audience === AUDIENCE.everyone) return true;
  if (audience === AUDIENCE.gm) return game.user?.isGM === true;
  if (audience === AUDIENCE.triggeringPlayer) return game.user?.id === payload?.userId;
  return true;
}

async function playAudio(src?: string, volume?: number) {
  if (!src) return;
  try {
    const worldVolume = Math.min(1, Math.max(0, Number(volume ?? setting(SETTINGS.volume) ?? 0.8)));
    const localVolume = Math.min(1, Math.max(0, Number(setting(SETTINGS.localVolume) ?? 1)));
    const baseVolume = worldVolume * localVolume;
    if (foundry.audio?.AudioHelper?.play) {
      return foundry.audio.AudioHelper.play({ src, volume: baseVolume, autoplay: true, loop: false }, false);
    }
    const globalAudioHelper = (globalThis as any).AudioHelper;
    if (globalAudioHelper?.play) {
      return globalAudioHelper.play({ src, volume: baseVolume, autoplay: true, loop: false }, false);
    }
    const interfaceVolume = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5);
    const audio = new Audio(src);
    audio.volume = baseVolume * interfaceVolume;
    await audio.play();
    return audio;
  } catch (error) {
    debugLog("Audio playback failed.", { src, error });
    return null;
  }
}

function stopAudio(handle: any) {
  try {
    if (!handle) return;
    if (typeof handle.stop === "function") {
      handle.stop();
      return;
    }
    if (typeof handle.pause === "function") {
      handle.pause();
      handle.currentTime = 0;
    }
  } catch (error) {
    debugLog("Audio stop failed.", error);
  }
}

export function createOverlay(payload: CutinPayload) {
  const preset = getEffectPreset(payload.animationStyle);
  const animationStyle = preset.id;
  const triggerKind = payload.triggerKind === "failure" ? "failure" : "success";
  const isRift = animationStyle === "rift";
  const isManga = animationStyle === MANGA_STYLE;
  const isFate = animationStyle === FATE_STYLE;
  const fullScreenArt = isRift || isManga || isFate;
  const accent = payload.accentColor || (isManga ? MANGA_ACCENT : (isRift || isFate) && triggerKind === "failure" ? "#ff4d7d" : "#69e8ff");
  const image = payload.imagePath
    ? `<img class="hcci-portrait" src="${escapeHtml(payload.imagePath)}" alt="">`
    : `<div class="hcci-portrait hcci-portrait-fallback"><i class="fa-solid fa-user-astronaut"></i></div>`;
  const titleLength = Math.max(1, String(payload.overlayText ?? "").length);
  const words = String(payload.overlayText ?? "").trim().split(/\s+/);
  const title = isFate && words.length > 1
    ? `${escapeHtml(words.slice(0, -1).join(" "))} <span>${escapeHtml(words.at(-1))}</span>`
    : escapeHtml(payload.overlayText);
  const text = payload.textEnabled && payload.overlayText
    ? `<div class="hcci-title" style="--hcci-title-chars: ${titleLength}">${title}</div>`
    : "";
  const actorName = payload.actorName || "";
  const configuredMotion = String(setting(SETTINGS.motionMode) ?? "system");
  const systemReduced = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  const motionMode = configuredMotion === "system" || (fullScreenArt && systemReduced && configuredMotion === "full")
    ? (systemReduced ? "reduced" : "full")
    : (["full", "reduced", "still"].includes(configuredMotion) ? configuredMotion : "full");
  const configuredFlash = String(setting(SETTINGS.flashMode) ?? "soft");
  const flashMode = ["full", "soft", "off"].includes(configuredFlash) ? configuredFlash : "soft";
  const configuredDetail = setting(SETTINGS.effectIntensity);
  const detail = ["low", "standard", "high"].includes(configuredDetail) ? configuredDetail : "standard";

  const overlay = document.createElement("div");
  overlay.className = `hcci-overlay hcci-style-${animationStyle} hcci-kind-${triggerKind} hcci-motion-${motionMode} hcci-flash-${flashMode} hcci-detail-${detail}`;
  overlay.style.setProperty("--hcci-accent", accent);
  const font = setting(SETTINGS.animationFont);
  overlay.style.setProperty("--hcci-font", font === "classic"
    ? '"Orbitron", "Eurostile", "Agency FB", Impact, sans-serif'
    : '"HCCI AICON", "Orbitron", sans-serif');
  const shake = Number(setting(SETTINGS.shakeIntensity) ?? 0.5);
  overlay.style.setProperty("--hcci-shake", `${preset.shake * (Number.isFinite(shake) ? Math.max(0, Math.min(1, shake)) : 0.5) * 9}px`);
  overlay.setAttribute("aria-hidden", "true");
  const effects = (motionMode === "full" || isManga) ? effectMarkup(animationStyle, detail) : "";
  overlay.innerHTML = `
    ${isManga || isFate ? "" : `<div class="${isRift ? "hcci-rift-flash" : "hcci-flash"}"></div>`}
    ${fullScreenArt ? effects : ""}
    <div class="hcci-atmosphere"></div>
    <section class="hcci-stage">
      <div class="hcci-visual">
      <div class="hcci-effects">${fullScreenArt ? "" : effects}</div>
      <div class="hcci-portrait-frame">
        ${isManga ? `<div class="hcci-manga-artwork">${image}</div><div class="hcci-manga-dots"></div>` : image}
      </div>
      ${isManga ? '<div class="hcci-manga-panel-glint"></div>' : ""}
      <div class="hcci-frame-accent"></div>
      </div>
      <div class="hcci-copy">
        ${text}
        ${actorName ? `<div class="hcci-subtitle">${escapeHtml(actorName)}</div>` : ""}
      </div>
    </section>
  `;
  const fracturePortrait = isFate && motionMode === "full";
  if (fracturePortrait) prepareFatePortrait(overlay);
  const portrait = overlay.querySelector<HTMLImageElement>("img.hcci-portrait");
  if (portrait && motionMode === "full" && (animationStyle === "shatter" || animationStyle === "overdrive")) {
    const fragments = [
      'polygon(0 0,50% 0,50% 50%)', 'polygon(50% 0,100% 0,50% 50%)',
      'polygon(100% 0,100% 100%,50% 50%)', 'polygon(100% 100%,50% 100%,50% 50%)',
      'polygon(50% 100%,0 100%,50% 50%)', 'polygon(0 100%,0 0,50% 50%)'
    ];
    for (let index = 0; index < 6; index++) {
      const echo = document.createElement("div");
      echo.className = "hcci-portrait-echo";
      echo.style.setProperty("--piece", String(index));
      echo.style.setProperty("--dx", `${index % 2 ? 1 : -1}`);
      echo.style.setProperty("--dy", `${index < 3 ? -1 : 1}`);
      echo.style.clipPath = animationStyle === "shatter" ? fragments[index] : `inset(${index * 100 / 6}% 0 ${100 - (index + 1) * 100 / 6}% 0)`;
      const fragment = portrait.cloneNode() as HTMLImageElement;
      fragment.className = "";
      echo.appendChild(fragment);
      overlay.querySelector(".hcci-visual")!.appendChild(echo);
    }
  }
  portrait?.addEventListener("error", () => {
    const fallbackPath = payload.preview ? payload.fallbackImagePath : undefined;
    if (fallbackPath && portrait.getAttribute("src") !== fallbackPath) {
      portrait.src = fallbackPath;
      overlay.querySelectorAll<HTMLImageElement>(".hcci-portrait-echo img").forEach(image => { image.src = fallbackPath; });
      if (fracturePortrait) prepareFatePortrait(overlay);
      return;
    }
    overlay.querySelectorAll(".hcci-portrait-echo").forEach(echo => echo.remove());
    const fallback = document.createElement("div");
    fallback.className = "hcci-portrait hcci-portrait-fallback";
    fallback.innerHTML = '<i class="fa-solid fa-user-astronaut"></i>';
    portrait.replaceWith(fallback);
    if (fracturePortrait) prepareFatePortrait(overlay);
  });
  return overlay;
}

async function playNow(payload: CutinPayload) {
  if (!shouldPlayForAudience(payload)) return;

  const requestedDuration = Number(payload.duration ?? setting(SETTINGS.duration) ?? 2500);
  const duration = Math.min(8000, Math.max(800, Number.isFinite(requestedDuration) ? requestedDuration : 2500));
  const overlay = createOverlay(payload);
  overlay.style.setProperty("--hcci-duration", `${duration}ms`);
  // Compress the entrance at the shortest duration; longer settings extend the hold.
  overlay.style.setProperty("--hcci-intro", `${Math.min(1000, (duration - 180) * 0.85)}ms`);
  let finished = false;
  let audioHandle: any;
  let timer: ReturnType<typeof setTimeout>;
  let audioTimer: ReturnType<typeof setTimeout> | undefined;
  let cinematicAnimations: Animation[] = [];
  let onKeyDown: (event: KeyboardEvent) => void;
  try {
    document.body.appendChild(overlay);
    const isFate = overlay.classList.contains(`hcci-style-${FATE_STYLE}`);
    const exitDuration = isFate ? FATE_EXIT : 180;
    const holdAt = duration - exitDuration;
    const isRift = overlay.classList.contains("hcci-style-rift");
    const isManga = overlay.classList.contains(`hcci-style-${MANGA_STYLE}`);
    const intro = isFate ? startFateIntro(overlay, holdAt) : isManga ? startMangaIntro(overlay, holdAt) : isRift ? startRiftIntro(overlay, holdAt) : undefined;
    if (intro) cinematicAnimations = intro.animations;
    const startAudio = () => {
      void playAudio(payload.audioPath, payload.volume).then(handle => {
        if (finished) stopAudio(handle);
        else audioHandle = handle;
      });
    };
    if (payload.audioPath && intro?.audioDelay) audioTimer = window.setTimeout(startAudio, intro.audioDelay);
    else startAudio();
    await new Promise<void>((resolve) => {
      timer = window.setTimeout(finish, holdAt);
      function finish() {
        window.clearTimeout(timer);
        globalThis.removeEventListener("keydown", onKeyDown);
        resolve();
      }
      onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") finish();
      };
      globalThis.addEventListener("keydown", onKeyDown);
    });
    finished = true;
    window.clearTimeout(audioTimer);
    stopAudio(audioHandle);
    audioHandle = null;
    overlay.classList.add("hcci-exiting");
    if (isFate) cinematicAnimations.push(...startFateExit(overlay, exitDuration));
    else if (isManga) cinematicAnimations.push(...startMangaExit(overlay, exitDuration));
    else if (isRift) cinematicAnimations.push(...startRiftExit(overlay, exitDuration));
    await new Promise((resolve) => window.setTimeout(resolve, exitDuration));
  } finally {
    finished = true;
    window.clearTimeout(timer);
    window.clearTimeout(audioTimer);
    cinematicAnimations.forEach(animation => animation.cancel());
    if (onKeyDown) globalThis.removeEventListener("keydown", onKeyDown);
    stopAudio(audioHandle);
    overlay.remove();
  }
}

export async function previewCutin(payload: CutinPayload) {
  if (!game.user?.isGM || playing) return false;
  await playCutin({
    ...payload,
    id: foundry.utils.randomID(),
    userId: game.user?.id ?? null,
    audience: AUDIENCE.gm,
    preview: true
  });
  return true;
}

async function drainQueue() {
  if (playing) return;
  playing = true;
  try {
    while (activeQueue.length) {
      const payload = activeQueue.shift();
      try { await playNow(payload); }
      catch (error) { debugLog("Cut-in playback failed; continuing queue.", error); }
    }
  } finally {
    playing = false;
  }
}

export function playCutin(payload: CutinPayload | null | undefined) {
  if (!payload) return;
  if (payload.id) {
    if (seenPayloads.has(payload.id)) return;
    seenPayloads.add(payload.id);
    const oldest = seenPayloads.values().next().value;
    if (seenPayloads.size > 100 && oldest) seenPayloads.delete(oldest);
  }
  activeQueue.push(payload);
  if (activeQueue.length > 3) activeQueue.splice(1, activeQueue.length - 3);
  return drainQueue();
}
