import test from "node:test";
import assert from "node:assert/strict";
import { normalizeMap, normalizeSystem } from "../src/galaxy-model.ts";
import { createGalaxyStore } from "../src/galaxy-store.ts";
import { createOrbitLayout, orbitAngleAt } from "../src/orbits.ts";

const link = (centerId, orbitId, extra = {}) => ({
  centerId, orbitId, angle: 0, period: 0, clockwise: true, epoch: 0, ...extra
});
const systemData = () => ({
  id: "system",
  objects: [
    { id: "star", x: 50, y: 50, orbits: [{ id: "outer", radius: 20 }, { id: "inner", radius: 10 }] },
    { id: "planet", x: 30, y: 40, orbit: link("star", "outer", { period: 20 }), orbits: [{ id: "moon-ring", radius: 5 }] },
    { id: "moon", x: 30, y: 35, orbit: link("planet", "moon-ring", { angle: 180 }) },
    { id: "station", x: 10, y: 10, orbit: link("star", "inner") }
  ],
  routes: [{ id: "route", fromSystemId: "station", toSystemId: "planet" }]
});

function near(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1e-8, `Expected ${actual} to be near ${expected}`);
}

test("nested orbit positions agree with circular rings on a wide or tall map", () => {
  const layout = createOrbitLayout(normalizeSystem(systemData()).objects);
  const positions = layout.positions(2, 5000);
  near(positions.get("planet").x, 50);
  near(positions.get("planet").y, 70);
  near(positions.get("moon").x, 47.5);
  near(positions.get("moon").y, 70);
  assert.deepEqual(layout.positions(2, 5000, false).get("planet"), { x: 60, y: 50 });
  assert.deepEqual(layout.positions(0.5, 0).get("planet"), { x: 70, y: 50 });
  near(orbitAngleAt({ x: 45, y: 60 }, { x: 50, y: 50 }, 2), 135);
  const dragged = layout.positions(2, 0, true, { id: "star", point: { x: 30, y: 35 } });
  assert.deepEqual(dragged.get("planet"), { x: 40, y: 35 });
});

test("a missing or undiscovered center conceals dependent rings and uses free coordinates", () => {
  const objects = normalizeSystem(systemData()).objects;
  for (const layout of [
    createOrbitLayout(objects.filter(object => object.id !== "star")),
    createOrbitLayout(objects, new Set(["star"]))
  ]) {
    assert.equal(layout.rings.length, 0);
    assert.equal(layout.attachments.size, 0);
    assert.deepEqual(layout.positions(2, 5000).get("moon"), { x: 30, y: 35 });
  }
});

test("normalization removes broken or cyclic attachments and preserves valid orbit data in JSON", () => {
  const data = systemData();
  const normalized = normalizeSystem(data);
  assert.deepEqual(normalizeSystem(JSON.parse(JSON.stringify(normalized))).objects, normalized.objects);
  data.objects[0].orbit = link("moon", "missing");
  assert.equal(normalizeSystem(data).objects[0].orbit, undefined);
  data.objects[0].orbit = link("planet", "moon-ring");
  const repaired = normalizeSystem(data);
  assert.equal(repaired.objects[0].orbit, undefined);
  assert.equal(repaired.objects[1].orbit, undefined);
  assert.equal(repaired.objects[3].orbit, undefined);
  assert.equal(normalizeSystem({ id: "legacy", objects: [{ id: "legacy-object" }] }).objects[0].orbits, undefined);
});

function storeFixture() {
  globalThis.foundry = { utils: { deepClone: structuredClone, randomID: () => "test-id" } };
  let maps = { map: normalizeMap({ id: "map", schemaVersion: 3, systems: [systemData(), { id: "other" }] }) };
  globalThis.game = {
    settings: { get: () => maps, set: async (module, key, value) => { maps = value; } },
    socket: { emit() {} }
  };
  const errors = [];
  const store = createGalaxyStore({
    notifyError: message => errors.push(message), requireGM: () => true, refreshOpenApps() {},
    getOpenMapViews: () => [{ getOrbitGeometry: () => ({ aspect: 2, motion: true }) }]
  });
  return { store, errors };
}

test("removing a ring detaches its occupants at their current position and keeps their routes", async t => {
  t.mock.method(Date, "now", () => 5000);
  const { store } = storeFixture();
  const { object: star } = store.getObject("map", "star");
  await store.upsertObject("map", "system", { ...star, orbits: [star.orbits[1]] });
  const system = store.getSystem("map", "system");
  const planet = system.objects[1];
  assert.equal(planet.orbit, undefined);
  near(planet.x, 50);
  near(planet.y, 70);
  assert.equal(system.objects[2].orbit.centerId, "planet");
  assert.equal(system.objects[3].orbit.orbitId, "inner");
  assert.equal(system.routes[0].id, "route");
});

test("moving an orbit center detaches both the moving location and its occupants", async t => {
  t.mock.method(Date, "now", () => 5000);
  const { store } = storeFixture();
  await store.moveObject("map", "planet", "other");
  const { object: planet, systemId } = store.getObject("map", "planet");
  const { object: moon } = store.getObject("map", "moon");
  assert.equal(systemId, "other");
  assert.equal(planet.orbit, undefined);
  near(planet.y, 70);
  assert.equal(moon.orbit, undefined);
  near(moon.x, 47.5);
  near(moon.y, 70);
});

test("the store rejects cycles, retains existing orbits on unrelated edits, and saves a drag angle", async t => {
  t.mock.method(Date, "now", () => 5000);
  const { store, errors } = storeFixture();
  const { object: star } = store.getObject("map", "star");
  const result = await store.upsertObject("map", "system", { ...star, orbit: link("planet", "moon-ring") });
  assert.equal(result, null);
  assert.equal(errors.length, 1);
  await store.upsertObject("map", "system", { id: "star", name: "Renamed Star" });
  assert.deepEqual(store.getObject("map", "star").object.orbits, star.orbits);
  await store.saveObjectPosition("map", "system", "planet", 50, 30, { centerId: "star", orbitId: "outer", angle: 270 });
  assert.deepEqual(store.getObject("map", "planet").object.orbit, link("star", "outer", { angle: 270, period: 20, epoch: 5000 }));
});
