import assert from "node:assert/strict";
import test from "node:test";

const crop = await import("../../.tmp-tests/security-cameras/frame-crop.js");

const camera = {
  id: "cam",
  name: "Camera",
  sceneId: "scene",
  location: "Deck",
  image: "",
  feedSource: "live",
  status: "online",
  displayMode: "window",
  regionId: "",
  regionX: 100,
  regionY: 50,
  regionWidth: 300,
  regionHeight: 150,
  notes: ""
};

test("getCameraCrop returns full source when no region exists", () => {
  assert.deepEqual(crop.getCameraCrop(
    { width: 1920, height: 1080 },
    { ...camera, regionX: null, regionY: null },
    { width: 4000, height: 2000 }
  ), {
    sx: 0,
    sy: 0,
    sw: 1920,
    sh: 1080
  });
});

test("getCameraCrop scales scene coordinates to source canvas", () => {
  assert.deepEqual(crop.getCameraCrop(
    { width: 2000, height: 1000 },
    camera,
    { width: 1000, height: 500 }
  ), {
    sx: 200,
    sy: 100,
    sw: 600,
    sh: 300
  });
});

test("getCameraCrop can use an injected transform fallback", () => {
  assert.deepEqual(crop.getCameraCrop(
    { width: 800, height: 600 },
    camera,
    { width: 4000, height: 3000 },
    () => ({ sx: 11, sy: 12, sw: 300, sh: 150 })
  ), {
    sx: 11,
    sy: 12,
    sw: 300,
    sh: 150
  });
});

test("clampCrop keeps crop inside source dimensions", () => {
  assert.deepEqual(crop.clampCrop(
    { sx: -10, sy: 98.7, sw: 300, sh: 100 },
    { width: 200, height: 100 }
  ), {
    sx: 0,
    sy: 99,
    sw: 200,
    sh: 1
  });
});

test("getCropForSceneImage scales scene dimensions including offsets", () => {
  assert.deepEqual(crop.getCropForSceneImage(
    { width: 2000, height: 1000 },
    camera,
    { x: 50, y: 25, width: 1000, height: 500 }
  ), {
    sx: 100,
    sy: 50,
    sw: 600,
    sh: 300
  });
});

test("getScaledOutputSize keeps small crops native and scales large crops down", () => {
  assert.deepEqual(crop.getScaledOutputSize({ sx: 0, sy: 0, sw: 300, sh: 150 }, 960), {
    width: 300,
    height: 150
  });
  assert.deepEqual(crop.getScaledOutputSize({ sx: 0, sy: 0, sw: 1920, sh: 1080 }, 960), {
    width: 960,
    height: 540
  });
});
