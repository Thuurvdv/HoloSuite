import { getDifficultyProfile } from "../../core/difficulty.js";
import { postHackResultMessage } from "../../core/chat.js";
import { clampFrequency, generateSignalChannels } from "./signal-alignment-generator.js";

const MODULE_ID = "holosuite-hacking";
const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/signal-alignment.html`;
const LegacyApplication = globalThis.Application ?? globalThis.foundry?.appv1?.api?.Application;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export class SignalAlignmentApp extends LegacyApplication {
  constructor(options = {}) {
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
      destabilizations: 0,
      isRunning: true,
      result: null
    };
    this.startedAt = performance.now();
    this.lastTickAt = this.startedAt;
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
      return {
        ...channel,
        valueLabel: channel.value.toFixed(1),
        deltaLabel: delta.toFixed(1),
        aligned,
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

  activateListeners(html) {
    super.activateListeners(html);
    html.find("[data-channel-slider]").on("input", (event) => this.handleSlider(event.currentTarget));
    html.find("[data-action='abort']").on("click", () => this.abort());
    html.find("[data-action='restart']").on("click", () => this.restart());
    this.syncDom();
  }

  async render(force, options) {
    const rendered = await super.render(force, options);
    if (this.state.isRunning) this.startTimer();
    return rendered;
  }

  async close(options = {}) {
    this.stopTimer();
    return super.close(options);
  }

  handleSlider(slider) {
    if (!this.state.isRunning) return;
    const channel = this.channels.find((candidate) => candidate.id === slider.dataset.channelSlider);
    if (!channel) return;
    channel.value = clampFrequency(slider.value);
    this.checkDestabilization();
    this.syncDom();
  }

  areAllChannelsAligned() {
    return this.channels.every((channel) => Math.abs(channel.value - channel.target) <= channel.tolerance);
  }

  checkDestabilization() {
    const aligned = this.areAllChannelsAligned();
    if (this.wasAligned && !aligned) {
      this.state.mistakes += 1;
      this.state.destabilizations += 1;
      ui.notifications?.warn?.(`Signal destabilized (${this.state.mistakes}/${this.profile.maxMistakes}).`);
      if (this.state.mistakes > this.profile.maxMistakes) this.finish("failure", "Signal destabilized too often");
    }
    this.wasAligned = aligned;
  }

  restart() {
    this.stopTimer();
    this.channels = generateSignalChannels(this.profile, `${this.seed}:${Date.now()}`);
    this.state = {
      traceProgress: 0,
      mistakes: 0,
      lockProgress: 0,
      destabilizations: 0,
      isRunning: true,
      result: null
    };
    this.resultMessage = null;
    this.startedAt = performance.now();
    this.lastTickAt = this.startedAt;
    this.wasAligned = false;
    this.render(false);
  }

  startTimer() {
    if (this.timer) return;
    const multiplier = Number(game.settings.get(MODULE_ID, "traceDurationMultiplier") ?? 1) || 1;
    const duration = Math.max(5, this.profile.traceDurationSeconds * multiplier);
    this.timer = window.setInterval(() => {
      if (!this.state.isRunning) return;
      const now = performance.now();
      const deltaSeconds = Math.min(0.5, (now - this.lastTickAt) / 1000);
      this.lastTickAt = now;

      this.applyDrift(deltaSeconds);
      const aligned = this.areAllChannelsAligned();
      this.state.lockProgress = aligned
        ? clamp(this.state.lockProgress + (deltaSeconds / this.profile.lockHoldSeconds), 0, 1)
        : 0;

      if (this.wasAligned && !aligned) {
        this.state.mistakes += 1;
        this.state.destabilizations += 1;
      }
      this.wasAligned = aligned;

      const elapsedSeconds = (now - this.startedAt) / 1000;
      this.state.traceProgress = clamp((elapsedSeconds / duration) * 100, 0, 100);
      this.syncDom();

      if (this.state.lockProgress >= 1) this.finish("success", "Transmission Decrypted");
      else if (this.state.traceProgress >= 100) this.finish("failure", "Trace Complete");
      else if (this.state.mistakes > this.profile.maxMistakes) this.finish("failure", "Signal destabilized too often");
    }, 120);
  }

  applyDrift(deltaSeconds) {
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

  async finish(result, message, { close = false } = {}) {
    if (!this.state.isRunning && this.state.result) return;
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
    if (mistakeText) mistakeText.textContent = `${this.state.mistakes}/${this.profile.maxMistakes}`;
    if (lock) lock.style.width = `${Math.round(this.state.lockProgress * 100)}%`;
    if (lockText) lockText.textContent = `${Math.round(this.state.lockProgress * 100)}%`;

    for (const channel of this.channels) {
      const row = element.querySelector(`[data-channel-row="${channel.id}"]`);
      if (!row) continue;
      const aligned = Math.abs(channel.value - channel.target) <= channel.tolerance;
      row.classList.toggle("is-aligned", aligned);
      row.querySelector("[data-channel-value]").textContent = channel.value.toFixed(1);
      row.querySelector("[data-channel-delta]").textContent = Math.abs(channel.value - channel.target).toFixed(1);
      const slider = row.querySelector("[data-channel-slider]");
      if (slider && document.activeElement !== slider) slider.value = channel.value;
      const wave = row.querySelector("[data-wave-fill]");
      if (wave) wave.style.width = `${channel.value}%`;
    }
  }
}
