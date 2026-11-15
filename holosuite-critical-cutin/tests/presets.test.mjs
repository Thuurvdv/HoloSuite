import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSync } from 'esbuild';
import { fileURLToPath } from 'node:url';

const code = buildSync({ entryPoints: [fileURLToPath(new URL('../src/effect-presets.ts', import.meta.url))], bundle: true, write: false, format: 'esm' }).outputFiles[0].text;
const { EFFECT_PRESETS, normalizeEffectId, effectMarkup } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);

test('all twelve saved choices normalize without falling back; legacy IDs stay valid', () => {
  assert.equal(EFFECT_PRESETS.length, 12);
  assert.equal(new Set(EFFECT_PRESETS.map(p => p.id)).size, 12);
  for (const preset of EFFECT_PRESETS) assert.equal(normalizeEffectId(preset.id), preset.id);
  for (const invalid of [null, undefined, '', '<script>', {}, 'future-style']) assert.equal(normalizeEffectId(invalid), 'strike');
});

test('effects have distinct geometry, bounded density and deterministic client output', () => {
  assert.equal(new Set(EFFECT_PRESETS.map(p => effectMarkup(p.id))).size, 12);
  for (const preset of EFFECT_PRESETS) {
    const low = effectMarkup(preset.id, 'low');
    const high = effectMarkup(preset.id, 'high');
    assert.ok(high.length >= low.length);
    assert.ok((high.match(/class=/g) ?? []).length <= 40);
    assert.equal(high, effectMarkup(preset.id, 'high'));
    assert.doesNotMatch(high, /<script|<canvas|<img/);
  }
});

test('the eighteen Fate polygons tile the normalized portrait', async () => {
  const bundle = buildSync({
    entryPoints: [fileURLToPath(new URL('../src/shattered-fate.ts', import.meta.url))],
    bundle: true, write: false, format: 'esm'
  }).outputFiles[0].text;
  const { fatePieces } = await import(`data:text/javascript;base64,${Buffer.from(bundle).toString('base64')}`);
  assert.equal(fatePieces.length, 18);
  function contains(points, x, y) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const [a, b] = points[i];
      const [c, d] = points[j];
      if ((b > y) !== (d > y) && x < a + (c - a) * (y - b) / (d - b)) inside = !inside;
    }
    return inside;
  }
  for (let x = .213; x < 100; x++) for (let y = .397; y < 100; y++) {
    assert.equal(fatePieces.filter(points => contains(points, x, y)).length, 1, `portrait sample ${x}, ${y}`);
  }
});
