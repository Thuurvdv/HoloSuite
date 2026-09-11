import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("public API exposes focus and clear without bypassing map visibility", () => {
  const main = read("src/main.ts");
  const view = read("src/view-app.ts");
  assert.match(main, /game\.galaxyMap\s*=\s*\{[\s\S]*focusSystem,[\s\S]*clearSystemFocus,/);
  assert.match(view, /prepareMapForDisplay\(rawMap,[\s\S]*playerMode: this\.playerMode/);
  assert.match(view, /displayMap\?\.systems\?\.some/);
  assert.doesNotMatch(view, /visibility\s*=\s*["']players["']/);
});

test("focus overlay is semantic, styled, and honors reduced motion", () => {
  const template = read("templates/galaxy-map.hbs");
  const viewCss = read("styles/galaxy-map-view.css");
  const effectsCss = read("styles/galaxy-map-effects.css");
  assert.match(template, /gmf-external-focus/);
  assert.match(template, /system\.externalFocus\.label/);
  assert.match(viewCss, /\.gmf-external-focus/);
  assert.match(effectsCss, /prefers-reduced-motion[\s\S]*gmf-external-focus/);
});

test("manifest and package versions stay aligned", () => {
  const manifest = JSON.parse(read("module.json"));
  const pkg = JSON.parse(read("package.json"));
  assert.equal(manifest.version, pkg.version);
  assert.equal(manifest.version, "1.1.0");
});
