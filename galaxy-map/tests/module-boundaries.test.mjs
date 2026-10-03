import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("main composes dedicated storage and travel services", () => {
  const main = read("src/main.ts");
  const store = read("src/galaxy-store.ts");
  const travel = read("src/travel-service.ts");

  assert.match(main, /createGalaxyStore\([\s\S]*createTravelService\(/);
  assert.doesNotMatch(main, /function (?:createMap|upsertSystem|upsertObject|requestTravelToSystem|trackTravelRequest)\(/);
  assert.match(store, /export function createGalaxyStore/);
  assert.match(store, /function upsertSystem[\s\S]*function upsertObject[\s\S]*function upsertRoute/);
  assert.match(travel, /export function createTravelService/);
  assert.match(travel, /function requestTravelToSystem[\s\S]*function trackTravelRequest[\s\S]*function handleTravelVote/);
});

test("texture guide markup stays outside the module entrypoint", () => {
  const main = read("src/main.ts");
  const textureGuide = read("src/texture-guide.ts");
  assert.match(main, /import \{ getTextureGuideMarkup \} from "\.\/texture-guide"/);
  assert.doesNotMatch(main, /gmf-uv-guide-grid/);
  assert.match(textureGuide, /export function getTextureGuideMarkup[\s\S]*gmf-uv-guide-grid/);
});
