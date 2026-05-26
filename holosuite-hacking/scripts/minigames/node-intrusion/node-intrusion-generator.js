function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hashSeed(value) {
  const text = String(value ?? "node-intrusion");
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

function pickRandom(items, rng) {
  if (!items.length) return null;
  return items[Math.floor(rng() * items.length)];
}

function connect(nodes, leftId, rightId) {
  const left = nodes.find((node) => node.id === leftId);
  const right = nodes.find((node) => node.id === rightId);
  if (!left || !right) return;
  if (!left.connected.includes(rightId)) left.connected.push(rightId);
  if (!right.connected.includes(leftId)) right.connected.push(leftId);
}

export function edgeKey(leftId, rightId) {
  return [leftId, rightId].sort().join("--");
}

function createNode(id, type, x, y) {
  return {
    id,
    x: clamp(Math.round(x), 6, 94),
    y: clamp(Math.round(y), 10, 90),
    type,
    connected: [],
    revealed: type === "start" || type === "target",
    visited: false
  };
}

function relaxNodePositions(nodes) {
  for (let pass = 0; pass < 18; pass += 1) {
    for (let leftIndex = 0; leftIndex < nodes.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < nodes.length; rightIndex += 1) {
        const left = nodes[leftIndex];
        const right = nodes[rightIndex];
        const dx = right.x - left.x;
        const dy = right.y - left.y;
        const distance = Math.sqrt((dx * dx) + (dy * dy)) || 1;
        if (distance >= 13) continue;

        const push = (13 - distance) * 0.35;
        const pushX = (dx / distance) * push;
        const pushY = (dy / distance) * push;
        if (left.type !== "start" && left.type !== "target") {
          left.x = clamp(left.x - pushX, 6, 94);
          left.y = clamp(left.y - pushY, 10, 90);
        }
        if (right.type !== "start" && right.type !== "target") {
          right.x = clamp(right.x + pushX, 6, 94);
          right.y = clamp(right.y + pushY, 10, 90);
        }
      }
    }
  }
}

export function generateIntrusionGraph(profile, seed = Date.now()) {
  const rng = createRng(seed);
  const totalNodes = Math.max(6, Number(profile.nodeCount ?? profile.nodeIntrusion?.nodeCount) || 10);
  const decoyCount = clamp(Number(profile.decoyCount ?? profile.nodeIntrusion?.decoyCount) || 0, 0, totalNodes - 4);
  const branchCount = Math.max(0, totalNodes - decoyCount);
  const mainPathLength = clamp(Math.round(branchCount * 0.55), 5, branchCount);
  const nodes = [];
  const mainPathIds = [];

  // Build the solvable route first; branches can add pressure without making
  // the generated puzzle impossible.
  for (let index = 0; index < mainPathLength; index += 1) {
    const id = index === 0 ? "start" : index === mainPathLength - 1 ? "target" : `node-${index}`;
    const type = index === 0 ? "start" : index === mainPathLength - 1 ? "target" : "normal";
    const progress = index / Math.max(1, mainPathLength - 1);
    const wave = Math.sin(progress * Math.PI * 1.35) * 12;
    const jitterX = (rng() - 0.5) * 7;
    const jitterY = (rng() - 0.5) * 18;
    nodes.push(createNode(id, type, 10 + progress * 80 + jitterX, 52 + wave + jitterY));
    mainPathIds.push(id);
    if (index > 0) connect(nodes, mainPathIds[index - 1], id);
  }

  let nextIndex = mainPathLength;
  while (nodes.length < totalNodes - decoyCount) {
    const anchor = pickRandom(nodes.filter((node) => node.type !== "target"), rng) ?? nodes[0];
    const id = `node-${nextIndex}`;
    nextIndex += 1;
    nodes.push(createNode(id, "normal", anchor.x + (rng() - 0.35) * 28, anchor.y + (rng() - 0.5) * 34));
    connect(nodes, anchor.id, id);

    const bridge = pickRandom(nodes.filter((node) => node.id !== id && node.id !== anchor.id && node.type !== "start"), rng);
    if (bridge && rng() > 0.45) connect(nodes, id, bridge.id);
  }

  for (let index = 0; index < decoyCount; index += 1) {
    const anchor = pickRandom(nodes.filter((node) => node.type !== "target" && node.type !== "decoy"), rng) ?? nodes[0];
    const id = `decoy-${index + 1}`;
    nodes.push(createNode(id, "decoy", anchor.x + (rng() - 0.5) * 24, anchor.y + (rng() - 0.5) * 30));
    connect(nodes, anchor.id, id);
  }

  const allowMainPath = profile.allowFirewallOnMainPath ?? profile.allowMainPathFirewalls ?? false;
  const firewallCandidates = nodes.filter((node) => {
    if (node.type === "start" || node.type === "target" || node.type === "decoy") return false;
    return allowMainPath || !mainPathIds.includes(node.id);
  });
  const firewallCount = clamp(Number(profile.firewallCount ?? profile.nodeIntrusion?.firewallCount) || 0, 0, firewallCandidates.length);
  for (let placed = 0; placed < firewallCount; placed += 1) {
    const remaining = firewallCandidates.filter((node) => node.type !== "firewall");
    const node = pickRandom(remaining, rng);
    if (!node) break;
    node.type = "firewall";
  }

  relaxNodePositions(nodes);

  return {
    nodes,
    edges: nodes.flatMap((node) => node.connected
      .filter((connectedId) => node.id < connectedId)
      .map((connectedId) => ({ from: node.id, to: connectedId }))),
    startNodeId: "start",
    targetNodeId: "target",
    mainPathIds
  };
}
