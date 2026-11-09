import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

test('loot range uses the flat scene grid, closest occupied spaces and the receiving actor', async () => {
  const original = globalThis.game;
  let feet;
  globalThis.game = { settings: { get: (_module, key) => key === 'lootRange' ? feet : false }, combats: { contents: [] } };
  try {
    const compiled = await build({ entryPoints: [fileURLToPath(new URL('../src/permissions.ts', import.meta.url))],
      bundle: true, write: false, format: 'esm', platform: 'browser' });
    const { environment, lootRange } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
    const player = { id: 'player' };
    const actor = { uuid: 'Actor.hero', type: 'character', testUserPermission: user => user === player };
    const other = { ...actor, uuid: 'Actor.other' };
    const hero = { id: 'hero', actor, x: 300, y: 0, width: 1, height: 1 };
    const scene = { tokens: [hero], grid: { units: 'ft', size: 100,
      measurePath: ([a, b]) => ({ distance: Math.hypot(a.x - b.x, a.y - b.y) / 20 }) } };
    const corpse = { id: 'corpse', parent: scene, getCenterPoint: () => ({ x: 50, y: 50 }) };
    const adapter = { destination: candidate => candidate.type === 'character' };
    const inRange = recipient => environment(adapter).inRange(corpse, player, recipient);
    assert.equal(lootRange(), 15);
    assert.equal(inRange(), true);
    assert.equal(inRange(other), false);
    assert.equal(inRange(actor), true);
    hero.x = 301;
    assert.equal(inRange(), false);
    feet = 20;
    assert.equal(inRange(), true);
    hero.hidden = true;
    assert.equal(inRange(), false);
    hero.hidden = false;
    hero.actor = { ...actor, testUserPermission: () => false };
    assert.equal(inRange(), false);
    hero.actor = actor;
    feet = 15;
    scene.grid.units = 'm';
    hero.x = 90;
    assert.equal(inRange(), true);
    hero.elevation = 2;
    assert.equal(inRange(), true);
    scene.grid.units = 'ft';
    feet = 4;
    hero.x = 300;
    assert.equal(inRange(), false);
    scene.grid.getCenterPoint = ({ i, j }) => ({ x: (j + .5) * 100, y: (i + .5) * 100, elevation: 50 });
    corpse.getOccupiedGridSpaceOffsets = () => [{ i: 0, j: 0 }, { i: 0, j: 1 }, { i: 0, j: 2 }, { i: 0, j: 3 }];
    hero.getOccupiedGridSpaceOffsets = () => [{ i: 0, j: hero.x / 100 }];
    assert.equal(inRange(), true);
    hero.x = 400;
    assert.equal(inRange(), false);
    feet = 5;
    assert.equal(inRange(), true);
    scene.grid.isSquare = true;
    scene.grid.getOffsetRange = ({ x, y, width, height }) => [
      Math.floor(y / 100), Math.floor(x / 100), Math.ceil((y + height) / 100), Math.ceil((x + width) / 100)
    ];
    Object.assign(corpse, { x: 0, y: 0, width: 4, height: 1,
      getOccupiedGridSpaceOffsets: () => { throw Error('Loot range must not use wall-filtered offsets on square grids'); } });
    feet = 10;
    hero.x = 500;
    assert.equal(inRange(), true);
    hero.x = 600;
    assert.equal(inRange(), false);
    hero._source = { x: 500, y: 0 };
    assert.equal(inRange(), true);
    feet = 0;
    assert.equal(environment(adapter).inRange, undefined);
  } finally { globalThis.game = original; }
});

test('Foundry 14 sight uses the native vision origin and token level', async () => {
  const original = { game: globalThis.game, canvas: globalThis.canvas, CONFIG: globalThis.CONFIG };
  let initialized, destroyed = false;
  const scene = { id: 'scene', tokenVision: true };
  const observer = { id: 'pc', center: { x: 1, y: 2 }, sightRange: 100, lightPerceptionRange: 500, externalRadius: 10,
    actor: { testUserPermission: () => true }, document: { sight: { enabled: true }, level: 'upstairs', elevation: 0,
      getVisionOrigin: () => ({ x: 30, y: 40, elevation: 25 }), hasStatusEffect: () => false } };
  globalThis.game = {};
  globalThis.canvas = { scene, tokens: { placeables: [observer] }, dimensions: { maxR: 500 } };
  globalThis.CONFIG = { specialStatusEffects: {}, Canvas: { visionSourceClass: class {
    los = { contains: () => true }; shape = { contains: () => true };
    initialize(data) { initialized = data; } destroy() { destroyed = true; }
  } } };
  try {
    const compiled = await build({ entryPoints: [fileURLToPath(new URL('../src/permissions.ts', import.meta.url))], bundle: true, write: false, format: 'esm', platform: 'browser' });
    const api = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
    assert.equal(api.visible({ parent: scene, object: { center: { x: 90, y: 90 } }, hasStatusEffect: () => false }, { id: 'player' }), true);
    assert.deepEqual([initialized.x, initialized.y, initialized.elevation, initialized.level], [30, 40, 25, 'upstairs']);
    assert.equal(destroyed, true);
  } finally { Object.assign(globalThis, original); }
});
