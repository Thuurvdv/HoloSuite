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

test("map search remains interactive without scan or ping features", () => {
  const template = read("templates/galaxy-map.hbs");
  const details = read("templates/system-details.hbs");
  const view = read("src/view-app.ts");
  const main = read("src/main.ts");
  const model = read("src/galaxy-model.ts");
  const viewCss = read("styles/galaxy-map-view.css");
  const effectsCss = read("styles/galaxy-map-effects.css");

  assert.match(template, /data-system-search/);
  assert.match(view, /_focusSearchResult/);
  assert.doesNotMatch(details, /scan-system|ping-system|Scan System|Ping System/);
  assert.doesNotMatch(view, /_scanSelectedSystem|showSystemPing|is-scanning|gmf-system-ping/);
  assert.doesNotMatch(main, /showSystemPingOnOpenMaps|pingSystem|system-ping/);
  assert.doesNotMatch(viewCss, /is-scanning|gmf-system-ping/);
  assert.doesNotMatch(effectsCss, /gmf-scan-ring|gmf-system-ping|gmf-current-ping/);
  assert.doesNotMatch(model, /pingId|searchQuery|isDestination|hasAlert/);
});

test("idle routes stay still while active routes animate and reduced motion covers new effects", () => {
  const viewCss = read("styles/galaxy-map-view.css");
  const effectsCss = read("styles/galaxy-map-effects.css");

  const idleRouteRule = viewCss.match(/\.gmf-route\s*\{([\s\S]*?)\}/)?.[1] ?? "";
  assert.doesNotMatch(idleRouteRule, /animation:/);
  assert.match(viewCss, /\.gmf-route\.is-active:not\(\.is-selected\)[\s\S]*gmf-route-pulse/);
  assert.match(effectsCss, /prefers-reduced-motion[\s\S]*gmf-celestial__planet-ring/);
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

test("system polish removes rotating frames and offers a chooser for multiple linked scenes", () => {
  const template = read("templates/galaxy-map.hbs");
  const details = read("templates/system-details.hbs");
  const view = read("src/view-app.ts");
  const main = read("src/main.ts");
  const managerCss = read("styles/galaxy-map-manager.css");
  const viewCss = read("styles/galaxy-map-view.css");
  const effectsCss = read("styles/galaxy-map-effects.css");
  const dom = read("src/dom-utils.ts");

  assert.doesNotMatch(template, /gmf-system__current|gmf-system__destination/);
  assert.doesNotMatch(viewCss, /gmf-system__current|gmf-system__destination/);
  assert.doesNotMatch(effectsCss, /gmf-current-track|gmf-destination-track/);
  assert.match(details, /Go to Scene/);
  assert.match(view, /scenes\.length === 1[\s\S]*new Dialog\(/);
  assert.match(view, /name="sceneId"[\s\S]*_viewLinkedScene/);
  assert.match(main, /Math\.min\(320, viewportWidth - 24\)/);
  assert.match(managerCss, /\.gmf-marker-preview__stage[\s\S]*place-items: center/);
  assert.match(managerCss, /\.gmf-system-editor-tabs button\.is-active[\s\S]*linear-gradient/);
  assert.match(dom, /word\.toLowerCase\(\) === "gm" \? "GM"/);
});
