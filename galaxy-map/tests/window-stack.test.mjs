import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("background data refreshes preserve the galaxy-window stack", () => {
  const main = read("src/main.ts");
  const refresh = main.match(/function snapshotWindowStack[\s\S]*?function getOpenMapViews/)?.[0] ?? "";

  assert.match(refresh, /const windowStack = snapshotWindowStack\(apps\)/);
  assert.match(refresh, /await Promise\.allSettled\(renders\)/);
  assert.ok((refresh.match(/restoreWindowStack\(windowStack\)/g) ?? []).length >= 2);
  assert.match(refresh, /requestAnimationFrame\?\.\(\(\) => restoreWindowStack\(windowStack\)\)/);
});

test("the viewport has no implicit path that opens the Map Manager", () => {
  const view = read("src/view-app.ts");

  assert.doesNotMatch(view, /openMapManager|data-action='edit-map'/);
});
