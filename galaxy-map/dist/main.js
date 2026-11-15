var pn = Object.defineProperty;
var hn = (e, t, n) => t in e ? pn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var X = (e, t, n) => hn(e, typeof t != "symbol" ? t + "" : t, n);
const Qe = [
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
], mi = [
  ...Qe,
  { value: "color", label: "Flat color" },
  { value: "custom", label: "Custom texture" },
  { value: "none", label: "No detail view" }
], yn = [
  { value: "sphere", label: "Sphere" },
  { value: "cube", label: "Cube" },
  { value: "donut", label: "Donut" },
  { value: "asteroid", label: "Asteroid" },
  { value: "crystal", label: "Crystal" },
  { value: "cylinder", label: "Cylinder" }
], gn = [
  { value: "smooth", label: "Smooth" },
  { value: "matte", label: "Matte" },
  { value: "holographic", label: "Holographic" }
];
function ot(e) {
  return yn.some((t) => t.value === e) ? String(e) : "sphere";
}
function pi(e) {
  return gn.some((t) => t.value === e) ? String(e) : "smooth";
}
function Lt(e) {
  return e === "auto" ? "ice" : mi.some((t) => t.value === e) ? String(e) : "ice";
}
const hi = /* @__PURE__ */ new Set(["color", "custom", "none"]), Jt = {
  sphere: Qe.map((e) => e.value).filter((e) => !["prison", "anomaly", "cube", "donut-planet"].includes(e)),
  cube: ["cube"],
  donut: ["donut-planet"],
  asteroid: ["asteroid"],
  crystal: ["anomaly"],
  cylinder: ["prison"]
};
function yi(e) {
  const t = new Set(Jt[ot(e)] ?? Jt.sphere);
  return mi.filter((n) => t.has(n.value) || hi.has(n.value));
}
function gi(e, t) {
  var u;
  const n = Lt(e), r = yi(t);
  return r.some((c) => c.value === n) ? n : ((u = r.find((c) => !hi.has(c.value))) == null ? void 0 : u.value) ?? "color";
}
function Sn(e) {
  return e === "black-hole";
}
function Re(e, t = "") {
  if (!e || e.obscured || e.planetPreset === "none") return null;
  const n = Lt(e.planetPreset), r = Qe.find((m) => m.value === t) ?? Qe.find((m) => m.value === n) ?? Qe[0], u = !t && n === "custom" && !!e.planetTexture, c = !t && n === "color";
  return {
    texture: c ? null : u ? e.planetTexture : `modules/galaxy-map/assets/planets/${r.texture}`,
    label: c ? "Flat color" : u ? "Custom texture" : r.label,
    preset: c ? "color" : u ? "custom" : r.value,
    color: c ? e.planetColor || "#58d8ff" : r.color,
    shape: ot(e.planetShape),
    finish: pi(e.planetFinish)
  };
}
const Tt = [
  { value: "gm", label: "GM approval" },
  { value: "majority", label: "Majority vote" },
  { value: "unanimous", label: "Unanimous agreement" }
];
function Et(e) {
  return Tt.some((t) => t.value === e) ? String(e) : "unanimous";
}
function ft(e, t, n, r) {
  const u = Et(r), c = [...new Map((e ?? []).filter((_) => _ == null ? void 0 : _.id).map((_) => [String(_.id), _])).values()], m = u === "gm" ? n != null && n.id ? [n] : [] : c.filter((_) => String(_.id) !== String(t)), l = m.map((_) => String(_.id)), P = Object.fromEntries(m.map((_) => [String(_.id), String(_.name || "Navigator").slice(0, 80)])), v = l.length + (u === "gm" ? 0 : 1), w = u === "gm" ? 1 : u === "majority" ? Math.floor(v / 2) + 1 : v;
  return { approvalMode: u, voterIds: l, voterNames: P, participantCount: v, requiredApprovals: w };
}
function Zt(e) {
  const t = Et(e == null ? void 0 : e.approvalMode), n = [...new Set(((e == null ? void 0 : e.voterIds) ?? []).map((w) => String(w)))], r = new Set([...(e == null ? void 0 : e.accepted) ?? []].map((w) => String(w))), u = new Set([...(e == null ? void 0 : e.declined) ?? []].map((w) => String(w))), c = t === "gm" ? 0 : 1, m = Math.max(1, Number(e == null ? void 0 : e.requiredApprovals) || (t === "unanimous" ? n.length + 1 : 1)), l = c + n.filter((w) => r.has(w)).length, P = n.filter((w) => u.has(w)).length, v = n.filter((w) => !r.has(w) && !u.has(w));
  return l >= m ? { outcome: "approved", acceptedCount: l, declinedCount: P, required: m, pendingIds: v } : t === "unanimous" && P > 0 ? { outcome: "declined", acceptedCount: l, declinedCount: P, required: m, pendingIds: v } : l + v.length < m ? { outcome: "declined", acceptedCount: l, declinedCount: P, required: m, pendingIds: v } : { outcome: "pending", acceptedCount: l, declinedCount: P, required: m, pendingIds: v };
}
const Si = 16 / 9;
function Ze() {
  var t;
  const e = typeof game > "u" || (t = game.time) == null ? void 0 : t.serverTime;
  return Number.isFinite(e) ? e : Date.now();
}
function Ke(e, t, n, r) {
  const u = Number(e);
  return Number.isFinite(u) ? Math.min(r, Math.max(n, u)) : t;
}
function xt(e) {
  return (e % 360 + 360) % 360;
}
function vn(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of Array.isArray(e) ? e : [])
    typeof (n == null ? void 0 : n.id) != "string" || !n.id || t.has(n.id) || t.set(n.id, { id: n.id, radius: Ke(n.radius ?? 15, 15, 1, 100) });
  return [...t.values()];
}
function bn(e) {
  if (!(typeof (e == null ? void 0 : e.centerId) != "string" || !e.centerId || typeof e.orbitId != "string" || !e.orbitId))
    return {
      centerId: e.centerId,
      orbitId: e.orbitId,
      angle: xt(Ke(e.angle, 0, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)),
      period: Number(e.period) > 0 ? Ke(e.period, 60, 5, 3600) : 0,
      clockwise: e.clockwise !== !1,
      epoch: Ke(e.epoch, 0, 0, Number.MAX_SAFE_INTEGER)
    };
}
function Pt(e, t, n) {
  const r = new Map(e.map((u) => [u.id, u]));
  return vi(r, t, n);
}
function vi(e, t, n) {
  var m;
  const r = e.get(n.centerId);
  if (!((m = r == null ? void 0 : r.orbits) != null && m.some((l) => l.id === n.orbitId))) return !1;
  const u = /* @__PURE__ */ new Set([t]);
  let c = r;
  for (; c; ) {
    if (u.has(c.id)) return !1;
    u.add(c.id), c = c.orbit ? e.get(c.orbit.centerId) : void 0;
  }
  return !0;
}
function bi(e, t, n = !0) {
  if (!n || !e.period) return e.angle;
  const r = (t - e.epoch) % (e.period * 1e3);
  return xt(e.angle + r / (e.period * 1e3) * 360 * (e.clockwise ? 1 : -1));
}
function Ii(e, t) {
  return { x: e / Math.max(1, t), y: e * Math.min(1, t) };
}
function wi(e, t, n) {
  return xt(Math.atan2(e.y - t.y, (e.x - t.x) * n) * 180 / Math.PI);
}
function gt(e, t = /* @__PURE__ */ new Set()) {
  const n = new Map(e.map((l) => [l.id, l])), r = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set();
  function m(l) {
    var w;
    if (c.has(l.id) || (c.add(l.id), !l.orbit)) return;
    const P = n.get(l.orbit.centerId), v = (w = P == null ? void 0 : P.orbits) == null ? void 0 : w.find((_) => {
      var k;
      return _.id === ((k = l.orbit) == null ? void 0 : k.orbitId);
    });
    if (P && v && vi(n, l.id, l.orbit) && (m(P), !u.has(P.id) && !t.has(P.id))) {
      t.has(l.id) || r.set(l.id, { orbit: v, attachment: l.orbit });
      return;
    }
    u.add(l.id);
  }
  return e.forEach(m), {
    attachments: r,
    rings: e.flatMap((l) => u.has(l.id) || t.has(l.id) ? [] : (l.orbits ?? []).map((P) => ({ centerId: l.id, ...P }))),
    animated: [...r.values()].some(({ attachment: l }) => l.period > 0),
    positions(l, P, v = !0, w) {
      const _ = /* @__PURE__ */ new Map();
      function k(F) {
        const O = _.get(F.id);
        if (O) return O;
        const C = r.get(F.id), N = (w == null ? void 0 : w.id) === F.id ? w.point : F;
        let V = { x: N.x, y: N.y };
        if (C) {
          const K = k(n.get(C.attachment.centerId)), se = ((w == null ? void 0 : w.id) === F.id ? w.angle ?? wi(N, K, l) : bi(C.attachment, P, v)) * Math.PI / 180, L = Ii(C.orbit.radius, l);
          V = { x: K.x + L.x * Math.cos(se), y: K.y + L.y * Math.sin(se) };
        }
        return _.set(F.id, V), V;
      }
      return e.forEach(k), _;
    }
  };
}
function mt(e, t) {
  t && (e.x = Ke(t.x, e.x, 0, 100), e.y = Ke(t.y, e.y, 0, 100)), delete e.orbit;
}
const je = 3, In = ["core", "colony", "frontier", "ruins", "restricted", "unknown"], wn = ["star", "planet", "moon", "station", "asteroid", "anomaly", "black-hole", "other"], Mi = ["undiscovered", "known", "visited", "danger", "locked"], Mn = ["safe", "dangerous", "restricted", "smuggler", "unknown"], St = ["gm", "players"], _i = ["inherit", ...St], _n = [
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
], kt = _n.map((e) => e.value), vt = kt, pt = 0.2, ht = 10, qt = 2400, Ln = 6e4;
function xe(e = "gmf") {
  return `${e}-${foundry.utils.randomID(10)}`;
}
function et(e, t = "players") {
  const n = St.includes(t) ? t : "players";
  return St.includes(e) ? e : n;
}
function Tn(e) {
  return _i.includes(e) ? String(e) : "inherit";
}
function En(e) {
  return typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "#58d8ff";
}
function bt(e) {
  return typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "";
}
function Ce(e, t = 0) {
  const n = Number(e);
  return Number.isFinite(n) ? n : t;
}
function xn(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  return [...new Set(t.map((n) => String(n).trim()).filter(Boolean))];
}
function pe(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function Kt(e, t) {
  return !Array.isArray(e) || e.length < 3 ? [...t] : e.slice(0, 3).map((n, r) => pe(Ce(n, t[r]), -2.5, 2.5));
}
function Li(e = {}) {
  const t = Kt(e.normal, [0, 0, 1]), n = Math.hypot(...t) || 1;
  return {
    id: String(e.id || xe("location")),
    sceneId: String(e.sceneId || "").trim(),
    shape: ot(e.shape),
    position: Kt(e.position, [0, 0, 1]),
    normal: t.map((r) => r / n),
    surfaceVersion: 1
  };
}
function Ti(e) {
  const t = /* @__PURE__ */ new Set();
  return (Array.isArray(e) ? e : []).slice(0, 64).map(Li).filter((n) => {
    const r = `${n.sceneId}:${n.shape}`;
    return !n.sceneId || t.has(r) ? !1 : (t.add(r), !0);
  });
}
function Ei(e = {}) {
  return wn.includes(e.kind) ? e.kind : e.type === "station" || e.iconStyle === "station" ? "station" : e.type === "anomaly" ? "anomaly" : e.iconStyle === "star" ? "star" : e.iconStyle === "black-hole" ? "black-hole" : e.planetShape === "asteroid" ? "asteroid" : ["planet", "terrestrial", "gas-giant", "ice-world", "volcanic", "artificial", "ringed"].includes(e.iconStyle) ? "planet" : "other";
}
function It(e = {}) {
  const t = xn(e.sceneIds === void 0 ? e.sceneId : e.sceneIds), n = String(e.planetTexture || "").trim(), r = ot(e.planetShape), u = Lt(e.planetPreset), c = gi(u, r), m = n && !["none", "color"].includes(c) ? "custom" : c, l = Ei(e), P = vn(e.orbits), v = bn(e.orbit);
  return {
    id: String(e.id || xe("object")),
    name: String(e.name || "Unnamed Object"),
    kind: l,
    x: pe(Ce(e.x, 50), 0, 100),
    y: pe(Ce(e.y, 50), 0, 100),
    status: Mi.includes(e.status) ? e.status : "known",
    visibility: Tn(e.visibility),
    factionId: String(e.factionId || ""),
    description: String(e.description || ""),
    image: String(e.image || ""),
    sceneIds: t,
    planetLocations: Ti(e.planetLocations).filter((_) => t.includes(_.sceneId)),
    journalId: String(e.journalId || ""),
    notes: String(e.notes || "").trim(),
    iconColor: bt(e.iconColor),
    iconSize: pe(Ce(e.iconSize, 28), 18, 56),
    markerImage: String(e.markerImage || "").trim(),
    iconStyle: kt.includes(e.iconStyle) ? e.iconStyle : l === "star" ? "star" : l === "station" ? "station" : "planet",
    pulse: e.pulse !== !1,
    planetPreset: m,
    planetShape: r,
    planetFinish: pi(e.planetFinish),
    planetTexture: n,
    planetColor: bt(e.planetColor) || "#58d8ff",
    ...P.length ? { orbits: P } : {},
    ...v ? { orbit: v } : {}
  };
}
const Qt = It;
function xi(e = {}) {
  var P;
  const t = Array.isArray(e.objects) ? e.objects.map(It) : [], n = t.filter((v) => v.orbit && !Pt(t, v.id, v.orbit));
  for (const v of n) delete v.orbit;
  const r = new Set(t.map((v) => v.id)), u = (Array.isArray(e.routes) ? e.routes : []).map(Ot).filter((v) => v.fromSystemId !== v.toSystemId && r.has(v.fromSystemId) && r.has(v.toSystemId)), c = t.some((v) => v.id === e.primaryObjectId) ? String(e.primaryObjectId) : ((P = t[0]) == null ? void 0 : P.id) ?? "", m = t.find((v) => v.id === c) ?? It(e), l = {
    id: String(e.id || xe("system")),
    name: String(e.name || "Unnamed System"),
    x: pe(Ce(e.x, 50), 0, 100),
    y: pe(Ce(e.y, 50), 0, 100),
    type: In.includes(e.type) ? e.type : "unknown",
    factionId: String(e.factionId || ""),
    status: Mi.includes(e.status) ? e.status : "known",
    description: String(e.description || ""),
    visibility: et(e.visibility, "players"),
    notes: String(e.notes || "").trim(),
    backgroundImage: String(e.backgroundImage || "").trim(),
    iconColor: bt(e.iconColor),
    iconSize: pe(Ce(e.iconSize, 30), 18, 56),
    markerImage: String(e.markerImage || "").trim(),
    iconStyle: kt.includes(e.iconStyle) ? e.iconStyle : "star",
    pulse: e.pulse !== !1,
    primaryObjectId: c,
    objects: t,
    routes: u
  };
  for (const [v, w] of Object.entries({
    image: m.image,
    sceneIds: [...m.sceneIds],
    planetLocations: [...m.planetLocations],
    journalId: m.journalId,
    planetPreset: m.planetPreset,
    planetShape: m.planetShape,
    planetFinish: m.planetFinish,
    planetTexture: m.planetTexture,
    planetColor: m.planetColor
  })) Object.defineProperty(l, v, { value: w, enumerable: !1, configurable: !0 });
  return l;
}
function Ot(e = {}) {
  return {
    id: String(e.id || xe("route")),
    fromSystemId: String(e.fromSystemId || ""),
    toSystemId: String(e.toSystemId || ""),
    type: Mn.includes(e.type) ? e.type : "unknown",
    travelTime: String(e.travelTime || ""),
    fuelCost: Ce(e.fuelCost, 0),
    visibility: et(e.visibility, "players"),
    notes: String(e.notes || "")
  };
}
function Pi(e = {}) {
  const t = e.kind === "minor" ? "minor" : "major", n = Object.fromEntries(Object.entries(e.systemProminence ?? {}).filter(([, r]) => typeof r == "string" && r && r !== "Unrated"));
  return {
    ...e,
    id: String(e.id || xe("faction")),
    name: String(e.name || "Unaffiliated"),
    color: En(e.color),
    description: String(e.description || ""),
    visibility: et(e.visibility, "players"),
    emblem: String(e.emblem || "").trim(),
    tagline: String(e.tagline || "").trim(),
    type: String(e.type || "").trim(),
    headquartersSystemId: String(e.headquartersSystemId || ""),
    gmNotes: String(e.gmNotes || ""),
    kind: t,
    parentFactionId: t === "minor" ? String(e.parentFactionId || "") : "",
    prominence: typeof e.prominence == "string" && e.prominence ? e.prominence : "Unrated",
    systemProminence: n,
    reputation: typeof e.reputation == "string" && e.reputation ? e.reputation : "Neutral"
  };
}
function Ct(e = {}) {
  return `${String(e.id || "galaxy")}-system-1`;
}
function Pn(e = {}) {
  const t = String(e.id || e.objectId || xe("object")), n = Ei(e);
  return {
    ...e,
    id: t,
    name: String(e.name || "Unnamed Location"),
    kind: n,
    x: e.x,
    y: e.y,
    visibility: e.visibility,
    iconColor: e.iconColor,
    iconSize: e.iconSize,
    iconStyle: e.iconStyle === "planet" && n !== "planet" ? n === "station" ? "station" : n === "star" ? "star" : "diamond" : e.iconStyle,
    pulse: e.pulse
  };
}
function ki(e, t, n = "", r = Ct(e), u = []) {
  var m;
  const c = t.some((l) => l.id === n) ? n : ((m = t[0]) == null ? void 0 : m.id) ?? "";
  return {
    id: r,
    name: "System 1",
    x: 50,
    y: 50,
    type: "core",
    factionId: "",
    status: "known",
    description: "",
    visibility: et(e.visibility, "players"),
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
function kn(e, t) {
  var m;
  const r = (Array.isArray(e.systems) ? e.systems : []).map(Pn), u = String(e.currentSystemId || ((m = r[0]) == null ? void 0 : m.id) || ""), c = ki(e, r, u, Ct(e), Array.isArray(e.routes) ? e.routes : []);
  return {
    ...e,
    schemaVersion: je,
    migratedFromSchema: t,
    systems: [c],
    routes: [],
    currentLocation: { systemId: c.id, objectId: c.primaryObjectId },
    currentSystemId: c.id
  };
}
function ei(e) {
  return !!(e != null && e.id && (e == null ? void 0 : e.primaryObjectId) === `${e.id}-object` && Array.isArray(e.objects) && e.objects.some((t) => t.id === e.primaryObjectId));
}
function qn(e) {
  var se, L, U, Z;
  const t = Array.isArray(e.systems) ? e.systems : [], n = t.filter(ei), r = t.filter((R) => !ei(R));
  if (!n.length && t.length) return { ...e, schemaVersion: je };
  const u = new Set(r.map((R) => String(R.id)));
  let c = Ct(e);
  u.has(c) && (c = `${c}-legacy`);
  const m = new Set(n.map((R) => String(R.id))), l = new Map(n.map((R) => [String(R.id), String(R.primaryObjectId)])), P = n.flatMap((R) => (R.objects ?? []).map((B) => {
    const te = B.id === R.primaryObjectId;
    return {
      ...B,
      x: te ? R.x : B.x,
      y: te ? R.y : B.y,
      visibility: B.visibility === "inherit" ? R.visibility : B.visibility,
      factionId: B.factionId || R.factionId || ""
    };
  })), v = String(((se = e.currentLocation) == null ? void 0 : se.systemId) || e.currentSystemId || ""), w = n.find((R) => R.id === v), _ = String(((L = e.currentLocation) == null ? void 0 : L.objectId) || (w == null ? void 0 : w.primaryObjectId) || ((U = P[0]) == null ? void 0 : U.id) || ""), k = Array.isArray(e.routes) ? e.routes : [], F = k.filter((R) => m.has(String(R.fromSystemId)) && m.has(String(R.toSystemId))).map((R) => ({ ...R, fromSystemId: l.get(String(R.fromSystemId)), toSystemId: l.get(String(R.toSystemId)) })), O = ki(e, P, _, c, F), C = [O, ...r], N = new Set(C.map((R) => String(R.id))), V = /* @__PURE__ */ new Set(), K = k.filter((R) => !(m.has(String(R.fromSystemId)) && m.has(String(R.toSystemId)))).map((R) => ({
    ...R,
    fromSystemId: m.has(String(R.fromSystemId)) ? c : R.fromSystemId,
    toSystemId: m.has(String(R.toSystemId)) ? c : R.toSystemId
  })).filter((R) => {
    if (R.fromSystemId === R.toSystemId || !N.has(String(R.fromSystemId)) || !N.has(String(R.toSystemId))) return !1;
    const B = [R.fromSystemId, R.toSystemId].sort().join(":");
    return V.has(B) ? !1 : (V.add(B), !0);
  }), oe = m.has(v) || !N.has(v) ? c : v;
  return {
    ...e,
    schemaVersion: je,
    migratedFromSchema: 2,
    systems: C,
    routes: K,
    currentLocation: { systemId: oe, objectId: oe === c ? O.primaryObjectId : ((Z = e.currentLocation) == null ? void 0 : Z.objectId) ?? "" },
    currentSystemId: oe
  };
}
function On(e = {}) {
  const t = Number(e.schemaVersion) || 1;
  if (t > je) throw new Error(`Galaxy Map schema ${t} is newer than supported schema ${je}.`);
  return t >= je ? { ...e, schemaVersion: je } : t < 2 ? kn(e, t) : qn(e);
}
function Y(e = {}) {
  var k, F, O, C;
  const t = On(e), n = Array.isArray(t.systems) ? t.systems.map(xi) : [], r = Array.isArray(t.routes) ? t.routes.map(Ot) : [], u = Array.isArray(t.factions) ? t.factions.filter((N) => N && typeof N == "object").map(Pi) : [], c = new Set(u.filter((N) => N.kind === "major").map((N) => N.id)), m = new Set(n.map((N) => N.id));
  for (const N of u)
    (!c.has(N.parentFactionId) || N.parentFactionId === N.id) && (N.parentFactionId = ""), N.systemProminence = Object.fromEntries(Object.entries(N.systemProminence).filter(([V]) => m.has(V)));
  const l = String(((k = t.currentLocation) == null ? void 0 : k.systemId) || t.currentSystemId || ((F = n[0]) == null ? void 0 : F.id) || ""), P = n.some((N) => N.id === l) ? l : ((O = n[0]) == null ? void 0 : O.id) ?? "", v = n.find((N) => N.id === P), w = String(((C = t.currentLocation) == null ? void 0 : C.objectId) || ""), _ = v != null && v.objects.some((N) => N.id === w) ? w : (v == null ? void 0 : v.primaryObjectId) ?? "";
  return {
    schemaVersion: je,
    id: String(t.id || xe("map")),
    title: String(t.title || "Untitled Galaxy Map"),
    subtitle: String(t.subtitle || ""),
    description: String(t.description || ""),
    backgroundImage: String(t.backgroundImage || ""),
    visibility: et(t.visibility, "players"),
    travelApprovalMode: Et(t.travelApprovalMode),
    currentLocation: { systemId: P, objectId: _ },
    currentSystemId: P,
    systems: n,
    routes: r,
    factions: u
  };
}
function Ve(e, t) {
  return (t == null ? void 0 : t.visibility) === "inherit" ? (e == null ? void 0 : e.visibility) ?? "gm" : (t == null ? void 0 : t.visibility) ?? "gm";
}
const Cn = "modules/galaxy-map/assets/frames/galaxy-frame-cyan.svg";
let ti = null;
const ii = /* @__PURE__ */ new Map();
let nt = null;
const st = {
  default: { primary: "#69e8ff", success: "#62ffb6", background: "#03070b" },
  ember: { primary: "#ffb86b", success: "#ffe08a", background: "#0d0604" },
  violet: { primary: "#a9b8ff", success: "#7dffc4", background: "#070713" },
  "space-police": { primary: "#fff15a", success: "#9fffd1", background: "#020202" },
  red: { primary: "#ff304f", success: "#66ffc7", background: "#050103" },
  corporate: { primary: "#147dba", success: "#21875c", background: "#dce3e6" }
};
function ni(e, t, n) {
  const r = (m) => [1, 3, 5].map((l) => Number.parseInt(m.slice(l, l + 2), 16)), u = r(e), c = r(t);
  return `rgb(${u.map((m, l) => Math.round(m * n + c[l] * (1 - n))).join(", ")})`;
}
function An() {
  var r, u, c, m, l, P;
  const e = document.documentElement, t = ((r = e == null ? void 0 : e.dataset) == null ? void 0 : r.holosuiteDeviceStyle) || ((c = (u = document.body) == null ? void 0 : u.dataset) == null ? void 0 : c.holosuiteDeviceStyle) || "";
  if (st[t]) return st[t];
  const n = ((m = e == null ? void 0 : e.dataset) == null ? void 0 : m.holosuiteTheme) || ((P = (l = document.body) == null ? void 0 : l.dataset) == null ? void 0 : P.holosuiteTheme) || "default";
  return st[n] ?? st.default;
}
async function qi(e) {
  const { primary: t, success: n, background: r } = An(), u = ni(t, r, 0.58), c = ni(t, r, 0.34), m = [t, n, u, c, r].join("|");
  e.dataset.gmfFramePalette = m;
  let l = ii.get(m);
  if (!l)
    try {
      ti ?? (ti = fetch(Cn).then((w) => {
        if (!w.ok) throw new Error(`Galaxy frame request failed (${w.status})`);
        return w.text();
      }));
      let P = await ti;
      P = P.replace(/<script\b[\s\S]*?<\/script>/gi, "");
      const v = /* @__PURE__ */ new Map([
        ["#18ebed", t],
        ["#28f3f5", t],
        ["#3be8e4", t],
        ["#64f4f1", n],
        ["#1490ab", u],
        ["#22788b", c],
        ["#042228", r]
      ]);
      for (const [w, _] of v) P = P.replace(new RegExp(w, "gi"), _);
      l = URL.createObjectURL(new Blob([P], { type: "image/svg+xml" })), ii.set(m, l);
    } catch {
      return;
    }
  e.isConnected && e.dataset.gmfFramePalette === m && e.style.setProperty("--gmf-frame-image", `url("${l}")`);
}
function Rn() {
  if (nt) return;
  nt = new MutationObserver(() => {
    document.querySelectorAll(".gmf-manager-window, .gmf-map-window, .gmf-crud-dialog").forEach((t) => void qi(t));
  });
  const e = { attributes: !0, attributeFilter: ["data-holosuite-theme", "data-holosuite-device-style"] };
  nt.observe(document.documentElement, e), document.body && nt.observe(document.body, e);
}
function Oi(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
function Ci(e) {
  var t, n;
  return e ? (t = e.matches) != null && t.call(e, ".window-app, .application, .app") ? e : (n = e.closest) == null ? void 0 : n.call(e, ".window-app, .application, .app") : null;
}
function ct(e, t) {
  const n = Oi(t), r = Ci(n);
  r && (Rn(), qi(r));
  const u = Array.from((n == null ? void 0 : n.querySelectorAll("[data-gmf-window-drag]")) ?? []);
  if (!(!n || !r || !u.length)) {
    n.querySelectorAll("[data-action='close-window']").forEach((c) => {
      c.dataset.gmfCloseBound !== "true" && (c.dataset.gmfCloseBound = "true", c.addEventListener("click", () => {
        var m;
        return (m = e.close) == null ? void 0 : m.call(e);
      }));
    });
    for (const c of u)
      c.dataset.gmfDragBound !== "true" && (c.dataset.gmfDragBound = "true", c.addEventListener("pointerdown", (m) => {
        var C, N, V;
        if (m.button !== 0) return;
        const l = m.target;
        if ((C = l == null ? void 0 : l.closest) != null && C.call(l, "button, input, select, textarea, a, [data-action]")) return;
        const P = r.getBoundingClientRect(), v = m.clientX, w = m.clientY, _ = P.left, k = P.top;
        (N = e.bringToFront ?? e.bringToTop) == null || N.call(e), (V = c.setPointerCapture) == null || V.call(c, m.pointerId), c.classList.add("is-dragging");
        const F = (K) => {
          var Z;
          const oe = r.getBoundingClientRect().width, se = r.getBoundingClientRect().height, L = Math.max(0, Math.min(window.innerWidth - Math.min(oe, 80), _ + K.clientX - v)), U = Math.max(0, Math.min(window.innerHeight - Math.min(se, 48), k + K.clientY - w));
          (Z = e.setPosition) == null || Z.call(e, { left: L, top: U });
        }, O = () => {
          c.classList.remove("is-dragging"), c.removeEventListener("pointermove", F), c.removeEventListener("pointerup", O), c.removeEventListener("pointercancel", O);
        };
        c.addEventListener("pointermove", F), c.addEventListener("pointerup", O), c.addEventListener("pointercancel", O);
      }));
  }
}
function jn(e, t) {
  var v, w;
  const n = Oi(t), r = Ci(n), u = (v = r == null ? void 0 : r.querySelector) == null ? void 0 : v.call(r, ":scope > .window-content");
  if (!n || !r || !u || u.querySelector(":scope > .gmf-dialog-header")) return;
  const c = document.createElement("header");
  c.className = "gmf-dialog-header", c.dataset.gmfWindowDrag = "true";
  const m = document.createElement("div");
  m.className = "gmf-dialog-header__identity", m.innerHTML = '<span class="gmf-dialog-header__orb"><i class="fa-solid fa-satellite"></i></span><span><small>GALAXY MAP // CONTROL PANEL</small><strong></strong></span>';
  const l = m.querySelector("strong");
  l && (l.textContent = (e == null ? void 0 : e.title) || ((w = r.querySelector(".window-title")) == null ? void 0 : w.textContent) || "Galaxy Map");
  const P = document.createElement("button");
  P.type = "button", P.className = "gmf-window-close", P.dataset.action = "close-window", P.title = "Close", P.setAttribute("aria-label", "Close window"), P.innerHTML = '<i class="fa-solid fa-xmark"></i>', c.append(m, P), u.prepend(c), ct(e, r);
}
const Ue = {
  classes: ["galaxy-map", "gmf-crud-dialog"]
};
function lt() {
  const { ApplicationV2: e, HandlebarsApplicationMixin: t } = foundry.applications.api;
  return t(e);
}
const he = "galaxy-map", wt = "maps", Ai = "enableFactions", Fn = "reputationRatings", $n = "prominenceRatings", at = "schemaV1Backup", Mt = "surfaceLocationRecoveryV2", _e = `module.${he}`, Oe = `modules/${he}/templates`;
function De() {
  var e;
  return ((e = game.settings) == null ? void 0 : e.get(he, Ai)) !== !1;
}
const dt = {
  reputation: {
    setting: Fn,
    title: "Reputation",
    icon: "fa-solid fa-users",
    defaults: ["Hostile", "Unfriendly", "Neutral", "Friendly", "Allied"]
  },
  prominence: {
    setting: $n,
    title: "Prominence",
    icon: "fa-solid fa-layer-group",
    defaults: ["Absent", "Limited", "Established", "Influential", "Dominant"]
  }
};
function Ri(e) {
  return dt[e].defaults.map((t) => ({ id: t, label: t }));
}
function _t(e) {
  var n, r;
  const t = (r = (n = game.settings) == null ? void 0 : n.get(he, dt[e].setting)) == null ? void 0 : r.ratings;
  return Array.isArray(t) ? t.filter((u) => typeof (u == null ? void 0 : u.id) == "string" && u.id && typeof u.label == "string" && u.label.trim()) : Ri(e);
}
function Nn(e) {
  return String(e || "galaxy-map").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "galaxy-map";
}
function Dn(e, t) {
  const n = JSON.stringify(t, null, 2), r = globalThis.saveDataToFile;
  if (typeof r == "function") {
    r(n, "application/json", e);
    return;
  }
  const u = new Blob([n], { type: "application/json" }), c = URL.createObjectURL(u), m = document.createElement("a");
  m.href = c, m.download = e, document.body.appendChild(m), m.click(), m.remove(), setTimeout(() => URL.revokeObjectURL(c), 0);
}
function Le(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function ji(e) {
  return (e == null ? void 0 : e[0]) ?? e ?? null;
}
function si(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
}
function Gn(e = globalThis) {
  var u, c, m;
  const t = (m = (c = (u = e.foundry) == null ? void 0 : u.applications) == null ? void 0 : c.apps) == null ? void 0 : m.FilePicker, n = t == null ? void 0 : t.implementation;
  if (typeof n == "function") return n;
  if (typeof t == "function") return t;
  const r = typeof FilePicker == "function" ? FilePicker : e.FilePicker;
  return typeof r == "function" ? r : null;
}
function Fi(e) {
  const t = (n) => n ? e.querySelector(`[name="${n}"]`) : null;
  e.querySelectorAll("[data-browse-target]").forEach((n) => {
    n.addEventListener("click", (r) => {
      r.preventDefault();
      const u = t(n.dataset.browseTarget);
      if (!u) return;
      const c = Gn();
      if (!c) {
        console.error("galaxy-map | Foundry FilePicker is unavailable.");
        return;
      }
      new c({
        type: "image",
        current: u.value,
        callback: (m) => {
          u.value = m, si(u);
        }
      }).browse();
    });
  }), e.querySelectorAll("[data-clear-target]").forEach((n) => {
    n.addEventListener("click", (r) => {
      r.preventDefault();
      const u = t(n.dataset.clearTarget);
      u && (u.value = "", si(u));
    });
  });
}
function Bn(e) {
  var L;
  const {
    templateRoot: t,
    getMaps: n,
    prepareMapForManager: r,
    getRawMap: u,
    importMapData: c,
    exportMap: m,
    duplicateMap: l,
    deleteMap: P,
    createMap: v,
    deleteSystem: w,
    deleteObject: _,
    deleteRoute: k,
    deleteFaction: F,
    openMap: O,
    showMapToPlayers: C,
    hideSystemFromPlayers: N,
    hideRouteFromPlayers: V,
    hideFactionFromPlayers: K,
    notifyError: oe,
    clearManagerApp: se
  } = e;
  return L = class extends lt() {
    constructor(R = {}) {
      super(R);
      X(this, "selectedMapId");
      X(this, "activeTab");
      X(this, "expandedSystemId");
      this.selectedMapId = R.selectedMapId ?? null, this.activeTab = ["systems", "routes", "factions"].includes(R.activeTab) ? R.activeTab : "systems", this.expandedSystemId = R.expandedSystemId;
    }
    async _prepareContext(R) {
      var ne, Se;
      const B = await super._prepareContext(R), te = !De();
      te && this.activeTab === "factions" && (this.activeTab = "systems");
      const re = n().sort((ve, be) => ve.title.localeCompare(be.title));
      (!this.selectedMapId || !re.some((ve) => ve.id === this.selectedMapId)) && (this.selectedMapId = ((ne = re[0]) == null ? void 0 : ne.id) ?? null);
      const ie = this.selectedMapId ? r(u(this.selectedMapId)) : null;
      if (ie) {
        const ve = new Set(ie.systems.map((be) => be.id));
        this.expandedSystemId && !ve.has(this.expandedSystemId) && (this.expandedSystemId = void 0), this.expandedSystemId === void 0 && (this.expandedSystemId = ((Se = ie.systems[0]) == null ? void 0 : Se.id) ?? null), ie.systems = ie.systems.map((be) => ({
          ...be,
          isExpanded: be.id === this.expandedSystemId
        }));
      }
      return {
        ...B,
        maps: re,
        selectedMap: ie,
        selectedMapId: this.selectedMapId,
        activeTab: this.activeTab,
        factionsDisabled: te,
        showSystems: this.activeTab === "systems",
        showRoutes: this.activeTab === "routes",
        showFactions: this.activeTab === "factions",
        hasMaps: re.length > 0
      };
    }
    _attachPartListeners(R, B, te) {
      var re, ie, ne, Se, ve, be, Pe;
      super._attachPartListeners(R, B, te), ct(this, B), (re = B.querySelector("[data-action='create-map']")) == null || re.addEventListener("click", () => this._onCreateMap()), (ie = B.querySelector("[data-action='edit-map-metadata']")) == null || ie.addEventListener("click", () => {
        this._openViewportEditor("map");
      }), (ne = B.querySelector("[data-action='create-system']")) == null || ne.addEventListener("click", () => {
        this._openViewportEditor("system");
      }), (Se = B.querySelector("[data-action='create-route']")) == null || Se.addEventListener("click", () => {
        this._openViewportEditor("route");
      }), (ve = B.querySelector("[data-action='create-faction']")) == null || ve.addEventListener("click", () => {
        this._openViewportEditor("faction");
      }), B.querySelectorAll("[data-manager-tab]").forEach(($) => {
        $.addEventListener("click", () => {
          const ye = $.dataset.managerTab;
          !["systems", "routes", "factions"].includes(ye) || ye === this.activeTab || (this.activeTab = ye, this.render({ force: !0 }));
        });
      }), B.querySelectorAll("[data-toggle-system]").forEach(($) => {
        $.addEventListener("click", () => {
          const ye = $.dataset.toggleSystem;
          this.expandedSystemId = this.expandedSystemId === ye ? null : ye, this.render({ force: !0 });
        });
      }), B.querySelectorAll("[data-edit-system]").forEach(($) => {
        $.addEventListener("click", () => this._openViewportEditor("system", { id: $.dataset.editSystem }));
      }), B.querySelectorAll("[data-create-object]").forEach(($) => {
        $.addEventListener("click", () => this._openViewportEditor("entity", { systemId: $.dataset.createObject }));
      }), B.querySelectorAll("[data-edit-object]").forEach(($) => {
        $.addEventListener("click", () => this._openViewportEditor("entity", { systemId: $.dataset.objectSystem, id: $.dataset.editObject }));
      }), B.querySelectorAll("[data-delete-object]").forEach(($) => {
        $.addEventListener("click", () => this._confirmDeleteObject($.dataset.objectSystem, $.dataset.deleteObject));
      }), B.querySelectorAll("[data-show-system]").forEach(($) => {
        $.addEventListener("click", () => N(this.selectedMapId, $.dataset.showSystem, !1));
      }), B.querySelectorAll("[data-hide-system]").forEach(($) => {
        $.addEventListener("click", () => N(this.selectedMapId, $.dataset.hideSystem, !0));
      }), B.querySelectorAll("[data-delete-system]").forEach(($) => {
        $.addEventListener("click", () => this._confirmDeleteSystem($.dataset.deleteSystem));
      }), B.querySelectorAll("[data-edit-route]").forEach(($) => {
        $.addEventListener("click", () => this._openViewportEditor("route", { id: $.dataset.editRoute, systemId: $.dataset.routeSystem }));
      }), B.querySelectorAll("[data-show-route]").forEach(($) => {
        $.addEventListener("click", () => V(this.selectedMapId, $.dataset.showRoute, !1, $.dataset.routeSystem));
      }), B.querySelectorAll("[data-hide-route]").forEach(($) => {
        $.addEventListener("click", () => V(this.selectedMapId, $.dataset.hideRoute, !0, $.dataset.routeSystem));
      }), B.querySelectorAll("[data-delete-route]").forEach(($) => {
        $.addEventListener("click", () => this._confirmDeleteRoute($.dataset.deleteRoute, $.dataset.routeSystem));
      }), B.querySelectorAll("[data-edit-faction]").forEach(($) => {
        $.addEventListener("click", () => this._openViewportEditor("faction", { id: $.dataset.editFaction }));
      }), B.querySelectorAll("[data-show-faction]").forEach(($) => {
        $.addEventListener("click", () => K(this.selectedMapId, $.dataset.showFaction, !1));
      }), B.querySelectorAll("[data-hide-faction]").forEach(($) => {
        $.addEventListener("click", () => K(this.selectedMapId, $.dataset.hideFaction, !0));
      }), B.querySelectorAll("[data-delete-faction]").forEach(($) => {
        $.addEventListener("click", () => this._confirmDeleteFaction($.dataset.deleteFaction));
      }), (be = B.querySelector("[data-action='export-map']")) == null || be.addEventListener("click", () => {
        this.selectedMapId && m(this.selectedMapId);
      }), (Pe = B.querySelector("[data-action='import-map']")) == null || Pe.addEventListener("click", () => this._onImportMap()), B.querySelectorAll("[data-select-map]").forEach(($) => {
        $.addEventListener("click", () => {
          this.selectedMapId = $.dataset.selectMap, this.expandedSystemId = void 0, this.render({ force: !0 });
        });
      }), B.querySelectorAll("[data-open-map]").forEach(($) => {
        $.addEventListener("click", () => O($.dataset.openMap));
      }), B.querySelectorAll("[data-show-map]").forEach(($) => {
        $.addEventListener("click", () => C($.dataset.showMap));
      }), B.querySelectorAll("[data-duplicate-map]").forEach(($) => {
        $.addEventListener("click", async () => {
          const ye = await l($.dataset.duplicateMap);
          ye && (this.selectedMapId = ye.id, this.render({ force: !0 }));
        });
      }), B.querySelectorAll("[data-delete-map]").forEach(($) => {
        $.addEventListener("click", async () => {
          const ye = $.dataset.deleteMap, ke = u(ye);
          await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${Le((ke == null ? void 0 : ke.title) ?? ye)}</strong>? This cannot be undone.</p>`
          }, Ue) && (await P(ye), this.selectedMapId === ye && (this.selectedMapId = null), this.render({ force: !0 }));
        });
      });
    }
    _onImportMap() {
      const R = document.createElement("input");
      R.type = "file", R.accept = ".json,application/json", R.addEventListener("change", async () => {
        var te;
        const B = (te = R.files) == null ? void 0 : te[0];
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
            oe(`Could not import map: ${ie}`);
          }
      }, { once: !0 }), R.click();
    }
    async _onCreateMap() {
      const R = await v({
        title: "New Galaxy Map",
        subtitle: "Uncharted theatre",
        description: "A campaign-scale navigation map.",
        visibility: "players",
        factions: De() ? [
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
      R && (this.selectedMapId = R.id, this.render({ force: !0 }));
    }
    _openViewportEditor(R, B = {}) {
      var te, re;
      this.selectedMapId && ((re = (te = O(this.selectedMapId)) == null ? void 0 : te.openEditor) == null || re.call(te, R, B));
    }
    async _confirmDeleteSystem(R) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, Ue) && await w(this.selectedMapId, R);
    }
    async _confirmDeleteObject(R, B) {
      await Dialog.confirm({
        title: "Delete Location",
        content: "<p>Delete this location and its linked content from the system?</p>"
      }) && await _(this.selectedMapId, R, B);
    }
    async _confirmDeleteRoute(R, B = "") {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, Ue) && await k(this.selectedMapId, R, B);
    }
    async _confirmDeleteFaction(R) {
      await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }, Ue) && await F(this.selectedMapId, R);
    }
    async close(R = {}) {
      return se(this), super.close(R);
    }
  }, X(L, "DEFAULT_OPTIONS", {
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
  }), X(L, "PARTS", {
    main: {
      template: `${t}/map-manager.hbs`
    }
  }), L;
}
const zn = 22;
function Hn(e) {
  const t = [];
  for (const n of e) {
    const r = t.find((u) => u.every((c) => Math.hypot(n[0] - c[0], n[1] - c[1]) <= zn));
    r ? r.push(n) : t.push([n]);
  }
  return t;
}
const ai = (e, t) => e[0] - t[0] || e[1] - t[1];
function ri(e) {
  return e.sort(ai).filter((t, n) => n === 0 || ai(t, e[n - 1]) !== 0);
}
function Vn(e) {
  const t = (r, u, c) => (u[0] - r[0]) * (c[1] - r[1]) - (u[1] - r[1]) * (c[0] - r[0]), n = (r) => {
    const u = [];
    for (const c of r) {
      for (; u.length > 1 && t(u[u.length - 2], u[u.length - 1], c) <= 0; ) u.pop();
      u.push(c);
    }
    return u.slice(0, -1);
  };
  return [...n(e), ...n([...e].reverse())];
}
function Un(e, t, { cluster: n = !0 } = {}) {
  const r = /* @__PURE__ */ new Map();
  for (const l of e) {
    if (!l.factionId || l.obscured || !Number.isFinite(l.x) || !Number.isFinite(l.y)) continue;
    const P = r.get(l.factionId) ?? [];
    P.push([Math.max(0, Math.min(100, l.x)), Math.max(0, Math.min(100, l.y))]), r.set(l.factionId, P);
  }
  const u = n ? 5 : 7, c = n ? 7 : 9, m = (l) => Math.round(Math.max(1, Math.min(99, l)) * 100) / 100;
  return t.filter((l) => l.kind !== "minor").flatMap(({ id: l, name: P, color: v }) => {
    const w = ri(r.get(l) ?? []);
    return w.length ? (n ? Hn(w) : [w]).map((_) => {
      const k = ri(_.flatMap(([C, N]) => Array.from({ length: 12 }, (V, K) => {
        const oe = K * Math.PI / 6;
        return [m(C + Math.cos(oe) * u), m(N + Math.sin(oe) * c)];
      }))), F = Vn(k), O = F.reduce(({ left: C, right: N, top: V }, [K, oe]) => ({
        left: Math.min(C, K),
        right: Math.max(N, K),
        top: Math.min(V, oe)
      }), { left: 100, right: 0, top: 100 });
      return {
        id: l,
        name: P,
        color: v,
        points: F.map((C) => C.join(",")).join(" "),
        labelX: Math.max(12, Math.min(88, (O.left + O.right) / 2)),
        labelY: Math.max(3, O.top + 1)
      };
    }) : [];
  });
}
function $i() {
  var e, t, n;
  try {
    const r = (t = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : t.call(e, "bounty-board");
    if ((r == null ? void 0 : r.active) === !1) return null;
    const u = r.api ?? ((n = game.scifiSuite) == null ? void 0 : n.bountyBoard);
    return typeof (u == null ? void 0 : u.getBountiesForScene) == "function" ? u : null;
  } catch {
    return null;
  }
}
function Yn(e) {
  const t = $i();
  if (!t || !Array.isArray(e == null ? void 0 : e.sceneIds)) return [];
  const n = /* @__PURE__ */ new Set(), r = [];
  try {
    for (const u of e.sceneIds)
      for (const c of t.getBountiesForScene(String(u)) ?? []) {
        const m = String((c == null ? void 0 : c.id) ?? "");
        !m || n.has(m) || (n.add(m), r.push({
          id: m,
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
function Xn(e) {
  try {
    const t = $i();
    return typeof (t == null ? void 0 : t.openBounty) == "function" && t.openBounty(String(e)) !== !1;
  } catch {
    return !1;
  }
}
const He = /* @__PURE__ */ new Map(), Wn = 40, Jn = 192;
function Zn(e) {
  return new Promise((t, n) => {
    const r = new Image();
    r.onload = () => t(r), r.onerror = () => n(new Error("Image unavailable")), r.src = e;
  });
}
async function Kn(e) {
  if (!e) return null;
  try {
    const t = await Zn(e), n = Math.min(1, Jn / Math.max(t.naturalWidth || t.width, t.naturalHeight || t.height)), r = Math.max(2, Math.round((t.naturalWidth || t.width) * n)), u = Math.max(2, Math.round((t.naturalHeight || t.height) * n)), c = document.createElement("canvas");
    c.width = r, c.height = u;
    const m = c.getContext("2d", { willReadFrequently: !0 });
    if (!m) return null;
    m.drawImage(t, 0, 0, r, u);
    const l = m.getImageData(0, 0, r, u), P = m.createImageData(r, u), v = new Float32Array(r * u);
    for (let _ = 0; _ < v.length; _++) {
      const k = _ * 4;
      v[_] = l.data[k] * 0.299 + l.data[k + 1] * 0.587 + l.data[k + 2] * 0.114;
    }
    const w = (_, k) => v[k * r + _];
    for (let _ = 1; _ < u - 1; _++)
      for (let k = 1; k < r - 1; k++) {
        const F = -w(k - 1, _ - 1) + w(k + 1, _ - 1) - 2 * w(k - 1, _) + 2 * w(k + 1, _) - w(k - 1, _ + 1) + w(k + 1, _ + 1), O = -w(k - 1, _ - 1) - 2 * w(k, _ - 1) - w(k + 1, _ - 1) + w(k - 1, _ + 1) + 2 * w(k, _ + 1) + w(k + 1, _ + 1), C = Math.hypot(F, O), N = Math.max(0, Math.min(235, (C - 34) * 2.1)), V = (_ * r + k) * 4;
        P.data[V] = 104, P.data[V + 1] = 241, P.data[V + 2] = 255, P.data[V + 3] = N;
      }
    return m.clearRect(0, 0, r, u), m.putImageData(P, 0, 0), c.toDataURL("image/png");
  } catch {
    return null;
  }
}
function Qn(e, t = "") {
  const n = `${t}\0${e}`, r = He.get(n);
  if (r)
    return He.delete(n), He.set(n, r), r;
  for (; He.size >= Wn; ) {
    const c = He.keys().next().value;
    if (c === void 0) break;
    He.delete(c);
  }
  const u = Kn(e);
  return He.set(n, u), u;
}
function es({ root: e, stage: t, resolveItems: n, onOpen: r }) {
  const u = e.querySelector("[data-intel-layer]");
  if (!u) return null;
  const c = new AbortController(), m = c.signal, l = document.createElement("aside");
  l.className = "gmf-intel-callout", l.setAttribute("aria-label", "Bounty intel"), l.hidden = !0, l.innerHTML = `
    <span class="gmf-intel-callout__connector" aria-hidden="true"></span>
    <div class="gmf-intel-callout__stack" data-intel-list role="group" aria-label="Matching bounties"></div>`, u.append(l);
  let P = [], v = null, w = null, _ = null, k = 0, F = 0;
  const O = () => {
    w && clearTimeout(w), w = null;
  }, C = () => {
    k++, _ && clearTimeout(_), _ = null, w = null, v = null, P = [], F++, l.hidden = !0, l.classList.remove("is-visible", "is-left");
  }, N = (L = 180) => {
    O(), k++, _ && clearTimeout(_), _ = null, w = setTimeout(C, L);
  }, V = () => {
    if (!v || l.hidden) return;
    const L = t.getBoundingClientRect(), U = v.getBoundingClientRect();
    l.style.setProperty("--gmf-intel-stack-height", `${Math.max(80, L.height - 72)}px`);
    const Z = l.offsetWidth || 224, R = l.offsetHeight || 126, B = U.right - L.left + Z + 24 > L.width, te = B ? U.left - L.left - Z - 18 : U.right - L.left + 18, re = Math.max(48, Math.min(L.height - R - 12, U.top - L.top + U.height / 2 - R / 2));
    l.classList.toggle("is-left", B), l.style.left = `${Math.max(8, te)}px`, l.style.top = `${re}px`;
  }, K = () => {
    const L = l.querySelector("[data-intel-list]");
    if (!L || !P.length) return C();
    L.replaceChildren();
    const U = ++F;
    P.forEach((Z, R) => {
      const B = document.createElement("button");
      B.type = "button", B.className = "gmf-intel-callout__body", B.dataset.intelOpen = Z.id, B.style.setProperty("--gmf-intel-index", String(R)), B.style.setProperty("--gmf-intel-delay", `${R * 55}ms`), B.innerHTML = `
        <span class="gmf-intel-callout__portrait"><img alt="" hidden /><i class="fa-solid fa-crosshairs"></i></span>
        <span class="gmf-intel-callout__copy"><small></small><strong></strong><span></span></span>`;
      const te = B.querySelector("strong"), re = B.querySelector("small"), ie = B.querySelector(".gmf-intel-callout__copy > span"), ne = B.querySelector("img"), Se = B.querySelector("i");
      te && (te.textContent = Z.name), re && (re.textContent = `BOUNTY // ${(Z.statusLabel || "INTEL").toUpperCase()}`), ie && (ie.textContent = Z.reward || ""), B.addEventListener("click", () => r(Z.id), { signal: m }), Z.image && ne && (ne.src = Z.image, ne.classList.add("is-css-fallback"), ne.hidden = !1, Se && (Se.hidden = !0), ne.onerror = () => {
        U === F && (ne.hidden = !0, Se && (Se.hidden = !1));
      }, Qn(Z.image, Z.id).then((ve) => {
        !ve || U !== F || !B.isConnected || (ne.classList.remove("is-css-fallback"), ne.src = ve);
      })), L.append(B);
    }), V();
  }, oe = async (L) => {
    O(), v = L;
    const U = ++k;
    let Z = [];
    try {
      Z = await n(L.dataset.systemId ?? "");
    } catch {
    }
    if (!(U !== k || v !== L)) {
      if (!Z.length) return C();
      P = Z, l.hidden = !1, K(), requestAnimationFrame(() => {
        V(), l.classList.add("is-visible");
      });
    }
  }, se = (L) => {
    O(), k++, _ && clearTimeout(_), _ = setTimeout(() => {
      _ = null, oe(L);
    }, 90);
  };
  return e.querySelectorAll("[data-system-id]").forEach((L) => {
    L.addEventListener("pointerenter", () => se(L), { signal: m }), L.addEventListener("pointerleave", () => N(), { signal: m }), L.addEventListener("focus", () => se(L), { signal: m }), L.addEventListener("blur", () => N(), { signal: m }), L.addEventListener("pointerdown", () => C(), { signal: m });
  }), l.addEventListener("pointerenter", O, { signal: m }), l.addEventListener("pointerleave", () => N(), { signal: m }), l.addEventListener("click", (L) => L.stopPropagation(), { signal: m }), t.addEventListener("wheel", () => requestAnimationFrame(V), { signal: m }), window.addEventListener("resize", V, { signal: m }), {
    dispose() {
      k++, w && clearTimeout(w), _ && clearTimeout(_), c.abort(), l.remove();
    }
  };
}
function ts({ host: e }) {
  const t = document.createElement("aside");
  t.className = "gmf-location-callout", t.hidden = !0, t.innerHTML = `
    <span class="gmf-location-callout__connector" aria-hidden="true"></span>
    <strong data-location-name></strong>`, e.append(t);
  let n = null, r = { x: 0, y: 0, visible: !1 }, u = null;
  const c = () => {
    u && clearTimeout(u), u = null;
  }, m = () => {
    c(), n = null, t.hidden = !0, t.classList.remove("is-visible", "is-left");
  }, l = () => {
    if (!n || t.hidden || !r.visible) return;
    const w = t.offsetWidth || 180, _ = t.offsetHeight || 24, k = r.x + w + 76 > e.clientWidth, F = k ? r.x - w - 64 : r.x + 64, O = Math.max(8, Math.min(e.clientHeight - _ - 8, r.y - _ / 2));
    t.classList.toggle("is-left", k), t.style.left = `${Math.max(8, F)}px`, t.style.top = `${O}px`;
  }, P = (w) => {
    c(), n = w;
    const _ = t.querySelector("[data-location-name]");
    _ && (_.textContent = w.missing ? "Missing linked scene" : w.accessible ? w.name : "Restricted location"), t.hidden = !1, l(), requestAnimationFrame(() => {
      l(), t.classList.add("is-visible");
    });
  }, v = (w = 180) => {
    c(), u = setTimeout(m, w);
  };
  return {
    show: P,
    scheduleHide: v,
    hide: m,
    setAnchor(w) {
      if (r = w, !w.visible) return v(40);
      l();
    },
    dispose() {
      m(), t.remove();
    }
  };
}
function is(e, t, n) {
  const r = n.querySelector("[data-ship-layer]"), u = n.querySelector(".gmf-map-stage");
  if (!r || !u) return Promise.resolve();
  const c = u.getBoundingClientRect(), m = (t.x - e.x) * c.width / 100, l = (t.y - e.y) * c.height / 100, P = Math.atan2(l, m) * 180 / Math.PI, v = document.createElement("div");
  return v.className = "gmf-travel-ship", v.innerHTML = '<i class="fa-solid fa-rocket"></i>', v.style.left = `${e.x}%`, v.style.top = `${e.y}%`, v.style.setProperty("--gmf-ship-angle", `${P}deg`), r.replaceChildren(v), new Promise((w) => {
    let _ = !1;
    const k = () => {
      _ || (_ = !0, v.removeEventListener("transitionend", k), v.classList.add("is-arrived"), globalThis.setTimeout(() => {
        v.remove(), w();
      }, 260));
    };
    v.addEventListener("transitionend", k, { once: !0 }), requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        v.style.left = `${t.x}%`, v.style.top = `${t.y}%`;
      });
    }), globalThis.setTimeout(k, qt);
  });
}
function ns(e, t) {
  const n = e.querySelector(".gmf-orbits"), r = n ? t.rings.map((F) => {
    const O = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    return O.setAttribute("vector-effect", "non-scaling-stroke"), n.append(O), { ...F, ellipse: O };
  }) : [], u = Array.from(e.querySelectorAll(".gmf-system[data-system-id]")), c = Array.from(e.querySelectorAll("[data-route-from][data-route-to]")), m = globalThis.matchMedia("(prefers-reduced-motion: reduce)");
  let l = Si, P = null, v;
  const w = (F = Ze()) => t.positions(l, F, !m.matches, v);
  function _() {
    const F = w();
    for (const O of u) {
      const C = F.get(O.dataset.systemId);
      if (!C) continue;
      const N = `${Number(C.x.toFixed(5))}%`, V = `${Number(C.y.toFixed(5))}%`;
      O.style.left !== N && (O.style.left = N), O.style.top !== V && (O.style.top = V);
    }
    for (const O of c) {
      const C = F.get(O.dataset.routeFrom), N = F.get(O.dataset.routeTo);
      C && N && (Ne(O, "x1", C.x), Ne(O, "y1", C.y), Ne(O, "x2", N.x), Ne(O, "y2", N.y));
    }
    for (const { centerId: O, radius: C, ellipse: N } of r) {
      const V = F.get(O), K = Ii(C, l);
      Ne(N, "cx", V.x), Ne(N, "cy", V.y), Ne(N, "rx", K.x), Ne(N, "ry", K.y);
    }
  }
  function k() {
    P !== null && cancelAnimationFrame(P), P = null, e.isConnected && (_(), t.animated && !m.matches && (P = requestAnimationFrame(k)));
  }
  return m.addEventListener("change", k), {
    get aspect() {
      return l;
    },
    get motion() {
      return !m.matches;
    },
    setAspect(F) {
      Number.isFinite(F) && F > 0 && (l = F), k();
    },
    previewDrag(F, O) {
      v = { id: F, point: O }, _();
    },
    finishDrag(F, O) {
      var K;
      const C = (K = t.attachments.get(F)) == null ? void 0 : K.attachment, N = C && w().get(C.centerId);
      if (!C || !N) return;
      const V = wi(O, N, l);
      return v = { id: F, point: O, angle: V }, { centerId: C.centerId, orbitId: C.orbitId, angle: V };
    },
    cancelDrag() {
      v = void 0, _();
    },
    position(F, O) {
      return t.attachments.has(F) ? w(O).get(F) : void 0;
    },
    dispose() {
      P !== null && cancelAnimationFrame(P), m.removeEventListener("change", k);
    }
  };
}
function Ne(e, t, n) {
  const r = String(n);
  e.getAttribute(t) !== r && e.setAttribute(t, r);
}
function ss(e, t) {
  const n = e.querySelector("[data-orbit-editor]");
  if (!n) return;
  const r = n.querySelector("[data-orbit-rows]"), u = n.querySelector("[data-orbit-row-template]"), c = n.querySelector("[data-orbit-attachment]"), m = n.querySelector("[data-orbit-placement]"), l = n.querySelector("[data-orbit-angle]"), P = n.querySelector("[data-orbit-motion]"), v = n.querySelector("[data-orbit-speed]"), w = n.querySelector("[data-orbit-period]");
  function _(O, C = !1) {
    const N = u.content.firstElementChild.cloneNode(!0), V = N.querySelector("[data-orbit-radius]");
    N.dataset.orbitId = O.id, V.value = String(O.radius), N.querySelector("[data-remove-orbit]").addEventListener("click", () => N.remove()), r.append(N), C && V.focus();
  }
  for (const O of t.orbits ?? []) _(O);
  n.querySelector("[data-add-orbit]").addEventListener("click", () => {
    _({ id: xe("orbit"), radius: Math.min(100, 15 + r.childElementCount * 10) }, !0);
  });
  const k = t.orbit;
  k && (l.value = String(k.angle), k.period && (P.value = k.clockwise ? "clockwise" : "counterclockwise", w.value = String(k.period)));
  function F() {
    m.hidden = !c.value, l.disabled = m.hidden, v.hidden = P.value === "fixed", w.disabled = m.hidden || v.hidden;
  }
  return c.addEventListener("change", F), P.addEventListener("change", F), F(), () => {
    const O = Array.from(r.querySelectorAll("[data-orbit-row]"), (U) => ({
      id: U.dataset.orbitId,
      radius: Number(U.querySelector("[data-orbit-radius]").value)
    })), C = t.orbits ?? [], V = O.length !== C.length || O.some((U, Z) => U.id !== C[Z].id || U.radius !== C[Z].radius) ? { orbits: O } : {};
    if (!c.value) return k ? { ...V, orbit: null } : V;
    const [K, oe] = JSON.parse(c.value), se = {
      centerId: K,
      orbitId: oe,
      angle: Number(l.value),
      period: v.hidden ? 0 : Number(w.value),
      clockwise: v.hidden ? (k == null ? void 0 : k.clockwise) ?? !0 : P.value === "clockwise"
    };
    return k && Object.entries(se).every(([U, Z]) => k[U] === Z) ? V : { ...V, orbit: { ...se, epoch: Ze() } };
  };
}
function as(e) {
  var n, r;
  return (((r = (n = foundry.applications) == null ? void 0 : n.ux) == null ? void 0 : r.TextEditor) ?? globalThis.TextEditor).getDragEventData(e) ?? {};
}
async function Ni(e) {
  var c, m, l, P, v, w, _, k;
  const t = as(e), n = globalThis.fromUuid, r = t.uuid && n ? await n(t.uuid) : null;
  if (["Scene", "JournalEntry"].includes(r == null ? void 0 : r.documentName)) return r;
  const u = String(t.sceneId || t.journalId || t.id || "");
  return u ? t.type === "Scene" ? ((m = (c = game.scenes) == null ? void 0 : c.get) == null ? void 0 : m.call(c, u)) ?? null : ["JournalEntry", "Journal"].includes(t.type) ? ((P = (l = game.journal) == null ? void 0 : l.get) == null ? void 0 : P.call(l, u)) ?? null : ((w = (v = game.scenes) == null ? void 0 : v.get) == null ? void 0 : w.call(v, u)) ?? ((k = (_ = game.journal) == null ? void 0 : _.get) == null ? void 0 : k.call(_, u)) ?? null : null;
}
async function rs(e) {
  const t = await Ni(e);
  return (t == null ? void 0 : t.documentName) === "Scene" ? t : null;
}
function os(e) {
  var ke;
  const {
    templateRoot: t,
    getRawMap: n,
    prepareMapForDisplay: r,
    upsertSystem: u,
    upsertObject: c,
    upsertRoute: m,
    upsertFaction: l,
    updateMapMetadata: P,
    deleteFaction: v,
    getTextureGuideMarkup: w,
    activateObjectEditorControls: _,
    revealSystemToPlayers: k,
    revealRouteToPlayers: F,
    hideSystemFromPlayers: O,
    setObjectVisibility: C,
    hideRouteFromPlayers: N,
    deleteSystem: V,
    deleteObject: K,
    deleteRoute: oe,
    setCurrentSystem: se,
    setCurrentObject: L,
    requestTravelToSystem: U,
    requestTravelToObject: Z,
    exportMap: R,
    getTravelRoute: B,
    broadcastTravelAnimation: te,
    broadcastObjectTravelAnimation: re,
    notifyInfo: ie,
    notifyError: ne,
    saveSystemPosition: Se,
    saveObjectPosition: ve,
    savePlanetLocation: be,
    removePlanetLocation: Pe,
    unlinkPlanetScene: $,
    clearMapView: ye
  } = e;
  return ke = class extends lt() {
    constructor(a = {}) {
      var d;
      const i = a.mapId, o = !((d = game.user) != null && d.isGM) || a.playerMode === !0;
      super({
        ...a,
        id: `galaxy-map-view-${o ? "player" : "gm"}-${i}`
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
      X(this, "showGalaxyTerritories", !1);
      X(this, "selectedFactionId", "");
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
      X(this, "factionPanelOpen", !1);
      X(this, "factionPanelTab", "prominence");
      X(this, "_selectionTimer", null);
      X(this, "_worldWidth", 0);
      X(this, "_worldHeight", 0);
      X(this, "_orbitLayer", null);
      X(this, "showOrbits", !0);
      X(this, "_viewportResizeObserver", null);
      X(this, "_viewportStage", null);
      X(this, "_baseWindowHeight", null);
      this.mapId = i, this.playerMode = o, this.selectedSystemId = a.selectedSystemId ?? null, this.selectedRouteId = a.selectedRouteId ?? null, this.activeSystemId = a.activeSystemId ?? null, this.selectedObjectId = a.selectedObjectId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null, this.externalFocus = null, this._externalFocusTimeout = null, this._pendingFocusZoom = null;
    }
    get title() {
      const a = n(this.mapId), i = this.playerMode ? "Player View" : "GM View";
      return a ? `${a.title} - ${i}` : `Galaxy Map - ${i}`;
    }
    async _prepareContext(a) {
      var W, ge, Te, Ee, qe, ze, Fe, We, Yt, Xt, Wt;
      const i = await super._prepareContext(a), o = !De();
      o && (this.factionPanelOpen = !1, this.factionRegistry = !1, this.selectedFactionId = "", ((W = this.creationPanel) == null ? void 0 : W.kind) === "faction" && (this.creationPanel = null));
      const d = n(this.mapId), s = d ? r(d, {
        factionsDisabled: o,
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      }) : null, h = s == null ? void 0 : s.factions.find((q) => q.id === this.selectedFactionId), g = h ? {
        ...h,
        parentName: (ge = s == null ? void 0 : s.factions.find((q) => q.id === h.parentFactionId)) == null ? void 0 : ge.name
      } : null;
      g || (this.selectedFactionId = ""), s != null && s.systems && (s.systems = s.systems.map((q) => ({
        ...q,
        displayType: "system",
        animatedCelestial: !1,
        hasCustomMarker: !!q.displayMarkerImage
      })), s.selectedSystem && (s.selectedSystem = s.systems.find((q) => q.id === s.selectedSystem.id) ?? null)), s != null && s.systems && this.externalFocus && (s.systems = s.systems.map((q) => q.id === this.externalFocus.systemId ? { ...q, isExternalFocus: !0, externalFocus: this.externalFocus } : q), ((Te = s.selectedSystem) == null ? void 0 : Te.id) === this.externalFocus.systemId && (s.selectedSystem = s.systems.find((q) => q.id === this.externalFocus.systemId))), !this.activeSystemId && this.selectedSystemId && !(s != null && s.selectedSystem) && (this.selectedSystemId = null);
      const b = (s == null ? void 0 : s.systems) ?? [], T = b.find((q) => q.id === this.activeSystemId) ?? null;
      T && (s.backgroundImage = T.obscured ? "" : T.backgroundImage || "");
      const x = T ? T.objects.map((q) => {
        var $e;
        const ce = this.playerMode && (T.obscured || q.status === "undiscovered"), Me = ce ? "" : q.markerImage;
        return {
          ...q,
          systemId: T.id,
          displayName: ce ? "???" : q.name,
          displayDescription: ce ? "Unresolved sensor contact. Details are not available." : q.description,
          displayType: ce ? "unknown" : q.kind,
          displayStatus: ce ? "undiscovered" : q.status,
          displayMarkerImage: Me,
          hasCustomMarker: !!Me,
          obscured: ce,
          gmOnly: Ve(T, q) === "gm",
          isSelected: q.id === this.selectedObjectId,
          isCurrent: (($e = s == null ? void 0 : s.currentLocation) == null ? void 0 : $e.objectId) === q.id,
          animatedCelestial: !Me && vt.includes(q.iconStyle),
          hasJournal: !!(!ce && q.journalId),
          hasScenes: !!(!ce && q.sceneIds.length),
          showImage: !!(!ce && q.image),
          canInspectSystem: !!Re({ ...q, obscured: ce })
        };
      }) : [];
      T && this.selectedObjectId && !x.some((q) => q.id === this.selectedObjectId) && (this.selectedObjectId = null);
      const A = x.find((q) => q.id === this.selectedObjectId) ?? null, D = new Set(x.map((q) => q.id)), ee = T ? (T.routes ?? []).filter((q) => (!this.playerMode || q.visibility === "players") && D.has(q.fromSystemId) && D.has(q.toSystemId)).map((q) => {
        const ce = x.find(($e) => $e.id === q.fromSystemId), Me = x.find(($e) => $e.id === q.toSystemId);
        return {
          ...q,
          from: ce,
          to: Me,
          fromName: (ce == null ? void 0 : ce.displayName) ?? q.fromSystemId,
          toName: (Me == null ? void 0 : Me.displayName) ?? q.toSystemId,
          isSelected: q.id === this.selectedRouteId,
          isActive: q.id === this.selectedRouteId,
          gmOnly: q.visibility === "gm"
        };
      }) : [], J = ee.find((q) => q.id === this.selectedRouteId) ?? null, ae = x.find((q) => q.isCurrent) ?? null, le = A && ae && A.id !== ae.id ? ee.find((q) => q.fromSystemId === ae.id && q.toSystemId === A.id || q.toSystemId === ae.id && q.fromSystemId === A.id) : null;
      A && (A.canTravel = !!le, A.isDestination = !!(le && !A.isCurrent), A.travelRouteId = (le == null ? void 0 : le.id) ?? ""), ee.forEach((q) => {
        q.isActive = q.isSelected || q.id === (le == null ? void 0 : le.id);
      }), T && (s.systems = x, s.routes = ee, s.selectedSystem = J ? null : A, s.selectedRoute = J, s.currentSystem = ae);
      const f = x.find((q) => q.id === this.planetSystemId) ?? (T ? null : s == null ? void 0 : s.systems.find((q) => q.id === this.planetSystemId)), p = !this.playerMode || (d == null ? void 0 : d.visibility) === "players" ? Re(f) : null;
      p || (this.planetSystemId = null);
      const I = T && !p && x.some((q) => {
        var ce;
        return (ce = q.orbits) == null ? void 0 : ce.length;
      }) ? gt(
        x,
        new Set(x.filter((q) => q.obscured).map((q) => q.id))
      ) : null, S = f && p ? `${f.id}:${p.preset}` : null;
      S !== this._planetStaticViewKey && (this._planetStaticViewKey = S, this.planetStatic = !!(S && Sn(p == null ? void 0 : p.preset)));
      const M = f && p ? this._preparePlanetLocations(f, p.shape) : [], E = f ?? A, z = !!((Ee = game.user) != null && Ee.isGM && !this.playerMode && T && E), j = ((E == null ? void 0 : E.sceneIds) ?? []).map((q) => {
        var ce, Me;
        return (Me = (ce = game.scenes) == null ? void 0 : ce.get) == null ? void 0 : Me.call(ce, q);
      }).filter((q) => {
        var ce, Me;
        return q && (((ce = game.user) == null ? void 0 : ce.isGM) || ((Me = q.testUserPermission) == null ? void 0 : Me.call(q, game.user, "OBSERVER")));
      }).map((q) => ({ id: q.id, uuid: q.uuid, name: q.name || "Linked Scene" })), H = E != null && E.journalId ? (ze = (qe = game.journal) == null ? void 0 : qe.get) == null ? void 0 : ze.call(qe, E.journalId) : null, Q = H && ((Fe = game.user) != null && Fe.isGM || (We = H.testUserPermission) != null && We.call(H, game.user, "OBSERVER")) ? { id: H.id, uuid: H.uuid, name: H.name || "Linked Journal" } : null, ue = this.creationPanel ? {
        ...this.creationPanel,
        ...this.creationPanel.data,
        kind: this.creationPanel.kind,
        entityKind: (Yt = this.creationPanel.data) == null ? void 0 : Yt.kind,
        factionScale: (Xt = this.creationPanel.data) == null ? void 0 : Xt.kind,
        isSystem: this.creationPanel.kind === "system",
        isEntity: this.creationPanel.kind === "entity",
        isRoute: this.creationPanel.kind === "route",
        isFaction: this.creationPanel.kind === "faction",
        isMap: this.creationPanel.kind === "map",
        mapTitle: (Wt = this.creationPanel.data) == null ? void 0 : Wt.title,
        title: this.creationPanel.kind === "map" ? "Edit Galaxy" : `${this.creationPanel.editId ? "Edit" : "Create"} ${{ system: "System", entity: "Location", route: "Route", faction: "Faction" }[this.creationPanel.kind]}`,
        submitLabel: this.creationPanel.editId ? "Save changes" : "Create",
        systemOptions: (T ? x : (s == null ? void 0 : s.systems) ?? []).map((q) => ({ id: q.id, name: q.displayName || q.name })),
        orbitOptions: this.creationPanel.kind === "entity" ? x.flatMap((q) => (q.orbits ?? []).flatMap((ce, Me) => {
          const $e = { centerId: q.id, orbitId: ce.id };
          if (!Pt(x, this.creationPanel.editId, $e)) return [];
          const it = this.creationPanel.data.orbit;
          return [{
            value: JSON.stringify([q.id, ce.id]),
            label: `${q.name} · Orbit ${Me + 1} (${ce.radius}%)`,
            selected: (it == null ? void 0 : it.centerId) === q.id && it.orbitId === ce.id
          }];
        })) : [],
        missingFaction: !!(this.creationPanel.data.factionId && !(s != null && s.factions.some((q) => q.id === this.creationPanel.data.factionId))),
        missingHeadquarters: !!(this.creationPanel.data.headquartersSystemId && !b.some((q) => q.id === this.creationPanel.data.headquartersSystemId)),
        headquartersOptions: this.creationPanel.kind === "faction" ? b.map((q) => ({ id: q.id, name: q.name })) : [],
        factionOptions: ((s == null ? void 0 : s.factions) ?? []).filter((q) => q.kind === "major").map((q) => ({ id: q.id, name: q.name })),
        parentFactionOptions: ((s == null ? void 0 : s.factions) ?? []).filter((q) => q.kind === "major" && q.id !== this.creationPanel.editId)
      } : null, fe = this.factionPanelOpen && !p && !ue && !this.factionRegistry, me = !o && (fe || (T ? this.showTerritories : this.showGalaxyTerritories)), Ie = !p && !ue && !this.factionRegistry && (g == null ? void 0 : g.kind) === "major" ? g.id : void 0, we = fe && !g && s ? this._prepareFactionPanel(s, T) : null;
      return {
        ...i,
        map: s,
        factionsDisabled: o,
        factionDossier: g,
        showFactionPanel: fe,
        factionPanel: we,
        highlightedFactionId: Ie,
        systemView: !!(T && !p),
        activeSystem: T,
        selectedObject: A,
        planetView: !!p,
        planetSystem: f,
        planetAppearance: p,
        planetLocations: M,
        hasPlanetLocations: M.length > 0,
        canPlacePlanetLocations: z,
        linkedPlanetScenes: j,
        linkedPlanetJournal: Q,
        creationPanel: ue,
        factionRegistry: this.factionRegistry,
        appearanceGuideMarkup: ue != null && ue.isEntity ? w(ue.planetShape || "sphere") : "",
        showInspector: !!(we || ue || this.factionRegistry || g || p || s != null && s.selectedSystem || s != null && s.selectedRoute),
        territories: me && s && !p ? Un(s.systems, s.factions, { cluster: !T }) : [],
        showTerritories: me,
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
        missingMap: !d
      };
    }
    _prepareFactionPanel(a, i) {
      var T;
      const o = this.factionPanelTab === "reputation", d = _t(o ? "reputation" : "prominence");
      o || d.unshift({ id: "Unrated", label: "Unrated" });
      const s = /* @__PURE__ */ new Map();
      for (const x of a.factions) {
        const A = s.get(x.parentFactionId) ?? [];
        A.push(x), s.set(x.parentFactionId, A);
      }
      const h = (i == null ? void 0 : i.id) ?? "", g = !!((T = game.user) != null && T.isGM && (o || !(i != null && i.obscured))), b = (s.get("") ?? []).flatMap((x) => [x, ...s.get(x.id) ?? []]).map((x) => {
        var ee;
        const A = o ? x.reputation : h ? x.systemProminence[h] ?? "Unrated" : x.prominence, D = ((ee = d.find((J) => J.id === A)) == null ? void 0 : ee.label) ?? "Unrated";
        return { ...x, ratingId: A, value: D };
      });
      return { reputation: o, choices: d, systemId: h, scope: (i == null ? void 0 : i.displayName) ?? a.title, canEdit: g, canManage: a.canEdit, rows: b };
    }
    async _saveFactionStanding(a, i, o, d) {
      var T;
      if (!((T = game.user) != null && T.isGM) || !De()) return !1;
      const s = d ? "reputation" : "prominence";
      if ((d || i !== "Unrated") && !_t(s).some((x) => x.id === i))
        return ne(`That ${s} rating is no longer available.`), !1;
      const h = n(this.mapId);
      if (!h) return !1;
      const g = Y(h).factions.find((x) => x.id === a);
      if (!g)
        return ne("That faction is no longer on this map."), !1;
      const b = d ? { reputation: i } : o ? { systemProminence: { ...g.systemProminence, [o]: i } } : { prominence: i };
      try {
        return !!await l(this.mapId, { id: a, ...b });
      } catch (x) {
        console.error("Galaxy Map failed to save faction standing", x), ne("Could not save the faction change.");
      }
      return !1;
    }
    _onRender(a, i) {
      var d, s, h;
      (d = this._orbitLayer) == null || d.dispose(), this._orbitLayer = null, (s = this._bountyIntelCallout) == null || s.dispose(), this._bountyIntelCallout = null, this._disposePlanetRenderer(), super._onRender(a, i);
      const o = this.element;
      if (o) {
        this._attachPartListeners("main", o, i), this._observeViewport(o);
        const g = o.querySelector(".gmf-map-viewport");
        if (g && a.hasOrbits && (this._orbitLayer = ns(g, a.orbitLayout)), this._applyViewportTransform(o), this._mountBountyIntelCallout(o), this.externalFocus && this._pendingFocusZoom !== null) {
          const b = Y(n(this.mapId)).systems.find((T) => T.id === this.externalFocus.systemId);
          b && this._centerOnSystem(b, o, this._pendingFocusZoom), this._pendingFocusZoom = null;
        }
        a.planetView ? this._mountPlanetRenderer(o, a.planetAppearance) : this._planetReturnFocus && ((h = o.querySelector("[data-action='inspect-system']")) == null || h.focus(), this._planetReturnFocus = !1);
      }
    }
    _attachPartListeners(a, i, o) {
      var b, T, x, A, D, ee, J, ae, le, f, p, I, S, M, E, z, j, H, Q, ue, fe, me, Ie, we;
      const d = (b = i.matches) != null && b.call(i, ".gmf-map-stage") ? i : (T = i.querySelector) == null ? void 0 : T.call(i, ".gmf-map-stage, .gmf-planet-stage");
      if ((d == null ? void 0 : d.dataset.gmfMapBound) === "true") return;
      d && (d.dataset.gmfMapBound = "true");
      const s = (x = d == null ? void 0 : d.matches) != null && x.call(d, ".gmf-map-stage") ? d : null;
      super._attachPartListeners(a, i, o), ct(this, i), this._attachPlanetListeners(i), this._attachCreationPanel(i);
      const h = i.querySelector(".gmf-object-appearance-panel");
      h && (_(h), this._attachAppearancePreview(i)), (A = i.querySelector("[data-action='toggle-territories']")) == null || A.addEventListener("click", () => {
        this.factionPanelOpen = !this.factionPanelOpen, this.factionRegistry = !1, this.selectedFactionId = "", this.activeSystemId ? this.showTerritories = this.factionPanelOpen : this.showGalaxyTerritories = this.factionPanelOpen, this.render({ force: !0 });
      }), i.querySelectorAll("[data-faction-panel-tab]").forEach((W) => {
        W.addEventListener("click", () => {
          this.factionPanelTab = W.dataset.factionPanelTab ?? "prominence", this.render({ force: !0 });
        });
      });
      const g = i.querySelectorAll("[data-faction-rating]");
      g.forEach((W) => {
        W.addEventListener("click", async () => {
          const ge = W.closest("[data-faction-standing]"), Te = W.dataset.factionRating;
          if (!ge || !Te || W.disabled) return;
          if (W.getAttribute("aria-pressed") === "true") {
            ge.open = !1;
            return;
          }
          const { factionStanding: Ee = "", prominenceSystemId: qe = "", reputation: ze } = ge.dataset;
          g.forEach((Fe) => {
            Fe.disabled = !0;
          });
          try {
            await this._saveFactionStanding(Ee, Te, qe, ze === "true") && (ge.open = !1);
          } finally {
            g.forEach((Fe) => {
              Fe.disabled = !1;
            });
          }
        });
      }), i.querySelectorAll("[data-inspect-faction]").forEach((W) => {
        W.addEventListener("click", () => {
          this._selectionTimer && clearTimeout(this._selectionTimer), this.selectedFactionId = W.dataset.inspectFaction ?? "", this.render({ force: !0 });
        });
      }), (D = i.querySelector("[data-action='clear-faction']")) == null || D.addEventListener("click", () => {
        this.selectedFactionId = "", this.render({ force: !0 });
      }), (ee = i.querySelector("[data-action='toggle-routes']")) == null || ee.addEventListener("click", () => {
        this.showRoutes = !this.showRoutes, this.render({ force: !0 });
      }), (J = i.querySelector("[data-action='toggle-orbits']")) == null || J.addEventListener("click", () => {
        this.showOrbits = !this.showOrbits, this.render({ force: !0 });
      }), (ae = i.querySelector("[data-action='edit-orbits']")) == null || ae.addEventListener("click", () => {
        var W;
        !this.playerMode && ((W = game.user) != null && W.isGM) && this.selectedObjectId && this._openEditPanel("entity", this.selectedObjectId, !0);
      }), (le = i.querySelector("[data-action='edit-current-layer']")) == null || le.addEventListener("click", () => {
        var W;
        !((W = game.user) != null && W.isGM) || this.playerMode || (this.activeSystemId ? this._openEditPanel("system", this.activeSystemId) : this._openCreationPanel("map", Y(n(this.mapId)), this.mapId));
      }), (f = i.querySelector("[data-action='toggle-hard-contrast']")) == null || f.addEventListener("click", (W) => {
        var Te;
        this.hardContrast = !this.hardContrast;
        const ge = (Te = i.matches) != null && Te.call(i, ".gmf-galaxy") ? i : i.querySelector(".gmf-galaxy");
        ge == null || ge.classList.toggle("is-hard-contrast", this.hardContrast), W.currentTarget.setAttribute("aria-pressed", String(this.hardContrast));
      }), i.querySelectorAll(".gmf-system[data-system-id]").forEach((W) => {
        var ge, Te;
        W.addEventListener("click", (Ee) => {
          if (W.dataset.dragged === "true") {
            W.dataset.dragged = "false";
            return;
          }
          Ee.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = globalThis.setTimeout(() => {
            this.selectedFactionId = "", this.activeSystemId ? this.selectedObjectId = W.dataset.systemId : this.selectedSystemId = W.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
          }, 180);
        }), W.addEventListener("dblclick", (Ee) => {
          var ze;
          Ee.preventDefault(), Ee.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
          const qe = W.dataset.systemId;
          if (this.selectedFactionId = "", this.selectedRouteId = null, this.creationPanel = null, this.activeSystemId) {
            this.selectedObjectId = qe;
            const Fe = (ze = Y(n(this.mapId)).systems.find((We) => We.id === this.activeSystemId)) == null ? void 0 : ze.objects.find((We) => We.id === qe);
            Re(Fe) && (this.planetSystemId = qe);
          } else
            this.selectedSystemId = qe, this.activeSystemId = qe, this.selectedObjectId = null;
          this.render({ force: !0 });
        }), !this.playerMode && ((ge = game.user) != null && ge.isGM) && ((Te = W.querySelector("[data-resize-marker]")) == null || Te.addEventListener("pointerdown", (Ee) => this._startMarkerResize(Ee, W)), W.addEventListener("pointerdown", (Ee) => this._startSystemDrag(Ee, i, W)));
      }), this._mountBountyIntelCallout(i), i.querySelectorAll("[data-route-id]").forEach((W) => {
        W.addEventListener("click", (ge) => {
          var Te;
          if (ge.stopPropagation(), this.selectedFactionId = "", this.selectedRouteId = W.dataset.routeId, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, !this.playerMode && ((Te = game.user) != null && Te.isGM)) {
            this._openEditPanel("route", W.dataset.routeId);
            return;
          }
          this.render({ force: !0 });
        });
      }), s == null || s.addEventListener("wheel", (W) => this._onWheelZoom(W, i), { passive: !1 }), s == null || s.addEventListener("pointerdown", (W) => this._startPan(W, i)), s == null || s.addEventListener("contextmenu", (W) => this._openContextMenu(W, i), { capture: !0 }), i.querySelectorAll("[data-context-action]").forEach((W) => {
        W.addEventListener("click", (ge) => this._handleContextAction(ge, i));
      }), (p = i.querySelector("[data-action='open-journal']")) == null || p.addEventListener("click", () => this._openLinkedJournal()), (I = i.querySelector("[data-action='edit-system']")) == null || I.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._openEditPanel("entity", this.selectedObjectId) : this.selectedSystemId && this._openEditPanel("system", this.selectedSystemId);
      }), (S = i.querySelector("[data-action='open-system']")) == null || S.addEventListener("click", () => {
        this.selectedSystemId && (this.activeSystemId = this.selectedSystemId, this.selectedObjectId = null, this.selectedRouteId = null, this.render({ force: !0 }));
      }), (M = i.querySelector("[data-action='navigate-up']")) == null || M.addEventListener("click", () => {
        if (this.creationPanel = null, this.planetSystemId)
          this._disposePlanetRenderer(), this.planetSystemId = null, this._planetReturnFocus = !0;
        else if (this.activeSystemId)
          this.activeSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null;
        else return;
        this.render({ force: !0 });
      }), (E = i.querySelector("[data-action='reveal-system']")) == null || E.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? C(this.mapId, this.activeSystemId, this.selectedObjectId, "players") : this.selectedSystemId && k(this.mapId, this.selectedSystemId);
      }), (z = i.querySelector("[data-action='hide-system']")) == null || z.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? C(this.mapId, this.activeSystemId, this.selectedObjectId, "gm") : this.selectedSystemId && O(this.mapId, this.selectedSystemId, !0);
      }), (j = i.querySelector("[data-action='delete-system']")) == null || j.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._confirmDeleteObject(this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), (H = i.querySelector("[data-action='set-current-system']")) == null || H.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? L(this.mapId, this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && se(this.mapId, this.selectedSystemId);
      }), (Q = i.querySelector("[data-action='travel-to-system']")) == null || Q.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? U(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, i));
      }), (ue = i.querySelector("[data-action='travel-to-object']")) == null || ue.addEventListener("click", () => {
        !this.activeSystemId || !this.selectedObjectId || (this.playerMode ? Z(this.mapId, this.activeSystemId, this.selectedObjectId) : this._travelToObject(this.activeSystemId, this.selectedObjectId, i));
      }), (fe = i.querySelector("[data-action='edit-route']")) == null || fe.addEventListener("click", () => {
        this.selectedRouteId && this._openEditPanel("route", this.selectedRouteId);
      }), (me = i.querySelector("[data-action='reveal-route']")) == null || me.addEventListener("click", () => {
        this.selectedRouteId && F(this.mapId, this.selectedRouteId, this.activeSystemId ?? "");
      }), (Ie = i.querySelector("[data-action='hide-route']")) == null || Ie.addEventListener("click", () => {
        this.selectedRouteId && N(this.mapId, this.selectedRouteId, !0, this.activeSystemId ?? "");
      }), (we = i.querySelector("[data-action='delete-route']")) == null || we.addEventListener("click", () => {
        this.selectedRouteId && this._confirmDeleteRoute(this.selectedRouteId);
      });
    }
    _applyViewportTransform(a) {
      var d, s, h;
      const i = a.querySelector(".gmf-map-stage");
      if (!i || i !== this._viewportStage || !i.isConnected || !((d = this.element) != null && d.contains(i))) return;
      const o = a.querySelector(".gmf-map-viewport");
      if (o) {
        if (i) {
          const g = i.getBoundingClientRect(), b = o.querySelector(".gmf-map-background");
          b && (this.zoom = Math.max(1, this.zoom));
          const T = b != null && b.naturalWidth && (b != null && b.naturalHeight) ? b.naturalWidth / b.naturalHeight : null;
          T ? this._adjustWindowToBackground(i, T) : b || this._adjustWindowToBackground(i, null);
          const x = g.width / Math.max(1, g.height);
          T && T > x ? (this._worldWidth = g.width, this._worldHeight = g.width / T) : T ? (this._worldHeight = g.height, this._worldWidth = g.height * T) : (this._worldWidth = g.width, this._worldHeight = g.height), o.style.width = `${this._worldWidth}px`, o.style.height = `${this._worldHeight}px`, (s = this._orbitLayer) == null || s.setAspect(this._worldWidth / this._worldHeight);
          const A = this._worldWidth * this.zoom, D = this._worldHeight * this.zoom;
          this.panX = A <= g.width ? (g.width - A) / 2 : pe(this.panX, g.width - A, 0), this.panY = D <= g.height ? (g.height - D) / 2 : pe(this.panY, g.height - D, 0), b && b.dataset.gmfWorldImageBound !== "true" && (b.dataset.gmfWorldImageBound = "true", b.addEventListener("load", () => this._applyViewportTransform(a), { once: !0 }));
        }
        o.style.setProperty("--gmf-pan-x", `${this.panX}px`), o.style.setProperty("--gmf-pan-y", `${this.panY}px`), o.style.setProperty("--gmf-zoom", String(this.zoom)), (h = a.querySelector("[data-zoom-label]")) == null || h.replaceChildren(`${Math.round(this.zoom * 100)}%`);
      }
    }
    _adjustWindowToBackground(a, i) {
      const o = a.closest(".window-app, .application, .app");
      if (!o || !this.setPosition) return;
      const d = o.getBoundingClientRect();
      if (!i) {
        this._baseWindowHeight && Math.abs(d.height - this._baseWindowHeight) > 2 && this.setPosition({ height: Math.min(this._baseWindowHeight, window.innerHeight - 24) }), this._baseWindowHeight = null;
        return;
      }
      this._baseWindowHeight ?? (this._baseWindowHeight = d.height);
      const s = a.getBoundingClientRect(), h = pe(s.width / i, 240, window.innerHeight - 96);
      if (Math.abs(s.height - h) <= 2) return;
      const g = pe(d.height + h - s.height, 320, window.innerHeight - 24);
      this.setPosition({ height: Math.round(g) });
    }
    _observeViewport(a) {
      var o;
      (o = this._viewportResizeObserver) == null || o.disconnect();
      const i = a.querySelector(".gmf-map-stage");
      this._viewportStage = i, i && (this._viewportResizeObserver = new ResizeObserver(() => this._applyViewportTransform(a)), this._viewportResizeObserver.observe(i));
    }
    _setZoom(a, i) {
      const o = i.querySelector(".gmf-map-background") ? 1 : pt;
      this.zoom = pe(a, o, ht), this._applyViewportTransform(i);
    }
    _mountBountyIntelCallout(a) {
      var d;
      if (this._bountyIntelCallout || a.querySelector(".gmf-intel-callout")) return;
      const i = (d = a.matches) != null && d.call(a, ".gmf-map-stage") ? a : a.querySelector(".gmf-map-stage"), o = a;
      !i || !o.querySelector("[data-intel-layer]") || (this._bountyIntelCallout = es({
        root: o,
        stage: i,
        resolveItems: (s) => {
          var b;
          const h = Y(n(this.mapId)), g = this.activeSystemId ? (b = h.systems.find((T) => T.id === this.activeSystemId)) == null ? void 0 : b.objects.find((T) => T.id === s) : h.systems.find((T) => T.id === s);
          return g ? Yn(g) : [];
        },
        onOpen: (s) => Xn(s)
      }));
    }
    _attachPlanetListeners(a) {
      var i, o, d, s, h, g;
      (i = a.querySelector("[data-action='inspect-system']")) == null || i.addEventListener("click", () => {
        var T, x;
        const b = n(this.mapId);
        if (!(this.playerMode && (b == null ? void 0 : b.visibility) !== "players")) {
          if (this.activeSystemId) {
            const D = (T = Y(b).systems.find((ee) => ee.id === this.activeSystemId)) == null ? void 0 : T.objects.find((ee) => ee.id === this.selectedObjectId);
            if (!Re(D)) return;
            this.planetSystemId = this.selectedObjectId;
          } else {
            this.activeSystemId = this.selectedSystemId;
            const A = Y(b);
            this.selectedObjectId = ((x = A.systems.find((D) => D.id === this.activeSystemId)) == null ? void 0 : x.primaryObjectId) ?? null, this.planetSystemId = this.selectedObjectId;
          }
          this.render({ force: !0 });
        }
      }), (o = a.querySelector("[data-action='planet-pause']")) == null || o.addEventListener("click", () => {
        var b;
        return (b = this._planetRenderer) == null ? void 0 : b.setPaused(!this._planetRenderer.paused);
      }), (d = a.querySelector("[data-action='planet-zoom-in']")) == null || d.addEventListener("click", () => {
        var b;
        return (b = this._planetRenderer) == null ? void 0 : b.zoom(-0.25);
      }), (s = a.querySelector("[data-action='planet-zoom-out']")) == null || s.addEventListener("click", () => {
        var b;
        return (b = this._planetRenderer) == null ? void 0 : b.zoom(0.25);
      }), (h = a.querySelector("[data-action='planet-reset']")) == null || h.addEventListener("click", () => {
        var b;
        return (b = this._planetRenderer) == null ? void 0 : b.reset();
      }), (g = a.querySelector("[data-action='planet-static']")) == null || g.addEventListener("click", () => {
        this.planetStatic = !this.planetStatic, this.render({ force: !0 });
      }), this._attachPlanetLocationList(a), this._attachLinkedContentDrop(a);
    }
    _getPlanetObject() {
      var i;
      return ((i = Y(n(this.mapId)).systems.find((o) => o.id === this.activeSystemId)) == null ? void 0 : i.objects.find((o) => o.id === this.planetSystemId)) ?? null;
    }
    _preparePlanetLocations(a, i) {
      return ((a == null ? void 0 : a.planetLocations) ?? []).filter((o) => o.shape === i).map((o) => {
        var h, g, b, T, x, A;
        const d = (g = (h = game.scenes) == null ? void 0 : h.get) == null ? void 0 : g.call(h, o.sceneId), s = !!(d && ((b = game.user) != null && b.isGM || (T = d.testUserPermission) != null && T.call(d, game.user, "OBSERVER")));
        return {
          ...o,
          name: d ? s || (x = game.user) != null && x.isGM ? d.name || "Linked Scene" : "Restricted location" : "Missing linked scene",
          accessible: s,
          missing: !d,
          canRemove: !!((A = game.user) != null && A.isGM && !this.playerMode)
        };
      });
    }
    _getPlanetLocationItem(a) {
      var o;
      const i = this._getPlanetObject();
      return this._preparePlanetLocations(i, (o = Re(i)) == null ? void 0 : o.shape).find((d) => d.id === a) ?? null;
    }
    _attachPlanetLocationList(a) {
      var d;
      const i = this.element ?? a;
      a.querySelectorAll("[data-planet-scene-drag]").forEach((s) => s.addEventListener("dragstart", (h) => {
        h.dataTransfer && (h.dataTransfer.setData("text/plain", JSON.stringify({ type: "Scene", id: s.dataset.planetSceneDrag, uuid: s.dataset.planetSceneUuid })), h.dataTransfer.effectAllowed = "link");
      })), a.querySelectorAll("[data-unlink-planet-scene]").forEach((s) => s.addEventListener("click", async (h) => {
        var x, A, D;
        h.preventDefault(), h.stopPropagation();
        const g = s.dataset.unlinkPlanetScene ?? "", b = this.planetSystemId || this.selectedObjectId;
        if (!g || !this.activeSystemId || !b) return;
        const T = ((D = (A = (x = game.scenes) == null ? void 0 : x.get) == null ? void 0 : A.call(x, g)) == null ? void 0 : D.name) || "Scene";
        await $(this.mapId, this.activeSystemId, b, g) && ie(`${T} unlinked from this location.`);
      })), a.querySelectorAll("[data-open-linked-scene]").forEach((s) => s.addEventListener("click", () => {
        var g, b, T;
        const h = (b = (g = game.scenes) == null ? void 0 : g.get) == null ? void 0 : b.call(g, s.dataset.openLinkedScene ?? "");
        h != null && h.view ? h.view() : (T = h == null ? void 0 : h.sheet) == null || T.render(!0);
      })), a.querySelectorAll("[data-open-planet-location]").forEach((s) => s.addEventListener("click", () => this._openPlanetLocation(s.dataset.openPlanetLocation ?? ""))), a.querySelectorAll("[data-remove-planet-location]").forEach((s) => s.addEventListener("click", () => this._removePlanetLocation(s.dataset.removePlanetLocation ?? "", a))), a.querySelectorAll("[data-planet-location-drag]").forEach((s) => {
        s.addEventListener("dragstart", (h) => {
          var b;
          if (!h.dataTransfer) return;
          const g = s.dataset.planetLocationDrag ?? "";
          h.dataTransfer.setData("application/x-gmf-surface-location", g), h.dataTransfer.setData("text/plain", JSON.stringify({ type: "GalaxySurfaceLocation", locationId: g })), h.dataTransfer.effectAllowed = "move", (b = i.querySelector("[data-planet-location-trash]")) == null || b.classList.add("is-armed");
        }), s.addEventListener("dragend", () => {
          var h;
          return (h = i.querySelector("[data-planet-location-trash]")) == null ? void 0 : h.classList.remove("is-armed", "is-dragover");
        });
      });
      const o = i.querySelector("[data-planet-location-trash]");
      (o == null ? void 0 : o.dataset.gmfTrashBound) !== "true" && (o && (o.dataset.gmfTrashBound = "true"), o == null || o.addEventListener("dragover", (s) => {
        var h;
        (h = s.dataTransfer) != null && h.types.includes("application/x-gmf-surface-location") && (s.preventDefault(), s.dataTransfer.dropEffect = "move", o.classList.add("is-dragover"));
      }), o == null || o.addEventListener("dragleave", () => o.classList.remove("is-dragover")), o == null || o.addEventListener("drop", (s) => {
        var g;
        s.preventDefault();
        const h = ((g = s.dataTransfer) == null ? void 0 : g.getData("application/x-gmf-surface-location")) ?? "";
        o.classList.remove("is-armed", "is-dragover"), h && this._removePlanetLocation(h, a);
      })), (d = a.querySelector("[data-clear-planet-locations]")) == null || d.addEventListener("click", () => this._clearPlanetLocations(a));
    }
    _attachLinkedContentDrop(a) {
      var o, d;
      const i = a.querySelector("[data-linked-content-drop]");
      !i || !((o = game.user) != null && o.isGM) || this.playerMode || (i.addEventListener("dragover", (s) => {
        s.preventDefault(), s.dataTransfer && (s.dataTransfer.dropEffect = "link"), i.classList.add("is-document-dragover");
      }), i.addEventListener("dragleave", (s) => {
        i.contains(s.relatedTarget) || i.classList.remove("is-document-dragover");
      }), i.addEventListener("drop", async (s) => {
        var T;
        s.preventDefault(), s.stopPropagation(), i.classList.remove("is-document-dragover");
        const h = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !h) return;
        const g = await Ni(s), b = (T = Y(n(this.mapId)).systems.find((x) => x.id === this.activeSystemId)) == null ? void 0 : T.objects.find((x) => x.id === h);
        if (!g || !b) {
          ne("Drop a Foundry Scene or Journal here.");
          return;
        }
        if (g.documentName === "Scene") {
          const x = [.../* @__PURE__ */ new Set([...b.sceneIds ?? [], g.id])];
          await c(this.mapId, this.activeSystemId, { ...b, sceneIds: x }), ie(`${g.name || "Scene"} linked to ${b.name}.`);
        } else if (g.documentName === "JournalEntry")
          await c(this.mapId, this.activeSystemId, { ...b, journalId: g.id }), ie(`${g.name || "Journal"} linked to ${b.name}.`);
        else {
          ne("Drop a Foundry Scene or Journal here.");
          return;
        }
      }), (d = a.querySelector("[data-unlink-linked-journal]")) == null || d.addEventListener("click", async (s) => {
        var b;
        s.preventDefault(), s.stopPropagation();
        const h = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !h) return;
        const g = (b = Y(n(this.mapId)).systems.find((T) => T.id === this.activeSystemId)) == null ? void 0 : b.objects.find((T) => T.id === h);
        g && await c(this.mapId, this.activeSystemId, { ...g, journalId: "" });
      }));
    }
    _openPlanetLocation(a) {
      var d, s, h;
      const i = this._getPlanetLocationItem(a), o = i ? (s = (d = game.scenes) == null ? void 0 : d.get) == null ? void 0 : s.call(d, i.sceneId) : null;
      if (!i || !o || !i.accessible) {
        ne(i != null && i.missing ? "That location is unavailable." : "You do not have permission to view that scene.");
        return;
      }
      o.view ? o.view() : (h = o.sheet) == null || h.render(!0);
    }
    async _removePlanetLocation(a, i) {
      var d;
      if (!((d = game.user) != null && d.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const o = this._getPlanetLocationItem(a);
      !o || !await Pe(this.mapId, this.activeSystemId, this.planetSystemId, a) || (this._syncPlanetLocations(i), ie(`${o.name} removed from the surface.`));
    }
    async _clearPlanetLocations(a) {
      var d, s;
      if (!((d = game.user) != null && d.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const i = this._getPlanetObject(), o = this._preparePlanetLocations(i, (s = Re(i)) == null ? void 0 : s.shape);
      for (const h of o) await Pe(this.mapId, this.activeSystemId, this.planetSystemId, h.id);
      this._syncPlanetLocations(a), o.length && ie(`Cleared ${o.length} surface location${o.length === 1 ? "" : "s"}.`);
    }
    async _placePlanetLocation(a, i, o) {
      var g;
      if (!((g = game.user) != null && g.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const d = await rs(a);
      if (!d) {
        ne("Drop a Foundry Scene onto the 3D surface.");
        return;
      }
      const s = this._getPlanetObject();
      if (!(s != null && s.sceneIds.includes(d.id))) {
        ne(`Link ${d.name || "this scene"} to the object before placing it on the surface.`);
        return;
      }
      await be(this.mapId, this.activeSystemId, this.planetSystemId, { ...i, sceneId: d.id }) && (this._syncPlanetLocations(o), ie(`${d.name || "Scene"} placed on the ${i.shape}. Drag it again to move it.`));
    }
    _syncPlanetLocations(a) {
      var h, g, b;
      const i = this.element ?? a, o = this._getPlanetObject(), d = this._preparePlanetLocations(o, (h = Re(o)) == null ? void 0 : h.shape);
      (g = this._planetRenderer) == null || g.setLocations((o == null ? void 0 : o.planetLocations) ?? []);
      const s = i.querySelector("[data-planet-location-list]");
      s && (s.innerHTML = d.length ? d.map((T) => `
        <div class="gmf-planet-location-row ${T.accessible ? "" : "is-restricted"}" ${T.canRemove ? `draggable="true" data-planet-location-drag="${Le(T.id)}" title="Drag to the trash bin to remove"` : ""}>
          <button type="button" data-open-planet-location="${Le(T.id)}" ${T.accessible ? "" : "disabled"}><i class="fa-solid ${T.accessible ? "fa-location-dot" : "fa-lock"}"></i><span>${Le(T.name)}</span></button>
          ${T.canRemove ? `<button type="button" data-remove-planet-location="${Le(T.id)}" title="Remove location" aria-label="Remove ${Le(T.name)}"><i class="fa-solid fa-trash"></i></button>` : ""}
        </div>`).join("") : '<p class="gmf-planet-locations__empty">No surface locations placed.</p>', this._attachPlanetLocationList(s), (b = i.querySelector("[data-planet-location-removal]")) == null || b.toggleAttribute("hidden", d.length === 0));
    }
    refreshPlanetLocations(a, i) {
      this.activeSystemId !== a || this.planetSystemId !== i || this.element && this._syncPlanetLocations(this.element);
    }
    async focusSystem(a, i = {}) {
      var A;
      const o = Y(n(this.mapId));
      if (!o.systems.find((D) => D.id === a)) return !1;
      const s = r(o, {
        playerMode: this.playerMode,
        selectedSystemId: a,
        selectedRouteId: null
      });
      if (!((A = s == null ? void 0 : s.systems) != null && A.some((D) => D.id === a))) return !1;
      const h = String(i.focusId || a).slice(0, 80), g = ["distress", "warning", "objective", "custom"].includes(i.kind) ? i.kind : "custom", b = /^#[0-9a-f]{6}$/i.test(i.color ?? "") ? i.color : g === "distress" ? "#ff5c7a" : "#58d8ff", T = pe(Number(i.duration) || 0, 0, 6e5), x = pe(Number(i.zoom) || 1.45, pt, ht);
      return this.externalFocus = {
        id: h,
        systemId: a,
        kind: g,
        color: b,
        label: String(i.label || (g === "distress" ? "Distress signal" : "Signal located")).slice(0, 120)
      }, this.selectedFactionId = "", this.selectedSystemId = a, this.planetSystemId = null, this.selectedRouteId = null, this._pendingFocusZoom = x, this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, await this.render({ force: !0 }), this.bringToFront(), T > 0 && (this._externalFocusTimeout = globalThis.setTimeout(() => {
        var D;
        ((D = this.externalFocus) == null ? void 0 : D.id) === h && this.clearSystemFocus(h);
      }, T)), !0;
    }
    async focusLocation(a, i = "", o = {}) {
      const s = Y(n(this.mapId)).systems.find((g) => g.id === a), h = (s == null ? void 0 : s.objects.find((g) => g.id === i)) ?? (s == null ? void 0 : s.objects.find((g) => g.id === s.primaryObjectId));
      return !s || !h || this.playerMode && (s.visibility !== "players" || Ve(s, h) !== "players") ? !1 : (this.selectedFactionId = "", this.activeSystemId = s.id, this.selectedSystemId = s.id, this.selectedObjectId = h.id, this.selectedRouteId = null, this.planetSystemId = o.detail === !0 && Re(h) ? h.id : null, await this.render({ force: !0 }), this.bringToFront(), !0);
    }
    clearSystemFocus(a = "") {
      return !this.externalFocus || a && this.externalFocus.id !== a ? !1 : (this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, this._pendingFocusZoom = null, this.externalFocus = null, this.rendered && this.render({ force: !0 }), !0);
    }
    _centerOnSystem(a, i, o) {
      const d = i.querySelector(".gmf-map-stage");
      if (!d) return;
      const s = d.getBoundingClientRect();
      this.zoom = o, this.panX = s.width / 2 - Number(a.x) / 100 * this._worldWidth * o, this.panY = s.height / 2 - Number(a.y) / 100 * this._worldHeight * o, this._applyViewportTransform(i);
    }
    _onWheelZoom(a, i) {
      a.preventDefault();
      const o = i.querySelector(".gmf-map-stage");
      if (!o) return;
      const d = o.getBoundingClientRect(), s = this.zoom, h = i.querySelector(".gmf-map-background") ? 1 : pt, g = pe(s * Math.exp(-a.deltaY * 15e-4), h, ht), b = a.clientX - d.left, T = a.clientY - d.top, x = (b - this.panX) / s, A = (T - this.panY) / s;
      this.zoom = g, this.panX = b - x * g, this.panY = T - A * g, this._applyViewportTransform(i);
    }
    _startPan(a, i) {
      if (a.button !== 0 || a.target.closest("[data-system-id], [data-route-id], button, input")) return;
      a.preventDefault();
      const o = a.clientX, d = a.clientY, s = this.panX, h = this.panY;
      let g = !1;
      const b = (x) => {
        g = g || Math.abs(x.clientX - o) > 3 || Math.abs(x.clientY - d) > 3, this.panX = s + x.clientX - o, this.panY = h + x.clientY - d, this._applyViewportTransform(i);
      }, T = () => {
        window.removeEventListener("pointermove", b), window.removeEventListener("pointerup", T), g || (this.selectedFactionId = "", this.selectedRouteId = null, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, this.render({ force: !0 }));
      };
      window.addEventListener("pointermove", b), window.addEventListener("pointerup", T, { once: !0 });
    }
    _startSystemDrag(a, i, o) {
      var f;
      if (a.button !== 0) return;
      a.preventDefault(), a.stopPropagation(), (f = o.setPointerCapture) == null || f.call(o, a.pointerId);
      const d = a.clientX, s = a.clientY, h = this._orbitLayer, g = o.dataset.systemId, b = this.activeSystemId;
      let T = this._pointerToMapPercent(a, i), x = !1, A = null;
      const D = Array.from(i.querySelectorAll(`[data-route-from="${o.dataset.systemId}"]`)), ee = Array.from(i.querySelectorAll(`[data-route-to="${o.dataset.systemId}"]`)), J = () => {
        h ? h.previewDrag(g, T) : (o.style.left = `${T.x}%`, o.style.top = `${T.y}%`, this._updateConnectedRoutes(D, ee, T.x, T.y));
      }, ae = (p) => {
        const I = Math.abs(p.clientX - d), S = Math.abs(p.clientY - s);
        !x && I <= 4 && S <= 4 || (x = !0, o.classList.add("is-dragging"), T = this._pointerToMapPercent(p, i), o.dataset.dragged = "true", !A && (A = requestAnimationFrame(() => {
          A = null, J();
        })));
      }, le = async (p) => {
        if (A && cancelAnimationFrame(A), o.classList.remove("is-dragging"), window.removeEventListener("pointermove", ae), window.removeEventListener("pointerup", le), window.removeEventListener("pointercancel", le), (p == null ? void 0 : p.type) === "pointercancel") {
          o.dataset.dragged = "false", h ? h.cancelDrag() : x && this.render({ force: !0 });
          return;
        }
        if (!(o.isConnected === !1 || b !== this.activeSystemId) && x) {
          J();
          const I = h == null ? void 0 : h.finishDrag(g, T);
          if (b)
            try {
              await ve(this.mapId, b, g, T.x, T.y, I) || this.render({ force: !0 });
            } catch {
              h == null || h.cancelDrag(), ne("Could not save the location position."), this.render({ force: !0 });
            }
          else await Se(this.mapId, o.dataset.systemId, T.x, T.y);
        }
      };
      window.addEventListener("pointermove", ae), window.addEventListener("pointerup", le, { once: !0 }), window.addEventListener("pointercancel", le, { once: !0 });
    }
    _startMarkerResize(a, i) {
      var A;
      if (a.button !== 0) return;
      a.preventDefault(), a.stopPropagation(), this._selectionTimer && clearTimeout(this._selectionTimer), this._selectionTimer = null;
      const o = pe(Number(i.dataset.iconSize) || 28, 18, 56), d = i.getBoundingClientRect(), s = d.left + d.width / 2, h = d.top + d.height / 2, g = Math.hypot(a.clientX - s, a.clientY - h);
      let b = o;
      i.dataset.dragged = "true", i.classList.add("is-resizing"), (A = i.setPointerCapture) == null || A.call(i, a.pointerId);
      const T = (D) => {
        const ee = Math.hypot(D.clientX - s, D.clientY - h);
        b = pe(Math.round(o + (ee - g) / Math.max(this.zoom, 0.01)), 18, 56), i.dataset.iconSize = String(b), i.style.setProperty("--gmf-system-size", `${b}px`);
      }, x = async () => {
        if (i.classList.remove("is-resizing"), window.removeEventListener("pointermove", T), window.removeEventListener("pointerup", x), window.removeEventListener("pointercancel", x), globalThis.setTimeout(() => {
          i.dataset.dragged = "false";
        }, 0), b !== o)
          if (this.activeSystemId) {
            const D = Y(n(this.mapId)).systems.find((J) => J.id === this.activeSystemId), ee = D == null ? void 0 : D.objects.find((J) => J.id === i.dataset.systemId);
            ee && await c(this.mapId, this.activeSystemId, { ...ee, iconSize: b });
          } else
            await u(this.mapId, { id: i.dataset.systemId, iconSize: b });
      };
      window.addEventListener("pointermove", T), window.addEventListener("pointerup", x, { once: !0 }), window.addEventListener("pointercancel", x, { once: !0 });
    }
    _pointerToMapPercent(a, i) {
      const d = i.querySelector(".gmf-map-stage").getBoundingClientRect();
      return {
        x: pe((a.clientX - d.left - this.panX) / this.zoom / this._worldWidth * 100, 0, 100),
        y: pe((a.clientY - d.top - this.panY) / this.zoom / this._worldHeight * 100, 0, 100)
      };
    }
    _updateConnectedRoutes(a, i, o, d) {
      a.forEach((s) => {
        s.setAttribute("x1", o), s.setAttribute("y1", d);
      }), i.forEach((s) => {
        s.setAttribute("x2", o), s.setAttribute("y2", d);
      });
    }
    _openContextMenu(a, i) {
      var ae;
      if (!((ae = game.user) != null && ae.isGM) || this.playerMode || a.target.closest(".gmf-context-menu")) return;
      a.preventDefault(), a.stopPropagation();
      const o = a.target.closest("[data-route-id]"), d = a.target.closest("[data-system-id]"), s = this._pointerToMapPercent(a, i);
      this._contextTarget = o ? { type: "route", id: o.dataset.routeId, position: s } : d ? { type: "system", id: d.dataset.systemId, position: s } : { type: "stage", id: null, position: s };
      const h = i.querySelector("[data-gmf-context-menu]");
      if (!h) return;
      h.querySelectorAll("[data-context-show]").forEach((le) => {
        le.hidden = le.dataset.contextShow !== this._contextTarget.type;
      }), h.hidden = !1;
      const g = h.offsetWidth || 184, b = h.offsetHeight || 260, x = i.querySelector(".gmf-map-stage").getBoundingClientRect(), A = a.clientX - x.left, D = a.clientY - x.top, ee = Math.max(4, x.width - g - 4), J = Math.max(4, x.height - b - 4);
      h.style.left = `${pe(A, 4, ee)}px`, h.style.top = `${pe(D, 4, J)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(i), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu(a = null) {
      const i = a ?? this.element ?? null, o = i == null ? void 0 : i.querySelector("[data-gmf-context-menu]");
      o && (o.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(a, i) {
      a.preventDefault(), a.stopPropagation();
      const o = a.currentTarget.dataset.contextAction, d = this._contextTarget;
      this._hideContextMenu(i), d && (o === "add-system" ? this._openCreationPanel("system", { x: d.position.x, y: d.position.y }) : o === "add-entity" ? this.activeSystemId && this._openCreationPanel("entity", { x: d.position.x, y: d.position.y }) : o === "manage-factions" ? (this.creationPanel = null, this.factionRegistry = !0, this.render({ force: !0 })) : o === "add-faction" ? this._openCreationPanel("faction") : o === "edit-map-details" ? this._openCreationPanel("map", Y(n(this.mapId)), this.mapId) : o === "export-map" ? R(this.mapId) : o === "edit-system" ? this._openEditPanel("system", d.id) : o === "edit-entity" ? this.activeSystemId && this._openEditPanel("entity", d.id) : o === "add-route-from-marker" ? this._openCreationPanel("route", { fromSystemId: d.id }) : o === "reveal-system" ? await k(this.mapId, d.id) : o === "hide-system" ? await O(this.mapId, d.id, !0) : o === "delete-system" ? await this._confirmDeleteSystem(d.id) : o === "reveal-entity" ? this.activeSystemId && await C(this.mapId, this.activeSystemId, d.id, "players") : o === "hide-entity" ? this.activeSystemId && await C(this.mapId, this.activeSystemId, d.id, "gm") : o === "delete-entity" ? this.activeSystemId && await this._confirmDeleteObject(this.activeSystemId, d.id) : o === "edit-route" ? this._openEditPanel("route", d.id) : o === "reveal-route" ? await F(this.mapId, d.id, this.activeSystemId ?? "") : o === "hide-route" ? await N(this.mapId, d.id, !0, this.activeSystemId ?? "") : o === "delete-route" && await this._confirmDeleteRoute(d.id));
    }
    async _confirmDeleteSystem(a) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, Ue) && await V(this.mapId, a);
    }
    async _confirmDeleteObject(a, i) {
      await Dialog.confirm({ title: "Delete Location", content: "<p>Delete this location and its linked content?</p>" }) && (await K(this.mapId, a, i), this.selectedObjectId = null);
    }
    _openCreationPanel(a, i = {}, o = null) {
      var b, T, x, A;
      if (!((b = game.user) != null && b.isGM) || this.playerMode) return;
      const d = Y(n(this.mapId)), s = this.activeSystemId ? ((T = d.systems.find((D) => D.id === this.activeSystemId)) == null ? void 0 : T.objects) ?? [] : d.systems;
      if (a === "route" && s.length < 2) {
        ne(this.activeSystemId ? "Create at least two locations before adding a route." : "Create at least two systems before adding a route.");
        return;
      }
      const h = i.fromSystemId || ((x = s[0]) == null ? void 0 : x.id) || "", g = a === "map" ? { title: "Galaxy Map", subtitle: "", description: "", backgroundImage: "", visibility: "players", travelApprovalMode: "unanimous" } : a === "system" ? { name: "New System", status: "known", visibility: "gm", description: "", markerImage: "", backgroundImage: "" } : a === "entity" ? {
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
          ...i,
          x: Number.isFinite(Number(i.x)) ? Number(i.x) : 50,
          y: Number.isFinite(Number(i.y)) ? Number(i.y) : 50,
          fromSystemId: h,
          toSystemId: i.toSystemId || ((A = s.find((D) => D.id !== h)) == null ? void 0 : A.id) || ""
        }
      }, this.factionRegistry = !1, a === "faction" && this.selectedFactionId === o) {
        this.render({ force: !0 });
        return;
      }
      this.selectedFactionId = "", this.selectedSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null, this.render({ force: !0 });
    }
    _openEditPanel(a, i, o = !1) {
      var h, g;
      const d = Y(n(this.mapId)), s = a === "system" ? d.systems.find((b) => b.id === i) : a === "entity" ? (h = d.systems.find((b) => b.id === this.activeSystemId)) == null ? void 0 : h.objects.find((b) => b.id === i) : a === "route" ? this.activeSystemId ? (g = d.systems.find((b) => b.id === this.activeSystemId)) == null ? void 0 : g.routes.find((b) => b.id === i) : d.routes.find((b) => b.id === i) : d.factions.find((b) => b.id === i);
      s && this._openCreationPanel(a, o ? { ...s, showOrbitEditor: o } : s, i);
    }
    openEditor(a, i = {}) {
      var o;
      return !((o = game.user) != null && o.isGM) || this.playerMode || a === "faction" && !De() ? !1 : (this._disposePlanetRenderer(), this.planetSystemId = null, a === "entity" ? (this.activeSystemId = i.systemId || this.activeSystemId, this.selectedSystemId = this.activeSystemId) : a === "route" ? this.activeSystemId = i.systemId || null : ["map", "system", "faction"].includes(a) && (this.activeSystemId = null), a === "map" ? this._openCreationPanel("map", Y(n(this.mapId)), this.mapId) : i.id ? this._openEditPanel(a, i.id) : this._openCreationPanel(a, i.defaults || {}), !0);
    }
    _attachCreationPanel(a) {
      var h, g, b, T;
      (h = a.querySelector("[data-action='cancel-panel-create']")) == null || h.addEventListener("click", () => {
        this.creationPanel = null, this.render({ force: !0 });
      }), (g = a.querySelector("[data-action='close-faction-registry']")) == null || g.addEventListener("click", () => {
        this.factionRegistry = !1, this.render({ force: !0 });
      }), (b = a.querySelector("[data-action='add-inline-faction']")) == null || b.addEventListener("click", () => this._openCreationPanel("faction")), a.querySelectorAll("[data-edit-inline-faction]").forEach((x) => {
        x.addEventListener("click", () => this._openEditPanel("faction", x.dataset.editInlineFaction || ""));
      }), a.querySelectorAll("[data-delete-inline-faction]").forEach((x) => {
        x.addEventListener("click", async () => {
          await Dialog.confirm({ title: "Delete Faction", content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>" }, Ue) && (await v(this.mapId, x.dataset.deleteInlineFaction), this.factionRegistry = !0, this.render({ force: !0 }));
        });
      });
      const i = a.querySelector("[data-panel-create-form]");
      if (!i) return;
      const o = i.querySelector('select[name="kind"]'), d = i.querySelector('select[name="parentFactionId"]');
      o && d && o.addEventListener("change", () => {
        d.disabled = o.value !== "minor";
      }), Fi(i);
      const s = ss(i, ((T = this.creationPanel) == null ? void 0 : T.data) ?? {});
      i.addEventListener("submit", async (x) => {
        x.preventDefault();
        const A = i.dataset.createKind || "", D = Object.fromEntries(new FormData(i).entries());
        a.querySelectorAll('[form="gmf-panel-editor-form"][name]').forEach((p) => {
          p instanceof HTMLInputElement && ["checkbox", "radio"].includes(p.type) && !p.checked || (D[p.name] = p.value);
        }), A === "entity" && (Object.assign(D, s == null ? void 0 : s()), D.markerImage = D.useCustomMarker === "true" ? D.markerImage ?? "" : "", delete D.useCustomMarker);
        const ee = Number(D.x), J = Number(D.y), ae = this.creationPanel, le = (ae == null ? void 0 : ae.data) ?? {};
        ae != null && ae.editId && (D.id = ae.editId), this.creationPanel = null;
        let f = null;
        if (A === "map") f = await P(this.mapId, { ...le, ...D });
        else if (A === "system")
          delete D.x, delete D.y, f = await u(this.mapId, ae != null && ae.editId ? D : { ...D, x: ee, y: J });
        else if (A === "entity" && this.activeSystemId) {
          const { orbit: p, orbits: I, ...S } = le;
          if (f = await c(this.mapId, this.activeSystemId, { ...S, ...D, x: ee, y: J }), !f) {
            this.creationPanel = ae;
            return;
          }
        } else if (A === "route") {
          if (!D.fromSystemId || !D.toSystemId || D.fromSystemId === D.toSystemId) {
            ne(`Choose two different ${this.activeSystemId ? "locations" : "systems"} for the route.`), this._openCreationPanel("route", { ...le, ...D }, (ae == null ? void 0 : ae.editId) ?? null);
            return;
          }
          f = await m(this.mapId, { ...le, ...D }, this.activeSystemId ?? "");
        } else A === "faction" && (delete D.x, delete D.y, f = await l(this.mapId, D), this.factionRegistry = !!(f && !this.selectedFactionId && !this.factionPanelOpen));
        !f && (A === "system" || A === "faction") && (this.creationPanel = { ...ae, data: { ...le, ...D } }), f != null && f.id && (A === "system" && (this.selectedSystemId = f.id), A === "entity" && (this.selectedObjectId = f.id), A === "route" && (this.selectedRouteId = f.id)), this.render({ force: !0 });
      }), globalThis.setTimeout(() => {
        var x;
        return (x = i.querySelector("[autofocus]")) == null ? void 0 : x.focus();
      }, 0);
    }
    _attachAppearancePreview(a) {
      const i = a.querySelector("[data-panel-marker-preview-system]"), o = a.querySelector("[data-panel-marker-preview-icon]"), d = a.querySelector("[data-panel-marker-preview-label]");
      if (!i) return;
      let s = 0;
      const h = ["name", "kind", "status", "iconStyle", "iconColor", "markerImage"].map((b) => a.querySelector(`[name="${b}"]`)), g = async () => {
        const b = (J, ae) => {
          var le;
          return ((le = a.querySelector(`[name="${J}"]`)) == null ? void 0 : le.value) || ae;
        }, T = b("kind", "planet"), x = b("status", "known"), A = b("iconStyle", T), D = b("markerImage", "").trim();
        i.className = `gmf-system gmf-system--${T} gmf-icon--${A} gmf-status--${x}${D ? " has-custom-marker" : ""}`, i.style.setProperty("--gmf-faction-color", b("iconColor", "#58d8ff")), i.style.setProperty("--gmf-system-size", "42px"), d && (d.textContent = b("name", "New Location"));
        const ee = ++s;
        if (o && D) {
          const J = document.createElement("img");
          J.className = "gmf-custom-marker__image", J.src = D, J.alt = "", J.draggable = !1, o.replaceChildren(J);
        } else if (o && vt.includes(A)) {
          const J = await globalThis.renderTemplate(`${t}/celestial-icon.hbs`, { system: { iconStyle: A } });
          ee === s && (o.innerHTML = J);
        } else o && (o.innerHTML = '<span class="gmf-system__core"></span>');
      };
      h.forEach((b) => {
        b == null || b.addEventListener("input", g), b == null || b.addEventListener("change", g);
      }), g();
    }
    async _confirmDeleteRoute(a) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, Ue) && await oe(this.mapId, a, this.activeSystemId ?? "");
    }
    async _travelToSystem(a, i) {
      const o = Y(n(this.mapId)), d = o.systems.find((g) => g.id === o.currentSystemId), s = o.systems.find((g) => g.id === a);
      if (!s) return;
      if (!d) {
        await se(this.mapId, s.id), ie(`Current location set to ${s.name}.`);
        return;
      }
      if (d.id === s.id) {
        ie(`${s.name} is already the current location.`);
        return;
      }
      if (!B(o, d.id, s.id)) {
        ne(`No direct route from ${d.name} to ${s.name}.`);
        return;
      }
      te(this.mapId, d.id, s.id), await this._animateShipTravel(d, s, i), await se(this.mapId, s.id), ie(`Arrived at ${s.name}.`);
    }
    async _travelToObject(a, i, o) {
      const d = Y(n(this.mapId)), s = d.systems.find((T) => T.id === a), h = s == null ? void 0 : s.objects.find((T) => T.id === d.currentLocation.objectId), g = s == null ? void 0 : s.objects.find((T) => T.id === i);
      if (!s || !g) return;
      if (!h || d.currentLocation.systemId !== s.id) {
        await L(this.mapId, s.id, g.id), ie(`Current location set to ${g.name}.`);
        return;
      }
      if (h.id === g.id) {
        ie(`${g.name} is already the current location.`);
        return;
      }
      if (!B({ routes: s.routes }, h.id, g.id)) {
        ne(`No direct route from ${h.name} to ${g.name}.`);
        return;
      }
      re(this.mapId, s.id, h.id, g.id), await this._animateShipTravel(h, g, o), await L(this.mapId, s.id, g.id), ie(`Arrived at ${g.name}.`);
    }
    _animateShipTravel(a, i, o) {
      var g, b;
      const d = Ze(), s = ((g = this._orbitLayer) == null ? void 0 : g.position(a.id, d)) ?? a, h = ((b = this._orbitLayer) == null ? void 0 : b.position(i.id, d + qt)) ?? i;
      return is(s, h, o);
    }
    getOrbitGeometry(a) {
      return this.playerMode || this.activeSystemId !== a || !this._orbitLayer ? null : { aspect: this._orbitLayer.aspect, motion: this._orbitLayer.motion };
    }
    _openLinkedJournal() {
      var o, d;
      const a = this._getSelectedRawSystem();
      if (!(a != null && a.journalId)) return;
      const i = (o = game.journal) == null ? void 0 : o.get(a.journalId);
      if (!i) {
        ne(`Journal "${a.journalId}" was not found.`);
        return;
      }
      (d = i.sheet) == null || d.render(!0);
    }
    _getSelectedRawSystem() {
      var i;
      const a = Y(n(this.mapId));
      return this.activeSystemId ? ((i = a.systems.find((o) => o.id === this.activeSystemId)) == null ? void 0 : i.objects.find((o) => o.id === this.selectedObjectId)) ?? null : a.systems.find((o) => o.id === this.selectedSystemId) ?? null;
    }
    async close(a = {}) {
      var i, o, d;
      return (i = this._orbitLayer) == null || i.dispose(), this._orbitLayer = null, this._viewportStage = null, (o = this._bountyIntelCallout) == null || o.dispose(), this._bountyIntelCallout = null, this._disposePlanetRenderer(), this._hideContextMenu(), this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, (d = this._viewportResizeObserver) == null || d.disconnect(), this._viewportResizeObserver = null, ye(this), super.close(a);
    }
    _disposePlanetRenderer() {
      var a, i;
      this._planetGeneration++, (a = this._planetLocationCallout) == null || a.dispose(), this._planetLocationCallout = null, (i = this._planetRenderer) == null || i.dispose(), this._planetRenderer = null;
    }
    _setPlanetFallback(a, i) {
      const o = a.querySelector(".gmf-planet-fallback");
      o && (o.style.backgroundImage = i.texture ? `url(${JSON.stringify(i.texture)})` : "none", o.style.backgroundColor = i.color);
      const d = a.querySelector("[data-planet-canvas]");
      d && (d.dataset.planetShape = i.shape, d.dataset.planetPreset = i.preset);
      const s = a.querySelector(".gmf-planet-stage");
      s == null || s.style.setProperty("--gmf-planet-color", i.color);
    }
    async _mountPlanetRenderer(a, i) {
      var g, b, T;
      const o = a.querySelector("[data-planet-canvas]");
      if (!o || !i) return;
      this._setPlanetFallback(a, i);
      const d = this._planetGeneration, s = a.querySelector("[data-action='planet-static']"), h = a.querySelectorAll("[data-planet-control]");
      if (s) {
        const x = this.planetStatic ? "Enable 3D" : "Static view";
        s.setAttribute("title", x), s.setAttribute("aria-label", x), s.setAttribute("aria-pressed", String(this.planetStatic));
        const A = s.querySelector("i");
        A && (A.className = this.planetStatic ? "fa-solid fa-cube" : "fa-solid fa-image");
      }
      if (this.planetStatic) {
        h.forEach((x) => x.disabled = !0);
        return;
      }
      try {
        const { createPlanetRenderer: x } = await import("./chunks/planet-renderer-t-HvFdDj.js");
        if (d !== this._planetGeneration || !o.isConnected) return;
        h.forEach((A) => A.disabled = !1), this._planetRenderer = x(o, {
          texture: i.texture,
          color: i.color,
          appearancePreset: i.preset,
          shape: i.shape,
          finish: i.finish,
          detailStrength: i.detailStrength,
          locations: ((g = this._getPlanetObject()) == null ? void 0 : g.planetLocations) ?? [],
          canPlaceLocations: !!((b = game.user) != null && b.isGM && !this.playerMode),
          onLocationDrop: (A, D) => void this._placePlanetLocation(A, D, a),
          onInvalidLocationDrop: () => ne("Drop the scene directly onto the visible 3D surface."),
          onMarkerHover: (A) => {
            var ee;
            const D = this._getPlanetLocationItem(A.id);
            D && ((ee = this._planetLocationCallout) == null || ee.show(D));
          },
          onMarkerLeave: () => {
            var A;
            return (A = this._planetLocationCallout) == null ? void 0 : A.scheduleHide();
          },
          onMarkerPosition: (A) => {
            var D;
            return (D = this._planetLocationCallout) == null ? void 0 : D.setAnchor(A);
          },
          onMarkerOpen: (A) => this._openPlanetLocation(A.id),
          onMarkerContextMenu: (T = game.user) != null && T.isGM && !this.playerMode ? (A) => void this._removePlanetLocation(A.id, a) : null,
          isVisible: () => !this.minimized,
          onPaused: (A) => {
            const D = a.querySelector("[data-action='planet-pause']");
            if (D) {
              const ee = A ? "Resume rotation" : "Pause rotation";
              D.setAttribute("title", ee), D.setAttribute("aria-label", ee), D.setAttribute("aria-pressed", String(A));
              const J = D.querySelector("i");
              J && (J.className = A ? "fa-solid fa-play" : "fa-solid fa-pause");
            }
          },
          onStopped: () => {
            h.forEach((A) => A.disabled = !0);
          }
        }), this._planetLocationCallout = ts({ host: o });
      } catch {
        h.forEach((x) => x.disabled = !0);
      }
    }
  }, X(ke, "DEFAULT_OPTIONS", {
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
  }), X(ke, "PARTS", {
    main: {
      template: `${t}/galaxy-map.hbs`
    }
  }), ke;
}
function cs(e) {
  var c;
  const { templateRoot: t, getVisibleMaps: n, openMap: r, clearChooser: u } = e;
  return c = class extends lt() {
    async _prepareContext(l) {
      return { ...await super._prepareContext(l), maps: n() };
    }
    _attachPartListeners(l, P, v) {
      super._attachPartListeners(l, P, v), ct(this, P), P.querySelectorAll("[data-player-open-map]").forEach((w) => {
        w.addEventListener("click", () => {
          r(w.dataset.playerOpenMap, { playerMode: !0 }), this.close();
        });
      });
    }
    async close(l = {}) {
      return u(this), super.close(l);
    }
  }, X(c, "DEFAULT_OPTIONS", {
    id: "galaxy-map-player-chooser",
    classes: ["galaxy-map", "galaxy-map-framework", "gmf-manager-window", "gmf-map-chooser-window"],
    window: { title: "Choose Galaxy Map", icon: "fa-solid fa-satellite", resizable: !0 },
    position: { width: 480, height: 420 }
  }), X(c, "PARTS", { main: { template: `${t}/player-map-chooser.hbs` } }), c;
}
function ls(e, t) {
  var c;
  const { setting: n, title: r, icon: u } = dt[t];
  return c = class extends lt() {
    constructor() {
      super(...arguments);
      X(this, "draft", null);
    }
    async _prepareContext(P) {
      var _;
      const v = await super._prepareContext(P), w = !!((_ = game.user) != null && _.isGM && De());
      return { ...v, canEdit: w, title: r, scale: t, ratings: w ? this.draft ?? _t(t) : [] };
    }
    _onRender(P, v) {
      var F;
      super._onRender(P, v);
      const _ = this.element.querySelector("[data-faction-ratings]");
      if (!_) return;
      const k = () => Array.from(_.querySelectorAll("[data-rating-label]"), (O) => ({
        id: O.dataset.ratingLabel,
        label: O.value
      }));
      (F = _.querySelector("[data-add-rating]")) == null || F.addEventListener("click", () => {
        this.draft = [...k(), { id: xe(t), label: "" }], this.render({ force: !0 });
      }), _.querySelectorAll("[data-remove-rating]").forEach((O) => {
        O.addEventListener("click", () => {
          this.draft = k().filter((C) => C.id !== O.dataset.removeRating), this.render({ force: !0 });
        });
      }), _.addEventListener("submit", async (O) => {
        var oe;
        if (O.preventDefault(), !((oe = game.user) != null && oe.isGM) || !De()) return;
        const C = _.querySelector("[data-rating-status]"), N = k().map(({ id: se, label: L }) => ({ id: se, label: L.trim() })), V = N.map((se) => se.label.toLowerCase());
        if (V.includes("") || new Set(V).size !== N.length) {
          C.textContent = "Enter a unique name for each rating.";
          return;
        }
        if (t === "prominence" && V.includes("unrated")) {
          C.textContent = "Unrated is reserved for factions without a prominence rating.";
          return;
        }
        const K = _.querySelector("fieldset");
        if (!K.disabled) {
          K.disabled = !0, C.textContent = "Saving…";
          try {
            await game.settings.set(he, n, { ratings: N }), this.draft = null, C.textContent = `${r} ratings saved.`;
          } catch (se) {
            C.textContent = `Could not save ${t} ratings.`, console.error(`Galaxy Map failed to save ${t} ratings`, se);
          } finally {
            K.disabled = !1;
          }
        }
      });
    }
  }, X(c, "DEFAULT_OPTIONS", {
    id: `galaxy-map-${t}-settings`,
    window: { title: `${r} Ratings`, icon: u, resizable: !0 },
    position: { width: 520, height: 480 }
  }), X(c, "PARTS", {
    main: { template: `${e}/faction-rating-settings.hbs`, scrollable: [""] }
  }), c;
}
function ds(e) {
  return e.visibility === "players";
}
function us(e, t) {
  return t && e.status === "undiscovered";
}
function oi(e, t, n, r) {
  const u = n ? void 0 : t.get(e.factionId);
  return {
    factionId: (u == null ? void 0 : u.id) ?? "",
    factionName: (u == null ? void 0 : u.name) ?? (n || r ? "" : "Unaffiliated"),
    factionColor: !n && e.iconColor || (u == null ? void 0 : u.color) || "#58d8ff"
  };
}
function fs(e, t) {
  return t === "planet" ? { station: "station", anomaly: "diamond", ruins: "diamond", unknown: "diamond" }[e] ?? t : t;
}
function ms(e, { playerMode: t = !1, selectedSystemId: n = null, selectedRouteId: r = null, factionsDisabled: u = !1 } = {}) {
  var K, oe, se;
  t = t || !((K = game.user) != null && K.isGM);
  const c = Y(e), m = t ? c.systems.filter(ds) : c.systems, l = new Set(m.map((L) => L.id)), P = u ? [] : c.factions.filter((L) => !t || L.visibility === "players"), v = new Map(P.filter((L) => L.kind === "major").map((L) => [L.id, L])), w = m.map((L) => {
    const U = us(L, t), Z = U ? "unknown" : L.type, R = U ? "diamond" : fs(Z, L.iconStyle), B = U ? "" : L.markerImage;
    return {
      ...L,
      image: L.image,
      sceneIds: [...L.sceneIds],
      journalId: L.journalId,
      planetPreset: L.planetPreset,
      planetShape: L.planetShape,
      planetTexture: L.planetTexture,
      planetColor: L.planetColor,
      iconStyle: R,
      displayMarkerImage: B,
      hasCustomMarker: !!B,
      displayName: U ? "???" : L.name,
      displayDescription: U ? "Unresolved sensor contact. Details are not available." : L.description,
      displayType: Z,
      displayStatus: U ? "undiscovered" : L.status,
      ...oi(L, v, U, u),
      objects: L.objects.filter((te) => !t || Ve(L, te) === "players").map((te) => ({
        ...te,
        ...oi(te, v, U || t && te.status === "undiscovered", u)
      })),
      obscured: U,
      isCurrent: L.id === c.currentSystemId,
      isSelected: L.id === n,
      gmOnly: L.visibility === "gm",
      animatedCelestial: !B && vt.includes(R),
      hasAlert: ["danger", "locked"].includes(U ? "undiscovered" : L.status),
      alertLabel: L.status === "danger" ? "Hazard advisory" : L.status === "locked" ? "Restricted access" : "",
      hasJournal: !!(!U && L.journalId),
      hasScenes: !!(!U && L.sceneIds.length),
      showImage: !!(!U && L.image),
      canInspectSystem: !!Re({ ...L, obscured: U })
    };
  }), _ = w.filter((L) => !L.obscured), k = P.map((L) => {
    const U = _.find(($) => $.id === L.headquartersSystemId), { id: Z, name: R, color: B, emblem: te, tagline: re, type: ie, description: ne, visibility: Se, kind: ve, prominence: be, reputation: Pe } = L;
    return {
      id: Z,
      name: R,
      color: B,
      emblem: te,
      tagline: re,
      type: ie,
      description: ne,
      visibility: Se,
      kind: ve,
      prominence: be,
      reputation: Pe,
      parentFactionId: v.has(L.parentFactionId) ? L.parentFactionId : "",
      systemProminence: Object.fromEntries(_.filter(($) => Object.hasOwn(L.systemProminence, $.id)).map(($) => [$.id, L.systemProminence[$.id]])),
      gmNotes: t ? void 0 : L.gmNotes,
      headquarters: U ? { id: U.id, name: U.displayName } : null,
      controlledSystems: _.filter(($) => $.factionId === Z).map(($) => ({ id: $.id, name: $.displayName }))
    };
  }), F = c.routes.filter((L) => !t || L.visibility === "players").filter((L) => l.has(L.fromSystemId) && l.has(L.toSystemId)).map((L) => {
    const U = w.find((R) => R.id === L.fromSystemId), Z = w.find((R) => R.id === L.toSystemId);
    return {
      ...L,
      from: U,
      to: Z,
      fromName: (U == null ? void 0 : U.displayName) ?? L.fromSystemId,
      toName: (Z == null ? void 0 : Z.displayName) ?? L.toSystemId,
      isSelected: L.id === r,
      connectsCurrent: L.fromSystemId === c.currentSystemId || L.toSystemId === c.currentSystemId,
      gmOnly: L.visibility === "gm"
    };
  }), O = F.find((L) => L.id === r) ?? null, C = O ? null : w.find((L) => L.id === n) ?? null;
  C && (C.isSelected = !0);
  const N = w.find((L) => L.id === c.currentSystemId) ?? w[0] ?? null, V = C && N && C.id !== N.id ? F.find((L) => L.fromSystemId === N.id && L.toSystemId === C.id || L.toSystemId === N.id && L.fromSystemId === C.id) : null;
  return C && (C.canTravel = !!V, C.travelRouteId = (V == null ? void 0 : V.id) ?? "", C.isCurrent = C.id === (N == null ? void 0 : N.id), C.isDestination = !!(V && !C.isCurrent)), F.forEach((L) => {
    L.isActive = L.isSelected || L.id === (V == null ? void 0 : V.id);
  }), {
    ...c,
    systems: w,
    routes: F,
    factions: k,
    selectedSystem: C,
    selectedRoute: O,
    currentSystem: N,
    selectedType: O ? "route" : C ? "system" : null,
    playerMode: t,
    isGM: ((oe = game.user) == null ? void 0 : oe.isGM) ?? !1,
    canEdit: ((se = game.user) == null ? void 0 : se.isGM) && !t
  };
}
function ps(e) {
  var u;
  if (!e) return null;
  const t = Y(e), n = new Map(t.systems.map((c) => [c.id, c])), r = new Map(t.factions.map((c) => [c.id, c]));
  return {
    ...t,
    travelApprovalModeLabel: ((u = Tt.find((c) => c.value === t.travelApprovalMode)) == null ? void 0 : u.label) ?? "Unanimous agreement",
    factions: t.factions.map((c) => ({
      ...c,
      systemCount: t.systems.filter((m) => m.factionId === c.id).length
    })),
    systems: t.systems.map((c) => {
      var m;
      return {
        ...c,
        factionName: ((m = r.get(c.factionId)) == null ? void 0 : m.name) ?? "Unaffiliated"
      };
    }),
    routes: [
      ...t.routes.map((c) => {
        var m, l;
        return {
          ...c,
          systemId: "",
          scopeLabel: "Galaxy route",
          fromName: ((m = n.get(c.fromSystemId)) == null ? void 0 : m.name) ?? c.fromSystemId,
          toName: ((l = n.get(c.toSystemId)) == null ? void 0 : l.name) ?? c.toSystemId
        };
      }),
      ...t.systems.flatMap((c) => {
        const m = new Map(c.objects.map((l) => [l.id, l]));
        return c.routes.map((l) => {
          var P, v;
          return {
            ...l,
            systemId: c.id,
            scopeLabel: `Inside ${c.name}`,
            fromName: ((P = m.get(l.fromSystemId)) == null ? void 0 : P.name) ?? l.fromSystemId,
            toName: ((v = m.get(l.toSystemId)) == null ? void 0 : v.name) ?? l.toSystemId
          };
        });
      })
    ]
  };
}
function hs(e) {
  Fi(e), e.querySelectorAll("[data-use-custom-marker]").forEach((F) => {
    const O = (F.closest("form") ?? e).querySelector("[data-custom-marker-field]"), C = (O == null ? void 0 : O.querySelector('[name="markerImage"]')) ?? null, N = (O == null ? void 0 : O.querySelectorAll("button")) ?? [], V = () => {
      const K = F.checked;
      O == null || O.classList.toggle("is-disabled", !K), C && (C.disabled = !K), N.forEach((oe) => {
        oe.disabled = !K;
      }), !K && (C != null && C.value) && (C.value = "", C.dispatchEvent(new Event("input", { bubbles: !0 })), C.dispatchEvent(new Event("change", { bubbles: !0 })));
    };
    F.addEventListener("change", V), V();
  });
  const t = e.querySelector("[data-texture-upload-fields]"), n = e.querySelector('[name="planetTexture"]'), r = e.querySelector('[name="planetPreset"]'), u = e.querySelector('[name="planetShape"]'), c = e.querySelector('[name="planetFinish"]'), m = e.querySelector('[name="planetColor"]'), l = e.querySelector("[data-texture-guide]"), P = e.querySelector("[data-texture-guide-section]"), v = e.querySelectorAll("[data-texture-guide-preview]"), w = () => {
    if (!r || !u) return;
    const F = gi(r.value, u.value);
    r.replaceChildren(...yi(u.value).map((O) => {
      const C = document.createElement("option");
      return C.value = O.value, C.textContent = O.label, C;
    })), r.value = F;
  }, _ = () => {
    const F = (r == null ? void 0 : r.value) === "custom", O = (r == null ? void 0 : r.value) === "none";
    return t && (t.hidden = !F), P && (P.hidden = !F), n && (n.required = F), u && (u.disabled = O), c && (c.disabled = O), m && (m.disabled = (r == null ? void 0 : r.value) !== "color"), F;
  }, k = () => {
    var O;
    if (!l) return;
    const F = (O = n == null ? void 0 : n.value) == null ? void 0 : O.trim();
    F ? l.dataset.hasTexture = "true" : delete l.dataset.hasTexture, v.forEach((C) => {
      C.onerror = F ? () => {
        C.hidden = !0;
      } : null, C.hidden = !F, F ? C.src = F : C.removeAttribute("src");
    });
  };
  r == null || r.addEventListener("change", () => {
    !_() && (n != null && n.value) && (n.value = "", n.dispatchEvent(new Event("change", { bubbles: !0 })));
  }), n == null || n.addEventListener("change", k), u == null || u.addEventListener("change", () => {
    l && (l.dataset.shape = u.value), w(), _();
  }), w(), _(), k();
}
function ys(e) {
  const { notifyError: t, notifyInfo: n, requireGM: r, refreshOpenApps: u, closeOpenMap: c, getOpenMapViews: m } = e, l = (f) => foundry.utils.deepClone(f), P = (f) => game.socket.emit(_e, { action: "refresh", mapId: f });
  function v() {
    return l(game.settings.get(he, wt) ?? {});
  }
  async function w(f) {
    return r("save galaxy map data") && await game.settings.set(he, wt, f ?? {}), f;
  }
  function _(f) {
    const p = v();
    return p[f] ? l(p[f]) : null;
  }
  async function k(f, p, { refresh: I = !0 } = {}) {
    return f[p] = Y(f[p]), await w(f), I && u(p), P(p), f[p];
  }
  async function F(f = {}) {
    if (!r("create galaxy maps")) return null;
    const p = v(), I = Y(f);
    return p[I.id] = I, await w(p), u(I.id), l(I);
  }
  async function O(f, p = {}) {
    if (!r("update galaxy maps")) return null;
    const I = v();
    if (!I[f])
      return t(`Map "${f}" was not found.`), null;
    const S = Y({ ...p, id: f });
    return I[f] = S, await w(I), u(f), l(S);
  }
  async function C(f, p = {}) {
    const I = _(f);
    return !r("update galaxy map metadata") || !I ? (I || t(`Map "${f}" was not found.`), null) : O(f, {
      ...I,
      title: p.title,
      subtitle: p.subtitle,
      description: p.description,
      backgroundImage: p.backgroundImage,
      visibility: p.visibility,
      travelApprovalMode: p.travelApprovalMode
    });
  }
  async function N(f) {
    if (!r("delete galaxy maps")) return !1;
    const p = v();
    return p[f] ? (delete p[f], await w(p), c(f), u(), !0) : !1;
  }
  async function V(f) {
    if (!r("duplicate galaxy maps")) return null;
    const p = _(f);
    if (!p)
      return t(`Map "${f}" was not found.`), null;
    const I = Y({ ...p, id: xe("map"), title: `${p.title} Copy` }), S = v();
    return S[I.id] = I, await w(S), u(I.id), l(I);
  }
  async function K(f, p = {}) {
    var fe;
    if (!r("save star systems")) return null;
    const I = v();
    if (!I[f])
      return t(`Map "${f}" was not found.`), null;
    const S = Y(I[f]), M = S.systems.find((me) => me.id === p.id);
    if (p.factionId && p.factionId !== (M == null ? void 0 : M.factionId) && !S.factions.some((me) => me.id === p.factionId))
      return t("Choose a faction on this galaxy map."), null;
    const E = p.objects ?? (M == null ? void 0 : M.objects) ?? [], z = (M == null ? void 0 : M.primaryObjectId) || ((fe = E[0]) == null ? void 0 : fe.id), j = ["image", "sceneIds", "planetLocations", "journalId", "planetPreset", "planetShape", "planetFinish", "planetTexture", "planetColor"], H = E.map((me) => me.id !== z ? me : Qt({
      ...me,
      ...Object.fromEntries(j.filter((Ie) => p[Ie] !== void 0).map((Ie) => [Ie, p[Ie]]))
    })), Q = xi({ ...M, ...p, objects: H }), ue = S.systems.findIndex((me) => me.id === Q.id);
    return ue >= 0 ? S.systems[ue] = Q : S.systems.push(Q), I[f] = S, await k(I, f), l(Q);
  }
  async function oe(f, p, I = {}) {
    var Q, ue, fe;
    if (!r("save locations")) return null;
    const S = v(), M = S[f] ? Y(S[f]) : null, E = M == null ? void 0 : M.systems.find((me) => me.id === p);
    if (!M || !E) return null;
    const z = E.objects.findIndex((me) => me.id === I.id), j = E.objects[z], H = Qt({ orbits: j == null ? void 0 : j.orbits, orbit: j == null ? void 0 : j.orbit, ...I });
    if (H.orbit && !Pt(E.objects, H.id, H.orbit))
      return t("Choose an orbit that exists in this system and does not depend on this location."), null;
    if (j != null && j.orbit || (Q = j == null ? void 0 : j.orbits) != null && Q.length) {
      const me = Ze(), Ie = se(f, p), we = gt(E.objects).positions(Ie.aspect, me, Ie.motion);
      j.orbit && !H.orbit && mt(H, we.get(H.id)), j.orbit && H.orbit && H.orbit.epoch !== j.orbit.epoch && H.orbit.centerId === j.orbit.centerId && H.orbit.orbitId === j.orbit.orbitId && H.orbit.angle === j.orbit.angle && (H.orbit.angle = bi(j.orbit, me, Ie.motion));
      for (const W of E.objects)
        ((ue = W.orbit) == null ? void 0 : ue.centerId) === H.id && !((fe = H.orbits) != null && fe.some((ge) => ge.id === W.orbit.orbitId)) && mt(W, we.get(W.id));
    }
    return z >= 0 ? E.objects[z] = H : E.objects.push(H), E.primaryObjectId || (E.primaryObjectId = H.id), S[f] = M, await k(S, f), l(H);
  }
  function se(f, p) {
    var I;
    for (const S of m(f)) {
      const M = (I = S.getOrbitGeometry) == null ? void 0 : I.call(S, p);
      if (M) return M;
    }
    return { aspect: Si, motion: !0 };
  }
  function L(f, p, I) {
    const S = p.objects.filter((j) => j.orbit && (j.id === I || j.orbit.centerId === I));
    if (!S.length) return;
    const { aspect: M, motion: E } = se(f, p.id), z = gt(p.objects).positions(M, Ze(), E);
    for (const j of S) mt(j, z.get(j.id));
  }
  const U = (f, p, I) => {
    var S;
    for (const M of m(f)) (S = M.refreshPlanetLocations) == null || S.call(M, p, I);
  };
  async function Z(f, p, I, S = {}) {
    var ue;
    if (!r("place surface locations")) return null;
    const M = v(), E = M[f] ? Y(M[f]) : null, z = (ue = E == null ? void 0 : E.systems.find((fe) => fe.id === p)) == null ? void 0 : ue.objects.find((fe) => fe.id === I);
    if (!E || !z) return null;
    const j = String(S.sceneId || "");
    if (!z.sceneIds.includes(j))
      return t("Only scenes linked to this object can be placed on its surface."), null;
    const H = Li(S), Q = z.planetLocations.findIndex((fe) => fe.sceneId === j && fe.shape === H.shape);
    return Q >= 0 && (H.id = z.planetLocations[Q].id), Q >= 0 ? z.planetLocations[Q] = H : z.planetLocations.push(H), M[f] = Y(E), await w(M), U(f, p, I), game.socket.emit(_e, { action: "planet-locations", mapId: f, systemId: p, objectId: I }), l(H);
  }
  async function R(f, p, I, S) {
    var H;
    if (!r("remove surface locations")) return !1;
    const M = v(), E = M[f] ? Y(M[f]) : null, z = (H = E == null ? void 0 : E.systems.find((Q) => Q.id === p)) == null ? void 0 : H.objects.find((Q) => Q.id === I);
    if (!E || !z) return !1;
    const j = z.planetLocations.length;
    return z.planetLocations = z.planetLocations.filter((Q) => Q.id !== S), z.planetLocations.length === j ? !1 : (M[f] = Y(E), await w(M), U(f, p, I), game.socket.emit(_e, { action: "planet-locations", mapId: f, systemId: p, objectId: I }), !0);
  }
  async function B(f, p, I, S) {
    var E, z;
    if (!r("unlink scenes from locations")) return !1;
    const M = (z = (E = _(f)) == null ? void 0 : E.systems.find((j) => j.id === p)) == null ? void 0 : z.objects.find((j) => j.id === I);
    return M != null && M.sceneIds.includes(S) ? !!await oe(f, p, { ...M, sceneIds: M.sceneIds.filter((j) => j !== S) }) : !1;
  }
  async function te(f, p, I) {
    var z;
    if (!r("delete locations")) return !1;
    const S = v(), M = S[f] ? Y(S[f]) : null, E = M == null ? void 0 : M.systems.find((j) => j.id === p);
    return !M || !E ? !1 : (L(f, E, I), E.objects = E.objects.filter((j) => j.id !== I), E.primaryObjectId === I && (E.primaryObjectId = ((z = E.objects[0]) == null ? void 0 : z.id) ?? ""), M.currentLocation.objectId === I && (M.currentLocation.objectId = E.primaryObjectId), S[f] = M, await k(S, f), !0);
  }
  async function re(f, p, I) {
    var H;
    if (!r("move locations")) return null;
    const S = v(), M = S[f] ? Y(S[f]) : null, E = M == null ? void 0 : M.systems.find((Q) => Q.objects.some((ue) => ue.id === p)), z = M == null ? void 0 : M.systems.find((Q) => Q.id === I), j = E == null ? void 0 : E.objects.find((Q) => Q.id === p);
    return !M || !E || !z || !j ? null : (E.id !== z.id && L(f, E, p), E.objects = E.objects.filter((Q) => Q.id !== p), z.objects.push(j), E.primaryObjectId === p && (E.primaryObjectId = ((H = E.objects[0]) == null ? void 0 : H.id) ?? ""), z.primaryObjectId || (z.primaryObjectId = p), M.currentLocation.objectId === p && (M.currentLocation.systemId = z.id), S[f] = M, await k(S, f), l(j));
  }
  async function ie(f, p, I) {
    if (!r("set the arrival object")) return null;
    const S = v(), M = S[f] ? Y(S[f]) : null, E = M == null ? void 0 : M.systems.find((z) => z.id === p);
    return !M || !(E != null && E.objects.some((z) => z.id === I)) ? null : (E.primaryObjectId = I, M.currentLocation.systemId === p && !M.currentLocation.objectId && (M.currentLocation.objectId = I), S[f] = M, await k(S, f), l(E));
  }
  async function ne(f, p, I, S, M, E) {
    var Q, ue;
    if (!r("place locations")) return null;
    const z = v(), j = z[f] ? Y(z[f]) : null, H = (Q = j == null ? void 0 : j.systems.find((fe) => fe.id === p)) == null ? void 0 : Q.objects.find((fe) => fe.id === I);
    if (!j || !H) return null;
    if (E) {
      if (((ue = H.orbit) == null ? void 0 : ue.centerId) !== E.centerId || H.orbit.orbitId !== E.orbitId) return null;
      H.orbit.angle = E.angle, H.orbit.epoch = Ze();
    } else
      H.x = pe(Ce(S, H.x), 0, 100), H.y = pe(Ce(M, H.y), 0, 100);
    return z[f] = j, await k(z, f), l(H);
  }
  async function Se(f, p, I, S) {
    var j;
    if (!r("change object visibility")) return null;
    const M = v(), E = M[f] ? Y(M[f]) : null, z = (j = E == null ? void 0 : E.systems.find((H) => H.id === p)) == null ? void 0 : j.objects.find((H) => H.id === I);
    return !E || !z ? null : (z.visibility = _i.includes(S) ? S : "inherit", z.visibility === "players" && ["undiscovered", "locked"].includes(z.status) && (z.status = "known"), M[f] = E, await k(M, f), l(z));
  }
  async function ve(f, p) {
    var M;
    if (!r("delete star systems")) return !1;
    const I = v(), S = I[f];
    if (!S) return !1;
    S.systems = S.systems.filter((E) => E.id !== p), S.routes = S.routes.filter((E) => E.fromSystemId !== p && E.toSystemId !== p), S.currentSystemId === p && (S.currentSystemId = ((M = S.systems[0]) == null ? void 0 : M.id) ?? "");
    for (const E of S.factions ?? []) E.headquartersSystemId === p && (E.headquartersSystemId = "");
    return await k(I, f), !0;
  }
  async function be(f, p) {
    if (!r("set current location")) return null;
    const I = v(), S = I[f] ? Y(I[f]) : null, M = S == null ? void 0 : S.systems.find((E) => E.id === p);
    return !S || !M ? (t(`System "${p}" was not found.`), null) : (S.currentLocation.systemId !== p && (S.currentLocation = { systemId: p, objectId: M.primaryObjectId }), S.currentSystemId = p, I[f] = S, await k(I, f), l(M));
  }
  async function Pe(f, p, I) {
    if (!r("set current location")) return null;
    const S = v(), M = S[f] ? Y(S[f]) : null, E = M == null ? void 0 : M.systems.find((j) => j.id === p), z = E == null ? void 0 : E.objects.find((j) => j.id === I);
    return !M || !E || !z ? null : (M.currentSystemId = p, M.currentLocation = { systemId: p, objectId: I }, S[f] = M, await k(S, f), l(z));
  }
  async function $(f, p = {}, I = "") {
    var H;
    if (!r("save routes")) return null;
    const S = v(), M = S[f], E = I ? (H = M == null ? void 0 : M.systems) == null ? void 0 : H.find((Q) => Q.id === I) : M;
    if (!M || !E)
      return t(I ? `System "${I}" was not found.` : `Map "${f}" was not found.`), null;
    Array.isArray(E.routes) || (E.routes = []);
    const z = Ot(p);
    if (!z.fromSystemId || !z.toSystemId || z.fromSystemId === z.toSystemId)
      return t("Routes require two different systems."), null;
    const j = E.routes.findIndex((Q) => Q.id === z.id);
    return j >= 0 ? E.routes[j] = z : E.routes.push(z), await k(S, f), l(z);
  }
  async function ye(f, p, I = "") {
    var z;
    if (!r("delete routes")) return !1;
    const S = v(), M = S[f], E = I ? (z = M == null ? void 0 : M.systems) == null ? void 0 : z.find((j) => j.id === I) : M;
    return E ? (E.routes = (E.routes ?? []).filter((j) => j.id !== p), await k(S, f), !0) : !1;
  }
  async function ke(f, p = {}) {
    var z;
    if (!r("save factions")) return null;
    const I = v();
    if (!I[f])
      return t(`Map "${f}" was not found.`), null;
    const S = Y(I[f]), M = S.factions.findIndex((j) => j.id === p.id), E = Pi({ ...S.factions[M], ...p });
    return E.parentFactionId && (E.parentFactionId === E.id || !S.factions.some((j) => j.id === E.parentFactionId && j.kind === "major")) ? (t("Choose a major faction on this galaxy map as the parent."), null) : E.headquartersSystemId && E.headquartersSystemId !== ((z = S.factions[M]) == null ? void 0 : z.headquartersSystemId) && !S.systems.some((j) => j.id === E.headquartersSystemId) ? (t("Choose a headquarters system on this galaxy map."), null) : (M >= 0 ? S.factions[M] = E : S.factions.push(E), I[f] = S, await k(I, f), l(E));
  }
  async function y(f, p) {
    if (!r("delete factions")) return !1;
    const I = v();
    if (!I[f]) return !1;
    const S = Y(I[f]);
    S.factions = S.factions.filter((M) => M.id !== p);
    for (const M of S.systems) {
      M.factionId === p && (M.factionId = "");
      for (const E of M.objects ?? []) E.factionId === p && (E.factionId = "");
    }
    return I[f] = S, await k(I, f), !0;
  }
  async function G(f, p, I, S, M = "") {
    var ue, fe, me, Ie;
    if (!r(`${S ? "hide" : "reveal"} ${{ faction: "factions", system: "star systems", route: "routes" }[p]}`)) return null;
    const z = v(), j = z[f], H = M ? (ue = j == null ? void 0 : j.systems) == null ? void 0 : ue.find((we) => we.id === M) : j, Q = p === "faction" ? (fe = j == null ? void 0 : j.factions) == null ? void 0 : fe.find((we) => we.id === I) : p === "system" ? (me = j == null ? void 0 : j.systems) == null ? void 0 : me.find((we) => we.id === I) : (Ie = H == null ? void 0 : H.routes) == null ? void 0 : Ie.find((we) => we.id === I);
    return !j || !Q ? (t(`${p[0].toUpperCase()}${p.slice(1)} "${I}" was not found.`), null) : (Q.visibility = S ? "gm" : "players", p === "system" && !S && ["undiscovered", "locked"].includes(Q.status) && (Q.status = "known"), await k(z, f), l(Q));
  }
  async function a(f, p, I = !0) {
    const S = await G(f, "faction", p, I);
    return S && n(`${S.name} ${I ? "hidden from" : "visible to"} players.`), S;
  }
  async function i(f, p, { notify: I = !0 } = {}) {
    const S = await G(f, "system", p, !1);
    return S ? (I && g(f, S.id), n(`${S.name} revealed to players.`), S) : null;
  }
  async function o(f, p, I = !0) {
    const S = await G(f, "system", p, I);
    return S && n(`${S.name} ${I ? "hidden from" : "visible to"} players.`), S;
  }
  async function d(f, p, I = "") {
    const S = await G(f, "route", p, !1, I);
    return S && n("Route revealed to players."), S;
  }
  async function s(f, p, I = !0, S = "") {
    const M = await G(f, "route", p, I, S);
    return M && n(`Route ${I ? "hidden from" : "visible to"} players.`), M;
  }
  async function h(f, p, I, S) {
    var j;
    if (!r("move star systems")) return null;
    const M = v(), E = M[f], z = (j = E == null ? void 0 : E.systems) == null ? void 0 : j.find((H) => H.id === p);
    return z ? (z.x = pe(Ce(I, z.x), 0, 100), z.y = pe(Ce(S, z.y), 0, 100), await k(M, f, { refresh: !1 }), l(z)) : (t(`System "${p}" was not found.`), null);
  }
  function g(f, p) {
    var S, M;
    if (!r("notify players about discoveries")) return;
    const I = (M = (S = _(f)) == null ? void 0 : S.systems) == null ? void 0 : M.find((E) => E.id === p);
    if (!I) {
      t(`System "${p}" was not found.`);
      return;
    }
    game.socket.emit(_e, { action: "notify", mapId: f, systemId: p, message: `New System Discovered: ${I.name}` }), n(`Discovery notification sent: ${I.name}.`);
  }
  async function b(f, { replace: p = !1 } = {}) {
    if (!r("import galaxy maps")) return null;
    const I = v();
    let S = Y(f);
    return I[S.id] && !p && (S = Y({ ...S, id: xe("map"), title: `${S.title} Import` })), I[S.id] = S, await w(I), u(S.id), n(`Imported ${S.title}.`), l(S);
  }
  function T(f) {
    if (!r("export galaxy maps")) return;
    const p = _(f);
    if (!p) {
      t(`Map "${f}" was not found.`);
      return;
    }
    Dn(`${Nn(p.title)}.json`, Y(p));
  }
  const x = () => Object.values(v()).map(Y), A = (f, p) => l(Y(_(f)).systems.find((I) => I.id === String(p)) ?? null);
  function D(f, p) {
    const I = Y(_(f));
    for (const S of I.systems) {
      const M = S.objects.find((E) => E.id === String(p));
      if (M) return { systemId: S.id, object: l(M) };
    }
    return null;
  }
  const ee = (f, p) => {
    const I = Y(_(f)).systems.find((S) => S.id === String(p));
    return [...new Set((I == null ? void 0 : I.objects.flatMap((S) => S.sceneIds)) ?? [])];
  }, J = (f, p) => {
    var I;
    return [...((I = D(f, p)) == null ? void 0 : I.object.sceneIds) ?? []];
  };
  function ae(f) {
    return x().flatMap((p) => p.systems.flatMap((I) => I.objects.filter((S) => S.sceneIds.includes(String(f))).map((S) => ({ mapId: p.id, mapTitle: p.title, systemId: I.id, systemName: I.name, object: l(S) }))));
  }
  function le(f) {
    return x().flatMap((p) => p.systems.filter((I) => I.objects.some((S) => S.sceneIds.includes(String(f)))).map((I) => ({ mapId: p.id, mapTitle: p.title, system: l(I) })));
  }
  return {
    getMapStore: v,
    saveMapStore: w,
    getRawMap: _,
    createMap: F,
    updateMap: O,
    updateMapMetadata: C,
    deleteMap: N,
    duplicateMap: V,
    upsertSystem: K,
    upsertObject: oe,
    savePlanetLocation: Z,
    removePlanetLocation: R,
    unlinkPlanetScene: B,
    deleteObject: te,
    moveObject: re,
    setPrimaryObject: ie,
    saveObjectPosition: ne,
    setObjectVisibility: Se,
    deleteSystem: ve,
    setCurrentSystem: be,
    setCurrentObject: Pe,
    upsertRoute: $,
    deleteRoute: ye,
    upsertFaction: ke,
    deleteFaction: y,
    hideFactionFromPlayers: a,
    saveSystemPosition: h,
    revealSystemToPlayers: i,
    hideSystemFromPlayers: o,
    revealRouteToPlayers: d,
    hideRouteFromPlayers: s,
    notifySystemDiscovered: g,
    importMapData: b,
    exportMap: T,
    getMaps: x,
    getSystem: A,
    getObject: D,
    getSceneIdsForSystem: ee,
    getSceneIdsForObject: J,
    getObjectsForScene: ae,
    getSystemsForScene: le,
    updateOpenPlanetLocations: U
  };
}
function gs(e) {
  const {
    getRawMap: t,
    setCurrentSystem: n,
    setCurrentObject: r,
    getOpenMapViews: u,
    getAppHtml: c,
    notifyInfo: m,
    notifyError: l,
    getActiveUsers: P,
    getPrimaryGM: v,
    isPrimaryGM: w
  } = e, _ = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Set(), F = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map();
  function C(y, G, a) {
    return y.routes.find((i) => i.fromSystemId === G && i.toSystemId === a || i.toSystemId === G && i.fromSystemId === a) ?? null;
  }
  function N(y, G) {
    const a = t(y);
    if (!a)
      return l(`Map "${y}" was not found.`), null;
    const i = Y(a), o = i.systems.find((b) => b.id === i.currentSystemId), d = i.systems.find((b) => b.id === G);
    if (!d)
      return l(`System "${G}" was not found.`), null;
    if (!o)
      return l("This map does not have a current location yet. Ask the GM to set one first."), null;
    if (o.id === d.id)
      return m(`${d.name} is already the current location.`), null;
    if (i.visibility !== "players" || o.visibility !== "players" || d.visibility !== "players")
      return l("That travel destination is not visible to players."), null;
    const s = C(i, o.id, d.id);
    if (!s || s.visibility !== "players")
      return l(`No player-visible direct route from ${o.name} to ${d.name}.`), null;
    const h = v();
    if (!h)
      return l("A GM must be online to approve player travel."), null;
    const g = ft(P(), game.user.id, h, i.travelApprovalMode);
    return {
      action: "travel-request",
      requestId: xe("travel"),
      mapId: y,
      mapTitle: i.title,
      fromSystemId: o.id,
      fromName: o.name,
      toSystemId: d.id,
      toName: d.name,
      routeId: s.id,
      routeType: s.type,
      travelTime: s.travelTime,
      fuelCost: s.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      ...g
    };
  }
  function V(y, G) {
    const a = N(y, G);
    return a ? (game.socket.emit(_e, a), m(`Travel request sent: ${a.fromName} to ${a.toName}.`), a) : null;
  }
  function K(y, G, a) {
    const i = t(y);
    if (!i)
      return l(`Map "${y}" was not found.`), null;
    const o = Y(i), d = o.systems.find((x) => x.id === G), s = d == null ? void 0 : d.objects.find((x) => x.id === o.currentLocation.objectId), h = d == null ? void 0 : d.objects.find((x) => x.id === a);
    if (!d || o.currentLocation.systemId !== d.id || !s)
      return l("The current location is not inside this system."), null;
    if (!h)
      return l(`Destination "${a}" was not found.`), null;
    if (s.id === h.id)
      return m(`${h.name} is already the current location.`), null;
    if (o.visibility !== "players" || d.visibility !== "players" || Ve(d, s) !== "players" || Ve(d, h) !== "players")
      return l("That travel destination is not visible to players."), null;
    const g = C({ routes: d.routes }, s.id, h.id);
    if (!g || g.visibility !== "players")
      return l(`No player-visible direct route from ${s.name} to ${h.name}.`), null;
    const b = v();
    if (!b)
      return l("A GM must be online to approve player travel."), null;
    const T = ft(P(), game.user.id, b, o.travelApprovalMode);
    return {
      action: "travel-request",
      travelScope: "object",
      requestId: xe("travel"),
      mapId: y,
      mapTitle: o.title,
      systemId: d.id,
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
      ...T
    };
  }
  function oe(y, G, a) {
    const i = K(y, G, a);
    return i ? (game.socket.emit(_e, i), m(`Travel request sent: ${i.fromName} to ${i.toName}.`), i) : null;
  }
  function se(y, G) {
    var s, h;
    if (!G) return;
    O.set(y, G);
    const a = (s = F.get(y)) == null ? void 0 : s.root;
    if (!a) return;
    const i = a.querySelector("[data-travel-progress-count]"), o = a.querySelector("[data-travel-progress-pending]"), d = a.querySelector("[data-travel-progress-bar]");
    i && (i.textContent = `${G.acceptedCount} of ${G.requiredApprovals} approvals`), o && (o.textContent = (h = G.pendingNames) != null && h.length ? `Waiting for: ${G.pendingNames.join(", ")}` : "All votes received"), d && (d.style.width = `${Math.min(100, G.acceptedCount / Math.max(1, G.requiredApprovals) * 100)}%`);
  }
  function L(y) {
    var s, h, g, b;
    if (!(y != null && y.requestId) || y.requesterId === ((s = game.user) == null ? void 0 : s.id) || !((g = y.voterIds) != null && g.includes((h = game.user) == null ? void 0 : h.id)) || k.has(y.requestId)) return;
    k.add(y.requestId);
    let G = !1, a = !1, i = null;
    const o = (T) => {
      if (G) return;
      G = !0;
      const x = {
        action: "travel-vote",
        requestId: y.requestId,
        mapId: y.mapId,
        userId: game.user.id,
        userName: game.user.name,
        accepted: T
      };
      game.socket.emit(_e, x), Pe(x);
    }, d = ((b = Tt.find((T) => T.value === y.approvalMode)) == null ? void 0 : b.label) ?? "Unanimous agreement";
    i = new Dialog({
      title: "Travel Request",
      content: `<section class="gmf-travel-request">
        <p><strong>${Le(y.requesterName)}</strong> wants to travel on <strong>${Le(y.mapTitle)}</strong>.</p>
        <p>${Le(y.fromName)} &rarr; ${Le(y.toName)}</p>
        <p class="gmf-travel-request__meta">${Le(y.routeType)} route / ${Le(y.travelTime || "Unknown time")} / Fuel ${Le(y.fuelCost ?? 0)}</p>
        <p class="gmf-travel-request__mode"><i class="fa-solid fa-users"></i> ${Le(d)}</p>
        <div class="gmf-travel-progress" data-travel-progress aria-live="polite">
          <div class="gmf-travel-progress__bar"><span data-travel-progress-bar></span></div>
          <strong data-travel-progress-count>Waiting for vote status…</strong><span data-travel-progress-pending></span>
        </div></section>`,
      render: (T) => {
        const x = ji(T), A = F.get(y.requestId);
        A && (A.root = x), se(y.requestId, O.get(y.requestId));
      },
      buttons: {
        accept: { icon: '<i class="fa-solid fa-check"></i>', label: "Accept", callback: () => o(!0) },
        decline: { icon: '<i class="fa-solid fa-xmark"></i>', label: "Decline", callback: () => o(!1) }
      },
      default: "accept",
      close: () => {
        F.delete(y.requestId), a || o(!1);
      }
    }, { classes: ["galaxy-map", "gmf-crud-dialog"], width: 420, height: Math.max(320, Math.min(440, window.innerHeight - 80)) }), F.set(y.requestId, { root: null, resolve: () => {
      a = !0, G = !0, i == null || i.close();
    } }), i.render(!0);
  }
  const U = (y) => {
    var G;
    return !!(y != null && y.coordinatorId && y.coordinatorId === ((G = v()) == null ? void 0 : G.id));
  };
  function Z(y) {
    const G = Zt(y);
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
        var i;
        return ((i = y.voterNames) == null ? void 0 : i[a]) || "Navigator";
      }),
      coordinatorId: game.user.id
    };
  }
  function R(y) {
    const G = Z(y);
    return se(y.requestId, G), game.socket.emit(_e, G), G;
  }
  function B(y) {
    var a, i, o;
    if (!(y != null && y.requestId) || !U(y)) return;
    const G = O.get(y.requestId);
    if (se(y.requestId, y), y.requesterId === ((a = game.user) == null ? void 0 : a.id) && (!G || G.acceptedCount !== y.acceptedCount || G.declinedCount !== y.declinedCount)) {
      const d = (i = y.pendingNames) != null && i.length ? ` Waiting for ${y.pendingNames.join(", ")}.` : "";
      (o = ui.notifications) == null || o.info(`Travel vote: ${y.acceptedCount}/${y.requiredApprovals} approvals.${d}`);
    }
  }
  function te(y) {
    if (!w() || !(y != null && y.requestId) || _.has(y.requestId)) return null;
    const G = t(y.mapId);
    if (!G) return null;
    const a = Y(G), i = P().find((J) => J.id === y.requesterId && !J.isGM), o = y.travelScope === "object", d = o ? a.systems.find((J) => J.id === y.systemId) : null, s = o ? d == null ? void 0 : d.objects.find((J) => J.id === a.currentLocation.objectId) : a.systems.find((J) => J.id === a.currentSystemId), h = o ? d == null ? void 0 : d.objects.find((J) => J.id === y.toObjectId) : a.systems.find((J) => J.id === y.toSystemId), g = s && h ? C(o ? { routes: (d == null ? void 0 : d.routes) ?? [] } : a, s.id, h.id) : null, b = o && (!d || a.currentLocation.systemId !== d.id || d.visibility !== "players" || Ve(d, s) !== "players" || Ve(d, h) !== "players"), T = !o && ((s == null ? void 0 : s.visibility) !== "players" || (h == null ? void 0 : h.visibility) !== "players");
    if (!i || a.visibility !== "players" || !s || !h || s.id === h.id || b || T || !g || g.visibility !== "players") return null;
    const x = v(), A = ft(P(), y.requesterId, x, a.travelApprovalMode), D = globalThis.setTimeout(() => {
      const J = _.get(y.requestId);
      J && be(J, { reason: "Travel request timed out." });
    }, Ln), ee = {
      action: "travel-ballot",
      requestId: String(y.requestId).slice(0, 80),
      mapId: a.id,
      mapTitle: a.title,
      travelScope: o ? "object" : "system",
      systemId: o ? d.id : "",
      fromSystemId: o ? d.id : s.id,
      fromObjectId: o ? s.id : "",
      fromName: s.name,
      toSystemId: o ? d.id : h.id,
      toObjectId: o ? h.id : "",
      toName: h.name,
      routeId: g.id,
      routeType: g.type,
      travelTime: g.travelTime,
      fuelCost: g.fuelCost,
      requesterId: i.id,
      requesterName: i.name,
      coordinatorId: game.user.id,
      ...A,
      accepted: /* @__PURE__ */ new Set(),
      declined: /* @__PURE__ */ new Set(),
      timeoutId: D
    };
    return _.set(y.requestId, ee), R(ee), ee;
  }
  function re(y) {
    const G = Y(t(y.mapId)), a = y.travelScope === "object", i = a ? G.systems.find((s) => s.id === y.systemId) : null, o = a ? i == null ? void 0 : i.objects.find((s) => s.id === y.fromObjectId) : G.systems.find((s) => s.id === y.fromSystemId), d = a ? i == null ? void 0 : i.objects.find((s) => s.id === y.toObjectId) : G.systems.find((s) => s.id === y.toSystemId);
    !o || !d || u(y.mapId).forEach((s) => {
      var g;
      const h = c(s);
      if (h) {
        if (a) {
          if (s.activeSystemId !== i.id) return;
          s.selectedObjectId = d.id;
        } else s.selectedSystemId = d.id;
        s.selectedRouteId = null, (g = s._animateShipTravel) == null || g.call(s, o, d, h);
      }
    });
  }
  const ie = (y, G, a) => {
    var i;
    return game.socket.emit(
      _e,
      { action: "travel-animation", mapId: y, fromSystemId: G, toSystemId: a, coordinatorId: (i = game.user) == null ? void 0 : i.id }
    );
  }, ne = (y, G, a, i) => {
    var o;
    return game.socket.emit(
      _e,
      { action: "travel-animation", travelScope: "object", mapId: y, systemId: G, fromObjectId: a, toObjectId: i, coordinatorId: (o = game.user) == null ? void 0 : o.id }
    );
  };
  function Se(y) {
    var G;
    _.delete(y.requestId), y.timeoutId && globalThis.clearTimeout(y.timeoutId), k.delete(y.requestId), (G = F.get(y.requestId)) == null || G.resolve(), F.delete(y.requestId), O.delete(y.requestId);
  }
  async function ve(y) {
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
    game.socket.emit(_e, G), re(G), m(`Travel approved: ${y.fromName} to ${y.toName}.`), globalThis.setTimeout(() => {
      y.travelScope === "object" ? r(y.mapId, y.systemId, y.toObjectId) : n(y.mapId, y.toSystemId);
    }, qt);
  }
  function be(y, { voterName: G = "", reason: a = "" } = {}) {
    Se(y);
    const i = a || `${G || "A participant"} declined the request.`, o = {
      action: "travel-declined",
      requestId: y.requestId,
      mapId: y.mapId,
      fromName: y.fromName,
      toName: y.toName,
      voterName: G,
      reason: i,
      coordinatorId: game.user.id
    };
    game.socket.emit(_e, o), m(`Travel cancelled: ${i}`);
  }
  function Pe(y) {
    if (!w() || !(y != null && y.requestId)) return;
    const G = _.get(y.requestId);
    if (!G || !G.voterIds.includes(y.userId) || G.accepted.has(y.userId) || G.declined.has(y.userId)) return;
    y.accepted ? G.accepted.add(y.userId) : G.declined.add(y.userId);
    const a = Zt(G);
    R(G), a.outcome === "approved" ? ve(G) : a.outcome === "declined" && be(G, {
      voterName: y.userName,
      reason: G.approvalMode === "unanimous" ? `${y.userName || "A participant"} declined the unanimous request.` : "The remaining votes cannot reach a majority."
    });
  }
  function $(y) {
    var G;
    y.requestId && k.delete(y.requestId), (G = F.get(y.requestId)) == null || G.resolve(), F.delete(y.requestId), O.delete(y.requestId);
  }
  function ye(y) {
    var G, a;
    !U(y) || y.coordinatorId === ((G = game.user) == null ? void 0 : G.id) || ($(y), re(y), (a = ui.notifications) == null || a.info(`Travel approved: ${y.fromName} to ${y.toName}.`));
  }
  function ke(y) {
    var G, a;
    !U(y) || y.coordinatorId === ((G = game.user) == null ? void 0 : G.id) || ($(y), (a = ui.notifications) == null || a.warn(`Travel cancelled: ${y.reason || `${y.voterName || "A participant"} declined.`}`));
  }
  return {
    getTravelRoute: C,
    requestTravelToSystem: V,
    requestTravelToObject: oe,
    promptForTravelRequest: L,
    isPrimaryGMMessage: U,
    handleTravelProgress: B,
    trackTravelRequest: te,
    animateTravelOnOpenMaps: re,
    broadcastTravelAnimation: ie,
    broadcastObjectTravelAnimation: ne,
    handleTravelVote: Pe,
    handleTravelApproved: ye,
    handleTravelDeclined: ke
  };
}
function Ss(e) {
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
          ${Array.from({ length: 4 }, (t, n) => `<span class="is-face-${n + 1}">Side ${n + 1}<br>upper</span>`).join("")}
          ${Array.from({ length: 4 }, (t, n) => `<span class="is-face-${n + 5}">Side ${n + 1}<br>lower</span>`).join("")}
          <i class="gmf-uv-grid-label is-columns">4 columns · 512px each</i>
        </div>
        <figcaption><strong>2048×1024 · 2:1</strong> Divide the image into four 512×512 columns. Each column is one continuous crystal side: its upper triangle sits directly above its matching lower triangle.</figcaption>
      </figure>
    </div>
  `;
}
let Ae = null;
const Ye = /* @__PURE__ */ new Map();
let de = null, Je = null;
function ci(e) {
  return foundry.utils.deepClone(e);
}
function Ge(e) {
  var t;
  (t = ui.notifications) == null || t.error(`[Galaxy Map] ${e}`);
}
function Xe(e) {
  var t;
  (t = ui.notifications) == null || t.info(`[Galaxy Map] ${e}`);
}
function At(e = "change galaxy maps") {
  var t;
  return (t = game.user) != null && t.isGM ? !0 : (Ge(`Only a GM can ${e}.`), !1);
}
function Di() {
  return game.users.filter((e) => e.active);
}
function Gi() {
  return Di().filter((e) => e.isGM).sort((e, t) => String(e.id).localeCompare(String(t.id)))[0] ?? null;
}
function Bi() {
  var e, t;
  return !!((e = game.user) != null && e.isGM && ((t = Gi()) == null ? void 0 : t.id) === game.user.id);
}
const {
  getMapStore: li,
  saveMapStore: di,
  getRawMap: tt,
  createMap: zi,
  updateMap: vs,
  updateMapMetadata: Hi,
  deleteMap: Vi,
  duplicateMap: Ui,
  upsertSystem: Yi,
  upsertObject: Xi,
  savePlanetLocation: Wi,
  removePlanetLocation: Ji,
  unlinkPlanetScene: Zi,
  deleteObject: Rt,
  moveObject: bs,
  setPrimaryObject: Is,
  saveObjectPosition: Ki,
  setObjectVisibility: Qi,
  deleteSystem: jt,
  setCurrentSystem: Ft,
  setCurrentObject: $t,
  upsertRoute: en,
  deleteRoute: Nt,
  upsertFaction: tn,
  deleteFaction: Dt,
  hideFactionFromPlayers: nn,
  saveSystemPosition: sn,
  revealSystemToPlayers: an,
  hideSystemFromPlayers: Gt,
  revealRouteToPlayers: rn,
  hideRouteFromPlayers: Bt,
  importMapData: on,
  exportMap: zt,
  getMaps: ut,
  getSystem: ws,
  getObject: Ms,
  getSceneIdsForSystem: _s,
  getSceneIdsForObject: Ls,
  getObjectsForScene: Ts,
  getSystemsForScene: Es,
  updateOpenPlanetLocations: xs
} = ys({ notifyError: Ge, notifyInfo: Xe, requireGM: At, refreshOpenApps: rt, closeOpenMap: Ds, getOpenMapViews: Ht });
function cn(e) {
  var n;
  const t = ln(e);
  return ((n = t == null ? void 0 : t.closest) == null ? void 0 : n.call(t, ".window-app, .application, .app")) ?? t;
}
function Ps(e) {
  return e.map((t) => {
    var u, c;
    const n = cn(t);
    if (!n) return null;
    const r = Number.parseInt(((c = (u = globalThis.getComputedStyle) == null ? void 0 : u.call(globalThis, n)) == null ? void 0 : c.zIndex) ?? "", 10);
    return { app: t, zIndex: n.style.zIndex || (Number.isFinite(r) ? String(r) : "") };
  }).filter(Boolean);
}
function yt(e) {
  for (const t of e) {
    const n = cn(t.app);
    !(n != null && n.isConnected) || !t.zIndex || (n.style.zIndex = t.zIndex);
  }
}
async function rt(e = null) {
  var c;
  const t = [...Ye.entries()].filter(([m, l]) => (l == null ? void 0 : l.rendered) && (!e || m === e)).map(([, m]) => m);
  de != null && de.rendered && (!e || de.mapId === e) && t.push(de);
  const n = [Ae != null && Ae.rendered ? Ae : null, ...t].filter(Boolean), r = Ps(n), u = n.map((m) => Promise.resolve(m.render({ force: !0 })));
  yt(r), await Promise.allSettled(u), yt(r), (c = globalThis.requestAnimationFrame) == null || c.call(globalThis, () => yt(r));
}
function Ht(e) {
  const t = [...Ye.values()];
  return de && t.push(de), t.filter((n) => (n == null ? void 0 : n.rendered) && n.mapId === e);
}
function ln(e) {
  return e.element ?? null;
}
const {
  getTravelRoute: ks,
  requestTravelToSystem: dn,
  requestTravelToObject: un,
  promptForTravelRequest: fi,
  isPrimaryGMMessage: qs,
  handleTravelProgress: Os,
  trackTravelRequest: Cs,
  animateTravelOnOpenMaps: As,
  broadcastTravelAnimation: Rs,
  broadcastObjectTravelAnimation: js,
  handleTravelVote: Fs,
  handleTravelApproved: $s,
  handleTravelDeclined: Ns
} = gs({
  getRawMap: tt,
  setCurrentSystem: Ft,
  setCurrentObject: $t,
  getOpenMapViews: Ht,
  getAppHtml: ln,
  notifyInfo: Xe,
  notifyError: Ge,
  getActiveUsers: Di,
  getPrimaryGM: Gi,
  isPrimaryGM: Bi
});
function Ds(e) {
  const t = Ye.get(e);
  t && t.close(), (de == null ? void 0 : de.mapId) === e && de.close();
}
function Be(e, t = {}) {
  var l;
  const n = tt(e);
  if (!n)
    return Ge(`Map "${e}" was not found.`), null;
  const r = !((l = game.user) != null && l.isGM) || t.playerMode === !0;
  if (r && n.visibility !== "players" && !t.broadcast)
    return Ge("That galaxy map is not visible to players."), null;
  const u = r ? `player:${e}` : e, c = r && (de == null ? void 0 : de.mapId) === e ? de : Ye.get(u);
  if (c != null && c.rendered)
    return c.bringToFront(), c;
  const m = new Ys({ mapId: e, playerMode: r });
  return r ? de = m : Ye.set(u, m), m.render({ force: !0 }), m;
}
async function Gs(e, t, n = {}) {
  var u;
  if (!e || !t) return !1;
  const r = Be(e, {
    playerMode: n.playerMode ?? !((u = game.user) != null && u.isGM),
    broadcast: n.broadcast === !0
  });
  return r != null && r.focusSystem ? r.focusSystem(t, n) : !1;
}
async function Bs(e, t = {}, n = {}) {
  var m, l;
  const r = String(t.systemId || ""), u = String(t.objectId || "");
  if (!e || !r) return !1;
  const c = Be(e, { playerMode: n.playerMode ?? !((m = game.user) != null && m.isGM), broadcast: n.broadcast === !0 });
  return c ? u && c.focusLocation ? c.focusLocation(r, u, n) : (l = c.focusSystem) == null ? void 0 : l.call(c, r, n) : !1;
}
function zs(e, t = "") {
  var r;
  let n = !1;
  for (const u of Ht(e))
    n = ((r = u.clearSystemFocus) == null ? void 0 : r.call(u, t)) || n;
  return n;
}
function Vt() {
  return At("open the map manager") ? (Ae || (Ae = new Vs()), Ae.render({ force: !0 }), Ae) : null;
}
function Ut() {
  const e = fn();
  return e.length ? e.length === 1 ? Be(e[0].id, { playerMode: !0 }) : (Je || (Je = new Us()), Je.render({ force: !0 }), Je) : (Xe("No galaxy map is currently visible to players."), null);
}
function fn() {
  return ut().filter((e) => e.visibility === "players").sort((e, t) => e.title.localeCompare(t.title));
}
function Hs() {
  var t;
  const e = ut().sort((n, r) => n.title.localeCompare(r.title));
  return (t = game.user) != null && t.isGM ? e.length === 1 ? Be(e[0].id) : Vt() : Ut();
}
function mn(e) {
  if (At("broadcast galaxy maps")) {
    if (!tt(e)) {
      Ge(`Map "${e}" was not found.`);
      return;
    }
    game.socket.emit(_e, { action: "open", mapId: e }), Xe("Map broadcast sent to players.");
  }
}
const Vs = Bn({
  templateRoot: Oe,
  getMaps: ut,
  prepareMapForManager: ps,
  getRawMap: tt,
  importMapData: on,
  exportMap: zt,
  duplicateMap: Ui,
  deleteMap: Vi,
  createMap: zi,
  deleteSystem: jt,
  deleteObject: Rt,
  deleteRoute: Nt,
  deleteFaction: Dt,
  openMap: Be,
  showMapToPlayers: mn,
  hideSystemFromPlayers: Gt,
  hideRouteFromPlayers: Bt,
  hideFactionFromPlayers: nn,
  notifyError: Ge,
  clearManagerApp: (e) => {
    Ae === e && (Ae = null);
  }
}), Us = cs({
  templateRoot: Oe,
  getVisibleMaps: fn,
  openMap: Be,
  clearChooser: (e) => {
    Je === e && (Je = null);
  }
}), Ys = os({
  templateRoot: Oe,
  getRawMap: tt,
  prepareMapForDisplay: ms,
  upsertSystem: Yi,
  upsertObject: Xi,
  upsertRoute: en,
  upsertFaction: tn,
  updateMapMetadata: Hi,
  deleteFaction: Dt,
  getTextureGuideMarkup: Ss,
  activateObjectEditorControls: hs,
  revealSystemToPlayers: an,
  revealRouteToPlayers: rn,
  hideSystemFromPlayers: Gt,
  setObjectVisibility: Qi,
  hideRouteFromPlayers: Bt,
  deleteSystem: jt,
  deleteObject: Rt,
  deleteRoute: Nt,
  setCurrentSystem: Ft,
  setCurrentObject: $t,
  requestTravelToSystem: dn,
  requestTravelToObject: un,
  exportMap: zt,
  getTravelRoute: ks,
  broadcastTravelAnimation: Rs,
  broadcastObjectTravelAnimation: js,
  notifyInfo: Xe,
  notifyError: Ge,
  saveSystemPosition: sn,
  saveObjectPosition: Ki,
  savePlanetLocation: Wi,
  removePlanetLocation: Ji,
  unlinkPlanetScene: Zi,
  clearMapView: (e) => {
    e.playerMode && de === e && (de = null);
    for (const [t, n] of Ye.entries())
      n === e && Ye.delete(t);
  }
});
function Xs() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    brandingInApp: !0,
    id: he,
    title: "Galaxy Map",
    icon: "fa-solid fa-route",
    premium: !1,
    description: "Open cinematic campaign maps and navigation charts.",
    open: () => {
      var n;
      return (n = game.user) != null && n.isGM ? Vt() : Ut();
    }
  }), !0) : !1;
}
Hooks.once("init", async () => {
  game.settings.register(he, Ai, {
    name: "Enable Factions",
    hint: "Show faction controls, ratings, and territories on galaxy maps. Turning this off keeps existing faction data.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0,
    requiresReload: !0,
    onChange: () => rt()
  });
  for (const e of ["reputation", "prominence"]) {
    const { setting: t, title: n, icon: r } = dt[e];
    game.settings.register(he, t, {
      scope: "world",
      config: !1,
      type: Object,
      default: { ratings: Ri(e) },
      onChange: () => rt()
    }), De() && game.settings.registerMenu(he, `faction${n}`, {
      name: `Faction ${n}`,
      label: `Edit ${n} Ratings`,
      hint: `Rename, add, or remove the ${e} ratings available on galaxy maps in this world.`,
      icon: r,
      type: ls(Oe, e),
      restricted: !0
    });
  }
  game.settings.register(he, wt, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(he, at, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(he, Mt, {
    scope: "world",
    config: !1,
    type: Boolean,
    default: !1
  }), Handlebars.registerHelper("gmfEq", (e, t) => e === t), Handlebars.registerHelper("gmfJson", (e) => JSON.stringify(e, null, 2)), Handlebars.registerHelper("gmfPercent", (e) => `${Number(e).toFixed(3)}%`), Handlebars.registerHelper("gmfFallback", (e, t) => e || t), Hooks.on("renderDialog", (e, t) => {
    var u, c;
    const n = ji(t), r = ((u = n == null ? void 0 : n.closest) == null ? void 0 : u.call(n, ".window-app, .application, .app")) ?? n;
    (c = r == null ? void 0 : r.classList) != null && c.contains("galaxy-map") && jn(e, t);
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
    openMap: Be,
    focusSystem: Gs,
    focusLocation: Bs,
    clearSystemFocus: zs,
    openMapManager: Vt,
    openGalaxyMapFromSceneControls: Hs,
    openPlayerMapChooser: Ut,
    createMap: zi,
    getMaps: ut,
    getSystem: ws,
    getObject: Ms,
    getSceneIdsForSystem: _s,
    getSystemsForScene: Es,
    getSceneIdsForObject: Ls,
    getObjectsForScene: Ts,
    showMapToPlayers: mn,
    updateMap: vs,
    updateMapMetadata: Hi,
    deleteMap: Vi,
    duplicateMap: Ui,
    upsertSystem: Yi,
    deleteSystem: jt,
    upsertObject: Xi,
    deleteObject: Rt,
    moveObject: bs,
    setPrimaryObject: Is,
    upsertRoute: en,
    deleteRoute: Nt,
    upsertFaction: tn,
    deleteFaction: Dt,
    saveSystemPosition: sn,
    saveObjectPosition: Ki,
    savePlanetLocation: Wi,
    removePlanetLocation: Ji,
    unlinkPlanetScene: Zi,
    setCurrentSystem: Ft,
    setCurrentObject: $t,
    revealSystemToPlayers: an,
    revealRouteToPlayers: rn,
    hideSystemFromPlayers: Gt,
    setObjectVisibility: Qi,
    hideRouteFromPlayers: Bt,
    hideFactionFromPlayers: nn,
    requestTravelToSystem: dn,
    requestTravelToObject: un,
    importMapData: on,
    exportMap: zt
  };
  const e = game.modules.get(he);
  if (e && (e.api = game.galaxyMap), Xs(), Bi()) {
    const t = li();
    if (Object.values(t).some((r) => Number((r == null ? void 0 : r.schemaVersion) || 1) < je)) {
      const r = ci(game.settings.get(he, at) ?? {});
      Object.keys(r).length || await game.settings.set(he, at, t);
      const u = Object.fromEntries(Object.entries(t).map(([c, m]) => [c, Y(m)]));
      await di(u), Xe('Your galaxy maps were updated to the new format. Everything from the old single map is now inside a system called "System 1", and a backup of the old data was kept.');
    }
    if (!game.settings.get(he, Mt)) {
      const r = ci(game.settings.get(he, at) ?? {}), u = li();
      let c = 0;
      for (const [m, l] of Object.entries(r)) {
        if (!u[m]) continue;
        const P = Y(u[m]);
        for (const v of (l == null ? void 0 : l.systems) ?? []) {
          const w = Ti(v == null ? void 0 : v.planetLocations);
          if (!w.length) continue;
          const _ = P.systems.flatMap((k) => k.objects).find((k) => k.id === v.id || k.id === `${v.id}-object`);
          !_ || _.planetLocations.length || (_.planetLocations = w.filter((k) => _.sceneIds.includes(k.sceneId)), c += _.planetLocations.length);
        }
        u[m] = Y(P);
      }
      c && (await di(u), Xe(`Restored ${c} surface location${c === 1 ? "" : "s"} that went missing in an earlier update.`)), await game.settings.set(he, Mt, !0);
    }
  }
  game.socket.on(_e, (t = {}) => {
    var n, r, u, c, m;
    if (t.action === "travel-request") {
      const l = Cs(t);
      l && (game.socket.emit(_e, l), fi(l));
      return;
    }
    if (t.action === "travel-ballot") {
      qs(t) && t.coordinatorId !== ((n = game.user) == null ? void 0 : n.id) && fi(t);
      return;
    }
    if (t.action === "travel-vote") {
      Fs(t);
      return;
    }
    if (t.action === "travel-progress") {
      Os(t);
      return;
    }
    if (t.action === "travel-approved") {
      $s(t);
      return;
    }
    if (t.action === "travel-declined") {
      Ns(t);
      return;
    }
    if (t.action === "travel-animation") {
      t.coordinatorId !== ((r = game.user) == null ? void 0 : r.id) && As(t);
      return;
    }
    if (t.action === "planet-locations") {
      xs(t.mapId, t.systemId, t.objectId);
      return;
    }
    if (t.action === "refresh") {
      (u = game.user) != null && u.isGM ? rt(t.mapId) : (de == null ? void 0 : de.mapId) === t.mapId && de.render({ force: !0 });
      return;
    }
    (c = game.user) != null && c.isGM || (t.action === "open" && t.mapId && (de == null || de.close(), Be(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "notify" && ((m = ui.notifications) == null || m.info(t.message || "New system discovered."), (de == null ? void 0 : de.mapId) === t.mapId && de.render({ force: !0 })));
  }), console.log(`${he} | Ready. API available at game.galaxyMap.`);
});
