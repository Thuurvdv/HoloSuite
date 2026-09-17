import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.foundry = { utils: { randomID: () => 'test-id' } };
const { GALAXY_SCHEMA_VERSION, getEffectiveObjectVisibility, migrateMap, normalizeMap, normalizeSystemObject } = await import('../src/galaxy-model.ts');

test('a legacy map becomes one default system containing its former nodes as entities', () => {
  const legacy = {
    id: 'milky-way', currentSystemId: 'sol',
    systems: [
      { id: 'sol', name: 'Earth', type: 'station', x: 10, y: 20, sceneIds: ['scene-1'], planetTexture: 'earth.webp' },
      { id: 'mars', name: 'Mars', iconStyle: 'planet', x: 70, y: 60 }
    ],
    routes: [{ id: 'earth-mars', fromSystemId: 'sol', toSystemId: 'mars', type: 'safe' }]
  };
  const migrated = normalizeMap(legacy);
  assert.equal(migrated.schemaVersion, GALAXY_SCHEMA_VERSION);
  assert.equal(migrated.systems.length, 1);
  assert.equal(migrated.systems[0].id, 'milky-way-system-1');
  assert.equal(migrated.systems[0].name, 'System 1');
  assert.equal(migrated.systems[0].objects.length, 2);
  assert.equal(migrated.systems[0].objects[0].id, 'sol');
  assert.equal(migrated.systems[0].objects[0].kind, 'station');
  assert.equal(migrated.systems[0].objects[0].x, 10);
  assert.equal(migrated.systems[0].objects[1].x, 70);
  assert.deepEqual(migrated.systems[0].objects[0].sceneIds, ['scene-1']);
  assert.equal(migrated.systems[0].routes.length, 1);
  assert.equal(migrated.systems[0].routes[0].fromSystemId, 'sol');
  assert.equal(migrated.systems[0].routes[0].toSystemId, 'mars');
  assert.deepEqual(migrated.routes, []);
  const persisted = JSON.parse(JSON.stringify(migrated));
  assert.equal('sceneIds' in persisted.systems[0], false);
  assert.deepEqual(persisted.systems[0].objects[0].sceneIds, ['scene-1']);
  assert.equal(migrated.currentLocation.systemId, 'milky-way-system-1');
  assert.equal(migrated.currentLocation.objectId, 'sol');
});

test('migration and normalization are idempotent', () => {
  const once = normalizeMap({ systems: [{ id: 'alpha', name: 'Alpha', iconStyle: 'star' }] });
  const twice = normalizeMap(JSON.parse(JSON.stringify(once)));
  assert.deepEqual(twice, once);
  assert.equal(twice.systems[0].objects.length, 1);
});

test('schema v2 systems created for the real hierarchy remain separate', () => {
  const map = normalizeMap({ schemaVersion: 2, systems: [{
    id: 'sol', name: 'Sol', visibility: 'players', primaryObjectId: 'sun', objects: [
      { id: 'sun', name: 'Sun', kind: 'star', visibility: 'inherit' },
      { id: 'black-site', name: 'Black Site', kind: 'station', visibility: 'gm' }
    ]
  }] });
  assert.equal(map.systems[0].objects.length, 2);
  assert.equal(getEffectiveObjectVisibility(map.systems[0], map.systems[0].objects[0]), 'players');
  assert.equal(getEffectiveObjectVisibility(map.systems[0], map.systems[0].objects[1]), 'gm');
  assert.equal(normalizeSystemObject({ kind: 'moon' }).kind, 'moon');
});

test('the incorrect schema v2 wrapper migration is repaired without losing entity edits', () => {
  const repaired = normalizeMap({
    schemaVersion: 2, id: 'showcase', currentLocation: { systemId: 'earth', objectId: 'earth-object' },
    systems: [
      { id: 'earth', name: 'Earth', x: 12, y: 22, visibility: 'players', factionId: 'alliance', primaryObjectId: 'earth-object', objects: [
        { id: 'earth-object', name: 'Earth', kind: 'planet', x: 50, y: 50, visibility: 'inherit', planetFinish: 'matte' }
      ] },
      { id: 'mars', name: 'Mars', x: 72, y: 62, visibility: 'gm', primaryObjectId: 'mars-object', objects: [
        { id: 'mars-object', name: 'Mars', kind: 'planet', x: 50, y: 50, visibility: 'inherit' }
      ] },
      { id: 'new-system', name: 'New System', primaryObjectId: 'star', objects: [{ id: 'star', kind: 'star' }] }
    ],
    routes: [
      { id: 'old-internal', fromSystemId: 'earth', toSystemId: 'mars' },
      { id: 'external', fromSystemId: 'earth', toSystemId: 'new-system' }
    ]
  });
  assert.equal(repaired.schemaVersion, GALAXY_SCHEMA_VERSION);
  assert.equal(repaired.systems.length, 2);
  assert.equal(repaired.systems[0].name, 'System 1');
  assert.deepEqual(repaired.systems[0].objects.map(object => object.id), ['earth-object', 'mars-object']);
  assert.equal(repaired.systems[0].objects[0].x, 12);
  assert.equal(repaired.systems[0].objects[0].planetFinish, 'matte');
  assert.equal(repaired.systems[0].objects[1].visibility, 'gm');
  assert.equal(repaired.systems[0].routes.length, 1);
  assert.equal(repaired.systems[0].routes[0].fromSystemId, 'earth-object');
  assert.equal(repaired.systems[0].routes[0].toSystemId, 'mars-object');
  assert.equal(repaired.currentLocation.objectId, 'earth-object');
  assert.equal(repaired.routes.length, 1);
  assert.equal(repaired.routes[0].fromSystemId, 'showcase-system-1');
  assert.equal(repaired.routes[0].toSystemId, 'new-system');
});

test('maps without legacy nodes still receive System 1', () => {
  const map = normalizeMap({ id: 'empty-map', systems: [] });
  assert.equal(map.systems.length, 1);
  assert.equal(map.systems[0].name, 'System 1');
  assert.deepEqual(map.systems[0].objects, []);
});

test('newer schemas are rejected instead of losing fields', () => {
  assert.throws(() => migrateMap({ schemaVersion: 99 }), /newer than supported/);
});
