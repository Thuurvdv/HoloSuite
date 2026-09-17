var hs = Object.defineProperty;
var gs = (n, d, f) => d in n ? hs(n, d, { enumerable: !0, configurable: !0, writable: !0, value: f }) : n[d] = f;
var te = (n, d, f) => gs(n, typeof d != "symbol" ? d + "" : d, f);
const zt = [
  { value: "cartoon", label: "Cartoon · Acid Seas", color: "#af91ff" },
  { value: "adventure", label: "Painterly · Golden Frontier", color: "#69e7dc" },
  { value: "realistic", label: "Realistic · Blue Marble", color: "#78caff" }
], qn = [
  { value: "auto", label: "Automatic texture" },
  ...zt,
  { value: "color", label: "Flat color" },
  { value: "custom", label: "Custom texture" },
  { value: "none", label: "No detail view" }
], Tn = [
  { value: "sphere", label: "Sphere" },
  { value: "cube", label: "Cube" },
  { value: "donut", label: "Donut" },
  { value: "asteroid", label: "Asteroid" },
  { value: "crystal", label: "Crystal" },
  { value: "cylinder", label: "Cylinder" }
], $n = [
  { value: "smooth", label: "Smooth" },
  { value: "matte", label: "Matte" },
  { value: "holographic", label: "Holographic" }
];
function on(n) {
  return Tn.some((d) => d.value === n) ? String(n) : "sphere";
}
function Cn(n) {
  return $n.some((d) => d.value === n) ? String(n) : "smooth";
}
function An(n) {
  return qn.some((d) => d.value === n) ? String(n) : "auto";
}
function dt(n, d = "") {
  if (!n || n.obscured || n.planetPreset === "none") return null;
  const f = An(n.planetPreset), g = zt.find((b) => b.value === d) ?? zt.find((b) => b.value === f) ?? zt[0], I = !d && f === "custom" && !!n.planetTexture, S = !d && f === "color";
  return {
    texture: S ? null : I ? n.planetTexture : `modules/galaxy-map/assets/planets/${g.value}.png`,
    label: S ? "Flat color" : I ? "Custom texture" : g.label,
    color: S ? n.planetColor || "#58d8ff" : g.color,
    shape: on(n.planetShape),
    finish: Cn(n.planetFinish),
    detailStrength: Math.min(100, Math.max(0, Number(n.planetDetailStrength) || 0))
  };
}
const Vt = [
  { value: "gm", label: "GM approval" },
  { value: "majority", label: "Majority vote" },
  { value: "unanimous", label: "Unanimous agreement" }
];
function ln(n) {
  return Vt.some((d) => d.value === n) ? String(n) : "unanimous";
}
function wn(n, d, f, g) {
  const I = ln(g), S = [...new Map((n ?? []).filter((q) => q == null ? void 0 : q.id).map((q) => [String(q.id), q])).values()], b = I === "gm" ? f != null && f.id ? [f] : [] : S.filter((q) => String(q.id) !== String(d)), y = b.map((q) => String(q.id)), L = Object.fromEntries(b.map((q) => [String(q.id), String(q.name || "Navigator").slice(0, 80)])), x = y.length + (I === "gm" ? 0 : 1), v = I === "gm" ? 1 : I === "majority" ? Math.floor(x / 2) + 1 : x;
  return { approvalMode: I, voterIds: y, voterNames: L, participantCount: x, requiredApprovals: v };
}
function Ln(n) {
  const d = ln(n == null ? void 0 : n.approvalMode), f = [...new Set(((n == null ? void 0 : n.voterIds) ?? []).map(String))], g = new Set([...(n == null ? void 0 : n.accepted) ?? []].map(String)), I = new Set([...(n == null ? void 0 : n.declined) ?? []].map(String)), S = d === "gm" ? 0 : 1, b = Math.max(1, Number(n == null ? void 0 : n.requiredApprovals) || (d === "unanimous" ? f.length + 1 : 1)), y = S + f.filter((v) => g.has(v)).length, L = f.filter((v) => I.has(v)).length, x = f.filter((v) => !g.has(v) && !I.has(v));
  return y >= b ? { outcome: "approved", acceptedCount: y, declinedCount: L, required: b, pendingIds: x } : d === "unanimous" && L > 0 ? { outcome: "declined", acceptedCount: y, declinedCount: L, required: b, pendingIds: x } : y + x.length < b ? { outcome: "declined", acceptedCount: y, declinedCount: L, required: b, pendingIds: x } : { outcome: "pending", acceptedCount: y, declinedCount: L, required: b, pendingIds: x };
}
const tt = 3, Ss = ["core", "colony", "frontier", "ruins", "restricted", "unknown"], Pn = ["star", "planet", "moon", "station", "asteroid", "anomaly", "black-hole", "other"], Tt = ["undiscovered", "known", "visited", "danger", "locked"], jn = ["safe", "dangerous", "restricted", "smuggler", "unknown"], ut = ["gm", "players"], nn = ["inherit", ...ut], On = [
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
], Dn = On.map((n) => n.value), sn = ["planet", "terrestrial", "gas-giant", "ice-world", "volcanic", "artificial", "ringed", "star", "black-hole", "station"], Qt = 1, Kt = 2, Rn = 2400, vs = 6e4;
function Ae(n = "gmf") {
  return `${n}-${foundry.utils.randomID(10)}`;
}
function Ct(n, d = "players") {
  const f = ut.includes(d) ? d : "players";
  return ut.includes(n) ? String(n) : f;
}
function bs(n) {
  return nn.includes(n) ? String(n) : "inherit";
}
function Is(n) {
  return typeof n == "string" && /^#[0-9a-f]{6}$/i.test(n) ? n : "#58d8ff";
}
function an(n) {
  return typeof n == "string" && /^#[0-9a-f]{6}$/i.test(n) ? n : "";
}
function Re(n, d = 0) {
  const f = Number(n);
  return Number.isFinite(f) ? f : d;
}
function ws(n) {
  const d = Array.isArray(n) ? n : n ? [n] : [];
  return [...new Set(d.map((f) => String(f).trim()).filter(Boolean))];
}
function ge(n, d, f) {
  return Math.min(f, Math.max(d, n));
}
function Mn(n, d) {
  return !Array.isArray(n) || n.length < 3 ? [...d] : n.slice(0, 3).map((f, g) => ge(Re(f, d[g]), -2.5, 2.5));
}
function Fn(n = {}) {
  const d = Mn(n.normal, [0, 0, 1]), f = Math.hypot(...d) || 1;
  return {
    id: String(n.id || Ae("location")),
    sceneId: String(n.sceneId || "").trim(),
    shape: on(n.shape),
    position: Mn(n.position, [0, 0, 1]),
    normal: d.map((g) => g / f),
    surfaceVersion: 1
  };
}
function Nn(n) {
  const d = /* @__PURE__ */ new Set();
  return (Array.isArray(n) ? n : []).slice(0, 64).map(Fn).filter((f) => {
    const g = `${f.sceneId}:${f.shape}`;
    return !f.sceneId || d.has(g) ? !1 : (d.add(g), !0);
  });
}
function Bn(n = {}) {
  return Pn.includes(n.kind) ? n.kind : n.type === "station" || n.iconStyle === "station" ? "station" : n.type === "anomaly" ? "anomaly" : n.iconStyle === "star" ? "star" : n.iconStyle === "black-hole" ? "black-hole" : n.planetShape === "asteroid" ? "asteroid" : ["planet", "terrestrial", "gas-giant", "ice-world", "volcanic", "artificial", "ringed"].includes(n.iconStyle) ? "planet" : "other";
}
function $t(n = {}) {
  const d = ws(n.sceneIds === void 0 ? n.sceneId : n.sceneIds), f = String(n.planetTexture || "").trim(), g = An(n.planetPreset), I = f && !["none", "color"].includes(g) ? "custom" : g, S = Bn(n);
  return {
    id: String(n.id || Ae("object")),
    name: String(n.name || "Unnamed Object"),
    kind: S,
    x: ge(Re(n.x, 50), 0, 100),
    y: ge(Re(n.y, 50), 0, 100),
    status: Tt.includes(n.status) ? n.status : "known",
    visibility: bs(n.visibility),
    factionId: String(n.factionId || ""),
    description: String(n.description || ""),
    image: String(n.image || ""),
    sceneIds: d,
    planetLocations: Nn(n.planetLocations).filter((y) => d.includes(y.sceneId)),
    journalId: String(n.journalId || ""),
    notes: String(n.notes || ""),
    iconColor: an(n.iconColor),
    iconSize: ge(Re(n.iconSize, 28), 18, 56),
    iconStyle: Dn.includes(n.iconStyle) ? n.iconStyle : S === "star" ? "star" : S === "station" ? "station" : "planet",
    pulse: n.pulse !== !1,
    planetPreset: I,
    planetShape: on(n.planetShape),
    planetFinish: Cn(n.planetFinish),
    planetDetailStrength: ge(Re(n.planetDetailStrength, 45), 0, 100),
    planetTexture: f,
    planetColor: an(n.planetColor) || "#58d8ff"
  };
}
function qt(n = {}) {
  var y;
  const d = Array.isArray(n.objects) ? n.objects.map($t) : [], f = new Set(d.map((L) => L.id)), g = (Array.isArray(n.routes) ? n.routes : []).map(Ht).filter((L) => L.fromSystemId !== L.toSystemId && f.has(L.fromSystemId) && f.has(L.toSystemId)), I = d.some((L) => L.id === n.primaryObjectId) ? String(n.primaryObjectId) : ((y = d[0]) == null ? void 0 : y.id) ?? "", S = d.find((L) => L.id === I) ?? $t(n), b = {
    id: String(n.id || Ae("system")),
    name: String(n.name || "Unnamed System"),
    x: ge(Re(n.x, 50), 0, 100),
    y: ge(Re(n.y, 50), 0, 100),
    type: Ss.includes(n.type) ? n.type : "unknown",
    factionId: String(n.factionId || ""),
    status: Tt.includes(n.status) ? n.status : "known",
    description: String(n.description || ""),
    visibility: Ct(n.visibility, "players"),
    notes: String(n.notes || ""),
    iconColor: an(n.iconColor),
    iconSize: ge(Re(n.iconSize, 30), 18, 56),
    iconStyle: Dn.includes(n.iconStyle) ? n.iconStyle : "star",
    pulse: n.pulse !== !1,
    primaryObjectId: I,
    objects: d,
    routes: g
  };
  for (const [L, x] of Object.entries({
    image: S.image,
    sceneIds: [...S.sceneIds],
    planetLocations: [...S.planetLocations],
    journalId: S.journalId,
    planetPreset: S.planetPreset,
    planetShape: S.planetShape,
    planetFinish: S.planetFinish,
    planetDetailStrength: S.planetDetailStrength,
    planetTexture: S.planetTexture,
    planetColor: S.planetColor
  })) Object.defineProperty(b, L, { value: x, enumerable: !1, configurable: !0 });
  return b;
}
function Ht(n = {}) {
  return {
    id: String(n.id || Ae("route")),
    fromSystemId: String(n.fromSystemId || ""),
    toSystemId: String(n.toSystemId || ""),
    type: jn.includes(n.type) ? n.type : "unknown",
    travelTime: String(n.travelTime || ""),
    fuelCost: Re(n.fuelCost, 0),
    visibility: Ct(n.visibility, "players"),
    notes: String(n.notes || "")
  };
}
function rn(n = {}) {
  return {
    id: String(n.id || Ae("faction")),
    name: String(n.name || "Unaffiliated"),
    color: Is(n.color),
    description: String(n.description || ""),
    visibility: Ct(n.visibility, "players")
  };
}
function cn(n = {}) {
  return `${String(n.id || "galaxy")}-system-1`;
}
function Ls(n = {}) {
  const d = String(n.id || n.objectId || Ae("object")), f = Bn(n);
  return {
    ...n,
    id: d,
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
function Gn(n, d, f = "", g = cn(n), I = []) {
  var b;
  const S = d.some((y) => y.id === f) ? f : ((b = d[0]) == null ? void 0 : b.id) ?? "";
  return {
    id: g,
    name: "System 1",
    x: 50,
    y: 50,
    type: "core",
    factionId: "",
    status: "known",
    description: "",
    visibility: Ct(n.visibility, "players"),
    notes: "",
    iconColor: "",
    iconSize: 30,
    iconStyle: "star",
    pulse: !0,
    primaryObjectId: S,
    objects: d,
    routes: I
  };
}
function Ms(n, d) {
  var b;
  const g = (Array.isArray(n.systems) ? n.systems : []).map(Ls), I = String(n.currentSystemId || ((b = g[0]) == null ? void 0 : b.id) || ""), S = Gn(n, g, I, cn(n), Array.isArray(n.routes) ? n.routes : []);
  return {
    ...n,
    schemaVersion: tt,
    migratedFromSchema: d,
    systems: [S],
    routes: [],
    currentLocation: { systemId: S.id, objectId: S.primaryObjectId },
    currentSystemId: S.id
  };
}
function kn(n) {
  return !!(n != null && n.id && (n == null ? void 0 : n.primaryObjectId) === `${n.id}-object` && Array.isArray(n.objects) && n.objects.some((d) => d.id === n.primaryObjectId));
}
function ks(n) {
  var Pe, je, Oe, Ee;
  const d = Array.isArray(n.systems) ? n.systems : [], f = d.filter(kn), g = d.filter((z) => !kn(z));
  if (!f.length && d.length) return { ...n, schemaVersion: tt };
  const I = new Set(g.map((z) => String(z.id)));
  let S = cn(n);
  I.has(S) && (S = `${S}-legacy`);
  const b = new Set(f.map((z) => String(z.id))), y = new Map(f.map((z) => [String(z.id), String(z.primaryObjectId)])), L = f.flatMap((z) => (z.objects ?? []).map((F) => {
    const se = F.id === z.primaryObjectId;
    return {
      ...F,
      x: se ? z.x : F.x,
      y: se ? z.y : F.y,
      visibility: F.visibility === "inherit" ? z.visibility : F.visibility,
      factionId: F.factionId || z.factionId || ""
    };
  })), x = String(((Pe = n.currentLocation) == null ? void 0 : Pe.systemId) || n.currentSystemId || ""), v = f.find((z) => z.id === x), q = String(((je = n.currentLocation) == null ? void 0 : je.objectId) || (v == null ? void 0 : v.primaryObjectId) || ((Oe = L[0]) == null ? void 0 : Oe.id) || ""), D = Array.isArray(n.routes) ? n.routes : [], re = D.filter((z) => b.has(String(z.fromSystemId)) && b.has(String(z.toSystemId))).map((z) => ({ ...z, fromSystemId: y.get(String(z.fromSystemId)), toSystemId: y.get(String(z.toSystemId)) })), ne = Gn(n, L, q, S, re), X = [ne, ...g], J = new Set(X.map((z) => String(z.id))), be = /* @__PURE__ */ new Set(), Le = D.filter((z) => !(b.has(String(z.fromSystemId)) && b.has(String(z.toSystemId)))).map((z) => ({
    ...z,
    fromSystemId: b.has(String(z.fromSystemId)) ? S : z.fromSystemId,
    toSystemId: b.has(String(z.toSystemId)) ? S : z.toSystemId
  })).filter((z) => {
    if (z.fromSystemId === z.toSystemId || !J.has(String(z.fromSystemId)) || !J.has(String(z.toSystemId))) return !1;
    const F = [z.fromSystemId, z.toSystemId].sort().join(":");
    return be.has(F) ? !1 : (be.add(F), !0);
  }), Z = b.has(x) || !J.has(x) ? S : x;
  return {
    ...n,
    schemaVersion: tt,
    migratedFromSchema: 2,
    systems: X,
    routes: Le,
    currentLocation: { systemId: Z, objectId: Z === S ? ne.primaryObjectId : ((Ee = n.currentLocation) == null ? void 0 : Ee.objectId) ?? "" },
    currentSystemId: Z
  };
}
function xs(n = {}) {
  const d = Number(n.schemaVersion) || 1;
  if (d > tt) throw new Error(`Galaxy Map schema ${d} is newer than supported schema ${tt}.`);
  return d >= tt ? { ...n, schemaVersion: tt } : d < 2 ? Ms(n, d) : ks(n);
}
function P(n = {}) {
  var v, q, D, re;
  const d = xs(n), f = Array.isArray(d.systems) ? d.systems.map(qt) : [], g = Array.isArray(d.routes) ? d.routes.map(Ht) : [], I = Array.isArray(d.factions) ? d.factions.map(rn) : [], S = String(((v = d.currentLocation) == null ? void 0 : v.systemId) || d.currentSystemId || ((q = f[0]) == null ? void 0 : q.id) || ""), b = f.some((ne) => ne.id === S) ? S : ((D = f[0]) == null ? void 0 : D.id) ?? "", y = f.find((ne) => ne.id === b), L = String(((re = d.currentLocation) == null ? void 0 : re.objectId) || ""), x = y != null && y.objects.some((ne) => ne.id === L) ? L : (y == null ? void 0 : y.primaryObjectId) ?? "";
  return {
    schemaVersion: tt,
    id: String(d.id || Ae("map")),
    title: String(d.title || "Untitled Galaxy Map"),
    subtitle: String(d.subtitle || ""),
    description: String(d.description || ""),
    backgroundImage: String(d.backgroundImage || ""),
    visibility: Ct(d.visibility, "players"),
    travelApprovalMode: ln(d.travelApprovalMode),
    currentLocation: { systemId: b, objectId: x },
    currentSystemId: b,
    systems: f,
    routes: g,
    factions: I
  };
}
function Ft(n, d) {
  return (d == null ? void 0 : d.visibility) === "inherit" ? (n == null ? void 0 : n.visibility) ?? "gm" : (d == null ? void 0 : d.visibility) ?? "gm";
}
const Es = "/modules/galaxy-map/assets/frames/galaxy-frame-cyan.svg";
let xn = null;
const En = /* @__PURE__ */ new Map();
let Nt = null;
const Bt = {
  default: { primary: "#69e8ff", success: "#62ffb6", background: "#03070b" },
  ember: { primary: "#ffb86b", success: "#ffe08a", background: "#0d0604" },
  violet: { primary: "#a9b8ff", success: "#7dffc4", background: "#070713" },
  "space-police": { primary: "#fff15a", success: "#9fffd1", background: "#020202" },
  red: { primary: "#ff304f", success: "#66ffc7", background: "#050103" },
  corporate: { primary: "#147dba", success: "#21875c", background: "#dce3e6" }
};
function _n(n, d, f) {
  const g = (b) => [1, 3, 5].map((y) => Number.parseInt(b.slice(y, y + 2), 16)), I = g(n), S = g(d);
  return `rgb(${I.map((b, y) => Math.round(b * f + S[y] * (1 - f))).join(", ")})`;
}
function _s() {
  var g, I, S, b, y, L;
  const n = document.documentElement, d = ((g = n == null ? void 0 : n.dataset) == null ? void 0 : g.holosuiteDeviceStyle) || ((S = (I = document.body) == null ? void 0 : I.dataset) == null ? void 0 : S.holosuiteDeviceStyle) || "";
  if (Bt[d]) return Bt[d];
  const f = ((b = n == null ? void 0 : n.dataset) == null ? void 0 : b.holosuiteTheme) || ((L = (y = document.body) == null ? void 0 : y.dataset) == null ? void 0 : L.holosuiteTheme) || "default";
  return Bt[f] ?? Bt.default;
}
async function zn(n) {
  const { primary: d, success: f, background: g } = _s(), I = _n(d, g, 0.58), S = _n(d, g, 0.34), b = [d, f, I, S, g].join("|");
  n.dataset.gmfFramePalette = b;
  let y = En.get(b);
  if (!y)
    try {
      xn ?? (xn = fetch(Es).then((v) => {
        if (!v.ok) throw new Error(`Galaxy frame request failed (${v.status})`);
        return v.text();
      }));
      let L = await xn;
      L = L.replace(/<script\b[\s\S]*?<\/script>/gi, "");
      const x = /* @__PURE__ */ new Map([
        ["#18ebed", d],
        ["#28f3f5", d],
        ["#3be8e4", d],
        ["#64f4f1", f],
        ["#1490ab", I],
        ["#22788b", S],
        ["#042228", g]
      ]);
      for (const [v, q] of x) L = L.replace(new RegExp(v, "gi"), q);
      y = URL.createObjectURL(new Blob([L], { type: "image/svg+xml" })), En.set(b, y);
    } catch {
      return;
    }
  n.isConnected && n.dataset.gmfFramePalette === b && n.style.setProperty("--gmf-frame-image", `url("${y}")`);
}
function qs() {
  if (Nt || typeof MutationObserver > "u") return;
  Nt = new MutationObserver(() => {
    document.querySelectorAll(".gmf-manager-window, .gmf-map-window, .gmf-crud-dialog").forEach((d) => void zn(d));
  });
  const n = { attributes: !0, attributeFilter: ["data-holosuite-theme", "data-holosuite-device-style"] };
  Nt.observe(document.documentElement, n), document.body && Nt.observe(document.body, n);
}
function Vn(n) {
  return n instanceof HTMLElement ? n : (n == null ? void 0 : n[0]) instanceof HTMLElement ? n[0] : null;
}
function Hn(n) {
  var d, f;
  return n ? (d = n.matches) != null && d.call(n, ".window-app, .application, .app") ? n : (f = n.closest) == null ? void 0 : f.call(n, ".window-app, .application, .app") : null;
}
function dn(n, d) {
  var S, b;
  const f = Vn(d), g = Hn(f);
  g && (qs(), zn(g));
  const I = Array.from(((S = f == null ? void 0 : f.querySelectorAll) == null ? void 0 : S.call(f, "[data-gmf-window-drag]")) ?? []);
  if (!(!f || !g || !I.length)) {
    (b = f.querySelectorAll) == null || b.call(f, "[data-action='close-window']").forEach((y) => {
      y.dataset.gmfCloseBound !== "true" && (y.dataset.gmfCloseBound = "true", y.addEventListener("click", () => {
        var L;
        return (L = n.close) == null ? void 0 : L.call(n);
      }));
    });
    for (const y of I)
      y.dataset.gmfDragBound !== "true" && (y.dataset.gmfDragBound = "true", y.addEventListener("pointerdown", (L) => {
        var be, Le, Z;
        if (L.button !== 0) return;
        const x = L.target;
        if ((be = x == null ? void 0 : x.closest) != null && be.call(x, "button, input, select, textarea, a, [data-action]")) return;
        const v = g.getBoundingClientRect(), q = L.clientX, D = L.clientY, re = v.left, ne = v.top;
        (Le = n.bringToTop) == null || Le.call(n), (Z = y.setPointerCapture) == null || Z.call(y, L.pointerId), y.classList.add("is-dragging");
        const X = (Pe) => {
          var F;
          const je = g.getBoundingClientRect().width, Oe = g.getBoundingClientRect().height, Ee = Math.max(0, Math.min(window.innerWidth - Math.min(je, 80), re + Pe.clientX - q)), z = Math.max(0, Math.min(window.innerHeight - Math.min(Oe, 48), ne + Pe.clientY - D));
          (F = n.setPosition) == null || F.call(n, { left: Ee, top: z });
        }, J = () => {
          y.classList.remove("is-dragging"), y.removeEventListener("pointermove", X), y.removeEventListener("pointerup", J), y.removeEventListener("pointercancel", J);
        };
        y.addEventListener("pointermove", X), y.addEventListener("pointerup", J), y.addEventListener("pointercancel", J);
      }));
  }
}
function Ts(n, d) {
  var x, v;
  const f = Vn(d), g = Hn(f), I = (x = g == null ? void 0 : g.querySelector) == null ? void 0 : x.call(g, ":scope > .window-content");
  if (!f || !g || !I || I.querySelector(":scope > .gmf-dialog-header")) return;
  const S = document.createElement("header");
  S.className = "gmf-dialog-header", S.dataset.gmfWindowDrag = "true";
  const b = document.createElement("div");
  b.className = "gmf-dialog-header__identity", b.innerHTML = '<span class="gmf-dialog-header__orb"><i class="fa-solid fa-satellite"></i></span><span><small>GALAXY MAP // CONTROL PANEL</small><strong></strong></span>';
  const y = b.querySelector("strong");
  y && (y.textContent = (n == null ? void 0 : n.title) || ((v = g.querySelector(".window-title")) == null ? void 0 : v.textContent) || "Galaxy Map");
  const L = document.createElement("button");
  L.type = "button", L.className = "gmf-window-close", L.dataset.action = "close-window", L.title = "Close", L.setAttribute("aria-label", "Close window"), L.innerHTML = '<i class="fa-solid fa-xmark"></i>', S.append(b, L), I.prepend(S), dn(n, g);
}
const wt = {
  classes: ["galaxy-map", "gmf-crud-dialog"]
};
function $s() {
  var f, g, I, S;
  const n = (g = (f = foundry.applications) == null ? void 0 : f.api) == null ? void 0 : g.ApplicationV2, d = (S = (I = foundry.applications) == null ? void 0 : I.api) == null ? void 0 : S.HandlebarsApplicationMixin;
  return n && d ? d(n) : Application;
}
function Cs(n) {
  var oe;
  const {
    templateRoot: d,
    getMaps: f,
    prepareMapForManager: g,
    getRawMap: I,
    openMapMetadataDialog: S,
    openSystemDialog: b,
    openObjectDialog: y,
    openRouteDialog: L,
    openFactionDialog: x,
    exportMap: v,
    duplicateMap: q,
    deleteMap: D,
    createMap: re,
    deleteSystem: ne,
    deleteObject: X,
    setPrimaryObject: J,
    mergeSystems: be,
    deleteRoute: Le,
    deleteFaction: Z,
    openMap: Pe,
    showMapToPlayers: je,
    closePlayerMap: Oe,
    hideSystemFromPlayers: Ee,
    hideRouteFromPlayers: z,
    hideFactionFromPlayers: F,
    clearManagerApp: se
  } = n;
  return oe = class extends $s() {
    constructor(K = {}) {
      super(K);
      te(this, "selectedMapId");
      te(this, "jsonDraft");
      te(this, "activeTab");
      this.selectedMapId = K.selectedMapId ?? null, this.jsonDraft = "", this.activeTab = ["systems", "routes", "factions"].includes(K.activeTab) ? K.activeTab : "systems";
    }
    async _prepareContext(K) {
      var Te, _e;
      const O = await ((Te = super._prepareContext) == null ? void 0 : Te.call(this, K)) ?? {}, pe = f().sort((ke, Se) => ke.title.localeCompare(Se.title));
      (!this.selectedMapId || !pe.some((ke) => ke.id === this.selectedMapId)) && (this.selectedMapId = ((_e = pe[0]) == null ? void 0 : _e.id) ?? null);
      const qe = this.selectedMapId ? g(I(this.selectedMapId)) : null;
      return {
        ...O,
        maps: pe,
        selectedMap: qe,
        selectedMapId: this.selectedMapId,
        activeTab: this.activeTab,
        showSystems: this.activeTab === "systems",
        showRoutes: this.activeTab === "routes",
        showFactions: this.activeTab === "factions",
        hasMaps: pe.length > 0
      };
    }
    _attachPartListeners(K, O, pe) {
      var qe, Te, _e, ke, Se, Ye, u, l;
      (qe = super._attachPartListeners) == null || qe.call(this, K, O, pe), dn(this, O), (Te = O.querySelector("[data-action='create-map']")) == null || Te.addEventListener("click", () => this._onCreateMap()), (_e = O.querySelector("[data-action='edit-map-metadata']")) == null || _e.addEventListener("click", () => {
        this.selectedMapId && S(this.selectedMapId);
      }), (ke = O.querySelector("[data-action='create-system']")) == null || ke.addEventListener("click", () => {
        this.selectedMapId && b(this.selectedMapId);
      }), (Se = O.querySelector("[data-action='create-route']")) == null || Se.addEventListener("click", () => {
        this.selectedMapId && L(this.selectedMapId);
      }), (Ye = O.querySelector("[data-action='create-faction']")) == null || Ye.addEventListener("click", () => {
        this.selectedMapId && x(this.selectedMapId);
      }), O.querySelectorAll("[data-manager-tab]").forEach((o) => {
        o.addEventListener("click", () => {
          const c = o.dataset.managerTab;
          !["systems", "routes", "factions"].includes(c) || c === this.activeTab || (this.activeTab = c, this.render({ force: !0 }));
        });
      }), O.querySelectorAll("[data-edit-system]").forEach((o) => {
        o.addEventListener("click", () => b(this.selectedMapId, o.dataset.editSystem));
      }), O.querySelectorAll("[data-create-object]").forEach((o) => {
        o.addEventListener("click", () => y(this.selectedMapId, o.dataset.createObject));
      }), O.querySelectorAll("[data-edit-object]").forEach((o) => {
        o.addEventListener("click", () => y(this.selectedMapId, o.dataset.objectSystem, o.dataset.editObject));
      }), O.querySelectorAll("[data-delete-object]").forEach((o) => {
        o.addEventListener("click", () => this._confirmDeleteObject(o.dataset.objectSystem, o.dataset.deleteObject));
      }), O.querySelectorAll("[data-primary-object]").forEach((o) => {
        o.addEventListener("click", () => J(this.selectedMapId, o.dataset.objectSystem, o.dataset.primaryObject));
      }), O.querySelectorAll("[data-merge-system]").forEach((o) => {
        o.addEventListener("click", () => this._openMergeSystem(o.dataset.mergeSystem));
      }), O.querySelectorAll("[data-show-system]").forEach((o) => {
        o.addEventListener("click", () => Ee(this.selectedMapId, o.dataset.showSystem, !1));
      }), O.querySelectorAll("[data-hide-system]").forEach((o) => {
        o.addEventListener("click", () => Ee(this.selectedMapId, o.dataset.hideSystem, !0));
      }), O.querySelectorAll("[data-delete-system]").forEach((o) => {
        o.addEventListener("click", () => this._confirmDeleteSystem(o.dataset.deleteSystem));
      }), O.querySelectorAll("[data-edit-route]").forEach((o) => {
        o.addEventListener("click", () => L(this.selectedMapId, o.dataset.editRoute));
      }), O.querySelectorAll("[data-show-route]").forEach((o) => {
        o.addEventListener("click", () => z(this.selectedMapId, o.dataset.showRoute, !1));
      }), O.querySelectorAll("[data-hide-route]").forEach((o) => {
        o.addEventListener("click", () => z(this.selectedMapId, o.dataset.hideRoute, !0));
      }), O.querySelectorAll("[data-delete-route]").forEach((o) => {
        o.addEventListener("click", () => this._confirmDeleteRoute(o.dataset.deleteRoute));
      }), O.querySelectorAll("[data-edit-faction]").forEach((o) => {
        o.addEventListener("click", () => x(this.selectedMapId, o.dataset.editFaction));
      }), O.querySelectorAll("[data-show-faction]").forEach((o) => {
        o.addEventListener("click", () => F(this.selectedMapId, o.dataset.showFaction, !1));
      }), O.querySelectorAll("[data-hide-faction]").forEach((o) => {
        o.addEventListener("click", () => F(this.selectedMapId, o.dataset.hideFaction, !0));
      }), O.querySelectorAll("[data-delete-faction]").forEach((o) => {
        o.addEventListener("click", () => this._confirmDeleteFaction(o.dataset.deleteFaction));
      }), (u = O.querySelector("[data-action='export-map']")) == null || u.addEventListener("click", () => {
        this.selectedMapId && v(this.selectedMapId);
      }), O.querySelectorAll("[data-select-map]").forEach((o) => {
        o.addEventListener("click", () => {
          this.selectedMapId = o.dataset.selectMap, this.jsonDraft = "", this.render({ force: !0 });
        });
      }), O.querySelectorAll("[data-open-map]").forEach((o) => {
        o.addEventListener("click", () => Pe(o.dataset.openMap));
      }), O.querySelectorAll("[data-show-map]").forEach((o) => {
        o.addEventListener("click", () => je(o.dataset.showMap));
      }), O.querySelectorAll("[data-duplicate-map]").forEach((o) => {
        o.addEventListener("click", async () => {
          const c = await q(o.dataset.duplicateMap);
          c && (this.selectedMapId = c.id, this.jsonDraft = "", this.render({ force: !0 }));
        });
      }), O.querySelectorAll("[data-delete-map]").forEach((o) => {
        o.addEventListener("click", async () => {
          const c = o.dataset.deleteMap, p = I(c);
          await Dialog.confirm({
            title: "Delete Galaxy Map",
            content: `<p>Delete <strong>${(p == null ? void 0 : p.title) ?? c}</strong>? This cannot be undone.</p>`
          }, wt) && (await D(c), this.selectedMapId === c && (this.selectedMapId = null), this.jsonDraft = "", this.render({ force: !0 }));
        });
      }), (l = O.querySelector("[data-action='close-player-map']")) == null || l.addEventListener("click", () => Oe());
    }
    async _onCreateMap() {
      const K = await re({
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
      K && (this.selectedMapId = K.id, this.jsonDraft = "", this.render({ force: !0 }));
    }
    async _confirmDeleteSystem(K) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, wt) && await ne(this.selectedMapId, K);
    }
    async _confirmDeleteObject(K, O) {
      await Dialog.confirm({
        title: "Delete Entity",
        content: "<p>Delete this entity and its linked content from the system?</p>"
      }) && await X(this.selectedMapId, K, O);
    }
    _openMergeSystem(K) {
      var _e, ke;
      const O = I(this.selectedMapId), pe = (_e = O == null ? void 0 : O.systems) == null ? void 0 : _e.find((Se) => Se.id === K), qe = ((O == null ? void 0 : O.systems) ?? []).filter((Se) => Se.id !== K);
      if (!pe || !qe.length) return;
      const Te = qe.map((Se) => `<option value="${Se.id}">${Se.name}</option>`).join("");
      new Dialog({
        title: `Merge ${pe.name}`,
        content: `<form class="gmf-crud-form"><p>All ${((ke = pe.objects) == null ? void 0 : ke.length) ?? 0} entities will move to the destination. Routes will be redirected; internal and duplicate routes will be removed.</p><label>Destination system<select name="destinationSystemId">${Te}</select></label></form>`,
        buttons: {
          cancel: { icon: '<i class="fa-solid fa-xmark"></i>', label: "Cancel" },
          merge: {
            icon: '<i class="fa-solid fa-code-merge"></i>',
            label: "Merge Systems",
            callback: (Se) => {
              var l;
              const Ye = Se instanceof HTMLElement ? Se : Se == null ? void 0 : Se[0], u = (l = Ye == null ? void 0 : Ye.querySelector('[name="destinationSystemId"]')) == null ? void 0 : l.value;
              u && be(this.selectedMapId, K, u);
            }
          }
        },
        default: "cancel"
      }, { classes: ["galaxy-map", "gmf-crud-dialog"], width: 500 }).render(!0);
    }
    async _confirmDeleteRoute(K) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, wt) && await Le(this.selectedMapId, K);
    }
    async _confirmDeleteFaction(K) {
      await Dialog.confirm({
        title: "Delete Faction",
        content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
      }, wt) && await Z(this.selectedMapId, K);
    }
    async close(K = {}) {
      return se(this), super.close(K);
    }
  }, te(oe, "DEFAULT_OPTIONS", {
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
  }), te(oe, "PARTS", {
    main: {
      template: `${d}/map-manager.hbs`
    }
  }), oe;
}
function As(n, d) {
  const f = (g, I, S) => (I[0] - g[0]) * (S[1] - g[1]) - (I[1] - g[1]) * (S[0] - g[0]);
  return d.flatMap((g) => {
    const I = n.filter((x) => x.factionId === g.id && !x.obscured);
    if (!I.length) return [];
    const S = I.flatMap((x) => Array.from({ length: 12 }, (v, q) => {
      const D = q * Math.PI / 6;
      return [
        Math.max(1, Math.min(99, x.x + Math.cos(D) * 7)),
        Math.max(1, Math.min(99, x.y + Math.sin(D) * 9))
      ];
    })).sort((x, v) => x[0] - v[0] || x[1] - v[1]), b = (x) => {
      const v = [];
      for (const q of x) {
        for (; v.length > 1 && f(v[v.length - 2], v[v.length - 1], q) <= 0; ) v.pop();
        v.push(q);
      }
      return v.slice(0, -1);
    }, y = [...b(S), ...b([...S].reverse())], L = Math.min(...S.map((x) => x[1]));
    return [{
      id: g.id,
      name: g.name,
      color: g.color,
      points: y.map((x) => x.map((v) => v.toFixed(2)).join(",")).join(" "),
      labelX: (Math.min(...S.map((x) => x[0])) + Math.max(...S.map((x) => x[0]))) / 2,
      labelY: Math.max(3, L + 3)
    }];
  });
}
function Un() {
  var n, d, f;
  try {
    const g = (d = (n = game.modules) == null ? void 0 : n.get) == null ? void 0 : d.call(n, "bounty-board");
    if ((g == null ? void 0 : g.active) === !1) return null;
    const I = g.api ?? ((f = game.scifiSuite) == null ? void 0 : f.bountyBoard);
    return typeof (I == null ? void 0 : I.getBountiesForScene) == "function" ? I : null;
  } catch {
    return null;
  }
}
function Ps(n) {
  const d = Un();
  if (!d || !Array.isArray(n == null ? void 0 : n.sceneIds)) return [];
  const f = /* @__PURE__ */ new Set(), g = [];
  try {
    for (const I of n.sceneIds)
      for (const S of d.getBountiesForScene(String(I)) ?? []) {
        const b = String((S == null ? void 0 : S.id) ?? "");
        !b || f.has(b) || (f.add(b), g.push({
          id: b,
          name: String(S.name || "Unknown target"),
          image: String(S.image || ""),
          status: String(S.status || ""),
          statusLabel: String(S.statusLabel || S.status || ""),
          reward: String(S.reward || ""),
          sceneId: String(S.sceneId || I)
        }));
      }
  } catch {
    return [];
  }
  return g;
}
function js(n) {
  try {
    const d = Un();
    return typeof (d == null ? void 0 : d.openBounty) == "function" && d.openBounty(String(n)) !== !1;
  } catch {
    return !1;
  }
}
const bt = /* @__PURE__ */ new Map(), Os = 40, Ds = 192;
function Rs(n) {
  return new Promise((d, f) => {
    const g = new Image();
    g.onload = () => d(g), g.onerror = () => f(new Error("Image unavailable")), g.src = n;
  });
}
async function Fs(n) {
  if (!n) return null;
  try {
    const d = await Rs(n), f = Math.min(1, Ds / Math.max(d.naturalWidth || d.width, d.naturalHeight || d.height)), g = Math.max(2, Math.round((d.naturalWidth || d.width) * f)), I = Math.max(2, Math.round((d.naturalHeight || d.height) * f)), S = document.createElement("canvas");
    S.width = g, S.height = I;
    const b = S.getContext("2d", { willReadFrequently: !0 });
    if (!b) return null;
    b.drawImage(d, 0, 0, g, I);
    const y = b.getImageData(0, 0, g, I), L = b.createImageData(g, I), x = new Float32Array(g * I);
    for (let q = 0; q < x.length; q++) {
      const D = q * 4;
      x[q] = y.data[D] * 0.299 + y.data[D + 1] * 0.587 + y.data[D + 2] * 0.114;
    }
    const v = (q, D) => x[D * g + q];
    for (let q = 1; q < I - 1; q++)
      for (let D = 1; D < g - 1; D++) {
        const re = -v(D - 1, q - 1) + v(D + 1, q - 1) - 2 * v(D - 1, q) + 2 * v(D + 1, q) - v(D - 1, q + 1) + v(D + 1, q + 1), ne = -v(D - 1, q - 1) - 2 * v(D, q - 1) - v(D + 1, q - 1) + v(D - 1, q + 1) + 2 * v(D, q + 1) + v(D + 1, q + 1), X = Math.hypot(re, ne), J = Math.max(0, Math.min(235, (X - 34) * 2.1)), be = (q * g + D) * 4;
        L.data[be] = 104, L.data[be + 1] = 241, L.data[be + 2] = 255, L.data[be + 3] = J;
      }
    return b.clearRect(0, 0, g, I), b.putImageData(L, 0, 0), S.toDataURL("image/png");
  } catch {
    return null;
  }
}
function Ns(n, d = "") {
  const f = `${d}\0${n}`, g = bt.get(f);
  if (g)
    return bt.delete(f), bt.set(f, g), g;
  for (; bt.size >= Os; ) {
    const S = bt.keys().next().value;
    if (S === void 0) break;
    bt.delete(S);
  }
  const I = Fs(n);
  return bt.set(f, I), I;
}
function Bs({ root: n, stage: d, resolveItems: f, onOpen: g }) {
  var Oe, Ee, z;
  const I = n.querySelector("[data-intel-layer]");
  if (!I) return null;
  const S = new AbortController(), b = S.signal, y = document.createElement("aside");
  y.className = "gmf-intel-callout", y.setAttribute("aria-label", "Bounty intel"), y.hidden = !0, y.innerHTML = `
    <span class="gmf-intel-callout__connector" aria-hidden="true"></span>
    <button type="button" class="gmf-intel-callout__body" data-intel-open>
      <span class="gmf-intel-callout__portrait"><img alt="" data-intel-image hidden /><i class="fa-solid fa-crosshairs" data-intel-fallback></i></span>
      <span class="gmf-intel-callout__copy"><small data-intel-kicker>ACTIVE BOUNTY</small><strong data-intel-name></strong><span data-intel-meta></span></span>
    </button>
    <footer class="gmf-intel-callout__nav" data-intel-nav hidden>
      <button type="button" data-intel-previous aria-label="Previous bounty"><i class="fa-solid fa-chevron-left"></i></button>
      <span data-intel-count></span>
      <button type="button" data-intel-next aria-label="Next bounty"><i class="fa-solid fa-chevron-right"></i></button>
    </footer>`, I.append(y);
  let L = [], x = 0, v = null, q = null, D = null, re = 0, ne = 0;
  const X = () => {
    q && clearTimeout(q), q = null;
  }, J = () => {
    re++, D && clearTimeout(D), D = null, q = null, v = null, L = [], y.hidden = !0, y.classList.remove("is-visible", "is-left");
  }, be = (F = 180) => {
    X(), re++, D && clearTimeout(D), D = null, q = setTimeout(J, F);
  }, Le = () => {
    if (!v || y.hidden) return;
    const F = d.getBoundingClientRect(), se = v.getBoundingClientRect(), oe = y.offsetWidth || 242, Ge = y.offsetHeight || 126, ze = se.right - F.left + oe + 24 > F.width, K = ze ? se.left - F.left - oe - 18 : se.right - F.left + 18, O = Math.max(48, Math.min(F.height - Ge - 12, se.top - F.top + se.height / 2 - Ge / 2));
    y.classList.toggle("is-left", ze), y.style.left = `${Math.max(8, K)}px`, y.style.top = `${O}px`;
  }, Z = () => {
    const F = L[x];
    if (!F) return J();
    const se = y.querySelector("[data-intel-name]"), oe = y.querySelector("[data-intel-kicker]"), Ge = y.querySelector("[data-intel-meta]"), ze = y.querySelector("[data-intel-nav]"), K = y.querySelector("[data-intel-count]"), O = y.querySelector("[data-intel-image]"), pe = y.querySelector("[data-intel-fallback]");
    se && (se.textContent = F.name), oe && (oe.textContent = `BOUNTY // ${(F.statusLabel || "INTEL").toUpperCase()}`), Ge && (Ge.textContent = [F.statusLabel, F.reward].filter(Boolean).join(" // ")), ze && (ze.hidden = L.length < 2), K && (K.textContent = `${String(x + 1).padStart(2, "0")} / ${String(L.length).padStart(2, "0")}`);
    const qe = ++ne;
    O && (O.hidden = !0, O.removeAttribute("src")), pe && (pe.hidden = !1), F.image && O && (O.src = F.image, O.classList.add("is-css-fallback"), O.hidden = !1, pe && (pe.hidden = !0), O.onerror = () => {
      qe === ne && (O.hidden = !0, pe && (pe.hidden = !1));
    }, Ns(F.image, F.id).then((Te) => {
      var _e;
      !Te || qe !== ne || ((_e = L[x]) == null ? void 0 : _e.id) !== F.id || (O.classList.remove("is-css-fallback"), O.src = Te);
    })), Le();
  }, Pe = async (F) => {
    X(), v = F;
    const se = ++re;
    let oe = [];
    try {
      oe = await f(F.dataset.systemId ?? "");
    } catch {
    }
    if (!(se !== re || v !== F)) {
      if (!oe.length) return J();
      L = oe, x = 0, y.hidden = !1, Z(), requestAnimationFrame(() => {
        Le(), y.classList.add("is-visible");
      });
    }
  }, je = (F) => {
    X(), re++, D && clearTimeout(D), D = setTimeout(() => {
      D = null, Pe(F);
    }, 90);
  };
  return n.querySelectorAll("[data-system-id]").forEach((F) => {
    F.addEventListener("pointerenter", () => je(F), { signal: b }), F.addEventListener("pointerleave", () => be(), { signal: b }), F.addEventListener("focus", () => je(F), { signal: b }), F.addEventListener("blur", () => be(), { signal: b }), F.addEventListener("pointerdown", () => J(), { signal: b });
  }), y.addEventListener("pointerenter", X, { signal: b }), y.addEventListener("pointerleave", () => be(), { signal: b }), y.addEventListener("click", (F) => F.stopPropagation(), { signal: b }), (Oe = y.querySelector("[data-intel-open]")) == null || Oe.addEventListener("click", () => {
    const F = L[x];
    F && g(F.id);
  }, { signal: b }), (Ee = y.querySelector("[data-intel-previous]")) == null || Ee.addEventListener("click", () => {
    x = (x - 1 + L.length) % L.length, Z();
  }, { signal: b }), (z = y.querySelector("[data-intel-next]")) == null || z.addEventListener("click", () => {
    x = (x + 1) % L.length, Z();
  }, { signal: b }), d.addEventListener("wheel", () => requestAnimationFrame(Le), { signal: b }), window.addEventListener("resize", Le, { signal: b }), {
    dispose() {
      re++, q && clearTimeout(q), D && clearTimeout(D), S.abort(), y.remove();
    }
  };
}
function Gs({ host: n }) {
  const d = document.createElement("aside");
  d.className = "gmf-location-callout", d.hidden = !0, d.innerHTML = `
    <span class="gmf-location-callout__connector" aria-hidden="true"></span>
    <strong data-location-name></strong>`, n.append(d);
  let f = null, g = { x: 0, y: 0, visible: !1 }, I = null;
  const S = () => {
    I && clearTimeout(I), I = null;
  }, b = () => {
    S(), f = null, d.hidden = !0, d.classList.remove("is-visible", "is-left");
  }, y = () => {
    if (!f || d.hidden || !g.visible) return;
    const v = d.offsetWidth || 180, q = d.offsetHeight || 24, D = g.x + v + 76 > n.clientWidth, re = D ? g.x - v - 64 : g.x + 64, ne = Math.max(8, Math.min(n.clientHeight - q - 8, g.y - q / 2));
    d.classList.toggle("is-left", D), d.style.left = `${Math.max(8, re)}px`, d.style.top = `${ne}px`;
  }, L = (v) => {
    S(), f = v;
    const q = d.querySelector("[data-location-name]");
    q && (q.textContent = v.missing ? "Missing linked scene" : v.accessible ? v.name : "Restricted location"), d.hidden = !1, y(), requestAnimationFrame(() => {
      y(), d.classList.add("is-visible");
    });
  }, x = (v = 180) => {
    S(), I = setTimeout(b, v);
  };
  return {
    show: L,
    scheduleHide: x,
    hide: b,
    setAnchor(v) {
      if (g = v, !v.visible) return x(40);
      y();
    },
    dispose() {
      b(), d.remove();
    }
  };
}
function zs(n) {
  return String(n || "galaxy-map").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "galaxy-map";
}
function Vs(n, d) {
  const f = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" }), g = URL.createObjectURL(f), I = document.createElement("a");
  I.href = g, I.download = n, document.body.appendChild(I), I.click(), I.remove(), URL.revokeObjectURL(g);
}
function E(n) {
  const d = document.createElement("div");
  return d.textContent = String(n ?? ""), d.innerHTML;
}
function we(n, d) {
  return n.map((f) => {
    const g = typeof f == "string" ? f : f.value, I = typeof f == "string" ? f.split(/[-_]/).map((S) => S.toLowerCase() === "gm" ? "GM" : `${S.charAt(0).toUpperCase()}${S.slice(1)}`).join(" ") : f.label;
    return `<option value="${E(g)}" ${g === d ? "selected" : ""}>${E(I)}</option>`;
  }).join("");
}
function et(n) {
  return (n == null ? void 0 : n[0]) ?? n ?? null;
}
function Hs(n) {
  var I;
  const d = et(n), f = (I = d == null ? void 0 : d.matches) != null && I.call(d, "form") ? d : d == null ? void 0 : d.querySelector("form"), g = {};
  for (const [S, b] of new FormData(f).entries())
    g[S] === void 0 ? g[S] = b : Array.isArray(g[S]) ? g[S].push(b) : g[S] = [g[S], b];
  return g;
}
function Us(n) {
  var f, g, I, S, b;
  const d = globalThis.TextEditor ?? ((I = (g = (f = globalThis.foundry) == null ? void 0 : f.applications) == null ? void 0 : g.ux) == null ? void 0 : I.TextEditor);
  try {
    const y = (S = d == null ? void 0 : d.getDragEventData) == null ? void 0 : S.call(d, n);
    if (y && Object.keys(y).length) return y;
  } catch {
  }
  try {
    return JSON.parse(((b = n.dataTransfer) == null ? void 0 : b.getData("text/plain")) || "{}");
  } catch {
    return {};
  }
}
async function Yn(n) {
  var S, b, y, L, x, v, q, D;
  const d = Us(n), f = globalThis.fromUuid, g = d.uuid && f ? await f(d.uuid) : null;
  if (["Scene", "JournalEntry"].includes(g == null ? void 0 : g.documentName)) return g;
  const I = String(d.sceneId || d.journalId || d.id || "");
  return I ? d.type === "Scene" ? ((b = (S = game.scenes) == null ? void 0 : S.get) == null ? void 0 : b.call(S, I)) ?? null : ["JournalEntry", "Journal"].includes(d.type) ? ((L = (y = game.journal) == null ? void 0 : y.get) == null ? void 0 : L.call(y, I)) ?? null : ((v = (x = game.scenes) == null ? void 0 : x.get) == null ? void 0 : v.call(x, I)) ?? ((D = (q = game.journal) == null ? void 0 : q.get) == null ? void 0 : D.call(q, I)) ?? null : null;
}
async function Ys(n) {
  const d = await Yn(n);
  return (d == null ? void 0 : d.documentName) === "Scene" ? d : null;
}
function Xs() {
  var f, g, I, S;
  const n = (g = (f = foundry.applications) == null ? void 0 : f.api) == null ? void 0 : g.ApplicationV2, d = (S = (I = foundry.applications) == null ? void 0 : I.api) == null ? void 0 : S.HandlebarsApplicationMixin;
  return n && d ? d(n) : Application;
}
function Js(n) {
  var ke;
  const {
    templateRoot: d,
    getRawMap: f,
    prepareMapForDisplay: g,
    openSystemDialog: I,
    openObjectDialog: S,
    upsertObject: b,
    openRouteDialog: y,
    openFactionDialog: L,
    openFactionManagerDialog: x,
    openMapMetadataDialog: v,
    revealSystemToPlayers: q,
    revealRouteToPlayers: D,
    hideSystemFromPlayers: re,
    setObjectVisibility: ne,
    hideRouteFromPlayers: X,
    deleteSystem: J,
    deleteObject: be,
    deleteRoute: Le,
    setCurrentSystem: Z,
    setCurrentObject: Pe,
    requestTravelToSystem: je,
    notifySystemDiscovered: Oe,
    exportMap: Ee,
    getTravelRoute: z,
    broadcastTravelAnimation: F,
    notifyInfo: se,
    notifyError: oe,
    saveSystemPosition: Ge,
    saveObjectPosition: ze,
    savePlanetLocation: K,
    removePlanetLocation: O,
    unlinkPlanetScene: pe,
    showMapToPlayers: qe,
    openMapManager: Te,
    clearMapView: _e
  } = n;
  return ke = class extends Xs() {
    constructor(u = {}) {
      var c;
      const l = u.mapId, o = u.playerMode ?? !((c = game.user) != null && c.isGM);
      super({
        ...u,
        id: `galaxy-map-view-${o ? "player" : "gm"}-${l}`
      });
      te(this, "mapId");
      te(this, "playerMode");
      te(this, "selectedSystemId");
      te(this, "selectedRouteId");
      te(this, "activeSystemId");
      te(this, "selectedObjectId");
      te(this, "zoom");
      te(this, "panX");
      te(this, "panY");
      te(this, "_drag");
      te(this, "_contextTarget");
      te(this, "_boundContextClose");
      te(this, "externalFocus");
      te(this, "_externalFocusTimeout");
      te(this, "_pendingFocusZoom");
      te(this, "searchQuery");
      te(this, "showTerritories", !0);
      te(this, "planetSystemId", null);
      te(this, "planetStatic", !1);
      te(this, "_planetRenderer", null);
      te(this, "_planetGeneration", 0);
      te(this, "_planetReturnFocus", !1);
      te(this, "_bountyIntelCallout", null);
      te(this, "_planetLocationCallout", null);
      this.mapId = l, this.playerMode = o, this.selectedSystemId = u.selectedSystemId ?? null, this.selectedRouteId = u.selectedRouteId ?? null, this.activeSystemId = u.activeSystemId ?? null, this.selectedObjectId = u.selectedObjectId ?? null, this.zoom = 1, this.panX = 0, this.panY = 0, this._drag = null, this._contextTarget = null, this._boundContextClose = null, this.externalFocus = null, this._externalFocusTimeout = null, this._pendingFocusZoom = null, this.searchQuery = "";
    }
    get title() {
      const u = f(this.mapId), l = this.playerMode ? "Player View" : "GM View";
      return u ? `${u.title} - ${l}` : `Galaxy Map - ${l}`;
    }
    async _prepareContext(u) {
      var at, mt, ft, Xe, pt, yt, ht;
      const l = await ((at = super._prepareContext) == null ? void 0 : at.call(this, u)) ?? {}, o = f(this.mapId), c = o ? g(o, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      }) : null;
      c != null && c.systems && (c.systems = c.systems.map((T) => ({
        ...T,
        displayType: "system",
        factionName: "System",
        factionColor: "#58d8ff",
        animatedCelestial: !1
      })), c.selectedSystem && (c.selectedSystem = c.systems.find((T) => T.id === c.selectedSystem.id) ?? null)), c != null && c.systems && this.externalFocus && (c.systems = c.systems.map((T) => T.id === this.externalFocus.systemId ? { ...T, isExternalFocus: !0, externalFocus: this.externalFocus } : T), ((mt = c.selectedSystem) == null ? void 0 : mt.id) === this.externalFocus.systemId && (c.selectedSystem = c.systems.find((T) => T.id === this.externalFocus.systemId))), !this.activeSystemId && this.selectedSystemId && !(c != null && c.selectedSystem) && (this.selectedSystemId = null);
      const p = (c == null ? void 0 : c.systems.find((T) => T.id === this.activeSystemId)) ?? null, h = new Map(((c == null ? void 0 : c.factions) ?? []).map((T) => [T.id, T])), w = p ? p.objects.filter((T) => !this.playerMode || Ft(p, T) === "players").map((T) => {
        var Ne;
        const ie = this.playerMode && T.status === "undiscovered", ye = h.get(T.factionId);
        return {
          ...T,
          systemId: p.id,
          displayName: ie ? "???" : T.name,
          displayDescription: ie ? "Unresolved sensor contact. Details are not available." : T.description,
          displayType: ie ? "unknown" : T.kind,
          displayStatus: ie ? "undiscovered" : T.status,
          factionName: (ye == null ? void 0 : ye.name) ?? "Unaffiliated",
          factionColor: T.iconColor || (ye == null ? void 0 : ye.color) || "#58d8ff",
          obscured: ie,
          gmOnly: Ft(p, T) === "gm",
          isSelected: T.id === this.selectedObjectId,
          isCurrent: ((Ne = c == null ? void 0 : c.currentLocation) == null ? void 0 : Ne.objectId) === T.id,
          animatedCelestial: sn.includes(T.iconStyle),
          hasJournal: !!(!ie && T.journalId),
          hasScenes: !!(!ie && T.sceneIds.length),
          showImage: !!(!ie && T.image),
          canInspectSystem: !!dt({ ...T, obscured: ie })
        };
      }) : [];
      p && this.selectedObjectId && !w.some((T) => T.id === this.selectedObjectId) && (this.selectedObjectId = null);
      const k = w.find((T) => T.id === this.selectedObjectId) ?? null, N = new Set(w.map((T) => T.id)), C = p ? (p.routes ?? []).filter((T) => (!this.playerMode || T.visibility === "players") && N.has(T.fromSystemId) && N.has(T.toSystemId)).map((T) => {
        const ie = w.find((Ne) => Ne.id === T.fromSystemId), ye = w.find((Ne) => Ne.id === T.toSystemId);
        return {
          ...T,
          from: ie,
          to: ye,
          fromName: (ie == null ? void 0 : ie.displayName) ?? T.fromSystemId,
          toName: (ye == null ? void 0 : ye.displayName) ?? T.toSystemId,
          isSelected: T.id === this.selectedRouteId,
          isActive: T.id === this.selectedRouteId,
          gmOnly: T.visibility === "gm"
        };
      }) : [], Q = C.find((T) => T.id === this.selectedRouteId) ?? null;
      p && (c.systems = w, c.routes = C, c.selectedSystem = Q ? null : k, c.selectedRoute = Q, c.currentSystem = w.find((T) => T.isCurrent) ?? null);
      const B = w.find((T) => T.id === this.planetSystemId) ?? (p ? null : c == null ? void 0 : c.systems.find((T) => T.id === this.planetSystemId)), G = !this.playerMode || (o == null ? void 0 : o.visibility) === "players" ? dt(B) : null;
      G || (this.planetSystemId = null);
      const le = B && G ? this._preparePlanetLocations(B, G.shape) : [], ce = B ?? k, De = !!((ft = game.user) != null && ft.isGM && !this.playerMode && p && ce), nt = ((ce == null ? void 0 : ce.sceneIds) ?? []).map((T) => {
        var ie, ye;
        return (ye = (ie = game.scenes) == null ? void 0 : ie.get) == null ? void 0 : ye.call(ie, T);
      }).filter((T) => {
        var ie, ye;
        return T && (((ie = game.user) == null ? void 0 : ie.isGM) || ((ye = T.testUserPermission) == null ? void 0 : ye.call(T, game.user, "OBSERVER")));
      }).map((T) => ({ id: T.id, uuid: T.uuid, name: T.name || "Linked Scene" })), Fe = ce != null && ce.journalId ? (pt = (Xe = game.journal) == null ? void 0 : Xe.get) == null ? void 0 : pt.call(Xe, ce.journalId) : null, st = Fe && ((yt = game.user) != null && yt.isGM || (ht = Fe.testUserPermission) != null && ht.call(Fe, game.user, "OBSERVER")) ? { id: Fe.id, uuid: Fe.uuid, name: Fe.name || "Linked Journal" } : null;
      return {
        ...l,
        map: c,
        systemView: !!(p && !G),
        activeSystem: p,
        selectedObject: k,
        planetView: !!G,
        planetSystem: B,
        planetAppearance: G,
        planetLocations: le,
        hasPlanetLocations: le.length > 0,
        canPlacePlanetLocations: De,
        linkedPlanetScenes: nt,
        linkedPlanetJournal: st,
        showInspector: !!(G || c != null && c.selectedSystem || c != null && c.selectedRoute),
        territories: c ? As(c.systems, c.factions) : [],
        showTerritories: this.showTerritories,
        mapId: this.mapId,
        playerMode: this.playerMode,
        zoomPercent: Math.round(this.zoom * 100),
        searchQuery: this.searchQuery,
        panX: this.panX,
        panY: this.panY,
        zoom: this.zoom,
        missingMap: !o
      };
    }
    _onRender(u, l) {
      var c, p, h, w, k;
      (p = (c = this._bountyIntelCallout) == null ? void 0 : c.dispose) == null || p.call(c), this._bountyIntelCallout = null, this._disposePlanetRenderer(), (h = super._onRender) == null || h.call(this, u, l);
      const o = this.element instanceof HTMLElement ? this.element : (w = this.element) == null ? void 0 : w[0];
      if (o) {
        if (this._attachPartListeners("main", o, l), this._mountBountyIntelCallout(o), this.externalFocus && this._pendingFocusZoom !== null) {
          const N = P(f(this.mapId)).systems.find((C) => C.id === this.externalFocus.systemId);
          N && this._centerOnSystem(N, o, this._pendingFocusZoom), this._pendingFocusZoom = null;
        }
        this._applySearchState(this.searchQuery, o), u.planetView ? this._mountPlanetRenderer(o, u.planetAppearance) : this._planetReturnFocus && ((k = o.querySelector("[data-action='inspect-system']")) == null || k.focus(), this._planetReturnFocus = !1);
      }
    }
    _attachPartListeners(u, l, o) {
      var w, k, N, C, Q, B, G, le, ce, De, nt, Fe, st, at, mt, ft, Xe, pt, yt, ht, T, ie, ye, Ne, gt, kt, At, Je, Pt;
      const c = (w = l.matches) != null && w.call(l, ".gmf-map-stage") ? l : (k = l.querySelector) == null ? void 0 : k.call(l, ".gmf-map-stage, .gmf-planet-stage");
      if ((c == null ? void 0 : c.dataset.gmfMapBound) === "true") return;
      c && (c.dataset.gmfMapBound = "true");
      const p = (N = c == null ? void 0 : c.matches) != null && N.call(c, ".gmf-map-stage") ? c : null;
      (C = super._attachPartListeners) == null || C.call(this, u, l, o), dn(this, l), this._attachPlanetListeners(l), (Q = l.querySelector("[data-action='toggle-territories']")) == null || Q.addEventListener("click", () => {
        this.showTerritories = !this.showTerritories, this.render({ force: !0 });
      }), this._applyViewportTransform(l), l.querySelectorAll("[data-system-id]").forEach((ae) => {
        var it;
        ae.addEventListener("click", (xt) => {
          if (ae.dataset.dragged === "true") {
            ae.dataset.dragged = "false";
            return;
          }
          xt.stopPropagation(), this.activeSystemId ? this.selectedObjectId = ae.dataset.systemId : this.selectedSystemId = ae.dataset.systemId, this.selectedRouteId = null, this.render({ force: !0 });
        }), !this.playerMode && ((it = game.user) != null && it.isGM) && ae.addEventListener("pointerdown", (xt) => this._startSystemDrag(xt, l, ae));
      }), this._mountBountyIntelCallout(l), l.querySelectorAll("[data-route-id]").forEach((ae) => {
        ae.addEventListener("click", (it) => {
          it.stopPropagation(), this.selectedRouteId = ae.dataset.routeId, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, this.render({ force: !0 });
        });
      }), p == null || p.addEventListener("wheel", (ae) => this._onWheelZoom(ae, l), { passive: !1 }), p == null || p.addEventListener("pointerdown", (ae) => this._startPan(ae, l)), p == null || p.addEventListener("contextmenu", (ae) => this._openContextMenu(ae, l), { capture: !0 }), l.querySelectorAll("[data-context-action]").forEach((ae) => {
        ae.addEventListener("click", (it) => this._handleContextAction(it, l));
      }), (B = l.querySelector("[data-action='open-map-menu']")) == null || B.addEventListener("click", (ae) => this._openStageMenuFromButton(ae, l)), (G = l.querySelector("[data-action='zoom-in']")) == null || G.addEventListener("click", () => this._setZoom(this.zoom + 0.15, l)), (le = l.querySelector("[data-action='zoom-out']")) == null || le.addEventListener("click", () => this._setZoom(this.zoom - 0.15, l)), (ce = l.querySelector("[data-action='reset-view']")) == null || ce.addEventListener("click", () => {
        this.zoom = 1, this.panX = 0, this.panY = 0, this._applyViewportTransform(l);
      });
      const h = l.querySelector("[data-system-search]");
      h == null || h.addEventListener("input", () => {
        this.searchQuery = h.value, this._applySearchState(this.searchQuery, l);
      }), h == null || h.addEventListener("keydown", (ae) => {
        ae.key === "Enter" && (ae.preventDefault(), this._focusSearchResult(h.value, l));
      }), (De = l.querySelector("[data-action='run-system-search']")) == null || De.addEventListener("click", () => this._focusSearchResult((h == null ? void 0 : h.value) ?? "", l)), (nt = l.querySelector("[data-action='clear-system-search']")) == null || nt.addEventListener("click", () => {
        this.searchQuery = "", h && (h.value = ""), this._applySearchState("", l), h == null || h.focus();
      }), (Fe = l.querySelector("[data-action='open-journal']")) == null || Fe.addEventListener("click", () => this._openLinkedJournal()), (st = l.querySelector("[data-action='open-scene']")) == null || st.addEventListener("click", () => this._openLinkedScene()), (at = l.querySelector("[data-action='edit-system']")) == null || at.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? S(this.mapId, this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && I(this.mapId, this.selectedSystemId);
      }), (mt = l.querySelector("[data-action='open-system']")) == null || mt.addEventListener("click", () => {
        this.selectedSystemId && (this.activeSystemId = this.selectedSystemId, this.selectedObjectId = null, this.selectedRouteId = null, this.searchQuery = "", this.render({ force: !0 }));
      }), (ft = l.querySelector("[data-action='add-object']")) == null || ft.addEventListener("click", () => {
        this.activeSystemId && S(this.mapId, this.activeSystemId);
      }), (Xe = l.querySelector("[data-action='navigate-up']")) == null || Xe.addEventListener("click", () => {
        if (this.planetSystemId)
          this._disposePlanetRenderer(), this.planetSystemId = null, this._planetReturnFocus = !0;
        else if (this.activeSystemId)
          this.activeSystemId = null, this.selectedObjectId = null, this.selectedRouteId = null, this.searchQuery = "";
        else return;
        this.render({ force: !0 });
      }), (pt = l.querySelector("[data-action='reveal-system']")) == null || pt.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? ne(this.mapId, this.activeSystemId, this.selectedObjectId, "players") : this.selectedSystemId && q(this.mapId, this.selectedSystemId);
      }), (yt = l.querySelector("[data-action='hide-system']")) == null || yt.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? ne(this.mapId, this.activeSystemId, this.selectedObjectId, "gm") : this.selectedSystemId && re(this.mapId, this.selectedSystemId, !0);
      }), (ht = l.querySelector("[data-action='delete-system']")) == null || ht.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? this._confirmDeleteObject(this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && this._confirmDeleteSystem(this.selectedSystemId);
      }), (T = l.querySelector("[data-action='set-current-system']")) == null || T.addEventListener("click", () => {
        this.activeSystemId && this.selectedObjectId ? Pe(this.mapId, this.activeSystemId, this.selectedObjectId) : this.selectedSystemId && Z(this.mapId, this.selectedSystemId);
      }), (ie = l.querySelector("[data-action='travel-to-system']")) == null || ie.addEventListener("click", () => {
        this.selectedSystemId && (this.playerMode ? je(this.mapId, this.selectedSystemId) : this._travelToSystem(this.selectedSystemId, l));
      }), (ye = l.querySelector("[data-action='edit-route']")) == null || ye.addEventListener("click", () => {
        this.selectedRouteId && y(this.mapId, this.selectedRouteId);
      }), (Ne = l.querySelector("[data-action='reveal-route']")) == null || Ne.addEventListener("click", () => {
        this.selectedRouteId && D(this.mapId, this.selectedRouteId);
      }), (gt = l.querySelector("[data-action='hide-route']")) == null || gt.addEventListener("click", () => {
        this.selectedRouteId && X(this.mapId, this.selectedRouteId, !0);
      }), (kt = l.querySelector("[data-action='delete-route']")) == null || kt.addEventListener("click", () => {
        this.selectedRouteId && this._confirmDeleteRoute(this.selectedRouteId);
      }), (At = l.querySelector("[data-action='notify-discovery']")) == null || At.addEventListener("click", () => {
        this.selectedSystemId && Oe(this.mapId, this.selectedSystemId);
      }), (Je = l.querySelector("[data-action='show-to-players']")) == null || Je.addEventListener("click", () => qe(this.mapId)), (Pt = l.querySelector("[data-action='edit-map']")) == null || Pt.addEventListener("click", () => {
        const ae = Te();
        ae && (ae.selectedMapId = this.mapId, ae.render({ force: !0 }));
      });
    }
    _applyViewportTransform(u) {
      var c;
      const l = u.querySelector(".gmf-map-viewport");
      if (!l) return;
      const o = u.querySelector(".gmf-map-stage");
      if (o) {
        const p = o.getBoundingClientRect();
        this.panX = ge(this.panX, p.width * (1 - this.zoom), 0), this.panY = ge(this.panY, p.height * (1 - this.zoom), 0);
      }
      l.style.setProperty("--gmf-pan-x", `${this.panX}px`), l.style.setProperty("--gmf-pan-y", `${this.panY}px`), l.style.setProperty("--gmf-zoom", String(this.zoom)), (c = u.querySelector("[data-zoom-label]")) == null || c.replaceChildren(`${Math.round(this.zoom * 100)}%`);
    }
    _setZoom(u, l) {
      this.zoom = ge(u, Qt, Kt), this._applyViewportTransform(l);
    }
    _mountBountyIntelCallout(u) {
      var c;
      if (this._bountyIntelCallout || u.querySelector(".gmf-intel-callout")) return;
      const l = (c = u.matches) != null && c.call(u, ".gmf-map-stage") ? u : u.querySelector(".gmf-map-stage"), o = u;
      !l || !o.querySelector("[data-intel-layer]") || (this._bountyIntelCallout = Bs({
        root: o,
        stage: l,
        resolveItems: (p) => {
          var k;
          const h = P(f(this.mapId)), w = this.activeSystemId ? (k = h.systems.find((N) => N.id === this.activeSystemId)) == null ? void 0 : k.objects.find((N) => N.id === p) : h.systems.find((N) => N.id === p);
          return w ? Ps(w) : [];
        },
        onOpen: (p) => js(p)
      }));
    }
    _attachPlanetListeners(u) {
      var l, o, c, p, h, w;
      (l = u.querySelector("[data-action='inspect-system']")) == null || l.addEventListener("click", () => {
        var N, C;
        const k = f(this.mapId);
        if (!(this.playerMode && (k == null ? void 0 : k.visibility) !== "players")) {
          if (this.activeSystemId) {
            const B = (N = P(k).systems.find((G) => G.id === this.activeSystemId)) == null ? void 0 : N.objects.find((G) => G.id === this.selectedObjectId);
            if (!dt(B)) return;
            this.planetSystemId = this.selectedObjectId;
          } else {
            this.activeSystemId = this.selectedSystemId;
            const Q = P(k);
            this.selectedObjectId = ((C = Q.systems.find((B) => B.id === this.activeSystemId)) == null ? void 0 : C.primaryObjectId) ?? null, this.planetSystemId = this.selectedObjectId;
          }
          this.render({ force: !0 });
        }
      }), (o = u.querySelector("[data-action='planet-pause']")) == null || o.addEventListener("click", () => {
        var k;
        return (k = this._planetRenderer) == null ? void 0 : k.setPaused(!this._planetRenderer.paused);
      }), (c = u.querySelector("[data-action='planet-zoom-in']")) == null || c.addEventListener("click", () => {
        var k;
        return (k = this._planetRenderer) == null ? void 0 : k.zoom(-0.25);
      }), (p = u.querySelector("[data-action='planet-zoom-out']")) == null || p.addEventListener("click", () => {
        var k;
        return (k = this._planetRenderer) == null ? void 0 : k.zoom(0.25);
      }), (h = u.querySelector("[data-action='planet-reset']")) == null || h.addEventListener("click", () => {
        var k;
        return (k = this._planetRenderer) == null ? void 0 : k.reset();
      }), (w = u.querySelector("[data-action='planet-static']")) == null || w.addEventListener("click", () => {
        this.planetStatic = !this.planetStatic, this.render({ force: !0 });
      }), this._attachPlanetLocationList(u), this._attachLinkedContentDrop(u);
    }
    _getPlanetObject() {
      var l;
      return ((l = P(f(this.mapId)).systems.find((o) => o.id === this.activeSystemId)) == null ? void 0 : l.objects.find((o) => o.id === this.planetSystemId)) ?? null;
    }
    _preparePlanetLocations(u, l) {
      return ((u == null ? void 0 : u.planetLocations) ?? []).filter((o) => o.shape === l).map((o) => {
        var h, w, k, N, C, Q;
        const c = (w = (h = game.scenes) == null ? void 0 : h.get) == null ? void 0 : w.call(h, o.sceneId), p = !!(c && ((k = game.user) != null && k.isGM || (N = c.testUserPermission) != null && N.call(c, game.user, "OBSERVER")));
        return {
          ...o,
          name: c ? p || (C = game.user) != null && C.isGM ? c.name || "Linked Scene" : "Restricted location" : "Missing linked scene",
          accessible: p,
          missing: !c,
          canRemove: !!((Q = game.user) != null && Q.isGM && !this.playerMode)
        };
      });
    }
    _getPlanetLocationItem(u) {
      var o;
      const l = this._getPlanetObject();
      return this._preparePlanetLocations(l, (o = dt(l)) == null ? void 0 : o.shape).find((c) => c.id === u) ?? null;
    }
    _attachPlanetLocationList(u) {
      var c, p;
      const l = (this.element instanceof HTMLElement ? this.element : (c = this.element) == null ? void 0 : c[0]) ?? u;
      u.querySelectorAll("[data-planet-scene-drag]").forEach((h) => h.addEventListener("dragstart", (w) => {
        w.dataTransfer && (w.dataTransfer.setData("text/plain", JSON.stringify({ type: "Scene", id: h.dataset.planetSceneDrag, uuid: h.dataset.planetSceneUuid })), w.dataTransfer.effectAllowed = "link");
      })), u.querySelectorAll("[data-unlink-planet-scene]").forEach((h) => h.addEventListener("click", async (w) => {
        var Q, B, G;
        w.preventDefault(), w.stopPropagation();
        const k = h.dataset.unlinkPlanetScene ?? "", N = this.planetSystemId || this.selectedObjectId;
        if (!k || !this.activeSystemId || !N) return;
        const C = ((G = (B = (Q = game.scenes) == null ? void 0 : Q.get) == null ? void 0 : B.call(Q, k)) == null ? void 0 : G.name) || "Scene";
        await pe(this.mapId, this.activeSystemId, N, k) && se(`${C} unlinked from this entity.`);
      })), u.querySelectorAll("[data-open-linked-scene]").forEach((h) => h.addEventListener("click", () => {
        var k, N, C;
        const w = (N = (k = game.scenes) == null ? void 0 : k.get) == null ? void 0 : N.call(k, h.dataset.openLinkedScene ?? "");
        w != null && w.view ? w.view() : (C = w == null ? void 0 : w.sheet) == null || C.render(!0);
      })), u.querySelectorAll("[data-open-planet-location]").forEach((h) => h.addEventListener("click", () => this._openPlanetLocation(h.dataset.openPlanetLocation ?? ""))), u.querySelectorAll("[data-remove-planet-location]").forEach((h) => h.addEventListener("click", () => this._removePlanetLocation(h.dataset.removePlanetLocation ?? "", u))), u.querySelectorAll("[data-planet-location-drag]").forEach((h) => {
        h.addEventListener("dragstart", (w) => {
          var N;
          if (!w.dataTransfer) return;
          const k = h.dataset.planetLocationDrag ?? "";
          w.dataTransfer.setData("application/x-gmf-surface-location", k), w.dataTransfer.setData("text/plain", JSON.stringify({ type: "GalaxySurfaceLocation", locationId: k })), w.dataTransfer.effectAllowed = "move", (N = l.querySelector("[data-planet-location-trash]")) == null || N.classList.add("is-armed");
        }), h.addEventListener("dragend", () => {
          var w;
          return (w = l.querySelector("[data-planet-location-trash]")) == null ? void 0 : w.classList.remove("is-armed", "is-dragover");
        });
      });
      const o = l.querySelector("[data-planet-location-trash]");
      (o == null ? void 0 : o.dataset.gmfTrashBound) !== "true" && (o && (o.dataset.gmfTrashBound = "true"), o == null || o.addEventListener("dragover", (h) => {
        var w;
        (w = h.dataTransfer) != null && w.types.includes("application/x-gmf-surface-location") && (h.preventDefault(), h.dataTransfer.dropEffect = "move", o.classList.add("is-dragover"));
      }), o == null || o.addEventListener("dragleave", () => o.classList.remove("is-dragover")), o == null || o.addEventListener("drop", (h) => {
        var k;
        h.preventDefault();
        const w = ((k = h.dataTransfer) == null ? void 0 : k.getData("application/x-gmf-surface-location")) ?? "";
        o.classList.remove("is-armed", "is-dragover"), w && this._removePlanetLocation(w, u);
      })), (p = u.querySelector("[data-clear-planet-locations]")) == null || p.addEventListener("click", () => this._clearPlanetLocations(u));
    }
    _attachLinkedContentDrop(u) {
      var o, c;
      const l = u.querySelector("[data-linked-content-drop]");
      !l || !((o = game.user) != null && o.isGM) || this.playerMode || (l.addEventListener("dragover", (p) => {
        p.preventDefault(), p.dataTransfer && (p.dataTransfer.dropEffect = "link"), l.classList.add("is-document-dragover");
      }), l.addEventListener("dragleave", (p) => {
        l.contains(p.relatedTarget) || l.classList.remove("is-document-dragover");
      }), l.addEventListener("drop", async (p) => {
        var N;
        p.preventDefault(), p.stopPropagation(), l.classList.remove("is-document-dragover");
        const h = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !h) return;
        const w = await Yn(p), k = (N = P(f(this.mapId)).systems.find((C) => C.id === this.activeSystemId)) == null ? void 0 : N.objects.find((C) => C.id === h);
        if (!w || !k) {
          oe("Drop a Foundry Scene or Journal here.");
          return;
        }
        if (w.documentName === "Scene") {
          const C = [.../* @__PURE__ */ new Set([...k.sceneIds ?? [], w.id])];
          await b(this.mapId, this.activeSystemId, { ...k, sceneIds: C }), se(`${w.name || "Scene"} linked to ${k.name}.`);
        } else if (w.documentName === "JournalEntry")
          await b(this.mapId, this.activeSystemId, { ...k, journalId: w.id }), se(`${w.name || "Journal"} linked to ${k.name}.`);
        else {
          oe("Drop a Foundry Scene or Journal here.");
          return;
        }
      }), (c = u.querySelector("[data-unlink-linked-journal]")) == null || c.addEventListener("click", async (p) => {
        var k;
        p.preventDefault(), p.stopPropagation();
        const h = this.planetSystemId || this.selectedObjectId;
        if (!this.activeSystemId || !h) return;
        const w = (k = P(f(this.mapId)).systems.find((N) => N.id === this.activeSystemId)) == null ? void 0 : k.objects.find((N) => N.id === h);
        w && await b(this.mapId, this.activeSystemId, { ...w, journalId: "" });
      }));
    }
    _openPlanetLocation(u) {
      var c, p, h;
      const l = this._getPlanetLocationItem(u), o = l ? (p = (c = game.scenes) == null ? void 0 : c.get) == null ? void 0 : p.call(c, l.sceneId) : null;
      if (!l || !o || !l.accessible) {
        oe(l != null && l.missing ? "That location is unavailable." : "You do not have permission to view that scene.");
        return;
      }
      o.view ? o.view() : (h = o.sheet) == null || h.render(!0);
    }
    async _removePlanetLocation(u, l) {
      var c;
      if (!((c = game.user) != null && c.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const o = this._getPlanetLocationItem(u);
      !o || !await O(this.mapId, this.activeSystemId, this.planetSystemId, u) || (this._syncPlanetLocations(l), se(`${o.name} removed from the surface.`));
    }
    async _clearPlanetLocations(u) {
      var c, p;
      if (!((c = game.user) != null && c.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const l = this._getPlanetObject(), o = this._preparePlanetLocations(l, (p = dt(l)) == null ? void 0 : p.shape);
      for (const h of o) await O(this.mapId, this.activeSystemId, this.planetSystemId, h.id);
      this._syncPlanetLocations(u), o.length && se(`Cleared ${o.length} surface location${o.length === 1 ? "" : "s"}.`);
    }
    async _placePlanetLocation(u, l, o) {
      var w;
      if (!((w = game.user) != null && w.isGM) || this.playerMode || !this.activeSystemId || !this.planetSystemId) return;
      const c = await Ys(u);
      if (!c) {
        oe("Drop a Foundry Scene onto the 3D surface.");
        return;
      }
      const p = this._getPlanetObject();
      if (!(p != null && p.sceneIds.includes(c.id))) {
        oe(`Link ${c.name || "this scene"} to the object before placing it on the surface.`);
        return;
      }
      await K(this.mapId, this.activeSystemId, this.planetSystemId, { ...l, sceneId: c.id }) && (this._syncPlanetLocations(o), se(`${c.name || "Scene"} placed on the ${l.shape}. Drag it again to move it.`));
    }
    _syncPlanetLocations(u) {
      var h, w, k, N;
      const l = (this.element instanceof HTMLElement ? this.element : (h = this.element) == null ? void 0 : h[0]) ?? u, o = this._getPlanetObject(), c = this._preparePlanetLocations(o, (w = dt(o)) == null ? void 0 : w.shape);
      (k = this._planetRenderer) == null || k.setLocations((o == null ? void 0 : o.planetLocations) ?? []);
      const p = l.querySelector("[data-planet-location-list]");
      p && (p.innerHTML = c.length ? c.map((C) => `
        <div class="gmf-planet-location-row ${C.accessible ? "" : "is-restricted"}" ${C.canRemove ? `draggable="true" data-planet-location-drag="${E(C.id)}" title="Drag to the trash bin to remove"` : ""}>
          <button type="button" data-open-planet-location="${E(C.id)}" ${C.accessible ? "" : "disabled"}><i class="fa-solid ${C.accessible ? "fa-location-dot" : "fa-lock"}"></i><span>${E(C.name)}</span></button>
          ${C.canRemove ? `<button type="button" data-remove-planet-location="${E(C.id)}" title="Remove location" aria-label="Remove ${E(C.name)}"><i class="fa-solid fa-trash"></i></button>` : ""}
        </div>`).join("") : '<p class="gmf-planet-locations__empty">No surface locations placed.</p>', this._attachPlanetLocationList(p), (N = l.querySelector("[data-planet-location-removal]")) == null || N.toggleAttribute("hidden", c.length === 0));
    }
    refreshPlanetLocations(u, l) {
      var c;
      if (this.activeSystemId !== u || this.planetSystemId !== l) return;
      const o = this.element instanceof HTMLElement ? this.element : (c = this.element) == null ? void 0 : c[0];
      o && this._syncPlanetLocations(o);
    }
    async focusSystem(u, l = {}) {
      var Q, B;
      const o = P(f(this.mapId));
      if (!o.systems.find((G) => G.id === u)) return !1;
      const p = g(o, {
        playerMode: this.playerMode,
        selectedSystemId: u,
        selectedRouteId: null
      });
      if (!((Q = p == null ? void 0 : p.systems) != null && Q.some((G) => G.id === u))) return !1;
      const h = String(l.focusId || u).slice(0, 80), w = ["distress", "warning", "objective", "custom"].includes(l.kind) ? l.kind : "custom", k = /^#[0-9a-f]{6}$/i.test(l.color ?? "") ? l.color : w === "distress" ? "#ff5c7a" : "#58d8ff", N = ge(Number(l.duration) || 0, 0, 6e5), C = ge(Number(l.zoom) || 1.45, Qt, Kt);
      return this.externalFocus = {
        id: h,
        systemId: u,
        kind: w,
        color: k,
        label: String(l.label || (w === "distress" ? "Distress signal" : "Signal located")).slice(0, 120)
      }, this.selectedSystemId = u, this.planetSystemId = null, this.selectedRouteId = null, this._pendingFocusZoom = C, this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, await this.render({ force: !0 }), (B = this.bringToFront) == null || B.call(this), N > 0 && (this._externalFocusTimeout = globalThis.setTimeout(() => {
        var G;
        ((G = this.externalFocus) == null ? void 0 : G.id) === h && this.clearSystemFocus(h);
      }, N)), !0;
    }
    async focusLocation(u, l = "", o = {}) {
      var w;
      const p = P(f(this.mapId)).systems.find((k) => k.id === u), h = (p == null ? void 0 : p.objects.find((k) => k.id === l)) ?? (p == null ? void 0 : p.objects.find((k) => k.id === p.primaryObjectId));
      return !p || !h || this.playerMode && (p.visibility !== "players" || Ft(p, h) !== "players") ? !1 : (this.activeSystemId = p.id, this.selectedSystemId = p.id, this.selectedObjectId = h.id, this.selectedRouteId = null, this.planetSystemId = o.detail === !0 && dt(h) ? h.id : null, await this.render({ force: !0 }), (w = this.bringToFront) == null || w.call(this), !0);
    }
    clearSystemFocus(u = "") {
      return !this.externalFocus || u && this.externalFocus.id !== u ? !1 : (this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, this._pendingFocusZoom = null, this.externalFocus = null, this.rendered && this.render({ force: !0 }), !0);
    }
    _centerOnSystem(u, l, o) {
      const c = l.querySelector(".gmf-map-stage");
      if (!c) return;
      const p = c.getBoundingClientRect();
      this.zoom = o, this.panX = p.width / 2 - Number(u.x) / 100 * p.width * o, this.panY = p.height / 2 - Number(u.y) / 100 * p.height * o, this._applyViewportTransform(l);
    }
    _getVisibleSystems() {
      var l;
      const u = f(this.mapId);
      if (!u) return [];
      if (this.activeSystemId) {
        const o = P(u).systems.find((c) => c.id === this.activeSystemId);
        return ((o == null ? void 0 : o.objects) ?? []).filter((c) => !this.playerMode || Ft(o, c) === "players").map((c) => ({ ...c, displayName: c.status === "undiscovered" && this.playerMode ? "???" : c.name, displayType: c.kind, displayStatus: c.status, factionName: "" }));
      }
      return ((l = g(u, {
        playerMode: this.playerMode,
        selectedSystemId: this.selectedSystemId,
        selectedRouteId: this.selectedRouteId
      })) == null ? void 0 : l.systems) ?? [];
    }
    _applySearchState(u, l) {
      var p;
      const o = String(u || "").trim().toLocaleLowerCase(), c = Array.from(l.querySelectorAll("[data-system-id]"));
      return c.forEach((h) => {
        const w = String(h.dataset.searchText || "").toLocaleLowerCase(), k = !!(o && w.includes(o));
        h.classList.toggle("is-search-match", k), h.classList.toggle("is-search-dimmed", !!(o && !k));
      }), (p = l.querySelector("[data-action='clear-system-search']")) == null || p.toggleAttribute("hidden", !o), c.find((h) => h.classList.contains("is-search-match")) ?? null;
    }
    _focusSearchResult(u, l) {
      var w;
      const o = String(u || "").trim().toLocaleLowerCase();
      if (!o) {
        (w = l.querySelector("[data-system-search]")) == null || w.focus();
        return;
      }
      const c = this._getVisibleSystems(), p = (k) => [k.displayName, k.displayType, k.displayStatus, k.factionName].filter(Boolean).join(" ").toLocaleLowerCase(), h = c.find((k) => k.displayName.toLocaleLowerCase() === o) ?? c.find((k) => k.displayName.toLocaleLowerCase().startsWith(o)) ?? c.find((k) => p(k).includes(o));
      if (!h) {
        se(`No charted ${this.activeSystemId ? "object" : "system"} matches "${String(u).trim()}".`);
        return;
      }
      this.searchQuery = String(u), this.activeSystemId ? this.selectedObjectId = h.id : this.selectedSystemId = h.id, this.selectedRouteId = null, this._centerOnSystem(h, l, Math.max(this.zoom, 1.2)), this.render({ force: !0 });
    }
    _onWheelZoom(u, l) {
      u.preventDefault();
      const o = l.querySelector(".gmf-map-stage");
      if (!o) return;
      const c = o.getBoundingClientRect(), p = this.zoom, h = ge(p + (u.deltaY < 0 ? 0.12 : -0.12), Qt, Kt), w = u.clientX - c.left, k = u.clientY - c.top, N = (w - this.panX) / p, C = (k - this.panY) / p;
      this.zoom = h, this.panX = w - N * h, this.panY = k - C * h, this._applyViewportTransform(l);
    }
    _startPan(u, l) {
      if (u.button !== 0 || u.target.closest("[data-system-id], [data-route-id], button, input")) return;
      u.preventDefault();
      const o = u.clientX, c = u.clientY, p = this.panX, h = this.panY;
      let w = !1;
      const k = (C) => {
        w = w || Math.abs(C.clientX - o) > 3 || Math.abs(C.clientY - c) > 3, this.panX = p + C.clientX - o, this.panY = h + C.clientY - c, this._applyViewportTransform(l);
      }, N = () => {
        window.removeEventListener("pointermove", k), window.removeEventListener("pointerup", N), w || (this.selectedRouteId = null, this.activeSystemId ? this.selectedObjectId = null : this.selectedSystemId = null, this.render({ force: !0 }));
      };
      window.addEventListener("pointermove", k), window.addEventListener("pointerup", N, { once: !0 });
    }
    _startSystemDrag(u, l, o) {
      var G;
      if (u.button !== 0) return;
      u.preventDefault(), u.stopPropagation(), (G = o.setPointerCapture) == null || G.call(o, u.pointerId);
      const c = u.clientX, p = u.clientY;
      let h = this._pointerToMapPercent(u, l), w = !1, k = null;
      const N = Array.from(l.querySelectorAll(`[data-route-from="${o.dataset.systemId}"]`)), C = Array.from(l.querySelectorAll(`[data-route-to="${o.dataset.systemId}"]`));
      o.classList.add("is-dragging");
      const Q = (le) => {
        const ce = Math.abs(le.clientX - c), De = Math.abs(le.clientY - p);
        w = w || ce > 3 || De > 3, h = this._pointerToMapPercent(le, l), o.dataset.dragged = w ? "true" : "false", !k && (k = requestAnimationFrame(() => {
          k = null, o.style.left = `${h.x}%`, o.style.top = `${h.y}%`, this._updateConnectedRoutes(N, C, h.x, h.y);
        }));
      }, B = async () => {
        k && cancelAnimationFrame(k), o.style.left = `${h.x}%`, o.style.top = `${h.y}%`, this._updateConnectedRoutes(N, C, h.x, h.y), o.classList.remove("is-dragging"), window.removeEventListener("pointermove", Q), window.removeEventListener("pointerup", B), w && (this.activeSystemId ? await ze(this.mapId, this.activeSystemId, o.dataset.systemId, h.x, h.y) : await Ge(this.mapId, o.dataset.systemId, h.x, h.y));
      };
      window.addEventListener("pointermove", Q), window.addEventListener("pointerup", B, { once: !0 });
    }
    _pointerToMapPercent(u, l) {
      const c = l.querySelector(".gmf-map-stage").getBoundingClientRect();
      return {
        x: ge((u.clientX - c.left - this.panX) / this.zoom / c.width * 100, 0, 100),
        y: ge((u.clientY - c.top - this.panY) / this.zoom / c.height * 100, 0, 100)
      };
    }
    _updateConnectedRoutes(u, l, o, c) {
      u.forEach((p) => {
        p.setAttribute("x1", o), p.setAttribute("y1", c);
      }), l.forEach((p) => {
        p.setAttribute("x2", o), p.setAttribute("y2", c);
      });
    }
    _openContextMenu(u, l) {
      var ce;
      if (!((ce = game.user) != null && ce.isGM) || this.playerMode || u.target.closest(".gmf-map-toolbar, .gmf-context-menu")) return;
      u.preventDefault(), u.stopPropagation();
      const o = u.target.closest("[data-route-id]"), c = u.target.closest("[data-system-id]"), p = this._pointerToMapPercent(u, l);
      this._contextTarget = o ? { type: "route", id: o.dataset.routeId, position: p } : c ? { type: "system", id: c.dataset.systemId, position: p } : { type: "stage", id: null, position: p };
      const h = l.querySelector("[data-gmf-context-menu]");
      if (!h) return;
      h.querySelectorAll("[data-context-show]").forEach((De) => {
        De.hidden = De.dataset.contextShow !== this._contextTarget.type;
      }), h.hidden = !1;
      const w = h.offsetWidth || 184, k = h.offsetHeight || 260, C = l.querySelector(".gmf-map-stage").getBoundingClientRect(), Q = u.clientX - C.left, B = u.clientY - C.top, G = Math.max(4, C.width - w - 4), le = Math.max(4, C.height - k - 4);
      h.style.left = `${ge(Q, 4, G)}px`, h.style.top = `${ge(B, 4, le)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(l), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _openStageMenuFromButton(u, l) {
      var h;
      if (!((h = game.user) != null && h.isGM) || this.playerMode) return;
      u.preventDefault(), u.stopPropagation();
      const o = l.querySelector(".gmf-map-stage"), c = o == null ? void 0 : o.getBoundingClientRect();
      if (!c) return;
      const p = {
        clientX: c.left + c.width / 2,
        clientY: c.top + c.height / 2,
        target: o,
        preventDefault: () => {
        },
        stopPropagation: () => {
        }
      };
      this._openContextMenu(p, l);
    }
    _hideContextMenu(u = null) {
      var c, p, h;
      const l = u ?? this.element ?? null, o = ((c = l == null ? void 0 : l.querySelector) == null ? void 0 : c.call(l, "[data-gmf-context-menu]")) ?? ((h = (p = l == null ? void 0 : l[0]) == null ? void 0 : p.querySelector) == null ? void 0 : h.call(p, "[data-gmf-context-menu]"));
      o && (o.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    async _handleContextAction(u, l) {
      u.preventDefault(), u.stopPropagation();
      const o = u.currentTarget.dataset.contextAction, c = this._contextTarget;
      this._hideContextMenu(l), c && (o === "add-system" ? I(this.mapId, null, { x: c.position.x, y: c.position.y }) : o === "add-entity" ? this.activeSystemId && S(this.mapId, this.activeSystemId, null, { x: c.position.x, y: c.position.y }) : o === "add-route" ? y(this.mapId) : o === "manage-factions" ? x(this.mapId) : o === "add-faction" ? L(this.mapId) : o === "edit-map-details" ? v(this.mapId) : o === "export-map" ? Ee(this.mapId) : o === "edit-system" ? I(this.mapId, c.id) : o === "edit-entity" ? this.activeSystemId && S(this.mapId, this.activeSystemId, c.id) : o === "add-route-from-system" ? y(this.mapId, null, { fromSystemId: c.id }) : o === "reveal-system" ? await q(this.mapId, c.id) : o === "hide-system" ? await re(this.mapId, c.id, !0) : o === "delete-system" ? await this._confirmDeleteSystem(c.id) : o === "reveal-entity" ? this.activeSystemId && await ne(this.mapId, this.activeSystemId, c.id, "players") : o === "hide-entity" ? this.activeSystemId && await ne(this.mapId, this.activeSystemId, c.id, "gm") : o === "delete-entity" ? this.activeSystemId && await this._confirmDeleteObject(this.activeSystemId, c.id) : o === "edit-route" ? y(this.mapId, c.id) : o === "reveal-route" ? await D(this.mapId, c.id) : o === "hide-route" ? await X(this.mapId, c.id, !0) : o === "delete-route" && await this._confirmDeleteRoute(c.id));
    }
    async _confirmDeleteSystem(u) {
      await Dialog.confirm({
        title: "Delete Star System",
        content: "<p>Delete this star system and any connected routes?</p>"
      }, wt) && await J(this.mapId, u);
    }
    async _confirmDeleteObject(u, l) {
      await Dialog.confirm({ title: "Delete Entity", content: "<p>Delete this entity and its linked content?</p>" }) && (await be(this.mapId, u, l), this.selectedObjectId = null);
    }
    async _confirmDeleteRoute(u) {
      await Dialog.confirm({
        title: "Delete Route",
        content: "<p>Delete this route?</p>"
      }, wt) && await Le(this.mapId, u);
    }
    async _travelToSystem(u, l) {
      const o = P(f(this.mapId)), c = o.systems.find((w) => w.id === o.currentSystemId), p = o.systems.find((w) => w.id === u);
      if (!p) return;
      if (!c) {
        await Z(this.mapId, p.id), se(`Current location set to ${p.name}.`);
        return;
      }
      if (c.id === p.id) {
        se(`${p.name} is already the current location.`);
        return;
      }
      if (!z(o, c.id, p.id)) {
        oe(`No direct route from ${c.name} to ${p.name}.`);
        return;
      }
      F(this.mapId, c.id, p.id), await this._animateShipTravel(c, p, l), await Z(this.mapId, p.id), se(`Arrived at ${p.name}.`);
    }
    _animateShipTravel(u, l, o) {
      const c = o.querySelector("[data-ship-layer]"), p = o.querySelector(".gmf-map-stage");
      if (!c || !p) return Promise.resolve();
      const h = p.getBoundingClientRect(), w = (l.x - u.x) * h.width / 100, k = (l.y - u.y) * h.height / 100, N = Math.atan2(k, w) * 180 / Math.PI, C = document.createElement("div");
      return C.className = "gmf-travel-ship", C.innerHTML = '<i class="fa-solid fa-rocket"></i>', C.style.left = `${u.x}%`, C.style.top = `${u.y}%`, C.style.setProperty("--gmf-ship-angle", `${N}deg`), c.replaceChildren(C), new Promise((Q) => {
        let B = !1;
        const G = () => {
          B || (B = !0, C.removeEventListener("transitionend", G), C.classList.add("is-arrived"), globalThis.setTimeout(() => {
            C.remove(), Q();
          }, 260));
        };
        C.addEventListener("transitionend", G, { once: !0 }), requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            C.style.left = `${l.x}%`, C.style.top = `${l.y}%`;
          });
        }), globalThis.setTimeout(G, Rn);
      });
    }
    _openLinkedJournal() {
      var o, c;
      const u = this._getSelectedRawSystem();
      if (!(u != null && u.journalId)) return;
      const l = (o = game.journal) == null ? void 0 : o.get(u.journalId);
      if (!l) {
        oe(`Journal "${u.journalId}" was not found.`);
        return;
      }
      (c = l.sheet) == null || c.render(!0);
    }
    _openLinkedScene() {
      const u = this._getSelectedRawSystem(), l = ((u == null ? void 0 : u.sceneIds) ?? []).map((c) => {
        var p;
        return (p = game.scenes) == null ? void 0 : p.get(c);
      }).filter(Boolean);
      if (!l.length) {
        oe("No available scene is linked to this system.");
        return;
      }
      if (l.length === 1) {
        this._viewLinkedScene(l[0]);
        return;
      }
      const o = l.map((c) => `<option value="${E(c.id)}">${E(c.name || c.id)}</option>`).join("");
      new Dialog({
        title: `Go to Scene · ${u.name}`,
        content: `<form class="gmf-scene-choice-form"><label>Linked scene<select name="sceneId" autofocus>${o}</select></label><p>Choose which linked scene to open.</p></form>`,
        render: (c) => {
          var p, h;
          return (h = (p = et(c)) == null ? void 0 : p.querySelector('[name="sceneId"]')) == null ? void 0 : h.focus();
        },
        buttons: {
          cancel: { icon: '<i class="fa-solid fa-xmark"></i>', label: "Cancel" },
          open: {
            icon: '<i class="fa-solid fa-arrow-up-right-from-square"></i>',
            label: "Go to Scene",
            callback: (c) => {
              var h, w, k;
              const p = (w = (h = et(c)) == null ? void 0 : h.querySelector('[name="sceneId"]')) == null ? void 0 : w.value;
              this._viewLinkedScene((k = game.scenes) == null ? void 0 : k.get(p));
            }
          }
        },
        default: "open"
      }, {
        classes: ["galaxy-map", "gmf-crud-dialog", "gmf-scene-choice-dialog"],
        width: 400
      }).render(!0);
    }
    _viewLinkedScene(u) {
      var l;
      u && (u != null && u.view ? u.view() : (l = u == null ? void 0 : u.sheet) == null || l.render(!0));
    }
    _getSelectedRawSystem() {
      var l;
      const u = P(f(this.mapId));
      return this.activeSystemId ? ((l = u.systems.find((o) => o.id === this.activeSystemId)) == null ? void 0 : l.objects.find((o) => o.id === this.selectedObjectId)) ?? null : u.systems.find((o) => o.id === this.selectedSystemId) ?? null;
    }
    async close(u = {}) {
      var l, o;
      return (o = (l = this._bountyIntelCallout) == null ? void 0 : l.dispose) == null || o.call(l), this._bountyIntelCallout = null, this._disposePlanetRenderer(), this._hideContextMenu(), this._externalFocusTimeout && globalThis.clearTimeout(this._externalFocusTimeout), this._externalFocusTimeout = null, _e(this), super.close(u);
    }
    _disposePlanetRenderer() {
      var u, l, o;
      this._planetGeneration++, (l = (u = this._planetLocationCallout) == null ? void 0 : u.dispose) == null || l.call(u), this._planetLocationCallout = null, (o = this._planetRenderer) == null || o.dispose(), this._planetRenderer = null;
    }
    _setPlanetFallback(u, l) {
      const o = u.querySelector(".gmf-planet-fallback");
      o && (o.style.backgroundImage = l.texture ? `url(${JSON.stringify(l.texture)})` : "none", o.style.backgroundColor = l.color);
      const c = u.querySelector("[data-planet-canvas]");
      c && (c.dataset.planetShape = l.shape);
      const p = u.querySelector(".gmf-planet-stage");
      p == null || p.style.setProperty("--gmf-planet-color", l.color);
    }
    async _mountPlanetRenderer(u, l) {
      var k, N, C;
      const o = u.querySelector("[data-planet-canvas]");
      if (!o || !l) return;
      this._setPlanetFallback(u, l);
      const c = this._planetGeneration, p = u.querySelector("[data-planet-status]"), h = u.querySelector("[data-action='planet-static']"), w = u.querySelectorAll("[data-planet-control]");
      if (h) {
        const Q = this.planetStatic ? "Enable 3D" : "Static view";
        h.setAttribute("title", Q), h.setAttribute("aria-label", Q), h.setAttribute("aria-pressed", String(this.planetStatic));
        const B = h.querySelector("i");
        B && (B.className = this.planetStatic ? "fa-solid fa-cube" : "fa-solid fa-image");
      }
      if (this.planetStatic) {
        p && (p.textContent = "Static preview · Enable 3D to rotate and zoom"), w.forEach((Q) => Q.disabled = !0);
        return;
      }
      try {
        const { createPlanetRenderer: Q } = await import("./chunks/planet-renderer-DzuKoeRx.js");
        if (c !== this._planetGeneration || !o.isConnected) return;
        w.forEach((B) => B.disabled = !1), this._planetRenderer = Q(o, {
          texture: l.texture,
          color: l.color,
          shape: l.shape,
          finish: l.finish,
          detailStrength: l.detailStrength,
          locations: ((k = this._getPlanetObject()) == null ? void 0 : k.planetLocations) ?? [],
          canPlaceLocations: !!((N = game.user) != null && N.isGM && !this.playerMode),
          onLocationDrop: (B, G) => void this._placePlanetLocation(B, G, u),
          onInvalidLocationDrop: () => oe("Drop the scene directly onto the visible 3D surface."),
          onMarkerHover: (B) => {
            var le, ce;
            const G = this._getPlanetLocationItem(B.id);
            G && ((ce = (le = this._planetLocationCallout) == null ? void 0 : le.show) == null || ce.call(le, G));
          },
          onMarkerLeave: () => {
            var B, G;
            return (G = (B = this._planetLocationCallout) == null ? void 0 : B.scheduleHide) == null ? void 0 : G.call(B);
          },
          onMarkerPosition: (B) => {
            var G, le;
            return (le = (G = this._planetLocationCallout) == null ? void 0 : G.setAnchor) == null ? void 0 : le.call(G, B);
          },
          onMarkerOpen: (B) => this._openPlanetLocation(B.id),
          onMarkerContextMenu: (C = game.user) != null && C.isGM && !this.playerMode ? (B) => void this._removePlanetLocation(B.id, u) : null,
          isVisible: () => !this.minimized && !this._minimized,
          onStatus: (B) => {
            p && (p.textContent = B);
          },
          onPaused: (B) => {
            const G = u.querySelector("[data-action='planet-pause']");
            if (G) {
              const le = B ? "Resume rotation" : "Pause rotation";
              G.setAttribute("title", le), G.setAttribute("aria-label", le), G.setAttribute("aria-pressed", String(B));
              const ce = G.querySelector("i");
              ce && (ce.className = B ? "fa-solid fa-play" : "fa-solid fa-pause");
            }
          },
          onStopped: () => {
            w.forEach((B) => B.disabled = !0), p && (p.textContent = "Static preview · Reopen this detail view to resume 3D");
          }
        }), this._planetLocationCallout = Gs({ host: o });
      } catch {
        w.forEach((Q) => Q.disabled = !0), p && (p.textContent = "3D could not be loaded. Static preview shown.");
      }
    }
  }, te(ke, "DEFAULT_OPTIONS", {
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
  }), te(ke, "PARTS", {
    main: {
      template: `${d}/galaxy-map.hbs`
    }
  }), ke;
}
const $e = "galaxy-map", en = "maps", Gt = "schemaV1Backup", tn = "surfaceLocationRecoveryV2", ee = `module.${$e}`, It = `modules/${$e}/templates`;
(() => {
  let n = null;
  const d = /* @__PURE__ */ new Map();
  let f = null;
  const g = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Set(), S = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
  function y(e) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? {}));
  }
  function L(e) {
    var t;
    (t = ui.notifications) == null || t.error(`[Galaxy Map] ${e}`);
  }
  function x(e) {
    var t;
    (t = ui.notifications) == null || t.info(`[Galaxy Map] ${e}`);
  }
  function v(e = "change galaxy maps") {
    var t;
    return (t = game.user) != null && t.isGM ? !0 : (L(`Only a GM can ${e}.`), !1);
  }
  function q() {
    var e;
    return ((e = game.users) == null ? void 0 : e.contents) ?? Array.from(game.users ?? []);
  }
  function D() {
    return q().filter((e) => e.active);
  }
  function re() {
    return D().filter((e) => e.isGM).sort((e, t) => String(e.id).localeCompare(String(t.id)))[0] ?? null;
  }
  function ne() {
    var e, t;
    return !!((e = game.user) != null && e.isGM && ((t = re()) == null ? void 0 : t.id) === game.user.id);
  }
  function X() {
    return y(game.settings.get($e, en) ?? {});
  }
  async function J(e) {
    return v("save galaxy map data") && await game.settings.set($e, en, e ?? {}), e;
  }
  function be(e) {
    var vn, bn;
    const t = et(e), i = (t == null ? void 0 : t.ownerDocument) ?? window.document, a = new AbortController(), s = t ? new MutationObserver(() => {
      t.isConnected || (a.abort(), s.disconnect());
    }) : null;
    t && i.body && (s == null || s.observe(i.body, { childList: !0, subtree: !0 }));
    let r = null;
    const m = (U = !1) => {
      if (!r) return;
      const H = r.closest("[data-linked-documents]");
      r.hidden = !0, r.style.removeProperty("left"), r.style.removeProperty("top"), r.style.removeProperty("width");
      const Y = (H == null ? void 0 : H.querySelector("[data-open-document-picker]")) ?? null;
      Y == null || Y.setAttribute("aria-expanded", "false"), r = null, U && (Y == null || Y.focus());
    }, M = () => {
      var Ke;
      if (!r || r.hidden) return;
      const U = ((Ke = r.closest("[data-linked-documents]")) == null ? void 0 : Ke.querySelector("[data-open-document-picker]")) ?? null;
      if (!U) return;
      const H = i.documentElement.clientWidth, Y = i.documentElement.clientHeight, W = Math.min(320, H - 24);
      r.style.width = `${W}px`;
      const me = U.getBoundingClientRect(), Ve = r.getBoundingClientRect(), Ze = Math.max(12, Math.min(me.right - W, H - W - 12)), Qe = me.bottom + 6, He = Qe + Ve.height <= Y - 12 ? Qe : Math.max(12, me.top - Ve.height - 6);
      r.style.left = `${Ze}px`, r.style.top = `${He}px`;
    };
    i.addEventListener("pointerdown", (U) => {
      var W;
      if (!r) return;
      const H = U.target, Y = (W = r.closest("[data-linked-documents]")) == null ? void 0 : W.querySelector("[data-open-document-picker]");
      !r.contains(H) && !(Y != null && Y.contains(H)) && m();
    }, { signal: a.signal }), i.addEventListener("keydown", (U) => {
      U.key !== "Escape" || !r || (U.preventDefault(), U.stopPropagation(), m(!0));
    }, { capture: !0, signal: a.signal }), i.addEventListener("scroll", M, { capture: !0, passive: !0, signal: a.signal }), (vn = i.defaultView) == null || vn.addEventListener("resize", M, { signal: a.signal }), t == null || t.querySelectorAll("[data-browse-target]").forEach((U) => {
      U.addEventListener("click", (H) => {
        H.preventDefault();
        const Y = t.querySelector(`[name="${U.dataset.browseTarget}"]`);
        Y && new FilePicker({
          type: "image",
          current: Y.value,
          callback: (W) => {
            Y.value = W, Y.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        }).browse();
      });
    });
    const A = Array.from((t == null ? void 0 : t.querySelectorAll("[data-system-editor-tab]")) ?? []), $ = Array.from((t == null ? void 0 : t.querySelectorAll("[data-system-editor-panel]")) ?? []), R = (U, H = !1) => {
      m(), A.forEach((Y) => {
        const W = Y.dataset.systemEditorTab === U;
        Y.classList.toggle("is-active", W), Y.setAttribute("aria-selected", String(W)), Y.tabIndex = W ? 0 : -1, W && H && Y.focus();
      }), $.forEach((Y) => {
        Y.hidden = Y.dataset.systemEditorPanel !== U;
      });
    };
    A.forEach((U, H) => {
      U.addEventListener("click", () => R(U.dataset.systemEditorTab ?? "overview")), U.addEventListener("keydown", (Y) => {
        if (!["ArrowLeft", "ArrowRight"].includes(Y.key)) return;
        Y.preventDefault();
        const W = Y.key === "ArrowRight" ? 1 : -1, me = A[(H + W + A.length) % A.length];
        R(me.dataset.systemEditorTab ?? "overview", !0);
      });
    }), A.length && R("overview"), t == null || t.querySelectorAll("[data-marker-preview]").forEach((U) => {
      const H = U.closest("form"), Y = (H == null ? void 0 : H.querySelector('[name="iconStyle"]')) ?? null, W = (H == null ? void 0 : H.querySelector('[name="type"]')) ?? null, me = (H == null ? void 0 : H.querySelector('[name="status"]')) ?? null, Ve = (H == null ? void 0 : H.querySelector('[name="iconColor"]')) ?? null, Ze = (H == null ? void 0 : H.querySelector('[name="iconSize"]')) ?? null, Qe = (H == null ? void 0 : H.querySelector('[name="pulse"]')) ?? null, He = (H == null ? void 0 : H.querySelector('[name="name"]')) ?? null, Ke = U.querySelector("[data-marker-preview-system]"), ot = U.querySelector("[data-marker-preview-icon]"), _t = U.querySelector("[data-marker-preview-label]");
      let Lt = 0;
      const lt = async () => {
        if (!Ke || !ot) return;
        const Ue = (W == null ? void 0 : W.value) ?? "unknown", Dt = (me == null ? void 0 : me.value) ?? "known", Mt = Ee(Ue, (Y == null ? void 0 : Y.value) ?? "planet");
        Ke.className = `gmf-system gmf-system--${Ue} gmf-icon--${Mt} gmf-status--${Dt}${Qe != null && Qe.checked ? " is-marker-preview-pulsing" : " gmf-no-pulse"}`, Ke.style.setProperty("--gmf-faction-color", (Ve == null ? void 0 : Ve.value) || "#58d8ff"), Ke.style.setProperty("--gmf-system-size", `${(Ze == null ? void 0 : Ze.value) || 28}px`), _t && (_t.textContent = (He == null ? void 0 : He.value.trim()) || "New System");
        const fe = ++Lt;
        if (sn.includes(Mt)) {
          const Me = await renderTemplate(`${It}/celestial-icon.hbs`, { system: { iconStyle: Mt } });
          fe === Lt && (ot.innerHTML = Me);
        } else
          ot.innerHTML = '<span class="gmf-system__core"></span>';
      };
      for (const Ue of [Y, W, me, Ve, Ze, Qe, He])
        Ue == null || Ue.addEventListener("input", lt), Ue == null || Ue.addEventListener("change", lt);
      lt();
    }), t == null || t.querySelectorAll("[data-linked-documents]").forEach((U) => {
      var Dt, Mt;
      const H = U.querySelector("[data-linked-document-list]"), Y = U.querySelector("[data-document-picker]"), W = U.querySelector("[data-document-search]"), me = U.querySelector("[data-document-results]"), Ve = ((Dt = game[U.dataset.collection]) == null ? void 0 : Dt.contents) ?? [], Ze = U.dataset.inputName ?? "documentId", Qe = U.dataset.multiple === "true", He = U.dataset.kindLabel ?? "Document", Ke = U.dataset.iconClass ?? "fa-file", ot = U.querySelector("[data-open-document-picker]"), _t = () => new Set(Array.from((H == null ? void 0 : H.querySelectorAll(`input[name="${Ze}"]`)) ?? []).map((fe) => fe.value)), Lt = () => {
        const fe = U.querySelector("[data-linked-document-empty]");
        fe && (fe.hidden = !!(H != null && H.querySelector("[data-linked-document]")));
      }, lt = () => {
        if (!me) return;
        const fe = (W == null ? void 0 : W.value.trim().toLocaleLowerCase()) ?? "", Me = _t(), xe = Ve.filter((Ie) => !Me.has(String(Ie.id))).filter((Ie) => !fe || String(Ie.name ?? Ie.id).toLocaleLowerCase().includes(fe));
        me.replaceChildren();
        for (const Ie of xe.slice(0, 50)) {
          const ct = window.document.createElement("button");
          ct.type = "button", ct.className = "gmf-document-picker__result", ct.dataset.documentId = String(Ie.id), ct.textContent = String(Ie.name ?? Ie.id), me.append(ct);
        }
        if (xe.length) {
          if (xe.length > 50) {
            const Ie = window.document.createElement("p");
            Ie.textContent = `${xe.length - 50} more results — refine your search.`, me.append(Ie);
          }
        } else {
          const Ie = window.document.createElement("p");
          Ie.textContent = Ve.length ? `No matching ${He.toLocaleLowerCase()}s.` : `No ${He.toLocaleLowerCase()}s exist in this world yet.`, me.append(Ie);
        }
      }, Ue = (fe) => {
        if (!H || _t().has(String(fe.id))) return;
        Qe || H.querySelectorAll("[data-linked-document]").forEach((ys) => ys.remove());
        const Me = i.createElement("div");
        Me.className = "gmf-linked-document", Me.dataset.linkedDocument = "", Me.dataset.documentId = String(fe.id);
        const xe = i.createElement("i");
        xe.className = `fa-solid ${Ke} gmf-linked-document__icon`, xe.setAttribute("aria-hidden", "true");
        const Ie = i.createElement("span");
        Ie.className = "gmf-linked-document__copy";
        const ct = i.createElement("strong");
        ct.textContent = String(fe.name ?? fe.id);
        const In = i.createElement("small");
        In.textContent = He, Ie.append(ct, In);
        const Rt = i.createElement("input");
        Rt.type = "hidden", Rt.name = Ze, Rt.value = String(fe.id);
        const vt = i.createElement("button");
        vt.type = "button", vt.dataset.unlinkDocument = "", vt.title = `Remove ${He.toLocaleLowerCase()}`, vt.setAttribute("aria-label", vt.title), vt.innerHTML = '<i class="fa-solid fa-xmark"></i><span>Unlink</span>', Me.append(xe, Ie, Rt, vt), H.append(Me), Lt(), lt(), m(!0);
      };
      H == null || H.addEventListener("click", (fe) => {
        var xe;
        const Me = fe.target.closest("[data-unlink-document]");
        Me && ((xe = Me.closest("[data-linked-document]")) == null || xe.remove(), Lt(), lt());
      }), ot == null || ot.addEventListener("click", () => {
        if (Y) {
          if (r === Y) return m(!0);
          m(), r = Y, Y.hidden = !1, ot.setAttribute("aria-expanded", "true"), lt(), requestAnimationFrame(() => {
            M(), W == null || W.focus(), W == null || W.select();
          });
        }
      }), (Mt = U.querySelector("[data-close-document-picker]")) == null || Mt.addEventListener("click", () => m(!0)), W == null || W.addEventListener("input", lt), W == null || W.addEventListener("keydown", (fe) => {
        var Me, xe;
        fe.key === "ArrowDown" && (fe.preventDefault(), (Me = me == null ? void 0 : me.querySelector("[data-document-id]")) == null || Me.focus()), fe.key === "Enter" && (fe.preventDefault(), fe.stopPropagation(), (xe = me == null ? void 0 : me.querySelector("[data-document-id]")) == null || xe.click());
      }), me == null || me.addEventListener("click", (fe) => {
        const Me = fe.target.closest("[data-document-id]"), xe = Ve.find((Ie) => String(Ie.id) === (Me == null ? void 0 : Me.dataset.documentId));
        xe && Ue(xe);
      }), Lt();
    });
    const V = t == null ? void 0 : t.querySelector("[data-texture-upload-fields]"), _ = t == null ? void 0 : t.querySelector('[name="planetTexture"]'), ve = t == null ? void 0 : t.querySelector("[data-color-appearance-fields]"), ue = t == null ? void 0 : t.querySelector("[data-texture-upload-status]"), Be = t == null ? void 0 : t.querySelector('[name="planetPreset"]'), St = t == null ? void 0 : t.querySelector('[name="planetShape"]'), j = t == null ? void 0 : t.querySelector('[name="planetDetailStrength"]'), Ce = t == null ? void 0 : t.querySelector("[data-surface-strength-output]"), he = t == null ? void 0 : t.querySelector("[data-texture-guide]"), We = (t == null ? void 0 : t.querySelectorAll("[data-texture-guide-preview]")) ?? [], Et = () => {
      const U = (Be == null ? void 0 : Be.value) === "custom";
      return V && (V.hidden = !U), ve && (ve.hidden = (Be == null ? void 0 : Be.value) !== "color"), _ && (_.required = U), U;
    }, ps = () => {
      var H;
      if (!he) return;
      const U = (H = _ == null ? void 0 : _.value) == null ? void 0 : H.trim();
      U ? (he.dataset.hasTexture = "true", ue && (ue.textContent = "Loading custom texture preview…"), We.forEach((Y) => {
        Y.hidden = !1, Y.onload = () => {
          var W;
          ((W = _ == null ? void 0 : _.value) == null ? void 0 : W.trim()) === U && ue && (ue.textContent = "Custom texture selected · visible beneath the guide");
        }, Y.onerror = () => {
          var W;
          Y.hidden = !0, ((W = _ == null ? void 0 : _.value) == null ? void 0 : W.trim()) === U && ue && (ue.textContent = "Custom texture selected, but its preview could not be loaded");
        }, Y.src = U;
      })) : (delete he.dataset.hasTexture, We.forEach((Y) => {
        Y.onload = null, Y.onerror = null, Y.removeAttribute("src"), Y.hidden = !0;
      }));
    }, Sn = () => {
      var U;
      ue && (ue.textContent = (U = _ == null ? void 0 : _.value) != null && U.trim() ? "Loading custom texture preview…" : "Choose an image to preview it beneath the guide"), ps();
    };
    Be == null || Be.addEventListener("change", () => {
      !Et() && (_ != null && _.value) && (_.value = "", _.dispatchEvent(new Event("change", { bubbles: !0 })));
    }), (bn = t == null ? void 0 : t.querySelector("[data-clear-planet-texture]")) == null || bn.addEventListener("click", () => {
      _ && (_.value = "", _.dispatchEvent(new Event("change", { bubbles: !0 })));
    }), _ == null || _.addEventListener("change", Sn), St == null || St.addEventListener("change", () => {
      he && (he.dataset.shape = St.value);
    }), j == null || j.addEventListener("input", () => {
      Ce && (Ce.value = `${j.value}%`);
    }), Et(), Sn();
  }
  function Le({ title: e, content: t, submitLabel: i = "Save", onSubmit: a, render: s = be, width: r = 700, height: m = "auto", dialogClass: M = "" }) {
    new Dialog({
      title: e,
      content: t,
      render: s,
      buttons: {
        cancel: {
          icon: '<i class="fa-solid fa-xmark"></i>',
          label: "Cancel"
        },
        save: {
          icon: '<i class="fa-solid fa-floppy-disk"></i>',
          label: i,
          callback: (A) => {
            var _, ve;
            const $ = et(A), R = (_ = $ == null ? void 0 : $.matches) != null && _.call($, "form") ? $ : $ == null ? void 0 : $.querySelector("form"), V = R ? Array.from(R.elements).find((ue) => ue.willValidate && !ue.checkValidity()) : null;
            if (V) {
              const ue = V.closest("[data-system-editor-panel]");
              return ue != null && ue.dataset.systemEditorPanel && ((ve = $.querySelector(`[data-system-editor-tab="${ue.dataset.systemEditorPanel}"]`)) == null || ve.click()), V.reportValidity(), V.focus(), !1;
            }
            return a(Hs(A));
          }
        }
      },
      default: "save"
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog", M].filter(Boolean),
      width: r,
      height: m
    }).render(!0);
  }
  function Z(e) {
    const t = X();
    return t[e] ? y(t[e]) : null;
  }
  function Pe(e) {
    return new Map((e ?? []).map((t) => [t.id, t]));
  }
  function je(e) {
    return e.visibility === "players";
  }
  function Oe(e, t) {
    return t && e.status === "undiscovered";
  }
  function Ee(e, t) {
    return t === "planet" ? { station: "station", anomaly: "diamond", ruins: "diamond", unknown: "diamond" }[e] ?? t : t;
  }
  function z(e, { playerMode: t = !1, selectedSystemId: i = null, selectedRouteId: a = null } = {}) {
    var Be, St;
    const s = P(e), r = t ? s.systems.filter(je) : s.systems, m = new Set(r.map((j) => j.id)), M = t ? s.factions.filter((j) => j.visibility === "players") : s.factions, A = Pe(M), $ = r.map((j) => {
      const Ce = A.get(j.factionId), he = Oe(j, t), We = he ? "unknown" : j.type, Et = he ? "diamond" : Ee(We, j.iconStyle);
      return {
        ...j,
        image: j.image,
        sceneIds: [...j.sceneIds],
        journalId: j.journalId,
        planetPreset: j.planetPreset,
        planetShape: j.planetShape,
        planetTexture: j.planetTexture,
        planetColor: j.planetColor,
        iconStyle: Et,
        displayName: he ? "???" : j.name,
        displayDescription: he ? "Unresolved sensor contact. Details are not available." : j.description,
        displayType: We,
        displayStatus: he ? "undiscovered" : j.status,
        factionName: (Ce == null ? void 0 : Ce.name) ?? "Unaffiliated",
        factionColor: j.iconColor || (Ce == null ? void 0 : Ce.color) || "#58d8ff",
        obscured: he,
        isCurrent: j.id === s.currentSystemId,
        isSelected: j.id === i,
        gmOnly: j.visibility === "gm",
        animatedCelestial: sn.includes(Et),
        hasAlert: ["danger", "locked"].includes(he ? "undiscovered" : j.status),
        alertLabel: j.status === "danger" ? "Hazard advisory" : j.status === "locked" ? "Restricted access" : "",
        hasJournal: !!(!he && j.journalId),
        hasScenes: !!(!he && j.sceneIds.length),
        showImage: !!(!he && j.image),
        canInspectSystem: !!dt({ ...j, planetPreset: j.planetPreset, planetShape: j.planetShape, planetTexture: j.planetTexture, planetColor: j.planetColor, obscured: he })
      };
    }), R = s.routes.filter((j) => !t || j.visibility === "players").filter((j) => m.has(j.fromSystemId) && m.has(j.toSystemId)).map((j) => {
      const Ce = $.find((We) => We.id === j.fromSystemId), he = $.find((We) => We.id === j.toSystemId);
      return {
        ...j,
        from: Ce,
        to: he,
        fromName: (Ce == null ? void 0 : Ce.displayName) ?? j.fromSystemId,
        toName: (he == null ? void 0 : he.displayName) ?? j.toSystemId,
        isSelected: j.id === a,
        connectsCurrent: j.fromSystemId === s.currentSystemId || j.toSystemId === s.currentSystemId,
        gmOnly: j.visibility === "gm"
      };
    }), V = R.find((j) => j.id === a) ?? null, _ = V ? null : $.find((j) => j.id === i) ?? null;
    _ && (_.isSelected = !0);
    const ve = $.find((j) => j.id === s.currentSystemId) ?? $[0] ?? null, ue = _ && ve && _.id !== ve.id ? R.find((j) => j.fromSystemId === ve.id && j.toSystemId === _.id || j.toSystemId === ve.id && j.fromSystemId === _.id) : null;
    return _ && (_.canTravel = !!ue, _.travelRouteId = (ue == null ? void 0 : ue.id) ?? "", _.isCurrent = _.id === (ve == null ? void 0 : ve.id), _.isDestination = !!(ue && !_.isCurrent)), R.forEach((j) => {
      j.isActive = j.isSelected || j.id === (ue == null ? void 0 : ue.id);
    }), {
      ...s,
      systems: $,
      routes: R,
      factions: M,
      selectedSystem: _,
      selectedRoute: V,
      currentSystem: ve,
      selectedType: V ? "route" : _ ? "system" : null,
      playerMode: t,
      isGM: ((Be = game.user) == null ? void 0 : Be.isGM) ?? !1,
      canEdit: ((St = game.user) == null ? void 0 : St.isGM) && !t
    };
  }
  async function F(e = {}) {
    if (!v("create galaxy maps")) return null;
    const t = X(), i = P(e);
    return t[i.id] = i, await J(t), de(i.id), y(i);
  }
  async function se(e, t = {}) {
    if (!v("update galaxy maps")) return null;
    const i = X();
    if (!i[e])
      return L(`Map "${e}" was not found.`), null;
    const a = P({ ...t, id: e });
    return i[e] = a, await J(i), de(e), y(a);
  }
  async function oe(e, t = {}) {
    if (!v("update galaxy map metadata")) return null;
    const i = Z(e);
    return i ? se(e, {
      ...i,
      title: t.title,
      subtitle: t.subtitle,
      description: t.description,
      backgroundImage: t.backgroundImage,
      visibility: t.visibility
    }) : (L(`Map "${e}" was not found.`), null);
  }
  async function Ge(e) {
    if (!v("delete galaxy maps")) return !1;
    const t = X();
    return t[e] ? (delete t[e], await J(t), rs(e), de(), !0) : !1;
  }
  async function ze(e) {
    if (!v("duplicate galaxy maps")) return null;
    const t = Z(e);
    if (!t)
      return L(`Map "${e}" was not found.`), null;
    const i = P({
      ...t,
      id: Ae("map"),
      title: `${t.title} Copy`
    }), a = X();
    return a[i.id] = i, await J(a), de(i.id), y(i);
  }
  async function K(e, t = {}) {
    var V;
    if (!v("save star systems")) return null;
    const i = X();
    if (!i[e])
      return L(`Map "${e}" was not found.`), null;
    const a = P(i[e]), s = a.systems.find((_) => _.id === t.id), r = t.objects ?? (s == null ? void 0 : s.objects) ?? [], m = (s == null ? void 0 : s.primaryObjectId) || ((V = r[0]) == null ? void 0 : V.id), M = ["image", "sceneIds", "planetLocations", "journalId", "planetPreset", "planetShape", "planetFinish", "planetDetailStrength", "planetTexture", "planetColor"], A = r.map((_) => _.id !== m ? _ : $t({
      ..._,
      ...Object.fromEntries(M.filter((ve) => t[ve] !== void 0).map((ve) => [ve, t[ve]]))
    })), $ = qt({ ...s, ...t, objects: A }), R = a.systems.findIndex((_) => _.id === $.id);
    return R >= 0 ? a.systems[R] = $ : a.systems.push($), i[e] = P(a), await J(i), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), y($);
  }
  async function O(e, t, i = {}) {
    if (!v("save entities")) return null;
    const a = X();
    if (!a[e]) return null;
    const s = P(a[e]), r = s.systems.find((A) => A.id === t);
    if (!r) return null;
    const m = $t(i), M = r.objects.findIndex((A) => A.id === m.id);
    return M >= 0 ? r.objects[M] = m : r.objects.push(m), r.primaryObjectId || (r.primaryObjectId = m.id), a[e] = P(s), await J(a), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), y(m);
  }
  function pe(e, t, i) {
    var a;
    for (const s of Ut(e)) (a = s.refreshPlanetLocations) == null || a.call(s, t, i);
  }
  async function qe(e, t, i, a = {}) {
    if (!v("place surface locations")) return null;
    const s = X(), r = s[e] ? P(s[e]) : null, m = r == null ? void 0 : r.systems.find((V) => V.id === t), M = m == null ? void 0 : m.objects.find((V) => V.id === i);
    if (!r || !m || !M) return null;
    const A = String(a.sceneId || "");
    if (!M.sceneIds.includes(A))
      return L("Only scenes linked to this object can be placed on its surface."), null;
    const $ = Fn(a), R = M.planetLocations.findIndex((V) => V.sceneId === A && V.shape === $.shape);
    return R >= 0 && ($.id = M.planetLocations[R].id), R >= 0 ? M.planetLocations[R] = $ : M.planetLocations.push($), s[e] = P(r), await J(s), pe(e, t, i), game.socket.emit(ee, { action: "planet-locations", mapId: e, systemId: t, objectId: i }), y($);
  }
  async function Te(e, t, i, a) {
    var A;
    if (!v("remove surface locations")) return !1;
    const s = X(), r = s[e] ? P(s[e]) : null, m = (A = r == null ? void 0 : r.systems.find(($) => $.id === t)) == null ? void 0 : A.objects.find(($) => $.id === i);
    if (!r || !m) return !1;
    const M = m.planetLocations.length;
    return m.planetLocations = m.planetLocations.filter(($) => $.id !== a), m.planetLocations.length === M ? !1 : (s[e] = P(r), await J(s), pe(e, t, i), game.socket.emit(ee, { action: "planet-locations", mapId: e, systemId: t, objectId: i }), !0);
  }
  async function _e(e, t, i, a) {
    var m;
    if (!v("unlink scenes from entities")) return !1;
    const s = Z(e), r = (m = s == null ? void 0 : s.systems.find((M) => M.id === t)) == null ? void 0 : m.objects.find((M) => M.id === i);
    return r != null && r.sceneIds.includes(a) ? !!await O(e, t, { ...r, sceneIds: r.sceneIds.filter((M) => M !== a) }) : !1;
  }
  async function ke(e, t, i) {
    var m;
    if (!v("delete entities")) return !1;
    const a = X();
    if (!a[e]) return !1;
    const s = P(a[e]), r = s.systems.find((M) => M.id === t);
    return r ? (r.objects = r.objects.filter((M) => M.id !== i), r.primaryObjectId === i && (r.primaryObjectId = ((m = r.objects[0]) == null ? void 0 : m.id) ?? ""), s.currentLocation.objectId === i && (s.currentLocation.objectId = r.primaryObjectId), a[e] = P(s), await J(a), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function Se(e, t, i) {
    var A;
    if (!v("move entities")) return null;
    const a = X();
    if (!a[e]) return null;
    const s = P(a[e]), r = s.systems.find(($) => $.objects.some((R) => R.id === t)), m = s.systems.find(($) => $.id === i), M = r == null ? void 0 : r.objects.find(($) => $.id === t);
    return !r || !m || !M ? null : (r.objects = r.objects.filter(($) => $.id !== t), m.objects.push(M), r.primaryObjectId === t && (r.primaryObjectId = ((A = r.objects[0]) == null ? void 0 : A.id) ?? ""), m.primaryObjectId || (m.primaryObjectId = t), s.currentLocation.objectId === t && (s.currentLocation.systemId = m.id), a[e] = P(s), await J(a), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), y(M));
  }
  async function Ye(e, t, i) {
    if (!v("set the arrival object")) return null;
    const a = X();
    if (!a[e]) return null;
    const s = P(a[e]), r = s.systems.find((m) => m.id === t);
    return r != null && r.objects.some((m) => m.id === i) ? (r.primaryObjectId = i, s.currentLocation.systemId === t && !s.currentLocation.objectId && (s.currentLocation.objectId = i), a[e] = P(s), await J(a), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), y(r)) : null;
  }
  async function u(e, t, i) {
    var $;
    if (!v("merge star systems") || !t || !i || t === i) return null;
    const a = X();
    if (!a[e]) return null;
    const s = P(a[e]), r = s.systems.find((R) => R.id === t), m = s.systems.find((R) => R.id === i);
    if (!r || !m) return null;
    const M = new Set(m.objects.map((R) => R.id));
    m.objects.push(...r.objects.filter((R) => !M.has(R.id))), m.primaryObjectId || (m.primaryObjectId = r.primaryObjectId || (($ = m.objects[0]) == null ? void 0 : $.id) || ""), s.systems = s.systems.filter((R) => R.id !== t);
    const A = /* @__PURE__ */ new Set();
    return s.routes = s.routes.map((R) => ({
      ...R,
      fromSystemId: R.fromSystemId === t ? i : R.fromSystemId,
      toSystemId: R.toSystemId === t ? i : R.toSystemId
    })).filter((R) => {
      if (R.fromSystemId === R.toSystemId) return !1;
      const V = [R.fromSystemId, R.toSystemId].sort().join(":");
      return A.has(V) ? !1 : (A.add(V), !0);
    }), s.currentLocation.systemId === t && (s.currentLocation.systemId = i), s.currentSystemId = s.currentLocation.systemId, a[e] = P(s), await J(a), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), y(m);
  }
  async function l(e, t, i, a, s) {
    var A;
    const r = X();
    if (!r[e]) return null;
    const m = P(r[e]), M = (A = m.systems.find(($) => $.id === t)) == null ? void 0 : A.objects.find(($) => $.id === i);
    return M ? (M.x = ge(Re(a, M.x), 0, 100), M.y = ge(Re(s, M.y), 0, 100), r[e] = P(m), await J(r), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), y(M)) : null;
  }
  async function o(e, t, i, a) {
    var M;
    if (!v("change object visibility")) return null;
    const s = X();
    if (!s[e]) return null;
    const r = P(s[e]), m = (M = r.systems.find((A) => A.id === t)) == null ? void 0 : M.objects.find((A) => A.id === i);
    return m ? (m.visibility = nn.includes(a) ? a : "inherit", m.visibility === "players" && ["undiscovered", "locked"].includes(m.status) && (m.status = "known"), s[e] = P(r), await J(s), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), y(m)) : null;
  }
  async function c(e, t) {
    var s;
    if (!v("delete star systems")) return !1;
    const i = X(), a = i[e];
    return a ? (a.systems = a.systems.filter((r) => r.id !== t), a.routes = a.routes.filter((r) => r.fromSystemId !== t && r.toSystemId !== t), a.currentSystemId === t && (a.currentSystemId = ((s = a.systems[0]) == null ? void 0 : s.id) ?? ""), i[e] = P(a), await J(i), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function p(e, t) {
    var r;
    if (!v("set current location")) return null;
    const i = X(), a = i[e] ? P(i[e]) : null, s = (r = a == null ? void 0 : a.systems) == null ? void 0 : r.find((m) => m.id === t);
    return s ? (a.currentSystemId = t, i[e] = P(a), await J(i), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), y(s)) : (L(`System "${t}" was not found.`), null);
  }
  async function h(e, t, i) {
    if (!v("set current location")) return null;
    const a = X();
    if (!a[e]) return null;
    const s = P(a[e]), r = s.systems.find((M) => M.id === t), m = r == null ? void 0 : r.objects.find((M) => M.id === i);
    return !r || !m ? null : (s.currentSystemId = t, s.currentLocation = { systemId: t, objectId: i }, a[e] = P(s), await J(a), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), y(m));
  }
  async function w(e, t = {}) {
    if (!v("save routes")) return null;
    const i = X(), a = i[e];
    if (!a)
      return L(`Map "${e}" was not found.`), null;
    const s = Ht(t);
    if (!s.fromSystemId || !s.toSystemId || s.fromSystemId === s.toSystemId)
      return L("Routes require two different systems."), null;
    const r = a.routes.findIndex((m) => m.id === s.id);
    return r >= 0 ? a.routes[r] = s : a.routes.push(s), i[e] = P(a), await J(i), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), y(s);
  }
  async function k(e, t) {
    if (!v("delete routes")) return !1;
    const i = X(), a = i[e];
    return a ? (a.routes = a.routes.filter((s) => s.id !== t), i[e] = P(a), await J(i), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), !0) : !1;
  }
  async function N(e, t = {}) {
    if (!v("save factions")) return null;
    const i = X(), a = i[e];
    if (!a)
      return L(`Map "${e}" was not found.`), null;
    const s = rn(t), r = a.factions.findIndex((m) => m.id === s.id);
    return r >= 0 ? a.factions[r] = s : a.factions.push(s), i[e] = P(a), await J(i), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), y(s);
  }
  async function C(e, t) {
    if (!v("delete factions")) return !1;
    const i = X(), a = i[e];
    if (!a) return !1;
    a.factions = a.factions.filter((s) => s.id !== t);
    for (const s of a.systems) {
      s.factionId === t && (s.factionId = "");
      for (const r of s.objects ?? []) r.factionId === t && (r.factionId = "");
    }
    return i[e] = P(a), await J(i), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), !0;
  }
  async function Q(e, t, i = !0) {
    var m;
    if (!v(i ? "hide factions" : "reveal factions")) return null;
    const a = X(), s = a[e], r = (m = s == null ? void 0 : s.factions) == null ? void 0 : m.find((M) => M.id === t);
    return r ? (r.visibility = i ? "gm" : "players", a[e] = P(s), await J(a), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), x(`${r.name} ${i ? "hidden from" : "visible to"} players.`), y(r)) : (L(`Faction "${t}" was not found.`), null);
  }
  async function B(e, t, i, a) {
    var M;
    if (!v("move star systems")) return null;
    const s = X(), r = s[e], m = (M = r == null ? void 0 : r.systems) == null ? void 0 : M.find((A) => A.id === t);
    return m ? (m.x = ge(Re(i, m.x), 0, 100), m.y = ge(Re(a, m.y), 0, 100), s[e] = P(r), await J(s), game.socket.emit(ee, { action: "refresh", mapId: e }), y(m)) : (L(`System "${t}" was not found.`), null);
  }
  async function G(e, t, { notify: i = !0 } = {}) {
    var m;
    if (!v("reveal star systems")) return null;
    const a = X(), s = a[e], r = (m = s == null ? void 0 : s.systems) == null ? void 0 : m.find((M) => M.id === t);
    return r ? (r.visibility = "players", (r.status === "undiscovered" || r.status === "locked") && (r.status = "known"), a[e] = P(s), await J(a), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), i && nt(e, r.id), x(`${r.name} revealed to players.`), y(r)) : (L(`System "${t}" was not found.`), null);
  }
  async function le(e, t, i = !0) {
    var m;
    if (!v(i ? "hide star systems" : "reveal star systems")) return null;
    const a = X(), s = a[e], r = (m = s == null ? void 0 : s.systems) == null ? void 0 : m.find((M) => M.id === t);
    return r ? (r.visibility = i ? "gm" : "players", a[e] = P(s), await J(a), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), x(`${r.name} ${i ? "hidden from" : "visible to"} players.`), y(r)) : (L(`System "${t}" was not found.`), null);
  }
  async function ce(e, t) {
    var r;
    if (!v("reveal routes")) return null;
    const i = X(), a = i[e], s = (r = a == null ? void 0 : a.routes) == null ? void 0 : r.find((m) => m.id === t);
    return s ? (s.visibility = "players", i[e] = P(a), await J(i), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), x("Route revealed to players."), y(s)) : (L(`Route "${t}" was not found.`), null);
  }
  async function De(e, t, i = !0) {
    var m;
    if (!v(i ? "hide routes" : "reveal routes")) return null;
    const a = X(), s = a[e], r = (m = s == null ? void 0 : s.routes) == null ? void 0 : m.find((M) => M.id === t);
    return r ? (r.visibility = i ? "gm" : "players", a[e] = P(s), await J(a), de(e), game.socket.emit(ee, { action: "refresh", mapId: e }), x(`Route ${i ? "hidden from" : "visible to"} players.`), y(r)) : (L(`Route "${t}" was not found.`), null);
  }
  function nt(e, t) {
    var s;
    if (!v("notify players about discoveries")) return;
    const i = Z(e), a = (s = i == null ? void 0 : i.systems) == null ? void 0 : s.find((r) => r.id === t);
    if (!a) {
      L(`System "${t}" was not found.`);
      return;
    }
    game.socket.emit(ee, {
      action: "notify",
      mapId: e,
      systemId: t,
      message: `New System Discovered: ${a.name}`
    }), x(`Discovery notification sent: ${a.name}.`);
  }
  async function Fe(e, { replace: t = !1 } = {}) {
    if (!v("import galaxy maps")) return null;
    const i = X();
    let a = P(e);
    return i[a.id] && !t && (a = P({
      ...a,
      id: Ae("map"),
      title: `${a.title} Import`
    })), i[a.id] = a, await J(i), de(a.id), x(`Imported ${a.title}.`), y(a);
  }
  function st(e) {
    const t = Z(e);
    if (!t) {
      L(`Map "${e}" was not found.`);
      return;
    }
    Vs(`${zs(t.title)}.json`, P(t));
  }
  function at({ collection: e, selectedIds: t, inputName: i, collectionName: a, kindLabel: s, iconClass: r, multiple: m = !1 }) {
    const M = (e == null ? void 0 : e.contents) ?? [], A = new Map(M.map((V) => [String(V.id), V])), R = (Array.isArray(t) ? t : t ? [t] : []).map(String).map((V) => {
      const _ = A.get(V), ve = (_ == null ? void 0 : _.name) ?? `Missing ${s}`;
      return `<div class="gmf-linked-document ${_ ? "" : "is-missing"}" data-linked-document data-document-id="${E(V)}">
        <i class="fa-solid ${E(r)} gmf-linked-document__icon" aria-hidden="true"></i>
        <span class="gmf-linked-document__copy"><strong>${E(ve)}</strong><small>${E(_ ? s : V)}</small></span>
        <input type="hidden" name="${E(i)}" value="${E(V)}" />
        <button type="button" data-unlink-document title="Unlink ${E(s.toLocaleLowerCase())}" aria-label="Unlink ${E(s.toLocaleLowerCase())}"><i class="fa-solid fa-xmark"></i><span>Unlink</span></button>
      </div>`;
    }).join("");
    return `<div class="gmf-linked-documents" data-linked-documents data-collection="${E(a)}" data-input-name="${E(i)}" data-kind-label="${E(s)}" data-icon-class="${E(r)}" data-multiple="${m}">
      <div class="gmf-linked-document-list" data-linked-document-list>${R}</div>
      <p class="gmf-linked-document-empty" data-linked-document-empty ${R ? "hidden" : ""}>No linked ${E(s.toLocaleLowerCase())}${m ? "s" : ""}.</p>
      <button type="button" class="gmf-button--quiet gmf-linked-documents__add" data-open-document-picker aria-haspopup="dialog" aria-expanded="false"><i class="fa-solid fa-plus"></i> Add ${E(s)}</button>
      <div class="gmf-document-picker" data-document-picker role="dialog" aria-label="Choose ${E(s.toLocaleLowerCase())}" hidden>
        <div class="gmf-document-picker__toolbar">
          <label>Search ${E(s.toLocaleLowerCase())}${m ? "s" : ""}<input type="search" data-document-search autocomplete="off" placeholder="Type to filter…" /></label>
          <button type="button" class="gmf-button--quiet" data-close-document-picker aria-label="Close picker"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="gmf-document-picker__results" data-document-results></div>
      </div>
    </div>`;
  }
  function mt(e, t) {
    const i = Ee(e.type, e.iconStyle);
    return `<div class="gmf-marker-preview gmf-galaxy" data-marker-preview aria-label="Live map marker preview">
      <div class="gmf-marker-preview__stage">
        <span class="gmf-system gmf-system--${E(e.type)} gmf-icon--${E(i)} gmf-status--${E(e.status)} ${e.pulse ? "is-marker-preview-pulsing" : "gmf-no-pulse"}" data-marker-preview-system style="--gmf-faction-color: ${E(t)}; --gmf-system-size: ${E(e.iconSize)}px;">
          <span class="gmf-system__halo"></span>
          <span data-marker-preview-icon><span class="gmf-system__core"></span></span>
          <span class="gmf-system__type-glyph" aria-hidden="true"></span>
        </span>
      </div>
      <span class="gmf-marker-preview__label" data-marker-preview-label>${E(e.name || "New System")}</span>
    </div>`;
  }
  function ft(e, t, { quick: i = !1 } = {}) {
    return `<div class="gmf-marker-composer ${i ? "gmf-marker-composer--quick" : ""}">
      <div class="gmf-marker-composer__controls">
        <div class="gmf-form-grid">
          <label>Marker Style <select name="iconStyle">${we(On, e.iconStyle)}</select></label>
          <label>Marker Color <input type="color" name="iconColor" value="${E(t)}" /></label>
        </div>
        ${i ? "" : `<div class="gmf-form-grid">
          <label>Marker Size <input type="range" name="iconSize" value="${E(e.iconSize)}" min="18" max="56" step="1" /></label>
          <label class="gmf-checkbox-label"><input type="checkbox" name="pulse" value="true" ${e.pulse ? "checked" : ""} /> Pulse Glow</label>
        </div>`}
      </div>
      ${mt(e, t)}
    </div>`;
  }
  function Xe(e) {
    const t = (e.planetLocations ?? []).map((i) => {
      var r, m;
      const a = (m = (r = game.scenes) == null ? void 0 : r.get) == null ? void 0 : m.call(r, i.sceneId), s = e.sceneIds.includes(i.sceneId);
      return `<label class="gmf-surface-location-manager__row">
        <span><i class="fa-solid fa-location-dot"></i><strong>${E((a == null ? void 0 : a.name) || "Missing scene")}</strong><small>${E(i.shape)}${s ? "" : " · no longer linked"}</small></span>
        <span><input type="checkbox" name="removePlanetLocationIds" value="${E(i.id)}" /> Remove</span>
      </label>`;
    }).join("");
    return t ? `<section class="gmf-surface-location-manager">
      <header><h3>Surface Locations</h3><p>Mark locations for removal, then save. This includes markers on other 3D shapes or scenes that are no longer linked.</p></header>
      <div>${t}</div>
    </section>` : "";
  }
  function pt(e, t = {}, i = {}, a = !1) {
    const s = qt({ ...i, ...t }), r = `
      <input type="hidden" name="id" value="${E(s.id)}" />
      <input type="hidden" name="x" value="${E(s.x)}" />
      <input type="hidden" name="y" value="${E(s.y)}" />`;
    return a ? `
      <form class="gmf-crud-form gmf-system-form gmf-system-form--create">
        ${r}
        <label>System name <input type="text" name="name" value="${E(s.name)}" required autofocus /></label>
        <details class="gmf-more-options">
          <summary>More options</summary>
          <div class="gmf-more-options__content">
            <div class="gmf-form-grid">
              <label>Status <select name="status">${we(Tt, s.status)}</select></label>
              <label>Visibility <select name="visibility">${we(ut, s.visibility)}</select></label>
            </div>
            <label>Description <textarea name="description" rows="3">${E(s.description)}</textarea></label>
          </div>
        </details>
      </form>` : `
      <form class="gmf-crud-form gmf-system-form gmf-system-form--edit">
        ${r}
        <label>System name <input type="text" name="name" value="${E(s.name)}" required autofocus /></label>
        <div class="gmf-form-grid">
          <label>Status <select name="status">${we(Tt, s.status)}</select></label>
          <label>Visibility <select name="visibility">${we(ut, s.visibility)}</select></label>
        </div>
        <label>Description <textarea name="description" rows="5">${E(s.description)}</textarea></label>
        <p class="gmf-form-help">Planets, stars, stations, factions, linked content, and 3D appearance are configured on entities inside this system.</p>
      </form>
    `;
  }
  function yt(e, t = {}, i = {}) {
    var A, $, R;
    const a = Z(e), s = { ...i, ...t }, r = (a == null ? void 0 : a.systems) ?? [];
    s.fromSystemId || (s.fromSystemId = ((A = r[0]) == null ? void 0 : A.id) ?? ""), s.toSystemId || (s.toSystemId = (($ = r.find((V) => V.id !== s.fromSystemId)) == null ? void 0 : $.id) ?? ""), s.fromSystemId && !s.toSystemId && (s.toSystemId = ((R = r.find((V) => V.id !== s.fromSystemId)) == null ? void 0 : R.id) ?? "");
    const m = Ht(s), M = r.map((V) => ({ value: V.id, label: V.name }));
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${E(m.id)}" />
        <div class="gmf-form-grid">
          <label>From <select name="fromSystemId">${we(M, m.fromSystemId)}</select></label>
          <label>To <select name="toSystemId">${we(M, m.toSystemId)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Type <select name="type">${we(jn, m.type)}</select></label>
          <label>Visibility <select name="visibility">${we(ut, m.visibility)}</select></label>
        </div>
        <div class="gmf-form-grid">
          <label>Travel Time <input type="text" name="travelTime" value="${E(m.travelTime)}" /></label>
          <label>Fuel Cost <input type="number" name="fuelCost" value="${E(m.fuelCost)}" min="0" step="1" /></label>
        </div>
        <label>Notes <textarea name="notes">${E(m.notes)}</textarea></label>
      </form>
    `;
  }
  function ht(e = {}) {
    const t = rn(e);
    return `
      <form class="gmf-crud-form">
        <input type="hidden" name="id" value="${E(t.id)}" />
        <label>Name <input type="text" name="name" value="${E(t.name)}" /></label>
        <div class="gmf-form-grid">
          <label>Color <input type="color" name="color" value="${E(t.color)}" /></label>
          <label>Visibility <select name="visibility">${we(ut, t.visibility)}</select></label>
        </div>
        <label>Description <textarea name="description">${E(t.description)}</textarea></label>
      </form>
    `;
  }
  function T(e = {}) {
    const t = P(e);
    return `
      <form class="gmf-crud-form">
        <label>Title <input type="text" name="title" value="${E(t.title)}" /></label>
        <label>Subtitle <input type="text" name="subtitle" value="${E(t.subtitle)}" /></label>
        <label>Description <textarea name="description">${E(t.description)}</textarea></label>
        <label>Background Image
          <div class="gmf-path-field">
            <input type="text" name="backgroundImage" value="${E(t.backgroundImage)}" />
            <button type="button" data-browse-target="backgroundImage"><i class="fa-solid fa-folder-open"></i> Browse</button>
          </div>
        </label>
        <label>Visibility <select name="visibility">${we(ut, t.visibility)}</select></label>
        <label>Player Travel Approval <select name="travelApprovalMode">${we(Vt, t.travelApprovalMode)}</select></label>
        <p class="gmf-form-help">GM approval asks only the primary online GM. Majority counts the requester as an approval and passes at more than half of active participants. Unanimous asks every other active participant and cancels on any decline.</p>
      </form>
    `;
  }
  function ie(e) {
    const t = Z(e);
    t && Le({
      title: "Edit Galaxy Map",
      content: T(t),
      onSubmit: (i) => oe(e, i)
    });
  }
  function ye(e, t = null, i = {}) {
    var r;
    const a = Z(e), s = t ? (r = a == null ? void 0 : a.systems) == null ? void 0 : r.find((m) => m.id === t) : null;
    Le({
      title: s ? "Edit System" : "Create System",
      content: pt(e, s ?? { id: Ae("system"), name: "New System" }, i, !s),
      submitLabel: s ? "Save System" : "Create System",
      width: s ? 860 : 540,
      height: s ? Math.min(760, Math.max(360, window.innerHeight - 64)) : "auto",
      dialogClass: s ? "gmf-system-edit-dialog" : "gmf-system-create-dialog",
      onSubmit: (m) => {
        const M = new Set((Array.isArray(m.removePlanetLocationIds) ? m.removePlanetLocationIds : [m.removePlanetLocationIds]).filter(Boolean).map(String));
        delete m.removePlanetLocationIds;
        const A = s ? qt(s).objects.find(($) => $.id === qt(s).primaryObjectId) : null;
        return K(e, {
          ...m,
          sceneIds: m.sceneIds ?? [],
          planetLocations: ((A == null ? void 0 : A.planetLocations) ?? []).filter(($) => !M.has($.id)),
          pulse: m.pulse === "true"
        });
      }
    });
  }
  function Ne(e, t = null, i = {}) {
    var r;
    const a = Z(e);
    if ((((r = a == null ? void 0 : a.systems) == null ? void 0 : r.length) ?? 0) < 2) {
      L("Create at least two systems before adding a route.");
      return;
    }
    const s = t ? a.routes.find((m) => m.id === t) : null;
    Le({
      title: s ? "Edit Route" : "Create Route",
      content: yt(e, s ?? { id: Ae("route") }, i),
      submitLabel: s ? "Save Route" : "Create Route",
      onSubmit: (m) => w(e, m)
    });
  }
  function gt(e, t = null) {
    var s;
    const i = Z(e), a = t ? (s = i == null ? void 0 : i.factions) == null ? void 0 : s.find((r) => r.id === t) : null;
    Le({
      title: a ? "Edit Faction" : "Create Faction",
      content: ht(a ?? { id: Ae("faction"), name: "New Faction" }),
      submitLabel: a ? "Save Faction" : "Create Faction",
      onSubmit: (r) => N(e, r)
    });
  }
  function kt(e) {
    const t = Z(e);
    if (!t) return;
    const i = P(t).factions.map((a) => `
      <article class="gmf-dialog-row">
        <div>
          <strong><span class="gmf-color-dot" style="--gmf-faction-color: ${E(a.color)};"></span>${E(a.name)}</strong>
          <span>${E(a.color)} - ${E(a.visibility)}</span>
        </div>
        <div class="gmf-row-actions">
          <button type="button" data-dialog-edit-faction="${E(a.id)}" title="Edit faction"><i class="fa-solid fa-pen"></i></button>
          <button type="button" data-dialog-delete-faction="${E(a.id)}" title="Delete faction"><i class="fa-solid fa-trash"></i></button>
        </div>
      </article>
    `).join("") || '<p class="gmf-empty-inline">No factions yet.</p>';
    new Dialog({
      title: "Manage Factions",
      content: `
        <section class="gmf-dialog-manager">
          <div class="gmf-dialog-manager__bar">
            <p>Factions tint systems and help organize territory on the map.</p>
            <button type="button" data-dialog-add-faction><i class="fa-solid fa-plus"></i> Add Faction</button>
          </div>
          <div class="gmf-dialog-list">${i}</div>
        </section>
      `,
      render: (a) => {
        var r;
        const s = et(a);
        (r = s.querySelector("[data-dialog-add-faction]")) == null || r.addEventListener("click", () => gt(e)), s.querySelectorAll("[data-dialog-edit-faction]").forEach((m) => {
          m.addEventListener("click", () => gt(e, m.dataset.dialogEditFaction));
        }), s.querySelectorAll("[data-dialog-delete-faction]").forEach((m) => {
          m.addEventListener("click", async () => {
            await Dialog.confirm({
              title: "Delete Faction",
              content: "<p>Delete this faction? Systems assigned to it become unaffiliated.</p>"
            }, wt) && (await C(e, m.dataset.dialogDeleteFaction), kt(e));
          });
        });
      },
      buttons: {
        close: {
          icon: '<i class="fa-solid fa-check"></i>',
          label: "Done"
        }
      },
      default: "close"
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog"],
      width: 560
    }).render(!0);
  }
  function At(e) {
    var s;
    if (!e) return null;
    const t = P(e), i = new Map(t.systems.map((r) => [r.id, r])), a = new Map(t.factions.map((r) => [r.id, r]));
    return {
      ...t,
      travelApprovalModeLabel: ((s = Vt.find((r) => r.value === t.travelApprovalMode)) == null ? void 0 : s.label) ?? "Unanimous agreement",
      systems: t.systems.map((r) => {
        var m;
        return {
          ...r,
          factionName: ((m = a.get(r.factionId)) == null ? void 0 : m.name) ?? "Unaffiliated"
        };
      }),
      routes: t.routes.map((r) => {
        var m, M;
        return {
          ...r,
          fromName: ((m = i.get(r.fromSystemId)) == null ? void 0 : m.name) ?? r.fromSystemId,
          toName: ((M = i.get(r.toSystemId)) == null ? void 0 : M.name) ?? r.toSystemId
        };
      })
    };
  }
  function Je() {
    return Object.values(X()).map(P);
  }
  function Pt(e, t) {
    return y(P(Z(e)).systems.find((i) => i.id === String(t)) ?? null);
  }
  function ae(e, t) {
    const i = P(Z(e));
    for (const a of i.systems) {
      const s = a.objects.find((r) => r.id === String(t));
      if (s) return { systemId: a.id, object: y(s) };
    }
    return null;
  }
  function it(e, t) {
    const i = Z(e);
    if (!i) return [];
    const a = P(i).systems.find((s) => s.id === String(t));
    return a ? [...new Set(a.objects.flatMap((s) => s.sceneIds))] : [];
  }
  function xt(e, t, i = {}, a = {}) {
    const s = P(Z(e)), r = $t({ ...a, ...i }), m = s.systems.map((A) => ({ value: A.id, label: A.name })), M = [{ value: "", label: "Inherit system faction" }, ...s.factions.map((A) => ({ value: A.id, label: A.name }))];
    return `<form class="gmf-crud-form gmf-object-form">
      <input type="hidden" name="id" value="${E(r.id)}" />
      <input type="hidden" name="x" value="${E(r.x)}" />
      <input type="hidden" name="y" value="${E(r.y)}" />
      <div class="gmf-form-grid">
        <label>Name <input type="text" name="name" value="${E(r.name)}" required autofocus /></label>
        <label>System <select name="systemId">${we(m, t)}</select></label>
      </div>
      <div class="gmf-form-grid">
        <label>Entity type <select name="kind">${we(Pn, r.kind)}</select></label>
        <label>Status <select name="status">${we(Tt, r.status)}</select></label>
      </div>
      <label>Description <textarea name="description" rows="4">${E(r.description)}</textarea></label>
      <div class="gmf-form-grid">
        <label>Visibility <select name="visibility">${we(nn, r.visibility)}</select></label>
        <label>Faction <select name="factionId">${we(M, r.factionId)}</select></label>
      </div>
      ${ft({ ...r, type: r.kind }, r.iconColor || "#58d8ff")}
      <fieldset><legend>Detail view</legend>
        <div class="gmf-form-grid">
          <label>Appearance <select name="planetPreset">${we(qn, r.planetPreset)}</select></label>
          <label>3D shape <select name="planetShape">${we(Tn, r.planetShape)}</select></label>
          <label>Surface finish <select name="planetFinish">${we($n, r.planetFinish)}</select></label>
          <label class="gmf-surface-strength">Detail strength <span><input type="range" name="planetDetailStrength" value="${E(r.planetDetailStrength)}" min="0" max="100" step="1" /><output data-surface-strength-output>${E(r.planetDetailStrength)}%</output></span></label>
        </div>
        <label>Model color <input type="color" name="planetColor" value="${E(r.planetColor)}" /></label>
        <label>Custom texture <div class="gmf-path-field"><input type="text" name="planetTexture" value="${E(r.planetTexture)}" /><button type="button" data-browse-target="planetTexture"><i class="fa-solid fa-folder-open"></i> Browse</button></div></label>
        ${Xe(r)}
      </fieldset>
      <fieldset><legend>Linked content</legend>
        <label>Image <div class="gmf-path-field"><input type="text" name="image" value="${E(r.image)}" /><button type="button" data-browse-target="image"><i class="fa-solid fa-folder-open"></i> Browse</button></div></label>
        ${at({ collection: game.scenes, selectedIds: r.sceneIds, inputName: "sceneIds", collectionName: "scenes", kindLabel: "Scene", iconClass: "fa-image", multiple: !0 })}
        ${at({ collection: game.journal, selectedIds: r.journalId, inputName: "journalId", collectionName: "journal", kindLabel: "Journal", iconClass: "fa-book-open", multiple: !1 })}
      </fieldset>
      <label>GM notes <textarea name="notes" rows="3">${E(r.notes)}</textarea></label>
    </form>`;
  }
  function un(e, t, i = null, a = {}) {
    const r = P(Z(e)).systems.find((M) => M.id === t), m = i ? r == null ? void 0 : r.objects.find((M) => M.id === i) : null;
    Le({
      title: m ? `Edit ${m.name}` : "Add Entity",
      content: xt(e, t, m ?? { id: Ae("object"), name: "New Object" }, a),
      submitLabel: m ? "Save Entity" : "Add Entity",
      width: 760,
      height: Math.min(760, Math.max(420, window.innerHeight - 64)),
      onSubmit: async (M) => {
        const A = String(M.systemId || t);
        m && A !== t && await Se(e, m.id, A);
        const $ = new Set((Array.isArray(M.removePlanetLocationIds) ? M.removePlanetLocationIds : [M.removePlanetLocationIds]).filter(Boolean).map(String));
        return delete M.removePlanetLocationIds, O(e, A, {
          ...m,
          ...M,
          sceneIds: M.sceneIds ?? [],
          planetLocations: ((m == null ? void 0 : m.planetLocations) ?? []).filter((R) => !$.has(R.id)),
          pulse: M.pulse === "true"
        });
      }
    });
  }
  function Xn(e, t) {
    const a = P(Z(e)).systems.flatMap((s) => s.objects).find((s) => s.id === String(t));
    return a ? [...a.sceneIds] : [];
  }
  function Jn(e) {
    const t = String(e || "");
    return t ? Je().flatMap((i) => i.systems.flatMap((a) => a.objects.filter((s) => s.sceneIds.includes(t)).map((s) => ({ mapId: i.id, mapTitle: i.title, systemId: a.id, systemName: a.name, object: y(s) })))) : [];
  }
  function Wn(e) {
    const t = String(e || "");
    return t ? Je().flatMap((i) => i.systems.filter((a) => a.objects.some((s) => s.sceneIds.includes(t))).map((a) => ({ mapId: i.id, mapTitle: i.title, system: y(a) }))) : [];
  }
  function de(e = null) {
    n != null && n.rendered && n.render({ force: !0 });
    for (const [t, i] of d.entries())
      (!e || t === e) && i.render({ force: !0 });
    f != null && f.rendered && (!e || f.mapId === e) && f.render({ force: !0 });
  }
  function Ut(e) {
    const t = [...d.values()];
    return f && t.push(f), t.filter((i) => (i == null ? void 0 : i.rendered) && i.mapId === e);
  }
  function Zn(e) {
    var t;
    return e.element instanceof HTMLElement ? e.element : ((t = e.element) == null ? void 0 : t[0]) ?? null;
  }
  function Yt(e, t, i) {
    return e.routes.find((a) => a.fromSystemId === t && a.toSystemId === i || a.toSystemId === t && a.fromSystemId === i) ?? null;
  }
  function Qn(e, t) {
    const i = Z(e);
    if (!i)
      return L(`Map "${e}" was not found.`), null;
    const a = P(i), s = a.systems.find(($) => $.id === a.currentSystemId), r = a.systems.find(($) => $.id === t);
    if (!r)
      return L(`System "${t}" was not found.`), null;
    if (!s)
      return L("This map does not have a current location yet. Ask the GM to set one first."), null;
    if (s.id === r.id)
      return x(`${r.name} is already the current location.`), null;
    if (a.visibility !== "players" || s.visibility !== "players" || r.visibility !== "players")
      return L("That travel destination is not visible to players."), null;
    const m = Yt(a, s.id, r.id);
    if (!m || m.visibility !== "players")
      return L(`No player-visible direct route from ${s.name} to ${r.name}.`), null;
    const M = re();
    if (!M)
      return L("A GM must be online to approve player travel."), null;
    const A = wn(D(), game.user.id, M, a.travelApprovalMode);
    return {
      action: "travel-request",
      requestId: Ae("travel"),
      mapId: e,
      mapTitle: a.title,
      fromSystemId: s.id,
      fromName: s.name,
      toSystemId: r.id,
      toName: r.name,
      routeId: m.id,
      routeType: m.type,
      travelTime: m.travelTime,
      fuelCost: m.fuelCost,
      requesterId: game.user.id,
      requesterName: game.user.name,
      approvalMode: A.approvalMode,
      voterIds: A.voterIds,
      voterNames: A.voterNames,
      requiredApprovals: A.requiredApprovals,
      participantCount: A.participantCount
    };
  }
  function mn(e, t) {
    const i = Qn(e, t);
    return i ? (game.socket.emit(ee, i), x(`Travel request sent: ${i.fromName} to ${i.toName}.`), i) : null;
  }
  function fn(e) {
    var m, M, A, $;
    if (!(e != null && e.requestId) || e.requesterId === ((m = game.user) == null ? void 0 : m.id) || !((A = e.voterIds) != null && A.includes((M = game.user) == null ? void 0 : M.id)) || I.has(e.requestId)) return;
    I.add(e.requestId);
    let t = !1, i = !1, a = null;
    const s = (R) => {
      if (t) return;
      t = !0;
      const V = {
        action: "travel-vote",
        requestId: e.requestId,
        mapId: e.mapId,
        userId: game.user.id,
        userName: game.user.name,
        accepted: R
      };
      game.socket.emit(ee, V), hn(V);
    }, r = (($ = Vt.find((R) => R.value === e.approvalMode)) == null ? void 0 : $.label) ?? "Unanimous agreement";
    a = new Dialog({
      title: "Travel Request",
      content: `
        <section class="gmf-travel-request">
          <p><strong>${E(e.requesterName)}</strong> wants to travel on <strong>${E(e.mapTitle)}</strong>.</p>
          <p>${E(e.fromName)} &rarr; ${E(e.toName)}</p>
          <p class="gmf-travel-request__meta">${E(e.routeType)} route / ${E(e.travelTime || "Unknown time")} / Fuel ${E(e.fuelCost ?? 0)}</p>
          <p class="gmf-travel-request__mode"><i class="fa-solid fa-users"></i> ${E(r)}</p>
          <div class="gmf-travel-progress" data-travel-progress aria-live="polite">
            <div class="gmf-travel-progress__bar"><span data-travel-progress-bar></span></div>
            <strong data-travel-progress-count>Waiting for vote status…</strong>
            <span data-travel-progress-pending></span>
          </div>
        </section>
      `,
      render: (R) => {
        const V = et(R), _ = S.get(e.requestId);
        _ && (_.root = V), Xt(e.requestId, b.get(e.requestId));
      },
      buttons: {
        accept: {
          icon: '<i class="fa-solid fa-check"></i>',
          label: "Accept",
          callback: () => s(!0)
        },
        decline: {
          icon: '<i class="fa-solid fa-xmark"></i>',
          label: "Decline",
          callback: () => s(!1)
        }
      },
      default: "accept",
      close: () => {
        S.delete(e.requestId), i || s(!1);
      }
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog"],
      width: 420
    }), S.set(e.requestId, {
      root: null,
      resolve: () => {
        i = !0, t = !0, a == null || a.close();
      }
    }), a.render(!0);
  }
  function jt(e) {
    var t;
    return !!(e != null && e.coordinatorId && e.coordinatorId === ((t = re()) == null ? void 0 : t.id));
  }
  function Kn(e) {
    const t = Ln(e);
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
      pendingNames: t.pendingIds.map((i) => {
        var a;
        return ((a = e.voterNames) == null ? void 0 : a[i]) || "Navigator";
      }),
      coordinatorId: game.user.id
    };
  }
  function Xt(e, t) {
    var m, M;
    if (!t) return;
    b.set(e, t);
    const i = (m = S.get(e)) == null ? void 0 : m.root;
    if (!i) return;
    const a = i.querySelector("[data-travel-progress-count]"), s = i.querySelector("[data-travel-progress-pending]"), r = i.querySelector("[data-travel-progress-bar]");
    a && (a.textContent = `${t.acceptedCount} of ${t.requiredApprovals} approvals`), s && (s.textContent = (M = t.pendingNames) != null && M.length ? `Waiting for: ${t.pendingNames.join(", ")}` : "All votes received"), r && (r.style.width = `${Math.min(100, t.acceptedCount / Math.max(1, t.requiredApprovals) * 100)}%`);
  }
  function pn(e) {
    const t = Kn(e);
    return b.set(e.requestId, t), Xt(e.requestId, t), game.socket.emit(ee, t), t;
  }
  function es(e) {
    var i, a, s;
    if (!(e != null && e.requestId) || !jt(e)) return;
    const t = b.get(e.requestId);
    if (Xt(e.requestId, e), e.requesterId === ((i = game.user) == null ? void 0 : i.id) && (!t || t.acceptedCount !== e.acceptedCount || t.declinedCount !== e.declinedCount)) {
      const r = (a = e.pendingNames) != null && a.length ? ` Waiting for ${e.pendingNames.join(", ")}.` : "";
      (s = ui.notifications) == null || s.info(`Travel vote: ${e.acceptedCount}/${e.requiredApprovals} approvals.${r}`);
    }
  }
  function ts(e) {
    if (!ne() || !(e != null && e.requestId) || g.has(e.requestId)) return null;
    const t = Z(e.mapId);
    if (!t) return null;
    const i = P(t), a = D().find((_) => _.id === e.requesterId && !_.isGM), s = i.systems.find((_) => _.id === i.currentSystemId), r = i.systems.find((_) => _.id === e.toSystemId), m = s && r ? Yt(i, s.id, r.id) : null;
    if (!a || i.visibility !== "players" || !s || !r || s.id === r.id || s.visibility !== "players" || r.visibility !== "players" || !m || m.visibility !== "players") return null;
    const M = i.travelApprovalMode, A = re(), $ = wn(D(), e.requesterId, A, M), R = globalThis.setTimeout(() => {
      const _ = g.get(e.requestId);
      _ && yn(_, { reason: "Travel request timed out." });
    }, vs), V = {
      action: "travel-ballot",
      requestId: String(e.requestId).slice(0, 80),
      mapId: i.id,
      mapTitle: i.title,
      fromSystemId: s.id,
      fromName: s.name,
      toSystemId: r.id,
      toName: r.name,
      routeId: m.id,
      routeType: m.type,
      travelTime: m.travelTime,
      fuelCost: m.fuelCost,
      requesterId: a.id,
      requesterName: a.name,
      coordinatorId: game.user.id,
      ...$,
      accepted: /* @__PURE__ */ new Set(),
      declined: /* @__PURE__ */ new Set(),
      timeoutId: R
    };
    return g.set(e.requestId, V), pn(V), V;
  }
  function Jt(e) {
    const t = P(Z(e.mapId)), i = t.systems.find((s) => s.id === e.fromSystemId), a = t.systems.find((s) => s.id === e.toSystemId);
    !i || !a || Ut(e.mapId).forEach((s) => {
      var m;
      const r = Zn(s);
      r && (s.selectedSystemId = a.id, s.selectedRouteId = null, (m = s._animateShipTravel) == null || m.call(s, i, a, r));
    });
  }
  function ns(e, t, i) {
    var a;
    game.socket.emit(ee, {
      action: "travel-animation",
      mapId: e,
      fromSystemId: t,
      toSystemId: i,
      coordinatorId: (a = game.user) == null ? void 0 : a.id
    });
  }
  async function ss(e) {
    var i;
    g.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId), I.delete(e.requestId), (i = S.get(e.requestId)) == null || i.resolve(), S.delete(e.requestId), b.delete(e.requestId);
    const t = {
      action: "travel-approved",
      requestId: e.requestId,
      mapId: e.mapId,
      fromSystemId: e.fromSystemId,
      toSystemId: e.toSystemId,
      fromName: e.fromName,
      toName: e.toName,
      coordinatorId: game.user.id
    };
    game.socket.emit(ee, t), Jt(t), x(`Travel approved: ${e.fromName} to ${e.toName}.`), globalThis.setTimeout(() => p(e.mapId, e.toSystemId), Rn);
  }
  function yn(e, { voterName: t = "", reason: i = "" } = {}) {
    var r;
    g.delete(e.requestId), e.timeoutId && globalThis.clearTimeout(e.timeoutId), I.delete(e.requestId), (r = S.get(e.requestId)) == null || r.resolve(), S.delete(e.requestId), b.delete(e.requestId);
    const a = i || `${t || "A participant"} declined the request.`, s = {
      action: "travel-declined",
      requestId: e.requestId,
      mapId: e.mapId,
      fromName: e.fromName,
      toName: e.toName,
      voterName: t,
      reason: a,
      coordinatorId: game.user.id
    };
    game.socket.emit(ee, s), x(`Travel cancelled: ${a}`);
  }
  function hn(e) {
    if (!ne() || !(e != null && e.requestId)) return;
    const t = g.get(e.requestId);
    if (!t || !t.voterIds.includes(e.userId) || t.accepted.has(e.userId) || t.declined.has(e.userId)) return;
    e.accepted ? t.accepted.add(e.userId) : t.declined.add(e.userId);
    const i = Ln(t);
    pn(t), i.outcome === "approved" ? ss(t) : i.outcome === "declined" && yn(t, {
      voterName: e.userName,
      reason: t.approvalMode === "unanimous" ? `${e.userName || "A participant"} declined the unanimous request.` : "The remaining votes cannot reach a majority."
    });
  }
  function as(e) {
    var t, i, a;
    jt(e) && e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && I.delete(e.requestId), (i = S.get(e.requestId)) == null || i.resolve(), S.delete(e.requestId), b.delete(e.requestId), Jt(e), (a = ui.notifications) == null || a.info(`Travel approved: ${e.fromName} to ${e.toName}.`));
  }
  function is(e) {
    var t, i, a;
    jt(e) && e.coordinatorId !== ((t = game.user) == null ? void 0 : t.id) && (e.requestId && I.delete(e.requestId), (i = S.get(e.requestId)) == null || i.resolve(), S.delete(e.requestId), b.delete(e.requestId), (a = ui.notifications) == null || a.warn(`Travel cancelled: ${e.reason || `${e.voterName || "A participant"} declined.`}`));
  }
  function rs(e) {
    const t = d.get(e);
    t && t.close(), (f == null ? void 0 : f.mapId) === e && f.close();
  }
  function rt(e, t = {}) {
    var M;
    const i = Z(e);
    if (!i)
      return L(`Map "${e}" was not found.`), null;
    const a = t.playerMode ?? !((M = game.user) != null && M.isGM);
    if (a && i.visibility !== "players" && !t.broadcast)
      return L("That galaxy map is not visible to players."), null;
    const s = a ? `player:${e}` : e, r = a && (f == null ? void 0 : f.mapId) === e ? f : d.get(s);
    if (r != null && r.rendered)
      return r.bringToFront(), r;
    const m = new ms({ mapId: e, playerMode: a });
    return a ? f = m : d.set(s, m), m.render({ force: !0 }), m;
  }
  async function os(e, t, i = {}) {
    var s;
    if (!e || !t) return !1;
    const a = rt(e, {
      playerMode: i.playerMode ?? !((s = game.user) != null && s.isGM),
      broadcast: i.broadcast === !0
    });
    return a != null && a.focusSystem ? a.focusSystem(t, i) : !1;
  }
  async function ls(e, t = {}, i = {}) {
    var m, M;
    const a = String(t.systemId || ""), s = String(t.objectId || "");
    if (!e || !a) return !1;
    const r = rt(e, { playerMode: i.playerMode ?? !((m = game.user) != null && m.isGM), broadcast: i.broadcast === !0 });
    return r ? s && r.focusLocation ? r.focusLocation(a, s, i) : (M = r.focusSystem) == null ? void 0 : M.call(r, a, i) : !1;
  }
  function cs(e, t = "") {
    var a;
    let i = !1;
    for (const s of Ut(e))
      i = ((a = s.clearSystemFocus) == null ? void 0 : a.call(s, t)) || i;
    return i;
  }
  function Ot() {
    return v("open the map manager") ? (n || (n = new us()), n.render({ force: !0 }), n) : null;
  }
  function Wt() {
    const e = Je().filter((a) => a.visibility === "players").sort((a, s) => a.title.localeCompare(s.title));
    if (!e.length)
      return x("No galaxy map is currently visible to players."), null;
    if (e.length === 1) return rt(e[0].id, { playerMode: !0 });
    const t = e.map((a) => `
      <button type="button" class="gmf-player-map-choice" data-player-open-map="${E(a.id)}">
        <span class="gmf-player-map-choice__title">${E(a.title)}</span>
        <span class="gmf-player-map-choice__meta">${E(a.subtitle || a.description || "Player-visible galaxy map")}</span>
      </button>
    `).join("");
    let i = null;
    return i = new Dialog({
      title: "Choose Galaxy Map",
      content: `<section class="gmf-player-map-chooser">${t}</section>`,
      render: (a) => {
        const s = et(a);
        s == null || s.querySelectorAll("[data-player-open-map]").forEach((r) => {
          r.addEventListener("click", () => {
            rt(r.dataset.playerOpenMap, { playerMode: !0 }), i == null || i.close();
          });
        });
      },
      buttons: {
        close: {
          icon: '<i class="fa-solid fa-xmark"></i>',
          label: "Close"
        }
      },
      default: "close"
    }, {
      classes: ["galaxy-map", "gmf-crud-dialog", "gmf-map-chooser-dialog"],
      width: 460
    }), i.render(!0), i;
  }
  function ds() {
    var t;
    const e = Je().sort((i, a) => i.title.localeCompare(a.title));
    return (t = game.user) != null && t.isGM ? e.length === 1 ? rt(e[0].id) : Ot() : Wt();
  }
  function Zt(e) {
    if (v("broadcast galaxy maps")) {
      if (!Z(e)) {
        L(`Map "${e}" was not found.`);
        return;
      }
      game.socket.emit(ee, { action: "open", mapId: e }), x("Map broadcast sent to players.");
    }
  }
  function gn() {
    v("close player galaxy maps") && (game.socket.emit(ee, { action: "close" }), x("Close-map signal sent to players."));
  }
  const us = Cs({
    templateRoot: It,
    getMaps: Je,
    prepareMapForManager: At,
    getRawMap: Z,
    openMapMetadataDialog: ie,
    openSystemDialog: ye,
    openObjectDialog: un,
    openRouteDialog: Ne,
    openFactionDialog: gt,
    exportMap: st,
    duplicateMap: ze,
    deleteMap: Ge,
    createMap: F,
    deleteSystem: c,
    deleteObject: ke,
    setPrimaryObject: Ye,
    mergeSystems: u,
    deleteRoute: k,
    deleteFaction: C,
    openMap: rt,
    showMapToPlayers: Zt,
    closePlayerMap: gn,
    hideSystemFromPlayers: le,
    hideRouteFromPlayers: De,
    hideFactionFromPlayers: Q,
    clearManagerApp: (e) => {
      n === e && (n = null);
    }
  }), ms = Js({
    templateRoot: It,
    getRawMap: Z,
    prepareMapForDisplay: z,
    openSystemDialog: ye,
    openObjectDialog: un,
    upsertObject: O,
    openRouteDialog: Ne,
    openFactionDialog: gt,
    openFactionManagerDialog: kt,
    openMapMetadataDialog: ie,
    revealSystemToPlayers: G,
    revealRouteToPlayers: ce,
    hideSystemFromPlayers: le,
    hideRouteFromPlayers: De,
    deleteSystem: c,
    deleteObject: ke,
    deleteRoute: k,
    setCurrentSystem: p,
    setCurrentObject: h,
    requestTravelToSystem: mn,
    notifySystemDiscovered: nt,
    exportMap: st,
    getTravelRoute: Yt,
    broadcastTravelAnimation: ns,
    notifyInfo: x,
    notifyError: L,
    saveSystemPosition: B,
    saveObjectPosition: l,
    savePlanetLocation: qe,
    removePlanetLocation: Te,
    unlinkPlanetScene: _e,
    showMapToPlayers: Zt,
    openMapManager: Ot,
    clearMapView: (e) => {
      e.playerMode && f === e && (f = null);
      for (const [t, i] of d.entries())
        i === e && d.delete(t);
    }
  });
  function fs() {
    const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
    return t != null && t.registerApp ? (t.registerApp({
      id: $e,
      title: "Galaxy Map",
      icon: "fa-solid fa-route",
      premium: !1,
      description: "Open cinematic campaign maps and navigation charts.",
      open: () => {
        var i;
        return (i = game.user) != null && i.isGM ? Ot() : Wt();
      }
    }), !0) : !1;
  }
  Hooks.once("init", async () => {
    game.settings.register($e, en, {
      scope: "world",
      config: !1,
      type: Object,
      default: {}
    }), game.settings.register($e, Gt, {
      scope: "world",
      config: !1,
      type: Object,
      default: {}
    }), game.settings.register($e, tn, {
      scope: "world",
      config: !1,
      type: Boolean,
      default: !1
    }), Handlebars.registerHelper("gmfEq", (e, t) => e === t), Handlebars.registerHelper("gmfJson", (e) => JSON.stringify(e, null, 2)), Handlebars.registerHelper("gmfPercent", (e) => `${Number(e).toFixed(3)}%`), Handlebars.registerHelper("gmfFallback", (e, t) => e || t), Hooks.on("renderDialog", (e, t) => {
      var s, r;
      const i = et(t), a = ((s = i == null ? void 0 : i.closest) == null ? void 0 : s.call(i, ".window-app, .application, .app")) ?? i;
      (r = a == null ? void 0 : a.classList) != null && r.contains("galaxy-map") && Ts(e, t);
    }), await loadTemplates([
      `${It}/map-manager.hbs`,
      `${It}/galaxy-map.hbs`,
      `${It}/celestial-icon.hbs`,
      `${It}/system-details.hbs`
    ]);
  }), Hooks.once("ready", async () => {
    game.galaxyMap = {
      openMap: rt,
      focusSystem: os,
      focusLocation: ls,
      clearSystemFocus: cs,
      openMapManager: Ot,
      openGalaxyMapFromSceneControls: ds,
      openPlayerMapChooser: Wt,
      createMap: F,
      getMaps: Je,
      getSystem: Pt,
      getObject: ae,
      getSceneIdsForSystem: it,
      getSystemsForScene: Wn,
      getSceneIdsForObject: Xn,
      getObjectsForScene: Jn,
      showMapToPlayers: Zt,
      closePlayerMap: gn,
      updateMap: se,
      updateMapMetadata: oe,
      deleteMap: Ge,
      duplicateMap: ze,
      upsertSystem: K,
      deleteSystem: c,
      upsertObject: O,
      deleteObject: ke,
      moveObject: Se,
      setPrimaryObject: Ye,
      mergeSystems: u,
      upsertRoute: w,
      deleteRoute: k,
      upsertFaction: N,
      deleteFaction: C,
      saveSystemPosition: B,
      saveObjectPosition: l,
      savePlanetLocation: qe,
      removePlanetLocation: Te,
      unlinkPlanetScene: _e,
      setCurrentSystem: p,
      setCurrentObject: h,
      revealSystemToPlayers: G,
      revealRouteToPlayers: ce,
      hideSystemFromPlayers: le,
      setObjectVisibility: o,
      hideRouteFromPlayers: De,
      hideFactionFromPlayers: Q,
      notifySystemDiscovered: nt,
      requestTravelToSystem: mn,
      importMapData: Fe,
      exportMap: st
    };
    const e = game.modules.get($e);
    if (e && (e.api = game.galaxyMap), fs(), ne()) {
      const t = X();
      if (Object.values(t).some((a) => Number((a == null ? void 0 : a.schemaVersion) || 1) < tt)) {
        const a = y(game.settings.get($e, Gt) ?? {});
        Object.keys(a).length || await game.settings.set($e, Gt, t);
        const s = Object.fromEntries(Object.entries(t).map(([r, m]) => [r, P(m)]));
        await J(s), x("Galaxy maps upgraded to the Galaxy → System → Entity structure. Existing map contents were placed in System 1 and the schema v1 backup was retained.");
      }
      if (!game.settings.get($e, tn)) {
        const a = y(game.settings.get($e, Gt) ?? {}), s = X();
        let r = 0;
        for (const [m, M] of Object.entries(a)) {
          if (!s[m]) continue;
          const A = P(s[m]);
          for (const $ of (M == null ? void 0 : M.systems) ?? []) {
            const R = Nn($ == null ? void 0 : $.planetLocations);
            if (!R.length) continue;
            const V = A.systems.flatMap((_) => _.objects).find((_) => _.id === $.id || _.id === `${$.id}-object`);
            !V || V.planetLocations.length || (V.planetLocations = R.filter((_) => V.sceneIds.includes(_.sceneId)), r += V.planetLocations.length);
          }
          s[m] = P(A);
        }
        r && (await J(s), x(`Restored ${r} planet surface location${r === 1 ? "" : "s"} from the schema backup.`)), await game.settings.set($e, tn, !0);
      }
    }
    game.socket.on(ee, (t = {}) => {
      var i, a, s, r;
      if (t.action === "travel-request") {
        const m = ts(t);
        m && (game.socket.emit(ee, m), fn(m));
        return;
      }
      if (t.action === "travel-ballot") {
        jt(t) && t.coordinatorId !== ((i = game.user) == null ? void 0 : i.id) && fn(t);
        return;
      }
      if (t.action === "travel-vote") {
        hn(t);
        return;
      }
      if (t.action === "travel-progress") {
        es(t);
        return;
      }
      if (t.action === "travel-approved") {
        as(t);
        return;
      }
      if (t.action === "travel-declined") {
        is(t);
        return;
      }
      if (t.action === "travel-animation") {
        t.coordinatorId !== ((a = game.user) == null ? void 0 : a.id) && Jt(t);
        return;
      }
      if (t.action === "planet-locations") {
        pe(t.mapId, t.systemId, t.objectId);
        return;
      }
      (s = game.user) != null && s.isGM || (t.action === "open" && t.mapId && (f == null || f.close(), rt(t.mapId, { playerMode: !0, broadcast: !0 })), t.action === "close" && (f == null || f.close()), t.action === "refresh" && (f == null ? void 0 : f.mapId) === t.mapId && f.render({ force: !0 }), t.action === "notify" && ((r = ui.notifications) == null || r.info(t.message || "New system discovered."), (f == null ? void 0 : f.mapId) === t.mapId && f.render({ force: !0 })));
    }), console.log(`${$e} | Ready. API available at game.galaxyMap.`);
  });
})();
