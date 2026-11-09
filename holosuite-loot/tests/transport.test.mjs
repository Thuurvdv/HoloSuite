import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { BUILD_VERSION, REQUEST_FLAG, RESPONSE_FLAG } from '../src/model.mjs';

test('document-based requests work without Web Crypto and only accept the elected GM response', async () => {
  const compiled = await build({ entryPoints: [fileURLToPath(new URL('../src/transport.ts', import.meta.url))], bundle: true, write: false, format: 'esm', platform: 'browser' });
  const originals = { game: globalThis.game, foundry: globalThis.foundry, Hooks: globalThis.Hooks };
  const cryptoDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  Object.defineProperty(globalThis, 'crypto', { value: undefined, configurable: true });
  const callbacks = new Map(); let serial = 0, sent;
  const player = { id: 'player', active: true, flags: {},
    setFlag: async (_m, key, value) => { player.flags[key] = value; sent = value; },
    getFlag: (_m, key) => player.flags[key] };
  const gm = { id: 'gm', active: true, isGM: true, getFlag: () => BUILD_VERSION };
  globalThis.game = { user: player, users: { contents: [gm, player], get: id => id === gm.id ? gm : player }, socket: { on() {} } };
  globalThis.foundry = { utils: { randomID: () => `request${++serial}` } };
  globalThis.Hooks = { on: (name, callback) => callbacks.set(name, callback) };
  try {
    const api = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
    let executions = 0;
    await api.startTransport({ execute: async () => { executions++; return { entries: [] }; } }, () => {});
    const operation = api.requestLoot({ action: 'view', tokenUuid: 'Scene.scene.Token.corpse' });
    assert.equal(sent.action, 'view'); assert.equal(sent.publicKey, undefined);
    const response = { id: sent.id, result: { entries: [{ id: 'item' }] } };
    assert.equal(player.flags[REQUEST_FLAG].id, sent.id);
    assert.equal(player.flags.request, undefined); // Old encrypted handlers cannot consume this command.
    player.flags[RESPONSE_FLAG] = JSON.stringify(response);
    const change = { flags: { 'holosuite-loot': { [RESPONSE_FLAG]: player.flags[RESPONSE_FLAG] } } };
    callbacks.get('updateUser')(player, change, {}, player.id); // Forged response cannot settle it.
    let settled = false; operation.then(() => { settled = true; });
    await Promise.resolve(); assert.equal(settled, false);
    callbacks.get('updateUser')(player, change, {}, gm.id);
    assert.deepEqual(await operation, response.result);
    gm.getFlag = () => '1.0.0';
    await assert.rejects(api.requestLoot({ action: 'view', tokenUuid: 'Scene.scene.Token.corpse' }), { code: 'BuildMismatch' });
    gm.active = false;
    await assert.rejects(api.requestLoot({ action: 'view', tokenUuid: 'Scene.scene.Token.corpse' }), { code: 'NoGM' });
    gm.active = true;
    gm.getFlag = () => BUILD_VERSION;
    game.user = gm;
    player.flags[REQUEST_FLAG] = { id: 'forged', action: 'take', tokenUuid: 'Scene.scene.Token.corpse', entryId: {} };
    const command = { flags: { 'holosuite-loot': { [REQUEST_FLAG]: player.flags[REQUEST_FLAG] } } };
    callbacks.get('updateUser')(player, command, {}, 'imposter');
    await Promise.resolve();
    assert.equal(JSON.parse(player.flags[RESPONSE_FLAG]).id, response.id);
    callbacks.get('updateUser')(player, command, {}, player.id);
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(JSON.parse(player.flags[RESPONSE_FLAG]), { id: 'forged', result: { error: 'InvalidRequest' } });
    assert.equal(executions, 0);
  } finally { Object.assign(globalThis, originals); Object.defineProperty(globalThis, 'crypto', cryptoDescriptor); }
});
