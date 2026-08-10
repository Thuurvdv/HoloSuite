import { getDifficultyProfile } from "../../core/difficulty";
import { postHackResultMessage } from "../../core/chat";
import {
  cycleJunctionDirection,
  describeDirection,
  generatePacketSwitchboard,
  normalizeJunctionDirection,
  tracePacketRoute
} from "./packet-switchboard-generator";
import { getLegacyApplicationBase } from "../../../../shared/src/application-base";

declare const foundry: any;
declare const game: any;
declare const ui: any;

const MODULE_ID = "holosuite-hacking";
const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/packet-switchboard.html`;
const LegacyApplication = getLegacyApplicationBase();

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createRunSeed(rollTotal: number, dc: number, profile: any) {
  const entropy = typeof globalThis.crypto?.randomUUID === "function"
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}:${performance.now()}:${Math.random()}`;
  return `${rollTotal}:${dc}:${profile.profileId ?? profile.id}:switchboard:${entropy}`;
}

export class PacketSwitchboardApp extends LegacyApplication {
  rollTotal: number;
  dc: number;
  profile: any;
  tuning: any;
  seed: string;
  actorName: string;
  onSuccess: any;
  onFailure: any;
  chatOnResult: boolean;
  board: any;
  state: any;
  startedAt: number | null;
  nextSpawnAt: number | null;
  timer: ReturnType<typeof window.setInterval> | null;
  hoveredJunctionId: string | null;
  boundHoveredKeydown: (event: KeyboardEvent) => void;
  resultMessage?: string;

  constructor(options: any = {}) {
    super(options);
    this.rollTotal = Number(options.rollTotal ?? 15);
    this.dc = Number(options.dc ?? 15);
    this.profile = options.profile ? { ...options.profile } : getDifficultyProfile(this.rollTotal, this.dc);
    this.tuning = this.profile.packetSwitchboard ?? {};
    this.seed = options.seed ?? createRunSeed(this.rollTotal, this.dc, this.profile);
    this.actorName = String(options.actorName ?? "Hacker");
    this.onSuccess = typeof options.onSuccess === "function" ? options.onSuccess : null;
    this.onFailure = typeof options.onFailure === "function" ? options.onFailure : null;
    this.chatOnResult = options.chatOnResult !== false;
    this.board = generatePacketSwitchboard(this.profile, this.seed);
    this.state = {
      hasStarted: false,
      isRunning: false,
      result: null,
      traceProgress: 0,
      tracePenaltySeconds: 0,
      delivered: 0,
      corrupted: 0,
      nextPacketIndex: 0,
      activePackets: []
    };
    this.startedAt = null;
    this.nextSpawnAt = null;
    this.timer = null;
    this.hoveredJunctionId = null;
    this.boundHoveredKeydown = (event) => this.handleHoveredJunctionKeydown(event);
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-packet-switchboard-app",
      title: "Packet Switchboard",
      classes: ["packet-switchboard-window", "holosuite-hacking-window"],
      popOut: true,
      resizable: true,
      width: 980,
      height: 760,
      template: TEMPLATE_PATH
    });
  }

  getData() {
    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      tuning: this.tuning,
      board: this.board,
      state: this.state,
      deliveryPercent: Math.round((this.state.delivered / this.board.deliveryGoal) * 100),
      nextPackets: this.getUpcomingPackets(),
      gridStyle: `--lane-count: ${this.board.laneCount}; --column-count: ${this.board.columnCount};`,
      resultTitle: this.state.result === "success" ? "Payload Delivered" : "Routing Compromised",
      resultDetail: this.resultMessage ?? (this.state.result === "success" ? "All priority packets reached their ports." : "Trace completed before delivery."),
      glitchClass: this.profile.visualGlitchIntensity > 0.7 ? "glitch-high" : this.profile.visualGlitchIntensity > 0.35 ? "glitch-medium" : "glitch-low"
    };
  }

  activateListeners(html: any) {
    super.activateListeners(html);
    this.hoveredJunctionId = null;
    html.find("[data-junction-id]").on("click", (event) => this.cycleJunction(event.currentTarget.dataset.junctionId));
    html.find("[data-junction-id]").on("mouseenter", (event) => this.setHoveredJunction(event.currentTarget.dataset.junctionId, event.currentTarget));
    html.find("[data-junction-id]").on("mouseleave", (event) => this.clearHoveredJunction(event.currentTarget.dataset.junctionId, event.currentTarget));
    html.find("[data-action='start']").on("click", () => this.startRun());
    html.find("[data-action='abort']").on("click", () => this.abort());
    html.find("[data-action='close']").on("click", () => this.close());
    window.removeEventListener("keydown", this.boundHoveredKeydown);
    window.addEventListener("keydown", this.boundHoveredKeydown);
    this.syncDom();
  }

  async render(force?: any, options?: any) {
    const rendered = await super.render(force, options);
    if (this.state.hasStarted && this.state.isRunning) this.startTimer();
    return rendered;
  }

  async close(options: any = {}) {
    this.stopTimer();
    window.removeEventListener("keydown", this.boundHoveredKeydown);
    return super.close(options);
  }

  getTraceDuration() {
    const multiplier = Number(game.settings.get(MODULE_ID, "traceDurationMultiplier") ?? 1) || 1;
    return Math.max(5, Number(this.tuning.traceDurationSeconds ?? this.profile.traceDurationSeconds ?? 60) * multiplier);
  }

  getUpcomingPackets() {
    const count = Math.max(0, Number(this.tuning.previewCount ?? this.board.previewCount) || 0);
    return this.board.packetPlan.slice(this.state.nextPacketIndex, this.state.nextPacketIndex + count);
  }

  getMaxActivePackets() {
    return clamp(Math.round(Number(this.tuning.maxActivePackets) || 2), 1, 6);
  }

  startRun() {
    if (this.state.hasStarted || this.state.result) return;
    this.state.hasStarted = true;
    this.state.isRunning = true;
    this.startedAt = performance.now();
    this.nextSpawnAt = this.startedAt;
    this.render(false);
  }

  setHoveredJunction(junctionId: string, element?: HTMLElement) {
    this.hoveredJunctionId = junctionId;
    element?.classList.add("is-keyboard-target");
  }

  clearHoveredJunction(junctionId: string, element?: HTMLElement) {
    element?.classList.remove("is-keyboard-target");
    if (this.hoveredJunctionId === junctionId) this.hoveredJunctionId = null;
  }

  handleHoveredJunctionKeydown(event: KeyboardEvent) {
    if (!this.hoveredJunctionId || event.altKey || event.ctrlKey || event.metaKey) return;
    const directions: Record<string, number> = {
      ArrowUp: -1,
      ArrowRight: 0,
      ArrowDown: 1
    };
    if (!(event.key in directions)) return;
    event.preventDefault();
    event.stopPropagation();
    this.setJunctionDirection(this.hoveredJunctionId, directions[event.key]);
  }

  cycleJunction(junctionId: string) {
    if (this.state.result) return;
    const junction = this.board.junctions.find((candidate) => candidate.id === junctionId);
    if (!junction) return;
    this.setJunctionDirection(junctionId, cycleJunctionDirection(junction.direction, junction.row, this.board.laneCount));
  }

  setJunctionDirection(junctionId: string, direction: number) {
    if (this.state.result) return;
    const junction = this.board.junctions.find((candidate) => candidate.id === junctionId);
    if (!junction) return;
    junction.direction = normalizeJunctionDirection(direction, junction.row, this.board.laneCount);
    junction.directionLabel = describeDirection(junction.direction);
    const element = this.element?.[0]?.querySelector(`[data-junction-id="${junction.id}"]`) as HTMLElement | null;
    if (element) {
      element.dataset.direction = junction.directionLabel;
      element.setAttribute("aria-label", `Junction lane ${junction.row + 1}, column ${junction.column + 1}: ${junction.directionLabel}`);
      element.setAttribute("title", `Route ${junction.directionLabel}. Click to change direction.`);
    }
    this.syncRoutePreview();
  }

  startTimer() {
    if (this.timer || !this.state.hasStarted || !this.startedAt) return;
    this.timer = window.setInterval(() => this.tick(performance.now()), 80);
  }

  stopTimer() {
    if (!this.timer) return;
    window.clearInterval(this.timer);
    this.timer = null;
  }

  tick(now: number) {
    if (!this.state.isRunning || !this.startedAt || this.nextSpawnAt === null) return;
    const spawnIntervalMs = Math.max(350, Number(this.tuning.packetIntervalSeconds ?? 2) * 1000);
    while (now >= this.nextSpawnAt && this.state.isRunning) {
      if (this.state.activePackets.length >= this.getMaxActivePackets()) break;
      this.spawnPacket(now);
      this.nextSpawnAt += spawnIntervalMs;
    }

    const stepMs = Math.max(250, Number(this.tuning.packetStepSeconds ?? 0.8) * 1000);
    for (const packet of [...this.state.activePackets]) {
      while (this.state.isRunning && now >= packet.nextMoveAt) {
        this.advancePacket(packet);
        packet.nextMoveAt += stepMs;
        if (!this.state.activePackets.includes(packet)) break;
      }
    }

    const elapsedSeconds = ((now - this.startedAt) / 1000) + this.state.tracePenaltySeconds;
    this.state.traceProgress = clamp((elapsedSeconds / this.getTraceDuration()) * 100, 0, 100);
    this.syncDom();
    if (this.state.traceProgress >= 100) this.finish("failure", "Trace complete");
  }

  spawnPacket(now: number) {
    const source = this.board.packetPlan[this.state.nextPacketIndex % this.board.packetPlan.length];
    this.state.nextPacketIndex += 1;
    this.state.activePackets.push({
      ...source,
      runtimeId: `${source.id}-${this.state.nextPacketIndex}`,
      row: source.sourceRow,
      column: -1,
      nextMoveAt: now + Math.max(0, Number(this.tuning.entryHoldSeconds ?? 1.5) * 1000)
    });
    this.syncPreview();
  }

  advancePacket(packet: any) {
    if (packet.column < 0) {
      packet.column = 0;
      return;
    }

    const junction = this.board.junctions.find((candidate) => candidate.row === packet.row && candidate.column === packet.column);
    packet.row = clamp(packet.row + Number(junction?.direction ?? 0), 0, this.board.laneCount - 1);
    packet.column += 1;
    if (packet.column >= this.board.columnCount) this.resolvePacket(packet);
  }

  resolvePacket(packet: any) {
    this.state.activePackets = this.state.activePackets.filter((candidate) => candidate.runtimeId !== packet.runtimeId);
    if (packet.row === packet.targetRow) {
      this.state.delivered += 1;
      this.flashBoard("delivery-pulse");
      if (this.state.delivered >= this.board.deliveryGoal) this.finish("success", "Priority payload delivered");
      return;
    }

    this.state.corrupted += 1;
    const penalty = Math.max(0, Number(this.tuning.misroutePenaltySeconds ?? 5));
    this.state.tracePenaltySeconds += penalty;
    this.flashBoard("misroute-pulse");
    if (penalty > 0) ui.notifications?.warn?.(`Packet misrouted. Trace jumped by ${penalty}s.`);
  }

  flashBoard(className: string) {
    const shell = this.element?.find?.(".packet-switchboard-shell");
    shell?.addClass?.(className);
    window.setTimeout(() => shell?.removeClass?.(className), 320);
  }

  syncPreview() {
    const preview = this.element?.[0]?.querySelector("[data-packet-preview]");
    if (!preview) return;
    preview.replaceChildren(...this.getUpcomingPackets().map((packet: any) => {
      const item = document.createElement("span");
      item.className = "packet-preview-chip";
      item.style.setProperty("--packet-color", packet.color);
      item.textContent = `${packet.sourcePort} -> ${packet.port} / ${packet.label}`;
      return item;
    }));
    if (!preview.childElementCount) {
      const hidden = document.createElement("span");
      hidden.className = "packet-preview-hidden";
      hidden.textContent = "Encrypted";
      preview.appendChild(hidden);
    }
    this.syncRoutePreview();
  }

  syncRoutePreview() {
    const root = this.element?.[0] as HTMLElement | undefined;
    if (!root) return;
    root.querySelectorAll(".packet-junction.is-route-preview, .packet-junction.is-route-danger").forEach((element) => {
      element.classList.remove("is-route-preview", "is-route-danger");
    });
    root.querySelectorAll(".packet-switchboard-inputs .is-preview-source, .packet-switchboard-outputs .is-preview-target").forEach((element) => {
      element.classList.remove("is-preview-source", "is-preview-target");
    });

    const activePacket = this.state.activePackets[0] ?? null;
    const packet = activePacket ?? this.getUpcomingPackets()[0] ?? null;
    if (!packet) {
      this.syncConnectionLines();
      return;
    }
    const startColumn = activePacket ? Math.max(0, Number(activePacket.column) || 0) : 0;
    const startRow = activePacket ? activePacket.row : packet.sourceRow;
    const route = tracePacketRoute(this.board, packet, startColumn, startRow);
    for (const junctionId of route.junctionIds) {
      const junction = root.querySelector(`[data-junction-id="${junctionId}"]`);
      junction?.classList.add("is-route-preview");
      if (!route.reachesTarget) junction?.classList.add("is-route-danger");
    }
    root.querySelector(`[data-input-row="${packet.sourceRow}"]`)?.classList.add("is-preview-source");
    root.querySelector(`[data-output-row="${packet.targetRow}"]`)?.classList.add("is-preview-target");
    this.syncConnectionLines();
  }

  syncConnectionLines() {
    const root = this.element?.[0] as HTMLElement | undefined;
    if (!root) return;
    const firstJunctionX = (0.5 / this.board.columnCount) * 100;
    for (const lane of this.board.lanes) {
      const inputLine = root.querySelector<SVGLineElement>(`[data-input-connection-row="${lane.row}"]`);
      if (!inputLine) continue;
      const y = ((lane.row + 0.5) / this.board.laneCount) * 100;
      inputLine.setAttribute("x1", "0");
      inputLine.setAttribute("y1", String(y));
      inputLine.setAttribute("x2", String(firstJunctionX));
      inputLine.setAttribute("y2", String(y));
      const sourceElement = root.querySelector(`[data-input-row="${lane.row}"]`);
      const firstRouteJunction = root.querySelector(".packet-junction.is-route-preview");
      const isFocusedSource = Boolean(sourceElement?.classList.contains("is-preview-source"));
      inputLine.classList.toggle("is-route-preview", isFocusedSource);
      inputLine.classList.toggle("is-route-danger", isFocusedSource && Boolean(firstRouteJunction?.classList.contains("is-route-danger")));
    }

    for (const junction of this.board.junctions) {
      const line = root.querySelector<SVGLineElement>(`[data-connection-id="${junction.id}"]`);
      if (!line) continue;
      const direction = normalizeJunctionDirection(junction.direction, junction.row, this.board.laneCount);
      const nextRow = clamp(junction.row + direction, 0, this.board.laneCount - 1);
      const x1 = ((junction.column + 0.5) / this.board.columnCount) * 100;
      const x2 = junction.column >= this.board.columnCount - 1
        ? 100
        : ((junction.column + 1.5) / this.board.columnCount) * 100;
      const y1 = ((junction.row + 0.5) / this.board.laneCount) * 100;
      const y2 = ((nextRow + 0.5) / this.board.laneCount) * 100;
      line.setAttribute("x1", String(x1));
      line.setAttribute("y1", String(y1));
      line.setAttribute("x2", String(x2));
      line.setAttribute("y2", String(y2));
      const junctionElement = root.querySelector(`[data-junction-id="${junction.id}"]`);
      line.classList.toggle("is-route-preview", Boolean(junctionElement?.classList.contains("is-route-preview")));
      line.classList.toggle("is-route-danger", Boolean(junctionElement?.classList.contains("is-route-danger")));
    }
  }

  syncPackets() {
    const layer = this.element?.[0]?.querySelector("[data-packet-layer]") as HTMLElement | null;
    if (!layer) return;
    const liveIds = new Set(this.state.activePackets.map((packet) => packet.runtimeId));
    layer.querySelectorAll("[data-runtime-packet]").forEach((element) => {
      const packetElement = element as HTMLElement;
      if (!liveIds.has(packetElement.dataset.runtimePacket)) packetElement.remove();
    });

    for (const packet of this.state.activePackets) {
      let element = layer.querySelector(`[data-runtime-packet="${packet.runtimeId}"]`) as HTMLElement | null;
      if (!element) {
        element = document.createElement("div");
        element.className = "switchboard-packet";
        element.dataset.runtimePacket = packet.runtimeId;
        element.style.setProperty("--packet-color", packet.color);
        const label = document.createElement("span");
        label.textContent = String(packet.targetRow + 1);
        element.appendChild(label);
        element.title = `${packet.label} packet to ${packet.port}`;
        layer.appendChild(element);
      }
      const x = packet.column < 0 ? 0 : ((packet.column + 0.5) / this.board.columnCount) * 100;
      const y = ((packet.row + 0.5) / this.board.laneCount) * 100;
      element.style.left = `${clamp(x, 0, 100)}%`;
      element.style.top = `${y}%`;
    }
  }

  syncDom() {
    const element = this.element?.[0] as HTMLElement | undefined;
    if (!element) return;
    const trace = element.querySelector<HTMLElement>("[data-trace-fill]");
    const delivery = element.querySelector<HTMLElement>("[data-delivery-fill]");
    if (trace) trace.style.width = `${this.state.traceProgress}%`;
    if (delivery) delivery.style.width = `${Math.min(100, (this.state.delivered / this.board.deliveryGoal) * 100)}%`;
    const values: Record<string, string> = {
      "[data-trace-text]": `${Math.round(this.state.traceProgress)}%`,
      "[data-delivery-text]": `${this.state.delivered} / ${this.board.deliveryGoal}`,
      "[data-corrupted-text]": String(this.state.corrupted),
      "[data-active-text]": `${this.state.activePackets.length} / ${this.getMaxActivePackets()}`
    };
    for (const [selector, value] of Object.entries(values)) {
      const target = element.querySelector(selector);
      if (target) target.textContent = value;
    }
    this.syncPackets();
    this.syncRoutePreview();
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
    await this.render(false);

    const payload = {
      type: "packet-switchboard",
      result,
      message,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      delivered: this.state.delivered,
      corrupted: this.state.corrupted,
      tracePenaltySeconds: this.state.tracePenaltySeconds,
      traceProgress: this.state.traceProgress
    };

    if (this.chatOnResult) {
      await postHackResultMessage({
        title: "Packet Switchboard",
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
}
