var Tt = Object.defineProperty;
var Ut = (e, t, i) => t in e ? Tt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var j = (e, t, i) => Ut(e, typeof t != "symbol" ? t + "" : t, i);
function ft(e, t) {
  return !e || !t ? !1 : !!(e.isGM || t.status !== "offline" && t.status !== "restricted");
}
function $e(e) {
  return JSON.stringify(e);
}
function _t(e, t = e) {
  const i = `${t} |`;
  return {
    log: (r, ...n) => console.log(i, r, ...n),
    warn: (r, ...n) => console.warn(i, r, ...n),
    error: (r, ...n) => console.error(i, r, ...n)
  };
}
function Pt(e, t = {}) {
  const i = t.socketName ?? `module.${e}`, r = _t(e, t.title ?? e);
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
const gt = /* @__PURE__ */ new Set(["online", "clean", "offline", "corrupted", "restricted"]), ht = /* @__PURE__ */ new Set(["live", "image"]), et = /* @__PURE__ */ new Set(["window", "picture-in-picture"]), ke = 1200, Re = 675, Bt = [
  { value: "online", label: "Online" },
  { value: "clean", label: "Clean" },
  { value: "offline", label: "Offline" },
  { value: "corrupted", label: "Corrupted" },
  { value: "restricted", label: "Restricted" }
], Vt = [
  { value: "window", label: "Window" },
  { value: "picture-in-picture", label: "Picture-in-Picture" }
], Wt = [
  { value: "live", label: "Live Canvas" },
  { value: "image", label: "Static Image" }
], H = {
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
  regionWidth: ke,
  regionHeight: Re,
  notes: ""
};
function Te(e, t, i) {
  const r = String(e ?? "").trim();
  return t.has(r) ? r : i;
}
function G(e) {
  if (e == null || e === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
function Z(e, t) {
  const i = Number(e);
  return Number.isFinite(i) && i > 0 ? i : t;
}
function yt(e) {
  return e && typeof e == "object" ? e : {};
}
function Xe(e = {}, t = {}) {
  var c;
  const i = yt(e), r = t.preserveId === !0, n = String(i.id ?? "").trim(), s = r ? n : n || ((c = t.createId) == null ? void 0 : c.call(t)) || "", o = Te(i.feedSource, ht, H.feedSource), l = Te(i.status, gt, H.status), y = Te(i.displayMode, et, H.displayMode);
  return {
    ...H,
    id: s,
    name: String(i.name ?? H.name).trim() || H.name,
    sceneId: String(i.sceneId ?? "").trim(),
    location: String(i.location ?? H.location).trim() || H.location,
    image: String(i.image ?? "").trim(),
    feedSource: o,
    status: l,
    displayMode: y,
    regionId: String(i.regionId ?? "").trim(),
    regionX: G(i.regionX),
    regionY: G(i.regionY),
    regionWidth: Z(i.regionWidth, ke),
    regionHeight: Z(i.regionHeight, Re),
    notes: String(i.notes ?? "").trim()
  };
}
function Yt(e = {}, t = {}) {
  const i = yt(e), r = Xe(i, {
    preserveId: t.requireId === !0,
    createId: t.createId
  }), n = [], s = String(i.feedSource ?? H.feedSource).trim(), o = String(i.status ?? H.status).trim(), l = String(i.displayMode ?? H.displayMode).trim();
  return t.requireId && !r.id && n.push("Camera id is required."), typeof i.name == "string" && !i.name.trim() && n.push("Camera name is required."), ht.has(s) || n.push(`Invalid feed source: ${s}`), gt.has(o) || n.push(`Invalid status: ${o}`), et.has(l) || n.push(`Invalid display mode: ${l}`), {
    ok: n.length === 0,
    camera: Xe(r, { createId: t.createId }),
    errors: n
  };
}
function vt(e) {
  return e && typeof e == "object" ? e : {};
}
function zt(e = {}) {
  const t = vt(e), i = Array.isArray(t.points) ? t.points : [];
  if (i.length >= 4) {
    const c = [], m = [];
    for (let C = 0; C < i.length; C += 2)
      c.push(Number(i[C])), m.push(Number(i[C + 1]));
    const g = Math.min(...c), f = Math.min(...m), p = Math.max(...c), S = Math.max(...m);
    if ([g, f, p, S].every(Number.isFinite))
      return {
        x: g,
        y: f,
        width: p - g,
        height: S - f
      };
  }
  const r = G(t.x) ?? 0, n = G(t.y) ?? 0, s = G(t.radiusX ?? t.radius), o = G(t.radiusY ?? t.radius);
  if (s && o)
    return {
      x: r - s,
      y: n - o,
      width: s * 2,
      height: o * 2
    };
  const l = Z(t.width, 0), y = Z(t.height, 0);
  return !l || !y ? null : { x: r, y: n, width: l, height: y };
}
function jt(e) {
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
function qe(e) {
  const t = vt(e), i = Z(t.width, ke), r = Z(t.height, Re);
  return !i || !r ? null : {
    regionX: G(t.x) ?? 0,
    regionY: G(t.y) ?? 0,
    regionWidth: i,
    regionHeight: r
  };
}
function Gt(e) {
  const t = jt(e.map(zt));
  return t ? qe(t) : null;
}
function ct(e, t) {
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
function lt(e, t) {
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
function Xt() {
  var t, i, r;
  const e = Number(((i = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : i.generation) ?? ((r = game == null ? void 0 : game.release) == null ? void 0 : r.generation));
  return Number.isFinite(e) ? e : null;
}
function qt() {
  const e = Xt();
  return e === null || e >= 13;
}
function Ht() {
  var i, r, n, s, o, l;
  const e = ((r = (i = globalThis.foundry) == null ? void 0 : i.appv1) == null ? void 0 : r.api) ?? ((n = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : n.api) ?? null, t = ((o = (s = globalThis.foundry) == null ? void 0 : s.applications) == null ? void 0 : o.api) ?? ((l = foundry == null ? void 0 : foundry.applications) == null ? void 0 : l.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function Jt(e) {
  var Le, ye, a, w;
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
    clearActiveFeed: p
  } = e, S = (ye = (Le = foundry == null ? void 0 : foundry.applications) == null ? void 0 : Le.api) == null ? void 0 : ye.ApplicationV2, C = (w = (a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.api) == null ? void 0 : w.HandlebarsApplicationMixin, F = Ht(), A = qt(), D = [".security-camera-list", ".window-content"];
  function T(u) {
    const d = c(u);
    d != null && d.querySelector && (u.monitorScroll = D.map((h) => {
      var v, b;
      return {
        selector: h,
        top: ((b = (v = d.matches) != null && v.call(d, h) ? d : d.querySelector(h)) == null ? void 0 : b.scrollTop) ?? 0
      };
    }));
  }
  function X(u, d = null) {
    var v;
    const h = c(u, d);
    if (h != null && h.querySelector)
      for (const { selector: b, top: I } of u.monitorScroll ?? []) {
        const x = (v = h.matches) != null && v.call(h, b) ? h : h.querySelector(b);
        x && (x.scrollTop = I);
      }
  }
  function _(u) {
    return typeof u == "string" && u.startsWith("blob:");
  }
  function W(u) {
    _(u == null ? void 0 : u.liveFrameObjectUrl) && typeof URL < "u" && URL.revokeObjectURL(u.liveFrameObjectUrl), u && (u.liveFrameObjectUrl = null);
  }
  function J(u, d) {
    u.lastFrameAt = Date.now(), u.frameError = !1, u.liveFrame !== d && (W(u), u.liveFrame = d, u.liveFrameObjectUrl = _(d) ? d : null);
  }
  class k extends F {
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
        return console.warn(`${t} | Monitor template render failed, using inline fallback.`, h), $(ct(d, n));
      }
    }
    activateListeners(d) {
      super.activateListeners(d), l(this, d), X(this, d);
    }
    async close(d) {
      return g() ? (f(this), super.close(d)) : this;
    }
  }
  class N extends F {
    constructor(h, v = {}) {
      super(v);
      j(this, "camera");
      j(this, "liveFrame");
      j(this, "liveFrameObjectUrl");
      j(this, "liveFrameTimer");
      this.camera = o(h), this.liveFrame = v.liveFrame ?? "", this.liveFrameObjectUrl = _(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
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
        return console.warn(`${t} | Feed template render failed, using inline fallback.`, v), $(lt({
          ...this.camera,
          liveFrame: this.liveFrame
        }, n));
      }
    }
    activateListeners(h) {
      super.activateListeners(h), y(this, h);
    }
    async updateLiveFrame(h) {
      var x, O;
      J(this, h);
      const v = c(this), b = (x = v == null ? void 0 : v.querySelector) == null ? void 0 : x.call(v, "[data-security-camera-live-frame]"), I = (O = v == null ? void 0 : v.querySelector) == null ? void 0 : O.call(v, "[data-security-camera-live-waiting]");
      if (b) {
        b.getAttribute("src") !== h && (b.src = h), b.hidden = !1, I && (I.hidden = !0);
        return;
      }
      await this.render(!0);
    }
    async close(h) {
      return m.stopLocalLiveRefresh(this), W(this), p(this), super.close(h);
    }
  }
  function L() {
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
        } catch (b) {
          console.warn(`${t} | Monitor template render failed, using inline fallback.`, b);
          const I = document.createElement("template");
          return I.innerHTML = ct(h, n).trim(), I.content;
        }
      }
      _onRender(h, v) {
        var b;
        (b = super._onRender) == null || b.call(this, h, v), l(this), X(this);
      }
      async close(h) {
        return g() ? (f(this), super.close(h)) : this;
      }
    }, j(u, "DEFAULT_OPTIONS", {
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
    }), j(u, "PARTS", {
      main: {
        template: i
      }
    }), u);
  }
  function ie() {
    var u;
    return !A || !S || !C ? null : (u = class extends C(S) {
      constructor(v, b = {}) {
        super(b);
        j(this, "camera");
        j(this, "liveFrame");
        j(this, "liveFrameObjectUrl");
        j(this, "liveFrameTimer");
        this.camera = o(v), this.liveFrame = b.liveFrame ?? "", this.liveFrameObjectUrl = _(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
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
      async _renderHTML(v, b) {
        try {
          return await super._renderHTML(v, b);
        } catch (I) {
          console.warn(`${t} | Feed template render failed, using inline fallback.`, I);
          const x = document.createElement("template");
          return x.innerHTML = lt({
            ...this.camera,
            liveFrame: this.liveFrame
          }, n).trim(), x.content;
        }
      }
      _onRender(v, b) {
        var I;
        (I = super._onRender) == null || I.call(this, v, b), y(this);
      }
      async updateLiveFrame(v) {
        var O, q;
        J(this, v);
        const b = c(this), I = (O = b == null ? void 0 : b.querySelector) == null ? void 0 : O.call(b, "[data-security-camera-live-frame]"), x = (q = b == null ? void 0 : b.querySelector) == null ? void 0 : q.call(b, "[data-security-camera-live-waiting]");
        if (I) {
          I.getAttribute("src") !== v && (I.src = v), I.hidden = !1, x && (x.hidden = !0);
          return;
        }
        await this.render(!0);
      }
      async close(v) {
        return m.stopLocalLiveRefresh(this), W(this), p(this), super.close(v);
      }
    }, j(u, "DEFAULT_OPTIONS", {
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
    }), j(u, "PARTS", {
      main: {
        template: r
      }
    }), u);
  }
  return {
    SecurityMonitor: L() ?? k,
    CameraFeed: ie() ?? N
  };
}
function Kt(e = 1e3, t = 32) {
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
function Qt(e) {
  const t = (i) => String.fromCharCode(...e.slice(i, i + 4));
  return e.length < 21 || t(0) !== "RIFF" || t(8) !== "WEBP" ? null : t(12) === "VP8X" ? !!(e[20] & 2) : t(12) === "VP8 " || t(12) === "VP8L" ? !1 : null;
}
async function Zt(e) {
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
    return Qt(s.subarray(0, o)) ?? !0;
  } catch {
    return !0;
  } finally {
    r == null || r.cancel().catch(() => {
    }), window.clearTimeout(i);
  }
}
function ei(e = 64 * 1024 * 1024, t = 3e3) {
  const i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new Map();
  let s = /* @__PURE__ */ new Set(), o = null;
  function l(m, g) {
    g.pins || (i.delete(m), g.video ? (g.media.pause(), g.media.removeAttribute("src"), g.media.load()) : g.media.src = "");
  }
  function y() {
    const m = new Set([...n.values()].flatMap((f) => [...f]));
    let g = [...i.values()].reduce((f, p) => f + p.bytes, 0);
    for (const [f, p] of [...i].sort((S, C) => S[1].usedAt - C[1].usedAt)) {
      if (p.pins || m.has(p)) continue;
      const S = Date.now() - p.usedAt >= t;
      S && p.video && p.media.pause(), (g > e || i.size > 48 || S) && (g -= p.bytes, l(f, p));
    }
    o !== null && window.clearTimeout(o), o = i.size ? window.setTimeout(y, t) : null;
  }
  function c(m) {
    let g = i.get(m);
    if (g)
      return g.usedAt = Date.now(), g;
    const f = /\.(webm|mp4|m4v|ogv|ogg)(?:[?#]|$)/i.test(m), p = f ? document.createElement("video") : new Image();
    g = { media: p, video: f, bytes: 0, usedAt: Date.now(), pins: 0, promise: null };
    const S = g;
    return S.promise = new Promise((C) => {
      let F = !1;
      const A = async (T) => {
        F || (F = !0, window.clearTimeout(D), p.onload = p.onloadeddata = p.onerror = null, T ? S.bytes = (p.naturalWidth || p.videoWidth || 0) * (p.naturalHeight || p.videoHeight || 0) * 4 : i.delete(m), !T && f && (p.pause(), p.removeAttribute("src"), p.load()), T && !f && r.set(p, await Zt(m)), C(T));
      }, D = window.setTimeout(() => A(null), 8e3);
      p.crossOrigin = "anonymous", p.onerror = () => A(null), f ? (p.muted = !0, p.loop = !0, p.playsInline = !0, p.preload = "auto", p.onloadeddata = () => A(p)) : p.onload = () => A(p), p.src = m;
    }), i.set(m, S), S;
  }
  return {
    beginFrame(m) {
      const g = /* @__PURE__ */ new Set();
      return {
        async load(f) {
          if (!f) return null;
          const p = c(f);
          return g.has(p) || (g.add(p), p.pins++), p.promise;
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
function ti(e) {
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
    subscribe(c, m, g, f = () => !0, p = !1) {
      const S = String(c.id), C = JSON.stringify(c);
      let F = t.get(S);
      if (!F)
        F = { camera: c, version: C, generation: 0, pending: !1, rerun: !1, lastStarted: -1 / 0, consumers: /* @__PURE__ */ new Map() }, t.set(S, F), y();
      else if (F.version !== C) {
        F.camera = c, F.version = C, F.generation++;
        for (const A of F.consumers.values()) A.lastFrame = void 0;
      }
      F.consumers.set(m, { deliver: g, active: f, background: p }), s(), o(F);
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
const He = {
  low: { maxDimension: 480, interval: 2500, quality: 0.65 },
  balanced: { maxDimension: 640, interval: 1500, quality: 0.7 },
  high: { maxDimension: 960, interval: 1250, quality: 0.72 }
};
function ii(e = "balanced", t = !0) {
  return { ...He[String(e)] ?? He.balanced, animateVideo: t };
}
function ri(e, t = 100) {
  const i = fe(e);
  if (!i) return null;
  const r = G(i.x), n = G(i.y);
  return !Number.isFinite(r) || !Number.isFinite(n) ? null : {
    x: r,
    y: n,
    width: Z(i.width, 1) * t,
    height: Z(i.height, 1) * t
  };
}
function fe(e) {
  if (!e) return null;
  if (e.document) return fe(e.document);
  if (typeof e.toObject == "function") {
    const t = e.toObject();
    if (t && typeof t == "object") return t;
  }
  return e._source && typeof e._source == "object" ? e._source : e;
}
function je(e, t) {
  const i = Math.max(e.x, t.x), r = Math.max(e.y, t.y), n = Math.min(e.x + e.width, t.x + t.width), s = Math.min(e.y + e.height, t.y + t.height), o = n - i, l = s - r;
  return o > 0 && l > 0 ? { x: i, y: r, width: o, height: l } : null;
}
function ni(e, t, i) {
  return {
    dx: (e.x - t.x) / t.width * i.width,
    dy: (e.y - t.y) / t.height * i.height,
    dw: e.width / t.width * i.width,
    dh: e.height / t.height * i.height
  };
}
const B = (e, t = 0) => Number.isFinite(Number(e)) ? Number(e) : t;
function ai(e) {
  if (!e) return [];
  const t = e.contents ?? (typeof e.values == "function" ? Array.from(e.values()) : e);
  return Array.isArray(t) ? t.map((i) => (i == null ? void 0 : i.document) ?? i).filter(Boolean) : [];
}
function si(e, t) {
  return [
    ...e.map((i) => ({ kind: "tile", document: i, data: fe(i) })),
    ...t.map((i) => ({ kind: "token", document: i, data: fe(i) }))
  ].filter((i) => i.data && !i.data.hidden).sort((i, r) => {
    const n = i.data, s = r.data;
    return B(n.elevation, n.overhead ? 1 : 0) - B(s.elevation, s.overhead ? 1 : 0) || (i.kind === "tile" ? 0 : 1) - (r.kind === "tile" ? 0 : 1) || B(n.sort) - B(s.sort);
  });
}
function ut(e, t, i = 13) {
  var _, W, J, k, N;
  const r = fe(e);
  if (!r || r.hidden || !(r.width > 0) || !(r.height > 0)) return null;
  let n = B(r.width), s = B(r.height);
  const o = (t == null ? void 0 : t.naturalWidth) || (t == null ? void 0 : t.videoWidth) || n, l = (t == null ? void 0 : t.naturalHeight) || (t == null ? void 0 : t.videoHeight) || s, y = ((_ = r.texture) == null ? void 0 : _.fit) ?? "fill", c = y === "cover" ? Math.max(n / o, s / l) : y === "contain" ? Math.min(n / o, s / l) : y === "width" ? n / o : y === "height" ? s / l : null;
  c !== null && (n = o * c, s = l * c);
  const m = B((W = r.texture) == null ? void 0 : W.anchorX, 0.5), g = B((J = r.texture) == null ? void 0 : J.anchorY, 0.5), f = B((k = r.texture) == null ? void 0 : k.scaleX, 1), p = B((N = r.texture) == null ? void 0 : N.scaleY, 1), S = B(r.rotation) * Math.PI / 180, C = i >= 14 ? 0 : 0.5, F = B(r.x) + B(r.width) * C, A = B(r.y) + B(r.height) * C, D = [
    [-n * m, -s * g],
    [n * (1 - m), -s * g],
    [n * (1 - m), s * (1 - g)],
    [-n * m, s * (1 - g)]
  ].map(([L, ie]) => ({
    x: F + L * f * Math.cos(S) - ie * p * Math.sin(S),
    y: A + L * f * Math.sin(S) + ie * p * Math.cos(S)
  })), T = Math.min(...D.map((L) => L.x)), X = Math.min(...D.map((L) => L.y));
  return {
    width: n,
    height: s,
    anchorX: m,
    anchorY: g,
    scaleX: f,
    scaleY: p,
    rotation: S,
    cx: F,
    cy: A,
    alpha: Math.max(0, Math.min(1, B(r.alpha, 1))),
    bounds: {
      x: T,
      y: X,
      width: Math.max(...D.map((L) => L.x)) - T,
      height: Math.max(...D.map((L) => L.y)) - X
    }
  };
}
function oi(e, t, i) {
  e.save();
  try {
    e.globalAlpha = i.alpha, e.translate(i.cx, i.cy), e.rotate(i.rotation), e.scale(i.scaleX, i.scaleY), e.drawImage(t, -i.width * i.anchorX, -i.height * i.anchorY, i.width, i.height);
  } finally {
    e.restore();
  }
}
const dt = 18;
function ci(e) {
  const t = ei(), i = Kt(1e3, 16), r = /* @__PURE__ */ new Set(), n = [], s = /* @__PURE__ */ new Set();
  let o = /* @__PURE__ */ new Set();
  const l = () => {
    var a;
    return ((a = e.getPerformance) == null ? void 0 : a.call(e)) ?? { ...He.high, animateVideo: !0 };
  };
  let y = 0;
  const c = /* @__PURE__ */ new Map(), m = (a) => `${y}:${c.get(a) ?? 0}`;
  function g(a) {
    const w = e.normalizeCamera(a);
    return w.feedSource === "live" && w.status !== "offline" && w.status !== "restricted";
  }
  function f(a = "") {
    var h, v, b, I, x;
    const w = e.getSceneById(a), d = (w == null ? void 0 : w.id) && ((h = canvas == null ? void 0 : canvas.scene) == null ? void 0 : h.id) === w.id ? canvas.dimensions : w == null ? void 0 : w.dimensions;
    return {
      x: G((d == null ? void 0 : d.sceneX) ?? ((v = d == null ? void 0 : d.sceneRect) == null ? void 0 : v.x)) ?? 0,
      y: G((d == null ? void 0 : d.sceneY) ?? ((b = d == null ? void 0 : d.sceneRect) == null ? void 0 : b.y)) ?? 0,
      width: Z(
        (d == null ? void 0 : d.sceneWidth) ?? ((I = d == null ? void 0 : d.sceneRect) == null ? void 0 : I.width) ?? (d == null ? void 0 : d.width) ?? (w == null ? void 0 : w.width),
        ke
      ),
      height: Z(
        (d == null ? void 0 : d.sceneHeight) ?? ((x = d == null ? void 0 : d.sceneRect) == null ? void 0 : x.height) ?? (d == null ? void 0 : d.height) ?? (w == null ? void 0 : w.height),
        Re
      )
    };
  }
  async function p(a, w) {
    if (!a.toBlob) return a.toDataURL("image/webp", w);
    const u = (h) => new Promise((v, b) => {
      try {
        a.toBlob(v, h, w);
      } catch (I) {
        b(I);
      }
    }), d = await u("image/webp") ?? await u("image/png");
    if (!d) throw new Error("Could not encode the camera frame.");
    return new Promise((h, v) => {
      const b = new FileReader();
      b.onload = () => h(String(b.result)), b.onerror = () => v(b.error ?? new Error("Could not read the camera frame.")), b.readAsDataURL(d);
    });
  }
  async function S(a, w, u) {
    var ve, we, be, pe, Se, Ce, Ie;
    const d = e.getSceneById(a.sceneId);
    if (!d) return "";
    const h = f(a.sceneId), v = Number.isFinite(a.regionX) && Number.isFinite(a.regionY) ? { x: a.regionX, y: a.regionY, width: a.regionWidth, height: a.regionHeight } : h, b = l(), I = Number(((we = (ve = globalThis.game) == null ? void 0 : ve.release) == null ? void 0 : we.generation) ?? 13), x = Math.min(1, b.maxDimension / v.width, b.maxDimension / v.height), O = Math.max(1, Math.round(v.width * x)), q = Math.max(1, Math.round(v.height * x)), P = n.pop() ?? document.createElement("canvas");
    P.width = O, P.height = q;
    const Y = P.getContext("2d");
    if (!Y) return "";
    const ae = t.beginFrame(o.has(a.id) ? a.id : void 0);
    let re = !1;
    const de = async (ne, Fe = !0) => {
      const K = await ae.load(ne);
      return (K == null ? void 0 : K.tagName) === "VIDEO" ? b.animateVideo && Fe && (document.visibilityState !== "hidden" || s.size > 0) ? (re = !0, K.play().catch(() => {
      })) : K.pause() : K && t.isAnimated(K) && (re = !0), K;
    };
    try {
      Y.fillStyle = String(d.backgroundColor ?? "#010505"), Y.fillRect(0, 0, O, q);
      const ne = e.getSceneBackgroundPath(a.sceneId) || a.image, Fe = await de(ne);
      if (ne && !Fe) throw new Error("Camera background could not be loaded.");
      const K = ai(d.tiles ?? ((be = d._source) == null ? void 0 : be.tiles)), nt = I >= 14 ? 0.5 : 0;
      typeof d.foreground == "string" && d.foreground && K.push({
        x: h.x + h.width * nt,
        y: h.y + h.height * nt,
        width: h.width,
        height: h.height,
        elevation: d.foregroundElevation ?? Number.MAX_SAFE_INTEGER,
        sort: -Number.MAX_SAFE_INTEGER,
        texture: { src: d.foreground }
      });
      const Nt = si(K, X(d, a)), Lt = C(d), at = () => Y.setTransform(
        O / v.width,
        0,
        0,
        q / v.height,
        -v.x * O / v.width,
        -v.y * q / v.height
      );
      at(), Fe && Y.drawImage(Fe, h.x, h.y, h.width, h.height);
      for (const Oe of Nt) {
        if (Oe.kind === "token") {
          Y.setTransform(1, 0, 0, 1, 0, 0), await T(Y, Oe.document, Oe.data, v, Lt, O, q, de);
          continue;
        }
        const se = Oe.data, ze = ut(se, void 0, I);
        if (!ze || !ze.alpha || (!((pe = se.texture) != null && pe.fit) || se.texture.fit === "fill") && !je(ze.bounds, v)) continue;
        const st = String(((Se = se.texture) == null ? void 0 : Se.src) ?? se.img ?? "");
        if (!st) continue;
        const Ae = await de(st, ((Ce = se.video) == null ? void 0 : Ce.autoplay) !== !1);
        if (!Ae) throw new Error("A camera tile could not be loaded. Check its media path and access.");
        Ae.tagName === "VIDEO" && (Ae.loop = ((Ie = se.video) == null ? void 0 : Ie.loop) !== !1);
        const ot = ut(se, Ae, I);
        je(ot.bounds, v) && (at(), oi(Y, Ae, ot));
      }
      const Ot = await p(P, b.quality);
      return u === m(a.sceneId) && (re ? r.add(w) : r.delete(w)), Ot;
    } finally {
      ae.finish(), n.length < 2 && n.push(P);
    }
  }
  function C(a) {
    var u, d, h, v, b, I;
    const w = (a == null ? void 0 : a.id) && ((u = canvas == null ? void 0 : canvas.scene) == null ? void 0 : u.id) === a.id;
    return Z(
      w ? ((d = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : d.size) ?? ((h = canvas == null ? void 0 : canvas.grid) == null ? void 0 : h.size) ?? ((v = a == null ? void 0 : a.grid) == null ? void 0 : v.size) : ((b = a == null ? void 0 : a.dimensions) == null ? void 0 : b.size) ?? ((I = a == null ? void 0 : a.grid) == null ? void 0 : I.size),
      100
    );
  }
  function F(a) {
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
      if (d != null) return D(d);
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
  function D(a) {
    return a ? (Array.isArray(a == null ? void 0 : a.contents) ? a.contents : Array.isArray(a) ? a : typeof a.values == "function" ? Array.from(a.values()) : Array.from(a ?? [])).map((u) => Array.isArray(u) ? u[1] : u).map((u) => (u == null ? void 0 : u.document) ?? u).filter(Boolean) : [];
  }
  async function T(a, w, u, d, h, v, b, I) {
    var ve, we, be, pe, Se, Ce, Ie;
    const x = ri(u, h);
    if (!x) return;
    const O = je(x, d);
    if (!O) return;
    const q = String(((ve = w.getTextureSrc) == null ? void 0 : ve.call(w)) ?? ((we = u.texture) == null ? void 0 : we.src) ?? u.img ?? ((be = w.actor) == null ? void 0 : be.img) ?? ((pe = w.baseActor) == null ? void 0 : pe.img) ?? ((Ie = (Ce = (Se = w.actor) == null ? void 0 : Se.prototypeToken) == null ? void 0 : Ce.texture) == null ? void 0 : Ie.src) ?? "").trim(), P = await I(q), { dx: Y, dy: ae, dw: re, dh: de } = ni(O, d, { width: v, height: b });
    a.save();
    try {
      if (a.globalAlpha = G(u.alpha) ?? 1, P != null && P.naturalWidth && (P != null && P.naturalHeight)) {
        const ne = _(P, x, O);
        a.drawImage(P, ne.sx, ne.sy, ne.sw, ne.sh, Y, ae, re, de);
      } else W(a, u, Y, ae, re, de);
    } finally {
      a.restore();
    }
  }
  function X(a, w) {
    var d, h;
    const u = (d = e.getRegionDocument) == null ? void 0 : d.call(e, w.regionId, w.sceneId);
    return u && ((h = canvas == null ? void 0 : canvas.scene) == null ? void 0 : h.id) === a.id && "tokens" in Object(u) ? D(u.tokens) : F(a);
  }
  function _(a, w, u) {
    const d = a.naturalWidth / w.width, h = a.naturalHeight / w.height;
    return {
      sx: Math.max(0, (u.x - w.x) * d),
      sy: Math.max(0, (u.y - w.y) * h),
      sw: Math.min(a.naturalWidth, u.width * d),
      sh: Math.min(a.naturalHeight, u.height * h)
    };
  }
  function W(a, w, u, d, h, v) {
    const b = fe(w), I = Math.max(dt, h), x = Math.max(dt, v), O = u + (h - I) / 2, q = d + (v - x) / 2, P = Math.min(I, x) / 2, Y = O + I / 2, ae = q + x / 2;
    a.beginPath(), a.arc(Y, ae, P, 0, Math.PI * 2), a.fillStyle = "rgba(10, 18, 24, 0.82)", a.fill(), a.lineWidth = Math.max(2, Math.min(I, x) * 0.08), a.strokeStyle = "rgba(72, 220, 255, 0.95)", a.stroke();
    const re = String((b == null ? void 0 : b.name) ?? (w == null ? void 0 : w.name) ?? "").trim().slice(0, 2).toUpperCase();
    re && (a.font = `700 ${Math.max(10, Math.round(P * 0.72))}px sans-serif`, a.textAlign = "center", a.textBaseline = "middle", a.fillStyle = "rgba(224, 252, 255, 0.96)", a.fillText(re, Y, ae + 0.5));
  }
  async function J(a = {}, w = {}) {
    const u = e.applyLinkedRegionBounds(e.normalizeCamera(a));
    if (!g(u)) return "";
    const d = e.getSceneById(u.sceneId), h = { ...u, sceneId: (d == null ? void 0 : d.id) ?? u.sceneId }, v = l(), b = JSON.stringify([h.sceneId, h, v]), I = m(h.sceneId), x = r.has(b) ? v.interval * 0.8 : 1 / 0, O = await i.get(b, () => S(h, b, I), x);
    return I === m(h.sceneId) ? O : "";
  }
  const k = ti({
    capture: J,
    interval: () => l().interval,
    idle: () => t.pauseVideos(),
    active(a) {
      o = a, t.retainOwners(a);
    },
    error: (a) => console.warn(`${e.moduleId} | Camera refresh failed; retrying.`, a)
  }), N = {};
  function L(a) {
    k.unsubscribe(a);
  }
  function ie(a) {
    L(a), !(!g(a == null ? void 0 : a.camera) || !e.isFrameProducer()) && k.subscribe(a.camera, a, (w) => {
      var u;
      return (u = a.updateLiveFrame) == null ? void 0 : u.call(a, w);
    }, () => {
      var u, d;
      const w = ((u = a.element) == null ? void 0 : u[0]) ?? a.element;
      return a.rendered !== !1 && !a.minimized && !a._minimized && (!w || !w.hidden && ((d = w.style) == null ? void 0 : d.display) !== "none");
    });
  }
  function Le(a) {
    k.unsubscribe(N), !(!g(a) || !e.isFrameProducer()) && k.subscribe(a, N, (w) => {
      var u;
      return (u = e.broadcastLiveFrame) == null ? void 0 : u.call(e, e.normalizeCamera(a), w);
    });
  }
  function ye(a) {
    if (a) {
      c.set(a, (c.get(a) ?? 0) + 1);
      const w = `[${JSON.stringify(a)},`;
      i.invalidate((u) => u.startsWith(w));
      for (const u of r) u.startsWith(w) && r.delete(u);
    } else
      y++, c.clear(), i.clear(), r.clear();
    k.invalidate(a);
  }
  return {
    captureLiveFrame: J,
    invalidateFrames: ye,
    reconfigure() {
      t.pauseVideos(), ye(), k.reconfigure();
    },
    wake: k.wake,
    startBroadcastLiveRefresh: Le,
    stopBroadcastLiveRefresh: () => k.unsubscribe(N),
    startLocalLiveRefresh: ie,
    stopLocalLiveRefresh: L,
    subscribeRemote(a, w, u, d) {
      !g(a) || !e.isFrameProducer() || (s.add(w), k.subscribe(a, w, u, d, !0));
    },
    unsubscribeRemote(a) {
      s.delete(a), k.unsubscribe(a);
    },
    clearRemoteViewers() {
      for (const a of s) k.unsubscribe(a);
      s.clear();
    }
  };
}
const E = "security-cameras", wt = `module.${E}`, li = `modules/${E}/templates/monitor.hbs`, di = `modules/${E}/templates/feed.hbs`;
function mi() {
  return ii(game.settings.get(E, "cameraQuality"), game.settings.get(E, "animateVideoTiles") !== !1);
}
function Je() {
  const e = Number(game.settings.get(E, "videoEffectIntensity")), t = Number.isFinite(e) ? Math.max(0, Math.min(200, e)) / 100 : 0.5, i = document.documentElement;
  i.style.setProperty("--security-camera-effect-intensity", String(t)), i.classList.toggle("security-camera-effects-disabled", t === 0), i.classList.toggle("security-camera-reduced-effects", !!game.settings.get(E, "reducedEffects"));
}
function fi(e) {
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
    onChange: Je
  }), game.settings.register(E, "videoEffectIntensity", {
    name: "Video Effect Intensity",
    hint: "Adjust static, scanlines, tint, flicker, and glitches for all viewers. Default: 50%. Use 0% to turn effects off or 100% for the original strength. Clean cameras have no effects.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 0, max: 200, step: 10 },
    default: 50,
    onChange: Je
  }), game.settings.register(E, "cameras", {
    name: "Security Cameras",
    hint: "Saved camera feeds for this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  });
}
function De() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function he(e) {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : JSON.parse(JSON.stringify(e));
}
function bt(e) {
  var i;
  if ((i = foundry == null ? void 0 : foundry.utils) != null && i.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
const pt = Pt(E, {
  socketName: wt,
  title: "Security Cameras"
});
let V = null, M = null, R = "", te = "", ge = "", Me = 0, Ue = 0, xe = !1, le = null;
const gi = 1e4, Q = /* @__PURE__ */ new Map();
function ee(e = {}, t = {}) {
  return Xe(e, { ...t, createId: De });
}
function Pe(e = {}, t = {}) {
  return Yt(e, { ...t, createId: De });
}
function hi(e) {
  var t, i;
  return e ? ((i = (t = game.scenes) == null ? void 0 : t.get(e)) == null ? void 0 : i.name) ?? "Unknown Scene" : "Unassigned Scene";
}
function St(e = "") {
  var i;
  const t = Ve(e);
  return String(((i = t == null ? void 0 : t.background) == null ? void 0 : i.src) ?? (t == null ? void 0 : t.img) ?? "").trim();
}
function yi(e = "") {
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
function Ve(e = "") {
  var t;
  return e ? ((t = game.scenes) == null ? void 0 : t.get(e)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
}
function vi(e = "") {
  var r;
  const t = Ve(e);
  return (((r = t == null ? void 0 : t.regions) == null ? void 0 : r.contents) ?? []).map((n) => ({
    id: n.id,
    name: n.name || `Region ${n.id}`,
    region: n
  })).sort((n, s) => n.name.localeCompare(s.name));
}
function Ct(e = "", t = "") {
  return [
    { id: "", name: "No Linked Region", selected: !t },
    ...vi(e).map((i) => ({
      id: i.id,
      name: i.name,
      selected: i.id === t
    }))
  ];
}
function tt(e = "", t = "") {
  var r, n;
  if (!e) return null;
  const i = Ve(t);
  return ((n = (r = i == null ? void 0 : i.regions) == null ? void 0 : r.get) == null ? void 0 : n.call(r, e)) ?? null;
}
function wi(e) {
  var o, l, y, c;
  const t = (e == null ? void 0 : e.object) ?? ((y = (l = (o = canvas == null ? void 0 : canvas.regions) == null ? void 0 : o.placeables) == null ? void 0 : l.find) == null ? void 0 : y.call(l, (m) => {
    var g;
    return ((g = m.document) == null ? void 0 : g.id) === (e == null ? void 0 : e.id);
  })), i = t == null ? void 0 : t.bounds;
  if (i != null && i.width && (i != null && i.height))
    return qe(i);
  const r = e == null ? void 0 : e.bounds;
  if (r != null && r.width && (r != null && r.height))
    return qe(r);
  const n = ((c = e == null ? void 0 : e.toObject) == null ? void 0 : c.call(e)) ?? e, s = Array.isArray(e == null ? void 0 : e.shapes) ? e.shapes : Array.isArray(n == null ? void 0 : n.shapes) ? n.shapes : [];
  return Gt(s);
}
function We(e) {
  const t = tt(e.regionId, e.sceneId), i = wi(t);
  return i ? {
    ...e,
    ...i
  } : e;
}
function Ke() {
  const e = canvas == null ? void 0 : canvas.scene;
  return ee({
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
function Ge(e, t) {
  return e.map((i) => ({
    ...i,
    selected: i.value === t
  }));
}
function _e(e = {}) {
  var y;
  const t = ee(e), i = (/* @__PURE__ */ new Date()).toLocaleString(), r = t.status === "online" || t.status === "clean", n = t.status === "offline", s = t.status === "corrupted", o = t.status === "restricted", l = t.feedSource === "live";
  return {
    ...t,
    sceneName: hi(t.sceneId),
    regionName: ((y = tt(t.regionId, t.sceneId)) == null ? void 0 : y.name) || (t.regionId ? "Region unavailable" : "No region"),
    sceneBackground: St(t.sceneId),
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
function It() {
  return Object.values(oe()).map(ee).sort((e, t) => e.name.localeCompare(t.name));
}
function z(e) {
  const t = String(e ?? "");
  if (!t) return null;
  const i = oe()[t];
  return i ? ee(i) : null;
}
async function Ne(e) {
  var i;
  const t = he(oe());
  await game.settings.set(E, "cameras", e), U.invalidateFrames();
  for (const r of Object.keys(t))
    JSON.stringify(t[r]) !== JSON.stringify(e[r]) && (Rt(r), ue({
      action: "cameraChanged",
      gmUserId: game.user.id,
      cameraId: r,
      camera: e[r] ? ee(e[r]) : null
    }), ((i = M == null ? void 0 : M.camera) == null ? void 0 : i.id) === r && (e[r] ? await Ee(e[r]) : await Be()), ge === r && (Me++, U.stopBroadcastLiveRefresh(), e[r] || (ge = "")));
  await Ni();
}
function ce(e = "manage security cameras") {
  var t, i, r;
  return (t = game.user) != null && t.isGM ? !0 : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, `Only the GM can ${e}.`), !1);
}
function ue(e) {
  return pt.emit(e);
}
async function bi(e = {}) {
  var n, s;
  if (!ce("register security cameras")) return null;
  const t = Pe(e);
  if (!t.ok)
    return (s = (n = ui.notifications) == null ? void 0 : n.error) == null || s.call(n, t.errors.join(" ")), null;
  const i = We(t.camera), r = he(oe());
  return r[i.id] = i, R = i.id, te = i.id, await Ne(r), i;
}
async function Ft(e) {
  var o, l;
  if (!ce("delete security cameras")) return !1;
  const t = String(e ?? R ?? "");
  if (!t || !z(t))
    return (l = (o = ui.notifications) == null ? void 0 : o.warn) == null || l.call(o, "Select a camera to delete."), !1;
  const i = z(t);
  if (!(typeof Dialog < "u" ? await Dialog.confirm({
    title: "Delete Security Camera",
    content: `<p>Delete camera <strong>${bt(i.name)}</strong>?</p>`,
    yes: () => !0,
    no: () => !1,
    defaultYes: !1
  }) : window.confirm(`Delete camera "${i.name}"?`))) return !1;
  const n = he(oe());
  return delete n[t], R = Object.keys(n)[0] ?? "", te = R, await Ne(n), !0;
}
async function At(e) {
  var n, s;
  if (!ce("duplicate security cameras")) return null;
  const t = z(e || R);
  if (!t)
    return (s = (n = ui.notifications) == null ? void 0 : n.warn) == null || s.call(n, "Select a camera to duplicate."), null;
  const i = ee({
    ...t,
    id: De(),
    name: `${t.name} Copy`
  }), r = he(oe());
  return r[i.id] = i, R = i.id, te = i.id, await Ne(r), i;
}
async function $t() {
  var i, r;
  if (!ce("create security cameras")) return null;
  const e = ee({
    ...Ke(),
    id: De(),
    name: "New Camera",
    location: "Unlabeled Location"
  }), t = he(oe());
  return t[e.id] = We(e), R = e.id, te = e.id, await Ne(t), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "New security camera created."), e;
}
function Mt(e) {
  const t = new FormData(e), i = String(t.get("originalId") ?? "").trim(), r = String(t.get("id") ?? "").trim() || i || De();
  return {
    originalId: i,
    camera: ee({
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
async function mt(e) {
  var o, l, y, c, m, g;
  if (!ce("save security cameras") || !(e != null && e.reportValidity())) return null;
  const { originalId: t, camera: i } = Mt(e), r = Pe(i);
  if (!r.ok)
    return (l = (o = ui.notifications) == null ? void 0 : o.error) == null || l.call(o, r.errors.join(" ")), null;
  const n = We(r.camera), s = he(oe());
  return t !== n.id && Object.hasOwn(s, n.id) ? ((c = (y = ui.notifications) == null ? void 0 : y.warn) == null || c.call(y, "That camera ID is already in use. Choose a unique ID."), null) : (t && t !== n.id && delete s[t], xe = !1, le = null, s[n.id] = n, R = n.id, te = n.id, await Ne(s), (g = (m = ui.notifications) == null ? void 0 : m.info) == null || g.call(m, "Security camera saved."), n);
}
function pi(e = R) {
  var i, r, n, s, o, l, y, c;
  const t = z(e);
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
function Ye(e, t = null) {
  var i;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (i = e.element) != null && i[0] ? e.element[0] : e.element ?? null;
}
function Si() {
  const e = It();
  !R && e.length && (R = e[0].id), te === null && (te = R);
  const t = z(R), i = le ?? (te === "" ? Ke() : z(te) ?? Ke()), r = _e(i);
  return {
    cameras: e.map((n) => ({
      ..._e(n),
      isSelected: n.id === R
    })),
    selectedCamera: t ? _e(t) : null,
    editorCamera: r,
    originalEditorId: (le == null ? void 0 : le.originalId) ?? i.id,
    sceneChoices: yi(i.sceneId),
    regionChoices: Ct(i.sceneId, i.regionId),
    feedSourceChoices: Ge(Wt, i.feedSource),
    statusChoices: Ge(Bt, i.status),
    displayModeChoices: Ge(Vt, i.displayMode),
    showStaticImageField: i.feedSource === "image",
    hasCameras: e.length > 0,
    isNewCamera: !i.id,
    editorDirty: xe
  };
}
function Ci(e) {
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
function Qe() {
  return xe ? window.confirm("Discard unsaved camera changes?") ? (xe = !1, le = null, !0) : !1 : !0;
}
function xt(e) {
  U.stopLocalLiveRefresh(e);
}
function Ii(e, t = null) {
  var l, y, c, m, g, f, p;
  const i = Ye(e, t);
  if (!i) return;
  const r = i.querySelector("[data-security-camera-form]");
  xt(e), e.camera = z(R), e.lastFrameAt = null, e.frameError = !1;
  const n = i.querySelector(".security-camera-preview-frame");
  if (((l = e.camera) == null ? void 0 : l.feedSource) === "live" && !["offline", "restricted"].includes(e.camera.status) && n) {
    n.replaceChildren();
    const S = document.createElement("img");
    S.alt = e.camera.name, S.hidden = !0, n.append(S);
    const C = document.createElement("div");
    C.className = "security-camera-placeholder", C.textContent = "Waiting for first frame", n.append(C), e.updateLiveFrame = async (F) => {
      S.getAttribute("src") !== F && (S.src = F), S.hidden = !1, C.hidden = !0, e.lastFrameAt = Date.now(), e.frameError = !1;
    }, U.startLocalLiveRefresh(e);
  }
  const s = () => {
    xe = !0;
    const S = Mt(r);
    le = { ...S.camera, originalId: S.originalId };
    const C = i.querySelector("[data-camera-dirty]");
    C && (C.hidden = !1);
  };
  r == null || r.addEventListener("input", s), r == null || r.addEventListener("change", s), (c = (y = r == null ? void 0 : r.elements) == null ? void 0 : y.sceneId) == null || c.addEventListener("change", () => {
    r.elements.regionId.replaceChildren(...Ct(r.elements.sceneId.value).map((C) => new Option(C.name, C.id)));
    for (const C of ["regionX", "regionY"]) r.elements[C].value = "";
    r.elements.regionWidth.value = ke, r.elements.regionHeight.value = Re, s();
  }), (g = (m = r == null ? void 0 : r.elements) == null ? void 0 : m.regionId) == null || g.addEventListener("change", () => {
    if (!r.elements.regionId.value)
      for (const S of ["regionX", "regionY"]) r.elements[S].value = "";
    s();
  }), r == null || r.addEventListener("submit", async (S) => {
    S.preventDefault(), await mt(r);
  });
  const o = () => {
    const S = r.elements.feedSource.value === "live";
    r.elements.sceneId.disabled = !S, r.elements.regionId.disabled = !S;
    const C = r.querySelector("[data-security-camera-static-image-field]");
    C && (C.hidden = r.elements.feedSource.value !== "image");
  };
  o(), (p = (f = r == null ? void 0 : r.elements) == null ? void 0 : f.feedSource) == null || p.addEventListener("change", o), i.querySelectorAll("[data-security-camera-id]").forEach((S) => {
    S.addEventListener("click", async (C) => {
      Qe() && (R = C.currentTarget.dataset.securityCameraId, te = R, await e.render(!0));
    });
  }), i.querySelectorAll("[data-security-camera-action]").forEach((S) => {
    S.addEventListener("click", async (C) => {
      const F = C.currentTarget.dataset.securityCameraAction;
      if (!(["new", "duplicate", "delete"].includes(F) && !Qe())) {
        if (F === "new") {
          await $t();
          return;
        }
        if (F === "duplicate") {
          await At(R);
          return;
        }
        if (F === "delete") {
          await Ft(R);
          return;
        }
        if (F === "browse-image") {
          Ci(r);
          return;
        }
        if (F === "pan-region") {
          pi(R);
          return;
        }
        if (F === "show" || F === "save-show") {
          if (F === "save-show") {
            const A = await mt(r);
            if (!A) return;
            await Ze(A.id);
            return;
          }
          await Ze(R);
          return;
        }
        if (F === "close-feed") {
          Dt();
          return;
        }
      }
    });
  });
}
function Et(e) {
  var n, s;
  const t = (e == null ? void 0 : e.camera) ?? {}, i = Te(t.displayMode, et, H.displayMode), r = Ye(e);
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
function Fi(e, t = null) {
  var s, o;
  const i = Ye(e, t);
  if (!i) return;
  Et(e), U.startLocalLiveRefresh(e), Ri(e), e.liveFrame && !e.lastFrameAt && (e.lastFrameAt = Date.now());
  const r = i.querySelector("[data-security-camera-drag]");
  (s = e.feedDragController) == null || s.abort(), r == null || r.addEventListener("pointerdown", (l) => {
    var f, p;
    if (l.button !== 0) return;
    l.preventDefault(), l.stopPropagation(), (f = e.bringToFront) == null || f.call(e);
    const y = i.getBoundingClientRect();
    (p = e.feedDragController) == null || p.abort();
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
const U = ci({
  applyLinkedRegionBounds: We,
  getRegionDocument: tt,
  getSceneBackgroundPath: St,
  getSceneById: Ve,
  isFrameProducer: () => {
    var e;
    return !!((e = game.user) != null && e.isGM);
  },
  getPerformance: mi,
  moduleId: E,
  normalizeCamera: ee
}), { SecurityMonitor: Ai, CameraFeed: $i } = Jt({
  moduleId: E,
  monitorTemplatePath: li,
  feedTemplatePath: di,
  escapeHTML: bt,
  getMonitorContext: Si,
  prepareCamera: _e,
  bindMonitorControls: Ii,
  bindFeedControls: Fi,
  getElement: Ye,
  liveFrameController: U,
  allowDiscardCameraChanges: Qe,
  clearActiveMonitor: (e) => {
    xt(e), V === e && (V = null);
  },
  clearActiveFeed: (e) => {
    var t;
    (t = e.feedDragController) == null || t.abort(), it(e), M === e && (M = null);
  }
});
async function kt() {
  var e;
  return ce("open the Security Camera Manager") ? V ? ((e = V.bringToFront) == null || e.call(V), V) : (V = new Ai(), await V.render(!0), V) : null;
}
async function Mi() {
  if (!V) return;
  await V.close();
}
async function Ee(e, t = {}) {
  const i = ee(e), r = M, n = ++Ue;
  if (M = null, r && await r.close(), n !== Ue) return null;
  const s = new $i(i, { liveFrame: t.liveFrame ?? "" });
  return M = s, await s.render(!0), n !== Ue ? (await s.close({}), null) : (Et(s), s);
}
async function Be() {
  if (Ue++, !M) return;
  const e = M;
  M = null, it(e), await e.close();
}
async function Ze(e) {
  var n, s;
  if (!ce("broadcast camera feeds")) return null;
  const t = z(e);
  if (!t)
    return (s = (n = ui.notifications) == null ? void 0 : n.warn) == null || s.call(n, "Security camera not found."), null;
  const i = ++Me;
  U.stopBroadcastLiveRefresh(), ge = t.id;
  let r = "";
  try {
    r = await U.captureLiveFrame(t, { preferDataUrl: !0 });
  } catch (o) {
    console.warn(`${E} | Initial frame unavailable.`, o);
  }
  return i !== Me || $e(z(t.id)) !== $e(t) ? null : (ue({
    action: "showFeed",
    gmUserId: game.user.id,
    camera: t,
    liveFrame: r
  }), Ee(t, { liveFrame: r }));
}
async function xi(e, t = {}) {
  var n, s, o, l, y, c;
  const i = z(e);
  if (!i)
    return (s = (n = ui.notifications) == null ? void 0 : n.warn) == null || s.call(n, "Security camera not found."), null;
  if (!rt((o = game.user) == null ? void 0 : o.id, e))
    return (y = (l = ui.notifications) == null ? void 0 : l.warn) == null || y.call(l, "You do not have access to this camera feed."), null;
  let r = String(t.liveFrame ?? "");
  if ((c = game.user) != null && c.isGM && !r)
    try {
      r = await U.captureLiveFrame(i, { preferDataUrl: !0 });
    } catch (m) {
      console.warn(`${E} | Initial frame unavailable.`, m);
    }
  return Ee(i, { liveFrame: r });
}
function Ei(e) {
  var t, i;
  ue({
    action: "requestLiveFrame",
    userId: (t = game.user) == null ? void 0 : t.id,
    cameraId: e,
    hasFrame: !!(((i = M == null ? void 0 : M.camera) == null ? void 0 : i.id) === e && M.liveFrame)
  });
}
function ki(e) {
  var t;
  return !((t = game.user) != null && t.isGM) && (e == null ? void 0 : e.feedSource) === "live" && e.status !== "offline" && e.status !== "restricted";
}
function Ri(e) {
  if (it(e), !ki(e == null ? void 0 : e.camera)) return;
  let t = !1;
  const i = () => {
    document.visibilityState !== "hidden" && !e.minimized && !e._minimized ? (Ei(e.camera.id), t = !0) : t && (ue({ action: "unsubscribeFeed", userId: game.user.id, cameraId: e.camera.id }), t = !1);
  };
  e.remoteLiveFrameTimer = window.setInterval(i, gi), e.remoteVisibilityHandler = i, document.addEventListener("visibilitychange", i), i();
}
function it(e) {
  var t, i;
  e && (e.remoteLiveFrameTimer && (window.clearInterval(e.remoteLiveFrameTimer), ue({ action: "unsubscribeFeed", userId: (t = game.user) == null ? void 0 : t.id, cameraId: (i = e.camera) == null ? void 0 : i.id })), e.remoteVisibilityHandler && document.removeEventListener("visibilitychange", e.remoteVisibilityHandler), e.remoteVisibilityHandler = null, e.remoteLiveFrameTimer = null);
}
function me(e) {
  const t = Q.get(e);
  t && window.clearTimeout(t.timer), Q.delete(e), U.unsubscribeRemote(e);
}
function Rt(e) {
  for (const [t, i] of [...Q]) i.cameraId === e && me(t);
}
function Di() {
  for (const e of [...Q.keys()]) me(e);
}
function rt(e, t) {
  var r, n;
  const i = z(t);
  return ft((n = (r = game.users) == null ? void 0 : r.get) == null ? void 0 : n.call(r, e), i);
}
function Dt() {
  ce("close player camera feeds") && (ue({
    action: "closeFeed",
    gmUserId: game.user.id
  }), Me++, ge = "", Di(), U.stopBroadcastLiveRefresh(), Be());
}
async function Ni() {
  V && await V.render(!0);
}
function Li(e, t, i) {
  const r = z(e);
  if (!r || $e(r) !== t) return;
  const n = [...Q.values()].filter((o) => {
    var l, y, c;
    return o.cameraId === e && o.revision === t && Date.now() < o.expires && ((c = (y = (l = game.users) == null ? void 0 : l.get) == null ? void 0 : y.call(l, o.userId)) == null ? void 0 : c.active) && ft(game.users.get(o.userId), r);
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
async function Oi(e) {
  var i, r, n, s, o, l, y, c, m, g, f, p, S, C, F;
  if (!e || typeof e != "object") return;
  const t = pt.isGMSender(e.gmUserId);
  if (e.action === "unsubscribeFeed") {
    (i = game.user) != null && i.isGM && me(`${String(e.userId ?? "")}:${String(e.cameraId ?? "")}`);
    return;
  }
  if (e.action === "requestLiveFrame") {
    if (!((r = game.user) != null && r.isGM)) return;
    const A = (((n = game.users) == null ? void 0 : n.contents) ?? []).filter((N) => N.isGM && N.active).sort((N, L) => N.id.localeCompare(L.id))[0];
    if (A && A.id !== game.user.id) return;
    const D = String(e.cameraId ?? ""), T = String(e.userId ?? ""), X = z(D), _ = `${T}:${D}`;
    if (!X || !((l = (o = (s = game.users) == null ? void 0 : s.get) == null ? void 0 : o.call(s, T)) != null && l.active) || X.feedSource !== "live" || !rt(T, D)) {
      me(_);
      return;
    }
    const W = Q.get(_);
    W && window.clearTimeout(W.timer);
    const J = $e(X), k = {
      userId: T,
      cameraId: D,
      revision: J,
      expires: Date.now() + 3e4,
      needsAck: !0,
      lastFrame: e.hasFrame === !0 ? (W == null ? void 0 : W.lastFrame) ?? "" : "",
      timer: window.setTimeout(() => me(_), 3e4)
    };
    Q.set(_, k), U.subscribeRemote(X, _, (N) => {
      Q.get(_) === k && Li(D, J, N);
    }, () => {
      var N, L, ie;
      return Q.get(_) === k && Date.now() < k.expires && !!((ie = (L = (N = game.users) == null ? void 0 : N.get) == null ? void 0 : L.call(N, T)) != null && ie.active);
    });
    return;
  }
  if (e.action === "cameraChanged") {
    if (!t || (y = game.user) != null && y.isGM && e.gmUserId === game.user.id) return;
    const A = e.camera ? Pe(e.camera, { requireId: !0 }) : null;
    if (e.camera && (!(A != null && A.ok) || A.camera.id !== e.cameraId)) return;
    Rt(e.cameraId), U.invalidateFrames(), ge === e.cameraId && (Me++, U.stopBroadcastLiveRefresh(), A || (ge = "")), ((c = M == null ? void 0 : M.camera) == null ? void 0 : c.id) === e.cameraId && (A ? await Ee(A.camera) : await Be());
    return;
  }
  if (e.action === "showFeed") {
    if ((m = game.user) != null && m.isGM) return;
    if (!t) {
      console.warn(`${E} | Ignoring camera feed socket message without a GM sender.`);
      return;
    }
    const A = Pe(e.camera);
    if (!A.ok) {
      console.warn(`${E} | Ignoring invalid socket camera payload.`, A.errors);
      return;
    }
    await Ee(A.camera, {
      liveFrame: typeof e.liveFrame == "string" ? e.liveFrame : ""
    });
    return;
  }
  if (e.action === "updateFeedFrame") {
    if ((g = game.user) != null && g.isGM || !t || Array.isArray(e.recipientUserIds) && !e.recipientUserIds.includes((f = game.user) == null ? void 0 : f.id)) return;
    const A = String(e.recipientUserId ?? "");
    if (A && A !== ((p = game.user) == null ? void 0 : p.id)) return;
    const D = String(e.cameraId ?? "");
    if (!D || ((S = M == null ? void 0 : M.camera) == null ? void 0 : S.id) !== D || e.revision !== $e(ee(M.camera)) || ["offline", "restricted"].includes(M.camera.status)) return;
    if (e.frameUnchanged === !0) {
      M.lastFrameAt = Date.now();
      return;
    }
    if (typeof e.liveFrame != "string" || !e.liveFrame) return;
    await ((C = M.updateLiveFrame) == null ? void 0 : C.call(M, e.liveFrame));
    return;
  }
  if (e.action === "closeFeed") {
    if ((F = game.user) != null && F.isGM || !t) return;
    await Be();
  }
}
function Ti() {
  const e = {
    openMonitor: kt,
    closeMonitor: Mi,
    showFeed: Ze,
    registerCamera: bi,
    createNewCamera: $t,
    deleteCamera: Ft,
    duplicateCamera: At,
    getCameras: It,
    getCamera: z,
    openCameraFeed: xi,
    hasCameraAccess: rt,
    closeFeed: Dt,
    get activeMonitor() {
      return V;
    },
    get activeFeed() {
      return M;
    }
  };
  game.securityCameras = e;
  const t = game.modules.get(E);
  t && (t.api = e);
}
function Ui() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: E,
    title: "Security Cameras",
    icon: "fa-solid fa-video",
    premium: !1,
    featureId: E,
    playerVisible: !1,
    description: "Manage camera feeds and broadcast surveillance views.",
    open: () => kt()
  }), !0) : !1;
}
Hooks.once("init", () => {
  fi(() => U.reconfigure());
});
Hooks.once("ready", () => {
  var e, t;
  Je(), Ti(), Ui(), (t = (e = game.socket) == null ? void 0 : e.on) == null || t.call(e, wt, (i) => {
    Oi(i).catch((r) => console.warn(`${E} | Camera message failed.`, r));
  }), console.log(`${E} | Ready. Use game.securityCameras.openMonitor()`);
});
for (const e of ["createToken", "updateToken", "deleteToken", "createTile", "updateTile", "deleteTile", "updateScene", "createRegion", "updateRegion", "deleteRegion"])
  Hooks.on(e, (t) => {
    var r;
    const i = e === "updateScene" ? t.id : (r = t.parent) == null ? void 0 : r.id;
    U.invalidateFrames(i);
  });
Hooks.on("updateActor", (e, t) => {
  var i, r;
  if (Object.keys(t).some((n) => /^(img|name|prototypeToken)(\.|$)/.test(n)))
    for (const n of ((i = game.scenes) == null ? void 0 : i.contents) ?? [])
      [...((r = n.tokens) == null ? void 0 : r.contents) ?? n.tokens ?? []].some((o) => o.actorId === e.id) && U.invalidateFrames(n.id);
});
Hooks.on("updateUser", () => {
  var e, t, i, r;
  for (const n of [...Q.keys()])
    (r = (i = (e = game.users) == null ? void 0 : e.get) == null ? void 0 : i.call(e, (t = Q.get(n)) == null ? void 0 : t.userId)) != null && r.active || me(n);
});
for (const e of ["minimizeApplication", "maximizeApplication", "minimizeApplicationV2", "maximizeApplicationV2"])
  Hooks.on(e, () => {
    var t;
    (t = M == null ? void 0 : M.remoteVisibilityHandler) == null || t.call(M), U.wake();
  });
