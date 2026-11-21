var gi = Object.defineProperty;
var Si = (e, t, i) => t in e ? gi(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var J = (e, t, i) => Si(e, typeof t != "symbol" ? t + "" : t, i);
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
], bi = [
  { value: "sphere", label: "Sphere" },
  { value: "cube", label: "Cube" },
  { value: "donut", label: "Donut" },
  { value: "asteroid", label: "Asteroid" },
  { value: "crystal", label: "Crystal" },
  { value: "cylinder", label: "Cylinder" }
], vi = [
  { value: "smooth", label: "Smooth" },
  { value: "matte", label: "Matte" },
  { value: "holographic", label: "Holographic" }
];
function mt(e) {
  return bi.some((t) => t.value === e) ? String(e) : "sphere";
}
function yn(e) {
  return vi.some((t) => t.value === e) ? String(e) : "smooth";
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
function Ii(e) {
  return e === "black-hole";
}
function Ne(e, t = "") {
  if (!e || e.obscured || e.planetPreset === "none") return null;
  const i = xt(e.planetPreset), r = it.find((p) => p.value === t) ?? it.find((p) => p.value === i) ?? it[0], u = !t && i === "custom" && !!e.planetTexture, c = !t && i === "color";
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
  const u = kt(r), c = [...new Map((e ?? []).filter((P) => P == null ? void 0 : P.id).map((P) => [String(P.id), P])).values()], p = u === "gm" ? i != null && i.id ? [i] : [] : c.filter((P) => String(P.id) !== String(t)), d = p.map((P) => String(P.id)), T = Object.fromEntries(p.map((P) => [String(P.id), String(P.name || "Navigator").slice(0, 80)])), v = d.length + (u === "gm" ? 0 : 1), M = u === "gm" ? 1 : u === "majority" ? Math.floor(v / 2) + 1 : v;
  return { approvalMode: u, voterIds: d, voterNames: T, participantCount: v, requiredApprovals: M };
}
function Kt(e) {
  const t = kt(e == null ? void 0 : e.approvalMode), i = [...new Set(((e == null ? void 0 : e.voterIds) ?? []).map((M) => String(M)))], r = new Set([...(e == null ? void 0 : e.accepted) ?? []].map((M) => String(M))), u = new Set([...(e == null ? void 0 : e.declined) ?? []].map((M) => String(M))), c = t === "gm" ? 0 : 1, p = Math.max(1, Number(e == null ? void 0 : e.requiredApprovals) || (t === "unanimous" ? i.length + 1 : 1)), d = c + i.filter((M) => r.has(M)).length, T = i.filter((M) => u.has(M)).length, v = i.filter((M) => !r.has(M) && !u.has(M));
  return d >= p ? { outcome: "approved", acceptedCount: d, declinedCount: T, required: p, pendingIds: v } : t === "unanimous" && T > 0 ? { outcome: "declined", acceptedCount: d, declinedCount: T, required: p, pendingIds: v } : d + v.length < p ? { outcome: "declined", acceptedCount: d, declinedCount: T, required: p, pendingIds: v } : { outcome: "pending", acceptedCount: d, declinedCount: T, required: p, pendingIds: v };
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
function wi(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of Array.isArray(e) ? e : [])
    typeof (i == null ? void 0 : i.id) != "string" || !i.id || t.has(i.id) || t.set(i.id, { id: i.id, radius: tt(i.radius ?? 15, 15, 1, 100) });
  return [...t.values()];
}
function Mi(e) {
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
function At(e, t, i) {
  const r = new Map(e.map((u) => [u.id, u]));
  return In(r, t, i);
}
function In(e, t, i) {
  var p;
  const r = e.get(i.centerId);
  if (!((p = r == null ? void 0 : r.orbits) != null && p.some((d) => d.id === i.orbitId))) return !1;
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
  function p(d) {
    var M;
    if (c.has(d.id) || (c.add(d.id), !d.orbit)) return;
    const T = i.get(d.orbit.centerId), v = (M = T == null ? void 0 : T.orbits) == null ? void 0 : M.find((P) => {
      var x;
      return P.id === ((x = d.orbit) == null ? void 0 : x.orbitId);
    });
    if (T && v && In(i, d.id, d.orbit) && (p(T), !u.has(T.id) && !t.has(T.id))) {
      t.has(d.id) || r.set(d.id, { orbit: v, attachment: d.orbit });
      return;
    }
    u.add(d.id);
  }
  return e.forEach(p), {
    attachments: r,
    rings: e.flatMap((d) => u.has(d.id) || t.has(d.id) ? [] : (d.orbits ?? []).map((T) => ({ centerId: d.id, ...T }))),
    animated: [...r.values()].some(({ attachment: d }) => d.period > 0),
    positions(d, T, v = !0, M) {
      const P = /* @__PURE__ */ new Map();
      function x(H) {
        const B = P.get(H.id);
        if (B) return B;
        const R = r.get(H.id), A = (M == null ? void 0 : M.id) === H.id ? M.point : H;
        let D = { x: A.x, y: A.y };
        if (R) {
          const U = x(i.get(R.attachment.centerId)), ee = ((M == null ? void 0 : M.id) === H.id ? M.angle ?? Pn(A, U, d) : wn(R.attachment, T, v)) * Math.PI / 180, w = Mn(R.orbit.radius, d);
          D = { x: U.x + w.x * Math.cos(ee), y: U.y + w.y * Math.sin(ee) };
        }
        return P.set(H.id, D), D;
      }
      return e.forEach(x), P;
    }
  };
}
function gt(e, t) {
  t && (e.x = tt(t.x, e.x, 0, 100), e.y = tt(t.y, e.y, 0, 100)), delete e.orbit;
}
const De = 3, Pi = ["core", "colony", "frontier", "ruins", "restricted", "unknown"], Ei = ["star", "planet", "moon", "station", "asteroid", "anomaly", "black-hole", "other"], En = ["undiscovered", "known", "visited", "danger", "locked"], _i = ["safe", "dangerous", "restricted", "smuggler", "unknown"], wt = ["gm", "players"], _n = ["inherit", ...wt], Li = [
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
], Ct = Li.map((e) => e.value), Mt = Ct, St = 0.2, bt = 10, jt = 2400, Ti = 6e4;
function Te(e = "gmf") {
  return `${e}-${foundry.utils.randomID(10)}`;
}
function rt(e, t = "players") {
  const i = wt.includes(t) ? t : "players";
  return wt.includes(e) ? e : i;
}
function xi(e) {
  return _n.includes(e) ? String(e) : "inherit";
}
function qi(e) {
  return typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "#58d8ff";
}
function Pt(e) {
  return typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "";
}
function Ae(e, t = 0) {
  const i = Number(e);
  return Number.isFinite(i) ? i : t;
}
function ki(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  return [...new Set(t.map((i) => String(i).trim()).filter(Boolean))];
}
function pe(e, t, i) {
  return Math.min(i, Math.max(t, e));
}
function Qt(e, t) {
  return !Array.isArray(e) || e.length < 3 ? [...t] : e.slice(0, 3).map((i, r) => pe(Ae(i, t[r]), -2.5, 2.5));
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
  return Ei.includes(e.kind) ? e.kind : e.type === "station" || e.iconStyle === "station" ? "station" : e.type === "anomaly" ? "anomaly" : e.iconStyle === "star" ? "star" : e.iconStyle === "black-hole" ? "black-hole" : e.planetShape === "asteroid" ? "asteroid" : ["planet", "terrestrial", "gas-giant", "ice-world", "volcanic", "artificial", "ringed"].includes(e.iconStyle) ? "planet" : "other";
}
function Et(e = {}) {
  const t = ki(e.sceneIds === void 0 ? e.sceneId : e.sceneIds), i = String(e.planetTexture || "").trim(), r = mt(e.planetShape), u = xt(e.planetPreset), c = bn(u, r), p = i && !["none", "color"].includes(c) ? "custom" : c, d = xn(e), T = wi(e.orbits), v = Mi(e.orbit);
  return {
    id: String(e.id || Te("object")),
    name: String(e.name || "Unnamed Object"),
    kind: d,
    x: pe(Ae(e.x, 50), 0, 100),
    y: pe(Ae(e.y, 50), 0, 100),
    status: En.includes(e.status) ? e.status : "known",
    visibility: xi(e.visibility),
    factionId: String(e.factionId || ""),
    description: String(e.description || ""),
    image: String(e.image || ""),
    sceneIds: t,
    planetLocations: Tn(e.planetLocations).filter((P) => t.includes(P.sceneId)),
    journalId: String(e.journalId || ""),
    notes: String(e.notes || "").trim(),
    iconColor: Pt(e.iconColor),
    iconSize: pe(Ae(e.iconSize, 28), 18, 56),
    markerImage: String(e.markerImage || "").trim(),
    iconStyle: Ct.includes(e.iconStyle) ? e.iconStyle : d === "star" ? "star" : d === "station" ? "station" : "planet",
    pulse: e.pulse !== !1,
    planetPreset: p,
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
  const t = Array.isArray(e.objects) ? e.objects.map(Et) : [], i = t.filter((v) => v.orbit && !At(t, v.id, v.orbit));
  for (const v of i) delete v.orbit;
  const r = new Set(t.map((v) => v.id)), u = (Array.isArray(e.routes) ? e.routes : []).map(Rt).filter((v) => v.fromSystemId !== v.toSystemId && r.has(v.fromSystemId) && r.has(v.toSystemId)), c = t.some((v) => v.id === e.primaryObjectId) ? String(e.primaryObjectId) : ((T = t[0]) == null ? void 0 : T.id) ?? "", p = t.find((v) => v.id === c) ?? Et(e), d = {
    id: String(e.id || Te("system")),
    name: String(e.name || "Unnamed System"),
    x: pe(Ae(e.x, 50), 0, 100),
    y: pe(Ae(e.y, 50), 0, 100),
    type: Pi.includes(e.type) ? e.type : "unknown",
    factionId: String(e.factionId || ""),
    status: En.includes(e.status) ? e.status : "known",
    description: String(e.description || ""),
    visibility: rt(e.visibility, "players"),
    notes: String(e.notes || "").trim(),
    backgroundImage: String(e.backgroundImage || "").trim(),
    iconColor: Pt(e.iconColor),
    iconSize: pe(Ae(e.iconSize, 30), 18, 56),
    markerImage: String(e.markerImage || "").trim(),
    iconStyle: Ct.includes(e.iconStyle) ? e.iconStyle : "star",
    pulse: e.pulse !== !1,
    primaryObjectId: c,
    objects: t,
    routes: u
  };
  for (const [v, M] of Object.entries({
    image: p.image,
    sceneIds: [...p.sceneIds],
    planetLocations: [...p.planetLocations],
    journalId: p.journalId,
    planetPreset: p.planetPreset,
    planetShape: p.planetShape,
    planetFinish: p.planetFinish,
    planetTexture: p.planetTexture,
    planetColor: p.planetColor
  })) Object.defineProperty(d, v, { value: M, enumerable: !1, configurable: !0 });
  return d;
}
function Rt(e = {}) {
  return {
    id: String(e.id || Te("route")),
    fromSystemId: String(e.fromSystemId || ""),
    toSystemId: String(e.toSystemId || ""),
    type: _i.includes(e.type) ? e.type : "unknown",
    travelTime: String(e.travelTime || ""),
    fuelCost: Ae(e.fuelCost, 0),
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
    color: qi(e.color),
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
function Oi(e = {}) {
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
  var p;
  const c = t.some((d) => d.id === i) ? i : ((p = t[0]) == null ? void 0 : p.id) ?? "";
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
function Ai(e, t) {
  var p;
  const r = (Array.isArray(e.systems) ? e.systems : []).map(Oi), u = String(e.currentSystemId || ((p = r[0]) == null ? void 0 : p.id) || ""), c = On(e, r, u, Ft(e), Array.isArray(e.routes) ? e.routes : []);
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
  var ee, w, Y, te;
  const t = Array.isArray(e.systems) ? e.systems : [], i = t.filter(tn), r = t.filter((C) => !tn(C));
  if (!i.length && t.length) return { ...e, schemaVersion: De };
  const u = new Set(r.map((C) => String(C.id)));
  let c = Ft(e);
  u.has(c) && (c = `${c}-legacy`);
  const p = new Set(i.map((C) => String(C.id))), d = new Map(i.map((C) => [String(C.id), String(C.primaryObjectId)])), T = i.flatMap((C) => (C.objects ?? []).map((G) => {
    const se = G.id === C.primaryObjectId;
    return {
      ...G,
      x: se ? C.x : G.x,
      y: se ? C.y : G.y,
      visibility: G.visibility === "inherit" ? C.visibility : G.visibility,
      factionId: G.factionId || C.factionId || ""
    };
  })), v = String(((ee = e.currentLocation) == null ? void 0 : ee.systemId) || e.currentSystemId || ""), M = i.find((C) => C.id === v), P = String(((w = e.currentLocation) == null ? void 0 : w.objectId) || (M == null ? void 0 : M.primaryObjectId) || ((Y = T[0]) == null ? void 0 : Y.id) || ""), x = Array.isArray(e.routes) ? e.routes : [], H = x.filter((C) => p.has(String(C.fromSystemId)) && p.has(String(C.toSystemId))).map((C) => ({ ...C, fromSystemId: d.get(String(C.fromSystemId)), toSystemId: d.get(String(C.toSystemId)) })), B = On(e, T, P, c, H), R = [B, ...r], A = new Set(R.map((C) => String(C.id))), D = /* @__PURE__ */ new Set(), U = x.filter((C) => !(p.has(String(C.fromSystemId)) && p.has(String(C.toSystemId)))).map((C) => ({
    ...C,
    fromSystemId: p.has(String(C.fromSystemId)) ? c : C.fromSystemId,
    toSystemId: p.has(String(C.toSystemId)) ? c : C.toSystemId
  })).filter((C) => {
    if (C.fromSystemId === C.toSystemId || !A.has(String(C.fromSystemId)) || !A.has(String(C.toSystemId))) return !1;
    const G = [C.fromSystemId, C.toSystemId].sort().join(":");
    return D.has(G) ? !1 : (D.add(G), !0);
  }), Q = p.has(v) || !A.has(v) ? c : v;
  return {
    ...e,
    schemaVersion: De,
    migratedFromSchema: 2,
    systems: R,
    routes: U,
    currentLocation: { systemId: Q, objectId: Q === c ? B.primaryObjectId : ((te = e.currentLocation) == null ? void 0 : te.objectId) ?? "" },
    currentSystemId: Q
  };
}
function ji(e = {}) {
  const t = Number(e.schemaVersion) || 1;
  if (t > De) throw new Error(`Galaxy Map schema ${t} is newer than supported schema ${De}.`);
  return t >= De ? { ...e, schemaVersion: De } : t < 2 ? Ai(e, t) : Ci(e);
}
function X(e = {}) {
  var x, H, B, R;
  const t = ji(e), i = Array.isArray(t.systems) ? t.systems.map(qn) : [], r = Array.isArray(t.routes) ? t.routes.map(Rt) : [], u = Array.isArray(t.factions) ? t.factions.filter((A) => A && typeof A == "object").map(kn) : [], c = new Set(u.filter((A) => A.kind === "major").map((A) => A.id)), p = new Set(i.map((A) => A.id));
  for (const A of u)
    (!c.has(A.parentFactionId) || A.parentFactionId === A.id) && (A.parentFactionId = ""), A.systemProminence = Object.fromEntries(Object.entries(A.systemProminence).filter(([D]) => p.has(D))), A.systemProminencePercent = Object.fromEntries(Object.entries(A.systemProminencePercent).filter(([D]) => p.has(D)));
  const d = String(((x = t.currentLocation) == null ? void 0 : x.systemId) || t.currentSystemId || ((H = i[0]) == null ? void 0 : H.id) || ""), T = i.some((A) => A.id === d) ? d : ((B = i[0]) == null ? void 0 : B.id) ?? "", v = i.find((A) => A.id === T), M = String(((R = t.currentLocation) == null ? void 0 : R.objectId) || ""), P = v != null && v.objects.some((A) => A.id === M) ? M : (v == null ? void 0 : v.primaryObjectId) ?? "";
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
const Ri = "modules/galaxy-map/assets/frames/galaxy-frame-cyan.svg";
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
  const r = (p) => [1, 3, 5].map((d) => Number.parseInt(p.slice(d, d + 2), 16)), u = r(e), c = r(t);
  return `rgb(${u.map((p, d) => Math.round(p * i + c[d] * (1 - i))).join(", ")})`;
}
function Fi() {
  var r, u, c, p, d, T;
  const e = document.documentElement, t = ((r = e == null ? void 0 : e.dataset) == null ? void 0 : r.holosuiteDeviceStyle) || ((c = (u = document.body) == null ? void 0 : u.dataset) == null ? void 0 : c.holosuiteDeviceStyle) || "";
  if (dt[t]) return dt[t];
  const i = ((p = e == null ? void 0 : e.dataset) == null ? void 0 : p.holosuiteTheme) || ((T = (d = document.body) == null ? void 0 : d.dataset) == null ? void 0 : T.holosuiteTheme) || "default";
  return dt[i] ?? dt.default;
}
async function An(e) {
  const { primary: t, success: i, background: r } = Fi(), u = an(t, r, 0.58), c = an(t, r, 0.34), p = [t, i, u, c, r].join("|");
  e.dataset.gmfFramePalette = p;
  let d = sn.get(p);
  if (!d)
    try {
      nn ?? (nn = fetch(Ri).then((M) => {
        if (!M.ok) throw new Error(`Galaxy frame request failed (${M.status})`);
        return M.text();
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
      for (const [M, P] of v) T = T.replace(new RegExp(M, "gi"), P);
      d = URL.createObjectURL(new Blob([T], { type: "image/svg+xml" })), sn.set(p, d);
    } catch {
      return;
    }
  e.isConnected && e.dataset.gmfFramePalette === p && e.style.setProperty("--gmf-frame-image", `url("${d}")`);
}
function $i() {
  if (lt) return;
  lt = new MutationObserver(() => {
    document.querySelectorAll(".gmf-manager-window, .gmf-map-window, .gmf-crud-dialog").forEach((t) => void An(t));
  });
  const e = { attributes: !0, attributeFilter: ["data-holosuite-theme", "data-holosuite-device-style"] };
  lt.observe(document.documentElement, e), document.body && lt.observe(document.body, e);
}
function Cn(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
function jn(e) {
  var t, i;
  return e ? (t = e.matches) != null && t.call(e, ".window-app, .application, .app") ? e : (i = e.closest) == null ? void 0 : i.call(e, ".window-app, .application, .app") : null;
}
function ft(e, t) {
  const i = Cn(t), r = jn(i);
  r && ($i(), An(r));
  const u = Array.from((i == null ? void 0 : i.querySelectorAll("[data-gmf-window-drag]")) ?? []);
  if (!(!i || !r || !u.length)) {
    i.querySelectorAll("[data-action='close-window']").forEach((c) => {
      c.dataset.gmfCloseBound !== "true" && (c.dataset.gmfCloseBound = "true", c.addEventListener("click", () => {
        var p;
        return (p = e.close) == null ? void 0 : p.call(e);
      }));
    });
    for (const c of u)
      c.dataset.gmfDragBound !== "true" && (c.dataset.gmfDragBound = "true", c.addEventListener("pointerdown", (p) => {
        var R, A, D;
        if (p.button !== 0) return;
        const d = p.target;
        if ((R = d == null ? void 0 : d.closest) != null && R.call(d, "button, input, select, textarea, a, [data-action]")) return;
        const T = r.getBoundingClientRect(), v = p.clientX, M = p.clientY, P = T.left, x = T.top;
        (A = e.bringToFront ?? e.bringToTop) == null || A.call(e), (D = c.setPointerCapture) == null || D.call(c, p.pointerId), c.classList.add("is-dragging");
        const H = (U) => {
          var te;
          const Q = r.getBoundingClientRect().width, ee = r.getBoundingClientRect().height, w = Math.max(0, Math.min(window.innerWidth - Math.min(Q, 80), P + U.clientX - v)), Y = Math.max(0, Math.min(window.innerHeight - Math.min(ee, 48), x + U.clientY - M));
          (te = e.setPosition) == null || te.call(e, { left: w, top: Y });
        }, B = () => {
          c.classList.remove("is-dragging"), c.removeEventListener("pointermove", H), c.removeEventListener("pointerup", B), c.removeEventListener("pointercancel", B);
        };
        c.addEventListener("pointermove", H), c.addEventListener("pointerup", B), c.addEventListener("pointercancel", B);
      }));
  }
}
function Ni(e, t) {
  var v, M;
  const i = Cn(t), r = jn(i), u = (v = r == null ? void 0 : r.querySelector) == null ? void 0 : v.call(r, ":scope > .window-content");
  if (!i || !r || !u || u.querySelector(":scope > .gmf-dialog-header")) return;
  const c = document.createElement("header");
  c.className = "gmf-dialog-header", c.dataset.gmfWindowDrag = "true";
  const p = document.createElement("div");
  p.className = "gmf-dialog-header__identity", p.innerHTML = '<span class="gmf-dialog-header__orb"><i class="fa-solid fa-satellite"></i></span><span><small>GALAXY MAP // CONTROL PANEL</small><strong></strong></span>';
  const d = p.querySelector("strong");
  d && (d.textContent = (e == null ? void 0 : e.title) || ((M = r.querySelector(".window-title")) == null ? void 0 : M.textContent) || "Galaxy Map");
  const T = document.createElement("button");
  T.type = "button", T.className = "gmf-window-close", T.dataset.action = "close-window", T.title = "Close", T.setAttribute("aria-label", "Close window"), T.innerHTML = '<i class="fa-solid fa-xmark"></i>', c.append(p, T), u.prepend(c), ft(e, r);
}
const We = {
  classes: ["galaxy-map", "gmf-crud-dialog"]
};
function pt() {
  const { ApplicationV2: e, HandlebarsApplicationMixin: t } = foundry.applications.api;
  return t(e);
}
const he = "galaxy-map", _t = "maps", Rn = "enableFactions", Di = "showProminencePercentages", Gi = "reputationRatings", Bi = "prominenceRatings", ut = "schemaV1Backup", Lt = "surfaceLocationRecoveryV2", _e = `module.${he}`, Oe = `modules/${he}/templates`;
function Re() {
  var e;
  return ((e = game.settings) == null ? void 0 : e.get(he, Rn)) !== !1;
}
const nt = {
  reputation: {
    setting: Gi,
    title: "Reputation",
    icon: "fa-solid fa-users",
    labelsSetting: "showReputationLabels",
    percentagesSetting: "showReputationPercentages",
    defaults: ["Hostile", "Unfriendly", "Neutral", "Friendly", "Allied"]
  },
  prominence: {
    setting: Bi,
    title: "Prominence",
    icon: "fa-solid fa-layer-group",
    labelsSetting: "showProminenceLabels",
    percentagesSetting: Di,
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
function zi(e) {
  return String(e || "galaxy-map").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "galaxy-map";
}
function Hi(e, t) {
  const i = JSON.stringify(t, null, 2), r = globalThis.saveDataToFile;
  if (typeof r == "function") {
    r(i, "application/json", e);
    return;
  }
  const u = new Blob([i], { type: "application/json" }), c = URL.createObjectURL(u), p = document.createElement("a");
  p.href = c, p.download = e, document.body.appendChild(p), p.click(), p.remove(), setTimeout(() => URL.revokeObjectURL(c), 0);
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
function Vi(e = globalThis) {
  var u, c, p;
  const t = (p = (c = (u = e.foundry) == null ? void 0 : u.applications) == null ? void 0 : c.apps) == null ? void 0 : p.FilePicker, i = t == null ? void 0 : t.implementation;
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
      const c = Vi();
      if (!c) {
        console.error("galaxy-map | Foundry FilePicker is unavailable.");
        return;
      }
      new c({
        type: "image",
        current: u.value,
        callback: (p) => {
          u.value = p, on(u);
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
function Ui(e) {
  var w;
  const {
    templateRoot: t,
    getMaps: i,
    prepareMapForManager: r,
    getRawMap: u,
    importMapData: c,
    exportMap: p,
    duplicateMap: d,
    deleteMap: T,
    createMap: v,
    deleteSystem: M,
    deleteObject: P,
    deleteRoute: x,
    deleteFaction: H,
    openMap: B,
    showMapToPlayers: R,
    hideSystemFromPlayers: A,
    hideRouteFromPlayers: D,
    hideFactionFromPlayers: U,
    notifyError: Q,
    clearManagerApp: ee
  } = e;
  return w = class extends pt() {
    constructor(C = {}) {
      super(C);
      J(this, "selectedMapId");
      J(this, "activeTab");
      J(this, "expandedSystemId");
      this.selectedMapId = C.selectedMapId ?? null, this.activeTab = ["systems", "routes", "factions"].includes(C.activeTab) ? C.activeTab : "systems", this.expandedSystemId = C.expandedSystemId;
    }
    async _prepareContext(C) {
      var ie, Se;
      const G = await super._prepareContext(C), se = !Re();
      se && this.activeTab === "factions" && (this.activeTab = "systems");
      const oe = i().sort((be, Ie) => be.title.localeCompare(Ie.title));
      (!this.selectedMapId || !oe.some((be) => be.id === this.selectedMapId)) && (this.selectedMapId = ((ie = oe[0]) == null ? void 0 : ie.id) ?? null);
      const ae = this.selectedMapId ? r(u(this.selectedMapId)) : null;
      if (ae) {
        const be = new Set(ae.systems.map((Ie) => Ie.id));
        this.expandedSystemId && !be.has(this.expandedSystemId) && (this.expandedSystemId = void 0), this.expandedSystemId === void 0 && (this.expandedSystemId = ((Se = ae.systems[0]) == null ? void 0 : Se.id) ?? null), ae.systems = ae.systems.map((Ie) => ({
          ...Ie,
          isExpanded: Ie.id === this.expandedSystemId
        }));
      }
      return {
        ...G,
        maps: oe,
        selectedMap: ae,
        selectedMapId: this.selectedMapId,
        activeTab: this.activeTab,
        factionsDisabled: se,
        showSystems: this.activeTab === "systems",
        showRoutes: this.activeTab === "routes",
        showFactions: this.activeTab === "factions",
        hasMaps: oe.length > 0
      };
    }
    _attachPartListeners(C, G, se) {
      var oe, ae, ie, Se, be, Ie, xe;
      super._attachPartListeners(C, G, se), ft(this, G), (oe = G.querySelector("[data-action='create-map']")) == null || oe.addEventListener("click", () => this._onCreateMap()), (ae = G.querySelector("[data-action='edit-map-metadata']")) == null || ae.addEventListener("click", () => {
        this._openViewportEditor("map");
      }), (ie = G.querySelector("[data-action='create-system']")) == null || ie.addEventListener("click", () => {
        this._openViewportEditor("system");
      }), (Se = G.querySelector("[data-action='create-route']")) == null || Se.addEventListener("click", () => {
        this._openViewportEditor("route");
      }), (be = G.querySelector("[data-action='create-faction']")) == null || be.addEventListener("click", () => {
        this._openViewportEditor("faction");
      }), G.querySelectorAll("[data-manager-tab]").forEach((j) => {
        j.addEventListener("click", () => {
          const ge = j.dataset.managerTab;
          !["systems", "routes", "factions"].includes(ge) || ge === this.activeTab || (this.activeTab = ge, this.render({ force: !0 }));
        });
      }), G.querySelectorAll("[data-toggle-system]").forEach((j) => {
        j.addEventListener("click", () => {
          const ge = j.dataset.toggleSystem;
          this.expandedSystemId = this.expandedSystemId === ge ? null : ge, this.render({ force: !0 });
        });
      }), G.querySelectorAll("[data-edit-system]").forEach((j) => {
        j.addEventListener("click", () => this._openViewportEditor("system", { id: j.dataset.editSystem }));
      }), G.querySelectorAll("[data-create-object]").forEach((j) => {
        j.addEventListener("click", () => this._openViewportEditor("entity", { systemId: j.dataset.createObject }));
      }), G.querySelectorAll("[data-edit-object]").forEach((j) => {
        j.addEventListener("click", () => this._openViewportEditor("entity", { systemId: j.dataset.objectSystem, id: j.dataset.editObject }));
      }), G.querySelectorAll("[data-delete-object]").forEach((j) => {
        j.addEventListener("click", () => this._confirmDeleteObject(j.dataset.objectSystem, j.dataset.deleteObject));
      }), G.querySelectorAll("[data-show-system]").forEach((j) => {
        j.addEventListener("click", () => A(this.selectedMapId, j.dataset.showSystem, !1));
      }), G.querySelectorAll("[data-hide-system]").forEach((j) => {
        j.addEventListener("click", () => A(this.selectedMapId, j.dataset.hideSystem, !0));
      }), G.querySelectorAll("[data-delete-system]").forEach((j) => {
        j.addEventListener("click", () => this._confirmDeleteSystem(j.dataset.deleteSystem));
      }), G.querySelectorAll("[data-edit-route]").forEach((j) => {
        j.addEventListener("click", () => this._openViewportEditor("route", { id: j.dataset.editRoute, systemId: j.dataset.routeSystem }));
      }), G.querySelectorAll("[data-show-route]").forEach((j) => {
        j.addEventListener("click", () => D(this.selectedMapId, j.dataset.showRoute, !1, j.dataset.routeSystem));
      }), G.querySelectorAll("[data-hide-route]").forEach((j) => {
        j.addEventListener("click", () => D(this.selectedMapId, j.dataset.hideRoute, !0, j.dataset.routeSystem));
      }), G.querySelectorAll("[data-delete-route]").forEach((j) => {
        j.addEventListener("click", () => this._confirmDeleteRoute(j.dataset.deleteRoute, j.dataset.routeSystem));
      }), G.querySelectorAll("[data-edit-faction]").forEach((j) => {
        j.addEventListener("click", () => this._openViewportEditor("faction", { id: j.dataset.editFaction }));
      }), G.querySelectorAll("[data-show-faction]").forEach((j) => {
        j.addEventListener("click", () => U(this.selectedMapId, j.dataset.showFaction, !1));
      }), G.querySelectorAll("[data-hide-faction]").forEach((j) => {
        j.addEventListener("click", () => U(this.selectedMapId, j.dataset.hideFaction, !0));
      }), G.querySelectorAll("[data-delete-faction]").forEach((j) => {
        j.addEventListener("click", () => this._confirmDeleteFaction(j.dataset.deleteFaction));
      }), (Ie = G.querySelector("[data-action='export-map']")) == null || Ie.addEventListener("click", () => {
        this.selectedMapId && p(this.selectedMapId);
      }), (xe = G.querySelector("[data-action='import-map']")) == null || xe.addEventListener("click", () => this._onImportMap()), G.querySelectorAll("[data-select-map]").forEach((j) => {
        j.addEventListener("click", () => {
          this.selectedMapId = j.dataset.selectMap, this.expandedSystemId = void 0, this.render({ force: !0 });
        });
      }), G.querySelectorAll("[data-open-map]").forEach((j) => {
        j.addEventListener("click", () => B(j.dataset.openMap));
      }), G.querySelectorAll("[data-show-map]").forEach((j) => {
        j.addEventListener("click", () => R(j.dataset.showMap));
      }), G.querySelectorAll("[data-duplicate-map]").forEach((j) => {
        j.addEventListener("click", async () => {
          const ge = await d(j.dataset.duplicateMap);
          ge && (this.selectedMapId = ge.id, this.render({ force: !0 }));
        });
      }), G.querySelectorAll("[data-delete-map]").forEach((j) => {
        j.addEventListener("click", async () => {
          const ge = j.dataset.deleteMap, qe = u(ge);
          await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${Le((qe == null ? void 0 : qe.title) ?? ge)}</strong>? This cannot be undone.</p>`
          }, We) && (await T(ge), this.selectedMapId === ge && (this.selectedMapId = null), this.render({ force: !0 }));
        });
      });
    }
    _onImportMap() {
      const C = document.createElement("input");
      C.type = "file", C.accept = ".json,application/json", C.addEventListener("change", async () => {
        var se;
        const G = (se = C.files) == null ? void 0 : se[0];
        if (G)
          try {
            const oe = JSON.parse(await G.text());
            if (!oe || typeof oe != "object" || Array.isArray(oe))
              throw new Error("The selected file does not contain a Galaxy Map object.");
            const ae = await c(oe);
            if (!ae) return;
            this.selectedMapId = ae.id, this.expandedSystemId = void 0, this.render({ force: !0 });
          } catch (oe) {
            const ae = oe instanceof Error ? oe.message : "The selected file could not be read.";
            Q(`Could not import map: ${ae}`);
          }
      }, { once: !0 }), C.click();
    }
    async _onCreateMap() {
      const C = await v({
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
      C && (this.selectedMapId = C.id, this.render({ force: !0 }));
    }
    _openViewportEditor(C, G = {}) {
      var se, oe;
      this.selectedMapId && ((oe = (se = B(this.selectedMapId)) == null ? void 0 : se.openEditor) == null || oe.call(se, C, G));
    }
    async _confirmDeleteSystem(C) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, We) && await M(this.selectedMapId, C);
    }
    async _confirmDeleteObject(C, G) {
      await Dialog.confirm({
        title: "Delete Location",
        content: "<p>Delete this location and its linked content from the system?</p>"
      }) && await P(this.selectedMapId, C, G);
    }
    async _confirmDeleteRoute(C, G = "") {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, We) && await x(this.selectedMapId, C, G);
    }
    async _confirmDeleteFaction(C) {
      await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }, We) && await H(this.selectedMapId, C);
    }
    async close(C = {}) {
      return ee(this), super.close(C);
    }
  }, J(w, "DEFAULT_OPTIONS", {
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
  }), J(w, "PARTS", {
    main: {
      template: `${t}/map-manager.hbs`
    }
  }), w;
}
const Yi = 22;
function Xi(e) {
  const t = [];
  for (const i of e) {
    const r = t.find((u) => u.every((c) => Math.hypot(i[0] - c[0], i[1] - c[1]) <= Yi));
    r ? r.push(i) : t.push([i]);
  }
  return t;
}
const cn = (e, t) => e[0] - t[0] || e[1] - t[1];
function ln(e) {
  return e.sort(cn).filter((t, i) => i === 0 || cn(t, e[i - 1]) !== 0);
}
function Wi(e) {
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
function Dn(e, t, { cluster: i = !0 } = {}) {
  const r = /* @__PURE__ */ new Map();
  for (const d of e) {
    if (!d.factionId || d.obscured || !Number.isFinite(d.x) || !Number.isFinite(d.y)) continue;
    const T = r.get(d.factionId) ?? [];
    T.push([Math.max(0, Math.min(100, d.x)), Math.max(0, Math.min(100, d.y))]), r.set(d.factionId, T);
  }
  const u = i ? 5 : 7, c = i ? 7 : 9, p = (d) => Math.round(Math.max(1, Math.min(99, d)) * 100) / 100;
  return t.filter((d) => d.kind !== "minor").flatMap(({ id: d, name: T, color: v }) => {
    const M = ln(r.get(d) ?? []);
    return M.length ? (i ? Xi(M) : [M]).map((P) => {
      const x = ln(P.flatMap(([R, A]) => Array.from({ length: 12 }, (D, U) => {
        const Q = U * Math.PI / 6;
        return [p(R + Math.cos(Q) * u), p(A + Math.sin(Q) * c)];
      }))), H = Wi(x), B = H.reduce(({ left: R, right: A, top: D }, [U, Q]) => ({
        left: Math.min(R, U),
        right: Math.max(A, U),
        top: Math.min(D, Q)
      }), { left: 100, right: 0, top: 100 });
      return {
        id: d,
        name: T,
        color: v,
        points: H.map((R) => R.join(",")).join(" "),
        labelX: Math.max(12, Math.min(88, (B.left + B.right) / 2)),
        labelY: Math.max(3, B.top + 1)
      };
    }) : [];
  });
}
function Gn() {
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
  const t = Gn();
  if (!t || !Array.isArray(e == null ? void 0 : e.sceneIds)) return [];
  const i = /* @__PURE__ */ new Set(), r = [];
  try {
    for (const u of e.sceneIds)
      for (const c of t.getBountiesForScene(String(u)) ?? []) {
        const p = String((c == null ? void 0 : c.id) ?? "");
        !p || i.has(p) || (i.add(p), r.push({
          id: p,
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
    const t = Gn();
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
    const p = c.getContext("2d", { willReadFrequently: !0 });
    if (!p) return null;
    p.drawImage(t, 0, 0, r, u);
    const d = p.getImageData(0, 0, r, u), T = p.createImageData(r, u), v = new Float32Array(r * u);
    for (let P = 0; P < v.length; P++) {
      const x = P * 4;
      v[P] = d.data[x] * 0.299 + d.data[x + 1] * 0.587 + d.data[x + 2] * 0.114;
    }
    const M = (P, x) => v[x * r + P];
    for (let P = 1; P < u - 1; P++)
      for (let x = 1; x < r - 1; x++) {
        const H = -M(x - 1, P - 1) + M(x + 1, P - 1) - 2 * M(x - 1, P) + 2 * M(x + 1, P) - M(x - 1, P + 1) + M(x + 1, P + 1), B = -M(x - 1, P - 1) - 2 * M(x, P - 1) - M(x + 1, P - 1) + M(x - 1, P + 1) + 2 * M(x, P + 1) + M(x + 1, P + 1), R = Math.hypot(H, B), A = Math.max(0, Math.min(235, (R - 34) * 2.1)), D = (P * r + x) * 4;
        T.data[D] = 104, T.data[D + 1] = 241, T.data[D + 2] = 255, T.data[D + 3] = A;
      }
    return p.clearRect(0, 0, r, u), p.putImageData(T, 0, 0), c.toDataURL("image/png");
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
  const c = new AbortController(), p = c.signal, d = document.createElement("aside");
  d.className = "gmf-intel-callout", d.setAttribute("aria-label", "Bounty intel"), d.hidden = !0, d.innerHTML = `
    <span class="gmf-intel-callout__connector" aria-hidden="true"></span>
    <div class="gmf-intel-callout__stack" data-intel-list role="group" aria-label="Matching bounties"></div>`, u.append(d);
  let T = [], v = null, M = null, P = null, x = 0, H = 0;
  const B = () => {
    M && clearTimeout(M), M = null;
  }, R = () => {
    x++, P && clearTimeout(P), P = null, M = null, v = null, T = [], H++, d.hidden = !0, d.classList.remove("is-visible", "is-left");
  }, A = (w = 180) => {
    B(), x++, P && clearTimeout(P), P = null, M = setTimeout(R, w);
  }, D = () => {
    if (!v || d.hidden) return;
    const w = t.getBoundingClientRect(), Y = v.getBoundingClientRect();
    d.style.setProperty("--gmf-intel-stack-height", `${Math.max(80, w.height - 72)}px`);
    const te = d.offsetWidth || 224, C = d.offsetHeight || 126, G = Y.right - w.left + te + 24 > w.width, se = G ? Y.left - w.left - te - 18 : Y.right - w.left + 18, oe = Math.max(48, Math.min(w.height - C - 12, Y.top - w.top + Y.height / 2 - C / 2));
    d.classList.toggle("is-left", G), d.style.left = `${Math.max(8, se)}px`, d.style.top = `${oe}px`;
  }, U = () => {
    const w = d.querySelector("[data-intel-list]");
    if (!w || !T.length) return R();
    w.replaceChildren();
    const Y = ++H;
    T.forEach((te, C) => {
      const G = document.createElement("button");
      G.type = "button", G.className = "gmf-intel-callout__body", G.dataset.intelOpen = te.id, G.style.setProperty("--gmf-intel-index", String(C)), G.style.setProperty("--gmf-intel-delay", `${C * 55}ms`), G.innerHTML = `
        <span class="gmf-intel-callout__portrait"><img alt="" hidden /><i class="fa-solid fa-crosshairs"></i></span>
        <span class="gmf-intel-callout__copy"><small></small><strong></strong><span></span></span>`;
      const se = G.querySelector("strong"), oe = G.querySelector("small"), ae = G.querySelector(".gmf-intel-callout__copy > span"), ie = G.querySelector("img"), Se = G.querySelector("i");
      se && (se.textContent = te.name), oe && (oe.textContent = `BOUNTY // ${(te.statusLabel || "INTEL").toUpperCase()}`), ae && (ae.textContent = te.reward || ""), G.addEventListener("click", () => r(te.id), { signal: p }), te.image && ie && (ie.src = te.image, ie.classList.add("is-css-fallback"), ie.hidden = !1, Se && (Se.hidden = !0), ie.onerror = () => {
        Y === H && (ie.hidden = !0, Se && (Se.hidden = !1));
      }, ns(te.image, te.id).then((be) => {
        !be || Y !== H || !G.isConnected || (ie.classList.remove("is-css-fallback"), ie.src = be);
      })), w.append(G);
    }), D();
  }, Q = async (w) => {
    B(), v = w;
    const Y = ++x;
    let te = [];
    try {
      te = await i(w.dataset.systemId ?? "");
    } catch {
    }
    if (!(Y !== x || v !== w)) {
      if (!te.length) return R();
      T = te, d.hidden = !1, U(), requestAnimationFrame(() => {
        D(), d.classList.add("is-visible");
      });
    }
  }, ee = (w) => {
    B(), x++, P && clearTimeout(P), P = setTimeout(() => {
      P = null, Q(w);
    }, 90);
  };
  return e.querySelectorAll("[data-system-id]").forEach((w) => {
    w.addEventListener("pointerenter", () => ee(w), { signal: p }), w.addEventListener("pointerleave", () => A(), { signal: p }), w.addEventListener("focus", () => ee(w), { signal: p }), w.addEventListener("blur", () => A(), { signal: p }), w.addEventListener("pointerdown", () => R(), { signal: p });
  }), d.addEventListener("pointerenter", B, { signal: p }), d.addEventListener("pointerleave", () => A(), { signal: p }), d.addEventListener("click", (w) => w.stopPropagation(), { signal: p }), t.addEventListener("wheel", () => requestAnimationFrame(D), { signal: p }), window.addEventListener("resize", D, { signal: p }), {
    dispose() {
      x++, M && clearTimeout(M), P && clearTimeout(P), c.abort(), d.remove();
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
  }, p = () => {
    c(), i = null, t.hidden = !0, t.classList.remove("is-visible", "is-left");
  }, d = () => {
    if (!i || t.hidden || !r.visible) return;
    const M = t.offsetWidth || 180, P = t.offsetHeight || 24, x = r.x + M + 76 > e.clientWidth, H = x ? r.x - M - 64 : r.x + 64, B = Math.max(8, Math.min(e.clientHeight - P - 8, r.y - P / 2));
    t.classList.toggle("is-left", x), t.style.left = `${Math.max(8, H)}px`, t.style.top = `${B}px`;
  }, T = (M) => {
    c(), i = M;
    const P = t.querySelector("[data-location-name]");
    P && (P.textContent = M.missing ? "Missing linked scene" : M.accessible ? M.name : "Restricted location"), t.hidden = !1, d(), requestAnimationFrame(() => {
      d(), t.classList.add("is-visible");
    });
  }, v = (M = 180) => {
    c(), u = setTimeout(p, M);
  };
  return {
    show: T,
    scheduleHide: v,
    hide: p,
    setAnchor(M) {
      if (r = M, !M.visible) return v(40);
      d();
    },
    dispose() {
      p(), t.remove();
    }
  };
}
function as(e, t, i) {
  const r = i.querySelector("[data-ship-layer]"), u = i.querySelector(".gmf-map-stage");
  if (!r || !u) return Promise.resolve();
  const c = u.getBoundingClientRect(), p = (t.x - e.x) * c.width / 100, d = (t.y - e.y) * c.height / 100, T = Math.atan2(d, p) * 180 / Math.PI, v = document.createElement("div");
  return v.className = "gmf-travel-ship", v.innerHTML = '<i class="fa-solid fa-rocket"></i>', v.style.left = `${e.x}%`, v.style.top = `${e.y}%`, v.style.setProperty("--gmf-ship-angle", `${T}deg`), r.replaceChildren(v), new Promise((M) => {
    let P = !1;
    const x = () => {
      P || (P = !0, v.removeEventListener("transitionend", x), v.classList.add("is-arrived"), globalThis.setTimeout(() => {
        v.remove(), M();
      }, 260));
    };
    v.addEventListener("transitionend", x, { once: !0 }), requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        v.style.left = `${t.x}%`, v.style.top = `${t.y}%`;
      });
    }), globalThis.setTimeout(x, jt);
  });
}
function rs(e, t, i) {
  const r = e.querySelector(".gmf-orbits"), u = r ? t.rings.map((A) => {
    const D = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    return D.setAttribute("vector-effect", "non-scaling-stroke"), r.append(D), { ...A, ellipse: D };
  }) : [], c = Array.from(e.querySelectorAll(".gmf-system[data-system-id]")), p = Array.from(e.querySelectorAll("[data-route-from][data-route-to]")), d = Array.from(e.querySelectorAll("[data-territory-faction]")), T = Array.from(e.querySelectorAll("[data-territory-label]")), v = globalThis.matchMedia("(prefers-reduced-motion: reduce)");
  let M = vn, P = null, x;
  const H = (A = et()) => t.positions(M, A, !v.matches, x);
  function B() {
    const A = H();
    for (const D of c) {
      const U = A.get(D.dataset.systemId);
      if (!U) continue;
      const Q = `${Number(U.x.toFixed(5))}%`, ee = `${Number(U.y.toFixed(5))}%`;
      D.style.left !== Q && (D.style.left = Q), D.style.top !== ee && (D.style.top = ee);
    }
    for (const D of p) {
      const U = A.get(D.dataset.routeFrom), Q = A.get(D.dataset.routeTo);
      U && Q && (ze(D, "x1", U.x), ze(D, "y1", U.y), ze(D, "x2", Q.x), ze(D, "y2", Q.y));
    }
    for (const { centerId: D, radius: U, ellipse: Q } of u) {
      const ee = A.get(D), w = Mn(U, M);
      ze(Q, "cx", ee.x), ze(Q, "cy", ee.y), ze(Q, "rx", w.x), ze(Q, "ry", w.y);
    }
    if (i && d.length) {
      const D = Dn(i.members.map((U) => ({
        ...U,
        ...A.get(U.id)
      })), i.factions, { cluster: !1 });
      for (const U of D) {
        const Q = d.find((w) => w.dataset.territoryFaction === U.id);
        Q && Q.getAttribute("points") !== U.points && Q.setAttribute("points", U.points);
        const ee = T.find((w) => w.dataset.territoryLabel === U.id);
        ee && (ee.style.left = `${U.labelX}%`, ee.style.top = `${U.labelY}%`);
      }
    }
  }
  function R() {
    P !== null && cancelAnimationFrame(P), P = null, e.isConnected && (B(), t.animated && !v.matches && (P = requestAnimationFrame(R)));
  }
  return v.addEventListener("change", R), {
    get aspect() {
      return M;
    },
    get motion() {
      return !v.matches;
    },
    setAspect(A) {
      Number.isFinite(A) && A > 0 && (M = A), R();
    },
    previewDrag(A, D) {
      x = { id: A, point: D }, B();
    },
    finishDrag(A, D) {
      var w;
      const U = (w = t.attachments.get(A)) == null ? void 0 : w.attachment, Q = U && H().get(U.centerId);
      if (!U || !Q) return;
      const ee = Pn(D, Q, M);
      return x = { id: A, point: D, angle: ee }, { centerId: U.centerId, orbitId: U.orbitId, angle: ee };
    },
    cancelDrag() {
      x = void 0, B();
    },
    position(A, D) {
      return t.attachments.has(A) ? H(D).get(A) : void 0;
    },
    dispose() {
      P !== null && cancelAnimationFrame(P), v.removeEventListener("change", R);
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
  const r = i.querySelector("[data-orbit-rows]"), u = i.querySelector("[data-orbit-row-template]"), c = i.querySelector("[data-orbit-attachment]"), p = i.querySelector("[data-orbit-placement]"), d = i.querySelector("[data-orbit-angle]"), T = i.querySelector("[data-orbit-motion]"), v = i.querySelector("[data-orbit-speed]"), M = i.querySelector("[data-orbit-period]");
  function P(B, R = !1) {
    const A = u.content.firstElementChild.cloneNode(!0), D = A.querySelector("[data-orbit-radius]");
    A.dataset.orbitId = B.id, D.value = String(B.radius), A.querySelector("[data-remove-orbit]").addEventListener("click", () => A.remove()), r.append(A), R && D.focus();
  }
  for (const B of t.orbits ?? []) P(B);
  i.querySelector("[data-add-orbit]").addEventListener("click", () => {
    P({ id: Te("orbit"), radius: Math.min(100, 15 + r.childElementCount * 10) }, !0);
  });
  const x = t.orbit;
  x && (d.value = String(x.angle), x.period && (T.value = x.clockwise ? "clockwise" : "counterclockwise", M.value = String(x.period)));
  function H() {
    p.hidden = !c.value, d.disabled = p.hidden, v.hidden = T.value === "fixed", M.disabled = p.hidden || v.hidden;
  }
  return c.addEventListener("change", H), T.addEventListener("change", H), H(), () => {
    const B = Array.from(r.querySelectorAll("[data-orbit-row]"), (Y) => ({
      id: Y.dataset.orbitId,
      radius: Number(Y.querySelector("[data-orbit-radius]").value)
    })), R = t.orbits ?? [], D = B.length !== R.length || B.some((Y, te) => Y.id !== R[te].id || Y.radius !== R[te].radius) ? { orbits: B } : {};
    if (!c.value) return x ? { ...D, orbit: null } : D;
    const [U, Q] = JSON.parse(c.value), ee = {
      centerId: U,
      orbitId: Q,
      angle: Number(d.value),
      period: v.hidden ? 0 : Number(M.value),
      clockwise: v.hidden ? (x == null ? void 0 : x.clockwise) ?? !0 : T.value === "clockwise"
    };
    return x && Object.entries(ee).every(([Y, te]) => x[Y] === te) ? D : { ...D, orbit: { ...ee, epoch: et() } };
  };
}
function cs(e) {
  var i, r;
  return (((r = (i = foundry.applications) == null ? void 0 : i.ux) == null ? void 0 : r.TextEditor) ?? globalThis.TextEditor).getDragEventData(e) ?? {};
}
async function Bn(e) {
  var c, p, d, T, v, M, P, x;
  const t = cs(e), i = globalThis.fromUuid, r = t.uuid && i ? await i(t.uuid) : null;
  if (["Scene", "JournalEntry"].includes(r == null ? void 0 : r.documentName)) return r;
  const u = String(t.sceneId || t.journalId || t.id || "");
  return u ? t.type === "Scene" ? ((p = (c = game.scenes) == null ? void 0 : c.get) == null ? void 0 : p.call(c, u)) ?? null : ["JournalEntry", "Journal"].includes(t.type) ? ((T = (d = game.journal) == null ? void 0 : d.get) == null ? void 0 : T.call(d, u)) ?? null : ((M = (v = game.scenes) == null ? void 0 : v.get) == null ? void 0 : M.call(v, u)) ?? ((x = (P = game.journal) == null ? void 0 : P.get) == null ? void 0 : x.call(P, u)) ?? null : null;
}
async function ls(e) {
  const t = await Bn(e);
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
    upsertRoute: p,
    upsertFaction: d,
    updateMapMetadata: T,
    deleteFaction: v,
    getTextureGuideMarkup: M,
    activateObjectEditorControls: P,
    revealSystemToPlayers: x,
    revealRouteToPlayers: H,
    hideSystemFromPlayers: B,
    setObjectVisibility: R,
    hideRouteFromPlayers: A,
    deleteSystem: D,
    deleteObject: U,
    deleteRoute: Q,
    setCurrentSystem: ee,
    setCurrentObject: w,
    requestTravelToSystem: Y,
    requestTravelToObject: te,
    exportMap: C,
    getTravelRoute: G,
    broadcastTravelAnimation: se,
    broadcastObjectTravelAnimation: oe,
    notifyInfo: ae,
    notifyError: ie,
    saveSystemPosition: Se,
    saveObjectPosition: be,
    savePlanetLocation: Ie,
    removePlanetLocation: xe,
    unlinkPlanetScene: j,
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
      J(this, "showGalaxyTerritories", !1);
      J(this, "selectedFactionId", "");
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
      J(this, "factionPanelOpen", !1);
      J(this, "factionPanelTab", "prominence");
      J(this, "_selectionTimer", null);
      J(this, "_worldWidth", 0);
      J(this, "_worldHeight", 0);
      J(this, "_orbitLayer", null);
      J(this, "showOrbits", !0);
      J(this, "_viewportResizeObserver", null);
      J(this, "_viewportStage", null);
      J(this, "_baseWindowHeight", null);
      this.mapId = n, this.playerMode = o, this.selectedSystemId = a.selectedSystemId ?? null, this.selectedRouteId = a.selectedRouteId ?? null, this.activeSystemId = a.activeSystemId ?? null, this.selectedObjectId = a.selectedObjectId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null, this.externalFocus = null, this._externalFocusTimeout = null, this._pendingFocusZoom = null;
    }
    get title() {
      const a = i(this.mapId), n = this.playerMode ? "Player View" : "GM View";
      return a ? `${a.title} - ${n}` : `Galaxy Map - ${n}`;
    }
    async _prepareContext(a) {
      var Ce, Ue, K, ye, ve, Ee, ke, $e, je, Ge, Ke;
      const n = await super._prepareContext(a), o = !Re();
      o && (this.factionPanelOpen = !1, this.factionRegistry = !1, this.selectedFactionId = "", ((Ce = this.creationPanel) == null ? void 0 : Ce.kind) === "faction" && (this.creationPanel = null));
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
      })), s.selectedSystem && (s.selectedSystem = s.systems.find((k) => k.id === s.selectedSystem.id) ?? null)), s != null && s.systems && this.externalFocus && (s.systems = s.systems.map((k) => k.id === this.externalFocus.systemId ? { ...k, isExternalFocus: !0, externalFocus: this.externalFocus } : k), ((K = s.selectedSystem) == null ? void 0 : K.id) === this.externalFocus.systemId && (s.selectedSystem = s.systems.find((k) => k.id === this.externalFocus.systemId))), !this.activeSystemId && this.selectedSystemId && !(s != null && s.selectedSystem) && (this.selectedSystemId = null);
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
      const O = q.find((k) => k.id === this.selectedObjectId) ?? null, $ = new Set(q.map((k) => k.id)), Z = E ? (E.routes ?? []).filter((k) => (!this.playerMode || k.visibility === "players") && $.has(k.fromSystemId) && $.has(k.toSystemId)).map((k) => {
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
      }) : [], W = Z.find((k) => k.id === this.selectedRouteId) ?? null, re = q.find((k) => k.isCurrent) ?? null, ce = O && re && O.id !== re.id ? Z.find((k) => k.fromSystemId === re.id && k.toSystemId === O.id || k.toSystemId === re.id && k.fromSystemId === O.id) : null;
      O && (O.canTravel = !!ce, O.isDestination = !!(ce && !O.isCurrent), O.travelRouteId = (ce == null ? void 0 : ce.id) ?? ""), Z.forEach((k) => {
        k.isActive = k.isSelected || k.id === (ce == null ? void 0 : ce.id);
      }), E && (s.systems = q, s.routes = Z, s.selectedSystem = W ? null : O, s.selectedRoute = W, s.currentSystem = re);
      const m = q.find((k) => k.id === this.planetSystemId) ?? (E ? null : s == null ? void 0 : s.systems.find((k) => k.id === this.planetSystemId)), f = !this.playerMode || (l == null ? void 0 : l.visibility) === "players" ? Ne(m) : null;
      f || (this.planetSystemId = null);
      const I = E && !f && q.some((k) => {
        var le;
        return (le = k.orbits) == null ? void 0 : le.length;
      }) ? It(
        q,
        new Set(q.filter((k) => k.obscured).map((k) => k.id))
      ) : null, b = m && f ? `${m.id}:${f.preset}` : null;
      b !== this._planetStaticViewKey && (this._planetStaticViewKey = b, this.planetStatic = !!(b && Ii(f == null ? void 0 : f.preset)));
      const _ = m && f ? this._preparePlanetLocations(m, f.shape) : [], L = m ?? O, z = !!((ye = game.user) != null && ye.isGM && !this.playerMode && E && L), F = ((L == null ? void 0 : L.sceneIds) ?? []).map((k) => {
        var le, Pe;
        return (Pe = (le = game.scenes) == null ? void 0 : le.get) == null ? void 0 : Pe.call(le, k);
      }).filter((k) => {
        var le, Pe;
        return k && (((le = game.user) == null ? void 0 : le.isGM) || ((Pe = k.testUserPermission) == null ? void 0 : Pe.call(k, game.user, "OBSERVER")));
      }).map((k) => ({ id: k.id, uuid: k.uuid, name: k.name || "Linked Scene" })), V = L != null && L.journalId ? (Ee = (ve = game.journal) == null ? void 0 : ve.get) == null ? void 0 : Ee.call(ve, L.journalId) : null, ne = V && ((ke = game.user) != null && ke.isGM || ($e = V.testUserPermission) != null && $e.call(V, game.user, "OBSERVER")) ? { id: V.id, uuid: V.uuid, name: V.name || "Linked Journal" } : null, ue = this.creationPanel ? {
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
          if (!At(q, this.creationPanel.editId, Be)) return [];
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
      } : null, me = this.factionPanelOpen && !f && !ue && !this.factionRegistry, fe = !o && (me || (E ? this.showTerritories : this.showGalaxyTerritories)), we = !f && !ue && !this.factionRegistry && (g == null ? void 0 : g.kind) === "major" ? g.id : void 0, Me = me && !g && s ? this._prepareFactionPanel(s, E) : null;
      return {
        ...n,
        map: s,
        factionsDisabled: o,
        factionDossier: g,
        showFactionPanel: me,
        factionPanel: Me,
        highlightedFactionId: we,
        systemView: !!(E && !f),
        activeSystem: E,
        selectedObject: O,
        planetView: !!f,
        planetSystem: m,
        planetAppearance: f,
        planetLocations: _,
        hasPlanetLocations: _.length > 0,
        canPlacePlanetLocations: z,
        linkedPlanetScenes: F,
        linkedPlanetJournal: ne,
        creationPanel: ue,
        factionRegistry: this.factionRegistry,
        appearanceGuideMarkup: ue != null && ue.isEntity ? M(ue.planetShape || "sphere") : "",
        showInspector: !!(Me || ue || this.factionRegistry || g || f || s != null && s.selectedSystem || s != null && s.selectedRoute),
        territories: fe && s && !f ? Dn(s.systems, s.factions, { cluster: !E }) : [],
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
      var $;
      const o = this.factionPanelTab === "reputation", l = o ? "reputation" : "prominence", { showLabels: s, showPercentages: h } = rn(l), g = Tt(l);
      o || g.unshift({ id: "Unrated", label: "Unrated" });
      const S = /* @__PURE__ */ new Map();
      for (const Z of a.factions) {
        const W = S.get(Z.parentFactionId) ?? [];
        W.push(Z), S.set(Z.parentFactionId, W);
      }
      const E = (n == null ? void 0 : n.id) ?? "", q = !!(($ = game.user) != null && $.isGM && (o || !(n != null && n.obscured))), O = (S.get("") ?? []).flatMap((Z) => [Z, ...S.get(Z.id) ?? []]).map((Z) => {
        var m;
        const W = o ? Z.reputation : E ? Z.systemProminence[E] ?? "Unrated" : Z.prominence, re = ((m = g.find((f) => f.id === W)) == null ? void 0 : m.label) ?? "Unrated", ce = o ? Z.reputationPercent : E ? Z.systemProminencePercent[E] : Z.prominencePercent;
        return { ...Z, ratingId: W, value: re, percentage: ce, hasPercentage: st(ce) };
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
        rows: O
      };
    }
    async _saveFactionPercentage(a, n, o, l) {
      var q;
      const s = l ? "reputation" : "prominence";
      if (!((q = game.user) != null && q.isGM) || !Re() || !rn(s).showPercentages) return;
      if (o !== null && !st(o)) {
        ie(`Enter a whole ${s} percentage from 0 to 100.`);
        return;
      }
      const h = i(this.mapId);
      if (!h) return;
      const g = X(h), S = g.factions.find((O) => O.id === a);
      if (!S || !l && n && !g.systems.some((O) => O.id === n)) {
        ie("The faction or system is no longer on this map.");
        return;
      }
      let E = l ? { reputationPercent: o } : { prominencePercent: o };
      !l && n && (E = { systemProminencePercent: o === null ? Object.fromEntries(Object.entries(S.systemProminencePercent).filter(([$]) => $ !== n)) : { ...S.systemProminencePercent, [n]: o } });
      try {
        await d(this.mapId, { id: a, ...E });
      } catch (O) {
        console.error(`Galaxy Map failed to save faction ${s} percentage`, O), ie(`Could not save the ${s} percentage.`);
      }
    }
    async _saveFactionStanding(a, n, o, l) {
      var E;
      if (!((E = game.user) != null && E.isGM) || !Re()) return !1;
      const s = l ? "reputation" : "prominence";
      if ((l || n !== "Unrated") && !Tt(s).some((q) => q.id === n))
        return ie(`That ${s} rating is no longer available.`), !1;
      const h = i(this.mapId);
      if (!h) return !1;
      const g = X(h).factions.find((q) => q.id === a);
      if (!g)
        return ie("That faction is no longer on this map."), !1;
      const S = l ? { reputation: n } : o ? { systemProminence: { ...g.systemProminence, [o]: n } } : { prominence: n };
      try {
        return !!await d(this.mapId, { id: a, ...S });
      } catch (q) {
        console.error("Galaxy Map failed to save faction standing", q), ie("Could not save the faction change.");
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
        if (g && a.hasOrbits && (this._orbitLayer = rs(g, a.orbitLayout, {
          members: a.map.systems,
          factions: a.map.factions
        })), this._applyViewportTransform(o), this._mountBountyIntelCallout(o), this.externalFocus && this._pendingFocusZoom !== null) {
          const S = X(i(this.mapId)).systems.find((E) => E.id === this.externalFocus.systemId);
          S && this._centerOnSystem(S, o, this._pendingFocusZoom), this._pendingFocusZoom = null;
        }
        a.planetView ? this._mountPlanetRenderer(o, a.planetAppearance) : this._planetReturnFocus && ((h = o.querySelector("[data-action='inspect-system']")) == null || h.focus(), this._planetReturnFocus = !1);
      }
    }
    _attachPartListeners(a, n, o) {
      var q, O, $, Z, W, re, ce, m, f, I, b, _, L, z, F, V, ne, ue, me, fe, we, Me, Ce, Ue;
      const l = (q = n.matches) != null && q.call(n, ".gmf-map-stage") ? n : (O = n.querySelector) == null ? void 0 : O.call(n, ".gmf-map-stage, .gmf-planet-stage");
      if ((l == null ? void 0 : l.dataset.gmfMapBound) === "true") return;
      l && (l.dataset.gmfMapBound = "true");
      const s = ($ = l == null ? void 0 : l.matches) != null && $.call(l, ".gmf-map-stage") ? l : null;
      super._attachPartListeners(a, n, o), ft(this, n), this._attachPlanetListeners(n), this._attachCreationPanel(n);
      const h = n.querySelector(".gmf-object-appearance-panel");
      h && (P(h), this._attachAppearancePreview(n)), (Z = n.querySelector("[data-action='toggle-territories']")) == null || Z.addEventListener("click", () => {
        this.factionPanelOpen = !this.factionPanelOpen, this.factionRegistry = !1, this.selectedFactionId = "", this.activeSystemId ? this.showTerritories = this.factionPanelOpen : this.showGalaxyTerritories = this.factionPanelOpen, this.render({ force: !0 });
      }), n.querySelectorAll("[data-faction-panel-tab]").forEach((K) => {
        K.addEventListener("click", () => {
          this.factionPanelTab = K.dataset.factionPanelTab ?? "prominence", this.render({ force: !0 });
        });
      });
      const g = n.querySelectorAll("[data-faction-rating]"), S = n.querySelectorAll(
        "[data-faction-rating], [data-faction-percentage] button[type='submit']"
      );
      g.forEach((K) => {
        K.addEventListener("click", async () => {
          const ye = K.closest("[data-faction-standing]"), ve = K.dataset.factionRating;
          if (!ye || !ve || K.disabled) return;
          if (K.getAttribute("aria-pressed") === "true") {
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
      }), n.querySelectorAll("[data-faction-percentage]").forEach((K) => {
        const ye = K.querySelector('input[type="number"]'), ve = K.querySelector('button[type="submit"]');
        !ye || !ve || K.addEventListener("submit", async (Ee) => {
          if (Ee.preventDefault(), ve.disabled || !K.reportValidity()) return;
          const ke = ye.value === "" ? null : ye.valueAsNumber, { factionPercentage: $e = "", prominenceSystemId: je = "", reputation: Ge } = K.dataset;
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
      }), n.querySelectorAll("[data-inspect-faction]").forEach((K) => {
        K.addEventListener("click", () => {
          this._selectionTimer && clearTimeout(this._selectionTimer), this.selectedFactionId = K.dataset.inspectFaction ?? "", this.render({ force: !0 });
        });
      }), (W = n.querySelector("[data-action='clear-faction']")) == null || W.addEventListener("click", () => {
        this.selectedFactionId = "", this.render({ force: !0 });
      }), (re = n.querySelector("[data-action='toggle-routes']")) == null || re.addEventListener("click", () => {
        this.showRoutes = !this.showRoutes, this.render({ force: !0 });
      }), (ce = n.querySelector("[data-action='toggle-orbits']")) == null || ce.addEventListener("click", () => {
        this.showOrbits = !this.showOrbits, this.render({ force: !0 });
      }), (m = n.querySelector("[data-action='edit-orbits']")) == null || m.addEventListener("click", () => {
        var K;
        !this.playerMode && ((K = game.user) != null && K.isGM) && this.selectedObjectId && this._openEditPanel("entity", this.selectedObjectId, !0);
      }), (f = n.querySelector("[data-action='edit-current-layer']")) == null || f.addEventListener("click", () => {
        var K;
        !((K = game.user) != null && K.isGM) || this.playerMode || (this.activeSystemId ? this._openEditPanel("system", this.activeSystemId) : this._openCreationPanel("map", X(i(this.mapId)), this.mapId));
      }), (I = n.querySelector("[data-action='toggle-hard-contrast']")) == null || I.addEventListener("click", (K) => {
        var ve;
        this.hardContrast = !this.hardContrast;
        const ye = (ve = n.matches) != null && ve.call(n, ".gmf-galaxy") ? n : n.querySelector(".gmf-galaxy");
        ye == null || ye.classList.toggle("is-hard-contrast", this.hardContrast), K.currentTarget.setAttribute("aria-pressed", String(this.hardContrast));
      }), n.querySelectorAll(".gmf-system[data-system-id]").forEach((K) => {
        var ye, ve;
        K.addEventListener("click", (Ee) => {
          if (K.dataset.dragged === "true") {
            K.dataset.dragged = "false";
            return;
          }
          Ee.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = globalThis.setTimeout(() => {
            this.selectedFactionId = "", this.activeSystemId ? this.selectedObjectId = K.dataset.systemId : this.selectedSystemId = K.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
          }, 180);
        }), K.addEventListener("dblclick", (Ee) => {
          var $e;
          Ee.preventDefault(), Ee.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
          const ke = K.dataset.systemId;
          if (this.selectedFactionId = "", this.selectedRouteId = null, this.creationPanel = null, this.activeSystemId) {
            this.selectedObjectId = ke;
            const je = ($e = X(i(this.mapId)).systems.find((Ge) => Ge.id === this.activeSystemId)) == null ? void 0 : $e.objects.find((Ge) => Ge.id === ke);
            Ne(je) && (this.planetSystemId = ke);
          } else
            this.selectedSystemId = ke, this.activeSystemId = ke, this.selectedObjectId = null;
          this.render({ force: !0 });
        }), !this.playerMode && ((ye = game.user) != null && ye.isGM) && ((ve = K.querySelector("[data-resize-marker]")) == null || ve.addEventListener("pointerdown", (Ee) => this._startMarkerResize(Ee, K)), K.addEventListener("pointerdown", (Ee) => this._startSystemDrag(Ee, n, K)));
      }), this._mountBountyIntelCallout(n), n.querySelectorAll("[data-route-id]").forEach((K) => {
        K.addEventListener("click", (ye) => {
          var ve;
          if (ye.stopPropagation(), this.selectedFactionId = "", this.selectedRouteId = K.dataset.routeId, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, !this.playerMode && ((ve = game.user) != null && ve.isGM)) {
            this._openEditPanel("route", K.dataset.routeId);
            return;
          }
          this.render({ force: !0 });
        });
      }), s == null || s.addEventListener("wheel", (K) => this._onWheelZoom(K, n), { passive: !1 }), s == null || s.addEventListener("pointerdown", (K) => this._startPan(K, n)), s == null || s.addEventListener("contextmenu", (K) => this._openContextMenu(K, n), { capture: !0 }), n.querySelectorAll("[data-context-action]").forEach((K) => {
        K.addEventListener("click", (ye) => this._handleContextAction(ye, n));
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
        this.activeSystemId && this.selectedObjectId ? R(this.mapId, this.activeSystemId, this.selectedObjectId, "players") : this.selectedSystemId && x(this.mapId, this.selectedSystemId);
      }), (V = n.querySelector("[data-action='hide-system']")) == null || V.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? R(this.mapId, this.activeSystemId, this.selectedObjectId, "gm") : this.selectedSystemId && B(this.mapId, this.selectedSystemId, !0);
      }), (ne = n.querySelector("[data-action='delete-system']")) == null || ne.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._confirmDeleteObject(this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), (ue = n.querySelector("[data-action='set-current-system']")) == null || ue.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? w(this.mapId, this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && ee(this.mapId, this.selectedSystemId);
      }), (me = n.querySelector("[data-action='travel-to-system']")) == null || me.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? Y(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, n));
      }), (fe = n.querySelector("[data-action='travel-to-object']")) == null || fe.addEventListener("click", () => {
        !this.activeSystemId || !this.selectedObjectId || (this.playerMode ? te(this.mapId, this.activeSystemId, this.selectedObjectId) : this._travelToObject(this.activeSystemId, this.selectedObjectId, n));
      }), (we = n.querySelector("[data-action='edit-route']")) == null || we.addEventListener("click", () => {
        this.selectedRouteId && this._openEditPanel("route", this.selectedRouteId);
      }), (Me = n.querySelector("[data-action='reveal-route']")) == null || Me.addEventListener("click", () => {
        this.selectedRouteId && H(this.mapId, this.selectedRouteId, this.activeSystemId ?? "");
      }), (Ce = n.querySelector("[data-action='hide-route']")) == null || Ce.addEventListener("click", () => {
        this.selectedRouteId && A(this.mapId, this.selectedRouteId, !0, this.activeSystemId ?? "");
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
          const O = this._worldWidth * this.zoom, $ = this._worldHeight * this.zoom;
          this.panX = O <= g.width ? (g.width - O) / 2 : pe(this.panX, g.width - O, 0), this.panY = $ <= g.height ? (g.height - $) / 2 : pe(this.panY, g.height - $, 0), S && S.dataset.gmfWorldImageBound !== "true" && (S.dataset.gmfWorldImageBound = "true", S.addEventListener("load", () => this._applyViewportTransform(a), { once: !0 }));
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
          const h = X(i(this.mapId)), g = this.activeSystemId ? (S = h.systems.find((E) => E.id === this.activeSystemId)) == null ? void 0 : S.objects.find((E) => E.id === s) : h.systems.find((E) => E.id === s);
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
            const $ = (E = X(S).systems.find((Z) => Z.id === this.activeSystemId)) == null ? void 0 : E.objects.find((Z) => Z.id === this.selectedObjectId);
            if (!Ne($)) return;
            this.planetSystemId = this.selectedObjectId;
          } else {
            this.activeSystemId = this.selectedSystemId;
            const O = X(S);
            this.selectedObjectId = ((q = O.systems.find(($) => $.id === this.activeSystemId)) == null ? void 0 : q.primaryObjectId) ?? null, this.planetSystemId = this.selectedObjectId;
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
      return ((n = X(i(this.mapId)).systems.find((o) => o.id === this.activeSystemId)) == null ? void 0 : n.objects.find((o) => o.id === this.planetSystemId)) ?? null;
    }
    _preparePlanetLocations(a, n) {
      return ((a == null ? void 0 : a.planetLocations) ?? []).filter((o) => o.shape === n).map((o) => {
        var h, g, S, E, q, O;
        const l = (g = (h = game.scenes) == null ? void 0 : h.get) == null ? void 0 : g.call(h, o.sceneId), s = !!(l && ((S = game.user) != null && S.isGM || (E = l.testUserPermission) != null && E.call(l, game.user, "OBSERVER")));
        return {
          ...o,
          name: l ? s || (q = game.user) != null && q.isGM ? l.name || "Linked Scene" : "Restricted location" : "Missing linked scene",
          accessible: s,
          missing: !l,
          canRemove: !!((O = game.user) != null && O.isGM && !this.playerMode)
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
        var q, O, $;
        h.preventDefault(), h.stopPropagation();
        const g = s.dataset.unlinkPlanetScene ?? "", S = this.planetSystemId || this.selectedObjectId;
        if (!g || !this.activeSystemId || !S) return;
        const E = (($ = (O = (q = game.scenes) == null ? void 0 : q.get) == null ? void 0 : O.call(q, g)) == null ? void 0 : $.name) || "Scene";
        await j(this.mapId, this.activeSystemId, S, g) && ae(`${E} unlinked from this location.`);
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
        const g = await Bn(s), S = (E = X(i(this.mapId)).systems.find((q) => q.id === this.activeSystemId)) == null ? void 0 : E.objects.find((q) => q.id === h);
        if (!g || !S) {
          ie("Drop a Foundry Scene or Journal here.");
          return;
        }
        if (g.documentName === "Scene") {
          const q = [.../* @__PURE__ */ new Set([...S.sceneIds ?? [], g.id])];
          await c(this.mapId, this.activeSystemId, { ...S, sceneIds: q }), ae(`${g.name || "Scene"} linked to ${S.name}.`);
        } else if (g.documentName === "JournalEntry")
          await c(this.mapId, this.activeSystemId, { ...S, journalId: g.id }), ae(`${g.name || "Journal"} linked to ${S.name}.`);
        else {
          ie("Drop a Foundry Scene or Journal here.");
          return;
        }
      }), (l = a.querySelector("[data-unlink-linked-journal]")) == null || l.addEventListener("click", async (s) => {
        var S;
        s.preventDefault(), s.stopPropagation();
        const h = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !h) return;
        const g = (S = X(i(this.mapId)).systems.find((E) => E.id === this.activeSystemId)) == null ? void 0 : S.objects.find((E) => E.id === h);
        g && await c(this.mapId, this.activeSystemId, { ...g, journalId: "" });
      }));
    }
    _openPlanetLocation(a) {
      var l, s, h;
      const n = this._getPlanetLocationItem(a), o = n ? (s = (l = game.scenes) == null ? void 0 : l.get) == null ? void 0 : s.call(l, n.sceneId) : null;
      if (!n || !o || !n.accessible) {
        ie(n != null && n.missing ? "That location is unavailable." : "You do not have permission to view that scene.");
        return;
      }
      o.view ? o.view() : (h = o.sheet) == null || h.render(!0);
    }
    async _removePlanetLocation(a, n) {
      var l;
      if (!((l = game.user) != null && l.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const o = this._getPlanetLocationItem(a);
      !o || !await xe(this.mapId, this.activeSystemId, this.planetSystemId, a) || (this._syncPlanetLocations(n), ae(`${o.name} removed from the surface.`));
    }
    async _clearPlanetLocations(a) {
      var l, s;
      if (!((l = game.user) != null && l.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const n = this._getPlanetObject(), o = this._preparePlanetLocations(n, (s = Ne(n)) == null ? void 0 : s.shape);
      for (const h of o) await xe(this.mapId, this.activeSystemId, this.planetSystemId, h.id);
      this._syncPlanetLocations(a), o.length && ae(`Cleared ${o.length} surface location${o.length === 1 ? "" : "s"}.`);
    }
    async _placePlanetLocation(a, n, o) {
      var g;
      if (!((g = game.user) != null && g.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const l = await ls(a);
      if (!l) {
        ie("Drop a Foundry Scene onto the 3D surface.");
        return;
      }
      const s = this._getPlanetObject();
      if (!(s != null && s.sceneIds.includes(l.id))) {
        ie(`Link ${l.name || "this scene"} to the object before placing it on the surface.`);
        return;
      }
      await Ie(this.mapId, this.activeSystemId, this.planetSystemId, { ...n, sceneId: l.id }) && (this._syncPlanetLocations(o), ae(`${l.name || "Scene"} placed on the ${n.shape}. Drag it again to move it.`));
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
      var O;
      const o = X(i(this.mapId));
      if (!o.systems.find(($) => $.id === a)) return !1;
      const s = r(o, {
        playerMode: this.playerMode,
        selectedSystemId: a,
        selectedRouteId: null
      });
      if (!((O = s == null ? void 0 : s.systems) != null && O.some(($) => $.id === a))) return !1;
      const h = String(n.focusId || a).slice(0, 80), g = ["distress", "warning", "objective", "custom"].includes(n.kind) ? n.kind : "custom", S = /^#[0-9a-f]{6}$/i.test(n.color ?? "") ? n.color : g === "distress" ? "#ff5c7a" : "#58d8ff", E = pe(Number(n.duration) || 0, 0, 6e5), q = pe(Number(n.zoom) || 1.45, St, bt);
      return this.externalFocus = {
        id: h,
        systemId: a,
        kind: g,
        color: S,
        label: String(n.label || (g === "distress" ? "Distress signal" : "Signal located")).slice(0, 120)
      }, this.selectedFactionId = "", this.selectedSystemId = a, this.planetSystemId = null, this.selectedRouteId = null, this._pendingFocusZoom = q, this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, await this.render({ force: !0 }), this.bringToFront(), E > 0 && (this._externalFocusTimeout = globalThis.setTimeout(() => {
        var $;
        (($ = this.externalFocus) == null ? void 0 : $.id) === h && this.clearSystemFocus(h);
      }, E)), !0;
    }
    async focusLocation(a, n = "", o = {}) {
      const s = X(i(this.mapId)).systems.find((g) => g.id === a), h = (s == null ? void 0 : s.objects.find((g) => g.id === n)) ?? (s == null ? void 0 : s.objects.find((g) => g.id === s.primaryObjectId));
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
      const l = o.getBoundingClientRect(), s = this.zoom, h = n.querySelector(".gmf-map-background") ? 1 : St, g = pe(s * Math.exp(-a.deltaY * 15e-4), h, bt), S = a.clientX - l.left, E = a.clientY - l.top, q = (S - this.panX) / s, O = (E - this.panY) / s;
      this.zoom = g, this.panX = S - q * g, this.panY = E - O * g, this._applyViewportTransform(n);
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
      let E = this._pointerToMapPercent(a, n), q = !1, O = null;
      const $ = Array.from(n.querySelectorAll(`[data-route-from="${o.dataset.systemId}"]`)), Z = Array.from(n.querySelectorAll(`[data-route-to="${o.dataset.systemId}"]`)), W = () => {
        h ? h.previewDrag(g, E) : (o.style.left = `${E.x}%`, o.style.top = `${E.y}%`, this._updateConnectedRoutes($, Z, E.x, E.y));
      }, re = (f) => {
        const I = Math.abs(f.clientX - l), b = Math.abs(f.clientY - s);
        !q && I <= 4 && b <= 4 || (q = !0, o.classList.add("is-dragging"), E = this._pointerToMapPercent(f, n), o.dataset.dragged = "true", !O && (O = requestAnimationFrame(() => {
          O = null, W();
        })));
      }, ce = async (f) => {
        if (O && cancelAnimationFrame(O), o.classList.remove("is-dragging"), window.removeEventListener("pointermove", re), window.removeEventListener("pointerup", ce), window.removeEventListener("pointercancel", ce), (f == null ? void 0 : f.type) === "pointercancel") {
          o.dataset.dragged = "false", h ? h.cancelDrag() : q && this.render({ force: !0 });
          return;
        }
        if (!(o.isConnected === !1 || S !== this.activeSystemId) && q) {
          W();
          const I = h == null ? void 0 : h.finishDrag(g, E);
          if (S)
            try {
              await be(this.mapId, S, g, E.x, E.y, I) || this.render({ force: !0 });
            } catch {
              h == null || h.cancelDrag(), ie("Could not save the location position."), this.render({ force: !0 });
            }
          else await Se(this.mapId, o.dataset.systemId, E.x, E.y);
        }
      };
      window.addEventListener("pointermove", re), window.addEventListener("pointerup", ce, { once: !0 }), window.addEventListener("pointercancel", ce, { once: !0 });
    }
    _startMarkerResize(a, n) {
      var O;
      if (a.button !== 0) return;
      a.preventDefault(), a.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
      const o = pe(Number(n.dataset.iconSize) || 28, 18, 56), l = n.getBoundingClientRect(), s = l.left + l.width / 2, h = l.top + l.height / 2, g = Math.hypot(a.clientX - s, a.clientY - h);
      let S = o;
      n.dataset.dragged = "true", n.classList.add("is-resizing"), (O = n.setPointerCapture) == null || O.call(n, a.pointerId);
      const E = ($) => {
        const Z = Math.hypot($.clientX - s, $.clientY - h);
        S = pe(Math.round(o + (Z - g) / Math.max(this.zoom, 0.01)), 18, 56), n.dataset.iconSize = String(S), n.style.setProperty("--gmf-system-size", `${S}px`);
      }, q = async () => {
        if (n.classList.remove("is-resizing"), window.removeEventListener("pointermove", E), window.removeEventListener("pointerup", q), window.removeEventListener("pointercancel", q), globalThis.setTimeout(() => {
          n.dataset.dragged = "false";
        }, 0), S !== o)
          if (this.activeSystemId) {
            const $ = X(i(this.mapId)).systems.find((W) => W.id === this.activeSystemId), Z = $ == null ? void 0 : $.objects.find((W) => W.id === n.dataset.systemId);
            Z && await c(this.mapId, this.activeSystemId, { ...Z, iconSize: S });
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
      var re;
      if (!((re = game.user) != null && re.isGM) || this.playerMode || a.target.closest(".gmf-context-menu")) return;
      a.preventDefault(), a.stopPropagation();
      const o = a.target.closest("[data-route-id]"), l = a.target.closest("[data-system-id]"), s = this._pointerToMapPercent(a, n);
      this._contextTarget = o ? { type: "route", id: o.dataset.routeId, position: s } : l ? { type: "system", id: l.dataset.systemId, position: s } : { type: "stage", id: null, position: s };
      const h = n.querySelector("[data-gmf-context-menu]");
      if (!h) return;
      h.querySelectorAll("[data-context-show]").forEach((ce) => {
        ce.hidden = ce.dataset.contextShow !== this._contextTarget.type;
      }), h.hidden = !1;
      const g = h.offsetWidth || 184, S = h.offsetHeight || 260, q = n.querySelector(".gmf-map-stage").getBoundingClientRect(), O = a.clientX - q.left, $ = a.clientY - q.top, Z = Math.max(4, q.width - g - 4), W = Math.max(4, q.height - S - 4);
      h.style.left = `${pe(O, 4, Z)}px`, h.style.top = `${pe($, 4, W)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(n), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu(a = null) {
      const n = a ?? this.element ?? null, o = n == null ? void 0 : n.querySelector("[data-gmf-context-menu]");
      o && (o.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(a, n) {
      a.preventDefault(), a.stopPropagation();
      const o = a.currentTarget.dataset.contextAction, l = this._contextTarget;
      this._hideContextMenu(n), l && (o === "add-system" ? this._openCreationPanel("system", { x: l.position.x, y: l.position.y }) : o === "add-entity" ? this.activeSystemId && this._openCreationPanel("entity", { x: l.position.x, y: l.position.y }) : o === "manage-factions" ? (this.creationPanel = null, this.factionRegistry = !0, this.render({ force: !0 })) : o === "add-faction" ? this._openCreationPanel("faction") : o === "edit-map-details" ? this._openCreationPanel("map", X(i(this.mapId)), this.mapId) : o === "export-map" ? C(this.mapId) : o === "edit-system" ? this._openEditPanel("system", l.id) : o === "edit-entity" ? this.activeSystemId && this._openEditPanel("entity", l.id) : o === "add-route-from-marker" ? this._openCreationPanel("route", { fromSystemId: l.id }) : o === "reveal-system" ? await x(this.mapId, l.id) : o === "hide-system" ? await B(this.mapId, l.id, !0) : o === "delete-system" ? await this._confirmDeleteSystem(l.id) : o === "reveal-entity" ? this.activeSystemId && await R(this.mapId, this.activeSystemId, l.id, "players") : o === "hide-entity" ? this.activeSystemId && await R(this.mapId, this.activeSystemId, l.id, "gm") : o === "delete-entity" ? this.activeSystemId && await this._confirmDeleteObject(this.activeSystemId, l.id) : o === "edit-route" ? this._openEditPanel("route", l.id) : o === "reveal-route" ? await H(this.mapId, l.id, this.activeSystemId ?? "") : o === "hide-route" ? await A(this.mapId, l.id, !0, this.activeSystemId ?? "") : o === "delete-route" && await this._confirmDeleteRoute(l.id));
    }
    async _confirmDeleteSystem(a) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, We) && await D(this.mapId, a);
    }
    async _confirmDeleteObject(a, n) {
      await Dialog.confirm({ title: "Delete Location", content: "<p>Delete this location and its linked content?</p>" }) && (await U(this.mapId, a, n), this.selectedObjectId = null);
    }
    _openCreationPanel(a, n = {}, o = null) {
      var S, E, q, O;
      if (!((S = game.user) != null && S.isGM) || this.playerMode) return;
      const l = X(i(this.mapId)), s = this.activeSystemId ? ((E = l.systems.find(($) => $.id === this.activeSystemId)) == null ? void 0 : E.objects) ?? [] : l.systems;
      if (a === "route" && s.length < 2) {
        ie(this.activeSystemId ? "Create at least two locations before adding a route." : "Create at least two systems before adding a route.");
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
          toSystemId: n.toSystemId || ((O = s.find(($) => $.id !== h)) == null ? void 0 : O.id) || ""
        }
      }, this.factionRegistry = !1, a === "faction" && this.selectedFactionId === o) {
        this.render({ force: !0 });
        return;
      }
      this.selectedFactionId = "", this.selectedSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null, this.render({ force: !0 });
    }
    _openEditPanel(a, n, o = !1) {
      var h, g;
      const l = X(i(this.mapId)), s = a === "system" ? l.systems.find((S) => S.id === n) : a === "entity" ? (h = l.systems.find((S) => S.id === this.activeSystemId)) == null ? void 0 : h.objects.find((S) => S.id === n) : a === "route" ? this.activeSystemId ? (g = l.systems.find((S) => S.id === this.activeSystemId)) == null ? void 0 : g.routes.find((S) => S.id === n) : l.routes.find((S) => S.id === n) : l.factions.find((S) => S.id === n);
      s && this._openCreationPanel(a, o ? { ...s, showOrbitEditor: o } : s, n);
    }
    openEditor(a, n = {}) {
      var o;
      return !((o = game.user) != null && o.isGM) || this.playerMode || a === "faction" && !Re() ? !1 : (this._disposePlanetRenderer(), this.planetSystemId = null, a === "entity" ? (this.activeSystemId = n.systemId || this.activeSystemId, this.selectedSystemId = this.activeSystemId) : a === "route" ? this.activeSystemId = n.systemId || null : ["map", "system", "faction"].includes(a) && (this.activeSystemId = null), a === "map" ? this._openCreationPanel("map", X(i(this.mapId)), this.mapId) : n.id ? this._openEditPanel(a, n.id) : this._openCreationPanel(a, n.defaults || {}), !0);
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
        const O = n.dataset.createKind || "", $ = Object.fromEntries(new FormData(n).entries());
        a.querySelectorAll('[form="gmf-panel-editor-form"][name]').forEach((f) => {
          f instanceof HTMLInputElement && ["checkbox", "radio"].includes(f.type) && !f.checked || ($[f.name] = f.value);
        }), O === "entity" && (Object.assign($, s == null ? void 0 : s()), $.markerImage = $.useCustomMarker === "true" ? $.markerImage ?? "" : "", delete $.useCustomMarker);
        const Z = Number($.x), W = Number($.y), re = this.creationPanel, ce = (re == null ? void 0 : re.data) ?? {};
        re != null && re.editId && ($.id = re.editId), this.creationPanel = null;
        let m = null;
        if (O === "map") m = await T(this.mapId, { ...ce, ...$ });
        else if (O === "system")
          delete $.x, delete $.y, m = await u(this.mapId, re != null && re.editId ? $ : { ...$, x: Z, y: W });
        else if (O === "entity" && this.activeSystemId) {
          const { orbit: f, orbits: I, ...b } = ce;
          if (m = await c(this.mapId, this.activeSystemId, { ...b, ...$, x: Z, y: W }), !m) {
            this.creationPanel = re;
            return;
          }
        } else if (O === "route") {
          if (!$.fromSystemId || !$.toSystemId || $.fromSystemId === $.toSystemId) {
            ie(`Choose two different ${this.activeSystemId ? "locations" : "systems"} for the route.`), this._openCreationPanel("route", { ...ce, ...$ }, (re == null ? void 0 : re.editId) ?? null);
            return;
          }
          m = await p(this.mapId, { ...ce, ...$ }, this.activeSystemId ?? "");
        } else O === "faction" && (delete $.x, delete $.y, m = await d(this.mapId, $), this.factionRegistry = !!(m && !this.selectedFactionId && !this.factionPanelOpen));
        !m && (O === "system" || O === "faction") && (this.creationPanel = { ...re, data: { ...ce, ...$ } }), m != null && m.id && (O === "system" && (this.selectedSystemId = m.id), O === "entity" && (this.selectedObjectId = m.id), O === "route" && (this.selectedRouteId = m.id)), this.render({ force: !0 });
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
        const S = (W, re) => {
          var ce;
          return ((ce = a.querySelector(`[name="${W}"]`)) == null ? void 0 : ce.value) || re;
        }, E = S("kind", "planet"), q = S("status", "known"), O = S("iconStyle", E), $ = S("markerImage", "").trim();
        n.className = `gmf-system gmf-system--${E} gmf-icon--${O} gmf-status--${q}${$ ? " has-custom-marker" : ""}`, n.style.setProperty("--gmf-faction-color", S("iconColor", "#58d8ff")), n.style.setProperty("--gmf-system-size", "42px"), l && (l.textContent = S("name", "New Location"));
        const Z = ++s;
        if (o && $) {
          const W = document.createElement("img");
          W.className = "gmf-custom-marker__image", W.src = $, W.alt = "", W.draggable = !1, o.replaceChildren(W);
        } else if (o && Mt.includes(O)) {
          const W = await globalThis.renderTemplate(`${t}/celestial-icon.hbs`, { system: { iconStyle: O } });
          Z === s && (o.innerHTML = W);
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
      }, We) && await Q(this.mapId, a, this.activeSystemId ?? "");
    }
    async _travelToSystem(a, n) {
      const o = X(i(this.mapId)), l = o.systems.find((g) => g.id === o.currentSystemId), s = o.systems.find((g) => g.id === a);
      if (!s) return;
      if (!l) {
        await ee(this.mapId, s.id), ae(`Current location set to ${s.name}.`);
        return;
      }
      if (l.id === s.id) {
        ae(`${s.name} is already the current location.`);
        return;
      }
      if (!G(o, l.id, s.id)) {
        ie(`No direct route from ${l.name} to ${s.name}.`);
        return;
      }
      se(this.mapId, l.id, s.id), await this._animateShipTravel(l, s, n), await ee(this.mapId, s.id), ae(`Arrived at ${s.name}.`);
    }
    async _travelToObject(a, n, o) {
      const l = X(i(this.mapId)), s = l.systems.find((E) => E.id === a), h = s == null ? void 0 : s.objects.find((E) => E.id === l.currentLocation.objectId), g = s == null ? void 0 : s.objects.find((E) => E.id === n);
      if (!s || !g) return;
      if (!h || l.currentLocation.systemId !== s.id) {
        await w(this.mapId, s.id, g.id), ae(`Current location set to ${g.name}.`);
        return;
      }
      if (h.id === g.id) {
        ae(`${g.name} is already the current location.`);
        return;
      }
      if (!G({ routes: s.routes }, h.id, g.id)) {
        ie(`No direct route from ${h.name} to ${g.name}.`);
        return;
      }
      oe(this.mapId, s.id, h.id, g.id), await this._animateShipTravel(h, g, o), await w(this.mapId, s.id, g.id), ae(`Arrived at ${g.name}.`);
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
        ie(`Journal "${a.journalId}" was not found.`);
        return;
      }
      (l = n.sheet) == null || l.render(!0);
    }
    _getSelectedRawSystem() {
      var n;
      const a = X(i(this.mapId));
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
        const O = s.querySelector("i");
        O && (O.className = this.planetStatic ? "fa-solid fa-cube" : "fa-solid fa-image");
      }
      if (this.planetStatic) {
        h.forEach((q) => q.disabled = !0);
        return;
      }
      try {
        const { createPlanetRenderer: q } = await import("./chunks/planet-renderer-t-HvFdDj.js");
        if (l !== this._planetGeneration || !o.isConnected) return;
        h.forEach((O) => O.disabled = !1), this._planetRenderer = q(o, {
          texture: n.texture,
          color: n.color,
          appearancePreset: n.preset,
          shape: n.shape,
          finish: n.finish,
          detailStrength: n.detailStrength,
          locations: ((g = this._getPlanetObject()) == null ? void 0 : g.planetLocations) ?? [],
          canPlaceLocations: !!((S = game.user) != null && S.isGM && !this.playerMode),
          onLocationDrop: (O, $) => void this._placePlanetLocation(O, $, a),
          onInvalidLocationDrop: () => ie("Drop the scene directly onto the visible 3D surface."),
          onMarkerHover: (O) => {
            var Z;
            const $ = this._getPlanetLocationItem(O.id);
            $ && ((Z = this._planetLocationCallout) == null || Z.show($));
          },
          onMarkerLeave: () => {
            var O;
            return (O = this._planetLocationCallout) == null ? void 0 : O.scheduleHide();
          },
          onMarkerPosition: (O) => {
            var $;
            return ($ = this._planetLocationCallout) == null ? void 0 : $.setAnchor(O);
          },
          onMarkerOpen: (O) => this._openPlanetLocation(O.id),
          onMarkerContextMenu: (E = game.user) != null && E.isGM && !this.playerMode ? (O) => void this._removePlanetLocation(O.id, a) : null,
          isVisible: () => !this.minimized,
          onPaused: (O) => {
            const $ = a.querySelector("[data-action='planet-pause']");
            if ($) {
              const Z = O ? "Resume rotation" : "Pause rotation";
              $.setAttribute("title", Z), $.setAttribute("aria-label", Z), $.setAttribute("aria-pressed", String(O));
              const W = $.querySelector("i");
              W && (W.className = O ? "fa-solid fa-play" : "fa-solid fa-pause");
            }
          },
          onStopped: () => {
            h.forEach((O) => O.disabled = !0);
          }
        }), this._planetLocationCallout = ss({ host: o });
      } catch {
        h.forEach((q) => q.disabled = !0);
      }
    }
  }, J(qe, "DEFAULT_OPTIONS", {
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
  }), J(qe, "PARTS", {
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
      super._attachPartListeners(d, T, v), ft(this, T), T.querySelectorAll("[data-player-open-map]").forEach((M) => {
        M.addEventListener("click", () => {
          r(M.dataset.playerOpenMap, { playerMode: !0 }), this.close();
        });
      });
    }
    async close(d = {}) {
      return u(this), super.close(d);
    }
  }, J(c, "DEFAULT_OPTIONS", {
    id: "galaxy-map-player-chooser",
    classes: ["galaxy-map", "galaxy-map-framework", "gmf-manager-window", "gmf-map-chooser-window"],
    window: { title: "Choose Galaxy Map", icon: "fa-solid fa-satellite", resizable: !0 },
    position: { width: 480, height: 420 }
  }), J(c, "PARTS", { main: { template: `${t}/player-map-chooser.hbs` } }), c;
}
function ms(e, t) {
  var c;
  const { setting: i, title: r, icon: u } = nt[t];
  return c = class extends pt() {
    constructor() {
      super(...arguments);
      J(this, "draft", null);
    }
    async _prepareContext(T) {
      var P;
      const v = await super._prepareContext(T), M = !!((P = game.user) != null && P.isGM && Re());
      return { ...v, canEdit: M, title: r, scale: t, ratings: M ? this.draft ?? Tt(t) : [] };
    }
    _onRender(T, v) {
      var H;
      super._onRender(T, v);
      const P = this.element.querySelector("[data-faction-ratings]");
      if (!P) return;
      const x = () => Array.from(P.querySelectorAll("[data-rating-label]"), (B) => ({
        id: B.dataset.ratingLabel,
        label: B.value
      }));
      (H = P.querySelector("[data-add-rating]")) == null || H.addEventListener("click", () => {
        this.draft = [...x(), { id: Te(t), label: "" }], this.render({ force: !0 });
      }), P.querySelectorAll("[data-remove-rating]").forEach((B) => {
        B.addEventListener("click", () => {
          this.draft = x().filter((R) => R.id !== B.dataset.removeRating), this.render({ force: !0 });
        });
      }), P.addEventListener("submit", async (B) => {
        var Q;
        if (B.preventDefault(), !((Q = game.user) != null && Q.isGM) || !Re()) return;
        const R = P.querySelector("[data-rating-status]"), A = x().map(({ id: ee, label: w }) => ({ id: ee, label: w.trim() })), D = A.map((ee) => ee.label.toLowerCase());
        if (D.includes("") || new Set(D).size !== A.length) {
          R.textContent = "Enter a unique name for each rating.";
          return;
        }
        if (t === "prominence" && D.includes("unrated")) {
          R.textContent = "Unrated is reserved for factions without a prominence rating.";
          return;
        }
        const U = P.querySelector("fieldset");
        if (!U.disabled) {
          U.disabled = !0, R.textContent = "Saving…";
          try {
            await game.settings.set(he, i, { ratings: A }), this.draft = null, R.textContent = `${r} ratings saved.`;
          } catch (ee) {
            R.textContent = `Could not save ${t} ratings.`, console.error(`Galaxy Map failed to save ${t} ratings`, ee);
          } finally {
            U.disabled = !1;
          }
        }
      });
    }
  }, J(c, "DEFAULT_OPTIONS", {
    id: `galaxy-map-${t}-settings`,
    window: { title: `${r} Ratings`, icon: u, resizable: !0 },
    position: { width: 520, height: 480 }
  }), J(c, "PARTS", {
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
  var U, Q, ee;
  t = t || !((U = game.user) != null && U.isGM);
  const c = X(e), p = t ? c.systems.filter(fs) : c.systems, d = new Set(p.map((w) => w.id)), T = u ? [] : c.factions.filter((w) => !t || w.visibility === "players"), v = new Map(T.filter((w) => w.kind === "major").map((w) => [w.id, w])), M = p.map((w) => {
    const Y = ps(w, t), te = Y ? "unknown" : w.type, C = Y ? "diamond" : hs(te, w.iconStyle), G = Y ? "" : w.markerImage;
    return {
      ...w,
      image: w.image,
      sceneIds: [...w.sceneIds],
      journalId: w.journalId,
      planetPreset: w.planetPreset,
      planetShape: w.planetShape,
      planetTexture: w.planetTexture,
      planetColor: w.planetColor,
      iconStyle: C,
      displayMarkerImage: G,
      hasCustomMarker: !!G,
      displayName: Y ? "???" : w.name,
      displayDescription: Y ? "Unresolved sensor contact. Details are not available." : w.description,
      displayType: te,
      displayStatus: Y ? "undiscovered" : w.status,
      ...dn(w, v, Y, u),
      objects: w.objects.filter((se) => !t || Xe(w, se) === "players").map((se) => ({
        ...se,
        ...dn(se, v, Y || t && se.status === "undiscovered", u)
      })),
      obscured: Y,
      isCurrent: w.id === c.currentSystemId,
      isSelected: w.id === i,
      gmOnly: w.visibility === "gm",
      animatedCelestial: !G && Mt.includes(C),
      hasAlert: ["danger", "locked"].includes(Y ? "undiscovered" : w.status),
      alertLabel: w.status === "danger" ? "Hazard advisory" : w.status === "locked" ? "Restricted access" : "",
      hasJournal: !!(!Y && w.journalId),
      hasScenes: !!(!Y && w.sceneIds.length),
      showImage: !!(!Y && w.image),
      canInspectSystem: !!Ne({ ...w, obscured: Y })
    };
  }), P = M.filter((w) => !w.obscured), x = T.map((w) => {
    const Y = P.find((j) => j.id === w.headquartersSystemId), { id: te, name: C, color: G, emblem: se, tagline: oe, type: ae, description: ie, visibility: Se, kind: be, prominence: Ie, reputation: xe } = w;
    return {
      id: te,
      name: C,
      color: G,
      emblem: se,
      tagline: oe,
      type: ae,
      description: ie,
      visibility: Se,
      kind: be,
      prominence: Ie,
      reputation: xe,
      prominencePercent: w.prominencePercent,
      reputationPercent: w.reputationPercent,
      systemProminencePercent: Object.fromEntries(P.filter((j) => Object.hasOwn(w.systemProminencePercent, j.id)).map((j) => [j.id, w.systemProminencePercent[j.id]])),
      parentFactionId: v.has(w.parentFactionId) ? w.parentFactionId : "",
      systemProminence: Object.fromEntries(P.filter((j) => Object.hasOwn(w.systemProminence, j.id)).map((j) => [j.id, w.systemProminence[j.id]])),
      gmNotes: t ? void 0 : w.gmNotes,
      headquarters: Y ? { id: Y.id, name: Y.displayName } : null,
      controlledSystems: P.filter((j) => j.factionId === te).map((j) => ({ id: j.id, name: j.displayName }))
    };
  }), H = c.routes.filter((w) => !t || w.visibility === "players").filter((w) => d.has(w.fromSystemId) && d.has(w.toSystemId)).map((w) => {
    const Y = M.find((C) => C.id === w.fromSystemId), te = M.find((C) => C.id === w.toSystemId);
    return {
      ...w,
      from: Y,
      to: te,
      fromName: (Y == null ? void 0 : Y.displayName) ?? w.fromSystemId,
      toName: (te == null ? void 0 : te.displayName) ?? w.toSystemId,
      isSelected: w.id === r,
      connectsCurrent: w.fromSystemId === c.currentSystemId || w.toSystemId === c.currentSystemId,
      gmOnly: w.visibility === "gm"
    };
  }), B = H.find((w) => w.id === r) ?? null, R = B ? null : M.find((w) => w.id === i) ?? null;
  R && (R.isSelected = !0);
  const A = M.find((w) => w.id === c.currentSystemId) ?? M[0] ?? null, D = R && A && R.id !== A.id ? H.find((w) => w.fromSystemId === A.id && w.toSystemId === R.id || w.toSystemId === A.id && w.fromSystemId === R.id) : null;
  return R && (R.canTravel = !!D, R.travelRouteId = (D == null ? void 0 : D.id) ?? "", R.isCurrent = R.id === (A == null ? void 0 : A.id), R.isDestination = !!(D && !R.isCurrent)), H.forEach((w) => {
    w.isActive = w.isSelected || w.id === (D == null ? void 0 : D.id);
  }), {
    ...c,
    systems: M,
    routes: H,
    factions: x,
    selectedSystem: R,
    selectedRoute: B,
    currentSystem: A,
    selectedType: B ? "route" : R ? "system" : null,
    playerMode: t,
    isGM: ((Q = game.user) == null ? void 0 : Q.isGM) ?? !1,
    canEdit: ((ee = game.user) == null ? void 0 : ee.isGM) && !t
  };
}
function gs(e) {
  var u;
  if (!e) return null;
  const t = X(e), i = new Map(t.systems.map((c) => [c.id, c])), r = new Map(t.factions.map((c) => [c.id, c]));
  return {
    ...t,
    travelApprovalModeLabel: ((u = qt.find((c) => c.value === t.travelApprovalMode)) == null ? void 0 : u.label) ?? "Unanimous agreement",
    factions: t.factions.map((c) => ({
      ...c,
      systemCount: t.systems.filter((p) => p.factionId === c.id).length
    })),
    systems: t.systems.map((c) => {
      var p;
      return {
        ...c,
        factionName: ((p = r.get(c.factionId)) == null ? void 0 : p.name) ?? "Unaffiliated"
      };
    }),
    routes: [
      ...t.routes.map((c) => {
        var p, d;
        return {
          ...c,
          systemId: "",
          scopeLabel: "Galaxy route",
          fromName: ((p = i.get(c.fromSystemId)) == null ? void 0 : p.name) ?? c.fromSystemId,
          toName: ((d = i.get(c.toSystemId)) == null ? void 0 : d.name) ?? c.toSystemId
        };
      }),
      ...t.systems.flatMap((c) => {
        const p = new Map(c.objects.map((d) => [d.id, d]));
        return c.routes.map((d) => {
          var T, v;
          return {
            ...d,
            systemId: c.id,
            scopeLabel: `Inside ${c.name}`,
            fromName: ((T = p.get(d.fromSystemId)) == null ? void 0 : T.name) ?? d.fromSystemId,
            toName: ((v = p.get(d.toSystemId)) == null ? void 0 : v.name) ?? d.toSystemId
          };
        });
      })
    ]
  };
}
function Ss(e) {
  Nn(e), e.querySelectorAll("[data-use-custom-marker]").forEach((H) => {
    const B = (H.closest("form") ?? e).querySelector("[data-custom-marker-field]"), R = (B == null ? void 0 : B.querySelector('[name="markerImage"]')) ?? null, A = (B == null ? void 0 : B.querySelectorAll("button")) ?? [], D = () => {
      const U = H.checked;
      B == null || B.classList.toggle("is-disabled", !U), R && (R.disabled = !U), A.forEach((Q) => {
        Q.disabled = !U;
      }), !U && (R != null && R.value) && (R.value = "", R.dispatchEvent(new Event("input", { bubbles: !0 })), R.dispatchEvent(new Event("change", { bubbles: !0 })));
    };
    H.addEventListener("change", D), D();
  });
  const t = e.querySelector("[data-texture-upload-fields]"), i = e.querySelector('[name="planetTexture"]'), r = e.querySelector('[name="planetPreset"]'), u = e.querySelector('[name="planetShape"]'), c = e.querySelector('[name="planetFinish"]'), p = e.querySelector('[name="planetColor"]'), d = e.querySelector("[data-texture-guide]"), T = e.querySelector("[data-texture-guide-section]"), v = e.querySelectorAll("[data-texture-guide-preview]"), M = () => {
    if (!r || !u) return;
    const H = bn(r.value, u.value);
    r.replaceChildren(...Sn(u.value).map((B) => {
      const R = document.createElement("option");
      return R.value = B.value, R.textContent = B.label, R;
    })), r.value = H;
  }, P = () => {
    const H = (r == null ? void 0 : r.value) === "custom", B = (r == null ? void 0 : r.value) === "none";
    return t && (t.hidden = !H), T && (T.hidden = !H), i && (i.required = H), u && (u.disabled = B), c && (c.disabled = B), p && (p.disabled = (r == null ? void 0 : r.value) !== "color"), H;
  }, x = () => {
    var B;
    if (!d) return;
    const H = (B = i == null ? void 0 : i.value) == null ? void 0 : B.trim();
    H ? d.dataset.hasTexture = "true" : delete d.dataset.hasTexture, v.forEach((R) => {
      R.onerror = H ? () => {
        R.hidden = !0;
      } : null, R.hidden = !H, H ? R.src = H : R.removeAttribute("src");
    });
  };
  r == null || r.addEventListener("change", () => {
    !P() && (i != null && i.value) && (i.value = "", i.dispatchEvent(new Event("change", { bubbles: !0 })));
  }), i == null || i.addEventListener("change", x), u == null || u.addEventListener("change", () => {
    d && (d.dataset.shape = u.value), M(), P();
  }), M(), P(), x();
}
function bs(e) {
  const { notifyError: t, notifyInfo: i, requireGM: r, refreshOpenApps: u, closeOpenMap: c, getOpenMapViews: p } = e, d = (m) => foundry.utils.deepClone(m), T = (m) => game.socket.emit(_e, { action: "refresh", mapId: m });
  function v() {
    return d(game.settings.get(he, _t) ?? {});
  }
  async function M(m) {
    return r("save galaxy map data") && await game.settings.set(he, _t, m ?? {}), m;
  }
  function P(m) {
    const f = v();
    return f[m] ? d(f[m]) : null;
  }
  async function x(m, f, { refresh: I = !0 } = {}) {
    return m[f] = X(m[f]), await M(m), I && u(f), T(f), m[f];
  }
  async function H(m = {}) {
    if (!r("create galaxy maps")) return null;
    const f = v(), I = X(m);
    return f[I.id] = I, await M(f), u(I.id), d(I);
  }
  async function B(m, f = {}) {
    if (!r("update galaxy maps")) return null;
    const I = v();
    if (!I[m])
      return t(`Map "${m}" was not found.`), null;
    const b = X({ ...f, id: m });
    return I[m] = b, await M(I), u(m), d(b);
  }
  async function R(m, f = {}) {
    const I = P(m);
    return !r("update galaxy map metadata") || !I ? (I || t(`Map "${m}" was not found.`), null) : B(m, {
      ...I,
      title: f.title,
      subtitle: f.subtitle,
      description: f.description,
      backgroundImage: f.backgroundImage,
      visibility: f.visibility,
      travelApprovalMode: f.travelApprovalMode
    });
  }
  async function A(m) {
    if (!r("delete galaxy maps")) return !1;
    const f = v();
    return f[m] ? (delete f[m], await M(f), c(m), u(), !0) : !1;
  }
  async function D(m) {
    if (!r("duplicate galaxy maps")) return null;
    const f = P(m);
    if (!f)
      return t(`Map "${m}" was not found.`), null;
    const I = X({ ...f, id: Te("map"), title: `${f.title} Copy` }), b = v();
    return b[I.id] = I, await M(b), u(I.id), d(I);
  }
  async function U(m, f = {}) {
    var me;
    if (!r("save star systems")) return null;
    const I = v();
    if (!I[m])
      return t(`Map "${m}" was not found.`), null;
    const b = X(I[m]), _ = b.systems.find((fe) => fe.id === f.id);
    if (f.factionId && f.factionId !== (_ == null ? void 0 : _.factionId) && !b.factions.some((fe) => fe.id === f.factionId))
      return t("Choose a faction on this galaxy map."), null;
    const L = f.objects ?? (_ == null ? void 0 : _.objects) ?? [], z = (_ == null ? void 0 : _.primaryObjectId) || ((me = L[0]) == null ? void 0 : me.id), F = ["image", "sceneIds", "planetLocations", "journalId", "planetPreset", "planetShape", "planetFinish", "planetTexture", "planetColor"], V = L.map((fe) => fe.id !== z ? fe : en({
      ...fe,
      ...Object.fromEntries(F.filter((we) => f[we] !== void 0).map((we) => [we, f[we]]))
    })), ne = qn({ ..._, ...f, objects: V }), ue = b.systems.findIndex((fe) => fe.id === ne.id);
    return ue >= 0 ? b.systems[ue] = ne : b.systems.push(ne), I[m] = b, await x(I, m), d(ne);
  }
  async function Q(m, f, I = {}) {
    var ne, ue, me;
    if (!r("save locations")) return null;
    const b = v(), _ = b[m] ? X(b[m]) : null, L = _ == null ? void 0 : _.systems.find((fe) => fe.id === f);
    if (!_ || !L) return null;
    const z = L.objects.findIndex((fe) => fe.id === I.id), F = L.objects[z], V = en({ orbits: F == null ? void 0 : F.orbits, orbit: F == null ? void 0 : F.orbit, ...I });
    if (V.orbit && !At(L.objects, V.id, V.orbit))
      return t("Choose an orbit that exists in this system and does not depend on this location."), null;
    if (F != null && F.orbit || (ne = F == null ? void 0 : F.orbits) != null && ne.length) {
      const fe = et(), we = ee(m, f), Me = It(L.objects).positions(we.aspect, fe, we.motion);
      F.orbit && !V.orbit && gt(V, Me.get(V.id)), F.orbit && V.orbit && V.orbit.epoch !== F.orbit.epoch && V.orbit.centerId === F.orbit.centerId && V.orbit.orbitId === F.orbit.orbitId && V.orbit.angle === F.orbit.angle && (V.orbit.angle = wn(F.orbit, fe, we.motion));
      for (const Ce of L.objects)
        ((ue = Ce.orbit) == null ? void 0 : ue.centerId) === V.id && !((me = V.orbits) != null && me.some((Ue) => Ue.id === Ce.orbit.orbitId)) && gt(Ce, Me.get(Ce.id));
    }
    return z >= 0 ? L.objects[z] = V : L.objects.push(V), L.primaryObjectId || (L.primaryObjectId = V.id), b[m] = _, await x(b, m), d(V);
  }
  function ee(m, f) {
    var I;
    for (const b of p(m)) {
      const _ = (I = b.getOrbitGeometry) == null ? void 0 : I.call(b, f);
      if (_) return _;
    }
    return { aspect: vn, motion: !0 };
  }
  function w(m, f, I) {
    const b = f.objects.filter((F) => F.orbit && (F.id === I || F.orbit.centerId === I));
    if (!b.length) return;
    const { aspect: _, motion: L } = ee(m, f.id), z = It(f.objects).positions(_, et(), L);
    for (const F of b) gt(F, z.get(F.id));
  }
  const Y = (m, f, I) => {
    var b;
    for (const _ of p(m)) (b = _.refreshPlanetLocations) == null || b.call(_, f, I);
  };
  async function te(m, f, I, b = {}) {
    var ue;
    if (!r("place surface locations")) return null;
    const _ = v(), L = _[m] ? X(_[m]) : null, z = (ue = L == null ? void 0 : L.systems.find((me) => me.id === f)) == null ? void 0 : ue.objects.find((me) => me.id === I);
    if (!L || !z) return null;
    const F = String(b.sceneId || "");
    if (!z.sceneIds.includes(F))
      return t("Only scenes linked to this object can be placed on its surface."), null;
    const V = Ln(b), ne = z.planetLocations.findIndex((me) => me.sceneId === F && me.shape === V.shape);
    return ne >= 0 && (V.id = z.planetLocations[ne].id), ne >= 0 ? z.planetLocations[ne] = V : z.planetLocations.push(V), _[m] = X(L), await M(_), Y(m, f, I), game.socket.emit(_e, { action: "planet-locations", mapId: m, systemId: f, objectId: I }), d(V);
  }
  async function C(m, f, I, b) {
    var V;
    if (!r("remove surface locations")) return !1;
    const _ = v(), L = _[m] ? X(_[m]) : null, z = (V = L == null ? void 0 : L.systems.find((ne) => ne.id === f)) == null ? void 0 : V.objects.find((ne) => ne.id === I);
    if (!L || !z) return !1;
    const F = z.planetLocations.length;
    return z.planetLocations = z.planetLocations.filter((ne) => ne.id !== b), z.planetLocations.length === F ? !1 : (_[m] = X(L), await M(_), Y(m, f, I), game.socket.emit(_e, { action: "planet-locations", mapId: m, systemId: f, objectId: I }), !0);
  }
  async function G(m, f, I, b) {
    var L, z;
    if (!r("unlink scenes from locations")) return !1;
    const _ = (z = (L = P(m)) == null ? void 0 : L.systems.find((F) => F.id === f)) == null ? void 0 : z.objects.find((F) => F.id === I);
    return _ != null && _.sceneIds.includes(b) ? !!await Q(m, f, { ..._, sceneIds: _.sceneIds.filter((F) => F !== b) }) : !1;
  }
  async function se(m, f, I) {
    var z;
    if (!r("delete locations")) return !1;
    const b = v(), _ = b[m] ? X(b[m]) : null, L = _ == null ? void 0 : _.systems.find((F) => F.id === f);
    return !_ || !L ? !1 : (w(m, L, I), L.objects = L.objects.filter((F) => F.id !== I), L.primaryObjectId === I && (L.primaryObjectId = ((z = L.objects[0]) == null ? void 0 : z.id) ?? ""), _.currentLocation.objectId === I && (_.currentLocation.objectId = L.primaryObjectId), b[m] = _, await x(b, m), !0);
  }
  async function oe(m, f, I) {
    var V;
    if (!r("move locations")) return null;
    const b = v(), _ = b[m] ? X(b[m]) : null, L = _ == null ? void 0 : _.systems.find((ne) => ne.objects.some((ue) => ue.id === f)), z = _ == null ? void 0 : _.systems.find((ne) => ne.id === I), F = L == null ? void 0 : L.objects.find((ne) => ne.id === f);
    return !_ || !L || !z || !F ? null : (L.id !== z.id && w(m, L, f), L.objects = L.objects.filter((ne) => ne.id !== f), z.objects.push(F), L.primaryObjectId === f && (L.primaryObjectId = ((V = L.objects[0]) == null ? void 0 : V.id) ?? ""), z.primaryObjectId || (z.primaryObjectId = f), _.currentLocation.objectId === f && (_.currentLocation.systemId = z.id), b[m] = _, await x(b, m), d(F));
  }
  async function ae(m, f, I) {
    if (!r("set the arrival object")) return null;
    const b = v(), _ = b[m] ? X(b[m]) : null, L = _ == null ? void 0 : _.systems.find((z) => z.id === f);
    return !_ || !(L != null && L.objects.some((z) => z.id === I)) ? null : (L.primaryObjectId = I, _.currentLocation.systemId === f && !_.currentLocation.objectId && (_.currentLocation.objectId = I), b[m] = _, await x(b, m), d(L));
  }
  async function ie(m, f, I, b, _, L) {
    var ne, ue;
    if (!r("place locations")) return null;
    const z = v(), F = z[m] ? X(z[m]) : null, V = (ne = F == null ? void 0 : F.systems.find((me) => me.id === f)) == null ? void 0 : ne.objects.find((me) => me.id === I);
    if (!F || !V) return null;
    if (L) {
      if (((ue = V.orbit) == null ? void 0 : ue.centerId) !== L.centerId || V.orbit.orbitId !== L.orbitId) return null;
      V.orbit.angle = L.angle, V.orbit.epoch = et();
    } else
      V.x = pe(Ae(b, V.x), 0, 100), V.y = pe(Ae(_, V.y), 0, 100);
    return z[m] = F, await x(z, m), d(V);
  }
  async function Se(m, f, I, b) {
    var F;
    if (!r("change object visibility")) return null;
    const _ = v(), L = _[m] ? X(_[m]) : null, z = (F = L == null ? void 0 : L.systems.find((V) => V.id === f)) == null ? void 0 : F.objects.find((V) => V.id === I);
    return !L || !z ? null : (z.visibility = _n.includes(b) ? b : "inherit", z.visibility === "players" && ["undiscovered", "locked"].includes(z.status) && (z.status = "known"), _[m] = L, await x(_, m), d(z));
  }
  async function be(m, f) {
    var _;
    if (!r("delete star systems")) return !1;
    const I = v(), b = I[m];
    if (!b) return !1;
    b.systems = b.systems.filter((L) => L.id !== f), b.routes = b.routes.filter((L) => L.fromSystemId !== f && L.toSystemId !== f), b.currentSystemId === f && (b.currentSystemId = ((_ = b.systems[0]) == null ? void 0 : _.id) ?? "");
    for (const L of b.factions ?? []) L.headquartersSystemId === f && (L.headquartersSystemId = "");
    return await x(I, m), !0;
  }
  async function Ie(m, f) {
    if (!r("set current location")) return null;
    const I = v(), b = I[m] ? X(I[m]) : null, _ = b == null ? void 0 : b.systems.find((L) => L.id === f);
    return !b || !_ ? (t(`System "${f}" was not found.`), null) : (b.currentLocation.systemId !== f && (b.currentLocation = { systemId: f, objectId: _.primaryObjectId }), b.currentSystemId = f, I[m] = b, await x(I, m), d(_));
  }
  async function xe(m, f, I) {
    if (!r("set current location")) return null;
    const b = v(), _ = b[m] ? X(b[m]) : null, L = _ == null ? void 0 : _.systems.find((F) => F.id === f), z = L == null ? void 0 : L.objects.find((F) => F.id === I);
    return !_ || !L || !z ? null : (_.currentSystemId = f, _.currentLocation = { systemId: f, objectId: I }, b[m] = _, await x(b, m), d(z));
  }
  async function j(m, f = {}, I = "") {
    var V;
    if (!r("save routes")) return null;
    const b = v(), _ = b[m], L = I ? (V = _ == null ? void 0 : _.systems) == null ? void 0 : V.find((ne) => ne.id === I) : _;
    if (!_ || !L)
      return t(I ? `System "${I}" was not found.` : `Map "${m}" was not found.`), null;
    Array.isArray(L.routes) || (L.routes = []);
    const z = Rt(f);
    if (!z.fromSystemId || !z.toSystemId || z.fromSystemId === z.toSystemId)
      return t("Routes require two different systems."), null;
    const F = L.routes.findIndex((ne) => ne.id === z.id);
    return F >= 0 ? L.routes[F] = z : L.routes.push(z), await x(b, m), d(z);
  }
  async function ge(m, f, I = "") {
    var z;
    if (!r("delete routes")) return !1;
    const b = v(), _ = b[m], L = I ? (z = _ == null ? void 0 : _.systems) == null ? void 0 : z.find((F) => F.id === I) : _;
    return L ? (L.routes = (L.routes ?? []).filter((F) => F.id !== f), await x(b, m), !0) : !1;
  }
  async function qe(m, f = {}) {
    var z;
    if (!r("save factions")) return null;
    const I = v();
    if (!I[m])
      return t(`Map "${m}" was not found.`), null;
    const b = X(I[m]), _ = b.factions.findIndex((F) => F.id === f.id), L = kn({ ...b.factions[_], ...f });
    return L.parentFactionId && (L.parentFactionId === L.id || !b.factions.some((F) => F.id === L.parentFactionId && F.kind === "major")) ? (t("Choose a major faction on this galaxy map as the parent."), null) : L.headquartersSystemId && L.headquartersSystemId !== ((z = b.factions[_]) == null ? void 0 : z.headquartersSystemId) && !b.systems.some((F) => F.id === L.headquartersSystemId) ? (t("Choose a headquarters system on this galaxy map."), null) : (_ >= 0 ? b.factions[_] = L : b.factions.push(L), I[m] = b, await x(I, m), d(L));
  }
  async function y(m, f) {
    if (!r("delete factions")) return !1;
    const I = v();
    if (!I[m]) return !1;
    const b = X(I[m]);
    b.factions = b.factions.filter((_) => _.id !== f);
    for (const _ of b.systems) {
      _.factionId === f && (_.factionId = "");
      for (const L of _.objects ?? []) L.factionId === f && (L.factionId = "");
    }
    return I[m] = b, await x(I, m), !0;
  }
  async function N(m, f, I, b, _ = "") {
    var ue, me, fe, we;
    if (!r(`${b ? "hide" : "reveal"} ${{ faction: "factions", system: "star systems", route: "routes" }[f]}`)) return null;
    const z = v(), F = z[m], V = _ ? (ue = F == null ? void 0 : F.systems) == null ? void 0 : ue.find((Me) => Me.id === _) : F, ne = f === "faction" ? (me = F == null ? void 0 : F.factions) == null ? void 0 : me.find((Me) => Me.id === I) : f === "system" ? (fe = F == null ? void 0 : F.systems) == null ? void 0 : fe.find((Me) => Me.id === I) : (we = V == null ? void 0 : V.routes) == null ? void 0 : we.find((Me) => Me.id === I);
    return !F || !ne ? (t(`${f[0].toUpperCase()}${f.slice(1)} "${I}" was not found.`), null) : (ne.visibility = b ? "gm" : "players", f === "system" && !b && ["undiscovered", "locked"].includes(ne.status) && (ne.status = "known"), await x(z, m), d(ne));
  }
  async function a(m, f, I = !0) {
    const b = await N(m, "faction", f, I);
    return b && i(`${b.name} ${I ? "hidden from" : "visible to"} players.`), b;
  }
  async function n(m, f, { notify: I = !0 } = {}) {
    const b = await N(m, "system", f, !1);
    return b ? (I && g(m, b.id), i(`${b.name} revealed to players.`), b) : null;
  }
  async function o(m, f, I = !0) {
    const b = await N(m, "system", f, I);
    return b && i(`${b.name} ${I ? "hidden from" : "visible to"} players.`), b;
  }
  async function l(m, f, I = "") {
    const b = await N(m, "route", f, !1, I);
    return b && i("Route revealed to players."), b;
  }
  async function s(m, f, I = !0, b = "") {
    const _ = await N(m, "route", f, I, b);
    return _ && i(`Route ${I ? "hidden from" : "visible to"} players.`), _;
  }
  async function h(m, f, I, b) {
    var F;
    if (!r("move star systems")) return null;
    const _ = v(), L = _[m], z = (F = L == null ? void 0 : L.systems) == null ? void 0 : F.find((V) => V.id === f);
    return z ? (z.x = pe(Ae(I, z.x), 0, 100), z.y = pe(Ae(b, z.y), 0, 100), await x(_, m, { refresh: !1 }), d(z)) : (t(`System "${f}" was not found.`), null);
  }
  function g(m, f) {
    var b, _;
    if (!r("notify players about discoveries")) return;
    const I = (_ = (b = P(m)) == null ? void 0 : b.systems) == null ? void 0 : _.find((L) => L.id === f);
    if (!I) {
      t(`System "${f}" was not found.`);
      return;
    }
    game.socket.emit(_e, { action: "notify", mapId: m, systemId: f, message: `New System Discovered: ${I.name}` }), i(`Discovery notification sent: ${I.name}.`);
  }
  async function S(m, { replace: f = !1 } = {}) {
    if (!r("import galaxy maps")) return null;
    const I = v();
    let b = X(m);
    return I[b.id] && !f && (b = X({ ...b, id: Te("map"), title: `${b.title} Import` })), I[b.id] = b, await M(I), u(b.id), i(`Imported ${b.title}.`), d(b);
  }
  function E(m) {
    if (!r("export galaxy maps")) return;
    const f = P(m);
    if (!f) {
      t(`Map "${m}" was not found.`);
      return;
    }
    Hi(`${zi(f.title)}.json`, X(f));
  }
  const q = () => Object.values(v()).map(X), O = (m, f) => d(X(P(m)).systems.find((I) => I.id === String(f)) ?? null);
  function $(m, f) {
    const I = X(P(m));
    for (const b of I.systems) {
      const _ = b.objects.find((L) => L.id === String(f));
      if (_) return { systemId: b.id, object: d(_) };
    }
    return null;
  }
  const Z = (m, f) => {
    const I = X(P(m)).systems.find((b) => b.id === String(f));
    return [...new Set((I == null ? void 0 : I.objects.flatMap((b) => b.sceneIds)) ?? [])];
  }, W = (m, f) => {
    var I;
    return [...((I = $(m, f)) == null ? void 0 : I.object.sceneIds) ?? []];
  };
  function re(m) {
    return q().flatMap((f) => f.systems.flatMap((I) => I.objects.filter((b) => b.sceneIds.includes(String(m))).map((b) => ({ mapId: f.id, mapTitle: f.title, systemId: I.id, systemName: I.name, object: d(b) }))));
  }
  function ce(m) {
    return q().flatMap((f) => f.systems.filter((I) => I.objects.some((b) => b.sceneIds.includes(String(m)))).map((I) => ({ mapId: f.id, mapTitle: f.title, system: d(I) })));
  }
  return {
    getMapStore: v,
    saveMapStore: M,
    getRawMap: P,
    createMap: H,
    updateMap: B,
    updateMapMetadata: R,
    deleteMap: A,
    duplicateMap: D,
    upsertSystem: U,
    upsertObject: Q,
    savePlanetLocation: te,
    removePlanetLocation: C,
    unlinkPlanetScene: G,
    deleteObject: se,
    moveObject: oe,
    setPrimaryObject: ae,
    saveObjectPosition: ie,
    setObjectVisibility: Se,
    deleteSystem: be,
    setCurrentSystem: Ie,
    setCurrentObject: xe,
    upsertRoute: j,
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
    getSystem: O,
    getObject: $,
    getSceneIdsForSystem: Z,
    getSceneIdsForObject: W,
    getObjectsForScene: re,
    getSystemsForScene: ce,
    updateOpenPlanetLocations: Y
  };
}
function vs(e) {
  const {
    getRawMap: t,
    setCurrentSystem: i,
    setCurrentObject: r,
    getOpenMapViews: u,
    getAppHtml: c,
    notifyInfo: p,
    notifyError: d,
    getActiveUsers: T,
    getPrimaryGM: v,
    isPrimaryGM: M
  } = e, P = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Set(), H = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map();
  function R(y, N, a) {
    return y.routes.find((n) => n.fromSystemId === N && n.toSystemId === a || n.toSystemId === N && n.fromSystemId === a) ?? null;
  }
  function A(y, N) {
    const a = t(y);
    if (!a)
      return d(`Map "${y}" was not found.`), null;
    const n = X(a), o = n.systems.find((S) => S.id === n.currentSystemId), l = n.systems.find((S) => S.id === N);
    if (!l)
      return d(`System "${N}" was not found.`), null;
    if (!o)
      return d("This map does not have a current location yet. Ask the GM to set one first."), null;
    if (o.id === l.id)
      return p(`${l.name} is already the current location.`), null;
    if (n.visibility !== "players" || o.visibility !== "players" || l.visibility !== "players")
      return d("That travel destination is not visible to players."), null;
    const s = R(n, o.id, l.id);
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
  function D(y, N) {
    const a = A(y, N);
    return a ? (game.socket.emit(_e, a), p(`Travel request sent: ${a.fromName} to ${a.toName}.`), a) : null;
  }
  function U(y, N, a) {
    const n = t(y);
    if (!n)
      return d(`Map "${y}" was not found.`), null;
    const o = X(n), l = o.systems.find((q) => q.id === N), s = l == null ? void 0 : l.objects.find((q) => q.id === o.currentLocation.objectId), h = l == null ? void 0 : l.objects.find((q) => q.id === a);
    if (!l || o.currentLocation.systemId !== l.id || !s)
      return d("The current location is not inside this system."), null;
    if (!h)
      return d(`Destination "${a}" was not found.`), null;
    if (s.id === h.id)
      return p(`${h.name} is already the current location.`), null;
    if (o.visibility !== "players" || l.visibility !== "players" || Xe(l, s) !== "players" || Xe(l, h) !== "players")
      return d("That travel destination is not visible to players."), null;
    const g = R({ routes: l.routes }, s.id, h.id);
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
  function Q(y, N, a) {
    const n = U(y, N, a);
    return n ? (game.socket.emit(_e, n), p(`Travel request sent: ${n.fromName} to ${n.toName}.`), n) : null;
  }
  function ee(y, N) {
    var s, h;
    if (!N) return;
    B.set(y, N);
    const a = (s = H.get(y)) == null ? void 0 : s.root;
    if (!a) return;
    const n = a.querySelector("[data-travel-progress-count]"), o = a.querySelector("[data-travel-progress-pending]"), l = a.querySelector("[data-travel-progress-bar]");
    n && (n.textContent = `${N.acceptedCount} of ${N.requiredApprovals} approvals`), o && (o.textContent = (h = N.pendingNames) != null && h.length ? `Waiting for: ${N.pendingNames.join(", ")}` : "All votes received"), l && (l.style.width = `${Math.min(100, N.acceptedCount / Math.max(1, N.requiredApprovals) * 100)}%`);
  }
  function w(y) {
    var s, h, g, S;
    if (!(y != null && y.requestId) || y.requesterId === ((s = game.user) == null ? void 0 : s.id) || !((g = y.voterIds) != null && g.includes((h = game.user) == null ? void 0 : h.id)) || x.has(y.requestId)) return;
    x.add(y.requestId);
    let N = !1, a = !1, n = null;
    const o = (E) => {
      if (N) return;
      N = !0;
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
        const q = $n(E), O = H.get(y.requestId);
        O && (O.root = q), ee(y.requestId, B.get(y.requestId));
      },
      buttons: {
        accept: { icon: '<i class="fa-solid fa-check"></i>', label: "Accept", callback: () => o(!0) },
        decline: { icon: '<i class="fa-solid fa-xmark"></i>', label: "Decline", callback: () => o(!1) }
      },
      default: "accept",
      close: () => {
        H.delete(y.requestId), a || o(!1);
      }
    }, { classes: ["galaxy-map", "gmf-crud-dialog"], width: 420, height: Math.max(320, Math.min(440, window.innerHeight - 80)) }), H.set(y.requestId, { root: null, resolve: () => {
      a = !0, N = !0, n == null || n.close();
    } }), n.render(!0);
  }
  const Y = (y) => {
    var N;
    return !!(y != null && y.coordinatorId && y.coordinatorId === ((N = v()) == null ? void 0 : N.id));
  };
  function te(y) {
    const N = Kt(y);
    return {
      action: "travel-progress",
      requestId: y.requestId,
      mapId: y.mapId,
      requesterId: y.requesterId,
      approvalMode: y.approvalMode,
      acceptedCount: N.acceptedCount,
      declinedCount: N.declinedCount,
      requiredApprovals: N.required,
      participantCount: y.participantCount,
      pendingNames: N.pendingIds.map((a) => {
        var n;
        return ((n = y.voterNames) == null ? void 0 : n[a]) || "Navigator";
      }),
      coordinatorId: game.user.id
    };
  }
  function C(y) {
    const N = te(y);
    return ee(y.requestId, N), game.socket.emit(_e, N), N;
  }
  function G(y) {
    var a, n, o;
    if (!(y != null && y.requestId) || !Y(y)) return;
    const N = B.get(y.requestId);
    if (ee(y.requestId, y), y.requesterId === ((a = game.user) == null ? void 0 : a.id) && (!N || N.acceptedCount !== y.acceptedCount || N.declinedCount !== y.declinedCount)) {
      const l = (n = y.pendingNames) != null && n.length ? ` Waiting for ${y.pendingNames.join(", ")}.` : "";
      (o = ui.notifications) == null || o.info(`Travel vote: ${y.acceptedCount}/${y.requiredApprovals} approvals.${l}`);
    }
  }
  function se(y) {
    if (!M() || !(y != null && y.requestId) || P.has(y.requestId)) return null;
    const N = t(y.mapId);
    if (!N) return null;
    const a = X(N), n = T().find((W) => W.id === y.requesterId && !W.isGM), o = y.travelScope === "object", l = o ? a.systems.find((W) => W.id === y.systemId) : null, s = o ? l == null ? void 0 : l.objects.find((W) => W.id === a.currentLocation.objectId) : a.systems.find((W) => W.id === a.currentSystemId), h = o ? l == null ? void 0 : l.objects.find((W) => W.id === y.toObjectId) : a.systems.find((W) => W.id === y.toSystemId), g = s && h ? R(o ? { routes: (l == null ? void 0 : l.routes) ?? [] } : a, s.id, h.id) : null, S = o && (!l || a.currentLocation.systemId !== l.id || l.visibility !== "players" || Xe(l, s) !== "players" || Xe(l, h) !== "players"), E = !o && ((s == null ? void 0 : s.visibility) !== "players" || (h == null ? void 0 : h.visibility) !== "players");
    if (!n || a.visibility !== "players" || !s || !h || s.id === h.id || S || E || !g || g.visibility !== "players") return null;
    const q = v(), O = yt(T(), y.requesterId, q, a.travelApprovalMode), $ = globalThis.setTimeout(() => {
      const W = P.get(y.requestId);
      W && Ie(W, { reason: "Travel request timed out." });
    }, Ti), Z = {
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
      ...O,
      accepted: /* @__PURE__ */ new Set(),
      declined: /* @__PURE__ */ new Set(),
      timeoutId: $
    };
    return P.set(y.requestId, Z), C(Z), Z;
  }
  function oe(y) {
    const N = X(t(y.mapId)), a = y.travelScope === "object", n = a ? N.systems.find((s) => s.id === y.systemId) : null, o = a ? n == null ? void 0 : n.objects.find((s) => s.id === y.fromObjectId) : N.systems.find((s) => s.id === y.fromSystemId), l = a ? n == null ? void 0 : n.objects.find((s) => s.id === y.toObjectId) : N.systems.find((s) => s.id === y.toSystemId);
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
  const ae = (y, N, a) => {
    var n;
    return game.socket.emit(
      _e,
      { action: "travel-animation", mapId: y, fromSystemId: N, toSystemId: a, coordinatorId: (n = game.user) == null ? void 0 : n.id }
    );
  }, ie = (y, N, a, n) => {
    var o;
    return game.socket.emit(
      _e,
      { action: "travel-animation", travelScope: "object", mapId: y, systemId: N, fromObjectId: a, toObjectId: n, coordinatorId: (o = game.user) == null ? void 0 : o.id }
    );
  };
  function Se(y) {
    var N;
    P.delete(y.requestId), y.timeoutId && globalThis.clearTimeout(y.timeoutId), x.delete(y.requestId), (N = H.get(y.requestId)) == null || N.resolve(), H.delete(y.requestId), B.delete(y.requestId);
  }
  async function be(y) {
    Se(y);
    const N = {
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
    game.socket.emit(_e, N), oe(N), p(`Travel approved: ${y.fromName} to ${y.toName}.`), globalThis.setTimeout(() => {
      y.travelScope === "object" ? r(y.mapId, y.systemId, y.toObjectId) : i(y.mapId, y.toSystemId);
    }, jt);
  }
  function Ie(y, { voterName: N = "", reason: a = "" } = {}) {
    Se(y);
    const n = a || `${N || "A participant"} declined the request.`, o = {
      action: "travel-declined",
      requestId: y.requestId,
      mapId: y.mapId,
      fromName: y.fromName,
      toName: y.toName,
      voterName: N,
      reason: n,
      coordinatorId: game.user.id
    };
    game.socket.emit(_e, o), p(`Travel cancelled: ${n}`);
  }
  function xe(y) {
    if (!M() || !(y != null && y.requestId)) return;
    const N = P.get(y.requestId);
    if (!N || !N.voterIds.includes(y.userId) || N.accepted.has(y.userId) || N.declined.has(y.userId)) return;
    y.accepted ? N.accepted.add(y.userId) : N.declined.add(y.userId);
    const a = Kt(N);
    C(N), a.outcome === "approved" ? be(N) : a.outcome === "declined" && Ie(N, {
      voterName: y.userName,
      reason: N.approvalMode === "unanimous" ? `${y.userName || "A participant"} declined the unanimous request.` : "The remaining votes cannot reach a majority."
    });
  }
  function j(y) {
    var N;
    y.requestId && x.delete(y.requestId), (N = H.get(y.requestId)) == null || N.resolve(), H.delete(y.requestId), B.delete(y.requestId);
  }
  function ge(y) {
    var N, a;
    !Y(y) || y.coordinatorId === ((N = game.user) == null ? void 0 : N.id) || (j(y), oe(y), (a = ui.notifications) == null || a.info(`Travel approved: ${y.fromName} to ${y.toName}.`));
  }
  function qe(y) {
    var N, a;
    !Y(y) || y.coordinatorId === ((N = game.user) == null ? void 0 : N.id) || (j(y), (a = ui.notifications) == null || a.warn(`Travel cancelled: ${y.reason || `${y.voterName || "A participant"} declined.`}`));
  }
  return {
    getTravelRoute: R,
    requestTravelToSystem: D,
    requestTravelToObject: Q,
    promptForTravelRequest: w,
    isPrimaryGMMessage: Y,
    handleTravelProgress: G,
    trackTravelRequest: se,
    animateTravelOnOpenMaps: oe,
    broadcastTravelAnimation: ae,
    broadcastObjectTravelAnimation: ie,
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
function zn() {
  return game.users.filter((e) => e.active);
}
function Hn() {
  return zn().filter((e) => e.isGM).sort((e, t) => String(e.id).localeCompare(String(t.id)))[0] ?? null;
}
function Vn() {
  var e, t;
  return !!((e = game.user) != null && e.isGM && ((t = Hn()) == null ? void 0 : t.id) === game.user.id);
}
const {
  getMapStore: mn,
  saveMapStore: fn,
  getRawMap: ot,
  createMap: Un,
  updateMap: ws,
  updateMapMetadata: Yn,
  deleteMap: Xn,
  duplicateMap: Wn,
  upsertSystem: Jn,
  upsertObject: Zn,
  savePlanetLocation: Kn,
  removePlanetLocation: Qn,
  unlinkPlanetScene: ei,
  deleteObject: Nt,
  moveObject: Ms,
  setPrimaryObject: Ps,
  saveObjectPosition: ti,
  setObjectVisibility: ni,
  deleteSystem: Dt,
  setCurrentSystem: Gt,
  setCurrentObject: Bt,
  upsertRoute: ii,
  deleteRoute: zt,
  upsertFaction: si,
  deleteFaction: Ht,
  hideFactionFromPlayers: ai,
  saveSystemPosition: ri,
  revealSystemToPlayers: oi,
  hideSystemFromPlayers: Vt,
  revealRouteToPlayers: ci,
  hideRouteFromPlayers: Ut,
  importMapData: li,
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
function di(e) {
  var i;
  const t = mi(e);
  return ((i = t == null ? void 0 : t.closest) == null ? void 0 : i.call(t, ".window-app, .application, .app")) ?? t;
}
function Os(e) {
  return e.map((t) => {
    var u, c;
    const i = di(t);
    if (!i) return null;
    const r = Number.parseInt(((c = (u = globalThis.getComputedStyle) == null ? void 0 : u.call(globalThis, i)) == null ? void 0 : c.zIndex) ?? "", 10);
    return { app: t, zIndex: i.style.zIndex || (Number.isFinite(r) ? String(r) : "") };
  }).filter(Boolean);
}
function vt(e) {
  for (const t of e) {
    const i = di(t.app);
    !(i != null && i.isConnected) || !t.zIndex || (i.style.zIndex = t.zIndex);
  }
}
async function at(e = null) {
  var c;
  const t = [...Je.entries()].filter(([p, d]) => (d == null ? void 0 : d.rendered) && (!e || p === e)).map(([, p]) => p);
  de != null && de.rendered && (!e || de.mapId === e) && t.push(de);
  const i = [Fe != null && Fe.rendered ? Fe : null, ...t].filter(Boolean), r = Os(i), u = i.map((p) => Promise.resolve(p.render({ force: !0 })));
  vt(r), await Promise.allSettled(u), vt(r), (c = globalThis.requestAnimationFrame) == null || c.call(globalThis, () => vt(r));
}
function Xt(e) {
  const t = [...Je.values()];
  return de && t.push(de), t.filter((i) => (i == null ? void 0 : i.rendered) && i.mapId === e);
}
function mi(e) {
  return e.element ?? null;
}
const {
  getTravelRoute: As,
  requestTravelToSystem: fi,
  requestTravelToObject: pi,
  promptForTravelRequest: pn,
  isPrimaryGMMessage: Cs,
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
  getAppHtml: mi,
  notifyInfo: Ze,
  notifyError: He,
  getActiveUsers: zn,
  getPrimaryGM: Hn,
  isPrimaryGM: Vn
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
  const p = new Js({ mapId: e, playerMode: r });
  return r ? de = p : Je.set(u, p), p.render({ force: !0 }), p;
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
  var p, d;
  const r = String(t.systemId || ""), u = String(t.objectId || "");
  if (!e || !r) return !1;
  const c = Ve(e, { playerMode: i.playerMode ?? !((p = game.user) != null && p.isGM), broadcast: i.broadcast === !0 });
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
  const e = hi();
  return e.length ? e.length === 1 ? Ve(e[0].id, { playerMode: !0 }) : (Qe || (Qe = new Ws()), Qe.render({ force: !0 }), Qe) : (Ze("No galaxy map is currently visible to players."), null);
}
function hi() {
  return ht().filter((e) => e.visibility === "players").sort((e, t) => e.title.localeCompare(t.title));
}
function Ys() {
  var t;
  const e = ht().sort((i, r) => i.title.localeCompare(r.title));
  return (t = game.user) != null && t.isGM ? e.length === 1 ? Ve(e[0].id) : Wt() : Jt();
}
function yi(e) {
  if ($t("broadcast galaxy maps")) {
    if (!ot(e)) {
      He(`Map "${e}" was not found.`);
      return;
    }
    game.socket.emit(_e, { action: "open", mapId: e }), Ze("Map broadcast sent to players.");
  }
}
const Xs = Ui({
  templateRoot: Oe,
  getMaps: ht,
  prepareMapForManager: gs,
  getRawMap: ot,
  importMapData: li,
  exportMap: Yt,
  duplicateMap: Wn,
  deleteMap: Xn,
  createMap: Un,
  deleteSystem: Dt,
  deleteObject: Nt,
  deleteRoute: zt,
  deleteFaction: Ht,
  openMap: Ve,
  showMapToPlayers: yi,
  hideSystemFromPlayers: Vt,
  hideRouteFromPlayers: Ut,
  hideFactionFromPlayers: ai,
  notifyError: He,
  clearManagerApp: (e) => {
    Fe === e && (Fe = null);
  }
}), Ws = us({
  templateRoot: Oe,
  getVisibleMaps: hi,
  openMap: Ve,
  clearChooser: (e) => {
    Qe === e && (Qe = null);
  }
}), Js = ds({
  templateRoot: Oe,
  getRawMap: ot,
  prepareMapForDisplay: ys,
  upsertSystem: Jn,
  upsertObject: Zn,
  upsertRoute: ii,
  upsertFaction: si,
  updateMapMetadata: Yn,
  deleteFaction: Ht,
  getTextureGuideMarkup: Is,
  activateObjectEditorControls: Ss,
  revealSystemToPlayers: oi,
  revealRouteToPlayers: ci,
  hideSystemFromPlayers: Vt,
  setObjectVisibility: ni,
  hideRouteFromPlayers: Ut,
  deleteSystem: Dt,
  deleteObject: Nt,
  deleteRoute: zt,
  setCurrentSystem: Gt,
  setCurrentObject: Bt,
  requestTravelToSystem: fi,
  requestTravelToObject: pi,
  exportMap: Yt,
  getTravelRoute: As,
  broadcastTravelAnimation: $s,
  broadcastObjectTravelAnimation: Ns,
  notifyInfo: Ze,
  notifyError: He,
  saveSystemPosition: ri,
  saveObjectPosition: ti,
  savePlanetLocation: Kn,
  removePlanetLocation: Qn,
  unlinkPlanetScene: ei,
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
    for (const [p, d, T] of [[u, "Labels", !0], [c, "Percentages", !1]])
      game.settings.register(he, p, {
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
    (c = r == null ? void 0 : r.classList) != null && c.contains("galaxy-map") && Ni(e, t);
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
    createMap: Un,
    getMaps: ht,
    getSystem: Es,
    getObject: _s,
    getSceneIdsForSystem: Ls,
    getSystemsForScene: qs,
    getSceneIdsForObject: Ts,
    getObjectsForScene: xs,
    showMapToPlayers: yi,
    updateMap: ws,
    updateMapMetadata: Yn,
    deleteMap: Xn,
    duplicateMap: Wn,
    upsertSystem: Jn,
    deleteSystem: Dt,
    upsertObject: Zn,
    deleteObject: Nt,
    moveObject: Ms,
    setPrimaryObject: Ps,
    upsertRoute: ii,
    deleteRoute: zt,
    upsertFaction: si,
    deleteFaction: Ht,
    saveSystemPosition: ri,
    saveObjectPosition: ti,
    savePlanetLocation: Kn,
    removePlanetLocation: Qn,
    unlinkPlanetScene: ei,
    setCurrentSystem: Gt,
    setCurrentObject: Bt,
    revealSystemToPlayers: oi,
    revealRouteToPlayers: ci,
    hideSystemFromPlayers: Vt,
    setObjectVisibility: ni,
    hideRouteFromPlayers: Ut,
    hideFactionFromPlayers: ai,
    requestTravelToSystem: fi,
    requestTravelToObject: pi,
    importMapData: li,
    exportMap: Yt
  };
  const e = game.modules.get(he);
  if (e && (e.api = game.galaxyMap), Zs(), Vn()) {
    const t = mn();
    if (Object.values(t).some((r) => Number((r == null ? void 0 : r.schemaVersion) || 1) < De)) {
      const r = un(game.settings.get(he, ut) ?? {});
      Object.keys(r).length || await game.settings.set(he, ut, t);
      const u = Object.fromEntries(Object.entries(t).map(([c, p]) => [c, X(p)]));
      await fn(u), Ze('Your galaxy maps were updated to the new format. Everything from the old single map is now inside a system called "System 1", and a backup of the old data was kept.');
    }
    if (!game.settings.get(he, Lt)) {
      const r = un(game.settings.get(he, ut) ?? {}), u = mn();
      let c = 0;
      for (const [p, d] of Object.entries(r)) {
        if (!u[p]) continue;
        const T = X(u[p]);
        for (const v of (d == null ? void 0 : d.systems) ?? []) {
          const M = Tn(v == null ? void 0 : v.planetLocations);
          if (!M.length) continue;
          const P = T.systems.flatMap((x) => x.objects).find((x) => x.id === v.id || x.id === `${v.id}-object`);
          !P || P.planetLocations.length || (P.planetLocations = M.filter((x) => P.sceneIds.includes(x.sceneId)), c += P.planetLocations.length);
        }
        u[p] = X(T);
      }
      c && (await fn(u), Ze(`Restored ${c} surface location${c === 1 ? "" : "s"} that went missing in an earlier update.`)), await game.settings.set(he, Lt, !0);
    }
  }
  game.socket.on(_e, (t = {}) => {
    var i, r, u, c, p;
    if (t.action === "travel-request") {
      const d = Rs(t);
      d && (game.socket.emit(_e, d), pn(d));
      return;
    }
    if (t.action === "travel-ballot") {
      Cs(t) && t.coordinatorId !== ((i = game.user) == null ? void 0 : i.id) && pn(t);
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
    (c = game.user) != null && c.isGM || (t.action === "open" && t.mapId && (de == null || de.close(), Ve(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "notify" && ((p = ui.notifications) == null || p.info(t.message || "New system discovered."), (de == null ? void 0 : de.mapId) === t.mapId && de.render({ force: !0 })));
  }), console.log(`${he} | Ready. API available at game.galaxyMap.`);
});
