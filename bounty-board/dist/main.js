var ae = Object.defineProperty;
var it = (e) => {
  throw TypeError(e);
};
var ne = (e, t, a) => t in e ? ae(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var C = (e, t, a) => ne(e, typeof t != "symbol" ? t + "" : t, a), re = (e, t, a) => t.has(e) || it("Cannot " + a);
var $ = (e, t, a) => t.has(e) ? it("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, a);
var h = (e, t, a) => (re(e, t, "access private method"), a);
const p = "bounty-board", ie = "Bounty Board", W = "bounties", Ot = "postPublishChat", Tt = "postResultChat", Ct = "publicDocumentLinks", K = "removedTags", Z = "boardVisibleToPlayers", w = `modules/${p}/templates`, d = Object.freeze({
  AVAILABLE: "available",
  CLAIMED: "claimed",
  COMPLETED: "completed",
  FAILED: "failed",
  HIDDEN: "hidden",
  ARCHIVED: "archived"
}), G = Object.freeze({
  [d.AVAILABLE]: "Available",
  [d.CLAIMED]: "Claimed",
  [d.COMPLETED]: "Completed",
  [d.FAILED]: "Failed",
  [d.HIDDEN]: "Hidden",
  [d.ARCHIVED]: "Archived"
}), Q = Object.freeze(["Unknown", "Low", "Moderate", "High", "Severe", "Extreme"]), se = Object.freeze([
  "Smuggling",
  "Assassination",
  "Rescue",
  "Investigation",
  "Monster Hunt",
  "Recovery",
  "Escort",
  "Sabotage"
]), oe = Object.freeze({
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
  linkedJournalId: ""
});
function ce(e = {}) {
  const t = Number(e.rewardAmount ?? 0), a = e.rewardCurrency || "credits";
  return {
    ...e,
    title: String(e.title ?? "Untitled Bounty"),
    targetName: String(e.targetName ?? ""),
    threatLevel: String(e.threatLevel ?? "Moderate"),
    faction: String(e.faction ?? ""),
    status: String(e.status ?? "available"),
    rewardLabel: `${Number.isFinite(t) ? t.toLocaleString() : "0"} ${a}`,
    statusLabel: G[e.status] ?? "Available"
  };
}
async function X(e, t = "published") {
  const a = ce(e), n = await renderTemplate(`${w}/bounty-chat-card.hbs`, {
    bounty: a,
    mode: t,
    isResult: t === "result",
    isPublished: t === "published"
  });
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: "Bounty Board" }),
    content: n,
    flags: {
      [p]: {
        bountyId: a.id,
        mode: t
      }
    }
  });
}
function le(e) {
  return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? null));
}
function j() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function N(e = "change bounty data") {
  var t, a, n;
  return (t = game.user) != null && t.isGM ? !0 : ((n = (a = ui.notifications) == null ? void 0 : a.warn) == null || n.call(a, `Only a GM can ${e}.`), !1);
}
function u(e, t = "") {
  return String(e ?? t).trim();
}
function wt(e) {
  return Array.isArray(e) ? e.map((t) => u(t)).filter(Boolean) : u(e).split(",").map((t) => t.trim()).filter(Boolean);
}
function ue(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((a) => {
    const n = u(a).toLowerCase();
    return !n || t.has(n) ? !1 : (t.add(n), !0);
  });
}
function tt() {
  try {
    return wt(game.settings.get(p, K));
  } catch {
    return [];
  }
}
function q(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function de(e, t = d.AVAILABLE) {
  return Object.values(d).includes(e) ? e : t;
}
function ge(e) {
  const t = u(e, "Moderate");
  return Q.includes(t) ? t : "Moderate";
}
function fe(e) {
  const t = Number(e);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function St(e) {
  return G[e] ?? G[d.AVAILABLE];
}
function he(e) {
  const t = Number((e == null ? void 0 : e.rewardAmount) ?? 0), a = (e == null ? void 0 : e.rewardCurrency) || "credits";
  return `${t.toLocaleString()} ${a}`;
}
function me(e) {
  let t = 0;
  for (const a of e) t = (t * 31 + a.charCodeAt(0)) % 1e4;
  return `BH-${String(t).padStart(4, "0")}`;
}
function O(e = {}) {
  const t = j(), a = u(e.id) || `bounty-${foundry.utils.randomID(12)}`, n = u(e.contractId) || me(a), r = u(e.createdAt) || t, i = de(e.status);
  return {
    ...le(oe),
    id: a,
    contractId: n,
    title: u(e.title, "Untitled Bounty"),
    targetName: u(e.targetName),
    description: u(e.description),
    longDescription: u(e.longDescription),
    rewardAmount: fe(e.rewardAmount),
    rewardCurrency: u(e.rewardCurrency, "credits") || "credits",
    threatLevel: ge(e.threatLevel),
    faction: u(e.faction),
    location: u(e.location),
    tags: wt(e.tags),
    status: i,
    image: u(e.image),
    createdAt: r,
    updatedAt: u(e.updatedAt) || r,
    published: e.published === !0,
    claimedBy: u(e.claimedBy),
    notesGM: u(e.notesGM),
    notesPublic: u(e.notesPublic),
    linkedJournalId: u(e.linkedJournalId)
  };
}
function st(e) {
  var s, o, c;
  const t = O(e), a = t.linkedJournalId ? ((s = game.journal) == null ? void 0 : s.get(t.linkedJournalId)) ?? null : null, n = game.settings.get(p, Ct) === !0, r = game.user, i = !!(a && (r != null && r.isGM || n || (o = a.testUserPermission) != null && o.call(a, r, "OBSERVER")));
  return {
    ...t,
    displayId: t.contractId,
    statusLabel: St(t.status),
    rewardLabel: he(t),
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
    isVisibleToPlayers: Dt(t),
    linkedJournalName: (a == null ? void 0 : a.name) ?? "",
    canSeeJournal: i,
    canEdit: ((c = game.user) == null ? void 0 : c.isGM) === !0
  };
}
function Dt(e) {
  const t = O(e);
  return t.published && ![d.HIDDEN, d.ARCHIVED].includes(t.status);
}
function ot() {
  return game.settings.get(p, Z) !== !1;
}
async function Lt(e) {
  return N(e ? "show the bounty board" : "hide the bounty board") ? (await game.settings.set(p, Z, e === !0), !0) : !1;
}
function I() {
  const e = game.settings.get(p, W);
  return e ? Array.isArray(e) ? Object.fromEntries(e.map(O).map((t) => [t.id, t])) : typeof e == "object" ? Object.fromEntries(Object.values(e).map(O).map((t) => [t.id, t])) : (console.warn(`${p} | Ignoring invalid bounty setting payload.`, e), {}) : {};
}
async function k(e) {
  return N("save bounties") ? (await game.settings.set(p, W, e ?? {}), e) : I();
}
function v({ includeHidden: e = ((t) => (t = game.user) == null ? void 0 : t.isGM)() === !0 } = {}) {
  const a = Object.values(I()).map(O);
  return (e ? a : a.filter(Dt)).sort((r, i) => String(i.updatedAt).localeCompare(String(r.updatedAt)));
}
function H(e) {
  const t = I()[e];
  return t ? O(t) : null;
}
function pe(e) {
  const t = [];
  return u(e.title) || t.push("Title is required."), u(e.targetName) || t.push("Target name is required."), u(e.rewardCurrency) || t.push("Reward currency is required."), u(e.threatLevel) || t.push("Threat level is required."), t;
}
async function et(e) {
  var o, c;
  if (!N("create or edit bounties")) return null;
  const t = e.id ? H(e.id) : null, a = j(), n = O({
    ...t,
    ...e,
    id: (t == null ? void 0 : t.id) || e.id || `bounty-${foundry.utils.randomID(12)}`,
    createdAt: (t == null ? void 0 : t.createdAt) || a,
    updatedAt: a
  }), r = new Set(tt().map((g) => g.toLowerCase()));
  n.tags = n.tags.filter((g) => !r.has(g.toLowerCase()));
  const i = pe(n);
  if (i.length)
    return (c = (o = ui.notifications) == null ? void 0 : o.error) == null || c.call(o, i.join(" ")), null;
  const s = I();
  return s[n.id] = n, await k(s), n;
}
async function Nt(e) {
  if (!N("delete bounties") || !await Dialog.confirm({
    title: "Delete Bounty",
    content: "<p>Permanently delete this bounty from world data?</p>"
  })) return !1;
  const a = I();
  return delete a[e], await k(a), !0;
}
async function Y(e, t = {}, { chat: a = !1 } = {}) {
  var i, s;
  if (!N("update bounty status")) return null;
  const n = H(e);
  if (!n)
    return (s = (i = ui.notifications) == null ? void 0 : i.warn) == null || s.call(i, "Bounty not found."), null;
  const r = await et({ ...n, ...t });
  return r ? (a && await X(r, t.status === d.AVAILABLE ? "published" : "result"), r) : null;
}
async function _(e, t = !0) {
  const a = await Y(e, {
    published: t,
    status: t ? d.AVAILABLE : d.HIDDEN
  });
  return a && t && game.settings.get(p, Ot) && await X(a, "published"), a;
}
async function ct(e, t = !1) {
  const a = t ? d.FAILED : d.COMPLETED, n = await Y(e, { status: a });
  return n && game.settings.get(p, Tt) && await X(n, "result"), n;
}
async function It(e) {
  return Y(e, { status: d.ARCHIVED, published: !1 });
}
async function z(e, t) {
  var s, o;
  if (!N(t ? "publish bounties" : "hide bounties")) return 0;
  const a = [...new Set(e)].filter(Boolean);
  if (!a.length) return 0;
  const n = I();
  let r = 0;
  const i = j();
  for (const c of a) {
    const g = n[c];
    if (!g) continue;
    const f = O(g);
    t && f.status === d.ARCHIVED || (f.published = t, t && f.status === d.HIDDEN && (f.status = d.AVAILABLE), t || (f.status = d.HIDDEN), f.updatedAt = i, n[c] = f, r += 1);
  }
  return await k(n), (o = (s = ui.notifications) == null ? void 0 : s.info) == null || o.call(s, `${r} bount${r === 1 ? "y" : "ies"} ${t ? "shown to" : "hidden from"} players.`), r;
}
async function vt(e, t) {
  return Y(e, { status: d.CLAIMED, claimedBy: u(t) });
}
async function ye(e) {
  var o, c, g, f;
  if (!N("remove bounty tags")) return !1;
  const t = u(e);
  if (!t)
    return (c = (o = ui.notifications) == null ? void 0 : o.warn) == null || c.call(o, "Select a tag to remove."), !1;
  if (!await Dialog.confirm({
    title: "Remove Tag",
    content: `<p>Remove <strong>${q(t)}</strong> from the dropdown and all bounties?</p>`
  })) return !1;
  const n = t.toLowerCase(), r = I();
  let i = 0;
  for (const y of Object.values(r)) {
    const S = y.tags.length;
    y.tags = y.tags.filter((D) => D.toLowerCase() !== n), y.tags.length !== S && (y.updatedAt = j(), i += 1);
  }
  const s = ue([...tt(), t]);
  return await game.settings.set(p, K, s), await k(r), (f = (g = ui.notifications) == null ? void 0 : g.info) == null || f.call(g, `Removed "${t}" from ${i} bount${i === 1 ? "y" : "ies"}.`), !0;
}
function Be() {
  const e = v({ includeHidden: !0 }), t = (r) => [...new Set(r.map((i) => u(i)).filter(Boolean))].sort((i, s) => i.localeCompare(s)), a = new Set(tt().map((r) => r.toLowerCase())), n = t([...se, ...e.flatMap((r) => r.tags)]).filter((r) => !a.has(r.toLowerCase()));
  return {
    statuses: Object.values(d).map((r) => ({ value: r, label: St(r) })),
    threatLevels: Q,
    factions: t(e.map((r) => r.faction)),
    tags: n
  };
}
function E(e, t = {}) {
  const a = u(t.status), n = u(t.threatLevel), r = u(t.faction).toLowerCase(), i = u(t.tag).toLowerCase(), s = u(t.search).toLowerCase();
  return e.filter((o) => {
    const c = O(o);
    return !(a && c.status !== a || n && c.threatLevel !== n || r && c.faction.toLowerCase() !== r || i && !c.tags.some((g) => g.toLowerCase() === i) || s && ![
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
async function be(e) {
  var r, i, s;
  const t = H(e);
  if (!t) return;
  const a = ChatMessage.getSpeaker({ user: game.user }), n = `
    <div class="bb-chat-card bb-chat-card--request">
      <h3>Contract Request</h3>
      <p><strong>${q(((r = game.user) == null ? void 0 : r.name) ?? "A player")}</strong> requests contract authorization.</p>
      <p><strong>${q(t.title)}</strong> - ${q(t.targetName)}</p>
    </div>
  `;
  await ChatMessage.create({
    speaker: a,
    whisper: ChatMessage.getWhisperRecipients("GM").map((o) => o.id),
    content: n
  }), (s = (i = ui.notifications) == null ? void 0 : i.info) == null || s.call(i, "Contract request sent to the GM.");
}
function Ae() {
  game.settings.register(p, W, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(p, Ot, {
    name: "Post Chat Card When Publishing",
    hint: "Automatically post a contract card when the GM publishes a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(p, Tt, {
    name: "Post Chat Card When Resolved",
    hint: "Automatically post a result card when the GM completes or fails a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(p, Ct, {
    name: "Show Linked Journals To Players",
    hint: "Allow player-visible bounty cards to show linked journal buttons when the bounty is published.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(p, Z, {
    name: "Show Bounty Board To Players",
    hint: "Allow players to open the bounty board and see currently published contracts.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(p, K, {
    scope: "world",
    config: !1,
    type: Array,
    default: []
  });
}
var ft, ht;
const lt = ((ht = (ft = foundry.applications) == null ? void 0 : ft.api) == null ? void 0 : ht.ApplicationV2) ?? Application;
var mt, pt;
const ut = (pt = (mt = foundry.applications) == null ? void 0 : mt.api) == null ? void 0 : pt.HandlebarsApplicationMixin, Oe = ut ? ut(lt) : lt;
function Te(e) {
  return ((e == null ? void 0 : e.contents) ?? []).map((t) => ({ id: t.id, name: t.name }));
}
function Ce(e) {
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
    linkedJournalId: String(t.get("linkedJournalId") ?? "")
  };
}
var R, Rt, Et;
const L = class L extends Oe {
  constructor({ bountyId: a = null } = {}) {
    super();
    C(this, "bountyId");
    this.bountyId = a;
  }
  get title() {
    return this.bountyId ? "Edit Bounty" : "Create Bounty";
  }
  async _prepareContext(a) {
    var r;
    const n = this.bountyId ? H(this.bountyId) : O({});
    return {
      bounty: {
        ...n,
        tagsText: n.tags.join(", ")
      },
      statuses: Object.values(d),
      threatLevels: Q,
      journals: Te(game.journal),
      canEdit: ((r = game.user) == null ? void 0 : r.isGM) === !0
    };
  }
  _onRender(a, n) {
    var i, s;
    (i = super._onRender) == null || i.call(this, a, n), (s = this.element.querySelector("[name='title']")) == null || s.focus();
  }
};
R = new WeakSet(), Rt = async function(a, n, r) {
  var s, o, c;
  if (a.preventDefault(), !((s = game.user) != null && s.isGM)) {
    (c = (o = ui.notifications) == null ? void 0 : o.warn) == null || c.call(o, "Only a GM can edit bounties.");
    return;
  }
  const i = await et(Ce(n));
  i && await Se(i);
}, Et = function(a) {
  a.preventDefault();
  const n = this.element.querySelector("[name='image']");
  n && new FilePicker({
    type: "image",
    current: n.value,
    callback: (r) => {
      n.value = r, n.dispatchEvent(new Event("change", { bubbles: !0 }));
    }
  }).browse();
}, $(L, R), C(L, "DEFAULT_OPTIONS", {
  id: "bounty-editor-app",
  tag: "form",
  form: {
    handler: h(L, R, Rt),
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
    browseImage: h(L, R, Et)
  }
}), C(L, "PARTS", {
  editor: {
    template: `${w}/bounty-editor.hbs`
  }
});
let V = L;
var yt, Bt;
const dt = ((Bt = (yt = foundry.applications) == null ? void 0 : yt.api) == null ? void 0 : Bt.ApplicationV2) ?? Application;
var bt, At;
const gt = (At = (bt = foundry.applications) == null ? void 0 : bt.api) == null ? void 0 : At.HandlebarsApplicationMixin, we = gt ? gt(dt) : dt;
let A = null;
function b(e) {
  var t, a;
  return ((a = (t = e.target) == null ? void 0 : t.closest("[data-bounty-id]")) == null ? void 0 : a.getAttribute("data-bounty-id")) ?? "";
}
function x(e, t, a) {
  var r, i;
  const n = (i = (r = game.i18n) == null ? void 0 : r.format) == null ? void 0 : i.call(r, e, t);
  return n && n !== e ? n : a;
}
var B, Ut, U, Ht, l, Yt, Mt, Ft, Pt, $t, xt, qt, Vt, jt, kt, Gt, _t, zt, Jt, Wt, Kt, Zt, Qt;
const m = class m extends we {
  constructor(a = {}) {
    super(a);
    $(this, B);
    C(this, "filters");
    C(this, "expanded");
    this.filters = {
      status: "",
      threatLevel: "",
      faction: "",
      tag: "",
      search: ""
    }, this.expanded = /* @__PURE__ */ new Set();
  }
  async _prepareContext(a) {
    var D;
    const n = ((D = game.user) == null ? void 0 : D.isGM) === !0, r = ot(), i = !n && !r, s = v({ includeHidden: n }).map(st).map((T) => ({ ...T, expanded: this.expanded.has(T.id) })), o = { ...this.filters, search: "" }, c = i ? [] : E(s, o), g = i ? 0 : E(s, this.filters).length, f = s.filter((T) => [d.AVAILABLE, d.CLAIMED].includes(T.status)).length, y = Object.values(this.filters).some((T) => T.trim().length > 0), S = String(f).padStart(2, "0");
    return {
      isGM: n,
      boardVisibleToPlayers: r,
      boardHiddenForPlayers: i,
      filters: this.filters,
      options: Be(),
      bounties: c,
      totalCount: s.length,
      visibleCount: g,
      activeCount: f,
      contractSummary: y ? x("BOUNTYBOARD.Header.ShowingContracts", { visible: g, total: s.length }, `Showing ${g} of ${s.length} contracts`) : x("BOUNTYBOARD.Header.ActiveContracts", { count: S }, `${S} active contracts`)
    };
  }
  _onRender(a, n) {
    var i, s;
    (i = super._onRender) == null || i.call(this, a, n);
    const r = this.element;
    (s = r.querySelector(".bb-filters")) == null || s.addEventListener("submit", (o) => {
      o.preventDefault(), o.stopPropagation();
    }), r.querySelectorAll("[data-filter]").forEach((o) => {
      o.dataset.filter === "search" ? o.addEventListener("input", () => {
        this.filters.search = o.value, h(this, B, U).call(this);
      }) : o.addEventListener("change", () => h(this, B, Ut).call(this, o, { immediate: !0 }));
    }), h(this, B, U).call(this), this._bindBountyToggles(r);
  }
  _bindBountyToggles(a) {
    a.querySelectorAll("[data-bounty-toggle]").forEach((n) => {
      n.addEventListener("click", () => {
        const r = n.dataset.bountyToggle ?? "", i = !this.expanded.has(r);
        i ? this.expanded.add(r) : this.expanded.delete(r);
        const s = n.closest("[data-bounty-id]");
        s == null || s.classList.toggle("is-expanded", i), s == null || s.classList.toggle("is-collapsed", !i);
        const o = s == null ? void 0 : s.querySelector(".bb-card-details");
        o && (o.hidden = !i), n.setAttribute("aria-expanded", String(i)), n.title = i ? n.dataset.expandedTitle ?? "" : n.dataset.collapsedTitle ?? "";
        const c = n.querySelector(".bb-expand-label");
        c && (c.textContent = i ? n.dataset.expandedLabel ?? "" : n.dataset.collapsedLabel ?? "");
        const g = n.querySelector(".bb-visually-hidden");
        g && (g.textContent = n.title);
        const f = n.querySelector("i");
        f == null || f.classList.toggle("fa-chevron-up", i), f == null || f.classList.toggle("fa-chevron-down", !i);
      });
    });
  }
  _findBountyCard(a) {
    var r, i;
    return Array.from(((i = (r = this.element) == null ? void 0 : r.querySelectorAll) == null ? void 0 : i.call(r, "[data-bounty-id]")) ?? []).find((s) => s.dataset.bountyId === a) ?? null;
  }
  _syncCountData() {
    var i, s, o;
    const a = v({ includeHidden: ((i = game.user) == null ? void 0 : i.isGM) === !0 }), n = a.filter((c) => [d.AVAILABLE, d.CLAIMED].includes(c.status)).length, r = (o = (s = this.element) == null ? void 0 : s.querySelector) == null ? void 0 : o.call(s, ".bb-subtitle");
    r && (r.dataset.totalCount = String(a.length), r.dataset.activeCount = String(n));
  }
  async _refreshBountyCard(a, n) {
    var c;
    const r = this._findBountyCard(a);
    if (!r || !n) return;
    const i = {
      ...st(n),
      expanded: this.expanded.has(a)
    }, s = { ...this.filters, search: "" };
    if (!(E([i], s).length > 0))
      r.remove();
    else {
      const g = await renderTemplate(`${w}/bounty-card.hbs`, {
        bounty: i,
        isGM: ((c = game.user) == null ? void 0 : c.isGM) === !0
      }), f = document.createElement("template");
      f.innerHTML = String(g).trim();
      const y = f.content.firstElementChild;
      y && (r.replaceWith(y), this._bindBountyToggles(y));
    }
    this._syncCountData(), h(this, B, U).call(this);
  }
  _removeBountyCard(a) {
    var n;
    (n = this._findBountyCard(a)) == null || n.remove(), this.expanded.delete(a), this._syncCountData(), h(this, B, U).call(this);
  }
  async close(a = {}) {
    return A === this && (A = null), super.close(a);
  }
};
B = new WeakSet(), Ut = function(a, { immediate: n = !1 } = {}) {
  const r = a.dataset.filter;
  r && (this.filters[r] = a.value, this.render({ force: !0 }));
}, U = function() {
  var g, f, y, S, D, T, M, at, F, nt;
  const a = this.filters.search.trim().toLowerCase(), n = Array.from(((f = (g = this.element) == null ? void 0 : g.querySelectorAll) == null ? void 0 : f.call(g, "[data-bounty-id]")) ?? []);
  let r = 0;
  for (const P of n) {
    const rt = !a || String(P.dataset.searchText ?? "").includes(a);
    P.hidden = !rt, rt && (r += 1);
  }
  const i = (S = (y = this.element) == null ? void 0 : y.querySelector) == null ? void 0 : S.call(y, ".bb-subtitle"), s = Number(((D = i == null ? void 0 : i.dataset) == null ? void 0 : D.totalCount) ?? n.length), o = Number(((T = i == null ? void 0 : i.dataset) == null ? void 0 : T.activeCount) ?? n.length);
  i && (i.textContent = h(this, B, Ht).call(this) ? x("BOUNTYBOARD.Header.ShowingContracts", { visible: r, total: s }, `Showing ${r} of ${s} contracts`) : x("BOUNTYBOARD.Header.ActiveContracts", { count: String(o).padStart(2, "0") }, `${String(o).padStart(2, "0")} active contracts`)), (at = (M = this.element) == null ? void 0 : M.querySelectorAll) == null || at.call(M, "[data-action='showFiltered'], [data-action='hideFiltered']").forEach((P) => {
    P.disabled = r === 0;
  });
  const c = (nt = (F = this.element) == null ? void 0 : F.querySelector) == null ? void 0 : nt.call(F, ".bb-search-empty");
  c && (c.hidden = r > 0);
}, Ht = function() {
  return Object.values(this.filters).some((a) => a.trim().length > 0);
}, l = new WeakSet(), Yt = function() {
  new V().render({ force: !0 });
}, Mt = function(a) {
  const n = b(a);
  n && new V({ bountyId: n }).render({ force: !0 });
}, Ft = async function(a) {
  const n = b(a);
  n && await Nt(n) && this._removeBountyCard(n);
}, Pt = async function(a) {
  const n = b(a);
  if (n) {
    const r = await _(n, !0);
    r && await this._refreshBountyCard(n, r);
  }
}, $t = async function(a) {
  const n = b(a);
  if (n) {
    const r = await _(n, !1);
    r && await this._refreshBountyCard(n, r);
  }
}, xt = async function(a) {
  const n = b(a);
  if (n) {
    const r = await It(n);
    r && await this._refreshBountyCard(n, r);
  }
}, qt = async function(a) {
  const n = b(a);
  if (n) {
    const r = await ct(n, !1);
    r && await this._refreshBountyCard(n, r);
  }
}, Vt = async function(a) {
  const n = b(a);
  if (n) {
    const r = await ct(n, !0);
    r && await this._refreshBountyCard(n, r);
  }
}, jt = async function(a) {
  const n = b(a);
  if (n) {
    const r = await Y(n, { status: d.HIDDEN, published: !1 });
    r && await this._refreshBountyCard(n, r);
  }
}, kt = async function(a) {
  var i, s, o;
  const n = b(a), r = ((o = (s = (i = a.target) == null ? void 0 : i.closest("[data-bounty-id]")) == null ? void 0 : s.querySelector("[data-claimed-by]")) == null ? void 0 : o.value) ?? "";
  if (n) {
    const c = await vt(n, r);
    c && await this._refreshBountyCard(n, c);
  }
}, Gt = async function(a) {
  const n = b(a);
  n && await be(n);
}, _t = function(a) {
  var s, o, c, g, f, y;
  const n = (o = (s = a.target) == null ? void 0 : s.closest("[data-image-src]")) == null ? void 0 : o.getAttribute("data-image-src");
  if (!n) return;
  const r = ((y = (f = (g = (c = a.target) == null ? void 0 : c.closest("[data-bounty-id]")) == null ? void 0 : g.querySelector(".bb-card-title")) == null ? void 0 : f.textContent) == null ? void 0 : y.trim()) || "Bounty Image";
  if (globalThis.ImagePopout) {
    new ImagePopout(n, { title: r }).render(!0);
    return;
  }
  const i = String(n).replaceAll('"', "&quot;");
  new Dialog({
    title: r,
    content: `<img class="bb-image-dialog" src="${i}" alt="" />`,
    buttons: {
      close: { label: "Close" }
    }
  }, { classes: ["bounty-board-window"], width: 720 }).render(!0);
}, zt = function(a) {
  var r, i, s, o, c;
  const n = (i = (r = a.target) == null ? void 0 : r.closest("[data-open-journal]")) == null ? void 0 : i.getAttribute("data-open-journal");
  (c = (o = (s = game.journal) == null ? void 0 : s.get(n)) == null ? void 0 : o.sheet) == null || c.render(!0);
}, Jt = async function() {
  const a = this.filters.tag;
  await ye(a) && (this.filters.tag = "", this.render({ force: !0 }));
}, Wt = async function() {
  const a = E(v({ includeHidden: !0 }), this.filters);
  await z(a.map((n) => n.id), !0) && this.render({ force: !0 });
}, Kt = async function() {
  const a = E(v({ includeHidden: !0 }), this.filters);
  await z(a.map((n) => n.id), !1) && this.render({ force: !0 });
}, Zt = async function() {
  await Lt(!ot()) && this.render({ force: !0 });
}, Qt = function() {
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
    createBounty: h(m, l, Yt),
    editBounty: h(m, l, Mt),
    deleteBounty: h(m, l, Ft),
    publishBounty: h(m, l, Pt),
    unpublishBounty: h(m, l, $t),
    archiveBounty: h(m, l, xt),
    completeBounty: h(m, l, qt),
    failBounty: h(m, l, Vt),
    hideBounty: h(m, l, jt),
    claimBounty: h(m, l, kt),
    requestContract: h(m, l, Gt),
    openImage: h(m, l, _t),
    openJournal: h(m, l, zt),
    removeTag: h(m, l, Jt),
    showFiltered: h(m, l, Wt),
    hideFiltered: h(m, l, Kt),
    toggleBoardVisibility: h(m, l, Zt),
    clearFilters: h(m, l, Qt)
  }
}), C(m, "PARTS", {
  board: {
    template: `${w}/bounty-board.hbs`
  }
});
let J = m;
function Xt() {
  return A || (A = new J()), A.render({ force: !0 }), A;
}
async function Se(e = null) {
  if (A) {
    if (e != null && e.id && A._findBountyCard(e.id)) {
      await A._refreshBountyCard(e.id, e);
      return;
    }
    A.render({ force: !0 });
  }
}
const De = {
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
function te() {
  var t;
  const e = (t = game.i18n) == null ? void 0 : t.translations;
  if (e)
    for (const [a, n] of Object.entries(De)) {
      const r = foundry.utils.getProperty(e, a);
      (r === void 0 || r === a) && foundry.utils.setProperty(e, a, n);
    }
}
function ee() {
  const e = {
    open: Xt,
    getAllBounties: v,
    getBounty: H,
    upsertBounty: et,
    deleteBounty: Nt,
    publishBounty: _,
    setBountiesPublished: z,
    setBoardVisibleToPlayers: Lt,
    archiveBounty: It,
    claimBounty: vt
    // Future extension hooks:
    // Patreon/premium gating can wrap open() or selected GM actions here.
    // Random bounty generator can call upsertBounty() with generated data.
    // Faction reputation systems can listen for completed/failed state changes.
    // Galaxy map integration can use location metadata.
    // CyberCall contact integration can add claimant/contact actions.
    // Security camera and crime scene modules can attach evidence links via notes or future document ids.
  }, t = game.modules.get(p);
  t && (t.api = e), game.scifiSuite ?? (game.scifiSuite = {}), game.scifiSuite.bountyBoard = e;
}
Hooks.once("init", async () => {
  te(), Ae(), ee(), Handlebars.registerHelper("bbEq", (e, t) => e === t), Handlebars.registerHelper("bbIncludes", (e, t) => Array.isArray(e) && e.includes(t)), Handlebars.registerHelper("bbStatusClass", (e) => `bb-status--${String(e ?? "available").toLowerCase()}`), await loadTemplates([
    `${w}/bounty-card.hbs`,
    `${w}/bounty-board.hbs`,
    `${w}/bounty-editor.hbs`,
    `${w}/bounty-chat-card.hbs`
  ]);
});
Hooks.once("ready", () => {
  var e, t, a;
  te(), ee(), (a = (t = (e = game.modules.get("holosuite-core")) == null ? void 0 : e.api) == null ? void 0 : t.registerApp) == null || a.call(t, {
    id: p,
    title: ie,
    icon: "fa-solid fa-crosshairs",
    premium: !1,
    description: "Open the sci-fi contract terminal.",
    open: () => Xt()
  }), console.log(`${p} | Ready. API available at game.scifiSuite.bountyBoard.`);
});
