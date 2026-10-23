var Dt = Object.defineProperty;
var Lt = (e, t, i) => t in e ? Dt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var z = (e, t, i) => Lt(e, typeof t != "symbol" ? t + "" : t, i);
function ut(e, t) {
  return !e || !t ? !1 : !!(e.isGM || t.status !== "offline" && t.status !== "restricted");
}
function Fe(e) {
  return JSON.stringify(e);
}
function Nt(e, t = e) {
  const i = `${t} |`;
  return {
    log: (r, ...n) => console.log(i, r, ...n),
    warn: (r, ...n) => console.warn(i, r, ...n),
    error: (r, ...n) => console.error(i, r, ...n)
  };
}
function Ot(e, t = {}) {
  const i = t.socketName ?? `module.${e}`, r = Nt(e, t.title ?? e);
  return {
    socketName: i,
    emit(n) {
      var o;
      const s = (o = globalThis.game) == null ? void 0 : o.socket;
      return s != null && s.emit ? (s.emit(i, n), !0) : (r.warn("Foundry socket is unavailable.", n), !1);
    },
    isGMSender(n) {
      var s, o, l;
      return n ? !!((l = (o = (s = globalThis.game) == null ? void 0 : s.users) == null ? void 0 : o.get(String(n))) != null && l.isGM) : !1;
    }
  };
}
const dt = /* @__PURE__ */ new Set(["online", "clean", "offline", "corrupted", "restricted"]), mt = /* @__PURE__ */ new Set(["live", "image"]), Qe = /* @__PURE__ */ new Set(["window", "picture-in-picture"]), xe = 1200, Ee = 675, Ut = [
  { value: "online", label: "Online" },
  { value: "clean", label: "Clean" },
  { value: "offline", label: "Offline" },
  { value: "corrupted", label: "Corrupted" },
  { value: "restricted", label: "Restricted" }
], Tt = [
  { value: "window", label: "Window" },
  { value: "picture-in-picture", label: "Picture-in-Picture" }
], _t = [
  { value: "live", label: "Live Canvas" },
  { value: "image", label: "Static Image" }
], q = {
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
  regionWidth: xe,
  regionHeight: Ee,
  notes: ""
};
function Ne(e, t, i) {
  const r = String(e ?? "").trim();
  return t.has(r) ? r : i;
}
function X(e) {
  if (e == null || e === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
function J(e, t) {
  const i = Number(e);
  return Number.isFinite(i) && i > 0 ? i : t;
}
function ft(e) {
  return e && typeof e == "object" ? e : {};
}
function Xe(e = {}, t = {}) {
  var c;
  const i = ft(e), r = t.preserveId === !0, n = String(i.id ?? "").trim(), s = r ? n : n || ((c = t.createId) == null ? void 0 : c.call(t)) || "", o = Ne(i.feedSource, mt, q.feedSource), l = Ne(i.status, dt, q.status), y = Ne(i.displayMode, Qe, q.displayMode);
  return {
    ...q,
    id: s,
    name: String(i.name ?? q.name).trim() || q.name,
    sceneId: String(i.sceneId ?? "").trim(),
    location: String(i.location ?? q.location).trim() || q.location,
    image: String(i.image ?? "").trim(),
    feedSource: o,
    status: l,
    displayMode: y,
    regionId: String(i.regionId ?? "").trim(),
    regionX: X(i.regionX),
    regionY: X(i.regionY),
    regionWidth: J(i.regionWidth, xe),
    regionHeight: J(i.regionHeight, Ee),
    notes: String(i.notes ?? "").trim()
  };
}
function Pt(e = {}, t = {}) {
  const i = ft(e), r = Xe(i, {
    preserveId: t.requireId === !0,
    createId: t.createId
  }), n = [], s = String(i.feedSource ?? q.feedSource).trim(), o = String(i.status ?? q.status).trim(), l = String(i.displayMode ?? q.displayMode).trim();
  return t.requireId && !r.id && n.push("Camera id is required."), typeof i.name == "string" && !i.name.trim() && n.push("Camera name is required."), mt.has(s) || n.push(`Invalid feed source: ${s}`), dt.has(o) || n.push(`Invalid status: ${o}`), Qe.has(l) || n.push(`Invalid display mode: ${l}`), {
    ok: n.length === 0,
    camera: Xe(r, { createId: t.createId }),
    errors: n
  };
}
function gt(e) {
  return e && typeof e == "object" ? e : {};
}
function Bt(e = {}) {
  const t = gt(e), i = Array.isArray(t.points) ? t.points : [];
  if (i.length >= 4) {
    const c = [], m = [];
    for (let p = 0; p < i.length; p += 2)
      c.push(Number(i[p])), m.push(Number(i[p + 1]));
    const h = Math.min(...c), g = Math.min(...m), v = Math.max(...c), w = Math.max(...m);
    if ([h, g, v, w].every(Number.isFinite))
      return {
        x: h,
        y: g,
        width: v - h,
        height: w - g
      };
  }
  const r = X(t.x) ?? 0, n = X(t.y) ?? 0, s = X(t.radiusX ?? t.radius), o = X(t.radiusY ?? t.radius);
  if (s && o)
    return {
      x: r - s,
      y: n - o,
      width: s * 2,
      height: o * 2
    };
  const l = J(t.width, 0), y = J(t.height, 0);
  return !l || !y ? null : { x: r, y: n, width: l, height: y };
}
function Vt(e) {
  const t = e.filter((o) => !!o);
  if (!t.length) return null;
  const i = Math.min(...t.map((o) => o.x)), r = Math.min(...t.map((o) => o.y)), n = Math.max(...t.map((o) => o.x + o.width)), s = Math.max(...t.map((o) => o.y + o.height));
  return {
    x: i,
    y: r,
    width: n - i,
    height: s - r
  };
}
function je(e) {
  const t = gt(e), i = J(t.width, xe), r = J(t.height, Ee);
  return !i || !r ? null : {
    regionX: X(t.x) ?? 0,
    regionY: X(t.y) ?? 0,
    regionWidth: i,
    regionHeight: r
  };
}
function Wt(e) {
  const t = Vt(e.map(Bt));
  return t ? je(t) : null;
}
function at(e, t) {
  const i = e.cameras.map((g) => `
    <button type="button" class="security-camera-list-item ${t(g.statusClass)} ${g.isSelected ? "active" : ""}" aria-pressed="${!!g.isSelected}" data-security-camera-id="${t(g.id)}">
      <i class="fa-solid fa-video security-camera-device-icon" aria-hidden="true"></i>
      <span class="security-camera-device-name" title="${t(g.name)}">${t(g.name)}</span>
      <small title="${t(g.location)}">${t(g.location)}</small>
      <span class="security-camera-device-status">${t(g.status)}</span>
    </button>
  `).join(""), r = e.selectedCamera, n = r ? `
    <section class="security-camera-monitor-preview ${t(r.statusClass)}">
      <header>
        <div>
          <span class="security-camera-kicker">Selected Feed</span>
          <h3>${t(r.name)}</h3>
        </div>
        <strong>${t(r.status.toUpperCase())}</strong>
      </header>
      <div class="security-camera-monitor-display">
      <div class="security-camera-preview-frame">
        ${r.canDisplayImage ? `<img src="${t(r.image)}" alt="${t(r.name)}">` : `<div class="security-camera-placeholder">${t(r.signalLabel)}</div>`}
      </div>
      <div class="security-camera-monitor-readout"><span>${t(r.id)}</span><span>${t(r.feedSource)}</span></div>
      </div>
      <dl>
        <dt>Location</dt><dd>${t(r.location)}</dd>
        <dt>Scene</dt><dd>${t(r.sceneName)}</dd>
        <dt>Source</dt><dd>${t(r.feedSource)}</dd>
        <dt>Region</dt><dd>${t(r.regionName)}</dd>
        <dt>Mode</dt><dd>${t(r.displayMode)}</dd>
        <dt>Notes</dt><dd>${t(r.notes || "No notes.")}</dd>
      </dl>
      <div class="security-camera-preview-actions">
        <button type="button" data-security-camera-action="show"><i class="fa-solid fa-tower-broadcast" aria-hidden="true"></i> Show Saved Feed</button>
        <button type="button" data-security-camera-action="close-feed"><i class="fa-solid fa-stop" aria-hidden="true"></i> Close Feeds</button>
      </div>
    </section>
  ` : '<section class="security-camera-monitor-preview"><div class="security-camera-empty">No camera selected.</div></section>', s = e.editorCamera, o = e.sceneChoices.map((g) => `<option value="${t(g.id)}" ${g.selected ? "selected" : ""}>${t(g.name)}</option>`).join(""), l = e.regionChoices.map((g) => `<option value="${t(g.id)}" ${g.selected ? "selected" : ""}>${t(g.name)}</option>`).join(""), y = e.feedSourceChoices.map((g) => `<option value="${t(g.value)}" ${g.selected ? "selected" : ""}>${t(g.label)}</option>`).join(""), c = e.statusChoices.map((g) => `<option value="${t(g.value)}" ${g.selected ? "selected" : ""}>${t(g.label)}</option>`).join(""), m = e.displayModeChoices.map((g) => `<option value="${t(g.value)}" ${g.selected ? "selected" : ""}>${t(g.label)}</option>`).join(""), h = `<label data-security-camera-static-image-field ${e.showStaticImageField ? "" : "hidden"}>Static Image <span class="security-camera-path-row"><input type="text" name="image" value="${t(s.image)}"><button type="button" data-security-camera-action="browse-image"><i class="fa-solid fa-folder-open" aria-hidden="true"></i> Browse</button></span></label>`;
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
      ${n}
      <form class="security-camera-editor" data-security-camera-form>
        <header><span class="security-camera-kicker"><i class="fa-solid fa-sliders" aria-hidden="true"></i> Configuration</span><h2>${e.isNewCamera ? "Add Camera" : "Edit Camera"}</h2></header>
        <div class="security-camera-editor-scroll">
        <fieldset class="security-camera-field-group"><legend>Camera identity</legend>
        <p class="security-camera-dirty" data-camera-dirty ${e.editorDirty ? "" : "hidden"}>Unsaved changes</p>
        <input type="hidden" name="originalId" value="${t(e.originalEditorId)}">
        <label>ID <input type="text" name="id" value="${t(s.id)}" placeholder="auto-generated"></label>
        <label>Name <input type="text" name="name" value="${t(s.name)}" required></label>
        <label>Location <input type="text" name="location" value="${t(s.location)}"></label>
        </fieldset>
        <fieldset class="security-camera-field-group"><legend>Scene connection</legend>
        <label>Scene <select name="sceneId" ${s.isLive ? "" : "disabled"}>${o}</select></label>
        <label>Scene Region <select name="regionId" ${s.isLive ? "" : "disabled"}>${l}</select></label>
        </fieldset>
        <fieldset class="security-camera-field-group"><legend>Feed settings</legend>
        <label>Feed Source <select name="feedSource">${y}</select></label>
        ${h}
        <label>Status <select name="status">${c}</select></label>
        <label>Display Mode <select name="displayMode">${m}</select></label>
        <input type="hidden" name="regionX" value="${t(s.regionX ?? "")}">
        <input type="hidden" name="regionY" value="${t(s.regionY ?? "")}">
        <input type="hidden" name="regionWidth" value="${t(s.regionWidth ?? "")}">
        <input type="hidden" name="regionHeight" value="${t(s.regionHeight ?? "")}">
        <label>Notes <textarea name="notes" rows="3">${t(s.notes)}</textarea></label>
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
function st(e, t) {
  const r = e.isLive && !e.isOffline && !e.isRestricted ? `<img src="${t(e.liveFrame || e.image || "")}" alt="${t(e.name)}" data-security-camera-live-frame ${e.liveFrame || e.image ? "" : "hidden"}><div class="security-camera-feed-warning" data-security-camera-live-waiting ${e.liveFrame || e.image ? "hidden" : ""}>AWAITING LIVE SIGNAL</div>` : e.canDisplayImage ? `<img src="${t(e.image)}" alt="${t(e.name)}">` : `<div class="security-camera-feed-warning">${t(e.signalLabel)}</div>`;
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
        ${r}
      </main>
      <footer class="security-camera-feed-footer">
        <span>ID ${t(e.id)}</span>
        <button type="button" class="security-camera-feed-close" data-security-camera-close aria-label="Close camera feed" title="Close camera feed"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      </footer>
    </section>
  `;
}
function Yt() {
  var t, i, r;
  const e = Number(((i = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : i.generation) ?? ((r = game == null ? void 0 : game.release) == null ? void 0 : r.generation));
  return Number.isFinite(e) ? e : null;
}
function zt() {
  const e = Yt();
  return e === null || e >= 13;
}
function Xt() {
  var i, r, n, s, o, l;
  const e = ((r = (i = globalThis.foundry) == null ? void 0 : i.appv1) == null ? void 0 : r.api) ?? ((n = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : n.api) ?? null, t = ((o = (s = globalThis.foundry) == null ? void 0 : s.applications) == null ? void 0 : o.api) ?? ((l = foundry == null ? void 0 : foundry.applications) == null ? void 0 : l.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function jt(e) {
  var D, Z, le, De;
  const {
    moduleId: t,
    monitorTemplatePath: i,
    feedTemplatePath: r,
    escapeHTML: n,
    getMonitorContext: s,
    prepareCamera: o,
    bindMonitorControls: l,
    bindFeedControls: y,
    getElement: c,
    liveFrameController: m,
    allowDiscardCameraChanges: h,
    clearActiveMonitor: g,
    clearActiveFeed: v
  } = e, w = (Z = (D = foundry == null ? void 0 : foundry.applications) == null ? void 0 : D.api) == null ? void 0 : Z.ApplicationV2, p = (De = (le = foundry == null ? void 0 : foundry.applications) == null ? void 0 : le.api) == null ? void 0 : De.HandlebarsApplicationMixin, S = Xt(), I = zt();
  function R(M) {
    return typeof M == "string" && M.startsWith("blob:");
  }
  function O(M) {
    R(M == null ? void 0 : M.liveFrameObjectUrl) && typeof URL < "u" && URL.revokeObjectURL(M.liveFrameObjectUrl), M && (M.liveFrameObjectUrl = null);
  }
  function j(M, a) {
    M.lastFrameAt = Date.now(), M.frameError = !1, M.liveFrame !== a && (O(M), M.liveFrame = a, M.liveFrameObjectUrl = R(a) ? a : null);
  }
  class B extends S {
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
      return s();
    }
    async _renderInner(a) {
      try {
        return await super._renderInner(a);
      } catch (f) {
        return console.warn(`${t} | Monitor template render failed, using inline fallback.`, f), $(at(a, n));
      }
    }
    activateListeners(a) {
      super.activateListeners(a), l(this, a);
    }
    async close(a) {
      return h() ? (g(this), super.close(a)) : this;
    }
  }
  class G extends S {
    constructor(f, u = {}) {
      super(u);
      z(this, "camera");
      z(this, "liveFrame");
      z(this, "liveFrameObjectUrl");
      z(this, "liveFrameTimer");
      this.camera = o(f), this.liveFrame = u.liveFrame ?? "", this.liveFrameObjectUrl = R(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "security-camera-feed",
        title: "Camera Feed",
        template: r,
        classes: ["security-camera-feed-window"],
        popOut: !0,
        resizable: !0,
        width: 720,
        height: 520
      });
    }
    getData() {
      return this.camera = o(this.camera), {
        camera: {
          ...this.camera,
          liveFrame: this.liveFrame,
          hasLiveFrame: !!this.liveFrame
        }
      };
    }
    async _renderInner(f) {
      try {
        return await super._renderInner(f);
      } catch (u) {
        return console.warn(`${t} | Feed template render failed, using inline fallback.`, u), $(st({
          ...this.camera,
          liveFrame: this.liveFrame
        }, n));
      }
    }
    activateListeners(f) {
      super.activateListeners(f), y(this, f);
    }
    async updateLiveFrame(f) {
      var C, F;
      j(this, f);
      const u = c(this), d = (C = u == null ? void 0 : u.querySelector) == null ? void 0 : C.call(u, "[data-security-camera-live-frame]"), b = (F = u == null ? void 0 : u.querySelector) == null ? void 0 : F.call(u, "[data-security-camera-live-waiting]");
      if (d) {
        d.getAttribute("src") !== f && (d.src = f), d.hidden = !1, b && (b.hidden = !0);
        return;
      }
      await this.render(!0);
    }
    async close(f) {
      return m.stopLocalLiveRefresh(this), O(this), v(this), super.close(f);
    }
  }
  function Q() {
    var M;
    return !I || !w || !p ? null : (M = class extends p(w) {
      async _prepareContext(f) {
        return {
          ...await super._prepareContext(f),
          ...s()
        };
      }
      async _renderHTML(f, u) {
        try {
          return await super._renderHTML(f, u);
        } catch (d) {
          console.warn(`${t} | Monitor template render failed, using inline fallback.`, d);
          const b = document.createElement("template");
          return b.innerHTML = at(f, n).trim(), b.content;
        }
      }
      _onRender(f, u) {
        var d;
        (d = super._onRender) == null || d.call(this, f, u), l(this);
      }
      async close(f) {
        return h() ? (g(this), super.close(f)) : this;
      }
    }, z(M, "DEFAULT_OPTIONS", {
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
    }), z(M, "PARTS", {
      main: {
        template: i
      }
    }), M);
  }
  function x() {
    var M;
    return !I || !w || !p ? null : (M = class extends p(w) {
      constructor(u, d = {}) {
        super(d);
        z(this, "camera");
        z(this, "liveFrame");
        z(this, "liveFrameObjectUrl");
        z(this, "liveFrameTimer");
        this.camera = o(u), this.liveFrame = d.liveFrame ?? "", this.liveFrameObjectUrl = R(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
      }
      async _prepareContext(u) {
        return this.camera = o(this.camera), {
          ...await super._prepareContext(u),
          camera: {
            ...this.camera,
            liveFrame: this.liveFrame,
            hasLiveFrame: !!this.liveFrame
          }
        };
      }
      async _renderHTML(u, d) {
        try {
          return await super._renderHTML(u, d);
        } catch (b) {
          console.warn(`${t} | Feed template render failed, using inline fallback.`, b);
          const C = document.createElement("template");
          return C.innerHTML = st({
            ...this.camera,
            liveFrame: this.liveFrame
          }, n).trim(), C.content;
        }
      }
      _onRender(u, d) {
        var b;
        (b = super._onRender) == null || b.call(this, u, d), y(this);
      }
      async updateLiveFrame(u) {
        var F, k;
        j(this, u);
        const d = c(this), b = (F = d == null ? void 0 : d.querySelector) == null ? void 0 : F.call(d, "[data-security-camera-live-frame]"), C = (k = d == null ? void 0 : d.querySelector) == null ? void 0 : k.call(d, "[data-security-camera-live-waiting]");
        if (b) {
          b.getAttribute("src") !== u && (b.src = u), b.hidden = !1, C && (C.hidden = !0);
          return;
        }
        await this.render(!0);
      }
      async close(u) {
        return m.stopLocalLiveRefresh(this), O(this), v(this), super.close(u);
      }
    }, z(M, "DEFAULT_OPTIONS", {
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
    }), z(M, "PARTS", {
      main: {
        template: r
      }
    }), M);
  }
  return {
    SecurityMonitor: Q() ?? B,
    CameraFeed: x() ?? G
  };
}
function Gt(e = 1e3, t = 32) {
  const i = /* @__PURE__ */ new Map();
  return {
    clear() {
      i.clear();
    },
    invalidate(r) {
      for (const n of i.keys()) r(n) && i.delete(n);
    },
    get(r, n, s = e) {
      const o = i.get(r);
      if (o && (o.pending || Date.now() - o.time < s)) return o.promise;
      const l = { time: Date.now(), pending: !0, promise: null };
      for (l.promise = Promise.resolve().then(n).then((y) => (l.pending = !1, l.time = Date.now(), !y && i.get(r) === l && i.delete(r), y), (y) => {
        throw i.get(r) === l && i.delete(r), y;
      }), i.set(r, l); i.size > t; ) i.delete(i.keys().next().value);
      return l.promise;
    }
  };
}
function qt(e) {
  const t = (i) => String.fromCharCode(...e.slice(i, i + 4));
  return e.length < 21 || t(0) !== "RIFF" || t(8) !== "WEBP" ? null : t(12) === "VP8X" ? !!(e[20] & 2) : t(12) === "VP8 " || t(12) === "VP8L" ? !1 : null;
}
async function Ht(e) {
  if (/\.(gif|apng)(?:[?#]|$)/i.test(e)) return !0;
  if (!/\.webp(?:[?#]|$)|^data:image\/webp[;,]/i.test(e)) return !1;
  const t = new AbortController(), i = window.setTimeout(() => t.abort(), 3e3);
  let r;
  try {
    const n = await fetch(e, { headers: { Range: "bytes=0-31" }, signal: t.signal });
    if (!n.ok || !n.body) return !0;
    r = n.body.getReader();
    const s = new Uint8Array(32);
    let o = 0;
    for (; o < s.length; ) {
      const l = await r.read();
      if (l.done) break;
      const y = Math.min(l.value.length, s.length - o);
      s.set(l.value.subarray(0, y), o), o += y;
    }
    return qt(s.subarray(0, o)) ?? !0;
  } catch {
    return !0;
  } finally {
    r == null || r.cancel().catch(() => {
    }), window.clearTimeout(i);
  }
}
function Jt(e = 64 * 1024 * 1024, t = 3e3) {
  const i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new Map();
  let s = /* @__PURE__ */ new Set(), o = null;
  function l(m, h) {
    h.pins || (i.delete(m), h.video ? (h.media.pause(), h.media.removeAttribute("src"), h.media.load()) : h.media.src = "");
  }
  function y() {
    const m = new Set([...n.values()].flatMap((g) => [...g]));
    let h = [...i.values()].reduce((g, v) => g + v.bytes, 0);
    for (const [g, v] of [...i].sort((w, p) => w[1].usedAt - p[1].usedAt)) {
      if (v.pins || m.has(v)) continue;
      const w = Date.now() - v.usedAt >= t;
      w && v.video && v.media.pause(), (h > e || i.size > 48 || w) && (h -= v.bytes, l(g, v));
    }
    o !== null && window.clearTimeout(o), o = i.size ? window.setTimeout(y, t) : null;
  }
  function c(m) {
    let h = i.get(m);
    if (h)
      return h.usedAt = Date.now(), h;
    const g = /\.(webm|mp4|m4v|ogv|ogg)(?:[?#]|$)/i.test(m), v = g ? document.createElement("video") : new Image();
    h = { media: v, video: g, bytes: 0, usedAt: Date.now(), pins: 0, promise: null };
    const w = h;
    return w.promise = new Promise((p) => {
      let S = !1;
      const I = async (O) => {
        S || (S = !0, window.clearTimeout(R), v.onload = v.onloadeddata = v.onerror = null, O ? w.bytes = (v.naturalWidth || v.videoWidth || 0) * (v.naturalHeight || v.videoHeight || 0) * 4 : i.delete(m), !O && g && (v.pause(), v.removeAttribute("src"), v.load()), O && !g && r.set(v, await Ht(m)), p(O));
      }, R = window.setTimeout(() => I(null), 8e3);
      v.crossOrigin = "anonymous", v.onerror = () => I(null), g ? (v.muted = !0, v.loop = !0, v.playsInline = !0, v.preload = "auto", v.onloadeddata = () => I(v)) : v.onload = () => I(v), v.src = m;
    }), i.set(m, w), w;
  }
  return {
    beginFrame(m) {
      const h = /* @__PURE__ */ new Set();
      return {
        async load(g) {
          if (!g) return null;
          const v = c(g);
          return h.has(v) || (h.add(v), v.pins++), v.promise;
        },
        finish() {
          m && s.has(m) && n.set(m, new Set(h));
          for (const g of h)
            g.pins--, g.usedAt = Date.now();
          h.clear(), y();
        }
      };
    },
    pauseVideos() {
      for (const m of i.values()) m.video && m.media.pause();
    },
    isAnimated(m) {
      return r.get(m) === !0;
    },
    retainOwners(m) {
      s = m;
      for (const g of n.keys()) m.has(g) || n.delete(g);
      const h = new Set([...n.values()].flatMap((g) => [...g]));
      for (const g of i.values()) g.video && !g.pins && !h.has(g) && g.media.pause();
    },
    clear() {
      n.clear();
      for (const [m, h] of i) l(m, h);
      o !== null && window.clearTimeout(o), o = null;
    }
  };
}
function Kt(e) {
  const t = /* @__PURE__ */ new Map();
  let i = null;
  function r(c) {
    return (c.background || document.visibilityState !== "hidden") && c.active();
  }
  function n() {
    return [...t.values()].some((c) => [...c.consumers.values()].some(r));
  }
  function s() {
    var c;
    (c = e.active) == null || c.call(e, new Set([...t].filter(([, m]) => [...m.consumers.values()].some(r)).map(([m]) => m)));
  }
  async function o(c) {
    if (c.pending) {
      c.rerun = !0;
      return;
    }
    if (![...c.consumers.values()].some(r) || Date.now() - c.lastStarted < e.interval()) return;
    c.lastStarted = Date.now(), c.pending = !0;
    const m = c.generation;
    try {
      const h = await e.capture(c.camera);
      if (!h || m !== c.generation) return;
      for (const g of [...c.consumers.values()]) {
        if (m !== c.generation) break;
        !r(g) || g.lastFrame === h || (await g.deliver(h), g.lastFrame = h);
      }
    } catch (h) {
      e.error(h);
    } finally {
      c.pending = !1, n() || e.idle(), c.rerun && (c.rerun = !1, o(c));
    }
  }
  function l() {
    s();
    let c = !1;
    for (const m of t.values())
      [...m.consumers.values()].some(r) && (c = !0, o(m));
    c || e.idle();
  }
  function y() {
    i !== null && window.clearInterval(i), i = t.size ? window.setInterval(l, Math.min(250, e.interval())) : null, t.size || e.idle();
  }
  return document.addEventListener("visibilitychange", l), {
    subscribe(c, m, h, g = () => !0, v = !1) {
      const w = String(c.id), p = JSON.stringify(c);
      let S = t.get(w);
      if (!S)
        S = { camera: c, version: p, generation: 0, pending: !1, rerun: !1, lastStarted: -1 / 0, consumers: /* @__PURE__ */ new Map() }, t.set(w, S), y();
      else if (S.version !== p) {
        S.camera = c, S.version = p, S.generation++;
        for (const I of S.consumers.values()) I.lastFrame = void 0;
      }
      S.consumers.set(m, { deliver: h, active: g, background: v }), s(), o(S);
    },
    unsubscribe(c) {
      for (const [m, h] of t)
        h.consumers.delete(c), h.consumers.size || (h.generation++, t.delete(m));
      s(), y();
    },
    invalidate(c) {
      for (const m of t.values())
        (!c || !m.camera.sceneId || m.camera.sceneId === c) && m.generation++;
      l();
    },
    reconfigure() {
      for (const c of t.values()) c.lastStarted = -1 / 0;
      y(), l();
    },
    wake: l
  };
}
const Ge = {
  low: { maxDimension: 480, interval: 2500, quality: 0.65 },
  balanced: { maxDimension: 640, interval: 1500, quality: 0.7 },
  high: { maxDimension: 960, interval: 1250, quality: 0.72 }
};
function Qt(e = "balanced", t = !0) {
  return { ...Ge[String(e)] ?? Ge.balanced, animateVideo: t };
}
function Zt(e, t = 100) {
  const i = he(e);
  if (!i) return null;
  const r = X(i.x), n = X(i.y);
  return !Number.isFinite(r) || !Number.isFinite(n) ? null : {
    x: r,
    y: n,
    width: J(i.width, 1) * t,
    height: J(i.height, 1) * t
  };
}
function he(e) {
  if (!e) return null;
  if (e.document) return he(e.document);
  if (typeof e.toObject == "function") {
    const t = e.toObject();
    if (t && typeof t == "object") return t;
  }
  return e._source && typeof e._source == "object" ? e._source : e;
}
function Ye(e, t) {
  const i = Math.max(e.x, t.x), r = Math.max(e.y, t.y), n = Math.min(e.x + e.width, t.x + t.width), s = Math.min(e.y + e.height, t.y + t.height), o = n - i, l = s - r;
  return o > 0 && l > 0 ? { x: i, y: r, width: o, height: l } : null;
}
function ei(e, t, i) {
  return {
    dx: (e.x - t.x) / t.width * i.width,
    dy: (e.y - t.y) / t.height * i.height,
    dw: e.width / t.width * i.width,
    dh: e.height / t.height * i.height
  };
}
const T = (e, t = 0) => Number.isFinite(Number(e)) ? Number(e) : t;
function ti(e) {
  if (!e) return [];
  const t = e.contents ?? (typeof e.values == "function" ? Array.from(e.values()) : e);
  return Array.isArray(t) ? t.map((i) => (i == null ? void 0 : i.document) ?? i).filter(Boolean) : [];
}
function ii(e, t) {
  return [
    ...e.map((i) => ({ kind: "tile", document: i, data: he(i) })),
    ...t.map((i) => ({ kind: "token", document: i, data: he(i) }))
  ].filter((i) => i.data && !i.data.hidden).sort((i, r) => {
    const n = i.data, s = r.data;
    return T(n.elevation, n.overhead ? 1 : 0) - T(s.elevation, s.overhead ? 1 : 0) || (i.kind === "tile" ? 0 : 1) - (r.kind === "tile" ? 0 : 1) || T(n.sort) - T(s.sort);
  });
}
function ot(e, t) {
  var O, j, B, G, Q;
  const i = he(e);
  if (!i || i.hidden || !(i.width > 0) || !(i.height > 0)) return null;
  let r = T(i.width), n = T(i.height);
  const s = (t == null ? void 0 : t.naturalWidth) || (t == null ? void 0 : t.videoWidth) || r, o = (t == null ? void 0 : t.naturalHeight) || (t == null ? void 0 : t.videoHeight) || n, l = ((O = i.texture) == null ? void 0 : O.fit) ?? "fill", y = l === "cover" ? Math.max(r / s, n / o) : l === "contain" ? Math.min(r / s, n / o) : l === "width" ? r / s : l === "height" ? n / o : null;
  y !== null && (r = s * y, n = o * y);
  const c = T((j = i.texture) == null ? void 0 : j.anchorX, 0.5), m = T((B = i.texture) == null ? void 0 : B.anchorY, 0.5), h = T((G = i.texture) == null ? void 0 : G.scaleX, 1), g = T((Q = i.texture) == null ? void 0 : Q.scaleY, 1), v = T(i.rotation) * Math.PI / 180, w = T(i.x) + T(i.width) * T(i.anchorX, 0.5), p = T(i.y) + T(i.height) * T(i.anchorY, 0.5), S = [
    [-r * c, -n * m],
    [r * (1 - c), -n * m],
    [r * (1 - c), n * (1 - m)],
    [-r * c, n * (1 - m)]
  ].map(([x, D]) => ({
    x: w + x * h * Math.cos(v) - D * g * Math.sin(v),
    y: p + x * h * Math.sin(v) + D * g * Math.cos(v)
  })), I = Math.min(...S.map((x) => x.x)), R = Math.min(...S.map((x) => x.y));
  return {
    width: r,
    height: n,
    anchorX: c,
    anchorY: m,
    scaleX: h,
    scaleY: g,
    rotation: v,
    cx: w,
    cy: p,
    alpha: Math.max(0, Math.min(1, T(i.alpha, 1))),
    bounds: {
      x: I,
      y: R,
      width: Math.max(...S.map((x) => x.x)) - I,
      height: Math.max(...S.map((x) => x.y)) - R
    }
  };
}
function ri(e, t, i) {
  e.save();
  try {
    e.globalAlpha = i.alpha, e.translate(i.cx, i.cy), e.rotate(i.rotation), e.scale(i.scaleX, i.scaleY), e.drawImage(t, -i.width * i.anchorX, -i.height * i.anchorY, i.width, i.height);
  } finally {
    e.restore();
  }
}
const ct = 18;
function ni(e) {
  const t = Jt(), i = Gt(1e3, 16), r = /* @__PURE__ */ new Set(), n = [], s = /* @__PURE__ */ new Set();
  let o = /* @__PURE__ */ new Set();
  const l = () => {
    var a;
    return ((a = e.getPerformance) == null ? void 0 : a.call(e)) ?? { ...Ge.high, animateVideo: !0 };
  };
  let y = 0;
  const c = /* @__PURE__ */ new Map(), m = (a) => `${y}:${c.get(a) ?? 0}`;
  function h(a) {
    const f = e.normalizeCamera(a);
    return f.feedSource === "live" && f.status !== "offline" && f.status !== "restricted";
  }
  function g(a = "") {
    var b, C, F, k, U;
    const f = e.getSceneById(a), d = (f == null ? void 0 : f.id) && ((b = canvas == null ? void 0 : canvas.scene) == null ? void 0 : b.id) === f.id ? canvas.dimensions : f == null ? void 0 : f.dimensions;
    return {
      x: X((d == null ? void 0 : d.sceneX) ?? ((C = d == null ? void 0 : d.sceneRect) == null ? void 0 : C.x)) ?? 0,
      y: X((d == null ? void 0 : d.sceneY) ?? ((F = d == null ? void 0 : d.sceneRect) == null ? void 0 : F.y)) ?? 0,
      width: J(
        (d == null ? void 0 : d.sceneWidth) ?? ((k = d == null ? void 0 : d.sceneRect) == null ? void 0 : k.width) ?? (d == null ? void 0 : d.width) ?? (f == null ? void 0 : f.width),
        xe
      ),
      height: J(
        (d == null ? void 0 : d.sceneHeight) ?? ((U = d == null ? void 0 : d.sceneRect) == null ? void 0 : U.height) ?? (d == null ? void 0 : d.height) ?? (f == null ? void 0 : f.height),
        Ee
      )
    };
  }
  async function v(a, f) {
    if (!a.toBlob) return a.toDataURL("image/webp", f);
    const u = (b) => new Promise((C, F) => {
      try {
        a.toBlob(C, b, f);
      } catch (k) {
        F(k);
      }
    }), d = await u("image/webp") ?? await u("image/png");
    if (!d) throw new Error("Could not encode the camera frame.");
    return new Promise((b, C) => {
      const F = new FileReader();
      F.onload = () => b(String(F.result)), F.onerror = () => C(F.error ?? new Error("Could not read the camera frame.")), F.readAsDataURL(d);
    });
  }
  async function w(a, f, u) {
    var we, be, pe, Se, Ce;
    const d = e.getSceneById(a.sceneId);
    if (!d) return "";
    const b = g(a.sceneId), C = Number.isFinite(a.regionX) && Number.isFinite(a.regionY) ? { x: a.regionX, y: a.regionY, width: a.regionWidth, height: a.regionHeight } : b, F = l(), k = Math.min(1, F.maxDimension / C.width, F.maxDimension / C.height), U = Math.max(1, Math.round(C.width * k)), Y = Math.max(1, Math.round(C.height * k)), te = n.pop() ?? document.createElement("canvas");
    te.width = U, te.height = Y;
    const N = te.getContext("2d");
    if (!N) return "";
    const ne = t.beginFrame(o.has(a.id) ? a.id : void 0);
    let ie = !1;
    const re = async (ue, ae = !0) => {
      const V = await ne.load(ue);
      return (V == null ? void 0 : V.tagName) === "VIDEO" ? F.animateVideo && ae && (document.visibilityState !== "hidden" || s.size > 0) ? (ie = !0, V.play().catch(() => {
      })) : V.pause() : V && t.isAnimated(V) && (ie = !0), V;
    };
    try {
      N.fillStyle = String(d.backgroundColor ?? "#010505"), N.fillRect(0, 0, U, Y);
      const ue = e.getSceneBackgroundPath(a.sceneId) || a.image, ae = await re(ue);
      if (ue && !ae) throw new Error("Camera background could not be loaded.");
      const V = ti(d.tiles ?? ((we = d._source) == null ? void 0 : we.tiles));
      typeof d.foreground == "string" && d.foreground && V.push({
        x: b.x,
        y: b.y,
        width: b.width,
        height: b.height,
        elevation: d.foregroundElevation ?? Number.MAX_SAFE_INTEGER,
        sort: -Number.MAX_SAFE_INTEGER,
        texture: { src: d.foreground }
      });
      const fe = ii(V, j(d, a)), kt = p(d), it = () => N.setTransform(
        U / C.width,
        0,
        0,
        Y / C.height,
        -C.x * U / C.width,
        -C.y * Y / C.height
      );
      it(), ae && N.drawImage(ae, b.x, b.y, b.width, b.height);
      for (const Le of fe) {
        if (Le.kind === "token") {
          N.setTransform(1, 0, 0, 1, 0, 0), await O(N, Le.document, Le.data, C, kt, U, Y, re);
          continue;
        }
        const se = Le.data, We = ot(se);
        if (!We || !We.alpha || (!((be = se.texture) != null && be.fit) || se.texture.fit === "fill") && !Ye(We.bounds, C)) continue;
        const rt = String(((pe = se.texture) == null ? void 0 : pe.src) ?? se.img ?? "");
        if (!rt) continue;
        const Ie = await re(rt, ((Se = se.video) == null ? void 0 : Se.autoplay) !== !1);
        if (!Ie) throw new Error("A camera tile could not be loaded. Check its media path and access.");
        Ie.tagName === "VIDEO" && (Ie.loop = ((Ce = se.video) == null ? void 0 : Ce.loop) !== !1);
        const nt = ot(se, Ie);
        Ye(nt.bounds, C) && (it(), ri(N, Ie, nt));
      }
      const Rt = await v(te, F.quality);
      return u === m(a.sceneId) && (ie ? r.add(f) : r.delete(f)), Rt;
    } finally {
      ne.finish(), n.length < 2 && n.push(te);
    }
  }
  function p(a) {
    var u, d, b, C, F, k;
    const f = (a == null ? void 0 : a.id) && ((u = canvas == null ? void 0 : canvas.scene) == null ? void 0 : u.id) === a.id;
    return J(
      f ? ((d = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : d.size) ?? ((b = canvas == null ? void 0 : canvas.grid) == null ? void 0 : b.size) ?? ((C = a == null ? void 0 : a.grid) == null ? void 0 : C.size) : ((F = a == null ? void 0 : a.dimensions) == null ? void 0 : F.size) ?? ((k = a == null ? void 0 : a.grid) == null ? void 0 : k.size),
      100
    );
  }
  function S(a) {
    if (!a) return [];
    const f = [
      () => I(a, "Token"),
      () => a.tokens,
      () => {
        var u;
        return (u = a.getEmbeddedDocuments) == null ? void 0 : u.call(a, "Token");
      },
      () => {
        var u;
        return (u = a._source) == null ? void 0 : u.tokens;
      },
      () => {
        var u;
        return (u = a.toObject) == null ? void 0 : u.call(a).tokens;
      }
    ];
    for (const u of f) {
      const d = u();
      if (d != null) return R(d);
    }
    return [];
  }
  function I(a, f) {
    var u;
    try {
      return (u = a == null ? void 0 : a.getEmbeddedCollection) == null ? void 0 : u.call(a, f);
    } catch (d) {
      return console.warn(`${e.moduleId} | Could not read ${f} collection for inactive scene.`, d), null;
    }
  }
  function R(a) {
    return a ? (Array.isArray(a == null ? void 0 : a.contents) ? a.contents : Array.isArray(a) ? a : typeof a.values == "function" ? Array.from(a.values()) : Array.from(a ?? [])).map((u) => Array.isArray(u) ? u[1] : u).map((u) => (u == null ? void 0 : u.document) ?? u).filter(Boolean) : [];
  }
  async function O(a, f, u, d, b, C, F, k) {
    var be, pe, Se, Ce, ue, ae, V;
    const U = Zt(u, b);
    if (!U) return;
    const Y = Ye(U, d);
    if (!Y) return;
    const te = String(((be = f.getTextureSrc) == null ? void 0 : be.call(f)) ?? ((pe = u.texture) == null ? void 0 : pe.src) ?? u.img ?? ((Se = f.actor) == null ? void 0 : Se.img) ?? ((Ce = f.baseActor) == null ? void 0 : Ce.img) ?? ((V = (ae = (ue = f.actor) == null ? void 0 : ue.prototypeToken) == null ? void 0 : ae.texture) == null ? void 0 : V.src) ?? "").trim(), N = await k(te), { dx: ne, dy: ie, dw: re, dh: we } = ei(Y, d, { width: C, height: F });
    a.save();
    try {
      if (a.globalAlpha = X(u.alpha) ?? 1, N != null && N.naturalWidth && (N != null && N.naturalHeight)) {
        const fe = B(N, U, Y);
        a.drawImage(N, fe.sx, fe.sy, fe.sw, fe.sh, ne, ie, re, we);
      } else G(a, u, ne, ie, re, we);
    } finally {
      a.restore();
    }
  }
  function j(a, f) {
    var d, b;
    const u = (d = e.getRegionDocument) == null ? void 0 : d.call(e, f.regionId, f.sceneId);
    return u && ((b = canvas == null ? void 0 : canvas.scene) == null ? void 0 : b.id) === a.id && "tokens" in Object(u) ? R(u.tokens) : S(a);
  }
  function B(a, f, u) {
    const d = a.naturalWidth / f.width, b = a.naturalHeight / f.height;
    return {
      sx: Math.max(0, (u.x - f.x) * d),
      sy: Math.max(0, (u.y - f.y) * b),
      sw: Math.min(a.naturalWidth, u.width * d),
      sh: Math.min(a.naturalHeight, u.height * b)
    };
  }
  function G(a, f, u, d, b, C) {
    const F = he(f), k = Math.max(ct, b), U = Math.max(ct, C), Y = u + (b - k) / 2, te = d + (C - U) / 2, N = Math.min(k, U) / 2, ne = Y + k / 2, ie = te + U / 2;
    a.beginPath(), a.arc(ne, ie, N, 0, Math.PI * 2), a.fillStyle = "rgba(10, 18, 24, 0.82)", a.fill(), a.lineWidth = Math.max(2, Math.min(k, U) * 0.08), a.strokeStyle = "rgba(72, 220, 255, 0.95)", a.stroke();
    const re = String((F == null ? void 0 : F.name) ?? (f == null ? void 0 : f.name) ?? "").trim().slice(0, 2).toUpperCase();
    re && (a.font = `700 ${Math.max(10, Math.round(N * 0.72))}px sans-serif`, a.textAlign = "center", a.textBaseline = "middle", a.fillStyle = "rgba(224, 252, 255, 0.96)", a.fillText(re, ne, ie + 0.5));
  }
  async function Q(a = {}, f = {}) {
    const u = e.applyLinkedRegionBounds(e.normalizeCamera(a));
    if (!h(u)) return "";
    const d = e.getSceneById(u.sceneId), b = { ...u, sceneId: (d == null ? void 0 : d.id) ?? u.sceneId }, C = l(), F = JSON.stringify([b.sceneId, b, C]), k = m(b.sceneId), U = r.has(F) ? C.interval * 0.8 : 1 / 0, Y = await i.get(F, () => w(b, F, k), U);
    return k === m(b.sceneId) ? Y : "";
  }
  const x = Kt({
    capture: Q,
    interval: () => l().interval,
    idle: () => t.pauseVideos(),
    active(a) {
      o = a, t.retainOwners(a);
    },
    error: (a) => console.warn(`${e.moduleId} | Camera refresh failed; retrying.`, a)
  }), D = {};
  function Z(a) {
    x.unsubscribe(a);
  }
  function le(a) {
    Z(a), !(!h(a == null ? void 0 : a.camera) || !e.isFrameProducer()) && x.subscribe(a.camera, a, (f) => {
      var u;
      return (u = a.updateLiveFrame) == null ? void 0 : u.call(a, f);
    }, () => {
      var u, d;
      const f = ((u = a.element) == null ? void 0 : u[0]) ?? a.element;
      return a.rendered !== !1 && !a.minimized && !a._minimized && (!f || !f.hidden && ((d = f.style) == null ? void 0 : d.display) !== "none");
    });
  }
  function De(a) {
    x.unsubscribe(D), !(!h(a) || !e.isFrameProducer()) && x.subscribe(a, D, (f) => {
      var u;
      return (u = e.broadcastLiveFrame) == null ? void 0 : u.call(e, e.normalizeCamera(a), f);
    });
  }
  function M(a) {
    if (a) {
      c.set(a, (c.get(a) ?? 0) + 1);
      const f = `[${JSON.stringify(a)},`;
      i.invalidate((u) => u.startsWith(f));
      for (const u of r) u.startsWith(f) && r.delete(u);
    } else
      y++, c.clear(), i.clear(), r.clear();
    x.invalidate(a);
  }
  return {
    captureLiveFrame: Q,
    invalidateFrames: M,
    reconfigure() {
      t.pauseVideos(), M(), x.reconfigure();
    },
    wake: x.wake,
    startBroadcastLiveRefresh: De,
    stopBroadcastLiveRefresh: () => x.unsubscribe(D),
    startLocalLiveRefresh: le,
    stopLocalLiveRefresh: Z,
    subscribeRemote(a, f, u, d) {
      !h(a) || !e.isFrameProducer() || (s.add(f), x.subscribe(a, f, u, d, !0));
    },
    unsubscribeRemote(a) {
      s.delete(a), x.unsubscribe(a);
    },
    clearRemoteViewers() {
      for (const a of s) x.unsubscribe(a);
      s.clear();
    }
  };
}
const E = "security-cameras", ht = `module.${E}`, ai = `modules/${E}/templates/monitor.hbs`, si = `modules/${E}/templates/feed.hbs`;
function oi() {
  return Qt(game.settings.get(E, "cameraQuality"), game.settings.get(E, "animateVideoTiles") !== !1);
}
function qe() {
  const e = Number(game.settings.get(E, "videoEffectIntensity")), t = Number.isFinite(e) ? Math.max(0, Math.min(200, e)) / 100 : 0.5, i = document.documentElement;
  i.style.setProperty("--security-camera-effect-intensity", String(t)), i.classList.toggle("security-camera-effects-disabled", t === 0), i.classList.toggle("security-camera-reduced-effects", !!game.settings.get(E, "reducedEffects"));
}
function ci(e) {
  game.settings.register(E, "cameraQuality", {
    name: "Camera Quality",
    hint: "Low: 480px every 2.5 seconds. Balanced: 640px every 1.5 seconds. High: 960px every 1.25 seconds. Lower settings reduce capture and network work for everyone.",
    scope: "world",
    config: !0,
    type: String,
    default: "balanced",
    choices: { low: "Low", balanced: "Balanced", high: "High" },
    onChange: e
  }), game.settings.register(E, "animateVideoTiles", {
    name: "Animate Video Tiles",
    hint: "Play video backgrounds and tiles in live feeds. Turn this off to use still frames and reduce work on the GM's machine.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0,
    onChange: e
  }), game.settings.register(E, "reducedEffects", {
    name: "Reduced Screen Effects",
    hint: "Remove animated screen effects and image filters on this computer. Camera status and access restrictions still apply.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: qe
  }), game.settings.register(E, "videoEffectIntensity", {
    name: "Video Effect Intensity",
    hint: "Adjust static, scanlines, tint, flicker, and glitches for all viewers. Default: 50%. Use 0% to turn effects off or 100% for the original strength. Clean cameras have no effects.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 0, max: 200, step: 10 },
    default: 50,
    onChange: qe
  }), game.settings.register(E, "cameras", {
    name: "Security Cameras",
    hint: "Saved camera feeds for this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  });
}
function ke() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function ve(e) {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : JSON.parse(JSON.stringify(e));
}
function yt(e) {
  var i;
  if ((i = foundry == null ? void 0 : foundry.utils) != null && i.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
const vt = Ot(E, {
  socketName: ht,
  title: "Security Cameras"
});
let P = null, A = null, L = "", ee = "", ye = "", Ae = 0, Oe = 0, $e = !1, de = null;
const li = 1e4, H = /* @__PURE__ */ new Map();
function K(e = {}, t = {}) {
  return Xe(e, { ...t, createId: ke });
}
function Te(e = {}, t = {}) {
  return Pt(e, { ...t, createId: ke });
}
function di(e) {
  var t, i;
  return e ? ((i = (t = game.scenes) == null ? void 0 : t.get(e)) == null ? void 0 : i.name) ?? "Unknown Scene" : "Unassigned Scene";
}
function wt(e = "") {
  var i;
  const t = Pe(e);
  return String(((i = t == null ? void 0 : t.background) == null ? void 0 : i.src) ?? (t == null ? void 0 : t.img) ?? "").trim();
}
function mi(e = "") {
  var i;
  const t = (((i = game.scenes) == null ? void 0 : i.contents) ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    selected: r.id === e
  })).sort((r, n) => r.name.localeCompare(n.name));
  return [
    { id: "", name: "Unassigned Scene", selected: !e },
    ...t
  ];
}
function Pe(e = "") {
  var t;
  return e ? ((t = game.scenes) == null ? void 0 : t.get(e)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
}
function fi(e = "") {
  var r;
  const t = Pe(e);
  return (((r = t == null ? void 0 : t.regions) == null ? void 0 : r.contents) ?? []).map((n) => ({
    id: n.id,
    name: n.name || `Region ${n.id}`,
    region: n
  })).sort((n, s) => n.name.localeCompare(s.name));
}
function bt(e = "", t = "") {
  return [
    { id: "", name: "No Linked Region", selected: !t },
    ...fi(e).map((i) => ({
      id: i.id,
      name: i.name,
      selected: i.id === t
    }))
  ];
}
function Ze(e = "", t = "") {
  var r, n;
  if (!e) return null;
  const i = Pe(t);
  return ((n = (r = i == null ? void 0 : i.regions) == null ? void 0 : r.get) == null ? void 0 : n.call(r, e)) ?? null;
}
function gi(e) {
  var o, l, y, c;
  const t = (e == null ? void 0 : e.object) ?? ((y = (l = (o = canvas == null ? void 0 : canvas.regions) == null ? void 0 : o.placeables) == null ? void 0 : l.find) == null ? void 0 : y.call(l, (m) => {
    var h;
    return ((h = m.document) == null ? void 0 : h.id) === (e == null ? void 0 : e.id);
  })), i = t == null ? void 0 : t.bounds;
  if (i != null && i.width && (i != null && i.height))
    return je(i);
  const r = e == null ? void 0 : e.bounds;
  if (r != null && r.width && (r != null && r.height))
    return je(r);
  const n = ((c = e == null ? void 0 : e.toObject) == null ? void 0 : c.call(e)) ?? e, s = Array.isArray(e == null ? void 0 : e.shapes) ? e.shapes : Array.isArray(n == null ? void 0 : n.shapes) ? n.shapes : [];
  return Wt(s);
}
function Be(e) {
  const t = Ze(e.regionId, e.sceneId), i = gi(t);
  return i ? {
    ...e,
    ...i
  } : e;
}
function He() {
  const e = canvas == null ? void 0 : canvas.scene;
  return K({
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
function ze(e, t) {
  return e.map((i) => ({
    ...i,
    selected: i.value === t
  }));
}
function Ue(e = {}) {
  var y;
  const t = K(e), i = (/* @__PURE__ */ new Date()).toLocaleString(), r = t.status === "online" || t.status === "clean", n = t.status === "offline", s = t.status === "corrupted", o = t.status === "restricted", l = t.feedSource === "live";
  return {
    ...t,
    sceneName: di(t.sceneId),
    regionName: ((y = Ze(t.regionId, t.sceneId)) == null ? void 0 : y.name) || (t.regionId ? "Region unavailable" : "No region"),
    sceneBackground: wt(t.sceneId),
    regionAspect: t.regionWidth && t.regionHeight ? `${t.regionWidth} / ${t.regionHeight}` : "16 / 9",
    timestamp: i,
    signalLabel: r ? "SIGNAL LOCK" : s ? "SIGNAL CORRUPTED" : o ? "ACCESS DENIED" : "NO SIGNAL",
    isOnline: r,
    isOffline: n,
    isCorrupted: s,
    isRestricted: o,
    isLive: l,
    isImage: !l,
    hasRegion: Number.isFinite(t.regionX) && Number.isFinite(t.regionY),
    canDisplayImage: !!(t.image && !l && !n && !o),
    canUseImageFallback: !!(t.image && l && !n && !o),
    statusClass: `security-camera-status-${t.status}`,
    sourceClass: `security-camera-source-${t.feedSource}`,
    displayClass: `security-camera-display-${t.displayMode}`
  };
}
function oe() {
  const e = game.settings.get(E, "cameras");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function pt() {
  return Object.values(oe()).map(K).sort((e, t) => e.name.localeCompare(t.name));
}
function W(e) {
  const t = String(e ?? "");
  if (!t) return null;
  const i = oe()[t];
  return i ? K(i) : null;
}
async function Re(e) {
  var i;
  const t = ve(oe());
  await game.settings.set(E, "cameras", e), _.invalidateFrames();
  for (const r of Object.keys(t))
    JSON.stringify(t[r]) !== JSON.stringify(e[r]) && (xt(r), me({
      action: "cameraChanged",
      gmUserId: game.user.id,
      cameraId: r,
      camera: e[r] ? K(e[r]) : null
    }), ((i = A == null ? void 0 : A.camera) == null ? void 0 : i.id) === r && (e[r] ? await Me(e[r]) : await _e()), ye === r && (Ae++, _.stopBroadcastLiveRefresh(), e[r] || (ye = "")));
  await Ei();
}
function ce(e = "manage security cameras") {
  var t, i, r;
  return (t = game.user) != null && t.isGM ? !0 : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, `Only the GM can ${e}.`), !1);
}
function me(e) {
  return vt.emit(e);
}
async function hi(e = {}) {
  var n, s;
  if (!ce("register security cameras")) return null;
  const t = Te(e);
  if (!t.ok)
    return (s = (n = ui.notifications) == null ? void 0 : n.error) == null || s.call(n, t.errors.join(" ")), null;
  const i = Be(t.camera), r = ve(oe());
  return r[i.id] = i, L = i.id, ee = i.id, await Re(r), i;
}
async function St(e) {
  var o, l;
  if (!ce("delete security cameras")) return !1;
  const t = String(e ?? L ?? "");
  if (!t || !W(t))
    return (l = (o = ui.notifications) == null ? void 0 : o.warn) == null || l.call(o, "Select a camera to delete."), !1;
  const i = W(t);
  if (!(typeof Dialog < "u" ? await Dialog.confirm({
    title: "Delete Security Camera",
    content: `<p>Delete camera <strong>${yt(i.name)}</strong>?</p>`,
    yes: () => !0,
    no: () => !1,
    defaultYes: !1
  }) : window.confirm(`Delete camera "${i.name}"?`))) return !1;
  const n = ve(oe());
  return delete n[t], L = Object.keys(n)[0] ?? "", ee = L, await Re(n), !0;
}
async function Ct(e) {
  var n, s;
  if (!ce("duplicate security cameras")) return null;
  const t = W(e || L);
  if (!t)
    return (s = (n = ui.notifications) == null ? void 0 : n.warn) == null || s.call(n, "Select a camera to duplicate."), null;
  const i = K({
    ...t,
    id: ke(),
    name: `${t.name} Copy`
  }), r = ve(oe());
  return r[i.id] = i, L = i.id, ee = i.id, await Re(r), i;
}
async function It() {
  var i, r;
  if (!ce("create security cameras")) return null;
  const e = K({
    ...He(),
    id: ke(),
    name: "New Camera",
    location: "Unlabeled Location"
  }), t = ve(oe());
  return t[e.id] = Be(e), L = e.id, ee = e.id, await Re(t), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "New security camera created."), e;
}
function Ft(e) {
  const t = new FormData(e), i = String(t.get("originalId") ?? "").trim(), r = String(t.get("id") ?? "").trim() || i || ke();
  return {
    originalId: i,
    camera: K({
      id: r,
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
async function lt(e) {
  var o, l, y, c, m, h;
  if (!ce("save security cameras") || !(e != null && e.reportValidity())) return null;
  const { originalId: t, camera: i } = Ft(e), r = Te(i);
  if (!r.ok)
    return (l = (o = ui.notifications) == null ? void 0 : o.error) == null || l.call(o, r.errors.join(" ")), null;
  const n = Be(r.camera), s = ve(oe());
  return t !== n.id && Object.hasOwn(s, n.id) ? ((c = (y = ui.notifications) == null ? void 0 : y.warn) == null || c.call(y, "That camera ID is already in use. Choose a unique ID."), null) : (t && t !== n.id && delete s[t], $e = !1, de = null, s[n.id] = n, L = n.id, ee = n.id, await Re(s), (h = (m = ui.notifications) == null ? void 0 : m.info) == null || h.call(m, "Security camera saved."), n);
}
function yi(e = L) {
  var i, r, n, s, o, l, y, c;
  const t = W(e);
  if (!Number.isFinite(t == null ? void 0 : t.regionX) || !Number.isFinite(t == null ? void 0 : t.regionY)) {
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "This camera does not have a region yet.");
    return;
  }
  if (t.sceneId && ((n = canvas.scene) == null ? void 0 : n.id) !== t.sceneId) {
    (o = (s = ui.notifications) == null ? void 0 : s.warn) == null || o.call(s, "Activate the camera's scene before panning to its region.");
    return;
  }
  (c = canvas.animatePan) == null || c.call(canvas, {
    x: t.regionX + t.regionWidth / 2,
    y: t.regionY + t.regionHeight / 2,
    scale: ((y = (l = canvas.stage) == null ? void 0 : l.scale) == null ? void 0 : y.x) ?? 1,
    duration: 500
  });
}
function Ve(e, t = null) {
  var i;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (i = e.element) != null && i[0] ? e.element[0] : e.element ?? null;
}
function vi() {
  const e = pt();
  !L && e.length && (L = e[0].id), ee === null && (ee = L);
  const t = W(L), i = de ?? (ee === "" ? He() : W(ee) ?? He()), r = Ue(i);
  return {
    cameras: e.map((n) => ({
      ...Ue(n),
      isSelected: n.id === L
    })),
    selectedCamera: t ? Ue(t) : null,
    editorCamera: r,
    originalEditorId: (de == null ? void 0 : de.originalId) ?? i.id,
    sceneChoices: mi(i.sceneId),
    regionChoices: bt(i.sceneId, i.regionId),
    feedSourceChoices: ze(_t, i.feedSource),
    statusChoices: ze(Ut, i.status),
    displayModeChoices: ze(Tt, i.displayMode),
    showStaticImageField: i.feedSource === "image",
    hasCameras: e.length > 0,
    isNewCamera: !i.id,
    editorDirty: $e
  };
}
function wi(e) {
  var r, n, s;
  if (typeof FilePicker > "u") {
    (n = (r = ui.notifications) == null ? void 0 : r.warn) == null || n.call(r, "The file browser is unavailable.");
    return;
  }
  const t = (s = e == null ? void 0 : e.elements) == null ? void 0 : s.image;
  new FilePicker({
    type: "image",
    current: (t == null ? void 0 : t.value) ?? "",
    callback: (o) => {
      t && (t.value = o, t.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
  }).browse();
}
function Je() {
  return $e ? window.confirm("Discard unsaved camera changes?") ? ($e = !1, de = null, !0) : !1 : !0;
}
function At(e) {
  _.stopLocalLiveRefresh(e);
}
function bi(e, t = null) {
  var l, y, c, m, h, g, v;
  const i = Ve(e, t);
  if (!i) return;
  const r = i.querySelector("[data-security-camera-form]");
  At(e), e.camera = W(L), e.lastFrameAt = null, e.frameError = !1;
  const n = i.querySelector(".security-camera-preview-frame");
  if (((l = e.camera) == null ? void 0 : l.feedSource) === "live" && !["offline", "restricted"].includes(e.camera.status) && n) {
    n.replaceChildren();
    const w = document.createElement("img");
    w.alt = e.camera.name, w.hidden = !0, n.append(w);
    const p = document.createElement("div");
    p.className = "security-camera-placeholder", p.textContent = "Waiting for first frame", n.append(p), e.updateLiveFrame = async (S) => {
      w.getAttribute("src") !== S && (w.src = S), w.hidden = !1, p.hidden = !0, e.lastFrameAt = Date.now(), e.frameError = !1;
    }, _.startLocalLiveRefresh(e);
  }
  const s = () => {
    $e = !0;
    const w = Ft(r);
    de = { ...w.camera, originalId: w.originalId };
    const p = i.querySelector("[data-camera-dirty]");
    p && (p.hidden = !1);
  };
  r == null || r.addEventListener("input", s), r == null || r.addEventListener("change", s), (c = (y = r == null ? void 0 : r.elements) == null ? void 0 : y.sceneId) == null || c.addEventListener("change", () => {
    r.elements.regionId.replaceChildren(...bt(r.elements.sceneId.value).map((p) => new Option(p.name, p.id)));
    for (const p of ["regionX", "regionY"]) r.elements[p].value = "";
    r.elements.regionWidth.value = xe, r.elements.regionHeight.value = Ee, s();
  }), (h = (m = r == null ? void 0 : r.elements) == null ? void 0 : m.regionId) == null || h.addEventListener("change", () => {
    if (!r.elements.regionId.value)
      for (const w of ["regionX", "regionY"]) r.elements[w].value = "";
    s();
  }), r == null || r.addEventListener("submit", async (w) => {
    w.preventDefault(), await lt(r);
  });
  const o = () => {
    const w = r.elements.feedSource.value === "live";
    r.elements.sceneId.disabled = !w, r.elements.regionId.disabled = !w;
    const p = r.querySelector("[data-security-camera-static-image-field]");
    p && (p.hidden = r.elements.feedSource.value !== "image");
  };
  o(), (v = (g = r == null ? void 0 : r.elements) == null ? void 0 : g.feedSource) == null || v.addEventListener("change", o), i.querySelectorAll("[data-security-camera-id]").forEach((w) => {
    w.addEventListener("click", async (p) => {
      Je() && (L = p.currentTarget.dataset.securityCameraId, ee = L, await e.render(!0));
    });
  }), i.querySelectorAll("[data-security-camera-action]").forEach((w) => {
    w.addEventListener("click", async (p) => {
      const S = p.currentTarget.dataset.securityCameraAction;
      if (!(["new", "duplicate", "delete"].includes(S) && !Je())) {
        if (S === "new") {
          await It();
          return;
        }
        if (S === "duplicate") {
          await Ct(L);
          return;
        }
        if (S === "delete") {
          await St(L);
          return;
        }
        if (S === "browse-image") {
          wi(r);
          return;
        }
        if (S === "pan-region") {
          yi(L);
          return;
        }
        if (S === "show" || S === "save-show") {
          if (S === "save-show") {
            const I = await lt(r);
            if (!I) return;
            await Ke(I.id);
            return;
          }
          await Ke(L);
          return;
        }
        if (S === "close-feed") {
          Et();
          return;
        }
      }
    });
  });
}
function $t(e) {
  var n, s;
  const t = (e == null ? void 0 : e.camera) ?? {}, i = Ne(t.displayMode, Qe, q.displayMode), r = Ve(e);
  if (r == null || r.classList.toggle("security-camera-feed-display-window", i === "window"), r == null || r.classList.toggle("security-camera-feed-display-pip", i === "picture-in-picture"), i === "picture-in-picture") {
    const o = Number(t.regionWidth) && Number(t.regionHeight) ? Number(t.regionWidth) / Number(t.regionHeight) : 1.7777777777777777, l = Math.min(620, Math.max(360, window.innerWidth * 0.42)), y = Math.min(460, Math.max(260, window.innerHeight * 0.38));
    let c = l, m = c / o;
    m > y && (m = y, c = m * o);
    const h = Math.round(m + 190);
    c += 48, (n = e.setPosition) == null || n.call(e, {
      left: Math.max(12, window.innerWidth - c - 24),
      top: Math.max(12, window.innerHeight - h - 84),
      width: Math.round(c),
      height: h
    });
    return;
  }
  (s = e.setPosition) == null || s.call(e, {
    width: 720,
    height: 520
  });
}
function pi(e, t = null) {
  var s, o;
  const i = Ve(e, t);
  if (!i) return;
  $t(e), _.startLocalLiveRefresh(e), Mi(e), e.liveFrame && !e.lastFrameAt && (e.lastFrameAt = Date.now());
  const r = i.querySelector("[data-security-camera-drag]");
  (s = e.feedDragController) == null || s.abort(), r == null || r.addEventListener("pointerdown", (l) => {
    var g, v;
    if (l.button !== 0) return;
    l.preventDefault(), l.stopPropagation(), (g = e.bringToFront) == null || g.call(e);
    const y = i.getBoundingClientRect();
    (v = e.feedDragController) == null || v.abort();
    const c = e.feedDragController = new AbortController(), m = { pointerId: l.pointerId, x: l.clientX, y: l.clientY, left: y.left, top: y.top };
    document.addEventListener("pointermove", (w) => {
      w.pointerId === m.pointerId && n(m.left + w.clientX - m.x, m.top + w.clientY - m.y);
    }, { signal: c.signal });
    const h = (w) => {
      w.pointerId === m.pointerId && c.abort();
    };
    document.addEventListener("pointerup", h, { signal: c.signal }), document.addEventListener("pointercancel", h, { signal: c.signal });
  });
  const n = (l, y) => {
    var c;
    return (c = e.setPosition) == null ? void 0 : c.call(e, {
      left: Math.max(0, Math.min(window.innerWidth - 80, l)),
      top: Math.max(0, Math.min(window.innerHeight - 40, y))
    });
  };
  r == null || r.addEventListener("keydown", (l) => {
    const y = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[l.key];
    if (!y) return;
    l.preventDefault(), l.stopPropagation();
    const c = i.getBoundingClientRect(), m = l.shiftKey ? 40 : 10;
    n(c.left + y[0] * m, c.top + y[1] * m);
  }), (o = i.querySelector("[data-security-camera-close]")) == null || o.addEventListener("click", () => e.close());
}
const _ = ni({
  applyLinkedRegionBounds: Be,
  getRegionDocument: Ze,
  getSceneBackgroundPath: wt,
  getSceneById: Pe,
  isFrameProducer: () => {
    var e;
    return !!((e = game.user) != null && e.isGM);
  },
  getPerformance: oi,
  moduleId: E,
  normalizeCamera: K
}), { SecurityMonitor: Si, CameraFeed: Ci } = jt({
  moduleId: E,
  monitorTemplatePath: ai,
  feedTemplatePath: si,
  escapeHTML: yt,
  getMonitorContext: vi,
  prepareCamera: Ue,
  bindMonitorControls: bi,
  bindFeedControls: pi,
  getElement: Ve,
  liveFrameController: _,
  allowDiscardCameraChanges: Je,
  clearActiveMonitor: (e) => {
    At(e), P === e && (P = null);
  },
  clearActiveFeed: (e) => {
    var t;
    (t = e.feedDragController) == null || t.abort(), et(e), A === e && (A = null);
  }
});
async function Mt() {
  var e;
  return ce("open the Security Camera Manager") ? P ? ((e = P.bringToFront) == null || e.call(P), P) : (P = new Si(), await P.render(!0), P) : null;
}
async function Ii() {
  if (!P) return;
  await P.close();
}
async function Me(e, t = {}) {
  const i = K(e), r = A, n = ++Oe;
  if (A = null, r && await r.close(), n !== Oe) return null;
  const s = new Ci(i, { liveFrame: t.liveFrame ?? "" });
  return A = s, await s.render(!0), n !== Oe ? (await s.close({}), null) : ($t(s), s);
}
async function _e() {
  if (Oe++, !A) return;
  const e = A;
  A = null, et(e), await e.close();
}
async function Ke(e) {
  var n, s;
  if (!ce("broadcast camera feeds")) return null;
  const t = W(e);
  if (!t)
    return (s = (n = ui.notifications) == null ? void 0 : n.warn) == null || s.call(n, "Security camera not found."), null;
  const i = ++Ae;
  _.stopBroadcastLiveRefresh(), ye = t.id;
  let r = "";
  try {
    r = await _.captureLiveFrame(t, { preferDataUrl: !0 });
  } catch (o) {
    console.warn(`${E} | Initial frame unavailable.`, o);
  }
  return i !== Ae || Fe(W(t.id)) !== Fe(t) ? null : (me({
    action: "showFeed",
    gmUserId: game.user.id,
    camera: t,
    liveFrame: r
  }), Me(t, { liveFrame: r }));
}
async function Fi(e, t = {}) {
  var n, s, o, l, y, c;
  const i = W(e);
  if (!i)
    return (s = (n = ui.notifications) == null ? void 0 : n.warn) == null || s.call(n, "Security camera not found."), null;
  if (!tt((o = game.user) == null ? void 0 : o.id, e))
    return (y = (l = ui.notifications) == null ? void 0 : l.warn) == null || y.call(l, "You do not have access to this camera feed."), null;
  let r = String(t.liveFrame ?? "");
  if ((c = game.user) != null && c.isGM && !r)
    try {
      r = await _.captureLiveFrame(i, { preferDataUrl: !0 });
    } catch (m) {
      console.warn(`${E} | Initial frame unavailable.`, m);
    }
  return Me(i, { liveFrame: r });
}
function Ai(e) {
  var t, i;
  me({
    action: "requestLiveFrame",
    userId: (t = game.user) == null ? void 0 : t.id,
    cameraId: e,
    hasFrame: !!(((i = A == null ? void 0 : A.camera) == null ? void 0 : i.id) === e && A.liveFrame)
  });
}
function $i(e) {
  var t;
  return !((t = game.user) != null && t.isGM) && (e == null ? void 0 : e.feedSource) === "live" && e.status !== "offline" && e.status !== "restricted";
}
function Mi(e) {
  if (et(e), !$i(e == null ? void 0 : e.camera)) return;
  let t = !1;
  const i = () => {
    document.visibilityState !== "hidden" && !e.minimized && !e._minimized ? (Ai(e.camera.id), t = !0) : t && (me({ action: "unsubscribeFeed", userId: game.user.id, cameraId: e.camera.id }), t = !1);
  };
  e.remoteLiveFrameTimer = window.setInterval(i, li), e.remoteVisibilityHandler = i, document.addEventListener("visibilitychange", i), i();
}
function et(e) {
  var t, i;
  e && (e.remoteLiveFrameTimer && (window.clearInterval(e.remoteLiveFrameTimer), me({ action: "unsubscribeFeed", userId: (t = game.user) == null ? void 0 : t.id, cameraId: (i = e.camera) == null ? void 0 : i.id })), e.remoteVisibilityHandler && document.removeEventListener("visibilitychange", e.remoteVisibilityHandler), e.remoteVisibilityHandler = null, e.remoteLiveFrameTimer = null);
}
function ge(e) {
  const t = H.get(e);
  t && window.clearTimeout(t.timer), H.delete(e), _.unsubscribeRemote(e);
}
function xt(e) {
  for (const [t, i] of [...H]) i.cameraId === e && ge(t);
}
function xi() {
  for (const e of [...H.keys()]) ge(e);
}
function tt(e, t) {
  var r, n;
  const i = W(t);
  return ut((n = (r = game.users) == null ? void 0 : r.get) == null ? void 0 : n.call(r, e), i);
}
function Et() {
  ce("close player camera feeds") && (me({
    action: "closeFeed",
    gmUserId: game.user.id
  }), Ae++, ye = "", xi(), _.stopBroadcastLiveRefresh(), _e());
}
async function Ei() {
  P && await P.render(!0);
}
function ki(e, t, i) {
  const r = W(e);
  if (!r || Fe(r) !== t) return;
  const n = [...H.values()].filter((o) => {
    var l, y, c;
    return o.cameraId === e && o.revision === t && Date.now() < o.expires && ((c = (y = (l = game.users) == null ? void 0 : l.get) == null ? void 0 : y.call(l, o.userId)) == null ? void 0 : c.active) && ut(game.users.get(o.userId), r);
  }), s = (o, l) => {
    if (!o.length) return;
    const y = o.map((c) => c.userId);
    me({
      action: "updateFeedFrame",
      gmUserId: game.user.id,
      cameraId: e,
      revision: t,
      ...y.length === 1 ? { recipientUserId: y[0] } : { recipientUserIds: y },
      ...l
    });
    for (const c of o)
      c.lastFrame = i, c.needsAck = !1;
  };
  s(n.filter((o) => o.lastFrame !== i), { liveFrame: i }), s(n.filter((o) => o.needsAck), { frameUnchanged: !0 });
}
async function Ri(e) {
  var i, r, n, s, o, l, y, c, m, h, g, v, w, p, S;
  if (!e || typeof e != "object") return;
  const t = vt.isGMSender(e.gmUserId);
  if (e.action === "unsubscribeFeed") {
    (i = game.user) != null && i.isGM && ge(`${String(e.userId ?? "")}:${String(e.cameraId ?? "")}`);
    return;
  }
  if (e.action === "requestLiveFrame") {
    if (!((r = game.user) != null && r.isGM)) return;
    const I = (((n = game.users) == null ? void 0 : n.contents) ?? []).filter((D) => D.isGM && D.active).sort((D, Z) => D.id.localeCompare(Z.id))[0];
    if (I && I.id !== game.user.id) return;
    const R = String(e.cameraId ?? ""), O = String(e.userId ?? ""), j = W(R), B = `${O}:${R}`;
    if (!j || !((l = (o = (s = game.users) == null ? void 0 : s.get) == null ? void 0 : o.call(s, O)) != null && l.active) || j.feedSource !== "live" || !tt(O, R)) {
      ge(B);
      return;
    }
    const G = H.get(B);
    G && window.clearTimeout(G.timer);
    const Q = Fe(j), x = {
      userId: O,
      cameraId: R,
      revision: Q,
      expires: Date.now() + 3e4,
      needsAck: !0,
      lastFrame: e.hasFrame === !0 ? (G == null ? void 0 : G.lastFrame) ?? "" : "",
      timer: window.setTimeout(() => ge(B), 3e4)
    };
    H.set(B, x), _.subscribeRemote(j, B, (D) => {
      H.get(B) === x && ki(R, Q, D);
    }, () => {
      var D, Z, le;
      return H.get(B) === x && Date.now() < x.expires && !!((le = (Z = (D = game.users) == null ? void 0 : D.get) == null ? void 0 : Z.call(D, O)) != null && le.active);
    });
    return;
  }
  if (e.action === "cameraChanged") {
    if (!t || (y = game.user) != null && y.isGM && e.gmUserId === game.user.id) return;
    const I = e.camera ? Te(e.camera, { requireId: !0 }) : null;
    if (e.camera && (!(I != null && I.ok) || I.camera.id !== e.cameraId)) return;
    xt(e.cameraId), _.invalidateFrames(), ye === e.cameraId && (Ae++, _.stopBroadcastLiveRefresh(), I || (ye = "")), ((c = A == null ? void 0 : A.camera) == null ? void 0 : c.id) === e.cameraId && (I ? await Me(I.camera) : await _e());
    return;
  }
  if (e.action === "showFeed") {
    if ((m = game.user) != null && m.isGM) return;
    if (!t) {
      console.warn(`${E} | Ignoring camera feed socket message without a GM sender.`);
      return;
    }
    const I = Te(e.camera);
    if (!I.ok) {
      console.warn(`${E} | Ignoring invalid socket camera payload.`, I.errors);
      return;
    }
    await Me(I.camera, {
      liveFrame: typeof e.liveFrame == "string" ? e.liveFrame : ""
    });
    return;
  }
  if (e.action === "updateFeedFrame") {
    if ((h = game.user) != null && h.isGM || !t || Array.isArray(e.recipientUserIds) && !e.recipientUserIds.includes((g = game.user) == null ? void 0 : g.id)) return;
    const I = String(e.recipientUserId ?? "");
    if (I && I !== ((v = game.user) == null ? void 0 : v.id)) return;
    const R = String(e.cameraId ?? "");
    if (!R || ((w = A == null ? void 0 : A.camera) == null ? void 0 : w.id) !== R || e.revision !== Fe(K(A.camera)) || ["offline", "restricted"].includes(A.camera.status)) return;
    if (e.frameUnchanged === !0) {
      A.lastFrameAt = Date.now();
      return;
    }
    if (typeof e.liveFrame != "string" || !e.liveFrame) return;
    await ((p = A.updateLiveFrame) == null ? void 0 : p.call(A, e.liveFrame));
    return;
  }
  if (e.action === "closeFeed") {
    if ((S = game.user) != null && S.isGM || !t) return;
    await _e();
  }
}
function Di() {
  const e = {
    openMonitor: Mt,
    closeMonitor: Ii,
    showFeed: Ke,
    registerCamera: hi,
    createNewCamera: It,
    deleteCamera: St,
    duplicateCamera: Ct,
    getCameras: pt,
    getCamera: W,
    openCameraFeed: Fi,
    hasCameraAccess: tt,
    closeFeed: Et,
    get activeMonitor() {
      return P;
    },
    get activeFeed() {
      return A;
    }
  };
  game.securityCameras = e;
  const t = game.modules.get(E);
  t && (t.api = e);
}
function Li() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: E,
    title: "Security Cameras",
    icon: "fa-solid fa-video",
    premium: !1,
    featureId: E,
    playerVisible: !1,
    description: "Manage camera feeds and broadcast surveillance views.",
    open: () => Mt()
  }), !0) : !1;
}
Hooks.once("init", () => {
  ci(() => _.reconfigure());
});
Hooks.once("ready", () => {
  var e, t;
  qe(), Di(), Li(), (t = (e = game.socket) == null ? void 0 : e.on) == null || t.call(e, ht, (i) => {
    Ri(i).catch((r) => console.warn(`${E} | Camera message failed.`, r));
  }), console.log(`${E} | Ready. Use game.securityCameras.openMonitor()`);
});
for (const e of ["createToken", "updateToken", "deleteToken", "createTile", "updateTile", "deleteTile", "updateScene", "createRegion", "updateRegion", "deleteRegion"])
  Hooks.on(e, (t) => {
    var r;
    const i = e === "updateScene" ? t.id : (r = t.parent) == null ? void 0 : r.id;
    _.invalidateFrames(i);
  });
Hooks.on("updateActor", (e, t) => {
  var i, r;
  if (Object.keys(t).some((n) => /^(img|name|prototypeToken)(\.|$)/.test(n)))
    for (const n of ((i = game.scenes) == null ? void 0 : i.contents) ?? [])
      [...((r = n.tokens) == null ? void 0 : r.contents) ?? n.tokens ?? []].some((o) => o.actorId === e.id) && _.invalidateFrames(n.id);
});
Hooks.on("updateUser", () => {
  var e, t, i, r;
  for (const n of [...H.keys()])
    (r = (i = (e = game.users) == null ? void 0 : e.get) == null ? void 0 : i.call(e, (t = H.get(n)) == null ? void 0 : t.userId)) != null && r.active || ge(n);
});
for (const e of ["minimizeApplication", "maximizeApplication", "minimizeApplicationV2", "maximizeApplicationV2"])
  Hooks.on(e, () => {
    var t;
    (t = A == null ? void 0 : A.remoteVisibilityHandler) == null || t.call(A), _.wake();
  });
