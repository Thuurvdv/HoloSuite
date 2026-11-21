import test from "node:test";
import assert from "node:assert/strict";
import { mountOrbitLayer } from "../src/orbit-layer.ts";
import { createOrbitLayout } from "../src/orbits.ts";
import { normalizeSystem } from "../src/galaxy-model.ts";
import { buildTerritories } from "../src/territories.ts";

test("faction outlines follow orbit positions during animation, resize, drag, and reduced motion", t => {
  let now = 0;
  let nextFrame;
  t.mock.method(Date, "now", () => now);
  const motion = { matches: false, addEventListener() {}, removeEventListener() {} };
  for (const [name, value] of Object.entries({
    matchMedia: () => motion,
    requestAnimationFrame: callback => { nextFrame = callback; return 1; },
    cancelAnimationFrame: () => {}
  })) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, name);
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
    t.after(() => previous ? Object.defineProperty(globalThis, name, previous) : delete globalThis[name]);
  }
  const members = normalizeSystem({ id: "system", objects: [
    { id: "star", x: 50, y: 50, orbits: [{ id: "ring", radius: 30 }] },
    { id: "planet", x: 10, y: 10, factionId: "a", orbit: {
      centerId: "star", orbitId: "ring", angle: 0, period: 20, clockwise: true, epoch: 0
    } },
    { id: "hidden", x: 95, y: 95, factionId: "a" }
  ] }).objects.map(object => ({ ...object, obscured: object.id === "hidden" }));
  const factions = [{ id: "a", name: "Alliance", color: "#58d8ff" }];
  const layout = createOrbitLayout(members);
  const attrs = new Map();
  const outline = { dataset: { territoryFaction: "a" }, getAttribute: key => attrs.get(key), setAttribute: (key, value) => attrs.set(key, value) };
  const label = { dataset: { territoryLabel: "a" }, style: {} };
  const viewport = {
    isConnected: true,
    querySelector: () => null,
    querySelectorAll: selector => selector === "[data-territory-faction]" ? [outline]
      : selector === "[data-territory-label]" ? [label] : []
  };
  const layer = mountOrbitLayer(viewport, layout, { members, factions });
  const check = (aspect, drag) => {
    const positions = layout.positions(aspect, now, !motion.matches, drag);
    const [expected] = buildTerritories(members.map(member => ({ ...member, ...positions.get(member.id) })), factions, { cluster: false });
    assert.equal(attrs.get("points"), expected.points);
    assert.equal(label.style.left, `${expected.labelX}%`);
    assert.equal(label.style.top, `${expected.labelY}%`);
  };
  layer.setAspect(2);
  check(2);
  const initial = attrs.get("points");
  now = 5000;
  nextFrame();
  check(2);
  assert.notEqual(attrs.get("points"), initial);
  layer.setAspect(0.5);
  check(0.5);
  const drag = { id: "star", point: { x: 30, y: 35 } };
  layer.previewDrag(drag.id, drag.point);
  check(0.5, drag);
  layer.cancelDrag();
  check(0.5);
  motion.matches = true;
  layer.setAspect(2);
  check(2);
  layer.dispose();
});
