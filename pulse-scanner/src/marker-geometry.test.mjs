import assert from "node:assert/strict";
import test from "node:test";

const marker = await import("../../.tmp-tests/pulse-scanner/src/marker-geometry.js");

test("getResizeHandlePositions returns eight rectangle handles around bounds", () => {
  assert.deepEqual(marker.getResizeHandlePositions({
    shape: "rectangle",
    width: 200,
    height: 100,
    radius: 80,
    x: 0,
    y: 0
  }), [
    { handle: "nw", x: -100, y: -50 },
    { handle: "n", x: 0, y: -50 },
    { handle: "ne", x: 100, y: -50 },
    { handle: "e", x: 100, y: 0 },
    { handle: "se", x: 100, y: 50 },
    { handle: "s", x: 0, y: 50 },
    { handle: "sw", x: -100, y: 50 },
    { handle: "w", x: -100, y: 0 }
  ]);
});

test("getResizeHandlePositions returns four circle radius handles", () => {
  assert.deepEqual(marker.getResizeHandlePositions({
    shape: "circle",
    width: 160,
    height: 160,
    radius: 50,
    x: 0,
    y: 0
  }), [
    { handle: "radius-e", x: 50, y: 0 },
    { handle: "radius-s", x: 0, y: 50 },
    { handle: "radius-w", x: -50, y: 0 },
    { handle: "radius-n", x: 0, y: -50 }
  ]);
});

test("getResizeCursor maps handles to CSS cursors", () => {
  assert.equal(marker.getResizeCursor("radius-e"), "move");
  assert.equal(marker.getResizeCursor("n"), "ns-resize");
  assert.equal(marker.getResizeCursor("e"), "ew-resize");
  assert.equal(marker.getResizeCursor("nw"), "nwse-resize");
  assert.equal(marker.getResizeCursor("ne"), "nesw-resize");
});

test("getResizeUpdates calculates rectangle dimensions from handle deltas", () => {
  assert.deepEqual(marker.getResizeUpdates({
    shape: "rectangle",
    x: 100,
    y: 100,
    width: 160,
    height: 160,
    radius: 80
  }, "se", {
    x: 175,
    y: 130
  }), {
    width: 150,
    height: 60
  });
});

test("getResizeUpdates calculates circle radius from pointer distance", () => {
  assert.deepEqual(marker.getResizeUpdates({
    shape: "circle",
    x: 100,
    y: 100,
    width: 160,
    height: 160,
    radius: 80
  }, "radius-e", {
    x: 130,
    y: 140
  }), {
    radius: 50
  });
});

test("isPointNearTarget uses clamped scan radius threshold", () => {
  const target = {
    shape: "circle",
    x: 100,
    y: 100,
    width: 160,
    height: 160,
    radius: 500
  };

  assert.equal(marker.isPointNearTarget({ x: 175, y: 100 }, target), true);
  assert.equal(marker.isPointNearTarget({ x: 181, y: 100 }, target), false);
});
