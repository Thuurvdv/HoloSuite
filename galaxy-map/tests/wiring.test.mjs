import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const main = read("src/main.ts");

// Each app factory destructures the functions it needs from `deps`. A name that
// main.ts forgets to pass arrives as undefined and only fails when clicked.
function requiredDeps(file) {
  const block = read(file).match(/const \{([\s\S]*?)\} = deps;/)?.[1] ?? "";
  return block.split(",").map(name => name.trim()).filter(Boolean);
}

function providedDeps(factory) {
  const start = main.indexOf(`${factory}({`);
  assert.ok(start >= 0, `${factory} is not called in main.ts`);
  const body = main.slice(start, main.indexOf("\n});", start));
  return [...body.matchAll(/^ {2}([A-Za-z_$][\w$]*)(?=[,:\n])/gm)].map(match => match[1]);
}

for (const [factory, file] of [
  ["createGalaxyMapViewClass", "src/view-app.ts"],
  ["createGalaxyMapManagerClass", "src/manager-app.ts"],
  ["createPlayerMapChooserClass", "src/player-map-chooser-app.ts"]
]) {
  test(`${factory} receives every dependency it uses`, () => {
    const provided = new Set(providedDeps(factory));
    const missing = requiredDeps(file).filter(name => !provided.has(name));
    assert.deepEqual(missing, []);
  });
}
