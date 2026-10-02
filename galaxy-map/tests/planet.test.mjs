import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import Handlebars from 'handlebars';
import { ANIMATED_CELESTIAL_STYLES, normalizeMap, normalizePlanetLocation, normalizeSystem, normalizeSystemObject } from '../src/galaxy-model.ts';
import { getPlanetAppearance, getPlanetOptionsForShape, isDefaultStaticPlanetAppearance, normalizePlanetPresetForShape, PLANET_FINISH_OPTIONS, PLANET_OPTIONS, PLANET_PRESETS, PLANET_SHAPE_OPTIONS } from '../src/planet-presets.ts';

globalThis.foundry = { utils: { randomID: () => 'test-id' } };
const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
Handlebars.registerHelper('gmfEq', (a,b) => a === b);
Handlebars.registerHelper('gmfFallback', (a,b) => a || b);
Handlebars.registerHelper('gmfPercent', a => `${a}%`);
for (const name of ['system-details', 'celestial-icon']) Handlebars.registerPartial(`modules/galaxy-map/templates/${name}.hbs`, read(`templates/${name}.hbs`));

test('old maps gain the Ice Planet preset; custom textures survive JSON round trips', () => {
  assert.equal(normalizeSystem({}).planetPreset, 'ice');
  assert.equal(normalizeSystem({}).planetShape, 'sphere');
  const map = normalizeMap({ systems: [{ id: 'p', planetPreset: 'legacy-preset', planetShape: 'donut', planetTexture: ' worlds/My World/planet.webp ' }] });
  const roundTrip = normalizeMap(JSON.parse(JSON.stringify(map)));
  assert.equal(roundTrip.systems[0].planetTexture, 'worlds/My World/planet.webp');
  assert.equal(roundTrip.systems[0].planetPreset, 'custom');
  assert.equal(roundTrip.systems[0].planetShape, 'donut');
  assert.equal(normalizeSystem({ planetPreset: 'unsupported' }).planetPreset, 'ice');
  const retiredGenerated = normalizeSystem({ planetPreset: 'generated', planetGeneratedSeed: 42 });
  assert.equal(retiredGenerated.planetPreset, 'ice');
  assert.equal(normalizeSystem({ planetPreset: 'auto' }).planetPreset, 'ice');
  assert.equal(PLANET_OPTIONS[0].value, 'ice');
  assert.equal(PLANET_OPTIONS.some(option => option.value === 'auto'), false);
  assert.equal(PLANET_OPTIONS.some(option => option.value === 'sun'), true);
  assert.equal(PLANET_OPTIONS.some(option => option.value === 'techno'), true);
  assert.equal(PLANET_OPTIONS.some(option => option.value === 'cube'), true);
  assert.equal('planetGeneratedSeed' in retiredGenerated, false);
  assert.equal(normalizeSystem({ planetShape: 'unsupported' }).planetShape, 'sphere');
  assert.deepEqual(PLANET_SHAPE_OPTIONS.map(shape => shape.value), ['sphere', 'cube', 'donut', 'asteroid', 'crystal', 'cylinder']);
});
test('appearance choices follow shape compatibility while universal choices remain available', () => {
  const universal = ['color', 'custom', 'none'];
  const values = shape => getPlanetOptionsForShape(shape).map(option => option.value);
  const sphere = values('sphere');
  for (const preset of ['techno', 'gas-giant', 'volcanic', 'black-hole', 'asteroid']) assert.ok(sphere.includes(preset));
  for (const preset of ['prison', 'anomaly', 'cube', 'donut-planet']) assert.equal(sphere.includes(preset), false);
  assert.deepEqual(values('cube'), ['cube', ...universal]);
  assert.deepEqual(values('donut'), ['donut-planet', ...universal]);
  assert.deepEqual(values('asteroid'), ['asteroid', ...universal]);
  assert.deepEqual(values('crystal'), ['anomaly', ...universal]);
  assert.deepEqual(values('cylinder'), ['prison', ...universal]);
  assert.equal(normalizePlanetPresetForShape('ice', 'cube'), 'cube');
  assert.equal(normalizePlanetPresetForShape('custom', 'cube'), 'custom');
  assert.equal(normalizeSystemObject({ planetShape: 'crystal', planetPreset: 'ice' }).planetPreset, 'anomaly');
});
test('custom textures and flat colors produce the requested saved appearance', () => {
  const system = normalizeSystem({ planetTexture: 'worlds/custom.jpg' });
  assert.equal(system.planetPreset, 'custom');
  const before = JSON.stringify(system);
  assert.equal(getPlanetAppearance(system).texture, 'worlds/custom.jpg');
  for (const preset of PLANET_PRESETS) assert.ok(getPlanetAppearance(system, preset.value).texture.endsWith(preset.texture));
  assert.equal(JSON.stringify(system), before);
  assert.ok(getPlanetAppearance({ ...system, planetTexture: '' }).texture.endsWith('Ice-planet.webp'));
  assert.equal(getPlanetAppearance({ ...system, planetShape: 'cube' }).shape, 'cube');
  const flat = normalizeSystem({ planetPreset: 'color', planetColor: '#123abc', planetTexture: 'unused.webp', type: 'station' });
  assert.equal(flat.planetPreset, 'color');
  assert.equal(flat.planetColor, '#123abc');
  assert.equal(getPlanetAppearance(flat).texture, null);
  assert.equal(getPlanetAppearance(flat).color, '#123abc');
  assert.equal(getPlanetAppearance(normalizeSystem({ planetPreset: 'sun' })).preset, 'sun');
  assert.equal(getPlanetAppearance(normalizeSystem({ planetPreset: 'black-hole' })).preset, 'black-hole');
});
test('every visible system type automatically offers a detail model unless explicitly disabled', () => {
  assert.equal(getPlanetAppearance({ ...normalizeSystem({}), obscured: true }), null);
  assert.ok(getPlanetAppearance(normalizeSystem({ type: 'station' })));
  assert.ok(getPlanetAppearance(normalizeSystem({ type: 'anomaly', iconStyle: 'black-hole' })));
  assert.equal(getPlanetAppearance(normalizeSystem({ planetPreset: 'none', planetTexture: 'private.png' })), null);
});
test('Black Hole defaults to a flat preview while retaining the shared 3D toggle', () => {
  assert.equal(isDefaultStaticPlanetAppearance('black-hole'), true);
  assert.equal(isDefaultStaticPlanetAppearance('sun'), false);
  const view = read('src/view-app.ts');
  const template = read('templates/galaxy-map.hbs');
  assert.match(view, /planetStaticViewKey[\s\S]*isDefaultStaticPlanetAppearance/);
  assert.match(view, /data-action='planet-static'[\s\S]*planetStatic = !this\.planetStatic/);
  assert.match(template, /data-action="planet-static"/);
  assert.match(view, /dataset\.planetPreset = appearance\.preset/);
  assert.match(read('styles/planet-view.css'), /data-planet-preset="black-hole"[\s\S]*0 0 0 2px rgba\(221, 83, 10, 0\.9\)/);
});
test('all bundled object textures exist and use their supported atlas ratio', () => {
  for (const preset of PLANET_PRESETS) {
    const bytes = fs.readFileSync(new URL(`../assets/planets/${preset.texture}`, import.meta.url));
    assert.equal(bytes.toString('ascii', 12, 16), 'VP8X');
    const width = bytes.readUIntLE(24, 3) + 1;
    const height = bytes.readUIntLE(27, 3) + 1;
    if (preset.value === 'prison') assert.equal(width, height);
    else if (preset.value === 'cube') assert.equal(width * 3, height * 4);
    else assert.equal(width, height * 2);
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
  assert.match(renderer, /createAppearanceGlow/);
  assert.match(renderer, /rgba\(255, 201, 54, 0\.58\)/);
  assert.match(renderer, /rgba\(221, 83, 10, 0\.96\)/);
  assert.doesNotMatch(renderer, /atmosphereMaterial|ShaderMaterial|AdditiveBlending/);
  assert.match(read('src/main.ts'), /name="planetShape"/);
});
test('the Custom appearance reveals a live, shape-aware texture guide', () => {
  const main = read('src/main.ts');
  const css = read('styles/galaxy-map-manager.css');
  const overlay = read('templates/object-appearance-panel.hbs');
  const viewCss = read('styles/galaxy-map-view.css');
  assert.doesNotMatch(main, /data-toggle-texture-upload/);
  assert.match(read('src/planet-presets.ts'), /value:\s*"custom"/);
  assert.match(main, /appearanceInput\?\.value === "custom"/);
  assert.match(main, /data-texture-guide-preview/);
  assert.match(overlay, /Visual wizard[\s\S]*data-panel-marker-preview[\s\S]*appearanceGuideMarkup/);
  assert.match(overlay, /form="gmf-panel-editor-form"/);
  assert.match(viewCss, /\.gmf-object-appearance-panel \{[\s\S]*right: 366px;[\s\S]*background: rgb\(2, 12, 20\)/);
  assert.match(main, /preview\.src = path/);
  assert.match(main, /preview\.onerror/);
  assert.match(main, /Outer bend · 0%/);
  assert.match(main, /Inner bend · 50%/);
  assert.match(main, /upper triangle sits directly above its matching lower triangle/);
  assert.doesNotMatch(main, /Their bases meet exactly|top at x=|bottom at x=|center seam y=512|NO GAP/);
  assert.match(read('src/planet-renderer.ts'), /facePairs = \[\[0, 1\], \[3, 2\], \[4, 5\], \[7, 6\]\]/);
  for (const shape of PLANET_SHAPE_OPTIONS.map(option => option.value)) {
    assert.match(main, new RegExp(`data-guide-shape="${shape}"`));
    assert.match(css, new RegExp(`data-shape="${shape}"`));
  }
  assert.match(css, /gmf-uv-map--cube/);
  assert.match(css, /gmf-uv-map--cylinder/);
  assert.match(css, /gmf-uv-map--crystal/);
  assert.match(css, /aspect-ratio:\s*2\s*\/\s*1/);
  assert.match(read('src/view-app.ts'), /activateObjectEditorControls\(appearancePanel\)/);
});
test('Flat color exposes a color picker and renders without a texture', () => {
  const main = read('src/main.ts');
  const renderer = read('src/planet-renderer.ts');
  assert.match(read('src/planet-presets.ts'), /value:\s*"color"/);
  assert.match(main, /type="color" name="planetColor"/);
  assert.match(main, /colorInput\.disabled = appearanceInput\?\.value !== "color"/);
  assert.match(main, /shapeInput\.disabled = noDetail/);
  assert.match(main, /finishInput\.disabled = noDetail/);
  assert.match(renderer, /if \(!path\)[\s\S]*material\.map = null/);
  assert.match(renderer, /material\.color\.set\(path \? "#ffffff" : color\)/);
});
test('system editing stays focused on the galaxy region while entity editing owns physical details', () => {
  const main = read('src/main.ts');
  const css = read('styles/galaxy-map-manager.css');
  const details = read('templates/system-details.hbs');
  const appearance = read('templates/object-appearance-panel.hbs');
  assert.doesNotMatch(main, /data-system-wizard|data-wizard-step|data-wizard-next/);
  assert.doesNotMatch(css, /gmf-wizard-progress|gmf-wizard-step/);
  assert.match(details, /creation\.isSystem[\s\S]*name="name"[\s\S]*name="status"[\s\S]*name="visibility"[\s\S]*name="description"/);
  assert.match(details, /Recommended: 4096×2304 WebP \(16:9\), or at least 3840 px wide/);
  assert.match(appearance, /name="planetPreset"[\s\S]*name="planetShape"[\s\S]*name="planetFinish"/);
  assert.match(read('src/view-app.ts'), /openEditor\(kind: string[\s\S]*_openCreationPanel/);
  assert.match(main, /data-linked-documents/);
  assert.match(main, /data-document-search/);
  assert.match(main, /matches\.slice\(0, 50\)/);
  assert.match(main, /positionDocumentPicker/);
  assert.match(main, /addEventListener\("pointerdown"/);
  assert.match(main, /event\.key !== "Escape"/);
  assert.match(main, /event\.key === "Enter"/);
  assert.match(main, /closeDocumentPicker\(true\)/);
  assert.match(main, /renderTemplate\(`\$\{TEMPLATE_ROOT\}\/celestial-icon\.hbs`/);
  assert.match(css, /\.gmf-crud-dialog \.dialog-buttons[\s\S]*justify-content: flex-end/);
  assert.match(css, /\.gmf-document-picker \{[\s\S]*position: fixed;[\s\S]*z-index: 10000/);
  assert.match(main, /gmf-object-form[\s\S]*Entity type[\s\S]*Detail view[\s\S]*Linked content[\s\S]*GM notes/);
});
test('the retired generated-texture flow is absent', () => {
  const source = [read('src/main.ts'), read('src/planet-presets.ts'), read('src/galaxy-model.ts'), read('src/view-app.ts'), read('src/planet-renderer.ts')].join('\n');
  assert.doesNotMatch(source, /planetGenerated|generated-texture|createGeneratedTextureCanvas|data-generated-texture/);
});

test('surface finishes persist on objects and configure the detail renderer', () => {
  const object = normalizeSystemObject({ planetFinish: 'holographic' });
  assert.equal(object.planetFinish, 'holographic');
  assert.equal(normalizeSystemObject({ planetFinish: 'unsupported' }).planetFinish, 'smooth');
  assert.deepEqual(PLANET_FINISH_OPTIONS.map(finish => finish.value), ['smooth', 'matte', 'holographic']);
  assert.equal(getPlanetAppearance(object).finish, 'holographic');
  const renderer = read('src/planet-renderer.ts');
  assert.match(renderer, /finish === "holographic"[\s\S]*new MeshBasicMaterial/);
  assert.match(renderer, /gmfScan/);
  assert.match(read('src/main.ts'), /name="planetFinish"/);
  assert.doesNotMatch(read('templates/object-appearance-panel.hbs'), /name="planetDetailStrength"/);
});

test('surface locations belong to objects, are shape-local, bounded, and normalized', () => {
  const location = normalizePlanetLocation({ sceneId: 'scene-a', shape: 'donut', position: [0.2, -0.4, 0.8], normal: [0, 0, 4] });
  assert.deepEqual(location.normal, [0, 0, 1]);
  assert.equal(location.surfaceVersion, 1);
  const object = normalizeSystemObject({ sceneIds: ['scene-a'], planetLocations: [location, { ...location, id: 'duplicate' }] });
  assert.equal(object.planetLocations.length, 1);
  assert.deepEqual(normalizeSystemObject(JSON.parse(JSON.stringify(object))).planetLocations, object.planetLocations);
  assert.equal(normalizeSystemObject({ sceneIds: [], planetLocations: [location] }).planetLocations.length, 0);
  const migrated = normalizeMap({ systems: [{ id: 'legacy', sceneIds: ['scene-a'], planetLocations: [location] }] });
  assert.equal(migrated.systems[0].objects[0].planetLocations[0].sceneId, 'scene-a');
  const source = read('src/planet-renderer.ts');
  assert.match(source, /InstancedMesh/);
  assert.match(source, /markerHitMesh[\s\S]*computeBoundingSphere/);
  assert.match(source, /intersectObject\(markerHitMesh/);
  assert.match(source, /onLocationDrop/);
});

test('3D locations expose object-scene dragging, permission checks, and accessible controls', () => {
  const template = read('templates/galaxy-map.hbs');
  const details = read('templates/system-details.hbs');
  const view = read('src/view-app.ts');
  const renderer = read('src/planet-renderer.ts');
  const main = read('src/main.ts');
  const css = read('styles/planet-view.css');
  for (const marker of ['data-linked-content-drop', 'data-planet-scene-drag', 'data-unlink-planet-scene']) assert.match(details, new RegExp(marker));
  assert.doesNotMatch(template, /gmf-planet-locations|data-planet-location-list|data-planet-location-trash/);
  assert.match(view, /getDragEventData/);
  assert.match(view, /resolveDroppedDocument[\s\S]*JournalEntry/);
  assert.match(view, /upsertObject\(this\.mapId, this\.activeSystemId/);
  assert.match(view, /testUserPermission\?\.\(game\.user, "OBSERVER"\)/);
  assert.match(view, /Link .* to the object before placing it on the surface/);
  assert.match(view, /onMarkerContextMenu/);
  assert.match(renderer, /"contextmenu"[\s\S]*onMarkerContextMenu/);
  assert.match(main, /savePlanetLocation\(mapId, systemId, objectId/);
  assert.match(main, /action: "planet-locations", mapId, systemId, objectId/);
  assert.match(main, /Restored \$\{recovered\} planet surface location/);
  assert.match(css, /is-location-dragover/);
  assert.match(css, /gmf-location-callout__connector[\s\S]*var\(--gmf-cyan\)/);
});
test('system detail supports every system type without duplicate inspector content or appearance comparison', () => {
  const template = Handlebars.compile(read('templates/galaxy-map.hbs'));
  const details = Handlebars.compile(read('templates/system-details.hbs'));
  const system = { ...normalizeSystem({ type: 'station' }), displayName: 'Test Station', displayDescription: 'Survey', notes: 'SECRET', canInspectSystem: true };
  const context = { planetView: true, activeSystem: { name: 'Test System' }, planetSystem: system, planetAppearance: getPlanetAppearance(system), map: { title: 'Test', canEdit: true }, playerMode: false };
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
  const inspectorWithoutNotes = details({ system: normalizeSystem({ name: 'No Notes', notes: '   ' }), map: context.map, playerMode: false, planetView: false });
  assert.doesNotMatch(inspectorWithoutNotes, /GM Notes|No GM notes/);
  assert.doesNotMatch(inspector, /Linked Content|Alerts &amp; Signals/);
  const player = template({ ...context, playerMode: true, map: { title: 'Test', canEdit: false } });
  assert.doesNotMatch(player, /SECRET|data-planet-preset|Compare appearance|data-action="edit-system"/);
  assert.match(player, /data-planet-canvas/);
});

test('every selectable marker style has a standardized layered SVG', () => {
  const expectedLayers = {
    planet: ['back', 'base', 'surface', 'terrain-strip', 'cloud-strip', 'highlight', 'accent'],
    terrestrial: ['back', 'base', 'ocean', 'terrain-strip', 'terrain-detail-strip', 'cloud-strip', 'highlight', 'accent'],
    'gas-giant': ['back', 'base', 'surface', 'bands-strip', 'bands-detail-strip', 'storm-strip', 'highlight', 'accent'],
    'ice-world': ['back', 'base', 'surface', 'ice-sheet-strip', 'crack-strip', 'frost', 'highlight'],
    volcanic: ['back', 'base', 'surface', 'crust-strip', 'fissure-strip', 'lava-glow', 'smoke-strip', 'highlight', 'accent'],
    artificial: ['back', 'base', 'surface', 'panel-strip', 'circuit-strip', 'rim', 'highlight'],
    ringed: ['ring-back', 'back', 'base', 'surface', 'ring-front', 'highlight', 'accent'],
    star: ['glow', 'corona-outer', 'corona-inner', 'core', 'core-detail', 'flares', 'highlight', 'accent'],
    'black-hole': ['glow', 'accretion-back', 'event-horizon', 'photon-ring', 'accretion-front'],
    station: ['glow', 'outer-ring', 'inner-ring', 'spokes', 'body', 'hub', 'core'],
    diamond: ['glow', 'body', 'facet-dark', 'facet-mid', 'facet-light', 'core', 'highlight', 'accent'],
    void: ['glow', 'outer-distortion', 'outer-ring', 'inner-ring', 'void-core', 'particles', 'distortion-lines', 'highlight', 'accent']
  };
  assert.deepEqual([...ANIMATED_CELESTIAL_STYLES].sort(), Object.keys(expectedLayers).sort());
  for (const [style, layers] of Object.entries(expectedLayers)) {
    const svg = read(`assets/celestial-icons/${style}.svg`);
    assert.match(svg, /viewBox="0 0 100 100"/);
    assert.match(svg, /currentColor/);
    for (const layer of layers) assert.match(svg, new RegExp(`id="${layer}"`), `${style} is missing ${layer}`);
  }
});

test('every marker template references its external SVG and code-owned animation layers', () => {
  const template = Handlebars.compile(read('templates/celestial-icon.hbs'));
  for (const style of ANIMATED_CELESTIAL_STYLES) {
    const icon = template({ system: { iconStyle: style } });
    assert.match(icon, new RegExp(`celestial-icons/${style}\\.svg#`));
    assert.match(icon, /gmf-art/);
  }
  const css = read('styles/galaxy-map-view.css');
  assert.match(css, /gmf-art--primary[\s\S]*gmf-art-spin--slow[\s\S]*gmf-art-drift--clouds/);
  assert.match(read('styles/galaxy-map-effects.css'), /gmf-art-pulse[\s\S]*animation: none !important/);
});

test('layered SVG markers do not render legacy center glyphs or non-planet frames', () => {
  const mapTemplate = read('templates/galaxy-map.hbs');
  const detailsTemplate = read('templates/system-details.hbs');
  const css = read('styles/galaxy-map-view.css');
  assert.match(mapTemplate, /unless system\.animatedCelestial[^]*gmf-system__type-glyph/);
  assert.match(detailsTemplate, /unless system\.animatedCelestial[^]*gmf-system__type-glyph/);
  assert.match(css, /\.gmf-celestial__frame \{ display: none; \}/);
});

test('standardized planet bodies seal their edge without marker-colored circles', () => {
  const css = read('styles/galaxy-map-view.css');
  const template = read('templates/celestial-icon.hbs');
  assert.match(css, /gmf-system-layer > button\.gmf-system[\s\S]*width: var\(--gmf-system-size, 28px\) !important;[\s\S]*height: var\(--gmf-system-size, 28px\) !important;[\s\S]*aspect-ratio: 1 \/ 1/);
  assert.match(template, /class="gmf-celestial__frame" cx="50" cy="50" r="48\.75" fill="none"/);
  assert.match(css, /gmf-celestial--artificial[\s\S]*overflow: hidden;[\s\S]*border: 0;[\s\S]*background: transparent;[\s\S]*box-shadow: none/);
  assert.match(css, /gmf-celestial--artificial[\s\S]*gmf-celestial__frame[\s\S]*stroke: rgba\(255, 255, 255, 0\.16\);[\s\S]*vector-effect: non-scaling-stroke/);
  assert.match(css, /gmf-celestial--artificial[\s\S]*gmf-art--surface[\s\S]*transform: scale\(1\.11\)/);
  assert.match(css, /gmf-celestial--artificial[\s\S]*::after \{ display: none; \}/);
  assert.match(css, /gmf-system-layer \.gmf-system:is\([\s\S]*gmf-icon--artificial[\s\S]*box-shadow: none/);
  assert.match(css, /gmf-system-layer \.gmf-system \.gmf-celestial \{ box-shadow: none; \}/);
  assert.doesNotMatch(css, /gmf-icon--ringed[\s\S]*gmf-system__selection\)[\s\S]*display: none/);
  assert.match(css, /gmf-icon--ringed[\s\S]*\) \.gmf-system__halo \{ display: none; \}/);
  assert.match(css, /gmf-celestial--ringed[\s\S]*\) \{[\s\S]*box-shadow: none;/);
  assert.match(css, /gmf-system\.is-selected \.gmf-celestial:is\([\s\S]*gmf-celestial--planet[\s\S]*gmf-celestial--ringed[\s\S]*box-shadow: 0 0 10px/);
  assert.match(css, /gmf-icon--planet[\s\S]*gmf-icon--void[\s\S]*\.gmf-system__type-glyph \{ display: none; \}/);
});
