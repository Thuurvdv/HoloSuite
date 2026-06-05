import assert from "node:assert/strict";
import test from "node:test";

const projection = await import("../../.tmp-tests/token-projection.js");

test("getTokenSceneBounds converts token grid units to scene pixels", () => {
  assert.deepEqual(projection.getTokenSceneBounds({
    x: "120",
    y: "240",
    width: "2",
    height: "1.5"
  }, 100), {
    x: 120,
    y: 240,
    width: 200,
    height: 150
  });
});

test("getTokenSceneBounds rejects missing coordinates", () => {
  assert.equal(projection.getTokenSceneBounds({ width: 1, height: 1 }, 100), null);
});

test("getTokenSceneBounds reads Foundry document wrappers", () => {
  assert.deepEqual(projection.getTokenSceneBounds({
    toObject: () => ({ x: 25, y: 50, width: 1, height: 2 })
  }, 100), {
    x: 25,
    y: 50,
    width: 100,
    height: 200
  });
});

test("getTokenSceneBounds reads raw source data", () => {
  assert.deepEqual(projection.getTokenSceneBounds({
    _source: { x: 75, y: 100, width: 0.5, height: 1 }
  }, 100), {
    x: 75,
    y: 100,
    width: 50,
    height: 100
  });
});

test("intersectsBounds detects overlap without treating touching edges as overlap", () => {
  const region = { x: 100, y: 100, width: 200, height: 100 };
  assert.equal(projection.intersectsBounds({ x: 150, y: 120, width: 20, height: 20 }, region), true);
  assert.equal(projection.intersectsBounds({ x: 300, y: 120, width: 20, height: 20 }, region), false);
  assert.equal(projection.intersectsBounds({ x: 50, y: 50, width: 10, height: 10 }, region), false);
});

test("projectBoundsToFrame maps scene-space bounds into frame-space draw rects", () => {
  assert.deepEqual(projection.projectBoundsToFrame(
    { x: 150, y: 125, width: 50, height: 25 },
    { x: 100, y: 100, width: 200, height: 100 },
    { width: 800, height: 400 }
  ), {
    dx: 200,
    dy: 100,
    dw: 200,
    dh: 100
  });
});
