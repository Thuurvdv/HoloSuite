import test from "node:test";
import assert from "node:assert/strict";
import { createGalaxyMapViewClass } from "../src/view-app.ts";

globalThis.HTMLElement = class {};
globalThis.window = { innerHeight: 1000 };
globalThis.ResizeObserver = class {
  constructor(callback) { this.callback = callback; }
  observe() {}
  disconnect() {}
};
globalThis.foundry = { applications: { api: {
  ApplicationV2: class {
    _attachPartListeners() {}
    _onRender() {}
    async close() { this.element = null; }
  },
  HandlebarsApplicationMixin: Base => Base
} } };

const View = createGalaxyMapViewClass({ clearMapView() {} });

function fixture({ cached = true, custom = true } = {}) {
  const positions = [];
  const loads = [];
  const frame = { getBoundingClientRect: () => ({ width: 900, height: 600 }) };
  const stage = {
    dataset: {}, isConnected: false,
    matches: selector => selector === ".gmf-map-stage",
    closest: () => frame,
    getBoundingClientRect: () => ({ width: 800, height: 400 }),
    addEventListener() {}
  };
  const background = {
    naturalWidth: cached ? 1600 : 0, naturalHeight: cached ? 400 : 0,
    dataset: {}, addEventListener: (type, fn) => { if (type === "load") loads.push(fn); }
  };
  const viewport = {
    style: { setProperty() {} },
    querySelector: () => custom ? background : null
  };
  const html = {
    matches: () => false,
    contains: node => node === stage,
    querySelector: selector => selector.includes(".gmf-map-stage") ? stage
      : selector === ".gmf-map-viewport" ? viewport : null,
    querySelectorAll: () => []
  };
  const app = Object.create(View.prototype);
  Object.assign(app, {
    element: null, zoom: 1, panX: 0, panY: 0,
    _viewportStage: null, _viewportResizeObserver: null, _baseWindowHeight: null,
    _attachPlanetListeners() {}, _attachCreationPanel() {},
    _mountBountyIntelCallout() {}, _disposePlanetRenderer() {}, _hideContextMenu() {},
    setPosition(position) {
      assert.ok(this.element, "Foundry requires an application element for setPosition");
      positions.push(position);
    }
  });
  const mount = () => {
    app._attachPartListeners("main", html, {});
    app.element = html;
    stage.isConnected = true;
    app._onRender({}, {});
  };
  return { app, html, stage, background, viewport, positions, loads, mount };
}

test("cached backgrounds size only after the application window is mounted", () => {
  const f = fixture();
  f.app._attachPartListeners("main", f.html, {});
  assert.deepEqual(f.positions, []);
  f.mount();
  assert.deepEqual(f.positions, [{ height: 440 }]);
  assert.equal(f.viewport.style.width, "800px");
  assert.equal(f.viewport.style.height, "200px");
});

test("uncached backgrounds resize when their image finishes loading", () => {
  const f = fixture({ cached: false });
  f.mount();
  assert.deepEqual(f.positions, []);
  f.background.naturalWidth = 1600;
  f.background.naturalHeight = 400;
  f.loads[0]();
  assert.deepEqual(f.positions, [{ height: 440 }]);
});

test("late image and resize callbacks are harmless after close and the view can reopen", async () => {
  const f = fixture({ cached: false });
  f.mount();
  const resize = f.app._viewportResizeObserver.callback;
  await f.app.close();
  f.background.naturalWidth = 1600;
  f.background.naturalHeight = 400;
  f.loads[0]();
  resize();
  assert.deepEqual(f.positions, []);
  f.mount();
  assert.deepEqual(f.positions, [{ height: 440 }]);
});

test("callbacks from replaced parts cannot resize the current window", () => {
  const f = fixture({ cached: false });
  f.mount();
  const resize = f.app._viewportResizeObserver.callback;
  f.app._viewportStage = {};
  f.background.naturalWidth = 1600;
  f.background.naturalHeight = 400;
  f.loads[0]();
  resize();
  assert.deepEqual(f.positions, []);
});

test("standard backgrounds keep the stage dimensions without resizing the window", () => {
  const f = fixture({ custom: false });
  f.mount();
  assert.deepEqual(f.positions, []);
  assert.equal(f.viewport.style.width, "800px");
  assert.equal(f.viewport.style.height, "400px");
});
