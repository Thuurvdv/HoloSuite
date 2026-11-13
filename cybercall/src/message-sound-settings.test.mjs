import assert from "node:assert/strict";
import test from "node:test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

globalThis.foundry = {};
globalThis.FormApplication = class {};
const source = buildSync({ entryPoints: [fileURLToPath(new URL("./message-sound-settings.ts", import.meta.url))], bundle: true, write: false, format: "esm", platform: "node" }).outputFiles[0].text;
const { getMessageSoundChoices, getMessageSoundPath, getMessageSoundOptions, setMessageSoundPath, canChooseMessageSoundFile, MessageSoundSettingsApp } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

test("the Calls dropdown saves available sounds and preserves previously uploaded audio", async () => {
  let personal = { path: "personal.ogg", label: "Personal", selected: "shared.ogg" };
  const settings = { shareMessageSounds: true, customMessageSounds: [{ path: "shared.ogg", label: "Shared" }] };
  globalThis.game = {
    settings: { get: (_, key) => settings[key] },
    user: { isGM: false, getFlag: () => personal, setFlag: async (_, key, value) => { personal = value; } }
  };
  assert.deepEqual(getMessageSoundOptions().map(({ value, selected }) => [value, selected]), [
    ["", false], ["personal.ogg", false], ["shared.ogg", true]
  ]);
  await setMessageSoundPath("");
  assert.deepEqual(personal, { path: "personal.ogg", label: "Personal", selected: "" });
  settings.shareMessageSounds = false;
  await setMessageSoundPath("shared.ogg");
  assert.equal(personal.selected, "");
  await setMessageSoundPath("personal.ogg");
  assert.equal(getMessageSoundPath(), "personal.ogg");
});

test("player shared sound selection follows the live GM sharing policy", () => {
  const settings = { shareMessageSounds: true, customMessageSounds: [{ label: "GM tone", path: "worlds/test/gm.ogg" }] };
  globalThis.game = { settings: { get: (_, key) => settings[key] }, user: { isGM: false, getFlag: () => ({ selected: "worlds/test/gm.ogg" }), can: () => false } };
  assert.equal(getMessageSoundPath(), "worlds/test/gm.ogg");
  assert.equal(canChooseMessageSoundFile(), false);
  settings.shareMessageSounds = false;
  assert.deepEqual(getMessageSoundChoices(), []);
  assert.equal(getMessageSoundPath(), "");
  game.user.isGM = true;
  assert.equal(getMessageSoundPath(), "worlds/test/gm.ogg");
  settings.customMessageSounds = [];
  assert.equal(getMessageSoundPath(), "");
});

test("personal sounds survive sharing changes and players cannot edit world libraries", async () => {
  const settings = { shareMessageSounds: false, customMessageSounds: [] };
  let saved;
  globalThis.ui = { notifications: {} };
  globalThis.game = {
    settings: { get: (_, key) => settings[key], set: () => assert.fail("player wrote world settings") },
    user: { isGM: false, can: () => false, getFlag: () => ({ path: "personal.ogg", selected: "personal.ogg" }), setFlag: async (_, key, value) => { saved = value; } }
  };
  assert.equal(getMessageSoundPath(), "personal.ogg");
  await new MessageSoundSettingsApp()._updateObject({ currentTarget: { querySelector: () => ({ value: "personal" }) } });
  assert.deepEqual(saved, { path: "personal.ogg", selected: "personal.ogg" });
  game.user.can = (permission) => permission === "FILES_BROWSE";
  assert.equal(canChooseMessageSoundFile(), true);
  assert.equal(new MessageSoundSettingsApp().getData().canUpload, false);
});

test("GM uploads enter the shared library and the sharing checkbox is persisted", async () => {
  const settings = { shareMessageSounds: true, customMessageSounds: [] };
  let saved;
  globalThis.game = {
    settings: { get: (_, key) => settings[key], set: async (_, key, value) => { settings[key] = value; } },
    user: { isGM: true, getFlag: () => ({}), setFlag: async (_, key, value) => { saved = value; } }
  };
  const form = {
    querySelectorAll: () => [],
    querySelector: (selector) => ({
      "[data-personal-sound]": { value: "worlds/test/My%20Tone.ogg" },
      "[data-share-message-sounds]": { checked: false },
      "[data-message-sound-selection]": { value: "personal" }
    })[selector]
  };
  await new MessageSoundSettingsApp()._updateObject({ currentTarget: form });
  assert.deepEqual(settings.customMessageSounds, [{ label: "My Tone", path: "worlds/test/My%20Tone.ogg" }]);
  assert.equal(settings.shareMessageSounds, false);
  assert.equal(saved.selected, "worlds/test/My%20Tone.ogg");
});
