import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("manager uses one compact master-detail action surface and real content tabs", () => {
  const template = read("templates/map-manager.hbs");
  const manager = read("src/manager-app.ts");

  assert.match(template, /data-select-map=/);
  assert.doesNotMatch(template, /gmf-map-card__buttons/);
  assert.match(template, /data-manager-tab="systems"/);
  assert.match(template, /data-manager-tab="routes"/);
  assert.match(template, /data-manager-tab="factions"/);
  assert.match(manager, /activeTab/);
});

test("map search, scan, and pings are interactive without adding persistent fields", () => {
  const template = read("templates/galaxy-map.hbs");
  const view = read("src/view-app.ts");
  const main = read("src/main.ts");
  const model = read("src/galaxy-model.ts");

  assert.match(template, /data-system-search/);
  assert.match(view, /_focusSearchResult/);
  assert.match(view, /_scanSelectedSystem/);
  assert.match(main, /action:\s*"system-ping"/);
  assert.match(view, /showSystemPing/);
  assert.doesNotMatch(model, /pingId|searchQuery|isDestination|hasAlert/);
});

test("idle routes stay still while active routes animate and reduced motion covers new effects", () => {
  const viewCss = read("styles/galaxy-map-view.css");
  const effectsCss = read("styles/galaxy-map-effects.css");

  const idleRouteRule = viewCss.match(/\.gmf-route\s*\{([\s\S]*?)\}/)?.[1] ?? "";
  assert.doesNotMatch(idleRouteRule, /animation:/);
  assert.match(viewCss, /\.gmf-route\.is-active:not\(\.is-selected\)[\s\S]*gmf-route-pulse/);
  assert.match(effectsCss, /prefers-reduced-motion[\s\S]*gmf-system-ping[\s\S]*gmf-celestial__planet-ring/);
});

test("default planet markers and type-derived marker fallbacks remain presentation-only", () => {
  const model = read("src/galaxy-model.ts");
  const main = read("src/main.ts");
  const celestial = read("templates/celestial-icon.hbs");

  assert.match(model, /ANIMATED_CELESTIAL_STYLES[\s\S]*"planet"/);
  assert.match(main, /typeIconFallbacks/);
  assert.match(celestial, /iconStyle "planet"/);
  assert.match(celestial, /gmf-celestial__surface--clouds/);
});
