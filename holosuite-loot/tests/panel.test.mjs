import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

test('an invalidation during a pending view or transfer fetches the latest state instead of leaving stale loot visible', async () => {
  const original = { game: globalThis.game, foundry: globalThis.foundry, Application: globalThis.Application };
  globalThis.game = { settings: { get: () => true }, actors: { contents: [{ id: "hero", testUserPermission: () => true }] }, user: {}, i18n: { localize: key => key } };
  globalThis.foundry = {};
  globalThis.Application = class { render() {} };
  try {
    const compiled = await build({ entryPoints: [fileURLToPath(new URL('../src/ui.ts', import.meta.url))],
      bundle: true, write: false, format: 'esm', platform: 'browser' });
    const { LootPanel } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
    const calls = [];
    const panel = new LootPanel({ id: 'corpse', texture: {}, uuid: 'Scene.scene.Token.corpse' },
      request => new Promise(resolve => calls.push({ request, resolve })), { destination: () => true });
    const first = panel.refresh();
    void panel.refresh();
    calls[0].resolve({ entries: [{ id: 'stale' }] });
    await first;
    assert.equal(calls.length, 2);
    calls[1].resolve({ entries: [] });
    await panel.refreshing;
    assert.equal(panel.data.entries.length, 0);

    panel.destination = 'hero';
    const transfer = panel.take('all');
    assert.equal(calls[2].request.action, 'all');
    await panel.refresh(); // Another player completed a claim while this transfer was pending.
    calls[2].resolve({ entries: [{ id: 'newly-stale' }] });
    await transfer;
    assert.equal(calls[3].request.action, 'view');
    calls[3].resolve({ entries: [] });
    await panel.refreshing;
    assert.equal(panel.data.entries.length, 0);
  } finally { Object.assign(globalThis, original); }
});

test('opening draws a loading panel before a GM response, then displays a denial instead of staying blank', async () => {
  const original = { game: globalThis.game, foundry: globalThis.foundry, Application: globalThis.Application, ui: globalThis.ui };
  globalThis.game = { settings: { get: () => false }, user: {}, actors: { contents: [] }, i18n: { localize: key => key } };
  globalThis.foundry = {};
  const renders = [];
  globalThis.Application = class { render() { renders.push(this.loading); } async close() {} };
  globalThis.ui = { notifications: { warn() {} } };
  try {
    const compiled = await build({ entryPoints: [fileURLToPath(new URL('../src/ui.ts', import.meta.url))], bundle: true, write: false, format: 'esm', platform: 'browser' });
    const { LootPanel } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}#loading`);
    let reject;
    const panel = new LootPanel({ id: 'corpse', name: 'Corpse', texture: {}, uuid: 'Scene.scene.Token.corpse' },
      () => new Promise((_resolve, fail) => { reject = fail; }), {});
    const shown = panel.show();
    assert.deepEqual(renders, [true]); assert.equal(panel.getData().empty, false);
    panel.resolveFirstDraw(); await shown;
    const refresh = panel.refresh();
    reject({ code: 'AccessDenied' }); await refresh;
    assert.equal(panel.loading, false); assert.equal(panel.message, 'HL.AccessDenied');
    assert.deepEqual(renders, [true, false]);

    const approved = { entries: [{ id: 'nearby' }] };
    const opened = new LootPanel(panel.token, async () => { throw { code: 'OutOfRange' }; }, {});
    const opening = opened.show(approved);
    opened.resolveFirstDraw();
    await opening;
    assert.equal(opened.data, approved);
    assert.equal(opened.loading, false);
    await opened.refresh();
    assert.equal(opened.disposed, true);
    assert.equal(opened.message, '');
  } finally { Object.assign(globalThis, original); }
});
