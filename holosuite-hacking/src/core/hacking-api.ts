import { getDifficultyProfile, DIFFICULTY_PROFILES } from "./difficulty";
import { getActiveApp, getMinigames, startMinigame } from "./minigame-runner";

declare const game: any;
declare const ui: any;

function isPlainObject(value: any) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeProfile(base: any, override: any): any {
  if (!isPlainObject(override)) return base;
  const merged = { ...base };
  for (const [key, value] of Object.entries(override)) {
    merged[key] = isPlainObject(value) && isPlainObject(merged[key])
      ? mergeProfile(merged[key], value)
      : value;
  }
  return merged;
}

function flattenProfileTuning(profile: any) {
  return {
    ...profile,
    ...(profile.nodeIntrusion ?? {}),
    ...(profile.signalAlignment ?? {}),
    allowMainPathFirewalls: profile.nodeIntrusion?.allowFirewallOnMainPath ?? profile.allowMainPathFirewalls
  };
}

function readProfileOverrides(moduleId: string) {
  const raw = String(game.settings.get(moduleId, "difficultyProfileOverrides") ?? "").trim();
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return isPlainObject(parsed) ? parsed : {};
  } catch (error) {
    console.warn(`${moduleId} | Difficulty profile overrides must be valid JSON.`, error);
    ui.notifications?.warn?.("HoloSuite Hacking difficulty profile overrides contain invalid JSON.");
    return {};
  }
}

export function createHackingApi({ moduleId, openLauncher }: any) {
  function applyProfileSettings(profile: any) {
    const profileId = String(profile.profileId ?? profile.id ?? "");
    const overrides = readProfileOverrides(moduleId);
    const profileOverride = overrides[profileId];
    const tunedProfile = flattenProfileTuning(mergeProfile(profile, profileOverride));
    const takeoverSeconds = Number(game.settings.get(moduleId, "nodeTakeoverDurationSeconds") ?? 0);
    if (Number.isFinite(takeoverSeconds) && takeoverSeconds > 0) {
      return {
        ...tunedProfile,
        nodeIntrusion: {
          ...(tunedProfile.nodeIntrusion ?? {}),
          claimDurationSeconds: takeoverSeconds
        },
        claimDurationSeconds: takeoverSeconds
      };
    }
    return tunedProfile;
  }

  function applyVisualGlitchSetting(profile: any) {
    const preference = String(game.settings.get(moduleId, "visualGlitchIntensity") ?? "medium");
    const base = Number(profile.visualGlitchIntensity ?? 0.4);
    const visualGlitchIntensity = preference === "low"
      ? Math.min(base, 0.25)
      : preference === "high"
        ? Math.min(1, base + 0.2)
        : base;

    return { ...profile, visualGlitchIntensity };
  }

  function normalizeOptions(options: any = {}) {
    const defaultDc = Number(game.settings.get(moduleId, "defaultDc") ?? 15);
    const dc = Number(options.dc ?? defaultDc);
    const rollTotal = Number(options.rollTotal ?? dc);
    const naturalRoll = options.naturalRoll === null || options.naturalRoll === undefined
      ? null
      : Number(options.naturalRoll);
    const profile = applyVisualGlitchSetting(applyProfileSettings(options.profile ?? getDifficultyProfile(rollTotal, dc, naturalRoll)));
    return { ...options, dc, rollTotal, profile };
  }

  function startHack(options: any = {}) {
    const type = String(options.type ?? "node-intrusion");
    return startMinigame(type, normalizeOptions(options));
  }

  const api = {
    startHack,
    startNodeIntrusion: (options = {}) => startHack({ ...options, type: "node-intrusion" }),
    startSignalAlignment: (options = {}) => startHack({ ...options, type: "signal-alignment" }),
    openLauncher,
    getDifficultyProfile: (rollTotal = 0, dc = 10, naturalRoll = null) => applyVisualGlitchSetting(applyProfileSettings(getDifficultyProfile(rollTotal, dc, naturalRoll))),
    difficultyProfiles: DIFFICULTY_PROFILES,
    getMinigames,
    getActiveApp,
    testNodeIntrusion: () => api.startNodeIntrusion({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {},
      onFailure: () => {}
    }),
    testSignalAlignment: () => api.startSignalAlignment({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {},
      onFailure: () => {}
    })
  };

  return api;
}
