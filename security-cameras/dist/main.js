var xe = Object.defineProperty;
var Le = (e, t, n) => t in e ? xe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var T = (e, t, n) => Le(e, typeof t != "symbol" ? t + "" : t, n);
const f = "security-cameras", ee = `module.${f}`, te = `modules/${f}/templates/monitor.hbs`, ne = `modules/${f}/templates/feed.hbs`, ie = /* @__PURE__ */ new Set(["online", "offline", "corrupted", "restricted"]), re = /* @__PURE__ */ new Set(["live", "image"]), B = /* @__PURE__ */ new Set(["window", "picture-in-picture"]), Ee = 1250, ae = 960, E = 1200, A = 675, Ae = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "corrupted", label: "Corrupted" },
  { value: "restricted", label: "Restricted" }
], Ne = [
  { value: "window", label: "Window" },
  { value: "picture-in-picture", label: "Picture-in-Picture" }
], Te = [
  { value: "live", label: "Live Canvas" },
  { value: "image", label: "Static Image" }
], b = {
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
  regionWidth: E,
  regionHeight: A,
  notes: ""
};
let y = null, S = null, h = "", M = "";
const Y = /* @__PURE__ */ new Map();
function X() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function H(e) {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : JSON.parse(JSON.stringify(e));
}
function u(e) {
  var n;
  if ((n = foundry == null ? void 0 : foundry.utils) != null && n.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
function D(e, t, n) {
  const i = String(e ?? "").trim();
  return t.has(i) ? i : n;
}
function p(e) {
  if (e == null || e === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
function w(e, t) {
  const n = Number(e);
  return Number.isFinite(n) && n > 0 ? n : t;
}
function v(e = {}, t = {}) {
  const n = t.preserveId === !0, i = String(e.id ?? "").trim(), r = n ? i : i || X(), s = D(e.feedSource, re, b.feedSource), a = D(e.status, ie, b.status), o = D(e.displayMode, B, b.displayMode);
  return {
    ...b,
    id: r,
    name: String(e.name ?? b.name).trim() || b.name,
    sceneId: String(e.sceneId ?? "").trim(),
    location: String(e.location ?? b.location).trim() || b.location,
    image: String(e.image ?? "").trim(),
    feedSource: s,
    status: a,
    displayMode: o,
    regionId: String(e.regionId ?? "").trim(),
    regionX: p(e.regionX),
    regionY: p(e.regionY),
    regionWidth: w(e.regionWidth, E),
    regionHeight: w(e.regionHeight, A),
    notes: String(e.notes ?? "").trim()
  };
}
function q(e = {}, t = {}) {
  const n = v(e, { preserveId: t.requireId === !0 }), i = [], r = String(e.feedSource ?? b.feedSource).trim(), s = String(e.status ?? b.status).trim(), a = String(e.displayMode ?? b.displayMode).trim();
  return t.requireId && !n.id && i.push("Camera id is required."), typeof e.name == "string" && !e.name.trim() && i.push("Camera name is required."), re.has(r) || i.push(`Invalid feed source: ${r}`), ie.has(s) || i.push(`Invalid status: ${s}`), B.has(a) || i.push(`Invalid display mode: ${a}`), {
    ok: i.length === 0,
    camera: v(n),
    errors: i
  };
}
function He(e) {
  var t, n;
  return e ? ((n = (t = game.scenes) == null ? void 0 : t.get(e)) == null ? void 0 : n.name) ?? "Unknown Scene" : "Unassigned Scene";
}
function se(e = "") {
  var n;
  const t = k(e);
  return String(((n = t == null ? void 0 : t.background) == null ? void 0 : n.src) ?? (t == null ? void 0 : t.img) ?? (t == null ? void 0 : t.thumb) ?? "").trim();
}
function Re(e = "") {
  var n;
  const t = (((n = game.scenes) == null ? void 0 : n.contents) ?? []).map((i) => ({
    id: i.id,
    name: i.name,
    selected: i.id === e
  })).sort((i, r) => i.name.localeCompare(r.name));
  return [
    { id: "", name: "Unassigned Scene", selected: !e },
    ...t
  ];
}
function k(e = "") {
  var t;
  return e ? ((t = game.scenes) == null ? void 0 : t.get(e)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
}
function Oe(e = "") {
  var i;
  const t = k(e);
  return (((i = t == null ? void 0 : t.regions) == null ? void 0 : i.contents) ?? []).map((r) => ({
    id: r.id,
    name: r.name || `Region ${r.id}`,
    region: r
  })).sort((r, s) => r.name.localeCompare(s.name));
}
function _e(e = "", t = "") {
  return [
    { id: "", name: "No Linked Region", selected: !t },
    ...Oe(e).map((n) => ({
      id: n.id,
      name: n.name,
      selected: n.id === t
    }))
  ];
}
function De(e = "", t = "") {
  var i, r;
  if (!e) return null;
  const n = k(t);
  return ((r = (i = n == null ? void 0 : n.regions) == null ? void 0 : i.get) == null ? void 0 : r.call(i, e)) ?? null;
}
function We(e = {}) {
  const t = Array.isArray(e.points) ? e.points : [];
  if (t.length >= 4) {
    const a = [], o = [];
    for (let g = 0; g < t.length; g += 2)
      a.push(Number(t[g])), o.push(Number(t[g + 1]));
    const c = Math.min(...a), d = Math.min(...o), m = Math.max(...a), l = Math.max(...o);
    if ([c, d, m, l].every(Number.isFinite))
      return {
        x: c,
        y: d,
        width: m - c,
        height: l - d
      };
  }
  const n = p(e.x) ?? 0, i = p(e.y) ?? 0, r = w(e.width ?? e.radiusX ?? e.radius, 0), s = w(e.height ?? e.radiusY ?? e.radius, 0);
  return !r || !s ? null : { x: n, y: i, width: r, height: s };
}
function Pe(e) {
  const t = e.filter(Boolean);
  if (!t.length) return null;
  const n = Math.min(...t.map((a) => a.x)), i = Math.min(...t.map((a) => a.y)), r = Math.max(...t.map((a) => a.x + a.width)), s = Math.max(...t.map((a) => a.y + a.height));
  return {
    x: n,
    y: i,
    width: r - n,
    height: s - i
  };
}
function Xe(e) {
  var d, m, l, g;
  const t = (e == null ? void 0 : e.object) ?? ((l = (m = (d = canvas == null ? void 0 : canvas.regions) == null ? void 0 : d.placeables) == null ? void 0 : m.find) == null ? void 0 : l.call(m, (C) => {
    var _;
    return ((_ = C.document) == null ? void 0 : _.id) === (e == null ? void 0 : e.id);
  })), n = t == null ? void 0 : t.bounds;
  if (n != null && n.width && (n != null && n.height))
    return {
      regionX: p(n.x) ?? 0,
      regionY: p(n.y) ?? 0,
      regionWidth: w(n.width, E),
      regionHeight: w(n.height, A)
    };
  const i = e == null ? void 0 : e.bounds;
  if (i != null && i.width && (i != null && i.height))
    return {
      regionX: p(i.x) ?? 0,
      regionY: p(i.y) ?? 0,
      regionWidth: w(i.width, E),
      regionHeight: w(i.height, A)
    };
  const r = ((g = e == null ? void 0 : e.toObject) == null ? void 0 : g.call(e)) ?? e, s = Array.isArray(e == null ? void 0 : e.shapes) ? e.shapes : Array.isArray(r == null ? void 0 : r.shapes) ? r.shapes : [], a = Pe(s.map(We));
  if (!a) return null;
  const o = w(a.width, E), c = w(a.height, A);
  return {
    regionX: p(a.x) ?? 0,
    regionY: p(a.y) ?? 0,
    regionWidth: o,
    regionHeight: c
  };
}
function N(e) {
  const t = De(e.regionId, e.sceneId), n = Xe(t);
  return n ? {
    ...e,
    ...n
  } : e;
}
function G() {
  const e = canvas == null ? void 0 : canvas.scene;
  return v({
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
function U(e, t) {
  return e.map((n) => ({
    ...n,
    selected: n.value === t
  }));
}
function F(e = {}) {
  const t = v(e), n = (/* @__PURE__ */ new Date()).toLocaleString(), i = t.status === "online", r = t.status === "offline", s = t.status === "corrupted", a = t.status === "restricted", o = t.feedSource === "live";
  return {
    ...t,
    sceneName: He(t.sceneId),
    sceneBackground: se(t.sceneId),
    regionAspect: t.regionWidth && t.regionHeight ? `${t.regionWidth} / ${t.regionHeight}` : "16 / 9",
    timestamp: n,
    signalLabel: i ? "SIGNAL LOCK" : s ? "SIGNAL CORRUPTED" : a ? "ACCESS DENIED" : "NO SIGNAL",
    isOnline: i,
    isOffline: r,
    isCorrupted: s,
    isRestricted: a,
    isLive: o,
    isImage: !o,
    hasRegion: Number.isFinite(t.regionX) && Number.isFinite(t.regionY),
    canDisplayImage: !!(t.image && !o && !r && !a),
    canUseImageFallback: !!(t.image && o && !r && !a),
    statusClass: `security-camera-status-${t.status}`,
    sourceClass: `security-camera-source-${t.feedSource}`,
    displayClass: `security-camera-display-${t.displayMode}`
  };
}
function L() {
  const e = game.settings.get(f, "cameras");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function oe() {
  return Object.values(L()).map(v).sort((e, t) => e.name.localeCompare(t.name));
}
function x(e) {
  const t = String(e ?? "");
  if (!t) return null;
  const n = L()[t];
  return n ? v(n) : null;
}
async function R(e) {
  await game.settings.set(f, "cameras", e), await gt();
}
function I(e = "manage security cameras") {
  var t, n, i;
  return (t = game.user) != null && t.isGM ? !0 : ((i = (n = ui.notifications) == null ? void 0 : n.warn) == null || i.call(n, `Only the GM can ${e}.`), !1);
}
function ce(e) {
  var t;
  return (t = game.socket) != null && t.emit ? (game.socket.emit(ee, e), !0) : (console.warn(`${f} | Foundry socket is unavailable.`, e), !1);
}
async function ke(e = {}) {
  var r, s;
  if (!I("register security cameras")) return null;
  const t = q(e);
  if (!t.ok)
    return (s = (r = ui.notifications) == null ? void 0 : r.error) == null || s.call(r, t.errors.join(" ")), null;
  const n = N(t.camera), i = H(L());
  return i[n.id] = n, h = n.id, M = n.id, await R(i), n;
}
async function ue(e) {
  var a, o;
  if (!I("delete security cameras")) return !1;
  const t = String(e ?? h ?? "");
  if (!t || !x(t))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Select a camera to delete."), !1;
  const n = x(t);
  if (!(typeof Dialog < "u" ? await Dialog.confirm({
    title: "Delete Security Camera",
    content: `<p>Delete camera <strong>${u(n.name)}</strong>?</p>`,
    yes: () => !0,
    no: () => !1,
    defaultYes: !1
  }) : window.confirm(`Delete camera "${n.name}"?`))) return !1;
  const r = H(L());
  return delete r[t], h = Object.keys(r)[0] ?? "", M = h, await R(r), !0;
}
async function le(e) {
  var r, s;
  if (!I("duplicate security cameras")) return null;
  const t = x(e || h);
  if (!t)
    return (s = (r = ui.notifications) == null ? void 0 : r.warn) == null || s.call(r, "Select a camera to duplicate."), null;
  const n = v({
    ...t,
    id: X(),
    name: `${t.name} Copy`
  }), i = H(L());
  return i[n.id] = n, h = n.id, M = n.id, await R(i), n;
}
async function de() {
  var n, i;
  if (!I("create security cameras")) return null;
  const e = v({
    ...G(),
    id: X(),
    name: "New Camera",
    location: "Unlabeled Location"
  }), t = H(L());
  return t[e.id] = N(e), h = e.id, M = e.id, await R(t), (i = (n = ui.notifications) == null ? void 0 : n.info) == null || i.call(n, "New security camera created."), e;
}
function Ye(e) {
  const t = new FormData(e), n = String(t.get("originalId") ?? "").trim(), i = String(t.get("id") ?? "").trim() || n || X();
  return {
    originalId: n,
    camera: v({
      id: i,
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
async function Ue(e) {
  var a, o, c, d;
  if (!I("save security cameras")) return null;
  const { originalId: t, camera: n } = Ye(e), i = q(n);
  if (!i.ok)
    return (o = (a = ui.notifications) == null ? void 0 : a.error) == null || o.call(a, i.errors.join(" ")), null;
  const r = N(i.camera), s = H(L());
  return t && t !== r.id && delete s[t], s[r.id] = r, h = r.id, M = r.id, await R(s), (d = (c = ui.notifications) == null ? void 0 : c.info) == null || d.call(c, "Security camera saved."), r;
}
function Ge(e = h) {
  var n, i, r, s, a, o, c, d;
  const t = x(e);
  if (!Number.isFinite(t == null ? void 0 : t.regionX) || !Number.isFinite(t == null ? void 0 : t.regionY)) {
    (i = (n = ui.notifications) == null ? void 0 : n.warn) == null || i.call(n, "This camera does not have a region yet.");
    return;
  }
  if (t.sceneId && ((r = canvas.scene) == null ? void 0 : r.id) !== t.sceneId) {
    (a = (s = ui.notifications) == null ? void 0 : s.warn) == null || a.call(s, "Activate the camera's scene before panning to its region.");
    return;
  }
  (d = canvas.animatePan) == null || d.call(canvas, {
    x: t.regionX + t.regionWidth / 2,
    y: t.regionY + t.regionHeight / 2,
    scale: ((c = (o = canvas.stage) == null ? void 0 : o.scale) == null ? void 0 : c.x) ?? 1,
    duration: 500
  });
}
function O(e, t) {
  var n;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (n = e.element) != null && n[0] ? e.element[0] : e.element ?? null;
}
function me() {
  const e = oe();
  !h && e.length && (h = e[0].id), M === null && (M = h);
  const t = x(h), n = M === "" ? G() : x(M) ?? G(), i = F(n);
  return {
    cameras: e.map((r) => ({
      ...F(r),
      isSelected: r.id === h
    })),
    selectedCamera: t ? F(t) : null,
    editorCamera: i,
    sceneChoices: Re(n.sceneId),
    regionChoices: _e(n.sceneId, n.regionId),
    feedSourceChoices: U(Te, n.feedSource),
    statusChoices: U(Ae, n.status),
    displayModeChoices: U(Ne, n.displayMode),
    showStaticImageField: n.feedSource === "image",
    hasCameras: e.length > 0,
    isNewCamera: !n.id
  };
}
function ge(e) {
  const t = e.cameras.map((l) => `
    <button type="button" class="security-camera-list-item ${l.isSelected ? "active" : ""}" data-security-camera-id="${u(l.id)}">
      <span>${u(l.name)}</span>
      <small>${u(l.location)}</small>
      <i>${u(l.status)}</i>
    </button>
  `).join(""), n = e.selectedCamera, i = n ? `
    <section class="security-camera-monitor-preview ${u(n.statusClass)}">
      <header>
        <div>
          <span class="security-camera-kicker">Selected Feed</span>
          <h3>${u(n.name)}</h3>
        </div>
        <strong>${u(n.status.toUpperCase())}</strong>
      </header>
      <div class="security-camera-preview-frame">
        ${n.canDisplayImage ? `<img src="${u(n.image)}" alt="${u(n.name)}">` : `<div class="security-camera-placeholder">${u(n.isLive ? "LIVE CANVAS FEED" : n.signalLabel)}</div>`}
      </div>
      <dl>
        <dt>Location</dt><dd>${u(n.location)}</dd>
        <dt>Scene</dt><dd>${u(n.sceneName)}</dd>
        <dt>Source</dt><dd>${u(n.feedSource)}</dd>
        <dt>Region</dt><dd>${n.hasRegion ? `${Math.round(n.regionX)}, ${Math.round(n.regionY)} / ${Math.round(n.regionWidth)}x${Math.round(n.regionHeight)}` : "No region"}</dd>
        <dt>Mode</dt><dd>${u(n.displayMode)}</dd>
        <dt>Notes</dt><dd>${u(n.notes || "No notes recorded.")}</dd>
      </dl>
    </section>
  ` : '<section class="security-camera-monitor-preview"><div class="security-camera-empty">No camera selected.</div></section>', r = e.editorCamera, s = e.sceneChoices.map((l) => `<option value="${u(l.id)}" ${l.selected ? "selected" : ""}>${u(l.name)}</option>`).join(""), a = e.regionChoices.map((l) => `<option value="${u(l.id)}" ${l.selected ? "selected" : ""}>${u(l.name)}</option>`).join(""), o = e.feedSourceChoices.map((l) => `<option value="${u(l.value)}" ${l.selected ? "selected" : ""}>${u(l.label)}</option>`).join(""), c = e.statusChoices.map((l) => `<option value="${u(l.value)}" ${l.selected ? "selected" : ""}>${u(l.label)}</option>`).join(""), d = e.displayModeChoices.map((l) => `<option value="${u(l.value)}" ${l.selected ? "selected" : ""}>${u(l.label)}</option>`).join(""), m = `<label data-security-camera-static-image-field ${e.showStaticImageField ? "" : "hidden"}>Static Image <span class="security-camera-path-row"><input type="text" name="image" value="${u(r.image)}"><button type="button" data-security-camera-action="browse-image">Browse</button></span></label>`;
  return `
    <section class="security-camera-manager">
      <aside class="security-camera-monitor-list">
        <header><span class="security-camera-kicker">Network</span><h2>Cameras</h2></header>
        <div class="security-camera-list">${t || '<p class="security-camera-empty">No cameras registered.</p>'}</div>
        <div class="security-camera-list-actions">
          <button type="button" data-security-camera-action="new">New</button>
          <button type="button" data-security-camera-action="duplicate">Duplicate</button>
          <button type="button" data-security-camera-action="delete">Delete</button>
        </div>
      </aside>
      ${i}
      <form class="security-camera-editor" data-security-camera-form>
        <header><span class="security-camera-kicker">Manager</span><h2>${e.isNewCamera ? "Create Camera" : "Edit Camera"}</h2></header>
        <input type="hidden" name="originalId" value="${u(r.id)}">
        <label>ID <input type="text" name="id" value="${u(r.id)}" placeholder="auto-generated"></label>
        <label>Name <input type="text" name="name" value="${u(r.name)}" required></label>
        <label>Scene <select name="sceneId">${s}</select></label>
        <label>Scene Region <select name="regionId">${a}</select></label>
        <label>Location <input type="text" name="location" value="${u(r.location)}"></label>
        <label>Feed Source <select name="feedSource">${o}</select></label>
        ${m}
        <label>Status <select name="status">${c}</select></label>
        <label>Display Mode <select name="displayMode">${d}</select></label>
        <input type="hidden" name="regionX" value="${u(r.regionX ?? "")}">
        <input type="hidden" name="regionY" value="${u(r.regionY ?? "")}">
        <input type="hidden" name="regionWidth" value="${u(r.regionWidth ?? "")}">
        <input type="hidden" name="regionHeight" value="${u(r.regionHeight ?? "")}">
        <label>Notes <textarea name="notes" rows="4">${u(r.notes)}</textarea></label>
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
function he(e) {
  const n = e.isLive && !e.isOffline && !e.isRestricted ? `<img src="${u(e.liveFrame || e.image || "")}" alt="${u(e.name)}" data-security-camera-live-frame ${e.liveFrame || e.image ? "" : "hidden"}><div class="security-camera-feed-warning" data-security-camera-live-waiting ${e.liveFrame || e.image ? "hidden" : ""}>AWAITING LIVE SIGNAL</div>` : e.canDisplayImage ? `<img src="${u(e.image)}" alt="${u(e.name)}">` : `<div class="security-camera-feed-warning">${u(e.signalLabel)}</div>`;
  return `
    <section class="security-camera-feed ${u(e.statusClass)} ${u(e.sourceClass)} ${u(e.displayClass)}">
      <div class="security-camera-feed-static" aria-hidden="true"></div>
      <div class="security-camera-feed-scanline" aria-hidden="true"></div>
      <header class="security-camera-feed-header">
        <div>
          <span class="security-camera-rec"><i></i> REC</span>
          <h2>${u(e.name)}</h2>
          <p>${u(e.location)}</p>
        </div>
        <div class="security-camera-signal">
          <strong>${u(e.signalLabel)}</strong>
          <span aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        </div>
      </header>
      <main class="security-camera-feed-frame" style="--security-camera-region-aspect: ${u(e.regionAspect ?? "16 / 9")};">
        ${n}
      </main>
      <footer class="security-camera-feed-footer">
        <span>${u(e.timestamp)}</span>
        <span>ID ${u(e.id)}</span>
      </footer>
    </section>
  `;
}
function Be(e) {
  var i, r, s;
  if (typeof FilePicker > "u") {
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "Foundry FilePicker is not available.");
    return;
  }
  const t = (s = e == null ? void 0 : e.elements) == null ? void 0 : s.image;
  new FilePicker({
    type: "image",
    current: (t == null ? void 0 : t.value) ?? "",
    callback: (a) => {
      t && (t.value = a);
    }
  }).browse();
}
function fe(e, t) {
  var r, s;
  const n = O(e, t);
  if (!n) return;
  const i = n.querySelector("[data-security-camera-form]");
  i == null || i.addEventListener("submit", async (a) => {
    a.preventDefault(), await Ue(i);
  }), (s = (r = i == null ? void 0 : i.elements) == null ? void 0 : r.feedSource) == null || s.addEventListener("change", () => {
    const a = i.querySelector("[data-security-camera-static-image-field]");
    a && (a.hidden = i.elements.feedSource.value !== "image");
  }), n.querySelectorAll("[data-security-camera-id]").forEach((a) => {
    a.addEventListener("click", async (o) => {
      h = o.currentTarget.dataset.securityCameraId, M = h, await e.render(!0);
    });
  }), n.querySelectorAll("[data-security-camera-action]").forEach((a) => {
    a.addEventListener("click", async (o) => {
      const c = o.currentTarget.dataset.securityCameraAction;
      if (c === "new") {
        await de();
        return;
      }
      if (c === "duplicate") {
        await le(h);
        return;
      }
      if (c === "delete") {
        await ue(h);
        return;
      }
      if (c === "browse-image") {
        Be(i);
        return;
      }
      if (c === "pan-region") {
        Ge(h);
        return;
      }
      if (c === "show") {
        await Ce(h);
        return;
      }
      if (c === "close-feed") {
        Ie();
        return;
      }
    });
  });
}
function ye(e) {
  var r, s;
  const t = (e == null ? void 0 : e.camera) ?? {}, n = D(t.displayMode, B, b.displayMode), i = O(e);
  if (i == null || i.classList.toggle("security-camera-feed-display-window", n === "window"), i == null || i.classList.toggle("security-camera-feed-display-pip", n === "picture-in-picture"), n === "picture-in-picture") {
    const a = Number(t.regionWidth) && Number(t.regionHeight) ? Number(t.regionWidth) / Number(t.regionHeight) : 1.7777777777777777, o = Math.min(620, Math.max(360, window.innerWidth * 0.42)), c = Math.min(460, Math.max(260, window.innerHeight * 0.38));
    let d = o, m = d / a;
    m > c && (m = c, d = m * a);
    const l = Math.round(m + 112);
    (r = e.setPosition) == null || r.call(e, {
      left: Math.max(12, window.innerWidth - d - 24),
      top: Math.max(12, window.innerHeight - l - 84),
      width: Math.round(d),
      height: l
    });
    return;
  }
  (s = e.setPosition) == null || s.call(e, {
    width: 720,
    height: "auto"
  });
}
function pe(e, t) {
  O(e, t) && (ye(e), at(e));
}
function we(e) {
  const t = v(e);
  return t.feedSource === "live" && t.status !== "offline" && t.status !== "restricted";
}
function qe(e) {
  var t, n;
  return !(!(canvas != null && canvas.ready) || !((t = canvas == null ? void 0 : canvas.app) != null && t.renderer) || e.sceneId && ((n = canvas.scene) == null ? void 0 : n.id) !== e.sceneId);
}
function Ve() {
  var n, i, r, s, a;
  const e = (n = canvas == null ? void 0 : canvas.app) == null ? void 0 : n.renderer, t = [
    (i = canvas == null ? void 0 : canvas.app) == null ? void 0 : i.stage,
    canvas == null ? void 0 : canvas.stage
  ].filter(Boolean);
  try {
    for (const o of t) {
      const c = (s = (r = e == null ? void 0 : e.extract) == null ? void 0 : r.canvas) == null ? void 0 : s.call(r, o);
      if (c != null && c.width && (c != null && c.height)) return c;
    }
  } catch (o) {
    console.warn(`${f} | PIXI canvas extraction failed, using renderer view fallback.`, o);
  }
  return (e == null ? void 0 : e.view) ?? ((a = canvas == null ? void 0 : canvas.app) == null ? void 0 : a.view) ?? null;
}
function je(e, t) {
  var a, o, c, d, m, l;
  const n = N(v(t));
  if (!(Number.isFinite(n.regionX) && Number.isFinite(n.regionY)))
    return {
      sx: 0,
      sy: 0,
      sw: e.width,
      sh: e.height
    };
  const r = ((a = canvas.dimensions) == null ? void 0 : a.width) ?? ((o = canvas.scene) == null ? void 0 : o.width) ?? 0, s = ((c = canvas.dimensions) == null ? void 0 : c.height) ?? ((d = canvas.scene) == null ? void 0 : d.height) ?? 0;
  if (r && s && e.width >= r * 0.75 && e.height >= s * 0.75) {
    const g = e.width / r, C = e.height / s;
    return {
      sx: n.regionX * g,
      sy: n.regionY * C,
      sw: n.regionWidth * g,
      sh: n.regionHeight * C
    };
  }
  if ((l = (m = canvas.stage) == null ? void 0 : m.worldTransform) != null && l.apply && typeof PIXI < "u") {
    const g = canvas.stage.worldTransform.apply(new PIXI.Point(n.regionX, n.regionY)), C = canvas.stage.worldTransform.apply(new PIXI.Point(n.regionX + n.regionWidth, n.regionY + n.regionHeight));
    return {
      sx: g.x,
      sy: g.y,
      sw: C.x - g.x,
      sh: C.y - g.y
    };
  }
  return {
    sx: 0,
    sy: 0,
    sw: e.width,
    sh: e.height
  };
}
function ve(e, t) {
  const n = Math.max(0, Math.min(t.width - 1, Math.round(e.sx))), i = Math.max(0, Math.min(t.height - 1, Math.round(e.sy))), r = Math.max(1, Math.min(t.width - n, Math.round(e.sw))), s = Math.max(1, Math.min(t.height - i, Math.round(e.sh)));
  return { sx: n, sy: i, sw: r, sh: s };
}
function ze(e = "") {
  var r, s, a, o, c;
  const t = k(e), i = (t == null ? void 0 : t.id) && ((r = canvas == null ? void 0 : canvas.scene) == null ? void 0 : r.id) === t.id ? canvas.dimensions : null;
  return {
    x: p((i == null ? void 0 : i.sceneX) ?? ((s = i == null ? void 0 : i.sceneRect) == null ? void 0 : s.x)) ?? 0,
    y: p((i == null ? void 0 : i.sceneY) ?? ((a = i == null ? void 0 : i.sceneRect) == null ? void 0 : a.y)) ?? 0,
    width: w((i == null ? void 0 : i.sceneWidth) ?? ((o = i == null ? void 0 : i.sceneRect) == null ? void 0 : o.width) ?? (t == null ? void 0 : t.width), E),
    height: w((i == null ? void 0 : i.sceneHeight) ?? ((c = i == null ? void 0 : i.sceneRect) == null ? void 0 : c.height) ?? (t == null ? void 0 : t.height), A)
  };
}
function Je(e, t) {
  const n = N(v(t));
  if (!(Number.isFinite(n.regionX) && Number.isFinite(n.regionY)))
    return {
      sx: 0,
      sy: 0,
      sw: e.naturalWidth,
      sh: e.naturalHeight
    };
  const r = ze(n.sceneId), s = e.naturalWidth / r.width, a = e.naturalHeight / r.height;
  return {
    sx: (n.regionX - r.x) * s,
    sy: (n.regionY - r.y) * a,
    sw: n.regionWidth * s,
    sh: n.regionHeight * a
  };
}
function be(e) {
  if (!e) return Promise.resolve(null);
  if (Y.has(e)) return Y.get(e);
  const t = new Promise((n) => {
    const i = (a) => n(a), r = () => {
      const a = new Image();
      a.onload = () => i(a), a.onerror = () => i(null), a.src = e;
    }, s = new Image();
    s.crossOrigin = "anonymous", s.onload = () => i(s), s.onerror = r, s.src = e;
  });
  return Y.set(e, t), t;
}
async function Ke(e = {}) {
  const n = se(e.sceneId) || e.image, i = await be(n);
  if (!(i != null && i.naturalWidth) || !(i != null && i.naturalHeight)) return "";
  const r = ve(Je(i, e), {
    width: i.naturalWidth,
    height: i.naturalHeight
  }), s = Math.min(1, ae / r.sw), a = Math.max(1, Math.round(r.sw * s)), o = Math.max(1, Math.round(r.sh * s)), c = document.createElement("canvas");
  c.width = a, c.height = o;
  const d = c.getContext("2d");
  d.drawImage(i, r.sx, r.sy, r.sw, r.sh, 0, 0, a, o), await nt(d, e, r, a, o);
  try {
    return c.toDataURL("image/webp", 0.72);
  } catch (m) {
    return console.warn(`${f} | Scene background crop failed.`, m), "";
  }
}
function Qe(e) {
  var s, a;
  const t = e == null ? void 0 : e.document;
  if (!t) return null;
  const n = ((s = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : s.size) ?? ((a = canvas == null ? void 0 : canvas.grid) == null ? void 0 : a.size) ?? 100, i = p(t.x), r = p(t.y);
  return !Number.isFinite(i) || !Number.isFinite(r) ? null : {
    x: i,
    y: r,
    width: w(t.width, 1) * n,
    height: w(t.height, 1) * n
  };
}
function Ze(e, t) {
  return e.x < t.x + t.width && e.x + e.width > t.x && e.y < t.y + t.height && e.y + e.height > t.y;
}
function et(e) {
  var t;
  return !(!(e != null && e.document) || e.document.hidden && !((t = game.user) != null && t.isGM) || e.visible === !1 || e.renderable === !1 || e.isVisible === !1);
}
function tt(e) {
  var t, n, i, r, s;
  return String(((n = (t = e == null ? void 0 : e.document) == null ? void 0 : t.texture) == null ? void 0 : n.src) ?? ((r = (i = e == null ? void 0 : e.document) == null ? void 0 : i.actor) == null ? void 0 : r.img) ?? ((s = e == null ? void 0 : e.actor) == null ? void 0 : s.img) ?? "").trim();
}
async function nt(e, t, n, i, r) {
  var o, c;
  if (!(canvas != null && canvas.ready) || ((o = canvas.scene) == null ? void 0 : o.id) !== t.sceneId) return;
  const s = N(v(t)), a = {
    x: s.regionX,
    y: s.regionY,
    width: s.regionWidth,
    height: s.regionHeight
  };
  if ([a.x, a.y, a.width, a.height].every(Number.isFinite))
    for (const d of ((c = canvas.tokens) == null ? void 0 : c.placeables) ?? []) {
      if (!et(d)) continue;
      const m = Qe(d);
      if (!m || !Ze(m, a)) continue;
      const l = tt(d), g = await be(l);
      if (!(g != null && g.naturalWidth) || !(g != null && g.naturalHeight)) continue;
      const C = (m.x - a.x) / a.width * i, _ = (m.y - a.y) / a.height * r, Fe = m.width / a.width * i, $e = m.height / a.height * r;
      e.save(), e.globalAlpha = d.document.alpha ?? 1, e.drawImage(g, C, _, Fe, $e), e.restore();
    }
}
function it(e) {
  const t = e.getContext("2d", { willReadFrequently: !0 });
  if (!t) return !1;
  const n = Math.min(48, e.width), i = Math.min(48, e.height), r = t.getImageData(0, 0, n, i).data;
  let s = 0;
  const a = r.length / 4;
  for (let o = 0; o < r.length; o += 4)
    s += r[o] + r[o + 1] + r[o + 2];
  return s / (a * 3) < 3;
}
function rt(e = {}) {
  const t = Ve();
  if (!(t != null && t.width) || !(t != null && t.height)) return "";
  const n = ve(je(t, e), t), i = Math.min(1, ae / n.sw), r = Math.max(1, Math.round(n.sw * i)), s = Math.max(1, Math.round(n.sh * i)), a = document.createElement("canvas");
  if (a.width = r, a.height = s, a.getContext("2d").drawImage(t, n.sx, n.sy, n.sw, n.sh, 0, 0, r, s), it(a)) return "";
  try {
    return a.toDataURL("image/webp", 0.62);
  } catch (c) {
    return console.warn(`${f} | WebP canvas capture failed, using PNG fallback.`, c), a.toDataURL("image/png");
  }
}
async function z(e) {
  var n;
  if (!we(e == null ? void 0 : e.camera)) return;
  let t = "";
  qe(e.camera) && (t = rt(e.camera)), t || (t = await Ke(e.camera)), t && await ((n = e.updateLiveFrame) == null ? void 0 : n.call(e, t));
}
function V(e) {
  e != null && e.liveFrameTimer && (window.clearInterval(e.liveFrameTimer), e.liveFrameTimer = null);
}
function at(e) {
  V(e), we(e == null ? void 0 : e.camera) && (z(e), e.liveFrameTimer = window.setInterval(() => {
    z(e);
  }, Ee));
}
var J, K;
const W = (K = (J = foundry == null ? void 0 : foundry.applications) == null ? void 0 : J.api) == null ? void 0 : K.ApplicationV2;
var Q, Z;
const P = (Z = (Q = foundry == null ? void 0 : foundry.applications) == null ? void 0 : Q.api) == null ? void 0 : Z.HandlebarsApplicationMixin;
class st extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "security-camera-monitor",
      title: "Security Camera Manager",
      template: te,
      classes: ["security-camera-window"],
      popOut: !0,
      resizable: !0,
      width: 1060,
      height: "auto"
    });
  }
  getData() {
    return me();
  }
  async _renderInner(t) {
    try {
      return await super._renderInner(t);
    } catch (n) {
      return console.warn(`${f} | Monitor template render failed, using inline fallback.`, n), $(ge(t));
    }
  }
  activateListeners(t) {
    super.activateListeners(t), fe(this, t);
  }
  async close(t) {
    return y === this && (y = null), super.close(t);
  }
}
class ot extends Application {
  constructor(t, n = {}) {
    super(n), this.camera = F(t), this.liveFrame = n.liveFrame ?? "", this.liveFrameTimer = null;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "security-camera-feed",
      title: "Camera Feed",
      template: ne,
      classes: ["security-camera-feed-window"],
      popOut: !0,
      resizable: !0,
      width: 720,
      height: "auto"
    });
  }
  getData() {
    return this.camera = F(this.camera), {
      camera: {
        ...this.camera,
        liveFrame: this.liveFrame,
        hasLiveFrame: !!this.liveFrame
      }
    };
  }
  async _renderInner(t) {
    try {
      return await super._renderInner(t);
    } catch (n) {
      return console.warn(`${f} | Feed template render failed, using inline fallback.`, n), $(he({
        ...this.camera,
        liveFrame: this.liveFrame
      }));
    }
  }
  activateListeners(t) {
    super.activateListeners(t), pe(this, t);
  }
  async updateLiveFrame(t) {
    var s, a;
    this.liveFrame = t;
    const n = O(this), i = (s = n == null ? void 0 : n.querySelector) == null ? void 0 : s.call(n, "[data-security-camera-live-frame]"), r = (a = n == null ? void 0 : n.querySelector) == null ? void 0 : a.call(n, "[data-security-camera-live-waiting]");
    if (i) {
      i.src = t, i.hidden = !1, r && (r.hidden = !0);
      return;
    }
    await this.render(!0);
  }
  async close(t) {
    return V(this), S === this && (S = null), super.close(t);
  }
}
function ct() {
  var e;
  return !W || !P ? null : (e = class extends P(W) {
    async _prepareContext(n) {
      return {
        ...await super._prepareContext(n),
        ...me()
      };
    }
    async _renderHTML(n, i) {
      try {
        return await super._renderHTML(n, i);
      } catch (r) {
        console.warn(`${f} | Monitor template render failed, using inline fallback.`, r);
        const s = document.createElement("template");
        return s.innerHTML = ge(n).trim(), s.content;
      }
    }
    _onRender(n, i) {
      var r;
      (r = super._onRender) == null || r.call(this, n, i), fe(this);
    }
    async close(n) {
      return y === this && (y = null), super.close(n);
    }
  }, T(e, "DEFAULT_OPTIONS", {
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
  }), T(e, "PARTS", {
    main: {
      template: te
    }
  }), e);
}
function ut() {
  var e;
  return !W || !P ? null : (e = class extends P(W) {
    constructor(n, i = {}) {
      super(i), this.camera = F(n), this.liveFrame = i.liveFrame ?? "", this.liveFrameTimer = null;
    }
    async _prepareContext(n) {
      return this.camera = F(this.camera), {
        ...await super._prepareContext(n),
        camera: {
          ...this.camera,
          liveFrame: this.liveFrame,
          hasLiveFrame: !!this.liveFrame
        }
      };
    }
    async _renderHTML(n, i) {
      try {
        return await super._renderHTML(n, i);
      } catch (r) {
        console.warn(`${f} | Feed template render failed, using inline fallback.`, r);
        const s = document.createElement("template");
        return s.innerHTML = he({
          ...this.camera,
          liveFrame: this.liveFrame
        }).trim(), s.content;
      }
    }
    _onRender(n, i) {
      var r;
      (r = super._onRender) == null || r.call(this, n, i), pe(this);
    }
    async updateLiveFrame(n) {
      var a, o;
      this.liveFrame = n;
      const i = O(this), r = (a = i == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "[data-security-camera-live-frame]"), s = (o = i == null ? void 0 : i.querySelector) == null ? void 0 : o.call(i, "[data-security-camera-live-waiting]");
      if (r) {
        r.src = n, r.hidden = !1, s && (s.hidden = !0);
        return;
      }
      await this.render(!0);
    }
    async close(n) {
      return V(this), S === this && (S = null), super.close(n);
    }
  }, T(e, "DEFAULT_OPTIONS", {
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
  }), T(e, "PARTS", {
    main: {
      template: ne
    }
  }), e);
}
const lt = ct() ?? st, dt = ut() ?? ot;
async function Se() {
  var e;
  return I("open the Security Camera Manager") ? y ? ((e = y.bringToFront) == null || e.call(y), y) : (y = new lt(), await y.render(!0), y) : null;
}
async function mt() {
  if (!y) return;
  const e = y;
  y = null, await e.close();
}
async function Me(e, t = {}) {
  const n = v(e);
  return await j(), S = new dt(n, {
    liveFrame: t.liveFrame ?? ""
  }), await S.render(!0), ye(S), S;
}
async function j() {
  if (!S) return;
  const e = S;
  S = null, await e.close();
}
async function Ce(e) {
  var n, i;
  if (!I("broadcast camera feeds")) return null;
  const t = x(e);
  return t ? (ce({
    action: "showFeed",
    gmUserId: game.user.id,
    camera: t
  }), Me(t)) : ((i = (n = ui.notifications) == null ? void 0 : n.warn) == null || i.call(n, "Security camera not found."), null);
}
function Ie() {
  I("close player camera feeds") && (ce({
    action: "closeFeed",
    gmUserId: game.user.id
  }), j());
}
async function gt() {
  y && await y.render(!0);
}
async function ht(e) {
  var i, r, s;
  if (!e || typeof e != "object") return;
  const t = (i = game.users) == null ? void 0 : i.get(e.gmUserId), n = !!(t != null && t.isGM);
  if (e.action === "showFeed") {
    if ((r = game.user) != null && r.isGM) return;
    if (!n) {
      console.warn(`${f} | Ignoring camera feed socket message without a GM sender.`);
      return;
    }
    const a = q(e.camera);
    if (!a.ok) {
      console.warn(`${f} | Ignoring invalid socket camera payload.`, a.errors);
      return;
    }
    await Me(a.camera);
    return;
  }
  if (e.action === "closeFeed") {
    if ((s = game.user) != null && s.isGM || !n) return;
    await j();
  }
}
function ft() {
  game.settings.register(f, "cameras", {
    name: "Security Cameras",
    hint: "World-level camera feed definitions for the Security Cameras module.",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  });
}
function yt() {
  const e = {
    openMonitor: Se,
    closeMonitor: mt,
    showFeed: Ce,
    registerCamera: ke,
    createNewCamera: de,
    deleteCamera: ue,
    duplicateCamera: le,
    getCameras: oe,
    closeFeed: Ie,
    get activeMonitor() {
      return y;
    },
    get activeFeed() {
      return S;
    }
  };
  game.securityCameras = e;
  const t = game.modules.get(f);
  t && (t.api = e);
}
function pt() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: f,
    title: "Security Cameras",
    icon: "fa-solid fa-video",
    premium: !1,
    featureId: f,
    description: "Manage camera feeds and broadcast surveillance views.",
    open: () => Se()
  }), !0) : !1;
}
Hooks.once("init", () => {
  ft();
});
Hooks.once("ready", () => {
  var e, t;
  yt(), pt(), (t = (e = game.socket) == null ? void 0 : e.on) == null || t.call(e, ee, ht), console.log(`${f} | Ready. Use game.securityCameras.openMonitor()`);
});
