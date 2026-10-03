import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("JSON export uses Foundry's native file saver", () => {
  const domUtils = read("src/dom-utils.ts");
  assert.match(domUtils, /\(globalThis as any\)\.saveDataToFile/);
  assert.match(domUtils, /saveFile\(json, "application\/json", filename\)/);
});

test("manual system merging is retired without removing automatic schema migration", () => {
  const main = read("src/main.ts");
  const manager = read("src/manager-app.ts");
  const managerTemplate = read("templates/map-manager.hbs");
  const model = read("src/galaxy-model.ts");
  assert.doesNotMatch(main, /function mergeSystems|mergeSystems,/);
  assert.doesNotMatch(manager, /mergeSystems|_openMergeSystem/);
  assert.doesNotMatch(managerTemplate, /data-merge-system|Merge into another system/);
  assert.match(model, /migrateSchema1Map/);
  assert.match(model, /migrateSchema2Map/);
  assert.match(model, /export function migrateMap/);
});

test("module editors use viewport panels while approved dialogs remain", () => {
  const main = read("src/main.ts");
  const travel = read("src/travel-service.ts");
  const manager = read("src/manager-app.ts");
  const view = read("src/view-app.ts");
  const details = read("templates/system-details.hbs");
  assert.match(manager, /openMap\(this\.selectedMapId\)\?\.openEditor/);
  assert.match(view, /openEditor\(kind: string/);
  assert.match(details, /creation\.isMap[\s\S]*travelApprovalMode/);
  assert.match(details, /#if factionRegistry[\s\S]*data-edit-inline-faction/);
  assert.equal((travel.match(/new Dialog\(/g) ?? []).length, 1);
  assert.match(travel, /title: "Travel Request"/);
  assert.doesNotMatch(manager, /new Dialog\(/);
  assert.match(manager, /Dialog\.confirm/);
  assert.match(view, /Dialog\.confirm/);
  assert.match(main, /createPlayerMapChooserClass/);
});

test("manager uses one compact master-detail action surface and real content tabs", () => {
  const template = read("templates/map-manager.hbs");
  const manager = read("src/manager-app.ts");
  const managerCss = read("styles/galaxy-map-manager.css");
  const frameCss = read("styles/galaxy-map-frame.css");

  assert.match(template, /data-select-map=/);
  assert.doesNotMatch(template, /gmf-map-card__buttons/);
  assert.match(template, /data-manager-tab="systems"/);
  assert.match(template, /data-manager-tab="routes"/);
  assert.match(template, /data-manager-tab="factions"/);
  assert.match(manager, /activeTab/);
  assert.match(manager, /expandedSystemId/);
  assert.match(template, /data-toggle-system=/);
  assert.match(template, /aria-expanded=/);
  assert.match(template, /#if system\.isExpanded/);
  assert.match(managerCss, /\.gmf-object-tree \{[\s\S]*grid-column: 1 \/ -1/);
  assert.match(managerCss, /\.gmf-crud-list \{[\s\S]*display: flex;[\s\S]*flex-direction: column/);
  assert.match(managerCss, /\.gmf-crud-list \{[\s\S]*scrollbar-color: var\(--gmf-cyan/);
  assert.match(frameCss, /window-resizable-handle[\s\S]*color: var\(--gmf-cyan, #58d8ff\)/);
});

test("map chrome stays minimal without search, zoom, add, scan, or ping controls", () => {
  const template = read("templates/galaxy-map.hbs");
  const contextMenu = read("templates/map-context-menu.hbs");
  const details = read("templates/system-details.hbs");
  const view = read("src/view-app.ts");
  const main = read("src/main.ts");
  const model = read("src/galaxy-model.ts");
  const viewCss = read("styles/galaxy-map-view.css");
  const effectsCss = read("styles/galaxy-map-effects.css");

  assert.doesNotMatch(template, /data-system-search|data-action="zoom-(?:in|out)"|data-action="reset-view"|data-action="open-map-menu"|data-action="add-object"/);
  assert.doesNotMatch(template, /gmf-map-hint/);
  assert.match(template, /gmf-galaxy-name/);
  assert.match(template, /gmf-faction-toggle[\s\S]*data-action="toggle-territories"/);
  assert.match(template, /data-action="toggle-routes"[\s\S]*aria-pressed=/);
  assert.match(template, /#if map\.canEdit[\s\S]*data-action="edit-current-layer"[\s\S]*Edit System[\s\S]*Edit Galaxy/);
  assert.match(template, /data-action="toggle-hard-contrast"[\s\S]*aria-pressed=/);
  assert.match(template, /gmf-actions[\s\S]*#if systemView[\s\S]*gmf-faction-toggle[\s\S]*gmf-window-close/);
  assert.match(template, /data-action="navigate-up"[\s\S]*fa-arrow-up/);
  assert.match(template, /#if systemView[^\n]*#if showTerritories/);
  assert.match(template, /map-context-menu\.hbs/);
  assert.match(contextMenu, /data-context-action="add-entity"[\s\S]*Add Location/);
  assert.doesNotMatch(contextMenu, /data-context-action="add-entity" data-context-show="system"/);
  assert.match(contextMenu, /data-context-action="add-route-from-marker" data-context-show="system"[\s\S]*Add Route/);
  assert.doesNotMatch(contextMenu, /data-context-action="add-route" data-context-show="stage"|Add Route From Here|add-route-from-system|add-route-from-entity/);
  assert.match(template, /gmf-system--galaxy-node/);
  assert.match(template, /#if showInspector/);
  assert.match(view, /stage\?\.addEventListener\("contextmenu"/);
  assert.match(view, /action === "add-entity"[\s\S]*_openCreationPanel\("entity"/);
  assert.match(view, /action === "add-route-from-marker"[\s\S]*_openCreationPanel\("route", \{ fromSystemId: target\.id \}/);
  assert.doesNotMatch(view, /action === "add-route-from-system"|action === "add-route-from-entity"|action === "add-route"/);
  assert.match(view, /data-action='toggle-routes'[\s\S]*showRoutes = !this\.showRoutes/);
  assert.match(view, /data-action='edit-current-layer'[\s\S]*_openEditPanel\("system", this\.activeSystemId\)[\s\S]*_openCreationPanel\("map"/);
  assert.match(view, /addEventListener\("dblclick"[\s\S]*planetSystemId = id/);
  assert.match(view, /addEventListener\("dblclick"[\s\S]*activeSystemId = id/);
  assert.match(details, /data-panel-create-form[\s\S]*creation\.isSystem[\s\S]*creation\.isEntity[\s\S]*creation\.isRoute[\s\S]*creation\.isFaction/);
  assert.match(view, /action === "add-system"[\s\S]*_openCreationPanel\("system"/);
  assert.match(view, /data-action='edit-system'[\s\S]*_openEditPanel\("entity"[\s\S]*_openEditPanel\("system"/);
  assert.match(view, /kind === "entity"[\s\S]*upsertObject\(this\.mapId, this\.activeSystemId, \{ \.\.\.existing, \.\.\.values/);
  assert.match(viewCss, /\.gmf-system-panel \{[\s\S]*position: absolute;[\s\S]*border-radius: 30px;[\s\S]*background: rgba\(88, 216, 255, 0\.15\);[\s\S]*box-shadow:/);
  assert.match(details, /gmf-system-panel__scroll/);
  assert.match(viewCss, /\.gmf-system-panel \{[\s\S]*overflow: hidden/);
  assert.match(viewCss, /\.gmf-system-panel__scroll \{[\s\S]*overflow-y: auto;[\s\S]*scrollbar-gutter: stable/);
  assert.match(viewCss, /\.gmf-galaxy\.is-hard-contrast \.gmf-galaxy-identity[\s\S]*background: rgb\(1, 8, 15\)/);
  assert.match(viewCss, /\.gmf-galaxy\.is-hard-contrast \.gmf-system-panel[\s\S]*background: rgb\(2, 12, 20\)/);
  assert.match(view, /toggle-hard-contrast[\s\S]*matches\?\.\("\.gmf-galaxy"\)[\s\S]*classList\.toggle\("is-hard-contrast"/);
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
  assert.match(effectsCss, /prefers-reduced-motion[\s\S]*gmf-art-spin--slow/);
});

test("the travel rocket faces along its route without rotating its exhaust off-axis", () => {
  const travelCss = read("styles/galaxy-map-travel.css");
  assert.match(travelCss, /\.gmf-travel-ship\s*\{[\s\S]*rotate\(var\(--gmf-ship-angle, 0deg\)\)/);
  assert.match(travelCss, /\.gmf-travel-ship\s*>\s*i\s*\{[\s\S]*rotate\(45deg\)/);
  assert.match(travelCss, /\.gmf-travel-ship::before\s*\{[\s\S]*right:\s*16px/);
});

test("default planet markers and type-derived marker fallbacks remain presentation-only", () => {
  const model = read("src/galaxy-model.ts");
  const presenters = read("src/map-presenters.ts");
  const celestial = read("templates/celestial-icon.hbs");

  assert.match(model, /ANIMATED_CELESTIAL_STYLES[\s\S]*"planet"/);
  assert.match(presenters, /typeIconFallbacks/);
  assert.match(celestial, /iconStyle "planet"/);
  assert.match(celestial, /gmf-art-drift--clouds/);
});

test("system polish removes rotating frames and offers direct linked-scene controls", () => {
  const template = read("templates/galaxy-map.hbs");
  const details = read("templates/system-details.hbs");
  const view = read("src/view-app.ts");
  const main = read("src/main.ts");
  const managerCss = read("styles/galaxy-map-manager.css");
  const viewCss = read("styles/galaxy-map-view.css");
  const effectsCss = read("styles/galaxy-map-effects.css");

  assert.doesNotMatch(template, /gmf-system__current|gmf-system__destination/);
  assert.doesNotMatch(viewCss, /gmf-system__current|gmf-system__destination/);
  assert.doesNotMatch(effectsCss, /gmf-current-track|gmf-destination-track/);
  assert.match(details, /data-open-linked-scene/);
  assert.match(view, /data-open-linked-scene/);
  assert.match(view, /Math\.min\(this\._baseWindowHeight, window\.innerHeight - 24\)/);
  assert.match(managerCss, /\.gmf-marker-preview__stage[\s\S]*place-items: center/);
  assert.doesNotMatch(managerCss, /gmf-system-editor-tabs/);
});

test("all galaxy windows use themed nine-slice chrome with inner drag and close controls", () => {
  const framework = read("styles/galaxy-map-framework.css");
  const frameCss = read("styles/galaxy-map-frame.css");
  const managerTemplate = read("templates/map-manager.hbs");
  const mapTemplate = read("templates/galaxy-map.hbs");
  const chrome = read("src/window-chrome.ts");

  assert.match(framework, /galaxy-map-frame\.css/);
  assert.match(frameCss, /border-image-slice:\s*48\s*!important/);
  assert.doesNotMatch(frameCss, /border-image-slice:\s*48 fill/);
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
  for (const asset of ["cyan"]) {
    assert.ok(fs.existsSync(new URL(`../assets/frames/galaxy-frame-${asset}.svg`, import.meta.url)));
  }
});
