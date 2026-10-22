import assert from "node:assert/strict";
import test from "node:test";
import { build } from "esbuild";

const bundled = await build({ entryPoints: [new URL("./live-frame.ts", import.meta.url).pathname.replace(/^\/([A-Z]:)/i, "$1")], bundle: true, write: false, format: "esm", platform: "node" });
const { createLiveFrameController } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);
const helper = await build({ stdin: { contents: 'export * from "./scene-compositor.ts"; export * from "./frame-cache.ts"; export * from "./camera-access.ts";', resolveDir: new URL(".", import.meta.url).pathname.replace(/^\/([A-Z]:)/i, "$1") }, bundle: true, write: false, format: "esm", platform: "node" });
const { getTileGeometry, getSceneDrawOrder, createFrameCache, canUserAccessCamera } = await import(`data:text/javascript;base64,${Buffer.from(helper.outputFiles[0].text).toString("base64")}`);

function setup({ background = "", active = false, deferred = false } = {}) {
  const draws = [], transforms = [], pending = [], intervals = new Map();
  let timerId = 0, encoded = 0;
  const scene = { id: "scene", width: 800, height: 600, grid: { size: 100 }, dimensions: { sceneX: 100, sceneY: 200, sceneWidth: 800, sceneHeight: 600 }, tiles: [], tokens: [] };
  globalThis.canvas = { scene: active ? scene : { id: "other" }, dimensions: scene.dimensions };
  globalThis.window = { setTimeout, clearTimeout, setInterval: fn => { intervals.set(++timerId, fn); return timerId; }, clearInterval: id => intervals.delete(id) };
  const context = { fillRect() {}, setTransform: (...args) => transforms.push(args), save() {}, restore() {}, translate() {}, rotate() {}, scale() {}, drawImage: (image, ...args) => draws.push({ src: image.src, args }), beginPath() {}, arc() {}, fill() {}, stroke() {}, fillText() {} };
  globalThis.document = { visibilityState: "visible", addEventListener() {}, removeEventListener() {}, createElement: () => ({ getContext: () => context, toDataURL: () => { encoded++; return "data:image/webp;base64,frame"; } }) };
  globalThis.Image = class {
    naturalWidth = 100; naturalHeight = 100;
    set src(value) { this._src = value; if (deferred) pending.push(() => this.onload?.()); else queueMicrotask(() => this.onload?.()); }
    get src() { return this._src; }
  };
  const broadcasts = [];
  const controller = createLiveFrameController({ normalizeCamera: camera => camera, applyLinkedRegionBounds: camera => camera, getSceneById: () => scene, getSceneBackgroundPath: () => background, moduleId: "test", isFrameProducer: () => true, broadcastLiveFrame: (...args) => broadcasts.push(args) });
  const camera = { id: "camera", sceneId: "scene", feedSource: "live", status: "online", regionX: 100, regionY: 200, regionWidth: 400, regionHeight: 300 };
  return { scene, controller, camera, draws, transforms, pending, broadcasts, intervals, get encoded() { return encoded; } };
}

for (const active of [false, true]) test(`tiles render with a background on ${active ? "active" : "inactive"} scenes`, async () => {
  const env = setup({ background: "background.png", active });
  env.scene.tiles = [{ x: 120, y: 220, width: 100, height: 100, texture: { src: "tile.png" } }];
  await env.controller.captureLiveFrame(env.camera);
  assert.deepEqual(env.draws.map(draw => draw.src), ["background.png", "tile.png"]);
  assert.deepEqual(env.transforms[0], [1, 0, 0, 1, -100, -200]);
});

test("tile-only scenes render; hidden and out-of-region tiles are excluded", async () => {
  const env = setup();
  env.scene.tiles = [
    { x: 120, y: 220, width: 100, height: 100, texture: { src: "visible.png" } },
    { x: 120, y: 220, width: 100, height: 100, hidden: true, texture: { src: "secret.png" } },
    { x: 2000, y: 220, width: 100, height: 100, texture: { src: "outside.png" } }
  ];
  assert.ok(await env.controller.captureLiveFrame(env.camera));
  assert.deepEqual(env.draws.map(draw => draw.src), ["visible.png"]);
});

test("scene padding is applied once to both tiles and tokens", async () => {
  const env = setup();
  env.scene.tokens = [{ x: 150, y: 250, width: 1, height: 1, texture: { src: "token.png" } }];
  await env.controller.captureLiveFrame(env.camera);
  assert.deepEqual(env.draws[0].args.slice(-4), [50, 50, 100, 100]);
});

test("scene foreground renders above lower tokens", async () => {
  const env = setup();
  env.scene.foreground = "roof.png";
  env.scene.foregroundElevation = 10;
  env.scene.tokens = [{ x: 150, y: 250, width: 1, height: 1, elevation: 0, texture: { src: "token.png" } }];
  await env.controller.captureLiveFrame(env.camera);
  assert.deepEqual(env.draws.map(draw => draw.src), ["token.png", "roof.png"]);
});

test("offline, restricted and static feeds never capture scene pixels", async () => {
  const env = setup({ background: "private.png" });
  for (const change of [{ status: "offline" }, { status: "restricted" }, { feedSource: "image" }]) {
    assert.equal(await env.controller.captureLiveFrame({ ...env.camera, ...change }), "");
  }
  assert.equal(env.draws.length, 0);
});

test("simultaneous requests and preview reuse one encoded frame", async () => {
  const env = setup({ background: "background.png" });
  await Promise.all(Array.from({ length: 8 }, () => env.controller.captureLiveFrame(env.camera)));
  assert.equal(env.encoded, 1);
  env.controller.invalidateFrames();
  await env.controller.captureLiveFrame(env.camera);
  assert.equal(env.encoded, 2);
});

test("stopping a broadcast suppresses a pending frame", async () => {
  const env = setup({ background: "background.png", deferred: true });
  env.controller.startBroadcastLiveRefresh(env.camera);
  await new Promise(resolve => setImmediate(resolve));
  env.controller.stopBroadcastLiveRefresh();
  env.pending.forEach(resolve => resolve());
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(env.broadcasts.length, 0);
  assert.equal(env.intervals.size, 0);
});

test("stopping local preview suppresses completion and timers", async () => {
  const env = setup({ background: "background.png", deferred: true });
  let updates = 0;
  const target = { camera: env.camera, rendered: true, updateLiveFrame() { updates++; } };
  env.controller.startLocalLiveRefresh(target);
  await new Promise(resolve => setImmediate(resolve));
  env.controller.stopLocalLiveRefresh(target);
  env.pending.forEach(resolve => resolve());
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(updates, 0);
  assert.equal(env.intervals.size, 0);
});

test("elevated roofs draw above tokens; same-elevation tile sort is stable", () => {
  const entries = getSceneDrawOrder([{ id: "roof", elevation: 10 }, { id: "second", sort: 2 }, { id: "first", sort: 1 }, { id: "secret", hidden: true }], [{ id: "token", elevation: 0 }]);
  assert.deepEqual(entries.map(entry => entry.document.id), ["first", "second", "token", "roof"]);
});

test("rotation, mirroring, opacity and texture fit preserve geometry", () => {
  const geometry = getTileGeometry({ x: 10, y: 20, width: 100, height: 50, rotation: 90, alpha: 0.4, texture: { scaleX: -2, scaleY: 1 } });
  assert.equal(geometry.cx, 60);
  assert.equal(geometry.cy, 45);
  assert.equal(geometry.scaleX, -2);
  assert.equal(geometry.alpha, 0.4);
  assert.ok(Math.abs(geometry.bounds.width - 50) < 0.001);
  assert.ok(Math.abs(geometry.bounds.height - 200) < 0.001);
  const fit = getTileGeometry({ width: 100, height: 100, texture: { fit: "contain" } }, { naturalWidth: 200, naturalHeight: 100 });
  assert.equal(fit.height, 50);
});

test("access checks use the requester, not the GM executing the handler", () => {
  globalThis.game = { user: { isGM: true } };
  assert.equal(canUserAccessCamera({ isGM: false }, { status: "restricted" }), false);
  assert.equal(canUserAccessCamera({ isGM: false }, { status: "offline" }), false);
  assert.equal(canUserAccessCamera(null, { status: "online" }), false);
  assert.equal(canUserAccessCamera({ isGM: false }, { status: "online" }), true);
  assert.equal(canUserAccessCamera({ isGM: true }, { status: "restricted" }), true);
});

test("failed frame work can retry and invalidation cannot resurrect stale cache entries", async () => {
  const cache = createFrameCache();
  await assert.rejects(cache.get("camera", async () => { throw new Error("failed"); }));
  assert.equal(await cache.get("camera", async () => "fresh"), "fresh");
  let complete;
  const old = cache.get("other", () => new Promise(resolve => { complete = resolve; }));
  await Promise.resolve();
  cache.clear();
  complete("old");
  await old;
  assert.equal(await cache.get("other", async () => "new"), "new");
});
