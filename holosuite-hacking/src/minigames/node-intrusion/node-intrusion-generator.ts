function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hashSeed(value: any) {
  const text = String(value ?? "node-intrusion");
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

function pickRandom<T>(items: T[], rng: () => number): T | null {
  if (!items.length) return null;
  return items[Math.floor(rng() * items.length)];
}

function shuffle<T>(items: T[], rng: () => number) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function connect(nodes: any[], leftId: string, rightId: string) {
  const left = nodes.find((node) => node.id === leftId);
  const right = nodes.find((node) => node.id === rightId);
  if (!left || !right) return;
  if (!left.connected.includes(rightId)) left.connected.push(rightId);
  if (!right.connected.includes(leftId)) right.connected.push(leftId);
}

export function edgeKey(leftId: string, rightId: string) {
  return [leftId, rightId].sort().join("--");
}

function createNode(id: string, type: string, x: number, y: number) {
  return {
    id,
    x: clamp(Math.round(x), 6, 94),
    y: clamp(Math.round(y), 10, 90),
    type,
    connected: [],
    revealed: type === "start",
    visited: false
  };
}

function getEdges(nodes: any[]) {
  return nodes.flatMap((node) => node.connected
    .filter((connectedId) => node.id < connectedId)
    .map((connectedId) => ({ from: node.id, to: connectedId })));
}

function getNode(nodes: any[], nodeId: string) {
  return nodes.find((node) => node.id === nodeId);
}

function orientation(a: any, b: any, c: any) {
  return Math.sign(((b.y - a.y) * (c.x - b.x)) - ((b.x - a.x) * (c.y - b.y)));
}

function segmentsCross(a: any, b: any, c: any, d: any) {
  const first = orientation(a, b, c);
  const second = orientation(a, b, d);
  const third = orientation(c, d, a);
  const fourth = orientation(c, d, b);
  return first !== second && third !== fourth;
}

function edgesCross(nodes: any[], leftEdge: any, rightEdge: any) {
  if (
    leftEdge.from === rightEdge.from
    || leftEdge.from === rightEdge.to
    || leftEdge.to === rightEdge.from
    || leftEdge.to === rightEdge.to
  ) return false;

  const leftFrom = getNode(nodes, leftEdge.from);
  const leftTo = getNode(nodes, leftEdge.to);
  const rightFrom = getNode(nodes, rightEdge.from);
  const rightTo = getNode(nodes, rightEdge.to);
  if (!leftFrom || !leftTo || !rightFrom || !rightTo) return false;
  return segmentsCross(leftFrom, leftTo, rightFrom, rightTo);
}

function pointToSegmentDistance(point: any, start: any, end: any) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = (dx * dx) + (dy * dy);
  if (!lengthSquared) {
    const px = point.x - start.x;
    const py = point.y - start.y;
    return Math.sqrt((px * px) + (py * py));
  }

  const t = clamp((((point.x - start.x) * dx) + ((point.y - start.y) * dy)) / lengthSquared, 0, 1);
  const closest = {
    x: start.x + (t * dx),
    y: start.y + (t * dy)
  };
  const px = point.x - closest.x;
  const py = point.y - closest.y;
  return Math.sqrt((px * px) + (py * py));
}

function countEdgeCrossings(nodes: any[], edges = getEdges(nodes)) {
  let crossings = 0;
  for (let leftIndex = 0; leftIndex < edges.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < edges.length; rightIndex += 1) {
      if (edgesCross(nodes, edges[leftIndex], edges[rightIndex])) crossings += 1;
    }
  }
  return crossings;
}

function scoreLayout(nodes: any[]) {
  const edges = getEdges(nodes);
  let score = countEdgeCrossings(nodes, edges) * 900;

  for (let leftIndex = 0; leftIndex < nodes.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < nodes.length; rightIndex += 1) {
      const left = nodes[leftIndex];
      const right = nodes[rightIndex];
      const dx = right.x - left.x;
      const dy = right.y - left.y;
      const distance = Math.sqrt((dx * dx) + (dy * dy)) || 1;
      if (distance < 13) score += (13 - distance) * 30;
      if (distance < 18) score += (18 - distance) * 6;
    }
  }

  for (const node of nodes) {
    for (const edge of edges) {
      if (edge.from === node.id || edge.to === node.id) continue;
      const from = getNode(nodes, edge.from);
      const to = getNode(nodes, edge.to);
      if (!from || !to) continue;
      const distance = pointToSegmentDistance(node, from, to);
      if (distance < 8) score += (8 - distance) * 18;
    }
  }

  return score;
}

function scoreCandidate(nodes: any[], candidate: any, connectedIds: string[]) {
  const trialNodes = nodes.map((node) => ({ ...node, connected: [...node.connected] }));
  trialNodes.push({ ...candidate, connected: [] });
  for (const connectedId of connectedIds) connect(trialNodes, candidate.id, connectedId);
  return scoreLayout(trialNodes);
}

function createPlacedNode(nodes: any[], id: string, type: string, anchor: any, rng: () => number, connectedIds: string[], options: any = {}) {
  const {
    radiusMin = 17,
    radiusMax = 34,
    biasX = 5,
    ySpread = 1
  } = options;
  let best = null;
  let bestScore = Infinity;

  for (let attempt = 0; attempt < 16; attempt += 1) {
    const angle = (rng() * Math.PI * 2) - (Math.PI * 0.2);
    const radius = radiusMin + (rng() * (radiusMax - radiusMin));
    const x = anchor.x + Math.cos(angle) * radius + biasX;
    const y = anchor.y + Math.sin(angle) * radius * ySpread;
    const candidate = createNode(id, type, x, y);
    const score = scoreCandidate(nodes, candidate, connectedIds);
    if (score < bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  return best ?? createNode(id, type, anchor.x + biasX, anchor.y);
}

function relaxNodePositions(nodes: any[]) {
  for (let pass = 0; pass < 24; pass += 1) {
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

function randomEndpoint(rng: () => number) {
  const side = Math.floor(rng() * 4);
  if (side === 0) return { x: 8 + (rng() * 22), y: 12 + (rng() * 76) };
  if (side === 1) return { x: 70 + (rng() * 22), y: 12 + (rng() * 76) };
  if (side === 2) return { x: 12 + (rng() * 76), y: 10 + (rng() * 20) };
  return { x: 12 + (rng() * 76), y: 70 + (rng() * 20) };
}

function createEndpointPair(rng: () => number) {
  let start = randomEndpoint(rng);
  let target = randomEndpoint(rng);
  let best = { start, target, distance: 0 };

  for (let attempt = 0; attempt < 24; attempt += 1) {
    start = randomEndpoint(rng);
    target = randomEndpoint(rng);
    const dx = target.x - start.x;
    const dy = target.y - start.y;
    const distance = Math.sqrt((dx * dx) + (dy * dy));
    if (distance > best.distance) best = { start, target, distance };
    if (distance >= 58) return { start, target };
  }

  return { start: best.start, target: best.target };
}

function getPathIds(nodes: any[], startId: string, targetId: string, blockedTypes = new Set<string>()) {
  const queue = [startId];
  const previous = new Map<string, string | null>([[startId, null]]);

  for (let index = 0; index < queue.length; index += 1) {
    const node = getNode(nodes, queue[index]);
    if (!node) continue;
    if (node.id === targetId) break;

    for (const connectedId of node.connected) {
      if (previous.has(connectedId)) continue;
      const connected = getNode(nodes, connectedId);
      if (!connected || blockedTypes.has(connected.type)) continue;
      previous.set(connectedId, node.id);
      queue.push(connectedId);
    }
  }

  if (!previous.has(targetId)) return [];
  const path = [];
  let current: string | null = targetId;
  while (current) {
    path.unshift(current);
    current = previous.get(current) ?? null;
  }
  return path;
}

function countSafeRoutes(nodes: any[], startId: string, targetId: string) {
  const firstRoute = getPathIds(nodes, startId, targetId, new Set(["firewall", "decoy"]));
  if (!firstRoute.length) return 0;

  const protectedEndpoints = new Set([startId, targetId]);
  const withoutFirstInterior = nodes.map((node) => ({
    ...node,
    connected: protectedEndpoints.has(node.id) || !firstRoute.includes(node.id) ? [...node.connected] : []
  }));
  return 1 + (getPathIds(withoutFirstInterior, startId, targetId, new Set(["firewall", "decoy"])).length ? 1 : 0);
}

function addAlternateRoutes(nodes: any[], mainPathIds: string[], rng: () => number, desiredRoutes: number) {
  let nextIndex = nodes.length + 1;
  const protectedRouteIds: string[] = [];
  for (let route = 1; route < desiredRoutes; route += 1) {
    if (mainPathIds.length < 5) break;
    const startIndex = 1 + Math.floor(rng() * Math.max(1, mainPathIds.length - 4));
    const endIndex = clamp(startIndex + 2 + Math.floor(rng() * 3), startIndex + 2, mainPathIds.length - 2);
    const start = getNode(nodes, mainPathIds[startIndex]);
    const end = getNode(nodes, mainPathIds[endIndex]);
    if (!start || !end) continue;

    const middleId = `node-${nextIndex}`;
    nextIndex += 1;
    const middle = createNode(
      middleId,
      "normal",
      (start.x + end.x) / 2 + ((rng() - 0.5) * 34),
      (start.y + end.y) / 2 + ((rng() - 0.5) * 34)
    );
    nodes.push(middle);
    protectedRouteIds.push(start.id, middle.id, end.id);
    connect(nodes, start.id, middle.id);
    connect(nodes, middle.id, end.id);
  }
  return protectedRouteIds;
}

function buildIntrusionGraph(profile: any, seed: any = Date.now()) {
  const rng = createRng(seed);
  const totalNodes = Math.max(6, Number(profile.nodeCount ?? profile.nodeIntrusion?.nodeCount) || 10);
  const decoyCount = clamp(Number(profile.decoyCount ?? profile.nodeIntrusion?.decoyCount) || 0, 0, totalNodes - 4);
  const branchCount = Math.max(0, totalNodes - decoyCount);
  const mainPathLength = clamp(Math.round(branchCount * 0.48), 6, branchCount);
  const routeCount = clamp(Number(profile.routeCount ?? profile.nodeIntrusion?.routeCount) || 2, 1, 3);
  const endpoints = createEndpointPair(rng);
  const nodes: any[] = [];
  const mainPathIds: string[] = [];

  // Build the solvable route first; branches can add pressure without making
  // the generated puzzle impossible.
  for (let index = 0; index < mainPathLength; index += 1) {
    const id = index === 0 ? "start" : index === mainPathLength - 1 ? "target" : `node-${index}`;
    const type = index === 0 ? "start" : index === mainPathLength - 1 ? "target" : "normal";
    const progress = index / Math.max(1, mainPathLength - 1);
    const dx = endpoints.target.x - endpoints.start.x;
    const dy = endpoints.target.y - endpoints.start.y;
    const length = Math.sqrt((dx * dx) + (dy * dy)) || 1;
    const normalX = -dy / length;
    const normalY = dx / length;
    const wave = Math.sin(progress * Math.PI * (1.15 + rng() * 0.6)) * (10 + rng() * 8);
    const jitterX = index === 0 || index === mainPathLength - 1 ? 0 : (rng() - 0.5) * 5;
    const jitterY = index === 0 || index === mainPathLength - 1 ? 0 : (rng() - 0.5) * 12;
    nodes.push(createNode(
      id,
      type,
      endpoints.start.x + (dx * progress) + (normalX * wave) + jitterX,
      endpoints.start.y + (dy * progress) + (normalY * wave) + jitterY
    ));
    mainPathIds.push(id);
    if (index > 0) connect(nodes, mainPathIds[index - 1], id);
  }

  const protectedRouteIds = new Set([...mainPathIds, ...addAlternateRoutes(nodes, mainPathIds, rng, routeCount)]);

  let nextIndex = nodes.length + 1;
  while (nodes.length < totalNodes - decoyCount) {
    const anchor = pickRandom(nodes.filter((node) => node.type !== "target"), rng) ?? nodes[0];
    const id = `node-${nextIndex}`;
    nextIndex += 1;
    const bridge = rng() > 0.45
      ? pickRandom(nodes.filter((node) => node.id !== anchor.id && node.type !== "start"), rng)
      : null;
    const connectedIds = bridge ? [anchor.id, bridge.id] : [anchor.id];
    const node = createPlacedNode(nodes, id, "normal", anchor, rng, connectedIds, {
      radiusMin: 16,
      radiusMax: 31,
      biasX: rng() > 0.35 ? 5 : -4,
      ySpread: 1.15
    });
    nodes.push(node);
    connect(nodes, anchor.id, id);
    if (bridge) connect(nodes, id, bridge.id);
  }

  for (let index = 0; index < decoyCount; index += 1) {
    const anchor = pickRandom(nodes.filter((node) => node.type !== "target" && node.type !== "decoy"), rng) ?? nodes[0];
    const id = `decoy-${index + 1}`;
    const node = createPlacedNode(nodes, id, "decoy", anchor, rng, [anchor.id], {
      radiusMin: 18,
      radiusMax: 34,
      biasX: rng() > 0.5 ? -6 : 6,
      ySpread: 1.25
    });
    nodes.push(node);
    connect(nodes, anchor.id, id);
  }

  const allowProtectedRouteFirewalls = Boolean(profile.allowFirewallOnMainPath ?? profile.allowMainPathFirewalls ?? profile.nodeIntrusion?.allowFirewallOnMainPath);
  const firewallCandidates = nodes.filter((node) => {
    if (node.type === "start" || node.type === "target" || node.type === "decoy") return false;
    return allowProtectedRouteFirewalls || !protectedRouteIds.has(node.id);
  });
  const firewallCount = clamp(Number(profile.firewallCount ?? profile.nodeIntrusion?.firewallCount) || 0, 0, firewallCandidates.length);
  for (const node of shuffle(firewallCandidates, rng).slice(0, firewallCount)) {
    node.type = "firewall";
  }

  relaxNodePositions(nodes);
  const safeRoutes = countSafeRoutes(nodes, "start", "target");

  return {
    nodes,
    edges: getEdges(nodes),
    startNodeId: "start",
    targetNodeId: "target",
    mainPathIds,
    safeRoutes,
    layoutScore: scoreLayout(nodes)
  };
}

export function generateIntrusionGraph(profile: any, seed: any = Date.now()) {
  const attempts = clamp(Math.ceil(Number(profile.nodeCount ?? profile.nodeIntrusion?.nodeCount) || 10), 7, 14);
  let best = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const graph = buildIntrusionGraph(profile, `${seed}:${attempt}`);
    if (!best || graph.layoutScore < best.layoutScore) best = graph;
    if (graph.layoutScore < 1 && graph.safeRoutes > 1) break;
  }

  return best ?? buildIntrusionGraph(profile, seed);
}
