var et = Object.defineProperty;
var tt = (e, t, r) => t in e ? et(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var E = (e, t, r) => tt(e, typeof t != "symbol" ? t + "" : t, r);
function rt(e, t = e) {
  const r = `${t} |`;
  return {
    log: (n, ...o) => console.log(r, n, ...o),
    warn: (n, ...o) => console.warn(r, n, ...o),
    error: (n, ...o) => console.error(r, n, ...o)
  };
}
function it(e, t = {}) {
  const r = t.socketName ?? `module.${e}`, n = rt(e, t.title ?? e);
  return {
    socketName: r,
    emit(o) {
      var u;
      const l = (u = globalThis.game) == null ? void 0 : u.socket;
      return l != null && l.emit ? (l.emit(r, o), !0) : (n.warn("Foundry socket is unavailable.", o), !1);
    },
    isGMSender(o) {
      var l, u, f;
      return o ? !!((f = (u = (l = globalThis.game) == null ? void 0 : l.users) == null ? void 0 : u.get(String(o))) != null && f.isGM) : !1;
    }
  };
}
const Pe = /* @__PURE__ */ new Set(["online", "offline", "corrupted", "restricted"]), Te = /* @__PURE__ */ new Set(["live", "image"]), Fe = /* @__PURE__ */ new Set(["window", "picture-in-picture"]), ce = 1200, le = 675, nt = [
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
], N = {
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
  regionWidth: ce,
  regionHeight: le,
  notes: ""
};
function ae(e, t, r) {
  const n = String(e ?? "").trim();
  return t.has(n) ? n : r;
}
function M(e) {
  if (e == null || e === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
function O(e, t) {
  const r = Number(e);
  return Number.isFinite(r) && r > 0 ? r : t;
}
function We(e) {
  return e && typeof e == "object" ? e : {};
}
function ve(e = {}, t = {}) {
  var b;
  const r = We(e), n = t.preserveId === !0, o = String(r.id ?? "").trim(), l = n ? o : o || ((b = t.createId) == null ? void 0 : b.call(t)) || "", u = ae(r.feedSource, Te, N.feedSource), f = ae(r.status, Pe, N.status), y = ae(r.displayMode, Fe, N.displayMode);
  return {
    ...N,
    id: l,
    name: String(r.name ?? N.name).trim() || N.name,
    sceneId: String(r.sceneId ?? "").trim(),
    location: String(r.location ?? N.location).trim() || N.location,
    image: String(r.image ?? "").trim(),
    feedSource: u,
    status: f,
    displayMode: y,
    regionId: String(r.regionId ?? "").trim(),
    regionX: M(r.regionX),
    regionY: M(r.regionY),
    regionWidth: O(r.regionWidth, ce),
    regionHeight: O(r.regionHeight, le),
    notes: String(r.notes ?? "").trim()
  };
}
function st(e = {}, t = {}) {
  const r = We(e), n = ve(r, {
    preserveId: t.requireId === !0,
    createId: t.createId
  }), o = [], l = String(r.feedSource ?? N.feedSource).trim(), u = String(r.status ?? N.status).trim(), f = String(r.displayMode ?? N.displayMode).trim();
  return t.requireId && !n.id && o.push("Camera id is required."), typeof r.name == "string" && !r.name.trim() && o.push("Camera name is required."), Te.has(l) || o.push(`Invalid feed source: ${l}`), Pe.has(u) || o.push(`Invalid status: ${u}`), Fe.has(f) || o.push(`Invalid display mode: ${f}`), {
    ok: o.length === 0,
    camera: ve(n, { createId: t.createId }),
    errors: o
  };
}
function ke(e) {
  return e && typeof e == "object" ? e : {};
}
function ct(e = {}) {
  const t = ke(e), r = Array.isArray(t.points) ? t.points : [];
  if (r.length >= 4) {
    const b = [], S = [];
    for (let k = 0; k < r.length; k += 2)
      b.push(Number(r[k])), S.push(Number(r[k + 1]));
    const C = Math.min(...b), w = Math.min(...S), T = Math.max(...b), W = Math.max(...S);
    if ([C, w, T, W].every(Number.isFinite))
      return {
        x: C,
        y: w,
        width: T - C,
        height: W - w
      };
  }
  const n = M(t.x) ?? 0, o = M(t.y) ?? 0, l = M(t.radiusX ?? t.radius), u = M(t.radiusY ?? t.radius);
  if (l && u)
    return {
      x: n - l,
      y: o - u,
      width: l * 2,
      height: u * 2
    };
  const f = O(t.width, 0), y = O(t.height, 0);
  return !f || !y ? null : { x: n, y: o, width: f, height: y };
}
function lt(e) {
  const t = e.filter((u) => !!u);
  if (!t.length) return null;
  const r = Math.min(...t.map((u) => u.x)), n = Math.min(...t.map((u) => u.y)), o = Math.max(...t.map((u) => u.x + u.width)), l = Math.max(...t.map((u) => u.y + u.height));
  return {
    x: r,
    y: n,
    width: o - r,
    height: l - n
  };
}
function be(e) {
  const t = ke(e), r = O(t.width, ce), n = O(t.height, le);
  return !r || !n ? null : {
    regionX: M(t.x) ?? 0,
    regionY: M(t.y) ?? 0,
    regionWidth: r,
    regionHeight: n
  };
}
function ut(e) {
  const t = lt(e.map(ct));
  return t ? be(t) : null;
}
function Ee(e, t) {
  const r = e.cameras.map((w) => `
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
  ` : '<section class="security-camera-monitor-preview"><div class="security-camera-empty">No camera selected.</div></section>', l = e.editorCamera, u = e.sceneChoices.map((w) => `<option value="${t(w.id)}" ${w.selected ? "selected" : ""}>${t(w.name)}</option>`).join(""), f = e.regionChoices.map((w) => `<option value="${t(w.id)}" ${w.selected ? "selected" : ""}>${t(w.name)}</option>`).join(""), y = e.feedSourceChoices.map((w) => `<option value="${t(w.value)}" ${w.selected ? "selected" : ""}>${t(w.label)}</option>`).join(""), b = e.statusChoices.map((w) => `<option value="${t(w.value)}" ${w.selected ? "selected" : ""}>${t(w.label)}</option>`).join(""), S = e.displayModeChoices.map((w) => `<option value="${t(w.value)}" ${w.selected ? "selected" : ""}>${t(w.label)}</option>`).join(""), C = `<label data-security-camera-static-image-field ${e.showStaticImageField ? "" : "hidden"}>Static Image <span class="security-camera-path-row"><input type="text" name="image" value="${t(l.image)}"><button type="button" data-security-camera-action="browse-image">Browse</button></span></label>`;
  return `
    <section class="security-camera-manager">
      <aside class="security-camera-monitor-list">
        <header><span class="security-camera-kicker">Network</span><h2>Cameras</h2></header>
        <div class="security-camera-list">${r || '<p class="security-camera-empty">No cameras registered.</p>'}</div>
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
        <label>Scene Region <select name="regionId">${f}</select></label>
        <label>Location <input type="text" name="location" value="${t(l.location)}"></label>
        <label>Feed Source <select name="feedSource">${y}</select></label>
        ${C}
        <label>Status <select name="status">${b}</select></label>
        <label>Display Mode <select name="displayMode">${S}</select></label>
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
function dt() {
  var t, r, n;
  const e = Number(((r = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : r.generation) ?? ((n = game == null ? void 0 : game.release) == null ? void 0 : n.generation));
  return Number.isFinite(e) ? e : null;
}
function mt() {
  const e = dt();
  return e === null || e >= 13;
}
function ht() {
  var r, n, o, l, u, f;
  const e = ((n = (r = globalThis.foundry) == null ? void 0 : r.appv1) == null ? void 0 : n.api) ?? ((o = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : o.api) ?? null, t = ((u = (l = globalThis.foundry) == null ? void 0 : l.applications) == null ? void 0 : u.api) ?? ((f = foundry == null ? void 0 : foundry.applications) == null ? void 0 : f.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function ft(e) {
  var ne, K, z, J;
  const {
    moduleId: t,
    monitorTemplatePath: r,
    feedTemplatePath: n,
    escapeHTML: o,
    getMonitorContext: l,
    prepareCamera: u,
    bindMonitorControls: f,
    bindFeedControls: y,
    getElement: b,
    liveFrameController: S,
    clearActiveMonitor: C,
    clearActiveFeed: w
  } = e, T = (K = (ne = foundry == null ? void 0 : foundry.applications) == null ? void 0 : ne.api) == null ? void 0 : K.ApplicationV2, W = (J = (z = foundry == null ? void 0 : foundry.applications) == null ? void 0 : z.api) == null ? void 0 : J.HandlebarsApplicationMixin, k = ht(), te = mt();
  function D(p) {
    return typeof p == "string" && p.startsWith("blob:");
  }
  function q(p) {
    D(p == null ? void 0 : p.liveFrameObjectUrl) && typeof URL < "u" && URL.revokeObjectURL(p.liveFrameObjectUrl), p && (p.liveFrameObjectUrl = null);
  }
  function re(p, i) {
    p.liveFrame !== i && (q(p), p.liveFrame = i, p.liveFrameObjectUrl = D(i) ? i : null);
  }
  class he extends k {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "security-camera-monitor",
        title: "Security Camera Manager",
        template: r,
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
    async _renderInner(i) {
      try {
        return await super._renderInner(i);
      } catch (s) {
        return console.warn(`${t} | Monitor template render failed, using inline fallback.`, s), $(Ee(i, o));
      }
    }
    activateListeners(i) {
      super.activateListeners(i), f(this, i);
    }
    async close(i) {
      return C(this), super.close(i);
    }
  }
  class fe extends k {
    constructor(s, a = {}) {
      super(a);
      E(this, "camera");
      E(this, "liveFrame");
      E(this, "liveFrameObjectUrl");
      E(this, "liveFrameTimer");
      this.camera = u(s), this.liveFrame = a.liveFrame ?? "", this.liveFrameObjectUrl = D(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
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
    async _renderInner(s) {
      try {
        return await super._renderInner(s);
      } catch (a) {
        return console.warn(`${t} | Feed template render failed, using inline fallback.`, a), $(Ne({
          ...this.camera,
          liveFrame: this.liveFrame
        }, o));
      }
    }
    activateListeners(s) {
      super.activateListeners(s), y(this, s);
    }
    async updateLiveFrame(s) {
      var m, h;
      re(this, s);
      const a = b(this), c = (m = a == null ? void 0 : a.querySelector) == null ? void 0 : m.call(a, "[data-security-camera-live-frame]"), d = (h = a == null ? void 0 : a.querySelector) == null ? void 0 : h.call(a, "[data-security-camera-live-waiting]");
      if (c) {
        c.src = s, c.hidden = !1, d && (d.hidden = !0);
        return;
      }
      await this.render(!0);
    }
    async close(s) {
      return S.stopLocalLiveRefresh(this), q(this), w(this), super.close(s);
    }
  }
  function ge() {
    var p;
    return !te || !T || !W ? null : (p = class extends W(T) {
      async _prepareContext(s) {
        return {
          ...await super._prepareContext(s),
          ...l()
        };
      }
      async _renderHTML(s, a) {
        try {
          return await super._renderHTML(s, a);
        } catch (c) {
          console.warn(`${t} | Monitor template render failed, using inline fallback.`, c);
          const d = document.createElement("template");
          return d.innerHTML = Ee(s, o).trim(), d.content;
        }
      }
      _onRender(s, a) {
        var c;
        (c = super._onRender) == null || c.call(this, s, a), f(this);
      }
      async close(s) {
        return C(this), super.close(s);
      }
    }, E(p, "DEFAULT_OPTIONS", {
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
    }), E(p, "PARTS", {
      main: {
        template: r
      }
    }), p);
  }
  function ie() {
    var p;
    return !te || !T || !W ? null : (p = class extends W(T) {
      constructor(a, c = {}) {
        super(c);
        E(this, "camera");
        E(this, "liveFrame");
        E(this, "liveFrameObjectUrl");
        E(this, "liveFrameTimer");
        this.camera = u(a), this.liveFrame = c.liveFrame ?? "", this.liveFrameObjectUrl = D(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
      }
      async _prepareContext(a) {
        return this.camera = u(this.camera), {
          ...await super._prepareContext(a),
          camera: {
            ...this.camera,
            liveFrame: this.liveFrame,
            hasLiveFrame: !!this.liveFrame
          }
        };
      }
      async _renderHTML(a, c) {
        try {
          return await super._renderHTML(a, c);
        } catch (d) {
          console.warn(`${t} | Feed template render failed, using inline fallback.`, d);
          const m = document.createElement("template");
          return m.innerHTML = Ne({
            ...this.camera,
            liveFrame: this.liveFrame
          }, o).trim(), m.content;
        }
      }
      _onRender(a, c) {
        var d;
        (d = super._onRender) == null || d.call(this, a, c), y(this);
      }
      async updateLiveFrame(a) {
        var h, g;
        re(this, a);
        const c = b(this), d = (h = c == null ? void 0 : c.querySelector) == null ? void 0 : h.call(c, "[data-security-camera-live-frame]"), m = (g = c == null ? void 0 : c.querySelector) == null ? void 0 : g.call(c, "[data-security-camera-live-waiting]");
        if (d) {
          d.src = a, d.hidden = !1, m && (m.hidden = !0);
          return;
        }
        await this.render(!0);
      }
      async close(a) {
        return S.stopLocalLiveRefresh(this), q(this), w(this), super.close(a);
      }
    }, E(p, "DEFAULT_OPTIONS", {
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
    }), E(p, "PARTS", {
      main: {
        template: n
      }
    }), p);
  }
  return {
    SecurityMonitor: ge() ?? he,
    CameraFeed: ie() ?? fe
  };
}
function Be(e) {
  return Number.isFinite(e.regionX) && Number.isFinite(e.regionY);
}
function se(e) {
  return {
    sx: 0,
    sy: 0,
    sw: e.width,
    sh: e.height
  };
}
function gt(e, t, r, n) {
  if (!Be(t)) return se(e);
  if (r != null && r.width && r.height && e.width >= r.width * 0.75 && e.height >= r.height * 0.75) {
    const o = e.width / r.width, l = e.height / r.height;
    return {
      sx: (t.regionX ?? 0) * o,
      sy: (t.regionY ?? 0) * l,
      sw: t.regionWidth * o,
      sh: t.regionHeight * l
    };
  }
  return (n == null ? void 0 : n(t)) ?? se(e);
}
function Le(e, t) {
  const r = Math.max(0, Math.min(t.width - 1, Math.round(e.sx))), n = Math.max(0, Math.min(t.height - 1, Math.round(e.sy))), o = Math.max(1, Math.min(t.width - r, Math.round(e.sw))), l = Math.max(1, Math.min(t.height - n, Math.round(e.sh)));
  return { sx: r, sy: n, sw: o, sh: l };
}
function yt(e, t, r) {
  if (!Be(t)) return se(e);
  const n = e.width / r.width, o = e.height / r.height;
  return {
    sx: ((t.regionX ?? 0) - r.x) * n,
    sy: ((t.regionY ?? 0) - r.y) * o,
    sw: t.regionWidth * n,
    sh: t.regionHeight * o
  };
}
function Oe(e, t) {
  const r = Math.min(1, t / e.sw);
  return {
    width: Math.max(1, Math.round(e.sw * r)),
    height: Math.max(1, Math.round(e.sh * r))
  };
}
function wt(e, t = 100) {
  const r = H(e);
  if (!r) return null;
  const n = M(r.x), o = M(r.y);
  return !Number.isFinite(n) || !Number.isFinite(o) ? null : {
    x: n,
    y: o,
    width: O(r.width, 1) * t,
    height: O(r.height, 1) * t
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
function vt(e, t, r) {
  return {
    dx: (e.x - t.x) / t.width * r.width,
    dy: (e.y - t.y) / t.height * r.height,
    dw: e.width / t.width * r.width,
    dh: e.height / t.height * r.height
  };
}
const bt = 1250, Ue = 960, pt = 0.62, Ft = 0.72, _e = 18;
function St(e) {
  const t = /* @__PURE__ */ new Map();
  function r(i) {
    const s = e.normalizeCamera(i);
    return s.feedSource === "live" && s.status !== "offline" && s.status !== "restricted";
  }
  function n(i) {
    var s, a;
    return !(!(canvas != null && canvas.ready) || !((s = canvas == null ? void 0 : canvas.app) != null && s.renderer) || i.sceneId && ((a = canvas.scene) == null ? void 0 : a.id) !== i.sceneId);
  }
  function o() {
    var a, c, d, m, h;
    const i = (a = canvas == null ? void 0 : canvas.app) == null ? void 0 : a.renderer, s = [
      (c = canvas == null ? void 0 : canvas.app) == null ? void 0 : c.stage,
      canvas == null ? void 0 : canvas.stage
    ].filter(Boolean);
    try {
      for (const g of s) {
        const v = (m = (d = i == null ? void 0 : i.extract) == null ? void 0 : d.canvas) == null ? void 0 : m.call(d, g);
        if (v != null && v.width && (v != null && v.height)) return v;
      }
    } catch (g) {
      console.warn(`${e.moduleId} | PIXI canvas extraction failed, using renderer view fallback.`, g);
    }
    return (i == null ? void 0 : i.view) ?? ((h = canvas == null ? void 0 : canvas.app) == null ? void 0 : h.view) ?? null;
  }
  function l(i, s) {
    var h, g, v, x;
    const a = e.applyLinkedRegionBounds(e.normalizeCamera(s)), c = ((h = canvas.dimensions) == null ? void 0 : h.width) ?? ((g = canvas.scene) == null ? void 0 : g.width) ?? 0, d = ((v = canvas.dimensions) == null ? void 0 : v.height) ?? ((x = canvas.scene) == null ? void 0 : x.height) ?? 0;
    return gt(i, a, c && d ? { width: c, height: d } : null, () => {
      var L, Y;
      if ((Y = (L = canvas.stage) == null ? void 0 : L.worldTransform) != null && Y.apply && typeof PIXI < "u") {
        const U = canvas.stage.worldTransform.apply(new PIXI.Point(a.regionX, a.regionY)), j = canvas.stage.worldTransform.apply(new PIXI.Point(a.regionX + a.regionWidth, a.regionY + a.regionHeight));
        return {
          sx: U.x,
          sy: U.y,
          sw: j.x - U.x,
          sh: j.y - U.y
        };
      }
      return null;
    });
  }
  function u(i = "") {
    var d, m, h, g, v;
    const s = e.getSceneById(i), c = (s == null ? void 0 : s.id) && ((d = canvas == null ? void 0 : canvas.scene) == null ? void 0 : d.id) === s.id ? canvas.dimensions : s == null ? void 0 : s.dimensions;
    return {
      x: M((c == null ? void 0 : c.sceneX) ?? ((m = c == null ? void 0 : c.sceneRect) == null ? void 0 : m.x)) ?? 0,
      y: M((c == null ? void 0 : c.sceneY) ?? ((h = c == null ? void 0 : c.sceneRect) == null ? void 0 : h.y)) ?? 0,
      width: O(
        (c == null ? void 0 : c.sceneWidth) ?? ((g = c == null ? void 0 : c.sceneRect) == null ? void 0 : g.width) ?? (c == null ? void 0 : c.width) ?? (s == null ? void 0 : s.width),
        ce
      ),
      height: O(
        (c == null ? void 0 : c.sceneHeight) ?? ((v = c == null ? void 0 : c.sceneRect) == null ? void 0 : v.height) ?? (c == null ? void 0 : c.height) ?? (s == null ? void 0 : s.height),
        le
      )
    };
  }
  function f(i, s) {
    const a = e.applyLinkedRegionBounds(e.normalizeCamera(s));
    if (!Number.isFinite(a.regionX) || !Number.isFinite(a.regionY))
      return se({ width: i.naturalWidth, height: i.naturalHeight });
    const c = u(a.sceneId);
    return yt({ width: i.naturalWidth, height: i.naturalHeight }, a, c);
  }
  function y(i) {
    if (!i) return Promise.resolve(null);
    if (t.has(i)) return t.get(i);
    const s = new Promise((a) => {
      const c = (h) => a(h), d = () => {
        const h = new Image();
        h.onload = () => c(h), h.onerror = () => c(null), h.src = i;
      }, m = new Image();
      m.crossOrigin = "anonymous", m.onload = () => c(m), m.onerror = d, m.src = i;
    });
    return t.set(i, s), s;
  }
  function b(i, s, a) {
    try {
      return i.toDataURL(s, a);
    } catch (c) {
      {
        console.warn(`${e.moduleId} | ${s} canvas encode failed, using PNG fallback.`, c);
        try {
          return i.toDataURL("image/png");
        } catch (d) {
          return console.warn(`${e.moduleId} | PNG canvas encode failed.`, d), "";
        }
      }
      return console.warn(`${e.moduleId} | PNG canvas encode failed.`, c), "";
    }
  }
  function S(i, s, a, c = {}) {
    return c.preferDataUrl || !i.toBlob || typeof URL > "u" || !URL.createObjectURL ? Promise.resolve(b(i, s, a)) : new Promise((d) => {
      try {
        i.toBlob((m) => {
          if (m) {
            d(URL.createObjectURL(m));
            return;
          }
          d(b(i, s, a));
        }, s, a);
      } catch (m) {
        console.warn(`${e.moduleId} | ${s} canvas blob encode failed, using data URL fallback.`, m), d(b(i, s, a));
      }
    });
  }
  async function C(i = {}, s = {}) {
    const c = e.getSceneBackgroundPath(i.sceneId) || i.image, d = await y(c);
    if (!(d != null && d.naturalWidth) || !(d != null && d.naturalHeight)) return "";
    const m = Le(f(d, i), {
      width: d.naturalWidth,
      height: d.naturalHeight
    }), { width: h, height: g } = Oe(m, Ue), v = document.createElement("canvas");
    v.width = h, v.height = g;
    const x = v.getContext("2d");
    return x == null || x.drawImage(d, m.sx, m.sy, m.sw, m.sh, 0, 0, h, g), await q(x, i, h, g), S(v, "image/webp", Ft, s);
  }
  function w(i) {
    var a, c, d, m, h, g;
    const s = (i == null ? void 0 : i.id) && ((a = canvas == null ? void 0 : canvas.scene) == null ? void 0 : a.id) === i.id;
    return O(
      s ? ((c = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : c.size) ?? ((d = canvas == null ? void 0 : canvas.grid) == null ? void 0 : d.size) ?? ((m = i == null ? void 0 : i.grid) == null ? void 0 : m.size) : ((h = i == null ? void 0 : i.dimensions) == null ? void 0 : h.size) ?? ((g = i == null ? void 0 : i.grid) == null ? void 0 : g.size),
      100
    );
  }
  function T(i) {
    var a, c, d, m, h;
    if (!i) return [];
    if (i.id && ((a = canvas == null ? void 0 : canvas.scene) == null ? void 0 : a.id) === i.id)
      return (((c = canvas.tokens) == null ? void 0 : c.placeables) ?? []).map((g) => g == null ? void 0 : g.document).filter(Boolean);
    const s = [
      W(i, "Token"),
      i.tokens,
      (d = i.getEmbeddedDocuments) == null ? void 0 : d.call(i, "Token"),
      (m = i.toObject) == null ? void 0 : m.call(i).tokens,
      (h = i._source) == null ? void 0 : h.tokens
    ];
    for (const g of s) {
      const v = k(g);
      if (v.length) return v;
    }
    return [];
  }
  function W(i, s) {
    var a;
    try {
      return (a = i == null ? void 0 : i.getEmbeddedCollection) == null ? void 0 : a.call(i, s);
    } catch (c) {
      return console.warn(`${e.moduleId} | Could not read ${s} collection for inactive scene.`, c), null;
    }
  }
  function k(i) {
    return i ? (Array.isArray(i == null ? void 0 : i.contents) ? i.contents : Array.isArray(i) ? i : typeof i.values == "function" ? Array.from(i.values()) : Array.from(i ?? [])).map((a) => Array.isArray(a) ? a[1] : a).map((a) => (a == null ? void 0 : a.document) ?? a).filter(Boolean) : [];
  }
  function te(i) {
    const s = H(i);
    return !(!s || s.hidden);
  }
  function D(i) {
    var a, c, d, m, h, g, v, x;
    const s = H(i);
    return String(
      ((a = i == null ? void 0 : i.getTextureSrc) == null ? void 0 : a.call(i)) ?? ((c = s == null ? void 0 : s.texture) == null ? void 0 : c.src) ?? (s == null ? void 0 : s.img) ?? ((d = i == null ? void 0 : i.texture) == null ? void 0 : d.src) ?? ((m = i == null ? void 0 : i.actor) == null ? void 0 : m.img) ?? ((h = i == null ? void 0 : i.baseActor) == null ? void 0 : h.img) ?? ((x = (v = (g = i == null ? void 0 : i.actor) == null ? void 0 : g.prototypeToken) == null ? void 0 : v.texture) == null ? void 0 : x.src) ?? ""
    ).trim();
  }
  async function q(i, s, a, c) {
    var x;
    if (!i) return;
    const d = e.getSceneById(s.sceneId);
    if (!d) return;
    const m = e.applyLinkedRegionBounds(e.normalizeCamera(s)), h = {
      x: m.regionX,
      y: m.regionY,
      width: m.regionWidth,
      height: m.regionHeight
    };
    if (![h.x, h.y, h.width, h.height].every(Number.isFinite)) return;
    const g = w(d), v = u(m.sceneId);
    for (const L of T(d)) {
      if (!te(L)) continue;
      const Y = wt(L, g), U = re(Y, h, v);
      if (!U) continue;
      const j = D(L), _ = await y(j), { dx: Me, dy: Ae, dw: xe, dh: Re } = vt(U, h, { width: a, height: c });
      i.save(), i.globalAlpha = M(L.alpha) ?? M((x = H(L)) == null ? void 0 : x.alpha) ?? 1, _ != null && _.naturalWidth && (_ != null && _.naturalHeight) ? i.drawImage(_, Me, Ae, xe, Re) : he(i, L, Me, Ae, xe, Re), i.restore();
    }
  }
  function re(i, s, a) {
    if (!i) return null;
    if (ye(i, s)) return i;
    const c = M(a == null ? void 0 : a.x) ?? 0, d = M(a == null ? void 0 : a.y) ?? 0;
    if (!c && !d) return null;
    const m = {
      ...i,
      x: i.x - c,
      y: i.y - d
    };
    if (ye(m, s)) return m;
    const h = {
      ...i,
      x: i.x + c,
      y: i.y + d
    };
    return ye(h, s) ? h : null;
  }
  function he(i, s, a, c, d, m) {
    const h = H(s), g = Math.max(_e, d), v = Math.max(_e, m), x = a + (d - g) / 2, L = c + (m - v) / 2, Y = Math.min(g, v) / 2, U = x + g / 2, j = L + v / 2;
    i.beginPath(), i.arc(U, j, Y, 0, Math.PI * 2), i.fillStyle = "rgba(10, 18, 24, 0.82)", i.fill(), i.lineWidth = Math.max(2, Math.min(g, v) * 0.08), i.strokeStyle = "rgba(72, 220, 255, 0.95)", i.stroke();
    const _ = String((h == null ? void 0 : h.name) ?? (s == null ? void 0 : s.name) ?? "").trim().slice(0, 2).toUpperCase();
    _ && (i.font = `700 ${Math.max(10, Math.round(Y * 0.72))}px sans-serif`, i.textAlign = "center", i.textBaseline = "middle", i.fillStyle = "rgba(224, 252, 255, 0.96)", i.fillText(_, U, j + 0.5));
  }
  function fe(i) {
    const s = i.getContext("2d", { willReadFrequently: !0 });
    if (!s) return !1;
    const a = Math.min(48, i.width), c = Math.min(48, i.height), d = s.getImageData(0, 0, a, c).data;
    let m = 0;
    const h = d.length / 4;
    for (let g = 0; g < d.length; g += 4)
      m += d[g] + d[g + 1] + d[g + 2];
    return m / (h * 3) < 3;
  }
  async function ge(i = {}, s = {}) {
    const a = o();
    if (!(a != null && a.width) || !(a != null && a.height)) return "";
    const c = Le(l(a, i), a), { width: d, height: m } = Oe(c, Ue), h = document.createElement("canvas");
    h.width = d, h.height = m;
    const g = h.getContext("2d");
    return g == null || g.drawImage(a, c.sx, c.sy, c.sw, c.sh, 0, 0, d, m), fe(h) ? "" : S(h, "image/webp", pt, s);
  }
  async function ie(i = {}, s = {}) {
    let a = await C(i, s);
    return !a && n(i) && (a = await ge(i, s)), a;
  }
  async function ne(i) {
    var a, c;
    if (!r(i == null ? void 0 : i.camera)) return;
    const s = await ie(i.camera, {
      preferDataUrl: !!e.broadcastLiveFrame
    });
    s && K(i) && (await ((a = i.updateLiveFrame) == null ? void 0 : a.call(i, s)), (c = e.broadcastLiveFrame) == null || c.call(e, e.normalizeCamera(i.camera), s));
  }
  function K(i) {
    return !(document.visibilityState === "hidden" || (i == null ? void 0 : i.rendered) === !1);
  }
  function z(i) {
    !K(i) || i != null && i.liveFrameRefreshPending || (i.liveFrameRefreshPending = !0, ne(i).finally(() => {
      i.liveFrameRefreshPending = !1;
    }));
  }
  function J(i) {
    i && (i.liveFrameTimer && window.clearInterval(i.liveFrameTimer), i.liveFrameVisibilityHandler && document.removeEventListener("visibilitychange", i.liveFrameVisibilityHandler), i.liveFrameTimer = null, i.liveFrameVisibilityHandler = null, i.liveFrameRefreshPending = !1);
  }
  function p(i) {
    J(i), r(i == null ? void 0 : i.camera) && e.isFrameProducer() && (i.liveFrameVisibilityHandler = () => z(i), document.addEventListener("visibilitychange", i.liveFrameVisibilityHandler), z(i), i.liveFrameTimer = window.setInterval(() => {
      z(i);
    }, bt));
  }
  return {
    captureLiveFrame: ie,
    startLocalLiveRefresh: p,
    stopLocalLiveRefresh: J
  };
}
const R = "security-cameras", Xe = `module.${R}`, Ct = `modules/${R}/templates/monitor.hbs`, It = `modules/${R}/templates/feed.hbs`;
function Q() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Z(e) {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : JSON.parse(JSON.stringify(e));
}
function Ye(e) {
  var r;
  if ((r = foundry == null ? void 0 : foundry.utils) != null && r.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
const je = it(R, {
  socketName: Xe,
  title: "Security Cameras"
});
let I = null, A = null, F = "", P = "";
function B(e = {}, t = {}) {
  return ve(e, { ...t, createId: Q });
}
function Se(e = {}, t = {}) {
  return st(e, { ...t, createId: Q });
}
function $t(e) {
  var t, r;
  return e ? ((r = (t = game.scenes) == null ? void 0 : t.get(e)) == null ? void 0 : r.name) ?? "Unknown Scene" : "Unassigned Scene";
}
function Ge(e = "") {
  var r;
  const t = ue(e);
  return String(((r = t == null ? void 0 : t.background) == null ? void 0 : r.src) ?? (t == null ? void 0 : t.img) ?? (t == null ? void 0 : t.thumb) ?? "").trim();
}
function Mt(e = "") {
  var r;
  const t = (((r = game.scenes) == null ? void 0 : r.contents) ?? []).map((n) => ({
    id: n.id,
    name: n.name,
    selected: n.id === e
  })).sort((n, o) => n.name.localeCompare(o.name));
  return [
    { id: "", name: "Unassigned Scene", selected: !e },
    ...t
  ];
}
function ue(e = "") {
  var t;
  return e ? ((t = game.scenes) == null ? void 0 : t.get(e)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
}
function At(e = "") {
  var n;
  const t = ue(e);
  return (((n = t == null ? void 0 : t.regions) == null ? void 0 : n.contents) ?? []).map((o) => ({
    id: o.id,
    name: o.name || `Region ${o.id}`,
    region: o
  })).sort((o, l) => o.name.localeCompare(l.name));
}
function xt(e = "", t = "") {
  return [
    { id: "", name: "No Linked Region", selected: !t },
    ...At(e).map((r) => ({
      id: r.id,
      name: r.name,
      selected: r.id === t
    }))
  ];
}
function Rt(e = "", t = "") {
  var n, o;
  if (!e) return null;
  const r = ue(t);
  return ((o = (n = r == null ? void 0 : r.regions) == null ? void 0 : n.get) == null ? void 0 : o.call(n, e)) ?? null;
}
function Et(e) {
  var u, f, y, b;
  const t = (e == null ? void 0 : e.object) ?? ((y = (f = (u = canvas == null ? void 0 : canvas.regions) == null ? void 0 : u.placeables) == null ? void 0 : f.find) == null ? void 0 : y.call(f, (S) => {
    var C;
    return ((C = S.document) == null ? void 0 : C.id) === (e == null ? void 0 : e.id);
  })), r = t == null ? void 0 : t.bounds;
  if (r != null && r.width && (r != null && r.height))
    return be(r);
  const n = e == null ? void 0 : e.bounds;
  if (n != null && n.width && (n != null && n.height))
    return be(n);
  const o = ((b = e == null ? void 0 : e.toObject) == null ? void 0 : b.call(e)) ?? e, l = Array.isArray(e == null ? void 0 : e.shapes) ? e.shapes : Array.isArray(o == null ? void 0 : o.shapes) ? o.shapes : [];
  return ut(l);
}
function de(e) {
  const t = Rt(e.regionId, e.sceneId), r = Et(t);
  return r ? {
    ...e,
    ...r
  } : e;
}
function pe() {
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
  return e.map((r) => ({
    ...r,
    selected: r.value === t
  }));
}
function oe(e = {}) {
  const t = B(e), r = (/* @__PURE__ */ new Date()).toLocaleString(), n = t.status === "online", o = t.status === "offline", l = t.status === "corrupted", u = t.status === "restricted", f = t.feedSource === "live";
  return {
    ...t,
    sceneName: $t(t.sceneId),
    sceneBackground: Ge(t.sceneId),
    regionAspect: t.regionWidth && t.regionHeight ? `${t.regionWidth} / ${t.regionHeight}` : "16 / 9",
    timestamp: r,
    signalLabel: n ? "SIGNAL LOCK" : l ? "SIGNAL CORRUPTED" : u ? "ACCESS DENIED" : "NO SIGNAL",
    isOnline: n,
    isOffline: o,
    isCorrupted: l,
    isRestricted: u,
    isLive: f,
    isImage: !f,
    hasRegion: Number.isFinite(t.regionX) && Number.isFinite(t.regionY),
    canDisplayImage: !!(t.image && !f && !o && !u),
    canUseImageFallback: !!(t.image && f && !o && !u),
    statusClass: `security-camera-status-${t.status}`,
    sourceClass: `security-camera-source-${t.feedSource}`,
    displayClass: `security-camera-display-${t.displayMode}`
  };
}
function V() {
  const e = game.settings.get(R, "cameras");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function Ve() {
  return Object.values(V()).map(B).sort((e, t) => e.name.localeCompare(t.name));
}
function G(e) {
  const t = String(e ?? "");
  if (!t) return null;
  const r = V()[t];
  return r ? B(r) : null;
}
async function ee(e) {
  await game.settings.set(R, "cameras", e), await Yt();
}
function X(e = "manage security cameras") {
  var t, r, n;
  return (t = game.user) != null && t.isGM ? !0 : ((n = (r = ui.notifications) == null ? void 0 : r.warn) == null || n.call(r, `Only the GM can ${e}.`), !1);
}
function Ce(e) {
  return je.emit(e);
}
async function Nt(e = {}) {
  var o, l;
  if (!X("register security cameras")) return null;
  const t = Se(e);
  if (!t.ok)
    return (l = (o = ui.notifications) == null ? void 0 : o.error) == null || l.call(o, t.errors.join(" ")), null;
  const r = de(t.camera), n = Z(V());
  return n[r.id] = r, F = r.id, P = r.id, await ee(n), r;
}
async function De(e) {
  var u, f;
  if (!X("delete security cameras")) return !1;
  const t = String(e ?? F ?? "");
  if (!t || !G(t))
    return (f = (u = ui.notifications) == null ? void 0 : u.warn) == null || f.call(u, "Select a camera to delete."), !1;
  const r = G(t);
  if (!(typeof Dialog < "u" ? await Dialog.confirm({
    title: "Delete Security Camera",
    content: `<p>Delete camera <strong>${Ye(r.name)}</strong>?</p>`,
    yes: () => !0,
    no: () => !1,
    defaultYes: !1
  }) : window.confirm(`Delete camera "${r.name}"?`))) return !1;
  const o = Z(V());
  return delete o[t], F = Object.keys(o)[0] ?? "", P = F, await ee(o), !0;
}
async function ze(e) {
  var o, l;
  if (!X("duplicate security cameras")) return null;
  const t = G(e || F);
  if (!t)
    return (l = (o = ui.notifications) == null ? void 0 : o.warn) == null || l.call(o, "Select a camera to duplicate."), null;
  const r = B({
    ...t,
    id: Q(),
    name: `${t.name} Copy`
  }), n = Z(V());
  return n[r.id] = r, F = r.id, P = r.id, await ee(n), r;
}
async function He() {
  var r, n;
  if (!X("create security cameras")) return null;
  const e = B({
    ...pe(),
    id: Q(),
    name: "New Camera",
    location: "Unlabeled Location"
  }), t = Z(V());
  return t[e.id] = de(e), F = e.id, P = e.id, await ee(t), (n = (r = ui.notifications) == null ? void 0 : r.info) == null || n.call(r, "New security camera created."), e;
}
function Lt(e) {
  const t = new FormData(e), r = String(t.get("originalId") ?? "").trim(), n = String(t.get("id") ?? "").trim() || r || Q();
  return {
    originalId: r,
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
async function Ot(e) {
  var u, f, y, b;
  if (!X("save security cameras")) return null;
  const { originalId: t, camera: r } = Lt(e), n = Se(r);
  if (!n.ok)
    return (f = (u = ui.notifications) == null ? void 0 : u.error) == null || f.call(u, n.errors.join(" ")), null;
  const o = de(n.camera), l = Z(V());
  return t && t !== o.id && delete l[t], l[o.id] = o, F = o.id, P = o.id, await ee(l), (b = (y = ui.notifications) == null ? void 0 : y.info) == null || b.call(y, "Security camera saved."), o;
}
function Ut(e = F) {
  var r, n, o, l, u, f, y, b;
  const t = G(e);
  if (!Number.isFinite(t == null ? void 0 : t.regionX) || !Number.isFinite(t == null ? void 0 : t.regionY)) {
    (n = (r = ui.notifications) == null ? void 0 : r.warn) == null || n.call(r, "This camera does not have a region yet.");
    return;
  }
  if (t.sceneId && ((o = canvas.scene) == null ? void 0 : o.id) !== t.sceneId) {
    (u = (l = ui.notifications) == null ? void 0 : l.warn) == null || u.call(l, "Activate the camera's scene before panning to its region.");
    return;
  }
  (b = canvas.animatePan) == null || b.call(canvas, {
    x: t.regionX + t.regionWidth / 2,
    y: t.regionY + t.regionHeight / 2,
    scale: ((y = (f = canvas.stage) == null ? void 0 : f.scale) == null ? void 0 : y.x) ?? 1,
    duration: 500
  });
}
function me(e, t = null) {
  var r;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (r = e.element) != null && r[0] ? e.element[0] : e.element ?? null;
}
function _t() {
  const e = Ve();
  !F && e.length && (F = e[0].id), P === null && (P = F);
  const t = G(F), r = P === "" ? pe() : G(P) ?? pe(), n = oe(r);
  return {
    cameras: e.map((o) => ({
      ...oe(o),
      isSelected: o.id === F
    })),
    selectedCamera: t ? oe(t) : null,
    editorCamera: n,
    sceneChoices: Mt(r.sceneId),
    regionChoices: xt(r.sceneId, r.regionId),
    feedSourceChoices: we(ot, r.feedSource),
    statusChoices: we(nt, r.status),
    displayModeChoices: we(at, r.displayMode),
    showStaticImageField: r.feedSource === "image",
    hasCameras: e.length > 0,
    isNewCamera: !r.id
  };
}
function Pt(e) {
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
function Tt(e, t = null) {
  var o, l;
  const r = me(e, t);
  if (!r) return;
  const n = r.querySelector("[data-security-camera-form]");
  n == null || n.addEventListener("submit", async (u) => {
    u.preventDefault(), await Ot(n);
  }), (l = (o = n == null ? void 0 : n.elements) == null ? void 0 : o.feedSource) == null || l.addEventListener("change", () => {
    const u = n.querySelector("[data-security-camera-static-image-field]");
    u && (u.hidden = n.elements.feedSource.value !== "image");
  }), r.querySelectorAll("[data-security-camera-id]").forEach((u) => {
    u.addEventListener("click", async (f) => {
      F = f.currentTarget.dataset.securityCameraId, P = F, await e.render(!0);
    });
  }), r.querySelectorAll("[data-security-camera-action]").forEach((u) => {
    u.addEventListener("click", async (f) => {
      const y = f.currentTarget.dataset.securityCameraAction;
      if (y === "new") {
        await He();
        return;
      }
      if (y === "duplicate") {
        await ze(F);
        return;
      }
      if (y === "delete") {
        await De(F);
        return;
      }
      if (y === "browse-image") {
        Pt(n);
        return;
      }
      if (y === "pan-region") {
        Ut(F);
        return;
      }
      if (y === "show") {
        await Qe(F);
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
  const t = (e == null ? void 0 : e.camera) ?? {}, r = ae(t.displayMode, Fe, N.displayMode), n = me(e);
  if (n == null || n.classList.toggle("security-camera-feed-display-window", r === "window"), n == null || n.classList.toggle("security-camera-feed-display-pip", r === "picture-in-picture"), r === "picture-in-picture") {
    const u = Number(t.regionWidth) && Number(t.regionHeight) ? Number(t.regionWidth) / Number(t.regionHeight) : 1.7777777777777777, f = Math.min(620, Math.max(360, window.innerWidth * 0.42)), y = Math.min(460, Math.max(260, window.innerHeight * 0.38));
    let b = f, S = b / u;
    S > y && (S = y, b = S * u);
    const C = Math.round(S + 112);
    (o = e.setPosition) == null || o.call(e, {
      left: Math.max(12, window.innerWidth - b - 24),
      top: Math.max(12, window.innerHeight - C - 84),
      width: Math.round(b),
      height: C
    });
    return;
  }
  (l = e.setPosition) == null || l.call(e, {
    width: 720,
    height: 520
  });
}
function Wt(e, t = null) {
  me(e, t) && (qe(e), Ie.startLocalLiveRefresh(e));
}
const Ie = St({
  applyLinkedRegionBounds: de,
  broadcastLiveFrame: (e, t) => {
    var r;
    !((r = game.user) != null && r.isGM) || !(e != null && e.id) || !t || Ce({
      action: "updateFeedFrame",
      gmUserId: game.user.id,
      cameraId: e.id,
      liveFrame: t
    });
  },
  getSceneBackgroundPath: Ge,
  getSceneById: ue,
  isFrameProducer: () => {
    var e;
    return !!((e = game.user) != null && e.isGM);
  },
  moduleId: R,
  normalizeCamera: B
}), { SecurityMonitor: kt, CameraFeed: Bt } = ft({
  moduleId: R,
  monitorTemplatePath: Ct,
  feedTemplatePath: It,
  escapeHTML: Ye,
  getMonitorContext: _t,
  prepareCamera: oe,
  bindMonitorControls: Tt,
  bindFeedControls: Wt,
  getElement: me,
  liveFrameController: Ie,
  clearActiveMonitor: (e) => {
    I === e && (I = null);
  },
  clearActiveFeed: (e) => {
    A === e && (A = null);
  }
});
async function Ke() {
  var e;
  return X("open the Security Camera Manager") ? I ? ((e = I.bringToFront) == null || e.call(I), I) : (I = new kt(), await I.render(!0), I) : null;
}
async function Xt() {
  if (!I) return;
  const e = I;
  I = null, await e.close();
}
async function Je(e, t = {}) {
  const r = B(e);
  return await $e(), A = new Bt(r, {
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
  if (!X("broadcast camera feeds")) return null;
  const t = G(e);
  if (!t)
    return (o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, "Security camera not found."), null;
  const r = await Ie.captureLiveFrame(t, {
    preferDataUrl: !0
  });
  return Ce({
    action: "showFeed",
    gmUserId: game.user.id,
    camera: t,
    liveFrame: r
  }), Je(t, { liveFrame: r });
}
function Ze() {
  X("close player camera feeds") && (Ce({
    action: "closeFeed",
    gmUserId: game.user.id
  }), $e());
}
async function Yt() {
  I && await I.render(!0);
}
async function jt(e) {
  var r, n, o, l, u;
  if (!e || typeof e != "object") return;
  const t = je.isGMSender(e.gmUserId);
  if (e.action === "showFeed") {
    if ((r = game.user) != null && r.isGM) return;
    if (!t) {
      console.warn(`${R} | Ignoring camera feed socket message without a GM sender.`);
      return;
    }
    const f = Se(e.camera);
    if (!f.ok) {
      console.warn(`${R} | Ignoring invalid socket camera payload.`, f.errors);
      return;
    }
    await Je(f.camera, {
      liveFrame: typeof e.liveFrame == "string" ? e.liveFrame : ""
    });
    return;
  }
  if (e.action === "updateFeedFrame") {
    if ((n = game.user) != null && n.isGM || !t) return;
    const f = String(e.cameraId ?? "");
    if (!f || ((o = A == null ? void 0 : A.camera) == null ? void 0 : o.id) !== f || typeof e.liveFrame != "string" || !e.liveFrame) return;
    await ((l = A.updateLiveFrame) == null ? void 0 : l.call(A, e.liveFrame));
    return;
  }
  if (e.action === "closeFeed") {
    if ((u = game.user) != null && u.isGM || !t) return;
    await $e();
  }
}
function Gt() {
  game.settings.register(R, "cameras", {
    name: "Security Cameras",
    hint: "World-level camera feed definitions for the Security Cameras module.",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  });
}
function Vt() {
  const e = {
    openMonitor: Ke,
    closeMonitor: Xt,
    showFeed: Qe,
    registerCamera: Nt,
    createNewCamera: He,
    deleteCamera: De,
    duplicateCamera: ze,
    getCameras: Ve,
    closeFeed: Ze,
    get activeMonitor() {
      return I;
    },
    get activeFeed() {
      return A;
    }
  };
  game.securityCameras = e;
  const t = game.modules.get(R);
  t && (t.api = e);
}
function Dt() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: R,
    title: "Security Cameras",
    icon: "fa-solid fa-video",
    premium: !1,
    featureId: R,
    playerVisible: !1,
    description: "Manage camera feeds and broadcast surveillance views.",
    open: () => Ke()
  }), !0) : !1;
}
Hooks.once("init", () => {
  Gt();
});
Hooks.once("ready", () => {
  var e, t;
  Vt(), Dt(), (t = (e = game.socket) == null ? void 0 : e.on) == null || t.call(e, Xe, jt), console.log(`${R} | Ready. Use game.securityCameras.openMonitor()`);
});
