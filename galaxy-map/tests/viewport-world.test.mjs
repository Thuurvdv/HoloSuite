import test from "node:test";
import assert from "node:assert/strict";
import { normalizeSystem } from "../src/galaxy-model.ts";

globalThis.foundry = { utils: { randomID: () => "test-id" } };

test("a system background is saved without moving its entities", () => {
  const system = normalizeSystem({
    id: "sol",
    backgroundImage: " worlds/sol-map.webp ",
    objects: [{ id: "earth", x: 31.25, y: 64.5 }]
  });

  assert.equal(system.backgroundImage, "worlds/sol-map.webp");
  assert.equal(system.objects[0].x, 31.25);
  assert.equal(system.objects[0].y, 64.5);
});
