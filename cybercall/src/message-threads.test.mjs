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
const { serviceArchive } = await loadModule("./message-archive.ts");
const { sendMessageToContact, getStoredMessages } = await loadModule("./message-service.ts");

const gm = { id: "gm", name: "GM", isGM: true };
const player = { id: "player", name: "Player", isGM: false };
const pc = { id: "pc", name: "Player", userId: player.id, actorId: "pc-actor" };
const npcA = { id: "a", name: "Fixer", number: "NPC:a", actorId: "actor-a", isNpc: true, managedByGM: true };
const npcB = { ...npcA, id: "b", name: "Broker", number: "NPC:b", actorId: "actor-b" };
const identity = (npc) => ({ senderName: npc.name, senderNumber: npc.number, senderActorId: npc.actorId, contactName: npc.name, contactIsNpc: true, contactManagedByGM: true });

function setup() {
  const documents = [];
  const entries = new Map();
  const settings = new Map();
  for (const user of [gm, player]) {
    user.pending = {};
    user.getFlag = () => user.pending;
    user.setFlag = async (_scope, path, value) => { user.pending[path.split(".")[1]] = value; };
    user.unsetFlag = async (_scope, path) => { delete user.pending[path.split(".")[1]]; };
  }
  globalThis.ui = { notifications: { info() {}, warn() {} } };
  globalThis.game = {
    user: gm,
    users: { activeGM: gm, contents: [gm, player], get: (id) => [gm, player].find((user) => user.id === id) },
    journal: {
      get contents() { return [...entries.values()]; }, get: id => entries.get(id),
      documentClass: { async create(data) {
        assert.ok(!entries.has(data._id));
        const pages = new Map();
        const entry = { ...data, id: data._id, pages: {
          get contents() { return [...pages.values()]; }, get: id => pages.get(id)
        }, async createEmbeddedDocuments(_type, rows) {
          return rows.map(row => {
            assert.ok(!pages.has(row._id));
            const page = { ...row, id: row._id, parent: entry, uuid: data._id + "." + row._id };
            pages.set(page.id, page);
            return page;
          });
        }, async deleteEmbeddedDocuments(_type, ids) { ids.forEach(id => pages.delete(id)); } };
        entries.set(data._id, entry);
        return entry;
      } }
    },
    messages: { contents: documents, documentClass: {
      async deleteDocuments(ids) { for (const id of ids) documents.splice(documents.findIndex(d => d.id === id), 1); },
      getSpeaker: speaker => speaker, async create(data) { documents.push(data); return data; }
    } },
    settings: { get: (_scope, key) => settings.get(key), set: (_scope, key, value) => settings.set(key, value) }
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
    assert.equal(thread.routeLabel, `Replying as: ${npc.name}`);
    assert.equal(thread.contact.userId, "");
  }

  game.user = player;
  threads = prepareThreads(getStoredMessages(), [pc]);
  assert.deepEqual(new Set(threads.map((thread) => thread.title)), new Set([npcA.name, npcB.name]));
  assert.ok(threads.every((thread) => thread.subtitle === "Direct message"));
  const fixerThread = threads.find((entry) => entry.contact.name === npcA.name);
  await sendMessageToContact(fixerThread.contact, "Player reply", { threadId: fixerThread.id });
  // A fresh message addressed to this NPC must join the same conversation.
  await sendMessageToContact(npcA, "Player follows up");
  game.user = gm;
  threads = prepareThreads(getStoredMessages(), [pc]);
  await serviceArchive();
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
  assert.deepEqual(documents[2].whisper, [gm.id, player.id]);
  assert.deepEqual(documents[4].whisper, [gm.id, player.id]);
});

test("explicit thread IDs preserve group conversations", async () => {
  setup();
  const document = await sendMessageToContact(pc, "Group message", {
    ...identity(npcA), threadId: "group:existing", conversationType: "group", groupId: "existing"
  });
  assert.equal(document.threadId, "group:existing");
  assert.equal(prepareThreads(getStoredMessages())[0].isGroup, true);
});

test("GM NPC routes show the player's portrait before a reply, while players still see the NPC", async () => {
  setup();
  await sendMessageToContact(pc, "NPC portrait test", { ...identity(npcA), senderImage: "npc.webp", contactImage: "npc.webp" });
  const contact = { ...pc, image: "player.webp" };
  const gmThread = prepareThreads(getStoredMessages(), [contact])[0];
  assert.equal(gmThread.image, "player.webp");
  assert.equal(gmThread.initials, "P");
  assert.equal(gmThread.contact.name, npcA.name);
  assert.equal(gmThread.contact.image, "npc.webp");
  assert.equal(prepareThreads(getStoredMessages(), [pc])[0].image, "");
  game.user = player;
  assert.equal(prepareThreads(getStoredMessages(), [contact])[0].image, "npc.webp");
  const playerThread = prepareThreads(getStoredMessages(), [contact])[0];
  await sendMessageToContact(playerThread.contact, "Player reply", { threadId: playerThread.id, senderImage: "player-reply.webp" });
  game.user = gm;
  await serviceArchive();
  assert.equal(prepareThreads(getStoredMessages(), [contact])[0].image, "player-reply.webp");
});

test("pending player send survives chat clearing and sender disconnect, then archives exactly once", async () => {
  const chat = setup();
  game.user = player;
  await Promise.all(["first", "second"].map(body => sendMessageToContact(npcA, body)));
  assert.equal(getStoredMessages().length, 0);
  assert.equal(Object.keys(player.pending).length, 2);
  const replay = structuredClone(player.pending);
  game.user = gm;
  await serviceArchive();
  assert.equal(chat.length, 2);
  assert.deepEqual(player.pending, {});
  chat.length = 0;
  Object.assign(player.pending, replay);
  await serviceArchive();
  assert.equal(chat.length, 0);
  game.user = player;
  assert.deepEqual(getStoredMessages().map(m => m.body).sort(), ["first", "second"]);
  game.user = { id: "bystander" };
  assert.deepEqual(getStoredMessages(), []);
  assert.deepEqual(game.journal.contents[0].ownership, { default: 0, gm: 2, player: 2 });
});

test("migration checks author and audience, keeps time and IDs, and cannot revive pruned events", async () => {
  const chat = setup();
  const base = { kind: "phoneMessage", threadId: "old", body: "call", senderUserId: gm.id,
    recipientUserIds: [player.id], messageType: "event", eventType: "ended" };
  function add(id, changes = {}) {
    chat.push({ id, timestamp: chat.length + 100, whisper: [gm.id, player.id], author: gm,
      flags: { cybercall: { ...base, id: "message-" + id } }, ...changes });
  }
  for (let i = 0; i < 103; i++) add(String(i));
  add("spoof", { author: player });
  add("wrong-audience", { whisper: [gm.id] });
  add("text", { flags: { cybercall: { ...base, body: "kept", messageType: "text", id: "stable" } } });
  assert.equal(getStoredMessages().length, 104);
  await serviceArchive();
  await serviceArchive();
  assert.equal(getStoredMessages().length, 101);
  chat.length = 0;
  const saved = getStoredMessages();
  assert.equal(saved.length, 101);
  assert.equal(saved.find(m => m.id === "stable").chatMessageId, "text");
  assert.ok(!saved.some(m => ["0", "1", "2", "spoof", "wrong-audience"].includes(m.chatMessageId)));
});

test("changing a group audience creates a separate journal and grants access only to the new messages", async () => {
  setup();
  const options = { threadId: "group:crew", groupId: "crew", conversationType: "group" };
  await sendMessageToContact(pc, "before", options);
  await sendMessageToContact(pc, "after", { ...options, recipientUserIds: [player.id, "new-member"] });
  assert.equal(game.journal.contents.length, 2);
  game.user = { id: "new-member" };
  assert.deepEqual(getStoredMessages().map(m => m.body), ["after"]);
});

test("a failed journal write leaves the message queued and a forged sender cannot be delivered", async (t) => {
  t.mock.method(console, "warn", () => {});
  setup();
  game.user = player;
  await sendMessageToContact(pc, "retry me");
  const [key, pending] = Object.entries(player.pending)[0];
  game.user = gm;
  player.pending[key] = { ...pending, senderUserId: gm.id };
  await serviceArchive();
  assert.equal(getStoredMessages().length, 0);
  player.pending[key] = pending;
  const create = game.journal.documentClass.create;
  game.journal.documentClass.create = async () => { throw new Error("simulated write failure"); };
  await serviceArchive();
  assert.equal(player.pending[key].body, "retry me");
  assert.equal(game.messages.contents.length, 0);
  game.journal.documentClass.create = create;
  await serviceArchive();
  game.user = player;
  assert.equal(getStoredMessages().length, 1);
  assert.deepEqual(player.pending, {});
});
