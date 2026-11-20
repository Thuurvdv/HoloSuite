import assert from "node:assert/strict";
import test from "node:test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

const source = buildSync({ entryPoints: [fileURLToPath(new URL("./call-model.ts", import.meta.url))], bundle: true, write: false, format: "esm", platform: "node" }).outputFiles[0].text;
const { getSignalInterference } = await import(`data:text/javascript;base64,${Buffer.from(source + "\n//# sourceURL=signal-test.mjs").toString("base64")}`);

test("weaker signals increase portrait interference strength and frequency", () => {
  const strengths = [100, 80, 50, 15].map(getSignalInterference);
  assert.deepEqual(strengths.map((entry) => entry.signalQuality), ["clear", "weak", "poor", "critical"]);
  assert.equal(strengths[0].glitchShift, 0);
  for (let i = 1; i < strengths.length; i++) {
    assert.ok(strengths[i].glitchShift > strengths[i - 1].glitchShift);
    assert.ok(strengths[i].glitchInterval < strengths[i - 1].glitchInterval);
  }
  assert.deepEqual(getSignalInterference(-100), getSignalInterference(0));
  assert.deepEqual(getSignalInterference(1000), getSignalInterference(100));
});
