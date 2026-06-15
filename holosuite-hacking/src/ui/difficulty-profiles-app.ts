import { DIFFICULTY_PROFILES } from "../core/difficulty";

declare const foundry: any;
declare const game: any;
declare const ui: any;

const MODULE_ID = "holosuite-hacking";
const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/difficulty-profiles.html`;
const LegacyFormApplication = (globalThis as any).FormApplication ?? (globalThis as any).foundry?.appv1?.api?.FormApplication;

const PROFILE_IDS = [
  "critical_success",
  "strong_success",
  "success",
  "failure_but_playable",
  "critical_failure"
];

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

function readOverrides() {
  const raw = String(game.settings.get(MODULE_ID, "difficultyProfileOverrides") ?? "").trim();
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return isPlainObject(parsed) ? parsed : {};
  } catch (error) {
    console.warn(`${MODULE_ID} | Difficulty profile overrides must be valid JSON.`, error);
    return {};
  }
}

function numberValue(formData: FormData, key: string, fallback: number) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function checkboxValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getProfileConstraints(nodeCountInput: number, decoyCountInput: number, routeCountInput: number, allowProtectedRouteFirewalls: boolean) {
  const nodeCount = clamp(Math.round(nodeCountInput), 6, 40);
  const maxDecoys = Math.max(0, nodeCount - 4);
  const decoyCount = clamp(Math.round(decoyCountInput), 0, maxDecoys);
  const branchCount = Math.max(0, nodeCount - decoyCount);
  const mainPathLength = clamp(Math.round(branchCount * 0.48), Math.min(6, branchCount), branchCount);
  const maxRoutes = mainPathLength >= 5 ? 3 : 1;
  const routeCount = clamp(Math.round(routeCountInput), 1, maxRoutes);
  const protectedNodes = mainPathLength + Math.max(0, routeCount - 1);
  const maxFirewalls = allowProtectedRouteFirewalls
    ? Math.max(0, nodeCount - decoyCount - 2)
    : Math.max(0, nodeCount - decoyCount - protectedNodes);

  return {
    nodeCount,
    maxDecoys,
    decoyCount,
    mainPathLength,
    maxRoutes,
    routeCount,
    protectedNodes,
    maxFirewalls
  };
}

function normalizeNodeIntrusionProfile(formData: FormData, prefix: string, base: any) {
  const nodeCount = numberValue(formData, `${prefix}nodeCount`, base.nodeIntrusion.nodeCount);
  const decoyCount = numberValue(formData, `${prefix}decoyCount`, base.nodeIntrusion.decoyCount);
  const routeCount = numberValue(formData, `${prefix}routeCount`, base.nodeIntrusion.routeCount ?? 2);
  const allowFirewallOnMainPath = checkboxValue(formData, `${prefix}allowFirewallOnMainPath`);
  const constraints = getProfileConstraints(nodeCount, decoyCount, routeCount, allowFirewallOnMainPath);

  return {
    nodeCount: constraints.nodeCount,
    firewallCount: clamp(Math.round(numberValue(formData, `${prefix}firewallCount`, base.nodeIntrusion.firewallCount)), 0, constraints.maxFirewalls),
    decoyCount: constraints.decoyCount,
    routeCount: constraints.routeCount,
    radarEnabled: checkboxValue(formData, `${prefix}radarEnabled`),
    claimDurationSeconds: clamp(numberValue(formData, `${prefix}claimDurationSeconds`, base.nodeIntrusion.claimDurationSeconds ?? 0.5), 0.1, 5),
    firewallClaimMultiplier: clamp(numberValue(formData, `${prefix}firewallClaimMultiplier`, base.nodeIntrusion.firewallClaimMultiplier ?? 1.75), 1, 5),
    firewallPenaltySeconds: clamp(Math.round(numberValue(formData, `${prefix}firewallPenaltySeconds`, base.nodeIntrusion.firewallPenaltySeconds ?? 6)), 0, 60),
    decoyPenaltySeconds: clamp(Math.round(numberValue(formData, `${prefix}decoyPenaltySeconds`, base.nodeIntrusion.decoyPenaltySeconds ?? 4)), 0, 60),
    showTarget: checkboxValue(formData, `${prefix}showTarget`),
    allowFirewallOnMainPath
  };
}

function getDefaultProfileView(id: string) {
  const base = (DIFFICULTY_PROFILES as any)[id];
  const constraints = getProfileConstraints(
    Number(base.nodeIntrusion.nodeCount),
    Number(base.nodeIntrusion.decoyCount),
    Number(base.nodeIntrusion.routeCount ?? 2),
    Boolean(base.nodeIntrusion.allowFirewallOnMainPath)
  );
  return {
    traceDurationSeconds: Number(base.traceDurationSeconds ?? 60),
    hintsEnabled: Boolean(base.hintsEnabled),
    visualGlitchIntensity: Number(base.visualGlitchIntensity ?? 0.4),
    nodeIntrusion: {
      nodeCount: constraints.nodeCount,
      firewallCount: clamp(Number(base.nodeIntrusion.firewallCount ?? 0), 0, constraints.maxFirewalls),
      decoyCount: constraints.decoyCount,
      routeCount: constraints.routeCount,
      radarEnabled: Boolean(base.nodeIntrusion.radarEnabled ?? Number(base.nodeIntrusion.radarRange ?? 0) > 0),
      claimDurationSeconds: Number(base.nodeIntrusion.claimDurationSeconds ?? 0.5),
      firewallClaimMultiplier: Number(base.nodeIntrusion.firewallClaimMultiplier ?? 1.75),
      firewallPenaltySeconds: Number(base.nodeIntrusion.firewallPenaltySeconds ?? 6),
      decoyPenaltySeconds: Number(base.nodeIntrusion.decoyPenaltySeconds ?? 4),
      showTarget: Boolean(base.nodeIntrusion.showTarget),
      allowFirewallOnMainPath: Boolean(base.nodeIntrusion.allowFirewallOnMainPath)
    }
  };
}

export class DifficultyProfilesApp extends LegacyFormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-hacking-difficulty-profiles",
      title: "HoloSuite Hacking Difficulty Profiles",
      classes: ["holosuite-hacking-profile-window"],
      template: TEMPLATE_PATH,
      width: 720,
      height: "auto",
      closeOnSubmit: true,
      submitOnChange: false,
      submitOnClose: false
    });
  }

  getData() {
    const overrides = readOverrides();
    const profiles = PROFILE_IDS.map((id) => {
      const base = (DIFFICULTY_PROFILES as any)[id];
      const profile = mergeProfile(base, overrides[id]);
      const nodeCount = Number(profile.nodeIntrusion?.nodeCount ?? 12);
      const decoyCount = Number(profile.nodeIntrusion?.decoyCount ?? 0);
      const routeCount = Number(profile.nodeIntrusion?.routeCount ?? 2);
      const allowFirewallOnMainPath = Boolean(profile.nodeIntrusion?.allowFirewallOnMainPath);
      const constraints = getProfileConstraints(nodeCount, decoyCount, routeCount, allowFirewallOnMainPath);
      return {
        id,
        label: profile.label,
        traceDurationSeconds: Number(profile.traceDurationSeconds ?? 60),
        hintsEnabled: Boolean(profile.hintsEnabled),
        visualGlitchIntensity: Number(profile.visualGlitchIntensity ?? 0.4),
        nodeIntrusion: {
          nodeCount: constraints.nodeCount,
          firewallCount: clamp(Number(profile.nodeIntrusion?.firewallCount ?? 0), 0, constraints.maxFirewalls),
          decoyCount: constraints.decoyCount,
          routeCount: constraints.routeCount,
          radarEnabled: Boolean(profile.nodeIntrusion?.radarEnabled ?? Number(profile.nodeIntrusion?.radarRange ?? 0) > 0),
          claimDurationSeconds: Number(profile.nodeIntrusion?.claimDurationSeconds ?? 0.5),
          firewallClaimMultiplier: Number(profile.nodeIntrusion?.firewallClaimMultiplier ?? 1.75),
          firewallPenaltySeconds: Number(profile.nodeIntrusion?.firewallPenaltySeconds ?? 6),
          decoyPenaltySeconds: Number(profile.nodeIntrusion?.decoyPenaltySeconds ?? 4),
          showTarget: Boolean(profile.nodeIntrusion?.showTarget),
          allowFirewallOnMainPath
        },
        constraints
      };
    });

    return {
      profiles,
      hasOverrides: Object.keys(overrides).length > 0
    };
  }

  activateListeners(html: any) {
    super.activateListeners(html);
    this.syncConstraints(html);
    html.find("[data-profile-section] input").on("input change", (event: Event) => {
      const section = (event.currentTarget as HTMLElement | null)?.closest("[data-profile-section]");
      if (section) this.syncProfileConstraints(section as HTMLElement);
    });
    html.find("[data-action='reset-profile']").on("click", (event: Event) => {
      event.preventDefault();
      const section = (event.currentTarget as HTMLElement | null)?.closest("[data-profile-section]");
      if (section) this.resetProfileSection(section as HTMLElement);
    });
    html.find("[data-action='reset-profiles']").on("click", async (event: Event) => {
      event.preventDefault();
      await game.settings.set(MODULE_ID, "difficultyProfileOverrides", "");
      ui.notifications?.info?.("HoloSuite Hacking difficulty profiles reset to defaults.");
      this.render(false);
    });
  }

  syncConstraints(html: any) {
    html.find("[data-profile-section]").each((_index: number, section: HTMLElement) => this.syncProfileConstraints(section));
  }

  syncProfileConstraints(section: HTMLElement) {
    const profileId = section.dataset.profileId ?? "";
    const getInput = (field: string) => section.querySelector<HTMLInputElement>(`[name="${profileId}.${field}"]`);
    const nodeInput = getInput("nodeCount");
    const decoyInput = getInput("decoyCount");
    const routeInput = getInput("routeCount");
    const firewallInput = getInput("firewallCount");
    const allowInput = getInput("allowFirewallOnMainPath");
    if (!nodeInput || !decoyInput || !routeInput || !firewallInput) return;

    const constraints = getProfileConstraints(
      Number(nodeInput.value),
      Number(decoyInput.value),
      Number(routeInput.value),
      Boolean(allowInput?.checked)
    );

    nodeInput.value = String(constraints.nodeCount);
    decoyInput.max = String(constraints.maxDecoys);
    decoyInput.value = String(constraints.decoyCount);
    routeInput.max = String(constraints.maxRoutes);
    routeInput.value = String(constraints.routeCount);
    firewallInput.max = String(constraints.maxFirewalls);
    firewallInput.value = String(clamp(Math.round(Number(firewallInput.value) || 0), 0, constraints.maxFirewalls));

    section.querySelectorAll<HTMLElement>("[data-constraint]").forEach((element) => {
      const key = element.dataset.constraint as keyof typeof constraints;
      if (key && constraints[key] !== undefined) element.textContent = String(constraints[key]);
    });
  }

  resetProfileSection(section: HTMLElement) {
    const profileId = section.dataset.profileId ?? "";
    if (!PROFILE_IDS.includes(profileId)) return;
    const defaults = getDefaultProfileView(profileId);
    const values: Record<string, any> = {
      traceDurationSeconds: defaults.traceDurationSeconds,
      visualGlitchIntensity: defaults.visualGlitchIntensity,
      nodeCount: defaults.nodeIntrusion.nodeCount,
      routeCount: defaults.nodeIntrusion.routeCount,
      firewallCount: defaults.nodeIntrusion.firewallCount,
      decoyCount: defaults.nodeIntrusion.decoyCount,
      claimDurationSeconds: defaults.nodeIntrusion.claimDurationSeconds,
      firewallClaimMultiplier: defaults.nodeIntrusion.firewallClaimMultiplier,
      firewallPenaltySeconds: defaults.nodeIntrusion.firewallPenaltySeconds,
      decoyPenaltySeconds: defaults.nodeIntrusion.decoyPenaltySeconds
    };
    for (const [field, value] of Object.entries(values)) {
      const input = section.querySelector<HTMLInputElement>(`[name="${profileId}.${field}"]`);
      if (input) input.value = String(value);
    }
    const toggles: Record<string, boolean> = {
      hintsEnabled: defaults.hintsEnabled,
      radarEnabled: defaults.nodeIntrusion.radarEnabled,
      showTarget: defaults.nodeIntrusion.showTarget,
      allowFirewallOnMainPath: defaults.nodeIntrusion.allowFirewallOnMainPath
    };
    for (const [field, checked] of Object.entries(toggles)) {
      const input = section.querySelector<HTMLInputElement>(`[name="${profileId}.${field}"]`);
      if (input) input.checked = checked;
    }
    this.syncProfileConstraints(section);
  }

  async _updateObject(_event: Event, formDataSource: any) {
    const formData = formDataSource instanceof FormData
      ? formDataSource
      : new FormData(this.form as HTMLFormElement);
    const overrides: any = {};

    for (const id of PROFILE_IDS) {
      const base = (DIFFICULTY_PROFILES as any)[id];
      const prefix = `${id}.`;
      overrides[id] = {
        traceDurationSeconds: clamp(Math.round(numberValue(formData, `${prefix}traceDurationSeconds`, base.traceDurationSeconds)), 5, 300),
        hintsEnabled: checkboxValue(formData, `${prefix}hintsEnabled`),
        visualGlitchIntensity: clamp(numberValue(formData, `${prefix}visualGlitchIntensity`, base.visualGlitchIntensity), 0, 1),
        nodeIntrusion: normalizeNodeIntrusionProfile(formData, prefix, base)
      };
    }

    await game.settings.set(MODULE_ID, "difficultyProfileOverrides", JSON.stringify(overrides));
    ui.notifications?.info?.("HoloSuite Hacking difficulty profiles saved.");
  }
}
