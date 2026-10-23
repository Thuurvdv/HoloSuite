import { MODULE_ID } from "./constants";
import { getCameraPerformance } from "./performance";

export function cameraPerformance() {
  return getCameraPerformance(game.settings.get(MODULE_ID, "cameraQuality"), game.settings.get(MODULE_ID, "animateVideoTiles") !== false);
}

export function applyCameraEffects() {
  const value = Number(game.settings.get(MODULE_ID, "videoEffectIntensity"));
  const intensity = Number.isFinite(value) ? Math.max(0, Math.min(200, value)) / 100 : .5;
  const root = document.documentElement;
  root.style.setProperty("--security-camera-effect-intensity", String(intensity));
  root.classList.toggle("security-camera-effects-disabled", intensity === 0);
  root.classList.toggle("security-camera-reduced-effects", Boolean(game.settings.get(MODULE_ID, "reducedEffects")));
}

export function registerCameraSettings(performanceChanged: () => void) {
  game.settings.register(MODULE_ID, "cameraQuality", {
    name: "Camera Quality",
    hint: "Low: 480px every 2.5 seconds. Balanced: 640px every 1.5 seconds. High: 960px every 1.25 seconds. Lower settings reduce capture and network work for everyone.",
    scope: "world", config: true, type: String, default: "balanced",
    choices: { low: "Low", balanced: "Balanced", high: "High" },
    onChange: performanceChanged
  });
  game.settings.register(MODULE_ID, "animateVideoTiles", {
    name: "Animate Video Tiles",
    hint: "Play video backgrounds and tiles in live feeds. Turn this off to use still frames and reduce work on the GM's machine.",
    scope: "world", config: true, type: Boolean, default: true,
    onChange: performanceChanged
  });
  game.settings.register(MODULE_ID, "reducedEffects", {
    name: "Reduced Screen Effects",
    hint: "Remove animated screen effects and image filters on this computer. Camera status and access restrictions still apply.",
    scope: "client", config: true, type: Boolean, default: false,
    onChange: applyCameraEffects
  });
  game.settings.register(MODULE_ID, "videoEffectIntensity", {
    name: "Video Effect Intensity",
    hint: "Adjust static, scanlines, tint, flicker, and glitches for all viewers. Default: 50%. Use 0% to turn effects off or 100% for the original strength. Clean cameras have no effects.",
    scope: "world", config: true, type: Number, range: { min: 0, max: 200, step: 10 }, default: 50,
    onChange: applyCameraEffects
  });
  game.settings.register(MODULE_ID, "cameras", {
    name: "Security Cameras", hint: "Saved camera feeds for this world.",
    scope: "world", config: false, type: Object, default: {}
  });
}
