import assert from "node:assert/strict";
import test from "node:test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";
const source = buildSync({ entryPoints: [fileURLToPath(new URL("./history-retention.ts", import.meta.url))], bundle: true, write: false, format: "esm", platform: "node" }).outputFiles[0].text;
const { CALL_HISTORY_LIMIT, getExpiredCallEventIds, pruneCallHistory } = await import(`data:text/javascript;base64,${Buffer.from(source + "\n//# sourceURL=history-retention-test.mjs").toString("base64")}`);
const event = (i) => ({ id: `event-${i}`, timestamp: 10000 + i, flags: { cybercall: { kind: "phoneMessage", messageType: "event", eventType: "connected" } } });

test("retention keeps the newest 100 call events and ignores every other chat record", () => {
  const events = Array.from({ length: 150 }, (_, i) => event(i));
  const text = { id: "text", timestamp: 1, flags: { cybercall: { kind: "phoneMessage", messageType: "text", eventType: "connected" } } };
  const group = { id: "group", timestamp: 1, flags: { cybercall: { kind: "phoneMessage", messageType: "event", eventType: "group-created" } } };
  const chat = { id: "chat", timestamp: 1, flags: { cybercall: { kind: "other", messageType: "event", eventType: "connected" } } };
  const expired = getExpiredCallEventIds([text, group, chat, ...events]);
  assert.equal(CALL_HISTORY_LIMIT, 100);
  assert.equal(expired.length, 50);
  assert.deepEqual(new Set(expired), new Set(events.slice(0, 50).map((entry) => entry.id)));
  assert.deepEqual(getExpiredCallEventIds(events.slice(0, 100)), []);
});
test("only the elected GM prunes history, with concurrent requests serialized", async () => {
  let entries = Array.from({ length: 160 }, (_, i) => event(i));
  let calls = 0;
  const gm = { id: "gm", isGM: true, active: true };
  globalThis.game = {
    user: { id: "player", isGM: false }, users: { contents: [gm] },
    messages: { get contents() { return entries; }, documentClass: { deleteDocuments: async (ids) => {
      calls++;
      await Promise.resolve();
      entries = entries.filter((entry) => !ids.includes(entry.id));
    } } }
  };
  await pruneCallHistory();assert.equal(calls, 0);
  game.user = gm;
  await Promise.all([pruneCallHistory(), pruneCallHistory(), pruneCallHistory()]);
  assert.equal(entries.length, 100);assert.equal(calls, 1);
  entries.push(event(200));await pruneCallHistory();
  assert.equal(entries.length, 100);assert.equal(calls, 2);
  game.user = { id: "second", isGM: true, active: true };game.users.contents.push(game.user);
  entries.push(event(201));await pruneCallHistory();assert.equal(calls, 2);
});
