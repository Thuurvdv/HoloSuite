import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTerritories } from '../src/territories.ts';

const factions = [{ id: 'a', name: 'Alliance', color: '#58d8ff' }];
test('unknown contacts and unavailable factions do not create influence regions', () => {
  assert.deepEqual(buildTerritories([{ factionId: 'a', x: 40, y: 50, obscured: true }], factions), []);
  assert.deepEqual(buildTerritories([{ factionId: 'secret', x: 40, y: 50 }], factions), []);
  const known = { factionId: 'a', x: 20, y: 20 };
  assert.deepEqual(buildTerritories([known, { factionId: 'a', x: 90, y: 90, obscured: true }], factions), buildTerritories([known], factions));
});
test('regions handle single systems, duplicate positions, and map edges', () => {
  for (const positions of [[[0, 0]], [[100, 100]], [[50, 50], [50, 50]], [[10, 20], [80, 90]]]) {
    const regions = buildTerritories(positions.map(([x, y]) => ({ factionId: 'a', x, y })), factions);
    assert.equal(regions.length, 1);
    const points = regions[0].points.split(' ').map(p => p.split(',').map(Number));
    assert.ok(points.length >= 3);
    assert.ok(points.flat().every(n => Number.isFinite(n) && n >= 1 && n <= 99));
  }
});
