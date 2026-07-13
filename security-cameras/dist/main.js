var ot = Object.defineProperty;
var st = (e, t, r) => t in e ? ot(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var U = (e, t, r) => st(e, typeof t != "symbol" ? t + "" : t, r);
function ct(e, t = e) {
  const r = `${t} |`;
  return {
    log: (n, ...a) => console.log(r, n, ...a),
    warn: (n, ...a) => console.warn(r, n, ...a),
    error: (n, ...a) => console.error(r, n, ...a)
  };
}
function lt(e, t = {}) {
  const r = t.socketName ?? `module.${e}`, n = ct(e, t.title ?? e);
  return {
    socketName: r,
    emit(a) {
      var l;
      const c = (l = globalThis.game) == null ? void 0 : l.socket;
      return c != null && c.emit ? (c.emit(r, a), !0) : (n.warn("Foundry socket is unavailable.", a), !1);
    },
    isGMSender(a) {
      var c, l, m;
      return a ? !!((m = (l = (c = globalThis.game) == null ? void 0 : c.users) == null ? void 0 : l.get(String(a))) != null && m.isGM) : !1;
    }
  };
}
const Xe = /* @__PURE__ */ new Set(["online", "offline", "corrupted", "restricted"]), je = /* @__PURE__ */ new Set(["live", "image"]), Me = /* @__PURE__ */ new Set(["window", "picture-in-picture"]), me = 1200, fe = 675, ut = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "corrupted", label: "Corrupted" },
  { value: "restricted", label: "Restricted" }
], dt = [
  { value: "window", label: "Window" },
  { value: "picture-in-picture", label: "Picture-in-Picture" }
], mt = [
  { value: "live", label: "Live Canvas" },
  { value: "image", label: "Static Image" }
], P = {
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
  regionWidth: me,
  regionHeight: fe,
  notes: ""
};
function le(e, t, r) {
  const n = String(e ?? "").trim();
  return t.has(n) ? n : r;
}
function E(e) {
  if (e == null || e === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
function T(e, t) {
  const r = Number(e);
  return Number.isFinite(r) && r > 0 ? r : t;
}
function Ge(e) {
  return e && typeof e == "object" ? e : {};
}
function Ce(e = {}, t = {}) {
  var p;
  const r = Ge(e), n = t.preserveId === !0, a = String(r.id ?? "").trim(), c = n ? a : a || ((p = t.createId) == null ? void 0 : p.call(t)) || "", l = le(r.feedSource, je, P.feedSource), m = le(r.status, Xe, P.status), y = le(r.displayMode, Me, P.displayMode);
  return {
    ...P,
    id: c,
    name: String(r.name ?? P.name).trim() || P.name,
    sceneId: String(r.sceneId ?? "").trim(),
    location: String(r.location ?? P.location).trim() || P.location,
    image: String(r.image ?? "").trim(),
    feedSource: l,
    status: m,
    displayMode: y,
    regionId: String(r.regionId ?? "").trim(),
    regionX: E(r.regionX),
    regionY: E(r.regionY),
    regionWidth: T(r.regionWidth, me),
    regionHeight: T(r.regionHeight, fe),
    notes: String(r.notes ?? "").trim()
  };
}
function ft(e = {}, t = {}) {
  const r = Ge(e), n = Ce(r, {
    preserveId: t.requireId === !0,
    createId: t.createId
  }), a = [], c = String(r.feedSource ?? P.feedSource).trim(), l = String(r.status ?? P.status).trim(), m = String(r.displayMode ?? P.displayMode).trim();
  return t.requireId && !n.id && a.push("Camera id is required."), typeof r.name == "string" && !r.name.trim() && a.push("Camera name is required."), je.has(c) || a.push(`Invalid feed source: ${c}`), Xe.has(l) || a.push(`Invalid status: ${l}`), Me.has(m) || a.push(`Invalid display mode: ${m}`), {
    ok: a.length === 0,
    camera: Ce(n, { createId: t.createId }),
    errors: a
  };
}
function Ve(e) {
  return e && typeof e == "object" ? e : {};
}
function ht(e = {}) {
  const t = Ve(e), r = Array.isArray(t.points) ? t.points : [];
  if (r.length >= 4) {
    const p = [], I = [];
    for (let G = 0; G < r.length; G += 2)
      p.push(Number(r[G])), I.push(Number(r[G + 1]));
    const A = Math.min(...p), v = Math.min(...I), X = Math.max(...p), j = Math.max(...I);
    if ([A, v, X, j].every(Number.isFinite))
      return {
        x: A,
        y: v,
        width: X - A,
        height: j - v
      };
  }
  const n = E(t.x) ?? 0, a = E(t.y) ?? 0, c = E(t.radiusX ?? t.radius), l = E(t.radiusY ?? t.radius);
  if (c && l)
    return {
      x: n - c,
      y: a - l,
      width: c * 2,
      height: l * 2
    };
  const m = T(t.width, 0), y = T(t.height, 0);
  return !m || !y ? null : { x: n, y: a, width: m, height: y };
}
function gt(e) {
  const t = e.filter((l) => !!l);
  if (!t.length) return null;
  const r = Math.min(...t.map((l) => l.x)), n = Math.min(...t.map((l) => l.y)), a = Math.max(...t.map((l) => l.x + l.width)), c = Math.max(...t.map((l) => l.y + l.height));
  return {
    x: r,
    y: n,
    width: a - r,
    height: c - n
  };
}
function Ie(e) {
  const t = Ve(e), r = T(t.width, me), n = T(t.height, fe);
  return !r || !n ? null : {
    regionX: E(t.x) ?? 0,
    regionY: E(t.y) ?? 0,
    regionWidth: r,
    regionHeight: n
  };
}
function yt(e) {
  const t = gt(e.map(ht));
  return t ? Ie(t) : null;
}
function Pe(e, t) {
  const r = e.cameras.map((v) => `
    <button type="button" class="security-camera-list-item ${v.isSelected ? "active" : ""}" data-security-camera-id="${t(v.id)}">
      <span>${t(v.name)}</span>
      <small>${t(v.location)}</small>
      <i>${t(v.status)}</i>
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
  ` : '<section class="security-camera-monitor-preview"><div class="security-camera-empty">No camera selected.</div></section>', c = e.editorCamera, l = e.sceneChoices.map((v) => `<option value="${t(v.id)}" ${v.selected ? "selected" : ""}>${t(v.name)}</option>`).join(""), m = e.regionChoices.map((v) => `<option value="${t(v.id)}" ${v.selected ? "selected" : ""}>${t(v.name)}</option>`).join(""), y = e.feedSourceChoices.map((v) => `<option value="${t(v.value)}" ${v.selected ? "selected" : ""}>${t(v.label)}</option>`).join(""), p = e.statusChoices.map((v) => `<option value="${t(v.value)}" ${v.selected ? "selected" : ""}>${t(v.label)}</option>`).join(""), I = e.displayModeChoices.map((v) => `<option value="${t(v.value)}" ${v.selected ? "selected" : ""}>${t(v.label)}</option>`).join(""), A = `<label data-security-camera-static-image-field ${e.showStaticImageField ? "" : "hidden"}>Static Image <span class="security-camera-path-row"><input type="text" name="image" value="${t(c.image)}"><button type="button" data-security-camera-action="browse-image">Browse</button></span></label>`;
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
      ${a}
      <form class="security-camera-editor" data-security-camera-form>
        <header><span class="security-camera-kicker">Manager</span><h2>${e.isNewCamera ? "ADDING Camera" : "Edit Camera"}</h2></header>
        <input type="hidden" name="originalId" value="${t(c.id)}">
        <label>ID <input type="text" name="id" value="${t(c.id)}" placeholder="auto-generated"></label>
        <label>Name <input type="text" name="name" value="${t(c.name)}" required></label>
        <label>Scene <select name="sceneId">${l}</select></label>
        <label>Scene Region <select name="regionId">${m}</select></label>
        <label>Location <input type="text" name="location" value="${t(c.location)}"></label>
        <label>Feed Source <select name="feedSource">${y}</select></label>
        ${A}
        <label>Status <select name="status">${p}</select></label>
        <label>Display Mode <select name="displayMode">${I}</select></label>
        <input type="hidden" name="regionX" value="${t(c.regionX ?? "")}">
        <input type="hidden" name="regionY" value="${t(c.regionY ?? "")}">
        <input type="hidden" name="regionWidth" value="${t(c.regionWidth ?? "")}">
        <input type="hidden" name="regionHeight" value="${t(c.regionHeight ?? "")}">
        <label>Notes <textarea name="notes" rows="4">${t(c.notes)}</textarea></label>
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
function _e(e, t) {
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
function vt() {
  var t, r, n;
  const e = Number(((r = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : r.generation) ?? ((n = game == null ? void 0 : game.release) == null ? void 0 : n.generation));
  return Number.isFinite(e) ? e : null;
}
function wt() {
  const e = vt();
  return e === null || e >= 13;
}
function pt() {
  var r, n, a, c, l, m;
  const e = ((n = (r = globalThis.foundry) == null ? void 0 : r.appv1) == null ? void 0 : n.api) ?? ((a = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : a.api) ?? null, t = ((l = (c = globalThis.foundry) == null ? void 0 : c.applications) == null ? void 0 : l.api) ?? ((m = foundry == null ? void 0 : foundry.applications) == null ? void 0 : m.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function bt(e) {
  var te, ce, re, V;
  const {
    moduleId: t,
    monitorTemplatePath: r,
    feedTemplatePath: n,
    escapeHTML: a,
    getMonitorContext: c,
    prepareCamera: l,
    bindMonitorControls: m,
    bindFeedControls: y,
    getElement: p,
    liveFrameController: I,
    clearActiveMonitor: A,
    clearActiveFeed: v
  } = e, X = (ce = (te = foundry == null ? void 0 : foundry.applications) == null ? void 0 : te.api) == null ? void 0 : ce.ApplicationV2, j = (V = (re = foundry == null ? void 0 : foundry.applications) == null ? void 0 : re.api) == null ? void 0 : V.HandlebarsApplicationMixin, G = pt(), oe = wt();
  function J(F) {
    return typeof F == "string" && F.startsWith("blob:");
  }
  function ee(F) {
    J(F == null ? void 0 : F.liveFrameObjectUrl) && typeof URL < "u" && URL.revokeObjectURL(F.liveFrameObjectUrl), F && (F.liveFrameObjectUrl = null);
  }
  function se(F, R) {
    F.liveFrame !== R && (ee(F), F.liveFrame = R, F.liveFrameObjectUrl = J(R) ? R : null);
  }
  class ve extends G {
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
      return c();
    }
    async _renderInner(R) {
      try {
        return await super._renderInner(R);
      } catch (C) {
        return console.warn(`${t} | Monitor template render failed, using inline fallback.`, C), $(Pe(R, a));
      }
    }
    activateListeners(R) {
      super.activateListeners(R), m(this, R);
    }
    async close(R) {
      return A(this), super.close(R);
    }
  }
  class we extends G {
    constructor(C, w = {}) {
      super(w);
      U(this, "camera");
      U(this, "liveFrame");
      U(this, "liveFrameObjectUrl");
      U(this, "liveFrameTimer");
      this.camera = l(C), this.liveFrame = w.liveFrame ?? "", this.liveFrameObjectUrl = J(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
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
      return this.camera = l(this.camera), {
        camera: {
          ...this.camera,
          liveFrame: this.liveFrame,
          hasLiveFrame: !!this.liveFrame
        }
      };
    }
    async _renderInner(C) {
      try {
        return await super._renderInner(C);
      } catch (w) {
        return console.warn(`${t} | Feed template render failed, using inline fallback.`, w), $(_e({
          ...this.camera,
          liveFrame: this.liveFrame
        }, a));
      }
    }
    activateListeners(C) {
      super.activateListeners(C), y(this, C);
    }
    async updateLiveFrame(C) {
      var o, s;
      se(this, C);
      const w = p(this), S = (o = w == null ? void 0 : w.querySelector) == null ? void 0 : o.call(w, "[data-security-camera-live-frame]"), i = (s = w == null ? void 0 : w.querySelector) == null ? void 0 : s.call(w, "[data-security-camera-live-waiting]");
      if (S) {
        S.src = C, S.hidden = !1, i && (i.hidden = !0);
        return;
      }
      await this.render(!0);
    }
    async close(C) {
      return I.stopLocalLiveRefresh(this), ee(this), v(this), super.close(C);
    }
  }
  function pe() {
    var F;
    return !oe || !X || !j ? null : (F = class extends j(X) {
      async _prepareContext(C) {
        return {
          ...await super._prepareContext(C),
          ...c()
        };
      }
      async _renderHTML(C, w) {
        try {
          return await super._renderHTML(C, w);
        } catch (S) {
          console.warn(`${t} | Monitor template render failed, using inline fallback.`, S);
          const i = document.createElement("template");
          return i.innerHTML = Pe(C, a).trim(), i.content;
        }
      }
      _onRender(C, w) {
        var S;
        (S = super._onRender) == null || S.call(this, C, w), m(this);
      }
      async close(C) {
        return A(this), super.close(C);
      }
    }, U(F, "DEFAULT_OPTIONS", {
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
    }), U(F, "PARTS", {
      main: {
        template: r
      }
    }), F);
  }
  function be() {
    var F;
    return !oe || !X || !j ? null : (F = class extends j(X) {
      constructor(w, S = {}) {
        super(S);
        U(this, "camera");
        U(this, "liveFrame");
        U(this, "liveFrameObjectUrl");
        U(this, "liveFrameTimer");
        this.camera = l(w), this.liveFrame = S.liveFrame ?? "", this.liveFrameObjectUrl = J(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
      }
      async _prepareContext(w) {
        return this.camera = l(this.camera), {
          ...await super._prepareContext(w),
          camera: {
            ...this.camera,
            liveFrame: this.liveFrame,
            hasLiveFrame: !!this.liveFrame
          }
        };
      }
      async _renderHTML(w, S) {
        try {
          return await super._renderHTML(w, S);
        } catch (i) {
          console.warn(`${t} | Feed template render failed, using inline fallback.`, i);
          const o = document.createElement("template");
          return o.innerHTML = _e({
            ...this.camera,
            liveFrame: this.liveFrame
          }, a).trim(), o.content;
        }
      }
      _onRender(w, S) {
        var i;
        (i = super._onRender) == null || i.call(this, w, S), y(this);
      }
      async updateLiveFrame(w) {
        var s, u;
        se(this, w);
        const S = p(this), i = (s = S == null ? void 0 : S.querySelector) == null ? void 0 : s.call(S, "[data-security-camera-live-frame]"), o = (u = S == null ? void 0 : S.querySelector) == null ? void 0 : u.call(S, "[data-security-camera-live-waiting]");
        if (i) {
          i.src = w, i.hidden = !1, o && (o.hidden = !0);
          return;
        }
        await this.render(!0);
      }
      async close(w) {
        return I.stopLocalLiveRefresh(this), ee(this), v(this), super.close(w);
      }
    }, U(F, "DEFAULT_OPTIONS", {
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
    }), U(F, "PARTS", {
      main: {
        template: n
      }
    }), F);
  }
  return {
    SecurityMonitor: pe() ?? ve,
    CameraFeed: be() ?? we
  };
}
function De(e) {
  return Number.isFinite(e.regionX) && Number.isFinite(e.regionY);
}
function de(e) {
  return {
    sx: 0,
    sy: 0,
    sw: e.width,
    sh: e.height
  };
}
function Ft(e, t, r, n) {
  if (!De(t)) return de(e);
  if (r != null && r.width && r.height && e.width >= r.width * 0.75 && e.height >= r.height * 0.75) {
    const a = e.width / r.width, c = e.height / r.height;
    return {
      sx: (t.regionX ?? 0) * a,
      sy: (t.regionY ?? 0) * c,
      sw: t.regionWidth * a,
      sh: t.regionHeight * c
    };
  }
  return (n == null ? void 0 : n(t)) ?? de(e);
}
function Te(e, t) {
  const r = Math.max(0, Math.min(t.width - 1, Math.round(e.sx))), n = Math.max(0, Math.min(t.height - 1, Math.round(e.sy))), a = Math.max(1, Math.min(t.width - r, Math.round(e.sw))), c = Math.max(1, Math.min(t.height - n, Math.round(e.sh)));
  return { sx: r, sy: n, sw: a, sh: c };
}
function St(e, t, r) {
  if (!De(t)) return de(e);
  const n = e.width / r.width, a = e.height / r.height;
  return {
    sx: ((t.regionX ?? 0) - r.x) * n,
    sy: ((t.regionY ?? 0) - r.y) * a,
    sw: t.regionWidth * n,
    sh: t.regionHeight * a
  };
}
function We(e, t) {
  const r = Math.min(1, t / e.sw);
  return {
    width: Math.max(1, Math.round(e.sw * r)),
    height: Math.max(1, Math.round(e.sh * r))
  };
}
function Ct(e, t = 100) {
  const r = Q(e);
  if (!r) return null;
  const n = E(r.x), a = E(r.y);
  return !Number.isFinite(n) || !Number.isFinite(a) ? null : {
    x: n,
    y: a,
    width: T(r.width, 1) * t,
    height: T(r.height, 1) * t
  };
}
function Q(e) {
  if (!e) return null;
  if (e.document) return Q(e.document);
  if (typeof e.toObject == "function") {
    const t = e.toObject();
    if (t && typeof t == "object") return t;
  }
  return e._source && typeof e._source == "object" ? e._source : e;
}
function Fe(e, t) {
  return e.x < t.x + t.width && e.x + e.width > t.x && e.y < t.y + t.height && e.y + e.height > t.y;
}
function It(e, t, r) {
  return {
    dx: (e.x - t.x) / t.width * r.width,
    dy: (e.y - t.y) / t.height * r.height,
    dw: e.width / t.width * r.width,
    dh: e.height / t.height * r.height
  };
}
const Be = 1250, ke = 960, $t = 0.62, Mt = 0.72, Ye = 18;
function At(e) {
  const t = /* @__PURE__ */ new Map();
  let r = null;
  function n(i) {
    const o = e.normalizeCamera(i);
    return o.feedSource === "live" && o.status !== "offline" && o.status !== "restricted";
  }
  function a(i) {
    var o, s;
    return !(!(canvas != null && canvas.ready) || !((o = canvas == null ? void 0 : canvas.app) != null && o.renderer) || i.sceneId && ((s = canvas.scene) == null ? void 0 : s.id) !== i.sceneId);
  }
  function c() {
    var s, u, d, f, h;
    const i = (s = canvas == null ? void 0 : canvas.app) == null ? void 0 : s.renderer, o = [
      (u = canvas == null ? void 0 : canvas.app) == null ? void 0 : u.stage,
      canvas == null ? void 0 : canvas.stage
    ].filter(Boolean);
    try {
      for (const g of o) {
        const b = (f = (d = i == null ? void 0 : i.extract) == null ? void 0 : d.canvas) == null ? void 0 : f.call(d, g);
        if (b != null && b.width && (b != null && b.height)) return b;
      }
    } catch (g) {
      console.warn(`${e.moduleId} | PIXI canvas extraction failed, using renderer view fallback.`, g);
    }
    return (i == null ? void 0 : i.view) ?? ((h = canvas == null ? void 0 : canvas.app) == null ? void 0 : h.view) ?? null;
  }
  function l(i, o) {
    var h, g, b, N;
    const s = e.applyLinkedRegionBounds(e.normalizeCamera(o)), u = ((h = canvas.dimensions) == null ? void 0 : h.width) ?? ((g = canvas.scene) == null ? void 0 : g.width) ?? 0, d = ((b = canvas.dimensions) == null ? void 0 : b.height) ?? ((N = canvas.scene) == null ? void 0 : N.height) ?? 0;
    return Ft(i, s, u && d ? { width: u, height: d } : null, () => {
      var _, z;
      if ((z = (_ = canvas.stage) == null ? void 0 : _.worldTransform) != null && z.apply && typeof PIXI < "u") {
        const W = canvas.stage.worldTransform.apply(new PIXI.Point(s.regionX, s.regionY)), q = canvas.stage.worldTransform.apply(new PIXI.Point(s.regionX + s.regionWidth, s.regionY + s.regionHeight));
        return {
          sx: W.x,
          sy: W.y,
          sw: q.x - W.x,
          sh: q.y - W.y
        };
      }
      return null;
    });
  }
  function m(i = "") {
    var d, f, h, g, b;
    const o = e.getSceneById(i), u = (o == null ? void 0 : o.id) && ((d = canvas == null ? void 0 : canvas.scene) == null ? void 0 : d.id) === o.id ? canvas.dimensions : o == null ? void 0 : o.dimensions;
    return {
      x: E((u == null ? void 0 : u.sceneX) ?? ((f = u == null ? void 0 : u.sceneRect) == null ? void 0 : f.x)) ?? 0,
      y: E((u == null ? void 0 : u.sceneY) ?? ((h = u == null ? void 0 : u.sceneRect) == null ? void 0 : h.y)) ?? 0,
      width: T(
        (u == null ? void 0 : u.sceneWidth) ?? ((g = u == null ? void 0 : u.sceneRect) == null ? void 0 : g.width) ?? (u == null ? void 0 : u.width) ?? (o == null ? void 0 : o.width),
        me
      ),
      height: T(
        (u == null ? void 0 : u.sceneHeight) ?? ((b = u == null ? void 0 : u.sceneRect) == null ? void 0 : b.height) ?? (u == null ? void 0 : u.height) ?? (o == null ? void 0 : o.height),
        fe
      )
    };
  }
  function y(i, o) {
    const s = e.applyLinkedRegionBounds(e.normalizeCamera(o));
    if (!Number.isFinite(s.regionX) || !Number.isFinite(s.regionY))
      return de({ width: i.naturalWidth, height: i.naturalHeight });
    const u = m(s.sceneId);
    return St({ width: i.naturalWidth, height: i.naturalHeight }, s, u);
  }
  function p(i) {
    if (!i) return Promise.resolve(null);
    if (t.has(i)) return t.get(i);
    const o = new Promise((s) => {
      const u = (h) => s(h), d = () => {
        const h = new Image();
        h.onload = () => u(h), h.onerror = () => u(null), h.src = i;
      }, f = new Image();
      f.crossOrigin = "anonymous", f.onload = () => u(f), f.onerror = d, f.src = i;
    });
    return t.set(i, o), o;
  }
  function I(i, o, s) {
    try {
      return i.toDataURL(o, s);
    } catch (u) {
      {
        console.warn(`${e.moduleId} | ${o} canvas encode failed, using PNG fallback.`, u);
        try {
          return i.toDataURL("image/png");
        } catch (d) {
          return console.warn(`${e.moduleId} | PNG canvas encode failed.`, d), "";
        }
      }
      return console.warn(`${e.moduleId} | PNG canvas encode failed.`, u), "";
    }
  }
  function A(i, o, s, u = {}) {
    return u.preferDataUrl || !i.toBlob || typeof URL > "u" || !URL.createObjectURL ? Promise.resolve(I(i, o, s)) : new Promise((d) => {
      try {
        i.toBlob((f) => {
          if (f) {
            d(URL.createObjectURL(f));
            return;
          }
          d(I(i, o, s));
        }, o, s);
      } catch (f) {
        console.warn(`${e.moduleId} | ${o} canvas blob encode failed, using data URL fallback.`, f), d(I(i, o, s));
      }
    });
  }
  async function v(i = {}, o = {}) {
    const u = e.getSceneBackgroundPath(i.sceneId) || i.image, d = await p(u);
    if (!(d != null && d.naturalWidth) || !(d != null && d.naturalHeight)) return "";
    const f = Te(y(d, i), {
      width: d.naturalWidth,
      height: d.naturalHeight
    }), { width: h, height: g } = We(f, ke), b = document.createElement("canvas");
    b.width = h, b.height = g;
    const N = b.getContext("2d");
    return N == null || N.drawImage(d, f.sx, f.sy, f.sw, f.sh, 0, 0, h, g), await se(N, i, h, g), A(b, "image/webp", Mt, o);
  }
  function X(i) {
    var s, u, d, f, h, g;
    const o = (i == null ? void 0 : i.id) && ((s = canvas == null ? void 0 : canvas.scene) == null ? void 0 : s.id) === i.id;
    return T(
      o ? ((u = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : u.size) ?? ((d = canvas == null ? void 0 : canvas.grid) == null ? void 0 : d.size) ?? ((f = i == null ? void 0 : i.grid) == null ? void 0 : f.size) : ((h = i == null ? void 0 : i.dimensions) == null ? void 0 : h.size) ?? ((g = i == null ? void 0 : i.grid) == null ? void 0 : g.size),
      100
    );
  }
  function j(i) {
    var s, u, d, f, h;
    if (!i) return [];
    if (i.id && ((s = canvas == null ? void 0 : canvas.scene) == null ? void 0 : s.id) === i.id)
      return (((u = canvas.tokens) == null ? void 0 : u.placeables) ?? []).map((g) => g == null ? void 0 : g.document).filter(Boolean);
    const o = [
      G(i, "Token"),
      i.tokens,
      (d = i.getEmbeddedDocuments) == null ? void 0 : d.call(i, "Token"),
      (f = i.toObject) == null ? void 0 : f.call(i).tokens,
      (h = i._source) == null ? void 0 : h.tokens
    ];
    for (const g of o) {
      const b = oe(g);
      if (b.length) return b;
    }
    return [];
  }
  function G(i, o) {
    var s;
    try {
      return (s = i == null ? void 0 : i.getEmbeddedCollection) == null ? void 0 : s.call(i, o);
    } catch (u) {
      return console.warn(`${e.moduleId} | Could not read ${o} collection for inactive scene.`, u), null;
    }
  }
  function oe(i) {
    return i ? (Array.isArray(i == null ? void 0 : i.contents) ? i.contents : Array.isArray(i) ? i : typeof i.values == "function" ? Array.from(i.values()) : Array.from(i ?? [])).map((s) => Array.isArray(s) ? s[1] : s).map((s) => (s == null ? void 0 : s.document) ?? s).filter(Boolean) : [];
  }
  function J(i) {
    const o = Q(i);
    return !(!o || o.hidden);
  }
  function ee(i) {
    var s, u, d, f, h, g, b, N;
    const o = Q(i);
    return String(
      ((s = i == null ? void 0 : i.getTextureSrc) == null ? void 0 : s.call(i)) ?? ((u = o == null ? void 0 : o.texture) == null ? void 0 : u.src) ?? (o == null ? void 0 : o.img) ?? ((d = i == null ? void 0 : i.texture) == null ? void 0 : d.src) ?? ((f = i == null ? void 0 : i.actor) == null ? void 0 : f.img) ?? ((h = i == null ? void 0 : i.baseActor) == null ? void 0 : h.img) ?? ((N = (b = (g = i == null ? void 0 : i.actor) == null ? void 0 : g.prototypeToken) == null ? void 0 : b.texture) == null ? void 0 : N.src) ?? ""
    ).trim();
  }
  async function se(i, o, s, u) {
    var N;
    if (!i) return;
    const d = e.getSceneById(o.sceneId);
    if (!d) return;
    const f = e.applyLinkedRegionBounds(e.normalizeCamera(o)), h = {
      x: f.regionX,
      y: f.regionY,
      width: f.regionWidth,
      height: f.regionHeight
    };
    if (![h.x, h.y, h.width, h.height].every(Number.isFinite)) return;
    const g = X(d), b = m(f.sceneId);
    for (const _ of j(d)) {
      if (!J(_)) continue;
      const z = Ct(_, g), W = ve(z, h, b);
      if (!W) continue;
      const q = ee(_), B = await p(q), { dx: Le, dy: Ne, dw: Oe, dh: Ue } = It(W, h, { width: s, height: u });
      i.save(), i.globalAlpha = E(_.alpha) ?? E((N = Q(_)) == null ? void 0 : N.alpha) ?? 1, B != null && B.naturalWidth && (B != null && B.naturalHeight) ? i.drawImage(B, Le, Ne, Oe, Ue) : we(i, _, Le, Ne, Oe, Ue), i.restore();
    }
  }
  function ve(i, o, s) {
    if (!i) return null;
    if (Fe(i, o)) return i;
    const u = E(s == null ? void 0 : s.x) ?? 0, d = E(s == null ? void 0 : s.y) ?? 0;
    if (!u && !d) return null;
    const f = {
      ...i,
      x: i.x - u,
      y: i.y - d
    };
    if (Fe(f, o)) return f;
    const h = {
      ...i,
      x: i.x + u,
      y: i.y + d
    };
    return Fe(h, o) ? h : null;
  }
  function we(i, o, s, u, d, f) {
    const h = Q(o), g = Math.max(Ye, d), b = Math.max(Ye, f), N = s + (d - g) / 2, _ = u + (f - b) / 2, z = Math.min(g, b) / 2, W = N + g / 2, q = _ + b / 2;
    i.beginPath(), i.arc(W, q, z, 0, Math.PI * 2), i.fillStyle = "rgba(10, 18, 24, 0.82)", i.fill(), i.lineWidth = Math.max(2, Math.min(g, b) * 0.08), i.strokeStyle = "rgba(72, 220, 255, 0.95)", i.stroke();
    const B = String((h == null ? void 0 : h.name) ?? (o == null ? void 0 : o.name) ?? "").trim().slice(0, 2).toUpperCase();
    B && (i.font = `700 ${Math.max(10, Math.round(z * 0.72))}px sans-serif`, i.textAlign = "center", i.textBaseline = "middle", i.fillStyle = "rgba(224, 252, 255, 0.96)", i.fillText(B, W, q + 0.5));
  }
  function pe(i) {
    const o = i.getContext("2d", { willReadFrequently: !0 });
    if (!o) return !1;
    const s = Math.min(48, i.width), u = Math.min(48, i.height), d = o.getImageData(0, 0, s, u).data;
    let f = 0;
    const h = d.length / 4;
    for (let g = 0; g < d.length; g += 4)
      f += d[g] + d[g + 1] + d[g + 2];
    return f / (h * 3) < 3;
  }
  async function be(i = {}, o = {}) {
    const s = c();
    if (!(s != null && s.width) || !(s != null && s.height)) return "";
    const u = Te(l(s, i), s), { width: d, height: f } = We(u, ke), h = document.createElement("canvas");
    h.width = d, h.height = f;
    const g = h.getContext("2d");
    return g == null || g.drawImage(s, u.sx, u.sy, u.sw, u.sh, 0, 0, d, f), pe(h) ? "" : A(h, "image/webp", $t, o);
  }
  async function te(i = {}, o = {}) {
    let s = await v(i, o);
    return !s && a(i) && (s = await be(i, o)), s;
  }
  async function ce(i, o = {}) {
    var u, d;
    if (!n(i == null ? void 0 : i.camera)) return;
    const s = await te(i.camera, {
      preferDataUrl: !!e.broadcastLiveFrame
    });
    s && re(i, o) && (await ((u = i.updateLiveFrame) == null ? void 0 : u.call(i, s)), o.broadcast !== !1 && ((d = e.broadcastLiveFrame) == null || d.call(e, e.normalizeCamera(i.camera), s)));
  }
  function re(i, o = {}) {
    return !(document.visibilityState === "hidden" || o.requireRendered && (i == null ? void 0 : i.rendered) === !1);
  }
  function V(i, o = {}) {
    !re(i, o) || i != null && i.liveFrameRefreshPending || (i.liveFrameRefreshPending = !0, ce(i, o).finally(() => {
      i.liveFrameRefreshPending = !1;
    }));
  }
  function F(i) {
    i && (i.liveFrameTimer && window.clearInterval(i.liveFrameTimer), i.liveFrameVisibilityHandler && document.removeEventListener("visibilitychange", i.liveFrameVisibilityHandler), i.liveFrameTimer = null, i.liveFrameVisibilityHandler = null, i.liveFrameRefreshPending = !1);
  }
  function R(i) {
    C(i), n(i == null ? void 0 : i.camera) && e.isFrameProducer() && (i.liveFrameVisibilityHandler = () => V(i, {
      broadcast: !1,
      requireRendered: !0
    }), document.addEventListener("visibilitychange", i.liveFrameVisibilityHandler), V(i, {
      broadcast: !1,
      requireRendered: !0
    }), i.liveFrameTimer = window.setInterval(() => {
      V(i, {
        broadcast: !1,
        requireRendered: !0
      });
    }, Be));
  }
  function C(i) {
    F(i);
  }
  function w(i) {
    S(), n(i) && e.isFrameProducer() && (r = {
      camera: e.normalizeCamera(i),
      liveFrameRefreshPending: !1,
      liveFrameTimer: null,
      liveFrameVisibilityHandler: null
    }, r.liveFrameVisibilityHandler = () => V(r), document.addEventListener("visibilitychange", r.liveFrameVisibilityHandler), V(r), r.liveFrameTimer = window.setInterval(() => {
      V(r);
    }, Be));
  }
  function S() {
    F(r), r = null;
  }
  return {
    captureLiveFrame: te,
    startBroadcastLiveRefresh: w,
    startLocalLiveRefresh: R,
    stopBroadcastLiveRefresh: S,
    stopLocalLiveRefresh: C
  };
}
const O = "security-cameras", He = `module.${O}`, Rt = `modules/${O}/templates/monitor.hbs`, xt = `modules/${O}/templates/feed.hbs`;
function ie() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function ne(e) {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : JSON.parse(JSON.stringify(e));
}
function ze(e) {
  var r;
  if ((r = foundry == null ? void 0 : foundry.utils) != null && r.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
const qe = lt(O, {
  socketName: He,
  title: "Security Cameras"
});
let x = null, L = null, M = "", k = "";
function D(e = {}, t = {}) {
  return Ce(e, { ...t, createId: ie });
}
function Ae(e = {}, t = {}) {
  return ft(e, { ...t, createId: ie });
}
function Et(e) {
  var t, r;
  return e ? ((r = (t = game.scenes) == null ? void 0 : t.get(e)) == null ? void 0 : r.name) ?? "Unknown Scene" : "Unassigned Scene";
}
function Ke(e = "") {
  var r;
  const t = he(e);
  return String(((r = t == null ? void 0 : t.background) == null ? void 0 : r.src) ?? (t == null ? void 0 : t.img) ?? (t == null ? void 0 : t.thumb) ?? "").trim();
}
function Lt(e = "") {
  var r;
  const t = (((r = game.scenes) == null ? void 0 : r.contents) ?? []).map((n) => ({
    id: n.id,
    name: n.name,
    selected: n.id === e
  })).sort((n, a) => n.name.localeCompare(a.name));
  return [
    { id: "", name: "Unassigned Scene", selected: !e },
    ...t
  ];
}
function he(e = "") {
  var t;
  return e ? ((t = game.scenes) == null ? void 0 : t.get(e)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
}
function Nt(e = "") {
  var n;
  const t = he(e);
  return (((n = t == null ? void 0 : t.regions) == null ? void 0 : n.contents) ?? []).map((a) => ({
    id: a.id,
    name: a.name || `Region ${a.id}`,
    region: a
  })).sort((a, c) => a.name.localeCompare(c.name));
}
function Ot(e = "", t = "") {
  return [
    { id: "", name: "No Linked Region", selected: !t },
    ...Nt(e).map((r) => ({
      id: r.id,
      name: r.name,
      selected: r.id === t
    }))
  ];
}
function Ut(e = "", t = "") {
  var n, a;
  if (!e) return null;
  const r = he(t);
  return ((a = (n = r == null ? void 0 : r.regions) == null ? void 0 : n.get) == null ? void 0 : a.call(n, e)) ?? null;
}
function Pt(e) {
  var l, m, y, p;
  const t = (e == null ? void 0 : e.object) ?? ((y = (m = (l = canvas == null ? void 0 : canvas.regions) == null ? void 0 : l.placeables) == null ? void 0 : m.find) == null ? void 0 : y.call(m, (I) => {
    var A;
    return ((A = I.document) == null ? void 0 : A.id) === (e == null ? void 0 : e.id);
  })), r = t == null ? void 0 : t.bounds;
  if (r != null && r.width && (r != null && r.height))
    return Ie(r);
  const n = e == null ? void 0 : e.bounds;
  if (n != null && n.width && (n != null && n.height))
    return Ie(n);
  const a = ((p = e == null ? void 0 : e.toObject) == null ? void 0 : p.call(e)) ?? e, c = Array.isArray(e == null ? void 0 : e.shapes) ? e.shapes : Array.isArray(a == null ? void 0 : a.shapes) ? a.shapes : [];
  return yt(c);
}
function ge(e) {
  const t = Ut(e.regionId, e.sceneId), r = Pt(t);
  return r ? {
    ...e,
    ...r
  } : e;
}
function $e() {
  const e = canvas == null ? void 0 : canvas.scene;
  return D({
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
function Se(e, t) {
  return e.map((r) => ({
    ...r,
    selected: r.value === t
  }));
}
function ue(e = {}) {
  const t = D(e), r = (/* @__PURE__ */ new Date()).toLocaleString(), n = t.status === "online", a = t.status === "offline", c = t.status === "corrupted", l = t.status === "restricted", m = t.feedSource === "live";
  return {
    ...t,
    sceneName: Et(t.sceneId),
    sceneBackground: Ke(t.sceneId),
    regionAspect: t.regionWidth && t.regionHeight ? `${t.regionWidth} / ${t.regionHeight}` : "16 / 9",
    timestamp: r,
    signalLabel: n ? "SIGNAL LOCK" : c ? "SIGNAL CORRUPTED" : l ? "ACCESS DENIED" : "NO SIGNAL",
    isOnline: n,
    isOffline: a,
    isCorrupted: c,
    isRestricted: l,
    isLive: m,
    isImage: !m,
    hasRegion: Number.isFinite(t.regionX) && Number.isFinite(t.regionY),
    canDisplayImage: !!(t.image && !m && !a && !l),
    canUseImageFallback: !!(t.image && m && !a && !l),
    statusClass: `security-camera-status-${t.status}`,
    sourceClass: `security-camera-source-${t.feedSource}`,
    displayClass: `security-camera-display-${t.displayMode}`
  };
}
function K() {
  const e = game.settings.get(O, "cameras");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function Je() {
  return Object.values(K()).map(D).sort((e, t) => e.name.localeCompare(t.name));
}
function Y(e) {
  const t = String(e ?? "");
  if (!t) return null;
  const r = K()[t];
  return r ? D(r) : null;
}
async function ae(e) {
  await game.settings.set(O, "cameras", e), await zt();
}
function H(e = "manage security cameras") {
  var t, r, n;
  return (t = game.user) != null && t.isGM ? !0 : ((n = (r = ui.notifications) == null ? void 0 : r.warn) == null || n.call(r, `Only the GM can ${e}.`), !1);
}
function Re(e) {
  return qe.emit(e);
}
async function _t(e = {}) {
  var a, c;
  if (!H("register security cameras")) return null;
  const t = Ae(e);
  if (!t.ok)
    return (c = (a = ui.notifications) == null ? void 0 : a.error) == null || c.call(a, t.errors.join(" ")), null;
  const r = ge(t.camera), n = ne(K());
  return n[r.id] = r, M = r.id, k = r.id, await ae(n), r;
}
async function Qe(e) {
  var l, m;
  if (!H("delete security cameras")) return !1;
  const t = String(e ?? M ?? "");
  if (!t || !Y(t))
    return (m = (l = ui.notifications) == null ? void 0 : l.warn) == null || m.call(l, "Select a camera to delete."), !1;
  const r = Y(t);
  if (!(typeof Dialog < "u" ? await Dialog.confirm({
    title: "Delete Security Camera",
    content: `<p>Delete camera <strong>${ze(r.name)}</strong>?</p>`,
    yes: () => !0,
    no: () => !1,
    defaultYes: !1
  }) : window.confirm(`Delete camera "${r.name}"?`))) return !1;
  const a = ne(K());
  return delete a[t], M = Object.keys(a)[0] ?? "", k = M, await ae(a), !0;
}
async function Ze(e) {
  var a, c;
  if (!H("duplicate security cameras")) return null;
  const t = Y(e || M);
  if (!t)
    return (c = (a = ui.notifications) == null ? void 0 : a.warn) == null || c.call(a, "Select a camera to duplicate."), null;
  const r = D({
    ...t,
    id: ie(),
    name: `${t.name} Copy`
  }), n = ne(K());
  return n[r.id] = r, M = r.id, k = r.id, await ae(n), r;
}
async function et() {
  var r, n;
  if (!H("create security cameras")) return null;
  const e = D({
    ...$e(),
    id: ie(),
    name: "New Camera",
    location: "Unlabeled Location"
  }), t = ne(K());
  return t[e.id] = ge(e), M = e.id, k = e.id, await ae(t), (n = (r = ui.notifications) == null ? void 0 : r.info) == null || n.call(r, "New security camera created."), e;
}
function Tt(e) {
  const t = new FormData(e), r = String(t.get("originalId") ?? "").trim(), n = String(t.get("id") ?? "").trim() || r || ie();
  return {
    originalId: r,
    camera: D({
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
async function Wt(e) {
  var l, m, y, p;
  if (!H("save security cameras")) return null;
  const { originalId: t, camera: r } = Tt(e), n = Ae(r);
  if (!n.ok)
    return (m = (l = ui.notifications) == null ? void 0 : l.error) == null || m.call(l, n.errors.join(" ")), null;
  const a = ge(n.camera), c = ne(K());
  return t && t !== a.id && delete c[t], c[a.id] = a, M = a.id, k = a.id, await ae(c), (p = (y = ui.notifications) == null ? void 0 : y.info) == null || p.call(y, "Security camera saved."), a;
}
function Bt(e = M) {
  var r, n, a, c, l, m, y, p;
  const t = Y(e);
  if (!Number.isFinite(t == null ? void 0 : t.regionX) || !Number.isFinite(t == null ? void 0 : t.regionY)) {
    (n = (r = ui.notifications) == null ? void 0 : r.warn) == null || n.call(r, "This camera does not have a region yet.");
    return;
  }
  if (t.sceneId && ((a = canvas.scene) == null ? void 0 : a.id) !== t.sceneId) {
    (l = (c = ui.notifications) == null ? void 0 : c.warn) == null || l.call(c, "Activate the camera's scene before panning to its region.");
    return;
  }
  (p = canvas.animatePan) == null || p.call(canvas, {
    x: t.regionX + t.regionWidth / 2,
    y: t.regionY + t.regionHeight / 2,
    scale: ((y = (m = canvas.stage) == null ? void 0 : m.scale) == null ? void 0 : y.x) ?? 1,
    duration: 500
  });
}
function ye(e, t = null) {
  var r;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (r = e.element) != null && r[0] ? e.element[0] : e.element ?? null;
}
function kt() {
  const e = Je();
  !M && e.length && (M = e[0].id), k === null && (k = M);
  const t = Y(M), r = k === "" ? $e() : Y(k) ?? $e(), n = ue(r);
  return {
    cameras: e.map((a) => ({
      ...ue(a),
      isSelected: a.id === M
    })),
    selectedCamera: t ? ue(t) : null,
    editorCamera: n,
    sceneChoices: Lt(r.sceneId),
    regionChoices: Ot(r.sceneId, r.regionId),
    feedSourceChoices: Se(mt, r.feedSource),
    statusChoices: Se(ut, r.status),
    displayModeChoices: Se(dt, r.displayMode),
    showStaticImageField: r.feedSource === "image",
    hasCameras: e.length > 0,
    isNewCamera: !r.id
  };
}
function Yt(e) {
  var n, a, c;
  if (typeof FilePicker > "u") {
    (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Foundry FilePicker is not available.");
    return;
  }
  const t = (c = e == null ? void 0 : e.elements) == null ? void 0 : c.image;
  new FilePicker({
    type: "image",
    current: (t == null ? void 0 : t.value) ?? "",
    callback: (l) => {
      t && (t.value = l);
    }
  }).browse();
}
function Xt(e, t = null) {
  var a, c;
  const r = ye(e, t);
  if (!r) return;
  const n = r.querySelector("[data-security-camera-form]");
  n == null || n.addEventListener("submit", async (l) => {
    l.preventDefault(), await Wt(n);
  }), (c = (a = n == null ? void 0 : n.elements) == null ? void 0 : a.feedSource) == null || c.addEventListener("change", () => {
    const l = n.querySelector("[data-security-camera-static-image-field]");
    l && (l.hidden = n.elements.feedSource.value !== "image");
  }), r.querySelectorAll("[data-security-camera-id]").forEach((l) => {
    l.addEventListener("click", async (m) => {
      M = m.currentTarget.dataset.securityCameraId, k = M, await e.render(!0);
    });
  }), r.querySelectorAll("[data-security-camera-action]").forEach((l) => {
    l.addEventListener("click", async (m) => {
      const y = m.currentTarget.dataset.securityCameraAction;
      if (y === "new") {
        await et();
        return;
      }
      if (y === "duplicate") {
        await Ze(M);
        return;
      }
      if (y === "delete") {
        await Qe(M);
        return;
      }
      if (y === "browse-image") {
        Yt(n);
        return;
      }
      if (y === "pan-region") {
        Bt(M);
        return;
      }
      if (y === "show") {
        await it(M);
        return;
      }
      if (y === "close-feed") {
        at();
        return;
      }
    });
  });
}
function tt(e) {
  var a, c;
  const t = (e == null ? void 0 : e.camera) ?? {}, r = le(t.displayMode, Me, P.displayMode), n = ye(e);
  if (n == null || n.classList.toggle("security-camera-feed-display-window", r === "window"), n == null || n.classList.toggle("security-camera-feed-display-pip", r === "picture-in-picture"), r === "picture-in-picture") {
    const l = Number(t.regionWidth) && Number(t.regionHeight) ? Number(t.regionWidth) / Number(t.regionHeight) : 1.7777777777777777, m = Math.min(620, Math.max(360, window.innerWidth * 0.42)), y = Math.min(460, Math.max(260, window.innerHeight * 0.38));
    let p = m, I = p / l;
    I > y && (I = y, p = I * l);
    const A = Math.round(I + 112);
    (a = e.setPosition) == null || a.call(e, {
      left: Math.max(12, window.innerWidth - p - 24),
      top: Math.max(12, window.innerHeight - A - 84),
      width: Math.round(p),
      height: A
    });
    return;
  }
  (c = e.setPosition) == null || c.call(e, {
    width: 720,
    height: 520
  });
}
function jt(e, t = null) {
  ye(e, t) && (tt(e), Z.startLocalLiveRefresh(e));
}
const Z = At({
  applyLinkedRegionBounds: ge,
  broadcastLiveFrame: (e, t) => {
    var r;
    !((r = game.user) != null && r.isGM) || !(e != null && e.id) || !t || Re({
      action: "updateFeedFrame",
      gmUserId: game.user.id,
      cameraId: e.id,
      liveFrame: t
    });
  },
  getSceneBackgroundPath: Ke,
  getSceneById: he,
  isFrameProducer: () => {
    var e;
    return !!((e = game.user) != null && e.isGM);
  },
  moduleId: O,
  normalizeCamera: D
}), { SecurityMonitor: Gt, CameraFeed: Vt } = bt({
  moduleId: O,
  monitorTemplatePath: Rt,
  feedTemplatePath: xt,
  escapeHTML: ze,
  getMonitorContext: kt,
  prepareCamera: ue,
  bindMonitorControls: Xt,
  bindFeedControls: jt,
  getElement: ye,
  liveFrameController: Z,
  clearActiveMonitor: (e) => {
    x === e && (x = null);
  },
  clearActiveFeed: (e) => {
    L === e && (L = null);
  }
});
async function rt() {
  var e;
  return H("open the Security Camera Manager") ? x ? ((e = x.bringToFront) == null || e.call(x), x) : (x = new Gt(), await x.render(!0), x) : null;
}
async function Dt() {
  if (!x) return;
  const e = x;
  x = null, await e.close();
}
async function xe(e, t = {}) {
  const r = D(e);
  return await Ee(), L = new Vt(r, {
    liveFrame: t.liveFrame ?? ""
  }), await L.render(!0), tt(L), L;
}
async function Ee() {
  if (!L) return;
  const e = L;
  L = null, await e.close();
}
async function it(e) {
  var n, a;
  if (!H("broadcast camera feeds")) return null;
  const t = Y(e);
  if (!t)
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Security camera not found."), null;
  const r = await Z.captureLiveFrame(t, {
    preferDataUrl: !0
  });
  return Re({
    action: "showFeed",
    gmUserId: game.user.id,
    camera: t,
    liveFrame: r
  }), Z.startBroadcastLiveRefresh(t), xe(t, { liveFrame: r });
}
async function Ht(e, t = {}) {
  var a, c, l, m, y, p;
  const r = Y(e);
  if (!r)
    return (c = (a = ui.notifications) == null ? void 0 : a.warn) == null || c.call(a, "Security camera not found."), null;
  if (!nt((l = game.user) == null ? void 0 : l.id, e))
    return (y = (m = ui.notifications) == null ? void 0 : m.warn) == null || y.call(m, "You do not have access to this camera feed."), null;
  let n = String(t.liveFrame ?? "");
  return (p = game.user) != null && p.isGM && !n && (n = await Z.captureLiveFrame(r, {
    preferDataUrl: !0
  })), xe(r, { liveFrame: n });
}
function nt(e, t) {
  var n, a, c, l;
  const r = Y(t);
  return r ? (n = game.user) != null && n.isGM || (l = (c = (a = game.users) == null ? void 0 : a.get) == null ? void 0 : c.call(a, e)) != null && l.isGM ? !0 : r.status !== "offline" && r.status !== "restricted" : !1;
}
function at() {
  H("close player camera feeds") && (Re({
    action: "closeFeed",
    gmUserId: game.user.id
  }), Z.stopBroadcastLiveRefresh(), Ee());
}
async function zt() {
  x && await x.render(!0);
}
async function qt(e) {
  var r, n, a, c, l;
  if (!e || typeof e != "object") return;
  const t = qe.isGMSender(e.gmUserId);
  if (e.action === "showFeed") {
    if ((r = game.user) != null && r.isGM) return;
    if (!t) {
      console.warn(`${O} | Ignoring camera feed socket message without a GM sender.`);
      return;
    }
    const m = Ae(e.camera);
    if (!m.ok) {
      console.warn(`${O} | Ignoring invalid socket camera payload.`, m.errors);
      return;
    }
    await xe(m.camera, {
      liveFrame: typeof e.liveFrame == "string" ? e.liveFrame : ""
    });
    return;
  }
  if (e.action === "updateFeedFrame") {
    if ((n = game.user) != null && n.isGM || !t) return;
    const m = String(e.cameraId ?? "");
    if (!m || ((a = L == null ? void 0 : L.camera) == null ? void 0 : a.id) !== m || typeof e.liveFrame != "string" || !e.liveFrame) return;
    await ((c = L.updateLiveFrame) == null ? void 0 : c.call(L, e.liveFrame));
    return;
  }
  if (e.action === "closeFeed") {
    if ((l = game.user) != null && l.isGM || !t) return;
    await Ee();
  }
}
function Kt() {
  game.settings.register(O, "cameras", {
    name: "Security Cameras",
    hint: "World-level camera feed definitions for the Security Cameras module.",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  });
}
function Jt() {
  const e = {
    openMonitor: rt,
    closeMonitor: Dt,
    showFeed: it,
    registerCamera: _t,
    createNewCamera: et,
    deleteCamera: Qe,
    duplicateCamera: Ze,
    getCameras: Je,
    getCamera: Y,
    openCameraFeed: Ht,
    hasCameraAccess: nt,
    closeFeed: at,
    get activeMonitor() {
      return x;
    },
    get activeFeed() {
      return L;
    }
  };
  game.securityCameras = e;
  const t = game.modules.get(O);
  t && (t.api = e);
}
function Qt() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: O,
    title: "Security Cameras",
    icon: "fa-solid fa-video",
    premium: !1,
    featureId: O,
    playerVisible: !1,
    description: "Manage camera feeds and broadcast surveillance views.",
    open: () => rt()
  }), !0) : !1;
}
Hooks.once("init", () => {
  Kt();
});
Hooks.once("ready", () => {
  var e, t;
  Jt(), Qt(), (t = (e = game.socket) == null ? void 0 : e.on) == null || t.call(e, He, qt), console.log(`${O} | Ready. Use game.securityCameras.openMonitor()`);
});
