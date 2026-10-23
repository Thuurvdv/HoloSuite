// Browser integration harness: real DOM, templates and canvas; mocked Foundry services.
// Run with CHROME_PATH set if Chrome is not installed at the default Windows path.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";
import { spawn } from "node:child_process";
import { build } from "esbuild";

const root = fileURLToPath(new URL("../", import.meta.url));
const artifacts = path.resolve(root, "../.tmp-tests/security-camera-browser");
await fs.mkdir(artifacts, { recursive: true });
const main = await fs.readFile(path.join(root, "src/main.ts"), "utf8");
const bundle = await build({ stdin: { contents: main + '\nexport { saveCameraFromForm, handleSocketMessage, getMonitorContext }; export { createLiveFrameController } from "./live-frame";', resolveDir: path.join(root, "src"), loader: "ts" }, bundle: true, write: false, format: "esm" });
const files = new Map([
  ["/test-module.js", bundle.outputFiles[0].text],
  ["/harness.js", await fs.readFile(path.join(root, "tests/browser-harness.js"), "utf8")],
  ["/handlebars.js", await fs.readFile(path.resolve(root, "../node_modules/handlebars/dist/handlebars.js"), "utf8")],
  ["/tokens.css", await fs.readFile(path.join(root, "styles/holosuite-tokens.css"), "utf8")],
  ["/manager.css", await fs.readFile(path.join(root, "styles/security-camera-manager.css"), "utf8")],
  ["/style.css", await fs.readFile(path.join(root, "styles/security-camera-system.css"), "utf8")]
]);
for (const name of ["monitor", "feed"]) files.set(`/modules/security-cameras/templates/${name}.hbs`, await fs.readFile(path.join(root, `templates/${name}.hbs`), "utf8"));
files.set("/", `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/manager.css"><style>
*{box-sizing:border-box}body{margin:20px;background:#080f18;color:#d8edf5;font-family:Arial,sans-serif}.application{display:flex;flex-direction:column;border:1px solid #365468;margin-bottom:20px;max-width:calc(100vw - 40px)}.window-content{display:flex;flex-direction:column;flex:1;min-height:0}.window-header{padding:10px;background:#182535;font-weight:bold}button,input,select,textarea{font:inherit}button{cursor:pointer}button:disabled{opacity:.5}input,select{height:32px}button{border-radius:3px}h2,h3{border:0}
/* Simulate competing native/system styles, including the red pseudo-element artwork. */
.application :is(.window-resizable-handle,.window-resize-handle){position:absolute;right:8px;bottom:8px;color:red!important;border-color:red!important;background:red!important;filter:sepia(1)!important}
.application :is(.window-resizable-handle,.window-resize-handle)::before,.application :is(.window-resizable-handle,.window-resize-handle)::after{background:red!important;border-color:red!important;filter:sepia(1)!important}
</style><script src="/handlebars.js"></script></head><body><script type="module" src="/harness.js"></script></body></html>`);
const server = http.createServer((req, res) => {
  const route = new URL(req.url, "http://localhost").pathname;
  const body = files.get(route);
  if (body === undefined) { res.writeHead(404); res.end(); return; }
  res.setHeader("Content-Type", route.endsWith(".js") ? "text/javascript" : route.endsWith(".css") ? "text/css" : "text/html");
  res.end(body);
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const browser = spawn(process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--remote-debugging-port=0", `--user-data-dir=${path.join(artifacts, "profile")}`, "about:blank"], { windowsHide: true, stdio: ["ignore", "ignore", "pipe"] });
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Browser startup timed out")), 20000);
    browser.once("error", reject);
    browser.stderr.on("data", chunk => { const match = chunk.toString().match(/DevTools listening on (ws:\/\/[^\s]+)/); if (match) { clearTimeout(timer); resolve(match[1]); } });
  });
  socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let nextId = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => { const msg = JSON.parse(data); if (msg.id) { const p = pending.get(msg.id); pending.delete(msg.id); msg.error ? p.reject(new Error(JSON.stringify(msg.error))) : p.resolve(msg.result); } };
  const call = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const id = ++nextId; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params, sessionId })); });
  const { targetId } = await call("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await call("Target.attachToTarget", { targetId, flatten: true });
  const pageCall = (method, params) => call(method, params, sessionId);
  await pageCall("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1050, deviceScaleFactor: 1, mobile: false });
  const results = [];
  for (const generation of [12, 13, 14]) {
    await pageCall("Page.navigate", { url: `http://127.0.0.1:${server.address().port}/?generation=${generation}` });
    let result;
    for (let attempt = 0; attempt < 300; attempt++) {
      const evaluated = await pageCall("Runtime.evaluate", { expression: "window.testResult", returnByValue: true });
      result = evaluated.result?.value;
      if (result) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (!result) throw new Error("Browser tests timed out");
    results.push({ generation, ...result });
    const screenshot = await pageCall("Page.captureScreenshot", { format: "png" });
    await fs.writeFile(path.join(artifacts, `manager-v${generation}.png`), Buffer.from(screenshot.data, "base64"));
    if (result.error) throw new Error(JSON.stringify(result));
    for (const width of [700, 430]) {
      await pageCall("Runtime.evaluate", { expression: `game.securityCameras.activeMonitor.setPosition({width:${width},height:740})` });
      const layout = await pageCall("Runtime.evaluate", { expression: `(() => {const el=game.securityCameras.activeMonitor.element.querySelector('.window-content'); return {width:el.clientWidth,scrollWidth:el.scrollWidth,scrollHeight:el.scrollHeight,height:el.clientHeight,panels:[...el.querySelectorAll('.security-camera-monitor-list,.security-camera-monitor-preview,.security-camera-editor')].map(panel=>{const r=panel.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})};})()`, returnByValue: true });
      if (layout.result.value.scrollWidth > layout.result.value.width + 1) throw new Error(`Horizontal overflow: ${JSON.stringify(layout.result.value)}`);
      const panels = layout.result.value.panels;
      for (let a = 0; a < panels.length; a++) for (let b = a + 1; b < panels.length; b++) {
        const p = panels[a], q = panels[b];
        if (!(p.x + p.w <= q.x + 1 || q.x + q.w <= p.x + 1 || p.y + p.h <= q.y + 1 || q.y + q.h <= p.y + 1)) {
          throw new Error(`Overlapping panels at ${width}px`);
        }
      }
      const image = await pageCall("Page.captureScreenshot", { format: "png" });
      await fs.writeFile(path.join(artifacts, `manager-v${generation}-${width}.png`), Buffer.from(image.data, "base64"));
    }
    await pageCall("Runtime.evaluate", { expression: `(async () => {game.securityCameras.activeMonitor.element.style.display='none'; await game.securityCameras.showFeed('lobby'); game.securityCameras.activeFeed.setPosition({left:100,top:80});})()`, awaitPromise: true });
    await pageCall("Runtime.evaluate", { expression: `new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))`, awaitPromise: true });
    const handleResult = await pageCall("Runtime.evaluate", { expression: `(() => {const r=game.securityCameras.activeFeed.element.querySelector('[data-security-camera-drag]').getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};})()`, returnByValue: true });
    const handle = handleResult.result.value;
    await pageCall("Page.bringToFront");
    await pageCall("Input.dispatchMouseEvent", { type: "mouseMoved", x: handle.x, y: handle.y });
    await pageCall("Input.dispatchMouseEvent", { type: "mousePressed", x: handle.x, y: handle.y, button: "left", buttons: 1, clickCount: 1 });
    await pageCall("Input.dispatchMouseEvent", { type: "mouseMoved", x: handle.x + 70, y: handle.y + 40, buttons: 1 });
    await pageCall("Input.dispatchMouseEvent", { type: "mouseReleased", x: handle.x + 70, y: handle.y + 40, button: "left", clickCount: 1 });
    const moved = await pageCall("Runtime.evaluate", { expression: `(() => {const r=game.securityCameras.activeFeed.element.getBoundingClientRect();return {left:r.left,top:r.top};})()`, returnByValue: true });
    if (Math.abs(moved.result.value.left - 170) > 1 || Math.abs(moved.result.value.top - 120) > 1) {
      throw new Error(`Feed drag failed: ${JSON.stringify(moved.result.value)}`);
    }
    results.at(-1).checks.push("top-center handle drags popup with mouse");
    results.at(-1).passed++;
    const feedImage = await pageCall("Page.captureScreenshot", { format: "png" });
    await fs.writeFile(path.join(artifacts, `feed-v${generation}.png`), Buffer.from(feedImage.data, "base64"));
    await pageCall("Runtime.evaluate", { expression: `(async () => {game.securityCameras.activeFeed.camera.displayMode='picture-in-picture';await game.securityCameras.activeFeed.render(true);})()`, awaitPromise: true });
    const pipLayout = await pageCall("Runtime.evaluate", { expression: `(() => {const el=game.securityCameras.activeFeed.element;const close=el.querySelector('[data-security-camera-close]').getBoundingClientRect();const r=el.getBoundingClientRect();return {bottom:r.bottom,closeBottom:close.bottom,viewport:innerHeight};})()`, returnByValue: true });
    if (pipLayout.result.value.closeBottom > pipLayout.result.value.bottom || pipLayout.result.value.bottom > pipLayout.result.value.viewport) throw new Error(`PiP close button is clipped: ${JSON.stringify(pipLayout.result.value)}`);
    results.at(-1).checks.push("PiP close button stays visible inside the popup");
    results.at(-1).passed++;
    const pipImage = await pageCall("Page.captureScreenshot", { format: "png" });
    await fs.writeFile(path.join(artifacts, `feed-pip-v${generation}.png`), Buffer.from(pipImage.data, "base64"));
  }
  await fs.writeFile(path.join(artifacts, "results.json"), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await call("Browser.close");
} finally {
  socket?.close();
  browser.kill();
  server.close();
}



