import { getDifficultyProfile, DIFFICULTY_PROFILES } from "./difficulty.js";
import { getActiveApp, getMinigames, startMinigame } from "./minigame-runner.js";

export function createHackingApi({ moduleId, openLauncher }) {
  function applyVisualGlitchSetting(profile) {
    const preference = String(game.settings.get(moduleId, "visualGlitchIntensity") ?? "medium");
    const base = Number(profile.visualGlitchIntensity ?? 0.4);
    const visualGlitchIntensity = preference === "low"
      ? Math.min(base, 0.25)
      : preference === "high"
        ? Math.min(1, base + 0.2)
        : base;

    return { ...profile, visualGlitchIntensity };
  }

  function normalizeOptions(options = {}) {
    const defaultDc = Number(game.settings.get(moduleId, "defaultDc") ?? 15);
    const dc = Number(options.dc ?? defaultDc);
    const rollTotal = Number(options.rollTotal ?? dc);
    const profile = applyVisualGlitchSetting(options.profile ?? getDifficultyProfile(rollTotal, dc));
    return { ...options, dc, rollTotal, profile };
  }

  function startHack(options = {}) {
    const type = String(options.type ?? "node-intrusion");
    return startMinigame(type, normalizeOptions(options));
  }

  const api = {
    startHack,
    startNodeIntrusion: (options = {}) => startHack({ ...options, type: "node-intrusion" }),
    startSignalAlignment: (options = {}) => startHack({ ...options, type: "signal-alignment" }),
    openLauncher,
    getDifficultyProfile,
    difficultyProfiles: DIFFICULTY_PROFILES,
    getMinigames,
    getActiveApp,
    testNodeIntrusion: () => api.startNodeIntrusion({
      rollTotal: 17,
      dc: 15,
      onSuccess: (result) => console.log(`${moduleId} | Node Intrusion success`, result),
      onFailure: (result) => console.log(`${moduleId} | Node Intrusion failure`, result)
    }),
    testSignalAlignment: () => api.startSignalAlignment({
      rollTotal: 17,
      dc: 15,
      onSuccess: (result) => console.log(`${moduleId} | Signal Alignment success`, result),
      onFailure: (result) => console.log(`${moduleId} | Signal Alignment failure`, result)
    })
  };

  return api;
}
