import {
  MAX_REPORTS,
  MAX_SAMPLES_PER_METRIC,
  MAX_TIMELINE_EVENTS,
  MODULE_ID
} from "./constants";
import { captureSource, sourceFromUrl } from "./attribution";
import { setMetricSink, type MetricSink } from "./instrumentation";
import type {
  CaptureOptions,
  CaptureReport,
  DomActivity,
  EnvironmentSnapshot,
  LiveCaptureState,
  LongTaskRecord,
  MetricAggregate,
  MetricKind,
  ModuleSnapshot,
  ResourceRecord,
  StylesheetSnapshot,
  TimelineEvent
} from "./types";

interface InternalMetric extends Omit<MetricAggregate, "p50Ms" | "p95Ms"> {
  samples: number[];
}

interface ActiveCapture extends LiveCaptureState {
  environmentStart: EnvironmentSnapshot;
  modules: ModuleSnapshot[];
  stylesheets: StylesheetSnapshot[];
  metrics: Map<string, InternalMetric>;
  timeline: TimelineEvent[];
  longTasks: LongTaskRecord[];
  resources: ResourceRecord[];
  dom: DomActivity;
  droppedTimelineEvents: number;
  observers: Array<{ disconnect(): void }>;
  restoreDeep: Array<() => void>;
}

function round(value: number, digits = 3): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function percentile(values: number[], fraction: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * fraction) - 1));
  return sorted[index];
}

function makeId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function safeResourceName(value: string): string {
  try {
    const url = new URL(value, window.location.href);
    if (["http:", "https:"].includes(url.protocol)) return url.pathname;
    return `${url.protocol}${url.pathname}`;
  } catch {
    return String(value).split(/[?#]/, 1)[0];
  }
}

function snapshotModules(): ModuleSnapshot[] {
  const modules = (globalThis as any).game?.modules;
  if (!modules?.values) return [];
  return [...modules.values()]
    .filter((entry: any) => entry?.active)
    .map((entry: any) => ({
      id: String(entry.id ?? "unknown"),
      title: String(entry.title ?? entry.id ?? "Unknown"),
      version: String(entry.version ?? entry?.manifest?.version ?? "unknown")
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function snapshotStylesheets(): StylesheetSnapshot[] {
  return [...document.styleSheets].map((sheet: CSSStyleSheet) => {
    const href = String(sheet.href ?? "");
    let ruleCount: number | null = null;
    try {
      ruleCount = sheet.cssRules?.length ?? 0;
    } catch {
      ruleCount = null;
    }
    return {
      source: sourceFromUrl(href),
      href: safeResourceName(href),
      ruleCount,
      disabled: Boolean(sheet.disabled)
    };
  });
}

function snapshotEnvironment(): EnvironmentSnapshot {
  const currentGame = (globalThis as any).game;
  const system = currentGame?.system;
  const scene = (globalThis as any).canvas?.scene ?? currentGame?.scenes?.current;
  const deviceMemory = Number((navigator as any).deviceMemory);
  return {
    capturedAt: new Date().toISOString(),
    foundryVersion: String(currentGame?.version ?? currentGame?.release?.version ?? "unknown"),
    systemId: String(system?.id ?? "unknown"),
    systemVersion: String(system?.version ?? "unknown"),
    worldId: String(currentGame?.world?.id ?? "unknown"),
    sceneId: String(scene?.id ?? "none"),
    sceneName: String(scene?.name ?? "No active scene"),
    userRole: currentGame?.user?.role ?? "unknown",
    browser: navigator.userAgent,
    hardwareConcurrency: Number.isFinite(navigator.hardwareConcurrency) ? navigator.hardwareConcurrency : null,
    deviceMemoryGb: Number.isFinite(deviceMemory) ? deviceMemory : null,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    devicePixelRatio: window.devicePixelRatio,
    domNodes: document.getElementsByTagName("*").length,
    openWindows: document.querySelectorAll(".app, .application").length
  };
}

export class PerformanceProfiler implements MetricSink {
  private active: ActiveCapture | null = null;
  private reports: CaptureReport[] = [];

  get captureId(): string {
    return this.active?.id ?? "inactive";
  }

  get liveState(): LiveCaptureState | null {
    if (!this.active) return null;
    const { id, label, deepMode, startedAt, startedAtPerformance } = this.active;
    return { id, label, deepMode, startedAt, startedAtPerformance };
  }

  get history(): readonly CaptureReport[] {
    return this.reports;
  }

  get latest(): CaptureReport | null {
    return this.reports[0] ?? null;
  }

  start(options: CaptureOptions = {}): LiveCaptureState {
    if (this.active) throw new Error("A performance capture is already running.");
    const startedAtPerformance = performance.now();
    const capture: ActiveCapture = {
      id: makeId(),
      label: String(options.label ?? "").trim() || `Capture ${this.reports.length + 1}`,
      deepMode: options.deepMode === true,
      startedAt: new Date().toISOString(),
      startedAtPerformance,
      environmentStart: snapshotEnvironment(),
      modules: snapshotModules(),
      stylesheets: snapshotStylesheets(),
      metrics: new Map(),
      timeline: [],
      longTasks: [],
      resources: [],
      dom: { batches: 0, records: 0, addedNodes: 0, removedNodes: 0, attributeChanges: 0 },
      droppedTimelineEvents: 0,
      observers: [],
      restoreDeep: []
    };
    this.active = capture;
    setMetricSink(this);
    this.installPerformanceObservers(capture);
    if (capture.deepMode) this.installDeepInstrumentation(capture);
    this.mark("Capture started");
    return this.liveState!;
  }

  stop(): CaptureReport {
    const capture = this.active;
    if (!capture) throw new Error("No performance capture is running.");
    this.mark("Capture stopped");
    const durationMs = performance.now() - capture.startedAtPerformance;
    for (const observer of capture.observers) observer.disconnect();
    for (const restore of capture.restoreDeep.reverse()) {
      try {
        restore();
      } catch (error) {
        console.warn(`${MODULE_ID} | Could not restore an instrumented browser API.`, error);
      }
    }
    setMetricSink(null);
    this.active = null;

    const metrics = [...capture.metrics.values()]
      .map<MetricAggregate>((metric) => ({
        key: metric.key,
        kind: metric.kind,
        source: metric.source,
        label: metric.label,
        calls: metric.calls,
        syncTotalMs: round(metric.syncTotalMs),
        asyncCompletions: metric.asyncCompletions,
        asyncWallTotalMs: round(metric.asyncWallTotalMs),
        maxMs: round(metric.maxMs),
        p50Ms: round(percentile(metric.samples, 0.5)),
        p95Ms: round(percentile(metric.samples, 0.95)),
        errors: metric.errors
      }))
      .sort((a, b) => b.syncTotalMs - a.syncTotalMs);

    const report: CaptureReport = {
      schemaVersion: 1,
      id: capture.id,
      label: capture.label,
      deepMode: capture.deepMode,
      startedAt: capture.startedAt,
      durationMs: round(durationMs),
      environmentStart: capture.environmentStart,
      environmentEnd: snapshotEnvironment(),
      modules: capture.modules,
      stylesheets: capture.stylesheets,
      metrics,
      timeline: capture.timeline,
      longTasks: capture.longTasks,
      resources: capture.resources,
      dom: capture.dom,
      droppedTimelineEvents: capture.droppedTimelineEvents,
      notes: [
        "Times are measurements from this browser client only; GM and player clients must be captured separately.",
        "Async wall time can overlap other work and must not be added to synchronous CPU time.",
        "Style recalculation, layout, GPU work, garbage collection, and uninstrumented callbacks remain unattributed.",
        "Deep mode adds more observer overhead and should be used after a normal capture identifies a suspicious interval."
      ]
    };
    this.reports.unshift(report);
    if (this.reports.length > MAX_REPORTS) this.reports.length = MAX_REPORTS;
    return report;
  }

  clear(): void {
    if (this.active) throw new Error("Stop the current capture before clearing reports.");
    this.reports = [];
  }

  mark(label: string): void {
    const capture = this.active;
    if (!capture) return;
    this.pushTimeline(capture, {
      offsetMs: round(performance.now() - capture.startedAtPerformance),
      durationMs: 0,
      kind: "marker",
      source: MODULE_ID,
      label: String(label || "Marker")
    });
  }

  record(kind: MetricKind, source: string, label: string, durationMs: number, error = false): void {
    const capture = this.active;
    if (!capture || source === MODULE_ID) return;
    const safeDuration = Math.max(0, Number(durationMs) || 0);
    const key = `${kind}\u0000${source}\u0000${label}`;
    let metric = capture.metrics.get(key);
    if (!metric) {
      metric = {
        key,
        kind,
        source,
        label,
        calls: 0,
        syncTotalMs: 0,
        asyncCompletions: 0,
        asyncWallTotalMs: 0,
        maxMs: 0,
        errors: 0,
        samples: []
      };
      capture.metrics.set(key, metric);
    }
    metric.calls += 1;
    metric.syncTotalMs += safeDuration;
    metric.maxMs = Math.max(metric.maxMs, safeDuration);
    if (error) metric.errors += 1;
    if (metric.samples.length < MAX_SAMPLES_PER_METRIC) metric.samples.push(safeDuration);
    else metric.samples[metric.calls % MAX_SAMPLES_PER_METRIC] = safeDuration;

    if (safeDuration >= 0.25 || error) {
      this.pushTimeline(capture, {
        offsetMs: round(performance.now() - capture.startedAtPerformance - safeDuration),
        durationMs: round(safeDuration),
        kind,
        source,
        label,
        error
      });
    }
  }

  recordAsync(kind: MetricKind, source: string, label: string, wallDurationMs: number, captureId: string): void {
    const capture = this.active;
    if (!capture || capture.id !== captureId || source === MODULE_ID) return;
    const key = `${kind}\u0000${source}\u0000${label}`;
    const metric = capture.metrics.get(key);
    if (!metric) return;
    metric.asyncCompletions += 1;
    metric.asyncWallTotalMs += Math.max(0, Number(wallDurationMs) || 0);
  }

  private pushTimeline(capture: ActiveCapture, event: TimelineEvent): void {
    if (capture.timeline.length >= MAX_TIMELINE_EVENTS) {
      capture.droppedTimelineEvents += 1;
      return;
    }
    capture.timeline.push(event);
  }

  private installPerformanceObservers(capture: ActiveCapture): void {
    if (typeof PerformanceObserver === "function") {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          if (this.active?.id !== capture.id) return;
          for (const entry of list.getEntries()) {
            const record = {
              offsetMs: round(entry.startTime - capture.startedAtPerformance),
              durationMs: round(entry.duration),
              name: entry.name || "long task"
            };
            capture.longTasks.push(record);
            this.pushTimeline(capture, {
              ...record,
              kind: "long-task",
              source: "browser/unattributed",
              label: record.name
            });
          }
        });
        longTaskObserver.observe({ type: "longtask", buffered: false } as PerformanceObserverInit);
        capture.observers.push(longTaskObserver);
      } catch {
        // Long Task API is not available in every browser build.
      }

      try {
        const resourceObserver = new PerformanceObserver((list) => {
          if (this.active?.id !== capture.id) return;
          for (const raw of list.getEntries()) {
            const entry = raw as PerformanceResourceTiming;
            capture.resources.push({
              offsetMs: round(entry.startTime - capture.startedAtPerformance),
              durationMs: round(entry.duration),
              source: sourceFromUrl(entry.name),
              initiatorType: entry.initiatorType || "unknown",
              name: safeResourceName(entry.name)
            });
          }
        });
        resourceObserver.observe({ type: "resource", buffered: false } as PerformanceObserverInit);
        capture.observers.push(resourceObserver);
      } catch {
        // Resource timing can be unavailable or disabled.
      }
    }

    if (capture.deepMode && document.documentElement) {
      const mutationObserver = new MutationObserver((records) => {
        if (this.active?.id !== capture.id) return;
        capture.dom.batches += 1;
        capture.dom.records += records.length;
        for (const record of records) {
          if (record.type === "attributes") capture.dom.attributeChanges += 1;
          capture.dom.addedNodes += record.addedNodes?.length ?? 0;
          capture.dom.removedNodes += record.removedNodes?.length ?? 0;
        }
      });
      mutationObserver.observe(document.documentElement, { subtree: true, childList: true, attributes: true });
      capture.observers.push(mutationObserver);
    }
  }

  private installDeepInstrumentation(capture: ActiveCapture): void {
    const target = globalThis as any;
    const originalSetTimeout = target.setTimeout;
    const originalSetInterval = target.setInterval;
    const originalRequestAnimationFrame = target.requestAnimationFrame;

    const wrapScheduled = (kind: MetricKind, callback: Function, source: string, label: string) => {
      return function (this: unknown, ...args: unknown[]) {
        if (thisProfiler.active?.id !== capture.id) return callback.apply(this, args);
        const started = performance.now();
        let failed = false;
        try {
          return callback.apply(this, args);
        } catch (error) {
          failed = true;
          throw error;
        } finally {
          if (thisProfiler.active?.id === capture.id) {
            thisProfiler.record(kind, source, label, performance.now() - started, failed);
          }
        }
      };
    };
    const thisProfiler = this;

    const wrappedSetTimeout = function (this: unknown, callback: TimerHandler, delay?: number, ...args: unknown[]) {
      if (typeof callback !== "function") return originalSetTimeout.call(this, callback, delay, ...args);
      const source = captureSource();
      return originalSetTimeout.call(this, wrapScheduled("timeout", callback, source, `${Number(delay) || 0} ms`), delay, ...args);
    };
    const wrappedSetInterval = function (this: unknown, callback: TimerHandler, delay?: number, ...args: unknown[]) {
      if (typeof callback !== "function") return originalSetInterval.call(this, callback, delay, ...args);
      const source = captureSource();
      return originalSetInterval.call(this, wrapScheduled("interval", callback, source, `${Number(delay) || 0} ms`), delay, ...args);
    };
    target.setTimeout = wrappedSetTimeout;
    target.setInterval = wrappedSetInterval;
    let wrappedRequestAnimationFrame: Function | null = null;
    if (typeof originalRequestAnimationFrame === "function") {
      wrappedRequestAnimationFrame = function (this: unknown, callback: FrameRequestCallback) {
        const source = captureSource();
        return originalRequestAnimationFrame.call(this, wrapScheduled("animation-frame", callback, source, "requestAnimationFrame"));
      };
      target.requestAnimationFrame = wrappedRequestAnimationFrame;
    }
    capture.restoreDeep.push(() => {
      if (target.setTimeout === wrappedSetTimeout) target.setTimeout = originalSetTimeout;
      if (target.setInterval === wrappedSetInterval) target.setInterval = originalSetInterval;
      if (wrappedRequestAnimationFrame && target.requestAnimationFrame === wrappedRequestAnimationFrame) {
        target.requestAnimationFrame = originalRequestAnimationFrame;
      }
    });

    const socket = (globalThis as any).game?.socket;
    if (socket && typeof socket.emit === "function") {
      const originalEmit = socket.emit;
      const profiler = this;
      const wrappedEmit = function (this: unknown, eventName: string, ...args: unknown[]) {
        const source = captureSource();
        const label = String(eventName ?? "socket event");
        const started = performance.now();
        const captureId = profiler.captureId;
        const finalIndex = args.length - 1;
        if (finalIndex >= 0 && typeof args[finalIndex] === "function") {
          const acknowledgement = args[finalIndex] as Function;
          args[finalIndex] = function (this: unknown, ...ackArgs: unknown[]) {
            profiler.recordAsync("socket", source, label, performance.now() - started, captureId);
            return acknowledgement.apply(this, ackArgs);
          };
        }
        try {
          const result = originalEmit.call(this, eventName, ...args);
          profiler.record("socket", source, label, performance.now() - started, false);
          return result;
        } catch (error) {
          profiler.record("socket", source, label, performance.now() - started, true);
          throw error;
        }
      };
      socket.emit = wrappedEmit;
      capture.restoreDeep.push(() => {
        if (socket.emit === wrappedEmit) socket.emit = originalEmit;
      });
    }
  }
}

export const profiler = new PerformanceProfiler();
