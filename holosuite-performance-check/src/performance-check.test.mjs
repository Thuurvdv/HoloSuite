import assert from "node:assert/strict";
import test from "node:test";

import { sourceFromStack, sourceFromUrl } from "../../.tmp-tests/performance-check/attribution.js";
import { reportsToCsv, reportToCsv, summarizeSources } from "../../.tmp-tests/performance-check/report.js";
import {
  beginPreexistingAttribution,
  installHookInstrumentation,
  setMetricSink
} from "../../.tmp-tests/performance-check/instrumentation.js";
import { addPerformanceControl } from "../../.tmp-tests/performance-check/scene-controls.js";

test("performance control supports v13 keyed controls", () => {
  const controls = { tokens: { name: "tokens", tools: {} } };
  const added = addPerformanceControl(controls, { name: "holosuite-performance-check", icon: "test" });
  assert.equal(added, true);
  assert.equal(controls.tokens.tools["holosuite-performance-check"].icon, "test");
  assert.equal(addPerformanceControl(controls, { name: "holosuite-performance-check" }), false);
});

test("stack attribution skips the profiler wrapper and finds the calling module", () => {
  const stack = [
    "Error",
    "at captureSource (http://localhost/modules/holosuite-performance-check/dist/main.js:1:10)",
    "at callback (http://localhost/modules/midi-qol/midi-qol.js:100:20)"
  ].join("\n");
  assert.equal(sourceFromStack(stack), "midi-qol");
});

test("stack attribution identifies profiler-owned callbacks and systems", () => {
  assert.equal(sourceFromStack("at open (http://localhost/modules/holosuite-performance-check/dist/main.js:1:1)"), "holosuite-performance-check");
  assert.equal(sourceFromStack("at prepare (http://localhost/systems/dnd5e/dnd5e.mjs:1:1)"), "system:dnd5e");
  assert.equal(sourceFromUrl("http://localhost/modules/Aura-Effects/main.js"), "aura-effects");
});

test("source summaries aggregate metrics without mixing sources", () => {
  const report = {
    metrics: [
      { source: "alpha", calls: 2, syncTotalMs: 5, maxMs: 3, asyncCompletions: 1, asyncWallTotalMs: 9, errors: 0 },
      { source: "alpha", calls: 1, syncTotalMs: 4, maxMs: 4, asyncCompletions: 0, asyncWallTotalMs: 0, errors: 1 },
      { source: "beta", calls: 8, syncTotalMs: 2, maxMs: 1, asyncCompletions: 0, asyncWallTotalMs: 0, errors: 0 }
    ]
  };
  const summaries = summarizeSources(report);
  assert.deepEqual(summaries[0], {
    source: "alpha",
    calls: 3,
    syncTotalMs: 9,
    maxMs: 4,
    asyncCompletions: 1,
    asyncWallTotalMs: 9,
    errors: 1
  });
  assert.equal(summaries[1].source, "beta");
});

test("CSV export quotes labels containing commas", () => {
  const report = {
    label: "Fireball, Core on",
    startedAt: "2026-08-14T00:00:00.000Z",
    durationMs: 123,
    deepMode: false,
    metrics: [{
      source: "midi-qol",
      kind: "hook",
      label: "updateActor",
      calls: 1,
      syncTotalMs: 2,
      maxMs: 2,
      p50Ms: 2,
      p95Ms: 2,
      asyncCompletions: 0,
      asyncWallTotalMs: 0,
      errors: 0
    }]
  };
  assert.match(reportToCsv(report), /"Fireball, Core on"/);
  const combined = reportsToCsv([report, { ...report, label: "Second" }]);
  assert.equal(combined.match(/capture,started_at/g)?.length, 1);
  assert.match(combined, /Second/);
});

test("preexisting hook callbacks are resolved against active module source", async () => {
  function uniquelyNamedPerformanceCheckCallback() {
    return "hspc-attribution-test-marker-8a6f4b";
  }

  globalThis.Hooks = {
    events: { sampleHook: [{ id: 1, fn: uniquelyNamedPerformanceCheckCallback, once: false }] },
    on(hook, fn) {
      this.events[hook] ??= [];
      this.events[hook].push({ id: 2, fn, once: false });
      return 2;
    },
    once(hook, fn) { return this.on(hook, fn); },
    off() {}
  };
  globalThis.game = {
    modules: new Map([["sample-module", {
      id: "sample-module",
      active: true,
      esmodules: ["dist/main.js"]
    }]])
  };
  globalThis.fetch = async () => ({
    ok: true,
    text: async () => `const registered = ${uniquelyNamedPerformanceCheckCallback.toString()};`
  });

  const installed = installHookInstrumentation();
  assert.equal(installed.existingWrapped, 1);
  const resolution = await beginPreexistingAttribution();
  assert.equal(resolution.resolved, 1);

  const observed = [];
  setMetricSink({
    captureId: "test",
    record: (_kind, source, label) => observed.push({ source, label }),
    recordAsync() {}
  });
  globalThis.Hooks.events.sampleHook[0].fn();
  setMetricSink(null);
  assert.deepEqual(observed, [{ source: "sample-module", label: "sampleHook" }]);
});
