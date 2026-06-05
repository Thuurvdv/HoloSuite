var Mt = Object.defineProperty;
var G = (e) => {
  throw TypeError(e);
};
var Ot = (e, t, n) => t in e ? Mt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var L = (e, t, n) => Ot(e, typeof t != "symbol" ? t + "" : t, n), Nt = (e, t, n) => t.has(e) || G("Cannot " + n);
var v = (e, t, n) => t.has(e) ? G("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n);
var f = (e, t, n) => (Nt(e, t, "access private method"), n);
const h = "bounty-board", Rt = "Bounty Board", F = "bounties", nt = "postPublishChat", at = "postResultChat", rt = "publicDocumentLinks", w = `modules/${h}/templates`, d = Object.freeze({
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
}), P = Object.freeze(["Low", "Moderate", "High", "Severe", "Extreme"]), Ht = Object.freeze([
  "Smuggling",
  "Assassination",
  "Rescue",
  "Investigation",
  "Monster Hunt",
  "Recovery",
  "Escort",
  "Sabotage"
]), Ft = Object.freeze({
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
function Pt(e = {}) {
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
  const n = Pt(e), a = await renderTemplate(`${w}/bounty-chat-card.hbs`, {
    bounty: n,
    mode: t,
    isResult: t === "result",
    isPublished: t === "published"
  });
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: "Bounty Board" }),
    content: a,
    flags: {
      [h]: {
        bountyId: n.id,
        mode: t
      }
    }
  });
}
function jt(e) {
  return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? null));
}
function it() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function D(e = "change bounty data") {
  var t, n, a;
  return (t = game.user) != null && t.isGM ? !0 : ((a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, `Only a GM can ${e}.`), !1);
}
function c(e, t = "") {
  return String(e ?? t).trim();
}
function kt(e) {
  return Array.isArray(e) ? e.map((t) => c(t)).filter(Boolean) : c(e).split(",").map((t) => t.trim()).filter(Boolean);
}
function M(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function $t(e, t = d.AVAILABLE) {
  return Object.values(d).includes(e) ? e : t;
}
function qt(e) {
  const t = c(e, "Moderate");
  return P.includes(t) ? t : "Moderate";
}
function Gt(e) {
  const t = Number(e);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function st(e) {
  return O[e] ?? O[d.AVAILABLE];
}
function Vt(e) {
  const t = Number((e == null ? void 0 : e.rewardAmount) ?? 0), n = (e == null ? void 0 : e.rewardCurrency) || "credits";
  return `${t.toLocaleString()} ${n}`;
}
function y(e = {}) {
  const t = it(), n = c(e.id) || `bounty-${foundry.utils.randomID(12)}`, a = c(e.createdAt) || t, r = $t(e.status);
  return {
    ...jt(Ft),
    id: n,
    title: c(e.title, "Untitled Bounty"),
    targetName: c(e.targetName),
    description: c(e.description),
    longDescription: c(e.longDescription),
    rewardAmount: Gt(e.rewardAmount),
    rewardCurrency: c(e.rewardCurrency, "credits") || "credits",
    threatLevel: qt(e.threatLevel),
    faction: c(e.faction),
    location: c(e.location),
    tags: kt(e.tags),
    status: r,
    image: c(e.image),
    createdAt: a,
    updatedAt: c(e.updatedAt) || a,
    published: e.published === !0,
    claimedBy: c(e.claimedBy),
    notesGM: c(e.notesGM),
    notesPublic: c(e.notesPublic),
    linkedJournalId: c(e.linkedJournalId)
  };
}
function zt(e) {
  var s, o, l;
  const t = y(e), n = t.linkedJournalId ? ((s = game.journal) == null ? void 0 : s.get(t.linkedJournalId)) ?? null : null, a = game.settings.get(h, rt) === !0, r = game.user, i = !!(n && (r != null && r.isGM || a || (o = n.testUserPermission) != null && o.call(n, r, "OBSERVER")));
  return {
    ...t,
    statusLabel: st(t.status),
    rewardLabel: Vt(t),
    tagsText: t.tags.join(", "),
    hasImage: !!t.image,
    isVisibleToPlayers: ot(t),
    linkedJournalName: (n == null ? void 0 : n.name) ?? "",
    canSeeJournal: i,
    canEdit: ((l = game.user) == null ? void 0 : l.isGM) === !0
  };
}
function ot(e) {
  const t = y(e);
  return t.published && ![d.HIDDEN, d.ARCHIVED].includes(t.status);
}
function I() {
  const e = game.settings.get(h, F);
  return e ? Array.isArray(e) ? Object.fromEntries(e.map(y).map((t) => [t.id, t])) : typeof e == "object" ? Object.fromEntries(Object.values(e).map(y).map((t) => [t.id, t])) : (console.warn(`${h} | Ignoring invalid bounty setting payload.`, e), {}) : {};
}
async function ut(e) {
  return D("save bounties") ? (await game.settings.set(h, F, e ?? {}), e) : I();
}
function k({ includeHidden: e = ((t) => (t = game.user) == null ? void 0 : t.isGM)() === !0 } = {}) {
  const n = Object.values(I()).map(y);
  return (e ? n : n.filter(ot)).sort((r, i) => String(i.updatedAt).localeCompare(String(r.updatedAt)));
}
function C(e) {
  const t = I()[e];
  return t ? y(t) : null;
}
function xt(e) {
  const t = [];
  return c(e.title) || t.push("Title is required."), c(e.targetName) || t.push("Target name is required."), c(e.rewardCurrency) || t.push("Reward currency is required."), c(e.threatLevel) || t.push("Threat level is required."), t;
}
async function $(e) {
  var s, o;
  if (!D("create or edit bounties")) return null;
  const t = e.id ? C(e.id) : null, n = it(), a = y({
    ...t,
    ...e,
    id: (t == null ? void 0 : t.id) || e.id || `bounty-${foundry.utils.randomID(12)}`,
    createdAt: (t == null ? void 0 : t.createdAt) || n,
    updatedAt: n
  }), r = xt(a);
  if (r.length)
    return (o = (s = ui.notifications) == null ? void 0 : s.error) == null || o.call(s, r.join(" ")), null;
  const i = I();
  return i[a.id] = a, await ut(i), a;
}
async function ct(e) {
  if (!D("delete bounties") || !await Dialog.confirm({
    title: "Delete Bounty",
    content: "<p>Permanently delete this bounty from world data?</p>"
  })) return !1;
  const n = I();
  return delete n[e], await ut(n), !0;
}
async function E(e, t = {}, { chat: n = !1 } = {}) {
  var i, s;
  if (!D("update bounty status")) return null;
  const a = C(e);
  if (!a)
    return (s = (i = ui.notifications) == null ? void 0 : i.warn) == null || s.call(i, "Bounty not found."), null;
  const r = await $({ ...a, ...t });
  return r ? (n && await j(r, t.status === d.AVAILABLE ? "published" : "result"), r) : null;
}
async function N(e, t = !0) {
  const n = await E(e, {
    published: t,
    status: t ? d.AVAILABLE : d.HIDDEN
  });
  return n && t && game.settings.get(h, nt) && await j(n, "published"), n;
}
async function V(e, t = !1) {
  const n = t ? d.FAILED : d.COMPLETED, a = await E(e, { status: n });
  return a && game.settings.get(h, at) && await j(a, "result"), a;
}
async function lt(e) {
  return E(e, { status: d.ARCHIVED, published: !1 });
}
async function dt(e, t) {
  return E(e, { status: d.CLAIMED, claimedBy: c(t) });
}
function Ut() {
  const e = k({ includeHidden: !0 }), t = (n) => [...new Set(n.map(c).filter(Boolean))].sort((a, r) => a.localeCompare(r));
  return {
    statuses: Object.values(d).map((n) => ({ value: n, label: st(n) })),
    threatLevels: P,
    factions: t(e.map((n) => n.faction)),
    tags: t([...Ht, ...e.flatMap((n) => n.tags)])
  };
}
function z(e, t = {}) {
  const n = c(t.status), a = c(t.threatLevel), r = c(t.faction).toLowerCase(), i = c(t.tag).toLowerCase(), s = c(t.search).toLowerCase();
  return e.filter((o) => {
    const l = y(o);
    return !(n && l.status !== n || a && l.threatLevel !== a || r && l.faction.toLowerCase() !== r || i && !l.tags.some((B) => B.toLowerCase() === i) || s && ![
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
async function Jt(e) {
  var r, i, s;
  const t = C(e);
  if (!t) return;
  const n = ChatMessage.getSpeaker({ user: game.user }), a = `
    <div class="bb-chat-card bb-chat-card--request">
      <h3>Contract Request</h3>
      <p><strong>${M(((r = game.user) == null ? void 0 : r.name) ?? "A player")}</strong> requests contract authorization.</p>
      <p><strong>${M(t.title)}</strong> - ${M(t.targetName)}</p>
    </div>
  `;
  await ChatMessage.create({
    speaker: n,
    whisper: ChatMessage.getWhisperRecipients("GM").map((o) => o.id),
    content: a
  }), (s = (i = ui.notifications) == null ? void 0 : i.info) == null || s.call(i, "Contract request sent to the GM.");
}
function _t() {
  game.settings.register(h, F, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(h, nt, {
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
  }), game.settings.register(h, rt, {
    name: "Show Linked Journals To Players",
    hint: "Allow player-visible bounty cards to show linked journal buttons when the bounty is published.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  });
}
var W, Y;
const x = ((Y = (W = foundry.applications) == null ? void 0 : W.api) == null ? void 0 : Y.ApplicationV2) ?? Application;
var K, Q;
const U = (Q = (K = foundry.applications) == null ? void 0 : K.api) == null ? void 0 : Q.HandlebarsApplicationMixin, Wt = U ? U(x) : x;
function Yt(e) {
  return ((e == null ? void 0 : e.contents) ?? []).map((t) => ({ id: t.id, name: t.name }));
}
function Kt(e) {
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
var A, ft, gt;
const b = class b extends Wt {
  constructor({ bountyId: t = null } = {}) {
    super(), this.bountyId = t;
  }
  get title() {
    return this.bountyId ? "Edit Bounty" : "Create Bounty";
  }
  async _prepareContext(t) {
    var a;
    const n = this.bountyId ? C(this.bountyId) : y({});
    return {
      bounty: {
        ...n,
        tagsText: n.tags.join(", ")
      },
      statuses: Object.values(d),
      threatLevels: P,
      journals: Yt(game.journal),
      canEdit: ((a = game.user) == null ? void 0 : a.isGM) === !0
    };
  }
  _onRender(t, n) {
    var r, i;
    (r = super._onRender) == null || r.call(this, t, n), (i = this.element.querySelector("[name='title']")) == null || i.focus();
  }
};
A = new WeakSet(), ft = async function(t, n, a) {
  var i, s, o;
  if (t.preventDefault(), !((i = game.user) != null && i.isGM)) {
    (o = (s = ui.notifications) == null ? void 0 : s.warn) == null || o.call(s, "Only a GM can edit bounties.");
    return;
  }
  await $(Kt(n)) && Xt();
}, gt = function(t) {
  t.preventDefault();
  const n = this.element.querySelector("[name='image']");
  n && new FilePicker({
    type: "image",
    current: n.value,
    callback: (a) => {
      n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 }));
    }
  }).browse();
}, v(b, A), L(b, "DEFAULT_OPTIONS", {
  id: "bounty-editor-app",
  tag: "form",
  form: {
    handler: f(b, A, ft),
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
    browseImage: f(b, A, gt)
  }
}), L(b, "PARTS", {
  editor: {
    template: `${w}/bounty-editor.hbs`
  }
});
let T = b;
var X, Z;
const J = ((Z = (X = foundry.applications) == null ? void 0 : X.api) == null ? void 0 : Z.ApplicationV2) ?? Application;
var tt, et;
const _ = (et = (tt = foundry.applications) == null ? void 0 : tt.api) == null ? void 0 : et.HandlebarsApplicationMixin, Qt = _ ? _(J) : J;
let p = null;
function m(e) {
  var t;
  return (t = e.target.closest("[data-bounty-id]")) == null ? void 0 : t.dataset.bountyId;
}
var S, H, ht, u, mt, pt, yt, bt, wt, St, At, Bt, Lt, It, Ct, Et, vt, Tt;
const g = class g extends Qt {
  constructor(n = {}) {
    super(n);
    v(this, S);
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
    const a = ((i = game.user) == null ? void 0 : i.isGM) === !0, r = k({ includeHidden: a }).map(zt).map((s) => ({ ...s, expanded: this.expanded.has(s.id) }));
    return {
      isGM: a,
      filters: this.filters,
      options: Ut(),
      bounties: z(r, this.filters),
      totalCount: r.length,
      visibleCount: z(r, this.filters).length
    };
  }
  _onRender(n, a) {
    var i, s;
    (i = super._onRender) == null || i.call(this, n, a);
    const r = this.element;
    (s = r.querySelector(".bb-filters")) == null || s.addEventListener("submit", (o) => {
      o.preventDefault(), o.stopPropagation();
    }), r.querySelectorAll("[data-filter]").forEach((o) => {
      o.addEventListener("change", () => f(this, S, H).call(this, o, { immediate: !0 })), o.addEventListener("input", () => f(this, S, H).call(this, o));
    }), f(this, S, ht).call(this), r.querySelectorAll("[data-bounty-toggle]").forEach((o) => {
      o.addEventListener("click", () => {
        const l = o.dataset.bountyToggle;
        this.expanded.has(l) ? this.expanded.delete(l) : this.expanded.add(l), this.render({ force: !0 });
      });
    });
  }
  async close(n = {}) {
    return p === this && (p = null), this.pendingFilterRender && window.clearTimeout(this.pendingFilterRender), super.close(n);
  }
};
S = new WeakSet(), H = function(n, { immediate: a = !1 } = {}) {
  if (this.filters[n.dataset.filter] = n.value, n.dataset.filter === "search" && (this.searchSelection = {
    start: n.selectionStart ?? n.value.length,
    end: n.selectionEnd ?? n.value.length
  }, this.restoreSearchFocus = !0), this.pendingFilterRender && window.clearTimeout(this.pendingFilterRender), !a && n.dataset.filter === "search") {
    this.pendingFilterRender = window.setTimeout(() => {
      this.pendingFilterRender = null, this.render({ force: !0 });
    }, 120);
    return;
  }
  this.render({ force: !0 });
}, ht = function() {
  var i, s, o;
  const n = (s = (i = this.element) == null ? void 0 : i.querySelector) == null ? void 0 : s.call(i, "[data-filter='search']");
  if (!n || !this.restoreSearchFocus || document.activeElement === n || this.searchSelection === null) return;
  this.restoreSearchFocus = !1, n.focus({ preventScroll: !0 });
  const a = Math.min(this.searchSelection.start, n.value.length), r = Math.min(this.searchSelection.end, n.value.length);
  (o = n.setSelectionRange) == null || o.call(n, a, r);
}, u = new WeakSet(), mt = function() {
  new T().render({ force: !0 });
}, pt = function(n) {
  const a = m(n);
  a && new T({ bountyId: a }).render({ force: !0 });
}, yt = async function(n) {
  const a = m(n);
  a && await ct(a) && this.render({ force: !0 });
}, bt = async function(n) {
  const a = m(n);
  a && (await N(a, !0), this.render({ force: !0 }));
}, wt = async function(n) {
  const a = m(n);
  a && (await N(a, !1), this.render({ force: !0 }));
}, St = async function(n) {
  const a = m(n);
  a && (await lt(a), this.render({ force: !0 }));
}, At = async function(n) {
  const a = m(n);
  a && (await V(a, !1), this.render({ force: !0 }));
}, Bt = async function(n) {
  const a = m(n);
  a && (await V(a, !0), this.render({ force: !0 }));
}, Lt = async function(n) {
  const a = m(n);
  a && (await E(a, { status: d.HIDDEN, published: !1 }), this.render({ force: !0 }));
}, It = async function(n) {
  var i, s;
  const a = m(n), r = ((s = (i = n.target.closest("[data-bounty-id]")) == null ? void 0 : i.querySelector("[data-claimed-by]")) == null ? void 0 : s.value) ?? "";
  a && (await dt(a, r), this.render({ force: !0 }));
}, Ct = async function(n) {
  const a = m(n);
  a && await Jt(a);
}, Et = function(n) {
  var s, o, l, B;
  const a = (s = n.target.closest("[data-image-src]")) == null ? void 0 : s.dataset.imageSrc;
  if (!a) return;
  const r = ((B = (l = (o = n.target.closest("[data-bounty-id]")) == null ? void 0 : o.querySelector(".bb-card-title")) == null ? void 0 : l.textContent) == null ? void 0 : B.trim()) || "Bounty Image";
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
}, vt = function(n) {
  var r, i, s, o;
  const a = (r = n.target.closest("[data-open-journal]")) == null ? void 0 : r.dataset.openJournal;
  (o = (s = (i = game.journal) == null ? void 0 : i.get(a)) == null ? void 0 : s.sheet) == null || o.render(!0);
}, Tt = function() {
  this.filters = { status: "", threatLevel: "", faction: "", tag: "", search: "" }, this.render({ force: !0 });
}, v(g, u), L(g, "DEFAULT_OPTIONS", {
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
    createBounty: f(g, u, mt),
    editBounty: f(g, u, pt),
    deleteBounty: f(g, u, yt),
    publishBounty: f(g, u, bt),
    unpublishBounty: f(g, u, wt),
    archiveBounty: f(g, u, St),
    completeBounty: f(g, u, At),
    failBounty: f(g, u, Bt),
    hideBounty: f(g, u, Lt),
    claimBounty: f(g, u, It),
    requestContract: f(g, u, Ct),
    openImage: f(g, u, Et),
    openJournal: f(g, u, vt),
    clearFilters: f(g, u, Tt)
  }
}), L(g, "PARTS", {
  board: {
    template: `${w}/bounty-board.hbs`
  }
});
let R = g;
function q() {
  return p || (p = new R()), p.render({ force: !0 }), p;
}
function Xt() {
  p == null || p.render({ force: !0 });
}
function Zt(e) {
  var i, s;
  const t = () => q(), n = {
    name: "bounty-board",
    title: "Bounty Board",
    icon: "fa-solid fa-crosshairs",
    button: !0,
    visible: !0,
    onClick: t,
    onChange: t
  };
  if (Array.isArray(e)) {
    const o = e.find((l) => l.name === "token") ?? e[0];
    o != null && o.tools && !((s = (i = o.tools).some) != null && s.call(i, (l) => l.name === n.name)) && o.tools.push(n);
    return;
  }
  const a = e ?? {}, r = a.tokens ?? a.token ?? Object.values(a)[0];
  !(r != null && r.tools) || r.tools[n.name] || (r.tools[n.name] = { ...n, order: Object.keys(r.tools).length });
}
function Dt() {
  const e = {
    open: q,
    getAllBounties: k,
    getBounty: C,
    upsertBounty: $,
    deleteBounty: ct,
    publishBounty: N,
    archiveBounty: lt,
    claimBounty: dt
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
  _t(), Dt(), Handlebars.registerHelper("bbEq", (e, t) => e === t), Handlebars.registerHelper("bbIncludes", (e, t) => Array.isArray(e) && e.includes(t)), Handlebars.registerHelper("bbStatusClass", (e) => `bb-status--${String(e ?? "available").toLowerCase()}`), await loadTemplates([
    `${w}/bounty-card.hbs`,
    `${w}/bounty-board.hbs`,
    `${w}/bounty-editor.hbs`,
    `${w}/bounty-chat-card.hbs`
  ]);
});
Hooks.on("getSceneControlButtons", Zt);
Hooks.once("ready", () => {
  var e, t, n;
  Dt(), (n = (t = (e = game.modules.get("holosuite-core")) == null ? void 0 : e.api) == null ? void 0 : t.registerApp) == null || n.call(t, {
    id: h,
    title: Rt,
    icon: "fa-solid fa-crosshairs",
    premium: !1,
    description: "Open the sci-fi contract terminal.",
    open: () => q()
  }), console.log(`${h} | Ready. API available at game.scifiSuite.bountyBoard.`);
});
