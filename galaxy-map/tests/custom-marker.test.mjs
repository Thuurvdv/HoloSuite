import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { normalizeSystem, normalizeSystemObject } from '../src/galaxy-model.ts';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('systems and entities preserve custom marker image paths', () => {
  assert.equal(normalizeSystem({ id: 'sol', markerImage: ' icons/sol.webp ' }).markerImage, 'icons/sol.webp');
  assert.equal(normalizeSystemObject({ id: 'earth', markerImage: ' icons/earth.png ' }).markerImage, 'icons/earth.png');
});

test('custom marker images replace generated marker artwork without animation', () => {
  const mapTemplate = read('templates/galaxy-map.hbs');
  const detailsTemplate = read('templates/system-details.hbs');
  const main = read('src/main.ts');
  const view = read('src/view-app.ts');
  const css = read('styles/galaxy-map-view.css');

  assert.match(mapTemplate, /#if system\.hasCustomMarker[\s\S]*gmf-custom-marker__image[\s\S]*#if system\.animatedCelestial/);
  assert.match(detailsTemplate, /#if system\.hasCustomMarker[\s\S]*gmf-custom-marker__image/);
  assert.match(main, /animatedCelestial: !displayMarkerImage && ANIMATED_CELESTIAL_STYLES/);
  assert.match(view, /animatedCelestial: !displayMarkerImage && ANIMATED_CELESTIAL_STYLES/);
  assert.match(css, /img\.gmf-custom-marker__image[\s\S]*width: 72% !important[\s\S]*height: 72% !important[\s\S]*object-fit: contain !important/);
  assert.match(css, /has-custom-marker[\s\S]*gmf-system__halo[\s\S]*display: none/);
});

test('custom marker pickers are available in dialog and inline editors', () => {
  const sources = [read('src/main.ts'), read('templates/system-details.hbs'), read('templates/object-appearance-panel.hbs')];
  for (const source of sources) {
    assert.match(source, /name=["']markerImage["']/);
    assert.match(source, /data-browse-target=["']markerImage["']/);
    assert.match(source, /data-clear-target=["']markerImage["']/);
  }
});
