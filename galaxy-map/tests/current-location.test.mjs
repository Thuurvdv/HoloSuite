import assert from "node:assert/strict";
import test from "node:test";
import { createGalaxyStore } from "../src/galaxy-store.ts";
import { normalizeMap } from "../src/galaxy-model.ts";

test("setting the current system saves its arrival object and keeps both system IDs in sync", async () => {
  let stored = {
    map: normalizeMap({
      id: "map", schemaVersion: 3,
      currentLocation: { systemId: "origin", objectId: "origin-port" },
      systems: [
        { id: "origin", objects: [{ id: "origin-port" }] },
        { id: "destination", primaryObjectId: "arrival-port", objects: [{ id: "moon" }, { id: "arrival-port" }] },
        { id: "empty" }
      ]
    })
  };
  globalThis.foundry = { utils: { deepClone: structuredClone } };
  globalThis.game = {
    settings: {
      get: () => stored,
      set: async (_moduleId, _key, value) => { stored = JSON.parse(JSON.stringify(value)); }
    },
    socket: { emit() {} }
  };
  const store = createGalaxyStore({
    requireGM: () => true,
    notifyError: message => assert.fail(message),
    refreshOpenApps() {}
  });

  const system = await store.setCurrentSystem("map", "destination");
  assert.equal(system.id, "destination");
  assert.equal(stored.map.currentSystemId, "destination");
  assert.deepEqual(stored.map.currentLocation, { systemId: "destination", objectId: "arrival-port" });

  await store.setCurrentObject("map", "destination", "moon");
  await store.setCurrentSystem("map", "destination");
  assert.deepEqual(stored.map.currentLocation, { systemId: "destination", objectId: "moon" });

  await store.setCurrentSystem("map", "empty");
  assert.equal(stored.map.currentSystemId, "empty");
  assert.deepEqual(stored.map.currentLocation, { systemId: "empty", objectId: "" });
});
