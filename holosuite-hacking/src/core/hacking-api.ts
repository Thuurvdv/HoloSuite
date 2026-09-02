import { getDifficultyProfile, DIFFICULTY_PROFILES, normalizeQuickOutcome } from "./difficulty";
import { getActiveApp, getMinigames, startMinigame } from "./minigame-runner";
import { getRollOptions, rollSkillCheck } from "./check-roll";
import { actorIsOwnedByUser, escapeHtml, getActorById, getActorSkillOptions, getMissingSkillsWarning, getSkillData, getSkillModifier, getUserCharacter, resolveSkillId } from "./actor-skills";
import { supportsSystemSkillRoll } from "./system-roll";
import { createHackConfiguration, getConfigurationSkills } from "./hack-configuration";

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
    ...(profile.packetSwitchboard ?? {}),
    ...(profile.prismLock ?? {}),
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

export function createHackingApi({ moduleId, openLauncher, openConfiguration, createLiveController }: any) {
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
    const quickOutcome = normalizeQuickOutcome(options.quickOutcome);
    if (quickOutcome) {
      const profile = options.readOnly && options.profile?.profileId === quickOutcome
        ? options.profile
        : applyVisualGlitchSetting(applyProfileSettings(getDifficultyProfile(null, null, null, { quickOutcome })));
      return { ...options, quickOutcome, rollSource: "gm", dc: null, rollTotal: null, naturalRoll: null, profile };
    }
    const defaultDc = Number(game.settings.get(moduleId, "defaultDc") ?? 15);
    const dc = Number(options.dc ?? defaultDc);
    const rollTotal = Number(options.rollTotal ?? dc);
    const naturalRoll = options.naturalRoll === null || options.naturalRoll === undefined
      ? null
      : Number(options.naturalRoll);
    const rules = getRollOptions(options);
    const profile = applyVisualGlitchSetting(applyProfileSettings(options.profile ?? getDifficultyProfile(rollTotal, dc, naturalRoll, { ...rules, systemOutcome: options.systemOutcome })));
    return { ...options, ...rules, dc, rollTotal, profile };
  }

  function startHack(options: any = {}) {
    const type = String(options.type ?? "node-intrusion");
    return startMinigame(type, normalizeOptions(options));
  }

  async function runConfiguredHack(value: any, context: any = {}): Promise<boolean> {
    let config;
    try { config = createHackConfiguration(value); }
    catch (error) { ui.notifications?.warn?.(error.message); return false; }
    if (!getMinigames().some(minigame => minigame.id === config.minigameType)) {
      ui.notifications?.warn?.("The configured hacking minigame is unavailable.");
      return false;
    }
    const actor = context.actor ?? getActorById(context.actorId) ?? getUserCharacter(game.user);
    if (!config.quickOutcome && (!actor || !actorIsOwnedByUser(actor, game.user))) {
      ui.notifications?.warn?.("Choose a character you own before attempting this hack.");
      return false;
    }
    const skillId = resolveSkillId(actor, config.skillId);
    if (!config.quickOutcome && config.rollSource !== "sheet" && config.skillId && !getSkillData(actor, skillId)) {
      ui.notifications?.warn?.(`This character does not have the configured skill: ${config.skillLabel || config.skillId}.`);
      return false;
    }
    const label = String(context.label ?? "Hacking challenge");
    const result = config.quickOutcome ? { total: null, naturalRoll: null, rollSource: "gm" }
      : await rollSkillCheck({ ...config, actor, skillId, flavor: escapeHtml(label) });
    if (!config.quickOutcome && !Number.isFinite(result?.total)) return false;
    const live = createLiveController?.(config);
    return new Promise(resolve => {
      let settled = false;
      const finish = (success: boolean) => { if (!settled) { settled = true; resolve(success); } };
      try {
        const app = startHack({ ...config, ...result, type: config.minigameType, rollTotal: result.total,
          skillId, actorId: actor?.id ?? "", actorName: actor?.name ?? game.user?.name ?? "Hacker",
          userId: game.user?.id ?? "", challengeName: label, targetName: label,
          onLiveState: live?.publish, onLiveEnd: live?.end,
          onSuccess: () => finish(true), onFailure: () => finish(false) });
        if (!app) { live?.cancel(); finish(false); return; }
        const originalClose = app.close?.bind(app);
        if (originalClose) app.close = async (...args: any[]) => {
          try { return await originalClose(...args); }
          finally { live?.end(); finish(false); }
        };
        live?.start(app.getLiveSessionData?.());
      } catch (error) {
        live?.cancel();
        ui.notifications?.warn?.(`Could not start hacking: ${error.message}`);
        finish(false);
      }
    });
  }

  const api = {
    startHack,
    startNodeIntrusion: (options = {}) => startHack({ ...options, type: "node-intrusion" }),
    startSignalAlignment: (options = {}) => startHack({ ...options, type: "signal-alignment" }),
    startPacketSwitchboard: (options = {}) => startHack({ ...options, type: "packet-switchboard" }),
    startPrismLock: (options = {}) => startHack({ ...options, type: "prism-lock" }),
    openLauncher,
    createHackConfiguration,
    getConfigurationSkills,
    configureHack: (configuration = null, options = {}) => openConfiguration(api, configuration, options),
    runConfiguredHack,
    getRollOptions,
    rollSkillCheck,
    supportsSystemSkillRoll,
    getActorSkillOptions,
    getMissingSkillsWarning,
    getSkillData,
    getSkillModifier,
    resolveSkillId,
    getDifficultyProfile: (rollTotal = 0, dc = 10, naturalRoll = null, options: any = {}) => applyVisualGlitchSetting(applyProfileSettings(getDifficultyProfile(rollTotal, dc, naturalRoll, { ...getRollOptions(options), systemOutcome: options.systemOutcome }))),
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
    }),
    testPacketSwitchboard: () => api.startPacketSwitchboard({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {},
      onFailure: () => {}
    }),
    testPrismLock: () => api.startPrismLock({
      rollTotal: 17,
      dc: 15,
      onSuccess: () => {},
      onFailure: () => {}
    })
  };

  return api;
}
