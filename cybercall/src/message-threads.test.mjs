import assert from "node:assert/strict";
import test from "node:test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

globalThis.foundry = { utils: { escapeHTML: (value) => String(value).replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`) } };

async function loadModule(path) {
  const source = buildSync({ entryPoints: [fileURLToPath(new URL(path, import.meta.url))], bundle: true, write: false, format: "esm", platform: "node" }).outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
}
const { createThreadIdForContact, prepareThreads } = await loadModule("./message-model.ts");
const { sendMessageToContact, getStoredMessages } = await loadModule("./message-service.ts");

const gm = { id: "gm", name: "GM", isGM: true };
const player = { id: "player", name: "Player", isGM: false };
const pc = { id: "pc", name: "Player", userId: player.id, actorId: "pc-actor" };
const npcA = { id: "a", name: "Fixer", number: "NPC:a", actorId: "actor-a", isNpc: true, managedByGM: true };
const npcB = { ...npcA, id: "b", name: "Broker", number: "NPC:b", actorId: "actor-b" };
const identity = (npc) => ({ senderName: npc.name, senderNumber: npc.number, senderActorId: npc.actorId, contactName: npc.name, contactIsNpc: true, contactManagedByGM: true });

function setup() {
  const documents = [];
  globalThis.game = {
    user: gm,
    users: { contents: [gm, player], get: (id) => [gm, player].find((user) => user.id === id) },
    messages: { contents: documents },
    settings: { get: () => false }
  };
  globalThis.ChatMessage = {
    getSpeaker: (speaker) => speaker,
    create: async (data) => {
      const document = { ...data, id: String(documents.length), timestamp: Date.now() };
      documents.push(document);
      return document;
    }
  };
  return documents;
}

test("selected NPCs have separate IDs and match the player's contact IDs", () => {
  setup();
  const a = createThreadIdForContact(pc, gm.id, identity(npcA));
  assert.notEqual(a, createThreadIdForContact(pc, gm.id, identity(npcB)));
  assert.notEqual(a, createThreadIdForContact(pc, gm.id));
  assert.equal(a, createThreadIdForContact(npcA, player.id));
  assert.equal(createThreadIdForContact(pc, gm.id), "direct:user:gm:user:player");
  assert.equal(createThreadIdForContact({ userId: gm.id }, player.id), createThreadIdForContact(pc, gm.id));
});

test("two NPC conversations and replies stay separate for both participants", async () => {
  const documents = setup();
  await sendMessageToContact(pc, "Fixer greeting", identity(npcA));
  await sendMessageToContact(pc, "Broker greeting", identity(npcB));
  let threads = prepareThreads(getStoredMessages(), [pc]);
  assert.equal(threads.length, 2);
  for (const npc of [npcA, npcB]) {
    const thread = threads.find((entry) => entry.contact.name === npc.name);
    assert.ok(thread);
    assert.equal(thread.contact.actorId, npc.actorId);
    assert.equal(thread.title, pc.name);
    assert.equal(thread.routeLabel, `TO: ${npc.name}`);
    assert.equal(thread.contact.userId, "");
  }

  game.user = player;
  threads = prepareThreads(getStoredMessages(), [pc]);
  assert.deepEqual(new Set(threads.map((thread) => thread.title)), new Set([npcA.name, npcB.name]));
  const fixerThread = threads.find((entry) => entry.contact.name === npcA.name);
  await sendMessageToContact(fixerThread.contact, "Player reply", { threadId: fixerThread.id });
  // A fresh message addressed to this NPC must join the same conversation.
  await sendMessageToContact(npcA, "Player follows up");
  game.user = gm;
  threads = prepareThreads(getStoredMessages(), [pc]);
  const fixerReply = threads.find((entry) => entry.id === fixerThread.id);
  await sendMessageToContact(fixerReply.contact, "Fixer answers", {
    ...identity(fixerReply.contact), threadId: fixerReply.id, recipientUserIds: [player.id]
  });
  for (const user of [gm, player]) {
    game.user = user;
    const result = prepareThreads(getStoredMessages(), [pc]);
    assert.equal(result.length, 2);
    assert.equal(result.find((entry) => entry.id === fixerThread.id).messages.length, 4);
    assert.equal(result.find((entry) => entry.id !== fixerThread.id).messages.length, 1);
  }
  assert.deepEqual(documents[0].whisper, [gm.id, player.id]);
  assert.deepEqual(documents[2].whisper, [player.id, gm.id]);
  assert.deepEqual(documents[4].whisper, [gm.id, player.id]);
});

test("explicit thread IDs preserve group conversations", async () => {
  setup();
  const document = await sendMessageToContact(pc, "Group message", {
    ...identity(npcA), threadId: "group:existing", conversationType: "group", groupId: "existing"
  });
  assert.equal(document.flags.cybercall.threadId, "group:existing");
  assert.equal(prepareThreads(getStoredMessages())[0].isGroup, true);
});
