var Mt = Object.defineProperty;
var Rt = (e, t, i) => t in e ? Mt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var X = (e, t, i) => Rt(e, typeof t != "symbol" ? t + "" : t, i);
function xt(e, t) {
  return !e || !t ? !1 : !!(e.isGM || t.status !== "offline" && t.status !== "restricted");
}
function ue(e) {
  return JSON.stringify(e);
}
function Lt(e, t = e) {
  const i = `${t} |`;
  return {
    log: (n, ...a) => console.log(i, n, ...a),
    warn: (n, ...a) => console.warn(i, n, ...a),
    error: (n, ...a) => console.error(i, n, ...a)
  };
}
function Nt(e, t = {}) {
  const i = t.socketName ?? `module.${e}`, n = Lt(e, t.title ?? e);
  return {
    socketName: i,
    emit(a) {
      var c;
      const o = (c = globalThis.game) == null ? void 0 : c.socket;
      return o != null && o.emit ? (o.emit(i, a), !0) : (n.warn("Foundry socket is unavailable.", a), !1);
    },
    isGMSender(a) {
      var o, c, u;
      return a ? !!((u = (c = (o = globalThis.game) == null ? void 0 : o.users) == null ? void 0 : c.get(String(a))) != null && u.isGM) : !1;
    }
  };
}
const lt = /* @__PURE__ */ new Set(["online", "clean", "offline", "corrupted", "restricted"]), ut = /* @__PURE__ */ new Set(["live", "image"]), He = /* @__PURE__ */ new Set(["window", "picture-in-picture"]), Ee = 1200, Me = 675, Ot = [
  { value: "online", label: "Online" },
  { value: "clean", label: "Clean" },
  { value: "offline", label: "Offline" },
  { value: "corrupted", label: "Corrupted" },
  { value: "restricted", label: "Restricted" }
], Ut = [
  { value: "window", label: "Window" },
  { value: "picture-in-picture", label: "Picture-in-Picture" }
], _t = [
  { value: "live", label: "Live Canvas" },
  { value: "image", label: "Static Image" }
], j = {
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
  regionWidth: Ee,
  regionHeight: Me,
  notes: ""
};
function Ne(e, t, i) {
  const n = String(e ?? "").trim();
  return t.has(n) ? n : i;
}
function B(e) {
  if (e == null || e === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
function K(e, t) {
  const i = Number(e);
  return Number.isFinite(i) && i > 0 ? i : t;
}
function dt(e) {
  return e && typeof e == "object" ? e : {};
}
function Xe(e = {}, t = {}) {
  var f;
  const i = dt(e), n = t.preserveId === !0, a = String(i.id ?? "").trim(), o = n ? a : a || ((f = t.createId) == null ? void 0 : f.call(t)) || "", c = Ne(i.feedSource, ut, j.feedSource), u = Ne(i.status, lt, j.status), y = Ne(i.displayMode, He, j.displayMode);
  return {
    ...j,
    id: o,
    name: String(i.name ?? j.name).trim() || j.name,
    sceneId: String(i.sceneId ?? "").trim(),
    location: String(i.location ?? j.location).trim() || j.location,
    image: String(i.image ?? "").trim(),
    feedSource: c,
    status: u,
    displayMode: y,
    regionId: String(i.regionId ?? "").trim(),
    regionX: B(i.regionX),
    regionY: B(i.regionY),
    regionWidth: K(i.regionWidth, Ee),
    regionHeight: K(i.regionHeight, Me),
    notes: String(i.notes ?? "").trim()
  };
}
function Dt(e = {}, t = {}) {
  const i = dt(e), n = Xe(i, {
    preserveId: t.requireId === !0,
    createId: t.createId
  }), a = [], o = String(i.feedSource ?? j.feedSource).trim(), c = String(i.status ?? j.status).trim(), u = String(i.displayMode ?? j.displayMode).trim();
  return t.requireId && !n.id && a.push("Camera id is required."), typeof i.name == "string" && !i.name.trim() && a.push("Camera name is required."), ut.has(o) || a.push(`Invalid feed source: ${o}`), lt.has(c) || a.push(`Invalid status: ${c}`), He.has(u) || a.push(`Invalid display mode: ${u}`), {
    ok: a.length === 0,
    camera: Xe(n, { createId: t.createId }),
    errors: a
  };
}
function mt(e) {
  return e && typeof e == "object" ? e : {};
}
function kt(e = {}) {
  const t = mt(e), i = Array.isArray(t.points) ? t.points : [];
  if (i.length >= 4) {
    const f = [], w = [];
    for (let h = 0; h < i.length; h += 2)
      f.push(Number(i[h])), w.push(Number(i[h + 1]));
    const S = Math.min(...f), v = Math.min(...w), R = Math.max(...f), b = Math.max(...w);
    if ([S, v, R, b].every(Number.isFinite))
      return {
        x: S,
        y: v,
        width: R - S,
        height: b - v
      };
  }
  const n = B(t.x) ?? 0, a = B(t.y) ?? 0, o = B(t.radiusX ?? t.radius), c = B(t.radiusY ?? t.radius);
  if (o && c)
    return {
      x: n - o,
      y: a - c,
      width: o * 2,
      height: c * 2
    };
  const u = K(t.width, 0), y = K(t.height, 0);
  return !u || !y ? null : { x: n, y: a, width: u, height: y };
}
function Tt(e) {
  const t = e.filter((c) => !!c);
  if (!t.length) return null;
  const i = Math.min(...t.map((c) => c.x)), n = Math.min(...t.map((c) => c.y)), a = Math.max(...t.map((c) => c.x + c.width)), o = Math.max(...t.map((c) => c.y + c.height));
  return {
    x: i,
    y: n,
    width: a - i,
    height: o - n
  };
}
function je(e) {
  const t = mt(e), i = K(t.width, Ee), n = K(t.height, Me);
  return !i || !n ? null : {
    regionX: B(t.x) ?? 0,
    regionY: B(t.y) ?? 0,
    regionWidth: i,
    regionHeight: n
  };
}
function Pt(e) {
  const t = Tt(e.map(kt));
  return t ? je(t) : null;
}
function et(e, t) {
  const i = e.cameras.map((v) => `
    <button type="button" class="security-camera-list-item ${t(v.statusClass)} ${v.isSelected ? "active" : ""}" aria-pressed="${!!v.isSelected}" data-security-camera-id="${t(v.id)}">
      <i class="fa-solid fa-video security-camera-device-icon" aria-hidden="true"></i>
      <span class="security-camera-device-name" title="${t(v.name)}">${t(v.name)}</span>
      <small title="${t(v.location)}">${t(v.location)}</small>
      <span class="security-camera-device-status">${t(v.status)}</span>
    </button>
  `).join(""), n = e.selectedCamera, a = n ? `
    <section class="security-camera-monitor-preview ${t(n.statusClass)}">
      <header>
        <div>
          <span class="security-camera-kicker">Selected Feed</span>
          <h3>${t(n.name)}</h3>
        </div>
        <strong>${t(n.status.toUpperCase())}</strong>
      </header>
      <div class="security-camera-monitor-display">
      <div class="security-camera-preview-frame">
        ${n.canDisplayImage ? `<img src="${t(n.image)}" alt="${t(n.name)}">` : `<div class="security-camera-placeholder">${t(n.signalLabel)}</div>`}
      </div>
      <div class="security-camera-monitor-readout"><span>${t(n.id)}</span><span>${t(n.feedSource)}</span></div>
      </div>
      <dl>
        <dt>Location</dt><dd>${t(n.location)}</dd>
        <dt>Scene</dt><dd>${t(n.sceneName)}</dd>
        <dt>Source</dt><dd>${t(n.feedSource)}</dd>
        <dt>Region</dt><dd>${t(n.regionName)}</dd>
        <dt>Mode</dt><dd>${t(n.displayMode)}</dd>
        <dt>Notes</dt><dd>${t(n.notes || "No notes.")}</dd>
      </dl>
      <div class="security-camera-preview-actions">
        <button type="button" data-security-camera-action="show"><i class="fa-solid fa-tower-broadcast" aria-hidden="true"></i> Show Saved Feed</button>
        <button type="button" data-security-camera-action="close-feed"><i class="fa-solid fa-stop" aria-hidden="true"></i> Close Feeds</button>
      </div>
    </section>
  ` : '<section class="security-camera-monitor-preview"><div class="security-camera-empty">No camera selected.</div></section>', o = e.editorCamera, c = e.sceneChoices.map((v) => `<option value="${t(v.id)}" ${v.selected ? "selected" : ""}>${t(v.name)}</option>`).join(""), u = e.regionChoices.map((v) => `<option value="${t(v.id)}" ${v.selected ? "selected" : ""}>${t(v.name)}</option>`).join(""), y = e.feedSourceChoices.map((v) => `<option value="${t(v.value)}" ${v.selected ? "selected" : ""}>${t(v.label)}</option>`).join(""), f = e.statusChoices.map((v) => `<option value="${t(v.value)}" ${v.selected ? "selected" : ""}>${t(v.label)}</option>`).join(""), w = e.displayModeChoices.map((v) => `<option value="${t(v.value)}" ${v.selected ? "selected" : ""}>${t(v.label)}</option>`).join(""), S = `<label data-security-camera-static-image-field ${e.showStaticImageField ? "" : "hidden"}>Static Image <span class="security-camera-path-row"><input type="text" name="image" value="${t(o.image)}"><button type="button" data-security-camera-action="browse-image"><i class="fa-solid fa-folder-open" aria-hidden="true"></i> Browse</button></span></label>`;
  return `
    <section class="security-camera-manager">
      <aside class="security-camera-monitor-list">
        <header><h2><span class="security-camera-network-icon" aria-hidden="true"></span> Camera Network</h2><span class="security-camera-count" aria-label="Registered cameras">${e.cameras.length}</span></header>
        <div class="security-camera-list">${i || '<p class="security-camera-empty">No cameras registered.</p>'}</div>
        <div class="security-camera-list-actions">
          <button type="button" data-security-camera-action="new"><i class="fa-solid fa-plus" aria-hidden="true"></i> New</button>
          <button type="button" data-security-camera-action="duplicate"><i class="fa-solid fa-copy" aria-hidden="true"></i> Duplicate</button>
          <button type="button" data-security-camera-action="delete"><i class="fa-solid fa-trash-can" aria-hidden="true"></i> Delete</button>
        </div>
      </aside>
      ${a}
      <form class="security-camera-editor" data-security-camera-form>
        <header><span class="security-camera-kicker"><i class="fa-solid fa-sliders" aria-hidden="true"></i> Configuration</span><h2>${e.isNewCamera ? "Add Camera" : "Edit Camera"}</h2></header>
        <div class="security-camera-editor-scroll">
        <fieldset class="security-camera-field-group"><legend>Camera identity</legend>
        <p class="security-camera-dirty" data-camera-dirty ${e.editorDirty ? "" : "hidden"}>Unsaved changes</p>
        <input type="hidden" name="originalId" value="${t(e.originalEditorId)}">
        <label>ID <input type="text" name="id" value="${t(o.id)}" placeholder="auto-generated"></label>
        <label>Name <input type="text" name="name" value="${t(o.name)}" required></label>
        <label>Location <input type="text" name="location" value="${t(o.location)}"></label>
        </fieldset>
        <fieldset class="security-camera-field-group"><legend>Scene connection</legend>
        <label>Scene <select name="sceneId" ${o.isLive ? "" : "disabled"}>${c}</select></label>
        <label>Scene Region <select name="regionId" ${o.isLive ? "" : "disabled"}>${u}</select></label>
        </fieldset>
        <fieldset class="security-camera-field-group"><legend>Feed settings</legend>
        <label>Feed Source <select name="feedSource">${y}</select></label>
        ${S}
        <label>Status <select name="status">${f}</select></label>
        <label>Display Mode <select name="displayMode">${w}</select></label>
        <input type="hidden" name="regionX" value="${t(o.regionX ?? "")}">
        <input type="hidden" name="regionY" value="${t(o.regionY ?? "")}">
        <input type="hidden" name="regionWidth" value="${t(o.regionWidth ?? "")}">
        <input type="hidden" name="regionHeight" value="${t(o.regionHeight ?? "")}">
        <label>Notes <textarea name="notes" rows="3">${t(o.notes)}</textarea></label>
        </fieldset>
        </div>
        <div class="security-camera-editor-actions">
          <button type="submit" class="security-camera-primary"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Save Camera</button>
          <button type="button" data-security-camera-action="pan-region"><i class="fa-solid fa-crosshairs" aria-hidden="true"></i> Pan to Region</button>
          <button type="button" data-security-camera-action="save-show"><i class="fa-solid fa-tower-broadcast" aria-hidden="true"></i> Save &amp; Show</button>
          <button type="button" data-security-camera-action="close-feed"><i class="fa-solid fa-stop" aria-hidden="true"></i> Close Feeds</button>
        </div>
      </form>
    </section>
  `;
}
function tt(e, t) {
  const n = e.isLive && !e.isOffline && !e.isRestricted ? `<img src="${t(e.liveFrame || e.image || "")}" alt="${t(e.name)}" data-security-camera-live-frame ${e.liveFrame || e.image ? "" : "hidden"}><div class="security-camera-feed-warning" data-security-camera-live-waiting ${e.liveFrame || e.image ? "hidden" : ""}>AWAITING LIVE SIGNAL</div>` : e.canDisplayImage ? `<img src="${t(e.image)}" alt="${t(e.name)}">` : `<div class="security-camera-feed-warning">${t(e.signalLabel)}</div>`;
  return `
    <section class="security-camera-feed ${t(e.statusClass)} ${t(e.sourceClass)} ${t(e.displayClass)}">
      <div class="security-camera-feed-static" aria-hidden="true"></div>
      <div class="security-camera-feed-scanline" aria-hidden="true"></div>
      <button type="button" class="security-camera-feed-drag" data-security-camera-drag aria-label="Move camera feed" title="Drag to move; use arrow keys when focused"><span aria-hidden="true"></span></button>
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
        <button type="button" class="security-camera-feed-close" data-security-camera-close aria-label="Close camera feed" title="Close camera feed"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      </footer>
    </section>
  `;
}
function Gt() {
  var t, i, n;
  const e = Number(((i = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : i.generation) ?? ((n = game == null ? void 0 : game.release) == null ? void 0 : n.generation));
  return Number.isFinite(e) ? e : null;
}
function Bt() {
  const e = Gt();
  return e === null || e >= 13;
}
function Yt() {
  var i, n, a, o, c, u;
  const e = ((n = (i = globalThis.foundry) == null ? void 0 : i.appv1) == null ? void 0 : n.api) ?? ((a = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : a.api) ?? null, t = ((c = (o = globalThis.foundry) == null ? void 0 : o.applications) == null ? void 0 : c.api) ?? ((u = foundry == null ? void 0 : foundry.applications) == null ? void 0 : u.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function Wt(e) {
  var se, he, ee, be;
  const {
    moduleId: t,
    monitorTemplatePath: i,
    feedTemplatePath: n,
    escapeHTML: a,
    getMonitorContext: o,
    prepareCamera: c,
    bindMonitorControls: u,
    bindFeedControls: y,
    getElement: f,
    liveFrameController: w,
    allowDiscardCameraChanges: S,
    clearActiveMonitor: v,
    clearActiveFeed: R
  } = e, b = (he = (se = foundry == null ? void 0 : foundry.applications) == null ? void 0 : se.api) == null ? void 0 : he.ApplicationV2, h = (be = (ee = foundry == null ? void 0 : foundry.applications) == null ? void 0 : ee.api) == null ? void 0 : be.HandlebarsApplicationMixin, I = Yt(), k = Bt();
  function T(C) {
    return typeof C == "string" && C.startsWith("blob:");
  }
  function z(C) {
    T(C == null ? void 0 : C.liveFrameObjectUrl) && typeof URL < "u" && URL.revokeObjectURL(C.liveFrameObjectUrl), C && (C.liveFrameObjectUrl = null);
  }
  function W(C, U) {
    C.lastFrameAt = Date.now(), C.frameError = !1, C.liveFrame !== U && (z(C), C.liveFrame = U, C.liveFrameObjectUrl = T(U) ? U : null);
  }
  class ie extends I {
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
      return o();
    }
    async _renderInner(U) {
      try {
        return await super._renderInner(U);
      } catch (E) {
        return console.warn(`${t} | Monitor template render failed, using inline fallback.`, E), $(et(U, a));
      }
    }
    activateListeners(U) {
      super.activateListeners(U), u(this, U);
    }
    async close(U) {
      return S() ? (v(this), super.close(U)) : this;
    }
  }
  class me extends I {
    constructor(E, p = {}) {
      super(p);
      X(this, "camera");
      X(this, "liveFrame");
      X(this, "liveFrameObjectUrl");
      X(this, "liveFrameTimer");
      this.camera = c(E), this.liveFrame = p.liveFrame ?? "", this.liveFrameObjectUrl = T(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
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
      return this.camera = c(this.camera), {
        camera: {
          ...this.camera,
          liveFrame: this.liveFrame,
          hasLiveFrame: !!this.liveFrame
        }
      };
    }
    async _renderInner(E) {
      try {
        return await super._renderInner(E);
      } catch (p) {
        return console.warn(`${t} | Feed template render failed, using inline fallback.`, p), $(tt({
          ...this.camera,
          liveFrame: this.liveFrame
        }, a));
      }
    }
    activateListeners(E) {
      super.activateListeners(E), y(this, E);
    }
    async updateLiveFrame(E) {
      var d, l;
      W(this, E);
      const p = f(this), r = (d = p == null ? void 0 : p.querySelector) == null ? void 0 : d.call(p, "[data-security-camera-live-frame]"), s = (l = p == null ? void 0 : p.querySelector) == null ? void 0 : l.call(p, "[data-security-camera-live-waiting]");
      if (r) {
        r.src = E, r.hidden = !1, s && (s.hidden = !0);
        return;
      }
      await this.render(!0);
    }
    async close(E) {
      return w.stopLocalLiveRefresh(this), z(this), R(this), super.close(E);
    }
  }
  function fe() {
    var C;
    return !k || !b || !h ? null : (C = class extends h(b) {
      async _prepareContext(E) {
        return {
          ...await super._prepareContext(E),
          ...o()
        };
      }
      async _renderHTML(E, p) {
        try {
          return await super._renderHTML(E, p);
        } catch (r) {
          console.warn(`${t} | Monitor template render failed, using inline fallback.`, r);
          const s = document.createElement("template");
          return s.innerHTML = et(E, a).trim(), s.content;
        }
      }
      _onRender(E, p) {
        var r;
        (r = super._onRender) == null || r.call(this, E, p), u(this);
      }
      async close(E) {
        return S() ? (v(this), super.close(E)) : this;
      }
    }, X(C, "DEFAULT_OPTIONS", {
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
    }), X(C, "PARTS", {
      main: {
        template: i
      }
    }), C);
  }
  function P() {
    var C;
    return !k || !b || !h ? null : (C = class extends h(b) {
      constructor(p, r = {}) {
        super(r);
        X(this, "camera");
        X(this, "liveFrame");
        X(this, "liveFrameObjectUrl");
        X(this, "liveFrameTimer");
        this.camera = c(p), this.liveFrame = r.liveFrame ?? "", this.liveFrameObjectUrl = T(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
      }
      async _prepareContext(p) {
        return this.camera = c(this.camera), {
          ...await super._prepareContext(p),
          camera: {
            ...this.camera,
            liveFrame: this.liveFrame,
            hasLiveFrame: !!this.liveFrame
          }
        };
      }
      async _renderHTML(p, r) {
        try {
          return await super._renderHTML(p, r);
        } catch (s) {
          console.warn(`${t} | Feed template render failed, using inline fallback.`, s);
          const d = document.createElement("template");
          return d.innerHTML = tt({
            ...this.camera,
            liveFrame: this.liveFrame
          }, a).trim(), d.content;
        }
      }
      _onRender(p, r) {
        var s;
        (s = super._onRender) == null || s.call(this, p, r), y(this);
      }
      async updateLiveFrame(p) {
        var l, m;
        W(this, p);
        const r = f(this), s = (l = r == null ? void 0 : r.querySelector) == null ? void 0 : l.call(r, "[data-security-camera-live-frame]"), d = (m = r == null ? void 0 : r.querySelector) == null ? void 0 : m.call(r, "[data-security-camera-live-waiting]");
        if (s) {
          s.src = p, s.hidden = !1, d && (d.hidden = !0);
          return;
        }
        await this.render(!0);
      }
      async close(p) {
        return w.stopLocalLiveRefresh(this), z(this), R(this), super.close(p);
      }
    }, X(C, "DEFAULT_OPTIONS", {
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
    }), X(C, "PARTS", {
      main: {
        template: n
      }
    }), C);
  }
  return {
    SecurityMonitor: fe() ?? ie,
    CameraFeed: P() ?? me
  };
}
function Xt(e = 1e3, t = 32) {
  const i = /* @__PURE__ */ new Map();
  return {
    clear() {
      i.clear();
    },
    get(n, a) {
      const o = i.get(n);
      if (o && (o.pending || Date.now() - o.time < e)) return o.promise;
      const c = { time: Date.now(), pending: !0, promise: null };
      for (c.promise = Promise.resolve().then(a).then((u) => (c.pending = !1, c.time = Date.now(), !u && i.get(n) === c && i.delete(n), u), (u) => {
        throw i.get(n) === c && i.delete(n), u;
      }), i.set(n, c); i.size > t; ) i.delete(i.keys().next().value);
      return c.promise;
    }
  };
}
function jt(e, t = 100) {
  const i = J(e);
  if (!i) return null;
  const n = B(i.x), a = B(i.y);
  return !Number.isFinite(n) || !Number.isFinite(a) ? null : {
    x: n,
    y: a,
    width: K(i.width, 1) * t,
    height: K(i.height, 1) * t
  };
}
function J(e) {
  if (!e) return null;
  if (e.document) return J(e.document);
  if (typeof e.toObject == "function") {
    const t = e.toObject();
    if (t && typeof t == "object") return t;
  }
  return e._source && typeof e._source == "object" ? e._source : e;
}
function Ye(e, t) {
  const i = Math.max(e.x, t.x), n = Math.max(e.y, t.y), a = Math.min(e.x + e.width, t.x + t.width), o = Math.min(e.y + e.height, t.y + t.height), c = a - i, u = o - n;
  return c > 0 && u > 0 ? { x: i, y: n, width: c, height: u } : null;
}
function Vt(e, t, i) {
  return {
    dx: (e.x - t.x) / t.width * i.width,
    dy: (e.y - t.y) / t.height * i.height,
    dw: e.width / t.width * i.width,
    dh: e.height / t.height * i.height
  };
}
const _ = (e, t = 0) => Number.isFinite(Number(e)) ? Number(e) : t;
function zt(e) {
  if (!e) return [];
  const t = e.contents ?? (typeof e.values == "function" ? Array.from(e.values()) : e);
  return Array.isArray(t) ? t.map((i) => (i == null ? void 0 : i.document) ?? i).filter(Boolean) : [];
}
function qt(e, t) {
  return [
    ...e.map((i) => ({ kind: "tile", document: i })),
    ...t.map((i) => ({ kind: "token", document: i }))
  ].filter((i) => {
    var n;
    return !((n = J(i.document)) != null && n.hidden);
  }).sort((i, n) => {
    const a = J(i.document), o = J(n.document);
    return _(a.elevation, a.overhead ? 1 : 0) - _(o.elevation, o.overhead ? 1 : 0) || (i.kind === "tile" ? 0 : 1) - (n.kind === "tile" ? 0 : 1) || _(a.sort) - _(o.sort);
  });
}
function it(e, t) {
  var z, W, ie, me, fe;
  const i = J(e);
  if (!i || i.hidden || !(i.width > 0) || !(i.height > 0)) return null;
  let n = _(i.width), a = _(i.height);
  const o = (t == null ? void 0 : t.naturalWidth) || (t == null ? void 0 : t.videoWidth) || n, c = (t == null ? void 0 : t.naturalHeight) || (t == null ? void 0 : t.videoHeight) || a, u = ((z = i.texture) == null ? void 0 : z.fit) ?? "fill", y = u === "cover" ? Math.max(n / o, a / c) : u === "contain" ? Math.min(n / o, a / c) : u === "width" ? n / o : u === "height" ? a / c : null;
  y !== null && (n = o * y, a = c * y);
  const f = _((W = i.texture) == null ? void 0 : W.anchorX, 0.5), w = _((ie = i.texture) == null ? void 0 : ie.anchorY, 0.5), S = _((me = i.texture) == null ? void 0 : me.scaleX, 1), v = _((fe = i.texture) == null ? void 0 : fe.scaleY, 1), R = _(i.rotation) * Math.PI / 180, b = _(i.x) + _(i.width) * _(i.anchorX, 0.5), h = _(i.y) + _(i.height) * _(i.anchorY, 0.5), I = [
    [-n * f, -a * w],
    [n * (1 - f), -a * w],
    [n * (1 - f), a * (1 - w)],
    [-n * f, a * (1 - w)]
  ].map(([P, se]) => ({
    x: b + P * S * Math.cos(R) - se * v * Math.sin(R),
    y: h + P * S * Math.sin(R) + se * v * Math.cos(R)
  })), k = Math.min(...I.map((P) => P.x)), T = Math.min(...I.map((P) => P.y));
  return {
    width: n,
    height: a,
    anchorX: f,
    anchorY: w,
    scaleX: S,
    scaleY: v,
    rotation: R,
    cx: b,
    cy: h,
    alpha: Math.max(0, Math.min(1, _(i.alpha, 1))),
    bounds: {
      x: k,
      y: T,
      width: Math.max(...I.map((P) => P.x)) - k,
      height: Math.max(...I.map((P) => P.y)) - T
    }
  };
}
function Ht(e, t, i) {
  e.save();
  try {
    e.globalAlpha = i.alpha, e.translate(i.cx, i.cy), e.rotate(i.rotation), e.scale(i.scaleX, i.scaleY), e.drawImage(t, -i.width * i.anchorX, -i.height * i.anchorY, i.width, i.height);
  } finally {
    e.restore();
  }
}
const rt = 1250, nt = 960, Jt = 0.72, at = 18;
function Kt(e) {
  const t = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), n = Xt(), a = /* @__PURE__ */ new Map();
  function o(r) {
    i.has(r) && (window.clearTimeout(a.get(r)), a.set(r, window.setTimeout(() => {
      const s = i.get(r);
      s && (s.pause(), s.removeAttribute("src"), s.load()), i.delete(r), t.delete(r), a.delete(r);
    }, 1e4)));
  }
  let c = null;
  function u(r) {
    const s = e.normalizeCamera(r);
    return s.feedSource === "live" && s.status !== "offline" && s.status !== "restricted";
  }
  function y(r = "") {
    var m, g, F, A, x;
    const s = e.getSceneById(r), l = (s == null ? void 0 : s.id) && ((m = canvas == null ? void 0 : canvas.scene) == null ? void 0 : m.id) === s.id ? canvas.dimensions : s == null ? void 0 : s.dimensions;
    return {
      x: B((l == null ? void 0 : l.sceneX) ?? ((g = l == null ? void 0 : l.sceneRect) == null ? void 0 : g.x)) ?? 0,
      y: B((l == null ? void 0 : l.sceneY) ?? ((F = l == null ? void 0 : l.sceneRect) == null ? void 0 : F.y)) ?? 0,
      width: K(
        (l == null ? void 0 : l.sceneWidth) ?? ((A = l == null ? void 0 : l.sceneRect) == null ? void 0 : A.width) ?? (l == null ? void 0 : l.width) ?? (s == null ? void 0 : s.width),
        Ee
      ),
      height: K(
        (l == null ? void 0 : l.sceneHeight) ?? ((x = l == null ? void 0 : l.sceneRect) == null ? void 0 : x.height) ?? (l == null ? void 0 : l.height) ?? (s == null ? void 0 : s.height),
        Me
      )
    };
  }
  function f(r) {
    if (!r) return Promise.resolve(null);
    const s = t.get(r);
    if (s)
      return o(r), s;
    const d = /\.(webm|mp4|m4v|ogv|ogg)(?:[?#]|$)/i.test(r), l = new Promise((m) => {
      const g = d ? document.createElement("video") : new Image();
      let F = !1;
      const A = window.setTimeout(() => x(null), 8e3), x = (O) => {
        F || (F = !0, window.clearTimeout(A), g.onload = g.onloadeddata = g.onerror = null, O || (t.delete(r), d && (g.pause(), g.removeAttribute("src"), g.load(), i.delete(r))), m(O));
      };
      g.crossOrigin = "anonymous", g.onerror = () => x(null), d ? (g.muted = !0, g.loop = !0, g.playsInline = !0, g.preload = "auto", g.onloadeddata = () => {
        g.play().catch(() => {
        }), o(r), x(g);
      }, i.set(r, g)) : g.onload = () => x(g), g.src = r;
    });
    for (t.set(r, l); t.size > 96; ) {
      const m = t.keys().next().value;
      t.delete(m);
      const g = i.get(m);
      g && (g.pause(), g.removeAttribute("src"), g.load(), i.delete(m));
    }
    return l;
  }
  function w(r, s, d) {
    try {
      return r.toDataURL(s, d);
    } catch (l) {
      {
        console.warn(`${e.moduleId} | ${s} canvas encode failed, using PNG fallback.`, l);
        try {
          return r.toDataURL("image/png");
        } catch (m) {
          return console.warn(`${e.moduleId} | PNG canvas encode failed.`, m), "";
        }
      }
      return console.warn(`${e.moduleId} | PNG canvas encode failed.`, l), "";
    }
  }
  function S(r, s, d, l = {}) {
    return l.preferDataUrl || !r.toBlob || typeof URL > "u" || !URL.createObjectURL ? Promise.resolve(w(r, s, d)) : new Promise((m) => {
      try {
        r.toBlob((g) => {
          if (g) {
            m(URL.createObjectURL(g));
            return;
          }
          m(w(r, s, d));
        }, s, d);
      } catch (g) {
        console.warn(`${e.moduleId} | ${s} canvas blob encode failed, using data URL fallback.`, g), m(w(r, s, d));
      }
    });
  }
  async function v(r = {}, s = {}) {
    var H, pe, Fe, Se, Ie;
    const d = e.getSceneById(r.sceneId);
    if (!d) return "";
    const l = y(r.sceneId), m = Number.isFinite(r.regionX) && Number.isFinite(r.regionY) ? { x: r.regionX, y: r.regionY, width: r.regionWidth, height: r.regionHeight } : l, g = Math.min(1, nt / m.width, nt / m.height), F = Math.max(1, Math.round(m.width * g)), A = Math.max(1, Math.round(m.height * g)), x = document.createElement("canvas");
    x.width = F, x.height = A;
    const O = x.getContext("2d");
    if (!O) return "";
    O.fillStyle = String(d.backgroundColor ?? "#010505"), O.fillRect(0, 0, F, A);
    const q = e.getSceneBackgroundPath(r.sceneId) || r.image, re = await f(q);
    if (q && !re) throw new Error("Camera background could not be loaded.");
    const ne = { ...r, regionX: m.x, regionY: m.y, regionWidth: m.width, regionHeight: m.height }, ce = zt(d.tiles ?? ((H = d._source) == null ? void 0 : H.tiles));
    typeof d.foreground == "string" && d.foreground && ce.push({
      x: l.x,
      y: l.y,
      width: l.width,
      height: l.height,
      elevation: d.foregroundElevation ?? Number.MAX_SAFE_INTEGER,
      sort: -Number.MAX_SAFE_INTEGER,
      texture: { src: d.foreground }
    });
    const le = qt(ce, W(d, ne)), Le = () => O.setTransform(
      F / m.width,
      0,
      0,
      A / m.height,
      -m.x * F / m.width,
      -m.y * A / m.height
    );
    Le(), re && O.drawImage(re, l.x, l.y, l.width, l.height);
    for (const Q of le) {
      if (Q.kind === "token") {
        O.setTransform(1, 0, 0, 1, 0, 0), await z(O, ne, F, A, [Q.document]);
        continue;
      }
      const ge = J(Q.document), Be = it(Q.document);
      if (!Be || !Be.alpha || (!((pe = ge.texture) != null && pe.fit) || ge.texture.fit === "fill") && !Ye(Be.bounds, m)) continue;
      const Qe = String(((Fe = ge.texture) == null ? void 0 : Fe.src) ?? ge.img ?? "");
      if (!Qe) continue;
      const te = await f(Qe);
      if (!te) throw new Error("A camera tile could not be loaded. Check its media path and access.");
      te.tagName === "VIDEO" && (te.loop = ((Se = ge.video) == null ? void 0 : Se.loop) !== !1, ((Ie = ge.video) == null ? void 0 : Ie.autoplay) === !1 ? te.pause() : te.paused && !te.ended && te.play().catch(() => {
      }));
      const Ze = it(Q.document, te);
      Ye(Ze.bounds, m) && (Le(), Ht(O, te, Ze));
    }
    return S(x, "image/webp", Jt, s);
  }
  function R(r) {
    var d, l, m, g, F, A;
    const s = (r == null ? void 0 : r.id) && ((d = canvas == null ? void 0 : canvas.scene) == null ? void 0 : d.id) === r.id;
    return K(
      s ? ((l = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : l.size) ?? ((m = canvas == null ? void 0 : canvas.grid) == null ? void 0 : m.size) ?? ((g = r == null ? void 0 : r.grid) == null ? void 0 : g.size) : ((F = r == null ? void 0 : r.dimensions) == null ? void 0 : F.size) ?? ((A = r == null ? void 0 : r.grid) == null ? void 0 : A.size),
      100
    );
  }
  function b(r) {
    var d, l, m;
    if (!r) return [];
    const s = [
      h(r, "Token"),
      r.tokens,
      (d = r.getEmbeddedDocuments) == null ? void 0 : d.call(r, "Token"),
      (l = r.toObject) == null ? void 0 : l.call(r).tokens,
      (m = r._source) == null ? void 0 : m.tokens
    ];
    for (const g of s) {
      const F = I(g);
      if (F.length) return F;
    }
    return [];
  }
  function h(r, s) {
    var d;
    try {
      return (d = r == null ? void 0 : r.getEmbeddedCollection) == null ? void 0 : d.call(r, s);
    } catch (l) {
      return console.warn(`${e.moduleId} | Could not read ${s} collection for inactive scene.`, l), null;
    }
  }
  function I(r) {
    return r ? (Array.isArray(r == null ? void 0 : r.contents) ? r.contents : Array.isArray(r) ? r : typeof r.values == "function" ? Array.from(r.values()) : Array.from(r ?? [])).map((d) => Array.isArray(d) ? d[1] : d).map((d) => (d == null ? void 0 : d.document) ?? d).filter(Boolean) : [];
  }
  function k(r) {
    const s = J(r);
    return !(!s || s.hidden);
  }
  function T(r) {
    var d, l, m, g, F, A, x, O;
    const s = J(r);
    return String(
      ((d = r == null ? void 0 : r.getTextureSrc) == null ? void 0 : d.call(r)) ?? ((l = s == null ? void 0 : s.texture) == null ? void 0 : l.src) ?? (s == null ? void 0 : s.img) ?? ((m = r == null ? void 0 : r.texture) == null ? void 0 : m.src) ?? ((g = r == null ? void 0 : r.actor) == null ? void 0 : g.img) ?? ((F = r == null ? void 0 : r.baseActor) == null ? void 0 : F.img) ?? ((O = (x = (A = r == null ? void 0 : r.actor) == null ? void 0 : A.prototypeToken) == null ? void 0 : x.texture) == null ? void 0 : O.src) ?? ""
    ).trim();
  }
  async function z(r, s, d, l, m) {
    var O;
    if (!r) return;
    const g = e.getSceneById(s.sceneId);
    if (!g) return;
    const F = e.applyLinkedRegionBounds(e.normalizeCamera(s)), A = {
      x: F.regionX,
      y: F.regionY,
      width: F.regionWidth,
      height: F.regionHeight
    };
    if (![A.x, A.y, A.width, A.height].every(Number.isFinite)) return;
    const x = R(g);
    y(F.sceneId);
    for (const q of m ?? W(g, F)) {
      if (!k(q)) continue;
      const re = jt(q, x), ne = me(re, A);
      if (!ne) continue;
      const { sourceBounds: ce, visibleBounds: le } = ne, Le = T(q), H = await f(Le), { dx: pe, dy: Fe, dw: Se, dh: Ie } = Vt(le, A, { width: d, height: l });
      if (r.save(), r.globalAlpha = B(q.alpha) ?? B((O = J(q)) == null ? void 0 : O.alpha) ?? 1, H != null && H.naturalWidth && (H != null && H.naturalHeight)) {
        const Q = ie(H, ce, le);
        r.drawImage(H, Q.sx, Q.sy, Q.sw, Q.sh, pe, Fe, Se, Ie);
      } else
        fe(r, q, pe, Fe, Se, Ie);
      r.restore();
    }
  }
  function W(r, s) {
    var l, m;
    const d = (l = e.getRegionDocument) == null ? void 0 : l.call(e, s.regionId, s.sceneId);
    return d && ((m = canvas == null ? void 0 : canvas.scene) == null ? void 0 : m.id) === r.id && "tokens" in Object(d) ? I(d.tokens) : b(r);
  }
  function ie(r, s, d) {
    const l = r.naturalWidth / s.width, m = r.naturalHeight / s.height;
    return {
      sx: Math.max(0, (d.x - s.x) * l),
      sy: Math.max(0, (d.y - s.y) * m),
      sw: Math.min(r.naturalWidth, d.width * l),
      sh: Math.min(r.naturalHeight, d.height * m)
    };
  }
  function me(r, s, d) {
    if (!r) return null;
    const l = Ye(r, s);
    return l ? { sourceBounds: r, visibleBounds: l } : null;
  }
  function fe(r, s, d, l, m, g) {
    const F = J(s), A = Math.max(at, m), x = Math.max(at, g), O = d + (m - A) / 2, q = l + (g - x) / 2, re = Math.min(A, x) / 2, ne = O + A / 2, ce = q + x / 2;
    r.beginPath(), r.arc(ne, ce, re, 0, Math.PI * 2), r.fillStyle = "rgba(10, 18, 24, 0.82)", r.fill(), r.lineWidth = Math.max(2, Math.min(A, x) * 0.08), r.strokeStyle = "rgba(72, 220, 255, 0.95)", r.stroke();
    const le = String((F == null ? void 0 : F.name) ?? (s == null ? void 0 : s.name) ?? "").trim().slice(0, 2).toUpperCase();
    le && (r.font = `700 ${Math.max(10, Math.round(re * 0.72))}px sans-serif`, r.textAlign = "center", r.textBaseline = "middle", r.fillStyle = "rgba(224, 252, 255, 0.96)", r.fillText(le, ne, ce + 0.5));
  }
  async function P(r = {}, s = {}) {
    const d = e.applyLinkedRegionBounds(e.normalizeCamera(r));
    if (!u(d)) return "";
    const l = e.getSceneById(d.sceneId), m = { ...d, sceneId: (l == null ? void 0 : l.id) ?? d.sceneId };
    return n.get(JSON.stringify(m), () => v(m, { preferDataUrl: !0 }));
  }
  async function se(r, s = {}) {
    var m, g, F;
    if (!u(r == null ? void 0 : r.camera)) return;
    const d = r.liveFrameGeneration, l = await P(r.camera, {
      preferDataUrl: !!e.broadcastLiveFrame
    });
    if (!(d !== r.liveFrameGeneration || !he(r, s))) {
      if (!l) {
        (m = r.onFrameError) == null || m.call(r);
        return;
      }
      await ((g = r.updateLiveFrame) == null ? void 0 : g.call(r, l)), !(d !== r.liveFrameGeneration || !he(r, s)) && s.broadcast !== !1 && ((F = e.broadcastLiveFrame) == null || F.call(e, e.normalizeCamera(r.camera), l));
    }
  }
  function he(r, s = {}) {
    return !(!r || r.liveFrameStopped || document.visibilityState === "hidden" || s.requireRendered && (r == null ? void 0 : r.rendered) === !1);
  }
  function ee(r, s = {}) {
    if (!he(r, s) || r != null && r.liveFrameRefreshPending) return;
    r.liveFrameRefreshPending = !0;
    const d = r.liveFrameGeneration;
    se(r, s).catch((l) => {
      var m;
      d === r.liveFrameGeneration && ((m = r.onFrameError) == null || m.call(r, l), console.warn(`${e.moduleId} | Camera refresh failed; retrying on next tick.`, l));
    }).finally(() => {
      d === r.liveFrameGeneration && (r.liveFrameRefreshPending = !1);
    });
  }
  function be(r) {
    r && (r.liveFrameStopped = !0, r.liveFrameGeneration = (r.liveFrameGeneration ?? 0) + 1, r.liveFrameTimer && window.clearInterval(r.liveFrameTimer), r.liveFrameVisibilityHandler && document.removeEventListener("visibilitychange", r.liveFrameVisibilityHandler), r.liveFrameTimer = null, r.liveFrameVisibilityHandler = null, r.liveFrameRefreshPending = !1);
  }
  function C(r) {
    U(r), u(r == null ? void 0 : r.camera) && e.isFrameProducer() && (r.liveFrameStopped = !1, r.liveFrameVisibilityHandler = () => ee(r, {
      broadcast: !1,
      requireRendered: !0
    }), document.addEventListener("visibilitychange", r.liveFrameVisibilityHandler), ee(r, {
      broadcast: !1,
      requireRendered: !0
    }), r.liveFrameTimer = window.setInterval(() => {
      ee(r, {
        broadcast: !1,
        requireRendered: !0
      });
    }, rt));
  }
  function U(r) {
    be(r);
  }
  function E(r) {
    if (p(), !u(r) || !e.isFrameProducer()) return;
    c = {
      camera: e.normalizeCamera(r),
      liveFrameStopped: !1,
      liveFrameGeneration: 0,
      liveFrameRefreshPending: !1,
      liveFrameTimer: null,
      liveFrameVisibilityHandler: null
    };
    const s = c;
    s.liveFrameVisibilityHandler = () => ee(s), document.addEventListener("visibilitychange", c.liveFrameVisibilityHandler), ee(c), c.liveFrameTimer = window.setInterval(() => {
      ee(s);
    }, rt);
  }
  function p() {
    be(c), c = null;
  }
  return {
    captureLiveFrame: P,
    invalidateFrames: () => n.clear(),
    startBroadcastLiveRefresh: E,
    startLocalLiveRefresh: C,
    stopBroadcastLiveRefresh: p,
    stopLocalLiveRefresh: U
  };
}
const N = "security-cameras", ft = `module.${N}`, Qt = `modules/${N}/templates/monitor.hbs`, Zt = `modules/${N}/templates/feed.hbs`;
function Re() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function ve(e) {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : JSON.parse(JSON.stringify(e));
}
function ht(e) {
  var i;
  if ((i = foundry == null ? void 0 : foundry.utils) != null && i.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
const gt = Nt(N, {
  socketName: ft,
  title: "Security Cameras"
});
let G = null, M = null, L = "", Z = "", ye = "", Ce = 0, Oe = 0, $e = !1, de = null;
const ot = 1250;
function V(e = {}, t = {}) {
  return Xe(e, { ...t, createId: Re });
}
function _e(e = {}, t = {}) {
  return Dt(e, { ...t, createId: Re });
}
function ei(e) {
  var t, i;
  return e ? ((i = (t = game.scenes) == null ? void 0 : t.get(e)) == null ? void 0 : i.name) ?? "Unknown Scene" : "Unassigned Scene";
}
function yt(e = "") {
  var i;
  const t = Te(e);
  return String(((i = t == null ? void 0 : t.background) == null ? void 0 : i.src) ?? (t == null ? void 0 : t.img) ?? "").trim();
}
function ti(e = "") {
  var i;
  const t = (((i = game.scenes) == null ? void 0 : i.contents) ?? []).map((n) => ({
    id: n.id,
    name: n.name,
    selected: n.id === e
  })).sort((n, a) => n.name.localeCompare(a.name));
  return [
    { id: "", name: "Unassigned Scene", selected: !e },
    ...t
  ];
}
function Te(e = "") {
  var t;
  return e ? ((t = game.scenes) == null ? void 0 : t.get(e)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
}
function ii(e = "") {
  var n;
  const t = Te(e);
  return (((n = t == null ? void 0 : t.regions) == null ? void 0 : n.contents) ?? []).map((a) => ({
    id: a.id,
    name: a.name || `Region ${a.id}`,
    region: a
  })).sort((a, o) => a.name.localeCompare(o.name));
}
function vt(e = "", t = "") {
  return [
    { id: "", name: "No Linked Region", selected: !t },
    ...ii(e).map((i) => ({
      id: i.id,
      name: i.name,
      selected: i.id === t
    }))
  ];
}
function Je(e = "", t = "") {
  var n, a;
  if (!e) return null;
  const i = Te(t);
  return ((a = (n = i == null ? void 0 : i.regions) == null ? void 0 : n.get) == null ? void 0 : a.call(n, e)) ?? null;
}
function ri(e) {
  var c, u, y, f;
  const t = (e == null ? void 0 : e.object) ?? ((y = (u = (c = canvas == null ? void 0 : canvas.regions) == null ? void 0 : c.placeables) == null ? void 0 : u.find) == null ? void 0 : y.call(u, (w) => {
    var S;
    return ((S = w.document) == null ? void 0 : S.id) === (e == null ? void 0 : e.id);
  })), i = t == null ? void 0 : t.bounds;
  if (i != null && i.width && (i != null && i.height))
    return je(i);
  const n = e == null ? void 0 : e.bounds;
  if (n != null && n.width && (n != null && n.height))
    return je(n);
  const a = ((f = e == null ? void 0 : e.toObject) == null ? void 0 : f.call(e)) ?? e, o = Array.isArray(e == null ? void 0 : e.shapes) ? e.shapes : Array.isArray(a == null ? void 0 : a.shapes) ? a.shapes : [];
  return Pt(o);
}
function Pe(e) {
  const t = Je(e.regionId, e.sceneId), i = ri(t);
  return i ? {
    ...e,
    ...i
  } : e;
}
function Ve() {
  const e = canvas == null ? void 0 : canvas.scene;
  return V({
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
function We(e, t) {
  return e.map((i) => ({
    ...i,
    selected: i.value === t
  }));
}
function Ue(e = {}) {
  var y;
  const t = V(e), i = (/* @__PURE__ */ new Date()).toLocaleString(), n = t.status === "online" || t.status === "clean", a = t.status === "offline", o = t.status === "corrupted", c = t.status === "restricted", u = t.feedSource === "live";
  return {
    ...t,
    sceneName: ei(t.sceneId),
    regionName: ((y = Je(t.regionId, t.sceneId)) == null ? void 0 : y.name) || (t.regionId ? "Region unavailable" : "No region"),
    sceneBackground: yt(t.sceneId),
    regionAspect: t.regionWidth && t.regionHeight ? `${t.regionWidth} / ${t.regionHeight}` : "16 / 9",
    timestamp: i,
    signalLabel: n ? "SIGNAL LOCK" : o ? "SIGNAL CORRUPTED" : c ? "ACCESS DENIED" : "NO SIGNAL",
    isOnline: n,
    isOffline: a,
    isCorrupted: o,
    isRestricted: c,
    isLive: u,
    isImage: !u,
    hasRegion: Number.isFinite(t.regionX) && Number.isFinite(t.regionY),
    canDisplayImage: !!(t.image && !u && !a && !c),
    canUseImageFallback: !!(t.image && u && !a && !c),
    statusClass: `security-camera-status-${t.status}`,
    sourceClass: `security-camera-source-${t.feedSource}`,
    displayClass: `security-camera-display-${t.displayMode}`
  };
}
function ae() {
  const e = game.settings.get(N, "cameras");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function wt() {
  return Object.values(ae()).map(V).sort((e, t) => e.name.localeCompare(t.name));
}
function Y(e) {
  const t = String(e ?? "");
  if (!t) return null;
  const i = ae()[t];
  return i ? V(i) : null;
}
async function xe(e) {
  var i;
  const t = ve(ae());
  await game.settings.set(N, "cameras", e), D.invalidateFrames();
  for (const n of Object.keys(t))
    JSON.stringify(t[n]) !== JSON.stringify(e[n]) && (we({
      action: "cameraChanged",
      gmUserId: game.user.id,
      cameraId: n,
      camera: e[n] ? V(e[n]) : null
    }), ((i = M == null ? void 0 : M.camera) == null ? void 0 : i.id) === n && (e[n] ? await Ae(e[n]) : await De()), ye === n && (Ce++, D.stopBroadcastLiveRefresh(), e[n] ? D.startBroadcastLiveRefresh(e[n]) : ye = ""));
  await vi();
}
function oe(e = "manage security cameras") {
  var t, i, n;
  return (t = game.user) != null && t.isGM ? !0 : ((n = (i = ui.notifications) == null ? void 0 : i.warn) == null || n.call(i, `Only the GM can ${e}.`), !1);
}
function we(e) {
  return gt.emit(e);
}
async function ni(e = {}) {
  var a, o;
  if (!oe("register security cameras")) return null;
  const t = _e(e);
  if (!t.ok)
    return (o = (a = ui.notifications) == null ? void 0 : a.error) == null || o.call(a, t.errors.join(" ")), null;
  const i = Pe(t.camera), n = ve(ae());
  return n[i.id] = i, L = i.id, Z = i.id, await xe(n), i;
}
async function bt(e) {
  var c, u;
  if (!oe("delete security cameras")) return !1;
  const t = String(e ?? L ?? "");
  if (!t || !Y(t))
    return (u = (c = ui.notifications) == null ? void 0 : c.warn) == null || u.call(c, "Select a camera to delete."), !1;
  const i = Y(t);
  if (!(typeof Dialog < "u" ? await Dialog.confirm({
    title: "Delete Security Camera",
    content: `<p>Delete camera <strong>${ht(i.name)}</strong>?</p>`,
    yes: () => !0,
    no: () => !1,
    defaultYes: !1
  }) : window.confirm(`Delete camera "${i.name}"?`))) return !1;
  const a = ve(ae());
  return delete a[t], L = Object.keys(a)[0] ?? "", Z = L, await xe(a), !0;
}
async function pt(e) {
  var a, o;
  if (!oe("duplicate security cameras")) return null;
  const t = Y(e || L);
  if (!t)
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Select a camera to duplicate."), null;
  const i = V({
    ...t,
    id: Re(),
    name: `${t.name} Copy`
  }), n = ve(ae());
  return n[i.id] = i, L = i.id, Z = i.id, await xe(n), i;
}
async function Ft() {
  var i, n;
  if (!oe("create security cameras")) return null;
  const e = V({
    ...Ve(),
    id: Re(),
    name: "New Camera",
    location: "Unlabeled Location"
  }), t = ve(ae());
  return t[e.id] = Pe(e), L = e.id, Z = e.id, await xe(t), (n = (i = ui.notifications) == null ? void 0 : i.info) == null || n.call(i, "New security camera created."), e;
}
function St(e) {
  const t = new FormData(e), i = String(t.get("originalId") ?? "").trim(), n = String(t.get("id") ?? "").trim() || i || Re();
  return {
    originalId: i,
    camera: V({
      id: n,
      name: t.get("name"),
      sceneId: e.elements.sceneId.value,
      location: t.get("location"),
      image: t.get("image"),
      feedSource: t.get("feedSource"),
      status: t.get("status"),
      displayMode: t.get("displayMode"),
      regionId: e.elements.regionId.value,
      regionX: t.get("regionX"),
      regionY: t.get("regionY"),
      regionWidth: t.get("regionWidth"),
      regionHeight: t.get("regionHeight"),
      notes: t.get("notes")
    })
  };
}
async function st(e) {
  var c, u, y, f, w, S;
  if (!oe("save security cameras") || !(e != null && e.reportValidity())) return null;
  const { originalId: t, camera: i } = St(e), n = _e(i);
  if (!n.ok)
    return (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(c, n.errors.join(" ")), null;
  const a = Pe(n.camera), o = ve(ae());
  return t !== a.id && Object.hasOwn(o, a.id) ? ((f = (y = ui.notifications) == null ? void 0 : y.warn) == null || f.call(y, "That camera ID is already in use. Choose a unique ID."), null) : (t && t !== a.id && delete o[t], $e = !1, de = null, o[a.id] = a, L = a.id, Z = a.id, await xe(o), (S = (w = ui.notifications) == null ? void 0 : w.info) == null || S.call(w, "Security camera saved."), a);
}
function ai(e = L) {
  var i, n, a, o, c, u, y, f;
  const t = Y(e);
  if (!Number.isFinite(t == null ? void 0 : t.regionX) || !Number.isFinite(t == null ? void 0 : t.regionY)) {
    (n = (i = ui.notifications) == null ? void 0 : i.warn) == null || n.call(i, "This camera does not have a region yet.");
    return;
  }
  if (t.sceneId && ((a = canvas.scene) == null ? void 0 : a.id) !== t.sceneId) {
    (c = (o = ui.notifications) == null ? void 0 : o.warn) == null || c.call(o, "Activate the camera's scene before panning to its region.");
    return;
  }
  (f = canvas.animatePan) == null || f.call(canvas, {
    x: t.regionX + t.regionWidth / 2,
    y: t.regionY + t.regionHeight / 2,
    scale: ((y = (u = canvas.stage) == null ? void 0 : u.scale) == null ? void 0 : y.x) ?? 1,
    duration: 500
  });
}
function Ge(e, t = null) {
  var i;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (i = e.element) != null && i[0] ? e.element[0] : e.element ?? null;
}
function oi() {
  const e = wt();
  !L && e.length && (L = e[0].id), Z === null && (Z = L);
  const t = Y(L), i = de ?? (Z === "" ? Ve() : Y(Z) ?? Ve()), n = Ue(i);
  return {
    cameras: e.map((a) => ({
      ...Ue(a),
      isSelected: a.id === L
    })),
    selectedCamera: t ? Ue(t) : null,
    editorCamera: n,
    originalEditorId: (de == null ? void 0 : de.originalId) ?? i.id,
    sceneChoices: ti(i.sceneId),
    regionChoices: vt(i.sceneId, i.regionId),
    feedSourceChoices: We(_t, i.feedSource),
    statusChoices: We(Ot, i.status),
    displayModeChoices: We(Ut, i.displayMode),
    showStaticImageField: i.feedSource === "image",
    hasCameras: e.length > 0,
    isNewCamera: !i.id,
    editorDirty: $e
  };
}
function si(e) {
  var n, a, o;
  if (typeof FilePicker > "u") {
    (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "The file browser is unavailable.");
    return;
  }
  const t = (o = e == null ? void 0 : e.elements) == null ? void 0 : o.image;
  new FilePicker({
    type: "image",
    current: (t == null ? void 0 : t.value) ?? "",
    callback: (c) => {
      t && (t.value = c, t.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
  }).browse();
}
function ze() {
  return $e ? window.confirm("Discard unsaved camera changes?") ? ($e = !1, de = null, !0) : !1 : !0;
}
function It(e) {
  D.stopLocalLiveRefresh(e);
}
function ci(e, t = null) {
  var u, y, f, w, S, v, R;
  const i = Ge(e, t);
  if (!i) return;
  const n = i.querySelector("[data-security-camera-form]");
  It(e), e.camera = Y(L), e.lastFrameAt = null, e.frameError = !1;
  const a = i.querySelector(".security-camera-preview-frame");
  if (((u = e.camera) == null ? void 0 : u.feedSource) === "live" && !["offline", "restricted"].includes(e.camera.status) && a) {
    a.replaceChildren();
    const b = document.createElement("img");
    b.alt = e.camera.name, b.hidden = !0, a.append(b);
    const h = document.createElement("div");
    h.className = "security-camera-placeholder", h.textContent = "Waiting for first frame", a.append(h), e.updateLiveFrame = async (I) => {
      b.src = I, b.hidden = !1, h.hidden = !0, e.lastFrameAt = Date.now(), e.frameError = !1;
    }, D.startLocalLiveRefresh(e);
  }
  const o = () => {
    $e = !0;
    const b = St(n);
    de = { ...b.camera, originalId: b.originalId };
    const h = i.querySelector("[data-camera-dirty]");
    h && (h.hidden = !1);
  };
  n == null || n.addEventListener("input", o), n == null || n.addEventListener("change", o), (f = (y = n == null ? void 0 : n.elements) == null ? void 0 : y.sceneId) == null || f.addEventListener("change", () => {
    n.elements.regionId.replaceChildren(...vt(n.elements.sceneId.value).map((h) => new Option(h.name, h.id)));
    for (const h of ["regionX", "regionY"]) n.elements[h].value = "";
    n.elements.regionWidth.value = Ee, n.elements.regionHeight.value = Me, o();
  }), (S = (w = n == null ? void 0 : n.elements) == null ? void 0 : w.regionId) == null || S.addEventListener("change", () => {
    if (!n.elements.regionId.value)
      for (const b of ["regionX", "regionY"]) n.elements[b].value = "";
    o();
  }), n == null || n.addEventListener("submit", async (b) => {
    b.preventDefault(), await st(n);
  });
  const c = () => {
    const b = n.elements.feedSource.value === "live";
    n.elements.sceneId.disabled = !b, n.elements.regionId.disabled = !b;
    const h = n.querySelector("[data-security-camera-static-image-field]");
    h && (h.hidden = n.elements.feedSource.value !== "image");
  };
  c(), (R = (v = n == null ? void 0 : n.elements) == null ? void 0 : v.feedSource) == null || R.addEventListener("change", c), i.querySelectorAll("[data-security-camera-id]").forEach((b) => {
    b.addEventListener("click", async (h) => {
      ze() && (L = h.currentTarget.dataset.securityCameraId, Z = L, await e.render(!0));
    });
  }), i.querySelectorAll("[data-security-camera-action]").forEach((b) => {
    b.addEventListener("click", async (h) => {
      const I = h.currentTarget.dataset.securityCameraAction;
      if (!(["new", "duplicate", "delete"].includes(I) && !ze())) {
        if (I === "new") {
          await Ft();
          return;
        }
        if (I === "duplicate") {
          await pt(L);
          return;
        }
        if (I === "delete") {
          await bt(L);
          return;
        }
        if (I === "browse-image") {
          si(n);
          return;
        }
        if (I === "pan-region") {
          ai(L);
          return;
        }
        if (I === "show" || I === "save-show") {
          if (I === "save-show") {
            const k = await st(n);
            if (!k) return;
            await qe(k.id);
            return;
          }
          await qe(L);
          return;
        }
        if (I === "close-feed") {
          At();
          return;
        }
      }
    });
  });
}
function Ct(e) {
  var a, o;
  const t = (e == null ? void 0 : e.camera) ?? {}, i = Ne(t.displayMode, He, j.displayMode), n = Ge(e);
  if (n == null || n.classList.toggle("security-camera-feed-display-window", i === "window"), n == null || n.classList.toggle("security-camera-feed-display-pip", i === "picture-in-picture"), i === "picture-in-picture") {
    const c = Number(t.regionWidth) && Number(t.regionHeight) ? Number(t.regionWidth) / Number(t.regionHeight) : 1.7777777777777777, u = Math.min(620, Math.max(360, window.innerWidth * 0.42)), y = Math.min(460, Math.max(260, window.innerHeight * 0.38));
    let f = u, w = f / c;
    w > y && (w = y, f = w * c);
    const S = Math.round(w + 190);
    f += 48, (a = e.setPosition) == null || a.call(e, {
      left: Math.max(12, window.innerWidth - f - 24),
      top: Math.max(12, window.innerHeight - S - 84),
      width: Math.round(f),
      height: S
    });
    return;
  }
  (o = e.setPosition) == null || o.call(e, {
    width: 720,
    height: 520
  });
}
function li(e, t = null) {
  var o, c;
  const i = Ge(e, t);
  if (!i) return;
  Ct(e), D.startLocalLiveRefresh(e), yi(e), e.liveFrame && !e.lastFrameAt && (e.lastFrameAt = Date.now());
  const n = i.querySelector("[data-security-camera-drag]");
  (o = e.feedDragController) == null || o.abort(), n == null || n.addEventListener("pointerdown", (u) => {
    var v, R;
    if (u.button !== 0) return;
    u.preventDefault(), u.stopPropagation(), (v = e.bringToFront) == null || v.call(e);
    const y = i.getBoundingClientRect();
    (R = e.feedDragController) == null || R.abort();
    const f = e.feedDragController = new AbortController(), w = { pointerId: u.pointerId, x: u.clientX, y: u.clientY, left: y.left, top: y.top };
    document.addEventListener("pointermove", (b) => {
      b.pointerId === w.pointerId && a(w.left + b.clientX - w.x, w.top + b.clientY - w.y);
    }, { signal: f.signal });
    const S = (b) => {
      b.pointerId === w.pointerId && f.abort();
    };
    document.addEventListener("pointerup", S, { signal: f.signal }), document.addEventListener("pointercancel", S, { signal: f.signal });
  });
  const a = (u, y) => {
    var f;
    return (f = e.setPosition) == null ? void 0 : f.call(e, {
      left: Math.max(0, Math.min(window.innerWidth - 80, u)),
      top: Math.max(0, Math.min(window.innerHeight - 40, y))
    });
  };
  n == null || n.addEventListener("keydown", (u) => {
    const y = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[u.key];
    if (!y) return;
    u.preventDefault(), u.stopPropagation();
    const f = i.getBoundingClientRect(), w = u.shiftKey ? 40 : 10;
    a(f.left + y[0] * w, f.top + y[1] * w);
  }), (c = i.querySelector("[data-security-camera-close]")) == null || c.addEventListener("click", () => e.close());
}
const D = Kt({
  applyLinkedRegionBounds: Pe,
  broadcastLiveFrame: (e, t) => {
    var i;
    !((i = game.user) != null && i.isGM) || !(e != null && e.id) || !t || we({
      action: "updateFeedFrame",
      gmUserId: game.user.id,
      cameraId: e.id,
      revision: ue(V(e)),
      liveFrame: t
    });
  },
  getRegionDocument: Je,
  getSceneBackgroundPath: yt,
  getSceneById: Te,
  isFrameProducer: () => {
    var e;
    return !!((e = game.user) != null && e.isGM);
  },
  moduleId: N,
  normalizeCamera: V
}), { SecurityMonitor: di, CameraFeed: mi } = Wt({
  moduleId: N,
  monitorTemplatePath: Qt,
  feedTemplatePath: Zt,
  escapeHTML: ht,
  getMonitorContext: oi,
  prepareCamera: Ue,
  bindMonitorControls: ci,
  bindFeedControls: li,
  getElement: Ge,
  liveFrameController: D,
  allowDiscardCameraChanges: ze,
  clearActiveMonitor: (e) => {
    It(e), G === e && (G = null);
  },
  clearActiveFeed: (e) => {
    var t;
    (t = e.feedDragController) == null || t.abort(), Ke(e), M === e && (M = null);
  }
});
async function $t() {
  var e;
  return oe("open the Security Camera Manager") ? G ? ((e = G.bringToFront) == null || e.call(G), G) : (G = new di(), await G.render(!0), G) : null;
}
async function fi() {
  if (!G) return;
  await G.close();
}
async function Ae(e, t = {}) {
  const i = V(e), n = M, a = ++Oe;
  if (M = null, n && await n.close(), a !== Oe) return null;
  const o = new mi(i, { liveFrame: t.liveFrame ?? "" });
  return M = o, await o.render(!0), a !== Oe ? (await o.close({}), null) : (Ct(o), o);
}
async function De() {
  if (Oe++, !M) return;
  const e = M;
  M = null, Ke(e), await e.close();
}
async function qe(e) {
  var a, o;
  if (!oe("broadcast camera feeds")) return null;
  const t = Y(e);
  if (!t)
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Security camera not found."), null;
  const i = ++Ce;
  D.stopBroadcastLiveRefresh(), ye = t.id;
  let n = "";
  try {
    n = await D.captureLiveFrame(t, { preferDataUrl: !0 });
  } catch (c) {
    console.warn(`${N} | Initial frame unavailable.`, c);
  }
  return i !== Ce || ue(Y(t.id)) !== ue(t) ? null : (we({
    action: "showFeed",
    gmUserId: game.user.id,
    camera: t,
    liveFrame: n
  }), D.startBroadcastLiveRefresh(t), Ae(t, { liveFrame: n }));
}
async function hi(e, t = {}) {
  var a, o, c, u, y, f;
  const i = Y(e);
  if (!i)
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Security camera not found."), null;
  if (!ke((c = game.user) == null ? void 0 : c.id, e))
    return (y = (u = ui.notifications) == null ? void 0 : u.warn) == null || y.call(u, "You do not have access to this camera feed."), null;
  let n = String(t.liveFrame ?? "");
  if ((f = game.user) != null && f.isGM && !n)
    try {
      n = await D.captureLiveFrame(i, { preferDataUrl: !0 });
    } catch (w) {
      console.warn(`${N} | Initial frame unavailable.`, w);
    }
  return Ae(i, { liveFrame: n });
}
function ct(e) {
  var t;
  we({
    action: "requestLiveFrame",
    userId: (t = game.user) == null ? void 0 : t.id,
    cameraId: e
  });
}
function gi(e) {
  var t;
  return !((t = game.user) != null && t.isGM) && (e == null ? void 0 : e.feedSource) === "live" && e.status !== "offline" && e.status !== "restricted";
}
function yi(e) {
  Ke(e), gi(e == null ? void 0 : e.camera) && (ct(e.camera.id), e.remoteLiveFrameTimer = window.setInterval(() => {
    document.visibilityState !== "hidden" && (!e.lastFrameAt || Date.now() - e.lastFrameAt > ot) && ct(e.camera.id);
  }, ot));
}
function Ke(e) {
  e != null && e.remoteLiveFrameTimer && (window.clearInterval(e.remoteLiveFrameTimer), e.remoteLiveFrameTimer = null);
}
function ke(e, t) {
  var n, a;
  const i = Y(t);
  return xt((a = (n = game.users) == null ? void 0 : n.get) == null ? void 0 : a.call(n, e), i);
}
function At() {
  oe("close player camera feeds") && (we({
    action: "closeFeed",
    gmUserId: game.user.id
  }), Ce++, ye = "", D.stopBroadcastLiveRefresh(), De());
}
async function vi() {
  G && await G.render(!0);
}
async function wi(e) {
  var i, n, a, o, c, u, y, f, w, S, v, R, b;
  if (!e || typeof e != "object") return;
  const t = gt.isGMSender(e.gmUserId);
  if (e.action === "requestLiveFrame") {
    if (!((i = game.user) != null && i.isGM)) return;
    const h = (((n = game.users) == null ? void 0 : n.contents) ?? []).filter((W) => W.isGM && W.active).sort((W, ie) => W.id.localeCompare(ie.id))[0];
    if (h && h.id !== game.user.id) return;
    const I = String(e.cameraId ?? ""), k = String(e.userId ?? ""), T = Y(I);
    if (!T || !((c = (o = (a = game.users) == null ? void 0 : a.get) == null ? void 0 : o.call(a, k)) != null && c.active) || T.feedSource !== "live" || !ke(k, I)) return;
    const z = await D.captureLiveFrame(T, {
      preferDataUrl: !0
    });
    if (!z || !ke(k, I) || ue(Y(I)) !== ue(T)) return;
    we({
      action: "updateFeedFrame",
      gmUserId: game.user.id,
      cameraId: I,
      recipientUserId: k,
      revision: ue(T),
      liveFrame: z
    });
    return;
  }
  if (e.action === "cameraChanged") {
    if (!t || (u = game.user) != null && u.isGM && e.gmUserId === game.user.id) return;
    const h = e.camera ? _e(e.camera, { requireId: !0 }) : null;
    if (e.camera && (!(h != null && h.ok) || h.camera.id !== e.cameraId)) return;
    D.invalidateFrames(), ye === e.cameraId && (Ce++, D.stopBroadcastLiveRefresh(), h ? D.startBroadcastLiveRefresh(h.camera) : ye = ""), ((y = M == null ? void 0 : M.camera) == null ? void 0 : y.id) === e.cameraId && (h ? await Ae(h.camera) : await De());
    return;
  }
  if (e.action === "showFeed") {
    if ((f = game.user) != null && f.isGM) return;
    if (!t) {
      console.warn(`${N} | Ignoring camera feed socket message without a GM sender.`);
      return;
    }
    const h = _e(e.camera);
    if (!h.ok) {
      console.warn(`${N} | Ignoring invalid socket camera payload.`, h.errors);
      return;
    }
    await Ae(h.camera, {
      liveFrame: typeof e.liveFrame == "string" ? e.liveFrame : ""
    });
    return;
  }
  if (e.action === "updateFeedFrame") {
    if ((w = game.user) != null && w.isGM || !t) return;
    const h = String(e.recipientUserId ?? "");
    if (h && h !== ((S = game.user) == null ? void 0 : S.id)) return;
    const I = String(e.cameraId ?? "");
    if (!I || ((v = M == null ? void 0 : M.camera) == null ? void 0 : v.id) !== I || e.revision !== ue(V(M.camera)) || ["offline", "restricted"].includes(M.camera.status) || typeof e.liveFrame != "string" || !e.liveFrame) return;
    await ((R = M.updateLiveFrame) == null ? void 0 : R.call(M, e.liveFrame));
    return;
  }
  if (e.action === "closeFeed") {
    if ((b = game.user) != null && b.isGM || !t) return;
    await De();
  }
}
function Et(e) {
  const t = Number(e), i = Number.isFinite(t) ? Math.max(0, Math.min(200, t)) / 100 : 0.5;
  document.documentElement.style.setProperty("--security-camera-effect-intensity", String(i)), document.documentElement.classList.toggle("security-camera-effects-disabled", i === 0);
}
function bi() {
  game.settings.register(N, "videoEffectIntensity", {
    name: "Video Effect Intensity",
    hint: "Adjust static, scanlines, tint, flicker, and glitches for all viewers. Default: 50%. Use 0% to turn effects off or 100% for the original strength. Clean cameras have no effects.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 0, max: 200, step: 10 },
    default: 50,
    onChange: Et
  }), game.settings.register(N, "cameras", {
    name: "Security Cameras",
    hint: "World-level camera feed definitions for the Security Cameras module.",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  });
}
function pi() {
  const e = {
    openMonitor: $t,
    closeMonitor: fi,
    showFeed: qe,
    registerCamera: ni,
    createNewCamera: Ft,
    deleteCamera: bt,
    duplicateCamera: pt,
    getCameras: wt,
    getCamera: Y,
    openCameraFeed: hi,
    hasCameraAccess: ke,
    closeFeed: At,
    get activeMonitor() {
      return G;
    },
    get activeFeed() {
      return M;
    }
  };
  game.securityCameras = e;
  const t = game.modules.get(N);
  t && (t.api = e);
}
function Fi() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: N,
    title: "Security Cameras",
    icon: "fa-solid fa-video",
    premium: !1,
    featureId: N,
    playerVisible: !1,
    description: "Manage camera feeds and broadcast surveillance views.",
    open: () => $t()
  }), !0) : !1;
}
Hooks.once("init", () => {
  bi();
});
Hooks.once("ready", () => {
  var e, t;
  Et(game.settings.get(N, "videoEffectIntensity")), pi(), Fi(), (t = (e = game.socket) == null ? void 0 : e.on) == null || t.call(e, ft, (i) => {
    wi(i).catch((n) => console.warn(`${N} | Camera message failed.`, n));
  }), console.log(`${N} | Ready. Use game.securityCameras.openMonitor()`);
});
