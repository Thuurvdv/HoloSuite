var yi = Object.defineProperty;
var gi = (e, t, i) => t in e ? yi(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var W = (e, t, i) => gi(e, typeof t != "symbol" ? t + "" : t, i);
const it = [
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
], hn = [
  ...it,
  { value: "color", label: "Flat color" },
  { value: "custom", label: "Custom texture" },
  { value: "none", label: "No detail view" }
], Si = [
  { value: "sphere", label: "Sphere" },
  { value: "cube", label: "Cube" },
  { value: "donut", label: "Donut" },
  { value: "asteroid", label: "Asteroid" },
  { value: "crystal", label: "Crystal" },
  { value: "cylinder", label: "Cylinder" }
], bi = [
  { value: "smooth", label: "Smooth" },
  { value: "matte", label: "Matte" },
  { value: "holographic", label: "Holographic" }
];
function mt(e) {
  return Si.some((t) => t.value === e) ? String(e) : "sphere";
}
function yn(e) {
  return bi.some((t) => t.value === e) ? String(e) : "smooth";
}
function xt(e) {
  return e === "auto" ? "ice" : hn.some((t) => t.value === e) ? String(e) : "ice";
}
const gn = /* @__PURE__ */ new Set(["color", "custom", "none"]), Zt = {
  sphere: it.map((e) => e.value).filter((e) => !["prison", "anomaly", "cube", "donut-planet"].includes(e)),
  cube: ["cube"],
  donut: ["donut-planet"],
  asteroid: ["asteroid"],
  crystal: ["anomaly"],
  cylinder: ["prison"]
};
function Sn(e) {
  const t = new Set(Zt[mt(e)] ?? Zt.sphere);
  return hn.filter((i) => t.has(i.value) || gn.has(i.value));
}
function bn(e, t) {
  var u;
  const i = xt(e), r = Sn(t);
  return r.some((c) => c.value === i) ? i : ((u = r.find((c) => !gn.has(c.value))) == null ? void 0 : u.value) ?? "color";
}
function vi(e) {
  return e === "black-hole";
}
function Ne(e, t = "") {
  if (!e || e.obscured || e.planetPreset === "none") return null;
  const i = xt(e.planetPreset), r = it.find((f) => f.value === t) ?? it.find((f) => f.value === i) ?? it[0], u = !t && i === "custom" && !!e.planetTexture, c = !t && i === "color";
  return {
    texture: c ? null : u ? e.planetTexture : `modules/galaxy-map/assets/planets/${r.texture}`,
    label: c ? "Flat color" : u ? "Custom texture" : r.label,
    preset: c ? "color" : u ? "custom" : r.value,
    color: c ? e.planetColor || "#58d8ff" : r.color,
    shape: mt(e.planetShape),
    finish: yn(e.planetFinish)
  };
}
const qt = [
  { value: "gm", label: "GM approval" },
  { value: "majority", label: "Majority vote" },
  { value: "unanimous", label: "Unanimous agreement" }
];
function kt(e) {
  return qt.some((t) => t.value === e) ? String(e) : "unanimous";
}
function yt(e, t, i, r) {
  const u = kt(r), c = [...new Map((e ?? []).filter((P) => P == null ? void 0 : P.id).map((P) => [String(P.id), P])).values()], f = u === "gm" ? i != null && i.id ? [i] : [] : c.filter((P) => String(P.id) !== String(t)), d = f.map((P) => String(P.id)), T = Object.fromEntries(f.map((P) => [String(P.id), String(P.name || "Navigator").slice(0, 80)])), v = d.length + (u === "gm" ? 0 : 1), w = u === "gm" ? 1 : u === "majority" ? Math.floor(v / 2) + 1 : v;
  return { approvalMode: u, voterIds: d, voterNames: T, participantCount: v, requiredApprovals: w };
}
function Kt(e) {
  const t = kt(e == null ? void 0 : e.approvalMode), i = [...new Set(((e == null ? void 0 : e.voterIds) ?? []).map((w) => String(w)))], r = new Set([...(e == null ? void 0 : e.accepted) ?? []].map((w) => String(w))), u = new Set([...(e == null ? void 0 : e.declined) ?? []].map((w) => String(w))), c = t === "gm" ? 0 : 1, f = Math.max(1, Number(e == null ? void 0 : e.requiredApprovals) || (t === "unanimous" ? i.length + 1 : 1)), d = c + i.filter((w) => r.has(w)).length, T = i.filter((w) => u.has(w)).length, v = i.filter((w) => !r.has(w) && !u.has(w));
  return d >= f ? { outcome: "approved", acceptedCount: d, declinedCount: T, required: f, pendingIds: v } : t === "unanimous" && T > 0 ? { outcome: "declined", acceptedCount: d, declinedCount: T, required: f, pendingIds: v } : d + v.length < f ? { outcome: "declined", acceptedCount: d, declinedCount: T, required: f, pendingIds: v } : { outcome: "pending", acceptedCount: d, declinedCount: T, required: f, pendingIds: v };
}
const vn = 16 / 9;
function et() {
  var t;
  const e = typeof game > "u" || (t = game.time) == null ? void 0 : t.serverTime;
  return Number.isFinite(e) ? e : Date.now();
}
function tt(e, t, i, r) {
  const u = Number(e);
  return Number.isFinite(u) ? Math.min(r, Math.max(i, u)) : t;
}
function Ot(e) {
  return (e % 360 + 360) % 360;
}
function Ii(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of Array.isArray(e) ? e : [])
    typeof (i == null ? void 0 : i.id) != "string" || !i.id || t.has(i.id) || t.set(i.id, { id: i.id, radius: tt(i.radius ?? 15, 15, 1, 100) });
  return [...t.values()];
}
function wi(e) {
  if (!(typeof (e == null ? void 0 : e.centerId) != "string" || !e.centerId || typeof e.orbitId != "string" || !e.orbitId))
    return {
      centerId: e.centerId,
      orbitId: e.orbitId,
      angle: Ot(tt(e.angle, 0, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)),
      period: Number(e.period) > 0 ? tt(e.period, 60, 5, 3600) : 0,
      clockwise: e.clockwise !== !1,
      epoch: tt(e.epoch, 0, 0, Number.MAX_SAFE_INTEGER)
    };
}
function Ct(e, t, i) {
  const r = new Map(e.map((u) => [u.id, u]));
  return In(r, t, i);
}
function In(e, t, i) {
  var f;
  const r = e.get(i.centerId);
  if (!((f = r == null ? void 0 : r.orbits) != null && f.some((d) => d.id === i.orbitId))) return !1;
  const u = /* @__PURE__ */ new Set([t]);
  let c = r;
  for (; c; ) {
    if (u.has(c.id)) return !1;
    u.add(c.id), c = c.orbit ? e.get(c.orbit.centerId) : void 0;
  }
  return !0;
}
function wn(e, t, i = !0) {
  if (!i || !e.period) return e.angle;
  const r = (t - e.epoch) % (e.period * 1e3);
  return Ot(e.angle + r / (e.period * 1e3) * 360 * (e.clockwise ? 1 : -1));
}
function Mn(e, t) {
  return { x: e / Math.max(1, t), y: e * Math.min(1, t) };
}
function Pn(e, t, i) {
  return Ot(Math.atan2(e.y - t.y, (e.x - t.x) * i) * 180 / Math.PI);
}
function It(e, t = /* @__PURE__ */ new Set()) {
  const i = new Map(e.map((d) => [d.id, d])), r = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set();
  function f(d) {
    var w;
    if (c.has(d.id) || (c.add(d.id), !d.orbit)) return;
    const T = i.get(d.orbit.centerId), v = (w = T == null ? void 0 : T.orbits) == null ? void 0 : w.find((P) => {
      var x;
      return P.id === ((x = d.orbit) == null ? void 0 : x.orbitId);
    });
    if (T && v && In(i, d.id, d.orbit) && (f(T), !u.has(T.id) && !t.has(T.id))) {
      t.has(d.id) || r.set(d.id, { orbit: v, attachment: d.orbit });
      return;
    }
    u.add(d.id);
  }
  return e.forEach(f), {
    attachments: r,
    rings: e.flatMap((d) => u.has(d.id) || t.has(d.id) ? [] : (d.orbits ?? []).map((T) => ({ centerId: d.id, ...T }))),
    animated: [...r.values()].some(({ attachment: d }) => d.period > 0),
    positions(d, T, v = !0, w) {
      const P = /* @__PURE__ */ new Map();
      function x($) {
        const O = P.get($.id);
        if (O) return O;
        const C = r.get($.id), D = (w == null ? void 0 : w.id) === $.id ? w.point : $;
        let H = { x: D.x, y: D.y };
        if (C) {
          const Q = x(i.get(C.attachment.centerId)), ae = ((w == null ? void 0 : w.id) === $.id ? w.angle ?? Pn(D, Q, d) : wn(C.attachment, T, v)) * Math.PI / 180, M = Mn(C.orbit.radius, d);
          H = { x: Q.x + M.x * Math.cos(ae), y: Q.y + M.y * Math.sin(ae) };
        }
        return P.set($.id, H), H;
      }
      return e.forEach(x), P;
    }
  };
}
function gt(e, t) {
  t && (e.x = tt(t.x, e.x, 0, 100), e.y = tt(t.y, e.y, 0, 100)), delete e.orbit;
}
const De = 3, Mi = ["core", "colony", "frontier", "ruins", "restricted", "unknown"], Pi = ["star", "planet", "moon", "station", "asteroid", "anomaly", "black-hole", "other"], En = ["undiscovered", "known", "visited", "danger", "locked"], Ei = ["safe", "dangerous", "restricted", "smuggler", "unknown"], wt = ["gm", "players"], _n = ["inherit", ...wt], _i = [
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
], At = _i.map((e) => e.value), Mt = At, St = 0.2, bt = 10, jt = 2400, Li = 6e4;
function Te(e = "gmf") {
  return `${e}-${foundry.utils.randomID(10)}`;
}
function rt(e, t = "players") {
  const i = wt.includes(t) ? t : "players";
  return wt.includes(e) ? e : i;
}
function Ti(e) {
  return _n.includes(e) ? String(e) : "inherit";
}
function xi(e) {
  return typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "#58d8ff";
}
function Pt(e) {
  return typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "";
}
function Ce(e, t = 0) {
  const i = Number(e);
  return Number.isFinite(i) ? i : t;
}
function qi(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  return [...new Set(t.map((i) => String(i).trim()).filter(Boolean))];
}
function pe(e, t, i) {
  return Math.min(i, Math.max(t, e));
}
function Qt(e, t) {
  return !Array.isArray(e) || e.length < 3 ? [...t] : e.slice(0, 3).map((i, r) => pe(Ce(i, t[r]), -2.5, 2.5));
}
function Ln(e = {}) {
  const t = Qt(e.normal, [0, 0, 1]), i = Math.hypot(...t) || 1;
  return {
    id: String(e.id || Te("location")),
    sceneId: String(e.sceneId || "").trim(),
    shape: mt(e.shape),
    position: Qt(e.position, [0, 0, 1]),
    normal: t.map((r) => r / i),
    surfaceVersion: 1
  };
}
function Tn(e) {
  const t = /* @__PURE__ */ new Set();
  return (Array.isArray(e) ? e : []).slice(0, 64).map(Ln).filter((i) => {
    const r = `${i.sceneId}:${i.shape}`;
    return !i.sceneId || t.has(r) ? !1 : (t.add(r), !0);
  });
}
function xn(e = {}) {
  return Pi.includes(e.kind) ? e.kind : e.type === "station" || e.iconStyle === "station" ? "station" : e.type === "anomaly" ? "anomaly" : e.iconStyle === "star" ? "star" : e.iconStyle === "black-hole" ? "black-hole" : e.planetShape === "asteroid" ? "asteroid" : ["planet", "terrestrial", "gas-giant", "ice-world", "volcanic", "artificial", "ringed"].includes(e.iconStyle) ? "planet" : "other";
}
function Et(e = {}) {
  const t = qi(e.sceneIds === void 0 ? e.sceneId : e.sceneIds), i = String(e.planetTexture || "").trim(), r = mt(e.planetShape), u = xt(e.planetPreset), c = bn(u, r), f = i && !["none", "color"].includes(c) ? "custom" : c, d = xn(e), T = Ii(e.orbits), v = wi(e.orbit);
  return {
    id: String(e.id || Te("object")),
    name: String(e.name || "Unnamed Object"),
    kind: d,
    x: pe(Ce(e.x, 50), 0, 100),
    y: pe(Ce(e.y, 50), 0, 100),
    status: En.includes(e.status) ? e.status : "known",
    visibility: Ti(e.visibility),
    factionId: String(e.factionId || ""),
    description: String(e.description || ""),
    image: String(e.image || ""),
    sceneIds: t,
    planetLocations: Tn(e.planetLocations).filter((P) => t.includes(P.sceneId)),
    journalId: String(e.journalId || ""),
    notes: String(e.notes || "").trim(),
    iconColor: Pt(e.iconColor),
    iconSize: pe(Ce(e.iconSize, 28), 18, 56),
    markerImage: String(e.markerImage || "").trim(),
    iconStyle: At.includes(e.iconStyle) ? e.iconStyle : d === "star" ? "star" : d === "station" ? "station" : "planet",
    pulse: e.pulse !== !1,
    planetPreset: f,
    planetShape: r,
    planetFinish: yn(e.planetFinish),
    planetTexture: i,
    planetColor: Pt(e.planetColor) || "#58d8ff",
    ...T.length ? { orbits: T } : {},
    ...v ? { orbit: v } : {}
  };
}
const en = Et;
function qn(e = {}) {
  var T;
  const t = Array.isArray(e.objects) ? e.objects.map(Et) : [], i = t.filter((v) => v.orbit && !Ct(t, v.id, v.orbit));
  for (const v of i) delete v.orbit;
  const r = new Set(t.map((v) => v.id)), u = (Array.isArray(e.routes) ? e.routes : []).map(Rt).filter((v) => v.fromSystemId !== v.toSystemId && r.has(v.fromSystemId) && r.has(v.toSystemId)), c = t.some((v) => v.id === e.primaryObjectId) ? String(e.primaryObjectId) : ((T = t[0]) == null ? void 0 : T.id) ?? "", f = t.find((v) => v.id === c) ?? Et(e), d = {
    id: String(e.id || Te("system")),
    name: String(e.name || "Unnamed System"),
    x: pe(Ce(e.x, 50), 0, 100),
    y: pe(Ce(e.y, 50), 0, 100),
    type: Mi.includes(e.type) ? e.type : "unknown",
    factionId: String(e.factionId || ""),
    status: En.includes(e.status) ? e.status : "known",
    description: String(e.description || ""),
    visibility: rt(e.visibility, "players"),
    notes: String(e.notes || "").trim(),
    backgroundImage: String(e.backgroundImage || "").trim(),
    iconColor: Pt(e.iconColor),
    iconSize: pe(Ce(e.iconSize, 30), 18, 56),
    markerImage: String(e.markerImage || "").trim(),
    iconStyle: At.includes(e.iconStyle) ? e.iconStyle : "star",
    pulse: e.pulse !== !1,
    primaryObjectId: c,
    objects: t,
    routes: u
  };
  for (const [v, w] of Object.entries({
    image: f.image,
    sceneIds: [...f.sceneIds],
    planetLocations: [...f.planetLocations],
    journalId: f.journalId,
    planetPreset: f.planetPreset,
    planetShape: f.planetShape,
    planetFinish: f.planetFinish,
    planetTexture: f.planetTexture,
    planetColor: f.planetColor
  })) Object.defineProperty(d, v, { value: w, enumerable: !1, configurable: !0 });
  return d;
}
function Rt(e = {}) {
  return {
    id: String(e.id || Te("route")),
    fromSystemId: String(e.fromSystemId || ""),
    toSystemId: String(e.toSystemId || ""),
    type: Ei.includes(e.type) ? e.type : "unknown",
    travelTime: String(e.travelTime || ""),
    fuelCost: Ce(e.fuelCost, 0),
    visibility: rt(e.visibility, "players"),
    notes: String(e.notes || "")
  };
}
function st(e) {
  return typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 100;
}
function kn(e = {}) {
  const t = e.kind === "minor" ? "minor" : "major", i = Object.fromEntries(Object.entries(e.systemProminence ?? {}).filter(([, r]) => typeof r == "string" && r && r !== "Unrated"));
  return {
    ...e,
    id: String(e.id || Te("faction")),
    name: String(e.name || "Unaffiliated"),
    color: xi(e.color),
    description: String(e.description || ""),
    visibility: rt(e.visibility, "players"),
    emblem: String(e.emblem || "").trim(),
    tagline: String(e.tagline || "").trim(),
    type: String(e.type || "").trim(),
    headquartersSystemId: String(e.headquartersSystemId || ""),
    gmNotes: String(e.gmNotes || ""),
    kind: t,
    parentFactionId: t === "minor" ? String(e.parentFactionId || "") : "",
    prominence: typeof e.prominence == "string" && e.prominence ? e.prominence : "Unrated",
    systemProminence: i,
    prominencePercent: st(e.prominencePercent) ? e.prominencePercent : null,
    systemProminencePercent: Object.fromEntries(Object.entries(e.systemProminencePercent ?? {}).filter(([, r]) => st(r))),
    reputation: typeof e.reputation == "string" && e.reputation ? e.reputation : "Neutral",
    reputationPercent: st(e.reputationPercent) ? e.reputationPercent : null
  };
}
function Ft(e = {}) {
  return `${String(e.id || "galaxy")}-system-1`;
}
function ki(e = {}) {
  const t = String(e.id || e.objectId || Te("object")), i = xn(e);
  return {
    ...e,
    id: t,
    name: String(e.name || "Unnamed Location"),
    kind: i,
    x: e.x,
    y: e.y,
    visibility: e.visibility,
    iconColor: e.iconColor,
    iconSize: e.iconSize,
    iconStyle: e.iconStyle === "planet" && i !== "planet" ? i === "station" ? "station" : i === "star" ? "star" : "diamond" : e.iconStyle,
    pulse: e.pulse
  };
}
function On(e, t, i = "", r = Ft(e), u = []) {
  var f;
  const c = t.some((d) => d.id === i) ? i : ((f = t[0]) == null ? void 0 : f.id) ?? "";
  return {
    id: r,
    name: "System 1",
    x: 50,
    y: 50,
    type: "core",
    factionId: "",
    status: "known",
    description: "",
    visibility: rt(e.visibility, "players"),
    notes: "",
    iconColor: "",
    iconSize: 30,
    iconStyle: "star",
    pulse: !0,
    primaryObjectId: c,
    objects: t,
    routes: u
  };
}
function Oi(e, t) {
  var f;
  const r = (Array.isArray(e.systems) ? e.systems : []).map(ki), u = String(e.currentSystemId || ((f = r[0]) == null ? void 0 : f.id) || ""), c = On(e, r, u, Ft(e), Array.isArray(e.routes) ? e.routes : []);
  return {
    ...e,
    schemaVersion: De,
    migratedFromSchema: t,
    systems: [c],
    routes: [],
    currentLocation: { systemId: c.id, objectId: c.primaryObjectId },
    currentSystemId: c.id
  };
}
function tn(e) {
  return !!(e != null && e.id && (e == null ? void 0 : e.primaryObjectId) === `${e.id}-object` && Array.isArray(e.objects) && e.objects.some((t) => t.id === e.primaryObjectId));
}
function Ci(e) {
  var ae, M, U, K;
  const t = Array.isArray(e.systems) ? e.systems : [], i = t.filter(tn), r = t.filter((j) => !tn(j));
  if (!i.length && t.length) return { ...e, schemaVersion: De };
  const u = new Set(r.map((j) => String(j.id)));
  let c = Ft(e);
  u.has(c) && (c = `${c}-legacy`);
  const f = new Set(i.map((j) => String(j.id))), d = new Map(i.map((j) => [String(j.id), String(j.primaryObjectId)])), T = i.flatMap((j) => (j.objects ?? []).map((B) => {
    const ne = B.id === j.primaryObjectId;
    return {
      ...B,
      x: ne ? j.x : B.x,
      y: ne ? j.y : B.y,
      visibility: B.visibility === "inherit" ? j.visibility : B.visibility,
      factionId: B.factionId || j.factionId || ""
    };
  })), v = String(((ae = e.currentLocation) == null ? void 0 : ae.systemId) || e.currentSystemId || ""), w = i.find((j) => j.id === v), P = String(((M = e.currentLocation) == null ? void 0 : M.objectId) || (w == null ? void 0 : w.primaryObjectId) || ((U = T[0]) == null ? void 0 : U.id) || ""), x = Array.isArray(e.routes) ? e.routes : [], $ = x.filter((j) => f.has(String(j.fromSystemId)) && f.has(String(j.toSystemId))).map((j) => ({ ...j, fromSystemId: d.get(String(j.fromSystemId)), toSystemId: d.get(String(j.toSystemId)) })), O = On(e, T, P, c, $), C = [O, ...r], D = new Set(C.map((j) => String(j.id))), H = /* @__PURE__ */ new Set(), Q = x.filter((j) => !(f.has(String(j.fromSystemId)) && f.has(String(j.toSystemId)))).map((j) => ({
    ...j,
    fromSystemId: f.has(String(j.fromSystemId)) ? c : j.fromSystemId,
    toSystemId: f.has(String(j.toSystemId)) ? c : j.toSystemId
  })).filter((j) => {
    if (j.fromSystemId === j.toSystemId || !D.has(String(j.fromSystemId)) || !D.has(String(j.toSystemId))) return !1;
    const B = [j.fromSystemId, j.toSystemId].sort().join(":");
    return H.has(B) ? !1 : (H.add(B), !0);
  }), ce = f.has(v) || !D.has(v) ? c : v;
  return {
    ...e,
    schemaVersion: De,
    migratedFromSchema: 2,
    systems: C,
    routes: Q,
    currentLocation: { systemId: ce, objectId: ce === c ? O.primaryObjectId : ((K = e.currentLocation) == null ? void 0 : K.objectId) ?? "" },
    currentSystemId: ce
  };
}
function Ai(e = {}) {
  const t = Number(e.schemaVersion) || 1;
  if (t > De) throw new Error(`Galaxy Map schema ${t} is newer than supported schema ${De}.`);
  return t >= De ? { ...e, schemaVersion: De } : t < 2 ? Oi(e, t) : Ci(e);
}
function Y(e = {}) {
  var x, $, O, C;
  const t = Ai(e), i = Array.isArray(t.systems) ? t.systems.map(qn) : [], r = Array.isArray(t.routes) ? t.routes.map(Rt) : [], u = Array.isArray(t.factions) ? t.factions.filter((D) => D && typeof D == "object").map(kn) : [], c = new Set(u.filter((D) => D.kind === "major").map((D) => D.id)), f = new Set(i.map((D) => D.id));
  for (const D of u)
    (!c.has(D.parentFactionId) || D.parentFactionId === D.id) && (D.parentFactionId = ""), D.systemProminence = Object.fromEntries(Object.entries(D.systemProminence).filter(([H]) => f.has(H))), D.systemProminencePercent = Object.fromEntries(Object.entries(D.systemProminencePercent).filter(([H]) => f.has(H)));
  const d = String(((x = t.currentLocation) == null ? void 0 : x.systemId) || t.currentSystemId || (($ = i[0]) == null ? void 0 : $.id) || ""), T = i.some((D) => D.id === d) ? d : ((O = i[0]) == null ? void 0 : O.id) ?? "", v = i.find((D) => D.id === T), w = String(((C = t.currentLocation) == null ? void 0 : C.objectId) || ""), P = v != null && v.objects.some((D) => D.id === w) ? w : (v == null ? void 0 : v.primaryObjectId) ?? "";
  return {
    schemaVersion: De,
    id: String(t.id || Te("map")),
    title: String(t.title || "Untitled Galaxy Map"),
    subtitle: String(t.subtitle || ""),
    description: String(t.description || ""),
    backgroundImage: String(t.backgroundImage || ""),
    visibility: rt(t.visibility, "players"),
    travelApprovalMode: kt(t.travelApprovalMode),
    currentLocation: { systemId: T, objectId: P },
    currentSystemId: T,
    systems: i,
    routes: r,
    factions: u
  };
}
function Xe(e, t) {
  return (t == null ? void 0 : t.visibility) === "inherit" ? (e == null ? void 0 : e.visibility) ?? "gm" : (t == null ? void 0 : t.visibility) ?? "gm";
}
const ji = "modules/galaxy-map/assets/frames/galaxy-frame-cyan.svg";
let nn = null;
const sn = /* @__PURE__ */ new Map();
let lt = null;
const dt = {
  default: { primary: "#69e8ff", success: "#62ffb6", background: "#03070b" },
  ember: { primary: "#ffb86b", success: "#ffe08a", background: "#0d0604" },
  violet: { primary: "#a9b8ff", success: "#7dffc4", background: "#070713" },
  "space-police": { primary: "#fff15a", success: "#9fffd1", background: "#020202" },
  red: { primary: "#ff304f", success: "#66ffc7", background: "#050103" },
  corporate: { primary: "#147dba", success: "#21875c", background: "#dce3e6" }
};
function an(e, t, i) {
  const r = (f) => [1, 3, 5].map((d) => Number.parseInt(f.slice(d, d + 2), 16)), u = r(e), c = r(t);
  return `rgb(${u.map((f, d) => Math.round(f * i + c[d] * (1 - i))).join(", ")})`;
}
function Ri() {
  var r, u, c, f, d, T;
  const e = document.documentElement, t = ((r = e == null ? void 0 : e.dataset) == null ? void 0 : r.holosuiteDeviceStyle) || ((c = (u = document.body) == null ? void 0 : u.dataset) == null ? void 0 : c.holosuiteDeviceStyle) || "";
  if (dt[t]) return dt[t];
  const i = ((f = e == null ? void 0 : e.dataset) == null ? void 0 : f.holosuiteTheme) || ((T = (d = document.body) == null ? void 0 : d.dataset) == null ? void 0 : T.holosuiteTheme) || "default";
  return dt[i] ?? dt.default;
}
async function Cn(e) {
  const { primary: t, success: i, background: r } = Ri(), u = an(t, r, 0.58), c = an(t, r, 0.34), f = [t, i, u, c, r].join("|");
  e.dataset.gmfFramePalette = f;
  let d = sn.get(f);
  if (!d)
    try {
      nn ?? (nn = fetch(ji).then((w) => {
        if (!w.ok) throw new Error(`Galaxy frame request failed (${w.status})`);
        return w.text();
      }));
      let T = await nn;
      T = T.replace(/<script\b[\s\S]*?<\/script>/gi, "");
      const v = /* @__PURE__ */ new Map([
        ["#18ebed", t],
        ["#28f3f5", t],
        ["#3be8e4", t],
        ["#64f4f1", i],
        ["#1490ab", u],
        ["#22788b", c],
        ["#042228", r]
      ]);
      for (const [w, P] of v) T = T.replace(new RegExp(w, "gi"), P);
      d = URL.createObjectURL(new Blob([T], { type: "image/svg+xml" })), sn.set(f, d);
    } catch {
      return;
    }
  e.isConnected && e.dataset.gmfFramePalette === f && e.style.setProperty("--gmf-frame-image", `url("${d}")`);
}
function Fi() {
  if (lt) return;
  lt = new MutationObserver(() => {
    document.querySelectorAll(".gmf-manager-window, .gmf-map-window, .gmf-crud-dialog").forEach((t) => void Cn(t));
  });
  const e = { attributes: !0, attributeFilter: ["data-holosuite-theme", "data-holosuite-device-style"] };
  lt.observe(document.documentElement, e), document.body && lt.observe(document.body, e);
}
function An(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
function jn(e) {
  var t, i;
  return e ? (t = e.matches) != null && t.call(e, ".window-app, .application, .app") ? e : (i = e.closest) == null ? void 0 : i.call(e, ".window-app, .application, .app") : null;
}
function ft(e, t) {
  const i = An(t), r = jn(i);
  r && (Fi(), Cn(r));
  const u = Array.from((i == null ? void 0 : i.querySelectorAll("[data-gmf-window-drag]")) ?? []);
  if (!(!i || !r || !u.length)) {
    i.querySelectorAll("[data-action='close-window']").forEach((c) => {
      c.dataset.gmfCloseBound !== "true" && (c.dataset.gmfCloseBound = "true", c.addEventListener("click", () => {
        var f;
        return (f = e.close) == null ? void 0 : f.call(e);
      }));
    });
    for (const c of u)
      c.dataset.gmfDragBound !== "true" && (c.dataset.gmfDragBound = "true", c.addEventListener("pointerdown", (f) => {
        var C, D, H;
        if (f.button !== 0) return;
        const d = f.target;
        if ((C = d == null ? void 0 : d.closest) != null && C.call(d, "button, input, select, textarea, a, [data-action]")) return;
        const T = r.getBoundingClientRect(), v = f.clientX, w = f.clientY, P = T.left, x = T.top;
        (D = e.bringToFront ?? e.bringToTop) == null || D.call(e), (H = c.setPointerCapture) == null || H.call(c, f.pointerId), c.classList.add("is-dragging");
        const $ = (Q) => {
          var K;
          const ce = r.getBoundingClientRect().width, ae = r.getBoundingClientRect().height, M = Math.max(0, Math.min(window.innerWidth - Math.min(ce, 80), P + Q.clientX - v)), U = Math.max(0, Math.min(window.innerHeight - Math.min(ae, 48), x + Q.clientY - w));
          (K = e.setPosition) == null || K.call(e, { left: M, top: U });
        }, O = () => {
          c.classList.remove("is-dragging"), c.removeEventListener("pointermove", $), c.removeEventListener("pointerup", O), c.removeEventListener("pointercancel", O);
        };
        c.addEventListener("pointermove", $), c.addEventListener("pointerup", O), c.addEventListener("pointercancel", O);
      }));
  }
}
function $i(e, t) {
  var v, w;
  const i = An(t), r = jn(i), u = (v = r == null ? void 0 : r.querySelector) == null ? void 0 : v.call(r, ":scope > .window-content");
  if (!i || !r || !u || u.querySelector(":scope > .gmf-dialog-header")) return;
  const c = document.createElement("header");
  c.className = "gmf-dialog-header", c.dataset.gmfWindowDrag = "true";
  const f = document.createElement("div");
  f.className = "gmf-dialog-header__identity", f.innerHTML = '<span class="gmf-dialog-header__orb"><i class="fa-solid fa-satellite"></i></span><span><small>GALAXY MAP // CONTROL PANEL</small><strong></strong></span>';
  const d = f.querySelector("strong");
  d && (d.textContent = (e == null ? void 0 : e.title) || ((w = r.querySelector(".window-title")) == null ? void 0 : w.textContent) || "Galaxy Map");
  const T = document.createElement("button");
  T.type = "button", T.className = "gmf-window-close", T.dataset.action = "close-window", T.title = "Close", T.setAttribute("aria-label", "Close window"), T.innerHTML = '<i class="fa-solid fa-xmark"></i>', c.append(f, T), u.prepend(c), ft(e, r);
}
const We = {
  classes: ["galaxy-map", "gmf-crud-dialog"]
};
function pt() {
  const { ApplicationV2: e, HandlebarsApplicationMixin: t } = foundry.applications.api;
  return t(e);
}
const he = "galaxy-map", _t = "maps", Rn = "enableFactions", Ni = "showProminencePercentages", Di = "reputationRatings", Gi = "prominenceRatings", ut = "schemaV1Backup", Lt = "surfaceLocationRecoveryV2", _e = `module.${he}`, Oe = `modules/${he}/templates`;
function Re() {
  var e;
  return ((e = game.settings) == null ? void 0 : e.get(he, Rn)) !== !1;
}
const nt = {
  reputation: {
    setting: Di,
    title: "Reputation",
    icon: "fa-solid fa-users",
    labelsSetting: "showReputationLabels",
    percentagesSetting: "showReputationPercentages",
    defaults: ["Hostile", "Unfriendly", "Neutral", "Friendly", "Allied"]
  },
  prominence: {
    setting: Gi,
    title: "Prominence",
    icon: "fa-solid fa-layer-group",
    labelsSetting: "showProminenceLabels",
    percentagesSetting: Ni,
    defaults: ["Absent", "Limited", "Established", "Influential", "Dominant"]
  }
};
function rn(e) {
  var r, u;
  const { labelsSetting: t, percentagesSetting: i } = nt[e];
  return {
    showLabels: ((r = game.settings) == null ? void 0 : r.get(he, t)) !== !1,
    showPercentages: ((u = game.settings) == null ? void 0 : u.get(he, i)) === !0
  };
}
function Fn(e) {
  return nt[e].defaults.map((t) => ({ id: t, label: t }));
}
function Tt(e) {
  var i, r;
  const t = (r = (i = game.settings) == null ? void 0 : i.get(he, nt[e].setting)) == null ? void 0 : r.ratings;
  return Array.isArray(t) ? t.filter((u) => typeof (u == null ? void 0 : u.id) == "string" && u.id && typeof u.label == "string" && u.label.trim()) : Fn(e);
}
function Bi(e) {
  return String(e || "galaxy-map").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "galaxy-map";
}
function zi(e, t) {
  const i = JSON.stringify(t, null, 2), r = globalThis.saveDataToFile;
  if (typeof r == "function") {
    r(i, "application/json", e);
    return;
  }
  const u = new Blob([i], { type: "application/json" }), c = URL.createObjectURL(u), f = document.createElement("a");
  f.href = c, f.download = e, document.body.appendChild(f), f.click(), f.remove(), setTimeout(() => URL.revokeObjectURL(c), 0);
}
function Le(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function $n(e) {
  return (e == null ? void 0 : e[0]) ?? e ?? null;
}
function on(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
}
function Hi(e = globalThis) {
  var u, c, f;
  const t = (f = (c = (u = e.foundry) == null ? void 0 : u.applications) == null ? void 0 : c.apps) == null ? void 0 : f.FilePicker, i = t == null ? void 0 : t.implementation;
  if (typeof i == "function") return i;
  if (typeof t == "function") return t;
  const r = typeof FilePicker == "function" ? FilePicker : e.FilePicker;
  return typeof r == "function" ? r : null;
}
function Nn(e) {
  const t = (i) => i ? e.querySelector(`[name="${i}"]`) : null;
  e.querySelectorAll("[data-browse-target]").forEach((i) => {
    i.addEventListener("click", (r) => {
      r.preventDefault();
      const u = t(i.dataset.browseTarget);
      if (!u) return;
      const c = Hi();
      if (!c) {
        console.error("galaxy-map | Foundry FilePicker is unavailable.");
        return;
      }
      new c({
        type: "image",
        current: u.value,
        callback: (f) => {
          u.value = f, on(u);
        }
      }).browse();
    });
  }), e.querySelectorAll("[data-clear-target]").forEach((i) => {
    i.addEventListener("click", (r) => {
      r.preventDefault();
      const u = t(i.dataset.clearTarget);
      u && (u.value = "", on(u));
    });
  });
}
function Vi(e) {
  var M;
  const {
    templateRoot: t,
    getMaps: i,
    prepareMapForManager: r,
    getRawMap: u,
    importMapData: c,
    exportMap: f,
    duplicateMap: d,
    deleteMap: T,
    createMap: v,
    deleteSystem: w,
    deleteObject: P,
    deleteRoute: x,
    deleteFaction: $,
    openMap: O,
    showMapToPlayers: C,
    hideSystemFromPlayers: D,
    hideRouteFromPlayers: H,
    hideFactionFromPlayers: Q,
    notifyError: ce,
    clearManagerApp: ae
  } = e;
  return M = class extends pt() {
    constructor(j = {}) {
      super(j);
      W(this, "selectedMapId");
      W(this, "activeTab");
      W(this, "expandedSystemId");
      this.selectedMapId = j.selectedMapId ?? null, this.activeTab = ["systems", "routes", "factions"].includes(j.activeTab) ? j.activeTab : "systems", this.expandedSystemId = j.expandedSystemId;
    }
    async _prepareContext(j) {
      var te, Se;
      const B = await super._prepareContext(j), ne = !Re();
      ne && this.activeTab === "factions" && (this.activeTab = "systems");
      const re = i().sort((be, Ie) => be.title.localeCompare(Ie.title));
      (!this.selectedMapId || !re.some((be) => be.id === this.selectedMapId)) && (this.selectedMapId = ((te = re[0]) == null ? void 0 : te.id) ?? null);
      const ie = this.selectedMapId ? r(u(this.selectedMapId)) : null;
      if (ie) {
        const be = new Set(ie.systems.map((Ie) => Ie.id));
        this.expandedSystemId && !be.has(this.expandedSystemId) && (this.expandedSystemId = void 0), this.expandedSystemId === void 0 && (this.expandedSystemId = ((Se = ie.systems[0]) == null ? void 0 : Se.id) ?? null), ie.systems = ie.systems.map((Ie) => ({
          ...Ie,
          isExpanded: Ie.id === this.expandedSystemId
        }));
      }
      return {
        ...B,
        maps: re,
        selectedMap: ie,
        selectedMapId: this.selectedMapId,
        activeTab: this.activeTab,
        factionsDisabled: ne,
        showSystems: this.activeTab === "systems",
        showRoutes: this.activeTab === "routes",
        showFactions: this.activeTab === "factions",
        hasMaps: re.length > 0
      };
    }
    _attachPartListeners(j, B, ne) {
      var re, ie, te, Se, be, Ie, xe;
      super._attachPartListeners(j, B, ne), ft(this, B), (re = B.querySelector("[data-action='create-map']")) == null || re.addEventListener("click", () => this._onCreateMap()), (ie = B.querySelector("[data-action='edit-map-metadata']")) == null || ie.addEventListener("click", () => {
        this._openViewportEditor("map");
      }), (te = B.querySelector("[data-action='create-system']")) == null || te.addEventListener("click", () => {
        this._openViewportEditor("system");
      }), (Se = B.querySelector("[data-action='create-route']")) == null || Se.addEventListener("click", () => {
        this._openViewportEditor("route");
      }), (be = B.querySelector("[data-action='create-faction']")) == null || be.addEventListener("click", () => {
        this._openViewportEditor("faction");
      }), B.querySelectorAll("[data-manager-tab]").forEach((R) => {
        R.addEventListener("click", () => {
          const ge = R.dataset.managerTab;
          !["systems", "routes", "factions"].includes(ge) || ge === this.activeTab || (this.activeTab = ge, this.render({ force: !0 }));
        });
      }), B.querySelectorAll("[data-toggle-system]").forEach((R) => {
        R.addEventListener("click", () => {
          const ge = R.dataset.toggleSystem;
          this.expandedSystemId = this.expandedSystemId === ge ? null : ge, this.render({ force: !0 });
        });
      }), B.querySelectorAll("[data-edit-system]").forEach((R) => {
        R.addEventListener("click", () => this._openViewportEditor("system", { id: R.dataset.editSystem }));
      }), B.querySelectorAll("[data-create-object]").forEach((R) => {
        R.addEventListener("click", () => this._openViewportEditor("entity", { systemId: R.dataset.createObject }));
      }), B.querySelectorAll("[data-edit-object]").forEach((R) => {
        R.addEventListener("click", () => this._openViewportEditor("entity", { systemId: R.dataset.objectSystem, id: R.dataset.editObject }));
      }), B.querySelectorAll("[data-delete-object]").forEach((R) => {
        R.addEventListener("click", () => this._confirmDeleteObject(R.dataset.objectSystem, R.dataset.deleteObject));
      }), B.querySelectorAll("[data-show-system]").forEach((R) => {
        R.addEventListener("click", () => D(this.selectedMapId, R.dataset.showSystem, !1));
      }), B.querySelectorAll("[data-hide-system]").forEach((R) => {
        R.addEventListener("click", () => D(this.selectedMapId, R.dataset.hideSystem, !0));
      }), B.querySelectorAll("[data-delete-system]").forEach((R) => {
        R.addEventListener("click", () => this._confirmDeleteSystem(R.dataset.deleteSystem));
      }), B.querySelectorAll("[data-edit-route]").forEach((R) => {
        R.addEventListener("click", () => this._openViewportEditor("route", { id: R.dataset.editRoute, systemId: R.dataset.routeSystem }));
      }), B.querySelectorAll("[data-show-route]").forEach((R) => {
        R.addEventListener("click", () => H(this.selectedMapId, R.dataset.showRoute, !1, R.dataset.routeSystem));
      }), B.querySelectorAll("[data-hide-route]").forEach((R) => {
        R.addEventListener("click", () => H(this.selectedMapId, R.dataset.hideRoute, !0, R.dataset.routeSystem));
      }), B.querySelectorAll("[data-delete-route]").forEach((R) => {
        R.addEventListener("click", () => this._confirmDeleteRoute(R.dataset.deleteRoute, R.dataset.routeSystem));
      }), B.querySelectorAll("[data-edit-faction]").forEach((R) => {
        R.addEventListener("click", () => this._openViewportEditor("faction", { id: R.dataset.editFaction }));
      }), B.querySelectorAll("[data-show-faction]").forEach((R) => {
        R.addEventListener("click", () => Q(this.selectedMapId, R.dataset.showFaction, !1));
      }), B.querySelectorAll("[data-hide-faction]").forEach((R) => {
        R.addEventListener("click", () => Q(this.selectedMapId, R.dataset.hideFaction, !0));
      }), B.querySelectorAll("[data-delete-faction]").forEach((R) => {
        R.addEventListener("click", () => this._confirmDeleteFaction(R.dataset.deleteFaction));
      }), (Ie = B.querySelector("[data-action='export-map']")) == null || Ie.addEventListener("click", () => {
        this.selectedMapId && f(this.selectedMapId);
      }), (xe = B.querySelector("[data-action='import-map']")) == null || xe.addEventListener("click", () => this._onImportMap()), B.querySelectorAll("[data-select-map]").forEach((R) => {
        R.addEventListener("click", () => {
          this.selectedMapId = R.dataset.selectMap, this.expandedSystemId = void 0, this.render({ force: !0 });
        });
      }), B.querySelectorAll("[data-open-map]").forEach((R) => {
        R.addEventListener("click", () => O(R.dataset.openMap));
      }), B.querySelectorAll("[data-show-map]").forEach((R) => {
        R.addEventListener("click", () => C(R.dataset.showMap));
      }), B.querySelectorAll("[data-duplicate-map]").forEach((R) => {
        R.addEventListener("click", async () => {
          const ge = await d(R.dataset.duplicateMap);
          ge && (this.selectedMapId = ge.id, this.render({ force: !0 }));
        });
      }), B.querySelectorAll("[data-delete-map]").forEach((R) => {
        R.addEventListener("click", async () => {
          const ge = R.dataset.deleteMap, qe = u(ge);
          await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${Le((qe == null ? void 0 : qe.title) ?? ge)}</strong>? This cannot be undone.</p>`
          }, We) && (await T(ge), this.selectedMapId === ge && (this.selectedMapId = null), this.render({ force: !0 }));
        });
      });
    }
    _onImportMap() {
      const j = document.createElement("input");
      j.type = "file", j.accept = ".json,application/json", j.addEventListener("change", async () => {
        var ne;
        const B = (ne = j.files) == null ? void 0 : ne[0];
        if (B)
          try {
            const re = JSON.parse(await B.text());
            if (!re || typeof re != "object" || Array.isArray(re))
              throw new Error("The selected file does not contain a Galaxy Map object.");
            const ie = await c(re);
            if (!ie) return;
            this.selectedMapId = ie.id, this.expandedSystemId = void 0, this.render({ force: !0 });
          } catch (re) {
            const ie = re instanceof Error ? re.message : "The selected file could not be read.";
            ce(`Could not import map: ${ie}`);
          }
      }, { once: !0 }), j.click();
    }
    async _onCreateMap() {
      const j = await v({
        title: "New Galaxy Map",
        subtitle: "Uncharted theatre",
        description: "A campaign-scale navigation map.",
        visibility: "players",
        factions: Re() ? [
          {
            id: "independent",
            name: "Independent",
            color: "#58d8ff",
            description: "Unaffiliated worlds and stations.",
            visibility: "players"
          }
        ] : [],
        systems: [],
        routes: []
      });
      j && (this.selectedMapId = j.id, this.render({ force: !0 }));
    }
    _openViewportEditor(j, B = {}) {
      var ne, re;
      this.selectedMapId && ((re = (ne = O(this.selectedMapId)) == null ? void 0 : ne.openEditor) == null || re.call(ne, j, B));
    }
    async _confirmDeleteSystem(j) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, We) && await w(this.selectedMapId, j);
    }
    async _confirmDeleteObject(j, B) {
      await Dialog.confirm({
        title: "Delete Location",
        content: "<p>Delete this location and its linked content from the system?</p>"
      }) && await P(this.selectedMapId, j, B);
    }
    async _confirmDeleteRoute(j, B = "") {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, We) && await x(this.selectedMapId, j, B);
    }
    async _confirmDeleteFaction(j) {
      await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }, We) && await $(this.selectedMapId, j);
    }
    async close(j = {}) {
      return ae(this), super.close(j);
    }
  }, W(M, "DEFAULT_OPTIONS", {
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
  }), W(M, "PARTS", {
    main: {
      template: `${t}/map-manager.hbs`
    }
  }), M;
}
const Ui = 22;
function Yi(e) {
  const t = [];
  for (const i of e) {
    const r = t.find((u) => u.every((c) => Math.hypot(i[0] - c[0], i[1] - c[1]) <= Ui));
    r ? r.push(i) : t.push([i]);
  }
  return t;
}
const cn = (e, t) => e[0] - t[0] || e[1] - t[1];
function ln(e) {
  return e.sort(cn).filter((t, i) => i === 0 || cn(t, e[i - 1]) !== 0);
}
function Xi(e) {
  const t = (r, u, c) => (u[0] - r[0]) * (c[1] - r[1]) - (u[1] - r[1]) * (c[0] - r[0]), i = (r) => {
    const u = [];
    for (const c of r) {
      for (; u.length > 1 && t(u[u.length - 2], u[u.length - 1], c) <= 0; ) u.pop();
      u.push(c);
    }
    return u.slice(0, -1);
  };
  return [...i(e), ...i([...e].reverse())];
}
function Wi(e, t, { cluster: i = !0 } = {}) {
  const r = /* @__PURE__ */ new Map();
  for (const d of e) {
    if (!d.factionId || d.obscured || !Number.isFinite(d.x) || !Number.isFinite(d.y)) continue;
    const T = r.get(d.factionId) ?? [];
    T.push([Math.max(0, Math.min(100, d.x)), Math.max(0, Math.min(100, d.y))]), r.set(d.factionId, T);
  }
  const u = i ? 5 : 7, c = i ? 7 : 9, f = (d) => Math.round(Math.max(1, Math.min(99, d)) * 100) / 100;
  return t.filter((d) => d.kind !== "minor").flatMap(({ id: d, name: T, color: v }) => {
    const w = ln(r.get(d) ?? []);
    return w.length ? (i ? Yi(w) : [w]).map((P) => {
      const x = ln(P.flatMap(([C, D]) => Array.from({ length: 12 }, (H, Q) => {
        const ce = Q * Math.PI / 6;
        return [f(C + Math.cos(ce) * u), f(D + Math.sin(ce) * c)];
      }))), $ = Xi(x), O = $.reduce(({ left: C, right: D, top: H }, [Q, ce]) => ({
        left: Math.min(C, Q),
        right: Math.max(D, Q),
        top: Math.min(H, ce)
      }), { left: 100, right: 0, top: 100 });
      return {
        id: d,
        name: T,
        color: v,
        points: $.map((C) => C.join(",")).join(" "),
        labelX: Math.max(12, Math.min(88, (O.left + O.right) / 2)),
        labelY: Math.max(3, O.top + 1)
      };
    }) : [];
  });
}
function Dn() {
  var e, t, i;
  try {
    const r = (t = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : t.call(e, "bounty-board");
    if ((r == null ? void 0 : r.active) === !1) return null;
    const u = r.api ?? ((i = game.scifiSuite) == null ? void 0 : i.bountyBoard);
    return typeof (u == null ? void 0 : u.getBountiesForScene) == "function" ? u : null;
  } catch {
    return null;
  }
}
function Ji(e) {
  const t = Dn();
  if (!t || !Array.isArray(e == null ? void 0 : e.sceneIds)) return [];
  const i = /* @__PURE__ */ new Set(), r = [];
  try {
    for (const u of e.sceneIds)
      for (const c of t.getBountiesForScene(String(u)) ?? []) {
        const f = String((c == null ? void 0 : c.id) ?? "");
        !f || i.has(f) || (i.add(f), r.push({
          id: f,
          name: String(c.name || "Unknown target"),
          image: String(c.image || ""),
          status: String(c.status || ""),
          statusLabel: String(c.statusLabel || c.status || ""),
          reward: String(c.reward || ""),
          sceneId: String(c.sceneId || u)
        }));
      }
  } catch {
    return [];
  }
  return r;
}
function Zi(e) {
  try {
    const t = Dn();
    return typeof (t == null ? void 0 : t.openBounty) == "function" && t.openBounty(String(e)) !== !1;
  } catch {
    return !1;
  }
}
const Ye = /* @__PURE__ */ new Map(), Ki = 40, Qi = 192;
function es(e) {
  return new Promise((t, i) => {
    const r = new Image();
    r.onload = () => t(r), r.onerror = () => i(new Error("Image unavailable")), r.src = e;
  });
}
async function ts(e) {
  if (!e) return null;
  try {
    const t = await es(e), i = Math.min(1, Qi / Math.max(t.naturalWidth || t.width, t.naturalHeight || t.height)), r = Math.max(2, Math.round((t.naturalWidth || t.width) * i)), u = Math.max(2, Math.round((t.naturalHeight || t.height) * i)), c = document.createElement("canvas");
    c.width = r, c.height = u;
    const f = c.getContext("2d", { willReadFrequently: !0 });
    if (!f) return null;
    f.drawImage(t, 0, 0, r, u);
    const d = f.getImageData(0, 0, r, u), T = f.createImageData(r, u), v = new Float32Array(r * u);
    for (let P = 0; P < v.length; P++) {
      const x = P * 4;
      v[P] = d.data[x] * 0.299 + d.data[x + 1] * 0.587 + d.data[x + 2] * 0.114;
    }
    const w = (P, x) => v[x * r + P];
    for (let P = 1; P < u - 1; P++)
      for (let x = 1; x < r - 1; x++) {
        const $ = -w(x - 1, P - 1) + w(x + 1, P - 1) - 2 * w(x - 1, P) + 2 * w(x + 1, P) - w(x - 1, P + 1) + w(x + 1, P + 1), O = -w(x - 1, P - 1) - 2 * w(x, P - 1) - w(x + 1, P - 1) + w(x - 1, P + 1) + 2 * w(x, P + 1) + w(x + 1, P + 1), C = Math.hypot($, O), D = Math.max(0, Math.min(235, (C - 34) * 2.1)), H = (P * r + x) * 4;
        T.data[H] = 104, T.data[H + 1] = 241, T.data[H + 2] = 255, T.data[H + 3] = D;
      }
    return f.clearRect(0, 0, r, u), f.putImageData(T, 0, 0), c.toDataURL("image/png");
  } catch {
    return null;
  }
}
function ns(e, t = "") {
  const i = `${t}\0${e}`, r = Ye.get(i);
  if (r)
    return Ye.delete(i), Ye.set(i, r), r;
  for (; Ye.size >= Ki; ) {
    const c = Ye.keys().next().value;
    if (c === void 0) break;
    Ye.delete(c);
  }
  const u = ts(e);
  return Ye.set(i, u), u;
}
function is({ root: e, stage: t, resolveItems: i, onOpen: r }) {
  const u = e.querySelector("[data-intel-layer]");
  if (!u) return null;
  const c = new AbortController(), f = c.signal, d = document.createElement("aside");
  d.className = "gmf-intel-callout", d.setAttribute("aria-label", "Bounty intel"), d.hidden = !0, d.innerHTML = `
    <span class="gmf-intel-callout__connector" aria-hidden="true"></span>
    <div class="gmf-intel-callout__stack" data-intel-list role="group" aria-label="Matching bounties"></div>`, u.append(d);
  let T = [], v = null, w = null, P = null, x = 0, $ = 0;
  const O = () => {
    w && clearTimeout(w), w = null;
  }, C = () => {
    x++, P && clearTimeout(P), P = null, w = null, v = null, T = [], $++, d.hidden = !0, d.classList.remove("is-visible", "is-left");
  }, D = (M = 180) => {
    O(), x++, P && clearTimeout(P), P = null, w = setTimeout(C, M);
  }, H = () => {
    if (!v || d.hidden) return;
    const M = t.getBoundingClientRect(), U = v.getBoundingClientRect();
    d.style.setProperty("--gmf-intel-stack-height", `${Math.max(80, M.height - 72)}px`);
    const K = d.offsetWidth || 224, j = d.offsetHeight || 126, B = U.right - M.left + K + 24 > M.width, ne = B ? U.left - M.left - K - 18 : U.right - M.left + 18, re = Math.max(48, Math.min(M.height - j - 12, U.top - M.top + U.height / 2 - j / 2));
    d.classList.toggle("is-left", B), d.style.left = `${Math.max(8, ne)}px`, d.style.top = `${re}px`;
  }, Q = () => {
    const M = d.querySelector("[data-intel-list]");
    if (!M || !T.length) return C();
    M.replaceChildren();
    const U = ++$;
    T.forEach((K, j) => {
      const B = document.createElement("button");
      B.type = "button", B.className = "gmf-intel-callout__body", B.dataset.intelOpen = K.id, B.style.setProperty("--gmf-intel-index", String(j)), B.style.setProperty("--gmf-intel-delay", `${j * 55}ms`), B.innerHTML = `
        <span class="gmf-intel-callout__portrait"><img alt="" hidden /><i class="fa-solid fa-crosshairs"></i></span>
        <span class="gmf-intel-callout__copy"><small></small><strong></strong><span></span></span>`;
      const ne = B.querySelector("strong"), re = B.querySelector("small"), ie = B.querySelector(".gmf-intel-callout__copy > span"), te = B.querySelector("img"), Se = B.querySelector("i");
      ne && (ne.textContent = K.name), re && (re.textContent = `BOUNTY // ${(K.statusLabel || "INTEL").toUpperCase()}`), ie && (ie.textContent = K.reward || ""), B.addEventListener("click", () => r(K.id), { signal: f }), K.image && te && (te.src = K.image, te.classList.add("is-css-fallback"), te.hidden = !1, Se && (Se.hidden = !0), te.onerror = () => {
        U === $ && (te.hidden = !0, Se && (Se.hidden = !1));
      }, ns(K.image, K.id).then((be) => {
        !be || U !== $ || !B.isConnected || (te.classList.remove("is-css-fallback"), te.src = be);
      })), M.append(B);
    }), H();
  }, ce = async (M) => {
    O(), v = M;
    const U = ++x;
    let K = [];
    try {
      K = await i(M.dataset.systemId ?? "");
    } catch {
    }
    if (!(U !== x || v !== M)) {
      if (!K.length) return C();
      T = K, d.hidden = !1, Q(), requestAnimationFrame(() => {
        H(), d.classList.add("is-visible");
      });
    }
  }, ae = (M) => {
    O(), x++, P && clearTimeout(P), P = setTimeout(() => {
      P = null, ce(M);
    }, 90);
  };
  return e.querySelectorAll("[data-system-id]").forEach((M) => {
    M.addEventListener("pointerenter", () => ae(M), { signal: f }), M.addEventListener("pointerleave", () => D(), { signal: f }), M.addEventListener("focus", () => ae(M), { signal: f }), M.addEventListener("blur", () => D(), { signal: f }), M.addEventListener("pointerdown", () => C(), { signal: f });
  }), d.addEventListener("pointerenter", O, { signal: f }), d.addEventListener("pointerleave", () => D(), { signal: f }), d.addEventListener("click", (M) => M.stopPropagation(), { signal: f }), t.addEventListener("wheel", () => requestAnimationFrame(H), { signal: f }), window.addEventListener("resize", H, { signal: f }), {
    dispose() {
      x++, w && clearTimeout(w), P && clearTimeout(P), c.abort(), d.remove();
    }
  };
}
function ss({ host: e }) {
  const t = document.createElement("aside");
  t.className = "gmf-location-callout", t.hidden = !0, t.innerHTML = `
    <span class="gmf-location-callout__connector" aria-hidden="true"></span>
    <strong data-location-name></strong>`, e.append(t);
  let i = null, r = { x: 0, y: 0, visible: !1 }, u = null;
  const c = () => {
    u && clearTimeout(u), u = null;
  }, f = () => {
    c(), i = null, t.hidden = !0, t.classList.remove("is-visible", "is-left");
  }, d = () => {
    if (!i || t.hidden || !r.visible) return;
    const w = t.offsetWidth || 180, P = t.offsetHeight || 24, x = r.x + w + 76 > e.clientWidth, $ = x ? r.x - w - 64 : r.x + 64, O = Math.max(8, Math.min(e.clientHeight - P - 8, r.y - P / 2));
    t.classList.toggle("is-left", x), t.style.left = `${Math.max(8, $)}px`, t.style.top = `${O}px`;
  }, T = (w) => {
    c(), i = w;
    const P = t.querySelector("[data-location-name]");
    P && (P.textContent = w.missing ? "Missing linked scene" : w.accessible ? w.name : "Restricted location"), t.hidden = !1, d(), requestAnimationFrame(() => {
      d(), t.classList.add("is-visible");
    });
  }, v = (w = 180) => {
    c(), u = setTimeout(f, w);
  };
  return {
    show: T,
    scheduleHide: v,
    hide: f,
    setAnchor(w) {
      if (r = w, !w.visible) return v(40);
      d();
    },
    dispose() {
      f(), t.remove();
    }
  };
}
function as(e, t, i) {
  const r = i.querySelector("[data-ship-layer]"), u = i.querySelector(".gmf-map-stage");
  if (!r || !u) return Promise.resolve();
  const c = u.getBoundingClientRect(), f = (t.x - e.x) * c.width / 100, d = (t.y - e.y) * c.height / 100, T = Math.atan2(d, f) * 180 / Math.PI, v = document.createElement("div");
  return v.className = "gmf-travel-ship", v.innerHTML = '<i class="fa-solid fa-rocket"></i>', v.style.left = `${e.x}%`, v.style.top = `${e.y}%`, v.style.setProperty("--gmf-ship-angle", `${T}deg`), r.replaceChildren(v), new Promise((w) => {
    let P = !1;
    const x = () => {
      P || (P = !0, v.removeEventListener("transitionend", x), v.classList.add("is-arrived"), globalThis.setTimeout(() => {
        v.remove(), w();
      }, 260));
    };
    v.addEventListener("transitionend", x, { once: !0 }), requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        v.style.left = `${t.x}%`, v.style.top = `${t.y}%`;
      });
    }), globalThis.setTimeout(x, jt);
  });
}
function rs(e, t) {
  const i = e.querySelector(".gmf-orbits"), r = i ? t.rings.map(($) => {
    const O = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    return O.setAttribute("vector-effect", "non-scaling-stroke"), i.append(O), { ...$, ellipse: O };
  }) : [], u = Array.from(e.querySelectorAll(".gmf-system[data-system-id]")), c = Array.from(e.querySelectorAll("[data-route-from][data-route-to]")), f = globalThis.matchMedia("(prefers-reduced-motion: reduce)");
  let d = vn, T = null, v;
  const w = ($ = et()) => t.positions(d, $, !f.matches, v);
  function P() {
    const $ = w();
    for (const O of u) {
      const C = $.get(O.dataset.systemId);
      if (!C) continue;
      const D = `${Number(C.x.toFixed(5))}%`, H = `${Number(C.y.toFixed(5))}%`;
      O.style.left !== D && (O.style.left = D), O.style.top !== H && (O.style.top = H);
    }
    for (const O of c) {
      const C = $.get(O.dataset.routeFrom), D = $.get(O.dataset.routeTo);
      C && D && (ze(O, "x1", C.x), ze(O, "y1", C.y), ze(O, "x2", D.x), ze(O, "y2", D.y));
    }
    for (const { centerId: O, radius: C, ellipse: D } of r) {
      const H = $.get(O), Q = Mn(C, d);
      ze(D, "cx", H.x), ze(D, "cy", H.y), ze(D, "rx", Q.x), ze(D, "ry", Q.y);
    }
  }
  function x() {
    T !== null && cancelAnimationFrame(T), T = null, e.isConnected && (P(), t.animated && !f.matches && (T = requestAnimationFrame(x)));
  }
  return f.addEventListener("change", x), {
    get aspect() {
      return d;
    },
    get motion() {
      return !f.matches;
    },
    setAspect($) {
      Number.isFinite($) && $ > 0 && (d = $), x();
    },
    previewDrag($, O) {
      v = { id: $, point: O }, P();
    },
    finishDrag($, O) {
      var Q;
      const C = (Q = t.attachments.get($)) == null ? void 0 : Q.attachment, D = C && w().get(C.centerId);
      if (!C || !D) return;
      const H = Pn(O, D, d);
      return v = { id: $, point: O, angle: H }, { centerId: C.centerId, orbitId: C.orbitId, angle: H };
    },
    cancelDrag() {
      v = void 0, P();
    },
    position($, O) {
      return t.attachments.has($) ? w(O).get($) : void 0;
    },
    dispose() {
      T !== null && cancelAnimationFrame(T), f.removeEventListener("change", x);
    }
  };
}
function ze(e, t, i) {
  const r = String(i);
  e.getAttribute(t) !== r && e.setAttribute(t, r);
}
function os(e, t) {
  const i = e.querySelector("[data-orbit-editor]");
  if (!i) return;
  const r = i.querySelector("[data-orbit-rows]"), u = i.querySelector("[data-orbit-row-template]"), c = i.querySelector("[data-orbit-attachment]"), f = i.querySelector("[data-orbit-placement]"), d = i.querySelector("[data-orbit-angle]"), T = i.querySelector("[data-orbit-motion]"), v = i.querySelector("[data-orbit-speed]"), w = i.querySelector("[data-orbit-period]");
  function P(O, C = !1) {
    const D = u.content.firstElementChild.cloneNode(!0), H = D.querySelector("[data-orbit-radius]");
    D.dataset.orbitId = O.id, H.value = String(O.radius), D.querySelector("[data-remove-orbit]").addEventListener("click", () => D.remove()), r.append(D), C && H.focus();
  }
  for (const O of t.orbits ?? []) P(O);
  i.querySelector("[data-add-orbit]").addEventListener("click", () => {
    P({ id: Te("orbit"), radius: Math.min(100, 15 + r.childElementCount * 10) }, !0);
  });
  const x = t.orbit;
  x && (d.value = String(x.angle), x.period && (T.value = x.clockwise ? "clockwise" : "counterclockwise", w.value = String(x.period)));
  function $() {
    f.hidden = !c.value, d.disabled = f.hidden, v.hidden = T.value === "fixed", w.disabled = f.hidden || v.hidden;
  }
  return c.addEventListener("change", $), T.addEventListener("change", $), $(), () => {
    const O = Array.from(r.querySelectorAll("[data-orbit-row]"), (U) => ({
      id: U.dataset.orbitId,
      radius: Number(U.querySelector("[data-orbit-radius]").value)
    })), C = t.orbits ?? [], H = O.length !== C.length || O.some((U, K) => U.id !== C[K].id || U.radius !== C[K].radius) ? { orbits: O } : {};
    if (!c.value) return x ? { ...H, orbit: null } : H;
    const [Q, ce] = JSON.parse(c.value), ae = {
      centerId: Q,
      orbitId: ce,
      angle: Number(d.value),
      period: v.hidden ? 0 : Number(w.value),
      clockwise: v.hidden ? (x == null ? void 0 : x.clockwise) ?? !0 : T.value === "clockwise"
    };
    return x && Object.entries(ae).every(([U, K]) => x[U] === K) ? H : { ...H, orbit: { ...ae, epoch: et() } };
  };
}
function cs(e) {
  var i, r;
  return (((r = (i = foundry.applications) == null ? void 0 : i.ux) == null ? void 0 : r.TextEditor) ?? globalThis.TextEditor).getDragEventData(e) ?? {};
}
async function Gn(e) {
  var c, f, d, T, v, w, P, x;
  const t = cs(e), i = globalThis.fromUuid, r = t.uuid && i ? await i(t.uuid) : null;
  if (["Scene", "JournalEntry"].includes(r == null ? void 0 : r.documentName)) return r;
  const u = String(t.sceneId || t.journalId || t.id || "");
  return u ? t.type === "Scene" ? ((f = (c = game.scenes) == null ? void 0 : c.get) == null ? void 0 : f.call(c, u)) ?? null : ["JournalEntry", "Journal"].includes(t.type) ? ((T = (d = game.journal) == null ? void 0 : d.get) == null ? void 0 : T.call(d, u)) ?? null : ((w = (v = game.scenes) == null ? void 0 : v.get) == null ? void 0 : w.call(v, u)) ?? ((x = (P = game.journal) == null ? void 0 : P.get) == null ? void 0 : x.call(P, u)) ?? null : null;
}
async function ls(e) {
  const t = await Gn(e);
  return (t == null ? void 0 : t.documentName) === "Scene" ? t : null;
}
function ds(e) {
  var qe;
  const {
    templateRoot: t,
    getRawMap: i,
    prepareMapForDisplay: r,
    upsertSystem: u,
    upsertObject: c,
    upsertRoute: f,
    upsertFaction: d,
    updateMapMetadata: T,
    deleteFaction: v,
    getTextureGuideMarkup: w,
    activateObjectEditorControls: P,
    revealSystemToPlayers: x,
    revealRouteToPlayers: $,
    hideSystemFromPlayers: O,
    setObjectVisibility: C,
    hideRouteFromPlayers: D,
    deleteSystem: H,
    deleteObject: Q,
    deleteRoute: ce,
    setCurrentSystem: ae,
    setCurrentObject: M,
    requestTravelToSystem: U,
    requestTravelToObject: K,
    exportMap: j,
    getTravelRoute: B,
    broadcastTravelAnimation: ne,
    broadcastObjectTravelAnimation: re,
    notifyInfo: ie,
    notifyError: te,
    saveSystemPosition: Se,
    saveObjectPosition: be,
    savePlanetLocation: Ie,
    removePlanetLocation: xe,
    unlinkPlanetScene: R,
    clearMapView: ge
  } = e;
  return qe = class extends pt() {
    constructor(a = {}) {
      var l;
      const n = a.mapId, o = !((l = game.user) != null && l.isGM) || a.playerMode === !0;
      super({
        ...a,
        id: `galaxy-map-view-${o ? "player" : "gm"}-${n}`
      });
      W(this, "mapId");
      W(this, "playerMode");
      W(this, "selectedSystemId");
      W(this, "selectedRouteId");
      W(this, "activeSystemId");
      W(this, "selectedObjectId");
      W(this, "zoom");
      W(this, "panX");
      W(this, "panY");
      W(this, "_drag");
      W(this, "_contextTarget");
      W(this, "_boundContextClose");
      W(this, "externalFocus");
      W(this, "_externalFocusTimeout");
      W(this, "_pendingFocusZoom");
      W(this, "showTerritories", !0);
      W(this, "showGalaxyTerritories", !1);
      W(this, "selectedFactionId", "");
      W(this, "showRoutes", !0);
      W(this, "hardContrast", !1);
      W(this, "planetSystemId", null);
      W(this, "planetStatic", !1);
      W(this, "_planetStaticViewKey", null);
      W(this, "_planetRenderer", null);
      W(this, "_planetGeneration", 0);
      W(this, "_planetReturnFocus", !1);
      W(this, "_bountyIntelCallout", null);
      W(this, "_planetLocationCallout", null);
      W(this, "creationPanel", null);
      W(this, "factionRegistry", !1);
      W(this, "factionPanelOpen", !1);
      W(this, "factionPanelTab", "prominence");
      W(this, "_selectionTimer", null);
      W(this, "_worldWidth", 0);
      W(this, "_worldHeight", 0);
      W(this, "_orbitLayer", null);
      W(this, "showOrbits", !0);
      W(this, "_viewportResizeObserver", null);
      W(this, "_viewportStage", null);
      W(this, "_baseWindowHeight", null);
      this.mapId = n, this.playerMode = o, this.selectedSystemId = a.selectedSystemId ?? null, this.selectedRouteId = a.selectedRouteId ?? null, this.activeSystemId = a.activeSystemId ?? null, this.selectedObjectId = a.selectedObjectId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null, this.externalFocus = null, this._externalFocusTimeout = null, this._pendingFocusZoom = null;
    }
    get title() {
      const a = i(this.mapId), n = this.playerMode ? "Player View" : "GM View";
      return a ? `${a.title} - ${n}` : `Galaxy Map - ${n}`;
    }
    async _prepareContext(a) {
      var Ae, Ue, Z, ye, ve, Ee, ke, $e, je, Ge, Ke;
      const n = await super._prepareContext(a), o = !Re();
      o && (this.factionPanelOpen = !1, this.factionRegistry = !1, this.selectedFactionId = "", ((Ae = this.creationPanel) == null ? void 0 : Ae.kind) === "faction" && (this.creationPanel = null));
      const l = i(this.mapId), s = l ? r(l, {
        factionsDisabled: o,
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      }) : null, h = s == null ? void 0 : s.factions.find((k) => k.id === this.selectedFactionId), g = h ? {
        ...h,
        parentName: (Ue = s == null ? void 0 : s.factions.find((k) => k.id === h.parentFactionId)) == null ? void 0 : Ue.name
      } : null;
      g || (this.selectedFactionId = ""), s != null && s.systems && (s.systems = s.systems.map((k) => ({
        ...k,
        displayType: "system",
        animatedCelestial: !1,
        hasCustomMarker: !!k.displayMarkerImage
      })), s.selectedSystem && (s.selectedSystem = s.systems.find((k) => k.id === s.selectedSystem.id) ?? null)), s != null && s.systems && this.externalFocus && (s.systems = s.systems.map((k) => k.id === this.externalFocus.systemId ? { ...k, isExternalFocus: !0, externalFocus: this.externalFocus } : k), ((Z = s.selectedSystem) == null ? void 0 : Z.id) === this.externalFocus.systemId && (s.selectedSystem = s.systems.find((k) => k.id === this.externalFocus.systemId))), !this.activeSystemId && this.selectedSystemId && !(s != null && s.selectedSystem) && (this.selectedSystemId = null);
      const S = (s == null ? void 0 : s.systems) ?? [], E = S.find((k) => k.id === this.activeSystemId) ?? null;
      E && (s.backgroundImage = E.obscured ? "" : E.backgroundImage || "");
      const q = E ? E.objects.map((k) => {
        var Be;
        const le = this.playerMode && (E.obscured || k.status === "undiscovered"), Pe = le ? "" : k.markerImage;
        return {
          ...k,
          systemId: E.id,
          displayName: le ? "???" : k.name,
          displayDescription: le ? "Unresolved sensor contact. Details are not available." : k.description,
          displayType: le ? "unknown" : k.kind,
          displayStatus: le ? "undiscovered" : k.status,
          displayMarkerImage: Pe,
          hasCustomMarker: !!Pe,
          obscured: le,
          gmOnly: Xe(E, k) === "gm",
          isSelected: k.id === this.selectedObjectId,
          isCurrent: ((Be = s == null ? void 0 : s.currentLocation) == null ? void 0 : Be.objectId) === k.id,
          animatedCelestial: !Pe && Mt.includes(k.iconStyle),
          hasJournal: !!(!le && k.journalId),
          hasScenes: !!(!le && k.sceneIds.length),
          showImage: !!(!le && k.image),
          canInspectSystem: !!Ne({ ...k, obscured: le })
        };
      }) : [];
      E && this.selectedObjectId && !q.some((k) => k.id === this.selectedObjectId) && (this.selectedObjectId = null);
      const A = q.find((k) => k.id === this.selectedObjectId) ?? null, N = new Set(q.map((k) => k.id)), J = E ? (E.routes ?? []).filter((k) => (!this.playerMode || k.visibility === "players") && N.has(k.fromSystemId) && N.has(k.toSystemId)).map((k) => {
        const le = q.find((Be) => Be.id === k.fromSystemId), Pe = q.find((Be) => Be.id === k.toSystemId);
        return {
          ...k,
          from: le,
          to: Pe,
          fromName: (le == null ? void 0 : le.displayName) ?? k.fromSystemId,
          toName: (Pe == null ? void 0 : Pe.displayName) ?? k.toSystemId,
          isSelected: k.id === this.selectedRouteId,
          isActive: k.id === this.selectedRouteId,
          gmOnly: k.visibility === "gm"
        };
      }) : [], X = J.find((k) => k.id === this.selectedRouteId) ?? null, se = q.find((k) => k.isCurrent) ?? null, oe = A && se && A.id !== se.id ? J.find((k) => k.fromSystemId === se.id && k.toSystemId === A.id || k.toSystemId === se.id && k.fromSystemId === A.id) : null;
      A && (A.canTravel = !!oe, A.isDestination = !!(oe && !A.isCurrent), A.travelRouteId = (oe == null ? void 0 : oe.id) ?? ""), J.forEach((k) => {
        k.isActive = k.isSelected || k.id === (oe == null ? void 0 : oe.id);
      }), E && (s.systems = q, s.routes = J, s.selectedSystem = X ? null : A, s.selectedRoute = X, s.currentSystem = se);
      const m = q.find((k) => k.id === this.planetSystemId) ?? (E ? null : s == null ? void 0 : s.systems.find((k) => k.id === this.planetSystemId)), p = !this.playerMode || (l == null ? void 0 : l.visibility) === "players" ? Ne(m) : null;
      p || (this.planetSystemId = null);
      const I = E && !p && q.some((k) => {
        var le;
        return (le = k.orbits) == null ? void 0 : le.length;
      }) ? It(
        q,
        new Set(q.filter((k) => k.obscured).map((k) => k.id))
      ) : null, b = m && p ? `${m.id}:${p.preset}` : null;
      b !== this._planetStaticViewKey && (this._planetStaticViewKey = b, this.planetStatic = !!(b && vi(p == null ? void 0 : p.preset)));
      const _ = m && p ? this._preparePlanetLocations(m, p.shape) : [], L = m ?? A, z = !!((ye = game.user) != null && ye.isGM && !this.playerMode && E && L), F = ((L == null ? void 0 : L.sceneIds) ?? []).map((k) => {
        var le, Pe;
        return (Pe = (le = game.scenes) == null ? void 0 : le.get) == null ? void 0 : Pe.call(le, k);
      }).filter((k) => {
        var le, Pe;
        return k && (((le = game.user) == null ? void 0 : le.isGM) || ((Pe = k.testUserPermission) == null ? void 0 : Pe.call(k, game.user, "OBSERVER")));
      }).map((k) => ({ id: k.id, uuid: k.uuid, name: k.name || "Linked Scene" })), V = L != null && L.journalId ? (Ee = (ve = game.journal) == null ? void 0 : ve.get) == null ? void 0 : Ee.call(ve, L.journalId) : null, ee = V && ((ke = game.user) != null && ke.isGM || ($e = V.testUserPermission) != null && $e.call(V, game.user, "OBSERVER")) ? { id: V.id, uuid: V.uuid, name: V.name || "Linked Journal" } : null, ue = this.creationPanel ? {
        ...this.creationPanel,
        ...this.creationPanel.data,
        kind: this.creationPanel.kind,
        entityKind: (je = this.creationPanel.data) == null ? void 0 : je.kind,
        factionScale: (Ge = this.creationPanel.data) == null ? void 0 : Ge.kind,
        isSystem: this.creationPanel.kind === "system",
        isEntity: this.creationPanel.kind === "entity",
        isRoute: this.creationPanel.kind === "route",
        isFaction: this.creationPanel.kind === "faction",
        isMap: this.creationPanel.kind === "map",
        mapTitle: (Ke = this.creationPanel.data) == null ? void 0 : Ke.title,
        title: this.creationPanel.kind === "map" ? "Edit Galaxy" : `${this.creationPanel.editId ? "Edit" : "Create"} ${{ system: "System", entity: "Location", route: "Route", faction: "Faction" }[this.creationPanel.kind]}`,
        submitLabel: this.creationPanel.editId ? "Save changes" : "Create",
        systemOptions: (E ? q : (s == null ? void 0 : s.systems) ?? []).map((k) => ({ id: k.id, name: k.displayName || k.name })),
        orbitOptions: this.creationPanel.kind === "entity" ? q.flatMap((k) => (k.orbits ?? []).flatMap((le, Pe) => {
          const Be = { centerId: k.id, orbitId: le.id };
          if (!Ct(q, this.creationPanel.editId, Be)) return [];
          const ct = this.creationPanel.data.orbit;
          return [{
            value: JSON.stringify([k.id, le.id]),
            label: `${k.name} · Orbit ${Pe + 1} (${le.radius}%)`,
            selected: (ct == null ? void 0 : ct.centerId) === k.id && ct.orbitId === le.id
          }];
        })) : [],
        missingFaction: !!(this.creationPanel.data.factionId && !(s != null && s.factions.some((k) => k.id === this.creationPanel.data.factionId))),
        missingHeadquarters: !!(this.creationPanel.data.headquartersSystemId && !S.some((k) => k.id === this.creationPanel.data.headquartersSystemId)),
        headquartersOptions: this.creationPanel.kind === "faction" ? S.map((k) => ({ id: k.id, name: k.name })) : [],
        factionOptions: ((s == null ? void 0 : s.factions) ?? []).filter((k) => k.kind === "major").map((k) => ({ id: k.id, name: k.name })),
        parentFactionOptions: ((s == null ? void 0 : s.factions) ?? []).filter((k) => k.kind === "major" && k.id !== this.creationPanel.editId)
      } : null, me = this.factionPanelOpen && !p && !ue && !this.factionRegistry, fe = !o && (me || (E ? this.showTerritories : this.showGalaxyTerritories)), we = !p && !ue && !this.factionRegistry && (g == null ? void 0 : g.kind) === "major" ? g.id : void 0, Me = me && !g && s ? this._prepareFactionPanel(s, E) : null;
      return {
        ...n,
        map: s,
        factionsDisabled: o,
        factionDossier: g,
        showFactionPanel: me,
        factionPanel: Me,
        highlightedFactionId: we,
        systemView: !!(E && !p),
        activeSystem: E,
        selectedObject: A,
        planetView: !!p,
        planetSystem: m,
        planetAppearance: p,
        planetLocations: _,
        hasPlanetLocations: _.length > 0,
        canPlacePlanetLocations: z,
        linkedPlanetScenes: F,
        linkedPlanetJournal: ee,
        creationPanel: ue,
        factionRegistry: this.factionRegistry,
        appearanceGuideMarkup: ue != null && ue.isEntity ? w(ue.planetShape || "sphere") : "",
        showInspector: !!(Me || ue || this.factionRegistry || g || p || s != null && s.selectedSystem || s != null && s.selectedRoute),
        territories: fe && s && !p ? Wi(s.systems, s.factions, { cluster: !E }) : [],
        showTerritories: fe,
        showRoutes: this.showRoutes,
        orbitLayout: I,
        hasOrbits: !!(I != null && I.rings.length),
        showOrbits: this.showOrbits,
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
    _prepareFactionPanel(a, n) {
      var N;
      const o = this.factionPanelTab === "reputation", l = o ? "reputation" : "prominence", { showLabels: s, showPercentages: h } = rn(l), g = Tt(l);
      o || g.unshift({ id: "Unrated", label: "Unrated" });
      const S = /* @__PURE__ */ new Map();
      for (const J of a.factions) {
        const X = S.get(J.parentFactionId) ?? [];
        X.push(J), S.set(J.parentFactionId, X);
      }
      const E = (n == null ? void 0 : n.id) ?? "", q = !!((N = game.user) != null && N.isGM && (o || !(n != null && n.obscured))), A = (S.get("") ?? []).flatMap((J) => [J, ...S.get(J.id) ?? []]).map((J) => {
        var m;
        const X = o ? J.reputation : E ? J.systemProminence[E] ?? "Unrated" : J.prominence, se = ((m = g.find((p) => p.id === X)) == null ? void 0 : m.label) ?? "Unrated", oe = o ? J.reputationPercent : E ? J.systemProminencePercent[E] : J.prominencePercent;
        return { ...J, ratingId: X, value: se, percentage: oe, hasPercentage: st(oe) };
      });
      return {
        reputation: o,
        scale: l,
        title: nt[l].title,
        showLabels: s,
        showPercentages: h,
        choices: g,
        systemId: E,
        scope: (n == null ? void 0 : n.displayName) ?? a.title,
        canEdit: q,
        canManage: a.canEdit,
        showRatingControls: q && (s || a.canEdit),
        rows: A
      };
    }
    async _saveFactionPercentage(a, n, o, l) {
      var q;
      const s = l ? "reputation" : "prominence";
      if (!((q = game.user) != null && q.isGM) || !Re() || !rn(s).showPercentages) return;
      if (o !== null && !st(o)) {
        te(`Enter a whole ${s} percentage from 0 to 100.`);
        return;
      }
      const h = i(this.mapId);
      if (!h) return;
      const g = Y(h), S = g.factions.find((A) => A.id === a);
      if (!S || !l && n && !g.systems.some((A) => A.id === n)) {
        te("The faction or system is no longer on this map.");
        return;
      }
      let E = l ? { reputationPercent: o } : { prominencePercent: o };
      !l && n && (E = { systemProminencePercent: o === null ? Object.fromEntries(Object.entries(S.systemProminencePercent).filter(([N]) => N !== n)) : { ...S.systemProminencePercent, [n]: o } });
      try {
        await d(this.mapId, { id: a, ...E });
      } catch (A) {
        console.error(`Galaxy Map failed to save faction ${s} percentage`, A), te(`Could not save the ${s} percentage.`);
      }
    }
    async _saveFactionStanding(a, n, o, l) {
      var E;
      if (!((E = game.user) != null && E.isGM) || !Re()) return !1;
      const s = l ? "reputation" : "prominence";
      if ((l || n !== "Unrated") && !Tt(s).some((q) => q.id === n))
        return te(`That ${s} rating is no longer available.`), !1;
      const h = i(this.mapId);
      if (!h) return !1;
      const g = Y(h).factions.find((q) => q.id === a);
      if (!g)
        return te("That faction is no longer on this map."), !1;
      const S = l ? { reputation: n } : o ? { systemProminence: { ...g.systemProminence, [o]: n } } : { prominence: n };
      try {
        return !!await d(this.mapId, { id: a, ...S });
      } catch (q) {
        console.error("Galaxy Map failed to save faction standing", q), te("Could not save the faction change.");
      }
      return !1;
    }
    _onRender(a, n) {
      var l, s, h;
      (l = this._orbitLayer) == null || l.dispose(), this._orbitLayer = null, (s = this._bountyIntelCallout) == null || s.dispose(), this._bountyIntelCallout = null, this._disposePlanetRenderer(), super._onRender(a, n);
      const o = this.element;
      if (o) {
        this._attachPartListeners("main", o, n), this._observeViewport(o);
        const g = o.querySelector(".gmf-map-viewport");
        if (g && a.hasOrbits && (this._orbitLayer = rs(g, a.orbitLayout)), this._applyViewportTransform(o), this._mountBountyIntelCallout(o), this.externalFocus && this._pendingFocusZoom !== null) {
          const S = Y(i(this.mapId)).systems.find((E) => E.id === this.externalFocus.systemId);
          S && this._centerOnSystem(S, o, this._pendingFocusZoom), this._pendingFocusZoom = null;
        }
        a.planetView ? this._mountPlanetRenderer(o, a.planetAppearance) : this._planetReturnFocus && ((h = o.querySelector("[data-action='inspect-system']")) == null || h.focus(), this._planetReturnFocus = !1);
      }
    }
    _attachPartListeners(a, n, o) {
      var q, A, N, J, X, se, oe, m, p, I, b, _, L, z, F, V, ee, ue, me, fe, we, Me, Ae, Ue;
      const l = (q = n.matches) != null && q.call(n, ".gmf-map-stage") ? n : (A = n.querySelector) == null ? void 0 : A.call(n, ".gmf-map-stage, .gmf-planet-stage");
      if ((l == null ? void 0 : l.dataset.gmfMapBound) === "true") return;
      l && (l.dataset.gmfMapBound = "true");
      const s = (N = l == null ? void 0 : l.matches) != null && N.call(l, ".gmf-map-stage") ? l : null;
      super._attachPartListeners(a, n, o), ft(this, n), this._attachPlanetListeners(n), this._attachCreationPanel(n);
      const h = n.querySelector(".gmf-object-appearance-panel");
      h && (P(h), this._attachAppearancePreview(n)), (J = n.querySelector("[data-action='toggle-territories']")) == null || J.addEventListener("click", () => {
        this.factionPanelOpen = !this.factionPanelOpen, this.factionRegistry = !1, this.selectedFactionId = "", this.activeSystemId ? this.showTerritories = this.factionPanelOpen : this.showGalaxyTerritories = this.factionPanelOpen, this.render({ force: !0 });
      }), n.querySelectorAll("[data-faction-panel-tab]").forEach((Z) => {
        Z.addEventListener("click", () => {
          this.factionPanelTab = Z.dataset.factionPanelTab ?? "prominence", this.render({ force: !0 });
        });
      });
      const g = n.querySelectorAll("[data-faction-rating]"), S = n.querySelectorAll(
        "[data-faction-rating], [data-faction-percentage] button[type='submit']"
      );
      g.forEach((Z) => {
        Z.addEventListener("click", async () => {
          const ye = Z.closest("[data-faction-standing]"), ve = Z.dataset.factionRating;
          if (!ye || !ve || Z.disabled) return;
          if (Z.getAttribute("aria-pressed") === "true") {
            ye.open = !1;
            return;
          }
          const { factionStanding: Ee = "", prominenceSystemId: ke = "", reputation: $e } = ye.dataset;
          S.forEach((je) => {
            je.disabled = !0;
          });
          try {
            await this._saveFactionStanding(Ee, ve, ke, $e === "true") && (ye.open = !1);
          } finally {
            S.forEach((je) => {
              je.disabled = !1;
            });
          }
        });
      }), n.querySelectorAll("[data-faction-percentage]").forEach((Z) => {
        const ye = Z.querySelector('input[type="number"]'), ve = Z.querySelector('button[type="submit"]');
        !ye || !ve || Z.addEventListener("submit", async (Ee) => {
          if (Ee.preventDefault(), ve.disabled || !Z.reportValidity()) return;
          const ke = ye.value === "" ? null : ye.valueAsNumber, { factionPercentage: $e = "", prominenceSystemId: je = "", reputation: Ge } = Z.dataset;
          S.forEach((Ke) => {
            Ke.disabled = !0;
          });
          try {
            await this._saveFactionPercentage($e, je, ke, Ge === "true");
          } finally {
            S.forEach((Ke) => {
              Ke.disabled = !1;
            });
          }
        });
      }), n.querySelectorAll("[data-inspect-faction]").forEach((Z) => {
        Z.addEventListener("click", () => {
          this._selectionTimer && clearTimeout(this._selectionTimer), this.selectedFactionId = Z.dataset.inspectFaction ?? "", this.render({ force: !0 });
        });
      }), (X = n.querySelector("[data-action='clear-faction']")) == null || X.addEventListener("click", () => {
        this.selectedFactionId = "", this.render({ force: !0 });
      }), (se = n.querySelector("[data-action='toggle-routes']")) == null || se.addEventListener("click", () => {
        this.showRoutes = !this.showRoutes, this.render({ force: !0 });
      }), (oe = n.querySelector("[data-action='toggle-orbits']")) == null || oe.addEventListener("click", () => {
        this.showOrbits = !this.showOrbits, this.render({ force: !0 });
      }), (m = n.querySelector("[data-action='edit-orbits']")) == null || m.addEventListener("click", () => {
        var Z;
        !this.playerMode && ((Z = game.user) != null && Z.isGM) && this.selectedObjectId && this._openEditPanel("entity", this.selectedObjectId, !0);
      }), (p = n.querySelector("[data-action='edit-current-layer']")) == null || p.addEventListener("click", () => {
        var Z;
        !((Z = game.user) != null && Z.isGM) || this.playerMode || (this.activeSystemId ? this._openEditPanel("system", this.activeSystemId) : this._openCreationPanel("map", Y(i(this.mapId)), this.mapId));
      }), (I = n.querySelector("[data-action='toggle-hard-contrast']")) == null || I.addEventListener("click", (Z) => {
        var ve;
        this.hardContrast = !this.hardContrast;
        const ye = (ve = n.matches) != null && ve.call(n, ".gmf-galaxy") ? n : n.querySelector(".gmf-galaxy");
        ye == null || ye.classList.toggle("is-hard-contrast", this.hardContrast), Z.currentTarget.setAttribute("aria-pressed", String(this.hardContrast));
      }), n.querySelectorAll(".gmf-system[data-system-id]").forEach((Z) => {
        var ye, ve;
        Z.addEventListener("click", (Ee) => {
          if (Z.dataset.dragged === "true") {
            Z.dataset.dragged = "false";
            return;
          }
          Ee.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = globalThis.setTimeout(() => {
            this.selectedFactionId = "", this.activeSystemId ? this.selectedObjectId = Z.dataset.systemId : this.selectedSystemId = Z.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
          }, 180);
        }), Z.addEventListener("dblclick", (Ee) => {
          var $e;
          Ee.preventDefault(), Ee.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
          const ke = Z.dataset.systemId;
          if (this.selectedFactionId = "", this.selectedRouteId = null, this.creationPanel = null, this.activeSystemId) {
            this.selectedObjectId = ke;
            const je = ($e = Y(i(this.mapId)).systems.find((Ge) => Ge.id === this.activeSystemId)) == null ? void 0 : $e.objects.find((Ge) => Ge.id === ke);
            Ne(je) && (this.planetSystemId = ke);
          } else
            this.selectedSystemId = ke, this.activeSystemId = ke, this.selectedObjectId = null;
          this.render({ force: !0 });
        }), !this.playerMode && ((ye = game.user) != null && ye.isGM) && ((ve = Z.querySelector("[data-resize-marker]")) == null || ve.addEventListener("pointerdown", (Ee) => this._startMarkerResize(Ee, Z)), Z.addEventListener("pointerdown", (Ee) => this._startSystemDrag(Ee, n, Z)));
      }), this._mountBountyIntelCallout(n), n.querySelectorAll("[data-route-id]").forEach((Z) => {
        Z.addEventListener("click", (ye) => {
          var ve;
          if (ye.stopPropagation(), this.selectedFactionId = "", this.selectedRouteId = Z.dataset.routeId, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, !this.playerMode && ((ve = game.user) != null && ve.isGM)) {
            this._openEditPanel("route", Z.dataset.routeId);
            return;
          }
          this.render({ force: !0 });
        });
      }), s == null || s.addEventListener("wheel", (Z) => this._onWheelZoom(Z, n), { passive: !1 }), s == null || s.addEventListener("pointerdown", (Z) => this._startPan(Z, n)), s == null || s.addEventListener("contextmenu", (Z) => this._openContextMenu(Z, n), { capture: !0 }), n.querySelectorAll("[data-context-action]").forEach((Z) => {
        Z.addEventListener("click", (ye) => this._handleContextAction(ye, n));
      }), (b = n.querySelector("[data-action='open-journal']")) == null || b.addEventListener("click", () => this._openLinkedJournal()), (_ = n.querySelector("[data-action='edit-system']")) == null || _.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._openEditPanel("entity", this.selectedObjectId) : this.selectedSystemId && this._openEditPanel("system", this.selectedSystemId);
      }), (L = n.querySelector("[data-action='open-system']")) == null || L.addEventListener("click", () => {
        this.selectedSystemId && (this.activeSystemId = this.selectedSystemId, this.selectedObjectId = null, this.selectedRouteId = null, this.render({ force: !0 }));
      }), (z = n.querySelector("[data-action='navigate-up']")) == null || z.addEventListener("click", () => {
        if (this.creationPanel = null, this.planetSystemId)
          this._disposePlanetRenderer(), this.planetSystemId = null, this._planetReturnFocus = !0;
        else if (this.activeSystemId)
          this.activeSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null;
        else return;
        this.render({ force: !0 });
      }), (F = n.querySelector("[data-action='reveal-system']")) == null || F.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? C(this.mapId, this.activeSystemId, this.selectedObjectId, "players") : this.selectedSystemId && x(this.mapId, this.selectedSystemId);
      }), (V = n.querySelector("[data-action='hide-system']")) == null || V.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? C(this.mapId, this.activeSystemId, this.selectedObjectId, "gm") : this.selectedSystemId && O(this.mapId, this.selectedSystemId, !0);
      }), (ee = n.querySelector("[data-action='delete-system']")) == null || ee.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._confirmDeleteObject(this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), (ue = n.querySelector("[data-action='set-current-system']")) == null || ue.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? M(this.mapId, this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && ae(this.mapId, this.selectedSystemId);
      }), (me = n.querySelector("[data-action='travel-to-system']")) == null || me.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? U(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, n));
      }), (fe = n.querySelector("[data-action='travel-to-object']")) == null || fe.addEventListener("click", () => {
        !this.activeSystemId || !this.selectedObjectId || (this.playerMode ? K(this.mapId, this.activeSystemId, this.selectedObjectId) : this._travelToObject(this.activeSystemId, this.selectedObjectId, n));
      }), (we = n.querySelector("[data-action='edit-route']")) == null || we.addEventListener("click", () => {
        this.selectedRouteId && this._openEditPanel("route", this.selectedRouteId);
      }), (Me = n.querySelector("[data-action='reveal-route']")) == null || Me.addEventListener("click", () => {
        this.selectedRouteId && $(this.mapId, this.selectedRouteId, this.activeSystemId ?? "");
      }), (Ae = n.querySelector("[data-action='hide-route']")) == null || Ae.addEventListener("click", () => {
        this.selectedRouteId && D(this.mapId, this.selectedRouteId, !0, this.activeSystemId ?? "");
      }), (Ue = n.querySelector("[data-action='delete-route']")) == null || Ue.addEventListener("click", () => {
        this.selectedRouteId && this._confirmDeleteRoute(this.selectedRouteId);
      });
    }
    _applyViewportTransform(a) {
      var l, s, h;
      const n = a.querySelector(".gmf-map-stage");
      if (!n || n !== this._viewportStage || !n.isConnected || !((l = this.element) != null && l.contains(n))) return;
      const o = a.querySelector(".gmf-map-viewport");
      if (o) {
        if (n) {
          const g = n.getBoundingClientRect(), S = o.querySelector(".gmf-map-background");
          S && (this.zoom = Math.max(1, this.zoom));
          const E = S != null && S.naturalWidth && (S != null && S.naturalHeight) ? S.naturalWidth / S.naturalHeight : null;
          E ? this._adjustWindowToBackground(n, E) : S || this._adjustWindowToBackground(n, null);
          const q = g.width / Math.max(1, g.height);
          E && E > q ? (this._worldWidth = g.width, this._worldHeight = g.width / E) : E ? (this._worldHeight = g.height, this._worldWidth = g.height * E) : (this._worldWidth = g.width, this._worldHeight = g.height), o.style.width = `${this._worldWidth}px`, o.style.height = `${this._worldHeight}px`, (s = this._orbitLayer) == null || s.setAspect(this._worldWidth / this._worldHeight);
          const A = this._worldWidth * this.zoom, N = this._worldHeight * this.zoom;
          this.panX = A <= g.width ? (g.width - A) / 2 : pe(this.panX, g.width - A, 0), this.panY = N <= g.height ? (g.height - N) / 2 : pe(this.panY, g.height - N, 0), S && S.dataset.gmfWorldImageBound !== "true" && (S.dataset.gmfWorldImageBound = "true", S.addEventListener("load", () => this._applyViewportTransform(a), { once: !0 }));
        }
        o.style.setProperty("--gmf-pan-x", `${this.panX}px`), o.style.setProperty("--gmf-pan-y", `${this.panY}px`), o.style.setProperty("--gmf-zoom", String(this.zoom)), (h = a.querySelector("[data-zoom-label]")) == null || h.replaceChildren(`${Math.round(this.zoom * 100)}%`);
      }
    }
    _adjustWindowToBackground(a, n) {
      const o = a.closest(".window-app, .application, .app");
      if (!o || !this.setPosition) return;
      const l = o.getBoundingClientRect();
      if (!n) {
        this._baseWindowHeight && Math.abs(l.height - this._baseWindowHeight) > 2 && this.setPosition({ height: Math.min(this._baseWindowHeight, window.innerHeight - 24) }), this._baseWindowHeight = null;
        return;
      }
      this._baseWindowHeight ?? (this._baseWindowHeight = l.height);
      const s = a.getBoundingClientRect(), h = pe(s.width / n, 240, window.innerHeight - 96);
      if (Math.abs(s.height - h) <= 2) return;
      const g = pe(l.height + h - s.height, 320, window.innerHeight - 24);
      this.setPosition({ height: Math.round(g) });
    }
    _observeViewport(a) {
      var o;
      (o = this._viewportResizeObserver) == null || o.disconnect();
      const n = a.querySelector(".gmf-map-stage");
      this._viewportStage = n, n && (this._viewportResizeObserver = new ResizeObserver(() => this._applyViewportTransform(a)), this._viewportResizeObserver.observe(n));
    }
    _setZoom(a, n) {
      const o = n.querySelector(".gmf-map-background") ? 1 : St;
      this.zoom = pe(a, o, bt), this._applyViewportTransform(n);
    }
    _mountBountyIntelCallout(a) {
      var l;
      if (this._bountyIntelCallout || a.querySelector(".gmf-intel-callout")) return;
      const n = (l = a.matches) != null && l.call(a, ".gmf-map-stage") ? a : a.querySelector(".gmf-map-stage"), o = a;
      !n || !o.querySelector("[data-intel-layer]") || (this._bountyIntelCallout = is({
        root: o,
        stage: n,
        resolveItems: (s) => {
          var S;
          const h = Y(i(this.mapId)), g = this.activeSystemId ? (S = h.systems.find((E) => E.id === this.activeSystemId)) == null ? void 0 : S.objects.find((E) => E.id === s) : h.systems.find((E) => E.id === s);
          return g ? Ji(g) : [];
        },
        onOpen: (s) => Zi(s)
      }));
    }
    _attachPlanetListeners(a) {
      var n, o, l, s, h, g;
      (n = a.querySelector("[data-action='inspect-system']")) == null || n.addEventListener("click", () => {
        var E, q;
        const S = i(this.mapId);
        if (!(this.playerMode && (S == null ? void 0 : S.visibility) !== "players")) {
          if (this.activeSystemId) {
            const N = (E = Y(S).systems.find((J) => J.id === this.activeSystemId)) == null ? void 0 : E.objects.find((J) => J.id === this.selectedObjectId);
            if (!Ne(N)) return;
            this.planetSystemId = this.selectedObjectId;
          } else {
            this.activeSystemId = this.selectedSystemId;
            const A = Y(S);
            this.selectedObjectId = ((q = A.systems.find((N) => N.id === this.activeSystemId)) == null ? void 0 : q.primaryObjectId) ?? null, this.planetSystemId = this.selectedObjectId;
          }
          this.render({ force: !0 });
        }
      }), (o = a.querySelector("[data-action='planet-pause']")) == null || o.addEventListener("click", () => {
        var S;
        return (S = this._planetRenderer) == null ? void 0 : S.setPaused(!this._planetRenderer.paused);
      }), (l = a.querySelector("[data-action='planet-zoom-in']")) == null || l.addEventListener("click", () => {
        var S;
        return (S = this._planetRenderer) == null ? void 0 : S.zoom(-0.25);
      }), (s = a.querySelector("[data-action='planet-zoom-out']")) == null || s.addEventListener("click", () => {
        var S;
        return (S = this._planetRenderer) == null ? void 0 : S.zoom(0.25);
      }), (h = a.querySelector("[data-action='planet-reset']")) == null || h.addEventListener("click", () => {
        var S;
        return (S = this._planetRenderer) == null ? void 0 : S.reset();
      }), (g = a.querySelector("[data-action='planet-static']")) == null || g.addEventListener("click", () => {
        this.planetStatic = !this.planetStatic, this.render({ force: !0 });
      }), this._attachPlanetLocationList(a), this._attachLinkedContentDrop(a);
    }
    _getPlanetObject() {
      var n;
      return ((n = Y(i(this.mapId)).systems.find((o) => o.id === this.activeSystemId)) == null ? void 0 : n.objects.find((o) => o.id === this.planetSystemId)) ?? null;
    }
    _preparePlanetLocations(a, n) {
      return ((a == null ? void 0 : a.planetLocations) ?? []).filter((o) => o.shape === n).map((o) => {
        var h, g, S, E, q, A;
        const l = (g = (h = game.scenes) == null ? void 0 : h.get) == null ? void 0 : g.call(h, o.sceneId), s = !!(l && ((S = game.user) != null && S.isGM || (E = l.testUserPermission) != null && E.call(l, game.user, "OBSERVER")));
        return {
          ...o,
          name: l ? s || (q = game.user) != null && q.isGM ? l.name || "Linked Scene" : "Restricted location" : "Missing linked scene",
          accessible: s,
          missing: !l,
          canRemove: !!((A = game.user) != null && A.isGM && !this.playerMode)
        };
      });
    }
    _getPlanetLocationItem(a) {
      var o;
      const n = this._getPlanetObject();
      return this._preparePlanetLocations(n, (o = Ne(n)) == null ? void 0 : o.shape).find((l) => l.id === a) ?? null;
    }
    _attachPlanetLocationList(a) {
      var l;
      const n = this.element ?? a;
      a.querySelectorAll("[data-planet-scene-drag]").forEach((s) => s.addEventListener("dragstart", (h) => {
        h.dataTransfer && (h.dataTransfer.setData("text/plain", JSON.stringify({ type: "Scene", id: s.dataset.planetSceneDrag, uuid: s.dataset.planetSceneUuid })), h.dataTransfer.effectAllowed = "link");
      })), a.querySelectorAll("[data-unlink-planet-scene]").forEach((s) => s.addEventListener("click", async (h) => {
        var q, A, N;
        h.preventDefault(), h.stopPropagation();
        const g = s.dataset.unlinkPlanetScene ?? "", S = this.planetSystemId || this.selectedObjectId;
        if (!g || !this.activeSystemId || !S) return;
        const E = ((N = (A = (q = game.scenes) == null ? void 0 : q.get) == null ? void 0 : A.call(q, g)) == null ? void 0 : N.name) || "Scene";
        await R(this.mapId, this.activeSystemId, S, g) && ie(`${E} unlinked from this location.`);
      })), a.querySelectorAll("[data-open-linked-scene]").forEach((s) => s.addEventListener("click", () => {
        var g, S, E;
        const h = (S = (g = game.scenes) == null ? void 0 : g.get) == null ? void 0 : S.call(g, s.dataset.openLinkedScene ?? "");
        h != null && h.view ? h.view() : (E = h == null ? void 0 : h.sheet) == null || E.render(!0);
      })), a.querySelectorAll("[data-open-planet-location]").forEach((s) => s.addEventListener("click", () => this._openPlanetLocation(s.dataset.openPlanetLocation ?? ""))), a.querySelectorAll("[data-remove-planet-location]").forEach((s) => s.addEventListener("click", () => this._removePlanetLocation(s.dataset.removePlanetLocation ?? "", a))), a.querySelectorAll("[data-planet-location-drag]").forEach((s) => {
        s.addEventListener("dragstart", (h) => {
          var S;
          if (!h.dataTransfer) return;
          const g = s.dataset.planetLocationDrag ?? "";
          h.dataTransfer.setData("application/x-gmf-surface-location", g), h.dataTransfer.setData("text/plain", JSON.stringify({ type: "GalaxySurfaceLocation", locationId: g })), h.dataTransfer.effectAllowed = "move", (S = n.querySelector("[data-planet-location-trash]")) == null || S.classList.add("is-armed");
        }), s.addEventListener("dragend", () => {
          var h;
          return (h = n.querySelector("[data-planet-location-trash]")) == null ? void 0 : h.classList.remove("is-armed", "is-dragover");
        });
      });
      const o = n.querySelector("[data-planet-location-trash]");
      (o == null ? void 0 : o.dataset.gmfTrashBound) !== "true" && (o && (o.dataset.gmfTrashBound = "true"), o == null || o.addEventListener("dragover", (s) => {
        var h;
        (h = s.dataTransfer) != null && h.types.includes("application/x-gmf-surface-location") && (s.preventDefault(), s.dataTransfer.dropEffect = "move", o.classList.add("is-dragover"));
      }), o == null || o.addEventListener("dragleave", () => o.classList.remove("is-dragover")), o == null || o.addEventListener("drop", (s) => {
        var g;
        s.preventDefault();
        const h = ((g = s.dataTransfer) == null ? void 0 : g.getData("application/x-gmf-surface-location")) ?? "";
        o.classList.remove("is-armed", "is-dragover"), h && this._removePlanetLocation(h, a);
      })), (l = a.querySelector("[data-clear-planet-locations]")) == null || l.addEventListener("click", () => this._clearPlanetLocations(a));
    }
    _attachLinkedContentDrop(a) {
      var o, l;
      const n = a.querySelector("[data-linked-content-drop]");
      !n || !((o = game.user) != null && o.isGM) || this.playerMode || (n.addEventListener("dragover", (s) => {
        s.preventDefault(), s.dataTransfer && (s.dataTransfer.dropEffect = "link"), n.classList.add("is-document-dragover");
      }), n.addEventListener("dragleave", (s) => {
        n.contains(s.relatedTarget) || n.classList.remove("is-document-dragover");
      }), n.addEventListener("drop", async (s) => {
        var E;
        s.preventDefault(), s.stopPropagation(), n.classList.remove("is-document-dragover");
        const h = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !h) return;
        const g = await Gn(s), S = (E = Y(i(this.mapId)).systems.find((q) => q.id === this.activeSystemId)) == null ? void 0 : E.objects.find((q) => q.id === h);
        if (!g || !S) {
          te("Drop a Foundry Scene or Journal here.");
          return;
        }
        if (g.documentName === "Scene") {
          const q = [.../* @__PURE__ */ new Set([...S.sceneIds ?? [], g.id])];
          await c(this.mapId, this.activeSystemId, { ...S, sceneIds: q }), ie(`${g.name || "Scene"} linked to ${S.name}.`);
        } else if (g.documentName === "JournalEntry")
          await c(this.mapId, this.activeSystemId, { ...S, journalId: g.id }), ie(`${g.name || "Journal"} linked to ${S.name}.`);
        else {
          te("Drop a Foundry Scene or Journal here.");
          return;
        }
      }), (l = a.querySelector("[data-unlink-linked-journal]")) == null || l.addEventListener("click", async (s) => {
        var S;
        s.preventDefault(), s.stopPropagation();
        const h = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !h) return;
        const g = (S = Y(i(this.mapId)).systems.find((E) => E.id === this.activeSystemId)) == null ? void 0 : S.objects.find((E) => E.id === h);
        g && await c(this.mapId, this.activeSystemId, { ...g, journalId: "" });
      }));
    }
    _openPlanetLocation(a) {
      var l, s, h;
      const n = this._getPlanetLocationItem(a), o = n ? (s = (l = game.scenes) == null ? void 0 : l.get) == null ? void 0 : s.call(l, n.sceneId) : null;
      if (!n || !o || !n.accessible) {
        te(n != null && n.missing ? "That location is unavailable." : "You do not have permission to view that scene.");
        return;
      }
      o.view ? o.view() : (h = o.sheet) == null || h.render(!0);
    }
    async _removePlanetLocation(a, n) {
      var l;
      if (!((l = game.user) != null && l.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const o = this._getPlanetLocationItem(a);
      !o || !await xe(this.mapId, this.activeSystemId, this.planetSystemId, a) || (this._syncPlanetLocations(n), ie(`${o.name} removed from the surface.`));
    }
    async _clearPlanetLocations(a) {
      var l, s;
      if (!((l = game.user) != null && l.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const n = this._getPlanetObject(), o = this._preparePlanetLocations(n, (s = Ne(n)) == null ? void 0 : s.shape);
      for (const h of o) await xe(this.mapId, this.activeSystemId, this.planetSystemId, h.id);
      this._syncPlanetLocations(a), o.length && ie(`Cleared ${o.length} surface location${o.length === 1 ? "" : "s"}.`);
    }
    async _placePlanetLocation(a, n, o) {
      var g;
      if (!((g = game.user) != null && g.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const l = await ls(a);
      if (!l) {
        te("Drop a Foundry Scene onto the 3D surface.");
        return;
      }
      const s = this._getPlanetObject();
      if (!(s != null && s.sceneIds.includes(l.id))) {
        te(`Link ${l.name || "this scene"} to the object before placing it on the surface.`);
        return;
      }
      await Ie(this.mapId, this.activeSystemId, this.planetSystemId, { ...n, sceneId: l.id }) && (this._syncPlanetLocations(o), ie(`${l.name || "Scene"} placed on the ${n.shape}. Drag it again to move it.`));
    }
    _syncPlanetLocations(a) {
      var h, g, S;
      const n = this.element ?? a, o = this._getPlanetObject(), l = this._preparePlanetLocations(o, (h = Ne(o)) == null ? void 0 : h.shape);
      (g = this._planetRenderer) == null || g.setLocations((o == null ? void 0 : o.planetLocations) ?? []);
      const s = n.querySelector("[data-planet-location-list]");
      s && (s.innerHTML = l.length ? l.map((E) => `
        <div class="gmf-planet-location-row ${E.accessible ? "" : "is-restricted"}" ${E.canRemove ? `draggable="true" data-planet-location-drag="${Le(E.id)}" title="Drag to the trash bin to remove"` : ""}>
          <button type="button" data-open-planet-location="${Le(E.id)}" ${E.accessible ? "" : "disabled"}><i class="fa-solid ${E.accessible ? "fa-location-dot" : "fa-lock"}"></i><span>${Le(E.name)}</span></button>
          ${E.canRemove ? `<button type="button" data-remove-planet-location="${Le(E.id)}" title="Remove location" aria-label="Remove ${Le(E.name)}"><i class="fa-solid fa-trash"></i></button>` : ""}
        </div>`).join("") : '<p class="gmf-planet-locations__empty">No surface locations placed.</p>', this._attachPlanetLocationList(s), (S = n.querySelector("[data-planet-location-removal]")) == null || S.toggleAttribute("hidden", l.length === 0));
    }
    refreshPlanetLocations(a, n) {
      this.activeSystemId !== a || this.planetSystemId !== n || this.element && this._syncPlanetLocations(this.element);
    }
    async focusSystem(a, n = {}) {
      var A;
      const o = Y(i(this.mapId));
      if (!o.systems.find((N) => N.id === a)) return !1;
      const s = r(o, {
        playerMode: this.playerMode,
        selectedSystemId: a,
        selectedRouteId: null
      });
      if (!((A = s == null ? void 0 : s.systems) != null && A.some((N) => N.id === a))) return !1;
      const h = String(n.focusId || a).slice(0, 80), g = ["distress", "warning", "objective", "custom"].includes(n.kind) ? n.kind : "custom", S = /^#[0-9a-f]{6}$/i.test(n.color ?? "") ? n.color : g === "distress" ? "#ff5c7a" : "#58d8ff", E = pe(Number(n.duration) || 0, 0, 6e5), q = pe(Number(n.zoom) || 1.45, St, bt);
      return this.externalFocus = {
        id: h,
        systemId: a,
        kind: g,
        color: S,
        label: String(n.label || (g === "distress" ? "Distress signal" : "Signal located")).slice(0, 120)
      }, this.selectedFactionId = "", this.selectedSystemId = a, this.planetSystemId = null, this.selectedRouteId = null, this._pendingFocusZoom = q, this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, await this.render({ force: !0 }), this.bringToFront(), E > 0 && (this._externalFocusTimeout = globalThis.setTimeout(() => {
        var N;
        ((N = this.externalFocus) == null ? void 0 : N.id) === h && this.clearSystemFocus(h);
      }, E)), !0;
    }
    async focusLocation(a, n = "", o = {}) {
      const s = Y(i(this.mapId)).systems.find((g) => g.id === a), h = (s == null ? void 0 : s.objects.find((g) => g.id === n)) ?? (s == null ? void 0 : s.objects.find((g) => g.id === s.primaryObjectId));
      return !s || !h || this.playerMode && (s.visibility !== "players" || Xe(s, h) !== "players") ? !1 : (this.selectedFactionId = "", this.activeSystemId = s.id, this.selectedSystemId = s.id, this.selectedObjectId = h.id, this.selectedRouteId = null, this.planetSystemId = o.detail === !0 && Ne(h) ? h.id : null, await this.render({ force: !0 }), this.bringToFront(), !0);
    }
    clearSystemFocus(a = "") {
      return !this.externalFocus || a && this.externalFocus.id !== a ? !1 : (this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, this._pendingFocusZoom = null, this.externalFocus = null, this.rendered && this.render({ force: !0 }), !0);
    }
    _centerOnSystem(a, n, o) {
      const l = n.querySelector(".gmf-map-stage");
      if (!l) return;
      const s = l.getBoundingClientRect();
      this.zoom = o, this.panX = s.width / 2 - Number(a.x) / 100 * this._worldWidth * o, this.panY = s.height / 2 - Number(a.y) / 100 * this._worldHeight * o, this._applyViewportTransform(n);
    }
    _onWheelZoom(a, n) {
      a.preventDefault();
      const o = n.querySelector(".gmf-map-stage");
      if (!o) return;
      const l = o.getBoundingClientRect(), s = this.zoom, h = n.querySelector(".gmf-map-background") ? 1 : St, g = pe(s * Math.exp(-a.deltaY * 15e-4), h, bt), S = a.clientX - l.left, E = a.clientY - l.top, q = (S - this.panX) / s, A = (E - this.panY) / s;
      this.zoom = g, this.panX = S - q * g, this.panY = E - A * g, this._applyViewportTransform(n);
    }
    _startPan(a, n) {
      if (a.button !== 0 || a.target.closest("[data-system-id], [data-route-id], button, input")) return;
      a.preventDefault();
      const o = a.clientX, l = a.clientY, s = this.panX, h = this.panY;
      let g = !1;
      const S = (q) => {
        g = g || Math.abs(q.clientX - o) > 3 || Math.abs(q.clientY - l) > 3, this.panX = s + q.clientX - o, this.panY = h + q.clientY - l, this._applyViewportTransform(n);
      }, E = () => {
        window.removeEventListener("pointermove", S), window.removeEventListener("pointerup", E), g || (this.selectedFactionId = "", this.selectedRouteId = null, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, this.render({ force: !0 }));
      };
      window.addEventListener("pointermove", S), window.addEventListener("pointerup", E, { once: !0 });
    }
    _startSystemDrag(a, n, o) {
      var m;
      if (a.button !== 0) return;
      a.preventDefault(), a.stopPropagation(), (m = o.setPointerCapture) == null || m.call(o, a.pointerId);
      const l = a.clientX, s = a.clientY, h = this._orbitLayer, g = o.dataset.systemId, S = this.activeSystemId;
      let E = this._pointerToMapPercent(a, n), q = !1, A = null;
      const N = Array.from(n.querySelectorAll(`[data-route-from="${o.dataset.systemId}"]`)), J = Array.from(n.querySelectorAll(`[data-route-to="${o.dataset.systemId}"]`)), X = () => {
        h ? h.previewDrag(g, E) : (o.style.left = `${E.x}%`, o.style.top = `${E.y}%`, this._updateConnectedRoutes(N, J, E.x, E.y));
      }, se = (p) => {
        const I = Math.abs(p.clientX - l), b = Math.abs(p.clientY - s);
        !q && I <= 4 && b <= 4 || (q = !0, o.classList.add("is-dragging"), E = this._pointerToMapPercent(p, n), o.dataset.dragged = "true", !A && (A = requestAnimationFrame(() => {
          A = null, X();
        })));
      }, oe = async (p) => {
        if (A && cancelAnimationFrame(A), o.classList.remove("is-dragging"), window.removeEventListener("pointermove", se), window.removeEventListener("pointerup", oe), window.removeEventListener("pointercancel", oe), (p == null ? void 0 : p.type) === "pointercancel") {
          o.dataset.dragged = "false", h ? h.cancelDrag() : q && this.render({ force: !0 });
          return;
        }
        if (!(o.isConnected === !1 || S !== this.activeSystemId) && q) {
          X();
          const I = h == null ? void 0 : h.finishDrag(g, E);
          if (S)
            try {
              await be(this.mapId, S, g, E.x, E.y, I) || this.render({ force: !0 });
            } catch {
              h == null || h.cancelDrag(), te("Could not save the location position."), this.render({ force: !0 });
            }
          else await Se(this.mapId, o.dataset.systemId, E.x, E.y);
        }
      };
      window.addEventListener("pointermove", se), window.addEventListener("pointerup", oe, { once: !0 }), window.addEventListener("pointercancel", oe, { once: !0 });
    }
    _startMarkerResize(a, n) {
      var A;
      if (a.button !== 0) return;
      a.preventDefault(), a.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
      const o = pe(Number(n.dataset.iconSize) || 28, 18, 56), l = n.getBoundingClientRect(), s = l.left + l.width / 2, h = l.top + l.height / 2, g = Math.hypot(a.clientX - s, a.clientY - h);
      let S = o;
      n.dataset.dragged = "true", n.classList.add("is-resizing"), (A = n.setPointerCapture) == null || A.call(n, a.pointerId);
      const E = (N) => {
        const J = Math.hypot(N.clientX - s, N.clientY - h);
        S = pe(Math.round(o + (J - g) / Math.max(this.zoom, 0.01)), 18, 56), n.dataset.iconSize = String(S), n.style.setProperty("--gmf-system-size", `${S}px`);
      }, q = async () => {
        if (n.classList.remove("is-resizing"), window.removeEventListener("pointermove", E), window.removeEventListener("pointerup", q), window.removeEventListener("pointercancel", q), globalThis.setTimeout(() => {
          n.dataset.dragged = "false";
        }, 0), S !== o)
          if (this.activeSystemId) {
            const N = Y(i(this.mapId)).systems.find((X) => X.id === this.activeSystemId), J = N == null ? void 0 : N.objects.find((X) => X.id === n.dataset.systemId);
            J && await c(this.mapId, this.activeSystemId, { ...J, iconSize: S });
          } else
            await u(this.mapId, { id: n.dataset.systemId, iconSize: S });
      };
      window.addEventListener("pointermove", E), window.addEventListener("pointerup", q, { once: !0 }), window.addEventListener("pointercancel", q, { once: !0 });
    }
    _pointerToMapPercent(a, n) {
      const l = n.querySelector(".gmf-map-stage").getBoundingClientRect();
      return {
        x: pe((a.clientX - l.left - this.panX) / this.zoom / this._worldWidth * 100, 0, 100),
        y: pe((a.clientY - l.top - this.panY) / this.zoom / this._worldHeight * 100, 0, 100)
      };
    }
    _updateConnectedRoutes(a, n, o, l) {
      a.forEach((s) => {
        s.setAttribute("x1", o), s.setAttribute("y1", l);
      }), n.forEach((s) => {
        s.setAttribute("x2", o), s.setAttribute("y2", l);
      });
    }
    _openContextMenu(a, n) {
      var se;
      if (!((se = game.user) != null && se.isGM) || this.playerMode || a.target.closest(".gmf-context-menu")) return;
      a.preventDefault(), a.stopPropagation();
      const o = a.target.closest("[data-route-id]"), l = a.target.closest("[data-system-id]"), s = this._pointerToMapPercent(a, n);
      this._contextTarget = o ? { type: "route", id: o.dataset.routeId, position: s } : l ? { type: "system", id: l.dataset.systemId, position: s } : { type: "stage", id: null, position: s };
      const h = n.querySelector("[data-gmf-context-menu]");
      if (!h) return;
      h.querySelectorAll("[data-context-show]").forEach((oe) => {
        oe.hidden = oe.dataset.contextShow !== this._contextTarget.type;
      }), h.hidden = !1;
      const g = h.offsetWidth || 184, S = h.offsetHeight || 260, q = n.querySelector(".gmf-map-stage").getBoundingClientRect(), A = a.clientX - q.left, N = a.clientY - q.top, J = Math.max(4, q.width - g - 4), X = Math.max(4, q.height - S - 4);
      h.style.left = `${pe(A, 4, J)}px`, h.style.top = `${pe(N, 4, X)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(n), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu(a = null) {
      const n = a ?? this.element ?? null, o = n == null ? void 0 : n.querySelector("[data-gmf-context-menu]");
      o && (o.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(a, n) {
      a.preventDefault(), a.stopPropagation();
      const o = a.currentTarget.dataset.contextAction, l = this._contextTarget;
      this._hideContextMenu(n), l && (o === "add-system" ? this._openCreationPanel("system", { x: l.position.x, y: l.position.y }) : o === "add-entity" ? this.activeSystemId && this._openCreationPanel("entity", { x: l.position.x, y: l.position.y }) : o === "manage-factions" ? (this.creationPanel = null, this.factionRegistry = !0, this.render({ force: !0 })) : o === "add-faction" ? this._openCreationPanel("faction") : o === "edit-map-details" ? this._openCreationPanel("map", Y(i(this.mapId)), this.mapId) : o === "export-map" ? j(this.mapId) : o === "edit-system" ? this._openEditPanel("system", l.id) : o === "edit-entity" ? this.activeSystemId && this._openEditPanel("entity", l.id) : o === "add-route-from-marker" ? this._openCreationPanel("route", { fromSystemId: l.id }) : o === "reveal-system" ? await x(this.mapId, l.id) : o === "hide-system" ? await O(this.mapId, l.id, !0) : o === "delete-system" ? await this._confirmDeleteSystem(l.id) : o === "reveal-entity" ? this.activeSystemId && await C(this.mapId, this.activeSystemId, l.id, "players") : o === "hide-entity" ? this.activeSystemId && await C(this.mapId, this.activeSystemId, l.id, "gm") : o === "delete-entity" ? this.activeSystemId && await this._confirmDeleteObject(this.activeSystemId, l.id) : o === "edit-route" ? this._openEditPanel("route", l.id) : o === "reveal-route" ? await $(this.mapId, l.id, this.activeSystemId ?? "") : o === "hide-route" ? await D(this.mapId, l.id, !0, this.activeSystemId ?? "") : o === "delete-route" && await this._confirmDeleteRoute(l.id));
    }
    async _confirmDeleteSystem(a) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, We) && await H(this.mapId, a);
    }
    async _confirmDeleteObject(a, n) {
      await Dialog.confirm({ title: "Delete Location", content: "<p>Delete this location and its linked content?</p>" }) && (await Q(this.mapId, a, n), this.selectedObjectId = null);
    }
    _openCreationPanel(a, n = {}, o = null) {
      var S, E, q, A;
      if (!((S = game.user) != null && S.isGM) || this.playerMode) return;
      const l = Y(i(this.mapId)), s = this.activeSystemId ? ((E = l.systems.find((N) => N.id === this.activeSystemId)) == null ? void 0 : E.objects) ?? [] : l.systems;
      if (a === "route" && s.length < 2) {
        te(this.activeSystemId ? "Create at least two locations before adding a route." : "Create at least two systems before adding a route.");
        return;
      }
      const h = n.fromSystemId || ((q = s[0]) == null ? void 0 : q.id) || "", g = a === "map" ? { title: "Galaxy Map", subtitle: "", description: "", backgroundImage: "", visibility: "players", travelApprovalMode: "unanimous" } : a === "system" ? { name: "New System", status: "known", visibility: "gm", description: "", markerImage: "", backgroundImage: "" } : a === "entity" ? {
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
      } : a === "route" ? { type: "safe", visibility: "gm", travelTime: "", fuelCost: 0, notes: "" } : { name: "New Faction", color: "#58d8ff", visibility: "gm", description: "" };
      if (this.creationPanel = {
        kind: a,
        editId: o,
        data: {
          ...g,
          ...n,
          x: Number.isFinite(Number(n.x)) ? Number(n.x) : 50,
          y: Number.isFinite(Number(n.y)) ? Number(n.y) : 50,
          fromSystemId: h,
          toSystemId: n.toSystemId || ((A = s.find((N) => N.id !== h)) == null ? void 0 : A.id) || ""
        }
      }, this.factionRegistry = !1, a === "faction" && this.selectedFactionId === o) {
        this.render({ force: !0 });
        return;
      }
      this.selectedFactionId = "", this.selectedSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null, this.render({ force: !0 });
    }
    _openEditPanel(a, n, o = !1) {
      var h, g;
      const l = Y(i(this.mapId)), s = a === "system" ? l.systems.find((S) => S.id === n) : a === "entity" ? (h = l.systems.find((S) => S.id === this.activeSystemId)) == null ? void 0 : h.objects.find((S) => S.id === n) : a === "route" ? this.activeSystemId ? (g = l.systems.find((S) => S.id === this.activeSystemId)) == null ? void 0 : g.routes.find((S) => S.id === n) : l.routes.find((S) => S.id === n) : l.factions.find((S) => S.id === n);
      s && this._openCreationPanel(a, o ? { ...s, showOrbitEditor: o } : s, n);
    }
    openEditor(a, n = {}) {
      var o;
      return !((o = game.user) != null && o.isGM) || this.playerMode || a === "faction" && !Re() ? !1 : (this._disposePlanetRenderer(), this.planetSystemId = null, a === "entity" ? (this.activeSystemId = n.systemId || this.activeSystemId, this.selectedSystemId = this.activeSystemId) : a === "route" ? this.activeSystemId = n.systemId || null : ["map", "system", "faction"].includes(a) && (this.activeSystemId = null), a === "map" ? this._openCreationPanel("map", Y(i(this.mapId)), this.mapId) : n.id ? this._openEditPanel(a, n.id) : this._openCreationPanel(a, n.defaults || {}), !0);
    }
    _attachCreationPanel(a) {
      var h, g, S, E;
      (h = a.querySelector("[data-action='cancel-panel-create']")) == null || h.addEventListener("click", () => {
        this.creationPanel = null, this.render({ force: !0 });
      }), (g = a.querySelector("[data-action='close-faction-registry']")) == null || g.addEventListener("click", () => {
        this.factionRegistry = !1, this.render({ force: !0 });
      }), (S = a.querySelector("[data-action='add-inline-faction']")) == null || S.addEventListener("click", () => this._openCreationPanel("faction")), a.querySelectorAll("[data-edit-inline-faction]").forEach((q) => {
        q.addEventListener("click", () => this._openEditPanel("faction", q.dataset.editInlineFaction || ""));
      }), a.querySelectorAll("[data-delete-inline-faction]").forEach((q) => {
        q.addEventListener("click", async () => {
          await Dialog.confirm({ title: "Delete Faction", content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>" }, We) && (await v(this.mapId, q.dataset.deleteInlineFaction), this.factionRegistry = !0, this.render({ force: !0 }));
        });
      });
      const n = a.querySelector("[data-panel-create-form]");
      if (!n) return;
      const o = n.querySelector('select[name="kind"]'), l = n.querySelector('select[name="parentFactionId"]');
      o && l && o.addEventListener("change", () => {
        l.disabled = o.value !== "minor";
      }), Nn(n);
      const s = os(n, ((E = this.creationPanel) == null ? void 0 : E.data) ?? {});
      n.addEventListener("submit", async (q) => {
        q.preventDefault();
        const A = n.dataset.createKind || "", N = Object.fromEntries(new FormData(n).entries());
        a.querySelectorAll('[form="gmf-panel-editor-form"][name]').forEach((p) => {
          p instanceof HTMLInputElement && ["checkbox", "radio"].includes(p.type) && !p.checked || (N[p.name] = p.value);
        }), A === "entity" && (Object.assign(N, s == null ? void 0 : s()), N.markerImage = N.useCustomMarker === "true" ? N.markerImage ?? "" : "", delete N.useCustomMarker);
        const J = Number(N.x), X = Number(N.y), se = this.creationPanel, oe = (se == null ? void 0 : se.data) ?? {};
        se != null && se.editId && (N.id = se.editId), this.creationPanel = null;
        let m = null;
        if (A === "map") m = await T(this.mapId, { ...oe, ...N });
        else if (A === "system")
          delete N.x, delete N.y, m = await u(this.mapId, se != null && se.editId ? N : { ...N, x: J, y: X });
        else if (A === "entity" && this.activeSystemId) {
          const { orbit: p, orbits: I, ...b } = oe;
          if (m = await c(this.mapId, this.activeSystemId, { ...b, ...N, x: J, y: X }), !m) {
            this.creationPanel = se;
            return;
          }
        } else if (A === "route") {
          if (!N.fromSystemId || !N.toSystemId || N.fromSystemId === N.toSystemId) {
            te(`Choose two different ${this.activeSystemId ? "locations" : "systems"} for the route.`), this._openCreationPanel("route", { ...oe, ...N }, (se == null ? void 0 : se.editId) ?? null);
            return;
          }
          m = await f(this.mapId, { ...oe, ...N }, this.activeSystemId ?? "");
        } else A === "faction" && (delete N.x, delete N.y, m = await d(this.mapId, N), this.factionRegistry = !!(m && !this.selectedFactionId && !this.factionPanelOpen));
        !m && (A === "system" || A === "faction") && (this.creationPanel = { ...se, data: { ...oe, ...N } }), m != null && m.id && (A === "system" && (this.selectedSystemId = m.id), A === "entity" && (this.selectedObjectId = m.id), A === "route" && (this.selectedRouteId = m.id)), this.render({ force: !0 });
      }), globalThis.setTimeout(() => {
        var q;
        return (q = n.querySelector("[autofocus]")) == null ? void 0 : q.focus();
      }, 0);
    }
    _attachAppearancePreview(a) {
      const n = a.querySelector("[data-panel-marker-preview-system]"), o = a.querySelector("[data-panel-marker-preview-icon]"), l = a.querySelector("[data-panel-marker-preview-label]");
      if (!n) return;
      let s = 0;
      const h = ["name", "kind", "status", "iconStyle", "iconColor", "markerImage"].map((S) => a.querySelector(`[name="${S}"]`)), g = async () => {
        const S = (X, se) => {
          var oe;
          return ((oe = a.querySelector(`[name="${X}"]`)) == null ? void 0 : oe.value) || se;
        }, E = S("kind", "planet"), q = S("status", "known"), A = S("iconStyle", E), N = S("markerImage", "").trim();
        n.className = `gmf-system gmf-system--${E} gmf-icon--${A} gmf-status--${q}${N ? " has-custom-marker" : ""}`, n.style.setProperty("--gmf-faction-color", S("iconColor", "#58d8ff")), n.style.setProperty("--gmf-system-size", "42px"), l && (l.textContent = S("name", "New Location"));
        const J = ++s;
        if (o && N) {
          const X = document.createElement("img");
          X.className = "gmf-custom-marker__image", X.src = N, X.alt = "", X.draggable = !1, o.replaceChildren(X);
        } else if (o && Mt.includes(A)) {
          const X = await globalThis.renderTemplate(`${t}/celestial-icon.hbs`, { system: { iconStyle: A } });
          J === s && (o.innerHTML = X);
        } else o && (o.innerHTML = '<span class="gmf-system__core"></span>');
      };
      h.forEach((S) => {
        S == null || S.addEventListener("input", g), S == null || S.addEventListener("change", g);
      }), g();
    }
    async _confirmDeleteRoute(a) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, We) && await ce(this.mapId, a, this.activeSystemId ?? "");
    }
    async _travelToSystem(a, n) {
      const o = Y(i(this.mapId)), l = o.systems.find((g) => g.id === o.currentSystemId), s = o.systems.find((g) => g.id === a);
      if (!s) return;
      if (!l) {
        await ae(this.mapId, s.id), ie(`Current location set to ${s.name}.`);
        return;
      }
      if (l.id === s.id) {
        ie(`${s.name} is already the current location.`);
        return;
      }
      if (!B(o, l.id, s.id)) {
        te(`No direct route from ${l.name} to ${s.name}.`);
        return;
      }
      ne(this.mapId, l.id, s.id), await this._animateShipTravel(l, s, n), await ae(this.mapId, s.id), ie(`Arrived at ${s.name}.`);
    }
    async _travelToObject(a, n, o) {
      const l = Y(i(this.mapId)), s = l.systems.find((E) => E.id === a), h = s == null ? void 0 : s.objects.find((E) => E.id === l.currentLocation.objectId), g = s == null ? void 0 : s.objects.find((E) => E.id === n);
      if (!s || !g) return;
      if (!h || l.currentLocation.systemId !== s.id) {
        await M(this.mapId, s.id, g.id), ie(`Current location set to ${g.name}.`);
        return;
      }
      if (h.id === g.id) {
        ie(`${g.name} is already the current location.`);
        return;
      }
      if (!B({ routes: s.routes }, h.id, g.id)) {
        te(`No direct route from ${h.name} to ${g.name}.`);
        return;
      }
      re(this.mapId, s.id, h.id, g.id), await this._animateShipTravel(h, g, o), await M(this.mapId, s.id, g.id), ie(`Arrived at ${g.name}.`);
    }
    _animateShipTravel(a, n, o) {
      var g, S;
      const l = et(), s = ((g = this._orbitLayer) == null ? void 0 : g.position(a.id, l)) ?? a, h = ((S = this._orbitLayer) == null ? void 0 : S.position(n.id, l + jt)) ?? n;
      return as(s, h, o);
    }
    getOrbitGeometry(a) {
      return this.playerMode || this.activeSystemId !== a || !this._orbitLayer ? null : { aspect: this._orbitLayer.aspect, motion: this._orbitLayer.motion };
    }
    _openLinkedJournal() {
      var o, l;
      const a = this._getSelectedRawSystem();
      if (!(a != null && a.journalId)) return;
      const n = (o = game.journal) == null ? void 0 : o.get(a.journalId);
      if (!n) {
        te(`Journal "${a.journalId}" was not found.`);
        return;
      }
      (l = n.sheet) == null || l.render(!0);
    }
    _getSelectedRawSystem() {
      var n;
      const a = Y(i(this.mapId));
      return this.activeSystemId ? ((n = a.systems.find((o) => o.id === this.activeSystemId)) == null ? void 0 : n.objects.find((o) => o.id === this.selectedObjectId)) ?? null : a.systems.find((o) => o.id === this.selectedSystemId) ?? null;
    }
    async close(a = {}) {
      var n, o, l;
      return (n = this._orbitLayer) == null || n.dispose(), this._orbitLayer = null, this._viewportStage = null, (o = this._bountyIntelCallout) == null || o.dispose(), this._bountyIntelCallout = null, this._disposePlanetRenderer(), this._hideContextMenu(), this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, (l = this._viewportResizeObserver) == null || l.disconnect(), this._viewportResizeObserver = null, ge(this), super.close(a);
    }
    _disposePlanetRenderer() {
      var a, n;
      this._planetGeneration++, (a = this._planetLocationCallout) == null || a.dispose(), this._planetLocationCallout = null, (n = this._planetRenderer) == null || n.dispose(), this._planetRenderer = null;
    }
    _setPlanetFallback(a, n) {
      const o = a.querySelector(".gmf-planet-fallback");
      o && (o.style.backgroundImage = n.texture ? `url(${JSON.stringify(n.texture)})` : "none", o.style.backgroundColor = n.color);
      const l = a.querySelector("[data-planet-canvas]");
      l && (l.dataset.planetShape = n.shape, l.dataset.planetPreset = n.preset);
      const s = a.querySelector(".gmf-planet-stage");
      s == null || s.style.setProperty("--gmf-planet-color", n.color);
    }
    async _mountPlanetRenderer(a, n) {
      var g, S, E;
      const o = a.querySelector("[data-planet-canvas]");
      if (!o || !n) return;
      this._setPlanetFallback(a, n);
      const l = this._planetGeneration, s = a.querySelector("[data-action='planet-static']"), h = a.querySelectorAll("[data-planet-control]");
      if (s) {
        const q = this.planetStatic ? "Enable 3D" : "Static view";
        s.setAttribute("title", q), s.setAttribute("aria-label", q), s.setAttribute("aria-pressed", String(this.planetStatic));
        const A = s.querySelector("i");
        A && (A.className = this.planetStatic ? "fa-solid fa-cube" : "fa-solid fa-image");
      }
      if (this.planetStatic) {
        h.forEach((q) => q.disabled = !0);
        return;
      }
      try {
        const { createPlanetRenderer: q } = await import("./chunks/planet-renderer-t-HvFdDj.js");
        if (l !== this._planetGeneration || !o.isConnected) return;
        h.forEach((A) => A.disabled = !1), this._planetRenderer = q(o, {
          texture: n.texture,
          color: n.color,
          appearancePreset: n.preset,
          shape: n.shape,
          finish: n.finish,
          detailStrength: n.detailStrength,
          locations: ((g = this._getPlanetObject()) == null ? void 0 : g.planetLocations) ?? [],
          canPlaceLocations: !!((S = game.user) != null && S.isGM && !this.playerMode),
          onLocationDrop: (A, N) => void this._placePlanetLocation(A, N, a),
          onInvalidLocationDrop: () => te("Drop the scene directly onto the visible 3D surface."),
          onMarkerHover: (A) => {
            var J;
            const N = this._getPlanetLocationItem(A.id);
            N && ((J = this._planetLocationCallout) == null || J.show(N));
          },
          onMarkerLeave: () => {
            var A;
            return (A = this._planetLocationCallout) == null ? void 0 : A.scheduleHide();
          },
          onMarkerPosition: (A) => {
            var N;
            return (N = this._planetLocationCallout) == null ? void 0 : N.setAnchor(A);
          },
          onMarkerOpen: (A) => this._openPlanetLocation(A.id),
          onMarkerContextMenu: (E = game.user) != null && E.isGM && !this.playerMode ? (A) => void this._removePlanetLocation(A.id, a) : null,
          isVisible: () => !this.minimized,
          onPaused: (A) => {
            const N = a.querySelector("[data-action='planet-pause']");
            if (N) {
              const J = A ? "Resume rotation" : "Pause rotation";
              N.setAttribute("title", J), N.setAttribute("aria-label", J), N.setAttribute("aria-pressed", String(A));
              const X = N.querySelector("i");
              X && (X.className = A ? "fa-solid fa-play" : "fa-solid fa-pause");
            }
          },
          onStopped: () => {
            h.forEach((A) => A.disabled = !0);
          }
        }), this._planetLocationCallout = ss({ host: o });
      } catch {
        h.forEach((q) => q.disabled = !0);
      }
    }
  }, W(qe, "DEFAULT_OPTIONS", {
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
  }), W(qe, "PARTS", {
    main: {
      template: `${t}/galaxy-map.hbs`
    }
  }), qe;
}
function us(e) {
  var c;
  const { templateRoot: t, getVisibleMaps: i, openMap: r, clearChooser: u } = e;
  return c = class extends pt() {
    async _prepareContext(d) {
      return { ...await super._prepareContext(d), maps: i() };
    }
    _attachPartListeners(d, T, v) {
      super._attachPartListeners(d, T, v), ft(this, T), T.querySelectorAll("[data-player-open-map]").forEach((w) => {
        w.addEventListener("click", () => {
          r(w.dataset.playerOpenMap, { playerMode: !0 }), this.close();
        });
      });
    }
    async close(d = {}) {
      return u(this), super.close(d);
    }
  }, W(c, "DEFAULT_OPTIONS", {
    id: "galaxy-map-player-chooser",
    classes: ["galaxy-map", "galaxy-map-framework", "gmf-manager-window", "gmf-map-chooser-window"],
    window: { title: "Choose Galaxy Map", icon: "fa-solid fa-satellite", resizable: !0 },
    position: { width: 480, height: 420 }
  }), W(c, "PARTS", { main: { template: `${t}/player-map-chooser.hbs` } }), c;
}
function ms(e, t) {
  var c;
  const { setting: i, title: r, icon: u } = nt[t];
  return c = class extends pt() {
    constructor() {
      super(...arguments);
      W(this, "draft", null);
    }
    async _prepareContext(T) {
      var P;
      const v = await super._prepareContext(T), w = !!((P = game.user) != null && P.isGM && Re());
      return { ...v, canEdit: w, title: r, scale: t, ratings: w ? this.draft ?? Tt(t) : [] };
    }
    _onRender(T, v) {
      var $;
      super._onRender(T, v);
      const P = this.element.querySelector("[data-faction-ratings]");
      if (!P) return;
      const x = () => Array.from(P.querySelectorAll("[data-rating-label]"), (O) => ({
        id: O.dataset.ratingLabel,
        label: O.value
      }));
      ($ = P.querySelector("[data-add-rating]")) == null || $.addEventListener("click", () => {
        this.draft = [...x(), { id: Te(t), label: "" }], this.render({ force: !0 });
      }), P.querySelectorAll("[data-remove-rating]").forEach((O) => {
        O.addEventListener("click", () => {
          this.draft = x().filter((C) => C.id !== O.dataset.removeRating), this.render({ force: !0 });
        });
      }), P.addEventListener("submit", async (O) => {
        var ce;
        if (O.preventDefault(), !((ce = game.user) != null && ce.isGM) || !Re()) return;
        const C = P.querySelector("[data-rating-status]"), D = x().map(({ id: ae, label: M }) => ({ id: ae, label: M.trim() })), H = D.map((ae) => ae.label.toLowerCase());
        if (H.includes("") || new Set(H).size !== D.length) {
          C.textContent = "Enter a unique name for each rating.";
          return;
        }
        if (t === "prominence" && H.includes("unrated")) {
          C.textContent = "Unrated is reserved for factions without a prominence rating.";
          return;
        }
        const Q = P.querySelector("fieldset");
        if (!Q.disabled) {
          Q.disabled = !0, C.textContent = "Saving…";
          try {
            await game.settings.set(he, i, { ratings: D }), this.draft = null, C.textContent = `${r} ratings saved.`;
          } catch (ae) {
            C.textContent = `Could not save ${t} ratings.`, console.error(`Galaxy Map failed to save ${t} ratings`, ae);
          } finally {
            Q.disabled = !1;
          }
        }
      });
    }
  }, W(c, "DEFAULT_OPTIONS", {
    id: `galaxy-map-${t}-settings`,
    window: { title: `${r} Ratings`, icon: u, resizable: !0 },
    position: { width: 520, height: 480 }
  }), W(c, "PARTS", {
    main: { template: `${e}/faction-rating-settings.hbs`, scrollable: [""] }
  }), c;
}
function fs(e) {
  return e.visibility === "players";
}
function ps(e, t) {
  return t && e.status === "undiscovered";
}
function dn(e, t, i, r) {
  const u = i ? void 0 : t.get(e.factionId);
  return {
    factionId: (u == null ? void 0 : u.id) ?? "",
    factionName: (u == null ? void 0 : u.name) ?? (i || r ? "" : "Unaffiliated"),
    factionColor: !i && e.iconColor || (u == null ? void 0 : u.color) || "#58d8ff"
  };
}
function hs(e, t) {
  return t === "planet" ? { station: "station", anomaly: "diamond", ruins: "diamond", unknown: "diamond" }[e] ?? t : t;
}
function ys(e, { playerMode: t = !1, selectedSystemId: i = null, selectedRouteId: r = null, factionsDisabled: u = !1 } = {}) {
  var Q, ce, ae;
  t = t || !((Q = game.user) != null && Q.isGM);
  const c = Y(e), f = t ? c.systems.filter(fs) : c.systems, d = new Set(f.map((M) => M.id)), T = u ? [] : c.factions.filter((M) => !t || M.visibility === "players"), v = new Map(T.filter((M) => M.kind === "major").map((M) => [M.id, M])), w = f.map((M) => {
    const U = ps(M, t), K = U ? "unknown" : M.type, j = U ? "diamond" : hs(K, M.iconStyle), B = U ? "" : M.markerImage;
    return {
      ...M,
      image: M.image,
      sceneIds: [...M.sceneIds],
      journalId: M.journalId,
      planetPreset: M.planetPreset,
      planetShape: M.planetShape,
      planetTexture: M.planetTexture,
      planetColor: M.planetColor,
      iconStyle: j,
      displayMarkerImage: B,
      hasCustomMarker: !!B,
      displayName: U ? "???" : M.name,
      displayDescription: U ? "Unresolved sensor contact. Details are not available." : M.description,
      displayType: K,
      displayStatus: U ? "undiscovered" : M.status,
      ...dn(M, v, U, u),
      objects: M.objects.filter((ne) => !t || Xe(M, ne) === "players").map((ne) => ({
        ...ne,
        ...dn(ne, v, U || t && ne.status === "undiscovered", u)
      })),
      obscured: U,
      isCurrent: M.id === c.currentSystemId,
      isSelected: M.id === i,
      gmOnly: M.visibility === "gm",
      animatedCelestial: !B && Mt.includes(j),
      hasAlert: ["danger", "locked"].includes(U ? "undiscovered" : M.status),
      alertLabel: M.status === "danger" ? "Hazard advisory" : M.status === "locked" ? "Restricted access" : "",
      hasJournal: !!(!U && M.journalId),
      hasScenes: !!(!U && M.sceneIds.length),
      showImage: !!(!U && M.image),
      canInspectSystem: !!Ne({ ...M, obscured: U })
    };
  }), P = w.filter((M) => !M.obscured), x = T.map((M) => {
    const U = P.find((R) => R.id === M.headquartersSystemId), { id: K, name: j, color: B, emblem: ne, tagline: re, type: ie, description: te, visibility: Se, kind: be, prominence: Ie, reputation: xe } = M;
    return {
      id: K,
      name: j,
      color: B,
      emblem: ne,
      tagline: re,
      type: ie,
      description: te,
      visibility: Se,
      kind: be,
      prominence: Ie,
      reputation: xe,
      prominencePercent: M.prominencePercent,
      reputationPercent: M.reputationPercent,
      systemProminencePercent: Object.fromEntries(P.filter((R) => Object.hasOwn(M.systemProminencePercent, R.id)).map((R) => [R.id, M.systemProminencePercent[R.id]])),
      parentFactionId: v.has(M.parentFactionId) ? M.parentFactionId : "",
      systemProminence: Object.fromEntries(P.filter((R) => Object.hasOwn(M.systemProminence, R.id)).map((R) => [R.id, M.systemProminence[R.id]])),
      gmNotes: t ? void 0 : M.gmNotes,
      headquarters: U ? { id: U.id, name: U.displayName } : null,
      controlledSystems: P.filter((R) => R.factionId === K).map((R) => ({ id: R.id, name: R.displayName }))
    };
  }), $ = c.routes.filter((M) => !t || M.visibility === "players").filter((M) => d.has(M.fromSystemId) && d.has(M.toSystemId)).map((M) => {
    const U = w.find((j) => j.id === M.fromSystemId), K = w.find((j) => j.id === M.toSystemId);
    return {
      ...M,
      from: U,
      to: K,
      fromName: (U == null ? void 0 : U.displayName) ?? M.fromSystemId,
      toName: (K == null ? void 0 : K.displayName) ?? M.toSystemId,
      isSelected: M.id === r,
      connectsCurrent: M.fromSystemId === c.currentSystemId || M.toSystemId === c.currentSystemId,
      gmOnly: M.visibility === "gm"
    };
  }), O = $.find((M) => M.id === r) ?? null, C = O ? null : w.find((M) => M.id === i) ?? null;
  C && (C.isSelected = !0);
  const D = w.find((M) => M.id === c.currentSystemId) ?? w[0] ?? null, H = C && D && C.id !== D.id ? $.find((M) => M.fromSystemId === D.id && M.toSystemId === C.id || M.toSystemId === D.id && M.fromSystemId === C.id) : null;
  return C && (C.canTravel = !!H, C.travelRouteId = (H == null ? void 0 : H.id) ?? "", C.isCurrent = C.id === (D == null ? void 0 : D.id), C.isDestination = !!(H && !C.isCurrent)), $.forEach((M) => {
    M.isActive = M.isSelected || M.id === (H == null ? void 0 : H.id);
  }), {
    ...c,
    systems: w,
    routes: $,
    factions: x,
    selectedSystem: C,
    selectedRoute: O,
    currentSystem: D,
    selectedType: O ? "route" : C ? "system" : null,
    playerMode: t,
    isGM: ((ce = game.user) == null ? void 0 : ce.isGM) ?? !1,
    canEdit: ((ae = game.user) == null ? void 0 : ae.isGM) && !t
  };
}
function gs(e) {
  var u;
  if (!e) return null;
  const t = Y(e), i = new Map(t.systems.map((c) => [c.id, c])), r = new Map(t.factions.map((c) => [c.id, c]));
  return {
    ...t,
    travelApprovalModeLabel: ((u = qt.find((c) => c.value === t.travelApprovalMode)) == null ? void 0 : u.label) ?? "Unanimous agreement",
    factions: t.factions.map((c) => ({
      ...c,
      systemCount: t.systems.filter((f) => f.factionId === c.id).length
    })),
    systems: t.systems.map((c) => {
      var f;
      return {
        ...c,
        factionName: ((f = r.get(c.factionId)) == null ? void 0 : f.name) ?? "Unaffiliated"
      };
    }),
    routes: [
      ...t.routes.map((c) => {
        var f, d;
        return {
          ...c,
          systemId: "",
          scopeLabel: "Galaxy route",
          fromName: ((f = i.get(c.fromSystemId)) == null ? void 0 : f.name) ?? c.fromSystemId,
          toName: ((d = i.get(c.toSystemId)) == null ? void 0 : d.name) ?? c.toSystemId
        };
      }),
      ...t.systems.flatMap((c) => {
        const f = new Map(c.objects.map((d) => [d.id, d]));
        return c.routes.map((d) => {
          var T, v;
          return {
            ...d,
            systemId: c.id,
            scopeLabel: `Inside ${c.name}`,
            fromName: ((T = f.get(d.fromSystemId)) == null ? void 0 : T.name) ?? d.fromSystemId,
            toName: ((v = f.get(d.toSystemId)) == null ? void 0 : v.name) ?? d.toSystemId
          };
        });
      })
    ]
  };
}
function Ss(e) {
  Nn(e), e.querySelectorAll("[data-use-custom-marker]").forEach(($) => {
    const O = ($.closest("form") ?? e).querySelector("[data-custom-marker-field]"), C = (O == null ? void 0 : O.querySelector('[name="markerImage"]')) ?? null, D = (O == null ? void 0 : O.querySelectorAll("button")) ?? [], H = () => {
      const Q = $.checked;
      O == null || O.classList.toggle("is-disabled", !Q), C && (C.disabled = !Q), D.forEach((ce) => {
        ce.disabled = !Q;
      }), !Q && (C != null && C.value) && (C.value = "", C.dispatchEvent(new Event("input", { bubbles: !0 })), C.dispatchEvent(new Event("change", { bubbles: !0 })));
    };
    $.addEventListener("change", H), H();
  });
  const t = e.querySelector("[data-texture-upload-fields]"), i = e.querySelector('[name="planetTexture"]'), r = e.querySelector('[name="planetPreset"]'), u = e.querySelector('[name="planetShape"]'), c = e.querySelector('[name="planetFinish"]'), f = e.querySelector('[name="planetColor"]'), d = e.querySelector("[data-texture-guide]"), T = e.querySelector("[data-texture-guide-section]"), v = e.querySelectorAll("[data-texture-guide-preview]"), w = () => {
    if (!r || !u) return;
    const $ = bn(r.value, u.value);
    r.replaceChildren(...Sn(u.value).map((O) => {
      const C = document.createElement("option");
      return C.value = O.value, C.textContent = O.label, C;
    })), r.value = $;
  }, P = () => {
    const $ = (r == null ? void 0 : r.value) === "custom", O = (r == null ? void 0 : r.value) === "none";
    return t && (t.hidden = !$), T && (T.hidden = !$), i && (i.required = $), u && (u.disabled = O), c && (c.disabled = O), f && (f.disabled = (r == null ? void 0 : r.value) !== "color"), $;
  }, x = () => {
    var O;
    if (!d) return;
    const $ = (O = i == null ? void 0 : i.value) == null ? void 0 : O.trim();
    $ ? d.dataset.hasTexture = "true" : delete d.dataset.hasTexture, v.forEach((C) => {
      C.onerror = $ ? () => {
        C.hidden = !0;
      } : null, C.hidden = !$, $ ? C.src = $ : C.removeAttribute("src");
    });
  };
  r == null || r.addEventListener("change", () => {
    !P() && (i != null && i.value) && (i.value = "", i.dispatchEvent(new Event("change", { bubbles: !0 })));
  }), i == null || i.addEventListener("change", x), u == null || u.addEventListener("change", () => {
    d && (d.dataset.shape = u.value), w(), P();
  }), w(), P(), x();
}
function bs(e) {
  const { notifyError: t, notifyInfo: i, requireGM: r, refreshOpenApps: u, closeOpenMap: c, getOpenMapViews: f } = e, d = (m) => foundry.utils.deepClone(m), T = (m) => game.socket.emit(_e, { action: "refresh", mapId: m });
  function v() {
    return d(game.settings.get(he, _t) ?? {});
  }
  async function w(m) {
    return r("save galaxy map data") && await game.settings.set(he, _t, m ?? {}), m;
  }
  function P(m) {
    const p = v();
    return p[m] ? d(p[m]) : null;
  }
  async function x(m, p, { refresh: I = !0 } = {}) {
    return m[p] = Y(m[p]), await w(m), I && u(p), T(p), m[p];
  }
  async function $(m = {}) {
    if (!r("create galaxy maps")) return null;
    const p = v(), I = Y(m);
    return p[I.id] = I, await w(p), u(I.id), d(I);
  }
  async function O(m, p = {}) {
    if (!r("update galaxy maps")) return null;
    const I = v();
    if (!I[m])
      return t(`Map "${m}" was not found.`), null;
    const b = Y({ ...p, id: m });
    return I[m] = b, await w(I), u(m), d(b);
  }
  async function C(m, p = {}) {
    const I = P(m);
    return !r("update galaxy map metadata") || !I ? (I || t(`Map "${m}" was not found.`), null) : O(m, {
      ...I,
      title: p.title,
      subtitle: p.subtitle,
      description: p.description,
      backgroundImage: p.backgroundImage,
      visibility: p.visibility,
      travelApprovalMode: p.travelApprovalMode
    });
  }
  async function D(m) {
    if (!r("delete galaxy maps")) return !1;
    const p = v();
    return p[m] ? (delete p[m], await w(p), c(m), u(), !0) : !1;
  }
  async function H(m) {
    if (!r("duplicate galaxy maps")) return null;
    const p = P(m);
    if (!p)
      return t(`Map "${m}" was not found.`), null;
    const I = Y({ ...p, id: Te("map"), title: `${p.title} Copy` }), b = v();
    return b[I.id] = I, await w(b), u(I.id), d(I);
  }
  async function Q(m, p = {}) {
    var me;
    if (!r("save star systems")) return null;
    const I = v();
    if (!I[m])
      return t(`Map "${m}" was not found.`), null;
    const b = Y(I[m]), _ = b.systems.find((fe) => fe.id === p.id);
    if (p.factionId && p.factionId !== (_ == null ? void 0 : _.factionId) && !b.factions.some((fe) => fe.id === p.factionId))
      return t("Choose a faction on this galaxy map."), null;
    const L = p.objects ?? (_ == null ? void 0 : _.objects) ?? [], z = (_ == null ? void 0 : _.primaryObjectId) || ((me = L[0]) == null ? void 0 : me.id), F = ["image", "sceneIds", "planetLocations", "journalId", "planetPreset", "planetShape", "planetFinish", "planetTexture", "planetColor"], V = L.map((fe) => fe.id !== z ? fe : en({
      ...fe,
      ...Object.fromEntries(F.filter((we) => p[we] !== void 0).map((we) => [we, p[we]]))
    })), ee = qn({ ..._, ...p, objects: V }), ue = b.systems.findIndex((fe) => fe.id === ee.id);
    return ue >= 0 ? b.systems[ue] = ee : b.systems.push(ee), I[m] = b, await x(I, m), d(ee);
  }
  async function ce(m, p, I = {}) {
    var ee, ue, me;
    if (!r("save locations")) return null;
    const b = v(), _ = b[m] ? Y(b[m]) : null, L = _ == null ? void 0 : _.systems.find((fe) => fe.id === p);
    if (!_ || !L) return null;
    const z = L.objects.findIndex((fe) => fe.id === I.id), F = L.objects[z], V = en({ orbits: F == null ? void 0 : F.orbits, orbit: F == null ? void 0 : F.orbit, ...I });
    if (V.orbit && !Ct(L.objects, V.id, V.orbit))
      return t("Choose an orbit that exists in this system and does not depend on this location."), null;
    if (F != null && F.orbit || (ee = F == null ? void 0 : F.orbits) != null && ee.length) {
      const fe = et(), we = ae(m, p), Me = It(L.objects).positions(we.aspect, fe, we.motion);
      F.orbit && !V.orbit && gt(V, Me.get(V.id)), F.orbit && V.orbit && V.orbit.epoch !== F.orbit.epoch && V.orbit.centerId === F.orbit.centerId && V.orbit.orbitId === F.orbit.orbitId && V.orbit.angle === F.orbit.angle && (V.orbit.angle = wn(F.orbit, fe, we.motion));
      for (const Ae of L.objects)
        ((ue = Ae.orbit) == null ? void 0 : ue.centerId) === V.id && !((me = V.orbits) != null && me.some((Ue) => Ue.id === Ae.orbit.orbitId)) && gt(Ae, Me.get(Ae.id));
    }
    return z >= 0 ? L.objects[z] = V : L.objects.push(V), L.primaryObjectId || (L.primaryObjectId = V.id), b[m] = _, await x(b, m), d(V);
  }
  function ae(m, p) {
    var I;
    for (const b of f(m)) {
      const _ = (I = b.getOrbitGeometry) == null ? void 0 : I.call(b, p);
      if (_) return _;
    }
    return { aspect: vn, motion: !0 };
  }
  function M(m, p, I) {
    const b = p.objects.filter((F) => F.orbit && (F.id === I || F.orbit.centerId === I));
    if (!b.length) return;
    const { aspect: _, motion: L } = ae(m, p.id), z = It(p.objects).positions(_, et(), L);
    for (const F of b) gt(F, z.get(F.id));
  }
  const U = (m, p, I) => {
    var b;
    for (const _ of f(m)) (b = _.refreshPlanetLocations) == null || b.call(_, p, I);
  };
  async function K(m, p, I, b = {}) {
    var ue;
    if (!r("place surface locations")) return null;
    const _ = v(), L = _[m] ? Y(_[m]) : null, z = (ue = L == null ? void 0 : L.systems.find((me) => me.id === p)) == null ? void 0 : ue.objects.find((me) => me.id === I);
    if (!L || !z) return null;
    const F = String(b.sceneId || "");
    if (!z.sceneIds.includes(F))
      return t("Only scenes linked to this object can be placed on its surface."), null;
    const V = Ln(b), ee = z.planetLocations.findIndex((me) => me.sceneId === F && me.shape === V.shape);
    return ee >= 0 && (V.id = z.planetLocations[ee].id), ee >= 0 ? z.planetLocations[ee] = V : z.planetLocations.push(V), _[m] = Y(L), await w(_), U(m, p, I), game.socket.emit(_e, { action: "planet-locations", mapId: m, systemId: p, objectId: I }), d(V);
  }
  async function j(m, p, I, b) {
    var V;
    if (!r("remove surface locations")) return !1;
    const _ = v(), L = _[m] ? Y(_[m]) : null, z = (V = L == null ? void 0 : L.systems.find((ee) => ee.id === p)) == null ? void 0 : V.objects.find((ee) => ee.id === I);
    if (!L || !z) return !1;
    const F = z.planetLocations.length;
    return z.planetLocations = z.planetLocations.filter((ee) => ee.id !== b), z.planetLocations.length === F ? !1 : (_[m] = Y(L), await w(_), U(m, p, I), game.socket.emit(_e, { action: "planet-locations", mapId: m, systemId: p, objectId: I }), !0);
  }
  async function B(m, p, I, b) {
    var L, z;
    if (!r("unlink scenes from locations")) return !1;
    const _ = (z = (L = P(m)) == null ? void 0 : L.systems.find((F) => F.id === p)) == null ? void 0 : z.objects.find((F) => F.id === I);
    return _ != null && _.sceneIds.includes(b) ? !!await ce(m, p, { ..._, sceneIds: _.sceneIds.filter((F) => F !== b) }) : !1;
  }
  async function ne(m, p, I) {
    var z;
    if (!r("delete locations")) return !1;
    const b = v(), _ = b[m] ? Y(b[m]) : null, L = _ == null ? void 0 : _.systems.find((F) => F.id === p);
    return !_ || !L ? !1 : (M(m, L, I), L.objects = L.objects.filter((F) => F.id !== I), L.primaryObjectId === I && (L.primaryObjectId = ((z = L.objects[0]) == null ? void 0 : z.id) ?? ""), _.currentLocation.objectId === I && (_.currentLocation.objectId = L.primaryObjectId), b[m] = _, await x(b, m), !0);
  }
  async function re(m, p, I) {
    var V;
    if (!r("move locations")) return null;
    const b = v(), _ = b[m] ? Y(b[m]) : null, L = _ == null ? void 0 : _.systems.find((ee) => ee.objects.some((ue) => ue.id === p)), z = _ == null ? void 0 : _.systems.find((ee) => ee.id === I), F = L == null ? void 0 : L.objects.find((ee) => ee.id === p);
    return !_ || !L || !z || !F ? null : (L.id !== z.id && M(m, L, p), L.objects = L.objects.filter((ee) => ee.id !== p), z.objects.push(F), L.primaryObjectId === p && (L.primaryObjectId = ((V = L.objects[0]) == null ? void 0 : V.id) ?? ""), z.primaryObjectId || (z.primaryObjectId = p), _.currentLocation.objectId === p && (_.currentLocation.systemId = z.id), b[m] = _, await x(b, m), d(F));
  }
  async function ie(m, p, I) {
    if (!r("set the arrival object")) return null;
    const b = v(), _ = b[m] ? Y(b[m]) : null, L = _ == null ? void 0 : _.systems.find((z) => z.id === p);
    return !_ || !(L != null && L.objects.some((z) => z.id === I)) ? null : (L.primaryObjectId = I, _.currentLocation.systemId === p && !_.currentLocation.objectId && (_.currentLocation.objectId = I), b[m] = _, await x(b, m), d(L));
  }
  async function te(m, p, I, b, _, L) {
    var ee, ue;
    if (!r("place locations")) return null;
    const z = v(), F = z[m] ? Y(z[m]) : null, V = (ee = F == null ? void 0 : F.systems.find((me) => me.id === p)) == null ? void 0 : ee.objects.find((me) => me.id === I);
    if (!F || !V) return null;
    if (L) {
      if (((ue = V.orbit) == null ? void 0 : ue.centerId) !== L.centerId || V.orbit.orbitId !== L.orbitId) return null;
      V.orbit.angle = L.angle, V.orbit.epoch = et();
    } else
      V.x = pe(Ce(b, V.x), 0, 100), V.y = pe(Ce(_, V.y), 0, 100);
    return z[m] = F, await x(z, m), d(V);
  }
  async function Se(m, p, I, b) {
    var F;
    if (!r("change object visibility")) return null;
    const _ = v(), L = _[m] ? Y(_[m]) : null, z = (F = L == null ? void 0 : L.systems.find((V) => V.id === p)) == null ? void 0 : F.objects.find((V) => V.id === I);
    return !L || !z ? null : (z.visibility = _n.includes(b) ? b : "inherit", z.visibility === "players" && ["undiscovered", "locked"].includes(z.status) && (z.status = "known"), _[m] = L, await x(_, m), d(z));
  }
  async function be(m, p) {
    var _;
    if (!r("delete star systems")) return !1;
    const I = v(), b = I[m];
    if (!b) return !1;
    b.systems = b.systems.filter((L) => L.id !== p), b.routes = b.routes.filter((L) => L.fromSystemId !== p && L.toSystemId !== p), b.currentSystemId === p && (b.currentSystemId = ((_ = b.systems[0]) == null ? void 0 : _.id) ?? "");
    for (const L of b.factions ?? []) L.headquartersSystemId === p && (L.headquartersSystemId = "");
    return await x(I, m), !0;
  }
  async function Ie(m, p) {
    if (!r("set current location")) return null;
    const I = v(), b = I[m] ? Y(I[m]) : null, _ = b == null ? void 0 : b.systems.find((L) => L.id === p);
    return !b || !_ ? (t(`System "${p}" was not found.`), null) : (b.currentLocation.systemId !== p && (b.currentLocation = { systemId: p, objectId: _.primaryObjectId }), b.currentSystemId = p, I[m] = b, await x(I, m), d(_));
  }
  async function xe(m, p, I) {
    if (!r("set current location")) return null;
    const b = v(), _ = b[m] ? Y(b[m]) : null, L = _ == null ? void 0 : _.systems.find((F) => F.id === p), z = L == null ? void 0 : L.objects.find((F) => F.id === I);
    return !_ || !L || !z ? null : (_.currentSystemId = p, _.currentLocation = { systemId: p, objectId: I }, b[m] = _, await x(b, m), d(z));
  }
  async function R(m, p = {}, I = "") {
    var V;
    if (!r("save routes")) return null;
    const b = v(), _ = b[m], L = I ? (V = _ == null ? void 0 : _.systems) == null ? void 0 : V.find((ee) => ee.id === I) : _;
    if (!_ || !L)
      return t(I ? `System "${I}" was not found.` : `Map "${m}" was not found.`), null;
    Array.isArray(L.routes) || (L.routes = []);
    const z = Rt(p);
    if (!z.fromSystemId || !z.toSystemId || z.fromSystemId === z.toSystemId)
      return t("Routes require two different systems."), null;
    const F = L.routes.findIndex((ee) => ee.id === z.id);
    return F >= 0 ? L.routes[F] = z : L.routes.push(z), await x(b, m), d(z);
  }
  async function ge(m, p, I = "") {
    var z;
    if (!r("delete routes")) return !1;
    const b = v(), _ = b[m], L = I ? (z = _ == null ? void 0 : _.systems) == null ? void 0 : z.find((F) => F.id === I) : _;
    return L ? (L.routes = (L.routes ?? []).filter((F) => F.id !== p), await x(b, m), !0) : !1;
  }
  async function qe(m, p = {}) {
    var z;
    if (!r("save factions")) return null;
    const I = v();
    if (!I[m])
      return t(`Map "${m}" was not found.`), null;
    const b = Y(I[m]), _ = b.factions.findIndex((F) => F.id === p.id), L = kn({ ...b.factions[_], ...p });
    return L.parentFactionId && (L.parentFactionId === L.id || !b.factions.some((F) => F.id === L.parentFactionId && F.kind === "major")) ? (t("Choose a major faction on this galaxy map as the parent."), null) : L.headquartersSystemId && L.headquartersSystemId !== ((z = b.factions[_]) == null ? void 0 : z.headquartersSystemId) && !b.systems.some((F) => F.id === L.headquartersSystemId) ? (t("Choose a headquarters system on this galaxy map."), null) : (_ >= 0 ? b.factions[_] = L : b.factions.push(L), I[m] = b, await x(I, m), d(L));
  }
  async function y(m, p) {
    if (!r("delete factions")) return !1;
    const I = v();
    if (!I[m]) return !1;
    const b = Y(I[m]);
    b.factions = b.factions.filter((_) => _.id !== p);
    for (const _ of b.systems) {
      _.factionId === p && (_.factionId = "");
      for (const L of _.objects ?? []) L.factionId === p && (L.factionId = "");
    }
    return I[m] = b, await x(I, m), !0;
  }
  async function G(m, p, I, b, _ = "") {
    var ue, me, fe, we;
    if (!r(`${b ? "hide" : "reveal"} ${{ faction: "factions", system: "star systems", route: "routes" }[p]}`)) return null;
    const z = v(), F = z[m], V = _ ? (ue = F == null ? void 0 : F.systems) == null ? void 0 : ue.find((Me) => Me.id === _) : F, ee = p === "faction" ? (me = F == null ? void 0 : F.factions) == null ? void 0 : me.find((Me) => Me.id === I) : p === "system" ? (fe = F == null ? void 0 : F.systems) == null ? void 0 : fe.find((Me) => Me.id === I) : (we = V == null ? void 0 : V.routes) == null ? void 0 : we.find((Me) => Me.id === I);
    return !F || !ee ? (t(`${p[0].toUpperCase()}${p.slice(1)} "${I}" was not found.`), null) : (ee.visibility = b ? "gm" : "players", p === "system" && !b && ["undiscovered", "locked"].includes(ee.status) && (ee.status = "known"), await x(z, m), d(ee));
  }
  async function a(m, p, I = !0) {
    const b = await G(m, "faction", p, I);
    return b && i(`${b.name} ${I ? "hidden from" : "visible to"} players.`), b;
  }
  async function n(m, p, { notify: I = !0 } = {}) {
    const b = await G(m, "system", p, !1);
    return b ? (I && g(m, b.id), i(`${b.name} revealed to players.`), b) : null;
  }
  async function o(m, p, I = !0) {
    const b = await G(m, "system", p, I);
    return b && i(`${b.name} ${I ? "hidden from" : "visible to"} players.`), b;
  }
  async function l(m, p, I = "") {
    const b = await G(m, "route", p, !1, I);
    return b && i("Route revealed to players."), b;
  }
  async function s(m, p, I = !0, b = "") {
    const _ = await G(m, "route", p, I, b);
    return _ && i(`Route ${I ? "hidden from" : "visible to"} players.`), _;
  }
  async function h(m, p, I, b) {
    var F;
    if (!r("move star systems")) return null;
    const _ = v(), L = _[m], z = (F = L == null ? void 0 : L.systems) == null ? void 0 : F.find((V) => V.id === p);
    return z ? (z.x = pe(Ce(I, z.x), 0, 100), z.y = pe(Ce(b, z.y), 0, 100), await x(_, m, { refresh: !1 }), d(z)) : (t(`System "${p}" was not found.`), null);
  }
  function g(m, p) {
    var b, _;
    if (!r("notify players about discoveries")) return;
    const I = (_ = (b = P(m)) == null ? void 0 : b.systems) == null ? void 0 : _.find((L) => L.id === p);
    if (!I) {
      t(`System "${p}" was not found.`);
      return;
    }
    game.socket.emit(_e, { action: "notify", mapId: m, systemId: p, message: `New System Discovered: ${I.name}` }), i(`Discovery notification sent: ${I.name}.`);
  }
  async function S(m, { replace: p = !1 } = {}) {
    if (!r("import galaxy maps")) return null;
    const I = v();
    let b = Y(m);
    return I[b.id] && !p && (b = Y({ ...b, id: Te("map"), title: `${b.title} Import` })), I[b.id] = b, await w(I), u(b.id), i(`Imported ${b.title}.`), d(b);
  }
  function E(m) {
    if (!r("export galaxy maps")) return;
    const p = P(m);
    if (!p) {
      t(`Map "${m}" was not found.`);
      return;
    }
    zi(`${Bi(p.title)}.json`, Y(p));
  }
  const q = () => Object.values(v()).map(Y), A = (m, p) => d(Y(P(m)).systems.find((I) => I.id === String(p)) ?? null);
  function N(m, p) {
    const I = Y(P(m));
    for (const b of I.systems) {
      const _ = b.objects.find((L) => L.id === String(p));
      if (_) return { systemId: b.id, object: d(_) };
    }
    return null;
  }
  const J = (m, p) => {
    const I = Y(P(m)).systems.find((b) => b.id === String(p));
    return [...new Set((I == null ? void 0 : I.objects.flatMap((b) => b.sceneIds)) ?? [])];
  }, X = (m, p) => {
    var I;
    return [...((I = N(m, p)) == null ? void 0 : I.object.sceneIds) ?? []];
  };
  function se(m) {
    return q().flatMap((p) => p.systems.flatMap((I) => I.objects.filter((b) => b.sceneIds.includes(String(m))).map((b) => ({ mapId: p.id, mapTitle: p.title, systemId: I.id, systemName: I.name, object: d(b) }))));
  }
  function oe(m) {
    return q().flatMap((p) => p.systems.filter((I) => I.objects.some((b) => b.sceneIds.includes(String(m)))).map((I) => ({ mapId: p.id, mapTitle: p.title, system: d(I) })));
  }
  return {
    getMapStore: v,
    saveMapStore: w,
    getRawMap: P,
    createMap: $,
    updateMap: O,
    updateMapMetadata: C,
    deleteMap: D,
    duplicateMap: H,
    upsertSystem: Q,
    upsertObject: ce,
    savePlanetLocation: K,
    removePlanetLocation: j,
    unlinkPlanetScene: B,
    deleteObject: ne,
    moveObject: re,
    setPrimaryObject: ie,
    saveObjectPosition: te,
    setObjectVisibility: Se,
    deleteSystem: be,
    setCurrentSystem: Ie,
    setCurrentObject: xe,
    upsertRoute: R,
    deleteRoute: ge,
    upsertFaction: qe,
    deleteFaction: y,
    hideFactionFromPlayers: a,
    saveSystemPosition: h,
    revealSystemToPlayers: n,
    hideSystemFromPlayers: o,
    revealRouteToPlayers: l,
    hideRouteFromPlayers: s,
    notifySystemDiscovered: g,
    importMapData: S,
    exportMap: E,
    getMaps: q,
    getSystem: A,
    getObject: N,
    getSceneIdsForSystem: J,
    getSceneIdsForObject: X,
    getObjectsForScene: se,
    getSystemsForScene: oe,
    updateOpenPlanetLocations: U
  };
}
function vs(e) {
  const {
    getRawMap: t,
    setCurrentSystem: i,
    setCurrentObject: r,
    getOpenMapViews: u,
    getAppHtml: c,
    notifyInfo: f,
    notifyError: d,
    getActiveUsers: T,
    getPrimaryGM: v,
    isPrimaryGM: w
  } = e, P = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Set(), $ = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map();
  function C(y, G, a) {
    return y.routes.find((n) => n.fromSystemId === G && n.toSystemId === a || n.toSystemId === G && n.fromSystemId === a) ?? null;
  }
  function D(y, G) {
    const a = t(y);
    if (!a)
      return d(`Map "${y}" was not found.`), null;
    const n = Y(a), o = n.systems.find((S) => S.id === n.currentSystemId), l = n.systems.find((S) => S.id === G);
    if (!l)
      return d(`System "${G}" was not found.`), null;
    if (!o)
      return d("This map does not have a current location yet. Ask the GM to set one first."), null;
    if (o.id === l.id)
      return f(`${l.name} is already the current location.`), null;
    if (n.visibility !== "players" || o.visibility !== "players" || l.visibility !== "players")
      return d("That travel destination is not visible to players."), null;
    const s = C(n, o.id, l.id);
    if (!s || s.visibility !== "players")
      return d(`No player-visible direct route from ${o.name} to ${l.name}.`), null;
    const h = v();
    if (!h)
      return d("A GM must be online to approve player travel."), null;
    const g = yt(T(), game.user.id, h, n.travelApprovalMode);
    return {
      action: "travel-request",
      requestId: Te("travel"),
      mapId: y,
      mapTitle: n.title,
      fromSystemId: o.id,
      fromName: o.name,
      toSystemId: l.id,
      toName: l.name,
      routeId: s.id,
      routeType: s.type,
      travelTime: s.travelTime,
      fuelCost: s.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      ...g
    };
  }
  function H(y, G) {
    const a = D(y, G);
    return a ? (game.socket.emit(_e, a), f(`Travel request sent: ${a.fromName} to ${a.toName}.`), a) : null;
  }
  function Q(y, G, a) {
    const n = t(y);
    if (!n)
      return d(`Map "${y}" was not found.`), null;
    const o = Y(n), l = o.systems.find((q) => q.id === G), s = l == null ? void 0 : l.objects.find((q) => q.id === o.currentLocation.objectId), h = l == null ? void 0 : l.objects.find((q) => q.id === a);
    if (!l || o.currentLocation.systemId !== l.id || !s)
      return d("The current location is not inside this system."), null;
    if (!h)
      return d(`Destination "${a}" was not found.`), null;
    if (s.id === h.id)
      return f(`${h.name} is already the current location.`), null;
    if (o.visibility !== "players" || l.visibility !== "players" || Xe(l, s) !== "players" || Xe(l, h) !== "players")
      return d("That travel destination is not visible to players."), null;
    const g = C({ routes: l.routes }, s.id, h.id);
    if (!g || g.visibility !== "players")
      return d(`No player-visible direct route from ${s.name} to ${h.name}.`), null;
    const S = v();
    if (!S)
      return d("A GM must be online to approve player travel."), null;
    const E = yt(T(), game.user.id, S, o.travelApprovalMode);
    return {
      action: "travel-request",
      travelScope: "object",
      requestId: Te("travel"),
      mapId: y,
      mapTitle: o.title,
      systemId: l.id,
      fromObjectId: s.id,
      fromName: s.name,
      toObjectId: h.id,
      toName: h.name,
      routeId: g.id,
      routeType: g.type,
      travelTime: g.travelTime,
      fuelCost: g.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      ...E
    };
  }
  function ce(y, G, a) {
    const n = Q(y, G, a);
    return n ? (game.socket.emit(_e, n), f(`Travel request sent: ${n.fromName} to ${n.toName}.`), n) : null;
  }
  function ae(y, G) {
    var s, h;
    if (!G) return;
    O.set(y, G);
    const a = (s = $.get(y)) == null ? void 0 : s.root;
    if (!a) return;
    const n = a.querySelector("[data-travel-progress-count]"), o = a.querySelector("[data-travel-progress-pending]"), l = a.querySelector("[data-travel-progress-bar]");
    n && (n.textContent = `${G.acceptedCount} of ${G.requiredApprovals} approvals`), o && (o.textContent = (h = G.pendingNames) != null && h.length ? `Waiting for: ${G.pendingNames.join(", ")}` : "All votes received"), l && (l.style.width = `${Math.min(100, G.acceptedCount / Math.max(1, G.requiredApprovals) * 100)}%`);
  }
  function M(y) {
    var s, h, g, S;
    if (!(y != null && y.requestId) || y.requesterId === ((s = game.user) == null ? void 0 : s.id) || !((g = y.voterIds) != null && g.includes((h = game.user) == null ? void 0 : h.id)) || x.has(y.requestId)) return;
    x.add(y.requestId);
    let G = !1, a = !1, n = null;
    const o = (E) => {
      if (G) return;
      G = !0;
      const q = {
        action: "travel-vote",
        requestId: y.requestId,
        mapId: y.mapId,
        userId: game.user.id,
        userName: game.user.name,
        accepted: E
      };
      game.socket.emit(_e, q), xe(q);
    }, l = ((S = qt.find((E) => E.value === y.approvalMode)) == null ? void 0 : S.label) ?? "Unanimous agreement";
    n = new Dialog({
      title: "Travel Request",
      content: `<section class="gmf-travel-request">
        <p><strong>${Le(y.requesterName)}</strong> wants to travel on <strong>${Le(y.mapTitle)}</strong>.</p>
        <p>${Le(y.fromName)} &rarr; ${Le(y.toName)}</p>
        <p class="gmf-travel-request__meta">${Le(y.routeType)} route / ${Le(y.travelTime || "Unknown time")} / Fuel ${Le(y.fuelCost ?? 0)}</p>
        <p class="gmf-travel-request__mode"><i class="fa-solid fa-users"></i> ${Le(l)}</p>
        <div class="gmf-travel-progress" data-travel-progress aria-live="polite">
          <div class="gmf-travel-progress__bar"><span data-travel-progress-bar></span></div>
          <strong data-travel-progress-count>Waiting for vote status…</strong><span data-travel-progress-pending></span>
        </div></section>`,
      render: (E) => {
        const q = $n(E), A = $.get(y.requestId);
        A && (A.root = q), ae(y.requestId, O.get(y.requestId));
      },
      buttons: {
        accept: { icon: '<i class="fa-solid fa-check"></i>', label: "Accept", callback: () => o(!0) },
        decline: { icon: '<i class="fa-solid fa-xmark"></i>', label: "Decline", callback: () => o(!1) }
      },
      default: "accept",
      close: () => {
        $.delete(y.requestId), a || o(!1);
      }
    }, { classes: ["galaxy-map", "gmf-crud-dialog"], width: 420, height: Math.max(320, Math.min(440, window.innerHeight - 80)) }), $.set(y.requestId, { root: null, resolve: () => {
      a = !0, G = !0, n == null || n.close();
    } }), n.render(!0);
  }
  const U = (y) => {
    var G;
    return !!(y != null && y.coordinatorId && y.coordinatorId === ((G = v()) == null ? void 0 : G.id));
  };
  function K(y) {
    const G = Kt(y);
    return {
      action: "travel-progress",
      requestId: y.requestId,
      mapId: y.mapId,
      requesterId: y.requesterId,
      approvalMode: y.approvalMode,
      acceptedCount: G.acceptedCount,
      declinedCount: G.declinedCount,
      requiredApprovals: G.required,
      participantCount: y.participantCount,
      pendingNames: G.pendingIds.map((a) => {
        var n;
        return ((n = y.voterNames) == null ? void 0 : n[a]) || "Navigator";
      }),
      coordinatorId: game.user.id
    };
  }
  function j(y) {
    const G = K(y);
    return ae(y.requestId, G), game.socket.emit(_e, G), G;
  }
  function B(y) {
    var a, n, o;
    if (!(y != null && y.requestId) || !U(y)) return;
    const G = O.get(y.requestId);
    if (ae(y.requestId, y), y.requesterId === ((a = game.user) == null ? void 0 : a.id) && (!G || G.acceptedCount !== y.acceptedCount || G.declinedCount !== y.declinedCount)) {
      const l = (n = y.pendingNames) != null && n.length ? ` Waiting for ${y.pendingNames.join(", ")}.` : "";
      (o = ui.notifications) == null || o.info(`Travel vote: ${y.acceptedCount}/${y.requiredApprovals} approvals.${l}`);
    }
  }
  function ne(y) {
    if (!w() || !(y != null && y.requestId) || P.has(y.requestId)) return null;
    const G = t(y.mapId);
    if (!G) return null;
    const a = Y(G), n = T().find((X) => X.id === y.requesterId && !X.isGM), o = y.travelScope === "object", l = o ? a.systems.find((X) => X.id === y.systemId) : null, s = o ? l == null ? void 0 : l.objects.find((X) => X.id === a.currentLocation.objectId) : a.systems.find((X) => X.id === a.currentSystemId), h = o ? l == null ? void 0 : l.objects.find((X) => X.id === y.toObjectId) : a.systems.find((X) => X.id === y.toSystemId), g = s && h ? C(o ? { routes: (l == null ? void 0 : l.routes) ?? [] } : a, s.id, h.id) : null, S = o && (!l || a.currentLocation.systemId !== l.id || l.visibility !== "players" || Xe(l, s) !== "players" || Xe(l, h) !== "players"), E = !o && ((s == null ? void 0 : s.visibility) !== "players" || (h == null ? void 0 : h.visibility) !== "players");
    if (!n || a.visibility !== "players" || !s || !h || s.id === h.id || S || E || !g || g.visibility !== "players") return null;
    const q = v(), A = yt(T(), y.requesterId, q, a.travelApprovalMode), N = globalThis.setTimeout(() => {
      const X = P.get(y.requestId);
      X && Ie(X, { reason: "Travel request timed out." });
    }, Li), J = {
      action: "travel-ballot",
      requestId: String(y.requestId).slice(0, 80),
      mapId: a.id,
      mapTitle: a.title,
      travelScope: o ? "object" : "system",
      systemId: o ? l.id : "",
      fromSystemId: o ? l.id : s.id,
      fromObjectId: o ? s.id : "",
      fromName: s.name,
      toSystemId: o ? l.id : h.id,
      toObjectId: o ? h.id : "",
      toName: h.name,
      routeId: g.id,
      routeType: g.type,
      travelTime: g.travelTime,
      fuelCost: g.fuelCost,
      requesterId: n.id,
      requesterName: n.name,
      coordinatorId: game.user.id,
      ...A,
      accepted: /* @__PURE__ */ new Set(),
      declined: /* @__PURE__ */ new Set(),
      timeoutId: N
    };
    return P.set(y.requestId, J), j(J), J;
  }
  function re(y) {
    const G = Y(t(y.mapId)), a = y.travelScope === "object", n = a ? G.systems.find((s) => s.id === y.systemId) : null, o = a ? n == null ? void 0 : n.objects.find((s) => s.id === y.fromObjectId) : G.systems.find((s) => s.id === y.fromSystemId), l = a ? n == null ? void 0 : n.objects.find((s) => s.id === y.toObjectId) : G.systems.find((s) => s.id === y.toSystemId);
    !o || !l || u(y.mapId).forEach((s) => {
      var g;
      const h = c(s);
      if (h) {
        if (a) {
          if (s.activeSystemId !== n.id) return;
          s.selectedObjectId = l.id;
        } else s.selectedSystemId = l.id;
        s.selectedRouteId = null, (g = s._animateShipTravel) == null || g.call(s, o, l, h);
      }
    });
  }
  const ie = (y, G, a) => {
    var n;
    return game.socket.emit(
      _e,
      { action: "travel-animation", mapId: y, fromSystemId: G, toSystemId: a, coordinatorId: (n = game.user) == null ? void 0 : n.id }
    );
  }, te = (y, G, a, n) => {
    var o;
    return game.socket.emit(
      _e,
      { action: "travel-animation", travelScope: "object", mapId: y, systemId: G, fromObjectId: a, toObjectId: n, coordinatorId: (o = game.user) == null ? void 0 : o.id }
    );
  };
  function Se(y) {
    var G;
    P.delete(y.requestId), y.timeoutId && globalThis.clearTimeout(y.timeoutId), x.delete(y.requestId), (G = $.get(y.requestId)) == null || G.resolve(), $.delete(y.requestId), O.delete(y.requestId);
  }
  async function be(y) {
    Se(y);
    const G = {
      action: "travel-approved",
      requestId: y.requestId,
      mapId: y.mapId,
      travelScope: y.travelScope,
      systemId: y.systemId,
      fromSystemId: y.fromSystemId,
      toSystemId: y.toSystemId,
      fromObjectId: y.fromObjectId,
      toObjectId: y.toObjectId,
      fromName: y.fromName,
      toName: y.toName,
      coordinatorId: game.user.id
    };
    game.socket.emit(_e, G), re(G), f(`Travel approved: ${y.fromName} to ${y.toName}.`), globalThis.setTimeout(() => {
      y.travelScope === "object" ? r(y.mapId, y.systemId, y.toObjectId) : i(y.mapId, y.toSystemId);
    }, jt);
  }
  function Ie(y, { voterName: G = "", reason: a = "" } = {}) {
    Se(y);
    const n = a || `${G || "A participant"} declined the request.`, o = {
      action: "travel-declined",
      requestId: y.requestId,
      mapId: y.mapId,
      fromName: y.fromName,
      toName: y.toName,
      voterName: G,
      reason: n,
      coordinatorId: game.user.id
    };
    game.socket.emit(_e, o), f(`Travel cancelled: ${n}`);
  }
  function xe(y) {
    if (!w() || !(y != null && y.requestId)) return;
    const G = P.get(y.requestId);
    if (!G || !G.voterIds.includes(y.userId) || G.accepted.has(y.userId) || G.declined.has(y.userId)) return;
    y.accepted ? G.accepted.add(y.userId) : G.declined.add(y.userId);
    const a = Kt(G);
    j(G), a.outcome === "approved" ? be(G) : a.outcome === "declined" && Ie(G, {
      voterName: y.userName,
      reason: G.approvalMode === "unanimous" ? `${y.userName || "A participant"} declined the unanimous request.` : "The remaining votes cannot reach a majority."
    });
  }
  function R(y) {
    var G;
    y.requestId && x.delete(y.requestId), (G = $.get(y.requestId)) == null || G.resolve(), $.delete(y.requestId), O.delete(y.requestId);
  }
  function ge(y) {
    var G, a;
    !U(y) || y.coordinatorId === ((G = game.user) == null ? void 0 : G.id) || (R(y), re(y), (a = ui.notifications) == null || a.info(`Travel approved: ${y.fromName} to ${y.toName}.`));
  }
  function qe(y) {
    var G, a;
    !U(y) || y.coordinatorId === ((G = game.user) == null ? void 0 : G.id) || (R(y), (a = ui.notifications) == null || a.warn(`Travel cancelled: ${y.reason || `${y.voterName || "A participant"} declined.`}`));
  }
  return {
    getTravelRoute: C,
    requestTravelToSystem: H,
    requestTravelToObject: ce,
    promptForTravelRequest: M,
    isPrimaryGMMessage: U,
    handleTravelProgress: B,
    trackTravelRequest: ne,
    animateTravelOnOpenMaps: re,
    broadcastTravelAnimation: ie,
    broadcastObjectTravelAnimation: te,
    handleTravelVote: xe,
    handleTravelApproved: ge,
    handleTravelDeclined: qe
  };
}
function Is(e) {
  return `
    <div class="gmf-texture-guide" data-texture-guide data-shape="${Le(e)}">
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
          ${Array.from({ length: 4 }, (t, i) => `<span class="is-face-${i + 1}">Side ${i + 1}<br>upper</span>`).join("")}
          ${Array.from({ length: 4 }, (t, i) => `<span class="is-face-${i + 5}">Side ${i + 1}<br>lower</span>`).join("")}
          <i class="gmf-uv-grid-label is-columns">4 columns · 512px each</i>
        </div>
        <figcaption><strong>2048×1024 · 2:1</strong> Divide the image into four 512×512 columns. Each column is one continuous crystal side: its upper triangle sits directly above its matching lower triangle.</figcaption>
      </figure>
    </div>
  `;
}
let Fe = null;
const Je = /* @__PURE__ */ new Map();
let de = null, Qe = null;
function un(e) {
  return foundry.utils.deepClone(e);
}
function He(e) {
  var t;
  (t = ui.notifications) == null || t.error(`[Galaxy Map] ${e}`);
}
function Ze(e) {
  var t;
  (t = ui.notifications) == null || t.info(`[Galaxy Map] ${e}`);
}
function $t(e = "change galaxy maps") {
  var t;
  return (t = game.user) != null && t.isGM ? !0 : (He(`Only a GM can ${e}.`), !1);
}
function Bn() {
  return game.users.filter((e) => e.active);
}
function zn() {
  return Bn().filter((e) => e.isGM).sort((e, t) => String(e.id).localeCompare(String(t.id)))[0] ?? null;
}
function Hn() {
  var e, t;
  return !!((e = game.user) != null && e.isGM && ((t = zn()) == null ? void 0 : t.id) === game.user.id);
}
const {
  getMapStore: mn,
  saveMapStore: fn,
  getRawMap: ot,
  createMap: Vn,
  updateMap: ws,
  updateMapMetadata: Un,
  deleteMap: Yn,
  duplicateMap: Xn,
  upsertSystem: Wn,
  upsertObject: Jn,
  savePlanetLocation: Zn,
  removePlanetLocation: Kn,
  unlinkPlanetScene: Qn,
  deleteObject: Nt,
  moveObject: Ms,
  setPrimaryObject: Ps,
  saveObjectPosition: ei,
  setObjectVisibility: ti,
  deleteSystem: Dt,
  setCurrentSystem: Gt,
  setCurrentObject: Bt,
  upsertRoute: ni,
  deleteRoute: zt,
  upsertFaction: ii,
  deleteFaction: Ht,
  hideFactionFromPlayers: si,
  saveSystemPosition: ai,
  revealSystemToPlayers: ri,
  hideSystemFromPlayers: Vt,
  revealRouteToPlayers: oi,
  hideRouteFromPlayers: Ut,
  importMapData: ci,
  exportMap: Yt,
  getMaps: ht,
  getSystem: Es,
  getObject: _s,
  getSceneIdsForSystem: Ls,
  getSceneIdsForObject: Ts,
  getObjectsForScene: xs,
  getSystemsForScene: qs,
  updateOpenPlanetLocations: ks
} = bs({ notifyError: He, notifyInfo: Ze, requireGM: $t, refreshOpenApps: at, closeOpenMap: zs, getOpenMapViews: Xt });
function li(e) {
  var i;
  const t = di(e);
  return ((i = t == null ? void 0 : t.closest) == null ? void 0 : i.call(t, ".window-app, .application, .app")) ?? t;
}
function Os(e) {
  return e.map((t) => {
    var u, c;
    const i = li(t);
    if (!i) return null;
    const r = Number.parseInt(((c = (u = globalThis.getComputedStyle) == null ? void 0 : u.call(globalThis, i)) == null ? void 0 : c.zIndex) ?? "", 10);
    return { app: t, zIndex: i.style.zIndex || (Number.isFinite(r) ? String(r) : "") };
  }).filter(Boolean);
}
function vt(e) {
  for (const t of e) {
    const i = li(t.app);
    !(i != null && i.isConnected) || !t.zIndex || (i.style.zIndex = t.zIndex);
  }
}
async function at(e = null) {
  var c;
  const t = [...Je.entries()].filter(([f, d]) => (d == null ? void 0 : d.rendered) && (!e || f === e)).map(([, f]) => f);
  de != null && de.rendered && (!e || de.mapId === e) && t.push(de);
  const i = [Fe != null && Fe.rendered ? Fe : null, ...t].filter(Boolean), r = Os(i), u = i.map((f) => Promise.resolve(f.render({ force: !0 })));
  vt(r), await Promise.allSettled(u), vt(r), (c = globalThis.requestAnimationFrame) == null || c.call(globalThis, () => vt(r));
}
function Xt(e) {
  const t = [...Je.values()];
  return de && t.push(de), t.filter((i) => (i == null ? void 0 : i.rendered) && i.mapId === e);
}
function di(e) {
  return e.element ?? null;
}
const {
  getTravelRoute: Cs,
  requestTravelToSystem: mi,
  requestTravelToObject: fi,
  promptForTravelRequest: pn,
  isPrimaryGMMessage: As,
  handleTravelProgress: js,
  trackTravelRequest: Rs,
  animateTravelOnOpenMaps: Fs,
  broadcastTravelAnimation: $s,
  broadcastObjectTravelAnimation: Ns,
  handleTravelVote: Ds,
  handleTravelApproved: Gs,
  handleTravelDeclined: Bs
} = vs({
  getRawMap: ot,
  setCurrentSystem: Gt,
  setCurrentObject: Bt,
  getOpenMapViews: Xt,
  getAppHtml: di,
  notifyInfo: Ze,
  notifyError: He,
  getActiveUsers: Bn,
  getPrimaryGM: zn,
  isPrimaryGM: Hn
});
function zs(e) {
  const t = Je.get(e);
  t && t.close(), (de == null ? void 0 : de.mapId) === e && de.close();
}
function Ve(e, t = {}) {
  var d;
  const i = ot(e);
  if (!i)
    return He(`Map "${e}" was not found.`), null;
  const r = !((d = game.user) != null && d.isGM) || t.playerMode === !0;
  if (r && i.visibility !== "players" && !t.broadcast)
    return He("That galaxy map is not visible to players."), null;
  const u = r ? `player:${e}` : e, c = r && (de == null ? void 0 : de.mapId) === e ? de : Je.get(u);
  if (c != null && c.rendered)
    return c.bringToFront(), c;
  const f = new Js({ mapId: e, playerMode: r });
  return r ? de = f : Je.set(u, f), f.render({ force: !0 }), f;
}
async function Hs(e, t, i = {}) {
  var u;
  if (!e || !t) return !1;
  const r = Ve(e, {
    playerMode: i.playerMode ?? !((u = game.user) != null && u.isGM),
    broadcast: i.broadcast === !0
  });
  return r != null && r.focusSystem ? r.focusSystem(t, i) : !1;
}
async function Vs(e, t = {}, i = {}) {
  var f, d;
  const r = String(t.systemId || ""), u = String(t.objectId || "");
  if (!e || !r) return !1;
  const c = Ve(e, { playerMode: i.playerMode ?? !((f = game.user) != null && f.isGM), broadcast: i.broadcast === !0 });
  return c ? u && c.focusLocation ? c.focusLocation(r, u, i) : (d = c.focusSystem) == null ? void 0 : d.call(c, r, i) : !1;
}
function Us(e, t = "") {
  var r;
  let i = !1;
  for (const u of Xt(e))
    i = ((r = u.clearSystemFocus) == null ? void 0 : r.call(u, t)) || i;
  return i;
}
function Wt() {
  return $t("open the map manager") ? (Fe || (Fe = new Xs()), Fe.render({ force: !0 }), Fe) : null;
}
function Jt() {
  const e = pi();
  return e.length ? e.length === 1 ? Ve(e[0].id, { playerMode: !0 }) : (Qe || (Qe = new Ws()), Qe.render({ force: !0 }), Qe) : (Ze("No galaxy map is currently visible to players."), null);
}
function pi() {
  return ht().filter((e) => e.visibility === "players").sort((e, t) => e.title.localeCompare(t.title));
}
function Ys() {
  var t;
  const e = ht().sort((i, r) => i.title.localeCompare(r.title));
  return (t = game.user) != null && t.isGM ? e.length === 1 ? Ve(e[0].id) : Wt() : Jt();
}
function hi(e) {
  if ($t("broadcast galaxy maps")) {
    if (!ot(e)) {
      He(`Map "${e}" was not found.`);
      return;
    }
    game.socket.emit(_e, { action: "open", mapId: e }), Ze("Map broadcast sent to players.");
  }
}
const Xs = Vi({
  templateRoot: Oe,
  getMaps: ht,
  prepareMapForManager: gs,
  getRawMap: ot,
  importMapData: ci,
  exportMap: Yt,
  duplicateMap: Xn,
  deleteMap: Yn,
  createMap: Vn,
  deleteSystem: Dt,
  deleteObject: Nt,
  deleteRoute: zt,
  deleteFaction: Ht,
  openMap: Ve,
  showMapToPlayers: hi,
  hideSystemFromPlayers: Vt,
  hideRouteFromPlayers: Ut,
  hideFactionFromPlayers: si,
  notifyError: He,
  clearManagerApp: (e) => {
    Fe === e && (Fe = null);
  }
}), Ws = us({
  templateRoot: Oe,
  getVisibleMaps: pi,
  openMap: Ve,
  clearChooser: (e) => {
    Qe === e && (Qe = null);
  }
}), Js = ds({
  templateRoot: Oe,
  getRawMap: ot,
  prepareMapForDisplay: ys,
  upsertSystem: Wn,
  upsertObject: Jn,
  upsertRoute: ni,
  upsertFaction: ii,
  updateMapMetadata: Un,
  deleteFaction: Ht,
  getTextureGuideMarkup: Is,
  activateObjectEditorControls: Ss,
  revealSystemToPlayers: ri,
  revealRouteToPlayers: oi,
  hideSystemFromPlayers: Vt,
  setObjectVisibility: ti,
  hideRouteFromPlayers: Ut,
  deleteSystem: Dt,
  deleteObject: Nt,
  deleteRoute: zt,
  setCurrentSystem: Gt,
  setCurrentObject: Bt,
  requestTravelToSystem: mi,
  requestTravelToObject: fi,
  exportMap: Yt,
  getTravelRoute: Cs,
  broadcastTravelAnimation: $s,
  broadcastObjectTravelAnimation: Ns,
  notifyInfo: Ze,
  notifyError: He,
  saveSystemPosition: ai,
  saveObjectPosition: ei,
  savePlanetLocation: Zn,
  removePlanetLocation: Kn,
  unlinkPlanetScene: Qn,
  clearMapView: (e) => {
    e.playerMode && de === e && (de = null);
    for (const [t, i] of Je.entries())
      i === e && Je.delete(t);
  }
});
function Zs() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    brandingInApp: !0,
    id: he,
    title: "Galaxy Map",
    icon: "fa-solid fa-route",
    premium: !1,
    description: "Open cinematic campaign maps and navigation charts.",
    open: () => {
      var i;
      return (i = game.user) != null && i.isGM ? Wt() : Jt();
    }
  }), !0) : !1;
}
Hooks.once("init", async () => {
  game.settings.register(he, Rn, {
    name: "Enable Factions",
    hint: "Show faction controls, ratings, and territories on galaxy maps. Turning this off keeps existing faction data.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0,
    requiresReload: !0,
    onChange: () => at()
  });
  for (const e of ["reputation", "prominence"]) {
    const { setting: t, title: i, icon: r, labelsSetting: u, percentagesSetting: c } = nt[e];
    for (const [f, d, T] of [[u, "Labels", !0], [c, "Percentages", !1]])
      game.settings.register(he, f, {
        name: `Show ${i} ${d}`,
        hint: T ? `Show the named rating in the ${i} tab.` : `Show a bar and numeric percentage in the ${i} tab.`,
        scope: "world",
        config: Re(),
        type: Boolean,
        default: T,
        onChange: () => at()
      });
    game.settings.register(he, t, {
      scope: "world",
      config: !1,
      type: Object,
      default: { ratings: Fn(e) },
      onChange: () => at()
    }), Re() && game.settings.registerMenu(he, `faction${i}`, {
      name: `Faction ${i}`,
      label: `Edit ${i} Ratings`,
      hint: `Rename, add, or remove the ${e} ratings available on galaxy maps in this world.`,
      icon: r,
      type: ms(Oe, e),
      restricted: !0
    });
  }
  game.settings.register(he, _t, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(he, ut, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(he, Lt, {
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  }), Handlebars.registerHelper("gmfEq", (e, t) => e === t), Handlebars.registerHelper("gmfJson", (e) => JSON.stringify(e, null, 2)), Handlebars.registerHelper("gmfPercent", (e) => `${Number(e).toFixed(3)}%`), Handlebars.registerHelper("gmfFallback", (e, t) => e || t), Hooks.on("renderDialog", (e, t) => {
    var u, c;
    const i = $n(t), r = ((u = i == null ? void 0 : i.closest) == null ? void 0 : u.call(i, ".window-app, .application, .app")) ?? i;
    (c = r == null ? void 0 : r.classList) != null && c.contains("galaxy-map") && $i(e, t);
  }), await loadTemplates([
    `${Oe}/map-manager.hbs`,
    `${Oe}/galaxy-map.hbs`,
    `${Oe}/map-context-menu.hbs`,
    `${Oe}/celestial-icon.hbs`,
    `${Oe}/object-appearance-panel.hbs`,
    `${Oe}/system-details.hbs`,
    `${Oe}/faction-panel.hbs`,
    `${Oe}/player-map-chooser.hbs`
  ]);
});
Hooks.once("ready", async () => {
  game.galaxyMap = {
    openMap: Ve,
    focusSystem: Hs,
    focusLocation: Vs,
    clearSystemFocus: Us,
    openMapManager: Wt,
    openGalaxyMapFromSceneControls: Ys,
    openPlayerMapChooser: Jt,
    createMap: Vn,
    getMaps: ht,
    getSystem: Es,
    getObject: _s,
    getSceneIdsForSystem: Ls,
    getSystemsForScene: qs,
    getSceneIdsForObject: Ts,
    getObjectsForScene: xs,
    showMapToPlayers: hi,
    updateMap: ws,
    updateMapMetadata: Un,
    deleteMap: Yn,
    duplicateMap: Xn,
    upsertSystem: Wn,
    deleteSystem: Dt,
    upsertObject: Jn,
    deleteObject: Nt,
    moveObject: Ms,
    setPrimaryObject: Ps,
    upsertRoute: ni,
    deleteRoute: zt,
    upsertFaction: ii,
    deleteFaction: Ht,
    saveSystemPosition: ai,
    saveObjectPosition: ei,
    savePlanetLocation: Zn,
    removePlanetLocation: Kn,
    unlinkPlanetScene: Qn,
    setCurrentSystem: Gt,
    setCurrentObject: Bt,
    revealSystemToPlayers: ri,
    revealRouteToPlayers: oi,
    hideSystemFromPlayers: Vt,
    setObjectVisibility: ti,
    hideRouteFromPlayers: Ut,
    hideFactionFromPlayers: si,
    requestTravelToSystem: mi,
    requestTravelToObject: fi,
    importMapData: ci,
    exportMap: Yt
  };
  const e = game.modules.get(he);
  if (e && (e.api = game.galaxyMap), Zs(), Hn()) {
    const t = mn();
    if (Object.values(t).some((r) => Number((r == null ? void 0 : r.schemaVersion) || 1) < De)) {
      const r = un(game.settings.get(he, ut) ?? {});
      Object.keys(r).length || await game.settings.set(he, ut, t);
      const u = Object.fromEntries(Object.entries(t).map(([c, f]) => [c, Y(f)]));
      await fn(u), Ze('Your galaxy maps were updated to the new format. Everything from the old single map is now inside a system called "System 1", and a backup of the old data was kept.');
    }
    if (!game.settings.get(he, Lt)) {
      const r = un(game.settings.get(he, ut) ?? {}), u = mn();
      let c = 0;
      for (const [f, d] of Object.entries(r)) {
        if (!u[f]) continue;
        const T = Y(u[f]);
        for (const v of (d == null ? void 0 : d.systems) ?? []) {
          const w = Tn(v == null ? void 0 : v.planetLocations);
          if (!w.length) continue;
          const P = T.systems.flatMap((x) => x.objects).find((x) => x.id === v.id || x.id === `${v.id}-object`);
          !P || P.planetLocations.length || (P.planetLocations = w.filter((x) => P.sceneIds.includes(x.sceneId)), c += P.planetLocations.length);
        }
        u[f] = Y(T);
      }
      c && (await fn(u), Ze(`Restored ${c} surface location${c === 1 ? "" : "s"} that went missing in an earlier update.`)), await game.settings.set(he, Lt, !0);
    }
  }
  game.socket.on(_e, (t = {}) => {
    var i, r, u, c, f;
    if (t.action === "travel-request") {
      const d = Rs(t);
      d && (game.socket.emit(_e, d), pn(d));
      return;
    }
    if (t.action === "travel-ballot") {
      As(t) && t.coordinatorId !== ((i = game.user) == null ? void 0 : i.id) && pn(t);
      return;
    }
    if (t.action === "travel-vote") {
      Ds(t);
      return;
    }
    if (t.action === "travel-progress") {
      js(t);
      return;
    }
    if (t.action === "travel-approved") {
      Gs(t);
      return;
    }
    if (t.action === "travel-declined") {
      Bs(t);
      return;
    }
    if (t.action === "travel-animation") {
      t.coordinatorId !== ((r = game.user) == null ? void 0 : r.id) && Fs(t);
      return;
    }
    if (t.action === "planet-locations") {
      ks(t.mapId, t.systemId, t.objectId);
      return;
    }
    if (t.action === "refresh") {
      (u = game.user) != null && u.isGM ? at(t.mapId) : (de == null ? void 0 : de.mapId) === t.mapId && de.render({ force: !0 });
      return;
    }
    (c = game.user) != null && c.isGM || (t.action === "open" && t.mapId && (de == null || de.close(), Ve(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "notify" && ((f = ui.notifications) == null || f.info(t.message || "New system discovered."), (de == null ? void 0 : de.mapId) === t.mapId && de.render({ force: !0 })));
  }), console.log(`${he} | Ready. API available at game.galaxyMap.`);
});
