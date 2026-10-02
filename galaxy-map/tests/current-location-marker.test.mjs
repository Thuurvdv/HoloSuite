import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('planet selections keep the shared selection ring', () => {
  const css = read('styles/galaxy-map-view.css');
  assert.match(css, /gmf-icon--ringed[\s\S]*\) \.gmf-system__halo \{ display: none; \}/);
  assert.doesNotMatch(css, /gmf-icon--ringed[\s\S]*gmf-system__selection\)[\s\S]*display: none/);
  assert.match(css, /\.gmf-system\.is-selected \.gmf-system__selection[\s\S]*border-color/);
});

test('the current location receives an accessible reduced-motion-aware green arrow', () => {
  const template = read('templates/galaxy-map.hbs');
  const css = read('styles/galaxy-map-view.css');
  const effects = read('styles/galaxy-map-effects.css');
  assert.match(template, /#if system\.isCurrent[^]*gmf-current-location-marker/);
  assert.match(css, /\.gmf-current-location-marker[\s\S]*border-top: 8px solid var\(--gmf-green[\s\S]*animation: gmf-current-location-bob/);
  assert.match(effects, /@keyframes gmf-current-location-bob/);
  assert.match(effects, /prefers-reduced-motion[\s\S]*gmf-current-location-marker/);
});
