var Xe = Object.defineProperty;
var Ue = (t, e, i) => e in t ? Xe(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i;
var N = (t, e, i) => Ue(t, typeof e != "symbol" ? e + "" : e, i);
function Ye(t, e = t) {
  const i = `${e} |`;
  return {
    log: (n, ...r) => console.log(i, n, ...r),
    warn: (n, ...r) => console.warn(i, n, ...r),
    error: (n, ...r) => console.error(i, n, ...r)
  };
}
function Be(t, e = {}) {
  const i = e.socketName ?? `module.${t}`, n = Ye(t, e.title ?? t);
  return {
    socketName: i,
    emit(r) {
      var c;
      const o = (c = globalThis.game) == null ? void 0 : c.socket;
      return o != null && o.emit ? (o.emit(i, r), !0) : (n.warn("Foundry socket is unavailable.", r), !1);
    },
    isGMSender(r) {
      var o, c, f;
      return r ? !!((f = (c = (o = globalThis.game) == null ? void 0 : o.users) == null ? void 0 : c.get(String(r))) != null && f.isGM) : !1;
    }
  };
}
const we = /* @__PURE__ */ new Set(["online", "offline", "corrupted", "restricted"]), ve = /* @__PURE__ */ new Set(["live", "image"]), ue = /* @__PURE__ */ new Set(["window", "picture-in-picture"]), Q = 1200, Z = 675, Te = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "corrupted", label: "Corrupted" },
  { value: "restricted", label: "Restricted" }
], Ge = [
  { value: "window", label: "Window" },
  { value: "picture-in-picture", label: "Picture-in-Picture" }
], je = [
  { value: "live", label: "Live Canvas" },
  { value: "image", label: "Static Image" }
], A = {
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
  regionWidth: Q,
  regionHeight: Z,
  notes: ""
};
function H(t, e, i) {
  const n = String(t ?? "").trim();
  return e.has(n) ? n : i;
}
function k(t) {
  if (t == null || t === "") return null;
  const e = Number(t);
  return Number.isFinite(e) ? e : null;
}
function R(t, e) {
  const i = Number(t);
  return Number.isFinite(i) && i > 0 ? i : e;
}
function pe(t) {
  return t && typeof t == "object" ? t : {};
}
function se(t = {}, e = {}) {
  var p;
  const i = pe(t), n = e.preserveId === !0, r = String(i.id ?? "").trim(), o = n ? r : r || ((p = e.createId) == null ? void 0 : p.call(e)) || "", c = H(i.feedSource, ve, A.feedSource), f = H(i.status, we, A.status), w = H(i.displayMode, ue, A.displayMode);
  return {
    ...A,
    id: o,
    name: String(i.name ?? A.name).trim() || A.name,
    sceneId: String(i.sceneId ?? "").trim(),
    location: String(i.location ?? A.location).trim() || A.location,
    image: String(i.image ?? "").trim(),
    feedSource: c,
    status: f,
    displayMode: w,
    regionId: String(i.regionId ?? "").trim(),
    regionX: k(i.regionX),
    regionY: k(i.regionY),
    regionWidth: R(i.regionWidth, Q),
    regionHeight: R(i.regionHeight, Z),
    notes: String(i.notes ?? "").trim()
  };
}
function qe(t = {}, e = {}) {
  const i = pe(t), n = se(i, {
    preserveId: e.requireId === !0,
    createId: e.createId
  }), r = [], o = String(i.feedSource ?? A.feedSource).trim(), c = String(i.status ?? A.status).trim(), f = String(i.displayMode ?? A.displayMode).trim();
  return e.requireId && !n.id && r.push("Camera id is required."), typeof i.name == "string" && !i.name.trim() && r.push("Camera name is required."), ve.has(o) || r.push(`Invalid feed source: ${o}`), we.has(c) || r.push(`Invalid status: ${c}`), ue.has(f) || r.push(`Invalid display mode: ${f}`), {
    ok: r.length === 0,
    camera: se(n, { createId: e.createId }),
    errors: r
  };
}
function Se(t) {
  return t && typeof t == "object" ? t : {};
}
function Ve(t = {}) {
  const e = Se(t), i = Array.isArray(e.points) ? e.points : [];
  if (i.length >= 4) {
    const f = [], w = [];
    for (let E = 0; E < i.length; E += 2)
      f.push(Number(i[E])), w.push(Number(i[E + 1]));
    const p = Math.min(...f), C = Math.min(...w), F = Math.max(...f), v = Math.max(...w);
    if ([p, C, F, v].every(Number.isFinite))
      return {
        x: p,
        y: C,
        width: F - p,
        height: v - C
      };
  }
  const n = k(e.x) ?? 0, r = k(e.y) ?? 0, o = R(e.width ?? e.radiusX ?? e.radius, 0), c = R(e.height ?? e.radiusY ?? e.radius, 0);
  return !o || !c ? null : { x: n, y: r, width: o, height: c };
}
function ze(t) {
  const e = t.filter((c) => !!c);
  if (!e.length) return null;
  const i = Math.min(...e.map((c) => c.x)), n = Math.min(...e.map((c) => c.y)), r = Math.max(...e.map((c) => c.x + c.width)), o = Math.max(...e.map((c) => c.y + c.height));
  return {
    x: i,
    y: n,
    width: r - i,
    height: o - n
  };
}
function oe(t) {
  const e = Se(t), i = R(e.width, Q), n = R(e.height, Z);
  return !i || !n ? null : {
    regionX: k(e.x) ?? 0,
    regionY: k(e.y) ?? 0,
    regionWidth: i,
    regionHeight: n
  };
}
function He(t) {
  const e = ze(t.map(Ve));
  return e ? oe(e) : null;
}
function me(t, e) {
  const i = t.cameras.map((v) => `
    <button type="button" class="security-camera-list-item ${v.isSelected ? "active" : ""}" data-security-camera-id="${e(v.id)}">
      <span>${e(v.name)}</span>
      <small>${e(v.location)}</small>
      <i>${e(v.status)}</i>
    </button>
  `).join(""), n = t.selectedCamera, r = n ? `
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
  ` : '<section class="security-camera-monitor-preview"><div class="security-camera-empty">No camera selected.</div></section>', o = t.editorCamera, c = t.sceneChoices.map((v) => `<option value="${e(v.id)}" ${v.selected ? "selected" : ""}>${e(v.name)}</option>`).join(""), f = t.regionChoices.map((v) => `<option value="${e(v.id)}" ${v.selected ? "selected" : ""}>${e(v.name)}</option>`).join(""), w = t.feedSourceChoices.map((v) => `<option value="${e(v.value)}" ${v.selected ? "selected" : ""}>${e(v.label)}</option>`).join(""), p = t.statusChoices.map((v) => `<option value="${e(v.value)}" ${v.selected ? "selected" : ""}>${e(v.label)}</option>`).join(""), C = t.displayModeChoices.map((v) => `<option value="${e(v.value)}" ${v.selected ? "selected" : ""}>${e(v.label)}</option>`).join(""), F = `<label data-security-camera-static-image-field ${t.showStaticImageField ? "" : "hidden"}>Static Image <span class="security-camera-path-row"><input type="text" name="image" value="${e(o.image)}"><button type="button" data-security-camera-action="browse-image">Browse</button></span></label>`;
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
      ${r}
      <form class="security-camera-editor" data-security-camera-form>
        <header><span class="security-camera-kicker">Manager</span><h2>${t.isNewCamera ? "ADDING Camera" : "Edit Camera"}</h2></header>
        <input type="hidden" name="originalId" value="${e(o.id)}">
        <label>ID <input type="text" name="id" value="${e(o.id)}" placeholder="auto-generated"></label>
        <label>Name <input type="text" name="name" value="${e(o.name)}" required></label>
        <label>Scene <select name="sceneId">${c}</select></label>
        <label>Scene Region <select name="regionId">${f}</select></label>
        <label>Location <input type="text" name="location" value="${e(o.location)}"></label>
        <label>Feed Source <select name="feedSource">${w}</select></label>
        ${F}
        <label>Status <select name="status">${p}</select></label>
        <label>Display Mode <select name="displayMode">${C}</select></label>
        <input type="hidden" name="regionX" value="${e(o.regionX ?? "")}">
        <input type="hidden" name="regionY" value="${e(o.regionY ?? "")}">
        <input type="hidden" name="regionWidth" value="${e(o.regionWidth ?? "")}">
        <input type="hidden" name="regionHeight" value="${e(o.regionHeight ?? "")}">
        <label>Notes <textarea name="notes" rows="4">${e(o.notes)}</textarea></label>
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
function ge(t, e) {
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
function Je(t) {
  var V, a, l, h;
  const {
    moduleId: e,
    monitorTemplatePath: i,
    feedTemplatePath: n,
    escapeHTML: r,
    getMonitorContext: o,
    prepareCamera: c,
    bindMonitorControls: f,
    bindFeedControls: w,
    getElement: p,
    liveFrameController: C,
    clearActiveMonitor: F,
    clearActiveFeed: v
  } = t, E = (a = (V = foundry == null ? void 0 : foundry.applications) == null ? void 0 : V.api) == null ? void 0 : a.ApplicationV2, U = (h = (l = foundry == null ? void 0 : foundry.applications) == null ? void 0 : l.api) == null ? void 0 : h.HandlebarsApplicationMixin;
  class ne extends Application {
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
      return o();
    }
    async _renderInner(g) {
      try {
        return await super._renderInner(g);
      } catch (d) {
        return console.warn(`${e} | Monitor template render failed, using inline fallback.`, d), $(me(g, r));
      }
    }
    activateListeners(g) {
      super.activateListeners(g), f(this, g);
    }
    async close(g) {
      return F(this), super.close(g);
    }
  }
  class re extends Application {
    constructor(d, u = {}) {
      super(u);
      N(this, "camera");
      N(this, "liveFrame");
      N(this, "liveFrameTimer");
      this.camera = c(d), this.liveFrame = u.liveFrame ?? "", this.liveFrameTimer = null;
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
      return this.camera = c(this.camera), {
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
      } catch (u) {
        return console.warn(`${e} | Feed template render failed, using inline fallback.`, u), $(ge({
          ...this.camera,
          liveFrame: this.liveFrame
        }, r));
      }
    }
    activateListeners(d) {
      super.activateListeners(d), w(this, d);
    }
    async updateLiveFrame(d) {
      var b, O;
      this.liveFrame = d;
      const u = p(this), m = (b = u == null ? void 0 : u.querySelector) == null ? void 0 : b.call(u, "[data-security-camera-live-frame]"), y = (O = u == null ? void 0 : u.querySelector) == null ? void 0 : O.call(u, "[data-security-camera-live-waiting]");
      if (m) {
        m.src = d, m.hidden = !1, y && (y.hidden = !0);
        return;
      }
      await this.render(!0);
    }
    async close(d) {
      return C.stopLocalLiveRefresh(this), v(this), super.close(d);
    }
  }
  function j() {
    var s;
    return !E || !U ? null : (s = class extends U(E) {
      async _prepareContext(d) {
        return {
          ...await super._prepareContext(d),
          ...o()
        };
      }
      async _renderHTML(d, u) {
        try {
          return await super._renderHTML(d, u);
        } catch (m) {
          console.warn(`${e} | Monitor template render failed, using inline fallback.`, m);
          const y = document.createElement("template");
          return y.innerHTML = me(d, r).trim(), y.content;
        }
      }
      _onRender(d, u) {
        var m;
        (m = super._onRender) == null || m.call(this, d, u), f(this);
      }
      async close(d) {
        return F(this), super.close(d);
      }
    }, N(s, "DEFAULT_OPTIONS", {
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
    }), N(s, "PARTS", {
      main: {
        template: i
      }
    }), s);
  }
  function q() {
    var s;
    return !E || !U ? null : (s = class extends U(E) {
      constructor(u, m = {}) {
        super(m);
        N(this, "camera");
        N(this, "liveFrame");
        N(this, "liveFrameTimer");
        this.camera = c(u), this.liveFrame = m.liveFrame ?? "", this.liveFrameTimer = null;
      }
      async _prepareContext(u) {
        return this.camera = c(this.camera), {
          ...await super._prepareContext(u),
          camera: {
            ...this.camera,
            liveFrame: this.liveFrame,
            hasLiveFrame: !!this.liveFrame
          }
        };
      }
      async _renderHTML(u, m) {
        try {
          return await super._renderHTML(u, m);
        } catch (y) {
          console.warn(`${e} | Feed template render failed, using inline fallback.`, y);
          const b = document.createElement("template");
          return b.innerHTML = ge({
            ...this.camera,
            liveFrame: this.liveFrame
          }, r).trim(), b.content;
        }
      }
      _onRender(u, m) {
        var y;
        (y = super._onRender) == null || y.call(this, u, m), w(this);
      }
      async updateLiveFrame(u) {
        var O, x;
        this.liveFrame = u;
        const m = p(this), y = (O = m == null ? void 0 : m.querySelector) == null ? void 0 : O.call(m, "[data-security-camera-live-frame]"), b = (x = m == null ? void 0 : m.querySelector) == null ? void 0 : x.call(m, "[data-security-camera-live-waiting]");
        if (y) {
          y.src = u, y.hidden = !1, b && (b.hidden = !0);
          return;
        }
        await this.render(!0);
      }
      async close(u) {
        return C.stopLocalLiveRefresh(this), v(this), super.close(u);
      }
    }, N(s, "DEFAULT_OPTIONS", {
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
    }), N(s, "PARTS", {
      main: {
        template: n
      }
    }), s);
  }
  return {
    SecurityMonitor: j() ?? ne,
    CameraFeed: q() ?? re
  };
}
function Ce(t) {
  return Number.isFinite(t.regionX) && Number.isFinite(t.regionY);
}
function K(t) {
  return {
    sx: 0,
    sy: 0,
    sw: t.width,
    sh: t.height
  };
}
function Ke(t, e, i, n) {
  if (!Ce(e)) return K(t);
  if (i != null && i.width && i.height && t.width >= i.width * 0.75 && t.height >= i.height * 0.75) {
    const r = t.width / i.width, o = t.height / i.height;
    return {
      sx: (e.regionX ?? 0) * r,
      sy: (e.regionY ?? 0) * o,
      sw: e.regionWidth * r,
      sh: e.regionHeight * o
    };
  }
  return (n == null ? void 0 : n(e)) ?? K(t);
}
function he(t, e) {
  const i = Math.max(0, Math.min(e.width - 1, Math.round(t.sx))), n = Math.max(0, Math.min(e.height - 1, Math.round(t.sy))), r = Math.max(1, Math.min(e.width - i, Math.round(t.sw))), o = Math.max(1, Math.min(e.height - n, Math.round(t.sh)));
  return { sx: i, sy: n, sw: r, sh: o };
}
function Qe(t, e, i) {
  if (!Ce(e)) return K(t);
  const n = t.width / i.width, r = t.height / i.height;
  return {
    sx: ((e.regionX ?? 0) - i.x) * n,
    sy: ((e.regionY ?? 0) - i.y) * r,
    sw: e.regionWidth * n,
    sh: e.regionHeight * r
  };
}
function fe(t, e) {
  const i = Math.min(1, e / t.sw);
  return {
    width: Math.max(1, Math.round(t.sw * i)),
    height: Math.max(1, Math.round(t.sh * i))
  };
}
function Ze(t, e = 100) {
  if (!t) return null;
  const i = k(t.x), n = k(t.y);
  return !Number.isFinite(i) || !Number.isFinite(n) ? null : {
    x: i,
    y: n,
    width: R(t.width, 1) * e,
    height: R(t.height, 1) * e
  };
}
function et(t, e) {
  return t.x < e.x + e.width && t.x + t.width > e.x && t.y < e.y + e.height && t.y + t.height > e.y;
}
function tt(t, e, i) {
  return {
    dx: (t.x - e.x) / e.width * i.width,
    dy: (t.y - e.y) / e.height * i.height,
    dw: t.width / e.width * i.width,
    dh: t.height / e.height * i.height
  };
}
const it = 1250, ye = 960;
function nt(t) {
  const e = /* @__PURE__ */ new Map();
  function i(a) {
    const l = t.normalizeCamera(a);
    return l.feedSource === "live" && l.status !== "offline" && l.status !== "restricted";
  }
  function n(a) {
    var l, h;
    return !(!(canvas != null && canvas.ready) || !((l = canvas == null ? void 0 : canvas.app) != null && l.renderer) || a.sceneId && ((h = canvas.scene) == null ? void 0 : h.id) !== a.sceneId);
  }
  function r() {
    var h, s, g, d, u;
    const a = (h = canvas == null ? void 0 : canvas.app) == null ? void 0 : h.renderer, l = [
      (s = canvas == null ? void 0 : canvas.app) == null ? void 0 : s.stage,
      canvas == null ? void 0 : canvas.stage
    ].filter(Boolean);
    try {
      for (const m of l) {
        const y = (d = (g = a == null ? void 0 : a.extract) == null ? void 0 : g.canvas) == null ? void 0 : d.call(g, m);
        if (y != null && y.width && (y != null && y.height)) return y;
      }
    } catch (m) {
      console.warn(`${t.moduleId} | PIXI canvas extraction failed, using renderer view fallback.`, m);
    }
    return (a == null ? void 0 : a.view) ?? ((u = canvas == null ? void 0 : canvas.app) == null ? void 0 : u.view) ?? null;
  }
  function o(a, l) {
    var u, m, y, b;
    const h = t.applyLinkedRegionBounds(t.normalizeCamera(l)), s = ((u = canvas.dimensions) == null ? void 0 : u.width) ?? ((m = canvas.scene) == null ? void 0 : m.width) ?? 0, g = ((y = canvas.dimensions) == null ? void 0 : y.height) ?? ((b = canvas.scene) == null ? void 0 : b.height) ?? 0;
    return Ke(a, h, s && g ? { width: s, height: g } : null, () => {
      var O, x;
      if ((x = (O = canvas.stage) == null ? void 0 : O.worldTransform) != null && x.apply && typeof PIXI < "u") {
        const Y = canvas.stage.worldTransform.apply(new PIXI.Point(h.regionX, h.regionY)), z = canvas.stage.worldTransform.apply(new PIXI.Point(h.regionX + h.regionWidth, h.regionY + h.regionHeight));
        return {
          sx: Y.x,
          sy: Y.y,
          sw: z.x - Y.x,
          sh: z.y - Y.y
        };
      }
      return null;
    });
  }
  function c(a = "") {
    var g, d, u, m, y;
    const l = t.getSceneById(a), s = (l == null ? void 0 : l.id) && ((g = canvas == null ? void 0 : canvas.scene) == null ? void 0 : g.id) === l.id ? canvas.dimensions : null;
    return {
      x: k((s == null ? void 0 : s.sceneX) ?? ((d = s == null ? void 0 : s.sceneRect) == null ? void 0 : d.x)) ?? 0,
      y: k((s == null ? void 0 : s.sceneY) ?? ((u = s == null ? void 0 : s.sceneRect) == null ? void 0 : u.y)) ?? 0,
      width: R((s == null ? void 0 : s.sceneWidth) ?? ((m = s == null ? void 0 : s.sceneRect) == null ? void 0 : m.width) ?? (l == null ? void 0 : l.width), Q),
      height: R((s == null ? void 0 : s.sceneHeight) ?? ((y = s == null ? void 0 : s.sceneRect) == null ? void 0 : y.height) ?? (l == null ? void 0 : l.height), Z)
    };
  }
  function f(a, l) {
    const h = t.applyLinkedRegionBounds(t.normalizeCamera(l));
    if (!Number.isFinite(h.regionX) || !Number.isFinite(h.regionY))
      return K({ width: a.naturalWidth, height: a.naturalHeight });
    const s = c(h.sceneId);
    return Qe({ width: a.naturalWidth, height: a.naturalHeight }, h, s);
  }
  function w(a) {
    if (!a) return Promise.resolve(null);
    if (e.has(a)) return e.get(a);
    const l = new Promise((h) => {
      const s = (u) => h(u), g = () => {
        const u = new Image();
        u.onload = () => s(u), u.onerror = () => s(null), u.src = a;
      }, d = new Image();
      d.crossOrigin = "anonymous", d.onload = () => s(d), d.onerror = g, d.src = a;
    });
    return e.set(a, l), l;
  }
  async function p(a = {}) {
    const h = t.getSceneBackgroundPath(a.sceneId) || a.image, s = await w(h);
    if (!(s != null && s.naturalWidth) || !(s != null && s.naturalHeight)) return "";
    const g = he(f(s, a), {
      width: s.naturalWidth,
      height: s.naturalHeight
    }), { width: d, height: u } = fe(g, ye), m = document.createElement("canvas");
    m.width = d, m.height = u;
    const y = m.getContext("2d");
    y == null || y.drawImage(s, g.sx, g.sy, g.sw, g.sh, 0, 0, d, u), await U(y, a, d, u);
    try {
      return m.toDataURL("image/webp", 0.72);
    } catch (b) {
      return console.warn(`${t.moduleId} | Scene background crop failed.`, b), "";
    }
  }
  function C(a) {
    var h, s, g, d, u;
    const l = (a == null ? void 0 : a.id) && ((h = canvas == null ? void 0 : canvas.scene) == null ? void 0 : h.id) === a.id;
    return R(
      l ? ((s = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : s.size) ?? ((g = canvas == null ? void 0 : canvas.grid) == null ? void 0 : g.size) ?? ((d = a == null ? void 0 : a.grid) == null ? void 0 : d.size) : (u = a == null ? void 0 : a.grid) == null ? void 0 : u.size,
      100
    );
  }
  function F(a) {
    var h, s;
    if (!a) return [];
    if (a.id && ((h = canvas == null ? void 0 : canvas.scene) == null ? void 0 : h.id) === a.id)
      return (((s = canvas.tokens) == null ? void 0 : s.placeables) ?? []).map((g) => g == null ? void 0 : g.document).filter(Boolean);
    const l = a.tokens;
    return Array.isArray(l) ? l : Array.isArray(l == null ? void 0 : l.contents) ? l.contents : Array.from(l ?? []);
  }
  function v(a) {
    return !(!a || a.hidden);
  }
  function E(a) {
    var l, h, s;
    return String(((l = a == null ? void 0 : a.texture) == null ? void 0 : l.src) ?? ((h = a == null ? void 0 : a.actor) == null ? void 0 : h.img) ?? ((s = a == null ? void 0 : a.baseActor) == null ? void 0 : s.img) ?? "").trim();
  }
  async function U(a, l, h, s) {
    if (!a) return;
    const g = t.getSceneById(l.sceneId);
    if (!g) return;
    const d = t.applyLinkedRegionBounds(t.normalizeCamera(l)), u = {
      x: d.regionX,
      y: d.regionY,
      width: d.regionWidth,
      height: d.regionHeight
    };
    if (![u.x, u.y, u.width, u.height].every(Number.isFinite)) return;
    const m = C(g);
    for (const y of F(g)) {
      if (!v(y)) continue;
      const b = Ze(y, m);
      if (!b || !et(b, u)) continue;
      const O = E(y), x = await w(O);
      if (!(x != null && x.naturalWidth) || !(x != null && x.naturalHeight)) continue;
      const { dx: Y, dy: z, dw: Pe, dh: We } = tt(b, u, { width: h, height: s });
      a.save(), a.globalAlpha = y.alpha ?? 1, a.drawImage(x, Y, z, Pe, We), a.restore();
    }
  }
  function ne(a) {
    const l = a.getContext("2d", { willReadFrequently: !0 });
    if (!l) return !1;
    const h = Math.min(48, a.width), s = Math.min(48, a.height), g = l.getImageData(0, 0, h, s).data;
    let d = 0;
    const u = g.length / 4;
    for (let m = 0; m < g.length; m += 4)
      d += g[m] + g[m + 1] + g[m + 2];
    return d / (u * 3) < 3;
  }
  function re(a = {}) {
    const l = r();
    if (!(l != null && l.width) || !(l != null && l.height)) return "";
    const h = he(o(l, a), l), { width: s, height: g } = fe(h, ye), d = document.createElement("canvas");
    d.width = s, d.height = g;
    const u = d.getContext("2d");
    if (u == null || u.drawImage(l, h.sx, h.sy, h.sw, h.sh, 0, 0, s, g), ne(d)) return "";
    try {
      return d.toDataURL("image/webp", 0.62);
    } catch (m) {
      return console.warn(`${t.moduleId} | WebP canvas capture failed, using PNG fallback.`, m), d.toDataURL("image/png");
    }
  }
  async function j(a) {
    var h;
    if (!i(a == null ? void 0 : a.camera)) return;
    let l = "";
    l = await p(a.camera), !l && n(a.camera) && (l = re(a.camera)), l && await ((h = a.updateLiveFrame) == null ? void 0 : h.call(a, l));
  }
  function q(a) {
    a != null && a.liveFrameTimer && (window.clearInterval(a.liveFrameTimer), a.liveFrameTimer = null);
  }
  function V(a) {
    q(a), i(a == null ? void 0 : a.camera) && (j(a), a.liveFrameTimer = window.setInterval(() => {
      j(a);
    }, it));
  }
  return {
    startLocalLiveRefresh: V,
    stopLocalLiveRefresh: q
  };
}
const M = "security-cameras", be = `module.${M}`, Ie = Be(M, {
  socketName: be,
  title: "Security Cameras"
}), rt = `modules/${M}/templates/monitor.hbs`, at = `modules/${M}/templates/feed.hbs`;
let I = null, D = null, S = "", _ = "";
function B() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function T(t) {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.deepClone ? foundry.utils.deepClone(t) : JSON.parse(JSON.stringify(t));
}
function Fe(t) {
  var i;
  if ((i = foundry == null ? void 0 : foundry.utils) != null && i.escapeHTML) return foundry.utils.escapeHTML(String(t));
  const e = document.createElement("div");
  return e.innerText = String(t), e.innerHTML;
}
function L(t = {}, e = {}) {
  return se(t, { ...e, createId: B });
}
function le(t = {}, e = {}) {
  return qe(t, { ...e, createId: B });
}
function st(t) {
  var e, i;
  return t ? ((i = (e = game.scenes) == null ? void 0 : e.get(t)) == null ? void 0 : i.name) ?? "Unknown Scene" : "Unassigned Scene";
}
function $e(t = "") {
  var i;
  const e = ee(t);
  return String(((i = e == null ? void 0 : e.background) == null ? void 0 : i.src) ?? (e == null ? void 0 : e.img) ?? (e == null ? void 0 : e.thumb) ?? "").trim();
}
function ot(t = "") {
  var i;
  const e = (((i = game.scenes) == null ? void 0 : i.contents) ?? []).map((n) => ({
    id: n.id,
    name: n.name,
    selected: n.id === t
  })).sort((n, r) => n.name.localeCompare(r.name));
  return [
    { id: "", name: "Unassigned Scene", selected: !t },
    ...e
  ];
}
function ee(t = "") {
  var e;
  return t ? ((e = game.scenes) == null ? void 0 : e.get(t)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
}
function ct(t = "") {
  var n;
  const e = ee(t);
  return (((n = e == null ? void 0 : e.regions) == null ? void 0 : n.contents) ?? []).map((r) => ({
    id: r.id,
    name: r.name || `Region ${r.id}`,
    region: r
  })).sort((r, o) => r.name.localeCompare(o.name));
}
function ut(t = "", e = "") {
  return [
    { id: "", name: "No Linked Region", selected: !e },
    ...ct(t).map((i) => ({
      id: i.id,
      name: i.name,
      selected: i.id === e
    }))
  ];
}
function lt(t = "", e = "") {
  var n, r;
  if (!t) return null;
  const i = ee(e);
  return ((r = (n = i == null ? void 0 : i.regions) == null ? void 0 : n.get) == null ? void 0 : r.call(n, t)) ?? null;
}
function dt(t) {
  var c, f, w, p;
  const e = (t == null ? void 0 : t.object) ?? ((w = (f = (c = canvas == null ? void 0 : canvas.regions) == null ? void 0 : c.placeables) == null ? void 0 : f.find) == null ? void 0 : w.call(f, (C) => {
    var F;
    return ((F = C.document) == null ? void 0 : F.id) === (t == null ? void 0 : t.id);
  })), i = e == null ? void 0 : e.bounds;
  if (i != null && i.width && (i != null && i.height))
    return oe(i);
  const n = t == null ? void 0 : t.bounds;
  if (n != null && n.width && (n != null && n.height))
    return oe(n);
  const r = ((p = t == null ? void 0 : t.toObject) == null ? void 0 : p.call(t)) ?? t, o = Array.isArray(t == null ? void 0 : t.shapes) ? t.shapes : Array.isArray(r == null ? void 0 : r.shapes) ? r.shapes : [];
  return He(o);
}
function te(t) {
  const e = lt(t.regionId, t.sceneId), i = dt(e);
  return i ? {
    ...t,
    ...i
  } : t;
}
function ce() {
  const t = canvas == null ? void 0 : canvas.scene;
  return L({
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
function ae(t, e) {
  return t.map((i) => ({
    ...i,
    selected: i.value === e
  }));
}
function J(t = {}) {
  const e = L(t), i = (/* @__PURE__ */ new Date()).toLocaleString(), n = e.status === "online", r = e.status === "offline", o = e.status === "corrupted", c = e.status === "restricted", f = e.feedSource === "live";
  return {
    ...e,
    sceneName: st(e.sceneId),
    sceneBackground: $e(e.sceneId),
    regionAspect: e.regionWidth && e.regionHeight ? `${e.regionWidth} / ${e.regionHeight}` : "16 / 9",
    timestamp: i,
    signalLabel: n ? "SIGNAL LOCK" : o ? "SIGNAL CORRUPTED" : c ? "ACCESS DENIED" : "NO SIGNAL",
    isOnline: n,
    isOffline: r,
    isCorrupted: o,
    isRestricted: c,
    isLive: f,
    isImage: !f,
    hasRegion: Number.isFinite(e.regionX) && Number.isFinite(e.regionY),
    canDisplayImage: !!(e.image && !f && !r && !c),
    canUseImageFallback: !!(e.image && f && !r && !c),
    statusClass: `security-camera-status-${e.status}`,
    sourceClass: `security-camera-source-${e.feedSource}`,
    displayClass: `security-camera-display-${e.displayMode}`
  };
}
function X() {
  const t = game.settings.get(M, "cameras");
  return !t || typeof t != "object" || Array.isArray(t) ? {} : t;
}
function Me() {
  return Object.values(X()).map(L).sort((t, e) => t.name.localeCompare(e.name));
}
function W(t) {
  const e = String(t ?? "");
  if (!e) return null;
  const i = X()[e];
  return i ? L(i) : null;
}
async function G(t) {
  await game.settings.set(M, "cameras", t), await It();
}
function P(t = "manage security cameras") {
  var e, i, n;
  return (e = game.user) != null && e.isGM ? !0 : ((n = (i = ui.notifications) == null ? void 0 : i.warn) == null || n.call(i, `Only the GM can ${t}.`), !1);
}
function xe(t) {
  return Ie.emit(t);
}
async function mt(t = {}) {
  var r, o;
  if (!P("register security cameras")) return null;
  const e = le(t);
  if (!e.ok)
    return (o = (r = ui.notifications) == null ? void 0 : r.error) == null || o.call(r, e.errors.join(" ")), null;
  const i = te(e.camera), n = T(X());
  return n[i.id] = i, S = i.id, _ = i.id, await G(n), i;
}
async function Ae(t) {
  var c, f;
  if (!P("delete security cameras")) return !1;
  const e = String(t ?? S ?? "");
  if (!e || !W(e))
    return (f = (c = ui.notifications) == null ? void 0 : c.warn) == null || f.call(c, "Select a camera to delete."), !1;
  const i = W(e);
  if (!(typeof Dialog < "u" ? await Dialog.confirm({
    title: "Delete Security Camera",
    content: `<p>Delete camera <strong>${Fe(i.name)}</strong>?</p>`,
    yes: () => !0,
    no: () => !1,
    defaultYes: !1
  }) : window.confirm(`Delete camera "${i.name}"?`))) return !1;
  const r = T(X());
  return delete r[e], S = Object.keys(r)[0] ?? "", _ = S, await G(r), !0;
}
async function Ee(t) {
  var r, o;
  if (!P("duplicate security cameras")) return null;
  const e = W(t || S);
  if (!e)
    return (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, "Select a camera to duplicate."), null;
  const i = L({
    ...e,
    id: B(),
    name: `${e.name} Copy`
  }), n = T(X());
  return n[i.id] = i, S = i.id, _ = i.id, await G(n), i;
}
async function Ne() {
  var i, n;
  if (!P("create security cameras")) return null;
  const t = L({
    ...ce(),
    id: B(),
    name: "New Camera",
    location: "Unlabeled Location"
  }), e = T(X());
  return e[t.id] = te(t), S = t.id, _ = t.id, await G(e), (n = (i = ui.notifications) == null ? void 0 : i.info) == null || n.call(i, "New security camera created."), t;
}
function gt(t) {
  const e = new FormData(t), i = String(e.get("originalId") ?? "").trim(), n = String(e.get("id") ?? "").trim() || i || B();
  return {
    originalId: i,
    camera: L({
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
async function ht(t) {
  var c, f, w, p;
  if (!P("save security cameras")) return null;
  const { originalId: e, camera: i } = gt(t), n = le(i);
  if (!n.ok)
    return (f = (c = ui.notifications) == null ? void 0 : c.error) == null || f.call(c, n.errors.join(" ")), null;
  const r = te(n.camera), o = T(X());
  return e && e !== r.id && delete o[e], o[r.id] = r, S = r.id, _ = r.id, await G(o), (p = (w = ui.notifications) == null ? void 0 : w.info) == null || p.call(w, "Security camera saved."), r;
}
function ft(t = S) {
  var i, n, r, o, c, f, w, p;
  const e = W(t);
  if (!Number.isFinite(e == null ? void 0 : e.regionX) || !Number.isFinite(e == null ? void 0 : e.regionY)) {
    (n = (i = ui.notifications) == null ? void 0 : i.warn) == null || n.call(i, "This camera does not have a region yet.");
    return;
  }
  if (e.sceneId && ((r = canvas.scene) == null ? void 0 : r.id) !== e.sceneId) {
    (c = (o = ui.notifications) == null ? void 0 : o.warn) == null || c.call(o, "Activate the camera's scene before panning to its region.");
    return;
  }
  (p = canvas.animatePan) == null || p.call(canvas, {
    x: e.regionX + e.regionWidth / 2,
    y: e.regionY + e.regionHeight / 2,
    scale: ((w = (f = canvas.stage) == null ? void 0 : f.scale) == null ? void 0 : w.x) ?? 1,
    duration: 500
  });
}
function ie(t, e = null) {
  var i;
  return e != null && e[0] ? e[0] : e instanceof HTMLElement ? e : (i = t.element) != null && i[0] ? t.element[0] : t.element ?? null;
}
function yt() {
  const t = Me();
  !S && t.length && (S = t[0].id), _ === null && (_ = S);
  const e = W(S), i = _ === "" ? ce() : W(_) ?? ce(), n = J(i);
  return {
    cameras: t.map((r) => ({
      ...J(r),
      isSelected: r.id === S
    })),
    selectedCamera: e ? J(e) : null,
    editorCamera: n,
    sceneChoices: ot(i.sceneId),
    regionChoices: ut(i.sceneId, i.regionId),
    feedSourceChoices: ae(je, i.feedSource),
    statusChoices: ae(Te, i.status),
    displayModeChoices: ae(Ge, i.displayMode),
    showStaticImageField: i.feedSource === "image",
    hasCameras: t.length > 0,
    isNewCamera: !i.id
  };
}
function wt(t) {
  var n, r, o;
  if (typeof FilePicker > "u") {
    (r = (n = ui.notifications) == null ? void 0 : n.warn) == null || r.call(n, "Foundry FilePicker is not available.");
    return;
  }
  const e = (o = t == null ? void 0 : t.elements) == null ? void 0 : o.image;
  new FilePicker({
    type: "image",
    current: (e == null ? void 0 : e.value) ?? "",
    callback: (c) => {
      e && (e.value = c);
    }
  }).browse();
}
function vt(t, e = null) {
  var r, o;
  const i = ie(t, e);
  if (!i) return;
  const n = i.querySelector("[data-security-camera-form]");
  n == null || n.addEventListener("submit", async (c) => {
    c.preventDefault(), await ht(n);
  }), (o = (r = n == null ? void 0 : n.elements) == null ? void 0 : r.feedSource) == null || o.addEventListener("change", () => {
    const c = n.querySelector("[data-security-camera-static-image-field]");
    c && (c.hidden = n.elements.feedSource.value !== "image");
  }), i.querySelectorAll("[data-security-camera-id]").forEach((c) => {
    c.addEventListener("click", async (f) => {
      S = f.currentTarget.dataset.securityCameraId, _ = S, await t.render(!0);
    });
  }), i.querySelectorAll("[data-security-camera-action]").forEach((c) => {
    c.addEventListener("click", async (f) => {
      const w = f.currentTarget.dataset.securityCameraAction;
      if (w === "new") {
        await Ne();
        return;
      }
      if (w === "duplicate") {
        await Ee(S);
        return;
      }
      if (w === "delete") {
        await Ae(S);
        return;
      }
      if (w === "browse-image") {
        wt(n);
        return;
      }
      if (w === "pan-region") {
        ft(S);
        return;
      }
      if (w === "show") {
        await ke(S);
        return;
      }
      if (w === "close-feed") {
        Le();
        return;
      }
    });
  });
}
function Re(t) {
  var r, o;
  const e = (t == null ? void 0 : t.camera) ?? {}, i = H(e.displayMode, ue, A.displayMode), n = ie(t);
  if (n == null || n.classList.toggle("security-camera-feed-display-window", i === "window"), n == null || n.classList.toggle("security-camera-feed-display-pip", i === "picture-in-picture"), i === "picture-in-picture") {
    const c = Number(e.regionWidth) && Number(e.regionHeight) ? Number(e.regionWidth) / Number(e.regionHeight) : 1.7777777777777777, f = Math.min(620, Math.max(360, window.innerWidth * 0.42)), w = Math.min(460, Math.max(260, window.innerHeight * 0.38));
    let p = f, C = p / c;
    C > w && (C = w, p = C * c);
    const F = Math.round(C + 112);
    (r = t.setPosition) == null || r.call(t, {
      left: Math.max(12, window.innerWidth - p - 24),
      top: Math.max(12, window.innerHeight - F - 84),
      width: Math.round(p),
      height: F
    });
    return;
  }
  (o = t.setPosition) == null || o.call(t, {
    width: 720,
    height: "auto"
  });
}
function pt(t, e = null) {
  ie(t, e) && (Re(t), Oe.startLocalLiveRefresh(t));
}
const Oe = nt({
  applyLinkedRegionBounds: te,
  getSceneBackgroundPath: $e,
  getSceneById: ee,
  moduleId: M,
  normalizeCamera: L
}), { SecurityMonitor: St, CameraFeed: Ct } = Je({
  moduleId: M,
  monitorTemplatePath: rt,
  feedTemplatePath: at,
  escapeHTML: Fe,
  getMonitorContext: yt,
  prepareCamera: J,
  bindMonitorControls: vt,
  bindFeedControls: pt,
  getElement: ie,
  liveFrameController: Oe,
  clearActiveMonitor: (t) => {
    I === t && (I = null);
  },
  clearActiveFeed: (t) => {
    D === t && (D = null);
  }
});
async function De() {
  var t;
  return P("open the Security Camera Manager") ? I ? ((t = I.bringToFront) == null || t.call(I), I) : (I = new St(), await I.render(!0), I) : null;
}
async function bt() {
  if (!I) return;
  const t = I;
  I = null, await t.close();
}
async function _e(t, e = {}) {
  const i = L(t);
  return await de(), D = new Ct(i, {
    liveFrame: e.liveFrame ?? ""
  }), await D.render(!0), Re(D), D;
}
async function de() {
  if (!D) return;
  const t = D;
  D = null, await t.close();
}
async function ke(t) {
  var i, n;
  if (!P("broadcast camera feeds")) return null;
  const e = W(t);
  return e ? (xe({
    action: "showFeed",
    gmUserId: game.user.id,
    camera: e
  }), _e(e)) : ((n = (i = ui.notifications) == null ? void 0 : i.warn) == null || n.call(i, "Security camera not found."), null);
}
function Le() {
  P("close player camera feeds") && (xe({
    action: "closeFeed",
    gmUserId: game.user.id
  }), de());
}
async function It() {
  I && await I.render(!0);
}
async function Ft(t) {
  var i, n;
  if (!t || typeof t != "object") return;
  const e = Ie.isGMSender(t.gmUserId);
  if (t.action === "showFeed") {
    if ((i = game.user) != null && i.isGM) return;
    if (!e) {
      console.warn(`${M} | Ignoring camera feed socket message without a GM sender.`);
      return;
    }
    const r = le(t.camera);
    if (!r.ok) {
      console.warn(`${M} | Ignoring invalid socket camera payload.`, r.errors);
      return;
    }
    await _e(r.camera);
    return;
  }
  if (t.action === "closeFeed") {
    if ((n = game.user) != null && n.isGM || !e) return;
    await de();
  }
}
function $t() {
  game.settings.register(M, "cameras", {
    name: "Security Cameras",
    hint: "World-level camera feed definitions for the Security Cameras module.",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  });
}
function Mt() {
  const t = {
    openMonitor: De,
    closeMonitor: bt,
    showFeed: ke,
    registerCamera: mt,
    createNewCamera: Ne,
    deleteCamera: Ae,
    duplicateCamera: Ee,
    getCameras: Me,
    closeFeed: Le,
    get activeMonitor() {
      return I;
    },
    get activeFeed() {
      return D;
    }
  };
  game.securityCameras = t;
  const e = game.modules.get(M);
  e && (e.api = t);
}
function xt() {
  const t = game.modules.get("holosuite-core"), e = t != null && t.active ? t.api : null;
  return e != null && e.registerApp ? (e.registerApp({
    id: M,
    title: "Security Cameras",
    icon: "fa-solid fa-video",
    premium: !1,
    featureId: M,
    playerVisible: !1,
    description: "Manage camera feeds and broadcast surveillance views.",
    open: () => De()
  }), !0) : !1;
}
Hooks.once("init", () => {
  $t();
});
Hooks.once("ready", () => {
  var t, e;
  Mt(), xt(), (e = (t = game.socket) == null ? void 0 : t.on) == null || e.call(t, be, Ft), console.log(`${M} | Ready. Use game.securityCameras.openMonitor()`);
});
