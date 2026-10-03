var As = Object.defineProperty;
var Rs = (e, t, o) => t in e ? As(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o;
var X = (e, t, o) => Rs(e, typeof t != "symbol" ? t + "" : t, o);
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
], $s = [
  { value: "sphere", label: "Sphere" },
  { value: "cube", label: "Cube" },
  { value: "donut", label: "Donut" },
  { value: "asteroid", label: "Asteroid" },
  { value: "crystal", label: "Crystal" },
  { value: "cylinder", label: "Cylinder" }
], Fs = [
  { value: "smooth", label: "Smooth" },
  { value: "matte", label: "Matte" },
  { value: "holographic", label: "Holographic" }
];
function Ye(e) {
  return $s.some((t) => t.value === e) ? String(e) : "sphere";
}
function Gt(e) {
  return Fs.some((t) => t.value === e) ? String(e) : "smooth";
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
function Ns(e) {
  return e === "black-hole";
}
function qe(e, t = "") {
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
  const f = ct(c), l = [...new Map((e ?? []).filter((L) => L == null ? void 0 : L.id).map((L) => [String(L.id), L])).values()], y = f === "gm" ? o != null && o.id ? [o] : [] : l.filter((L) => String(L.id) !== String(t)), u = y.map((L) => String(L.id)), E = Object.fromEntries(y.map((L) => [String(L.id), String(L.name || "Navigator").slice(0, 80)])), I = u.length + (f === "gm" ? 0 : 1), M = f === "gm" ? 1 : f === "majority" ? Math.floor(I / 2) + 1 : I;
  return { approvalMode: f, voterIds: u, voterNames: E, participantCount: I, requiredApprovals: M };
}
function Et(e) {
  const t = ct(e == null ? void 0 : e.approvalMode), o = [...new Set(((e == null ? void 0 : e.voterIds) ?? []).map(String))], c = new Set([...(e == null ? void 0 : e.accepted) ?? []].map(String)), f = new Set([...(e == null ? void 0 : e.declined) ?? []].map(String)), l = t === "gm" ? 0 : 1, y = Math.max(1, Number(e == null ? void 0 : e.requiredApprovals) || (t === "unanimous" ? o.length + 1 : 1)), u = l + o.filter((M) => c.has(M)).length, E = o.filter((M) => f.has(M)).length, I = o.filter((M) => !c.has(M) && !f.has(M));
  return u >= y ? { outcome: "approved", acceptedCount: u, declinedCount: E, required: y, pendingIds: I } : t === "unanimous" && E > 0 ? { outcome: "declined", acceptedCount: u, declinedCount: E, required: y, pendingIds: I } : u + I.length < y ? { outcome: "declined", acceptedCount: u, declinedCount: E, required: y, pendingIds: I } : { outcome: "pending", acceptedCount: u, declinedCount: E, required: y, pendingIds: I };
}
const Ce = 3, Ds = ["core", "colony", "frontier", "ruins", "restricted", "unknown"], Gs = ["star", "planet", "moon", "station", "asteroid", "anomaly", "black-hole", "other"], Vt = ["undiscovered", "known", "visited", "danger", "locked"], Bs = ["safe", "dangerous", "restricted", "smuggler", "unknown"], et = ["gm", "players"], Ut = ["inherit", ...et], zs = [
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
], lt = zs.map((e) => e.value), tt = lt, Ze = 0.2, Ke = 10, Yt = 2400, Hs = 6e4;
function Te(e = "gmf") {
  return `${e}-${foundry.utils.randomID(10)}`;
}
function Be(e, t = "players") {
  const o = et.includes(t) ? t : "players";
  return et.includes(e) ? String(e) : o;
}
function Vs(e) {
  return Ut.includes(e) ? String(e) : "inherit";
}
function Us(e) {
  return typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "#58d8ff";
}
function st(e) {
  return typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "";
}
function we(e, t = 0) {
  const o = Number(e);
  return Number.isFinite(o) ? o : t;
}
function Ys(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  return [...new Set(t.map((o) => String(o).trim()).filter(Boolean))];
}
function le(e, t, o) {
  return Math.min(o, Math.max(t, e));
}
function Pt(e, t) {
  return !Array.isArray(e) || e.length < 3 ? [...t] : e.slice(0, 3).map((o, c) => le(we(o, t[c]), -2.5, 2.5));
}
function Wt(e = {}) {
  const t = Pt(e.normal, [0, 0, 1]), o = Math.hypot(...t) || 1;
  return {
    id: String(e.id || Te("location")),
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
  return Gs.includes(e.kind) ? e.kind : e.type === "station" || e.iconStyle === "station" ? "station" : e.type === "anomaly" ? "anomaly" : e.iconStyle === "star" ? "star" : e.iconStyle === "black-hole" ? "black-hole" : e.planetShape === "asteroid" ? "asteroid" : ["planet", "terrestrial", "gas-giant", "ice-world", "volcanic", "artificial", "ringed"].includes(e.iconStyle) ? "planet" : "other";
}
function it(e = {}) {
  const t = Ys(e.sceneIds === void 0 ? e.sceneId : e.sceneIds), o = String(e.planetTexture || "").trim(), c = Ye(e.planetShape), f = rt(e.planetPreset), l = Ht(f, c), y = o && !["none", "color"].includes(l) ? "custom" : l, u = Jt(e);
  return {
    id: String(e.id || Te("object")),
    name: String(e.name || "Unnamed Object"),
    kind: u,
    x: le(we(e.x, 50), 0, 100),
    y: le(we(e.y, 50), 0, 100),
    status: Vt.includes(e.status) ? e.status : "known",
    visibility: Vs(e.visibility),
    factionId: String(e.factionId || ""),
    description: String(e.description || ""),
    image: String(e.image || ""),
    sceneIds: t,
    planetLocations: Xt(e.planetLocations).filter((I) => t.includes(I.sceneId)),
    journalId: String(e.journalId || ""),
    notes: String(e.notes || "").trim(),
    iconColor: st(e.iconColor),
    iconSize: le(we(e.iconSize, 28), 18, 56),
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
  const t = Array.isArray(e.objects) ? e.objects.map(it) : [], o = new Set(t.map((E) => E.id)), c = (Array.isArray(e.routes) ? e.routes : []).map(dt).filter((E) => E.fromSystemId !== E.toSystemId && o.has(E.fromSystemId) && o.has(E.toSystemId)), f = t.some((E) => E.id === e.primaryObjectId) ? String(e.primaryObjectId) : ((u = t[0]) == null ? void 0 : u.id) ?? "", l = t.find((E) => E.id === f) ?? it(e), y = {
    id: String(e.id || Te("system")),
    name: String(e.name || "Unnamed System"),
    x: le(we(e.x, 50), 0, 100),
    y: le(we(e.y, 50), 0, 100),
    type: Ds.includes(e.type) ? e.type : "unknown",
    factionId: String(e.factionId || ""),
    status: Vt.includes(e.status) ? e.status : "known",
    description: String(e.description || ""),
    visibility: Be(e.visibility, "players"),
    notes: String(e.notes || "").trim(),
    backgroundImage: String(e.backgroundImage || "").trim(),
    iconColor: st(e.iconColor),
    iconSize: le(we(e.iconSize, 30), 18, 56),
    markerImage: String(e.markerImage || "").trim(),
    iconStyle: lt.includes(e.iconStyle) ? e.iconStyle : "star",
    pulse: e.pulse !== !1,
    primaryObjectId: f,
    objects: t,
    routes: c
  };
  for (const [E, I] of Object.entries({
    image: l.image,
    sceneIds: [...l.sceneIds],
    planetLocations: [...l.planetLocations],
    journalId: l.journalId,
    planetPreset: l.planetPreset,
    planetShape: l.planetShape,
    planetFinish: l.planetFinish,
    planetTexture: l.planetTexture,
    planetColor: l.planetColor
  })) Object.defineProperty(y, E, { value: I, enumerable: !1, configurable: !0 });
  return y;
}
function dt(e = {}) {
  return {
    id: String(e.id || Te("route")),
    fromSystemId: String(e.fromSystemId || ""),
    toSystemId: String(e.toSystemId || ""),
    type: Bs.includes(e.type) ? e.type : "unknown",
    travelTime: String(e.travelTime || ""),
    fuelCost: we(e.fuelCost, 0),
    visibility: Be(e.visibility, "players"),
    notes: String(e.notes || "")
  };
}
function Kt(e = {}) {
  return {
    id: String(e.id || Te("faction")),
    name: String(e.name || "Unaffiliated"),
    color: Us(e.color),
    description: String(e.description || ""),
    visibility: Be(e.visibility, "players")
  };
}
function ut(e = {}) {
  return `${String(e.id || "galaxy")}-system-1`;
}
function Ws(e = {}) {
  const t = String(e.id || e.objectId || Te("object")), o = Jt(e);
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
function Xs(e, t) {
  var y;
  const c = (Array.isArray(e.systems) ? e.systems : []).map(Ws), f = String(e.currentSystemId || ((y = c[0]) == null ? void 0 : y.id) || ""), l = Qt(e, c, f, ut(e), Array.isArray(e.routes) ? e.routes : []);
  return {
    ...e,
    schemaVersion: Ce,
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
function Js(e) {
  var re, V, ie, ne;
  const t = Array.isArray(e.systems) ? e.systems : [], o = t.filter(qt), c = t.filter((C) => !qt(C));
  if (!o.length && t.length) return { ...e, schemaVersion: Ce };
  const f = new Set(c.map((C) => String(C.id)));
  let l = ut(e);
  f.has(l) && (l = `${l}-legacy`);
  const y = new Set(o.map((C) => String(C.id))), u = new Map(o.map((C) => [String(C.id), String(C.primaryObjectId)])), E = o.flatMap((C) => (C.objects ?? []).map((A) => {
    const ee = A.id === C.primaryObjectId;
    return {
      ...A,
      x: ee ? C.x : A.x,
      y: ee ? C.y : A.y,
      visibility: A.visibility === "inherit" ? C.visibility : A.visibility,
      factionId: A.factionId || C.factionId || ""
    };
  })), I = String(((re = e.currentLocation) == null ? void 0 : re.systemId) || e.currentSystemId || ""), M = o.find((C) => C.id === I), L = String(((V = e.currentLocation) == null ? void 0 : V.objectId) || (M == null ? void 0 : M.primaryObjectId) || ((ie = E[0]) == null ? void 0 : ie.id) || ""), _ = Array.isArray(e.routes) ? e.routes : [], G = _.filter((C) => y.has(String(C.fromSystemId)) && y.has(String(C.toSystemId))).map((C) => ({ ...C, fromSystemId: u.get(String(C.fromSystemId)), toSystemId: u.get(String(C.toSystemId)) })), N = Qt(e, E, L, l, G), U = [N, ...c], oe = new Set(U.map((C) => String(C.id))), P = /* @__PURE__ */ new Set(), Q = _.filter((C) => !(y.has(String(C.fromSystemId)) && y.has(String(C.toSystemId)))).map((C) => ({
    ...C,
    fromSystemId: y.has(String(C.fromSystemId)) ? l : C.fromSystemId,
    toSystemId: y.has(String(C.toSystemId)) ? l : C.toSystemId
  })).filter((C) => {
    if (C.fromSystemId === C.toSystemId || !oe.has(String(C.fromSystemId)) || !oe.has(String(C.toSystemId))) return !1;
    const A = [C.fromSystemId, C.toSystemId].sort().join(":");
    return P.has(A) ? !1 : (P.add(A), !0);
  }), Z = y.has(I) || !oe.has(I) ? l : I;
  return {
    ...e,
    schemaVersion: Ce,
    migratedFromSchema: 2,
    systems: U,
    routes: Q,
    currentLocation: { systemId: Z, objectId: Z === l ? N.primaryObjectId : ((ne = e.currentLocation) == null ? void 0 : ne.objectId) ?? "" },
    currentSystemId: Z
  };
}
function Zs(e = {}) {
  const t = Number(e.schemaVersion) || 1;
  if (t > Ce) throw new Error(`Galaxy Map schema ${t} is newer than supported schema ${Ce}.`);
  return t >= Ce ? { ...e, schemaVersion: Ce } : t < 2 ? Xs(e, t) : Js(e);
}
function z(e = {}) {
  var M, L, _, G;
  const t = Zs(e), o = Array.isArray(t.systems) ? t.systems.map(Zt) : [], c = Array.isArray(t.routes) ? t.routes.map(dt) : [], f = Array.isArray(t.factions) ? t.factions.map(Kt) : [], l = String(((M = t.currentLocation) == null ? void 0 : M.systemId) || t.currentSystemId || ((L = o[0]) == null ? void 0 : L.id) || ""), y = o.some((N) => N.id === l) ? l : ((_ = o[0]) == null ? void 0 : _.id) ?? "", u = o.find((N) => N.id === y), E = String(((G = t.currentLocation) == null ? void 0 : G.objectId) || ""), I = u != null && u.objects.some((N) => N.id === E) ? E : (u == null ? void 0 : u.primaryObjectId) ?? "";
  return {
    schemaVersion: Ce,
    id: String(t.id || Te("map")),
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
function Re(e, t) {
  return (t == null ? void 0 : t.visibility) === "inherit" ? (e == null ? void 0 : e.visibility) ?? "gm" : (t == null ? void 0 : t.visibility) ?? "gm";
}
const Ks = "modules/galaxy-map/assets/frames/galaxy-frame-cyan.svg";
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
function Qs() {
  var c, f, l, y, u, E;
  const e = document.documentElement, t = ((c = e == null ? void 0 : e.dataset) == null ? void 0 : c.holosuiteDeviceStyle) || ((l = (f = document.body) == null ? void 0 : f.dataset) == null ? void 0 : l.holosuiteDeviceStyle) || "";
  if (Ve[t]) return Ve[t];
  const o = ((y = e == null ? void 0 : e.dataset) == null ? void 0 : y.holosuiteTheme) || ((E = (u = document.body) == null ? void 0 : u.dataset) == null ? void 0 : E.holosuiteTheme) || "default";
  return Ve[o] ?? Ve.default;
}
async function es(e) {
  const { primary: t, success: o, background: c } = Qs(), f = Ot(t, c, 0.58), l = Ot(t, c, 0.34), y = [t, o, f, l, c].join("|");
  e.dataset.gmfFramePalette = y;
  let u = jt.get(y);
  if (!u)
    try {
      Ct ?? (Ct = fetch(Ks).then((M) => {
        if (!M.ok) throw new Error(`Galaxy frame request failed (${M.status})`);
        return M.text();
      }));
      let E = await Ct;
      E = E.replace(/<script\b[\s\S]*?<\/script>/gi, "");
      const I = /* @__PURE__ */ new Map([
        ["#18ebed", t],
        ["#28f3f5", t],
        ["#3be8e4", t],
        ["#64f4f1", o],
        ["#1490ab", f],
        ["#22788b", l],
        ["#042228", c]
      ]);
      for (const [M, L] of I) E = E.replace(new RegExp(M, "gi"), L);
      u = URL.createObjectURL(new Blob([E], { type: "image/svg+xml" })), jt.set(y, u);
    } catch {
      return;
    }
  e.isConnected && e.dataset.gmfFramePalette === y && e.style.setProperty("--gmf-frame-image", `url("${u}")`);
}
function ei() {
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
  c && (ei(), es(c));
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
        var U, oe, P;
        if (y.button !== 0) return;
        const u = y.target;
        if ((U = u == null ? void 0 : u.closest) != null && U.call(u, "button, input, select, textarea, a, [data-action]")) return;
        const E = c.getBoundingClientRect(), I = y.clientX, M = y.clientY, L = E.left, _ = E.top;
        (oe = e.bringToFront ?? e.bringToTop) == null || oe.call(e), (P = l.setPointerCapture) == null || P.call(l, y.pointerId), l.classList.add("is-dragging");
        const G = (Q) => {
          var ne;
          const Z = c.getBoundingClientRect().width, re = c.getBoundingClientRect().height, V = Math.max(0, Math.min(window.innerWidth - Math.min(Z, 80), L + Q.clientX - I)), ie = Math.max(0, Math.min(window.innerHeight - Math.min(re, 48), _ + Q.clientY - M));
          (ne = e.setPosition) == null || ne.call(e, { left: V, top: ie });
        }, N = () => {
          l.classList.remove("is-dragging"), l.removeEventListener("pointermove", G), l.removeEventListener("pointerup", N), l.removeEventListener("pointercancel", N);
        };
        l.addEventListener("pointermove", G), l.addEventListener("pointerup", N), l.addEventListener("pointercancel", N);
      }));
  }
}
function ti(e, t) {
  var I, M;
  const o = ts(t), c = ss(o), f = (I = c == null ? void 0 : c.querySelector) == null ? void 0 : I.call(c, ":scope > .window-content");
  if (!o || !c || !f || f.querySelector(":scope > .gmf-dialog-header")) return;
  const l = document.createElement("header");
  l.className = "gmf-dialog-header", l.dataset.gmfWindowDrag = "true";
  const y = document.createElement("div");
  y.className = "gmf-dialog-header__identity", y.innerHTML = '<span class="gmf-dialog-header__orb"><i class="fa-solid fa-satellite"></i></span><span><small>GALAXY MAP // CONTROL PANEL</small><strong></strong></span>';
  const u = y.querySelector("strong");
  u && (u.textContent = (e == null ? void 0 : e.title) || ((M = c.querySelector(".window-title")) == null ? void 0 : M.textContent) || "Galaxy Map");
  const E = document.createElement("button");
  E.type = "button", E.className = "gmf-window-close", E.dataset.action = "close-window", E.title = "Close", E.setAttribute("aria-label", "Close window"), E.innerHTML = '<i class="fa-solid fa-xmark"></i>', l.append(y, E), f.prepend(l), We(e, c);
}
const $e = {
  classes: ["galaxy-map", "gmf-crud-dialog"]
};
function mt() {
  const { ApplicationV2: e, HandlebarsApplicationMixin: t } = foundry.applications.api;
  return t(e);
}
function si(e) {
  return String(e || "galaxy-map").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "galaxy-map";
}
function ii(e, t) {
  const o = JSON.stringify(t, null, 2), c = globalThis.saveDataToFile;
  if (typeof c == "function") {
    c(o, "application/json", e);
    return;
  }
  const f = new Blob([o], { type: "application/json" }), l = URL.createObjectURL(f), y = document.createElement("a");
  y.href = l, y.download = e, document.body.appendChild(y), y.click(), y.remove(), setTimeout(() => URL.revokeObjectURL(l), 0);
}
function ve(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function is(e) {
  return (e == null ? void 0 : e[0]) ?? e ?? null;
}
function At(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
}
function ni(e = globalThis) {
  var f, l, y;
  const t = (y = (l = (f = e.foundry) == null ? void 0 : f.applications) == null ? void 0 : l.apps) == null ? void 0 : y.FilePicker, o = t == null ? void 0 : t.implementation;
  if (typeof o == "function") return o;
  if (typeof t == "function") return t;
  const c = typeof FilePicker == "function" ? FilePicker : e.FilePicker;
  return typeof c == "function" ? c : null;
}
function ns(e) {
  const t = (o) => o ? e.querySelector(`[name="${o}"]`) : null;
  e.querySelectorAll("[data-browse-target]").forEach((o) => {
    o.addEventListener("click", (c) => {
      c.preventDefault();
      const f = t(o.dataset.browseTarget);
      if (!f) return;
      const l = ni();
      if (!l) {
        console.error("galaxy-map | Foundry FilePicker is unavailable.");
        return;
      }
      new l({
        type: "image",
        current: f.value,
        callback: (y) => {
          f.value = y, At(f);
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
function ai(e) {
  var V;
  const {
    templateRoot: t,
    getMaps: o,
    prepareMapForManager: c,
    getRawMap: f,
    importMapData: l,
    exportMap: y,
    duplicateMap: u,
    deleteMap: E,
    createMap: I,
    deleteSystem: M,
    deleteObject: L,
    deleteRoute: _,
    deleteFaction: G,
    openMap: N,
    showMapToPlayers: U,
    hideSystemFromPlayers: oe,
    hideRouteFromPlayers: P,
    hideFactionFromPlayers: Q,
    notifyError: Z,
    clearManagerApp: re
  } = e;
  return V = class extends mt() {
    constructor(C = {}) {
      super(C);
      X(this, "selectedMapId");
      X(this, "activeTab");
      X(this, "expandedSystemId");
      this.selectedMapId = C.selectedMapId ?? null, this.activeTab = ["systems", "routes", "factions"].includes(C.activeTab) ? C.activeTab : "systems", this.expandedSystemId = C.expandedSystemId;
    }
    async _prepareContext(C) {
      var te, se;
      const A = await super._prepareContext(C), ee = o().sort((ue, he) => ue.title.localeCompare(he.title));
      (!this.selectedMapId || !ee.some((ue) => ue.id === this.selectedMapId)) && (this.selectedMapId = ((te = ee[0]) == null ? void 0 : te.id) ?? null);
      const K = this.selectedMapId ? c(f(this.selectedMapId)) : null;
      if (K) {
        const ue = new Set(K.systems.map((he) => he.id));
        this.expandedSystemId && !ue.has(this.expandedSystemId) && (this.expandedSystemId = void 0), this.expandedSystemId === void 0 && (this.expandedSystemId = ((se = K.systems[0]) == null ? void 0 : se.id) ?? null), K.systems = K.systems.map((he) => ({
          ...he,
          isExpanded: he.id === this.expandedSystemId
        }));
      }
      return {
        ...A,
        maps: ee,
        selectedMap: K,
        selectedMapId: this.selectedMapId,
        activeTab: this.activeTab,
        showSystems: this.activeTab === "systems",
        showRoutes: this.activeTab === "routes",
        showFactions: this.activeTab === "factions",
        hasMaps: ee.length > 0
      };
    }
    _attachPartListeners(C, A, ee) {
      var K, te, se, ue, he, ke, xe;
      super._attachPartListeners(C, A, ee), We(this, A), (K = A.querySelector("[data-action='create-map']")) == null || K.addEventListener("click", () => this._onCreateMap()), (te = A.querySelector("[data-action='edit-map-metadata']")) == null || te.addEventListener("click", () => {
        this._openViewportEditor("map");
      }), (se = A.querySelector("[data-action='create-system']")) == null || se.addEventListener("click", () => {
        this._openViewportEditor("system");
      }), (ue = A.querySelector("[data-action='create-route']")) == null || ue.addEventListener("click", () => {
        this._openViewportEditor("route");
      }), (he = A.querySelector("[data-action='create-faction']")) == null || he.addEventListener("click", () => {
        this._openViewportEditor("faction");
      }), A.querySelectorAll("[data-manager-tab]").forEach((R) => {
        R.addEventListener("click", () => {
          const me = R.dataset.managerTab;
          !["systems", "routes", "factions"].includes(me) || me === this.activeTab || (this.activeTab = me, this.render({ force: !0 }));
        });
      }), A.querySelectorAll("[data-toggle-system]").forEach((R) => {
        R.addEventListener("click", () => {
          const me = R.dataset.toggleSystem;
          this.expandedSystemId = this.expandedSystemId === me ? null : me, this.render({ force: !0 });
        });
      }), A.querySelectorAll("[data-edit-system]").forEach((R) => {
        R.addEventListener("click", () => this._openViewportEditor("system", { id: R.dataset.editSystem }));
      }), A.querySelectorAll("[data-create-object]").forEach((R) => {
        R.addEventListener("click", () => this._openViewportEditor("entity", { systemId: R.dataset.createObject }));
      }), A.querySelectorAll("[data-edit-object]").forEach((R) => {
        R.addEventListener("click", () => this._openViewportEditor("entity", { systemId: R.dataset.objectSystem, id: R.dataset.editObject }));
      }), A.querySelectorAll("[data-delete-object]").forEach((R) => {
        R.addEventListener("click", () => this._confirmDeleteObject(R.dataset.objectSystem, R.dataset.deleteObject));
      }), A.querySelectorAll("[data-show-system]").forEach((R) => {
        R.addEventListener("click", () => oe(this.selectedMapId, R.dataset.showSystem, !1));
      }), A.querySelectorAll("[data-hide-system]").forEach((R) => {
        R.addEventListener("click", () => oe(this.selectedMapId, R.dataset.hideSystem, !0));
      }), A.querySelectorAll("[data-delete-system]").forEach((R) => {
        R.addEventListener("click", () => this._confirmDeleteSystem(R.dataset.deleteSystem));
      }), A.querySelectorAll("[data-edit-route]").forEach((R) => {
        R.addEventListener("click", () => this._openViewportEditor("route", { id: R.dataset.editRoute, systemId: R.dataset.routeSystem }));
      }), A.querySelectorAll("[data-show-route]").forEach((R) => {
        R.addEventListener("click", () => P(this.selectedMapId, R.dataset.showRoute, !1, R.dataset.routeSystem));
      }), A.querySelectorAll("[data-hide-route]").forEach((R) => {
        R.addEventListener("click", () => P(this.selectedMapId, R.dataset.hideRoute, !0, R.dataset.routeSystem));
      }), A.querySelectorAll("[data-delete-route]").forEach((R) => {
        R.addEventListener("click", () => this._confirmDeleteRoute(R.dataset.deleteRoute, R.dataset.routeSystem));
      }), A.querySelectorAll("[data-edit-faction]").forEach((R) => {
        R.addEventListener("click", () => this._openViewportEditor("faction", { id: R.dataset.editFaction }));
      }), A.querySelectorAll("[data-show-faction]").forEach((R) => {
        R.addEventListener("click", () => Q(this.selectedMapId, R.dataset.showFaction, !1));
      }), A.querySelectorAll("[data-hide-faction]").forEach((R) => {
        R.addEventListener("click", () => Q(this.selectedMapId, R.dataset.hideFaction, !0));
      }), A.querySelectorAll("[data-delete-faction]").forEach((R) => {
        R.addEventListener("click", () => this._confirmDeleteFaction(R.dataset.deleteFaction));
      }), (ke = A.querySelector("[data-action='export-map']")) == null || ke.addEventListener("click", () => {
        this.selectedMapId && y(this.selectedMapId);
      }), (xe = A.querySelector("[data-action='import-map']")) == null || xe.addEventListener("click", () => this._onImportMap()), A.querySelectorAll("[data-select-map]").forEach((R) => {
        R.addEventListener("click", () => {
          this.selectedMapId = R.dataset.selectMap, this.expandedSystemId = void 0, this.render({ force: !0 });
        });
      }), A.querySelectorAll("[data-open-map]").forEach((R) => {
        R.addEventListener("click", () => N(R.dataset.openMap));
      }), A.querySelectorAll("[data-show-map]").forEach((R) => {
        R.addEventListener("click", () => U(R.dataset.showMap));
      }), A.querySelectorAll("[data-duplicate-map]").forEach((R) => {
        R.addEventListener("click", async () => {
          const me = await u(R.dataset.duplicateMap);
          me && (this.selectedMapId = me.id, this.render({ force: !0 }));
        });
      }), A.querySelectorAll("[data-delete-map]").forEach((R) => {
        R.addEventListener("click", async () => {
          const me = R.dataset.deleteMap, ye = f(me);
          await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${ve((ye == null ? void 0 : ye.title) ?? me)}</strong>? This cannot be undone.</p>`
          }, $e) && (await E(me), this.selectedMapId === me && (this.selectedMapId = null), this.render({ force: !0 }));
        });
      });
    }
    _onImportMap() {
      const C = document.createElement("input");
      C.type = "file", C.accept = ".json,application/json", C.addEventListener("change", async () => {
        var ee;
        const A = (ee = C.files) == null ? void 0 : ee[0];
        if (A)
          try {
            const K = JSON.parse(await A.text());
            if (!K || typeof K != "object" || Array.isArray(K))
              throw new Error("The selected file does not contain a Galaxy Map object.");
            const te = await l(K);
            if (!te) return;
            this.selectedMapId = te.id, this.expandedSystemId = void 0, this.render({ force: !0 });
          } catch (K) {
            const te = K instanceof Error ? K.message : "The selected file could not be read.";
            Z(`Could not import map: ${te}`);
          }
      }, { once: !0 }), C.click();
    }
    async _onCreateMap() {
      const C = await I({
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
      C && (this.selectedMapId = C.id, this.render({ force: !0 }));
    }
    _openViewportEditor(C, A = {}) {
      var ee, K;
      this.selectedMapId && ((K = (ee = N(this.selectedMapId)) == null ? void 0 : ee.openEditor) == null || K.call(ee, C, A));
    }
    async _confirmDeleteSystem(C) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, $e) && await M(this.selectedMapId, C);
    }
    async _confirmDeleteObject(C, A) {
      await Dialog.confirm({
        title: "Delete Location",
        content: "<p>Delete this location and its linked content from the system?</p>"
      }) && await L(this.selectedMapId, C, A);
    }
    async _confirmDeleteRoute(C, A = "") {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, $e) && await _(this.selectedMapId, C, A);
    }
    async _confirmDeleteFaction(C) {
      await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }, $e) && await G(this.selectedMapId, C);
    }
    async close(C = {}) {
      return re(this), super.close(C);
    }
  }, X(V, "DEFAULT_OPTIONS", {
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
  }), X(V, "PARTS", {
    main: {
      template: `${t}/map-manager.hbs`
    }
  }), V;
}
function ri(e, t) {
  const o = (c, f, l) => (f[0] - c[0]) * (l[1] - c[1]) - (f[1] - c[1]) * (l[0] - c[0]);
  return t.flatMap((c) => {
    const f = e.filter((I) => I.factionId === c.id && !I.obscured);
    if (!f.length) return [];
    const l = f.flatMap((I) => Array.from({ length: 12 }, (M, L) => {
      const _ = L * Math.PI / 6;
      return [
        Math.max(1, Math.min(99, I.x + Math.cos(_) * 7)),
        Math.max(1, Math.min(99, I.y + Math.sin(_) * 9))
      ];
    })).sort((I, M) => I[0] - M[0] || I[1] - M[1]), y = (I) => {
      const M = [];
      for (const L of I) {
        for (; M.length > 1 && o(M[M.length - 2], M[M.length - 1], L) <= 0; ) M.pop();
        M.push(L);
      }
      return M.slice(0, -1);
    }, u = [...y(l), ...y([...l].reverse())], E = Math.min(...l.map((I) => I[1]));
    return [{
      id: c.id,
      name: c.name,
      color: c.color,
      points: u.map((I) => I.map((M) => M.toFixed(2)).join(",")).join(" "),
      labelX: (Math.min(...l.map((I) => I[0])) + Math.max(...l.map((I) => I[0]))) / 2,
      labelY: Math.max(3, E + 3)
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
function oi(e) {
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
function ci(e) {
  try {
    const t = as();
    return typeof (t == null ? void 0 : t.openBounty) == "function" && t.openBounty(String(e)) !== !1;
  } catch {
    return !1;
  }
}
const Ae = /* @__PURE__ */ new Map(), li = 40, di = 192;
function mi(e) {
  return new Promise((t, o) => {
    const c = new Image();
    c.onload = () => t(c), c.onerror = () => o(new Error("Image unavailable")), c.src = e;
  });
}
async function fi(e) {
  if (!e) return null;
  try {
    const t = await mi(e), o = Math.min(1, di / Math.max(t.naturalWidth || t.width, t.naturalHeight || t.height)), c = Math.max(2, Math.round((t.naturalWidth || t.width) * o)), f = Math.max(2, Math.round((t.naturalHeight || t.height) * o)), l = document.createElement("canvas");
    l.width = c, l.height = f;
    const y = l.getContext("2d", { willReadFrequently: !0 });
    if (!y) return null;
    y.drawImage(t, 0, 0, c, f);
    const u = y.getImageData(0, 0, c, f), E = y.createImageData(c, f), I = new Float32Array(c * f);
    for (let L = 0; L < I.length; L++) {
      const _ = L * 4;
      I[L] = u.data[_] * 0.299 + u.data[_ + 1] * 0.587 + u.data[_ + 2] * 0.114;
    }
    const M = (L, _) => I[_ * c + L];
    for (let L = 1; L < f - 1; L++)
      for (let _ = 1; _ < c - 1; _++) {
        const G = -M(_ - 1, L - 1) + M(_ + 1, L - 1) - 2 * M(_ - 1, L) + 2 * M(_ + 1, L) - M(_ - 1, L + 1) + M(_ + 1, L + 1), N = -M(_ - 1, L - 1) - 2 * M(_, L - 1) - M(_ + 1, L - 1) + M(_ - 1, L + 1) + 2 * M(_, L + 1) + M(_ + 1, L + 1), U = Math.hypot(G, N), oe = Math.max(0, Math.min(235, (U - 34) * 2.1)), P = (L * c + _) * 4;
        E.data[P] = 104, E.data[P + 1] = 241, E.data[P + 2] = 255, E.data[P + 3] = oe;
      }
    return y.clearRect(0, 0, c, f), y.putImageData(E, 0, 0), l.toDataURL("image/png");
  } catch {
    return null;
  }
}
function pi(e, t = "") {
  const o = `${t}\0${e}`, c = Ae.get(o);
  if (c)
    return Ae.delete(o), Ae.set(o, c), c;
  for (; Ae.size >= li; ) {
    const l = Ae.keys().next().value;
    if (l === void 0) break;
    Ae.delete(l);
  }
  const f = fi(e);
  return Ae.set(o, f), f;
}
function hi({ root: e, stage: t, resolveItems: o, onOpen: c }) {
  const f = e.querySelector("[data-intel-layer]");
  if (!f) return null;
  const l = new AbortController(), y = l.signal, u = document.createElement("aside");
  u.className = "gmf-intel-callout", u.setAttribute("aria-label", "Bounty intel"), u.hidden = !0, u.innerHTML = `
    <span class="gmf-intel-callout__connector" aria-hidden="true"></span>
    <div class="gmf-intel-callout__stack" data-intel-list role="group" aria-label="Matching bounties"></div>`, f.append(u);
  let E = [], I = null, M = null, L = null, _ = 0, G = 0;
  const N = () => {
    M && clearTimeout(M), M = null;
  }, U = () => {
    _++, L && clearTimeout(L), L = null, M = null, I = null, E = [], G++, u.hidden = !0, u.classList.remove("is-visible", "is-left");
  }, oe = (V = 180) => {
    N(), _++, L && clearTimeout(L), L = null, M = setTimeout(U, V);
  }, P = () => {
    if (!I || u.hidden) return;
    const V = t.getBoundingClientRect(), ie = I.getBoundingClientRect();
    u.style.setProperty("--gmf-intel-stack-height", `${Math.max(80, V.height - 72)}px`);
    const ne = u.offsetWidth || 224, C = u.offsetHeight || 126, A = ie.right - V.left + ne + 24 > V.width, ee = A ? ie.left - V.left - ne - 18 : ie.right - V.left + 18, K = Math.max(48, Math.min(V.height - C - 12, ie.top - V.top + ie.height / 2 - C / 2));
    u.classList.toggle("is-left", A), u.style.left = `${Math.max(8, ee)}px`, u.style.top = `${K}px`;
  }, Q = () => {
    const V = u.querySelector("[data-intel-list]");
    if (!V || !E.length) return U();
    V.replaceChildren();
    const ie = ++G;
    E.forEach((ne, C) => {
      const A = document.createElement("button");
      A.type = "button", A.className = "gmf-intel-callout__body", A.dataset.intelOpen = ne.id, A.style.setProperty("--gmf-intel-index", String(C)), A.style.setProperty("--gmf-intel-delay", `${C * 55}ms`), A.innerHTML = `
        <span class="gmf-intel-callout__portrait"><img alt="" hidden /><i class="fa-solid fa-crosshairs"></i></span>
        <span class="gmf-intel-callout__copy"><small></small><strong></strong><span></span></span>`;
      const ee = A.querySelector("strong"), K = A.querySelector("small"), te = A.querySelector(".gmf-intel-callout__copy > span"), se = A.querySelector("img"), ue = A.querySelector("i");
      ee && (ee.textContent = ne.name), K && (K.textContent = `BOUNTY // ${(ne.statusLabel || "INTEL").toUpperCase()}`), te && (te.textContent = ne.reward || ""), A.addEventListener("click", () => c(ne.id), { signal: y }), ne.image && se && (se.src = ne.image, se.classList.add("is-css-fallback"), se.hidden = !1, ue && (ue.hidden = !0), se.onerror = () => {
        ie === G && (se.hidden = !0, ue && (ue.hidden = !1));
      }, pi(ne.image, ne.id).then((he) => {
        !he || ie !== G || !A.isConnected || (se.classList.remove("is-css-fallback"), se.src = he);
      })), V.append(A);
    }), P();
  }, Z = async (V) => {
    N(), I = V;
    const ie = ++_;
    let ne = [];
    try {
      ne = await o(V.dataset.systemId ?? "");
    } catch {
    }
    if (!(ie !== _ || I !== V)) {
      if (!ne.length) return U();
      E = ne, u.hidden = !1, Q(), requestAnimationFrame(() => {
        P(), u.classList.add("is-visible");
      });
    }
  }, re = (V) => {
    N(), _++, L && clearTimeout(L), L = setTimeout(() => {
      L = null, Z(V);
    }, 90);
  };
  return e.querySelectorAll("[data-system-id]").forEach((V) => {
    V.addEventListener("pointerenter", () => re(V), { signal: y }), V.addEventListener("pointerleave", () => oe(), { signal: y }), V.addEventListener("focus", () => re(V), { signal: y }), V.addEventListener("blur", () => oe(), { signal: y }), V.addEventListener("pointerdown", () => U(), { signal: y });
  }), u.addEventListener("pointerenter", N, { signal: y }), u.addEventListener("pointerleave", () => oe(), { signal: y }), u.addEventListener("click", (V) => V.stopPropagation(), { signal: y }), t.addEventListener("wheel", () => requestAnimationFrame(P), { signal: y }), window.addEventListener("resize", P, { signal: y }), {
    dispose() {
      _++, M && clearTimeout(M), L && clearTimeout(L), l.abort(), u.remove();
    }
  };
}
function yi({ host: e }) {
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
    const M = t.offsetWidth || 180, L = t.offsetHeight || 24, _ = c.x + M + 76 > e.clientWidth, G = _ ? c.x - M - 64 : c.x + 64, N = Math.max(8, Math.min(e.clientHeight - L - 8, c.y - L / 2));
    t.classList.toggle("is-left", _), t.style.left = `${Math.max(8, G)}px`, t.style.top = `${N}px`;
  }, E = (M) => {
    l(), o = M;
    const L = t.querySelector("[data-location-name]");
    L && (L.textContent = M.missing ? "Missing linked scene" : M.accessible ? M.name : "Restricted location"), t.hidden = !1, u(), requestAnimationFrame(() => {
      u(), t.classList.add("is-visible");
    });
  }, I = (M = 180) => {
    l(), f = setTimeout(y, M);
  };
  return {
    show: E,
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
function gi(e, t, o) {
  const c = o.querySelector("[data-ship-layer]"), f = o.querySelector(".gmf-map-stage");
  if (!c || !f) return Promise.resolve();
  const l = f.getBoundingClientRect(), y = (t.x - e.x) * l.width / 100, u = (t.y - e.y) * l.height / 100, E = Math.atan2(u, y) * 180 / Math.PI, I = document.createElement("div");
  return I.className = "gmf-travel-ship", I.innerHTML = '<i class="fa-solid fa-rocket"></i>', I.style.left = `${e.x}%`, I.style.top = `${e.y}%`, I.style.setProperty("--gmf-ship-angle", `${E}deg`), c.replaceChildren(I), new Promise((M) => {
    let L = !1;
    const _ = () => {
      L || (L = !0, I.removeEventListener("transitionend", _), I.classList.add("is-arrived"), globalThis.setTimeout(() => {
        I.remove(), M();
      }, 260));
    };
    I.addEventListener("transitionend", _, { once: !0 }), requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        I.style.left = `${t.x}%`, I.style.top = `${t.y}%`;
      });
    }), globalThis.setTimeout(_, Yt);
  });
}
function Si(e) {
  var o, c;
  return (((c = (o = foundry.applications) == null ? void 0 : o.ux) == null ? void 0 : c.TextEditor) ?? globalThis.TextEditor).getDragEventData(e) ?? {};
}
async function rs(e) {
  var l, y, u, E, I, M, L, _;
  const t = Si(e), o = globalThis.fromUuid, c = t.uuid && o ? await o(t.uuid) : null;
  if (["Scene", "JournalEntry"].includes(c == null ? void 0 : c.documentName)) return c;
  const f = String(t.sceneId || t.journalId || t.id || "");
  return f ? t.type === "Scene" ? ((y = (l = game.scenes) == null ? void 0 : l.get) == null ? void 0 : y.call(l, f)) ?? null : ["JournalEntry", "Journal"].includes(t.type) ? ((E = (u = game.journal) == null ? void 0 : u.get) == null ? void 0 : E.call(u, f)) ?? null : ((M = (I = game.scenes) == null ? void 0 : I.get) == null ? void 0 : M.call(I, f)) ?? ((_ = (L = game.journal) == null ? void 0 : L.get) == null ? void 0 : _.call(L, f)) ?? null : null;
}
async function vi(e) {
  const t = await rs(e);
  return (t == null ? void 0 : t.documentName) === "Scene" ? t : null;
}
function Ii(e) {
  var ye;
  const {
    templateRoot: t,
    getRawMap: o,
    prepareMapForDisplay: c,
    upsertSystem: f,
    upsertObject: l,
    upsertRoute: y,
    upsertFaction: u,
    updateMapMetadata: E,
    deleteFaction: I,
    getTextureGuideMarkup: M,
    activateObjectEditorControls: L,
    revealSystemToPlayers: _,
    revealRouteToPlayers: G,
    hideSystemFromPlayers: N,
    setObjectVisibility: U,
    hideRouteFromPlayers: oe,
    deleteSystem: P,
    deleteObject: Q,
    deleteRoute: Z,
    setCurrentSystem: re,
    setCurrentObject: V,
    requestTravelToSystem: ie,
    requestTravelToObject: ne,
    exportMap: C,
    getTravelRoute: A,
    broadcastTravelAnimation: ee,
    broadcastObjectTravelAnimation: K,
    notifyInfo: te,
    notifyError: se,
    saveSystemPosition: ue,
    saveObjectPosition: he,
    savePlanetLocation: ke,
    removePlanetLocation: xe,
    unlinkPlanetScene: R,
    clearMapView: me
  } = e;
  return ye = class extends mt() {
    constructor(i = {}) {
      var r;
      const s = i.mapId, a = i.playerMode ?? !((r = game.user) != null && r.isGM);
      super({
        ...i,
        id: `galaxy-map-view-${a ? "player" : "gm"}-${s}`
      });
      X(this, "mapId");
      X(this, "playerMode");
      X(this, "selectedSystemId");
      X(this, "selectedRouteId");
      X(this, "activeSystemId");
      X(this, "selectedObjectId");
      X(this, "zoom");
      X(this, "panX");
      X(this, "panY");
      X(this, "_drag");
      X(this, "_contextTarget");
      X(this, "_boundContextClose");
      X(this, "externalFocus");
      X(this, "_externalFocusTimeout");
      X(this, "_pendingFocusZoom");
      X(this, "showTerritories", !0);
      X(this, "showRoutes", !0);
      X(this, "hardContrast", !1);
      X(this, "planetSystemId", null);
      X(this, "planetStatic", !1);
      X(this, "_planetStaticViewKey", null);
      X(this, "_planetRenderer", null);
      X(this, "_planetGeneration", 0);
      X(this, "_planetReturnFocus", !1);
      X(this, "_bountyIntelCallout", null);
      X(this, "_planetLocationCallout", null);
      X(this, "creationPanel", null);
      X(this, "factionRegistry", !1);
      X(this, "_selectionTimer", null);
      X(this, "_worldWidth", 0);
      X(this, "_worldHeight", 0);
      X(this, "_viewportResizeObserver", null);
      X(this, "_baseWindowHeight", null);
      this.mapId = s, this.playerMode = a, this.selectedSystemId = i.selectedSystemId ?? null, this.selectedRouteId = i.selectedRouteId ?? null, this.activeSystemId = i.activeSystemId ?? null, this.selectedObjectId = i.selectedObjectId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null, this.externalFocus = null, this._externalFocusTimeout = null, this._pendingFocusZoom = null;
    }
    get title() {
      const i = o(this.mapId), s = this.playerMode ? "Player View" : "GM View";
      return i ? `${i.title} - ${s}` : `Galaxy Map - ${s}`;
    }
    async _prepareContext(i) {
      var W, ge, fe, Se, J, de, Me, Le;
      const s = await super._prepareContext(i), a = o(this.mapId), r = a ? c(a, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      }) : null;
      r != null && r.systems && (r.systems = r.systems.map((x) => ({
        ...x,
        displayType: "system",
        factionName: "System",
        factionColor: "#58d8ff",
        animatedCelestial: !1,
        hasCustomMarker: !!x.displayMarkerImage
      })), r.selectedSystem && (r.selectedSystem = r.systems.find((x) => x.id === r.selectedSystem.id) ?? null)), r != null && r.systems && this.externalFocus && (r.systems = r.systems.map((x) => x.id === this.externalFocus.systemId ? { ...x, isExternalFocus: !0, externalFocus: this.externalFocus } : x), ((W = r.selectedSystem) == null ? void 0 : W.id) === this.externalFocus.systemId && (r.selectedSystem = r.systems.find((x) => x.id === this.externalFocus.systemId))), !this.activeSystemId && this.selectedSystemId && !(r != null && r.selectedSystem) && (this.selectedSystemId = null);
      const n = (r == null ? void 0 : r.systems.find((x) => x.id === this.activeSystemId)) ?? null;
      n && (r.backgroundImage = n.backgroundImage || "");
      const d = new Map(((r == null ? void 0 : r.factions) ?? []).map((x) => [x.id, x])), h = n ? n.objects.filter((x) => !this.playerMode || Re(n, x) === "players").map((x) => {
        var Tt;
        const ce = this.playerMode && x.status === "undiscovered", pe = d.get(x.factionId), _e = ce ? "" : x.markerImage;
        return {
          ...x,
          systemId: n.id,
          displayName: ce ? "???" : x.name,
          displayDescription: ce ? "Unresolved sensor contact. Details are not available." : x.description,
          displayType: ce ? "unknown" : x.kind,
          displayStatus: ce ? "undiscovered" : x.status,
          factionName: (pe == null ? void 0 : pe.name) ?? "Unaffiliated",
          factionColor: x.iconColor || (pe == null ? void 0 : pe.color) || "#58d8ff",
          displayMarkerImage: _e,
          hasCustomMarker: !!_e,
          obscured: ce,
          gmOnly: Re(n, x) === "gm",
          isSelected: x.id === this.selectedObjectId,
          isCurrent: ((Tt = r == null ? void 0 : r.currentLocation) == null ? void 0 : Tt.objectId) === x.id,
          animatedCelestial: !_e && tt.includes(x.iconStyle),
          hasJournal: !!(!ce && x.journalId),
          hasScenes: !!(!ce && x.sceneIds.length),
          showImage: !!(!ce && x.image),
          canInspectSystem: !!qe({ ...x, obscured: ce })
        };
      }) : [];
      n && this.selectedObjectId && !h.some((x) => x.id === this.selectedObjectId) && (this.selectedObjectId = null);
      const v = h.find((x) => x.id === this.selectedObjectId) ?? null, k = new Set(h.map((x) => x.id)), O = n ? (n.routes ?? []).filter((x) => (!this.playerMode || x.visibility === "players") && k.has(x.fromSystemId) && k.has(x.toSystemId)).map((x) => {
        const ce = h.find((_e) => _e.id === x.fromSystemId), pe = h.find((_e) => _e.id === x.toSystemId);
        return {
          ...x,
          from: ce,
          to: pe,
          fromName: (ce == null ? void 0 : ce.displayName) ?? x.fromSystemId,
          toName: (pe == null ? void 0 : pe.displayName) ?? x.toSystemId,
          isSelected: x.id === this.selectedRouteId,
          isActive: x.id === this.selectedRouteId,
          gmOnly: x.visibility === "gm"
        };
      }) : [], $ = O.find((x) => x.id === this.selectedRouteId) ?? null, F = h.find((x) => x.isCurrent) ?? null, H = v && F && v.id !== F.id ? O.find((x) => x.fromSystemId === F.id && x.toSystemId === v.id || x.toSystemId === F.id && x.fromSystemId === v.id) : null;
      v && (v.canTravel = !!H, v.isDestination = !!(H && !v.isCurrent), v.travelRouteId = (H == null ? void 0 : H.id) ?? ""), O.forEach((x) => {
        x.isActive = x.isSelected || x.id === (H == null ? void 0 : H.id);
      }), n && (r.systems = h, r.routes = O, r.selectedSystem = $ ? null : v, r.selectedRoute = $, r.currentSystem = F);
      const B = h.find((x) => x.id === this.planetSystemId) ?? (n ? null : r == null ? void 0 : r.systems.find((x) => x.id === this.planetSystemId)), m = !this.playerMode || (a == null ? void 0 : a.visibility) === "players" ? qe(B) : null;
      m || (this.planetSystemId = null);
      const g = B && m ? `${B.id}:${m.preset}` : null;
      g !== this._planetStaticViewKey && (this._planetStaticViewKey = g, this.planetStatic = !!(g && Ns(m == null ? void 0 : m.preset)));
      const b = B && m ? this._preparePlanetLocations(B, m.shape) : [], S = B ?? v, w = !!((ge = game.user) != null && ge.isGM && !this.playerMode && n && S), T = ((S == null ? void 0 : S.sceneIds) ?? []).map((x) => {
        var ce, pe;
        return (pe = (ce = game.scenes) == null ? void 0 : ce.get) == null ? void 0 : pe.call(ce, x);
      }).filter((x) => {
        var ce, pe;
        return x && (((ce = game.user) == null ? void 0 : ce.isGM) || ((pe = x.testUserPermission) == null ? void 0 : pe.call(x, game.user, "OBSERVER")));
      }).map((x) => ({ id: x.id, uuid: x.uuid, name: x.name || "Linked Scene" })), q = S != null && S.journalId ? (Se = (fe = game.journal) == null ? void 0 : fe.get) == null ? void 0 : Se.call(fe, S.journalId) : null, D = q && ((J = game.user) != null && J.isGM || (de = q.testUserPermission) != null && de.call(q, game.user, "OBSERVER")) ? { id: q.id, uuid: q.uuid, name: q.name || "Linked Journal" } : null, Y = this.creationPanel ? {
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
        systemOptions: (n ? h : (r == null ? void 0 : r.systems) ?? []).map((x) => ({ id: x.id, name: x.displayName || x.name })),
        factionOptions: ((r == null ? void 0 : r.factions) ?? []).map((x) => ({ id: x.id, name: x.name }))
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
        linkedPlanetScenes: T,
        linkedPlanetJournal: D,
        creationPanel: Y,
        factionRegistry: this.factionRegistry,
        appearanceGuideMarkup: Y != null && Y.isEntity ? M(Y.planetShape || "sphere") : "",
        showInspector: !!(Y || this.factionRegistry || m || r != null && r.selectedSystem || r != null && r.selectedRoute),
        territories: r ? ri(r.systems, r.factions) : [],
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
          const d = z(o(this.mapId)).systems.find((h) => h.id === this.externalFocus.systemId);
          d && this._centerOnSystem(d, a, this._pendingFocusZoom), this._pendingFocusZoom = null;
        }
        i.planetView ? this._mountPlanetRenderer(a, i.planetAppearance) : this._planetReturnFocus && ((n = a.querySelector("[data-action='inspect-system']")) == null || n.focus(), this._planetReturnFocus = !1);
      }
    }
    _attachPartListeners(i, s, a) {
      var h, v, k, O, $, F, H, B, m, g, b, S, w, T, q, D, Y, W, ge, fe, Se;
      const r = (h = s.matches) != null && h.call(s, ".gmf-map-stage") ? s : (v = s.querySelector) == null ? void 0 : v.call(s, ".gmf-map-stage, .gmf-planet-stage");
      if ((r == null ? void 0 : r.dataset.gmfMapBound) === "true") return;
      r && (r.dataset.gmfMapBound = "true");
      const n = (k = r == null ? void 0 : r.matches) != null && k.call(r, ".gmf-map-stage") ? r : null;
      super._attachPartListeners(i, s, a), We(this, s), this._attachPlanetListeners(s), this._attachCreationPanel(s);
      const d = s.querySelector(".gmf-object-appearance-panel");
      d && (L(d), this._attachAppearancePreview(s)), (O = s.querySelector("[data-action='toggle-territories']")) == null || O.addEventListener("click", () => {
        this.showTerritories = !this.showTerritories, this.render({ force: !0 });
      }), ($ = s.querySelector("[data-action='toggle-routes']")) == null || $.addEventListener("click", () => {
        this.showRoutes = !this.showRoutes, this.render({ force: !0 });
      }), (F = s.querySelector("[data-action='edit-current-layer']")) == null || F.addEventListener("click", () => {
        var J;
        !((J = game.user) != null && J.isGM) || this.playerMode || (this.activeSystemId ? this._openEditPanel("system", this.activeSystemId) : this._openCreationPanel("map", z(o(this.mapId)), this.mapId));
      }), (H = s.querySelector("[data-action='toggle-hard-contrast']")) == null || H.addEventListener("click", (J) => {
        var Me;
        this.hardContrast = !this.hardContrast;
        const de = (Me = s.matches) != null && Me.call(s, ".gmf-galaxy") ? s : s.querySelector(".gmf-galaxy");
        de == null || de.classList.toggle("is-hard-contrast", this.hardContrast), J.currentTarget.setAttribute("aria-pressed", String(this.hardContrast));
      }), this._applyViewportTransform(s), s.querySelectorAll("[data-system-id]").forEach((J) => {
        var de, Me;
        J.addEventListener("click", (Le) => {
          if (J.dataset.dragged === "true") {
            J.dataset.dragged = "false";
            return;
          }
          Le.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = globalThis.setTimeout(() => {
            this.activeSystemId ? this.selectedObjectId = J.dataset.systemId : this.selectedSystemId = J.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
          }, 180);
        }), J.addEventListener("dblclick", (Le) => {
          var ce;
          Le.preventDefault(), Le.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
          const x = J.dataset.systemId;
          if (this.selectedRouteId = null, this.creationPanel = null, this.activeSystemId) {
            this.selectedObjectId = x;
            const pe = (ce = z(o(this.mapId)).systems.find((_e) => _e.id === this.activeSystemId)) == null ? void 0 : ce.objects.find((_e) => _e.id === x);
            qe(pe) && (this.planetSystemId = x);
          } else
            this.selectedSystemId = x, this.activeSystemId = x, this.selectedObjectId = null;
          this.render({ force: !0 });
        }), !this.playerMode && ((de = game.user) != null && de.isGM) && ((Me = J.querySelector("[data-resize-marker]")) == null || Me.addEventListener("pointerdown", (Le) => this._startMarkerResize(Le, J)), J.addEventListener("pointerdown", (Le) => this._startSystemDrag(Le, s, J)));
      }), this._mountBountyIntelCallout(s), s.querySelectorAll("[data-route-id]").forEach((J) => {
        J.addEventListener("click", (de) => {
          var Me;
          if (de.stopPropagation(), this.selectedRouteId = J.dataset.routeId, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, !this.playerMode && ((Me = game.user) != null && Me.isGM)) {
            this._openEditPanel("route", J.dataset.routeId);
            return;
          }
          this.render({ force: !0 });
        });
      }), n == null || n.addEventListener("wheel", (J) => this._onWheelZoom(J, s), { passive: !1 }), n == null || n.addEventListener("pointerdown", (J) => this._startPan(J, s)), n == null || n.addEventListener("contextmenu", (J) => this._openContextMenu(J, s), { capture: !0 }), s.querySelectorAll("[data-context-action]").forEach((J) => {
        J.addEventListener("click", (de) => this._handleContextAction(de, s));
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
        this.activeSystemId && this.selectedObjectId ? U(this.mapId, this.activeSystemId, this.selectedObjectId, "players") : this.selectedSystemId && _(this.mapId, this.selectedSystemId);
      }), (w = s.querySelector("[data-action='hide-system']")) == null || w.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? U(this.mapId, this.activeSystemId, this.selectedObjectId, "gm") : this.selectedSystemId && N(this.mapId, this.selectedSystemId, !0);
      }), (T = s.querySelector("[data-action='delete-system']")) == null || T.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._confirmDeleteObject(this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), (q = s.querySelector("[data-action='set-current-system']")) == null || q.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? V(this.mapId, this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && re(this.mapId, this.selectedSystemId);
      }), (D = s.querySelector("[data-action='travel-to-system']")) == null || D.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? ie(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, s));
      }), (Y = s.querySelector("[data-action='travel-to-object']")) == null || Y.addEventListener("click", () => {
        !this.activeSystemId || !this.selectedObjectId || (this.playerMode ? ne(this.mapId, this.activeSystemId, this.selectedObjectId) : this._travelToObject(this.activeSystemId, this.selectedObjectId, s));
      }), (W = s.querySelector("[data-action='edit-route']")) == null || W.addEventListener("click", () => {
        this.selectedRouteId && this._openEditPanel("route", this.selectedRouteId);
      }), (ge = s.querySelector("[data-action='reveal-route']")) == null || ge.addEventListener("click", () => {
        this.selectedRouteId && G(this.mapId, this.selectedRouteId, this.activeSystemId ?? "");
      }), (fe = s.querySelector("[data-action='hide-route']")) == null || fe.addEventListener("click", () => {
        this.selectedRouteId && oe(this.mapId, this.selectedRouteId, !0, this.activeSystemId ?? "");
      }), (Se = s.querySelector("[data-action='delete-route']")) == null || Se.addEventListener("click", () => {
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
        const k = this._worldWidth * this.zoom, O = this._worldHeight * this.zoom;
        this.panX = k <= n.width ? (n.width - k) / 2 : le(this.panX, n.width - k, 0), this.panY = O <= n.height ? (n.height - O) / 2 : le(this.panY, n.height - O, 0), d && d.dataset.gmfWorldImageBound !== "true" && (d.dataset.gmfWorldImageBound = "true", d.addEventListener("load", () => this._applyViewportTransform(i), { once: !0 }));
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
      const n = i.getBoundingClientRect(), d = le(n.width / s, 240, window.innerHeight - 96);
      if (Math.abs(n.height - d) <= 2) return;
      const h = le(r.height + d - n.height, 320, window.innerHeight - 24);
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
      this.zoom = le(i, a, Ke), this._applyViewportTransform(s);
    }
    _mountBountyIntelCallout(i) {
      var r;
      if (this._bountyIntelCallout || i.querySelector(".gmf-intel-callout")) return;
      const s = (r = i.matches) != null && r.call(i, ".gmf-map-stage") ? i : i.querySelector(".gmf-map-stage"), a = i;
      !s || !a.querySelector("[data-intel-layer]") || (this._bountyIntelCallout = hi({
        root: a,
        stage: s,
        resolveItems: (n) => {
          var v;
          const d = z(o(this.mapId)), h = this.activeSystemId ? (v = d.systems.find((k) => k.id === this.activeSystemId)) == null ? void 0 : v.objects.find((k) => k.id === n) : d.systems.find((k) => k.id === n);
          return h ? oi(h) : [];
        },
        onOpen: (n) => ci(n)
      }));
    }
    _attachPlanetListeners(i) {
      var s, a, r, n, d, h;
      (s = i.querySelector("[data-action='inspect-system']")) == null || s.addEventListener("click", () => {
        var k, O;
        const v = o(this.mapId);
        if (!(this.playerMode && (v == null ? void 0 : v.visibility) !== "players")) {
          if (this.activeSystemId) {
            const F = (k = z(v).systems.find((H) => H.id === this.activeSystemId)) == null ? void 0 : k.objects.find((H) => H.id === this.selectedObjectId);
            if (!qe(F)) return;
            this.planetSystemId = this.selectedObjectId;
          } else {
            this.activeSystemId = this.selectedSystemId;
            const $ = z(v);
            this.selectedObjectId = ((O = $.systems.find((F) => F.id === this.activeSystemId)) == null ? void 0 : O.primaryObjectId) ?? null, this.planetSystemId = this.selectedObjectId;
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
      return ((s = z(o(this.mapId)).systems.find((a) => a.id === this.activeSystemId)) == null ? void 0 : s.objects.find((a) => a.id === this.planetSystemId)) ?? null;
    }
    _preparePlanetLocations(i, s) {
      return ((i == null ? void 0 : i.planetLocations) ?? []).filter((a) => a.shape === s).map((a) => {
        var d, h, v, k, O, $;
        const r = (h = (d = game.scenes) == null ? void 0 : d.get) == null ? void 0 : h.call(d, a.sceneId), n = !!(r && ((v = game.user) != null && v.isGM || (k = r.testUserPermission) != null && k.call(r, game.user, "OBSERVER")));
        return {
          ...a,
          name: r ? n || (O = game.user) != null && O.isGM ? r.name || "Linked Scene" : "Restricted location" : "Missing linked scene",
          accessible: n,
          missing: !r,
          canRemove: !!(($ = game.user) != null && $.isGM && !this.playerMode)
        };
      });
    }
    _getPlanetLocationItem(i) {
      var a;
      const s = this._getPlanetObject();
      return this._preparePlanetLocations(s, (a = qe(s)) == null ? void 0 : a.shape).find((r) => r.id === i) ?? null;
    }
    _attachPlanetLocationList(i) {
      var r;
      const s = this.element ?? i;
      i.querySelectorAll("[data-planet-scene-drag]").forEach((n) => n.addEventListener("dragstart", (d) => {
        d.dataTransfer && (d.dataTransfer.setData("text/plain", JSON.stringify({ type: "Scene", id: n.dataset.planetSceneDrag, uuid: n.dataset.planetSceneUuid })), d.dataTransfer.effectAllowed = "link");
      })), i.querySelectorAll("[data-unlink-planet-scene]").forEach((n) => n.addEventListener("click", async (d) => {
        var O, $, F;
        d.preventDefault(), d.stopPropagation();
        const h = n.dataset.unlinkPlanetScene ?? "", v = this.planetSystemId || this.selectedObjectId;
        if (!h || !this.activeSystemId || !v) return;
        const k = ((F = ($ = (O = game.scenes) == null ? void 0 : O.get) == null ? void 0 : $.call(O, h)) == null ? void 0 : F.name) || "Scene";
        await R(this.mapId, this.activeSystemId, v, h) && te(`${k} unlinked from this location.`);
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
        const h = await rs(n), v = (k = z(o(this.mapId)).systems.find((O) => O.id === this.activeSystemId)) == null ? void 0 : k.objects.find((O) => O.id === d);
        if (!h || !v) {
          se("Drop a Foundry Scene or Journal here.");
          return;
        }
        if (h.documentName === "Scene") {
          const O = [.../* @__PURE__ */ new Set([...v.sceneIds ?? [], h.id])];
          await l(this.mapId, this.activeSystemId, { ...v, sceneIds: O }), te(`${h.name || "Scene"} linked to ${v.name}.`);
        } else if (h.documentName === "JournalEntry")
          await l(this.mapId, this.activeSystemId, { ...v, journalId: h.id }), te(`${h.name || "Journal"} linked to ${v.name}.`);
        else {
          se("Drop a Foundry Scene or Journal here.");
          return;
        }
      }), (r = i.querySelector("[data-unlink-linked-journal]")) == null || r.addEventListener("click", async (n) => {
        var v;
        n.preventDefault(), n.stopPropagation();
        const d = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !d) return;
        const h = (v = z(o(this.mapId)).systems.find((k) => k.id === this.activeSystemId)) == null ? void 0 : v.objects.find((k) => k.id === d);
        h && await l(this.mapId, this.activeSystemId, { ...h, journalId: "" });
      }));
    }
    _openPlanetLocation(i) {
      var r, n, d;
      const s = this._getPlanetLocationItem(i), a = s ? (n = (r = game.scenes) == null ? void 0 : r.get) == null ? void 0 : n.call(r, s.sceneId) : null;
      if (!s || !a || !s.accessible) {
        se(s != null && s.missing ? "That location is unavailable." : "You do not have permission to view that scene.");
        return;
      }
      a.view ? a.view() : (d = a.sheet) == null || d.render(!0);
    }
    async _removePlanetLocation(i, s) {
      var r;
      if (!((r = game.user) != null && r.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const a = this._getPlanetLocationItem(i);
      !a || !await xe(this.mapId, this.activeSystemId, this.planetSystemId, i) || (this._syncPlanetLocations(s), te(`${a.name} removed from the surface.`));
    }
    async _clearPlanetLocations(i) {
      var r, n;
      if (!((r = game.user) != null && r.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const s = this._getPlanetObject(), a = this._preparePlanetLocations(s, (n = qe(s)) == null ? void 0 : n.shape);
      for (const d of a) await xe(this.mapId, this.activeSystemId, this.planetSystemId, d.id);
      this._syncPlanetLocations(i), a.length && te(`Cleared ${a.length} surface location${a.length === 1 ? "" : "s"}.`);
    }
    async _placePlanetLocation(i, s, a) {
      var h;
      if (!((h = game.user) != null && h.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const r = await vi(i);
      if (!r) {
        se("Drop a Foundry Scene onto the 3D surface.");
        return;
      }
      const n = this._getPlanetObject();
      if (!(n != null && n.sceneIds.includes(r.id))) {
        se(`Link ${r.name || "this scene"} to the object before placing it on the surface.`);
        return;
      }
      await ke(this.mapId, this.activeSystemId, this.planetSystemId, { ...s, sceneId: r.id }) && (this._syncPlanetLocations(a), te(`${r.name || "Scene"} placed on the ${s.shape}. Drag it again to move it.`));
    }
    _syncPlanetLocations(i) {
      var d, h, v;
      const s = this.element ?? i, a = this._getPlanetObject(), r = this._preparePlanetLocations(a, (d = qe(a)) == null ? void 0 : d.shape);
      (h = this._planetRenderer) == null || h.setLocations((a == null ? void 0 : a.planetLocations) ?? []);
      const n = s.querySelector("[data-planet-location-list]");
      n && (n.innerHTML = r.length ? r.map((k) => `
        <div class="gmf-planet-location-row ${k.accessible ? "" : "is-restricted"}" ${k.canRemove ? `draggable="true" data-planet-location-drag="${ve(k.id)}" title="Drag to the trash bin to remove"` : ""}>
          <button type="button" data-open-planet-location="${ve(k.id)}" ${k.accessible ? "" : "disabled"}><i class="fa-solid ${k.accessible ? "fa-location-dot" : "fa-lock"}"></i><span>${ve(k.name)}</span></button>
          ${k.canRemove ? `<button type="button" data-remove-planet-location="${ve(k.id)}" title="Remove location" aria-label="Remove ${ve(k.name)}"><i class="fa-solid fa-trash"></i></button>` : ""}
        </div>`).join("") : '<p class="gmf-planet-locations__empty">No surface locations placed.</p>', this._attachPlanetLocationList(n), (v = s.querySelector("[data-planet-location-removal]")) == null || v.toggleAttribute("hidden", r.length === 0));
    }
    refreshPlanetLocations(i, s) {
      this.activeSystemId !== i || this.planetSystemId !== s || this.element && this._syncPlanetLocations(this.element);
    }
    async focusSystem(i, s = {}) {
      var $;
      const a = z(o(this.mapId));
      if (!a.systems.find((F) => F.id === i)) return !1;
      const n = c(a, {
        playerMode: this.playerMode,
        selectedSystemId: i,
        selectedRouteId: null
      });
      if (!(($ = n == null ? void 0 : n.systems) != null && $.some((F) => F.id === i))) return !1;
      const d = String(s.focusId || i).slice(0, 80), h = ["distress", "warning", "objective", "custom"].includes(s.kind) ? s.kind : "custom", v = /^#[0-9a-f]{6}$/i.test(s.color ?? "") ? s.color : h === "distress" ? "#ff5c7a" : "#58d8ff", k = le(Number(s.duration) || 0, 0, 6e5), O = le(Number(s.zoom) || 1.45, Ze, Ke);
      return this.externalFocus = {
        id: d,
        systemId: i,
        kind: h,
        color: v,
        label: String(s.label || (h === "distress" ? "Distress signal" : "Signal located")).slice(0, 120)
      }, this.selectedSystemId = i, this.planetSystemId = null, this.selectedRouteId = null, this._pendingFocusZoom = O, this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, await this.render({ force: !0 }), this.bringToFront(), k > 0 && (this._externalFocusTimeout = globalThis.setTimeout(() => {
        var F;
        ((F = this.externalFocus) == null ? void 0 : F.id) === d && this.clearSystemFocus(d);
      }, k)), !0;
    }
    async focusLocation(i, s = "", a = {}) {
      const n = z(o(this.mapId)).systems.find((h) => h.id === i), d = (n == null ? void 0 : n.objects.find((h) => h.id === s)) ?? (n == null ? void 0 : n.objects.find((h) => h.id === n.primaryObjectId));
      return !n || !d || this.playerMode && (n.visibility !== "players" || Re(n, d) !== "players") ? !1 : (this.activeSystemId = n.id, this.selectedSystemId = n.id, this.selectedObjectId = d.id, this.selectedRouteId = null, this.planetSystemId = a.detail === !0 && qe(d) ? d.id : null, await this.render({ force: !0 }), this.bringToFront(), !0);
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
      const r = a.getBoundingClientRect(), n = this.zoom, d = s.querySelector(".gmf-map-background") ? 1 : Ze, h = le(n * Math.exp(-i.deltaY * 15e-4), d, Ke), v = i.clientX - r.left, k = i.clientY - r.top, O = (v - this.panX) / n, $ = (k - this.panY) / n;
      this.zoom = h, this.panX = v - O * h, this.panY = k - $ * h, this._applyViewportTransform(s);
    }
    _startPan(i, s) {
      if (i.button !== 0 || i.target.closest("[data-system-id], [data-route-id], button, input")) return;
      i.preventDefault();
      const a = i.clientX, r = i.clientY, n = this.panX, d = this.panY;
      let h = !1;
      const v = (O) => {
        h = h || Math.abs(O.clientX - a) > 3 || Math.abs(O.clientY - r) > 3, this.panX = n + O.clientX - a, this.panY = d + O.clientY - r, this._applyViewportTransform(s);
      }, k = () => {
        window.removeEventListener("pointermove", v), window.removeEventListener("pointerup", k), h || (this.selectedRouteId = null, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, this.render({ force: !0 }));
      };
      window.addEventListener("pointermove", v), window.addEventListener("pointerup", k, { once: !0 });
    }
    _startSystemDrag(i, s, a) {
      var H;
      if (i.button !== 0) return;
      i.preventDefault(), i.stopPropagation(), (H = a.setPointerCapture) == null || H.call(a, i.pointerId);
      const r = i.clientX, n = i.clientY;
      let d = this._pointerToMapPercent(i, s), h = !1, v = null;
      const k = Array.from(s.querySelectorAll(`[data-route-from="${a.dataset.systemId}"]`)), O = Array.from(s.querySelectorAll(`[data-route-to="${a.dataset.systemId}"]`)), $ = (B) => {
        const m = Math.abs(B.clientX - r), g = Math.abs(B.clientY - n);
        !h && m <= 4 && g <= 4 || (h = !0, a.classList.add("is-dragging"), d = this._pointerToMapPercent(B, s), a.dataset.dragged = "true", !v && (v = requestAnimationFrame(() => {
          v = null, a.style.left = `${d.x}%`, a.style.top = `${d.y}%`, this._updateConnectedRoutes(k, O, d.x, d.y);
        })));
      }, F = async () => {
        v && cancelAnimationFrame(v), a.classList.remove("is-dragging"), window.removeEventListener("pointermove", $), window.removeEventListener("pointerup", F), h && (a.style.left = `${d.x}%`, a.style.top = `${d.y}%`, this._updateConnectedRoutes(k, O, d.x, d.y), this.activeSystemId ? await he(this.mapId, this.activeSystemId, a.dataset.systemId, d.x, d.y) : await ue(this.mapId, a.dataset.systemId, d.x, d.y));
      };
      window.addEventListener("pointermove", $), window.addEventListener("pointerup", F, { once: !0 });
    }
    _startMarkerResize(i, s) {
      var $;
      if (i.button !== 0) return;
      i.preventDefault(), i.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
      const a = le(Number(s.dataset.iconSize) || 28, 18, 56), r = s.getBoundingClientRect(), n = r.left + r.width / 2, d = r.top + r.height / 2, h = Math.hypot(i.clientX - n, i.clientY - d);
      let v = a;
      s.dataset.dragged = "true", s.classList.add("is-resizing"), ($ = s.setPointerCapture) == null || $.call(s, i.pointerId);
      const k = (F) => {
        const H = Math.hypot(F.clientX - n, F.clientY - d);
        v = le(Math.round(a + (H - h) / Math.max(this.zoom, 0.01)), 18, 56), s.dataset.iconSize = String(v), s.style.setProperty("--gmf-system-size", `${v}px`);
      }, O = async () => {
        if (s.classList.remove("is-resizing"), window.removeEventListener("pointermove", k), window.removeEventListener("pointerup", O), window.removeEventListener("pointercancel", O), globalThis.setTimeout(() => {
          s.dataset.dragged = "false";
        }, 0), v !== a)
          if (this.activeSystemId) {
            const F = z(o(this.mapId)).systems.find((B) => B.id === this.activeSystemId), H = F == null ? void 0 : F.objects.find((B) => B.id === s.dataset.systemId);
            H && await l(this.mapId, this.activeSystemId, { ...H, iconSize: v });
          } else
            await f(this.mapId, { id: s.dataset.systemId, iconSize: v });
      };
      window.addEventListener("pointermove", k), window.addEventListener("pointerup", O, { once: !0 }), window.addEventListener("pointercancel", O, { once: !0 });
    }
    _pointerToMapPercent(i, s) {
      const r = s.querySelector(".gmf-map-stage").getBoundingClientRect();
      return {
        x: le((i.clientX - r.left - this.panX) / this.zoom / this._worldWidth * 100, 0, 100),
        y: le((i.clientY - r.top - this.panY) / this.zoom / this._worldHeight * 100, 0, 100)
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
      const h = d.offsetWidth || 184, v = d.offsetHeight || 260, O = s.querySelector(".gmf-map-stage").getBoundingClientRect(), $ = i.clientX - O.left, F = i.clientY - O.top, H = Math.max(4, O.width - h - 4), B = Math.max(4, O.height - v - 4);
      d.style.left = `${le($, 4, H)}px`, d.style.top = `${le(F, 4, B)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(s), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu(i = null) {
      const s = i ?? this.element ?? null, a = s == null ? void 0 : s.querySelector("[data-gmf-context-menu]");
      a && (a.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(i, s) {
      i.preventDefault(), i.stopPropagation();
      const a = i.currentTarget.dataset.contextAction, r = this._contextTarget;
      this._hideContextMenu(s), r && (a === "add-system" ? this._openCreationPanel("system", { x: r.position.x, y: r.position.y }) : a === "add-entity" ? this.activeSystemId && this._openCreationPanel("entity", { x: r.position.x, y: r.position.y }) : a === "manage-factions" ? (this.creationPanel = null, this.factionRegistry = !0, this.render({ force: !0 })) : a === "add-faction" ? this._openCreationPanel("faction") : a === "edit-map-details" ? this._openCreationPanel("map", z(o(this.mapId)), this.mapId) : a === "export-map" ? C(this.mapId) : a === "edit-system" ? this._openEditPanel("system", r.id) : a === "edit-entity" ? this.activeSystemId && this._openEditPanel("entity", r.id) : a === "add-route-from-marker" ? this._openCreationPanel("route", { fromSystemId: r.id }) : a === "reveal-system" ? await _(this.mapId, r.id) : a === "hide-system" ? await N(this.mapId, r.id, !0) : a === "delete-system" ? await this._confirmDeleteSystem(r.id) : a === "reveal-entity" ? this.activeSystemId && await U(this.mapId, this.activeSystemId, r.id, "players") : a === "hide-entity" ? this.activeSystemId && await U(this.mapId, this.activeSystemId, r.id, "gm") : a === "delete-entity" ? this.activeSystemId && await this._confirmDeleteObject(this.activeSystemId, r.id) : a === "edit-route" ? this._openEditPanel("route", r.id) : a === "reveal-route" ? await G(this.mapId, r.id, this.activeSystemId ?? "") : a === "hide-route" ? await oe(this.mapId, r.id, !0, this.activeSystemId ?? "") : a === "delete-route" && await this._confirmDeleteRoute(r.id));
    }
    async _confirmDeleteSystem(i) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, $e) && await P(this.mapId, i);
    }
    async _confirmDeleteObject(i, s) {
      await Dialog.confirm({ title: "Delete Location", content: "<p>Delete this location and its linked content?</p>" }) && (await Q(this.mapId, i, s), this.selectedObjectId = null);
    }
    _openCreationPanel(i, s = {}, a = null) {
      var v, k, O, $;
      if (!((v = game.user) != null && v.isGM) || this.playerMode) return;
      const r = z(o(this.mapId)), n = this.activeSystemId ? ((k = r.systems.find((F) => F.id === this.activeSystemId)) == null ? void 0 : k.objects) ?? [] : r.systems;
      if (i === "route" && n.length < 2) {
        se(this.activeSystemId ? "Create at least two locations before adding a route." : "Create at least two systems before adding a route.");
        return;
      }
      const d = s.fromSystemId || ((O = n[0]) == null ? void 0 : O.id) || "", h = i === "map" ? { title: "Galaxy Map", subtitle: "", description: "", backgroundImage: "", visibility: "players", travelApprovalMode: "unanimous" } : i === "system" ? { name: "New System", status: "known", visibility: "gm", description: "", markerImage: "", backgroundImage: "" } : i === "entity" ? {
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
          toSystemId: s.toSystemId || (($ = n.find((F) => F.id !== d)) == null ? void 0 : $.id) || ""
        }
      }, this.factionRegistry = !1, this.selectedSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null, this.render({ force: !0 });
    }
    _openEditPanel(i, s) {
      var n, d;
      const a = z(o(this.mapId)), r = i === "system" ? a.systems.find((h) => h.id === s) : i === "entity" ? (n = a.systems.find((h) => h.id === this.activeSystemId)) == null ? void 0 : n.objects.find((h) => h.id === s) : i === "route" ? this.activeSystemId ? (d = a.systems.find((h) => h.id === this.activeSystemId)) == null ? void 0 : d.routes.find((h) => h.id === s) : a.routes.find((h) => h.id === s) : a.factions.find((h) => h.id === s);
      r && this._openCreationPanel(i, r, s);
    }
    openEditor(i, s = {}) {
      var a;
      return !((a = game.user) != null && a.isGM) || this.playerMode ? !1 : (this._disposePlanetRenderer(), this.planetSystemId = null, i === "entity" ? (this.activeSystemId = s.systemId || this.activeSystemId, this.selectedSystemId = this.activeSystemId) : i === "route" ? this.activeSystemId = s.systemId || null : ["map", "system", "faction"].includes(i) && (this.activeSystemId = null), i === "map" ? this._openCreationPanel("map", z(o(this.mapId)), this.mapId) : s.id ? this._openEditPanel(i, s.id) : this._openCreationPanel(i, s.defaults || {}), !0);
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
          await Dialog.confirm({ title: "Delete Faction", content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>" }, $e) && (await I(this.mapId, d.dataset.deleteInlineFaction), this.factionRegistry = !0, this.render({ force: !0 }));
        });
      });
      const s = i.querySelector("[data-panel-create-form]");
      s && (ns(s), s.addEventListener("submit", async (d) => {
        d.preventDefault();
        const h = s.dataset.createKind || "", v = Object.fromEntries(new FormData(s).entries());
        i.querySelectorAll('[form="gmf-panel-editor-form"][name]').forEach((B) => {
          B instanceof HTMLInputElement && ["checkbox", "radio"].includes(B.type) && !B.checked || (v[B.name] = B.value);
        }), h === "entity" && (v.markerImage = v.useCustomMarker === "true" ? v.markerImage ?? "" : "", delete v.useCustomMarker);
        const k = Number(v.x), O = Number(v.y), $ = this.creationPanel, F = ($ == null ? void 0 : $.data) ?? {};
        $ != null && $.editId && (v.id = $.editId), this.creationPanel = null;
        let H = null;
        if (h === "map") H = await E(this.mapId, { ...F, ...v });
        else if (h === "system") H = await f(this.mapId, { ...F, ...v, x: k, y: O });
        else if (h === "entity" && this.activeSystemId) H = await l(this.mapId, this.activeSystemId, { ...F, ...v, x: k, y: O });
        else if (h === "route") {
          if (!v.fromSystemId || !v.toSystemId || v.fromSystemId === v.toSystemId) {
            se(`Choose two different ${this.activeSystemId ? "locations" : "systems"} for the route.`), this._openCreationPanel("route", { ...F, ...v }, ($ == null ? void 0 : $.editId) ?? null);
            return;
          }
          H = await y(this.mapId, { ...F, ...v }, this.activeSystemId ?? "");
        } else h === "faction" && (H = await u(this.mapId, { ...F, ...v }), this.factionRegistry = !0);
        H != null && H.id && (h === "system" && (this.selectedSystemId = H.id), h === "entity" && (this.selectedObjectId = H.id), h === "route" && (this.selectedRouteId = H.id)), this.render({ force: !0 });
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
        }, k = v("kind", "planet"), O = v("status", "known"), $ = v("iconStyle", k), F = v("markerImage", "").trim();
        s.className = `gmf-system gmf-system--${k} gmf-icon--${$} gmf-status--${O}${F ? " has-custom-marker" : ""}`, s.style.setProperty("--gmf-faction-color", v("iconColor", "#58d8ff")), s.style.setProperty("--gmf-system-size", "42px"), r && (r.textContent = v("name", "New Location"));
        const H = ++n;
        if (a && F) {
          const B = document.createElement("img");
          B.className = "gmf-custom-marker__image", B.src = F, B.alt = "", B.draggable = !1, a.replaceChildren(B);
        } else if (a && tt.includes($)) {
          const B = await globalThis.renderTemplate(`${t}/celestial-icon.hbs`, { system: { iconStyle: $ } });
          H === n && (a.innerHTML = B);
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
      }, $e) && await Z(this.mapId, i, this.activeSystemId ?? "");
    }
    async _travelToSystem(i, s) {
      const a = z(o(this.mapId)), r = a.systems.find((h) => h.id === a.currentSystemId), n = a.systems.find((h) => h.id === i);
      if (!n) return;
      if (!r) {
        await re(this.mapId, n.id), te(`Current location set to ${n.name}.`);
        return;
      }
      if (r.id === n.id) {
        te(`${n.name} is already the current location.`);
        return;
      }
      if (!A(a, r.id, n.id)) {
        se(`No direct route from ${r.name} to ${n.name}.`);
        return;
      }
      ee(this.mapId, r.id, n.id), await this._animateShipTravel(r, n, s), await re(this.mapId, n.id), te(`Arrived at ${n.name}.`);
    }
    async _travelToObject(i, s, a) {
      const r = z(o(this.mapId)), n = r.systems.find((k) => k.id === i), d = n == null ? void 0 : n.objects.find((k) => k.id === r.currentLocation.objectId), h = n == null ? void 0 : n.objects.find((k) => k.id === s);
      if (!n || !h) return;
      if (!d || r.currentLocation.systemId !== n.id) {
        await V(this.mapId, n.id, h.id), te(`Current location set to ${h.name}.`);
        return;
      }
      if (d.id === h.id) {
        te(`${h.name} is already the current location.`);
        return;
      }
      if (!A({ routes: n.routes }, d.id, h.id)) {
        se(`No direct route from ${d.name} to ${h.name}.`);
        return;
      }
      K(this.mapId, n.id, d.id, h.id), await this._animateShipTravel(d, h, a), await V(this.mapId, n.id, h.id), te(`Arrived at ${h.name}.`);
    }
    _animateShipTravel(i, s, a) {
      return gi(i, s, a);
    }
    _openLinkedJournal() {
      var a, r;
      const i = this._getSelectedRawSystem();
      if (!(i != null && i.journalId)) return;
      const s = (a = game.journal) == null ? void 0 : a.get(i.journalId);
      if (!s) {
        se(`Journal "${i.journalId}" was not found.`);
        return;
      }
      (r = s.sheet) == null || r.render(!0);
    }
    _getSelectedRawSystem() {
      var s;
      const i = z(o(this.mapId));
      return this.activeSystemId ? ((s = i.systems.find((a) => a.id === this.activeSystemId)) == null ? void 0 : s.objects.find((a) => a.id === this.selectedObjectId)) ?? null : i.systems.find((a) => a.id === this.selectedSystemId) ?? null;
    }
    async close(i = {}) {
      var s, a;
      return (s = this._bountyIntelCallout) == null || s.dispose(), this._bountyIntelCallout = null, this._disposePlanetRenderer(), this._hideContextMenu(), this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, (a = this._viewportResizeObserver) == null || a.disconnect(), this._viewportResizeObserver = null, me(this), super.close(i);
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
      var h, v, k;
      const a = i.querySelector("[data-planet-canvas]");
      if (!a || !s) return;
      this._setPlanetFallback(i, s);
      const r = this._planetGeneration, n = i.querySelector("[data-action='planet-static']"), d = i.querySelectorAll("[data-planet-control]");
      if (n) {
        const O = this.planetStatic ? "Enable 3D" : "Static view";
        n.setAttribute("title", O), n.setAttribute("aria-label", O), n.setAttribute("aria-pressed", String(this.planetStatic));
        const $ = n.querySelector("i");
        $ && ($.className = this.planetStatic ? "fa-solid fa-cube" : "fa-solid fa-image");
      }
      if (this.planetStatic) {
        d.forEach((O) => O.disabled = !0);
        return;
      }
      try {
        const { createPlanetRenderer: O } = await import("./chunks/planet-renderer-t-HvFdDj.js");
        if (r !== this._planetGeneration || !a.isConnected) return;
        d.forEach(($) => $.disabled = !1), this._planetRenderer = O(a, {
          texture: s.texture,
          color: s.color,
          appearancePreset: s.preset,
          shape: s.shape,
          finish: s.finish,
          detailStrength: s.detailStrength,
          locations: ((h = this._getPlanetObject()) == null ? void 0 : h.planetLocations) ?? [],
          canPlaceLocations: !!((v = game.user) != null && v.isGM && !this.playerMode),
          onLocationDrop: ($, F) => void this._placePlanetLocation($, F, i),
          onInvalidLocationDrop: () => se("Drop the scene directly onto the visible 3D surface."),
          onMarkerHover: ($) => {
            var H;
            const F = this._getPlanetLocationItem($.id);
            F && ((H = this._planetLocationCallout) == null || H.show(F));
          },
          onMarkerLeave: () => {
            var $;
            return ($ = this._planetLocationCallout) == null ? void 0 : $.scheduleHide();
          },
          onMarkerPosition: ($) => {
            var F;
            return (F = this._planetLocationCallout) == null ? void 0 : F.setAnchor($);
          },
          onMarkerOpen: ($) => this._openPlanetLocation($.id),
          onMarkerContextMenu: (k = game.user) != null && k.isGM && !this.playerMode ? ($) => void this._removePlanetLocation($.id, i) : null,
          isVisible: () => !this.minimized,
          onPaused: ($) => {
            const F = i.querySelector("[data-action='planet-pause']");
            if (F) {
              const H = $ ? "Resume rotation" : "Pause rotation";
              F.setAttribute("title", H), F.setAttribute("aria-label", H), F.setAttribute("aria-pressed", String($));
              const B = F.querySelector("i");
              B && (B.className = $ ? "fa-solid fa-play" : "fa-solid fa-pause");
            }
          },
          onStopped: () => {
            d.forEach(($) => $.disabled = !0);
          }
        }), this._planetLocationCallout = yi({ host: a });
      } catch {
        d.forEach((O) => O.disabled = !0);
      }
    }
  }, X(ye, "DEFAULT_OPTIONS", {
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
  }), X(ye, "PARTS", {
    main: {
      template: `${t}/galaxy-map.hbs`
    }
  }), ye;
}
function bi(e) {
  var l;
  const { templateRoot: t, getVisibleMaps: o, openMap: c, clearChooser: f } = e;
  return l = class extends mt() {
    async _prepareContext(u) {
      return { ...await super._prepareContext(u), maps: o() };
    }
    _attachPartListeners(u, E, I) {
      super._attachPartListeners(u, E, I), We(this, E), E.querySelectorAll("[data-player-open-map]").forEach((M) => {
        M.addEventListener("click", () => {
          c(M.dataset.playerOpenMap, { playerMode: !0 }), this.close();
        });
      });
    }
    async close(u = {}) {
      return f(this), super.close(u);
    }
  }, X(l, "DEFAULT_OPTIONS", {
    id: "galaxy-map-player-chooser",
    classes: ["galaxy-map", "galaxy-map-framework", "gmf-manager-window", "gmf-map-chooser-window"],
    window: { title: "Choose Galaxy Map", icon: "fa-solid fa-satellite", resizable: !0 },
    position: { width: 480, height: 420 }
  }), X(l, "PARTS", { main: { template: `${t}/player-map-chooser.hbs` } }), l;
}
const be = "galaxy-map", nt = "maps", Ue = "schemaV1Backup", at = "surfaceLocationRecoveryV2", Ie = `module.${be}`, Ee = `modules/${be}/templates`;
function wi(e) {
  return e.visibility === "players";
}
function Mi(e, t) {
  return t && e.status === "undiscovered";
}
function Li(e, t) {
  return t === "planet" ? { station: "station", anomaly: "diamond", ruins: "diamond", unknown: "diamond" }[e] ?? t : t;
}
function _i(e, { playerMode: t = !1, selectedSystemId: o = null, selectedRouteId: c = null } = {}) {
  var U, oe;
  const f = z(e), l = t ? f.systems.filter(wi) : f.systems, y = new Set(l.map((P) => P.id)), u = t ? f.factions.filter((P) => P.visibility === "players") : f.factions, E = new Map(u.map((P) => [P.id, P])), I = l.map((P) => {
    const Q = E.get(P.factionId), Z = Mi(P, t), re = Z ? "unknown" : P.type, V = Z ? "diamond" : Li(re, P.iconStyle), ie = Z ? "" : P.markerImage;
    return {
      ...P,
      image: P.image,
      sceneIds: [...P.sceneIds],
      journalId: P.journalId,
      planetPreset: P.planetPreset,
      planetShape: P.planetShape,
      planetTexture: P.planetTexture,
      planetColor: P.planetColor,
      iconStyle: V,
      displayMarkerImage: ie,
      hasCustomMarker: !!ie,
      displayName: Z ? "???" : P.name,
      displayDescription: Z ? "Unresolved sensor contact. Details are not available." : P.description,
      displayType: re,
      displayStatus: Z ? "undiscovered" : P.status,
      factionName: (Q == null ? void 0 : Q.name) ?? "Unaffiliated",
      factionColor: P.iconColor || (Q == null ? void 0 : Q.color) || "#58d8ff",
      obscured: Z,
      isCurrent: P.id === f.currentSystemId,
      isSelected: P.id === o,
      gmOnly: P.visibility === "gm",
      animatedCelestial: !ie && tt.includes(V),
      hasAlert: ["danger", "locked"].includes(Z ? "undiscovered" : P.status),
      alertLabel: P.status === "danger" ? "Hazard advisory" : P.status === "locked" ? "Restricted access" : "",
      hasJournal: !!(!Z && P.journalId),
      hasScenes: !!(!Z && P.sceneIds.length),
      showImage: !!(!Z && P.image),
      canInspectSystem: !!qe({ ...P, obscured: Z })
    };
  }), M = f.routes.filter((P) => !t || P.visibility === "players").filter((P) => y.has(P.fromSystemId) && y.has(P.toSystemId)).map((P) => {
    const Q = I.find((re) => re.id === P.fromSystemId), Z = I.find((re) => re.id === P.toSystemId);
    return {
      ...P,
      from: Q,
      to: Z,
      fromName: (Q == null ? void 0 : Q.displayName) ?? P.fromSystemId,
      toName: (Z == null ? void 0 : Z.displayName) ?? P.toSystemId,
      isSelected: P.id === c,
      connectsCurrent: P.fromSystemId === f.currentSystemId || P.toSystemId === f.currentSystemId,
      gmOnly: P.visibility === "gm"
    };
  }), L = M.find((P) => P.id === c) ?? null, _ = L ? null : I.find((P) => P.id === o) ?? null;
  _ && (_.isSelected = !0);
  const G = I.find((P) => P.id === f.currentSystemId) ?? I[0] ?? null, N = _ && G && _.id !== G.id ? M.find((P) => P.fromSystemId === G.id && P.toSystemId === _.id || P.toSystemId === G.id && P.fromSystemId === _.id) : null;
  return _ && (_.canTravel = !!N, _.travelRouteId = (N == null ? void 0 : N.id) ?? "", _.isCurrent = _.id === (G == null ? void 0 : G.id), _.isDestination = !!(N && !_.isCurrent)), M.forEach((P) => {
    P.isActive = P.isSelected || P.id === (N == null ? void 0 : N.id);
  }), {
    ...f,
    systems: I,
    routes: M,
    factions: u,
    selectedSystem: _,
    selectedRoute: L,
    currentSystem: G,
    selectedType: L ? "route" : _ ? "system" : null,
    playerMode: t,
    isGM: ((U = game.user) == null ? void 0 : U.isGM) ?? !1,
    canEdit: ((oe = game.user) == null ? void 0 : oe.isGM) && !t
  };
}
function Ti(e) {
  var f;
  if (!e) return null;
  const t = z(e), o = new Map(t.systems.map((l) => [l.id, l])), c = new Map(t.factions.map((l) => [l.id, l]));
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
          var E, I;
          return {
            ...u,
            systemId: l.id,
            scopeLabel: `Inside ${l.name}`,
            fromName: ((E = y.get(u.fromSystemId)) == null ? void 0 : E.name) ?? u.fromSystemId,
            toName: ((I = y.get(u.toSystemId)) == null ? void 0 : I.name) ?? u.toSystemId
          };
        });
      })
    ]
  };
}
function xi(e) {
  ns(e), e.querySelectorAll("[data-use-custom-marker]").forEach((G) => {
    const N = (G.closest("form") ?? e).querySelector("[data-custom-marker-field]"), U = (N == null ? void 0 : N.querySelector('[name="markerImage"]')) ?? null, oe = (N == null ? void 0 : N.querySelectorAll("button")) ?? [], P = () => {
      const Q = G.checked;
      N == null || N.classList.toggle("is-disabled", !Q), U && (U.disabled = !Q), oe.forEach((Z) => {
        Z.disabled = !Q;
      }), !Q && (U != null && U.value) && (U.value = "", U.dispatchEvent(new Event("input", { bubbles: !0 })), U.dispatchEvent(new Event("change", { bubbles: !0 })));
    };
    G.addEventListener("change", P), P();
  });
  const t = e.querySelector("[data-texture-upload-fields]"), o = e.querySelector('[name="planetTexture"]'), c = e.querySelector('[name="planetPreset"]'), f = e.querySelector('[name="planetShape"]'), l = e.querySelector('[name="planetFinish"]'), y = e.querySelector('[name="planetColor"]'), u = e.querySelector("[data-texture-guide]"), E = e.querySelector("[data-texture-guide-section]"), I = e.querySelectorAll("[data-texture-guide-preview]"), M = () => {
    if (!c || !f) return;
    const G = Ht(c.value, f.value);
    c.replaceChildren(...zt(f.value).map((N) => {
      const U = document.createElement("option");
      return U.value = N.value, U.textContent = N.label, U;
    })), c.value = G;
  }, L = () => {
    const G = (c == null ? void 0 : c.value) === "custom", N = (c == null ? void 0 : c.value) === "none";
    return t && (t.hidden = !G), E && (E.hidden = !G), o && (o.required = G), f && (f.disabled = N), l && (l.disabled = N), y && (y.disabled = (c == null ? void 0 : c.value) !== "color"), G;
  }, _ = () => {
    var N;
    if (!u) return;
    const G = (N = o == null ? void 0 : o.value) == null ? void 0 : N.trim();
    G ? u.dataset.hasTexture = "true" : delete u.dataset.hasTexture, I.forEach((U) => {
      U.onerror = G ? () => {
        U.hidden = !0;
      } : null, U.hidden = !G, G ? U.src = G : U.removeAttribute("src");
    });
  };
  c == null || c.addEventListener("change", () => {
    !L() && (o != null && o.value) && (o.value = "", o.dispatchEvent(new Event("change", { bubbles: !0 })));
  }), o == null || o.addEventListener("change", _), f == null || f.addEventListener("change", () => {
    u && (u.dataset.shape = f.value), M(), L();
  }), M(), L(), _();
}
function Ei(e) {
  const { notifyError: t, notifyInfo: o, requireGM: c, refreshOpenApps: f, closeOpenMap: l, getOpenMapViews: y } = e, u = (m) => foundry.utils.deepClone(m), E = (m) => game.socket.emit(Ie, { action: "refresh", mapId: m });
  function I() {
    return u(game.settings.get(be, nt) ?? {});
  }
  async function M(m) {
    return c("save galaxy map data") && await game.settings.set(be, nt, m ?? {}), m;
  }
  function L(m) {
    const g = I();
    return g[m] ? u(g[m]) : null;
  }
  async function _(m, g, { refresh: b = !0 } = {}) {
    return m[g] = z(m[g]), await M(m), b && f(g), E(g), m[g];
  }
  async function G(m = {}) {
    if (!c("create galaxy maps")) return null;
    const g = I(), b = z(m);
    return g[b.id] = b, await M(g), f(b.id), u(b);
  }
  async function N(m, g = {}) {
    if (!c("update galaxy maps")) return null;
    const b = I();
    if (!b[m])
      return t(`Map "${m}" was not found.`), null;
    const S = z({ ...g, id: m });
    return b[m] = S, await M(b), f(m), u(S);
  }
  async function U(m, g = {}) {
    const b = L(m);
    return !c("update galaxy map metadata") || !b ? (b || t(`Map "${m}" was not found.`), null) : N(m, {
      ...b,
      title: g.title,
      subtitle: g.subtitle,
      description: g.description,
      backgroundImage: g.backgroundImage,
      visibility: g.visibility,
      travelApprovalMode: g.travelApprovalMode
    });
  }
  async function oe(m) {
    if (!c("delete galaxy maps")) return !1;
    const g = I();
    return g[m] ? (delete g[m], await M(g), l(m), f(), !0) : !1;
  }
  async function P(m) {
    if (!c("duplicate galaxy maps")) return null;
    const g = L(m);
    if (!g)
      return t(`Map "${m}" was not found.`), null;
    const b = z({ ...g, id: Te("map"), title: `${g.title} Copy` }), S = I();
    return S[b.id] = b, await M(S), f(b.id), u(b);
  }
  async function Q(m, g = {}) {
    var fe;
    if (!c("save star systems")) return null;
    const b = I();
    if (!b[m])
      return t(`Map "${m}" was not found.`), null;
    const S = z(b[m]), w = S.systems.find((Se) => Se.id === g.id), T = g.objects ?? (w == null ? void 0 : w.objects) ?? [], q = (w == null ? void 0 : w.primaryObjectId) || ((fe = T[0]) == null ? void 0 : fe.id), D = ["image", "sceneIds", "planetLocations", "journalId", "planetPreset", "planetShape", "planetFinish", "planetTexture", "planetColor"], Y = T.map((Se) => Se.id !== q ? Se : kt({
      ...Se,
      ...Object.fromEntries(D.filter((J) => g[J] !== void 0).map((J) => [J, g[J]]))
    })), W = Zt({ ...w, ...g, objects: Y }), ge = S.systems.findIndex((Se) => Se.id === W.id);
    return ge >= 0 ? S.systems[ge] = W : S.systems.push(W), b[m] = S, await _(b, m), u(W);
  }
  async function Z(m, g, b = {}) {
    if (!c("save locations")) return null;
    const S = I(), w = S[m] ? z(S[m]) : null, T = w == null ? void 0 : w.systems.find((Y) => Y.id === g);
    if (!w || !T) return null;
    const q = kt(b), D = T.objects.findIndex((Y) => Y.id === q.id);
    return D >= 0 ? T.objects[D] = q : T.objects.push(q), T.primaryObjectId || (T.primaryObjectId = q.id), S[m] = w, await _(S, m), u(q);
  }
  const re = (m, g, b) => {
    var S;
    for (const w of y(m)) (S = w.refreshPlanetLocations) == null || S.call(w, g, b);
  };
  async function V(m, g, b, S = {}) {
    var ge;
    if (!c("place surface locations")) return null;
    const w = I(), T = w[m] ? z(w[m]) : null, q = (ge = T == null ? void 0 : T.systems.find((fe) => fe.id === g)) == null ? void 0 : ge.objects.find((fe) => fe.id === b);
    if (!T || !q) return null;
    const D = String(S.sceneId || "");
    if (!q.sceneIds.includes(D))
      return t("Only scenes linked to this object can be placed on its surface."), null;
    const Y = Wt(S), W = q.planetLocations.findIndex((fe) => fe.sceneId === D && fe.shape === Y.shape);
    return W >= 0 && (Y.id = q.planetLocations[W].id), W >= 0 ? q.planetLocations[W] = Y : q.planetLocations.push(Y), w[m] = z(T), await M(w), re(m, g, b), game.socket.emit(Ie, { action: "planet-locations", mapId: m, systemId: g, objectId: b }), u(Y);
  }
  async function ie(m, g, b, S) {
    var Y;
    if (!c("remove surface locations")) return !1;
    const w = I(), T = w[m] ? z(w[m]) : null, q = (Y = T == null ? void 0 : T.systems.find((W) => W.id === g)) == null ? void 0 : Y.objects.find((W) => W.id === b);
    if (!T || !q) return !1;
    const D = q.planetLocations.length;
    return q.planetLocations = q.planetLocations.filter((W) => W.id !== S), q.planetLocations.length === D ? !1 : (w[m] = z(T), await M(w), re(m, g, b), game.socket.emit(Ie, { action: "planet-locations", mapId: m, systemId: g, objectId: b }), !0);
  }
  async function ne(m, g, b, S) {
    var T, q;
    if (!c("unlink scenes from locations")) return !1;
    const w = (q = (T = L(m)) == null ? void 0 : T.systems.find((D) => D.id === g)) == null ? void 0 : q.objects.find((D) => D.id === b);
    return w != null && w.sceneIds.includes(S) ? !!await Z(m, g, { ...w, sceneIds: w.sceneIds.filter((D) => D !== S) }) : !1;
  }
  async function C(m, g, b) {
    var q;
    if (!c("delete locations")) return !1;
    const S = I(), w = S[m] ? z(S[m]) : null, T = w == null ? void 0 : w.systems.find((D) => D.id === g);
    return !w || !T ? !1 : (T.objects = T.objects.filter((D) => D.id !== b), T.primaryObjectId === b && (T.primaryObjectId = ((q = T.objects[0]) == null ? void 0 : q.id) ?? ""), w.currentLocation.objectId === b && (w.currentLocation.objectId = T.primaryObjectId), S[m] = w, await _(S, m), !0);
  }
  async function A(m, g, b) {
    var Y;
    if (!c("move locations")) return null;
    const S = I(), w = S[m] ? z(S[m]) : null, T = w == null ? void 0 : w.systems.find((W) => W.objects.some((ge) => ge.id === g)), q = w == null ? void 0 : w.systems.find((W) => W.id === b), D = T == null ? void 0 : T.objects.find((W) => W.id === g);
    return !w || !T || !q || !D ? null : (T.objects = T.objects.filter((W) => W.id !== g), q.objects.push(D), T.primaryObjectId === g && (T.primaryObjectId = ((Y = T.objects[0]) == null ? void 0 : Y.id) ?? ""), q.primaryObjectId || (q.primaryObjectId = g), w.currentLocation.objectId === g && (w.currentLocation.systemId = q.id), S[m] = w, await _(S, m), u(D));
  }
  async function ee(m, g, b) {
    if (!c("set the arrival object")) return null;
    const S = I(), w = S[m] ? z(S[m]) : null, T = w == null ? void 0 : w.systems.find((q) => q.id === g);
    return !w || !(T != null && T.objects.some((q) => q.id === b)) ? null : (T.primaryObjectId = b, w.currentLocation.systemId === g && !w.currentLocation.objectId && (w.currentLocation.objectId = b), S[m] = w, await _(S, m), u(T));
  }
  async function K(m, g, b, S, w) {
    var Y;
    const T = I(), q = T[m] ? z(T[m]) : null, D = (Y = q == null ? void 0 : q.systems.find((W) => W.id === g)) == null ? void 0 : Y.objects.find((W) => W.id === b);
    return !q || !D ? null : (D.x = le(we(S, D.x), 0, 100), D.y = le(we(w, D.y), 0, 100), T[m] = q, await _(T, m), u(D));
  }
  async function te(m, g, b, S) {
    var D;
    if (!c("change object visibility")) return null;
    const w = I(), T = w[m] ? z(w[m]) : null, q = (D = T == null ? void 0 : T.systems.find((Y) => Y.id === g)) == null ? void 0 : D.objects.find((Y) => Y.id === b);
    return !T || !q ? null : (q.visibility = Ut.includes(S) ? S : "inherit", q.visibility === "players" && ["undiscovered", "locked"].includes(q.status) && (q.status = "known"), w[m] = T, await _(w, m), u(q));
  }
  async function se(m, g) {
    var w;
    if (!c("delete star systems")) return !1;
    const b = I(), S = b[m];
    return S ? (S.systems = S.systems.filter((T) => T.id !== g), S.routes = S.routes.filter((T) => T.fromSystemId !== g && T.toSystemId !== g), S.currentSystemId === g && (S.currentSystemId = ((w = S.systems[0]) == null ? void 0 : w.id) ?? ""), await _(b, m), !0) : !1;
  }
  async function ue(m, g) {
    if (!c("set current location")) return null;
    const b = I(), S = b[m] ? z(b[m]) : null, w = S == null ? void 0 : S.systems.find((T) => T.id === g);
    return !S || !w ? (t(`System "${g}" was not found.`), null) : (S.currentSystemId = g, b[m] = S, await _(b, m), u(w));
  }
  async function he(m, g, b) {
    if (!c("set current location")) return null;
    const S = I(), w = S[m] ? z(S[m]) : null, T = w == null ? void 0 : w.systems.find((D) => D.id === g), q = T == null ? void 0 : T.objects.find((D) => D.id === b);
    return !w || !T || !q ? null : (w.currentSystemId = g, w.currentLocation = { systemId: g, objectId: b }, S[m] = w, await _(S, m), u(q));
  }
  async function ke(m, g = {}, b = "") {
    var Y;
    if (!c("save routes")) return null;
    const S = I(), w = S[m], T = b ? (Y = w == null ? void 0 : w.systems) == null ? void 0 : Y.find((W) => W.id === b) : w;
    if (!w || !T)
      return t(b ? `System "${b}" was not found.` : `Map "${m}" was not found.`), null;
    Array.isArray(T.routes) || (T.routes = []);
    const q = dt(g);
    if (!q.fromSystemId || !q.toSystemId || q.fromSystemId === q.toSystemId)
      return t("Routes require two different systems."), null;
    const D = T.routes.findIndex((W) => W.id === q.id);
    return D >= 0 ? T.routes[D] = q : T.routes.push(q), await _(S, m), u(q);
  }
  async function xe(m, g, b = "") {
    var q;
    if (!c("delete routes")) return !1;
    const S = I(), w = S[m], T = b ? (q = w == null ? void 0 : w.systems) == null ? void 0 : q.find((D) => D.id === b) : w;
    return T ? (T.routes = (T.routes ?? []).filter((D) => D.id !== g), await _(S, m), !0) : !1;
  }
  async function R(m, g = {}) {
    if (!c("save factions")) return null;
    const b = I(), S = b[m];
    if (!S)
      return t(`Map "${m}" was not found.`), null;
    const w = Kt(g), T = S.factions.findIndex((q) => q.id === w.id);
    return T >= 0 ? S.factions[T] = w : S.factions.push(w), await _(b, m), u(w);
  }
  async function me(m, g) {
    if (!c("delete factions")) return !1;
    const b = I(), S = b[m];
    if (!S) return !1;
    S.factions = S.factions.filter((w) => w.id !== g);
    for (const w of S.systems) {
      w.factionId === g && (w.factionId = "");
      for (const T of w.objects ?? []) T.factionId === g && (T.factionId = "");
    }
    return await _(b, m), !0;
  }
  async function ye(m, g, b, S, w = "") {
    var ge, fe, Se, J;
    if (!c(`${S ? "hide" : "reveal"} ${{ faction: "factions", system: "star systems", route: "routes" }[g]}`)) return null;
    const q = I(), D = q[m], Y = w ? (ge = D == null ? void 0 : D.systems) == null ? void 0 : ge.find((de) => de.id === w) : D, W = g === "faction" ? (fe = D == null ? void 0 : D.factions) == null ? void 0 : fe.find((de) => de.id === b) : g === "system" ? (Se = D == null ? void 0 : D.systems) == null ? void 0 : Se.find((de) => de.id === b) : (J = Y == null ? void 0 : Y.routes) == null ? void 0 : J.find((de) => de.id === b);
    return !D || !W ? (t(`${g[0].toUpperCase()}${g.slice(1)} "${b}" was not found.`), null) : (W.visibility = S ? "gm" : "players", g === "system" && !S && ["undiscovered", "locked"].includes(W.status) && (W.status = "known"), await _(q, m), u(W));
  }
  async function p(m, g, b = !0) {
    const S = await ye(m, "faction", g, b);
    return S && o(`${S.name} ${b ? "hidden from" : "visible to"} players.`), S;
  }
  async function j(m, g, { notify: b = !0 } = {}) {
    const S = await ye(m, "system", g, !1);
    return S ? (b && n(m, S.id), o(`${S.name} revealed to players.`), S) : null;
  }
  async function i(m, g, b = !0) {
    const S = await ye(m, "system", g, b);
    return S && o(`${S.name} ${b ? "hidden from" : "visible to"} players.`), S;
  }
  async function s(m, g, b = "") {
    const S = await ye(m, "route", g, !1, b);
    return S && o("Route revealed to players."), S;
  }
  async function a(m, g, b = !0, S = "") {
    const w = await ye(m, "route", g, b, S);
    return w && o(`Route ${b ? "hidden from" : "visible to"} players.`), w;
  }
  async function r(m, g, b, S) {
    var D;
    if (!c("move star systems")) return null;
    const w = I(), T = w[m], q = (D = T == null ? void 0 : T.systems) == null ? void 0 : D.find((Y) => Y.id === g);
    return q ? (q.x = le(we(b, q.x), 0, 100), q.y = le(we(S, q.y), 0, 100), await _(w, m, { refresh: !1 }), u(q)) : (t(`System "${g}" was not found.`), null);
  }
  function n(m, g) {
    var S, w;
    if (!c("notify players about discoveries")) return;
    const b = (w = (S = L(m)) == null ? void 0 : S.systems) == null ? void 0 : w.find((T) => T.id === g);
    if (!b) {
      t(`System "${g}" was not found.`);
      return;
    }
    game.socket.emit(Ie, { action: "notify", mapId: m, systemId: g, message: `New System Discovered: ${b.name}` }), o(`Discovery notification sent: ${b.name}.`);
  }
  async function d(m, { replace: g = !1 } = {}) {
    if (!c("import galaxy maps")) return null;
    const b = I();
    let S = z(m);
    return b[S.id] && !g && (S = z({ ...S, id: Te("map"), title: `${S.title} Import` })), b[S.id] = S, await M(b), f(S.id), o(`Imported ${S.title}.`), u(S);
  }
  function h(m) {
    const g = L(m);
    if (!g) {
      t(`Map "${m}" was not found.`);
      return;
    }
    ii(`${si(g.title)}.json`, z(g));
  }
  const v = () => Object.values(I()).map(z), k = (m, g) => u(z(L(m)).systems.find((b) => b.id === String(g)) ?? null);
  function O(m, g) {
    const b = z(L(m));
    for (const S of b.systems) {
      const w = S.objects.find((T) => T.id === String(g));
      if (w) return { systemId: S.id, object: u(w) };
    }
    return null;
  }
  const $ = (m, g) => {
    const b = z(L(m)).systems.find((S) => S.id === String(g));
    return [...new Set((b == null ? void 0 : b.objects.flatMap((S) => S.sceneIds)) ?? [])];
  }, F = (m, g) => {
    var b;
    return [...((b = O(m, g)) == null ? void 0 : b.object.sceneIds) ?? []];
  };
  function H(m) {
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
    updateMap: N,
    updateMapMetadata: U,
    deleteMap: oe,
    duplicateMap: P,
    upsertSystem: Q,
    upsertObject: Z,
    savePlanetLocation: V,
    removePlanetLocation: ie,
    unlinkPlanetScene: ne,
    deleteObject: C,
    moveObject: A,
    setPrimaryObject: ee,
    saveObjectPosition: K,
    setObjectVisibility: te,
    deleteSystem: se,
    setCurrentSystem: ue,
    setCurrentObject: he,
    upsertRoute: ke,
    deleteRoute: xe,
    upsertFaction: R,
    deleteFaction: me,
    hideFactionFromPlayers: p,
    saveSystemPosition: r,
    revealSystemToPlayers: j,
    hideSystemFromPlayers: i,
    revealRouteToPlayers: s,
    hideRouteFromPlayers: a,
    notifySystemDiscovered: n,
    importMapData: d,
    exportMap: h,
    getMaps: v,
    getSystem: k,
    getObject: O,
    getSceneIdsForSystem: $,
    getSceneIdsForObject: F,
    getObjectsForScene: H,
    getSystemsForScene: B,
    updateOpenPlanetLocations: re
  };
}
function Pi(e) {
  const {
    getRawMap: t,
    setCurrentSystem: o,
    setCurrentObject: c,
    getOpenMapViews: f,
    getAppHtml: l,
    notifyInfo: y,
    notifyError: u,
    getActiveUsers: E,
    getPrimaryGM: I,
    isPrimaryGM: M
  } = e, L = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Set(), G = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map();
  function U(p, j, i) {
    return p.routes.find((s) => s.fromSystemId === j && s.toSystemId === i || s.toSystemId === j && s.fromSystemId === i) ?? null;
  }
  function oe(p, j) {
    const i = t(p);
    if (!i)
      return u(`Map "${p}" was not found.`), null;
    const s = z(i), a = s.systems.find((v) => v.id === s.currentSystemId), r = s.systems.find((v) => v.id === j);
    if (!r)
      return u(`System "${j}" was not found.`), null;
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
    const h = Je(E(), game.user.id, d, s.travelApprovalMode);
    return {
      action: "travel-request",
      requestId: Te("travel"),
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
  function P(p, j) {
    const i = oe(p, j);
    return i ? (game.socket.emit(Ie, i), y(`Travel request sent: ${i.fromName} to ${i.toName}.`), i) : null;
  }
  function Q(p, j, i) {
    const s = t(p);
    if (!s)
      return u(`Map "${p}" was not found.`), null;
    const a = z(s), r = a.systems.find((O) => O.id === j), n = r == null ? void 0 : r.objects.find((O) => O.id === a.currentLocation.objectId), d = r == null ? void 0 : r.objects.find((O) => O.id === i);
    if (!r || a.currentLocation.systemId !== r.id || !n)
      return u("The current location is not inside this system."), null;
    if (!d)
      return u(`Destination "${i}" was not found.`), null;
    if (n.id === d.id)
      return y(`${d.name} is already the current location.`), null;
    if (a.visibility !== "players" || r.visibility !== "players" || Re(r, n) !== "players" || Re(r, d) !== "players")
      return u("That travel destination is not visible to players."), null;
    const h = U({ routes: r.routes }, n.id, d.id);
    if (!h || h.visibility !== "players")
      return u(`No player-visible direct route from ${n.name} to ${d.name}.`), null;
    const v = I();
    if (!v)
      return u("A GM must be online to approve player travel."), null;
    const k = Je(E(), game.user.id, v, a.travelApprovalMode);
    return {
      action: "travel-request",
      travelScope: "object",
      requestId: Te("travel"),
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
  function Z(p, j, i) {
    const s = Q(p, j, i);
    return s ? (game.socket.emit(Ie, s), y(`Travel request sent: ${s.fromName} to ${s.toName}.`), s) : null;
  }
  function re(p, j) {
    var n, d;
    if (!j) return;
    N.set(p, j);
    const i = (n = G.get(p)) == null ? void 0 : n.root;
    if (!i) return;
    const s = i.querySelector("[data-travel-progress-count]"), a = i.querySelector("[data-travel-progress-pending]"), r = i.querySelector("[data-travel-progress-bar]");
    s && (s.textContent = `${j.acceptedCount} of ${j.requiredApprovals} approvals`), a && (a.textContent = (d = j.pendingNames) != null && d.length ? `Waiting for: ${j.pendingNames.join(", ")}` : "All votes received"), r && (r.style.width = `${Math.min(100, j.acceptedCount / Math.max(1, j.requiredApprovals) * 100)}%`);
  }
  function V(p) {
    var n, d, h, v;
    if (!(p != null && p.requestId) || p.requesterId === ((n = game.user) == null ? void 0 : n.id) || !((h = p.voterIds) != null && h.includes((d = game.user) == null ? void 0 : d.id)) || _.has(p.requestId)) return;
    _.add(p.requestId);
    let j = !1, i = !1, s = null;
    const a = (k) => {
      if (j) return;
      j = !0;
      const O = {
        action: "travel-vote",
        requestId: p.requestId,
        mapId: p.mapId,
        userId: game.user.id,
        userName: game.user.name,
        accepted: k
      };
      game.socket.emit(Ie, O), xe(O);
    }, r = ((v = ot.find((k) => k.value === p.approvalMode)) == null ? void 0 : v.label) ?? "Unanimous agreement";
    s = new Dialog({
      title: "Travel Request",
      content: `<section class="gmf-travel-request">
        <p><strong>${ve(p.requesterName)}</strong> wants to travel on <strong>${ve(p.mapTitle)}</strong>.</p>
        <p>${ve(p.fromName)} &rarr; ${ve(p.toName)}</p>
        <p class="gmf-travel-request__meta">${ve(p.routeType)} route / ${ve(p.travelTime || "Unknown time")} / Fuel ${ve(p.fuelCost ?? 0)}</p>
        <p class="gmf-travel-request__mode"><i class="fa-solid fa-users"></i> ${ve(r)}</p>
        <div class="gmf-travel-progress" data-travel-progress aria-live="polite">
          <div class="gmf-travel-progress__bar"><span data-travel-progress-bar></span></div>
          <strong data-travel-progress-count>Waiting for vote status…</strong><span data-travel-progress-pending></span>
        </div></section>`,
      render: (k) => {
        const O = is(k), $ = G.get(p.requestId);
        $ && ($.root = O), re(p.requestId, N.get(p.requestId));
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
      i = !0, j = !0, s == null || s.close();
    } }), s.render(!0);
  }
  const ie = (p) => {
    var j;
    return !!(p != null && p.coordinatorId && p.coordinatorId === ((j = I()) == null ? void 0 : j.id));
  };
  function ne(p) {
    const j = Et(p);
    return {
      action: "travel-progress",
      requestId: p.requestId,
      mapId: p.mapId,
      requesterId: p.requesterId,
      approvalMode: p.approvalMode,
      acceptedCount: j.acceptedCount,
      declinedCount: j.declinedCount,
      requiredApprovals: j.required,
      participantCount: p.participantCount,
      pendingNames: j.pendingIds.map((i) => {
        var s;
        return ((s = p.voterNames) == null ? void 0 : s[i]) || "Navigator";
      }),
      coordinatorId: game.user.id
    };
  }
  function C(p) {
    const j = ne(p);
    return re(p.requestId, j), game.socket.emit(Ie, j), j;
  }
  function A(p) {
    var i, s, a;
    if (!(p != null && p.requestId) || !ie(p)) return;
    const j = N.get(p.requestId);
    if (re(p.requestId, p), p.requesterId === ((i = game.user) == null ? void 0 : i.id) && (!j || j.acceptedCount !== p.acceptedCount || j.declinedCount !== p.declinedCount)) {
      const r = (s = p.pendingNames) != null && s.length ? ` Waiting for ${p.pendingNames.join(", ")}.` : "";
      (a = ui.notifications) == null || a.info(`Travel vote: ${p.acceptedCount}/${p.requiredApprovals} approvals.${r}`);
    }
  }
  function ee(p) {
    if (!M() || !(p != null && p.requestId) || L.has(p.requestId)) return null;
    const j = t(p.mapId);
    if (!j) return null;
    const i = z(j), s = E().find((B) => B.id === p.requesterId && !B.isGM), a = p.travelScope === "object", r = a ? i.systems.find((B) => B.id === p.systemId) : null, n = a ? r == null ? void 0 : r.objects.find((B) => B.id === i.currentLocation.objectId) : i.systems.find((B) => B.id === i.currentSystemId), d = a ? r == null ? void 0 : r.objects.find((B) => B.id === p.toObjectId) : i.systems.find((B) => B.id === p.toSystemId), h = n && d ? U(a ? { routes: (r == null ? void 0 : r.routes) ?? [] } : i, n.id, d.id) : null, v = a && (!r || i.currentLocation.systemId !== r.id || r.visibility !== "players" || Re(r, n) !== "players" || Re(r, d) !== "players"), k = !a && ((n == null ? void 0 : n.visibility) !== "players" || (d == null ? void 0 : d.visibility) !== "players");
    if (!s || i.visibility !== "players" || !n || !d || n.id === d.id || v || k || !h || h.visibility !== "players") return null;
    const O = I(), $ = Je(E(), p.requesterId, O, i.travelApprovalMode), F = globalThis.setTimeout(() => {
      const B = L.get(p.requestId);
      B && ke(B, { reason: "Travel request timed out." });
    }, Hs), H = {
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
      ...$,
      accepted: /* @__PURE__ */ new Set(),
      declined: /* @__PURE__ */ new Set(),
      timeoutId: F
    };
    return L.set(p.requestId, H), C(H), H;
  }
  function K(p) {
    const j = z(t(p.mapId)), i = p.travelScope === "object", s = i ? j.systems.find((n) => n.id === p.systemId) : null, a = i ? s == null ? void 0 : s.objects.find((n) => n.id === p.fromObjectId) : j.systems.find((n) => n.id === p.fromSystemId), r = i ? s == null ? void 0 : s.objects.find((n) => n.id === p.toObjectId) : j.systems.find((n) => n.id === p.toSystemId);
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
  const te = (p, j, i) => {
    var s;
    return game.socket.emit(
      Ie,
      { action: "travel-animation", mapId: p, fromSystemId: j, toSystemId: i, coordinatorId: (s = game.user) == null ? void 0 : s.id }
    );
  }, se = (p, j, i, s) => {
    var a;
    return game.socket.emit(
      Ie,
      { action: "travel-animation", travelScope: "object", mapId: p, systemId: j, fromObjectId: i, toObjectId: s, coordinatorId: (a = game.user) == null ? void 0 : a.id }
    );
  };
  function ue(p) {
    var j;
    L.delete(p.requestId), p.timeoutId && globalThis.clearTimeout(p.timeoutId), _.delete(p.requestId), (j = G.get(p.requestId)) == null || j.resolve(), G.delete(p.requestId), N.delete(p.requestId);
  }
  async function he(p) {
    ue(p);
    const j = {
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
    game.socket.emit(Ie, j), K(j), y(`Travel approved: ${p.fromName} to ${p.toName}.`), globalThis.setTimeout(() => {
      p.travelScope === "object" ? c(p.mapId, p.systemId, p.toObjectId) : o(p.mapId, p.toSystemId);
    }, Yt);
  }
  function ke(p, { voterName: j = "", reason: i = "" } = {}) {
    ue(p);
    const s = i || `${j || "A participant"} declined the request.`, a = {
      action: "travel-declined",
      requestId: p.requestId,
      mapId: p.mapId,
      fromName: p.fromName,
      toName: p.toName,
      voterName: j,
      reason: s,
      coordinatorId: game.user.id
    };
    game.socket.emit(Ie, a), y(`Travel cancelled: ${s}`);
  }
  function xe(p) {
    if (!M() || !(p != null && p.requestId)) return;
    const j = L.get(p.requestId);
    if (!j || !j.voterIds.includes(p.userId) || j.accepted.has(p.userId) || j.declined.has(p.userId)) return;
    p.accepted ? j.accepted.add(p.userId) : j.declined.add(p.userId);
    const i = Et(j);
    C(j), i.outcome === "approved" ? he(j) : i.outcome === "declined" && ke(j, {
      voterName: p.userName,
      reason: j.approvalMode === "unanimous" ? `${p.userName || "A participant"} declined the unanimous request.` : "The remaining votes cannot reach a majority."
    });
  }
  function R(p) {
    var j;
    p.requestId && _.delete(p.requestId), (j = G.get(p.requestId)) == null || j.resolve(), G.delete(p.requestId), N.delete(p.requestId);
  }
  function me(p) {
    var j, i;
    !ie(p) || p.coordinatorId === ((j = game.user) == null ? void 0 : j.id) || (R(p), K(p), (i = ui.notifications) == null || i.info(`Travel approved: ${p.fromName} to ${p.toName}.`));
  }
  function ye(p) {
    var j, i;
    !ie(p) || p.coordinatorId === ((j = game.user) == null ? void 0 : j.id) || (R(p), (i = ui.notifications) == null || i.warn(`Travel cancelled: ${p.reason || `${p.voterName || "A participant"} declined.`}`));
  }
  return {
    getTravelRoute: U,
    requestTravelToSystem: P,
    requestTravelToObject: Z,
    promptForTravelRequest: V,
    isPrimaryGMMessage: ie,
    handleTravelProgress: A,
    trackTravelRequest: ee,
    animateTravelOnOpenMaps: K,
    broadcastTravelAnimation: te,
    broadcastObjectTravelAnimation: se,
    handleTravelVote: xe,
    handleTravelApproved: me,
    handleTravelDeclined: ye
  };
}
function ki(e) {
  return `
    <div class="gmf-texture-guide" data-texture-guide data-shape="${ve(e)}">
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
let Pe = null;
const Fe = /* @__PURE__ */ new Map();
let ae = null, De = null;
function Rt(e) {
  return foundry.utils.deepClone(e);
}
function je(e) {
  var t;
  (t = ui.notifications) == null || t.error(`[Galaxy Map] ${e}`);
}
function Ne(e) {
  var t;
  (t = ui.notifications) == null || t.info(`[Galaxy Map] ${e}`);
}
function ft(e = "change galaxy maps") {
  var t;
  return (t = game.user) != null && t.isGM ? !0 : (je(`Only a GM can ${e}.`), !1);
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
  updateMap: qi,
  updateMapMetadata: us,
  deleteMap: ms,
  duplicateMap: fs,
  upsertSystem: ps,
  upsertObject: hs,
  savePlanetLocation: ys,
  removePlanetLocation: gs,
  unlinkPlanetScene: Ss,
  deleteObject: pt,
  moveObject: Ci,
  setPrimaryObject: ji,
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
  revealSystemToPlayers: _s,
  hideSystemFromPlayers: It,
  revealRouteToPlayers: Ts,
  hideRouteFromPlayers: bt,
  importMapData: xs,
  exportMap: wt,
  getMaps: Xe,
  getSystem: Oi,
  getObject: Ai,
  getSceneIdsForSystem: Ri,
  getSceneIdsForObject: $i,
  getObjectsForScene: Fi,
  getSystemsForScene: Ni,
  updateOpenPlanetLocations: Di
} = Ei({ notifyError: je, notifyInfo: Ne, requireGM: ft, refreshOpenApps: Ps, closeOpenMap: Ki, getOpenMapViews: Mt });
function Es(e) {
  var o;
  const t = ks(e);
  return ((o = t == null ? void 0 : t.closest) == null ? void 0 : o.call(t, ".window-app, .application, .app")) ?? t;
}
function Gi(e) {
  return e.map((t) => {
    var f, l;
    const o = Es(t);
    if (!o) return null;
    const c = Number.parseInt(((l = (f = globalThis.getComputedStyle) == null ? void 0 : f.call(globalThis, o)) == null ? void 0 : l.zIndex) ?? "", 10);
    return { app: t, zIndex: o.style.zIndex || (Number.isFinite(c) ? String(c) : "") };
  }).filter(Boolean);
}
function Qe(e) {
  for (const t of e) {
    const o = Es(t.app);
    !(o != null && o.isConnected) || !t.zIndex || (o.style.zIndex = t.zIndex);
  }
}
async function Ps(e = null) {
  var l;
  const t = [...Fe.entries()].filter(([y, u]) => (u == null ? void 0 : u.rendered) && (!e || y === e)).map(([, y]) => y);
  ae != null && ae.rendered && (!e || ae.mapId === e) && t.push(ae);
  const o = [Pe != null && Pe.rendered ? Pe : null, ...t].filter(Boolean), c = Gi(o), f = o.map((y) => Promise.resolve(y.render({ force: !0 })));
  Qe(c), await Promise.allSettled(f), Qe(c), (l = globalThis.requestAnimationFrame) == null || l.call(globalThis, () => Qe(c));
}
function Mt(e) {
  const t = [...Fe.values()];
  return ae && t.push(ae), t.filter((o) => (o == null ? void 0 : o.rendered) && o.mapId === e);
}
function ks(e) {
  return e.element ?? null;
}
const {
  getTravelRoute: Bi,
  requestTravelToSystem: qs,
  requestTravelToObject: Cs,
  promptForTravelRequest: Nt,
  isPrimaryGMMessage: zi,
  handleTravelProgress: Hi,
  trackTravelRequest: Vi,
  animateTravelOnOpenMaps: Ui,
  broadcastTravelAnimation: Yi,
  broadcastObjectTravelAnimation: Wi,
  handleTravelVote: Xi,
  handleTravelApproved: Ji,
  handleTravelDeclined: Zi
} = Pi({
  getRawMap: ze,
  setCurrentSystem: yt,
  setCurrentObject: gt,
  getOpenMapViews: Mt,
  getAppHtml: ks,
  notifyInfo: Ne,
  notifyError: je,
  getActiveUsers: os,
  getPrimaryGM: cs,
  isPrimaryGM: ls
});
function Ki(e) {
  const t = Fe.get(e);
  t && t.close(), (ae == null ? void 0 : ae.mapId) === e && ae.close();
}
function Oe(e, t = {}) {
  var u;
  const o = ze(e);
  if (!o)
    return je(`Map "${e}" was not found.`), null;
  const c = t.playerMode ?? !((u = game.user) != null && u.isGM);
  if (c && o.visibility !== "players" && !t.broadcast)
    return je("That galaxy map is not visible to players."), null;
  const f = c ? `player:${e}` : e, l = c && (ae == null ? void 0 : ae.mapId) === e ? ae : Fe.get(f);
  if (l != null && l.rendered)
    return l.bringToFront(), l;
  const y = new rn({ mapId: e, playerMode: c });
  return c ? ae = y : Fe.set(f, y), y.render({ force: !0 }), y;
}
async function Qi(e, t, o = {}) {
  var f;
  if (!e || !t) return !1;
  const c = Oe(e, {
    playerMode: o.playerMode ?? !((f = game.user) != null && f.isGM),
    broadcast: o.broadcast === !0
  });
  return c != null && c.focusSystem ? c.focusSystem(t, o) : !1;
}
async function en(e, t = {}, o = {}) {
  var y, u;
  const c = String(t.systemId || ""), f = String(t.objectId || "");
  if (!e || !c) return !1;
  const l = Oe(e, { playerMode: o.playerMode ?? !((y = game.user) != null && y.isGM), broadcast: o.broadcast === !0 });
  return l ? f && l.focusLocation ? l.focusLocation(c, f, o) : (u = l.focusSystem) == null ? void 0 : u.call(l, c, o) : !1;
}
function tn(e, t = "") {
  var c;
  let o = !1;
  for (const f of Mt(e))
    o = ((c = f.clearSystemFocus) == null ? void 0 : c.call(f, t)) || o;
  return o;
}
function Lt() {
  return ft("open the map manager") ? (Pe || (Pe = new nn()), Pe.render({ force: !0 }), Pe) : null;
}
function _t() {
  const e = js();
  return e.length ? e.length === 1 ? Oe(e[0].id, { playerMode: !0 }) : (De || (De = new an()), De.render({ force: !0 }), De) : (Ne("No galaxy map is currently visible to players."), null);
}
function js() {
  return Xe().filter((e) => e.visibility === "players").sort((e, t) => e.title.localeCompare(t.title));
}
function sn() {
  var t;
  const e = Xe().sort((o, c) => o.title.localeCompare(c.title));
  return (t = game.user) != null && t.isGM ? e.length === 1 ? Oe(e[0].id) : Lt() : _t();
}
function Os(e) {
  if (ft("broadcast galaxy maps")) {
    if (!ze(e)) {
      je(`Map "${e}" was not found.`);
      return;
    }
    game.socket.emit(Ie, { action: "open", mapId: e }), Ne("Map broadcast sent to players.");
  }
}
const nn = ai({
  templateRoot: Ee,
  getMaps: Xe,
  prepareMapForManager: Ti,
  getRawMap: ze,
  importMapData: xs,
  exportMap: wt,
  duplicateMap: fs,
  deleteMap: ms,
  createMap: ds,
  deleteSystem: ht,
  deleteObject: pt,
  deleteRoute: St,
  deleteFaction: vt,
  openMap: Oe,
  showMapToPlayers: Os,
  hideSystemFromPlayers: It,
  hideRouteFromPlayers: bt,
  hideFactionFromPlayers: Ms,
  notifyError: je,
  clearManagerApp: (e) => {
    Pe === e && (Pe = null);
  }
}), an = bi({
  templateRoot: Ee,
  getVisibleMaps: js,
  openMap: Oe,
  clearChooser: (e) => {
    De === e && (De = null);
  }
}), rn = Ii({
  templateRoot: Ee,
  getRawMap: ze,
  prepareMapForDisplay: _i,
  upsertSystem: ps,
  upsertObject: hs,
  upsertRoute: bs,
  upsertFaction: ws,
  updateMapMetadata: us,
  deleteFaction: vt,
  getTextureGuideMarkup: ki,
  activateObjectEditorControls: xi,
  revealSystemToPlayers: _s,
  revealRouteToPlayers: Ts,
  hideSystemFromPlayers: It,
  setObjectVisibility: Is,
  hideRouteFromPlayers: bt,
  deleteSystem: ht,
  deleteObject: pt,
  deleteRoute: St,
  setCurrentSystem: yt,
  setCurrentObject: gt,
  requestTravelToSystem: qs,
  requestTravelToObject: Cs,
  exportMap: wt,
  getTravelRoute: Bi,
  broadcastTravelAnimation: Yi,
  broadcastObjectTravelAnimation: Wi,
  notifyInfo: Ne,
  notifyError: je,
  saveSystemPosition: Ls,
  saveObjectPosition: vs,
  savePlanetLocation: ys,
  removePlanetLocation: gs,
  unlinkPlanetScene: Ss,
  clearMapView: (e) => {
    e.playerMode && ae === e && (ae = null);
    for (const [t, o] of Fe.entries())
      o === e && Fe.delete(t);
  }
});
function on() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: be,
    title: "Galaxy Map",
    icon: "fa-solid fa-route",
    premium: !1,
    description: "Open cinematic campaign maps and navigation charts.",
    open: () => {
      var o;
      return (o = game.user) != null && o.isGM ? Lt() : _t();
    }
  }), !0) : !1;
}
Hooks.once("init", async () => {
  game.settings.register(be, nt, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(be, Ue, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(be, at, {
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  }), Handlebars.registerHelper("gmfEq", (e, t) => e === t), Handlebars.registerHelper("gmfJson", (e) => JSON.stringify(e, null, 2)), Handlebars.registerHelper("gmfPercent", (e) => `${Number(e).toFixed(3)}%`), Handlebars.registerHelper("gmfFallback", (e, t) => e || t), Hooks.on("renderDialog", (e, t) => {
    var f, l;
    const o = is(t), c = ((f = o == null ? void 0 : o.closest) == null ? void 0 : f.call(o, ".window-app, .application, .app")) ?? o;
    (l = c == null ? void 0 : c.classList) != null && l.contains("galaxy-map") && ti(e, t);
  }), await loadTemplates([
    `${Ee}/map-manager.hbs`,
    `${Ee}/galaxy-map.hbs`,
    `${Ee}/map-context-menu.hbs`,
    `${Ee}/celestial-icon.hbs`,
    `${Ee}/object-appearance-panel.hbs`,
    `${Ee}/system-details.hbs`,
    `${Ee}/player-map-chooser.hbs`
  ]);
});
Hooks.once("ready", async () => {
  game.galaxyMap = {
    openMap: Oe,
    focusSystem: Qi,
    focusLocation: en,
    clearSystemFocus: tn,
    openMapManager: Lt,
    openGalaxyMapFromSceneControls: sn,
    openPlayerMapChooser: _t,
    createMap: ds,
    getMaps: Xe,
    getSystem: Oi,
    getObject: Ai,
    getSceneIdsForSystem: Ri,
    getSystemsForScene: Ni,
    getSceneIdsForObject: $i,
    getObjectsForScene: Fi,
    showMapToPlayers: Os,
    updateMap: qi,
    updateMapMetadata: us,
    deleteMap: ms,
    duplicateMap: fs,
    upsertSystem: ps,
    deleteSystem: ht,
    upsertObject: hs,
    deleteObject: pt,
    moveObject: Ci,
    setPrimaryObject: ji,
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
    revealSystemToPlayers: _s,
    revealRouteToPlayers: Ts,
    hideSystemFromPlayers: It,
    setObjectVisibility: Is,
    hideRouteFromPlayers: bt,
    hideFactionFromPlayers: Ms,
    requestTravelToSystem: qs,
    requestTravelToObject: Cs,
    importMapData: xs,
    exportMap: wt
  };
  const e = game.modules.get(be);
  if (e && (e.api = game.galaxyMap), on(), ls()) {
    const t = $t();
    if (Object.values(t).some((c) => Number((c == null ? void 0 : c.schemaVersion) || 1) < Ce)) {
      const c = Rt(game.settings.get(be, Ue) ?? {});
      Object.keys(c).length || await game.settings.set(be, Ue, t);
      const f = Object.fromEntries(Object.entries(t).map(([l, y]) => [l, z(y)]));
      await Ft(f), Ne('Your galaxy maps were updated to the new format. Everything from the old single map is now inside a system called "System 1", and a backup of the old data was kept.');
    }
    if (!game.settings.get(be, at)) {
      const c = Rt(game.settings.get(be, Ue) ?? {}), f = $t();
      let l = 0;
      for (const [y, u] of Object.entries(c)) {
        if (!f[y]) continue;
        const E = z(f[y]);
        for (const I of (u == null ? void 0 : u.systems) ?? []) {
          const M = Xt(I == null ? void 0 : I.planetLocations);
          if (!M.length) continue;
          const L = E.systems.flatMap((_) => _.objects).find((_) => _.id === I.id || _.id === `${I.id}-object`);
          !L || L.planetLocations.length || (L.planetLocations = M.filter((_) => L.sceneIds.includes(_.sceneId)), l += L.planetLocations.length);
        }
        f[y] = z(E);
      }
      l && (await Ft(f), Ne(`Restored ${l} surface location${l === 1 ? "" : "s"} that went missing in an earlier update.`)), await game.settings.set(be, at, !0);
    }
  }
  game.socket.on(Ie, (t = {}) => {
    var o, c, f, l, y;
    if (t.action === "travel-request") {
      const u = Vi(t);
      u && (game.socket.emit(Ie, u), Nt(u));
      return;
    }
    if (t.action === "travel-ballot") {
      zi(t) && t.coordinatorId !== ((o = game.user) == null ? void 0 : o.id) && Nt(t);
      return;
    }
    if (t.action === "travel-vote") {
      Xi(t);
      return;
    }
    if (t.action === "travel-progress") {
      Hi(t);
      return;
    }
    if (t.action === "travel-approved") {
      Ji(t);
      return;
    }
    if (t.action === "travel-declined") {
      Zi(t);
      return;
    }
    if (t.action === "travel-animation") {
      t.coordinatorId !== ((c = game.user) == null ? void 0 : c.id) && Ui(t);
      return;
    }
    if (t.action === "planet-locations") {
      Di(t.mapId, t.systemId, t.objectId);
      return;
    }
    if (t.action === "refresh") {
      (f = game.user) != null && f.isGM ? Ps(t.mapId) : (ae == null ? void 0 : ae.mapId) === t.mapId && ae.render({ force: !0 });
      return;
    }
    (l = game.user) != null && l.isGM || (t.action === "open" && t.mapId && (ae == null || ae.close(), Oe(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "notify" && ((y = ui.notifications) == null || y.info(t.message || "New system discovered."), (ae == null ? void 0 : ae.mapId) === t.mapId && ae.render({ force: !0 })));
  }), console.log(`${be} | Ready. API available at game.galaxyMap.`);
});
