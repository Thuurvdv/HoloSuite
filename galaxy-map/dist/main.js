var Xi = Object.defineProperty;
var Ji = (e, t, s) => t in e ? Xi(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var J = (e, t, s) => Ji(e, typeof t != "symbol" ? t + "" : t, s);
const Ue = [
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
  ...Ue,
  { value: "color", label: "Flat color" },
  { value: "custom", label: "Custom texture" },
  { value: "none", label: "No detail view" }
], Zi = [
  { value: "sphere", label: "Sphere" },
  { value: "cube", label: "Cube" },
  { value: "donut", label: "Donut" },
  { value: "asteroid", label: "Asteroid" },
  { value: "crystal", label: "Crystal" },
  { value: "cylinder", label: "Cylinder" }
], Ki = [
  { value: "smooth", label: "Smooth" },
  { value: "matte", label: "Matte" },
  { value: "holographic", label: "Holographic" }
];
function Ke(e) {
  return Zi.some((t) => t.value === e) ? String(e) : "sphere";
}
function Jt(e) {
  return Ki.some((t) => t.value === e) ? String(e) : "smooth";
}
function ft(e) {
  return e === "auto" ? "ice" : Xt.some((t) => t.value === e) ? String(e) : "ice";
}
const Zt = /* @__PURE__ */ new Set(["color", "custom", "none"]), Rt = {
  sphere: Ue.map((e) => e.value).filter((e) => !["prison", "anomaly", "cube", "donut-planet"].includes(e)),
  cube: ["cube"],
  donut: ["donut-planet"],
  asteroid: ["asteroid"],
  crystal: ["anomaly"],
  cylinder: ["prison"]
};
function Kt(e) {
  const t = new Set(Rt[Ke(e)] ?? Rt.sphere);
  return Xt.filter((s) => t.has(s.value) || Zt.has(s.value));
}
function Qt(e, t) {
  var u;
  const s = ft(e), o = Kt(t);
  return o.some((l) => l.value === s) ? s : ((u = o.find((l) => !Zt.has(l.value))) == null ? void 0 : u.value) ?? "color";
}
function Qi(e) {
  return e === "black-hole";
}
function Ce(e, t = "") {
  if (!e || e.obscured || e.planetPreset === "none") return null;
  const s = ft(e.planetPreset), o = Ue.find((m) => m.value === t) ?? Ue.find((m) => m.value === s) ?? Ue[0], u = !t && s === "custom" && !!e.planetTexture, l = !t && s === "color";
  return {
    texture: l ? null : u ? e.planetTexture : `modules/galaxy-map/assets/planets/${o.texture}`,
    label: l ? "Flat color" : u ? "Custom texture" : o.label,
    preset: l ? "color" : u ? "custom" : o.value,
    color: l ? e.planetColor || "#58d8ff" : o.color,
    shape: Ke(e.planetShape),
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
function tt(e, t, s, o) {
  const u = ht(o), l = [...new Map((e ?? []).filter((L) => L == null ? void 0 : L.id).map((L) => [String(L.id), L])).values()], m = u === "gm" ? s != null && s.id ? [s] : [] : l.filter((L) => String(L.id) !== String(t)), d = m.map((L) => String(L.id)), k = Object.fromEntries(m.map((L) => [String(L.id), String(L.name || "Navigator").slice(0, 80)])), h = d.length + (u === "gm" ? 0 : 1), w = u === "gm" ? 1 : u === "majority" ? Math.floor(h / 2) + 1 : h;
  return { approvalMode: u, voterIds: d, voterNames: k, participantCount: h, requiredApprovals: w };
}
function $t(e) {
  const t = ht(e == null ? void 0 : e.approvalMode), s = [...new Set(((e == null ? void 0 : e.voterIds) ?? []).map((w) => String(w)))], o = new Set([...(e == null ? void 0 : e.accepted) ?? []].map((w) => String(w))), u = new Set([...(e == null ? void 0 : e.declined) ?? []].map((w) => String(w))), l = t === "gm" ? 0 : 1, m = Math.max(1, Number(e == null ? void 0 : e.requiredApprovals) || (t === "unanimous" ? s.length + 1 : 1)), d = l + s.filter((w) => o.has(w)).length, k = s.filter((w) => u.has(w)).length, h = s.filter((w) => !o.has(w) && !u.has(w));
  return d >= m ? { outcome: "approved", acceptedCount: d, declinedCount: k, required: m, pendingIds: h } : t === "unanimous" && k > 0 ? { outcome: "declined", acceptedCount: d, declinedCount: k, required: m, pendingIds: h } : d + h.length < m ? { outcome: "declined", acceptedCount: d, declinedCount: k, required: m, pendingIds: h } : { outcome: "pending", acceptedCount: d, declinedCount: k, required: m, pendingIds: h };
}
const ei = 16 / 9;
function He() {
  var t;
  const e = typeof game > "u" || (t = game.time) == null ? void 0 : t.serverTime;
  return Number.isFinite(e) ? e : Date.now();
}
function Ve(e, t, s, o) {
  const u = Number(e);
  return Number.isFinite(u) ? Math.min(o, Math.max(s, u)) : t;
}
function yt(e) {
  return (e % 360 + 360) % 360;
}
function es(e) {
  const t = /* @__PURE__ */ new Map();
  for (const s of Array.isArray(e) ? e : [])
    typeof (s == null ? void 0 : s.id) != "string" || !s.id || t.has(s.id) || t.set(s.id, { id: s.id, radius: Ve(s.radius ?? 15, 15, 1, 100) });
  return [...t.values()];
}
function ts(e) {
  if (!(typeof (e == null ? void 0 : e.centerId) != "string" || !e.centerId || typeof e.orbitId != "string" || !e.orbitId))
    return {
      centerId: e.centerId,
      orbitId: e.orbitId,
      angle: yt(Ve(e.angle, 0, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)),
      period: Number(e.period) > 0 ? Ve(e.period, 60, 5, 3600) : 0,
      clockwise: e.clockwise !== !1,
      epoch: Ve(e.epoch, 0, 0, Number.MAX_SAFE_INTEGER)
    };
}
function gt(e, t, s) {
  const o = new Map(e.map((u) => [u.id, u]));
  return ti(o, t, s);
}
function ti(e, t, s) {
  var m;
  const o = e.get(s.centerId);
  if (!((m = o == null ? void 0 : o.orbits) != null && m.some((d) => d.id === s.orbitId))) return !1;
  const u = /* @__PURE__ */ new Set([t]);
  let l = o;
  for (; l; ) {
    if (u.has(l.id)) return !1;
    u.add(l.id), l = l.orbit ? e.get(l.orbit.centerId) : void 0;
  }
  return !0;
}
function ii(e, t, s = !0) {
  if (!s || !e.period) return e.angle;
  const o = (t - e.epoch) % (e.period * 1e3);
  return yt(e.angle + o / (e.period * 1e3) * 360 * (e.clockwise ? 1 : -1));
}
function si(e, t) {
  return { x: e / Math.max(1, t), y: e * Math.min(1, t) };
}
function ni(e, t, s) {
  return yt(Math.atan2(e.y - t.y, (e.x - t.x) * s) * 180 / Math.PI);
}
function rt(e, t = /* @__PURE__ */ new Set()) {
  const s = new Map(e.map((d) => [d.id, d])), o = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set();
  function m(d) {
    var w;
    if (l.has(d.id) || (l.add(d.id), !d.orbit)) return;
    const k = s.get(d.orbit.centerId), h = (w = k == null ? void 0 : k.orbits) == null ? void 0 : w.find((L) => {
      var _;
      return L.id === ((_ = d.orbit) == null ? void 0 : _.orbitId);
    });
    if (k && h && ti(s, d.id, d.orbit) && (m(k), !u.has(k.id) && !t.has(k.id))) {
      t.has(d.id) || o.set(d.id, { orbit: h, attachment: d.orbit });
      return;
    }
    u.add(d.id);
  }
  return e.forEach(m), {
    attachments: o,
    rings: e.flatMap((d) => u.has(d.id) || t.has(d.id) ? [] : (d.orbits ?? []).map((k) => ({ centerId: d.id, ...k }))),
    animated: [...o.values()].some(({ attachment: d }) => d.period > 0),
    positions(d, k, h = !0, w) {
      const L = /* @__PURE__ */ new Map();
      function _(A) {
        const q = L.get(A.id);
        if (q) return q;
        const D = o.get(A.id), U = (w == null ? void 0 : w.id) === A.id ? w.point : A;
        let T = { x: U.x, y: U.y };
        if (D) {
          const K = _(s.get(D.attachment.centerId)), ne = ((w == null ? void 0 : w.id) === A.id ? w.angle ?? ni(U, K, d) : ii(D.attachment, k, h)) * Math.PI / 180, V = si(D.orbit.radius, d);
          T = { x: K.x + V.x * Math.cos(ne), y: K.y + V.y * Math.sin(ne) };
        }
        return L.set(A.id, T), T;
      }
      return e.forEach(_), L;
    }
  };
}
function it(e, t) {
  t && (e.x = Ve(t.x, e.x, 0, 100), e.y = Ve(t.y, e.y, 0, 100)), delete e.orbit;
}
const Ae = 3, is = ["core", "colony", "frontier", "ruins", "restricted", "unknown"], ss = ["star", "planet", "moon", "station", "asteroid", "anomaly", "black-hole", "other"], ai = ["undiscovered", "known", "visited", "danger", "locked"], ns = ["safe", "dangerous", "restricted", "smuggler", "unknown"], ot = ["gm", "players"], ri = ["inherit", ...ot], as = [
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
], St = as.map((e) => e.value), ct = St, st = 0.2, nt = 10, vt = 2400, rs = 6e4;
function xe(e = "gmf") {
  return `${e}-${foundry.utils.randomID(10)}`;
}
function Ye(e, t = "players") {
  const s = ot.includes(t) ? t : "players";
  return ot.includes(e) ? String(e) : s;
}
function os(e) {
  return ri.includes(e) ? String(e) : "inherit";
}
function cs(e) {
  return typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "#58d8ff";
}
function lt(e) {
  return typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "";
}
function _e(e, t = 0) {
  const s = Number(e);
  return Number.isFinite(s) ? s : t;
}
function ls(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  return [...new Set(t.map((s) => String(s).trim()).filter(Boolean))];
}
function me(e, t, s) {
  return Math.min(s, Math.max(t, e));
}
function Ft(e, t) {
  return !Array.isArray(e) || e.length < 3 ? [...t] : e.slice(0, 3).map((s, o) => me(_e(s, t[o]), -2.5, 2.5));
}
function oi(e = {}) {
  const t = Ft(e.normal, [0, 0, 1]), s = Math.hypot(...t) || 1;
  return {
    id: String(e.id || xe("location")),
    sceneId: String(e.sceneId || "").trim(),
    shape: Ke(e.shape),
    position: Ft(e.position, [0, 0, 1]),
    normal: t.map((o) => o / s),
    surfaceVersion: 1
  };
}
function ci(e) {
  const t = /* @__PURE__ */ new Set();
  return (Array.isArray(e) ? e : []).slice(0, 64).map(oi).filter((s) => {
    const o = `${s.sceneId}:${s.shape}`;
    return !s.sceneId || t.has(o) ? !1 : (t.add(o), !0);
  });
}
function li(e = {}) {
  return ss.includes(e.kind) ? e.kind : e.type === "station" || e.iconStyle === "station" ? "station" : e.type === "anomaly" ? "anomaly" : e.iconStyle === "star" ? "star" : e.iconStyle === "black-hole" ? "black-hole" : e.planetShape === "asteroid" ? "asteroid" : ["planet", "terrestrial", "gas-giant", "ice-world", "volcanic", "artificial", "ringed"].includes(e.iconStyle) ? "planet" : "other";
}
function dt(e = {}) {
  const t = ls(e.sceneIds === void 0 ? e.sceneId : e.sceneIds), s = String(e.planetTexture || "").trim(), o = Ke(e.planetShape), u = ft(e.planetPreset), l = Qt(u, o), m = s && !["none", "color"].includes(l) ? "custom" : l, d = li(e), k = es(e.orbits), h = ts(e.orbit);
  return {
    id: String(e.id || xe("object")),
    name: String(e.name || "Unnamed Object"),
    kind: d,
    x: me(_e(e.x, 50), 0, 100),
    y: me(_e(e.y, 50), 0, 100),
    status: ai.includes(e.status) ? e.status : "known",
    visibility: os(e.visibility),
    factionId: String(e.factionId || ""),
    description: String(e.description || ""),
    image: String(e.image || ""),
    sceneIds: t,
    planetLocations: ci(e.planetLocations).filter((L) => t.includes(L.sceneId)),
    journalId: String(e.journalId || ""),
    notes: String(e.notes || "").trim(),
    iconColor: lt(e.iconColor),
    iconSize: me(_e(e.iconSize, 28), 18, 56),
    markerImage: String(e.markerImage || "").trim(),
    iconStyle: St.includes(e.iconStyle) ? e.iconStyle : d === "star" ? "star" : d === "station" ? "station" : "planet",
    pulse: e.pulse !== !1,
    planetPreset: m,
    planetShape: o,
    planetFinish: Jt(e.planetFinish),
    planetTexture: s,
    planetColor: lt(e.planetColor) || "#58d8ff",
    ...k.length ? { orbits: k } : {},
    ...h ? { orbit: h } : {}
  };
}
const Nt = dt;
function di(e = {}) {
  var k;
  const t = Array.isArray(e.objects) ? e.objects.map(dt) : [], s = t.filter((h) => h.orbit && !gt(t, h.id, h.orbit));
  for (const h of s) delete h.orbit;
  const o = new Set(t.map((h) => h.id)), u = (Array.isArray(e.routes) ? e.routes : []).map(bt).filter((h) => h.fromSystemId !== h.toSystemId && o.has(h.fromSystemId) && o.has(h.toSystemId)), l = t.some((h) => h.id === e.primaryObjectId) ? String(e.primaryObjectId) : ((k = t[0]) == null ? void 0 : k.id) ?? "", m = t.find((h) => h.id === l) ?? dt(e), d = {
    id: String(e.id || xe("system")),
    name: String(e.name || "Unnamed System"),
    x: me(_e(e.x, 50), 0, 100),
    y: me(_e(e.y, 50), 0, 100),
    type: is.includes(e.type) ? e.type : "unknown",
    factionId: String(e.factionId || ""),
    status: ai.includes(e.status) ? e.status : "known",
    description: String(e.description || ""),
    visibility: Ye(e.visibility, "players"),
    notes: String(e.notes || "").trim(),
    backgroundImage: String(e.backgroundImage || "").trim(),
    iconColor: lt(e.iconColor),
    iconSize: me(_e(e.iconSize, 30), 18, 56),
    markerImage: String(e.markerImage || "").trim(),
    iconStyle: St.includes(e.iconStyle) ? e.iconStyle : "star",
    pulse: e.pulse !== !1,
    primaryObjectId: l,
    objects: t,
    routes: u
  };
  for (const [h, w] of Object.entries({
    image: m.image,
    sceneIds: [...m.sceneIds],
    planetLocations: [...m.planetLocations],
    journalId: m.journalId,
    planetPreset: m.planetPreset,
    planetShape: m.planetShape,
    planetFinish: m.planetFinish,
    planetTexture: m.planetTexture,
    planetColor: m.planetColor
  })) Object.defineProperty(d, h, { value: w, enumerable: !1, configurable: !0 });
  return d;
}
function bt(e = {}) {
  return {
    id: String(e.id || xe("route")),
    fromSystemId: String(e.fromSystemId || ""),
    toSystemId: String(e.toSystemId || ""),
    type: ns.includes(e.type) ? e.type : "unknown",
    travelTime: String(e.travelTime || ""),
    fuelCost: _e(e.fuelCost, 0),
    visibility: Ye(e.visibility, "players"),
    notes: String(e.notes || "")
  };
}
function mi(e = {}) {
  return {
    id: String(e.id || xe("faction")),
    name: String(e.name || "Unaffiliated"),
    color: cs(e.color),
    description: String(e.description || ""),
    visibility: Ye(e.visibility, "players")
  };
}
function It(e = {}) {
  return `${String(e.id || "galaxy")}-system-1`;
}
function ds(e = {}) {
  const t = String(e.id || e.objectId || xe("object")), s = li(e);
  return {
    ...e,
    id: t,
    name: String(e.name || "Unnamed Location"),
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
function fi(e, t, s = "", o = It(e), u = []) {
  var m;
  const l = t.some((d) => d.id === s) ? s : ((m = t[0]) == null ? void 0 : m.id) ?? "";
  return {
    id: o,
    name: "System 1",
    x: 50,
    y: 50,
    type: "core",
    factionId: "",
    status: "known",
    description: "",
    visibility: Ye(e.visibility, "players"),
    notes: "",
    iconColor: "",
    iconSize: 30,
    iconStyle: "star",
    pulse: !0,
    primaryObjectId: l,
    objects: t,
    routes: u
  };
}
function us(e, t) {
  var m;
  const o = (Array.isArray(e.systems) ? e.systems : []).map(ds), u = String(e.currentSystemId || ((m = o[0]) == null ? void 0 : m.id) || ""), l = fi(e, o, u, It(e), Array.isArray(e.routes) ? e.routes : []);
  return {
    ...e,
    schemaVersion: Ae,
    migratedFromSchema: t,
    systems: [l],
    routes: [],
    currentLocation: { systemId: l.id, objectId: l.primaryObjectId },
    currentSystemId: l.id
  };
}
function Dt(e) {
  return !!(e != null && e.id && (e == null ? void 0 : e.primaryObjectId) === `${e.id}-object` && Array.isArray(e.objects) && e.objects.some((t) => t.id === e.primaryObjectId));
}
function ms(e) {
  var ne, V, ee, se;
  const t = Array.isArray(e.systems) ? e.systems : [], s = t.filter(Dt), o = t.filter((R) => !Dt(R));
  if (!s.length && t.length) return { ...e, schemaVersion: Ae };
  const u = new Set(o.map((R) => String(R.id)));
  let l = It(e);
  u.has(l) && (l = `${l}-legacy`);
  const m = new Set(s.map((R) => String(R.id))), d = new Map(s.map((R) => [String(R.id), String(R.primaryObjectId)])), k = s.flatMap((R) => (R.objects ?? []).map((F) => {
    const oe = F.id === R.primaryObjectId;
    return {
      ...F,
      x: oe ? R.x : F.x,
      y: oe ? R.y : F.y,
      visibility: F.visibility === "inherit" ? R.visibility : F.visibility,
      factionId: F.factionId || R.factionId || ""
    };
  })), h = String(((ne = e.currentLocation) == null ? void 0 : ne.systemId) || e.currentSystemId || ""), w = s.find((R) => R.id === h), L = String(((V = e.currentLocation) == null ? void 0 : V.objectId) || (w == null ? void 0 : w.primaryObjectId) || ((ee = k[0]) == null ? void 0 : ee.id) || ""), _ = Array.isArray(e.routes) ? e.routes : [], A = _.filter((R) => m.has(String(R.fromSystemId)) && m.has(String(R.toSystemId))).map((R) => ({ ...R, fromSystemId: d.get(String(R.fromSystemId)), toSystemId: d.get(String(R.toSystemId)) })), q = fi(e, k, L, l, A), D = [q, ...o], U = new Set(D.map((R) => String(R.id))), T = /* @__PURE__ */ new Set(), K = _.filter((R) => !(m.has(String(R.fromSystemId)) && m.has(String(R.toSystemId)))).map((R) => ({
    ...R,
    fromSystemId: m.has(String(R.fromSystemId)) ? l : R.fromSystemId,
    toSystemId: m.has(String(R.toSystemId)) ? l : R.toSystemId
  })).filter((R) => {
    if (R.fromSystemId === R.toSystemId || !U.has(String(R.fromSystemId)) || !U.has(String(R.toSystemId))) return !1;
    const F = [R.fromSystemId, R.toSystemId].sort().join(":");
    return T.has(F) ? !1 : (T.add(F), !0);
  }), Q = m.has(h) || !U.has(h) ? l : h;
  return {
    ...e,
    schemaVersion: Ae,
    migratedFromSchema: 2,
    systems: D,
    routes: K,
    currentLocation: { systemId: Q, objectId: Q === l ? q.primaryObjectId : ((se = e.currentLocation) == null ? void 0 : se.objectId) ?? "" },
    currentSystemId: Q
  };
}
function fs(e = {}) {
  const t = Number(e.schemaVersion) || 1;
  if (t > Ae) throw new Error(`Galaxy Map schema ${t} is newer than supported schema ${Ae}.`);
  return t >= Ae ? { ...e, schemaVersion: Ae } : t < 2 ? us(e, t) : ms(e);
}
function Y(e = {}) {
  var w, L, _, A;
  const t = fs(e), s = Array.isArray(t.systems) ? t.systems.map(di) : [], o = Array.isArray(t.routes) ? t.routes.map(bt) : [], u = Array.isArray(t.factions) ? t.factions.map(mi) : [], l = String(((w = t.currentLocation) == null ? void 0 : w.systemId) || t.currentSystemId || ((L = s[0]) == null ? void 0 : L.id) || ""), m = s.some((q) => q.id === l) ? l : ((_ = s[0]) == null ? void 0 : _.id) ?? "", d = s.find((q) => q.id === m), k = String(((A = t.currentLocation) == null ? void 0 : A.objectId) || ""), h = d != null && d.objects.some((q) => q.id === k) ? k : (d == null ? void 0 : d.primaryObjectId) ?? "";
  return {
    schemaVersion: Ae,
    id: String(t.id || xe("map")),
    title: String(t.title || "Untitled Galaxy Map"),
    subtitle: String(t.subtitle || ""),
    description: String(t.description || ""),
    backgroundImage: String(t.backgroundImage || ""),
    visibility: Ye(t.visibility, "players"),
    travelApprovalMode: ht(t.travelApprovalMode),
    currentLocation: { systemId: m, objectId: h },
    currentSystemId: m,
    systems: s,
    routes: o,
    factions: u
  };
}
function Ne(e, t) {
  return (t == null ? void 0 : t.visibility) === "inherit" ? (e == null ? void 0 : e.visibility) ?? "gm" : (t == null ? void 0 : t.visibility) ?? "gm";
}
const ps = "modules/galaxy-map/assets/frames/galaxy-frame-cyan.svg";
let Gt = null;
const Bt = /* @__PURE__ */ new Map();
let Xe = null;
const Je = {
  default: { primary: "#69e8ff", success: "#62ffb6", background: "#03070b" },
  ember: { primary: "#ffb86b", success: "#ffe08a", background: "#0d0604" },
  violet: { primary: "#a9b8ff", success: "#7dffc4", background: "#070713" },
  "space-police": { primary: "#fff15a", success: "#9fffd1", background: "#020202" },
  red: { primary: "#ff304f", success: "#66ffc7", background: "#050103" },
  corporate: { primary: "#147dba", success: "#21875c", background: "#dce3e6" }
};
function zt(e, t, s) {
  const o = (m) => [1, 3, 5].map((d) => Number.parseInt(m.slice(d, d + 2), 16)), u = o(e), l = o(t);
  return `rgb(${u.map((m, d) => Math.round(m * s + l[d] * (1 - s))).join(", ")})`;
}
function hs() {
  var o, u, l, m, d, k;
  const e = document.documentElement, t = ((o = e == null ? void 0 : e.dataset) == null ? void 0 : o.holosuiteDeviceStyle) || ((l = (u = document.body) == null ? void 0 : u.dataset) == null ? void 0 : l.holosuiteDeviceStyle) || "";
  if (Je[t]) return Je[t];
  const s = ((m = e == null ? void 0 : e.dataset) == null ? void 0 : m.holosuiteTheme) || ((k = (d = document.body) == null ? void 0 : d.dataset) == null ? void 0 : k.holosuiteTheme) || "default";
  return Je[s] ?? Je.default;
}
async function pi(e) {
  const { primary: t, success: s, background: o } = hs(), u = zt(t, o, 0.58), l = zt(t, o, 0.34), m = [t, s, u, l, o].join("|");
  e.dataset.gmfFramePalette = m;
  let d = Bt.get(m);
  if (!d)
    try {
      Gt ?? (Gt = fetch(ps).then((w) => {
        if (!w.ok) throw new Error(`Galaxy frame request failed (${w.status})`);
        return w.text();
      }));
      let k = await Gt;
      k = k.replace(/<script\b[\s\S]*?<\/script>/gi, "");
      const h = /* @__PURE__ */ new Map([
        ["#18ebed", t],
        ["#28f3f5", t],
        ["#3be8e4", t],
        ["#64f4f1", s],
        ["#1490ab", u],
        ["#22788b", l],
        ["#042228", o]
      ]);
      for (const [w, L] of h) k = k.replace(new RegExp(w, "gi"), L);
      d = URL.createObjectURL(new Blob([k], { type: "image/svg+xml" })), Bt.set(m, d);
    } catch {
      return;
    }
  e.isConnected && e.dataset.gmfFramePalette === m && e.style.setProperty("--gmf-frame-image", `url("${d}")`);
}
function ys() {
  if (Xe) return;
  Xe = new MutationObserver(() => {
    document.querySelectorAll(".gmf-manager-window, .gmf-map-window, .gmf-crud-dialog").forEach((t) => void pi(t));
  });
  const e = { attributes: !0, attributeFilter: ["data-holosuite-theme", "data-holosuite-device-style"] };
  Xe.observe(document.documentElement, e), document.body && Xe.observe(document.body, e);
}
function hi(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
function yi(e) {
  var t, s;
  return e ? (t = e.matches) != null && t.call(e, ".window-app, .application, .app") ? e : (s = e.closest) == null ? void 0 : s.call(e, ".window-app, .application, .app") : null;
}
function Qe(e, t) {
  const s = hi(t), o = yi(s);
  o && (ys(), pi(o));
  const u = Array.from((s == null ? void 0 : s.querySelectorAll("[data-gmf-window-drag]")) ?? []);
  if (!(!s || !o || !u.length)) {
    s.querySelectorAll("[data-action='close-window']").forEach((l) => {
      l.dataset.gmfCloseBound !== "true" && (l.dataset.gmfCloseBound = "true", l.addEventListener("click", () => {
        var m;
        return (m = e.close) == null ? void 0 : m.call(e);
      }));
    });
    for (const l of u)
      l.dataset.gmfDragBound !== "true" && (l.dataset.gmfDragBound = "true", l.addEventListener("pointerdown", (m) => {
        var D, U, T;
        if (m.button !== 0) return;
        const d = m.target;
        if ((D = d == null ? void 0 : d.closest) != null && D.call(d, "button, input, select, textarea, a, [data-action]")) return;
        const k = o.getBoundingClientRect(), h = m.clientX, w = m.clientY, L = k.left, _ = k.top;
        (U = e.bringToFront ?? e.bringToTop) == null || U.call(e), (T = l.setPointerCapture) == null || T.call(l, m.pointerId), l.classList.add("is-dragging");
        const A = (K) => {
          var se;
          const Q = o.getBoundingClientRect().width, ne = o.getBoundingClientRect().height, V = Math.max(0, Math.min(window.innerWidth - Math.min(Q, 80), L + K.clientX - h)), ee = Math.max(0, Math.min(window.innerHeight - Math.min(ne, 48), _ + K.clientY - w));
          (se = e.setPosition) == null || se.call(e, { left: V, top: ee });
        }, q = () => {
          l.classList.remove("is-dragging"), l.removeEventListener("pointermove", A), l.removeEventListener("pointerup", q), l.removeEventListener("pointercancel", q);
        };
        l.addEventListener("pointermove", A), l.addEventListener("pointerup", q), l.addEventListener("pointercancel", q);
      }));
  }
}
function gs(e, t) {
  var h, w;
  const s = hi(t), o = yi(s), u = (h = o == null ? void 0 : o.querySelector) == null ? void 0 : h.call(o, ":scope > .window-content");
  if (!s || !o || !u || u.querySelector(":scope > .gmf-dialog-header")) return;
  const l = document.createElement("header");
  l.className = "gmf-dialog-header", l.dataset.gmfWindowDrag = "true";
  const m = document.createElement("div");
  m.className = "gmf-dialog-header__identity", m.innerHTML = '<span class="gmf-dialog-header__orb"><i class="fa-solid fa-satellite"></i></span><span><small>GALAXY MAP // CONTROL PANEL</small><strong></strong></span>';
  const d = m.querySelector("strong");
  d && (d.textContent = (e == null ? void 0 : e.title) || ((w = o.querySelector(".window-title")) == null ? void 0 : w.textContent) || "Galaxy Map");
  const k = document.createElement("button");
  k.type = "button", k.className = "gmf-window-close", k.dataset.action = "close-window", k.title = "Close", k.setAttribute("aria-label", "Close window"), k.innerHTML = '<i class="fa-solid fa-xmark"></i>', l.append(m, k), u.prepend(l), Qe(e, o);
}
const De = {
  classes: ["galaxy-map", "gmf-crud-dialog"]
};
function wt() {
  const { ApplicationV2: e, HandlebarsApplicationMixin: t } = foundry.applications.api;
  return t(e);
}
function Ss(e) {
  return String(e || "galaxy-map").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "galaxy-map";
}
function vs(e, t) {
  const s = JSON.stringify(t, null, 2), o = globalThis.saveDataToFile;
  if (typeof o == "function") {
    o(s, "application/json", e);
    return;
  }
  const u = new Blob([s], { type: "application/json" }), l = URL.createObjectURL(u), m = document.createElement("a");
  m.href = l, m.download = e, document.body.appendChild(m), m.click(), m.remove(), setTimeout(() => URL.revokeObjectURL(l), 0);
}
function Ie(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function gi(e) {
  return (e == null ? void 0 : e[0]) ?? e ?? null;
}
function Ht(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
}
function bs(e = globalThis) {
  var u, l, m;
  const t = (m = (l = (u = e.foundry) == null ? void 0 : u.applications) == null ? void 0 : l.apps) == null ? void 0 : m.FilePicker, s = t == null ? void 0 : t.implementation;
  if (typeof s == "function") return s;
  if (typeof t == "function") return t;
  const o = typeof FilePicker == "function" ? FilePicker : e.FilePicker;
  return typeof o == "function" ? o : null;
}
function Si(e) {
  const t = (s) => s ? e.querySelector(`[name="${s}"]`) : null;
  e.querySelectorAll("[data-browse-target]").forEach((s) => {
    s.addEventListener("click", (o) => {
      o.preventDefault();
      const u = t(s.dataset.browseTarget);
      if (!u) return;
      const l = bs();
      if (!l) {
        console.error("galaxy-map | Foundry FilePicker is unavailable.");
        return;
      }
      new l({
        type: "image",
        current: u.value,
        callback: (m) => {
          u.value = m, Ht(u);
        }
      }).browse();
    });
  }), e.querySelectorAll("[data-clear-target]").forEach((s) => {
    s.addEventListener("click", (o) => {
      o.preventDefault();
      const u = t(s.dataset.clearTarget);
      u && (u.value = "", Ht(u));
    });
  });
}
function Is(e) {
  var V;
  const {
    templateRoot: t,
    getMaps: s,
    prepareMapForManager: o,
    getRawMap: u,
    importMapData: l,
    exportMap: m,
    duplicateMap: d,
    deleteMap: k,
    createMap: h,
    deleteSystem: w,
    deleteObject: L,
    deleteRoute: _,
    deleteFaction: A,
    openMap: q,
    showMapToPlayers: D,
    hideSystemFromPlayers: U,
    hideRouteFromPlayers: T,
    hideFactionFromPlayers: K,
    notifyError: Q,
    clearManagerApp: ne
  } = e;
  return V = class extends wt() {
    constructor(R = {}) {
      super(R);
      J(this, "selectedMapId");
      J(this, "activeTab");
      J(this, "expandedSystemId");
      this.selectedMapId = R.selectedMapId ?? null, this.activeTab = ["systems", "routes", "factions"].includes(R.activeTab) ? R.activeTab : "systems", this.expandedSystemId = R.expandedSystemId;
    }
    async _prepareContext(R) {
      var ce, re;
      const F = await super._prepareContext(R), oe = s().sort((ge, ve) => ge.title.localeCompare(ve.title));
      (!this.selectedMapId || !oe.some((ge) => ge.id === this.selectedMapId)) && (this.selectedMapId = ((ce = oe[0]) == null ? void 0 : ce.id) ?? null);
      const ae = this.selectedMapId ? o(u(this.selectedMapId)) : null;
      if (ae) {
        const ge = new Set(ae.systems.map((ve) => ve.id));
        this.expandedSystemId && !ge.has(this.expandedSystemId) && (this.expandedSystemId = void 0), this.expandedSystemId === void 0 && (this.expandedSystemId = ((re = ae.systems[0]) == null ? void 0 : re.id) ?? null), ae.systems = ae.systems.map((ve) => ({
          ...ve,
          isExpanded: ve.id === this.expandedSystemId
        }));
      }
      return {
        ...F,
        maps: oe,
        selectedMap: ae,
        selectedMapId: this.selectedMapId,
        activeTab: this.activeTab,
        showSystems: this.activeTab === "systems",
        showRoutes: this.activeTab === "routes",
        showFactions: this.activeTab === "factions",
        hasMaps: oe.length > 0
      };
    }
    _attachPartListeners(R, F, oe) {
      var ae, ce, re, ge, ve, Oe, Pe;
      super._attachPartListeners(R, F, oe), Qe(this, F), (ae = F.querySelector("[data-action='create-map']")) == null || ae.addEventListener("click", () => this._onCreateMap()), (ce = F.querySelector("[data-action='edit-map-metadata']")) == null || ce.addEventListener("click", () => {
        this._openViewportEditor("map");
      }), (re = F.querySelector("[data-action='create-system']")) == null || re.addEventListener("click", () => {
        this._openViewportEditor("system");
      }), (ge = F.querySelector("[data-action='create-route']")) == null || ge.addEventListener("click", () => {
        this._openViewportEditor("route");
      }), (ve = F.querySelector("[data-action='create-faction']")) == null || ve.addEventListener("click", () => {
        this._openViewportEditor("faction");
      }), F.querySelectorAll("[data-manager-tab]").forEach((N) => {
        N.addEventListener("click", () => {
          const Se = N.dataset.managerTab;
          !["systems", "routes", "factions"].includes(Se) || Se === this.activeTab || (this.activeTab = Se, this.render({ force: !0 }));
        });
      }), F.querySelectorAll("[data-toggle-system]").forEach((N) => {
        N.addEventListener("click", () => {
          const Se = N.dataset.toggleSystem;
          this.expandedSystemId = this.expandedSystemId === Se ? null : Se, this.render({ force: !0 });
        });
      }), F.querySelectorAll("[data-edit-system]").forEach((N) => {
        N.addEventListener("click", () => this._openViewportEditor("system", { id: N.dataset.editSystem }));
      }), F.querySelectorAll("[data-create-object]").forEach((N) => {
        N.addEventListener("click", () => this._openViewportEditor("entity", { systemId: N.dataset.createObject }));
      }), F.querySelectorAll("[data-edit-object]").forEach((N) => {
        N.addEventListener("click", () => this._openViewportEditor("entity", { systemId: N.dataset.objectSystem, id: N.dataset.editObject }));
      }), F.querySelectorAll("[data-delete-object]").forEach((N) => {
        N.addEventListener("click", () => this._confirmDeleteObject(N.dataset.objectSystem, N.dataset.deleteObject));
      }), F.querySelectorAll("[data-show-system]").forEach((N) => {
        N.addEventListener("click", () => U(this.selectedMapId, N.dataset.showSystem, !1));
      }), F.querySelectorAll("[data-hide-system]").forEach((N) => {
        N.addEventListener("click", () => U(this.selectedMapId, N.dataset.hideSystem, !0));
      }), F.querySelectorAll("[data-delete-system]").forEach((N) => {
        N.addEventListener("click", () => this._confirmDeleteSystem(N.dataset.deleteSystem));
      }), F.querySelectorAll("[data-edit-route]").forEach((N) => {
        N.addEventListener("click", () => this._openViewportEditor("route", { id: N.dataset.editRoute, systemId: N.dataset.routeSystem }));
      }), F.querySelectorAll("[data-show-route]").forEach((N) => {
        N.addEventListener("click", () => T(this.selectedMapId, N.dataset.showRoute, !1, N.dataset.routeSystem));
      }), F.querySelectorAll("[data-hide-route]").forEach((N) => {
        N.addEventListener("click", () => T(this.selectedMapId, N.dataset.hideRoute, !0, N.dataset.routeSystem));
      }), F.querySelectorAll("[data-delete-route]").forEach((N) => {
        N.addEventListener("click", () => this._confirmDeleteRoute(N.dataset.deleteRoute, N.dataset.routeSystem));
      }), F.querySelectorAll("[data-edit-faction]").forEach((N) => {
        N.addEventListener("click", () => this._openViewportEditor("faction", { id: N.dataset.editFaction }));
      }), F.querySelectorAll("[data-show-faction]").forEach((N) => {
        N.addEventListener("click", () => K(this.selectedMapId, N.dataset.showFaction, !1));
      }), F.querySelectorAll("[data-hide-faction]").forEach((N) => {
        N.addEventListener("click", () => K(this.selectedMapId, N.dataset.hideFaction, !0));
      }), F.querySelectorAll("[data-delete-faction]").forEach((N) => {
        N.addEventListener("click", () => this._confirmDeleteFaction(N.dataset.deleteFaction));
      }), (Oe = F.querySelector("[data-action='export-map']")) == null || Oe.addEventListener("click", () => {
        this.selectedMapId && m(this.selectedMapId);
      }), (Pe = F.querySelector("[data-action='import-map']")) == null || Pe.addEventListener("click", () => this._onImportMap()), F.querySelectorAll("[data-select-map]").forEach((N) => {
        N.addEventListener("click", () => {
          this.selectedMapId = N.dataset.selectMap, this.expandedSystemId = void 0, this.render({ force: !0 });
        });
      }), F.querySelectorAll("[data-open-map]").forEach((N) => {
        N.addEventListener("click", () => q(N.dataset.openMap));
      }), F.querySelectorAll("[data-show-map]").forEach((N) => {
        N.addEventListener("click", () => D(N.dataset.showMap));
      }), F.querySelectorAll("[data-duplicate-map]").forEach((N) => {
        N.addEventListener("click", async () => {
          const Se = await d(N.dataset.duplicateMap);
          Se && (this.selectedMapId = Se.id, this.render({ force: !0 }));
        });
      }), F.querySelectorAll("[data-delete-map]").forEach((N) => {
        N.addEventListener("click", async () => {
          const Se = N.dataset.deleteMap, Le = u(Se);
          await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${Ie((Le == null ? void 0 : Le.title) ?? Se)}</strong>? This cannot be undone.</p>`
          }, De) && (await k(Se), this.selectedMapId === Se && (this.selectedMapId = null), this.render({ force: !0 }));
        });
      });
    }
    _onImportMap() {
      const R = document.createElement("input");
      R.type = "file", R.accept = ".json,application/json", R.addEventListener("change", async () => {
        var oe;
        const F = (oe = R.files) == null ? void 0 : oe[0];
        if (F)
          try {
            const ae = JSON.parse(await F.text());
            if (!ae || typeof ae != "object" || Array.isArray(ae))
              throw new Error("The selected file does not contain a Galaxy Map object.");
            const ce = await l(ae);
            if (!ce) return;
            this.selectedMapId = ce.id, this.expandedSystemId = void 0, this.render({ force: !0 });
          } catch (ae) {
            const ce = ae instanceof Error ? ae.message : "The selected file could not be read.";
            Q(`Could not import map: ${ce}`);
          }
      }, { once: !0 }), R.click();
    }
    async _onCreateMap() {
      const R = await h({
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
      R && (this.selectedMapId = R.id, this.render({ force: !0 }));
    }
    _openViewportEditor(R, F = {}) {
      var oe, ae;
      this.selectedMapId && ((ae = (oe = q(this.selectedMapId)) == null ? void 0 : oe.openEditor) == null || ae.call(oe, R, F));
    }
    async _confirmDeleteSystem(R) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, De) && await w(this.selectedMapId, R);
    }
    async _confirmDeleteObject(R, F) {
      await Dialog.confirm({
        title: "Delete Location",
        content: "<p>Delete this location and its linked content from the system?</p>"
      }) && await L(this.selectedMapId, R, F);
    }
    async _confirmDeleteRoute(R, F = "") {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, De) && await _(this.selectedMapId, R, F);
    }
    async _confirmDeleteFaction(R) {
      await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }, De) && await A(this.selectedMapId, R);
    }
    async close(R = {}) {
      return ne(this), super.close(R);
    }
  }, J(V, "DEFAULT_OPTIONS", {
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
  }), J(V, "PARTS", {
    main: {
      template: `${t}/map-manager.hbs`
    }
  }), V;
}
function ws(e, t) {
  const s = (o, u, l) => (u[0] - o[0]) * (l[1] - o[1]) - (u[1] - o[1]) * (l[0] - o[0]);
  return t.flatMap((o) => {
    const u = e.filter((h) => h.factionId === o.id && !h.obscured);
    if (!u.length) return [];
    const l = u.flatMap((h) => Array.from({ length: 12 }, (w, L) => {
      const _ = L * Math.PI / 6;
      return [
        Math.max(1, Math.min(99, h.x + Math.cos(_) * 7)),
        Math.max(1, Math.min(99, h.y + Math.sin(_) * 9))
      ];
    })).sort((h, w) => h[0] - w[0] || h[1] - w[1]), m = (h) => {
      const w = [];
      for (const L of h) {
        for (; w.length > 1 && s(w[w.length - 2], w[w.length - 1], L) <= 0; ) w.pop();
        w.push(L);
      }
      return w.slice(0, -1);
    }, d = [...m(l), ...m([...l].reverse())], k = Math.min(...l.map((h) => h[1]));
    return [{
      id: o.id,
      name: o.name,
      color: o.color,
      points: d.map((h) => h.map((w) => w.toFixed(2)).join(",")).join(" "),
      labelX: (Math.min(...l.map((h) => h[0])) + Math.max(...l.map((h) => h[0]))) / 2,
      labelY: Math.max(3, k + 3)
    }];
  });
}
function vi() {
  var e, t, s;
  try {
    const o = (t = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : t.call(e, "bounty-board");
    if ((o == null ? void 0 : o.active) === !1) return null;
    const u = o.api ?? ((s = game.scifiSuite) == null ? void 0 : s.bountyBoard);
    return typeof (u == null ? void 0 : u.getBountiesForScene) == "function" ? u : null;
  } catch {
    return null;
  }
}
function Ms(e) {
  const t = vi();
  if (!t || !Array.isArray(e == null ? void 0 : e.sceneIds)) return [];
  const s = /* @__PURE__ */ new Set(), o = [];
  try {
    for (const u of e.sceneIds)
      for (const l of t.getBountiesForScene(String(u)) ?? []) {
        const m = String((l == null ? void 0 : l.id) ?? "");
        !m || s.has(m) || (s.add(m), o.push({
          id: m,
          name: String(l.name || "Unknown target"),
          image: String(l.image || ""),
          status: String(l.status || ""),
          statusLabel: String(l.statusLabel || l.status || ""),
          reward: String(l.reward || ""),
          sceneId: String(l.sceneId || u)
        }));
      }
  } catch {
    return [];
  }
  return o;
}
function Ls(e) {
  try {
    const t = vi();
    return typeof (t == null ? void 0 : t.openBounty) == "function" && t.openBounty(String(e)) !== !1;
  } catch {
    return !1;
  }
}
const Fe = /* @__PURE__ */ new Map(), _s = 40, xs = 192;
function Ts(e) {
  return new Promise((t, s) => {
    const o = new Image();
    o.onload = () => t(o), o.onerror = () => s(new Error("Image unavailable")), o.src = e;
  });
}
async function Es(e) {
  if (!e) return null;
  try {
    const t = await Ts(e), s = Math.min(1, xs / Math.max(t.naturalWidth || t.width, t.naturalHeight || t.height)), o = Math.max(2, Math.round((t.naturalWidth || t.width) * s)), u = Math.max(2, Math.round((t.naturalHeight || t.height) * s)), l = document.createElement("canvas");
    l.width = o, l.height = u;
    const m = l.getContext("2d", { willReadFrequently: !0 });
    if (!m) return null;
    m.drawImage(t, 0, 0, o, u);
    const d = m.getImageData(0, 0, o, u), k = m.createImageData(o, u), h = new Float32Array(o * u);
    for (let L = 0; L < h.length; L++) {
      const _ = L * 4;
      h[L] = d.data[_] * 0.299 + d.data[_ + 1] * 0.587 + d.data[_ + 2] * 0.114;
    }
    const w = (L, _) => h[_ * o + L];
    for (let L = 1; L < u - 1; L++)
      for (let _ = 1; _ < o - 1; _++) {
        const A = -w(_ - 1, L - 1) + w(_ + 1, L - 1) - 2 * w(_ - 1, L) + 2 * w(_ + 1, L) - w(_ - 1, L + 1) + w(_ + 1, L + 1), q = -w(_ - 1, L - 1) - 2 * w(_, L - 1) - w(_ + 1, L - 1) + w(_ - 1, L + 1) + 2 * w(_, L + 1) + w(_ + 1, L + 1), D = Math.hypot(A, q), U = Math.max(0, Math.min(235, (D - 34) * 2.1)), T = (L * o + _) * 4;
        k.data[T] = 104, k.data[T + 1] = 241, k.data[T + 2] = 255, k.data[T + 3] = U;
      }
    return m.clearRect(0, 0, o, u), m.putImageData(k, 0, 0), l.toDataURL("image/png");
  } catch {
    return null;
  }
}
function Ps(e, t = "") {
  const s = `${t}\0${e}`, o = Fe.get(s);
  if (o)
    return Fe.delete(s), Fe.set(s, o), o;
  for (; Fe.size >= _s; ) {
    const l = Fe.keys().next().value;
    if (l === void 0) break;
    Fe.delete(l);
  }
  const u = Es(e);
  return Fe.set(s, u), u;
}
function ks({ root: e, stage: t, resolveItems: s, onOpen: o }) {
  const u = e.querySelector("[data-intel-layer]");
  if (!u) return null;
  const l = new AbortController(), m = l.signal, d = document.createElement("aside");
  d.className = "gmf-intel-callout", d.setAttribute("aria-label", "Bounty intel"), d.hidden = !0, d.innerHTML = `
    <span class="gmf-intel-callout__connector" aria-hidden="true"></span>
    <div class="gmf-intel-callout__stack" data-intel-list role="group" aria-label="Matching bounties"></div>`, u.append(d);
  let k = [], h = null, w = null, L = null, _ = 0, A = 0;
  const q = () => {
    w && clearTimeout(w), w = null;
  }, D = () => {
    _++, L && clearTimeout(L), L = null, w = null, h = null, k = [], A++, d.hidden = !0, d.classList.remove("is-visible", "is-left");
  }, U = (V = 180) => {
    q(), _++, L && clearTimeout(L), L = null, w = setTimeout(D, V);
  }, T = () => {
    if (!h || d.hidden) return;
    const V = t.getBoundingClientRect(), ee = h.getBoundingClientRect();
    d.style.setProperty("--gmf-intel-stack-height", `${Math.max(80, V.height - 72)}px`);
    const se = d.offsetWidth || 224, R = d.offsetHeight || 126, F = ee.right - V.left + se + 24 > V.width, oe = F ? ee.left - V.left - se - 18 : ee.right - V.left + 18, ae = Math.max(48, Math.min(V.height - R - 12, ee.top - V.top + ee.height / 2 - R / 2));
    d.classList.toggle("is-left", F), d.style.left = `${Math.max(8, oe)}px`, d.style.top = `${ae}px`;
  }, K = () => {
    const V = d.querySelector("[data-intel-list]");
    if (!V || !k.length) return D();
    V.replaceChildren();
    const ee = ++A;
    k.forEach((se, R) => {
      const F = document.createElement("button");
      F.type = "button", F.className = "gmf-intel-callout__body", F.dataset.intelOpen = se.id, F.style.setProperty("--gmf-intel-index", String(R)), F.style.setProperty("--gmf-intel-delay", `${R * 55}ms`), F.innerHTML = `
        <span class="gmf-intel-callout__portrait"><img alt="" hidden /><i class="fa-solid fa-crosshairs"></i></span>
        <span class="gmf-intel-callout__copy"><small></small><strong></strong><span></span></span>`;
      const oe = F.querySelector("strong"), ae = F.querySelector("small"), ce = F.querySelector(".gmf-intel-callout__copy > span"), re = F.querySelector("img"), ge = F.querySelector("i");
      oe && (oe.textContent = se.name), ae && (ae.textContent = `BOUNTY // ${(se.statusLabel || "INTEL").toUpperCase()}`), ce && (ce.textContent = se.reward || ""), F.addEventListener("click", () => o(se.id), { signal: m }), se.image && re && (re.src = se.image, re.classList.add("is-css-fallback"), re.hidden = !1, ge && (ge.hidden = !0), re.onerror = () => {
        ee === A && (re.hidden = !0, ge && (ge.hidden = !1));
      }, Ps(se.image, se.id).then((ve) => {
        !ve || ee !== A || !F.isConnected || (re.classList.remove("is-css-fallback"), re.src = ve);
      })), V.append(F);
    }), T();
  }, Q = async (V) => {
    q(), h = V;
    const ee = ++_;
    let se = [];
    try {
      se = await s(V.dataset.systemId ?? "");
    } catch {
    }
    if (!(ee !== _ || h !== V)) {
      if (!se.length) return D();
      k = se, d.hidden = !1, K(), requestAnimationFrame(() => {
        T(), d.classList.add("is-visible");
      });
    }
  }, ne = (V) => {
    q(), _++, L && clearTimeout(L), L = setTimeout(() => {
      L = null, Q(V);
    }, 90);
  };
  return e.querySelectorAll("[data-system-id]").forEach((V) => {
    V.addEventListener("pointerenter", () => ne(V), { signal: m }), V.addEventListener("pointerleave", () => U(), { signal: m }), V.addEventListener("focus", () => ne(V), { signal: m }), V.addEventListener("blur", () => U(), { signal: m }), V.addEventListener("pointerdown", () => D(), { signal: m });
  }), d.addEventListener("pointerenter", q, { signal: m }), d.addEventListener("pointerleave", () => U(), { signal: m }), d.addEventListener("click", (V) => V.stopPropagation(), { signal: m }), t.addEventListener("wheel", () => requestAnimationFrame(T), { signal: m }), window.addEventListener("resize", T, { signal: m }), {
    dispose() {
      _++, w && clearTimeout(w), L && clearTimeout(L), l.abort(), d.remove();
    }
  };
}
function qs({ host: e }) {
  const t = document.createElement("aside");
  t.className = "gmf-location-callout", t.hidden = !0, t.innerHTML = `
    <span class="gmf-location-callout__connector" aria-hidden="true"></span>
    <strong data-location-name></strong>`, e.append(t);
  let s = null, o = { x: 0, y: 0, visible: !1 }, u = null;
  const l = () => {
    u && clearTimeout(u), u = null;
  }, m = () => {
    l(), s = null, t.hidden = !0, t.classList.remove("is-visible", "is-left");
  }, d = () => {
    if (!s || t.hidden || !o.visible) return;
    const w = t.offsetWidth || 180, L = t.offsetHeight || 24, _ = o.x + w + 76 > e.clientWidth, A = _ ? o.x - w - 64 : o.x + 64, q = Math.max(8, Math.min(e.clientHeight - L - 8, o.y - L / 2));
    t.classList.toggle("is-left", _), t.style.left = `${Math.max(8, A)}px`, t.style.top = `${q}px`;
  }, k = (w) => {
    l(), s = w;
    const L = t.querySelector("[data-location-name]");
    L && (L.textContent = w.missing ? "Missing linked scene" : w.accessible ? w.name : "Restricted location"), t.hidden = !1, d(), requestAnimationFrame(() => {
      d(), t.classList.add("is-visible");
    });
  }, h = (w = 180) => {
    l(), u = setTimeout(m, w);
  };
  return {
    show: k,
    scheduleHide: h,
    hide: m,
    setAnchor(w) {
      if (o = w, !w.visible) return h(40);
      d();
    },
    dispose() {
      m(), t.remove();
    }
  };
}
function Os(e, t, s) {
  const o = s.querySelector("[data-ship-layer]"), u = s.querySelector(".gmf-map-stage");
  if (!o || !u) return Promise.resolve();
  const l = u.getBoundingClientRect(), m = (t.x - e.x) * l.width / 100, d = (t.y - e.y) * l.height / 100, k = Math.atan2(d, m) * 180 / Math.PI, h = document.createElement("div");
  return h.className = "gmf-travel-ship", h.innerHTML = '<i class="fa-solid fa-rocket"></i>', h.style.left = `${e.x}%`, h.style.top = `${e.y}%`, h.style.setProperty("--gmf-ship-angle", `${k}deg`), o.replaceChildren(h), new Promise((w) => {
    let L = !1;
    const _ = () => {
      L || (L = !0, h.removeEventListener("transitionend", _), h.classList.add("is-arrived"), globalThis.setTimeout(() => {
        h.remove(), w();
      }, 260));
    };
    h.addEventListener("transitionend", _, { once: !0 }), requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        h.style.left = `${t.x}%`, h.style.top = `${t.y}%`;
      });
    }), globalThis.setTimeout(_, vt);
  });
}
function Cs(e, t) {
  const s = e.querySelector(".gmf-orbits"), o = s ? t.rings.map((A) => {
    const q = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    return q.setAttribute("vector-effect", "non-scaling-stroke"), s.append(q), { ...A, ellipse: q };
  }) : [], u = Array.from(e.querySelectorAll(".gmf-system[data-system-id]")), l = Array.from(e.querySelectorAll("[data-route-from][data-route-to]")), m = globalThis.matchMedia("(prefers-reduced-motion: reduce)");
  let d = ei, k = null, h;
  const w = (A = He()) => t.positions(d, A, !m.matches, h);
  function L() {
    const A = w();
    for (const q of u) {
      const D = A.get(q.dataset.systemId);
      if (!D) continue;
      const U = `${Number(D.x.toFixed(5))}%`, T = `${Number(D.y.toFixed(5))}%`;
      q.style.left !== U && (q.style.left = U), q.style.top !== T && (q.style.top = T);
    }
    for (const q of l) {
      const D = A.get(q.dataset.routeFrom), U = A.get(q.dataset.routeTo);
      D && U && (je(q, "x1", D.x), je(q, "y1", D.y), je(q, "x2", U.x), je(q, "y2", U.y));
    }
    for (const { centerId: q, radius: D, ellipse: U } of o) {
      const T = A.get(q), K = si(D, d);
      je(U, "cx", T.x), je(U, "cy", T.y), je(U, "rx", K.x), je(U, "ry", K.y);
    }
  }
  function _() {
    k !== null && cancelAnimationFrame(k), k = null, e.isConnected && (L(), t.animated && !m.matches && (k = requestAnimationFrame(_)));
  }
  return m.addEventListener("change", _), {
    get aspect() {
      return d;
    },
    get motion() {
      return !m.matches;
    },
    setAspect(A) {
      Number.isFinite(A) && A > 0 && (d = A), _();
    },
    previewDrag(A, q) {
      h = { id: A, point: q }, L();
    },
    finishDrag(A, q) {
      var K;
      const D = (K = t.attachments.get(A)) == null ? void 0 : K.attachment, U = D && w().get(D.centerId);
      if (!D || !U) return;
      const T = ni(q, U, d);
      return h = { id: A, point: q, angle: T }, { centerId: D.centerId, orbitId: D.orbitId, angle: T };
    },
    cancelDrag() {
      h = void 0, L();
    },
    position(A, q) {
      return t.attachments.has(A) ? w(q).get(A) : void 0;
    },
    dispose() {
      k !== null && cancelAnimationFrame(k), m.removeEventListener("change", _);
    }
  };
}
function je(e, t, s) {
  const o = String(s);
  e.getAttribute(t) !== o && e.setAttribute(t, o);
}
function As(e, t) {
  const s = e.querySelector("[data-orbit-editor]");
  if (!s) return;
  const o = s.querySelector("[data-orbit-rows]"), u = s.querySelector("[data-orbit-row-template]"), l = s.querySelector("[data-orbit-attachment]"), m = s.querySelector("[data-orbit-placement]"), d = s.querySelector("[data-orbit-angle]"), k = s.querySelector("[data-orbit-motion]"), h = s.querySelector("[data-orbit-speed]"), w = s.querySelector("[data-orbit-period]");
  function L(q, D = !1) {
    const U = u.content.firstElementChild.cloneNode(!0), T = U.querySelector("[data-orbit-radius]");
    U.dataset.orbitId = q.id, T.value = String(q.radius), U.querySelector("[data-remove-orbit]").addEventListener("click", () => U.remove()), o.append(U), D && T.focus();
  }
  for (const q of t.orbits ?? []) L(q);
  s.querySelector("[data-add-orbit]").addEventListener("click", () => {
    L({ id: xe("orbit"), radius: Math.min(100, 15 + o.childElementCount * 10) }, !0);
  });
  const _ = t.orbit;
  _ && (d.value = String(_.angle), _.period && (k.value = _.clockwise ? "clockwise" : "counterclockwise", w.value = String(_.period)));
  function A() {
    m.hidden = !l.value, d.disabled = m.hidden, h.hidden = k.value === "fixed", w.disabled = m.hidden || h.hidden;
  }
  return l.addEventListener("change", A), k.addEventListener("change", A), A(), () => {
    const q = Array.from(o.querySelectorAll("[data-orbit-row]"), (ee) => ({
      id: ee.dataset.orbitId,
      radius: Number(ee.querySelector("[data-orbit-radius]").value)
    })), D = t.orbits ?? [], T = q.length !== D.length || q.some((ee, se) => ee.id !== D[se].id || ee.radius !== D[se].radius) ? { orbits: q } : {};
    if (!l.value) return _ ? { ...T, orbit: null } : T;
    const [K, Q] = JSON.parse(l.value), ne = {
      centerId: K,
      orbitId: Q,
      angle: Number(d.value),
      period: h.hidden ? 0 : Number(w.value),
      clockwise: h.hidden ? (_ == null ? void 0 : _.clockwise) ?? !0 : k.value === "clockwise"
    };
    return _ && Object.entries(ne).every(([ee, se]) => _[ee] === se) ? T : { ...T, orbit: { ...ne, epoch: He() } };
  };
}
function js(e) {
  var s, o;
  return (((o = (s = foundry.applications) == null ? void 0 : s.ux) == null ? void 0 : o.TextEditor) ?? globalThis.TextEditor).getDragEventData(e) ?? {};
}
async function bi(e) {
  var l, m, d, k, h, w, L, _;
  const t = js(e), s = globalThis.fromUuid, o = t.uuid && s ? await s(t.uuid) : null;
  if (["Scene", "JournalEntry"].includes(o == null ? void 0 : o.documentName)) return o;
  const u = String(t.sceneId || t.journalId || t.id || "");
  return u ? t.type === "Scene" ? ((m = (l = game.scenes) == null ? void 0 : l.get) == null ? void 0 : m.call(l, u)) ?? null : ["JournalEntry", "Journal"].includes(t.type) ? ((k = (d = game.journal) == null ? void 0 : d.get) == null ? void 0 : k.call(d, u)) ?? null : ((w = (h = game.scenes) == null ? void 0 : h.get) == null ? void 0 : w.call(h, u)) ?? ((_ = (L = game.journal) == null ? void 0 : L.get) == null ? void 0 : _.call(L, u)) ?? null : null;
}
async function Rs(e) {
  const t = await bi(e);
  return (t == null ? void 0 : t.documentName) === "Scene" ? t : null;
}
function $s(e) {
  var Le;
  const {
    templateRoot: t,
    getRawMap: s,
    prepareMapForDisplay: o,
    upsertSystem: u,
    upsertObject: l,
    upsertRoute: m,
    upsertFaction: d,
    updateMapMetadata: k,
    deleteFaction: h,
    getTextureGuideMarkup: w,
    activateObjectEditorControls: L,
    revealSystemToPlayers: _,
    revealRouteToPlayers: A,
    hideSystemFromPlayers: q,
    setObjectVisibility: D,
    hideRouteFromPlayers: U,
    deleteSystem: T,
    deleteObject: K,
    deleteRoute: Q,
    setCurrentSystem: ne,
    setCurrentObject: V,
    requestTravelToSystem: ee,
    requestTravelToObject: se,
    exportMap: R,
    getTravelRoute: F,
    broadcastTravelAnimation: oe,
    broadcastObjectTravelAnimation: ae,
    notifyInfo: ce,
    notifyError: re,
    saveSystemPosition: ge,
    saveObjectPosition: ve,
    savePlanetLocation: Oe,
    removePlanetLocation: Pe,
    unlinkPlanetScene: N,
    clearMapView: Se
  } = e;
  return Le = class extends wt() {
    constructor(n = {}) {
      var a;
      const i = n.mapId, r = n.playerMode ?? !((a = game.user) != null && a.isGM);
      super({
        ...n,
        id: `galaxy-map-view-${r ? "player" : "gm"}-${i}`
      });
      J(this, "mapId");
      J(this, "playerMode");
      J(this, "selectedSystemId");
      J(this, "selectedRouteId");
      J(this, "activeSystemId");
      J(this, "selectedObjectId");
      J(this, "zoom");
      J(this, "panX");
      J(this, "panY");
      J(this, "_drag");
      J(this, "_contextTarget");
      J(this, "_boundContextClose");
      J(this, "externalFocus");
      J(this, "_externalFocusTimeout");
      J(this, "_pendingFocusZoom");
      J(this, "showTerritories", !0);
      J(this, "showRoutes", !0);
      J(this, "hardContrast", !1);
      J(this, "planetSystemId", null);
      J(this, "planetStatic", !1);
      J(this, "_planetStaticViewKey", null);
      J(this, "_planetRenderer", null);
      J(this, "_planetGeneration", 0);
      J(this, "_planetReturnFocus", !1);
      J(this, "_bountyIntelCallout", null);
      J(this, "_planetLocationCallout", null);
      J(this, "creationPanel", null);
      J(this, "factionRegistry", !1);
      J(this, "_selectionTimer", null);
      J(this, "_worldWidth", 0);
      J(this, "_worldHeight", 0);
      J(this, "_orbitLayer", null);
      J(this, "showOrbits", !0);
      J(this, "_viewportResizeObserver", null);
      J(this, "_viewportStage", null);
      J(this, "_baseWindowHeight", null);
      this.mapId = i, this.playerMode = r, this.selectedSystemId = n.selectedSystemId ?? null, this.selectedRouteId = n.selectedRouteId ?? null, this.activeSystemId = n.activeSystemId ?? null, this.selectedObjectId = n.selectedObjectId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null, this.externalFocus = null, this._externalFocusTimeout = null, this._pendingFocusZoom = null;
    }
    get title() {
      const n = s(this.mapId), i = this.playerMode ? "Player View" : "GM View";
      return n ? `${n.title} - ${i}` : `Galaxy Map - ${i}`;
    }
    async _prepareContext(n) {
      var z, Z, fe, ue, he, X, pe, be;
      const i = await super._prepareContext(n), r = s(this.mapId), a = r ? o(r, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      }) : null;
      a != null && a.systems && (a.systems = a.systems.map((P) => ({
        ...P,
        displayType: "system",
        factionName: "System",
        factionColor: "#58d8ff",
        animatedCelestial: !1,
        hasCustomMarker: !!P.displayMarkerImage
      })), a.selectedSystem && (a.selectedSystem = a.systems.find((P) => P.id === a.selectedSystem.id) ?? null)), a != null && a.systems && this.externalFocus && (a.systems = a.systems.map((P) => P.id === this.externalFocus.systemId ? { ...P, isExternalFocus: !0, externalFocus: this.externalFocus } : P), ((z = a.selectedSystem) == null ? void 0 : z.id) === this.externalFocus.systemId && (a.selectedSystem = a.systems.find((P) => P.id === this.externalFocus.systemId))), !this.activeSystemId && this.selectedSystemId && !(a != null && a.selectedSystem) && (this.selectedSystemId = null);
      const c = (a == null ? void 0 : a.systems.find((P) => P.id === this.activeSystemId)) ?? null;
      c && (a.backgroundImage = c.backgroundImage || "");
      const y = new Map(((a == null ? void 0 : a.factions) ?? []).map((P) => [P.id, P])), S = c ? c.objects.filter((P) => !this.playerMode || Ne(c, P) === "players").map((P) => {
        var Ee;
        const ie = this.playerMode && P.status === "undiscovered", ye = y.get(P.factionId), Te = ie ? "" : P.markerImage;
        return {
          ...P,
          systemId: c.id,
          displayName: ie ? "???" : P.name,
          displayDescription: ie ? "Unresolved sensor contact. Details are not available." : P.description,
          displayType: ie ? "unknown" : P.kind,
          displayStatus: ie ? "undiscovered" : P.status,
          factionName: (ye == null ? void 0 : ye.name) ?? "Unaffiliated",
          factionColor: P.iconColor || (ye == null ? void 0 : ye.color) || "#58d8ff",
          displayMarkerImage: Te,
          hasCustomMarker: !!Te,
          obscured: ie,
          gmOnly: Ne(c, P) === "gm",
          isSelected: P.id === this.selectedObjectId,
          isCurrent: ((Ee = a == null ? void 0 : a.currentLocation) == null ? void 0 : Ee.objectId) === P.id,
          animatedCelestial: !Te && ct.includes(P.iconStyle),
          hasJournal: !!(!ie && P.journalId),
          hasScenes: !!(!ie && P.sceneIds.length),
          showImage: !!(!ie && P.image),
          canInspectSystem: !!Ce({ ...P, obscured: ie })
        };
      }) : [];
      c && this.selectedObjectId && !S.some((P) => P.id === this.selectedObjectId) && (this.selectedObjectId = null);
      const g = S.find((P) => P.id === this.selectedObjectId) ?? null, E = new Set(S.map((P) => P.id)), O = c ? (c.routes ?? []).filter((P) => (!this.playerMode || P.visibility === "players") && E.has(P.fromSystemId) && E.has(P.toSystemId)).map((P) => {
        const ie = S.find((Te) => Te.id === P.fromSystemId), ye = S.find((Te) => Te.id === P.toSystemId);
        return {
          ...P,
          from: ie,
          to: ye,
          fromName: (ie == null ? void 0 : ie.displayName) ?? P.fromSystemId,
          toName: (ye == null ? void 0 : ye.displayName) ?? P.toSystemId,
          isSelected: P.id === this.selectedRouteId,
          isActive: P.id === this.selectedRouteId,
          gmOnly: P.visibility === "gm"
        };
      }) : [], G = O.find((P) => P.id === this.selectedRouteId) ?? null, B = S.find((P) => P.isCurrent) ?? null, W = g && B && g.id !== B.id ? O.find((P) => P.fromSystemId === B.id && P.toSystemId === g.id || P.toSystemId === B.id && P.fromSystemId === g.id) : null;
      g && (g.canTravel = !!W, g.isDestination = !!(W && !g.isCurrent), g.travelRouteId = (W == null ? void 0 : W.id) ?? ""), O.forEach((P) => {
        P.isActive = P.isSelected || P.id === (W == null ? void 0 : W.id);
      }), c && (a.systems = S, a.routes = O, a.selectedSystem = G ? null : g, a.selectedRoute = G, a.currentSystem = B);
      const H = S.find((P) => P.id === this.planetSystemId) ?? (c ? null : a == null ? void 0 : a.systems.find((P) => P.id === this.planetSystemId)), te = !this.playerMode || (r == null ? void 0 : r.visibility) === "players" ? Ce(H) : null;
      te || (this.planetSystemId = null);
      const de = c && !te && S.some((P) => {
        var ie;
        return (ie = P.orbits) == null ? void 0 : ie.length;
      }) ? rt(
        S,
        new Set(S.filter((P) => P.obscured).map((P) => P.id))
      ) : null, f = H && te ? `${H.id}:${te.preset}` : null;
      f !== this._planetStaticViewKey && (this._planetStaticViewKey = f, this.planetStatic = !!(f && Qi(te == null ? void 0 : te.preset)));
      const v = H && te ? this._preparePlanetLocations(H, te.shape) : [], I = H ?? g, b = !!((Z = game.user) != null && Z.isGM && !this.playerMode && c && I), M = ((I == null ? void 0 : I.sceneIds) ?? []).map((P) => {
        var ie, ye;
        return (ye = (ie = game.scenes) == null ? void 0 : ie.get) == null ? void 0 : ye.call(ie, P);
      }).filter((P) => {
        var ie, ye;
        return P && (((ie = game.user) == null ? void 0 : ie.isGM) || ((ye = P.testUserPermission) == null ? void 0 : ye.call(P, game.user, "OBSERVER")));
      }).map((P) => ({ id: P.id, uuid: P.uuid, name: P.name || "Linked Scene" })), x = I != null && I.journalId ? (ue = (fe = game.journal) == null ? void 0 : fe.get) == null ? void 0 : ue.call(fe, I.journalId) : null, $ = x && ((he = game.user) != null && he.isGM || (X = x.testUserPermission) != null && X.call(x, game.user, "OBSERVER")) ? { id: x.id, uuid: x.uuid, name: x.name || "Linked Journal" } : null, C = this.creationPanel ? {
        ...this.creationPanel,
        ...this.creationPanel.data,
        kind: this.creationPanel.kind,
        entityKind: (pe = this.creationPanel.data) == null ? void 0 : pe.kind,
        isSystem: this.creationPanel.kind === "system",
        isEntity: this.creationPanel.kind === "entity",
        isRoute: this.creationPanel.kind === "route",
        isFaction: this.creationPanel.kind === "faction",
        isMap: this.creationPanel.kind === "map",
        mapTitle: (be = this.creationPanel.data) == null ? void 0 : be.title,
        title: this.creationPanel.kind === "map" ? "Edit Galaxy" : `${this.creationPanel.editId ? "Edit" : "Create"} ${{ system: "System", entity: "Location", route: "Route", faction: "Faction" }[this.creationPanel.kind]}`,
        submitLabel: this.creationPanel.editId ? "Save changes" : "Create",
        systemOptions: (c ? S : (a == null ? void 0 : a.systems) ?? []).map((P) => ({ id: P.id, name: P.displayName || P.name })),
        orbitOptions: this.creationPanel.kind === "entity" ? S.flatMap((P) => (P.orbits ?? []).flatMap((ie, ye) => {
          const Te = { centerId: P.id, orbitId: ie.id };
          if (!gt(S, this.creationPanel.editId, Te)) return [];
          const Ee = this.creationPanel.data.orbit;
          return [{
            value: JSON.stringify([P.id, ie.id]),
            label: `${P.name} · Orbit ${ye + 1} (${ie.radius}%)`,
            selected: (Ee == null ? void 0 : Ee.centerId) === P.id && Ee.orbitId === ie.id
          }];
        })) : [],
        factionOptions: ((a == null ? void 0 : a.factions) ?? []).map((P) => ({ id: P.id, name: P.name }))
      } : null;
      return {
        ...i,
        map: a,
        systemView: !!(c && !te),
        activeSystem: c,
        selectedObject: g,
        planetView: !!te,
        planetSystem: H,
        planetAppearance: te,
        planetLocations: v,
        hasPlanetLocations: v.length > 0,
        canPlacePlanetLocations: b,
        linkedPlanetScenes: M,
        linkedPlanetJournal: $,
        creationPanel: C,
        factionRegistry: this.factionRegistry,
        appearanceGuideMarkup: C != null && C.isEntity ? w(C.planetShape || "sphere") : "",
        showInspector: !!(C || this.factionRegistry || te || a != null && a.selectedSystem || a != null && a.selectedRoute),
        territories: a ? ws(a.systems, a.factions) : [],
        showTerritories: this.showTerritories,
        showRoutes: this.showRoutes,
        orbitLayout: de,
        hasOrbits: !!(de != null && de.rings.length),
        showOrbits: this.showOrbits,
        hardContrast: this.hardContrast,
        mapId: this.mapId,
        playerMode: this.playerMode,
        zoomPercent: Math.round(this.zoom * 100),
        panX: this.panX,
        panY: this.panY,
        zoom: this.zoom,
        missingMap: !r
      };
    }
    _onRender(n, i) {
      var a, c, y;
      (a = this._orbitLayer) == null || a.dispose(), this._orbitLayer = null, (c = this._bountyIntelCallout) == null || c.dispose(), this._bountyIntelCallout = null, this._disposePlanetRenderer(), super._onRender(n, i);
      const r = this.element;
      if (r) {
        this._attachPartListeners("main", r, i), this._observeViewport(r);
        const S = r.querySelector(".gmf-map-viewport");
        if (S && n.hasOrbits && (this._orbitLayer = Cs(S, n.orbitLayout)), this._applyViewportTransform(r), this._mountBountyIntelCallout(r), this.externalFocus && this._pendingFocusZoom !== null) {
          const g = Y(s(this.mapId)).systems.find((E) => E.id === this.externalFocus.systemId);
          g && this._centerOnSystem(g, r, this._pendingFocusZoom), this._pendingFocusZoom = null;
        }
        n.planetView ? this._mountPlanetRenderer(r, n.planetAppearance) : this._planetReturnFocus && ((y = r.querySelector("[data-action='inspect-system']")) == null || y.focus(), this._planetReturnFocus = !1);
      }
    }
    _attachPartListeners(n, i, r) {
      var S, g, E, O, G, B, W, H, te, de, f, v, I, b, M, x, $, C, z, Z, fe, ue, he;
      const a = (S = i.matches) != null && S.call(i, ".gmf-map-stage") ? i : (g = i.querySelector) == null ? void 0 : g.call(i, ".gmf-map-stage, .gmf-planet-stage");
      if ((a == null ? void 0 : a.dataset.gmfMapBound) === "true") return;
      a && (a.dataset.gmfMapBound = "true");
      const c = (E = a == null ? void 0 : a.matches) != null && E.call(a, ".gmf-map-stage") ? a : null;
      super._attachPartListeners(n, i, r), Qe(this, i), this._attachPlanetListeners(i), this._attachCreationPanel(i);
      const y = i.querySelector(".gmf-object-appearance-panel");
      y && (L(y), this._attachAppearancePreview(i)), (O = i.querySelector("[data-action='toggle-territories']")) == null || O.addEventListener("click", () => {
        this.showTerritories = !this.showTerritories, this.render({ force: !0 });
      }), (G = i.querySelector("[data-action='toggle-routes']")) == null || G.addEventListener("click", () => {
        this.showRoutes = !this.showRoutes, this.render({ force: !0 });
      }), (B = i.querySelector("[data-action='toggle-orbits']")) == null || B.addEventListener("click", () => {
        this.showOrbits = !this.showOrbits, this.render({ force: !0 });
      }), (W = i.querySelector("[data-action='edit-orbits']")) == null || W.addEventListener("click", () => {
        var X;
        !this.playerMode && ((X = game.user) != null && X.isGM) && this.selectedObjectId && this._openEditPanel("entity", this.selectedObjectId, !0);
      }), (H = i.querySelector("[data-action='edit-current-layer']")) == null || H.addEventListener("click", () => {
        var X;
        !((X = game.user) != null && X.isGM) || this.playerMode || (this.activeSystemId ? this._openEditPanel("system", this.activeSystemId) : this._openCreationPanel("map", Y(s(this.mapId)), this.mapId));
      }), (te = i.querySelector("[data-action='toggle-hard-contrast']")) == null || te.addEventListener("click", (X) => {
        var be;
        this.hardContrast = !this.hardContrast;
        const pe = (be = i.matches) != null && be.call(i, ".gmf-galaxy") ? i : i.querySelector(".gmf-galaxy");
        pe == null || pe.classList.toggle("is-hard-contrast", this.hardContrast), X.currentTarget.setAttribute("aria-pressed", String(this.hardContrast));
      }), i.querySelectorAll("[data-system-id]").forEach((X) => {
        var pe, be;
        X.addEventListener("click", (P) => {
          if (X.dataset.dragged === "true") {
            X.dataset.dragged = "false";
            return;
          }
          P.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = globalThis.setTimeout(() => {
            this.activeSystemId ? this.selectedObjectId = X.dataset.systemId : this.selectedSystemId = X.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
          }, 180);
        }), X.addEventListener("dblclick", (P) => {
          var ye;
          P.preventDefault(), P.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
          const ie = X.dataset.systemId;
          if (this.selectedRouteId = null, this.creationPanel = null, this.activeSystemId) {
            this.selectedObjectId = ie;
            const Te = (ye = Y(s(this.mapId)).systems.find((Ee) => Ee.id === this.activeSystemId)) == null ? void 0 : ye.objects.find((Ee) => Ee.id === ie);
            Ce(Te) && (this.planetSystemId = ie);
          } else
            this.selectedSystemId = ie, this.activeSystemId = ie, this.selectedObjectId = null;
          this.render({ force: !0 });
        }), !this.playerMode && ((pe = game.user) != null && pe.isGM) && ((be = X.querySelector("[data-resize-marker]")) == null || be.addEventListener("pointerdown", (P) => this._startMarkerResize(P, X)), X.addEventListener("pointerdown", (P) => this._startSystemDrag(P, i, X)));
      }), this._mountBountyIntelCallout(i), i.querySelectorAll("[data-route-id]").forEach((X) => {
        X.addEventListener("click", (pe) => {
          var be;
          if (pe.stopPropagation(), this.selectedRouteId = X.dataset.routeId, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, !this.playerMode && ((be = game.user) != null && be.isGM)) {
            this._openEditPanel("route", X.dataset.routeId);
            return;
          }
          this.render({ force: !0 });
        });
      }), c == null || c.addEventListener("wheel", (X) => this._onWheelZoom(X, i), { passive: !1 }), c == null || c.addEventListener("pointerdown", (X) => this._startPan(X, i)), c == null || c.addEventListener("contextmenu", (X) => this._openContextMenu(X, i), { capture: !0 }), i.querySelectorAll("[data-context-action]").forEach((X) => {
        X.addEventListener("click", (pe) => this._handleContextAction(pe, i));
      }), (de = i.querySelector("[data-action='open-journal']")) == null || de.addEventListener("click", () => this._openLinkedJournal()), (f = i.querySelector("[data-action='edit-system']")) == null || f.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._openEditPanel("entity", this.selectedObjectId) : this.selectedSystemId && this._openEditPanel("system", this.selectedSystemId);
      }), (v = i.querySelector("[data-action='open-system']")) == null || v.addEventListener("click", () => {
        this.selectedSystemId && (this.activeSystemId = this.selectedSystemId, this.selectedObjectId = null, this.selectedRouteId = null, this.render({ force: !0 }));
      }), (I = i.querySelector("[data-action='navigate-up']")) == null || I.addEventListener("click", () => {
        if (this.creationPanel = null, this.planetSystemId)
          this._disposePlanetRenderer(), this.planetSystemId = null, this._planetReturnFocus = !0;
        else if (this.activeSystemId)
          this.activeSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null;
        else return;
        this.render({ force: !0 });
      }), (b = i.querySelector("[data-action='reveal-system']")) == null || b.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? D(this.mapId, this.activeSystemId, this.selectedObjectId, "players") : this.selectedSystemId && _(this.mapId, this.selectedSystemId);
      }), (M = i.querySelector("[data-action='hide-system']")) == null || M.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? D(this.mapId, this.activeSystemId, this.selectedObjectId, "gm") : this.selectedSystemId && q(this.mapId, this.selectedSystemId, !0);
      }), (x = i.querySelector("[data-action='delete-system']")) == null || x.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._confirmDeleteObject(this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), ($ = i.querySelector("[data-action='set-current-system']")) == null || $.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? V(this.mapId, this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && ne(this.mapId, this.selectedSystemId);
      }), (C = i.querySelector("[data-action='travel-to-system']")) == null || C.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? ee(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, i));
      }), (z = i.querySelector("[data-action='travel-to-object']")) == null || z.addEventListener("click", () => {
        !this.activeSystemId || !this.selectedObjectId || (this.playerMode ? se(this.mapId, this.activeSystemId, this.selectedObjectId) : this._travelToObject(this.activeSystemId, this.selectedObjectId, i));
      }), (Z = i.querySelector("[data-action='edit-route']")) == null || Z.addEventListener("click", () => {
        this.selectedRouteId && this._openEditPanel("route", this.selectedRouteId);
      }), (fe = i.querySelector("[data-action='reveal-route']")) == null || fe.addEventListener("click", () => {
        this.selectedRouteId && A(this.mapId, this.selectedRouteId, this.activeSystemId ?? "");
      }), (ue = i.querySelector("[data-action='hide-route']")) == null || ue.addEventListener("click", () => {
        this.selectedRouteId && U(this.mapId, this.selectedRouteId, !0, this.activeSystemId ?? "");
      }), (he = i.querySelector("[data-action='delete-route']")) == null || he.addEventListener("click", () => {
        this.selectedRouteId && this._confirmDeleteRoute(this.selectedRouteId);
      });
    }
    _applyViewportTransform(n) {
      var a, c, y;
      const i = n.querySelector(".gmf-map-stage");
      if (!i || i !== this._viewportStage || !i.isConnected || !((a = this.element) != null && a.contains(i))) return;
      const r = n.querySelector(".gmf-map-viewport");
      if (r) {
        if (i) {
          const S = i.getBoundingClientRect(), g = r.querySelector(".gmf-map-background");
          g && (this.zoom = Math.max(1, this.zoom));
          const E = g != null && g.naturalWidth && (g != null && g.naturalHeight) ? g.naturalWidth / g.naturalHeight : null;
          E ? this._adjustWindowToBackground(i, E) : g || this._adjustWindowToBackground(i, null);
          const O = S.width / Math.max(1, S.height);
          E && E > O ? (this._worldWidth = S.width, this._worldHeight = S.width / E) : E ? (this._worldHeight = S.height, this._worldWidth = S.height * E) : (this._worldWidth = S.width, this._worldHeight = S.height), r.style.width = `${this._worldWidth}px`, r.style.height = `${this._worldHeight}px`, (c = this._orbitLayer) == null || c.setAspect(this._worldWidth / this._worldHeight);
          const G = this._worldWidth * this.zoom, B = this._worldHeight * this.zoom;
          this.panX = G <= S.width ? (S.width - G) / 2 : me(this.panX, S.width - G, 0), this.panY = B <= S.height ? (S.height - B) / 2 : me(this.panY, S.height - B, 0), g && g.dataset.gmfWorldImageBound !== "true" && (g.dataset.gmfWorldImageBound = "true", g.addEventListener("load", () => this._applyViewportTransform(n), { once: !0 }));
        }
        r.style.setProperty("--gmf-pan-x", `${this.panX}px`), r.style.setProperty("--gmf-pan-y", `${this.panY}px`), r.style.setProperty("--gmf-zoom", String(this.zoom)), (y = n.querySelector("[data-zoom-label]")) == null || y.replaceChildren(`${Math.round(this.zoom * 100)}%`);
      }
    }
    _adjustWindowToBackground(n, i) {
      const r = n.closest(".window-app, .application, .app");
      if (!r || !this.setPosition) return;
      const a = r.getBoundingClientRect();
      if (!i) {
        this._baseWindowHeight && Math.abs(a.height - this._baseWindowHeight) > 2 && this.setPosition({ height: Math.min(this._baseWindowHeight, window.innerHeight - 24) }), this._baseWindowHeight = null;
        return;
      }
      this._baseWindowHeight ?? (this._baseWindowHeight = a.height);
      const c = n.getBoundingClientRect(), y = me(c.width / i, 240, window.innerHeight - 96);
      if (Math.abs(c.height - y) <= 2) return;
      const S = me(a.height + y - c.height, 320, window.innerHeight - 24);
      this.setPosition({ height: Math.round(S) });
    }
    _observeViewport(n) {
      var r;
      (r = this._viewportResizeObserver) == null || r.disconnect();
      const i = n.querySelector(".gmf-map-stage");
      this._viewportStage = i, i && (this._viewportResizeObserver = new ResizeObserver(() => this._applyViewportTransform(n)), this._viewportResizeObserver.observe(i));
    }
    _setZoom(n, i) {
      const r = i.querySelector(".gmf-map-background") ? 1 : st;
      this.zoom = me(n, r, nt), this._applyViewportTransform(i);
    }
    _mountBountyIntelCallout(n) {
      var a;
      if (this._bountyIntelCallout || n.querySelector(".gmf-intel-callout")) return;
      const i = (a = n.matches) != null && a.call(n, ".gmf-map-stage") ? n : n.querySelector(".gmf-map-stage"), r = n;
      !i || !r.querySelector("[data-intel-layer]") || (this._bountyIntelCallout = ks({
        root: r,
        stage: i,
        resolveItems: (c) => {
          var g;
          const y = Y(s(this.mapId)), S = this.activeSystemId ? (g = y.systems.find((E) => E.id === this.activeSystemId)) == null ? void 0 : g.objects.find((E) => E.id === c) : y.systems.find((E) => E.id === c);
          return S ? Ms(S) : [];
        },
        onOpen: (c) => Ls(c)
      }));
    }
    _attachPlanetListeners(n) {
      var i, r, a, c, y, S;
      (i = n.querySelector("[data-action='inspect-system']")) == null || i.addEventListener("click", () => {
        var E, O;
        const g = s(this.mapId);
        if (!(this.playerMode && (g == null ? void 0 : g.visibility) !== "players")) {
          if (this.activeSystemId) {
            const B = (E = Y(g).systems.find((W) => W.id === this.activeSystemId)) == null ? void 0 : E.objects.find((W) => W.id === this.selectedObjectId);
            if (!Ce(B)) return;
            this.planetSystemId = this.selectedObjectId;
          } else {
            this.activeSystemId = this.selectedSystemId;
            const G = Y(g);
            this.selectedObjectId = ((O = G.systems.find((B) => B.id === this.activeSystemId)) == null ? void 0 : O.primaryObjectId) ?? null, this.planetSystemId = this.selectedObjectId;
          }
          this.render({ force: !0 });
        }
      }), (r = n.querySelector("[data-action='planet-pause']")) == null || r.addEventListener("click", () => {
        var g;
        return (g = this._planetRenderer) == null ? void 0 : g.setPaused(!this._planetRenderer.paused);
      }), (a = n.querySelector("[data-action='planet-zoom-in']")) == null || a.addEventListener("click", () => {
        var g;
        return (g = this._planetRenderer) == null ? void 0 : g.zoom(-0.25);
      }), (c = n.querySelector("[data-action='planet-zoom-out']")) == null || c.addEventListener("click", () => {
        var g;
        return (g = this._planetRenderer) == null ? void 0 : g.zoom(0.25);
      }), (y = n.querySelector("[data-action='planet-reset']")) == null || y.addEventListener("click", () => {
        var g;
        return (g = this._planetRenderer) == null ? void 0 : g.reset();
      }), (S = n.querySelector("[data-action='planet-static']")) == null || S.addEventListener("click", () => {
        this.planetStatic = !this.planetStatic, this.render({ force: !0 });
      }), this._attachPlanetLocationList(n), this._attachLinkedContentDrop(n);
    }
    _getPlanetObject() {
      var i;
      return ((i = Y(s(this.mapId)).systems.find((r) => r.id === this.activeSystemId)) == null ? void 0 : i.objects.find((r) => r.id === this.planetSystemId)) ?? null;
    }
    _preparePlanetLocations(n, i) {
      return ((n == null ? void 0 : n.planetLocations) ?? []).filter((r) => r.shape === i).map((r) => {
        var y, S, g, E, O, G;
        const a = (S = (y = game.scenes) == null ? void 0 : y.get) == null ? void 0 : S.call(y, r.sceneId), c = !!(a && ((g = game.user) != null && g.isGM || (E = a.testUserPermission) != null && E.call(a, game.user, "OBSERVER")));
        return {
          ...r,
          name: a ? c || (O = game.user) != null && O.isGM ? a.name || "Linked Scene" : "Restricted location" : "Missing linked scene",
          accessible: c,
          missing: !a,
          canRemove: !!((G = game.user) != null && G.isGM && !this.playerMode)
        };
      });
    }
    _getPlanetLocationItem(n) {
      var r;
      const i = this._getPlanetObject();
      return this._preparePlanetLocations(i, (r = Ce(i)) == null ? void 0 : r.shape).find((a) => a.id === n) ?? null;
    }
    _attachPlanetLocationList(n) {
      var a;
      const i = this.element ?? n;
      n.querySelectorAll("[data-planet-scene-drag]").forEach((c) => c.addEventListener("dragstart", (y) => {
        y.dataTransfer && (y.dataTransfer.setData("text/plain", JSON.stringify({ type: "Scene", id: c.dataset.planetSceneDrag, uuid: c.dataset.planetSceneUuid })), y.dataTransfer.effectAllowed = "link");
      })), n.querySelectorAll("[data-unlink-planet-scene]").forEach((c) => c.addEventListener("click", async (y) => {
        var O, G, B;
        y.preventDefault(), y.stopPropagation();
        const S = c.dataset.unlinkPlanetScene ?? "", g = this.planetSystemId || this.selectedObjectId;
        if (!S || !this.activeSystemId || !g) return;
        const E = ((B = (G = (O = game.scenes) == null ? void 0 : O.get) == null ? void 0 : G.call(O, S)) == null ? void 0 : B.name) || "Scene";
        await N(this.mapId, this.activeSystemId, g, S) && ce(`${E} unlinked from this location.`);
      })), n.querySelectorAll("[data-open-linked-scene]").forEach((c) => c.addEventListener("click", () => {
        var S, g, E;
        const y = (g = (S = game.scenes) == null ? void 0 : S.get) == null ? void 0 : g.call(S, c.dataset.openLinkedScene ?? "");
        y != null && y.view ? y.view() : (E = y == null ? void 0 : y.sheet) == null || E.render(!0);
      })), n.querySelectorAll("[data-open-planet-location]").forEach((c) => c.addEventListener("click", () => this._openPlanetLocation(c.dataset.openPlanetLocation ?? ""))), n.querySelectorAll("[data-remove-planet-location]").forEach((c) => c.addEventListener("click", () => this._removePlanetLocation(c.dataset.removePlanetLocation ?? "", n))), n.querySelectorAll("[data-planet-location-drag]").forEach((c) => {
        c.addEventListener("dragstart", (y) => {
          var g;
          if (!y.dataTransfer) return;
          const S = c.dataset.planetLocationDrag ?? "";
          y.dataTransfer.setData("application/x-gmf-surface-location", S), y.dataTransfer.setData("text/plain", JSON.stringify({ type: "GalaxySurfaceLocation", locationId: S })), y.dataTransfer.effectAllowed = "move", (g = i.querySelector("[data-planet-location-trash]")) == null || g.classList.add("is-armed");
        }), c.addEventListener("dragend", () => {
          var y;
          return (y = i.querySelector("[data-planet-location-trash]")) == null ? void 0 : y.classList.remove("is-armed", "is-dragover");
        });
      });
      const r = i.querySelector("[data-planet-location-trash]");
      (r == null ? void 0 : r.dataset.gmfTrashBound) !== "true" && (r && (r.dataset.gmfTrashBound = "true"), r == null || r.addEventListener("dragover", (c) => {
        var y;
        (y = c.dataTransfer) != null && y.types.includes("application/x-gmf-surface-location") && (c.preventDefault(), c.dataTransfer.dropEffect = "move", r.classList.add("is-dragover"));
      }), r == null || r.addEventListener("dragleave", () => r.classList.remove("is-dragover")), r == null || r.addEventListener("drop", (c) => {
        var S;
        c.preventDefault();
        const y = ((S = c.dataTransfer) == null ? void 0 : S.getData("application/x-gmf-surface-location")) ?? "";
        r.classList.remove("is-armed", "is-dragover"), y && this._removePlanetLocation(y, n);
      })), (a = n.querySelector("[data-clear-planet-locations]")) == null || a.addEventListener("click", () => this._clearPlanetLocations(n));
    }
    _attachLinkedContentDrop(n) {
      var r, a;
      const i = n.querySelector("[data-linked-content-drop]");
      !i || !((r = game.user) != null && r.isGM) || this.playerMode || (i.addEventListener("dragover", (c) => {
        c.preventDefault(), c.dataTransfer && (c.dataTransfer.dropEffect = "link"), i.classList.add("is-document-dragover");
      }), i.addEventListener("dragleave", (c) => {
        i.contains(c.relatedTarget) || i.classList.remove("is-document-dragover");
      }), i.addEventListener("drop", async (c) => {
        var E;
        c.preventDefault(), c.stopPropagation(), i.classList.remove("is-document-dragover");
        const y = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !y) return;
        const S = await bi(c), g = (E = Y(s(this.mapId)).systems.find((O) => O.id === this.activeSystemId)) == null ? void 0 : E.objects.find((O) => O.id === y);
        if (!S || !g) {
          re("Drop a Foundry Scene or Journal here.");
          return;
        }
        if (S.documentName === "Scene") {
          const O = [.../* @__PURE__ */ new Set([...g.sceneIds ?? [], S.id])];
          await l(this.mapId, this.activeSystemId, { ...g, sceneIds: O }), ce(`${S.name || "Scene"} linked to ${g.name}.`);
        } else if (S.documentName === "JournalEntry")
          await l(this.mapId, this.activeSystemId, { ...g, journalId: S.id }), ce(`${S.name || "Journal"} linked to ${g.name}.`);
        else {
          re("Drop a Foundry Scene or Journal here.");
          return;
        }
      }), (a = n.querySelector("[data-unlink-linked-journal]")) == null || a.addEventListener("click", async (c) => {
        var g;
        c.preventDefault(), c.stopPropagation();
        const y = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !y) return;
        const S = (g = Y(s(this.mapId)).systems.find((E) => E.id === this.activeSystemId)) == null ? void 0 : g.objects.find((E) => E.id === y);
        S && await l(this.mapId, this.activeSystemId, { ...S, journalId: "" });
      }));
    }
    _openPlanetLocation(n) {
      var a, c, y;
      const i = this._getPlanetLocationItem(n), r = i ? (c = (a = game.scenes) == null ? void 0 : a.get) == null ? void 0 : c.call(a, i.sceneId) : null;
      if (!i || !r || !i.accessible) {
        re(i != null && i.missing ? "That location is unavailable." : "You do not have permission to view that scene.");
        return;
      }
      r.view ? r.view() : (y = r.sheet) == null || y.render(!0);
    }
    async _removePlanetLocation(n, i) {
      var a;
      if (!((a = game.user) != null && a.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const r = this._getPlanetLocationItem(n);
      !r || !await Pe(this.mapId, this.activeSystemId, this.planetSystemId, n) || (this._syncPlanetLocations(i), ce(`${r.name} removed from the surface.`));
    }
    async _clearPlanetLocations(n) {
      var a, c;
      if (!((a = game.user) != null && a.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const i = this._getPlanetObject(), r = this._preparePlanetLocations(i, (c = Ce(i)) == null ? void 0 : c.shape);
      for (const y of r) await Pe(this.mapId, this.activeSystemId, this.planetSystemId, y.id);
      this._syncPlanetLocations(n), r.length && ce(`Cleared ${r.length} surface location${r.length === 1 ? "" : "s"}.`);
    }
    async _placePlanetLocation(n, i, r) {
      var S;
      if (!((S = game.user) != null && S.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const a = await Rs(n);
      if (!a) {
        re("Drop a Foundry Scene onto the 3D surface.");
        return;
      }
      const c = this._getPlanetObject();
      if (!(c != null && c.sceneIds.includes(a.id))) {
        re(`Link ${a.name || "this scene"} to the object before placing it on the surface.`);
        return;
      }
      await Oe(this.mapId, this.activeSystemId, this.planetSystemId, { ...i, sceneId: a.id }) && (this._syncPlanetLocations(r), ce(`${a.name || "Scene"} placed on the ${i.shape}. Drag it again to move it.`));
    }
    _syncPlanetLocations(n) {
      var y, S, g;
      const i = this.element ?? n, r = this._getPlanetObject(), a = this._preparePlanetLocations(r, (y = Ce(r)) == null ? void 0 : y.shape);
      (S = this._planetRenderer) == null || S.setLocations((r == null ? void 0 : r.planetLocations) ?? []);
      const c = i.querySelector("[data-planet-location-list]");
      c && (c.innerHTML = a.length ? a.map((E) => `
        <div class="gmf-planet-location-row ${E.accessible ? "" : "is-restricted"}" ${E.canRemove ? `draggable="true" data-planet-location-drag="${Ie(E.id)}" title="Drag to the trash bin to remove"` : ""}>
          <button type="button" data-open-planet-location="${Ie(E.id)}" ${E.accessible ? "" : "disabled"}><i class="fa-solid ${E.accessible ? "fa-location-dot" : "fa-lock"}"></i><span>${Ie(E.name)}</span></button>
          ${E.canRemove ? `<button type="button" data-remove-planet-location="${Ie(E.id)}" title="Remove location" aria-label="Remove ${Ie(E.name)}"><i class="fa-solid fa-trash"></i></button>` : ""}
        </div>`).join("") : '<p class="gmf-planet-locations__empty">No surface locations placed.</p>', this._attachPlanetLocationList(c), (g = i.querySelector("[data-planet-location-removal]")) == null || g.toggleAttribute("hidden", a.length === 0));
    }
    refreshPlanetLocations(n, i) {
      this.activeSystemId !== n || this.planetSystemId !== i || this.element && this._syncPlanetLocations(this.element);
    }
    async focusSystem(n, i = {}) {
      var G;
      const r = Y(s(this.mapId));
      if (!r.systems.find((B) => B.id === n)) return !1;
      const c = o(r, {
        playerMode: this.playerMode,
        selectedSystemId: n,
        selectedRouteId: null
      });
      if (!((G = c == null ? void 0 : c.systems) != null && G.some((B) => B.id === n))) return !1;
      const y = String(i.focusId || n).slice(0, 80), S = ["distress", "warning", "objective", "custom"].includes(i.kind) ? i.kind : "custom", g = /^#[0-9a-f]{6}$/i.test(i.color ?? "") ? i.color : S === "distress" ? "#ff5c7a" : "#58d8ff", E = me(Number(i.duration) || 0, 0, 6e5), O = me(Number(i.zoom) || 1.45, st, nt);
      return this.externalFocus = {
        id: y,
        systemId: n,
        kind: S,
        color: g,
        label: String(i.label || (S === "distress" ? "Distress signal" : "Signal located")).slice(0, 120)
      }, this.selectedSystemId = n, this.planetSystemId = null, this.selectedRouteId = null, this._pendingFocusZoom = O, this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, await this.render({ force: !0 }), this.bringToFront(), E > 0 && (this._externalFocusTimeout = globalThis.setTimeout(() => {
        var B;
        ((B = this.externalFocus) == null ? void 0 : B.id) === y && this.clearSystemFocus(y);
      }, E)), !0;
    }
    async focusLocation(n, i = "", r = {}) {
      const c = Y(s(this.mapId)).systems.find((S) => S.id === n), y = (c == null ? void 0 : c.objects.find((S) => S.id === i)) ?? (c == null ? void 0 : c.objects.find((S) => S.id === c.primaryObjectId));
      return !c || !y || this.playerMode && (c.visibility !== "players" || Ne(c, y) !== "players") ? !1 : (this.activeSystemId = c.id, this.selectedSystemId = c.id, this.selectedObjectId = y.id, this.selectedRouteId = null, this.planetSystemId = r.detail === !0 && Ce(y) ? y.id : null, await this.render({ force: !0 }), this.bringToFront(), !0);
    }
    clearSystemFocus(n = "") {
      return !this.externalFocus || n && this.externalFocus.id !== n ? !1 : (this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, this._pendingFocusZoom = null, this.externalFocus = null, this.rendered && this.render({ force: !0 }), !0);
    }
    _centerOnSystem(n, i, r) {
      const a = i.querySelector(".gmf-map-stage");
      if (!a) return;
      const c = a.getBoundingClientRect();
      this.zoom = r, this.panX = c.width / 2 - Number(n.x) / 100 * this._worldWidth * r, this.panY = c.height / 2 - Number(n.y) / 100 * this._worldHeight * r, this._applyViewportTransform(i);
    }
    _onWheelZoom(n, i) {
      n.preventDefault();
      const r = i.querySelector(".gmf-map-stage");
      if (!r) return;
      const a = r.getBoundingClientRect(), c = this.zoom, y = i.querySelector(".gmf-map-background") ? 1 : st, S = me(c * Math.exp(-n.deltaY * 15e-4), y, nt), g = n.clientX - a.left, E = n.clientY - a.top, O = (g - this.panX) / c, G = (E - this.panY) / c;
      this.zoom = S, this.panX = g - O * S, this.panY = E - G * S, this._applyViewportTransform(i);
    }
    _startPan(n, i) {
      if (n.button !== 0 || n.target.closest("[data-system-id], [data-route-id], button, input")) return;
      n.preventDefault();
      const r = n.clientX, a = n.clientY, c = this.panX, y = this.panY;
      let S = !1;
      const g = (O) => {
        S = S || Math.abs(O.clientX - r) > 3 || Math.abs(O.clientY - a) > 3, this.panX = c + O.clientX - r, this.panY = y + O.clientY - a, this._applyViewportTransform(i);
      }, E = () => {
        window.removeEventListener("pointermove", g), window.removeEventListener("pointerup", E), S || (this.selectedRouteId = null, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, this.render({ force: !0 }));
      };
      window.addEventListener("pointermove", g), window.addEventListener("pointerup", E, { once: !0 });
    }
    _startSystemDrag(n, i, r) {
      var f;
      if (n.button !== 0) return;
      n.preventDefault(), n.stopPropagation(), (f = r.setPointerCapture) == null || f.call(r, n.pointerId);
      const a = n.clientX, c = n.clientY, y = this._orbitLayer, S = r.dataset.systemId, g = this.activeSystemId;
      let E = this._pointerToMapPercent(n, i), O = !1, G = null;
      const B = Array.from(i.querySelectorAll(`[data-route-from="${r.dataset.systemId}"]`)), W = Array.from(i.querySelectorAll(`[data-route-to="${r.dataset.systemId}"]`)), H = () => {
        y ? y.previewDrag(S, E) : (r.style.left = `${E.x}%`, r.style.top = `${E.y}%`, this._updateConnectedRoutes(B, W, E.x, E.y));
      }, te = (v) => {
        const I = Math.abs(v.clientX - a), b = Math.abs(v.clientY - c);
        !O && I <= 4 && b <= 4 || (O = !0, r.classList.add("is-dragging"), E = this._pointerToMapPercent(v, i), r.dataset.dragged = "true", !G && (G = requestAnimationFrame(() => {
          G = null, H();
        })));
      }, de = async (v) => {
        if (G && cancelAnimationFrame(G), r.classList.remove("is-dragging"), window.removeEventListener("pointermove", te), window.removeEventListener("pointerup", de), window.removeEventListener("pointercancel", de), (v == null ? void 0 : v.type) === "pointercancel") {
          r.dataset.dragged = "false", y ? y.cancelDrag() : O && this.render({ force: !0 });
          return;
        }
        if (!(r.isConnected === !1 || g !== this.activeSystemId) && O) {
          H();
          const I = y == null ? void 0 : y.finishDrag(S, E);
          if (g)
            try {
              await ve(this.mapId, g, S, E.x, E.y, I) || this.render({ force: !0 });
            } catch {
              y == null || y.cancelDrag(), re("Could not save the location position."), this.render({ force: !0 });
            }
          else await ge(this.mapId, r.dataset.systemId, E.x, E.y);
        }
      };
      window.addEventListener("pointermove", te), window.addEventListener("pointerup", de, { once: !0 }), window.addEventListener("pointercancel", de, { once: !0 });
    }
    _startMarkerResize(n, i) {
      var G;
      if (n.button !== 0) return;
      n.preventDefault(), n.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
      const r = me(Number(i.dataset.iconSize) || 28, 18, 56), a = i.getBoundingClientRect(), c = a.left + a.width / 2, y = a.top + a.height / 2, S = Math.hypot(n.clientX - c, n.clientY - y);
      let g = r;
      i.dataset.dragged = "true", i.classList.add("is-resizing"), (G = i.setPointerCapture) == null || G.call(i, n.pointerId);
      const E = (B) => {
        const W = Math.hypot(B.clientX - c, B.clientY - y);
        g = me(Math.round(r + (W - S) / Math.max(this.zoom, 0.01)), 18, 56), i.dataset.iconSize = String(g), i.style.setProperty("--gmf-system-size", `${g}px`);
      }, O = async () => {
        if (i.classList.remove("is-resizing"), window.removeEventListener("pointermove", E), window.removeEventListener("pointerup", O), window.removeEventListener("pointercancel", O), globalThis.setTimeout(() => {
          i.dataset.dragged = "false";
        }, 0), g !== r)
          if (this.activeSystemId) {
            const B = Y(s(this.mapId)).systems.find((H) => H.id === this.activeSystemId), W = B == null ? void 0 : B.objects.find((H) => H.id === i.dataset.systemId);
            W && await l(this.mapId, this.activeSystemId, { ...W, iconSize: g });
          } else
            await u(this.mapId, { id: i.dataset.systemId, iconSize: g });
      };
      window.addEventListener("pointermove", E), window.addEventListener("pointerup", O, { once: !0 }), window.addEventListener("pointercancel", O, { once: !0 });
    }
    _pointerToMapPercent(n, i) {
      const a = i.querySelector(".gmf-map-stage").getBoundingClientRect();
      return {
        x: me((n.clientX - a.left - this.panX) / this.zoom / this._worldWidth * 100, 0, 100),
        y: me((n.clientY - a.top - this.panY) / this.zoom / this._worldHeight * 100, 0, 100)
      };
    }
    _updateConnectedRoutes(n, i, r, a) {
      n.forEach((c) => {
        c.setAttribute("x1", r), c.setAttribute("y1", a);
      }), i.forEach((c) => {
        c.setAttribute("x2", r), c.setAttribute("y2", a);
      });
    }
    _openContextMenu(n, i) {
      var te;
      if (!((te = game.user) != null && te.isGM) || this.playerMode || n.target.closest(".gmf-context-menu")) return;
      n.preventDefault(), n.stopPropagation();
      const r = n.target.closest("[data-route-id]"), a = n.target.closest("[data-system-id]"), c = this._pointerToMapPercent(n, i);
      this._contextTarget = r ? { type: "route", id: r.dataset.routeId, position: c } : a ? { type: "system", id: a.dataset.systemId, position: c } : { type: "stage", id: null, position: c };
      const y = i.querySelector("[data-gmf-context-menu]");
      if (!y) return;
      y.querySelectorAll("[data-context-show]").forEach((de) => {
        de.hidden = de.dataset.contextShow !== this._contextTarget.type;
      }), y.hidden = !1;
      const S = y.offsetWidth || 184, g = y.offsetHeight || 260, O = i.querySelector(".gmf-map-stage").getBoundingClientRect(), G = n.clientX - O.left, B = n.clientY - O.top, W = Math.max(4, O.width - S - 4), H = Math.max(4, O.height - g - 4);
      y.style.left = `${me(G, 4, W)}px`, y.style.top = `${me(B, 4, H)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(i), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu(n = null) {
      const i = n ?? this.element ?? null, r = i == null ? void 0 : i.querySelector("[data-gmf-context-menu]");
      r && (r.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(n, i) {
      n.preventDefault(), n.stopPropagation();
      const r = n.currentTarget.dataset.contextAction, a = this._contextTarget;
      this._hideContextMenu(i), a && (r === "add-system" ? this._openCreationPanel("system", { x: a.position.x, y: a.position.y }) : r === "add-entity" ? this.activeSystemId && this._openCreationPanel("entity", { x: a.position.x, y: a.position.y }) : r === "manage-factions" ? (this.creationPanel = null, this.factionRegistry = !0, this.render({ force: !0 })) : r === "add-faction" ? this._openCreationPanel("faction") : r === "edit-map-details" ? this._openCreationPanel("map", Y(s(this.mapId)), this.mapId) : r === "export-map" ? R(this.mapId) : r === "edit-system" ? this._openEditPanel("system", a.id) : r === "edit-entity" ? this.activeSystemId && this._openEditPanel("entity", a.id) : r === "add-route-from-marker" ? this._openCreationPanel("route", { fromSystemId: a.id }) : r === "reveal-system" ? await _(this.mapId, a.id) : r === "hide-system" ? await q(this.mapId, a.id, !0) : r === "delete-system" ? await this._confirmDeleteSystem(a.id) : r === "reveal-entity" ? this.activeSystemId && await D(this.mapId, this.activeSystemId, a.id, "players") : r === "hide-entity" ? this.activeSystemId && await D(this.mapId, this.activeSystemId, a.id, "gm") : r === "delete-entity" ? this.activeSystemId && await this._confirmDeleteObject(this.activeSystemId, a.id) : r === "edit-route" ? this._openEditPanel("route", a.id) : r === "reveal-route" ? await A(this.mapId, a.id, this.activeSystemId ?? "") : r === "hide-route" ? await U(this.mapId, a.id, !0, this.activeSystemId ?? "") : r === "delete-route" && await this._confirmDeleteRoute(a.id));
    }
    async _confirmDeleteSystem(n) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, De) && await T(this.mapId, n);
    }
    async _confirmDeleteObject(n, i) {
      await Dialog.confirm({ title: "Delete Location", content: "<p>Delete this location and its linked content?</p>" }) && (await K(this.mapId, n, i), this.selectedObjectId = null);
    }
    _openCreationPanel(n, i = {}, r = null) {
      var g, E, O, G;
      if (!((g = game.user) != null && g.isGM) || this.playerMode) return;
      const a = Y(s(this.mapId)), c = this.activeSystemId ? ((E = a.systems.find((B) => B.id === this.activeSystemId)) == null ? void 0 : E.objects) ?? [] : a.systems;
      if (n === "route" && c.length < 2) {
        re(this.activeSystemId ? "Create at least two locations before adding a route." : "Create at least two systems before adding a route.");
        return;
      }
      const y = i.fromSystemId || ((O = c[0]) == null ? void 0 : O.id) || "", S = n === "map" ? { title: "Galaxy Map", subtitle: "", description: "", backgroundImage: "", visibility: "players", travelApprovalMode: "unanimous" } : n === "system" ? { name: "New System", status: "known", visibility: "gm", description: "", markerImage: "", backgroundImage: "" } : n === "entity" ? {
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
      } : n === "route" ? { type: "safe", visibility: "gm", travelTime: "", fuelCost: 0, notes: "" } : { name: "New Faction", color: "#58d8ff", visibility: "gm", description: "" };
      this.creationPanel = {
        kind: n,
        editId: r,
        data: {
          ...S,
          ...i,
          x: Number.isFinite(Number(i.x)) ? Number(i.x) : 50,
          y: Number.isFinite(Number(i.y)) ? Number(i.y) : 50,
          fromSystemId: y,
          toSystemId: i.toSystemId || ((G = c.find((B) => B.id !== y)) == null ? void 0 : G.id) || ""
        }
      }, this.factionRegistry = !1, this.selectedSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null, this.render({ force: !0 });
    }
    _openEditPanel(n, i, r = !1) {
      var y, S;
      const a = Y(s(this.mapId)), c = n === "system" ? a.systems.find((g) => g.id === i) : n === "entity" ? (y = a.systems.find((g) => g.id === this.activeSystemId)) == null ? void 0 : y.objects.find((g) => g.id === i) : n === "route" ? this.activeSystemId ? (S = a.systems.find((g) => g.id === this.activeSystemId)) == null ? void 0 : S.routes.find((g) => g.id === i) : a.routes.find((g) => g.id === i) : a.factions.find((g) => g.id === i);
      c && this._openCreationPanel(n, r ? { ...c, showOrbitEditor: r } : c, i);
    }
    openEditor(n, i = {}) {
      var r;
      return !((r = game.user) != null && r.isGM) || this.playerMode ? !1 : (this._disposePlanetRenderer(), this.planetSystemId = null, n === "entity" ? (this.activeSystemId = i.systemId || this.activeSystemId, this.selectedSystemId = this.activeSystemId) : n === "route" ? this.activeSystemId = i.systemId || null : ["map", "system", "faction"].includes(n) && (this.activeSystemId = null), n === "map" ? this._openCreationPanel("map", Y(s(this.mapId)), this.mapId) : i.id ? this._openEditPanel(n, i.id) : this._openCreationPanel(n, i.defaults || {}), !0);
    }
    _attachCreationPanel(n) {
      var a, c, y, S;
      (a = n.querySelector("[data-action='cancel-panel-create']")) == null || a.addEventListener("click", () => {
        this.creationPanel = null, this.render({ force: !0 });
      }), (c = n.querySelector("[data-action='close-faction-registry']")) == null || c.addEventListener("click", () => {
        this.factionRegistry = !1, this.render({ force: !0 });
      }), (y = n.querySelector("[data-action='add-inline-faction']")) == null || y.addEventListener("click", () => this._openCreationPanel("faction")), n.querySelectorAll("[data-edit-inline-faction]").forEach((g) => {
        g.addEventListener("click", () => this._openEditPanel("faction", g.dataset.editInlineFaction || ""));
      }), n.querySelectorAll("[data-delete-inline-faction]").forEach((g) => {
        g.addEventListener("click", async () => {
          await Dialog.confirm({ title: "Delete Faction", content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>" }, De) && (await h(this.mapId, g.dataset.deleteInlineFaction), this.factionRegistry = !0, this.render({ force: !0 }));
        });
      });
      const i = n.querySelector("[data-panel-create-form]");
      if (!i) return;
      Si(i);
      const r = As(i, ((S = this.creationPanel) == null ? void 0 : S.data) ?? {});
      i.addEventListener("submit", async (g) => {
        g.preventDefault();
        const E = i.dataset.createKind || "", O = Object.fromEntries(new FormData(i).entries());
        n.querySelectorAll('[form="gmf-panel-editor-form"][name]').forEach((de) => {
          de instanceof HTMLInputElement && ["checkbox", "radio"].includes(de.type) && !de.checked || (O[de.name] = de.value);
        }), E === "entity" && (Object.assign(O, r == null ? void 0 : r()), O.markerImage = O.useCustomMarker === "true" ? O.markerImage ?? "" : "", delete O.useCustomMarker);
        const G = Number(O.x), B = Number(O.y), W = this.creationPanel, H = (W == null ? void 0 : W.data) ?? {};
        W != null && W.editId && (O.id = W.editId), this.creationPanel = null;
        let te = null;
        if (E === "map") te = await k(this.mapId, { ...H, ...O });
        else if (E === "system") te = await u(this.mapId, { ...H, ...O, x: G, y: B });
        else if (E === "entity" && this.activeSystemId) {
          const { orbit: de, orbits: f, ...v } = H;
          if (te = await l(this.mapId, this.activeSystemId, { ...v, ...O, x: G, y: B }), !te) {
            this.creationPanel = W;
            return;
          }
        } else if (E === "route") {
          if (!O.fromSystemId || !O.toSystemId || O.fromSystemId === O.toSystemId) {
            re(`Choose two different ${this.activeSystemId ? "locations" : "systems"} for the route.`), this._openCreationPanel("route", { ...H, ...O }, (W == null ? void 0 : W.editId) ?? null);
            return;
          }
          te = await m(this.mapId, { ...H, ...O }, this.activeSystemId ?? "");
        } else E === "faction" && (te = await d(this.mapId, { ...H, ...O }), this.factionRegistry = !0);
        te != null && te.id && (E === "system" && (this.selectedSystemId = te.id), E === "entity" && (this.selectedObjectId = te.id), E === "route" && (this.selectedRouteId = te.id)), this.render({ force: !0 });
      }), globalThis.setTimeout(() => {
        var g;
        return (g = i.querySelector("[autofocus]")) == null ? void 0 : g.focus();
      }, 0);
    }
    _attachAppearancePreview(n) {
      const i = n.querySelector("[data-panel-marker-preview-system]"), r = n.querySelector("[data-panel-marker-preview-icon]"), a = n.querySelector("[data-panel-marker-preview-label]");
      if (!i) return;
      let c = 0;
      const y = ["name", "kind", "status", "iconStyle", "iconColor", "markerImage"].map((g) => n.querySelector(`[name="${g}"]`)), S = async () => {
        const g = (H, te) => {
          var de;
          return ((de = n.querySelector(`[name="${H}"]`)) == null ? void 0 : de.value) || te;
        }, E = g("kind", "planet"), O = g("status", "known"), G = g("iconStyle", E), B = g("markerImage", "").trim();
        i.className = `gmf-system gmf-system--${E} gmf-icon--${G} gmf-status--${O}${B ? " has-custom-marker" : ""}`, i.style.setProperty("--gmf-faction-color", g("iconColor", "#58d8ff")), i.style.setProperty("--gmf-system-size", "42px"), a && (a.textContent = g("name", "New Location"));
        const W = ++c;
        if (r && B) {
          const H = document.createElement("img");
          H.className = "gmf-custom-marker__image", H.src = B, H.alt = "", H.draggable = !1, r.replaceChildren(H);
        } else if (r && ct.includes(G)) {
          const H = await globalThis.renderTemplate(`${t}/celestial-icon.hbs`, { system: { iconStyle: G } });
          W === c && (r.innerHTML = H);
        } else r && (r.innerHTML = '<span class="gmf-system__core"></span>');
      };
      y.forEach((g) => {
        g == null || g.addEventListener("input", S), g == null || g.addEventListener("change", S);
      }), S();
    }
    async _confirmDeleteRoute(n) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, De) && await Q(this.mapId, n, this.activeSystemId ?? "");
    }
    async _travelToSystem(n, i) {
      const r = Y(s(this.mapId)), a = r.systems.find((S) => S.id === r.currentSystemId), c = r.systems.find((S) => S.id === n);
      if (!c) return;
      if (!a) {
        await ne(this.mapId, c.id), ce(`Current location set to ${c.name}.`);
        return;
      }
      if (a.id === c.id) {
        ce(`${c.name} is already the current location.`);
        return;
      }
      if (!F(r, a.id, c.id)) {
        re(`No direct route from ${a.name} to ${c.name}.`);
        return;
      }
      oe(this.mapId, a.id, c.id), await this._animateShipTravel(a, c, i), await ne(this.mapId, c.id), ce(`Arrived at ${c.name}.`);
    }
    async _travelToObject(n, i, r) {
      const a = Y(s(this.mapId)), c = a.systems.find((E) => E.id === n), y = c == null ? void 0 : c.objects.find((E) => E.id === a.currentLocation.objectId), S = c == null ? void 0 : c.objects.find((E) => E.id === i);
      if (!c || !S) return;
      if (!y || a.currentLocation.systemId !== c.id) {
        await V(this.mapId, c.id, S.id), ce(`Current location set to ${S.name}.`);
        return;
      }
      if (y.id === S.id) {
        ce(`${S.name} is already the current location.`);
        return;
      }
      if (!F({ routes: c.routes }, y.id, S.id)) {
        re(`No direct route from ${y.name} to ${S.name}.`);
        return;
      }
      ae(this.mapId, c.id, y.id, S.id), await this._animateShipTravel(y, S, r), await V(this.mapId, c.id, S.id), ce(`Arrived at ${S.name}.`);
    }
    _animateShipTravel(n, i, r) {
      var S, g;
      const a = He(), c = ((S = this._orbitLayer) == null ? void 0 : S.position(n.id, a)) ?? n, y = ((g = this._orbitLayer) == null ? void 0 : g.position(i.id, a + vt)) ?? i;
      return Os(c, y, r);
    }
    getOrbitGeometry(n) {
      return this.playerMode || this.activeSystemId !== n || !this._orbitLayer ? null : { aspect: this._orbitLayer.aspect, motion: this._orbitLayer.motion };
    }
    _openLinkedJournal() {
      var r, a;
      const n = this._getSelectedRawSystem();
      if (!(n != null && n.journalId)) return;
      const i = (r = game.journal) == null ? void 0 : r.get(n.journalId);
      if (!i) {
        re(`Journal "${n.journalId}" was not found.`);
        return;
      }
      (a = i.sheet) == null || a.render(!0);
    }
    _getSelectedRawSystem() {
      var i;
      const n = Y(s(this.mapId));
      return this.activeSystemId ? ((i = n.systems.find((r) => r.id === this.activeSystemId)) == null ? void 0 : i.objects.find((r) => r.id === this.selectedObjectId)) ?? null : n.systems.find((r) => r.id === this.selectedSystemId) ?? null;
    }
    async close(n = {}) {
      var i, r, a;
      return (i = this._orbitLayer) == null || i.dispose(), this._orbitLayer = null, this._viewportStage = null, (r = this._bountyIntelCallout) == null || r.dispose(), this._bountyIntelCallout = null, this._disposePlanetRenderer(), this._hideContextMenu(), this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, (a = this._viewportResizeObserver) == null || a.disconnect(), this._viewportResizeObserver = null, Se(this), super.close(n);
    }
    _disposePlanetRenderer() {
      var n, i;
      this._planetGeneration++, (n = this._planetLocationCallout) == null || n.dispose(), this._planetLocationCallout = null, (i = this._planetRenderer) == null || i.dispose(), this._planetRenderer = null;
    }
    _setPlanetFallback(n, i) {
      const r = n.querySelector(".gmf-planet-fallback");
      r && (r.style.backgroundImage = i.texture ? `url(${JSON.stringify(i.texture)})` : "none", r.style.backgroundColor = i.color);
      const a = n.querySelector("[data-planet-canvas]");
      a && (a.dataset.planetShape = i.shape, a.dataset.planetPreset = i.preset);
      const c = n.querySelector(".gmf-planet-stage");
      c == null || c.style.setProperty("--gmf-planet-color", i.color);
    }
    async _mountPlanetRenderer(n, i) {
      var S, g, E;
      const r = n.querySelector("[data-planet-canvas]");
      if (!r || !i) return;
      this._setPlanetFallback(n, i);
      const a = this._planetGeneration, c = n.querySelector("[data-action='planet-static']"), y = n.querySelectorAll("[data-planet-control]");
      if (c) {
        const O = this.planetStatic ? "Enable 3D" : "Static view";
        c.setAttribute("title", O), c.setAttribute("aria-label", O), c.setAttribute("aria-pressed", String(this.planetStatic));
        const G = c.querySelector("i");
        G && (G.className = this.planetStatic ? "fa-solid fa-cube" : "fa-solid fa-image");
      }
      if (this.planetStatic) {
        y.forEach((O) => O.disabled = !0);
        return;
      }
      try {
        const { createPlanetRenderer: O } = await import("./chunks/planet-renderer-t-HvFdDj.js");
        if (a !== this._planetGeneration || !r.isConnected) return;
        y.forEach((G) => G.disabled = !1), this._planetRenderer = O(r, {
          texture: i.texture,
          color: i.color,
          appearancePreset: i.preset,
          shape: i.shape,
          finish: i.finish,
          detailStrength: i.detailStrength,
          locations: ((S = this._getPlanetObject()) == null ? void 0 : S.planetLocations) ?? [],
          canPlaceLocations: !!((g = game.user) != null && g.isGM && !this.playerMode),
          onLocationDrop: (G, B) => void this._placePlanetLocation(G, B, n),
          onInvalidLocationDrop: () => re("Drop the scene directly onto the visible 3D surface."),
          onMarkerHover: (G) => {
            var W;
            const B = this._getPlanetLocationItem(G.id);
            B && ((W = this._planetLocationCallout) == null || W.show(B));
          },
          onMarkerLeave: () => {
            var G;
            return (G = this._planetLocationCallout) == null ? void 0 : G.scheduleHide();
          },
          onMarkerPosition: (G) => {
            var B;
            return (B = this._planetLocationCallout) == null ? void 0 : B.setAnchor(G);
          },
          onMarkerOpen: (G) => this._openPlanetLocation(G.id),
          onMarkerContextMenu: (E = game.user) != null && E.isGM && !this.playerMode ? (G) => void this._removePlanetLocation(G.id, n) : null,
          isVisible: () => !this.minimized,
          onPaused: (G) => {
            const B = n.querySelector("[data-action='planet-pause']");
            if (B) {
              const W = G ? "Resume rotation" : "Pause rotation";
              B.setAttribute("title", W), B.setAttribute("aria-label", W), B.setAttribute("aria-pressed", String(G));
              const H = B.querySelector("i");
              H && (H.className = G ? "fa-solid fa-play" : "fa-solid fa-pause");
            }
          },
          onStopped: () => {
            y.forEach((G) => G.disabled = !0);
          }
        }), this._planetLocationCallout = qs({ host: r });
      } catch {
        y.forEach((O) => O.disabled = !0);
      }
    }
  }, J(Le, "DEFAULT_OPTIONS", {
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
  }), J(Le, "PARTS", {
    main: {
      template: `${t}/galaxy-map.hbs`
    }
  }), Le;
}
function Fs(e) {
  var l;
  const { templateRoot: t, getVisibleMaps: s, openMap: o, clearChooser: u } = e;
  return l = class extends wt() {
    async _prepareContext(d) {
      return { ...await super._prepareContext(d), maps: s() };
    }
    _attachPartListeners(d, k, h) {
      super._attachPartListeners(d, k, h), Qe(this, k), k.querySelectorAll("[data-player-open-map]").forEach((w) => {
        w.addEventListener("click", () => {
          o(w.dataset.playerOpenMap, { playerMode: !0 }), this.close();
        });
      });
    }
    async close(d = {}) {
      return u(this), super.close(d);
    }
  }, J(l, "DEFAULT_OPTIONS", {
    id: "galaxy-map-player-chooser",
    classes: ["galaxy-map", "galaxy-map-framework", "gmf-manager-window", "gmf-map-chooser-window"],
    window: { title: "Choose Galaxy Map", icon: "fa-solid fa-satellite", resizable: !0 },
    position: { width: 480, height: 420 }
  }), J(l, "PARTS", { main: { template: `${t}/player-map-chooser.hbs` } }), l;
}
const Me = "galaxy-map", ut = "maps", Ze = "schemaV1Backup", mt = "surfaceLocationRecoveryV2", we = `module.${Me}`, ke = `modules/${Me}/templates`;
function Ns(e) {
  return e.visibility === "players";
}
function Ds(e, t) {
  return t && e.status === "undiscovered";
}
function Gs(e, t) {
  return t === "planet" ? { station: "station", anomaly: "diamond", ruins: "diamond", unknown: "diamond" }[e] ?? t : t;
}
function Bs(e, { playerMode: t = !1, selectedSystemId: s = null, selectedRouteId: o = null } = {}) {
  var D, U;
  const u = Y(e), l = t ? u.systems.filter(Ns) : u.systems, m = new Set(l.map((T) => T.id)), d = t ? u.factions.filter((T) => T.visibility === "players") : u.factions, k = new Map(d.map((T) => [T.id, T])), h = l.map((T) => {
    const K = k.get(T.factionId), Q = Ds(T, t), ne = Q ? "unknown" : T.type, V = Q ? "diamond" : Gs(ne, T.iconStyle), ee = Q ? "" : T.markerImage;
    return {
      ...T,
      image: T.image,
      sceneIds: [...T.sceneIds],
      journalId: T.journalId,
      planetPreset: T.planetPreset,
      planetShape: T.planetShape,
      planetTexture: T.planetTexture,
      planetColor: T.planetColor,
      iconStyle: V,
      displayMarkerImage: ee,
      hasCustomMarker: !!ee,
      displayName: Q ? "???" : T.name,
      displayDescription: Q ? "Unresolved sensor contact. Details are not available." : T.description,
      displayType: ne,
      displayStatus: Q ? "undiscovered" : T.status,
      factionName: (K == null ? void 0 : K.name) ?? "Unaffiliated",
      factionColor: T.iconColor || (K == null ? void 0 : K.color) || "#58d8ff",
      obscured: Q,
      isCurrent: T.id === u.currentSystemId,
      isSelected: T.id === s,
      gmOnly: T.visibility === "gm",
      animatedCelestial: !ee && ct.includes(V),
      hasAlert: ["danger", "locked"].includes(Q ? "undiscovered" : T.status),
      alertLabel: T.status === "danger" ? "Hazard advisory" : T.status === "locked" ? "Restricted access" : "",
      hasJournal: !!(!Q && T.journalId),
      hasScenes: !!(!Q && T.sceneIds.length),
      showImage: !!(!Q && T.image),
      canInspectSystem: !!Ce({ ...T, obscured: Q })
    };
  }), w = u.routes.filter((T) => !t || T.visibility === "players").filter((T) => m.has(T.fromSystemId) && m.has(T.toSystemId)).map((T) => {
    const K = h.find((ne) => ne.id === T.fromSystemId), Q = h.find((ne) => ne.id === T.toSystemId);
    return {
      ...T,
      from: K,
      to: Q,
      fromName: (K == null ? void 0 : K.displayName) ?? T.fromSystemId,
      toName: (Q == null ? void 0 : Q.displayName) ?? T.toSystemId,
      isSelected: T.id === o,
      connectsCurrent: T.fromSystemId === u.currentSystemId || T.toSystemId === u.currentSystemId,
      gmOnly: T.visibility === "gm"
    };
  }), L = w.find((T) => T.id === o) ?? null, _ = L ? null : h.find((T) => T.id === s) ?? null;
  _ && (_.isSelected = !0);
  const A = h.find((T) => T.id === u.currentSystemId) ?? h[0] ?? null, q = _ && A && _.id !== A.id ? w.find((T) => T.fromSystemId === A.id && T.toSystemId === _.id || T.toSystemId === A.id && T.fromSystemId === _.id) : null;
  return _ && (_.canTravel = !!q, _.travelRouteId = (q == null ? void 0 : q.id) ?? "", _.isCurrent = _.id === (A == null ? void 0 : A.id), _.isDestination = !!(q && !_.isCurrent)), w.forEach((T) => {
    T.isActive = T.isSelected || T.id === (q == null ? void 0 : q.id);
  }), {
    ...u,
    systems: h,
    routes: w,
    factions: d,
    selectedSystem: _,
    selectedRoute: L,
    currentSystem: A,
    selectedType: L ? "route" : _ ? "system" : null,
    playerMode: t,
    isGM: ((D = game.user) == null ? void 0 : D.isGM) ?? !1,
    canEdit: ((U = game.user) == null ? void 0 : U.isGM) && !t
  };
}
function zs(e) {
  var u;
  if (!e) return null;
  const t = Y(e), s = new Map(t.systems.map((l) => [l.id, l])), o = new Map(t.factions.map((l) => [l.id, l]));
  return {
    ...t,
    travelApprovalModeLabel: ((u = pt.find((l) => l.value === t.travelApprovalMode)) == null ? void 0 : u.label) ?? "Unanimous agreement",
    systems: t.systems.map((l) => {
      var m;
      return {
        ...l,
        factionName: ((m = o.get(l.factionId)) == null ? void 0 : m.name) ?? "Unaffiliated"
      };
    }),
    routes: [
      ...t.routes.map((l) => {
        var m, d;
        return {
          ...l,
          systemId: "",
          scopeLabel: "Galaxy route",
          fromName: ((m = s.get(l.fromSystemId)) == null ? void 0 : m.name) ?? l.fromSystemId,
          toName: ((d = s.get(l.toSystemId)) == null ? void 0 : d.name) ?? l.toSystemId
        };
      }),
      ...t.systems.flatMap((l) => {
        const m = new Map(l.objects.map((d) => [d.id, d]));
        return l.routes.map((d) => {
          var k, h;
          return {
            ...d,
            systemId: l.id,
            scopeLabel: `Inside ${l.name}`,
            fromName: ((k = m.get(d.fromSystemId)) == null ? void 0 : k.name) ?? d.fromSystemId,
            toName: ((h = m.get(d.toSystemId)) == null ? void 0 : h.name) ?? d.toSystemId
          };
        });
      })
    ]
  };
}
function Hs(e) {
  Si(e), e.querySelectorAll("[data-use-custom-marker]").forEach((A) => {
    const q = (A.closest("form") ?? e).querySelector("[data-custom-marker-field]"), D = (q == null ? void 0 : q.querySelector('[name="markerImage"]')) ?? null, U = (q == null ? void 0 : q.querySelectorAll("button")) ?? [], T = () => {
      const K = A.checked;
      q == null || q.classList.toggle("is-disabled", !K), D && (D.disabled = !K), U.forEach((Q) => {
        Q.disabled = !K;
      }), !K && (D != null && D.value) && (D.value = "", D.dispatchEvent(new Event("input", { bubbles: !0 })), D.dispatchEvent(new Event("change", { bubbles: !0 })));
    };
    A.addEventListener("change", T), T();
  });
  const t = e.querySelector("[data-texture-upload-fields]"), s = e.querySelector('[name="planetTexture"]'), o = e.querySelector('[name="planetPreset"]'), u = e.querySelector('[name="planetShape"]'), l = e.querySelector('[name="planetFinish"]'), m = e.querySelector('[name="planetColor"]'), d = e.querySelector("[data-texture-guide]"), k = e.querySelector("[data-texture-guide-section]"), h = e.querySelectorAll("[data-texture-guide-preview]"), w = () => {
    if (!o || !u) return;
    const A = Qt(o.value, u.value);
    o.replaceChildren(...Kt(u.value).map((q) => {
      const D = document.createElement("option");
      return D.value = q.value, D.textContent = q.label, D;
    })), o.value = A;
  }, L = () => {
    const A = (o == null ? void 0 : o.value) === "custom", q = (o == null ? void 0 : o.value) === "none";
    return t && (t.hidden = !A), k && (k.hidden = !A), s && (s.required = A), u && (u.disabled = q), l && (l.disabled = q), m && (m.disabled = (o == null ? void 0 : o.value) !== "color"), A;
  }, _ = () => {
    var q;
    if (!d) return;
    const A = (q = s == null ? void 0 : s.value) == null ? void 0 : q.trim();
    A ? d.dataset.hasTexture = "true" : delete d.dataset.hasTexture, h.forEach((D) => {
      D.onerror = A ? () => {
        D.hidden = !0;
      } : null, D.hidden = !A, A ? D.src = A : D.removeAttribute("src");
    });
  };
  o == null || o.addEventListener("change", () => {
    !L() && (s != null && s.value) && (s.value = "", s.dispatchEvent(new Event("change", { bubbles: !0 })));
  }), s == null || s.addEventListener("change", _), u == null || u.addEventListener("change", () => {
    d && (d.dataset.shape = u.value), w(), L();
  }), w(), L(), _();
}
function Vs(e) {
  const { notifyError: t, notifyInfo: s, requireGM: o, refreshOpenApps: u, closeOpenMap: l, getOpenMapViews: m } = e, d = (f) => foundry.utils.deepClone(f), k = (f) => game.socket.emit(we, { action: "refresh", mapId: f });
  function h() {
    return d(game.settings.get(Me, ut) ?? {});
  }
  async function w(f) {
    return o("save galaxy map data") && await game.settings.set(Me, ut, f ?? {}), f;
  }
  function L(f) {
    const v = h();
    return v[f] ? d(v[f]) : null;
  }
  async function _(f, v, { refresh: I = !0 } = {}) {
    return f[v] = Y(f[v]), await w(f), I && u(v), k(v), f[v];
  }
  async function A(f = {}) {
    if (!o("create galaxy maps")) return null;
    const v = h(), I = Y(f);
    return v[I.id] = I, await w(v), u(I.id), d(I);
  }
  async function q(f, v = {}) {
    if (!o("update galaxy maps")) return null;
    const I = h();
    if (!I[f])
      return t(`Map "${f}" was not found.`), null;
    const b = Y({ ...v, id: f });
    return I[f] = b, await w(I), u(f), d(b);
  }
  async function D(f, v = {}) {
    const I = L(f);
    return !o("update galaxy map metadata") || !I ? (I || t(`Map "${f}" was not found.`), null) : q(f, {
      ...I,
      title: v.title,
      subtitle: v.subtitle,
      description: v.description,
      backgroundImage: v.backgroundImage,
      visibility: v.visibility,
      travelApprovalMode: v.travelApprovalMode
    });
  }
  async function U(f) {
    if (!o("delete galaxy maps")) return !1;
    const v = h();
    return v[f] ? (delete v[f], await w(v), l(f), u(), !0) : !1;
  }
  async function T(f) {
    if (!o("duplicate galaxy maps")) return null;
    const v = L(f);
    if (!v)
      return t(`Map "${f}" was not found.`), null;
    const I = Y({ ...v, id: xe("map"), title: `${v.title} Copy` }), b = h();
    return b[I.id] = I, await w(b), u(I.id), d(I);
  }
  async function K(f, v = {}) {
    var ue;
    if (!o("save star systems")) return null;
    const I = h();
    if (!I[f])
      return t(`Map "${f}" was not found.`), null;
    const b = Y(I[f]), M = b.systems.find((he) => he.id === v.id), x = v.objects ?? (M == null ? void 0 : M.objects) ?? [], $ = (M == null ? void 0 : M.primaryObjectId) || ((ue = x[0]) == null ? void 0 : ue.id), C = ["image", "sceneIds", "planetLocations", "journalId", "planetPreset", "planetShape", "planetFinish", "planetTexture", "planetColor"], z = x.map((he) => he.id !== $ ? he : Nt({
      ...he,
      ...Object.fromEntries(C.filter((X) => v[X] !== void 0).map((X) => [X, v[X]]))
    })), Z = di({ ...M, ...v, objects: z }), fe = b.systems.findIndex((he) => he.id === Z.id);
    return fe >= 0 ? b.systems[fe] = Z : b.systems.push(Z), I[f] = b, await _(I, f), d(Z);
  }
  async function Q(f, v, I = {}) {
    var Z, fe, ue;
    if (!o("save locations")) return null;
    const b = h(), M = b[f] ? Y(b[f]) : null, x = M == null ? void 0 : M.systems.find((he) => he.id === v);
    if (!M || !x) return null;
    const $ = x.objects.findIndex((he) => he.id === I.id), C = x.objects[$], z = Nt({ orbits: C == null ? void 0 : C.orbits, orbit: C == null ? void 0 : C.orbit, ...I });
    if (z.orbit && !gt(x.objects, z.id, z.orbit))
      return t("Choose an orbit that exists in this system and does not depend on this location."), null;
    if (C != null && C.orbit || (Z = C == null ? void 0 : C.orbits) != null && Z.length) {
      const he = He(), X = ne(f, v), pe = rt(x.objects).positions(X.aspect, he, X.motion);
      C.orbit && !z.orbit && it(z, pe.get(z.id)), C.orbit && z.orbit && z.orbit.epoch !== C.orbit.epoch && z.orbit.centerId === C.orbit.centerId && z.orbit.orbitId === C.orbit.orbitId && z.orbit.angle === C.orbit.angle && (z.orbit.angle = ii(C.orbit, he, X.motion));
      for (const be of x.objects)
        ((fe = be.orbit) == null ? void 0 : fe.centerId) === z.id && !((ue = z.orbits) != null && ue.some((P) => P.id === be.orbit.orbitId)) && it(be, pe.get(be.id));
    }
    return $ >= 0 ? x.objects[$] = z : x.objects.push(z), x.primaryObjectId || (x.primaryObjectId = z.id), b[f] = M, await _(b, f), d(z);
  }
  function ne(f, v) {
    var I;
    for (const b of m(f)) {
      const M = (I = b.getOrbitGeometry) == null ? void 0 : I.call(b, v);
      if (M) return M;
    }
    return { aspect: ei, motion: !0 };
  }
  function V(f, v, I) {
    const b = v.objects.filter((C) => C.orbit && (C.id === I || C.orbit.centerId === I));
    if (!b.length) return;
    const { aspect: M, motion: x } = ne(f, v.id), $ = rt(v.objects).positions(M, He(), x);
    for (const C of b) it(C, $.get(C.id));
  }
  const ee = (f, v, I) => {
    var b;
    for (const M of m(f)) (b = M.refreshPlanetLocations) == null || b.call(M, v, I);
  };
  async function se(f, v, I, b = {}) {
    var fe;
    if (!o("place surface locations")) return null;
    const M = h(), x = M[f] ? Y(M[f]) : null, $ = (fe = x == null ? void 0 : x.systems.find((ue) => ue.id === v)) == null ? void 0 : fe.objects.find((ue) => ue.id === I);
    if (!x || !$) return null;
    const C = String(b.sceneId || "");
    if (!$.sceneIds.includes(C))
      return t("Only scenes linked to this object can be placed on its surface."), null;
    const z = oi(b), Z = $.planetLocations.findIndex((ue) => ue.sceneId === C && ue.shape === z.shape);
    return Z >= 0 && (z.id = $.planetLocations[Z].id), Z >= 0 ? $.planetLocations[Z] = z : $.planetLocations.push(z), M[f] = Y(x), await w(M), ee(f, v, I), game.socket.emit(we, { action: "planet-locations", mapId: f, systemId: v, objectId: I }), d(z);
  }
  async function R(f, v, I, b) {
    var z;
    if (!o("remove surface locations")) return !1;
    const M = h(), x = M[f] ? Y(M[f]) : null, $ = (z = x == null ? void 0 : x.systems.find((Z) => Z.id === v)) == null ? void 0 : z.objects.find((Z) => Z.id === I);
    if (!x || !$) return !1;
    const C = $.planetLocations.length;
    return $.planetLocations = $.planetLocations.filter((Z) => Z.id !== b), $.planetLocations.length === C ? !1 : (M[f] = Y(x), await w(M), ee(f, v, I), game.socket.emit(we, { action: "planet-locations", mapId: f, systemId: v, objectId: I }), !0);
  }
  async function F(f, v, I, b) {
    var x, $;
    if (!o("unlink scenes from locations")) return !1;
    const M = ($ = (x = L(f)) == null ? void 0 : x.systems.find((C) => C.id === v)) == null ? void 0 : $.objects.find((C) => C.id === I);
    return M != null && M.sceneIds.includes(b) ? !!await Q(f, v, { ...M, sceneIds: M.sceneIds.filter((C) => C !== b) }) : !1;
  }
  async function oe(f, v, I) {
    var $;
    if (!o("delete locations")) return !1;
    const b = h(), M = b[f] ? Y(b[f]) : null, x = M == null ? void 0 : M.systems.find((C) => C.id === v);
    return !M || !x ? !1 : (V(f, x, I), x.objects = x.objects.filter((C) => C.id !== I), x.primaryObjectId === I && (x.primaryObjectId = (($ = x.objects[0]) == null ? void 0 : $.id) ?? ""), M.currentLocation.objectId === I && (M.currentLocation.objectId = x.primaryObjectId), b[f] = M, await _(b, f), !0);
  }
  async function ae(f, v, I) {
    var z;
    if (!o("move locations")) return null;
    const b = h(), M = b[f] ? Y(b[f]) : null, x = M == null ? void 0 : M.systems.find((Z) => Z.objects.some((fe) => fe.id === v)), $ = M == null ? void 0 : M.systems.find((Z) => Z.id === I), C = x == null ? void 0 : x.objects.find((Z) => Z.id === v);
    return !M || !x || !$ || !C ? null : (x.id !== $.id && V(f, x, v), x.objects = x.objects.filter((Z) => Z.id !== v), $.objects.push(C), x.primaryObjectId === v && (x.primaryObjectId = ((z = x.objects[0]) == null ? void 0 : z.id) ?? ""), $.primaryObjectId || ($.primaryObjectId = v), M.currentLocation.objectId === v && (M.currentLocation.systemId = $.id), b[f] = M, await _(b, f), d(C));
  }
  async function ce(f, v, I) {
    if (!o("set the arrival object")) return null;
    const b = h(), M = b[f] ? Y(b[f]) : null, x = M == null ? void 0 : M.systems.find(($) => $.id === v);
    return !M || !(x != null && x.objects.some(($) => $.id === I)) ? null : (x.primaryObjectId = I, M.currentLocation.systemId === v && !M.currentLocation.objectId && (M.currentLocation.objectId = I), b[f] = M, await _(b, f), d(x));
  }
  async function re(f, v, I, b, M, x) {
    var Z, fe;
    if (!o("place locations")) return null;
    const $ = h(), C = $[f] ? Y($[f]) : null, z = (Z = C == null ? void 0 : C.systems.find((ue) => ue.id === v)) == null ? void 0 : Z.objects.find((ue) => ue.id === I);
    if (!C || !z) return null;
    if (x) {
      if (((fe = z.orbit) == null ? void 0 : fe.centerId) !== x.centerId || z.orbit.orbitId !== x.orbitId) return null;
      z.orbit.angle = x.angle, z.orbit.epoch = He();
    } else
      z.x = me(_e(b, z.x), 0, 100), z.y = me(_e(M, z.y), 0, 100);
    return $[f] = C, await _($, f), d(z);
  }
  async function ge(f, v, I, b) {
    var C;
    if (!o("change object visibility")) return null;
    const M = h(), x = M[f] ? Y(M[f]) : null, $ = (C = x == null ? void 0 : x.systems.find((z) => z.id === v)) == null ? void 0 : C.objects.find((z) => z.id === I);
    return !x || !$ ? null : ($.visibility = ri.includes(b) ? b : "inherit", $.visibility === "players" && ["undiscovered", "locked"].includes($.status) && ($.status = "known"), M[f] = x, await _(M, f), d($));
  }
  async function ve(f, v) {
    var M;
    if (!o("delete star systems")) return !1;
    const I = h(), b = I[f];
    return b ? (b.systems = b.systems.filter((x) => x.id !== v), b.routes = b.routes.filter((x) => x.fromSystemId !== v && x.toSystemId !== v), b.currentSystemId === v && (b.currentSystemId = ((M = b.systems[0]) == null ? void 0 : M.id) ?? ""), await _(I, f), !0) : !1;
  }
  async function Oe(f, v) {
    if (!o("set current location")) return null;
    const I = h(), b = I[f] ? Y(I[f]) : null, M = b == null ? void 0 : b.systems.find((x) => x.id === v);
    return !b || !M ? (t(`System "${v}" was not found.`), null) : (b.currentSystemId = v, I[f] = b, await _(I, f), d(M));
  }
  async function Pe(f, v, I) {
    if (!o("set current location")) return null;
    const b = h(), M = b[f] ? Y(b[f]) : null, x = M == null ? void 0 : M.systems.find((C) => C.id === v), $ = x == null ? void 0 : x.objects.find((C) => C.id === I);
    return !M || !x || !$ ? null : (M.currentSystemId = v, M.currentLocation = { systemId: v, objectId: I }, b[f] = M, await _(b, f), d($));
  }
  async function N(f, v = {}, I = "") {
    var z;
    if (!o("save routes")) return null;
    const b = h(), M = b[f], x = I ? (z = M == null ? void 0 : M.systems) == null ? void 0 : z.find((Z) => Z.id === I) : M;
    if (!M || !x)
      return t(I ? `System "${I}" was not found.` : `Map "${f}" was not found.`), null;
    Array.isArray(x.routes) || (x.routes = []);
    const $ = bt(v);
    if (!$.fromSystemId || !$.toSystemId || $.fromSystemId === $.toSystemId)
      return t("Routes require two different systems."), null;
    const C = x.routes.findIndex((Z) => Z.id === $.id);
    return C >= 0 ? x.routes[C] = $ : x.routes.push($), await _(b, f), d($);
  }
  async function Se(f, v, I = "") {
    var $;
    if (!o("delete routes")) return !1;
    const b = h(), M = b[f], x = I ? ($ = M == null ? void 0 : M.systems) == null ? void 0 : $.find((C) => C.id === I) : M;
    return x ? (x.routes = (x.routes ?? []).filter((C) => C.id !== v), await _(b, f), !0) : !1;
  }
  async function Le(f, v = {}) {
    if (!o("save factions")) return null;
    const I = h(), b = I[f];
    if (!b)
      return t(`Map "${f}" was not found.`), null;
    const M = mi(v), x = b.factions.findIndex(($) => $.id === M.id);
    return x >= 0 ? b.factions[x] = M : b.factions.push(M), await _(I, f), d(M);
  }
  async function p(f, v) {
    if (!o("delete factions")) return !1;
    const I = h(), b = I[f];
    if (!b) return !1;
    b.factions = b.factions.filter((M) => M.id !== v);
    for (const M of b.systems) {
      M.factionId === v && (M.factionId = "");
      for (const x of M.objects ?? []) x.factionId === v && (x.factionId = "");
    }
    return await _(I, f), !0;
  }
  async function j(f, v, I, b, M = "") {
    var fe, ue, he, X;
    if (!o(`${b ? "hide" : "reveal"} ${{ faction: "factions", system: "star systems", route: "routes" }[v]}`)) return null;
    const $ = h(), C = $[f], z = M ? (fe = C == null ? void 0 : C.systems) == null ? void 0 : fe.find((pe) => pe.id === M) : C, Z = v === "faction" ? (ue = C == null ? void 0 : C.factions) == null ? void 0 : ue.find((pe) => pe.id === I) : v === "system" ? (he = C == null ? void 0 : C.systems) == null ? void 0 : he.find((pe) => pe.id === I) : (X = z == null ? void 0 : z.routes) == null ? void 0 : X.find((pe) => pe.id === I);
    return !C || !Z ? (t(`${v[0].toUpperCase()}${v.slice(1)} "${I}" was not found.`), null) : (Z.visibility = b ? "gm" : "players", v === "system" && !b && ["undiscovered", "locked"].includes(Z.status) && (Z.status = "known"), await _($, f), d(Z));
  }
  async function n(f, v, I = !0) {
    const b = await j(f, "faction", v, I);
    return b && s(`${b.name} ${I ? "hidden from" : "visible to"} players.`), b;
  }
  async function i(f, v, { notify: I = !0 } = {}) {
    const b = await j(f, "system", v, !1);
    return b ? (I && S(f, b.id), s(`${b.name} revealed to players.`), b) : null;
  }
  async function r(f, v, I = !0) {
    const b = await j(f, "system", v, I);
    return b && s(`${b.name} ${I ? "hidden from" : "visible to"} players.`), b;
  }
  async function a(f, v, I = "") {
    const b = await j(f, "route", v, !1, I);
    return b && s("Route revealed to players."), b;
  }
  async function c(f, v, I = !0, b = "") {
    const M = await j(f, "route", v, I, b);
    return M && s(`Route ${I ? "hidden from" : "visible to"} players.`), M;
  }
  async function y(f, v, I, b) {
    var C;
    if (!o("move star systems")) return null;
    const M = h(), x = M[f], $ = (C = x == null ? void 0 : x.systems) == null ? void 0 : C.find((z) => z.id === v);
    return $ ? ($.x = me(_e(I, $.x), 0, 100), $.y = me(_e(b, $.y), 0, 100), await _(M, f, { refresh: !1 }), d($)) : (t(`System "${v}" was not found.`), null);
  }
  function S(f, v) {
    var b, M;
    if (!o("notify players about discoveries")) return;
    const I = (M = (b = L(f)) == null ? void 0 : b.systems) == null ? void 0 : M.find((x) => x.id === v);
    if (!I) {
      t(`System "${v}" was not found.`);
      return;
    }
    game.socket.emit(we, { action: "notify", mapId: f, systemId: v, message: `New System Discovered: ${I.name}` }), s(`Discovery notification sent: ${I.name}.`);
  }
  async function g(f, { replace: v = !1 } = {}) {
    if (!o("import galaxy maps")) return null;
    const I = h();
    let b = Y(f);
    return I[b.id] && !v && (b = Y({ ...b, id: xe("map"), title: `${b.title} Import` })), I[b.id] = b, await w(I), u(b.id), s(`Imported ${b.title}.`), d(b);
  }
  function E(f) {
    const v = L(f);
    if (!v) {
      t(`Map "${f}" was not found.`);
      return;
    }
    vs(`${Ss(v.title)}.json`, Y(v));
  }
  const O = () => Object.values(h()).map(Y), G = (f, v) => d(Y(L(f)).systems.find((I) => I.id === String(v)) ?? null);
  function B(f, v) {
    const I = Y(L(f));
    for (const b of I.systems) {
      const M = b.objects.find((x) => x.id === String(v));
      if (M) return { systemId: b.id, object: d(M) };
    }
    return null;
  }
  const W = (f, v) => {
    const I = Y(L(f)).systems.find((b) => b.id === String(v));
    return [...new Set((I == null ? void 0 : I.objects.flatMap((b) => b.sceneIds)) ?? [])];
  }, H = (f, v) => {
    var I;
    return [...((I = B(f, v)) == null ? void 0 : I.object.sceneIds) ?? []];
  };
  function te(f) {
    return O().flatMap((v) => v.systems.flatMap((I) => I.objects.filter((b) => b.sceneIds.includes(String(f))).map((b) => ({ mapId: v.id, mapTitle: v.title, systemId: I.id, systemName: I.name, object: d(b) }))));
  }
  function de(f) {
    return O().flatMap((v) => v.systems.filter((I) => I.objects.some((b) => b.sceneIds.includes(String(f)))).map((I) => ({ mapId: v.id, mapTitle: v.title, system: d(I) })));
  }
  return {
    getMapStore: h,
    saveMapStore: w,
    getRawMap: L,
    createMap: A,
    updateMap: q,
    updateMapMetadata: D,
    deleteMap: U,
    duplicateMap: T,
    upsertSystem: K,
    upsertObject: Q,
    savePlanetLocation: se,
    removePlanetLocation: R,
    unlinkPlanetScene: F,
    deleteObject: oe,
    moveObject: ae,
    setPrimaryObject: ce,
    saveObjectPosition: re,
    setObjectVisibility: ge,
    deleteSystem: ve,
    setCurrentSystem: Oe,
    setCurrentObject: Pe,
    upsertRoute: N,
    deleteRoute: Se,
    upsertFaction: Le,
    deleteFaction: p,
    hideFactionFromPlayers: n,
    saveSystemPosition: y,
    revealSystemToPlayers: i,
    hideSystemFromPlayers: r,
    revealRouteToPlayers: a,
    hideRouteFromPlayers: c,
    notifySystemDiscovered: S,
    importMapData: g,
    exportMap: E,
    getMaps: O,
    getSystem: G,
    getObject: B,
    getSceneIdsForSystem: W,
    getSceneIdsForObject: H,
    getObjectsForScene: te,
    getSystemsForScene: de,
    updateOpenPlanetLocations: ee
  };
}
function Us(e) {
  const {
    getRawMap: t,
    setCurrentSystem: s,
    setCurrentObject: o,
    getOpenMapViews: u,
    getAppHtml: l,
    notifyInfo: m,
    notifyError: d,
    getActiveUsers: k,
    getPrimaryGM: h,
    isPrimaryGM: w
  } = e, L = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Set(), A = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map();
  function D(p, j, n) {
    return p.routes.find((i) => i.fromSystemId === j && i.toSystemId === n || i.toSystemId === j && i.fromSystemId === n) ?? null;
  }
  function U(p, j) {
    const n = t(p);
    if (!n)
      return d(`Map "${p}" was not found.`), null;
    const i = Y(n), r = i.systems.find((g) => g.id === i.currentSystemId), a = i.systems.find((g) => g.id === j);
    if (!a)
      return d(`System "${j}" was not found.`), null;
    if (!r)
      return d("This map does not have a current location yet. Ask the GM to set one first."), null;
    if (r.id === a.id)
      return m(`${a.name} is already the current location.`), null;
    if (i.visibility !== "players" || r.visibility !== "players" || a.visibility !== "players")
      return d("That travel destination is not visible to players."), null;
    const c = D(i, r.id, a.id);
    if (!c || c.visibility !== "players")
      return d(`No player-visible direct route from ${r.name} to ${a.name}.`), null;
    const y = h();
    if (!y)
      return d("A GM must be online to approve player travel."), null;
    const S = tt(k(), game.user.id, y, i.travelApprovalMode);
    return {
      action: "travel-request",
      requestId: xe("travel"),
      mapId: p,
      mapTitle: i.title,
      fromSystemId: r.id,
      fromName: r.name,
      toSystemId: a.id,
      toName: a.name,
      routeId: c.id,
      routeType: c.type,
      travelTime: c.travelTime,
      fuelCost: c.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      ...S
    };
  }
  function T(p, j) {
    const n = U(p, j);
    return n ? (game.socket.emit(we, n), m(`Travel request sent: ${n.fromName} to ${n.toName}.`), n) : null;
  }
  function K(p, j, n) {
    const i = t(p);
    if (!i)
      return d(`Map "${p}" was not found.`), null;
    const r = Y(i), a = r.systems.find((O) => O.id === j), c = a == null ? void 0 : a.objects.find((O) => O.id === r.currentLocation.objectId), y = a == null ? void 0 : a.objects.find((O) => O.id === n);
    if (!a || r.currentLocation.systemId !== a.id || !c)
      return d("The current location is not inside this system."), null;
    if (!y)
      return d(`Destination "${n}" was not found.`), null;
    if (c.id === y.id)
      return m(`${y.name} is already the current location.`), null;
    if (r.visibility !== "players" || a.visibility !== "players" || Ne(a, c) !== "players" || Ne(a, y) !== "players")
      return d("That travel destination is not visible to players."), null;
    const S = D({ routes: a.routes }, c.id, y.id);
    if (!S || S.visibility !== "players")
      return d(`No player-visible direct route from ${c.name} to ${y.name}.`), null;
    const g = h();
    if (!g)
      return d("A GM must be online to approve player travel."), null;
    const E = tt(k(), game.user.id, g, r.travelApprovalMode);
    return {
      action: "travel-request",
      travelScope: "object",
      requestId: xe("travel"),
      mapId: p,
      mapTitle: r.title,
      systemId: a.id,
      fromObjectId: c.id,
      fromName: c.name,
      toObjectId: y.id,
      toName: y.name,
      routeId: S.id,
      routeType: S.type,
      travelTime: S.travelTime,
      fuelCost: S.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      ...E
    };
  }
  function Q(p, j, n) {
    const i = K(p, j, n);
    return i ? (game.socket.emit(we, i), m(`Travel request sent: ${i.fromName} to ${i.toName}.`), i) : null;
  }
  function ne(p, j) {
    var c, y;
    if (!j) return;
    q.set(p, j);
    const n = (c = A.get(p)) == null ? void 0 : c.root;
    if (!n) return;
    const i = n.querySelector("[data-travel-progress-count]"), r = n.querySelector("[data-travel-progress-pending]"), a = n.querySelector("[data-travel-progress-bar]");
    i && (i.textContent = `${j.acceptedCount} of ${j.requiredApprovals} approvals`), r && (r.textContent = (y = j.pendingNames) != null && y.length ? `Waiting for: ${j.pendingNames.join(", ")}` : "All votes received"), a && (a.style.width = `${Math.min(100, j.acceptedCount / Math.max(1, j.requiredApprovals) * 100)}%`);
  }
  function V(p) {
    var c, y, S, g;
    if (!(p != null && p.requestId) || p.requesterId === ((c = game.user) == null ? void 0 : c.id) || !((S = p.voterIds) != null && S.includes((y = game.user) == null ? void 0 : y.id)) || _.has(p.requestId)) return;
    _.add(p.requestId);
    let j = !1, n = !1, i = null;
    const r = (E) => {
      if (j) return;
      j = !0;
      const O = {
        action: "travel-vote",
        requestId: p.requestId,
        mapId: p.mapId,
        userId: game.user.id,
        userName: game.user.name,
        accepted: E
      };
      game.socket.emit(we, O), Pe(O);
    }, a = ((g = pt.find((E) => E.value === p.approvalMode)) == null ? void 0 : g.label) ?? "Unanimous agreement";
    i = new Dialog({
      title: "Travel Request",
      content: `<section class="gmf-travel-request">
        <p><strong>${Ie(p.requesterName)}</strong> wants to travel on <strong>${Ie(p.mapTitle)}</strong>.</p>
        <p>${Ie(p.fromName)} &rarr; ${Ie(p.toName)}</p>
        <p class="gmf-travel-request__meta">${Ie(p.routeType)} route / ${Ie(p.travelTime || "Unknown time")} / Fuel ${Ie(p.fuelCost ?? 0)}</p>
        <p class="gmf-travel-request__mode"><i class="fa-solid fa-users"></i> ${Ie(a)}</p>
        <div class="gmf-travel-progress" data-travel-progress aria-live="polite">
          <div class="gmf-travel-progress__bar"><span data-travel-progress-bar></span></div>
          <strong data-travel-progress-count>Waiting for vote status…</strong><span data-travel-progress-pending></span>
        </div></section>`,
      render: (E) => {
        const O = gi(E), G = A.get(p.requestId);
        G && (G.root = O), ne(p.requestId, q.get(p.requestId));
      },
      buttons: {
        accept: { icon: '<i class="fa-solid fa-check"></i>', label: "Accept", callback: () => r(!0) },
        decline: { icon: '<i class="fa-solid fa-xmark"></i>', label: "Decline", callback: () => r(!1) }
      },
      default: "accept",
      close: () => {
        A.delete(p.requestId), n || r(!1);
      }
    }, { classes: ["galaxy-map", "gmf-crud-dialog"], width: 420, height: Math.max(320, Math.min(440, window.innerHeight - 80)) }), A.set(p.requestId, { root: null, resolve: () => {
      n = !0, j = !0, i == null || i.close();
    } }), i.render(!0);
  }
  const ee = (p) => {
    var j;
    return !!(p != null && p.coordinatorId && p.coordinatorId === ((j = h()) == null ? void 0 : j.id));
  };
  function se(p) {
    const j = $t(p);
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
      pendingNames: j.pendingIds.map((n) => {
        var i;
        return ((i = p.voterNames) == null ? void 0 : i[n]) || "Navigator";
      }),
      coordinatorId: game.user.id
    };
  }
  function R(p) {
    const j = se(p);
    return ne(p.requestId, j), game.socket.emit(we, j), j;
  }
  function F(p) {
    var n, i, r;
    if (!(p != null && p.requestId) || !ee(p)) return;
    const j = q.get(p.requestId);
    if (ne(p.requestId, p), p.requesterId === ((n = game.user) == null ? void 0 : n.id) && (!j || j.acceptedCount !== p.acceptedCount || j.declinedCount !== p.declinedCount)) {
      const a = (i = p.pendingNames) != null && i.length ? ` Waiting for ${p.pendingNames.join(", ")}.` : "";
      (r = ui.notifications) == null || r.info(`Travel vote: ${p.acceptedCount}/${p.requiredApprovals} approvals.${a}`);
    }
  }
  function oe(p) {
    if (!w() || !(p != null && p.requestId) || L.has(p.requestId)) return null;
    const j = t(p.mapId);
    if (!j) return null;
    const n = Y(j), i = k().find((H) => H.id === p.requesterId && !H.isGM), r = p.travelScope === "object", a = r ? n.systems.find((H) => H.id === p.systemId) : null, c = r ? a == null ? void 0 : a.objects.find((H) => H.id === n.currentLocation.objectId) : n.systems.find((H) => H.id === n.currentSystemId), y = r ? a == null ? void 0 : a.objects.find((H) => H.id === p.toObjectId) : n.systems.find((H) => H.id === p.toSystemId), S = c && y ? D(r ? { routes: (a == null ? void 0 : a.routes) ?? [] } : n, c.id, y.id) : null, g = r && (!a || n.currentLocation.systemId !== a.id || a.visibility !== "players" || Ne(a, c) !== "players" || Ne(a, y) !== "players"), E = !r && ((c == null ? void 0 : c.visibility) !== "players" || (y == null ? void 0 : y.visibility) !== "players");
    if (!i || n.visibility !== "players" || !c || !y || c.id === y.id || g || E || !S || S.visibility !== "players") return null;
    const O = h(), G = tt(k(), p.requesterId, O, n.travelApprovalMode), B = globalThis.setTimeout(() => {
      const H = L.get(p.requestId);
      H && Oe(H, { reason: "Travel request timed out." });
    }, rs), W = {
      action: "travel-ballot",
      requestId: String(p.requestId).slice(0, 80),
      mapId: n.id,
      mapTitle: n.title,
      travelScope: r ? "object" : "system",
      systemId: r ? a.id : "",
      fromSystemId: r ? a.id : c.id,
      fromObjectId: r ? c.id : "",
      fromName: c.name,
      toSystemId: r ? a.id : y.id,
      toObjectId: r ? y.id : "",
      toName: y.name,
      routeId: S.id,
      routeType: S.type,
      travelTime: S.travelTime,
      fuelCost: S.fuelCost,
      requesterId: i.id,
      requesterName: i.name,
      coordinatorId: game.user.id,
      ...G,
      accepted: /* @__PURE__ */ new Set(),
      declined: /* @__PURE__ */ new Set(),
      timeoutId: B
    };
    return L.set(p.requestId, W), R(W), W;
  }
  function ae(p) {
    const j = Y(t(p.mapId)), n = p.travelScope === "object", i = n ? j.systems.find((c) => c.id === p.systemId) : null, r = n ? i == null ? void 0 : i.objects.find((c) => c.id === p.fromObjectId) : j.systems.find((c) => c.id === p.fromSystemId), a = n ? i == null ? void 0 : i.objects.find((c) => c.id === p.toObjectId) : j.systems.find((c) => c.id === p.toSystemId);
    !r || !a || u(p.mapId).forEach((c) => {
      var S;
      const y = l(c);
      if (y) {
        if (n) {
          if (c.activeSystemId !== i.id) return;
          c.selectedObjectId = a.id;
        } else c.selectedSystemId = a.id;
        c.selectedRouteId = null, (S = c._animateShipTravel) == null || S.call(c, r, a, y);
      }
    });
  }
  const ce = (p, j, n) => {
    var i;
    return game.socket.emit(
      we,
      { action: "travel-animation", mapId: p, fromSystemId: j, toSystemId: n, coordinatorId: (i = game.user) == null ? void 0 : i.id }
    );
  }, re = (p, j, n, i) => {
    var r;
    return game.socket.emit(
      we,
      { action: "travel-animation", travelScope: "object", mapId: p, systemId: j, fromObjectId: n, toObjectId: i, coordinatorId: (r = game.user) == null ? void 0 : r.id }
    );
  };
  function ge(p) {
    var j;
    L.delete(p.requestId), p.timeoutId && globalThis.clearTimeout(p.timeoutId), _.delete(p.requestId), (j = A.get(p.requestId)) == null || j.resolve(), A.delete(p.requestId), q.delete(p.requestId);
  }
  async function ve(p) {
    ge(p);
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
    game.socket.emit(we, j), ae(j), m(`Travel approved: ${p.fromName} to ${p.toName}.`), globalThis.setTimeout(() => {
      p.travelScope === "object" ? o(p.mapId, p.systemId, p.toObjectId) : s(p.mapId, p.toSystemId);
    }, vt);
  }
  function Oe(p, { voterName: j = "", reason: n = "" } = {}) {
    ge(p);
    const i = n || `${j || "A participant"} declined the request.`, r = {
      action: "travel-declined",
      requestId: p.requestId,
      mapId: p.mapId,
      fromName: p.fromName,
      toName: p.toName,
      voterName: j,
      reason: i,
      coordinatorId: game.user.id
    };
    game.socket.emit(we, r), m(`Travel cancelled: ${i}`);
  }
  function Pe(p) {
    if (!w() || !(p != null && p.requestId)) return;
    const j = L.get(p.requestId);
    if (!j || !j.voterIds.includes(p.userId) || j.accepted.has(p.userId) || j.declined.has(p.userId)) return;
    p.accepted ? j.accepted.add(p.userId) : j.declined.add(p.userId);
    const n = $t(j);
    R(j), n.outcome === "approved" ? ve(j) : n.outcome === "declined" && Oe(j, {
      voterName: p.userName,
      reason: j.approvalMode === "unanimous" ? `${p.userName || "A participant"} declined the unanimous request.` : "The remaining votes cannot reach a majority."
    });
  }
  function N(p) {
    var j;
    p.requestId && _.delete(p.requestId), (j = A.get(p.requestId)) == null || j.resolve(), A.delete(p.requestId), q.delete(p.requestId);
  }
  function Se(p) {
    var j, n;
    !ee(p) || p.coordinatorId === ((j = game.user) == null ? void 0 : j.id) || (N(p), ae(p), (n = ui.notifications) == null || n.info(`Travel approved: ${p.fromName} to ${p.toName}.`));
  }
  function Le(p) {
    var j, n;
    !ee(p) || p.coordinatorId === ((j = game.user) == null ? void 0 : j.id) || (N(p), (n = ui.notifications) == null || n.warn(`Travel cancelled: ${p.reason || `${p.voterName || "A participant"} declined.`}`));
  }
  return {
    getTravelRoute: D,
    requestTravelToSystem: T,
    requestTravelToObject: Q,
    promptForTravelRequest: V,
    isPrimaryGMMessage: ee,
    handleTravelProgress: F,
    trackTravelRequest: oe,
    animateTravelOnOpenMaps: ae,
    broadcastTravelAnimation: ce,
    broadcastObjectTravelAnimation: re,
    handleTravelVote: Pe,
    handleTravelApproved: Se,
    handleTravelDeclined: Le
  };
}
function Ys(e) {
  return `
    <div class="gmf-texture-guide" data-texture-guide data-shape="${Ie(e)}">
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
let qe = null;
const Ge = /* @__PURE__ */ new Map();
let le = null, ze = null;
function Vt(e) {
  return foundry.utils.deepClone(e);
}
function Re(e) {
  var t;
  (t = ui.notifications) == null || t.error(`[Galaxy Map] ${e}`);
}
function Be(e) {
  var t;
  (t = ui.notifications) == null || t.info(`[Galaxy Map] ${e}`);
}
function Mt(e = "change galaxy maps") {
  var t;
  return (t = game.user) != null && t.isGM ? !0 : (Re(`Only a GM can ${e}.`), !1);
}
function Ii() {
  return game.users.filter((e) => e.active);
}
function wi() {
  return Ii().filter((e) => e.isGM).sort((e, t) => String(e.id).localeCompare(String(t.id)))[0] ?? null;
}
function Mi() {
  var e, t;
  return !!((e = game.user) != null && e.isGM && ((t = wi()) == null ? void 0 : t.id) === game.user.id);
}
const {
  getMapStore: Ut,
  saveMapStore: Yt,
  getRawMap: We,
  createMap: Li,
  updateMap: Ws,
  updateMapMetadata: _i,
  deleteMap: xi,
  duplicateMap: Ti,
  upsertSystem: Ei,
  upsertObject: Pi,
  savePlanetLocation: ki,
  removePlanetLocation: qi,
  unlinkPlanetScene: Oi,
  deleteObject: Lt,
  moveObject: Xs,
  setPrimaryObject: Js,
  saveObjectPosition: Ci,
  setObjectVisibility: Ai,
  deleteSystem: _t,
  setCurrentSystem: xt,
  setCurrentObject: Tt,
  upsertRoute: ji,
  deleteRoute: Et,
  upsertFaction: Ri,
  deleteFaction: Pt,
  hideFactionFromPlayers: $i,
  saveSystemPosition: Fi,
  revealSystemToPlayers: Ni,
  hideSystemFromPlayers: kt,
  revealRouteToPlayers: Di,
  hideRouteFromPlayers: qt,
  importMapData: Gi,
  exportMap: Ot,
  getMaps: et,
  getSystem: Zs,
  getObject: Ks,
  getSceneIdsForSystem: Qs,
  getSceneIdsForObject: en,
  getObjectsForScene: tn,
  getSystemsForScene: sn,
  updateOpenPlanetLocations: nn
} = Vs({ notifyError: Re, notifyInfo: Be, requireGM: Mt, refreshOpenApps: zi, closeOpenMap: yn, getOpenMapViews: Ct });
function Bi(e) {
  var s;
  const t = Hi(e);
  return ((s = t == null ? void 0 : t.closest) == null ? void 0 : s.call(t, ".window-app, .application, .app")) ?? t;
}
function an(e) {
  return e.map((t) => {
    var u, l;
    const s = Bi(t);
    if (!s) return null;
    const o = Number.parseInt(((l = (u = globalThis.getComputedStyle) == null ? void 0 : u.call(globalThis, s)) == null ? void 0 : l.zIndex) ?? "", 10);
    return { app: t, zIndex: s.style.zIndex || (Number.isFinite(o) ? String(o) : "") };
  }).filter(Boolean);
}
function at(e) {
  for (const t of e) {
    const s = Bi(t.app);
    !(s != null && s.isConnected) || !t.zIndex || (s.style.zIndex = t.zIndex);
  }
}
async function zi(e = null) {
  var l;
  const t = [...Ge.entries()].filter(([m, d]) => (d == null ? void 0 : d.rendered) && (!e || m === e)).map(([, m]) => m);
  le != null && le.rendered && (!e || le.mapId === e) && t.push(le);
  const s = [qe != null && qe.rendered ? qe : null, ...t].filter(Boolean), o = an(s), u = s.map((m) => Promise.resolve(m.render({ force: !0 })));
  at(o), await Promise.allSettled(u), at(o), (l = globalThis.requestAnimationFrame) == null || l.call(globalThis, () => at(o));
}
function Ct(e) {
  const t = [...Ge.values()];
  return le && t.push(le), t.filter((s) => (s == null ? void 0 : s.rendered) && s.mapId === e);
}
function Hi(e) {
  return e.element ?? null;
}
const {
  getTravelRoute: rn,
  requestTravelToSystem: Vi,
  requestTravelToObject: Ui,
  promptForTravelRequest: Wt,
  isPrimaryGMMessage: on,
  handleTravelProgress: cn,
  trackTravelRequest: ln,
  animateTravelOnOpenMaps: dn,
  broadcastTravelAnimation: un,
  broadcastObjectTravelAnimation: mn,
  handleTravelVote: fn,
  handleTravelApproved: pn,
  handleTravelDeclined: hn
} = Us({
  getRawMap: We,
  setCurrentSystem: xt,
  setCurrentObject: Tt,
  getOpenMapViews: Ct,
  getAppHtml: Hi,
  notifyInfo: Be,
  notifyError: Re,
  getActiveUsers: Ii,
  getPrimaryGM: wi,
  isPrimaryGM: Mi
});
function yn(e) {
  const t = Ge.get(e);
  t && t.close(), (le == null ? void 0 : le.mapId) === e && le.close();
}
function $e(e, t = {}) {
  var d;
  const s = We(e);
  if (!s)
    return Re(`Map "${e}" was not found.`), null;
  const o = t.playerMode ?? !((d = game.user) != null && d.isGM);
  if (o && s.visibility !== "players" && !t.broadcast)
    return Re("That galaxy map is not visible to players."), null;
  const u = o ? `player:${e}` : e, l = o && (le == null ? void 0 : le.mapId) === e ? le : Ge.get(u);
  if (l != null && l.rendered)
    return l.bringToFront(), l;
  const m = new Mn({ mapId: e, playerMode: o });
  return o ? le = m : Ge.set(u, m), m.render({ force: !0 }), m;
}
async function gn(e, t, s = {}) {
  var u;
  if (!e || !t) return !1;
  const o = $e(e, {
    playerMode: s.playerMode ?? !((u = game.user) != null && u.isGM),
    broadcast: s.broadcast === !0
  });
  return o != null && o.focusSystem ? o.focusSystem(t, s) : !1;
}
async function Sn(e, t = {}, s = {}) {
  var m, d;
  const o = String(t.systemId || ""), u = String(t.objectId || "");
  if (!e || !o) return !1;
  const l = $e(e, { playerMode: s.playerMode ?? !((m = game.user) != null && m.isGM), broadcast: s.broadcast === !0 });
  return l ? u && l.focusLocation ? l.focusLocation(o, u, s) : (d = l.focusSystem) == null ? void 0 : d.call(l, o, s) : !1;
}
function vn(e, t = "") {
  var o;
  let s = !1;
  for (const u of Ct(e))
    s = ((o = u.clearSystemFocus) == null ? void 0 : o.call(u, t)) || s;
  return s;
}
function At() {
  return Mt("open the map manager") ? (qe || (qe = new In()), qe.render({ force: !0 }), qe) : null;
}
function jt() {
  const e = Yi();
  return e.length ? e.length === 1 ? $e(e[0].id, { playerMode: !0 }) : (ze || (ze = new wn()), ze.render({ force: !0 }), ze) : (Be("No galaxy map is currently visible to players."), null);
}
function Yi() {
  return et().filter((e) => e.visibility === "players").sort((e, t) => e.title.localeCompare(t.title));
}
function bn() {
  var t;
  const e = et().sort((s, o) => s.title.localeCompare(o.title));
  return (t = game.user) != null && t.isGM ? e.length === 1 ? $e(e[0].id) : At() : jt();
}
function Wi(e) {
  if (Mt("broadcast galaxy maps")) {
    if (!We(e)) {
      Re(`Map "${e}" was not found.`);
      return;
    }
    game.socket.emit(we, { action: "open", mapId: e }), Be("Map broadcast sent to players.");
  }
}
const In = Is({
  templateRoot: ke,
  getMaps: et,
  prepareMapForManager: zs,
  getRawMap: We,
  importMapData: Gi,
  exportMap: Ot,
  duplicateMap: Ti,
  deleteMap: xi,
  createMap: Li,
  deleteSystem: _t,
  deleteObject: Lt,
  deleteRoute: Et,
  deleteFaction: Pt,
  openMap: $e,
  showMapToPlayers: Wi,
  hideSystemFromPlayers: kt,
  hideRouteFromPlayers: qt,
  hideFactionFromPlayers: $i,
  notifyError: Re,
  clearManagerApp: (e) => {
    qe === e && (qe = null);
  }
}), wn = Fs({
  templateRoot: ke,
  getVisibleMaps: Yi,
  openMap: $e,
  clearChooser: (e) => {
    ze === e && (ze = null);
  }
}), Mn = $s({
  templateRoot: ke,
  getRawMap: We,
  prepareMapForDisplay: Bs,
  upsertSystem: Ei,
  upsertObject: Pi,
  upsertRoute: ji,
  upsertFaction: Ri,
  updateMapMetadata: _i,
  deleteFaction: Pt,
  getTextureGuideMarkup: Ys,
  activateObjectEditorControls: Hs,
  revealSystemToPlayers: Ni,
  revealRouteToPlayers: Di,
  hideSystemFromPlayers: kt,
  setObjectVisibility: Ai,
  hideRouteFromPlayers: qt,
  deleteSystem: _t,
  deleteObject: Lt,
  deleteRoute: Et,
  setCurrentSystem: xt,
  setCurrentObject: Tt,
  requestTravelToSystem: Vi,
  requestTravelToObject: Ui,
  exportMap: Ot,
  getTravelRoute: rn,
  broadcastTravelAnimation: un,
  broadcastObjectTravelAnimation: mn,
  notifyInfo: Be,
  notifyError: Re,
  saveSystemPosition: Fi,
  saveObjectPosition: Ci,
  savePlanetLocation: ki,
  removePlanetLocation: qi,
  unlinkPlanetScene: Oi,
  clearMapView: (e) => {
    e.playerMode && le === e && (le = null);
    for (const [t, s] of Ge.entries())
      s === e && Ge.delete(t);
  }
});
function Ln() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: Me,
    title: "Galaxy Map",
    icon: "fa-solid fa-route",
    premium: !1,
    description: "Open cinematic campaign maps and navigation charts.",
    open: () => {
      var s;
      return (s = game.user) != null && s.isGM ? At() : jt();
    }
  }), !0) : !1;
}
Hooks.once("init", async () => {
  game.settings.register(Me, ut, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(Me, Ze, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(Me, mt, {
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  }), Handlebars.registerHelper("gmfEq", (e, t) => e === t), Handlebars.registerHelper("gmfJson", (e) => JSON.stringify(e, null, 2)), Handlebars.registerHelper("gmfPercent", (e) => `${Number(e).toFixed(3)}%`), Handlebars.registerHelper("gmfFallback", (e, t) => e || t), Hooks.on("renderDialog", (e, t) => {
    var u, l;
    const s = gi(t), o = ((u = s == null ? void 0 : s.closest) == null ? void 0 : u.call(s, ".window-app, .application, .app")) ?? s;
    (l = o == null ? void 0 : o.classList) != null && l.contains("galaxy-map") && gs(e, t);
  }), await loadTemplates([
    `${ke}/map-manager.hbs`,
    `${ke}/galaxy-map.hbs`,
    `${ke}/map-context-menu.hbs`,
    `${ke}/celestial-icon.hbs`,
    `${ke}/object-appearance-panel.hbs`,
    `${ke}/system-details.hbs`,
    `${ke}/player-map-chooser.hbs`
  ]);
});
Hooks.once("ready", async () => {
  game.galaxyMap = {
    openMap: $e,
    focusSystem: gn,
    focusLocation: Sn,
    clearSystemFocus: vn,
    openMapManager: At,
    openGalaxyMapFromSceneControls: bn,
    openPlayerMapChooser: jt,
    createMap: Li,
    getMaps: et,
    getSystem: Zs,
    getObject: Ks,
    getSceneIdsForSystem: Qs,
    getSystemsForScene: sn,
    getSceneIdsForObject: en,
    getObjectsForScene: tn,
    showMapToPlayers: Wi,
    updateMap: Ws,
    updateMapMetadata: _i,
    deleteMap: xi,
    duplicateMap: Ti,
    upsertSystem: Ei,
    deleteSystem: _t,
    upsertObject: Pi,
    deleteObject: Lt,
    moveObject: Xs,
    setPrimaryObject: Js,
    upsertRoute: ji,
    deleteRoute: Et,
    upsertFaction: Ri,
    deleteFaction: Pt,
    saveSystemPosition: Fi,
    saveObjectPosition: Ci,
    savePlanetLocation: ki,
    removePlanetLocation: qi,
    unlinkPlanetScene: Oi,
    setCurrentSystem: xt,
    setCurrentObject: Tt,
    revealSystemToPlayers: Ni,
    revealRouteToPlayers: Di,
    hideSystemFromPlayers: kt,
    setObjectVisibility: Ai,
    hideRouteFromPlayers: qt,
    hideFactionFromPlayers: $i,
    requestTravelToSystem: Vi,
    requestTravelToObject: Ui,
    importMapData: Gi,
    exportMap: Ot
  };
  const e = game.modules.get(Me);
  if (e && (e.api = game.galaxyMap), Ln(), Mi()) {
    const t = Ut();
    if (Object.values(t).some((o) => Number((o == null ? void 0 : o.schemaVersion) || 1) < Ae)) {
      const o = Vt(game.settings.get(Me, Ze) ?? {});
      Object.keys(o).length || await game.settings.set(Me, Ze, t);
      const u = Object.fromEntries(Object.entries(t).map(([l, m]) => [l, Y(m)]));
      await Yt(u), Be('Your galaxy maps were updated to the new format. Everything from the old single map is now inside a system called "System 1", and a backup of the old data was kept.');
    }
    if (!game.settings.get(Me, mt)) {
      const o = Vt(game.settings.get(Me, Ze) ?? {}), u = Ut();
      let l = 0;
      for (const [m, d] of Object.entries(o)) {
        if (!u[m]) continue;
        const k = Y(u[m]);
        for (const h of (d == null ? void 0 : d.systems) ?? []) {
          const w = ci(h == null ? void 0 : h.planetLocations);
          if (!w.length) continue;
          const L = k.systems.flatMap((_) => _.objects).find((_) => _.id === h.id || _.id === `${h.id}-object`);
          !L || L.planetLocations.length || (L.planetLocations = w.filter((_) => L.sceneIds.includes(_.sceneId)), l += L.planetLocations.length);
        }
        u[m] = Y(k);
      }
      l && (await Yt(u), Be(`Restored ${l} surface location${l === 1 ? "" : "s"} that went missing in an earlier update.`)), await game.settings.set(Me, mt, !0);
    }
  }
  game.socket.on(we, (t = {}) => {
    var s, o, u, l, m;
    if (t.action === "travel-request") {
      const d = ln(t);
      d && (game.socket.emit(we, d), Wt(d));
      return;
    }
    if (t.action === "travel-ballot") {
      on(t) && t.coordinatorId !== ((s = game.user) == null ? void 0 : s.id) && Wt(t);
      return;
    }
    if (t.action === "travel-vote") {
      fn(t);
      return;
    }
    if (t.action === "travel-progress") {
      cn(t);
      return;
    }
    if (t.action === "travel-approved") {
      pn(t);
      return;
    }
    if (t.action === "travel-declined") {
      hn(t);
      return;
    }
    if (t.action === "travel-animation") {
      t.coordinatorId !== ((o = game.user) == null ? void 0 : o.id) && dn(t);
      return;
    }
    if (t.action === "planet-locations") {
      nn(t.mapId, t.systemId, t.objectId);
      return;
    }
    if (t.action === "refresh") {
      (u = game.user) != null && u.isGM ? zi(t.mapId) : (le == null ? void 0 : le.mapId) === t.mapId && le.render({ force: !0 });
      return;
    }
    (l = game.user) != null && l.isGM || (t.action === "open" && t.mapId && (le == null || le.close(), $e(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "notify" && ((m = ui.notifications) == null || m.info(t.message || "New system discovered."), (le == null ? void 0 : le.mapId) === t.mapId && le.render({ force: !0 })));
  }), console.log(`${Me} | Ready. API available at game.galaxyMap.`);
});
