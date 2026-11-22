import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

const source = buildSync({ entryPoints: [fileURLToPath(new URL("./call-model.ts", import.meta.url))], bundle: true, write: false, format: "iife", globalName: "identity", platform: "browser" }).outputFiles[0].text;
function setup(user, tokens = []) {
  const actor = { id: "jimmy", name: "Jimmy Spaceman", img: "jimmy-portrait.webp", prototypeToken: { texture: { src: "jimmy-token.webp" } } };
  const game = { user: { id: "gm" }, actors: new Map([[actor.id, actor]]) };
  const context = vm.createContext({ fixture: { game, canvas: { tokens: { placeables: tokens, controlled: [] } } } });
  vm.runInContext(`let game = fixture.game; let canvas = fixture.canvas; ${source}`, context);
  return { api: context.identity, actor, game, user, context };
}

test("assigned characters resolve through Foundry's lexical game global and stored character IDs", () => {
  for (const reference of [{ character: "jimmy" }, { character: null, _source: { character: "jimmy" } }, { character: { id: "jimmy" } }]) {
    const { api, user, context } = setup({ id: "player", name: "Jimmy_Player", ...reference });
    assert.equal(context.game, undefined);
    assert.equal(api.getUserDisplayName(user), "Jimmy Spaceman");
    assert.equal(api.getUserTokenImage(user), "jimmy-token.webp");
  }
});

test("an unrelated owned token cannot replace the assigned character's portrait", () => {
  const token = { actor: { id: "other", ownership: { player: 3 } }, document: { actorId: "other", texture: { src: "other.webp" } } };
  const { api, user, context, game } = setup({ id: "player", name: "Jimmy_Player", character: "jimmy" }, [token]);
  game.user = user;
  context.fixture.canvas.tokens.controlled = [token];
  assert.equal(api.getUserTokenImage(user), "jimmy-token.webp");
});

test("player contacts keep the character name separate from the actual username", () => {
  const { api, user } = setup({ id: "player", name: "Jimmy_Player", character: "jimmy" });
  const contact = api.createUserContact(user);
  assert.equal(contact.name, "Jimmy Spaceman");
  assert.equal(contact.number, "@Jimmy_Player");
  assert.equal(contact.image, "jimmy-token.webp");
  assert.equal(contact.isNpc, false);
});
