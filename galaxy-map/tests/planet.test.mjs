import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import Handlebars from "handlebars";
import { ANIMATED_CELESTIAL_STYLES, normalizeMap, normalizePlanetLocation, normalizeSystem, normalizeSystemObject } from "../src/galaxy-model.ts";
import { getPlanetAppearance, getPlanetOptionsForShape, isDefaultStaticPlanetAppearance, normalizePlanetPresetForShape, PLANET_FINISH_OPTIONS, PLANET_OPTIONS, PLANET_PRESETS, PLANET_SHAPE_OPTIONS } from "../src/planet-presets.ts";

globalThis.foundry = { utils: { randomID: () => "test-id" } };
const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
Handlebars.registerHelper("gmfEq", (a,b) => a === b);
Handlebars.registerHelper("gmfFallback", (a,b) => a || b);
Handlebars.registerHelper("gmfPercent", a => `${a}%`);
for (const name of ["system-details", "celestial-icon"]) Handlebars.registerPartial(`modules/galaxy-map/templates/${name}.hbs`, read(`templates/${name}.hbs`));

test("unknown presets fall back to Ice Planet and custom textures survive a JSON round trip", () => {
  assert.equal(normalizeSystem({}).planetPreset, "ice");
  assert.equal(normalizeSystem({}).planetShape, "sphere");
  const map = normalizeMap({ systems: [{ id: "p", planetPreset: "legacy-preset", planetShape: "donut", planetTexture: " worlds/My World/planet.webp " }] });
  const roundTrip = normalizeMap(JSON.parse(JSON.stringify(map)));
  assert.equal(roundTrip.systems[0].planetTexture, "worlds/My World/planet.webp");
  assert.equal(roundTrip.systems[0].planetPreset, "custom");
  assert.equal(roundTrip.systems[0].planetShape, "donut");
  assert.equal(normalizeSystem({ planetPreset: "unsupported" }).planetPreset, "ice");
  const retiredGenerated = normalizeSystem({ planetPreset: "generated", planetGeneratedSeed: 42 });
  assert.equal(retiredGenerated.planetPreset, "ice");
  assert.equal(normalizeSystem({ planetPreset: "auto" }).planetPreset, "ice");
  assert.equal(PLANET_OPTIONS[0].value, "ice");
  assert.equal(PLANET_OPTIONS.some(option => option.value === "auto"), false);
  assert.equal(PLANET_OPTIONS.some(option => option.value === "sun"), true);
  assert.equal(PLANET_OPTIONS.some(option => option.value === "techno"), true);
  assert.equal(PLANET_OPTIONS.some(option => option.value === "cube"), true);
  assert.equal("planetGeneratedSeed" in retiredGenerated, false);
  assert.equal(normalizeSystem({ planetShape: "unsupported" }).planetShape, "sphere");
  assert.deepEqual(PLANET_SHAPE_OPTIONS.map(shape => shape.value), ["sphere", "cube", "donut", "asteroid", "crystal", "cylinder"]);
});
test("appearance choices depend on the shape, with colour, custom and none always available", () => {
  const universal = ["color", "custom", "none"];
  const values = shape => getPlanetOptionsForShape(shape).map(option => option.value);
  const sphere = values("sphere");
  for (const preset of ["techno", "gas-giant", "volcanic", "black-hole", "asteroid"]) assert.ok(sphere.includes(preset));
  for (const preset of ["prison", "anomaly", "cube", "donut-planet"]) assert.equal(sphere.includes(preset), false);
  assert.deepEqual(values("cube"), ["cube", ...universal]);
  assert.deepEqual(values("donut"), ["donut-planet", ...universal]);
  assert.deepEqual(values("asteroid"), ["asteroid", ...universal]);
  assert.deepEqual(values("crystal"), ["anomaly", ...universal]);
  assert.deepEqual(values("cylinder"), ["prison", ...universal]);
  assert.equal(normalizePlanetPresetForShape("ice", "cube"), "cube");
  assert.equal(normalizePlanetPresetForShape("custom", "cube"), "custom");
  assert.equal(normalizeSystemObject({ planetShape: "crystal", planetPreset: "ice" }).planetPreset, "anomaly");
});
test("custom textures and flat colours produce the saved appearance", () => {
  const system = normalizeSystem({ planetTexture: "worlds/custom.jpg" });
  assert.equal(system.planetPreset, "custom");
  const before = JSON.stringify(system);
  assert.equal(getPlanetAppearance(system).texture, "worlds/custom.jpg");
  for (const preset of PLANET_PRESETS) assert.ok(getPlanetAppearance(system, preset.value).texture.endsWith(preset.texture));
  assert.equal(JSON.stringify(system), before);
  assert.ok(getPlanetAppearance({ ...system, planetTexture: "" }).texture.endsWith("Ice-planet.webp"));
  assert.equal(getPlanetAppearance({ ...system, planetShape: "cube" }).shape, "cube");
  const flat = normalizeSystem({ planetPreset: "color", planetColor: "#123abc", planetTexture: "unused.webp", type: "station" });
  assert.equal(flat.planetPreset, "color");
  assert.equal(flat.planetColor, "#123abc");
  assert.equal(getPlanetAppearance(flat).texture, null);
  assert.equal(getPlanetAppearance(flat).color, "#123abc");
  assert.equal(getPlanetAppearance(normalizeSystem({ planetPreset: "sun" })).preset, "sun");
  assert.equal(getPlanetAppearance(normalizeSystem({ planetPreset: "black-hole" })).preset, "black-hole");
});
test("every visible entity gets a detail view unless it is set to none", () => {
  assert.equal(getPlanetAppearance({ ...normalizeSystem({}), obscured: true }), null);
  assert.ok(getPlanetAppearance(normalizeSystem({ type: "station" })));
  assert.ok(getPlanetAppearance(normalizeSystem({ type: "anomaly", iconStyle: "black-hole" })));
  assert.equal(getPlanetAppearance(normalizeSystem({ planetPreset: "none", planetTexture: "private.png" })), null);
});
test("only the Black Hole opens as a static preview by default", () => {
  assert.equal(isDefaultStaticPlanetAppearance("black-hole"), true);
  assert.equal(isDefaultStaticPlanetAppearance("sun"), false);
});
test("bundled textures exist and have the aspect ratio their shape expects", () => {
  for (const preset of PLANET_PRESETS) {
    const bytes = fs.readFileSync(new URL(`../assets/planets/${preset.texture}`, import.meta.url));
    assert.equal(bytes.toString("ascii", 12, 16), "VP8X");
    const width = bytes.readUIntLE(24, 3) + 1;
    const height = bytes.readUIntLE(27, 3) + 1;
    if (preset.value === "prison") assert.equal(width, height);
    else if (preset.value === "cube") assert.equal(width * 3, height * 4);
    else assert.equal(width, height * 2);
  }
});
test("surface finishes persist on objects and reach the detail view", () => {
  const object = normalizeSystemObject({ planetFinish: "holographic" });
  assert.equal(object.planetFinish, "holographic");
  assert.equal(normalizeSystemObject({ planetFinish: "unsupported" }).planetFinish, "smooth");
  assert.deepEqual(PLANET_FINISH_OPTIONS.map(finish => finish.value), ["smooth", "matte", "holographic"]);
  assert.equal(getPlanetAppearance(object).finish, "holographic");
});

test("surface locations are stored per entity and per shape, and are normalised", () => {
  const location = normalizePlanetLocation({ sceneId: "scene-a", shape: "donut", position: [0.2, -0.4, 0.8], normal: [0, 0, 4] });
  assert.deepEqual(location.normal, [0, 0, 1]);
  assert.equal(location.surfaceVersion, 1);
  const object = normalizeSystemObject({ sceneIds: ["scene-a"], planetLocations: [location, { ...location, id: "duplicate" }] });
  assert.equal(object.planetLocations.length, 1);
  assert.deepEqual(normalizeSystemObject(JSON.parse(JSON.stringify(object))).planetLocations, object.planetLocations);
  assert.equal(normalizeSystemObject({ sceneIds: [], planetLocations: [location] }).planetLocations.length, 0);
  const migrated = normalizeMap({ systems: [{ id: "legacy", sceneIds: ["scene-a"], planetLocations: [location] }] });
  assert.equal(migrated.systems[0].objects[0].planetLocations[0].sceneId, "scene-a");
});

test("the detail view shows GM notes to the GM only", () => {
  const template = Handlebars.compile(read("templates/galaxy-map.hbs"));
  const details = Handlebars.compile(read("templates/system-details.hbs"));
  const system = { ...normalizeSystem({ type: "station" }), displayName: "Test Station", displayDescription: "Survey", notes: "SECRET", canInspectSystem: true };
  const context = { planetView: true, activeSystem: { name: "Test System" }, planetSystem: system, planetAppearance: getPlanetAppearance(system), map: { title: "Test", canEdit: true }, playerMode: false };
  const gm = template(context);
  assert.match(gm, /data-action="navigate-up"[\s\S]*fa-arrow-up/);
  assert.match(gm, /class="gmf-planet-name">Test Station/);
  assert.doesNotMatch(gm, /Object Detail|data-planet-appearance/);
  assert.match(gm, /SECRET/);
  assert.match(gm, /Linked Content/);
  assert.doesNotMatch(gm, /data-planet-preset|Compare appearance|Alerts &amp; Signals|data-action="inspect-system"/);
  const inspector = details({ system, map: context.map, playerMode: false, planetView: false });
  assert.match(inspector, /data-action="open-system"/);
  assert.match(inspector, /gmf-navigation-icon--system/);
  const objectInspector = details({ system, map: context.map, playerMode: false, planetView: false, objectView: true });
  assert.match(objectInspector, /data-action="inspect-system"/);
  assert.match(objectInspector, /gmf-navigation-icon--planet/);
  const inspectorWithoutNotes = details({ system: normalizeSystem({ name: "No Notes", notes: "   " }), map: context.map, playerMode: false, planetView: false });
  assert.doesNotMatch(inspectorWithoutNotes, /GM Notes|No GM notes/);
  assert.doesNotMatch(inspector, /Linked Content|Alerts &amp; Signals/);
  const player = template({ ...context, playerMode: true, map: { title: "Test", canEdit: false } });
  assert.doesNotMatch(player, /SECRET|data-planet-preset|Compare appearance|data-action="edit-system"/);
  assert.match(player, /data-planet-canvas/);
});

test("every marker style has an SVG with the layer ids the template uses", () => {
  const expectedLayers = {
    planet: ["back", "base", "surface", "terrain-strip", "cloud-strip", "highlight", "accent"],
    terrestrial: ["back", "base", "ocean", "terrain-strip", "terrain-detail-strip", "cloud-strip", "highlight", "accent"],
    "gas-giant": ["back", "base", "surface", "bands-strip", "bands-detail-strip", "storm-strip", "highlight", "accent"],
    "ice-world": ["back", "base", "surface", "ice-sheet-strip", "crack-strip", "frost", "highlight"],
    volcanic: ["back", "base", "surface", "crust-strip", "fissure-strip", "lava-glow", "smoke-strip", "highlight", "accent"],
    artificial: ["back", "base", "surface", "panel-strip", "circuit-strip", "rim", "highlight"],
    ringed: ["ring-back", "back", "base", "surface", "ring-front", "highlight", "accent"],
    star: ["glow", "corona-outer", "corona-inner", "core", "core-detail", "flares", "highlight", "accent"],
    "black-hole": ["glow", "accretion-back", "event-horizon", "photon-ring", "accretion-front"],
    station: ["glow", "outer-ring", "inner-ring", "spokes", "body", "hub", "core"],
    diamond: ["glow", "body", "facet-dark", "facet-mid", "facet-light", "core", "highlight", "accent"],
    void: ["glow", "outer-distortion", "outer-ring", "inner-ring", "void-core", "particles", "distortion-lines", "highlight", "accent"]
  };
  assert.deepEqual([...ANIMATED_CELESTIAL_STYLES].sort(), Object.keys(expectedLayers).sort());
  for (const [style, layers] of Object.entries(expectedLayers)) {
    const svg = read(`assets/celestial-icons/${style}.svg`);
    assert.match(svg, /viewBox="0 0 100 100"/);
    assert.match(svg, /currentColor/);
    for (const layer of layers) assert.match(svg, new RegExp(`id="${layer}"`), `${style} is missing ${layer}`);
  }
});

test("every marker style renders layers from its own SVG file", () => {
  const template = Handlebars.compile(read("templates/celestial-icon.hbs"));
  for (const style of ANIMATED_CELESTIAL_STYLES) {
    const icon = template({ system: { iconStyle: style } });
    assert.match(icon, new RegExp(`celestial-icons/${style}\\.svg#`));
    assert.match(icon, /gmf-art/);
  }
});

