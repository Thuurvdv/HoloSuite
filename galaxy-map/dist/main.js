var ns = Object.defineProperty;
var ss = (n, u, f) => u in n ? ns(n, u, { enumerable: !0, configurable: !0, writable: !0, value: f }) : n[u] = f;
var Z = (n, u, f) => ss(n, typeof u != "symbol" ? u + "" : u, f);
const Lt = [
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
], vn = [
  ...Lt,
  { value: "color", label: "Flat color" },
  { value: "custom", label: "Custom texture" },
  { value: "none", label: "No detail view" }
], is = [
  { value: "sphere", label: "Sphere" },
  { value: "cube", label: "Cube" },
  { value: "donut", label: "Donut" },
  { value: "asteroid", label: "Asteroid" },
  { value: "crystal", label: "Crystal" },
  { value: "cylinder", label: "Cylinder" }
], as = [
  { value: "smooth", label: "Smooth" },
  { value: "matte", label: "Matte" },
  { value: "holographic", label: "Holographic" }
];
function Ot(n) {
  return is.some((u) => u.value === n) ? String(n) : "sphere";
}
function Sn(n) {
  return as.some((u) => u.value === n) ? String(n) : "smooth";
}
function Jt(n) {
  return n === "auto" ? "ice" : vn.some((u) => u.value === n) ? String(n) : "ice";
}
const bn = /* @__PURE__ */ new Set(["color", "custom", "none"]), un = {
  sphere: Lt.map((n) => n.value).filter((n) => !["prison", "anomaly", "cube", "donut-planet"].includes(n)),
  cube: ["cube"],
  donut: ["donut-planet"],
  asteroid: ["asteroid"],
  crystal: ["anomaly"],
  cylinder: ["prison"]
};
function In(n) {
  const u = new Set(un[Ot(n)] ?? un.sphere);
  return vn.filter((f) => u.has(f.value) || bn.has(f.value));
}
function wn(n, u) {
  var E;
  const f = Jt(n), v = In(u);
  return v.some((S) => S.value === f) ? f : ((E = v.find((S) => !bn.has(S.value))) == null ? void 0 : E.value) ?? "color";
}
function rs(n) {
  return n === "black-hole";
}
function et(n, u = "") {
  if (!n || n.obscured || n.planetPreset === "none") return null;
  const f = Jt(n.planetPreset), v = Lt.find((w) => w.value === u) ?? Lt.find((w) => w.value === f) ?? Lt[0], E = !u && f === "custom" && !!n.planetTexture, S = !u && f === "color";
  return {
    texture: S ? null : E ? n.planetTexture : `modules/galaxy-map/assets/planets/${v.texture}`,
    label: S ? "Flat color" : E ? "Custom texture" : v.label,
    preset: S ? "color" : E ? "custom" : v.value,
    color: S ? n.planetColor || "#58d8ff" : v.color,
    shape: Ot(n.planetShape),
    finish: Sn(n.planetFinish)
  };
}
const Yt = [
  { value: "gm", label: "GM approval" },
  { value: "majority", label: "Majority vote" },
  { value: "unanimous", label: "Unanimous agreement" }
];
function Zt(n) {
  return Yt.some((u) => u.value === n) ? String(n) : "unanimous";
}
function Bt(n, u, f, v) {
  const E = Zt(v), S = [...new Map((n ?? []).filter((M) => M == null ? void 0 : M.id).map((M) => [String(M.id), M])).values()], w = E === "gm" ? f != null && f.id ? [f] : [] : S.filter((M) => String(M.id) !== String(u)), I = w.map((M) => String(M.id)), L = Object.fromEntries(w.map((M) => [String(M.id), String(M.name || "Navigator").slice(0, 80)])), x = I.length + (E === "gm" ? 0 : 1), _ = E === "gm" ? 1 : E === "majority" ? Math.floor(x / 2) + 1 : x;
  return { approvalMode: E, voterIds: I, voterNames: L, participantCount: x, requiredApprovals: _ };
}
function mn(n) {
  const u = Zt(n == null ? void 0 : n.approvalMode), f = [...new Set(((n == null ? void 0 : n.voterIds) ?? []).map(String))], v = new Set([...(n == null ? void 0 : n.accepted) ?? []].map(String)), E = new Set([...(n == null ? void 0 : n.declined) ?? []].map(String)), S = u === "gm" ? 0 : 1, w = Math.max(1, Number(n == null ? void 0 : n.requiredApprovals) || (u === "unanimous" ? f.length + 1 : 1)), I = S + f.filter((_) => v.has(_)).length, L = f.filter((_) => E.has(_)).length, x = f.filter((_) => !v.has(_) && !E.has(_));
  return I >= w ? { outcome: "approved", acceptedCount: I, declinedCount: L, required: w, pendingIds: x } : u === "unanimous" && L > 0 ? { outcome: "declined", acceptedCount: I, declinedCount: L, required: w, pendingIds: x } : I + x.length < w ? { outcome: "declined", acceptedCount: I, declinedCount: L, required: w, pendingIds: x } : { outcome: "pending", acceptedCount: I, declinedCount: L, required: w, pendingIds: x };
}
const tt = 3, os = ["core", "colony", "frontier", "ruins", "restricted", "unknown"], cs = ["star", "planet", "moon", "station", "asteroid", "anomaly", "black-hole", "other"], Mn = ["undiscovered", "known", "visited", "danger", "locked"], ls = ["safe", "dangerous", "restricted", "smuggler", "unknown"], Wt = ["gm", "players"], Ln = ["inherit", ...Wt], ds = [
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
], En = ds.map((n) => n.value), At = ["planet", "terrestrial", "gas-giant", "ice-world", "volcanic", "artificial", "ringed", "star", "black-hole", "station", "diamond", "void"], zt = 0.2, Ht = 10, xn = 2400, us = 6e4;
function Ye(n = "gmf") {
  return `${n}-${foundry.utils.randomID(10)}`;
}
function Et(n, u = "players") {
  const f = Wt.includes(u) ? u : "players";
  return Wt.includes(n) ? String(n) : f;
}
function ms(n) {
  return Ln.includes(n) ? String(n) : "inherit";
}
function fs(n) {
  return typeof n == "string" && /^#[0-9a-f]{6}$/i.test(n) ? n : "#58d8ff";
}
function Xt(n) {
  return typeof n == "string" && /^#[0-9a-f]{6}$/i.test(n) ? n : "";
}
function ze(n, u = 0) {
  const f = Number(n);
  return Number.isFinite(f) ? f : u;
}
function ps(n) {
  const u = Array.isArray(n) ? n : n ? [n] : [];
  return [...new Set(u.map((f) => String(f).trim()).filter(Boolean))];
}
function pe(n, u, f) {
  return Math.min(f, Math.max(u, n));
}
function fn(n, u) {
  return !Array.isArray(n) || n.length < 3 ? [...u] : n.slice(0, 3).map((f, v) => pe(ze(f, u[v]), -2.5, 2.5));
}
function _n(n = {}) {
  const u = fn(n.normal, [0, 0, 1]), f = Math.hypot(...u) || 1;
  return {
    id: String(n.id || Ye("location")),
    sceneId: String(n.sceneId || "").trim(),
    shape: Ot(n.shape),
    position: fn(n.position, [0, 0, 1]),
    normal: u.map((v) => v / f),
    surfaceVersion: 1
  };
}
function Tn(n) {
  const u = /* @__PURE__ */ new Set();
  return (Array.isArray(n) ? n : []).slice(0, 64).map(_n).filter((f) => {
    const v = `${f.sceneId}:${f.shape}`;
    return !f.sceneId || u.has(v) ? !1 : (u.add(v), !0);
  });
}
function kn(n = {}) {
  return cs.includes(n.kind) ? n.kind : n.type === "station" || n.iconStyle === "station" ? "station" : n.type === "anomaly" ? "anomaly" : n.iconStyle === "star" ? "star" : n.iconStyle === "black-hole" ? "black-hole" : n.planetShape === "asteroid" ? "asteroid" : ["planet", "terrestrial", "gas-giant", "ice-world", "volcanic", "artificial", "ringed"].includes(n.iconStyle) ? "planet" : "other";
}
function jt(n = {}) {
  const u = ps(n.sceneIds === void 0 ? n.sceneId : n.sceneIds), f = String(n.planetTexture || "").trim(), v = Ot(n.planetShape), E = Jt(n.planetPreset), S = wn(E, v), w = f && !["none", "color"].includes(S) ? "custom" : S, I = kn(n);
  return {
    id: String(n.id || Ye("object")),
    name: String(n.name || "Unnamed Object"),
    kind: I,
    x: pe(ze(n.x, 50), 0, 100),
    y: pe(ze(n.y, 50), 0, 100),
    status: Mn.includes(n.status) ? n.status : "known",
    visibility: ms(n.visibility),
    factionId: String(n.factionId || ""),
    description: String(n.description || ""),
    image: String(n.image || ""),
    sceneIds: u,
    planetLocations: Tn(n.planetLocations).filter((x) => u.includes(x.sceneId)),
    journalId: String(n.journalId || ""),
    notes: String(n.notes || "").trim(),
    iconColor: Xt(n.iconColor),
    iconSize: pe(ze(n.iconSize, 28), 18, 56),
    markerImage: String(n.markerImage || "").trim(),
    iconStyle: En.includes(n.iconStyle) ? n.iconStyle : I === "star" ? "star" : I === "station" ? "station" : "planet",
    pulse: n.pulse !== !1,
    planetPreset: w,
    planetShape: v,
    planetFinish: Sn(n.planetFinish),
    planetTexture: f,
    planetColor: Xt(n.planetColor) || "#58d8ff"
  };
}
function qn(n = {}) {
  var I;
  const u = Array.isArray(n.objects) ? n.objects.map(jt) : [], f = new Set(u.map((L) => L.id)), v = (Array.isArray(n.routes) ? n.routes : []).map(Kt).filter((L) => L.fromSystemId !== L.toSystemId && f.has(L.fromSystemId) && f.has(L.toSystemId)), E = u.some((L) => L.id === n.primaryObjectId) ? String(n.primaryObjectId) : ((I = u[0]) == null ? void 0 : I.id) ?? "", S = u.find((L) => L.id === E) ?? jt(n), w = {
    id: String(n.id || Ye("system")),
    name: String(n.name || "Unnamed System"),
    x: pe(ze(n.x, 50), 0, 100),
    y: pe(ze(n.y, 50), 0, 100),
    type: os.includes(n.type) ? n.type : "unknown",
    factionId: String(n.factionId || ""),
    status: Mn.includes(n.status) ? n.status : "known",
    description: String(n.description || ""),
    visibility: Et(n.visibility, "players"),
    notes: String(n.notes || "").trim(),
    backgroundImage: String(n.backgroundImage || "").trim(),
    iconColor: Xt(n.iconColor),
    iconSize: pe(ze(n.iconSize, 30), 18, 56),
    markerImage: String(n.markerImage || "").trim(),
    iconStyle: En.includes(n.iconStyle) ? n.iconStyle : "star",
    pulse: n.pulse !== !1,
    primaryObjectId: E,
    objects: u,
    routes: v
  };
  for (const [L, x] of Object.entries({
    image: S.image,
    sceneIds: [...S.sceneIds],
    planetLocations: [...S.planetLocations],
    journalId: S.journalId,
    planetPreset: S.planetPreset,
    planetShape: S.planetShape,
    planetFinish: S.planetFinish,
    planetTexture: S.planetTexture,
    planetColor: S.planetColor
  })) Object.defineProperty(w, L, { value: x, enumerable: !1, configurable: !0 });
  return w;
}
function Kt(n = {}) {
  return {
    id: String(n.id || Ye("route")),
    fromSystemId: String(n.fromSystemId || ""),
    toSystemId: String(n.toSystemId || ""),
    type: ls.includes(n.type) ? n.type : "unknown",
    travelTime: String(n.travelTime || ""),
    fuelCost: ze(n.fuelCost, 0),
    visibility: Et(n.visibility, "players"),
    notes: String(n.notes || "")
  };
}
function Pn(n = {}) {
  return {
    id: String(n.id || Ye("faction")),
    name: String(n.name || "Unaffiliated"),
    color: fs(n.color),
    description: String(n.description || ""),
    visibility: Et(n.visibility, "players")
  };
}
function Qt(n = {}) {
  return `${String(n.id || "galaxy")}-system-1`;
}
function hs(n = {}) {
  const u = String(n.id || n.objectId || Ye("object")), f = kn(n);
  return {
    ...n,
    id: u,
    name: String(n.name || "Unnamed Entity"),
    kind: f,
    x: n.x,
    y: n.y,
    visibility: n.visibility,
    iconColor: n.iconColor,
    iconSize: n.iconSize,
    iconStyle: n.iconStyle === "planet" && f !== "planet" ? f === "station" ? "station" : f === "star" ? "star" : "diamond" : n.iconStyle,
    pulse: n.pulse
  };
}
function Cn(n, u, f = "", v = Qt(n), E = []) {
  var w;
  const S = u.some((I) => I.id === f) ? f : ((w = u[0]) == null ? void 0 : w.id) ?? "";
  return {
    id: v,
    name: "System 1",
    x: 50,
    y: 50,
    type: "core",
    factionId: "",
    status: "known",
    description: "",
    visibility: Et(n.visibility, "players"),
    notes: "",
    iconColor: "",
    iconSize: 30,
    iconStyle: "star",
    pulse: !0,
    primaryObjectId: S,
    objects: u,
    routes: E
  };
}
function ys(n, u) {
  var w;
  const v = (Array.isArray(n.systems) ? n.systems : []).map(hs), E = String(n.currentSystemId || ((w = v[0]) == null ? void 0 : w.id) || ""), S = Cn(n, v, E, Qt(n), Array.isArray(n.routes) ? n.routes : []);
  return {
    ...n,
    schemaVersion: tt,
    migratedFromSchema: u,
    systems: [S],
    routes: [],
    currentLocation: { systemId: S.id, objectId: S.primaryObjectId },
    currentSystemId: S.id
  };
}
function pn(n) {
  return !!(n != null && n.id && (n == null ? void 0 : n.primaryObjectId) === `${n.id}-object` && Array.isArray(n.objects) && n.objects.some((u) => u.id === n.primaryObjectId));
}
function gs(n) {
  var qe, Q, J, F;
  const u = Array.isArray(n.systems) ? n.systems : [], f = u.filter(pn), v = u.filter(($) => !pn($));
  if (!f.length && u.length) return { ...n, schemaVersion: tt };
  const E = new Set(v.map(($) => String($.id)));
  let S = Qt(n);
  E.has(S) && (S = `${S}-legacy`);
  const w = new Set(f.map(($) => String($.id))), I = new Map(f.map(($) => [String($.id), String($.primaryObjectId)])), L = f.flatMap(($) => ($.objects ?? []).map((W) => {
    const Le = W.id === $.primaryObjectId;
    return {
      ...W,
      x: Le ? $.x : W.x,
      y: Le ? $.y : W.y,
      visibility: W.visibility === "inherit" ? $.visibility : W.visibility,
      factionId: W.factionId || $.factionId || ""
    };
  })), x = String(((qe = n.currentLocation) == null ? void 0 : qe.systemId) || n.currentSystemId || ""), _ = f.find(($) => $.id === x), M = String(((Q = n.currentLocation) == null ? void 0 : Q.objectId) || (_ == null ? void 0 : _.primaryObjectId) || ((J = L[0]) == null ? void 0 : J.id) || ""), G = Array.isArray(n.routes) ? n.routes : [], ue = G.filter(($) => w.has(String($.fromSystemId)) && w.has(String($.toSystemId))).map(($) => ({ ...$, fromSystemId: I.get(String($.fromSystemId)), toSystemId: I.get(String($.toSystemId)) })), le = Cn(n, L, M, S, ue), he = [le, ...v], V = new Set(he.map(($) => String($.id))), Y = /* @__PURE__ */ new Set(), De = G.filter(($) => !(w.has(String($.fromSystemId)) && w.has(String($.toSystemId)))).map(($) => ({
    ...$,
    fromSystemId: w.has(String($.fromSystemId)) ? S : $.fromSystemId,
    toSystemId: w.has(String($.toSystemId)) ? S : $.toSystemId
  })).filter(($) => {
    if ($.fromSystemId === $.toSystemId || !V.has(String($.fromSystemId)) || !V.has(String($.toSystemId))) return !1;
    const W = [$.fromSystemId, $.toSystemId].sort().join(":");
    return Y.has(W) ? !1 : (Y.add(W), !0);
  }), ie = w.has(x) || !V.has(x) ? S : x;
  return {
    ...n,
    schemaVersion: tt,
    migratedFromSchema: 2,
    systems: he,
    routes: De,
    currentLocation: { systemId: ie, objectId: ie === S ? le.primaryObjectId : ((F = n.currentLocation) == null ? void 0 : F.objectId) ?? "" },
    currentSystemId: ie
  };
}
function vs(n = {}) {
  const u = Number(n.schemaVersion) || 1;
  if (u > tt) throw new Error(`Galaxy Map schema ${u} is newer than supported schema ${tt}.`);
  return u >= tt ? { ...n, schemaVersion: tt } : u < 2 ? ys(n, u) : gs(n);
}
function O(n = {}) {
  var _, M, G, ue;
  const u = vs(n), f = Array.isArray(u.systems) ? u.systems.map(qn) : [], v = Array.isArray(u.routes) ? u.routes.map(Kt) : [], E = Array.isArray(u.factions) ? u.factions.map(Pn) : [], S = String(((_ = u.currentLocation) == null ? void 0 : _.systemId) || u.currentSystemId || ((M = f[0]) == null ? void 0 : M.id) || ""), w = f.some((le) => le.id === S) ? S : ((G = f[0]) == null ? void 0 : G.id) ?? "", I = f.find((le) => le.id === w), L = String(((ue = u.currentLocation) == null ? void 0 : ue.objectId) || ""), x = I != null && I.objects.some((le) => le.id === L) ? L : (I == null ? void 0 : I.primaryObjectId) ?? "";
  return {
    schemaVersion: tt,
    id: String(u.id || Ye("map")),
    title: String(u.title || "Untitled Galaxy Map"),
    subtitle: String(u.subtitle || ""),
    description: String(u.description || ""),
    backgroundImage: String(u.backgroundImage || ""),
    visibility: Et(u.visibility, "players"),
    travelApprovalMode: Zt(u.travelApprovalMode),
    currentLocation: { systemId: w, objectId: x },
    currentSystemId: w,
    systems: f,
    routes: v,
    factions: E
  };
}
function ht(n, u) {
  return (u == null ? void 0 : u.visibility) === "inherit" ? (n == null ? void 0 : n.visibility) ?? "gm" : (u == null ? void 0 : u.visibility) ?? "gm";
}
const Ss = "/modules/galaxy-map/assets/frames/galaxy-frame-cyan.svg";
let hn = null;
const yn = /* @__PURE__ */ new Map();
let qt = null;
const Pt = {
  default: { primary: "#69e8ff", success: "#62ffb6", background: "#03070b" },
  ember: { primary: "#ffb86b", success: "#ffe08a", background: "#0d0604" },
  violet: { primary: "#a9b8ff", success: "#7dffc4", background: "#070713" },
  "space-police": { primary: "#fff15a", success: "#9fffd1", background: "#020202" },
  red: { primary: "#ff304f", success: "#66ffc7", background: "#050103" },
  corporate: { primary: "#147dba", success: "#21875c", background: "#dce3e6" }
};
function gn(n, u, f) {
  const v = (w) => [1, 3, 5].map((I) => Number.parseInt(w.slice(I, I + 2), 16)), E = v(n), S = v(u);
  return `rgb(${E.map((w, I) => Math.round(w * f + S[I] * (1 - f))).join(", ")})`;
}
function bs() {
  var v, E, S, w, I, L;
  const n = document.documentElement, u = ((v = n == null ? void 0 : n.dataset) == null ? void 0 : v.holosuiteDeviceStyle) || ((S = (E = document.body) == null ? void 0 : E.dataset) == null ? void 0 : S.holosuiteDeviceStyle) || "";
  if (Pt[u]) return Pt[u];
  const f = ((w = n == null ? void 0 : n.dataset) == null ? void 0 : w.holosuiteTheme) || ((L = (I = document.body) == null ? void 0 : I.dataset) == null ? void 0 : L.holosuiteTheme) || "default";
  return Pt[f] ?? Pt.default;
}
async function An(n) {
  const { primary: u, success: f, background: v } = bs(), E = gn(u, v, 0.58), S = gn(u, v, 0.34), w = [u, f, E, S, v].join("|");
  n.dataset.gmfFramePalette = w;
  let I = yn.get(w);
  if (!I)
    try {
      hn ?? (hn = fetch(Ss).then((_) => {
        if (!_.ok) throw new Error(`Galaxy frame request failed (${_.status})`);
        return _.text();
      }));
      let L = await hn;
      L = L.replace(/<script\b[\s\S]*?<\/script>/gi, "");
      const x = /* @__PURE__ */ new Map([
        ["#18ebed", u],
        ["#28f3f5", u],
        ["#3be8e4", u],
        ["#64f4f1", f],
        ["#1490ab", E],
        ["#22788b", S],
        ["#042228", v]
      ]);
      for (const [_, M] of x) L = L.replace(new RegExp(_, "gi"), M);
      I = URL.createObjectURL(new Blob([L], { type: "image/svg+xml" })), yn.set(w, I);
    } catch {
      return;
    }
  n.isConnected && n.dataset.gmfFramePalette === w && n.style.setProperty("--gmf-frame-image", `url("${I}")`);
}
function Is() {
  if (qt || typeof MutationObserver > "u") return;
  qt = new MutationObserver(() => {
    document.querySelectorAll(".gmf-manager-window, .gmf-map-window, .gmf-crud-dialog").forEach((u) => void An(u));
  });
  const n = { attributes: !0, attributeFilter: ["data-holosuite-theme", "data-holosuite-device-style"] };
  qt.observe(document.documentElement, n), document.body && qt.observe(document.body, n);
}
function jn(n) {
  return n instanceof HTMLElement ? n : (n == null ? void 0 : n[0]) instanceof HTMLElement ? n[0] : null;
}
function On(n) {
  var u, f;
  return n ? (u = n.matches) != null && u.call(n, ".window-app, .application, .app") ? n : (f = n.closest) == null ? void 0 : f.call(n, ".window-app, .application, .app") : null;
}
function Rt(n, u) {
  var S, w;
  const f = jn(u), v = On(f);
  v && (Is(), An(v));
  const E = Array.from(((S = f == null ? void 0 : f.querySelectorAll) == null ? void 0 : S.call(f, "[data-gmf-window-drag]")) ?? []);
  if (!(!f || !v || !E.length)) {
    (w = f.querySelectorAll) == null || w.call(f, "[data-action='close-window']").forEach((I) => {
      I.dataset.gmfCloseBound !== "true" && (I.dataset.gmfCloseBound = "true", I.addEventListener("click", () => {
        var L;
        return (L = n.close) == null ? void 0 : L.call(n);
      }));
    });
    for (const I of E)
      I.dataset.gmfDragBound !== "true" && (I.dataset.gmfDragBound = "true", I.addEventListener("pointerdown", (L) => {
        var Y, De, ie;
        if (L.button !== 0) return;
        const x = L.target;
        if ((Y = x == null ? void 0 : x.closest) != null && Y.call(x, "button, input, select, textarea, a, [data-action]")) return;
        const _ = v.getBoundingClientRect(), M = L.clientX, G = L.clientY, ue = _.left, le = _.top;
        (De = n.bringToTop) == null || De.call(n), (ie = I.setPointerCapture) == null || ie.call(I, L.pointerId), I.classList.add("is-dragging");
        const he = (qe) => {
          var W;
          const Q = v.getBoundingClientRect().width, J = v.getBoundingClientRect().height, F = Math.max(0, Math.min(window.innerWidth - Math.min(Q, 80), ue + qe.clientX - M)), $ = Math.max(0, Math.min(window.innerHeight - Math.min(J, 48), le + qe.clientY - G));
          (W = n.setPosition) == null || W.call(n, { left: F, top: $ });
        }, V = () => {
          I.classList.remove("is-dragging"), I.removeEventListener("pointermove", he), I.removeEventListener("pointerup", V), I.removeEventListener("pointercancel", V);
        };
        I.addEventListener("pointermove", he), I.addEventListener("pointerup", V), I.addEventListener("pointercancel", V);
      }));
  }
}
function ws(n, u) {
  var x, _;
  const f = jn(u), v = On(f), E = (x = v == null ? void 0 : v.querySelector) == null ? void 0 : x.call(v, ":scope > .window-content");
  if (!f || !v || !E || E.querySelector(":scope > .gmf-dialog-header")) return;
  const S = document.createElement("header");
  S.className = "gmf-dialog-header", S.dataset.gmfWindowDrag = "true";
  const w = document.createElement("div");
  w.className = "gmf-dialog-header__identity", w.innerHTML = '<span class="gmf-dialog-header__orb"><i class="fa-solid fa-satellite"></i></span><span><small>GALAXY MAP // CONTROL PANEL</small><strong></strong></span>';
  const I = w.querySelector("strong");
  I && (I.textContent = (n == null ? void 0 : n.title) || ((_ = v.querySelector(".window-title")) == null ? void 0 : _.textContent) || "Galaxy Map");
  const L = document.createElement("button");
  L.type = "button", L.className = "gmf-window-close", L.dataset.action = "close-window", L.title = "Close", L.setAttribute("aria-label", "Close window"), L.innerHTML = '<i class="fa-solid fa-xmark"></i>', S.append(w, L), E.prepend(S), Rt(n, v);
}
const yt = {
  classes: ["galaxy-map", "gmf-crud-dialog"]
};
function Ms() {
  var f, v, E, S;
  const n = (v = (f = foundry.applications) == null ? void 0 : f.api) == null ? void 0 : v.ApplicationV2, u = (S = (E = foundry.applications) == null ? void 0 : E.api) == null ? void 0 : S.HandlebarsApplicationMixin;
  return n && u ? u(n) : Application;
}
function Ls(n) {
  var ie;
  const {
    templateRoot: u,
    getMaps: f,
    prepareMapForManager: v,
    getRawMap: E,
    exportMap: S,
    duplicateMap: w,
    deleteMap: I,
    createMap: L,
    deleteSystem: x,
    deleteObject: _,
    deleteRoute: M,
    deleteFaction: G,
    openMap: ue,
    showMapToPlayers: le,
    hideSystemFromPlayers: he,
    hideRouteFromPlayers: V,
    hideFactionFromPlayers: Y,
    clearManagerApp: De
  } = n;
  return ie = class extends Ms() {
    constructor(J = {}) {
      super(J);
      Z(this, "selectedMapId");
      Z(this, "activeTab");
      Z(this, "expandedSystemId");
      this.selectedMapId = J.selectedMapId ?? null, this.activeTab = ["systems", "routes", "factions"].includes(J.activeTab) ? J.activeTab : "systems", this.expandedSystemId = J.expandedSystemId;
    }
    async _prepareContext(J) {
      var Le, Pe, ye;
      const F = await ((Le = super._prepareContext) == null ? void 0 : Le.call(this, J)) ?? {}, $ = f().sort((re, Ie) => re.title.localeCompare(Ie.title));
      (!this.selectedMapId || !$.some((re) => re.id === this.selectedMapId)) && (this.selectedMapId = ((Pe = $[0]) == null ? void 0 : Pe.id) ?? null);
      const W = this.selectedMapId ? v(E(this.selectedMapId)) : null;
      if (W) {
        const re = new Set(W.systems.map((Ie) => Ie.id));
        this.expandedSystemId && !re.has(this.expandedSystemId) && (this.expandedSystemId = void 0), this.expandedSystemId === void 0 && (this.expandedSystemId = ((ye = W.systems[0]) == null ? void 0 : ye.id) ?? null), W.systems = W.systems.map((Ie) => ({
          ...Ie,
          isExpanded: Ie.id === this.expandedSystemId
        }));
      }
      return {
        ...F,
        maps: $,
        selectedMap: W,
        selectedMapId: this.selectedMapId,
        activeTab: this.activeTab,
        showSystems: this.activeTab === "systems",
        showRoutes: this.activeTab === "routes",
        showFactions: this.activeTab === "factions",
        hasMaps: $.length > 0
      };
    }
    _attachPartListeners(J, F, $) {
      var W, Le, Pe, ye, re, Ie, He;
      (W = super._attachPartListeners) == null || W.call(this, J, F, $), Rt(this, F), (Le = F.querySelector("[data-action='create-map']")) == null || Le.addEventListener("click", () => this._onCreateMap()), (Pe = F.querySelector("[data-action='edit-map-metadata']")) == null || Pe.addEventListener("click", () => {
        this._openViewportEditor("map");
      }), (ye = F.querySelector("[data-action='create-system']")) == null || ye.addEventListener("click", () => {
        this._openViewportEditor("system");
      }), (re = F.querySelector("[data-action='create-route']")) == null || re.addEventListener("click", () => {
        this._openViewportEditor("route");
      }), (Ie = F.querySelector("[data-action='create-faction']")) == null || Ie.addEventListener("click", () => {
        this._openViewportEditor("faction");
      }), F.querySelectorAll("[data-manager-tab]").forEach((A) => {
        A.addEventListener("click", () => {
          const be = A.dataset.managerTab;
          !["systems", "routes", "factions"].includes(be) || be === this.activeTab || (this.activeTab = be, this.render({ force: !0 }));
        });
      }), F.querySelectorAll("[data-toggle-system]").forEach((A) => {
        A.addEventListener("click", () => {
          const be = A.dataset.toggleSystem;
          this.expandedSystemId = this.expandedSystemId === be ? null : be, this.render({ force: !0 });
        });
      }), F.querySelectorAll("[data-edit-system]").forEach((A) => {
        A.addEventListener("click", () => this._openViewportEditor("system", { id: A.dataset.editSystem }));
      }), F.querySelectorAll("[data-create-object]").forEach((A) => {
        A.addEventListener("click", () => this._openViewportEditor("entity", { systemId: A.dataset.createObject }));
      }), F.querySelectorAll("[data-edit-object]").forEach((A) => {
        A.addEventListener("click", () => this._openViewportEditor("entity", { systemId: A.dataset.objectSystem, id: A.dataset.editObject }));
      }), F.querySelectorAll("[data-delete-object]").forEach((A) => {
        A.addEventListener("click", () => this._confirmDeleteObject(A.dataset.objectSystem, A.dataset.deleteObject));
      }), F.querySelectorAll("[data-show-system]").forEach((A) => {
        A.addEventListener("click", () => he(this.selectedMapId, A.dataset.showSystem, !1));
      }), F.querySelectorAll("[data-hide-system]").forEach((A) => {
        A.addEventListener("click", () => he(this.selectedMapId, A.dataset.hideSystem, !0));
      }), F.querySelectorAll("[data-delete-system]").forEach((A) => {
        A.addEventListener("click", () => this._confirmDeleteSystem(A.dataset.deleteSystem));
      }), F.querySelectorAll("[data-edit-route]").forEach((A) => {
        A.addEventListener("click", () => this._openViewportEditor("route", { id: A.dataset.editRoute, systemId: A.dataset.routeSystem }));
      }), F.querySelectorAll("[data-show-route]").forEach((A) => {
        A.addEventListener("click", () => V(this.selectedMapId, A.dataset.showRoute, !1, A.dataset.routeSystem));
      }), F.querySelectorAll("[data-hide-route]").forEach((A) => {
        A.addEventListener("click", () => V(this.selectedMapId, A.dataset.hideRoute, !0, A.dataset.routeSystem));
      }), F.querySelectorAll("[data-delete-route]").forEach((A) => {
        A.addEventListener("click", () => this._confirmDeleteRoute(A.dataset.deleteRoute, A.dataset.routeSystem));
      }), F.querySelectorAll("[data-edit-faction]").forEach((A) => {
        A.addEventListener("click", () => this._openViewportEditor("faction", { id: A.dataset.editFaction }));
      }), F.querySelectorAll("[data-show-faction]").forEach((A) => {
        A.addEventListener("click", () => Y(this.selectedMapId, A.dataset.showFaction, !1));
      }), F.querySelectorAll("[data-hide-faction]").forEach((A) => {
        A.addEventListener("click", () => Y(this.selectedMapId, A.dataset.hideFaction, !0));
      }), F.querySelectorAll("[data-delete-faction]").forEach((A) => {
        A.addEventListener("click", () => this._confirmDeleteFaction(A.dataset.deleteFaction));
      }), (He = F.querySelector("[data-action='export-map']")) == null || He.addEventListener("click", () => {
        this.selectedMapId && S(this.selectedMapId);
      }), F.querySelectorAll("[data-select-map]").forEach((A) => {
        A.addEventListener("click", () => {
          this.selectedMapId = A.dataset.selectMap, this.expandedSystemId = void 0, this.render({ force: !0 });
        });
      }), F.querySelectorAll("[data-open-map]").forEach((A) => {
        A.addEventListener("click", () => ue(A.dataset.openMap));
      }), F.querySelectorAll("[data-show-map]").forEach((A) => {
        A.addEventListener("click", () => le(A.dataset.showMap));
      }), F.querySelectorAll("[data-duplicate-map]").forEach((A) => {
        A.addEventListener("click", async () => {
          const be = await w(A.dataset.duplicateMap);
          be && (this.selectedMapId = be.id, this.render({ force: !0 }));
        });
      }), F.querySelectorAll("[data-delete-map]").forEach((A) => {
        A.addEventListener("click", async () => {
          const be = A.dataset.deleteMap, nt = E(be);
          await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${(nt == null ? void 0 : nt.title) ?? be}</strong>? This cannot be undone.</p>`
          }, yt) && (await I(be), this.selectedMapId === be && (this.selectedMapId = null), this.render({ force: !0 }));
        });
      });
    }
    async _onCreateMap() {
      const J = await L({
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
      J && (this.selectedMapId = J.id, this.render({ force: !0 }));
    }
    _openViewportEditor(J, F = {}) {
      var $, W;
      this.selectedMapId && ((W = ($ = ue(this.selectedMapId)) == null ? void 0 : $.openEditor) == null || W.call($, J, F));
    }
    async _confirmDeleteSystem(J) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, yt) && await x(this.selectedMapId, J);
    }
    async _confirmDeleteObject(J, F) {
      await Dialog.confirm({
        title: "Delete Entity",
        content: "<p>Delete this entity and its linked content from the system?</p>"
      }) && await _(this.selectedMapId, J, F);
    }
    async _confirmDeleteRoute(J, F = "") {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, yt) && await M(this.selectedMapId, J, F);
    }
    async _confirmDeleteFaction(J) {
      await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }, yt) && await G(this.selectedMapId, J);
    }
    async close(J = {}) {
      return De(this), super.close(J);
    }
  }, Z(ie, "DEFAULT_OPTIONS", {
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
  }), Z(ie, "PARTS", {
    main: {
      template: `${u}/map-manager.hbs`
    }
  }), ie;
}
function Es(n, u) {
  const f = (v, E, S) => (E[0] - v[0]) * (S[1] - v[1]) - (E[1] - v[1]) * (S[0] - v[0]);
  return u.flatMap((v) => {
    const E = n.filter((x) => x.factionId === v.id && !x.obscured);
    if (!E.length) return [];
    const S = E.flatMap((x) => Array.from({ length: 12 }, (_, M) => {
      const G = M * Math.PI / 6;
      return [
        Math.max(1, Math.min(99, x.x + Math.cos(G) * 7)),
        Math.max(1, Math.min(99, x.y + Math.sin(G) * 9))
      ];
    })).sort((x, _) => x[0] - _[0] || x[1] - _[1]), w = (x) => {
      const _ = [];
      for (const M of x) {
        for (; _.length > 1 && f(_[_.length - 2], _[_.length - 1], M) <= 0; ) _.pop();
        _.push(M);
      }
      return _.slice(0, -1);
    }, I = [...w(S), ...w([...S].reverse())], L = Math.min(...S.map((x) => x[1]));
    return [{
      id: v.id,
      name: v.name,
      color: v.color,
      points: I.map((x) => x.map((_) => _.toFixed(2)).join(",")).join(" "),
      labelX: (Math.min(...S.map((x) => x[0])) + Math.max(...S.map((x) => x[0]))) / 2,
      labelY: Math.max(3, L + 3)
    }];
  });
}
function Rn() {
  var n, u, f;
  try {
    const v = (u = (n = game.modules) == null ? void 0 : n.get) == null ? void 0 : u.call(n, "bounty-board");
    if ((v == null ? void 0 : v.active) === !1) return null;
    const E = v.api ?? ((f = game.scifiSuite) == null ? void 0 : f.bountyBoard);
    return typeof (E == null ? void 0 : E.getBountiesForScene) == "function" ? E : null;
  } catch {
    return null;
  }
}
function xs(n) {
  const u = Rn();
  if (!u || !Array.isArray(n == null ? void 0 : n.sceneIds)) return [];
  const f = /* @__PURE__ */ new Set(), v = [];
  try {
    for (const E of n.sceneIds)
      for (const S of u.getBountiesForScene(String(E)) ?? []) {
        const w = String((S == null ? void 0 : S.id) ?? "");
        !w || f.has(w) || (f.add(w), v.push({
          id: w,
          name: String(S.name || "Unknown target"),
          image: String(S.image || ""),
          status: String(S.status || ""),
          statusLabel: String(S.statusLabel || S.status || ""),
          reward: String(S.reward || ""),
          sceneId: String(S.sceneId || E)
        }));
      }
  } catch {
    return [];
  }
  return v;
}
function _s(n) {
  try {
    const u = Rn();
    return typeof (u == null ? void 0 : u.openBounty) == "function" && u.openBounty(String(n)) !== !1;
  } catch {
    return !1;
  }
}
const pt = /* @__PURE__ */ new Map(), Ts = 40, ks = 192;
function qs(n) {
  return new Promise((u, f) => {
    const v = new Image();
    v.onload = () => u(v), v.onerror = () => f(new Error("Image unavailable")), v.src = n;
  });
}
async function Ps(n) {
  if (!n) return null;
  try {
    const u = await qs(n), f = Math.min(1, ks / Math.max(u.naturalWidth || u.width, u.naturalHeight || u.height)), v = Math.max(2, Math.round((u.naturalWidth || u.width) * f)), E = Math.max(2, Math.round((u.naturalHeight || u.height) * f)), S = document.createElement("canvas");
    S.width = v, S.height = E;
    const w = S.getContext("2d", { willReadFrequently: !0 });
    if (!w) return null;
    w.drawImage(u, 0, 0, v, E);
    const I = w.getImageData(0, 0, v, E), L = w.createImageData(v, E), x = new Float32Array(v * E);
    for (let M = 0; M < x.length; M++) {
      const G = M * 4;
      x[M] = I.data[G] * 0.299 + I.data[G + 1] * 0.587 + I.data[G + 2] * 0.114;
    }
    const _ = (M, G) => x[G * v + M];
    for (let M = 1; M < E - 1; M++)
      for (let G = 1; G < v - 1; G++) {
        const ue = -_(G - 1, M - 1) + _(G + 1, M - 1) - 2 * _(G - 1, M) + 2 * _(G + 1, M) - _(G - 1, M + 1) + _(G + 1, M + 1), le = -_(G - 1, M - 1) - 2 * _(G, M - 1) - _(G + 1, M - 1) + _(G - 1, M + 1) + 2 * _(G, M + 1) + _(G + 1, M + 1), he = Math.hypot(ue, le), V = Math.max(0, Math.min(235, (he - 34) * 2.1)), Y = (M * v + G) * 4;
        L.data[Y] = 104, L.data[Y + 1] = 241, L.data[Y + 2] = 255, L.data[Y + 3] = V;
      }
    return w.clearRect(0, 0, v, E), w.putImageData(L, 0, 0), S.toDataURL("image/png");
  } catch {
    return null;
  }
}
function Cs(n, u = "") {
  const f = `${u}\0${n}`, v = pt.get(f);
  if (v)
    return pt.delete(f), pt.set(f, v), v;
  for (; pt.size >= Ts; ) {
    const S = pt.keys().next().value;
    if (S === void 0) break;
    pt.delete(S);
  }
  const E = Ps(n);
  return pt.set(f, E), E;
}
function As({ root: n, stage: u, resolveItems: f, onOpen: v }) {
  const E = n.querySelector("[data-intel-layer]");
  if (!E) return null;
  const S = new AbortController(), w = S.signal, I = document.createElement("aside");
  I.className = "gmf-intel-callout", I.setAttribute("aria-label", "Bounty intel"), I.hidden = !0, I.innerHTML = `
    <span class="gmf-intel-callout__connector" aria-hidden="true"></span>
    <div class="gmf-intel-callout__stack" data-intel-list role="group" aria-label="Matching bounties"></div>`, E.append(I);
  let L = [], x = null, _ = null, M = null, G = 0, ue = 0;
  const le = () => {
    _ && clearTimeout(_), _ = null;
  }, he = () => {
    G++, M && clearTimeout(M), M = null, _ = null, x = null, L = [], ue++, I.hidden = !0, I.classList.remove("is-visible", "is-left");
  }, V = (Q = 180) => {
    le(), G++, M && clearTimeout(M), M = null, _ = setTimeout(he, Q);
  }, Y = () => {
    if (!x || I.hidden) return;
    const Q = u.getBoundingClientRect(), J = x.getBoundingClientRect();
    I.style.setProperty("--gmf-intel-stack-height", `${Math.max(80, Q.height - 72)}px`);
    const F = I.offsetWidth || 224, $ = I.offsetHeight || 126, W = J.right - Q.left + F + 24 > Q.width, Le = W ? J.left - Q.left - F - 18 : J.right - Q.left + 18, Pe = Math.max(48, Math.min(Q.height - $ - 12, J.top - Q.top + J.height / 2 - $ / 2));
    I.classList.toggle("is-left", W), I.style.left = `${Math.max(8, Le)}px`, I.style.top = `${Pe}px`;
  }, De = () => {
    const Q = I.querySelector("[data-intel-list]");
    if (!Q || !L.length) return he();
    Q.replaceChildren();
    const J = ++ue;
    L.forEach((F, $) => {
      const W = document.createElement("button");
      W.type = "button", W.className = "gmf-intel-callout__body", W.dataset.intelOpen = F.id, W.style.setProperty("--gmf-intel-index", String($)), W.style.setProperty("--gmf-intel-delay", `${$ * 55}ms`), W.innerHTML = `
        <span class="gmf-intel-callout__portrait"><img alt="" hidden /><i class="fa-solid fa-crosshairs"></i></span>
        <span class="gmf-intel-callout__copy"><small></small><strong></strong><span></span></span>`;
      const Le = W.querySelector("strong"), Pe = W.querySelector("small"), ye = W.querySelector(".gmf-intel-callout__copy > span"), re = W.querySelector("img"), Ie = W.querySelector("i");
      Le && (Le.textContent = F.name), Pe && (Pe.textContent = `BOUNTY // ${(F.statusLabel || "INTEL").toUpperCase()}`), ye && (ye.textContent = F.reward || ""), W.addEventListener("click", () => v(F.id), { signal: w }), F.image && re && (re.src = F.image, re.classList.add("is-css-fallback"), re.hidden = !1, Ie && (Ie.hidden = !0), re.onerror = () => {
        J === ue && (re.hidden = !0, Ie && (Ie.hidden = !1));
      }, Cs(F.image, F.id).then((He) => {
        !He || J !== ue || !W.isConnected || (re.classList.remove("is-css-fallback"), re.src = He);
      })), Q.append(W);
    }), Y();
  }, ie = async (Q) => {
    le(), x = Q;
    const J = ++G;
    let F = [];
    try {
      F = await f(Q.dataset.systemId ?? "");
    } catch {
    }
    if (!(J !== G || x !== Q)) {
      if (!F.length) return he();
      L = F, I.hidden = !1, De(), requestAnimationFrame(() => {
        Y(), I.classList.add("is-visible");
      });
    }
  }, qe = (Q) => {
    le(), G++, M && clearTimeout(M), M = setTimeout(() => {
      M = null, ie(Q);
    }, 90);
  };
  return n.querySelectorAll("[data-system-id]").forEach((Q) => {
    Q.addEventListener("pointerenter", () => qe(Q), { signal: w }), Q.addEventListener("pointerleave", () => V(), { signal: w }), Q.addEventListener("focus", () => qe(Q), { signal: w }), Q.addEventListener("blur", () => V(), { signal: w }), Q.addEventListener("pointerdown", () => he(), { signal: w });
  }), I.addEventListener("pointerenter", le, { signal: w }), I.addEventListener("pointerleave", () => V(), { signal: w }), I.addEventListener("click", (Q) => Q.stopPropagation(), { signal: w }), u.addEventListener("wheel", () => requestAnimationFrame(Y), { signal: w }), window.addEventListener("resize", Y, { signal: w }), {
    dispose() {
      G++, _ && clearTimeout(_), M && clearTimeout(M), S.abort(), I.remove();
    }
  };
}
function js({ host: n }) {
  const u = document.createElement("aside");
  u.className = "gmf-location-callout", u.hidden = !0, u.innerHTML = `
    <span class="gmf-location-callout__connector" aria-hidden="true"></span>
    <strong data-location-name></strong>`, n.append(u);
  let f = null, v = { x: 0, y: 0, visible: !1 }, E = null;
  const S = () => {
    E && clearTimeout(E), E = null;
  }, w = () => {
    S(), f = null, u.hidden = !0, u.classList.remove("is-visible", "is-left");
  }, I = () => {
    if (!f || u.hidden || !v.visible) return;
    const _ = u.offsetWidth || 180, M = u.offsetHeight || 24, G = v.x + _ + 76 > n.clientWidth, ue = G ? v.x - _ - 64 : v.x + 64, le = Math.max(8, Math.min(n.clientHeight - M - 8, v.y - M / 2));
    u.classList.toggle("is-left", G), u.style.left = `${Math.max(8, ue)}px`, u.style.top = `${le}px`;
  }, L = (_) => {
    S(), f = _;
    const M = u.querySelector("[data-location-name]");
    M && (M.textContent = _.missing ? "Missing linked scene" : _.accessible ? _.name : "Restricted location"), u.hidden = !1, I(), requestAnimationFrame(() => {
      I(), u.classList.add("is-visible");
    });
  }, x = (_ = 180) => {
    S(), E = setTimeout(w, _);
  };
  return {
    show: L,
    scheduleHide: x,
    hide: w,
    setAnchor(_) {
      if (v = _, !_.visible) return x(40);
      I();
    },
    dispose() {
      w(), u.remove();
    }
  };
}
function Os(n) {
  return String(n || "galaxy-map").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "galaxy-map";
}
function Rs(n, u) {
  const f = JSON.stringify(u, null, 2), v = globalThis.saveDataToFile;
  if (typeof v == "function") {
    v(f, "application/json", n);
    return;
  }
  const E = new Blob([f], { type: "application/json" }), S = URL.createObjectURL(E), w = document.createElement("a");
  w.href = S, w.download = n, document.body.appendChild(w), w.click(), w.remove(), globalThis.setTimeout(() => URL.revokeObjectURL(S), 0);
}
function Fe(n) {
  const u = document.createElement("div");
  return u.textContent = String(n ?? ""), u.innerHTML;
}
function Gt(n) {
  return (n == null ? void 0 : n[0]) ?? n ?? null;
}
function $s(n) {
  var f, v, E, S, w;
  const u = globalThis.TextEditor ?? ((E = (v = (f = globalThis.foundry) == null ? void 0 : f.applications) == null ? void 0 : v.ux) == null ? void 0 : E.TextEditor);
  try {
    const I = (S = u == null ? void 0 : u.getDragEventData) == null ? void 0 : S.call(u, n);
    if (I && Object.keys(I).length) return I;
  } catch {
  }
  try {
    return JSON.parse(((w = n.dataTransfer) == null ? void 0 : w.getData("text/plain")) || "{}");
  } catch {
    return {};
  }
}
async function $n(n) {
  var S, w, I, L, x, _, M, G;
  const u = $s(n), f = globalThis.fromUuid, v = u.uuid && f ? await f(u.uuid) : null;
  if (["Scene", "JournalEntry"].includes(v == null ? void 0 : v.documentName)) return v;
  const E = String(u.sceneId || u.journalId || u.id || "");
  return E ? u.type === "Scene" ? ((w = (S = game.scenes) == null ? void 0 : S.get) == null ? void 0 : w.call(S, E)) ?? null : ["JournalEntry", "Journal"].includes(u.type) ? ((L = (I = game.journal) == null ? void 0 : I.get) == null ? void 0 : L.call(I, E)) ?? null : ((_ = (x = game.scenes) == null ? void 0 : x.get) == null ? void 0 : _.call(x, E)) ?? ((G = (M = game.journal) == null ? void 0 : M.get) == null ? void 0 : G.call(M, E)) ?? null : null;
}
async function Ns(n) {
  const u = await $n(n);
  return (u == null ? void 0 : u.documentName) === "Scene" ? u : null;
}
function Fs() {
  var f, v, E, S;
  const n = (v = (f = foundry.applications) == null ? void 0 : f.api) == null ? void 0 : v.ApplicationV2, u = (S = (E = foundry.applications) == null ? void 0 : E.api) == null ? void 0 : S.HandlebarsApplicationMixin;
  return n && u ? u(n) : Application;
}
function Ds(n) {
  var st;
  const {
    templateRoot: u,
    getRawMap: f,
    prepareMapForDisplay: v,
    upsertSystem: E,
    upsertObject: S,
    upsertRoute: w,
    upsertFaction: I,
    updateMapMetadata: L,
    deleteFaction: x,
    getTextureGuideMarkup: _,
    activateObjectEditorControls: M,
    revealSystemToPlayers: G,
    revealRouteToPlayers: ue,
    hideSystemFromPlayers: le,
    setObjectVisibility: he,
    hideRouteFromPlayers: V,
    deleteSystem: Y,
    deleteObject: De,
    deleteRoute: ie,
    setCurrentSystem: qe,
    setCurrentObject: Q,
    requestTravelToSystem: J,
    requestTravelToObject: F,
    exportMap: $,
    getTravelRoute: W,
    broadcastTravelAnimation: Le,
    broadcastObjectTravelAnimation: Pe,
    notifyInfo: ye,
    notifyError: re,
    saveSystemPosition: Ie,
    saveObjectPosition: He,
    savePlanetLocation: A,
    removePlanetLocation: be,
    unlinkPlanetScene: nt,
    clearMapView: It
  } = n;
  return st = class extends Fs() {
    constructor(c = {}) {
      var d;
      const i = c.mapId, l = c.playerMode ?? !((d = game.user) != null && d.isGM);
      super({
        ...c,
        id: `galaxy-map-view-${l ? "player" : "gm"}-${i}`
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
      this.mapId = i, this.playerMode = l, this.selectedSystemId = c.selectedSystemId ?? null, this.selectedRouteId = c.selectedRouteId ?? null, this.activeSystemId = c.activeSystemId ?? null, this.selectedObjectId = c.selectedObjectId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null, this.externalFocus = null, this._externalFocusTimeout = null, this._pendingFocusZoom = null;
    }
    get title() {
      const c = f(this.mapId), i = this.playerMode ? "Player View" : "GM View";
      return c ? `${c.title} - ${i}` : `Galaxy Map - ${i}`;
    }
    async _prepareContext(c) {
      var ct, lt, dt, Xe, it, ae, _e, ne, Ae;
      const i = await ((ct = super._prepareContext) == null ? void 0 : ct.call(this, c)) ?? {}, l = f(this.mapId), d = l ? v(l, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      }) : null;
      d != null && d.systems && (d.systems = d.systems.map((T) => ({
        ...T,
        displayType: "system",
        factionName: "System",
        factionColor: "#58d8ff",
        animatedCelestial: !1,
        hasCustomMarker: !!T.displayMarkerImage
      })), d.selectedSystem && (d.selectedSystem = d.systems.find((T) => T.id === d.selectedSystem.id) ?? null)), d != null && d.systems && this.externalFocus && (d.systems = d.systems.map((T) => T.id === this.externalFocus.systemId ? { ...T, isExternalFocus: !0, externalFocus: this.externalFocus } : T), ((lt = d.selectedSystem) == null ? void 0 : lt.id) === this.externalFocus.systemId && (d.selectedSystem = d.systems.find((T) => T.id === this.externalFocus.systemId))), !this.activeSystemId && this.selectedSystemId && !(d != null && d.selectedSystem) && (this.selectedSystemId = null);
      const m = (d == null ? void 0 : d.systems.find((T) => T.id === this.activeSystemId)) ?? null;
      m && (d.backgroundImage = m.backgroundImage || "");
      const h = new Map(((d == null ? void 0 : d.factions) ?? []).map((T) => [T.id, T])), y = m ? m.objects.filter((T) => !this.playerMode || ht(m, T) === "players").map((T) => {
        var xt;
        const ce = this.playerMode && T.status === "undiscovered", ge = h.get(T.factionId), Re = ce ? "" : T.markerImage;
        return {
          ...T,
          systemId: m.id,
          displayName: ce ? "???" : T.name,
          displayDescription: ce ? "Unresolved sensor contact. Details are not available." : T.description,
          displayType: ce ? "unknown" : T.kind,
          displayStatus: ce ? "undiscovered" : T.status,
          factionName: (ge == null ? void 0 : ge.name) ?? "Unaffiliated",
          factionColor: T.iconColor || (ge == null ? void 0 : ge.color) || "#58d8ff",
          displayMarkerImage: Re,
          hasCustomMarker: !!Re,
          obscured: ce,
          gmOnly: ht(m, T) === "gm",
          isSelected: T.id === this.selectedObjectId,
          isCurrent: ((xt = d == null ? void 0 : d.currentLocation) == null ? void 0 : xt.objectId) === T.id,
          animatedCelestial: !Re && At.includes(T.iconStyle),
          hasJournal: !!(!ce && T.journalId),
          hasScenes: !!(!ce && T.sceneIds.length),
          showImage: !!(!ce && T.image),
          canInspectSystem: !!et({ ...T, obscured: ce })
        };
      }) : [];
      m && this.selectedObjectId && !y.some((T) => T.id === this.selectedObjectId) && (this.selectedObjectId = null);
      const g = y.find((T) => T.id === this.selectedObjectId) ?? null, q = new Set(y.map((T) => T.id)), k = m ? (m.routes ?? []).filter((T) => (!this.playerMode || T.visibility === "players") && q.has(T.fromSystemId) && q.has(T.toSystemId)).map((T) => {
        const ce = y.find((Re) => Re.id === T.fromSystemId), ge = y.find((Re) => Re.id === T.toSystemId);
        return {
          ...T,
          from: ce,
          to: ge,
          fromName: (ce == null ? void 0 : ce.displayName) ?? T.fromSystemId,
          toName: (ge == null ? void 0 : ge.displayName) ?? T.toSystemId,
          isSelected: T.id === this.selectedRouteId,
          isActive: T.id === this.selectedRouteId,
          gmOnly: T.visibility === "gm"
        };
      }) : [], B = k.find((T) => T.id === this.selectedRouteId) ?? null, C = y.find((T) => T.isCurrent) ?? null, j = g && C && g.id !== C.id ? k.find((T) => T.fromSystemId === C.id && T.toSystemId === g.id || T.toSystemId === C.id && T.fromSystemId === g.id) : null;
      g && (g.canTravel = !!j, g.isDestination = !!(j && !g.isCurrent), g.travelRouteId = (j == null ? void 0 : j.id) ?? ""), k.forEach((T) => {
        T.isActive = T.isSelected || T.id === (j == null ? void 0 : j.id);
      }), m && (d.systems = y, d.routes = k, d.selectedSystem = B ? null : g, d.selectedRoute = B, d.currentSystem = C);
      const X = y.find((T) => T.id === this.planetSystemId) ?? (m ? null : d == null ? void 0 : d.systems.find((T) => T.id === this.planetSystemId)), oe = !this.playerMode || (l == null ? void 0 : l.visibility) === "players" ? et(X) : null;
      oe || (this.planetSystemId = null);
      const Te = X && oe ? `${X.id}:${oe.preset}` : null;
      Te !== this._planetStaticViewKey && (this._planetStaticViewKey = Te, this.planetStatic = !!(Te && rs(oe == null ? void 0 : oe.preset)));
      const ot = X && oe ? this._preparePlanetLocations(X, oe.shape) : [], Ce = X ?? g, gt = !!((dt = game.user) != null && dt.isGM && !this.playerMode && m && Ce), vt = ((Ce == null ? void 0 : Ce.sceneIds) ?? []).map((T) => {
        var ce, ge;
        return (ge = (ce = game.scenes) == null ? void 0 : ce.get) == null ? void 0 : ge.call(ce, T);
      }).filter((T) => {
        var ce, ge;
        return T && (((ce = game.user) == null ? void 0 : ce.isGM) || ((ge = T.testUserPermission) == null ? void 0 : ge.call(T, game.user, "OBSERVER")));
      }).map((T) => ({ id: T.id, uuid: T.uuid, name: T.name || "Linked Scene" })), xe = Ce != null && Ce.journalId ? (it = (Xe = game.journal) == null ? void 0 : Xe.get) == null ? void 0 : it.call(Xe, Ce.journalId) : null, St = xe && ((ae = game.user) != null && ae.isGM || (_e = xe.testUserPermission) != null && _e.call(xe, game.user, "OBSERVER")) ? { id: xe.id, uuid: xe.uuid, name: xe.name || "Linked Journal" } : null, Ge = this.creationPanel ? {
        ...this.creationPanel,
        ...this.creationPanel.data,
        kind: this.creationPanel.kind,
        entityKind: (ne = this.creationPanel.data) == null ? void 0 : ne.kind,
        isSystem: this.creationPanel.kind === "system",
        isEntity: this.creationPanel.kind === "entity",
        isRoute: this.creationPanel.kind === "route",
        isFaction: this.creationPanel.kind === "faction",
        isMap: this.creationPanel.kind === "map",
        mapTitle: (Ae = this.creationPanel.data) == null ? void 0 : Ae.title,
        title: this.creationPanel.kind === "map" ? "Edit Galaxy" : `${this.creationPanel.editId ? "Edit" : "Create"} ${{ system: "System", entity: "Entity", route: "Route", faction: "Faction" }[this.creationPanel.kind]}`,
        submitLabel: this.creationPanel.editId ? "Save changes" : "Create",
        systemOptions: (m ? y : (d == null ? void 0 : d.systems) ?? []).map((T) => ({ id: T.id, name: T.displayName || T.name })),
        factionOptions: ((d == null ? void 0 : d.factions) ?? []).map((T) => ({ id: T.id, name: T.name }))
      } : null;
      return {
        ...i,
        map: d,
        systemView: !!(m && !oe),
        activeSystem: m,
        selectedObject: g,
        planetView: !!oe,
        planetSystem: X,
        planetAppearance: oe,
        planetLocations: ot,
        hasPlanetLocations: ot.length > 0,
        canPlacePlanetLocations: gt,
        linkedPlanetScenes: vt,
        linkedPlanetJournal: St,
        creationPanel: Ge,
        factionRegistry: this.factionRegistry,
        appearanceGuideMarkup: Ge != null && Ge.isEntity ? _(Ge.planetShape || "sphere") : "",
        showInspector: !!(Ge || this.factionRegistry || oe || d != null && d.selectedSystem || d != null && d.selectedRoute),
        territories: d ? Es(d.systems, d.factions) : [],
        showTerritories: this.showTerritories,
        showRoutes: this.showRoutes,
        hardContrast: this.hardContrast,
        mapId: this.mapId,
        playerMode: this.playerMode,
        zoomPercent: Math.round(this.zoom * 100),
        panX: this.panX,
        panY: this.panY,
        zoom: this.zoom,
        missingMap: !l
      };
    }
    _onRender(c, i) {
      var d, m, h, y, g;
      (m = (d = this._bountyIntelCallout) == null ? void 0 : d.dispose) == null || m.call(d), this._bountyIntelCallout = null, this._disposePlanetRenderer(), (h = super._onRender) == null || h.call(this, c, i);
      const l = this.element instanceof HTMLElement ? this.element : (y = this.element) == null ? void 0 : y[0];
      if (l) {
        if (this._attachPartListeners("main", l, i), this._observeViewport(l), this._mountBountyIntelCallout(l), this.externalFocus && this._pendingFocusZoom !== null) {
          const q = O(f(this.mapId)).systems.find((k) => k.id === this.externalFocus.systemId);
          q && this._centerOnSystem(q, l, this._pendingFocusZoom), this._pendingFocusZoom = null;
        }
        c.planetView ? this._mountPlanetRenderer(l, c.planetAppearance) : this._planetReturnFocus && ((g = l.querySelector("[data-action='inspect-system']")) == null || g.focus(), this._planetReturnFocus = !1);
      }
    }
    _attachPartListeners(c, i, l) {
      var y, g, q, k, B, C, j, X, oe, Te, ot, Ce, gt, vt, xe, St, Ge, ct, lt, dt, Xe, it;
      const d = (y = i.matches) != null && y.call(i, ".gmf-map-stage") ? i : (g = i.querySelector) == null ? void 0 : g.call(i, ".gmf-map-stage, .gmf-planet-stage");
      if ((d == null ? void 0 : d.dataset.gmfMapBound) === "true") return;
      d && (d.dataset.gmfMapBound = "true");
      const m = (q = d == null ? void 0 : d.matches) != null && q.call(d, ".gmf-map-stage") ? d : null;
      (k = super._attachPartListeners) == null || k.call(this, c, i, l), Rt(this, i), this._attachPlanetListeners(i), this._attachCreationPanel(i);
      const h = i.querySelector(".gmf-object-appearance-panel");
      h && (M(h), this._attachAppearancePreview(i)), (B = i.querySelector("[data-action='toggle-territories']")) == null || B.addEventListener("click", () => {
        this.showTerritories = !this.showTerritories, this.render({ force: !0 });
      }), (C = i.querySelector("[data-action='toggle-routes']")) == null || C.addEventListener("click", () => {
        this.showRoutes = !this.showRoutes, this.render({ force: !0 });
      }), (j = i.querySelector("[data-action='edit-current-layer']")) == null || j.addEventListener("click", () => {
        var ae;
        !((ae = game.user) != null && ae.isGM) || this.playerMode || (this.activeSystemId ? this._openEditPanel("system", this.activeSystemId) : this._openCreationPanel("map", O(f(this.mapId)), this.mapId));
      }), (X = i.querySelector("[data-action='toggle-hard-contrast']")) == null || X.addEventListener("click", (ae) => {
        var ne;
        this.hardContrast = !this.hardContrast;
        const _e = (ne = i.matches) != null && ne.call(i, ".gmf-galaxy") ? i : i.querySelector(".gmf-galaxy");
        _e == null || _e.classList.toggle("is-hard-contrast", this.hardContrast), ae.currentTarget.setAttribute("aria-pressed", String(this.hardContrast));
      }), this._applyViewportTransform(i), i.querySelectorAll("[data-system-id]").forEach((ae) => {
        var _e, ne;
        ae.addEventListener("click", (Ae) => {
          if (ae.dataset.dragged === "true") {
            ae.dataset.dragged = "false";
            return;
          }
          Ae.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = globalThis.setTimeout(() => {
            this.activeSystemId ? this.selectedObjectId = ae.dataset.systemId : this.selectedSystemId = ae.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
          }, 180);
        }), ae.addEventListener("dblclick", (Ae) => {
          var ce;
          Ae.preventDefault(), Ae.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
          const T = ae.dataset.systemId;
          if (this.selectedRouteId = null, this.creationPanel = null, this.activeSystemId) {
            this.selectedObjectId = T;
            const ge = (ce = O(f(this.mapId)).systems.find((Re) => Re.id === this.activeSystemId)) == null ? void 0 : ce.objects.find((Re) => Re.id === T);
            et(ge) && (this.planetSystemId = T);
          } else
            this.selectedSystemId = T, this.activeSystemId = T, this.selectedObjectId = null;
          this.render({ force: !0 });
        }), !this.playerMode && ((_e = game.user) != null && _e.isGM) && ((ne = ae.querySelector("[data-resize-marker]")) == null || ne.addEventListener("pointerdown", (Ae) => this._startMarkerResize(Ae, ae)), ae.addEventListener("pointerdown", (Ae) => this._startSystemDrag(Ae, i, ae)));
      }), this._mountBountyIntelCallout(i), i.querySelectorAll("[data-route-id]").forEach((ae) => {
        ae.addEventListener("click", (_e) => {
          var ne;
          if (_e.stopPropagation(), this.selectedRouteId = ae.dataset.routeId, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, !this.playerMode && ((ne = game.user) != null && ne.isGM)) {
            this._openEditPanel("route", ae.dataset.routeId);
            return;
          }
          this.render({ force: !0 });
        });
      }), m == null || m.addEventListener("wheel", (ae) => this._onWheelZoom(ae, i), { passive: !1 }), m == null || m.addEventListener("pointerdown", (ae) => this._startPan(ae, i)), m == null || m.addEventListener("contextmenu", (ae) => this._openContextMenu(ae, i), { capture: !0 }), i.querySelectorAll("[data-context-action]").forEach((ae) => {
        ae.addEventListener("click", (_e) => this._handleContextAction(_e, i));
      }), (oe = i.querySelector("[data-action='open-journal']")) == null || oe.addEventListener("click", () => this._openLinkedJournal()), (Te = i.querySelector("[data-action='edit-system']")) == null || Te.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._openEditPanel("entity", this.selectedObjectId) : this.selectedSystemId && this._openEditPanel("system", this.selectedSystemId);
      }), (ot = i.querySelector("[data-action='open-system']")) == null || ot.addEventListener("click", () => {
        this.selectedSystemId && (this.activeSystemId = this.selectedSystemId, this.selectedObjectId = null, this.selectedRouteId = null, this.render({ force: !0 }));
      }), (Ce = i.querySelector("[data-action='navigate-up']")) == null || Ce.addEventListener("click", () => {
        if (this.creationPanel = null, this.planetSystemId)
          this._disposePlanetRenderer(), this.planetSystemId = null, this._planetReturnFocus = !0;
        else if (this.activeSystemId)
          this.activeSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null;
        else return;
        this.render({ force: !0 });
      }), (gt = i.querySelector("[data-action='reveal-system']")) == null || gt.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? he(this.mapId, this.activeSystemId, this.selectedObjectId, "players") : this.selectedSystemId && G(this.mapId, this.selectedSystemId);
      }), (vt = i.querySelector("[data-action='hide-system']")) == null || vt.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? he(this.mapId, this.activeSystemId, this.selectedObjectId, "gm") : this.selectedSystemId && le(this.mapId, this.selectedSystemId, !0);
      }), (xe = i.querySelector("[data-action='delete-system']")) == null || xe.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._confirmDeleteObject(this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), (St = i.querySelector("[data-action='set-current-system']")) == null || St.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? Q(this.mapId, this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && qe(this.mapId, this.selectedSystemId);
      }), (Ge = i.querySelector("[data-action='travel-to-system']")) == null || Ge.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? J(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, i));
      }), (ct = i.querySelector("[data-action='travel-to-object']")) == null || ct.addEventListener("click", () => {
        !this.activeSystemId || !this.selectedObjectId || (this.playerMode ? F(this.mapId, this.activeSystemId, this.selectedObjectId) : this._travelToObject(this.activeSystemId, this.selectedObjectId, i));
      }), (lt = i.querySelector("[data-action='edit-route']")) == null || lt.addEventListener("click", () => {
        this.selectedRouteId && this._openEditPanel("route", this.selectedRouteId);
      }), (dt = i.querySelector("[data-action='reveal-route']")) == null || dt.addEventListener("click", () => {
        this.selectedRouteId && ue(this.mapId, this.selectedRouteId, this.activeSystemId ?? "");
      }), (Xe = i.querySelector("[data-action='hide-route']")) == null || Xe.addEventListener("click", () => {
        this.selectedRouteId && V(this.mapId, this.selectedRouteId, !0, this.activeSystemId ?? "");
      }), (it = i.querySelector("[data-action='delete-route']")) == null || it.addEventListener("click", () => {
        this.selectedRouteId && this._confirmDeleteRoute(this.selectedRouteId);
      });
    }
    _applyViewportTransform(c) {
      var d;
      const i = c.querySelector(".gmf-map-viewport");
      if (!i) return;
      const l = c.querySelector(".gmf-map-stage");
      if (l) {
        const m = l.getBoundingClientRect(), h = i.querySelector(".gmf-map-background");
        h && (this.zoom = Math.max(1, this.zoom));
        const y = h != null && h.naturalWidth && (h != null && h.naturalHeight) ? h.naturalWidth / h.naturalHeight : null;
        y ? this._adjustWindowToBackground(l, y) : h || this._adjustWindowToBackground(l, null);
        const g = m.width / Math.max(1, m.height);
        y && y > g ? (this._worldWidth = m.width, this._worldHeight = m.width / y) : y ? (this._worldHeight = m.height, this._worldWidth = m.height * y) : (this._worldWidth = m.width, this._worldHeight = m.height), i.style.width = `${this._worldWidth}px`, i.style.height = `${this._worldHeight}px`;
        const q = this._worldWidth * this.zoom, k = this._worldHeight * this.zoom;
        this.panX = q <= m.width ? (m.width - q) / 2 : pe(this.panX, m.width - q, 0), this.panY = k <= m.height ? (m.height - k) / 2 : pe(this.panY, m.height - k, 0), h && h.dataset.gmfWorldImageBound !== "true" && (h.dataset.gmfWorldImageBound = "true", h.addEventListener("load", () => this._applyViewportTransform(c), { once: !0 }));
      }
      i.style.setProperty("--gmf-pan-x", `${this.panX}px`), i.style.setProperty("--gmf-pan-y", `${this.panY}px`), i.style.setProperty("--gmf-zoom", String(this.zoom)), (d = c.querySelector("[data-zoom-label]")) == null || d.replaceChildren(`${Math.round(this.zoom * 100)}%`);
    }
    _adjustWindowToBackground(c, i) {
      const l = c.closest(".window-app, .application, .app");
      if (!l || !this.setPosition) return;
      const d = l.getBoundingClientRect();
      if (!i) {
        this._baseWindowHeight && Math.abs(d.height - this._baseWindowHeight) > 2 && this.setPosition({ height: Math.min(this._baseWindowHeight, window.innerHeight - 24) }), this._baseWindowHeight = null;
        return;
      }
      this._baseWindowHeight ?? (this._baseWindowHeight = d.height);
      const m = c.getBoundingClientRect(), h = pe(m.width / i, 240, window.innerHeight - 96);
      if (Math.abs(m.height - h) <= 2) return;
      const y = pe(d.height + h - m.height, 320, window.innerHeight - 24);
      this.setPosition({ height: Math.round(y) });
    }
    _observeViewport(c) {
      var l;
      (l = this._viewportResizeObserver) == null || l.disconnect();
      const i = c.querySelector(".gmf-map-stage");
      !i || typeof ResizeObserver > "u" || (this._viewportResizeObserver = new ResizeObserver(() => this._applyViewportTransform(c)), this._viewportResizeObserver.observe(i));
    }
    _setZoom(c, i) {
      const l = i.querySelector(".gmf-map-background") ? 1 : zt;
      this.zoom = pe(c, l, Ht), this._applyViewportTransform(i);
    }
    _mountBountyIntelCallout(c) {
      var d;
      if (this._bountyIntelCallout || c.querySelector(".gmf-intel-callout")) return;
      const i = (d = c.matches) != null && d.call(c, ".gmf-map-stage") ? c : c.querySelector(".gmf-map-stage"), l = c;
      !i || !l.querySelector("[data-intel-layer]") || (this._bountyIntelCallout = As({
        root: l,
        stage: i,
        resolveItems: (m) => {
          var g;
          const h = O(f(this.mapId)), y = this.activeSystemId ? (g = h.systems.find((q) => q.id === this.activeSystemId)) == null ? void 0 : g.objects.find((q) => q.id === m) : h.systems.find((q) => q.id === m);
          return y ? xs(y) : [];
        },
        onOpen: (m) => _s(m)
      }));
    }
    _attachPlanetListeners(c) {
      var i, l, d, m, h, y;
      (i = c.querySelector("[data-action='inspect-system']")) == null || i.addEventListener("click", () => {
        var q, k;
        const g = f(this.mapId);
        if (!(this.playerMode && (g == null ? void 0 : g.visibility) !== "players")) {
          if (this.activeSystemId) {
            const C = (q = O(g).systems.find((j) => j.id === this.activeSystemId)) == null ? void 0 : q.objects.find((j) => j.id === this.selectedObjectId);
            if (!et(C)) return;
            this.planetSystemId = this.selectedObjectId;
          } else {
            this.activeSystemId = this.selectedSystemId;
            const B = O(g);
            this.selectedObjectId = ((k = B.systems.find((C) => C.id === this.activeSystemId)) == null ? void 0 : k.primaryObjectId) ?? null, this.planetSystemId = this.selectedObjectId;
          }
          this.render({ force: !0 });
        }
      }), (l = c.querySelector("[data-action='planet-pause']")) == null || l.addEventListener("click", () => {
        var g;
        return (g = this._planetRenderer) == null ? void 0 : g.setPaused(!this._planetRenderer.paused);
      }), (d = c.querySelector("[data-action='planet-zoom-in']")) == null || d.addEventListener("click", () => {
        var g;
        return (g = this._planetRenderer) == null ? void 0 : g.zoom(-0.25);
      }), (m = c.querySelector("[data-action='planet-zoom-out']")) == null || m.addEventListener("click", () => {
        var g;
        return (g = this._planetRenderer) == null ? void 0 : g.zoom(0.25);
      }), (h = c.querySelector("[data-action='planet-reset']")) == null || h.addEventListener("click", () => {
        var g;
        return (g = this._planetRenderer) == null ? void 0 : g.reset();
      }), (y = c.querySelector("[data-action='planet-static']")) == null || y.addEventListener("click", () => {
        this.planetStatic = !this.planetStatic, this.render({ force: !0 });
      }), this._attachPlanetLocationList(c), this._attachLinkedContentDrop(c);
    }
    _getPlanetObject() {
      var i;
      return ((i = O(f(this.mapId)).systems.find((l) => l.id === this.activeSystemId)) == null ? void 0 : i.objects.find((l) => l.id === this.planetSystemId)) ?? null;
    }
    _preparePlanetLocations(c, i) {
      return ((c == null ? void 0 : c.planetLocations) ?? []).filter((l) => l.shape === i).map((l) => {
        var h, y, g, q, k, B;
        const d = (y = (h = game.scenes) == null ? void 0 : h.get) == null ? void 0 : y.call(h, l.sceneId), m = !!(d && ((g = game.user) != null && g.isGM || (q = d.testUserPermission) != null && q.call(d, game.user, "OBSERVER")));
        return {
          ...l,
          name: d ? m || (k = game.user) != null && k.isGM ? d.name || "Linked Scene" : "Restricted location" : "Missing linked scene",
          accessible: m,
          missing: !d,
          canRemove: !!((B = game.user) != null && B.isGM && !this.playerMode)
        };
      });
    }
    _getPlanetLocationItem(c) {
      var l;
      const i = this._getPlanetObject();
      return this._preparePlanetLocations(i, (l = et(i)) == null ? void 0 : l.shape).find((d) => d.id === c) ?? null;
    }
    _attachPlanetLocationList(c) {
      var d, m;
      const i = (this.element instanceof HTMLElement ? this.element : (d = this.element) == null ? void 0 : d[0]) ?? c;
      c.querySelectorAll("[data-planet-scene-drag]").forEach((h) => h.addEventListener("dragstart", (y) => {
        y.dataTransfer && (y.dataTransfer.setData("text/plain", JSON.stringify({ type: "Scene", id: h.dataset.planetSceneDrag, uuid: h.dataset.planetSceneUuid })), y.dataTransfer.effectAllowed = "link");
      })), c.querySelectorAll("[data-unlink-planet-scene]").forEach((h) => h.addEventListener("click", async (y) => {
        var B, C, j;
        y.preventDefault(), y.stopPropagation();
        const g = h.dataset.unlinkPlanetScene ?? "", q = this.planetSystemId || this.selectedObjectId;
        if (!g || !this.activeSystemId || !q) return;
        const k = ((j = (C = (B = game.scenes) == null ? void 0 : B.get) == null ? void 0 : C.call(B, g)) == null ? void 0 : j.name) || "Scene";
        await nt(this.mapId, this.activeSystemId, q, g) && ye(`${k} unlinked from this entity.`);
      })), c.querySelectorAll("[data-open-linked-scene]").forEach((h) => h.addEventListener("click", () => {
        var g, q, k;
        const y = (q = (g = game.scenes) == null ? void 0 : g.get) == null ? void 0 : q.call(g, h.dataset.openLinkedScene ?? "");
        y != null && y.view ? y.view() : (k = y == null ? void 0 : y.sheet) == null || k.render(!0);
      })), c.querySelectorAll("[data-open-planet-location]").forEach((h) => h.addEventListener("click", () => this._openPlanetLocation(h.dataset.openPlanetLocation ?? ""))), c.querySelectorAll("[data-remove-planet-location]").forEach((h) => h.addEventListener("click", () => this._removePlanetLocation(h.dataset.removePlanetLocation ?? "", c))), c.querySelectorAll("[data-planet-location-drag]").forEach((h) => {
        h.addEventListener("dragstart", (y) => {
          var q;
          if (!y.dataTransfer) return;
          const g = h.dataset.planetLocationDrag ?? "";
          y.dataTransfer.setData("application/x-gmf-surface-location", g), y.dataTransfer.setData("text/plain", JSON.stringify({ type: "GalaxySurfaceLocation", locationId: g })), y.dataTransfer.effectAllowed = "move", (q = i.querySelector("[data-planet-location-trash]")) == null || q.classList.add("is-armed");
        }), h.addEventListener("dragend", () => {
          var y;
          return (y = i.querySelector("[data-planet-location-trash]")) == null ? void 0 : y.classList.remove("is-armed", "is-dragover");
        });
      });
      const l = i.querySelector("[data-planet-location-trash]");
      (l == null ? void 0 : l.dataset.gmfTrashBound) !== "true" && (l && (l.dataset.gmfTrashBound = "true"), l == null || l.addEventListener("dragover", (h) => {
        var y;
        (y = h.dataTransfer) != null && y.types.includes("application/x-gmf-surface-location") && (h.preventDefault(), h.dataTransfer.dropEffect = "move", l.classList.add("is-dragover"));
      }), l == null || l.addEventListener("dragleave", () => l.classList.remove("is-dragover")), l == null || l.addEventListener("drop", (h) => {
        var g;
        h.preventDefault();
        const y = ((g = h.dataTransfer) == null ? void 0 : g.getData("application/x-gmf-surface-location")) ?? "";
        l.classList.remove("is-armed", "is-dragover"), y && this._removePlanetLocation(y, c);
      })), (m = c.querySelector("[data-clear-planet-locations]")) == null || m.addEventListener("click", () => this._clearPlanetLocations(c));
    }
    _attachLinkedContentDrop(c) {
      var l, d;
      const i = c.querySelector("[data-linked-content-drop]");
      !i || !((l = game.user) != null && l.isGM) || this.playerMode || (i.addEventListener("dragover", (m) => {
        m.preventDefault(), m.dataTransfer && (m.dataTransfer.dropEffect = "link"), i.classList.add("is-document-dragover");
      }), i.addEventListener("dragleave", (m) => {
        i.contains(m.relatedTarget) || i.classList.remove("is-document-dragover");
      }), i.addEventListener("drop", async (m) => {
        var q;
        m.preventDefault(), m.stopPropagation(), i.classList.remove("is-document-dragover");
        const h = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !h) return;
        const y = await $n(m), g = (q = O(f(this.mapId)).systems.find((k) => k.id === this.activeSystemId)) == null ? void 0 : q.objects.find((k) => k.id === h);
        if (!y || !g) {
          re("Drop a Foundry Scene or Journal here.");
          return;
        }
        if (y.documentName === "Scene") {
          const k = [.../* @__PURE__ */ new Set([...g.sceneIds ?? [], y.id])];
          await S(this.mapId, this.activeSystemId, { ...g, sceneIds: k }), ye(`${y.name || "Scene"} linked to ${g.name}.`);
        } else if (y.documentName === "JournalEntry")
          await S(this.mapId, this.activeSystemId, { ...g, journalId: y.id }), ye(`${y.name || "Journal"} linked to ${g.name}.`);
        else {
          re("Drop a Foundry Scene or Journal here.");
          return;
        }
      }), (d = c.querySelector("[data-unlink-linked-journal]")) == null || d.addEventListener("click", async (m) => {
        var g;
        m.preventDefault(), m.stopPropagation();
        const h = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !h) return;
        const y = (g = O(f(this.mapId)).systems.find((q) => q.id === this.activeSystemId)) == null ? void 0 : g.objects.find((q) => q.id === h);
        y && await S(this.mapId, this.activeSystemId, { ...y, journalId: "" });
      }));
    }
    _openPlanetLocation(c) {
      var d, m, h;
      const i = this._getPlanetLocationItem(c), l = i ? (m = (d = game.scenes) == null ? void 0 : d.get) == null ? void 0 : m.call(d, i.sceneId) : null;
      if (!i || !l || !i.accessible) {
        re(i != null && i.missing ? "That location is unavailable." : "You do not have permission to view that scene.");
        return;
      }
      l.view ? l.view() : (h = l.sheet) == null || h.render(!0);
    }
    async _removePlanetLocation(c, i) {
      var d;
      if (!((d = game.user) != null && d.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const l = this._getPlanetLocationItem(c);
      !l || !await be(this.mapId, this.activeSystemId, this.planetSystemId, c) || (this._syncPlanetLocations(i), ye(`${l.name} removed from the surface.`));
    }
    async _clearPlanetLocations(c) {
      var d, m;
      if (!((d = game.user) != null && d.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const i = this._getPlanetObject(), l = this._preparePlanetLocations(i, (m = et(i)) == null ? void 0 : m.shape);
      for (const h of l) await be(this.mapId, this.activeSystemId, this.planetSystemId, h.id);
      this._syncPlanetLocations(c), l.length && ye(`Cleared ${l.length} surface location${l.length === 1 ? "" : "s"}.`);
    }
    async _placePlanetLocation(c, i, l) {
      var y;
      if (!((y = game.user) != null && y.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const d = await Ns(c);
      if (!d) {
        re("Drop a Foundry Scene onto the 3D surface.");
        return;
      }
      const m = this._getPlanetObject();
      if (!(m != null && m.sceneIds.includes(d.id))) {
        re(`Link ${d.name || "this scene"} to the object before placing it on the surface.`);
        return;
      }
      await A(this.mapId, this.activeSystemId, this.planetSystemId, { ...i, sceneId: d.id }) && (this._syncPlanetLocations(l), ye(`${d.name || "Scene"} placed on the ${i.shape}. Drag it again to move it.`));
    }
    _syncPlanetLocations(c) {
      var h, y, g, q;
      const i = (this.element instanceof HTMLElement ? this.element : (h = this.element) == null ? void 0 : h[0]) ?? c, l = this._getPlanetObject(), d = this._preparePlanetLocations(l, (y = et(l)) == null ? void 0 : y.shape);
      (g = this._planetRenderer) == null || g.setLocations((l == null ? void 0 : l.planetLocations) ?? []);
      const m = i.querySelector("[data-planet-location-list]");
      m && (m.innerHTML = d.length ? d.map((k) => `
        <div class="gmf-planet-location-row ${k.accessible ? "" : "is-restricted"}" ${k.canRemove ? `draggable="true" data-planet-location-drag="${Fe(k.id)}" title="Drag to the trash bin to remove"` : ""}>
          <button type="button" data-open-planet-location="${Fe(k.id)}" ${k.accessible ? "" : "disabled"}><i class="fa-solid ${k.accessible ? "fa-location-dot" : "fa-lock"}"></i><span>${Fe(k.name)}</span></button>
          ${k.canRemove ? `<button type="button" data-remove-planet-location="${Fe(k.id)}" title="Remove location" aria-label="Remove ${Fe(k.name)}"><i class="fa-solid fa-trash"></i></button>` : ""}
        </div>`).join("") : '<p class="gmf-planet-locations__empty">No surface locations placed.</p>', this._attachPlanetLocationList(m), (q = i.querySelector("[data-planet-location-removal]")) == null || q.toggleAttribute("hidden", d.length === 0));
    }
    refreshPlanetLocations(c, i) {
      var d;
      if (this.activeSystemId !== c || this.planetSystemId !== i) return;
      const l = this.element instanceof HTMLElement ? this.element : (d = this.element) == null ? void 0 : d[0];
      l && this._syncPlanetLocations(l);
    }
    async focusSystem(c, i = {}) {
      var B, C;
      const l = O(f(this.mapId));
      if (!l.systems.find((j) => j.id === c)) return !1;
      const m = v(l, {
        playerMode: this.playerMode,
        selectedSystemId: c,
        selectedRouteId: null
      });
      if (!((B = m == null ? void 0 : m.systems) != null && B.some((j) => j.id === c))) return !1;
      const h = String(i.focusId || c).slice(0, 80), y = ["distress", "warning", "objective", "custom"].includes(i.kind) ? i.kind : "custom", g = /^#[0-9a-f]{6}$/i.test(i.color ?? "") ? i.color : y === "distress" ? "#ff5c7a" : "#58d8ff", q = pe(Number(i.duration) || 0, 0, 6e5), k = pe(Number(i.zoom) || 1.45, zt, Ht);
      return this.externalFocus = {
        id: h,
        systemId: c,
        kind: y,
        color: g,
        label: String(i.label || (y === "distress" ? "Distress signal" : "Signal located")).slice(0, 120)
      }, this.selectedSystemId = c, this.planetSystemId = null, this.selectedRouteId = null, this._pendingFocusZoom = k, this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, await this.render({ force: !0 }), (C = this.bringToFront) == null || C.call(this), q > 0 && (this._externalFocusTimeout = globalThis.setTimeout(() => {
        var j;
        ((j = this.externalFocus) == null ? void 0 : j.id) === h && this.clearSystemFocus(h);
      }, q)), !0;
    }
    async focusLocation(c, i = "", l = {}) {
      var y;
      const m = O(f(this.mapId)).systems.find((g) => g.id === c), h = (m == null ? void 0 : m.objects.find((g) => g.id === i)) ?? (m == null ? void 0 : m.objects.find((g) => g.id === m.primaryObjectId));
      return !m || !h || this.playerMode && (m.visibility !== "players" || ht(m, h) !== "players") ? !1 : (this.activeSystemId = m.id, this.selectedSystemId = m.id, this.selectedObjectId = h.id, this.selectedRouteId = null, this.planetSystemId = l.detail === !0 && et(h) ? h.id : null, await this.render({ force: !0 }), (y = this.bringToFront) == null || y.call(this), !0);
    }
    clearSystemFocus(c = "") {
      return !this.externalFocus || c && this.externalFocus.id !== c ? !1 : (this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, this._pendingFocusZoom = null, this.externalFocus = null, this.rendered && this.render({ force: !0 }), !0);
    }
    _centerOnSystem(c, i, l) {
      const d = i.querySelector(".gmf-map-stage");
      if (!d) return;
      const m = d.getBoundingClientRect();
      this.zoom = l, this.panX = m.width / 2 - Number(c.x) / 100 * this._worldWidth * l, this.panY = m.height / 2 - Number(c.y) / 100 * this._worldHeight * l, this._applyViewportTransform(i);
    }
    _onWheelZoom(c, i) {
      c.preventDefault();
      const l = i.querySelector(".gmf-map-stage");
      if (!l) return;
      const d = l.getBoundingClientRect(), m = this.zoom, h = i.querySelector(".gmf-map-background") ? 1 : zt, y = pe(m * Math.exp(-c.deltaY * 15e-4), h, Ht), g = c.clientX - d.left, q = c.clientY - d.top, k = (g - this.panX) / m, B = (q - this.panY) / m;
      this.zoom = y, this.panX = g - k * y, this.panY = q - B * y, this._applyViewportTransform(i);
    }
    _startPan(c, i) {
      if (c.button !== 0 || c.target.closest("[data-system-id], [data-route-id], button, input")) return;
      c.preventDefault();
      const l = c.clientX, d = c.clientY, m = this.panX, h = this.panY;
      let y = !1;
      const g = (k) => {
        y = y || Math.abs(k.clientX - l) > 3 || Math.abs(k.clientY - d) > 3, this.panX = m + k.clientX - l, this.panY = h + k.clientY - d, this._applyViewportTransform(i);
      }, q = () => {
        window.removeEventListener("pointermove", g), window.removeEventListener("pointerup", q), y || (this.selectedRouteId = null, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, this.render({ force: !0 }));
      };
      window.addEventListener("pointermove", g), window.addEventListener("pointerup", q, { once: !0 });
    }
    _startSystemDrag(c, i, l) {
      var j;
      if (c.button !== 0) return;
      c.preventDefault(), c.stopPropagation(), (j = l.setPointerCapture) == null || j.call(l, c.pointerId);
      const d = c.clientX, m = c.clientY;
      let h = this._pointerToMapPercent(c, i), y = !1, g = null;
      const q = Array.from(i.querySelectorAll(`[data-route-from="${l.dataset.systemId}"]`)), k = Array.from(i.querySelectorAll(`[data-route-to="${l.dataset.systemId}"]`)), B = (X) => {
        const oe = Math.abs(X.clientX - d), Te = Math.abs(X.clientY - m);
        !y && oe <= 4 && Te <= 4 || (y = !0, l.classList.add("is-dragging"), h = this._pointerToMapPercent(X, i), l.dataset.dragged = "true", !g && (g = requestAnimationFrame(() => {
          g = null, l.style.left = `${h.x}%`, l.style.top = `${h.y}%`, this._updateConnectedRoutes(q, k, h.x, h.y);
        })));
      }, C = async () => {
        g && cancelAnimationFrame(g), l.classList.remove("is-dragging"), window.removeEventListener("pointermove", B), window.removeEventListener("pointerup", C), y && (l.style.left = `${h.x}%`, l.style.top = `${h.y}%`, this._updateConnectedRoutes(q, k, h.x, h.y), this.activeSystemId ? await He(this.mapId, this.activeSystemId, l.dataset.systemId, h.x, h.y) : await Ie(this.mapId, l.dataset.systemId, h.x, h.y));
      };
      window.addEventListener("pointermove", B), window.addEventListener("pointerup", C, { once: !0 });
    }
    _startMarkerResize(c, i) {
      var B;
      if (c.button !== 0) return;
      c.preventDefault(), c.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
      const l = pe(Number(i.dataset.iconSize) || 28, 18, 56), d = i.getBoundingClientRect(), m = d.left + d.width / 2, h = d.top + d.height / 2, y = Math.hypot(c.clientX - m, c.clientY - h);
      let g = l;
      i.dataset.dragged = "true", i.classList.add("is-resizing"), (B = i.setPointerCapture) == null || B.call(i, c.pointerId);
      const q = (C) => {
        const j = Math.hypot(C.clientX - m, C.clientY - h);
        g = pe(Math.round(l + (j - y) / Math.max(this.zoom, 0.01)), 18, 56), i.dataset.iconSize = String(g), i.style.setProperty("--gmf-system-size", `${g}px`);
      }, k = async () => {
        if (i.classList.remove("is-resizing"), window.removeEventListener("pointermove", q), window.removeEventListener("pointerup", k), window.removeEventListener("pointercancel", k), globalThis.setTimeout(() => {
          i.dataset.dragged = "false";
        }, 0), g !== l)
          if (this.activeSystemId) {
            const C = O(f(this.mapId)).systems.find((X) => X.id === this.activeSystemId), j = C == null ? void 0 : C.objects.find((X) => X.id === i.dataset.systemId);
            j && await S(this.mapId, this.activeSystemId, { ...j, iconSize: g });
          } else
            await E(this.mapId, { id: i.dataset.systemId, iconSize: g });
      };
      window.addEventListener("pointermove", q), window.addEventListener("pointerup", k, { once: !0 }), window.addEventListener("pointercancel", k, { once: !0 });
    }
    _pointerToMapPercent(c, i) {
      const d = i.querySelector(".gmf-map-stage").getBoundingClientRect();
      return {
        x: pe((c.clientX - d.left - this.panX) / this.zoom / this._worldWidth * 100, 0, 100),
        y: pe((c.clientY - d.top - this.panY) / this.zoom / this._worldHeight * 100, 0, 100)
      };
    }
    _updateConnectedRoutes(c, i, l, d) {
      c.forEach((m) => {
        m.setAttribute("x1", l), m.setAttribute("y1", d);
      }), i.forEach((m) => {
        m.setAttribute("x2", l), m.setAttribute("y2", d);
      });
    }
    _openContextMenu(c, i) {
      var oe;
      if (!((oe = game.user) != null && oe.isGM) || this.playerMode || c.target.closest(".gmf-context-menu")) return;
      c.preventDefault(), c.stopPropagation();
      const l = c.target.closest("[data-route-id]"), d = c.target.closest("[data-system-id]"), m = this._pointerToMapPercent(c, i);
      this._contextTarget = l ? { type: "route", id: l.dataset.routeId, position: m } : d ? { type: "system", id: d.dataset.systemId, position: m } : { type: "stage", id: null, position: m };
      const h = i.querySelector("[data-gmf-context-menu]");
      if (!h) return;
      h.querySelectorAll("[data-context-show]").forEach((Te) => {
        Te.hidden = Te.dataset.contextShow !== this._contextTarget.type;
      }), h.hidden = !1;
      const y = h.offsetWidth || 184, g = h.offsetHeight || 260, k = i.querySelector(".gmf-map-stage").getBoundingClientRect(), B = c.clientX - k.left, C = c.clientY - k.top, j = Math.max(4, k.width - y - 4), X = Math.max(4, k.height - g - 4);
      h.style.left = `${pe(B, 4, j)}px`, h.style.top = `${pe(C, 4, X)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(i), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu(c = null) {
      var d, m, h;
      const i = c ?? this.element ?? null, l = ((d = i == null ? void 0 : i.querySelector) == null ? void 0 : d.call(i, "[data-gmf-context-menu]")) ?? ((h = (m = i == null ? void 0 : i[0]) == null ? void 0 : m.querySelector) == null ? void 0 : h.call(m, "[data-gmf-context-menu]"));
      l && (l.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(c, i) {
      c.preventDefault(), c.stopPropagation();
      const l = c.currentTarget.dataset.contextAction, d = this._contextTarget;
      this._hideContextMenu(i), d && (l === "add-system" ? this._openCreationPanel("system", { x: d.position.x, y: d.position.y }) : l === "add-entity" ? this.activeSystemId && this._openCreationPanel("entity", { x: d.position.x, y: d.position.y }) : l === "manage-factions" ? (this.creationPanel = null, this.factionRegistry = !0, this.render({ force: !0 })) : l === "add-faction" ? this._openCreationPanel("faction") : l === "edit-map-details" ? this._openCreationPanel("map", O(f(this.mapId)), this.mapId) : l === "export-map" ? $(this.mapId) : l === "edit-system" ? this._openEditPanel("system", d.id) : l === "edit-entity" ? this.activeSystemId && this._openEditPanel("entity", d.id) : l === "add-route-from-marker" ? this._openCreationPanel("route", { fromSystemId: d.id }) : l === "reveal-system" ? await G(this.mapId, d.id) : l === "hide-system" ? await le(this.mapId, d.id, !0) : l === "delete-system" ? await this._confirmDeleteSystem(d.id) : l === "reveal-entity" ? this.activeSystemId && await he(this.mapId, this.activeSystemId, d.id, "players") : l === "hide-entity" ? this.activeSystemId && await he(this.mapId, this.activeSystemId, d.id, "gm") : l === "delete-entity" ? this.activeSystemId && await this._confirmDeleteObject(this.activeSystemId, d.id) : l === "edit-route" ? this._openEditPanel("route", d.id) : l === "reveal-route" ? await ue(this.mapId, d.id, this.activeSystemId ?? "") : l === "hide-route" ? await V(this.mapId, d.id, !0, this.activeSystemId ?? "") : l === "delete-route" && await this._confirmDeleteRoute(d.id));
    }
    async _confirmDeleteSystem(c) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, yt) && await Y(this.mapId, c);
    }
    async _confirmDeleteObject(c, i) {
      await Dialog.confirm({ title: "Delete Entity", content: "<p>Delete this entity and its linked content?</p>" }) && (await De(this.mapId, c, i), this.selectedObjectId = null);
    }
    _openCreationPanel(c, i = {}, l = null) {
      var g, q, k, B;
      if (!((g = game.user) != null && g.isGM) || this.playerMode) return;
      const d = O(f(this.mapId)), m = this.activeSystemId ? ((q = d.systems.find((C) => C.id === this.activeSystemId)) == null ? void 0 : q.objects) ?? [] : d.systems;
      if (c === "route" && m.length < 2) {
        re(this.activeSystemId ? "Create at least two entities before adding a route." : "Create at least two systems before adding a route.");
        return;
      }
      const h = i.fromSystemId || ((k = m[0]) == null ? void 0 : k.id) || "", y = c === "map" ? { title: "Galaxy Map", subtitle: "", description: "", backgroundImage: "", visibility: "players", travelApprovalMode: "unanimous" } : c === "system" ? { name: "New System", status: "known", visibility: "gm", description: "", markerImage: "", backgroundImage: "" } : c === "entity" ? {
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
      } : c === "route" ? { type: "safe", visibility: "gm", travelTime: "", fuelCost: 0, notes: "" } : { name: "New Faction", color: "#58d8ff", visibility: "gm", description: "" };
      this.creationPanel = {
        kind: c,
        editId: l,
        data: {
          ...y,
          ...i,
          x: Number.isFinite(Number(i.x)) ? Number(i.x) : 50,
          y: Number.isFinite(Number(i.y)) ? Number(i.y) : 50,
          fromSystemId: h,
          toSystemId: i.toSystemId || ((B = m.find((C) => C.id !== h)) == null ? void 0 : B.id) || ""
        }
      }, this.factionRegistry = !1, this.selectedSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null, this.render({ force: !0 });
    }
    _openEditPanel(c, i) {
      var m, h;
      const l = O(f(this.mapId)), d = c === "system" ? l.systems.find((y) => y.id === i) : c === "entity" ? (m = l.systems.find((y) => y.id === this.activeSystemId)) == null ? void 0 : m.objects.find((y) => y.id === i) : c === "route" ? this.activeSystemId ? (h = l.systems.find((y) => y.id === this.activeSystemId)) == null ? void 0 : h.routes.find((y) => y.id === i) : l.routes.find((y) => y.id === i) : l.factions.find((y) => y.id === i);
      d && this._openCreationPanel(c, d, i);
    }
    openEditor(c, i = {}) {
      var l;
      return !((l = game.user) != null && l.isGM) || this.playerMode ? !1 : (this._disposePlanetRenderer(), this.planetSystemId = null, c === "entity" ? (this.activeSystemId = i.systemId || this.activeSystemId, this.selectedSystemId = this.activeSystemId) : c === "route" ? this.activeSystemId = i.systemId || null : ["map", "system", "faction"].includes(c) && (this.activeSystemId = null), c === "map" ? this._openCreationPanel("map", O(f(this.mapId)), this.mapId) : i.id ? this._openEditPanel(c, i.id) : this._openCreationPanel(c, i.defaults || {}), !0);
    }
    _attachCreationPanel(c) {
      var l, d, m;
      (l = c.querySelector("[data-action='cancel-panel-create']")) == null || l.addEventListener("click", () => {
        this.creationPanel = null, this.render({ force: !0 });
      }), (d = c.querySelector("[data-action='close-faction-registry']")) == null || d.addEventListener("click", () => {
        this.factionRegistry = !1, this.render({ force: !0 });
      }), (m = c.querySelector("[data-action='add-inline-faction']")) == null || m.addEventListener("click", () => this._openCreationPanel("faction")), c.querySelectorAll("[data-edit-inline-faction]").forEach((h) => {
        h.addEventListener("click", () => this._openEditPanel("faction", h.dataset.editInlineFaction || ""));
      }), c.querySelectorAll("[data-delete-inline-faction]").forEach((h) => {
        h.addEventListener("click", async () => {
          await Dialog.confirm({ title: "Delete Faction", content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>" }, yt) && (await x(this.mapId, h.dataset.deleteInlineFaction), this.factionRegistry = !0, this.render({ force: !0 }));
        });
      });
      const i = c.querySelector("[data-panel-create-form]");
      i && (i.querySelectorAll("[data-browse-target]").forEach((h) => {
        h.addEventListener("click", (y) => {
          y.preventDefault();
          const g = i.querySelector(`[name='${h.dataset.browseTarget}']`), q = globalThis.FilePicker;
          !g || !q || new q({
            type: "image",
            current: g.value,
            callback: (k) => {
              g.value = k, g.dispatchEvent(new Event("input", { bubbles: !0 })), g.dispatchEvent(new Event("change", { bubbles: !0 }));
            }
          }).browse();
        });
      }), i.querySelectorAll("[data-clear-target]").forEach((h) => {
        h.addEventListener("click", (y) => {
          y.preventDefault();
          const g = i.querySelector(`[name='${h.dataset.clearTarget}']`);
          g && (g.value = "", g.dispatchEvent(new Event("input", { bubbles: !0 })), g.dispatchEvent(new Event("change", { bubbles: !0 })));
        });
      }), i.addEventListener("submit", async (h) => {
        h.preventDefault();
        const y = i.dataset.createKind || "", g = Object.fromEntries(new FormData(i).entries());
        c.querySelectorAll('[form="gmf-panel-editor-form"][name]').forEach((X) => {
          X instanceof HTMLInputElement && ["checkbox", "radio"].includes(X.type) && !X.checked || (g[X.name] = X.value);
        }), y === "entity" && (g.markerImage = g.useCustomMarker === "true" ? g.markerImage ?? "" : "", delete g.useCustomMarker);
        const q = Number(g.x), k = Number(g.y), B = this.creationPanel, C = (B == null ? void 0 : B.data) ?? {};
        B != null && B.editId && (g.id = B.editId), this.creationPanel = null;
        let j = null;
        if (y === "map") j = await L(this.mapId, { ...C, ...g });
        else if (y === "system") j = await E(this.mapId, { ...C, ...g, x: q, y: k });
        else if (y === "entity" && this.activeSystemId) j = await S(this.mapId, this.activeSystemId, { ...C, ...g, x: q, y: k });
        else if (y === "route") {
          if (!g.fromSystemId || !g.toSystemId || g.fromSystemId === g.toSystemId) {
            re(`Choose two different ${this.activeSystemId ? "entities" : "systems"} for the route.`), this._openCreationPanel("route", { ...C, ...g }, (B == null ? void 0 : B.editId) ?? null);
            return;
          }
          j = await w(this.mapId, { ...C, ...g }, this.activeSystemId ?? "");
        } else y === "faction" && (j = await I(this.mapId, { ...C, ...g }), this.factionRegistry = !0);
        j != null && j.id && (y === "system" && (this.selectedSystemId = j.id), y === "entity" && (this.selectedObjectId = j.id), y === "route" && (this.selectedRouteId = j.id)), this.render({ force: !0 });
      }), globalThis.setTimeout(() => {
        var h;
        return (h = i.querySelector("[autofocus]")) == null ? void 0 : h.focus();
      }, 0));
    }
    _attachAppearancePreview(c) {
      const i = c.querySelector("[data-panel-marker-preview-system]"), l = c.querySelector("[data-panel-marker-preview-icon]"), d = c.querySelector("[data-panel-marker-preview-label]");
      if (!i) return;
      let m = 0;
      const h = ["name", "kind", "status", "iconStyle", "iconColor", "markerImage"].map((g) => c.querySelector(`[name="${g}"]`)), y = async () => {
        const g = (X, oe) => {
          var Te;
          return ((Te = c.querySelector(`[name="${X}"]`)) == null ? void 0 : Te.value) || oe;
        }, q = g("kind", "planet"), k = g("status", "known"), B = g("iconStyle", q), C = g("markerImage", "").trim();
        i.className = `gmf-system gmf-system--${q} gmf-icon--${B} gmf-status--${k}${C ? " has-custom-marker" : ""}`, i.style.setProperty("--gmf-faction-color", g("iconColor", "#58d8ff")), i.style.setProperty("--gmf-system-size", "42px"), d && (d.textContent = g("name", "New Entity"));
        const j = ++m;
        if (l && C) {
          const X = document.createElement("img");
          X.className = "gmf-custom-marker__image", X.src = C, X.alt = "", X.draggable = !1, l.replaceChildren(X);
        } else if (l && At.includes(B)) {
          const X = await globalThis.renderTemplate(`${u}/celestial-icon.hbs`, { system: { iconStyle: B } });
          j === m && (l.innerHTML = X);
        } else l && (l.innerHTML = '<span class="gmf-system__core"></span>');
      };
      h.forEach((g) => {
        g == null || g.addEventListener("input", y), g == null || g.addEventListener("change", y);
      }), y();
    }
    async _confirmDeleteRoute(c) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, yt) && await ie(this.mapId, c, this.activeSystemId ?? "");
    }
    async _travelToSystem(c, i) {
      const l = O(f(this.mapId)), d = l.systems.find((y) => y.id === l.currentSystemId), m = l.systems.find((y) => y.id === c);
      if (!m) return;
      if (!d) {
        await qe(this.mapId, m.id), ye(`Current location set to ${m.name}.`);
        return;
      }
      if (d.id === m.id) {
        ye(`${m.name} is already the current location.`);
        return;
      }
      if (!W(l, d.id, m.id)) {
        re(`No direct route from ${d.name} to ${m.name}.`);
        return;
      }
      Le(this.mapId, d.id, m.id), await this._animateShipTravel(d, m, i), await qe(this.mapId, m.id), ye(`Arrived at ${m.name}.`);
    }
    async _travelToObject(c, i, l) {
      const d = O(f(this.mapId)), m = d.systems.find((q) => q.id === c), h = m == null ? void 0 : m.objects.find((q) => q.id === d.currentLocation.objectId), y = m == null ? void 0 : m.objects.find((q) => q.id === i);
      if (!m || !y) return;
      if (!h || d.currentLocation.systemId !== m.id) {
        await Q(this.mapId, m.id, y.id), ye(`Current location set to ${y.name}.`);
        return;
      }
      if (h.id === y.id) {
        ye(`${y.name} is already the current location.`);
        return;
      }
      if (!W({ routes: m.routes }, h.id, y.id)) {
        re(`No direct route from ${h.name} to ${y.name}.`);
        return;
      }
      Pe(this.mapId, m.id, h.id, y.id), await this._animateShipTravel(h, y, l), await Q(this.mapId, m.id, y.id), ye(`Arrived at ${y.name}.`);
    }
    _animateShipTravel(c, i, l) {
      const d = l.querySelector("[data-ship-layer]"), m = l.querySelector(".gmf-map-stage");
      if (!d || !m) return Promise.resolve();
      const h = m.getBoundingClientRect(), y = (i.x - c.x) * h.width / 100, g = (i.y - c.y) * h.height / 100, q = Math.atan2(g, y) * 180 / Math.PI, k = document.createElement("div");
      return k.className = "gmf-travel-ship", k.innerHTML = '<i class="fa-solid fa-rocket"></i>', k.style.left = `${c.x}%`, k.style.top = `${c.y}%`, k.style.setProperty("--gmf-ship-angle", `${q}deg`), d.replaceChildren(k), new Promise((B) => {
        let C = !1;
        const j = () => {
          C || (C = !0, k.removeEventListener("transitionend", j), k.classList.add("is-arrived"), globalThis.setTimeout(() => {
            k.remove(), B();
          }, 260));
        };
        k.addEventListener("transitionend", j, { once: !0 }), requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            k.style.left = `${i.x}%`, k.style.top = `${i.y}%`;
          });
        }), globalThis.setTimeout(j, xn);
      });
    }
    _openLinkedJournal() {
      var l, d;
      const c = this._getSelectedRawSystem();
      if (!(c != null && c.journalId)) return;
      const i = (l = game.journal) == null ? void 0 : l.get(c.journalId);
      if (!i) {
        re(`Journal "${c.journalId}" was not found.`);
        return;
      }
      (d = i.sheet) == null || d.render(!0);
    }
    _getSelectedRawSystem() {
      var i;
      const c = O(f(this.mapId));
      return this.activeSystemId ? ((i = c.systems.find((l) => l.id === this.activeSystemId)) == null ? void 0 : i.objects.find((l) => l.id === this.selectedObjectId)) ?? null : c.systems.find((l) => l.id === this.selectedSystemId) ?? null;
    }
    async close(c = {}) {
      var i, l, d;
      return (l = (i = this._bountyIntelCallout) == null ? void 0 : i.dispose) == null || l.call(i), this._bountyIntelCallout = null, this._disposePlanetRenderer(), this._hideContextMenu(), this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, (d = this._viewportResizeObserver) == null || d.disconnect(), this._viewportResizeObserver = null, It(this), super.close(c);
    }
    _disposePlanetRenderer() {
      var c, i, l;
      this._planetGeneration++, (i = (c = this._planetLocationCallout) == null ? void 0 : c.dispose) == null || i.call(c), this._planetLocationCallout = null, (l = this._planetRenderer) == null || l.dispose(), this._planetRenderer = null;
    }
    _setPlanetFallback(c, i) {
      const l = c.querySelector(".gmf-planet-fallback");
      l && (l.style.backgroundImage = i.texture ? `url(${JSON.stringify(i.texture)})` : "none", l.style.backgroundColor = i.color);
      const d = c.querySelector("[data-planet-canvas]");
      d && (d.dataset.planetShape = i.shape, d.dataset.planetPreset = i.preset);
      const m = c.querySelector(".gmf-planet-stage");
      m == null || m.style.setProperty("--gmf-planet-color", i.color);
    }
    async _mountPlanetRenderer(c, i) {
      var g, q, k;
      const l = c.querySelector("[data-planet-canvas]");
      if (!l || !i) return;
      this._setPlanetFallback(c, i);
      const d = this._planetGeneration, m = c.querySelector("[data-planet-status]"), h = c.querySelector("[data-action='planet-static']"), y = c.querySelectorAll("[data-planet-control]");
      if (h) {
        const B = this.planetStatic ? "Enable 3D" : "Static view";
        h.setAttribute("title", B), h.setAttribute("aria-label", B), h.setAttribute("aria-pressed", String(this.planetStatic));
        const C = h.querySelector("i");
        C && (C.className = this.planetStatic ? "fa-solid fa-cube" : "fa-solid fa-image");
      }
      if (this.planetStatic) {
        m && (m.textContent = "Static preview · Enable 3D to rotate and zoom"), y.forEach((B) => B.disabled = !0);
        return;
      }
      try {
        const { createPlanetRenderer: B } = await import("./chunks/planet-renderer-pTor0sDf.js");
        if (d !== this._planetGeneration || !l.isConnected) return;
        y.forEach((C) => C.disabled = !1), this._planetRenderer = B(l, {
          texture: i.texture,
          color: i.color,
          appearancePreset: i.preset,
          shape: i.shape,
          finish: i.finish,
          detailStrength: i.detailStrength,
          locations: ((g = this._getPlanetObject()) == null ? void 0 : g.planetLocations) ?? [],
          canPlaceLocations: !!((q = game.user) != null && q.isGM && !this.playerMode),
          onLocationDrop: (C, j) => void this._placePlanetLocation(C, j, c),
          onInvalidLocationDrop: () => re("Drop the scene directly onto the visible 3D surface."),
          onMarkerHover: (C) => {
            var X, oe;
            const j = this._getPlanetLocationItem(C.id);
            j && ((oe = (X = this._planetLocationCallout) == null ? void 0 : X.show) == null || oe.call(X, j));
          },
          onMarkerLeave: () => {
            var C, j;
            return (j = (C = this._planetLocationCallout) == null ? void 0 : C.scheduleHide) == null ? void 0 : j.call(C);
          },
          onMarkerPosition: (C) => {
            var j, X;
            return (X = (j = this._planetLocationCallout) == null ? void 0 : j.setAnchor) == null ? void 0 : X.call(j, C);
          },
          onMarkerOpen: (C) => this._openPlanetLocation(C.id),
          onMarkerContextMenu: (k = game.user) != null && k.isGM && !this.playerMode ? (C) => void this._removePlanetLocation(C.id, c) : null,
          isVisible: () => !this.minimized && !this._minimized,
          onStatus: (C) => {
            m && (m.textContent = C);
          },
          onPaused: (C) => {
            const j = c.querySelector("[data-action='planet-pause']");
            if (j) {
              const X = C ? "Resume rotation" : "Pause rotation";
              j.setAttribute("title", X), j.setAttribute("aria-label", X), j.setAttribute("aria-pressed", String(C));
              const oe = j.querySelector("i");
              oe && (oe.className = C ? "fa-solid fa-play" : "fa-solid fa-pause");
            }
          },
          onStopped: () => {
            y.forEach((C) => C.disabled = !0), m && (m.textContent = "Static preview · Reopen this detail view to resume 3D");
          }
        }), this._planetLocationCallout = js({ host: l });
      } catch {
        y.forEach((B) => B.disabled = !0), m && (m.textContent = "3D could not be loaded. Static preview shown.");
      }
    }
  }, Z(st, "DEFAULT_OPTIONS", {
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
  }), Z(st, "PARTS", {
    main: {
      template: `${u}/galaxy-map.hbs`
    }
  }), st;
}
function Bs() {
  var f, v, E, S;
  const n = (v = (f = foundry.applications) == null ? void 0 : f.api) == null ? void 0 : v.ApplicationV2, u = (S = (E = foundry.applications) == null ? void 0 : E.api) == null ? void 0 : S.HandlebarsApplicationMixin;
  return n && u ? u(n) : Application;
}
function zs(n) {
  var S;
  const { templateRoot: u, getVisibleMaps: f, openMap: v, clearChooser: E } = n;
  return S = class extends Bs() {
    async _prepareContext(I) {
      var L;
      return { ...await ((L = super._prepareContext) == null ? void 0 : L.call(this, I)) ?? {}, maps: f() };
    }
    _attachPartListeners(I, L, x) {
      var _;
      (_ = super._attachPartListeners) == null || _.call(this, I, L, x), Rt(this, L), L.querySelectorAll("[data-player-open-map]").forEach((M) => {
        M.addEventListener("click", () => {
          v(M.dataset.playerOpenMap, { playerMode: !0 }), this.close();
        });
      });
    }
    async close(I = {}) {
      return E(this), super.close(I);
    }
  }, Z(S, "DEFAULT_OPTIONS", {
    id: "galaxy-map-player-chooser",
    classes: ["galaxy-map", "galaxy-map-framework", "gmf-manager-window", "gmf-map-chooser-window"],
    window: { title: "Choose Galaxy Map", icon: "fa-solid fa-satellite", resizable: !0 },
    position: { width: 480, height: 420 }
  }), Z(S, "PARTS", { main: { template: `${u}/player-map-chooser.hbs` } }), S;
}
const Oe = "galaxy-map", Vt = "maps", Ct = "schemaV1Backup", Ut = "surfaceLocationRecoveryV2", se = `module.${Oe}`, We = `modules/${Oe}/templates`;
(() => {
  let n = null;
  const u = /* @__PURE__ */ new Map();
  let f = null, v = null;
  const E = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
  function L(e) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? {}));
  }
  function x(e) {
    var t;
    (t = ui.notifications) == null || t.error(`[Galaxy Map] ${e}`);
  }
  function _(e) {
    var t;
    (t = ui.notifications) == null || t.info(`[Galaxy Map] ${e}`);
  }
  function M(e = "change galaxy maps") {
    var t;
    return (t = game.user) != null && t.isGM ? !0 : (x(`Only a GM can ${e}.`), !1);
  }
  function G() {
    var e;
    return ((e = game.users) == null ? void 0 : e.contents) ?? Array.from(game.users ?? []);
  }
  function ue() {
    return G().filter((e) => e.active);
  }
  function le() {
    return ue().filter((e) => e.isGM).sort((e, t) => String(e.id).localeCompare(String(t.id)))[0] ?? null;
  }
  function he() {
    var e, t;
    return !!((e = game.user) != null && e.isGM && ((t = le()) == null ? void 0 : t.id) === game.user.id);
  }
  function V() {
    return L(game.settings.get(Oe, Vt) ?? {});
  }
  async function Y(e) {
    return M("save galaxy map data") && await game.settings.set(Oe, Vt, e ?? {}), e;
  }
  function De(e) {
    var wt;
    const t = Gt(e), s = (t == null ? void 0 : t.ownerDocument) ?? window.document, r = new AbortController(), o = t ? new MutationObserver(() => {
      t.isConnected || (r.abort(), o.disconnect());
    }) : null;
    t && s.body && (o == null || o.observe(s.body, { childList: !0, subtree: !0 }));
    let a = null;
    const p = (H = !1) => {
      if (!a) return;
      const D = a.closest("[data-linked-documents]");
      a.hidden = !0, a.style.removeProperty("left"), a.style.removeProperty("top"), a.style.removeProperty("width");
      const z = (D == null ? void 0 : D.querySelector("[data-open-document-picker]")) ?? null;
      z == null || z.setAttribute("aria-expanded", "false"), a = null, H && (z == null || z.focus());
    }, b = () => {
      var Ke;
      if (!a || a.hidden) return;
      const H = ((Ke = a.closest("[data-linked-documents]")) == null ? void 0 : Ke.querySelector("[data-open-document-picker]")) ?? null;
      if (!H) return;
      const D = s.documentElement.clientWidth, z = s.documentElement.clientHeight, ee = Math.min(320, D - 24);
      a.style.width = `${ee}px`;
      const fe = H.getBoundingClientRect(), $e = a.getBoundingClientRect(), Ne = Math.max(12, Math.min(fe.right - ee, D - ee - 12)), Ve = fe.bottom + 6, Ue = Ve + $e.height <= z - 12 ? Ve : Math.max(12, fe.top - $e.height - 6);
      a.style.left = `${Ne}px`, a.style.top = `${Ue}px`;
    };
    s.addEventListener("pointerdown", (H) => {
      var ee;
      if (!a) return;
      const D = H.target, z = (ee = a.closest("[data-linked-documents]")) == null ? void 0 : ee.querySelector("[data-open-document-picker]");
      !a.contains(D) && !(z != null && z.contains(D)) && p();
    }, { signal: r.signal }), s.addEventListener("keydown", (H) => {
      H.key !== "Escape" || !a || (H.preventDefault(), H.stopPropagation(), p(!0));
    }, { capture: !0, signal: r.signal }), s.addEventListener("scroll", b, { capture: !0, passive: !0, signal: r.signal }), (wt = s.defaultView) == null || wt.addEventListener("resize", b, { signal: r.signal }), t == null || t.querySelectorAll("[data-browse-target]").forEach((H) => {
      H.addEventListener("click", (D) => {
        D.preventDefault();
        const z = t.querySelector(`[name="${H.dataset.browseTarget}"]`);
        z && new FilePicker({
          type: "image",
          current: z.value,
          callback: (ee) => {
            z.value = ee, z.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        }).browse();
      });
    }), t == null || t.querySelectorAll("[data-clear-target]").forEach((H) => {
      H.addEventListener("click", (D) => {
        D.preventDefault();
        const z = t.querySelector(`[name="${H.dataset.clearTarget}"]`);
        z && (z.value = "", z.dispatchEvent(new Event("input", { bubbles: !0 })), z.dispatchEvent(new Event("change", { bubbles: !0 })));
      });
    }), t == null || t.querySelectorAll("[data-use-custom-marker]").forEach((H) => {
      const D = H.closest("form") ?? t, z = (D == null ? void 0 : D.querySelector("[data-custom-marker-field]")) ?? null, ee = (z == null ? void 0 : z.querySelector('[name="markerImage"]')) ?? null, fe = (z == null ? void 0 : z.querySelectorAll("button")) ?? [], $e = () => {
        const Ne = H.checked;
        z == null || z.classList.toggle("is-disabled", !Ne), ee && (ee.disabled = !Ne), fe.forEach((Ve) => {
          Ve.disabled = !Ne;
        }), !Ne && (ee != null && ee.value) && (ee.value = "", ee.dispatchEvent(new Event("input", { bubbles: !0 })), ee.dispatchEvent(new Event("change", { bubbles: !0 })));
      };
      H.addEventListener("change", $e), $e();
    }), t == null || t.querySelectorAll("[data-marker-preview]").forEach((H) => {
      const D = H.closest("form"), z = (D == null ? void 0 : D.querySelector('[name="iconStyle"]')) ?? null, ee = (D == null ? void 0 : D.querySelector('[name="type"]')) ?? null, fe = (D == null ? void 0 : D.querySelector('[name="status"]')) ?? null, $e = (D == null ? void 0 : D.querySelector('[name="iconColor"]')) ?? null, Ne = (D == null ? void 0 : D.querySelector('[name="iconSize"]')) ?? null, Ve = (D == null ? void 0 : D.querySelector('[name="pulse"]')) ?? null, Ue = (D == null ? void 0 : D.querySelector('[name="markerImage"]')) ?? null, Ke = (D == null ? void 0 : D.querySelector('[name="name"]')) ?? null, Qe = H.querySelector("[data-marker-preview-system]"), ut = H.querySelector("[data-marker-preview-icon]"), bt = H.querySelector("[data-marker-preview-label]");
      let mt = 0;
      const Mt = async () => {
        if (!Qe || !ut) return;
        const Be = (ee == null ? void 0 : ee.value) ?? "unknown", Tt = (fe == null ? void 0 : fe.value) ?? "known", me = F(Be, (z == null ? void 0 : z.value) ?? "planet"), Se = (Ue == null ? void 0 : Ue.value.trim()) ?? "";
        Qe.className = `gmf-system gmf-system--${Be} gmf-icon--${me} gmf-status--${Tt}${Se ? " has-custom-marker" : ""}${Ve != null && Ve.checked ? " is-marker-preview-pulsing" : " gmf-no-pulse"}`, Qe.style.setProperty("--gmf-faction-color", ($e == null ? void 0 : $e.value) || "#58d8ff"), Qe.style.setProperty("--gmf-system-size", `${(Ne == null ? void 0 : Ne.value) || 28}px`), bt && (bt.textContent = (Ke == null ? void 0 : Ke.value.trim()) || "New System");
        const Me = ++mt;
        if (Se) {
          const de = document.createElement("img");
          de.className = "gmf-custom-marker__image", de.src = Se, de.alt = "", de.draggable = !1, ut.replaceChildren(de);
        } else if (At.includes(me)) {
          const de = await renderTemplate(`${We}/celestial-icon.hbs`, { system: { iconStyle: me } });
          Me === mt && (ut.innerHTML = de);
        } else
          ut.innerHTML = '<span class="gmf-system__core"></span>';
      };
      for (const Be of [z, ee, fe, $e, Ne, Ve, Ue, Ke])
        Be == null || Be.addEventListener("input", Mt), Be == null || Be.addEventListener("change", Mt);
      Mt();
    }), t == null || t.querySelectorAll("[data-linked-documents]").forEach((H) => {
      var Be, Tt;
      const D = H.querySelector("[data-linked-document-list]"), z = H.querySelector("[data-document-picker]"), ee = H.querySelector("[data-document-search]"), fe = H.querySelector("[data-document-results]"), $e = ((Be = game[H.dataset.collection]) == null ? void 0 : Be.contents) ?? [], Ne = H.dataset.inputName ?? "documentId", Ve = H.dataset.multiple === "true", Ue = H.dataset.kindLabel ?? "Document", Ke = H.dataset.iconClass ?? "fa-file", Qe = H.querySelector("[data-open-document-picker]"), ut = () => new Set(Array.from((D == null ? void 0 : D.querySelectorAll(`input[name="${Ne}"]`)) ?? []).map((me) => me.value)), bt = () => {
        const me = H.querySelector("[data-linked-document-empty]");
        me && (me.hidden = !!(D != null && D.querySelector("[data-linked-document]")));
      }, mt = () => {
        if (!fe) return;
        const me = (ee == null ? void 0 : ee.value.trim().toLocaleLowerCase()) ?? "", Se = ut(), Me = $e.filter((de) => !Se.has(String(de.id))).filter((de) => !me || String(de.name ?? de.id).toLocaleLowerCase().includes(me));
        fe.replaceChildren();
        for (const de of Me.slice(0, 50)) {
          const rt = window.document.createElement("button");
          rt.type = "button", rt.className = "gmf-document-picker__result", rt.dataset.documentId = String(de.id), rt.textContent = String(de.name ?? de.id), fe.append(rt);
        }
        if (Me.length) {
          if (Me.length > 50) {
            const de = window.document.createElement("p");
            de.textContent = `${Me.length - 50} more results. Refine your search.`, fe.append(de);
          }
        } else {
          const de = window.document.createElement("p");
          de.textContent = $e.length ? `No matching ${Ue.toLocaleLowerCase()}s.` : `No ${Ue.toLocaleLowerCase()}s exist in this world yet.`, fe.append(de);
        }
      }, Mt = (me) => {
        if (!D || ut().has(String(me.id))) return;
        Ve || D.querySelectorAll("[data-linked-document]").forEach((ts) => ts.remove());
        const Se = s.createElement("div");
        Se.className = "gmf-linked-document", Se.dataset.linkedDocument = "", Se.dataset.documentId = String(me.id);
        const Me = s.createElement("i");
        Me.className = `fa-solid ${Ke} gmf-linked-document__icon`, Me.setAttribute("aria-hidden", "true");
        const de = s.createElement("span");
        de.className = "gmf-linked-document__copy";
        const rt = s.createElement("strong");
        rt.textContent = String(me.name ?? me.id);
        const dn = s.createElement("small");
        dn.textContent = Ue, de.append(rt, dn);
        const kt = s.createElement("input");
        kt.type = "hidden", kt.name = Ne, kt.value = String(me.id);
        const ft = s.createElement("button");
        ft.type = "button", ft.dataset.unlinkDocument = "", ft.title = `Remove ${Ue.toLocaleLowerCase()}`, ft.setAttribute("aria-label", ft.title), ft.innerHTML = '<i class="fa-solid fa-xmark"></i><span>Unlink</span>', Se.append(Me, de, kt, ft), D.append(Se), bt(), mt(), p(!0);
      };
      D == null || D.addEventListener("click", (me) => {
        var Me;
        const Se = me.target.closest("[data-unlink-document]");
        Se && ((Me = Se.closest("[data-linked-document]")) == null || Me.remove(), bt(), mt());
      }), Qe == null || Qe.addEventListener("click", () => {
        if (z) {
          if (a === z) return p(!0);
          p(), a = z, z.hidden = !1, Qe.setAttribute("aria-expanded", "true"), mt(), requestAnimationFrame(() => {
            b(), ee == null || ee.focus(), ee == null || ee.select();
          });
        }
      }), (Tt = H.querySelector("[data-close-document-picker]")) == null || Tt.addEventListener("click", () => p(!0)), ee == null || ee.addEventListener("input", mt), ee == null || ee.addEventListener("keydown", (me) => {
        var Se, Me;
        me.key === "ArrowDown" && (me.preventDefault(), (Se = fe == null ? void 0 : fe.querySelector("[data-document-id]")) == null || Se.focus()), me.key === "Enter" && (me.preventDefault(), me.stopPropagation(), (Me = fe == null ? void 0 : fe.querySelector("[data-document-id]")) == null || Me.click());
      }), fe == null || fe.addEventListener("click", (me) => {
        const Se = me.target.closest("[data-document-id]"), Me = $e.find((de) => String(de.id) === (Se == null ? void 0 : Se.dataset.documentId));
        Me && Mt(Me);
      }), bt();
    });
    const R = t == null ? void 0 : t.querySelector("[data-texture-upload-fields]"), P = t == null ? void 0 : t.querySelector('[name="planetTexture"]'), U = t == null ? void 0 : t.querySelector('[name="planetPreset"]'), K = t == null ? void 0 : t.querySelector('[name="planetShape"]'), te = t == null ? void 0 : t.querySelector('[name="planetFinish"]'), Ee = t == null ? void 0 : t.querySelector('[name="planetColor"]'), ke = t == null ? void 0 : t.querySelector("[data-texture-guide]"), Je = t == null ? void 0 : t.querySelector("[data-texture-guide-section]"), ve = (t == null ? void 0 : t.querySelectorAll("[data-texture-guide-preview]")) ?? [], N = () => {
      if (!U || !K) return;
      const H = wn(U.value, K.value);
      U.replaceChildren(...In(K.value).map((D) => {
        const z = document.createElement("option");
        return z.value = D.value, z.textContent = D.label, z;
      })), U.value = H;
    }, je = () => {
      const H = (U == null ? void 0 : U.value) === "custom", D = (U == null ? void 0 : U.value) === "none";
      return R && (R.hidden = !H), Je && (Je.hidden = !H), P && (P.required = H), K && (K.disabled = D), te && (te.disabled = D), Ee && (Ee.disabled = (U == null ? void 0 : U.value) !== "color"), H;
    }, we = () => {
      var D;
      if (!ke) return;
      const H = (D = P == null ? void 0 : P.value) == null ? void 0 : D.trim();
      H ? (ke.dataset.hasTexture = "true", ve.forEach((z) => {
        z.hidden = !1, z.onload = () => {
          var ee;
          (ee = P == null ? void 0 : P.value) == null || ee.trim();
        }, z.onerror = () => {
          z.hidden = !0;
        }, z.src = H;
      })) : (delete ke.dataset.hasTexture, ve.forEach((z) => {
        z.onload = null, z.onerror = null, z.removeAttribute("src"), z.hidden = !0;
      }));
    }, Ze = () => {
      we();
    };
    U == null || U.addEventListener("change", () => {
      !je() && (P != null && P.value) && (P.value = "", P.dispatchEvent(new Event("change", { bubbles: !0 })));
    }), P == null || P.addEventListener("change", Ze), K == null || K.addEventListener("change", () => {
      ke && (ke.dataset.shape = K.value), N(), je();
    }), N(), je(), Ze();
  }
  function ie(e) {
    const t = V();
    return t[e] ? L(t[e]) : null;
  }
  function qe(e) {
    return new Map((e ?? []).map((t) => [t.id, t]));
  }
  function Q(e) {
    return e.visibility === "players";
  }
  function J(e, t) {
    return t && e.status === "undiscovered";
  }
  function F(e, t) {
    return t === "planet" ? { station: "station", anomaly: "diamond", ruins: "diamond", unknown: "diamond" }[e] ?? t : t;
  }
  function $(e, { playerMode: t = !1, selectedSystemId: s = null, selectedRouteId: r = null } = {}) {
    var Je, ve;
    const o = O(e), a = t ? o.systems.filter(Q) : o.systems, p = new Set(a.map((N) => N.id)), b = t ? o.factions.filter((N) => N.visibility === "players") : o.factions, R = qe(b), P = a.map((N) => {
      const je = R.get(N.factionId), we = J(N, t), Ze = we ? "unknown" : N.type, wt = we ? "diamond" : F(Ze, N.iconStyle), H = we ? "" : N.markerImage;
      return {
        ...N,
        image: N.image,
        sceneIds: [...N.sceneIds],
        journalId: N.journalId,
        planetPreset: N.planetPreset,
        planetShape: N.planetShape,
        planetTexture: N.planetTexture,
        planetColor: N.planetColor,
        iconStyle: wt,
        displayMarkerImage: H,
        hasCustomMarker: !!H,
        displayName: we ? "???" : N.name,
        displayDescription: we ? "Unresolved sensor contact. Details are not available." : N.description,
        displayType: Ze,
        displayStatus: we ? "undiscovered" : N.status,
        factionName: (je == null ? void 0 : je.name) ?? "Unaffiliated",
        factionColor: N.iconColor || (je == null ? void 0 : je.color) || "#58d8ff",
        obscured: we,
        isCurrent: N.id === o.currentSystemId,
        isSelected: N.id === s,
        gmOnly: N.visibility === "gm",
        animatedCelestial: !H && At.includes(wt),
        hasAlert: ["danger", "locked"].includes(we ? "undiscovered" : N.status),
        alertLabel: N.status === "danger" ? "Hazard advisory" : N.status === "locked" ? "Restricted access" : "",
        hasJournal: !!(!we && N.journalId),
        hasScenes: !!(!we && N.sceneIds.length),
        showImage: !!(!we && N.image),
        canInspectSystem: !!et({ ...N, planetPreset: N.planetPreset, planetShape: N.planetShape, planetTexture: N.planetTexture, planetColor: N.planetColor, obscured: we })
      };
    }), U = o.routes.filter((N) => !t || N.visibility === "players").filter((N) => p.has(N.fromSystemId) && p.has(N.toSystemId)).map((N) => {
      const je = P.find((Ze) => Ze.id === N.fromSystemId), we = P.find((Ze) => Ze.id === N.toSystemId);
      return {
        ...N,
        from: je,
        to: we,
        fromName: (je == null ? void 0 : je.displayName) ?? N.fromSystemId,
        toName: (we == null ? void 0 : we.displayName) ?? N.toSystemId,
        isSelected: N.id === r,
        connectsCurrent: N.fromSystemId === o.currentSystemId || N.toSystemId === o.currentSystemId,
        gmOnly: N.visibility === "gm"
      };
    }), K = U.find((N) => N.id === r) ?? null, te = K ? null : P.find((N) => N.id === s) ?? null;
    te && (te.isSelected = !0);
    const Ee = P.find((N) => N.id === o.currentSystemId) ?? P[0] ?? null, ke = te && Ee && te.id !== Ee.id ? U.find((N) => N.fromSystemId === Ee.id && N.toSystemId === te.id || N.toSystemId === Ee.id && N.fromSystemId === te.id) : null;
    return te && (te.canTravel = !!ke, te.travelRouteId = (ke == null ? void 0 : ke.id) ?? "", te.isCurrent = te.id === (Ee == null ? void 0 : Ee.id), te.isDestination = !!(ke && !te.isCurrent)), U.forEach((N) => {
      N.isActive = N.isSelected || N.id === (ke == null ? void 0 : ke.id);
    }), {
      ...o,
      systems: P,
      routes: U,
      factions: b,
      selectedSystem: te,
      selectedRoute: K,
      currentSystem: Ee,
      selectedType: K ? "route" : te ? "system" : null,
      playerMode: t,
      isGM: ((Je = game.user) == null ? void 0 : Je.isGM) ?? !1,
      canEdit: ((ve = game.user) == null ? void 0 : ve.isGM) && !t
    };
  }
  async function W(e = {}) {
    if (!M("create galaxy maps")) return null;
    const t = V(), s = O(e);
    return t[s.id] = s, await Y(t), ne(s.id), L(s);
  }
  async function Le(e, t = {}) {
    if (!M("update galaxy maps")) return null;
    const s = V();
    if (!s[e])
      return x(`Map "${e}" was not found.`), null;
    const r = O({ ...t, id: e });
    return s[e] = r, await Y(s), ne(e), L(r);
  }
  async function Pe(e, t = {}) {
    if (!M("update galaxy map metadata")) return null;
    const s = ie(e);
    return s ? Le(e, {
      ...s,
      title: t.title,
      subtitle: t.subtitle,
      description: t.description,
      backgroundImage: t.backgroundImage,
      visibility: t.visibility,
      travelApprovalMode: t.travelApprovalMode
    }) : (x(`Map "${e}" was not found.`), null);
  }
  async function ye(e) {
    if (!M("delete galaxy maps")) return !1;
    const t = V();
    return t[e] ? (delete t[e], await Y(t), Un(e), ne(), !0) : !1;
  }
  async function re(e) {
    if (!M("duplicate galaxy maps")) return null;
    const t = ie(e);
    if (!t)
      return x(`Map "${e}" was not found.`), null;
    const s = O({
      ...t,
      id: Ye("map"),
      title: `${t.title} Copy`
    }), r = V();
    return r[s.id] = s, await Y(r), ne(s.id), L(s);
  }
  async function Ie(e, t = {}) {
    var K;
    if (!M("save star systems")) return null;
    const s = V();
    if (!s[e])
      return x(`Map "${e}" was not found.`), null;
    const r = O(s[e]), o = r.systems.find((te) => te.id === t.id), a = t.objects ?? (o == null ? void 0 : o.objects) ?? [], p = (o == null ? void 0 : o.primaryObjectId) || ((K = a[0]) == null ? void 0 : K.id), b = ["image", "sceneIds", "planetLocations", "journalId", "planetPreset", "planetShape", "planetFinish", "planetTexture", "planetColor"], R = a.map((te) => te.id !== p ? te : jt({
      ...te,
      ...Object.fromEntries(b.filter((Ee) => t[Ee] !== void 0).map((Ee) => [Ee, t[Ee]]))
    })), P = qn({ ...o, ...t, objects: R }), U = r.systems.findIndex((te) => te.id === P.id);
    return U >= 0 ? r.systems[U] = P : r.systems.push(P), s[e] = O(r), await Y(s), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), L(P);
  }
  async function He(e, t, s = {}) {
    if (!M("save entities")) return null;
    const r = V();
    if (!r[e]) return null;
    const o = O(r[e]), a = o.systems.find((R) => R.id === t);
    if (!a) return null;
    const p = jt(s), b = a.objects.findIndex((R) => R.id === p.id);
    return b >= 0 ? a.objects[b] = p : a.objects.push(p), a.primaryObjectId || (a.primaryObjectId = p.id), r[e] = O(o), await Y(r), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), L(p);
  }
  function A(e, t, s) {
    var r;
    for (const o of Ae(e)) (r = o.refreshPlanetLocations) == null || r.call(o, t, s);
  }
  async function be(e, t, s, r = {}) {
    if (!M("place surface locations")) return null;
    const o = V(), a = o[e] ? O(o[e]) : null, p = a == null ? void 0 : a.systems.find((K) => K.id === t), b = p == null ? void 0 : p.objects.find((K) => K.id === s);
    if (!a || !p || !b) return null;
    const R = String(r.sceneId || "");
    if (!b.sceneIds.includes(R))
      return x("Only scenes linked to this object can be placed on its surface."), null;
    const P = _n(r), U = b.planetLocations.findIndex((K) => K.sceneId === R && K.shape === P.shape);
    return U >= 0 && (P.id = b.planetLocations[U].id), U >= 0 ? b.planetLocations[U] = P : b.planetLocations.push(P), o[e] = O(a), await Y(o), A(e, t, s), game.socket.emit(se, { action: "planet-locations", mapId: e, systemId: t, objectId: s }), L(P);
  }
  async function nt(e, t, s, r) {
    var R;
    if (!M("remove surface locations")) return !1;
    const o = V(), a = o[e] ? O(o[e]) : null, p = (R = a == null ? void 0 : a.systems.find((P) => P.id === t)) == null ? void 0 : R.objects.find((P) => P.id === s);
    if (!a || !p) return !1;
    const b = p.planetLocations.length;
    return p.planetLocations = p.planetLocations.filter((P) => P.id !== r), p.planetLocations.length === b ? !1 : (o[e] = O(a), await Y(o), A(e, t, s), game.socket.emit(se, { action: "planet-locations", mapId: e, systemId: t, objectId: s }), !0);
  }
  async function It(e, t, s, r) {
    var p;
    if (!M("unlink scenes from entities")) return !1;
    const o = ie(e), a = (p = o == null ? void 0 : o.systems.find((b) => b.id === t)) == null ? void 0 : p.objects.find((b) => b.id === s);
    return a != null && a.sceneIds.includes(r) ? !!await He(e, t, { ...a, sceneIds: a.sceneIds.filter((b) => b !== r) }) : !1;
  }
  async function st(e, t, s) {
    var p;
    if (!M("delete entities")) return !1;
    const r = V();
    if (!r[e]) return !1;
    const o = O(r[e]), a = o.systems.find((b) => b.id === t);
    return a ? (a.objects = a.objects.filter((b) => b.id !== s), a.primaryObjectId === s && (a.primaryObjectId = ((p = a.objects[0]) == null ? void 0 : p.id) ?? ""), o.currentLocation.objectId === s && (o.currentLocation.objectId = a.primaryObjectId), r[e] = O(o), await Y(r), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function en(e, t, s) {
    var R;
    if (!M("move entities")) return null;
    const r = V();
    if (!r[e]) return null;
    const o = O(r[e]), a = o.systems.find((P) => P.objects.some((U) => U.id === t)), p = o.systems.find((P) => P.id === s), b = a == null ? void 0 : a.objects.find((P) => P.id === t);
    return !a || !p || !b ? null : (a.objects = a.objects.filter((P) => P.id !== t), p.objects.push(b), a.primaryObjectId === t && (a.primaryObjectId = ((R = a.objects[0]) == null ? void 0 : R.id) ?? ""), p.primaryObjectId || (p.primaryObjectId = t), o.currentLocation.objectId === t && (o.currentLocation.systemId = p.id), r[e] = O(o), await Y(r), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), L(b));
  }
  async function tn(e, t, s) {
    if (!M("set the arrival object")) return null;
    const r = V();
    if (!r[e]) return null;
    const o = O(r[e]), a = o.systems.find((p) => p.id === t);
    return a != null && a.objects.some((p) => p.id === s) ? (a.primaryObjectId = s, o.currentLocation.systemId === t && !o.currentLocation.objectId && (o.currentLocation.objectId = s), r[e] = O(o), await Y(r), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), L(a)) : null;
  }
  async function c(e, t, s, r, o) {
    var R;
    const a = V();
    if (!a[e]) return null;
    const p = O(a[e]), b = (R = p.systems.find((P) => P.id === t)) == null ? void 0 : R.objects.find((P) => P.id === s);
    return b ? (b.x = pe(ze(r, b.x), 0, 100), b.y = pe(ze(o, b.y), 0, 100), a[e] = O(p), await Y(a), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), L(b)) : null;
  }
  async function i(e, t, s, r) {
    var b;
    if (!M("change object visibility")) return null;
    const o = V();
    if (!o[e]) return null;
    const a = O(o[e]), p = (b = a.systems.find((R) => R.id === t)) == null ? void 0 : b.objects.find((R) => R.id === s);
    return p ? (p.visibility = Ln.includes(r) ? r : "inherit", p.visibility === "players" && ["undiscovered", "locked"].includes(p.status) && (p.status = "known"), o[e] = O(a), await Y(o), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), L(p)) : null;
  }
  async function l(e, t) {
    var o;
    if (!M("delete star systems")) return !1;
    const s = V(), r = s[e];
    return r ? (r.systems = r.systems.filter((a) => a.id !== t), r.routes = r.routes.filter((a) => a.fromSystemId !== t && a.toSystemId !== t), r.currentSystemId === t && (r.currentSystemId = ((o = r.systems[0]) == null ? void 0 : o.id) ?? ""), s[e] = O(r), await Y(s), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function d(e, t) {
    var a;
    if (!M("set current location")) return null;
    const s = V(), r = s[e] ? O(s[e]) : null, o = (a = r == null ? void 0 : r.systems) == null ? void 0 : a.find((p) => p.id === t);
    return o ? (r.currentSystemId = t, s[e] = O(r), await Y(s), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), L(o)) : (x(`System "${t}" was not found.`), null);
  }
  async function m(e, t, s) {
    if (!M("set current location")) return null;
    const r = V();
    if (!r[e]) return null;
    const o = O(r[e]), a = o.systems.find((b) => b.id === t), p = a == null ? void 0 : a.objects.find((b) => b.id === s);
    return !a || !p ? null : (o.currentSystemId = t, o.currentLocation = { systemId: t, objectId: s }, r[e] = O(o), await Y(r), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), L(p));
  }
  async function h(e, t = {}, s = "") {
    var R;
    if (!M("save routes")) return null;
    const r = V(), o = r[e];
    if (!o)
      return x(`Map "${e}" was not found.`), null;
    const a = s ? (R = o.systems) == null ? void 0 : R.find((P) => P.id === s) : o;
    if (!a)
      return x(`System "${s}" was not found.`), null;
    Array.isArray(a.routes) || (a.routes = []);
    const p = Kt(t);
    if (!p.fromSystemId || !p.toSystemId || p.fromSystemId === p.toSystemId)
      return x("Routes require two different systems."), null;
    const b = a.routes.findIndex((P) => P.id === p.id);
    return b >= 0 ? a.routes[b] = p : a.routes.push(p), r[e] = O(o), await Y(r), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), L(p);
  }
  async function y(e, t, s = "") {
    var p;
    if (!M("delete routes")) return !1;
    const r = V(), o = r[e];
    if (!o) return !1;
    const a = s ? (p = o.systems) == null ? void 0 : p.find((b) => b.id === s) : o;
    return a ? (a.routes = (a.routes ?? []).filter((b) => b.id !== t), r[e] = O(o), await Y(r), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function g(e, t = {}) {
    if (!M("save factions")) return null;
    const s = V(), r = s[e];
    if (!r)
      return x(`Map "${e}" was not found.`), null;
    const o = Pn(t), a = r.factions.findIndex((p) => p.id === o.id);
    return a >= 0 ? r.factions[a] = o : r.factions.push(o), s[e] = O(r), await Y(s), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), L(o);
  }
  async function q(e, t) {
    if (!M("delete factions")) return !1;
    const s = V(), r = s[e];
    if (!r) return !1;
    r.factions = r.factions.filter((o) => o.id !== t);
    for (const o of r.systems) {
      o.factionId === t && (o.factionId = "");
      for (const a of o.objects ?? []) a.factionId === t && (a.factionId = "");
    }
    return s[e] = O(r), await Y(s), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), !0;
  }
  async function k(e, t, s = !0) {
    var p;
    if (!M(s ? "hide factions" : "reveal factions")) return null;
    const r = V(), o = r[e], a = (p = o == null ? void 0 : o.factions) == null ? void 0 : p.find((b) => b.id === t);
    return a ? (a.visibility = s ? "gm" : "players", r[e] = O(o), await Y(r), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), _(`${a.name} ${s ? "hidden from" : "visible to"} players.`), L(a)) : (x(`Faction "${t}" was not found.`), null);
  }
  async function B(e, t, s, r) {
    var b;
    if (!M("move star systems")) return null;
    const o = V(), a = o[e], p = (b = a == null ? void 0 : a.systems) == null ? void 0 : b.find((R) => R.id === t);
    return p ? (p.x = pe(ze(s, p.x), 0, 100), p.y = pe(ze(r, p.y), 0, 100), o[e] = O(a), await Y(o), game.socket.emit(se, { action: "refresh", mapId: e }), L(p)) : (x(`System "${t}" was not found.`), null);
  }
  async function C(e, t, { notify: s = !0 } = {}) {
    var p;
    if (!M("reveal star systems")) return null;
    const r = V(), o = r[e], a = (p = o == null ? void 0 : o.systems) == null ? void 0 : p.find((b) => b.id === t);
    return a ? (a.visibility = "players", (a.status === "undiscovered" || a.status === "locked") && (a.status = "known"), r[e] = O(o), await Y(r), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), s && Te(e, a.id), _(`${a.name} revealed to players.`), L(a)) : (x(`System "${t}" was not found.`), null);
  }
  async function j(e, t, s = !0) {
    var p;
    if (!M(s ? "hide star systems" : "reveal star systems")) return null;
    const r = V(), o = r[e], a = (p = o == null ? void 0 : o.systems) == null ? void 0 : p.find((b) => b.id === t);
    return a ? (a.visibility = s ? "gm" : "players", r[e] = O(o), await Y(r), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), _(`${a.name} ${s ? "hidden from" : "visible to"} players.`), L(a)) : (x(`System "${t}" was not found.`), null);
  }
  async function X(e, t, s = "") {
    var b, R;
    if (!M("reveal routes")) return null;
    const r = V(), o = r[e], a = s ? (b = o == null ? void 0 : o.systems) == null ? void 0 : b.find((P) => P.id === s) : o, p = (R = a == null ? void 0 : a.routes) == null ? void 0 : R.find((P) => P.id === t);
    return p ? (p.visibility = "players", r[e] = O(o), await Y(r), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), _("Route revealed to players."), L(p)) : (x(`Route "${t}" was not found.`), null);
  }
  async function oe(e, t, s = !0, r = "") {
    var R, P;
    if (!M(s ? "hide routes" : "reveal routes")) return null;
    const o = V(), a = o[e], p = r ? (R = a == null ? void 0 : a.systems) == null ? void 0 : R.find((U) => U.id === r) : a, b = (P = p == null ? void 0 : p.routes) == null ? void 0 : P.find((U) => U.id === t);
    return b ? (b.visibility = s ? "gm" : "players", o[e] = O(a), await Y(o), ne(e), game.socket.emit(se, { action: "refresh", mapId: e }), _(`Route ${s ? "hidden from" : "visible to"} players.`), L(b)) : (x(`Route "${t}" was not found.`), null);
  }
  function Te(e, t) {
    var o;
    if (!M("notify players about discoveries")) return;
    const s = ie(e), r = (o = s == null ? void 0 : s.systems) == null ? void 0 : o.find((a) => a.id === t);
    if (!r) {
      x(`System "${t}" was not found.`);
      return;
    }
    game.socket.emit(se, {
      action: "notify",
      mapId: e,
      systemId: t,
      message: `New System Discovered: ${r.name}`
    }), _(`Discovery notification sent: ${r.name}.`);
  }
  async function ot(e, { replace: t = !1 } = {}) {
    if (!M("import galaxy maps")) return null;
    const s = V();
    let r = O(e);
    return s[r.id] && !t && (r = O({
      ...r,
      id: Ye("map"),
      title: `${r.title} Import`
    })), s[r.id] = r, await Y(s), ne(r.id), _(`Imported ${r.title}.`), L(r);
  }
  function Ce(e) {
    const t = ie(e);
    if (!t) {
      x(`Map "${e}" was not found.`);
      return;
    }
    Rs(`${Os(t.title)}.json`, O(t));
  }
  function gt(e) {
    return `
      <div class="gmf-texture-guide" data-texture-guide data-shape="${Fe(e)}">
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
  function vt(e) {
    var o;
    if (!e) return null;
    const t = O(e), s = new Map(t.systems.map((a) => [a.id, a])), r = new Map(t.factions.map((a) => [a.id, a]));
    return {
      ...t,
      travelApprovalModeLabel: ((o = Yt.find((a) => a.value === t.travelApprovalMode)) == null ? void 0 : o.label) ?? "Unanimous agreement",
      systems: t.systems.map((a) => {
        var p;
        return {
          ...a,
          factionName: ((p = r.get(a.factionId)) == null ? void 0 : p.name) ?? "Unaffiliated"
        };
      }),
      routes: [
        ...t.routes.map((a) => {
          var p, b;
          return {
            ...a,
            systemId: "",
            scopeLabel: "Galaxy route",
            fromName: ((p = s.get(a.fromSystemId)) == null ? void 0 : p.name) ?? a.fromSystemId,
            toName: ((b = s.get(a.toSystemId)) == null ? void 0 : b.name) ?? a.toSystemId
          };
        }),
        ...t.systems.flatMap((a) => {
          const p = new Map(a.objects.map((b) => [b.id, b]));
          return a.routes.map((b) => {
            var R, P;
            return {
              ...b,
              systemId: a.id,
              scopeLabel: `Inside ${a.name}`,
              fromName: ((R = p.get(b.fromSystemId)) == null ? void 0 : R.name) ?? b.fromSystemId,
              toName: ((P = p.get(b.toSystemId)) == null ? void 0 : P.name) ?? b.toSystemId
            };
          });
        })
      ]
    };
  }
  function xe() {
    return Object.values(V()).map(O);
  }
  function St(e, t) {
    return L(O(ie(e)).systems.find((s) => s.id === String(t)) ?? null);
  }
  function Ge(e, t) {
    const s = O(ie(e));
    for (const r of s.systems) {
      const o = r.objects.find((a) => a.id === String(t));
      if (o) return { systemId: r.id, object: L(o) };
    }
    return null;
  }
  function ct(e, t) {
    const s = ie(e);
    if (!s) return [];
    const r = O(s).systems.find((o) => o.id === String(t));
    return r ? [...new Set(r.objects.flatMap((o) => o.sceneIds))] : [];
  }
  function lt(e, t) {
    const r = O(ie(e)).systems.flatMap((o) => o.objects).find((o) => o.id === String(t));
    return r ? [...r.sceneIds] : [];
  }
  function dt(e) {
    const t = String(e || "");
    return t ? xe().flatMap((s) => s.systems.flatMap((r) => r.objects.filter((o) => o.sceneIds.includes(t)).map((o) => ({ mapId: s.id, mapTitle: s.title, systemId: r.id, systemName: r.name, object: L(o) })))) : [];
  }
  function Xe(e) {
    const t = String(e || "");
    return t ? xe().flatMap((s) => s.systems.filter((r) => r.objects.some((o) => o.sceneIds.includes(t))).map((r) => ({ mapId: s.id, mapTitle: s.title, system: L(r) }))) : [];
  }
  function it(e) {
    var s;
    const t = T(e);
    return ((s = t == null ? void 0 : t.closest) == null ? void 0 : s.call(t, ".window-app, .application, .app")) ?? t;
  }
  function ae(e) {
    return e.map((t) => {
      var o, a;
      const s = it(t);
      if (!s) return null;
      const r = Number.parseInt(((a = (o = globalThis.getComputedStyle) == null ? void 0 : o.call(globalThis, s)) == null ? void 0 : a.zIndex) ?? "", 10);
      return { app: t, zIndex: s.style.zIndex || (Number.isFinite(r) ? String(r) : "") };
    }).filter(Boolean);
  }
  function _e(e) {
    for (const t of e) {
      const s = it(t.app);
      !(s != null && s.isConnected) || !t.zIndex || (s.style.zIndex = t.zIndex);
    }
  }
  async function ne(e = null) {
    var a;
    const t = [...u.entries()].filter(([p, b]) => (b == null ? void 0 : b.rendered) && (!e || p === e)).map(([, p]) => p);
    f != null && f.rendered && (!e || f.mapId === e) && t.push(f);
    const s = [n != null && n.rendered ? n : null, ...t].filter(Boolean), r = ae(s), o = s.map((p) => Promise.resolve(p.render({ force: !0 })));
    _e(r), await Promise.allSettled(o), _e(r), (a = globalThis.requestAnimationFrame) == null || a.call(globalThis, () => _e(r));
  }
  function Ae(e) {
    const t = [...u.values()];
    return f && t.push(f), t.filter((s) => (s == null ? void 0 : s.rendered) && s.mapId === e);
  }
  function T(e) {
    var t;
    return e.element instanceof HTMLElement ? e.element : ((t = e.element) == null ? void 0 : t[0]) ?? null;
  }
  function ce(e, t, s) {
    return e.routes.find((r) => r.fromSystemId === t && r.toSystemId === s || r.toSystemId === t && r.fromSystemId === s) ?? null;
  }
  function ge(e, t) {
    const s = ie(e);
    if (!s)
      return x(`Map "${e}" was not found.`), null;
    const r = O(s), o = r.systems.find((P) => P.id === r.currentSystemId), a = r.systems.find((P) => P.id === t);
    if (!a)
      return x(`System "${t}" was not found.`), null;
    if (!o)
      return x("This map does not have a current location yet. Ask the GM to set one first."), null;
    if (o.id === a.id)
      return _(`${a.name} is already the current location.`), null;
    if (r.visibility !== "players" || o.visibility !== "players" || a.visibility !== "players")
      return x("That travel destination is not visible to players."), null;
    const p = ce(r, o.id, a.id);
    if (!p || p.visibility !== "players")
      return x(`No player-visible direct route from ${o.name} to ${a.name}.`), null;
    const b = le();
    if (!b)
      return x("A GM must be online to approve player travel."), null;
    const R = Bt(ue(), game.user.id, b, r.travelApprovalMode);
    return {
      action: "travel-request",
      requestId: Ye("travel"),
      mapId: e,
      mapTitle: r.title,
      fromSystemId: o.id,
      fromName: o.name,
      toSystemId: a.id,
      toName: a.name,
      routeId: p.id,
      routeType: p.type,
      travelTime: p.travelTime,
      fuelCost: p.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      approvalMode: R.approvalMode,
      voterIds: R.voterIds,
      voterNames: R.voterNames,
      requiredApprovals: R.requiredApprovals,
      participantCount: R.participantCount
    };
  }
  function Re(e, t) {
    const s = ge(e, t);
    return s ? (game.socket.emit(se, s), _(`Travel request sent: ${s.fromName} to ${s.toName}.`), s) : null;
  }
  function xt(e, t, s) {
    const r = ie(e);
    if (!r)
      return x(`Map "${e}" was not found.`), null;
    const o = O(r), a = o.systems.find((K) => K.id === t), p = a == null ? void 0 : a.objects.find((K) => K.id === o.currentLocation.objectId), b = a == null ? void 0 : a.objects.find((K) => K.id === s);
    if (!a || o.currentLocation.systemId !== a.id || !p)
      return x("The current location is not inside this system."), null;
    if (!b)
      return x(`Destination "${s}" was not found.`), null;
    if (p.id === b.id)
      return _(`${b.name} is already the current location.`), null;
    if (o.visibility !== "players" || a.visibility !== "players" || ht(a, p) !== "players" || ht(a, b) !== "players")
      return x("That travel destination is not visible to players."), null;
    const R = ce({ routes: a.routes }, p.id, b.id);
    if (!R || R.visibility !== "players")
      return x(`No player-visible direct route from ${p.name} to ${b.name}.`), null;
    const P = le();
    if (!P)
      return x("A GM must be online to approve player travel."), null;
    const U = Bt(ue(), game.user.id, P, o.travelApprovalMode);
    return {
      action: "travel-request",
      travelScope: "object",
      requestId: Ye("travel"),
      mapId: e,
      mapTitle: o.title,
      systemId: a.id,
      fromObjectId: p.id,
      fromName: p.name,
      toObjectId: b.id,
      toName: b.name,
      routeId: R.id,
      routeType: R.type,
      travelTime: R.travelTime,
      fuelCost: R.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      approvalMode: U.approvalMode,
      voterIds: U.voterIds,
      voterNames: U.voterNames,
      requiredApprovals: U.requiredApprovals,
      participantCount: U.participantCount
    };
  }
  function nn(e, t, s) {
    const r = xt(e, t, s);
    return r ? (game.socket.emit(se, r), _(`Travel request sent: ${r.fromName} to ${r.toName}.`), r) : null;
  }
  function sn(e) {
    var p, b, R, P;
    if (!(e != null && e.requestId) || e.requesterId === ((p = game.user) == null ? void 0 : p.id) || !((R = e.voterIds) != null && R.includes((b = game.user) == null ? void 0 : b.id)) || S.has(e.requestId)) return;
    S.add(e.requestId);
    let t = !1, s = !1, r = null;
    const o = (U) => {
      if (t) return;
      t = !0;
      const K = {
        action: "travel-vote",
        requestId: e.requestId,
        mapId: e.mapId,
        userId: game.user.id,
        userName: game.user.name,
        accepted: U
      };
      game.socket.emit(se, K), on(K);
    }, a = ((P = Yt.find((U) => U.value === e.approvalMode)) == null ? void 0 : P.label) ?? "Unanimous agreement";
    r = new Dialog({
      title: "Travel Request",
      content: `
        <section class="gmf-travel-request">
          <p><strong>${Fe(e.requesterName)}</strong> wants to travel on <strong>${Fe(e.mapTitle)}</strong>.</p>
          <p>${Fe(e.fromName)} &rarr; ${Fe(e.toName)}</p>
          <p class="gmf-travel-request__meta">${Fe(e.routeType)} route / ${Fe(e.travelTime || "Unknown time")} / Fuel ${Fe(e.fuelCost ?? 0)}</p>
          <p class="gmf-travel-request__mode"><i class="fa-solid fa-users"></i> ${Fe(a)}</p>
          <div class="gmf-travel-progress" data-travel-progress aria-live="polite">
            <div class="gmf-travel-progress__bar"><span data-travel-progress-bar></span></div>
            <strong data-travel-progress-count>Waiting for vote status…</strong>
            <span data-travel-progress-pending></span>
          </div>
        </section>
      `,
      render: (U) => {
        const K = Gt(U), te = w.get(e.requestId);
        te && (te.root = K), $t(e.requestId, I.get(e.requestId));
      },
      buttons: {
        accept: {
          icon: '<i class="fa-solid fa-check"></i>',
          label: "Accept",
          callback: () => o(!0)
        },
        decline: {
          icon: '<i class="fa-solid fa-xmark"></i>',
          label: "Decline",
          callback: () => o(!1)
        }
      },
      default: "accept",
      close: () => {
        w.delete(e.requestId), s || o(!1);
      }
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog"],
      width: 420,
      height: Math.max(320, Math.min(440, window.innerHeight - 80))
    }), w.set(e.requestId, {
      root: null,
      resolve: () => {
        s = !0, t = !0, r == null || r.close();
      }
    }), r.render(!0);
  }
  function _t(e) {
    var t;
    return !!(e != null && e.coordinatorId && e.coordinatorId === ((t = le()) == null ? void 0 : t.id));
  }
  function Nn(e) {
    const t = mn(e);
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
        var r;
        return ((r = e.voterNames) == null ? void 0 : r[s]) || "Navigator";
      }),
      coordinatorId: game.user.id
    };
  }
  function $t(e, t) {
    var p, b;
    if (!t) return;
    I.set(e, t);
    const s = (p = w.get(e)) == null ? void 0 : p.root;
    if (!s) return;
    const r = s.querySelector("[data-travel-progress-count]"), o = s.querySelector("[data-travel-progress-pending]"), a = s.querySelector("[data-travel-progress-bar]");
    r && (r.textContent = `${t.acceptedCount} of ${t.requiredApprovals} approvals`), o && (o.textContent = (b = t.pendingNames) != null && b.length ? `Waiting for: ${t.pendingNames.join(", ")}` : "All votes received"), a && (a.style.width = `${Math.min(100, t.acceptedCount / Math.max(1, t.requiredApprovals) * 100)}%`);
  }
  function an(e) {
    const t = Nn(e);
    return I.set(e.requestId, t), $t(e.requestId, t), game.socket.emit(se, t), t;
  }
  function Fn(e) {
    var s, r, o;
    if (!(e != null && e.requestId) || !_t(e)) return;
    const t = I.get(e.requestId);
    if ($t(e.requestId, e), e.requesterId === ((s = game.user) == null ? void 0 : s.id) && (!t || t.acceptedCount !== e.acceptedCount || t.declinedCount !== e.declinedCount)) {
      const a = (r = e.pendingNames) != null && r.length ? ` Waiting for ${e.pendingNames.join(", ")}.` : "";
      (o = ui.notifications) == null || o.info(`Travel vote: ${e.acceptedCount}/${e.requiredApprovals} approvals.${a}`);
    }
  }
  function Dn(e) {
    if (!he() || !(e != null && e.requestId) || E.has(e.requestId)) return null;
    const t = ie(e.mapId);
    if (!t) return null;
    const s = O(t), r = ue().find((ve) => ve.id === e.requesterId && !ve.isGM), o = e.travelScope === "object", a = o ? s.systems.find((ve) => ve.id === e.systemId) : null, p = o ? a == null ? void 0 : a.objects.find((ve) => ve.id === s.currentLocation.objectId) : s.systems.find((ve) => ve.id === s.currentSystemId), b = o ? a == null ? void 0 : a.objects.find((ve) => ve.id === e.toObjectId) : s.systems.find((ve) => ve.id === e.toSystemId), R = p && b ? ce(o ? { routes: (a == null ? void 0 : a.routes) ?? [] } : s, p.id, b.id) : null, P = o && (!a || s.currentLocation.systemId !== a.id || a.visibility !== "players" || ht(a, p) !== "players" || ht(a, b) !== "players"), U = !o && ((p == null ? void 0 : p.visibility) !== "players" || (b == null ? void 0 : b.visibility) !== "players");
    if (!r || s.visibility !== "players" || !p || !b || p.id === b.id || P || U || !R || R.visibility !== "players") return null;
    const K = s.travelApprovalMode, te = le(), Ee = Bt(ue(), e.requesterId, te, K), ke = globalThis.setTimeout(() => {
      const ve = E.get(e.requestId);
      ve && rn(ve, { reason: "Travel request timed out." });
    }, us), Je = {
      action: "travel-ballot",
      requestId: String(e.requestId).slice(0, 80),
      mapId: s.id,
      mapTitle: s.title,
      travelScope: o ? "object" : "system",
      systemId: o ? a.id : "",
      fromSystemId: o ? a.id : p.id,
      fromObjectId: o ? p.id : "",
      fromName: p.name,
      toSystemId: o ? a.id : b.id,
      toObjectId: o ? b.id : "",
      toName: b.name,
      routeId: R.id,
      routeType: R.type,
      travelTime: R.travelTime,
      fuelCost: R.fuelCost,
      requesterId: r.id,
      requesterName: r.name,
      coordinatorId: game.user.id,
      ...Ee,
      accepted: /* @__PURE__ */ new Set(),
      declined: /* @__PURE__ */ new Set(),
      timeoutId: ke
    };
    return E.set(e.requestId, Je), an(Je), Je;
  }
  function Nt(e) {
    const t = O(ie(e.mapId)), s = e.travelScope === "object", r = s ? t.systems.find((p) => p.id === e.systemId) : null, o = s ? r == null ? void 0 : r.objects.find((p) => p.id === e.fromObjectId) : t.systems.find((p) => p.id === e.fromSystemId), a = s ? r == null ? void 0 : r.objects.find((p) => p.id === e.toObjectId) : t.systems.find((p) => p.id === e.toSystemId);
    !o || !a || Ae(e.mapId).forEach((p) => {
      var R;
      const b = T(p);
      if (b) {
        if (s) {
          if (p.activeSystemId !== r.id) return;
          p.selectedObjectId = a.id;
        } else p.selectedSystemId = a.id;
        p.selectedRouteId = null, (R = p._animateShipTravel) == null || R.call(p, o, a, b);
      }
    });
  }
  function Bn(e, t, s) {
    var r;
    game.socket.emit(se, {
      action: "travel-animation",
      mapId: e,
      fromSystemId: t,
      toSystemId: s,
      coordinatorId: (r = game.user) == null ? void 0 : r.id
    });
  }
  function zn(e, t, s, r) {
    var o;
    game.socket.emit(se, {
      action: "travel-animation",
      travelScope: "object",
      mapId: e,
      systemId: t,
      fromObjectId: s,
      toObjectId: r,
      coordinatorId: (o = game.user) == null ? void 0 : o.id
    });
  }
  async function Hn(e) {
    var s;
    E.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId), S.delete(e.requestId), (s = w.get(e.requestId)) == null || s.resolve(), w.delete(e.requestId), I.delete(e.requestId);
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
    game.socket.emit(se, t), Nt(t), _(`Travel approved: ${e.fromName} to ${e.toName}.`), globalThis.setTimeout(() => {
      e.travelScope === "object" ? m(e.mapId, e.systemId, e.toObjectId) : d(e.mapId, e.toSystemId);
    }, xn);
  }
  function rn(e, { voterName: t = "", reason: s = "" } = {}) {
    var a;
    E.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId), S.delete(e.requestId), (a = w.get(e.requestId)) == null || a.resolve(), w.delete(e.requestId), I.delete(e.requestId);
    const r = s || `${t || "A participant"} declined the request.`, o = {
      action: "travel-declined",
      requestId: e.requestId,
      mapId: e.mapId,
      fromName: e.fromName,
      toName: e.toName,
      voterName: t,
      reason: r,
      coordinatorId: game.user.id
    };
    game.socket.emit(se, o), _(`Travel cancelled: ${r}`);
  }
  function on(e) {
    if (!he() || !(e != null && e.requestId)) return;
    const t = E.get(e.requestId);
    if (!t || !t.voterIds.includes(e.userId) || t.accepted.has(e.userId) || t.declined.has(e.userId)) return;
    e.accepted ? t.accepted.add(e.userId) : t.declined.add(e.userId);
    const s = mn(t);
    an(t), s.outcome === "approved" ? Hn(t) : s.outcome === "declined" && rn(t, {
      voterName: e.userName,
      reason: t.approvalMode === "unanimous" ? `${e.userName || "A participant"} declined the unanimous request.` : "The remaining votes cannot reach a majority."
    });
  }
  function Gn(e) {
    var t, s, r;
    _t(e) && e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && S.delete(e.requestId), (s = w.get(e.requestId)) == null || s.resolve(), w.delete(e.requestId), I.delete(e.requestId), Nt(e), (r = ui.notifications) == null || r.info(`Travel approved: ${e.fromName} to ${e.toName}.`));
  }
  function Vn(e) {
    var t, s, r;
    _t(e) && e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && S.delete(e.requestId), (s = w.get(e.requestId)) == null || s.resolve(), w.delete(e.requestId), I.delete(e.requestId), (r = ui.notifications) == null || r.warn(`Travel cancelled: ${e.reason || `${e.voterName || "A participant"} declined.`}`));
  }
  function Un(e) {
    const t = u.get(e);
    t && t.close(), (f == null ? void 0 : f.mapId) === e && f.close();
  }
  function at(e, t = {}) {
    var b;
    const s = ie(e);
    if (!s)
      return x(`Map "${e}" was not found.`), null;
    const r = t.playerMode ?? !((b = game.user) != null && b.isGM);
    if (r && s.visibility !== "players" && !t.broadcast)
      return x("That galaxy map is not visible to players."), null;
    const o = r ? `player:${e}` : e, a = r && (f == null ? void 0 : f.mapId) === e ? f : u.get(o);
    if (a != null && a.rendered)
      return a.bringToFront(), a;
    const p = new Qn({ mapId: e, playerMode: r });
    return r ? f = p : u.set(o, p), p.render({ force: !0 }), p;
  }
  async function Yn(e, t, s = {}) {
    var o;
    if (!e || !t) return !1;
    const r = at(e, {
      playerMode: s.playerMode ?? !((o = game.user) != null && o.isGM),
      broadcast: s.broadcast === !0
    });
    return r != null && r.focusSystem ? r.focusSystem(t, s) : !1;
  }
  async function Wn(e, t = {}, s = {}) {
    var p, b;
    const r = String(t.systemId || ""), o = String(t.objectId || "");
    if (!e || !r) return !1;
    const a = at(e, { playerMode: s.playerMode ?? !((p = game.user) != null && p.isGM), broadcast: s.broadcast === !0 });
    return a ? o && a.focusLocation ? a.focusLocation(r, o, s) : (b = a.focusSystem) == null ? void 0 : b.call(a, r, s) : !1;
  }
  function Xn(e, t = "") {
    var r;
    let s = !1;
    for (const o of Ae(e))
      s = ((r = o.clearSystemFocus) == null ? void 0 : r.call(o, t)) || s;
    return s;
  }
  function Ft() {
    return M("open the map manager") ? (n || (n = new Zn()), n.render({ force: !0 }), n) : null;
  }
  function Dt() {
    const e = cn();
    return e.length ? e.length === 1 ? at(e[0].id, { playerMode: !0 }) : (v || (v = new Kn()), v.render({ force: !0 }), v) : (_("No galaxy map is currently visible to players."), null);
  }
  function cn() {
    return xe().filter((e) => e.visibility === "players").sort((e, t) => e.title.localeCompare(t.title));
  }
  function Jn() {
    var t;
    const e = xe().sort((s, r) => s.title.localeCompare(r.title));
    return (t = game.user) != null && t.isGM ? e.length === 1 ? at(e[0].id) : Ft() : Dt();
  }
  function ln(e) {
    if (M("broadcast galaxy maps")) {
      if (!ie(e)) {
        x(`Map "${e}" was not found.`);
        return;
      }
      game.socket.emit(se, { action: "open", mapId: e }), _("Map broadcast sent to players.");
    }
  }
  const Zn = Ls({
    templateRoot: We,
    getMaps: xe,
    prepareMapForManager: vt,
    getRawMap: ie,
    exportMap: Ce,
    duplicateMap: re,
    deleteMap: ye,
    createMap: W,
    deleteSystem: l,
    deleteObject: st,
    deleteRoute: y,
    deleteFaction: q,
    openMap: at,
    showMapToPlayers: ln,
    hideSystemFromPlayers: j,
    hideRouteFromPlayers: oe,
    hideFactionFromPlayers: k,
    clearManagerApp: (e) => {
      n === e && (n = null);
    }
  }), Kn = zs({
    templateRoot: We,
    getVisibleMaps: cn,
    openMap: at,
    clearChooser: (e) => {
      v === e && (v = null);
    }
  }), Qn = Ds({
    templateRoot: We,
    getRawMap: ie,
    prepareMapForDisplay: $,
    upsertSystem: Ie,
    upsertObject: He,
    upsertRoute: h,
    upsertFaction: g,
    updateMapMetadata: Pe,
    deleteFaction: q,
    getTextureGuideMarkup: gt,
    activateObjectEditorControls: De,
    revealSystemToPlayers: C,
    revealRouteToPlayers: X,
    hideSystemFromPlayers: j,
    hideRouteFromPlayers: oe,
    deleteSystem: l,
    deleteObject: st,
    deleteRoute: y,
    setCurrentSystem: d,
    setCurrentObject: m,
    requestTravelToSystem: Re,
    requestTravelToObject: nn,
    exportMap: Ce,
    getTravelRoute: ce,
    broadcastTravelAnimation: Bn,
    broadcastObjectTravelAnimation: zn,
    notifyInfo: _,
    notifyError: x,
    saveSystemPosition: B,
    saveObjectPosition: c,
    savePlanetLocation: be,
    removePlanetLocation: nt,
    unlinkPlanetScene: It,
    clearMapView: (e) => {
      e.playerMode && f === e && (f = null);
      for (const [t, s] of u.entries())
        s === e && u.delete(t);
    }
  });
  function es() {
    const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
    return t != null && t.registerApp ? (t.registerApp({
      id: Oe,
      title: "Galaxy Map",
      icon: "fa-solid fa-route",
      premium: !1,
      description: "Open cinematic campaign maps and navigation charts.",
      open: () => {
        var s;
        return (s = game.user) != null && s.isGM ? Ft() : Dt();
      }
    }), !0) : !1;
  }
  Hooks.once("init", async () => {
    game.settings.register(Oe, Vt, {
      scope: "world",
      config: !1,
      type: Object,
      default: {}
    }), game.settings.register(Oe, Ct, {
      scope: "world",
      config: !1,
      type: Object,
      default: {}
    }), game.settings.register(Oe, Ut, {
      scope: "world",
      config: !1,
      type: Boolean,
      default: !1
    }), Handlebars.registerHelper("gmfEq", (e, t) => e === t), Handlebars.registerHelper("gmfJson", (e) => JSON.stringify(e, null, 2)), Handlebars.registerHelper("gmfPercent", (e) => `${Number(e).toFixed(3)}%`), Handlebars.registerHelper("gmfFallback", (e, t) => e || t), Hooks.on("renderDialog", (e, t) => {
      var o, a;
      const s = Gt(t), r = ((o = s == null ? void 0 : s.closest) == null ? void 0 : o.call(s, ".window-app, .application, .app")) ?? s;
      (a = r == null ? void 0 : r.classList) != null && a.contains("galaxy-map") && ws(e, t);
    }), await loadTemplates([
      `${We}/map-manager.hbs`,
      `${We}/galaxy-map.hbs`,
      `${We}/celestial-icon.hbs`,
      `${We}/object-appearance-panel.hbs`,
      `${We}/system-details.hbs`,
      `${We}/player-map-chooser.hbs`
    ]);
  }), Hooks.once("ready", async () => {
    game.galaxyMap = {
      openMap: at,
      focusSystem: Yn,
      focusLocation: Wn,
      clearSystemFocus: Xn,
      openMapManager: Ft,
      openGalaxyMapFromSceneControls: Jn,
      openPlayerMapChooser: Dt,
      createMap: W,
      getMaps: xe,
      getSystem: St,
      getObject: Ge,
      getSceneIdsForSystem: ct,
      getSystemsForScene: Xe,
      getSceneIdsForObject: lt,
      getObjectsForScene: dt,
      showMapToPlayers: ln,
      updateMap: Le,
      updateMapMetadata: Pe,
      deleteMap: ye,
      duplicateMap: re,
      upsertSystem: Ie,
      deleteSystem: l,
      upsertObject: He,
      deleteObject: st,
      moveObject: en,
      setPrimaryObject: tn,
      upsertRoute: h,
      deleteRoute: y,
      upsertFaction: g,
      deleteFaction: q,
      saveSystemPosition: B,
      saveObjectPosition: c,
      savePlanetLocation: be,
      removePlanetLocation: nt,
      unlinkPlanetScene: It,
      setCurrentSystem: d,
      setCurrentObject: m,
      revealSystemToPlayers: C,
      revealRouteToPlayers: X,
      hideSystemFromPlayers: j,
      setObjectVisibility: i,
      hideRouteFromPlayers: oe,
      hideFactionFromPlayers: k,
      requestTravelToSystem: Re,
      requestTravelToObject: nn,
      importMapData: ot,
      exportMap: Ce
    };
    const e = game.modules.get(Oe);
    if (e && (e.api = game.galaxyMap), es(), he()) {
      const t = V();
      if (Object.values(t).some((r) => Number((r == null ? void 0 : r.schemaVersion) || 1) < tt)) {
        const r = L(game.settings.get(Oe, Ct) ?? {});
        Object.keys(r).length || await game.settings.set(Oe, Ct, t);
        const o = Object.fromEntries(Object.entries(t).map(([a, p]) => [a, O(p)]));
        await Y(o), _("Galaxy maps upgraded to the Galaxy → System → Entity structure. Existing map contents were placed in System 1 and the schema v1 backup was retained.");
      }
      if (!game.settings.get(Oe, Ut)) {
        const r = L(game.settings.get(Oe, Ct) ?? {}), o = V();
        let a = 0;
        for (const [p, b] of Object.entries(r)) {
          if (!o[p]) continue;
          const R = O(o[p]);
          for (const P of (b == null ? void 0 : b.systems) ?? []) {
            const U = Tn(P == null ? void 0 : P.planetLocations);
            if (!U.length) continue;
            const K = R.systems.flatMap((te) => te.objects).find((te) => te.id === P.id || te.id === `${P.id}-object`);
            !K || K.planetLocations.length || (K.planetLocations = U.filter((te) => K.sceneIds.includes(te.sceneId)), a += K.planetLocations.length);
          }
          o[p] = O(R);
        }
        a && (await Y(o), _(`Restored ${a} planet surface location${a === 1 ? "" : "s"} from the schema backup.`)), await game.settings.set(Oe, Ut, !0);
      }
    }
    game.socket.on(se, (t = {}) => {
      var s, r, o, a;
      if (t.action === "travel-request") {
        const p = Dn(t);
        p && (game.socket.emit(se, p), sn(p));
        return;
      }
      if (t.action === "travel-ballot") {
        _t(t) && t.coordinatorId !== ((s = game.user) == null ? void 0 : s.id) && sn(t);
        return;
      }
      if (t.action === "travel-vote") {
        on(t);
        return;
      }
      if (t.action === "travel-progress") {
        Fn(t);
        return;
      }
      if (t.action === "travel-approved") {
        Gn(t);
        return;
      }
      if (t.action === "travel-declined") {
        Vn(t);
        return;
      }
      if (t.action === "travel-animation") {
        t.coordinatorId !== ((r = game.user) == null ? void 0 : r.id) && Nt(t);
        return;
      }
      if (t.action === "planet-locations") {
        A(t.mapId, t.systemId, t.objectId);
        return;
      }
      (o = game.user) != null && o.isGM || (t.action === "open" && t.mapId && (f == null || f.close(), at(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "refresh" && (f == null ? void 0 : f.mapId) === t.mapId && f.render({ force: !0 }), t.action === "notify" && ((a = ui.notifications) == null || a.info(t.message || "New system discovered."), (f == null ? void 0 : f.mapId) === t.mapId && f.render({ force: !0 })));
    }), console.log(`${Oe} | Ready. API available at game.galaxyMap.`);
  });
})();
