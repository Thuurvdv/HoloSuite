import assert from "node:assert/strict";
import test from "node:test";

const generator = await import("../../.tmp-tests/hacking/packet-switchboard-generator.js");

test("packet switchboard generation is deterministic and stays within profile limits", () => {
  const profile = {
    packetSwitchboard: {
      laneCount: 5,
      columnCount: 6,
      deliveryGoal: 8,
      previewCount: 2
    }
  };
  const first = generator.generatePacketSwitchboard(profile, "switchboard-seed");
  const second = generator.generatePacketSwitchboard(profile, "switchboard-seed");

  assert.deepEqual(first, second);
  assert.equal(first.lanes.length, 5);
  assert.equal(first.columnCount, 6);
  assert.equal(first.junctions.length, 30);
  assert.ok(first.packetPlan.length >= 32);
  assert.ok(first.packetPlan.every((packet) => packet.targetRow >= 0 && packet.targetRow < 5));
  assert.ok(first.packetPlan.every((packet) => packet.sourcePort === first.lanes[packet.sourceRow].inputPort));
});

test("junction direction cycling never points beyond an edge lane", () => {
  assert.deepEqual(generator.getValidDirections(0, 4), [0, 1]);
  assert.deepEqual(generator.getValidDirections(3, 4), [-1, 0]);
  assert.deepEqual(generator.getValidDirections(2, 4), [-1, 0, 1]);
  assert.equal(generator.cycleJunctionDirection(0, 0, 4), 1);
  assert.equal(generator.cycleJunctionDirection(1, 0, 4), 0);
  assert.equal(generator.cycleJunctionDirection(0, 3, 4), -1);
  assert.equal(generator.normalizeJunctionDirection(-1, 0, 4), 0);
  assert.equal(generator.normalizeJunctionDirection(1, 3, 4), 0);
  assert.equal(generator.normalizeJunctionDirection(-1, 2, 4), -1);
});

test("route preview follows configured junctions to the packet target", () => {
  const board = generator.generatePacketSwitchboard({
    packetSwitchboard: { laneCount: 4, columnCount: 6, deliveryGoal: 3 }
  }, "route-preview");
  for (let column = 0; column < 3; column += 1) {
    const junction = board.junctions.find((candidate) => candidate.row === column && candidate.column === column);
    junction.direction = 1;
  }
  const route = generator.tracePacketRoute(board, { sourceRow: 0, targetRow: 3 });
  assert.equal(route.reachesTarget, true);
  assert.equal(route.finalRow, 3);
  assert.equal(route.junctionIds.length, board.columnCount);
});

test("generator preserves enough columns to reach every output lane", () => {
  const board = generator.generatePacketSwitchboard({
    packetSwitchboard: { laneCount: 6, columnCount: 2, deliveryGoal: 3 }
  }, "minimum-columns");

  assert.equal(board.laneCount, 6);
  assert.equal(board.columnCount, 5);
  assert.ok(board.packetPlan.every((packet) => Math.abs(packet.targetRow - packet.sourceRow) <= board.columnCount));
});
