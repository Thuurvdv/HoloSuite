import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const moduleState = { active: false, api: null };
globalThis.game = {
  modules: { get: (id) => id === "bounty-board" ? moduleState : null },
  scifiSuite: {}
};

const {
  getBountyIntelForSystem,
  hasBountyBoardIntegration,
  openBountyIntel
} = await import("../src/bounty-integration.ts");

test("the optional integration is inert when Bounty Board is unavailable", () => {
  assert.equal(hasBountyBoardIntegration(), false);
  assert.deepEqual(getBountyIntelForSystem({ sceneIds: ["scene-a"] }), []);
  assert.equal(openBountyIntel("bounty-a"), false);
});

test("API discovery tolerates initialization order without enabling a disabled module", () => {
  moduleState.active = undefined;
  moduleState.api = { getBountiesForScene: () => [] };
  assert.equal(hasBountyBoardIntegration(), true);
  moduleState.active = false;
  assert.equal(hasBountyBoardIntegration(), false);
  moduleState.api = null;
});

test("system intel resolves through scenes and deduplicates shared bounties", () => {
  const queried = [];
  let opened = "";
  moduleState.active = true;
  moduleState.api = {
    getBountiesForScene(sceneId) {
      queried.push(sceneId);
      if (sceneId === "scene-a") return [{ id: "one", name: "Target One", status: "available", statusLabel: "Available", reward: "500 credits", sceneId }];
      return [
        { id: "one", name: "Duplicate", sceneId },
        { id: "two", name: "Target Two", status: "claimed", statusLabel: "Claimed", reward: "1,000 credits", sceneId }
      ];
    },
    openBounty(id) {
      opened = id;
      return true;
    }
  };

  const results = getBountyIntelForSystem({ sceneIds: ["scene-a", "scene-b"] });
  assert.deepEqual(queried, ["scene-a", "scene-b"]);
  assert.deepEqual(results.map((bounty) => bounty.id), ["one", "two"]);
  assert.equal(openBountyIntel("two"), true);
  assert.equal(opened, "two");
});

test("the hover HUD is delayed, stable, disposable, and uses bounded image processing", () => {
  const callout = read("src/planet-intel-callout.ts");
  const processor = read("src/hologram-image.ts");
  const template = read("templates/galaxy-map.hbs");
  const css = read("styles/galaxy-map-view.css");
  const view = read("src/view-app.ts");

  assert.match(template, /data-intel-layer/);
  assert.match(view, /this\._attachPartListeners\("main", html, options\);[\s\S]*this\._mountBountyIntelCallout\(html\)/);
  assert.match(view, /_mountBountyIntelCallout\(html: HTMLElement\)/);
  assert.match(view, /createPlanetIntelCallout/);
  assert.doesNotMatch(view, /if \(stage && hasBountyBoardIntegration\(\)\)/);
  assert.match(callout, /pointerenter[\s\S]*pointerleave/);
  assert.match(callout, /setTimeout\([\s\S]*90\)/);
  assert.match(callout, /scheduleHide = \(delay = 180\)/);
  assert.match(callout, /AbortController/);
  assert.match(callout, /data-intel-previous[\s\S]*data-intel-next/);
  assert.match(processor, /MAX_CACHE_ENTRIES = 40/);
  assert.match(processor, /MAX_WORKING_SIZE = 192/);
  assert.match(processor, /Math\.hypot\(gx, gy\)/);
  assert.match(css, /\.gmf-galaxy \.gmf-intel-callout/);
  assert.match(css, /\.gmf-galaxy \.gmf-intel-callout__body[\s\S]*height: auto !important;[\s\S]*min-height: 78px !important/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
