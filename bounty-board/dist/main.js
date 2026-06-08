var jt = Object.defineProperty;
var J = (e) => {
  throw TypeError(e);
};
var Gt = (e, t, n) => t in e ? jt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var p = (e, t, n) => Gt(e, typeof t != "symbol" ? t + "" : t, n), qt = (e, t, n) => t.has(e) || J("Cannot " + n);
var M = (e, t, n) => t.has(e) ? J("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n);
var g = (e, t, n) => (qt(e, t, "access private method"), n);
const m = "bounty-board", kt = "Bounty Board", $ = "bounties", ot = "postPublishChat", ut = "postResultChat", ct = "publicDocumentLinks", j = "removedTags", L = `modules/${m}/templates`, d = Object.freeze({
  AVAILABLE: "available",
  CLAIMED: "claimed",
  COMPLETED: "completed",
  FAILED: "failed",
  HIDDEN: "hidden",
  ARCHIVED: "archived"
}), N = Object.freeze({
  [d.AVAILABLE]: "Available",
  [d.CLAIMED]: "Claimed",
  [d.COMPLETED]: "Completed",
  [d.FAILED]: "Failed",
  [d.HIDDEN]: "Hidden",
  [d.ARCHIVED]: "Archived"
}), G = Object.freeze(["Low", "Moderate", "High", "Severe", "Extreme"]), Vt = Object.freeze([
  "Smuggling",
  "Assassination",
  "Rescue",
  "Investigation",
  "Monster Hunt",
  "Recovery",
  "Escort",
  "Sabotage"
]), zt = Object.freeze({
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
function xt(e = {}) {
  const t = Number(e.rewardAmount ?? 0), n = e.rewardCurrency || "credits";
  return {
    ...e,
    title: String(e.title ?? "Untitled Bounty"),
    targetName: String(e.targetName ?? ""),
    threatLevel: String(e.threatLevel ?? "Moderate"),
    faction: String(e.faction ?? ""),
    status: String(e.status ?? "available"),
    rewardLabel: `${Number.isFinite(t) ? t.toLocaleString() : "0"} ${n}`,
    statusLabel: N[e.status] ?? "Available"
  };
}
async function q(e, t = "published") {
  const n = xt(e), a = await renderTemplate(`${L}/bounty-chat-card.hbs`, {
    bounty: n,
    mode: t,
    isResult: t === "result",
    isPublished: t === "published"
  });
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: "Bounty Board" }),
    content: a,
    flags: {
      [m]: {
        bountyId: n.id,
        mode: t
      }
    }
  });
}
function Ut(e) {
  return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? null));
}
function k() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function E(e = "change bounty data") {
  var t, n, a;
  return (t = game.user) != null && t.isGM ? !0 : ((a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, `Only a GM can ${e}.`), !1);
}
function l(e, t = "") {
  return String(e ?? t).trim();
}
function lt(e) {
  return Array.isArray(e) ? e.map((t) => l(t)).filter(Boolean) : l(e).split(",").map((t) => t.trim()).filter(Boolean);
}
function Jt(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const a = l(n).toLowerCase();
    return !a || t.has(a) ? !1 : (t.add(a), !0);
  });
}
function V() {
  try {
    return lt(game.settings.get(m, j));
  } catch {
    return [];
  }
}
function O(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function _t(e, t = d.AVAILABLE) {
  return Object.values(d).includes(e) ? e : t;
}
function Wt(e) {
  const t = l(e, "Moderate");
  return G.includes(t) ? t : "Moderate";
}
function Yt(e) {
  const t = Number(e);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function dt(e) {
  return N[e] ?? N[d.AVAILABLE];
}
function Kt(e) {
  const t = Number((e == null ? void 0 : e.rewardAmount) ?? 0), n = (e == null ? void 0 : e.rewardCurrency) || "credits";
  return `${t.toLocaleString()} ${n}`;
}
function w(e = {}) {
  const t = k(), n = l(e.id) || `bounty-${foundry.utils.randomID(12)}`, a = l(e.createdAt) || t, r = _t(e.status);
  return {
    ...Ut(zt),
    id: n,
    title: l(e.title, "Untitled Bounty"),
    targetName: l(e.targetName),
    description: l(e.description),
    longDescription: l(e.longDescription),
    rewardAmount: Yt(e.rewardAmount),
    rewardCurrency: l(e.rewardCurrency, "credits") || "credits",
    threatLevel: Wt(e.threatLevel),
    faction: l(e.faction),
    location: l(e.location),
    tags: lt(e.tags),
    status: r,
    image: l(e.image),
    createdAt: a,
    updatedAt: l(e.updatedAt) || a,
    published: e.published === !0,
    claimedBy: l(e.claimedBy),
    notesGM: l(e.notesGM),
    notesPublic: l(e.notesPublic),
    linkedJournalId: l(e.linkedJournalId)
  };
}
function Qt(e) {
  var o, s, u;
  const t = w(e), n = t.linkedJournalId ? ((o = game.journal) == null ? void 0 : o.get(t.linkedJournalId)) ?? null : null, a = game.settings.get(m, ct) === !0, r = game.user, i = !!(n && (r != null && r.isGM || a || (s = n.testUserPermission) != null && s.call(n, r, "OBSERVER")));
  return {
    ...t,
    statusLabel: dt(t.status),
    rewardLabel: Kt(t),
    tagsText: t.tags.join(", "),
    hasImage: !!t.image,
    isClaimed: t.status === d.CLAIMED,
    isVisibleToPlayers: gt(t),
    linkedJournalName: (n == null ? void 0 : n.name) ?? "",
    canSeeJournal: i,
    canEdit: ((u = game.user) == null ? void 0 : u.isGM) === !0
  };
}
function gt(e) {
  const t = w(e);
  return t.published && ![d.HIDDEN, d.ARCHIVED].includes(t.status);
}
function I() {
  const e = game.settings.get(m, $);
  return e ? Array.isArray(e) ? Object.fromEntries(e.map(w).map((t) => [t.id, t])) : typeof e == "object" ? Object.fromEntries(Object.values(e).map(w).map((t) => [t.id, t])) : (console.warn(`${m} | Ignoring invalid bounty setting payload.`, e), {}) : {};
}
async function z(e) {
  return E("save bounties") ? (await game.settings.set(m, $, e ?? {}), e) : I();
}
function x({ includeHidden: e = ((t) => (t = game.user) == null ? void 0 : t.isGM)() === !0 } = {}) {
  const n = Object.values(I()).map(w);
  return (e ? n : n.filter(gt)).sort((r, i) => String(i.updatedAt).localeCompare(String(r.updatedAt)));
}
function T(e) {
  const t = I()[e];
  return t ? w(t) : null;
}
function Xt(e) {
  const t = [];
  return l(e.title) || t.push("Title is required."), l(e.targetName) || t.push("Target name is required."), l(e.rewardCurrency) || t.push("Reward currency is required."), l(e.threatLevel) || t.push("Threat level is required."), t;
}
async function U(e) {
  var s, u;
  if (!E("create or edit bounties")) return null;
  const t = e.id ? T(e.id) : null, n = k(), a = w({
    ...t,
    ...e,
    id: (t == null ? void 0 : t.id) || e.id || `bounty-${foundry.utils.randomID(12)}`,
    createdAt: (t == null ? void 0 : t.createdAt) || n,
    updatedAt: n
  }), r = new Set(V().map((h) => h.toLowerCase()));
  a.tags = a.tags.filter((h) => !r.has(h.toLowerCase()));
  const i = Xt(a);
  if (i.length)
    return (u = (s = ui.notifications) == null ? void 0 : s.error) == null || u.call(s, i.join(" ")), null;
  const o = I();
  return o[a.id] = a, await z(o), a;
}
async function ft(e) {
  if (!E("delete bounties") || !await Dialog.confirm({
    title: "Delete Bounty",
    content: "<p>Permanently delete this bounty from world data?</p>"
  })) return !1;
  const n = I();
  return delete n[e], await z(n), !0;
}
async function D(e, t = {}, { chat: n = !1 } = {}) {
  var i, o;
  if (!E("update bounty status")) return null;
  const a = T(e);
  if (!a)
    return (o = (i = ui.notifications) == null ? void 0 : i.warn) == null || o.call(i, "Bounty not found."), null;
  const r = await U({ ...a, ...t });
  return r ? (n && await q(r, t.status === d.AVAILABLE ? "published" : "result"), r) : null;
}
async function F(e, t = !0) {
  const n = await D(e, {
    published: t,
    status: t ? d.AVAILABLE : d.HIDDEN
  });
  return n && t && game.settings.get(m, ot) && await q(n, "published"), n;
}
async function _(e, t = !1) {
  const n = t ? d.FAILED : d.COMPLETED, a = await D(e, { status: n });
  return a && game.settings.get(m, ut) && await q(a, "result"), a;
}
async function mt(e) {
  return D(e, { status: d.ARCHIVED, published: !1 });
}
async function ht(e, t) {
  return D(e, { status: d.CLAIMED, claimedBy: l(t) });
}
async function Zt(e) {
  var s, u, h, v;
  if (!E("remove bounty tags")) return !1;
  const t = l(e);
  if (!t)
    return (u = (s = ui.notifications) == null ? void 0 : s.warn) == null || u.call(s, "Select a tag to remove."), !1;
  if (!await Dialog.confirm({
    title: "Remove Tag",
    content: `<p>Remove <strong>${O(t)}</strong> from the dropdown and all bounties?</p>`
  })) return !1;
  const a = t.toLowerCase(), r = I();
  let i = 0;
  for (const S of Object.values(r)) {
    const Pt = S.tags.length;
    S.tags = S.tags.filter(($t) => $t.toLowerCase() !== a), S.tags.length !== Pt && (S.updatedAt = k(), i += 1);
  }
  const o = Jt([...V(), t]);
  return await game.settings.set(m, j, o), await z(r), (v = (h = ui.notifications) == null ? void 0 : h.info) == null || v.call(h, `Removed "${t}" from ${i} bount${i === 1 ? "y" : "ies"}.`), !0;
}
function te() {
  const e = x({ includeHidden: !0 }), t = (r) => [...new Set(r.map((i) => l(i)).filter(Boolean))].sort((i, o) => i.localeCompare(o)), n = new Set(V().map((r) => r.toLowerCase())), a = t([...Vt, ...e.flatMap((r) => r.tags)]).filter((r) => !n.has(r.toLowerCase()));
  return {
    statuses: Object.values(d).map((r) => ({ value: r, label: dt(r) })),
    threatLevels: G,
    factions: t(e.map((r) => r.faction)),
    tags: a
  };
}
function W(e, t = {}) {
  const n = l(t.status), a = l(t.threatLevel), r = l(t.faction).toLowerCase(), i = l(t.tag).toLowerCase(), o = l(t.search).toLowerCase();
  return e.filter((s) => {
    const u = w(s);
    return !(n && u.status !== n || a && u.threatLevel !== a || r && u.faction.toLowerCase() !== r || i && !u.tags.some((h) => h.toLowerCase() === i) || o && ![
      u.title,
      u.targetName,
      u.description,
      u.longDescription,
      u.faction,
      u.location,
      u.tags.join(" ")
    ].join(" ").toLowerCase().includes(o));
  });
}
async function ee(e) {
  var r, i, o;
  const t = T(e);
  if (!t) return;
  const n = ChatMessage.getSpeaker({ user: game.user }), a = `
    <div class="bb-chat-card bb-chat-card--request">
      <h3>Contract Request</h3>
      <p><strong>${O(((r = game.user) == null ? void 0 : r.name) ?? "A player")}</strong> requests contract authorization.</p>
      <p><strong>${O(t.title)}</strong> - ${O(t.targetName)}</p>
    </div>
  `;
  await ChatMessage.create({
    speaker: n,
    whisper: ChatMessage.getWhisperRecipients("GM").map((s) => s.id),
    content: a
  }), (o = (i = ui.notifications) == null ? void 0 : i.info) == null || o.call(i, "Contract request sent to the GM.");
}
function ne() {
  game.settings.register(m, $, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(m, ot, {
    name: "Post Chat Card When Publishing",
    hint: "Automatically post a contract card when the GM publishes a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(m, ut, {
    name: "Post Chat Card When Resolved",
    hint: "Automatically post a result card when the GM completes or fails a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(m, ct, {
    name: "Show Linked Journals To Players",
    hint: "Allow player-visible bounty cards to show linked journal buttons when the bounty is published.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(m, j, {
    scope: "world",
    config: !1,
    type: Array,
    default: []
  });
}
var Z, tt;
const Y = ((tt = (Z = foundry.applications) == null ? void 0 : Z.api) == null ? void 0 : tt.ApplicationV2) ?? Application;
var et, nt;
const K = (nt = (et = foundry.applications) == null ? void 0 : et.api) == null ? void 0 : nt.HandlebarsApplicationMixin, ae = K ? K(Y) : Y;
function re(e) {
  return ((e == null ? void 0 : e.contents) ?? []).map((t) => ({ id: t.id, name: t.name }));
}
function ie(e) {
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
var B, pt, yt;
const A = class A extends ae {
  constructor({ bountyId: n = null } = {}) {
    super();
    p(this, "bountyId");
    this.bountyId = n;
  }
  get title() {
    return this.bountyId ? "Edit Bounty" : "Create Bounty";
  }
  async _prepareContext(n) {
    var r;
    const a = this.bountyId ? T(this.bountyId) : w({});
    return {
      bounty: {
        ...a,
        tagsText: a.tags.join(", ")
      },
      statuses: Object.values(d),
      threatLevels: G,
      journals: re(game.journal),
      canEdit: ((r = game.user) == null ? void 0 : r.isGM) === !0
    };
  }
  _onRender(n, a) {
    var i, o;
    (i = super._onRender) == null || i.call(this, n, a), (o = this.element.querySelector("[name='title']")) == null || o.focus();
  }
};
B = new WeakSet(), pt = async function(n, a, r) {
  var o, s, u;
  if (n.preventDefault(), !((o = game.user) != null && o.isGM)) {
    (u = (s = ui.notifications) == null ? void 0 : s.warn) == null || u.call(s, "Only a GM can edit bounties.");
    return;
  }
  await U(ie(a)) && oe();
}, yt = function(n) {
  n.preventDefault();
  const a = this.element.querySelector("[name='image']");
  a && new FilePicker({
    type: "image",
    current: a.value,
    callback: (r) => {
      a.value = r, a.dispatchEvent(new Event("change", { bubbles: !0 }));
    }
  }).browse();
}, M(A, B), p(A, "DEFAULT_OPTIONS", {
  id: "bounty-editor-app",
  tag: "form",
  form: {
    handler: g(A, B, pt),
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
    browseImage: g(A, B, yt)
  }
}), p(A, "PARTS", {
  editor: {
    template: `${L}/bounty-editor.hbs`
  }
});
let R = A;
var at, rt;
const Q = ((rt = (at = foundry.applications) == null ? void 0 : at.api) == null ? void 0 : rt.ApplicationV2) ?? Application;
var it, st;
const X = (st = (it = foundry.applications) == null ? void 0 : it.api) == null ? void 0 : st.HandlebarsApplicationMixin, se = X ? X(Q) : Q;
let b = null;
function y(e) {
  var t, n;
  return ((n = (t = e.target) == null ? void 0 : t.closest("[data-bounty-id]")) == null ? void 0 : n.getAttribute("data-bounty-id")) ?? "";
}
var C, P, bt, c, wt, St, At, Lt, Ct, Bt, It, vt, Et, Tt, Dt, Mt, Ot, Rt, Nt;
const f = class f extends se {
  constructor(n = {}) {
    super(n);
    M(this, C);
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
    const a = ((i = game.user) == null ? void 0 : i.isGM) === !0, r = x({ includeHidden: a }).map(Qt).map((o) => ({ ...o, expanded: this.expanded.has(o.id) }));
    return {
      isGM: a,
      filters: this.filters,
      options: te(),
      bounties: W(r, this.filters),
      totalCount: r.length,
      visibleCount: W(r, this.filters).length
    };
  }
  _onRender(n, a) {
    var i, o;
    (i = super._onRender) == null || i.call(this, n, a);
    const r = this.element;
    (o = r.querySelector(".bb-filters")) == null || o.addEventListener("submit", (s) => {
      s.preventDefault(), s.stopPropagation();
    }), r.querySelectorAll("[data-filter]").forEach((s) => {
      s.addEventListener("change", () => g(this, C, P).call(this, s, { immediate: !0 })), s.addEventListener("input", () => g(this, C, P).call(this, s));
    }), g(this, C, bt).call(this), r.querySelectorAll("[data-bounty-toggle]").forEach((s) => {
      s.addEventListener("click", () => {
        const u = s.dataset.bountyToggle ?? "";
        this.expanded.has(u) ? this.expanded.delete(u) : this.expanded.add(u), this.render({ force: !0 });
      });
    });
  }
  async close(n = {}) {
    return b === this && (b = null), this.pendingFilterRender && window.clearTimeout(this.pendingFilterRender), super.close(n);
  }
};
C = new WeakSet(), P = function(n, { immediate: a = !1 } = {}) {
  const r = n.dataset.filter;
  if (r) {
    if (this.filters[r] = n.value, r === "search") {
      const i = n;
      this.searchSelection = {
        start: i.selectionStart ?? n.value.length,
        end: i.selectionEnd ?? n.value.length
      }, this.restoreSearchFocus = !0;
    }
    if (this.pendingFilterRender && window.clearTimeout(this.pendingFilterRender), !a && r === "search") {
      this.pendingFilterRender = window.setTimeout(() => {
        this.pendingFilterRender = null, this.render({ force: !0 });
      }, 120);
      return;
    }
    this.render({ force: !0 });
  }
}, bt = function() {
  var i, o, s;
  const n = (o = (i = this.element) == null ? void 0 : i.querySelector) == null ? void 0 : o.call(i, "[data-filter='search']");
  if (!n || !this.restoreSearchFocus || document.activeElement === n || this.searchSelection === null) return;
  this.restoreSearchFocus = !1, n.focus({ preventScroll: !0 });
  const a = Math.min(this.searchSelection.start, n.value.length), r = Math.min(this.searchSelection.end, n.value.length);
  (s = n.setSelectionRange) == null || s.call(n, a, r);
}, c = new WeakSet(), wt = function() {
  new R().render({ force: !0 });
}, St = function(n) {
  const a = y(n);
  a && new R({ bountyId: a }).render({ force: !0 });
}, At = async function(n) {
  const a = y(n);
  a && await ft(a) && this.render({ force: !0 });
}, Lt = async function(n) {
  const a = y(n);
  a && (await F(a, !0), this.render({ force: !0 }));
}, Ct = async function(n) {
  const a = y(n);
  a && (await F(a, !1), this.render({ force: !0 }));
}, Bt = async function(n) {
  const a = y(n);
  a && (await mt(a), this.render({ force: !0 }));
}, It = async function(n) {
  const a = y(n);
  a && (await _(a, !1), this.render({ force: !0 }));
}, vt = async function(n) {
  const a = y(n);
  a && (await _(a, !0), this.render({ force: !0 }));
}, Et = async function(n) {
  const a = y(n);
  a && (await D(a, { status: d.HIDDEN, published: !1 }), this.render({ force: !0 }));
}, Tt = async function(n) {
  var i, o, s;
  const a = y(n), r = ((s = (o = (i = n.target) == null ? void 0 : i.closest("[data-bounty-id]")) == null ? void 0 : o.querySelector("[data-claimed-by]")) == null ? void 0 : s.value) ?? "";
  a && (await ht(a, r), this.render({ force: !0 }));
}, Dt = async function(n) {
  const a = y(n);
  a && await ee(a);
}, Mt = function(n) {
  var o, s, u, h, v, S;
  const a = (s = (o = n.target) == null ? void 0 : o.closest("[data-image-src]")) == null ? void 0 : s.getAttribute("data-image-src");
  if (!a) return;
  const r = ((S = (v = (h = (u = n.target) == null ? void 0 : u.closest("[data-bounty-id]")) == null ? void 0 : h.querySelector(".bb-card-title")) == null ? void 0 : v.textContent) == null ? void 0 : S.trim()) || "Bounty Image";
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
}, Ot = function(n) {
  var r, i, o, s, u;
  const a = (i = (r = n.target) == null ? void 0 : r.closest("[data-open-journal]")) == null ? void 0 : i.getAttribute("data-open-journal");
  (u = (s = (o = game.journal) == null ? void 0 : o.get(a)) == null ? void 0 : s.sheet) == null || u.render(!0);
}, Rt = async function() {
  const n = this.filters.tag;
  await Zt(n) && (this.filters.tag = "", this.render({ force: !0 }));
}, Nt = function() {
  this.filters = { status: "", threatLevel: "", faction: "", tag: "", search: "" }, this.render({ force: !0 });
}, M(f, c), p(f, "DEFAULT_OPTIONS", {
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
    createBounty: g(f, c, wt),
    editBounty: g(f, c, St),
    deleteBounty: g(f, c, At),
    publishBounty: g(f, c, Lt),
    unpublishBounty: g(f, c, Ct),
    archiveBounty: g(f, c, Bt),
    completeBounty: g(f, c, It),
    failBounty: g(f, c, vt),
    hideBounty: g(f, c, Et),
    claimBounty: g(f, c, Tt),
    requestContract: g(f, c, Dt),
    openImage: g(f, c, Mt),
    openJournal: g(f, c, Ot),
    removeTag: g(f, c, Rt),
    clearFilters: g(f, c, Nt)
  }
}), p(f, "PARTS", {
  board: {
    template: `${L}/bounty-board.hbs`
  }
});
let H = f;
function Ft() {
  return b || (b = new H()), b.render({ force: !0 }), b;
}
function oe() {
  b == null || b.render({ force: !0 });
}
function Ht() {
  const e = {
    open: Ft,
    getAllBounties: x,
    getBounty: T,
    upsertBounty: U,
    deleteBounty: ft,
    publishBounty: F,
    archiveBounty: mt,
    claimBounty: ht
    // Future extension hooks:
    // Patreon/premium gating can wrap open() or selected GM actions here.
    // Random bounty generator can call upsertBounty() with generated data.
    // Faction reputation systems can listen for completed/failed state changes.
    // Galaxy map integration can use location metadata.
    // CyberCall contact integration can add claimant/contact actions.
    // Security camera and crime scene modules can attach evidence links via notes or future document ids.
  }, t = game.modules.get(m);
  t && (t.api = e), game.scifiSuite ?? (game.scifiSuite = {}), game.scifiSuite.bountyBoard = e;
}
Hooks.once("init", async () => {
  ne(), Ht(), Handlebars.registerHelper("bbEq", (e, t) => e === t), Handlebars.registerHelper("bbIncludes", (e, t) => Array.isArray(e) && e.includes(t)), Handlebars.registerHelper("bbStatusClass", (e) => `bb-status--${String(e ?? "available").toLowerCase()}`), await loadTemplates([
    `${L}/bounty-card.hbs`,
    `${L}/bounty-board.hbs`,
    `${L}/bounty-editor.hbs`,
    `${L}/bounty-chat-card.hbs`
  ]);
});
Hooks.once("ready", () => {
  var e, t, n;
  Ht(), (n = (t = (e = game.modules.get("holosuite-core")) == null ? void 0 : e.api) == null ? void 0 : t.registerApp) == null || n.call(t, {
    id: m,
    title: kt,
    icon: "fa-solid fa-crosshairs",
    premium: !1,
    description: "Open the sci-fi contract terminal.",
    open: () => Ft()
  }), console.log(`${m} | Ready. API available at game.scifiSuite.bountyBoard.`);
});
