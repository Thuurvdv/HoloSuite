import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createGalaxyMapViewClass } from "../src/view-app.ts";

const view = fs.readFileSync(new URL("../src/view-app.ts", import.meta.url), "utf8");

test("system icons only move after the pointer crosses the drag threshold", async () => {
  const events = new Map();
  const saves = [];
  let frame;
  globalThis.foundry = { applications: { api: {
    ApplicationV2: class {}, HandlebarsApplicationMixin: Base => Base
  } } };
  globalThis.window = {
    addEventListener: (type, fn) => events.set(type, fn),
    removeEventListener: type => events.delete(type)
  };
  globalThis.requestAnimationFrame = fn => { frame = fn; return 1; };
  globalThis.cancelAnimationFrame = () => { frame = undefined; };
  const View = createGalaxyMapViewClass({ saveSystemPosition: (...args) => saves.push(args) });
  const app = Object.create(View.prototype);
  app.mapId = "map";
  app._pointerToMapPercent = event => ({ x: event.clientX, y: event.clientY });
  const html = { querySelectorAll: () => [] };
  const node = { dataset: { systemId: "system" }, style: {}, classList: { add() {}, remove() {} } };
  const down = { button: 0, clientX: 10, clientY: 10, preventDefault() {}, stopPropagation() {} };

  app._startSystemDrag(down, html, node);
  events.get("pointermove")({ clientX: 14, clientY: 14 });
  await events.get("pointerup")();
  assert.deepEqual(node.style, {});
  assert.deepEqual(saves, []);

  app._startSystemDrag(down, html, node);
  events.get("pointermove")({ clientX: 15, clientY: 14 });
  frame();
  assert.deepEqual(node.style, { left: "15%", top: "14%" });
  await events.get("pointerup")();
  assert.deepEqual(saves, [["map", "system", 15, 14]]);
});

test("selected GM markers expose an independent drag-to-resize handle", () => {
  const template = fs.readFileSync(new URL("../templates/galaxy-map.hbs", import.meta.url), "utf8");
  const css = fs.readFileSync(new URL("../styles/galaxy-map-view.css", import.meta.url), "utf8");
  const resizeHandler = view.match(/_startMarkerResize\(event:[\s\S]*?\n    _pointerToMapPercent/)?.[0] ?? "";

  assert.match(template, /system\.isSelected[\s\S]*data-resize-marker/);
  assert.match(resizeHandler, /clamp\(Math\.round[\s\S]*18, 56\)/);
  assert.match(resizeHandler, /upsertObject[\s\S]*iconSize: latestSize/);
  assert.match(resizeHandler, /upsertSystem[\s\S]*iconSize: latestSize/);
  assert.match(css, /\.gmf-system__resize-handle[\s\S]*cursor: nwse-resize/);
});
