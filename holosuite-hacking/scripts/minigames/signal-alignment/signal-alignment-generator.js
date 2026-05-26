function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hashSeed(value) {
  const text = String(value ?? "signal-alignment");
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed) {
  let state = hashSeed(seed);
  return () => {
    state += 0x6D2B79F5;
    let result = state;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export function clampFrequency(value) {
  return clamp(Number(value) || 0, 0, 100);
}

export function generateSignalChannels(profile, seed = Date.now()) {
  const rng = createRng(seed);
  const channelCount = clamp(Number(profile.channelCount ?? profile.signalAlignment?.channelCount) || 3, 2, 5);
  const tolerance = Number(profile.tolerance ?? profile.signalAlignment?.tolerance ?? 5);
  const decoyCount = Number(profile.decoyFrequencies ?? profile.signalAlignment?.decoyFrequencies ?? 0);

  return Array.from({ length: channelCount }, (_, index) => {
    const target = Math.round(18 + rng() * 64);
    const side = rng() > 0.5 ? 1 : -1;
    const offset = tolerance + 8 + Math.round(rng() * 18);
    const driftDirection = rng() > 0.5 ? 1 : -1;
    const decoys = Array.from({ length: decoyCount }, () => clampFrequency(target + ((rng() > 0.5 ? 1 : -1) * (tolerance + 9 + rng() * 18))));
    return {
      id: `channel-${index + 1}`,
      label: `CH-${String(index + 1).padStart(2, "0")}`,
      value: clampFrequency(target + side * offset),
      target,
      tolerance,
      driftDirection,
      decoys
    };
  });
}
