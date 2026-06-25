import assert from "node:assert/strict";
import test from "node:test";

const geometry = await import("../../.tmp-tests/region-geometry.js");

test("getShapeBounds reads polygon point extents", () => {
  assert.deepEqual(geometry.getShapeBounds({
    points: [10, 20, 50, 25, 40, 80, 5, 60]
  }), {
    x: 5,
    y: 20,
    width: 45,
    height: 60
  });
});

test("getShapeBounds expands ellipse radius fields from center", () => {
  assert.deepEqual(geometry.getShapeBounds({
    x: "12",
    y: "18",
    radiusX: "100",
    radiusY: "40"
  }), {
    x: -88,
    y: -22,
    width: 200,
    height: 80
  });
});

test("getShapeBounds reads rectangle fields as top-left dimensions", () => {
  assert.deepEqual(geometry.getShapeBounds({
    x: "12",
    y: "18",
    width: "100",
    height: "40"
  }), {
    x: 12,
    y: 18,
    width: 100,
    height: 40
  });
});

test("combineBounds spans all valid bounds and ignores null entries", () => {
  assert.deepEqual(geometry.combineBounds([
    { x: 10, y: 10, width: 20, height: 20 },
    null,
    { x: -5, y: 30, width: 15, height: 10 }
  ]), {
    x: -5,
    y: 10,
    width: 35,
    height: 30
  });
});

test("getShapesRegionBounds converts combined shapes to camera region fields", () => {
  assert.deepEqual(geometry.getShapesRegionBounds([
    { x: 100, y: 200, width: 100, height: 50 },
    { points: [300, 300, 340, 300, 340, 360, 300, 360] }
  ]), {
    regionX: 100,
    regionY: 200,
    regionWidth: 240,
    regionHeight: 160
  });
});
