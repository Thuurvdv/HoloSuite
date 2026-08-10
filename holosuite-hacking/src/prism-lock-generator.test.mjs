import assert from "node:assert/strict";
import test from "node:test";

const prism = await import("../../.tmp-tests/hacking/prism/prism-lock-generator.js");

const hardProfile = {
  prismLock: {
    ringCount: 4,
    slotCount: 12,
    receiverCount: 6,
    blockersPerRing: 2,
    iceReceiverCount: 3,
    switchableRingCount: 1,
    scrambleSteps: 5
  }
};

test("Prism Lock generation is deterministic and produces a scrambled board", () => {
  const first = prism.generatePrismLock(hardProfile, "prism-seed");
  const second = prism.generatePrismLock(hardProfile, "prism-seed");

  assert.deepEqual(first, second);
  assert.equal(first.rings.length, 4);
  assert.equal(first.receivers.length, 6);
  assert.equal(prism.evaluatePrismBoard(first, first.initialStates).solved, false);
});

test("every generated Prism Lock solution illuminates all required receptors without ICE", () => {
  for (let index = 0; index < 40; index += 1) {
    const board = prism.generatePrismLock(hardProfile, `solvable-${index}`);
    const evaluation = prism.evaluatePrismBoard(board, board.solutionStates);
    assert.equal(evaluation.solved, true, `seed ${index} should be solvable`);
    assert.equal(prism.evaluatePrismBoard(board, board.initialStates).solved, false, `seed ${index} should begin scrambled`);
    assert.equal(evaluation.litReceiverCount, board.receiverCount);
    assert.deepEqual(evaluation.activeIceSlots, []);
  }
});

test("switchable decoy rings begin active but are phased out in the generated solution", () => {
  const board = prism.generatePrismLock(hardProfile, "switchable-ring");
  const decoyRing = board.rings.find((ring) => ring.switchable);
  const initialState = board.initialStates.find((state) => state.id === decoyRing.id);
  const solutionState = board.solutionStates.find((state) => state.id === decoyRing.id);

  assert.equal(initialState.enabled, true);
  assert.equal(solutionState.enabled, false);
});

test("ring rotation wraps around the discrete optical positions", () => {
  const states = [{ id: "ring-1", rotation: 0, enabled: true }];
  assert.equal(prism.rotateRingState(states, "ring-1", -1, 10)[0].rotation, 9);
  assert.equal(prism.rotateRingState([{ ...states[0], rotation: 9 }], "ring-1", 1, 10)[0].rotation, 0);
});
