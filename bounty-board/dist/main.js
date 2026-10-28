var He = Object.defineProperty;
var Ct = (e) => {
  throw TypeError(e);
};
var Me = (e, t, n) => t in e ? He(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var A = (e, t, n) => Me(e, typeof t != "symbol" ? t + "" : t, n), Ye = (e, t, n) => t.has(e) || Ct("Cannot " + n);
var x = (e, t, n) => t.has(e) ? Ct("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n);
var B = (e, t, n) => (Ye(e, t, "access private method"), n);
const b = "bounty-board", ke = "Bounty Board", K = "bounties", Jt = "postPublishChat", Wt = "postResultChat", Xt = "publicDocumentLinks", pt = "removedTags", Z = "boardVisibleToPlayers", Kt = "largeCards", Zt = "detailColor", v = `modules/${b}/templates`, f = Object.freeze({
  AVAILABLE: "available",
  CLAIMED: "claimed",
  COMPLETED: "completed",
  FAILED: "failed",
  HIDDEN: "hidden",
  ARCHIVED: "archived"
}), ut = Object.freeze({
  [f.AVAILABLE]: "Available",
  [f.CLAIMED]: "Claimed",
  [f.COMPLETED]: "Completed",
  [f.FAILED]: "Failed",
  [f.HIDDEN]: "Hidden",
  [f.ARCHIVED]: "Archived"
}), mt = Object.freeze(["Unknown", "Low", "Moderate", "High", "Severe", "Extreme"]), Fe = Object.freeze([
  "Smuggling",
  "Assassination",
  "Rescue",
  "Investigation",
  "Monster Hunt",
  "Recovery",
  "Escort",
  "Sabotage"
]), Pe = Object.freeze({
  id: "",
  contractId: "",
  title: "",
  missionType: "Bounty",
  objective: "",
  cargo: "",
  pickup: "",
  destination: "",
  deadline: "",
  region: "",
  hazards: "",
  targetName: "",
  description: "",
  longDescription: "",
  rewardAmount: 0,
  rewardCurrency: "credits",
  threatLevel: "Moderate",
  faction: "",
  location: "",
  tags: [],
  status: f.AVAILABLE,
  image: "",
  createdAt: "",
  updatedAt: "",
  published: !1,
  claimedBy: "",
  notesGM: "",
  notesPublic: "",
  linkedJournalId: "",
  linkedActorUuid: "",
  sceneId: ""
}), Dt = /* @__PURE__ */ new Map([
  ["pink", "#ff4f9a"],
  ["yellow", "#ffe600"],
  ["green", "#39ff14"]
]);
function Qt(e = game.settings.get(b, Zt)) {
  const t = Dt.get(e) ?? Dt.get("pink");
  document.documentElement.style.setProperty("--bb-detail-color", t);
}
const te = ["Bounty", "Transport", "Exploration"];
function Q(e) {
  const t = String(e ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
  return te.find((n) => n.toLowerCase() === t.toLowerCase()) || t || "Bounty";
}
function tt(e) {
  const t = Q(e.missionType), n = t === "Bounty", i = t === "Transport", a = t === "Exploration", r = (n ? e.targetName : i ? e.cargo : a ? e.region : e.objective) || e.title, o = (i ? [["Pickup", e.pickup], ["Destination", e.destination], ["Deadline", e.deadline]] : a ? [["Objective", e.objective], ["Hazards", e.hazards]] : n ? [] : [["Objective", e.objective]]).filter(([, s]) => s).map(([s, l]) => ({ label: s, value: l }));
  return {
    missionType: t,
    isBounty: n,
    isTransport: i,
    isExploration: a,
    missionSubject: r,
    missionFacts: o,
    displayMissionType: t,
    displayMissionSubject: a ? String(e.title || r) : r,
    displayContractTitle: String((a ? e.region : e.title) || ""),
    subjectLabel: n ? "Target" : i ? "Cargo" : a ? "Region" : "Objective",
    dangerLabel: n ? "Threat" : "Danger",
    missionIcon: n ? "fa-crosshairs" : i ? "fa-truck-fast" : a ? "fa-compass" : "fa-file-signature"
  };
}
function st(e) {
  const t = e.querySelector("[name='missionTypeChoice']"), n = e.querySelector("[name='missionTypeName']");
  if (!t || !n) return;
  const i = t.value === "";
  n.required = i, n.disabled = !i, n.closest("[data-mission-name]").hidden = !i, n.setCustomValidity(i && !n.value.trim() ? "Enter a mission type name." : "");
  const a = Q(i ? n.value : t.value);
  e.querySelectorAll("[data-mission-fields]").forEach((s) => {
    const l = s.dataset.missionFields.split(" ");
    s.hidden = !l.includes(a) && !(l.includes("other") && !["Bounty", "Transport"].includes(a));
  });
  const r = e.querySelector("[name='targetName']");
  r && (r.required = a === "Bounty");
  const o = e.querySelector("[data-danger-label]");
  o && (o.textContent = a === "Bounty" ? "Threat level" : "Danger level");
}
function _e(e = {}) {
  const t = Number(e.rewardAmount ?? 0), n = e.rewardCurrency || "credits";
  return {
    ...e,
    ...tt(e),
    title: String(e.title ?? "").trim(),
    targetName: String(e.targetName ?? ""),
    threatLevel: String(e.threatLevel ?? "Moderate"),
    faction: String(e.faction ?? ""),
    status: String(e.status ?? "available"),
    rewardLabel: `${Number.isFinite(t) ? t.toLocaleString() : "0"} ${n}`,
    statusLabel: ut[e.status] ?? "Available"
  };
}
async function bt(e, t = "published") {
  const n = _e(e), i = await renderTemplate(`${v}/bounty-chat-card.hbs`, {
    bounty: n,
    mode: t,
    isResult: t === "result",
    isPublished: t === "published"
  });
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: "Bounty Board" }),
    content: i,
    flags: {
      [b]: {
        bountyId: n.id,
        mode: t
      }
    }
  });
}
function $e(e) {
  return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? null));
}
function et() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function H(e = "change bounty data") {
  var t, n, i;
  return (t = game.user) != null && t.isGM ? !0 : ((i = (n = ui.notifications) == null ? void 0 : n.warn) == null || i.call(n, `Only a GM can ${e}.`), !1);
}
function h(e, t = "") {
  return String(e ?? t).trim();
}
function ee(e) {
  return Array.isArray(e) ? e.map((t) => h(t)).filter(Boolean) : h(e).split(",").map((t) => t.trim()).filter(Boolean);
}
function xe(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const i = h(n).toLowerCase();
    return !i || t.has(i) ? !1 : (t.add(i), !0);
  });
}
function yt() {
  try {
    return ee(game.settings.get(b, pt));
  } catch {
    return [];
  }
}
function qe(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function Ge(e, t = f.AVAILABLE) {
  return Object.values(f).includes(e) ? e : t;
}
function je(e) {
  const t = h(e, "Moderate");
  return mt.includes(t) ? t : "Moderate";
}
function ze(e) {
  const t = Number(e);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function j(e) {
  return ut[e] ?? ut[f.AVAILABLE];
}
function Bt(e) {
  const t = Number((e == null ? void 0 : e.rewardAmount) ?? 0), n = (e == null ? void 0 : e.rewardCurrency) || "credits";
  return `${t.toLocaleString()} ${n}`;
}
function Ve(e) {
  let t = 0;
  for (const n of e) t = (t * 31 + n.charCodeAt(0)) % 1e4;
  return `BH-${String(t).padStart(4, "0")}`;
}
function I(e = {}) {
  const t = et(), n = h(e.id) || `bounty-${foundry.utils.randomID(12)}`, i = h(e.contractId) || Ve(n), a = h(e.createdAt) || t, r = Ge(e.status);
  return {
    ...$e(Pe),
    id: n,
    contractId: i,
    title: h(e.title),
    missionType: Q(e.missionType),
    objective: h(e.objective),
    cargo: h(e.cargo),
    pickup: h(e.pickup),
    destination: h(e.destination),
    deadline: h(e.deadline),
    region: h(e.region),
    hazards: h(e.hazards),
    targetName: h(e.targetName),
    description: h(e.description),
    longDescription: h(e.longDescription),
    rewardAmount: ze(e.rewardAmount),
    rewardCurrency: h(e.rewardCurrency, "credits") || "credits",
    threatLevel: je(e.threatLevel),
    faction: h(e.faction),
    location: h(e.location),
    tags: ee(e.tags),
    status: r,
    image: h(e.image),
    createdAt: a,
    updatedAt: h(e.updatedAt) || a,
    published: e.published === !0,
    claimedBy: h(e.claimedBy),
    notesGM: h(e.notesGM),
    notesPublic: h(e.notesPublic),
    linkedJournalId: h(e.linkedJournalId),
    linkedActorUuid: h(e.linkedActorUuid),
    sceneId: h(e.sceneId)
  };
}
function St(e) {
  var c, u, d;
  const t = I(e), n = t.linkedJournalId ? ((c = game.journal) == null ? void 0 : c.get(t.linkedJournalId)) ?? null : null, i = game.settings.get(b, Xt) === !0, a = game.user, r = foundry.utils.fromUuidSync ?? globalThis.fromUuidSync;
  let o = null;
  if (a != null && a.isGM && t.linkedActorUuid)
    try {
      o = r == null ? void 0 : r(t.linkedActorUuid);
    } catch {
    }
  const s = !!(n && (a != null && a.isGM || i || (u = n.testUserPermission) != null && u.call(n, a, "OBSERVER"))), l = !t.published && t.status !== f.HIDDEN && t.status !== f.ARCHIVED;
  return {
    ...t,
    ...tt(t),
    linkedActorName: (o == null ? void 0 : o.name) || t.targetName,
    displayId: t.contractId,
    statusLabel: j(t.status),
    rewardLabel: Bt(t),
    rewardAmountLabel: t.rewardAmount.toLocaleString(),
    rewardCurrencyLabel: t.rewardCurrency,
    threatClass: t.threatLevel.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    searchText: [
      t.missionType,
      t.objective,
      t.cargo,
      t.pickup,
      t.destination,
      t.deadline,
      t.region,
      t.hazards,
      t.title,
      t.contractId,
      t.targetName,
      t.description,
      t.longDescription,
      t.faction,
      t.location,
      t.tags.join(" ")
    ].join(" ").toLowerCase(),
    tagsText: t.tags.join(", "),
    hasImage: !!t.image,
    isClaimed: t.status === f.CLAIMED,
    isVisibleToPlayers: Tt(t),
    linkedJournalName: (n == null ? void 0 : n.name) ?? "",
    canSeeJournal: s,
    canEdit: ((d = game.user) == null ? void 0 : d.isGM) === !0,
    statusPrivate: l,
    statusChoices: Object.values(f).map((g) => ({
      value: g,
      label: j(g),
      selected: t.status === g && !l
    }))
  };
}
function Tt(e) {
  const t = I(e);
  return t.published && ![f.HIDDEN, f.ARCHIVED].includes(t.status);
}
function Y() {
  return game.settings.get(b, Z) !== !1;
}
async function ne(e) {
  return H(e ? "show the bounty board" : "hide the bounty board") ? (await game.settings.set(b, Z, e === !0), !0) : !1;
}
function F() {
  const e = game.settings.get(b, K);
  return e ? Array.isArray(e) ? Object.fromEntries(e.map(I).map((t) => [t.id, t])) : typeof e == "object" ? Object.fromEntries(Object.values(e).map(I).map((t) => [t.id, t])) : (console.warn(`${b} | Ignoring invalid bounty setting payload.`, e), {}) : {};
}
async function nt(e) {
  return H("save bounties") ? (await game.settings.set(b, K, e ?? {}), e) : F();
}
function L({ includeHidden: e = ((t) => (t = game.user) == null ? void 0 : t.isGM)() === !0 } = {}) {
  const n = Object.values(F()).map(I);
  return (e ? n : n.filter(Tt)).sort((a, r) => String(r.updatedAt).localeCompare(String(a.updatedAt)));
}
function $(e) {
  const t = F()[e];
  return t ? I(t) : null;
}
function Je(e) {
  var t, n;
  return !e || !((t = game.user) != null && t.isGM) && !Y() ? [] : L({ includeHidden: ((n = game.user) == null ? void 0 : n.isGM) === !0 }).filter((i) => i.missionType === "Bounty" && i.linkedActorUuid === e).map(({ id: i, rewardAmount: a, rewardCurrency: r, status: o }) => ({ id: i, rewardAmount: a, rewardCurrency: r, status: o }));
}
function lt(e, t) {
  var i, a;
  const n = (a = (i = game.i18n) == null ? void 0 : i.localize) == null ? void 0 : a.call(i, `BOUNTYBOARD.Link.${e}`);
  return n && n !== `BOUNTYBOARD.Link.${e}` ? n : t;
}
let vt = Promise.resolve();
function dt(e, t) {
  const n = vt.then(async () => {
    if (!H("link bounty targets")) return null;
    if (!$(e)) throw new Error(lt("MissingBounty", "Bounty not found."));
    let i = "";
    if (t !== null) {
      if (!["Actor", "Token"].includes(t == null ? void 0 : t.type) || !t.uuid) throw new Error(lt("Invalid", "Drop a world Actor or Token onto a bounty."));
      const r = await (foundry.utils.fromUuid ?? globalThis.fromUuid)(t.uuid), o = (r == null ? void 0 : r.documentName) === "Token" ? r.actor : (r == null ? void 0 : r.documentName) === "Actor" ? r : null;
      if (!o || o.pack || !o.uuid || !o.isToken && game.actors.get(o.id) !== o)
        throw new Error(lt("Invalid", "Drop a world Actor or Token onto a bounty."));
      i = o.uuid;
    }
    return k(e, { linkedActorUuid: i });
  });
  return vt = n.then(() => {
  }, () => {
  }), n;
}
function We(e) {
  var i, a;
  const t = h(e);
  if (!t || !((i = game.scenes) != null && i.get(t))) return [];
  const n = ((a = game.user) == null ? void 0 : a.isGM) === !0;
  return !n && !Y() ? [] : L({ includeHidden: n }).filter((r) => r.sceneId === t).map((r) => ({
    id: r.id,
    name: tt(r).missionSubject,
    image: r.image,
    status: r.status,
    statusLabel: j(r.status),
    reward: Bt(r),
    sceneId: r.sceneId
  }));
}
function Xe(e) {
  const t = [];
  return Q(e.missionType) === "Bounty" && !h(e.targetName) && t.push("Target name is required."), h(e.rewardCurrency) || t.push("Reward currency is required."), h(e.threatLevel) || t.push("Threat level is required."), t;
}
async function At(e) {
  var l, c;
  if (!H("create or edit bounties")) return null;
  const t = e.id ? $(e.id) : null, n = et(), i = I({
    ...t,
    ...e,
    id: (t == null ? void 0 : t.id) || e.id || `bounty-${foundry.utils.randomID(12)}`,
    createdAt: (t == null ? void 0 : t.createdAt) || n,
    updatedAt: n
  }), a = L({ includeHidden: !0 }).find((u) => u.missionType.toLowerCase() === i.missionType.toLowerCase());
  a && (i.missionType = a.missionType);
  const r = new Set(yt().map((u) => u.toLowerCase()));
  i.tags = i.tags.filter((u) => !r.has(u.toLowerCase()));
  const o = Xe(i);
  if (o.length)
    return (c = (l = ui.notifications) == null ? void 0 : l.error) == null || c.call(l, o.join(" ")), null;
  const s = F();
  return s[i.id] = i, await nt(s), i;
}
async function ie(e) {
  if (!H("delete bounties") || !await Dialog.confirm({
    title: "Delete Bounty",
    content: "<p>Permanently delete this bounty from world data?</p>"
  })) return !1;
  const n = F();
  return delete n[e], await nt(n), !0;
}
async function k(e, t = {}, { chat: n = !1 } = {}) {
  var r, o;
  if (!H("update bounty status")) return null;
  const i = $(e);
  if (!i)
    return (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, "Bounty not found."), null;
  const a = await At({ ...i, ...t });
  return a ? (n && await bt(a, t.status === f.AVAILABLE ? "published" : "result"), a) : null;
}
async function ae(e, t = !0) {
  const n = await k(e, {
    published: t,
    status: t ? f.AVAILABLE : f.HIDDEN
  });
  return n && t && game.settings.get(b, Jt) && await bt(n, "published"), n;
}
async function Ke(e, t = !1) {
  const n = t ? f.FAILED : f.COMPLETED, i = await k(e, { status: n });
  return i && game.settings.get(b, Wt) && await bt(i, "result"), i;
}
async function re(e) {
  return k(e, { status: f.ARCHIVED, published: !1 });
}
async function Ze(e, t) {
  return Object.values(f).includes(t) ? t === f.AVAILABLE ? ae(e, !0) : t === f.ARCHIVED ? re(e) : t === f.HIDDEN ? k(e, { status: t, published: !1 }) : t === f.COMPLETED || t === f.FAILED ? Ke(e, t === f.FAILED) : k(e, { status: t, published: !0 }) : null;
}
async function gt(e, t) {
  var o, s;
  if (!H(t ? "publish bounties" : "hide bounties")) return 0;
  const n = [...new Set(e)].filter(Boolean);
  if (!n.length) return 0;
  const i = F();
  let a = 0;
  const r = et();
  for (const l of n) {
    const c = i[l];
    if (!c) continue;
    const u = I(c);
    t && u.status === f.ARCHIVED || (u.published = t, t && u.status === f.HIDDEN && (u.status = f.AVAILABLE), t || (u.status = f.HIDDEN), u.updatedAt = r, i[l] = u, a += 1);
  }
  return await nt(i), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, `${a} bount${a === 1 ? "y" : "ies"} ${t ? "shown to" : "hidden from"} players.`), a;
}
async function Qe(e, t) {
  return k(e, { status: f.CLAIMED, claimedBy: h(t) });
}
async function tn(e) {
  var s, l, c, u;
  if (!H("remove bounty tags")) return !1;
  const t = h(e);
  if (!t)
    return (l = (s = ui.notifications) == null ? void 0 : s.warn) == null || l.call(s, "Select a tag to remove."), !1;
  if (!await Dialog.confirm({
    title: "Remove Tag",
    content: `<p>Remove <strong>${qe(t)}</strong> from the dropdown and all bounties?</p>`
  })) return !1;
  const i = t.toLowerCase(), a = F();
  let r = 0;
  for (const d of Object.values(a)) {
    const g = d.tags.length;
    d.tags = d.tags.filter((p) => p.toLowerCase() !== i), d.tags.length !== g && (d.updatedAt = et(), r += 1);
  }
  const o = xe([...yt(), t]);
  return await game.settings.set(b, pt, o), await nt(a), (u = (c = ui.notifications) == null ? void 0 : c.info) == null || u.call(c, `Removed "${t}" from ${r} bount${r === 1 ? "y" : "ies"}.`), !0;
}
function oe() {
  var n, i;
  const e = !((n = game.user) != null && n.isGM) && !Y() ? [] : L({ includeHidden: ((i = game.user) == null ? void 0 : i.isGM) === !0 }), t = new Map(te.map((a) => [a.toLowerCase(), a]));
  for (const a of e) t.has(a.missionType.toLowerCase()) || t.set(a.missionType.toLowerCase(), a.missionType);
  return [...t.values()];
}
function Lt() {
  var a;
  const e = L({ includeHidden: ((a = game.user) == null ? void 0 : a.isGM) === !0 }), t = (r) => [...new Set(r.map((o) => h(o)).filter(Boolean))].sort((o, s) => o.localeCompare(s)), n = new Set(yt().map((r) => r.toLowerCase())), i = t([...Fe, ...e.flatMap((r) => r.tags)]).filter((r) => !n.has(r.toLowerCase()));
  return {
    missionTypes: oe(),
    statuses: Object.values(f).map((r) => ({ value: r, label: j(r) })),
    threatLevels: mt,
    factions: t(e.map((r) => r.faction)),
    tags: i
  };
}
function q(e, t = {}) {
  const n = h(t.missionType).toLowerCase(), i = h(t.status), a = h(t.threatLevel), r = h(t.faction).toLowerCase(), o = h(t.tag).toLowerCase(), s = h(t.search).toLowerCase();
  return e.filter((l) => {
    const c = I(l);
    return !(n && c.missionType.toLowerCase() !== n || i && c.status !== i || a && c.threatLevel !== a || r && c.faction.toLowerCase() !== r || o && !c.tags.some((u) => u.toLowerCase() === o) || s && ![
      c.missionType,
      c.objective,
      c.cargo,
      c.pickup,
      c.destination,
      c.deadline,
      c.region,
      c.hazards,
      c.title,
      c.targetName,
      c.description,
      c.longDescription,
      c.faction,
      c.location,
      c.tags.join(" ")
    ].join(" ").toLowerCase().includes(s));
  });
}
function en() {
  game.settings.register(b, Zt, {
    name: "BOUNTYBOARD.Settings.DetailColor.Name",
    hint: "BOUNTYBOARD.Settings.DetailColor.Hint",
    scope: "client",
    config: !0,
    type: String,
    choices: {
      pink: "BOUNTYBOARD.Settings.DetailColor.Pink",
      yellow: "BOUNTYBOARD.Settings.DetailColor.Yellow",
      green: "BOUNTYBOARD.Settings.DetailColor.Green"
    },
    default: "pink",
    onChange: Qt
  }), game.settings.register(b, Kt, {
    name: "BOUNTYBOARD.Settings.LargeCards.Name",
    hint: "BOUNTYBOARD.Settings.LargeCards.Hint",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !0,
    onChange: () => Hooks.callAll("bountyBoardLayoutChanged")
  }), game.settings.register(b, K, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(b, Jt, {
    name: "Post Chat Card When Publishing",
    hint: "Automatically post a contract card when the GM publishes a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(b, Wt, {
    name: "Post Chat Card When Resolved",
    hint: "Automatically post a result card when the GM completes or fails a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(b, Xt, {
    name: "Show Linked Journals To Players",
    hint: "Allow player-visible bounty cards to show linked journal buttons when the bounty is published.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(b, Z, {
    name: "Show Bounty Board To Players",
    hint: "Allow players to open the bounty board and see currently published contracts.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(b, pt, {
    scope: "world",
    config: !1,
    type: Array,
    default: []
  });
}
var Yt, kt;
const Nt = ((kt = (Yt = foundry.applications) == null ? void 0 : Yt.api) == null ? void 0 : kt.ApplicationV2) ?? Application;
var Ft, Pt;
const Rt = (Pt = (Ft = foundry.applications) == null ? void 0 : Ft.api) == null ? void 0 : Pt.HandlebarsApplicationMixin, nn = Rt ? Rt(Nt) : Nt;
function It(e, t = "", n = "Missing document") {
  const i = ((e == null ? void 0 : e.contents) ?? []).map((a) => ({ id: String(a.id), name: String(a.name ?? a.id) }));
  return t && !i.some((a) => a.id === t) && i.push({ id: t, name: `${n} (${t})` }), i;
}
function an(e) {
  const t = new FormData(e);
  return {
    id: String(t.get("id") ?? ""),
    contractId: String(t.get("contractId") ?? ""),
    title: String(t.get("title") ?? ""),
    missionType: String(t.get(t.get("missionTypeChoice") === "" ? "missionTypeName" : "missionTypeChoice") ?? "Bounty"),
    objective: String(t.get("objective") ?? ""),
    cargo: String(t.get("cargo") ?? ""),
    pickup: String(t.get("pickup") ?? ""),
    destination: String(t.get("destination") ?? ""),
    deadline: String(t.get("deadline") ?? ""),
    region: String(t.get("region") ?? ""),
    hazards: String(t.get("hazards") ?? ""),
    targetName: String(t.get("targetName") ?? ""),
    description: String(t.get("description") ?? ""),
    longDescription: String(t.get("longDescription") ?? ""),
    rewardAmount: Number(t.get("rewardAmount") ?? 0),
    rewardCurrency: String(t.get("rewardCurrency") ?? ""),
    threatLevel: String(t.get("threatLevel") ?? ""),
    faction: String(t.get("faction") ?? ""),
    location: String(t.get("location") ?? ""),
    tags: String(t.get("tags") ?? ""),
    status: String(t.get("status") ?? f.AVAILABLE),
    image: String(t.get("image") ?? ""),
    published: t.get("published") === "on",
    linkedJournalId: String(t.get("linkedJournalId") ?? ""),
    sceneId: String(t.get("sceneId") ?? "")
  };
}
var U, se, le, ce;
const E = class E extends nn {
  constructor({ bountyId: n = null } = {}) {
    super();
    A(this, "bountyId");
    this.bountyId = n;
  }
  get title() {
    return this.bountyId ? "Edit Contract" : "Create Contract";
  }
  async _prepareContext(n) {
    var a;
    const i = this.bountyId ? $(this.bountyId) : I({});
    return {
      bounty: {
        ...i,
        tagsText: i.tags.join(", ")
      },
      missionTypes: oe(),
      statuses: Object.values(f),
      threatLevels: mt,
      journals: It(game.journal, i.linkedJournalId, "Missing journal"),
      scenes: It(game.scenes, i.sceneId, "Missing scene"),
      canEdit: ((a = game.user) == null ? void 0 : a.isGM) === !0,
      canDelete: !!this.bountyId
    };
  }
  _onRender(n, i) {
    var r, o, s, l;
    (r = super._onRender) == null || r.call(this, n, i);
    const a = this.element;
    st(a), (o = a.querySelector("[name='missionTypeChoice']")) == null || o.addEventListener("change", () => st(a)), (s = a.querySelector("[name='missionTypeName']")) == null || s.addEventListener("input", () => st(a)), (l = a.querySelector("[name='title']")) == null || l.focus();
  }
};
U = new WeakSet(), se = async function(n, i, a) {
  var o, s, l;
  if (n.preventDefault(), !((o = game.user) != null && o.isGM)) {
    (l = (s = ui.notifications) == null ? void 0 : s.warn) == null || l.call(s, "Only a GM can edit bounties.");
    return;
  }
  const r = await At(an(i));
  r && await ht(r);
}, le = function(n) {
  n.preventDefault();
  const i = this.element.querySelector("[name='image']");
  i && new FilePicker({
    type: "image",
    current: i.value,
    callback: (a) => {
      i.value = a, i.dispatchEvent(new Event("change", { bubbles: !0 }));
    }
  }).browse();
}, ce = async function() {
  var n;
  !((n = game.user) != null && n.isGM) || !this.bountyId || await ie(this.bountyId) && (await ht(), await this.close());
}, x(E, U), A(E, "DEFAULT_OPTIONS", {
  id: "bounty-editor-app",
  tag: "form",
  form: {
    handler: B(E, U, se),
    submitOnChange: !1,
    closeOnSubmit: !0
  },
  window: {
    title: "Bounty Contract",
    icon: "fa-solid fa-file-signature",
    resizable: !0
  },
  position: {
    width: 660,
    height: 720
  },
  classes: ["bounty-editor-window"],
  actions: {
    browseImage: B(E, U, le),
    deleteContract: B(E, U, ce)
  }
}), A(E, "PARTS", {
  editor: {
    template: `${v}/bounty-editor.hbs`
  }
});
let W = E;
var _t, $t;
const Et = (($t = (_t = foundry.applications) == null ? void 0 : _t.api) == null ? void 0 : $t.ApplicationV2) ?? Application;
var xt, qt;
const Ut = (qt = (xt = foundry.applications) == null ? void 0 : xt.api) == null ? void 0 : qt.HandlebarsApplicationMixin, rn = Ut ? Ut(Et) : Et, z = /* @__PURE__ */ new Map();
function P(e, { forPlayers: t = !1 } = {}) {
  var r;
  if (typeof e != "string" || !e) return null;
  const n = $(e);
  if (!n) return null;
  const i = Y() && Tt(n);
  if ((t || !((r = game.user) != null && r.isGM)) && !i) return null;
  const a = tt(n);
  return {
    id: n.id,
    contractId: n.contractId,
    title: n.title,
    image: n.image,
    notesPublic: n.notesPublic,
    faction: n.faction,
    location: n.location,
    tags: [...n.tags],
    claimedBy: n.status === "claimed" ? n.claimedBy : "",
    status: n.status,
    statusLabel: j(n.status),
    rewardLabel: Bt(n),
    threatLevel: n.threatLevel,
    ...a,
    shareable: i
  };
}
var _, ue, de;
const M = class M extends rn {
  constructor(n) {
    super({ id: `bounty-handout-${foundry.utils.randomID()}` });
    A(this, "bountyId");
    A(this, "_tagObserver");
    A(this, "_fitOnRender", !0);
    A(this, "_fitFrame");
    this.bountyId = n;
  }
  async _prepareContext() {
    var r, o;
    const n = P(this.bountyId), i = (n == null ? void 0 : n.tags.slice(0, 6)) ?? [], a = i.map((s, l) => {
      const c = l % 2 === 0 ? "left" : "right", u = c === "left" ? Math.ceil(i.length / 2) : Math.floor(i.length / 2), d = Math.floor(l / 2);
      return { label: s, side: c, row: u === 1 ? 1 : u === 2 ? d * 2 : d };
    });
    return {
      bounty: n,
      tagCallouts: a,
      isGM: ((r = game.user) == null ? void 0 : r.isGM) === !0,
      canShare: ((o = game.user) == null ? void 0 : o.isGM) === !0 && (n == null ? void 0 : n.shareable)
    };
  }
  _onRender(n, i) {
    var u, d;
    (u = super._onRender) == null || u.call(this, n, i), this._fitOnRender && (this._fitOnRender = !1, this._fitFrame !== void 0 && cancelAnimationFrame(this._fitFrame), this._fitFrame = requestAnimationFrame(async () => {
      this._fitFrame = void 0, await document.fonts.load('48px "Keania One"').catch(() => {
      }), this.rendered && this.fitToContent();
    })), (d = this._tagObserver) == null || d.disconnect();
    const a = this.element.querySelector(".bb-handout-portrait-stage"), r = a == null ? void 0 : a.querySelector(".bb-handout-portrait"), o = a == null ? void 0 : a.querySelector(".bb-handout-tag-lines");
    if (a && r && o) {
      const g = () => {
        const p = a.getBoundingClientRect(), m = r.getBoundingClientRect();
        if (!p.width || !m.width) return;
        o.setAttribute("viewBox", `0 0 ${p.width} ${p.height}`);
        const T = m.left - p.left + m.width / 2, N = m.top - p.top + m.height / 2, S = m.width / 2 - 2;
        o.querySelectorAll("path").forEach((w) => {
          const C = Number(w.dataset.row), rt = w.dataset.side === "left" ? -1 : 1, ot = (C - 1) * S * 0.52, Ot = T + rt * Math.sqrt(S * S - ot * ot), Ie = N + ot, wt = p.height * (0.14 + C * 0.36) + 10, Ee = rt === -1 ? 2 : p.width - 2, Ue = Ot + rt * Math.min(18, p.width * 0.035);
          w.setAttribute("d", `M${Ot},${Ie} L${Ue},${wt} L${Ee},${wt}`);
        });
      };
      this._tagObserver = new ResizeObserver(g), this._tagObserver.observe(a), g();
    }
    const s = this.element.querySelector(".bb-handout-drag-handle");
    s == null || s.addEventListener("pointerdown", (g) => {
      if (g.button !== 0) return;
      g.preventDefault();
      const { left: p, top: m } = this.position, T = g.clientX, N = g.clientY;
      s.setPointerCapture(g.pointerId);
      const S = (C) => {
        C.pointerId === g.pointerId && this.setPosition({ left: p + C.clientX - T, top: m + C.clientY - N });
      }, w = () => {
        s.removeEventListener("pointermove", S), s.removeEventListener("lostpointercapture", w);
      };
      s.addEventListener("pointermove", S), s.addEventListener("lostpointercapture", w);
    });
    const l = this.element.querySelector(".bb-handout-portrait > img");
    if (!l) return;
    const c = () => {
      l.hidden = !0;
      const g = this.element.querySelector(".bb-handout-fallback");
      g && (g.hidden = !1);
    };
    l.addEventListener("error", c, { once: !0 }), l.complete && !l.naturalWidth && c();
  }
  fitToContent() {
    if (!this.rendered) return;
    const n = this.element.querySelector(".bb-handout-scroll");
    if (!n) return;
    const i = n.getBoundingClientRect(), a = Math.max(0, ...Array.from(n.children).map((l) => l.getClientRects().length ? l.getBoundingClientRect().bottom - i.top + n.scrollTop + (parseFloat(getComputedStyle(l).marginBottom) || 0) : 0)), r = parseFloat(getComputedStyle(n).paddingBottom) || 0, o = this.element.offsetHeight - n.clientHeight, s = Math.min(window.innerHeight - 32, Math.ceil(a + r + o + 3));
    this.setPosition({ height: s, top: Math.max(16, Math.min(this.position.top, window.innerHeight - s - 16)) });
  }
  async close(n = {}) {
    var i;
    return this._fitFrame !== void 0 && cancelAnimationFrame(this._fitFrame), (i = this._tagObserver) == null || i.disconnect(), z.get(this.bountyId) === this && z.delete(this.bountyId), super.close(n);
  }
};
_ = new WeakSet(), ue = async function() {
  await ge(this.bountyId);
}, de = async function() {
  await this.close();
}, x(M, _), A(M, "DEFAULT_OPTIONS", {
  tag: "section",
  classes: ["bounty-handout-window"],
  window: { title: "BOUNTYBOARD.Handout.Title", icon: "fa-solid fa-file-lines", resizable: !0, minimizable: !1 },
  position: { width: 600, height: 720 },
  actions: { showHandout: B(M, _, ue), closeHandout: B(M, _, de) }
}), A(M, "PARTS", { handout: { template: `${v}/bounty-handout.hbs` } });
let ft = M;
function it(e) {
  var n, i, a;
  if (!P(e))
    return (i = (n = ui.notifications) == null ? void 0 : n.warn) == null || i.call(n, game.i18n.localize("BOUNTYBOARD.Handout.Unavailable")), !1;
  let t = z.get(e);
  return t || (t = new ft(e), z.set(e, t)), t._fitOnRender = !0, t.render({ force: !0 }), t.rendered && ((a = t.bringToFront) == null || a.call(t)), t;
}
async function ge(e) {
  var n, i, a;
  if (!((n = game.user) != null && n.isGM)) return !1;
  if (!P(e, { forPlayers: !0 }))
    return (a = (i = ui.notifications) == null ? void 0 : i.warn) == null || a.call(i, game.i18n.localize("BOUNTYBOARD.Handout.PublishFirst")), !1;
  const t = await renderTemplate(`${v}/bounty-handout-chat.hbs`, { bountyId: e });
  return P(e, { forPlayers: !0 }) ? ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: "Bounty Board" }),
    content: t,
    flags: { [b]: { bountyId: e, mode: "handout" } }
  }) : !1;
}
async function on() {
  await Promise.all([...z.entries()].map(async ([e, t]) => {
    P(e) ? await t.render({ force: !0 }) : await t.close();
  }));
}
function sn(e) {
  var i;
  const t = (i = e.flags) == null ? void 0 : i[b], n = e.author ?? e.user;
  (t == null ? void 0 : t.mode) !== "handout" || (n == null ? void 0 : n.isGM) !== !0 || e.visible === !1 || e.isContentVisible === !1 || P(t.bountyId, { forPlayers: !0 }) && it(t.bountyId);
}
function ln() {
  const e = (t, n) => {
    var a, r, o;
    if (!((r = (a = t.flags) == null ? void 0 : a[b]) != null && r.bountyId)) return;
    const i = (n == null ? void 0 : n[0]) ?? n;
    (o = i == null ? void 0 : i.querySelectorAll) == null || o.call(i, "[data-bb-open-handout]").forEach((s) => {
      s.dataset.bbBound || (s.dataset.bbBound = "true", s.addEventListener("click", (l) => {
        l.preventDefault(), it(t.flags[b].bountyId);
      }));
    });
  };
  Hooks.on("renderChatMessage", e), Hooks.on("renderChatMessageHTML", e), Hooks.on("createChatMessage", sn), Hooks.on("updateSetting", (t) => {
    [`${b}.${K}`, `${b}.${Z}`].includes(t.key) && on();
  });
}
const G = /* @__PURE__ */ new WeakMap();
function at() {
  var e;
  return ((e = globalThis.matchMedia) == null ? void 0 : e.call(globalThis, "(prefers-reduced-motion: reduce)").matches) ?? !1;
}
function cn(e) {
  var i, a, r;
  if (at()) return;
  (a = (i = e.querySelector(".bb-dossier-frame")) == null ? void 0 : i.animate) == null || a.call(
    i,
    [{ opacity: 0.25 }, { opacity: 1 }],
    { duration: 240, easing: "ease-out" }
  );
  const t = (r = e.querySelector(".bb-results")) == null ? void 0 : r.getBoundingClientRect();
  let n = 0;
  e.querySelectorAll(".bb-card:not([hidden])").forEach((o) => {
    var l;
    if (t && o.getBoundingClientRect().top >= t.bottom) return;
    const s = (l = o.animate) == null ? void 0 : l.call(
      o,
      [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 240, delay: Math.min(n++, 5) * 45, easing: "ease-out", fill: "backwards" }
    );
    s && (s.onfinish = () => s.cancel());
  });
}
function un(e, t) {
  const n = G.get(e), i = e.hidden ? 0 : e.getBoundingClientRect().height;
  if (n == null || n.cancel(), G.delete(e), e.inert = !t, at() || !e.animate) {
    e.hidden = !t, e.style.removeProperty("overflow");
    return;
  }
  e.hidden = !1;
  const a = e.getBoundingClientRect().height, r = getComputedStyle(e), o = {
    height: `${a}px`,
    paddingTop: r.paddingTop,
    paddingBottom: r.paddingBottom,
    borderTopWidth: r.borderTopWidth,
    marginBottom: r.marginBottom,
    opacity: 1
  }, s = { height: "0px", paddingTop: "0px", paddingBottom: "0px", borderTopWidth: "0px", marginBottom: "0px", opacity: 0 }, l = n ? { ...o, height: `${i}px` } : t ? s : o;
  e.style.overflow = "hidden";
  const c = e.animate([l, t ? o : s], { duration: 190, easing: "ease-out" });
  G.set(e, c), c.onfinish = () => {
    G.get(e) === c && (e.hidden = !t, e.style.removeProperty("overflow"), G.delete(e), c.cancel());
  };
}
function dn(e, t) {
  !t || t === e.dataset.status || at() || (e.classList.add("bb-status-changed"), e.addEventListener("animationend", () => e.classList.remove("bb-status-changed"), { once: !0 }));
}
var Gt, jt;
const Ht = ((jt = (Gt = foundry.applications) == null ? void 0 : Gt.api) == null ? void 0 : jt.ApplicationV2) ?? Application;
var zt, Vt;
const Mt = (Vt = (zt = foundry.applications) == null ? void 0 : zt.api) == null ? void 0 : Vt.HandlebarsApplicationMixin, gn = Mt ? Mt(Ht) : Ht;
let D = null;
function ct(e) {
  var t, n;
  return ((n = (t = e.target) == null ? void 0 : t.closest("[data-bounty-id]")) == null ? void 0 : n.getAttribute("data-bounty-id")) ?? "";
}
function V(e, t, n) {
  var a, r;
  const i = (r = (a = game.i18n) == null ? void 0 : a.format) == null ? void 0 : r.call(a, e, t);
  return i && i !== e ? i : n;
}
var y, fe, R, he, J, pe, me, be, ye, Be, Te, Ae, Oe, we, Ce, De, Se, ve;
const O = class O extends gn {
  constructor(n = {}) {
    super(n);
    x(this, R);
    A(this, "filters");
    A(this, "expanded");
    A(this, "focusBountyId");
    A(this, "_targetDropController");
    A(this, "_hasRevealed", !1);
    A(this, "_tagTickerObserver");
    this.filters = {
      missionType: "",
      status: "",
      threatLevel: "",
      faction: "",
      tag: "",
      search: ""
    }, this.expanded = /* @__PURE__ */ new Set(), this.focusBountyId = null;
  }
  async _prepareContext(n) {
    var p;
    const i = ((p = game.user) == null ? void 0 : p.isGM) === !0, a = Y(), r = !i && !a, o = L({ includeHidden: i }).map(St).map((m) => ({ ...m, expanded: this.expanded.has(m.id) })), s = { ...this.filters, search: "" }, l = r ? [] : q(o, s), c = r ? 0 : q(o, this.filters).length, u = o.filter((m) => [f.AVAILABLE, f.CLAIMED].includes(m.status)).length, d = Object.values(this.filters).some((m) => m.trim().length > 0), g = String(u).padStart(2, "0");
    return {
      isGM: i,
      largeCards: game.settings.get(b, Kt) === !0,
      boardVisibleToPlayers: a,
      boardHiddenForPlayers: r,
      filters: this.filters,
      tagFilterLabel: this.filters.tag || game.i18n.localize("BOUNTYBOARD.Filter.AllTags"),
      options: Lt(),
      statusOptions: this._statusOptions(o),
      bounties: l,
      totalCount: o.length,
      visibleCount: c,
      activeCount: u,
      contractSummary: d ? V("BOUNTYBOARD.Header.ShowingContracts", { visible: c, total: o.length }, `Showing ${c} of ${o.length} contracts`) : V("BOUNTYBOARD.Header.ActiveContracts", { count: g }, `${g} active contracts`)
    };
  }
  _statusOptions(n = L({ includeHidden: ((i) => (i = game.user) == null ? void 0 : i.isGM)() === !0 })) {
    const a = Lt().statuses.filter((r) => {
      var o;
      return ((o = game.user) == null ? void 0 : o.isGM) || ![f.HIDDEN, f.ARCHIVED].includes(r.value);
    });
    return [{ value: "", label: game.i18n.localize("BOUNTYBOARD.Filter.AllStatuses") }, ...a].map((r) => ({
      ...r,
      selected: this.filters.status === r.value,
      count: n.filter((o) => !r.value || o.status === r.value).length
    }));
  }
  _onRender(n, i) {
    var o, s, l, c, u;
    (o = super._onRender) == null || o.call(this, n, i);
    const a = this.element;
    (s = this._tagTickerObserver) == null || s.disconnect();
    const r = a.querySelector(".bb-header");
    if (r == null || r.addEventListener("pointerdown", (d) => {
      var w;
      if (d.button !== 0 || (w = d.target) != null && w.closest("button, a, input, select, textarea, summary, details, [contenteditable='true']")) return;
      d.preventDefault();
      const { left: g, top: p } = this.position, m = d.clientX, T = d.clientY;
      r.setPointerCapture(d.pointerId);
      const N = (C) => {
        C.pointerId === d.pointerId && this.setPosition({ left: g + C.clientX - m, top: p + C.clientY - T });
      }, S = () => {
        r.removeEventListener("pointermove", N), r.removeEventListener("lostpointercapture", S);
      };
      r.addEventListener("pointermove", N), r.addEventListener("lostpointercapture", S);
    }), (l = this._targetDropController) == null || l.abort(), (c = game.user) != null && c.isGM) {
      this._targetDropController = new AbortController();
      const { signal: d } = this._targetDropController;
      a.addEventListener("dragover", (g) => {
        var m, T;
        const p = (T = (m = g.target) == null ? void 0 : m.closest) == null ? void 0 : T.call(m, ".bb-card[data-bounty-id]");
        p && (g.preventDefault(), g.dataTransfer && (g.dataTransfer.dropEffect = "copy"), p.classList.add("bb-target-drop-active"));
      }, { signal: d }), a.addEventListener("dragleave", (g) => {
        var m, T;
        const p = (T = (m = g.target) == null ? void 0 : m.closest) == null ? void 0 : T.call(m, ".bb-card[data-bounty-id]");
        p && !p.contains(g.relatedTarget) && p.classList.remove("bb-target-drop-active");
      }, { signal: d }), a.addEventListener("drop", (g) => this._onTargetDrop(g), { signal: d });
    }
    if ((u = a.querySelector(".bb-filters")) == null || u.addEventListener("submit", (d) => {
      d.preventDefault(), d.stopPropagation();
    }), a.querySelectorAll("[data-filter]").forEach((d) => {
      d.dataset.filter === "search" ? d.addEventListener("input", () => {
        this.filters.search = d.value, B(this, R, J).call(this);
      }) : d.addEventListener("change", () => B(this, R, he).call(this, d));
    }), B(this, R, J).call(this), this._bindBountyToggles(a), this._hasRevealed || (cn(a), this._hasRevealed = !0), this.focusBountyId) {
      const d = this.focusBountyId;
      this.focusBountyId = null, requestAnimationFrame(() => {
        const g = this._findBountyCard(d);
        g && (g.tabIndex = -1, g.scrollIntoView({ block: "center", behavior: at() ? "instant" : "smooth" }), g.focus({ preventScroll: !0 }));
      });
    }
  }
  _bindBountyToggles(n) {
    typeof ResizeObserver < "u" && (this._tagTickerObserver ?? (this._tagTickerObserver = new ResizeObserver((i) => {
      for (const { target: a } of i) {
        const r = a, o = r.querySelector(".bb-tags-track");
        if (!o) continue;
        const s = Math.max(0, o.scrollWidth - r.clientWidth);
        r.classList.toggle("is-overflowing", s > 1), o.style.setProperty("--bb-tags-travel", `${s}px`), o.style.setProperty("--bb-tags-duration", `${Math.max(7, s / 20)}s`);
      }
    })), n.querySelectorAll(".bb-tags-viewport").forEach((i) => this._tagTickerObserver.observe(i))), n.querySelectorAll("[data-bounty-status]").forEach((i) => {
      i.addEventListener("change", async () => {
        var a, r;
        if ((a = game.user) != null && a.isGM) {
          i.disabled = !0;
          try {
            const o = await Ze(((r = i.closest("[data-bounty-id]")) == null ? void 0 : r.dataset.bountyId) ?? "", i.value);
            o && await this._refreshBountyCard(o.id, o);
          } finally {
            i.disabled = !1;
          }
        }
      });
    }), n.querySelectorAll("[data-bounty-toggle]").forEach((i) => {
      i.addEventListener("click", () => {
        const a = i.dataset.bountyToggle ?? "", r = !this.expanded.has(a);
        r ? this.expanded.add(a) : this.expanded.delete(a);
        const o = i.closest("[data-bounty-id]");
        o == null || o.classList.toggle("is-expanded", r), o == null || o.classList.toggle("is-collapsed", !r);
        const s = o == null ? void 0 : o.querySelector(".bb-card-details");
        s && un(s, r), i.setAttribute("aria-expanded", String(r)), i.title = r ? i.dataset.expandedTitle ?? "" : i.dataset.collapsedTitle ?? "";
        const l = i.querySelector(".bb-expand-label");
        l && (l.textContent = r ? i.dataset.expandedLabel ?? "" : i.dataset.collapsedLabel ?? "");
        const c = i.querySelector(".bb-visually-hidden");
        c && (c.textContent = i.title);
        const u = i.querySelector("i");
        u == null || u.classList.toggle("fa-chevron-up", r), u == null || u.classList.toggle("fa-chevron-down", !r);
      });
    });
  }
  async _onTargetDrop(n) {
    var a, r, o, s, l, c, u, d, g;
    const i = (r = (a = n.target) == null ? void 0 : a.closest) == null ? void 0 : r.call(a, ".bb-card[data-bounty-id]");
    if (!(!i || !((o = game.user) != null && o.isGM))) {
      n.preventDefault(), n.stopPropagation(), i.classList.remove("bb-target-drop-active");
      try {
        const p = ((c = (l = (s = foundry.applications) == null ? void 0 : s.ux) == null ? void 0 : l.TextEditor) == null ? void 0 : c.implementation) ?? globalThis.TextEditor, m = p != null && p.getDragEventData ? p.getDragEventData(n) : JSON.parse(((u = n.dataTransfer) == null ? void 0 : u.getData("text/plain")) || "{}"), T = await dt(i.dataset.bountyId || "", m);
        T && await this._refreshBountyCard(T.id, T);
      } catch (p) {
        (g = (d = ui.notifications) == null ? void 0 : d.warn) == null || g.call(d, p.message);
      }
    }
  }
  _findBountyCard(n) {
    var a, r;
    return Array.from(((r = (a = this.element) == null ? void 0 : a.querySelectorAll) == null ? void 0 : r.call(a, "[data-bounty-id]")) ?? []).find((o) => o.dataset.bountyId === n) ?? null;
  }
  _syncCountData() {
    var o, s, l, c;
    const n = L({ includeHidden: ((o = game.user) == null ? void 0 : o.isGM) === !0 }), i = n.filter((u) => [f.AVAILABLE, f.CLAIMED].includes(u.status)).length, a = (s = this.element) == null ? void 0 : s.querySelector(".bb-subtitle"), r = ((c = (l = this.element) == null ? void 0 : l.querySelectorAll) == null ? void 0 : c.call(l, "[data-filter='status'] option")) ?? [];
    for (const u of this._statusOptions(n)) {
      const d = Array.from(r).find((g) => g.value === u.value);
      d && (d.textContent = `${u.label} (${u.count})`);
    }
    a && (a.dataset.totalCount = String(n.length), a.dataset.activeCount = String(i));
  }
  async _refreshBountyCard(n, i) {
    var l;
    const a = this._findBountyCard(n);
    if (!a || !i) return;
    if (a.querySelectorAll(".bb-tags-viewport").forEach((c) => {
      var u;
      return (u = this._tagTickerObserver) == null ? void 0 : u.unobserve(c);
    }), a.dataset.missionType !== (i.missionType || "Bounty")) {
      this.render({ force: !0 });
      return;
    }
    const r = {
      ...St(i),
      expanded: this.expanded.has(n)
    }, o = { ...this.filters, search: "" };
    if (!(q([r], o).length > 0))
      a.remove();
    else {
      const c = await renderTemplate(`${v}/bounty-card.hbs`, {
        bounty: r,
        isGM: ((l = game.user) == null ? void 0 : l.isGM) === !0
      }), u = document.createElement("template");
      u.innerHTML = String(c).trim();
      const d = u.content.firstElementChild;
      d && (a.replaceWith(d), this._bindBountyToggles(d), dn(d, a.dataset.status));
    }
    this._syncCountData(), B(this, R, J).call(this);
  }
  focusBounty(n) {
    this.filters = { missionType: "", status: "", threatLevel: "", faction: "", tag: "", search: "" }, this.expanded.add(n), this.focusBountyId = n, this.render({ force: !0 });
  }
  async close(n = {}) {
    var i, a;
    return (i = this._tagTickerObserver) == null || i.disconnect(), (a = this._targetDropController) == null || a.abort(), D === this && (D = null), super.close(n);
  }
};
y = new WeakSet(), fe = async function(n) {
  var i, a;
  try {
    const r = await dt(ct(n), null);
    r && await this._refreshBountyCard(r.id, r);
  } catch (r) {
    (a = (i = ui.notifications) == null ? void 0 : i.warn) == null || a.call(i, r.message);
  }
}, R = new WeakSet(), he = function(n) {
  const i = n.dataset.filter;
  i && (this.filters[i] = n.value, this.render({ force: !0 }));
}, J = function() {
  var c, u, d, g, p, m, T, N, S;
  const n = this.filters.search.trim().toLowerCase(), i = Array.from(((u = (c = this.element) == null ? void 0 : c.querySelectorAll) == null ? void 0 : u.call(c, "[data-bounty-id]")) ?? []);
  let a = 0;
  for (const w of i) {
    const C = !n || String(w.dataset.searchText ?? "").includes(n);
    w.hidden = !C, C && (a += 1);
  }
  const r = (d = this.element) == null ? void 0 : d.querySelector(".bb-subtitle"), o = Number(((g = r == null ? void 0 : r.dataset) == null ? void 0 : g.totalCount) ?? i.length), s = Number(((p = r == null ? void 0 : r.dataset) == null ? void 0 : p.activeCount) ?? i.length);
  r && (r.textContent = B(this, R, pe).call(this) ? V("BOUNTYBOARD.Header.ShowingContracts", { visible: a, total: o }, `Showing ${a} of ${o} contracts`) : V("BOUNTYBOARD.Header.ActiveContracts", { count: String(s).padStart(2, "0") }, `${String(s).padStart(2, "0")} active contracts`)), (T = (m = this.element) == null ? void 0 : m.querySelectorAll) == null || T.call(m, "[data-action='showFiltered'], [data-action='hideFiltered']").forEach((w) => {
    w.disabled = a === 0;
  });
  const l = (S = (N = this.element) == null ? void 0 : N.querySelector) == null ? void 0 : S.call(N, ".bb-search-empty");
  l && (l.hidden = a > 0);
}, pe = function() {
  return Object.values(this.filters).some((n) => n.trim().length > 0);
}, me = function() {
  new W().render({ force: !0 });
}, be = function(n) {
  return it(ct(n));
}, ye = async function() {
  await this.close();
}, Be = function(n) {
  const i = ct(n);
  i && new W({ bountyId: i }).render({ force: !0 });
}, Te = function(n) {
  var o, s, l, c, u, d;
  const i = (s = (o = n.target) == null ? void 0 : o.closest("[data-image-src]")) == null ? void 0 : s.getAttribute("data-image-src");
  if (!i) return;
  const a = ((d = (u = (c = (l = n.target) == null ? void 0 : l.closest("[data-bounty-id]")) == null ? void 0 : c.querySelector(".bb-card-title")) == null ? void 0 : u.textContent) == null ? void 0 : d.trim()) || "Bounty Image";
  if (globalThis.ImagePopout) {
    new ImagePopout(i, { title: a }).render(!0);
    return;
  }
  const r = String(i).replaceAll('"', "&quot;");
  new Dialog({
    title: a,
    content: `<img class="bb-image-dialog" src="${r}" alt="" />`,
    buttons: {
      close: { label: "Close" }
    }
  }, { classes: ["bounty-board-window"], width: 720 }).render(!0);
}, Ae = function(n) {
  var a, r, o, s, l;
  const i = (r = (a = n.target) == null ? void 0 : a.closest("[data-open-journal]")) == null ? void 0 : r.getAttribute("data-open-journal");
  (l = (s = (o = game.journal) == null ? void 0 : o.get(i)) == null ? void 0 : s.sheet) == null || l.render(!0);
}, Oe = function(n, i) {
  this.filters.tag = i.dataset.tag ?? "", this.render({ force: !0 });
}, we = async function(n, i) {
  const a = i.dataset.tag ?? "";
  await tn(a) && (this.filters.tag === a && (this.filters.tag = ""), this.render({ force: !0 }));
}, Ce = async function() {
  const n = q(L({ includeHidden: !0 }), this.filters);
  await gt(n.map((i) => i.id), !0) && this.render({ force: !0 });
}, De = async function() {
  const n = q(L({ includeHidden: !0 }), this.filters);
  await gt(n.map((i) => i.id), !1) && this.render({ force: !0 });
}, Se = async function() {
  await ne(!Y()) && this.render({ force: !0 });
}, ve = function() {
  this.filters = { missionType: "", status: "", threatLevel: "", faction: "", tag: "", search: "" }, this.render({ force: !0 });
}, x(O, y), A(O, "DEFAULT_OPTIONS", {
  id: "bounty-board-app",
  tag: "section",
  window: {
    title: "Bounty Board",
    icon: "fa-solid fa-crosshairs",
    minimizable: !1,
    resizable: !0
  },
  position: {
    width: 1180,
    height: 720
  },
  classes: ["bounty-board-window"],
  actions: {
    filterTag: B(O, y, Oe),
    openHandout: B(O, y, be),
    closeBoard: B(O, y, ye),
    createBounty: B(O, y, me),
    editBounty: B(O, y, Be),
    openImage: B(O, y, Te),
    openJournal: B(O, y, Ae),
    removeTag: B(O, y, we),
    showFiltered: B(O, y, Ce),
    hideFiltered: B(O, y, De),
    toggleBoardVisibility: B(O, y, Se),
    clearFilters: B(O, y, ve),
    unlinkTarget: B(O, y, fe)
  }
}), A(O, "PARTS", {
  board: {
    template: `${v}/bounty-board.hbs`
  }
});
let X = O;
function Le() {
  return D || (D = new X()), D.render({ force: !0 }), D;
}
function fn(e) {
  var o, s;
  const t = String(e || ""), n = ((o = game.user) == null ? void 0 : o.isGM) === !0;
  if (!t || !n && !Y() || !L({ includeHidden: n }).some((l) => l.id === t)) return !1;
  D || (D = new X());
  const a = D, r = () => {
    var l;
    a.focusBounty(t), (l = a.bringToFront) == null || l.call(a);
  };
  return a.rendered ? Promise.resolve((s = a.maximize) == null ? void 0 : s.call(a)).then(r) : r(), !0;
}
async function ht(e = null) {
  if (D) {
    if (e != null && e.id && D._findBountyCard(e.id)) {
      await D._refreshBountyCard(e.id, e);
      return;
    }
    D.render({ force: !0 });
  }
}
const hn = {
  "BOUNTYBOARD.Settings.DetailColor.Name": "Detail color",
  "BOUNTYBOARD.Settings.DetailColor.Hint": "Choose the reward text, border, and background color on your cards and handouts. Updates immediately and only affects your display.",
  "BOUNTYBOARD.Settings.DetailColor.Pink": "Hot Pink",
  "BOUNTYBOARD.Settings.DetailColor.Yellow": "Bright Yellow",
  "BOUNTYBOARD.Settings.DetailColor.Green": "Neon Green",
  "BOUNTYBOARD.Settings.LargeCards.Name": "Use Large Bounty Cards",
  "BOUNTYBOARD.Settings.LargeCards.Hint": "Use larger portraits with the title and details below the image. Enabled by default. Disable for compact cards; changes apply immediately to your board.",
  "BOUNTYBOARD.Status.Private": "Private",
  "BOUNTYBOARD.Handout.Title": "Contract handout",
  "BOUNTYBOARD.Handout.Close": "Close handout",
  "BOUNTYBOARD.Handout.Wanted": "Wanted",
  "BOUNTYBOARD.Handout.Briefing": "Contract briefing",
  "BOUNTYBOARD.Handout.PublicNotes": "Public notes",
  "BOUNTYBOARD.Handout.Open": "Open handout",
  "BOUNTYBOARD.Handout.Show": "Show to players",
  "BOUNTYBOARD.Handout.Shared": "A contract handout has been shared with you.",
  "BOUNTYBOARD.Handout.Unavailable": "This contract handout is no longer available.",
  "BOUNTYBOARD.Handout.PublishFirst": "Publish this contract and show the board to players before sharing its handout.",
  "BOUNTYBOARD.Link.DropHint": "Drop Actor / Token onto this bounty to link its target",
  "BOUNTYBOARD.Link.Unlink": "Unlink target",
  "BOUNTYBOARD.Link.Invalid": "Drop a world Actor or Token onto a bounty.",
  "BOUNTYBOARD.Link.MissingBounty": "Bounty not found.",
  "BOUNTYBOARD.Header.ContractTerminal": "Contract Terminal",
  "BOUNTYBOARD.Header.Title": "Bounty Board",
  "BOUNTYBOARD.Header.ActiveContracts": "{count} ACTIVE CONTRACTS",
  "BOUNTYBOARD.Header.ShowingContracts": "Showing {visible} of {total} contracts",
  "BOUNTYBOARD.Header.NewContract": "New Contract",
  "BOUNTYBOARD.Header.TerminalOptions": "Terminal options",
  "BOUNTYBOARD.Header.ShowFiltered": "Show filtered",
  "BOUNTYBOARD.Header.HideFiltered": "Hide filtered",
  "BOUNTYBOARD.Header.HideBoard": "Hide board",
  "BOUNTYBOARD.Header.ShowBoard": "Show board",
  "BOUNTYBOARD.Filter.Status": "Status",
  "BOUNTYBOARD.Filter.MissionType": "Mission type",
  "BOUNTYBOARD.Filter.Threat": "Danger",
  "BOUNTYBOARD.Filter.Faction": "Faction",
  "BOUNTYBOARD.Filter.Tag": "Tags",
  "BOUNTYBOARD.Filter.Search": "Search",
  "BOUNTYBOARD.Filter.AllStatuses": "All",
  "BOUNTYBOARD.Filter.AllThreats": "All",
  "BOUNTYBOARD.Filter.AllFactions": "All",
  "BOUNTYBOARD.Filter.AllTags": "All",
  "BOUNTYBOARD.Filter.SearchPlaceholder": "Search contracts, targets, locations...",
  "BOUNTYBOARD.Filter.Clear": "Clear filters",
  "BOUNTYBOARD.Filter.RemoveTag": "Remove selected tag",
  "BOUNTYBOARD.Empty.Unavailable": "The bounty board is currently unavailable.",
  "BOUNTYBOARD.Empty.NoMatches": "No contracts match the current filters.",
  "BOUNTYBOARD.Editor.ContractId": "Contract ID",
  "BOUNTYBOARD.Editor.Scene": "Location / Scene",
  "BOUNTYBOARD.Editor.NoScene": "No linked scene",
  "BOUNTYBOARD.Card.ContractId": "Contract identifier",
  "BOUNTYBOARD.Card.Target": "Target",
  "BOUNTYBOARD.Card.Reward": "Reward",
  "BOUNTYBOARD.Card.Faction": "Faction",
  "BOUNTYBOARD.Card.Location": "Location",
  "BOUNTYBOARD.Card.Tags": "Tags",
  "BOUNTYBOARD.Card.Threat": "Threat",
  "BOUNTYBOARD.Card.Unlisted": "Unlisted",
  "BOUNTYBOARD.Card.Unknown": "Unknown",
  "BOUNTYBOARD.Card.DossierNotes": "Dossier notes",
  "BOUNTYBOARD.Card.ClaimedBy": "Claimed by",
  "BOUNTYBOARD.Card.AssignedParty": "Assigned party",
  "BOUNTYBOARD.Card.AssigneePlaceholder": "Party or player",
  "BOUNTYBOARD.Card.OpenImage": "Open target image",
  "BOUNTYBOARD.Card.OpenJournal": "Open linked journal",
  "BOUNTYBOARD.Card.Expand": "Expand contract details",
  "BOUNTYBOARD.Card.Collapse": "Collapse contract details",
  "BOUNTYBOARD.Card.ShowDetails": "Details",
  "BOUNTYBOARD.Card.HideDetails": "Hide",
  "BOUNTYBOARD.Action.Edit": "Edit",
  "BOUNTYBOARD.Action.Publish": "Publish",
  "BOUNTYBOARD.Action.Unpublish": "Unpublish",
  "BOUNTYBOARD.Action.Assign": "Assign",
  "BOUNTYBOARD.Action.More": "More",
  "BOUNTYBOARD.Action.Complete": "Complete",
  "BOUNTYBOARD.Action.Fail": "Mark failed",
  "BOUNTYBOARD.Action.Hide": "Hide",
  "BOUNTYBOARD.Action.Archive": "Archive",
  "BOUNTYBOARD.Action.Delete": "Delete",
  "BOUNTYBOARD.Action.Request": "Request contract"
};
function Ne() {
  var t;
  const e = (t = game.i18n) == null ? void 0 : t.translations;
  if (e)
    for (const [n, i] of Object.entries(hn)) {
      const a = foundry.utils.getProperty(e, n);
      (a === void 0 || a === n) && foundry.utils.setProperty(e, n, i);
    }
}
function Re() {
  const e = {
    open: Le,
    getAllBounties: L,
    getBounty: $,
    getBountiesForScene: We,
    getBountiesForActor: Je,
    linkBountyTarget: dt,
    openBounty: fn,
    openHandout: it,
    showHandout: ge,
    upsertBounty: At,
    deleteBounty: ie,
    publishBounty: ae,
    setBountiesPublished: gt,
    setBoardVisibleToPlayers: ne,
    archiveBounty: re,
    claimBounty: Qe
  }, t = game.modules.get(b);
  t && (t.api = e), game.scifiSuite ?? (game.scifiSuite = {}), game.scifiSuite.bountyBoard = e;
}
Hooks.once("init", async () => {
  Ne(), en(), Re(), Handlebars.registerHelper("bbEq", (e, t) => e === t), Handlebars.registerHelper("bbIncludes", (e, t) => Array.isArray(e) && e.includes(t)), Handlebars.registerHelper("bbStatusClass", (e) => `bb-status--${String(e ?? "available").toLowerCase()}`), await loadTemplates([
    `${v}/bounty-card.hbs`,
    `${v}/bounty-board.hbs`,
    `${v}/bounty-editor.hbs`,
    `${v}/bounty-chat-card.hbs`,
    `${v}/bounty-handout.hbs`,
    `${v}/bounty-handout-chat.hbs`
  ]);
});
Hooks.once("ready", () => {
  var e, t, n;
  Qt(), Hooks.on("bountyBoardLayoutChanged", () => ht()), ln(), Ne(), Re(), (n = (t = (e = game.modules.get("holosuite-core")) == null ? void 0 : e.api) == null ? void 0 : t.registerApp) == null || n.call(t, {
    id: b,
    title: ke,
    icon: "fa-solid fa-crosshairs",
    premium: !1,
    description: "Open the sci-fi contract terminal.",
    open: () => Le()
  }), console.log(`${b} | Ready. API available at game.scifiSuite.bountyBoard.`);
});
