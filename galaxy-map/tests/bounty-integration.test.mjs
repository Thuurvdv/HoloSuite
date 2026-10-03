import test from "node:test";
import assert from "node:assert/strict";

const moduleState = { active: false, api: null };
globalThis.game = {
  modules: { get: (id) => id === "bounty-board" ? moduleState : null },
  scifiSuite: {}
};

const {
  getBountyIntelForSystem,
  openBountyIntel
} = await import("../src/bounty-integration.ts");

test("nothing happens when Bounty Board is not installed", () => {
  assert.deepEqual(getBountyIntelForSystem({ sceneIds: ["scene-a"] }), []);
  assert.equal(openBountyIntel("bounty-a"), false);
});

test("a disabled Bounty Board is ignored even if its API is already registered", () => {
  moduleState.active = undefined;
  moduleState.api = { getBountiesForScene: () => [] };
  assert.deepEqual(getBountyIntelForSystem({ sceneIds: ["scene-a"] }), []);
  moduleState.active = false;
  assert.equal(openBountyIntel("bounty-a"), false);
  moduleState.api = null;
});

test("bounties are collected from every linked scene without duplicates", () => {
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
