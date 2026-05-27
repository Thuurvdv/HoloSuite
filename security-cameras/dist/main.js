var Re = Object.defineProperty;
var Oe = (e, t, n) => t in e ? Re(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var A = (e, t, n) => Oe(e, typeof t != "symbol" ? t + "" : t, n);
function _e(e, t = e) {
  const n = `${t} |`;
  return {
    log: (i, ...a) => console.log(n, i, ...a),
    warn: (i, ...a) => console.warn(n, i, ...a),
    error: (i, ...a) => console.error(n, i, ...a)
  };
}
function We(e, t = {}) {
  const n = t.socketName ?? `module.${e}`, i = _e(e, t.title ?? e);
  return {
    socketName: n,
    emit(a) {
      var s;
      const r = (s = globalThis.game) == null ? void 0 : s.socket;
      return r != null && r.emit ? (r.emit(n, a), !0) : (i.warn("Foundry socket is unavailable.", a), !1);
    },
    isGMSender(a) {
      var r, s, o;
      return a ? !!((o = (s = (r = globalThis.game) == null ? void 0 : r.users) == null ? void 0 : s.get(String(a))) != null && o.isGM) : !1;
    }
  };
}
const ne = /* @__PURE__ */ new Set(["online", "offline", "corrupted", "restricted"]), ie = /* @__PURE__ */ new Set(["live", "image"]), V = /* @__PURE__ */ new Set(["window", "picture-in-picture"]), P = 1200, k = 675, Pe = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "corrupted", label: "Corrupted" },
  { value: "restricted", label: "Restricted" }
], ke = [
  { value: "window", label: "Window" },
  { value: "picture-in-picture", label: "Picture-in-Picture" }
], Xe = [
  { value: "live", label: "Live Canvas" },
  { value: "image", label: "Static Image" }
], p = {
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
  regionWidth: P,
  regionHeight: k,
  notes: ""
};
function R(e, t, n) {
  const i = String(e ?? "").trim();
  return t.has(i) ? i : n;
}
function b(e) {
  if (e == null || e === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
function C(e, t) {
  const n = Number(e);
  return Number.isFinite(n) && n > 0 ? n : t;
}
function ae(e) {
  return e && typeof e == "object" ? e : {};
}
function B(e = {}, t = {}) {
  var d;
  const n = ae(e), i = t.preserveId === !0, a = String(n.id ?? "").trim(), r = i ? a : a || ((d = t.createId) == null ? void 0 : d.call(t)) || "", s = R(n.feedSource, ie, p.feedSource), o = R(n.status, ne, p.status), u = R(n.displayMode, V, p.displayMode);
  return {
    ...p,
    id: r,
    name: String(n.name ?? p.name).trim() || p.name,
    sceneId: String(n.sceneId ?? "").trim(),
    location: String(n.location ?? p.location).trim() || p.location,
    image: String(n.image ?? "").trim(),
    feedSource: s,
    status: o,
    displayMode: u,
    regionId: String(n.regionId ?? "").trim(),
    regionX: b(n.regionX),
    regionY: b(n.regionY),
    regionWidth: C(n.regionWidth, P),
    regionHeight: C(n.regionHeight, k),
    notes: String(n.notes ?? "").trim()
  };
}
function Ue(e = {}, t = {}) {
  const n = ae(e), i = B(n, {
    preserveId: t.requireId === !0,
    createId: t.createId
  }), a = [], r = String(n.feedSource ?? p.feedSource).trim(), s = String(n.status ?? p.status).trim(), o = String(n.displayMode ?? p.displayMode).trim();
  return t.requireId && !i.id && a.push("Camera id is required."), typeof n.name == "string" && !n.name.trim() && a.push("Camera name is required."), ie.has(r) || a.push(`Invalid feed source: ${r}`), ne.has(s) || a.push(`Invalid status: ${s}`), V.has(o) || a.push(`Invalid display mode: ${o}`), {
    ok: a.length === 0,
    camera: B(i, { createId: t.createId }),
    errors: a
  };
}
function re(e) {
  return e && typeof e == "object" ? e : {};
}
function Ye(e = {}) {
  const t = re(e), n = Array.isArray(t.points) ? t.points : [];
  if (n.length >= 4) {
    const o = [], u = [];
    for (let M = 0; M < n.length; M += 2)
      o.push(Number(n[M])), u.push(Number(n[M + 1]));
    const d = Math.min(...o), g = Math.min(...u), l = Math.max(...o), y = Math.max(...u);
    if ([d, g, l, y].every(Number.isFinite))
      return {
        x: d,
        y: g,
        width: l - d,
        height: y - g
      };
  }
  const i = b(t.x) ?? 0, a = b(t.y) ?? 0, r = C(t.width ?? t.radiusX ?? t.radius, 0), s = C(t.height ?? t.radiusY ?? t.radius, 0);
  return !r || !s ? null : { x: i, y: a, width: r, height: s };
}
function Be(e) {
  const t = e.filter((s) => !!s);
  if (!t.length) return null;
  const n = Math.min(...t.map((s) => s.x)), i = Math.min(...t.map((s) => s.y)), a = Math.max(...t.map((s) => s.x + s.width)), r = Math.max(...t.map((s) => s.y + s.height));
  return {
    x: n,
    y: i,
    width: a - n,
    height: r - i
  };
}
function G(e) {
  const t = re(e), n = C(t.width, P), i = C(t.height, k);
  return !n || !i ? null : {
    regionX: b(t.x) ?? 0,
    regionY: b(t.y) ?? 0,
    regionWidth: n,
    regionHeight: i
  };
}
function Ge(e) {
  const t = Be(e.map(Ye));
  return t ? G(t) : null;
}
function se(e) {
  return Number.isFinite(e.regionX) && Number.isFinite(e.regionY);
}
function O(e) {
  return {
    sx: 0,
    sy: 0,
    sw: e.width,
    sh: e.height
  };
}
function je(e, t, n, i) {
  if (!se(t)) return O(e);
  if (n != null && n.width && n.height && e.width >= n.width * 0.75 && e.height >= n.height * 0.75) {
    const a = e.width / n.width, r = e.height / n.height;
    return {
      sx: (t.regionX ?? 0) * a,
      sy: (t.regionY ?? 0) * r,
      sw: t.regionWidth * a,
      sh: t.regionHeight * r
    };
  }
  return (i == null ? void 0 : i(t)) ?? O(e);
}
function oe(e, t) {
  const n = Math.max(0, Math.min(t.width - 1, Math.round(e.sx))), i = Math.max(0, Math.min(t.height - 1, Math.round(e.sy))), a = Math.max(1, Math.min(t.width - n, Math.round(e.sw))), r = Math.max(1, Math.min(t.height - i, Math.round(e.sh)));
  return { sx: n, sy: i, sw: a, sh: r };
}
function Ve(e, t, n) {
  if (!se(t)) return O(e);
  const i = e.width / n.width, a = e.height / n.height;
  return {
    sx: ((t.regionX ?? 0) - n.x) * i,
    sy: ((t.regionY ?? 0) - n.y) * a,
    sw: t.regionWidth * i,
    sh: t.regionHeight * a
  };
}
function ce(e, t) {
  const n = Math.min(1, t / e.sw);
  return {
    width: Math.max(1, Math.round(e.sw * n)),
    height: Math.max(1, Math.round(e.sh * n))
  };
}
function qe(e, t = 100) {
  if (!e) return null;
  const n = b(e.x), i = b(e.y);
  return !Number.isFinite(n) || !Number.isFinite(i) ? null : {
    x: n,
    y: i,
    width: C(e.width, 1) * t,
    height: C(e.height, 1) * t
  };
}
function ze(e, t) {
  return e.x < t.x + t.width && e.x + e.width > t.x && e.y < t.y + t.height && e.y + e.height > t.y;
}
function Je(e, t, n) {
  return {
    dx: (e.x - t.x) / t.width * n.width,
    dy: (e.y - t.y) / t.height * n.height,
    dw: e.width / t.width * n.width,
    dh: e.height / t.height * n.height
  };
}
const h = "security-cameras", ue = `module.${h}`, le = We(h, {
  socketName: ue,
  title: "Security Cameras"
}), de = `modules/${h}/templates/monitor.hbs`, me = `modules/${h}/templates/feed.hbs`, Ke = 1250, he = 960;
let f = null, w = null, m = "", S = "";
const U = /* @__PURE__ */ new Map();
function E() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function T(e) {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : JSON.parse(JSON.stringify(e));
}
function c(e) {
  var n;
  if ((n = foundry == null ? void 0 : foundry.utils) != null && n.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
function v(e = {}, t = {}) {
  return B(e, { ...t, createId: E });
}
function q(e = {}, t = {}) {
  return Ue(e, { ...t, createId: E });
}
function Qe(e) {
  var t, n;
  return e ? ((n = (t = game.scenes) == null ? void 0 : t.get(e)) == null ? void 0 : n.name) ?? "Unknown Scene" : "Unassigned Scene";
}
function ge(e = "") {
  var n;
  const t = X(e);
  return String(((n = t == null ? void 0 : t.background) == null ? void 0 : n.src) ?? (t == null ? void 0 : t.img) ?? (t == null ? void 0 : t.thumb) ?? "").trim();
}
function Ze(e = "") {
  var n;
  const t = (((n = game.scenes) == null ? void 0 : n.contents) ?? []).map((i) => ({
    id: i.id,
    name: i.name,
    selected: i.id === e
  })).sort((i, a) => i.name.localeCompare(a.name));
  return [
    { id: "", name: "Unassigned Scene", selected: !e },
    ...t
  ];
}
function X(e = "") {
  var t;
  return e ? ((t = game.scenes) == null ? void 0 : t.get(e)) ?? null : (canvas == null ? void 0 : canvas.scene) ?? null;
}
function et(e = "") {
  var i;
  const t = X(e);
  return (((i = t == null ? void 0 : t.regions) == null ? void 0 : i.contents) ?? []).map((a) => ({
    id: a.id,
    name: a.name || `Region ${a.id}`,
    region: a
  })).sort((a, r) => a.name.localeCompare(r.name));
}
function tt(e = "", t = "") {
  return [
    { id: "", name: "No Linked Region", selected: !t },
    ...et(e).map((n) => ({
      id: n.id,
      name: n.name,
      selected: n.id === t
    }))
  ];
}
function nt(e = "", t = "") {
  var i, a;
  if (!e) return null;
  const n = X(t);
  return ((a = (i = n == null ? void 0 : n.regions) == null ? void 0 : i.get) == null ? void 0 : a.call(i, e)) ?? null;
}
function it(e) {
  var s, o, u, d;
  const t = (e == null ? void 0 : e.object) ?? ((u = (o = (s = canvas == null ? void 0 : canvas.regions) == null ? void 0 : s.placeables) == null ? void 0 : o.find) == null ? void 0 : u.call(o, (g) => {
    var l;
    return ((l = g.document) == null ? void 0 : l.id) === (e == null ? void 0 : e.id);
  })), n = t == null ? void 0 : t.bounds;
  if (n != null && n.width && (n != null && n.height))
    return G(n);
  const i = e == null ? void 0 : e.bounds;
  if (i != null && i.width && (i != null && i.height))
    return G(i);
  const a = ((d = e == null ? void 0 : e.toObject) == null ? void 0 : d.call(e)) ?? e, r = Array.isArray(e == null ? void 0 : e.shapes) ? e.shapes : Array.isArray(a == null ? void 0 : a.shapes) ? a.shapes : [];
  return Ge(r);
}
function N(e) {
  const t = nt(e.regionId, e.sceneId), n = it(t);
  return n ? {
    ...e,
    ...n
  } : e;
}
function j() {
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
function Y(e, t) {
  return e.map((n) => ({
    ...n,
    selected: n.value === t
  }));
}
function F(e = {}) {
  const t = v(e), n = (/* @__PURE__ */ new Date()).toLocaleString(), i = t.status === "online", a = t.status === "offline", r = t.status === "corrupted", s = t.status === "restricted", o = t.feedSource === "live";
  return {
    ...t,
    sceneName: Qe(t.sceneId),
    sceneBackground: ge(t.sceneId),
    regionAspect: t.regionWidth && t.regionHeight ? `${t.regionWidth} / ${t.regionHeight}` : "16 / 9",
    timestamp: n,
    signalLabel: i ? "SIGNAL LOCK" : r ? "SIGNAL CORRUPTED" : s ? "ACCESS DENIED" : "NO SIGNAL",
    isOnline: i,
    isOffline: a,
    isCorrupted: r,
    isRestricted: s,
    isLive: o,
    isImage: !o,
    hasRegion: Number.isFinite(t.regionX) && Number.isFinite(t.regionY),
    canDisplayImage: !!(t.image && !o && !a && !s),
    canUseImageFallback: !!(t.image && o && !a && !s),
    statusClass: `security-camera-status-${t.status}`,
    sourceClass: `security-camera-source-${t.feedSource}`,
    displayClass: `security-camera-display-${t.displayMode}`
  };
}
function L() {
  const e = game.settings.get(h, "cameras");
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function fe() {
  return Object.values(L()).map(v).sort((e, t) => e.name.localeCompare(t.name));
}
function x(e) {
  const t = String(e ?? "");
  if (!t) return null;
  const n = L()[t];
  return n ? v(n) : null;
}
async function D(e) {
  await game.settings.set(h, "cameras", e), await Nt();
}
function I(e = "manage security cameras") {
  var t, n, i;
  return (t = game.user) != null && t.isGM ? !0 : ((i = (n = ui.notifications) == null ? void 0 : n.warn) == null || i.call(n, `Only the GM can ${e}.`), !1);
}
function ye(e) {
  return le.emit(e);
}
async function at(e = {}) {
  var a, r;
  if (!I("register security cameras")) return null;
  const t = q(e);
  if (!t.ok)
    return (r = (a = ui.notifications) == null ? void 0 : a.error) == null || r.call(a, t.errors.join(" ")), null;
  const n = N(t.camera), i = T(L());
  return i[n.id] = n, m = n.id, S = n.id, await D(i), n;
}
async function pe(e) {
  var s, o;
  if (!I("delete security cameras")) return !1;
  const t = String(e ?? m ?? "");
  if (!t || !x(t))
    return (o = (s = ui.notifications) == null ? void 0 : s.warn) == null || o.call(s, "Select a camera to delete."), !1;
  const n = x(t);
  if (!(typeof Dialog < "u" ? await Dialog.confirm({
    title: "Delete Security Camera",
    content: `<p>Delete camera <strong>${c(n.name)}</strong>?</p>`,
    yes: () => !0,
    no: () => !1,
    defaultYes: !1
  }) : window.confirm(`Delete camera "${n.name}"?`))) return !1;
  const a = T(L());
  return delete a[t], m = Object.keys(a)[0] ?? "", S = m, await D(a), !0;
}
async function we(e) {
  var a, r;
  if (!I("duplicate security cameras")) return null;
  const t = x(e || m);
  if (!t)
    return (r = (a = ui.notifications) == null ? void 0 : a.warn) == null || r.call(a, "Select a camera to duplicate."), null;
  const n = v({
    ...t,
    id: E(),
    name: `${t.name} Copy`
  }), i = T(L());
  return i[n.id] = n, m = n.id, S = n.id, await D(i), n;
}
async function ve() {
  var n, i;
  if (!I("create security cameras")) return null;
  const e = v({
    ...j(),
    id: E(),
    name: "New Camera",
    location: "Unlabeled Location"
  }), t = T(L());
  return t[e.id] = N(e), m = e.id, S = e.id, await D(t), (i = (n = ui.notifications) == null ? void 0 : n.info) == null || i.call(n, "New security camera created."), e;
}
function rt(e) {
  const t = new FormData(e), n = String(t.get("originalId") ?? "").trim(), i = String(t.get("id") ?? "").trim() || n || E();
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
async function st(e) {
  var s, o, u, d;
  if (!I("save security cameras")) return null;
  const { originalId: t, camera: n } = rt(e), i = q(n);
  if (!i.ok)
    return (o = (s = ui.notifications) == null ? void 0 : s.error) == null || o.call(s, i.errors.join(" ")), null;
  const a = N(i.camera), r = T(L());
  return t && t !== a.id && delete r[t], r[a.id] = a, m = a.id, S = a.id, await D(r), (d = (u = ui.notifications) == null ? void 0 : u.info) == null || d.call(u, "Security camera saved."), a;
}
function ot(e = m) {
  var n, i, a, r, s, o, u, d;
  const t = x(e);
  if (!Number.isFinite(t == null ? void 0 : t.regionX) || !Number.isFinite(t == null ? void 0 : t.regionY)) {
    (i = (n = ui.notifications) == null ? void 0 : n.warn) == null || i.call(n, "This camera does not have a region yet.");
    return;
  }
  if (t.sceneId && ((a = canvas.scene) == null ? void 0 : a.id) !== t.sceneId) {
    (s = (r = ui.notifications) == null ? void 0 : r.warn) == null || s.call(r, "Activate the camera's scene before panning to its region.");
    return;
  }
  (d = canvas.animatePan) == null || d.call(canvas, {
    x: t.regionX + t.regionWidth / 2,
    y: t.regionY + t.regionHeight / 2,
    scale: ((u = (o = canvas.stage) == null ? void 0 : o.scale) == null ? void 0 : u.x) ?? 1,
    duration: 500
  });
}
function H(e, t) {
  var n;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (n = e.element) != null && n[0] ? e.element[0] : e.element ?? null;
}
function Se() {
  const e = fe();
  !m && e.length && (m = e[0].id), S === null && (S = m);
  const t = x(m), n = S === "" ? j() : x(S) ?? j(), i = F(n);
  return {
    cameras: e.map((a) => ({
      ...F(a),
      isSelected: a.id === m
    })),
    selectedCamera: t ? F(t) : null,
    editorCamera: i,
    sceneChoices: Ze(n.sceneId),
    regionChoices: tt(n.sceneId, n.regionId),
    feedSourceChoices: Y(Xe, n.feedSource),
    statusChoices: Y(Pe, n.status),
    displayModeChoices: Y(ke, n.displayMode),
    showStaticImageField: n.feedSource === "image",
    hasCameras: e.length > 0,
    isNewCamera: !n.id
  };
}
function be(e) {
  const t = e.cameras.map((l) => `
    <button type="button" class="security-camera-list-item ${l.isSelected ? "active" : ""}" data-security-camera-id="${c(l.id)}">
      <span>${c(l.name)}</span>
      <small>${c(l.location)}</small>
      <i>${c(l.status)}</i>
    </button>
  `).join(""), n = e.selectedCamera, i = n ? `
    <section class="security-camera-monitor-preview ${c(n.statusClass)}">
      <header>
        <div>
          <span class="security-camera-kicker">Selected Feed</span>
          <h3>${c(n.name)}</h3>
        </div>
        <strong>${c(n.status.toUpperCase())}</strong>
      </header>
      <div class="security-camera-preview-frame">
        ${n.canDisplayImage ? `<img src="${c(n.image)}" alt="${c(n.name)}">` : `<div class="security-camera-placeholder">${c(n.isLive ? "LIVE CANVAS FEED" : n.signalLabel)}</div>`}
      </div>
      <dl>
        <dt>Location</dt><dd>${c(n.location)}</dd>
        <dt>Scene</dt><dd>${c(n.sceneName)}</dd>
        <dt>Source</dt><dd>${c(n.feedSource)}</dd>
        <dt>Region</dt><dd>${n.hasRegion ? `${Math.round(n.regionX)}, ${Math.round(n.regionY)} / ${Math.round(n.regionWidth)}x${Math.round(n.regionHeight)}` : "No region"}</dd>
        <dt>Mode</dt><dd>${c(n.displayMode)}</dd>
        <dt>Notes</dt><dd>${c(n.notes || "No notes recorded.")}</dd>
      </dl>
    </section>
  ` : '<section class="security-camera-monitor-preview"><div class="security-camera-empty">No camera selected.</div></section>', a = e.editorCamera, r = e.sceneChoices.map((l) => `<option value="${c(l.id)}" ${l.selected ? "selected" : ""}>${c(l.name)}</option>`).join(""), s = e.regionChoices.map((l) => `<option value="${c(l.id)}" ${l.selected ? "selected" : ""}>${c(l.name)}</option>`).join(""), o = e.feedSourceChoices.map((l) => `<option value="${c(l.value)}" ${l.selected ? "selected" : ""}>${c(l.label)}</option>`).join(""), u = e.statusChoices.map((l) => `<option value="${c(l.value)}" ${l.selected ? "selected" : ""}>${c(l.label)}</option>`).join(""), d = e.displayModeChoices.map((l) => `<option value="${c(l.value)}" ${l.selected ? "selected" : ""}>${c(l.label)}</option>`).join(""), g = `<label data-security-camera-static-image-field ${e.showStaticImageField ? "" : "hidden"}>Static Image <span class="security-camera-path-row"><input type="text" name="image" value="${c(a.image)}"><button type="button" data-security-camera-action="browse-image">Browse</button></span></label>`;
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
        <header><span class="security-camera-kicker">Manager</span><h2>${e.isNewCamera ? "ADDING Camera" : "Edit Camera"}</h2></header>
        <input type="hidden" name="originalId" value="${c(a.id)}">
        <label>ID <input type="text" name="id" value="${c(a.id)}" placeholder="auto-generated"></label>
        <label>Name <input type="text" name="name" value="${c(a.name)}" required></label>
        <label>Scene <select name="sceneId">${r}</select></label>
        <label>Scene Region <select name="regionId">${s}</select></label>
        <label>Location <input type="text" name="location" value="${c(a.location)}"></label>
        <label>Feed Source <select name="feedSource">${o}</select></label>
        ${g}
        <label>Status <select name="status">${u}</select></label>
        <label>Display Mode <select name="displayMode">${d}</select></label>
        <input type="hidden" name="regionX" value="${c(a.regionX ?? "")}">
        <input type="hidden" name="regionY" value="${c(a.regionY ?? "")}">
        <input type="hidden" name="regionWidth" value="${c(a.regionWidth ?? "")}">
        <input type="hidden" name="regionHeight" value="${c(a.regionHeight ?? "")}">
        <label>Notes <textarea name="notes" rows="4">${c(a.notes)}</textarea></label>
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
function Ce(e) {
  const n = e.isLive && !e.isOffline && !e.isRestricted ? `<img src="${c(e.liveFrame || e.image || "")}" alt="${c(e.name)}" data-security-camera-live-frame ${e.liveFrame || e.image ? "" : "hidden"}><div class="security-camera-feed-warning" data-security-camera-live-waiting ${e.liveFrame || e.image ? "hidden" : ""}>AWAITING LIVE SIGNAL</div>` : e.canDisplayImage ? `<img src="${c(e.image)}" alt="${c(e.name)}">` : `<div class="security-camera-feed-warning">${c(e.signalLabel)}</div>`;
  return `
    <section class="security-camera-feed ${c(e.statusClass)} ${c(e.sourceClass)} ${c(e.displayClass)}">
      <div class="security-camera-feed-static" aria-hidden="true"></div>
      <div class="security-camera-feed-scanline" aria-hidden="true"></div>
      <header class="security-camera-feed-header">
        <div>
          <span class="security-camera-rec"><i></i> REC</span>
          <h2>${c(e.name)}</h2>
          <p>${c(e.location)}</p>
        </div>
        <div class="security-camera-signal">
          <strong>${c(e.signalLabel)}</strong>
          <span aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        </div>
      </header>
      <main class="security-camera-feed-frame" style="--security-camera-region-aspect: ${c(e.regionAspect ?? "16 / 9")};">
        ${n}
      </main>
      <footer class="security-camera-feed-footer">
        <span>${c(e.timestamp)}</span>
        <span>ID ${c(e.id)}</span>
      </footer>
    </section>
  `;
}
function ct(e) {
  var i, a, r;
  if (typeof FilePicker > "u") {
    (a = (i = ui.notifications) == null ? void 0 : i.warn) == null || a.call(i, "Foundry FilePicker is not available.");
    return;
  }
  const t = (r = e == null ? void 0 : e.elements) == null ? void 0 : r.image;
  new FilePicker({
    type: "image",
    current: (t == null ? void 0 : t.value) ?? "",
    callback: (s) => {
      t && (t.value = s);
    }
  }).browse();
}
function Me(e, t) {
  var a, r;
  const n = H(e, t);
  if (!n) return;
  const i = n.querySelector("[data-security-camera-form]");
  i == null || i.addEventListener("submit", async (s) => {
    s.preventDefault(), await st(i);
  }), (r = (a = i == null ? void 0 : i.elements) == null ? void 0 : a.feedSource) == null || r.addEventListener("change", () => {
    const s = i.querySelector("[data-security-camera-static-image-field]");
    s && (s.hidden = i.elements.feedSource.value !== "image");
  }), n.querySelectorAll("[data-security-camera-id]").forEach((s) => {
    s.addEventListener("click", async (o) => {
      m = o.currentTarget.dataset.securityCameraId, S = m, await e.render(!0);
    });
  }), n.querySelectorAll("[data-security-camera-action]").forEach((s) => {
    s.addEventListener("click", async (o) => {
      const u = o.currentTarget.dataset.securityCameraAction;
      if (u === "new") {
        await ve();
        return;
      }
      if (u === "duplicate") {
        await we(m);
        return;
      }
      if (u === "delete") {
        await pe(m);
        return;
      }
      if (u === "browse-image") {
        ct(i);
        return;
      }
      if (u === "pan-region") {
        ot(m);
        return;
      }
      if (u === "show") {
        await Ae(m);
        return;
      }
      if (u === "close-feed") {
        Ee();
        return;
      }
    });
  });
}
function Ie(e) {
  var a, r;
  const t = (e == null ? void 0 : e.camera) ?? {}, n = R(t.displayMode, V, p.displayMode), i = H(e);
  if (i == null || i.classList.toggle("security-camera-feed-display-window", n === "window"), i == null || i.classList.toggle("security-camera-feed-display-pip", n === "picture-in-picture"), n === "picture-in-picture") {
    const s = Number(t.regionWidth) && Number(t.regionHeight) ? Number(t.regionWidth) / Number(t.regionHeight) : 1.7777777777777777, o = Math.min(620, Math.max(360, window.innerWidth * 0.42)), u = Math.min(460, Math.max(260, window.innerHeight * 0.38));
    let d = o, g = d / s;
    g > u && (g = u, d = g * s);
    const l = Math.round(g + 112);
    (a = e.setPosition) == null || a.call(e, {
      left: Math.max(12, window.innerWidth - d - 24),
      top: Math.max(12, window.innerHeight - l - 84),
      width: Math.round(d),
      height: l
    });
    return;
  }
  (r = e.setPosition) == null || r.call(e, {
    width: 720,
    height: "auto"
  });
}
function $e(e, t) {
  H(e, t) && (Ie(e), bt(e));
}
function Fe(e) {
  const t = v(e);
  return t.feedSource === "live" && t.status !== "offline" && t.status !== "restricted";
}
function ut(e) {
  var t, n;
  return !(!(canvas != null && canvas.ready) || !((t = canvas == null ? void 0 : canvas.app) != null && t.renderer) || e.sceneId && ((n = canvas.scene) == null ? void 0 : n.id) !== e.sceneId);
}
function lt() {
  var n, i, a, r, s;
  const e = (n = canvas == null ? void 0 : canvas.app) == null ? void 0 : n.renderer, t = [
    (i = canvas == null ? void 0 : canvas.app) == null ? void 0 : i.stage,
    canvas == null ? void 0 : canvas.stage
  ].filter(Boolean);
  try {
    for (const o of t) {
      const u = (r = (a = e == null ? void 0 : e.extract) == null ? void 0 : a.canvas) == null ? void 0 : r.call(a, o);
      if (u != null && u.width && (u != null && u.height)) return u;
    }
  } catch (o) {
    console.warn(`${h} | PIXI canvas extraction failed, using renderer view fallback.`, o);
  }
  return (e == null ? void 0 : e.view) ?? ((s = canvas == null ? void 0 : canvas.app) == null ? void 0 : s.view) ?? null;
}
function dt(e, t) {
  var s, o, u, d;
  const n = N(v(t)), i = ((s = canvas.dimensions) == null ? void 0 : s.width) ?? ((o = canvas.scene) == null ? void 0 : o.width) ?? 0, a = ((u = canvas.dimensions) == null ? void 0 : u.height) ?? ((d = canvas.scene) == null ? void 0 : d.height) ?? 0;
  return je(e, n, i && a ? { width: i, height: a } : null, () => {
    var g, l;
    if ((l = (g = canvas.stage) == null ? void 0 : g.worldTransform) != null && l.apply && typeof PIXI < "u") {
      const y = canvas.stage.worldTransform.apply(new PIXI.Point(n.regionX, n.regionY)), M = canvas.stage.worldTransform.apply(new PIXI.Point(n.regionX + n.regionWidth, n.regionY + n.regionHeight));
      return {
        sx: y.x,
        sy: y.y,
        sw: M.x - y.x,
        sh: M.y - y.y
      };
    }
    return null;
  });
}
function mt(e = "") {
  var a, r, s, o, u;
  const t = X(e), i = (t == null ? void 0 : t.id) && ((a = canvas == null ? void 0 : canvas.scene) == null ? void 0 : a.id) === t.id ? canvas.dimensions : null;
  return {
    x: b((i == null ? void 0 : i.sceneX) ?? ((r = i == null ? void 0 : i.sceneRect) == null ? void 0 : r.x)) ?? 0,
    y: b((i == null ? void 0 : i.sceneY) ?? ((s = i == null ? void 0 : i.sceneRect) == null ? void 0 : s.y)) ?? 0,
    width: C((i == null ? void 0 : i.sceneWidth) ?? ((o = i == null ? void 0 : i.sceneRect) == null ? void 0 : o.width) ?? (t == null ? void 0 : t.width), P),
    height: C((i == null ? void 0 : i.sceneHeight) ?? ((u = i == null ? void 0 : i.sceneRect) == null ? void 0 : u.height) ?? (t == null ? void 0 : t.height), k)
  };
}
function ht(e, t) {
  const n = N(v(t));
  if (!Number.isFinite(n.regionX) || !Number.isFinite(n.regionY))
    return O({ width: e.naturalWidth, height: e.naturalHeight });
  const i = mt(n.sceneId);
  return Ve({ width: e.naturalWidth, height: e.naturalHeight }, n, i);
}
function xe(e) {
  if (!e) return Promise.resolve(null);
  if (U.has(e)) return U.get(e);
  const t = new Promise((n) => {
    const i = (s) => n(s), a = () => {
      const s = new Image();
      s.onload = () => i(s), s.onerror = () => i(null), s.src = e;
    }, r = new Image();
    r.crossOrigin = "anonymous", r.onload = () => i(r), r.onerror = a, r.src = e;
  });
  return U.set(e, t), t;
}
async function gt(e = {}) {
  const n = ge(e.sceneId) || e.image, i = await xe(n);
  if (!(i != null && i.naturalWidth) || !(i != null && i.naturalHeight)) return "";
  const a = oe(ht(i, e), {
    width: i.naturalWidth,
    height: i.naturalHeight
  }), { width: r, height: s } = ce(a, he), o = document.createElement("canvas");
  o.width = r, o.height = s;
  const u = o.getContext("2d");
  u.drawImage(i, a.sx, a.sy, a.sw, a.sh, 0, 0, r, s), await wt(u, e, a, r, s);
  try {
    return o.toDataURL("image/webp", 0.72);
  } catch (d) {
    return console.warn(`${h} | Scene background crop failed.`, d), "";
  }
}
function ft(e) {
  var n, i;
  const t = ((n = canvas == null ? void 0 : canvas.dimensions) == null ? void 0 : n.size) ?? ((i = canvas == null ? void 0 : canvas.grid) == null ? void 0 : i.size) ?? 100;
  return qe(e == null ? void 0 : e.document, t);
}
function yt(e) {
  return !(!(e != null && e.document) || e.document.hidden || e.visible === !1 || e.renderable === !1 || e.isVisible === !1);
}
function pt(e) {
  var t, n, i, a, r;
  return String(((n = (t = e == null ? void 0 : e.document) == null ? void 0 : t.texture) == null ? void 0 : n.src) ?? ((a = (i = e == null ? void 0 : e.document) == null ? void 0 : i.actor) == null ? void 0 : a.img) ?? ((r = e == null ? void 0 : e.actor) == null ? void 0 : r.img) ?? "").trim();
}
async function wt(e, t, n, i, a) {
  var o, u;
  if (!(canvas != null && canvas.ready) || ((o = canvas.scene) == null ? void 0 : o.id) !== t.sceneId) return;
  const r = N(v(t)), s = {
    x: r.regionX,
    y: r.regionY,
    width: r.regionWidth,
    height: r.regionHeight
  };
  if ([s.x, s.y, s.width, s.height].every(Number.isFinite))
    for (const d of ((u = canvas.tokens) == null ? void 0 : u.placeables) ?? []) {
      if (!yt(d)) continue;
      const g = ft(d);
      if (!g || !ze(g, s)) continue;
      const l = pt(d), y = await xe(l);
      if (!(y != null && y.naturalWidth) || !(y != null && y.naturalHeight)) continue;
      const { dx: M, dy: Te, dw: De, dh: He } = Je(g, s, { width: i, height: a });
      e.save(), e.globalAlpha = d.document.alpha ?? 1, e.drawImage(y, M, Te, De, He), e.restore();
    }
}
function vt(e) {
  const t = e.getContext("2d", { willReadFrequently: !0 });
  if (!t) return !1;
  const n = Math.min(48, e.width), i = Math.min(48, e.height), a = t.getImageData(0, 0, n, i).data;
  let r = 0;
  const s = a.length / 4;
  for (let o = 0; o < a.length; o += 4)
    r += a[o] + a[o + 1] + a[o + 2];
  return r / (s * 3) < 3;
}
function St(e = {}) {
  const t = lt();
  if (!(t != null && t.width) || !(t != null && t.height)) return "";
  const n = oe(dt(t, e), t), { width: i, height: a } = ce(n, he), r = document.createElement("canvas");
  if (r.width = i, r.height = a, r.getContext("2d").drawImage(t, n.sx, n.sy, n.sw, n.sh, 0, 0, i, a), vt(r)) return "";
  try {
    return r.toDataURL("image/webp", 0.62);
  } catch (o) {
    return console.warn(`${h} | WebP canvas capture failed, using PNG fallback.`, o), r.toDataURL("image/png");
  }
}
async function K(e) {
  var n;
  if (!Fe(e == null ? void 0 : e.camera)) return;
  let t = "";
  t = await gt(e.camera), !t && ut(e.camera) && (t = St(e.camera)), t && await ((n = e.updateLiveFrame) == null ? void 0 : n.call(e, t));
}
function z(e) {
  e != null && e.liveFrameTimer && (window.clearInterval(e.liveFrameTimer), e.liveFrameTimer = null);
}
function bt(e) {
  z(e), Fe(e == null ? void 0 : e.camera) && (K(e), e.liveFrameTimer = window.setInterval(() => {
    K(e);
  }, Ke));
}
var Q, Z;
const _ = (Z = (Q = foundry == null ? void 0 : foundry.applications) == null ? void 0 : Q.api) == null ? void 0 : Z.ApplicationV2;
var ee, te;
const W = (te = (ee = foundry == null ? void 0 : foundry.applications) == null ? void 0 : ee.api) == null ? void 0 : te.HandlebarsApplicationMixin;
class Ct extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "security-camera-monitor",
      title: "Security Camera Manager",
      template: de,
      classes: ["security-camera-window"],
      popOut: !0,
      resizable: !0,
      width: 1060,
      height: "auto"
    });
  }
  getData() {
    return Se();
  }
  async _renderInner(t) {
    try {
      return await super._renderInner(t);
    } catch (n) {
      return console.warn(`${h} | Monitor template render failed, using inline fallback.`, n), $(be(t));
    }
  }
  activateListeners(t) {
    super.activateListeners(t), Me(this, t);
  }
  async close(t) {
    return f === this && (f = null), super.close(t);
  }
}
class Mt extends Application {
  constructor(t, n = {}) {
    super(n), this.camera = F(t), this.liveFrame = n.liveFrame ?? "", this.liveFrameTimer = null;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "security-camera-feed",
      title: "Camera Feed",
      template: me,
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
      return console.warn(`${h} | Feed template render failed, using inline fallback.`, n), $(Ce({
        ...this.camera,
        liveFrame: this.liveFrame
      }));
    }
  }
  activateListeners(t) {
    super.activateListeners(t), $e(this, t);
  }
  async updateLiveFrame(t) {
    var r, s;
    this.liveFrame = t;
    const n = H(this), i = (r = n == null ? void 0 : n.querySelector) == null ? void 0 : r.call(n, "[data-security-camera-live-frame]"), a = (s = n == null ? void 0 : n.querySelector) == null ? void 0 : s.call(n, "[data-security-camera-live-waiting]");
    if (i) {
      i.src = t, i.hidden = !1, a && (a.hidden = !0);
      return;
    }
    await this.render(!0);
  }
  async close(t) {
    return z(this), w === this && (w = null), super.close(t);
  }
}
function It() {
  var e;
  return !_ || !W ? null : (e = class extends W(_) {
    async _prepareContext(n) {
      return {
        ...await super._prepareContext(n),
        ...Se()
      };
    }
    async _renderHTML(n, i) {
      try {
        return await super._renderHTML(n, i);
      } catch (a) {
        console.warn(`${h} | Monitor template render failed, using inline fallback.`, a);
        const r = document.createElement("template");
        return r.innerHTML = be(n).trim(), r.content;
      }
    }
    _onRender(n, i) {
      var a;
      (a = super._onRender) == null || a.call(this, n, i), Me(this);
    }
    async close(n) {
      return f === this && (f = null), super.close(n);
    }
  }, A(e, "DEFAULT_OPTIONS", {
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
  }), A(e, "PARTS", {
    main: {
      template: de
    }
  }), e);
}
function $t() {
  var e;
  return !_ || !W ? null : (e = class extends W(_) {
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
      } catch (a) {
        console.warn(`${h} | Feed template render failed, using inline fallback.`, a);
        const r = document.createElement("template");
        return r.innerHTML = Ce({
          ...this.camera,
          liveFrame: this.liveFrame
        }).trim(), r.content;
      }
    }
    _onRender(n, i) {
      var a;
      (a = super._onRender) == null || a.call(this, n, i), $e(this);
    }
    async updateLiveFrame(n) {
      var s, o;
      this.liveFrame = n;
      const i = H(this), a = (s = i == null ? void 0 : i.querySelector) == null ? void 0 : s.call(i, "[data-security-camera-live-frame]"), r = (o = i == null ? void 0 : i.querySelector) == null ? void 0 : o.call(i, "[data-security-camera-live-waiting]");
      if (a) {
        a.src = n, a.hidden = !1, r && (r.hidden = !0);
        return;
      }
      await this.render(!0);
    }
    async close(n) {
      return z(this), w === this && (w = null), super.close(n);
    }
  }, A(e, "DEFAULT_OPTIONS", {
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
  }), A(e, "PARTS", {
    main: {
      template: me
    }
  }), e);
}
const Ft = It() ?? Ct, xt = $t() ?? Mt;
async function Le() {
  var e;
  return I("open the Security Camera Manager") ? f ? ((e = f.bringToFront) == null || e.call(f), f) : (f = new Ft(), await f.render(!0), f) : null;
}
async function Lt() {
  if (!f) return;
  const e = f;
  f = null, await e.close();
}
async function Ne(e, t = {}) {
  const n = v(e);
  return await J(), w = new xt(n, {
    liveFrame: t.liveFrame ?? ""
  }), await w.render(!0), Ie(w), w;
}
async function J() {
  if (!w) return;
  const e = w;
  w = null, await e.close();
}
async function Ae(e) {
  var n, i;
  if (!I("broadcast camera feeds")) return null;
  const t = x(e);
  return t ? (ye({
    action: "showFeed",
    gmUserId: game.user.id,
    camera: t
  }), Ne(t)) : ((i = (n = ui.notifications) == null ? void 0 : n.warn) == null || i.call(n, "Security camera not found."), null);
}
function Ee() {
  I("close player camera feeds") && (ye({
    action: "closeFeed",
    gmUserId: game.user.id
  }), J());
}
async function Nt() {
  f && await f.render(!0);
}
async function At(e) {
  var n, i;
  if (!e || typeof e != "object") return;
  const t = le.isGMSender(e.gmUserId);
  if (e.action === "showFeed") {
    if ((n = game.user) != null && n.isGM) return;
    if (!t) {
      console.warn(`${h} | Ignoring camera feed socket message without a GM sender.`);
      return;
    }
    const a = q(e.camera);
    if (!a.ok) {
      console.warn(`${h} | Ignoring invalid socket camera payload.`, a.errors);
      return;
    }
    await Ne(a.camera);
    return;
  }
  if (e.action === "closeFeed") {
    if ((i = game.user) != null && i.isGM || !t) return;
    await J();
  }
}
function Et() {
  game.settings.register(h, "cameras", {
    name: "Security Cameras",
    hint: "World-level camera feed definitions for the Security Cameras module.",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  });
}
function Tt() {
  const e = {
    openMonitor: Le,
    closeMonitor: Lt,
    showFeed: Ae,
    registerCamera: at,
    createNewCamera: ve,
    deleteCamera: pe,
    duplicateCamera: we,
    getCameras: fe,
    closeFeed: Ee,
    get activeMonitor() {
      return f;
    },
    get activeFeed() {
      return w;
    }
  };
  game.securityCameras = e;
  const t = game.modules.get(h);
  t && (t.api = e);
}
function Dt() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: h,
    title: "Security Cameras",
    icon: "fa-solid fa-video",
    premium: !1,
    featureId: h,
    playerVisible: !1,
    description: "Manage camera feeds and broadcast surveillance views.",
    open: () => Le()
  }), !0) : !1;
}
Hooks.once("init", () => {
  Et();
});
Hooks.once("ready", () => {
  var e, t;
  Tt(), Dt(), (t = (e = game.socket) == null ? void 0 : e.on) == null || t.call(e, ue, At), console.log(`${h} | Ready. Use game.securityCameras.openMonitor()`);
});
