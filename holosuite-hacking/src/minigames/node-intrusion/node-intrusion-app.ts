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
  resultMessage?: string;

  constructor(options: any = {}) {
    super(options);
    this.rollTotal = Number(options.rollTotal ?? 15);
    this.dc = Number(options.dc ?? 15);
    this.profile = options.profile ? { ...options.profile } : getDifficultyProfile(this.rollTotal, this.dc);
    this.seed = options.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}`;
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
      mistakes: 0,
      traceProgress: 0,
      hasStarted: false,
      isRunning: false,
      result: null
    };
    this.startedAt = null;
    this.timer = null;
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
    const nodes = this.graph.nodes.map((node) => {
      const isCurrent = node.id === this.state.currentNodeId;
      const isVisited = this.state.visitedNodeIds.has(node.id);
      const isTargetVisible = node.type === "target" && isVisited;
      const isTypeVisible = node.type !== "target" && (this.profile.hintsEnabled || node.revealed || isVisited || node.type === "start");
      const displayType = isTargetVisible || isTypeVisible ? nodeTypeLabel(node.type) : "unknown";

      return {
        ...node,
        visualType: isTargetVisible ? "target" : node.type === "target" ? "normal" : node.type,
        isCurrent,
        isVisited,
        isNeighbor: currentConnections.includes(node.id),
        canMove: currentConnections.includes(node.id)
          && !this.state.blockedEdgeIds.has(edgeKey(currentNode.id, node.id))
          && !this.state.deadNodeIds.has(node.id),
        isDangerVisible: node.type !== "target" && (this.profile.hintsEnabled || node.revealed || isVisited),
        displayType,
        title: `${node.id} - ${displayType}`
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
          isBlocked: Boolean(blockedType),
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
    return super.close(options);
  }

  getCurrentNode() {
    return this.graph.nodes.find((node) => node.id === this.state.currentNodeId) ?? this.graph.nodes[0];
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

    this.state.visitedNodeIds.add(nodeId);
    this.state.traversedEdgeIds.add(routeKey);
    this.state.movement = {
      fromX: current.x,
      fromY: current.y,
      toX: node.x,
      toY: node.y,
      path: `M ${current.x} ${current.y} L ${node.x} ${node.y}`
    };
    node.visited = true;
    node.revealed = true;

    if (node.type === "firewall") {
      this.state.mistakes += 1;
      this.state.blockedEdgeIds.set(routeKey, "firewall");
      this.state.deadNodeIds.add(nodeId);
      ui.notifications?.warn?.(`Firewall tripped (${this.state.mistakes}/${this.profile.maxMistakes}).`);
      if (this.state.mistakes > this.profile.maxMistakes) {
        this.finish("failure", "Firewall countermeasures locked the intrusion");
        return;
      }
      this.render(false);
      return;
    }

    if (node.type === "decoy") {
      this.state.mistakes += 1;
      this.state.blockedEdgeIds.set(routeKey, "decoy");
      this.state.deadNodeIds.add(nodeId);
      ui.notifications?.warn?.(`Decoy route burned (${this.state.mistakes}/${this.profile.maxMistakes}).`);
      if (this.state.mistakes > this.profile.maxMistakes) {
        this.finish("failure", "The intrusion collapsed into decoy space");
        return;
      }
      this.render(false);
      return;
    }

    this.state.currentNodeId = nodeId;

    if (node.type === "target") {
      this.finish("success", "Target node breached");
      return;
    }

    if (this.state.mistakes > this.profile.maxMistakes) {
      this.finish("failure", "Firewall countermeasures locked the intrusion");
      return;
    }

    this.render(false);
  }

  startTimer() {
    if (this.timer) return;
    if (!this.state.hasStarted || !this.startedAt) return;
    const multiplier = Number(game.settings.get(MODULE_ID, "traceDurationMultiplier") ?? 1) || 1;
    const duration = Math.max(5, this.profile.traceDurationSeconds * multiplier);
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const elapsedSeconds = (performance.now() - this.startedAt) / 1000;
      this.state.traceProgress = clamp((elapsedSeconds / duration) * 100, 0, 100);
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
    const mistakeText = element.querySelector("[data-mistake-text]");
    if (trace) trace.style.width = `${this.state.traceProgress}%`;
    if (traceText) traceText.textContent = `${Math.round(this.state.traceProgress)}%`;
    if (mistakeText) mistakeText.textContent = `${this.state.mistakes}/${this.profile.maxMistakes}`;
  }
}
