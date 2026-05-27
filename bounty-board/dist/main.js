var Ot = Object.defineProperty;
var x = (e) => {
  throw TypeError(e);
};
var Rt = (e, t, n) => t in e ? Ot(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var I = (e, t, n) => Rt(e, typeof t != "symbol" ? t + "" : t, n), Nt = (e, t, n) => t.has(e) || x("Cannot " + n);
var T = (e, t, n) => t.has(e) ? x("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n);
var g = (e, t, n) => (Nt(e, t, "access private method"), n);
const h = "bounty-board", rt = "Bounty Board", k = "bounties", it = "postPublishChat", st = "postResultChat", ot = "publicDocumentLinks", w = `modules/${h}/templates`, d = Object.freeze({
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
]), kt = Object.freeze({
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
async function F(e, t = "published") {
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
function Ft(e) {
  return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? null));
}
function G() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function v(e = "change bounty data") {
  var t, n, a;
  return (t = game.user) != null && t.isGM ? !0 : ((a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, `Only a GM can ${e}.`), !1);
}
function u(e, t = "") {
  return String(e ?? t).trim();
}
function Gt(e) {
  return Array.isArray(e) ? e.map((t) => u(t)).filter(Boolean) : u(e).split(",").map((t) => t.trim()).filter(Boolean);
}
function M(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function $t(e, t = d.AVAILABLE) {
  return Object.values(d).includes(e) ? e : t;
}
function jt(e) {
  const t = u(e, "Moderate");
  return P.includes(t) ? t : "Moderate";
}
function qt(e) {
  const t = Number(e);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function ct(e) {
  return O[e] ?? O[d.AVAILABLE];
}
function Vt(e) {
  const t = Number((e == null ? void 0 : e.rewardAmount) ?? 0), n = (e == null ? void 0 : e.rewardCurrency) || "credits";
  return `${t.toLocaleString()} ${n}`;
}
function m(e = {}) {
  const t = G(), n = u(e.id) || `bounty-${foundry.utils.randomID(12)}`, a = u(e.createdAt) || t, r = $t(e.status);
  return {
    ...Ft(kt),
    id: n,
    title: u(e.title, "Untitled Bounty"),
    targetName: u(e.targetName),
    description: u(e.description),
    longDescription: u(e.longDescription),
    rewardAmount: qt(e.rewardAmount),
    rewardCurrency: u(e.rewardCurrency, "credits") || "credits",
    threatLevel: jt(e.threatLevel),
    faction: u(e.faction),
    location: u(e.location),
    tags: Gt(e.tags),
    status: r,
    image: u(e.image),
    createdAt: a,
    updatedAt: u(e.updatedAt) || a,
    published: e.published === !0,
    claimedBy: u(e.claimedBy),
    notesGM: u(e.notesGM),
    notesPublic: u(e.notesPublic),
    linkedJournalId: u(e.linkedJournalId)
  };
}
function xt(e) {
  var s, o, l;
  const t = m(e), n = t.linkedJournalId ? ((s = game.journal) == null ? void 0 : s.get(t.linkedJournalId)) ?? null : null, a = game.settings.get(h, ot) === !0, r = game.user, i = !!(n && (r != null && r.isGM || a || (o = n.testUserPermission) != null && o.call(n, r, "OBSERVER")));
  return {
    ...t,
    statusLabel: ct(t.status),
    rewardLabel: Vt(t),
    tagsText: t.tags.join(", "),
    hasImage: !!t.image,
    isVisibleToPlayers: ut(t),
    linkedJournalName: (n == null ? void 0 : n.name) ?? "",
    canSeeJournal: i,
    canEdit: ((l = game.user) == null ? void 0 : l.isGM) === !0
  };
}
function ut(e) {
  const t = m(e);
  return t.published && ![d.HIDDEN, d.ARCHIVED].includes(t.status);
}
function B() {
  const e = game.settings.get(h, k);
  return e ? Array.isArray(e) ? Object.fromEntries(e.map(m).map((t) => [t.id, t])) : typeof e == "object" ? Object.fromEntries(Object.values(e).map(m).map((t) => [t.id, t])) : (console.warn(`${h} | Ignoring invalid bounty setting payload.`, e), {}) : {};
}
async function $(e) {
  return v("save bounties") ? (await game.settings.set(h, k, e ?? {}), e) : B();
}
function j({ includeHidden: e = ((t) => (t = game.user) == null ? void 0 : t.isGM)() === !0 } = {}) {
  const n = Object.values(B()).map(m);
  return (e ? n : n.filter(ut)).sort((r, i) => String(i.updatedAt).localeCompare(String(r.updatedAt)));
}
function C(e) {
  const t = B()[e];
  return t ? m(t) : null;
}
function Ut(e) {
  const t = [];
  return u(e.title) || t.push("Title is required."), u(e.targetName) || t.push("Target name is required."), u(e.rewardCurrency) || t.push("Reward currency is required."), u(e.threatLevel) || t.push("Threat level is required."), t;
}
async function q(e) {
  var s, o;
  if (!v("create or edit bounties")) return null;
  const t = e.id ? C(e.id) : null, n = G(), a = m({
    ...t,
    ...e,
    id: (t == null ? void 0 : t.id) || e.id || `bounty-${foundry.utils.randomID(12)}`,
    createdAt: (t == null ? void 0 : t.createdAt) || n,
    updatedAt: n
  }), r = Ut(a);
  if (r.length)
    return (o = (s = ui.notifications) == null ? void 0 : s.error) == null || o.call(s, r.join(" ")), null;
  const i = B();
  return i[a.id] = a, await $(i), a;
}
async function lt(e) {
  if (!v("delete bounties") || !await Dialog.confirm({
    title: "Delete Bounty",
    content: "<p>Permanently delete this bounty from world data?</p>"
  })) return !1;
  const n = B();
  return delete n[e], await $(n), !0;
}
async function E(e, t = {}, { chat: n = !1 } = {}) {
  var i, s;
  if (!v("update bounty status")) return null;
  const a = C(e);
  if (!a)
    return (s = (i = ui.notifications) == null ? void 0 : i.warn) == null || s.call(i, "Bounty not found."), null;
  const r = await q({ ...a, ...t });
  return r ? (n && await F(r, t.status === d.AVAILABLE ? "published" : "result"), r) : null;
}
async function R(e, t = !0) {
  const n = await E(e, {
    published: t,
    status: t ? d.AVAILABLE : d.HIDDEN
  });
  return n && t && game.settings.get(h, it) && await F(n, "published"), n;
}
async function U(e, t = !1) {
  const n = t ? d.FAILED : d.COMPLETED, a = await E(e, { status: n });
  return a && game.settings.get(h, st) && await F(a, "result"), a;
}
async function dt(e) {
  return E(e, { status: d.ARCHIVED, published: !1 });
}
async function gt(e, t) {
  return E(e, { status: d.CLAIMED, claimedBy: u(t) });
}
function zt() {
  const e = j({ includeHidden: !0 }), t = (n) => [...new Set(n.map(u).filter(Boolean))].sort((a, r) => a.localeCompare(r));
  return {
    statuses: Object.values(d).map((n) => ({ value: n, label: ct(n) })),
    threatLevels: P,
    factions: t(e.map((n) => n.faction)),
    tags: t([...Ht, ...e.flatMap((n) => n.tags)])
  };
}
function z(e, t = {}) {
  const n = u(t.status), a = u(t.threatLevel), r = u(t.faction).toLowerCase(), i = u(t.tag).toLowerCase(), s = u(t.search).toLowerCase();
  return e.filter((o) => {
    const l = m(o);
    return !(n && l.status !== n || a && l.threatLevel !== a || r && l.faction.toLowerCase() !== r || i && !l.tags.some((L) => L.toLowerCase() === i) || s && ![
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
async function Wt() {
  var r, i;
  if (!v("seed bounty test data")) return [];
  const e = G(), t = [
    {
      title: "Red Wake Intercept",
      targetName: "The Glass Jackal",
      description: "Recover stolen drive cores before the convoy reaches restricted space.",
      longDescription: "Blackline telemetry places the fugitive courier inside the Red Wake interdiction lane. Expect spoofed transponders and military-grade countermeasures.",
      rewardAmount: 8500,
      rewardCurrency: "credits",
      threatLevel: "High",
      faction: "Aster Accord",
      location: "Kestral Gate",
      tags: ["Recovery", "Smuggling"],
      status: d.AVAILABLE,
      published: !0,
      notesPublic: "Bring the cores back intact.",
      notesGM: "Premium gating hook: upgrade with Blackline classified details later.",
      createdAt: e,
      updatedAt: e
    },
    {
      title: "Signal Under Saltglass",
      targetName: "Unknown Echo Source",
      description: "Investigate a repeating distress ping beneath reflective storm cover.",
      longDescription: "The signal uses a pre-collapse cadence. Salvors claim the ruins answer back when approached after local midnight.",
      rewardAmount: 4200,
      rewardCurrency: "credits",
      threatLevel: "Moderate",
      faction: "Veil Freeholds",
      location: "Saltglass Ruins",
      tags: ["Investigation", "Rescue"],
      status: d.HIDDEN,
      published: !1,
      notesGM: "Galaxy map integration hook: reveal route after this bounty is accepted.",
      createdAt: e,
      updatedAt: e
    }
  ], n = B(), a = [];
  for (const s of t) {
    const o = m({ ...s, id: `sample-${foundry.utils.randomID(8)}` });
    n[o.id] = o, a.push(o);
  }
  return await $(n), (i = (r = ui.notifications) == null ? void 0 : r.info) == null || i.call(r, `${rt}: seeded ${a.length} sample bounties.`), a;
}
function _t() {
  game.settings.register(h, k, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(h, it, {
    name: "Post Chat Card When Publishing",
    hint: "Automatically post a contract card when the GM publishes a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(h, st, {
    name: "Post Chat Card When Resolved",
    hint: "Automatically post a result card when the GM completes or fails a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(h, ot, {
    name: "Show Linked Journals To Players",
    hint: "Allow player-visible bounty cards to show linked journal buttons when the bounty is published.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  });
}
var K, Q;
const J = ((Q = (K = foundry.applications) == null ? void 0 : K.api) == null ? void 0 : Q.ApplicationV2) ?? Application;
var X, Z;
const W = (Z = (X = foundry.applications) == null ? void 0 : X.api) == null ? void 0 : Z.HandlebarsApplicationMixin, Yt = W ? W(J) : J;
function Kt(e) {
  return ((e == null ? void 0 : e.contents) ?? []).map((t) => ({ id: t.id, name: t.name }));
}
function Qt(e) {
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
var A, ft, ht;
const b = class b extends Yt {
  constructor({ bountyId: t = null } = {}) {
    super(), this.bountyId = t;
  }
  get title() {
    return this.bountyId ? "Edit Bounty" : "Create Bounty";
  }
  async _prepareContext(t) {
    var a;
    const n = this.bountyId ? C(this.bountyId) : m({});
    return {
      bounty: {
        ...n,
        tagsText: n.tags.join(", ")
      },
      statuses: Object.values(d),
      threatLevels: P,
      journals: Kt(game.journal),
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
  await q(Qt(n)) && Zt();
}, ht = function(t) {
  t.preventDefault();
  const n = this.element.querySelector("[name='image']");
  n && new FilePicker({
    type: "image",
    current: n.value,
    callback: (a) => {
      n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 }));
    }
  }).browse();
}, T(b, A), I(b, "DEFAULT_OPTIONS", {
  id: "bounty-editor-app",
  tag: "form",
  form: {
    handler: g(b, A, ft),
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
    browseImage: g(b, A, ht)
  }
}), I(b, "PARTS", {
  editor: {
    template: `${w}/bounty-editor.hbs`
  }
});
let D = b;
var tt, et;
const _ = ((et = (tt = foundry.applications) == null ? void 0 : tt.api) == null ? void 0 : et.ApplicationV2) ?? Application;
var nt, at;
const Y = (at = (nt = foundry.applications) == null ? void 0 : nt.api) == null ? void 0 : at.HandlebarsApplicationMixin, Xt = Y ? Y(_) : _;
let y = null;
function p(e) {
  var t;
  return (t = e.target.closest("[data-bounty-id]")) == null ? void 0 : t.dataset.bountyId;
}
var S, H, pt, c, mt, yt, bt, wt, St, At, Bt, Lt, It, vt, Ct, Et, Tt, Dt;
const f = class f extends Xt {
  constructor(n = {}) {
    super(n);
    T(this, S);
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
    const a = ((i = game.user) == null ? void 0 : i.isGM) === !0, r = j({ includeHidden: a }).map(xt).map((s) => ({ ...s, expanded: this.expanded.has(s.id) }));
    return {
      isGM: a,
      filters: this.filters,
      options: zt(),
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
      o.addEventListener("change", () => g(this, S, H).call(this, o, { immediate: !0 })), o.addEventListener("input", () => g(this, S, H).call(this, o));
    }), g(this, S, pt).call(this), r.querySelectorAll("[data-bounty-toggle]").forEach((o) => {
      o.addEventListener("click", () => {
        const l = o.dataset.bountyToggle;
        this.expanded.has(l) ? this.expanded.delete(l) : this.expanded.add(l), this.render({ force: !0 });
      });
    });
  }
  async close(n = {}) {
    return y === this && (y = null), this.pendingFilterRender && window.clearTimeout(this.pendingFilterRender), super.close(n);
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
}, pt = function() {
  var i, s, o;
  const n = (s = (i = this.element) == null ? void 0 : i.querySelector) == null ? void 0 : s.call(i, "[data-filter='search']");
  if (!n || !this.restoreSearchFocus || document.activeElement === n || this.searchSelection === null) return;
  this.restoreSearchFocus = !1, n.focus({ preventScroll: !0 });
  const a = Math.min(this.searchSelection.start, n.value.length), r = Math.min(this.searchSelection.end, n.value.length);
  (o = n.setSelectionRange) == null || o.call(n, a, r);
}, c = new WeakSet(), mt = function() {
  new D().render({ force: !0 });
}, yt = function(n) {
  const a = p(n);
  a && new D({ bountyId: a }).render({ force: !0 });
}, bt = async function(n) {
  const a = p(n);
  a && await lt(a) && this.render({ force: !0 });
}, wt = async function(n) {
  const a = p(n);
  a && (await R(a, !0), this.render({ force: !0 }));
}, St = async function(n) {
  const a = p(n);
  a && (await R(a, !1), this.render({ force: !0 }));
}, At = async function(n) {
  const a = p(n);
  a && (await dt(a), this.render({ force: !0 }));
}, Bt = async function(n) {
  const a = p(n);
  a && (await U(a, !1), this.render({ force: !0 }));
}, Lt = async function(n) {
  const a = p(n);
  a && (await U(a, !0), this.render({ force: !0 }));
}, It = async function(n) {
  const a = p(n);
  a && (await E(a, { status: d.HIDDEN, published: !1 }), this.render({ force: !0 }));
}, vt = async function(n) {
  var i, s;
  const a = p(n), r = ((s = (i = n.target.closest("[data-bounty-id]")) == null ? void 0 : i.querySelector("[data-claimed-by]")) == null ? void 0 : s.value) ?? "";
  a && (await gt(a, r), this.render({ force: !0 }));
}, Ct = async function(n) {
  const a = p(n);
  a && await Jt(a);
}, Et = function(n) {
  var s, o, l, L;
  const a = (s = n.target.closest("[data-image-src]")) == null ? void 0 : s.dataset.imageSrc;
  if (!a) return;
  const r = ((L = (l = (o = n.target.closest("[data-bounty-id]")) == null ? void 0 : o.querySelector(".bb-card-title")) == null ? void 0 : l.textContent) == null ? void 0 : L.trim()) || "Bounty Image";
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
}, Tt = function(n) {
  var r, i, s, o;
  const a = (r = n.target.closest("[data-open-journal]")) == null ? void 0 : r.dataset.openJournal;
  (o = (s = (i = game.journal) == null ? void 0 : i.get(a)) == null ? void 0 : s.sheet) == null || o.render(!0);
}, Dt = function() {
  this.filters = { status: "", threatLevel: "", faction: "", tag: "", search: "" }, this.render({ force: !0 });
}, T(f, c), I(f, "DEFAULT_OPTIONS", {
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
    createBounty: g(f, c, mt),
    editBounty: g(f, c, yt),
    deleteBounty: g(f, c, bt),
    publishBounty: g(f, c, wt),
    unpublishBounty: g(f, c, St),
    archiveBounty: g(f, c, At),
    completeBounty: g(f, c, Bt),
    failBounty: g(f, c, Lt),
    hideBounty: g(f, c, It),
    claimBounty: g(f, c, vt),
    requestContract: g(f, c, Ct),
    openImage: g(f, c, Et),
    openJournal: g(f, c, Tt),
    clearFilters: g(f, c, Dt)
  }
}), I(f, "PARTS", {
  board: {
    template: `${w}/bounty-board.hbs`
  }
});
let N = f;
function V() {
  return y || (y = new N()), y.render({ force: !0 }), y;
}
function Zt() {
  y == null || y.render({ force: !0 });
}
function te(e) {
  var i, s;
  const t = () => V(), n = {
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
function Mt() {
  const e = {
    open: V,
    getAllBounties: j,
    getBounty: C,
    upsertBounty: q,
    deleteBounty: lt,
    publishBounty: R,
    archiveBounty: dt,
    claimBounty: gt,
    seedTestData: Wt
    // Future extension hooks:
    // Patreon/premium gating can wrap open() or selected GM actions here.
    // Random bounty generator can call upsertBounty() with generated data.
    // Faction reputation systems can listen for completed/failed state changes.
    // Galaxy map integration can use location metadata.
    // HoloCall contact integration can add claimant/contact actions.
    // Security camera and crime scene modules can attach evidence links via notes or future document ids.
  }, t = game.modules.get(h);
  t && (t.api = e), game.scifiSuite ?? (game.scifiSuite = {}), game.scifiSuite.bountyBoard = e;
}
Hooks.once("init", async () => {
  _t(), Mt(), Handlebars.registerHelper("bbEq", (e, t) => e === t), Handlebars.registerHelper("bbIncludes", (e, t) => Array.isArray(e) && e.includes(t)), Handlebars.registerHelper("bbStatusClass", (e) => `bb-status--${String(e ?? "available").toLowerCase()}`), await loadTemplates([
    `${w}/bounty-card.hbs`,
    `${w}/bounty-board.hbs`,
    `${w}/bounty-editor.hbs`,
    `${w}/bounty-chat-card.hbs`
  ]);
});
Hooks.on("getSceneControlButtons", te);
Hooks.once("ready", () => {
  var e, t, n;
  Mt(), (n = (t = (e = game.modules.get("holosuite-core")) == null ? void 0 : e.api) == null ? void 0 : t.registerApp) == null || n.call(t, {
    id: h,
    title: rt,
    icon: "fa-solid fa-crosshairs",
    premium: !1,
    description: "Open the sci-fi contract terminal.",
    open: () => V()
  }), console.log(`${h} | Ready. API available at game.scifiSuite.bountyBoard.`);
});
