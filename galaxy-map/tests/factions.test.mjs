import test from "node:test";
import assert from "node:assert/strict";
import { normalizeMap } from "../src/galaxy-model.ts";
import { createGalaxyStore } from "../src/galaxy-store.ts";
import { prepareMapForDisplay, prepareMapForManager } from "../src/map-presenters.ts";
import { buildTerritories } from "../src/territories.ts";
import { createGalaxyMapViewClass } from "../src/view-app.ts";

const alliance = {
  id: "alliance", name: "Alliance", color: "#cc8800", description: "Independent worlds",
  visibility: "players", tagline: "Together", type: "Coalition", emblem: "alliance.webp",
  headquartersSystemId: "unknown", gmNotes: "Private alliance notes"
};
const shadow = { id: "shadow", name: "Shadow", color: "#aa0033", visibility: "gm", emblem: "shadow.webp" };
const fixture = () => ({
  id: "map", schemaVersion: 3, title: "Test",
  factions: [alliance, shadow],
  systems: [
    { id: "sol", name: "Sol", factionId: "alliance", x: 20, y: 20, objects: [
      { id: "station", name: "Station", factionId: "shadow" },
      { id: "port", name: "Port", factionId: "alliance" },
      { id: "unmapped", name: "Unmapped", status: "undiscovered", factionId: "alliance" },
      { id: "secret", name: "Secret", visibility: "gm", factionId: "alliance" }
    ] },
    { id: "unknown", name: "Unknown Colony", x: 98, y: 98, status: "undiscovered", factionId: "alliance", iconColor: "#cc8800" },
    { id: "hidden", name: "Hidden Colony", visibility: "gm", factionId: "alliance" },
    { id: "owned", name: "Outer Colony", factionId: "shadow" },
    { id: "custom", name: "Custom", iconColor: "#ffeeaa" }
  ]
});

function setup(isGM = true) {
  const refreshes = [], emissions = [], downloads = [];
  let maps = { map: fixture() };
  globalThis.foundry = {
    applications: { api: {
      ApplicationV2: class { async _prepareContext() { return {}; } },
      HandlebarsApplicationMixin: Base => Base
    } },
    utils: { deepClone: structuredClone, randomID: () => "new-id" }
  };
  globalThis.game = {
    user: { isGM },
    settings: { get: () => maps, set: async (_module, _key, value) => { maps = structuredClone(value); } },
    socket: { emit: (...args) => emissions.push(args) }
  };
  globalThis.saveDataToFile = json => downloads.push(JSON.parse(json));
  const store = createGalaxyStore({
    requireGM: () => game.user.isGM,
    notifyError() {}, notifyInfo() {}, refreshOpenApps: id => refreshes.push(id)
  });
  return { store, refreshes, emissions, downloads };
}

test("legacy factions keep their IDs and receive additive defaults", () => {
  setup();
  const { factions, systems } = normalizeMap({
    ...fixture(), factions: [{ id: "alliance", name: "Alliance", color: "#cc8800", visibility: "players" }]
  });
  assert.deepEqual(factions, [{
    id: "alliance", name: "Alliance", color: "#cc8800", visibility: "players", description: "",
    tagline: "", type: "", emblem: "", headquartersSystemId: "", gmNotes: "",
    kind: "major", parentFactionId: "", prominence: "Unrated", systemProminence: {},
    prominencePercent: null, systemProminencePercent: {}, reputation: "Neutral", reputationPercent: null
  }]);
  assert.equal(systems[0].factionId, "alliance");
});

test("faction edits and JSON import/export round-trip the expanded data", async () => {
  const { store, downloads } = setup();
  const edited = await store.upsertFaction("map", { id: "alliance", tagline: "Hold together" });
  assert.deepEqual(edited, {
    ...alliance, tagline: "Hold together",
    kind: "major", parentFactionId: "", prominence: "Unrated", systemProminence: {},
    prominencePercent: null, systemProminencePercent: {}, reputation: "Neutral", reputationPercent: null
  });
  store.exportMap("map");
  const imported = await store.importMapData(downloads[0]);
  assert.deepEqual(imported.factions, downloads[0].factions);
  assert.deepEqual(store.getRawMap(imported.id).factions[0], edited);
  assert.equal(imported.systems[0].factionId, "alliance");
  await store.deleteSystem("map", "unknown");
  assert.equal(store.getRawMap("map").factions[0].headquartersSystemId, "");
});

test("ownership saves refresh the map and leave location assignments intact", async () => {
  const { store, refreshes, emissions } = setup();
  await store.upsertSystem("map", { id: "sol", factionId: "shadow" });
  const saved = store.getRawMap("map");
  assert.equal(saved.systems[0].factionId, "shadow");
  assert.equal(saved.systems[0].objects[1].factionId, "alliance");
  assert.equal(saved.systems[0].x, 20);
  assert.equal(prepareMapForDisplay(saved).systems[0].factionColor, shadow.color);
  assert.equal(prepareMapForManager(saved).factions.find(faction => faction.id === "shadow").systemCount, 2);
  assert.deepEqual(refreshes, ["map"]);
  assert.equal(emissions[0][1].mapId, "map");
  await store.deleteFaction("map", "shadow");
  const after = store.getRawMap("map");
  assert.equal(after.systems[0].factionId, "");
  assert.equal(after.systems[0].objects[0].factionId, "");
  assert.equal(after.systems[0].objects[1].factionId, "alliance");
});

test("players cannot persist faction or ownership changes or export a GM map", async () => {
  const { store, downloads } = setup(false);
  const before = store.getRawMap("map");
  assert.equal(await store.upsertFaction("map", { id: "alliance", gmNotes: "Edited" }), null);
  assert.equal(await store.deleteFaction("map", "alliance"), false);
  assert.equal(await store.upsertSystem("map", { id: "sol", factionId: "" }), null);
  store.exportMap("map");
  assert.deepEqual(downloads, []);
  assert.deepEqual(store.getRawMap("map"), before);
});

test("player dossiers, ownership and territories use known visible systems", () => {
  setup(false);
  const map = prepareMapForDisplay(fixture());
  assert.deepEqual(map.factions.map(faction => faction.id), ["alliance"]);
  const dossier = map.factions[0];
  assert.equal(dossier.headquarters, null);
  assert.equal(dossier.gmNotes, undefined);
  assert.deepEqual(dossier.controlledSystems, [{ id: "sol", name: "Sol" }]);
  assert.equal(map.systems.some(system => system.id === "hidden"), false);
  const [sol, unknown, owned, custom] = map.systems;
  assert.equal(sol.factionColor, alliance.color);
  assert.equal(unknown.factionId, "");
  assert.equal(owned.factionId, "");
  assert.equal(owned.factionName, "Unaffiliated");
  assert.equal(owned.factionColor, "#58d8ff");
  assert.equal(custom.factionColor, "#ffeeaa");
  assert.equal(unknown.factionColor, "#58d8ff");
  assert.deepEqual(sol.objects.map(object => [object.id, object.factionId]), [
    ["station", ""], ["port", "alliance"], ["unmapped", ""]
  ]);
  assert.deepEqual(buildTerritories(map.systems, map.factions), buildTerritories([sol], map.factions));
  const knownHQ = prepareMapForDisplay({ ...fixture(), factions: [{ ...alliance, headquartersSystemId: "sol" }] });
  assert.deepEqual(knownHQ.factions[0].headquarters, { id: "sol", name: "Sol" });
});

test("the real viewport uses faction colors, scopes the overlays and preserves the current layer", async () => {
  const { store } = setup();
  const View = createGalaxyMapViewClass({ getRawMap: store.getRawMap, prepareMapForDisplay });
  const app = new View({ mapId: "map" });
  app.selectedFactionId = "alliance";
  let context = await app._prepareContext({});
  assert.equal(context.map.systems[0].factionColor, alliance.color);
  assert.equal(context.factionDossier.gmNotes, alliance.gmNotes);
  assert.equal(context.factionDossier.headquarters.name, "Unknown Colony");
  assert.equal(context.highlightedFactionId, "alliance");
  assert.deepEqual(context.territories, []);
  app.showGalaxyTerritories = true;
  context = await app._prepareContext({});
  assert.equal(context.systemView, false);
  assert.equal(context.territories.filter(region => region.id === "alliance").length, 3);
  app.activeSystemId = "sol";
  context = await app._prepareContext({});
  assert.equal(context.systemView, true);
  assert.equal(context.activeSystem.id, "sol");
  assert.equal(context.territories.filter(region => region.id === "alliance").length, 1);
  assert.equal(context.factionDossier.controlledSystems.length, 3);
  app.selectedFactionId = "shadow";
  app.playerMode = true;
  context = await app._prepareContext({});
  assert.equal(context.factionDossier, null);
  assert.equal(app.selectedFactionId, "");
  assert.ok(context.territories.every(region => region.id !== "shadow"));
});

test("minor factions have chart-specific prominence and party reputation without owning regions", async () => {
  const { store } = setup();
  await store.upsertFaction("map", {
    id: "guild", name: "Guild", kind: "minor", parentFactionId: "alliance",
    prominence: "Limited", systemProminence: { sol: "Influential", hidden: "Established" }, reputation: "Friendly"
  });
  await store.upsertSystem("map", { id: "custom", factionId: "guild" });
  assert.equal(await store.upsertFaction("map", { id: "invalid", kind: "minor", parentFactionId: "guild" }), null);
  const View = createGalaxyMapViewClass({ getRawMap: store.getRawMap, prepareMapForDisplay });
  const app = new View({ mapId: "map" });
  app.factionPanelOpen = true;
  let context = await app._prepareContext({});
  const guild = () => context.factionPanel.rows.find(row => row.id === "guild");
  assert.equal(guild().value, "Limited");
  assert.equal(guild().parentFactionId, "alliance");
  assert.ok(context.territories.every(region => region.id !== "guild"));
  app.selectedFactionId = "guild";
  const dossier = await app._prepareContext({});
  assert.equal(dossier.factionDossier.id, "guild");
  assert.equal(dossier.factionDossier.parentName, "Alliance");
  assert.equal(dossier.highlightedFactionId, undefined);
  assert.equal(dossier.showFactionPanel, true);
  assert.equal(dossier.factionPanel, null);
  app.selectedFactionId = "";
  app.activeSystemId = "sol";
  context = await app._prepareContext({});
  assert.equal(guild().value, "Influential");
  app.playerMode = true;
  app.factionPanelTab = "reputation";
  context = await app._prepareContext({});
  assert.equal(guild().value, "Friendly");
  assert.deepEqual(guild().systemProminence, { sol: "Influential" });
  assert.equal(context.factionPanel.canEdit, true);
  assert.equal(context.factionPanel.canManage, false);
  game.user.isGM = false;
  context = await app._prepareContext({});
  assert.equal(context.factionPanel.canEdit, false);
  game.user.isGM = true;
  await store.deleteFaction("map", "alliance");
  assert.equal(store.getRawMap("map").factions.find(faction => faction.id === "guild").parentFactionId, "");
});

test("a GM in player view can save both faction ratings through the viewport", async () => {
  const { store } = setup();
  const View = createGalaxyMapViewClass({
    getRawMap: store.getRawMap, prepareMapForDisplay, upsertFaction: store.upsertFaction,
    notifyInfo() {}, notifyError: message => assert.fail(message)
  });
  const app = new View({ mapId: "map", playerMode: true });
  await app._saveFactionStanding("alliance", "Influential", "sol", false);
  await app._saveFactionStanding("alliance", "Friendly", "sol", true);
  game.user.isGM = false;
  await app._saveFactionStanding("alliance", "Hostile", "", true);
  const faction = store.getRawMap("map").factions.find(({ id }) => id === "alliance");
  assert.deepEqual(faction.systemProminence, { sol: "Influential" });
  assert.equal(faction.reputation, "Friendly");
});

test("editing a minor faction keeps its saved scale and parent in the form context", async () => {
  const { store } = setup();
  await store.upsertFaction("map", { id: "guild", name: "Guild", kind: "minor", parentFactionId: "alliance" });
  const View = createGalaxyMapViewClass({ getRawMap: store.getRawMap, prepareMapForDisplay });
  const app = new View({ mapId: "map" });
  app.render = () => {};
  assert.equal(app.openEditor("faction", { id: "guild" }), true);
  const { creationPanel } = await app._prepareContext({});
  assert.equal(creationPanel.kind, "faction");
  assert.equal(creationPanel.factionScale, "minor");
  assert.equal(creationPanel.parentFactionId, "alliance");
  assert.ok(creationPanel.parentFactionOptions.some(faction => faction.id === "alliance"));
});

test("disabling factions hides the viewport feature without changing saved assignments", async t => {
  const { store } = setup();
  const readSetting = game.settings.get;
  let enabled = true;
  t.mock.method(game.settings, "get", (moduleId, key) => key === "enableFactions" ? enabled : readSetting(moduleId, key));
  const View = createGalaxyMapViewClass({ getRawMap: store.getRawMap, prepareMapForDisplay });
  const app = new View({ mapId: "map" });
  app.factionPanelOpen = true;
  assert.ok((await app._prepareContext({})).factionPanel);
  enabled = false;
  const context = await app._prepareContext({});
  assert.equal(context.factionsDisabled, true);
  assert.equal(context.factionPanel, null);
  assert.deepEqual(context.territories, []);
  assert.equal(context.map.systems[0].factionName, "");
  assert.equal(context.map.systems[0].factionColor, "#58d8ff");
  assert.equal(app.openEditor("faction", { id: "alliance" }), false);
  assert.equal(store.getRawMap("map").systems[0].factionId, "alliance");
  enabled = true;
  assert.equal((await app._prepareContext({})).map.systems[0].factionColor, alliance.color);
});

test("prominence percentages are optional, scoped, and editable only by a GM", async t => {
  const { store } = setup();
  const errors = [];
  const readSetting = game.settings.get;
  let enabled = false;
  t.mock.method(game.settings, "get", (moduleId, key) => key === "showProminencePercentages" ? enabled : readSetting(moduleId, key));
  const View = createGalaxyMapViewClass({
    getRawMap: store.getRawMap, prepareMapForDisplay, upsertFaction: store.upsertFaction,
    notifyError: error => errors.push(error)
  });
  const app = new View({ mapId: "map" });
  app.factionPanelOpen = true;
  assert.equal((await app._prepareContext({})).factionPanel.showPercentages, false);
  enabled = true;
  await app._saveFactionPercentage("alliance", "", 0, false);
  await app._saveFactionPercentage("alliance", "sol", 80, false);
  await app._saveFactionPercentage("alliance", "custom", 100, false);
  await app._saveFactionPercentage("alliance", "sol", 101, false);
  assert.equal(errors.length, 1);
  const galaxy = (await app._prepareContext({})).factionPanel;
  assert.equal(galaxy.showPercentages, true);
  assert.equal(galaxy.rows[0].hasPercentage, true);
  assert.equal(galaxy.rows[0].percentage, 0);
  app.activeSystemId = "sol";
  assert.equal((await app._prepareContext({})).factionPanel.rows[0].percentage, 80);
  game.user.isGM = false;
  await app._saveFactionPercentage("alliance", "sol", 50, false);
  assert.equal(store.getRawMap("map").factions[0].systemProminencePercent.sol, 80);
  assert.equal((await app._prepareContext({})).factionPanel.canEdit, false);
  game.user.isGM = true;
  await app._saveFactionPercentage("alliance", "sol", null, false);
  assert.deepEqual(store.getRawMap("map").factions[0].systemProminencePercent, { custom: 100 });
  assert.equal((await app._prepareContext({})).factionPanel.rows[0].hasPercentage, false);
  app.factionPanelTab = "reputation";
  assert.equal((await app._prepareContext({})).factionPanel.showPercentages, false);
});

test("reputation percentages apply across the map and display independently of labels", async t => {
  const { store } = setup();
  const readSetting = game.settings.get;
  const preferences = { showReputationLabels: false, showReputationPercentages: true, showProminencePercentages: false };
  t.mock.method(game.settings, "get", (moduleId, key) => preferences[key] ?? readSetting(moduleId, key));
  const View = createGalaxyMapViewClass({
    getRawMap: store.getRawMap, prepareMapForDisplay, upsertFaction: store.upsertFaction
  });
  const app = new View({ mapId: "map" });
  app.factionPanelOpen = true;
  app.activeSystemId = "sol";
  app.factionPanelTab = "reputation";
  await app._saveFactionPercentage("alliance", "sol", 65, true);
  const systemPanel = (await app._prepareContext({})).factionPanel;
  assert.equal(systemPanel.showLabels, false);
  assert.equal(systemPanel.showPercentages, true);
  assert.equal(systemPanel.rows[0].percentage, 65);
  app.activeSystemId = null;
  assert.equal((await app._prepareContext({})).factionPanel.rows[0].percentage, 65);
  assert.deepEqual(store.getRawMap("map").factions[0].systemProminencePercent, {});
  app.factionPanelTab = "prominence";
  const prominence = (await app._prepareContext({})).factionPanel;
  assert.equal(prominence.showLabels, true);
  assert.equal(prominence.showPercentages, false);
});
