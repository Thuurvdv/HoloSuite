import assert from "node:assert/strict";
import test from "node:test";
import { build } from "esbuild";

const compiled = await build({
  stdin: { contents: 'export * from "./performance"; export * from "./frame-scheduler"; export * from "./media-cache";',
    resolveDir: new URL(".", import.meta.url).pathname.replace(/^\/([A-Z]:)/i, "$1"), loader: "ts" },
  bundle: true, write: false, format: "esm", platform: "node"
});
const { getCameraPerformance, createFrameScheduler, createMediaCache, webPAnimationFlag } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString("base64")}`);
const settle = () => new Promise(resolve => setImmediate(resolve));

function environment(t) {
  let now = 10000, id = 0;
  const intervals = new Map(), timeouts = new Map(), events = new Map(), media = [];
  t.mock.method(Date, "now", () => now);
  globalThis.window = {
    setInterval(fn) { intervals.set(++id, fn); return id; }, clearInterval(key) { intervals.delete(key); },
    setTimeout(fn) { timeouts.set(++id, fn); return id; }, clearTimeout(key) { timeouts.delete(key); }
  };
  globalThis.document = { visibilityState: "visible", addEventListener(name, fn) { events.set(name, fn); }, createElement() { return new FakeMedia(true); } };
  class FakeMedia {
    naturalWidth = 100; naturalHeight = 100; videoWidth = 100; videoHeight = 100;
    paused = true; plays = 0; removed = false;
    constructor(video = false) { this.tagName = video ? "VIDEO" : "IMG"; media.push(this); }
    set src(value) { this.path = value; queueMicrotask(() => this.tagName === "VIDEO" ? this.onloadeddata?.() : this.onload?.()); }
    get src() { return this.path; }
    play() { this.paused = false; this.plays++; return Promise.resolve(); }
    pause() { this.paused = true; }
    removeAttribute() { this.removed = true; }
    load() {}
  }
  globalThis.Image = FakeMedia;
  return { intervals, timeouts, events, media, advance(ms) { now += ms; }, tick() { for (const fn of [...intervals.values()]) fn(); } };
}

test("presets have bounded resolutions and useful low-power refresh rates", () => {
  assert.deepEqual(getCameraPerformance("low", false), { maxDimension: 480, interval: 2500, quality: .65, animateVideo: false });
  assert.equal(getCameraPerformance("balanced").maxDimension, 640);
  assert.equal(getCameraPerformance("high").maxDimension, 960);
  assert.deepEqual(getCameraPerformance("unknown"), getCameraPerformance("balanced"));
});

test("scene invalidations cannot exceed the quality preset's capture rate", async t => {
  const env = environment(t);
  let captures = 0;
  const scheduler = createFrameScheduler({ capture: async () => String(++captures), interval: () => 1500, idle() {}, error: assert.fail });
  scheduler.subscribe({ id: "camera" }, "viewer", () => {});
  await settle();
  for (let i = 0; i < 5; i++) { env.advance(100); scheduler.invalidate(); }
  await settle();
  assert.equal(captures, 1);
  env.advance(1000); env.tick(); await settle();
  assert.equal(captures, 2);
  scheduler.unsubscribe("viewer");
  assert.equal(env.intervals.size, 0);
});

test("hidden tabs and minimized consumers suspend capture and resume without a new producer", async t => {
  const env = environment(t);
  let captures = 0, minimized = false, idle = 0;
  const scheduler = createFrameScheduler({ capture: async () => String(++captures), interval: () => 1500, idle() { idle++; }, error: assert.fail });
  scheduler.subscribe({ id: "camera" }, "viewer", () => {}, () => !minimized);
  await settle();
  minimized = true; env.advance(2000); env.tick(); await settle();
  assert.equal(captures, 1);
  assert.ok(idle > 0);
  minimized = false; document.visibilityState = "hidden"; env.tick(); await settle();
  assert.equal(captures, 1);
  document.visibilityState = "visible"; env.events.get("visibilitychange")(); await settle();
  assert.equal(captures, 2);
});

test("unchanged frames are not delivered repeatedly and closing a viewer cancels pending delivery", async t => {
  const env = environment(t);
  let deliveries = 0, finish;
  const scheduler = createFrameScheduler({ capture: async () => "same", interval: () => 1500, idle() {}, error: assert.fail });
  scheduler.subscribe({ id: "camera" }, "viewer", () => { deliveries++; });
  await settle(); env.advance(2000); env.tick(); await settle();
  assert.equal(deliveries, 1);
  scheduler.unsubscribe("viewer");
  const pending = createFrameScheduler({ capture: () => new Promise(resolve => { finish = resolve; }), interval: () => 1500, idle() {}, error: assert.fail });
  pending.subscribe({ id: "camera" }, "viewer", () => { deliveries++; });
  pending.unsubscribe("viewer"); finish("late"); await settle();
  assert.equal(deliveries, 1);
});

test("a live remote consumer keeps a producer running after its local preview closes", async t => {
  const env = environment(t);
  let captures = 0, remote = 0;
  const scheduler = createFrameScheduler({ capture: async () => String(++captures), interval: () => 1500, idle() {}, error: assert.fail });
  scheduler.subscribe({ id: "camera" }, "local", () => {});
  scheduler.subscribe({ id: "camera" }, "remote", () => { remote++; });
  await settle(); scheduler.unsubscribe("local");
  env.advance(2000); env.tick(); await settle();
  assert.equal(captures, 2);
  assert.equal(remote, 2);
  scheduler.unsubscribe("remote");
  assert.equal(env.intervals.size, 0);
});

test("a hidden GM tab continues supplying visible remote viewers", async t => {
  const env = environment(t);
  let local = 0, remote = 0;
  const scheduler = createFrameScheduler({ capture: async () => String(Date.now()), interval: () => 1500, idle() {}, error: assert.fail });
  scheduler.subscribe({ id: "camera" }, "local", () => { local++; });
  scheduler.subscribe({ id: "camera" }, "remote", () => { remote++; }, () => true, true);
  await settle();
  document.visibilityState = "hidden";
  env.advance(2000); env.tick(); await settle();
  assert.equal(local, 1);
  assert.equal(remote, 2);
  scheduler.unsubscribe("local"); scheduler.unsubscribe("remote");
});

test("media cache evicts by decoded size while preserving media used by an in-flight frame", async t => {
  const env = environment(t);
  const cache = createMediaCache(45000);
  const first = cache.beginFrame();
  const image = await first.load("first.png");
  first.finish();
  const second = cache.beginFrame();
  await second.load("second.png");
  second.finish();
  assert.equal(image.src, "", "the older decoded image was released");
  assert.equal(env.media[1].src, "second.png");
  const pinned = cache.beginFrame();
  const kept = await pinned.load("second.png");
  env.advance(4000);
  for (const fn of [...env.timeouts.values()]) fn();
  assert.equal(kept.src, "second.png", "an in-use image is not disposed");
  pinned.finish(); cache.clear();
  assert.equal(kept.src, "");
});

test("video decoding starts on demand and stops immediately when consumers go idle", async t => {
  const env = environment(t);
  const cache = createMediaCache();
  const frame = cache.beginFrame();
  const video = await frame.load("tile.webm");
  assert.equal(video.plays, 0, "loading a frame does not start playback");
  await video.play(); frame.finish();
  cache.pauseVideos();
  assert.equal(video.paused, true);
  env.advance(4000);
  for (const fn of [...env.timeouts.values()]) fn();
  assert.equal(video.removed, true, "idle video resources are unloaded");
});

test("active camera assets are retained even when the working set exceeds the idle budget", async t => {
  const env = environment(t);
  const cache = createMediaCache(1);
  cache.retainOwners(new Set(["camera"]));
  const frame = cache.beginFrame("camera");
  const image = await frame.load("active.png");
  frame.finish();
  assert.equal(image.src, "active.png");
  cache.retainOwners(new Set());
  env.advance(4000);
  for (const fn of [...env.timeouts.values()]) fn();
  assert.equal(image.src, "");
});

test("media metadata keeps still WebP frames cacheable without freezing animated WebP", async t => {
  environment(t);
  t.mock.method(globalThis, "fetch", async (path, options) => {
    assert.equal(options.headers.Range, "bytes=0-31");
    const bytes = new Uint8Array(32);
    for (const [offset, text] of [[0, "RIFF"], [8, "WEBP"], [12, "VP8X"]]) bytes.set([...text].map(char => char.charCodeAt(0)), offset);
    bytes[20] = path.includes("animated") ? 2 : 0;
    return new Response(bytes);
  });
  const cache = createMediaCache();
  const frame = cache.beginFrame();
  assert.equal(cache.isAnimated(await frame.load("still.webp")), false);
  assert.equal(cache.isAnimated(await frame.load("animated.webp")), true);
  frame.finish(); cache.clear();
});

test("WebP header detection distinguishes static and animated assets", () => {
  const bytes = new Uint8Array(32);
  const put = (offset, text) => bytes.set([...text].map(char => char.charCodeAt(0)), offset);
  put(0, "RIFF"); put(8, "WEBP"); put(12, "VP8X");
  assert.equal(webPAnimationFlag(bytes), false);
  bytes[20] = 2;
  assert.equal(webPAnimationFlag(bytes), true);
  put(12, "VP8 ");
  assert.equal(webPAnimationFlag(bytes), false);
  assert.equal(webPAnimationFlag(new Uint8Array(2)), null);
});
