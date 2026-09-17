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

test("map chrome stays minimal without search, zoom, add, scan, or ping controls", () => {
  const template = read("templates/galaxy-map.hbs");
  const details = read("templates/system-details.hbs");
  const view = read("src/view-app.ts");
  const main = read("src/main.ts");
  const model = read("src/galaxy-model.ts");
  const viewCss = read("styles/galaxy-map-view.css");
  const effectsCss = read("styles/galaxy-map-effects.css");

  assert.doesNotMatch(template, /data-system-search|data-action="zoom-(?:in|out)"|data-action="reset-view"|data-action="open-map-menu"|data-action="add-object"/);
  assert.match(template, /gmf-galaxy-name/);
  assert.match(template, /gmf-faction-toggle[\s\S]*data-action="toggle-territories"/);
  assert.match(template, /gmf-actions[\s\S]*#if systemView[\s\S]*gmf-faction-toggle[\s\S]*gmf-window-close/);
  assert.match(template, /data-action="navigate-up"[\s\S]*fa-arrow-up/);
  assert.match(template, /#if systemView[^\n]*#if showTerritories/);
  assert.match(template, /data-context-action="add-entity"[\s\S]*Add Entity/);
  assert.match(template, /gmf-system--galaxy-node/);
  assert.match(template, /#if showInspector/);
  assert.match(view, /stage\?\.addEventListener\("contextmenu"/);
  assert.match(view, /action === "add-entity"[\s\S]*openObjectDialog/);
  assert.match(viewCss, /\.gmf-system-panel \{[\s\S]*position: absolute;[\s\S]*border-radius: 30px;[\s\S]*background: rgba\(88, 216, 255, 0\.15\);[\s\S]*box-shadow:/);
  assert.match(viewCss, /\.gmf-galaxy__content \{[\s\S]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(view, /if \(!moved\)[\s\S]*selectedRouteId = null[\s\S]*selectedObjectId = null[\s\S]*selectedSystemId = null/);
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

test("the travel rocket compensates for its artwork angle and faces along its route", () => {
  const viewCss = read("styles/galaxy-map-view.css");
  assert.match(viewCss, /gmf-travel-ship[\s\S]*rotate\(calc\(var\(--gmf-ship-angle, 0deg\) \+ 45deg\)\)/);
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
  assert.match(details, /data-open-linked-scene/);
  assert.match(view, /scenes\.length === 1[\s\S]*new Dialog\(/);
  assert.match(view, /name="sceneId"[\s\S]*_viewLinkedScene/);
  assert.match(main, /Math\.min\(320, viewportWidth - 24\)/);
  assert.match(managerCss, /\.gmf-marker-preview__stage[\s\S]*place-items: center/);
  assert.match(managerCss, /\.gmf-system-editor-tabs button\.is-active[\s\S]*linear-gradient/);
  assert.match(dom, /word\.toLowerCase\(\) === "gm" \? "GM"/);
});

test("all galaxy windows use themed nine-slice chrome with inner drag and close controls", () => {
  const framework = read("styles/galaxy-map-framework.css");
  const frameCss = read("styles/galaxy-map-frame.css");
  const managerTemplate = read("templates/map-manager.hbs");
  const mapTemplate = read("templates/galaxy-map.hbs");
  const chrome = read("src/window-chrome.ts");

  assert.match(framework, /galaxy-map-frame\.css/);
  assert.match(frameCss, /border-image-slice:\s*72\s*!important/);
  assert.doesNotMatch(frameCss, /border-image-slice:\s*72 fill/);
  assert.equal((frameCss.match(/galaxy-frame-cyan\.svg/g) ?? []).length, 1);
  assert.doesNotMatch(frameCss, /galaxy-frame-(ember|violet|police)\.svg|holosuite-core\/assets\/device-styles/);
  assert.match(frameCss, /> \.window-header \{ display: none !important; \}/);
  assert.match(managerTemplate, /gmf-manager__header" data-gmf-window-drag/);
  assert.match(mapTemplate, /gmf-galaxy__header" data-gmf-window-drag/);
  assert.match(managerTemplate, /data-action="close-window"/);
  assert.match(mapTemplate, /data-action="close-window"/);
  assert.match(chrome, /setPointerCapture/);
  assert.match(chrome, /activateGalaxyDialogChrome/);
  assert.match(chrome, /applyGalaxyFramePalette/);
  assert.match(chrome, /FRAME_PALETTES/);
  for (const palette of ["default", "ember", "violet", "space-police", "red", "corporate"]) assert.match(chrome, new RegExp(`(?:"${palette}"|${palette}):`));
  assert.match(chrome, /URL\.createObjectURL/);
  assert.match(chrome, /MutationObserver/);
  assert.match(chrome, /data-holosuite-theme/);
  assert.match(chrome, /data-holosuite-device-style/);
  for (const asset of ["cyan", "ember", "violet", "police"]) {
    assert.ok(fs.existsSync(new URL(`../assets/frames/galaxy-frame-${asset}.svg`, import.meta.url)));
  }
});
