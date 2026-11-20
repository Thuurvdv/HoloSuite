import assert from "node:assert/strict";
import test from "node:test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

globalThis.foundry = {};
const source = buildSync({ entryPoints: [fileURLToPath(new URL("./player-contacts.ts", import.meta.url))], bundle: true, write: false, format: "esm", platform: "node" }).outputFiles[0].text;
const contacts = await import(`data:text/javascript;base64,${Buffer.from(source + "\n//# sourceURL=player-contacts-test.mjs").toString("base64")}`);
const gm = { id: "gm", name: "GM", isGM: true, active: true };
const player = { id: "pc", name: "Player", isGM: false };
const other = { id: "other", name: "Other Player", isGM: false };
const personal = { id: "friend", name: "Friend", number: "123-456" };
function setup() {
  const entries = [];
  globalThis.CONST = { DOCUMENT_OWNERSHIP_LEVELS: { NONE: 0, OBSERVER: 2, OWNER: 3 } };
  globalThis.game = {
    user: gm, users: { contents: [gm, player, other], get: (id) => [gm, player, other].find((user) => user.id === id) },
    journal: { contents: entries, documentClass: { create: async (data) => {
      const entry = {
        ...data, getFlag: (module, key) => data.flags[module]?.[key],
        testUserPermission: (user) => user.isGM || data.ownership[user.id] >= 2,
        update: async (update) => {
          for (const [path, value] of Object.entries(update)) {
            const parts = path.split("."); let target = data;
            for (const key of parts.slice(0, -1)) target = target[key] ??= {};
            const last = parts.at(-1);
            if (last.startsWith("-=")) delete target[last.slice(2)]; else target[last] = value;
          }
        }
      };
      entries.push(entry);return entry;
    } } }
  };
  return entries;
}

test("personal directories migrate into owner-and-GM storage with no access for other players", async () => {
  const entries = setup();
  await Promise.all([contacts.ensurePersonalContactDirectories(), contacts.ensurePersonalContactDirectories()]);
  assert.equal(entries.length, 2);
  assert.equal(entries[0].ownership.default, 0);
  assert.equal(entries[0].ownership.pc, 3);
  assert.equal(contacts.getSyncedPersonalContacts(player.id), null);
  game.user = player;
  assert.equal(await contacts.savePersonalContacts(player.id, [personal]), true);
  assert.equal(contacts.getSyncedPersonalContacts(player.id)[0].name, "Friend");
  game.user = other;
  assert.equal(contacts.getSyncedPersonalContacts(player.id), null);
  assert.equal(await contacts.writePersonalContact(player.id, personal.id, { ...personal, name: "Intruder" }), false);
  game.user = gm;
  assert.equal(contacts.getPlayerContacts(player.id)[0].name, "Friend");
});

test("GM can edit both personal and assigned contacts; edits survive owner reconnects and deletions", async () => {
  setup();await contacts.ensurePersonalContactDirectories();
  game.user = player;await contacts.savePersonalContacts(player.id, [personal]);
  game.user = gm;
  await contacts.writeAssignedContact(player.id, "assigned", { id: "assigned", name: "Captain", number: "654-321" });
  assert.equal(contacts.getPlayerContacts(player.id).length, 2);
  await contacts.writePersonalContact(player.id, personal.id, { ...personal, name: "GM correction" });
  game.user = player;
  assert.equal(contacts.getSyncedPersonalContacts(player.id)[0].name, "GM correction");
  assert.equal(contacts.getAssignedContacts(player.id)[0].name, "Captain");
  await contacts.writeAssignedContact(player.id, "assigned", { name: "Not permitted" });
  assert.equal(contacts.getAssignedContacts(player.id)[0].name, "Captain");
  game.user = gm;await contacts.writePersonalContact(player.id, personal.id);
  game.user = player;assert.deepEqual(contacts.getSyncedPersonalContacts(player.id), []);
  assert.equal(contacts.getPlayerContacts(player.id).length, 1);
});
