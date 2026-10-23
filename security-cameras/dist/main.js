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
const dt = /* @__PURE__ */ new Set(["online", "clean", "offline", "corrupted", "restricted"]), mt = /* @__PURE__ */ new Set(["live", "image"]), Qe = /* @__PURE__ */ new Set(["window", "picture-in-picture"]), xe = 1200, Ee = 675, Tt = [
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
function K(e, t) {
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
    regionWidth: K(i.regionWidth, xe),
    regionHeight: K(i.regionHeight, Ee),
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
    for (let C = 0; C < i.length; C += 2)
      c.push(Number(i[C])), m.push(Number(i[C + 1]));
    const g = Math.min(...c), f = Math.min(...m), b = Math.max(...c), S = Math.max(...m);
    if ([g, f, b, S].every(Number.isFinite))
      return {
        x: g,
        y: f,
        width: b - g,
        height: S - f
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
  const l = K(t.width, 0), y = K(t.height, 0);
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
  const t = gt(e), i = K(t.width, xe), r = K(t.height, Ee);
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
  const i = e.cameras.map((f) => `
    <button type="button" class="security-camera-list-item ${t(f.statusClass)} ${f.isSelected ? "active" : ""}" aria-pressed="${!!f.isSelected}" data-security-camera-id="${t(f.id)}">
      <i class="fa-solid fa-video security-camera-device-icon" aria-hidden="true"></i>
      <span class="security-camera-device-name" title="${t(f.name)}">${t(f.name)}</span>
      <small title="${t(f.location)}">${t(f.location)}</small>
      <span class="security-camera-device-status">${t(f.status)}</span>
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
  ` : '<section class="security-camera-monitor-preview"><div class="security-camera-empty">No camera selected.</div></section>', s = e.editorCamera, o = e.sceneChoices.map((f) => `<option value="${t(f.id)}" ${f.selected ? "selected" : ""}>${t(f.name)}</option>`).join(""), l = e.regionChoices.map((f) => `<option value="${t(f.id)}" ${f.selected ? "selected" : ""}>${t(f.name)}</option>`).join(""), y = e.feedSourceChoices.map((f) => `<option value="${t(f.value)}" ${f.selected ? "selected" : ""}>${t(f.label)}</option>`).join(""), c = e.statusChoices.map((f) => `<option value="${t(f.value)}" ${f.selected ? "selected" : ""}>${t(f.label)}</option>`).join(""), m = e.displayModeChoices.map((f) => `<option value="${t(f.value)}" ${f.selected ? "selected" : ""}>${t(f.label)}</option>`).join(""), g = `<label data-security-camera-static-image-field ${e.showStaticImageField ? "" : "hidden"}>Static Image <span class="security-camera-path-row"><input type="text" name="image" value="${t(s.image)}"><button type="button" data-security-camera-action="browse-image"><i class="fa-solid fa-folder-open" aria-hidden="true"></i> Browse</button></span></label>`;
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
        ${g}
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
  var De, ve, a, w;
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
    allowDiscardCameraChanges: g,
    clearActiveMonitor: f,
    clearActiveFeed: b
  } = e, S = (ve = (De = foundry == null ? void 0 : foundry.applications) == null ? void 0 : De.api) == null ? void 0 : ve.ApplicationV2, C = (w = (a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.api) == null ? void 0 : w.HandlebarsApplicationMixin, I = Xt(), A = zt(), O = [".security-camera-list", ".window-content"];
  function T(u) {
    const d = c(u);
    d != null && d.querySelector && (u.monitorScroll = O.map((h) => {
      var v, p;
      return {
        selector: h,
        top: ((p = (v = d.matches) != null && v.call(d, h) ? d : d.querySelector(h)) == null ? void 0 : p.scrollTop) ?? 0
      };
    }));
  }
  function j(u, d = null) {
    var v;
    const h = c(u, d);
    if (h != null && h.querySelector)
      for (const { selector: p, top: F } of u.monitorScroll ?? []) {
        const x = (v = h.matches) != null && v.call(h, p) ? h : h.querySelector(p);
        x && (x.scrollTop = F);
      }
  }
  function P(u) {
    return typeof u == "string" && u.startsWith("blob:");
  }
  function V(u) {
    P(u == null ? void 0 : u.liveFrameObjectUrl) && typeof URL < "u" && URL.revokeObjectURL(u.liveFrameObjectUrl), u && (u.liveFrameObjectUrl = null);
  }
  function H(u, d) {
    u.lastFrameAt = Date.now(), u.frameError = !1, u.liveFrame !== d && (V(u), u.liveFrame = d, u.liveFrameObjectUrl = P(d) ? d : null);
  }
  class E extends I {
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
      return T(this), s();
    }
    async _renderInner(d) {
      try {
        return await super._renderInner(d);
      } catch (h) {
        return console.warn(`${t} | Monitor template render failed, using inline fallback.`, h), $(at(d, n));
      }
    }
    activateListeners(d) {
      super.activateListeners(d), l(this, d), j(this, d);
    }
    async close(d) {
      return g() ? (f(this), super.close(d)) : this;
    }
  }
  class D extends I {
    constructor(h, v = {}) {
      super(v);
      z(this, "camera");
      z(this, "liveFrame");
      z(this, "liveFrameObjectUrl");
      z(this, "liveFrameTimer");
      this.camera = o(h), this.liveFrame = v.liveFrame ?? "", this.liveFrameObjectUrl = P(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
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
    async _renderInner(h) {
      try {
        return await super._renderInner(h);
      } catch (v) {
        return console.warn(`${t} | Feed template render failed, using inline fallback.`, v), $(st({
          ...this.camera,
          liveFrame: this.liveFrame
        }, n));
      }
    }
    activateListeners(h) {
      super.activateListeners(h), y(this, h);
    }
    async updateLiveFrame(h) {
      var x, N;
      H(this, h);
      const v = c(this), p = (x = v == null ? void 0 : v.querySelector) == null ? void 0 : x.call(v, "[data-security-camera-live-frame]"), F = (N = v == null ? void 0 : v.querySelector) == null ? void 0 : N.call(v, "[data-security-camera-live-waiting]");
      if (p) {
        p.getAttribute("src") !== h && (p.src = h), p.hidden = !1, F && (F.hidden = !0);
        return;
      }
      await this.render(!0);
    }
    async close(h) {
      return m.stopLocalLiveRefresh(this), V(this), b(this), super.close(h);
    }
  }
  function ee() {
    var u;
    return !A || !S || !C ? null : (u = class extends C(S) {
      async _prepareContext(h) {
        return T(this), {
          ...await super._prepareContext(h),
          ...s()
        };
      }
      async _renderHTML(h, v) {
        try {
          return await super._renderHTML(h, v);
        } catch (p) {
          console.warn(`${t} | Monitor template render failed, using inline fallback.`, p);
          const F = document.createElement("template");
          return F.innerHTML = at(h, n).trim(), F.content;
        }
      }
      _onRender(h, v) {
        var p;
        (p = super._onRender) == null || p.call(this, h, v), l(this), j(this);
      }
      async close(h) {
        return g() ? (f(this), super.close(h)) : this;
      }
    }, z(u, "DEFAULT_OPTIONS", {
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
    }), z(u, "PARTS", {
      main: {
        template: i
      }
    }), u);
  }
  function de() {
    var u;
    return !A || !S || !C ? null : (u = class extends C(S) {
      constructor(v, p = {}) {
        super(p);
        z(this, "camera");
        z(this, "liveFrame");
        z(this, "liveFrameObjectUrl");
        z(this, "liveFrameTimer");
        this.camera = o(v), this.liveFrame = p.liveFrame ?? "", this.liveFrameObjectUrl = P(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
      }
      async _prepareContext(v) {
        return this.camera = o(this.camera), {
          ...await super._prepareContext(v),
          camera: {
            ...this.camera,
            liveFrame: this.liveFrame,
            hasLiveFrame: !!this.liveFrame
          }
        };
      }
      async _renderHTML(v, p) {
        try {
          return await super._renderHTML(v, p);
        } catch (F) {
          console.warn(`${t} | Feed template render failed, using inline fallback.`, F);
          const x = document.createElement("template");
          return x.innerHTML = st({
            ...this.camera,
            liveFrame: this.liveFrame
          }, n).trim(), x.content;
        }
      }
      _onRender(v, p) {
        var F;
        (F = super._onRender) == null || F.call(this, v, p), y(this);
      }
      async updateLiveFrame(v) {
        var N, G;
        H(this, v);
        const p = c(this), F = (N = p == null ? void 0 : p.querySelector) == null ? void 0 : N.call(p, "[data-security-camera-live-frame]"), x = (G = p == null ? void 0 : p.querySelector) == null ? void 0 : G.call(p, "[data-security-camera-live-waiting]");
        if (F) {
          F.getAttribute("src") !== v && (F.src = v), F.hidden = !1, x && (x.hidden = !0);
          return;
        }
        await this.render(!0);
      }
      async close(v) {
        return m.stopLocalLiveRefresh(this), V(this), b(this), super.close(v);
      }
    }, z(u, "DEFAULT_OPTIONS", {
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
    }), z(u, "PARTS", {
      main: {
        template: r
      }
    }), u);
  }
  return {
    SecurityMonitor: ee() ?? E,
    CameraFeed: de() ?? D
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
  function l(m, g) {
    g.pins || (i.delete(m), g.video ? (g.media.pause(), g.media.removeAttribute("src"), g.media.load()) : g.media.src = "");
  }
  function y() {
    const m = new Set([...n.values()].flatMap((f) => [...f]));
    let g = [...i.values()].reduce((f, b) => f + b.bytes, 0);
    for (const [f, b] of [...i].sort((S, C) => S[1].usedAt - C[1].usedAt)) {
      if (b.pins || m.has(b)) continue;
      const S = Date.now() - b.usedAt >= t;
      S && b.video && b.media.pause(), (g > e || i.size > 48 || S) && (g -= b.bytes, l(f, b));
    }
    o !== null && window.clearTimeout(o), o = i.size ? window.setTimeout(y, t) : null;
  }
  function c(m) {
    let g = i.get(m);
    if (g)
      return g.usedAt = Date.now(), g;
    const f = /\.(webm|mp4|m4v|ogv|ogg)(?:[?#]|$)/i.test(m), b = f ? document.createElement("video") : new Image();
    g = { media: b, video: f, bytes: 0, usedAt: Date.now(), pins: 0, promise: null };
    const S = g;
    return S.promise = new Promise((C) => {
      let I = !1;
      const A = async (T) => {
        I || (I = !0, window.clearTimeout(O), b.onload = b.onloadeddata = b.onerror = null, T ? S.bytes = (b.naturalWidth || b.videoWidth || 0) * (b.naturalHeight || b.videoHeight || 0) * 4 : i.delete(m), !T && f && (b.pause(), b.removeAttribute("src"), b.load()), T && !f && r.set(b, await Ht(m)), C(T));
      }, O = window.setTimeout(() => A(null), 8e3);
      b.crossOrigin = "anonymous", b.onerror = () => A(null), f ? (b.muted = !0, b.loop = !0, b.playsInline = !0, b.preload = "auto", b.onloadeddata = () => A(b)) : b.onload = () => A(b), b.src = m;
    }), i.set(m, S), S;
  }
  return {
    beginFrame(m) {
      const g = /* @__PURE__ */ new Set();
      return {
        async load(f) {
          if (!f) return null;
          const b = c(f);
          return g.has(b) || (g.add(b), b.pins++), b.promise;
        },
        finish() {
          m && s.has(m) && n.set(m, new Set(g));
          for (const f of g)
            f.pins--, f.usedAt = Date.now();
          g.clear(), y();
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
      for (const f of n.keys()) m.has(f) || n.delete(f);
      const g = new Set([...n.values()].flatMap((f) => [...f]));
      for (const f of i.values()) f.video && !f.pins && !g.has(f) && f.media.pause();
    },
    clear() {
      n.clear();
      for (const [m, g] of i) l(m, g);
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
      const g = await e.capture(c.camera);
      if (!g || m !== c.generation) return;
      for (const f of [...c.consumers.values()]) {
        if (m !== c.generation) break;
        !r(f) || f.lastFrame === g || (await f.deliver(g), f.lastFrame = g);
      }
    } catch (g) {
      e.error(g);
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
    subscribe(c, m, g, f = () => !0, b = !1) {
      const S = String(c.id), C = JSON.stringify(c);
      let I = t.get(S);
      if (!I)
        I = { camera: c, version: C, generation: 0, pending: !1, rerun: !1, lastStarted: -1 / 0, consumers: /* @__PURE__ */ new Map() }, t.set(S, I), y();
      else if (I.version !== C) {
        I.camera = c, I.version = C, I.generation++;
        for (const A of I.consumers.values()) A.lastFrame = void 0;
      }
      I.consumers.set(m, { deliver: g, active: f, background: b }), s(), o(I);
    },
    unsubscribe(c) {
      for (const [m, g] of t)
        g.consumers.delete(c), g.consumers.size || (g.generation++, t.delete(m));
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
  const i = ge(e);
  if (!i) return null;
  const r = X(i.x), n = X(i.y);
  return !Number.isFinite(r) || !Number.isFinite(n) ? null : {
    x: r,
    y: n,
    width: K(i.width, 1) * t,
    height: K(i.height, 1) * t
  };
}
function ge(e) {
  if (!e) return null;
  if (e.document) return ge(e.document);
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
const U = (e, t = 0) => Number.isFinite(Number(e)) ? Number(e) : t;
function ti(e) {
  if (!e) return [];
  const t = e.contents ?? (typeof e.values == "function" ? Array.from(e.values()) : e);
  return Array.isArray(t) ? t.map((i) => (i == null ? void 0 : i.document) ?? i).filter(Boolean) : [];
}
function ii(e, t) {
  return [
    ...e.map((i) => ({ kind: "tile", document: i, data: ge(i) })),
    ...t.map((i) => ({ kind: "token", document: i, data: ge(i) }))
  ].filter((i) => i.data && !i.data.hidden).sort((i, r) => {
    const n = i.data, s = r.data;
    return U(n.elevation, n.overhead ? 1 : 0) - U(s.elevation, s.overhead ? 1 : 0) || (i.kind === "tile" ? 0 : 1) - (r.kind === "tile" ? 0 : 1) || U(n.sort) - U(s.sort);
  });
}
function ot(e, t) {
  var T, j, P, V, H;
  const i = ge(e);
  if (!i || i.hidden || !(i.width > 0) || !(i.height > 0)) return null;
  let r = U(i.width), n = U(i.height);
  const s = (t == null ? void 0 : t.naturalWidth) || (t == null ? void 0 : t.videoWidth) || r, o = (t == null ? void 0 : t.naturalHeight) || (t == null ? void 0 : t.videoHeight) || n, l = ((T = i.texture) == null ? void 0 : T.fit) ?? "fill", y = l === "cover" ? Math.max(r / s, n / o) : l === "contain" ? Math.min(r / s, n / o) : l === "width" ? r / s : l === "height" ? n / o : null;
  y !== null && (r = s * y, n = o * y);
  const c = U((j = i.texture) == null ? void 0 : j.anchorX, 0.5), m = U((P = i.texture) == null ? void 0 : P.anchorY, 0.5), g = U((V = i.texture) == null ? void 0 : V.scaleX, 1), f = U((H = i.texture) == null ? void 0 : H.scaleY, 1), b = U(i.rotation) * Math.PI / 180, S = U(i.x) + U(i.width) * U(i.anchorX, 0.5), C = U(i.y) + U(i.height) * U(i.anchorY, 0.5), I = [
    [-r * c, -n * m],
    [r * (1 - c), -n * m],
    [r * (1 - c), n * (1 - m)],
    [-r * c, n * (1 - m)]
  ].map(([E, D]) => ({
    x: S + E * g * Math.cos(b) - D * f * Math.sin(b),
    y: C + E * g * Math.sin(b) + D * f * Math.cos(b)
  })), A = Math.min(...I.map((E) => E.x)), O = Math.min(...I.map((E) => E.y));
  return {
    width: r,
    height: n,
    anchorX: c,
    anchorY: m,
    scaleX: g,
    scaleY: f,
    rotation: b,
    cx: S,
    cy: C,
    alpha: Math.max(0, Math.min(1, U(i.alpha, 1))),
    bounds: {
      x: A,
      y: O,
      width: Math.max(...I.map((E) => E.x)) - A,
      height: Math.max(...I.map((E) => E.y)) - O
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
  function g(a) {
    const w = e.normalizeCamera(a);
    return w.feedSource === "live" && w.status !== "offline" && w.status !== "restricted";
  }
  function f(a = "") {
    var h, v, p, F, x;
    const w = e.getSceneById(a), d = (w == null ? void 0 : w.id) && ((h = canvas == null ? void 0 : canvas.scene) == null ? void 0 : h.id) === w.id ? canvas.dimensions : w == null ? void 0 : w.dimensions;
    return {
      x: X((d == null ? void 0 : d.sceneX) ?? ((v = d == null ? void 0 : d.sceneRect) == null ? void 0 : v.x)) ?? 0,
      y: X((d == null ? void 0 : d.sceneY) ?? ((p = d == null ? void 0 : d.sceneRect) == null ? void 0 : p.y)) ?? 0,
      width: K(
        (d == null ? void 0 : d.sceneWidth) ?? ((F = d == null ? void 0 : d.sceneRect) == null ? void 0 : F.width) ?? (d == null ? void 0 : d.width) ?? (w == null ? void 0 : w.width),
        xe
      ),
      height: K(
        (d == null ? void 0 : d.sceneHeight) ?? ((x = d == null ? void 0 : d.sceneRect) == null ? void 0 : x.height) ?? (d == null ? void 0 : d.height) ?? (w == null ? void 0 : w.height),
        Ee
      )
    };
  }
  async function b(a, w) {
    if (!a.toBlob) return a.toDataURL("image/webp", w);
    const u = (h) => new Promise((v, p) => {
      try {
        a.toBlob(v, h, w);
      } catch (F) {
        p(F);
      }
    }), d = await u("image/webp") ?? await u("image/png");
    if (!d) throw new Error("Could not encode the camera frame.");
    return new Promise((h, v) => {
      const p = new FileReader();
      p.onload = () => h(String(p.result)), p.onerror = () => v(p.error ?? new Error("Could not read the camera frame.")), p.readAsDataURL(d);
    });
  }
  async function S(a, w, u) {
    var we, be, pe, Se, Ce;
    const d = e.getSceneById(a.sceneId);
    if (!d) return "";
    const h = f(a.sceneId), v = Number.isFinite(a.regionX) && Number.isFinite(a.regionY) ? { x: a.regionX, y: a.regionY, width: a.regionWidth, height: a.regionHeight } : h, p = l(), F = Math.min(1, p.maxDimension / v.width, p.maxDimension / v.height), x = Math.max(1, Math.round(v.width * F)), N = Math.max(1, Math.round(v.height * F)), G = n.pop() ?? document.createElement("canvas");
    G.width = x, G.height = N;
    const L = G.getContext("2d");
    if (!L) return "";
    const re = t.beginFrame(o.has(a.id) ? a.id : void 0);
    let te = !1;
    const ie = async (ce, ne = !0) => {
      const W = await re.load(ce);
      return (W == null ? void 0 : W.tagName) === "VIDEO" ? p.animateVideo && ne && (document.visibilityState !== "hidden" || s.size > 0) ? (te = !0, W.play().catch(() => {
      })) : W.pause() : W && t.isAnimated(W) && (te = !0), W;
    };
    try {
      L.fillStyle = String(d.backgroundColor ?? "#010505"), L.fillRect(0, 0, x, N);
      const ce = e.getSceneBackgroundPath(a.sceneId) || a.image, ne = await ie(ce);
      if (ce && !ne) throw new Error("Camera background could not be loaded.");
      const W = ti(d.tiles ?? ((we = d._source) == null ? void 0 : we.tiles));
      typeof d.foreground == "string" && d.foreground && W.push({
        x: h.x,
        y: h.y,
        width: h.width,
        height: h.height,
        elevation: d.foregroundElevation ?? Number.MAX_SAFE_INTEGER,
        sort: -Number.MAX_SAFE_INTEGER,
        texture: { src: d.foreground }
      });
      const me = ii(W, j(d, a)), kt = C(d), it = () => L.setTransform(
        x / v.width,
        0,
        0,
        N / v.height,
        -v.x * x / v.width,
        -v.y * N / v.height
      );
      it(), ne && L.drawImage(ne, h.x, h.y, h.width, h.height);
      for (const Le of me) {
        if (Le.kind === "token") {
          L.setTransform(1, 0, 0, 1, 0, 0), await T(L, Le.document, Le.data, v, kt, x, N, ie);
          continue;
        }
        const ae = Le.data, We = ot(ae);
        if (!We || !We.alpha || (!((be = ae.texture) != null && be.fit) || ae.texture.fit === "fill") && !Ye(We.bounds, v)) continue;
        const rt = String(((pe = ae.texture) == null ? void 0 : pe.src) ?? ae.img ?? "");
        if (!rt) continue;
        const Ie = await ie(rt, ((Se = ae.video) == null ? void 0 : Se.autoplay) !== !1);
        if (!Ie) throw new Error("A camera tile could not be loaded. Check its media path and access.");
        Ie.tagName === "VIDEO" && (Ie.loop = ((Ce = ae.video) == null ? void 0 : Ce.loop) !== !1);
        const nt = ot(ae, Ie);
        Ye(nt.bounds, v) && (it(), ri(L, Ie, nt));
      }
      const Rt = await b(G, p.quality);
      return u === m(a.sceneId) && (te ? r.add(w) : r.delete(w)), Rt;
    } finally {
      re.finish(), n.length < 2 && n.push(G);
    }
  }
  function C(a) {
    var u, d, h, v, p, F;
    const w = (a == null ? void 0 : a.id) && ((u = canvas == null ? void 0 : canvas.scene) == null ? void 0 : u.id) === a.id;
    return K(
      w ? ((d = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : d.size) ?? ((h = canvas == null ? void 0 : canvas.grid) == null ? void 0 : h.size) ?? ((v = a == null ? void 0 : a.grid) == null ? void 0 : v.size) : ((p = a == null ? void 0 : a.dimensions) == null ? void 0 : p.size) ?? ((F = a == null ? void 0 : a.grid) == null ? void 0 : F.size),
      100
    );
  }
  function I(a) {
    if (!a) return [];
    const w = [
      () => A(a, "Token"),
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
    for (const u of w) {
      const d = u();
      if (d != null) return O(d);
    }
    return [];
  }
  function A(a, w) {
    var u;
    try {
      return (u = a == null ? void 0 : a.getEmbeddedCollection) == null ? void 0 : u.call(a, w);
    } catch (d) {
      return console.warn(`${e.moduleId} | Could not read ${w} collection for inactive scene.`, d), null;
    }
  }
  function O(a) {
    return a ? (Array.isArray(a == null ? void 0 : a.contents) ? a.contents : Array.isArray(a) ? a : typeof a.values == "function" ? Array.from(a.values()) : Array.from(a ?? [])).map((u) => Array.isArray(u) ? u[1] : u).map((u) => (u == null ? void 0 : u.document) ?? u).filter(Boolean) : [];
  }
  async function T(a, w, u, d, h, v, p, F) {
    var be, pe, Se, Ce, ce, ne, W;
    const x = Zt(u, h);
    if (!x) return;
    const N = Ye(x, d);
    if (!N) return;
    const G = String(((be = w.getTextureSrc) == null ? void 0 : be.call(w)) ?? ((pe = u.texture) == null ? void 0 : pe.src) ?? u.img ?? ((Se = w.actor) == null ? void 0 : Se.img) ?? ((Ce = w.baseActor) == null ? void 0 : Ce.img) ?? ((W = (ne = (ce = w.actor) == null ? void 0 : ce.prototypeToken) == null ? void 0 : ne.texture) == null ? void 0 : W.src) ?? "").trim(), L = await F(G), { dx: re, dy: te, dw: ie, dh: we } = ei(N, d, { width: v, height: p });
    a.save();
    try {
      if (a.globalAlpha = X(u.alpha) ?? 1, L != null && L.naturalWidth && (L != null && L.naturalHeight)) {
        const me = P(L, x, N);
        a.drawImage(L, me.sx, me.sy, me.sw, me.sh, re, te, ie, we);
      } else V(a, u, re, te, ie, we);
    } finally {
      a.restore();
    }
  }
  function j(a, w) {
    var d, h;
    const u = (d = e.getRegionDocument) == null ? void 0 : d.call(e, w.regionId, w.sceneId);
    return u && ((h = canvas == null ? void 0 : canvas.scene) == null ? void 0 : h.id) === a.id && "tokens" in Object(u) ? O(u.tokens) : I(a);
  }
  function P(a, w, u) {
    const d = a.naturalWidth / w.width, h = a.naturalHeight / w.height;
    return {
      sx: Math.max(0, (u.x - w.x) * d),
      sy: Math.max(0, (u.y - w.y) * h),
      sw: Math.min(a.naturalWidth, u.width * d),
      sh: Math.min(a.naturalHeight, u.height * h)
    };
  }
  function V(a, w, u, d, h, v) {
    const p = ge(w), F = Math.max(ct, h), x = Math.max(ct, v), N = u + (h - F) / 2, G = d + (v - x) / 2, L = Math.min(F, x) / 2, re = N + F / 2, te = G + x / 2;
    a.beginPath(), a.arc(re, te, L, 0, Math.PI * 2), a.fillStyle = "rgba(10, 18, 24, 0.82)", a.fill(), a.lineWidth = Math.max(2, Math.min(F, x) * 0.08), a.strokeStyle = "rgba(72, 220, 255, 0.95)", a.stroke();
    const ie = String((p == null ? void 0 : p.name) ?? (w == null ? void 0 : w.name) ?? "").trim().slice(0, 2).toUpperCase();
    ie && (a.font = `700 ${Math.max(10, Math.round(L * 0.72))}px sans-serif`, a.textAlign = "center", a.textBaseline = "middle", a.fillStyle = "rgba(224, 252, 255, 0.96)", a.fillText(ie, re, te + 0.5));
  }
  async function H(a = {}, w = {}) {
    const u = e.applyLinkedRegionBounds(e.normalizeCamera(a));
    if (!g(u)) return "";
    const d = e.getSceneById(u.sceneId), h = { ...u, sceneId: (d == null ? void 0 : d.id) ?? u.sceneId }, v = l(), p = JSON.stringify([h.sceneId, h, v]), F = m(h.sceneId), x = r.has(p) ? v.interval * 0.8 : 1 / 0, N = await i.get(p, () => S(h, p, F), x);
    return F === m(h.sceneId) ? N : "";
  }
  const E = Kt({
    capture: H,
    interval: () => l().interval,
    idle: () => t.pauseVideos(),
    active(a) {
      o = a, t.retainOwners(a);
    },
    error: (a) => console.warn(`${e.moduleId} | Camera refresh failed; retrying.`, a)
  }), D = {};
  function ee(a) {
    E.unsubscribe(a);
  }
  function de(a) {
    ee(a), !(!g(a == null ? void 0 : a.camera) || !e.isFrameProducer()) && E.subscribe(a.camera, a, (w) => {
      var u;
      return (u = a.updateLiveFrame) == null ? void 0 : u.call(a, w);
    }, () => {
      var u, d;
      const w = ((u = a.element) == null ? void 0 : u[0]) ?? a.element;
      return a.rendered !== !1 && !a.minimized && !a._minimized && (!w || !w.hidden && ((d = w.style) == null ? void 0 : d.display) !== "none");
    });
  }
  function De(a) {
    E.unsubscribe(D), !(!g(a) || !e.isFrameProducer()) && E.subscribe(a, D, (w) => {
      var u;
      return (u = e.broadcastLiveFrame) == null ? void 0 : u.call(e, e.normalizeCamera(a), w);
    });
  }
  function ve(a) {
    if (a) {
      c.set(a, (c.get(a) ?? 0) + 1);
      const w = `[${JSON.stringify(a)},`;
      i.invalidate((u) => u.startsWith(w));
      for (const u of r) u.startsWith(w) && r.delete(u);
    } else
      y++, c.clear(), i.clear(), r.clear();
    E.invalidate(a);
  }
  return {
    captureLiveFrame: H,
    invalidateFrames: ve,
    reconfigure() {
      t.pauseVideos(), ve(), E.reconfigure();
    },
    wake: E.wake,
    startBroadcastLiveRefresh: De,
    stopBroadcastLiveRefresh: () => E.unsubscribe(D),
    startLocalLiveRefresh: de,
    stopLocalLiveRefresh: ee,
    subscribeRemote(a, w, u, d) {
      !g(a) || !e.isFrameProducer() || (s.add(w), E.subscribe(a, w, u, d, !0));
    },
    unsubscribeRemote(a) {
      s.delete(a), E.unsubscribe(a);
    },
    clearRemoteViewers() {
      for (const a of s) E.unsubscribe(a);
      s.clear();
    }
  };
}
const k = "security-cameras", ht = `module.${k}`, ai = `modules/${k}/templates/monitor.hbs`, si = `modules/${k}/templates/feed.hbs`;
function oi() {
  return Qt(game.settings.get(k, "cameraQuality"), game.settings.get(k, "animateVideoTiles") !== !1);
}
function qe() {
  const e = Number(game.settings.get(k, "videoEffectIntensity")), t = Number.isFinite(e) ? Math.max(0, Math.min(200, e)) / 100 : 0.5, i = document.documentElement;
  i.style.setProperty("--security-camera-effect-intensity", String(t)), i.classList.toggle("security-camera-effects-disabled", t === 0), i.classList.toggle("security-camera-reduced-effects", !!game.settings.get(k, "reducedEffects"));
}
function ci(e) {
  game.settings.register(k, "cameraQuality", {
    name: "Camera Quality",
    hint: "Low: 480px every 2.5 seconds. Balanced: 640px every 1.5 seconds. High: 960px every 1.25 seconds. Lower settings reduce capture and network work for everyone.",
    scope: "world",
    config: !0,
    type: String,
    default: "balanced",
    choices: { low: "Low", balanced: "Balanced", high: "High" },
    onChange: e
  }), game.settings.register(k, "animateVideoTiles", {
    name: "Animate Video Tiles",
    hint: "Play video backgrounds and tiles in live feeds. Turn this off to use still frames and reduce work on the GM's machine.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0,
    onChange: e
  }), game.settings.register(k, "reducedEffects", {
    name: "Reduced Screen Effects",
    hint: "Remove animated screen effects and image filters on this computer. Camera status and access restrictions still apply.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: qe
  }), game.settings.register(k, "videoEffectIntensity", {
    name: "Video Effect Intensity",
    hint: "Adjust static, scanlines, tint, flicker, and glitches for all viewers. Default: 50%. Use 0% to turn effects off or 100% for the original strength. Clean cameras have no effects.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 0, max: 200, step: 10 },
    default: 50,
    onChange: qe
  }), game.settings.register(k, "cameras", {
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
function ye(e) {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : JSON.parse(JSON.stringify(e));
}
function yt(e) {
  var i;
  if ((i = foundry == null ? void 0 : foundry.utils) != null && i.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
const vt = Ot(k, {
  socketName: ht,
  title: "Security Cameras"
});
let B = null, M = null, R = "", Z = "", he = "", Ae = 0, Oe = 0, $e = !1, le = null;
const li = 1e4, J = /* @__PURE__ */ new Map();
function Q(e = {}, t = {}) {
  return Xe(e, { ...t, createId: ke });
}
function Ue(e = {}, t = {}) {
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
    var g;
    return ((g = m.document) == null ? void 0 : g.id) === (e == null ? void 0 : e.id);
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
  return Q({
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
function Te(e = {}) {
  var y;
  const t = Q(e), i = (/* @__PURE__ */ new Date()).toLocaleString(), r = t.status === "online" || t.status === "clean", n = t.status === "offline", s = t.status === "corrupted", o = t.status === "restricted", l = t.feedSource === "live";
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
function se() {
  const e = game.settings.get(k, "cameras");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function pt() {
  return Object.values(se()).map(Q).sort((e, t) => e.name.localeCompare(t.name));
}
function Y(e) {
  const t = String(e ?? "");
  if (!t) return null;
  const i = se()[t];
  return i ? Q(i) : null;
}
async function Re(e) {
  var i;
  const t = ye(se());
  await game.settings.set(k, "cameras", e), _.invalidateFrames();
  for (const r of Object.keys(t))
    JSON.stringify(t[r]) !== JSON.stringify(e[r]) && (xt(r), ue({
      action: "cameraChanged",
      gmUserId: game.user.id,
      cameraId: r,
      camera: e[r] ? Q(e[r]) : null
    }), ((i = M == null ? void 0 : M.camera) == null ? void 0 : i.id) === r && (e[r] ? await Me(e[r]) : await _e()), he === r && (Ae++, _.stopBroadcastLiveRefresh(), e[r] || (he = "")));
  await Ei();
}
function oe(e = "manage security cameras") {
  var t, i, r;
  return (t = game.user) != null && t.isGM ? !0 : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, `Only the GM can ${e}.`), !1);
}
function ue(e) {
  return vt.emit(e);
}
async function hi(e = {}) {
  var n, s;
  if (!oe("register security cameras")) return null;
  const t = Ue(e);
  if (!t.ok)
    return (s = (n = ui.notifications) == null ? void 0 : n.error) == null || s.call(n, t.errors.join(" ")), null;
  const i = Be(t.camera), r = ye(se());
  return r[i.id] = i, R = i.id, Z = i.id, await Re(r), i;
}
async function St(e) {
  var o, l;
  if (!oe("delete security cameras")) return !1;
  const t = String(e ?? R ?? "");
  if (!t || !Y(t))
    return (l = (o = ui.notifications) == null ? void 0 : o.warn) == null || l.call(o, "Select a camera to delete."), !1;
  const i = Y(t);
  if (!(typeof Dialog < "u" ? await Dialog.confirm({
    title: "Delete Security Camera",
    content: `<p>Delete camera <strong>${yt(i.name)}</strong>?</p>`,
    yes: () => !0,
    no: () => !1,
    defaultYes: !1
  }) : window.confirm(`Delete camera "${i.name}"?`))) return !1;
  const n = ye(se());
  return delete n[t], R = Object.keys(n)[0] ?? "", Z = R, await Re(n), !0;
}
async function Ct(e) {
  var n, s;
  if (!oe("duplicate security cameras")) return null;
  const t = Y(e || R);
  if (!t)
    return (s = (n = ui.notifications) == null ? void 0 : n.warn) == null || s.call(n, "Select a camera to duplicate."), null;
  const i = Q({
    ...t,
    id: ke(),
    name: `${t.name} Copy`
  }), r = ye(se());
  return r[i.id] = i, R = i.id, Z = i.id, await Re(r), i;
}
async function It() {
  var i, r;
  if (!oe("create security cameras")) return null;
  const e = Q({
    ...He(),
    id: ke(),
    name: "New Camera",
    location: "Unlabeled Location"
  }), t = ye(se());
  return t[e.id] = Be(e), R = e.id, Z = e.id, await Re(t), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "New security camera created."), e;
}
function Ft(e) {
  const t = new FormData(e), i = String(t.get("originalId") ?? "").trim(), r = String(t.get("id") ?? "").trim() || i || ke();
  return {
    originalId: i,
    camera: Q({
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
  var o, l, y, c, m, g;
  if (!oe("save security cameras") || !(e != null && e.reportValidity())) return null;
  const { originalId: t, camera: i } = Ft(e), r = Ue(i);
  if (!r.ok)
    return (l = (o = ui.notifications) == null ? void 0 : o.error) == null || l.call(o, r.errors.join(" ")), null;
  const n = Be(r.camera), s = ye(se());
  return t !== n.id && Object.hasOwn(s, n.id) ? ((c = (y = ui.notifications) == null ? void 0 : y.warn) == null || c.call(y, "That camera ID is already in use. Choose a unique ID."), null) : (t && t !== n.id && delete s[t], $e = !1, le = null, s[n.id] = n, R = n.id, Z = n.id, await Re(s), (g = (m = ui.notifications) == null ? void 0 : m.info) == null || g.call(m, "Security camera saved."), n);
}
function yi(e = R) {
  var i, r, n, s, o, l, y, c;
  const t = Y(e);
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
  !R && e.length && (R = e[0].id), Z === null && (Z = R);
  const t = Y(R), i = le ?? (Z === "" ? He() : Y(Z) ?? He()), r = Te(i);
  return {
    cameras: e.map((n) => ({
      ...Te(n),
      isSelected: n.id === R
    })),
    selectedCamera: t ? Te(t) : null,
    editorCamera: r,
    originalEditorId: (le == null ? void 0 : le.originalId) ?? i.id,
    sceneChoices: mi(i.sceneId),
    regionChoices: bt(i.sceneId, i.regionId),
    feedSourceChoices: ze(_t, i.feedSource),
    statusChoices: ze(Tt, i.status),
    displayModeChoices: ze(Ut, i.displayMode),
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
  return $e ? window.confirm("Discard unsaved camera changes?") ? ($e = !1, le = null, !0) : !1 : !0;
}
function At(e) {
  _.stopLocalLiveRefresh(e);
}
function bi(e, t = null) {
  var l, y, c, m, g, f, b;
  const i = Ve(e, t);
  if (!i) return;
  const r = i.querySelector("[data-security-camera-form]");
  At(e), e.camera = Y(R), e.lastFrameAt = null, e.frameError = !1;
  const n = i.querySelector(".security-camera-preview-frame");
  if (((l = e.camera) == null ? void 0 : l.feedSource) === "live" && !["offline", "restricted"].includes(e.camera.status) && n) {
    n.replaceChildren();
    const S = document.createElement("img");
    S.alt = e.camera.name, S.hidden = !0, n.append(S);
    const C = document.createElement("div");
    C.className = "security-camera-placeholder", C.textContent = "Waiting for first frame", n.append(C), e.updateLiveFrame = async (I) => {
      S.getAttribute("src") !== I && (S.src = I), S.hidden = !1, C.hidden = !0, e.lastFrameAt = Date.now(), e.frameError = !1;
    }, _.startLocalLiveRefresh(e);
  }
  const s = () => {
    $e = !0;
    const S = Ft(r);
    le = { ...S.camera, originalId: S.originalId };
    const C = i.querySelector("[data-camera-dirty]");
    C && (C.hidden = !1);
  };
  r == null || r.addEventListener("input", s), r == null || r.addEventListener("change", s), (c = (y = r == null ? void 0 : r.elements) == null ? void 0 : y.sceneId) == null || c.addEventListener("change", () => {
    r.elements.regionId.replaceChildren(...bt(r.elements.sceneId.value).map((C) => new Option(C.name, C.id)));
    for (const C of ["regionX", "regionY"]) r.elements[C].value = "";
    r.elements.regionWidth.value = xe, r.elements.regionHeight.value = Ee, s();
  }), (g = (m = r == null ? void 0 : r.elements) == null ? void 0 : m.regionId) == null || g.addEventListener("change", () => {
    if (!r.elements.regionId.value)
      for (const S of ["regionX", "regionY"]) r.elements[S].value = "";
    s();
  }), r == null || r.addEventListener("submit", async (S) => {
    S.preventDefault(), await lt(r);
  });
  const o = () => {
    const S = r.elements.feedSource.value === "live";
    r.elements.sceneId.disabled = !S, r.elements.regionId.disabled = !S;
    const C = r.querySelector("[data-security-camera-static-image-field]");
    C && (C.hidden = r.elements.feedSource.value !== "image");
  };
  o(), (b = (f = r == null ? void 0 : r.elements) == null ? void 0 : f.feedSource) == null || b.addEventListener("change", o), i.querySelectorAll("[data-security-camera-id]").forEach((S) => {
    S.addEventListener("click", async (C) => {
      Je() && (R = C.currentTarget.dataset.securityCameraId, Z = R, await e.render(!0));
    });
  }), i.querySelectorAll("[data-security-camera-action]").forEach((S) => {
    S.addEventListener("click", async (C) => {
      const I = C.currentTarget.dataset.securityCameraAction;
      if (!(["new", "duplicate", "delete"].includes(I) && !Je())) {
        if (I === "new") {
          await It();
          return;
        }
        if (I === "duplicate") {
          await Ct(R);
          return;
        }
        if (I === "delete") {
          await St(R);
          return;
        }
        if (I === "browse-image") {
          wi(r);
          return;
        }
        if (I === "pan-region") {
          yi(R);
          return;
        }
        if (I === "show" || I === "save-show") {
          if (I === "save-show") {
            const A = await lt(r);
            if (!A) return;
            await Ke(A.id);
            return;
          }
          await Ke(R);
          return;
        }
        if (I === "close-feed") {
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
    const g = Math.round(m + 190);
    c += 48, (n = e.setPosition) == null || n.call(e, {
      left: Math.max(12, window.innerWidth - c - 24),
      top: Math.max(12, window.innerHeight - g - 84),
      width: Math.round(c),
      height: g
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
    var f, b;
    if (l.button !== 0) return;
    l.preventDefault(), l.stopPropagation(), (f = e.bringToFront) == null || f.call(e);
    const y = i.getBoundingClientRect();
    (b = e.feedDragController) == null || b.abort();
    const c = e.feedDragController = new AbortController(), m = { pointerId: l.pointerId, x: l.clientX, y: l.clientY, left: y.left, top: y.top };
    document.addEventListener("pointermove", (S) => {
      S.pointerId === m.pointerId && n(m.left + S.clientX - m.x, m.top + S.clientY - m.y);
    }, { signal: c.signal });
    const g = (S) => {
      S.pointerId === m.pointerId && c.abort();
    };
    document.addEventListener("pointerup", g, { signal: c.signal }), document.addEventListener("pointercancel", g, { signal: c.signal });
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
  moduleId: k,
  normalizeCamera: Q
}), { SecurityMonitor: Si, CameraFeed: Ci } = jt({
  moduleId: k,
  monitorTemplatePath: ai,
  feedTemplatePath: si,
  escapeHTML: yt,
  getMonitorContext: vi,
  prepareCamera: Te,
  bindMonitorControls: bi,
  bindFeedControls: pi,
  getElement: Ve,
  liveFrameController: _,
  allowDiscardCameraChanges: Je,
  clearActiveMonitor: (e) => {
    At(e), B === e && (B = null);
  },
  clearActiveFeed: (e) => {
    var t;
    (t = e.feedDragController) == null || t.abort(), et(e), M === e && (M = null);
  }
});
async function Mt() {
  var e;
  return oe("open the Security Camera Manager") ? B ? ((e = B.bringToFront) == null || e.call(B), B) : (B = new Si(), await B.render(!0), B) : null;
}
async function Ii() {
  if (!B) return;
  await B.close();
}
async function Me(e, t = {}) {
  const i = Q(e), r = M, n = ++Oe;
  if (M = null, r && await r.close(), n !== Oe) return null;
  const s = new Ci(i, { liveFrame: t.liveFrame ?? "" });
  return M = s, await s.render(!0), n !== Oe ? (await s.close({}), null) : ($t(s), s);
}
async function _e() {
  if (Oe++, !M) return;
  const e = M;
  M = null, et(e), await e.close();
}
async function Ke(e) {
  var n, s;
  if (!oe("broadcast camera feeds")) return null;
  const t = Y(e);
  if (!t)
    return (s = (n = ui.notifications) == null ? void 0 : n.warn) == null || s.call(n, "Security camera not found."), null;
  const i = ++Ae;
  _.stopBroadcastLiveRefresh(), he = t.id;
  let r = "";
  try {
    r = await _.captureLiveFrame(t, { preferDataUrl: !0 });
  } catch (o) {
    console.warn(`${k} | Initial frame unavailable.`, o);
  }
  return i !== Ae || Fe(Y(t.id)) !== Fe(t) ? null : (ue({
    action: "showFeed",
    gmUserId: game.user.id,
    camera: t,
    liveFrame: r
  }), Me(t, { liveFrame: r }));
}
async function Fi(e, t = {}) {
  var n, s, o, l, y, c;
  const i = Y(e);
  if (!i)
    return (s = (n = ui.notifications) == null ? void 0 : n.warn) == null || s.call(n, "Security camera not found."), null;
  if (!tt((o = game.user) == null ? void 0 : o.id, e))
    return (y = (l = ui.notifications) == null ? void 0 : l.warn) == null || y.call(l, "You do not have access to this camera feed."), null;
  let r = String(t.liveFrame ?? "");
  if ((c = game.user) != null && c.isGM && !r)
    try {
      r = await _.captureLiveFrame(i, { preferDataUrl: !0 });
    } catch (m) {
      console.warn(`${k} | Initial frame unavailable.`, m);
    }
  return Me(i, { liveFrame: r });
}
function Ai(e) {
  var t, i;
  ue({
    action: "requestLiveFrame",
    userId: (t = game.user) == null ? void 0 : t.id,
    cameraId: e,
    hasFrame: !!(((i = M == null ? void 0 : M.camera) == null ? void 0 : i.id) === e && M.liveFrame)
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
    document.visibilityState !== "hidden" && !e.minimized && !e._minimized ? (Ai(e.camera.id), t = !0) : t && (ue({ action: "unsubscribeFeed", userId: game.user.id, cameraId: e.camera.id }), t = !1);
  };
  e.remoteLiveFrameTimer = window.setInterval(i, li), e.remoteVisibilityHandler = i, document.addEventListener("visibilitychange", i), i();
}
function et(e) {
  var t, i;
  e && (e.remoteLiveFrameTimer && (window.clearInterval(e.remoteLiveFrameTimer), ue({ action: "unsubscribeFeed", userId: (t = game.user) == null ? void 0 : t.id, cameraId: (i = e.camera) == null ? void 0 : i.id })), e.remoteVisibilityHandler && document.removeEventListener("visibilitychange", e.remoteVisibilityHandler), e.remoteVisibilityHandler = null, e.remoteLiveFrameTimer = null);
}
function fe(e) {
  const t = J.get(e);
  t && window.clearTimeout(t.timer), J.delete(e), _.unsubscribeRemote(e);
}
function xt(e) {
  for (const [t, i] of [...J]) i.cameraId === e && fe(t);
}
function xi() {
  for (const e of [...J.keys()]) fe(e);
}
function tt(e, t) {
  var r, n;
  const i = Y(t);
  return ut((n = (r = game.users) == null ? void 0 : r.get) == null ? void 0 : n.call(r, e), i);
}
function Et() {
  oe("close player camera feeds") && (ue({
    action: "closeFeed",
    gmUserId: game.user.id
  }), Ae++, he = "", xi(), _.stopBroadcastLiveRefresh(), _e());
}
async function Ei() {
  B && await B.render(!0);
}
function ki(e, t, i) {
  const r = Y(e);
  if (!r || Fe(r) !== t) return;
  const n = [...J.values()].filter((o) => {
    var l, y, c;
    return o.cameraId === e && o.revision === t && Date.now() < o.expires && ((c = (y = (l = game.users) == null ? void 0 : l.get) == null ? void 0 : y.call(l, o.userId)) == null ? void 0 : c.active) && ut(game.users.get(o.userId), r);
  }), s = (o, l) => {
    if (!o.length) return;
    const y = o.map((c) => c.userId);
    ue({
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
  var i, r, n, s, o, l, y, c, m, g, f, b, S, C, I;
  if (!e || typeof e != "object") return;
  const t = vt.isGMSender(e.gmUserId);
  if (e.action === "unsubscribeFeed") {
    (i = game.user) != null && i.isGM && fe(`${String(e.userId ?? "")}:${String(e.cameraId ?? "")}`);
    return;
  }
  if (e.action === "requestLiveFrame") {
    if (!((r = game.user) != null && r.isGM)) return;
    const A = (((n = game.users) == null ? void 0 : n.contents) ?? []).filter((D) => D.isGM && D.active).sort((D, ee) => D.id.localeCompare(ee.id))[0];
    if (A && A.id !== game.user.id) return;
    const O = String(e.cameraId ?? ""), T = String(e.userId ?? ""), j = Y(O), P = `${T}:${O}`;
    if (!j || !((l = (o = (s = game.users) == null ? void 0 : s.get) == null ? void 0 : o.call(s, T)) != null && l.active) || j.feedSource !== "live" || !tt(T, O)) {
      fe(P);
      return;
    }
    const V = J.get(P);
    V && window.clearTimeout(V.timer);
    const H = Fe(j), E = {
      userId: T,
      cameraId: O,
      revision: H,
      expires: Date.now() + 3e4,
      needsAck: !0,
      lastFrame: e.hasFrame === !0 ? (V == null ? void 0 : V.lastFrame) ?? "" : "",
      timer: window.setTimeout(() => fe(P), 3e4)
    };
    J.set(P, E), _.subscribeRemote(j, P, (D) => {
      J.get(P) === E && ki(O, H, D);
    }, () => {
      var D, ee, de;
      return J.get(P) === E && Date.now() < E.expires && !!((de = (ee = (D = game.users) == null ? void 0 : D.get) == null ? void 0 : ee.call(D, T)) != null && de.active);
    });
    return;
  }
  if (e.action === "cameraChanged") {
    if (!t || (y = game.user) != null && y.isGM && e.gmUserId === game.user.id) return;
    const A = e.camera ? Ue(e.camera, { requireId: !0 }) : null;
    if (e.camera && (!(A != null && A.ok) || A.camera.id !== e.cameraId)) return;
    xt(e.cameraId), _.invalidateFrames(), he === e.cameraId && (Ae++, _.stopBroadcastLiveRefresh(), A || (he = "")), ((c = M == null ? void 0 : M.camera) == null ? void 0 : c.id) === e.cameraId && (A ? await Me(A.camera) : await _e());
    return;
  }
  if (e.action === "showFeed") {
    if ((m = game.user) != null && m.isGM) return;
    if (!t) {
      console.warn(`${k} | Ignoring camera feed socket message without a GM sender.`);
      return;
    }
    const A = Ue(e.camera);
    if (!A.ok) {
      console.warn(`${k} | Ignoring invalid socket camera payload.`, A.errors);
      return;
    }
    await Me(A.camera, {
      liveFrame: typeof e.liveFrame == "string" ? e.liveFrame : ""
    });
    return;
  }
  if (e.action === "updateFeedFrame") {
    if ((g = game.user) != null && g.isGM || !t || Array.isArray(e.recipientUserIds) && !e.recipientUserIds.includes((f = game.user) == null ? void 0 : f.id)) return;
    const A = String(e.recipientUserId ?? "");
    if (A && A !== ((b = game.user) == null ? void 0 : b.id)) return;
    const O = String(e.cameraId ?? "");
    if (!O || ((S = M == null ? void 0 : M.camera) == null ? void 0 : S.id) !== O || e.revision !== Fe(Q(M.camera)) || ["offline", "restricted"].includes(M.camera.status)) return;
    if (e.frameUnchanged === !0) {
      M.lastFrameAt = Date.now();
      return;
    }
    if (typeof e.liveFrame != "string" || !e.liveFrame) return;
    await ((C = M.updateLiveFrame) == null ? void 0 : C.call(M, e.liveFrame));
    return;
  }
  if (e.action === "closeFeed") {
    if ((I = game.user) != null && I.isGM || !t) return;
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
    getCamera: Y,
    openCameraFeed: Fi,
    hasCameraAccess: tt,
    closeFeed: Et,
    get activeMonitor() {
      return B;
    },
    get activeFeed() {
      return M;
    }
  };
  game.securityCameras = e;
  const t = game.modules.get(k);
  t && (t.api = e);
}
function Li() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: k,
    title: "Security Cameras",
    icon: "fa-solid fa-video",
    premium: !1,
    featureId: k,
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
    Ri(i).catch((r) => console.warn(`${k} | Camera message failed.`, r));
  }), console.log(`${k} | Ready. Use game.securityCameras.openMonitor()`);
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
  for (const n of [...J.keys()])
    (r = (i = (e = game.users) == null ? void 0 : e.get) == null ? void 0 : i.call(e, (t = J.get(n)) == null ? void 0 : t.userId)) != null && r.active || fe(n);
});
for (const e of ["minimizeApplication", "maximizeApplication", "minimizeApplicationV2", "maximizeApplicationV2"])
  Hooks.on(e, () => {
    var t;
    (t = M == null ? void 0 : M.remoteVisibilityHandler) == null || t.call(M), _.wake();
  });
