var Ut = Object.defineProperty;
var W = (e) => {
  throw TypeError(e);
};
var Jt = (e, t, n) => t in e ? Ut(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var y = (e, t, n) => Jt(e, typeof t != "symbol" ? t + "" : t, n), _t = (e, t, n) => t.has(e) || W("Cannot " + n);
var O = (e, t, n) => t.has(e) ? W("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n);
var f = (e, t, n) => (_t(e, t, "access private method"), n);
const h = "bounty-board", Yt = "Bounty Board", k = "bounties", lt = "postPublishChat", dt = "postResultChat", ft = "publicDocumentLinks", x = "removedTags", z = "boardVisibleToPlayers", L = `modules/${h}/templates`, d = Object.freeze({
  AVAILABLE: "available",
  CLAIMED: "claimed",
  COMPLETED: "completed",
  FAILED: "failed",
  HIDDEN: "hidden",
  ARCHIVED: "archived"
}), $ = Object.freeze({
  [d.AVAILABLE]: "Available",
  [d.CLAIMED]: "Claimed",
  [d.COMPLETED]: "Completed",
  [d.FAILED]: "Failed",
  [d.HIDDEN]: "Hidden",
  [d.ARCHIVED]: "Archived"
}), U = Object.freeze(["Unknown", "Low", "Moderate", "High", "Severe", "Extreme"]), Wt = Object.freeze([
  "Smuggling",
  "Assassination",
  "Rescue",
  "Investigation",
  "Monster Hunt",
  "Recovery",
  "Escort",
  "Sabotage"
]), Kt = Object.freeze({
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
function Qt(e = {}) {
  const t = Number(e.rewardAmount ?? 0), n = e.rewardCurrency || "credits";
  return {
    ...e,
    title: String(e.title ?? "Untitled Bounty"),
    targetName: String(e.targetName ?? ""),
    threatLevel: String(e.threatLevel ?? "Moderate"),
    faction: String(e.faction ?? ""),
    status: String(e.status ?? "available"),
    rewardLabel: `${Number.isFinite(t) ? t.toLocaleString() : "0"} ${n}`,
    statusLabel: $[e.status] ?? "Available"
  };
}
async function J(e, t = "published") {
  const n = Qt(e), r = await renderTemplate(`${L}/bounty-chat-card.hbs`, {
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
function Xt(e) {
  return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? null));
}
function H() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function T(e = "change bounty data") {
  var t, n, r;
  return (t = game.user) != null && t.isGM ? !0 : ((r = (n = ui.notifications) == null ? void 0 : n.warn) == null || r.call(n, `Only a GM can ${e}.`), !1);
}
function l(e, t = "") {
  return String(e ?? t).trim();
}
function gt(e) {
  return Array.isArray(e) ? e.map((t) => l(t)).filter(Boolean) : l(e).split(",").map((t) => t.trim()).filter(Boolean);
}
function Zt(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = l(n).toLowerCase();
    return !r || t.has(r) ? !1 : (t.add(r), !0);
  });
}
function _() {
  try {
    return gt(game.settings.get(h, x));
  } catch {
    return [];
  }
}
function R(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function te(e, t = d.AVAILABLE) {
  return Object.values(d).includes(e) ? e : t;
}
function ee(e) {
  const t = l(e, "Moderate");
  return U.includes(t) ? t : "Moderate";
}
function ne(e) {
  const t = Number(e);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function ht(e) {
  return $[e] ?? $[d.AVAILABLE];
}
function re(e) {
  const t = Number((e == null ? void 0 : e.rewardAmount) ?? 0), n = (e == null ? void 0 : e.rewardCurrency) || "credits";
  return `${t.toLocaleString()} ${n}`;
}
function w(e = {}) {
  const t = H(), n = l(e.id) || `bounty-${foundry.utils.randomID(12)}`, r = l(e.createdAt) || t, a = te(e.status);
  return {
    ...Xt(Kt),
    id: n,
    title: l(e.title, "Untitled Bounty"),
    targetName: l(e.targetName),
    description: l(e.description),
    longDescription: l(e.longDescription),
    rewardAmount: ne(e.rewardAmount),
    rewardCurrency: l(e.rewardCurrency, "credits") || "credits",
    threatLevel: ee(e.threatLevel),
    faction: l(e.faction),
    location: l(e.location),
    tags: gt(e.tags),
    status: a,
    image: l(e.image),
    createdAt: r,
    updatedAt: l(e.updatedAt) || r,
    published: e.published === !0,
    claimedBy: l(e.claimedBy),
    notesGM: l(e.notesGM),
    notesPublic: l(e.notesPublic),
    linkedJournalId: l(e.linkedJournalId)
  };
}
function ae(e) {
  var o, s, u;
  const t = w(e), n = t.linkedJournalId ? ((o = game.journal) == null ? void 0 : o.get(t.linkedJournalId)) ?? null : null, r = game.settings.get(h, ft) === !0, a = game.user, i = !!(n && (a != null && a.isGM || r || (s = n.testUserPermission) != null && s.call(n, a, "OBSERVER")));
  return {
    ...t,
    statusLabel: ht(t.status),
    rewardLabel: re(t),
    tagsText: t.tags.join(", "),
    hasImage: !!t.image,
    isClaimed: t.status === d.CLAIMED,
    isVisibleToPlayers: mt(t),
    linkedJournalName: (n == null ? void 0 : n.name) ?? "",
    canSeeJournal: i,
    canEdit: ((u = game.user) == null ? void 0 : u.isGM) === !0
  };
}
function mt(e) {
  const t = w(e);
  return t.published && ![d.HIDDEN, d.ARCHIVED].includes(t.status);
}
function K() {
  return game.settings.get(h, z) !== !1;
}
async function pt(e) {
  return T(e ? "show the bounty board" : "hide the bounty board") ? (await game.settings.set(h, z, e === !0), !0) : !1;
}
function C() {
  const e = game.settings.get(h, k);
  return e ? Array.isArray(e) ? Object.fromEntries(e.map(w).map((t) => [t.id, t])) : typeof e == "object" ? Object.fromEntries(Object.values(e).map(w).map((t) => [t.id, t])) : (console.warn(`${h} | Ignoring invalid bounty setting payload.`, e), {}) : {};
}
async function P(e) {
  return T("save bounties") ? (await game.settings.set(h, k, e ?? {}), e) : C();
}
function v({ includeHidden: e = ((t) => (t = game.user) == null ? void 0 : t.isGM)() === !0 } = {}) {
  const n = Object.values(C()).map(w);
  return (e ? n : n.filter(mt)).sort((a, i) => String(i.updatedAt).localeCompare(String(a.updatedAt)));
}
function D(e) {
  const t = C()[e];
  return t ? w(t) : null;
}
function ie(e) {
  const t = [];
  return l(e.title) || t.push("Title is required."), l(e.targetName) || t.push("Target name is required."), l(e.rewardCurrency) || t.push("Reward currency is required."), l(e.threatLevel) || t.push("Threat level is required."), t;
}
async function Y(e) {
  var s, u;
  if (!T("create or edit bounties")) return null;
  const t = e.id ? D(e.id) : null, n = H(), r = w({
    ...t,
    ...e,
    id: (t == null ? void 0 : t.id) || e.id || `bounty-${foundry.utils.randomID(12)}`,
    createdAt: (t == null ? void 0 : t.createdAt) || n,
    updatedAt: n
  }), a = new Set(_().map((m) => m.toLowerCase()));
  r.tags = r.tags.filter((m) => !a.has(m.toLowerCase()));
  const i = ie(r);
  if (i.length)
    return (u = (s = ui.notifications) == null ? void 0 : s.error) == null || u.call(s, i.join(" ")), null;
  const o = C();
  return o[r.id] = r, await P(o), r;
}
async function yt(e) {
  if (!T("delete bounties") || !await Dialog.confirm({
    title: "Delete Bounty",
    content: "<p>Permanently delete this bounty from world data?</p>"
  })) return !1;
  const n = C();
  return delete n[e], await P(n), !0;
}
async function M(e, t = {}, { chat: n = !1 } = {}) {
  var i, o;
  if (!T("update bounty status")) return null;
  const r = D(e);
  if (!r)
    return (o = (i = ui.notifications) == null ? void 0 : i.warn) == null || o.call(i, "Bounty not found."), null;
  const a = await Y({ ...r, ...t });
  return a ? (n && await J(a, t.status === d.AVAILABLE ? "published" : "result"), a) : null;
}
async function V(e, t = !0) {
  const n = await M(e, {
    published: t,
    status: t ? d.AVAILABLE : d.HIDDEN
  });
  return n && t && game.settings.get(h, lt) && await J(n, "published"), n;
}
async function Q(e, t = !1) {
  const n = t ? d.FAILED : d.COMPLETED, r = await M(e, { status: n });
  return r && game.settings.get(h, dt) && await J(r, "result"), r;
}
async function bt(e) {
  return M(e, { status: d.ARCHIVED, published: !1 });
}
async function j(e, t) {
  var o, s;
  if (!T(t ? "publish bounties" : "hide bounties")) return 0;
  const n = [...new Set(e)].filter(Boolean);
  if (!n.length) return 0;
  const r = C();
  let a = 0;
  const i = H();
  for (const u of n) {
    const m = r[u];
    if (!m) continue;
    const p = w(m);
    t && p.status === d.ARCHIVED || (p.published = t, t && p.status === d.HIDDEN && (p.status = d.AVAILABLE), t || (p.status = d.HIDDEN), p.updatedAt = i, r[u] = p, a += 1);
  }
  return await P(r), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, `${a} bount${a === 1 ? "y" : "ies"} ${t ? "shown to" : "hidden from"} players.`), a;
}
async function wt(e, t) {
  return M(e, { status: d.CLAIMED, claimedBy: l(t) });
}
async function se(e) {
  var s, u, m, p;
  if (!T("remove bounty tags")) return !1;
  const t = l(e);
  if (!t)
    return (u = (s = ui.notifications) == null ? void 0 : s.warn) == null || u.call(s, "Select a tag to remove."), !1;
  if (!await Dialog.confirm({
    title: "Remove Tag",
    content: `<p>Remove <strong>${R(t)}</strong> from the dropdown and all bounties?</p>`
  })) return !1;
  const r = t.toLowerCase(), a = C();
  let i = 0;
  for (const A of Object.values(a)) {
    const xt = A.tags.length;
    A.tags = A.tags.filter((zt) => zt.toLowerCase() !== r), A.tags.length !== xt && (A.updatedAt = H(), i += 1);
  }
  const o = Zt([..._(), t]);
  return await game.settings.set(h, x, o), await P(a), (p = (m = ui.notifications) == null ? void 0 : m.info) == null || p.call(m, `Removed "${t}" from ${i} bount${i === 1 ? "y" : "ies"}.`), !0;
}
function oe() {
  const e = v({ includeHidden: !0 }), t = (a) => [...new Set(a.map((i) => l(i)).filter(Boolean))].sort((i, o) => i.localeCompare(o)), n = new Set(_().map((a) => a.toLowerCase())), r = t([...Wt, ...e.flatMap((a) => a.tags)]).filter((a) => !n.has(a.toLowerCase()));
  return {
    statuses: Object.values(d).map((a) => ({ value: a, label: ht(a) })),
    threatLevels: U,
    factions: t(e.map((a) => a.faction)),
    tags: r
  };
}
function N(e, t = {}) {
  const n = l(t.status), r = l(t.threatLevel), a = l(t.faction).toLowerCase(), i = l(t.tag).toLowerCase(), o = l(t.search).toLowerCase();
  return e.filter((s) => {
    const u = w(s);
    return !(n && u.status !== n || r && u.threatLevel !== r || a && u.faction.toLowerCase() !== a || i && !u.tags.some((m) => m.toLowerCase() === i) || o && ![
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
async function ue(e) {
  var a, i, o;
  const t = D(e);
  if (!t) return;
  const n = ChatMessage.getSpeaker({ user: game.user }), r = `
    <div class="bb-chat-card bb-chat-card--request">
      <h3>Contract Request</h3>
      <p><strong>${R(((a = game.user) == null ? void 0 : a.name) ?? "A player")}</strong> requests contract authorization.</p>
      <p><strong>${R(t.title)}</strong> - ${R(t.targetName)}</p>
    </div>
  `;
  await ChatMessage.create({
    speaker: n,
    whisper: ChatMessage.getWhisperRecipients("GM").map((s) => s.id),
    content: r
  }), (o = (i = ui.notifications) == null ? void 0 : i.info) == null || o.call(i, "Contract request sent to the GM.");
}
function ce() {
  game.settings.register(h, k, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(h, lt, {
    name: "Post Chat Card When Publishing",
    hint: "Automatically post a contract card when the GM publishes a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(h, dt, {
    name: "Post Chat Card When Resolved",
    hint: "Automatically post a result card when the GM completes or fails a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(h, ft, {
    name: "Show Linked Journals To Players",
    hint: "Allow player-visible bounty cards to show linked journal buttons when the bounty is published.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(h, z, {
    name: "Show Bounty Board To Players",
    hint: "Allow players to open the bounty board and see currently published contracts.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(h, x, {
    scope: "world",
    config: !1,
    type: Array,
    default: []
  });
}
var nt, rt;
const X = ((rt = (nt = foundry.applications) == null ? void 0 : nt.api) == null ? void 0 : rt.ApplicationV2) ?? Application;
var at, it;
const Z = (it = (at = foundry.applications) == null ? void 0 : at.api) == null ? void 0 : it.HandlebarsApplicationMixin, le = Z ? Z(X) : X;
function de(e) {
  return ((e == null ? void 0 : e.contents) ?? []).map((t) => ({ id: t.id, name: t.name }));
}
function fe(e) {
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
var E, St, At;
const B = class B extends le {
  constructor({ bountyId: n = null } = {}) {
    super();
    y(this, "bountyId");
    this.bountyId = n;
  }
  get title() {
    return this.bountyId ? "Edit Bounty" : "Create Bounty";
  }
  async _prepareContext(n) {
    var a;
    const r = this.bountyId ? D(this.bountyId) : w({});
    return {
      bounty: {
        ...r,
        tagsText: r.tags.join(", ")
      },
      statuses: Object.values(d),
      threatLevels: U,
      journals: de(game.journal),
      canEdit: ((a = game.user) == null ? void 0 : a.isGM) === !0
    };
  }
  _onRender(n, r) {
    var i, o;
    (i = super._onRender) == null || i.call(this, n, r), (o = this.element.querySelector("[name='title']")) == null || o.focus();
  }
};
E = new WeakSet(), St = async function(n, r, a) {
  var o, s, u;
  if (n.preventDefault(), !((o = game.user) != null && o.isGM)) {
    (u = (s = ui.notifications) == null ? void 0 : s.warn) == null || u.call(s, "Only a GM can edit bounties.");
    return;
  }
  await Y(fe(r)) && he();
}, At = function(n) {
  n.preventDefault();
  const r = this.element.querySelector("[name='image']");
  r && new FilePicker({
    type: "image",
    current: r.value,
    callback: (a) => {
      r.value = a, r.dispatchEvent(new Event("change", { bubbles: !0 }));
    }
  }).browse();
}, O(B, E), y(B, "DEFAULT_OPTIONS", {
  id: "bounty-editor-app",
  tag: "form",
  form: {
    handler: f(B, E, St),
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
    browseImage: f(B, E, At)
  }
}), y(B, "PARTS", {
  editor: {
    template: `${L}/bounty-editor.hbs`
  }
});
let F = B;
var st, ot;
const tt = ((ot = (st = foundry.applications) == null ? void 0 : st.api) == null ? void 0 : ot.ApplicationV2) ?? Application;
var ut, ct;
const et = (ct = (ut = foundry.applications) == null ? void 0 : ut.api) == null ? void 0 : ct.HandlebarsApplicationMixin, ge = et ? et(tt) : tt;
let S = null;
function b(e) {
  var t, n;
  return ((n = (t = e.target) == null ? void 0 : t.closest("[data-bounty-id]")) == null ? void 0 : n.getAttribute("data-bounty-id")) ?? "";
}
var I, G, Bt, c, Lt, It, Tt, Ct, Et, vt, Dt, Mt, Ot, Rt, Ft, Ht, Pt, Nt, $t, Vt, jt, qt;
const g = class g extends ge {
  constructor(n = {}) {
    super(n);
    O(this, I);
    y(this, "filters");
    y(this, "expanded");
    y(this, "pendingFilterRender");
    y(this, "searchSelection");
    y(this, "restoreSearchFocus");
    this.filters = {
      status: "",
      threatLevel: "",
      faction: "",
      tag: "",
      search: ""
    }, this.expanded = /* @__PURE__ */ new Set(), this.pendingFilterRender = null, this.searchSelection = null, this.restoreSearchFocus = !1;
  }
  async _prepareContext(n) {
    var u;
    const r = ((u = game.user) == null ? void 0 : u.isGM) === !0, a = K(), i = !r && !a, o = v({ includeHidden: r }).map(ae).map((m) => ({ ...m, expanded: this.expanded.has(m.id) })), s = i ? [] : N(o, this.filters);
    return {
      isGM: r,
      boardVisibleToPlayers: a,
      boardHiddenForPlayers: i,
      filters: this.filters,
      options: oe(),
      bounties: s,
      totalCount: o.length,
      visibleCount: s.length
    };
  }
  _onRender(n, r) {
    var i, o;
    (i = super._onRender) == null || i.call(this, n, r);
    const a = this.element;
    (o = a.querySelector(".bb-filters")) == null || o.addEventListener("submit", (s) => {
      s.preventDefault(), s.stopPropagation();
    }), a.querySelectorAll("[data-filter]").forEach((s) => {
      s.dataset.filter === "search" ? s.addEventListener("input", () => f(this, I, G).call(this, s)) : s.addEventListener("change", () => f(this, I, G).call(this, s, { immediate: !0 }));
    }), window.requestAnimationFrame(() => f(this, I, Bt).call(this)), a.querySelectorAll("[data-bounty-toggle]").forEach((s) => {
      s.addEventListener("click", () => {
        const u = s.dataset.bountyToggle ?? "";
        this.expanded.has(u) ? this.expanded.delete(u) : this.expanded.add(u), this.render({ force: !0 });
      });
    });
  }
  async close(n = {}) {
    return S === this && (S = null), this.pendingFilterRender && window.clearTimeout(this.pendingFilterRender), super.close(n);
  }
};
I = new WeakSet(), G = function(n, { immediate: r = !1 } = {}) {
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
}, Bt = function() {
  var i, o, s;
  const n = (o = (i = this.element) == null ? void 0 : i.querySelector) == null ? void 0 : o.call(i, "[data-filter='search']");
  if (!n || !this.restoreSearchFocus || document.activeElement === n || this.searchSelection === null) return;
  this.restoreSearchFocus = !1, n.focus({ preventScroll: !0 });
  const r = Math.min(this.searchSelection.start, n.value.length), a = Math.min(this.searchSelection.end, n.value.length);
  (s = n.setSelectionRange) == null || s.call(n, r, a);
}, c = new WeakSet(), Lt = function() {
  new F().render({ force: !0 });
}, It = function(n) {
  const r = b(n);
  r && new F({ bountyId: r }).render({ force: !0 });
}, Tt = async function(n) {
  const r = b(n);
  r && await yt(r) && this.render({ force: !0 });
}, Ct = async function(n) {
  const r = b(n);
  r && (await V(r, !0), this.render({ force: !0 }));
}, Et = async function(n) {
  const r = b(n);
  r && (await V(r, !1), this.render({ force: !0 }));
}, vt = async function(n) {
  const r = b(n);
  r && (await bt(r), this.render({ force: !0 }));
}, Dt = async function(n) {
  const r = b(n);
  r && (await Q(r, !1), this.render({ force: !0 }));
}, Mt = async function(n) {
  const r = b(n);
  r && (await Q(r, !0), this.render({ force: !0 }));
}, Ot = async function(n) {
  const r = b(n);
  r && (await M(r, { status: d.HIDDEN, published: !1 }), this.render({ force: !0 }));
}, Rt = async function(n) {
  var i, o, s;
  const r = b(n), a = ((s = (o = (i = n.target) == null ? void 0 : i.closest("[data-bounty-id]")) == null ? void 0 : o.querySelector("[data-claimed-by]")) == null ? void 0 : s.value) ?? "";
  r && (await wt(r, a), this.render({ force: !0 }));
}, Ft = async function(n) {
  const r = b(n);
  r && await ue(r);
}, Ht = function(n) {
  var o, s, u, m, p, A;
  const r = (s = (o = n.target) == null ? void 0 : o.closest("[data-image-src]")) == null ? void 0 : s.getAttribute("data-image-src");
  if (!r) return;
  const a = ((A = (p = (m = (u = n.target) == null ? void 0 : u.closest("[data-bounty-id]")) == null ? void 0 : m.querySelector(".bb-card-title")) == null ? void 0 : p.textContent) == null ? void 0 : A.trim()) || "Bounty Image";
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
}, Pt = function(n) {
  var a, i, o, s, u;
  const r = (i = (a = n.target) == null ? void 0 : a.closest("[data-open-journal]")) == null ? void 0 : i.getAttribute("data-open-journal");
  (u = (s = (o = game.journal) == null ? void 0 : o.get(r)) == null ? void 0 : s.sheet) == null || u.render(!0);
}, Nt = async function() {
  const n = this.filters.tag;
  await se(n) && (this.filters.tag = "", this.render({ force: !0 }));
}, $t = async function() {
  const n = N(v({ includeHidden: !0 }), this.filters);
  await j(n.map((r) => r.id), !0) && this.render({ force: !0 });
}, Vt = async function() {
  const n = N(v({ includeHidden: !0 }), this.filters);
  await j(n.map((r) => r.id), !1) && this.render({ force: !0 });
}, jt = async function() {
  await pt(!K()) && this.render({ force: !0 });
}, qt = function() {
  this.filters = { status: "", threatLevel: "", faction: "", tag: "", search: "" }, this.render({ force: !0 });
}, O(g, c), y(g, "DEFAULT_OPTIONS", {
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
    createBounty: f(g, c, Lt),
    editBounty: f(g, c, It),
    deleteBounty: f(g, c, Tt),
    publishBounty: f(g, c, Ct),
    unpublishBounty: f(g, c, Et),
    archiveBounty: f(g, c, vt),
    completeBounty: f(g, c, Dt),
    failBounty: f(g, c, Mt),
    hideBounty: f(g, c, Ot),
    claimBounty: f(g, c, Rt),
    requestContract: f(g, c, Ft),
    openImage: f(g, c, Ht),
    openJournal: f(g, c, Pt),
    removeTag: f(g, c, Nt),
    showFiltered: f(g, c, $t),
    hideFiltered: f(g, c, Vt),
    toggleBoardVisibility: f(g, c, jt),
    clearFilters: f(g, c, qt)
  }
}), y(g, "PARTS", {
  board: {
    template: `${L}/bounty-board.hbs`
  }
});
let q = g;
function Gt() {
  return S || (S = new q()), S.render({ force: !0 }), S;
}
function he() {
  S == null || S.render({ force: !0 });
}
function kt() {
  const e = {
    open: Gt,
    getAllBounties: v,
    getBounty: D,
    upsertBounty: Y,
    deleteBounty: yt,
    publishBounty: V,
    setBountiesPublished: j,
    setBoardVisibleToPlayers: pt,
    archiveBounty: bt,
    claimBounty: wt
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
  ce(), kt(), Handlebars.registerHelper("bbEq", (e, t) => e === t), Handlebars.registerHelper("bbIncludes", (e, t) => Array.isArray(e) && e.includes(t)), Handlebars.registerHelper("bbStatusClass", (e) => `bb-status--${String(e ?? "available").toLowerCase()}`), await loadTemplates([
    `${L}/bounty-card.hbs`,
    `${L}/bounty-board.hbs`,
    `${L}/bounty-editor.hbs`,
    `${L}/bounty-chat-card.hbs`
  ]);
});
Hooks.once("ready", () => {
  var e, t, n;
  kt(), (n = (t = (e = game.modules.get("holosuite-core")) == null ? void 0 : e.api) == null ? void 0 : t.registerApp) == null || n.call(t, {
    id: h,
    title: Yt,
    icon: "fa-solid fa-crosshairs",
    premium: !1,
    description: "Open the sci-fi contract terminal.",
    open: () => Gt()
  }), console.log(`${h} | Ready. API available at game.scifiSuite.bountyBoard.`);
});
