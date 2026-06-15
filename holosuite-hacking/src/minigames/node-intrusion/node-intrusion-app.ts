import { getDifficultyProfile } from "../../core/difficulty";
import { postHackResultMessage } from "../../core/chat";
import { edgeKey, generateIntrusionGraph } from "./node-intrusion-generator";

declare const foundry: any;
declare const game: any;
declare const ui: any;

const MODULE_ID = "holosuite-hacking";
const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/node-intrusion.html`;
const LegacyApplication = (globalThis as any).Application ?? (globalThis as any).foundry?.appv1?.api?.Application;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function nodeTypeLabel(type: string) {
  if (type === "start") return "entry";
  if (type === "target") return "target";
  if (type === "firewall") return "firewall";
  if (type === "decoy") return "decoy";
  return "relay";
}

function createRunSeed(rollTotal: number, dc: number, profile: any) {
  const cryptoApi = globalThis.crypto;
  const entropy = typeof cryptoApi?.randomUUID === "function"
    ? cryptoApi.randomUUID()
    : `${Date.now()}:${performance.now()}:${Math.random()}`;
  return `${rollTotal}:${dc}:${profile.profileId ?? profile.id}:${entropy}`;
}

export class NodeIntrusionApp extends LegacyApplication {
  rollTotal: number;
  dc: number;
  profile: any;
  seed: string;
  onSuccess: any;
  onFailure: any;
  actorName: string;
  chatOnResult: boolean;
  graph: any;
  state: any;
  startedAt: number | null;
  timer: ReturnType<typeof window.setInterval> | null;
  claimTimer: ReturnType<typeof window.setTimeout> | null;
  resultMessage?: string;

  constructor(options: any = {}) {
    super(options);
    this.rollTotal = Number(options.rollTotal ?? 15);
    this.dc = Number(options.dc ?? 15);
    this.profile = options.profile ? { ...options.profile } : getDifficultyProfile(this.rollTotal, this.dc);
    this.seed = options.seed ?? createRunSeed(this.rollTotal, this.dc, this.profile);
    this.onSuccess = typeof options.onSuccess === "function" ? options.onSuccess : null;
    this.onFailure = typeof options.onFailure === "function" ? options.onFailure : null;
    this.actorName = String(options.actorName ?? "Hacker");
    this.chatOnResult = options.chatOnResult !== false;
    this.graph = generateIntrusionGraph(this.profile, this.seed);
    this.state = {
      currentNodeId: this.graph.startNodeId,
      visitedNodeIds: new Set([this.graph.startNodeId]),
      traversedEdgeIds: new Set(),
      blockedEdgeIds: new Map(),
      deadNodeIds: new Set(),
      movement: null,
      claimingNodeId: null,
      mistakes: 0,
      traceProgress: 0,
      tracePenaltyProgress: 0,
      hasStarted: false,
      isRunning: false,
      result: null
    };
    this.startedAt = null;
    this.timer = null;
    this.claimTimer = null;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-node-intrusion-app",
      title: "Node Intrusion",
      classes: ["node-intrusion-window", "holosuite-hacking-window"],
      popOut: true,
      resizable: true,
      width: 980,
      height: 760,
      template: TEMPLATE_PATH
    });
  }

  getData() {
    const currentNode = this.getCurrentNode();
    const currentConnections = currentNode.connected;
    const radarEnabled = Boolean(this.profile.radarEnabled ?? this.profile.nodeIntrusion?.radarEnabled ?? Number(this.profile.radarRange ?? this.profile.nodeIntrusion?.radarRange) > 0);
    const nodes = this.graph.nodes.map((node) => {
      const isCurrent = node.id === this.state.currentNodeId;
      const isVisited = this.state.visitedNodeIds.has(node.id);
      const isClaiming = node.id === this.state.claimingNodeId;
      const isTargetVisible = node.type === "target" && (isVisited || this.profile.showTarget || this.profile.hintsEnabled);
      const isTypeVisible = node.type !== "target" && (this.profile.hintsEnabled || node.revealed || isVisited || node.type === "start");
      const displayType = isTargetVisible || isTypeVisible ? nodeTypeLabel(node.type) : "unknown";
      const radarVisible = radarEnabled && (isCurrent || isVisited || currentConnections.includes(node.id));
      const adjacentDanger = radarVisible && node.type !== "start" && node.type !== "target"
        ? this.countAdjacentBadNodes(node.id)
        : 0;
      const dangerSignal = clamp(adjacentDanger, 0, 2);

      return {
        ...node,
        visualType: isTargetVisible ? "target" : node.type === "target" ? "normal" : node.type,
        isTargetVisible,
        isCurrent,
        isVisited,
        isClaiming,
        isNeighbor: currentConnections.includes(node.id),
        canMove: currentConnections.includes(node.id)
          && !this.state.claimingNodeId
          && !this.state.blockedEdgeIds.has(edgeKey(currentNode.id, node.id))
          && !this.state.deadNodeIds.has(node.id),
        isDangerVisible: node.type !== "target" && (this.profile.hintsEnabled || node.revealed || isVisited),
        dangerSignal,
        displayType,
        title: `${node.id} - ${displayType}${dangerSignal ? ` / signal ${dangerSignal}` : ""}`
      };
    });

    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      nodes,
      edges: this.graph.edges.map((edge) => {
        const from = nodes.find((node) => node.id === edge.from);
        const to = nodes.find((node) => node.id === edge.to);
        const blockedType = this.state.blockedEdgeIds.get(edgeKey(edge.from, edge.to));
        return {
          ...edge,
          from,
          to,
          isVisitedPath: this.state.traversedEdgeIds.has(edgeKey(edge.from, edge.to)),
          isAvailable: !blockedType && (currentConnections.includes(edge.from) || currentConnections.includes(edge.to)),
          isFirewallPath: blockedType === "firewall",
          isDecoyPath: blockedType === "decoy"
        };
      }),
      movement: this.state.movement,
      currentNode: {
        id: currentNode.id,
        label: nodeTypeLabel(currentNode.type),
        availableRoutes: nodes.filter((node) => node.canMove).length
      },
      state: {
        ...this.state,
        visitedNodeIds: [...this.state.visitedNodeIds],
        traversedEdgeIds: [...this.state.traversedEdgeIds],
        blockedEdgeIds: [...this.state.blockedEdgeIds],
        deadNodeIds: [...this.state.deadNodeIds]
      },
      resultTitle: this.state.result === "success" ? "Access Granted" : "Intrusion Failed",
      resultDetail: this.resultMessage ?? (this.state.result === "success" ? "Target node breached." : "Trace or countermeasures completed."),
      glitchClass: this.profile.visualGlitchIntensity > 0.7 ? "glitch-high" : this.profile.visualGlitchIntensity > 0.35 ? "glitch-medium" : "glitch-low"
    };
  }

  activateListeners(html: any) {
    super.activateListeners(html);
    html.find("[data-node-id]").on("click", (event) => this.handleNodeClick(event.currentTarget.dataset.nodeId));
    html.find("[data-action='start']").on("click", () => this.startRun());
    html.find("[data-action='abort']").on("click", () => this.abort());
    this.syncDom();
  }

  async render(force?: any, options?: any) {
    const rendered = await super.render(force, options);
    if (this.state.hasStarted && this.state.isRunning) this.startTimer();
    return rendered;
  }

  async close(options: any = {}) {
    this.stopTimer();
    if (this.claimTimer) window.clearTimeout(this.claimTimer);
    this.claimTimer = null;
    return super.close(options);
  }

  getCurrentNode() {
    return this.graph.nodes.find((node) => node.id === this.state.currentNodeId) ?? this.graph.nodes[0];
  }

  getTraceDuration() {
    const multiplier = Number(game.settings.get(MODULE_ID, "traceDurationMultiplier") ?? 1) || 1;
    const traceDurationSeconds = Number(this.profile.nodeIntrusion?.traceDurationSeconds ?? this.profile.traceDurationSeconds ?? 60);
    return Math.max(5, traceDurationSeconds * multiplier);
  }

  countAdjacentBadNodes(nodeId: string) {
    const node = this.graph.nodes.find((candidate) => candidate.id === nodeId);
    if (!node) return 0;
    return node.connected.reduce((danger, connectedId) => {
      const connected = this.graph.nodes.find((candidate) => candidate.id === connectedId);
      return connected?.type === "firewall" || connected?.type === "decoy" ? danger + 1 : danger;
    }, 0);
  }

  firewallsArePassable() {
    return Boolean(this.profile.allowFirewallOnMainPath ?? this.profile.allowMainPathFirewalls ?? this.profile.nodeIntrusion?.allowFirewallOnMainPath);
  }

  startRun() {
    if (this.state.hasStarted || this.state.result) return;
    this.state.hasStarted = true;
    this.state.isRunning = true;
    this.startedAt = performance.now();
    this.startTimer();
    this.render(false);
  }

  handleNodeClick(nodeId: string) {
    if (!this.state.hasStarted || !this.state.isRunning) return;
    if (this.state.claimingNodeId) return;
    const current = this.getCurrentNode();
    const node = this.graph.nodes.find((candidate) => candidate.id === nodeId);
    if (!node) return;

    if (!current.connected.includes(nodeId)) {
      this.element?.find(".node-intrusion-shell").addClass("invalid-pulse");
      window.setTimeout(() => this.element?.find(".node-intrusion-shell").removeClass("invalid-pulse"), 280);
      return;
    }

    const routeKey = edgeKey(current.id, nodeId);
    if (this.state.blockedEdgeIds.has(routeKey) || this.state.deadNodeIds.has(nodeId)) {
      this.element?.find(".node-intrusion-shell").addClass("invalid-pulse");
      window.setTimeout(() => this.element?.find(".node-intrusion-shell").removeClass("invalid-pulse"), 280);
      return;
    }

    this.state.movement = {
      fromX: current.x,
      fromY: current.y,
      toX: node.x,
      toY: node.y,
      path: `M ${current.x} ${current.y} L ${node.x} ${node.y}`
    };
    this.state.claimingNodeId = nodeId;
    this.render(false);

    const baseClaimSeconds = Math.max(0.1, Number(this.profile.claimDurationSeconds ?? this.profile.nodeIntrusion?.claimDurationSeconds) || 0.5);
    const firewallMultiplier = Math.max(1, Number(this.profile.firewallClaimMultiplier ?? this.profile.nodeIntrusion?.firewallClaimMultiplier) || 1);
    const claimSeconds = node.type === "firewall" ? baseClaimSeconds * firewallMultiplier : baseClaimSeconds;
    this.claimTimer = window.setTimeout(() => {
      this.claimTimer = null;
      this.completeNodeClaim(current.id, nodeId);
    }, claimSeconds * 1000);
  }

  completeNodeClaim(fromNodeId: string, nodeId: string) {
    if (!this.state.hasStarted || !this.state.isRunning) return;
    const current = this.graph.nodes.find((candidate) => candidate.id === fromNodeId);
    const node = this.graph.nodes.find((candidate) => candidate.id === nodeId);
    if (!current || !node) return;

    const routeKey = edgeKey(current.id, nodeId);
    this.state.claimingNodeId = null;
    this.state.visitedNodeIds.add(nodeId);
    this.state.traversedEdgeIds.add(routeKey);
    node.visited = true;
    node.revealed = true;

    if (node.type === "firewall") {
      this.state.mistakes += 1;
      const penalty = Number(this.profile.firewallPenaltySeconds ?? this.profile.nodeIntrusion?.firewallPenaltySeconds) || 6;
      this.addTracePenalty(penalty);
      ui.notifications?.warn?.(`Firewall surge: trace accelerated by ${penalty}s.`);
      if (this.state.result) return;
      if (this.firewallsArePassable()) {
        this.state.currentNodeId = nodeId;
      } else {
        this.state.blockedEdgeIds.set(routeKey, "firewall");
        this.state.deadNodeIds.add(nodeId);
      }
      this.render(false);
      return;
    }

    if (node.type === "decoy") {
      this.state.mistakes += 1;
      this.state.blockedEdgeIds.set(routeKey, "decoy");
      this.state.deadNodeIds.add(nodeId);
      const penalty = Number(this.profile.decoyPenaltySeconds ?? this.profile.nodeIntrusion?.decoyPenaltySeconds) || 4;
      this.addTracePenalty(penalty);
      ui.notifications?.warn?.(`Decoy sink: trace accelerated by ${penalty}s.`);
      this.render(false);
      return;
    }

    this.state.currentNodeId = nodeId;

    if (node.type === "target") {
      this.finish("success", "Target node breached");
      return;
    }

    this.render(false);
  }

  addTracePenalty(seconds: number) {
    const penaltyProgress = (Math.max(0, seconds) / this.getTraceDuration()) * 100;
    this.state.tracePenaltyProgress = clamp(this.state.tracePenaltyProgress + penaltyProgress, 0, 100);
    this.state.traceProgress = clamp(this.state.traceProgress + penaltyProgress, 0, 100);
    this.syncDom();
    if (this.state.traceProgress >= 100) this.finish("failure", "Trace complete");
  }

  startTimer() {
    if (this.timer) return;
    if (!this.state.hasStarted || !this.startedAt) return;
    const duration = this.getTraceDuration();
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const elapsedSeconds = (performance.now() - this.startedAt) / 1000;
      this.state.traceProgress = clamp(((elapsedSeconds / duration) * 100) + this.state.tracePenaltyProgress, 0, 100);
      this.syncDom();
      if (this.state.traceProgress >= 100) this.finish("failure", "Trace complete");
    }, 120);
  }

  stopTimer() {
    if (!this.timer) return;
    window.clearInterval(this.timer);
    this.timer = null;
  }

  async abort() {
    await this.finish("failure", "Manual disconnect", { close: true });
  }

  async finish(result: "success" | "failure", message: string, { close = false } = {}) {
    if (this.state.result) return;
    this.state.isRunning = false;
    this.state.result = result;
    this.stopTimer();
    this.resultMessage = message;
    this.syncDom();
    await this.render(false);

    const payload = {
      type: "node-intrusion",
      result,
      message,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      tracePenaltyProgress: this.state.tracePenaltyProgress,
      traceProgress: this.state.traceProgress,
      visitedNodeIds: [...this.state.visitedNodeIds]
    };

    if (this.chatOnResult) {
      await postHackResultMessage({
        title: "Node Intrusion",
        result,
        actorName: this.actorName,
        message,
        rollTotal: this.rollTotal,
        dc: this.dc
      });
    }

    if (result === "success") this.onSuccess?.(payload);
    else this.onFailure?.(payload);
    if (close) await this.close();
  }

  syncDom() {
    const element = this.element?.[0];
    if (!element) return;
    const trace = element.querySelector("[data-trace-fill]");
    const traceText = element.querySelector("[data-trace-text]");
    const penaltyText = element.querySelector("[data-penalty-text]");
    if (trace) trace.style.width = `${this.state.traceProgress}%`;
    if (traceText) traceText.textContent = `${Math.round(this.state.traceProgress)}%`;
    if (penaltyText) penaltyText.textContent = `${Math.round(this.state.tracePenaltyProgress)}%`;
  }
}
