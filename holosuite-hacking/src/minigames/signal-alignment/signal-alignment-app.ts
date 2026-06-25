import { getDifficultyProfile } from "../../core/difficulty";
import { postHackResultMessage } from "../../core/chat";
import { clampFrequency, generateSignalChannels } from "./signal-alignment-generator";
import { getLegacyApplicationBase } from "../../../../shared/src/application-base";

declare const foundry: any;
declare const game: any;
declare const ui: any;

const MODULE_ID = "holosuite-hacking";
const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/signal-alignment.html`;
const LegacyApplication = getLegacyApplicationBase();

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export class SignalAlignmentApp extends LegacyApplication {
  rollTotal: number;
  dc: number;
  profile: any;
  seed: string;
  onSuccess: any;
  onFailure: any;
  actorName: string;
  chatOnResult: boolean;
  channels: any[];
  state: any;
  startedAt: number | null;
  lastTickAt: number | null;
  timer: ReturnType<typeof window.setInterval> | null;
  wasAligned: boolean;
  resultMessage?: string;

  constructor(options: any = {}) {
    super(options);
    this.rollTotal = Number(options.rollTotal ?? 15);
    this.dc = Number(options.dc ?? 15);
    this.profile = options.profile ? { ...options.profile } : getDifficultyProfile(this.rollTotal, this.dc);
    this.seed = options.seed ?? `${this.rollTotal}:${this.dc}:${this.profile.profileId ?? this.profile.id}:signal`;
    this.onSuccess = typeof options.onSuccess === "function" ? options.onSuccess : null;
    this.onFailure = typeof options.onFailure === "function" ? options.onFailure : null;
    this.actorName = String(options.actorName ?? "Hacker");
    this.chatOnResult = options.chatOnResult !== false;
    this.channels = generateSignalChannels(this.profile, this.seed);
    this.state = {
      traceProgress: 0,
      mistakes: 0,
      lockProgress: 0,
      tracePenaltySeconds: 0,
      hasStarted: false,
      isRunning: false,
      result: null
    };
    this.startedAt = null;
    this.lastTickAt = null;
    this.timer = null;
    this.wasAligned = false;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-signal-alignment-app",
      title: "Signal Alignment",
      classes: ["signal-alignment-window", "holosuite-hacking-window"],
      popOut: true,
      resizable: true,
      width: 840,
      height: 640,
      template: TEMPLATE_PATH
    });
  }

  getData() {
    const channels = this.channels.map((channel) => {
      const delta = Math.abs(channel.value - channel.target);
      const aligned = delta <= channel.tolerance;
      const targetVisible = this.isTargetVisible(channel);
      return {
        ...channel,
        valueLabel: channel.value.toFixed(1),
        aligned,
        targetVisible,
        targetLabel: targetVisible ? channel.target : "??",
        deltaRevealLabel: targetVisible ? delta.toFixed(1) : "--",
        targetStateLabel: aligned ? "locked" : targetVisible ? "signal found" : "searching",
        waveDurationSeconds: Math.max(1.2, 3.2 - (Number(this.profile.noiseLevel ?? 0) * 2)),
        targetLeft: channel.target,
        toleranceLeft: clamp(channel.target - channel.tolerance, 0, 100),
        toleranceWidth: clamp(channel.tolerance * 2, 1, 100)
      };
    });

    return {
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      channels,
      state: this.state,
      allAligned: this.areAllChannelsAligned(),
      lockPercent: Math.round(this.state.lockProgress * 100),
      resultTitle: this.state.result === "success" ? "Signal Locked" : "Signal Lost",
      resultDetail: this.resultMessage ?? (this.state.result === "success" ? "Transmission Decrypted" : "Trace Complete"),
      glitchClass: this.profile.visualGlitchIntensity > 0.7 ? "glitch-high" : this.profile.visualGlitchIntensity > 0.35 ? "glitch-medium" : "glitch-low"
    };
  }

  activateListeners(html: any) {
    super.activateListeners(html);
    html.find("[data-channel-slider]").on("input", (event) => this.handleSlider(event.currentTarget));
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

  startRun() {
    if (this.state.hasStarted || this.state.result) return;
    this.state.hasStarted = true;
    this.state.isRunning = true;
    this.startedAt = performance.now();
    this.lastTickAt = this.startedAt;
    this.startTimer();
    this.render(false);
  }

  handleSlider(slider: HTMLInputElement) {
    if (!this.state.hasStarted || !this.state.isRunning) return;
    const channel = this.channels.find((candidate) => candidate.id === slider.dataset.channelSlider);
    if (!channel) return;
    channel.value = clampFrequency(slider.value);
    this.checkDestabilization();
    this.syncDom();
  }

  areAllChannelsAligned() {
    return this.channels.every((channel) => Math.abs(channel.value - channel.target) <= channel.tolerance);
  }

  isTargetVisible(channel: any) {
    const delta = Math.abs(channel.value - channel.target);
    const revealRadius = Number(this.profile.targetRevealRadius ?? this.profile.signalAlignment?.targetRevealRadius ?? 100);
    if (revealRadius >= 100) return true;
    if (delta <= channel.tolerance) return true;
    return delta <= revealRadius;
  }

  updateAlignmentState(aligned = this.areAllChannelsAligned()) {
    if (this.wasAligned && !aligned) {
      this.recordTraceSpike();
    }
    this.wasAligned = aligned;
  }

  checkDestabilization() {
    this.updateAlignmentState();
  }

  recordTraceSpike() {
    const penalty = Math.max(0, Number(this.profile.destabilizationPenaltySeconds ?? 0));
    this.state.mistakes += 1;
    this.state.tracePenaltySeconds += penalty;
    if (penalty > 0) ui.notifications?.warn?.(`Signal destabilized. Trace jumped by ${penalty}s.`);
  }

  startTimer() {
    if (this.timer) return;
    if (!this.state.hasStarted || !this.startedAt || !this.lastTickAt) return;
    const multiplier = Number(game.settings.get(MODULE_ID, "traceDurationMultiplier") ?? 1) || 1;
    const traceDurationSeconds = Number(this.profile.signalAlignment?.traceDurationSeconds ?? this.profile.traceDurationSeconds ?? 60);
    const duration = Math.max(5, traceDurationSeconds * multiplier);
    this.timer = window.setInterval(() => {
      if (!this.state.hasStarted || !this.state.isRunning) return;
      const now = performance.now();
      const deltaSeconds = Math.min(0.5, (now - this.lastTickAt) / 1000);
      this.lastTickAt = now;

      this.applyDrift(deltaSeconds);
      const aligned = this.areAllChannelsAligned();
      this.state.lockProgress = aligned
        ? clamp(this.state.lockProgress + (deltaSeconds / this.profile.lockHoldSeconds), 0, 1)
        : 0;

      this.updateAlignmentState(aligned);

      const elapsedSeconds = ((now - this.startedAt) / 1000) + this.state.tracePenaltySeconds;
      this.state.traceProgress = clamp((elapsedSeconds / duration) * 100, 0, 100);
      this.syncDom();

      if (this.state.lockProgress >= 1) this.finish("success", "Transmission Decrypted");
      else if (this.state.traceProgress >= 100) this.finish("failure", "Trace Complete");
    }, 120);
  }

  applyDrift(deltaSeconds: number) {
    const driftSpeed = Number(this.profile.signalDriftSpeed ?? 0);
    if (driftSpeed <= 0) return;
    for (const channel of this.channels) {
      channel.value = clampFrequency(channel.value + channel.driftDirection * driftSpeed * deltaSeconds);
      if (channel.value <= 0 || channel.value >= 100) channel.driftDirection *= -1;
    }
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
      type: "signal-alignment",
      result,
      message,
      rollTotal: this.rollTotal,
      dc: this.dc,
      profile: this.profile,
      mistakes: this.state.mistakes,
      tracePenaltySeconds: this.state.tracePenaltySeconds,
      traceProgress: this.state.traceProgress,
      lockProgress: this.state.lockProgress,
      channels: this.channels.map((channel) => ({ ...channel }))
    };

    if (this.chatOnResult) {
      await postHackResultMessage({
        title: "Signal Alignment",
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
    const lock = element.querySelector("[data-lock-fill]");
    const lockText = element.querySelector("[data-lock-text]");
    if (trace) trace.style.width = `${this.state.traceProgress}%`;
    if (traceText) traceText.textContent = `${Math.round(this.state.traceProgress)}%`;
    if (mistakeText) mistakeText.textContent = `${this.state.tracePenaltySeconds.toFixed(0)}s`;
    if (lock) lock.style.width = `${Math.round(this.state.lockProgress * 100)}%`;
    if (lockText) lockText.textContent = `${Math.round(this.state.lockProgress * 100)}%`;

    for (const channel of this.channels) {
      const row = element.querySelector(`[data-channel-row="${channel.id}"]`);
      if (!row) continue;
      const aligned = Math.abs(channel.value - channel.target) <= channel.tolerance;
      const targetVisible = this.isTargetVisible(channel);
      row.classList.toggle("is-aligned", aligned);
      row.classList.toggle("is-target-visible", targetVisible);
      row.querySelector("[data-channel-value]").textContent = channel.value.toFixed(1);
      row.querySelector("[data-channel-target]").textContent = targetVisible ? String(channel.target) : "??";
      row.querySelector("[data-channel-delta]").textContent = targetVisible ? Math.abs(channel.value - channel.target).toFixed(1) : "--";
      row.querySelector("[data-channel-state]").textContent = aligned ? "locked" : targetVisible ? "signal found" : "searching";
      const slider = row.querySelector("[data-channel-slider]");
      if (slider && document.activeElement !== slider) slider.value = channel.value;
      const wave = row.querySelector("[data-wave-fill]");
      if (wave) {
        wave.style.width = `${channel.value}%`;
        wave.style.setProperty("--wave-duration", `${Math.max(1.2, 3.2 - (Number(this.profile.noiseLevel ?? 0) * 2))}s`);
      }
    }
  }
}
