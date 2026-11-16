var qt = Object.defineProperty;
var Ht = (e, t, i) => t in e ? qt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var X = (e, t, i) => Ht(e, typeof t != "symbol" ? t + "" : t, i);
function Ft(e, t) {
  return !e || !t ? !1 : !!(e.isGM || t.status !== "offline" && t.status !== "restricted");
}
function Ee(e) {
  return JSON.stringify(e);
}
function Jt(e, t = e) {
  const i = `${t} |`;
  return {
    log: (r, ...n) => console.log(i, r, ...n),
    warn: (r, ...n) => console.warn(i, r, ...n),
    error: (r, ...n) => console.error(i, r, ...n)
  };
}
function Kt(e, t = {}) {
  const i = t.socketName ?? `module.${e}`, r = Jt(e, t.title ?? e);
  return {
    socketName: i,
    emit(n) {
      var o;
      const a = (o = globalThis.game) == null ? void 0 : o.socket;
      return a != null && a.emit ? (a.emit(i, n), !0) : (r.warn("Foundry socket is unavailable.", n), !1);
    },
    isGMSender(n) {
      var a, o, u;
      return n ? !!((u = (o = (a = globalThis.game) == null ? void 0 : a.users) == null ? void 0 : o.get(String(n))) != null && u.isGM) : !1;
    }
  };
}
const At = /* @__PURE__ */ new Set(["online", "clean", "offline", "corrupted", "restricted"]), $t = /* @__PURE__ */ new Set(["live", "image"]), nt = /* @__PURE__ */ new Set(["window", "picture-in-picture"]), Le = 1200, Ne = 675, Qt = [
  { value: "online", label: "Online" },
  { value: "clean", label: "Clean" },
  { value: "offline", label: "Offline" },
  { value: "corrupted", label: "Corrupted" },
  { value: "restricted", label: "Restricted" }
], Zt = [
  { value: "window", label: "Window" },
  { value: "picture-in-picture", label: "Picture-in-Picture" }
], ei = [
  { value: "live", label: "Live Canvas" },
  { value: "image", label: "Static Image" }
], J = {
  id: "",
  name: "Unnamed Camera",
  sceneId: "",
  levelId: "",
  location: "Unknown Location",
  image: "",
  feedSource: "image",
  status: "online",
  displayMode: "window",
  regionId: "",
  regionX: null,
  regionY: null,
  regionWidth: Le,
  regionHeight: Ne,
  notes: ""
};
function Be(e, t, i) {
  const r = String(e ?? "").trim();
  return t.has(r) ? r : i;
}
function q(e) {
  if (e == null || e === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
function te(e, t) {
  const i = Number(e);
  return Number.isFinite(i) && i > 0 ? i : t;
}
function Mt(e) {
  return e && typeof e == "object" ? e : {};
}
function Ke(e = {}, t = {}) {
  var l;
  const i = Mt(e), r = t.preserveId === !0, n = String(i.id ?? "").trim(), a = r ? n : n || ((l = t.createId) == null ? void 0 : l.call(t)) || "", o = Be(i.feedSource, $t, J.feedSource), u = Be(i.status, At, J.status), y = Be(i.displayMode, nt, J.displayMode);
  return {
    ...J,
    id: a,
    name: String(i.name ?? J.name).trim() || J.name,
    sceneId: String(i.sceneId ?? "").trim(),
    levelId: String(i.levelId ?? "").trim(),
    location: String(i.location ?? J.location).trim() || J.location,
    image: String(i.image ?? "").trim(),
    feedSource: o,
    status: u,
    displayMode: y,
    regionId: String(i.regionId ?? "").trim(),
    regionX: q(i.regionX),
    regionY: q(i.regionY),
    regionWidth: te(i.regionWidth, Le),
    regionHeight: te(i.regionHeight, Ne),
    notes: String(i.notes ?? "").trim()
  };
}
function ti(e = {}, t = {}) {
  const i = Mt(e), r = Ke(i, {
    preserveId: t.requireId === !0,
    createId: t.createId
  }), n = [], a = String(i.feedSource ?? J.feedSource).trim(), o = String(i.status ?? J.status).trim(), u = String(i.displayMode ?? J.displayMode).trim();
  return t.requireId && !r.id && n.push("Camera id is required."), typeof i.name == "string" && !i.name.trim() && n.push("Camera name is required."), $t.has(a) || n.push(`Invalid feed source: ${a}`), At.has(o) || n.push(`Invalid status: ${o}`), nt.has(u) || n.push(`Invalid display mode: ${u}`), {
    ok: n.length === 0,
    camera: Ke(r, { createId: t.createId }),
    errors: n
  };
}
function xt(e) {
  return e && typeof e == "object" ? e : {};
}
function ii(e = {}) {
  const t = xt(e), i = Array.isArray(t.points) ? t.points : [];
  if (i.length >= 4) {
    const l = [], m = [];
    for (let E = 0; E < i.length; E += 2)
      l.push(Number(i[E])), m.push(Number(i[E + 1]));
    const g = Math.min(...l), S = Math.min(...m), d = Math.max(...l), C = Math.max(...m);
    if ([g, S, d, C].every(Number.isFinite))
      return {
        x: g,
        y: S,
        width: d - g,
        height: C - S
      };
  }
  const r = q(t.x) ?? 0, n = q(t.y) ?? 0, a = q(t.radiusX ?? t.radius), o = q(t.radiusY ?? t.radius);
  if (a && o)
    return {
      x: r - a,
      y: n - o,
      width: a * 2,
      height: o * 2
    };
  const u = te(t.width, 0), y = te(t.height, 0);
  return !u || !y ? null : { x: r, y: n, width: u, height: y };
}
function ri(e) {
  const t = e.filter((o) => !!o);
  if (!t.length) return null;
  const i = Math.min(...t.map((o) => o.x)), r = Math.min(...t.map((o) => o.y)), n = Math.max(...t.map((o) => o.x + o.width)), a = Math.max(...t.map((o) => o.y + o.height));
  return {
    x: i,
    y: r,
    width: n - i,
    height: a - r
  };
}
function Qe(e) {
  const t = xt(e), i = te(t.width, Le), r = te(t.height, Ne);
  return !i || !r ? null : {
    regionX: q(t.x) ?? 0,
    regionY: q(t.y) ?? 0,
    regionWidth: i,
    regionHeight: r
  };
}
function ni(e) {
  const t = ri(e.map(ii));
  return t ? Qe(t) : null;
}
function bt(e, t) {
  const i = e.cameras.map((d) => `
    <button type="button" class="security-camera-list-item ${t(d.statusClass)} ${d.isSelected ? "active" : ""}" aria-pressed="${!!d.isSelected}" data-security-camera-id="${t(d.id)}">
      <i class="fa-solid fa-video security-camera-device-icon" aria-hidden="true"></i>
      <span class="security-camera-device-name" title="${t(d.name)}">${t(d.name)}</span>
      <small title="${t(d.location)}">${t(d.location)}</small>
      <span class="security-camera-device-status">${t(d.status)}</span>
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
        ${r.levelName ? `<dt>Level</dt><dd>${t(r.levelName)}</dd>` : ""}
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
  ` : '<section class="security-camera-monitor-preview"><div class="security-camera-empty">No camera selected.</div></section>', a = e.editorCamera, o = e.sceneChoices.map((d) => `<option value="${t(d.id)}" ${d.selected ? "selected" : ""}>${t(d.name)}</option>`).join(""), u = e.levelChoices.map((d) => `<option value="${t(d.id)}" ${d.selected ? "selected" : ""}>${t(d.name)}</option>`).join(""), y = e.regionChoices.map((d) => `<option value="${t(d.id)}" ${d.selected ? "selected" : ""}>${t(d.name)}</option>`).join(""), l = e.feedSourceChoices.map((d) => `<option value="${t(d.value)}" ${d.selected ? "selected" : ""}>${t(d.label)}</option>`).join(""), m = e.statusChoices.map((d) => `<option value="${t(d.value)}" ${d.selected ? "selected" : ""}>${t(d.label)}</option>`).join(""), g = e.displayModeChoices.map((d) => `<option value="${t(d.value)}" ${d.selected ? "selected" : ""}>${t(d.label)}</option>`).join(""), S = `<label data-security-camera-static-image-field ${e.showStaticImageField ? "" : "hidden"}>Static Image <span class="security-camera-path-row"><input type="text" name="image" value="${t(a.image)}"><button type="button" data-security-camera-action="browse-image"><i class="fa-solid fa-folder-open" aria-hidden="true"></i> Browse</button></span></label>`;
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
        <label>ID <input type="text" name="id" value="${t(a.id)}" placeholder="auto-generated"></label>
        <label>Name <input type="text" name="name" value="${t(a.name)}" required></label>
        <label>Location <input type="text" name="location" value="${t(a.location)}"></label>
        </fieldset>
        <fieldset class="security-camera-field-group"><legend>Scene connection</legend>
        <label>Scene <select name="sceneId" ${a.isLive ? "" : "disabled"}>${o}</select></label>
        <label ${e.hasSceneLevels ? "" : "hidden"}>Level <select name="levelId" ${a.isLive ? "" : "disabled"}>${u}</select></label>
        <label>Scene Region <select name="regionId" ${a.isLive ? "" : "disabled"}>${y}</select></label>
        </fieldset>
        <fieldset class="security-camera-field-group"><legend>Feed settings</legend>
        <label>Feed Source <select name="feedSource">${l}</select></label>
        ${S}
        <label>Status <select name="status">${m}</select></label>
        <label>Display Mode <select name="displayMode">${g}</select></label>
        <input type="hidden" name="regionX" value="${t(a.regionX ?? "")}">
        <input type="hidden" name="regionY" value="${t(a.regionY ?? "")}">
        <input type="hidden" name="regionWidth" value="${t(a.regionWidth ?? "")}">
        <input type="hidden" name="regionHeight" value="${t(a.regionHeight ?? "")}">
        <label>Notes <textarea name="notes" rows="3">${t(a.notes)}</textarea></label>
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
function pt(e, t) {
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
function ai() {
  var t, i, r;
  const e = Number(((i = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : i.generation) ?? ((r = game == null ? void 0 : game.release) == null ? void 0 : r.generation));
  return Number.isFinite(e) ? e : null;
}
function si() {
  const e = ai();
  return e === null || e >= 13;
}
function oi() {
  var i, r, n, a, o, u;
  const e = ((r = (i = globalThis.foundry) == null ? void 0 : i.appv1) == null ? void 0 : r.api) ?? ((n = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : n.api) ?? null, t = ((o = (a = globalThis.foundry) == null ? void 0 : a.applications) == null ? void 0 : o.api) ?? ((u = foundry == null ? void 0 : foundry.applications) == null ? void 0 : u.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function ci(e) {
  var _e, pe, s, h;
  const {
    moduleId: t,
    monitorTemplatePath: i,
    feedTemplatePath: r,
    escapeHTML: n,
    getMonitorContext: a,
    prepareCamera: o,
    bindMonitorControls: u,
    bindFeedControls: y,
    getElement: l,
    liveFrameController: m,
    allowDiscardCameraChanges: g,
    clearActiveMonitor: S,
    clearActiveFeed: d
  } = e, C = (pe = (_e = foundry == null ? void 0 : foundry.applications) == null ? void 0 : _e.api) == null ? void 0 : pe.ApplicationV2, E = (h = (s = foundry == null ? void 0 : foundry.applications) == null ? void 0 : s.api) == null ? void 0 : h.HandlebarsApplicationMixin, k = oi(), p = si(), F = [".security-camera-list", ".window-content"];
  function A(c) {
    const f = l(c);
    f != null && f.querySelector && (c.monitorScroll = F.map((b) => {
      var w, v;
      return {
        selector: b,
        top: ((v = (w = f.matches) != null && w.call(f, b) ? f : f.querySelector(b)) == null ? void 0 : v.scrollTop) ?? 0
      };
    }));
  }
  function L(c, f = null) {
    var w;
    const b = l(c, f);
    if (b != null && b.querySelector)
      for (const { selector: v, top: I } of c.monitorScroll ?? []) {
        const M = (w = b.matches) != null && w.call(b, v) ? b : b.querySelector(v);
        M && (M.scrollTop = I);
      }
  }
  function D(c) {
    return typeof c == "string" && c.startsWith("blob:");
  }
  function z(c) {
    D(c == null ? void 0 : c.liveFrameObjectUrl) && typeof URL < "u" && URL.revokeObjectURL(c.liveFrameObjectUrl), c && (c.liveFrameObjectUrl = null);
  }
  function K(c, f) {
    c.lastFrameAt = Date.now(), c.frameError = !1, c.liveFrame !== f && (z(c), c.liveFrame = f, c.liveFrameObjectUrl = D(f) ? f : null);
  }
  class N extends k {
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
      return A(this), a();
    }
    async _renderInner(f) {
      try {
        return await super._renderInner(f);
      } catch (b) {
        return console.warn(`${t} | Monitor template render failed, using inline fallback.`, b), $(bt(f, n));
      }
    }
    activateListeners(f) {
      super.activateListeners(f), u(this, f), L(this, f);
    }
    async close(f) {
      return g() ? (S(this), super.close(f)) : this;
    }
  }
  class T extends k {
    constructor(b, w = {}) {
      super(w);
      X(this, "camera");
      X(this, "liveFrame");
      X(this, "liveFrameObjectUrl");
      X(this, "liveFrameTimer");
      this.camera = o(b), this.liveFrame = w.liveFrame ?? "", this.liveFrameObjectUrl = D(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
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
    async _renderInner(b) {
      try {
        return await super._renderInner(b);
      } catch (w) {
        return console.warn(`${t} | Feed template render failed, using inline fallback.`, w), $(pt({
          ...this.camera,
          liveFrame: this.liveFrame
        }, n));
      }
    }
    activateListeners(b) {
      super.activateListeners(b), y(this, b);
    }
    async updateLiveFrame(b) {
      var M, O;
      K(this, b);
      const w = l(this), v = (M = w == null ? void 0 : w.querySelector) == null ? void 0 : M.call(w, "[data-security-camera-live-frame]"), I = (O = w == null ? void 0 : w.querySelector) == null ? void 0 : O.call(w, "[data-security-camera-live-waiting]");
      if (v) {
        v.getAttribute("src") !== b && (v.src = b), v.hidden = !1, I && (I.hidden = !0);
        return;
      }
      await this.render(!0);
    }
    async close(b) {
      return m.stopLocalLiveRefresh(this), z(this), d(this), super.close(b);
    }
  }
  function _() {
    var c;
    return !p || !C || !E ? null : (c = class extends E(C) {
      async _prepareContext(b) {
        return A(this), {
          ...await super._prepareContext(b),
          ...a()
        };
      }
      async _renderHTML(b, w) {
        try {
          return await super._renderHTML(b, w);
        } catch (v) {
          console.warn(`${t} | Monitor template render failed, using inline fallback.`, v);
          const I = document.createElement("template");
          return I.innerHTML = bt(b, n).trim(), I.content;
        }
      }
      _onRender(b, w) {
        var v;
        (v = super._onRender) == null || v.call(this, b, w), u(this), L(this);
      }
      async close(b) {
        return g() ? (S(this), super.close(b)) : this;
      }
    }, X(c, "DEFAULT_OPTIONS", {
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
    }), X(c, "PARTS", {
      main: {
        template: i
      }
    }), c);
  }
  function ne() {
    var c;
    return !p || !C || !E ? null : (c = class extends E(C) {
      constructor(w, v = {}) {
        super(v);
        X(this, "camera");
        X(this, "liveFrame");
        X(this, "liveFrameObjectUrl");
        X(this, "liveFrameTimer");
        this.camera = o(w), this.liveFrame = v.liveFrame ?? "", this.liveFrameObjectUrl = D(this.liveFrame) ? this.liveFrame : null, this.liveFrameTimer = null;
      }
      async _prepareContext(w) {
        return this.camera = o(this.camera), {
          ...await super._prepareContext(w),
          camera: {
            ...this.camera,
            liveFrame: this.liveFrame,
            hasLiveFrame: !!this.liveFrame
          }
        };
      }
      async _renderHTML(w, v) {
        try {
          return await super._renderHTML(w, v);
        } catch (I) {
          console.warn(`${t} | Feed template render failed, using inline fallback.`, I);
          const M = document.createElement("template");
          return M.innerHTML = pt({
            ...this.camera,
            liveFrame: this.liveFrame
          }, n).trim(), M.content;
        }
      }
      _onRender(w, v) {
        var I;
        (I = super._onRender) == null || I.call(this, w, v), y(this);
      }
      async updateLiveFrame(w) {
        var O, Q;
        K(this, w);
        const v = l(this), I = (O = v == null ? void 0 : v.querySelector) == null ? void 0 : O.call(v, "[data-security-camera-live-frame]"), M = (Q = v == null ? void 0 : v.querySelector) == null ? void 0 : Q.call(v, "[data-security-camera-live-waiting]");
        if (I) {
          I.getAttribute("src") !== w && (I.src = w), I.hidden = !1, M && (M.hidden = !0);
          return;
        }
        await this.render(!0);
      }
      async close(w) {
        return m.stopLocalLiveRefresh(this), z(this), d(this), super.close(w);
      }
    }, X(c, "DEFAULT_OPTIONS", {
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
    }), X(c, "PARTS", {
      main: {
        template: r
      }
    }), c);
  }
  return {
    SecurityMonitor: _() ?? N,
    CameraFeed: ne() ?? T
  };
}
function li(e = 1e3, t = 32) {
  const i = /* @__PURE__ */ new Map();
  return {
    clear() {
      i.clear();
    },
    invalidate(r) {
      for (const n of i.keys()) r(n) && i.delete(n);
    },
    get(r, n, a = e) {
      const o = i.get(r);
      if (o && (o.pending || Date.now() - o.time < a)) return o.promise;
      const u = { time: Date.now(), pending: !0, promise: null };
      for (u.promise = Promise.resolve().then(n).then((y) => (u.pending = !1, u.time = Date.now(), !y && i.get(r) === u && i.delete(r), y), (y) => {
        throw i.get(r) === u && i.delete(r), y;
      }), i.set(r, u); i.size > t; ) i.delete(i.keys().next().value);
      return u.promise;
    }
  };
}
function di(e) {
  const t = (i) => String.fromCharCode(...e.slice(i, i + 4));
  return e.length < 21 || t(0) !== "RIFF" || t(8) !== "WEBP" ? null : t(12) === "VP8X" ? !!(e[20] & 2) : t(12) === "VP8 " || t(12) === "VP8L" ? !1 : null;
}
async function mi(e) {
  if (/\.(gif|apng)(?:[?#]|$)/i.test(e)) return !0;
  if (!/\.webp(?:[?#]|$)|^data:image\/webp[;,]/i.test(e)) return !1;
  const t = new AbortController(), i = window.setTimeout(() => t.abort(), 3e3);
  let r;
  try {
    const n = await fetch(e, { headers: { Range: "bytes=0-31" }, signal: t.signal });
    if (!n.ok || !n.body) return !0;
    r = n.body.getReader();
    const a = new Uint8Array(32);
    let o = 0;
    for (; o < a.length; ) {
      const u = await r.read();
      if (u.done) break;
      const y = Math.min(u.value.length, a.length - o);
      a.set(u.value.subarray(0, y), o), o += y;
    }
    return di(a.subarray(0, o)) ?? !0;
  } catch {
    return !0;
  } finally {
    r == null || r.cancel().catch(() => {
    }), window.clearTimeout(i);
  }
}
function fi(e = 64 * 1024 * 1024, t = 3e3) {
  const i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new Map();
  let a = /* @__PURE__ */ new Set(), o = null;
  function u(m, g) {
    g.pins || (i.delete(m), g.video ? (g.media.pause(), g.media.removeAttribute("src"), g.media.load()) : g.media.src = "");
  }
  function y() {
    const m = new Set([...n.values()].flatMap((S) => [...S]));
    let g = [...i.values()].reduce((S, d) => S + d.bytes, 0);
    for (const [S, d] of [...i].sort((C, E) => C[1].usedAt - E[1].usedAt)) {
      if (d.pins || m.has(d)) continue;
      const C = Date.now() - d.usedAt >= t;
      C && d.video && d.media.pause(), (g > e || i.size > 48 || C) && (g -= d.bytes, u(S, d));
    }
    o !== null && window.clearTimeout(o), o = i.size ? window.setTimeout(y, t) : null;
  }
  function l(m) {
    let g = i.get(m);
    if (g)
      return g.usedAt = Date.now(), g;
    const S = /\.(webm|mp4|m4v|ogv|ogg)(?:[?#]|$)/i.test(m), d = S ? document.createElement("video") : new Image();
    g = { media: d, video: S, bytes: 0, usedAt: Date.now(), pins: 0, promise: null };
    const C = g;
    return C.promise = new Promise((E) => {
      let k = !1;
      const p = async (A) => {
        k || (k = !0, window.clearTimeout(F), d.onload = d.onloadeddata = d.onerror = null, A ? C.bytes = (d.naturalWidth || d.videoWidth || 0) * (d.naturalHeight || d.videoHeight || 0) * 4 : i.delete(m), !A && S && (d.pause(), d.removeAttribute("src"), d.load()), A && !S && r.set(d, await mi(m)), E(A));
      }, F = window.setTimeout(() => p(null), 8e3);
      d.crossOrigin = "anonymous", d.onerror = () => p(null), S ? (d.muted = !0, d.loop = !0, d.playsInline = !0, d.preload = "auto", d.onloadeddata = () => p(d)) : d.onload = () => p(d), d.src = m;
    }), i.set(m, C), C;
  }
  return {
    beginFrame(m) {
      const g = /* @__PURE__ */ new Set();
      return {
        async load(S) {
          if (!S) return null;
          const d = l(S);
          return g.has(d) || (g.add(d), d.pins++), d.promise;
        },
        finish() {
          m && a.has(m) && n.set(m, new Set(g));
          for (const S of g)
            S.pins--, S.usedAt = Date.now();
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
      a = m;
      for (const S of n.keys()) m.has(S) || n.delete(S);
      const g = new Set([...n.values()].flatMap((S) => [...S]));
      for (const S of i.values()) S.video && !S.pins && !g.has(S) && S.media.pause();
    },
    clear() {
      n.clear();
      for (const [m, g] of i) u(m, g);
      o !== null && window.clearTimeout(o), o = null;
    }
  };
}
function gi(e) {
  const t = /* @__PURE__ */ new Map();
  let i = null;
  function r(l) {
    return (l.background || document.visibilityState !== "hidden") && l.active();
  }
  function n() {
    return [...t.values()].some((l) => [...l.consumers.values()].some(r));
  }
  function a() {
    var l;
    (l = e.active) == null || l.call(e, new Set([...t].filter(([, m]) => [...m.consumers.values()].some(r)).map(([m]) => m)));
  }
  async function o(l) {
    if (l.pending) {
      l.rerun = !0;
      return;
    }
    if (![...l.consumers.values()].some(r) || Date.now() - l.lastStarted < e.interval()) return;
    l.lastStarted = Date.now(), l.pending = !0;
    const m = l.generation;
    try {
      const g = await e.capture(l.camera);
      if (!g || m !== l.generation) return;
      for (const S of [...l.consumers.values()]) {
        if (m !== l.generation) break;
        !r(S) || S.lastFrame === g || (await S.deliver(g), S.lastFrame = g);
      }
    } catch (g) {
      e.error(g);
    } finally {
      l.pending = !1, n() || e.idle(), l.rerun && (l.rerun = !1, o(l));
    }
  }
  function u() {
    a();
    let l = !1;
    for (const m of t.values())
      [...m.consumers.values()].some(r) && (l = !0, o(m));
    l || e.idle();
  }
  function y() {
    i !== null && window.clearInterval(i), i = t.size ? window.setInterval(u, Math.min(250, e.interval())) : null, t.size || e.idle();
  }
  return document.addEventListener("visibilitychange", u), {
    subscribe(l, m, g, S = () => !0, d = !1) {
      const C = String(l.id), E = JSON.stringify(l);
      let k = t.get(C);
      if (!k)
        k = { camera: l, version: E, generation: 0, pending: !1, rerun: !1, lastStarted: -1 / 0, consumers: /* @__PURE__ */ new Map() }, t.set(C, k), y();
      else if (k.version !== E) {
        k.camera = l, k.version = E, k.generation++;
        for (const p of k.consumers.values()) p.lastFrame = void 0;
      }
      k.consumers.set(m, { deliver: g, active: S, background: d }), a(), o(k);
    },
    unsubscribe(l) {
      for (const [m, g] of t)
        g.consumers.delete(l), g.consumers.size || (g.generation++, t.delete(m));
      a(), y();
    },
    invalidate(l) {
      for (const m of t.values())
        (!l || !m.camera.sceneId || m.camera.sceneId === l) && m.generation++;
      u();
    },
    reconfigure() {
      for (const l of t.values()) l.lastStarted = -1 / 0;
      y(), u();
    },
    wake: u
  };
}
const Ze = {
  low: { maxDimension: 480, interval: 2500, quality: 0.65 },
  balanced: { maxDimension: 640, interval: 1500, quality: 0.7 },
  high: { maxDimension: 960, interval: 1250, quality: 0.72 }
};
function hi(e = "balanced", t = !0) {
  return { ...Ze[String(e)] ?? Ze.balanced, animateVideo: t };
}
function yi(e, t = 100) {
  const i = ye(e);
  if (!i) return null;
  const r = q(i.x), n = q(i.y);
  return !Number.isFinite(r) || !Number.isFinite(n) ? null : {
    x: r,
    y: n,
    width: te(i.width, 1) * t,
    height: te(i.height, 1) * t
  };
}
function ye(e) {
  if (!e) return null;
  if (e.document) return ye(e.document);
  if (typeof e.toObject == "function") {
    const t = e.toObject();
    if (t && typeof t == "object") return t;
  }
  return e._source && typeof e._source == "object" ? e._source : e;
}
function He(e, t) {
  const i = Math.max(e.x, t.x), r = Math.max(e.y, t.y), n = Math.min(e.x + e.width, t.x + t.width), a = Math.min(e.y + e.height, t.y + t.height), o = n - i, u = a - r;
  return o > 0 && u > 0 ? { x: i, y: r, width: o, height: u } : null;
}
function vi(e, t, i) {
  return {
    dx: (e.x - t.x) / t.width * i.width,
    dy: (e.y - t.y) / t.height * i.height,
    dw: e.width / t.width * i.width,
    dh: e.height / t.height * i.height
  };
}
const V = (e, t = 0) => Number.isFinite(Number(e)) ? Number(e) : t;
function at(e) {
  if (!e) return [];
  const t = e.contents ?? (typeof e.values == "function" ? Array.from(e.values()) : e);
  return Array.isArray(t) ? t.map((i) => (i == null ? void 0 : i.document) ?? i).filter(Boolean) : [];
}
function wi(e, t) {
  return [
    ...e.map((i) => ({ kind: "tile", document: i, data: ye(i) })),
    ...t.map((i) => ({ kind: "token", document: i, data: ye(i) }))
  ].filter((i) => i.data && !i.data.hidden).sort((i, r) => {
    const n = i.data, a = r.data;
    return V(n.elevation, n.overhead ? 1 : 0) - V(a.elevation, a.overhead ? 1 : 0) || (i.kind === "tile" ? 0 : 1) - (r.kind === "tile" ? 0 : 1) || V(n.sort) - V(a.sort);
  });
}
function St(e, t, i = 13) {
  var D, z, K, N, T;
  const r = ye(e);
  if (!r || r.hidden || !(r.width > 0) || !(r.height > 0)) return null;
  let n = V(r.width), a = V(r.height);
  const o = (t == null ? void 0 : t.naturalWidth) || (t == null ? void 0 : t.videoWidth) || n, u = (t == null ? void 0 : t.naturalHeight) || (t == null ? void 0 : t.videoHeight) || a, y = ((D = r.texture) == null ? void 0 : D.fit) ?? "fill", l = y === "cover" ? Math.max(n / o, a / u) : y === "contain" ? Math.min(n / o, a / u) : y === "width" ? n / o : y === "height" ? a / u : null;
  l !== null && (n = o * l, a = u * l);
  const m = V((z = r.texture) == null ? void 0 : z.anchorX, 0.5), g = V((K = r.texture) == null ? void 0 : K.anchorY, 0.5), S = V((N = r.texture) == null ? void 0 : N.scaleX, 1), d = V((T = r.texture) == null ? void 0 : T.scaleY, 1), C = V(r.rotation) * Math.PI / 180, E = i >= 14 ? 0 : 0.5, k = V(r.x) + V(r.width) * E, p = V(r.y) + V(r.height) * E, F = [
    [-n * m, -a * g],
    [n * (1 - m), -a * g],
    [n * (1 - m), a * (1 - g)],
    [-n * m, a * (1 - g)]
  ].map(([_, ne]) => ({
    x: k + _ * S * Math.cos(C) - ne * d * Math.sin(C),
    y: p + _ * S * Math.sin(C) + ne * d * Math.cos(C)
  })), A = Math.min(...F.map((_) => _.x)), L = Math.min(...F.map((_) => _.y));
  return {
    width: n,
    height: a,
    anchorX: m,
    anchorY: g,
    scaleX: S,
    scaleY: d,
    rotation: C,
    cx: k,
    cy: p,
    alpha: Math.max(0, Math.min(1, V(r.alpha, 1))),
    bounds: {
      x: A,
      y: L,
      width: Math.max(...F.map((_) => _.x)) - A,
      height: Math.max(...F.map((_) => _.y)) - L
    }
  };
}
function bi(e, t, i) {
  e.save();
  try {
    e.globalAlpha = i.alpha, e.translate(i.cx, i.cy), e.rotate(i.rotation), e.scale(i.scaleX, i.scaleY), e.drawImage(t, -i.width * i.anchorX, -i.height * i.anchorY, i.width, i.height);
  } finally {
    e.restore();
  }
}
function ve(e, t) {
  var r;
  const i = (e == null ? void 0 : e.levels) ?? ((r = e == null ? void 0 : e._source) == null ? void 0 : r.levels);
  return Array.isArray(i) ? !i.length || i.includes(t) : !(i != null && i.size) || i.has(t);
}
function st(e, t = "", i) {
  if (!(e != null && e.levels)) return null;
  const r = at(e.levels);
  if (t) return r.find((a) => a.id === t) ?? null;
  const n = e.initialLevel ?? r[0];
  return n && ve(i, n.id) ? n : r.find((a) => ve(i, a.id)) ?? null;
}
const It = 18;
function pi(e) {
  const t = fi(), i = li(1e3, 16), r = /* @__PURE__ */ new Set(), n = [], a = /* @__PURE__ */ new Set();
  let o = /* @__PURE__ */ new Set();
  const u = () => {
    var s;
    return ((s = e.getPerformance) == null ? void 0 : s.call(e)) ?? { ...Ze.high, animateVideo: !0 };
  };
  let y = 0;
  const l = /* @__PURE__ */ new Map(), m = (s) => `${y}:${l.get(s) ?? 0}`;
  function g(s) {
    const h = e.normalizeCamera(s);
    return h.feedSource === "live" && h.status !== "offline" && h.status !== "restricted";
  }
  function S(s = "") {
    var b, w, v, I, M;
    const h = e.getSceneById(s), f = (h == null ? void 0 : h.id) && ((b = canvas == null ? void 0 : canvas.scene) == null ? void 0 : b.id) === h.id ? canvas.dimensions : h == null ? void 0 : h.dimensions;
    return {
      x: q((f == null ? void 0 : f.sceneX) ?? ((w = f == null ? void 0 : f.sceneRect) == null ? void 0 : w.x)) ?? 0,
      y: q((f == null ? void 0 : f.sceneY) ?? ((v = f == null ? void 0 : f.sceneRect) == null ? void 0 : v.y)) ?? 0,
      width: te(
        (f == null ? void 0 : f.sceneWidth) ?? ((I = f == null ? void 0 : f.sceneRect) == null ? void 0 : I.width) ?? (f == null ? void 0 : f.width) ?? (h == null ? void 0 : h.width),
        Le
      ),
      height: te(
        (f == null ? void 0 : f.sceneHeight) ?? ((M = f == null ? void 0 : f.sceneRect) == null ? void 0 : M.height) ?? (f == null ? void 0 : f.height) ?? (h == null ? void 0 : h.height),
        Ne
      )
    };
  }
  async function d(s, h) {
    if (!s.toBlob) return s.toDataURL("image/webp", h);
    const c = (b) => new Promise((w, v) => {
      try {
        s.toBlob(w, b, h);
      } catch (I) {
        v(I);
      }
    }), f = await c("image/webp") ?? await c("image/png");
    if (!f) throw new Error("Could not encode the camera frame.");
    return new Promise((b, w) => {
      const v = new FileReader();
      v.onload = () => b(String(v.result)), v.onerror = () => w(v.error ?? new Error("Could not read the camera frame.")), v.readAsDataURL(f);
    });
  }
  async function C(s, h, c, f, b, w) {
    var Ie, Ce, Fe, Ae, $e, le, lt, ut, dt, mt, ft;
    const v = S(s.sceneId), I = Number.isFinite(s.regionX) && Number.isFinite(s.regionY) ? { x: s.regionX, y: s.regionY, width: s.regionWidth, height: s.regionHeight } : v, M = u(), O = Number(((Ce = (Ie = globalThis.game) == null ? void 0 : Ie.release) == null ? void 0 : Ce.generation) ?? 13), Q = Math.min(1, M.maxDimension / I.width, M.maxDimension / I.height), P = Math.max(1, Math.round(I.width * Q)), Y = Math.max(1, Math.round(I.height * Q)), Z = n.pop() ?? document.createElement("canvas");
    Z.width = P, Z.height = Y;
    const j = Z.getContext("2d");
    if (!j) return "";
    const Se = t.beginFrame(o.has(s.id) ? s.id : void 0);
    let me = !1;
    const fe = async (Me, Pe = !0) => {
      const H = await Se.load(Me);
      return (H == null ? void 0 : H.tagName) === "VIDEO" ? M.animateVideo && Pe && (document.visibilityState !== "hidden" || a.size > 0) ? (me = !0, H.play().catch(() => {
      })) : H.pause() : H && t.isAnimated(H) && (me = !0), H;
    };
    try {
      const Me = c ? (Fe = c.background) == null ? void 0 : Fe.color : h.backgroundColor;
      j.fillStyle = typeof Me == "number" ? `#${Me.toString(16).padStart(6, "0")}` : String(Me ?? "#010505"), j.fillRect(0, 0, P, Y);
      const Pe = (c ? (Ae = c.background) == null ? void 0 : Ae.src : e.getSceneBackgroundPath(s.sceneId)) || s.image, H = await fe(Pe);
      if (Pe && !H) throw new Error("Camera background could not be loaded.");
      const gt = at(h.tiles ?? (($e = h._source) == null ? void 0 : $e.tiles)).filter((ge) => !c || ve(ge, c.id)), ht = O >= 14 ? 0.5 : 0, Xe = c ? (le = c.foreground) == null ? void 0 : le.src : h.foreground;
      typeof Xe == "string" && Xe && gt.push({
        x: v.x + v.width * ht,
        y: v.y + v.height * ht,
        width: v.width,
        height: v.height,
        elevation: (c ? (lt = c.elevation) == null ? void 0 : lt.top : h.foregroundElevation) ?? Number.MAX_SAFE_INTEGER,
        sort: -Number.MAX_SAFE_INTEGER,
        texture: { src: Xe }
      });
      const Yt = L(h, f, c), jt = wi(gt, Yt), Gt = E(h), yt = () => j.setTransform(
        P / I.width,
        0,
        0,
        Y / I.height,
        -I.x * P / I.width,
        -I.y * Y / I.height
      );
      yt(), H && j.drawImage(H, v.x, v.y, v.width, v.height);
      for (const ge of jt) {
        if (ge.kind === "token") {
          j.setTransform(1, 0, 0, 1, 0, 0), await A(j, ge.document, ge.data, I, Gt, P, Y, fe);
          continue;
        }
        const se = ge.data, qe = St(se, void 0, O);
        if (!qe || !qe.alpha || (!((ut = se.texture) != null && ut.fit) || se.texture.fit === "fill") && !He(qe.bounds, I)) continue;
        const vt = String(((dt = se.texture) == null ? void 0 : dt.src) ?? se.img ?? "");
        if (!vt) continue;
        const xe = await fe(vt, ((mt = se.video) == null ? void 0 : mt.autoplay) !== !1);
        if (!xe) throw new Error("A camera tile could not be loaded. Check its media path and access.");
        xe.tagName === "VIDEO" && (xe.loop = ((ft = se.video) == null ? void 0 : ft.loop) !== !1);
        const wt = St(se, xe, O);
        He(wt.bounds, I) && (yt(), bi(j, xe, wt));
      }
      const Xt = await d(Z, M.quality);
      return w === m(s.sceneId) && (me ? r.add(b) : r.delete(b)), Xt;
    } finally {
      Se.finish(), n.length < 2 && n.push(Z);
    }
  }
  function E(s) {
    var c, f, b, w, v, I;
    const h = (s == null ? void 0 : s.id) && ((c = canvas == null ? void 0 : canvas.scene) == null ? void 0 : c.id) === s.id;
    return te(
      h ? ((f = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : f.size) ?? ((b = canvas == null ? void 0 : canvas.grid) == null ? void 0 : b.size) ?? ((w = s == null ? void 0 : s.grid) == null ? void 0 : w.size) : ((v = s == null ? void 0 : s.dimensions) == null ? void 0 : v.size) ?? ((I = s == null ? void 0 : s.grid) == null ? void 0 : I.size),
      100
    );
  }
  function k(s) {
    if (!s) return [];
    const h = [
      () => p(s, "Token"),
      () => s.tokens,
      () => {
        var c;
        return (c = s.getEmbeddedDocuments) == null ? void 0 : c.call(s, "Token");
      },
      () => {
        var c;
        return (c = s._source) == null ? void 0 : c.tokens;
      },
      () => {
        var c;
        return (c = s.toObject) == null ? void 0 : c.call(s).tokens;
      }
    ];
    for (const c of h) {
      const f = c();
      if (f != null) return F(f);
    }
    return [];
  }
  function p(s, h) {
    var c;
    try {
      return (c = s == null ? void 0 : s.getEmbeddedCollection) == null ? void 0 : c.call(s, h);
    } catch (f) {
      return console.warn(`${e.moduleId} | Could not read ${h} collection for inactive scene.`, f), null;
    }
  }
  function F(s) {
    return s ? (Array.isArray(s == null ? void 0 : s.contents) ? s.contents : Array.isArray(s) ? s : typeof s.values == "function" ? Array.from(s.values()) : Array.from(s ?? [])).map((c) => Array.isArray(c) ? c[1] : c).map((c) => (c == null ? void 0 : c.document) ?? c).filter(Boolean) : [];
  }
  async function A(s, h, c, f, b, w, v, I) {
    var me, fe, Ie, Ce, Fe, Ae, $e;
    const M = yi(c, b);
    if (!M) return;
    const O = He(M, f);
    if (!O) return;
    const Q = String(((me = h.getTextureSrc) == null ? void 0 : me.call(h)) ?? ((fe = c.texture) == null ? void 0 : fe.src) ?? c.img ?? ((Ie = h.actor) == null ? void 0 : Ie.img) ?? ((Ce = h.baseActor) == null ? void 0 : Ce.img) ?? (($e = (Ae = (Fe = h.actor) == null ? void 0 : Fe.prototypeToken) == null ? void 0 : Ae.texture) == null ? void 0 : $e.src) ?? "").trim(), P = await I(Q), { dx: Y, dy: Z, dw: j, dh: Se } = vi(O, f, { width: w, height: v });
    s.save();
    try {
      if (s.globalAlpha = q(c.alpha) ?? 1, P != null && P.naturalWidth && (P != null && P.naturalHeight)) {
        const le = D(P, M, O);
        s.drawImage(P, le.sx, le.sy, le.sw, le.sh, Y, Z, j, Se);
      } else z(s, c, Y, Z, j, Se);
    } finally {
      s.restore();
    }
  }
  function L(s, h, c) {
    var b;
    if (!c && h && ((b = canvas == null ? void 0 : canvas.scene) == null ? void 0 : b.id) === s.id && "tokens" in Object(h))
      return F(h.tokens);
    const f = k(s);
    return c ? f.filter((w) => {
      var I, M, O;
      const v = w.level ?? ((I = w._source) == null ? void 0 : I.level);
      return (v ? v === c.id : c.id === ((M = s.initialLevel) == null ? void 0 : M.id)) && (!h || ((O = w.testInsideRegion) == null ? void 0 : O.call(w, h)) !== !1);
    }) : f;
  }
  function D(s, h, c) {
    const f = s.naturalWidth / h.width, b = s.naturalHeight / h.height;
    return {
      sx: Math.max(0, (c.x - h.x) * f),
      sy: Math.max(0, (c.y - h.y) * b),
      sw: Math.min(s.naturalWidth, c.width * f),
      sh: Math.min(s.naturalHeight, c.height * b)
    };
  }
  function z(s, h, c, f, b, w) {
    const v = ye(h), I = Math.max(It, b), M = Math.max(It, w), O = c + (b - I) / 2, Q = f + (w - M) / 2, P = Math.min(I, M) / 2, Y = O + I / 2, Z = Q + M / 2;
    s.beginPath(), s.arc(Y, Z, P, 0, Math.PI * 2), s.fillStyle = "rgba(10, 18, 24, 0.82)", s.fill(), s.lineWidth = Math.max(2, Math.min(I, M) * 0.08), s.strokeStyle = "rgba(72, 220, 255, 0.95)", s.stroke();
    const j = String((v == null ? void 0 : v.name) ?? (h == null ? void 0 : h.name) ?? "").trim().slice(0, 2).toUpperCase();
    j && (s.font = `700 ${Math.max(10, Math.round(P * 0.72))}px sans-serif`, s.textAlign = "center", s.textBaseline = "middle", s.fillStyle = "rgba(224, 252, 255, 0.96)", s.fillText(j, Y, Z + 0.5));
  }
  async function K(s = {}, h = {}) {
    var Y;
    const c = e.applyLinkedRegionBounds(e.normalizeCamera(s));
    if (!g(c)) return "";
    const f = e.getSceneById(c.sceneId);
    if (!f) return "";
    const b = (Y = e.getRegionDocument) == null ? void 0 : Y.call(e, c.regionId, f.id), w = st(f, c.levelId, b);
    if (f.levels && (!w || !ve(b, w.id))) return "";
    const v = { ...c, sceneId: f.id, levelId: (w == null ? void 0 : w.id) ?? "" }, I = u(), M = JSON.stringify([v.sceneId, v, I]), O = m(v.sceneId), Q = r.has(M) ? I.interval * 0.8 : 1 / 0, P = await i.get(
      M,
      () => C(v, f, w, b, M, O),
      Q
    );
    return O === m(v.sceneId) ? P : "";
  }
  const N = gi({
    capture: K,
    interval: () => u().interval,
    idle: () => t.pauseVideos(),
    active(s) {
      o = s, t.retainOwners(s);
    },
    error: (s) => console.warn(`${e.moduleId} | Camera refresh failed; retrying.`, s)
  }), T = {};
  function _(s) {
    N.unsubscribe(s);
  }
  function ne(s) {
    _(s), !(!g(s == null ? void 0 : s.camera) || !e.isFrameProducer()) && N.subscribe(s.camera, s, (h) => {
      var c;
      return (c = s.updateLiveFrame) == null ? void 0 : c.call(s, h);
    }, () => {
      var c, f;
      const h = ((c = s.element) == null ? void 0 : c[0]) ?? s.element;
      return s.rendered !== !1 && !s.minimized && !s._minimized && (!h || !h.hidden && ((f = h.style) == null ? void 0 : f.display) !== "none");
    });
  }
  function _e(s) {
    N.unsubscribe(T), !(!g(s) || !e.isFrameProducer()) && N.subscribe(s, T, (h) => {
      var c;
      return (c = e.broadcastLiveFrame) == null ? void 0 : c.call(e, e.normalizeCamera(s), h);
    });
  }
  function pe(s) {
    if (s) {
      l.set(s, (l.get(s) ?? 0) + 1);
      const h = `[${JSON.stringify(s)},`;
      i.invalidate((c) => c.startsWith(h));
      for (const c of r) c.startsWith(h) && r.delete(c);
    } else
      y++, l.clear(), i.clear(), r.clear();
    N.invalidate(s);
  }
  return {
    captureLiveFrame: K,
    invalidateFrames: pe,
    reconfigure() {
      t.pauseVideos(), pe(), N.reconfigure();
    },
    wake: N.wake,
    startBroadcastLiveRefresh: _e,
    stopBroadcastLiveRefresh: () => N.unsubscribe(T),
    startLocalLiveRefresh: ne,
    stopLocalLiveRefresh: _,
    subscribeRemote(s, h, c, f) {
      !g(s) || !e.isFrameProducer() || (a.add(h), N.subscribe(s, h, c, f, !0));
    },
    unsubscribeRemote(s) {
      a.delete(s), N.unsubscribe(s);
    },
    clearRemoteViewers() {
      for (const s of a) N.unsubscribe(s);
      a.clear();
    }
  };
}
const R = "security-cameras", Et = `module.${R}`, Si = `modules/${R}/templates/monitor.hbs`, Ii = `modules/${R}/templates/feed.hbs`;
function Ci() {
  return hi(game.settings.get(R, "cameraQuality"), game.settings.get(R, "animateVideoTiles") !== !1);
}
function et() {
  const e = Number(game.settings.get(R, "videoEffectIntensity")), t = Number.isFinite(e) ? Math.max(0, Math.min(200, e)) / 100 : 0.5, i = document.documentElement;
  i.style.setProperty("--security-camera-effect-intensity", String(t)), i.classList.toggle("security-camera-effects-disabled", t === 0), i.classList.toggle("security-camera-reduced-effects", !!game.settings.get(R, "reducedEffects"));
}
function Fi(e) {
  game.settings.register(R, "cameraQuality", {
    name: "Camera Quality",
    hint: "Low: 480px every 2.5 seconds. Balanced: 640px every 1.5 seconds. High: 960px every 1.25 seconds. Lower settings reduce capture and network work for everyone.",
    scope: "world",
    config: !0,
    type: String,
    default: "balanced",
    choices: { low: "Low", balanced: "Balanced", high: "High" },
    onChange: e
  }), game.settings.register(R, "animateVideoTiles", {
    name: "Animate Video Tiles",
    hint: "Play video backgrounds and tiles in live feeds. Turn this off to use still frames and reduce work on the GM's machine.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0,
    onChange: e
  }), game.settings.register(R, "reducedEffects", {
    name: "Reduced Screen Effects",
    hint: "Remove animated screen effects and image filters on this computer. Camera status and access restrictions still apply.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: et
  }), game.settings.register(R, "videoEffectIntensity", {
    name: "Video Effect Intensity",
    hint: "Adjust static, scanlines, tint, flicker, and glitches for all viewers. Default: 50%. Use 0% to turn effects off or 100% for the original strength. Clean cameras have no effects.",
    scope: "world",
    config: !0,
    type: Number,
    range: { min: 0, max: 200, step: 10 },
    default: 50,
    onChange: et
  }), game.settings.register(R, "cameras", {
    name: "Security Cameras",
    hint: "Saved camera feeds for this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  });
}
function Oe() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function be(e) {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : JSON.parse(JSON.stringify(e));
}
function kt(e) {
  var i;
  if ((i = foundry == null ? void 0 : foundry.utils) != null && i.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
const Rt = Kt(R, {
  socketName: Et,
  title: "Security Cameras"
});
let W = null, x = null, U = "", re = "", we = "", ke = 0, Ve = 0, Re = !1, ue = null;
const Ai = 1e4, ee = /* @__PURE__ */ new Map();
function ie(e = {}, t = {}) {
  return Ke(e, { ...t, createId: Oe });
}
function ze(e = {}, t = {}) {
  return ti(e, { ...t, createId: Oe });
}
function $i(e) {
  var t, i;
  return e ? ((i = (t = game.scenes) == null ? void 0 : t.get(e)) == null ? void 0 : i.name) ?? "Unknown Scene" : "Unassigned Scene";
}
function Mi(e = "") {
  var i;
  const t = ae(e);
  return String(((i = t == null ? void 0 : t.background) == null ? void 0 : i.src) ?? (t == null ? void 0 : t.img) ?? "").trim();
}
function xi(e = "") {
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
function ae(e = "") {
  var t;
  return e ? ((t = game.scenes) == null ? void 0 : t.get(e)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
}
function Dt(e = "", t = "") {
  var n;
  const i = at((n = ae(e)) == null ? void 0 : n.levels).sort((a, o) => a.sort - o.sort), r = [
    { id: "", name: "Automatic", selected: !t },
    ...i.map((a) => ({ id: a.id, name: a.name, selected: a.id === t }))
  ];
  return t && !r.some((a) => a.selected) && r.push({ id: t, name: "Level unavailable", selected: !0 }), r;
}
function Ei(e = "", t = "") {
  var n;
  const i = ae(e);
  return (((n = i == null ? void 0 : i.regions) == null ? void 0 : n.contents) ?? []).filter((a) => !t || ve(a, t)).map((a) => ({
    id: a.id,
    name: a.name || `Region ${a.id}`,
    region: a
  })).sort((a, o) => a.name.localeCompare(o.name));
}
function Lt(e = "", t = "", i = "") {
  const r = [
    { id: "", name: "No Linked Region", selected: !t },
    ...Ei(e, i).map((n) => ({
      id: n.id,
      name: n.name,
      selected: n.id === t
    }))
  ];
  return t && !r.some((n) => n.selected) && r.push({ id: t, name: "Region unavailable", selected: !0 }), r;
}
function je(e = "", t = "") {
  var r, n;
  if (!e) return null;
  const i = ae(t);
  return ((n = (r = i == null ? void 0 : i.regions) == null ? void 0 : r.get) == null ? void 0 : n.call(r, e)) ?? null;
}
function ki(e) {
  var o, u, y, l;
  const t = (e == null ? void 0 : e.object) ?? ((y = (u = (o = canvas == null ? void 0 : canvas.regions) == null ? void 0 : o.placeables) == null ? void 0 : u.find) == null ? void 0 : y.call(u, (m) => {
    var g;
    return ((g = m.document) == null ? void 0 : g.id) === (e == null ? void 0 : e.id);
  })), i = t == null ? void 0 : t.bounds;
  if (i != null && i.width && (i != null && i.height))
    return Qe(i);
  const r = e == null ? void 0 : e.bounds;
  if (r != null && r.width && (r != null && r.height))
    return Qe(r);
  const n = ((l = e == null ? void 0 : e.toObject) == null ? void 0 : l.call(e)) ?? e, a = Array.isArray(e == null ? void 0 : e.shapes) ? e.shapes : Array.isArray(n == null ? void 0 : n.shapes) ? n.shapes : [];
  return ni(a);
}
function Ue(e) {
  const t = je(e.regionId, e.sceneId), i = ki(t);
  return i ? {
    ...e,
    ...i
  } : e;
}
function tt() {
  var t;
  const e = canvas == null ? void 0 : canvas.scene;
  return ie({
    id: "",
    name: "",
    sceneId: (e == null ? void 0 : e.id) ?? "",
    levelId: ((t = canvas == null ? void 0 : canvas.level) == null ? void 0 : t.id) ?? "",
    location: "",
    image: "",
    feedSource: "live",
    status: "online",
    displayMode: "window",
    notes: ""
  }, { preserveId: !0 });
}
function Je(e, t) {
  return e.map((i) => ({
    ...i,
    selected: i.value === t
  }));
}
function We(e = {}) {
  const t = ie(e), i = (/* @__PURE__ */ new Date()).toLocaleString(), r = t.status === "online" || t.status === "clean", n = t.status === "offline", a = t.status === "corrupted", o = t.status === "restricted", u = t.feedSource === "live", y = je(t.regionId, t.sceneId), l = u ? st(ae(t.sceneId), t.levelId, y) : null;
  return {
    ...t,
    sceneName: $i(t.sceneId),
    levelName: u ? (l == null ? void 0 : l.name) ?? (t.levelId ? "Level unavailable" : "") : "",
    regionName: (y == null ? void 0 : y.name) || (t.regionId ? "Region unavailable" : "No region"),
    regionAspect: t.regionWidth && t.regionHeight ? `${t.regionWidth} / ${t.regionHeight}` : "16 / 9",
    timestamp: i,
    signalLabel: r ? "SIGNAL LOCK" : a ? "SIGNAL CORRUPTED" : o ? "ACCESS DENIED" : "NO SIGNAL",
    isOnline: r,
    isOffline: n,
    isCorrupted: a,
    isRestricted: o,
    isLive: u,
    isImage: !u,
    hasRegion: Number.isFinite(t.regionX) && Number.isFinite(t.regionY),
    canDisplayImage: !!(t.image && !u && !n && !o),
    canUseImageFallback: !!(t.image && u && !n && !o),
    statusClass: `security-camera-status-${t.status}`,
    sourceClass: `security-camera-source-${t.feedSource}`,
    displayClass: `security-camera-display-${t.displayMode}`
  };
}
function oe() {
  const e = game.settings.get(R, "cameras");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function Nt() {
  return Object.values(oe()).map(ie).sort((e, t) => e.name.localeCompare(t.name));
}
function G(e) {
  const t = String(e ?? "");
  if (!t) return null;
  const i = oe()[t];
  return i ? ie(i) : null;
}
async function Te(e) {
  var i;
  const t = be(oe());
  await game.settings.set(R, "cameras", e), B.invalidateFrames();
  for (const r of Object.keys(t))
    JSON.stringify(t[r]) !== JSON.stringify(e[r]) && (Wt(r), de({
      action: "cameraChanged",
      gmUserId: game.user.id,
      cameraId: r,
      camera: e[r] ? ie(e[r]) : null
    }), ((i = x == null ? void 0 : x.camera) == null ? void 0 : i.id) === r && (e[r] ? await De(e[r]) : await Ye()), we === r && (ke++, B.stopBroadcastLiveRefresh(), e[r] || (we = "")));
  await ji();
}
function ce(e = "manage security cameras") {
  var t, i, r;
  return (t = game.user) != null && t.isGM ? !0 : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, `Only the GM can ${e}.`), !1);
}
function de(e) {
  return Rt.emit(e);
}
async function Ri(e = {}) {
  var n, a;
  if (!ce("register security cameras")) return null;
  const t = ze(e);
  if (!t.ok)
    return (a = (n = ui.notifications) == null ? void 0 : n.error) == null || a.call(n, t.errors.join(" ")), null;
  const i = Ue(t.camera), r = be(oe());
  return r[i.id] = i, U = i.id, re = i.id, await Te(r), i;
}
async function Ot(e) {
  var o, u;
  if (!ce("delete security cameras")) return !1;
  const t = String(e ?? U ?? "");
  if (!t || !G(t))
    return (u = (o = ui.notifications) == null ? void 0 : o.warn) == null || u.call(o, "Select a camera to delete."), !1;
  const i = G(t);
  if (!(typeof Dialog < "u" ? await Dialog.confirm({
    title: "Delete Security Camera",
    content: `<p>Delete camera <strong>${kt(i.name)}</strong>?</p>`,
    yes: () => !0,
    no: () => !1,
    defaultYes: !1
  }) : window.confirm(`Delete camera "${i.name}"?`))) return !1;
  const n = be(oe());
  return delete n[t], U = Object.keys(n)[0] ?? "", re = U, await Te(n), !0;
}
async function Ut(e) {
  var n, a;
  if (!ce("duplicate security cameras")) return null;
  const t = G(e || U);
  if (!t)
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Select a camera to duplicate."), null;
  const i = ie({
    ...t,
    id: Oe(),
    name: `${t.name} Copy`
  }), r = be(oe());
  return r[i.id] = i, U = i.id, re = i.id, await Te(r), i;
}
async function Tt() {
  var i, r;
  if (!ce("create security cameras")) return null;
  const e = ie({
    ...tt(),
    id: Oe(),
    name: "New Camera",
    location: "Unlabeled Location"
  }), t = be(oe());
  return t[e.id] = Ue(e), U = e.id, re = e.id, await Te(t), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "New security camera created."), e;
}
function _t(e) {
  const t = new FormData(e), i = String(t.get("originalId") ?? "").trim(), r = String(t.get("id") ?? "").trim() || i || Oe();
  return {
    originalId: i,
    camera: ie({
      id: r,
      name: t.get("name"),
      sceneId: e.elements.sceneId.value,
      levelId: e.elements.levelId.value,
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
async function Ct(e) {
  var o, u, y, l, m, g;
  if (!ce("save security cameras") || !(e != null && e.reportValidity())) return null;
  const { originalId: t, camera: i } = _t(e), r = ze(i);
  if (!r.ok)
    return (u = (o = ui.notifications) == null ? void 0 : o.error) == null || u.call(o, r.errors.join(" ")), null;
  const n = Ue(r.camera), a = be(oe());
  return t !== n.id && Object.hasOwn(a, n.id) ? ((l = (y = ui.notifications) == null ? void 0 : y.warn) == null || l.call(y, "That camera ID is already in use. Choose a unique ID."), null) : (t && t !== n.id && delete a[t], Re = !1, ue = null, a[n.id] = n, U = n.id, re = n.id, await Te(a), (g = (m = ui.notifications) == null ? void 0 : m.info) == null || g.call(m, "Security camera saved."), n);
}
async function Di(e = U) {
  var n, a, o, u, y, l, m, g, S, d, C, E, k, p;
  const t = G(e), i = t && Ue(t);
  if (!Number.isFinite(i == null ? void 0 : i.regionX) || !Number.isFinite(i == null ? void 0 : i.regionY)) {
    (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "This camera does not have a region yet.");
    return;
  }
  const r = ae(i.sceneId);
  if (!r || !r.levels && ((o = canvas.scene) == null ? void 0 : o.id) !== r.id) {
    (y = (u = ui.notifications) == null ? void 0 : u.warn) == null || y.call(u, "Activate the camera's scene before panning to its region.");
    return;
  }
  if (r.levels) {
    const F = je(i.regionId, i.sceneId), A = st(r, i.levelId, F);
    if (!A || !ve(F, A.id)) {
      (m = (l = ui.notifications) == null ? void 0 : l.warn) == null || m.call(l, "The camera's level or region is unavailable.");
      return;
    }
    if ((((g = canvas.scene) == null ? void 0 : g.id) !== r.id || ((S = canvas.level) == null ? void 0 : S.id) !== A.id) && await r.view({ level: A.id }), ((d = canvas.scene) == null ? void 0 : d.id) !== r.id || ((C = canvas.level) == null ? void 0 : C.id) !== A.id) return;
  }
  (p = canvas.animatePan) == null || p.call(canvas, {
    x: i.regionX + i.regionWidth / 2,
    y: i.regionY + i.regionHeight / 2,
    scale: ((k = (E = canvas.stage) == null ? void 0 : E.scale) == null ? void 0 : k.x) ?? 1,
    duration: 500
  });
}
function Ge(e, t = null) {
  var i;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (i = e.element) != null && i[0] ? e.element[0] : e.element ?? null;
}
function Li() {
  var n;
  const e = Nt();
  !U && e.length && (U = e[0].id), re === null && (re = U);
  const t = G(U), i = ue ?? (re === "" ? tt() : G(re) ?? tt()), r = We(i);
  return {
    cameras: e.map((a) => ({
      ...We(a),
      isSelected: a.id === U
    })),
    selectedCamera: t ? We(t) : null,
    editorCamera: r,
    originalEditorId: (ue == null ? void 0 : ue.originalId) ?? i.id,
    sceneChoices: xi(i.sceneId),
    levelChoices: Dt(i.sceneId, i.levelId),
    hasSceneLevels: !!((n = ae(i.sceneId)) != null && n.levels) || !!i.levelId,
    regionChoices: Lt(i.sceneId, i.regionId, i.levelId),
    feedSourceChoices: Je(ei, i.feedSource),
    statusChoices: Je(Qt, i.status),
    displayModeChoices: Je(Zt, i.displayMode),
    showStaticImageField: i.feedSource === "image",
    hasCameras: e.length > 0,
    isNewCamera: !i.id,
    editorDirty: Re
  };
}
function Ni(e) {
  var r, n, a;
  if (typeof FilePicker > "u") {
    (n = (r = ui.notifications) == null ? void 0 : r.warn) == null || n.call(r, "The file browser is unavailable.");
    return;
  }
  const t = (a = e == null ? void 0 : e.elements) == null ? void 0 : a.image;
  new FilePicker({
    type: "image",
    current: (t == null ? void 0 : t.value) ?? "",
    callback: (o) => {
      t && (t.value = o, t.dispatchEvent(new Event("input", { bubbles: !0 })));
    }
  }).browse();
}
function it() {
  return Re ? window.confirm("Discard unsaved camera changes?") ? (Re = !1, ue = null, !0) : !1 : !0;
}
function Pt(e) {
  B.stopLocalLiveRefresh(e);
}
function Oi(e, t = null) {
  var y, l, m, g, S, d, C, E, k;
  const i = Ge(e, t);
  if (!i) return;
  const r = i.querySelector("[data-security-camera-form]");
  Pt(e), e.camera = G(U), e.lastFrameAt = null, e.frameError = !1;
  const n = i.querySelector(".security-camera-preview-frame");
  if (((y = e.camera) == null ? void 0 : y.feedSource) === "live" && !["offline", "restricted"].includes(e.camera.status) && n) {
    n.replaceChildren();
    const p = document.createElement("img");
    p.alt = e.camera.name, p.hidden = !0, n.append(p);
    const F = document.createElement("div");
    F.className = "security-camera-placeholder", F.textContent = "Waiting for first frame", n.append(F), e.updateLiveFrame = async (A) => {
      p.getAttribute("src") !== A && (p.src = A), p.hidden = !1, F.hidden = !0, e.lastFrameAt = Date.now(), e.frameError = !1;
    }, B.startLocalLiveRefresh(e);
  }
  const a = () => {
    Re = !0;
    const p = _t(r);
    ue = { ...p.camera, originalId: p.originalId };
    const F = i.querySelector("[data-camera-dirty]");
    F && (F.hidden = !1);
  };
  r == null || r.addEventListener("input", a), r == null || r.addEventListener("change", a);
  const o = (p) => {
    const { sceneId: F, levelId: A, regionId: L } = r.elements;
    if (L.replaceChildren(...Lt(F.value, "", A.value).map((D) => new Option(D.name, D.id, !1, D.id === p))), L.value !== p) {
      for (const D of ["regionX", "regionY"]) r.elements[D].value = "";
      r.elements.regionWidth.value = Le, r.elements.regionHeight.value = Ne;
    }
  };
  (m = (l = r == null ? void 0 : r.elements) == null ? void 0 : l.sceneId) == null || m.addEventListener("change", () => {
    var A;
    const { sceneId: p, levelId: F } = r.elements;
    F.replaceChildren(...Dt(p.value).map((L) => new Option(L.name, L.id))), F.closest("label").hidden = !((A = ae(p.value)) != null && A.levels), o(), a();
  }), (S = (g = r == null ? void 0 : r.elements) == null ? void 0 : g.levelId) == null || S.addEventListener("change", () => {
    o(r.elements.regionId.value), a();
  }), (C = (d = r == null ? void 0 : r.elements) == null ? void 0 : d.regionId) == null || C.addEventListener("change", () => {
    if (!r.elements.regionId.value)
      for (const p of ["regionX", "regionY"]) r.elements[p].value = "";
    a();
  }), r == null || r.addEventListener("submit", async (p) => {
    p.preventDefault(), await Ct(r);
  });
  const u = () => {
    const p = r.elements.feedSource.value === "live";
    r.elements.sceneId.disabled = !p, r.elements.levelId.disabled = !p, r.elements.regionId.disabled = !p;
    const F = r.querySelector("[data-security-camera-static-image-field]");
    F && (F.hidden = r.elements.feedSource.value !== "image");
  };
  u(), (k = (E = r == null ? void 0 : r.elements) == null ? void 0 : E.feedSource) == null || k.addEventListener("change", u), i.querySelectorAll("[data-security-camera-id]").forEach((p) => {
    p.addEventListener("click", async (F) => {
      it() && (U = F.currentTarget.dataset.securityCameraId, re = U, await e.render(!0));
    });
  }), i.querySelectorAll("[data-security-camera-action]").forEach((p) => {
    p.addEventListener("click", async (F) => {
      const A = F.currentTarget.dataset.securityCameraAction;
      if (!(["new", "duplicate", "delete"].includes(A) && !it())) {
        if (A === "new") {
          await Tt();
          return;
        }
        if (A === "duplicate") {
          await Ut(U);
          return;
        }
        if (A === "delete") {
          await Ot(U);
          return;
        }
        if (A === "browse-image") {
          Ni(r);
          return;
        }
        if (A === "pan-region") {
          await Di(U);
          return;
        }
        if (A === "show" || A === "save-show") {
          if (A === "save-show") {
            const L = await Ct(r);
            if (!L) return;
            await rt(L.id);
            return;
          }
          await rt(U);
          return;
        }
        if (A === "close-feed") {
          zt();
          return;
        }
      }
    });
  });
}
function Bt(e) {
  var n, a;
  const t = (e == null ? void 0 : e.camera) ?? {}, i = Be(t.displayMode, nt, J.displayMode), r = Ge(e);
  if (r == null || r.classList.toggle("security-camera-feed-display-window", i === "window"), r == null || r.classList.toggle("security-camera-feed-display-pip", i === "picture-in-picture"), i === "picture-in-picture") {
    const o = Number(t.regionWidth) && Number(t.regionHeight) ? Number(t.regionWidth) / Number(t.regionHeight) : 1.7777777777777777, u = Math.min(620, Math.max(360, window.innerWidth * 0.42)), y = Math.min(460, Math.max(260, window.innerHeight * 0.38));
    let l = u, m = l / o;
    m > y && (m = y, l = m * o);
    const g = Math.round(m + 190);
    l += 48, (n = e.setPosition) == null || n.call(e, {
      left: Math.max(12, window.innerWidth - l - 24),
      top: Math.max(12, window.innerHeight - g - 84),
      width: Math.round(l),
      height: g
    });
    return;
  }
  (a = e.setPosition) == null || a.call(e, {
    width: 720,
    height: 520
  });
}
function Ui(e, t = null) {
  var a, o;
  const i = Ge(e, t);
  if (!i) return;
  Bt(e), B.startLocalLiveRefresh(e), zi(e), e.liveFrame && !e.lastFrameAt && (e.lastFrameAt = Date.now());
  const r = i.querySelector("[data-security-camera-drag]");
  (a = e.feedDragController) == null || a.abort(), r == null || r.addEventListener("pointerdown", (u) => {
    var S, d;
    if (u.button !== 0) return;
    u.preventDefault(), u.stopPropagation(), (S = e.bringToFront) == null || S.call(e);
    const y = i.getBoundingClientRect();
    (d = e.feedDragController) == null || d.abort();
    const l = e.feedDragController = new AbortController(), m = { pointerId: u.pointerId, x: u.clientX, y: u.clientY, left: y.left, top: y.top };
    document.addEventListener("pointermove", (C) => {
      C.pointerId === m.pointerId && n(m.left + C.clientX - m.x, m.top + C.clientY - m.y);
    }, { signal: l.signal });
    const g = (C) => {
      C.pointerId === m.pointerId && l.abort();
    };
    document.addEventListener("pointerup", g, { signal: l.signal }), document.addEventListener("pointercancel", g, { signal: l.signal });
  });
  const n = (u, y) => {
    var l;
    return (l = e.setPosition) == null ? void 0 : l.call(e, {
      left: Math.max(0, Math.min(window.innerWidth - 80, u)),
      top: Math.max(0, Math.min(window.innerHeight - 40, y))
    });
  };
  r == null || r.addEventListener("keydown", (u) => {
    const y = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[u.key];
    if (!y) return;
    u.preventDefault(), u.stopPropagation();
    const l = i.getBoundingClientRect(), m = u.shiftKey ? 40 : 10;
    n(l.left + y[0] * m, l.top + y[1] * m);
  }), (o = i.querySelector("[data-security-camera-close]")) == null || o.addEventListener("click", () => e.close());
}
const B = pi({
  applyLinkedRegionBounds: Ue,
  getRegionDocument: je,
  getSceneBackgroundPath: Mi,
  getSceneById: ae,
  isFrameProducer: () => {
    var e;
    return !!((e = game.user) != null && e.isGM);
  },
  getPerformance: Ci,
  moduleId: R,
  normalizeCamera: ie
}), { SecurityMonitor: Ti, CameraFeed: _i } = ci({
  moduleId: R,
  monitorTemplatePath: Si,
  feedTemplatePath: Ii,
  escapeHTML: kt,
  getMonitorContext: Li,
  prepareCamera: We,
  bindMonitorControls: Oi,
  bindFeedControls: Ui,
  getElement: Ge,
  liveFrameController: B,
  allowDiscardCameraChanges: it,
  clearActiveMonitor: (e) => {
    Pt(e), W === e && (W = null);
  },
  clearActiveFeed: (e) => {
    var t;
    (t = e.feedDragController) == null || t.abort(), ot(e), x === e && (x = null);
  }
});
async function Vt() {
  var e;
  return ce("open the Security Camera Manager") ? W ? ((e = W.bringToFront) == null || e.call(W), W) : (W = new Ti(), await W.render(!0), W) : null;
}
async function Pi() {
  if (!W) return;
  await W.close();
}
async function De(e, t = {}) {
  const i = ie(e), r = x, n = ++Ve;
  if (x = null, r && await r.close(), n !== Ve) return null;
  const a = new _i(i, { liveFrame: t.liveFrame ?? "" });
  return x = a, await a.render(!0), n !== Ve ? (await a.close({}), null) : (Bt(a), a);
}
async function Ye() {
  if (Ve++, !x) return;
  const e = x;
  x = null, ot(e), await e.close();
}
async function rt(e) {
  var n, a;
  if (!ce("broadcast camera feeds")) return null;
  const t = G(e);
  if (!t)
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Security camera not found."), null;
  const i = ++ke;
  B.stopBroadcastLiveRefresh(), we = t.id;
  let r = "";
  try {
    r = await B.captureLiveFrame(t, { preferDataUrl: !0 });
  } catch (o) {
    console.warn(`${R} | Initial frame unavailable.`, o);
  }
  return i !== ke || Ee(G(t.id)) !== Ee(t) ? null : (de({
    action: "showFeed",
    gmUserId: game.user.id,
    camera: t,
    liveFrame: r
  }), De(t, { liveFrame: r }));
}
async function Bi(e, t = {}) {
  var n, a, o, u, y, l;
  const i = G(e);
  if (!i)
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Security camera not found."), null;
  if (!ct((o = game.user) == null ? void 0 : o.id, e))
    return (y = (u = ui.notifications) == null ? void 0 : u.warn) == null || y.call(u, "You do not have access to this camera feed."), null;
  let r = String(t.liveFrame ?? "");
  if ((l = game.user) != null && l.isGM && !r)
    try {
      r = await B.captureLiveFrame(i, { preferDataUrl: !0 });
    } catch (m) {
      console.warn(`${R} | Initial frame unavailable.`, m);
    }
  return De(i, { liveFrame: r });
}
function Vi(e) {
  var t, i;
  de({
    action: "requestLiveFrame",
    userId: (t = game.user) == null ? void 0 : t.id,
    cameraId: e,
    hasFrame: !!(((i = x == null ? void 0 : x.camera) == null ? void 0 : i.id) === e && x.liveFrame)
  });
}
function Wi(e) {
  var t;
  return !((t = game.user) != null && t.isGM) && (e == null ? void 0 : e.feedSource) === "live" && e.status !== "offline" && e.status !== "restricted";
}
function zi(e) {
  if (ot(e), !Wi(e == null ? void 0 : e.camera)) return;
  let t = !1;
  const i = () => {
    document.visibilityState !== "hidden" && !e.minimized && !e._minimized ? (Vi(e.camera.id), t = !0) : t && (de({ action: "unsubscribeFeed", userId: game.user.id, cameraId: e.camera.id }), t = !1);
  };
  e.remoteLiveFrameTimer = window.setInterval(i, Ai), e.remoteVisibilityHandler = i, document.addEventListener("visibilitychange", i), i();
}
function ot(e) {
  var t, i;
  e && (e.remoteLiveFrameTimer && (window.clearInterval(e.remoteLiveFrameTimer), de({ action: "unsubscribeFeed", userId: (t = game.user) == null ? void 0 : t.id, cameraId: (i = e.camera) == null ? void 0 : i.id })), e.remoteVisibilityHandler && document.removeEventListener("visibilitychange", e.remoteVisibilityHandler), e.remoteVisibilityHandler = null, e.remoteLiveFrameTimer = null);
}
function he(e) {
  const t = ee.get(e);
  t && window.clearTimeout(t.timer), ee.delete(e), B.unsubscribeRemote(e);
}
function Wt(e) {
  for (const [t, i] of [...ee]) i.cameraId === e && he(t);
}
function Yi() {
  for (const e of [...ee.keys()]) he(e);
}
function ct(e, t) {
  var r, n;
  const i = G(t);
  return Ft((n = (r = game.users) == null ? void 0 : r.get) == null ? void 0 : n.call(r, e), i);
}
function zt() {
  ce("close player camera feeds") && (de({
    action: "closeFeed",
    gmUserId: game.user.id
  }), ke++, we = "", Yi(), B.stopBroadcastLiveRefresh(), Ye());
}
async function ji() {
  W && await W.render(!0);
}
function Gi(e, t, i) {
  const r = G(e);
  if (!r || Ee(r) !== t) return;
  const n = [...ee.values()].filter((o) => {
    var u, y, l;
    return o.cameraId === e && o.revision === t && Date.now() < o.expires && ((l = (y = (u = game.users) == null ? void 0 : u.get) == null ? void 0 : y.call(u, o.userId)) == null ? void 0 : l.active) && Ft(game.users.get(o.userId), r);
  }), a = (o, u) => {
    if (!o.length) return;
    const y = o.map((l) => l.userId);
    de({
      action: "updateFeedFrame",
      gmUserId: game.user.id,
      cameraId: e,
      revision: t,
      ...y.length === 1 ? { recipientUserId: y[0] } : { recipientUserIds: y },
      ...u
    });
    for (const l of o)
      l.lastFrame = i, l.needsAck = !1;
  };
  a(n.filter((o) => o.lastFrame !== i), { liveFrame: i }), a(n.filter((o) => o.needsAck), { frameUnchanged: !0 });
}
async function Xi(e) {
  var i, r, n, a, o, u, y, l, m, g, S, d, C, E, k;
  if (!e || typeof e != "object") return;
  const t = Rt.isGMSender(e.gmUserId);
  if (e.action === "unsubscribeFeed") {
    (i = game.user) != null && i.isGM && he(`${String(e.userId ?? "")}:${String(e.cameraId ?? "")}`);
    return;
  }
  if (e.action === "requestLiveFrame") {
    if (!((r = game.user) != null && r.isGM)) return;
    const p = (((n = game.users) == null ? void 0 : n.contents) ?? []).filter((T) => T.isGM && T.active).sort((T, _) => T.id.localeCompare(_.id))[0];
    if (p && p.id !== game.user.id) return;
    const F = String(e.cameraId ?? ""), A = String(e.userId ?? ""), L = G(F), D = `${A}:${F}`;
    if (!L || !((u = (o = (a = game.users) == null ? void 0 : a.get) == null ? void 0 : o.call(a, A)) != null && u.active) || L.feedSource !== "live" || !ct(A, F)) {
      he(D);
      return;
    }
    const z = ee.get(D);
    z && window.clearTimeout(z.timer);
    const K = Ee(L), N = {
      userId: A,
      cameraId: F,
      revision: K,
      expires: Date.now() + 3e4,
      needsAck: !0,
      lastFrame: e.hasFrame === !0 ? (z == null ? void 0 : z.lastFrame) ?? "" : "",
      timer: window.setTimeout(() => he(D), 3e4)
    };
    ee.set(D, N), B.subscribeRemote(L, D, (T) => {
      ee.get(D) === N && Gi(F, K, T);
    }, () => {
      var T, _, ne;
      return ee.get(D) === N && Date.now() < N.expires && !!((ne = (_ = (T = game.users) == null ? void 0 : T.get) == null ? void 0 : _.call(T, A)) != null && ne.active);
    });
    return;
  }
  if (e.action === "cameraChanged") {
    if (!t || (y = game.user) != null && y.isGM && e.gmUserId === game.user.id) return;
    const p = e.camera ? ze(e.camera, { requireId: !0 }) : null;
    if (e.camera && (!(p != null && p.ok) || p.camera.id !== e.cameraId)) return;
    Wt(e.cameraId), B.invalidateFrames(), we === e.cameraId && (ke++, B.stopBroadcastLiveRefresh(), p || (we = "")), ((l = x == null ? void 0 : x.camera) == null ? void 0 : l.id) === e.cameraId && (p ? await De(p.camera) : await Ye());
    return;
  }
  if (e.action === "showFeed") {
    if ((m = game.user) != null && m.isGM) return;
    if (!t) {
      console.warn(`${R} | Ignoring camera feed socket message without a GM sender.`);
      return;
    }
    const p = ze(e.camera);
    if (!p.ok) {
      console.warn(`${R} | Ignoring invalid socket camera payload.`, p.errors);
      return;
    }
    await De(p.camera, {
      liveFrame: typeof e.liveFrame == "string" ? e.liveFrame : ""
    });
    return;
  }
  if (e.action === "updateFeedFrame") {
    if ((g = game.user) != null && g.isGM || !t || Array.isArray(e.recipientUserIds) && !e.recipientUserIds.includes((S = game.user) == null ? void 0 : S.id)) return;
    const p = String(e.recipientUserId ?? "");
    if (p && p !== ((d = game.user) == null ? void 0 : d.id)) return;
    const F = String(e.cameraId ?? "");
    if (!F || ((C = x == null ? void 0 : x.camera) == null ? void 0 : C.id) !== F || e.revision !== Ee(ie(x.camera)) || ["offline", "restricted"].includes(x.camera.status)) return;
    if (e.frameUnchanged === !0) {
      x.lastFrameAt = Date.now();
      return;
    }
    if (typeof e.liveFrame != "string" || !e.liveFrame) return;
    await ((E = x.updateLiveFrame) == null ? void 0 : E.call(x, e.liveFrame));
    return;
  }
  if (e.action === "closeFeed") {
    if ((k = game.user) != null && k.isGM || !t) return;
    await Ye();
  }
}
function qi() {
  const e = {
    openMonitor: Vt,
    closeMonitor: Pi,
    showFeed: rt,
    registerCamera: Ri,
    createNewCamera: Tt,
    deleteCamera: Ot,
    duplicateCamera: Ut,
    getCameras: Nt,
    getCamera: G,
    openCameraFeed: Bi,
    hasCameraAccess: ct,
    closeFeed: zt,
    get activeMonitor() {
      return W;
    },
    get activeFeed() {
      return x;
    }
  };
  game.securityCameras = e;
  const t = game.modules.get(R);
  t && (t.api = e);
}
function Hi() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    brandingInApp: !0,
    id: R,
    title: "Security Cameras",
    icon: "fa-solid fa-video",
    premium: !1,
    featureId: R,
    playerVisible: !1,
    description: "Manage camera feeds and broadcast surveillance views.",
    open: () => Vt()
  }), !0) : !1;
}
Hooks.once("init", () => {
  Fi(() => B.reconfigure());
});
Hooks.once("ready", () => {
  var e, t;
  et(), qi(), Hi(), (t = (e = game.socket) == null ? void 0 : e.on) == null || t.call(e, Et, (i) => {
    Xi(i).catch((r) => console.warn(`${R} | Camera message failed.`, r));
  }), console.log(`${R} | Ready. Use game.securityCameras.openMonitor()`);
});
for (const e of [
  "createToken",
  "updateToken",
  "deleteToken",
  "createTile",
  "updateTile",
  "deleteTile",
  "updateScene",
  "createRegion",
  "updateRegion",
  "deleteRegion",
  "createLevel",
  "updateLevel",
  "deleteLevel"
])
  Hooks.on(e, (t) => {
    var r;
    const i = e === "updateScene" ? t.id : (r = t.parent) == null ? void 0 : r.id;
    B.invalidateFrames(i);
  });
Hooks.on("updateActor", (e, t) => {
  var i, r;
  if (Object.keys(t).some((n) => /^(img|name|prototypeToken)(\.|$)/.test(n)))
    for (const n of ((i = game.scenes) == null ? void 0 : i.contents) ?? [])
      [...((r = n.tokens) == null ? void 0 : r.contents) ?? n.tokens ?? []].some((o) => o.actorId === e.id) && B.invalidateFrames(n.id);
});
Hooks.on("updateUser", () => {
  var e, t, i, r;
  for (const n of [...ee.keys()])
    (r = (i = (e = game.users) == null ? void 0 : e.get) == null ? void 0 : i.call(e, (t = ee.get(n)) == null ? void 0 : t.userId)) != null && r.active || he(n);
});
for (const e of ["minimizeApplication", "maximizeApplication", "minimizeApplicationV2", "maximizeApplicationV2"])
  Hooks.on(e, () => {
    var t;
    (t = x == null ? void 0 : x.remoteVisibilityHandler) == null || t.call(x), B.wake();
  });
