import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import Handlebars from "handlebars";

globalThis.foundry = { utils: { randomID: () => "test-id" } };
const { normalizeSystem } = await import("../src/galaxy-model.ts");

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
Handlebars.registerHelper("gmfEq", (a, b) => a === b);
Handlebars.registerHelper("gmfFallback", (a, b) => a || b);
Handlebars.registerHelper("gmfPercent", a => `${a}%`);
for (const name of ["system-details", "celestial-icon", "object-appearance-panel"]) {
  Handlebars.registerPartial(`modules/galaxy-map/templates/${name}.hbs`, read(`templates/${name}.hbs`));
}
const galaxyMap = Handlebars.compile(read("templates/galaxy-map.hbs"));
const manager = Handlebars.compile(read("templates/map-manager.hbs"));

const marker = (overrides = {}) => ({
  ...normalizeSystem({ id: "sol", name: "Sol", x: 40, y: 60 }),
  displayName: "Sol", displayType: "system", displayStatus: "known", iconSize: 28, ...overrides
});

test("the current location gets the arrow marker and a spoken label", () => {
  const html = galaxyMap({ map: { title: "Test", systems: [marker({ isCurrent: true }), marker({ id: "far", displayName: "Far" })], routes: [] } });
  assert.equal((html.match(/gmf-current-location-marker/g) ?? []).length, 1);
  assert.match(html, /aria-label="Sol, system, known, current location"/);
});

test("only an editing GM gets the resize handle on the selected marker", () => {
  const systems = [marker({ isSelected: true })];
  assert.match(galaxyMap({ map: { title: "Test", canEdit: true, systems, routes: [] } }), /data-resize-marker/);
  assert.doesNotMatch(galaxyMap({ map: { title: "Test", canEdit: false, systems, routes: [] }, playerMode: true }), /data-resize-marker/);
});

test("custom marker images replace the generated marker art", () => {
  const html = galaxyMap({ systemView: true, map: { title: "Test", systems: [marker({ hasCustomMarker: true, displayMarkerImage: "icons/sol.webp", animatedCelestial: true, iconStyle: "star" })], routes: [] } });
  assert.match(html, /<img class="gmf-custom-marker__image" src="icons\/sol\.webp"/);
  assert.doesNotMatch(html, /celestial-icons\/star\.svg/);
});

test("the manager shows the selected map's systems with the expanded one open", () => {
  const html = manager({
    hasMaps: true,
    maps: [{ id: "m1", title: "Outer Rim", systems: [], routes: [], visibility: "players" }],
    selectedMapId: "m1",
    selectedMap: {
      id: "m1", title: "Outer Rim", travelApprovalModeLabel: "Majority vote",
      systems: [
        { id: "a", name: "Alpha", visibility: "players", objects: [{ id: "a1", name: "Alpha Prime", kind: "planet", status: "known" }], isExpanded: true },
        { id: "b", name: "Beta", visibility: "gm", objects: [], isExpanded: false }
      ],
      routes: [], factions: []
    },
    showSystems: true
  });
  assert.match(html, /data-manager-tab="systems" aria-selected="true"/);
  assert.match(html, /data-toggle-system="a" aria-expanded="true"/);
  assert.match(html, /data-toggle-system="b" aria-expanded="false"/);
  assert.match(html, /Alpha Prime/);
  assert.match(html, /data-show-system="b"/);
  assert.match(html, /Travel: Majority vote/);
});

test("the entity appearance panel binds its fields to the side-panel form", () => {
  const html = galaxyMap({
    map: { title: "Test", systems: [], routes: [] },
    creationPanel: { isEntity: true, iconStyle: "planet", planetPreset: "custom", planetShape: "cube", planetFinish: "matte", markerImage: "" },
    appearanceGuideMarkup: "<div data-texture-guide></div>"
  });
  for (const name of ["iconStyle", "iconColor", "planetPreset", "planetShape", "planetFinish", "planetTexture"]) {
    assert.match(html, new RegExp(`name="${name}"[^>]*form="gmf-panel-editor-form"`), `${name} is not tied to the form`);
  }
  assert.match(html, /<option value="cube" selected>Cube<\/option>/);
  assert.match(html, /data-texture-guide/);
});
