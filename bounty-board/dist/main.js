var ce = Object.defineProperty;
var lt = (e) => {
  throw TypeError(e);
};
var le = (e, t, n) => t in e ? ce(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var C = (e, t, n) => le(e, typeof t != "symbol" ? t + "" : t, n), ue = (e, t, n) => t.has(e) || lt("Cannot " + n);
var x = (e, t, n) => t.has(e) ? lt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n);
var m = (e, t, n) => (ue(e, t, "access private method"), n);
const y = "bounty-board", de = "Bounty Board", Q = "bounties", St = "postPublishChat", Lt = "postResultChat", It = "publicDocumentLinks", X = "removedTags", tt = "boardVisibleToPlayers", I = `modules/${y}/templates`, f = Object.freeze({
  AVAILABLE: "available",
  CLAIMED: "claimed",
  COMPLETED: "completed",
  FAILED: "failed",
  HIDDEN: "hidden",
  ARCHIVED: "archived"
}), J = Object.freeze({
  [f.AVAILABLE]: "Available",
  [f.CLAIMED]: "Claimed",
  [f.COMPLETED]: "Completed",
  [f.FAILED]: "Failed",
  [f.HIDDEN]: "Hidden",
  [f.ARCHIVED]: "Archived"
}), et = Object.freeze(["Unknown", "Low", "Moderate", "High", "Severe", "Extreme"]), ge = Object.freeze([
  "Smuggling",
  "Assassination",
  "Rescue",
  "Investigation",
  "Monster Hunt",
  "Recovery",
  "Escort",
  "Sabotage"
]), fe = Object.freeze({
  id: "",
  contractId: "",
  title: "",
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
});
function he(e = {}) {
  const t = Number(e.rewardAmount ?? 0), n = e.rewardCurrency || "credits";
  return {
    ...e,
    title: String(e.title ?? "Untitled Bounty"),
    targetName: String(e.targetName ?? ""),
    threatLevel: String(e.threatLevel ?? "Moderate"),
    faction: String(e.faction ?? ""),
    status: String(e.status ?? "available"),
    rewardLabel: `${Number.isFinite(t) ? t.toLocaleString() : "0"} ${n}`,
    statusLabel: J[e.status] ?? "Available"
  };
}
async function nt(e, t = "published") {
  const n = he(e), a = await renderTemplate(`${I}/bounty-chat-card.hbs`, {
    bounty: n,
    mode: t,
    isResult: t === "result",
    isPublished: t === "published"
  });
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: "Bounty Board" }),
    content: a,
    flags: {
      [y]: {
        bountyId: n.id,
        mode: t
      }
    }
  });
}
function me(e) {
  return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? null));
}
function V() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function N(e = "change bounty data") {
  var t, n, a;
  return (t = game.user) != null && t.isGM ? !0 : ((a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, `Only a GM can ${e}.`), !1);
}
function g(e, t = "") {
  return String(e ?? t).trim();
}
function Nt(e) {
  return Array.isArray(e) ? e.map((t) => g(t)).filter(Boolean) : g(e).split(",").map((t) => t.trim()).filter(Boolean);
}
function pe(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const a = g(n).toLowerCase();
    return !a || t.has(a) ? !1 : (t.add(a), !0);
  });
}
function at() {
  try {
    return Nt(game.settings.get(y, X));
  } catch {
    return [];
  }
}
function G(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function ye(e, t = f.AVAILABLE) {
  return Object.values(f).includes(e) ? e : t;
}
function Be(e) {
  const t = g(e, "Moderate");
  return et.includes(t) ? t : "Moderate";
}
function be(e) {
  const t = Number(e);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function rt(e) {
  return J[e] ?? J[f.AVAILABLE];
}
function vt(e) {
  const t = Number((e == null ? void 0 : e.rewardAmount) ?? 0), n = (e == null ? void 0 : e.rewardCurrency) || "credits";
  return `${t.toLocaleString()} ${n}`;
}
function Ae(e) {
  let t = 0;
  for (const n of e) t = (t * 31 + n.charCodeAt(0)) % 1e4;
  return `BH-${String(t).padStart(4, "0")}`;
}
function D(e = {}) {
  const t = V(), n = g(e.id) || `bounty-${foundry.utils.randomID(12)}`, a = g(e.contractId) || Ae(n), r = g(e.createdAt) || t, i = ye(e.status);
  return {
    ...me(fe),
    id: n,
    contractId: a,
    title: g(e.title, "Untitled Bounty"),
    targetName: g(e.targetName),
    description: g(e.description),
    longDescription: g(e.longDescription),
    rewardAmount: be(e.rewardAmount),
    rewardCurrency: g(e.rewardCurrency, "credits") || "credits",
    threatLevel: Be(e.threatLevel),
    faction: g(e.faction),
    location: g(e.location),
    tags: Nt(e.tags),
    status: i,
    image: g(e.image),
    createdAt: r,
    updatedAt: g(e.updatedAt) || r,
    published: e.published === !0,
    claimedBy: g(e.claimedBy),
    notesGM: g(e.notesGM),
    notesPublic: g(e.notesPublic),
    linkedJournalId: g(e.linkedJournalId),
    linkedActorUuid: g(e.linkedActorUuid),
    sceneId: g(e.sceneId)
  };
}
function ut(e) {
  var s, l, u;
  const t = D(e), n = t.linkedJournalId ? ((s = game.journal) == null ? void 0 : s.get(t.linkedJournalId)) ?? null : null, a = game.settings.get(y, It) === !0, r = game.user, i = foundry.utils.fromUuidSync ?? globalThis.fromUuidSync;
  let o = null;
  if (r != null && r.isGM && t.linkedActorUuid)
    try {
      o = i == null ? void 0 : i(t.linkedActorUuid);
    } catch {
    }
  const c = !!(n && (r != null && r.isGM || a || (l = n.testUserPermission) != null && l.call(n, r, "OBSERVER")));
  return {
    ...t,
    linkedActorName: (o == null ? void 0 : o.name) || t.targetName,
    displayId: t.contractId,
    statusLabel: rt(t.status),
    rewardLabel: vt(t),
    rewardAmountLabel: t.rewardAmount.toLocaleString(),
    rewardCurrencyLabel: t.rewardCurrency,
    threatClass: t.threatLevel.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    searchText: [
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
    isVisibleToPlayers: Rt(t),
    linkedJournalName: (n == null ? void 0 : n.name) ?? "",
    canSeeJournal: c,
    canEdit: ((u = game.user) == null ? void 0 : u.isGM) === !0
  };
}
function Rt(e) {
  const t = D(e);
  return t.published && ![f.HIDDEN, f.ARCHIVED].includes(t.status);
}
function k() {
  return game.settings.get(y, tt) !== !1;
}
async function Et(e) {
  return N(e ? "show the bounty board" : "hide the bounty board") ? (await game.settings.set(y, tt, e === !0), !0) : !1;
}
function R() {
  const e = game.settings.get(y, Q);
  return e ? Array.isArray(e) ? Object.fromEntries(e.map(D).map((t) => [t.id, t])) : typeof e == "object" ? Object.fromEntries(Object.values(e).map(D).map((t) => [t.id, t])) : (console.warn(`${y} | Ignoring invalid bounty setting payload.`, e), {}) : {};
}
async function j(e) {
  return N("save bounties") ? (await game.settings.set(y, Q, e ?? {}), e) : R();
}
function S({ includeHidden: e = ((t) => (t = game.user) == null ? void 0 : t.isGM)() === !0 } = {}) {
  const n = Object.values(R()).map(D);
  return (e ? n : n.filter(Rt)).sort((r, i) => String(i.updatedAt).localeCompare(String(r.updatedAt)));
}
function U(e) {
  const t = R()[e];
  return t ? D(t) : null;
}
function Te(e) {
  var t, n;
  return !e || !((t = game.user) != null && t.isGM) && !k() ? [] : S({ includeHidden: ((n = game.user) == null ? void 0 : n.isGM) === !0 }).filter((a) => a.linkedActorUuid === e).map(({ id: a, rewardAmount: r, rewardCurrency: i, status: o }) => ({ id: a, rewardAmount: r, rewardCurrency: i, status: o }));
}
function z(e, t) {
  var a, r;
  const n = (r = (a = game.i18n) == null ? void 0 : a.localize) == null ? void 0 : r.call(a, `BOUNTYBOARD.Link.${e}`);
  return n && n !== `BOUNTYBOARD.Link.${e}` ? n : t;
}
let dt = Promise.resolve();
function W(e, t) {
  const n = dt.then(async () => {
    if (!N("link bounty targets")) return null;
    if (!U(e)) throw new Error(z("MissingBounty", "Bounty not found."));
    let a = "";
    if (t !== null) {
      if (!["Actor", "Token"].includes(t == null ? void 0 : t.type) || !t.uuid) throw new Error(z("Invalid", "Drop a world Actor or Token onto a bounty."));
      const i = await (foundry.utils.fromUuid ?? globalThis.fromUuid)(t.uuid), o = (i == null ? void 0 : i.documentName) === "Token" ? i.actor : (i == null ? void 0 : i.documentName) === "Actor" ? i : null;
      if (!o || o.pack || !o.uuid || !o.isToken && game.actors.get(o.id) !== o)
        throw new Error(z("Invalid", "Drop a world Actor or Token onto a bounty."));
      a = o.uuid;
    }
    return M(e, { linkedActorUuid: a });
  });
  return dt = n.then(() => {
  }, () => {
  }), n;
}
function Oe(e) {
  var a, r;
  const t = g(e);
  if (!t || !((a = game.scenes) != null && a.get(t))) return [];
  const n = ((r = game.user) == null ? void 0 : r.isGM) === !0;
  return !n && !k() ? [] : S({ includeHidden: n }).filter((i) => i.sceneId === t).map((i) => ({
    id: i.id,
    name: i.targetName || i.title,
    image: i.image,
    status: i.status,
    statusLabel: rt(i.status),
    reward: vt(i),
    sceneId: i.sceneId
  }));
}
function we(e) {
  const t = [];
  return g(e.title) || t.push("Title is required."), g(e.targetName) || t.push("Target name is required."), g(e.rewardCurrency) || t.push("Reward currency is required."), g(e.threatLevel) || t.push("Threat level is required."), t;
}
async function it(e) {
  var c, s;
  if (!N("create or edit bounties")) return null;
  const t = e.id ? U(e.id) : null, n = V(), a = D({
    ...t,
    ...e,
    id: (t == null ? void 0 : t.id) || e.id || `bounty-${foundry.utils.randomID(12)}`,
    createdAt: (t == null ? void 0 : t.createdAt) || n,
    updatedAt: n
  }), r = new Set(at().map((l) => l.toLowerCase()));
  a.tags = a.tags.filter((l) => !r.has(l.toLowerCase()));
  const i = we(a);
  if (i.length)
    return (s = (c = ui.notifications) == null ? void 0 : c.error) == null || s.call(c, i.join(" ")), null;
  const o = R();
  return o[a.id] = a, await j(o), a;
}
async function Ut(e) {
  if (!N("delete bounties") || !await Dialog.confirm({
    title: "Delete Bounty",
    content: "<p>Permanently delete this bounty from world data?</p>"
  })) return !1;
  const n = R();
  return delete n[e], await j(n), !0;
}
async function M(e, t = {}, { chat: n = !1 } = {}) {
  var i, o;
  if (!N("update bounty status")) return null;
  const a = U(e);
  if (!a)
    return (o = (i = ui.notifications) == null ? void 0 : i.warn) == null || o.call(i, "Bounty not found."), null;
  const r = await it({ ...a, ...t });
  return r ? (n && await nt(r, t.status === f.AVAILABLE ? "published" : "result"), r) : null;
}
async function K(e, t = !0) {
  const n = await M(e, {
    published: t,
    status: t ? f.AVAILABLE : f.HIDDEN
  });
  return n && t && game.settings.get(y, St) && await nt(n, "published"), n;
}
async function gt(e, t = !1) {
  const n = t ? f.FAILED : f.COMPLETED, a = await M(e, { status: n });
  return a && game.settings.get(y, Lt) && await nt(a, "result"), a;
}
async function Mt(e) {
  return M(e, { status: f.ARCHIVED, published: !1 });
}
async function Z(e, t) {
  var o, c;
  if (!N(t ? "publish bounties" : "hide bounties")) return 0;
  const n = [...new Set(e)].filter(Boolean);
  if (!n.length) return 0;
  const a = R();
  let r = 0;
  const i = V();
  for (const s of n) {
    const l = a[s];
    if (!l) continue;
    const u = D(l);
    t && u.status === f.ARCHIVED || (u.published = t, t && u.status === f.HIDDEN && (u.status = f.AVAILABLE), t || (u.status = f.HIDDEN), u.updatedAt = i, a[s] = u, r += 1);
  }
  return await j(a), (c = (o = ui.notifications) == null ? void 0 : o.info) == null || c.call(o, `${r} bount${r === 1 ? "y" : "ies"} ${t ? "shown to" : "hidden from"} players.`), r;
}
async function Yt(e, t) {
  return M(e, { status: f.CLAIMED, claimedBy: g(t) });
}
async function Ce(e) {
  var c, s, l, u;
  if (!N("remove bounty tags")) return !1;
  const t = g(e);
  if (!t)
    return (s = (c = ui.notifications) == null ? void 0 : c.warn) == null || s.call(c, "Select a tag to remove."), !1;
  if (!await Dialog.confirm({
    title: "Remove Tag",
    content: `<p>Remove <strong>${G(t)}</strong> from the dropdown and all bounties?</p>`
  })) return !1;
  const a = t.toLowerCase(), r = R();
  let i = 0;
  for (const h of Object.values(r)) {
    const B = h.tags.length;
    h.tags = h.tags.filter((b) => b.toLowerCase() !== a), h.tags.length !== B && (h.updatedAt = V(), i += 1);
  }
  const o = pe([...at(), t]);
  return await game.settings.set(y, X, o), await j(r), (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, `Removed "${t}" from ${i} bount${i === 1 ? "y" : "ies"}.`), !0;
}
function De() {
  const e = S({ includeHidden: !0 }), t = (r) => [...new Set(r.map((i) => g(i)).filter(Boolean))].sort((i, o) => i.localeCompare(o)), n = new Set(at().map((r) => r.toLowerCase())), a = t([...ge, ...e.flatMap((r) => r.tags)]).filter((r) => !n.has(r.toLowerCase()));
  return {
    statuses: Object.values(f).map((r) => ({ value: r, label: rt(r) })),
    threatLevels: et,
    factions: t(e.map((r) => r.faction)),
    tags: a
  };
}
function Y(e, t = {}) {
  const n = g(t.status), a = g(t.threatLevel), r = g(t.faction).toLowerCase(), i = g(t.tag).toLowerCase(), o = g(t.search).toLowerCase();
  return e.filter((c) => {
    const s = D(c);
    return !(n && s.status !== n || a && s.threatLevel !== a || r && s.faction.toLowerCase() !== r || i && !s.tags.some((l) => l.toLowerCase() === i) || o && ![
      s.title,
      s.targetName,
      s.description,
      s.longDescription,
      s.faction,
      s.location,
      s.tags.join(" ")
    ].join(" ").toLowerCase().includes(o));
  });
}
async function Se(e) {
  var r, i, o;
  const t = U(e);
  if (!t) return;
  const n = ChatMessage.getSpeaker({ user: game.user }), a = `
    <div class="bb-chat-card bb-chat-card--request">
      <h3>Contract Request</h3>
      <p><strong>${G(((r = game.user) == null ? void 0 : r.name) ?? "A player")}</strong> requests contract authorization.</p>
      <p><strong>${G(t.title)}</strong> - ${G(t.targetName)}</p>
    </div>
  `;
  await ChatMessage.create({
    speaker: n,
    whisper: ChatMessage.getWhisperRecipients("GM").map((c) => c.id),
    content: a
  }), (o = (i = ui.notifications) == null ? void 0 : i.info) == null || o.call(i, "Contract request sent to the GM.");
}
function Le() {
  game.settings.register(y, Q, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(y, St, {
    name: "Post Chat Card When Publishing",
    hint: "Automatically post a contract card when the GM publishes a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(y, Lt, {
    name: "Post Chat Card When Resolved",
    hint: "Automatically post a result card when the GM completes or fails a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(y, It, {
    name: "Show Linked Journals To Players",
    hint: "Allow player-visible bounty cards to show linked journal buttons when the bounty is published.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(y, tt, {
    name: "Show Bounty Board To Players",
    hint: "Allow players to open the bounty board and see currently published contracts.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(y, X, {
    scope: "world",
    config: !1,
    type: Array,
    default: []
  });
}
var Bt, bt;
const ft = ((bt = (Bt = foundry.applications) == null ? void 0 : Bt.api) == null ? void 0 : bt.ApplicationV2) ?? Application;
var At, Tt;
const ht = (Tt = (At = foundry.applications) == null ? void 0 : At.api) == null ? void 0 : Tt.HandlebarsApplicationMixin, Ie = ht ? ht(ft) : ft;
function mt(e, t = "", n = "Missing document") {
  const a = ((e == null ? void 0 : e.contents) ?? []).map((r) => ({ id: String(r.id), name: String(r.name ?? r.id) }));
  return t && !a.some((r) => r.id === t) && a.push({ id: t, name: `${n} (${t})` }), a;
}
function Ne(e) {
  const t = new FormData(e);
  return {
    id: String(t.get("id") ?? ""),
    contractId: String(t.get("contractId") ?? ""),
    title: String(t.get("title") ?? ""),
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
    claimedBy: String(t.get("claimedBy") ?? ""),
    linkedJournalId: String(t.get("linkedJournalId") ?? ""),
    sceneId: String(t.get("sceneId") ?? "")
  };
}
var E, Ht, kt;
const v = class v extends Ie {
  constructor({ bountyId: n = null } = {}) {
    super();
    C(this, "bountyId");
    this.bountyId = n;
  }
  get title() {
    return this.bountyId ? "Edit Bounty" : "Create Bounty";
  }
  async _prepareContext(n) {
    var r;
    const a = this.bountyId ? U(this.bountyId) : D({});
    return {
      bounty: {
        ...a,
        tagsText: a.tags.join(", ")
      },
      statuses: Object.values(f),
      threatLevels: et,
      journals: mt(game.journal, a.linkedJournalId, "Missing journal"),
      scenes: mt(game.scenes, a.sceneId, "Missing scene"),
      canEdit: ((r = game.user) == null ? void 0 : r.isGM) === !0
    };
  }
  _onRender(n, a) {
    var i, o;
    (i = super._onRender) == null || i.call(this, n, a), (o = this.element.querySelector("[name='title']")) == null || o.focus();
  }
};
E = new WeakSet(), Ht = async function(n, a, r) {
  var o, c, s;
  if (n.preventDefault(), !((o = game.user) != null && o.isGM)) {
    (s = (c = ui.notifications) == null ? void 0 : c.warn) == null || s.call(c, "Only a GM can edit bounties.");
    return;
  }
  const i = await it(Ne(a));
  i && await Ee(i);
}, kt = function(n) {
  n.preventDefault();
  const a = this.element.querySelector("[name='image']");
  a && new FilePicker({
    type: "image",
    current: a.value,
    callback: (r) => {
      a.value = r, a.dispatchEvent(new Event("change", { bubbles: !0 }));
    }
  }).browse();
}, x(v, E), C(v, "DEFAULT_OPTIONS", {
  id: "bounty-editor-app",
  tag: "form",
  form: {
    handler: m(v, E, Ht),
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
    browseImage: m(v, E, kt)
  }
}), C(v, "PARTS", {
  editor: {
    template: `${I}/bounty-editor.hbs`
  }
});
let _ = v;
var Ot, wt;
const pt = ((wt = (Ot = foundry.applications) == null ? void 0 : Ot.api) == null ? void 0 : wt.ApplicationV2) ?? Application;
var Ct, Dt;
const yt = (Dt = (Ct = foundry.applications) == null ? void 0 : Ct.api) == null ? void 0 : Dt.HandlebarsApplicationMixin, ve = yt ? yt(pt) : pt;
let A = null;
function O(e) {
  var t, n;
  return ((n = (t = e.target) == null ? void 0 : t.closest("[data-bounty-id]")) == null ? void 0 : n.getAttribute("data-bounty-id")) ?? "";
}
function $(e, t, n) {
  var r, i;
  const a = (i = (r = game.i18n) == null ? void 0 : r.format) == null ? void 0 : i.call(r, e, t);
  return a && a !== e ? a : n;
}
var d, Ft, w, Pt, H, xt, $t, Gt, _t, qt, Vt, jt, zt, Jt, Wt, Kt, Zt, Qt, Xt, te, ee, ne, ae, re;
const p = class p extends ve {
  constructor(n = {}) {
    super(n);
    x(this, w);
    C(this, "filters");
    C(this, "expanded");
    C(this, "focusBountyId");
    C(this, "_targetDropController");
    this.filters = {
      status: "",
      threatLevel: "",
      faction: "",
      tag: "",
      search: ""
    }, this.expanded = /* @__PURE__ */ new Set(), this.focusBountyId = null;
  }
  async _prepareContext(n) {
    var b;
    const a = ((b = game.user) == null ? void 0 : b.isGM) === !0, r = k(), i = !a && !r, o = S({ includeHidden: a }).map(ut).map((T) => ({ ...T, expanded: this.expanded.has(T.id) })), c = { ...this.filters, search: "" }, s = i ? [] : Y(o, c), l = i ? 0 : Y(o, this.filters).length, u = o.filter((T) => [f.AVAILABLE, f.CLAIMED].includes(T.status)).length, h = Object.values(this.filters).some((T) => T.trim().length > 0), B = String(u).padStart(2, "0");
    return {
      isGM: a,
      boardVisibleToPlayers: r,
      boardHiddenForPlayers: i,
      filters: this.filters,
      options: De(),
      bounties: s,
      totalCount: o.length,
      visibleCount: l,
      activeCount: u,
      contractSummary: h ? $("BOUNTYBOARD.Header.ShowingContracts", { visible: l, total: o.length }, `Showing ${l} of ${o.length} contracts`) : $("BOUNTYBOARD.Header.ActiveContracts", { count: B }, `${B} active contracts`)
    };
  }
  _onRender(n, a) {
    var i, o, c, s;
    (i = super._onRender) == null || i.call(this, n, a);
    const r = this.element;
    if ((o = this._targetDropController) == null || o.abort(), (c = game.user) != null && c.isGM) {
      this._targetDropController = new AbortController();
      const { signal: l } = this._targetDropController;
      r.addEventListener("dragover", (u) => {
        var B, b;
        const h = (b = (B = u.target) == null ? void 0 : B.closest) == null ? void 0 : b.call(B, ".bb-card[data-bounty-id]");
        h && (u.preventDefault(), u.dataTransfer && (u.dataTransfer.dropEffect = "copy"), h.classList.add("bb-target-drop-active"));
      }, { signal: l }), r.addEventListener("dragleave", (u) => {
        var B, b;
        const h = (b = (B = u.target) == null ? void 0 : B.closest) == null ? void 0 : b.call(B, ".bb-card[data-bounty-id]");
        h && !h.contains(u.relatedTarget) && h.classList.remove("bb-target-drop-active");
      }, { signal: l }), r.addEventListener("drop", (u) => this._onTargetDrop(u), { signal: l });
    }
    if ((s = r.querySelector(".bb-filters")) == null || s.addEventListener("submit", (l) => {
      l.preventDefault(), l.stopPropagation();
    }), r.querySelectorAll("[data-filter]").forEach((l) => {
      l.dataset.filter === "search" ? l.addEventListener("input", () => {
        this.filters.search = l.value, m(this, w, H).call(this);
      }) : l.addEventListener("change", () => m(this, w, Pt).call(this, l, { immediate: !0 }));
    }), m(this, w, H).call(this), this._bindBountyToggles(r), this.focusBountyId) {
      const l = this.focusBountyId;
      this.focusBountyId = null, requestAnimationFrame(() => {
        const u = this._findBountyCard(l);
        u && (u.tabIndex = -1, u.scrollIntoView({ block: "center", behavior: "smooth" }), u.focus({ preventScroll: !0 }));
      });
    }
  }
  _bindBountyToggles(n) {
    n.querySelectorAll("[data-bounty-toggle]").forEach((a) => {
      a.addEventListener("click", () => {
        const r = a.dataset.bountyToggle ?? "", i = !this.expanded.has(r);
        i ? this.expanded.add(r) : this.expanded.delete(r);
        const o = a.closest("[data-bounty-id]");
        o == null || o.classList.toggle("is-expanded", i), o == null || o.classList.toggle("is-collapsed", !i);
        const c = o == null ? void 0 : o.querySelector(".bb-card-details");
        c && (c.hidden = !i), a.setAttribute("aria-expanded", String(i)), a.title = i ? a.dataset.expandedTitle ?? "" : a.dataset.collapsedTitle ?? "";
        const s = a.querySelector(".bb-expand-label");
        s && (s.textContent = i ? a.dataset.expandedLabel ?? "" : a.dataset.collapsedLabel ?? "");
        const l = a.querySelector(".bb-visually-hidden");
        l && (l.textContent = a.title);
        const u = a.querySelector("i");
        u == null || u.classList.toggle("fa-chevron-up", i), u == null || u.classList.toggle("fa-chevron-down", !i);
      });
    });
  }
  async _onTargetDrop(n) {
    var r, i, o, c, s, l, u, h, B;
    const a = (i = (r = n.target) == null ? void 0 : r.closest) == null ? void 0 : i.call(r, ".bb-card[data-bounty-id]");
    if (!(!a || !((o = game.user) != null && o.isGM))) {
      n.preventDefault(), n.stopPropagation(), a.classList.remove("bb-target-drop-active");
      try {
        const b = ((l = (s = (c = foundry.applications) == null ? void 0 : c.ux) == null ? void 0 : s.TextEditor) == null ? void 0 : l.implementation) ?? globalThis.TextEditor, T = b != null && b.getDragEventData ? b.getDragEventData(n) : JSON.parse(((u = n.dataTransfer) == null ? void 0 : u.getData("text/plain")) || "{}"), L = await W(a.dataset.bountyId || "", T);
        L && await this._refreshBountyCard(L.id, L);
      } catch (b) {
        (B = (h = ui.notifications) == null ? void 0 : h.warn) == null || B.call(h, b.message);
      }
    }
  }
  _findBountyCard(n) {
    var r, i;
    return Array.from(((i = (r = this.element) == null ? void 0 : r.querySelectorAll) == null ? void 0 : i.call(r, "[data-bounty-id]")) ?? []).find((o) => o.dataset.bountyId === n) ?? null;
  }
  _syncCountData() {
    var i, o, c;
    const n = S({ includeHidden: ((i = game.user) == null ? void 0 : i.isGM) === !0 }), a = n.filter((s) => [f.AVAILABLE, f.CLAIMED].includes(s.status)).length, r = (c = (o = this.element) == null ? void 0 : o.querySelector) == null ? void 0 : c.call(o, ".bb-subtitle");
    r && (r.dataset.totalCount = String(n.length), r.dataset.activeCount = String(a));
  }
  async _refreshBountyCard(n, a) {
    var s;
    const r = this._findBountyCard(n);
    if (!r || !a) return;
    const i = {
      ...ut(a),
      expanded: this.expanded.has(n)
    }, o = { ...this.filters, search: "" };
    if (!(Y([i], o).length > 0))
      r.remove();
    else {
      const l = await renderTemplate(`${I}/bounty-card.hbs`, {
        bounty: i,
        isGM: ((s = game.user) == null ? void 0 : s.isGM) === !0
      }), u = document.createElement("template");
      u.innerHTML = String(l).trim();
      const h = u.content.firstElementChild;
      h && (r.replaceWith(h), this._bindBountyToggles(h));
    }
    this._syncCountData(), m(this, w, H).call(this);
  }
  _removeBountyCard(n) {
    var a;
    (a = this._findBountyCard(n)) == null || a.remove(), this.expanded.delete(n), this._syncCountData(), m(this, w, H).call(this);
  }
  focusBounty(n) {
    this.filters = { status: "", threatLevel: "", faction: "", tag: "", search: "" }, this.expanded.add(n), this.focusBountyId = n, this.render({ force: !0 });
  }
  async close(n = {}) {
    var a;
    return (a = this._targetDropController) == null || a.abort(), A === this && (A = null), super.close(n);
  }
};
d = new WeakSet(), Ft = async function(n) {
  var a, r;
  try {
    const i = await W(O(n), null);
    i && await this._refreshBountyCard(i.id, i);
  } catch (i) {
    (r = (a = ui.notifications) == null ? void 0 : a.warn) == null || r.call(a, i.message);
  }
}, w = new WeakSet(), Pt = function(n, { immediate: a = !1 } = {}) {
  const r = n.dataset.filter;
  r && (this.filters[r] = n.value, this.render({ force: !0 }));
}, H = function() {
  var l, u, h, B, b, T, L, ot, F, st;
  const n = this.filters.search.trim().toLowerCase(), a = Array.from(((u = (l = this.element) == null ? void 0 : l.querySelectorAll) == null ? void 0 : u.call(l, "[data-bounty-id]")) ?? []);
  let r = 0;
  for (const P of a) {
    const ct = !n || String(P.dataset.searchText ?? "").includes(n);
    P.hidden = !ct, ct && (r += 1);
  }
  const i = (B = (h = this.element) == null ? void 0 : h.querySelector) == null ? void 0 : B.call(h, ".bb-subtitle"), o = Number(((b = i == null ? void 0 : i.dataset) == null ? void 0 : b.totalCount) ?? a.length), c = Number(((T = i == null ? void 0 : i.dataset) == null ? void 0 : T.activeCount) ?? a.length);
  i && (i.textContent = m(this, w, xt).call(this) ? $("BOUNTYBOARD.Header.ShowingContracts", { visible: r, total: o }, `Showing ${r} of ${o} contracts`) : $("BOUNTYBOARD.Header.ActiveContracts", { count: String(c).padStart(2, "0") }, `${String(c).padStart(2, "0")} active contracts`)), (ot = (L = this.element) == null ? void 0 : L.querySelectorAll) == null || ot.call(L, "[data-action='showFiltered'], [data-action='hideFiltered']").forEach((P) => {
    P.disabled = r === 0;
  });
  const s = (st = (F = this.element) == null ? void 0 : F.querySelector) == null ? void 0 : st.call(F, ".bb-search-empty");
  s && (s.hidden = r > 0);
}, xt = function() {
  return Object.values(this.filters).some((n) => n.trim().length > 0);
}, $t = function() {
  new _().render({ force: !0 });
}, Gt = function(n) {
  const a = O(n);
  a && new _({ bountyId: a }).render({ force: !0 });
}, _t = async function(n) {
  const a = O(n);
  a && await Ut(a) && this._removeBountyCard(a);
}, qt = async function(n) {
  const a = O(n);
  if (a) {
    const r = await K(a, !0);
    r && await this._refreshBountyCard(a, r);
  }
}, Vt = async function(n) {
  const a = O(n);
  if (a) {
    const r = await K(a, !1);
    r && await this._refreshBountyCard(a, r);
  }
}, jt = async function(n) {
  const a = O(n);
  if (a) {
    const r = await Mt(a);
    r && await this._refreshBountyCard(a, r);
  }
}, zt = async function(n) {
  const a = O(n);
  if (a) {
    const r = await gt(a, !1);
    r && await this._refreshBountyCard(a, r);
  }
}, Jt = async function(n) {
  const a = O(n);
  if (a) {
    const r = await gt(a, !0);
    r && await this._refreshBountyCard(a, r);
  }
}, Wt = async function(n) {
  const a = O(n);
  if (a) {
    const r = await M(a, { status: f.HIDDEN, published: !1 });
    r && await this._refreshBountyCard(a, r);
  }
}, Kt = async function(n) {
  var i, o, c;
  const a = O(n), r = ((c = (o = (i = n.target) == null ? void 0 : i.closest("[data-bounty-id]")) == null ? void 0 : o.querySelector("[data-claimed-by]")) == null ? void 0 : c.value) ?? "";
  if (a) {
    const s = await Yt(a, r);
    s && await this._refreshBountyCard(a, s);
  }
}, Zt = async function(n) {
  const a = O(n);
  a && await Se(a);
}, Qt = function(n) {
  var o, c, s, l, u, h;
  const a = (c = (o = n.target) == null ? void 0 : o.closest("[data-image-src]")) == null ? void 0 : c.getAttribute("data-image-src");
  if (!a) return;
  const r = ((h = (u = (l = (s = n.target) == null ? void 0 : s.closest("[data-bounty-id]")) == null ? void 0 : l.querySelector(".bb-card-title")) == null ? void 0 : u.textContent) == null ? void 0 : h.trim()) || "Bounty Image";
  if (globalThis.ImagePopout) {
    new ImagePopout(a, { title: r }).render(!0);
    return;
  }
  const i = String(a).replaceAll('"', "&quot;");
  new Dialog({
    title: r,
    content: `<img class="bb-image-dialog" src="${i}" alt="" />`,
    buttons: {
      close: { label: "Close" }
    }
  }, { classes: ["bounty-board-window"], width: 720 }).render(!0);
}, Xt = function(n) {
  var r, i, o, c, s;
  const a = (i = (r = n.target) == null ? void 0 : r.closest("[data-open-journal]")) == null ? void 0 : i.getAttribute("data-open-journal");
  (s = (c = (o = game.journal) == null ? void 0 : o.get(a)) == null ? void 0 : c.sheet) == null || s.render(!0);
}, te = async function() {
  const n = this.filters.tag;
  await Ce(n) && (this.filters.tag = "", this.render({ force: !0 }));
}, ee = async function() {
  const n = Y(S({ includeHidden: !0 }), this.filters);
  await Z(n.map((a) => a.id), !0) && this.render({ force: !0 });
}, ne = async function() {
  const n = Y(S({ includeHidden: !0 }), this.filters);
  await Z(n.map((a) => a.id), !1) && this.render({ force: !0 });
}, ae = async function() {
  await Et(!k()) && this.render({ force: !0 });
}, re = function() {
  this.filters = { status: "", threatLevel: "", faction: "", tag: "", search: "" }, this.render({ force: !0 });
}, x(p, d), C(p, "DEFAULT_OPTIONS", {
  id: "bounty-board-app",
  tag: "section",
  window: {
    title: "Bounty Board",
    icon: "fa-solid fa-crosshairs",
    resizable: !0
  },
  position: {
    width: 980,
    height: 720
  },
  classes: ["bounty-board-window"],
  actions: {
    createBounty: m(p, d, $t),
    editBounty: m(p, d, Gt),
    deleteBounty: m(p, d, _t),
    publishBounty: m(p, d, qt),
    unpublishBounty: m(p, d, Vt),
    archiveBounty: m(p, d, jt),
    completeBounty: m(p, d, zt),
    failBounty: m(p, d, Jt),
    hideBounty: m(p, d, Wt),
    claimBounty: m(p, d, Kt),
    requestContract: m(p, d, Zt),
    openImage: m(p, d, Qt),
    openJournal: m(p, d, Xt),
    removeTag: m(p, d, te),
    showFiltered: m(p, d, ee),
    hideFiltered: m(p, d, ne),
    toggleBoardVisibility: m(p, d, ae),
    clearFilters: m(p, d, re),
    unlinkTarget: m(p, d, Ft)
  }
}), C(p, "PARTS", {
  board: {
    template: `${I}/bounty-board.hbs`
  }
});
let q = p;
function ie() {
  return A || (A = new q()), A.render({ force: !0 }), A;
}
function Re(e) {
  var o, c;
  const t = String(e || ""), n = ((o = game.user) == null ? void 0 : o.isGM) === !0;
  if (!t || !n && !k() || !S({ includeHidden: n }).some((s) => s.id === t)) return !1;
  A || (A = new q());
  const r = A, i = () => {
    var s;
    r.focusBounty(t), (s = r.bringToFront) == null || s.call(r);
  };
  return r.rendered ? Promise.resolve((c = r.maximize) == null ? void 0 : c.call(r)).then(i) : i(), !0;
}
async function Ee(e = null) {
  if (A) {
    if (e != null && e.id && A._findBountyCard(e.id)) {
      await A._refreshBountyCard(e.id, e);
      return;
    }
    A.render({ force: !0 });
  }
}
const Ue = {
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
  "BOUNTYBOARD.Filter.Threat": "Threat",
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
function oe() {
  var t;
  const e = (t = game.i18n) == null ? void 0 : t.translations;
  if (e)
    for (const [n, a] of Object.entries(Ue)) {
      const r = foundry.utils.getProperty(e, n);
      (r === void 0 || r === n) && foundry.utils.setProperty(e, n, a);
    }
}
function se() {
  const e = {
    open: ie,
    getAllBounties: S,
    getBounty: U,
    getBountiesForScene: Oe,
    getBountiesForActor: Te,
    linkBountyTarget: W,
    openBounty: Re,
    upsertBounty: it,
    deleteBounty: Ut,
    publishBounty: K,
    setBountiesPublished: Z,
    setBoardVisibleToPlayers: Et,
    archiveBounty: Mt,
    claimBounty: Yt
    // Future extension hooks:
    // Patreon/premium gating can wrap open() or selected GM actions here.
    // Random bounty generator can call upsertBounty() with generated data.
    // Faction reputation systems can listen for completed/failed state changes.
    // Galaxy Map consumes the permission-filtered Scene query above when installed.
    // CyberCall contact integration can add claimant/contact actions.
    // Security camera and crime scene modules can attach evidence links via notes or future document ids.
  }, t = game.modules.get(y);
  t && (t.api = e), game.scifiSuite ?? (game.scifiSuite = {}), game.scifiSuite.bountyBoard = e;
}
Hooks.once("init", async () => {
  oe(), Le(), se(), Handlebars.registerHelper("bbEq", (e, t) => e === t), Handlebars.registerHelper("bbIncludes", (e, t) => Array.isArray(e) && e.includes(t)), Handlebars.registerHelper("bbStatusClass", (e) => `bb-status--${String(e ?? "available").toLowerCase()}`), await loadTemplates([
    `${I}/bounty-card.hbs`,
    `${I}/bounty-board.hbs`,
    `${I}/bounty-editor.hbs`,
    `${I}/bounty-chat-card.hbs`
  ]);
});
Hooks.once("ready", () => {
  var e, t, n;
  oe(), se(), (n = (t = (e = game.modules.get("holosuite-core")) == null ? void 0 : e.api) == null ? void 0 : t.registerApp) == null || n.call(t, {
    id: y,
    title: de,
    icon: "fa-solid fa-crosshairs",
    premium: !1,
    description: "Open the sci-fi contract terminal.",
    open: () => ie()
  }), console.log(`${y} | Ready. API available at game.scifiSuite.bountyBoard.`);
});
