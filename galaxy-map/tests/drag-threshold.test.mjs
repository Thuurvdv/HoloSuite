import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const view = fs.readFileSync(new URL("../src/view-app.ts", import.meta.url), "utf8");

test("system icons only move after the pointer crosses the drag threshold", () => {
  const dragHandler = view.match(/_startSystemDrag\(event:[\s\S]*?\n    _pointerToMapPercent/)?.[0] ?? "";

  assert.match(dragHandler, /if \(!moved && dx <= 4 && dy <= 4\) return;/);
  assert.match(dragHandler, /if \(moved\) \{[\s\S]*node\.style\.left[\s\S]*save(?:Object|System)Position/);

  const pointerUpPrefix = dragHandler.match(/const onUp = async \(\) => \{([\s\S]*?)if \(moved\) \{/)?.[1] ?? "";
  assert.doesNotMatch(pointerUpPrefix, /node\.style\.(?:left|top)|_updateConnectedRoutes/);
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
