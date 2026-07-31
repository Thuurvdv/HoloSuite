var ht = Object.defineProperty;
var gt = (e, t, r) => t in e ? ht(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var _ = (e, t, r) => gt(e, typeof t != "symbol" ? t + "" : t, r);
function yt(e, t = e) {
  const r = `${t} |`;
  return {
    log: (n, ...a) => console.log(r, n, ...a),
    warn: (n, ...a) => console.warn(r, n, ...a),
    error: (n, ...a) => console.error(r, n, ...a)
  };
}
function vt(e, t = {}) {
  const r = t.socketName ?? `module.${e}`, n = yt(e, t.title ?? e);
  return {
    socketName: r,
    emit(a) {
      var u;
      const c = (u = globalThis.game) == null ? void 0 : u.socket;
      return c != null && c.emit ? (c.emit(r, a), !0) : (n.warn("Foundry socket is unavailable.", a), !1);
    },
    isGMSender(a) {
      var c, u, m;
      return a ? !!((m = (u = (c = globalThis.game) == null ? void 0 : c.users) == null ? void 0 : u.get(String(a))) != null && m.isGM) : !1;
    }
  };
}
const qe = /* @__PURE__ */ new Set(["online", "offline", "corrupted", "restricted"]), ze = /* @__PURE__ */ new Set(["live", "image"]), Le = /* @__PURE__ */ new Set(["window", "picture-in-picture"]), ve = 1200, we = 675, wt = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "corrupted", label: "Corrupted" },
  { value: "restricted", label: "Restricted" }
], pt = [
  { value: "window", label: "Window" },
  { value: "picture-in-picture", label: "Picture-in-Picture" }
], Ft = [
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
  regionWidth: ve,
  regionHeight: we,
  notes: ""
};
function he(e, t, r) {
  const n = String(e ?? "").trim();
  return t.has(n) ? n : r;
}
function N(e) {
  if (e == null || e === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
function B(e, t) {
  const r = Number(e);
  return Number.isFinite(r) && r > 0 ? r : t;
}
function Ke(e) {
  return e && typeof e == "object" ? e : {};
}
function Ae(e = {}, t = {}) {
  var y;
  const r = Ke(e), n = t.preserveId === !0, a = String(r.id ?? "").trim(), c = n ? a : a || ((y = t.createId) == null ? void 0 : y.call(t)) || "", u = he(r.feedSource, ze, P.feedSource), m = he(r.status, qe, P.status), v = he(r.displayMode, Le, P.displayMode);
  return {
    ...P,
    id: c,
    name: String(r.name ?? P.name).trim() || P.name,
    sceneId: String(r.sceneId ?? "").trim(),
    location: String(r.location ?? P.location).trim() || P.location,
    image: String(r.image ?? "").trim(),
    feedSource: u,
    status: m,
    displayMode: v,
    regionId: String(r.regionId ?? "").trim(),
    regionX: N(r.regionX),
    regionY: N(r.regionY),
    regionWidth: B(r.regionWidth, ve),
    regionHeight: B(r.regionHeight, we),
    notes: String(r.notes ?? "").trim()
  };
}
function bt(e = {}, t = {}) {
  const r = Ke(e), n = Ae(r, {
    preserveId: t.requireId === !0,
    createId: t.createId
  }), a = [], c = String(r.feedSource ?? P.feedSource).trim(), u = String(r.status ?? P.status).trim(), m = String(r.displayMode ?? P.displayMode).trim();
  return t.requireId && !n.id && a.push("Camera id is required."), typeof r.name == "string" && !r.name.trim() && a.push("Camera name is required."), ze.has(c) || a.push(`Invalid feed source: ${c}`), qe.has(u) || a.push(`Invalid status: ${u}`), Le.has(m) || a.push(`Invalid display mode: ${m}`), {
    ok: a.length === 0,
    camera: Ae(n, { createId: t.createId }),
    errors: a
  };
}
function Je(e) {
  return e && typeof e == "object" ? e : {};
}
function St(e = {}) {
  const t = Je(e), r = Array.isArray(t.points) ? t.points : [];
  if (r.length >= 4) {
    const y = [], C = [];
    for (let V = 0; V < r.length; V += 2)
      y.push(Number(r[V])), C.push(Number(r[V + 1]));
    const R = Math.min(...y), w = Math.min(...C), j = Math.max(...y), G = Math.max(...C);
    if ([R, w, j, G].every(Number.isFinite))
      return {
        x: R,
        y: w,
        width: j - R,
        height: G - w
      };
  }
  const n = N(t.x) ?? 0, a = N(t.y) ?? 0, c = N(t.radiusX ?? t.radius), u = N(t.radiusY ?? t.radius);
  if (c && u)
    return {
      x: n - c,
      y: a - u,
      width: c * 2,
      height: u * 2
    };
  const m = B(t.width, 0), v = B(t.height, 0);
  return !m || !v ? null : { x: n, y: a, width: m, height: v };
}
function Ct(e) {
  const t = e.filter((u) => !!u);
  if (!t.length) return null;
  const r = Math.min(...t.map((u) => u.x)), n = Math.min(...t.map((u) => u.y)), a = Math.max(...t.map((u) => u.x + u.width)), c = Math.max(...t.map((u) => u.y + u.height));
  return {
    x: r,
    y: n,
    width: a - r,
    height: c - n
  };
}
function xe(e) {
  const t = Je(e), r = B(t.width, ve), n = B(t.height, we);
  return !r || !n ? null : {
    regionX: N(t.x) ?? 0,
    regionY: N(t.y) ?? 0,
    regionWidth: r,
    regionHeight: n
  };
}
function It(e) {
  const t = Ct(e.map(St));
  return t ? xe(t) : null;
}
function ke(e, t) {
  const r = e.cameras.map((w) => `
    <button type="button" class="security-camera-list-item ${w.isSelected ? "active" : ""}" data-security-camera-id="${t(w.id)}">
      <span>${t(w.name)}</span>
      <small>${t(w.location)}</small>
      <i>${t(w.status)}</i>
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
  ` : '<section class="security-camera-monitor-preview"><div class="security-camera-empty">No camera selected.</div></section>', c = e.editorCamera, u = e.sceneChoices.map((w) => `<option value="${t(w.id)}" ${w.selected ? "selected" : ""}>${t(w.name)}</option>`).join(""), m = e.regionChoices.map((w) => `<option value="${t(w.id)}" ${w.selected ? "selected" : ""}>${t(w.name)}</option>`).join(""), v = e.feedSourceChoices.map((w) => `<option value="${t(w.value)}" ${w.selected ? "selected" : ""}>${t(w.label)}</option>`).join(""), y = e.statusChoices.map((w) => `<option value="${t(w.value)}" ${w.selected ? "selected" : ""}>${t(w.label)}</option>`).join(""), C = e.displayModeChoices.map((w) => `<option value="${t(w.value)}" ${w.selected ? "selected" : ""}>${t(w.label)}</option>`).join(""), R = `<label data-security-camera-static-image-field ${e.showStaticImageField ? "" : "hidden"}>Static Image <span class="security-camera-path-row"><input type="text" name="image" value="${t(c.image)}"><button type="button" data-security-camera-action="browse-image">Browse</button></span></label>`;
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
        <label>Scene <select name="sceneId">${u}</select></label>
        <label>Scene Region <select name="regionId">${m}</select></label>
        <label>Location <input type="text" name="location" value="${t(c.location)}"></label>
        <label>Feed Source <select name="feedSource">${v}</select></label>
        ${R}
        <label>Status <select name="status">${y}</select></label>
        <label>Display Mode <select name="displayMode">${C}</select></label>
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
function Ye(e, t) {
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
function $t() {
  var t, r, n;
  const e = Number(((r = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : r.generation) ?? ((n = game == null ? void 0 : game.release) == null ? void 0 : n.generation));
  return Number.isFinite(e) ? e : null;
}
function Mt() {
  const e = $t();
  return e === null || e >= 13;
}
function Rt() {
  var r, n, a, c, u, m;
  const e = ((n = (r = globalThis.foundry) == null ? void 0 : r.appv1) == null ? void 0 : n.api) ?? ((a = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : a.api) ?? null, t = ((u = (c = globalThis.foundry) == null ? void 0 : c.applications) == null ? void 0 : u.api) ?? ((m = foundry == null ? void 0 : foundry.applications) == null ? void 0 : m.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function At(e) {
  var le, de, ie, me;
  const {
    moduleId: t,
    monitorTemplatePath: r,
    feedTemplatePath: n,
    escapeHTML: a,
    getMonitorContext: c,
    prepareCamera: u,
    bindMonitorControls: m,
    bindFeedControls: v,
    getElement: y,
    liveFrameController: C,
    clearActiveMonitor: R,
    clearActiveFeed: w
  } = e, j = (de = (le = foundry == null ? void 0 : foundry.applications) == null ? void 0 : le.api) == null ? void 0 : de.ApplicationV2, G = (me = (ie = foundry == null ? void 0 : foundry.applications) == null ? void 0 : ie.api) == null ? void 0 : me.HandlebarsApplicationMixin, V = Rt(), te = Mt();
  function Z(b) {
    return typeof b == "string" && b.startsWith("blob:");
  }
  function re(b) {
    Z(b == null ? void 0 : b.liveFrameObjectUrl) && typeof URL < "u" && URL.revokeObjectURL(b.liveFrameObjectUrl), b && (b.liveFrameObjectUrl = null);
  }
  function ue(b, M) {
    b.liveFrame !== M && (re(b), b.liveFrame = M, b.liveFrameObjectUrl = Z(M) ? M : null);
  }
  class Se extends V {
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
    async _renderInner(M) {
      try {
        return await super._renderInner(M);
      } catch (I) {
        return console.warn(`${t} | Monitor template render failed, using inline fallback.`, I), $(ke(M, a));
      }
    }
    activateListeners(M) {
      super.activateListeners(M), m(this, M);
    }
    async close(M) {
      return R(this), super.close(M);
    }
  }
  class Ce extends V {
    constructor(I, p = {}) {
      super(p);
      _(this, "camera");
      _(this, "liveFrame");
      _(this, "liveFrameObjectUrl");
      _(this, "liveFrameTimer");
      this.camera = u(I), this.liveFrame = p.liveFrame ?? "", this.liveFrameObjectUrl = Z(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
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
    async _renderInner(I) {
      try {
        return await super._renderInner(I);
      } catch (p) {
        return console.warn(`${t} | Feed template render failed, using inline fallback.`, p), $(Ye({
          ...this.camera,
          liveFrame: this.liveFrame
        }, a));
      }
    }
    activateListeners(I) {
      super.activateListeners(I), v(this, I);
    }
    async updateLiveFrame(I) {
      var T, i;
      ue(this, I);
      const p = y(this), S = (T = p == null ? void 0 : p.querySelector) == null ? void 0 : T.call(p, "[data-security-camera-live-frame]"), E = (i = p == null ? void 0 : p.querySelector) == null ? void 0 : i.call(p, "[data-security-camera-live-waiting]");
      if (S) {
        S.src = I, S.hidden = !1, E && (E.hidden = !0);
        return;
      }
      await this.render(!0);
    }
    async close(I) {
      return C.stopLocalLiveRefresh(this), re(this), w(this), super.close(I);
    }
  }
  function Ie() {
    var b;
    return !te || !j || !G ? null : (b = class extends G(j) {
      async _prepareContext(I) {
        return {
          ...await super._prepareContext(I),
          ...c()
        };
      }
      async _renderHTML(I, p) {
        try {
          return await super._renderHTML(I, p);
        } catch (S) {
          console.warn(`${t} | Monitor template render failed, using inline fallback.`, S);
          const E = document.createElement("template");
          return E.innerHTML = ke(I, a).trim(), E.content;
        }
      }
      _onRender(I, p) {
        var S;
        (S = super._onRender) == null || S.call(this, I, p), m(this);
      }
      async close(I) {
        return R(this), super.close(I);
      }
    }, _(b, "DEFAULT_OPTIONS", {
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
    }), _(b, "PARTS", {
      main: {
        template: r
      }
    }), b);
  }
  function $e() {
    var b;
    return !te || !j || !G ? null : (b = class extends G(j) {
      constructor(p, S = {}) {
        super(S);
        _(this, "camera");
        _(this, "liveFrame");
        _(this, "liveFrameObjectUrl");
        _(this, "liveFrameTimer");
        this.camera = u(p), this.liveFrame = S.liveFrame ?? "", this.liveFrameObjectUrl = Z(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
      }
      async _prepareContext(p) {
        return this.camera = u(this.camera), {
          ...await super._prepareContext(p),
          camera: {
            ...this.camera,
            liveFrame: this.liveFrame,
            hasLiveFrame: !!this.liveFrame
          }
        };
      }
      async _renderHTML(p, S) {
        try {
          return await super._renderHTML(p, S);
        } catch (E) {
          console.warn(`${t} | Feed template render failed, using inline fallback.`, E);
          const T = document.createElement("template");
          return T.innerHTML = Ye({
            ...this.camera,
            liveFrame: this.liveFrame
          }, a).trim(), T.content;
        }
      }
      _onRender(p, S) {
        var E;
        (E = super._onRender) == null || E.call(this, p, S), v(this);
      }
      async updateLiveFrame(p) {
        var i, o;
        ue(this, p);
        const S = y(this), E = (i = S == null ? void 0 : S.querySelector) == null ? void 0 : i.call(S, "[data-security-camera-live-frame]"), T = (o = S == null ? void 0 : S.querySelector) == null ? void 0 : o.call(S, "[data-security-camera-live-waiting]");
        if (E) {
          E.src = p, E.hidden = !1, T && (T.hidden = !0);
          return;
        }
        await this.render(!0);
      }
      async close(p) {
        return C.stopLocalLiveRefresh(this), re(this), w(this), super.close(p);
      }
    }, _(b, "DEFAULT_OPTIONS", {
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
    }), _(b, "PARTS", {
      main: {
        template: n
      }
    }), b);
  }
  return {
    SecurityMonitor: Ie() ?? Se,
    CameraFeed: $e() ?? Ce
  };
}
function Qe(e) {
  return Number.isFinite(e.regionX) && Number.isFinite(e.regionY);
}
function ye(e) {
  return {
    sx: 0,
    sy: 0,
    sw: e.width,
    sh: e.height
  };
}
function xt(e, t, r, n) {
  if (!Qe(t)) return ye(e);
  if (r != null && r.width && r.height && e.width >= r.width * 0.75 && e.height >= r.height * 0.75) {
    const a = e.width / r.width, c = e.height / r.height;
    return {
      sx: (t.regionX ?? 0) * a,
      sy: (t.regionY ?? 0) * c,
      sw: t.regionWidth * a,
      sh: t.regionHeight * c
    };
  }
  return (n == null ? void 0 : n(t)) ?? ye(e);
}
function Xe(e, t) {
  const r = Math.max(0, Math.min(t.width - 1, Math.round(e.sx))), n = Math.max(0, Math.min(t.height - 1, Math.round(e.sy))), a = Math.max(1, Math.min(t.width - r, Math.round(e.sw))), c = Math.max(1, Math.min(t.height - n, Math.round(e.sh)));
  return { sx: r, sy: n, sw: a, sh: c };
}
function Et(e, t, r) {
  if (!Qe(t)) return ye(e);
  const n = e.width / r.width, a = e.height / r.height;
  return {
    sx: ((t.regionX ?? 0) - r.x) * n,
    sy: ((t.regionY ?? 0) - r.y) * a,
    sw: t.regionWidth * n,
    sh: t.regionHeight * a
  };
}
function je(e, t) {
  const r = Math.min(1, t / e.sw);
  return {
    width: Math.max(1, Math.round(e.sw * r)),
    height: Math.max(1, Math.round(e.sh * r))
  };
}
function Lt(e, t = 100) {
  const r = ee(e);
  if (!r) return null;
  const n = N(r.x), a = N(r.y);
  return !Number.isFinite(n) || !Number.isFinite(a) ? null : {
    x: n,
    y: a,
    width: B(r.width, 1) * t,
    height: B(r.height, 1) * t
  };
}
function ee(e) {
  if (!e) return null;
  if (e.document) return ee(e.document);
  if (typeof e.toObject == "function") {
    const t = e.toObject();
    if (t && typeof t == "object") return t;
  }
  return e._source && typeof e._source == "object" ? e._source : e;
}
function Me(e, t) {
  const r = Math.max(e.x, t.x), n = Math.max(e.y, t.y), a = Math.min(e.x + e.width, t.x + t.width), c = Math.min(e.y + e.height, t.y + t.height), u = a - r, m = c - n;
  return u > 0 && m > 0 ? { x: r, y: n, width: u, height: m } : null;
}
function Nt(e, t, r) {
  return {
    dx: (e.x - t.x) / t.width * r.width,
    dy: (e.y - t.y) / t.height * r.height,
    dw: e.width / t.width * r.width,
    dh: e.height / t.height * r.height
  };
}
const Ge = 1250, Ve = 960, Ot = 0.62, Ut = 0.72, De = 18;
function _t(e) {
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
    var s, l, d, f, h;
    const i = (s = canvas == null ? void 0 : canvas.app) == null ? void 0 : s.renderer, o = [
      (l = canvas == null ? void 0 : canvas.app) == null ? void 0 : l.stage,
      canvas == null ? void 0 : canvas.stage
    ].filter(Boolean);
    try {
      for (const g of o) {
        const F = (f = (d = i == null ? void 0 : i.extract) == null ? void 0 : d.canvas) == null ? void 0 : f.call(d, g);
        if (F != null && F.width && (F != null && F.height)) return F;
      }
    } catch (g) {
      console.warn(`${e.moduleId} | PIXI canvas extraction failed, using renderer view fallback.`, g);
    }
    return (i == null ? void 0 : i.view) ?? ((h = canvas == null ? void 0 : canvas.app) == null ? void 0 : h.view) ?? null;
  }
  function u(i, o) {
    var h, g, F, x;
    const s = e.applyLinkedRegionBounds(e.normalizeCamera(o)), l = ((h = canvas.dimensions) == null ? void 0 : h.width) ?? ((g = canvas.scene) == null ? void 0 : g.width) ?? 0, d = ((F = canvas.dimensions) == null ? void 0 : F.height) ?? ((x = canvas.scene) == null ? void 0 : x.height) ?? 0;
    return xt(i, s, l && d ? { width: l, height: d } : null, () => {
      var W, z;
      if ((z = (W = canvas.stage) == null ? void 0 : W.worldTransform) != null && z.apply && typeof PIXI < "u") {
        const Y = canvas.stage.worldTransform.apply(new PIXI.Point(s.regionX, s.regionY)), K = canvas.stage.worldTransform.apply(new PIXI.Point(s.regionX + s.regionWidth, s.regionY + s.regionHeight));
        return {
          sx: Y.x,
          sy: Y.y,
          sw: K.x - Y.x,
          sh: K.y - Y.y
        };
      }
      return null;
    });
  }
  function m(i = "") {
    var d, f, h, g, F;
    const o = e.getSceneById(i), l = (o == null ? void 0 : o.id) && ((d = canvas == null ? void 0 : canvas.scene) == null ? void 0 : d.id) === o.id ? canvas.dimensions : o == null ? void 0 : o.dimensions;
    return {
      x: N((l == null ? void 0 : l.sceneX) ?? ((f = l == null ? void 0 : l.sceneRect) == null ? void 0 : f.x)) ?? 0,
      y: N((l == null ? void 0 : l.sceneY) ?? ((h = l == null ? void 0 : l.sceneRect) == null ? void 0 : h.y)) ?? 0,
      width: B(
        (l == null ? void 0 : l.sceneWidth) ?? ((g = l == null ? void 0 : l.sceneRect) == null ? void 0 : g.width) ?? (l == null ? void 0 : l.width) ?? (o == null ? void 0 : o.width),
        ve
      ),
      height: B(
        (l == null ? void 0 : l.sceneHeight) ?? ((F = l == null ? void 0 : l.sceneRect) == null ? void 0 : F.height) ?? (l == null ? void 0 : l.height) ?? (o == null ? void 0 : o.height),
        we
      )
    };
  }
  function v(i, o) {
    const s = e.applyLinkedRegionBounds(e.normalizeCamera(o));
    if (!Number.isFinite(s.regionX) || !Number.isFinite(s.regionY))
      return ye({ width: i.naturalWidth, height: i.naturalHeight });
    const l = m(s.sceneId);
    return Et({ width: i.naturalWidth, height: i.naturalHeight }, s, l);
  }
  function y(i) {
    if (!i) return Promise.resolve(null);
    if (t.has(i)) return t.get(i);
    const o = new Promise((s) => {
      const l = (h) => s(h), d = () => {
        const h = new Image();
        h.onload = () => l(h), h.onerror = () => l(null), h.src = i;
      }, f = new Image();
      f.crossOrigin = "anonymous", f.onload = () => l(f), f.onerror = d, f.src = i;
    });
    return t.set(i, o), o;
  }
  function C(i, o, s) {
    try {
      return i.toDataURL(o, s);
    } catch (l) {
      {
        console.warn(`${e.moduleId} | ${o} canvas encode failed, using PNG fallback.`, l);
        try {
          return i.toDataURL("image/png");
        } catch (d) {
          return console.warn(`${e.moduleId} | PNG canvas encode failed.`, d), "";
        }
      }
      return console.warn(`${e.moduleId} | PNG canvas encode failed.`, l), "";
    }
  }
  function R(i, o, s, l = {}) {
    return l.preferDataUrl || !i.toBlob || typeof URL > "u" || !URL.createObjectURL ? Promise.resolve(C(i, o, s)) : new Promise((d) => {
      try {
        i.toBlob((f) => {
          if (f) {
            d(URL.createObjectURL(f));
            return;
          }
          d(C(i, o, s));
        }, o, s);
      } catch (f) {
        console.warn(`${e.moduleId} | ${o} canvas blob encode failed, using data URL fallback.`, f), d(C(i, o, s));
      }
    });
  }
  async function w(i = {}, o = {}) {
    const l = e.getSceneBackgroundPath(i.sceneId) || i.image, d = await y(l);
    if (!(d != null && d.naturalWidth) || !(d != null && d.naturalHeight)) return "";
    const f = Xe(v(d, i), {
      width: d.naturalWidth,
      height: d.naturalHeight
    }), { width: h, height: g } = je(f, Ve), F = document.createElement("canvas");
    F.width = h, F.height = g;
    const x = F.getContext("2d");
    return x == null || x.drawImage(d, f.sx, f.sy, f.sw, f.sh, 0, 0, h, g), await ue(x, i, h, g), R(F, "image/webp", Ut, o);
  }
  function j(i) {
    var s, l, d, f, h, g;
    const o = (i == null ? void 0 : i.id) && ((s = canvas == null ? void 0 : canvas.scene) == null ? void 0 : s.id) === i.id;
    return B(
      o ? ((l = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : l.size) ?? ((d = canvas == null ? void 0 : canvas.grid) == null ? void 0 : d.size) ?? ((f = i == null ? void 0 : i.grid) == null ? void 0 : f.size) : ((h = i == null ? void 0 : i.dimensions) == null ? void 0 : h.size) ?? ((g = i == null ? void 0 : i.grid) == null ? void 0 : g.size),
      100
    );
  }
  function G(i) {
    var s, l, d, f, h;
    if (!i) return [];
    if (i.id && ((s = canvas == null ? void 0 : canvas.scene) == null ? void 0 : s.id) === i.id)
      return (((l = canvas.tokens) == null ? void 0 : l.placeables) ?? []).map((g) => g == null ? void 0 : g.document).filter(Boolean);
    const o = [
      V(i, "Token"),
      i.tokens,
      (d = i.getEmbeddedDocuments) == null ? void 0 : d.call(i, "Token"),
      (f = i.toObject) == null ? void 0 : f.call(i).tokens,
      (h = i._source) == null ? void 0 : h.tokens
    ];
    for (const g of o) {
      const F = te(g);
      if (F.length) return F;
    }
    return [];
  }
  function V(i, o) {
    var s;
    try {
      return (s = i == null ? void 0 : i.getEmbeddedCollection) == null ? void 0 : s.call(i, o);
    } catch (l) {
      return console.warn(`${e.moduleId} | Could not read ${o} collection for inactive scene.`, l), null;
    }
  }
  function te(i) {
    return i ? (Array.isArray(i == null ? void 0 : i.contents) ? i.contents : Array.isArray(i) ? i : typeof i.values == "function" ? Array.from(i.values()) : Array.from(i ?? [])).map((s) => Array.isArray(s) ? s[1] : s).map((s) => (s == null ? void 0 : s.document) ?? s).filter(Boolean) : [];
  }
  function Z(i) {
    const o = ee(i);
    return !(!o || o.hidden);
  }
  function re(i) {
    var s, l, d, f, h, g, F, x;
    const o = ee(i);
    return String(
      ((s = i == null ? void 0 : i.getTextureSrc) == null ? void 0 : s.call(i)) ?? ((l = o == null ? void 0 : o.texture) == null ? void 0 : l.src) ?? (o == null ? void 0 : o.img) ?? ((d = i == null ? void 0 : i.texture) == null ? void 0 : d.src) ?? ((f = i == null ? void 0 : i.actor) == null ? void 0 : f.img) ?? ((h = i == null ? void 0 : i.baseActor) == null ? void 0 : h.img) ?? ((x = (F = (g = i == null ? void 0 : i.actor) == null ? void 0 : g.prototypeToken) == null ? void 0 : F.texture) == null ? void 0 : x.src) ?? ""
    ).trim();
  }
  async function ue(i, o, s, l) {
    var x;
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
    const g = j(d), F = m(f.sceneId);
    for (const W of Se(d, f)) {
      if (!Z(W)) continue;
      const z = Lt(W, g), Y = Ie(z, h, F);
      if (!Y) continue;
      const { sourceBounds: K, visibleBounds: ne } = Y, ft = re(W), H = await y(ft), { dx: Pe, dy: Te, dw: We, dh: Be } = Nt(ne, h, { width: s, height: l });
      if (i.save(), i.globalAlpha = N(W.alpha) ?? N((x = ee(W)) == null ? void 0 : x.alpha) ?? 1, H != null && H.naturalWidth && (H != null && H.naturalHeight)) {
        const fe = Ce(H, K, ne);
        i.drawImage(H, fe.sx, fe.sy, fe.sw, fe.sh, Pe, Te, We, Be);
      } else
        $e(i, W, Pe, Te, We, Be);
      i.restore();
    }
  }
  function Se(i, o) {
    var l;
    const s = (l = e.getRegionDocument) == null ? void 0 : l.call(e, o.regionId, o.sceneId);
    return s && "tokens" in Object(s) ? te(s.tokens) : G(i);
  }
  function Ce(i, o, s) {
    const l = i.naturalWidth / o.width, d = i.naturalHeight / o.height;
    return {
      sx: Math.max(0, (s.x - o.x) * l),
      sy: Math.max(0, (s.y - o.y) * d),
      sw: Math.min(i.naturalWidth, s.width * l),
      sh: Math.min(i.naturalHeight, s.height * d)
    };
  }
  function Ie(i, o, s) {
    if (!i) return null;
    const l = Me(i, o);
    if (l) return { sourceBounds: i, visibleBounds: l };
    const d = N(s == null ? void 0 : s.x) ?? 0, f = N(s == null ? void 0 : s.y) ?? 0;
    if (!d && !f) return null;
    const h = {
      ...i,
      x: i.x - d,
      y: i.y - f
    }, g = Me(h, o);
    if (g) return { sourceBounds: h, visibleBounds: g };
    const F = {
      ...i,
      x: i.x + d,
      y: i.y + f
    }, x = Me(F, o);
    return x ? { sourceBounds: F, visibleBounds: x } : null;
  }
  function $e(i, o, s, l, d, f) {
    const h = ee(o), g = Math.max(De, d), F = Math.max(De, f), x = s + (d - g) / 2, W = l + (f - F) / 2, z = Math.min(g, F) / 2, Y = x + g / 2, K = W + F / 2;
    i.beginPath(), i.arc(Y, K, z, 0, Math.PI * 2), i.fillStyle = "rgba(10, 18, 24, 0.82)", i.fill(), i.lineWidth = Math.max(2, Math.min(g, F) * 0.08), i.strokeStyle = "rgba(72, 220, 255, 0.95)", i.stroke();
    const ne = String((h == null ? void 0 : h.name) ?? (o == null ? void 0 : o.name) ?? "").trim().slice(0, 2).toUpperCase();
    ne && (i.font = `700 ${Math.max(10, Math.round(z * 0.72))}px sans-serif`, i.textAlign = "center", i.textBaseline = "middle", i.fillStyle = "rgba(224, 252, 255, 0.96)", i.fillText(ne, Y, K + 0.5));
  }
  function le(i) {
    const o = i.getContext("2d", { willReadFrequently: !0 });
    if (!o) return !1;
    const s = Math.min(48, i.width), l = Math.min(48, i.height), d = o.getImageData(0, 0, s, l).data;
    let f = 0;
    const h = d.length / 4;
    for (let g = 0; g < d.length; g += 4)
      f += d[g] + d[g + 1] + d[g + 2];
    return f / (h * 3) < 3;
  }
  async function de(i = {}, o = {}) {
    const s = c();
    if (!(s != null && s.width) || !(s != null && s.height)) return "";
    const l = Xe(u(s, i), s), { width: d, height: f } = je(l, Ve), h = document.createElement("canvas");
    h.width = d, h.height = f;
    const g = h.getContext("2d");
    return g == null || g.drawImage(s, l.sx, l.sy, l.sw, l.sh, 0, 0, d, f), le(h) ? "" : R(h, "image/webp", Ot, o);
  }
  async function ie(i = {}, o = {}) {
    let s = await w(i, o);
    return !s && a(i) && (s = await de(i, o)), s;
  }
  async function me(i, o = {}) {
    var l, d;
    if (!n(i == null ? void 0 : i.camera)) return;
    const s = await ie(i.camera, {
      preferDataUrl: !!e.broadcastLiveFrame
    });
    s && b(i, o) && (await ((l = i.updateLiveFrame) == null ? void 0 : l.call(i, s)), o.broadcast !== !1 && ((d = e.broadcastLiveFrame) == null || d.call(e, e.normalizeCamera(i.camera), s)));
  }
  function b(i, o = {}) {
    return !(document.visibilityState === "hidden" || o.requireRendered && (i == null ? void 0 : i.rendered) === !1);
  }
  function M(i, o = {}) {
    !b(i, o) || i != null && i.liveFrameRefreshPending || (i.liveFrameRefreshPending = !0, me(i, o).finally(() => {
      i.liveFrameRefreshPending = !1;
    }));
  }
  function I(i) {
    i && (i.liveFrameTimer && window.clearInterval(i.liveFrameTimer), i.liveFrameVisibilityHandler && document.removeEventListener("visibilitychange", i.liveFrameVisibilityHandler), i.liveFrameTimer = null, i.liveFrameVisibilityHandler = null, i.liveFrameRefreshPending = !1);
  }
  function p(i) {
    S(i), n(i == null ? void 0 : i.camera) && e.isFrameProducer() && (i.liveFrameVisibilityHandler = () => M(i, {
      broadcast: !1,
      requireRendered: !0
    }), document.addEventListener("visibilitychange", i.liveFrameVisibilityHandler), M(i, {
      broadcast: !1,
      requireRendered: !0
    }), i.liveFrameTimer = window.setInterval(() => {
      M(i, {
        broadcast: !1,
        requireRendered: !0
      });
    }, Ge));
  }
  function S(i) {
    I(i);
  }
  function E(i) {
    T(), n(i) && e.isFrameProducer() && (r = {
      camera: e.normalizeCamera(i),
      liveFrameRefreshPending: !1,
      liveFrameTimer: null,
      liveFrameVisibilityHandler: null
    }, r.liveFrameVisibilityHandler = () => M(r), document.addEventListener("visibilitychange", r.liveFrameVisibilityHandler), M(r), r.liveFrameTimer = window.setInterval(() => {
      M(r);
    }, Ge));
  }
  function T() {
    I(r), r = null;
  }
  return {
    captureLiveFrame: ie,
    startBroadcastLiveRefresh: E,
    startLocalLiveRefresh: p,
    stopBroadcastLiveRefresh: T,
    stopLocalLiveRefresh: S
  };
}
const U = "security-cameras", Ze = `module.${U}`, Pt = `modules/${U}/templates/monitor.hbs`, Tt = `modules/${U}/templates/feed.hbs`;
function ae() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function oe(e) {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : JSON.parse(JSON.stringify(e));
}
function et(e) {
  var r;
  if ((r = foundry == null ? void 0 : foundry.utils) != null && r.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
const tt = vt(U, {
  socketName: Ze,
  title: "Security Cameras"
});
let L = null, O = null, A = "", X = "";
const Wt = 1250;
function D(e = {}, t = {}) {
  return Ae(e, { ...t, createId: ae });
}
function Ne(e = {}, t = {}) {
  return bt(e, { ...t, createId: ae });
}
function Bt(e) {
  var t, r;
  return e ? ((r = (t = game.scenes) == null ? void 0 : t.get(e)) == null ? void 0 : r.name) ?? "Unknown Scene" : "Unassigned Scene";
}
function rt(e = "") {
  var r;
  const t = pe(e);
  return String(((r = t == null ? void 0 : t.background) == null ? void 0 : r.src) ?? (t == null ? void 0 : t.img) ?? (t == null ? void 0 : t.thumb) ?? "").trim();
}
function kt(e = "") {
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
function pe(e = "") {
  var t;
  return e ? ((t = game.scenes) == null ? void 0 : t.get(e)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
}
function Yt(e = "") {
  var n;
  const t = pe(e);
  return (((n = t == null ? void 0 : t.regions) == null ? void 0 : n.contents) ?? []).map((a) => ({
    id: a.id,
    name: a.name || `Region ${a.id}`,
    region: a
  })).sort((a, c) => a.name.localeCompare(c.name));
}
function Xt(e = "", t = "") {
  return [
    { id: "", name: "No Linked Region", selected: !t },
    ...Yt(e).map((r) => ({
      id: r.id,
      name: r.name,
      selected: r.id === t
    }))
  ];
}
function it(e = "", t = "") {
  var n, a;
  if (!e) return null;
  const r = pe(t);
  return ((a = (n = r == null ? void 0 : r.regions) == null ? void 0 : n.get) == null ? void 0 : a.call(n, e)) ?? null;
}
function jt(e) {
  var u, m, v, y;
  const t = (e == null ? void 0 : e.object) ?? ((v = (m = (u = canvas == null ? void 0 : canvas.regions) == null ? void 0 : u.placeables) == null ? void 0 : m.find) == null ? void 0 : v.call(m, (C) => {
    var R;
    return ((R = C.document) == null ? void 0 : R.id) === (e == null ? void 0 : e.id);
  })), r = t == null ? void 0 : t.bounds;
  if (r != null && r.width && (r != null && r.height))
    return xe(r);
  const n = e == null ? void 0 : e.bounds;
  if (n != null && n.width && (n != null && n.height))
    return xe(n);
  const a = ((y = e == null ? void 0 : e.toObject) == null ? void 0 : y.call(e)) ?? e, c = Array.isArray(e == null ? void 0 : e.shapes) ? e.shapes : Array.isArray(a == null ? void 0 : a.shapes) ? a.shapes : [];
  return It(c);
}
function Fe(e) {
  const t = it(e.regionId, e.sceneId), r = jt(t);
  return r ? {
    ...e,
    ...r
  } : e;
}
function Ee() {
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
function Re(e, t) {
  return e.map((r) => ({
    ...r,
    selected: r.value === t
  }));
}
function ge(e = {}) {
  const t = D(e), r = (/* @__PURE__ */ new Date()).toLocaleString(), n = t.status === "online", a = t.status === "offline", c = t.status === "corrupted", u = t.status === "restricted", m = t.feedSource === "live";
  return {
    ...t,
    sceneName: Bt(t.sceneId),
    sceneBackground: rt(t.sceneId),
    regionAspect: t.regionWidth && t.regionHeight ? `${t.regionWidth} / ${t.regionHeight}` : "16 / 9",
    timestamp: r,
    signalLabel: n ? "SIGNAL LOCK" : c ? "SIGNAL CORRUPTED" : u ? "ACCESS DENIED" : "NO SIGNAL",
    isOnline: n,
    isOffline: a,
    isCorrupted: c,
    isRestricted: u,
    isLive: m,
    isImage: !m,
    hasRegion: Number.isFinite(t.regionX) && Number.isFinite(t.regionY),
    canDisplayImage: !!(t.image && !m && !a && !u),
    canUseImageFallback: !!(t.image && m && !a && !u),
    statusClass: `security-camera-status-${t.status}`,
    sourceClass: `security-camera-source-${t.feedSource}`,
    displayClass: `security-camera-display-${t.displayMode}`
  };
}
function Q() {
  const e = game.settings.get(U, "cameras");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function nt() {
  return Object.values(Q()).map(D).sort((e, t) => e.name.localeCompare(t.name));
}
function k(e) {
  const t = String(e ?? "");
  if (!t) return null;
  const r = Q()[t];
  return r ? D(r) : null;
}
async function se(e) {
  await game.settings.set(U, "cameras", e), await nr();
}
function q(e = "manage security cameras") {
  var t, r, n;
  return (t = game.user) != null && t.isGM ? !0 : ((n = (r = ui.notifications) == null ? void 0 : r.warn) == null || n.call(r, `Only the GM can ${e}.`), !1);
}
function ce(e) {
  return tt.emit(e);
}
async function Gt(e = {}) {
  var a, c;
  if (!q("register security cameras")) return null;
  const t = Ne(e);
  if (!t.ok)
    return (c = (a = ui.notifications) == null ? void 0 : a.error) == null || c.call(a, t.errors.join(" ")), null;
  const r = Fe(t.camera), n = oe(Q());
  return n[r.id] = r, A = r.id, X = r.id, await se(n), r;
}
async function at(e) {
  var u, m;
  if (!q("delete security cameras")) return !1;
  const t = String(e ?? A ?? "");
  if (!t || !k(t))
    return (m = (u = ui.notifications) == null ? void 0 : u.warn) == null || m.call(u, "Select a camera to delete."), !1;
  const r = k(t);
  if (!(typeof Dialog < "u" ? await Dialog.confirm({
    title: "Delete Security Camera",
    content: `<p>Delete camera <strong>${et(r.name)}</strong>?</p>`,
    yes: () => !0,
    no: () => !1,
    defaultYes: !1
  }) : window.confirm(`Delete camera "${r.name}"?`))) return !1;
  const a = oe(Q());
  return delete a[t], A = Object.keys(a)[0] ?? "", X = A, await se(a), !0;
}
async function ot(e) {
  var a, c;
  if (!q("duplicate security cameras")) return null;
  const t = k(e || A);
  if (!t)
    return (c = (a = ui.notifications) == null ? void 0 : a.warn) == null || c.call(a, "Select a camera to duplicate."), null;
  const r = D({
    ...t,
    id: ae(),
    name: `${t.name} Copy`
  }), n = oe(Q());
  return n[r.id] = r, A = r.id, X = r.id, await se(n), r;
}
async function st() {
  var r, n;
  if (!q("create security cameras")) return null;
  const e = D({
    ...Ee(),
    id: ae(),
    name: "New Camera",
    location: "Unlabeled Location"
  }), t = oe(Q());
  return t[e.id] = Fe(e), A = e.id, X = e.id, await se(t), (n = (r = ui.notifications) == null ? void 0 : r.info) == null || n.call(r, "New security camera created."), e;
}
function Vt(e) {
  const t = new FormData(e), r = String(t.get("originalId") ?? "").trim(), n = String(t.get("id") ?? "").trim() || r || ae();
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
async function Dt(e) {
  var u, m, v, y;
  if (!q("save security cameras")) return null;
  const { originalId: t, camera: r } = Vt(e), n = Ne(r);
  if (!n.ok)
    return (m = (u = ui.notifications) == null ? void 0 : u.error) == null || m.call(u, n.errors.join(" ")), null;
  const a = Fe(n.camera), c = oe(Q());
  return t && t !== a.id && delete c[t], c[a.id] = a, A = a.id, X = a.id, await se(c), (y = (v = ui.notifications) == null ? void 0 : v.info) == null || y.call(v, "Security camera saved."), a;
}
function Ht(e = A) {
  var r, n, a, c, u, m, v, y;
  const t = k(e);
  if (!Number.isFinite(t == null ? void 0 : t.regionX) || !Number.isFinite(t == null ? void 0 : t.regionY)) {
    (n = (r = ui.notifications) == null ? void 0 : r.warn) == null || n.call(r, "This camera does not have a region yet.");
    return;
  }
  if (t.sceneId && ((a = canvas.scene) == null ? void 0 : a.id) !== t.sceneId) {
    (u = (c = ui.notifications) == null ? void 0 : c.warn) == null || u.call(c, "Activate the camera's scene before panning to its region.");
    return;
  }
  (y = canvas.animatePan) == null || y.call(canvas, {
    x: t.regionX + t.regionWidth / 2,
    y: t.regionY + t.regionHeight / 2,
    scale: ((v = (m = canvas.stage) == null ? void 0 : m.scale) == null ? void 0 : v.x) ?? 1,
    duration: 500
  });
}
function be(e, t = null) {
  var r;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (r = e.element) != null && r[0] ? e.element[0] : e.element ?? null;
}
function qt() {
  const e = nt();
  !A && e.length && (A = e[0].id), X === null && (X = A);
  const t = k(A), r = X === "" ? Ee() : k(X) ?? Ee(), n = ge(r);
  return {
    cameras: e.map((a) => ({
      ...ge(a),
      isSelected: a.id === A
    })),
    selectedCamera: t ? ge(t) : null,
    editorCamera: n,
    sceneChoices: kt(r.sceneId),
    regionChoices: Xt(r.sceneId, r.regionId),
    feedSourceChoices: Re(Ft, r.feedSource),
    statusChoices: Re(wt, r.status),
    displayModeChoices: Re(pt, r.displayMode),
    showStaticImageField: r.feedSource === "image",
    hasCameras: e.length > 0,
    isNewCamera: !r.id
  };
}
function zt(e) {
  var n, a, c;
  if (typeof FilePicker > "u") {
    (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Foundry FilePicker is not available.");
    return;
  }
  const t = (c = e == null ? void 0 : e.elements) == null ? void 0 : c.image;
  new FilePicker({
    type: "image",
    current: (t == null ? void 0 : t.value) ?? "",
    callback: (u) => {
      t && (t.value = u);
    }
  }).browse();
}
function Kt(e, t = null) {
  var a, c;
  const r = be(e, t);
  if (!r) return;
  const n = r.querySelector("[data-security-camera-form]");
  n == null || n.addEventListener("submit", async (u) => {
    u.preventDefault(), await Dt(n);
  }), (c = (a = n == null ? void 0 : n.elements) == null ? void 0 : a.feedSource) == null || c.addEventListener("change", () => {
    const u = n.querySelector("[data-security-camera-static-image-field]");
    u && (u.hidden = n.elements.feedSource.value !== "image");
  }), r.querySelectorAll("[data-security-camera-id]").forEach((u) => {
    u.addEventListener("click", async (m) => {
      A = m.currentTarget.dataset.securityCameraId, X = A, await e.render(!0);
    });
  }), r.querySelectorAll("[data-security-camera-action]").forEach((u) => {
    u.addEventListener("click", async (m) => {
      const v = m.currentTarget.dataset.securityCameraAction;
      if (v === "new") {
        await st();
        return;
      }
      if (v === "duplicate") {
        await ot(A);
        return;
      }
      if (v === "delete") {
        await at(A);
        return;
      }
      if (v === "browse-image") {
        zt(n);
        return;
      }
      if (v === "pan-region") {
        Ht(A);
        return;
      }
      if (v === "show") {
        await lt(A);
        return;
      }
      if (v === "close-feed") {
        mt();
        return;
      }
    });
  });
}
function ct(e) {
  var a, c;
  const t = (e == null ? void 0 : e.camera) ?? {}, r = he(t.displayMode, Le, P.displayMode), n = be(e);
  if (n == null || n.classList.toggle("security-camera-feed-display-window", r === "window"), n == null || n.classList.toggle("security-camera-feed-display-pip", r === "picture-in-picture"), r === "picture-in-picture") {
    const u = Number(t.regionWidth) && Number(t.regionHeight) ? Number(t.regionWidth) / Number(t.regionHeight) : 1.7777777777777777, m = Math.min(620, Math.max(360, window.innerWidth * 0.42)), v = Math.min(460, Math.max(260, window.innerHeight * 0.38));
    let y = m, C = y / u;
    C > v && (C = v, y = C * u);
    const R = Math.round(C + 112);
    (a = e.setPosition) == null || a.call(e, {
      left: Math.max(12, window.innerWidth - y - 24),
      top: Math.max(12, window.innerHeight - R - 84),
      width: Math.round(y),
      height: R
    });
    return;
  }
  (c = e.setPosition) == null || c.call(e, {
    width: 720,
    height: 520
  });
}
function Jt(e, t = null) {
  be(e, t) && (ct(e), J.startLocalLiveRefresh(e), ir(e));
}
const J = _t({
  applyLinkedRegionBounds: Fe,
  broadcastLiveFrame: (e, t) => {
    var r;
    !((r = game.user) != null && r.isGM) || !(e != null && e.id) || !t || ce({
      action: "updateFeedFrame",
      gmUserId: game.user.id,
      cameraId: e.id,
      liveFrame: t
    });
  },
  getRegionDocument: it,
  getSceneBackgroundPath: rt,
  getSceneById: pe,
  isFrameProducer: () => {
    var e;
    return !!((e = game.user) != null && e.isGM);
  },
  moduleId: U,
  normalizeCamera: D
}), { SecurityMonitor: Qt, CameraFeed: Zt } = At({
  moduleId: U,
  monitorTemplatePath: Pt,
  feedTemplatePath: Tt,
  escapeHTML: et,
  getMonitorContext: qt,
  prepareCamera: ge,
  bindMonitorControls: Kt,
  bindFeedControls: Jt,
  getElement: be,
  liveFrameController: J,
  clearActiveMonitor: (e) => {
    L === e && (L = null);
  },
  clearActiveFeed: (e) => {
    O === e && (O = null);
  }
});
async function ut() {
  var e;
  return q("open the Security Camera Manager") ? L ? ((e = L.bringToFront) == null || e.call(L), L) : (L = new Qt(), await L.render(!0), L) : null;
}
async function er() {
  if (!L) return;
  const e = L;
  L = null, await e.close();
}
async function Oe(e, t = {}) {
  const r = D(e);
  return await Ue(), O = new Zt(r, {
    liveFrame: t.liveFrame ?? ""
  }), await O.render(!0), ct(O), O;
}
async function Ue() {
  if (!O) return;
  const e = O;
  O = null, dt(e), await e.close();
}
async function lt(e) {
  var n, a;
  if (!q("broadcast camera feeds")) return null;
  const t = k(e);
  if (!t)
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Security camera not found."), null;
  const r = await J.captureLiveFrame(t, {
    preferDataUrl: !0
  });
  return ce({
    action: "showFeed",
    gmUserId: game.user.id,
    camera: t,
    liveFrame: r
  }), J.startBroadcastLiveRefresh(t), Oe(t, { liveFrame: r });
}
async function tr(e, t = {}) {
  var a, c, u, m, v, y;
  const r = k(e);
  if (!r)
    return (c = (a = ui.notifications) == null ? void 0 : a.warn) == null || c.call(a, "Security camera not found."), null;
  if (!_e((u = game.user) == null ? void 0 : u.id, e))
    return (v = (m = ui.notifications) == null ? void 0 : m.warn) == null || v.call(m, "You do not have access to this camera feed."), null;
  let n = String(t.liveFrame ?? "");
  return (y = game.user) != null && y.isGM && !n && (n = await J.captureLiveFrame(r, {
    preferDataUrl: !0
  })), Oe(r, { liveFrame: n });
}
function He(e) {
  var t;
  ce({
    action: "requestLiveFrame",
    userId: (t = game.user) == null ? void 0 : t.id,
    cameraId: e
  });
}
function rr(e) {
  var t;
  return !((t = game.user) != null && t.isGM) && (e == null ? void 0 : e.feedSource) === "live" && e.status !== "offline" && e.status !== "restricted";
}
function ir(e) {
  dt(e), rr(e == null ? void 0 : e.camera) && (He(e.camera.id), e.remoteLiveFrameTimer = window.setInterval(() => {
    He(e.camera.id);
  }, Wt));
}
function dt(e) {
  e != null && e.remoteLiveFrameTimer && (window.clearInterval(e.remoteLiveFrameTimer), e.remoteLiveFrameTimer = null);
}
function _e(e, t) {
  var n, a, c, u;
  const r = k(t);
  return r ? (n = game.user) != null && n.isGM || (u = (c = (a = game.users) == null ? void 0 : a.get) == null ? void 0 : c.call(a, e)) != null && u.isGM ? !0 : r.status !== "offline" && r.status !== "restricted" : !1;
}
function mt() {
  q("close player camera feeds") && (ce({
    action: "closeFeed",
    gmUserId: game.user.id
  }), J.stopBroadcastLiveRefresh(), Ue());
}
async function nr() {
  L && await L.render(!0);
}
async function ar(e) {
  var r, n, a, c, u, m, v;
  if (!e || typeof e != "object") return;
  const t = tt.isGMSender(e.gmUserId);
  if (e.action === "requestLiveFrame") {
    if (!((r = game.user) != null && r.isGM)) return;
    const y = String(e.cameraId ?? ""), C = String(e.userId ?? ""), R = k(y);
    if (!R || !C || !_e(C, y)) return;
    const w = await J.captureLiveFrame(R, {
      preferDataUrl: !0
    });
    if (!w) return;
    ce({
      action: "updateFeedFrame",
      gmUserId: game.user.id,
      cameraId: y,
      recipientUserId: C,
      liveFrame: w
    });
    return;
  }
  if (e.action === "showFeed") {
    if ((n = game.user) != null && n.isGM) return;
    if (!t) {
      console.warn(`${U} | Ignoring camera feed socket message without a GM sender.`);
      return;
    }
    const y = Ne(e.camera);
    if (!y.ok) {
      console.warn(`${U} | Ignoring invalid socket camera payload.`, y.errors);
      return;
    }
    await Oe(y.camera, {
      liveFrame: typeof e.liveFrame == "string" ? e.liveFrame : ""
    });
    return;
  }
  if (e.action === "updateFeedFrame") {
    if ((a = game.user) != null && a.isGM || !t) return;
    const y = String(e.recipientUserId ?? "");
    if (y && y !== ((c = game.user) == null ? void 0 : c.id)) return;
    const C = String(e.cameraId ?? "");
    if (!C || ((u = O == null ? void 0 : O.camera) == null ? void 0 : u.id) !== C || typeof e.liveFrame != "string" || !e.liveFrame) return;
    await ((m = O.updateLiveFrame) == null ? void 0 : m.call(O, e.liveFrame));
    return;
  }
  if (e.action === "closeFeed") {
    if ((v = game.user) != null && v.isGM || !t) return;
    await Ue();
  }
}
function or() {
  game.settings.register(U, "cameras", {
    name: "Security Cameras",
    hint: "World-level camera feed definitions for the Security Cameras module.",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  });
}
function sr() {
  const e = {
    openMonitor: ut,
    closeMonitor: er,
    showFeed: lt,
    registerCamera: Gt,
    createNewCamera: st,
    deleteCamera: at,
    duplicateCamera: ot,
    getCameras: nt,
    getCamera: k,
    openCameraFeed: tr,
    hasCameraAccess: _e,
    closeFeed: mt,
    get activeMonitor() {
      return L;
    },
    get activeFeed() {
      return O;
    }
  };
  game.securityCameras = e;
  const t = game.modules.get(U);
  t && (t.api = e);
}
function cr() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: U,
    title: "Security Cameras",
    icon: "fa-solid fa-video",
    premium: !1,
    featureId: U,
    playerVisible: !1,
    description: "Manage camera feeds and broadcast surveillance views.",
    open: () => ut()
  }), !0) : !1;
}
Hooks.once("init", () => {
  or();
});
Hooks.once("ready", () => {
  var e, t;
  sr(), cr(), (t = (e = game.socket) == null ? void 0 : e.on) == null || t.call(e, Ze, ar), console.log(`${U} | Ready. Use game.securityCameras.openMonitor()`);
});
