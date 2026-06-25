import assert from "node:assert/strict";
import test from "node:test";

const { addSceneControlTool } = await import("../../.tmp-tests/core/scene-controls.js");

const createTool = () => ({
  name: "holosuite-core-launcher",
  title: "HoloSuite",
  icon: "fa-solid fa-mobile-screen-button"
});

test("adds the launcher to v12 array controls and tools", () => {
  const controls = [
    { name: "measure", tools: [] },
    { name: "token", tools: [{ name: "select" }] }
  ];

  assert.equal(addSceneControlTool(controls, createTool()), true);
  assert.deepEqual(controls[1].tools.map((tool) => tool.name), ["select", "holosuite-core-launcher"]);
});

test("adds the launcher to keyed v13 and v14 controls and tools", () => {
  const controls = {
    tokens: {
      name: "tokens",
      tools: {
        select: { name: "select", order: 5 }
      }
    }
  };

  assert.equal(addSceneControlTool(controls, createTool()), true);
  assert.equal(controls.tokens.tools["holosuite-core-launcher"].order, 6);
});

test("supports transitional keyed controls with array tools", () => {
  const controls = {
    token: {
      name: "token",
      tools: [{ name: "select" }]
    }
  };

  assert.equal(addSceneControlTool(controls, createTool()), true);
  assert.equal(controls.token.tools.at(-1).name, "holosuite-core-launcher");
});

test("falls back to the first usable control group when v12 names differ", () => {
  const controls = [
    { name: "basic", tools: [{ name: "select" }] }
  ];

  assert.equal(addSceneControlTool(controls, createTool(), ["tokens", "token"], { allowFallback: true }), true);
  assert.deepEqual(controls[0].tools.map((tool) => tool.name), ["select", "holosuite-core-launcher"]);
});

test("adds the launcher to tile controls like terminal and vending tools", () => {
  const controls = [
    { name: "token", tools: [] },
    { name: "tiles", tools: [{ name: "select" }] }
  ];

  assert.equal(addSceneControlTool(controls, createTool(), ["tiles", "tile"]), true);
  assert.deepEqual(controls[1].tools.map((tool) => tool.name), ["select", "holosuite-core-launcher"]);
});

test("does not duplicate the launcher or add it to an unrelated control", () => {
  const existingTool = createTool();
  const controls = [{ name: "token", tools: [existingTool] }];
  const unrelatedControls = [{ name: "measure", tools: [] }];

  assert.equal(addSceneControlTool(controls, createTool()), false);
  assert.equal(controls[0].tools.length, 1);
  assert.equal(addSceneControlTool(unrelatedControls, createTool()), false);
  assert.equal(unrelatedControls[0].tools.length, 0);
});
