var re = Object.defineProperty;
var ot = (e) => {
  throw TypeError(e);
};
var ie = (e, t, n) => t in e ? re(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var C = (e, t, n) => ie(e, typeof t != "symbol" ? t + "" : t, n), se = (e, t, n) => t.has(e) || ot("Cannot " + n);
var $ = (e, t, n) => t.has(e) ? ot("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n);
var h = (e, t, n) => (se(e, t, "access private method"), n);
const p = "bounty-board", oe = "Bounty Board", K = "bounties", Ct = "postPublishChat", wt = "postResultChat", St = "publicDocumentLinks", Z = "removedTags", Q = "boardVisibleToPlayers", w = `modules/${p}/templates`, d = Object.freeze({
  AVAILABLE: "available",
  CLAIMED: "claimed",
  COMPLETED: "completed",
  FAILED: "failed",
  HIDDEN: "hidden",
  ARCHIVED: "archived"
}), z = Object.freeze({
  [d.AVAILABLE]: "Available",
  [d.CLAIMED]: "Claimed",
  [d.COMPLETED]: "Completed",
  [d.FAILED]: "Failed",
  [d.HIDDEN]: "Hidden",
  [d.ARCHIVED]: "Archived"
}), X = Object.freeze(["Unknown", "Low", "Moderate", "High", "Severe", "Extreme"]), ce = Object.freeze([
  "Smuggling",
  "Assassination",
  "Rescue",
  "Investigation",
  "Monster Hunt",
  "Recovery",
  "Escort",
  "Sabotage"
]), le = Object.freeze({
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
  status: d.AVAILABLE,
  image: "",
  createdAt: "",
  updatedAt: "",
  published: !1,
  claimedBy: "",
  notesGM: "",
  notesPublic: "",
  linkedJournalId: "",
  sceneId: ""
});
function ue(e = {}) {
  const t = Number(e.rewardAmount ?? 0), n = e.rewardCurrency || "credits";
  return {
    ...e,
    title: String(e.title ?? "Untitled Bounty"),
    targetName: String(e.targetName ?? ""),
    threatLevel: String(e.threatLevel ?? "Moderate"),
    faction: String(e.faction ?? ""),
    status: String(e.status ?? "available"),
    rewardLabel: `${Number.isFinite(t) ? t.toLocaleString() : "0"} ${n}`,
    statusLabel: z[e.status] ?? "Available"
  };
}
async function tt(e, t = "published") {
  const n = ue(e), a = await renderTemplate(`${w}/bounty-chat-card.hbs`, {
    bounty: n,
    mode: t,
    isResult: t === "result",
    isPublished: t === "published"
  });
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: "Bounty Board" }),
    content: a,
    flags: {
      [p]: {
        bountyId: n.id,
        mode: t
      }
    }
  });
}
function de(e) {
  return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? null));
}
function G() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function N(e = "change bounty data") {
  var t, n, a;
  return (t = game.user) != null && t.isGM ? !0 : ((a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, `Only a GM can ${e}.`), !1);
}
function u(e, t = "") {
  return String(e ?? t).trim();
}
function Dt(e) {
  return Array.isArray(e) ? e.map((t) => u(t)).filter(Boolean) : u(e).split(",").map((t) => t.trim()).filter(Boolean);
}
function fe(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const a = u(n).toLowerCase();
    return !a || t.has(a) ? !1 : (t.add(a), !0);
  });
}
function et() {
  try {
    return Dt(game.settings.get(p, Z));
  } catch {
    return [];
  }
}
function q(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function ge(e, t = d.AVAILABLE) {
  return Object.values(d).includes(e) ? e : t;
}
function he(e) {
  const t = u(e, "Moderate");
  return X.includes(t) ? t : "Moderate";
}
function me(e) {
  const t = Number(e);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function nt(e) {
  return z[e] ?? z[d.AVAILABLE];
}
function Lt(e) {
  const t = Number((e == null ? void 0 : e.rewardAmount) ?? 0), n = (e == null ? void 0 : e.rewardCurrency) || "credits";
  return `${t.toLocaleString()} ${n}`;
}
function pe(e) {
  let t = 0;
  for (const n of e) t = (t * 31 + n.charCodeAt(0)) % 1e4;
  return `BH-${String(t).padStart(4, "0")}`;
}
function O(e = {}) {
  const t = G(), n = u(e.id) || `bounty-${foundry.utils.randomID(12)}`, a = u(e.contractId) || pe(n), r = u(e.createdAt) || t, i = ge(e.status);
  return {
    ...de(le),
    id: n,
    contractId: a,
    title: u(e.title, "Untitled Bounty"),
    targetName: u(e.targetName),
    description: u(e.description),
    longDescription: u(e.longDescription),
    rewardAmount: me(e.rewardAmount),
    rewardCurrency: u(e.rewardCurrency, "credits") || "credits",
    threatLevel: he(e.threatLevel),
    faction: u(e.faction),
    location: u(e.location),
    tags: Dt(e.tags),
    status: i,
    image: u(e.image),
    createdAt: r,
    updatedAt: u(e.updatedAt) || r,
    published: e.published === !0,
    claimedBy: u(e.claimedBy),
    notesGM: u(e.notesGM),
    notesPublic: u(e.notesPublic),
    linkedJournalId: u(e.linkedJournalId),
    sceneId: u(e.sceneId)
  };
}
function ct(e) {
  var s, o, c;
  const t = O(e), n = t.linkedJournalId ? ((s = game.journal) == null ? void 0 : s.get(t.linkedJournalId)) ?? null : null, a = game.settings.get(p, St) === !0, r = game.user, i = !!(n && (r != null && r.isGM || a || (o = n.testUserPermission) != null && o.call(n, r, "OBSERVER")));
  return {
    ...t,
    displayId: t.contractId,
    statusLabel: nt(t.status),
    rewardLabel: Lt(t),
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
    isClaimed: t.status === d.CLAIMED,
    isVisibleToPlayers: It(t),
    linkedJournalName: (n == null ? void 0 : n.name) ?? "",
    canSeeJournal: i,
    canEdit: ((c = game.user) == null ? void 0 : c.isGM) === !0
  };
}
function It(e) {
  const t = O(e);
  return t.published && ![d.HIDDEN, d.ARCHIVED].includes(t.status);
}
function V() {
  return game.settings.get(p, Q) !== !1;
}
async function Nt(e) {
  return N(e ? "show the bounty board" : "hide the bounty board") ? (await game.settings.set(p, Q, e === !0), !0) : !1;
}
function v() {
  const e = game.settings.get(p, K);
  return e ? Array.isArray(e) ? Object.fromEntries(e.map(O).map((t) => [t.id, t])) : typeof e == "object" ? Object.fromEntries(Object.values(e).map(O).map((t) => [t.id, t])) : (console.warn(`${p} | Ignoring invalid bounty setting payload.`, e), {}) : {};
}
async function _(e) {
  return N("save bounties") ? (await game.settings.set(p, K, e ?? {}), e) : v();
}
function S({ includeHidden: e = ((t) => (t = game.user) == null ? void 0 : t.isGM)() === !0 } = {}) {
  const n = Object.values(v()).map(O);
  return (e ? n : n.filter(It)).sort((r, i) => String(i.updatedAt).localeCompare(String(r.updatedAt)));
}
function H(e) {
  const t = v()[e];
  return t ? O(t) : null;
}
function ye(e) {
  var a, r;
  const t = u(e);
  if (!t || !((a = game.scenes) != null && a.get(t))) return [];
  const n = ((r = game.user) == null ? void 0 : r.isGM) === !0;
  return !n && !V() ? [] : S({ includeHidden: n }).filter((i) => i.sceneId === t).map((i) => ({
    id: i.id,
    name: i.targetName || i.title,
    image: i.image,
    status: i.status,
    statusLabel: nt(i.status),
    reward: Lt(i),
    sceneId: i.sceneId
  }));
}
function Be(e) {
  const t = [];
  return u(e.title) || t.push("Title is required."), u(e.targetName) || t.push("Target name is required."), u(e.rewardCurrency) || t.push("Reward currency is required."), u(e.threatLevel) || t.push("Threat level is required."), t;
}
async function at(e) {
  var o, c;
  if (!N("create or edit bounties")) return null;
  const t = e.id ? H(e.id) : null, n = G(), a = O({
    ...t,
    ...e,
    id: (t == null ? void 0 : t.id) || e.id || `bounty-${foundry.utils.randomID(12)}`,
    createdAt: (t == null ? void 0 : t.createdAt) || n,
    updatedAt: n
  }), r = new Set(et().map((f) => f.toLowerCase()));
  a.tags = a.tags.filter((f) => !r.has(f.toLowerCase()));
  const i = Be(a);
  if (i.length)
    return (c = (o = ui.notifications) == null ? void 0 : o.error) == null || c.call(o, i.join(" ")), null;
  const s = v();
  return s[a.id] = a, await _(s), a;
}
async function vt(e) {
  if (!N("delete bounties") || !await Dialog.confirm({
    title: "Delete Bounty",
    content: "<p>Permanently delete this bounty from world data?</p>"
  })) return !1;
  const n = v();
  return delete n[e], await _(n), !0;
}
async function M(e, t = {}, { chat: n = !1 } = {}) {
  var i, s;
  if (!N("update bounty status")) return null;
  const a = H(e);
  if (!a)
    return (s = (i = ui.notifications) == null ? void 0 : i.warn) == null || s.call(i, "Bounty not found."), null;
  const r = await at({ ...a, ...t });
  return r ? (n && await tt(r, t.status === d.AVAILABLE ? "published" : "result"), r) : null;
}
async function J(e, t = !0) {
  const n = await M(e, {
    published: t,
    status: t ? d.AVAILABLE : d.HIDDEN
  });
  return n && t && game.settings.get(p, Ct) && await tt(n, "published"), n;
}
async function lt(e, t = !1) {
  const n = t ? d.FAILED : d.COMPLETED, a = await M(e, { status: n });
  return a && game.settings.get(p, wt) && await tt(a, "result"), a;
}
async function Rt(e) {
  return M(e, { status: d.ARCHIVED, published: !1 });
}
async function W(e, t) {
  var s, o;
  if (!N(t ? "publish bounties" : "hide bounties")) return 0;
  const n = [...new Set(e)].filter(Boolean);
  if (!n.length) return 0;
  const a = v();
  let r = 0;
  const i = G();
  for (const c of n) {
    const f = a[c];
    if (!f) continue;
    const g = O(f);
    t && g.status === d.ARCHIVED || (g.published = t, t && g.status === d.HIDDEN && (g.status = d.AVAILABLE), t || (g.status = d.HIDDEN), g.updatedAt = i, a[c] = g, r += 1);
  }
  return await _(a), (o = (s = ui.notifications) == null ? void 0 : s.info) == null || o.call(s, `${r} bount${r === 1 ? "y" : "ies"} ${t ? "shown to" : "hidden from"} players.`), r;
}
async function Et(e, t) {
  return M(e, { status: d.CLAIMED, claimedBy: u(t) });
}
async function be(e) {
  var o, c, f, g;
  if (!N("remove bounty tags")) return !1;
  const t = u(e);
  if (!t)
    return (c = (o = ui.notifications) == null ? void 0 : o.warn) == null || c.call(o, "Select a tag to remove."), !1;
  if (!await Dialog.confirm({
    title: "Remove Tag",
    content: `<p>Remove <strong>${q(t)}</strong> from the dropdown and all bounties?</p>`
  })) return !1;
  const a = t.toLowerCase(), r = v();
  let i = 0;
  for (const y of Object.values(r)) {
    const D = y.tags.length;
    y.tags = y.tags.filter((L) => L.toLowerCase() !== a), y.tags.length !== D && (y.updatedAt = G(), i += 1);
  }
  const s = fe([...et(), t]);
  return await game.settings.set(p, Z, s), await _(r), (g = (f = ui.notifications) == null ? void 0 : f.info) == null || g.call(f, `Removed "${t}" from ${i} bount${i === 1 ? "y" : "ies"}.`), !0;
}
function Ae() {
  const e = S({ includeHidden: !0 }), t = (r) => [...new Set(r.map((i) => u(i)).filter(Boolean))].sort((i, s) => i.localeCompare(s)), n = new Set(et().map((r) => r.toLowerCase())), a = t([...ce, ...e.flatMap((r) => r.tags)]).filter((r) => !n.has(r.toLowerCase()));
  return {
    statuses: Object.values(d).map((r) => ({ value: r, label: nt(r) })),
    threatLevels: X,
    factions: t(e.map((r) => r.faction)),
    tags: a
  };
}
function E(e, t = {}) {
  const n = u(t.status), a = u(t.threatLevel), r = u(t.faction).toLowerCase(), i = u(t.tag).toLowerCase(), s = u(t.search).toLowerCase();
  return e.filter((o) => {
    const c = O(o);
    return !(n && c.status !== n || a && c.threatLevel !== a || r && c.faction.toLowerCase() !== r || i && !c.tags.some((f) => f.toLowerCase() === i) || s && ![
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
async function Oe(e) {
  var r, i, s;
  const t = H(e);
  if (!t) return;
  const n = ChatMessage.getSpeaker({ user: game.user }), a = `
    <div class="bb-chat-card bb-chat-card--request">
      <h3>Contract Request</h3>
      <p><strong>${q(((r = game.user) == null ? void 0 : r.name) ?? "A player")}</strong> requests contract authorization.</p>
      <p><strong>${q(t.title)}</strong> - ${q(t.targetName)}</p>
    </div>
  `;
  await ChatMessage.create({
    speaker: n,
    whisper: ChatMessage.getWhisperRecipients("GM").map((o) => o.id),
    content: a
  }), (s = (i = ui.notifications) == null ? void 0 : i.info) == null || s.call(i, "Contract request sent to the GM.");
}
function Te() {
  game.settings.register(p, K, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(p, Ct, {
    name: "Post Chat Card When Publishing",
    hint: "Automatically post a contract card when the GM publishes a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(p, wt, {
    name: "Post Chat Card When Resolved",
    hint: "Automatically post a result card when the GM completes or fails a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(p, St, {
    name: "Show Linked Journals To Players",
    hint: "Allow player-visible bounty cards to show linked journal buttons when the bounty is published.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(p, Q, {
    name: "Show Bounty Board To Players",
    hint: "Allow players to open the bounty board and see currently published contracts.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(p, Z, {
    scope: "world",
    config: !1,
    type: Array,
    default: []
  });
}
var mt, pt;
const ut = ((pt = (mt = foundry.applications) == null ? void 0 : mt.api) == null ? void 0 : pt.ApplicationV2) ?? Application;
var yt, Bt;
const dt = (Bt = (yt = foundry.applications) == null ? void 0 : yt.api) == null ? void 0 : Bt.HandlebarsApplicationMixin, Ce = dt ? dt(ut) : ut;
function ft(e, t = "", n = "Missing document") {
  const a = ((e == null ? void 0 : e.contents) ?? []).map((r) => ({ id: String(r.id), name: String(r.name ?? r.id) }));
  return t && !a.some((r) => r.id === t) && a.push({ id: t, name: `${n} (${t})` }), a;
}
function we(e) {
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
    status: String(t.get("status") ?? d.AVAILABLE),
    image: String(t.get("image") ?? ""),
    published: t.get("published") === "on",
    claimedBy: String(t.get("claimedBy") ?? ""),
    linkedJournalId: String(t.get("linkedJournalId") ?? ""),
    sceneId: String(t.get("sceneId") ?? "")
  };
}
var R, Ut, Ht;
const I = class I extends Ce {
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
    const a = this.bountyId ? H(this.bountyId) : O({});
    return {
      bounty: {
        ...a,
        tagsText: a.tags.join(", ")
      },
      statuses: Object.values(d),
      threatLevels: X,
      journals: ft(game.journal, a.linkedJournalId, "Missing journal"),
      scenes: ft(game.scenes, a.sceneId, "Missing scene"),
      canEdit: ((r = game.user) == null ? void 0 : r.isGM) === !0
    };
  }
  _onRender(n, a) {
    var i, s;
    (i = super._onRender) == null || i.call(this, n, a), (s = this.element.querySelector("[name='title']")) == null || s.focus();
  }
};
R = new WeakSet(), Ut = async function(n, a, r) {
  var s, o, c;
  if (n.preventDefault(), !((s = game.user) != null && s.isGM)) {
    (c = (o = ui.notifications) == null ? void 0 : o.warn) == null || c.call(o, "Only a GM can edit bounties.");
    return;
  }
  const i = await at(we(a));
  i && await Le(i);
}, Ht = function(n) {
  n.preventDefault();
  const a = this.element.querySelector("[name='image']");
  a && new FilePicker({
    type: "image",
    current: a.value,
    callback: (r) => {
      a.value = r, a.dispatchEvent(new Event("change", { bubbles: !0 }));
    }
  }).browse();
}, $(I, R), C(I, "DEFAULT_OPTIONS", {
  id: "bounty-editor-app",
  tag: "form",
  form: {
    handler: h(I, R, Ut),
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
    browseImage: h(I, R, Ht)
  }
}), C(I, "PARTS", {
  editor: {
    template: `${w}/bounty-editor.hbs`
  }
});
let j = I;
var bt, At;
const gt = ((At = (bt = foundry.applications) == null ? void 0 : bt.api) == null ? void 0 : At.ApplicationV2) ?? Application;
var Ot, Tt;
const ht = (Tt = (Ot = foundry.applications) == null ? void 0 : Ot.api) == null ? void 0 : Tt.HandlebarsApplicationMixin, Se = ht ? ht(gt) : gt;
let B = null;
function A(e) {
  var t, n;
  return ((n = (t = e.target) == null ? void 0 : t.closest("[data-bounty-id]")) == null ? void 0 : n.getAttribute("data-bounty-id")) ?? "";
}
function x(e, t, n) {
  var r, i;
  const a = (i = (r = game.i18n) == null ? void 0 : r.format) == null ? void 0 : i.call(r, e, t);
  return a && a !== e ? a : n;
}
var b, Mt, U, Yt, l, Ft, Pt, $t, xt, qt, Vt, jt, kt, Gt, _t, zt, Jt, Wt, Kt, Zt, Qt, Xt, te;
const m = class m extends Se {
  constructor(n = {}) {
    super(n);
    $(this, b);
    C(this, "filters");
    C(this, "expanded");
    C(this, "focusBountyId");
    this.filters = {
      status: "",
      threatLevel: "",
      faction: "",
      tag: "",
      search: ""
    }, this.expanded = /* @__PURE__ */ new Set(), this.focusBountyId = null;
  }
  async _prepareContext(n) {
    var L;
    const a = ((L = game.user) == null ? void 0 : L.isGM) === !0, r = V(), i = !a && !r, s = S({ includeHidden: a }).map(ct).map((T) => ({ ...T, expanded: this.expanded.has(T.id) })), o = { ...this.filters, search: "" }, c = i ? [] : E(s, o), f = i ? 0 : E(s, this.filters).length, g = s.filter((T) => [d.AVAILABLE, d.CLAIMED].includes(T.status)).length, y = Object.values(this.filters).some((T) => T.trim().length > 0), D = String(g).padStart(2, "0");
    return {
      isGM: a,
      boardVisibleToPlayers: r,
      boardHiddenForPlayers: i,
      filters: this.filters,
      options: Ae(),
      bounties: c,
      totalCount: s.length,
      visibleCount: f,
      activeCount: g,
      contractSummary: y ? x("BOUNTYBOARD.Header.ShowingContracts", { visible: f, total: s.length }, `Showing ${f} of ${s.length} contracts`) : x("BOUNTYBOARD.Header.ActiveContracts", { count: D }, `${D} active contracts`)
    };
  }
  _onRender(n, a) {
    var i, s;
    (i = super._onRender) == null || i.call(this, n, a);
    const r = this.element;
    if ((s = r.querySelector(".bb-filters")) == null || s.addEventListener("submit", (o) => {
      o.preventDefault(), o.stopPropagation();
    }), r.querySelectorAll("[data-filter]").forEach((o) => {
      o.dataset.filter === "search" ? o.addEventListener("input", () => {
        this.filters.search = o.value, h(this, b, U).call(this);
      }) : o.addEventListener("change", () => h(this, b, Mt).call(this, o, { immediate: !0 }));
    }), h(this, b, U).call(this), this._bindBountyToggles(r), this.focusBountyId) {
      const o = this.focusBountyId;
      this.focusBountyId = null, requestAnimationFrame(() => {
        const c = this._findBountyCard(o);
        c && (c.tabIndex = -1, c.scrollIntoView({ block: "center", behavior: "smooth" }), c.focus({ preventScroll: !0 }));
      });
    }
  }
  _bindBountyToggles(n) {
    n.querySelectorAll("[data-bounty-toggle]").forEach((a) => {
      a.addEventListener("click", () => {
        const r = a.dataset.bountyToggle ?? "", i = !this.expanded.has(r);
        i ? this.expanded.add(r) : this.expanded.delete(r);
        const s = a.closest("[data-bounty-id]");
        s == null || s.classList.toggle("is-expanded", i), s == null || s.classList.toggle("is-collapsed", !i);
        const o = s == null ? void 0 : s.querySelector(".bb-card-details");
        o && (o.hidden = !i), a.setAttribute("aria-expanded", String(i)), a.title = i ? a.dataset.expandedTitle ?? "" : a.dataset.collapsedTitle ?? "";
        const c = a.querySelector(".bb-expand-label");
        c && (c.textContent = i ? a.dataset.expandedLabel ?? "" : a.dataset.collapsedLabel ?? "");
        const f = a.querySelector(".bb-visually-hidden");
        f && (f.textContent = a.title);
        const g = a.querySelector("i");
        g == null || g.classList.toggle("fa-chevron-up", i), g == null || g.classList.toggle("fa-chevron-down", !i);
      });
    });
  }
  _findBountyCard(n) {
    var r, i;
    return Array.from(((i = (r = this.element) == null ? void 0 : r.querySelectorAll) == null ? void 0 : i.call(r, "[data-bounty-id]")) ?? []).find((s) => s.dataset.bountyId === n) ?? null;
  }
  _syncCountData() {
    var i, s, o;
    const n = S({ includeHidden: ((i = game.user) == null ? void 0 : i.isGM) === !0 }), a = n.filter((c) => [d.AVAILABLE, d.CLAIMED].includes(c.status)).length, r = (o = (s = this.element) == null ? void 0 : s.querySelector) == null ? void 0 : o.call(s, ".bb-subtitle");
    r && (r.dataset.totalCount = String(n.length), r.dataset.activeCount = String(a));
  }
  async _refreshBountyCard(n, a) {
    var c;
    const r = this._findBountyCard(n);
    if (!r || !a) return;
    const i = {
      ...ct(a),
      expanded: this.expanded.has(n)
    }, s = { ...this.filters, search: "" };
    if (!(E([i], s).length > 0))
      r.remove();
    else {
      const f = await renderTemplate(`${w}/bounty-card.hbs`, {
        bounty: i,
        isGM: ((c = game.user) == null ? void 0 : c.isGM) === !0
      }), g = document.createElement("template");
      g.innerHTML = String(f).trim();
      const y = g.content.firstElementChild;
      y && (r.replaceWith(y), this._bindBountyToggles(y));
    }
    this._syncCountData(), h(this, b, U).call(this);
  }
  _removeBountyCard(n) {
    var a;
    (a = this._findBountyCard(n)) == null || a.remove(), this.expanded.delete(n), this._syncCountData(), h(this, b, U).call(this);
  }
  focusBounty(n) {
    this.filters = { status: "", threatLevel: "", faction: "", tag: "", search: "" }, this.expanded.add(n), this.focusBountyId = n, this.render({ force: !0 });
  }
  async close(n = {}) {
    return B === this && (B = null), super.close(n);
  }
};
b = new WeakSet(), Mt = function(n, { immediate: a = !1 } = {}) {
  const r = n.dataset.filter;
  r && (this.filters[r] = n.value, this.render({ force: !0 }));
}, U = function() {
  var f, g, y, D, L, T, Y, rt, F, it;
  const n = this.filters.search.trim().toLowerCase(), a = Array.from(((g = (f = this.element) == null ? void 0 : f.querySelectorAll) == null ? void 0 : g.call(f, "[data-bounty-id]")) ?? []);
  let r = 0;
  for (const P of a) {
    const st = !n || String(P.dataset.searchText ?? "").includes(n);
    P.hidden = !st, st && (r += 1);
  }
  const i = (D = (y = this.element) == null ? void 0 : y.querySelector) == null ? void 0 : D.call(y, ".bb-subtitle"), s = Number(((L = i == null ? void 0 : i.dataset) == null ? void 0 : L.totalCount) ?? a.length), o = Number(((T = i == null ? void 0 : i.dataset) == null ? void 0 : T.activeCount) ?? a.length);
  i && (i.textContent = h(this, b, Yt).call(this) ? x("BOUNTYBOARD.Header.ShowingContracts", { visible: r, total: s }, `Showing ${r} of ${s} contracts`) : x("BOUNTYBOARD.Header.ActiveContracts", { count: String(o).padStart(2, "0") }, `${String(o).padStart(2, "0")} active contracts`)), (rt = (Y = this.element) == null ? void 0 : Y.querySelectorAll) == null || rt.call(Y, "[data-action='showFiltered'], [data-action='hideFiltered']").forEach((P) => {
    P.disabled = r === 0;
  });
  const c = (it = (F = this.element) == null ? void 0 : F.querySelector) == null ? void 0 : it.call(F, ".bb-search-empty");
  c && (c.hidden = r > 0);
}, Yt = function() {
  return Object.values(this.filters).some((n) => n.trim().length > 0);
}, l = new WeakSet(), Ft = function() {
  new j().render({ force: !0 });
}, Pt = function(n) {
  const a = A(n);
  a && new j({ bountyId: a }).render({ force: !0 });
}, $t = async function(n) {
  const a = A(n);
  a && await vt(a) && this._removeBountyCard(a);
}, xt = async function(n) {
  const a = A(n);
  if (a) {
    const r = await J(a, !0);
    r && await this._refreshBountyCard(a, r);
  }
}, qt = async function(n) {
  const a = A(n);
  if (a) {
    const r = await J(a, !1);
    r && await this._refreshBountyCard(a, r);
  }
}, Vt = async function(n) {
  const a = A(n);
  if (a) {
    const r = await Rt(a);
    r && await this._refreshBountyCard(a, r);
  }
}, jt = async function(n) {
  const a = A(n);
  if (a) {
    const r = await lt(a, !1);
    r && await this._refreshBountyCard(a, r);
  }
}, kt = async function(n) {
  const a = A(n);
  if (a) {
    const r = await lt(a, !0);
    r && await this._refreshBountyCard(a, r);
  }
}, Gt = async function(n) {
  const a = A(n);
  if (a) {
    const r = await M(a, { status: d.HIDDEN, published: !1 });
    r && await this._refreshBountyCard(a, r);
  }
}, _t = async function(n) {
  var i, s, o;
  const a = A(n), r = ((o = (s = (i = n.target) == null ? void 0 : i.closest("[data-bounty-id]")) == null ? void 0 : s.querySelector("[data-claimed-by]")) == null ? void 0 : o.value) ?? "";
  if (a) {
    const c = await Et(a, r);
    c && await this._refreshBountyCard(a, c);
  }
}, zt = async function(n) {
  const a = A(n);
  a && await Oe(a);
}, Jt = function(n) {
  var s, o, c, f, g, y;
  const a = (o = (s = n.target) == null ? void 0 : s.closest("[data-image-src]")) == null ? void 0 : o.getAttribute("data-image-src");
  if (!a) return;
  const r = ((y = (g = (f = (c = n.target) == null ? void 0 : c.closest("[data-bounty-id]")) == null ? void 0 : f.querySelector(".bb-card-title")) == null ? void 0 : g.textContent) == null ? void 0 : y.trim()) || "Bounty Image";
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
}, Wt = function(n) {
  var r, i, s, o, c;
  const a = (i = (r = n.target) == null ? void 0 : r.closest("[data-open-journal]")) == null ? void 0 : i.getAttribute("data-open-journal");
  (c = (o = (s = game.journal) == null ? void 0 : s.get(a)) == null ? void 0 : o.sheet) == null || c.render(!0);
}, Kt = async function() {
  const n = this.filters.tag;
  await be(n) && (this.filters.tag = "", this.render({ force: !0 }));
}, Zt = async function() {
  const n = E(S({ includeHidden: !0 }), this.filters);
  await W(n.map((a) => a.id), !0) && this.render({ force: !0 });
}, Qt = async function() {
  const n = E(S({ includeHidden: !0 }), this.filters);
  await W(n.map((a) => a.id), !1) && this.render({ force: !0 });
}, Xt = async function() {
  await Nt(!V()) && this.render({ force: !0 });
}, te = function() {
  this.filters = { status: "", threatLevel: "", faction: "", tag: "", search: "" }, this.render({ force: !0 });
}, $(m, l), C(m, "DEFAULT_OPTIONS", {
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
    createBounty: h(m, l, Ft),
    editBounty: h(m, l, Pt),
    deleteBounty: h(m, l, $t),
    publishBounty: h(m, l, xt),
    unpublishBounty: h(m, l, qt),
    archiveBounty: h(m, l, Vt),
    completeBounty: h(m, l, jt),
    failBounty: h(m, l, kt),
    hideBounty: h(m, l, Gt),
    claimBounty: h(m, l, _t),
    requestContract: h(m, l, zt),
    openImage: h(m, l, Jt),
    openJournal: h(m, l, Wt),
    removeTag: h(m, l, Kt),
    showFiltered: h(m, l, Zt),
    hideFiltered: h(m, l, Qt),
    toggleBoardVisibility: h(m, l, Xt),
    clearFilters: h(m, l, te)
  }
}), C(m, "PARTS", {
  board: {
    template: `${w}/bounty-board.hbs`
  }
});
let k = m;
function ee() {
  return B || (B = new k()), B.render({ force: !0 }), B;
}
function De(e) {
  var r, i;
  const t = String(e || ""), n = ((r = game.user) == null ? void 0 : r.isGM) === !0;
  return !t || !n && !V() || !S({ includeHidden: n }).some((s) => s.id === t) ? !1 : (B || (B = new k()), B.focusBounty(t), (i = B.bringToFront) == null || i.call(B), !0);
}
async function Le(e = null) {
  if (B) {
    if (e != null && e.id && B._findBountyCard(e.id)) {
      await B._refreshBountyCard(e.id, e);
      return;
    }
    B.render({ force: !0 });
  }
}
const Ie = {
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
function ne() {
  var t;
  const e = (t = game.i18n) == null ? void 0 : t.translations;
  if (e)
    for (const [n, a] of Object.entries(Ie)) {
      const r = foundry.utils.getProperty(e, n);
      (r === void 0 || r === n) && foundry.utils.setProperty(e, n, a);
    }
}
function ae() {
  const e = {
    open: ee,
    getAllBounties: S,
    getBounty: H,
    getBountiesForScene: ye,
    openBounty: De,
    upsertBounty: at,
    deleteBounty: vt,
    publishBounty: J,
    setBountiesPublished: W,
    setBoardVisibleToPlayers: Nt,
    archiveBounty: Rt,
    claimBounty: Et
    // Future extension hooks:
    // Patreon/premium gating can wrap open() or selected GM actions here.
    // Random bounty generator can call upsertBounty() with generated data.
    // Faction reputation systems can listen for completed/failed state changes.
    // Galaxy Map consumes the permission-filtered Scene query above when installed.
    // CyberCall contact integration can add claimant/contact actions.
    // Security camera and crime scene modules can attach evidence links via notes or future document ids.
  }, t = game.modules.get(p);
  t && (t.api = e), game.scifiSuite ?? (game.scifiSuite = {}), game.scifiSuite.bountyBoard = e;
}
Hooks.once("init", async () => {
  ne(), Te(), ae(), Handlebars.registerHelper("bbEq", (e, t) => e === t), Handlebars.registerHelper("bbIncludes", (e, t) => Array.isArray(e) && e.includes(t)), Handlebars.registerHelper("bbStatusClass", (e) => `bb-status--${String(e ?? "available").toLowerCase()}`), await loadTemplates([
    `${w}/bounty-card.hbs`,
    `${w}/bounty-board.hbs`,
    `${w}/bounty-editor.hbs`,
    `${w}/bounty-chat-card.hbs`
  ]);
});
Hooks.once("ready", () => {
  var e, t, n;
  ne(), ae(), (n = (t = (e = game.modules.get("holosuite-core")) == null ? void 0 : e.api) == null ? void 0 : t.registerApp) == null || n.call(t, {
    id: p,
    title: oe,
    icon: "fa-solid fa-crosshairs",
    premium: !1,
    description: "Open the sci-fi contract terminal.",
    open: () => ee()
  }), console.log(`${p} | Ready. API available at game.scifiSuite.bountyBoard.`);
});
