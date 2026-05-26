import { AUDIENCE, SETTINGS, debugLog, setting } from "./settings.js";

const activeQueue = [];
const seenPayloads = new Set();
let playing = false;

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

function shouldPlayForAudience(payload) {
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

async function playAudio(src, volume) {
  if (!src) return;
  try {
    const effectiveVolume = Math.min(1, Math.max(0, Number(volume ?? setting(SETTINGS.volume) ?? 0.8)));
    if (foundry.audio?.AudioHelper?.play) {
      return foundry.audio.AudioHelper.play({ src, volume: effectiveVolume, autoplay: true, loop: false }, false);
    }
    if (globalThis.AudioHelper?.play) {
      return globalThis.AudioHelper.play({ src, volume: effectiveVolume, autoplay: true, loop: false }, false);
    }
    const audio = new Audio(src);
    audio.volume = effectiveVolume;
    await audio.play();
    return audio;
  } catch (error) {
    debugLog("Audio playback failed.", { src, error });
    return null;
  }
}

function stopAudio(handle) {
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

function createOverlay(payload) {
  const accent = payload.accentColor || "#69e8ff";
  const animationStyle = ["strike", "breach", "signal"].includes(payload.animationStyle) ? payload.animationStyle : "strike";
  const image = payload.imagePath
    ? `<img class="hcci-portrait" src="${escapeHtml(payload.imagePath)}" alt="">`
    : `<div class="hcci-portrait hcci-portrait-fallback"><i class="fa-solid fa-user-astronaut"></i></div>`;
  const titleLength = Math.max(1, String(payload.overlayText ?? "").length);
  const text = payload.textEnabled && payload.overlayText
    ? `<div class="hcci-title" style="--hcci-title-chars: ${titleLength}">${escapeHtml(payload.overlayText)}</div>`
    : "";
  const actorName = payload.actorName || payload.userName || "";

  const overlay = document.createElement("div");
  overlay.className = `hcci-overlay hcci-style-${animationStyle}`;
  overlay.style.setProperty("--hcci-accent", accent);
  overlay.innerHTML = `
    <div class="hcci-flash"></div>
    <div class="hcci-noise"></div>
    <div class="hcci-ring hcci-ring-a"></div>
    <div class="hcci-ring hcci-ring-b"></div>
    <div class="hcci-orbit-glow"></div>
    <div class="hcci-panel hcci-panel-a"></div>
    <div class="hcci-panel hcci-panel-b"></div>
    <div class="hcci-tear hcci-tear-top"><span></span></div>
    <div class="hcci-tear hcci-tear-bottom"><span></span></div>
    <div class="hcci-triangle hcci-triangle-a"></div>
    <div class="hcci-triangle hcci-triangle-b"></div>
    <div class="hcci-triangle hcci-triangle-c"></div>
    <div class="hcci-sparkle hcci-sparkle-a"></div>
    <div class="hcci-sparkle hcci-sparkle-b"></div>
    <div class="hcci-scan hcci-scan-a"></div>
    <div class="hcci-scan hcci-scan-b"></div>
    <div class="hcci-scan hcci-scan-c"></div>
    <div class="hcci-diagonal hcci-diagonal-a"></div>
    <div class="hcci-diagonal hcci-diagonal-b"></div>
    <section class="hcci-stage">
      <div class="hcci-portrait-frame">
        ${image}
        <div class="hcci-frame-lightning hcci-frame-lightning-a"></div>
        <div class="hcci-frame-lightning hcci-frame-lightning-b"></div>
      </div>
      <div class="hcci-copy">
        ${text}
        ${actorName ? `<div class="hcci-subtitle">${escapeHtml(actorName)}</div>` : ""}
      </div>
    </section>
  `;
  return overlay;
}

async function playNow(payload) {
  if (!shouldPlayForAudience(payload)) return;

  const duration = Math.min(8000, Math.max(800, Number(payload.duration ?? setting(SETTINGS.duration) ?? 2500)));
  const overlay = createOverlay(payload);
  overlay.style.setProperty("--hcci-duration", `${duration}ms`);
  document.body.appendChild(overlay);
  document.body.classList.add("hcci-screen-shake");
  const audioHandlePromise = playAudio(payload.audioPath, payload.volume);

  await new Promise((resolve) => window.setTimeout(resolve, Math.max(250, duration - 250)));
  stopAudio(await audioHandlePromise);
  overlay.classList.add("hcci-exiting");
  await new Promise((resolve) => window.setTimeout(resolve, 250));
  overlay.remove();
  document.body.classList.remove("hcci-screen-shake");
}

async function drainQueue() {
  if (playing) return;
  playing = true;
  while (activeQueue.length) {
    const payload = activeQueue.shift();
    await playNow(payload);
  }
  playing = false;
}

export function playCutin(payload) {
  if (!payload) return;
  if (payload.id) {
    if (seenPayloads.has(payload.id)) return;
    seenPayloads.add(payload.id);
    if (seenPayloads.size > 100) seenPayloads.delete(seenPayloads.values().next().value);
  }
  activeQueue.push(payload);
  if (activeQueue.length > 3) activeQueue.splice(1, activeQueue.length - 3);
  drainQueue();
}
