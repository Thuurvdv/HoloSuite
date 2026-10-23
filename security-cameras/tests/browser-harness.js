const results = [];
const assert = (value, message) => { if (!value) throw new Error(message); results.push(message); };
const waitFor = async (predicate) => { for (let i = 0; i < 100; i++) { if (predicate()) return; await new Promise(resolve => setTimeout(resolve, 30)); } throw new Error("Condition timed out"); };
const hooks = new Map();
const messages = [];
const generation = Number(new URL(location.href).searchParams.get("generation"));
const eventHooks = new Map();
globalThis.Hooks = {
  once: (name, fn) => hooks.set(name, fn),
  on(name, fn) { const listeners = eventHooks.get(name) ?? []; listeners.push(fn); eventHooks.set(name, listeners); },
  callAll(name, ...args) { for (const fn of eventHooks.get(name) ?? []) fn(...args); }
};
globalThis.ui = { notifications: { info() {}, warn() {}, error(message) { throw new Error(message); } } };
globalThis.Dialog = { confirm: async () => true };
window.confirm = () => true;
const colorImage = color => { const c = document.createElement("canvas"); c.width = c.height = 100; const ctx = c.getContext("2d"); ctx.fillStyle = color; ctx.fillRect(0, 0, 100, 100); return c.toDataURL(); };
const red = colorImage("#ff0000"), blue = colorImage("#0000ff"), green = colorImage("#00ff00");
const scene = { id: "scene", name: "Transit Hub", width: 800, height: 600, grid: { size: 100 }, background: { src: blue }, dimensions: { sceneX: 100, sceneY: 200, sceneWidth: 800, sceneHeight: 600 },
  tiles: [{ x: 150, y: 250, width: 100, height: 100, texture: { src: red } }], tokens: [], regions: { contents: [{ id: "entrance", name: "West Entrance" }], get(id) { return this.contents.find(region => region.id === id); } } };
const otherScene = { ...scene, id: "other", name: "Engineering", regions: { contents: [{ id: "region-other", name: "Reactor" }] } };
const users = [{ id: "gm", isGM: true, active: true }, { id: "player", isGM: false, active: true }];
let store = {};
const settingDefinitions = new Map();
const settingValues = new Map([["videoEffectIntensity", 40]]);
globalThis.game = { release: { generation }, user: users[0], users: { contents: users, get: id => users.find(user => user.id === id) }, scenes: { contents: [scene, otherScene], get: id => [scene, otherScene].find(entry => entry.id === id) },
  settings: {
    register(_module, key, definition) { settingDefinitions.set(key, definition); },
    get(_module, key) { return key === "cameras" ? store : settingValues.get(key) ?? settingDefinitions.get(key)?.default; },
    async set(_module, key, value) {
      if (key === "cameras") store = structuredClone(value);
      else settingValues.set(key, value);
      settingDefinitions.get(key)?.onChange?.(value);
    }
  }, modules: new Map([["security-cameras", {}]]), socket: { emit: (_channel, message) => messages.push(message), on() {} } };
globalThis.canvas = { scene: otherScene, dimensions: otherScene.dimensions, stage: { scale: { x: 1 } } };
const escape = value => { const el = document.createElement("span"); el.textContent = String(value); return el.innerHTML; };
class MockApplication {
  static get defaultOptions() { return {}; }
  constructor(options = {}) { this.options = { ...this.constructor.defaultOptions, ...options }; }
  async _renderInner(data) { return Handlebars.compile(await (await fetch(this.options.template)).text())(data); }
  async render() {
    const v2 = Boolean(this.constructor.PARTS);
    const options = v2 ? this.constructor.DEFAULT_OPTIONS : this.options;
    const context = v2 ? await this._prepareContext({}) : this.getData();
    const html = v2 ? await this._renderHTML(context, {}) : await this._renderInner(context);
    if (!this.element) {
      this.element = document.createElement("section");
      this.element.className = `application ${(options.classes || []).join(" ")}`;
      this.element.innerHTML = '<header class="window-header">Security Cameras</header><div class="window-content"></div>';
      const resize = document.createElement("div");
      resize.className = generation === 12 ? "window-resizable-handle" : "window-resize-handle";
      this.element.append(resize);
      document.body.append(this.element);
      this.setPosition(v2 ? options.position : options);
    }
    this.element.querySelector(".window-content").innerHTML = html;
    this.rendered = true;
    if (v2) this._onRender(context, {}); else this.activateListeners(this.element);
    return this;
  }
  activateListeners() {}
  _onRender() {}
  async _prepareContext() { return {}; }
  setPosition({ width, height, left, top }) {
    if (width) this.element.style.width = `${width}px`;
    if (height) this.element.style.height = `${height}px`;
    if (left !== undefined || top !== undefined) this.element.style.position = "fixed";
    if (left !== undefined) this.element.style.left = `${left}px`;
    if (top !== undefined) this.element.style.top = `${top}px`;
  }
  async close() { this.rendered = false; this.element?.remove(); return this; }
}
globalThis.Application = MockApplication;
globalThis.foundry = { utils: { mergeObject: (a, b) => ({ ...a, ...b }), randomID: () => crypto.randomUUID(), deepClone: value => structuredClone(value), escapeHTML: escape }, applications: { api: {
  ApplicationV2: MockApplication,
  HandlebarsApplicationMixin: Base => class extends Base { async _renderHTML(context) { return Handlebars.compile(await (await fetch(this.constructor.PARTS.main.template)).text())(context); } }
} } };

try {
  const module = await import("/test-module.js");
  hooks.get("init")(); hooks.get("ready")();
  const effectSetting = settingDefinitions.get("videoEffectIntensity");
  assert(effectSetting.config && effectSetting.scope === "world" && effectSetting.default === 50 && effectSetting.range.max === 200, "world settings default video effect intensity to 50%");
  assert(document.documentElement.style.getPropertyValue("--security-camera-effect-intensity") === "0.4", "saved video intensity is restored on ready");
  assert(settingDefinitions.get("cameraQuality").default === "balanced" && settingDefinitions.get("cameraQuality").scope === "world", "Balanced is the world camera quality default");
  assert(settingDefinitions.get("reducedEffects").scope === "client", "reduced effects are a personal setting");
  await game.settings.set("security-cameras", "videoEffectIntensity", 100);
  const api = game.securityCameras;
  const camera = { id: "lobby", name: "Lobby 01", sceneId: "scene", regionId: "entrance", location: "Transit Hub · West entrance", feedSource: "live", status: "online", regionX: 100, regionY: 200, regionWidth: 400, regionHeight: 300 };
  await api.registerCamera(camera);
  await api.openMonitor();
  const monitor = api.activeMonitor;
  await waitFor(() => monitor.lastFrameAt);
  assert(monitor.element.querySelector(".security-camera-preview-frame img").src.startsWith("data:"), "manager displays a live frame");
  assert(!monitor.element.querySelector("[data-camera-frame-health]"), "manager omits last frame stat");
  assert(monitor.element.querySelector("dl").textContent.includes("West Entrance"), "manager displays linked region name");
  let sourceForm = monitor.element.querySelector("form");
  assert(!sourceForm.elements.sceneId.disabled && !sourceForm.elements.regionId.disabled, "Live Canvas enables scene fields");
  sourceForm.elements.feedSource.value = "image";
  sourceForm.elements.feedSource.dispatchEvent(new Event("change", { bubbles: true }));
  assert(sourceForm.elements.sceneId.disabled && sourceForm.elements.regionId.disabled, "Static Image disables scene fields immediately");
  await monitor.render(true);
  sourceForm = monitor.element.querySelector("form");
  assert(sourceForm.elements.sceneId.disabled && sourceForm.elements.regionId.disabled, "disabled scene fields survive rerender");
  await module.saveCameraFromForm(sourceForm);
  assert(api.getCamera("lobby").sceneId === "scene" && api.getCamera("lobby").regionId === "entrance", "saving disabled scene fields preserves linked scene and region");
  sourceForm = monitor.element.querySelector("form");
  sourceForm.elements.feedSource.value = "live";
  sourceForm.elements.feedSource.dispatchEvent(new Event("change", { bubbles: true }));
  assert(!sourceForm.elements.sceneId.disabled && !sourceForm.elements.regionId.disabled, "switching back to Live Canvas enables scene fields");
  const controller = module.createLiveFrameController({ normalizeCamera: value => value, applyLinkedRegionBounds: value => value, getSceneById: () => scene, getSceneBackgroundPath: () => scene.background.src, moduleId: "test", isFrameProducer: () => true,
    getPerformance: () => ({ maxDimension: 960, interval: 1250, quality: .72, animateVideo: game.settings.get("security-cameras", "animateVideoTiles") }) });
  const pixel = async (frame, x, y) => { const img = new Image(); img.src = frame; await img.decode(); const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; const ctx = c.getContext("2d"); ctx.drawImage(img, 0, 0); return [...ctx.getImageData(x, y, 1, 1).data]; };
  const synchronousEncode = HTMLCanvasElement.prototype.toDataURL;
  let frame;
  HTMLCanvasElement.prototype.toDataURL = () => { throw new Error("Synchronous encoding must not be used"); };
  try { frame = await controller.captureLiveFrame(camera); }
  finally { HTMLCanvasElement.prototype.toDataURL = synchronousEncode; }
  assert(frame.startsWith("data:image/"), "asynchronous encoding preserves the socket-compatible data URL format");
  let rgb = await pixel(frame, 80, 80);
  assert(rgb[0] > 220 && rgb[2] < 30, "inactive scene tile pixels appear above background");
  scene.background.src = "";
  controller.invalidateFrames();
  frame = await controller.captureLiveFrame(camera);
  rgb = await pixel(frame, 80, 80);
  assert(rgb[0] > 220, "tile-only scene produces a frame");
  scene.tiles.push({ x: 150, y: 250, width: 100, height: 100, hidden: true, elevation: 20, texture: { src: green } });
  controller.invalidateFrames();
  rgb = await pixel(await controller.captureLiveFrame(camera), 80, 80);
  assert(rgb[0] > 220 && rgb[1] < 30, "hidden tile pixels are excluded");
  scene.tiles.push({ x: 150, y: 250, width: 100, height: 100, elevation: 10, alpha: 0.5, texture: { src: blue } });
  controller.invalidateFrames();
  rgb = await pixel(await controller.captureLiveFrame(camera), 80, 80);
  assert(rgb[0] > 90 && rgb[2] > 90, "elevated translucent tile blends above lower tile");
  scene.tiles.pop();
  scene.background.src = blue;

  const videoCanvas = document.createElement("canvas");
  videoCanvas.width = videoCanvas.height = 100;
  const videoContext = videoCanvas.getContext("2d");
  const stream = videoCanvas.captureStream(10);
  const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  const chunks = [];
  recorder.ondataavailable = event => chunks.push(event.data);
  const stopped = new Promise(resolve => { recorder.onstop = resolve; });
  recorder.start();
  videoContext.fillStyle = "#00ff00";
  videoContext.fillRect(0, 0, 100, 100);
  await new Promise(resolve => setTimeout(resolve, 250));
  recorder.stop();
  await stopped;
  stream.getTracks().forEach(track => track.stop());
  const videoUrl = URL.createObjectURL(new Blob(chunks, { type: "video/webm" }));
  scene.tiles.push({ x: 150, y: 250, width: 100, height: 100, elevation: 30, texture: { src: `${videoUrl}#clip.webm` }, video: { autoplay: true, loop: true } });
  controller.invalidateFrames();
  const playVideo = HTMLMediaElement.prototype.play;
  let decodedVideo;
  HTMLMediaElement.prototype.play = function(...args) { if (this.src.startsWith(videoUrl)) decodedVideo = this; return playVideo.apply(this, args); };
  try { rgb = await pixel(await controller.captureLiveFrame(camera), 80, 80); }
  finally { HTMLMediaElement.prototype.play = playVideo; }
  assert(rgb[1] > 200 && rgb[0] < 40, "video tile supplies decoded pixels");
  assert(decodedVideo && !decodedVideo.paused, "video tiles play only when requested by a live capture");
  await game.settings.set("security-cameras", "animateVideoTiles", false);
  controller.reconfigure();
  await controller.captureLiveFrame(camera);
  assert(decodedVideo.paused, "disabling video playback stops the decoder and keeps a still frame");
  await game.settings.set("security-cameras", "animateVideoTiles", true);
  scene.tiles.pop();
  URL.revokeObjectURL(videoUrl);

  let form = monitor.element.querySelector("form");
  form.elements.sceneId.value = "other";
  form.elements.sceneId.dispatchEvent(new Event("change", { bubbles: true }));
  assert(form.elements.regionId.options[1].value === "region-other", "changing scene refreshes region choices");
  assert(form.elements.regionX.value === "", "changing scene clears stale bounds");
  form.elements.name.value = "Unsaved camera title";
  form.elements.name.dispatchEvent(new Event("input", { bubbles: true }));
  await monitor.render(true);
  form = monitor.element.querySelector("form");
  assert(form.elements.name.value === "Unsaved camera title", "draft survives manager rerender");
  window.confirm = () => false;
  await monitor.close();
  assert(api.activeMonitor === monitor && monitor.rendered, "cancelled discard keeps manager open");
  window.confirm = () => true;
  form.elements.sceneId.value = "scene";
  form.elements.sceneId.dispatchEvent(new Event("change", { bubbles: true }));
  await module.saveCameraFromForm(form);
  assert(api.getCamera("lobby").name === "Unsaved camera title", "save persists draft");
  form = monitor.element.querySelector("form");
  form.elements.name.value = "Saved and broadcast";
  form.elements.name.dispatchEvent(new Event("input", { bubbles: true }));
  form.querySelector('[data-security-camera-action="save-show"]').click();
  await waitFor(() => api.activeFeed?.camera?.name === "Saved and broadcast");
  assert(api.getCamera("lobby").name === "Saved and broadcast", "Save & Show broadcasts the edited camera");
  await api.showFeed("lobby");
  assert(messages.some(message => message.action === "showFeed" && message.liveFrame), "broadcast sends initial frame");
  assert(api.activeFeed.liveFrame, "GM feed opens with frame");
  const previousFrame = api.activeFeed.liveFrame;
  scene.tiles[0].texture.src = green;
  Hooks.callAll("updateTile", { parent: scene });
  await waitFor(() => api.activeFeed.liveFrame !== previousFrame);
  const updatedPixel = await pixel(api.activeFeed.liveFrame, 80, 80);
  assert(updatedPixel[1] > 200 && updatedPixel[0] < 40, "scene edit hooks refresh cached frames with changed tile pixels");
  scene.tiles[0].texture.src = red;
  Hooks.callAll("updateTile", { parent: scene });
  const feedElement = api.activeFeed.element;
  await game.settings.set("security-cameras", "reducedEffects", true);
  assert(getComputedStyle(feedElement.querySelector(".security-camera-feed-static")).display === "none" && getComputedStyle(feedElement.querySelector(".security-camera-feed-scanline")).display === "none", "personal reduced effects remove full-window animated layers");
  assert(getComputedStyle(feedElement.querySelector(".security-camera-feed-frame img")).filter === "none" && getComputedStyle(feedElement.querySelector(".security-camera-rec i")).animationName === "none", "personal reduced effects remove image filters and flicker");
  await game.settings.set("security-cameras", "reducedEffects", false);
  const staticLayer = feedElement.querySelector(".security-camera-feed-static");
  const scanlineLayer = feedElement.querySelector(".security-camera-feed-scanline");
  await game.settings.set("security-cameras", "videoEffectIntensity", 50);
  assert(Math.abs(Number(getComputedStyle(staticLayer).opacity) - .09) < .001 && Math.abs(Number(getComputedStyle(scanlineLayer).opacity) - .175) < .001, "50% halves static and scanline strength in an open feed");
  assert(Math.abs(Number(getComputedStyle(monitor.element.querySelector(".security-camera-preview-frame"), "::after").opacity) - .5) < .001, "intensity also updates manager preview effects");
  await game.settings.set("security-cameras", "videoEffectIntensity", 200);
  assert(Math.abs(Number(getComputedStyle(staticLayer).opacity) - .36) < .001, "200% doubles static strength");
  await game.settings.set("security-cameras", "videoEffectIntensity", 0);
  assert(Number(getComputedStyle(staticLayer).opacity) === 0 && Number(getComputedStyle(scanlineLayer).opacity) === 0 && getComputedStyle(feedElement.querySelector(".security-camera-feed-frame img")).filter === "none", "0% removes static, scanlines and image filtering");
  assert(getComputedStyle(feedElement.querySelector(".security-camera-rec i")).animationName === "none", "0% stops screen flicker animations");
  assert(api.activeFeed.element === feedElement && api.activeFeed.liveFrame, "changing intensity preserves the open feed and its live image");
  await game.settings.set("security-cameras", "videoEffectIntensity", 100);
  assert(!feedElement.querySelector("[data-camera-frame-health]"), "live feed omits last frame stat");
  assert(getComputedStyle(feedElement.querySelector(".window-header")).display === "none", "feed titlebar is hidden");
  assert(parseFloat(getComputedStyle(feedElement).borderRadius) >= 30, "feed popup has strongly rounded corners");
  const closeButton = feedElement.querySelector("[data-security-camera-close]");
  assert(closeButton.textContent.trim() === "" && closeButton.getAttribute("aria-label"), "close button is icon-only with an accessible name");
  assert(parseFloat(getComputedStyle(feedElement.querySelector("[data-security-camera-drag] span")).opacity) < .5, "drag grip has low opacity");
  for (const [label, root] of [["manager", monitor.element], ["feed", feedElement]]) {
    const resizeHandle = root.querySelector(".window-resizable-handle,.window-resize-handle");
    const cyan = document.createElement("span");
    cyan.style.color = "var(--hs-cyan)";
    root.append(cyan);
    const expected = getComputedStyle(cyan).color;
    const handleStyle = getComputedStyle(resizeHandle);
    assert(handleStyle.color === expected && handleStyle.borderColor === expected, `${label} resize handle stays cyan over competing red styles`);
    assert(handleStyle.filter === "none" && handleStyle.backgroundColor !== "rgb(255, 0, 0)", `${label} resize handle removes native red fill and filter`);
    for (const pseudo of ["::before", "::after"]) {
      const style = getComputedStyle(resizeHandle, pseudo);
      assert(style.borderRightColor === expected && style.borderBottomColor === expected && style.backgroundColor === "rgba(0, 0, 0, 0)" && style.filter === "none", `${label} resize artwork ${pseudo} uses cyan without red background`);
    }
    cyan.remove();
  }
  const beforeMove = feedElement.getBoundingClientRect();
  feedElement.querySelector("[data-security-camera-drag]").dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  assert(Math.abs(feedElement.getBoundingClientRect().left - beforeMove.left - 10) < 1, "top handle moves feed with arrow keys");
  const closeBounds = feedElement.querySelector("[data-security-camera-close]").getBoundingClientRect();
  const feedBounds = feedElement.getBoundingClientRect();
  assert(Math.abs(closeBounds.left + closeBounds.width / 2 - feedBounds.left - feedBounds.width / 2) < 2, "close button is centered at the bottom");
  feedElement.querySelector("[data-security-camera-close]").click();
  await waitFor(() => !api.activeFeed);
  assert(!api.activeFeed, "bottom close button closes the feed");
  await api.showFeed("lobby");
  await game.settings.set("security-cameras", "videoEffectIntensity", 200);
  await api.registerCamera({ ...api.getCamera("lobby"), status: "clean" });
  await waitFor(() => api.activeFeed?.camera?.status === "clean" && api.activeFeed?.liveFrame);
  const cleanFeed = api.activeFeed.element;
  assert(api.getCamera("lobby").status === "clean" && monitor.element.querySelector('select[name="status"]').value === "clean", "Clean status persists and appears in the editor");
  assert(cleanFeed.querySelector(".security-camera-signal strong").textContent === "SIGNAL LOCK", "Clean camera remains online");
  for (const selector of [".security-camera-feed-static", ".security-camera-feed-scanline"]) {
    assert(getComputedStyle(cleanFeed.querySelector(selector)).display === "none", `Clean hides ${selector}`);
  }
  assert(getComputedStyle(cleanFeed.querySelector(".security-camera-feed-frame"), "::after").display === "none", "Clean removes the screen tint overlay");
  assert(getComputedStyle(cleanFeed.querySelector(".security-camera-feed-frame img")).filter === "none", "Clean displays unfiltered camera pixels");
  assert(getComputedStyle(monitor.element.querySelector(".security-camera-preview-frame"), "::after").display === "none", "Clean removes manager preview scanlines");
  await api.registerCamera({ ...api.getCamera("lobby"), feedSource: "image", image: blue });
  assert(api.activeFeed.camera.status === "clean" && api.activeFeed.element.querySelector(".security-camera-feed-frame img"), "Clean supports static image feeds");
  await api.registerCamera({ ...api.getCamera("lobby"), feedSource: "live", status: "online" });
  assert(getComputedStyle(api.activeFeed.element.querySelector(".security-camera-feed-static")).display !== "none", "switching to Online restores screen effects");
  await game.settings.set("security-cameras", "videoEffectIntensity", 100);
  await api.registerCamera({ ...api.getCamera("lobby"), status: "restricted" });
  assert(api.activeFeed.camera.status === "restricted" && !api.activeFeed.liveFrame, "restricting a camera clears existing local image");
  const count = messages.length;
  await module.handleSocketMessage({ action: "requestLiveFrame", userId: "player", cameraId: "lobby" });
  assert(messages.length === count, "GM rejects restricted player frame request");
  assert(messages.some(message => message.action === "cameraChanged" && message.camera.status === "restricted"), "status changes propagate to players");
  await api.registerCamera({ ...api.getCamera("lobby"), status: "online" });
  await module.handleSocketMessage({ action: "requestLiveFrame", userId: "player", cameraId: "lobby" });
  await waitFor(() => messages.some(message => message.action === "updateFeedFrame" && message.recipientUserId === "player" && message.liveFrame));
  const response = messages.findLast(message => message.action === "updateFeedFrame" && message.recipientUserId === "player");
  assert(response?.revision && response.liveFrame, "online player request receives versioned frame");
  await module.handleSocketMessage({ action: "requestLiveFrame", userId: "player", cameraId: "lobby", hasFrame: true });
  await waitFor(() => messages.some(message => message.action === "updateFeedFrame" && message.recipientUserId === "player" && message.frameUnchanged));
  assert(!messages.findLast(message => message.frameUnchanged).liveFrame, "subscription renewals use a small heartbeat for unchanged frames");
  users.push({ id: "player-two", isGM: false, active: true });
  await module.handleSocketMessage({ action: "requestLiveFrame", userId: "player-two", cameraId: "lobby" });
  await waitFor(() => messages.some(message => message.action === "updateFeedFrame" && message.recipientUserId === "player-two" && message.liveFrame));
  const intendedFor = (message, id) => message.recipientUserId === id || message.recipientUserIds?.includes(id);
  const deliveredBeforeEdit = messages.filter(message => message.action === "updateFeedFrame" && intendedFor(message, "player") && message.liveFrame).length;
  const messagesBeforeEdit = messages.length;
  scene.tiles[0].texture.src = green;
  Hooks.callAll("updateTile", { parent: scene });
  await waitFor(() => messages.filter(message => message.action === "updateFeedFrame" && intendedFor(message, "player") && message.liveFrame).length > deliveredBeforeEdit);
  assert(true, "subscribed viewers receive changed frames without polling");
  const sharedUpdates = messages.slice(messagesBeforeEdit).filter(message => message.action === "updateFeedFrame" && message.liveFrame);
  assert(sharedUpdates.length === 1 && intendedFor(sharedUpdates[0], "player") && intendedFor(sharedUpdates[0], "player-two"), "multiple viewers receive one shared image payload per camera update");
  await module.handleSocketMessage({ action: "unsubscribeFeed", userId: "player", cameraId: "lobby" });
  const afterUnsubscribe = messages.filter(message => message.action === "updateFeedFrame" && intendedFor(message, "player")).length;
  scene.tiles[0].texture.src = red;
  Hooks.callAll("updateTile", { parent: scene });
  await new Promise(resolve => setTimeout(resolve, 1800));
  assert(messages.filter(message => message.action === "updateFeedFrame" && intendedFor(message, "player")).length === afterUnsubscribe, "unsubscribing stops remote frame delivery");
  await module.handleSocketMessage({ action: "unsubscribeFeed", userId: "player-two", cameraId: "lobby" });
  users.pop();
  game.user = users[1];
  await module.handleSocketMessage({ action: "cameraChanged", gmUserId: "gm", cameraId: "lobby", camera: { ...api.getCamera("lobby"), status: "restricted" } });
  await module.handleSocketMessage(response);
  assert(api.activeFeed.camera.status === "restricted" && !api.activeFeed.liveFrame, "late frame cannot restore a restricted player feed");
  game.user = users[0];
  await api.deleteCamera("lobby");
  assert(!api.activeFeed && messages.some(message => message.action === "cameraChanged" && message.camera === null), "deleting camera closes feed and notifies players");
  api.closeFeed();
  await api.registerCamera({ ...camera, name: "Lobby 01", notes: "Monitor the west entrance. Elevated tiles retain their opacity; hidden tiles are excluded." });
  await waitFor(() => api.activeMonitor.lastFrameAt);
  window.testResult = { passed: results.length, checks: results };
} catch (error) { window.testResult = { error: error.stack, checks: results }; }
