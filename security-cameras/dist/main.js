var je = Object.defineProperty;
var Te = (t, e, i) => e in t ? je(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i;
var M = (t, e, i) => Te(t, typeof e != "symbol" ? e + "" : e, i);
function Ge(t, e = t) {
  const i = `${e} |`;
  return {
    log: (n, ...a) => console.log(i, n, ...a),
    warn: (n, ...a) => console.warn(i, n, ...a),
    error: (n, ...a) => console.error(i, n, ...a)
  };
}
function Ve(t, e = {}) {
  const i = e.socketName ?? `module.${t}`, n = Ge(t, e.title ?? t);
  return {
    socketName: i,
    emit(a) {
      var u;
      const l = (u = globalThis.game) == null ? void 0 : u.socket;
      return l != null && l.emit ? (l.emit(i, a), !0) : (n.warn("Foundry socket is unavailable.", a), !1);
    },
    isGMSender(a) {
      var l, u, g;
      return a ? !!((g = (u = (l = globalThis.game) == null ? void 0 : l.users) == null ? void 0 : u.get(String(a))) != null && g.isGM) : !1;
    }
  };
}
const Ce = /* @__PURE__ */ new Set(["online", "offline", "corrupted", "restricted"]), Fe = /* @__PURE__ */ new Set(["live", "image"]), he = /* @__PURE__ */ new Set(["window", "picture-in-picture"]), ie = 1200, ne = 675, He = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "corrupted", label: "Corrupted" },
  { value: "restricted", label: "Restricted" }
], ze = [
  { value: "window", label: "Window" },
  { value: "picture-in-picture", label: "Picture-in-Picture" }
], qe = [
  { value: "live", label: "Live Canvas" },
  { value: "image", label: "Static Image" }
], R = {
  id: "",
  name: "Unnamed Camera",
  sceneId: "",
  location: "Unknown Location",
  image: "",
  feedSource: "image",
  status: "online",
  displayMode: "window",
  regionId: "",
  regionX: null,
  regionY: null,
  regionWidth: ie,
  regionHeight: ne,
  notes: ""
};
function Z(t, e, i) {
  const n = String(t ?? "").trim();
  return e.has(n) ? n : i;
}
function U(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function E(t, e) {
  const i = Number(t);
  return Number.isFinite(i) && i > 0 ? i : e;
}
function pe(t) {
  return t && typeof t == "object" ? t : {};
}
function ue(t = {}, e = {}) {
  var b;
  const i = pe(t), n = e.preserveId === !0, a = String(i.id ?? "").trim(), l = n ? a : a || ((b = e.createId) == null ? void 0 : b.call(e)) || "", u = Z(i.feedSource, Fe, R.feedSource), g = Z(i.status, Ce, R.status), y = Z(i.displayMode, he, R.displayMode);
  return {
    ...R,
    id: l,
    name: String(i.name ?? R.name).trim() || R.name,
    sceneId: String(i.sceneId ?? "").trim(),
    location: String(i.location ?? R.location).trim() || R.location,
    image: String(i.image ?? "").trim(),
    feedSource: u,
    status: g,
    displayMode: y,
    regionId: String(i.regionId ?? "").trim(),
    regionX: U(i.regionX),
    regionY: U(i.regionY),
    regionWidth: E(i.regionWidth, ie),
    regionHeight: E(i.regionHeight, ne),
    notes: String(i.notes ?? "").trim()
  };
}
function Je(t = {}, e = {}) {
  const i = pe(t), n = ue(i, {
    preserveId: e.requireId === !0,
    createId: e.createId
  }), a = [], l = String(i.feedSource ?? R.feedSource).trim(), u = String(i.status ?? R.status).trim(), g = String(i.displayMode ?? R.displayMode).trim();
  return e.requireId && !n.id && a.push("Camera id is required."), typeof i.name == "string" && !i.name.trim() && a.push("Camera name is required."), Fe.has(l) || a.push(`Invalid feed source: ${l}`), Ce.has(u) || a.push(`Invalid status: ${u}`), he.has(g) || a.push(`Invalid display mode: ${g}`), {
    ok: a.length === 0,
    camera: ue(n, { createId: e.createId }),
    errors: a
  };
}
function Ie(t) {
  return t && typeof t == "object" ? t : {};
}
function Ke(t = {}) {
  const e = Ie(t), i = Array.isArray(e.points) ? e.points : [];
  if (i.length >= 4) {
    const g = [], y = [];
    for (let x = 0; x < i.length; x += 2)
      g.push(Number(i[x])), y.push(Number(i[x + 1]));
    const b = Math.min(...g), C = Math.min(...y), p = Math.max(...g), w = Math.max(...y);
    if ([b, C, p, w].every(Number.isFinite))
      return {
        x: b,
        y: C,
        width: p - b,
        height: w - C
      };
  }
  const n = U(e.x) ?? 0, a = U(e.y) ?? 0, l = E(e.width ?? e.radiusX ?? e.radius, 0), u = E(e.height ?? e.radiusY ?? e.radius, 0);
  return !l || !u ? null : { x: n, y: a, width: l, height: u };
}
function Qe(t) {
  const e = t.filter((u) => !!u);
  if (!e.length) return null;
  const i = Math.min(...e.map((u) => u.x)), n = Math.min(...e.map((u) => u.y)), a = Math.max(...e.map((u) => u.x + u.width)), l = Math.max(...e.map((u) => u.y + u.height));
  return {
    x: i,
    y: n,
    width: a - i,
    height: l - n
  };
}
function de(t) {
  const e = Ie(t), i = E(e.width, ie), n = E(e.height, ne);
  return !i || !n ? null : {
    regionX: U(e.x) ?? 0,
    regionY: U(e.y) ?? 0,
    regionWidth: i,
    regionHeight: n
  };
}
function Ze(t) {
  const e = Qe(t.map(Ke));
  return e ? de(e) : null;
}
function ye(t, e) {
  const i = t.cameras.map((w) => `
    <button type="button" class="security-camera-list-item ${w.isSelected ? "active" : ""}" data-security-camera-id="${e(w.id)}">
      <span>${e(w.name)}</span>
      <small>${e(w.location)}</small>
      <i>${e(w.status)}</i>
    </button>
  `).join(""), n = t.selectedCamera, a = n ? `
    <section class="security-camera-monitor-preview ${e(n.statusClass)}">
      <header>
        <div>
          <span class="security-camera-kicker">Selected Feed</span>
          <h3>${e(n.name)}</h3>
        </div>
        <strong>${e(n.status.toUpperCase())}</strong>
      </header>
      <div class="security-camera-preview-frame">
        ${n.canDisplayImage ? `<img src="${e(n.image)}" alt="${e(n.name)}">` : `<div class="security-camera-placeholder">${e(n.isLive ? "LIVE CANVAS FEED" : n.signalLabel)}</div>`}
      </div>
      <dl>
        <dt>Location</dt><dd>${e(n.location)}</dd>
        <dt>Scene</dt><dd>${e(n.sceneName)}</dd>
        <dt>Source</dt><dd>${e(n.feedSource)}</dd>
        <dt>Region</dt><dd>${n.hasRegion ? `${Math.round(n.regionX)}, ${Math.round(n.regionY)} / ${Math.round(n.regionWidth)}x${Math.round(n.regionHeight)}` : "No region"}</dd>
        <dt>Mode</dt><dd>${e(n.displayMode)}</dd>
        <dt>Notes</dt><dd>${e(n.notes || "No notes recorded.")}</dd>
      </dl>
    </section>
  ` : '<section class="security-camera-monitor-preview"><div class="security-camera-empty">No camera selected.</div></section>', l = t.editorCamera, u = t.sceneChoices.map((w) => `<option value="${e(w.id)}" ${w.selected ? "selected" : ""}>${e(w.name)}</option>`).join(""), g = t.regionChoices.map((w) => `<option value="${e(w.id)}" ${w.selected ? "selected" : ""}>${e(w.name)}</option>`).join(""), y = t.feedSourceChoices.map((w) => `<option value="${e(w.value)}" ${w.selected ? "selected" : ""}>${e(w.label)}</option>`).join(""), b = t.statusChoices.map((w) => `<option value="${e(w.value)}" ${w.selected ? "selected" : ""}>${e(w.label)}</option>`).join(""), C = t.displayModeChoices.map((w) => `<option value="${e(w.value)}" ${w.selected ? "selected" : ""}>${e(w.label)}</option>`).join(""), p = `<label data-security-camera-static-image-field ${t.showStaticImageField ? "" : "hidden"}>Static Image <span class="security-camera-path-row"><input type="text" name="image" value="${e(l.image)}"><button type="button" data-security-camera-action="browse-image">Browse</button></span></label>`;
  return `
    <section class="security-camera-manager">
      <aside class="security-camera-monitor-list">
        <header><span class="security-camera-kicker">Network</span><h2>Cameras</h2></header>
        <div class="security-camera-list">${i || '<p class="security-camera-empty">No cameras registered.</p>'}</div>
        <div class="security-camera-list-actions">
          <button type="button" data-security-camera-action="new">New</button>
          <button type="button" data-security-camera-action="duplicate">Duplicate</button>
          <button type="button" data-security-camera-action="delete">Delete</button>
        </div>
      </aside>
      ${a}
      <form class="security-camera-editor" data-security-camera-form>
        <header><span class="security-camera-kicker">Manager</span><h2>${t.isNewCamera ? "ADDING Camera" : "Edit Camera"}</h2></header>
        <input type="hidden" name="originalId" value="${e(l.id)}">
        <label>ID <input type="text" name="id" value="${e(l.id)}" placeholder="auto-generated"></label>
        <label>Name <input type="text" name="name" value="${e(l.name)}" required></label>
        <label>Scene <select name="sceneId">${u}</select></label>
        <label>Scene Region <select name="regionId">${g}</select></label>
        <label>Location <input type="text" name="location" value="${e(l.location)}"></label>
        <label>Feed Source <select name="feedSource">${y}</select></label>
        ${p}
        <label>Status <select name="status">${b}</select></label>
        <label>Display Mode <select name="displayMode">${C}</select></label>
        <input type="hidden" name="regionX" value="${e(l.regionX ?? "")}">
        <input type="hidden" name="regionY" value="${e(l.regionY ?? "")}">
        <input type="hidden" name="regionWidth" value="${e(l.regionWidth ?? "")}">
        <input type="hidden" name="regionHeight" value="${e(l.regionHeight ?? "")}">
        <label>Notes <textarea name="notes" rows="4">${e(l.notes)}</textarea></label>
        <div class="security-camera-editor-actions">
          <button type="submit">Save Camera</button>
          <button type="button" data-security-camera-action="pan-region">Pan to Region</button>
          <button type="button" data-security-camera-action="show">Show to Players</button>
          <button type="button" data-security-camera-action="close-feed">Close Feeds</button>
        </div>
      </form>
    </section>
  `;
}
function we(t, e) {
  const n = t.isLive && !t.isOffline && !t.isRestricted ? `<img src="${e(t.liveFrame || t.image || "")}" alt="${e(t.name)}" data-security-camera-live-frame ${t.liveFrame || t.image ? "" : "hidden"}><div class="security-camera-feed-warning" data-security-camera-live-waiting ${t.liveFrame || t.image ? "hidden" : ""}>AWAITING LIVE SIGNAL</div>` : t.canDisplayImage ? `<img src="${e(t.image)}" alt="${e(t.name)}">` : `<div class="security-camera-feed-warning">${e(t.signalLabel)}</div>`;
  return `
    <section class="security-camera-feed ${e(t.statusClass)} ${e(t.sourceClass)} ${e(t.displayClass)}">
      <div class="security-camera-feed-static" aria-hidden="true"></div>
      <div class="security-camera-feed-scanline" aria-hidden="true"></div>
      <header class="security-camera-feed-header">
        <div>
          <span class="security-camera-rec"><i></i> REC</span>
          <h2>${e(t.name)}</h2>
          <p>${e(t.location)}</p>
        </div>
        <div class="security-camera-signal">
          <strong>${e(t.signalLabel)}</strong>
          <span aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        </div>
      </header>
      <main class="security-camera-feed-frame" style="--security-camera-region-aspect: ${e(t.regionAspect ?? "16 / 9")};">
        ${n}
      </main>
      <footer class="security-camera-feed-footer">
        <span>ID ${e(t.id)}</span>
      </footer>
    </section>
  `;
}
function et(t) {
  var G, K, r, c;
  const {
    moduleId: e,
    monitorTemplatePath: i,
    feedTemplatePath: n,
    escapeHTML: a,
    getMonitorContext: l,
    prepareCamera: u,
    bindMonitorControls: g,
    bindFeedControls: y,
    getElement: b,
    liveFrameController: C,
    clearActiveMonitor: p,
    clearActiveFeed: w
  } = t, x = (K = (G = foundry == null ? void 0 : foundry.applications) == null ? void 0 : G.api) == null ? void 0 : K.ApplicationV2, X = (c = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.api) == null ? void 0 : c.HandlebarsApplicationMixin;
  function Y(o) {
    return typeof o == "string" && o.startsWith("blob:");
  }
  function j(o) {
    Y(o == null ? void 0 : o.liveFrameObjectUrl) && typeof URL < "u" && URL.revokeObjectURL(o.liveFrameObjectUrl), o && (o.liveFrameObjectUrl = null);
  }
  function q(o, s) {
    o.liveFrame !== s && (j(o), o.liveFrame = s, o.liveFrameObjectUrl = Y(s) ? s : null);
  }
  class oe extends Application {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "security-camera-monitor",
        title: "Security Camera Manager",
        template: i,
        classes: ["security-camera-window"],
        popOut: !0,
        resizable: !0,
        width: 1060,
        height: "auto"
      });
    }
    getData() {
      return l();
    }
    async _renderInner(s) {
      try {
        return await super._renderInner(s);
      } catch (d) {
        return console.warn(`${e} | Monitor template render failed, using inline fallback.`, d), $(ye(s, a));
      }
    }
    activateListeners(s) {
      super.activateListeners(s), g(this, s);
    }
    async close(s) {
      return p(this), super.close(s);
    }
  }
  class ce extends Application {
    constructor(d, m = {}) {
      super(m);
      M(this, "camera");
      M(this, "liveFrame");
      M(this, "liveFrameObjectUrl");
      M(this, "liveFrameTimer");
      this.camera = u(d), this.liveFrame = m.liveFrame ?? "", this.liveFrameObjectUrl = Y(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "security-camera-feed",
        title: "Camera Feed",
        template: n,
        classes: ["security-camera-feed-window"],
        popOut: !0,
        resizable: !0,
        width: 720,
        height: "auto"
      });
    }
    getData() {
      return this.camera = u(this.camera), {
        camera: {
          ...this.camera,
          liveFrame: this.liveFrame,
          hasLiveFrame: !!this.liveFrame
        }
      };
    }
    async _renderInner(d) {
      try {
        return await super._renderInner(d);
      } catch (m) {
        return console.warn(`${e} | Feed template render failed, using inline fallback.`, m), $(we({
          ...this.camera,
          liveFrame: this.liveFrame
        }, a));
      }
    }
    activateListeners(d) {
      super.activateListeners(d), y(this, d);
    }
    async updateLiveFrame(d) {
      var v, A;
      q(this, d);
      const m = b(this), h = (v = m == null ? void 0 : m.querySelector) == null ? void 0 : v.call(m, "[data-security-camera-live-frame]"), f = (A = m == null ? void 0 : m.querySelector) == null ? void 0 : A.call(m, "[data-security-camera-live-waiting]");
      if (h) {
        h.src = d, h.hidden = !1, f && (f.hidden = !0);
        return;
      }
      await this.render(!0);
    }
    async close(d) {
      return C.stopLocalLiveRefresh(this), j(this), w(this), super.close(d);
    }
  }
  function J() {
    var o;
    return !x || !X ? null : (o = class extends X(x) {
      async _prepareContext(d) {
        return {
          ...await super._prepareContext(d),
          ...l()
        };
      }
      async _renderHTML(d, m) {
        try {
          return await super._renderHTML(d, m);
        } catch (h) {
          console.warn(`${e} | Monitor template render failed, using inline fallback.`, h);
          const f = document.createElement("template");
          return f.innerHTML = ye(d, a).trim(), f.content;
        }
      }
      _onRender(d, m) {
        var h;
        (h = super._onRender) == null || h.call(this, d, m), g(this);
      }
      async close(d) {
        return p(this), super.close(d);
      }
    }, M(o, "DEFAULT_OPTIONS", {
      id: "security-camera-monitor",
      tag: "section",
      classes: ["security-camera-window"],
      window: {
        title: "Security Camera Manager",
        resizable: !0
      },
      position: {
        width: 1060,
        height: "auto"
      }
    }), M(o, "PARTS", {
      main: {
        template: i
      }
    }), o);
  }
  function T() {
    var o;
    return !x || !X ? null : (o = class extends X(x) {
      constructor(m, h = {}) {
        super(h);
        M(this, "camera");
        M(this, "liveFrame");
        M(this, "liveFrameObjectUrl");
        M(this, "liveFrameTimer");
        this.camera = u(m), this.liveFrame = h.liveFrame ?? "", this.liveFrameObjectUrl = Y(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
      }
      async _prepareContext(m) {
        return this.camera = u(this.camera), {
          ...await super._prepareContext(m),
          camera: {
            ...this.camera,
            liveFrame: this.liveFrame,
            hasLiveFrame: !!this.liveFrame
          }
        };
      }
      async _renderHTML(m, h) {
        try {
          return await super._renderHTML(m, h);
        } catch (f) {
          console.warn(`${e} | Feed template render failed, using inline fallback.`, f);
          const v = document.createElement("template");
          return v.innerHTML = we({
            ...this.camera,
            liveFrame: this.liveFrame
          }, a).trim(), v.content;
        }
      }
      _onRender(m, h) {
        var f;
        (f = super._onRender) == null || f.call(this, m, h), y(this);
      }
      async updateLiveFrame(m) {
        var A, k;
        q(this, m);
        const h = b(this), f = (A = h == null ? void 0 : h.querySelector) == null ? void 0 : A.call(h, "[data-security-camera-live-frame]"), v = (k = h == null ? void 0 : h.querySelector) == null ? void 0 : k.call(h, "[data-security-camera-live-waiting]");
        if (f) {
          f.src = m, f.hidden = !1, v && (v.hidden = !0);
          return;
        }
        await this.render(!0);
      }
      async close(m) {
        return C.stopLocalLiveRefresh(this), j(this), w(this), super.close(m);
      }
    }, M(o, "DEFAULT_OPTIONS", {
      id: "security-camera-feed",
      tag: "section",
      classes: ["security-camera-feed-window"],
      window: {
        title: "Camera Feed",
        resizable: !0
      },
      position: {
        width: 720,
        height: "auto"
      }
    }), M(o, "PARTS", {
      main: {
        template: n
      }
    }), o);
  }
  return {
    SecurityMonitor: J() ?? oe,
    CameraFeed: T() ?? ce
  };
}
function $e(t) {
  return Number.isFinite(t.regionX) && Number.isFinite(t.regionY);
}
function te(t) {
  return {
    sx: 0,
    sy: 0,
    sw: t.width,
    sh: t.height
  };
}
function tt(t, e, i, n) {
  if (!$e(e)) return te(t);
  if (i != null && i.width && i.height && t.width >= i.width * 0.75 && t.height >= i.height * 0.75) {
    const a = t.width / i.width, l = t.height / i.height;
    return {
      sx: (e.regionX ?? 0) * a,
      sy: (e.regionY ?? 0) * l,
      sw: e.regionWidth * a,
      sh: e.regionHeight * l
    };
  }
  return (n == null ? void 0 : n(e)) ?? te(t);
}
function ve(t, e) {
  const i = Math.max(0, Math.min(e.width - 1, Math.round(t.sx))), n = Math.max(0, Math.min(e.height - 1, Math.round(t.sy))), a = Math.max(1, Math.min(e.width - i, Math.round(t.sw))), l = Math.max(1, Math.min(e.height - n, Math.round(t.sh)));
  return { sx: i, sy: n, sw: a, sh: l };
}
function it(t, e, i) {
  if (!$e(e)) return te(t);
  const n = t.width / i.width, a = t.height / i.height;
  return {
    sx: ((e.regionX ?? 0) - i.x) * n,
    sy: ((e.regionY ?? 0) - i.y) * a,
    sw: e.regionWidth * n,
    sh: e.regionHeight * a
  };
}
function be(t, e) {
  const i = Math.min(1, e / t.sw);
  return {
    width: Math.max(1, Math.round(t.sw * i)),
    height: Math.max(1, Math.round(t.sh * i))
  };
}
function nt(t, e = 100) {
  if (!t) return null;
  const i = U(t.x), n = U(t.y);
  return !Number.isFinite(i) || !Number.isFinite(n) ? null : {
    x: i,
    y: n,
    width: E(t.width, 1) * e,
    height: E(t.height, 1) * e
  };
}
function rt(t, e) {
  return t.x < e.x + e.width && t.x + t.width > e.x && t.y < e.y + e.height && t.y + t.height > e.y;
}
function at(t, e, i) {
  return {
    dx: (t.x - e.x) / e.width * i.width,
    dy: (t.y - e.y) / e.height * i.height,
    dw: t.width / e.width * i.width,
    dh: t.height / e.height * i.height
  };
}
const st = 1250, Se = 960, ot = 0.62, ct = 0.72;
function lt(t) {
  const e = /* @__PURE__ */ new Map();
  function i(r) {
    const c = t.normalizeCamera(r);
    return c.feedSource === "live" && c.status !== "offline" && c.status !== "restricted";
  }
  function n(r) {
    var c, o;
    return !(!(canvas != null && canvas.ready) || !((c = canvas == null ? void 0 : canvas.app) != null && c.renderer) || r.sceneId && ((o = canvas.scene) == null ? void 0 : o.id) !== r.sceneId);
  }
  function a() {
    var o, s, d, m, h;
    const r = (o = canvas == null ? void 0 : canvas.app) == null ? void 0 : o.renderer, c = [
      (s = canvas == null ? void 0 : canvas.app) == null ? void 0 : s.stage,
      canvas == null ? void 0 : canvas.stage
    ].filter(Boolean);
    try {
      for (const f of c) {
        const v = (m = (d = r == null ? void 0 : r.extract) == null ? void 0 : d.canvas) == null ? void 0 : m.call(d, f);
        if (v != null && v.width && (v != null && v.height)) return v;
      }
    } catch (f) {
      console.warn(`${t.moduleId} | PIXI canvas extraction failed, using renderer view fallback.`, f);
    }
    return (r == null ? void 0 : r.view) ?? ((h = canvas == null ? void 0 : canvas.app) == null ? void 0 : h.view) ?? null;
  }
  function l(r, c) {
    var h, f, v, A;
    const o = t.applyLinkedRegionBounds(t.normalizeCamera(c)), s = ((h = canvas.dimensions) == null ? void 0 : h.width) ?? ((f = canvas.scene) == null ? void 0 : f.width) ?? 0, d = ((v = canvas.dimensions) == null ? void 0 : v.height) ?? ((A = canvas.scene) == null ? void 0 : A.height) ?? 0;
    return tt(r, o, s && d ? { width: s, height: d } : null, () => {
      var k, N;
      if ((N = (k = canvas.stage) == null ? void 0 : k.worldTransform) != null && N.apply && typeof PIXI < "u") {
        const B = canvas.stage.worldTransform.apply(new PIXI.Point(o.regionX, o.regionY)), Q = canvas.stage.worldTransform.apply(new PIXI.Point(o.regionX + o.regionWidth, o.regionY + o.regionHeight));
        return {
          sx: B.x,
          sy: B.y,
          sw: Q.x - B.x,
          sh: Q.y - B.y
        };
      }
      return null;
    });
  }
  function u(r = "") {
    var d, m, h, f, v;
    const c = t.getSceneById(r), s = (c == null ? void 0 : c.id) && ((d = canvas == null ? void 0 : canvas.scene) == null ? void 0 : d.id) === c.id ? canvas.dimensions : null;
    return {
      x: U((s == null ? void 0 : s.sceneX) ?? ((m = s == null ? void 0 : s.sceneRect) == null ? void 0 : m.x)) ?? 0,
      y: U((s == null ? void 0 : s.sceneY) ?? ((h = s == null ? void 0 : s.sceneRect) == null ? void 0 : h.y)) ?? 0,
      width: E((s == null ? void 0 : s.sceneWidth) ?? ((f = s == null ? void 0 : s.sceneRect) == null ? void 0 : f.width) ?? (c == null ? void 0 : c.width), ie),
      height: E((s == null ? void 0 : s.sceneHeight) ?? ((v = s == null ? void 0 : s.sceneRect) == null ? void 0 : v.height) ?? (c == null ? void 0 : c.height), ne)
    };
  }
  function g(r, c) {
    const o = t.applyLinkedRegionBounds(t.normalizeCamera(c));
    if (!Number.isFinite(o.regionX) || !Number.isFinite(o.regionY))
      return te({ width: r.naturalWidth, height: r.naturalHeight });
    const s = u(o.sceneId);
    return it({ width: r.naturalWidth, height: r.naturalHeight }, o, s);
  }
  function y(r) {
    if (!r) return Promise.resolve(null);
    if (e.has(r)) return e.get(r);
    const c = new Promise((o) => {
      const s = (h) => o(h), d = () => {
        const h = new Image();
        h.onload = () => s(h), h.onerror = () => s(null), h.src = r;
      }, m = new Image();
      m.crossOrigin = "anonymous", m.onload = () => s(m), m.onerror = d, m.src = r;
    });
    return e.set(r, c), c;
  }
  function b(r, c, o) {
    try {
      return r.toDataURL(c, o);
    } catch (s) {
      {
        console.warn(`${t.moduleId} | ${c} canvas encode failed, using PNG fallback.`, s);
        try {
          return r.toDataURL("image/png");
        } catch (d) {
          return console.warn(`${t.moduleId} | PNG canvas encode failed.`, d), "";
        }
      }
      return console.warn(`${t.moduleId} | PNG canvas encode failed.`, s), "";
    }
  }
  function C(r, c, o) {
    return !r.toBlob || typeof URL > "u" || !URL.createObjectURL ? Promise.resolve(b(r, c, o)) : new Promise((s) => {
      try {
        r.toBlob((d) => {
          if (d) {
            s(URL.createObjectURL(d));
            return;
          }
          s(b(r, c, o));
        }, c, o);
      } catch (d) {
        console.warn(`${t.moduleId} | ${c} canvas blob encode failed, using data URL fallback.`, d), s(b(r, c, o));
      }
    });
  }
  async function p(r = {}) {
    const o = t.getSceneBackgroundPath(r.sceneId) || r.image, s = await y(o);
    if (!(s != null && s.naturalWidth) || !(s != null && s.naturalHeight)) return "";
    const d = ve(g(s, r), {
      width: s.naturalWidth,
      height: s.naturalHeight
    }), { width: m, height: h } = be(d, Se), f = document.createElement("canvas");
    f.width = m, f.height = h;
    const v = f.getContext("2d");
    return v == null || v.drawImage(s, d.sx, d.sy, d.sw, d.sh, 0, 0, m, h), await j(v, r, m, h), C(f, "image/webp", ct);
  }
  function w(r) {
    var o, s, d, m, h;
    const c = (r == null ? void 0 : r.id) && ((o = canvas == null ? void 0 : canvas.scene) == null ? void 0 : o.id) === r.id;
    return E(
      c ? ((s = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : s.size) ?? ((d = canvas == null ? void 0 : canvas.grid) == null ? void 0 : d.size) ?? ((m = r == null ? void 0 : r.grid) == null ? void 0 : m.size) : (h = r == null ? void 0 : r.grid) == null ? void 0 : h.size,
      100
    );
  }
  function x(r) {
    var o, s;
    if (!r) return [];
    if (r.id && ((o = canvas == null ? void 0 : canvas.scene) == null ? void 0 : o.id) === r.id)
      return (((s = canvas.tokens) == null ? void 0 : s.placeables) ?? []).map((d) => d == null ? void 0 : d.document).filter(Boolean);
    const c = r.tokens;
    return Array.isArray(c) ? c : Array.isArray(c == null ? void 0 : c.contents) ? c.contents : Array.from(c ?? []);
  }
  function X(r) {
    return !(!r || r.hidden);
  }
  function Y(r) {
    var c, o, s;
    return String(((c = r == null ? void 0 : r.texture) == null ? void 0 : c.src) ?? ((o = r == null ? void 0 : r.actor) == null ? void 0 : o.img) ?? ((s = r == null ? void 0 : r.baseActor) == null ? void 0 : s.img) ?? "").trim();
  }
  async function j(r, c, o, s) {
    if (!r) return;
    const d = t.getSceneById(c.sceneId);
    if (!d) return;
    const m = t.applyLinkedRegionBounds(t.normalizeCamera(c)), h = {
      x: m.regionX,
      y: m.regionY,
      width: m.regionWidth,
      height: m.regionHeight
    };
    if (![h.x, h.y, h.width, h.height].every(Number.isFinite)) return;
    const f = w(d);
    for (const v of x(d)) {
      if (!X(v)) continue;
      const A = nt(v, f);
      if (!A || !rt(A, h)) continue;
      const k = Y(v), N = await y(k);
      if (!(N != null && N.naturalWidth) || !(N != null && N.naturalHeight)) continue;
      const { dx: B, dy: Q, dw: Ye, dh: Be } = at(A, h, { width: o, height: s });
      r.save(), r.globalAlpha = v.alpha ?? 1, r.drawImage(N, B, Q, Ye, Be), r.restore();
    }
  }
  function q(r) {
    const c = r.getContext("2d", { willReadFrequently: !0 });
    if (!c) return !1;
    const o = Math.min(48, r.width), s = Math.min(48, r.height), d = c.getImageData(0, 0, o, s).data;
    let m = 0;
    const h = d.length / 4;
    for (let f = 0; f < d.length; f += 4)
      m += d[f] + d[f + 1] + d[f + 2];
    return m / (h * 3) < 3;
  }
  async function oe(r = {}) {
    const c = a();
    if (!(c != null && c.width) || !(c != null && c.height)) return "";
    const o = ve(l(c, r), c), { width: s, height: d } = be(o, Se), m = document.createElement("canvas");
    m.width = s, m.height = d;
    const h = m.getContext("2d");
    return h == null || h.drawImage(c, o.sx, o.sy, o.sw, o.sh, 0, 0, s, d), q(m) ? "" : C(m, "image/webp", ot);
  }
  async function ce(r) {
    var o;
    if (!i(r == null ? void 0 : r.camera)) return;
    let c = "";
    c = await p(r.camera), !c && n(r.camera) && (c = await oe(r.camera)), c && J(r) && await ((o = r.updateLiveFrame) == null ? void 0 : o.call(r, c));
  }
  function J(r) {
    return !(document.visibilityState === "hidden" || (r == null ? void 0 : r.rendered) === !1);
  }
  function T(r) {
    !J(r) || r != null && r.liveFrameRefreshPending || (r.liveFrameRefreshPending = !0, ce(r).finally(() => {
      r.liveFrameRefreshPending = !1;
    }));
  }
  function G(r) {
    r && (r.liveFrameTimer && window.clearInterval(r.liveFrameTimer), r.liveFrameVisibilityHandler && document.removeEventListener("visibilitychange", r.liveFrameVisibilityHandler), r.liveFrameTimer = null, r.liveFrameVisibilityHandler = null, r.liveFrameRefreshPending = !1);
  }
  function K(r) {
    G(r), i(r == null ? void 0 : r.camera) && (r.liveFrameVisibilityHandler = () => T(r), document.addEventListener("visibilitychange", r.liveFrameVisibilityHandler), T(r), r.liveFrameTimer = window.setInterval(() => {
      T(r);
    }, st));
  }
  return {
    startLocalLiveRefresh: K,
    stopLocalLiveRefresh: G
  };
}
const I = "security-cameras", Me = `module.${I}`, Ae = Ve(I, {
  socketName: Me,
  title: "Security Cameras"
}), ut = `modules/${I}/templates/monitor.hbs`, dt = `modules/${I}/templates/feed.hbs`;
let F = null, L = null, S = "", O = "";
function V() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function H(t) {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.deepClone ? foundry.utils.deepClone(t) : JSON.parse(JSON.stringify(t));
}
function Re(t) {
  var i;
  if ((i = foundry == null ? void 0 : foundry.utils) != null && i.escapeHTML) return foundry.utils.escapeHTML(String(t));
  const e = document.createElement("div");
  return e.innerText = String(t), e.innerHTML;
}
function _(t = {}, e = {}) {
  return ue(t, { ...e, createId: V });
}
function ge(t = {}, e = {}) {
  return Je(t, { ...e, createId: V });
}
function mt(t) {
  var e, i;
  return t ? ((i = (e = game.scenes) == null ? void 0 : e.get(t)) == null ? void 0 : i.name) ?? "Unknown Scene" : "Unassigned Scene";
}
function xe(t = "") {
  var i;
  const e = re(t);
  return String(((i = e == null ? void 0 : e.background) == null ? void 0 : i.src) ?? (e == null ? void 0 : e.img) ?? (e == null ? void 0 : e.thumb) ?? "").trim();
}
function ht(t = "") {
  var i;
  const e = (((i = game.scenes) == null ? void 0 : i.contents) ?? []).map((n) => ({
    id: n.id,
    name: n.name,
    selected: n.id === t
  })).sort((n, a) => n.name.localeCompare(a.name));
  return [
    { id: "", name: "Unassigned Scene", selected: !t },
    ...e
  ];
}
function re(t = "") {
  var e;
  return t ? ((e = game.scenes) == null ? void 0 : e.get(t)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
}
function gt(t = "") {
  var n;
  const e = re(t);
  return (((n = e == null ? void 0 : e.regions) == null ? void 0 : n.contents) ?? []).map((a) => ({
    id: a.id,
    name: a.name || `Region ${a.id}`,
    region: a
  })).sort((a, l) => a.name.localeCompare(l.name));
}
function ft(t = "", e = "") {
  return [
    { id: "", name: "No Linked Region", selected: !e },
    ...gt(t).map((i) => ({
      id: i.id,
      name: i.name,
      selected: i.id === e
    }))
  ];
}
function yt(t = "", e = "") {
  var n, a;
  if (!t) return null;
  const i = re(e);
  return ((a = (n = i == null ? void 0 : i.regions) == null ? void 0 : n.get) == null ? void 0 : a.call(n, t)) ?? null;
}
function wt(t) {
  var u, g, y, b;
  const e = (t == null ? void 0 : t.object) ?? ((y = (g = (u = canvas == null ? void 0 : canvas.regions) == null ? void 0 : u.placeables) == null ? void 0 : g.find) == null ? void 0 : y.call(g, (C) => {
    var p;
    return ((p = C.document) == null ? void 0 : p.id) === (t == null ? void 0 : t.id);
  })), i = e == null ? void 0 : e.bounds;
  if (i != null && i.width && (i != null && i.height))
    return de(i);
  const n = t == null ? void 0 : t.bounds;
  if (n != null && n.width && (n != null && n.height))
    return de(n);
  const a = ((b = t == null ? void 0 : t.toObject) == null ? void 0 : b.call(t)) ?? t, l = Array.isArray(t == null ? void 0 : t.shapes) ? t.shapes : Array.isArray(a == null ? void 0 : a.shapes) ? a.shapes : [];
  return Ze(l);
}
function ae(t) {
  const e = yt(t.regionId, t.sceneId), i = wt(e);
  return i ? {
    ...t,
    ...i
  } : t;
}
function me() {
  const t = canvas == null ? void 0 : canvas.scene;
  return _({
    id: "",
    name: "",
    sceneId: (t == null ? void 0 : t.id) ?? "",
    location: "",
    image: "",
    feedSource: "live",
    status: "online",
    displayMode: "window",
    notes: ""
  }, { preserveId: !0 });
}
function le(t, e) {
  return t.map((i) => ({
    ...i,
    selected: i.value === e
  }));
}
function ee(t = {}) {
  const e = _(t), i = (/* @__PURE__ */ new Date()).toLocaleString(), n = e.status === "online", a = e.status === "offline", l = e.status === "corrupted", u = e.status === "restricted", g = e.feedSource === "live";
  return {
    ...e,
    sceneName: mt(e.sceneId),
    sceneBackground: xe(e.sceneId),
    regionAspect: e.regionWidth && e.regionHeight ? `${e.regionWidth} / ${e.regionHeight}` : "16 / 9",
    timestamp: i,
    signalLabel: n ? "SIGNAL LOCK" : l ? "SIGNAL CORRUPTED" : u ? "ACCESS DENIED" : "NO SIGNAL",
    isOnline: n,
    isOffline: a,
    isCorrupted: l,
    isRestricted: u,
    isLive: g,
    isImage: !g,
    hasRegion: Number.isFinite(e.regionX) && Number.isFinite(e.regionY),
    canDisplayImage: !!(e.image && !g && !a && !u),
    canUseImageFallback: !!(e.image && g && !a && !u),
    statusClass: `security-camera-status-${e.status}`,
    sourceClass: `security-camera-source-${e.feedSource}`,
    displayClass: `security-camera-display-${e.displayMode}`
  };
}
function W() {
  const t = game.settings.get(I, "cameras");
  return !t || typeof t != "object" || Array.isArray(t) ? {} : t;
}
function Ee() {
  return Object.values(W()).map(_).sort((t, e) => t.name.localeCompare(e.name));
}
function D(t) {
  const e = String(t ?? "");
  if (!e) return null;
  const i = W()[e];
  return i ? _(i) : null;
}
async function z(t) {
  await game.settings.set(I, "cameras", t), await xt();
}
function P(t = "manage security cameras") {
  var e, i, n;
  return (e = game.user) != null && e.isGM ? !0 : ((n = (i = ui.notifications) == null ? void 0 : i.warn) == null || n.call(i, `Only the GM can ${t}.`), !1);
}
function Ne(t) {
  return Ae.emit(t);
}
async function vt(t = {}) {
  var a, l;
  if (!P("register security cameras")) return null;
  const e = ge(t);
  if (!e.ok)
    return (l = (a = ui.notifications) == null ? void 0 : a.error) == null || l.call(a, e.errors.join(" ")), null;
  const i = ae(e.camera), n = H(W());
  return n[i.id] = i, S = i.id, O = i.id, await z(n), i;
}
async function Le(t) {
  var u, g;
  if (!P("delete security cameras")) return !1;
  const e = String(t ?? S ?? "");
  if (!e || !D(e))
    return (g = (u = ui.notifications) == null ? void 0 : u.warn) == null || g.call(u, "Select a camera to delete."), !1;
  const i = D(e);
  if (!(typeof Dialog < "u" ? await Dialog.confirm({
    title: "Delete Security Camera",
    content: `<p>Delete camera <strong>${Re(i.name)}</strong>?</p>`,
    yes: () => !0,
    no: () => !1,
    defaultYes: !1
  }) : window.confirm(`Delete camera "${i.name}"?`))) return !1;
  const a = H(W());
  return delete a[e], S = Object.keys(a)[0] ?? "", O = S, await z(a), !0;
}
async function Oe(t) {
  var a, l;
  if (!P("duplicate security cameras")) return null;
  const e = D(t || S);
  if (!e)
    return (l = (a = ui.notifications) == null ? void 0 : a.warn) == null || l.call(a, "Select a camera to duplicate."), null;
  const i = _({
    ...e,
    id: V(),
    name: `${e.name} Copy`
  }), n = H(W());
  return n[i.id] = i, S = i.id, O = i.id, await z(n), i;
}
async function Ue() {
  var i, n;
  if (!P("create security cameras")) return null;
  const t = _({
    ...me(),
    id: V(),
    name: "New Camera",
    location: "Unlabeled Location"
  }), e = H(W());
  return e[t.id] = ae(t), S = t.id, O = t.id, await z(e), (n = (i = ui.notifications) == null ? void 0 : i.info) == null || n.call(i, "New security camera created."), t;
}
function bt(t) {
  const e = new FormData(t), i = String(e.get("originalId") ?? "").trim(), n = String(e.get("id") ?? "").trim() || i || V();
  return {
    originalId: i,
    camera: _({
      id: n,
      name: e.get("name"),
      sceneId: e.get("sceneId"),
      location: e.get("location"),
      image: e.get("image"),
      feedSource: e.get("feedSource"),
      status: e.get("status"),
      displayMode: e.get("displayMode"),
      regionId: e.get("regionId"),
      regionX: e.get("regionX"),
      regionY: e.get("regionY"),
      regionWidth: e.get("regionWidth"),
      regionHeight: e.get("regionHeight"),
      notes: e.get("notes")
    })
  };
}
async function St(t) {
  var u, g, y, b;
  if (!P("save security cameras")) return null;
  const { originalId: e, camera: i } = bt(t), n = ge(i);
  if (!n.ok)
    return (g = (u = ui.notifications) == null ? void 0 : u.error) == null || g.call(u, n.errors.join(" ")), null;
  const a = ae(n.camera), l = H(W());
  return e && e !== a.id && delete l[e], l[a.id] = a, S = a.id, O = a.id, await z(l), (b = (y = ui.notifications) == null ? void 0 : y.info) == null || b.call(y, "Security camera saved."), a;
}
function Ct(t = S) {
  var i, n, a, l, u, g, y, b;
  const e = D(t);
  if (!Number.isFinite(e == null ? void 0 : e.regionX) || !Number.isFinite(e == null ? void 0 : e.regionY)) {
    (n = (i = ui.notifications) == null ? void 0 : i.warn) == null || n.call(i, "This camera does not have a region yet.");
    return;
  }
  if (e.sceneId && ((a = canvas.scene) == null ? void 0 : a.id) !== e.sceneId) {
    (u = (l = ui.notifications) == null ? void 0 : l.warn) == null || u.call(l, "Activate the camera's scene before panning to its region.");
    return;
  }
  (b = canvas.animatePan) == null || b.call(canvas, {
    x: e.regionX + e.regionWidth / 2,
    y: e.regionY + e.regionHeight / 2,
    scale: ((y = (g = canvas.stage) == null ? void 0 : g.scale) == null ? void 0 : y.x) ?? 1,
    duration: 500
  });
}
function se(t, e = null) {
  var i;
  return e != null && e[0] ? e[0] : e instanceof HTMLElement ? e : (i = t.element) != null && i[0] ? t.element[0] : t.element ?? null;
}
function Ft() {
  const t = Ee();
  !S && t.length && (S = t[0].id), O === null && (O = S);
  const e = D(S), i = O === "" ? me() : D(O) ?? me(), n = ee(i);
  return {
    cameras: t.map((a) => ({
      ...ee(a),
      isSelected: a.id === S
    })),
    selectedCamera: e ? ee(e) : null,
    editorCamera: n,
    sceneChoices: ht(i.sceneId),
    regionChoices: ft(i.sceneId, i.regionId),
    feedSourceChoices: le(qe, i.feedSource),
    statusChoices: le(He, i.status),
    displayModeChoices: le(ze, i.displayMode),
    showStaticImageField: i.feedSource === "image",
    hasCameras: t.length > 0,
    isNewCamera: !i.id
  };
}
function pt(t) {
  var n, a, l;
  if (typeof FilePicker > "u") {
    (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Foundry FilePicker is not available.");
    return;
  }
  const e = (l = t == null ? void 0 : t.elements) == null ? void 0 : l.image;
  new FilePicker({
    type: "image",
    current: (e == null ? void 0 : e.value) ?? "",
    callback: (u) => {
      e && (e.value = u);
    }
  }).browse();
}
function It(t, e = null) {
  var a, l;
  const i = se(t, e);
  if (!i) return;
  const n = i.querySelector("[data-security-camera-form]");
  n == null || n.addEventListener("submit", async (u) => {
    u.preventDefault(), await St(n);
  }), (l = (a = n == null ? void 0 : n.elements) == null ? void 0 : a.feedSource) == null || l.addEventListener("change", () => {
    const u = n.querySelector("[data-security-camera-static-image-field]");
    u && (u.hidden = n.elements.feedSource.value !== "image");
  }), i.querySelectorAll("[data-security-camera-id]").forEach((u) => {
    u.addEventListener("click", async (g) => {
      S = g.currentTarget.dataset.securityCameraId, O = S, await t.render(!0);
    });
  }), i.querySelectorAll("[data-security-camera-action]").forEach((u) => {
    u.addEventListener("click", async (g) => {
      const y = g.currentTarget.dataset.securityCameraAction;
      if (y === "new") {
        await Ue();
        return;
      }
      if (y === "duplicate") {
        await Oe(S);
        return;
      }
      if (y === "delete") {
        await Le(S);
        return;
      }
      if (y === "browse-image") {
        pt(n);
        return;
      }
      if (y === "pan-region") {
        Ct(S);
        return;
      }
      if (y === "show") {
        await We(S);
        return;
      }
      if (y === "close-feed") {
        Xe();
        return;
      }
    });
  });
}
function _e(t) {
  var a, l;
  const e = (t == null ? void 0 : t.camera) ?? {}, i = Z(e.displayMode, he, R.displayMode), n = se(t);
  if (n == null || n.classList.toggle("security-camera-feed-display-window", i === "window"), n == null || n.classList.toggle("security-camera-feed-display-pip", i === "picture-in-picture"), i === "picture-in-picture") {
    const u = Number(e.regionWidth) && Number(e.regionHeight) ? Number(e.regionWidth) / Number(e.regionHeight) : 1.7777777777777777, g = Math.min(620, Math.max(360, window.innerWidth * 0.42)), y = Math.min(460, Math.max(260, window.innerHeight * 0.38));
    let b = g, C = b / u;
    C > y && (C = y, b = C * u);
    const p = Math.round(C + 112);
    (a = t.setPosition) == null || a.call(t, {
      left: Math.max(12, window.innerWidth - b - 24),
      top: Math.max(12, window.innerHeight - p - 84),
      width: Math.round(b),
      height: p
    });
    return;
  }
  (l = t.setPosition) == null || l.call(t, {
    width: 720,
    height: "auto"
  });
}
function $t(t, e = null) {
  se(t, e) && (_e(t), Pe.startLocalLiveRefresh(t));
}
const Pe = lt({
  applyLinkedRegionBounds: ae,
  getSceneBackgroundPath: xe,
  getSceneById: re,
  moduleId: I,
  normalizeCamera: _
}), { SecurityMonitor: Mt, CameraFeed: At } = et({
  moduleId: I,
  monitorTemplatePath: ut,
  feedTemplatePath: dt,
  escapeHTML: Re,
  getMonitorContext: Ft,
  prepareCamera: ee,
  bindMonitorControls: It,
  bindFeedControls: $t,
  getElement: se,
  liveFrameController: Pe,
  clearActiveMonitor: (t) => {
    F === t && (F = null);
  },
  clearActiveFeed: (t) => {
    L === t && (L = null);
  }
});
async function ke() {
  var t;
  return P("open the Security Camera Manager") ? F ? ((t = F.bringToFront) == null || t.call(F), F) : (F = new Mt(), await F.render(!0), F) : null;
}
async function Rt() {
  if (!F) return;
  const t = F;
  F = null, await t.close();
}
async function De(t, e = {}) {
  const i = _(t);
  return await fe(), L = new At(i, {
    liveFrame: e.liveFrame ?? ""
  }), await L.render(!0), _e(L), L;
}
async function fe() {
  if (!L) return;
  const t = L;
  L = null, await t.close();
}
async function We(t) {
  var i, n;
  if (!P("broadcast camera feeds")) return null;
  const e = D(t);
  return e ? (Ne({
    action: "showFeed",
    gmUserId: game.user.id,
    camera: e
  }), De(e)) : ((n = (i = ui.notifications) == null ? void 0 : i.warn) == null || n.call(i, "Security camera not found."), null);
}
function Xe() {
  P("close player camera feeds") && (Ne({
    action: "closeFeed",
    gmUserId: game.user.id
  }), fe());
}
async function xt() {
  F && await F.render(!0);
}
async function Et(t) {
  var i, n;
  if (!t || typeof t != "object") return;
  const e = Ae.isGMSender(t.gmUserId);
  if (t.action === "showFeed") {
    if ((i = game.user) != null && i.isGM) return;
    if (!e) {
      console.warn(`${I} | Ignoring camera feed socket message without a GM sender.`);
      return;
    }
    const a = ge(t.camera);
    if (!a.ok) {
      console.warn(`${I} | Ignoring invalid socket camera payload.`, a.errors);
      return;
    }
    await De(a.camera);
    return;
  }
  if (t.action === "closeFeed") {
    if ((n = game.user) != null && n.isGM || !e) return;
    await fe();
  }
}
function Nt() {
  game.settings.register(I, "cameras", {
    name: "Security Cameras",
    hint: "World-level camera feed definitions for the Security Cameras module.",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  });
}
function Lt() {
  const t = {
    openMonitor: ke,
    closeMonitor: Rt,
    showFeed: We,
    registerCamera: vt,
    createNewCamera: Ue,
    deleteCamera: Le,
    duplicateCamera: Oe,
    getCameras: Ee,
    closeFeed: Xe,
    get activeMonitor() {
      return F;
    },
    get activeFeed() {
      return L;
    }
  };
  game.securityCameras = t;
  const e = game.modules.get(I);
  e && (e.api = t);
}
function Ot() {
  const t = game.modules.get("holosuite-core"), e = t != null && t.active ? t.api : null;
  return e != null && e.registerApp ? (e.registerApp({
    id: I,
    title: "Security Cameras",
    icon: "fa-solid fa-video",
    premium: !1,
    featureId: I,
    playerVisible: !1,
    description: "Manage camera feeds and broadcast surveillance views.",
    open: () => ke()
  }), !0) : !1;
}
Hooks.once("init", () => {
  Nt();
});
Hooks.once("ready", () => {
  var t, e;
  Lt(), Ot(), (e = (t = game.socket) == null ? void 0 : t.on) == null || e.call(t, Me, Et), console.log(`${I} | Ready. Use game.securityCameras.openMonitor()`);
});
