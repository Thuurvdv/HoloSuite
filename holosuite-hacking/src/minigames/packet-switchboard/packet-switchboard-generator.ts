const PACKET_COLORS = [
  { id: "cyan", label: "CYAN", color: "#4df6ff" },
  { id: "magenta", label: "MAGENTA", color: "#ff4fd8" },
  { id: "amber", label: "AMBER", color: "#ffc857" },
  { id: "lime", label: "LIME", color: "#8dff69" },
  { id: "violet", label: "VIOLET", color: "#a98cff" },
  { id: "red", label: "RED", color: "#ff6577" }
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hashSeed(value: any) {
  const text = String(value ?? "packet-switchboard");
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

function directionLabel(direction: number) {
  if (direction < 0) return "up";
  if (direction > 0) return "down";
  return "straight";
}

export function getValidDirections(row: number, laneCount: number) {
  const directions = [0];
  if (row > 0) directions.unshift(-1);
  if (row < laneCount - 1) directions.push(1);
  return directions;
}

export function cycleJunctionDirection(current: number, row: number, laneCount: number) {
  const directions = getValidDirections(row, laneCount);
  const index = directions.indexOf(Number(current));
  return directions[(index + 1) % directions.length];
}

export function normalizeJunctionDirection(direction: number, row: number, laneCount: number) {
  const requested = Math.sign(Number(direction) || 0);
  return getValidDirections(row, laneCount).includes(requested) ? requested : 0;
}

export function tracePacketRoute(board: any, packet: any, startColumn = 0, startRow = packet?.sourceRow ?? 0) {
  let row = clamp(Math.round(Number(startRow) || 0), 0, board.laneCount - 1);
  const junctionIds: string[] = [];
  for (let column = Math.max(0, Math.round(Number(startColumn) || 0)); column < board.columnCount; column += 1) {
    const junction = board.junctions.find((candidate) => candidate.row === row && candidate.column === column);
    if (!junction) continue;
    junctionIds.push(junction.id);
    row = clamp(row + normalizeJunctionDirection(junction.direction, row, board.laneCount), 0, board.laneCount - 1);
  }
  return {
    junctionIds,
    finalRow: row,
    targetRow: Number(packet?.targetRow ?? row),
    reachesTarget: row === Number(packet?.targetRow ?? row)
  };
}

export function generatePacketSwitchboard(profile: any, seed: any = Date.now()) {
  const tuning = profile.packetSwitchboard ?? profile;
  const laneCount = clamp(Math.round(Number(tuning.laneCount) || 4), 3, PACKET_COLORS.length);
  const columnCount = clamp(Math.round(Number(tuning.columnCount) || 6), laneCount - 1, 8);
  const deliveryGoal = clamp(Math.round(Number(tuning.deliveryGoal) || 7), 3, 20);
  const previewCount = clamp(Math.round(Number(tuning.previewCount) || 2), 0, 6);
  const rng = createRng(seed);
  const lanes = PACKET_COLORS.slice(0, laneCount).map((color, row) => ({
    ...color,
    row,
    inputPort: `IN-${String(row + 1).padStart(2, "0")}`,
    port: `OUT-${String(row + 1).padStart(2, "0")}`
  }));

  const junctions = [];
  for (let row = 0; row < laneCount; row += 1) {
    for (let column = 0; column < columnCount; column += 1) {
      junctions.push({
        id: `junction-${row}-${column}`,
        row,
        column,
        gridRow: row + 1,
        gridColumn: column + 1,
        direction: 0,
        directionLabel: directionLabel(0)
      });
    }
  }

  const packetPlan = [];
  const planLength = Math.max(deliveryGoal * 4, deliveryGoal + 12);
  let previousTarget = -1;
  for (let index = 0; index < planLength; index += 1) {
    let targetRow = Math.floor(rng() * laneCount);
    if (targetRow === previousTarget && laneCount > 1) targetRow = (targetRow + 1 + Math.floor(rng() * (laneCount - 1))) % laneCount;
    previousTarget = targetRow;

    let sourceRow = Math.floor(rng() * laneCount);
    if (sourceRow === targetRow && rng() > 0.2) sourceRow = (sourceRow + 1 + Math.floor(rng() * (laneCount - 1))) % laneCount;
    const lane = lanes[targetRow];
    const sourceLane = lanes[sourceRow];
    packetPlan.push({
      id: `packet-${index + 1}`,
      sequence: index + 1,
      sourceRow,
      sourcePort: sourceLane.inputPort,
      targetRow,
      colorId: lane.id,
      color: lane.color,
      label: lane.label,
      port: lane.port
    });
  }

  return {
    laneCount,
    columnCount,
    deliveryGoal,
    previewCount,
    lanes,
    junctions,
    packetPlan
  };
}

export function describeDirection(direction: number) {
  return directionLabel(direction);
}
