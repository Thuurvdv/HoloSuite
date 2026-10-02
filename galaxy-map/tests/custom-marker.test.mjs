import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSystem, normalizeSystemObject } from "../src/galaxy-model.ts";

test("custom marker paths are kept and trimmed on systems and entities", () => {
  assert.equal(normalizeSystem({ id: "sol", markerImage: " icons/sol.webp " }).markerImage, "icons/sol.webp");
  assert.equal(normalizeSystemObject({ id: "earth", markerImage: " icons/earth.png " }).markerImage, "icons/earth.png");
});
