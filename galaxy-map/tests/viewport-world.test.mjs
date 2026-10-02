import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { MAX_ZOOM, MIN_ZOOM, normalizeSystem } from "../src/galaxy-model.ts";

globalThis.foundry = { utils: { randomID: () => "test-id" } };
const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the chart supports deep zooming in both directions", () => {
  assert.equal(MIN_ZOOM, 0.2);
  assert.equal(MAX_ZOOM, 10);
});

test("uploaded images cannot zoom out beyond their fitted full-image view", () => {
  const view = read("src/view-app.ts");
  assert.match(view, /if \(background\) this\.zoom = Math\.max\(1, this\.zoom\)/);
  assert.ok((view.match(/html\.querySelector\("\.gmf-map-background"\) \? 1 : MIN_ZOOM/g) ?? []).length >= 2);
});

test("a custom-background viewport follows the uploaded image height", () => {
  const view = read("src/view-app.ts");
  assert.match(view, /desiredStageHeight = clamp\(stageRect\.width \/ imageAspect/);
  assert.match(view, /desiredWindowHeight = clamp\(frameRect\.height \+ desiredStageHeight - stageRect\.height/);
  assert.match(view, /this\.setPosition\(\{ height: Math\.round\(desiredWindowHeight\) \}\)/);
});

test("system backgrounds persist without changing normalized entity coordinates", () => {
  const system = normalizeSystem({
    id: "sol",
    backgroundImage: " worlds/sol-map.webp ",
    objects: [{ id: "earth", x: 31.25, y: 64.5 }]
  });

  assert.equal(system.backgroundImage, "worlds/sol-map.webp");
  assert.equal(system.objects[0].x, 31.25);
  assert.equal(system.objects[0].y, 64.5);
});

test("the image and coordinate overlays share one transformed world plane", () => {
  const view = read("src/view-app.ts");
  const template = read("templates/galaxy-map.hbs");
  const css = read("styles/galaxy-map-view.css");

  assert.match(view, /displayMap\.backgroundImage = activeSystem\.backgroundImage/);
  assert.match(view, /this\._worldWidth \* this\.zoom/);
  assert.match(view, /this\._worldHeight \* this\.zoom/);
  assert.match(view, /\/ this\._worldWidth\) \* 100/);
  assert.match(template, /gmf-map-viewport[\s\S]*gmf-map-background[\s\S]*gmf-system-layer/);
  assert.match(template, /#if map\.backgroundImage[^}]*\}\}gmf-map-stage--custom-background/);
  assert.match(css, /\.gmf-map-background[\s\S]*width: 100%;[\s\S]*height: 100%/);
  assert.match(css, /\.gmf-map-stage--custom-background\s*\{[\s\S]*background: #000/);
  assert.match(css, /\.gmf-map-stage--custom-background::before\s*\{[\s\S]*display: none/);
  assert.match(read("src/main.ts"), /Recommended: 4096×2304 WebP \(16:9\), or at least 3840 px wide\./);
});
