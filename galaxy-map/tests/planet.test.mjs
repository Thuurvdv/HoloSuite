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
  const retiredGenerated = normalizeSystem({ planetPreset: 'generated', planetGeneratedSeed: 42 });
  assert.equal(retiredGenerated.planetPreset, 'auto');
  assert.equal('planetGeneratedSeed' in retiredGenerated, false);
  assert.equal(normalizeSystem({ planetShape: 'unsupported' }).planetShape, 'sphere');
  assert.deepEqual(PLANET_SHAPE_OPTIONS.map(shape => shape.value), ['sphere', 'cube', 'donut', 'asteroid', 'crystal', 'cylinder']);
});
test('custom textures and flat colors produce the requested saved appearance', () => {
  const system = normalizeSystem({ planetTexture: 'worlds/custom.jpg' });
  assert.equal(system.planetPreset, 'custom');
  const before = JSON.stringify(system);
  assert.equal(getPlanetAppearance(system).texture, 'worlds/custom.jpg');
  for (const preset of PLANET_PRESETS) assert.ok(getPlanetAppearance(system, preset.value).texture.endsWith(`${preset.value}.png`));
  assert.equal(JSON.stringify(system), before);
  assert.ok(getPlanetAppearance({ ...system, planetTexture: '' }).texture.endsWith('cartoon.png'));
  assert.equal(getPlanetAppearance({ ...system, planetShape: 'cube' }).shape, 'cube');
  const flat = normalizeSystem({ planetPreset: 'color', planetColor: '#123abc', planetTexture: 'unused.webp', type: 'station' });
  assert.equal(flat.planetPreset, 'color');
  assert.equal(flat.planetColor, '#123abc');
  assert.equal(getPlanetAppearance(flat).texture, null);
  assert.equal(getPlanetAppearance(flat).color, '#123abc');
});
test('every visible system type automatically offers a detail model unless explicitly disabled', () => {
  assert.equal(getPlanetAppearance({ ...normalizeSystem({}), obscured: true }), null);
  assert.ok(getPlanetAppearance(normalizeSystem({ type: 'station' })));
  assert.ok(getPlanetAppearance(normalizeSystem({ type: 'anomaly', iconStyle: 'black-hole' })));
  assert.equal(getPlanetAppearance(normalizeSystem({ planetPreset: 'none', planetTexture: 'private.png' })), null);
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
  assert.match(renderer, /TextureLoader/);
  assert.match(read('src/main.ts'), /name="planetShape"/);
});
test('the Custom appearance reveals a live, shape-aware texture guide', () => {
  const main = read('src/main.ts');
  const css = read('styles/galaxy-map-manager.css');
  assert.doesNotMatch(main, /data-toggle-texture-upload/);
  assert.match(read('src/planet-presets.ts'), /value:\s*"custom"/);
  assert.match(main, /appearanceInput\?\.value === "custom"/);
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
  assert.match(main, /width = 700/);
});
test('Flat color exposes a color picker and renders without a texture', () => {
  const main = read('src/main.ts');
  const renderer = read('src/planet-renderer.ts');
  assert.match(read('src/planet-presets.ts'), /value:\s*"color"/);
  assert.match(main, /type="color" name="planetColor"/);
  assert.match(main, /data-color-appearance-fields/);
  assert.match(renderer, /if \(!path\)[\s\S]*material\.map = null/);
  assert.match(renderer, /material\.color\.set\(path \? "#ffffff" : color\)/);
});
test('system creation is purpose-built while editing uses non-sequential workspaces', () => {
  const main = read('src/main.ts');
  const css = read('styles/galaxy-map-manager.css');
  const createStart = main.indexOf('if (creating) return');
  const editStart = main.indexOf('<form class="gmf-crud-form gmf-system-form gmf-system-form--edit', createStart);
  const createMarkup = main.slice(createStart, editStart);
  assert.doesNotMatch(main, /data-system-wizard|data-wizard-step|data-wizard-next/);
  assert.doesNotMatch(css, /gmf-wizard-progress|gmf-wizard-step/);
  assert.match(main, /getSystemDialogContent\([^\n]+defaults, !system\)/);
  assert.match(createMarkup, /gmf-system-form--create/);
  assert.match(createMarkup, /Name[\s\S]*Type[\s\S]*getMarkerComposerMarkup\([^\n]+quick: true[\s\S]*More options/);
  assert.doesNotMatch(createMarkup, /name="description"|name="planetPreset"|name="sceneIds"|name="journalId"|name="notes"/);
  assert.match(main, /data-system-editor-tab="overview"[\s\S]*data-system-editor-tab="planet"[\s\S]*data-system-editor-tab="content"/);
  assert.match(main, /data-system-editor-panel="planet"[\s\S]*planetWorkspace/);
  assert.match(main, /data-linked-documents/);
  assert.match(main, /data-document-search/);
  assert.match(main, /matches\.slice\(0, 50\)/);
  assert.match(main, /positionDocumentPicker/);
  assert.match(main, /addEventListener\("pointerdown"/);
  assert.match(main, /event\.key !== "Escape"/);
  assert.match(main, /event\.key === "Enter"/);
  assert.match(main, /closeDocumentPicker\(true\)/);
  assert.match(main, /height: system \? Math\.min\(760/);
  assert.match(main, /renderTemplate\(`\$\{TEMPLATE_ROOT\}\/celestial-icon\.hbs`/);
  assert.match(main, /width: system \? 860 : 540/);
  assert.match(css, /\.gmf-crud-dialog \.dialog-buttons[\s\S]*justify-content: flex-end/);
  assert.match(css, /\.gmf-document-picker \{[\s\S]*position: fixed;[\s\S]*z-index: 10000/);
  assert.match(css, /\.gmf-system-edit-dialog \.window-content \{[\s\S]*grid-template-rows: minmax\(0, 1fr\) auto;[\s\S]*overflow: hidden/);
  assert.match(css, /\.gmf-system-edit-dialog \.gmf-system-editor-panel \{[\s\S]*overflow-y: auto/);
  assert.match(main, /gmf-content-section[\s\S]*Linked Scenes[\s\S]*Linked Journal[\s\S]*GM Notes/);
});
test('the retired generated-texture flow is absent', () => {
  const source = [read('src/main.ts'), read('src/planet-presets.ts'), read('src/galaxy-model.ts'), read('src/view-app.ts'), read('src/planet-renderer.ts')].join('\n');
  assert.doesNotMatch(source, /planetGenerated|generated-texture|createGeneratedTextureCanvas|data-generated-texture/);
});
test('system detail supports every system type without duplicate inspector content or appearance comparison', () => {
  const template = Handlebars.compile(read('templates/galaxy-map.hbs'));
  const details = Handlebars.compile(read('templates/system-details.hbs'));
  const system = { ...normalizeSystem({ type: 'station' }), displayName: 'Test Station', displayDescription: 'Survey', notes: 'SECRET', canInspectSystem: true };
  const context = { planetView: true, planetSystem: system, planetAppearance: getPlanetAppearance(system), map: { title: 'Test', canEdit: true }, playerMode: false };
  const gm = template(context);
  assert.match(gm, /data-action="back-to-galaxy"/);
  assert.match(gm, /SECRET/);
  assert.match(gm, /Linked Content/);
  assert.doesNotMatch(gm, /data-planet-preset|Compare appearance|Alerts &amp; Signals|data-action="inspect-system"/);
  const inspector = details({ system, map: context.map, playerMode: false, planetView: false });
  assert.match(inspector, /data-action="inspect-system"/);
  assert.doesNotMatch(inspector, /Linked Content|Alerts &amp; Signals/);
  const player = template({ ...context, playerMode: true, map: { title: 'Test', canEdit: false } });
  assert.doesNotMatch(player, /SECRET|data-planet-preset|Compare appearance|data-action="edit-system"/);
  assert.match(player, /data-planet-canvas/);
});
