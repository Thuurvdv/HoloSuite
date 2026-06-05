import assert from "node:assert/strict";
import test from "node:test";

const model = await import("../../.tmp-tests/camera-model.js");

test("normalizeCamera fills defaults and generates ids", () => {
  const camera = model.normalizeCamera({
    name: "  Dock 17  ",
    feedSource: "live",
    status: "corrupted",
    displayMode: "picture-in-picture",
    regionWidth: "640",
    regionHeight: "360"
  }, {
    createId: () => "camera-1"
  });

  assert.equal(camera.id, "camera-1");
  assert.equal(camera.name, "Dock 17");
  assert.equal(camera.feedSource, "live");
  assert.equal(camera.status, "corrupted");
  assert.equal(camera.displayMode, "picture-in-picture");
  assert.equal(camera.regionWidth, 640);
  assert.equal(camera.regionHeight, 360);
});

test("normalizeCamera preserves blank ids for drafts", () => {
  const camera = model.normalizeCamera({
    id: "",
    name: "",
    feedSource: "unknown",
    status: "bad",
    displayMode: "bad"
  }, {
    preserveId: true,
    createId: () => "should-not-use"
  });

  assert.equal(camera.id, "");
  assert.equal(camera.name, model.DEFAULT_CAMERA.name);
  assert.equal(camera.feedSource, model.DEFAULT_CAMERA.feedSource);
  assert.equal(camera.status, model.DEFAULT_CAMERA.status);
  assert.equal(camera.displayMode, model.DEFAULT_CAMERA.displayMode);
});

test("validateCameraData reports invalid choices", () => {
  const result = model.validateCameraData({
    id: "",
    name: "   ",
    feedSource: "network",
    status: "jammed",
    displayMode: "wall"
  }, {
    requireId: true
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, [
    "Camera id is required.",
    "Camera name is required.",
    "Invalid feed source: network",
    "Invalid status: jammed",
    "Invalid display mode: wall"
  ]);
});
