import { MODULE_ID } from "./constants.js";
import { captureSource } from "./attribution.js";
import type { MetricKind } from "./types.js";

export interface MetricSink {
  readonly captureId: string;
  record(kind: MetricKind, source: string, label: string, durationMs: number, error?: boolean): void;
  recordAsync(kind: MetricKind, source: string, label: string, wallDurationMs: number, captureId: string): void;
}

let activeSink: MetricSink | null = null;

interface MutableSource {
  value: string;
}

interface PreexistingRegistration {
  callback: Function;
  source: MutableSource;
}

export interface AttributionResolution {
  total: number;
  resolved: number;
  ambiguous: number;
  unresolved: number;
  scriptsScanned: number;
}

const preexistingRegistrations: PreexistingRegistration[] = [];
let attributionResolution: Promise<AttributionResolution> | null = null;

export function setMetricSink(sink: MetricSink | null): void {
  activeSink = sink;
}

const INSTRUMENTED = Symbol.for(`${MODULE_ID}.hook-instrumented`);
const PATCHED = Symbol.for(`${MODULE_ID}.hooks-patched`);
const wrappedCallbacks = new WeakMap<Function, Map<string, Function[]>>();

function rememberWrapper(hook: string, original: Function, wrapped: Function): void {
  let hooks = wrappedCallbacks.get(original);
  if (!hooks) {
    hooks = new Map();
    wrappedCallbacks.set(original, hooks);
  }
  const entries = hooks.get(hook) ?? [];
  entries.push(wrapped);
  hooks.set(hook, entries);
}

function instrumentCallback(hook: string, callback: Function, source: string | MutableSource): Function {
  if ((callback as any)[INSTRUMENTED]) return callback;

  const wrapped = function (this: unknown, ...args: unknown[]) {
    const sink = activeSink;
    const owner = typeof source === "string" ? source : source.value;
    if (!sink || owner === MODULE_ID) return callback.apply(this, args);

    const started = performance.now();
    let result: any;
    try {
      result = callback.apply(this, args);
    } catch (error) {
      sink.record("hook", owner, hook, performance.now() - started, true);
      throw error;
    }

    sink.record("hook", owner, hook, performance.now() - started, false);
    return result;
  };

  Object.defineProperty(wrapped, INSTRUMENTED, { value: true });
  rememberWrapper(hook, callback, wrapped);
  return wrapped;
}

function instrumentExistingHooks(hooksApi: any): number {
  const events = hooksApi?.events;
  const entries: Array<[string, any]> = events instanceof Map
    ? [...events.entries()]
    : events && typeof events === "object"
      ? Object.entries(events)
      : [];
  let wrappedCount = 0;

  for (const [hook, registrations] of entries) {
    if (!Array.isArray(registrations)) continue;
    for (const registration of registrations) {
      if (!registration || typeof registration !== "object") continue;
      const property = typeof registration.fn === "function"
        ? "fn"
        : typeof registration.callback === "function"
          ? "callback"
          : null;
      if (!property) continue;
      const original = registration[property];
      if (original?.[INSTRUMENTED]) continue;
      try {
        const source = { value: "preexisting/unattributed" };
        registration[property] = instrumentCallback(hook, original, source);
        preexistingRegistrations.push({ callback: original, source });
        wrappedCount += 1;
      } catch {
        // Some Foundry builds or other modules may freeze registration records.
      }
    }
  }
  return wrappedCount;
}

function valuesOf(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (value instanceof Set) return [...value].map(String);
  if (value && typeof (value as any)[Symbol.iterator] === "function") return [...(value as Iterable<unknown>)].map(String);
  return [];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sourceNeedle(callback: Function): string | null {
  let source = "";
  try {
    source = Function.prototype.toString.call(callback);
  } catch {
    return null;
  }
  if (!source || source.includes("[native code]")) return null;
  const length = Math.min(120, source.length);
  if (length < 24) return null;
  const start = Math.max(0, Math.floor((source.length - length) / 2));
  return source.slice(start, start + length);
}

async function resolvePreexistingAttribution(): Promise<AttributionResolution> {
  const grouped = new Map<Function, { sources: MutableSource[]; needle: string | null; candidates: Set<string> }>();
  for (const registration of preexistingRegistrations) {
    const group = grouped.get(registration.callback) ?? {
      sources: [],
      needle: sourceNeedle(registration.callback),
      candidates: new Set<string>()
    };
    group.sources.push(registration.source);
    grouped.set(registration.callback, group);
  }

  const candidates = [...grouped.values()].filter((group) => group.needle);
  let scriptsScanned = 0;
  const modules = (globalThis as any).game?.modules;
  const activeModules = modules?.values ? [...modules.values()].filter((entry: any) => entry?.active) : [];

  for (const moduleEntry of activeModules) {
    const id = String((moduleEntry as any).id ?? "");
    if (!id || id === MODULE_ID) continue;
    const manifest = (moduleEntry as any).manifest ?? moduleEntry;
    const scriptPaths = [...new Set([
      ...valuesOf((moduleEntry as any).esmodules ?? manifest?.esmodules),
      ...valuesOf((moduleEntry as any).scripts ?? manifest?.scripts)
    ])];

    for (const path of scriptPaths) {
      let script = "";
      try {
        const response = await fetch(`modules/${id}/${path}`);
        if (!response.ok) continue;
        script = await response.text();
        scriptsScanned += 1;
      } catch {
        continue;
      }

      const needleMap = new Map<string, typeof candidates>();
      for (const candidate of candidates) {
        if (!candidate.needle) continue;
        const matches = needleMap.get(candidate.needle) ?? [];
        matches.push(candidate);
        needleMap.set(candidate.needle, matches);
      }
      const needles = [...needleMap.keys()];
      for (let index = 0; index < needles.length; index += 75) {
        const batch = needles.slice(index, index + 75);
        if (!batch.length) continue;
        const matcher = new RegExp(batch.map(escapeRegExp).join("|"), "g");
        for (const match of script.matchAll(matcher)) {
          for (const candidate of needleMap.get(match[0]) ?? []) candidate.candidates.add(id);
        }
      }
    }
  }

  let resolved = 0;
  let ambiguous = 0;
  for (const group of grouped.values()) {
    let source = "preexisting/unattributed";
    if (group.candidates.size === 1) {
      source = [...group.candidates][0];
      resolved += 1;
    } else if (group.candidates.size > 1) {
      source = `ambiguous:${[...group.candidates].sort().join("|")}`;
      ambiguous += 1;
    }
    for (const reference of group.sources) reference.value = source;
  }

  return {
    total: grouped.size,
    resolved,
    ambiguous,
    unresolved: grouped.size - resolved - ambiguous,
    scriptsScanned
  };
}

export function beginPreexistingAttribution(): Promise<AttributionResolution> {
  attributionResolution ??= resolvePreexistingAttribution();
  return attributionResolution;
}

export function installHookInstrumentation(): { installed: boolean; existingWrapped: number } {
  const hooksApi = (globalThis as any).Hooks;
  if (!hooksApi || typeof hooksApi.on !== "function") return { installed: false, existingWrapped: 0 };
  if (hooksApi[PATCHED]) return { installed: true, existingWrapped: 0 };

  const originalOn = hooksApi.on;
  const originalOnce = hooksApi.once;
  const originalOff = hooksApi.off;

  hooksApi.on = function (hook: string, callback: Function, ...rest: unknown[]) {
    if (typeof callback !== "function") return originalOn.call(this, hook, callback, ...rest);
    return originalOn.call(this, hook, instrumentCallback(hook, callback, captureSource()), ...rest);
  };

  if (typeof originalOnce === "function") {
    hooksApi.once = function (hook: string, callback: Function, ...rest: unknown[]) {
      if (typeof callback !== "function") return originalOnce.call(this, hook, callback, ...rest);
      return originalOnce.call(this, hook, instrumentCallback(hook, callback, captureSource()), ...rest);
    };
  }

  if (typeof originalOff === "function") {
    hooksApi.off = function (hook: string, callbackOrId: Function | number, ...rest: unknown[]) {
      if (typeof callbackOrId !== "function") return originalOff.call(this, hook, callbackOrId, ...rest);
      const wrappers = wrappedCallbacks.get(callbackOrId)?.get(hook);
      if (!wrappers?.length) return originalOff.call(this, hook, callbackOrId, ...rest);
      let result: unknown;
      for (const wrapper of wrappers.splice(0)) result = originalOff.call(this, hook, wrapper, ...rest);
      return result;
    };
  }

  Object.defineProperty(hooksApi, PATCHED, { value: true });
  return { installed: true, existingWrapped: instrumentExistingHooks(hooksApi) };
}
