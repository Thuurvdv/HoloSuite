import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('routed destinations inside a system expose travel beside inspect', () => {
  const view = read('src/view-app.ts');
  const template = read('templates/system-details.hbs');
  const css = read('styles/planet-view.css');
  assert.match(view, /selectedObjectTravelRoute[\s\S]*selectedObject\.canTravel = Boolean/);
  assert.match(template, /gmf-inspector-navigation-actions[\s\S]*data-action="inspect-system"[\s\S]*data-action="travel-to-object"/);
  assert.match(css, /\.gmf-inspector-navigation-actions[\s\S]*display: flex/);
});

test('GM and player object travel reuse routes, animation, and approval', () => {
  const main = read('src/main.ts');
  const view = read('src/view-app.ts');
  assert.match(main, /function requestTravelToObject[\s\S]*travelScope: "object"/);
  assert.match(main, /pending\.travelScope === "object"[\s\S]*setCurrentObject/);
  assert.match(main, /function broadcastObjectTravelAnimation/);
  assert.match(view, /data-action='travel-to-object'[\s\S]*requestTravelToObject[\s\S]*_travelToObject/);
  assert.match(view, /async _travelToObject[\s\S]*getTravelRoute\(\{ routes: system\.routes \}[\s\S]*_animateShipTravel[\s\S]*setCurrentObject/);
});
