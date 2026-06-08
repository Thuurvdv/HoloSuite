var Rt = Object.defineProperty;
var V = (e) => {
  throw TypeError(e);
};
var Nt = (e, t, n) => t in e ? Rt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var p = (e, t, n) => Nt(e, typeof t != "symbol" ? t + "" : t, n), Ft = (e, t, n) => t.has(e) || V("Cannot " + n);
var v = (e, t, n) => t.has(e) ? V("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n);
var g = (e, t, n) => (Ft(e, t, "access private method"), n);
const h = "bounty-board", Ht = "Bounty Board", H = "bounties", rt = "postPublishChat", at = "postResultChat", it = "publicDocumentLinks", S = `modules/${h}/templates`, d = Object.freeze({
  AVAILABLE: "available",
  CLAIMED: "claimed",
  COMPLETED: "completed",
  FAILED: "failed",
  HIDDEN: "hidden",
  ARCHIVED: "archived"
}), O = Object.freeze({
  [d.AVAILABLE]: "Available",
  [d.CLAIMED]: "Claimed",
  [d.COMPLETED]: "Completed",
  [d.FAILED]: "Failed",
  [d.HIDDEN]: "Hidden",
  [d.ARCHIVED]: "Archived"
}), P = Object.freeze(["Low", "Moderate", "High", "Severe", "Extreme"]), Pt = Object.freeze([
  "Smuggling",
  "Assassination",
  "Rescue",
  "Investigation",
  "Monster Hunt",
  "Recovery",
  "Escort",
  "Sabotage"
]), jt = Object.freeze({
  id: "",
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
function $t(e = {}) {
  const t = Number(e.rewardAmount ?? 0), n = e.rewardCurrency || "credits";
  return {
    ...e,
    title: String(e.title ?? "Untitled Bounty"),
    targetName: String(e.targetName ?? ""),
    threatLevel: String(e.threatLevel ?? "Moderate"),
    faction: String(e.faction ?? ""),
    status: String(e.status ?? "available"),
    rewardLabel: `${Number.isFinite(t) ? t.toLocaleString() : "0"} ${n}`,
    statusLabel: O[e.status] ?? "Available"
  };
}
async function j(e, t = "published") {
  const n = $t(e), r = await renderTemplate(`${S}/bounty-chat-card.hbs`, {
    bounty: n,
    mode: t,
    isResult: t === "result",
    isPublished: t === "published"
  });
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: "Bounty Board" }),
    content: r,
    flags: {
      [h]: {
        bountyId: n.id,
        mode: t
      }
    }
  });
}
function qt(e) {
  return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? null));
}
function st() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function D(e = "change bounty data") {
  var t, n, r;
  return (t = game.user) != null && t.isGM ? !0 : ((r = (n = ui.notifications) == null ? void 0 : n.warn) == null || r.call(n, `Only a GM can ${e}.`), !1);
}
function c(e, t = "") {
  return String(e ?? t).trim();
}
function Gt(e) {
  return Array.isArray(e) ? e.map((t) => c(t)).filter(Boolean) : c(e).split(",").map((t) => t.trim()).filter(Boolean);
}
function M(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function kt(e, t = d.AVAILABLE) {
  return Object.values(d).includes(e) ? e : t;
}
function Vt(e) {
  const t = c(e, "Moderate");
  return P.includes(t) ? t : "Moderate";
}
function xt(e) {
  const t = Number(e);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function ot(e) {
  return O[e] ?? O[d.AVAILABLE];
}
function zt(e) {
  const t = Number((e == null ? void 0 : e.rewardAmount) ?? 0), n = (e == null ? void 0 : e.rewardCurrency) || "credits";
  return `${t.toLocaleString()} ${n}`;
}
function b(e = {}) {
  const t = st(), n = c(e.id) || `bounty-${foundry.utils.randomID(12)}`, r = c(e.createdAt) || t, a = kt(e.status);
  return {
    ...qt(jt),
    id: n,
    title: c(e.title, "Untitled Bounty"),
    targetName: c(e.targetName),
    description: c(e.description),
    longDescription: c(e.longDescription),
    rewardAmount: xt(e.rewardAmount),
    rewardCurrency: c(e.rewardCurrency, "credits") || "credits",
    threatLevel: Vt(e.threatLevel),
    faction: c(e.faction),
    location: c(e.location),
    tags: Gt(e.tags),
    status: a,
    image: c(e.image),
    createdAt: r,
    updatedAt: c(e.updatedAt) || r,
    published: e.published === !0,
    claimedBy: c(e.claimedBy),
    notesGM: c(e.notesGM),
    notesPublic: c(e.notesPublic),
    linkedJournalId: c(e.linkedJournalId)
  };
}
function Ut(e) {
  var s, o, l;
  const t = b(e), n = t.linkedJournalId ? ((s = game.journal) == null ? void 0 : s.get(t.linkedJournalId)) ?? null : null, r = game.settings.get(h, it) === !0, a = game.user, i = !!(n && (a != null && a.isGM || r || (o = n.testUserPermission) != null && o.call(n, a, "OBSERVER")));
  return {
    ...t,
    statusLabel: ot(t.status),
    rewardLabel: zt(t),
    tagsText: t.tags.join(", "),
    hasImage: !!t.image,
    isVisibleToPlayers: ut(t),
    linkedJournalName: (n == null ? void 0 : n.name) ?? "",
    canSeeJournal: i,
    canEdit: ((l = game.user) == null ? void 0 : l.isGM) === !0
  };
}
function ut(e) {
  const t = b(e);
  return t.published && ![d.HIDDEN, d.ARCHIVED].includes(t.status);
}
function I() {
  const e = game.settings.get(h, H);
  return e ? Array.isArray(e) ? Object.fromEntries(e.map(b).map((t) => [t.id, t])) : typeof e == "object" ? Object.fromEntries(Object.values(e).map(b).map((t) => [t.id, t])) : (console.warn(`${h} | Ignoring invalid bounty setting payload.`, e), {}) : {};
}
async function ct(e) {
  return D("save bounties") ? (await game.settings.set(h, H, e ?? {}), e) : I();
}
function $({ includeHidden: e = ((t) => (t = game.user) == null ? void 0 : t.isGM)() === !0 } = {}) {
  const n = Object.values(I()).map(b);
  return (e ? n : n.filter(ut)).sort((a, i) => String(i.updatedAt).localeCompare(String(a.updatedAt)));
}
function C(e) {
  const t = I()[e];
  return t ? b(t) : null;
}
function Jt(e) {
  const t = [];
  return c(e.title) || t.push("Title is required."), c(e.targetName) || t.push("Target name is required."), c(e.rewardCurrency) || t.push("Reward currency is required."), c(e.threatLevel) || t.push("Threat level is required."), t;
}
async function q(e) {
  var s, o;
  if (!D("create or edit bounties")) return null;
  const t = e.id ? C(e.id) : null, n = st(), r = b({
    ...t,
    ...e,
    id: (t == null ? void 0 : t.id) || e.id || `bounty-${foundry.utils.randomID(12)}`,
    createdAt: (t == null ? void 0 : t.createdAt) || n,
    updatedAt: n
  }), a = Jt(r);
  if (a.length)
    return (o = (s = ui.notifications) == null ? void 0 : s.error) == null || o.call(s, a.join(" ")), null;
  const i = I();
  return i[r.id] = r, await ct(i), r;
}
async function lt(e) {
  if (!D("delete bounties") || !await Dialog.confirm({
    title: "Delete Bounty",
    content: "<p>Permanently delete this bounty from world data?</p>"
  })) return !1;
  const n = I();
  return delete n[e], await ct(n), !0;
}
async function E(e, t = {}, { chat: n = !1 } = {}) {
  var i, s;
  if (!D("update bounty status")) return null;
  const r = C(e);
  if (!r)
    return (s = (i = ui.notifications) == null ? void 0 : i.warn) == null || s.call(i, "Bounty not found."), null;
  const a = await q({ ...r, ...t });
  return a ? (n && await j(a, t.status === d.AVAILABLE ? "published" : "result"), a) : null;
}
async function R(e, t = !0) {
  const n = await E(e, {
    published: t,
    status: t ? d.AVAILABLE : d.HIDDEN
  });
  return n && t && game.settings.get(h, rt) && await j(n, "published"), n;
}
async function x(e, t = !1) {
  const n = t ? d.FAILED : d.COMPLETED, r = await E(e, { status: n });
  return r && game.settings.get(h, at) && await j(r, "result"), r;
}
async function dt(e) {
  return E(e, { status: d.ARCHIVED, published: !1 });
}
async function gt(e, t) {
  return E(e, { status: d.CLAIMED, claimedBy: c(t) });
}
function _t() {
  const e = $({ includeHidden: !0 }), t = (n) => [...new Set(n.map((r) => c(r)).filter(Boolean))].sort((r, a) => r.localeCompare(a));
  return {
    statuses: Object.values(d).map((n) => ({ value: n, label: ot(n) })),
    threatLevels: P,
    factions: t(e.map((n) => n.faction)),
    tags: t([...Pt, ...e.flatMap((n) => n.tags)])
  };
}
function z(e, t = {}) {
  const n = c(t.status), r = c(t.threatLevel), a = c(t.faction).toLowerCase(), i = c(t.tag).toLowerCase(), s = c(t.search).toLowerCase();
  return e.filter((o) => {
    const l = b(o);
    return !(n && l.status !== n || r && l.threatLevel !== r || a && l.faction.toLowerCase() !== a || i && !l.tags.some((L) => L.toLowerCase() === i) || s && ![
      l.title,
      l.targetName,
      l.description,
      l.longDescription,
      l.faction,
      l.location,
      l.tags.join(" ")
    ].join(" ").toLowerCase().includes(s));
  });
}
async function Wt(e) {
  var a, i, s;
  const t = C(e);
  if (!t) return;
  const n = ChatMessage.getSpeaker({ user: game.user }), r = `
    <div class="bb-chat-card bb-chat-card--request">
      <h3>Contract Request</h3>
      <p><strong>${M(((a = game.user) == null ? void 0 : a.name) ?? "A player")}</strong> requests contract authorization.</p>
      <p><strong>${M(t.title)}</strong> - ${M(t.targetName)}</p>
    </div>
  `;
  await ChatMessage.create({
    speaker: n,
    whisper: ChatMessage.getWhisperRecipients("GM").map((o) => o.id),
    content: r
  }), (s = (i = ui.notifications) == null ? void 0 : i.info) == null || s.call(i, "Contract request sent to the GM.");
}
function Yt() {
  game.settings.register(h, H, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(h, rt, {
    name: "Post Chat Card When Publishing",
    hint: "Automatically post a contract card when the GM publishes a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(h, at, {
    name: "Post Chat Card When Resolved",
    hint: "Automatically post a result card when the GM completes or fails a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(h, it, {
    name: "Show Linked Journals To Players",
    hint: "Allow player-visible bounty cards to show linked journal buttons when the bounty is published.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  });
}
var Y, K;
const U = ((K = (Y = foundry.applications) == null ? void 0 : Y.api) == null ? void 0 : K.ApplicationV2) ?? Application;
var Q, X;
const J = (X = (Q = foundry.applications) == null ? void 0 : Q.api) == null ? void 0 : X.HandlebarsApplicationMixin, Kt = J ? J(U) : U;
function Qt(e) {
  return ((e == null ? void 0 : e.contents) ?? []).map((t) => ({ id: t.id, name: t.name }));
}
function Xt(e) {
  const t = new FormData(e);
  return {
    id: String(t.get("id") ?? ""),
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
var B, ft, ht;
const w = class w extends Kt {
  constructor({ bountyId: n = null } = {}) {
    super();
    p(this, "bountyId");
    this.bountyId = n;
  }
  get title() {
    return this.bountyId ? "Edit Bounty" : "Create Bounty";
  }
  async _prepareContext(n) {
    var a;
    const r = this.bountyId ? C(this.bountyId) : b({});
    return {
      bounty: {
        ...r,
        tagsText: r.tags.join(", ")
      },
      statuses: Object.values(d),
      threatLevels: P,
      journals: Qt(game.journal),
      canEdit: ((a = game.user) == null ? void 0 : a.isGM) === !0
    };
  }
  _onRender(n, r) {
    var i, s;
    (i = super._onRender) == null || i.call(this, n, r), (s = this.element.querySelector("[name='title']")) == null || s.focus();
  }
};
B = new WeakSet(), ft = async function(n, r, a) {
  var s, o, l;
  if (n.preventDefault(), !((s = game.user) != null && s.isGM)) {
    (l = (o = ui.notifications) == null ? void 0 : o.warn) == null || l.call(o, "Only a GM can edit bounties.");
    return;
  }
  await q(Xt(r)) && te();
}, ht = function(n) {
  n.preventDefault();
  const r = this.element.querySelector("[name='image']");
  r && new FilePicker({
    type: "image",
    current: r.value,
    callback: (a) => {
      r.value = a, r.dispatchEvent(new Event("change", { bubbles: !0 }));
    }
  }).browse();
}, v(w, B), p(w, "DEFAULT_OPTIONS", {
  id: "bounty-editor-app",
  tag: "form",
  form: {
    handler: g(w, B, ft),
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
    height: "auto"
  },
  classes: ["bounty-editor-window"],
  actions: {
    browseImage: g(w, B, ht)
  }
}), p(w, "PARTS", {
  editor: {
    template: `${S}/bounty-editor.hbs`
  }
});
let T = w;
var Z, tt;
const _ = ((tt = (Z = foundry.applications) == null ? void 0 : Z.api) == null ? void 0 : tt.ApplicationV2) ?? Application;
var et, nt;
const W = (nt = (et = foundry.applications) == null ? void 0 : et.api) == null ? void 0 : nt.HandlebarsApplicationMixin, Zt = W ? W(_) : _;
let y = null;
function m(e) {
  var t, n;
  return ((n = (t = e.target) == null ? void 0 : t.closest("[data-bounty-id]")) == null ? void 0 : n.getAttribute("data-bounty-id")) ?? "";
}
var A, F, pt, u, mt, yt, bt, wt, St, At, Bt, Lt, It, Ct, Et, vt, Tt, Dt;
const f = class f extends Zt {
  constructor(n = {}) {
    super(n);
    v(this, A);
    p(this, "filters");
    p(this, "expanded");
    p(this, "pendingFilterRender");
    p(this, "searchSelection");
    p(this, "restoreSearchFocus");
    this.filters = {
      status: "",
      threatLevel: "",
      faction: "",
      tag: "",
      search: ""
    }, this.expanded = /* @__PURE__ */ new Set(), this.pendingFilterRender = null, this.searchSelection = null, this.restoreSearchFocus = !1;
  }
  async _prepareContext(n) {
    var i;
    const r = ((i = game.user) == null ? void 0 : i.isGM) === !0, a = $({ includeHidden: r }).map(Ut).map((s) => ({ ...s, expanded: this.expanded.has(s.id) }));
    return {
      isGM: r,
      filters: this.filters,
      options: _t(),
      bounties: z(a, this.filters),
      totalCount: a.length,
      visibleCount: z(a, this.filters).length
    };
  }
  _onRender(n, r) {
    var i, s;
    (i = super._onRender) == null || i.call(this, n, r);
    const a = this.element;
    (s = a.querySelector(".bb-filters")) == null || s.addEventListener("submit", (o) => {
      o.preventDefault(), o.stopPropagation();
    }), a.querySelectorAll("[data-filter]").forEach((o) => {
      o.addEventListener("change", () => g(this, A, F).call(this, o, { immediate: !0 })), o.addEventListener("input", () => g(this, A, F).call(this, o));
    }), g(this, A, pt).call(this), a.querySelectorAll("[data-bounty-toggle]").forEach((o) => {
      o.addEventListener("click", () => {
        const l = o.dataset.bountyToggle ?? "";
        this.expanded.has(l) ? this.expanded.delete(l) : this.expanded.add(l), this.render({ force: !0 });
      });
    });
  }
  async close(n = {}) {
    return y === this && (y = null), this.pendingFilterRender && window.clearTimeout(this.pendingFilterRender), super.close(n);
  }
};
A = new WeakSet(), F = function(n, { immediate: r = !1 } = {}) {
  const a = n.dataset.filter;
  if (a) {
    if (this.filters[a] = n.value, a === "search") {
      const i = n;
      this.searchSelection = {
        start: i.selectionStart ?? n.value.length,
        end: i.selectionEnd ?? n.value.length
      }, this.restoreSearchFocus = !0;
    }
    if (this.pendingFilterRender && window.clearTimeout(this.pendingFilterRender), !r && a === "search") {
      this.pendingFilterRender = window.setTimeout(() => {
        this.pendingFilterRender = null, this.render({ force: !0 });
      }, 120);
      return;
    }
    this.render({ force: !0 });
  }
}, pt = function() {
  var i, s, o;
  const n = (s = (i = this.element) == null ? void 0 : i.querySelector) == null ? void 0 : s.call(i, "[data-filter='search']");
  if (!n || !this.restoreSearchFocus || document.activeElement === n || this.searchSelection === null) return;
  this.restoreSearchFocus = !1, n.focus({ preventScroll: !0 });
  const r = Math.min(this.searchSelection.start, n.value.length), a = Math.min(this.searchSelection.end, n.value.length);
  (o = n.setSelectionRange) == null || o.call(n, r, a);
}, u = new WeakSet(), mt = function() {
  new T().render({ force: !0 });
}, yt = function(n) {
  const r = m(n);
  r && new T({ bountyId: r }).render({ force: !0 });
}, bt = async function(n) {
  const r = m(n);
  r && await lt(r) && this.render({ force: !0 });
}, wt = async function(n) {
  const r = m(n);
  r && (await R(r, !0), this.render({ force: !0 }));
}, St = async function(n) {
  const r = m(n);
  r && (await R(r, !1), this.render({ force: !0 }));
}, At = async function(n) {
  const r = m(n);
  r && (await dt(r), this.render({ force: !0 }));
}, Bt = async function(n) {
  const r = m(n);
  r && (await x(r, !1), this.render({ force: !0 }));
}, Lt = async function(n) {
  const r = m(n);
  r && (await x(r, !0), this.render({ force: !0 }));
}, It = async function(n) {
  const r = m(n);
  r && (await E(r, { status: d.HIDDEN, published: !1 }), this.render({ force: !0 }));
}, Ct = async function(n) {
  var i, s, o;
  const r = m(n), a = ((o = (s = (i = n.target) == null ? void 0 : i.closest("[data-bounty-id]")) == null ? void 0 : s.querySelector("[data-claimed-by]")) == null ? void 0 : o.value) ?? "";
  r && (await gt(r, a), this.render({ force: !0 }));
}, Et = async function(n) {
  const r = m(n);
  r && await Wt(r);
}, vt = function(n) {
  var s, o, l, L, G, k;
  const r = (o = (s = n.target) == null ? void 0 : s.closest("[data-image-src]")) == null ? void 0 : o.getAttribute("data-image-src");
  if (!r) return;
  const a = ((k = (G = (L = (l = n.target) == null ? void 0 : l.closest("[data-bounty-id]")) == null ? void 0 : L.querySelector(".bb-card-title")) == null ? void 0 : G.textContent) == null ? void 0 : k.trim()) || "Bounty Image";
  if (globalThis.ImagePopout) {
    new ImagePopout(r, { title: a }).render(!0);
    return;
  }
  const i = String(r).replaceAll('"', "&quot;");
  new Dialog({
    title: a,
    content: `<img class="bb-image-dialog" src="${i}" alt="" />`,
    buttons: {
      close: { label: "Close" }
    }
  }, { classes: ["bounty-board-window"], width: 720 }).render(!0);
}, Tt = function(n) {
  var a, i, s, o, l;
  const r = (i = (a = n.target) == null ? void 0 : a.closest("[data-open-journal]")) == null ? void 0 : i.getAttribute("data-open-journal");
  (l = (o = (s = game.journal) == null ? void 0 : s.get(r)) == null ? void 0 : o.sheet) == null || l.render(!0);
}, Dt = function() {
  this.filters = { status: "", threatLevel: "", faction: "", tag: "", search: "" }, this.render({ force: !0 });
}, v(f, u), p(f, "DEFAULT_OPTIONS", {
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
    createBounty: g(f, u, mt),
    editBounty: g(f, u, yt),
    deleteBounty: g(f, u, bt),
    publishBounty: g(f, u, wt),
    unpublishBounty: g(f, u, St),
    archiveBounty: g(f, u, At),
    completeBounty: g(f, u, Bt),
    failBounty: g(f, u, Lt),
    hideBounty: g(f, u, It),
    claimBounty: g(f, u, Ct),
    requestContract: g(f, u, Et),
    openImage: g(f, u, vt),
    openJournal: g(f, u, Tt),
    clearFilters: g(f, u, Dt)
  }
}), p(f, "PARTS", {
  board: {
    template: `${S}/bounty-board.hbs`
  }
});
let N = f;
function Mt() {
  return y || (y = new N()), y.render({ force: !0 }), y;
}
function te() {
  y == null || y.render({ force: !0 });
}
function Ot() {
  const e = {
    open: Mt,
    getAllBounties: $,
    getBounty: C,
    upsertBounty: q,
    deleteBounty: lt,
    publishBounty: R,
    archiveBounty: dt,
    claimBounty: gt
    // Future extension hooks:
    // Patreon/premium gating can wrap open() or selected GM actions here.
    // Random bounty generator can call upsertBounty() with generated data.
    // Faction reputation systems can listen for completed/failed state changes.
    // Galaxy map integration can use location metadata.
    // CyberCall contact integration can add claimant/contact actions.
    // Security camera and crime scene modules can attach evidence links via notes or future document ids.
  }, t = game.modules.get(h);
  t && (t.api = e), game.scifiSuite ?? (game.scifiSuite = {}), game.scifiSuite.bountyBoard = e;
}
Hooks.once("init", async () => {
  Yt(), Ot(), Handlebars.registerHelper("bbEq", (e, t) => e === t), Handlebars.registerHelper("bbIncludes", (e, t) => Array.isArray(e) && e.includes(t)), Handlebars.registerHelper("bbStatusClass", (e) => `bb-status--${String(e ?? "available").toLowerCase()}`), await loadTemplates([
    `${S}/bounty-card.hbs`,
    `${S}/bounty-board.hbs`,
    `${S}/bounty-editor.hbs`,
    `${S}/bounty-chat-card.hbs`
  ]);
});
Hooks.once("ready", () => {
  var e, t, n;
  Ot(), (n = (t = (e = game.modules.get("holosuite-core")) == null ? void 0 : e.api) == null ? void 0 : t.registerApp) == null || n.call(t, {
    id: h,
    title: Ht,
    icon: "fa-solid fa-crosshairs",
    premium: !1,
    description: "Open the sci-fi contract terminal.",
    open: () => Mt()
  }), console.log(`${h} | Ready. API available at game.scifiSuite.bountyBoard.`);
});
