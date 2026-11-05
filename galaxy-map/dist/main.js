var As = Object.defineProperty;
var Rs = (e, t, r) => t in e ? As(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Y = (e, t, r) => Rs(e, typeof t != "symbol" ? t + "" : t, r);
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
  return Dt.filter((r) => t.has(r.value) || Bt.has(r.value));
}
function Ht(e, t) {
  var p;
  const r = rt(e), c = zt(t);
  return c.some((l) => l.value === r) ? r : ((p = c.find((l) => !Bt.has(l.value))) == null ? void 0 : p.value) ?? "color";
}
function Ns(e) {
  return e === "black-hole";
}
function qe(e, t = "") {
  if (!e || e.obscured || e.planetPreset === "none") return null;
  const r = rt(e.planetPreset), c = Ge.find((y) => y.value === t) ?? Ge.find((y) => y.value === r) ?? Ge[0], p = !t && r === "custom" && !!e.planetTexture, l = !t && r === "color";
  return {
    texture: l ? null : p ? e.planetTexture : `modules/galaxy-map/assets/planets/${c.texture}`,
    label: l ? "Flat color" : p ? "Custom texture" : c.label,
    preset: l ? "color" : p ? "custom" : c.value,
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
function Je(e, t, r, c) {
  const p = ct(c), l = [...new Map((e ?? []).filter((_) => _ == null ? void 0 : _.id).map((_) => [String(_.id), _])).values()], y = p === "gm" ? r != null && r.id ? [r] : [] : l.filter((_) => String(_.id) !== String(t)), u = y.map((_) => String(_.id)), E = Object.fromEntries(y.map((_) => [String(_.id), String(_.name || "Navigator").slice(0, 80)])), I = u.length + (p === "gm" ? 0 : 1), M = p === "gm" ? 1 : p === "majority" ? Math.floor(I / 2) + 1 : I;
  return { approvalMode: p, voterIds: u, voterNames: E, participantCount: I, requiredApprovals: M };
}
function Et(e) {
  const t = ct(e == null ? void 0 : e.approvalMode), r = [...new Set(((e == null ? void 0 : e.voterIds) ?? []).map((M) => String(M)))], c = new Set([...(e == null ? void 0 : e.accepted) ?? []].map((M) => String(M))), p = new Set([...(e == null ? void 0 : e.declined) ?? []].map((M) => String(M))), l = t === "gm" ? 0 : 1, y = Math.max(1, Number(e == null ? void 0 : e.requiredApprovals) || (t === "unanimous" ? r.length + 1 : 1)), u = l + r.filter((M) => c.has(M)).length, E = r.filter((M) => p.has(M)).length, I = r.filter((M) => !c.has(M) && !p.has(M));
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
  const r = et.includes(t) ? t : "players";
  return et.includes(e) ? String(e) : r;
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
  const r = Number(e);
  return Number.isFinite(r) ? r : t;
}
function Ys(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  return [...new Set(t.map((r) => String(r).trim()).filter(Boolean))];
}
function le(e, t, r) {
  return Math.min(r, Math.max(t, e));
}
function Pt(e, t) {
  return !Array.isArray(e) || e.length < 3 ? [...t] : e.slice(0, 3).map((r, c) => le(we(r, t[c]), -2.5, 2.5));
}
function Wt(e = {}) {
  const t = Pt(e.normal, [0, 0, 1]), r = Math.hypot(...t) || 1;
  return {
    id: String(e.id || Te("location")),
    sceneId: String(e.sceneId || "").trim(),
    shape: Ye(e.shape),
    position: Pt(e.position, [0, 0, 1]),
    normal: t.map((c) => c / r),
    surfaceVersion: 1
  };
}
function Xt(e) {
  const t = /* @__PURE__ */ new Set();
  return (Array.isArray(e) ? e : []).slice(0, 64).map(Wt).filter((r) => {
    const c = `${r.sceneId}:${r.shape}`;
    return !r.sceneId || t.has(c) ? !1 : (t.add(c), !0);
  });
}
function Jt(e = {}) {
  return Gs.includes(e.kind) ? e.kind : e.type === "station" || e.iconStyle === "station" ? "station" : e.type === "anomaly" ? "anomaly" : e.iconStyle === "star" ? "star" : e.iconStyle === "black-hole" ? "black-hole" : e.planetShape === "asteroid" ? "asteroid" : ["planet", "terrestrial", "gas-giant", "ice-world", "volcanic", "artificial", "ringed"].includes(e.iconStyle) ? "planet" : "other";
}
function it(e = {}) {
  const t = Ys(e.sceneIds === void 0 ? e.sceneId : e.sceneIds), r = String(e.planetTexture || "").trim(), c = Ye(e.planetShape), p = rt(e.planetPreset), l = Ht(p, c), y = r && !["none", "color"].includes(l) ? "custom" : l, u = Jt(e);
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
    planetTexture: r,
    planetColor: st(e.planetColor) || "#58d8ff"
  };
}
const kt = it;
function Zt(e = {}) {
  var u;
  const t = Array.isArray(e.objects) ? e.objects.map(it) : [], r = new Set(t.map((E) => E.id)), c = (Array.isArray(e.routes) ? e.routes : []).map(dt).filter((E) => E.fromSystemId !== E.toSystemId && r.has(E.fromSystemId) && r.has(E.toSystemId)), p = t.some((E) => E.id === e.primaryObjectId) ? String(e.primaryObjectId) : ((u = t[0]) == null ? void 0 : u.id) ?? "", l = t.find((E) => E.id === p) ?? it(e), y = {
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
    primaryObjectId: p,
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
  const t = String(e.id || e.objectId || Te("object")), r = Jt(e);
  return {
    ...e,
    id: t,
    name: String(e.name || "Unnamed Location"),
    kind: r,
    x: e.x,
    y: e.y,
    visibility: e.visibility,
    iconColor: e.iconColor,
    iconSize: e.iconSize,
    iconStyle: e.iconStyle === "planet" && r !== "planet" ? r === "station" ? "station" : r === "star" ? "star" : "diamond" : e.iconStyle,
    pulse: e.pulse
  };
}
function Qt(e, t, r = "", c = ut(e), p = []) {
  var y;
  const l = t.some((u) => u.id === r) ? r : ((y = t[0]) == null ? void 0 : y.id) ?? "";
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
    routes: p
  };
}
function Xs(e, t) {
  var y;
  const c = (Array.isArray(e.systems) ? e.systems : []).map(Ws), p = String(e.currentSystemId || ((y = c[0]) == null ? void 0 : y.id) || ""), l = Qt(e, c, p, ut(e), Array.isArray(e.routes) ? e.routes : []);
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
  const t = Array.isArray(e.systems) ? e.systems : [], r = t.filter(qt), c = t.filter((C) => !qt(C));
  if (!r.length && t.length) return { ...e, schemaVersion: Ce };
  const p = new Set(c.map((C) => String(C.id)));
  let l = ut(e);
  p.has(l) && (l = `${l}-legacy`);
  const y = new Set(r.map((C) => String(C.id))), u = new Map(r.map((C) => [String(C.id), String(C.primaryObjectId)])), E = r.flatMap((C) => (C.objects ?? []).map((A) => {
    const ee = A.id === C.primaryObjectId;
    return {
      ...A,
      x: ee ? C.x : A.x,
      y: ee ? C.y : A.y,
      visibility: A.visibility === "inherit" ? C.visibility : A.visibility,
      factionId: A.factionId || C.factionId || ""
    };
  })), I = String(((re = e.currentLocation) == null ? void 0 : re.systemId) || e.currentSystemId || ""), M = r.find((C) => C.id === I), _ = String(((V = e.currentLocation) == null ? void 0 : V.objectId) || (M == null ? void 0 : M.primaryObjectId) || ((ie = E[0]) == null ? void 0 : ie.id) || ""), L = Array.isArray(e.routes) ? e.routes : [], G = L.filter((C) => y.has(String(C.fromSystemId)) && y.has(String(C.toSystemId))).map((C) => ({ ...C, fromSystemId: u.get(String(C.fromSystemId)), toSystemId: u.get(String(C.toSystemId)) })), N = Qt(e, E, _, l, G), U = [N, ...c], oe = new Set(U.map((C) => String(C.id))), P = /* @__PURE__ */ new Set(), Q = L.filter((C) => !(y.has(String(C.fromSystemId)) && y.has(String(C.toSystemId)))).map((C) => ({
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
  var M, _, L, G;
  const t = Zs(e), r = Array.isArray(t.systems) ? t.systems.map(Zt) : [], c = Array.isArray(t.routes) ? t.routes.map(dt) : [], p = Array.isArray(t.factions) ? t.factions.map(Kt) : [], l = String(((M = t.currentLocation) == null ? void 0 : M.systemId) || t.currentSystemId || ((_ = r[0]) == null ? void 0 : _.id) || ""), y = r.some((N) => N.id === l) ? l : ((L = r[0]) == null ? void 0 : L.id) ?? "", u = r.find((N) => N.id === y), E = String(((G = t.currentLocation) == null ? void 0 : G.objectId) || ""), I = u != null && u.objects.some((N) => N.id === E) ? E : (u == null ? void 0 : u.primaryObjectId) ?? "";
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
    systems: r,
    routes: c,
    factions: p
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
function Ot(e, t, r) {
  const c = (y) => [1, 3, 5].map((u) => Number.parseInt(y.slice(u, u + 2), 16)), p = c(e), l = c(t);
  return `rgb(${p.map((y, u) => Math.round(y * r + l[u] * (1 - r))).join(", ")})`;
}
function Qs() {
  var c, p, l, y, u, E;
  const e = document.documentElement, t = ((c = e == null ? void 0 : e.dataset) == null ? void 0 : c.holosuiteDeviceStyle) || ((l = (p = document.body) == null ? void 0 : p.dataset) == null ? void 0 : l.holosuiteDeviceStyle) || "";
  if (Ve[t]) return Ve[t];
  const r = ((y = e == null ? void 0 : e.dataset) == null ? void 0 : y.holosuiteTheme) || ((E = (u = document.body) == null ? void 0 : u.dataset) == null ? void 0 : E.holosuiteTheme) || "default";
  return Ve[r] ?? Ve.default;
}
async function es(e) {
  const { primary: t, success: r, background: c } = Qs(), p = Ot(t, c, 0.58), l = Ot(t, c, 0.34), y = [t, r, p, l, c].join("|");
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
        ["#64f4f1", r],
        ["#1490ab", p],
        ["#22788b", l],
        ["#042228", c]
      ]);
      for (const [M, _] of I) E = E.replace(new RegExp(M, "gi"), _);
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
  var t, r;
  return e ? (t = e.matches) != null && t.call(e, ".window-app, .application, .app") ? e : (r = e.closest) == null ? void 0 : r.call(e, ".window-app, .application, .app") : null;
}
function We(e, t) {
  const r = ts(t), c = ss(r);
  c && (ei(), es(c));
  const p = Array.from((r == null ? void 0 : r.querySelectorAll("[data-gmf-window-drag]")) ?? []);
  if (!(!r || !c || !p.length)) {
    r.querySelectorAll("[data-action='close-window']").forEach((l) => {
      l.dataset.gmfCloseBound !== "true" && (l.dataset.gmfCloseBound = "true", l.addEventListener("click", () => {
        var y;
        return (y = e.close) == null ? void 0 : y.call(e);
      }));
    });
    for (const l of p)
      l.dataset.gmfDragBound !== "true" && (l.dataset.gmfDragBound = "true", l.addEventListener("pointerdown", (y) => {
        var U, oe, P;
        if (y.button !== 0) return;
        const u = y.target;
        if ((U = u == null ? void 0 : u.closest) != null && U.call(u, "button, input, select, textarea, a, [data-action]")) return;
        const E = c.getBoundingClientRect(), I = y.clientX, M = y.clientY, _ = E.left, L = E.top;
        (oe = e.bringToFront ?? e.bringToTop) == null || oe.call(e), (P = l.setPointerCapture) == null || P.call(l, y.pointerId), l.classList.add("is-dragging");
        const G = (Q) => {
          var ne;
          const Z = c.getBoundingClientRect().width, re = c.getBoundingClientRect().height, V = Math.max(0, Math.min(window.innerWidth - Math.min(Z, 80), _ + Q.clientX - I)), ie = Math.max(0, Math.min(window.innerHeight - Math.min(re, 48), L + Q.clientY - M));
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
  const r = ts(t), c = ss(r), p = (I = c == null ? void 0 : c.querySelector) == null ? void 0 : I.call(c, ":scope > .window-content");
  if (!r || !c || !p || p.querySelector(":scope > .gmf-dialog-header")) return;
  const l = document.createElement("header");
  l.className = "gmf-dialog-header", l.dataset.gmfWindowDrag = "true";
  const y = document.createElement("div");
  y.className = "gmf-dialog-header__identity", y.innerHTML = '<span class="gmf-dialog-header__orb"><i class="fa-solid fa-satellite"></i></span><span><small>GALAXY MAP // CONTROL PANEL</small><strong></strong></span>';
  const u = y.querySelector("strong");
  u && (u.textContent = (e == null ? void 0 : e.title) || ((M = c.querySelector(".window-title")) == null ? void 0 : M.textContent) || "Galaxy Map");
  const E = document.createElement("button");
  E.type = "button", E.className = "gmf-window-close", E.dataset.action = "close-window", E.title = "Close", E.setAttribute("aria-label", "Close window"), E.innerHTML = '<i class="fa-solid fa-xmark"></i>', l.append(y, E), p.prepend(l), We(e, c);
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
  const r = JSON.stringify(t, null, 2), c = globalThis.saveDataToFile;
  if (typeof c == "function") {
    c(r, "application/json", e);
    return;
  }
  const p = new Blob([r], { type: "application/json" }), l = URL.createObjectURL(p), y = document.createElement("a");
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
  var p, l, y;
  const t = (y = (l = (p = e.foundry) == null ? void 0 : p.applications) == null ? void 0 : l.apps) == null ? void 0 : y.FilePicker, r = t == null ? void 0 : t.implementation;
  if (typeof r == "function") return r;
  if (typeof t == "function") return t;
  const c = typeof FilePicker == "function" ? FilePicker : e.FilePicker;
  return typeof c == "function" ? c : null;
}
function ns(e) {
  const t = (r) => r ? e.querySelector(`[name="${r}"]`) : null;
  e.querySelectorAll("[data-browse-target]").forEach((r) => {
    r.addEventListener("click", (c) => {
      c.preventDefault();
      const p = t(r.dataset.browseTarget);
      if (!p) return;
      const l = ni();
      if (!l) {
        console.error("galaxy-map | Foundry FilePicker is unavailable.");
        return;
      }
      new l({
        type: "image",
        current: p.value,
        callback: (y) => {
          p.value = y, At(p);
        }
      }).browse();
    });
  }), e.querySelectorAll("[data-clear-target]").forEach((r) => {
    r.addEventListener("click", (c) => {
      c.preventDefault();
      const p = t(r.dataset.clearTarget);
      p && (p.value = "", At(p));
    });
  });
}
function ai(e) {
  var V;
  const {
    templateRoot: t,
    getMaps: r,
    prepareMapForManager: c,
    getRawMap: p,
    importMapData: l,
    exportMap: y,
    duplicateMap: u,
    deleteMap: E,
    createMap: I,
    deleteSystem: M,
    deleteObject: _,
    deleteRoute: L,
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
      Y(this, "selectedMapId");
      Y(this, "activeTab");
      Y(this, "expandedSystemId");
      this.selectedMapId = C.selectedMapId ?? null, this.activeTab = ["systems", "routes", "factions"].includes(C.activeTab) ? C.activeTab : "systems", this.expandedSystemId = C.expandedSystemId;
    }
    async _prepareContext(C) {
      var te, se;
      const A = await super._prepareContext(C), ee = r().sort((ue, he) => ue.title.localeCompare(he.title));
      (!this.selectedMapId || !ee.some((ue) => ue.id === this.selectedMapId)) && (this.selectedMapId = ((te = ee[0]) == null ? void 0 : te.id) ?? null);
      const K = this.selectedMapId ? c(p(this.selectedMapId)) : null;
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
      }), A.querySelectorAll("[data-manager-tab]").forEach(($) => {
        $.addEventListener("click", () => {
          const me = $.dataset.managerTab;
          !["systems", "routes", "factions"].includes(me) || me === this.activeTab || (this.activeTab = me, this.render({ force: !0 }));
        });
      }), A.querySelectorAll("[data-toggle-system]").forEach(($) => {
        $.addEventListener("click", () => {
          const me = $.dataset.toggleSystem;
          this.expandedSystemId = this.expandedSystemId === me ? null : me, this.render({ force: !0 });
        });
      }), A.querySelectorAll("[data-edit-system]").forEach(($) => {
        $.addEventListener("click", () => this._openViewportEditor("system", { id: $.dataset.editSystem }));
      }), A.querySelectorAll("[data-create-object]").forEach(($) => {
        $.addEventListener("click", () => this._openViewportEditor("entity", { systemId: $.dataset.createObject }));
      }), A.querySelectorAll("[data-edit-object]").forEach(($) => {
        $.addEventListener("click", () => this._openViewportEditor("entity", { systemId: $.dataset.objectSystem, id: $.dataset.editObject }));
      }), A.querySelectorAll("[data-delete-object]").forEach(($) => {
        $.addEventListener("click", () => this._confirmDeleteObject($.dataset.objectSystem, $.dataset.deleteObject));
      }), A.querySelectorAll("[data-show-system]").forEach(($) => {
        $.addEventListener("click", () => oe(this.selectedMapId, $.dataset.showSystem, !1));
      }), A.querySelectorAll("[data-hide-system]").forEach(($) => {
        $.addEventListener("click", () => oe(this.selectedMapId, $.dataset.hideSystem, !0));
      }), A.querySelectorAll("[data-delete-system]").forEach(($) => {
        $.addEventListener("click", () => this._confirmDeleteSystem($.dataset.deleteSystem));
      }), A.querySelectorAll("[data-edit-route]").forEach(($) => {
        $.addEventListener("click", () => this._openViewportEditor("route", { id: $.dataset.editRoute, systemId: $.dataset.routeSystem }));
      }), A.querySelectorAll("[data-show-route]").forEach(($) => {
        $.addEventListener("click", () => P(this.selectedMapId, $.dataset.showRoute, !1, $.dataset.routeSystem));
      }), A.querySelectorAll("[data-hide-route]").forEach(($) => {
        $.addEventListener("click", () => P(this.selectedMapId, $.dataset.hideRoute, !0, $.dataset.routeSystem));
      }), A.querySelectorAll("[data-delete-route]").forEach(($) => {
        $.addEventListener("click", () => this._confirmDeleteRoute($.dataset.deleteRoute, $.dataset.routeSystem));
      }), A.querySelectorAll("[data-edit-faction]").forEach(($) => {
        $.addEventListener("click", () => this._openViewportEditor("faction", { id: $.dataset.editFaction }));
      }), A.querySelectorAll("[data-show-faction]").forEach(($) => {
        $.addEventListener("click", () => Q(this.selectedMapId, $.dataset.showFaction, !1));
      }), A.querySelectorAll("[data-hide-faction]").forEach(($) => {
        $.addEventListener("click", () => Q(this.selectedMapId, $.dataset.hideFaction, !0));
      }), A.querySelectorAll("[data-delete-faction]").forEach(($) => {
        $.addEventListener("click", () => this._confirmDeleteFaction($.dataset.deleteFaction));
      }), (ke = A.querySelector("[data-action='export-map']")) == null || ke.addEventListener("click", () => {
        this.selectedMapId && y(this.selectedMapId);
      }), (xe = A.querySelector("[data-action='import-map']")) == null || xe.addEventListener("click", () => this._onImportMap()), A.querySelectorAll("[data-select-map]").forEach(($) => {
        $.addEventListener("click", () => {
          this.selectedMapId = $.dataset.selectMap, this.expandedSystemId = void 0, this.render({ force: !0 });
        });
      }), A.querySelectorAll("[data-open-map]").forEach(($) => {
        $.addEventListener("click", () => N($.dataset.openMap));
      }), A.querySelectorAll("[data-show-map]").forEach(($) => {
        $.addEventListener("click", () => U($.dataset.showMap));
      }), A.querySelectorAll("[data-duplicate-map]").forEach(($) => {
        $.addEventListener("click", async () => {
          const me = await u($.dataset.duplicateMap);
          me && (this.selectedMapId = me.id, this.render({ force: !0 }));
        });
      }), A.querySelectorAll("[data-delete-map]").forEach(($) => {
        $.addEventListener("click", async () => {
          const me = $.dataset.deleteMap, ye = p(me);
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
      }) && await _(this.selectedMapId, C, A);
    }
    async _confirmDeleteRoute(C, A = "") {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, $e) && await L(this.selectedMapId, C, A);
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
  }, Y(V, "DEFAULT_OPTIONS", {
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
  }), Y(V, "PARTS", {
    main: {
      template: `${t}/map-manager.hbs`
    }
  }), V;
}
function ri(e, t) {
  const r = (c, p, l) => (p[0] - c[0]) * (l[1] - c[1]) - (p[1] - c[1]) * (l[0] - c[0]);
  return t.flatMap((c) => {
    const p = e.filter((I) => I.factionId === c.id && !I.obscured);
    if (!p.length) return [];
    const l = p.flatMap((I) => Array.from({ length: 12 }, (M, _) => {
      const L = _ * Math.PI / 6;
      return [
        Math.max(1, Math.min(99, I.x + Math.cos(L) * 7)),
        Math.max(1, Math.min(99, I.y + Math.sin(L) * 9))
      ];
    })).sort((I, M) => I[0] - M[0] || I[1] - M[1]), y = (I) => {
      const M = [];
      for (const _ of I) {
        for (; M.length > 1 && r(M[M.length - 2], M[M.length - 1], _) <= 0; ) M.pop();
        M.push(_);
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
  var e, t, r;
  try {
    const c = (t = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : t.call(e, "bounty-board");
    if ((c == null ? void 0 : c.active) === !1) return null;
    const p = c.api ?? ((r = game.scifiSuite) == null ? void 0 : r.bountyBoard);
    return typeof (p == null ? void 0 : p.getBountiesForScene) == "function" ? p : null;
  } catch {
    return null;
  }
}
function oi(e) {
  const t = as();
  if (!t || !Array.isArray(e == null ? void 0 : e.sceneIds)) return [];
  const r = /* @__PURE__ */ new Set(), c = [];
  try {
    for (const p of e.sceneIds)
      for (const l of t.getBountiesForScene(String(p)) ?? []) {
        const y = String((l == null ? void 0 : l.id) ?? "");
        !y || r.has(y) || (r.add(y), c.push({
          id: y,
          name: String(l.name || "Unknown target"),
          image: String(l.image || ""),
          status: String(l.status || ""),
          statusLabel: String(l.statusLabel || l.status || ""),
          reward: String(l.reward || ""),
          sceneId: String(l.sceneId || p)
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
  return new Promise((t, r) => {
    const c = new Image();
    c.onload = () => t(c), c.onerror = () => r(new Error("Image unavailable")), c.src = e;
  });
}
async function fi(e) {
  if (!e) return null;
  try {
    const t = await mi(e), r = Math.min(1, di / Math.max(t.naturalWidth || t.width, t.naturalHeight || t.height)), c = Math.max(2, Math.round((t.naturalWidth || t.width) * r)), p = Math.max(2, Math.round((t.naturalHeight || t.height) * r)), l = document.createElement("canvas");
    l.width = c, l.height = p;
    const y = l.getContext("2d", { willReadFrequently: !0 });
    if (!y) return null;
    y.drawImage(t, 0, 0, c, p);
    const u = y.getImageData(0, 0, c, p), E = y.createImageData(c, p), I = new Float32Array(c * p);
    for (let _ = 0; _ < I.length; _++) {
      const L = _ * 4;
      I[_] = u.data[L] * 0.299 + u.data[L + 1] * 0.587 + u.data[L + 2] * 0.114;
    }
    const M = (_, L) => I[L * c + _];
    for (let _ = 1; _ < p - 1; _++)
      for (let L = 1; L < c - 1; L++) {
        const G = -M(L - 1, _ - 1) + M(L + 1, _ - 1) - 2 * M(L - 1, _) + 2 * M(L + 1, _) - M(L - 1, _ + 1) + M(L + 1, _ + 1), N = -M(L - 1, _ - 1) - 2 * M(L, _ - 1) - M(L + 1, _ - 1) + M(L - 1, _ + 1) + 2 * M(L, _ + 1) + M(L + 1, _ + 1), U = Math.hypot(G, N), oe = Math.max(0, Math.min(235, (U - 34) * 2.1)), P = (_ * c + L) * 4;
        E.data[P] = 104, E.data[P + 1] = 241, E.data[P + 2] = 255, E.data[P + 3] = oe;
      }
    return y.clearRect(0, 0, c, p), y.putImageData(E, 0, 0), l.toDataURL("image/png");
  } catch {
    return null;
  }
}
function pi(e, t = "") {
  const r = `${t}\0${e}`, c = Ae.get(r);
  if (c)
    return Ae.delete(r), Ae.set(r, c), c;
  for (; Ae.size >= li; ) {
    const l = Ae.keys().next().value;
    if (l === void 0) break;
    Ae.delete(l);
  }
  const p = fi(e);
  return Ae.set(r, p), p;
}
function hi({ root: e, stage: t, resolveItems: r, onOpen: c }) {
  const p = e.querySelector("[data-intel-layer]");
  if (!p) return null;
  const l = new AbortController(), y = l.signal, u = document.createElement("aside");
  u.className = "gmf-intel-callout", u.setAttribute("aria-label", "Bounty intel"), u.hidden = !0, u.innerHTML = `
    <span class="gmf-intel-callout__connector" aria-hidden="true"></span>
    <div class="gmf-intel-callout__stack" data-intel-list role="group" aria-label="Matching bounties"></div>`, p.append(u);
  let E = [], I = null, M = null, _ = null, L = 0, G = 0;
  const N = () => {
    M && clearTimeout(M), M = null;
  }, U = () => {
    L++, _ && clearTimeout(_), _ = null, M = null, I = null, E = [], G++, u.hidden = !0, u.classList.remove("is-visible", "is-left");
  }, oe = (V = 180) => {
    N(), L++, _ && clearTimeout(_), _ = null, M = setTimeout(U, V);
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
    const ie = ++L;
    let ne = [];
    try {
      ne = await r(V.dataset.systemId ?? "");
    } catch {
    }
    if (!(ie !== L || I !== V)) {
      if (!ne.length) return U();
      E = ne, u.hidden = !1, Q(), requestAnimationFrame(() => {
        P(), u.classList.add("is-visible");
      });
    }
  }, re = (V) => {
    N(), L++, _ && clearTimeout(_), _ = setTimeout(() => {
      _ = null, Z(V);
    }, 90);
  };
  return e.querySelectorAll("[data-system-id]").forEach((V) => {
    V.addEventListener("pointerenter", () => re(V), { signal: y }), V.addEventListener("pointerleave", () => oe(), { signal: y }), V.addEventListener("focus", () => re(V), { signal: y }), V.addEventListener("blur", () => oe(), { signal: y }), V.addEventListener("pointerdown", () => U(), { signal: y });
  }), u.addEventListener("pointerenter", N, { signal: y }), u.addEventListener("pointerleave", () => oe(), { signal: y }), u.addEventListener("click", (V) => V.stopPropagation(), { signal: y }), t.addEventListener("wheel", () => requestAnimationFrame(P), { signal: y }), window.addEventListener("resize", P, { signal: y }), {
    dispose() {
      L++, M && clearTimeout(M), _ && clearTimeout(_), l.abort(), u.remove();
    }
  };
}
function yi({ host: e }) {
  const t = document.createElement("aside");
  t.className = "gmf-location-callout", t.hidden = !0, t.innerHTML = `
    <span class="gmf-location-callout__connector" aria-hidden="true"></span>
    <strong data-location-name></strong>`, e.append(t);
  let r = null, c = { x: 0, y: 0, visible: !1 }, p = null;
  const l = () => {
    p && clearTimeout(p), p = null;
  }, y = () => {
    l(), r = null, t.hidden = !0, t.classList.remove("is-visible", "is-left");
  }, u = () => {
    if (!r || t.hidden || !c.visible) return;
    const M = t.offsetWidth || 180, _ = t.offsetHeight || 24, L = c.x + M + 76 > e.clientWidth, G = L ? c.x - M - 64 : c.x + 64, N = Math.max(8, Math.min(e.clientHeight - _ - 8, c.y - _ / 2));
    t.classList.toggle("is-left", L), t.style.left = `${Math.max(8, G)}px`, t.style.top = `${N}px`;
  }, E = (M) => {
    l(), r = M;
    const _ = t.querySelector("[data-location-name]");
    _ && (_.textContent = M.missing ? "Missing linked scene" : M.accessible ? M.name : "Restricted location"), t.hidden = !1, u(), requestAnimationFrame(() => {
      u(), t.classList.add("is-visible");
    });
  }, I = (M = 180) => {
    l(), p = setTimeout(y, M);
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
function gi(e, t, r) {
  const c = r.querySelector("[data-ship-layer]"), p = r.querySelector(".gmf-map-stage");
  if (!c || !p) return Promise.resolve();
  const l = p.getBoundingClientRect(), y = (t.x - e.x) * l.width / 100, u = (t.y - e.y) * l.height / 100, E = Math.atan2(u, y) * 180 / Math.PI, I = document.createElement("div");
  return I.className = "gmf-travel-ship", I.innerHTML = '<i class="fa-solid fa-rocket"></i>', I.style.left = `${e.x}%`, I.style.top = `${e.y}%`, I.style.setProperty("--gmf-ship-angle", `${E}deg`), c.replaceChildren(I), new Promise((M) => {
    let _ = !1;
    const L = () => {
      _ || (_ = !0, I.removeEventListener("transitionend", L), I.classList.add("is-arrived"), globalThis.setTimeout(() => {
        I.remove(), M();
      }, 260));
    };
    I.addEventListener("transitionend", L, { once: !0 }), requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        I.style.left = `${t.x}%`, I.style.top = `${t.y}%`;
      });
    }), globalThis.setTimeout(L, Yt);
  });
}
function Si(e) {
  var r, c;
  return (((c = (r = foundry.applications) == null ? void 0 : r.ux) == null ? void 0 : c.TextEditor) ?? globalThis.TextEditor).getDragEventData(e) ?? {};
}
async function rs(e) {
  var l, y, u, E, I, M, _, L;
  const t = Si(e), r = globalThis.fromUuid, c = t.uuid && r ? await r(t.uuid) : null;
  if (["Scene", "JournalEntry"].includes(c == null ? void 0 : c.documentName)) return c;
  const p = String(t.sceneId || t.journalId || t.id || "");
  return p ? t.type === "Scene" ? ((y = (l = game.scenes) == null ? void 0 : l.get) == null ? void 0 : y.call(l, p)) ?? null : ["JournalEntry", "Journal"].includes(t.type) ? ((E = (u = game.journal) == null ? void 0 : u.get) == null ? void 0 : E.call(u, p)) ?? null : ((M = (I = game.scenes) == null ? void 0 : I.get) == null ? void 0 : M.call(I, p)) ?? ((L = (_ = game.journal) == null ? void 0 : _.get) == null ? void 0 : L.call(_, p)) ?? null : null;
}
async function vi(e) {
  const t = await rs(e);
  return (t == null ? void 0 : t.documentName) === "Scene" ? t : null;
}
function Ii(e) {
  var ye;
  const {
    templateRoot: t,
    getRawMap: r,
    prepareMapForDisplay: c,
    upsertSystem: p,
    upsertObject: l,
    upsertRoute: y,
    upsertFaction: u,
    updateMapMetadata: E,
    deleteFaction: I,
    getTextureGuideMarkup: M,
    activateObjectEditorControls: _,
    revealSystemToPlayers: L,
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
    unlinkPlanetScene: $,
    clearMapView: me
  } = e;
  return ye = class extends mt() {
    constructor(i = {}) {
      var a;
      const s = i.mapId, n = i.playerMode ?? !((a = game.user) != null && a.isGM);
      super({
        ...i,
        id: `galaxy-map-view-${n ? "player" : "gm"}-${s}`
      });
      Y(this, "mapId");
      Y(this, "playerMode");
      Y(this, "selectedSystemId");
      Y(this, "selectedRouteId");
      Y(this, "activeSystemId");
      Y(this, "selectedObjectId");
      Y(this, "zoom");
      Y(this, "panX");
      Y(this, "panY");
      Y(this, "_drag");
      Y(this, "_contextTarget");
      Y(this, "_boundContextClose");
      Y(this, "externalFocus");
      Y(this, "_externalFocusTimeout");
      Y(this, "_pendingFocusZoom");
      Y(this, "showTerritories", !0);
      Y(this, "showRoutes", !0);
      Y(this, "hardContrast", !1);
      Y(this, "planetSystemId", null);
      Y(this, "planetStatic", !1);
      Y(this, "_planetStaticViewKey", null);
      Y(this, "_planetRenderer", null);
      Y(this, "_planetGeneration", 0);
      Y(this, "_planetReturnFocus", !1);
      Y(this, "_bountyIntelCallout", null);
      Y(this, "_planetLocationCallout", null);
      Y(this, "creationPanel", null);
      Y(this, "factionRegistry", !1);
      Y(this, "_selectionTimer", null);
      Y(this, "_worldWidth", 0);
      Y(this, "_worldHeight", 0);
      Y(this, "_viewportResizeObserver", null);
      Y(this, "_viewportStage", null);
      Y(this, "_baseWindowHeight", null);
      this.mapId = s, this.playerMode = n, this.selectedSystemId = i.selectedSystemId ?? null, this.selectedRouteId = i.selectedRouteId ?? null, this.activeSystemId = i.activeSystemId ?? null, this.selectedObjectId = i.selectedObjectId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null, this.externalFocus = null, this._externalFocusTimeout = null, this._pendingFocusZoom = null;
    }
    get title() {
      const i = r(this.mapId), s = this.playerMode ? "Player View" : "GM View";
      return i ? `${i.title} - ${s}` : `Galaxy Map - ${s}`;
    }
    async _prepareContext(i) {
      var X, ge, fe, Se, J, de, Me, _e;
      const s = await super._prepareContext(i), n = r(this.mapId), a = n ? c(n, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      }) : null;
      a != null && a.systems && (a.systems = a.systems.map((x) => ({
        ...x,
        displayType: "system",
        factionName: "System",
        factionColor: "#58d8ff",
        animatedCelestial: !1,
        hasCustomMarker: !!x.displayMarkerImage
      })), a.selectedSystem && (a.selectedSystem = a.systems.find((x) => x.id === a.selectedSystem.id) ?? null)), a != null && a.systems && this.externalFocus && (a.systems = a.systems.map((x) => x.id === this.externalFocus.systemId ? { ...x, isExternalFocus: !0, externalFocus: this.externalFocus } : x), ((X = a.selectedSystem) == null ? void 0 : X.id) === this.externalFocus.systemId && (a.selectedSystem = a.systems.find((x) => x.id === this.externalFocus.systemId))), !this.activeSystemId && this.selectedSystemId && !(a != null && a.selectedSystem) && (this.selectedSystemId = null);
      const o = (a == null ? void 0 : a.systems.find((x) => x.id === this.activeSystemId)) ?? null;
      o && (a.backgroundImage = o.backgroundImage || "");
      const d = new Map(((a == null ? void 0 : a.factions) ?? []).map((x) => [x.id, x])), f = o ? o.objects.filter((x) => !this.playerMode || Re(o, x) === "players").map((x) => {
        var Tt;
        const ce = this.playerMode && x.status === "undiscovered", pe = d.get(x.factionId), Le = ce ? "" : x.markerImage;
        return {
          ...x,
          systemId: o.id,
          displayName: ce ? "???" : x.name,
          displayDescription: ce ? "Unresolved sensor contact. Details are not available." : x.description,
          displayType: ce ? "unknown" : x.kind,
          displayStatus: ce ? "undiscovered" : x.status,
          factionName: (pe == null ? void 0 : pe.name) ?? "Unaffiliated",
          factionColor: x.iconColor || (pe == null ? void 0 : pe.color) || "#58d8ff",
          displayMarkerImage: Le,
          hasCustomMarker: !!Le,
          obscured: ce,
          gmOnly: Re(o, x) === "gm",
          isSelected: x.id === this.selectedObjectId,
          isCurrent: ((Tt = a == null ? void 0 : a.currentLocation) == null ? void 0 : Tt.objectId) === x.id,
          animatedCelestial: !Le && tt.includes(x.iconStyle),
          hasJournal: !!(!ce && x.journalId),
          hasScenes: !!(!ce && x.sceneIds.length),
          showImage: !!(!ce && x.image),
          canInspectSystem: !!qe({ ...x, obscured: ce })
        };
      }) : [];
      o && this.selectedObjectId && !f.some((x) => x.id === this.selectedObjectId) && (this.selectedObjectId = null);
      const g = f.find((x) => x.id === this.selectedObjectId) ?? null, k = new Set(f.map((x) => x.id)), O = o ? (o.routes ?? []).filter((x) => (!this.playerMode || x.visibility === "players") && k.has(x.fromSystemId) && k.has(x.toSystemId)).map((x) => {
        const ce = f.find((Le) => Le.id === x.fromSystemId), pe = f.find((Le) => Le.id === x.toSystemId);
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
      }) : [], R = O.find((x) => x.id === this.selectedRouteId) ?? null, F = f.find((x) => x.isCurrent) ?? null, H = g && F && g.id !== F.id ? O.find((x) => x.fromSystemId === F.id && x.toSystemId === g.id || x.toSystemId === F.id && x.fromSystemId === g.id) : null;
      g && (g.canTravel = !!H, g.isDestination = !!(H && !g.isCurrent), g.travelRouteId = (H == null ? void 0 : H.id) ?? ""), O.forEach((x) => {
        x.isActive = x.isSelected || x.id === (H == null ? void 0 : H.id);
      }), o && (a.systems = f, a.routes = O, a.selectedSystem = R ? null : g, a.selectedRoute = R, a.currentSystem = F);
      const B = f.find((x) => x.id === this.planetSystemId) ?? (o ? null : a == null ? void 0 : a.systems.find((x) => x.id === this.planetSystemId)), m = !this.playerMode || (n == null ? void 0 : n.visibility) === "players" ? qe(B) : null;
      m || (this.planetSystemId = null);
      const S = B && m ? `${B.id}:${m.preset}` : null;
      S !== this._planetStaticViewKey && (this._planetStaticViewKey = S, this.planetStatic = !!(S && Ns(m == null ? void 0 : m.preset)));
      const b = B && m ? this._preparePlanetLocations(B, m.shape) : [], v = B ?? g, w = !!((ge = game.user) != null && ge.isGM && !this.playerMode && o && v), T = ((v == null ? void 0 : v.sceneIds) ?? []).map((x) => {
        var ce, pe;
        return (pe = (ce = game.scenes) == null ? void 0 : ce.get) == null ? void 0 : pe.call(ce, x);
      }).filter((x) => {
        var ce, pe;
        return x && (((ce = game.user) == null ? void 0 : ce.isGM) || ((pe = x.testUserPermission) == null ? void 0 : pe.call(x, game.user, "OBSERVER")));
      }).map((x) => ({ id: x.id, uuid: x.uuid, name: x.name || "Linked Scene" })), q = v != null && v.journalId ? (Se = (fe = game.journal) == null ? void 0 : fe.get) == null ? void 0 : Se.call(fe, v.journalId) : null, D = q && ((J = game.user) != null && J.isGM || (de = q.testUserPermission) != null && de.call(q, game.user, "OBSERVER")) ? { id: q.id, uuid: q.uuid, name: q.name || "Linked Journal" } : null, W = this.creationPanel ? {
        ...this.creationPanel,
        ...this.creationPanel.data,
        kind: this.creationPanel.kind,
        entityKind: (Me = this.creationPanel.data) == null ? void 0 : Me.kind,
        isSystem: this.creationPanel.kind === "system",
        isEntity: this.creationPanel.kind === "entity",
        isRoute: this.creationPanel.kind === "route",
        isFaction: this.creationPanel.kind === "faction",
        isMap: this.creationPanel.kind === "map",
        mapTitle: (_e = this.creationPanel.data) == null ? void 0 : _e.title,
        title: this.creationPanel.kind === "map" ? "Edit Galaxy" : `${this.creationPanel.editId ? "Edit" : "Create"} ${{ system: "System", entity: "Location", route: "Route", faction: "Faction" }[this.creationPanel.kind]}`,
        submitLabel: this.creationPanel.editId ? "Save changes" : "Create",
        systemOptions: (o ? f : (a == null ? void 0 : a.systems) ?? []).map((x) => ({ id: x.id, name: x.displayName || x.name })),
        factionOptions: ((a == null ? void 0 : a.factions) ?? []).map((x) => ({ id: x.id, name: x.name }))
      } : null;
      return {
        ...s,
        map: a,
        systemView: !!(o && !m),
        activeSystem: o,
        selectedObject: g,
        planetView: !!m,
        planetSystem: B,
        planetAppearance: m,
        planetLocations: b,
        hasPlanetLocations: b.length > 0,
        canPlacePlanetLocations: w,
        linkedPlanetScenes: T,
        linkedPlanetJournal: D,
        creationPanel: W,
        factionRegistry: this.factionRegistry,
        appearanceGuideMarkup: W != null && W.isEntity ? M(W.planetShape || "sphere") : "",
        showInspector: !!(W || this.factionRegistry || m || a != null && a.selectedSystem || a != null && a.selectedRoute),
        territories: a ? ri(a.systems, a.factions) : [],
        showTerritories: this.showTerritories,
        showRoutes: this.showRoutes,
        hardContrast: this.hardContrast,
        mapId: this.mapId,
        playerMode: this.playerMode,
        zoomPercent: Math.round(this.zoom * 100),
        panX: this.panX,
        panY: this.panY,
        zoom: this.zoom,
        missingMap: !n
      };
    }
    _onRender(i, s) {
      var a, o;
      (a = this._bountyIntelCallout) == null || a.dispose(), this._bountyIntelCallout = null, this._disposePlanetRenderer(), super._onRender(i, s);
      const n = this.element;
      if (n) {
        if (this._attachPartListeners("main", n, s), this._observeViewport(n), this._applyViewportTransform(n), this._mountBountyIntelCallout(n), this.externalFocus && this._pendingFocusZoom !== null) {
          const d = z(r(this.mapId)).systems.find((f) => f.id === this.externalFocus.systemId);
          d && this._centerOnSystem(d, n, this._pendingFocusZoom), this._pendingFocusZoom = null;
        }
        i.planetView ? this._mountPlanetRenderer(n, i.planetAppearance) : this._planetReturnFocus && ((o = n.querySelector("[data-action='inspect-system']")) == null || o.focus(), this._planetReturnFocus = !1);
      }
    }
    _attachPartListeners(i, s, n) {
      var f, g, k, O, R, F, H, B, m, S, b, v, w, T, q, D, W, X, ge, fe, Se;
      const a = (f = s.matches) != null && f.call(s, ".gmf-map-stage") ? s : (g = s.querySelector) == null ? void 0 : g.call(s, ".gmf-map-stage, .gmf-planet-stage");
      if ((a == null ? void 0 : a.dataset.gmfMapBound) === "true") return;
      a && (a.dataset.gmfMapBound = "true");
      const o = (k = a == null ? void 0 : a.matches) != null && k.call(a, ".gmf-map-stage") ? a : null;
      super._attachPartListeners(i, s, n), We(this, s), this._attachPlanetListeners(s), this._attachCreationPanel(s);
      const d = s.querySelector(".gmf-object-appearance-panel");
      d && (_(d), this._attachAppearancePreview(s)), (O = s.querySelector("[data-action='toggle-territories']")) == null || O.addEventListener("click", () => {
        this.showTerritories = !this.showTerritories, this.render({ force: !0 });
      }), (R = s.querySelector("[data-action='toggle-routes']")) == null || R.addEventListener("click", () => {
        this.showRoutes = !this.showRoutes, this.render({ force: !0 });
      }), (F = s.querySelector("[data-action='edit-current-layer']")) == null || F.addEventListener("click", () => {
        var J;
        !((J = game.user) != null && J.isGM) || this.playerMode || (this.activeSystemId ? this._openEditPanel("system", this.activeSystemId) : this._openCreationPanel("map", z(r(this.mapId)), this.mapId));
      }), (H = s.querySelector("[data-action='toggle-hard-contrast']")) == null || H.addEventListener("click", (J) => {
        var Me;
        this.hardContrast = !this.hardContrast;
        const de = (Me = s.matches) != null && Me.call(s, ".gmf-galaxy") ? s : s.querySelector(".gmf-galaxy");
        de == null || de.classList.toggle("is-hard-contrast", this.hardContrast), J.currentTarget.setAttribute("aria-pressed", String(this.hardContrast));
      }), s.querySelectorAll("[data-system-id]").forEach((J) => {
        var de, Me;
        J.addEventListener("click", (_e) => {
          if (J.dataset.dragged === "true") {
            J.dataset.dragged = "false";
            return;
          }
          _e.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = globalThis.setTimeout(() => {
            this.activeSystemId ? this.selectedObjectId = J.dataset.systemId : this.selectedSystemId = J.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
          }, 180);
        }), J.addEventListener("dblclick", (_e) => {
          var ce;
          _e.preventDefault(), _e.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
          const x = J.dataset.systemId;
          if (this.selectedRouteId = null, this.creationPanel = null, this.activeSystemId) {
            this.selectedObjectId = x;
            const pe = (ce = z(r(this.mapId)).systems.find((Le) => Le.id === this.activeSystemId)) == null ? void 0 : ce.objects.find((Le) => Le.id === x);
            qe(pe) && (this.planetSystemId = x);
          } else
            this.selectedSystemId = x, this.activeSystemId = x, this.selectedObjectId = null;
          this.render({ force: !0 });
        }), !this.playerMode && ((de = game.user) != null && de.isGM) && ((Me = J.querySelector("[data-resize-marker]")) == null || Me.addEventListener("pointerdown", (_e) => this._startMarkerResize(_e, J)), J.addEventListener("pointerdown", (_e) => this._startSystemDrag(_e, s, J)));
      }), this._mountBountyIntelCallout(s), s.querySelectorAll("[data-route-id]").forEach((J) => {
        J.addEventListener("click", (de) => {
          var Me;
          if (de.stopPropagation(), this.selectedRouteId = J.dataset.routeId, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, !this.playerMode && ((Me = game.user) != null && Me.isGM)) {
            this._openEditPanel("route", J.dataset.routeId);
            return;
          }
          this.render({ force: !0 });
        });
      }), o == null || o.addEventListener("wheel", (J) => this._onWheelZoom(J, s), { passive: !1 }), o == null || o.addEventListener("pointerdown", (J) => this._startPan(J, s)), o == null || o.addEventListener("contextmenu", (J) => this._openContextMenu(J, s), { capture: !0 }), s.querySelectorAll("[data-context-action]").forEach((J) => {
        J.addEventListener("click", (de) => this._handleContextAction(de, s));
      }), (B = s.querySelector("[data-action='open-journal']")) == null || B.addEventListener("click", () => this._openLinkedJournal()), (m = s.querySelector("[data-action='edit-system']")) == null || m.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._openEditPanel("entity", this.selectedObjectId) : this.selectedSystemId && this._openEditPanel("system", this.selectedSystemId);
      }), (S = s.querySelector("[data-action='open-system']")) == null || S.addEventListener("click", () => {
        this.selectedSystemId && (this.activeSystemId = this.selectedSystemId, this.selectedObjectId = null, this.selectedRouteId = null, this.render({ force: !0 }));
      }), (b = s.querySelector("[data-action='navigate-up']")) == null || b.addEventListener("click", () => {
        if (this.creationPanel = null, this.planetSystemId)
          this._disposePlanetRenderer(), this.planetSystemId = null, this._planetReturnFocus = !0;
        else if (this.activeSystemId)
          this.activeSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null;
        else return;
        this.render({ force: !0 });
      }), (v = s.querySelector("[data-action='reveal-system']")) == null || v.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? U(this.mapId, this.activeSystemId, this.selectedObjectId, "players") : this.selectedSystemId && L(this.mapId, this.selectedSystemId);
      }), (w = s.querySelector("[data-action='hide-system']")) == null || w.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? U(this.mapId, this.activeSystemId, this.selectedObjectId, "gm") : this.selectedSystemId && N(this.mapId, this.selectedSystemId, !0);
      }), (T = s.querySelector("[data-action='delete-system']")) == null || T.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._confirmDeleteObject(this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), (q = s.querySelector("[data-action='set-current-system']")) == null || q.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? V(this.mapId, this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && re(this.mapId, this.selectedSystemId);
      }), (D = s.querySelector("[data-action='travel-to-system']")) == null || D.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? ie(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, s));
      }), (W = s.querySelector("[data-action='travel-to-object']")) == null || W.addEventListener("click", () => {
        !this.activeSystemId || !this.selectedObjectId || (this.playerMode ? ne(this.mapId, this.activeSystemId, this.selectedObjectId) : this._travelToObject(this.activeSystemId, this.selectedObjectId, s));
      }), (X = s.querySelector("[data-action='edit-route']")) == null || X.addEventListener("click", () => {
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
      var a, o;
      const s = i.querySelector(".gmf-map-stage");
      if (!s || s !== this._viewportStage || !s.isConnected || !((a = this.element) != null && a.contains(s))) return;
      const n = i.querySelector(".gmf-map-viewport");
      if (n) {
        if (s) {
          const d = s.getBoundingClientRect(), f = n.querySelector(".gmf-map-background");
          f && (this.zoom = Math.max(1, this.zoom));
          const g = f != null && f.naturalWidth && (f != null && f.naturalHeight) ? f.naturalWidth / f.naturalHeight : null;
          g ? this._adjustWindowToBackground(s, g) : f || this._adjustWindowToBackground(s, null);
          const k = d.width / Math.max(1, d.height);
          g && g > k ? (this._worldWidth = d.width, this._worldHeight = d.width / g) : g ? (this._worldHeight = d.height, this._worldWidth = d.height * g) : (this._worldWidth = d.width, this._worldHeight = d.height), n.style.width = `${this._worldWidth}px`, n.style.height = `${this._worldHeight}px`;
          const O = this._worldWidth * this.zoom, R = this._worldHeight * this.zoom;
          this.panX = O <= d.width ? (d.width - O) / 2 : le(this.panX, d.width - O, 0), this.panY = R <= d.height ? (d.height - R) / 2 : le(this.panY, d.height - R, 0), f && f.dataset.gmfWorldImageBound !== "true" && (f.dataset.gmfWorldImageBound = "true", f.addEventListener("load", () => this._applyViewportTransform(i), { once: !0 }));
        }
        n.style.setProperty("--gmf-pan-x", `${this.panX}px`), n.style.setProperty("--gmf-pan-y", `${this.panY}px`), n.style.setProperty("--gmf-zoom", String(this.zoom)), (o = i.querySelector("[data-zoom-label]")) == null || o.replaceChildren(`${Math.round(this.zoom * 100)}%`);
      }
    }
    _adjustWindowToBackground(i, s) {
      const n = i.closest(".window-app, .application, .app");
      if (!n || !this.setPosition) return;
      const a = n.getBoundingClientRect();
      if (!s) {
        this._baseWindowHeight && Math.abs(a.height - this._baseWindowHeight) > 2 && this.setPosition({ height: Math.min(this._baseWindowHeight, window.innerHeight - 24) }), this._baseWindowHeight = null;
        return;
      }
      this._baseWindowHeight ?? (this._baseWindowHeight = a.height);
      const o = i.getBoundingClientRect(), d = le(o.width / s, 240, window.innerHeight - 96);
      if (Math.abs(o.height - d) <= 2) return;
      const f = le(a.height + d - o.height, 320, window.innerHeight - 24);
      this.setPosition({ height: Math.round(f) });
    }
    _observeViewport(i) {
      var n;
      (n = this._viewportResizeObserver) == null || n.disconnect();
      const s = i.querySelector(".gmf-map-stage");
      this._viewportStage = s, s && (this._viewportResizeObserver = new ResizeObserver(() => this._applyViewportTransform(i)), this._viewportResizeObserver.observe(s));
    }
    _setZoom(i, s) {
      const n = s.querySelector(".gmf-map-background") ? 1 : Ze;
      this.zoom = le(i, n, Ke), this._applyViewportTransform(s);
    }
    _mountBountyIntelCallout(i) {
      var a;
      if (this._bountyIntelCallout || i.querySelector(".gmf-intel-callout")) return;
      const s = (a = i.matches) != null && a.call(i, ".gmf-map-stage") ? i : i.querySelector(".gmf-map-stage"), n = i;
      !s || !n.querySelector("[data-intel-layer]") || (this._bountyIntelCallout = hi({
        root: n,
        stage: s,
        resolveItems: (o) => {
          var g;
          const d = z(r(this.mapId)), f = this.activeSystemId ? (g = d.systems.find((k) => k.id === this.activeSystemId)) == null ? void 0 : g.objects.find((k) => k.id === o) : d.systems.find((k) => k.id === o);
          return f ? oi(f) : [];
        },
        onOpen: (o) => ci(o)
      }));
    }
    _attachPlanetListeners(i) {
      var s, n, a, o, d, f;
      (s = i.querySelector("[data-action='inspect-system']")) == null || s.addEventListener("click", () => {
        var k, O;
        const g = r(this.mapId);
        if (!(this.playerMode && (g == null ? void 0 : g.visibility) !== "players")) {
          if (this.activeSystemId) {
            const F = (k = z(g).systems.find((H) => H.id === this.activeSystemId)) == null ? void 0 : k.objects.find((H) => H.id === this.selectedObjectId);
            if (!qe(F)) return;
            this.planetSystemId = this.selectedObjectId;
          } else {
            this.activeSystemId = this.selectedSystemId;
            const R = z(g);
            this.selectedObjectId = ((O = R.systems.find((F) => F.id === this.activeSystemId)) == null ? void 0 : O.primaryObjectId) ?? null, this.planetSystemId = this.selectedObjectId;
          }
          this.render({ force: !0 });
        }
      }), (n = i.querySelector("[data-action='planet-pause']")) == null || n.addEventListener("click", () => {
        var g;
        return (g = this._planetRenderer) == null ? void 0 : g.setPaused(!this._planetRenderer.paused);
      }), (a = i.querySelector("[data-action='planet-zoom-in']")) == null || a.addEventListener("click", () => {
        var g;
        return (g = this._planetRenderer) == null ? void 0 : g.zoom(-0.25);
      }), (o = i.querySelector("[data-action='planet-zoom-out']")) == null || o.addEventListener("click", () => {
        var g;
        return (g = this._planetRenderer) == null ? void 0 : g.zoom(0.25);
      }), (d = i.querySelector("[data-action='planet-reset']")) == null || d.addEventListener("click", () => {
        var g;
        return (g = this._planetRenderer) == null ? void 0 : g.reset();
      }), (f = i.querySelector("[data-action='planet-static']")) == null || f.addEventListener("click", () => {
        this.planetStatic = !this.planetStatic, this.render({ force: !0 });
      }), this._attachPlanetLocationList(i), this._attachLinkedContentDrop(i);
    }
    _getPlanetObject() {
      var s;
      return ((s = z(r(this.mapId)).systems.find((n) => n.id === this.activeSystemId)) == null ? void 0 : s.objects.find((n) => n.id === this.planetSystemId)) ?? null;
    }
    _preparePlanetLocations(i, s) {
      return ((i == null ? void 0 : i.planetLocations) ?? []).filter((n) => n.shape === s).map((n) => {
        var d, f, g, k, O, R;
        const a = (f = (d = game.scenes) == null ? void 0 : d.get) == null ? void 0 : f.call(d, n.sceneId), o = !!(a && ((g = game.user) != null && g.isGM || (k = a.testUserPermission) != null && k.call(a, game.user, "OBSERVER")));
        return {
          ...n,
          name: a ? o || (O = game.user) != null && O.isGM ? a.name || "Linked Scene" : "Restricted location" : "Missing linked scene",
          accessible: o,
          missing: !a,
          canRemove: !!((R = game.user) != null && R.isGM && !this.playerMode)
        };
      });
    }
    _getPlanetLocationItem(i) {
      var n;
      const s = this._getPlanetObject();
      return this._preparePlanetLocations(s, (n = qe(s)) == null ? void 0 : n.shape).find((a) => a.id === i) ?? null;
    }
    _attachPlanetLocationList(i) {
      var a;
      const s = this.element ?? i;
      i.querySelectorAll("[data-planet-scene-drag]").forEach((o) => o.addEventListener("dragstart", (d) => {
        d.dataTransfer && (d.dataTransfer.setData("text/plain", JSON.stringify({ type: "Scene", id: o.dataset.planetSceneDrag, uuid: o.dataset.planetSceneUuid })), d.dataTransfer.effectAllowed = "link");
      })), i.querySelectorAll("[data-unlink-planet-scene]").forEach((o) => o.addEventListener("click", async (d) => {
        var O, R, F;
        d.preventDefault(), d.stopPropagation();
        const f = o.dataset.unlinkPlanetScene ?? "", g = this.planetSystemId || this.selectedObjectId;
        if (!f || !this.activeSystemId || !g) return;
        const k = ((F = (R = (O = game.scenes) == null ? void 0 : O.get) == null ? void 0 : R.call(O, f)) == null ? void 0 : F.name) || "Scene";
        await $(this.mapId, this.activeSystemId, g, f) && te(`${k} unlinked from this location.`);
      })), i.querySelectorAll("[data-open-linked-scene]").forEach((o) => o.addEventListener("click", () => {
        var f, g, k;
        const d = (g = (f = game.scenes) == null ? void 0 : f.get) == null ? void 0 : g.call(f, o.dataset.openLinkedScene ?? "");
        d != null && d.view ? d.view() : (k = d == null ? void 0 : d.sheet) == null || k.render(!0);
      })), i.querySelectorAll("[data-open-planet-location]").forEach((o) => o.addEventListener("click", () => this._openPlanetLocation(o.dataset.openPlanetLocation ?? ""))), i.querySelectorAll("[data-remove-planet-location]").forEach((o) => o.addEventListener("click", () => this._removePlanetLocation(o.dataset.removePlanetLocation ?? "", i))), i.querySelectorAll("[data-planet-location-drag]").forEach((o) => {
        o.addEventListener("dragstart", (d) => {
          var g;
          if (!d.dataTransfer) return;
          const f = o.dataset.planetLocationDrag ?? "";
          d.dataTransfer.setData("application/x-gmf-surface-location", f), d.dataTransfer.setData("text/plain", JSON.stringify({ type: "GalaxySurfaceLocation", locationId: f })), d.dataTransfer.effectAllowed = "move", (g = s.querySelector("[data-planet-location-trash]")) == null || g.classList.add("is-armed");
        }), o.addEventListener("dragend", () => {
          var d;
          return (d = s.querySelector("[data-planet-location-trash]")) == null ? void 0 : d.classList.remove("is-armed", "is-dragover");
        });
      });
      const n = s.querySelector("[data-planet-location-trash]");
      (n == null ? void 0 : n.dataset.gmfTrashBound) !== "true" && (n && (n.dataset.gmfTrashBound = "true"), n == null || n.addEventListener("dragover", (o) => {
        var d;
        (d = o.dataTransfer) != null && d.types.includes("application/x-gmf-surface-location") && (o.preventDefault(), o.dataTransfer.dropEffect = "move", n.classList.add("is-dragover"));
      }), n == null || n.addEventListener("dragleave", () => n.classList.remove("is-dragover")), n == null || n.addEventListener("drop", (o) => {
        var f;
        o.preventDefault();
        const d = ((f = o.dataTransfer) == null ? void 0 : f.getData("application/x-gmf-surface-location")) ?? "";
        n.classList.remove("is-armed", "is-dragover"), d && this._removePlanetLocation(d, i);
      })), (a = i.querySelector("[data-clear-planet-locations]")) == null || a.addEventListener("click", () => this._clearPlanetLocations(i));
    }
    _attachLinkedContentDrop(i) {
      var n, a;
      const s = i.querySelector("[data-linked-content-drop]");
      !s || !((n = game.user) != null && n.isGM) || this.playerMode || (s.addEventListener("dragover", (o) => {
        o.preventDefault(), o.dataTransfer && (o.dataTransfer.dropEffect = "link"), s.classList.add("is-document-dragover");
      }), s.addEventListener("dragleave", (o) => {
        s.contains(o.relatedTarget) || s.classList.remove("is-document-dragover");
      }), s.addEventListener("drop", async (o) => {
        var k;
        o.preventDefault(), o.stopPropagation(), s.classList.remove("is-document-dragover");
        const d = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !d) return;
        const f = await rs(o), g = (k = z(r(this.mapId)).systems.find((O) => O.id === this.activeSystemId)) == null ? void 0 : k.objects.find((O) => O.id === d);
        if (!f || !g) {
          se("Drop a Foundry Scene or Journal here.");
          return;
        }
        if (f.documentName === "Scene") {
          const O = [.../* @__PURE__ */ new Set([...g.sceneIds ?? [], f.id])];
          await l(this.mapId, this.activeSystemId, { ...g, sceneIds: O }), te(`${f.name || "Scene"} linked to ${g.name}.`);
        } else if (f.documentName === "JournalEntry")
          await l(this.mapId, this.activeSystemId, { ...g, journalId: f.id }), te(`${f.name || "Journal"} linked to ${g.name}.`);
        else {
          se("Drop a Foundry Scene or Journal here.");
          return;
        }
      }), (a = i.querySelector("[data-unlink-linked-journal]")) == null || a.addEventListener("click", async (o) => {
        var g;
        o.preventDefault(), o.stopPropagation();
        const d = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !d) return;
        const f = (g = z(r(this.mapId)).systems.find((k) => k.id === this.activeSystemId)) == null ? void 0 : g.objects.find((k) => k.id === d);
        f && await l(this.mapId, this.activeSystemId, { ...f, journalId: "" });
      }));
    }
    _openPlanetLocation(i) {
      var a, o, d;
      const s = this._getPlanetLocationItem(i), n = s ? (o = (a = game.scenes) == null ? void 0 : a.get) == null ? void 0 : o.call(a, s.sceneId) : null;
      if (!s || !n || !s.accessible) {
        se(s != null && s.missing ? "That location is unavailable." : "You do not have permission to view that scene.");
        return;
      }
      n.view ? n.view() : (d = n.sheet) == null || d.render(!0);
    }
    async _removePlanetLocation(i, s) {
      var a;
      if (!((a = game.user) != null && a.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const n = this._getPlanetLocationItem(i);
      !n || !await xe(this.mapId, this.activeSystemId, this.planetSystemId, i) || (this._syncPlanetLocations(s), te(`${n.name} removed from the surface.`));
    }
    async _clearPlanetLocations(i) {
      var a, o;
      if (!((a = game.user) != null && a.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const s = this._getPlanetObject(), n = this._preparePlanetLocations(s, (o = qe(s)) == null ? void 0 : o.shape);
      for (const d of n) await xe(this.mapId, this.activeSystemId, this.planetSystemId, d.id);
      this._syncPlanetLocations(i), n.length && te(`Cleared ${n.length} surface location${n.length === 1 ? "" : "s"}.`);
    }
    async _placePlanetLocation(i, s, n) {
      var f;
      if (!((f = game.user) != null && f.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const a = await vi(i);
      if (!a) {
        se("Drop a Foundry Scene onto the 3D surface.");
        return;
      }
      const o = this._getPlanetObject();
      if (!(o != null && o.sceneIds.includes(a.id))) {
        se(`Link ${a.name || "this scene"} to the object before placing it on the surface.`);
        return;
      }
      await ke(this.mapId, this.activeSystemId, this.planetSystemId, { ...s, sceneId: a.id }) && (this._syncPlanetLocations(n), te(`${a.name || "Scene"} placed on the ${s.shape}. Drag it again to move it.`));
    }
    _syncPlanetLocations(i) {
      var d, f, g;
      const s = this.element ?? i, n = this._getPlanetObject(), a = this._preparePlanetLocations(n, (d = qe(n)) == null ? void 0 : d.shape);
      (f = this._planetRenderer) == null || f.setLocations((n == null ? void 0 : n.planetLocations) ?? []);
      const o = s.querySelector("[data-planet-location-list]");
      o && (o.innerHTML = a.length ? a.map((k) => `
        <div class="gmf-planet-location-row ${k.accessible ? "" : "is-restricted"}" ${k.canRemove ? `draggable="true" data-planet-location-drag="${ve(k.id)}" title="Drag to the trash bin to remove"` : ""}>
          <button type="button" data-open-planet-location="${ve(k.id)}" ${k.accessible ? "" : "disabled"}><i class="fa-solid ${k.accessible ? "fa-location-dot" : "fa-lock"}"></i><span>${ve(k.name)}</span></button>
          ${k.canRemove ? `<button type="button" data-remove-planet-location="${ve(k.id)}" title="Remove location" aria-label="Remove ${ve(k.name)}"><i class="fa-solid fa-trash"></i></button>` : ""}
        </div>`).join("") : '<p class="gmf-planet-locations__empty">No surface locations placed.</p>', this._attachPlanetLocationList(o), (g = s.querySelector("[data-planet-location-removal]")) == null || g.toggleAttribute("hidden", a.length === 0));
    }
    refreshPlanetLocations(i, s) {
      this.activeSystemId !== i || this.planetSystemId !== s || this.element && this._syncPlanetLocations(this.element);
    }
    async focusSystem(i, s = {}) {
      var R;
      const n = z(r(this.mapId));
      if (!n.systems.find((F) => F.id === i)) return !1;
      const o = c(n, {
        playerMode: this.playerMode,
        selectedSystemId: i,
        selectedRouteId: null
      });
      if (!((R = o == null ? void 0 : o.systems) != null && R.some((F) => F.id === i))) return !1;
      const d = String(s.focusId || i).slice(0, 80), f = ["distress", "warning", "objective", "custom"].includes(s.kind) ? s.kind : "custom", g = /^#[0-9a-f]{6}$/i.test(s.color ?? "") ? s.color : f === "distress" ? "#ff5c7a" : "#58d8ff", k = le(Number(s.duration) || 0, 0, 6e5), O = le(Number(s.zoom) || 1.45, Ze, Ke);
      return this.externalFocus = {
        id: d,
        systemId: i,
        kind: f,
        color: g,
        label: String(s.label || (f === "distress" ? "Distress signal" : "Signal located")).slice(0, 120)
      }, this.selectedSystemId = i, this.planetSystemId = null, this.selectedRouteId = null, this._pendingFocusZoom = O, this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, await this.render({ force: !0 }), this.bringToFront(), k > 0 && (this._externalFocusTimeout = globalThis.setTimeout(() => {
        var F;
        ((F = this.externalFocus) == null ? void 0 : F.id) === d && this.clearSystemFocus(d);
      }, k)), !0;
    }
    async focusLocation(i, s = "", n = {}) {
      const o = z(r(this.mapId)).systems.find((f) => f.id === i), d = (o == null ? void 0 : o.objects.find((f) => f.id === s)) ?? (o == null ? void 0 : o.objects.find((f) => f.id === o.primaryObjectId));
      return !o || !d || this.playerMode && (o.visibility !== "players" || Re(o, d) !== "players") ? !1 : (this.activeSystemId = o.id, this.selectedSystemId = o.id, this.selectedObjectId = d.id, this.selectedRouteId = null, this.planetSystemId = n.detail === !0 && qe(d) ? d.id : null, await this.render({ force: !0 }), this.bringToFront(), !0);
    }
    clearSystemFocus(i = "") {
      return !this.externalFocus || i && this.externalFocus.id !== i ? !1 : (this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, this._pendingFocusZoom = null, this.externalFocus = null, this.rendered && this.render({ force: !0 }), !0);
    }
    _centerOnSystem(i, s, n) {
      const a = s.querySelector(".gmf-map-stage");
      if (!a) return;
      const o = a.getBoundingClientRect();
      this.zoom = n, this.panX = o.width / 2 - Number(i.x) / 100 * this._worldWidth * n, this.panY = o.height / 2 - Number(i.y) / 100 * this._worldHeight * n, this._applyViewportTransform(s);
    }
    _onWheelZoom(i, s) {
      i.preventDefault();
      const n = s.querySelector(".gmf-map-stage");
      if (!n) return;
      const a = n.getBoundingClientRect(), o = this.zoom, d = s.querySelector(".gmf-map-background") ? 1 : Ze, f = le(o * Math.exp(-i.deltaY * 15e-4), d, Ke), g = i.clientX - a.left, k = i.clientY - a.top, O = (g - this.panX) / o, R = (k - this.panY) / o;
      this.zoom = f, this.panX = g - O * f, this.panY = k - R * f, this._applyViewportTransform(s);
    }
    _startPan(i, s) {
      if (i.button !== 0 || i.target.closest("[data-system-id], [data-route-id], button, input")) return;
      i.preventDefault();
      const n = i.clientX, a = i.clientY, o = this.panX, d = this.panY;
      let f = !1;
      const g = (O) => {
        f = f || Math.abs(O.clientX - n) > 3 || Math.abs(O.clientY - a) > 3, this.panX = o + O.clientX - n, this.panY = d + O.clientY - a, this._applyViewportTransform(s);
      }, k = () => {
        window.removeEventListener("pointermove", g), window.removeEventListener("pointerup", k), f || (this.selectedRouteId = null, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, this.render({ force: !0 }));
      };
      window.addEventListener("pointermove", g), window.addEventListener("pointerup", k, { once: !0 });
    }
    _startSystemDrag(i, s, n) {
      var H;
      if (i.button !== 0) return;
      i.preventDefault(), i.stopPropagation(), (H = n.setPointerCapture) == null || H.call(n, i.pointerId);
      const a = i.clientX, o = i.clientY;
      let d = this._pointerToMapPercent(i, s), f = !1, g = null;
      const k = Array.from(s.querySelectorAll(`[data-route-from="${n.dataset.systemId}"]`)), O = Array.from(s.querySelectorAll(`[data-route-to="${n.dataset.systemId}"]`)), R = (B) => {
        const m = Math.abs(B.clientX - a), S = Math.abs(B.clientY - o);
        !f && m <= 4 && S <= 4 || (f = !0, n.classList.add("is-dragging"), d = this._pointerToMapPercent(B, s), n.dataset.dragged = "true", !g && (g = requestAnimationFrame(() => {
          g = null, n.style.left = `${d.x}%`, n.style.top = `${d.y}%`, this._updateConnectedRoutes(k, O, d.x, d.y);
        })));
      }, F = async () => {
        g && cancelAnimationFrame(g), n.classList.remove("is-dragging"), window.removeEventListener("pointermove", R), window.removeEventListener("pointerup", F), f && (n.style.left = `${d.x}%`, n.style.top = `${d.y}%`, this._updateConnectedRoutes(k, O, d.x, d.y), this.activeSystemId ? await he(this.mapId, this.activeSystemId, n.dataset.systemId, d.x, d.y) : await ue(this.mapId, n.dataset.systemId, d.x, d.y));
      };
      window.addEventListener("pointermove", R), window.addEventListener("pointerup", F, { once: !0 });
    }
    _startMarkerResize(i, s) {
      var R;
      if (i.button !== 0) return;
      i.preventDefault(), i.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
      const n = le(Number(s.dataset.iconSize) || 28, 18, 56), a = s.getBoundingClientRect(), o = a.left + a.width / 2, d = a.top + a.height / 2, f = Math.hypot(i.clientX - o, i.clientY - d);
      let g = n;
      s.dataset.dragged = "true", s.classList.add("is-resizing"), (R = s.setPointerCapture) == null || R.call(s, i.pointerId);
      const k = (F) => {
        const H = Math.hypot(F.clientX - o, F.clientY - d);
        g = le(Math.round(n + (H - f) / Math.max(this.zoom, 0.01)), 18, 56), s.dataset.iconSize = String(g), s.style.setProperty("--gmf-system-size", `${g}px`);
      }, O = async () => {
        if (s.classList.remove("is-resizing"), window.removeEventListener("pointermove", k), window.removeEventListener("pointerup", O), window.removeEventListener("pointercancel", O), globalThis.setTimeout(() => {
          s.dataset.dragged = "false";
        }, 0), g !== n)
          if (this.activeSystemId) {
            const F = z(r(this.mapId)).systems.find((B) => B.id === this.activeSystemId), H = F == null ? void 0 : F.objects.find((B) => B.id === s.dataset.systemId);
            H && await l(this.mapId, this.activeSystemId, { ...H, iconSize: g });
          } else
            await p(this.mapId, { id: s.dataset.systemId, iconSize: g });
      };
      window.addEventListener("pointermove", k), window.addEventListener("pointerup", O, { once: !0 }), window.addEventListener("pointercancel", O, { once: !0 });
    }
    _pointerToMapPercent(i, s) {
      const a = s.querySelector(".gmf-map-stage").getBoundingClientRect();
      return {
        x: le((i.clientX - a.left - this.panX) / this.zoom / this._worldWidth * 100, 0, 100),
        y: le((i.clientY - a.top - this.panY) / this.zoom / this._worldHeight * 100, 0, 100)
      };
    }
    _updateConnectedRoutes(i, s, n, a) {
      i.forEach((o) => {
        o.setAttribute("x1", n), o.setAttribute("y1", a);
      }), s.forEach((o) => {
        o.setAttribute("x2", n), o.setAttribute("y2", a);
      });
    }
    _openContextMenu(i, s) {
      var m;
      if (!((m = game.user) != null && m.isGM) || this.playerMode || i.target.closest(".gmf-context-menu")) return;
      i.preventDefault(), i.stopPropagation();
      const n = i.target.closest("[data-route-id]"), a = i.target.closest("[data-system-id]"), o = this._pointerToMapPercent(i, s);
      this._contextTarget = n ? { type: "route", id: n.dataset.routeId, position: o } : a ? { type: "system", id: a.dataset.systemId, position: o } : { type: "stage", id: null, position: o };
      const d = s.querySelector("[data-gmf-context-menu]");
      if (!d) return;
      d.querySelectorAll("[data-context-show]").forEach((S) => {
        S.hidden = S.dataset.contextShow !== this._contextTarget.type;
      }), d.hidden = !1;
      const f = d.offsetWidth || 184, g = d.offsetHeight || 260, O = s.querySelector(".gmf-map-stage").getBoundingClientRect(), R = i.clientX - O.left, F = i.clientY - O.top, H = Math.max(4, O.width - f - 4), B = Math.max(4, O.height - g - 4);
      d.style.left = `${le(R, 4, H)}px`, d.style.top = `${le(F, 4, B)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(s), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu(i = null) {
      const s = i ?? this.element ?? null, n = s == null ? void 0 : s.querySelector("[data-gmf-context-menu]");
      n && (n.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(i, s) {
      i.preventDefault(), i.stopPropagation();
      const n = i.currentTarget.dataset.contextAction, a = this._contextTarget;
      this._hideContextMenu(s), a && (n === "add-system" ? this._openCreationPanel("system", { x: a.position.x, y: a.position.y }) : n === "add-entity" ? this.activeSystemId && this._openCreationPanel("entity", { x: a.position.x, y: a.position.y }) : n === "manage-factions" ? (this.creationPanel = null, this.factionRegistry = !0, this.render({ force: !0 })) : n === "add-faction" ? this._openCreationPanel("faction") : n === "edit-map-details" ? this._openCreationPanel("map", z(r(this.mapId)), this.mapId) : n === "export-map" ? C(this.mapId) : n === "edit-system" ? this._openEditPanel("system", a.id) : n === "edit-entity" ? this.activeSystemId && this._openEditPanel("entity", a.id) : n === "add-route-from-marker" ? this._openCreationPanel("route", { fromSystemId: a.id }) : n === "reveal-system" ? await L(this.mapId, a.id) : n === "hide-system" ? await N(this.mapId, a.id, !0) : n === "delete-system" ? await this._confirmDeleteSystem(a.id) : n === "reveal-entity" ? this.activeSystemId && await U(this.mapId, this.activeSystemId, a.id, "players") : n === "hide-entity" ? this.activeSystemId && await U(this.mapId, this.activeSystemId, a.id, "gm") : n === "delete-entity" ? this.activeSystemId && await this._confirmDeleteObject(this.activeSystemId, a.id) : n === "edit-route" ? this._openEditPanel("route", a.id) : n === "reveal-route" ? await G(this.mapId, a.id, this.activeSystemId ?? "") : n === "hide-route" ? await oe(this.mapId, a.id, !0, this.activeSystemId ?? "") : n === "delete-route" && await this._confirmDeleteRoute(a.id));
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
    _openCreationPanel(i, s = {}, n = null) {
      var g, k, O, R;
      if (!((g = game.user) != null && g.isGM) || this.playerMode) return;
      const a = z(r(this.mapId)), o = this.activeSystemId ? ((k = a.systems.find((F) => F.id === this.activeSystemId)) == null ? void 0 : k.objects) ?? [] : a.systems;
      if (i === "route" && o.length < 2) {
        se(this.activeSystemId ? "Create at least two locations before adding a route." : "Create at least two systems before adding a route.");
        return;
      }
      const d = s.fromSystemId || ((O = o[0]) == null ? void 0 : O.id) || "", f = i === "map" ? { title: "Galaxy Map", subtitle: "", description: "", backgroundImage: "", visibility: "players", travelApprovalMode: "unanimous" } : i === "system" ? { name: "New System", status: "known", visibility: "gm", description: "", markerImage: "", backgroundImage: "" } : i === "entity" ? {
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
        editId: n,
        data: {
          ...f,
          ...s,
          x: Number.isFinite(Number(s.x)) ? Number(s.x) : 50,
          y: Number.isFinite(Number(s.y)) ? Number(s.y) : 50,
          fromSystemId: d,
          toSystemId: s.toSystemId || ((R = o.find((F) => F.id !== d)) == null ? void 0 : R.id) || ""
        }
      }, this.factionRegistry = !1, this.selectedSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null, this.render({ force: !0 });
    }
    _openEditPanel(i, s) {
      var o, d;
      const n = z(r(this.mapId)), a = i === "system" ? n.systems.find((f) => f.id === s) : i === "entity" ? (o = n.systems.find((f) => f.id === this.activeSystemId)) == null ? void 0 : o.objects.find((f) => f.id === s) : i === "route" ? this.activeSystemId ? (d = n.systems.find((f) => f.id === this.activeSystemId)) == null ? void 0 : d.routes.find((f) => f.id === s) : n.routes.find((f) => f.id === s) : n.factions.find((f) => f.id === s);
      a && this._openCreationPanel(i, a, s);
    }
    openEditor(i, s = {}) {
      var n;
      return !((n = game.user) != null && n.isGM) || this.playerMode ? !1 : (this._disposePlanetRenderer(), this.planetSystemId = null, i === "entity" ? (this.activeSystemId = s.systemId || this.activeSystemId, this.selectedSystemId = this.activeSystemId) : i === "route" ? this.activeSystemId = s.systemId || null : ["map", "system", "faction"].includes(i) && (this.activeSystemId = null), i === "map" ? this._openCreationPanel("map", z(r(this.mapId)), this.mapId) : s.id ? this._openEditPanel(i, s.id) : this._openCreationPanel(i, s.defaults || {}), !0);
    }
    _attachCreationPanel(i) {
      var n, a, o;
      (n = i.querySelector("[data-action='cancel-panel-create']")) == null || n.addEventListener("click", () => {
        this.creationPanel = null, this.render({ force: !0 });
      }), (a = i.querySelector("[data-action='close-faction-registry']")) == null || a.addEventListener("click", () => {
        this.factionRegistry = !1, this.render({ force: !0 });
      }), (o = i.querySelector("[data-action='add-inline-faction']")) == null || o.addEventListener("click", () => this._openCreationPanel("faction")), i.querySelectorAll("[data-edit-inline-faction]").forEach((d) => {
        d.addEventListener("click", () => this._openEditPanel("faction", d.dataset.editInlineFaction || ""));
      }), i.querySelectorAll("[data-delete-inline-faction]").forEach((d) => {
        d.addEventListener("click", async () => {
          await Dialog.confirm({ title: "Delete Faction", content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>" }, $e) && (await I(this.mapId, d.dataset.deleteInlineFaction), this.factionRegistry = !0, this.render({ force: !0 }));
        });
      });
      const s = i.querySelector("[data-panel-create-form]");
      s && (ns(s), s.addEventListener("submit", async (d) => {
        d.preventDefault();
        const f = s.dataset.createKind || "", g = Object.fromEntries(new FormData(s).entries());
        i.querySelectorAll('[form="gmf-panel-editor-form"][name]').forEach((B) => {
          B instanceof HTMLInputElement && ["checkbox", "radio"].includes(B.type) && !B.checked || (g[B.name] = B.value);
        }), f === "entity" && (g.markerImage = g.useCustomMarker === "true" ? g.markerImage ?? "" : "", delete g.useCustomMarker);
        const k = Number(g.x), O = Number(g.y), R = this.creationPanel, F = (R == null ? void 0 : R.data) ?? {};
        R != null && R.editId && (g.id = R.editId), this.creationPanel = null;
        let H = null;
        if (f === "map") H = await E(this.mapId, { ...F, ...g });
        else if (f === "system") H = await p(this.mapId, { ...F, ...g, x: k, y: O });
        else if (f === "entity" && this.activeSystemId) H = await l(this.mapId, this.activeSystemId, { ...F, ...g, x: k, y: O });
        else if (f === "route") {
          if (!g.fromSystemId || !g.toSystemId || g.fromSystemId === g.toSystemId) {
            se(`Choose two different ${this.activeSystemId ? "locations" : "systems"} for the route.`), this._openCreationPanel("route", { ...F, ...g }, (R == null ? void 0 : R.editId) ?? null);
            return;
          }
          H = await y(this.mapId, { ...F, ...g }, this.activeSystemId ?? "");
        } else f === "faction" && (H = await u(this.mapId, { ...F, ...g }), this.factionRegistry = !0);
        H != null && H.id && (f === "system" && (this.selectedSystemId = H.id), f === "entity" && (this.selectedObjectId = H.id), f === "route" && (this.selectedRouteId = H.id)), this.render({ force: !0 });
      }), globalThis.setTimeout(() => {
        var d;
        return (d = s.querySelector("[autofocus]")) == null ? void 0 : d.focus();
      }, 0));
    }
    _attachAppearancePreview(i) {
      const s = i.querySelector("[data-panel-marker-preview-system]"), n = i.querySelector("[data-panel-marker-preview-icon]"), a = i.querySelector("[data-panel-marker-preview-label]");
      if (!s) return;
      let o = 0;
      const d = ["name", "kind", "status", "iconStyle", "iconColor", "markerImage"].map((g) => i.querySelector(`[name="${g}"]`)), f = async () => {
        const g = (B, m) => {
          var S;
          return ((S = i.querySelector(`[name="${B}"]`)) == null ? void 0 : S.value) || m;
        }, k = g("kind", "planet"), O = g("status", "known"), R = g("iconStyle", k), F = g("markerImage", "").trim();
        s.className = `gmf-system gmf-system--${k} gmf-icon--${R} gmf-status--${O}${F ? " has-custom-marker" : ""}`, s.style.setProperty("--gmf-faction-color", g("iconColor", "#58d8ff")), s.style.setProperty("--gmf-system-size", "42px"), a && (a.textContent = g("name", "New Location"));
        const H = ++o;
        if (n && F) {
          const B = document.createElement("img");
          B.className = "gmf-custom-marker__image", B.src = F, B.alt = "", B.draggable = !1, n.replaceChildren(B);
        } else if (n && tt.includes(R)) {
          const B = await globalThis.renderTemplate(`${t}/celestial-icon.hbs`, { system: { iconStyle: R } });
          H === o && (n.innerHTML = B);
        } else n && (n.innerHTML = '<span class="gmf-system__core"></span>');
      };
      d.forEach((g) => {
        g == null || g.addEventListener("input", f), g == null || g.addEventListener("change", f);
      }), f();
    }
    async _confirmDeleteRoute(i) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, $e) && await Z(this.mapId, i, this.activeSystemId ?? "");
    }
    async _travelToSystem(i, s) {
      const n = z(r(this.mapId)), a = n.systems.find((f) => f.id === n.currentSystemId), o = n.systems.find((f) => f.id === i);
      if (!o) return;
      if (!a) {
        await re(this.mapId, o.id), te(`Current location set to ${o.name}.`);
        return;
      }
      if (a.id === o.id) {
        te(`${o.name} is already the current location.`);
        return;
      }
      if (!A(n, a.id, o.id)) {
        se(`No direct route from ${a.name} to ${o.name}.`);
        return;
      }
      ee(this.mapId, a.id, o.id), await this._animateShipTravel(a, o, s), await re(this.mapId, o.id), te(`Arrived at ${o.name}.`);
    }
    async _travelToObject(i, s, n) {
      const a = z(r(this.mapId)), o = a.systems.find((k) => k.id === i), d = o == null ? void 0 : o.objects.find((k) => k.id === a.currentLocation.objectId), f = o == null ? void 0 : o.objects.find((k) => k.id === s);
      if (!o || !f) return;
      if (!d || a.currentLocation.systemId !== o.id) {
        await V(this.mapId, o.id, f.id), te(`Current location set to ${f.name}.`);
        return;
      }
      if (d.id === f.id) {
        te(`${f.name} is already the current location.`);
        return;
      }
      if (!A({ routes: o.routes }, d.id, f.id)) {
        se(`No direct route from ${d.name} to ${f.name}.`);
        return;
      }
      K(this.mapId, o.id, d.id, f.id), await this._animateShipTravel(d, f, n), await V(this.mapId, o.id, f.id), te(`Arrived at ${f.name}.`);
    }
    _animateShipTravel(i, s, n) {
      return gi(i, s, n);
    }
    _openLinkedJournal() {
      var n, a;
      const i = this._getSelectedRawSystem();
      if (!(i != null && i.journalId)) return;
      const s = (n = game.journal) == null ? void 0 : n.get(i.journalId);
      if (!s) {
        se(`Journal "${i.journalId}" was not found.`);
        return;
      }
      (a = s.sheet) == null || a.render(!0);
    }
    _getSelectedRawSystem() {
      var s;
      const i = z(r(this.mapId));
      return this.activeSystemId ? ((s = i.systems.find((n) => n.id === this.activeSystemId)) == null ? void 0 : s.objects.find((n) => n.id === this.selectedObjectId)) ?? null : i.systems.find((n) => n.id === this.selectedSystemId) ?? null;
    }
    async close(i = {}) {
      var s, n;
      return this._viewportStage = null, (s = this._bountyIntelCallout) == null || s.dispose(), this._bountyIntelCallout = null, this._disposePlanetRenderer(), this._hideContextMenu(), this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, (n = this._viewportResizeObserver) == null || n.disconnect(), this._viewportResizeObserver = null, me(this), super.close(i);
    }
    _disposePlanetRenderer() {
      var i, s;
      this._planetGeneration++, (i = this._planetLocationCallout) == null || i.dispose(), this._planetLocationCallout = null, (s = this._planetRenderer) == null || s.dispose(), this._planetRenderer = null;
    }
    _setPlanetFallback(i, s) {
      const n = i.querySelector(".gmf-planet-fallback");
      n && (n.style.backgroundImage = s.texture ? `url(${JSON.stringify(s.texture)})` : "none", n.style.backgroundColor = s.color);
      const a = i.querySelector("[data-planet-canvas]");
      a && (a.dataset.planetShape = s.shape, a.dataset.planetPreset = s.preset);
      const o = i.querySelector(".gmf-planet-stage");
      o == null || o.style.setProperty("--gmf-planet-color", s.color);
    }
    async _mountPlanetRenderer(i, s) {
      var f, g, k;
      const n = i.querySelector("[data-planet-canvas]");
      if (!n || !s) return;
      this._setPlanetFallback(i, s);
      const a = this._planetGeneration, o = i.querySelector("[data-action='planet-static']"), d = i.querySelectorAll("[data-planet-control]");
      if (o) {
        const O = this.planetStatic ? "Enable 3D" : "Static view";
        o.setAttribute("title", O), o.setAttribute("aria-label", O), o.setAttribute("aria-pressed", String(this.planetStatic));
        const R = o.querySelector("i");
        R && (R.className = this.planetStatic ? "fa-solid fa-cube" : "fa-solid fa-image");
      }
      if (this.planetStatic) {
        d.forEach((O) => O.disabled = !0);
        return;
      }
      try {
        const { createPlanetRenderer: O } = await import("./chunks/planet-renderer-t-HvFdDj.js");
        if (a !== this._planetGeneration || !n.isConnected) return;
        d.forEach((R) => R.disabled = !1), this._planetRenderer = O(n, {
          texture: s.texture,
          color: s.color,
          appearancePreset: s.preset,
          shape: s.shape,
          finish: s.finish,
          detailStrength: s.detailStrength,
          locations: ((f = this._getPlanetObject()) == null ? void 0 : f.planetLocations) ?? [],
          canPlaceLocations: !!((g = game.user) != null && g.isGM && !this.playerMode),
          onLocationDrop: (R, F) => void this._placePlanetLocation(R, F, i),
          onInvalidLocationDrop: () => se("Drop the scene directly onto the visible 3D surface."),
          onMarkerHover: (R) => {
            var H;
            const F = this._getPlanetLocationItem(R.id);
            F && ((H = this._planetLocationCallout) == null || H.show(F));
          },
          onMarkerLeave: () => {
            var R;
            return (R = this._planetLocationCallout) == null ? void 0 : R.scheduleHide();
          },
          onMarkerPosition: (R) => {
            var F;
            return (F = this._planetLocationCallout) == null ? void 0 : F.setAnchor(R);
          },
          onMarkerOpen: (R) => this._openPlanetLocation(R.id),
          onMarkerContextMenu: (k = game.user) != null && k.isGM && !this.playerMode ? (R) => void this._removePlanetLocation(R.id, i) : null,
          isVisible: () => !this.minimized,
          onPaused: (R) => {
            const F = i.querySelector("[data-action='planet-pause']");
            if (F) {
              const H = R ? "Resume rotation" : "Pause rotation";
              F.setAttribute("title", H), F.setAttribute("aria-label", H), F.setAttribute("aria-pressed", String(R));
              const B = F.querySelector("i");
              B && (B.className = R ? "fa-solid fa-play" : "fa-solid fa-pause");
            }
          },
          onStopped: () => {
            d.forEach((R) => R.disabled = !0);
          }
        }), this._planetLocationCallout = yi({ host: n });
      } catch {
        d.forEach((O) => O.disabled = !0);
      }
    }
  }, Y(ye, "DEFAULT_OPTIONS", {
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
  }), Y(ye, "PARTS", {
    main: {
      template: `${t}/galaxy-map.hbs`
    }
  }), ye;
}
function bi(e) {
  var l;
  const { templateRoot: t, getVisibleMaps: r, openMap: c, clearChooser: p } = e;
  return l = class extends mt() {
    async _prepareContext(u) {
      return { ...await super._prepareContext(u), maps: r() };
    }
    _attachPartListeners(u, E, I) {
      super._attachPartListeners(u, E, I), We(this, E), E.querySelectorAll("[data-player-open-map]").forEach((M) => {
        M.addEventListener("click", () => {
          c(M.dataset.playerOpenMap, { playerMode: !0 }), this.close();
        });
      });
    }
    async close(u = {}) {
      return p(this), super.close(u);
    }
  }, Y(l, "DEFAULT_OPTIONS", {
    id: "galaxy-map-player-chooser",
    classes: ["galaxy-map", "galaxy-map-framework", "gmf-manager-window", "gmf-map-chooser-window"],
    window: { title: "Choose Galaxy Map", icon: "fa-solid fa-satellite", resizable: !0 },
    position: { width: 480, height: 420 }
  }), Y(l, "PARTS", { main: { template: `${t}/player-map-chooser.hbs` } }), l;
}
const be = "galaxy-map", nt = "maps", Ue = "schemaV1Backup", at = "surfaceLocationRecoveryV2", Ie = `module.${be}`, Ee = `modules/${be}/templates`;
function wi(e) {
  return e.visibility === "players";
}
function Mi(e, t) {
  return t && e.status === "undiscovered";
}
function _i(e, t) {
  return t === "planet" ? { station: "station", anomaly: "diamond", ruins: "diamond", unknown: "diamond" }[e] ?? t : t;
}
function Li(e, { playerMode: t = !1, selectedSystemId: r = null, selectedRouteId: c = null } = {}) {
  var U, oe;
  const p = z(e), l = t ? p.systems.filter(wi) : p.systems, y = new Set(l.map((P) => P.id)), u = t ? p.factions.filter((P) => P.visibility === "players") : p.factions, E = new Map(u.map((P) => [P.id, P])), I = l.map((P) => {
    const Q = E.get(P.factionId), Z = Mi(P, t), re = Z ? "unknown" : P.type, V = Z ? "diamond" : _i(re, P.iconStyle), ie = Z ? "" : P.markerImage;
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
      isCurrent: P.id === p.currentSystemId,
      isSelected: P.id === r,
      gmOnly: P.visibility === "gm",
      animatedCelestial: !ie && tt.includes(V),
      hasAlert: ["danger", "locked"].includes(Z ? "undiscovered" : P.status),
      alertLabel: P.status === "danger" ? "Hazard advisory" : P.status === "locked" ? "Restricted access" : "",
      hasJournal: !!(!Z && P.journalId),
      hasScenes: !!(!Z && P.sceneIds.length),
      showImage: !!(!Z && P.image),
      canInspectSystem: !!qe({ ...P, obscured: Z })
    };
  }), M = p.routes.filter((P) => !t || P.visibility === "players").filter((P) => y.has(P.fromSystemId) && y.has(P.toSystemId)).map((P) => {
    const Q = I.find((re) => re.id === P.fromSystemId), Z = I.find((re) => re.id === P.toSystemId);
    return {
      ...P,
      from: Q,
      to: Z,
      fromName: (Q == null ? void 0 : Q.displayName) ?? P.fromSystemId,
      toName: (Z == null ? void 0 : Z.displayName) ?? P.toSystemId,
      isSelected: P.id === c,
      connectsCurrent: P.fromSystemId === p.currentSystemId || P.toSystemId === p.currentSystemId,
      gmOnly: P.visibility === "gm"
    };
  }), _ = M.find((P) => P.id === c) ?? null, L = _ ? null : I.find((P) => P.id === r) ?? null;
  L && (L.isSelected = !0);
  const G = I.find((P) => P.id === p.currentSystemId) ?? I[0] ?? null, N = L && G && L.id !== G.id ? M.find((P) => P.fromSystemId === G.id && P.toSystemId === L.id || P.toSystemId === G.id && P.fromSystemId === L.id) : null;
  return L && (L.canTravel = !!N, L.travelRouteId = (N == null ? void 0 : N.id) ?? "", L.isCurrent = L.id === (G == null ? void 0 : G.id), L.isDestination = !!(N && !L.isCurrent)), M.forEach((P) => {
    P.isActive = P.isSelected || P.id === (N == null ? void 0 : N.id);
  }), {
    ...p,
    systems: I,
    routes: M,
    factions: u,
    selectedSystem: L,
    selectedRoute: _,
    currentSystem: G,
    selectedType: _ ? "route" : L ? "system" : null,
    playerMode: t,
    isGM: ((U = game.user) == null ? void 0 : U.isGM) ?? !1,
    canEdit: ((oe = game.user) == null ? void 0 : oe.isGM) && !t
  };
}
function Ti(e) {
  var p;
  if (!e) return null;
  const t = z(e), r = new Map(t.systems.map((l) => [l.id, l])), c = new Map(t.factions.map((l) => [l.id, l]));
  return {
    ...t,
    travelApprovalModeLabel: ((p = ot.find((l) => l.value === t.travelApprovalMode)) == null ? void 0 : p.label) ?? "Unanimous agreement",
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
          fromName: ((y = r.get(l.fromSystemId)) == null ? void 0 : y.name) ?? l.fromSystemId,
          toName: ((u = r.get(l.toSystemId)) == null ? void 0 : u.name) ?? l.toSystemId
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
  const t = e.querySelector("[data-texture-upload-fields]"), r = e.querySelector('[name="planetTexture"]'), c = e.querySelector('[name="planetPreset"]'), p = e.querySelector('[name="planetShape"]'), l = e.querySelector('[name="planetFinish"]'), y = e.querySelector('[name="planetColor"]'), u = e.querySelector("[data-texture-guide]"), E = e.querySelector("[data-texture-guide-section]"), I = e.querySelectorAll("[data-texture-guide-preview]"), M = () => {
    if (!c || !p) return;
    const G = Ht(c.value, p.value);
    c.replaceChildren(...zt(p.value).map((N) => {
      const U = document.createElement("option");
      return U.value = N.value, U.textContent = N.label, U;
    })), c.value = G;
  }, _ = () => {
    const G = (c == null ? void 0 : c.value) === "custom", N = (c == null ? void 0 : c.value) === "none";
    return t && (t.hidden = !G), E && (E.hidden = !G), r && (r.required = G), p && (p.disabled = N), l && (l.disabled = N), y && (y.disabled = (c == null ? void 0 : c.value) !== "color"), G;
  }, L = () => {
    var N;
    if (!u) return;
    const G = (N = r == null ? void 0 : r.value) == null ? void 0 : N.trim();
    G ? u.dataset.hasTexture = "true" : delete u.dataset.hasTexture, I.forEach((U) => {
      U.onerror = G ? () => {
        U.hidden = !0;
      } : null, U.hidden = !G, G ? U.src = G : U.removeAttribute("src");
    });
  };
  c == null || c.addEventListener("change", () => {
    !_() && (r != null && r.value) && (r.value = "", r.dispatchEvent(new Event("change", { bubbles: !0 })));
  }), r == null || r.addEventListener("change", L), p == null || p.addEventListener("change", () => {
    u && (u.dataset.shape = p.value), M(), _();
  }), M(), _(), L();
}
function Ei(e) {
  const { notifyError: t, notifyInfo: r, requireGM: c, refreshOpenApps: p, closeOpenMap: l, getOpenMapViews: y } = e, u = (m) => foundry.utils.deepClone(m), E = (m) => game.socket.emit(Ie, { action: "refresh", mapId: m });
  function I() {
    return u(game.settings.get(be, nt) ?? {});
  }
  async function M(m) {
    return c("save galaxy map data") && await game.settings.set(be, nt, m ?? {}), m;
  }
  function _(m) {
    const S = I();
    return S[m] ? u(S[m]) : null;
  }
  async function L(m, S, { refresh: b = !0 } = {}) {
    return m[S] = z(m[S]), await M(m), b && p(S), E(S), m[S];
  }
  async function G(m = {}) {
    if (!c("create galaxy maps")) return null;
    const S = I(), b = z(m);
    return S[b.id] = b, await M(S), p(b.id), u(b);
  }
  async function N(m, S = {}) {
    if (!c("update galaxy maps")) return null;
    const b = I();
    if (!b[m])
      return t(`Map "${m}" was not found.`), null;
    const v = z({ ...S, id: m });
    return b[m] = v, await M(b), p(m), u(v);
  }
  async function U(m, S = {}) {
    const b = _(m);
    return !c("update galaxy map metadata") || !b ? (b || t(`Map "${m}" was not found.`), null) : N(m, {
      ...b,
      title: S.title,
      subtitle: S.subtitle,
      description: S.description,
      backgroundImage: S.backgroundImage,
      visibility: S.visibility,
      travelApprovalMode: S.travelApprovalMode
    });
  }
  async function oe(m) {
    if (!c("delete galaxy maps")) return !1;
    const S = I();
    return S[m] ? (delete S[m], await M(S), l(m), p(), !0) : !1;
  }
  async function P(m) {
    if (!c("duplicate galaxy maps")) return null;
    const S = _(m);
    if (!S)
      return t(`Map "${m}" was not found.`), null;
    const b = z({ ...S, id: Te("map"), title: `${S.title} Copy` }), v = I();
    return v[b.id] = b, await M(v), p(b.id), u(b);
  }
  async function Q(m, S = {}) {
    var fe;
    if (!c("save star systems")) return null;
    const b = I();
    if (!b[m])
      return t(`Map "${m}" was not found.`), null;
    const v = z(b[m]), w = v.systems.find((Se) => Se.id === S.id), T = S.objects ?? (w == null ? void 0 : w.objects) ?? [], q = (w == null ? void 0 : w.primaryObjectId) || ((fe = T[0]) == null ? void 0 : fe.id), D = ["image", "sceneIds", "planetLocations", "journalId", "planetPreset", "planetShape", "planetFinish", "planetTexture", "planetColor"], W = T.map((Se) => Se.id !== q ? Se : kt({
      ...Se,
      ...Object.fromEntries(D.filter((J) => S[J] !== void 0).map((J) => [J, S[J]]))
    })), X = Zt({ ...w, ...S, objects: W }), ge = v.systems.findIndex((Se) => Se.id === X.id);
    return ge >= 0 ? v.systems[ge] = X : v.systems.push(X), b[m] = v, await L(b, m), u(X);
  }
  async function Z(m, S, b = {}) {
    if (!c("save locations")) return null;
    const v = I(), w = v[m] ? z(v[m]) : null, T = w == null ? void 0 : w.systems.find((W) => W.id === S);
    if (!w || !T) return null;
    const q = kt(b), D = T.objects.findIndex((W) => W.id === q.id);
    return D >= 0 ? T.objects[D] = q : T.objects.push(q), T.primaryObjectId || (T.primaryObjectId = q.id), v[m] = w, await L(v, m), u(q);
  }
  const re = (m, S, b) => {
    var v;
    for (const w of y(m)) (v = w.refreshPlanetLocations) == null || v.call(w, S, b);
  };
  async function V(m, S, b, v = {}) {
    var ge;
    if (!c("place surface locations")) return null;
    const w = I(), T = w[m] ? z(w[m]) : null, q = (ge = T == null ? void 0 : T.systems.find((fe) => fe.id === S)) == null ? void 0 : ge.objects.find((fe) => fe.id === b);
    if (!T || !q) return null;
    const D = String(v.sceneId || "");
    if (!q.sceneIds.includes(D))
      return t("Only scenes linked to this object can be placed on its surface."), null;
    const W = Wt(v), X = q.planetLocations.findIndex((fe) => fe.sceneId === D && fe.shape === W.shape);
    return X >= 0 && (W.id = q.planetLocations[X].id), X >= 0 ? q.planetLocations[X] = W : q.planetLocations.push(W), w[m] = z(T), await M(w), re(m, S, b), game.socket.emit(Ie, { action: "planet-locations", mapId: m, systemId: S, objectId: b }), u(W);
  }
  async function ie(m, S, b, v) {
    var W;
    if (!c("remove surface locations")) return !1;
    const w = I(), T = w[m] ? z(w[m]) : null, q = (W = T == null ? void 0 : T.systems.find((X) => X.id === S)) == null ? void 0 : W.objects.find((X) => X.id === b);
    if (!T || !q) return !1;
    const D = q.planetLocations.length;
    return q.planetLocations = q.planetLocations.filter((X) => X.id !== v), q.planetLocations.length === D ? !1 : (w[m] = z(T), await M(w), re(m, S, b), game.socket.emit(Ie, { action: "planet-locations", mapId: m, systemId: S, objectId: b }), !0);
  }
  async function ne(m, S, b, v) {
    var T, q;
    if (!c("unlink scenes from locations")) return !1;
    const w = (q = (T = _(m)) == null ? void 0 : T.systems.find((D) => D.id === S)) == null ? void 0 : q.objects.find((D) => D.id === b);
    return w != null && w.sceneIds.includes(v) ? !!await Z(m, S, { ...w, sceneIds: w.sceneIds.filter((D) => D !== v) }) : !1;
  }
  async function C(m, S, b) {
    var q;
    if (!c("delete locations")) return !1;
    const v = I(), w = v[m] ? z(v[m]) : null, T = w == null ? void 0 : w.systems.find((D) => D.id === S);
    return !w || !T ? !1 : (T.objects = T.objects.filter((D) => D.id !== b), T.primaryObjectId === b && (T.primaryObjectId = ((q = T.objects[0]) == null ? void 0 : q.id) ?? ""), w.currentLocation.objectId === b && (w.currentLocation.objectId = T.primaryObjectId), v[m] = w, await L(v, m), !0);
  }
  async function A(m, S, b) {
    var W;
    if (!c("move locations")) return null;
    const v = I(), w = v[m] ? z(v[m]) : null, T = w == null ? void 0 : w.systems.find((X) => X.objects.some((ge) => ge.id === S)), q = w == null ? void 0 : w.systems.find((X) => X.id === b), D = T == null ? void 0 : T.objects.find((X) => X.id === S);
    return !w || !T || !q || !D ? null : (T.objects = T.objects.filter((X) => X.id !== S), q.objects.push(D), T.primaryObjectId === S && (T.primaryObjectId = ((W = T.objects[0]) == null ? void 0 : W.id) ?? ""), q.primaryObjectId || (q.primaryObjectId = S), w.currentLocation.objectId === S && (w.currentLocation.systemId = q.id), v[m] = w, await L(v, m), u(D));
  }
  async function ee(m, S, b) {
    if (!c("set the arrival object")) return null;
    const v = I(), w = v[m] ? z(v[m]) : null, T = w == null ? void 0 : w.systems.find((q) => q.id === S);
    return !w || !(T != null && T.objects.some((q) => q.id === b)) ? null : (T.primaryObjectId = b, w.currentLocation.systemId === S && !w.currentLocation.objectId && (w.currentLocation.objectId = b), v[m] = w, await L(v, m), u(T));
  }
  async function K(m, S, b, v, w) {
    var W;
    const T = I(), q = T[m] ? z(T[m]) : null, D = (W = q == null ? void 0 : q.systems.find((X) => X.id === S)) == null ? void 0 : W.objects.find((X) => X.id === b);
    return !q || !D ? null : (D.x = le(we(v, D.x), 0, 100), D.y = le(we(w, D.y), 0, 100), T[m] = q, await L(T, m), u(D));
  }
  async function te(m, S, b, v) {
    var D;
    if (!c("change object visibility")) return null;
    const w = I(), T = w[m] ? z(w[m]) : null, q = (D = T == null ? void 0 : T.systems.find((W) => W.id === S)) == null ? void 0 : D.objects.find((W) => W.id === b);
    return !T || !q ? null : (q.visibility = Ut.includes(v) ? v : "inherit", q.visibility === "players" && ["undiscovered", "locked"].includes(q.status) && (q.status = "known"), w[m] = T, await L(w, m), u(q));
  }
  async function se(m, S) {
    var w;
    if (!c("delete star systems")) return !1;
    const b = I(), v = b[m];
    return v ? (v.systems = v.systems.filter((T) => T.id !== S), v.routes = v.routes.filter((T) => T.fromSystemId !== S && T.toSystemId !== S), v.currentSystemId === S && (v.currentSystemId = ((w = v.systems[0]) == null ? void 0 : w.id) ?? ""), await L(b, m), !0) : !1;
  }
  async function ue(m, S) {
    if (!c("set current location")) return null;
    const b = I(), v = b[m] ? z(b[m]) : null, w = v == null ? void 0 : v.systems.find((T) => T.id === S);
    return !v || !w ? (t(`System "${S}" was not found.`), null) : (v.currentSystemId = S, b[m] = v, await L(b, m), u(w));
  }
  async function he(m, S, b) {
    if (!c("set current location")) return null;
    const v = I(), w = v[m] ? z(v[m]) : null, T = w == null ? void 0 : w.systems.find((D) => D.id === S), q = T == null ? void 0 : T.objects.find((D) => D.id === b);
    return !w || !T || !q ? null : (w.currentSystemId = S, w.currentLocation = { systemId: S, objectId: b }, v[m] = w, await L(v, m), u(q));
  }
  async function ke(m, S = {}, b = "") {
    var W;
    if (!c("save routes")) return null;
    const v = I(), w = v[m], T = b ? (W = w == null ? void 0 : w.systems) == null ? void 0 : W.find((X) => X.id === b) : w;
    if (!w || !T)
      return t(b ? `System "${b}" was not found.` : `Map "${m}" was not found.`), null;
    Array.isArray(T.routes) || (T.routes = []);
    const q = dt(S);
    if (!q.fromSystemId || !q.toSystemId || q.fromSystemId === q.toSystemId)
      return t("Routes require two different systems."), null;
    const D = T.routes.findIndex((X) => X.id === q.id);
    return D >= 0 ? T.routes[D] = q : T.routes.push(q), await L(v, m), u(q);
  }
  async function xe(m, S, b = "") {
    var q;
    if (!c("delete routes")) return !1;
    const v = I(), w = v[m], T = b ? (q = w == null ? void 0 : w.systems) == null ? void 0 : q.find((D) => D.id === b) : w;
    return T ? (T.routes = (T.routes ?? []).filter((D) => D.id !== S), await L(v, m), !0) : !1;
  }
  async function $(m, S = {}) {
    if (!c("save factions")) return null;
    const b = I(), v = b[m];
    if (!v)
      return t(`Map "${m}" was not found.`), null;
    const w = Kt(S), T = v.factions.findIndex((q) => q.id === w.id);
    return T >= 0 ? v.factions[T] = w : v.factions.push(w), await L(b, m), u(w);
  }
  async function me(m, S) {
    if (!c("delete factions")) return !1;
    const b = I(), v = b[m];
    if (!v) return !1;
    v.factions = v.factions.filter((w) => w.id !== S);
    for (const w of v.systems) {
      w.factionId === S && (w.factionId = "");
      for (const T of w.objects ?? []) T.factionId === S && (T.factionId = "");
    }
    return await L(b, m), !0;
  }
  async function ye(m, S, b, v, w = "") {
    var ge, fe, Se, J;
    if (!c(`${v ? "hide" : "reveal"} ${{ faction: "factions", system: "star systems", route: "routes" }[S]}`)) return null;
    const q = I(), D = q[m], W = w ? (ge = D == null ? void 0 : D.systems) == null ? void 0 : ge.find((de) => de.id === w) : D, X = S === "faction" ? (fe = D == null ? void 0 : D.factions) == null ? void 0 : fe.find((de) => de.id === b) : S === "system" ? (Se = D == null ? void 0 : D.systems) == null ? void 0 : Se.find((de) => de.id === b) : (J = W == null ? void 0 : W.routes) == null ? void 0 : J.find((de) => de.id === b);
    return !D || !X ? (t(`${S[0].toUpperCase()}${S.slice(1)} "${b}" was not found.`), null) : (X.visibility = v ? "gm" : "players", S === "system" && !v && ["undiscovered", "locked"].includes(X.status) && (X.status = "known"), await L(q, m), u(X));
  }
  async function h(m, S, b = !0) {
    const v = await ye(m, "faction", S, b);
    return v && r(`${v.name} ${b ? "hidden from" : "visible to"} players.`), v;
  }
  async function j(m, S, { notify: b = !0 } = {}) {
    const v = await ye(m, "system", S, !1);
    return v ? (b && o(m, v.id), r(`${v.name} revealed to players.`), v) : null;
  }
  async function i(m, S, b = !0) {
    const v = await ye(m, "system", S, b);
    return v && r(`${v.name} ${b ? "hidden from" : "visible to"} players.`), v;
  }
  async function s(m, S, b = "") {
    const v = await ye(m, "route", S, !1, b);
    return v && r("Route revealed to players."), v;
  }
  async function n(m, S, b = !0, v = "") {
    const w = await ye(m, "route", S, b, v);
    return w && r(`Route ${b ? "hidden from" : "visible to"} players.`), w;
  }
  async function a(m, S, b, v) {
    var D;
    if (!c("move star systems")) return null;
    const w = I(), T = w[m], q = (D = T == null ? void 0 : T.systems) == null ? void 0 : D.find((W) => W.id === S);
    return q ? (q.x = le(we(b, q.x), 0, 100), q.y = le(we(v, q.y), 0, 100), await L(w, m, { refresh: !1 }), u(q)) : (t(`System "${S}" was not found.`), null);
  }
  function o(m, S) {
    var v, w;
    if (!c("notify players about discoveries")) return;
    const b = (w = (v = _(m)) == null ? void 0 : v.systems) == null ? void 0 : w.find((T) => T.id === S);
    if (!b) {
      t(`System "${S}" was not found.`);
      return;
    }
    game.socket.emit(Ie, { action: "notify", mapId: m, systemId: S, message: `New System Discovered: ${b.name}` }), r(`Discovery notification sent: ${b.name}.`);
  }
  async function d(m, { replace: S = !1 } = {}) {
    if (!c("import galaxy maps")) return null;
    const b = I();
    let v = z(m);
    return b[v.id] && !S && (v = z({ ...v, id: Te("map"), title: `${v.title} Import` })), b[v.id] = v, await M(b), p(v.id), r(`Imported ${v.title}.`), u(v);
  }
  function f(m) {
    const S = _(m);
    if (!S) {
      t(`Map "${m}" was not found.`);
      return;
    }
    ii(`${si(S.title)}.json`, z(S));
  }
  const g = () => Object.values(I()).map(z), k = (m, S) => u(z(_(m)).systems.find((b) => b.id === String(S)) ?? null);
  function O(m, S) {
    const b = z(_(m));
    for (const v of b.systems) {
      const w = v.objects.find((T) => T.id === String(S));
      if (w) return { systemId: v.id, object: u(w) };
    }
    return null;
  }
  const R = (m, S) => {
    const b = z(_(m)).systems.find((v) => v.id === String(S));
    return [...new Set((b == null ? void 0 : b.objects.flatMap((v) => v.sceneIds)) ?? [])];
  }, F = (m, S) => {
    var b;
    return [...((b = O(m, S)) == null ? void 0 : b.object.sceneIds) ?? []];
  };
  function H(m) {
    return g().flatMap((S) => S.systems.flatMap((b) => b.objects.filter((v) => v.sceneIds.includes(String(m))).map((v) => ({ mapId: S.id, mapTitle: S.title, systemId: b.id, systemName: b.name, object: u(v) }))));
  }
  function B(m) {
    return g().flatMap((S) => S.systems.filter((b) => b.objects.some((v) => v.sceneIds.includes(String(m)))).map((b) => ({ mapId: S.id, mapTitle: S.title, system: u(b) })));
  }
  return {
    getMapStore: I,
    saveMapStore: M,
    getRawMap: _,
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
    upsertFaction: $,
    deleteFaction: me,
    hideFactionFromPlayers: h,
    saveSystemPosition: a,
    revealSystemToPlayers: j,
    hideSystemFromPlayers: i,
    revealRouteToPlayers: s,
    hideRouteFromPlayers: n,
    notifySystemDiscovered: o,
    importMapData: d,
    exportMap: f,
    getMaps: g,
    getSystem: k,
    getObject: O,
    getSceneIdsForSystem: R,
    getSceneIdsForObject: F,
    getObjectsForScene: H,
    getSystemsForScene: B,
    updateOpenPlanetLocations: re
  };
}
function Pi(e) {
  const {
    getRawMap: t,
    setCurrentSystem: r,
    setCurrentObject: c,
    getOpenMapViews: p,
    getAppHtml: l,
    notifyInfo: y,
    notifyError: u,
    getActiveUsers: E,
    getPrimaryGM: I,
    isPrimaryGM: M
  } = e, _ = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Set(), G = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map();
  function U(h, j, i) {
    return h.routes.find((s) => s.fromSystemId === j && s.toSystemId === i || s.toSystemId === j && s.fromSystemId === i) ?? null;
  }
  function oe(h, j) {
    const i = t(h);
    if (!i)
      return u(`Map "${h}" was not found.`), null;
    const s = z(i), n = s.systems.find((g) => g.id === s.currentSystemId), a = s.systems.find((g) => g.id === j);
    if (!a)
      return u(`System "${j}" was not found.`), null;
    if (!n)
      return u("This map does not have a current location yet. Ask the GM to set one first."), null;
    if (n.id === a.id)
      return y(`${a.name} is already the current location.`), null;
    if (s.visibility !== "players" || n.visibility !== "players" || a.visibility !== "players")
      return u("That travel destination is not visible to players."), null;
    const o = U(s, n.id, a.id);
    if (!o || o.visibility !== "players")
      return u(`No player-visible direct route from ${n.name} to ${a.name}.`), null;
    const d = I();
    if (!d)
      return u("A GM must be online to approve player travel."), null;
    const f = Je(E(), game.user.id, d, s.travelApprovalMode);
    return {
      action: "travel-request",
      requestId: Te("travel"),
      mapId: h,
      mapTitle: s.title,
      fromSystemId: n.id,
      fromName: n.name,
      toSystemId: a.id,
      toName: a.name,
      routeId: o.id,
      routeType: o.type,
      travelTime: o.travelTime,
      fuelCost: o.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      ...f
    };
  }
  function P(h, j) {
    const i = oe(h, j);
    return i ? (game.socket.emit(Ie, i), y(`Travel request sent: ${i.fromName} to ${i.toName}.`), i) : null;
  }
  function Q(h, j, i) {
    const s = t(h);
    if (!s)
      return u(`Map "${h}" was not found.`), null;
    const n = z(s), a = n.systems.find((O) => O.id === j), o = a == null ? void 0 : a.objects.find((O) => O.id === n.currentLocation.objectId), d = a == null ? void 0 : a.objects.find((O) => O.id === i);
    if (!a || n.currentLocation.systemId !== a.id || !o)
      return u("The current location is not inside this system."), null;
    if (!d)
      return u(`Destination "${i}" was not found.`), null;
    if (o.id === d.id)
      return y(`${d.name} is already the current location.`), null;
    if (n.visibility !== "players" || a.visibility !== "players" || Re(a, o) !== "players" || Re(a, d) !== "players")
      return u("That travel destination is not visible to players."), null;
    const f = U({ routes: a.routes }, o.id, d.id);
    if (!f || f.visibility !== "players")
      return u(`No player-visible direct route from ${o.name} to ${d.name}.`), null;
    const g = I();
    if (!g)
      return u("A GM must be online to approve player travel."), null;
    const k = Je(E(), game.user.id, g, n.travelApprovalMode);
    return {
      action: "travel-request",
      travelScope: "object",
      requestId: Te("travel"),
      mapId: h,
      mapTitle: n.title,
      systemId: a.id,
      fromObjectId: o.id,
      fromName: o.name,
      toObjectId: d.id,
      toName: d.name,
      routeId: f.id,
      routeType: f.type,
      travelTime: f.travelTime,
      fuelCost: f.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      ...k
    };
  }
  function Z(h, j, i) {
    const s = Q(h, j, i);
    return s ? (game.socket.emit(Ie, s), y(`Travel request sent: ${s.fromName} to ${s.toName}.`), s) : null;
  }
  function re(h, j) {
    var o, d;
    if (!j) return;
    N.set(h, j);
    const i = (o = G.get(h)) == null ? void 0 : o.root;
    if (!i) return;
    const s = i.querySelector("[data-travel-progress-count]"), n = i.querySelector("[data-travel-progress-pending]"), a = i.querySelector("[data-travel-progress-bar]");
    s && (s.textContent = `${j.acceptedCount} of ${j.requiredApprovals} approvals`), n && (n.textContent = (d = j.pendingNames) != null && d.length ? `Waiting for: ${j.pendingNames.join(", ")}` : "All votes received"), a && (a.style.width = `${Math.min(100, j.acceptedCount / Math.max(1, j.requiredApprovals) * 100)}%`);
  }
  function V(h) {
    var o, d, f, g;
    if (!(h != null && h.requestId) || h.requesterId === ((o = game.user) == null ? void 0 : o.id) || !((f = h.voterIds) != null && f.includes((d = game.user) == null ? void 0 : d.id)) || L.has(h.requestId)) return;
    L.add(h.requestId);
    let j = !1, i = !1, s = null;
    const n = (k) => {
      if (j) return;
      j = !0;
      const O = {
        action: "travel-vote",
        requestId: h.requestId,
        mapId: h.mapId,
        userId: game.user.id,
        userName: game.user.name,
        accepted: k
      };
      game.socket.emit(Ie, O), xe(O);
    }, a = ((g = ot.find((k) => k.value === h.approvalMode)) == null ? void 0 : g.label) ?? "Unanimous agreement";
    s = new Dialog({
      title: "Travel Request",
      content: `<section class="gmf-travel-request">
        <p><strong>${ve(h.requesterName)}</strong> wants to travel on <strong>${ve(h.mapTitle)}</strong>.</p>
        <p>${ve(h.fromName)} &rarr; ${ve(h.toName)}</p>
        <p class="gmf-travel-request__meta">${ve(h.routeType)} route / ${ve(h.travelTime || "Unknown time")} / Fuel ${ve(h.fuelCost ?? 0)}</p>
        <p class="gmf-travel-request__mode"><i class="fa-solid fa-users"></i> ${ve(a)}</p>
        <div class="gmf-travel-progress" data-travel-progress aria-live="polite">
          <div class="gmf-travel-progress__bar"><span data-travel-progress-bar></span></div>
          <strong data-travel-progress-count>Waiting for vote status…</strong><span data-travel-progress-pending></span>
        </div></section>`,
      render: (k) => {
        const O = is(k), R = G.get(h.requestId);
        R && (R.root = O), re(h.requestId, N.get(h.requestId));
      },
      buttons: {
        accept: { icon: '<i class="fa-solid fa-check"></i>', label: "Accept", callback: () => n(!0) },
        decline: { icon: '<i class="fa-solid fa-xmark"></i>', label: "Decline", callback: () => n(!1) }
      },
      default: "accept",
      close: () => {
        G.delete(h.requestId), i || n(!1);
      }
    }, { classes: ["galaxy-map", "gmf-crud-dialog"], width: 420, height: Math.max(320, Math.min(440, window.innerHeight - 80)) }), G.set(h.requestId, { root: null, resolve: () => {
      i = !0, j = !0, s == null || s.close();
    } }), s.render(!0);
  }
  const ie = (h) => {
    var j;
    return !!(h != null && h.coordinatorId && h.coordinatorId === ((j = I()) == null ? void 0 : j.id));
  };
  function ne(h) {
    const j = Et(h);
    return {
      action: "travel-progress",
      requestId: h.requestId,
      mapId: h.mapId,
      requesterId: h.requesterId,
      approvalMode: h.approvalMode,
      acceptedCount: j.acceptedCount,
      declinedCount: j.declinedCount,
      requiredApprovals: j.required,
      participantCount: h.participantCount,
      pendingNames: j.pendingIds.map((i) => {
        var s;
        return ((s = h.voterNames) == null ? void 0 : s[i]) || "Navigator";
      }),
      coordinatorId: game.user.id
    };
  }
  function C(h) {
    const j = ne(h);
    return re(h.requestId, j), game.socket.emit(Ie, j), j;
  }
  function A(h) {
    var i, s, n;
    if (!(h != null && h.requestId) || !ie(h)) return;
    const j = N.get(h.requestId);
    if (re(h.requestId, h), h.requesterId === ((i = game.user) == null ? void 0 : i.id) && (!j || j.acceptedCount !== h.acceptedCount || j.declinedCount !== h.declinedCount)) {
      const a = (s = h.pendingNames) != null && s.length ? ` Waiting for ${h.pendingNames.join(", ")}.` : "";
      (n = ui.notifications) == null || n.info(`Travel vote: ${h.acceptedCount}/${h.requiredApprovals} approvals.${a}`);
    }
  }
  function ee(h) {
    if (!M() || !(h != null && h.requestId) || _.has(h.requestId)) return null;
    const j = t(h.mapId);
    if (!j) return null;
    const i = z(j), s = E().find((B) => B.id === h.requesterId && !B.isGM), n = h.travelScope === "object", a = n ? i.systems.find((B) => B.id === h.systemId) : null, o = n ? a == null ? void 0 : a.objects.find((B) => B.id === i.currentLocation.objectId) : i.systems.find((B) => B.id === i.currentSystemId), d = n ? a == null ? void 0 : a.objects.find((B) => B.id === h.toObjectId) : i.systems.find((B) => B.id === h.toSystemId), f = o && d ? U(n ? { routes: (a == null ? void 0 : a.routes) ?? [] } : i, o.id, d.id) : null, g = n && (!a || i.currentLocation.systemId !== a.id || a.visibility !== "players" || Re(a, o) !== "players" || Re(a, d) !== "players"), k = !n && ((o == null ? void 0 : o.visibility) !== "players" || (d == null ? void 0 : d.visibility) !== "players");
    if (!s || i.visibility !== "players" || !o || !d || o.id === d.id || g || k || !f || f.visibility !== "players") return null;
    const O = I(), R = Je(E(), h.requesterId, O, i.travelApprovalMode), F = globalThis.setTimeout(() => {
      const B = _.get(h.requestId);
      B && ke(B, { reason: "Travel request timed out." });
    }, Hs), H = {
      action: "travel-ballot",
      requestId: String(h.requestId).slice(0, 80),
      mapId: i.id,
      mapTitle: i.title,
      travelScope: n ? "object" : "system",
      systemId: n ? a.id : "",
      fromSystemId: n ? a.id : o.id,
      fromObjectId: n ? o.id : "",
      fromName: o.name,
      toSystemId: n ? a.id : d.id,
      toObjectId: n ? d.id : "",
      toName: d.name,
      routeId: f.id,
      routeType: f.type,
      travelTime: f.travelTime,
      fuelCost: f.fuelCost,
      requesterId: s.id,
      requesterName: s.name,
      coordinatorId: game.user.id,
      ...R,
      accepted: /* @__PURE__ */ new Set(),
      declined: /* @__PURE__ */ new Set(),
      timeoutId: F
    };
    return _.set(h.requestId, H), C(H), H;
  }
  function K(h) {
    const j = z(t(h.mapId)), i = h.travelScope === "object", s = i ? j.systems.find((o) => o.id === h.systemId) : null, n = i ? s == null ? void 0 : s.objects.find((o) => o.id === h.fromObjectId) : j.systems.find((o) => o.id === h.fromSystemId), a = i ? s == null ? void 0 : s.objects.find((o) => o.id === h.toObjectId) : j.systems.find((o) => o.id === h.toSystemId);
    !n || !a || p(h.mapId).forEach((o) => {
      var f;
      const d = l(o);
      if (d) {
        if (i) {
          if (o.activeSystemId !== s.id) return;
          o.selectedObjectId = a.id;
        } else o.selectedSystemId = a.id;
        o.selectedRouteId = null, (f = o._animateShipTravel) == null || f.call(o, n, a, d);
      }
    });
  }
  const te = (h, j, i) => {
    var s;
    return game.socket.emit(
      Ie,
      { action: "travel-animation", mapId: h, fromSystemId: j, toSystemId: i, coordinatorId: (s = game.user) == null ? void 0 : s.id }
    );
  }, se = (h, j, i, s) => {
    var n;
    return game.socket.emit(
      Ie,
      { action: "travel-animation", travelScope: "object", mapId: h, systemId: j, fromObjectId: i, toObjectId: s, coordinatorId: (n = game.user) == null ? void 0 : n.id }
    );
  };
  function ue(h) {
    var j;
    _.delete(h.requestId), h.timeoutId && globalThis.clearTimeout(h.timeoutId), L.delete(h.requestId), (j = G.get(h.requestId)) == null || j.resolve(), G.delete(h.requestId), N.delete(h.requestId);
  }
  async function he(h) {
    ue(h);
    const j = {
      action: "travel-approved",
      requestId: h.requestId,
      mapId: h.mapId,
      travelScope: h.travelScope,
      systemId: h.systemId,
      fromSystemId: h.fromSystemId,
      toSystemId: h.toSystemId,
      fromObjectId: h.fromObjectId,
      toObjectId: h.toObjectId,
      fromName: h.fromName,
      toName: h.toName,
      coordinatorId: game.user.id
    };
    game.socket.emit(Ie, j), K(j), y(`Travel approved: ${h.fromName} to ${h.toName}.`), globalThis.setTimeout(() => {
      h.travelScope === "object" ? c(h.mapId, h.systemId, h.toObjectId) : r(h.mapId, h.toSystemId);
    }, Yt);
  }
  function ke(h, { voterName: j = "", reason: i = "" } = {}) {
    ue(h);
    const s = i || `${j || "A participant"} declined the request.`, n = {
      action: "travel-declined",
      requestId: h.requestId,
      mapId: h.mapId,
      fromName: h.fromName,
      toName: h.toName,
      voterName: j,
      reason: s,
      coordinatorId: game.user.id
    };
    game.socket.emit(Ie, n), y(`Travel cancelled: ${s}`);
  }
  function xe(h) {
    if (!M() || !(h != null && h.requestId)) return;
    const j = _.get(h.requestId);
    if (!j || !j.voterIds.includes(h.userId) || j.accepted.has(h.userId) || j.declined.has(h.userId)) return;
    h.accepted ? j.accepted.add(h.userId) : j.declined.add(h.userId);
    const i = Et(j);
    C(j), i.outcome === "approved" ? he(j) : i.outcome === "declined" && ke(j, {
      voterName: h.userName,
      reason: j.approvalMode === "unanimous" ? `${h.userName || "A participant"} declined the unanimous request.` : "The remaining votes cannot reach a majority."
    });
  }
  function $(h) {
    var j;
    h.requestId && L.delete(h.requestId), (j = G.get(h.requestId)) == null || j.resolve(), G.delete(h.requestId), N.delete(h.requestId);
  }
  function me(h) {
    var j, i;
    !ie(h) || h.coordinatorId === ((j = game.user) == null ? void 0 : j.id) || ($(h), K(h), (i = ui.notifications) == null || i.info(`Travel approved: ${h.fromName} to ${h.toName}.`));
  }
  function ye(h) {
    var j, i;
    !ie(h) || h.coordinatorId === ((j = game.user) == null ? void 0 : j.id) || ($(h), (i = ui.notifications) == null || i.warn(`Travel cancelled: ${h.reason || `${h.voterName || "A participant"} declined.`}`));
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
          ${Array.from({ length: 4 }, (t, r) => `<span class="is-face-${r + 1}">Side ${r + 1}<br>upper</span>`).join("")}
          ${Array.from({ length: 4 }, (t, r) => `<span class="is-face-${r + 5}">Side ${r + 1}<br>lower</span>`).join("")}
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
  saveSystemPosition: _s,
  revealSystemToPlayers: Ls,
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
  var r;
  const t = ks(e);
  return ((r = t == null ? void 0 : t.closest) == null ? void 0 : r.call(t, ".window-app, .application, .app")) ?? t;
}
function Gi(e) {
  return e.map((t) => {
    var p, l;
    const r = Es(t);
    if (!r) return null;
    const c = Number.parseInt(((l = (p = globalThis.getComputedStyle) == null ? void 0 : p.call(globalThis, r)) == null ? void 0 : l.zIndex) ?? "", 10);
    return { app: t, zIndex: r.style.zIndex || (Number.isFinite(c) ? String(c) : "") };
  }).filter(Boolean);
}
function Qe(e) {
  for (const t of e) {
    const r = Es(t.app);
    !(r != null && r.isConnected) || !t.zIndex || (r.style.zIndex = t.zIndex);
  }
}
async function Ps(e = null) {
  var l;
  const t = [...Fe.entries()].filter(([y, u]) => (u == null ? void 0 : u.rendered) && (!e || y === e)).map(([, y]) => y);
  ae != null && ae.rendered && (!e || ae.mapId === e) && t.push(ae);
  const r = [Pe != null && Pe.rendered ? Pe : null, ...t].filter(Boolean), c = Gi(r), p = r.map((y) => Promise.resolve(y.render({ force: !0 })));
  Qe(c), await Promise.allSettled(p), Qe(c), (l = globalThis.requestAnimationFrame) == null || l.call(globalThis, () => Qe(c));
}
function Mt(e) {
  const t = [...Fe.values()];
  return ae && t.push(ae), t.filter((r) => (r == null ? void 0 : r.rendered) && r.mapId === e);
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
  const r = ze(e);
  if (!r)
    return je(`Map "${e}" was not found.`), null;
  const c = t.playerMode ?? !((u = game.user) != null && u.isGM);
  if (c && r.visibility !== "players" && !t.broadcast)
    return je("That galaxy map is not visible to players."), null;
  const p = c ? `player:${e}` : e, l = c && (ae == null ? void 0 : ae.mapId) === e ? ae : Fe.get(p);
  if (l != null && l.rendered)
    return l.bringToFront(), l;
  const y = new rn({ mapId: e, playerMode: c });
  return c ? ae = y : Fe.set(p, y), y.render({ force: !0 }), y;
}
async function Qi(e, t, r = {}) {
  var p;
  if (!e || !t) return !1;
  const c = Oe(e, {
    playerMode: r.playerMode ?? !((p = game.user) != null && p.isGM),
    broadcast: r.broadcast === !0
  });
  return c != null && c.focusSystem ? c.focusSystem(t, r) : !1;
}
async function en(e, t = {}, r = {}) {
  var y, u;
  const c = String(t.systemId || ""), p = String(t.objectId || "");
  if (!e || !c) return !1;
  const l = Oe(e, { playerMode: r.playerMode ?? !((y = game.user) != null && y.isGM), broadcast: r.broadcast === !0 });
  return l ? p && l.focusLocation ? l.focusLocation(c, p, r) : (u = l.focusSystem) == null ? void 0 : u.call(l, c, r) : !1;
}
function tn(e, t = "") {
  var c;
  let r = !1;
  for (const p of Mt(e))
    r = ((c = p.clearSystemFocus) == null ? void 0 : c.call(p, t)) || r;
  return r;
}
function _t() {
  return ft("open the map manager") ? (Pe || (Pe = new nn()), Pe.render({ force: !0 }), Pe) : null;
}
function Lt() {
  const e = js();
  return e.length ? e.length === 1 ? Oe(e[0].id, { playerMode: !0 }) : (De || (De = new an()), De.render({ force: !0 }), De) : (Ne("No galaxy map is currently visible to players."), null);
}
function js() {
  return Xe().filter((e) => e.visibility === "players").sort((e, t) => e.title.localeCompare(t.title));
}
function sn() {
  var t;
  const e = Xe().sort((r, c) => r.title.localeCompare(c.title));
  return (t = game.user) != null && t.isGM ? e.length === 1 ? Oe(e[0].id) : _t() : Lt();
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
  prepareMapForDisplay: Li,
  upsertSystem: ps,
  upsertObject: hs,
  upsertRoute: bs,
  upsertFaction: ws,
  updateMapMetadata: us,
  deleteFaction: vt,
  getTextureGuideMarkup: ki,
  activateObjectEditorControls: xi,
  revealSystemToPlayers: Ls,
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
  saveSystemPosition: _s,
  saveObjectPosition: vs,
  savePlanetLocation: ys,
  removePlanetLocation: gs,
  unlinkPlanetScene: Ss,
  clearMapView: (e) => {
    e.playerMode && ae === e && (ae = null);
    for (const [t, r] of Fe.entries())
      r === e && Fe.delete(t);
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
      var r;
      return (r = game.user) != null && r.isGM ? _t() : Lt();
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
    var p, l;
    const r = is(t), c = ((p = r == null ? void 0 : r.closest) == null ? void 0 : p.call(r, ".window-app, .application, .app")) ?? r;
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
    openMapManager: _t,
    openGalaxyMapFromSceneControls: sn,
    openPlayerMapChooser: Lt,
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
    saveSystemPosition: _s,
    saveObjectPosition: vs,
    savePlanetLocation: ys,
    removePlanetLocation: gs,
    unlinkPlanetScene: Ss,
    setCurrentSystem: yt,
    setCurrentObject: gt,
    revealSystemToPlayers: Ls,
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
      const p = Object.fromEntries(Object.entries(t).map(([l, y]) => [l, z(y)]));
      await Ft(p), Ne('Your galaxy maps were updated to the new format. Everything from the old single map is now inside a system called "System 1", and a backup of the old data was kept.');
    }
    if (!game.settings.get(be, at)) {
      const c = Rt(game.settings.get(be, Ue) ?? {}), p = $t();
      let l = 0;
      for (const [y, u] of Object.entries(c)) {
        if (!p[y]) continue;
        const E = z(p[y]);
        for (const I of (u == null ? void 0 : u.systems) ?? []) {
          const M = Xt(I == null ? void 0 : I.planetLocations);
          if (!M.length) continue;
          const _ = E.systems.flatMap((L) => L.objects).find((L) => L.id === I.id || L.id === `${I.id}-object`);
          !_ || _.planetLocations.length || (_.planetLocations = M.filter((L) => _.sceneIds.includes(L.sceneId)), l += _.planetLocations.length);
        }
        p[y] = z(E);
      }
      l && (await Ft(p), Ne(`Restored ${l} surface location${l === 1 ? "" : "s"} that went missing in an earlier update.`)), await game.settings.set(be, at, !0);
    }
  }
  game.socket.on(Ie, (t = {}) => {
    var r, c, p, l, y;
    if (t.action === "travel-request") {
      const u = Vi(t);
      u && (game.socket.emit(Ie, u), Nt(u));
      return;
    }
    if (t.action === "travel-ballot") {
      zi(t) && t.coordinatorId !== ((r = game.user) == null ? void 0 : r.id) && Nt(t);
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
      (p = game.user) != null && p.isGM ? Ps(t.mapId) : (ae == null ? void 0 : ae.mapId) === t.mapId && ae.render({ force: !0 });
      return;
    }
    (l = game.user) != null && l.isGM || (t.action === "open" && t.mapId && (ae == null || ae.close(), Oe(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "notify" && ((y = ui.notifications) == null || y.info(t.message || "New system discovered."), (ae == null ? void 0 : ae.mapId) === t.mapId && ae.render({ force: !0 })));
  }), console.log(`${be} | Ready. API available at game.galaxyMap.`);
});
