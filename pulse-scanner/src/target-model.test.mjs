import assert from "node:assert/strict";
import test from "node:test";

const model = await import("../../.tmp-tests/pulse-scanner/src/target-model.js");

test("normalizeTarget applies defaults, ids, metadata, and numeric coercion", () => {
  const target = model.normalizeTarget({
    type: "tech",
    x: "120",
    y: "240",
    radius: "-20",
    integrity: "140",
    difficulty: "12",
    color: "#ABCDEF"
  }, {
    createId: () => "target-1",
    sceneId: "scene-1"
  });

  assert.equal(target.id, "target-1");
  assert.equal(target.sceneId, "scene-1");
  assert.equal(target.type, "tech");
  assert.equal(target.mode, "tech");
  assert.equal(target.x, 120);
  assert.equal(target.y, 240);
  assert.equal(target.radius, 0);
  assert.equal(target.integrity, 100);
  assert.equal(target.difficulty, 12);
  assert.equal(target.color, "#abcdef");
  assert.equal(target.regionId, "");
});

test("normalizeTarget preserves regionId when provided", () => {
  const target = model.normalizeTarget({
    regionId: "region-abc",
    type: "hidden"
  });
  assert.equal(target.regionId, "region-abc");
});

test("normalize filters ignore unsupported values", () => {
  assert.deepEqual([...model.normalizeTypeFilter(["tech", "bad", "trap"])], ["tech", "trap"]);
  assert.deepEqual([...model.normalizeModeFilter(["thermal", "bad"])], ["thermal"]);
  assert.equal(model.normalizeTypeFilter(["bad"]), null);
  assert.equal(model.normalizeModeFilter([]), null);
});

test("targetMatchesScan respects status, filters, distance, and target radius", () => {
  const target = model.normalizeTarget({
    id: "target",
    x: 100,
    y: 0,
    radius: 25,
    type: "trap"
  });

  assert.equal(model.targetMatchesScan(target, { x: 0, y: 0 }, 75), true);
  assert.equal(model.targetMatchesScan(target, { x: 0, y: 0 }, 50), false);
  assert.equal(model.targetMatchesScan(target, { x: 0, y: 0 }, 75, new Set(["tech"])), false);
  assert.equal(model.targetMatchesScan({ ...target, status: "resolved" }, { x: 0, y: 0 }, 200), false);
});

test("getTargetScanRadius returns radius directly", () => {
  assert.equal(model.getTargetScanRadius({ radius: 42 }), 42);
  assert.equal(model.getTargetScanRadius({ radius: 0 }), 0);
});

test("sanitizeTargetForPulse masks GM-only non-breakable details for players", () => {
  const target = model.normalizeTarget({
    id: "secret",
    type: "tech",
    label: "Hidden Server",
    description: "GM detail",
    visibility: "gm",
    integrity: 44,
    difficulty: 15
  });
  const clean = model.sanitizeTargetForPulse(target, true);

  assert.equal(clean.label, "Tech Signature");
  assert.equal(clean.description, "");
  assert.equal(clean.integrity, null);
  assert.equal(clean.difficulty, null);
});

test("targetVisibleToPlayer only allows revealed or always targets", () => {
  assert.equal(model.targetVisibleToPlayer({ visibility: "gm" }), false);
  assert.equal(model.targetVisibleToPlayer({ visibility: "revealed" }), true);
  assert.equal(model.targetVisibleToPlayer({ visibility: "always" }), true);
});
