var Os = Object.defineProperty;
var As = (e, t, o) => t in e ? Os(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o;
var Z = (e, t, o) => As(e, typeof t != "symbol" ? t + "" : t, o);
const Ge = [
  { value: "ice", label: "Ice Planet", color: "#bfeaff", texture: "Ice-planet.webp" },
  { value: "alien", label: "Alien Planet", color: "#9de56f", texture: "Alien-planet.webp" },
  { value: "earth", label: "Earth Planet", color: "#78caff", texture: "Earth-planet.webp" },
  { value: "lush", label: "Lush Planet", color: "#7dffbd", texture: "Lush-planet.webp" },
  { value: "desert", label: "Desert Planet", color: "#d9a45c", texture: "Desert-planet.webp" },
  { value: "gas-giant", label: "Gas Giant", color: "#e7bd82", texture: "GasGiant.webp" },
  { value: "volcanic", label: "Volcanic Planet", color: "#ff7043", texture: "Volcanic-planet.webp" },
  { value: "moon", label: "Moon", color: "#c7d0d8", texture: "Moon.webp" },
  { value: "sun", label: "Sun", color: "#ffd36a", texture: "sun-planet.webp" },
  { value: "techno", label: "Techno Planet", color: "#65e7ff", texture: "Techno-planet.webp" },
  { value: "prison", label: "Prison", color: "#9fc7d6", texture: "Prison.webp" },
  { value: "black-hole", label: "Black Hole", color: "#9d7cff", texture: "BlackHole.webp" },
  { value: "anomaly", label: "Anomaly", color: "#e88cff", texture: "Anomaly.webp" },
  { value: "asteroid", label: "Asteroid", color: "#a7a39c", texture: "Asteroid.webp" },
  { value: "donut-planet", label: "Donut Planet", color: "#f0a6d2", texture: "Donut-planet.webp" },
  { value: "cube", label: "Cube", color: "#76d7ff", texture: "Cube-planet.webp" }
], Dt = [
  ...Ge,
  { value: "color", label: "Flat color" },
  { value: "custom", label: "Custom texture" },
  { value: "none", label: "No detail view" }
], Rs = [
  { value: "sphere", label: "Sphere" },
  { value: "cube", label: "Cube" },
  { value: "donut", label: "Donut" },
  { value: "asteroid", label: "Asteroid" },
  { value: "crystal", label: "Crystal" },
  { value: "cylinder", label: "Cylinder" }
], $s = [
  { value: "smooth", label: "Smooth" },
  { value: "matte", label: "Matte" },
  { value: "holographic", label: "Holographic" }
];
function Ye(e) {
  return Rs.some((t) => t.value === e) ? String(e) : "sphere";
}
function Gt(e) {
  return $s.some((t) => t.value === e) ? String(e) : "smooth";
}
function rt(e) {
  return e === "auto" ? "ice" : Dt.some((t) => t.value === e) ? String(e) : "ice";
}
const Bt = /* @__PURE__ */ new Set(["color", "custom", "none"]), xt = {
  sphere: Ge.map((e) => e.value).filter((e) => !["prison", "anomaly", "cube", "donut-planet"].includes(e)),
  cube: ["cube"],
  donut: ["donut-planet"],
  asteroid: ["asteroid"],
  crystal: ["anomaly"],
  cylinder: ["prison"]
};
function zt(e) {
  const t = new Set(xt[Ye(e)] ?? xt.sphere);
  return Dt.filter((o) => t.has(o.value) || Bt.has(o.value));
}
function Ht(e, t) {
  var f;
  const o = rt(e), c = zt(t);
  return c.some((l) => l.value === o) ? o : ((f = c.find((l) => !Bt.has(l.value))) == null ? void 0 : f.value) ?? "color";
}
function Fs(e) {
  return e === "black-hole";
}
function Pe(e, t = "") {
  if (!e || e.obscured || e.planetPreset === "none") return null;
  const o = rt(e.planetPreset), c = Ge.find((y) => y.value === t) ?? Ge.find((y) => y.value === o) ?? Ge[0], f = !t && o === "custom" && !!e.planetTexture, l = !t && o === "color";
  return {
    texture: l ? null : f ? e.planetTexture : `modules/galaxy-map/assets/planets/${c.texture}`,
    label: l ? "Flat color" : f ? "Custom texture" : c.label,
    preset: l ? "color" : f ? "custom" : c.value,
    color: l ? e.planetColor || "#58d8ff" : c.color,
    shape: Ye(e.planetShape),
    finish: Gt(e.planetFinish)
  };
}
const ot = [
  { value: "gm", label: "GM approval" },
  { value: "majority", label: "Majority vote" },
  { value: "unanimous", label: "Unanimous agreement" }
];
function ct(e) {
  return ot.some((t) => t.value === e) ? String(e) : "unanimous";
}
function Je(e, t, o, c) {
  const f = ct(c), l = [...new Map((e ?? []).filter((L) => L == null ? void 0 : L.id).map((L) => [String(L.id), L])).values()], y = f === "gm" ? o != null && o.id ? [o] : [] : l.filter((L) => String(L.id) !== String(t)), u = y.map((L) => String(L.id)), x = Object.fromEntries(y.map((L) => [String(L.id), String(L.name || "Navigator").slice(0, 80)])), I = u.length + (f === "gm" ? 0 : 1), M = f === "gm" ? 1 : f === "majority" ? Math.floor(I / 2) + 1 : I;
  return { approvalMode: f, voterIds: u, voterNames: x, participantCount: I, requiredApprovals: M };
}
function Et(e) {
  const t = ct(e == null ? void 0 : e.approvalMode), o = [...new Set(((e == null ? void 0 : e.voterIds) ?? []).map(String))], c = new Set([...(e == null ? void 0 : e.accepted) ?? []].map(String)), f = new Set([...(e == null ? void 0 : e.declined) ?? []].map(String)), l = t === "gm" ? 0 : 1, y = Math.max(1, Number(e == null ? void 0 : e.requiredApprovals) || (t === "unanimous" ? o.length + 1 : 1)), u = l + o.filter((M) => c.has(M)).length, x = o.filter((M) => f.has(M)).length, I = o.filter((M) => !c.has(M) && !f.has(M));
  return u >= y ? { outcome: "approved", acceptedCount: u, declinedCount: x, required: y, pendingIds: I } : t === "unanimous" && x > 0 ? { outcome: "declined", acceptedCount: u, declinedCount: x, required: y, pendingIds: I } : u + I.length < y ? { outcome: "declined", acceptedCount: u, declinedCount: x, required: y, pendingIds: I } : { outcome: "pending", acceptedCount: u, declinedCount: x, required: y, pendingIds: I };
}
const ke = 3, Ns = ["core", "colony", "frontier", "ruins", "restricted", "unknown"], Ds = ["star", "planet", "moon", "station", "asteroid", "anomaly", "black-hole", "other"], Vt = ["undiscovered", "known", "visited", "danger", "locked"], Gs = ["safe", "dangerous", "restricted", "smuggler", "unknown"], et = ["gm", "players"], Ut = ["inherit", ...et], Bs = [
  { value: "planet", label: "Planet" },
  { value: "terrestrial", label: "Terrestrial" },
  { value: "gas-giant", label: "Gas Giant" },
  { value: "ice-world", label: "Ice World" },
  { value: "volcanic", label: "Volcanic" },
  { value: "artificial", label: "Artificial / Machine World" },
  { value: "ringed", label: "Ringed" },
  { value: "star", label: "Star" },
  { value: "black-hole", label: "Black Hole" },
  { value: "station", label: "Space Station" },
  { value: "diamond", label: "Diamond" },
  { value: "void", label: "Void" }
], lt = Bs.map((e) => e.value), tt = lt, Ze = 0.2, Ke = 10, Yt = 2400, zs = 6e4;
function _e(e = "gmf") {
  return `${e}-${foundry.utils.randomID(10)}`;
}
function Be(e, t = "players") {
  const o = et.includes(t) ? t : "players";
  return et.includes(e) ? String(e) : o;
}
function Hs(e) {
  return Ut.includes(e) ? String(e) : "inherit";
}
function Vs(e) {
  return typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "#58d8ff";
}
function st(e) {
  return typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "";
}
function be(e, t = 0) {
  const o = Number(e);
  return Number.isFinite(o) ? o : t;
}
function Us(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  return [...new Set(t.map((o) => String(o).trim()).filter(Boolean))];
}
function oe(e, t, o) {
  return Math.min(o, Math.max(t, e));
}
function Pt(e, t) {
  return !Array.isArray(e) || e.length < 3 ? [...t] : e.slice(0, 3).map((o, c) => oe(be(o, t[c]), -2.5, 2.5));
}
function Wt(e = {}) {
  const t = Pt(e.normal, [0, 0, 1]), o = Math.hypot(...t) || 1;
  return {
    id: String(e.id || _e("location")),
    sceneId: String(e.sceneId || "").trim(),
    shape: Ye(e.shape),
    position: Pt(e.position, [0, 0, 1]),
    normal: t.map((c) => c / o),
    surfaceVersion: 1
  };
}
function Xt(e) {
  const t = /* @__PURE__ */ new Set();
  return (Array.isArray(e) ? e : []).slice(0, 64).map(Wt).filter((o) => {
    const c = `${o.sceneId}:${o.shape}`;
    return !o.sceneId || t.has(c) ? !1 : (t.add(c), !0);
  });
}
function Jt(e = {}) {
  return Ds.includes(e.kind) ? e.kind : e.type === "station" || e.iconStyle === "station" ? "station" : e.type === "anomaly" ? "anomaly" : e.iconStyle === "star" ? "star" : e.iconStyle === "black-hole" ? "black-hole" : e.planetShape === "asteroid" ? "asteroid" : ["planet", "terrestrial", "gas-giant", "ice-world", "volcanic", "artificial", "ringed"].includes(e.iconStyle) ? "planet" : "other";
}
function it(e = {}) {
  const t = Us(e.sceneIds === void 0 ? e.sceneId : e.sceneIds), o = String(e.planetTexture || "").trim(), c = Ye(e.planetShape), f = rt(e.planetPreset), l = Ht(f, c), y = o && !["none", "color"].includes(l) ? "custom" : l, u = Jt(e);
  return {
    id: String(e.id || _e("object")),
    name: String(e.name || "Unnamed Object"),
    kind: u,
    x: oe(be(e.x, 50), 0, 100),
    y: oe(be(e.y, 50), 0, 100),
    status: Vt.includes(e.status) ? e.status : "known",
    visibility: Hs(e.visibility),
    factionId: String(e.factionId || ""),
    description: String(e.description || ""),
    image: String(e.image || ""),
    sceneIds: t,
    planetLocations: Xt(e.planetLocations).filter((I) => t.includes(I.sceneId)),
    journalId: String(e.journalId || ""),
    notes: String(e.notes || "").trim(),
    iconColor: st(e.iconColor),
    iconSize: oe(be(e.iconSize, 28), 18, 56),
    markerImage: String(e.markerImage || "").trim(),
    iconStyle: lt.includes(e.iconStyle) ? e.iconStyle : u === "star" ? "star" : u === "station" ? "station" : "planet",
    pulse: e.pulse !== !1,
    planetPreset: y,
    planetShape: c,
    planetFinish: Gt(e.planetFinish),
    planetTexture: o,
    planetColor: st(e.planetColor) || "#58d8ff"
  };
}
const kt = it;
function Zt(e = {}) {
  var u;
  const t = Array.isArray(e.objects) ? e.objects.map(it) : [], o = new Set(t.map((x) => x.id)), c = (Array.isArray(e.routes) ? e.routes : []).map(dt).filter((x) => x.fromSystemId !== x.toSystemId && o.has(x.fromSystemId) && o.has(x.toSystemId)), f = t.some((x) => x.id === e.primaryObjectId) ? String(e.primaryObjectId) : ((u = t[0]) == null ? void 0 : u.id) ?? "", l = t.find((x) => x.id === f) ?? it(e), y = {
    id: String(e.id || _e("system")),
    name: String(e.name || "Unnamed System"),
    x: oe(be(e.x, 50), 0, 100),
    y: oe(be(e.y, 50), 0, 100),
    type: Ns.includes(e.type) ? e.type : "unknown",
    factionId: String(e.factionId || ""),
    status: Vt.includes(e.status) ? e.status : "known",
    description: String(e.description || ""),
    visibility: Be(e.visibility, "players"),
    notes: String(e.notes || "").trim(),
    backgroundImage: String(e.backgroundImage || "").trim(),
    iconColor: st(e.iconColor),
    iconSize: oe(be(e.iconSize, 30), 18, 56),
    markerImage: String(e.markerImage || "").trim(),
    iconStyle: lt.includes(e.iconStyle) ? e.iconStyle : "star",
    pulse: e.pulse !== !1,
    primaryObjectId: f,
    objects: t,
    routes: c
  };
  for (const [x, I] of Object.entries({
    image: l.image,
    sceneIds: [...l.sceneIds],
    planetLocations: [...l.planetLocations],
    journalId: l.journalId,
    planetPreset: l.planetPreset,
    planetShape: l.planetShape,
    planetFinish: l.planetFinish,
    planetTexture: l.planetTexture,
    planetColor: l.planetColor
  })) Object.defineProperty(y, x, { value: I, enumerable: !1, configurable: !0 });
  return y;
}
function dt(e = {}) {
  return {
    id: String(e.id || _e("route")),
    fromSystemId: String(e.fromSystemId || ""),
    toSystemId: String(e.toSystemId || ""),
    type: Gs.includes(e.type) ? e.type : "unknown",
    travelTime: String(e.travelTime || ""),
    fuelCost: be(e.fuelCost, 0),
    visibility: Be(e.visibility, "players"),
    notes: String(e.notes || "")
  };
}
function Kt(e = {}) {
  return {
    id: String(e.id || _e("faction")),
    name: String(e.name || "Unaffiliated"),
    color: Vs(e.color),
    description: String(e.description || ""),
    visibility: Be(e.visibility, "players")
  };
}
function ut(e = {}) {
  return `${String(e.id || "galaxy")}-system-1`;
}
function Ys(e = {}) {
  const t = String(e.id || e.objectId || _e("object")), o = Jt(e);
  return {
    ...e,
    id: t,
    name: String(e.name || "Unnamed Location"),
    kind: o,
    x: e.x,
    y: e.y,
    visibility: e.visibility,
    iconColor: e.iconColor,
    iconSize: e.iconSize,
    iconStyle: e.iconStyle === "planet" && o !== "planet" ? o === "station" ? "station" : o === "star" ? "star" : "diamond" : e.iconStyle,
    pulse: e.pulse
  };
}
function Qt(e, t, o = "", c = ut(e), f = []) {
  var y;
  const l = t.some((u) => u.id === o) ? o : ((y = t[0]) == null ? void 0 : y.id) ?? "";
  return {
    id: c,
    name: "System 1",
    x: 50,
    y: 50,
    type: "core",
    factionId: "",
    status: "known",
    description: "",
    visibility: Be(e.visibility, "players"),
    notes: "",
    iconColor: "",
    iconSize: 30,
    iconStyle: "star",
    pulse: !0,
    primaryObjectId: l,
    objects: t,
    routes: f
  };
}
function Ws(e, t) {
  var y;
  const c = (Array.isArray(e.systems) ? e.systems : []).map(Ys), f = String(e.currentSystemId || ((y = c[0]) == null ? void 0 : y.id) || ""), l = Qt(e, c, f, ut(e), Array.isArray(e.routes) ? e.routes : []);
  return {
    ...e,
    schemaVersion: ke,
    migratedFromSchema: t,
    systems: [l],
    routes: [],
    currentLocation: { systemId: l.id, objectId: l.primaryObjectId },
    currentSystemId: l.id
  };
}
function qt(e) {
  return !!(e != null && e.id && (e == null ? void 0 : e.primaryObjectId) === `${e.id}-object` && Array.isArray(e.objects) && e.objects.some((t) => t.id === e.primaryObjectId));
}
function Xs(e) {
  var ae, W, H, R;
  const t = Array.isArray(e.systems) ? e.systems : [], o = t.filter(qt), c = t.filter(($) => !qt($));
  if (!o.length && t.length) return { ...e, schemaVersion: ke };
  const f = new Set(c.map(($) => String($.id)));
  let l = ut(e);
  f.has(l) && (l = `${l}-legacy`);
  const y = new Set(o.map(($) => String($.id))), u = new Map(o.map(($) => [String($.id), String($.primaryObjectId)])), x = o.flatMap(($) => ($.objects ?? []).map((Y) => {
    const ue = Y.id === $.primaryObjectId;
    return {
      ...Y,
      x: ue ? $.x : Y.x,
      y: ue ? $.y : Y.y,
      visibility: Y.visibility === "inherit" ? $.visibility : Y.visibility,
      factionId: Y.factionId || $.factionId || ""
    };
  })), I = String(((ae = e.currentLocation) == null ? void 0 : ae.systemId) || e.currentSystemId || ""), M = o.find(($) => $.id === I), L = String(((W = e.currentLocation) == null ? void 0 : W.objectId) || (M == null ? void 0 : M.primaryObjectId) || ((H = x[0]) == null ? void 0 : H.id) || ""), T = Array.isArray(e.routes) ? e.routes : [], G = T.filter(($) => y.has(String($.fromSystemId)) && y.has(String($.toSystemId))).map(($) => ({ ...$, fromSystemId: u.get(String($.fromSystemId)), toSystemId: u.get(String($.toSystemId)) })), F = Qt(e, x, L, l, G), U = [F, ...c], ne = new Set(U.map(($) => String($.id))), P = /* @__PURE__ */ new Set(), te = T.filter(($) => !(y.has(String($.fromSystemId)) && y.has(String($.toSystemId)))).map(($) => ({
    ...$,
    fromSystemId: y.has(String($.fromSystemId)) ? l : $.fromSystemId,
    toSystemId: y.has(String($.toSystemId)) ? l : $.toSystemId
  })).filter(($) => {
    if ($.fromSystemId === $.toSystemId || !ne.has(String($.fromSystemId)) || !ne.has(String($.toSystemId))) return !1;
    const Y = [$.fromSystemId, $.toSystemId].sort().join(":");
    return P.has(Y) ? !1 : (P.add(Y), !0);
  }), K = y.has(I) || !ne.has(I) ? l : I;
  return {
    ...e,
    schemaVersion: ke,
    migratedFromSchema: 2,
    systems: U,
    routes: te,
    currentLocation: { systemId: K, objectId: K === l ? F.primaryObjectId : ((R = e.currentLocation) == null ? void 0 : R.objectId) ?? "" },
    currentSystemId: K
  };
}
function Js(e = {}) {
  const t = Number(e.schemaVersion) || 1;
  if (t > ke) throw new Error(`Galaxy Map schema ${t} is newer than supported schema ${ke}.`);
  return t >= ke ? { ...e, schemaVersion: ke } : t < 2 ? Ws(e, t) : Xs(e);
}
function V(e = {}) {
  var M, L, T, G;
  const t = Js(e), o = Array.isArray(t.systems) ? t.systems.map(Zt) : [], c = Array.isArray(t.routes) ? t.routes.map(dt) : [], f = Array.isArray(t.factions) ? t.factions.map(Kt) : [], l = String(((M = t.currentLocation) == null ? void 0 : M.systemId) || t.currentSystemId || ((L = o[0]) == null ? void 0 : L.id) || ""), y = o.some((F) => F.id === l) ? l : ((T = o[0]) == null ? void 0 : T.id) ?? "", u = o.find((F) => F.id === y), x = String(((G = t.currentLocation) == null ? void 0 : G.objectId) || ""), I = u != null && u.objects.some((F) => F.id === x) ? x : (u == null ? void 0 : u.primaryObjectId) ?? "";
  return {
    schemaVersion: ke,
    id: String(t.id || _e("map")),
    title: String(t.title || "Untitled Galaxy Map"),
    subtitle: String(t.subtitle || ""),
    description: String(t.description || ""),
    backgroundImage: String(t.backgroundImage || ""),
    visibility: Be(t.visibility, "players"),
    travelApprovalMode: ct(t.travelApprovalMode),
    currentLocation: { systemId: y, objectId: I },
    currentSystemId: y,
    systems: o,
    routes: c,
    factions: f
  };
}
function Oe(e, t) {
  return (t == null ? void 0 : t.visibility) === "inherit" ? (e == null ? void 0 : e.visibility) ?? "gm" : (t == null ? void 0 : t.visibility) ?? "gm";
}
const Zs = "modules/galaxy-map/assets/frames/galaxy-frame-cyan.svg";
let Ct = null;
const jt = /* @__PURE__ */ new Map();
let He = null;
const Ve = {
  default: { primary: "#69e8ff", success: "#62ffb6", background: "#03070b" },
  ember: { primary: "#ffb86b", success: "#ffe08a", background: "#0d0604" },
  violet: { primary: "#a9b8ff", success: "#7dffc4", background: "#070713" },
  "space-police": { primary: "#fff15a", success: "#9fffd1", background: "#020202" },
  red: { primary: "#ff304f", success: "#66ffc7", background: "#050103" },
  corporate: { primary: "#147dba", success: "#21875c", background: "#dce3e6" }
};
function Ot(e, t, o) {
  const c = (y) => [1, 3, 5].map((u) => Number.parseInt(y.slice(u, u + 2), 16)), f = c(e), l = c(t);
  return `rgb(${f.map((y, u) => Math.round(y * o + l[u] * (1 - o))).join(", ")})`;
}
function Ks() {
  var c, f, l, y, u, x;
  const e = document.documentElement, t = ((c = e == null ? void 0 : e.dataset) == null ? void 0 : c.holosuiteDeviceStyle) || ((l = (f = document.body) == null ? void 0 : f.dataset) == null ? void 0 : l.holosuiteDeviceStyle) || "";
  if (Ve[t]) return Ve[t];
  const o = ((y = e == null ? void 0 : e.dataset) == null ? void 0 : y.holosuiteTheme) || ((x = (u = document.body) == null ? void 0 : u.dataset) == null ? void 0 : x.holosuiteTheme) || "default";
  return Ve[o] ?? Ve.default;
}
async function es(e) {
  const { primary: t, success: o, background: c } = Ks(), f = Ot(t, c, 0.58), l = Ot(t, c, 0.34), y = [t, o, f, l, c].join("|");
  e.dataset.gmfFramePalette = y;
  let u = jt.get(y);
  if (!u)
    try {
      Ct ?? (Ct = fetch(Zs).then((M) => {
        if (!M.ok) throw new Error(`Galaxy frame request failed (${M.status})`);
        return M.text();
      }));
      let x = await Ct;
      x = x.replace(/<script\b[\s\S]*?<\/script>/gi, "");
      const I = /* @__PURE__ */ new Map([
        ["#18ebed", t],
        ["#28f3f5", t],
        ["#3be8e4", t],
        ["#64f4f1", o],
        ["#1490ab", f],
        ["#22788b", l],
        ["#042228", c]
      ]);
      for (const [M, L] of I) x = x.replace(new RegExp(M, "gi"), L);
      u = URL.createObjectURL(new Blob([x], { type: "image/svg+xml" })), jt.set(y, u);
    } catch {
      return;
    }
  e.isConnected && e.dataset.gmfFramePalette === y && e.style.setProperty("--gmf-frame-image", `url("${u}")`);
}
function Qs() {
  if (He) return;
  He = new MutationObserver(() => {
    document.querySelectorAll(".gmf-manager-window, .gmf-map-window, .gmf-crud-dialog").forEach((t) => void es(t));
  });
  const e = { attributes: !0, attributeFilter: ["data-holosuite-theme", "data-holosuite-device-style"] };
  He.observe(document.documentElement, e), document.body && He.observe(document.body, e);
}
function ts(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
function ss(e) {
  var t, o;
  return e ? (t = e.matches) != null && t.call(e, ".window-app, .application, .app") ? e : (o = e.closest) == null ? void 0 : o.call(e, ".window-app, .application, .app") : null;
}
function We(e, t) {
  const o = ts(t), c = ss(o);
  c && (Qs(), es(c));
  const f = Array.from((o == null ? void 0 : o.querySelectorAll("[data-gmf-window-drag]")) ?? []);
  if (!(!o || !c || !f.length)) {
    o.querySelectorAll("[data-action='close-window']").forEach((l) => {
      l.dataset.gmfCloseBound !== "true" && (l.dataset.gmfCloseBound = "true", l.addEventListener("click", () => {
        var y;
        return (y = e.close) == null ? void 0 : y.call(e);
      }));
    });
    for (const l of f)
      l.dataset.gmfDragBound !== "true" && (l.dataset.gmfDragBound = "true", l.addEventListener("pointerdown", (y) => {
        var U, ne, P;
        if (y.button !== 0) return;
        const u = y.target;
        if ((U = u == null ? void 0 : u.closest) != null && U.call(u, "button, input, select, textarea, a, [data-action]")) return;
        const x = c.getBoundingClientRect(), I = y.clientX, M = y.clientY, L = x.left, T = x.top;
        (ne = e.bringToFront ?? e.bringToTop) == null || ne.call(e), (P = l.setPointerCapture) == null || P.call(l, y.pointerId), l.classList.add("is-dragging");
        const G = (te) => {
          var R;
          const K = c.getBoundingClientRect().width, ae = c.getBoundingClientRect().height, W = Math.max(0, Math.min(window.innerWidth - Math.min(K, 80), L + te.clientX - I)), H = Math.max(0, Math.min(window.innerHeight - Math.min(ae, 48), T + te.clientY - M));
          (R = e.setPosition) == null || R.call(e, { left: W, top: H });
        }, F = () => {
          l.classList.remove("is-dragging"), l.removeEventListener("pointermove", G), l.removeEventListener("pointerup", F), l.removeEventListener("pointercancel", F);
        };
        l.addEventListener("pointermove", G), l.addEventListener("pointerup", F), l.addEventListener("pointercancel", F);
      }));
  }
}
function ei(e, t) {
  var I, M;
  const o = ts(t), c = ss(o), f = (I = c == null ? void 0 : c.querySelector) == null ? void 0 : I.call(c, ":scope > .window-content");
  if (!o || !c || !f || f.querySelector(":scope > .gmf-dialog-header")) return;
  const l = document.createElement("header");
  l.className = "gmf-dialog-header", l.dataset.gmfWindowDrag = "true";
  const y = document.createElement("div");
  y.className = "gmf-dialog-header__identity", y.innerHTML = '<span class="gmf-dialog-header__orb"><i class="fa-solid fa-satellite"></i></span><span><small>GALAXY MAP // CONTROL PANEL</small><strong></strong></span>';
  const u = y.querySelector("strong");
  u && (u.textContent = (e == null ? void 0 : e.title) || ((M = c.querySelector(".window-title")) == null ? void 0 : M.textContent) || "Galaxy Map");
  const x = document.createElement("button");
  x.type = "button", x.className = "gmf-window-close", x.dataset.action = "close-window", x.title = "Close", x.setAttribute("aria-label", "Close window"), x.innerHTML = '<i class="fa-solid fa-xmark"></i>', l.append(y, x), f.prepend(l), We(e, c);
}
const Ae = {
  classes: ["galaxy-map", "gmf-crud-dialog"]
};
function mt() {
  const { ApplicationV2: e, HandlebarsApplicationMixin: t } = foundry.applications.api;
  return t(e);
}
function ti(e) {
  return String(e || "galaxy-map").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "galaxy-map";
}
function si(e, t) {
  const o = JSON.stringify(t, null, 2), c = globalThis.saveDataToFile;
  if (typeof c == "function") {
    c(o, "application/json", e);
    return;
  }
  const f = new Blob([o], { type: "application/json" }), l = URL.createObjectURL(f), y = document.createElement("a");
  y.href = l, y.download = e, document.body.appendChild(y), y.click(), y.remove(), setTimeout(() => URL.revokeObjectURL(l), 0);
}
function ye(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function is(e) {
  return (e == null ? void 0 : e[0]) ?? e ?? null;
}
function At(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
}
function ns(e) {
  const t = (o) => o ? e.querySelector(`[name="${o}"]`) : null;
  e.querySelectorAll("[data-browse-target]").forEach((o) => {
    o.addEventListener("click", (c) => {
      var y, u;
      c.preventDefault();
      const f = t(o.dataset.browseTarget);
      if (!f) return;
      const l = ((u = (y = foundry.applications) == null ? void 0 : y.apps) == null ? void 0 : u.FilePicker) ?? globalThis.FilePicker;
      new l({
        type: "image",
        current: f.value,
        callback: (x) => {
          f.value = x, At(f);
        }
      }).browse();
    });
  }), e.querySelectorAll("[data-clear-target]").forEach((o) => {
    o.addEventListener("click", (c) => {
      c.preventDefault();
      const f = t(o.dataset.clearTarget);
      f && (f.value = "", At(f));
    });
  });
}
function ii(e) {
  var K;
  const {
    templateRoot: t,
    getMaps: o,
    prepareMapForManager: c,
    getRawMap: f,
    exportMap: l,
    duplicateMap: y,
    deleteMap: u,
    createMap: x,
    deleteSystem: I,
    deleteObject: M,
    deleteRoute: L,
    deleteFaction: T,
    openMap: G,
    showMapToPlayers: F,
    hideSystemFromPlayers: U,
    hideRouteFromPlayers: ne,
    hideFactionFromPlayers: P,
    clearManagerApp: te
  } = e;
  return K = class extends mt() {
    constructor(H = {}) {
      super(H);
      Z(this, "selectedMapId");
      Z(this, "activeTab");
      Z(this, "expandedSystemId");
      this.selectedMapId = H.selectedMapId ?? null, this.activeTab = ["systems", "routes", "factions"].includes(H.activeTab) ? H.activeTab : "systems", this.expandedSystemId = H.expandedSystemId;
    }
    async _prepareContext(H) {
      var ue, fe;
      const R = await super._prepareContext(H), $ = o().sort((ie, ee) => ie.title.localeCompare(ee.title));
      (!this.selectedMapId || !$.some((ie) => ie.id === this.selectedMapId)) && (this.selectedMapId = ((ue = $[0]) == null ? void 0 : ue.id) ?? null);
      const Y = this.selectedMapId ? c(f(this.selectedMapId)) : null;
      if (Y) {
        const ie = new Set(Y.systems.map((ee) => ee.id));
        this.expandedSystemId && !ie.has(this.expandedSystemId) && (this.expandedSystemId = void 0), this.expandedSystemId === void 0 && (this.expandedSystemId = ((fe = Y.systems[0]) == null ? void 0 : fe.id) ?? null), Y.systems = Y.systems.map((ee) => ({
          ...ee,
          isExpanded: ee.id === this.expandedSystemId
        }));
      }
      return {
        ...R,
        maps: $,
        selectedMap: Y,
        selectedMapId: this.selectedMapId,
        activeTab: this.activeTab,
        showSystems: this.activeTab === "systems",
        showRoutes: this.activeTab === "routes",
        showFactions: this.activeTab === "factions",
        hasMaps: $.length > 0
      };
    }
    _attachPartListeners(H, R, $) {
      var Y, ue, fe, ie, ee, ve;
      super._attachPartListeners(H, R, $), We(this, R), (Y = R.querySelector("[data-action='create-map']")) == null || Y.addEventListener("click", () => this._onCreateMap()), (ue = R.querySelector("[data-action='edit-map-metadata']")) == null || ue.addEventListener("click", () => {
        this._openViewportEditor("map");
      }), (fe = R.querySelector("[data-action='create-system']")) == null || fe.addEventListener("click", () => {
        this._openViewportEditor("system");
      }), (ie = R.querySelector("[data-action='create-route']")) == null || ie.addEventListener("click", () => {
        this._openViewportEditor("route");
      }), (ee = R.querySelector("[data-action='create-faction']")) == null || ee.addEventListener("click", () => {
        this._openViewportEditor("faction");
      }), R.querySelectorAll("[data-manager-tab]").forEach((j) => {
        j.addEventListener("click", () => {
          const ce = j.dataset.managerTab;
          !["systems", "routes", "factions"].includes(ce) || ce === this.activeTab || (this.activeTab = ce, this.render({ force: !0 }));
        });
      }), R.querySelectorAll("[data-toggle-system]").forEach((j) => {
        j.addEventListener("click", () => {
          const ce = j.dataset.toggleSystem;
          this.expandedSystemId = this.expandedSystemId === ce ? null : ce, this.render({ force: !0 });
        });
      }), R.querySelectorAll("[data-edit-system]").forEach((j) => {
        j.addEventListener("click", () => this._openViewportEditor("system", { id: j.dataset.editSystem }));
      }), R.querySelectorAll("[data-create-object]").forEach((j) => {
        j.addEventListener("click", () => this._openViewportEditor("entity", { systemId: j.dataset.createObject }));
      }), R.querySelectorAll("[data-edit-object]").forEach((j) => {
        j.addEventListener("click", () => this._openViewportEditor("entity", { systemId: j.dataset.objectSystem, id: j.dataset.editObject }));
      }), R.querySelectorAll("[data-delete-object]").forEach((j) => {
        j.addEventListener("click", () => this._confirmDeleteObject(j.dataset.objectSystem, j.dataset.deleteObject));
      }), R.querySelectorAll("[data-show-system]").forEach((j) => {
        j.addEventListener("click", () => U(this.selectedMapId, j.dataset.showSystem, !1));
      }), R.querySelectorAll("[data-hide-system]").forEach((j) => {
        j.addEventListener("click", () => U(this.selectedMapId, j.dataset.hideSystem, !0));
      }), R.querySelectorAll("[data-delete-system]").forEach((j) => {
        j.addEventListener("click", () => this._confirmDeleteSystem(j.dataset.deleteSystem));
      }), R.querySelectorAll("[data-edit-route]").forEach((j) => {
        j.addEventListener("click", () => this._openViewportEditor("route", { id: j.dataset.editRoute, systemId: j.dataset.routeSystem }));
      }), R.querySelectorAll("[data-show-route]").forEach((j) => {
        j.addEventListener("click", () => ne(this.selectedMapId, j.dataset.showRoute, !1, j.dataset.routeSystem));
      }), R.querySelectorAll("[data-hide-route]").forEach((j) => {
        j.addEventListener("click", () => ne(this.selectedMapId, j.dataset.hideRoute, !0, j.dataset.routeSystem));
      }), R.querySelectorAll("[data-delete-route]").forEach((j) => {
        j.addEventListener("click", () => this._confirmDeleteRoute(j.dataset.deleteRoute, j.dataset.routeSystem));
      }), R.querySelectorAll("[data-edit-faction]").forEach((j) => {
        j.addEventListener("click", () => this._openViewportEditor("faction", { id: j.dataset.editFaction }));
      }), R.querySelectorAll("[data-show-faction]").forEach((j) => {
        j.addEventListener("click", () => P(this.selectedMapId, j.dataset.showFaction, !1));
      }), R.querySelectorAll("[data-hide-faction]").forEach((j) => {
        j.addEventListener("click", () => P(this.selectedMapId, j.dataset.hideFaction, !0));
      }), R.querySelectorAll("[data-delete-faction]").forEach((j) => {
        j.addEventListener("click", () => this._confirmDeleteFaction(j.dataset.deleteFaction));
      }), (ve = R.querySelector("[data-action='export-map']")) == null || ve.addEventListener("click", () => {
        this.selectedMapId && l(this.selectedMapId);
      }), R.querySelectorAll("[data-select-map]").forEach((j) => {
        j.addEventListener("click", () => {
          this.selectedMapId = j.dataset.selectMap, this.expandedSystemId = void 0, this.render({ force: !0 });
        });
      }), R.querySelectorAll("[data-open-map]").forEach((j) => {
        j.addEventListener("click", () => G(j.dataset.openMap));
      }), R.querySelectorAll("[data-show-map]").forEach((j) => {
        j.addEventListener("click", () => F(j.dataset.showMap));
      }), R.querySelectorAll("[data-duplicate-map]").forEach((j) => {
        j.addEventListener("click", async () => {
          const ce = await y(j.dataset.duplicateMap);
          ce && (this.selectedMapId = ce.id, this.render({ force: !0 }));
        });
      }), R.querySelectorAll("[data-delete-map]").forEach((j) => {
        j.addEventListener("click", async () => {
          const ce = j.dataset.deleteMap, we = f(ce);
          await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${ye((we == null ? void 0 : we.title) ?? ce)}</strong>? This cannot be undone.</p>`
          }, Ae) && (await u(ce), this.selectedMapId === ce && (this.selectedMapId = null), this.render({ force: !0 }));
        });
      });
    }
    async _onCreateMap() {
      const H = await x({
        title: "New Galaxy Map",
        subtitle: "Uncharted theatre",
        description: "A campaign-scale navigation map.",
        visibility: "players",
        factions: [
          {
            id: "independent",
            name: "Independent",
            color: "#58d8ff",
            description: "Unaffiliated worlds and stations.",
            visibility: "players"
          }
        ],
        systems: [],
        routes: []
      });
      H && (this.selectedMapId = H.id, this.render({ force: !0 }));
    }
    _openViewportEditor(H, R = {}) {
      var $, Y;
      this.selectedMapId && ((Y = ($ = G(this.selectedMapId)) == null ? void 0 : $.openEditor) == null || Y.call($, H, R));
    }
    async _confirmDeleteSystem(H) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, Ae) && await I(this.selectedMapId, H);
    }
    async _confirmDeleteObject(H, R) {
      await Dialog.confirm({
        title: "Delete Location",
        content: "<p>Delete this location and its linked content from the system?</p>"
      }) && await M(this.selectedMapId, H, R);
    }
    async _confirmDeleteRoute(H, R = "") {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, Ae) && await L(this.selectedMapId, H, R);
    }
    async _confirmDeleteFaction(H) {
      await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }, Ae) && await T(this.selectedMapId, H);
    }
    async close(H = {}) {
      return te(this), super.close(H);
    }
  }, Z(K, "DEFAULT_OPTIONS", {
    id: "galaxy-map-manager",
    classes: ["galaxy-map", "galaxy-map-framework", "gmf-manager-window"],
    window: {
      title: "Galaxy Map Manager",
      icon: "fa-solid fa-satellite",
      resizable: !0
    },
    position: {
      width: 980,
      height: 720
    }
  }), Z(K, "PARTS", {
    main: {
      template: `${t}/map-manager.hbs`
    }
  }), K;
}
function ni(e, t) {
  const o = (c, f, l) => (f[0] - c[0]) * (l[1] - c[1]) - (f[1] - c[1]) * (l[0] - c[0]);
  return t.flatMap((c) => {
    const f = e.filter((I) => I.factionId === c.id && !I.obscured);
    if (!f.length) return [];
    const l = f.flatMap((I) => Array.from({ length: 12 }, (M, L) => {
      const T = L * Math.PI / 6;
      return [
        Math.max(1, Math.min(99, I.x + Math.cos(T) * 7)),
        Math.max(1, Math.min(99, I.y + Math.sin(T) * 9))
      ];
    })).sort((I, M) => I[0] - M[0] || I[1] - M[1]), y = (I) => {
      const M = [];
      for (const L of I) {
        for (; M.length > 1 && o(M[M.length - 2], M[M.length - 1], L) <= 0; ) M.pop();
        M.push(L);
      }
      return M.slice(0, -1);
    }, u = [...y(l), ...y([...l].reverse())], x = Math.min(...l.map((I) => I[1]));
    return [{
      id: c.id,
      name: c.name,
      color: c.color,
      points: u.map((I) => I.map((M) => M.toFixed(2)).join(",")).join(" "),
      labelX: (Math.min(...l.map((I) => I[0])) + Math.max(...l.map((I) => I[0]))) / 2,
      labelY: Math.max(3, x + 3)
    }];
  });
}
function as() {
  var e, t, o;
  try {
    const c = (t = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : t.call(e, "bounty-board");
    if ((c == null ? void 0 : c.active) === !1) return null;
    const f = c.api ?? ((o = game.scifiSuite) == null ? void 0 : o.bountyBoard);
    return typeof (f == null ? void 0 : f.getBountiesForScene) == "function" ? f : null;
  } catch {
    return null;
  }
}
function ai(e) {
  const t = as();
  if (!t || !Array.isArray(e == null ? void 0 : e.sceneIds)) return [];
  const o = /* @__PURE__ */ new Set(), c = [];
  try {
    for (const f of e.sceneIds)
      for (const l of t.getBountiesForScene(String(f)) ?? []) {
        const y = String((l == null ? void 0 : l.id) ?? "");
        !y || o.has(y) || (o.add(y), c.push({
          id: y,
          name: String(l.name || "Unknown target"),
          image: String(l.image || ""),
          status: String(l.status || ""),
          statusLabel: String(l.statusLabel || l.status || ""),
          reward: String(l.reward || ""),
          sceneId: String(l.sceneId || f)
        }));
      }
  } catch {
    return [];
  }
  return c;
}
function ri(e) {
  try {
    const t = as();
    return typeof (t == null ? void 0 : t.openBounty) == "function" && t.openBounty(String(e)) !== !1;
  } catch {
    return !1;
  }
}
const je = /* @__PURE__ */ new Map(), oi = 40, ci = 192;
function li(e) {
  return new Promise((t, o) => {
    const c = new Image();
    c.onload = () => t(c), c.onerror = () => o(new Error("Image unavailable")), c.src = e;
  });
}
async function di(e) {
  if (!e) return null;
  try {
    const t = await li(e), o = Math.min(1, ci / Math.max(t.naturalWidth || t.width, t.naturalHeight || t.height)), c = Math.max(2, Math.round((t.naturalWidth || t.width) * o)), f = Math.max(2, Math.round((t.naturalHeight || t.height) * o)), l = document.createElement("canvas");
    l.width = c, l.height = f;
    const y = l.getContext("2d", { willReadFrequently: !0 });
    if (!y) return null;
    y.drawImage(t, 0, 0, c, f);
    const u = y.getImageData(0, 0, c, f), x = y.createImageData(c, f), I = new Float32Array(c * f);
    for (let L = 0; L < I.length; L++) {
      const T = L * 4;
      I[L] = u.data[T] * 0.299 + u.data[T + 1] * 0.587 + u.data[T + 2] * 0.114;
    }
    const M = (L, T) => I[T * c + L];
    for (let L = 1; L < f - 1; L++)
      for (let T = 1; T < c - 1; T++) {
        const G = -M(T - 1, L - 1) + M(T + 1, L - 1) - 2 * M(T - 1, L) + 2 * M(T + 1, L) - M(T - 1, L + 1) + M(T + 1, L + 1), F = -M(T - 1, L - 1) - 2 * M(T, L - 1) - M(T + 1, L - 1) + M(T - 1, L + 1) + 2 * M(T, L + 1) + M(T + 1, L + 1), U = Math.hypot(G, F), ne = Math.max(0, Math.min(235, (U - 34) * 2.1)), P = (L * c + T) * 4;
        x.data[P] = 104, x.data[P + 1] = 241, x.data[P + 2] = 255, x.data[P + 3] = ne;
      }
    return y.clearRect(0, 0, c, f), y.putImageData(x, 0, 0), l.toDataURL("image/png");
  } catch {
    return null;
  }
}
function mi(e, t = "") {
  const o = `${t}\0${e}`, c = je.get(o);
  if (c)
    return je.delete(o), je.set(o, c), c;
  for (; je.size >= oi; ) {
    const l = je.keys().next().value;
    if (l === void 0) break;
    je.delete(l);
  }
  const f = di(e);
  return je.set(o, f), f;
}
function fi({ root: e, stage: t, resolveItems: o, onOpen: c }) {
  const f = e.querySelector("[data-intel-layer]");
  if (!f) return null;
  const l = new AbortController(), y = l.signal, u = document.createElement("aside");
  u.className = "gmf-intel-callout", u.setAttribute("aria-label", "Bounty intel"), u.hidden = !0, u.innerHTML = `
    <span class="gmf-intel-callout__connector" aria-hidden="true"></span>
    <div class="gmf-intel-callout__stack" data-intel-list role="group" aria-label="Matching bounties"></div>`, f.append(u);
  let x = [], I = null, M = null, L = null, T = 0, G = 0;
  const F = () => {
    M && clearTimeout(M), M = null;
  }, U = () => {
    T++, L && clearTimeout(L), L = null, M = null, I = null, x = [], G++, u.hidden = !0, u.classList.remove("is-visible", "is-left");
  }, ne = (W = 180) => {
    F(), T++, L && clearTimeout(L), L = null, M = setTimeout(U, W);
  }, P = () => {
    if (!I || u.hidden) return;
    const W = t.getBoundingClientRect(), H = I.getBoundingClientRect();
    u.style.setProperty("--gmf-intel-stack-height", `${Math.max(80, W.height - 72)}px`);
    const R = u.offsetWidth || 224, $ = u.offsetHeight || 126, Y = H.right - W.left + R + 24 > W.width, ue = Y ? H.left - W.left - R - 18 : H.right - W.left + 18, fe = Math.max(48, Math.min(W.height - $ - 12, H.top - W.top + H.height / 2 - $ / 2));
    u.classList.toggle("is-left", Y), u.style.left = `${Math.max(8, ue)}px`, u.style.top = `${fe}px`;
  }, te = () => {
    const W = u.querySelector("[data-intel-list]");
    if (!W || !x.length) return U();
    W.replaceChildren();
    const H = ++G;
    x.forEach((R, $) => {
      const Y = document.createElement("button");
      Y.type = "button", Y.className = "gmf-intel-callout__body", Y.dataset.intelOpen = R.id, Y.style.setProperty("--gmf-intel-index", String($)), Y.style.setProperty("--gmf-intel-delay", `${$ * 55}ms`), Y.innerHTML = `
        <span class="gmf-intel-callout__portrait"><img alt="" hidden /><i class="fa-solid fa-crosshairs"></i></span>
        <span class="gmf-intel-callout__copy"><small></small><strong></strong><span></span></span>`;
      const ue = Y.querySelector("strong"), fe = Y.querySelector("small"), ie = Y.querySelector(".gmf-intel-callout__copy > span"), ee = Y.querySelector("img"), ve = Y.querySelector("i");
      ue && (ue.textContent = R.name), fe && (fe.textContent = `BOUNTY // ${(R.statusLabel || "INTEL").toUpperCase()}`), ie && (ie.textContent = R.reward || ""), Y.addEventListener("click", () => c(R.id), { signal: y }), R.image && ee && (ee.src = R.image, ee.classList.add("is-css-fallback"), ee.hidden = !1, ve && (ve.hidden = !0), ee.onerror = () => {
        H === G && (ee.hidden = !0, ve && (ve.hidden = !1));
      }, mi(R.image, R.id).then((j) => {
        !j || H !== G || !Y.isConnected || (ee.classList.remove("is-css-fallback"), ee.src = j);
      })), W.append(Y);
    }), P();
  }, K = async (W) => {
    F(), I = W;
    const H = ++T;
    let R = [];
    try {
      R = await o(W.dataset.systemId ?? "");
    } catch {
    }
    if (!(H !== T || I !== W)) {
      if (!R.length) return U();
      x = R, u.hidden = !1, te(), requestAnimationFrame(() => {
        P(), u.classList.add("is-visible");
      });
    }
  }, ae = (W) => {
    F(), T++, L && clearTimeout(L), L = setTimeout(() => {
      L = null, K(W);
    }, 90);
  };
  return e.querySelectorAll("[data-system-id]").forEach((W) => {
    W.addEventListener("pointerenter", () => ae(W), { signal: y }), W.addEventListener("pointerleave", () => ne(), { signal: y }), W.addEventListener("focus", () => ae(W), { signal: y }), W.addEventListener("blur", () => ne(), { signal: y }), W.addEventListener("pointerdown", () => U(), { signal: y });
  }), u.addEventListener("pointerenter", F, { signal: y }), u.addEventListener("pointerleave", () => ne(), { signal: y }), u.addEventListener("click", (W) => W.stopPropagation(), { signal: y }), t.addEventListener("wheel", () => requestAnimationFrame(P), { signal: y }), window.addEventListener("resize", P, { signal: y }), {
    dispose() {
      T++, M && clearTimeout(M), L && clearTimeout(L), l.abort(), u.remove();
    }
  };
}
function pi({ host: e }) {
  const t = document.createElement("aside");
  t.className = "gmf-location-callout", t.hidden = !0, t.innerHTML = `
    <span class="gmf-location-callout__connector" aria-hidden="true"></span>
    <strong data-location-name></strong>`, e.append(t);
  let o = null, c = { x: 0, y: 0, visible: !1 }, f = null;
  const l = () => {
    f && clearTimeout(f), f = null;
  }, y = () => {
    l(), o = null, t.hidden = !0, t.classList.remove("is-visible", "is-left");
  }, u = () => {
    if (!o || t.hidden || !c.visible) return;
    const M = t.offsetWidth || 180, L = t.offsetHeight || 24, T = c.x + M + 76 > e.clientWidth, G = T ? c.x - M - 64 : c.x + 64, F = Math.max(8, Math.min(e.clientHeight - L - 8, c.y - L / 2));
    t.classList.toggle("is-left", T), t.style.left = `${Math.max(8, G)}px`, t.style.top = `${F}px`;
  }, x = (M) => {
    l(), o = M;
    const L = t.querySelector("[data-location-name]");
    L && (L.textContent = M.missing ? "Missing linked scene" : M.accessible ? M.name : "Restricted location"), t.hidden = !1, u(), requestAnimationFrame(() => {
      u(), t.classList.add("is-visible");
    });
  }, I = (M = 180) => {
    l(), f = setTimeout(y, M);
  };
  return {
    show: x,
    scheduleHide: I,
    hide: y,
    setAnchor(M) {
      if (c = M, !M.visible) return I(40);
      u();
    },
    dispose() {
      y(), t.remove();
    }
  };
}
function hi(e, t, o) {
  const c = o.querySelector("[data-ship-layer]"), f = o.querySelector(".gmf-map-stage");
  if (!c || !f) return Promise.resolve();
  const l = f.getBoundingClientRect(), y = (t.x - e.x) * l.width / 100, u = (t.y - e.y) * l.height / 100, x = Math.atan2(u, y) * 180 / Math.PI, I = document.createElement("div");
  return I.className = "gmf-travel-ship", I.innerHTML = '<i class="fa-solid fa-rocket"></i>', I.style.left = `${e.x}%`, I.style.top = `${e.y}%`, I.style.setProperty("--gmf-ship-angle", `${x}deg`), c.replaceChildren(I), new Promise((M) => {
    let L = !1;
    const T = () => {
      L || (L = !0, I.removeEventListener("transitionend", T), I.classList.add("is-arrived"), globalThis.setTimeout(() => {
        I.remove(), M();
      }, 260));
    };
    I.addEventListener("transitionend", T, { once: !0 }), requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        I.style.left = `${t.x}%`, I.style.top = `${t.y}%`;
      });
    }), globalThis.setTimeout(T, Yt);
  });
}
function yi(e) {
  var o, c;
  return (((c = (o = foundry.applications) == null ? void 0 : o.ux) == null ? void 0 : c.TextEditor) ?? globalThis.TextEditor).getDragEventData(e) ?? {};
}
async function rs(e) {
  var l, y, u, x, I, M, L, T;
  const t = yi(e), o = globalThis.fromUuid, c = t.uuid && o ? await o(t.uuid) : null;
  if (["Scene", "JournalEntry"].includes(c == null ? void 0 : c.documentName)) return c;
  const f = String(t.sceneId || t.journalId || t.id || "");
  return f ? t.type === "Scene" ? ((y = (l = game.scenes) == null ? void 0 : l.get) == null ? void 0 : y.call(l, f)) ?? null : ["JournalEntry", "Journal"].includes(t.type) ? ((x = (u = game.journal) == null ? void 0 : u.get) == null ? void 0 : x.call(u, f)) ?? null : ((M = (I = game.scenes) == null ? void 0 : I.get) == null ? void 0 : M.call(I, f)) ?? ((T = (L = game.journal) == null ? void 0 : L.get) == null ? void 0 : T.call(L, f)) ?? null : null;
}
async function gi(e) {
  const t = await rs(e);
  return (t == null ? void 0 : t.documentName) === "Scene" ? t : null;
}
function Si(e) {
  var Ie;
  const {
    templateRoot: t,
    getRawMap: o,
    prepareMapForDisplay: c,
    upsertSystem: f,
    upsertObject: l,
    upsertRoute: y,
    upsertFaction: u,
    updateMapMetadata: x,
    deleteFaction: I,
    getTextureGuideMarkup: M,
    activateObjectEditorControls: L,
    revealSystemToPlayers: T,
    revealRouteToPlayers: G,
    hideSystemFromPlayers: F,
    setObjectVisibility: U,
    hideRouteFromPlayers: ne,
    deleteSystem: P,
    deleteObject: te,
    deleteRoute: K,
    setCurrentSystem: ae,
    setCurrentObject: W,
    requestTravelToSystem: H,
    requestTravelToObject: R,
    exportMap: $,
    getTravelRoute: Y,
    broadcastTravelAnimation: ue,
    broadcastObjectTravelAnimation: fe,
    notifyInfo: ie,
    notifyError: ee,
    saveSystemPosition: ve,
    saveObjectPosition: j,
    savePlanetLocation: ce,
    removePlanetLocation: we,
    unlinkPlanetScene: Ce,
    clearMapView: De
  } = e;
  return Ie = class extends mt() {
    constructor(i = {}) {
      var r;
      const s = i.mapId, a = i.playerMode ?? !((r = game.user) != null && r.isGM);
      super({
        ...i,
        id: `galaxy-map-view-${a ? "player" : "gm"}-${s}`
      });
      Z(this, "mapId");
      Z(this, "playerMode");
      Z(this, "selectedSystemId");
      Z(this, "selectedRouteId");
      Z(this, "activeSystemId");
      Z(this, "selectedObjectId");
      Z(this, "zoom");
      Z(this, "panX");
      Z(this, "panY");
      Z(this, "_drag");
      Z(this, "_contextTarget");
      Z(this, "_boundContextClose");
      Z(this, "externalFocus");
      Z(this, "_externalFocusTimeout");
      Z(this, "_pendingFocusZoom");
      Z(this, "showTerritories", !0);
      Z(this, "showRoutes", !0);
      Z(this, "hardContrast", !1);
      Z(this, "planetSystemId", null);
      Z(this, "planetStatic", !1);
      Z(this, "_planetStaticViewKey", null);
      Z(this, "_planetRenderer", null);
      Z(this, "_planetGeneration", 0);
      Z(this, "_planetReturnFocus", !1);
      Z(this, "_bountyIntelCallout", null);
      Z(this, "_planetLocationCallout", null);
      Z(this, "creationPanel", null);
      Z(this, "factionRegistry", !1);
      Z(this, "_selectionTimer", null);
      Z(this, "_worldWidth", 0);
      Z(this, "_worldHeight", 0);
      Z(this, "_viewportResizeObserver", null);
      Z(this, "_baseWindowHeight", null);
      this.mapId = s, this.playerMode = a, this.selectedSystemId = i.selectedSystemId ?? null, this.selectedRouteId = i.selectedRouteId ?? null, this.activeSystemId = i.activeSystemId ?? null, this.selectedObjectId = i.selectedObjectId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null, this.externalFocus = null, this._externalFocusTimeout = null, this._pendingFocusZoom = null;
    }
    get title() {
      const i = o(this.mapId), s = this.playerMode ? "Player View" : "GM View";
      return i ? `${i.title} - ${s}` : `Galaxy Map - ${s}`;
    }
    async _prepareContext(i) {
      var J, pe, de, he, Q, le, Me, Le;
      const s = await super._prepareContext(i), a = o(this.mapId), r = a ? c(a, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      }) : null;
      r != null && r.systems && (r.systems = r.systems.map((E) => ({
        ...E,
        displayType: "system",
        factionName: "System",
        factionColor: "#58d8ff",
        animatedCelestial: !1,
        hasCustomMarker: !!E.displayMarkerImage
      })), r.selectedSystem && (r.selectedSystem = r.systems.find((E) => E.id === r.selectedSystem.id) ?? null)), r != null && r.systems && this.externalFocus && (r.systems = r.systems.map((E) => E.id === this.externalFocus.systemId ? { ...E, isExternalFocus: !0, externalFocus: this.externalFocus } : E), ((J = r.selectedSystem) == null ? void 0 : J.id) === this.externalFocus.systemId && (r.selectedSystem = r.systems.find((E) => E.id === this.externalFocus.systemId))), !this.activeSystemId && this.selectedSystemId && !(r != null && r.selectedSystem) && (this.selectedSystemId = null);
      const n = (r == null ? void 0 : r.systems.find((E) => E.id === this.activeSystemId)) ?? null;
      n && (r.backgroundImage = n.backgroundImage || "");
      const d = new Map(((r == null ? void 0 : r.factions) ?? []).map((E) => [E.id, E])), h = n ? n.objects.filter((E) => !this.playerMode || Oe(n, E) === "players").map((E) => {
        var _t;
        const re = this.playerMode && E.status === "undiscovered", me = d.get(E.factionId), Te = re ? "" : E.markerImage;
        return {
          ...E,
          systemId: n.id,
          displayName: re ? "???" : E.name,
          displayDescription: re ? "Unresolved sensor contact. Details are not available." : E.description,
          displayType: re ? "unknown" : E.kind,
          displayStatus: re ? "undiscovered" : E.status,
          factionName: (me == null ? void 0 : me.name) ?? "Unaffiliated",
          factionColor: E.iconColor || (me == null ? void 0 : me.color) || "#58d8ff",
          displayMarkerImage: Te,
          hasCustomMarker: !!Te,
          obscured: re,
          gmOnly: Oe(n, E) === "gm",
          isSelected: E.id === this.selectedObjectId,
          isCurrent: ((_t = r == null ? void 0 : r.currentLocation) == null ? void 0 : _t.objectId) === E.id,
          animatedCelestial: !Te && tt.includes(E.iconStyle),
          hasJournal: !!(!re && E.journalId),
          hasScenes: !!(!re && E.sceneIds.length),
          showImage: !!(!re && E.image),
          canInspectSystem: !!Pe({ ...E, obscured: re })
        };
      }) : [];
      n && this.selectedObjectId && !h.some((E) => E.id === this.selectedObjectId) && (this.selectedObjectId = null);
      const v = h.find((E) => E.id === this.selectedObjectId) ?? null, k = new Set(h.map((E) => E.id)), A = n ? (n.routes ?? []).filter((E) => (!this.playerMode || E.visibility === "players") && k.has(E.fromSystemId) && k.has(E.toSystemId)).map((E) => {
        const re = h.find((Te) => Te.id === E.fromSystemId), me = h.find((Te) => Te.id === E.toSystemId);
        return {
          ...E,
          from: re,
          to: me,
          fromName: (re == null ? void 0 : re.displayName) ?? E.fromSystemId,
          toName: (me == null ? void 0 : me.displayName) ?? E.toSystemId,
          isSelected: E.id === this.selectedRouteId,
          isActive: E.id === this.selectedRouteId,
          gmOnly: E.visibility === "gm"
        };
      }) : [], D = A.find((E) => E.id === this.selectedRouteId) ?? null, O = h.find((E) => E.isCurrent) ?? null, z = v && O && v.id !== O.id ? A.find((E) => E.fromSystemId === O.id && E.toSystemId === v.id || E.toSystemId === O.id && E.fromSystemId === v.id) : null;
      v && (v.canTravel = !!z, v.isDestination = !!(z && !v.isCurrent), v.travelRouteId = (z == null ? void 0 : z.id) ?? ""), A.forEach((E) => {
        E.isActive = E.isSelected || E.id === (z == null ? void 0 : z.id);
      }), n && (r.systems = h, r.routes = A, r.selectedSystem = D ? null : v, r.selectedRoute = D, r.currentSystem = O);
      const B = h.find((E) => E.id === this.planetSystemId) ?? (n ? null : r == null ? void 0 : r.systems.find((E) => E.id === this.planetSystemId)), m = !this.playerMode || (a == null ? void 0 : a.visibility) === "players" ? Pe(B) : null;
      m || (this.planetSystemId = null);
      const g = B && m ? `${B.id}:${m.preset}` : null;
      g !== this._planetStaticViewKey && (this._planetStaticViewKey = g, this.planetStatic = !!(g && Fs(m == null ? void 0 : m.preset)));
      const b = B && m ? this._preparePlanetLocations(B, m.shape) : [], S = B ?? v, w = !!((pe = game.user) != null && pe.isGM && !this.playerMode && n && S), _ = ((S == null ? void 0 : S.sceneIds) ?? []).map((E) => {
        var re, me;
        return (me = (re = game.scenes) == null ? void 0 : re.get) == null ? void 0 : me.call(re, E);
      }).filter((E) => {
        var re, me;
        return E && (((re = game.user) == null ? void 0 : re.isGM) || ((me = E.testUserPermission) == null ? void 0 : me.call(E, game.user, "OBSERVER")));
      }).map((E) => ({ id: E.id, uuid: E.uuid, name: E.name || "Linked Scene" })), q = S != null && S.journalId ? (he = (de = game.journal) == null ? void 0 : de.get) == null ? void 0 : he.call(de, S.journalId) : null, N = q && ((Q = game.user) != null && Q.isGM || (le = q.testUserPermission) != null && le.call(q, game.user, "OBSERVER")) ? { id: q.id, uuid: q.uuid, name: q.name || "Linked Journal" } : null, X = this.creationPanel ? {
        ...this.creationPanel,
        ...this.creationPanel.data,
        kind: this.creationPanel.kind,
        entityKind: (Me = this.creationPanel.data) == null ? void 0 : Me.kind,
        isSystem: this.creationPanel.kind === "system",
        isEntity: this.creationPanel.kind === "entity",
        isRoute: this.creationPanel.kind === "route",
        isFaction: this.creationPanel.kind === "faction",
        isMap: this.creationPanel.kind === "map",
        mapTitle: (Le = this.creationPanel.data) == null ? void 0 : Le.title,
        title: this.creationPanel.kind === "map" ? "Edit Galaxy" : `${this.creationPanel.editId ? "Edit" : "Create"} ${{ system: "System", entity: "Location", route: "Route", faction: "Faction" }[this.creationPanel.kind]}`,
        submitLabel: this.creationPanel.editId ? "Save changes" : "Create",
        systemOptions: (n ? h : (r == null ? void 0 : r.systems) ?? []).map((E) => ({ id: E.id, name: E.displayName || E.name })),
        factionOptions: ((r == null ? void 0 : r.factions) ?? []).map((E) => ({ id: E.id, name: E.name }))
      } : null;
      return {
        ...s,
        map: r,
        systemView: !!(n && !m),
        activeSystem: n,
        selectedObject: v,
        planetView: !!m,
        planetSystem: B,
        planetAppearance: m,
        planetLocations: b,
        hasPlanetLocations: b.length > 0,
        canPlacePlanetLocations: w,
        linkedPlanetScenes: _,
        linkedPlanetJournal: N,
        creationPanel: X,
        factionRegistry: this.factionRegistry,
        appearanceGuideMarkup: X != null && X.isEntity ? M(X.planetShape || "sphere") : "",
        showInspector: !!(X || this.factionRegistry || m || r != null && r.selectedSystem || r != null && r.selectedRoute),
        territories: r ? ni(r.systems, r.factions) : [],
        showTerritories: this.showTerritories,
        showRoutes: this.showRoutes,
        hardContrast: this.hardContrast,
        mapId: this.mapId,
        playerMode: this.playerMode,
        zoomPercent: Math.round(this.zoom * 100),
        panX: this.panX,
        panY: this.panY,
        zoom: this.zoom,
        missingMap: !a
      };
    }
    _onRender(i, s) {
      var r, n;
      (r = this._bountyIntelCallout) == null || r.dispose(), this._bountyIntelCallout = null, this._disposePlanetRenderer(), super._onRender(i, s);
      const a = this.element;
      if (a) {
        if (this._attachPartListeners("main", a, s), this._observeViewport(a), this._mountBountyIntelCallout(a), this.externalFocus && this._pendingFocusZoom !== null) {
          const d = V(o(this.mapId)).systems.find((h) => h.id === this.externalFocus.systemId);
          d && this._centerOnSystem(d, a, this._pendingFocusZoom), this._pendingFocusZoom = null;
        }
        i.planetView ? this._mountPlanetRenderer(a, i.planetAppearance) : this._planetReturnFocus && ((n = a.querySelector("[data-action='inspect-system']")) == null || n.focus(), this._planetReturnFocus = !1);
      }
    }
    _attachPartListeners(i, s, a) {
      var h, v, k, A, D, O, z, B, m, g, b, S, w, _, q, N, X, J, pe, de, he;
      const r = (h = s.matches) != null && h.call(s, ".gmf-map-stage") ? s : (v = s.querySelector) == null ? void 0 : v.call(s, ".gmf-map-stage, .gmf-planet-stage");
      if ((r == null ? void 0 : r.dataset.gmfMapBound) === "true") return;
      r && (r.dataset.gmfMapBound = "true");
      const n = (k = r == null ? void 0 : r.matches) != null && k.call(r, ".gmf-map-stage") ? r : null;
      super._attachPartListeners(i, s, a), We(this, s), this._attachPlanetListeners(s), this._attachCreationPanel(s);
      const d = s.querySelector(".gmf-object-appearance-panel");
      d && (L(d), this._attachAppearancePreview(s)), (A = s.querySelector("[data-action='toggle-territories']")) == null || A.addEventListener("click", () => {
        this.showTerritories = !this.showTerritories, this.render({ force: !0 });
      }), (D = s.querySelector("[data-action='toggle-routes']")) == null || D.addEventListener("click", () => {
        this.showRoutes = !this.showRoutes, this.render({ force: !0 });
      }), (O = s.querySelector("[data-action='edit-current-layer']")) == null || O.addEventListener("click", () => {
        var Q;
        !((Q = game.user) != null && Q.isGM) || this.playerMode || (this.activeSystemId ? this._openEditPanel("system", this.activeSystemId) : this._openCreationPanel("map", V(o(this.mapId)), this.mapId));
      }), (z = s.querySelector("[data-action='toggle-hard-contrast']")) == null || z.addEventListener("click", (Q) => {
        var Me;
        this.hardContrast = !this.hardContrast;
        const le = (Me = s.matches) != null && Me.call(s, ".gmf-galaxy") ? s : s.querySelector(".gmf-galaxy");
        le == null || le.classList.toggle("is-hard-contrast", this.hardContrast), Q.currentTarget.setAttribute("aria-pressed", String(this.hardContrast));
      }), this._applyViewportTransform(s), s.querySelectorAll("[data-system-id]").forEach((Q) => {
        var le, Me;
        Q.addEventListener("click", (Le) => {
          if (Q.dataset.dragged === "true") {
            Q.dataset.dragged = "false";
            return;
          }
          Le.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = globalThis.setTimeout(() => {
            this.activeSystemId ? this.selectedObjectId = Q.dataset.systemId : this.selectedSystemId = Q.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
          }, 180);
        }), Q.addEventListener("dblclick", (Le) => {
          var re;
          Le.preventDefault(), Le.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
          const E = Q.dataset.systemId;
          if (this.selectedRouteId = null, this.creationPanel = null, this.activeSystemId) {
            this.selectedObjectId = E;
            const me = (re = V(o(this.mapId)).systems.find((Te) => Te.id === this.activeSystemId)) == null ? void 0 : re.objects.find((Te) => Te.id === E);
            Pe(me) && (this.planetSystemId = E);
          } else
            this.selectedSystemId = E, this.activeSystemId = E, this.selectedObjectId = null;
          this.render({ force: !0 });
        }), !this.playerMode && ((le = game.user) != null && le.isGM) && ((Me = Q.querySelector("[data-resize-marker]")) == null || Me.addEventListener("pointerdown", (Le) => this._startMarkerResize(Le, Q)), Q.addEventListener("pointerdown", (Le) => this._startSystemDrag(Le, s, Q)));
      }), this._mountBountyIntelCallout(s), s.querySelectorAll("[data-route-id]").forEach((Q) => {
        Q.addEventListener("click", (le) => {
          var Me;
          if (le.stopPropagation(), this.selectedRouteId = Q.dataset.routeId, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, !this.playerMode && ((Me = game.user) != null && Me.isGM)) {
            this._openEditPanel("route", Q.dataset.routeId);
            return;
          }
          this.render({ force: !0 });
        });
      }), n == null || n.addEventListener("wheel", (Q) => this._onWheelZoom(Q, s), { passive: !1 }), n == null || n.addEventListener("pointerdown", (Q) => this._startPan(Q, s)), n == null || n.addEventListener("contextmenu", (Q) => this._openContextMenu(Q, s), { capture: !0 }), s.querySelectorAll("[data-context-action]").forEach((Q) => {
        Q.addEventListener("click", (le) => this._handleContextAction(le, s));
      }), (B = s.querySelector("[data-action='open-journal']")) == null || B.addEventListener("click", () => this._openLinkedJournal()), (m = s.querySelector("[data-action='edit-system']")) == null || m.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._openEditPanel("entity", this.selectedObjectId) : this.selectedSystemId && this._openEditPanel("system", this.selectedSystemId);
      }), (g = s.querySelector("[data-action='open-system']")) == null || g.addEventListener("click", () => {
        this.selectedSystemId && (this.activeSystemId = this.selectedSystemId, this.selectedObjectId = null, this.selectedRouteId = null, this.render({ force: !0 }));
      }), (b = s.querySelector("[data-action='navigate-up']")) == null || b.addEventListener("click", () => {
        if (this.creationPanel = null, this.planetSystemId)
          this._disposePlanetRenderer(), this.planetSystemId = null, this._planetReturnFocus = !0;
        else if (this.activeSystemId)
          this.activeSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null;
        else return;
        this.render({ force: !0 });
      }), (S = s.querySelector("[data-action='reveal-system']")) == null || S.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? U(this.mapId, this.activeSystemId, this.selectedObjectId, "players") : this.selectedSystemId && T(this.mapId, this.selectedSystemId);
      }), (w = s.querySelector("[data-action='hide-system']")) == null || w.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? U(this.mapId, this.activeSystemId, this.selectedObjectId, "gm") : this.selectedSystemId && F(this.mapId, this.selectedSystemId, !0);
      }), (_ = s.querySelector("[data-action='delete-system']")) == null || _.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._confirmDeleteObject(this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), (q = s.querySelector("[data-action='set-current-system']")) == null || q.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? W(this.mapId, this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && ae(this.mapId, this.selectedSystemId);
      }), (N = s.querySelector("[data-action='travel-to-system']")) == null || N.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? H(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, s));
      }), (X = s.querySelector("[data-action='travel-to-object']")) == null || X.addEventListener("click", () => {
        !this.activeSystemId || !this.selectedObjectId || (this.playerMode ? R(this.mapId, this.activeSystemId, this.selectedObjectId) : this._travelToObject(this.activeSystemId, this.selectedObjectId, s));
      }), (J = s.querySelector("[data-action='edit-route']")) == null || J.addEventListener("click", () => {
        this.selectedRouteId && this._openEditPanel("route", this.selectedRouteId);
      }), (pe = s.querySelector("[data-action='reveal-route']")) == null || pe.addEventListener("click", () => {
        this.selectedRouteId && G(this.mapId, this.selectedRouteId, this.activeSystemId ?? "");
      }), (de = s.querySelector("[data-action='hide-route']")) == null || de.addEventListener("click", () => {
        this.selectedRouteId && ne(this.mapId, this.selectedRouteId, !0, this.activeSystemId ?? "");
      }), (he = s.querySelector("[data-action='delete-route']")) == null || he.addEventListener("click", () => {
        this.selectedRouteId && this._confirmDeleteRoute(this.selectedRouteId);
      });
    }
    _applyViewportTransform(i) {
      var r;
      const s = i.querySelector(".gmf-map-viewport");
      if (!s) return;
      const a = i.querySelector(".gmf-map-stage");
      if (a) {
        const n = a.getBoundingClientRect(), d = s.querySelector(".gmf-map-background");
        d && (this.zoom = Math.max(1, this.zoom));
        const h = d != null && d.naturalWidth && (d != null && d.naturalHeight) ? d.naturalWidth / d.naturalHeight : null;
        h ? this._adjustWindowToBackground(a, h) : d || this._adjustWindowToBackground(a, null);
        const v = n.width / Math.max(1, n.height);
        h && h > v ? (this._worldWidth = n.width, this._worldHeight = n.width / h) : h ? (this._worldHeight = n.height, this._worldWidth = n.height * h) : (this._worldWidth = n.width, this._worldHeight = n.height), s.style.width = `${this._worldWidth}px`, s.style.height = `${this._worldHeight}px`;
        const k = this._worldWidth * this.zoom, A = this._worldHeight * this.zoom;
        this.panX = k <= n.width ? (n.width - k) / 2 : oe(this.panX, n.width - k, 0), this.panY = A <= n.height ? (n.height - A) / 2 : oe(this.panY, n.height - A, 0), d && d.dataset.gmfWorldImageBound !== "true" && (d.dataset.gmfWorldImageBound = "true", d.addEventListener("load", () => this._applyViewportTransform(i), { once: !0 }));
      }
      s.style.setProperty("--gmf-pan-x", `${this.panX}px`), s.style.setProperty("--gmf-pan-y", `${this.panY}px`), s.style.setProperty("--gmf-zoom", String(this.zoom)), (r = i.querySelector("[data-zoom-label]")) == null || r.replaceChildren(`${Math.round(this.zoom * 100)}%`);
    }
    _adjustWindowToBackground(i, s) {
      const a = i.closest(".window-app, .application, .app");
      if (!a || !this.setPosition) return;
      const r = a.getBoundingClientRect();
      if (!s) {
        this._baseWindowHeight && Math.abs(r.height - this._baseWindowHeight) > 2 && this.setPosition({ height: Math.min(this._baseWindowHeight, window.innerHeight - 24) }), this._baseWindowHeight = null;
        return;
      }
      this._baseWindowHeight ?? (this._baseWindowHeight = r.height);
      const n = i.getBoundingClientRect(), d = oe(n.width / s, 240, window.innerHeight - 96);
      if (Math.abs(n.height - d) <= 2) return;
      const h = oe(r.height + d - n.height, 320, window.innerHeight - 24);
      this.setPosition({ height: Math.round(h) });
    }
    _observeViewport(i) {
      var a;
      (a = this._viewportResizeObserver) == null || a.disconnect();
      const s = i.querySelector(".gmf-map-stage");
      s && (this._viewportResizeObserver = new ResizeObserver(() => this._applyViewportTransform(i)), this._viewportResizeObserver.observe(s));
    }
    _setZoom(i, s) {
      const a = s.querySelector(".gmf-map-background") ? 1 : Ze;
      this.zoom = oe(i, a, Ke), this._applyViewportTransform(s);
    }
    _mountBountyIntelCallout(i) {
      var r;
      if (this._bountyIntelCallout || i.querySelector(".gmf-intel-callout")) return;
      const s = (r = i.matches) != null && r.call(i, ".gmf-map-stage") ? i : i.querySelector(".gmf-map-stage"), a = i;
      !s || !a.querySelector("[data-intel-layer]") || (this._bountyIntelCallout = fi({
        root: a,
        stage: s,
        resolveItems: (n) => {
          var v;
          const d = V(o(this.mapId)), h = this.activeSystemId ? (v = d.systems.find((k) => k.id === this.activeSystemId)) == null ? void 0 : v.objects.find((k) => k.id === n) : d.systems.find((k) => k.id === n);
          return h ? ai(h) : [];
        },
        onOpen: (n) => ri(n)
      }));
    }
    _attachPlanetListeners(i) {
      var s, a, r, n, d, h;
      (s = i.querySelector("[data-action='inspect-system']")) == null || s.addEventListener("click", () => {
        var k, A;
        const v = o(this.mapId);
        if (!(this.playerMode && (v == null ? void 0 : v.visibility) !== "players")) {
          if (this.activeSystemId) {
            const O = (k = V(v).systems.find((z) => z.id === this.activeSystemId)) == null ? void 0 : k.objects.find((z) => z.id === this.selectedObjectId);
            if (!Pe(O)) return;
            this.planetSystemId = this.selectedObjectId;
          } else {
            this.activeSystemId = this.selectedSystemId;
            const D = V(v);
            this.selectedObjectId = ((A = D.systems.find((O) => O.id === this.activeSystemId)) == null ? void 0 : A.primaryObjectId) ?? null, this.planetSystemId = this.selectedObjectId;
          }
          this.render({ force: !0 });
        }
      }), (a = i.querySelector("[data-action='planet-pause']")) == null || a.addEventListener("click", () => {
        var v;
        return (v = this._planetRenderer) == null ? void 0 : v.setPaused(!this._planetRenderer.paused);
      }), (r = i.querySelector("[data-action='planet-zoom-in']")) == null || r.addEventListener("click", () => {
        var v;
        return (v = this._planetRenderer) == null ? void 0 : v.zoom(-0.25);
      }), (n = i.querySelector("[data-action='planet-zoom-out']")) == null || n.addEventListener("click", () => {
        var v;
        return (v = this._planetRenderer) == null ? void 0 : v.zoom(0.25);
      }), (d = i.querySelector("[data-action='planet-reset']")) == null || d.addEventListener("click", () => {
        var v;
        return (v = this._planetRenderer) == null ? void 0 : v.reset();
      }), (h = i.querySelector("[data-action='planet-static']")) == null || h.addEventListener("click", () => {
        this.planetStatic = !this.planetStatic, this.render({ force: !0 });
      }), this._attachPlanetLocationList(i), this._attachLinkedContentDrop(i);
    }
    _getPlanetObject() {
      var s;
      return ((s = V(o(this.mapId)).systems.find((a) => a.id === this.activeSystemId)) == null ? void 0 : s.objects.find((a) => a.id === this.planetSystemId)) ?? null;
    }
    _preparePlanetLocations(i, s) {
      return ((i == null ? void 0 : i.planetLocations) ?? []).filter((a) => a.shape === s).map((a) => {
        var d, h, v, k, A, D;
        const r = (h = (d = game.scenes) == null ? void 0 : d.get) == null ? void 0 : h.call(d, a.sceneId), n = !!(r && ((v = game.user) != null && v.isGM || (k = r.testUserPermission) != null && k.call(r, game.user, "OBSERVER")));
        return {
          ...a,
          name: r ? n || (A = game.user) != null && A.isGM ? r.name || "Linked Scene" : "Restricted location" : "Missing linked scene",
          accessible: n,
          missing: !r,
          canRemove: !!((D = game.user) != null && D.isGM && !this.playerMode)
        };
      });
    }
    _getPlanetLocationItem(i) {
      var a;
      const s = this._getPlanetObject();
      return this._preparePlanetLocations(s, (a = Pe(s)) == null ? void 0 : a.shape).find((r) => r.id === i) ?? null;
    }
    _attachPlanetLocationList(i) {
      var r;
      const s = this.element ?? i;
      i.querySelectorAll("[data-planet-scene-drag]").forEach((n) => n.addEventListener("dragstart", (d) => {
        d.dataTransfer && (d.dataTransfer.setData("text/plain", JSON.stringify({ type: "Scene", id: n.dataset.planetSceneDrag, uuid: n.dataset.planetSceneUuid })), d.dataTransfer.effectAllowed = "link");
      })), i.querySelectorAll("[data-unlink-planet-scene]").forEach((n) => n.addEventListener("click", async (d) => {
        var A, D, O;
        d.preventDefault(), d.stopPropagation();
        const h = n.dataset.unlinkPlanetScene ?? "", v = this.planetSystemId || this.selectedObjectId;
        if (!h || !this.activeSystemId || !v) return;
        const k = ((O = (D = (A = game.scenes) == null ? void 0 : A.get) == null ? void 0 : D.call(A, h)) == null ? void 0 : O.name) || "Scene";
        await Ce(this.mapId, this.activeSystemId, v, h) && ie(`${k} unlinked from this location.`);
      })), i.querySelectorAll("[data-open-linked-scene]").forEach((n) => n.addEventListener("click", () => {
        var h, v, k;
        const d = (v = (h = game.scenes) == null ? void 0 : h.get) == null ? void 0 : v.call(h, n.dataset.openLinkedScene ?? "");
        d != null && d.view ? d.view() : (k = d == null ? void 0 : d.sheet) == null || k.render(!0);
      })), i.querySelectorAll("[data-open-planet-location]").forEach((n) => n.addEventListener("click", () => this._openPlanetLocation(n.dataset.openPlanetLocation ?? ""))), i.querySelectorAll("[data-remove-planet-location]").forEach((n) => n.addEventListener("click", () => this._removePlanetLocation(n.dataset.removePlanetLocation ?? "", i))), i.querySelectorAll("[data-planet-location-drag]").forEach((n) => {
        n.addEventListener("dragstart", (d) => {
          var v;
          if (!d.dataTransfer) return;
          const h = n.dataset.planetLocationDrag ?? "";
          d.dataTransfer.setData("application/x-gmf-surface-location", h), d.dataTransfer.setData("text/plain", JSON.stringify({ type: "GalaxySurfaceLocation", locationId: h })), d.dataTransfer.effectAllowed = "move", (v = s.querySelector("[data-planet-location-trash]")) == null || v.classList.add("is-armed");
        }), n.addEventListener("dragend", () => {
          var d;
          return (d = s.querySelector("[data-planet-location-trash]")) == null ? void 0 : d.classList.remove("is-armed", "is-dragover");
        });
      });
      const a = s.querySelector("[data-planet-location-trash]");
      (a == null ? void 0 : a.dataset.gmfTrashBound) !== "true" && (a && (a.dataset.gmfTrashBound = "true"), a == null || a.addEventListener("dragover", (n) => {
        var d;
        (d = n.dataTransfer) != null && d.types.includes("application/x-gmf-surface-location") && (n.preventDefault(), n.dataTransfer.dropEffect = "move", a.classList.add("is-dragover"));
      }), a == null || a.addEventListener("dragleave", () => a.classList.remove("is-dragover")), a == null || a.addEventListener("drop", (n) => {
        var h;
        n.preventDefault();
        const d = ((h = n.dataTransfer) == null ? void 0 : h.getData("application/x-gmf-surface-location")) ?? "";
        a.classList.remove("is-armed", "is-dragover"), d && this._removePlanetLocation(d, i);
      })), (r = i.querySelector("[data-clear-planet-locations]")) == null || r.addEventListener("click", () => this._clearPlanetLocations(i));
    }
    _attachLinkedContentDrop(i) {
      var a, r;
      const s = i.querySelector("[data-linked-content-drop]");
      !s || !((a = game.user) != null && a.isGM) || this.playerMode || (s.addEventListener("dragover", (n) => {
        n.preventDefault(), n.dataTransfer && (n.dataTransfer.dropEffect = "link"), s.classList.add("is-document-dragover");
      }), s.addEventListener("dragleave", (n) => {
        s.contains(n.relatedTarget) || s.classList.remove("is-document-dragover");
      }), s.addEventListener("drop", async (n) => {
        var k;
        n.preventDefault(), n.stopPropagation(), s.classList.remove("is-document-dragover");
        const d = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !d) return;
        const h = await rs(n), v = (k = V(o(this.mapId)).systems.find((A) => A.id === this.activeSystemId)) == null ? void 0 : k.objects.find((A) => A.id === d);
        if (!h || !v) {
          ee("Drop a Foundry Scene or Journal here.");
          return;
        }
        if (h.documentName === "Scene") {
          const A = [.../* @__PURE__ */ new Set([...v.sceneIds ?? [], h.id])];
          await l(this.mapId, this.activeSystemId, { ...v, sceneIds: A }), ie(`${h.name || "Scene"} linked to ${v.name}.`);
        } else if (h.documentName === "JournalEntry")
          await l(this.mapId, this.activeSystemId, { ...v, journalId: h.id }), ie(`${h.name || "Journal"} linked to ${v.name}.`);
        else {
          ee("Drop a Foundry Scene or Journal here.");
          return;
        }
      }), (r = i.querySelector("[data-unlink-linked-journal]")) == null || r.addEventListener("click", async (n) => {
        var v;
        n.preventDefault(), n.stopPropagation();
        const d = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !d) return;
        const h = (v = V(o(this.mapId)).systems.find((k) => k.id === this.activeSystemId)) == null ? void 0 : v.objects.find((k) => k.id === d);
        h && await l(this.mapId, this.activeSystemId, { ...h, journalId: "" });
      }));
    }
    _openPlanetLocation(i) {
      var r, n, d;
      const s = this._getPlanetLocationItem(i), a = s ? (n = (r = game.scenes) == null ? void 0 : r.get) == null ? void 0 : n.call(r, s.sceneId) : null;
      if (!s || !a || !s.accessible) {
        ee(s != null && s.missing ? "That location is unavailable." : "You do not have permission to view that scene.");
        return;
      }
      a.view ? a.view() : (d = a.sheet) == null || d.render(!0);
    }
    async _removePlanetLocation(i, s) {
      var r;
      if (!((r = game.user) != null && r.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const a = this._getPlanetLocationItem(i);
      !a || !await we(this.mapId, this.activeSystemId, this.planetSystemId, i) || (this._syncPlanetLocations(s), ie(`${a.name} removed from the surface.`));
    }
    async _clearPlanetLocations(i) {
      var r, n;
      if (!((r = game.user) != null && r.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const s = this._getPlanetObject(), a = this._preparePlanetLocations(s, (n = Pe(s)) == null ? void 0 : n.shape);
      for (const d of a) await we(this.mapId, this.activeSystemId, this.planetSystemId, d.id);
      this._syncPlanetLocations(i), a.length && ie(`Cleared ${a.length} surface location${a.length === 1 ? "" : "s"}.`);
    }
    async _placePlanetLocation(i, s, a) {
      var h;
      if (!((h = game.user) != null && h.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const r = await gi(i);
      if (!r) {
        ee("Drop a Foundry Scene onto the 3D surface.");
        return;
      }
      const n = this._getPlanetObject();
      if (!(n != null && n.sceneIds.includes(r.id))) {
        ee(`Link ${r.name || "this scene"} to the object before placing it on the surface.`);
        return;
      }
      await ce(this.mapId, this.activeSystemId, this.planetSystemId, { ...s, sceneId: r.id }) && (this._syncPlanetLocations(a), ie(`${r.name || "Scene"} placed on the ${s.shape}. Drag it again to move it.`));
    }
    _syncPlanetLocations(i) {
      var d, h, v;
      const s = this.element ?? i, a = this._getPlanetObject(), r = this._preparePlanetLocations(a, (d = Pe(a)) == null ? void 0 : d.shape);
      (h = this._planetRenderer) == null || h.setLocations((a == null ? void 0 : a.planetLocations) ?? []);
      const n = s.querySelector("[data-planet-location-list]");
      n && (n.innerHTML = r.length ? r.map((k) => `
        <div class="gmf-planet-location-row ${k.accessible ? "" : "is-restricted"}" ${k.canRemove ? `draggable="true" data-planet-location-drag="${ye(k.id)}" title="Drag to the trash bin to remove"` : ""}>
          <button type="button" data-open-planet-location="${ye(k.id)}" ${k.accessible ? "" : "disabled"}><i class="fa-solid ${k.accessible ? "fa-location-dot" : "fa-lock"}"></i><span>${ye(k.name)}</span></button>
          ${k.canRemove ? `<button type="button" data-remove-planet-location="${ye(k.id)}" title="Remove location" aria-label="Remove ${ye(k.name)}"><i class="fa-solid fa-trash"></i></button>` : ""}
        </div>`).join("") : '<p class="gmf-planet-locations__empty">No surface locations placed.</p>', this._attachPlanetLocationList(n), (v = s.querySelector("[data-planet-location-removal]")) == null || v.toggleAttribute("hidden", r.length === 0));
    }
    refreshPlanetLocations(i, s) {
      this.activeSystemId !== i || this.planetSystemId !== s || this.element && this._syncPlanetLocations(this.element);
    }
    async focusSystem(i, s = {}) {
      var D;
      const a = V(o(this.mapId));
      if (!a.systems.find((O) => O.id === i)) return !1;
      const n = c(a, {
        playerMode: this.playerMode,
        selectedSystemId: i,
        selectedRouteId: null
      });
      if (!((D = n == null ? void 0 : n.systems) != null && D.some((O) => O.id === i))) return !1;
      const d = String(s.focusId || i).slice(0, 80), h = ["distress", "warning", "objective", "custom"].includes(s.kind) ? s.kind : "custom", v = /^#[0-9a-f]{6}$/i.test(s.color ?? "") ? s.color : h === "distress" ? "#ff5c7a" : "#58d8ff", k = oe(Number(s.duration) || 0, 0, 6e5), A = oe(Number(s.zoom) || 1.45, Ze, Ke);
      return this.externalFocus = {
        id: d,
        systemId: i,
        kind: h,
        color: v,
        label: String(s.label || (h === "distress" ? "Distress signal" : "Signal located")).slice(0, 120)
      }, this.selectedSystemId = i, this.planetSystemId = null, this.selectedRouteId = null, this._pendingFocusZoom = A, this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, await this.render({ force: !0 }), this.bringToFront(), k > 0 && (this._externalFocusTimeout = globalThis.setTimeout(() => {
        var O;
        ((O = this.externalFocus) == null ? void 0 : O.id) === d && this.clearSystemFocus(d);
      }, k)), !0;
    }
    async focusLocation(i, s = "", a = {}) {
      const n = V(o(this.mapId)).systems.find((h) => h.id === i), d = (n == null ? void 0 : n.objects.find((h) => h.id === s)) ?? (n == null ? void 0 : n.objects.find((h) => h.id === n.primaryObjectId));
      return !n || !d || this.playerMode && (n.visibility !== "players" || Oe(n, d) !== "players") ? !1 : (this.activeSystemId = n.id, this.selectedSystemId = n.id, this.selectedObjectId = d.id, this.selectedRouteId = null, this.planetSystemId = a.detail === !0 && Pe(d) ? d.id : null, await this.render({ force: !0 }), this.bringToFront(), !0);
    }
    clearSystemFocus(i = "") {
      return !this.externalFocus || i && this.externalFocus.id !== i ? !1 : (this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, this._pendingFocusZoom = null, this.externalFocus = null, this.rendered && this.render({ force: !0 }), !0);
    }
    _centerOnSystem(i, s, a) {
      const r = s.querySelector(".gmf-map-stage");
      if (!r) return;
      const n = r.getBoundingClientRect();
      this.zoom = a, this.panX = n.width / 2 - Number(i.x) / 100 * this._worldWidth * a, this.panY = n.height / 2 - Number(i.y) / 100 * this._worldHeight * a, this._applyViewportTransform(s);
    }
    _onWheelZoom(i, s) {
      i.preventDefault();
      const a = s.querySelector(".gmf-map-stage");
      if (!a) return;
      const r = a.getBoundingClientRect(), n = this.zoom, d = s.querySelector(".gmf-map-background") ? 1 : Ze, h = oe(n * Math.exp(-i.deltaY * 15e-4), d, Ke), v = i.clientX - r.left, k = i.clientY - r.top, A = (v - this.panX) / n, D = (k - this.panY) / n;
      this.zoom = h, this.panX = v - A * h, this.panY = k - D * h, this._applyViewportTransform(s);
    }
    _startPan(i, s) {
      if (i.button !== 0 || i.target.closest("[data-system-id], [data-route-id], button, input")) return;
      i.preventDefault();
      const a = i.clientX, r = i.clientY, n = this.panX, d = this.panY;
      let h = !1;
      const v = (A) => {
        h = h || Math.abs(A.clientX - a) > 3 || Math.abs(A.clientY - r) > 3, this.panX = n + A.clientX - a, this.panY = d + A.clientY - r, this._applyViewportTransform(s);
      }, k = () => {
        window.removeEventListener("pointermove", v), window.removeEventListener("pointerup", k), h || (this.selectedRouteId = null, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, this.render({ force: !0 }));
      };
      window.addEventListener("pointermove", v), window.addEventListener("pointerup", k, { once: !0 });
    }
    _startSystemDrag(i, s, a) {
      var z;
      if (i.button !== 0) return;
      i.preventDefault(), i.stopPropagation(), (z = a.setPointerCapture) == null || z.call(a, i.pointerId);
      const r = i.clientX, n = i.clientY;
      let d = this._pointerToMapPercent(i, s), h = !1, v = null;
      const k = Array.from(s.querySelectorAll(`[data-route-from="${a.dataset.systemId}"]`)), A = Array.from(s.querySelectorAll(`[data-route-to="${a.dataset.systemId}"]`)), D = (B) => {
        const m = Math.abs(B.clientX - r), g = Math.abs(B.clientY - n);
        !h && m <= 4 && g <= 4 || (h = !0, a.classList.add("is-dragging"), d = this._pointerToMapPercent(B, s), a.dataset.dragged = "true", !v && (v = requestAnimationFrame(() => {
          v = null, a.style.left = `${d.x}%`, a.style.top = `${d.y}%`, this._updateConnectedRoutes(k, A, d.x, d.y);
        })));
      }, O = async () => {
        v && cancelAnimationFrame(v), a.classList.remove("is-dragging"), window.removeEventListener("pointermove", D), window.removeEventListener("pointerup", O), h && (a.style.left = `${d.x}%`, a.style.top = `${d.y}%`, this._updateConnectedRoutes(k, A, d.x, d.y), this.activeSystemId ? await j(this.mapId, this.activeSystemId, a.dataset.systemId, d.x, d.y) : await ve(this.mapId, a.dataset.systemId, d.x, d.y));
      };
      window.addEventListener("pointermove", D), window.addEventListener("pointerup", O, { once: !0 });
    }
    _startMarkerResize(i, s) {
      var D;
      if (i.button !== 0) return;
      i.preventDefault(), i.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
      const a = oe(Number(s.dataset.iconSize) || 28, 18, 56), r = s.getBoundingClientRect(), n = r.left + r.width / 2, d = r.top + r.height / 2, h = Math.hypot(i.clientX - n, i.clientY - d);
      let v = a;
      s.dataset.dragged = "true", s.classList.add("is-resizing"), (D = s.setPointerCapture) == null || D.call(s, i.pointerId);
      const k = (O) => {
        const z = Math.hypot(O.clientX - n, O.clientY - d);
        v = oe(Math.round(a + (z - h) / Math.max(this.zoom, 0.01)), 18, 56), s.dataset.iconSize = String(v), s.style.setProperty("--gmf-system-size", `${v}px`);
      }, A = async () => {
        if (s.classList.remove("is-resizing"), window.removeEventListener("pointermove", k), window.removeEventListener("pointerup", A), window.removeEventListener("pointercancel", A), globalThis.setTimeout(() => {
          s.dataset.dragged = "false";
        }, 0), v !== a)
          if (this.activeSystemId) {
            const O = V(o(this.mapId)).systems.find((B) => B.id === this.activeSystemId), z = O == null ? void 0 : O.objects.find((B) => B.id === s.dataset.systemId);
            z && await l(this.mapId, this.activeSystemId, { ...z, iconSize: v });
          } else
            await f(this.mapId, { id: s.dataset.systemId, iconSize: v });
      };
      window.addEventListener("pointermove", k), window.addEventListener("pointerup", A, { once: !0 }), window.addEventListener("pointercancel", A, { once: !0 });
    }
    _pointerToMapPercent(i, s) {
      const r = s.querySelector(".gmf-map-stage").getBoundingClientRect();
      return {
        x: oe((i.clientX - r.left - this.panX) / this.zoom / this._worldWidth * 100, 0, 100),
        y: oe((i.clientY - r.top - this.panY) / this.zoom / this._worldHeight * 100, 0, 100)
      };
    }
    _updateConnectedRoutes(i, s, a, r) {
      i.forEach((n) => {
        n.setAttribute("x1", a), n.setAttribute("y1", r);
      }), s.forEach((n) => {
        n.setAttribute("x2", a), n.setAttribute("y2", r);
      });
    }
    _openContextMenu(i, s) {
      var m;
      if (!((m = game.user) != null && m.isGM) || this.playerMode || i.target.closest(".gmf-context-menu")) return;
      i.preventDefault(), i.stopPropagation();
      const a = i.target.closest("[data-route-id]"), r = i.target.closest("[data-system-id]"), n = this._pointerToMapPercent(i, s);
      this._contextTarget = a ? { type: "route", id: a.dataset.routeId, position: n } : r ? { type: "system", id: r.dataset.systemId, position: n } : { type: "stage", id: null, position: n };
      const d = s.querySelector("[data-gmf-context-menu]");
      if (!d) return;
      d.querySelectorAll("[data-context-show]").forEach((g) => {
        g.hidden = g.dataset.contextShow !== this._contextTarget.type;
      }), d.hidden = !1;
      const h = d.offsetWidth || 184, v = d.offsetHeight || 260, A = s.querySelector(".gmf-map-stage").getBoundingClientRect(), D = i.clientX - A.left, O = i.clientY - A.top, z = Math.max(4, A.width - h - 4), B = Math.max(4, A.height - v - 4);
      d.style.left = `${oe(D, 4, z)}px`, d.style.top = `${oe(O, 4, B)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(s), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu(i = null) {
      const s = i ?? this.element ?? null, a = s == null ? void 0 : s.querySelector("[data-gmf-context-menu]");
      a && (a.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(i, s) {
      i.preventDefault(), i.stopPropagation();
      const a = i.currentTarget.dataset.contextAction, r = this._contextTarget;
      this._hideContextMenu(s), r && (a === "add-system" ? this._openCreationPanel("system", { x: r.position.x, y: r.position.y }) : a === "add-entity" ? this.activeSystemId && this._openCreationPanel("entity", { x: r.position.x, y: r.position.y }) : a === "manage-factions" ? (this.creationPanel = null, this.factionRegistry = !0, this.render({ force: !0 })) : a === "add-faction" ? this._openCreationPanel("faction") : a === "edit-map-details" ? this._openCreationPanel("map", V(o(this.mapId)), this.mapId) : a === "export-map" ? $(this.mapId) : a === "edit-system" ? this._openEditPanel("system", r.id) : a === "edit-entity" ? this.activeSystemId && this._openEditPanel("entity", r.id) : a === "add-route-from-marker" ? this._openCreationPanel("route", { fromSystemId: r.id }) : a === "reveal-system" ? await T(this.mapId, r.id) : a === "hide-system" ? await F(this.mapId, r.id, !0) : a === "delete-system" ? await this._confirmDeleteSystem(r.id) : a === "reveal-entity" ? this.activeSystemId && await U(this.mapId, this.activeSystemId, r.id, "players") : a === "hide-entity" ? this.activeSystemId && await U(this.mapId, this.activeSystemId, r.id, "gm") : a === "delete-entity" ? this.activeSystemId && await this._confirmDeleteObject(this.activeSystemId, r.id) : a === "edit-route" ? this._openEditPanel("route", r.id) : a === "reveal-route" ? await G(this.mapId, r.id, this.activeSystemId ?? "") : a === "hide-route" ? await ne(this.mapId, r.id, !0, this.activeSystemId ?? "") : a === "delete-route" && await this._confirmDeleteRoute(r.id));
    }
    async _confirmDeleteSystem(i) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, Ae) && await P(this.mapId, i);
    }
    async _confirmDeleteObject(i, s) {
      await Dialog.confirm({ title: "Delete Location", content: "<p>Delete this location and its linked content?</p>" }) && (await te(this.mapId, i, s), this.selectedObjectId = null);
    }
    _openCreationPanel(i, s = {}, a = null) {
      var v, k, A, D;
      if (!((v = game.user) != null && v.isGM) || this.playerMode) return;
      const r = V(o(this.mapId)), n = this.activeSystemId ? ((k = r.systems.find((O) => O.id === this.activeSystemId)) == null ? void 0 : k.objects) ?? [] : r.systems;
      if (i === "route" && n.length < 2) {
        ee(this.activeSystemId ? "Create at least two locations before adding a route." : "Create at least two systems before adding a route.");
        return;
      }
      const d = s.fromSystemId || ((A = n[0]) == null ? void 0 : A.id) || "", h = i === "map" ? { title: "Galaxy Map", subtitle: "", description: "", backgroundImage: "", visibility: "players", travelApprovalMode: "unanimous" } : i === "system" ? { name: "New System", status: "known", visibility: "gm", description: "", markerImage: "", backgroundImage: "" } : i === "entity" ? {
        name: "New Location",
        kind: "planet",
        status: "known",
        visibility: "inherit",
        factionId: "",
        description: "",
        notes: "",
        iconStyle: "planet",
        iconColor: "#58d8ff",
        markerImage: "",
        planetPreset: "ice",
        planetShape: "sphere",
        planetFinish: "smooth",
        planetColor: "#58d8ff",
        planetTexture: "",
        image: ""
      } : i === "route" ? { type: "safe", visibility: "gm", travelTime: "", fuelCost: 0, notes: "" } : { name: "New Faction", color: "#58d8ff", visibility: "gm", description: "" };
      this.creationPanel = {
        kind: i,
        editId: a,
        data: {
          ...h,
          ...s,
          x: Number.isFinite(Number(s.x)) ? Number(s.x) : 50,
          y: Number.isFinite(Number(s.y)) ? Number(s.y) : 50,
          fromSystemId: d,
          toSystemId: s.toSystemId || ((D = n.find((O) => O.id !== d)) == null ? void 0 : D.id) || ""
        }
      }, this.factionRegistry = !1, this.selectedSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null, this.render({ force: !0 });
    }
    _openEditPanel(i, s) {
      var n, d;
      const a = V(o(this.mapId)), r = i === "system" ? a.systems.find((h) => h.id === s) : i === "entity" ? (n = a.systems.find((h) => h.id === this.activeSystemId)) == null ? void 0 : n.objects.find((h) => h.id === s) : i === "route" ? this.activeSystemId ? (d = a.systems.find((h) => h.id === this.activeSystemId)) == null ? void 0 : d.routes.find((h) => h.id === s) : a.routes.find((h) => h.id === s) : a.factions.find((h) => h.id === s);
      r && this._openCreationPanel(i, r, s);
    }
    openEditor(i, s = {}) {
      var a;
      return !((a = game.user) != null && a.isGM) || this.playerMode ? !1 : (this._disposePlanetRenderer(), this.planetSystemId = null, i === "entity" ? (this.activeSystemId = s.systemId || this.activeSystemId, this.selectedSystemId = this.activeSystemId) : i === "route" ? this.activeSystemId = s.systemId || null : ["map", "system", "faction"].includes(i) && (this.activeSystemId = null), i === "map" ? this._openCreationPanel("map", V(o(this.mapId)), this.mapId) : s.id ? this._openEditPanel(i, s.id) : this._openCreationPanel(i, s.defaults || {}), !0);
    }
    _attachCreationPanel(i) {
      var a, r, n;
      (a = i.querySelector("[data-action='cancel-panel-create']")) == null || a.addEventListener("click", () => {
        this.creationPanel = null, this.render({ force: !0 });
      }), (r = i.querySelector("[data-action='close-faction-registry']")) == null || r.addEventListener("click", () => {
        this.factionRegistry = !1, this.render({ force: !0 });
      }), (n = i.querySelector("[data-action='add-inline-faction']")) == null || n.addEventListener("click", () => this._openCreationPanel("faction")), i.querySelectorAll("[data-edit-inline-faction]").forEach((d) => {
        d.addEventListener("click", () => this._openEditPanel("faction", d.dataset.editInlineFaction || ""));
      }), i.querySelectorAll("[data-delete-inline-faction]").forEach((d) => {
        d.addEventListener("click", async () => {
          await Dialog.confirm({ title: "Delete Faction", content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>" }, Ae) && (await I(this.mapId, d.dataset.deleteInlineFaction), this.factionRegistry = !0, this.render({ force: !0 }));
        });
      });
      const s = i.querySelector("[data-panel-create-form]");
      s && (ns(s), s.addEventListener("submit", async (d) => {
        d.preventDefault();
        const h = s.dataset.createKind || "", v = Object.fromEntries(new FormData(s).entries());
        i.querySelectorAll('[form="gmf-panel-editor-form"][name]').forEach((B) => {
          B instanceof HTMLInputElement && ["checkbox", "radio"].includes(B.type) && !B.checked || (v[B.name] = B.value);
        }), h === "entity" && (v.markerImage = v.useCustomMarker === "true" ? v.markerImage ?? "" : "", delete v.useCustomMarker);
        const k = Number(v.x), A = Number(v.y), D = this.creationPanel, O = (D == null ? void 0 : D.data) ?? {};
        D != null && D.editId && (v.id = D.editId), this.creationPanel = null;
        let z = null;
        if (h === "map") z = await x(this.mapId, { ...O, ...v });
        else if (h === "system") z = await f(this.mapId, { ...O, ...v, x: k, y: A });
        else if (h === "entity" && this.activeSystemId) z = await l(this.mapId, this.activeSystemId, { ...O, ...v, x: k, y: A });
        else if (h === "route") {
          if (!v.fromSystemId || !v.toSystemId || v.fromSystemId === v.toSystemId) {
            ee(`Choose two different ${this.activeSystemId ? "locations" : "systems"} for the route.`), this._openCreationPanel("route", { ...O, ...v }, (D == null ? void 0 : D.editId) ?? null);
            return;
          }
          z = await y(this.mapId, { ...O, ...v }, this.activeSystemId ?? "");
        } else h === "faction" && (z = await u(this.mapId, { ...O, ...v }), this.factionRegistry = !0);
        z != null && z.id && (h === "system" && (this.selectedSystemId = z.id), h === "entity" && (this.selectedObjectId = z.id), h === "route" && (this.selectedRouteId = z.id)), this.render({ force: !0 });
      }), globalThis.setTimeout(() => {
        var d;
        return (d = s.querySelector("[autofocus]")) == null ? void 0 : d.focus();
      }, 0));
    }
    _attachAppearancePreview(i) {
      const s = i.querySelector("[data-panel-marker-preview-system]"), a = i.querySelector("[data-panel-marker-preview-icon]"), r = i.querySelector("[data-panel-marker-preview-label]");
      if (!s) return;
      let n = 0;
      const d = ["name", "kind", "status", "iconStyle", "iconColor", "markerImage"].map((v) => i.querySelector(`[name="${v}"]`)), h = async () => {
        const v = (B, m) => {
          var g;
          return ((g = i.querySelector(`[name="${B}"]`)) == null ? void 0 : g.value) || m;
        }, k = v("kind", "planet"), A = v("status", "known"), D = v("iconStyle", k), O = v("markerImage", "").trim();
        s.className = `gmf-system gmf-system--${k} gmf-icon--${D} gmf-status--${A}${O ? " has-custom-marker" : ""}`, s.style.setProperty("--gmf-faction-color", v("iconColor", "#58d8ff")), s.style.setProperty("--gmf-system-size", "42px"), r && (r.textContent = v("name", "New Location"));
        const z = ++n;
        if (a && O) {
          const B = document.createElement("img");
          B.className = "gmf-custom-marker__image", B.src = O, B.alt = "", B.draggable = !1, a.replaceChildren(B);
        } else if (a && tt.includes(D)) {
          const B = await globalThis.renderTemplate(`${t}/celestial-icon.hbs`, { system: { iconStyle: D } });
          z === n && (a.innerHTML = B);
        } else a && (a.innerHTML = '<span class="gmf-system__core"></span>');
      };
      d.forEach((v) => {
        v == null || v.addEventListener("input", h), v == null || v.addEventListener("change", h);
      }), h();
    }
    async _confirmDeleteRoute(i) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, Ae) && await K(this.mapId, i, this.activeSystemId ?? "");
    }
    async _travelToSystem(i, s) {
      const a = V(o(this.mapId)), r = a.systems.find((h) => h.id === a.currentSystemId), n = a.systems.find((h) => h.id === i);
      if (!n) return;
      if (!r) {
        await ae(this.mapId, n.id), ie(`Current location set to ${n.name}.`);
        return;
      }
      if (r.id === n.id) {
        ie(`${n.name} is already the current location.`);
        return;
      }
      if (!Y(a, r.id, n.id)) {
        ee(`No direct route from ${r.name} to ${n.name}.`);
        return;
      }
      ue(this.mapId, r.id, n.id), await this._animateShipTravel(r, n, s), await ae(this.mapId, n.id), ie(`Arrived at ${n.name}.`);
    }
    async _travelToObject(i, s, a) {
      const r = V(o(this.mapId)), n = r.systems.find((k) => k.id === i), d = n == null ? void 0 : n.objects.find((k) => k.id === r.currentLocation.objectId), h = n == null ? void 0 : n.objects.find((k) => k.id === s);
      if (!n || !h) return;
      if (!d || r.currentLocation.systemId !== n.id) {
        await W(this.mapId, n.id, h.id), ie(`Current location set to ${h.name}.`);
        return;
      }
      if (d.id === h.id) {
        ie(`${h.name} is already the current location.`);
        return;
      }
      if (!Y({ routes: n.routes }, d.id, h.id)) {
        ee(`No direct route from ${d.name} to ${h.name}.`);
        return;
      }
      fe(this.mapId, n.id, d.id, h.id), await this._animateShipTravel(d, h, a), await W(this.mapId, n.id, h.id), ie(`Arrived at ${h.name}.`);
    }
    _animateShipTravel(i, s, a) {
      return hi(i, s, a);
    }
    _openLinkedJournal() {
      var a, r;
      const i = this._getSelectedRawSystem();
      if (!(i != null && i.journalId)) return;
      const s = (a = game.journal) == null ? void 0 : a.get(i.journalId);
      if (!s) {
        ee(`Journal "${i.journalId}" was not found.`);
        return;
      }
      (r = s.sheet) == null || r.render(!0);
    }
    _getSelectedRawSystem() {
      var s;
      const i = V(o(this.mapId));
      return this.activeSystemId ? ((s = i.systems.find((a) => a.id === this.activeSystemId)) == null ? void 0 : s.objects.find((a) => a.id === this.selectedObjectId)) ?? null : i.systems.find((a) => a.id === this.selectedSystemId) ?? null;
    }
    async close(i = {}) {
      var s, a;
      return (s = this._bountyIntelCallout) == null || s.dispose(), this._bountyIntelCallout = null, this._disposePlanetRenderer(), this._hideContextMenu(), this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, (a = this._viewportResizeObserver) == null || a.disconnect(), this._viewportResizeObserver = null, De(this), super.close(i);
    }
    _disposePlanetRenderer() {
      var i, s;
      this._planetGeneration++, (i = this._planetLocationCallout) == null || i.dispose(), this._planetLocationCallout = null, (s = this._planetRenderer) == null || s.dispose(), this._planetRenderer = null;
    }
    _setPlanetFallback(i, s) {
      const a = i.querySelector(".gmf-planet-fallback");
      a && (a.style.backgroundImage = s.texture ? `url(${JSON.stringify(s.texture)})` : "none", a.style.backgroundColor = s.color);
      const r = i.querySelector("[data-planet-canvas]");
      r && (r.dataset.planetShape = s.shape, r.dataset.planetPreset = s.preset);
      const n = i.querySelector(".gmf-planet-stage");
      n == null || n.style.setProperty("--gmf-planet-color", s.color);
    }
    async _mountPlanetRenderer(i, s) {
      var v, k, A;
      const a = i.querySelector("[data-planet-canvas]");
      if (!a || !s) return;
      this._setPlanetFallback(i, s);
      const r = this._planetGeneration, n = i.querySelector("[data-planet-status]"), d = i.querySelector("[data-action='planet-static']"), h = i.querySelectorAll("[data-planet-control]");
      if (d) {
        const D = this.planetStatic ? "Enable 3D" : "Static view";
        d.setAttribute("title", D), d.setAttribute("aria-label", D), d.setAttribute("aria-pressed", String(this.planetStatic));
        const O = d.querySelector("i");
        O && (O.className = this.planetStatic ? "fa-solid fa-cube" : "fa-solid fa-image");
      }
      if (this.planetStatic) {
        n && (n.textContent = "Static preview. Turn on 3D to rotate and zoom."), h.forEach((D) => D.disabled = !0);
        return;
      }
      try {
        const { createPlanetRenderer: D } = await import("./chunks/planet-renderer-Bd4l56Qq.js");
        if (r !== this._planetGeneration || !a.isConnected) return;
        h.forEach((O) => O.disabled = !1), this._planetRenderer = D(a, {
          texture: s.texture,
          color: s.color,
          appearancePreset: s.preset,
          shape: s.shape,
          finish: s.finish,
          detailStrength: s.detailStrength,
          locations: ((v = this._getPlanetObject()) == null ? void 0 : v.planetLocations) ?? [],
          canPlaceLocations: !!((k = game.user) != null && k.isGM && !this.playerMode),
          onLocationDrop: (O, z) => void this._placePlanetLocation(O, z, i),
          onInvalidLocationDrop: () => ee("Drop the scene directly onto the visible 3D surface."),
          onMarkerHover: (O) => {
            var B;
            const z = this._getPlanetLocationItem(O.id);
            z && ((B = this._planetLocationCallout) == null || B.show(z));
          },
          onMarkerLeave: () => {
            var O;
            return (O = this._planetLocationCallout) == null ? void 0 : O.scheduleHide();
          },
          onMarkerPosition: (O) => {
            var z;
            return (z = this._planetLocationCallout) == null ? void 0 : z.setAnchor(O);
          },
          onMarkerOpen: (O) => this._openPlanetLocation(O.id),
          onMarkerContextMenu: (A = game.user) != null && A.isGM && !this.playerMode ? (O) => void this._removePlanetLocation(O.id, i) : null,
          isVisible: () => !this.minimized,
          onStatus: (O) => {
            n && (n.textContent = O);
          },
          onPaused: (O) => {
            const z = i.querySelector("[data-action='planet-pause']");
            if (z) {
              const B = O ? "Resume rotation" : "Pause rotation";
              z.setAttribute("title", B), z.setAttribute("aria-label", B), z.setAttribute("aria-pressed", String(O));
              const m = z.querySelector("i");
              m && (m.className = O ? "fa-solid fa-play" : "fa-solid fa-pause");
            }
          },
          onStopped: () => {
            h.forEach((O) => O.disabled = !0), n && (n.textContent = "Static preview. Reopen this view to turn 3D back on.");
          }
        }), this._planetLocationCallout = pi({ host: a });
      } catch {
        h.forEach((D) => D.disabled = !0), n && (n.textContent = "3D could not be loaded. Static preview shown.");
      }
    }
  }, Z(Ie, "DEFAULT_OPTIONS", {
    id: "galaxy-map-view",
    classes: ["galaxy-map", "galaxy-map-framework", "gmf-map-window"],
    window: {
      title: "Galaxy Map",
      icon: "fa-solid fa-meteor",
      resizable: !0
    },
    resizable: !0,
    position: {
      width: 1120,
      height: 760
    }
  }), Z(Ie, "PARTS", {
    main: {
      template: `${t}/galaxy-map.hbs`
    }
  }), Ie;
}
function vi(e) {
  var l;
  const { templateRoot: t, getVisibleMaps: o, openMap: c, clearChooser: f } = e;
  return l = class extends mt() {
    async _prepareContext(u) {
      return { ...await super._prepareContext(u), maps: o() };
    }
    _attachPartListeners(u, x, I) {
      super._attachPartListeners(u, x, I), We(this, x), x.querySelectorAll("[data-player-open-map]").forEach((M) => {
        M.addEventListener("click", () => {
          c(M.dataset.playerOpenMap, { playerMode: !0 }), this.close();
        });
      });
    }
    async close(u = {}) {
      return f(this), super.close(u);
    }
  }, Z(l, "DEFAULT_OPTIONS", {
    id: "galaxy-map-player-chooser",
    classes: ["galaxy-map", "galaxy-map-framework", "gmf-manager-window", "gmf-map-chooser-window"],
    window: { title: "Choose Galaxy Map", icon: "fa-solid fa-satellite", resizable: !0 },
    position: { width: 480, height: 420 }
  }), Z(l, "PARTS", { main: { template: `${t}/player-map-chooser.hbs` } }), l;
}
const Se = "galaxy-map", nt = "maps", Ue = "schemaV1Backup", at = "surfaceLocationRecoveryV2", ge = `module.${Se}`, xe = `modules/${Se}/templates`;
function Ii(e) {
  return e.visibility === "players";
}
function bi(e, t) {
  return t && e.status === "undiscovered";
}
function wi(e, t) {
  return t === "planet" ? { station: "station", anomaly: "diamond", ruins: "diamond", unknown: "diamond" }[e] ?? t : t;
}
function Mi(e, { playerMode: t = !1, selectedSystemId: o = null, selectedRouteId: c = null } = {}) {
  var U, ne;
  const f = V(e), l = t ? f.systems.filter(Ii) : f.systems, y = new Set(l.map((P) => P.id)), u = t ? f.factions.filter((P) => P.visibility === "players") : f.factions, x = new Map(u.map((P) => [P.id, P])), I = l.map((P) => {
    const te = x.get(P.factionId), K = bi(P, t), ae = K ? "unknown" : P.type, W = K ? "diamond" : wi(ae, P.iconStyle), H = K ? "" : P.markerImage;
    return {
      ...P,
      image: P.image,
      sceneIds: [...P.sceneIds],
      journalId: P.journalId,
      planetPreset: P.planetPreset,
      planetShape: P.planetShape,
      planetTexture: P.planetTexture,
      planetColor: P.planetColor,
      iconStyle: W,
      displayMarkerImage: H,
      hasCustomMarker: !!H,
      displayName: K ? "???" : P.name,
      displayDescription: K ? "Unresolved sensor contact. Details are not available." : P.description,
      displayType: ae,
      displayStatus: K ? "undiscovered" : P.status,
      factionName: (te == null ? void 0 : te.name) ?? "Unaffiliated",
      factionColor: P.iconColor || (te == null ? void 0 : te.color) || "#58d8ff",
      obscured: K,
      isCurrent: P.id === f.currentSystemId,
      isSelected: P.id === o,
      gmOnly: P.visibility === "gm",
      animatedCelestial: !H && tt.includes(W),
      hasAlert: ["danger", "locked"].includes(K ? "undiscovered" : P.status),
      alertLabel: P.status === "danger" ? "Hazard advisory" : P.status === "locked" ? "Restricted access" : "",
      hasJournal: !!(!K && P.journalId),
      hasScenes: !!(!K && P.sceneIds.length),
      showImage: !!(!K && P.image),
      canInspectSystem: !!Pe({ ...P, obscured: K })
    };
  }), M = f.routes.filter((P) => !t || P.visibility === "players").filter((P) => y.has(P.fromSystemId) && y.has(P.toSystemId)).map((P) => {
    const te = I.find((ae) => ae.id === P.fromSystemId), K = I.find((ae) => ae.id === P.toSystemId);
    return {
      ...P,
      from: te,
      to: K,
      fromName: (te == null ? void 0 : te.displayName) ?? P.fromSystemId,
      toName: (K == null ? void 0 : K.displayName) ?? P.toSystemId,
      isSelected: P.id === c,
      connectsCurrent: P.fromSystemId === f.currentSystemId || P.toSystemId === f.currentSystemId,
      gmOnly: P.visibility === "gm"
    };
  }), L = M.find((P) => P.id === c) ?? null, T = L ? null : I.find((P) => P.id === o) ?? null;
  T && (T.isSelected = !0);
  const G = I.find((P) => P.id === f.currentSystemId) ?? I[0] ?? null, F = T && G && T.id !== G.id ? M.find((P) => P.fromSystemId === G.id && P.toSystemId === T.id || P.toSystemId === G.id && P.fromSystemId === T.id) : null;
  return T && (T.canTravel = !!F, T.travelRouteId = (F == null ? void 0 : F.id) ?? "", T.isCurrent = T.id === (G == null ? void 0 : G.id), T.isDestination = !!(F && !T.isCurrent)), M.forEach((P) => {
    P.isActive = P.isSelected || P.id === (F == null ? void 0 : F.id);
  }), {
    ...f,
    systems: I,
    routes: M,
    factions: u,
    selectedSystem: T,
    selectedRoute: L,
    currentSystem: G,
    selectedType: L ? "route" : T ? "system" : null,
    playerMode: t,
    isGM: ((U = game.user) == null ? void 0 : U.isGM) ?? !1,
    canEdit: ((ne = game.user) == null ? void 0 : ne.isGM) && !t
  };
}
function Li(e) {
  var f;
  if (!e) return null;
  const t = V(e), o = new Map(t.systems.map((l) => [l.id, l])), c = new Map(t.factions.map((l) => [l.id, l]));
  return {
    ...t,
    travelApprovalModeLabel: ((f = ot.find((l) => l.value === t.travelApprovalMode)) == null ? void 0 : f.label) ?? "Unanimous agreement",
    systems: t.systems.map((l) => {
      var y;
      return {
        ...l,
        factionName: ((y = c.get(l.factionId)) == null ? void 0 : y.name) ?? "Unaffiliated"
      };
    }),
    routes: [
      ...t.routes.map((l) => {
        var y, u;
        return {
          ...l,
          systemId: "",
          scopeLabel: "Galaxy route",
          fromName: ((y = o.get(l.fromSystemId)) == null ? void 0 : y.name) ?? l.fromSystemId,
          toName: ((u = o.get(l.toSystemId)) == null ? void 0 : u.name) ?? l.toSystemId
        };
      }),
      ...t.systems.flatMap((l) => {
        const y = new Map(l.objects.map((u) => [u.id, u]));
        return l.routes.map((u) => {
          var x, I;
          return {
            ...u,
            systemId: l.id,
            scopeLabel: `Inside ${l.name}`,
            fromName: ((x = y.get(u.fromSystemId)) == null ? void 0 : x.name) ?? u.fromSystemId,
            toName: ((I = y.get(u.toSystemId)) == null ? void 0 : I.name) ?? u.toSystemId
          };
        });
      })
    ]
  };
}
function Ti(e) {
  ns(e), e.querySelectorAll("[data-use-custom-marker]").forEach((G) => {
    const F = (G.closest("form") ?? e).querySelector("[data-custom-marker-field]"), U = (F == null ? void 0 : F.querySelector('[name="markerImage"]')) ?? null, ne = (F == null ? void 0 : F.querySelectorAll("button")) ?? [], P = () => {
      const te = G.checked;
      F == null || F.classList.toggle("is-disabled", !te), U && (U.disabled = !te), ne.forEach((K) => {
        K.disabled = !te;
      }), !te && (U != null && U.value) && (U.value = "", U.dispatchEvent(new Event("input", { bubbles: !0 })), U.dispatchEvent(new Event("change", { bubbles: !0 })));
    };
    G.addEventListener("change", P), P();
  });
  const t = e.querySelector("[data-texture-upload-fields]"), o = e.querySelector('[name="planetTexture"]'), c = e.querySelector('[name="planetPreset"]'), f = e.querySelector('[name="planetShape"]'), l = e.querySelector('[name="planetFinish"]'), y = e.querySelector('[name="planetColor"]'), u = e.querySelector("[data-texture-guide]"), x = e.querySelector("[data-texture-guide-section]"), I = e.querySelectorAll("[data-texture-guide-preview]"), M = () => {
    if (!c || !f) return;
    const G = Ht(c.value, f.value);
    c.replaceChildren(...zt(f.value).map((F) => {
      const U = document.createElement("option");
      return U.value = F.value, U.textContent = F.label, U;
    })), c.value = G;
  }, L = () => {
    const G = (c == null ? void 0 : c.value) === "custom", F = (c == null ? void 0 : c.value) === "none";
    return t && (t.hidden = !G), x && (x.hidden = !G), o && (o.required = G), f && (f.disabled = F), l && (l.disabled = F), y && (y.disabled = (c == null ? void 0 : c.value) !== "color"), G;
  }, T = () => {
    var F;
    if (!u) return;
    const G = (F = o == null ? void 0 : o.value) == null ? void 0 : F.trim();
    G ? u.dataset.hasTexture = "true" : delete u.dataset.hasTexture, I.forEach((U) => {
      U.onerror = G ? () => {
        U.hidden = !0;
      } : null, U.hidden = !G, G ? U.src = G : U.removeAttribute("src");
    });
  };
  c == null || c.addEventListener("change", () => {
    !L() && (o != null && o.value) && (o.value = "", o.dispatchEvent(new Event("change", { bubbles: !0 })));
  }), o == null || o.addEventListener("change", T), f == null || f.addEventListener("change", () => {
    u && (u.dataset.shape = f.value), M(), L();
  }), M(), L(), T();
}
function _i(e) {
  const { notifyError: t, notifyInfo: o, requireGM: c, refreshOpenApps: f, closeOpenMap: l, getOpenMapViews: y } = e, u = (m) => foundry.utils.deepClone(m), x = (m) => game.socket.emit(ge, { action: "refresh", mapId: m });
  function I() {
    return u(game.settings.get(Se, nt) ?? {});
  }
  async function M(m) {
    return c("save galaxy map data") && await game.settings.set(Se, nt, m ?? {}), m;
  }
  function L(m) {
    const g = I();
    return g[m] ? u(g[m]) : null;
  }
  async function T(m, g, { refresh: b = !0 } = {}) {
    return m[g] = V(m[g]), await M(m), b && f(g), x(g), m[g];
  }
  async function G(m = {}) {
    if (!c("create galaxy maps")) return null;
    const g = I(), b = V(m);
    return g[b.id] = b, await M(g), f(b.id), u(b);
  }
  async function F(m, g = {}) {
    if (!c("update galaxy maps")) return null;
    const b = I();
    if (!b[m])
      return t(`Map "${m}" was not found.`), null;
    const S = V({ ...g, id: m });
    return b[m] = S, await M(b), f(m), u(S);
  }
  async function U(m, g = {}) {
    const b = L(m);
    return !c("update galaxy map metadata") || !b ? (b || t(`Map "${m}" was not found.`), null) : F(m, {
      ...b,
      title: g.title,
      subtitle: g.subtitle,
      description: g.description,
      backgroundImage: g.backgroundImage,
      visibility: g.visibility,
      travelApprovalMode: g.travelApprovalMode
    });
  }
  async function ne(m) {
    if (!c("delete galaxy maps")) return !1;
    const g = I();
    return g[m] ? (delete g[m], await M(g), l(m), f(), !0) : !1;
  }
  async function P(m) {
    if (!c("duplicate galaxy maps")) return null;
    const g = L(m);
    if (!g)
      return t(`Map "${m}" was not found.`), null;
    const b = V({ ...g, id: _e("map"), title: `${g.title} Copy` }), S = I();
    return S[b.id] = b, await M(S), f(b.id), u(b);
  }
  async function te(m, g = {}) {
    var de;
    if (!c("save star systems")) return null;
    const b = I();
    if (!b[m])
      return t(`Map "${m}" was not found.`), null;
    const S = V(b[m]), w = S.systems.find((he) => he.id === g.id), _ = g.objects ?? (w == null ? void 0 : w.objects) ?? [], q = (w == null ? void 0 : w.primaryObjectId) || ((de = _[0]) == null ? void 0 : de.id), N = ["image", "sceneIds", "planetLocations", "journalId", "planetPreset", "planetShape", "planetFinish", "planetTexture", "planetColor"], X = _.map((he) => he.id !== q ? he : kt({
      ...he,
      ...Object.fromEntries(N.filter((Q) => g[Q] !== void 0).map((Q) => [Q, g[Q]]))
    })), J = Zt({ ...w, ...g, objects: X }), pe = S.systems.findIndex((he) => he.id === J.id);
    return pe >= 0 ? S.systems[pe] = J : S.systems.push(J), b[m] = S, await T(b, m), u(J);
  }
  async function K(m, g, b = {}) {
    if (!c("save locations")) return null;
    const S = I(), w = S[m] ? V(S[m]) : null, _ = w == null ? void 0 : w.systems.find((X) => X.id === g);
    if (!w || !_) return null;
    const q = kt(b), N = _.objects.findIndex((X) => X.id === q.id);
    return N >= 0 ? _.objects[N] = q : _.objects.push(q), _.primaryObjectId || (_.primaryObjectId = q.id), S[m] = w, await T(S, m), u(q);
  }
  const ae = (m, g, b) => {
    var S;
    for (const w of y(m)) (S = w.refreshPlanetLocations) == null || S.call(w, g, b);
  };
  async function W(m, g, b, S = {}) {
    var pe;
    if (!c("place surface locations")) return null;
    const w = I(), _ = w[m] ? V(w[m]) : null, q = (pe = _ == null ? void 0 : _.systems.find((de) => de.id === g)) == null ? void 0 : pe.objects.find((de) => de.id === b);
    if (!_ || !q) return null;
    const N = String(S.sceneId || "");
    if (!q.sceneIds.includes(N))
      return t("Only scenes linked to this object can be placed on its surface."), null;
    const X = Wt(S), J = q.planetLocations.findIndex((de) => de.sceneId === N && de.shape === X.shape);
    return J >= 0 && (X.id = q.planetLocations[J].id), J >= 0 ? q.planetLocations[J] = X : q.planetLocations.push(X), w[m] = V(_), await M(w), ae(m, g, b), game.socket.emit(ge, { action: "planet-locations", mapId: m, systemId: g, objectId: b }), u(X);
  }
  async function H(m, g, b, S) {
    var X;
    if (!c("remove surface locations")) return !1;
    const w = I(), _ = w[m] ? V(w[m]) : null, q = (X = _ == null ? void 0 : _.systems.find((J) => J.id === g)) == null ? void 0 : X.objects.find((J) => J.id === b);
    if (!_ || !q) return !1;
    const N = q.planetLocations.length;
    return q.planetLocations = q.planetLocations.filter((J) => J.id !== S), q.planetLocations.length === N ? !1 : (w[m] = V(_), await M(w), ae(m, g, b), game.socket.emit(ge, { action: "planet-locations", mapId: m, systemId: g, objectId: b }), !0);
  }
  async function R(m, g, b, S) {
    var _, q;
    if (!c("unlink scenes from locations")) return !1;
    const w = (q = (_ = L(m)) == null ? void 0 : _.systems.find((N) => N.id === g)) == null ? void 0 : q.objects.find((N) => N.id === b);
    return w != null && w.sceneIds.includes(S) ? !!await K(m, g, { ...w, sceneIds: w.sceneIds.filter((N) => N !== S) }) : !1;
  }
  async function $(m, g, b) {
    var q;
    if (!c("delete locations")) return !1;
    const S = I(), w = S[m] ? V(S[m]) : null, _ = w == null ? void 0 : w.systems.find((N) => N.id === g);
    return !w || !_ ? !1 : (_.objects = _.objects.filter((N) => N.id !== b), _.primaryObjectId === b && (_.primaryObjectId = ((q = _.objects[0]) == null ? void 0 : q.id) ?? ""), w.currentLocation.objectId === b && (w.currentLocation.objectId = _.primaryObjectId), S[m] = w, await T(S, m), !0);
  }
  async function Y(m, g, b) {
    var X;
    if (!c("move locations")) return null;
    const S = I(), w = S[m] ? V(S[m]) : null, _ = w == null ? void 0 : w.systems.find((J) => J.objects.some((pe) => pe.id === g)), q = w == null ? void 0 : w.systems.find((J) => J.id === b), N = _ == null ? void 0 : _.objects.find((J) => J.id === g);
    return !w || !_ || !q || !N ? null : (_.objects = _.objects.filter((J) => J.id !== g), q.objects.push(N), _.primaryObjectId === g && (_.primaryObjectId = ((X = _.objects[0]) == null ? void 0 : X.id) ?? ""), q.primaryObjectId || (q.primaryObjectId = g), w.currentLocation.objectId === g && (w.currentLocation.systemId = q.id), S[m] = w, await T(S, m), u(N));
  }
  async function ue(m, g, b) {
    if (!c("set the arrival object")) return null;
    const S = I(), w = S[m] ? V(S[m]) : null, _ = w == null ? void 0 : w.systems.find((q) => q.id === g);
    return !w || !(_ != null && _.objects.some((q) => q.id === b)) ? null : (_.primaryObjectId = b, w.currentLocation.systemId === g && !w.currentLocation.objectId && (w.currentLocation.objectId = b), S[m] = w, await T(S, m), u(_));
  }
  async function fe(m, g, b, S, w) {
    var X;
    const _ = I(), q = _[m] ? V(_[m]) : null, N = (X = q == null ? void 0 : q.systems.find((J) => J.id === g)) == null ? void 0 : X.objects.find((J) => J.id === b);
    return !q || !N ? null : (N.x = oe(be(S, N.x), 0, 100), N.y = oe(be(w, N.y), 0, 100), _[m] = q, await T(_, m), u(N));
  }
  async function ie(m, g, b, S) {
    var N;
    if (!c("change object visibility")) return null;
    const w = I(), _ = w[m] ? V(w[m]) : null, q = (N = _ == null ? void 0 : _.systems.find((X) => X.id === g)) == null ? void 0 : N.objects.find((X) => X.id === b);
    return !_ || !q ? null : (q.visibility = Ut.includes(S) ? S : "inherit", q.visibility === "players" && ["undiscovered", "locked"].includes(q.status) && (q.status = "known"), w[m] = _, await T(w, m), u(q));
  }
  async function ee(m, g) {
    var w;
    if (!c("delete star systems")) return !1;
    const b = I(), S = b[m];
    return S ? (S.systems = S.systems.filter((_) => _.id !== g), S.routes = S.routes.filter((_) => _.fromSystemId !== g && _.toSystemId !== g), S.currentSystemId === g && (S.currentSystemId = ((w = S.systems[0]) == null ? void 0 : w.id) ?? ""), await T(b, m), !0) : !1;
  }
  async function ve(m, g) {
    if (!c("set current location")) return null;
    const b = I(), S = b[m] ? V(b[m]) : null, w = S == null ? void 0 : S.systems.find((_) => _.id === g);
    return !S || !w ? (t(`System "${g}" was not found.`), null) : (S.currentSystemId = g, b[m] = S, await T(b, m), u(w));
  }
  async function j(m, g, b) {
    if (!c("set current location")) return null;
    const S = I(), w = S[m] ? V(S[m]) : null, _ = w == null ? void 0 : w.systems.find((N) => N.id === g), q = _ == null ? void 0 : _.objects.find((N) => N.id === b);
    return !w || !_ || !q ? null : (w.currentSystemId = g, w.currentLocation = { systemId: g, objectId: b }, S[m] = w, await T(S, m), u(q));
  }
  async function ce(m, g = {}, b = "") {
    var X;
    if (!c("save routes")) return null;
    const S = I(), w = S[m], _ = b ? (X = w == null ? void 0 : w.systems) == null ? void 0 : X.find((J) => J.id === b) : w;
    if (!w || !_)
      return t(b ? `System "${b}" was not found.` : `Map "${m}" was not found.`), null;
    Array.isArray(_.routes) || (_.routes = []);
    const q = dt(g);
    if (!q.fromSystemId || !q.toSystemId || q.fromSystemId === q.toSystemId)
      return t("Routes require two different systems."), null;
    const N = _.routes.findIndex((J) => J.id === q.id);
    return N >= 0 ? _.routes[N] = q : _.routes.push(q), await T(S, m), u(q);
  }
  async function we(m, g, b = "") {
    var q;
    if (!c("delete routes")) return !1;
    const S = I(), w = S[m], _ = b ? (q = w == null ? void 0 : w.systems) == null ? void 0 : q.find((N) => N.id === b) : w;
    return _ ? (_.routes = (_.routes ?? []).filter((N) => N.id !== g), await T(S, m), !0) : !1;
  }
  async function Ce(m, g = {}) {
    if (!c("save factions")) return null;
    const b = I(), S = b[m];
    if (!S)
      return t(`Map "${m}" was not found.`), null;
    const w = Kt(g), _ = S.factions.findIndex((q) => q.id === w.id);
    return _ >= 0 ? S.factions[_] = w : S.factions.push(w), await T(b, m), u(w);
  }
  async function De(m, g) {
    if (!c("delete factions")) return !1;
    const b = I(), S = b[m];
    if (!S) return !1;
    S.factions = S.factions.filter((w) => w.id !== g);
    for (const w of S.systems) {
      w.factionId === g && (w.factionId = "");
      for (const _ of w.objects ?? []) _.factionId === g && (_.factionId = "");
    }
    return await T(b, m), !0;
  }
  async function Ie(m, g, b, S, w = "") {
    var pe, de, he, Q;
    if (!c(`${S ? "hide" : "reveal"} ${{ faction: "factions", system: "star systems", route: "routes" }[g]}`)) return null;
    const q = I(), N = q[m], X = w ? (pe = N == null ? void 0 : N.systems) == null ? void 0 : pe.find((le) => le.id === w) : N, J = g === "faction" ? (de = N == null ? void 0 : N.factions) == null ? void 0 : de.find((le) => le.id === b) : g === "system" ? (he = N == null ? void 0 : N.systems) == null ? void 0 : he.find((le) => le.id === b) : (Q = X == null ? void 0 : X.routes) == null ? void 0 : Q.find((le) => le.id === b);
    return !N || !J ? (t(`${g[0].toUpperCase()}${g.slice(1)} "${b}" was not found.`), null) : (J.visibility = S ? "gm" : "players", g === "system" && !S && ["undiscovered", "locked"].includes(J.status) && (J.status = "known"), await T(q, m), u(J));
  }
  async function p(m, g, b = !0) {
    const S = await Ie(m, "faction", g, b);
    return S && o(`${S.name} ${b ? "hidden from" : "visible to"} players.`), S;
  }
  async function C(m, g, { notify: b = !0 } = {}) {
    const S = await Ie(m, "system", g, !1);
    return S ? (b && n(m, S.id), o(`${S.name} revealed to players.`), S) : null;
  }
  async function i(m, g, b = !0) {
    const S = await Ie(m, "system", g, b);
    return S && o(`${S.name} ${b ? "hidden from" : "visible to"} players.`), S;
  }
  async function s(m, g, b = "") {
    const S = await Ie(m, "route", g, !1, b);
    return S && o("Route revealed to players."), S;
  }
  async function a(m, g, b = !0, S = "") {
    const w = await Ie(m, "route", g, b, S);
    return w && o(`Route ${b ? "hidden from" : "visible to"} players.`), w;
  }
  async function r(m, g, b, S) {
    var N;
    if (!c("move star systems")) return null;
    const w = I(), _ = w[m], q = (N = _ == null ? void 0 : _.systems) == null ? void 0 : N.find((X) => X.id === g);
    return q ? (q.x = oe(be(b, q.x), 0, 100), q.y = oe(be(S, q.y), 0, 100), await T(w, m, { refresh: !1 }), u(q)) : (t(`System "${g}" was not found.`), null);
  }
  function n(m, g) {
    var S, w;
    if (!c("notify players about discoveries")) return;
    const b = (w = (S = L(m)) == null ? void 0 : S.systems) == null ? void 0 : w.find((_) => _.id === g);
    if (!b) {
      t(`System "${g}" was not found.`);
      return;
    }
    game.socket.emit(ge, { action: "notify", mapId: m, systemId: g, message: `New System Discovered: ${b.name}` }), o(`Discovery notification sent: ${b.name}.`);
  }
  async function d(m, { replace: g = !1 } = {}) {
    if (!c("import galaxy maps")) return null;
    const b = I();
    let S = V(m);
    return b[S.id] && !g && (S = V({ ...S, id: _e("map"), title: `${S.title} Import` })), b[S.id] = S, await M(b), f(S.id), o(`Imported ${S.title}.`), u(S);
  }
  function h(m) {
    const g = L(m);
    if (!g) {
      t(`Map "${m}" was not found.`);
      return;
    }
    si(`${ti(g.title)}.json`, V(g));
  }
  const v = () => Object.values(I()).map(V), k = (m, g) => u(V(L(m)).systems.find((b) => b.id === String(g)) ?? null);
  function A(m, g) {
    const b = V(L(m));
    for (const S of b.systems) {
      const w = S.objects.find((_) => _.id === String(g));
      if (w) return { systemId: S.id, object: u(w) };
    }
    return null;
  }
  const D = (m, g) => {
    const b = V(L(m)).systems.find((S) => S.id === String(g));
    return [...new Set((b == null ? void 0 : b.objects.flatMap((S) => S.sceneIds)) ?? [])];
  }, O = (m, g) => {
    var b;
    return [...((b = A(m, g)) == null ? void 0 : b.object.sceneIds) ?? []];
  };
  function z(m) {
    return v().flatMap((g) => g.systems.flatMap((b) => b.objects.filter((S) => S.sceneIds.includes(String(m))).map((S) => ({ mapId: g.id, mapTitle: g.title, systemId: b.id, systemName: b.name, object: u(S) }))));
  }
  function B(m) {
    return v().flatMap((g) => g.systems.filter((b) => b.objects.some((S) => S.sceneIds.includes(String(m)))).map((b) => ({ mapId: g.id, mapTitle: g.title, system: u(b) })));
  }
  return {
    getMapStore: I,
    saveMapStore: M,
    getRawMap: L,
    createMap: G,
    updateMap: F,
    updateMapMetadata: U,
    deleteMap: ne,
    duplicateMap: P,
    upsertSystem: te,
    upsertObject: K,
    savePlanetLocation: W,
    removePlanetLocation: H,
    unlinkPlanetScene: R,
    deleteObject: $,
    moveObject: Y,
    setPrimaryObject: ue,
    saveObjectPosition: fe,
    setObjectVisibility: ie,
    deleteSystem: ee,
    setCurrentSystem: ve,
    setCurrentObject: j,
    upsertRoute: ce,
    deleteRoute: we,
    upsertFaction: Ce,
    deleteFaction: De,
    hideFactionFromPlayers: p,
    saveSystemPosition: r,
    revealSystemToPlayers: C,
    hideSystemFromPlayers: i,
    revealRouteToPlayers: s,
    hideRouteFromPlayers: a,
    notifySystemDiscovered: n,
    importMapData: d,
    exportMap: h,
    getMaps: v,
    getSystem: k,
    getObject: A,
    getSceneIdsForSystem: D,
    getSceneIdsForObject: O,
    getObjectsForScene: z,
    getSystemsForScene: B,
    updateOpenPlanetLocations: ae
  };
}
function xi(e) {
  const {
    getRawMap: t,
    setCurrentSystem: o,
    setCurrentObject: c,
    getOpenMapViews: f,
    getAppHtml: l,
    notifyInfo: y,
    notifyError: u,
    getActiveUsers: x,
    getPrimaryGM: I,
    isPrimaryGM: M
  } = e, L = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Set(), G = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map();
  function U(p, C, i) {
    return p.routes.find((s) => s.fromSystemId === C && s.toSystemId === i || s.toSystemId === C && s.fromSystemId === i) ?? null;
  }
  function ne(p, C) {
    const i = t(p);
    if (!i)
      return u(`Map "${p}" was not found.`), null;
    const s = V(i), a = s.systems.find((v) => v.id === s.currentSystemId), r = s.systems.find((v) => v.id === C);
    if (!r)
      return u(`System "${C}" was not found.`), null;
    if (!a)
      return u("This map does not have a current location yet. Ask the GM to set one first."), null;
    if (a.id === r.id)
      return y(`${r.name} is already the current location.`), null;
    if (s.visibility !== "players" || a.visibility !== "players" || r.visibility !== "players")
      return u("That travel destination is not visible to players."), null;
    const n = U(s, a.id, r.id);
    if (!n || n.visibility !== "players")
      return u(`No player-visible direct route from ${a.name} to ${r.name}.`), null;
    const d = I();
    if (!d)
      return u("A GM must be online to approve player travel."), null;
    const h = Je(x(), game.user.id, d, s.travelApprovalMode);
    return {
      action: "travel-request",
      requestId: _e("travel"),
      mapId: p,
      mapTitle: s.title,
      fromSystemId: a.id,
      fromName: a.name,
      toSystemId: r.id,
      toName: r.name,
      routeId: n.id,
      routeType: n.type,
      travelTime: n.travelTime,
      fuelCost: n.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      ...h
    };
  }
  function P(p, C) {
    const i = ne(p, C);
    return i ? (game.socket.emit(ge, i), y(`Travel request sent: ${i.fromName} to ${i.toName}.`), i) : null;
  }
  function te(p, C, i) {
    const s = t(p);
    if (!s)
      return u(`Map "${p}" was not found.`), null;
    const a = V(s), r = a.systems.find((A) => A.id === C), n = r == null ? void 0 : r.objects.find((A) => A.id === a.currentLocation.objectId), d = r == null ? void 0 : r.objects.find((A) => A.id === i);
    if (!r || a.currentLocation.systemId !== r.id || !n)
      return u("The current location is not inside this system."), null;
    if (!d)
      return u(`Destination "${i}" was not found.`), null;
    if (n.id === d.id)
      return y(`${d.name} is already the current location.`), null;
    if (a.visibility !== "players" || r.visibility !== "players" || Oe(r, n) !== "players" || Oe(r, d) !== "players")
      return u("That travel destination is not visible to players."), null;
    const h = U({ routes: r.routes }, n.id, d.id);
    if (!h || h.visibility !== "players")
      return u(`No player-visible direct route from ${n.name} to ${d.name}.`), null;
    const v = I();
    if (!v)
      return u("A GM must be online to approve player travel."), null;
    const k = Je(x(), game.user.id, v, a.travelApprovalMode);
    return {
      action: "travel-request",
      travelScope: "object",
      requestId: _e("travel"),
      mapId: p,
      mapTitle: a.title,
      systemId: r.id,
      fromObjectId: n.id,
      fromName: n.name,
      toObjectId: d.id,
      toName: d.name,
      routeId: h.id,
      routeType: h.type,
      travelTime: h.travelTime,
      fuelCost: h.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      ...k
    };
  }
  function K(p, C, i) {
    const s = te(p, C, i);
    return s ? (game.socket.emit(ge, s), y(`Travel request sent: ${s.fromName} to ${s.toName}.`), s) : null;
  }
  function ae(p, C) {
    var n, d;
    if (!C) return;
    F.set(p, C);
    const i = (n = G.get(p)) == null ? void 0 : n.root;
    if (!i) return;
    const s = i.querySelector("[data-travel-progress-count]"), a = i.querySelector("[data-travel-progress-pending]"), r = i.querySelector("[data-travel-progress-bar]");
    s && (s.textContent = `${C.acceptedCount} of ${C.requiredApprovals} approvals`), a && (a.textContent = (d = C.pendingNames) != null && d.length ? `Waiting for: ${C.pendingNames.join(", ")}` : "All votes received"), r && (r.style.width = `${Math.min(100, C.acceptedCount / Math.max(1, C.requiredApprovals) * 100)}%`);
  }
  function W(p) {
    var n, d, h, v;
    if (!(p != null && p.requestId) || p.requesterId === ((n = game.user) == null ? void 0 : n.id) || !((h = p.voterIds) != null && h.includes((d = game.user) == null ? void 0 : d.id)) || T.has(p.requestId)) return;
    T.add(p.requestId);
    let C = !1, i = !1, s = null;
    const a = (k) => {
      if (C) return;
      C = !0;
      const A = {
        action: "travel-vote",
        requestId: p.requestId,
        mapId: p.mapId,
        userId: game.user.id,
        userName: game.user.name,
        accepted: k
      };
      game.socket.emit(ge, A), we(A);
    }, r = ((v = ot.find((k) => k.value === p.approvalMode)) == null ? void 0 : v.label) ?? "Unanimous agreement";
    s = new Dialog({
      title: "Travel Request",
      content: `<section class="gmf-travel-request">
        <p><strong>${ye(p.requesterName)}</strong> wants to travel on <strong>${ye(p.mapTitle)}</strong>.</p>
        <p>${ye(p.fromName)} &rarr; ${ye(p.toName)}</p>
        <p class="gmf-travel-request__meta">${ye(p.routeType)} route / ${ye(p.travelTime || "Unknown time")} / Fuel ${ye(p.fuelCost ?? 0)}</p>
        <p class="gmf-travel-request__mode"><i class="fa-solid fa-users"></i> ${ye(r)}</p>
        <div class="gmf-travel-progress" data-travel-progress aria-live="polite">
          <div class="gmf-travel-progress__bar"><span data-travel-progress-bar></span></div>
          <strong data-travel-progress-count>Waiting for vote status…</strong><span data-travel-progress-pending></span>
        </div></section>`,
      render: (k) => {
        const A = is(k), D = G.get(p.requestId);
        D && (D.root = A), ae(p.requestId, F.get(p.requestId));
      },
      buttons: {
        accept: { icon: '<i class="fa-solid fa-check"></i>', label: "Accept", callback: () => a(!0) },
        decline: { icon: '<i class="fa-solid fa-xmark"></i>', label: "Decline", callback: () => a(!1) }
      },
      default: "accept",
      close: () => {
        G.delete(p.requestId), i || a(!1);
      }
    }, { classes: ["galaxy-map", "gmf-crud-dialog"], width: 420, height: Math.max(320, Math.min(440, window.innerHeight - 80)) }), G.set(p.requestId, { root: null, resolve: () => {
      i = !0, C = !0, s == null || s.close();
    } }), s.render(!0);
  }
  const H = (p) => {
    var C;
    return !!(p != null && p.coordinatorId && p.coordinatorId === ((C = I()) == null ? void 0 : C.id));
  };
  function R(p) {
    const C = Et(p);
    return {
      action: "travel-progress",
      requestId: p.requestId,
      mapId: p.mapId,
      requesterId: p.requesterId,
      approvalMode: p.approvalMode,
      acceptedCount: C.acceptedCount,
      declinedCount: C.declinedCount,
      requiredApprovals: C.required,
      participantCount: p.participantCount,
      pendingNames: C.pendingIds.map((i) => {
        var s;
        return ((s = p.voterNames) == null ? void 0 : s[i]) || "Navigator";
      }),
      coordinatorId: game.user.id
    };
  }
  function $(p) {
    const C = R(p);
    return ae(p.requestId, C), game.socket.emit(ge, C), C;
  }
  function Y(p) {
    var i, s, a;
    if (!(p != null && p.requestId) || !H(p)) return;
    const C = F.get(p.requestId);
    if (ae(p.requestId, p), p.requesterId === ((i = game.user) == null ? void 0 : i.id) && (!C || C.acceptedCount !== p.acceptedCount || C.declinedCount !== p.declinedCount)) {
      const r = (s = p.pendingNames) != null && s.length ? ` Waiting for ${p.pendingNames.join(", ")}.` : "";
      (a = ui.notifications) == null || a.info(`Travel vote: ${p.acceptedCount}/${p.requiredApprovals} approvals.${r}`);
    }
  }
  function ue(p) {
    if (!M() || !(p != null && p.requestId) || L.has(p.requestId)) return null;
    const C = t(p.mapId);
    if (!C) return null;
    const i = V(C), s = x().find((B) => B.id === p.requesterId && !B.isGM), a = p.travelScope === "object", r = a ? i.systems.find((B) => B.id === p.systemId) : null, n = a ? r == null ? void 0 : r.objects.find((B) => B.id === i.currentLocation.objectId) : i.systems.find((B) => B.id === i.currentSystemId), d = a ? r == null ? void 0 : r.objects.find((B) => B.id === p.toObjectId) : i.systems.find((B) => B.id === p.toSystemId), h = n && d ? U(a ? { routes: (r == null ? void 0 : r.routes) ?? [] } : i, n.id, d.id) : null, v = a && (!r || i.currentLocation.systemId !== r.id || r.visibility !== "players" || Oe(r, n) !== "players" || Oe(r, d) !== "players"), k = !a && ((n == null ? void 0 : n.visibility) !== "players" || (d == null ? void 0 : d.visibility) !== "players");
    if (!s || i.visibility !== "players" || !n || !d || n.id === d.id || v || k || !h || h.visibility !== "players") return null;
    const A = I(), D = Je(x(), p.requesterId, A, i.travelApprovalMode), O = globalThis.setTimeout(() => {
      const B = L.get(p.requestId);
      B && ce(B, { reason: "Travel request timed out." });
    }, zs), z = {
      action: "travel-ballot",
      requestId: String(p.requestId).slice(0, 80),
      mapId: i.id,
      mapTitle: i.title,
      travelScope: a ? "object" : "system",
      systemId: a ? r.id : "",
      fromSystemId: a ? r.id : n.id,
      fromObjectId: a ? n.id : "",
      fromName: n.name,
      toSystemId: a ? r.id : d.id,
      toObjectId: a ? d.id : "",
      toName: d.name,
      routeId: h.id,
      routeType: h.type,
      travelTime: h.travelTime,
      fuelCost: h.fuelCost,
      requesterId: s.id,
      requesterName: s.name,
      coordinatorId: game.user.id,
      ...D,
      accepted: /* @__PURE__ */ new Set(),
      declined: /* @__PURE__ */ new Set(),
      timeoutId: O
    };
    return L.set(p.requestId, z), $(z), z;
  }
  function fe(p) {
    const C = V(t(p.mapId)), i = p.travelScope === "object", s = i ? C.systems.find((n) => n.id === p.systemId) : null, a = i ? s == null ? void 0 : s.objects.find((n) => n.id === p.fromObjectId) : C.systems.find((n) => n.id === p.fromSystemId), r = i ? s == null ? void 0 : s.objects.find((n) => n.id === p.toObjectId) : C.systems.find((n) => n.id === p.toSystemId);
    !a || !r || f(p.mapId).forEach((n) => {
      var h;
      const d = l(n);
      if (d) {
        if (i) {
          if (n.activeSystemId !== s.id) return;
          n.selectedObjectId = r.id;
        } else n.selectedSystemId = r.id;
        n.selectedRouteId = null, (h = n._animateShipTravel) == null || h.call(n, a, r, d);
      }
    });
  }
  const ie = (p, C, i) => {
    var s;
    return game.socket.emit(
      ge,
      { action: "travel-animation", mapId: p, fromSystemId: C, toSystemId: i, coordinatorId: (s = game.user) == null ? void 0 : s.id }
    );
  }, ee = (p, C, i, s) => {
    var a;
    return game.socket.emit(
      ge,
      { action: "travel-animation", travelScope: "object", mapId: p, systemId: C, fromObjectId: i, toObjectId: s, coordinatorId: (a = game.user) == null ? void 0 : a.id }
    );
  };
  function ve(p) {
    var C;
    L.delete(p.requestId), p.timeoutId && globalThis.clearTimeout(p.timeoutId), T.delete(p.requestId), (C = G.get(p.requestId)) == null || C.resolve(), G.delete(p.requestId), F.delete(p.requestId);
  }
  async function j(p) {
    ve(p);
    const C = {
      action: "travel-approved",
      requestId: p.requestId,
      mapId: p.mapId,
      travelScope: p.travelScope,
      systemId: p.systemId,
      fromSystemId: p.fromSystemId,
      toSystemId: p.toSystemId,
      fromObjectId: p.fromObjectId,
      toObjectId: p.toObjectId,
      fromName: p.fromName,
      toName: p.toName,
      coordinatorId: game.user.id
    };
    game.socket.emit(ge, C), fe(C), y(`Travel approved: ${p.fromName} to ${p.toName}.`), globalThis.setTimeout(() => {
      p.travelScope === "object" ? c(p.mapId, p.systemId, p.toObjectId) : o(p.mapId, p.toSystemId);
    }, Yt);
  }
  function ce(p, { voterName: C = "", reason: i = "" } = {}) {
    ve(p);
    const s = i || `${C || "A participant"} declined the request.`, a = {
      action: "travel-declined",
      requestId: p.requestId,
      mapId: p.mapId,
      fromName: p.fromName,
      toName: p.toName,
      voterName: C,
      reason: s,
      coordinatorId: game.user.id
    };
    game.socket.emit(ge, a), y(`Travel cancelled: ${s}`);
  }
  function we(p) {
    if (!M() || !(p != null && p.requestId)) return;
    const C = L.get(p.requestId);
    if (!C || !C.voterIds.includes(p.userId) || C.accepted.has(p.userId) || C.declined.has(p.userId)) return;
    p.accepted ? C.accepted.add(p.userId) : C.declined.add(p.userId);
    const i = Et(C);
    $(C), i.outcome === "approved" ? j(C) : i.outcome === "declined" && ce(C, {
      voterName: p.userName,
      reason: C.approvalMode === "unanimous" ? `${p.userName || "A participant"} declined the unanimous request.` : "The remaining votes cannot reach a majority."
    });
  }
  function Ce(p) {
    var C;
    p.requestId && T.delete(p.requestId), (C = G.get(p.requestId)) == null || C.resolve(), G.delete(p.requestId), F.delete(p.requestId);
  }
  function De(p) {
    var C, i;
    !H(p) || p.coordinatorId === ((C = game.user) == null ? void 0 : C.id) || (Ce(p), fe(p), (i = ui.notifications) == null || i.info(`Travel approved: ${p.fromName} to ${p.toName}.`));
  }
  function Ie(p) {
    var C, i;
    !H(p) || p.coordinatorId === ((C = game.user) == null ? void 0 : C.id) || (Ce(p), (i = ui.notifications) == null || i.warn(`Travel cancelled: ${p.reason || `${p.voterName || "A participant"} declined.`}`));
  }
  return {
    getTravelRoute: U,
    requestTravelToSystem: P,
    requestTravelToObject: K,
    promptForTravelRequest: W,
    isPrimaryGMMessage: H,
    handleTravelProgress: Y,
    trackTravelRequest: ue,
    animateTravelOnOpenMaps: fe,
    broadcastTravelAnimation: ie,
    broadcastObjectTravelAnimation: ee,
    handleTravelVote: we,
    handleTravelApproved: De,
    handleTravelDeclined: Ie
  };
}
function Ei(e) {
  return `
    <div class="gmf-texture-guide" data-texture-guide data-shape="${ye(e)}">
      <figure data-guide-shape="sphere">
        <div class="gmf-uv-map gmf-uv-map--sphere" aria-hidden="true">
          <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
          <b class="gmf-uv-guide-grid"></b>
          <span class="gmf-uv-pole gmf-uv-pole--north">North pole · 15%</span>
          <span class="gmf-uv-equator">Equator · 50%</span>
          <span class="gmf-uv-pole gmf-uv-pole--south">South pole · 15%</span>
          <i class="gmf-uv-seam">wrap seam</i>
        </div>
        <figcaption><strong>2048×1024 · 2:1</strong> Left and right join. Keep important details out of the pale polar bands, where the image pinches to a point.</figcaption>
      </figure>
      <figure data-guide-shape="asteroid">
        <div class="gmf-uv-map gmf-uv-map--asteroid" aria-hidden="true">
          <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
          <b class="gmf-uv-guide-grid"></b>
          <span class="gmf-uv-pole gmf-uv-pole--north">Distorted pole · 15%</span>
          <span class="gmf-uv-equator">Best detail near equator · 50%</span>
          <span class="gmf-uv-pole gmf-uv-pole--south">Distorted pole · 15%</span>
          <i class="gmf-uv-seam">wrap seam</i>
        </div>
        <figcaption><strong>2048×1024 · 2:1</strong> Uses the full 8×4 grid. There are no required circles or fixed crater positions. Left and right join; place recognizable features near the equator and expect organic distortion.</figcaption>
      </figure>
      <figure data-guide-shape="donut">
        <div class="gmf-uv-map gmf-uv-map--donut" aria-hidden="true">
          <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
          <b class="gmf-uv-guide-grid"></b>
          <span class="gmf-uv-donut-ring">Around ring →</span>
          <span class="gmf-uv-donut-tube">Around tube ↓</span>
          <span class="gmf-uv-donut-landmark is-outer-top">Outer bend · 0%</span>
          <span class="gmf-uv-donut-landmark is-side-a">Side A · 25%</span>
          <span class="gmf-uv-donut-landmark is-inner">Inner bend · 50%</span>
          <span class="gmf-uv-donut-landmark is-side-b">Side B · 75%</span>
          <span class="gmf-uv-donut-landmark is-outer-bottom">Outer bend · 100%</span>
        </div>
        <figcaption><strong>2048×1024 · 2:1</strong> Top and bottom meet on the outer bend. The center line becomes the inner bend; 25% and 75% become the two sides. Left/right join as the texture travels around the ring, so all four edges must be seamless.</figcaption>
      </figure>
      <figure data-guide-shape="cube">
        <div class="gmf-uv-map gmf-uv-map--cube" aria-hidden="true">
          <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
          <b class="gmf-uv-guide-grid"></b>
          <span class="is-top">Top</span><span class="is-left">Left</span><span class="is-front">Front</span>
          <span class="is-right">Right</span><span class="is-back">Back</span><span class="is-bottom">Bottom</span>
        </div>
        <figcaption><strong>2048×1536 · 4:3</strong> The full 4×3 grid contains twelve 512px squares. Draw only in the six labeled squares; the six dim squares are unused.</figcaption>
      </figure>
      <figure data-guide-shape="cylinder">
        <div class="gmf-uv-map gmf-uv-map--cylinder" aria-hidden="true">
          <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
          <b class="gmf-uv-guide-grid"></b>
          <span class="gmf-uv-cap gmf-uv-cap--top">Top<br>25% × 25%</span>
          <span class="gmf-uv-cylinder-side">Side band · 100% × 50%<br>left/right join</span>
          <span class="gmf-uv-cap gmf-uv-cap--bottom">Bottom<br>25% × 25%</span>
          <i class="gmf-uv-row-label is-top">25%</i><i class="gmf-uv-row-label is-middle">50%</i><i class="gmf-uv-row-label is-bottom">25%</i>
        </div>
        <figcaption><strong>2048×2048 · 1:1</strong> The middle 50% is the side. Each cap is a 512px circle.</figcaption>
      </figure>
      <figure data-guide-shape="crystal">
        <div class="gmf-uv-map gmf-uv-map--crystal" aria-hidden="true">
          <img class="gmf-uv-texture-preview" data-texture-guide-preview alt="" draggable="false" hidden />
          <b class="gmf-uv-guide-grid"></b>
          ${Array.from({ length: 4 }, (t, o) => `<span class="is-face-${o + 1}">Side ${o + 1}<br>upper</span>`).join("")}
          ${Array.from({ length: 4 }, (t, o) => `<span class="is-face-${o + 5}">Side ${o + 1}<br>lower</span>`).join("")}
          <i class="gmf-uv-grid-label is-columns">4 columns · 512px each</i>
        </div>
        <figcaption><strong>2048×1024 · 2:1</strong> Divide the image into four 512×512 columns. Each column is one continuous crystal side: its upper triangle sits directly above its matching lower triangle.</figcaption>
      </figure>
    </div>
  `;
}
let Ee = null;
const Re = /* @__PURE__ */ new Map();
let se = null, Ne = null;
function Rt(e) {
  return foundry.utils.deepClone(e);
}
function $e(e) {
  var t;
  (t = ui.notifications) == null || t.error(`[Galaxy Map] ${e}`);
}
function Fe(e) {
  var t;
  (t = ui.notifications) == null || t.info(`[Galaxy Map] ${e}`);
}
function ft(e = "change galaxy maps") {
  var t;
  return (t = game.user) != null && t.isGM ? !0 : ($e(`Only a GM can ${e}.`), !1);
}
function os() {
  return game.users.filter((e) => e.active);
}
function cs() {
  return os().filter((e) => e.isGM).sort((e, t) => String(e.id).localeCompare(String(t.id)))[0] ?? null;
}
function ls() {
  var e, t;
  return !!((e = game.user) != null && e.isGM && ((t = cs()) == null ? void 0 : t.id) === game.user.id);
}
const {
  getMapStore: $t,
  saveMapStore: Ft,
  getRawMap: ze,
  createMap: ds,
  updateMap: Pi,
  updateMapMetadata: us,
  deleteMap: ms,
  duplicateMap: fs,
  upsertSystem: ps,
  upsertObject: hs,
  savePlanetLocation: ys,
  removePlanetLocation: gs,
  unlinkPlanetScene: Ss,
  deleteObject: pt,
  moveObject: ki,
  setPrimaryObject: qi,
  saveObjectPosition: vs,
  setObjectVisibility: Is,
  deleteSystem: ht,
  setCurrentSystem: yt,
  setCurrentObject: gt,
  upsertRoute: bs,
  deleteRoute: St,
  upsertFaction: ws,
  deleteFaction: vt,
  hideFactionFromPlayers: Ms,
  saveSystemPosition: Ls,
  revealSystemToPlayers: Ts,
  hideSystemFromPlayers: It,
  revealRouteToPlayers: _s,
  hideRouteFromPlayers: bt,
  importMapData: Ci,
  exportMap: wt,
  getMaps: Xe,
  getSystem: ji,
  getObject: Oi,
  getSceneIdsForSystem: Ai,
  getSceneIdsForObject: Ri,
  getObjectsForScene: $i,
  getSystemsForScene: Fi,
  updateOpenPlanetLocations: Ni
} = _i({ notifyError: $e, notifyInfo: Fe, requireGM: ft, refreshOpenApps: Es, closeOpenMap: Zi, getOpenMapViews: Mt });
function xs(e) {
  var o;
  const t = Ps(e);
  return ((o = t == null ? void 0 : t.closest) == null ? void 0 : o.call(t, ".window-app, .application, .app")) ?? t;
}
function Di(e) {
  return e.map((t) => {
    var f, l;
    const o = xs(t);
    if (!o) return null;
    const c = Number.parseInt(((l = (f = globalThis.getComputedStyle) == null ? void 0 : f.call(globalThis, o)) == null ? void 0 : l.zIndex) ?? "", 10);
    return { app: t, zIndex: o.style.zIndex || (Number.isFinite(c) ? String(c) : "") };
  }).filter(Boolean);
}
function Qe(e) {
  for (const t of e) {
    const o = xs(t.app);
    !(o != null && o.isConnected) || !t.zIndex || (o.style.zIndex = t.zIndex);
  }
}
async function Es(e = null) {
  var l;
  const t = [...Re.entries()].filter(([y, u]) => (u == null ? void 0 : u.rendered) && (!e || y === e)).map(([, y]) => y);
  se != null && se.rendered && (!e || se.mapId === e) && t.push(se);
  const o = [Ee != null && Ee.rendered ? Ee : null, ...t].filter(Boolean), c = Di(o), f = o.map((y) => Promise.resolve(y.render({ force: !0 })));
  Qe(c), await Promise.allSettled(f), Qe(c), (l = globalThis.requestAnimationFrame) == null || l.call(globalThis, () => Qe(c));
}
function Mt(e) {
  const t = [...Re.values()];
  return se && t.push(se), t.filter((o) => (o == null ? void 0 : o.rendered) && o.mapId === e);
}
function Ps(e) {
  return e.element ?? null;
}
const {
  getTravelRoute: Gi,
  requestTravelToSystem: ks,
  requestTravelToObject: qs,
  promptForTravelRequest: Nt,
  isPrimaryGMMessage: Bi,
  handleTravelProgress: zi,
  trackTravelRequest: Hi,
  animateTravelOnOpenMaps: Vi,
  broadcastTravelAnimation: Ui,
  broadcastObjectTravelAnimation: Yi,
  handleTravelVote: Wi,
  handleTravelApproved: Xi,
  handleTravelDeclined: Ji
} = xi({
  getRawMap: ze,
  setCurrentSystem: yt,
  setCurrentObject: gt,
  getOpenMapViews: Mt,
  getAppHtml: Ps,
  notifyInfo: Fe,
  notifyError: $e,
  getActiveUsers: os,
  getPrimaryGM: cs,
  isPrimaryGM: ls
});
function Zi(e) {
  const t = Re.get(e);
  t && t.close(), (se == null ? void 0 : se.mapId) === e && se.close();
}
function qe(e, t = {}) {
  var u;
  const o = ze(e);
  if (!o)
    return $e(`Map "${e}" was not found.`), null;
  const c = t.playerMode ?? !((u = game.user) != null && u.isGM);
  if (c && o.visibility !== "players" && !t.broadcast)
    return $e("That galaxy map is not visible to players."), null;
  const f = c ? `player:${e}` : e, l = c && (se == null ? void 0 : se.mapId) === e ? se : Re.get(f);
  if (l != null && l.rendered)
    return l.bringToFront(), l;
  const y = new an({ mapId: e, playerMode: c });
  return c ? se = y : Re.set(f, y), y.render({ force: !0 }), y;
}
async function Ki(e, t, o = {}) {
  var f;
  if (!e || !t) return !1;
  const c = qe(e, {
    playerMode: o.playerMode ?? !((f = game.user) != null && f.isGM),
    broadcast: o.broadcast === !0
  });
  return c != null && c.focusSystem ? c.focusSystem(t, o) : !1;
}
async function Qi(e, t = {}, o = {}) {
  var y, u;
  const c = String(t.systemId || ""), f = String(t.objectId || "");
  if (!e || !c) return !1;
  const l = qe(e, { playerMode: o.playerMode ?? !((y = game.user) != null && y.isGM), broadcast: o.broadcast === !0 });
  return l ? f && l.focusLocation ? l.focusLocation(c, f, o) : (u = l.focusSystem) == null ? void 0 : u.call(l, c, o) : !1;
}
function en(e, t = "") {
  var c;
  let o = !1;
  for (const f of Mt(e))
    o = ((c = f.clearSystemFocus) == null ? void 0 : c.call(f, t)) || o;
  return o;
}
function Lt() {
  return ft("open the map manager") ? (Ee || (Ee = new sn()), Ee.render({ force: !0 }), Ee) : null;
}
function Tt() {
  const e = Cs();
  return e.length ? e.length === 1 ? qe(e[0].id, { playerMode: !0 }) : (Ne || (Ne = new nn()), Ne.render({ force: !0 }), Ne) : (Fe("No galaxy map is currently visible to players."), null);
}
function Cs() {
  return Xe().filter((e) => e.visibility === "players").sort((e, t) => e.title.localeCompare(t.title));
}
function tn() {
  var t;
  const e = Xe().sort((o, c) => o.title.localeCompare(c.title));
  return (t = game.user) != null && t.isGM ? e.length === 1 ? qe(e[0].id) : Lt() : Tt();
}
function js(e) {
  if (ft("broadcast galaxy maps")) {
    if (!ze(e)) {
      $e(`Map "${e}" was not found.`);
      return;
    }
    game.socket.emit(ge, { action: "open", mapId: e }), Fe("Map broadcast sent to players.");
  }
}
const sn = ii({
  templateRoot: xe,
  getMaps: Xe,
  prepareMapForManager: Li,
  getRawMap: ze,
  exportMap: wt,
  duplicateMap: fs,
  deleteMap: ms,
  createMap: ds,
  deleteSystem: ht,
  deleteObject: pt,
  deleteRoute: St,
  deleteFaction: vt,
  openMap: qe,
  showMapToPlayers: js,
  hideSystemFromPlayers: It,
  hideRouteFromPlayers: bt,
  hideFactionFromPlayers: Ms,
  clearManagerApp: (e) => {
    Ee === e && (Ee = null);
  }
}), nn = vi({
  templateRoot: xe,
  getVisibleMaps: Cs,
  openMap: qe,
  clearChooser: (e) => {
    Ne === e && (Ne = null);
  }
}), an = Si({
  templateRoot: xe,
  getRawMap: ze,
  prepareMapForDisplay: Mi,
  upsertSystem: ps,
  upsertObject: hs,
  upsertRoute: bs,
  upsertFaction: ws,
  updateMapMetadata: us,
  deleteFaction: vt,
  getTextureGuideMarkup: Ei,
  activateObjectEditorControls: Ti,
  revealSystemToPlayers: Ts,
  revealRouteToPlayers: _s,
  hideSystemFromPlayers: It,
  setObjectVisibility: Is,
  hideRouteFromPlayers: bt,
  deleteSystem: ht,
  deleteObject: pt,
  deleteRoute: St,
  setCurrentSystem: yt,
  setCurrentObject: gt,
  requestTravelToSystem: ks,
  requestTravelToObject: qs,
  exportMap: wt,
  getTravelRoute: Gi,
  broadcastTravelAnimation: Ui,
  broadcastObjectTravelAnimation: Yi,
  notifyInfo: Fe,
  notifyError: $e,
  saveSystemPosition: Ls,
  saveObjectPosition: vs,
  savePlanetLocation: ys,
  removePlanetLocation: gs,
  unlinkPlanetScene: Ss,
  clearMapView: (e) => {
    e.playerMode && se === e && (se = null);
    for (const [t, o] of Re.entries())
      o === e && Re.delete(t);
  }
});
function rn() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: Se,
    title: "Galaxy Map",
    icon: "fa-solid fa-route",
    premium: !1,
    description: "Open cinematic campaign maps and navigation charts.",
    open: () => {
      var o;
      return (o = game.user) != null && o.isGM ? Lt() : Tt();
    }
  }), !0) : !1;
}
Hooks.once("init", async () => {
  game.settings.register(Se, nt, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(Se, Ue, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(Se, at, {
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  }), Handlebars.registerHelper("gmfEq", (e, t) => e === t), Handlebars.registerHelper("gmfJson", (e) => JSON.stringify(e, null, 2)), Handlebars.registerHelper("gmfPercent", (e) => `${Number(e).toFixed(3)}%`), Handlebars.registerHelper("gmfFallback", (e, t) => e || t), Hooks.on("renderDialog", (e, t) => {
    var f, l;
    const o = is(t), c = ((f = o == null ? void 0 : o.closest) == null ? void 0 : f.call(o, ".window-app, .application, .app")) ?? o;
    (l = c == null ? void 0 : c.classList) != null && l.contains("galaxy-map") && ei(e, t);
  }), await loadTemplates([
    `${xe}/map-manager.hbs`,
    `${xe}/galaxy-map.hbs`,
    `${xe}/map-context-menu.hbs`,
    `${xe}/celestial-icon.hbs`,
    `${xe}/object-appearance-panel.hbs`,
    `${xe}/system-details.hbs`,
    `${xe}/player-map-chooser.hbs`
  ]);
});
Hooks.once("ready", async () => {
  game.galaxyMap = {
    openMap: qe,
    focusSystem: Ki,
    focusLocation: Qi,
    clearSystemFocus: en,
    openMapManager: Lt,
    openGalaxyMapFromSceneControls: tn,
    openPlayerMapChooser: Tt,
    createMap: ds,
    getMaps: Xe,
    getSystem: ji,
    getObject: Oi,
    getSceneIdsForSystem: Ai,
    getSystemsForScene: Fi,
    getSceneIdsForObject: Ri,
    getObjectsForScene: $i,
    showMapToPlayers: js,
    updateMap: Pi,
    updateMapMetadata: us,
    deleteMap: ms,
    duplicateMap: fs,
    upsertSystem: ps,
    deleteSystem: ht,
    upsertObject: hs,
    deleteObject: pt,
    moveObject: ki,
    setPrimaryObject: qi,
    upsertRoute: bs,
    deleteRoute: St,
    upsertFaction: ws,
    deleteFaction: vt,
    saveSystemPosition: Ls,
    saveObjectPosition: vs,
    savePlanetLocation: ys,
    removePlanetLocation: gs,
    unlinkPlanetScene: Ss,
    setCurrentSystem: yt,
    setCurrentObject: gt,
    revealSystemToPlayers: Ts,
    revealRouteToPlayers: _s,
    hideSystemFromPlayers: It,
    setObjectVisibility: Is,
    hideRouteFromPlayers: bt,
    hideFactionFromPlayers: Ms,
    requestTravelToSystem: ks,
    requestTravelToObject: qs,
    importMapData: Ci,
    exportMap: wt
  };
  const e = game.modules.get(Se);
  if (e && (e.api = game.galaxyMap), rn(), ls()) {
    const t = $t();
    if (Object.values(t).some((c) => Number((c == null ? void 0 : c.schemaVersion) || 1) < ke)) {
      const c = Rt(game.settings.get(Se, Ue) ?? {});
      Object.keys(c).length || await game.settings.set(Se, Ue, t);
      const f = Object.fromEntries(Object.entries(t).map(([l, y]) => [l, V(y)]));
      await Ft(f), Fe('Your galaxy maps were updated to the new format. Everything from the old single map is now inside a system called "System 1", and a backup of the old data was kept.');
    }
    if (!game.settings.get(Se, at)) {
      const c = Rt(game.settings.get(Se, Ue) ?? {}), f = $t();
      let l = 0;
      for (const [y, u] of Object.entries(c)) {
        if (!f[y]) continue;
        const x = V(f[y]);
        for (const I of (u == null ? void 0 : u.systems) ?? []) {
          const M = Xt(I == null ? void 0 : I.planetLocations);
          if (!M.length) continue;
          const L = x.systems.flatMap((T) => T.objects).find((T) => T.id === I.id || T.id === `${I.id}-object`);
          !L || L.planetLocations.length || (L.planetLocations = M.filter((T) => L.sceneIds.includes(T.sceneId)), l += L.planetLocations.length);
        }
        f[y] = V(x);
      }
      l && (await Ft(f), Fe(`Restored ${l} surface location${l === 1 ? "" : "s"} that went missing in an earlier update.`)), await game.settings.set(Se, at, !0);
    }
  }
  game.socket.on(ge, (t = {}) => {
    var o, c, f, l, y;
    if (t.action === "travel-request") {
      const u = Hi(t);
      u && (game.socket.emit(ge, u), Nt(u));
      return;
    }
    if (t.action === "travel-ballot") {
      Bi(t) && t.coordinatorId !== ((o = game.user) == null ? void 0 : o.id) && Nt(t);
      return;
    }
    if (t.action === "travel-vote") {
      Wi(t);
      return;
    }
    if (t.action === "travel-progress") {
      zi(t);
      return;
    }
    if (t.action === "travel-approved") {
      Xi(t);
      return;
    }
    if (t.action === "travel-declined") {
      Ji(t);
      return;
    }
    if (t.action === "travel-animation") {
      t.coordinatorId !== ((c = game.user) == null ? void 0 : c.id) && Vi(t);
      return;
    }
    if (t.action === "planet-locations") {
      Ni(t.mapId, t.systemId, t.objectId);
      return;
    }
    if (t.action === "refresh") {
      (f = game.user) != null && f.isGM ? Es(t.mapId) : (se == null ? void 0 : se.mapId) === t.mapId && se.render({ force: !0 });
      return;
    }
    (l = game.user) != null && l.isGM || (t.action === "open" && t.mapId && (se == null || se.close(), qe(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "notify" && ((y = ui.notifications) == null || y.info(t.message || "New system discovered."), (se == null ? void 0 : se.mapId) === t.mapId && se.render({ force: !0 })));
  }), console.log(`${Se} | Ready. API available at game.galaxyMap.`);
});
