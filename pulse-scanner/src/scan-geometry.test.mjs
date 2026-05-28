import assert from "node:assert/strict";
import test from "node:test";

const geometry = await import("../../.tmp-tests/pulse-scanner/src/scan-geometry.js");

test("getTargetScanRadius returns radius", () => {
  assert.equal(geometry.getTargetScanRadius({ radius: 42 }), 42);
  assert.equal(geometry.getTargetScanRadius({ radius: 0 }), 0);
});

test("circleIntersectsCircle detects pulse overlap", () => {
  assert.equal(geometry.circleIntersectsCircle({ x: 0, y: 0 }, 50, { x: 75, y: 0 }, 25), true);
  assert.equal(geometry.circleIntersectsCircle({ x: 0, y: 0 }, 49, { x: 75, y: 0 }, 25), false);
});

test("targetMatchesScan respects resolved state and filters", () => {
  const target = {
    x: 100,
    y: 0,
    radius: 25,
    status: "active",
    type: "trap",
    mode: "thermal"
  };

  assert.equal(geometry.targetMatchesScan(target, { x: 0, y: 0 }, 75), true);
  assert.equal(geometry.targetMatchesScan(target, { x: 0, y: 0 }, 75, new Set(["tech"])), false);
  assert.equal(geometry.targetMatchesScan({ ...target, status: "resolved" }, { x: 0, y: 0 }, 200), false);
});
