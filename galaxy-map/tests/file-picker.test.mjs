import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('every file picker exposes a matching clear control', () => {
  const sources = [
    read('src/main.ts'),
    read('templates/system-details.hbs'),
    read('templates/object-appearance-panel.hbs')
  ];
  for (const source of sources) {
    const browseTargets = [...source.matchAll(/data-browse-target=["']([^"']+)["']/g)].map(match => match[1]);
    const clearTargets = [...source.matchAll(/data-clear-target=["']([^"']+)["']/g)].map(match => match[1]);
    for (const target of browseTargets) {
      assert.ok(clearTargets.includes(target), `file picker ${target} is missing a clear control`);
    }
  }
});

test('dialog and inline-panel clear controls empty their field and notify listeners', () => {
  const main = read('src/main.ts');
  const view = read('src/view-app.ts');
  for (const source of [main, view]) {
    assert.match(source, /querySelectorAll(?:<HTMLElement>)?\("\[data-clear-target\]"\)/);
    assert.match(source, /\.value = "";[\s\S]*dispatchEvent\(new Event\("input", \{ bubbles: true \}\)\)[\s\S]*dispatchEvent\(new Event\("change", \{ bubbles: true \}\)\)/);
  }
});
