import { DIFFICULTY_PROFILES } from "../core/difficulty";
import { getLegacyFormApplicationBase } from "../../../shared/src/application-base";

declare const foundry: any;
declare const game: any;
declare const ui: any;

const MODULE_ID = "holosuite-hacking";
const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/difficulty-profiles.html`;
const LegacyFormApplication = getLegacyFormApplicationBase();

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

function clampNumberInput(input: HTMLInputElement) {
  if (input.type !== "number" || input.value === "") return;
  const value = Number(input.value);
  if (!Number.isFinite(value)) return;
  const min = input.min === "" ? -Infinity : Number(input.min);
  const max = input.max === "" ? Infinity : Number(input.max);
  const clamped = clamp(value, min, max);
  if (clamped !== value) input.value = String(clamped);
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
    traceDurationSeconds: clamp(Math.round(numberValue(formData, `${prefix}nodeTraceDurationSeconds`, base.nodeIntrusion.traceDurationSeconds ?? base.traceDurationSeconds ?? 60)), 5, 300),
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

function normalizeSignalAlignmentProfile(formData: FormData, prefix: string, base: any) {
  return {
    traceDurationSeconds: clamp(Math.round(numberValue(formData, `${prefix}signalTraceDurationSeconds`, base.signalAlignment.traceDurationSeconds ?? base.traceDurationSeconds ?? 60)), 5, 300),
    channelCount: clamp(Math.round(numberValue(formData, `${prefix}signalChannelCount`, base.signalAlignment.channelCount ?? 3)), 2, 5),
    tolerance: clamp(numberValue(formData, `${prefix}signalTolerance`, base.signalAlignment.tolerance ?? 5), 0.5, 20),
    signalDriftSpeed: clamp(numberValue(formData, `${prefix}signalDriftSpeed`, base.signalAlignment.signalDriftSpeed ?? 0), 0, 5),
    noiseLevel: clamp(numberValue(formData, `${prefix}signalNoiseLevel`, base.signalAlignment.noiseLevel ?? 0), 0, 1),
    lockHoldSeconds: clamp(numberValue(formData, `${prefix}signalLockHoldSeconds`, base.signalAlignment.lockHoldSeconds ?? 4), 0.5, 30),
    targetRevealRadius: clamp(numberValue(formData, `${prefix}signalTargetRevealRadius`, base.signalAlignment.targetRevealRadius ?? 100), 0, 100),
    destabilizationPenaltySeconds: clamp(numberValue(formData, `${prefix}signalDestabilizationPenaltySeconds`, base.signalAlignment.destabilizationPenaltySeconds ?? 0), 0, 60)
  };
}

function normalizePacketSwitchboardProfile(formData: FormData, prefix: string, base: any) {
  const packet = base.packetSwitchboard ?? {};
  const laneCount = clamp(Math.round(numberValue(formData, `${prefix}packetLaneCount`, packet.laneCount ?? 4)), 3, 6);
  return {
    traceDurationSeconds: clamp(Math.round(numberValue(formData, `${prefix}packetTraceDurationSeconds`, packet.traceDurationSeconds ?? base.traceDurationSeconds ?? 60)), 5, 300),
    laneCount,
    columnCount: clamp(Math.round(numberValue(formData, `${prefix}packetColumnCount`, packet.columnCount ?? 6)), laneCount - 1, 8),
    deliveryGoal: clamp(Math.round(numberValue(formData, `${prefix}packetDeliveryGoal`, packet.deliveryGoal ?? 7)), 3, 20),
    packetIntervalSeconds: clamp(numberValue(formData, `${prefix}packetIntervalSeconds`, packet.packetIntervalSeconds ?? 2), 0.35, 10),
    packetStepSeconds: clamp(numberValue(formData, `${prefix}packetStepSeconds`, packet.packetStepSeconds ?? 0.8), 0.25, 5),
    previewCount: clamp(Math.round(numberValue(formData, `${prefix}packetPreviewCount`, packet.previewCount ?? 2)), 0, 6),
    misroutePenaltySeconds: clamp(numberValue(formData, `${prefix}packetMisroutePenaltySeconds`, packet.misroutePenaltySeconds ?? 5), 0, 60),
    maxActivePackets: clamp(Math.round(numberValue(formData, `${prefix}packetMaxActivePackets`, packet.maxActivePackets ?? 2)), 1, 6),
    entryHoldSeconds: clamp(numberValue(formData, `${prefix}packetEntryHoldSeconds`, packet.entryHoldSeconds ?? 1.5), 0, 10)
  };
}

function normalizePrismLockProfile(formData: FormData, prefix: string, base: any) {
  const prism = base.prismLock ?? {};
  const ringCount = clamp(Math.round(numberValue(formData, `${prefix}prismRingCount`, prism.ringCount ?? 3)), 2, 4);
  const slotCount = clamp(Math.round(numberValue(formData, `${prefix}prismSlotCount`, prism.slotCount ?? 10)), 8, 16);
  const receiverCount = clamp(Math.round(numberValue(formData, `${prefix}prismReceiverCount`, prism.receiverCount ?? 4)), 2, Math.min(8, slotCount));
  const switchableRingCount = clamp(Math.round(numberValue(formData, `${prefix}prismSwitchableRingCount`, prism.switchableRingCount ?? 0)), 0, ringCount - 1);
  const maxIceReceivers = Math.min(4, slotCount - receiverCount);
  const minimumIceReceivers = switchableRingCount > 0 && maxIceReceivers > 0 ? 1 : 0;
  return {
    traceDurationSeconds: clamp(Math.round(numberValue(formData, `${prefix}prismTraceDurationSeconds`, prism.traceDurationSeconds ?? base.traceDurationSeconds ?? 60)), 5, 300),
    ringCount,
    slotCount,
    receiverCount,
    blockersPerRing: clamp(Math.round(numberValue(formData, `${prefix}prismBlockersPerRing`, prism.blockersPerRing ?? 0)), 0, 3),
    iceReceiverCount: clamp(Math.round(numberValue(formData, `${prefix}prismIceReceiverCount`, prism.iceReceiverCount ?? 0)), minimumIceReceivers, maxIceReceivers),
    switchableRingCount,
    scrambleSteps: clamp(Math.round(numberValue(formData, `${prefix}prismScrambleSteps`, prism.scrambleSteps ?? 3)), 1, Math.floor(slotCount / 2)),
    icePenaltySeconds: clamp(numberValue(formData, `${prefix}prismIcePenaltySeconds`, prism.icePenaltySeconds ?? 5), 0, 60)
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
    hintsEnabled: Boolean(base.hintsEnabled),
    visualGlitchIntensity: Number(base.visualGlitchIntensity ?? 0.4),
    nodeIntrusion: {
      traceDurationSeconds: Number(base.nodeIntrusion.traceDurationSeconds ?? base.traceDurationSeconds ?? 60),
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
    },
    signalAlignment: {
      traceDurationSeconds: Number(base.signalAlignment.traceDurationSeconds ?? base.traceDurationSeconds ?? 60),
      channelCount: Number(base.signalAlignment.channelCount ?? 3),
      tolerance: Number(base.signalAlignment.tolerance ?? 5),
      signalDriftSpeed: Number(base.signalAlignment.signalDriftSpeed ?? 0),
      noiseLevel: Number(base.signalAlignment.noiseLevel ?? 0),
      lockHoldSeconds: Number(base.signalAlignment.lockHoldSeconds ?? 4),
      targetRevealRadius: Number(base.signalAlignment.targetRevealRadius ?? 100),
      destabilizationPenaltySeconds: Number(base.signalAlignment.destabilizationPenaltySeconds ?? 0)
    },
    packetSwitchboard: {
      traceDurationSeconds: Number(base.packetSwitchboard?.traceDurationSeconds ?? base.traceDurationSeconds ?? 60),
      laneCount: Number(base.packetSwitchboard?.laneCount ?? 4),
      columnCount: Number(base.packetSwitchboard?.columnCount ?? 6),
      deliveryGoal: Number(base.packetSwitchboard?.deliveryGoal ?? 7),
      packetIntervalSeconds: Number(base.packetSwitchboard?.packetIntervalSeconds ?? 2),
      packetStepSeconds: Number(base.packetSwitchboard?.packetStepSeconds ?? 0.8),
      previewCount: Number(base.packetSwitchboard?.previewCount ?? 2),
      misroutePenaltySeconds: Number(base.packetSwitchboard?.misroutePenaltySeconds ?? 5),
      maxActivePackets: Number(base.packetSwitchboard?.maxActivePackets ?? 2),
      entryHoldSeconds: Number(base.packetSwitchboard?.entryHoldSeconds ?? 1.5)
    },
    prismLock: {
      traceDurationSeconds: Number(base.prismLock?.traceDurationSeconds ?? base.traceDurationSeconds ?? 60),
      ringCount: Number(base.prismLock?.ringCount ?? 3),
      slotCount: Number(base.prismLock?.slotCount ?? 10),
      receiverCount: Number(base.prismLock?.receiverCount ?? 4),
      blockersPerRing: Number(base.prismLock?.blockersPerRing ?? 0),
      iceReceiverCount: Number(base.prismLock?.iceReceiverCount ?? 0),
      switchableRingCount: Number(base.prismLock?.switchableRingCount ?? 0),
      scrambleSteps: Number(base.prismLock?.scrambleSteps ?? 3),
      icePenaltySeconds: Number(base.prismLock?.icePenaltySeconds ?? 5)
    }
  };
}

export class DifficultyProfilesApp extends LegacyFormApplication {
  activeProfileTab = "general";

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-hacking-difficulty-profiles",
      title: "HoloSuite Hacking Difficulty Profiles",
      classes: ["holosuite-hacking-window", "holosuite-hacking-profile-window"],
      template: TEMPLATE_PATH,
      width: 820,
      height: 780,
      resizable: true,
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
        hintsEnabled: Boolean(profile.hintsEnabled),
        visualGlitchIntensity: Number(profile.visualGlitchIntensity ?? 0.4),
        nodeIntrusion: {
          traceDurationSeconds: Number(profile.nodeIntrusion?.traceDurationSeconds ?? profile.traceDurationSeconds ?? 60),
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
        signalAlignment: {
          traceDurationSeconds: Number(profile.signalAlignment?.traceDurationSeconds ?? profile.traceDurationSeconds ?? 60),
          channelCount: Number(profile.signalAlignment?.channelCount ?? 3),
          tolerance: Number(profile.signalAlignment?.tolerance ?? 5),
          signalDriftSpeed: Number(profile.signalAlignment?.signalDriftSpeed ?? 0),
          noiseLevel: Number(profile.signalAlignment?.noiseLevel ?? 0),
          lockHoldSeconds: Number(profile.signalAlignment?.lockHoldSeconds ?? 4),
          targetRevealRadius: Number(profile.signalAlignment?.targetRevealRadius ?? 100),
          destabilizationPenaltySeconds: Number(profile.signalAlignment?.destabilizationPenaltySeconds ?? 0)
        },
        packetSwitchboard: {
          traceDurationSeconds: Number(profile.packetSwitchboard?.traceDurationSeconds ?? profile.traceDurationSeconds ?? 60),
          laneCount: Number(profile.packetSwitchboard?.laneCount ?? 4),
          columnCount: Number(profile.packetSwitchboard?.columnCount ?? 6),
          deliveryGoal: Number(profile.packetSwitchboard?.deliveryGoal ?? 7),
          packetIntervalSeconds: Number(profile.packetSwitchboard?.packetIntervalSeconds ?? 2),
          packetStepSeconds: Number(profile.packetSwitchboard?.packetStepSeconds ?? 0.8),
          previewCount: Number(profile.packetSwitchboard?.previewCount ?? 2),
          misroutePenaltySeconds: Number(profile.packetSwitchboard?.misroutePenaltySeconds ?? 5),
          maxActivePackets: Number(profile.packetSwitchboard?.maxActivePackets ?? 2),
          entryHoldSeconds: Number(profile.packetSwitchboard?.entryHoldSeconds ?? 1.5)
        },
        prismLock: {
          traceDurationSeconds: Number(profile.prismLock?.traceDurationSeconds ?? profile.traceDurationSeconds ?? 60),
          ringCount: Number(profile.prismLock?.ringCount ?? 3),
          slotCount: Number(profile.prismLock?.slotCount ?? 10),
          receiverCount: Number(profile.prismLock?.receiverCount ?? 4),
          blockersPerRing: Number(profile.prismLock?.blockersPerRing ?? 0),
          iceReceiverCount: Number(profile.prismLock?.iceReceiverCount ?? 0),
          switchableRingCount: Number(profile.prismLock?.switchableRingCount ?? 0),
          scrambleSteps: Number(profile.prismLock?.scrambleSteps ?? 3),
          icePenaltySeconds: Number(profile.prismLock?.icePenaltySeconds ?? 5)
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
    this.setProfileTab(html, this.activeProfileTab, false);
    this.syncConstraints(html);
    html.find("[data-profile-tab]").on("click", (event: Event) => {
      event.preventDefault();
      const target = event.currentTarget as HTMLElement | null;
      const tabId = target?.dataset.profileTab ?? "general";
      this.setProfileTab(target?.closest(".holosuite-profile-config") ?? html, tabId, true);
    });
    html.find("[data-action='toggle-profile']").on("click", (event: Event) => {
      event.preventDefault();
      const button = event.currentTarget as HTMLButtonElement | null;
      const section = button?.closest<HTMLElement>("[data-profile-section]");
      if (!button || !section) return;
      const open = !section.classList.contains("is-open");
      section.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
    });
    html.find("input[type='number']").on("change", (event: Event) => {
      clampNumberInput(event.currentTarget as HTMLInputElement);
    });
    html.find("[data-profile-section] input").on("input change", (event: Event) => {
      const section = (event.currentTarget as HTMLElement | null)?.closest("[data-profile-section]");
      if (section) this.syncProfileConstraints(section as HTMLElement);
    });
    html.find("[data-action='reset-profile']").on("click", (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
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

  setProfileTab(html: any, requestedTabId: string, collapseProfiles: boolean) {
    // HTMLFormElement exposes its controls through numeric properties, so using
    // `html[0]` unconditionally resolves to the first tab button in Foundry v12.
    // Only unwrap jQuery-like collections; preserve a direct element as-is.
    const candidate = (html instanceof HTMLElement ? html : html?.[0]) as HTMLElement | undefined;
    const root = candidate?.matches?.(".holosuite-profile-config")
      ? candidate
      : candidate?.querySelector?.(".holosuite-profile-config") as HTMLElement | null
        ?? (this.form as HTMLElement | undefined);
    if (!root) return;
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-profile-tab]"));
    const tabId = tabs.some((tab) => tab.dataset.profileTab === requestedTabId) ? requestedTabId : "general";
    const changed = tabId !== this.activeProfileTab;
    this.activeProfileTab = tabId;
    root.dataset.activeProfileTab = tabId;

    tabs.forEach((tab) => {
      const active = tab.dataset.profileTab === tabId;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    root.querySelectorAll<HTMLElement>("[data-profile-panel]").forEach((panel) => {
      const active = panel.dataset.profilePanel === tabId;
      panel.classList.toggle("is-active", active);
    });
    if (collapseProfiles && changed) {
      root.querySelectorAll<HTMLElement>("[data-profile-section]").forEach((section) => {
        section.classList.remove("is-open");
        section.querySelector<HTMLElement>("[data-action='toggle-profile']")?.setAttribute("aria-expanded", "false");
      });
    }
  }

  syncConstraints(html: any) {
    html.find("[data-profile-section]").each((_index: number, section: HTMLElement) => this.syncProfileConstraints(section));
  }

  clampNumberInputs() {
    const element = this.element?.[0] as HTMLElement | undefined;
    element?.querySelectorAll<HTMLInputElement>("input[type='number']").forEach((input) => clampNumberInput(input));
  }

  syncProfileConstraints(section: HTMLElement) {
    const profileId = section.dataset.profileId ?? "";
    const getInput = (field: string) => section.querySelector<HTMLInputElement>(`[name="${profileId}.${field}"]`);
    const nodeInput = getInput("nodeCount");
    const decoyInput = getInput("decoyCount");
    const routeInput = getInput("routeCount");
    const firewallInput = getInput("firewallCount");
    const allowInput = getInput("allowFirewallOnMainPath");
    if (nodeInput && decoyInput && routeInput && firewallInput) {
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

    const packetLaneInput = getInput("packetLaneCount");
    const packetColumnInput = getInput("packetColumnCount");
    if (packetLaneInput && packetColumnInput) {
      const laneCount = clamp(Math.round(Number(packetLaneInput.value) || 4), 3, 6);
      const minimumColumns = laneCount - 1;
      packetLaneInput.value = String(laneCount);
      packetColumnInput.min = String(minimumColumns);
      packetColumnInput.value = String(clamp(Math.round(Number(packetColumnInput.value) || 6), minimumColumns, 8));
    }

    const prismRingInput = getInput("prismRingCount");
    const prismSlotInput = getInput("prismSlotCount");
    const prismReceiverInput = getInput("prismReceiverCount");
    const prismIceInput = getInput("prismIceReceiverCount");
    const prismSwitchableInput = getInput("prismSwitchableRingCount");
    const prismScrambleInput = getInput("prismScrambleSteps");
    if (prismRingInput && prismSlotInput && prismReceiverInput && prismIceInput && prismSwitchableInput && prismScrambleInput) {
      const ringCount = clamp(Math.round(Number(prismRingInput.value) || 3), 2, 4);
      const slotCount = clamp(Math.round(Number(prismSlotInput.value) || 10), 8, 16);
      const receiverCount = clamp(Math.round(Number(prismReceiverInput.value) || 4), 2, Math.min(8, slotCount));
      const switchableRingCount = clamp(Math.round(Number(prismSwitchableInput.value) || 0), 0, ringCount - 1);
      const maxIceReceivers = Math.min(4, slotCount - receiverCount);
      prismRingInput.value = String(ringCount);
      prismSlotInput.value = String(slotCount);
      prismReceiverInput.max = String(Math.min(8, slotCount));
      prismReceiverInput.value = String(receiverCount);
      prismSwitchableInput.max = String(ringCount - 1);
      prismSwitchableInput.value = String(switchableRingCount);
      prismIceInput.max = String(maxIceReceivers);
      prismIceInput.min = String(switchableRingCount > 0 && maxIceReceivers > 0 ? 1 : 0);
      prismIceInput.value = String(clamp(Math.round(Number(prismIceInput.value) || 0), Number(prismIceInput.min), maxIceReceivers));
      prismScrambleInput.max = String(Math.floor(slotCount / 2));
      prismScrambleInput.value = String(clamp(Math.round(Number(prismScrambleInput.value) || 3), 1, Math.floor(slotCount / 2)));
    }

  }

  resetProfileSection(section: HTMLElement) {
    const profileId = section.dataset.profileId ?? "";
    if (!PROFILE_IDS.includes(profileId)) return;
    const defaults = getDefaultProfileView(profileId);
    const values: Record<string, any> = {
      visualGlitchIntensity: defaults.visualGlitchIntensity,
      nodeTraceDurationSeconds: defaults.nodeIntrusion.traceDurationSeconds,
      nodeCount: defaults.nodeIntrusion.nodeCount,
      routeCount: defaults.nodeIntrusion.routeCount,
      firewallCount: defaults.nodeIntrusion.firewallCount,
      decoyCount: defaults.nodeIntrusion.decoyCount,
      claimDurationSeconds: defaults.nodeIntrusion.claimDurationSeconds,
      firewallClaimMultiplier: defaults.nodeIntrusion.firewallClaimMultiplier,
      firewallPenaltySeconds: defaults.nodeIntrusion.firewallPenaltySeconds,
      decoyPenaltySeconds: defaults.nodeIntrusion.decoyPenaltySeconds,
      signalTraceDurationSeconds: defaults.signalAlignment.traceDurationSeconds,
      signalChannelCount: defaults.signalAlignment.channelCount,
      signalTolerance: defaults.signalAlignment.tolerance,
      signalDriftSpeed: defaults.signalAlignment.signalDriftSpeed,
      signalNoiseLevel: defaults.signalAlignment.noiseLevel,
      signalLockHoldSeconds: defaults.signalAlignment.lockHoldSeconds,
      signalTargetRevealRadius: defaults.signalAlignment.targetRevealRadius,
      signalDestabilizationPenaltySeconds: defaults.signalAlignment.destabilizationPenaltySeconds,
      packetTraceDurationSeconds: defaults.packetSwitchboard.traceDurationSeconds,
      packetLaneCount: defaults.packetSwitchboard.laneCount,
      packetColumnCount: defaults.packetSwitchboard.columnCount,
      packetDeliveryGoal: defaults.packetSwitchboard.deliveryGoal,
      packetIntervalSeconds: defaults.packetSwitchboard.packetIntervalSeconds,
      packetStepSeconds: defaults.packetSwitchboard.packetStepSeconds,
      packetPreviewCount: defaults.packetSwitchboard.previewCount,
      packetMisroutePenaltySeconds: defaults.packetSwitchboard.misroutePenaltySeconds,
      packetMaxActivePackets: defaults.packetSwitchboard.maxActivePackets,
      packetEntryHoldSeconds: defaults.packetSwitchboard.entryHoldSeconds,
      prismTraceDurationSeconds: defaults.prismLock.traceDurationSeconds,
      prismRingCount: defaults.prismLock.ringCount,
      prismSlotCount: defaults.prismLock.slotCount,
      prismReceiverCount: defaults.prismLock.receiverCount,
      prismBlockersPerRing: defaults.prismLock.blockersPerRing,
      prismIceReceiverCount: defaults.prismLock.iceReceiverCount,
      prismSwitchableRingCount: defaults.prismLock.switchableRingCount,
      prismScrambleSteps: defaults.prismLock.scrambleSteps,
      prismIcePenaltySeconds: defaults.prismLock.icePenaltySeconds
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

  async _updateObject(_event: Event, _formDataSource: any) {
    this.clampNumberInputs();
    const formData = new FormData(this.form as HTMLFormElement);
    const overrides: any = {};

    for (const id of PROFILE_IDS) {
      const base = (DIFFICULTY_PROFILES as any)[id];
      const prefix = `${id}.`;
      overrides[id] = {
        traceDurationSeconds: clamp(Math.round(numberValue(formData, `${prefix}nodeTraceDurationSeconds`, base.traceDurationSeconds)), 5, 300),
        hintsEnabled: checkboxValue(formData, `${prefix}hintsEnabled`),
        visualGlitchIntensity: clamp(numberValue(formData, `${prefix}visualGlitchIntensity`, base.visualGlitchIntensity), 0, 1),
        nodeIntrusion: normalizeNodeIntrusionProfile(formData, prefix, base),
        signalAlignment: normalizeSignalAlignmentProfile(formData, prefix, base),
        packetSwitchboard: normalizePacketSwitchboardProfile(formData, prefix, base),
        prismLock: normalizePrismLockProfile(formData, prefix, base)
      };
    }

    await game.settings.set(MODULE_ID, "difficultyProfileOverrides", JSON.stringify(overrides));
    ui.notifications?.info?.("HoloSuite Hacking difficulty profiles saved.");
  }
}
