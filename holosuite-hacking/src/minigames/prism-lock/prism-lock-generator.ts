const RING_COLORS = ["#57f3ff", "#b779ff", "#ffcd57", "#66ffad"];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeSlot(value: number, slotCount: number) {
  return ((Math.round(value) % slotCount) + slotCount) % slotCount;
}

function hashSeed(value: any) {
  const text = String(value ?? "prism-lock");
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed: any) {
  let state = hashSeed(seed);
  return () => {
    state += 0x6D2B79F5;
    let result = state;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rng: () => number) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function pointAtSlot(slot: number, radius: number, slotCount: number) {
  const angle = ((normalizeSlot(slot, slotCount) / slotCount) * Math.PI * 2) - (Math.PI / 2);
  return {
    x: 50 + (Math.cos(angle) * radius),
    y: 50 + (Math.sin(angle) * radius)
  };
}

function getState(states: any[], ring: any) {
  return states.find((state) => state.id === ring.id) ?? {
    id: ring.id,
    rotation: ring.initialRotation ?? 0,
    enabled: ring.initialEnabled !== false
  };
}

export function evaluatePrismBoard(board: any, states: any[]) {
  const litSlots = new Set<number>();
  const beams: any[] = [];
  const emitters: any[] = [];
  const blockers: any[] = [];

  for (const ring of board.rings) {
    const state = getState(states, ring);
    if (!state.enabled) continue;
    for (const blocker of ring.blockers) {
      const slot = normalizeSlot(blocker.baseSlot + state.rotation, board.slotCount);
      blockers.push({
        id: blocker.id,
        ringId: ring.id,
        ringIndex: ring.index,
        slot,
        color: ring.color,
        ...pointAtSlot(slot, ring.radius, board.slotCount)
      });
    }
  }

  for (const ring of board.rings) {
    const state = getState(states, ring);
    if (!state.enabled) continue;
    for (const emitter of ring.emitters) {
      const slot = normalizeSlot(emitter.baseSlot + state.rotation, board.slotCount);
      const start = pointAtSlot(slot, ring.radius, board.slotCount);
      const blockingRing = blockers
        .filter((blocker) => blocker.ringIndex > ring.index && blocker.slot === slot)
        .sort((left, right) => left.ringIndex - right.ringIndex)[0] ?? null;
      const endRadius = blockingRing
        ? Math.max(ring.radius + 1, board.rings[blockingRing.ringIndex].radius - 2.2)
        : board.receiverRadius;
      const end = pointAtSlot(slot, endRadius, board.slotCount);
      if (!blockingRing) litSlots.add(slot);
      emitters.push({
        id: emitter.id,
        ringId: ring.id,
        slot,
        color: ring.color,
        x: start.x,
        y: start.y
      });
      beams.push({
        id: `${emitter.id}-beam`,
        ringId: ring.id,
        slot,
        color: ring.color,
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
        blocked: Boolean(blockingRing)
      });
    }
  }

  const receivers = board.receivers.map((receiver) => ({
    ...receiver,
    lit: litSlots.has(receiver.slot),
    ...pointAtSlot(receiver.slot, board.receiverRadius, board.slotCount)
  }));
  const iceReceivers = board.iceReceivers.map((receiver) => {
    const point = pointAtSlot(receiver.slot, board.receiverRadius, board.slotCount);
    return {
      ...receiver,
      lit: litSlots.has(receiver.slot),
      ...point,
      rectX: point.x - 2.2,
      rectY: point.y - 2.2
    };
  });

  return {
    beams,
    emitters,
    blockers,
    receivers,
    iceReceivers,
    litSlots: [...litSlots],
    activeIceSlots: iceReceivers.filter((receiver) => receiver.lit).map((receiver) => receiver.slot),
    litReceiverCount: receivers.filter((receiver) => receiver.lit).length,
    solved: receivers.every((receiver) => receiver.lit) && iceReceivers.every((receiver) => !receiver.lit)
  };
}

export function rotateRingState(states: any[], ringId: string, direction: number, slotCount: number) {
  return states.map((state) => state.id === ringId
    ? { ...state, rotation: normalizeSlot(state.rotation + Math.sign(direction), slotCount) }
    : { ...state });
}

export function generatePrismLock(profile: any, seed: any = Date.now()) {
  const tuning = profile.prismLock ?? profile;
  const rng = createRng(seed);
  const ringCount = clamp(Math.round(Number(tuning.ringCount) || 3), 2, 4);
  const slotCount = clamp(Math.round(Number(tuning.slotCount) || 10), 8, 16);
  const receiverCount = clamp(Math.round(Number(tuning.receiverCount) || 4), 2, Math.min(8, slotCount - 2));
  const switchableRingCount = clamp(Math.round(Number(tuning.switchableRingCount) || 0), 0, ringCount - 1);
  const maxIceReceivers = Math.min(4, slotCount - receiverCount);
  const minimumIceReceivers = switchableRingCount > 0 && maxIceReceivers > 0 ? 1 : 0;
  const iceReceiverCount = clamp(Math.round(Number(tuning.iceReceiverCount) || 0), minimumIceReceivers, maxIceReceivers);
  const requiredRingCount = ringCount - switchableRingCount;
  const blockersPerRing = clamp(Math.round(Number(tuning.blockersPerRing) || 0), 0, 3);
  const scrambleSteps = clamp(Math.round(Number(tuning.scrambleSteps) || 3), 1, Math.floor(slotCount / 2));
  const availableSlots = shuffle(Array.from({ length: slotCount }, (_value, slot) => slot), rng);
  const receiverSlots = availableSlots.slice(0, receiverCount);
  const iceSlots = availableSlots.slice(receiverCount, receiverCount + iceReceiverCount);
  const solvedRotations = Array.from({ length: ringCount }, () => Math.floor(rng() * slotCount));
  const receiverAssignments = receiverSlots.map((slot, index) => ({
    slot,
    ringIndex: index % requiredRingCount
  }));

  const rings = Array.from({ length: ringCount }, (_value, index) => {
    const solvedRotation = solvedRotations[index];
    const isSwitchable = index >= requiredRingCount;
    const assignedSlots = receiverAssignments.filter((assignment) => assignment.ringIndex === index).map((assignment) => assignment.slot);
    const emitterTargets = isSwitchable
      ? [iceSlots[(index - requiredRingCount) % Math.max(1, iceSlots.length)] ?? availableSlots.at(-1) ?? 0]
      : assignedSlots;
    const blockedSolutionSlots = new Set([...receiverSlots, ...iceSlots]);
    const blockerFinalSlots = shuffle(
      Array.from({ length: slotCount }, (_entry, slot) => slot).filter((slot) => !blockedSolutionSlots.has(slot)),
      rng
    ).slice(0, blockersPerRing);
    const offset = 1 + Math.floor(rng() * scrambleSteps);

    return {
      id: `ring-${index + 1}`,
      index,
      label: `RING ${String(index + 1).padStart(2, "0")}`,
      color: RING_COLORS[index],
      radius: 14 + (index * 8),
      switchable: isSwitchable,
      solvedRotation,
      solvedEnabled: !isSwitchable,
      initialRotation: normalizeSlot(solvedRotation + offset, slotCount),
      initialEnabled: true,
      emitters: emitterTargets.map((targetSlot, emitterIndex) => ({
        id: `ring-${index + 1}-emitter-${emitterIndex + 1}`,
        baseSlot: normalizeSlot(targetSlot - solvedRotation, slotCount)
      })),
      blockers: blockerFinalSlots.map((slot, blockerIndex) => ({
        id: `ring-${index + 1}-blocker-${blockerIndex + 1}`,
        baseSlot: normalizeSlot(slot - solvedRotation, slotCount)
      }))
    };
  });

  const board: any = {
    ringCount,
    slotCount,
    receiverCount,
    receiverRadius: 46,
    rings,
    receivers: receiverSlots.map((slot, index) => ({ id: `receiver-${index + 1}`, slot })),
    iceReceivers: iceSlots.map((slot, index) => ({ id: `ice-${index + 1}`, slot })),
    ticks: Array.from({ length: slotCount }, (_value, slot) => ({
      slot,
      ...pointAtSlot(slot, 42.5, slotCount)
    })),
    solutionStates: rings.map((ring) => ({ id: ring.id, rotation: ring.solvedRotation, enabled: ring.solvedEnabled })),
    initialStates: rings.map((ring) => ({ id: ring.id, rotation: ring.initialRotation, enabled: ring.initialEnabled }))
  };

  if (evaluatePrismBoard(board, board.initialStates).solved) {
    let scrambledStates = board.initialStates;
    search: for (const ring of rings) {
      for (let shift = 1; shift < slotCount; shift += 1) {
        const candidate = board.initialStates.map((state) => state.id === ring.id
          ? { ...state, rotation: normalizeSlot(state.rotation + shift, slotCount) }
          : { ...state });
        if (!evaluatePrismBoard(board, candidate).solved) {
          scrambledStates = candidate;
          break search;
        }
      }
    }
    board.initialStates = scrambledStates;
    for (const ring of rings) {
      ring.initialRotation = board.initialStates.find((state) => state.id === ring.id)?.rotation ?? ring.initialRotation;
    }
  }

  return board;
}
