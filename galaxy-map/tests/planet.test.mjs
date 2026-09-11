import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import Handlebars from 'handlebars';
import { normalizeMap, normalizeSystem } from '../src/galaxy-model.ts';
import { getPlanetAppearance, PLANET_PRESETS, PLANET_SHAPE_OPTIONS } from '../src/planet-presets.ts';

globalThis.foundry = { utils: { randomID: () => 'test-id' } };
const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
Handlebars.registerHelper('gmfEq', (a,b) => a === b);
Handlebars.registerHelper('gmfFallback', (a,b) => a || b);
Handlebars.registerHelper('gmfPercent', a => `${a}%`);
for (const name of ['system-details', 'celestial-icon']) Handlebars.registerPartial(`modules/galaxy-map/templates/${name}.hbs`, read(`templates/${name}.hbs`));

test('old maps gain automatic planet presets; custom textures survive JSON round trips', () => {
  assert.equal(normalizeSystem({}).planetPreset, 'auto');
  assert.equal(normalizeSystem({}).planetShape, 'sphere');
  const map = normalizeMap({ systems: [{ id: 'p', planetPreset: 'adventure', planetShape: 'donut', planetTexture: ' worlds/My World/planet.webp ' }] });
  const roundTrip = normalizeMap(JSON.parse(JSON.stringify(map)));
  assert.equal(roundTrip.systems[0].planetTexture, 'worlds/My World/planet.webp');
  assert.equal(roundTrip.systems[0].planetPreset, 'custom');
  assert.equal(roundTrip.systems[0].planetShape, 'donut');
  assert.equal(normalizeSystem({ planetPreset: 'unsupported' }).planetPreset, 'auto');
  assert.equal(normalizeSystem({ planetShape: 'unsupported' }).planetShape, 'sphere');
  assert.deepEqual(PLANET_SHAPE_OPTIONS.map(shape => shape.value), ['sphere', 'cube', 'donut', 'asteroid', 'crystal', 'cylinder']);
});
test('custom textures override presets, comparisons do not mutate saved appearance', () => {
  const system = normalizeSystem({ planetTexture: 'worlds/custom.jpg' });
  assert.equal(system.planetPreset, 'custom');
  const before = JSON.stringify(system);
  assert.equal(getPlanetAppearance(system).texture, 'worlds/custom.jpg');
  for (const preset of PLANET_PRESETS) assert.ok(getPlanetAppearance(system, preset.value).texture.endsWith(`${preset.value}.png`));
  assert.equal(JSON.stringify(system), before);
  assert.ok(getPlanetAppearance({ ...system, planetTexture: '' }).texture.endsWith('cartoon.png'));
  assert.equal(getPlanetAppearance({ ...system, planetShape: 'cube' }).shape, 'cube');
});
test('obscured and non-planet entries do not automatically offer a planet', () => {
  assert.equal(getPlanetAppearance({ ...normalizeSystem({}), obscured: true }), null);
  assert.equal(getPlanetAppearance(normalizeSystem({ type: 'station' })), null);
  assert.equal(getPlanetAppearance(normalizeSystem({ iconStyle: 'black-hole' })), null);
  assert.equal(getPlanetAppearance(normalizeSystem({ planetPreset: 'none', planetTexture: 'private.png' })), null);
  assert.ok(getPlanetAppearance(normalizeSystem({ type: 'station', planetPreset: 'adventure' })));
});
test('all bundled planet textures exist and have a 2:1 aspect ratio', () => {
  for (const preset of PLANET_PRESETS) {
    const bytes = fs.readFileSync(new URL(`../assets/planets/${preset.value}.png`, import.meta.url));
    assert.equal(bytes.readUInt32BE(16), bytes.readUInt32BE(20) * 2);
  }
});
test('the 3D renderer supports all configured geometry', () => {
  const renderer = read('src/planet-renderer.ts');
  assert.match(renderer, /SphereGeometry/);
  assert.match(renderer, /BoxGeometry/);
  assert.match(renderer, /TorusGeometry/);
  assert.match(renderer, /IcosahedronGeometry/);
  assert.match(renderer, /OctahedronGeometry/);
  assert.match(renderer, /CylinderGeometry/);
  assert.match(renderer, /remapCubeUvs/);
  assert.match(renderer, /remapCylinderUvs/);
  assert.match(renderer, /remapCrystalUvs/);
  assert.match(read('src/main.ts'), /name="planetShape"/);
});
test('the Custom appearance reveals a live, shape-aware texture guide', () => {
  const main = read('src/main.ts');
  const css = read('styles/galaxy-map-manager.css');
  assert.doesNotMatch(main, /data-toggle-texture-upload/);
  assert.match(read('src/planet-presets.ts'), /value:\s*"custom"/);
  assert.match(main, /appearanceInput\.value === "custom"/);
  assert.match(main, /data-texture-guide-preview/);
  assert.match(main, /preview\.src = path/);
  assert.match(main, /preview could not be loaded/);
  assert.match(main, /Outer bend · 0%/);
  assert.match(main, /Inner bend · 50%/);
  assert.match(main, /Their bases meet exactly at y=512—leave no gap/);
  assert.match(read('src/planet-renderer.ts'), /column \/ 4, 0\.5/);
  for (const shape of PLANET_SHAPE_OPTIONS.map(option => option.value)) {
    assert.match(main, new RegExp(`data-guide-shape="${shape}"`));
    assert.match(css, new RegExp(`data-shape="${shape}"`));
  }
  assert.match(css, /gmf-uv-map--cube/);
  assert.match(css, /gmf-uv-map--cylinder/);
  assert.match(css, /gmf-uv-map--crystal/);
  assert.match(css, /aspect-ratio:\s*2\s*\/\s*1/);
  assert.match(main, /width:\s*700/);
});
test('planet template includes controls and respects GM-only notes and comparison access', () => {
  const template = Handlebars.compile(read('templates/galaxy-map.hbs'));
  const system = { ...normalizeSystem({}), displayName: 'Test Planet', displayDescription: 'Survey', notes: 'SECRET', canInspectPlanet: true };
  const context = { planetView: true, planetSystem: system, planetAppearance: getPlanetAppearance(system), planetPresets: PLANET_PRESETS, map: { title: 'Test', canEdit: true }, playerMode: false };
  const gm = template(context);
  assert.match(gm, /data-planet-preset/);
  assert.match(gm, /data-action="back-to-galaxy"/);
  assert.match(gm, /SECRET/);
  assert.doesNotMatch(gm, /data-action="inspect-planet"/);
  const player = template({ ...context, playerMode: true, map: { title: 'Test', canEdit: false } });
  assert.doesNotMatch(player, /SECRET|data-planet-preset|data-action="edit-system"/);
  assert.match(player, /data-planet-canvas/);
});
