var et = Object.defineProperty;
var tt = (e, t, i) => t in e ? et(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var L = (e, t, i) => tt(e, typeof t != "symbol" ? t + "" : t, i);
function rt(e, t = e) {
  const i = `${t} |`;
  return {
    log: (n, ...o) => console.log(i, n, ...o),
    warn: (n, ...o) => console.warn(i, n, ...o),
    error: (n, ...o) => console.error(i, n, ...o)
  };
}
function it(e, t = {}) {
  const i = t.socketName ?? `module.${e}`, n = rt(e, t.title ?? e);
  return {
    socketName: i,
    emit(o) {
      var u;
      const l = (u = globalThis.game) == null ? void 0 : u.socket;
      return l != null && l.emit ? (l.emit(i, o), !0) : (n.warn("Foundry socket is unavailable.", o), !1);
    },
    isGMSender(o) {
      var l, u, h;
      return o ? !!((h = (u = (l = globalThis.game) == null ? void 0 : l.users) == null ? void 0 : u.get(String(o))) != null && h.isGM) : !1;
    }
  };
}
const Pe = /* @__PURE__ */ new Set(["online", "offline", "corrupted", "restricted"]), We = /* @__PURE__ */ new Set(["live", "image"]), Se = /* @__PURE__ */ new Set(["window", "picture-in-picture"]), se = 1200, ce = 675, nt = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "corrupted", label: "Corrupted" },
  { value: "restricted", label: "Restricted" }
], at = [
  { value: "window", label: "Window" },
  { value: "picture-in-picture", label: "Picture-in-Picture" }
], ot = [
  { value: "live", label: "Live Canvas" },
  { value: "image", label: "Static Image" }
], O = {
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
  regionWidth: se,
  regionHeight: ce,
  notes: ""
};
function ne(e, t, i) {
  const n = String(e ?? "").trim();
  return t.has(n) ? n : i;
}
function N(e) {
  if (e == null || e === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
function P(e, t) {
  const i = Number(e);
  return Number.isFinite(i) && i > 0 ? i : t;
}
function ke(e) {
  return e && typeof e == "object" ? e : {};
}
function ve(e = {}, t = {}) {
  var b;
  const i = ke(e), n = t.preserveId === !0, o = String(i.id ?? "").trim(), l = n ? o : o || ((b = t.createId) == null ? void 0 : b.call(t)) || "", u = ne(i.feedSource, We, O.feedSource), h = ne(i.status, Pe, O.status), y = ne(i.displayMode, Se, O.displayMode);
  return {
    ...O,
    id: l,
    name: String(i.name ?? O.name).trim() || O.name,
    sceneId: String(i.sceneId ?? "").trim(),
    location: String(i.location ?? O.location).trim() || O.location,
    image: String(i.image ?? "").trim(),
    feedSource: u,
    status: h,
    displayMode: y,
    regionId: String(i.regionId ?? "").trim(),
    regionX: N(i.regionX),
    regionY: N(i.regionY),
    regionWidth: P(i.regionWidth, se),
    regionHeight: P(i.regionHeight, ce),
    notes: String(i.notes ?? "").trim()
  };
}
function st(e = {}, t = {}) {
  const i = ke(e), n = ve(i, {
    preserveId: t.requireId === !0,
    createId: t.createId
  }), o = [], l = String(i.feedSource ?? O.feedSource).trim(), u = String(i.status ?? O.status).trim(), h = String(i.displayMode ?? O.displayMode).trim();
  return t.requireId && !n.id && o.push("Camera id is required."), typeof i.name == "string" && !i.name.trim() && o.push("Camera name is required."), We.has(l) || o.push(`Invalid feed source: ${l}`), Pe.has(u) || o.push(`Invalid status: ${u}`), Se.has(h) || o.push(`Invalid display mode: ${h}`), {
    ok: o.length === 0,
    camera: ve(n, { createId: t.createId }),
    errors: o
  };
}
function Te(e) {
  return e && typeof e == "object" ? e : {};
}
function ct(e = {}) {
  const t = Te(e), i = Array.isArray(t.points) ? t.points : [];
  if (i.length >= 4) {
    const h = [], y = [];
    for (let U = 0; U < i.length; U += 2)
      h.push(Number(i[U])), y.push(Number(i[U + 1]));
    const b = Math.min(...h), C = Math.min(...y), x = Math.max(...h), w = Math.max(...y);
    if ([b, C, x, w].every(Number.isFinite))
      return {
        x: b,
        y: C,
        width: x - b,
        height: w - C
      };
  }
  const n = N(t.x) ?? 0, o = N(t.y) ?? 0, l = P(t.width ?? t.radiusX ?? t.radius, 0), u = P(t.height ?? t.radiusY ?? t.radius, 0);
  return !l || !u ? null : { x: n, y: o, width: l, height: u };
}
function lt(e) {
  const t = e.filter((u) => !!u);
  if (!t.length) return null;
  const i = Math.min(...t.map((u) => u.x)), n = Math.min(...t.map((u) => u.y)), o = Math.max(...t.map((u) => u.x + u.width)), l = Math.max(...t.map((u) => u.y + u.height));
  return {
    x: i,
    y: n,
    width: o - i,
    height: l - n
  };
}
function be(e) {
  const t = Te(e), i = P(t.width, se), n = P(t.height, ce);
  return !i || !n ? null : {
    regionX: N(t.x) ?? 0,
    regionY: N(t.y) ?? 0,
    regionWidth: i,
    regionHeight: n
  };
}
function ut(e) {
  const t = lt(e.map(ct));
  return t ? be(t) : null;
}
function Ee(e, t) {
  const i = e.cameras.map((w) => `
    <button type="button" class="security-camera-list-item ${w.isSelected ? "active" : ""}" data-security-camera-id="${t(w.id)}">
      <span>${t(w.name)}</span>
      <small>${t(w.location)}</small>
      <i>${t(w.status)}</i>
    </button>
  `).join(""), n = e.selectedCamera, o = n ? `
    <section class="security-camera-monitor-preview ${t(n.statusClass)}">
      <header>
        <div>
          <span class="security-camera-kicker">Selected Feed</span>
          <h3>${t(n.name)}</h3>
        </div>
        <strong>${t(n.status.toUpperCase())}</strong>
      </header>
      <div class="security-camera-preview-frame">
        ${n.canDisplayImage ? `<img src="${t(n.image)}" alt="${t(n.name)}">` : `<div class="security-camera-placeholder">${t(n.isLive ? "LIVE CANVAS FEED" : n.signalLabel)}</div>`}
      </div>
      <dl>
        <dt>Location</dt><dd>${t(n.location)}</dd>
        <dt>Scene</dt><dd>${t(n.sceneName)}</dd>
        <dt>Source</dt><dd>${t(n.feedSource)}</dd>
        <dt>Region</dt><dd>${n.hasRegion ? `${Math.round(n.regionX)}, ${Math.round(n.regionY)} / ${Math.round(n.regionWidth)}x${Math.round(n.regionHeight)}` : "No region"}</dd>
        <dt>Mode</dt><dd>${t(n.displayMode)}</dd>
        <dt>Notes</dt><dd>${t(n.notes || "No notes recorded.")}</dd>
      </dl>
    </section>
  ` : '<section class="security-camera-monitor-preview"><div class="security-camera-empty">No camera selected.</div></section>', l = e.editorCamera, u = e.sceneChoices.map((w) => `<option value="${t(w.id)}" ${w.selected ? "selected" : ""}>${t(w.name)}</option>`).join(""), h = e.regionChoices.map((w) => `<option value="${t(w.id)}" ${w.selected ? "selected" : ""}>${t(w.name)}</option>`).join(""), y = e.feedSourceChoices.map((w) => `<option value="${t(w.value)}" ${w.selected ? "selected" : ""}>${t(w.label)}</option>`).join(""), b = e.statusChoices.map((w) => `<option value="${t(w.value)}" ${w.selected ? "selected" : ""}>${t(w.label)}</option>`).join(""), C = e.displayModeChoices.map((w) => `<option value="${t(w.value)}" ${w.selected ? "selected" : ""}>${t(w.label)}</option>`).join(""), x = `<label data-security-camera-static-image-field ${e.showStaticImageField ? "" : "hidden"}>Static Image <span class="security-camera-path-row"><input type="text" name="image" value="${t(l.image)}"><button type="button" data-security-camera-action="browse-image">Browse</button></span></label>`;
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
      ${o}
      <form class="security-camera-editor" data-security-camera-form>
        <header><span class="security-camera-kicker">Manager</span><h2>${e.isNewCamera ? "ADDING Camera" : "Edit Camera"}</h2></header>
        <input type="hidden" name="originalId" value="${t(l.id)}">
        <label>ID <input type="text" name="id" value="${t(l.id)}" placeholder="auto-generated"></label>
        <label>Name <input type="text" name="name" value="${t(l.name)}" required></label>
        <label>Scene <select name="sceneId">${u}</select></label>
        <label>Scene Region <select name="regionId">${h}</select></label>
        <label>Location <input type="text" name="location" value="${t(l.location)}"></label>
        <label>Feed Source <select name="feedSource">${y}</select></label>
        ${x}
        <label>Status <select name="status">${b}</select></label>
        <label>Display Mode <select name="displayMode">${C}</select></label>
        <input type="hidden" name="regionX" value="${t(l.regionX ?? "")}">
        <input type="hidden" name="regionY" value="${t(l.regionY ?? "")}">
        <input type="hidden" name="regionWidth" value="${t(l.regionWidth ?? "")}">
        <input type="hidden" name="regionHeight" value="${t(l.regionHeight ?? "")}">
        <label>Notes <textarea name="notes" rows="4">${t(l.notes)}</textarea></label>
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
function Ne(e, t) {
  const n = e.isLive && !e.isOffline && !e.isRestricted ? `<img src="${t(e.liveFrame || e.image || "")}" alt="${t(e.name)}" data-security-camera-live-frame ${e.liveFrame || e.image ? "" : "hidden"}><div class="security-camera-feed-warning" data-security-camera-live-waiting ${e.liveFrame || e.image ? "hidden" : ""}>AWAITING LIVE SIGNAL</div>` : e.canDisplayImage ? `<img src="${t(e.image)}" alt="${t(e.name)}">` : `<div class="security-camera-feed-warning">${t(e.signalLabel)}</div>`;
  return `
    <section class="security-camera-feed ${t(e.statusClass)} ${t(e.sourceClass)} ${t(e.displayClass)}">
      <div class="security-camera-feed-static" aria-hidden="true"></div>
      <div class="security-camera-feed-scanline" aria-hidden="true"></div>
      <header class="security-camera-feed-header">
        <div>
          <span class="security-camera-rec"><i></i> REC</span>
          <h2>${t(e.name)}</h2>
          <p>${t(e.location)}</p>
        </div>
        <div class="security-camera-signal">
          <strong>${t(e.signalLabel)}</strong>
          <span aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        </div>
      </header>
      <main class="security-camera-feed-frame" style="--security-camera-region-aspect: ${t(e.regionAspect ?? "16 / 9")};">
        ${n}
      </main>
      <footer class="security-camera-feed-footer">
        <span>ID ${t(e.id)}</span>
      </footer>
    </section>
  `;
}
function dt(e) {
  var re, K, ie, J;
  const {
    moduleId: t,
    monitorTemplatePath: i,
    feedTemplatePath: n,
    escapeHTML: o,
    getMonitorContext: l,
    prepareCamera: u,
    bindMonitorControls: h,
    bindFeedControls: y,
    getElement: b,
    liveFrameController: C,
    clearActiveMonitor: x,
    clearActiveFeed: w
  } = e, U = (K = (re = foundry == null ? void 0 : foundry.applications) == null ? void 0 : re.api) == null ? void 0 : K.ApplicationV2, V = (J = (ie = foundry == null ? void 0 : foundry.applications) == null ? void 0 : ie.api) == null ? void 0 : J.HandlebarsApplicationMixin;
  function z(F) {
    return typeof F == "string" && F.startsWith("blob:");
  }
  function q(F) {
    z(F == null ? void 0 : F.liveFrameObjectUrl) && typeof URL < "u" && URL.revokeObjectURL(F.liveFrameObjectUrl), F && (F.liveFrameObjectUrl = null);
  }
  function te(F, I) {
    F.liveFrame !== I && (q(F), F.liveFrame = I, F.liveFrameObjectUrl = z(I) ? I : null);
  }
  class me extends Application {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "security-camera-monitor",
        title: "Security Camera Manager",
        template: i,
        classes: ["security-camera-window"],
        popOut: !0,
        resizable: !0,
        width: 1060,
        height: 760
      });
    }
    getData() {
      return l();
    }
    async _renderInner(I) {
      try {
        return await super._renderInner(I);
      } catch (S) {
        return console.warn(`${t} | Monitor template render failed, using inline fallback.`, S), $(Ee(I, o));
      }
    }
    activateListeners(I) {
      super.activateListeners(I), h(this, I);
    }
    async close(I) {
      return x(this), super.close(I);
    }
  }
  class he extends Application {
    constructor(S, r = {}) {
      super(r);
      L(this, "camera");
      L(this, "liveFrame");
      L(this, "liveFrameObjectUrl");
      L(this, "liveFrameTimer");
      this.camera = u(S), this.liveFrame = r.liveFrame ?? "", this.liveFrameObjectUrl = z(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
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
        height: 520
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
    async _renderInner(S) {
      try {
        return await super._renderInner(S);
      } catch (r) {
        return console.warn(`${t} | Feed template render failed, using inline fallback.`, r), $(Ne({
          ...this.camera,
          liveFrame: this.liveFrame
        }, o));
      }
    }
    activateListeners(S) {
      super.activateListeners(S), y(this, S);
    }
    async updateLiveFrame(S) {
      var c, d;
      te(this, S);
      const r = b(this), a = (c = r == null ? void 0 : r.querySelector) == null ? void 0 : c.call(r, "[data-security-camera-live-frame]"), s = (d = r == null ? void 0 : r.querySelector) == null ? void 0 : d.call(r, "[data-security-camera-live-waiting]");
      if (a) {
        a.src = S, a.hidden = !1, s && (s.hidden = !0);
        return;
      }
      await this.render(!0);
    }
    async close(S) {
      return C.stopLocalLiveRefresh(this), q(this), w(this), super.close(S);
    }
  }
  function fe() {
    var F;
    return !U || !V ? null : (F = class extends V(U) {
      async _prepareContext(S) {
        return {
          ...await super._prepareContext(S),
          ...l()
        };
      }
      async _renderHTML(S, r) {
        try {
          return await super._renderHTML(S, r);
        } catch (a) {
          console.warn(`${t} | Monitor template render failed, using inline fallback.`, a);
          const s = document.createElement("template");
          return s.innerHTML = Ee(S, o).trim(), s.content;
        }
      }
      _onRender(S, r) {
        var a;
        (a = super._onRender) == null || a.call(this, S, r), h(this);
      }
      async close(S) {
        return x(this), super.close(S);
      }
    }, L(F, "DEFAULT_OPTIONS", {
      id: "security-camera-monitor",
      tag: "section",
      classes: ["security-camera-window"],
      window: {
        title: "Security Camera Manager",
        resizable: !0
      },
      position: {
        width: 1060,
        height: 760
      }
    }), L(F, "PARTS", {
      main: {
        template: i
      }
    }), F);
  }
  function ge() {
    var F;
    return !U || !V ? null : (F = class extends V(U) {
      constructor(r, a = {}) {
        super(a);
        L(this, "camera");
        L(this, "liveFrame");
        L(this, "liveFrameObjectUrl");
        L(this, "liveFrameTimer");
        this.camera = u(r), this.liveFrame = a.liveFrame ?? "", this.liveFrameObjectUrl = z(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
      }
      async _prepareContext(r) {
        return this.camera = u(this.camera), {
          ...await super._prepareContext(r),
          camera: {
            ...this.camera,
            liveFrame: this.liveFrame,
            hasLiveFrame: !!this.liveFrame
          }
        };
      }
      async _renderHTML(r, a) {
        try {
          return await super._renderHTML(r, a);
        } catch (s) {
          console.warn(`${t} | Feed template render failed, using inline fallback.`, s);
          const c = document.createElement("template");
          return c.innerHTML = Ne({
            ...this.camera,
            liveFrame: this.liveFrame
          }, o).trim(), c.content;
        }
      }
      _onRender(r, a) {
        var s;
        (s = super._onRender) == null || s.call(this, r, a), y(this);
      }
      async updateLiveFrame(r) {
        var d, m;
        te(this, r);
        const a = b(this), s = (d = a == null ? void 0 : a.querySelector) == null ? void 0 : d.call(a, "[data-security-camera-live-frame]"), c = (m = a == null ? void 0 : a.querySelector) == null ? void 0 : m.call(a, "[data-security-camera-live-waiting]");
        if (s) {
          s.src = r, s.hidden = !1, c && (c.hidden = !0);
          return;
        }
        await this.render(!0);
      }
      async close(r) {
        return C.stopLocalLiveRefresh(this), q(this), w(this), super.close(r);
      }
    }, L(F, "DEFAULT_OPTIONS", {
      id: "security-camera-feed",
      tag: "section",
      classes: ["security-camera-feed-window"],
      window: {
        title: "Camera Feed",
        resizable: !0
      },
      position: {
        width: 720,
        height: 520
      }
    }), L(F, "PARTS", {
      main: {
        template: n
      }
    }), F);
  }
  return {
    SecurityMonitor: fe() ?? me,
    CameraFeed: ge() ?? he
  };
}
function Be(e) {
  return Number.isFinite(e.regionX) && Number.isFinite(e.regionY);
}
function oe(e) {
  return {
    sx: 0,
    sy: 0,
    sw: e.width,
    sh: e.height
  };
}
function mt(e, t, i, n) {
  if (!Be(t)) return oe(e);
  if (i != null && i.width && i.height && e.width >= i.width * 0.75 && e.height >= i.height * 0.75) {
    const o = e.width / i.width, l = e.height / i.height;
    return {
      sx: (t.regionX ?? 0) * o,
      sy: (t.regionY ?? 0) * l,
      sw: t.regionWidth * o,
      sh: t.regionHeight * l
    };
  }
  return (n == null ? void 0 : n(t)) ?? oe(e);
}
function Le(e, t) {
  const i = Math.max(0, Math.min(t.width - 1, Math.round(e.sx))), n = Math.max(0, Math.min(t.height - 1, Math.round(e.sy))), o = Math.max(1, Math.min(t.width - i, Math.round(e.sw))), l = Math.max(1, Math.min(t.height - n, Math.round(e.sh)));
  return { sx: i, sy: n, sw: o, sh: l };
}
function ht(e, t, i) {
  if (!Be(t)) return oe(e);
  const n = e.width / i.width, o = e.height / i.height;
  return {
    sx: ((t.regionX ?? 0) - i.x) * n,
    sy: ((t.regionY ?? 0) - i.y) * o,
    sw: t.regionWidth * n,
    sh: t.regionHeight * o
  };
}
function Oe(e, t) {
  const i = Math.min(1, t / e.sw);
  return {
    width: Math.max(1, Math.round(e.sw * i)),
    height: Math.max(1, Math.round(e.sh * i))
  };
}
function ft(e, t = 100) {
  const i = H(e);
  if (!i) return null;
  const n = N(i.x), o = N(i.y);
  return !Number.isFinite(n) || !Number.isFinite(o) ? null : {
    x: n,
    y: o,
    width: P(i.width, 1) * t,
    height: P(i.height, 1) * t
  };
}
function H(e) {
  if (!e) return null;
  if (e.document) return H(e.document);
  if (typeof e.toObject == "function") {
    const t = e.toObject();
    if (t && typeof t == "object") return t;
  }
  return e._source && typeof e._source == "object" ? e._source : e;
}
function ye(e, t) {
  return e.x < t.x + t.width && e.x + e.width > t.x && e.y < t.y + t.height && e.y + e.height > t.y;
}
function gt(e, t, i) {
  return {
    dx: (e.x - t.x) / t.width * i.width,
    dy: (e.y - t.y) / t.height * i.height,
    dw: e.width / t.width * i.width,
    dh: e.height / t.height * i.height
  };
}
const yt = 1250, Ue = 960, wt = 0.62, vt = 0.72, _e = 18;
function bt(e) {
  const t = /* @__PURE__ */ new Map();
  function i(r) {
    const a = e.normalizeCamera(r);
    return a.feedSource === "live" && a.status !== "offline" && a.status !== "restricted";
  }
  function n(r) {
    var a, s;
    return !(!(canvas != null && canvas.ready) || !((a = canvas == null ? void 0 : canvas.app) != null && a.renderer) || r.sceneId && ((s = canvas.scene) == null ? void 0 : s.id) !== r.sceneId);
  }
  function o() {
    var s, c, d, m, f;
    const r = (s = canvas == null ? void 0 : canvas.app) == null ? void 0 : s.renderer, a = [
      (c = canvas == null ? void 0 : canvas.app) == null ? void 0 : c.stage,
      canvas == null ? void 0 : canvas.stage
    ].filter(Boolean);
    try {
      for (const g of a) {
        const v = (m = (d = r == null ? void 0 : r.extract) == null ? void 0 : d.canvas) == null ? void 0 : m.call(d, g);
        if (v != null && v.width && (v != null && v.height)) return v;
      }
    } catch (g) {
      console.warn(`${e.moduleId} | PIXI canvas extraction failed, using renderer view fallback.`, g);
    }
    return (r == null ? void 0 : r.view) ?? ((f = canvas == null ? void 0 : canvas.app) == null ? void 0 : f.view) ?? null;
  }
  function l(r, a) {
    var f, g, v, R;
    const s = e.applyLinkedRegionBounds(e.normalizeCamera(a)), c = ((f = canvas.dimensions) == null ? void 0 : f.width) ?? ((g = canvas.scene) == null ? void 0 : g.width) ?? 0, d = ((v = canvas.dimensions) == null ? void 0 : v.height) ?? ((R = canvas.scene) == null ? void 0 : R.height) ?? 0;
    return mt(r, s, c && d ? { width: c, height: d } : null, () => {
      var _, X;
      if ((X = (_ = canvas.stage) == null ? void 0 : _.worldTransform) != null && X.apply && typeof PIXI < "u") {
        const W = canvas.stage.worldTransform.apply(new PIXI.Point(s.regionX, s.regionY)), Y = canvas.stage.worldTransform.apply(new PIXI.Point(s.regionX + s.regionWidth, s.regionY + s.regionHeight));
        return {
          sx: W.x,
          sy: W.y,
          sw: Y.x - W.x,
          sh: Y.y - W.y
        };
      }
      return null;
    });
  }
  function u(r = "") {
    var d, m, f, g, v;
    const a = e.getSceneById(r), c = (a == null ? void 0 : a.id) && ((d = canvas == null ? void 0 : canvas.scene) == null ? void 0 : d.id) === a.id ? canvas.dimensions : a == null ? void 0 : a.dimensions;
    return {
      x: N((c == null ? void 0 : c.sceneX) ?? ((m = c == null ? void 0 : c.sceneRect) == null ? void 0 : m.x)) ?? 0,
      y: N((c == null ? void 0 : c.sceneY) ?? ((f = c == null ? void 0 : c.sceneRect) == null ? void 0 : f.y)) ?? 0,
      width: P(
        (c == null ? void 0 : c.sceneWidth) ?? ((g = c == null ? void 0 : c.sceneRect) == null ? void 0 : g.width) ?? (c == null ? void 0 : c.width) ?? (a == null ? void 0 : a.width),
        se
      ),
      height: P(
        (c == null ? void 0 : c.sceneHeight) ?? ((v = c == null ? void 0 : c.sceneRect) == null ? void 0 : v.height) ?? (c == null ? void 0 : c.height) ?? (a == null ? void 0 : a.height),
        ce
      )
    };
  }
  function h(r, a) {
    const s = e.applyLinkedRegionBounds(e.normalizeCamera(a));
    if (!Number.isFinite(s.regionX) || !Number.isFinite(s.regionY))
      return oe({ width: r.naturalWidth, height: r.naturalHeight });
    const c = u(s.sceneId);
    return ht({ width: r.naturalWidth, height: r.naturalHeight }, s, c);
  }
  function y(r) {
    if (!r) return Promise.resolve(null);
    if (t.has(r)) return t.get(r);
    const a = new Promise((s) => {
      const c = (f) => s(f), d = () => {
        const f = new Image();
        f.onload = () => c(f), f.onerror = () => c(null), f.src = r;
      }, m = new Image();
      m.crossOrigin = "anonymous", m.onload = () => c(m), m.onerror = d, m.src = r;
    });
    return t.set(r, a), a;
  }
  function b(r, a, s) {
    try {
      return r.toDataURL(a, s);
    } catch (c) {
      {
        console.warn(`${e.moduleId} | ${a} canvas encode failed, using PNG fallback.`, c);
        try {
          return r.toDataURL("image/png");
        } catch (d) {
          return console.warn(`${e.moduleId} | PNG canvas encode failed.`, d), "";
        }
      }
      return console.warn(`${e.moduleId} | PNG canvas encode failed.`, c), "";
    }
  }
  function C(r, a, s, c = {}) {
    return c.preferDataUrl || !r.toBlob || typeof URL > "u" || !URL.createObjectURL ? Promise.resolve(b(r, a, s)) : new Promise((d) => {
      try {
        r.toBlob((m) => {
          if (m) {
            d(URL.createObjectURL(m));
            return;
          }
          d(b(r, a, s));
        }, a, s);
      } catch (m) {
        console.warn(`${e.moduleId} | ${a} canvas blob encode failed, using data URL fallback.`, m), d(b(r, a, s));
      }
    });
  }
  async function x(r = {}, a = {}) {
    const c = e.getSceneBackgroundPath(r.sceneId) || r.image, d = await y(c);
    if (!(d != null && d.naturalWidth) || !(d != null && d.naturalHeight)) return "";
    const m = Le(h(d, r), {
      width: d.naturalWidth,
      height: d.naturalHeight
    }), { width: f, height: g } = Oe(m, Ue), v = document.createElement("canvas");
    v.width = f, v.height = g;
    const R = v.getContext("2d");
    return R == null || R.drawImage(d, m.sx, m.sy, m.sw, m.sh, 0, 0, f, g), await me(R, r, f, g), C(v, "image/webp", vt, a);
  }
  function w(r) {
    var s, c, d, m, f, g;
    const a = (r == null ? void 0 : r.id) && ((s = canvas == null ? void 0 : canvas.scene) == null ? void 0 : s.id) === r.id;
    return P(
      a ? ((c = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : c.size) ?? ((d = canvas == null ? void 0 : canvas.grid) == null ? void 0 : d.size) ?? ((m = r == null ? void 0 : r.grid) == null ? void 0 : m.size) : ((f = r == null ? void 0 : r.dimensions) == null ? void 0 : f.size) ?? ((g = r == null ? void 0 : r.grid) == null ? void 0 : g.size),
      100
    );
  }
  function U(r) {
    var s, c, d, m, f;
    if (!r) return [];
    if (r.id && ((s = canvas == null ? void 0 : canvas.scene) == null ? void 0 : s.id) === r.id)
      return (((c = canvas.tokens) == null ? void 0 : c.placeables) ?? []).map((g) => g == null ? void 0 : g.document).filter(Boolean);
    const a = [
      V(r, "Token"),
      r.tokens,
      (d = r.getEmbeddedDocuments) == null ? void 0 : d.call(r, "Token"),
      (m = r.toObject) == null ? void 0 : m.call(r).tokens,
      (f = r._source) == null ? void 0 : f.tokens
    ];
    for (const g of a) {
      const v = z(g);
      if (v.length) return v;
    }
    return [];
  }
  function V(r, a) {
    var s;
    try {
      return (s = r == null ? void 0 : r.getEmbeddedCollection) == null ? void 0 : s.call(r, a);
    } catch (c) {
      return console.warn(`${e.moduleId} | Could not read ${a} collection for inactive scene.`, c), null;
    }
  }
  function z(r) {
    return r ? (Array.isArray(r == null ? void 0 : r.contents) ? r.contents : Array.isArray(r) ? r : typeof r.values == "function" ? Array.from(r.values()) : Array.from(r ?? [])).map((s) => Array.isArray(s) ? s[1] : s).map((s) => (s == null ? void 0 : s.document) ?? s).filter(Boolean) : [];
  }
  function q(r) {
    const a = H(r);
    return !(!a || a.hidden);
  }
  function te(r) {
    var s, c, d, m, f, g, v, R;
    const a = H(r);
    return String(
      ((s = r == null ? void 0 : r.getTextureSrc) == null ? void 0 : s.call(r)) ?? ((c = a == null ? void 0 : a.texture) == null ? void 0 : c.src) ?? (a == null ? void 0 : a.img) ?? ((d = r == null ? void 0 : r.texture) == null ? void 0 : d.src) ?? ((m = r == null ? void 0 : r.actor) == null ? void 0 : m.img) ?? ((f = r == null ? void 0 : r.baseActor) == null ? void 0 : f.img) ?? ((R = (v = (g = r == null ? void 0 : r.actor) == null ? void 0 : g.prototypeToken) == null ? void 0 : v.texture) == null ? void 0 : R.src) ?? ""
    ).trim();
  }
  async function me(r, a, s, c) {
    var R;
    if (!r) return;
    const d = e.getSceneById(a.sceneId);
    if (!d) return;
    const m = e.applyLinkedRegionBounds(e.normalizeCamera(a)), f = {
      x: m.regionX,
      y: m.regionY,
      width: m.regionWidth,
      height: m.regionHeight
    };
    if (![f.x, f.y, f.width, f.height].every(Number.isFinite)) return;
    const g = w(d), v = u(m.sceneId);
    for (const _ of U(d)) {
      if (!q(_)) continue;
      const X = ft(_, g), W = he(X, f, v);
      if (!W) continue;
      const Y = te(_), k = await y(Y), { dx: Me, dy: Ae, dw: xe, dh: Re } = gt(W, f, { width: s, height: c });
      r.save(), r.globalAlpha = N(_.alpha) ?? N((R = H(_)) == null ? void 0 : R.alpha) ?? 1, k != null && k.naturalWidth && (k != null && k.naturalHeight) ? r.drawImage(k, Me, Ae, xe, Re) : fe(r, _, Me, Ae, xe, Re), r.restore();
    }
  }
  function he(r, a, s) {
    if (!r) return null;
    if (ye(r, a)) return r;
    const c = N(s == null ? void 0 : s.x) ?? 0, d = N(s == null ? void 0 : s.y) ?? 0;
    if (!c && !d) return null;
    const m = {
      ...r,
      x: r.x - c,
      y: r.y - d
    };
    if (ye(m, a)) return m;
    const f = {
      ...r,
      x: r.x + c,
      y: r.y + d
    };
    return ye(f, a) ? f : null;
  }
  function fe(r, a, s, c, d, m) {
    const f = H(a), g = Math.max(_e, d), v = Math.max(_e, m), R = s + (d - g) / 2, _ = c + (m - v) / 2, X = Math.min(g, v) / 2, W = R + g / 2, Y = _ + v / 2;
    r.beginPath(), r.arc(W, Y, X, 0, Math.PI * 2), r.fillStyle = "rgba(10, 18, 24, 0.82)", r.fill(), r.lineWidth = Math.max(2, Math.min(g, v) * 0.08), r.strokeStyle = "rgba(72, 220, 255, 0.95)", r.stroke();
    const k = String((f == null ? void 0 : f.name) ?? (a == null ? void 0 : a.name) ?? "").trim().slice(0, 2).toUpperCase();
    k && (r.font = `700 ${Math.max(10, Math.round(X * 0.72))}px sans-serif`, r.textAlign = "center", r.textBaseline = "middle", r.fillStyle = "rgba(224, 252, 255, 0.96)", r.fillText(k, W, Y + 0.5));
  }
  function ge(r) {
    const a = r.getContext("2d", { willReadFrequently: !0 });
    if (!a) return !1;
    const s = Math.min(48, r.width), c = Math.min(48, r.height), d = a.getImageData(0, 0, s, c).data;
    let m = 0;
    const f = d.length / 4;
    for (let g = 0; g < d.length; g += 4)
      m += d[g] + d[g + 1] + d[g + 2];
    return m / (f * 3) < 3;
  }
  async function re(r = {}, a = {}) {
    const s = o();
    if (!(s != null && s.width) || !(s != null && s.height)) return "";
    const c = Le(l(s, r), s), { width: d, height: m } = Oe(c, Ue), f = document.createElement("canvas");
    f.width = d, f.height = m;
    const g = f.getContext("2d");
    return g == null || g.drawImage(s, c.sx, c.sy, c.sw, c.sh, 0, 0, d, m), ge(f) ? "" : C(f, "image/webp", wt, a);
  }
  async function K(r = {}, a = {}) {
    let s = await x(r, a);
    return !s && n(r) && (s = await re(r, a)), s;
  }
  async function ie(r) {
    var s, c;
    if (!i(r == null ? void 0 : r.camera)) return;
    const a = await K(r.camera, {
      preferDataUrl: !!e.broadcastLiveFrame
    });
    a && J(r) && (await ((s = r.updateLiveFrame) == null ? void 0 : s.call(r, a)), (c = e.broadcastLiveFrame) == null || c.call(e, e.normalizeCamera(r.camera), a));
  }
  function J(r) {
    return !(document.visibilityState === "hidden" || (r == null ? void 0 : r.rendered) === !1);
  }
  function F(r) {
    !J(r) || r != null && r.liveFrameRefreshPending || (r.liveFrameRefreshPending = !0, ie(r).finally(() => {
      r.liveFrameRefreshPending = !1;
    }));
  }
  function I(r) {
    r && (r.liveFrameTimer && window.clearInterval(r.liveFrameTimer), r.liveFrameVisibilityHandler && document.removeEventListener("visibilitychange", r.liveFrameVisibilityHandler), r.liveFrameTimer = null, r.liveFrameVisibilityHandler = null, r.liveFrameRefreshPending = !1);
  }
  function S(r) {
    I(r), i(r == null ? void 0 : r.camera) && e.isFrameProducer() && (r.liveFrameVisibilityHandler = () => F(r), document.addEventListener("visibilitychange", r.liveFrameVisibilityHandler), F(r), r.liveFrameTimer = window.setInterval(() => {
      F(r);
    }, yt));
  }
  return {
    captureLiveFrame: K,
    startLocalLiveRefresh: S,
    stopLocalLiveRefresh: I
  };
}
const E = "security-cameras", je = `module.${E}`, Ft = `modules/${E}/templates/monitor.hbs`, St = `modules/${E}/templates/feed.hbs`;
function Q() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Z(e) {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : JSON.parse(JSON.stringify(e));
}
function Xe(e) {
  var i;
  if ((i = foundry == null ? void 0 : foundry.utils) != null && i.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
const Ye = it(E, {
  socketName: je,
  title: "Security Cameras"
});
let M = null, A = null, p = "", T = "";
function B(e = {}, t = {}) {
  return ve(e, { ...t, createId: Q });
}
function pe(e = {}, t = {}) {
  return st(e, { ...t, createId: Q });
}
function pt(e) {
  var t, i;
  return e ? ((i = (t = game.scenes) == null ? void 0 : t.get(e)) == null ? void 0 : i.name) ?? "Unknown Scene" : "Unassigned Scene";
}
function Ge(e = "") {
  var i;
  const t = le(e);
  return String(((i = t == null ? void 0 : t.background) == null ? void 0 : i.src) ?? (t == null ? void 0 : t.img) ?? (t == null ? void 0 : t.thumb) ?? "").trim();
}
function Ct(e = "") {
  var i;
  const t = (((i = game.scenes) == null ? void 0 : i.contents) ?? []).map((n) => ({
    id: n.id,
    name: n.name,
    selected: n.id === e
  })).sort((n, o) => n.name.localeCompare(o.name));
  return [
    { id: "", name: "Unassigned Scene", selected: !e },
    ...t
  ];
}
function le(e = "") {
  var t;
  return e ? ((t = game.scenes) == null ? void 0 : t.get(e)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
}
function It(e = "") {
  var n;
  const t = le(e);
  return (((n = t == null ? void 0 : t.regions) == null ? void 0 : n.contents) ?? []).map((o) => ({
    id: o.id,
    name: o.name || `Region ${o.id}`,
    region: o
  })).sort((o, l) => o.name.localeCompare(l.name));
}
function $t(e = "", t = "") {
  return [
    { id: "", name: "No Linked Region", selected: !t },
    ...It(e).map((i) => ({
      id: i.id,
      name: i.name,
      selected: i.id === t
    }))
  ];
}
function Mt(e = "", t = "") {
  var n, o;
  if (!e) return null;
  const i = le(t);
  return ((o = (n = i == null ? void 0 : i.regions) == null ? void 0 : n.get) == null ? void 0 : o.call(n, e)) ?? null;
}
function At(e) {
  var u, h, y, b;
  const t = (e == null ? void 0 : e.object) ?? ((y = (h = (u = canvas == null ? void 0 : canvas.regions) == null ? void 0 : u.placeables) == null ? void 0 : h.find) == null ? void 0 : y.call(h, (C) => {
    var x;
    return ((x = C.document) == null ? void 0 : x.id) === (e == null ? void 0 : e.id);
  })), i = t == null ? void 0 : t.bounds;
  if (i != null && i.width && (i != null && i.height))
    return be(i);
  const n = e == null ? void 0 : e.bounds;
  if (n != null && n.width && (n != null && n.height))
    return be(n);
  const o = ((b = e == null ? void 0 : e.toObject) == null ? void 0 : b.call(e)) ?? e, l = Array.isArray(e == null ? void 0 : e.shapes) ? e.shapes : Array.isArray(o == null ? void 0 : o.shapes) ? o.shapes : [];
  return ut(l);
}
function ue(e) {
  const t = Mt(e.regionId, e.sceneId), i = At(t);
  return i ? {
    ...e,
    ...i
  } : e;
}
function Fe() {
  const e = canvas == null ? void 0 : canvas.scene;
  return B({
    id: "",
    name: "",
    sceneId: (e == null ? void 0 : e.id) ?? "",
    location: "",
    image: "",
    feedSource: "live",
    status: "online",
    displayMode: "window",
    notes: ""
  }, { preserveId: !0 });
}
function we(e, t) {
  return e.map((i) => ({
    ...i,
    selected: i.value === t
  }));
}
function ae(e = {}) {
  const t = B(e), i = (/* @__PURE__ */ new Date()).toLocaleString(), n = t.status === "online", o = t.status === "offline", l = t.status === "corrupted", u = t.status === "restricted", h = t.feedSource === "live";
  return {
    ...t,
    sceneName: pt(t.sceneId),
    sceneBackground: Ge(t.sceneId),
    regionAspect: t.regionWidth && t.regionHeight ? `${t.regionWidth} / ${t.regionHeight}` : "16 / 9",
    timestamp: i,
    signalLabel: n ? "SIGNAL LOCK" : l ? "SIGNAL CORRUPTED" : u ? "ACCESS DENIED" : "NO SIGNAL",
    isOnline: n,
    isOffline: o,
    isCorrupted: l,
    isRestricted: u,
    isLive: h,
    isImage: !h,
    hasRegion: Number.isFinite(t.regionX) && Number.isFinite(t.regionY),
    canDisplayImage: !!(t.image && !h && !o && !u),
    canUseImageFallback: !!(t.image && h && !o && !u),
    statusClass: `security-camera-status-${t.status}`,
    sourceClass: `security-camera-source-${t.feedSource}`,
    displayClass: `security-camera-display-${t.displayMode}`
  };
}
function D() {
  const e = game.settings.get(E, "cameras");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function De() {
  return Object.values(D()).map(B).sort((e, t) => e.name.localeCompare(t.name));
}
function G(e) {
  const t = String(e ?? "");
  if (!t) return null;
  const i = D()[t];
  return i ? B(i) : null;
}
async function ee(e) {
  await game.settings.set(E, "cameras", e), await Tt();
}
function j(e = "manage security cameras") {
  var t, i, n;
  return (t = game.user) != null && t.isGM ? !0 : ((n = (i = ui.notifications) == null ? void 0 : i.warn) == null || n.call(i, `Only the GM can ${e}.`), !1);
}
function Ce(e) {
  return Ye.emit(e);
}
async function xt(e = {}) {
  var o, l;
  if (!j("register security cameras")) return null;
  const t = pe(e);
  if (!t.ok)
    return (l = (o = ui.notifications) == null ? void 0 : o.error) == null || l.call(o, t.errors.join(" ")), null;
  const i = ue(t.camera), n = Z(D());
  return n[i.id] = i, p = i.id, T = i.id, await ee(n), i;
}
async function Ve(e) {
  var u, h;
  if (!j("delete security cameras")) return !1;
  const t = String(e ?? p ?? "");
  if (!t || !G(t))
    return (h = (u = ui.notifications) == null ? void 0 : u.warn) == null || h.call(u, "Select a camera to delete."), !1;
  const i = G(t);
  if (!(typeof Dialog < "u" ? await Dialog.confirm({
    title: "Delete Security Camera",
    content: `<p>Delete camera <strong>${Xe(i.name)}</strong>?</p>`,
    yes: () => !0,
    no: () => !1,
    defaultYes: !1
  }) : window.confirm(`Delete camera "${i.name}"?`))) return !1;
  const o = Z(D());
  return delete o[t], p = Object.keys(o)[0] ?? "", T = p, await ee(o), !0;
}
async function ze(e) {
  var o, l;
  if (!j("duplicate security cameras")) return null;
  const t = G(e || p);
  if (!t)
    return (l = (o = ui.notifications) == null ? void 0 : o.warn) == null || l.call(o, "Select a camera to duplicate."), null;
  const i = B({
    ...t,
    id: Q(),
    name: `${t.name} Copy`
  }), n = Z(D());
  return n[i.id] = i, p = i.id, T = i.id, await ee(n), i;
}
async function He() {
  var i, n;
  if (!j("create security cameras")) return null;
  const e = B({
    ...Fe(),
    id: Q(),
    name: "New Camera",
    location: "Unlabeled Location"
  }), t = Z(D());
  return t[e.id] = ue(e), p = e.id, T = e.id, await ee(t), (n = (i = ui.notifications) == null ? void 0 : i.info) == null || n.call(i, "New security camera created."), e;
}
function Rt(e) {
  const t = new FormData(e), i = String(t.get("originalId") ?? "").trim(), n = String(t.get("id") ?? "").trim() || i || Q();
  return {
    originalId: i,
    camera: B({
      id: n,
      name: t.get("name"),
      sceneId: t.get("sceneId"),
      location: t.get("location"),
      image: t.get("image"),
      feedSource: t.get("feedSource"),
      status: t.get("status"),
      displayMode: t.get("displayMode"),
      regionId: t.get("regionId"),
      regionX: t.get("regionX"),
      regionY: t.get("regionY"),
      regionWidth: t.get("regionWidth"),
      regionHeight: t.get("regionHeight"),
      notes: t.get("notes")
    })
  };
}
async function Et(e) {
  var u, h, y, b;
  if (!j("save security cameras")) return null;
  const { originalId: t, camera: i } = Rt(e), n = pe(i);
  if (!n.ok)
    return (h = (u = ui.notifications) == null ? void 0 : u.error) == null || h.call(u, n.errors.join(" ")), null;
  const o = ue(n.camera), l = Z(D());
  return t && t !== o.id && delete l[t], l[o.id] = o, p = o.id, T = o.id, await ee(l), (b = (y = ui.notifications) == null ? void 0 : y.info) == null || b.call(y, "Security camera saved."), o;
}
function Nt(e = p) {
  var i, n, o, l, u, h, y, b;
  const t = G(e);
  if (!Number.isFinite(t == null ? void 0 : t.regionX) || !Number.isFinite(t == null ? void 0 : t.regionY)) {
    (n = (i = ui.notifications) == null ? void 0 : i.warn) == null || n.call(i, "This camera does not have a region yet.");
    return;
  }
  if (t.sceneId && ((o = canvas.scene) == null ? void 0 : o.id) !== t.sceneId) {
    (u = (l = ui.notifications) == null ? void 0 : l.warn) == null || u.call(l, "Activate the camera's scene before panning to its region.");
    return;
  }
  (b = canvas.animatePan) == null || b.call(canvas, {
    x: t.regionX + t.regionWidth / 2,
    y: t.regionY + t.regionHeight / 2,
    scale: ((y = (h = canvas.stage) == null ? void 0 : h.scale) == null ? void 0 : y.x) ?? 1,
    duration: 500
  });
}
function de(e, t = null) {
  var i;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (i = e.element) != null && i[0] ? e.element[0] : e.element ?? null;
}
function Lt() {
  const e = De();
  !p && e.length && (p = e[0].id), T === null && (T = p);
  const t = G(p), i = T === "" ? Fe() : G(T) ?? Fe(), n = ae(i);
  return {
    cameras: e.map((o) => ({
      ...ae(o),
      isSelected: o.id === p
    })),
    selectedCamera: t ? ae(t) : null,
    editorCamera: n,
    sceneChoices: Ct(i.sceneId),
    regionChoices: $t(i.sceneId, i.regionId),
    feedSourceChoices: we(ot, i.feedSource),
    statusChoices: we(nt, i.status),
    displayModeChoices: we(at, i.displayMode),
    showStaticImageField: i.feedSource === "image",
    hasCameras: e.length > 0,
    isNewCamera: !i.id
  };
}
function Ot(e) {
  var n, o, l;
  if (typeof FilePicker > "u") {
    (o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, "Foundry FilePicker is not available.");
    return;
  }
  const t = (l = e == null ? void 0 : e.elements) == null ? void 0 : l.image;
  new FilePicker({
    type: "image",
    current: (t == null ? void 0 : t.value) ?? "",
    callback: (u) => {
      t && (t.value = u);
    }
  }).browse();
}
function Ut(e, t = null) {
  var o, l;
  const i = de(e, t);
  if (!i) return;
  const n = i.querySelector("[data-security-camera-form]");
  n == null || n.addEventListener("submit", async (u) => {
    u.preventDefault(), await Et(n);
  }), (l = (o = n == null ? void 0 : n.elements) == null ? void 0 : o.feedSource) == null || l.addEventListener("change", () => {
    const u = n.querySelector("[data-security-camera-static-image-field]");
    u && (u.hidden = n.elements.feedSource.value !== "image");
  }), i.querySelectorAll("[data-security-camera-id]").forEach((u) => {
    u.addEventListener("click", async (h) => {
      p = h.currentTarget.dataset.securityCameraId, T = p, await e.render(!0);
    });
  }), i.querySelectorAll("[data-security-camera-action]").forEach((u) => {
    u.addEventListener("click", async (h) => {
      const y = h.currentTarget.dataset.securityCameraAction;
      if (y === "new") {
        await He();
        return;
      }
      if (y === "duplicate") {
        await ze(p);
        return;
      }
      if (y === "delete") {
        await Ve(p);
        return;
      }
      if (y === "browse-image") {
        Ot(n);
        return;
      }
      if (y === "pan-region") {
        Nt(p);
        return;
      }
      if (y === "show") {
        await Qe(p);
        return;
      }
      if (y === "close-feed") {
        Ze();
        return;
      }
    });
  });
}
function qe(e) {
  var o, l;
  const t = (e == null ? void 0 : e.camera) ?? {}, i = ne(t.displayMode, Se, O.displayMode), n = de(e);
  if (n == null || n.classList.toggle("security-camera-feed-display-window", i === "window"), n == null || n.classList.toggle("security-camera-feed-display-pip", i === "picture-in-picture"), i === "picture-in-picture") {
    const u = Number(t.regionWidth) && Number(t.regionHeight) ? Number(t.regionWidth) / Number(t.regionHeight) : 1.7777777777777777, h = Math.min(620, Math.max(360, window.innerWidth * 0.42)), y = Math.min(460, Math.max(260, window.innerHeight * 0.38));
    let b = h, C = b / u;
    C > y && (C = y, b = C * u);
    const x = Math.round(C + 112);
    (o = e.setPosition) == null || o.call(e, {
      left: Math.max(12, window.innerWidth - b - 24),
      top: Math.max(12, window.innerHeight - x - 84),
      width: Math.round(b),
      height: x
    });
    return;
  }
  (l = e.setPosition) == null || l.call(e, {
    width: 720,
    height: 520
  });
}
function _t(e, t = null) {
  de(e, t) && (qe(e), Ie.startLocalLiveRefresh(e));
}
const Ie = bt({
  applyLinkedRegionBounds: ue,
  broadcastLiveFrame: (e, t) => {
    var i;
    !((i = game.user) != null && i.isGM) || !(e != null && e.id) || !t || Ce({
      action: "updateFeedFrame",
      gmUserId: game.user.id,
      cameraId: e.id,
      liveFrame: t
    });
  },
  getSceneBackgroundPath: Ge,
  getSceneById: le,
  isFrameProducer: () => {
    var e;
    return !!((e = game.user) != null && e.isGM);
  },
  moduleId: E,
  normalizeCamera: B
}), { SecurityMonitor: Pt, CameraFeed: Wt } = dt({
  moduleId: E,
  monitorTemplatePath: Ft,
  feedTemplatePath: St,
  escapeHTML: Xe,
  getMonitorContext: Lt,
  prepareCamera: ae,
  bindMonitorControls: Ut,
  bindFeedControls: _t,
  getElement: de,
  liveFrameController: Ie,
  clearActiveMonitor: (e) => {
    M === e && (M = null);
  },
  clearActiveFeed: (e) => {
    A === e && (A = null);
  }
});
async function Ke() {
  var e;
  return j("open the Security Camera Manager") ? M ? ((e = M.bringToFront) == null || e.call(M), M) : (M = new Pt(), await M.render(!0), M) : null;
}
async function kt() {
  if (!M) return;
  const e = M;
  M = null, await e.close();
}
async function Je(e, t = {}) {
  const i = B(e);
  return await $e(), A = new Wt(i, {
    liveFrame: t.liveFrame ?? ""
  }), await A.render(!0), qe(A), A;
}
async function $e() {
  if (!A) return;
  const e = A;
  A = null, await e.close();
}
async function Qe(e) {
  var n, o;
  if (!j("broadcast camera feeds")) return null;
  const t = G(e);
  if (!t)
    return (o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, "Security camera not found."), null;
  const i = await Ie.captureLiveFrame(t, {
    preferDataUrl: !0
  });
  return Ce({
    action: "showFeed",
    gmUserId: game.user.id,
    camera: t,
    liveFrame: i
  }), Je(t, { liveFrame: i });
}
function Ze() {
  j("close player camera feeds") && (Ce({
    action: "closeFeed",
    gmUserId: game.user.id
  }), $e());
}
async function Tt() {
  M && await M.render(!0);
}
async function Bt(e) {
  var i, n, o, l, u;
  if (!e || typeof e != "object") return;
  const t = Ye.isGMSender(e.gmUserId);
  if (e.action === "showFeed") {
    if ((i = game.user) != null && i.isGM) return;
    if (!t) {
      console.warn(`${E} | Ignoring camera feed socket message without a GM sender.`);
      return;
    }
    const h = pe(e.camera);
    if (!h.ok) {
      console.warn(`${E} | Ignoring invalid socket camera payload.`, h.errors);
      return;
    }
    await Je(h.camera, {
      liveFrame: typeof e.liveFrame == "string" ? e.liveFrame : ""
    });
    return;
  }
  if (e.action === "updateFeedFrame") {
    if ((n = game.user) != null && n.isGM || !t) return;
    const h = String(e.cameraId ?? "");
    if (!h || ((o = A == null ? void 0 : A.camera) == null ? void 0 : o.id) !== h || typeof e.liveFrame != "string" || !e.liveFrame) return;
    await ((l = A.updateLiveFrame) == null ? void 0 : l.call(A, e.liveFrame));
    return;
  }
  if (e.action === "closeFeed") {
    if ((u = game.user) != null && u.isGM || !t) return;
    await $e();
  }
}
function jt() {
  game.settings.register(E, "cameras", {
    name: "Security Cameras",
    hint: "World-level camera feed definitions for the Security Cameras module.",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  });
}
function Xt() {
  const e = {
    openMonitor: Ke,
    closeMonitor: kt,
    showFeed: Qe,
    registerCamera: xt,
    createNewCamera: He,
    deleteCamera: Ve,
    duplicateCamera: ze,
    getCameras: De,
    closeFeed: Ze,
    get activeMonitor() {
      return M;
    },
    get activeFeed() {
      return A;
    }
  };
  game.securityCameras = e;
  const t = game.modules.get(E);
  t && (t.api = e);
}
function Yt() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: E,
    title: "Security Cameras",
    icon: "fa-solid fa-video",
    premium: !1,
    featureId: E,
    playerVisible: !1,
    description: "Manage camera feeds and broadcast surveillance views.",
    open: () => Ke()
  }), !0) : !1;
}
Hooks.once("init", () => {
  jt();
});
Hooks.once("ready", () => {
  var e, t;
  Xt(), Yt(), (t = (e = game.socket) == null ? void 0 : e.on) == null || t.call(e, je, Bt), console.log(`${E} | Ready. Use game.securityCameras.openMonitor()`);
});
