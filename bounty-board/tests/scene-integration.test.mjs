import test from "node:test";
import assert from "node:assert/strict";

const settings = {
  bounties: {},
  boardVisibleToPlayers: true,
  removedTags: []
};

globalThis.foundry = {
  utils: {
    randomID: () => "test-id",
    deepClone: (value) => structuredClone(value)
  }
};
globalThis.ui = { notifications: {} };
globalThis.game = {
  user: { isGM: false },
  scenes: { get: (id) => id === "scene-a" ? { id } : null },
  settings: { get: (_module, key) => settings[key] }
};

const { getBountiesForScene, normalizeBounty } = await import("../src/bounty-service.ts");

test("scene links normalize without breaking legacy bounties", () => {
  assert.equal(normalizeBounty({ title: "Legacy" }).sceneId, "");
  assert.equal(normalizeBounty({ title: "Linked", sceneId: " scene-a " }).sceneId, "scene-a");
});

test("scene queries expose only minimal player-visible bounty intel", () => {
  settings.bounties = {
    visible: {
      id: "visible", title: "The Contract", targetName: "Nia Voss", sceneId: "scene-a",
      published: true, status: "available", rewardAmount: 2500, rewardCurrency: "credits",
      image: "targets/nia.webp", updatedAt: "2026-09-11T12:00:00Z"
    },
    draft: {
      id: "draft", title: "Secret", targetName: "Hidden Target", sceneId: "scene-a",
      published: false, status: "available", notesGM: "Never expose this"
    },
    elsewhere: {
      id: "elsewhere", title: "Elsewhere", targetName: "Other Target", sceneId: "scene-b",
      published: true, status: "available"
    }
  };

  const results = getBountiesForScene("scene-a");
  assert.equal(results.length, 1);
  assert.deepEqual(results[0], {
    id: "visible",
    name: "Nia Voss",
    image: "targets/nia.webp",
    status: "available",
    statusLabel: "Available",
    reward: `${(2500).toLocaleString()} credits`,
    sceneId: "scene-a"
  });
  assert.equal("notesGM" in results[0], false);

  settings.boardVisibleToPlayers = false;
  assert.deepEqual(getBountiesForScene("scene-a"), []);
  settings.boardVisibleToPlayers = true;
  assert.deepEqual(getBountiesForScene("missing-scene"), []);
});

test("GMs can resolve hidden linked bounties", () => {
  game.user.isGM = true;
  const ids = getBountiesForScene("scene-a").map((bounty) => bounty.id).sort();
  assert.deepEqual(ids, ["draft", "visible"]);
  game.user.isGM = false;
});
