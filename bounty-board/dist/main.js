var Mt = Object.defineProperty;
var x = (e) => {
  throw TypeError(e);
};
var Ot = (e, t, n) => t in e ? Mt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var L = (e, t, n) => Ot(e, typeof t != "symbol" ? t + "" : t, n), Nt = (e, t, n) => t.has(e) || x("Cannot " + n);
var T = (e, t, n) => t.has(e) ? x("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n);
var g = (e, t, n) => (Nt(e, t, "access private method"), n);
const p = "bounty-board", rt = "Bounty Board", P = "bounties", it = "postPublishChat", st = "postResultChat", ot = "publicDocumentLinks", w = `modules/${p}/templates`, l = Object.freeze({
  AVAILABLE: "available",
  CLAIMED: "claimed",
  COMPLETED: "completed",
  FAILED: "failed",
  HIDDEN: "hidden",
  ARCHIVED: "archived"
}), O = Object.freeze({
  [l.AVAILABLE]: "Available",
  [l.CLAIMED]: "Claimed",
  [l.COMPLETED]: "Completed",
  [l.FAILED]: "Failed",
  [l.HIDDEN]: "Hidden",
  [l.ARCHIVED]: "Archived"
}), R = Object.freeze(["Low", "Moderate", "High", "Severe", "Extreme"]), Ht = Object.freeze([
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
  status: l.AVAILABLE,
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
async function G(e, t = "published") {
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
      [p]: {
        bountyId: n.id,
        mode: t
      }
    }
  });
}
function Rt(e) {
  return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? null));
}
function $() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function C(e = "change bounty data") {
  var t, n, a;
  return (t = game.user) != null && t.isGM ? !0 : ((a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, `Only a GM can ${e}.`), !1);
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
function $t(e, t = l.AVAILABLE) {
  return Object.values(l).includes(e) ? e : t;
}
function jt(e) {
  const t = c(e, "Moderate");
  return R.includes(t) ? t : "Moderate";
}
function Vt(e) {
  const t = Number(e);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function ut(e) {
  return O[e] ?? O[l.AVAILABLE];
}
function qt(e) {
  const t = Number((e == null ? void 0 : e.rewardAmount) ?? 0), n = (e == null ? void 0 : e.rewardCurrency) || "credits";
  return `${t.toLocaleString()} ${n}`;
}
function h(e = {}) {
  const t = $(), n = c(e.id) || `bounty-${foundry.utils.randomID(12)}`, a = c(e.createdAt) || t, r = $t(e.status);
  return {
    ...Rt(kt),
    id: n,
    title: c(e.title, "Untitled Bounty"),
    targetName: c(e.targetName),
    description: c(e.description),
    longDescription: c(e.longDescription),
    rewardAmount: Vt(e.rewardAmount),
    rewardCurrency: c(e.rewardCurrency, "credits") || "credits",
    threatLevel: jt(e.threatLevel),
    faction: c(e.faction),
    location: c(e.location),
    tags: Gt(e.tags),
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
function Ft(e) {
  var i, o, d;
  const t = h(e), n = t.linkedJournalId ? ((i = game.journal) == null ? void 0 : i.get(t.linkedJournalId)) ?? null : null, a = game.settings.get(p, ot) === !0, r = game.user, s = !!(n && (r != null && r.isGM || a || (o = n.testUserPermission) != null && o.call(n, r, "OBSERVER")));
  return {
    ...t,
    statusLabel: ut(t.status),
    rewardLabel: qt(t),
    tagsText: t.tags.join(", "),
    hasImage: !!t.image,
    isVisibleToPlayers: ct(t),
    linkedJournalName: (n == null ? void 0 : n.name) ?? "",
    canSeeJournal: s,
    canEdit: ((d = game.user) == null ? void 0 : d.isGM) === !0
  };
}
function ct(e) {
  const t = h(e);
  return t.published && ![l.HIDDEN, l.ARCHIVED].includes(t.status);
}
function S() {
  const e = game.settings.get(p, P);
  return e ? Array.isArray(e) ? Object.fromEntries(e.map(h).map((t) => [t.id, t])) : typeof e == "object" ? Object.fromEntries(Object.values(e).map(h).map((t) => [t.id, t])) : (console.warn(`${p} | Ignoring invalid bounty setting payload.`, e), {}) : {};
}
async function j(e) {
  return C("save bounties") ? (await game.settings.set(p, P, e ?? {}), e) : S();
}
function V({ includeHidden: e = ((t) => (t = game.user) == null ? void 0 : t.isGM)() === !0 } = {}) {
  const n = Object.values(S()).map(h);
  return (e ? n : n.filter(ct)).sort((r, s) => String(s.updatedAt).localeCompare(String(r.updatedAt)));
}
function E(e) {
  const t = S()[e];
  return t ? h(t) : null;
}
function xt(e) {
  const t = [];
  return c(e.title) || t.push("Title is required."), c(e.targetName) || t.push("Target name is required."), c(e.rewardCurrency) || t.push("Reward currency is required."), c(e.threatLevel) || t.push("Threat level is required."), t;
}
async function q(e) {
  var i, o;
  if (!C("create or edit bounties")) return null;
  const t = e.id ? E(e.id) : null, n = $(), a = h({
    ...t,
    ...e,
    id: (t == null ? void 0 : t.id) || e.id || `bounty-${foundry.utils.randomID(12)}`,
    createdAt: (t == null ? void 0 : t.createdAt) || n,
    updatedAt: n
  }), r = xt(a);
  if (r.length)
    return (o = (i = ui.notifications) == null ? void 0 : i.error) == null || o.call(i, r.join(" ")), null;
  const s = S();
  return s[a.id] = a, await j(s), a;
}
async function lt(e) {
  if (!C("delete bounties") || !await Dialog.confirm({
    title: "Delete Bounty",
    content: "<p>Permanently delete this bounty from world data?</p>"
  })) return !1;
  const n = S();
  return delete n[e], await j(n), !0;
}
async function v(e, t = {}, { chat: n = !1 } = {}) {
  var s, i;
  if (!C("update bounty status")) return null;
  const a = E(e);
  if (!a)
    return (i = (s = ui.notifications) == null ? void 0 : s.warn) == null || i.call(s, "Bounty not found."), null;
  const r = await q({ ...a, ...t });
  return r ? (n && await G(r, t.status === l.AVAILABLE ? "published" : "result"), r) : null;
}
async function N(e, t = !0) {
  const n = await v(e, {
    published: t,
    status: t ? l.AVAILABLE : l.HIDDEN
  });
  return n && t && game.settings.get(p, it) && await G(n, "published"), n;
}
async function U(e, t = !1) {
  const n = t ? l.FAILED : l.COMPLETED, a = await v(e, { status: n });
  return a && game.settings.get(p, st) && await G(a, "result"), a;
}
async function dt(e) {
  return v(e, { status: l.ARCHIVED, published: !1 });
}
async function gt(e, t) {
  return v(e, { status: l.CLAIMED, claimedBy: c(t) });
}
function Ut() {
  const e = V({ includeHidden: !0 }), t = (n) => [...new Set(n.map(c).filter(Boolean))].sort((a, r) => a.localeCompare(r));
  return {
    statuses: Object.values(l).map((n) => ({ value: n, label: ut(n) })),
    threatLevels: R,
    factions: t(e.map((n) => n.faction)),
    tags: t([...Ht, ...e.flatMap((n) => n.tags)])
  };
}
function z(e, t = {}) {
  const n = c(t.status), a = c(t.threatLevel), r = c(t.faction).toLowerCase(), s = c(t.tag).toLowerCase(), i = c(t.search).toLowerCase();
  return e.filter((o) => {
    const d = h(o);
    return !(n && d.status !== n || a && d.threatLevel !== a || r && d.faction.toLowerCase() !== r || s && !d.tags.some((B) => B.toLowerCase() === s) || i && ![
      d.title,
      d.targetName,
      d.description,
      d.longDescription,
      d.faction,
      d.location,
      d.tags.join(" ")
    ].join(" ").toLowerCase().includes(i));
  });
}
async function zt(e) {
  var r, s, i;
  const t = E(e);
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
  }), (i = (s = ui.notifications) == null ? void 0 : s.info) == null || i.call(s, "Contract request sent to the GM.");
}
async function Jt() {
  var r, s;
  if (!C("seed bounty test data")) return [];
  const e = $(), t = [
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
      status: l.AVAILABLE,
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
      status: l.HIDDEN,
      published: !1,
      notesGM: "Galaxy map integration hook: reveal route after this bounty is accepted.",
      createdAt: e,
      updatedAt: e
    }
  ], n = S(), a = [];
  for (const i of t) {
    const o = h({ ...i, id: `sample-${foundry.utils.randomID(8)}` });
    n[o.id] = o, a.push(o);
  }
  return await j(n), (s = (r = ui.notifications) == null ? void 0 : r.info) == null || s.call(r, `${rt}: seeded ${a.length} sample bounties.`), a;
}
function Wt() {
  game.settings.register(p, P, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(p, it, {
    name: "Post Chat Card When Publishing",
    hint: "Automatically post a contract card when the GM publishes a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(p, st, {
    name: "Post Chat Card When Resolved",
    hint: "Automatically post a result card when the GM completes or fails a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(p, ot, {
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
const W = (Z = (X = foundry.applications) == null ? void 0 : X.api) == null ? void 0 : Z.HandlebarsApplicationMixin, _t = W ? W(J) : J;
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
    status: String(t.get("status") ?? l.AVAILABLE),
    image: String(t.get("image") ?? ""),
    published: t.get("published") === "on",
    claimedBy: String(t.get("claimedBy") ?? ""),
    linkedJournalId: String(t.get("linkedJournalId") ?? "")
  };
}
var A, ft, pt;
const b = class b extends _t {
  constructor({ bountyId: t = null } = {}) {
    super(), this.bountyId = t;
  }
  get title() {
    return this.bountyId ? "Edit Bounty" : "Create Bounty";
  }
  async _prepareContext(t) {
    var a;
    const n = this.bountyId ? E(this.bountyId) : h({});
    return {
      bounty: {
        ...n,
        tagsText: n.tags.join(", ")
      },
      statuses: Object.values(l),
      threatLevels: R,
      journals: Yt(game.journal),
      canEdit: ((a = game.user) == null ? void 0 : a.isGM) === !0
    };
  }
  _onRender(t, n) {
    var r, s;
    (r = super._onRender) == null || r.call(this, t, n), (s = this.element.querySelector("[name='title']")) == null || s.focus();
  }
};
A = new WeakSet(), ft = async function(t, n, a) {
  var s, i, o;
  if (t.preventDefault(), !((s = game.user) != null && s.isGM)) {
    (o = (i = ui.notifications) == null ? void 0 : i.warn) == null || o.call(i, "Only a GM can edit bounties.");
    return;
  }
  await q(Kt(n)) && Xt();
}, pt = function(t) {
  t.preventDefault();
  const n = this.element.querySelector("[name='image']");
  n && new FilePicker({
    type: "image",
    current: n.value,
    callback: (a) => {
      n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 }));
    }
  }).browse();
}, T(b, A), L(b, "DEFAULT_OPTIONS", {
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
    browseImage: g(b, A, pt)
  }
}), L(b, "PARTS", {
  editor: {
    template: `${w}/bounty-editor.hbs`
  }
});
let D = b;
var tt, et;
const _ = ((et = (tt = foundry.applications) == null ? void 0 : tt.api) == null ? void 0 : et.ApplicationV2) ?? Application;
var nt, at;
const Y = (at = (nt = foundry.applications) == null ? void 0 : nt.api) == null ? void 0 : at.HandlebarsApplicationMixin, Qt = Y ? Y(_) : _;
let y = null;
function m(e) {
  var t;
  return (t = e.target.closest("[data-bounty-id]")) == null ? void 0 : t.dataset.bountyId;
}
var I, k, u, mt, ht, yt, bt, wt, At, St, Bt, Lt, It, Ct, Et, vt, Tt;
const f = class f extends Qt {
  constructor(n = {}) {
    super(n);
    T(this, I);
    this.filters = {
      status: "",
      threatLevel: "",
      faction: "",
      tag: "",
      search: ""
    }, this.expanded = /* @__PURE__ */ new Set();
  }
  async _prepareContext(n) {
    var s;
    const a = ((s = game.user) == null ? void 0 : s.isGM) === !0, r = V({ includeHidden: a }).map(Ft).map((i) => ({ ...i, expanded: this.expanded.has(i.id) }));
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
    var s;
    (s = super._onRender) == null || s.call(this, n, a);
    const r = this.element;
    r.querySelectorAll("[data-filter]").forEach((i) => {
      i.addEventListener("change", () => g(this, I, k).call(this, i)), i.addEventListener("input", () => g(this, I, k).call(this, i));
    }), r.querySelectorAll("[data-bounty-toggle]").forEach((i) => {
      i.addEventListener("click", () => {
        const o = i.dataset.bountyToggle;
        this.expanded.has(o) ? this.expanded.delete(o) : this.expanded.add(o), this.render({ force: !0 });
      });
    });
  }
  async close(n = {}) {
    return y === this && (y = null), super.close(n);
  }
};
I = new WeakSet(), k = function(n) {
  this.filters[n.dataset.filter] = n.value, this.render({ force: !0 });
}, u = new WeakSet(), mt = function() {
  new D().render({ force: !0 });
}, ht = function(n) {
  const a = m(n);
  a && new D({ bountyId: a }).render({ force: !0 });
}, yt = async function(n) {
  const a = m(n);
  a && await lt(a) && this.render({ force: !0 });
}, bt = async function(n) {
  const a = m(n);
  a && (await N(a, !0), this.render({ force: !0 }));
}, wt = async function(n) {
  const a = m(n);
  a && (await N(a, !1), this.render({ force: !0 }));
}, At = async function(n) {
  const a = m(n);
  a && (await dt(a), this.render({ force: !0 }));
}, St = async function(n) {
  const a = m(n);
  a && (await U(a, !1), this.render({ force: !0 }));
}, Bt = async function(n) {
  const a = m(n);
  a && (await U(a, !0), this.render({ force: !0 }));
}, Lt = async function(n) {
  const a = m(n);
  a && (await v(a, { status: l.HIDDEN, published: !1 }), this.render({ force: !0 }));
}, It = async function(n) {
  var s, i;
  const a = m(n), r = ((i = (s = n.target.closest("[data-bounty-id]")) == null ? void 0 : s.querySelector("[data-claimed-by]")) == null ? void 0 : i.value) ?? "";
  a && (await gt(a, r), this.render({ force: !0 }));
}, Ct = async function(n) {
  const a = m(n);
  a && await zt(a);
}, Et = function(n) {
  var i, o, d, B;
  const a = (i = n.target.closest("[data-image-src]")) == null ? void 0 : i.dataset.imageSrc;
  if (!a) return;
  const r = ((B = (d = (o = n.target.closest("[data-bounty-id]")) == null ? void 0 : o.querySelector(".bb-card-title")) == null ? void 0 : d.textContent) == null ? void 0 : B.trim()) || "Bounty Image";
  if (globalThis.ImagePopout) {
    new ImagePopout(a, { title: r }).render(!0);
    return;
  }
  const s = String(a).replaceAll('"', "&quot;");
  new Dialog({
    title: r,
    content: `<img class="bb-image-dialog" src="${s}" alt="" />`,
    buttons: {
      close: { label: "Close" }
    }
  }, { classes: ["bounty-board-window"], width: 720 }).render(!0);
}, vt = function(n) {
  var r, s, i, o;
  const a = (r = n.target.closest("[data-open-journal]")) == null ? void 0 : r.dataset.openJournal;
  (o = (i = (s = game.journal) == null ? void 0 : s.get(a)) == null ? void 0 : i.sheet) == null || o.render(!0);
}, Tt = function() {
  this.filters = { status: "", threatLevel: "", faction: "", tag: "", search: "" }, this.render({ force: !0 });
}, T(f, u), L(f, "DEFAULT_OPTIONS", {
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
    editBounty: g(f, u, ht),
    deleteBounty: g(f, u, yt),
    publishBounty: g(f, u, bt),
    unpublishBounty: g(f, u, wt),
    archiveBounty: g(f, u, At),
    completeBounty: g(f, u, St),
    failBounty: g(f, u, Bt),
    hideBounty: g(f, u, Lt),
    claimBounty: g(f, u, It),
    requestContract: g(f, u, Ct),
    openImage: g(f, u, Et),
    openJournal: g(f, u, vt),
    clearFilters: g(f, u, Tt)
  }
}), L(f, "PARTS", {
  board: {
    template: `${w}/bounty-board.hbs`
  }
});
let H = f;
function F() {
  return y || (y = new H()), y.render({ force: !0 }), y;
}
function Xt() {
  y == null || y.render({ force: !0 });
}
function Zt(e) {
  var s, i;
  const t = () => F(), n = {
    name: "bounty-board",
    title: "Bounty Board",
    icon: "fa-solid fa-crosshairs",
    button: !0,
    visible: !0,
    onClick: t,
    onChange: t
  };
  if (Array.isArray(e)) {
    const o = e.find((d) => d.name === "token") ?? e[0];
    o != null && o.tools && !((i = (s = o.tools).some) != null && i.call(s, (d) => d.name === n.name)) && o.tools.push(n);
    return;
  }
  const a = e ?? {}, r = a.tokens ?? a.token ?? Object.values(a)[0];
  !(r != null && r.tools) || r.tools[n.name] || (r.tools[n.name] = { ...n, order: Object.keys(r.tools).length });
}
function Dt() {
  const e = {
    open: F,
    getAllBounties: V,
    getBounty: E,
    upsertBounty: q,
    deleteBounty: lt,
    publishBounty: N,
    archiveBounty: dt,
    claimBounty: gt,
    seedTestData: Jt
    // Future extension hooks:
    // Patreon/premium gating can wrap open() or selected GM actions here.
    // Random bounty generator can call upsertBounty() with generated data.
    // Faction reputation systems can listen for completed/failed state changes.
    // Galaxy map integration can use location metadata.
    // HoloCall contact integration can add claimant/contact actions.
    // Security camera and crime scene modules can attach evidence links via notes or future document ids.
  }, t = game.modules.get(p);
  t && (t.api = e), game.scifiSuite ?? (game.scifiSuite = {}), game.scifiSuite.bountyBoard = e;
}
Hooks.once("init", async () => {
  Wt(), Dt(), Handlebars.registerHelper("bbEq", (e, t) => e === t), Handlebars.registerHelper("bbIncludes", (e, t) => Array.isArray(e) && e.includes(t)), Handlebars.registerHelper("bbStatusClass", (e) => `bb-status--${String(e ?? "available").toLowerCase()}`), await loadTemplates([
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
    id: p,
    title: rt,
    icon: "fa-solid fa-crosshairs",
    premium: !1,
    description: "Open the sci-fi contract terminal.",
    open: () => F()
  }), console.log(`${p} | Ready. API available at game.scifiSuite.bountyBoard.`);
});
