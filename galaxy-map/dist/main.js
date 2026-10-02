var Hs = Object.defineProperty;
var Vs = (e, t, s) => t in e ? Hs(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var $ = (e, t, s) => Vs(e, typeof t != "symbol" ? t + "" : t, s);
const He = [
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
], Xt = [
  ...He,
  { value: "color", label: "Flat color" },
  { value: "custom", label: "Custom texture" },
  { value: "none", label: "No detail view" }
], Us = [
  { value: "sphere", label: "Sphere" },
  { value: "cube", label: "Cube" },
  { value: "donut", label: "Donut" },
  { value: "asteroid", label: "Asteroid" },
  { value: "crystal", label: "Crystal" },
  { value: "cylinder", label: "Cylinder" }
], Ys = [
  { value: "smooth", label: "Smooth" },
  { value: "matte", label: "Matte" },
  { value: "holographic", label: "Holographic" }
];
function st(e) {
  return Us.some((t) => t.value === e) ? String(e) : "sphere";
}
function Jt(e) {
  return Ys.some((t) => t.value === e) ? String(e) : "smooth";
}
function ft(e) {
  return e === "auto" ? "ice" : Xt.some((t) => t.value === e) ? String(e) : "ice";
}
const Zt = /* @__PURE__ */ new Set(["color", "custom", "none"]), Bt = {
  sphere: He.map((e) => e.value).filter((e) => !["prison", "anomaly", "cube", "donut-planet"].includes(e)),
  cube: ["cube"],
  donut: ["donut-planet"],
  asteroid: ["asteroid"],
  crystal: ["anomaly"],
  cylinder: ["prison"]
};
function Kt(e) {
  const t = new Set(Bt[st(e)] ?? Bt.sphere);
  return Xt.filter((s) => t.has(s.value) || Zt.has(s.value));
}
function Qt(e, t) {
  var a;
  const s = ft(e), i = Kt(t);
  return i.some((n) => n.value === s) ? s : ((a = i.find((n) => !Zt.has(n.value))) == null ? void 0 : a.value) ?? "color";
}
function Ws(e) {
  return e === "black-hole";
}
function xe(e, t = "") {
  if (!e || e.obscured || e.planetPreset === "none") return null;
  const s = ft(e.planetPreset), i = He.find((r) => r.value === t) ?? He.find((r) => r.value === s) ?? He[0], a = !t && s === "custom" && !!e.planetTexture, n = !t && s === "color";
  return {
    texture: n ? null : a ? e.planetTexture : `modules/galaxy-map/assets/planets/${i.texture}`,
    label: n ? "Flat color" : a ? "Custom texture" : i.label,
    preset: n ? "color" : a ? "custom" : i.value,
    color: n ? e.planetColor || "#58d8ff" : i.color,
    shape: st(e.planetShape),
    finish: Jt(e.planetFinish)
  };
}
const pt = [
  { value: "gm", label: "GM approval" },
  { value: "majority", label: "Majority vote" },
  { value: "unanimous", label: "Unanimous agreement" }
];
function ht(e) {
  return pt.some((t) => t.value === e) ? String(e) : "unanimous";
}
function yt(e, t, s, i) {
  const a = ht(i), n = [...new Map((e ?? []).filter((S) => S == null ? void 0 : S.id).map((S) => [String(S.id), S])).values()], r = a === "gm" ? s != null && s.id ? [s] : [] : n.filter((S) => String(S.id) !== String(t)), c = r.map((S) => String(S.id)), p = Object.fromEntries(r.map((S) => [String(S.id), String(S.name || "Navigator").slice(0, 80)])), y = c.length + (a === "gm" ? 0 : 1), v = a === "gm" ? 1 : a === "majority" ? Math.floor(y / 2) + 1 : y;
  return { approvalMode: a, voterIds: c, voterNames: p, participantCount: y, requiredApprovals: v };
}
function es(e) {
  const t = ht(e == null ? void 0 : e.approvalMode), s = [...new Set(((e == null ? void 0 : e.voterIds) ?? []).map(String))], i = new Set([...(e == null ? void 0 : e.accepted) ?? []].map(String)), a = new Set([...(e == null ? void 0 : e.declined) ?? []].map(String)), n = t === "gm" ? 0 : 1, r = Math.max(1, Number(e == null ? void 0 : e.requiredApprovals) || (t === "unanimous" ? s.length + 1 : 1)), c = n + s.filter((v) => i.has(v)).length, p = s.filter((v) => a.has(v)).length, y = s.filter((v) => !i.has(v) && !a.has(v));
  return c >= r ? { outcome: "approved", acceptedCount: c, declinedCount: p, required: r, pendingIds: y } : t === "unanimous" && p > 0 ? { outcome: "declined", acceptedCount: c, declinedCount: p, required: r, pendingIds: y } : c + y.length < r ? { outcome: "declined", acceptedCount: c, declinedCount: p, required: r, pendingIds: y } : { outcome: "pending", acceptedCount: c, declinedCount: p, required: r, pendingIds: y };
}
const Te = 3, Xs = ["core", "colony", "frontier", "ruins", "restricted", "unknown"], Js = ["star", "planet", "moon", "station", "asteroid", "anomaly", "black-hole", "other"], ts = ["undiscovered", "known", "visited", "danger", "locked"], Zs = ["safe", "dangerous", "restricted", "smuggler", "unknown"], lt = ["gm", "players"], ss = ["inherit", ...lt], Ks = [
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
], gt = Ks.map((e) => e.value), dt = gt, rt = 0.2, ot = 10, is = 2400, Qs = 6e4;
function Ie(e = "gmf") {
  return `${e}-${foundry.utils.randomID(10)}`;
}
function Ue(e, t = "players") {
  const s = lt.includes(t) ? t : "players";
  return lt.includes(e) ? String(e) : s;
}
function ei(e) {
  return ss.includes(e) ? String(e) : "inherit";
}
function ti(e) {
  return typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "#58d8ff";
}
function ut(e) {
  return typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "";
}
function pe(e, t = 0) {
  const s = Number(e);
  return Number.isFinite(s) ? s : t;
}
function si(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  return [...new Set(t.map((s) => String(s).trim()).filter(Boolean))];
}
function ee(e, t, s) {
  return Math.min(s, Math.max(t, e));
}
function zt(e, t) {
  return !Array.isArray(e) || e.length < 3 ? [...t] : e.slice(0, 3).map((s, i) => ee(pe(s, t[i]), -2.5, 2.5));
}
function ns(e = {}) {
  const t = zt(e.normal, [0, 0, 1]), s = Math.hypot(...t) || 1;
  return {
    id: String(e.id || Ie("location")),
    sceneId: String(e.sceneId || "").trim(),
    shape: st(e.shape),
    position: zt(e.position, [0, 0, 1]),
    normal: t.map((i) => i / s),
    surfaceVersion: 1
  };
}
function as(e) {
  const t = /* @__PURE__ */ new Set();
  return (Array.isArray(e) ? e : []).slice(0, 64).map(ns).filter((s) => {
    const i = `${s.sceneId}:${s.shape}`;
    return !s.sceneId || t.has(i) ? !1 : (t.add(i), !0);
  });
}
function rs(e = {}) {
  return Js.includes(e.kind) ? e.kind : e.type === "station" || e.iconStyle === "station" ? "station" : e.type === "anomaly" ? "anomaly" : e.iconStyle === "star" ? "star" : e.iconStyle === "black-hole" ? "black-hole" : e.planetShape === "asteroid" ? "asteroid" : ["planet", "terrestrial", "gas-giant", "ice-world", "volcanic", "artificial", "ringed"].includes(e.iconStyle) ? "planet" : "other";
}
function tt(e = {}) {
  const t = si(e.sceneIds === void 0 ? e.sceneId : e.sceneIds), s = String(e.planetTexture || "").trim(), i = st(e.planetShape), a = ft(e.planetPreset), n = Qt(a, i), r = s && !["none", "color"].includes(n) ? "custom" : n, c = rs(e);
  return {
    id: String(e.id || Ie("object")),
    name: String(e.name || "Unnamed Object"),
    kind: c,
    x: ee(pe(e.x, 50), 0, 100),
    y: ee(pe(e.y, 50), 0, 100),
    status: ts.includes(e.status) ? e.status : "known",
    visibility: ei(e.visibility),
    factionId: String(e.factionId || ""),
    description: String(e.description || ""),
    image: String(e.image || ""),
    sceneIds: t,
    planetLocations: as(e.planetLocations).filter((y) => t.includes(y.sceneId)),
    journalId: String(e.journalId || ""),
    notes: String(e.notes || "").trim(),
    iconColor: ut(e.iconColor),
    iconSize: ee(pe(e.iconSize, 28), 18, 56),
    markerImage: String(e.markerImage || "").trim(),
    iconStyle: gt.includes(e.iconStyle) ? e.iconStyle : c === "star" ? "star" : c === "station" ? "station" : "planet",
    pulse: e.pulse !== !1,
    planetPreset: r,
    planetShape: i,
    planetFinish: Jt(e.planetFinish),
    planetTexture: s,
    planetColor: ut(e.planetColor) || "#58d8ff"
  };
}
function os(e = {}) {
  var c;
  const t = Array.isArray(e.objects) ? e.objects.map(tt) : [], s = new Set(t.map((p) => p.id)), i = (Array.isArray(e.routes) ? e.routes : []).map(vt).filter((p) => p.fromSystemId !== p.toSystemId && s.has(p.fromSystemId) && s.has(p.toSystemId)), a = t.some((p) => p.id === e.primaryObjectId) ? String(e.primaryObjectId) : ((c = t[0]) == null ? void 0 : c.id) ?? "", n = t.find((p) => p.id === a) ?? tt(e), r = {
    id: String(e.id || Ie("system")),
    name: String(e.name || "Unnamed System"),
    x: ee(pe(e.x, 50), 0, 100),
    y: ee(pe(e.y, 50), 0, 100),
    type: Xs.includes(e.type) ? e.type : "unknown",
    factionId: String(e.factionId || ""),
    status: ts.includes(e.status) ? e.status : "known",
    description: String(e.description || ""),
    visibility: Ue(e.visibility, "players"),
    notes: String(e.notes || "").trim(),
    backgroundImage: String(e.backgroundImage || "").trim(),
    iconColor: ut(e.iconColor),
    iconSize: ee(pe(e.iconSize, 30), 18, 56),
    markerImage: String(e.markerImage || "").trim(),
    iconStyle: gt.includes(e.iconStyle) ? e.iconStyle : "star",
    pulse: e.pulse !== !1,
    primaryObjectId: a,
    objects: t,
    routes: i
  };
  for (const [p, y] of Object.entries({
    image: n.image,
    sceneIds: [...n.sceneIds],
    planetLocations: [...n.planetLocations],
    journalId: n.journalId,
    planetPreset: n.planetPreset,
    planetShape: n.planetShape,
    planetFinish: n.planetFinish,
    planetTexture: n.planetTexture,
    planetColor: n.planetColor
  })) Object.defineProperty(r, p, { value: y, enumerable: !1, configurable: !0 });
  return r;
}
function vt(e = {}) {
  return {
    id: String(e.id || Ie("route")),
    fromSystemId: String(e.fromSystemId || ""),
    toSystemId: String(e.toSystemId || ""),
    type: Zs.includes(e.type) ? e.type : "unknown",
    travelTime: String(e.travelTime || ""),
    fuelCost: pe(e.fuelCost, 0),
    visibility: Ue(e.visibility, "players"),
    notes: String(e.notes || "")
  };
}
function cs(e = {}) {
  return {
    id: String(e.id || Ie("faction")),
    name: String(e.name || "Unaffiliated"),
    color: ti(e.color),
    description: String(e.description || ""),
    visibility: Ue(e.visibility, "players")
  };
}
function St(e = {}) {
  return `${String(e.id || "galaxy")}-system-1`;
}
function ii(e = {}) {
  const t = String(e.id || e.objectId || Ie("object")), s = rs(e);
  return {
    ...e,
    id: t,
    name: String(e.name || "Unnamed Entity"),
    kind: s,
    x: e.x,
    y: e.y,
    visibility: e.visibility,
    iconColor: e.iconColor,
    iconSize: e.iconSize,
    iconStyle: e.iconStyle === "planet" && s !== "planet" ? s === "station" ? "station" : s === "star" ? "star" : "diamond" : e.iconStyle,
    pulse: e.pulse
  };
}
function ls(e, t, s = "", i = St(e), a = []) {
  var r;
  const n = t.some((c) => c.id === s) ? s : ((r = t[0]) == null ? void 0 : r.id) ?? "";
  return {
    id: i,
    name: "System 1",
    x: 50,
    y: 50,
    type: "core",
    factionId: "",
    status: "known",
    description: "",
    visibility: Ue(e.visibility, "players"),
    notes: "",
    iconColor: "",
    iconSize: 30,
    iconStyle: "star",
    pulse: !0,
    primaryObjectId: n,
    objects: t,
    routes: a
  };
}
function ni(e, t) {
  var r;
  const i = (Array.isArray(e.systems) ? e.systems : []).map(ii), a = String(e.currentSystemId || ((r = i[0]) == null ? void 0 : r.id) || ""), n = ls(e, i, a, St(e), Array.isArray(e.routes) ? e.routes : []);
  return {
    ...e,
    schemaVersion: Te,
    migratedFromSchema: t,
    systems: [n],
    routes: [],
    currentLocation: { systemId: n.id, objectId: n.primaryObjectId },
    currentSystemId: n.id
  };
}
function Gt(e) {
  return !!(e != null && e.id && (e == null ? void 0 : e.primaryObjectId) === `${e.id}-object` && Array.isArray(e.objects) && e.objects.some((t) => t.id === e.primaryObjectId));
}
function ai(e) {
  var ie, F, A, E;
  const t = Array.isArray(e.systems) ? e.systems : [], s = t.filter(Gt), i = t.filter((k) => !Gt(k));
  if (!s.length && t.length) return { ...e, schemaVersion: Te };
  const a = new Set(i.map((k) => String(k.id)));
  let n = St(e);
  a.has(n) && (n = `${n}-legacy`);
  const r = new Set(s.map((k) => String(k.id))), c = new Map(s.map((k) => [String(k.id), String(k.primaryObjectId)])), p = s.flatMap((k) => (k.objects ?? []).map((R) => {
    const ce = R.id === k.primaryObjectId;
    return {
      ...R,
      x: ce ? k.x : R.x,
      y: ce ? k.y : R.y,
      visibility: R.visibility === "inherit" ? k.visibility : R.visibility,
      factionId: R.factionId || k.factionId || ""
    };
  })), y = String(((ie = e.currentLocation) == null ? void 0 : ie.systemId) || e.currentSystemId || ""), v = s.find((k) => k.id === y), S = String(((F = e.currentLocation) == null ? void 0 : F.objectId) || (v == null ? void 0 : v.primaryObjectId) || ((A = p[0]) == null ? void 0 : A.id) || ""), b = Array.isArray(e.routes) ? e.routes : [], C = b.filter((k) => r.has(String(k.fromSystemId)) && r.has(String(k.toSystemId))).map((k) => ({ ...k, fromSystemId: c.get(String(k.fromSystemId)), toSystemId: c.get(String(k.toSystemId)) })), P = ls(e, p, S, n, C), O = [P, ...i], D = new Set(O.map((k) => String(k.id))), w = /* @__PURE__ */ new Set(), Z = b.filter((k) => !(r.has(String(k.fromSystemId)) && r.has(String(k.toSystemId)))).map((k) => ({
    ...k,
    fromSystemId: r.has(String(k.fromSystemId)) ? n : k.fromSystemId,
    toSystemId: r.has(String(k.toSystemId)) ? n : k.toSystemId
  })).filter((k) => {
    if (k.fromSystemId === k.toSystemId || !D.has(String(k.fromSystemId)) || !D.has(String(k.toSystemId))) return !1;
    const R = [k.fromSystemId, k.toSystemId].sort().join(":");
    return w.has(R) ? !1 : (w.add(R), !0);
  }), z = r.has(y) || !D.has(y) ? n : y;
  return {
    ...e,
    schemaVersion: Te,
    migratedFromSchema: 2,
    systems: O,
    routes: Z,
    currentLocation: { systemId: z, objectId: z === n ? P.primaryObjectId : ((E = e.currentLocation) == null ? void 0 : E.objectId) ?? "" },
    currentSystemId: z
  };
}
function ri(e = {}) {
  const t = Number(e.schemaVersion) || 1;
  if (t > Te) throw new Error(`Galaxy Map schema ${t} is newer than supported schema ${Te}.`);
  return t >= Te ? { ...e, schemaVersion: Te } : t < 2 ? ni(e, t) : ai(e);
}
function T(e = {}) {
  var v, S, b, C;
  const t = ri(e), s = Array.isArray(t.systems) ? t.systems.map(os) : [], i = Array.isArray(t.routes) ? t.routes.map(vt) : [], a = Array.isArray(t.factions) ? t.factions.map(cs) : [], n = String(((v = t.currentLocation) == null ? void 0 : v.systemId) || t.currentSystemId || ((S = s[0]) == null ? void 0 : S.id) || ""), r = s.some((P) => P.id === n) ? n : ((b = s[0]) == null ? void 0 : b.id) ?? "", c = s.find((P) => P.id === r), p = String(((C = t.currentLocation) == null ? void 0 : C.objectId) || ""), y = c != null && c.objects.some((P) => P.id === p) ? p : (c == null ? void 0 : c.primaryObjectId) ?? "";
  return {
    schemaVersion: Te,
    id: String(t.id || Ie("map")),
    title: String(t.title || "Untitled Galaxy Map"),
    subtitle: String(t.subtitle || ""),
    description: String(t.description || ""),
    backgroundImage: String(t.backgroundImage || ""),
    visibility: Ue(t.visibility, "players"),
    travelApprovalMode: ht(t.travelApprovalMode),
    currentLocation: { systemId: r, objectId: y },
    currentSystemId: r,
    systems: s,
    routes: i,
    factions: a
  };
}
function je(e, t) {
  return (t == null ? void 0 : t.visibility) === "inherit" ? (e == null ? void 0 : e.visibility) ?? "gm" : (t == null ? void 0 : t.visibility) ?? "gm";
}
const oi = "modules/galaxy-map/assets/frames/galaxy-frame-cyan.svg";
let Ht = null;
const Vt = /* @__PURE__ */ new Map();
let Ke = null;
const Qe = {
  default: { primary: "#69e8ff", success: "#62ffb6", background: "#03070b" },
  ember: { primary: "#ffb86b", success: "#ffe08a", background: "#0d0604" },
  violet: { primary: "#a9b8ff", success: "#7dffc4", background: "#070713" },
  "space-police": { primary: "#fff15a", success: "#9fffd1", background: "#020202" },
  red: { primary: "#ff304f", success: "#66ffc7", background: "#050103" },
  corporate: { primary: "#147dba", success: "#21875c", background: "#dce3e6" }
};
function Ut(e, t, s) {
  const i = (r) => [1, 3, 5].map((c) => Number.parseInt(r.slice(c, c + 2), 16)), a = i(e), n = i(t);
  return `rgb(${a.map((r, c) => Math.round(r * s + n[c] * (1 - s))).join(", ")})`;
}
function ci() {
  var i, a, n, r, c, p;
  const e = document.documentElement, t = ((i = e == null ? void 0 : e.dataset) == null ? void 0 : i.holosuiteDeviceStyle) || ((n = (a = document.body) == null ? void 0 : a.dataset) == null ? void 0 : n.holosuiteDeviceStyle) || "";
  if (Qe[t]) return Qe[t];
  const s = ((r = e == null ? void 0 : e.dataset) == null ? void 0 : r.holosuiteTheme) || ((p = (c = document.body) == null ? void 0 : c.dataset) == null ? void 0 : p.holosuiteTheme) || "default";
  return Qe[s] ?? Qe.default;
}
async function ds(e) {
  const { primary: t, success: s, background: i } = ci(), a = Ut(t, i, 0.58), n = Ut(t, i, 0.34), r = [t, s, a, n, i].join("|");
  e.dataset.gmfFramePalette = r;
  let c = Vt.get(r);
  if (!c)
    try {
      Ht ?? (Ht = fetch(oi).then((v) => {
        if (!v.ok) throw new Error(`Galaxy frame request failed (${v.status})`);
        return v.text();
      }));
      let p = await Ht;
      p = p.replace(/<script\b[\s\S]*?<\/script>/gi, "");
      const y = /* @__PURE__ */ new Map([
        ["#18ebed", t],
        ["#28f3f5", t],
        ["#3be8e4", t],
        ["#64f4f1", s],
        ["#1490ab", a],
        ["#22788b", n],
        ["#042228", i]
      ]);
      for (const [v, S] of y) p = p.replace(new RegExp(v, "gi"), S);
      c = URL.createObjectURL(new Blob([p], { type: "image/svg+xml" })), Vt.set(r, c);
    } catch {
      return;
    }
  e.isConnected && e.dataset.gmfFramePalette === r && e.style.setProperty("--gmf-frame-image", `url("${c}")`);
}
function li() {
  if (Ke) return;
  Ke = new MutationObserver(() => {
    document.querySelectorAll(".gmf-manager-window, .gmf-map-window, .gmf-crud-dialog").forEach((t) => void ds(t));
  });
  const e = { attributes: !0, attributeFilter: ["data-holosuite-theme", "data-holosuite-device-style"] };
  Ke.observe(document.documentElement, e), document.body && Ke.observe(document.body, e);
}
function us(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
function ms(e) {
  var t, s;
  return e ? (t = e.matches) != null && t.call(e, ".window-app, .application, .app") ? e : (s = e.closest) == null ? void 0 : s.call(e, ".window-app, .application, .app") : null;
}
function it(e, t) {
  const s = us(t), i = ms(s);
  i && (li(), ds(i));
  const a = Array.from((s == null ? void 0 : s.querySelectorAll("[data-gmf-window-drag]")) ?? []);
  if (!(!s || !i || !a.length)) {
    s.querySelectorAll("[data-action='close-window']").forEach((n) => {
      n.dataset.gmfCloseBound !== "true" && (n.dataset.gmfCloseBound = "true", n.addEventListener("click", () => {
        var r;
        return (r = e.close) == null ? void 0 : r.call(e);
      }));
    });
    for (const n of a)
      n.dataset.gmfDragBound !== "true" && (n.dataset.gmfDragBound = "true", n.addEventListener("pointerdown", (r) => {
        var O, D, w;
        if (r.button !== 0) return;
        const c = r.target;
        if ((O = c == null ? void 0 : c.closest) != null && O.call(c, "button, input, select, textarea, a, [data-action]")) return;
        const p = i.getBoundingClientRect(), y = r.clientX, v = r.clientY, S = p.left, b = p.top;
        (D = e.bringToFront ?? e.bringToTop) == null || D.call(e), (w = n.setPointerCapture) == null || w.call(n, r.pointerId), n.classList.add("is-dragging");
        const C = (Z) => {
          var E;
          const z = i.getBoundingClientRect().width, ie = i.getBoundingClientRect().height, F = Math.max(0, Math.min(window.innerWidth - Math.min(z, 80), S + Z.clientX - y)), A = Math.max(0, Math.min(window.innerHeight - Math.min(ie, 48), b + Z.clientY - v));
          (E = e.setPosition) == null || E.call(e, { left: F, top: A });
        }, P = () => {
          n.classList.remove("is-dragging"), n.removeEventListener("pointermove", C), n.removeEventListener("pointerup", P), n.removeEventListener("pointercancel", P);
        };
        n.addEventListener("pointermove", C), n.addEventListener("pointerup", P), n.addEventListener("pointercancel", P);
      }));
  }
}
function di(e, t) {
  var y, v;
  const s = us(t), i = ms(s), a = (y = i == null ? void 0 : i.querySelector) == null ? void 0 : y.call(i, ":scope > .window-content");
  if (!s || !i || !a || a.querySelector(":scope > .gmf-dialog-header")) return;
  const n = document.createElement("header");
  n.className = "gmf-dialog-header", n.dataset.gmfWindowDrag = "true";
  const r = document.createElement("div");
  r.className = "gmf-dialog-header__identity", r.innerHTML = '<span class="gmf-dialog-header__orb"><i class="fa-solid fa-satellite"></i></span><span><small>GALAXY MAP // CONTROL PANEL</small><strong></strong></span>';
  const c = r.querySelector("strong");
  c && (c.textContent = (e == null ? void 0 : e.title) || ((v = i.querySelector(".window-title")) == null ? void 0 : v.textContent) || "Galaxy Map");
  const p = document.createElement("button");
  p.type = "button", p.className = "gmf-window-close", p.dataset.action = "close-window", p.title = "Close", p.setAttribute("aria-label", "Close window"), p.innerHTML = '<i class="fa-solid fa-xmark"></i>', n.append(r, p), a.prepend(n), it(e, i);
}
const Ce = {
  classes: ["galaxy-map", "gmf-crud-dialog"]
};
function It() {
  const { ApplicationV2: e, HandlebarsApplicationMixin: t } = foundry.applications.api;
  return t(e);
}
function mi(e) {
  return String(e || "galaxy-map").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "galaxy-map";
}
function fi(e, t) {
  const s = JSON.stringify(t, null, 2), i = globalThis.saveDataToFile;
  if (typeof i == "function") {
    i(s, "application/json", e);
    return;
  }
  const a = new Blob([s], { type: "application/json" }), n = URL.createObjectURL(a), r = document.createElement("a");
  r.href = n, r.download = e, document.body.appendChild(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 0);
}
function le(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function fs(e) {
  return (e == null ? void 0 : e[0]) ?? e ?? null;
}
function Yt(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
}
function ps(e) {
  const t = (s) => s ? e.querySelector(`[name="${s}"]`) : null;
  e.querySelectorAll("[data-browse-target]").forEach((s) => {
    s.addEventListener("click", (i) => {
      var r, c;
      i.preventDefault();
      const a = t(s.dataset.browseTarget);
      if (!a) return;
      const n = ((c = (r = foundry.applications) == null ? void 0 : r.apps) == null ? void 0 : c.FilePicker) ?? globalThis.FilePicker;
      new n({
        type: "image",
        current: a.value,
        callback: (p) => {
          a.value = p, Yt(a);
        }
      }).browse();
    });
  }), e.querySelectorAll("[data-clear-target]").forEach((s) => {
    s.addEventListener("click", (i) => {
      i.preventDefault();
      const a = t(s.dataset.clearTarget);
      a && (a.value = "", Yt(a));
    });
  });
}
function pi(e) {
  var z;
  const {
    templateRoot: t,
    getMaps: s,
    prepareMapForManager: i,
    getRawMap: a,
    exportMap: n,
    duplicateMap: r,
    deleteMap: c,
    createMap: p,
    deleteSystem: y,
    deleteObject: v,
    deleteRoute: S,
    deleteFaction: b,
    openMap: C,
    showMapToPlayers: P,
    hideSystemFromPlayers: O,
    hideRouteFromPlayers: D,
    hideFactionFromPlayers: w,
    clearManagerApp: Z
  } = e;
  return z = class extends It() {
    constructor(A = {}) {
      super(A);
      $(this, "selectedMapId");
      $(this, "activeTab");
      $(this, "expandedSystemId");
      this.selectedMapId = A.selectedMapId ?? null, this.activeTab = ["systems", "routes", "factions"].includes(A.activeTab) ? A.activeTab : "systems", this.expandedSystemId = A.expandedSystemId;
    }
    async _prepareContext(A) {
      var ce, fe;
      const E = await super._prepareContext(A), k = s().sort((se, Y) => se.title.localeCompare(Y.title));
      (!this.selectedMapId || !k.some((se) => se.id === this.selectedMapId)) && (this.selectedMapId = ((ce = k[0]) == null ? void 0 : ce.id) ?? null);
      const R = this.selectedMapId ? i(a(this.selectedMapId)) : null;
      if (R) {
        const se = new Set(R.systems.map((Y) => Y.id));
        this.expandedSystemId && !se.has(this.expandedSystemId) && (this.expandedSystemId = void 0), this.expandedSystemId === void 0 && (this.expandedSystemId = ((fe = R.systems[0]) == null ? void 0 : fe.id) ?? null), R.systems = R.systems.map((Y) => ({
          ...Y,
          isExpanded: Y.id === this.expandedSystemId
        }));
      }
      return {
        ...E,
        maps: k,
        selectedMap: R,
        selectedMapId: this.selectedMapId,
        activeTab: this.activeTab,
        showSystems: this.activeTab === "systems",
        showRoutes: this.activeTab === "routes",
        showFactions: this.activeTab === "factions",
        hasMaps: k.length > 0
      };
    }
    _attachPartListeners(A, E, k) {
      var R, ce, fe, se, Y, Me;
      super._attachPartListeners(A, E, k), it(this, E), (R = E.querySelector("[data-action='create-map']")) == null || R.addEventListener("click", () => this._onCreateMap()), (ce = E.querySelector("[data-action='edit-map-metadata']")) == null || ce.addEventListener("click", () => {
        this._openViewportEditor("map");
      }), (fe = E.querySelector("[data-action='create-system']")) == null || fe.addEventListener("click", () => {
        this._openViewportEditor("system");
      }), (se = E.querySelector("[data-action='create-route']")) == null || se.addEventListener("click", () => {
        this._openViewportEditor("route");
      }), (Y = E.querySelector("[data-action='create-faction']")) == null || Y.addEventListener("click", () => {
        this._openViewportEditor("faction");
      }), E.querySelectorAll("[data-manager-tab]").forEach((x) => {
        x.addEventListener("click", () => {
          const oe = x.dataset.managerTab;
          !["systems", "routes", "factions"].includes(oe) || oe === this.activeTab || (this.activeTab = oe, this.render({ force: !0 }));
        });
      }), E.querySelectorAll("[data-toggle-system]").forEach((x) => {
        x.addEventListener("click", () => {
          const oe = x.dataset.toggleSystem;
          this.expandedSystemId = this.expandedSystemId === oe ? null : oe, this.render({ force: !0 });
        });
      }), E.querySelectorAll("[data-edit-system]").forEach((x) => {
        x.addEventListener("click", () => this._openViewportEditor("system", { id: x.dataset.editSystem }));
      }), E.querySelectorAll("[data-create-object]").forEach((x) => {
        x.addEventListener("click", () => this._openViewportEditor("entity", { systemId: x.dataset.createObject }));
      }), E.querySelectorAll("[data-edit-object]").forEach((x) => {
        x.addEventListener("click", () => this._openViewportEditor("entity", { systemId: x.dataset.objectSystem, id: x.dataset.editObject }));
      }), E.querySelectorAll("[data-delete-object]").forEach((x) => {
        x.addEventListener("click", () => this._confirmDeleteObject(x.dataset.objectSystem, x.dataset.deleteObject));
      }), E.querySelectorAll("[data-show-system]").forEach((x) => {
        x.addEventListener("click", () => O(this.selectedMapId, x.dataset.showSystem, !1));
      }), E.querySelectorAll("[data-hide-system]").forEach((x) => {
        x.addEventListener("click", () => O(this.selectedMapId, x.dataset.hideSystem, !0));
      }), E.querySelectorAll("[data-delete-system]").forEach((x) => {
        x.addEventListener("click", () => this._confirmDeleteSystem(x.dataset.deleteSystem));
      }), E.querySelectorAll("[data-edit-route]").forEach((x) => {
        x.addEventListener("click", () => this._openViewportEditor("route", { id: x.dataset.editRoute, systemId: x.dataset.routeSystem }));
      }), E.querySelectorAll("[data-show-route]").forEach((x) => {
        x.addEventListener("click", () => D(this.selectedMapId, x.dataset.showRoute, !1, x.dataset.routeSystem));
      }), E.querySelectorAll("[data-hide-route]").forEach((x) => {
        x.addEventListener("click", () => D(this.selectedMapId, x.dataset.hideRoute, !0, x.dataset.routeSystem));
      }), E.querySelectorAll("[data-delete-route]").forEach((x) => {
        x.addEventListener("click", () => this._confirmDeleteRoute(x.dataset.deleteRoute, x.dataset.routeSystem));
      }), E.querySelectorAll("[data-edit-faction]").forEach((x) => {
        x.addEventListener("click", () => this._openViewportEditor("faction", { id: x.dataset.editFaction }));
      }), E.querySelectorAll("[data-show-faction]").forEach((x) => {
        x.addEventListener("click", () => w(this.selectedMapId, x.dataset.showFaction, !1));
      }), E.querySelectorAll("[data-hide-faction]").forEach((x) => {
        x.addEventListener("click", () => w(this.selectedMapId, x.dataset.hideFaction, !0));
      }), E.querySelectorAll("[data-delete-faction]").forEach((x) => {
        x.addEventListener("click", () => this._confirmDeleteFaction(x.dataset.deleteFaction));
      }), (Me = E.querySelector("[data-action='export-map']")) == null || Me.addEventListener("click", () => {
        this.selectedMapId && n(this.selectedMapId);
      }), E.querySelectorAll("[data-select-map]").forEach((x) => {
        x.addEventListener("click", () => {
          this.selectedMapId = x.dataset.selectMap, this.expandedSystemId = void 0, this.render({ force: !0 });
        });
      }), E.querySelectorAll("[data-open-map]").forEach((x) => {
        x.addEventListener("click", () => C(x.dataset.openMap));
      }), E.querySelectorAll("[data-show-map]").forEach((x) => {
        x.addEventListener("click", () => P(x.dataset.showMap));
      }), E.querySelectorAll("[data-duplicate-map]").forEach((x) => {
        x.addEventListener("click", async () => {
          const oe = await r(x.dataset.duplicateMap);
          oe && (this.selectedMapId = oe.id, this.render({ force: !0 }));
        });
      }), E.querySelectorAll("[data-delete-map]").forEach((x) => {
        x.addEventListener("click", async () => {
          const oe = x.dataset.deleteMap, Ae = a(oe);
          await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${le((Ae == null ? void 0 : Ae.title) ?? oe)}</strong>? This cannot be undone.</p>`
          }, Ce) && (await c(oe), this.selectedMapId === oe && (this.selectedMapId = null), this.render({ force: !0 }));
        });
      });
    }
    async _onCreateMap() {
      const A = await p({
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
      A && (this.selectedMapId = A.id, this.render({ force: !0 }));
    }
    _openViewportEditor(A, E = {}) {
      var k, R;
      this.selectedMapId && ((R = (k = C(this.selectedMapId)) == null ? void 0 : k.openEditor) == null || R.call(k, A, E));
    }
    async _confirmDeleteSystem(A) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, Ce) && await y(this.selectedMapId, A);
    }
    async _confirmDeleteObject(A, E) {
      await Dialog.confirm({
        title: "Delete Entity",
        content: "<p>Delete this entity and its linked content from the system?</p>"
      }) && await v(this.selectedMapId, A, E);
    }
    async _confirmDeleteRoute(A, E = "") {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, Ce) && await S(this.selectedMapId, A, E);
    }
    async _confirmDeleteFaction(A) {
      await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }, Ce) && await b(this.selectedMapId, A);
    }
    async close(A = {}) {
      return Z(this), super.close(A);
    }
  }, $(z, "DEFAULT_OPTIONS", {
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
  }), $(z, "PARTS", {
    main: {
      template: `${t}/map-manager.hbs`
    }
  }), z;
}
function hi(e, t) {
  const s = (i, a, n) => (a[0] - i[0]) * (n[1] - i[1]) - (a[1] - i[1]) * (n[0] - i[0]);
  return t.flatMap((i) => {
    const a = e.filter((y) => y.factionId === i.id && !y.obscured);
    if (!a.length) return [];
    const n = a.flatMap((y) => Array.from({ length: 12 }, (v, S) => {
      const b = S * Math.PI / 6;
      return [
        Math.max(1, Math.min(99, y.x + Math.cos(b) * 7)),
        Math.max(1, Math.min(99, y.y + Math.sin(b) * 9))
      ];
    })).sort((y, v) => y[0] - v[0] || y[1] - v[1]), r = (y) => {
      const v = [];
      for (const S of y) {
        for (; v.length > 1 && s(v[v.length - 2], v[v.length - 1], S) <= 0; ) v.pop();
        v.push(S);
      }
      return v.slice(0, -1);
    }, c = [...r(n), ...r([...n].reverse())], p = Math.min(...n.map((y) => y[1]));
    return [{
      id: i.id,
      name: i.name,
      color: i.color,
      points: c.map((y) => y.map((v) => v.toFixed(2)).join(",")).join(" "),
      labelX: (Math.min(...n.map((y) => y[0])) + Math.max(...n.map((y) => y[0]))) / 2,
      labelY: Math.max(3, p + 3)
    }];
  });
}
function hs() {
  var e, t, s;
  try {
    const i = (t = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : t.call(e, "bounty-board");
    if ((i == null ? void 0 : i.active) === !1) return null;
    const a = i.api ?? ((s = game.scifiSuite) == null ? void 0 : s.bountyBoard);
    return typeof (a == null ? void 0 : a.getBountiesForScene) == "function" ? a : null;
  } catch {
    return null;
  }
}
function yi(e) {
  const t = hs();
  if (!t || !Array.isArray(e == null ? void 0 : e.sceneIds)) return [];
  const s = /* @__PURE__ */ new Set(), i = [];
  try {
    for (const a of e.sceneIds)
      for (const n of t.getBountiesForScene(String(a)) ?? []) {
        const r = String((n == null ? void 0 : n.id) ?? "");
        !r || s.has(r) || (s.add(r), i.push({
          id: r,
          name: String(n.name || "Unknown target"),
          image: String(n.image || ""),
          status: String(n.status || ""),
          statusLabel: String(n.statusLabel || n.status || ""),
          reward: String(n.reward || ""),
          sceneId: String(n.sceneId || a)
        }));
      }
  } catch {
    return [];
  }
  return i;
}
function gi(e) {
  try {
    const t = hs();
    return typeof (t == null ? void 0 : t.openBounty) == "function" && t.openBounty(String(e)) !== !1;
  } catch {
    return !1;
  }
}
const qe = /* @__PURE__ */ new Map(), vi = 40, Si = 192;
function Ii(e) {
  return new Promise((t, s) => {
    const i = new Image();
    i.onload = () => t(i), i.onerror = () => s(new Error("Image unavailable")), i.src = e;
  });
}
async function bi(e) {
  if (!e) return null;
  try {
    const t = await Ii(e), s = Math.min(1, Si / Math.max(t.naturalWidth || t.width, t.naturalHeight || t.height)), i = Math.max(2, Math.round((t.naturalWidth || t.width) * s)), a = Math.max(2, Math.round((t.naturalHeight || t.height) * s)), n = document.createElement("canvas");
    n.width = i, n.height = a;
    const r = n.getContext("2d", { willReadFrequently: !0 });
    if (!r) return null;
    r.drawImage(t, 0, 0, i, a);
    const c = r.getImageData(0, 0, i, a), p = r.createImageData(i, a), y = new Float32Array(i * a);
    for (let S = 0; S < y.length; S++) {
      const b = S * 4;
      y[S] = c.data[b] * 0.299 + c.data[b + 1] * 0.587 + c.data[b + 2] * 0.114;
    }
    const v = (S, b) => y[b * i + S];
    for (let S = 1; S < a - 1; S++)
      for (let b = 1; b < i - 1; b++) {
        const C = -v(b - 1, S - 1) + v(b + 1, S - 1) - 2 * v(b - 1, S) + 2 * v(b + 1, S) - v(b - 1, S + 1) + v(b + 1, S + 1), P = -v(b - 1, S - 1) - 2 * v(b, S - 1) - v(b + 1, S - 1) + v(b - 1, S + 1) + 2 * v(b, S + 1) + v(b + 1, S + 1), O = Math.hypot(C, P), D = Math.max(0, Math.min(235, (O - 34) * 2.1)), w = (S * i + b) * 4;
        p.data[w] = 104, p.data[w + 1] = 241, p.data[w + 2] = 255, p.data[w + 3] = D;
      }
    return r.clearRect(0, 0, i, a), r.putImageData(p, 0, 0), n.toDataURL("image/png");
  } catch {
    return null;
  }
}
function wi(e, t = "") {
  const s = `${t}\0${e}`, i = qe.get(s);
  if (i)
    return qe.delete(s), qe.set(s, i), i;
  for (; qe.size >= vi; ) {
    const n = qe.keys().next().value;
    if (n === void 0) break;
    qe.delete(n);
  }
  const a = bi(e);
  return qe.set(s, a), a;
}
function Mi({ root: e, stage: t, resolveItems: s, onOpen: i }) {
  const a = e.querySelector("[data-intel-layer]");
  if (!a) return null;
  const n = new AbortController(), r = n.signal, c = document.createElement("aside");
  c.className = "gmf-intel-callout", c.setAttribute("aria-label", "Bounty intel"), c.hidden = !0, c.innerHTML = `
    <span class="gmf-intel-callout__connector" aria-hidden="true"></span>
    <div class="gmf-intel-callout__stack" data-intel-list role="group" aria-label="Matching bounties"></div>`, a.append(c);
  let p = [], y = null, v = null, S = null, b = 0, C = 0;
  const P = () => {
    v && clearTimeout(v), v = null;
  }, O = () => {
    b++, S && clearTimeout(S), S = null, v = null, y = null, p = [], C++, c.hidden = !0, c.classList.remove("is-visible", "is-left");
  }, D = (F = 180) => {
    P(), b++, S && clearTimeout(S), S = null, v = setTimeout(O, F);
  }, w = () => {
    if (!y || c.hidden) return;
    const F = t.getBoundingClientRect(), A = y.getBoundingClientRect();
    c.style.setProperty("--gmf-intel-stack-height", `${Math.max(80, F.height - 72)}px`);
    const E = c.offsetWidth || 224, k = c.offsetHeight || 126, R = A.right - F.left + E + 24 > F.width, ce = R ? A.left - F.left - E - 18 : A.right - F.left + 18, fe = Math.max(48, Math.min(F.height - k - 12, A.top - F.top + A.height / 2 - k / 2));
    c.classList.toggle("is-left", R), c.style.left = `${Math.max(8, ce)}px`, c.style.top = `${fe}px`;
  }, Z = () => {
    const F = c.querySelector("[data-intel-list]");
    if (!F || !p.length) return O();
    F.replaceChildren();
    const A = ++C;
    p.forEach((E, k) => {
      const R = document.createElement("button");
      R.type = "button", R.className = "gmf-intel-callout__body", R.dataset.intelOpen = E.id, R.style.setProperty("--gmf-intel-index", String(k)), R.style.setProperty("--gmf-intel-delay", `${k * 55}ms`), R.innerHTML = `
        <span class="gmf-intel-callout__portrait"><img alt="" hidden /><i class="fa-solid fa-crosshairs"></i></span>
        <span class="gmf-intel-callout__copy"><small></small><strong></strong><span></span></span>`;
      const ce = R.querySelector("strong"), fe = R.querySelector("small"), se = R.querySelector(".gmf-intel-callout__copy > span"), Y = R.querySelector("img"), Me = R.querySelector("i");
      ce && (ce.textContent = E.name), fe && (fe.textContent = `BOUNTY // ${(E.statusLabel || "INTEL").toUpperCase()}`), se && (se.textContent = E.reward || ""), R.addEventListener("click", () => i(E.id), { signal: r }), E.image && Y && (Y.src = E.image, Y.classList.add("is-css-fallback"), Y.hidden = !1, Me && (Me.hidden = !0), Y.onerror = () => {
        A === C && (Y.hidden = !0, Me && (Me.hidden = !1));
      }, wi(E.image, E.id).then((x) => {
        !x || A !== C || !R.isConnected || (Y.classList.remove("is-css-fallback"), Y.src = x);
      })), F.append(R);
    }), w();
  }, z = async (F) => {
    P(), y = F;
    const A = ++b;
    let E = [];
    try {
      E = await s(F.dataset.systemId ?? "");
    } catch {
    }
    if (!(A !== b || y !== F)) {
      if (!E.length) return O();
      p = E, c.hidden = !1, Z(), requestAnimationFrame(() => {
        w(), c.classList.add("is-visible");
      });
    }
  }, ie = (F) => {
    P(), b++, S && clearTimeout(S), S = setTimeout(() => {
      S = null, z(F);
    }, 90);
  };
  return e.querySelectorAll("[data-system-id]").forEach((F) => {
    F.addEventListener("pointerenter", () => ie(F), { signal: r }), F.addEventListener("pointerleave", () => D(), { signal: r }), F.addEventListener("focus", () => ie(F), { signal: r }), F.addEventListener("blur", () => D(), { signal: r }), F.addEventListener("pointerdown", () => O(), { signal: r });
  }), c.addEventListener("pointerenter", P, { signal: r }), c.addEventListener("pointerleave", () => D(), { signal: r }), c.addEventListener("click", (F) => F.stopPropagation(), { signal: r }), t.addEventListener("wheel", () => requestAnimationFrame(w), { signal: r }), window.addEventListener("resize", w, { signal: r }), {
    dispose() {
      b++, v && clearTimeout(v), S && clearTimeout(S), n.abort(), c.remove();
    }
  };
}
function _i({ host: e }) {
  const t = document.createElement("aside");
  t.className = "gmf-location-callout", t.hidden = !0, t.innerHTML = `
    <span class="gmf-location-callout__connector" aria-hidden="true"></span>
    <strong data-location-name></strong>`, e.append(t);
  let s = null, i = { x: 0, y: 0, visible: !1 }, a = null;
  const n = () => {
    a && clearTimeout(a), a = null;
  }, r = () => {
    n(), s = null, t.hidden = !0, t.classList.remove("is-visible", "is-left");
  }, c = () => {
    if (!s || t.hidden || !i.visible) return;
    const v = t.offsetWidth || 180, S = t.offsetHeight || 24, b = i.x + v + 76 > e.clientWidth, C = b ? i.x - v - 64 : i.x + 64, P = Math.max(8, Math.min(e.clientHeight - S - 8, i.y - S / 2));
    t.classList.toggle("is-left", b), t.style.left = `${Math.max(8, C)}px`, t.style.top = `${P}px`;
  }, p = (v) => {
    n(), s = v;
    const S = t.querySelector("[data-location-name]");
    S && (S.textContent = v.missing ? "Missing linked scene" : v.accessible ? v.name : "Restricted location"), t.hidden = !1, c(), requestAnimationFrame(() => {
      c(), t.classList.add("is-visible");
    });
  }, y = (v = 180) => {
    n(), a = setTimeout(r, v);
  };
  return {
    show: p,
    scheduleHide: y,
    hide: r,
    setAnchor(v) {
      if (i = v, !v.visible) return y(40);
      c();
    },
    dispose() {
      r(), t.remove();
    }
  };
}
function xi(e) {
  var s, i;
  return (((i = (s = foundry.applications) == null ? void 0 : s.ux) == null ? void 0 : i.TextEditor) ?? globalThis.TextEditor).getDragEventData(e) ?? {};
}
async function ys(e) {
  var n, r, c, p, y, v, S, b;
  const t = xi(e), s = globalThis.fromUuid, i = t.uuid && s ? await s(t.uuid) : null;
  if (["Scene", "JournalEntry"].includes(i == null ? void 0 : i.documentName)) return i;
  const a = String(t.sceneId || t.journalId || t.id || "");
  return a ? t.type === "Scene" ? ((r = (n = game.scenes) == null ? void 0 : n.get) == null ? void 0 : r.call(n, a)) ?? null : ["JournalEntry", "Journal"].includes(t.type) ? ((p = (c = game.journal) == null ? void 0 : c.get) == null ? void 0 : p.call(c, a)) ?? null : ((v = (y = game.scenes) == null ? void 0 : y.get) == null ? void 0 : v.call(y, a)) ?? ((b = (S = game.journal) == null ? void 0 : S.get) == null ? void 0 : b.call(S, a)) ?? null : null;
}
async function Li(e) {
  const t = await ys(e);
  return (t == null ? void 0 : t.documentName) === "Scene" ? t : null;
}
function Ti(e) {
  var We;
  const {
    templateRoot: t,
    getRawMap: s,
    prepareMapForDisplay: i,
    upsertSystem: a,
    upsertObject: n,
    upsertRoute: r,
    upsertFaction: c,
    updateMapMetadata: p,
    deleteFaction: y,
    getTextureGuideMarkup: v,
    activateObjectEditorControls: S,
    revealSystemToPlayers: b,
    revealRouteToPlayers: C,
    hideSystemFromPlayers: P,
    setObjectVisibility: O,
    hideRouteFromPlayers: D,
    deleteSystem: w,
    deleteObject: Z,
    deleteRoute: z,
    setCurrentSystem: ie,
    setCurrentObject: F,
    requestTravelToSystem: A,
    requestTravelToObject: E,
    exportMap: k,
    getTravelRoute: R,
    broadcastTravelAnimation: ce,
    broadcastObjectTravelAnimation: fe,
    notifyInfo: se,
    notifyError: Y,
    saveSystemPosition: Me,
    saveObjectPosition: x,
    savePlanetLocation: oe,
    removePlanetLocation: Ae,
    unlinkPlanetScene: Nt,
    clearMapView: Gs
  } = e;
  return We = class extends It() {
    constructor(l = {}) {
      var m;
      const o = l.mapId, d = l.playerMode ?? !((m = game.user) != null && m.isGM);
      super({
        ...l,
        id: `galaxy-map-view-${d ? "player" : "gm"}-${o}`
      });
      $(this, "mapId");
      $(this, "playerMode");
      $(this, "selectedSystemId");
      $(this, "selectedRouteId");
      $(this, "activeSystemId");
      $(this, "selectedObjectId");
      $(this, "zoom");
      $(this, "panX");
      $(this, "panY");
      $(this, "_drag");
      $(this, "_contextTarget");
      $(this, "_boundContextClose");
      $(this, "externalFocus");
      $(this, "_externalFocusTimeout");
      $(this, "_pendingFocusZoom");
      $(this, "showTerritories", !0);
      $(this, "showRoutes", !0);
      $(this, "hardContrast", !1);
      $(this, "planetSystemId", null);
      $(this, "planetStatic", !1);
      $(this, "_planetStaticViewKey", null);
      $(this, "_planetRenderer", null);
      $(this, "_planetGeneration", 0);
      $(this, "_planetReturnFocus", !1);
      $(this, "_bountyIntelCallout", null);
      $(this, "_planetLocationCallout", null);
      $(this, "creationPanel", null);
      $(this, "factionRegistry", !1);
      $(this, "_selectionTimer", null);
      $(this, "_worldWidth", 0);
      $(this, "_worldHeight", 0);
      $(this, "_viewportResizeObserver", null);
      $(this, "_baseWindowHeight", null);
      this.mapId = o, this.playerMode = d, this.selectedSystemId = l.selectedSystemId ?? null, this.selectedRouteId = l.selectedRouteId ?? null, this.activeSystemId = l.activeSystemId ?? null, this.selectedObjectId = l.selectedObjectId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null, this.externalFocus = null, this._externalFocusTimeout = null, this._pendingFocusZoom = null;
    }
    get title() {
      const l = s(this.mapId), o = this.playerMode ? "Player View" : "GM View";
      return l ? `${l.title} - ${o}` : `Galaxy Map - ${o}`;
    }
    async _prepareContext(l) {
      var Be, ze, Pe, Ge, V, me, ge, ve;
      const o = await super._prepareContext(l), d = s(this.mapId), m = d ? i(d, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      }) : null;
      m != null && m.systems && (m.systems = m.systems.map((I) => ({
        ...I,
        displayType: "system",
        factionName: "System",
        factionColor: "#58d8ff",
        animatedCelestial: !1,
        hasCustomMarker: !!I.displayMarkerImage
      })), m.selectedSystem && (m.selectedSystem = m.systems.find((I) => I.id === m.selectedSystem.id) ?? null)), m != null && m.systems && this.externalFocus && (m.systems = m.systems.map((I) => I.id === this.externalFocus.systemId ? { ...I, isExternalFocus: !0, externalFocus: this.externalFocus } : I), ((Be = m.selectedSystem) == null ? void 0 : Be.id) === this.externalFocus.systemId && (m.selectedSystem = m.systems.find((I) => I.id === this.externalFocus.systemId))), !this.activeSystemId && this.selectedSystemId && !(m != null && m.selectedSystem) && (this.selectedSystemId = null);
      const u = (m == null ? void 0 : m.systems.find((I) => I.id === this.activeSystemId)) ?? null;
      u && (m.backgroundImage = u.backgroundImage || "");
      const f = new Map(((m == null ? void 0 : m.factions) ?? []).map((I) => [I.id, I])), h = u ? u.objects.filter((I) => !this.playerMode || je(u, I) === "players").map((I) => {
        var Dt;
        const K = this.playerMode && I.status === "undiscovered", ne = f.get(I.factionId), Se = K ? "" : I.markerImage;
        return {
          ...I,
          systemId: u.id,
          displayName: K ? "???" : I.name,
          displayDescription: K ? "Unresolved sensor contact. Details are not available." : I.description,
          displayType: K ? "unknown" : I.kind,
          displayStatus: K ? "undiscovered" : I.status,
          factionName: (ne == null ? void 0 : ne.name) ?? "Unaffiliated",
          factionColor: I.iconColor || (ne == null ? void 0 : ne.color) || "#58d8ff",
          displayMarkerImage: Se,
          hasCustomMarker: !!Se,
          obscured: K,
          gmOnly: je(u, I) === "gm",
          isSelected: I.id === this.selectedObjectId,
          isCurrent: ((Dt = m == null ? void 0 : m.currentLocation) == null ? void 0 : Dt.objectId) === I.id,
          animatedCelestial: !Se && dt.includes(I.iconStyle),
          hasJournal: !!(!K && I.journalId),
          hasScenes: !!(!K && I.sceneIds.length),
          showImage: !!(!K && I.image),
          canInspectSystem: !!xe({ ...I, obscured: K })
        };
      }) : [];
      u && this.selectedObjectId && !h.some((I) => I.id === this.selectedObjectId) && (this.selectedObjectId = null);
      const g = h.find((I) => I.id === this.selectedObjectId) ?? null, M = new Set(h.map((I) => I.id)), L = u ? (u.routes ?? []).filter((I) => (!this.playerMode || I.visibility === "players") && M.has(I.fromSystemId) && M.has(I.toSystemId)).map((I) => {
        const K = h.find((Se) => Se.id === I.fromSystemId), ne = h.find((Se) => Se.id === I.toSystemId);
        return {
          ...I,
          from: K,
          to: ne,
          fromName: (K == null ? void 0 : K.displayName) ?? I.fromSystemId,
          toName: (ne == null ? void 0 : ne.displayName) ?? I.toSystemId,
          isSelected: I.id === this.selectedRouteId,
          isActive: I.id === this.selectedRouteId,
          gmOnly: I.visibility === "gm"
        };
      }) : [], j = L.find((I) => I.id === this.selectedRouteId) ?? null, _ = h.find((I) => I.isCurrent) ?? null, q = g && _ && g.id !== _.id ? L.find((I) => I.fromSystemId === _.id && I.toSystemId === g.id || I.toSystemId === _.id && I.fromSystemId === g.id) : null;
      g && (g.canTravel = !!q, g.isDestination = !!(q && !g.isCurrent), g.travelRouteId = (q == null ? void 0 : q.id) ?? ""), L.forEach((I) => {
        I.isActive = I.isSelected || I.id === (q == null ? void 0 : q.id);
      }), u && (m.systems = h, m.routes = L, m.selectedSystem = j ? null : g, m.selectedRoute = j, m.currentSystem = _);
      const N = h.find((I) => I.id === this.planetSystemId) ?? (u ? null : m == null ? void 0 : m.systems.find((I) => I.id === this.planetSystemId)), Q = !this.playerMode || (d == null ? void 0 : d.visibility) === "players" ? xe(N) : null;
      Q || (this.planetSystemId = null);
      const ue = N && Q ? `${N.id}:${Q.preset}` : null;
      ue !== this._planetStaticViewKey && (this._planetStaticViewKey = ue, this.planetStatic = !!(ue && Ws(Q == null ? void 0 : Q.preset)));
      const De = N && Q ? this._preparePlanetLocations(N, Q.shape) : [], ye = N ?? g, Xe = !!((ze = game.user) != null && ze.isGM && !this.playerMode && u && ye), Je = ((ye == null ? void 0 : ye.sceneIds) ?? []).map((I) => {
        var K, ne;
        return (ne = (K = game.scenes) == null ? void 0 : K.get) == null ? void 0 : ne.call(K, I);
      }).filter((I) => {
        var K, ne;
        return I && (((K = game.user) == null ? void 0 : K.isGM) || ((ne = I.testUserPermission) == null ? void 0 : ne.call(I, game.user, "OBSERVER")));
      }).map((I) => ({ id: I.id, uuid: I.uuid, name: I.name || "Linked Scene" })), be = ye != null && ye.journalId ? (Ge = (Pe = game.journal) == null ? void 0 : Pe.get) == null ? void 0 : Ge.call(Pe, ye.journalId) : null, Ze = be && ((V = game.user) != null && V.isGM || (me = be.testUserPermission) != null && me.call(be, game.user, "OBSERVER")) ? { id: be.id, uuid: be.uuid, name: be.name || "Linked Journal" } : null, _e = this.creationPanel ? {
        ...this.creationPanel,
        ...this.creationPanel.data,
        kind: this.creationPanel.kind,
        entityKind: (ge = this.creationPanel.data) == null ? void 0 : ge.kind,
        isSystem: this.creationPanel.kind === "system",
        isEntity: this.creationPanel.kind === "entity",
        isRoute: this.creationPanel.kind === "route",
        isFaction: this.creationPanel.kind === "faction",
        isMap: this.creationPanel.kind === "map",
        mapTitle: (ve = this.creationPanel.data) == null ? void 0 : ve.title,
        title: this.creationPanel.kind === "map" ? "Edit Galaxy" : `${this.creationPanel.editId ? "Edit" : "Create"} ${{ system: "System", entity: "Entity", route: "Route", faction: "Faction" }[this.creationPanel.kind]}`,
        submitLabel: this.creationPanel.editId ? "Save changes" : "Create",
        systemOptions: (u ? h : (m == null ? void 0 : m.systems) ?? []).map((I) => ({ id: I.id, name: I.displayName || I.name })),
        factionOptions: ((m == null ? void 0 : m.factions) ?? []).map((I) => ({ id: I.id, name: I.name }))
      } : null;
      return {
        ...o,
        map: m,
        systemView: !!(u && !Q),
        activeSystem: u,
        selectedObject: g,
        planetView: !!Q,
        planetSystem: N,
        planetAppearance: Q,
        planetLocations: De,
        hasPlanetLocations: De.length > 0,
        canPlacePlanetLocations: Xe,
        linkedPlanetScenes: Je,
        linkedPlanetJournal: Ze,
        creationPanel: _e,
        factionRegistry: this.factionRegistry,
        appearanceGuideMarkup: _e != null && _e.isEntity ? v(_e.planetShape || "sphere") : "",
        showInspector: !!(_e || this.factionRegistry || Q || m != null && m.selectedSystem || m != null && m.selectedRoute),
        territories: m ? hi(m.systems, m.factions) : [],
        showTerritories: this.showTerritories,
        showRoutes: this.showRoutes,
        hardContrast: this.hardContrast,
        mapId: this.mapId,
        playerMode: this.playerMode,
        zoomPercent: Math.round(this.zoom * 100),
        panX: this.panX,
        panY: this.panY,
        zoom: this.zoom,
        missingMap: !d
      };
    }
    _onRender(l, o) {
      var m, u;
      (m = this._bountyIntelCallout) == null || m.dispose(), this._bountyIntelCallout = null, this._disposePlanetRenderer(), super._onRender(l, o);
      const d = this.element;
      if (d) {
        if (this._attachPartListeners("main", d, o), this._observeViewport(d), this._mountBountyIntelCallout(d), this.externalFocus && this._pendingFocusZoom !== null) {
          const f = T(s(this.mapId)).systems.find((h) => h.id === this.externalFocus.systemId);
          f && this._centerOnSystem(f, d, this._pendingFocusZoom), this._pendingFocusZoom = null;
        }
        l.planetView ? this._mountPlanetRenderer(d, l.planetAppearance) : this._planetReturnFocus && ((u = d.querySelector("[data-action='inspect-system']")) == null || u.focus(), this._planetReturnFocus = !1);
      }
    }
    _attachPartListeners(l, o, d) {
      var h, g, M, L, j, _, q, N, Q, ue, De, ye, Xe, Je, be, Ze, _e, Be, ze, Pe, Ge;
      const m = (h = o.matches) != null && h.call(o, ".gmf-map-stage") ? o : (g = o.querySelector) == null ? void 0 : g.call(o, ".gmf-map-stage, .gmf-planet-stage");
      if ((m == null ? void 0 : m.dataset.gmfMapBound) === "true") return;
      m && (m.dataset.gmfMapBound = "true");
      const u = (M = m == null ? void 0 : m.matches) != null && M.call(m, ".gmf-map-stage") ? m : null;
      super._attachPartListeners(l, o, d), it(this, o), this._attachPlanetListeners(o), this._attachCreationPanel(o);
      const f = o.querySelector(".gmf-object-appearance-panel");
      f && (S(f), this._attachAppearancePreview(o)), (L = o.querySelector("[data-action='toggle-territories']")) == null || L.addEventListener("click", () => {
        this.showTerritories = !this.showTerritories, this.render({ force: !0 });
      }), (j = o.querySelector("[data-action='toggle-routes']")) == null || j.addEventListener("click", () => {
        this.showRoutes = !this.showRoutes, this.render({ force: !0 });
      }), (_ = o.querySelector("[data-action='edit-current-layer']")) == null || _.addEventListener("click", () => {
        var V;
        !((V = game.user) != null && V.isGM) || this.playerMode || (this.activeSystemId ? this._openEditPanel("system", this.activeSystemId) : this._openCreationPanel("map", T(s(this.mapId)), this.mapId));
      }), (q = o.querySelector("[data-action='toggle-hard-contrast']")) == null || q.addEventListener("click", (V) => {
        var ge;
        this.hardContrast = !this.hardContrast;
        const me = (ge = o.matches) != null && ge.call(o, ".gmf-galaxy") ? o : o.querySelector(".gmf-galaxy");
        me == null || me.classList.toggle("is-hard-contrast", this.hardContrast), V.currentTarget.setAttribute("aria-pressed", String(this.hardContrast));
      }), this._applyViewportTransform(o), o.querySelectorAll("[data-system-id]").forEach((V) => {
        var me, ge;
        V.addEventListener("click", (ve) => {
          if (V.dataset.dragged === "true") {
            V.dataset.dragged = "false";
            return;
          }
          ve.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = globalThis.setTimeout(() => {
            this.activeSystemId ? this.selectedObjectId = V.dataset.systemId : this.selectedSystemId = V.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
          }, 180);
        }), V.addEventListener("dblclick", (ve) => {
          var K;
          ve.preventDefault(), ve.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
          const I = V.dataset.systemId;
          if (this.selectedRouteId = null, this.creationPanel = null, this.activeSystemId) {
            this.selectedObjectId = I;
            const ne = (K = T(s(this.mapId)).systems.find((Se) => Se.id === this.activeSystemId)) == null ? void 0 : K.objects.find((Se) => Se.id === I);
            xe(ne) && (this.planetSystemId = I);
          } else
            this.selectedSystemId = I, this.activeSystemId = I, this.selectedObjectId = null;
          this.render({ force: !0 });
        }), !this.playerMode && ((me = game.user) != null && me.isGM) && ((ge = V.querySelector("[data-resize-marker]")) == null || ge.addEventListener("pointerdown", (ve) => this._startMarkerResize(ve, V)), V.addEventListener("pointerdown", (ve) => this._startSystemDrag(ve, o, V)));
      }), this._mountBountyIntelCallout(o), o.querySelectorAll("[data-route-id]").forEach((V) => {
        V.addEventListener("click", (me) => {
          var ge;
          if (me.stopPropagation(), this.selectedRouteId = V.dataset.routeId, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, !this.playerMode && ((ge = game.user) != null && ge.isGM)) {
            this._openEditPanel("route", V.dataset.routeId);
            return;
          }
          this.render({ force: !0 });
        });
      }), u == null || u.addEventListener("wheel", (V) => this._onWheelZoom(V, o), { passive: !1 }), u == null || u.addEventListener("pointerdown", (V) => this._startPan(V, o)), u == null || u.addEventListener("contextmenu", (V) => this._openContextMenu(V, o), { capture: !0 }), o.querySelectorAll("[data-context-action]").forEach((V) => {
        V.addEventListener("click", (me) => this._handleContextAction(me, o));
      }), (N = o.querySelector("[data-action='open-journal']")) == null || N.addEventListener("click", () => this._openLinkedJournal()), (Q = o.querySelector("[data-action='edit-system']")) == null || Q.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._openEditPanel("entity", this.selectedObjectId) : this.selectedSystemId && this._openEditPanel("system", this.selectedSystemId);
      }), (ue = o.querySelector("[data-action='open-system']")) == null || ue.addEventListener("click", () => {
        this.selectedSystemId && (this.activeSystemId = this.selectedSystemId, this.selectedObjectId = null, this.selectedRouteId = null, this.render({ force: !0 }));
      }), (De = o.querySelector("[data-action='navigate-up']")) == null || De.addEventListener("click", () => {
        if (this.creationPanel = null, this.planetSystemId)
          this._disposePlanetRenderer(), this.planetSystemId = null, this._planetReturnFocus = !0;
        else if (this.activeSystemId)
          this.activeSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null;
        else return;
        this.render({ force: !0 });
      }), (ye = o.querySelector("[data-action='reveal-system']")) == null || ye.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? O(this.mapId, this.activeSystemId, this.selectedObjectId, "players") : this.selectedSystemId && b(this.mapId, this.selectedSystemId);
      }), (Xe = o.querySelector("[data-action='hide-system']")) == null || Xe.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? O(this.mapId, this.activeSystemId, this.selectedObjectId, "gm") : this.selectedSystemId && P(this.mapId, this.selectedSystemId, !0);
      }), (Je = o.querySelector("[data-action='delete-system']")) == null || Je.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._confirmDeleteObject(this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), (be = o.querySelector("[data-action='set-current-system']")) == null || be.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? F(this.mapId, this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && ie(this.mapId, this.selectedSystemId);
      }), (Ze = o.querySelector("[data-action='travel-to-system']")) == null || Ze.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? A(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, o));
      }), (_e = o.querySelector("[data-action='travel-to-object']")) == null || _e.addEventListener("click", () => {
        !this.activeSystemId || !this.selectedObjectId || (this.playerMode ? E(this.mapId, this.activeSystemId, this.selectedObjectId) : this._travelToObject(this.activeSystemId, this.selectedObjectId, o));
      }), (Be = o.querySelector("[data-action='edit-route']")) == null || Be.addEventListener("click", () => {
        this.selectedRouteId && this._openEditPanel("route", this.selectedRouteId);
      }), (ze = o.querySelector("[data-action='reveal-route']")) == null || ze.addEventListener("click", () => {
        this.selectedRouteId && C(this.mapId, this.selectedRouteId, this.activeSystemId ?? "");
      }), (Pe = o.querySelector("[data-action='hide-route']")) == null || Pe.addEventListener("click", () => {
        this.selectedRouteId && D(this.mapId, this.selectedRouteId, !0, this.activeSystemId ?? "");
      }), (Ge = o.querySelector("[data-action='delete-route']")) == null || Ge.addEventListener("click", () => {
        this.selectedRouteId && this._confirmDeleteRoute(this.selectedRouteId);
      });
    }
    _applyViewportTransform(l) {
      var m;
      const o = l.querySelector(".gmf-map-viewport");
      if (!o) return;
      const d = l.querySelector(".gmf-map-stage");
      if (d) {
        const u = d.getBoundingClientRect(), f = o.querySelector(".gmf-map-background");
        f && (this.zoom = Math.max(1, this.zoom));
        const h = f != null && f.naturalWidth && (f != null && f.naturalHeight) ? f.naturalWidth / f.naturalHeight : null;
        h ? this._adjustWindowToBackground(d, h) : f || this._adjustWindowToBackground(d, null);
        const g = u.width / Math.max(1, u.height);
        h && h > g ? (this._worldWidth = u.width, this._worldHeight = u.width / h) : h ? (this._worldHeight = u.height, this._worldWidth = u.height * h) : (this._worldWidth = u.width, this._worldHeight = u.height), o.style.width = `${this._worldWidth}px`, o.style.height = `${this._worldHeight}px`;
        const M = this._worldWidth * this.zoom, L = this._worldHeight * this.zoom;
        this.panX = M <= u.width ? (u.width - M) / 2 : ee(this.panX, u.width - M, 0), this.panY = L <= u.height ? (u.height - L) / 2 : ee(this.panY, u.height - L, 0), f && f.dataset.gmfWorldImageBound !== "true" && (f.dataset.gmfWorldImageBound = "true", f.addEventListener("load", () => this._applyViewportTransform(l), { once: !0 }));
      }
      o.style.setProperty("--gmf-pan-x", `${this.panX}px`), o.style.setProperty("--gmf-pan-y", `${this.panY}px`), o.style.setProperty("--gmf-zoom", String(this.zoom)), (m = l.querySelector("[data-zoom-label]")) == null || m.replaceChildren(`${Math.round(this.zoom * 100)}%`);
    }
    _adjustWindowToBackground(l, o) {
      const d = l.closest(".window-app, .application, .app");
      if (!d || !this.setPosition) return;
      const m = d.getBoundingClientRect();
      if (!o) {
        this._baseWindowHeight && Math.abs(m.height - this._baseWindowHeight) > 2 && this.setPosition({ height: Math.min(this._baseWindowHeight, window.innerHeight - 24) }), this._baseWindowHeight = null;
        return;
      }
      this._baseWindowHeight ?? (this._baseWindowHeight = m.height);
      const u = l.getBoundingClientRect(), f = ee(u.width / o, 240, window.innerHeight - 96);
      if (Math.abs(u.height - f) <= 2) return;
      const h = ee(m.height + f - u.height, 320, window.innerHeight - 24);
      this.setPosition({ height: Math.round(h) });
    }
    _observeViewport(l) {
      var d;
      (d = this._viewportResizeObserver) == null || d.disconnect();
      const o = l.querySelector(".gmf-map-stage");
      o && (this._viewportResizeObserver = new ResizeObserver(() => this._applyViewportTransform(l)), this._viewportResizeObserver.observe(o));
    }
    _setZoom(l, o) {
      const d = o.querySelector(".gmf-map-background") ? 1 : rt;
      this.zoom = ee(l, d, ot), this._applyViewportTransform(o);
    }
    _mountBountyIntelCallout(l) {
      var m;
      if (this._bountyIntelCallout || l.querySelector(".gmf-intel-callout")) return;
      const o = (m = l.matches) != null && m.call(l, ".gmf-map-stage") ? l : l.querySelector(".gmf-map-stage"), d = l;
      !o || !d.querySelector("[data-intel-layer]") || (this._bountyIntelCallout = Mi({
        root: d,
        stage: o,
        resolveItems: (u) => {
          var g;
          const f = T(s(this.mapId)), h = this.activeSystemId ? (g = f.systems.find((M) => M.id === this.activeSystemId)) == null ? void 0 : g.objects.find((M) => M.id === u) : f.systems.find((M) => M.id === u);
          return h ? yi(h) : [];
        },
        onOpen: (u) => gi(u)
      }));
    }
    _attachPlanetListeners(l) {
      var o, d, m, u, f, h;
      (o = l.querySelector("[data-action='inspect-system']")) == null || o.addEventListener("click", () => {
        var M, L;
        const g = s(this.mapId);
        if (!(this.playerMode && (g == null ? void 0 : g.visibility) !== "players")) {
          if (this.activeSystemId) {
            const _ = (M = T(g).systems.find((q) => q.id === this.activeSystemId)) == null ? void 0 : M.objects.find((q) => q.id === this.selectedObjectId);
            if (!xe(_)) return;
            this.planetSystemId = this.selectedObjectId;
          } else {
            this.activeSystemId = this.selectedSystemId;
            const j = T(g);
            this.selectedObjectId = ((L = j.systems.find((_) => _.id === this.activeSystemId)) == null ? void 0 : L.primaryObjectId) ?? null, this.planetSystemId = this.selectedObjectId;
          }
          this.render({ force: !0 });
        }
      }), (d = l.querySelector("[data-action='planet-pause']")) == null || d.addEventListener("click", () => {
        var g;
        return (g = this._planetRenderer) == null ? void 0 : g.setPaused(!this._planetRenderer.paused);
      }), (m = l.querySelector("[data-action='planet-zoom-in']")) == null || m.addEventListener("click", () => {
        var g;
        return (g = this._planetRenderer) == null ? void 0 : g.zoom(-0.25);
      }), (u = l.querySelector("[data-action='planet-zoom-out']")) == null || u.addEventListener("click", () => {
        var g;
        return (g = this._planetRenderer) == null ? void 0 : g.zoom(0.25);
      }), (f = l.querySelector("[data-action='planet-reset']")) == null || f.addEventListener("click", () => {
        var g;
        return (g = this._planetRenderer) == null ? void 0 : g.reset();
      }), (h = l.querySelector("[data-action='planet-static']")) == null || h.addEventListener("click", () => {
        this.planetStatic = !this.planetStatic, this.render({ force: !0 });
      }), this._attachPlanetLocationList(l), this._attachLinkedContentDrop(l);
    }
    _getPlanetObject() {
      var o;
      return ((o = T(s(this.mapId)).systems.find((d) => d.id === this.activeSystemId)) == null ? void 0 : o.objects.find((d) => d.id === this.planetSystemId)) ?? null;
    }
    _preparePlanetLocations(l, o) {
      return ((l == null ? void 0 : l.planetLocations) ?? []).filter((d) => d.shape === o).map((d) => {
        var f, h, g, M, L, j;
        const m = (h = (f = game.scenes) == null ? void 0 : f.get) == null ? void 0 : h.call(f, d.sceneId), u = !!(m && ((g = game.user) != null && g.isGM || (M = m.testUserPermission) != null && M.call(m, game.user, "OBSERVER")));
        return {
          ...d,
          name: m ? u || (L = game.user) != null && L.isGM ? m.name || "Linked Scene" : "Restricted location" : "Missing linked scene",
          accessible: u,
          missing: !m,
          canRemove: !!((j = game.user) != null && j.isGM && !this.playerMode)
        };
      });
    }
    _getPlanetLocationItem(l) {
      var d;
      const o = this._getPlanetObject();
      return this._preparePlanetLocations(o, (d = xe(o)) == null ? void 0 : d.shape).find((m) => m.id === l) ?? null;
    }
    _attachPlanetLocationList(l) {
      var m;
      const o = this.element ?? l;
      l.querySelectorAll("[data-planet-scene-drag]").forEach((u) => u.addEventListener("dragstart", (f) => {
        f.dataTransfer && (f.dataTransfer.setData("text/plain", JSON.stringify({ type: "Scene", id: u.dataset.planetSceneDrag, uuid: u.dataset.planetSceneUuid })), f.dataTransfer.effectAllowed = "link");
      })), l.querySelectorAll("[data-unlink-planet-scene]").forEach((u) => u.addEventListener("click", async (f) => {
        var L, j, _;
        f.preventDefault(), f.stopPropagation();
        const h = u.dataset.unlinkPlanetScene ?? "", g = this.planetSystemId || this.selectedObjectId;
        if (!h || !this.activeSystemId || !g) return;
        const M = ((_ = (j = (L = game.scenes) == null ? void 0 : L.get) == null ? void 0 : j.call(L, h)) == null ? void 0 : _.name) || "Scene";
        await Nt(this.mapId, this.activeSystemId, g, h) && se(`${M} unlinked from this entity.`);
      })), l.querySelectorAll("[data-open-linked-scene]").forEach((u) => u.addEventListener("click", () => {
        var h, g, M;
        const f = (g = (h = game.scenes) == null ? void 0 : h.get) == null ? void 0 : g.call(h, u.dataset.openLinkedScene ?? "");
        f != null && f.view ? f.view() : (M = f == null ? void 0 : f.sheet) == null || M.render(!0);
      })), l.querySelectorAll("[data-open-planet-location]").forEach((u) => u.addEventListener("click", () => this._openPlanetLocation(u.dataset.openPlanetLocation ?? ""))), l.querySelectorAll("[data-remove-planet-location]").forEach((u) => u.addEventListener("click", () => this._removePlanetLocation(u.dataset.removePlanetLocation ?? "", l))), l.querySelectorAll("[data-planet-location-drag]").forEach((u) => {
        u.addEventListener("dragstart", (f) => {
          var g;
          if (!f.dataTransfer) return;
          const h = u.dataset.planetLocationDrag ?? "";
          f.dataTransfer.setData("application/x-gmf-surface-location", h), f.dataTransfer.setData("text/plain", JSON.stringify({ type: "GalaxySurfaceLocation", locationId: h })), f.dataTransfer.effectAllowed = "move", (g = o.querySelector("[data-planet-location-trash]")) == null || g.classList.add("is-armed");
        }), u.addEventListener("dragend", () => {
          var f;
          return (f = o.querySelector("[data-planet-location-trash]")) == null ? void 0 : f.classList.remove("is-armed", "is-dragover");
        });
      });
      const d = o.querySelector("[data-planet-location-trash]");
      (d == null ? void 0 : d.dataset.gmfTrashBound) !== "true" && (d && (d.dataset.gmfTrashBound = "true"), d == null || d.addEventListener("dragover", (u) => {
        var f;
        (f = u.dataTransfer) != null && f.types.includes("application/x-gmf-surface-location") && (u.preventDefault(), u.dataTransfer.dropEffect = "move", d.classList.add("is-dragover"));
      }), d == null || d.addEventListener("dragleave", () => d.classList.remove("is-dragover")), d == null || d.addEventListener("drop", (u) => {
        var h;
        u.preventDefault();
        const f = ((h = u.dataTransfer) == null ? void 0 : h.getData("application/x-gmf-surface-location")) ?? "";
        d.classList.remove("is-armed", "is-dragover"), f && this._removePlanetLocation(f, l);
      })), (m = l.querySelector("[data-clear-planet-locations]")) == null || m.addEventListener("click", () => this._clearPlanetLocations(l));
    }
    _attachLinkedContentDrop(l) {
      var d, m;
      const o = l.querySelector("[data-linked-content-drop]");
      !o || !((d = game.user) != null && d.isGM) || this.playerMode || (o.addEventListener("dragover", (u) => {
        u.preventDefault(), u.dataTransfer && (u.dataTransfer.dropEffect = "link"), o.classList.add("is-document-dragover");
      }), o.addEventListener("dragleave", (u) => {
        o.contains(u.relatedTarget) || o.classList.remove("is-document-dragover");
      }), o.addEventListener("drop", async (u) => {
        var M;
        u.preventDefault(), u.stopPropagation(), o.classList.remove("is-document-dragover");
        const f = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !f) return;
        const h = await ys(u), g = (M = T(s(this.mapId)).systems.find((L) => L.id === this.activeSystemId)) == null ? void 0 : M.objects.find((L) => L.id === f);
        if (!h || !g) {
          Y("Drop a Foundry Scene or Journal here.");
          return;
        }
        if (h.documentName === "Scene") {
          const L = [.../* @__PURE__ */ new Set([...g.sceneIds ?? [], h.id])];
          await n(this.mapId, this.activeSystemId, { ...g, sceneIds: L }), se(`${h.name || "Scene"} linked to ${g.name}.`);
        } else if (h.documentName === "JournalEntry")
          await n(this.mapId, this.activeSystemId, { ...g, journalId: h.id }), se(`${h.name || "Journal"} linked to ${g.name}.`);
        else {
          Y("Drop a Foundry Scene or Journal here.");
          return;
        }
      }), (m = l.querySelector("[data-unlink-linked-journal]")) == null || m.addEventListener("click", async (u) => {
        var g;
        u.preventDefault(), u.stopPropagation();
        const f = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !f) return;
        const h = (g = T(s(this.mapId)).systems.find((M) => M.id === this.activeSystemId)) == null ? void 0 : g.objects.find((M) => M.id === f);
        h && await n(this.mapId, this.activeSystemId, { ...h, journalId: "" });
      }));
    }
    _openPlanetLocation(l) {
      var m, u, f;
      const o = this._getPlanetLocationItem(l), d = o ? (u = (m = game.scenes) == null ? void 0 : m.get) == null ? void 0 : u.call(m, o.sceneId) : null;
      if (!o || !d || !o.accessible) {
        Y(o != null && o.missing ? "That location is unavailable." : "You do not have permission to view that scene.");
        return;
      }
      d.view ? d.view() : (f = d.sheet) == null || f.render(!0);
    }
    async _removePlanetLocation(l, o) {
      var m;
      if (!((m = game.user) != null && m.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const d = this._getPlanetLocationItem(l);
      !d || !await Ae(this.mapId, this.activeSystemId, this.planetSystemId, l) || (this._syncPlanetLocations(o), se(`${d.name} removed from the surface.`));
    }
    async _clearPlanetLocations(l) {
      var m, u;
      if (!((m = game.user) != null && m.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const o = this._getPlanetObject(), d = this._preparePlanetLocations(o, (u = xe(o)) == null ? void 0 : u.shape);
      for (const f of d) await Ae(this.mapId, this.activeSystemId, this.planetSystemId, f.id);
      this._syncPlanetLocations(l), d.length && se(`Cleared ${d.length} surface location${d.length === 1 ? "" : "s"}.`);
    }
    async _placePlanetLocation(l, o, d) {
      var h;
      if (!((h = game.user) != null && h.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const m = await Li(l);
      if (!m) {
        Y("Drop a Foundry Scene onto the 3D surface.");
        return;
      }
      const u = this._getPlanetObject();
      if (!(u != null && u.sceneIds.includes(m.id))) {
        Y(`Link ${m.name || "this scene"} to the object before placing it on the surface.`);
        return;
      }
      await oe(this.mapId, this.activeSystemId, this.planetSystemId, { ...o, sceneId: m.id }) && (this._syncPlanetLocations(d), se(`${m.name || "Scene"} placed on the ${o.shape}. Drag it again to move it.`));
    }
    _syncPlanetLocations(l) {
      var f, h, g;
      const o = this.element ?? l, d = this._getPlanetObject(), m = this._preparePlanetLocations(d, (f = xe(d)) == null ? void 0 : f.shape);
      (h = this._planetRenderer) == null || h.setLocations((d == null ? void 0 : d.planetLocations) ?? []);
      const u = o.querySelector("[data-planet-location-list]");
      u && (u.innerHTML = m.length ? m.map((M) => `
        <div class="gmf-planet-location-row ${M.accessible ? "" : "is-restricted"}" ${M.canRemove ? `draggable="true" data-planet-location-drag="${le(M.id)}" title="Drag to the trash bin to remove"` : ""}>
          <button type="button" data-open-planet-location="${le(M.id)}" ${M.accessible ? "" : "disabled"}><i class="fa-solid ${M.accessible ? "fa-location-dot" : "fa-lock"}"></i><span>${le(M.name)}</span></button>
          ${M.canRemove ? `<button type="button" data-remove-planet-location="${le(M.id)}" title="Remove location" aria-label="Remove ${le(M.name)}"><i class="fa-solid fa-trash"></i></button>` : ""}
        </div>`).join("") : '<p class="gmf-planet-locations__empty">No surface locations placed.</p>', this._attachPlanetLocationList(u), (g = o.querySelector("[data-planet-location-removal]")) == null || g.toggleAttribute("hidden", m.length === 0));
    }
    refreshPlanetLocations(l, o) {
      this.activeSystemId !== l || this.planetSystemId !== o || this.element && this._syncPlanetLocations(this.element);
    }
    async focusSystem(l, o = {}) {
      var j;
      const d = T(s(this.mapId));
      if (!d.systems.find((_) => _.id === l)) return !1;
      const u = i(d, {
        playerMode: this.playerMode,
        selectedSystemId: l,
        selectedRouteId: null
      });
      if (!((j = u == null ? void 0 : u.systems) != null && j.some((_) => _.id === l))) return !1;
      const f = String(o.focusId || l).slice(0, 80), h = ["distress", "warning", "objective", "custom"].includes(o.kind) ? o.kind : "custom", g = /^#[0-9a-f]{6}$/i.test(o.color ?? "") ? o.color : h === "distress" ? "#ff5c7a" : "#58d8ff", M = ee(Number(o.duration) || 0, 0, 6e5), L = ee(Number(o.zoom) || 1.45, rt, ot);
      return this.externalFocus = {
        id: f,
        systemId: l,
        kind: h,
        color: g,
        label: String(o.label || (h === "distress" ? "Distress signal" : "Signal located")).slice(0, 120)
      }, this.selectedSystemId = l, this.planetSystemId = null, this.selectedRouteId = null, this._pendingFocusZoom = L, this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, await this.render({ force: !0 }), this.bringToFront(), M > 0 && (this._externalFocusTimeout = globalThis.setTimeout(() => {
        var _;
        ((_ = this.externalFocus) == null ? void 0 : _.id) === f && this.clearSystemFocus(f);
      }, M)), !0;
    }
    async focusLocation(l, o = "", d = {}) {
      const u = T(s(this.mapId)).systems.find((h) => h.id === l), f = (u == null ? void 0 : u.objects.find((h) => h.id === o)) ?? (u == null ? void 0 : u.objects.find((h) => h.id === u.primaryObjectId));
      return !u || !f || this.playerMode && (u.visibility !== "players" || je(u, f) !== "players") ? !1 : (this.activeSystemId = u.id, this.selectedSystemId = u.id, this.selectedObjectId = f.id, this.selectedRouteId = null, this.planetSystemId = d.detail === !0 && xe(f) ? f.id : null, await this.render({ force: !0 }), this.bringToFront(), !0);
    }
    clearSystemFocus(l = "") {
      return !this.externalFocus || l && this.externalFocus.id !== l ? !1 : (this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, this._pendingFocusZoom = null, this.externalFocus = null, this.rendered && this.render({ force: !0 }), !0);
    }
    _centerOnSystem(l, o, d) {
      const m = o.querySelector(".gmf-map-stage");
      if (!m) return;
      const u = m.getBoundingClientRect();
      this.zoom = d, this.panX = u.width / 2 - Number(l.x) / 100 * this._worldWidth * d, this.panY = u.height / 2 - Number(l.y) / 100 * this._worldHeight * d, this._applyViewportTransform(o);
    }
    _onWheelZoom(l, o) {
      l.preventDefault();
      const d = o.querySelector(".gmf-map-stage");
      if (!d) return;
      const m = d.getBoundingClientRect(), u = this.zoom, f = o.querySelector(".gmf-map-background") ? 1 : rt, h = ee(u * Math.exp(-l.deltaY * 15e-4), f, ot), g = l.clientX - m.left, M = l.clientY - m.top, L = (g - this.panX) / u, j = (M - this.panY) / u;
      this.zoom = h, this.panX = g - L * h, this.panY = M - j * h, this._applyViewportTransform(o);
    }
    _startPan(l, o) {
      if (l.button !== 0 || l.target.closest("[data-system-id], [data-route-id], button, input")) return;
      l.preventDefault();
      const d = l.clientX, m = l.clientY, u = this.panX, f = this.panY;
      let h = !1;
      const g = (L) => {
        h = h || Math.abs(L.clientX - d) > 3 || Math.abs(L.clientY - m) > 3, this.panX = u + L.clientX - d, this.panY = f + L.clientY - m, this._applyViewportTransform(o);
      }, M = () => {
        window.removeEventListener("pointermove", g), window.removeEventListener("pointerup", M), h || (this.selectedRouteId = null, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, this.render({ force: !0 }));
      };
      window.addEventListener("pointermove", g), window.addEventListener("pointerup", M, { once: !0 });
    }
    _startSystemDrag(l, o, d) {
      var q;
      if (l.button !== 0) return;
      l.preventDefault(), l.stopPropagation(), (q = d.setPointerCapture) == null || q.call(d, l.pointerId);
      const m = l.clientX, u = l.clientY;
      let f = this._pointerToMapPercent(l, o), h = !1, g = null;
      const M = Array.from(o.querySelectorAll(`[data-route-from="${d.dataset.systemId}"]`)), L = Array.from(o.querySelectorAll(`[data-route-to="${d.dataset.systemId}"]`)), j = (N) => {
        const Q = Math.abs(N.clientX - m), ue = Math.abs(N.clientY - u);
        !h && Q <= 4 && ue <= 4 || (h = !0, d.classList.add("is-dragging"), f = this._pointerToMapPercent(N, o), d.dataset.dragged = "true", !g && (g = requestAnimationFrame(() => {
          g = null, d.style.left = `${f.x}%`, d.style.top = `${f.y}%`, this._updateConnectedRoutes(M, L, f.x, f.y);
        })));
      }, _ = async () => {
        g && cancelAnimationFrame(g), d.classList.remove("is-dragging"), window.removeEventListener("pointermove", j), window.removeEventListener("pointerup", _), h && (d.style.left = `${f.x}%`, d.style.top = `${f.y}%`, this._updateConnectedRoutes(M, L, f.x, f.y), this.activeSystemId ? await x(this.mapId, this.activeSystemId, d.dataset.systemId, f.x, f.y) : await Me(this.mapId, d.dataset.systemId, f.x, f.y));
      };
      window.addEventListener("pointermove", j), window.addEventListener("pointerup", _, { once: !0 });
    }
    _startMarkerResize(l, o) {
      var j;
      if (l.button !== 0) return;
      l.preventDefault(), l.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
      const d = ee(Number(o.dataset.iconSize) || 28, 18, 56), m = o.getBoundingClientRect(), u = m.left + m.width / 2, f = m.top + m.height / 2, h = Math.hypot(l.clientX - u, l.clientY - f);
      let g = d;
      o.dataset.dragged = "true", o.classList.add("is-resizing"), (j = o.setPointerCapture) == null || j.call(o, l.pointerId);
      const M = (_) => {
        const q = Math.hypot(_.clientX - u, _.clientY - f);
        g = ee(Math.round(d + (q - h) / Math.max(this.zoom, 0.01)), 18, 56), o.dataset.iconSize = String(g), o.style.setProperty("--gmf-system-size", `${g}px`);
      }, L = async () => {
        if (o.classList.remove("is-resizing"), window.removeEventListener("pointermove", M), window.removeEventListener("pointerup", L), window.removeEventListener("pointercancel", L), globalThis.setTimeout(() => {
          o.dataset.dragged = "false";
        }, 0), g !== d)
          if (this.activeSystemId) {
            const _ = T(s(this.mapId)).systems.find((N) => N.id === this.activeSystemId), q = _ == null ? void 0 : _.objects.find((N) => N.id === o.dataset.systemId);
            q && await n(this.mapId, this.activeSystemId, { ...q, iconSize: g });
          } else
            await a(this.mapId, { id: o.dataset.systemId, iconSize: g });
      };
      window.addEventListener("pointermove", M), window.addEventListener("pointerup", L, { once: !0 }), window.addEventListener("pointercancel", L, { once: !0 });
    }
    _pointerToMapPercent(l, o) {
      const m = o.querySelector(".gmf-map-stage").getBoundingClientRect();
      return {
        x: ee((l.clientX - m.left - this.panX) / this.zoom / this._worldWidth * 100, 0, 100),
        y: ee((l.clientY - m.top - this.panY) / this.zoom / this._worldHeight * 100, 0, 100)
      };
    }
    _updateConnectedRoutes(l, o, d, m) {
      l.forEach((u) => {
        u.setAttribute("x1", d), u.setAttribute("y1", m);
      }), o.forEach((u) => {
        u.setAttribute("x2", d), u.setAttribute("y2", m);
      });
    }
    _openContextMenu(l, o) {
      var Q;
      if (!((Q = game.user) != null && Q.isGM) || this.playerMode || l.target.closest(".gmf-context-menu")) return;
      l.preventDefault(), l.stopPropagation();
      const d = l.target.closest("[data-route-id]"), m = l.target.closest("[data-system-id]"), u = this._pointerToMapPercent(l, o);
      this._contextTarget = d ? { type: "route", id: d.dataset.routeId, position: u } : m ? { type: "system", id: m.dataset.systemId, position: u } : { type: "stage", id: null, position: u };
      const f = o.querySelector("[data-gmf-context-menu]");
      if (!f) return;
      f.querySelectorAll("[data-context-show]").forEach((ue) => {
        ue.hidden = ue.dataset.contextShow !== this._contextTarget.type;
      }), f.hidden = !1;
      const h = f.offsetWidth || 184, g = f.offsetHeight || 260, L = o.querySelector(".gmf-map-stage").getBoundingClientRect(), j = l.clientX - L.left, _ = l.clientY - L.top, q = Math.max(4, L.width - h - 4), N = Math.max(4, L.height - g - 4);
      f.style.left = `${ee(j, 4, q)}px`, f.style.top = `${ee(_, 4, N)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(o), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu(l = null) {
      const o = l ?? this.element ?? null, d = o == null ? void 0 : o.querySelector("[data-gmf-context-menu]");
      d && (d.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(l, o) {
      l.preventDefault(), l.stopPropagation();
      const d = l.currentTarget.dataset.contextAction, m = this._contextTarget;
      this._hideContextMenu(o), m && (d === "add-system" ? this._openCreationPanel("system", { x: m.position.x, y: m.position.y }) : d === "add-entity" ? this.activeSystemId && this._openCreationPanel("entity", { x: m.position.x, y: m.position.y }) : d === "manage-factions" ? (this.creationPanel = null, this.factionRegistry = !0, this.render({ force: !0 })) : d === "add-faction" ? this._openCreationPanel("faction") : d === "edit-map-details" ? this._openCreationPanel("map", T(s(this.mapId)), this.mapId) : d === "export-map" ? k(this.mapId) : d === "edit-system" ? this._openEditPanel("system", m.id) : d === "edit-entity" ? this.activeSystemId && this._openEditPanel("entity", m.id) : d === "add-route-from-marker" ? this._openCreationPanel("route", { fromSystemId: m.id }) : d === "reveal-system" ? await b(this.mapId, m.id) : d === "hide-system" ? await P(this.mapId, m.id, !0) : d === "delete-system" ? await this._confirmDeleteSystem(m.id) : d === "reveal-entity" ? this.activeSystemId && await O(this.mapId, this.activeSystemId, m.id, "players") : d === "hide-entity" ? this.activeSystemId && await O(this.mapId, this.activeSystemId, m.id, "gm") : d === "delete-entity" ? this.activeSystemId && await this._confirmDeleteObject(this.activeSystemId, m.id) : d === "edit-route" ? this._openEditPanel("route", m.id) : d === "reveal-route" ? await C(this.mapId, m.id, this.activeSystemId ?? "") : d === "hide-route" ? await D(this.mapId, m.id, !0, this.activeSystemId ?? "") : d === "delete-route" && await this._confirmDeleteRoute(m.id));
    }
    async _confirmDeleteSystem(l) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, Ce) && await w(this.mapId, l);
    }
    async _confirmDeleteObject(l, o) {
      await Dialog.confirm({ title: "Delete Entity", content: "<p>Delete this entity and its linked content?</p>" }) && (await Z(this.mapId, l, o), this.selectedObjectId = null);
    }
    _openCreationPanel(l, o = {}, d = null) {
      var g, M, L, j;
      if (!((g = game.user) != null && g.isGM) || this.playerMode) return;
      const m = T(s(this.mapId)), u = this.activeSystemId ? ((M = m.systems.find((_) => _.id === this.activeSystemId)) == null ? void 0 : M.objects) ?? [] : m.systems;
      if (l === "route" && u.length < 2) {
        Y(this.activeSystemId ? "Create at least two entities before adding a route." : "Create at least two systems before adding a route.");
        return;
      }
      const f = o.fromSystemId || ((L = u[0]) == null ? void 0 : L.id) || "", h = l === "map" ? { title: "Galaxy Map", subtitle: "", description: "", backgroundImage: "", visibility: "players", travelApprovalMode: "unanimous" } : l === "system" ? { name: "New System", status: "known", visibility: "gm", description: "", markerImage: "", backgroundImage: "" } : l === "entity" ? {
        name: "New Entity",
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
      } : l === "route" ? { type: "safe", visibility: "gm", travelTime: "", fuelCost: 0, notes: "" } : { name: "New Faction", color: "#58d8ff", visibility: "gm", description: "" };
      this.creationPanel = {
        kind: l,
        editId: d,
        data: {
          ...h,
          ...o,
          x: Number.isFinite(Number(o.x)) ? Number(o.x) : 50,
          y: Number.isFinite(Number(o.y)) ? Number(o.y) : 50,
          fromSystemId: f,
          toSystemId: o.toSystemId || ((j = u.find((_) => _.id !== f)) == null ? void 0 : j.id) || ""
        }
      }, this.factionRegistry = !1, this.selectedSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null, this.render({ force: !0 });
    }
    _openEditPanel(l, o) {
      var u, f;
      const d = T(s(this.mapId)), m = l === "system" ? d.systems.find((h) => h.id === o) : l === "entity" ? (u = d.systems.find((h) => h.id === this.activeSystemId)) == null ? void 0 : u.objects.find((h) => h.id === o) : l === "route" ? this.activeSystemId ? (f = d.systems.find((h) => h.id === this.activeSystemId)) == null ? void 0 : f.routes.find((h) => h.id === o) : d.routes.find((h) => h.id === o) : d.factions.find((h) => h.id === o);
      m && this._openCreationPanel(l, m, o);
    }
    openEditor(l, o = {}) {
      var d;
      return !((d = game.user) != null && d.isGM) || this.playerMode ? !1 : (this._disposePlanetRenderer(), this.planetSystemId = null, l === "entity" ? (this.activeSystemId = o.systemId || this.activeSystemId, this.selectedSystemId = this.activeSystemId) : l === "route" ? this.activeSystemId = o.systemId || null : ["map", "system", "faction"].includes(l) && (this.activeSystemId = null), l === "map" ? this._openCreationPanel("map", T(s(this.mapId)), this.mapId) : o.id ? this._openEditPanel(l, o.id) : this._openCreationPanel(l, o.defaults || {}), !0);
    }
    _attachCreationPanel(l) {
      var d, m, u;
      (d = l.querySelector("[data-action='cancel-panel-create']")) == null || d.addEventListener("click", () => {
        this.creationPanel = null, this.render({ force: !0 });
      }), (m = l.querySelector("[data-action='close-faction-registry']")) == null || m.addEventListener("click", () => {
        this.factionRegistry = !1, this.render({ force: !0 });
      }), (u = l.querySelector("[data-action='add-inline-faction']")) == null || u.addEventListener("click", () => this._openCreationPanel("faction")), l.querySelectorAll("[data-edit-inline-faction]").forEach((f) => {
        f.addEventListener("click", () => this._openEditPanel("faction", f.dataset.editInlineFaction || ""));
      }), l.querySelectorAll("[data-delete-inline-faction]").forEach((f) => {
        f.addEventListener("click", async () => {
          await Dialog.confirm({ title: "Delete Faction", content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>" }, Ce) && (await y(this.mapId, f.dataset.deleteInlineFaction), this.factionRegistry = !0, this.render({ force: !0 }));
        });
      });
      const o = l.querySelector("[data-panel-create-form]");
      o && (ps(o), o.addEventListener("submit", async (f) => {
        f.preventDefault();
        const h = o.dataset.createKind || "", g = Object.fromEntries(new FormData(o).entries());
        l.querySelectorAll('[form="gmf-panel-editor-form"][name]').forEach((N) => {
          N instanceof HTMLInputElement && ["checkbox", "radio"].includes(N.type) && !N.checked || (g[N.name] = N.value);
        }), h === "entity" && (g.markerImage = g.useCustomMarker === "true" ? g.markerImage ?? "" : "", delete g.useCustomMarker);
        const M = Number(g.x), L = Number(g.y), j = this.creationPanel, _ = (j == null ? void 0 : j.data) ?? {};
        j != null && j.editId && (g.id = j.editId), this.creationPanel = null;
        let q = null;
        if (h === "map") q = await p(this.mapId, { ..._, ...g });
        else if (h === "system") q = await a(this.mapId, { ..._, ...g, x: M, y: L });
        else if (h === "entity" && this.activeSystemId) q = await n(this.mapId, this.activeSystemId, { ..._, ...g, x: M, y: L });
        else if (h === "route") {
          if (!g.fromSystemId || !g.toSystemId || g.fromSystemId === g.toSystemId) {
            Y(`Choose two different ${this.activeSystemId ? "entities" : "systems"} for the route.`), this._openCreationPanel("route", { ..._, ...g }, (j == null ? void 0 : j.editId) ?? null);
            return;
          }
          q = await r(this.mapId, { ..._, ...g }, this.activeSystemId ?? "");
        } else h === "faction" && (q = await c(this.mapId, { ..._, ...g }), this.factionRegistry = !0);
        q != null && q.id && (h === "system" && (this.selectedSystemId = q.id), h === "entity" && (this.selectedObjectId = q.id), h === "route" && (this.selectedRouteId = q.id)), this.render({ force: !0 });
      }), globalThis.setTimeout(() => {
        var f;
        return (f = o.querySelector("[autofocus]")) == null ? void 0 : f.focus();
      }, 0));
    }
    _attachAppearancePreview(l) {
      const o = l.querySelector("[data-panel-marker-preview-system]"), d = l.querySelector("[data-panel-marker-preview-icon]"), m = l.querySelector("[data-panel-marker-preview-label]");
      if (!o) return;
      let u = 0;
      const f = ["name", "kind", "status", "iconStyle", "iconColor", "markerImage"].map((g) => l.querySelector(`[name="${g}"]`)), h = async () => {
        const g = (N, Q) => {
          var ue;
          return ((ue = l.querySelector(`[name="${N}"]`)) == null ? void 0 : ue.value) || Q;
        }, M = g("kind", "planet"), L = g("status", "known"), j = g("iconStyle", M), _ = g("markerImage", "").trim();
        o.className = `gmf-system gmf-system--${M} gmf-icon--${j} gmf-status--${L}${_ ? " has-custom-marker" : ""}`, o.style.setProperty("--gmf-faction-color", g("iconColor", "#58d8ff")), o.style.setProperty("--gmf-system-size", "42px"), m && (m.textContent = g("name", "New Entity"));
        const q = ++u;
        if (d && _) {
          const N = document.createElement("img");
          N.className = "gmf-custom-marker__image", N.src = _, N.alt = "", N.draggable = !1, d.replaceChildren(N);
        } else if (d && dt.includes(j)) {
          const N = await globalThis.renderTemplate(`${t}/celestial-icon.hbs`, { system: { iconStyle: j } });
          q === u && (d.innerHTML = N);
        } else d && (d.innerHTML = '<span class="gmf-system__core"></span>');
      };
      f.forEach((g) => {
        g == null || g.addEventListener("input", h), g == null || g.addEventListener("change", h);
      }), h();
    }
    async _confirmDeleteRoute(l) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, Ce) && await z(this.mapId, l, this.activeSystemId ?? "");
    }
    async _travelToSystem(l, o) {
      const d = T(s(this.mapId)), m = d.systems.find((h) => h.id === d.currentSystemId), u = d.systems.find((h) => h.id === l);
      if (!u) return;
      if (!m) {
        await ie(this.mapId, u.id), se(`Current location set to ${u.name}.`);
        return;
      }
      if (m.id === u.id) {
        se(`${u.name} is already the current location.`);
        return;
      }
      if (!R(d, m.id, u.id)) {
        Y(`No direct route from ${m.name} to ${u.name}.`);
        return;
      }
      ce(this.mapId, m.id, u.id), await this._animateShipTravel(m, u, o), await ie(this.mapId, u.id), se(`Arrived at ${u.name}.`);
    }
    async _travelToObject(l, o, d) {
      const m = T(s(this.mapId)), u = m.systems.find((M) => M.id === l), f = u == null ? void 0 : u.objects.find((M) => M.id === m.currentLocation.objectId), h = u == null ? void 0 : u.objects.find((M) => M.id === o);
      if (!u || !h) return;
      if (!f || m.currentLocation.systemId !== u.id) {
        await F(this.mapId, u.id, h.id), se(`Current location set to ${h.name}.`);
        return;
      }
      if (f.id === h.id) {
        se(`${h.name} is already the current location.`);
        return;
      }
      if (!R({ routes: u.routes }, f.id, h.id)) {
        Y(`No direct route from ${f.name} to ${h.name}.`);
        return;
      }
      fe(this.mapId, u.id, f.id, h.id), await this._animateShipTravel(f, h, d), await F(this.mapId, u.id, h.id), se(`Arrived at ${h.name}.`);
    }
    _animateShipTravel(l, o, d) {
      const m = d.querySelector("[data-ship-layer]"), u = d.querySelector(".gmf-map-stage");
      if (!m || !u) return Promise.resolve();
      const f = u.getBoundingClientRect(), h = (o.x - l.x) * f.width / 100, g = (o.y - l.y) * f.height / 100, M = Math.atan2(g, h) * 180 / Math.PI, L = document.createElement("div");
      return L.className = "gmf-travel-ship", L.innerHTML = '<i class="fa-solid fa-rocket"></i>', L.style.left = `${l.x}%`, L.style.top = `${l.y}%`, L.style.setProperty("--gmf-ship-angle", `${M}deg`), m.replaceChildren(L), new Promise((j) => {
        let _ = !1;
        const q = () => {
          _ || (_ = !0, L.removeEventListener("transitionend", q), L.classList.add("is-arrived"), globalThis.setTimeout(() => {
            L.remove(), j();
          }, 260));
        };
        L.addEventListener("transitionend", q, { once: !0 }), requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            L.style.left = `${o.x}%`, L.style.top = `${o.y}%`;
          });
        }), globalThis.setTimeout(q, is);
      });
    }
    _openLinkedJournal() {
      var d, m;
      const l = this._getSelectedRawSystem();
      if (!(l != null && l.journalId)) return;
      const o = (d = game.journal) == null ? void 0 : d.get(l.journalId);
      if (!o) {
        Y(`Journal "${l.journalId}" was not found.`);
        return;
      }
      (m = o.sheet) == null || m.render(!0);
    }
    _getSelectedRawSystem() {
      var o;
      const l = T(s(this.mapId));
      return this.activeSystemId ? ((o = l.systems.find((d) => d.id === this.activeSystemId)) == null ? void 0 : o.objects.find((d) => d.id === this.selectedObjectId)) ?? null : l.systems.find((d) => d.id === this.selectedSystemId) ?? null;
    }
    async close(l = {}) {
      var o, d;
      return (o = this._bountyIntelCallout) == null || o.dispose(), this._bountyIntelCallout = null, this._disposePlanetRenderer(), this._hideContextMenu(), this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, (d = this._viewportResizeObserver) == null || d.disconnect(), this._viewportResizeObserver = null, Gs(this), super.close(l);
    }
    _disposePlanetRenderer() {
      var l, o;
      this._planetGeneration++, (l = this._planetLocationCallout) == null || l.dispose(), this._planetLocationCallout = null, (o = this._planetRenderer) == null || o.dispose(), this._planetRenderer = null;
    }
    _setPlanetFallback(l, o) {
      const d = l.querySelector(".gmf-planet-fallback");
      d && (d.style.backgroundImage = o.texture ? `url(${JSON.stringify(o.texture)})` : "none", d.style.backgroundColor = o.color);
      const m = l.querySelector("[data-planet-canvas]");
      m && (m.dataset.planetShape = o.shape, m.dataset.planetPreset = o.preset);
      const u = l.querySelector(".gmf-planet-stage");
      u == null || u.style.setProperty("--gmf-planet-color", o.color);
    }
    async _mountPlanetRenderer(l, o) {
      var g, M, L;
      const d = l.querySelector("[data-planet-canvas]");
      if (!d || !o) return;
      this._setPlanetFallback(l, o);
      const m = this._planetGeneration, u = l.querySelector("[data-planet-status]"), f = l.querySelector("[data-action='planet-static']"), h = l.querySelectorAll("[data-planet-control]");
      if (f) {
        const j = this.planetStatic ? "Enable 3D" : "Static view";
        f.setAttribute("title", j), f.setAttribute("aria-label", j), f.setAttribute("aria-pressed", String(this.planetStatic));
        const _ = f.querySelector("i");
        _ && (_.className = this.planetStatic ? "fa-solid fa-cube" : "fa-solid fa-image");
      }
      if (this.planetStatic) {
        u && (u.textContent = "Static preview. Turn on 3D to rotate and zoom."), h.forEach((j) => j.disabled = !0);
        return;
      }
      try {
        const { createPlanetRenderer: j } = await import("./chunks/planet-renderer-BElRcyo9.js");
        if (m !== this._planetGeneration || !d.isConnected) return;
        h.forEach((_) => _.disabled = !1), this._planetRenderer = j(d, {
          texture: o.texture,
          color: o.color,
          appearancePreset: o.preset,
          shape: o.shape,
          finish: o.finish,
          detailStrength: o.detailStrength,
          locations: ((g = this._getPlanetObject()) == null ? void 0 : g.planetLocations) ?? [],
          canPlaceLocations: !!((M = game.user) != null && M.isGM && !this.playerMode),
          onLocationDrop: (_, q) => void this._placePlanetLocation(_, q, l),
          onInvalidLocationDrop: () => Y("Drop the scene directly onto the visible 3D surface."),
          onMarkerHover: (_) => {
            var N;
            const q = this._getPlanetLocationItem(_.id);
            q && ((N = this._planetLocationCallout) == null || N.show(q));
          },
          onMarkerLeave: () => {
            var _;
            return (_ = this._planetLocationCallout) == null ? void 0 : _.scheduleHide();
          },
          onMarkerPosition: (_) => {
            var q;
            return (q = this._planetLocationCallout) == null ? void 0 : q.setAnchor(_);
          },
          onMarkerOpen: (_) => this._openPlanetLocation(_.id),
          onMarkerContextMenu: (L = game.user) != null && L.isGM && !this.playerMode ? (_) => void this._removePlanetLocation(_.id, l) : null,
          isVisible: () => !this.minimized,
          onStatus: (_) => {
            u && (u.textContent = _);
          },
          onPaused: (_) => {
            const q = l.querySelector("[data-action='planet-pause']");
            if (q) {
              const N = _ ? "Resume rotation" : "Pause rotation";
              q.setAttribute("title", N), q.setAttribute("aria-label", N), q.setAttribute("aria-pressed", String(_));
              const Q = q.querySelector("i");
              Q && (Q.className = _ ? "fa-solid fa-play" : "fa-solid fa-pause");
            }
          },
          onStopped: () => {
            h.forEach((_) => _.disabled = !0), u && (u.textContent = "Static preview. Reopen this view to turn 3D back on.");
          }
        }), this._planetLocationCallout = _i({ host: d });
      } catch {
        h.forEach((j) => j.disabled = !0), u && (u.textContent = "3D could not be loaded. Static preview shown.");
      }
    }
  }, $(We, "DEFAULT_OPTIONS", {
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
  }), $(We, "PARTS", {
    main: {
      template: `${t}/galaxy-map.hbs`
    }
  }), We;
}
function Ei(e) {
  var n;
  const { templateRoot: t, getVisibleMaps: s, openMap: i, clearChooser: a } = e;
  return n = class extends It() {
    async _prepareContext(c) {
      return { ...await super._prepareContext(c), maps: s() };
    }
    _attachPartListeners(c, p, y) {
      super._attachPartListeners(c, p, y), it(this, p), p.querySelectorAll("[data-player-open-map]").forEach((v) => {
        v.addEventListener("click", () => {
          i(v.dataset.playerOpenMap, { playerMode: !0 }), this.close();
        });
      });
    }
    async close(c = {}) {
      return a(this), super.close(c);
    }
  }, $(n, "DEFAULT_OPTIONS", {
    id: "galaxy-map-player-chooser",
    classes: ["galaxy-map", "galaxy-map-framework", "gmf-manager-window", "gmf-map-chooser-window"],
    window: { title: "Choose Galaxy Map", icon: "fa-solid fa-satellite", resizable: !0 },
    position: { width: 480, height: 420 }
  }), $(n, "PARTS", { main: { template: `${t}/player-map-chooser.hbs` } }), n;
}
const de = "galaxy-map", bt = "maps", et = "schemaV1Backup", mt = "surfaceLocationRecoveryV2", G = `module.${de}`, Le = `modules/${de}/templates`;
let we = null;
const Oe = /* @__PURE__ */ new Map();
let W = null, Re = null;
const $e = /* @__PURE__ */ new Map(), Fe = /* @__PURE__ */ new Set(), he = /* @__PURE__ */ new Map(), ke = /* @__PURE__ */ new Map();
function X(e) {
  return foundry.utils.deepClone(e);
}
function B(e) {
  var t;
  (t = ui.notifications) == null || t.error(`[Galaxy Map] ${e}`);
}
function ae(e) {
  var t;
  (t = ui.notifications) == null || t.info(`[Galaxy Map] ${e}`);
}
function H(e = "change galaxy maps") {
  var t;
  return (t = game.user) != null && t.isGM ? !0 : (B(`Only a GM can ${e}.`), !1);
}
function Ve() {
  return game.users.filter((e) => e.active);
}
function Ye() {
  return Ve().filter((e) => e.isGM).sort((e, t) => String(e.id).localeCompare(String(t.id)))[0] ?? null;
}
function wt() {
  var e, t;
  return !!((e = game.user) != null && e.isGM && ((t = Ye()) == null ? void 0 : t.id) === game.user.id);
}
function U() {
  return X(game.settings.get(de, bt) ?? {});
}
async function J(e) {
  return H("save galaxy map data") && await game.settings.set(de, bt, e ?? {}), e;
}
function ki(e) {
  ps(e), e.querySelectorAll("[data-use-custom-marker]").forEach((C) => {
    const P = (C.closest("form") ?? e).querySelector("[data-custom-marker-field]"), O = (P == null ? void 0 : P.querySelector('[name="markerImage"]')) ?? null, D = (P == null ? void 0 : P.querySelectorAll("button")) ?? [], w = () => {
      const Z = C.checked;
      P == null || P.classList.toggle("is-disabled", !Z), O && (O.disabled = !Z), D.forEach((z) => {
        z.disabled = !Z;
      }), !Z && (O != null && O.value) && (O.value = "", O.dispatchEvent(new Event("input", { bubbles: !0 })), O.dispatchEvent(new Event("change", { bubbles: !0 })));
    };
    C.addEventListener("change", w), w();
  });
  const t = e.querySelector("[data-texture-upload-fields]"), s = e.querySelector('[name="planetTexture"]'), i = e.querySelector('[name="planetPreset"]'), a = e.querySelector('[name="planetShape"]'), n = e.querySelector('[name="planetFinish"]'), r = e.querySelector('[name="planetColor"]'), c = e.querySelector("[data-texture-guide]"), p = e.querySelector("[data-texture-guide-section]"), y = e.querySelectorAll("[data-texture-guide-preview]"), v = () => {
    if (!i || !a) return;
    const C = Qt(i.value, a.value);
    i.replaceChildren(...Kt(a.value).map((P) => {
      const O = document.createElement("option");
      return O.value = P.value, O.textContent = P.label, O;
    })), i.value = C;
  }, S = () => {
    const C = (i == null ? void 0 : i.value) === "custom", P = (i == null ? void 0 : i.value) === "none";
    return t && (t.hidden = !C), p && (p.hidden = !C), s && (s.required = C), a && (a.disabled = P), n && (n.disabled = P), r && (r.disabled = (i == null ? void 0 : i.value) !== "color"), C;
  }, b = () => {
    var P;
    if (!c) return;
    const C = (P = s == null ? void 0 : s.value) == null ? void 0 : P.trim();
    C ? c.dataset.hasTexture = "true" : delete c.dataset.hasTexture, y.forEach((O) => {
      O.onerror = C ? () => {
        O.hidden = !0;
      } : null, O.hidden = !C, C ? O.src = C : O.removeAttribute("src");
    });
  };
  i == null || i.addEventListener("change", () => {
    !S() && (s != null && s.value) && (s.value = "", s.dispatchEvent(new Event("change", { bubbles: !0 })));
  }), s == null || s.addEventListener("change", b), a == null || a.addEventListener("change", () => {
    c && (c.dataset.shape = a.value), v(), S();
  }), v(), S(), b();
}
function re(e) {
  const t = U();
  return t[e] ? X(t[e]) : null;
}
function Pi(e) {
  return new Map((e ?? []).map((t) => [t.id, t]));
}
function qi(e) {
  return e.visibility === "players";
}
function Ci(e, t) {
  return t && e.status === "undiscovered";
}
function ji(e, t) {
  return t === "planet" ? { station: "station", anomaly: "diamond", ruins: "diamond", unknown: "diamond" }[e] ?? t : t;
}
function Oi(e, { playerMode: t = !1, selectedSystemId: s = null, selectedRouteId: i = null } = {}) {
  var O, D;
  const a = T(e), n = t ? a.systems.filter(qi) : a.systems, r = new Set(n.map((w) => w.id)), c = t ? a.factions.filter((w) => w.visibility === "players") : a.factions, p = Pi(c), y = n.map((w) => {
    const Z = p.get(w.factionId), z = Ci(w, t), ie = z ? "unknown" : w.type, F = z ? "diamond" : ji(ie, w.iconStyle), A = z ? "" : w.markerImage;
    return {
      ...w,
      image: w.image,
      sceneIds: [...w.sceneIds],
      journalId: w.journalId,
      planetPreset: w.planetPreset,
      planetShape: w.planetShape,
      planetTexture: w.planetTexture,
      planetColor: w.planetColor,
      iconStyle: F,
      displayMarkerImage: A,
      hasCustomMarker: !!A,
      displayName: z ? "???" : w.name,
      displayDescription: z ? "Unresolved sensor contact. Details are not available." : w.description,
      displayType: ie,
      displayStatus: z ? "undiscovered" : w.status,
      factionName: (Z == null ? void 0 : Z.name) ?? "Unaffiliated",
      factionColor: w.iconColor || (Z == null ? void 0 : Z.color) || "#58d8ff",
      obscured: z,
      isCurrent: w.id === a.currentSystemId,
      isSelected: w.id === s,
      gmOnly: w.visibility === "gm",
      animatedCelestial: !A && dt.includes(F),
      hasAlert: ["danger", "locked"].includes(z ? "undiscovered" : w.status),
      alertLabel: w.status === "danger" ? "Hazard advisory" : w.status === "locked" ? "Restricted access" : "",
      hasJournal: !!(!z && w.journalId),
      hasScenes: !!(!z && w.sceneIds.length),
      showImage: !!(!z && w.image),
      canInspectSystem: !!xe({ ...w, planetPreset: w.planetPreset, planetShape: w.planetShape, planetTexture: w.planetTexture, planetColor: w.planetColor, obscured: z })
    };
  }), v = a.routes.filter((w) => !t || w.visibility === "players").filter((w) => r.has(w.fromSystemId) && r.has(w.toSystemId)).map((w) => {
    const Z = y.find((ie) => ie.id === w.fromSystemId), z = y.find((ie) => ie.id === w.toSystemId);
    return {
      ...w,
      from: Z,
      to: z,
      fromName: (Z == null ? void 0 : Z.displayName) ?? w.fromSystemId,
      toName: (z == null ? void 0 : z.displayName) ?? w.toSystemId,
      isSelected: w.id === i,
      connectsCurrent: w.fromSystemId === a.currentSystemId || w.toSystemId === a.currentSystemId,
      gmOnly: w.visibility === "gm"
    };
  }), S = v.find((w) => w.id === i) ?? null, b = S ? null : y.find((w) => w.id === s) ?? null;
  b && (b.isSelected = !0);
  const C = y.find((w) => w.id === a.currentSystemId) ?? y[0] ?? null, P = b && C && b.id !== C.id ? v.find((w) => w.fromSystemId === C.id && w.toSystemId === b.id || w.toSystemId === C.id && w.fromSystemId === b.id) : null;
  return b && (b.canTravel = !!P, b.travelRouteId = (P == null ? void 0 : P.id) ?? "", b.isCurrent = b.id === (C == null ? void 0 : C.id), b.isDestination = !!(P && !b.isCurrent)), v.forEach((w) => {
    w.isActive = w.isSelected || w.id === (P == null ? void 0 : P.id);
  }), {
    ...a,
    systems: y,
    routes: v,
    factions: c,
    selectedSystem: b,
    selectedRoute: S,
    currentSystem: C,
    selectedType: S ? "route" : b ? "system" : null,
    playerMode: t,
    isGM: ((O = game.user) == null ? void 0 : O.isGM) ?? !1,
    canEdit: ((D = game.user) == null ? void 0 : D.isGM) && !t
  };
}
async function gs(e = {}) {
  if (!H("create galaxy maps")) return null;
  const t = U(), s = T(e);
  return t[s.id] = s, await J(t), te(s.id), X(s);
}
async function vs(e, t = {}) {
  if (!H("update galaxy maps")) return null;
  const s = U();
  if (!s[e])
    return B(`Map "${e}" was not found.`), null;
  const i = T({ ...t, id: e });
  return s[e] = i, await J(s), te(e), X(i);
}
async function Ss(e, t = {}) {
  if (!H("update galaxy map metadata")) return null;
  const s = re(e);
  return s ? vs(e, {
    ...s,
    title: t.title,
    subtitle: t.subtitle,
    description: t.description,
    backgroundImage: t.backgroundImage,
    visibility: t.visibility,
    travelApprovalMode: t.travelApprovalMode
  }) : (B(`Map "${e}" was not found.`), null);
}
async function Is(e) {
  if (!H("delete galaxy maps")) return !1;
  const t = U();
  return t[e] ? (delete t[e], await J(t), an(e), te(), !0) : !1;
}
async function bs(e) {
  if (!H("duplicate galaxy maps")) return null;
  const t = re(e);
  if (!t)
    return B(`Map "${e}" was not found.`), null;
  const s = T({
    ...t,
    id: Ie("map"),
    title: `${t.title} Copy`
  }), i = U();
  return i[s.id] = s, await J(i), te(s.id), X(s);
}
async function ws(e, t = {}) {
  var S;
  if (!H("save star systems")) return null;
  const s = U();
  if (!s[e])
    return B(`Map "${e}" was not found.`), null;
  const i = T(s[e]), a = i.systems.find((b) => b.id === t.id), n = t.objects ?? (a == null ? void 0 : a.objects) ?? [], r = (a == null ? void 0 : a.primaryObjectId) || ((S = n[0]) == null ? void 0 : S.id), c = ["image", "sceneIds", "planetLocations", "journalId", "planetPreset", "planetShape", "planetFinish", "planetTexture", "planetColor"], p = n.map((b) => b.id !== r ? b : tt({
    ...b,
    ...Object.fromEntries(c.filter((C) => t[C] !== void 0).map((C) => [C, t[C]]))
  })), y = os({ ...a, ...t, objects: p }), v = i.systems.findIndex((b) => b.id === y.id);
  return v >= 0 ? i.systems[v] = y : i.systems.push(y), s[e] = T(i), await J(s), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), X(y);
}
async function Mt(e, t, s = {}) {
  if (!H("save entities")) return null;
  const i = U();
  if (!i[e]) return null;
  const a = T(i[e]), n = a.systems.find((p) => p.id === t);
  if (!n) return null;
  const r = tt(s), c = n.objects.findIndex((p) => p.id === r.id);
  return c >= 0 ? n.objects[c] = r : n.objects.push(r), n.primaryObjectId || (n.primaryObjectId = r.id), i[e] = T(a), await J(i), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), X(r);
}
function _t(e, t, s) {
  var i;
  for (const a of Ot(e)) (i = a.refreshPlanetLocations) == null || i.call(a, t, s);
}
async function Ms(e, t, s, i = {}) {
  if (!H("place surface locations")) return null;
  const a = U(), n = a[e] ? T(a[e]) : null, r = n == null ? void 0 : n.systems.find((S) => S.id === t), c = r == null ? void 0 : r.objects.find((S) => S.id === s);
  if (!n || !r || !c) return null;
  const p = String(i.sceneId || "");
  if (!c.sceneIds.includes(p))
    return B("Only scenes linked to this object can be placed on its surface."), null;
  const y = ns(i), v = c.planetLocations.findIndex((S) => S.sceneId === p && S.shape === y.shape);
  return v >= 0 && (y.id = c.planetLocations[v].id), v >= 0 ? c.planetLocations[v] = y : c.planetLocations.push(y), a[e] = T(n), await J(a), _t(e, t, s), game.socket.emit(G, { action: "planet-locations", mapId: e, systemId: t, objectId: s }), X(y);
}
async function _s(e, t, s, i) {
  var p;
  if (!H("remove surface locations")) return !1;
  const a = U(), n = a[e] ? T(a[e]) : null, r = (p = n == null ? void 0 : n.systems.find((y) => y.id === t)) == null ? void 0 : p.objects.find((y) => y.id === s);
  if (!n || !r) return !1;
  const c = r.planetLocations.length;
  return r.planetLocations = r.planetLocations.filter((y) => y.id !== i), r.planetLocations.length === c ? !1 : (a[e] = T(n), await J(a), _t(e, t, s), game.socket.emit(G, { action: "planet-locations", mapId: e, systemId: t, objectId: s }), !0);
}
async function xs(e, t, s, i) {
  var r;
  if (!H("unlink scenes from entities")) return !1;
  const a = re(e), n = (r = a == null ? void 0 : a.systems.find((c) => c.id === t)) == null ? void 0 : r.objects.find((c) => c.id === s);
  return n != null && n.sceneIds.includes(i) ? !!await Mt(e, t, { ...n, sceneIds: n.sceneIds.filter((c) => c !== i) }) : !1;
}
async function xt(e, t, s) {
  var r;
  if (!H("delete entities")) return !1;
  const i = U();
  if (!i[e]) return !1;
  const a = T(i[e]), n = a.systems.find((c) => c.id === t);
  return n ? (n.objects = n.objects.filter((c) => c.id !== s), n.primaryObjectId === s && (n.primaryObjectId = ((r = n.objects[0]) == null ? void 0 : r.id) ?? ""), a.currentLocation.objectId === s && (a.currentLocation.objectId = n.primaryObjectId), i[e] = T(a), await J(i), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), !0) : !1;
}
async function Ai(e, t, s) {
  var p;
  if (!H("move entities")) return null;
  const i = U();
  if (!i[e]) return null;
  const a = T(i[e]), n = a.systems.find((y) => y.objects.some((v) => v.id === t)), r = a.systems.find((y) => y.id === s), c = n == null ? void 0 : n.objects.find((y) => y.id === t);
  return !n || !r || !c ? null : (n.objects = n.objects.filter((y) => y.id !== t), r.objects.push(c), n.primaryObjectId === t && (n.primaryObjectId = ((p = n.objects[0]) == null ? void 0 : p.id) ?? ""), r.primaryObjectId || (r.primaryObjectId = t), a.currentLocation.objectId === t && (a.currentLocation.systemId = r.id), i[e] = T(a), await J(i), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), X(c));
}
async function Ri(e, t, s) {
  if (!H("set the arrival object")) return null;
  const i = U();
  if (!i[e]) return null;
  const a = T(i[e]), n = a.systems.find((r) => r.id === t);
  return n != null && n.objects.some((r) => r.id === s) ? (n.primaryObjectId = s, a.currentLocation.systemId === t && !a.currentLocation.objectId && (a.currentLocation.objectId = s), i[e] = T(a), await J(i), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), X(n)) : null;
}
async function Ls(e, t, s, i, a) {
  var p;
  const n = U();
  if (!n[e]) return null;
  const r = T(n[e]), c = (p = r.systems.find((y) => y.id === t)) == null ? void 0 : p.objects.find((y) => y.id === s);
  return c ? (c.x = ee(pe(i, c.x), 0, 100), c.y = ee(pe(a, c.y), 0, 100), n[e] = T(r), await J(n), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), X(c)) : null;
}
async function Ts(e, t, s, i) {
  var c;
  if (!H("change object visibility")) return null;
  const a = U();
  if (!a[e]) return null;
  const n = T(a[e]), r = (c = n.systems.find((p) => p.id === t)) == null ? void 0 : c.objects.find((p) => p.id === s);
  return r ? (r.visibility = ss.includes(i) ? i : "inherit", r.visibility === "players" && ["undiscovered", "locked"].includes(r.status) && (r.status = "known"), a[e] = T(n), await J(a), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), X(r)) : null;
}
async function Lt(e, t) {
  var a;
  if (!H("delete star systems")) return !1;
  const s = U(), i = s[e];
  return i ? (i.systems = i.systems.filter((n) => n.id !== t), i.routes = i.routes.filter((n) => n.fromSystemId !== t && n.toSystemId !== t), i.currentSystemId === t && (i.currentSystemId = ((a = i.systems[0]) == null ? void 0 : a.id) ?? ""), s[e] = T(i), await J(s), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), !0) : !1;
}
async function Tt(e, t) {
  var n;
  if (!H("set current location")) return null;
  const s = U(), i = s[e] ? T(s[e]) : null, a = (n = i == null ? void 0 : i.systems) == null ? void 0 : n.find((r) => r.id === t);
  return a ? (i.currentSystemId = t, s[e] = T(i), await J(s), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), X(a)) : (B(`System "${t}" was not found.`), null);
}
async function Et(e, t, s) {
  if (!H("set current location")) return null;
  const i = U();
  if (!i[e]) return null;
  const a = T(i[e]), n = a.systems.find((c) => c.id === t), r = n == null ? void 0 : n.objects.find((c) => c.id === s);
  return !n || !r ? null : (a.currentSystemId = t, a.currentLocation = { systemId: t, objectId: s }, i[e] = T(a), await J(i), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), X(r));
}
async function Es(e, t = {}, s = "") {
  var p;
  if (!H("save routes")) return null;
  const i = U(), a = i[e];
  if (!a)
    return B(`Map "${e}" was not found.`), null;
  const n = s ? (p = a.systems) == null ? void 0 : p.find((y) => y.id === s) : a;
  if (!n)
    return B(`System "${s}" was not found.`), null;
  Array.isArray(n.routes) || (n.routes = []);
  const r = vt(t);
  if (!r.fromSystemId || !r.toSystemId || r.fromSystemId === r.toSystemId)
    return B("Routes require two different systems."), null;
  const c = n.routes.findIndex((y) => y.id === r.id);
  return c >= 0 ? n.routes[c] = r : n.routes.push(r), i[e] = T(a), await J(i), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), X(r);
}
async function kt(e, t, s = "") {
  var r;
  if (!H("delete routes")) return !1;
  const i = U(), a = i[e];
  if (!a) return !1;
  const n = s ? (r = a.systems) == null ? void 0 : r.find((c) => c.id === s) : a;
  return n ? (n.routes = (n.routes ?? []).filter((c) => c.id !== t), i[e] = T(a), await J(i), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), !0) : !1;
}
async function ks(e, t = {}) {
  if (!H("save factions")) return null;
  const s = U(), i = s[e];
  if (!i)
    return B(`Map "${e}" was not found.`), null;
  const a = cs(t), n = i.factions.findIndex((r) => r.id === a.id);
  return n >= 0 ? i.factions[n] = a : i.factions.push(a), s[e] = T(i), await J(s), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), X(a);
}
async function Pt(e, t) {
  if (!H("delete factions")) return !1;
  const s = U(), i = s[e];
  if (!i) return !1;
  i.factions = i.factions.filter((a) => a.id !== t);
  for (const a of i.systems) {
    a.factionId === t && (a.factionId = "");
    for (const n of a.objects ?? []) n.factionId === t && (n.factionId = "");
  }
  return s[e] = T(i), await J(s), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), !0;
}
async function Ps(e, t, s = !0) {
  var r;
  if (!H(s ? "hide factions" : "reveal factions")) return null;
  const i = U(), a = i[e], n = (r = a == null ? void 0 : a.factions) == null ? void 0 : r.find((c) => c.id === t);
  return n ? (n.visibility = s ? "gm" : "players", i[e] = T(a), await J(i), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), ae(`${n.name} ${s ? "hidden from" : "visible to"} players.`), X(n)) : (B(`Faction "${t}" was not found.`), null);
}
async function qs(e, t, s, i) {
  var c;
  if (!H("move star systems")) return null;
  const a = U(), n = a[e], r = (c = n == null ? void 0 : n.systems) == null ? void 0 : c.find((p) => p.id === t);
  return r ? (r.x = ee(pe(s, r.x), 0, 100), r.y = ee(pe(i, r.y), 0, 100), a[e] = T(n), await J(a), game.socket.emit(G, { action: "refresh", mapId: e }), X(r)) : (B(`System "${t}" was not found.`), null);
}
async function Cs(e, t, { notify: s = !0 } = {}) {
  var r;
  if (!H("reveal star systems")) return null;
  const i = U(), a = i[e], n = (r = a == null ? void 0 : a.systems) == null ? void 0 : r.find((c) => c.id === t);
  return n ? (n.visibility = "players", (n.status === "undiscovered" || n.status === "locked") && (n.status = "known"), i[e] = T(a), await J(i), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), s && $i(e, n.id), ae(`${n.name} revealed to players.`), X(n)) : (B(`System "${t}" was not found.`), null);
}
async function qt(e, t, s = !0) {
  var r;
  if (!H(s ? "hide star systems" : "reveal star systems")) return null;
  const i = U(), a = i[e], n = (r = a == null ? void 0 : a.systems) == null ? void 0 : r.find((c) => c.id === t);
  return n ? (n.visibility = s ? "gm" : "players", i[e] = T(a), await J(i), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), ae(`${n.name} ${s ? "hidden from" : "visible to"} players.`), X(n)) : (B(`System "${t}" was not found.`), null);
}
async function js(e, t, s = "") {
  var c, p;
  if (!H("reveal routes")) return null;
  const i = U(), a = i[e], n = s ? (c = a == null ? void 0 : a.systems) == null ? void 0 : c.find((y) => y.id === s) : a, r = (p = n == null ? void 0 : n.routes) == null ? void 0 : p.find((y) => y.id === t);
  return r ? (r.visibility = "players", i[e] = T(a), await J(i), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), ae("Route revealed to players."), X(r)) : (B(`Route "${t}" was not found.`), null);
}
async function Ct(e, t, s = !0, i = "") {
  var p, y;
  if (!H(s ? "hide routes" : "reveal routes")) return null;
  const a = U(), n = a[e], r = i ? (p = n == null ? void 0 : n.systems) == null ? void 0 : p.find((v) => v.id === i) : n, c = (y = r == null ? void 0 : r.routes) == null ? void 0 : y.find((v) => v.id === t);
  return c ? (c.visibility = s ? "gm" : "players", a[e] = T(n), await J(a), te(e), game.socket.emit(G, { action: "refresh", mapId: e }), ae(`Route ${s ? "hidden from" : "visible to"} players.`), X(c)) : (B(`Route "${t}" was not found.`), null);
}
function $i(e, t) {
  var a;
  if (!H("notify players about discoveries")) return;
  const s = re(e), i = (a = s == null ? void 0 : s.systems) == null ? void 0 : a.find((n) => n.id === t);
  if (!i) {
    B(`System "${t}" was not found.`);
    return;
  }
  game.socket.emit(G, {
    action: "notify",
    mapId: e,
    systemId: t,
    message: `New System Discovered: ${i.name}`
  }), ae(`Discovery notification sent: ${i.name}.`);
}
async function Fi(e, { replace: t = !1 } = {}) {
  if (!H("import galaxy maps")) return null;
  const s = U();
  let i = T(e);
  return s[i.id] && !t && (i = T({
    ...i,
    id: Ie("map"),
    title: `${i.title} Import`
  })), s[i.id] = i, await J(s), te(i.id), ae(`Imported ${i.title}.`), X(i);
}
function jt(e) {
  const t = re(e);
  if (!t) {
    B(`Map "${e}" was not found.`);
    return;
  }
  fi(`${mi(t.title)}.json`, T(t));
}
function Ni(e) {
  return `
    <div class="gmf-texture-guide" data-texture-guide data-shape="${le(e)}">
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
          ${Array.from({ length: 4 }, (t, s) => `<span class="is-face-${s + 1}">Side ${s + 1}<br>upper</span>`).join("")}
          ${Array.from({ length: 4 }, (t, s) => `<span class="is-face-${s + 5}">Side ${s + 1}<br>lower</span>`).join("")}
          <i class="gmf-uv-grid-label is-columns">4 columns · 512px each</i>
        </div>
        <figcaption><strong>2048×1024 · 2:1</strong> Divide the image into four 512×512 columns. Each column is one continuous crystal side: its upper triangle sits directly above its matching lower triangle.</figcaption>
      </figure>
    </div>
  `;
}
function Di(e) {
  var a;
  if (!e) return null;
  const t = T(e), s = new Map(t.systems.map((n) => [n.id, n])), i = new Map(t.factions.map((n) => [n.id, n]));
  return {
    ...t,
    travelApprovalModeLabel: ((a = pt.find((n) => n.value === t.travelApprovalMode)) == null ? void 0 : a.label) ?? "Unanimous agreement",
    systems: t.systems.map((n) => {
      var r;
      return {
        ...n,
        factionName: ((r = i.get(n.factionId)) == null ? void 0 : r.name) ?? "Unaffiliated"
      };
    }),
    routes: [
      ...t.routes.map((n) => {
        var r, c;
        return {
          ...n,
          systemId: "",
          scopeLabel: "Galaxy route",
          fromName: ((r = s.get(n.fromSystemId)) == null ? void 0 : r.name) ?? n.fromSystemId,
          toName: ((c = s.get(n.toSystemId)) == null ? void 0 : c.name) ?? n.toSystemId
        };
      }),
      ...t.systems.flatMap((n) => {
        const r = new Map(n.objects.map((c) => [c.id, c]));
        return n.routes.map((c) => {
          var p, y;
          return {
            ...c,
            systemId: n.id,
            scopeLabel: `Inside ${n.name}`,
            fromName: ((p = r.get(c.fromSystemId)) == null ? void 0 : p.name) ?? c.fromSystemId,
            toName: ((y = r.get(c.toSystemId)) == null ? void 0 : y.name) ?? c.toSystemId
          };
        });
      })
    ]
  };
}
function Ne() {
  return Object.values(U()).map(T);
}
function Bi(e, t) {
  return X(T(re(e)).systems.find((s) => s.id === String(t)) ?? null);
}
function zi(e, t) {
  const s = T(re(e));
  for (const i of s.systems) {
    const a = i.objects.find((n) => n.id === String(t));
    if (a) return { systemId: i.id, object: X(a) };
  }
  return null;
}
function Gi(e, t) {
  const s = re(e);
  if (!s) return [];
  const i = T(s).systems.find((a) => a.id === String(t));
  return i ? [...new Set(i.objects.flatMap((a) => a.sceneIds))] : [];
}
function Hi(e, t) {
  const i = T(re(e)).systems.flatMap((a) => a.objects).find((a) => a.id === String(t));
  return i ? [...i.sceneIds] : [];
}
function Vi(e) {
  const t = String(e || "");
  return t ? Ne().flatMap((s) => s.systems.flatMap((i) => i.objects.filter((a) => a.sceneIds.includes(t)).map((a) => ({ mapId: s.id, mapTitle: s.title, systemId: i.id, systemName: i.name, object: X(a) })))) : [];
}
function Ui(e) {
  const t = String(e || "");
  return t ? Ne().flatMap((s) => s.systems.filter((i) => i.objects.some((a) => a.sceneIds.includes(t))).map((i) => ({ mapId: s.id, mapTitle: s.title, system: X(i) }))) : [];
}
function Os(e) {
  var s;
  const t = As(e);
  return ((s = t == null ? void 0 : t.closest) == null ? void 0 : s.call(t, ".window-app, .application, .app")) ?? t;
}
function Yi(e) {
  return e.map((t) => {
    var a, n;
    const s = Os(t);
    if (!s) return null;
    const i = Number.parseInt(((n = (a = globalThis.getComputedStyle) == null ? void 0 : a.call(globalThis, s)) == null ? void 0 : n.zIndex) ?? "", 10);
    return { app: t, zIndex: s.style.zIndex || (Number.isFinite(i) ? String(i) : "") };
  }).filter(Boolean);
}
function ct(e) {
  for (const t of e) {
    const s = Os(t.app);
    !(s != null && s.isConnected) || !t.zIndex || (s.style.zIndex = t.zIndex);
  }
}
async function te(e = null) {
  var n;
  const t = [...Oe.entries()].filter(([r, c]) => (c == null ? void 0 : c.rendered) && (!e || r === e)).map(([, r]) => r);
  W != null && W.rendered && (!e || W.mapId === e) && t.push(W);
  const s = [we != null && we.rendered ? we : null, ...t].filter(Boolean), i = Yi(s), a = s.map((r) => Promise.resolve(r.render({ force: !0 })));
  ct(i), await Promise.allSettled(a), ct(i), (n = globalThis.requestAnimationFrame) == null || n.call(globalThis, () => ct(i));
}
function Ot(e) {
  const t = [...Oe.values()];
  return W && t.push(W), t.filter((s) => (s == null ? void 0 : s.rendered) && s.mapId === e);
}
function As(e) {
  return e.element ?? null;
}
function nt(e, t, s) {
  return e.routes.find((i) => i.fromSystemId === t && i.toSystemId === s || i.toSystemId === t && i.fromSystemId === s) ?? null;
}
function Wi(e, t) {
  const s = re(e);
  if (!s)
    return B(`Map "${e}" was not found.`), null;
  const i = T(s), a = i.systems.find((y) => y.id === i.currentSystemId), n = i.systems.find((y) => y.id === t);
  if (!n)
    return B(`System "${t}" was not found.`), null;
  if (!a)
    return B("This map does not have a current location yet. Ask the GM to set one first."), null;
  if (a.id === n.id)
    return ae(`${n.name} is already the current location.`), null;
  if (i.visibility !== "players" || a.visibility !== "players" || n.visibility !== "players")
    return B("That travel destination is not visible to players."), null;
  const r = nt(i, a.id, n.id);
  if (!r || r.visibility !== "players")
    return B(`No player-visible direct route from ${a.name} to ${n.name}.`), null;
  const c = Ye();
  if (!c)
    return B("A GM must be online to approve player travel."), null;
  const p = yt(Ve(), game.user.id, c, i.travelApprovalMode);
  return {
    action: "travel-request",
    requestId: Ie("travel"),
    mapId: e,
    mapTitle: i.title,
    fromSystemId: a.id,
    fromName: a.name,
    toSystemId: n.id,
    toName: n.name,
    routeId: r.id,
    routeType: r.type,
    travelTime: r.travelTime,
    fuelCost: r.fuelCost,
    requesterId: game.user.id,
    requesterName: game.user.name,
    approvalMode: p.approvalMode,
    voterIds: p.voterIds,
    voterNames: p.voterNames,
    requiredApprovals: p.requiredApprovals,
    participantCount: p.participantCount
  };
}
function Rs(e, t) {
  const s = Wi(e, t);
  return s ? (game.socket.emit(G, s), ae(`Travel request sent: ${s.fromName} to ${s.toName}.`), s) : null;
}
function Xi(e, t, s) {
  const i = re(e);
  if (!i)
    return B(`Map "${e}" was not found.`), null;
  const a = T(i), n = a.systems.find((S) => S.id === t), r = n == null ? void 0 : n.objects.find((S) => S.id === a.currentLocation.objectId), c = n == null ? void 0 : n.objects.find((S) => S.id === s);
  if (!n || a.currentLocation.systemId !== n.id || !r)
    return B("The current location is not inside this system."), null;
  if (!c)
    return B(`Destination "${s}" was not found.`), null;
  if (r.id === c.id)
    return ae(`${c.name} is already the current location.`), null;
  if (a.visibility !== "players" || n.visibility !== "players" || je(n, r) !== "players" || je(n, c) !== "players")
    return B("That travel destination is not visible to players."), null;
  const p = nt({ routes: n.routes }, r.id, c.id);
  if (!p || p.visibility !== "players")
    return B(`No player-visible direct route from ${r.name} to ${c.name}.`), null;
  const y = Ye();
  if (!y)
    return B("A GM must be online to approve player travel."), null;
  const v = yt(Ve(), game.user.id, y, a.travelApprovalMode);
  return {
    action: "travel-request",
    travelScope: "object",
    requestId: Ie("travel"),
    mapId: e,
    mapTitle: a.title,
    systemId: n.id,
    fromObjectId: r.id,
    fromName: r.name,
    toObjectId: c.id,
    toName: c.name,
    routeId: p.id,
    routeType: p.type,
    travelTime: p.travelTime,
    fuelCost: p.fuelCost,
    requesterId: game.user.id,
    requesterName: game.user.name,
    approvalMode: v.approvalMode,
    voterIds: v.voterIds,
    voterNames: v.voterNames,
    requiredApprovals: v.requiredApprovals,
    participantCount: v.participantCount
  };
}
function $s(e, t, s) {
  const i = Xi(e, t, s);
  return i ? (game.socket.emit(G, i), ae(`Travel request sent: ${i.fromName} to ${i.toName}.`), i) : null;
}
function Wt(e) {
  var r, c, p, y;
  if (!(e != null && e.requestId) || e.requesterId === ((r = game.user) == null ? void 0 : r.id) || !((p = e.voterIds) != null && p.includes((c = game.user) == null ? void 0 : c.id)) || Fe.has(e.requestId)) return;
  Fe.add(e.requestId);
  let t = !1, s = !1, i = null;
  const a = (v) => {
    if (t) return;
    t = !0;
    const S = {
      action: "travel-vote",
      requestId: e.requestId,
      mapId: e.mapId,
      userId: game.user.id,
      userName: game.user.name,
      accepted: v
    };
    game.socket.emit(G, S), Ds(S);
  }, n = ((y = pt.find((v) => v.value === e.approvalMode)) == null ? void 0 : y.label) ?? "Unanimous agreement";
  i = new Dialog({
    title: "Travel Request",
    content: `
      <section class="gmf-travel-request">
        <p><strong>${le(e.requesterName)}</strong> wants to travel on <strong>${le(e.mapTitle)}</strong>.</p>
        <p>${le(e.fromName)} &rarr; ${le(e.toName)}</p>
        <p class="gmf-travel-request__meta">${le(e.routeType)} route / ${le(e.travelTime || "Unknown time")} / Fuel ${le(e.fuelCost ?? 0)}</p>
        <p class="gmf-travel-request__mode"><i class="fa-solid fa-users"></i> ${le(n)}</p>
        <div class="gmf-travel-progress" data-travel-progress aria-live="polite">
          <div class="gmf-travel-progress__bar"><span data-travel-progress-bar></span></div>
          <strong data-travel-progress-count>Waiting for vote status…</strong>
          <span data-travel-progress-pending></span>
        </div>
      </section>
    `,
    render: (v) => {
      const S = fs(v), b = he.get(e.requestId);
      b && (b.root = S), At(e.requestId, ke.get(e.requestId));
    },
    buttons: {
      accept: {
        icon: '<i class="fa-solid fa-check"></i>',
        label: "Accept",
        callback: () => a(!0)
      },
      decline: {
        icon: '<i class="fa-solid fa-xmark"></i>',
        label: "Decline",
        callback: () => a(!1)
      }
    },
    default: "accept",
    close: () => {
      he.delete(e.requestId), s || a(!1);
    }
  }, {
    classes: ["galaxy-map", "gmf-crud-dialog"],
    width: 420,
    height: Math.max(320, Math.min(440, window.innerHeight - 80))
  }), he.set(e.requestId, {
    root: null,
    resolve: () => {
      s = !0, t = !0, i == null || i.close();
    }
  }), i.render(!0);
}
function at(e) {
  var t;
  return !!(e != null && e.coordinatorId && e.coordinatorId === ((t = Ye()) == null ? void 0 : t.id));
}
function Ji(e) {
  const t = es(e);
  return {
    action: "travel-progress",
    requestId: e.requestId,
    mapId: e.mapId,
    requesterId: e.requesterId,
    approvalMode: e.approvalMode,
    acceptedCount: t.acceptedCount,
    declinedCount: t.declinedCount,
    requiredApprovals: t.required,
    participantCount: e.participantCount,
    pendingNames: t.pendingIds.map((s) => {
      var i;
      return ((i = e.voterNames) == null ? void 0 : i[s]) || "Navigator";
    }),
    coordinatorId: game.user.id
  };
}
function At(e, t) {
  var r, c;
  if (!t) return;
  ke.set(e, t);
  const s = (r = he.get(e)) == null ? void 0 : r.root;
  if (!s) return;
  const i = s.querySelector("[data-travel-progress-count]"), a = s.querySelector("[data-travel-progress-pending]"), n = s.querySelector("[data-travel-progress-bar]");
  i && (i.textContent = `${t.acceptedCount} of ${t.requiredApprovals} approvals`), a && (a.textContent = (c = t.pendingNames) != null && c.length ? `Waiting for: ${t.pendingNames.join(", ")}` : "All votes received"), n && (n.style.width = `${Math.min(100, t.acceptedCount / Math.max(1, t.requiredApprovals) * 100)}%`);
}
function Fs(e) {
  const t = Ji(e);
  return ke.set(e.requestId, t), At(e.requestId, t), game.socket.emit(G, t), t;
}
function Zi(e) {
  var s, i, a;
  if (!(e != null && e.requestId) || !at(e)) return;
  const t = ke.get(e.requestId);
  if (At(e.requestId, e), e.requesterId === ((s = game.user) == null ? void 0 : s.id) && (!t || t.acceptedCount !== e.acceptedCount || t.declinedCount !== e.declinedCount)) {
    const n = (i = e.pendingNames) != null && i.length ? ` Waiting for ${e.pendingNames.join(", ")}.` : "";
    (a = ui.notifications) == null || a.info(`Travel vote: ${e.acceptedCount}/${e.requiredApprovals} approvals.${n}`);
  }
}
function Ki(e) {
  if (!wt() || !(e != null && e.requestId) || $e.has(e.requestId)) return null;
  const t = re(e.mapId);
  if (!t) return null;
  const s = T(t), i = Ve().find((D) => D.id === e.requesterId && !D.isGM), a = e.travelScope === "object", n = a ? s.systems.find((D) => D.id === e.systemId) : null, r = a ? n == null ? void 0 : n.objects.find((D) => D.id === s.currentLocation.objectId) : s.systems.find((D) => D.id === s.currentSystemId), c = a ? n == null ? void 0 : n.objects.find((D) => D.id === e.toObjectId) : s.systems.find((D) => D.id === e.toSystemId), p = r && c ? nt(a ? { routes: (n == null ? void 0 : n.routes) ?? [] } : s, r.id, c.id) : null, y = a && (!n || s.currentLocation.systemId !== n.id || n.visibility !== "players" || je(n, r) !== "players" || je(n, c) !== "players"), v = !a && ((r == null ? void 0 : r.visibility) !== "players" || (c == null ? void 0 : c.visibility) !== "players");
  if (!i || s.visibility !== "players" || !r || !c || r.id === c.id || y || v || !p || p.visibility !== "players") return null;
  const S = s.travelApprovalMode, b = Ye(), C = yt(Ve(), e.requesterId, b, S), P = globalThis.setTimeout(() => {
    const D = $e.get(e.requestId);
    D && Ns(D, { reason: "Travel request timed out." });
  }, Qs), O = {
    action: "travel-ballot",
    requestId: String(e.requestId).slice(0, 80),
    mapId: s.id,
    mapTitle: s.title,
    travelScope: a ? "object" : "system",
    systemId: a ? n.id : "",
    fromSystemId: a ? n.id : r.id,
    fromObjectId: a ? r.id : "",
    fromName: r.name,
    toSystemId: a ? n.id : c.id,
    toObjectId: a ? c.id : "",
    toName: c.name,
    routeId: p.id,
    routeType: p.type,
    travelTime: p.travelTime,
    fuelCost: p.fuelCost,
    requesterId: i.id,
    requesterName: i.name,
    coordinatorId: game.user.id,
    ...C,
    accepted: /* @__PURE__ */ new Set(),
    declined: /* @__PURE__ */ new Set(),
    timeoutId: P
  };
  return $e.set(e.requestId, O), Fs(O), O;
}
function Rt(e) {
  const t = T(re(e.mapId)), s = e.travelScope === "object", i = s ? t.systems.find((r) => r.id === e.systemId) : null, a = s ? i == null ? void 0 : i.objects.find((r) => r.id === e.fromObjectId) : t.systems.find((r) => r.id === e.fromSystemId), n = s ? i == null ? void 0 : i.objects.find((r) => r.id === e.toObjectId) : t.systems.find((r) => r.id === e.toSystemId);
  !a || !n || Ot(e.mapId).forEach((r) => {
    var p;
    const c = As(r);
    if (c) {
      if (s) {
        if (r.activeSystemId !== i.id) return;
        r.selectedObjectId = n.id;
      } else r.selectedSystemId = n.id;
      r.selectedRouteId = null, (p = r._animateShipTravel) == null || p.call(r, a, n, c);
    }
  });
}
function Qi(e, t, s) {
  var i;
  game.socket.emit(G, {
    action: "travel-animation",
    mapId: e,
    fromSystemId: t,
    toSystemId: s,
    coordinatorId: (i = game.user) == null ? void 0 : i.id
  });
}
function en(e, t, s, i) {
  var a;
  game.socket.emit(G, {
    action: "travel-animation",
    travelScope: "object",
    mapId: e,
    systemId: t,
    fromObjectId: s,
    toObjectId: i,
    coordinatorId: (a = game.user) == null ? void 0 : a.id
  });
}
async function tn(e) {
  var s;
  $e.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId), Fe.delete(e.requestId), (s = he.get(e.requestId)) == null || s.resolve(), he.delete(e.requestId), ke.delete(e.requestId);
  const t = {
    action: "travel-approved",
    requestId: e.requestId,
    mapId: e.mapId,
    travelScope: e.travelScope,
    systemId: e.systemId,
    fromSystemId: e.fromSystemId,
    toSystemId: e.toSystemId,
    fromObjectId: e.fromObjectId,
    toObjectId: e.toObjectId,
    fromName: e.fromName,
    toName: e.toName,
    coordinatorId: game.user.id
  };
  game.socket.emit(G, t), Rt(t), ae(`Travel approved: ${e.fromName} to ${e.toName}.`), globalThis.setTimeout(() => {
    e.travelScope === "object" ? Et(e.mapId, e.systemId, e.toObjectId) : Tt(e.mapId, e.toSystemId);
  }, is);
}
function Ns(e, { voterName: t = "", reason: s = "" } = {}) {
  var n;
  $e.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId), Fe.delete(e.requestId), (n = he.get(e.requestId)) == null || n.resolve(), he.delete(e.requestId), ke.delete(e.requestId);
  const i = s || `${t || "A participant"} declined the request.`, a = {
    action: "travel-declined",
    requestId: e.requestId,
    mapId: e.mapId,
    fromName: e.fromName,
    toName: e.toName,
    voterName: t,
    reason: i,
    coordinatorId: game.user.id
  };
  game.socket.emit(G, a), ae(`Travel cancelled: ${i}`);
}
function Ds(e) {
  if (!wt() || !(e != null && e.requestId)) return;
  const t = $e.get(e.requestId);
  if (!t || !t.voterIds.includes(e.userId) || t.accepted.has(e.userId) || t.declined.has(e.userId)) return;
  e.accepted ? t.accepted.add(e.userId) : t.declined.add(e.userId);
  const s = es(t);
  Fs(t), s.outcome === "approved" ? tn(t) : s.outcome === "declined" && Ns(t, {
    voterName: e.userName,
    reason: t.approvalMode === "unanimous" ? `${e.userName || "A participant"} declined the unanimous request.` : "The remaining votes cannot reach a majority."
  });
}
function sn(e) {
  var t, s, i;
  at(e) && e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && Fe.delete(e.requestId), (s = he.get(e.requestId)) == null || s.resolve(), he.delete(e.requestId), ke.delete(e.requestId), Rt(e), (i = ui.notifications) == null || i.info(`Travel approved: ${e.fromName} to ${e.toName}.`));
}
function nn(e) {
  var t, s, i;
  at(e) && e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && Fe.delete(e.requestId), (s = he.get(e.requestId)) == null || s.resolve(), he.delete(e.requestId), ke.delete(e.requestId), (i = ui.notifications) == null || i.warn(`Travel cancelled: ${e.reason || `${e.voterName || "A participant"} declined.`}`));
}
function an(e) {
  const t = Oe.get(e);
  t && t.close(), (W == null ? void 0 : W.mapId) === e && W.close();
}
function Ee(e, t = {}) {
  var c;
  const s = re(e);
  if (!s)
    return B(`Map "${e}" was not found.`), null;
  const i = t.playerMode ?? !((c = game.user) != null && c.isGM);
  if (i && s.visibility !== "players" && !t.broadcast)
    return B("That galaxy map is not visible to players."), null;
  const a = i ? `player:${e}` : e, n = i && (W == null ? void 0 : W.mapId) === e ? W : Oe.get(a);
  if (n != null && n.rendered)
    return n.bringToFront(), n;
  const r = new mn({ mapId: e, playerMode: i });
  return i ? W = r : Oe.set(a, r), r.render({ force: !0 }), r;
}
async function rn(e, t, s = {}) {
  var a;
  if (!e || !t) return !1;
  const i = Ee(e, {
    playerMode: s.playerMode ?? !((a = game.user) != null && a.isGM),
    broadcast: s.broadcast === !0
  });
  return i != null && i.focusSystem ? i.focusSystem(t, s) : !1;
}
async function on(e, t = {}, s = {}) {
  var r, c;
  const i = String(t.systemId || ""), a = String(t.objectId || "");
  if (!e || !i) return !1;
  const n = Ee(e, { playerMode: s.playerMode ?? !((r = game.user) != null && r.isGM), broadcast: s.broadcast === !0 });
  return n ? a && n.focusLocation ? n.focusLocation(i, a, s) : (c = n.focusSystem) == null ? void 0 : c.call(n, i, s) : !1;
}
function cn(e, t = "") {
  var i;
  let s = !1;
  for (const a of Ot(e))
    s = ((i = a.clearSystemFocus) == null ? void 0 : i.call(a, t)) || s;
  return s;
}
function $t() {
  return H("open the map manager") ? (we || (we = new dn()), we.render({ force: !0 }), we) : null;
}
function Ft() {
  const e = Bs();
  return e.length ? e.length === 1 ? Ee(e[0].id, { playerMode: !0 }) : (Re || (Re = new un()), Re.render({ force: !0 }), Re) : (ae("No galaxy map is currently visible to players."), null);
}
function Bs() {
  return Ne().filter((e) => e.visibility === "players").sort((e, t) => e.title.localeCompare(t.title));
}
function ln() {
  var t;
  const e = Ne().sort((s, i) => s.title.localeCompare(i.title));
  return (t = game.user) != null && t.isGM ? e.length === 1 ? Ee(e[0].id) : $t() : Ft();
}
function zs(e) {
  if (H("broadcast galaxy maps")) {
    if (!re(e)) {
      B(`Map "${e}" was not found.`);
      return;
    }
    game.socket.emit(G, { action: "open", mapId: e }), ae("Map broadcast sent to players.");
  }
}
const dn = pi({
  templateRoot: Le,
  getMaps: Ne,
  prepareMapForManager: Di,
  getRawMap: re,
  exportMap: jt,
  duplicateMap: bs,
  deleteMap: Is,
  createMap: gs,
  deleteSystem: Lt,
  deleteObject: xt,
  deleteRoute: kt,
  deleteFaction: Pt,
  openMap: Ee,
  showMapToPlayers: zs,
  hideSystemFromPlayers: qt,
  hideRouteFromPlayers: Ct,
  hideFactionFromPlayers: Ps,
  clearManagerApp: (e) => {
    we === e && (we = null);
  }
}), un = Ei({
  templateRoot: Le,
  getVisibleMaps: Bs,
  openMap: Ee,
  clearChooser: (e) => {
    Re === e && (Re = null);
  }
}), mn = Ti({
  templateRoot: Le,
  getRawMap: re,
  prepareMapForDisplay: Oi,
  upsertSystem: ws,
  upsertObject: Mt,
  upsertRoute: Es,
  upsertFaction: ks,
  updateMapMetadata: Ss,
  deleteFaction: Pt,
  getTextureGuideMarkup: Ni,
  activateObjectEditorControls: ki,
  revealSystemToPlayers: Cs,
  revealRouteToPlayers: js,
  hideSystemFromPlayers: qt,
  setObjectVisibility: Ts,
  hideRouteFromPlayers: Ct,
  deleteSystem: Lt,
  deleteObject: xt,
  deleteRoute: kt,
  setCurrentSystem: Tt,
  setCurrentObject: Et,
  requestTravelToSystem: Rs,
  requestTravelToObject: $s,
  exportMap: jt,
  getTravelRoute: nt,
  broadcastTravelAnimation: Qi,
  broadcastObjectTravelAnimation: en,
  notifyInfo: ae,
  notifyError: B,
  saveSystemPosition: qs,
  saveObjectPosition: Ls,
  savePlanetLocation: Ms,
  removePlanetLocation: _s,
  unlinkPlanetScene: xs,
  clearMapView: (e) => {
    e.playerMode && W === e && (W = null);
    for (const [t, s] of Oe.entries())
      s === e && Oe.delete(t);
  }
});
function fn() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: de,
    title: "Galaxy Map",
    icon: "fa-solid fa-route",
    premium: !1,
    description: "Open cinematic campaign maps and navigation charts.",
    open: () => {
      var s;
      return (s = game.user) != null && s.isGM ? $t() : Ft();
    }
  }), !0) : !1;
}
Hooks.once("init", async () => {
  game.settings.register(de, bt, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(de, et, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(de, mt, {
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  }), Handlebars.registerHelper("gmfEq", (e, t) => e === t), Handlebars.registerHelper("gmfJson", (e) => JSON.stringify(e, null, 2)), Handlebars.registerHelper("gmfPercent", (e) => `${Number(e).toFixed(3)}%`), Handlebars.registerHelper("gmfFallback", (e, t) => e || t), Hooks.on("renderDialog", (e, t) => {
    var a, n;
    const s = fs(t), i = ((a = s == null ? void 0 : s.closest) == null ? void 0 : a.call(s, ".window-app, .application, .app")) ?? s;
    (n = i == null ? void 0 : i.classList) != null && n.contains("galaxy-map") && di(e, t);
  }), await loadTemplates([
    `${Le}/map-manager.hbs`,
    `${Le}/galaxy-map.hbs`,
    `${Le}/celestial-icon.hbs`,
    `${Le}/object-appearance-panel.hbs`,
    `${Le}/system-details.hbs`,
    `${Le}/player-map-chooser.hbs`
  ]);
});
Hooks.once("ready", async () => {
  game.galaxyMap = {
    openMap: Ee,
    focusSystem: rn,
    focusLocation: on,
    clearSystemFocus: cn,
    openMapManager: $t,
    openGalaxyMapFromSceneControls: ln,
    openPlayerMapChooser: Ft,
    createMap: gs,
    getMaps: Ne,
    getSystem: Bi,
    getObject: zi,
    getSceneIdsForSystem: Gi,
    getSystemsForScene: Ui,
    getSceneIdsForObject: Hi,
    getObjectsForScene: Vi,
    showMapToPlayers: zs,
    updateMap: vs,
    updateMapMetadata: Ss,
    deleteMap: Is,
    duplicateMap: bs,
    upsertSystem: ws,
    deleteSystem: Lt,
    upsertObject: Mt,
    deleteObject: xt,
    moveObject: Ai,
    setPrimaryObject: Ri,
    upsertRoute: Es,
    deleteRoute: kt,
    upsertFaction: ks,
    deleteFaction: Pt,
    saveSystemPosition: qs,
    saveObjectPosition: Ls,
    savePlanetLocation: Ms,
    removePlanetLocation: _s,
    unlinkPlanetScene: xs,
    setCurrentSystem: Tt,
    setCurrentObject: Et,
    revealSystemToPlayers: Cs,
    revealRouteToPlayers: js,
    hideSystemFromPlayers: qt,
    setObjectVisibility: Ts,
    hideRouteFromPlayers: Ct,
    hideFactionFromPlayers: Ps,
    requestTravelToSystem: Rs,
    requestTravelToObject: $s,
    importMapData: Fi,
    exportMap: jt
  };
  const e = game.modules.get(de);
  if (e && (e.api = game.galaxyMap), fn(), wt()) {
    const t = U();
    if (Object.values(t).some((i) => Number((i == null ? void 0 : i.schemaVersion) || 1) < Te)) {
      const i = X(game.settings.get(de, et) ?? {});
      Object.keys(i).length || await game.settings.set(de, et, t);
      const a = Object.fromEntries(Object.entries(t).map(([n, r]) => [n, T(r)]));
      await J(a), ae('Your galaxy maps were updated to the new format. Everything from the old single map is now inside a system called "System 1", and a backup of the old data was kept.');
    }
    if (!game.settings.get(de, mt)) {
      const i = X(game.settings.get(de, et) ?? {}), a = U();
      let n = 0;
      for (const [r, c] of Object.entries(i)) {
        if (!a[r]) continue;
        const p = T(a[r]);
        for (const y of (c == null ? void 0 : c.systems) ?? []) {
          const v = as(y == null ? void 0 : y.planetLocations);
          if (!v.length) continue;
          const S = p.systems.flatMap((b) => b.objects).find((b) => b.id === y.id || b.id === `${y.id}-object`);
          !S || S.planetLocations.length || (S.planetLocations = v.filter((b) => S.sceneIds.includes(b.sceneId)), n += S.planetLocations.length);
        }
        a[r] = T(p);
      }
      n && (await J(a), ae(`Restored ${n} surface location${n === 1 ? "" : "s"} that went missing in an earlier update.`)), await game.settings.set(de, mt, !0);
    }
  }
  game.socket.on(G, (t = {}) => {
    var s, i, a, n, r;
    if (t.action === "travel-request") {
      const c = Ki(t);
      c && (game.socket.emit(G, c), Wt(c));
      return;
    }
    if (t.action === "travel-ballot") {
      at(t) && t.coordinatorId !== ((s = game.user) == null ? void 0 : s.id) && Wt(t);
      return;
    }
    if (t.action === "travel-vote") {
      Ds(t);
      return;
    }
    if (t.action === "travel-progress") {
      Zi(t);
      return;
    }
    if (t.action === "travel-approved") {
      sn(t);
      return;
    }
    if (t.action === "travel-declined") {
      nn(t);
      return;
    }
    if (t.action === "travel-animation") {
      t.coordinatorId !== ((i = game.user) == null ? void 0 : i.id) && Rt(t);
      return;
    }
    if (t.action === "planet-locations") {
      _t(t.mapId, t.systemId, t.objectId);
      return;
    }
    if (t.action === "refresh") {
      (a = game.user) != null && a.isGM ? te(t.mapId) : (W == null ? void 0 : W.mapId) === t.mapId && W.render({ force: !0 });
      return;
    }
    (n = game.user) != null && n.isGM || (t.action === "open" && t.mapId && (W == null || W.close(), Ee(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "notify" && ((r = ui.notifications) == null || r.info(t.message || "New system discovered."), (W == null ? void 0 : W.mapId) === t.mapId && W.render({ force: !0 })));
  }), console.log(`${de} | Ready. API available at game.galaxyMap.`);
});
