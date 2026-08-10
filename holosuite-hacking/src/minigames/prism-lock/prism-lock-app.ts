import { getDifficultyProfile } from "../../core/difficulty";
import { postHackResultMessage } from "../../core/chat";
import { evaluatePrismBoard, generatePrismLock, rotateRingState } from "./prism-lock-generator";
import { getLegacyApplicationBase } from "../../../../shared/src/application-base";

declare const foundry: any;
declare const game: any;
declare const ui: any;

const MODULE_ID = "holosuite-hacking";
const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/prism-lock.html`;
const LegacyApplication = getLegacyApplicationBase();

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createRunSeed(rollTotal: number, dc: number, profile: any) {
  const entropy = typeof globalThis.crypto?.randomUUID === "function"
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}:${performance.now()}:${Math.random()}`;
  return `${rollTotal}:${dc}:${profile.profileId ?? profile.id}:prism:${entropy}`;
}

export class PrismLockApp extends LegacyApplication {
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
  timer: ReturnType<typeof window.setInterval> | null;
  previousIceSlots: Set<number>;
  resultMessage?: string;

  constructor(options: any = {}) {
    super(options);
    this.rollTotal = Number(options.rollTotal ?? 15);
    this.dc = Number(options.dc ?? 15);
    this.profile = options.profile ? { ...options.profile } : getDifficultyProfile(this.rollTotal, this.dc);
    this.tuning = this.profile.prismLock ?? {};
    this.seed = options.seed ?? createRunSeed(this.rollTotal, this.dc, this.profile);
    this.actorName = String(options.actorName ?? "Hacker");
    this.onSuccess = typeof options.onSuccess === "function" ? options.onSuccess : null;
    this.onFailure = typeof options.onFailure === "function" ? options.onFailure : null;
    this.chatOnResult = options.chatOnResult !== false;
    this.board = generatePrismLock(this.profile, this.seed);
    this.state = {
      rings: this.board.initialStates.map((state) => ({ ...state })),
      hasStarted: false,
      isRunning: false,
      result: null,
      traceProgress: 0,
      tracePenaltySeconds: 0,
      moves: 0
    };
    this.startedAt = null;
    this.timer = null;
    this.previousIceSlots = new Set(evaluatePrismBoard(this.board, this.state.rings).activeIceSlots);
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-prism-lock-app",
      title: "Prism Lock",
      classes: ["prism-lock-window", "holosuite-hacking-window"],
      popOut: true,
      resizable: true,
      width: 940,
      height: 760,
      template: TEMPLATE_PATH
    });
  }

  getData() {
    const evaluation = evaluatePrismBoard(this.board, this.state.rings);
    const rings = this.board.rings.map((ring) => {
      const state = this.state.rings.find((candidate) => candidate.id === ring.id) ?? {};
      return {
        ...ring,
        rotation: state.rotation ?? 0,
        enabled: state.enabled !== false,
        statusLabel: state.enabled === false ? "phased out" : "active"
      };
    });

    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      tuning: this.tuning,
      board: this.board,
      rings,
      evaluation,
      state: this.state,
      receiverPercent: Math.round((evaluation.litReceiverCount / this.board.receiverCount) * 100),
      resultTitle: this.state.result === "success" ? "Lattice Resolved" : "Prism Lock Rejected",
      resultDetail: this.resultMessage ?? (this.state.result === "success" ? "All authorization receptors illuminated." : "Trace completed before alignment."),
      glitchClass: this.profile.visualGlitchIntensity > 0.7 ? "glitch-high" : this.profile.visualGlitchIntensity > 0.35 ? "glitch-medium" : "glitch-low"
    };
  }

  activateListeners(html: any) {
    super.activateListeners(html);
    html.find("[data-action='rotate-ring']").on("click", (event) => {
      this.rotateRing(event.currentTarget.dataset.ringId, Number(event.currentTarget.dataset.direction));
    });
    html.find("[data-action='toggle-ring']").on("click", (event) => this.toggleRing(event.currentTarget.dataset.ringId));
    html.find("[data-action='start']").on("click", () => this.startRun());
    html.find("[data-action='abort']").on("click", () => this.abort());
    html.find("[data-action='close']").on("click", () => this.close());
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

  getTraceDuration() {
    const multiplier = Number(game.settings.get(MODULE_ID, "traceDurationMultiplier") ?? 1) || 1;
    return Math.max(5, Number(this.tuning.traceDurationSeconds ?? this.profile.traceDurationSeconds ?? 60) * multiplier);
  }

  startRun() {
    if (this.state.hasStarted || this.state.result) return;
    this.state.hasStarted = true;
    this.state.isRunning = true;
    this.startedAt = performance.now();
    this.previousIceSlots = new Set(evaluatePrismBoard(this.board, this.state.rings).activeIceSlots);
    this.render(false);
  }

  rotateRing(ringId: string, direction: number) {
    if (!this.state.isRunning || !direction) return;
    this.state.rings = rotateRingState(this.state.rings, ringId, direction, this.board.slotCount);
    this.state.moves += 1;
    this.evaluateMove();
  }

  toggleRing(ringId: string) {
    if (!this.state.isRunning) return;
    const ring = this.board.rings.find((candidate) => candidate.id === ringId);
    if (!ring?.switchable) return;
    this.state.rings = this.state.rings.map((state) => state.id === ringId
      ? { ...state, enabled: !state.enabled }
      : { ...state });
    this.state.moves += 1;
    this.evaluateMove();
  }

  evaluateMove() {
    const evaluation = evaluatePrismBoard(this.board, this.state.rings);
    const newIceContacts = evaluation.activeIceSlots.filter((slot) => !this.previousIceSlots.has(slot));
    this.previousIceSlots = new Set(evaluation.activeIceSlots);
    if (newIceContacts.length) {
      const penalty = Math.max(0, Number(this.tuning.icePenaltySeconds ?? 5)) * newIceContacts.length;
      this.state.tracePenaltySeconds += penalty;
      if (penalty > 0) ui.notifications?.warn?.(`ICE receptor energized. Trace jumped by ${penalty}s.`);
    }
    if (evaluation.solved) {
      this.finish("success", "Authorization lattice resolved");
      return;
    }
    this.render(false);
  }

  startTimer() {
    if (this.timer || !this.state.hasStarted || !this.startedAt) return;
    this.timer = window.setInterval(() => {
      if (!this.state.isRunning || !this.startedAt) return;
      const elapsedSeconds = ((performance.now() - this.startedAt) / 1000) + this.state.tracePenaltySeconds;
      this.state.traceProgress = clamp((elapsedSeconds / this.getTraceDuration()) * 100, 0, 100);
      this.syncDom();
      if (this.state.traceProgress >= 100) this.finish("failure", "Trace complete");
    }, 120);
  }

  stopTimer() {
    if (!this.timer) return;
    window.clearInterval(this.timer);
    this.timer = null;
  }

  syncDom() {
    const element = this.element?.[0] as HTMLElement | undefined;
    if (!element) return;
    const trace = element.querySelector<HTMLElement>("[data-trace-fill]");
    const traceText = element.querySelector("[data-trace-text]");
    if (trace) trace.style.width = `${this.state.traceProgress}%`;
    if (traceText) traceText.textContent = `${Math.round(this.state.traceProgress)}%`;
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
    const evaluation = evaluatePrismBoard(this.board, this.state.rings);
    const payload = {
      type: "prism-lock",
      result,
      message,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      moves: this.state.moves,
      litReceiverCount: evaluation.litReceiverCount,
      activeIceSlots: evaluation.activeIceSlots,
      tracePenaltySeconds: this.state.tracePenaltySeconds,
      traceProgress: this.state.traceProgress
    };

    if (this.chatOnResult) {
      await postHackResultMessage({
        title: "Prism Lock",
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
