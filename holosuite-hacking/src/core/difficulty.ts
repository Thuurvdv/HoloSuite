export const DIFFICULTY_PROFILES = {
  critical_success: {
    profileId: "critical_success",
    id: "critical_success",
    label: "Critical Success",
    traceDurationSeconds: 95,
    hintsEnabled: true,
    visualGlitchIntensity: 0.15,
    nodeIntrusion: {
      traceDurationSeconds: 95,
      nodeCount: 14,
      firewallCount: 2,
      decoyCount: 2,
      allowFirewallOnMainPath: false,
      routeCount: 3,
      showTarget: true,
      radarEnabled: true,
      claimDurationSeconds: 0.35,
      firewallClaimMultiplier: 1.5,
      firewallPenaltySeconds: 4,
      decoyPenaltySeconds: 2
    },
    signalAlignment: {
      traceDurationSeconds: 95,
      channelCount: 2,
      tolerance: 8,
      signalDriftSpeed: 0,
      noiseLevel: 0.05,
      lockHoldSeconds: 2.5,
      targetRevealRadius: 100,
      destabilizationPenaltySeconds: 0
    }
  },
  strong_success: {
    profileId: "strong_success",
    id: "strong_success",
    label: "Strong Success",
    traceDurationSeconds: 75,
    hintsEnabled: true,
    visualGlitchIntensity: 0.25,
    nodeIntrusion: {
      traceDurationSeconds: 75,
      nodeCount: 16,
      firewallCount: 3,
      decoyCount: 3,
      allowFirewallOnMainPath: false,
      routeCount: 3,
      showTarget: false,
      radarEnabled: true,
      claimDurationSeconds: 0.45,
      firewallClaimMultiplier: 1.6,
      firewallPenaltySeconds: 5,
      decoyPenaltySeconds: 3
    },
    signalAlignment: {
      traceDurationSeconds: 75,
      channelCount: 3,
      tolerance: 7,
      signalDriftSpeed: 0.15,
      noiseLevel: 0.12,
      lockHoldSeconds: 3,
      targetRevealRadius: 30,
      destabilizationPenaltySeconds: 2
    }
  },
  success: {
    profileId: "success",
    id: "success",
    label: "Success",
    traceDurationSeconds: 60,
    hintsEnabled: false,
    visualGlitchIntensity: 0.4,
    nodeIntrusion: {
      traceDurationSeconds: 60,
      nodeCount: 18,
      firewallCount: 4,
      decoyCount: 4,
      allowFirewallOnMainPath: false,
      routeCount: 3,
      showTarget: false,
      radarEnabled: false,
      claimDurationSeconds: 0.6,
      firewallClaimMultiplier: 1.75,
      firewallPenaltySeconds: 6,
      decoyPenaltySeconds: 4
    },
    signalAlignment: {
      traceDurationSeconds: 60,
      channelCount: 3,
      tolerance: 5,
      signalDriftSpeed: 0.35,
      noiseLevel: 0.2,
      lockHoldSeconds: 4,
      targetRevealRadius: 20,
      destabilizationPenaltySeconds: 4
    }
  },
  failure_but_playable: {
    profileId: "failure_but_playable",
    id: "failure_but_playable",
    label: "Failure, But Playable",
    traceDurationSeconds: 45,
    hintsEnabled: false,
    visualGlitchIntensity: 0.65,
    nodeIntrusion: {
      traceDurationSeconds: 45,
      nodeCount: 20,
      firewallCount: 6,
      decoyCount: 5,
      allowFirewallOnMainPath: false,
      routeCount: 2,
      showTarget: false,
      radarEnabled: false,
      claimDurationSeconds: 0.75,
      firewallClaimMultiplier: 2,
      firewallPenaltySeconds: 8,
      decoyPenaltySeconds: 5
    },
    signalAlignment: {
      traceDurationSeconds: 45,
      channelCount: 4,
      tolerance: 4,
      signalDriftSpeed: 0.55,
      noiseLevel: 0.32,
      lockHoldSeconds: 5,
      targetRevealRadius: 12,
      destabilizationPenaltySeconds: 6
    }
  },
  critical_failure: {
    profileId: "critical_failure",
    id: "critical_failure",
    label: "Critical Failure",
    traceDurationSeconds: 24,
    hintsEnabled: false,
    visualGlitchIntensity: 0.9,
    nodeIntrusion: {
      traceDurationSeconds: 24,
      nodeCount: 24,
      firewallCount: 10,
      decoyCount: 8,
      allowFirewallOnMainPath: false,
      routeCount: 1,
      showTarget: false,
      radarEnabled: false,
      claimDurationSeconds: 1.2,
      firewallClaimMultiplier: 2.25,
      firewallPenaltySeconds: 12,
      decoyPenaltySeconds: 8
    },
    signalAlignment: {
      traceDurationSeconds: 24,
      channelCount: 5,
      tolerance: 2,
      signalDriftSpeed: 0.6,
      noiseLevel: 0.5,
      lockHoldSeconds: 6.5,
      targetRevealRadius: 0,
      destabilizationPenaltySeconds: 8
    }
  }
};

function flattenProfile(profile: any) {
  return {
    ...profile,
    ...profile.nodeIntrusion,
    ...profile.signalAlignment,
    allowMainPathFirewalls: profile.nodeIntrusion.allowFirewallOnMainPath
  };
}

export function getDifficultyProfile(rollTotal = 0, dc = 10, naturalRoll: number | null = null) {
  const roll = Number(rollTotal) || 0;
  const target = Number(dc) || 10;
  const natural = Number(naturalRoll);

  if (natural === 1) return flattenProfile(DIFFICULTY_PROFILES.critical_failure);
  if (natural === 20) return flattenProfile(DIFFICULTY_PROFILES.critical_success);
  if (roll <= target - 10) return flattenProfile(DIFFICULTY_PROFILES.critical_failure);
  if (roll >= target + 10) return flattenProfile(DIFFICULTY_PROFILES.critical_success);
  if (roll >= target + 5) return flattenProfile(DIFFICULTY_PROFILES.strong_success);
  if (roll >= target) return flattenProfile(DIFFICULTY_PROFILES.success);
  return flattenProfile(DIFFICULTY_PROFILES.failure_but_playable);
}
