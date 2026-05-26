import assert from "node:assert/strict";
import test from "node:test";

const geometry = await import("../../.tmp-tests/pulse-scanner/src/scan-geometry.js");

test("getTargetScanRadius returns circle radius or rectangle half diagonal", () => {
  assert.equal(geometry.getTargetScanRadius({
    shape: "circle",
    radius: 42,
    width: 100,
    height: 100
  }), 42);
  assert.equal(geometry.getTargetScanRadius({
    shape: "rectangle",
    radius: 10,
    width: 300,
    height: 400
  }), 250);
});

test("circleIntersectsCircle detects pulse overlap", () => {
  assert.equal(geometry.circleIntersectsCircle({ x: 0, y: 0 }, 50, { x: 75, y: 0 }, 25), true);
  assert.equal(geometry.circleIntersectsCircle({ x: 0, y: 0 }, 49, { x: 75, y: 0 }, 25), false);
});

test("circleIntersectsRectangle uses closest point to rectangle, not bounding circle", () => {
  const rectangle = {
    x: 100,
    y: 100,
    shape: "rectangle",
    width: 40,
    height: 40,
    radius: 0
  };

  assert.equal(geometry.circleIntersectsRectangle({ x: 70, y: 100 }, 10, rectangle), true);
  assert.equal(geometry.circleIntersectsRectangle({ x: 68, y: 68 }, 15, rectangle), false);
});

test("targetMatchesScan respects resolved state and filters", () => {
  const target = {
    x: 100,
    y: 0,
    radius: 25,
    shape: "circle",
    width: 160,
    height: 160,
    status: "active",
    type: "trap",
    mode: "thermal"
  };

  assert.equal(geometry.targetMatchesScan(target, { x: 0, y: 0 }, 75), true);
  assert.equal(geometry.targetMatchesScan(target, { x: 0, y: 0 }, 75, new Set(["tech"])), false);
  assert.equal(geometry.targetMatchesScan({ ...target, status: "resolved" }, { x: 0, y: 0 }, 200), false);
});
