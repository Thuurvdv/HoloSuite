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
for (const name of ["system-details", "celestial-icon", "object-appearance-panel", "map-context-menu", "faction-panel"]) {
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

test("the system editor renders the assigned faction and the unaffiliated choice", () => {
  const html = galaxyMap({
    map: { title: "Test", systems: [], routes: [] },
    showInspector: true,
    creationPanel: { isSystem: true, factionId: "alliance", factionOptions: [{ id: "alliance", name: "Alliance" }] }
  });
  assert.match(html, /<select name="factionId"><option value="">Unaffiliated<\/option>/);
  assert.match(html, /<option value="alliance" selected>Alliance<\/option>/);
});

test("the political overlay shares the map viewport and works on both chart levels", () => {
  for (const systemView of [true, false]) {
    const html = galaxyMap({
      systemView, showTerritories: true, showRoutes: true, highlightedFactionId: "alliance",
      territories: [{ id: "alliance", name: "Alliance", color: "#cc8800", points: "1,1 5,1 1,5" }],
      map: {
        title: "Test", backgroundImage: "nebula.webp", factions: [{ id: "alliance", name: "Alliance" }],
        systems: [marker({ factionId: "alliance", factionColor: "#cc8800" })], routes: []
      }
    });
    assert.match(html, /data-action="toggle-territories"[^>]*aria-pressed="true"/);
    assert.match(html, /gmf-map-viewport[\s\S]*gmf-map-background[\s\S]*gmf-territories[\s\S]*gmf-routes[\s\S]*gmf-system-layer/);
    assert.match(html, /<polygon class="is-faction-highlighted" points="1,1 5,1 1,5"/);
    assert.match(html, /class="gmf-system is-faction-highlighted[^"]*"[\s\S]*--gmf-faction-color: #cc8800/);
  }
});

test("the inspector renders faction dossier fields with an edit action for GMs", () => {
  const factionDossier = {
    id: "alliance", name: "Alliance", emblem: "alliance.webp", type: "Coalition", tagline: "Together",
    color: "#cc8800", description: "Independent worlds", headquarters: { name: "Sol" },
    controlledSystems: [{ id: "sol", name: "Sol" }]
  };
  const map = { title: "Test", systems: [], routes: [], factions: [factionDossier] };
  const player = galaxyMap({ map, factionDossier, showFactionPanel: true, showInspector: true, playerMode: true });
  assert.doesNotMatch(player, /data-action="select-faction"/);
  assert.match(player, /aria-label="Back to factions"/);
  assert.match(player, /alliance\.webp/);
  assert.match(player, /Coalition[\s\S]*Together[\s\S]*<h4>Description<\/h4>[\s\S]*Independent worlds[\s\S]*Headquarters[\s\S]*Sol/);
  assert.match(player, /Known controlled systems \(1\)[\s\S]*<li>Sol<\/li>/);
  assert.doesNotMatch(player, /GM Notes|data-edit-inline-faction/);
  const gm = galaxyMap({ map: { ...map, canEdit: true }, factionDossier: { ...factionDossier, gmNotes: "Private" }, showInspector: true });
  assert.match(gm, /data-edit-inline-faction="alliance"/);
  assert.match(gm, /GM Notes[\s\S]*Private/);
  const minor = galaxyMap({ map, showInspector: true, showFactionPanel: true, factionDossier: {
    id: "guild", name: "Guild", kind: "minor", parentName: "Alliance"
  } });
  assert.match(minor, /Minor faction · Alliance/);
});

test("faction prominence is editable by GMs and reputation is readable by players", () => {
  const map = { title: "Test", systems: [], routes: [] };
  const faction = { id: "guild", name: "Guild", kind: "minor", parentFactionId: "alliance", value: "Influential", ratingId: "Influential" };
  const gm = galaxyMap({ map, showInspector: true, showFactionPanel: true, factionPanel: {
    canEdit: true, showRatingControls: true, showLabels: true, scope: "Sol", systemId: "sol", reputation: false, rows: [faction],
    choices: [{ id: "Limited", label: "Limited" }, { id: "Influential", label: "Influential" }]
  } });
  assert.match(gm, /aria-expanded="true"/);
  assert.match(gm, /data-inspect-faction="guild"/);
  assert.match(gm, /gmf-faction-panel__row--child/);
  assert.doesNotMatch(gm, /Minor faction|Alliance/);
  assert.match(gm, /data-faction-standing="guild" data-prominence-system-id="sol"/);
  assert.doesNotMatch(gm, /\sdata-system-id=/);
  assert.match(gm, /data-faction-rating="Influential" aria-pressed="true"/);
  const player = galaxyMap({ map, showInspector: true, factionPanel: {
    reputation: true, showLabels: true, rows: [{ ...faction, value: "Friendly" }]
  } });
  assert.match(player, /Standing toward the party/);
  assert.match(player, /data-inspect-faction="guild"/);
  assert.match(player, />Friendly<\/span>/);
  assert.doesNotMatch(player, /data-faction-standing|data-edit-inline-faction/);
  const percentOnly = galaxyMap({ map, showInspector: true, factionPanel: {
    reputation: true, scale: "reputation", showLabels: false, showPercentages: true,
    rows: [{ ...faction, value: "Friendly", hasPercentage: true, percentage: 0 }]
  } });
  assert.match(percentOnly, /<meter min="0" max="100" value="0"/);
  assert.doesNotMatch(percentOnly, /Friendly|data-faction-percentage/);
});
