var Yt = Object.defineProperty;
var tt = (e) => {
  throw TypeError(e);
};
var Wt = (e, t, n) => t in e ? Yt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var S = (e, t, n) => Wt(e, typeof t != "symbol" ? t + "" : t, n), Kt = (e, t, n) => t.has(e) || tt("Cannot " + n);
var P = (e, t, n) => t.has(e) ? tt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n);
var g = (e, t, n) => (Kt(e, t, "access private method"), n);
const p = "bounty-board", Qt = "Bounty Board", U = "bounties", pt = "postPublishChat", ht = "postResultChat", yt = "publicDocumentLinks", J = "removedTags", _ = "boardVisibleToPlayers", B = `modules/${p}/templates`, d = Object.freeze({
  AVAILABLE: "available",
  CLAIMED: "claimed",
  COMPLETED: "completed",
  FAILED: "failed",
  HIDDEN: "hidden",
  ARCHIVED: "archived"
}), q = Object.freeze({
  [d.AVAILABLE]: "Available",
  [d.CLAIMED]: "Claimed",
  [d.COMPLETED]: "Completed",
  [d.FAILED]: "Failed",
  [d.HIDDEN]: "Hidden",
  [d.ARCHIVED]: "Archived"
}), Y = Object.freeze(["Unknown", "Low", "Moderate", "High", "Severe", "Extreme"]), Xt = Object.freeze([
  "Smuggling",
  "Assassination",
  "Rescue",
  "Investigation",
  "Monster Hunt",
  "Recovery",
  "Escort",
  "Sabotage"
]), Zt = Object.freeze({
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
function te(e = {}) {
  const t = Number(e.rewardAmount ?? 0), n = e.rewardCurrency || "credits";
  return {
    ...e,
    title: String(e.title ?? "Untitled Bounty"),
    targetName: String(e.targetName ?? ""),
    threatLevel: String(e.threatLevel ?? "Moderate"),
    faction: String(e.faction ?? ""),
    status: String(e.status ?? "available"),
    rewardLabel: `${Number.isFinite(t) ? t.toLocaleString() : "0"} ${n}`,
    statusLabel: q[e.status] ?? "Available"
  };
}
async function W(e, t = "published") {
  const n = te(e), a = await renderTemplate(`${B}/bounty-chat-card.hbs`, {
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
function ee(e) {
  return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? null));
}
function V() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function I(e = "change bounty data") {
  var t, n, a;
  return (t = game.user) != null && t.isGM ? !0 : ((a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, `Only a GM can ${e}.`), !1);
}
function l(e, t = "") {
  return String(e ?? t).trim();
}
function bt(e) {
  return Array.isArray(e) ? e.map((t) => l(t)).filter(Boolean) : l(e).split(",").map((t) => t.trim()).filter(Boolean);
}
function ne(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const a = l(n).toLowerCase();
    return !a || t.has(a) ? !1 : (t.add(a), !0);
  });
}
function K() {
  try {
    return bt(game.settings.get(p, J));
  } catch {
    return [];
  }
}
function R(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function ae(e, t = d.AVAILABLE) {
  return Object.values(d).includes(e) ? e : t;
}
function re(e) {
  const t = l(e, "Moderate");
  return Y.includes(t) ? t : "Moderate";
}
function ie(e) {
  const t = Number(e);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function wt(e) {
  return q[e] ?? q[d.AVAILABLE];
}
function se(e) {
  const t = Number((e == null ? void 0 : e.rewardAmount) ?? 0), n = (e == null ? void 0 : e.rewardCurrency) || "credits";
  return `${t.toLocaleString()} ${n}`;
}
function w(e = {}) {
  const t = V(), n = l(e.id) || `bounty-${foundry.utils.randomID(12)}`, a = l(e.createdAt) || t, r = ae(e.status);
  return {
    ...ee(Zt),
    id: n,
    title: l(e.title, "Untitled Bounty"),
    targetName: l(e.targetName),
    description: l(e.description),
    longDescription: l(e.longDescription),
    rewardAmount: ie(e.rewardAmount),
    rewardCurrency: l(e.rewardCurrency, "credits") || "credits",
    threatLevel: re(e.threatLevel),
    faction: l(e.faction),
    location: l(e.location),
    tags: bt(e.tags),
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
function oe(e) {
  var o, s, u;
  const t = w(e), n = t.linkedJournalId ? ((o = game.journal) == null ? void 0 : o.get(t.linkedJournalId)) ?? null : null, a = game.settings.get(p, yt) === !0, r = game.user, i = !!(n && (r != null && r.isGM || a || (s = n.testUserPermission) != null && s.call(n, r, "OBSERVER")));
  return {
    ...t,
    statusLabel: wt(t.status),
    rewardLabel: se(t),
    tagsText: t.tags.join(", "),
    hasImage: !!t.image,
    isClaimed: t.status === d.CLAIMED,
    isVisibleToPlayers: At(t),
    linkedJournalName: (n == null ? void 0 : n.name) ?? "",
    canSeeJournal: i,
    canEdit: ((u = game.user) == null ? void 0 : u.isGM) === !0
  };
}
function At(e) {
  const t = w(e);
  return t.published && ![d.HIDDEN, d.ARCHIVED].includes(t.status);
}
function et() {
  return game.settings.get(p, _) !== !1;
}
async function St(e) {
  return I(e ? "show the bounty board" : "hide the bounty board") ? (await game.settings.set(p, _, e === !0), !0) : !1;
}
function E() {
  const e = game.settings.get(p, U);
  return e ? Array.isArray(e) ? Object.fromEntries(e.map(w).map((t) => [t.id, t])) : typeof e == "object" ? Object.fromEntries(Object.values(e).map(w).map((t) => [t.id, t])) : (console.warn(`${p} | Ignoring invalid bounty setting payload.`, e), {}) : {};
}
async function F(e) {
  return I("save bounties") ? (await game.settings.set(p, U, e ?? {}), e) : E();
}
function D({ includeHidden: e = ((t) => (t = game.user) == null ? void 0 : t.isGM)() === !0 } = {}) {
  const n = Object.values(E()).map(w);
  return (e ? n : n.filter(At)).sort((r, i) => String(i.updatedAt).localeCompare(String(r.updatedAt)));
}
function M(e) {
  const t = E()[e];
  return t ? w(t) : null;
}
function ue(e) {
  const t = [];
  return l(e.title) || t.push("Title is required."), l(e.targetName) || t.push("Target name is required."), l(e.rewardCurrency) || t.push("Reward currency is required."), l(e.threatLevel) || t.push("Threat level is required."), t;
}
async function Q(e) {
  var s, u;
  if (!I("create or edit bounties")) return null;
  const t = e.id ? M(e.id) : null, n = V(), a = w({
    ...t,
    ...e,
    id: (t == null ? void 0 : t.id) || e.id || `bounty-${foundry.utils.randomID(12)}`,
    createdAt: (t == null ? void 0 : t.createdAt) || n,
    updatedAt: n
  }), r = new Set(K().map((f) => f.toLowerCase()));
  a.tags = a.tags.filter((f) => !r.has(f.toLowerCase()));
  const i = ue(a);
  if (i.length)
    return (u = (s = ui.notifications) == null ? void 0 : s.error) == null || u.call(s, i.join(" ")), null;
  const o = E();
  return o[a.id] = a, await F(o), a;
}
async function Lt(e) {
  if (!I("delete bounties") || !await Dialog.confirm({
    title: "Delete Bounty",
    content: "<p>Permanently delete this bounty from world data?</p>"
  })) return !1;
  const n = E();
  return delete n[e], await F(n), !0;
}
async function O(e, t = {}, { chat: n = !1 } = {}) {
  var i, o;
  if (!I("update bounty status")) return null;
  const a = M(e);
  if (!a)
    return (o = (i = ui.notifications) == null ? void 0 : i.warn) == null || o.call(i, "Bounty not found."), null;
  const r = await Q({ ...a, ...t });
  return r ? (n && await W(r, t.status === d.AVAILABLE ? "published" : "result"), r) : null;
}
async function G(e, t = !0) {
  const n = await O(e, {
    published: t,
    status: t ? d.AVAILABLE : d.HIDDEN
  });
  return n && t && game.settings.get(p, pt) && await W(n, "published"), n;
}
async function nt(e, t = !1) {
  const n = t ? d.FAILED : d.COMPLETED, a = await O(e, { status: n });
  return a && game.settings.get(p, ht) && await W(a, "result"), a;
}
async function Bt(e) {
  return O(e, { status: d.ARCHIVED, published: !1 });
}
async function k(e, t) {
  var o, s;
  if (!I(t ? "publish bounties" : "hide bounties")) return 0;
  const n = [...new Set(e)].filter(Boolean);
  if (!n.length) return 0;
  const a = E();
  let r = 0;
  const i = V();
  for (const u of n) {
    const f = a[u];
    if (!f) continue;
    const h = w(f);
    t && h.status === d.ARCHIVED || (h.published = t, t && h.status === d.HIDDEN && (h.status = d.AVAILABLE), t || (h.status = d.HIDDEN), h.updatedAt = i, a[u] = h, r += 1);
  }
  return await F(a), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, `${r} bount${r === 1 ? "y" : "ies"} ${t ? "shown to" : "hidden from"} players.`), r;
}
async function Ct(e, t) {
  return O(e, { status: d.CLAIMED, claimedBy: l(t) });
}
async function ce(e) {
  var s, u, f, h;
  if (!I("remove bounty tags")) return !1;
  const t = l(e);
  if (!t)
    return (u = (s = ui.notifications) == null ? void 0 : s.warn) == null || u.call(s, "Select a tag to remove."), !1;
  if (!await Dialog.confirm({
    title: "Remove Tag",
    content: `<p>Remove <strong>${R(t)}</strong> from the dropdown and all bounties?</p>`
  })) return !1;
  const a = t.toLowerCase(), r = E();
  let i = 0;
  for (const y of Object.values(r)) {
    const H = y.tags.length;
    y.tags = y.tags.filter((T) => T.toLowerCase() !== a), y.tags.length !== H && (y.updatedAt = V(), i += 1);
  }
  const o = ne([...K(), t]);
  return await game.settings.set(p, J, o), await F(r), (h = (f = ui.notifications) == null ? void 0 : f.info) == null || h.call(f, `Removed "${t}" from ${i} bount${i === 1 ? "y" : "ies"}.`), !0;
}
function le() {
  const e = D({ includeHidden: !0 }), t = (r) => [...new Set(r.map((i) => l(i)).filter(Boolean))].sort((i, o) => i.localeCompare(o)), n = new Set(K().map((r) => r.toLowerCase())), a = t([...Xt, ...e.flatMap((r) => r.tags)]).filter((r) => !n.has(r.toLowerCase()));
  return {
    statuses: Object.values(d).map((r) => ({ value: r, label: wt(r) })),
    threatLevels: Y,
    factions: t(e.map((r) => r.faction)),
    tags: a
  };
}
function j(e, t = {}) {
  const n = l(t.status), a = l(t.threatLevel), r = l(t.faction).toLowerCase(), i = l(t.tag).toLowerCase(), o = l(t.search).toLowerCase();
  return e.filter((s) => {
    const u = w(s);
    return !(n && u.status !== n || a && u.threatLevel !== a || r && u.faction.toLowerCase() !== r || i && !u.tags.some((f) => f.toLowerCase() === i) || o && ![
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
async function de(e) {
  var r, i, o;
  const t = M(e);
  if (!t) return;
  const n = ChatMessage.getSpeaker({ user: game.user }), a = `
    <div class="bb-chat-card bb-chat-card--request">
      <h3>Contract Request</h3>
      <p><strong>${R(((r = game.user) == null ? void 0 : r.name) ?? "A player")}</strong> requests contract authorization.</p>
      <p><strong>${R(t.title)}</strong> - ${R(t.targetName)}</p>
    </div>
  `;
  await ChatMessage.create({
    speaker: n,
    whisper: ChatMessage.getWhisperRecipients("GM").map((s) => s.id),
    content: a
  }), (o = (i = ui.notifications) == null ? void 0 : i.info) == null || o.call(i, "Contract request sent to the GM.");
}
function fe() {
  game.settings.register(p, U, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(p, pt, {
    name: "Post Chat Card When Publishing",
    hint: "Automatically post a contract card when the GM publishes a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(p, ht, {
    name: "Post Chat Card When Resolved",
    hint: "Automatically post a result card when the GM completes or fails a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(p, yt, {
    name: "Show Linked Journals To Players",
    hint: "Allow player-visible bounty cards to show linked journal buttons when the bounty is published.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(p, _, {
    name: "Show Bounty Board To Players",
    hint: "Allow players to open the bounty board and see currently published contracts.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(p, J, {
    scope: "world",
    config: !1,
    type: Array,
    default: []
  });
}
var ot, ut;
const at = ((ut = (ot = foundry.applications) == null ? void 0 : ot.api) == null ? void 0 : ut.ApplicationV2) ?? Application;
var ct, lt;
const rt = (lt = (ct = foundry.applications) == null ? void 0 : ct.api) == null ? void 0 : lt.HandlebarsApplicationMixin, ge = rt ? rt(at) : at;
function me(e) {
  return ((e == null ? void 0 : e.contents) ?? []).map((t) => ({ id: t.id, name: t.name }));
}
function pe(e) {
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
var v, It, Et;
const L = class L extends ge {
  constructor({ bountyId: n = null } = {}) {
    super();
    S(this, "bountyId");
    this.bountyId = n;
  }
  get title() {
    return this.bountyId ? "Edit Bounty" : "Create Bounty";
  }
  async _prepareContext(n) {
    var r;
    const a = this.bountyId ? M(this.bountyId) : w({});
    return {
      bounty: {
        ...a,
        tagsText: a.tags.join(", ")
      },
      statuses: Object.values(d),
      threatLevels: Y,
      journals: me(game.journal),
      canEdit: ((r = game.user) == null ? void 0 : r.isGM) === !0
    };
  }
  _onRender(n, a) {
    var i, o;
    (i = super._onRender) == null || i.call(this, n, a), (o = this.element.querySelector("[name='title']")) == null || o.focus();
  }
};
v = new WeakSet(), It = async function(n, a, r) {
  var o, s, u;
  if (n.preventDefault(), !((o = game.user) != null && o.isGM)) {
    (u = (s = ui.notifications) == null ? void 0 : s.warn) == null || u.call(s, "Only a GM can edit bounties.");
    return;
  }
  await Q(pe(a)) && ye();
}, Et = function(n) {
  n.preventDefault();
  const a = this.element.querySelector("[name='image']");
  a && new FilePicker({
    type: "image",
    current: a.value,
    callback: (r) => {
      a.value = r, a.dispatchEvent(new Event("change", { bubbles: !0 }));
    }
  }).browse();
}, P(L, v), S(L, "DEFAULT_OPTIONS", {
  id: "bounty-editor-app",
  tag: "form",
  form: {
    handler: g(L, v, It),
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
    browseImage: g(L, v, Et)
  }
}), S(L, "PARTS", {
  editor: {
    template: `${B}/bounty-editor.hbs`
  }
});
let $ = L;
var dt, ft;
const it = ((ft = (dt = foundry.applications) == null ? void 0 : dt.api) == null ? void 0 : ft.ApplicationV2) ?? Application;
var gt, mt;
const st = (mt = (gt = foundry.applications) == null ? void 0 : gt.api) == null ? void 0 : mt.HandlebarsApplicationMixin, he = st ? st(it) : it;
let A = null;
function b(e) {
  var t, n;
  return ((n = (t = e.target) == null ? void 0 : t.closest("[data-bounty-id]")) == null ? void 0 : n.getAttribute("data-bounty-id")) ?? "";
}
var C, Tt, z, c, vt, Dt, Mt, Ot, Ht, Nt, Pt, Rt, $t, Vt, Ft, jt, qt, Gt, kt, xt, zt, Ut;
const m = class m extends he {
  constructor(n = {}) {
    super(n);
    P(this, C);
    S(this, "filters");
    S(this, "expanded");
    this.filters = {
      status: "",
      threatLevel: "",
      faction: "",
      tag: "",
      search: ""
    }, this.expanded = /* @__PURE__ */ new Set();
  }
  async _prepareContext(n) {
    var f;
    const a = ((f = game.user) == null ? void 0 : f.isGM) === !0, r = et(), i = !a && !r, o = D({ includeHidden: a }).map(oe).map((h) => ({ ...h, expanded: this.expanded.has(h.id) })), s = { ...this.filters, search: "" }, u = i ? [] : j(o, s);
    return {
      isGM: a,
      boardVisibleToPlayers: r,
      boardHiddenForPlayers: i,
      filters: this.filters,
      options: le(),
      bounties: u,
      totalCount: o.length,
      visibleCount: u.length
    };
  }
  _onRender(n, a) {
    var i, o;
    (i = super._onRender) == null || i.call(this, n, a);
    const r = this.element;
    (o = r.querySelector(".bb-filters")) == null || o.addEventListener("submit", (s) => {
      s.preventDefault(), s.stopPropagation();
    }), r.querySelectorAll("[data-filter]").forEach((s) => {
      s.dataset.filter === "search" ? s.addEventListener("input", () => {
        this.filters.search = s.value, g(this, C, z).call(this);
      }) : s.addEventListener("change", () => g(this, C, Tt).call(this, s, { immediate: !0 }));
    }), g(this, C, z).call(this), r.querySelectorAll("[data-bounty-toggle]").forEach((s) => {
      s.addEventListener("click", () => {
        const u = s.dataset.bountyToggle ?? "";
        this.expanded.has(u) ? this.expanded.delete(u) : this.expanded.add(u), this.render({ force: !0 });
      });
    });
  }
  async close(n = {}) {
    return A === this && (A = null), super.close(n);
  }
};
C = new WeakSet(), Tt = function(n, { immediate: a = !1 } = {}) {
  const r = n.dataset.filter;
  r && (this.filters[r] = n.value, this.render({ force: !0 }));
}, z = function() {
  var s, u, f, h, y, H, T, X;
  const n = this.filters.search.trim().toLowerCase(), a = Array.from(((u = (s = this.element) == null ? void 0 : s.querySelectorAll) == null ? void 0 : u.call(s, "[data-bounty-id]")) ?? []);
  let r = 0;
  for (const N of a) {
    const Z = !n || String(N.textContent ?? "").toLowerCase().includes(n);
    N.hidden = !Z, Z && (r += 1);
  }
  const i = (h = (f = this.element) == null ? void 0 : f.querySelector) == null ? void 0 : h.call(f, ".bb-subtitle"), o = Number(((H = (y = i == null ? void 0 : i.textContent) == null ? void 0 : y.match(/of\s+(\d+)/i)) == null ? void 0 : H[1]) ?? a.length);
  i && (i.textContent = `${r} of ${o} contracts displayed`), (X = (T = this.element) == null ? void 0 : T.querySelectorAll) == null || X.call(T, "[data-action='showFiltered'], [data-action='hideFiltered']").forEach((N) => {
    N.disabled = r === 0;
  });
}, c = new WeakSet(), vt = function() {
  new $().render({ force: !0 });
}, Dt = function(n) {
  const a = b(n);
  a && new $({ bountyId: a }).render({ force: !0 });
}, Mt = async function(n) {
  const a = b(n);
  a && await Lt(a) && this.render({ force: !0 });
}, Ot = async function(n) {
  const a = b(n);
  a && (await G(a, !0), this.render({ force: !0 }));
}, Ht = async function(n) {
  const a = b(n);
  a && (await G(a, !1), this.render({ force: !0 }));
}, Nt = async function(n) {
  const a = b(n);
  a && (await Bt(a), this.render({ force: !0 }));
}, Pt = async function(n) {
  const a = b(n);
  a && (await nt(a, !1), this.render({ force: !0 }));
}, Rt = async function(n) {
  const a = b(n);
  a && (await nt(a, !0), this.render({ force: !0 }));
}, $t = async function(n) {
  const a = b(n);
  a && (await O(a, { status: d.HIDDEN, published: !1 }), this.render({ force: !0 }));
}, Vt = async function(n) {
  var i, o, s;
  const a = b(n), r = ((s = (o = (i = n.target) == null ? void 0 : i.closest("[data-bounty-id]")) == null ? void 0 : o.querySelector("[data-claimed-by]")) == null ? void 0 : s.value) ?? "";
  a && (await Ct(a, r), this.render({ force: !0 }));
}, Ft = async function(n) {
  const a = b(n);
  a && await de(a);
}, jt = function(n) {
  var o, s, u, f, h, y;
  const a = (s = (o = n.target) == null ? void 0 : o.closest("[data-image-src]")) == null ? void 0 : s.getAttribute("data-image-src");
  if (!a) return;
  const r = ((y = (h = (f = (u = n.target) == null ? void 0 : u.closest("[data-bounty-id]")) == null ? void 0 : f.querySelector(".bb-card-title")) == null ? void 0 : h.textContent) == null ? void 0 : y.trim()) || "Bounty Image";
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
}, qt = function(n) {
  var r, i, o, s, u;
  const a = (i = (r = n.target) == null ? void 0 : r.closest("[data-open-journal]")) == null ? void 0 : i.getAttribute("data-open-journal");
  (u = (s = (o = game.journal) == null ? void 0 : o.get(a)) == null ? void 0 : s.sheet) == null || u.render(!0);
}, Gt = async function() {
  const n = this.filters.tag;
  await ce(n) && (this.filters.tag = "", this.render({ force: !0 }));
}, kt = async function() {
  const n = j(D({ includeHidden: !0 }), this.filters);
  await k(n.map((a) => a.id), !0) && this.render({ force: !0 });
}, xt = async function() {
  const n = j(D({ includeHidden: !0 }), this.filters);
  await k(n.map((a) => a.id), !1) && this.render({ force: !0 });
}, zt = async function() {
  await St(!et()) && this.render({ force: !0 });
}, Ut = function() {
  this.filters = { status: "", threatLevel: "", faction: "", tag: "", search: "" }, this.render({ force: !0 });
}, P(m, c), S(m, "DEFAULT_OPTIONS", {
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
    createBounty: g(m, c, vt),
    editBounty: g(m, c, Dt),
    deleteBounty: g(m, c, Mt),
    publishBounty: g(m, c, Ot),
    unpublishBounty: g(m, c, Ht),
    archiveBounty: g(m, c, Nt),
    completeBounty: g(m, c, Pt),
    failBounty: g(m, c, Rt),
    hideBounty: g(m, c, $t),
    claimBounty: g(m, c, Vt),
    requestContract: g(m, c, Ft),
    openImage: g(m, c, jt),
    openJournal: g(m, c, qt),
    removeTag: g(m, c, Gt),
    showFiltered: g(m, c, kt),
    hideFiltered: g(m, c, xt),
    toggleBoardVisibility: g(m, c, zt),
    clearFilters: g(m, c, Ut)
  }
}), S(m, "PARTS", {
  board: {
    template: `${B}/bounty-board.hbs`
  }
});
let x = m;
function Jt() {
  return A || (A = new x()), A.render({ force: !0 }), A;
}
function ye() {
  A == null || A.render({ force: !0 });
}
function _t() {
  const e = {
    open: Jt,
    getAllBounties: D,
    getBounty: M,
    upsertBounty: Q,
    deleteBounty: Lt,
    publishBounty: G,
    setBountiesPublished: k,
    setBoardVisibleToPlayers: St,
    archiveBounty: Bt,
    claimBounty: Ct
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
  fe(), _t(), Handlebars.registerHelper("bbEq", (e, t) => e === t), Handlebars.registerHelper("bbIncludes", (e, t) => Array.isArray(e) && e.includes(t)), Handlebars.registerHelper("bbStatusClass", (e) => `bb-status--${String(e ?? "available").toLowerCase()}`), await loadTemplates([
    `${B}/bounty-card.hbs`,
    `${B}/bounty-board.hbs`,
    `${B}/bounty-editor.hbs`,
    `${B}/bounty-chat-card.hbs`
  ]);
});
Hooks.once("ready", () => {
  var e, t, n;
  _t(), (n = (t = (e = game.modules.get("holosuite-core")) == null ? void 0 : e.api) == null ? void 0 : t.registerApp) == null || n.call(t, {
    id: p,
    title: Qt,
    icon: "fa-solid fa-crosshairs",
    premium: !1,
    description: "Open the sci-fi contract terminal.",
    open: () => Jt()
  }), console.log(`${p} | Ready. API available at game.scifiSuite.bountyBoard.`);
});
