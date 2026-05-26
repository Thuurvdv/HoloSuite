var Rt = Object.defineProperty;
var J = (e) => {
  throw TypeError(e);
};
var Pt = (e, t, n) => t in e ? Rt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var I = (e, t, n) => Pt(e, typeof t != "symbol" ? t + "" : t, n), Gt = (e, t, n) => t.has(e) || J("Cannot " + n);
var D = (e, t, n) => t.has(e) ? J("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n);
var g = (e, t, n) => (Gt(e, t, "access private method"), n);
const p = "bounty-board", ct = "Bounty Board", R = "bounties", ut = "postPublishChat", lt = "postResultChat", dt = "publicDocumentLinks", A = `modules/${p}/templates`, l = Object.freeze({
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
}), P = Object.freeze(["Low", "Moderate", "High", "Severe", "Extreme"]), $t = Object.freeze([
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
  status: l.AVAILABLE,
  image: "",
  createdAt: "",
  updatedAt: "",
  published: !1,
  claimedBy: "",
  notesGM: "",
  notesPublic: "",
  linkedJournalId: "",
  linkedSceneId: ""
});
function Vt(e = {}) {
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
  const n = Vt(e), a = await renderTemplate(`${A}/bounty-chat-card.hbs`, {
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
function qt(e) {
  return foundry.utils.deepClone ? foundry.utils.deepClone(e) : foundry.utils.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? null));
}
function $() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function C(e = "change bounty data") {
  var t, n, a;
  return (t = game.user) != null && t.isGM ? !0 : ((a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, `Only a GM can ${e}.`), !1);
}
function u(e, t = "") {
  return String(e ?? t).trim();
}
function Ft(e) {
  return Array.isArray(e) ? e.map((t) => u(t)).filter(Boolean) : u(e).split(",").map((t) => t.trim()).filter(Boolean);
}
function M(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function Ut(e, t = l.AVAILABLE) {
  return Object.values(l).includes(e) ? e : t;
}
function xt(e) {
  const t = u(e, "Moderate");
  return P.includes(t) ? t : "Moderate";
}
function zt(e) {
  const t = Number(e);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function gt(e) {
  return O[e] ?? O[l.AVAILABLE];
}
function Jt(e) {
  const t = Number((e == null ? void 0 : e.rewardAmount) ?? 0), n = (e == null ? void 0 : e.rewardCurrency) || "credits";
  return `${t.toLocaleString()} ${n}`;
}
function h(e = {}) {
  const t = $(), n = u(e.id) || `bounty-${foundry.utils.randomID(12)}`, a = u(e.createdAt) || t, r = Ut(e.status);
  return {
    ...qt(jt),
    id: n,
    title: u(e.title, "Untitled Bounty"),
    targetName: u(e.targetName),
    description: u(e.description),
    longDescription: u(e.longDescription),
    rewardAmount: zt(e.rewardAmount),
    rewardCurrency: u(e.rewardCurrency, "credits") || "credits",
    threatLevel: xt(e.threatLevel),
    faction: u(e.faction),
    location: u(e.location),
    tags: Ft(e.tags),
    status: r,
    image: u(e.image),
    createdAt: a,
    updatedAt: u(e.updatedAt) || a,
    published: e.published === !0,
    claimedBy: u(e.claimedBy),
    notesGM: u(e.notesGM),
    notesPublic: u(e.notesPublic),
    linkedJournalId: u(e.linkedJournalId),
    linkedSceneId: u(e.linkedSceneId)
  };
}
function Wt(e) {
  var d, b, U, x, z;
  const t = h(e), n = t.linkedJournalId ? ((d = game.journal) == null ? void 0 : d.get(t.linkedJournalId)) ?? null : null, a = t.linkedSceneId ? ((b = game.scenes) == null ? void 0 : b.get(t.linkedSceneId)) ?? null : null, r = game.settings.get(p, dt) === !0, i = game.user, s = !!(n && (i != null && i.isGM || r || (U = n.testUserPermission) != null && U.call(n, i, "OBSERVER"))), o = !!(a && (i != null && i.isGM || r || (x = a.testUserPermission) != null && x.call(a, i, "OBSERVER")));
  return {
    ...t,
    statusLabel: gt(t.status),
    rewardLabel: Jt(t),
    tagsText: t.tags.join(", "),
    hasImage: !!t.image,
    isVisibleToPlayers: ft(t),
    linkedJournalName: (n == null ? void 0 : n.name) ?? "",
    linkedSceneName: (a == null ? void 0 : a.name) ?? "",
    canSeeJournal: s,
    canSeeScene: o,
    canEdit: ((z = game.user) == null ? void 0 : z.isGM) === !0
  };
}
function ft(e) {
  const t = h(e);
  return t.published && ![l.HIDDEN, l.ARCHIVED].includes(t.status);
}
function B() {
  const e = game.settings.get(p, R);
  return e ? Array.isArray(e) ? Object.fromEntries(e.map(h).map((t) => [t.id, t])) : typeof e == "object" ? Object.fromEntries(Object.values(e).map(h).map((t) => [t.id, t])) : (console.warn(`${p} | Ignoring invalid bounty setting payload.`, e), {}) : {};
}
async function j(e) {
  return C("save bounties") ? (await game.settings.set(p, R, e ?? {}), e) : B();
}
function V({ includeHidden: e = ((t) => (t = game.user) == null ? void 0 : t.isGM)() === !0 } = {}) {
  const n = Object.values(B()).map(h);
  return (e ? n : n.filter(ft)).sort((r, i) => String(i.updatedAt).localeCompare(String(r.updatedAt)));
}
function E(e) {
  const t = B()[e];
  return t ? h(t) : null;
}
function Yt(e) {
  const t = [];
  return u(e.title) || t.push("Title is required."), u(e.targetName) || t.push("Target name is required."), u(e.rewardCurrency) || t.push("Reward currency is required."), u(e.threatLevel) || t.push("Threat level is required."), t;
}
async function q(e) {
  var s, o;
  if (!C("create or edit bounties")) return null;
  const t = e.id ? E(e.id) : null, n = $(), a = h({
    ...t,
    ...e,
    id: (t == null ? void 0 : t.id) || e.id || `bounty-${foundry.utils.randomID(12)}`,
    createdAt: (t == null ? void 0 : t.createdAt) || n,
    updatedAt: n
  }), r = Yt(a);
  if (r.length)
    return (o = (s = ui.notifications) == null ? void 0 : s.error) == null || o.call(s, r.join(" ")), null;
  const i = B();
  return i[a.id] = a, await j(i), a;
}
async function pt(e) {
  if (!C("delete bounties") || !await Dialog.confirm({
    title: "Delete Bounty",
    content: "<p>Permanently delete this bounty from world data?</p>"
  })) return !1;
  const n = B();
  return delete n[e], await j(n), !0;
}
async function v(e, t = {}, { chat: n = !1 } = {}) {
  var i, s;
  if (!C("update bounty status")) return null;
  const a = E(e);
  if (!a)
    return (s = (i = ui.notifications) == null ? void 0 : i.warn) == null || s.call(i, "Bounty not found."), null;
  const r = await q({ ...a, ...t });
  return r ? (n && await G(r, t.status === l.AVAILABLE ? "published" : "result"), r) : null;
}
async function k(e, t = !0) {
  const n = await v(e, {
    published: t,
    status: t ? l.AVAILABLE : l.HIDDEN
  });
  return n && t && game.settings.get(p, ut) && await G(n, "published"), n;
}
async function W(e, t = !1) {
  const n = t ? l.FAILED : l.COMPLETED, a = await v(e, { status: n });
  return a && game.settings.get(p, lt) && await G(a, "result"), a;
}
async function mt(e) {
  return v(e, { status: l.ARCHIVED, published: !1 });
}
async function ht(e, t) {
  return v(e, { status: l.CLAIMED, claimedBy: u(t) });
}
function _t() {
  const e = V({ includeHidden: !0 }), t = (n) => [...new Set(n.map(u).filter(Boolean))].sort((a, r) => a.localeCompare(r));
  return {
    statuses: Object.values(l).map((n) => ({ value: n, label: gt(n) })),
    threatLevels: P,
    factions: t(e.map((n) => n.faction)),
    tags: t([...$t, ...e.flatMap((n) => n.tags)])
  };
}
function Y(e, t = {}) {
  const n = u(t.status), a = u(t.threatLevel), r = u(t.faction).toLowerCase(), i = u(t.tag).toLowerCase(), s = u(t.search).toLowerCase();
  return e.filter((o) => {
    const d = h(o);
    return !(n && d.status !== n || a && d.threatLevel !== a || r && d.faction.toLowerCase() !== r || i && !d.tags.some((b) => b.toLowerCase() === i) || s && ![
      d.title,
      d.targetName,
      d.description,
      d.longDescription,
      d.faction,
      d.location,
      d.tags.join(" ")
    ].join(" ").toLowerCase().includes(s));
  });
}
async function Kt(e) {
  var r, i, s;
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
  }), (s = (i = ui.notifications) == null ? void 0 : i.info) == null || s.call(i, "Contract request sent to the GM.");
}
async function Qt() {
  var r, i;
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
  ], n = B(), a = [];
  for (const s of t) {
    const o = h({ ...s, id: `sample-${foundry.utils.randomID(8)}` });
    n[o.id] = o, a.push(o);
  }
  return await j(n), (i = (r = ui.notifications) == null ? void 0 : r.info) == null || i.call(r, `${ct}: seeded ${a.length} sample bounties.`), a;
}
function Xt() {
  game.settings.register(p, R, {
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(p, ut, {
    name: "Post Chat Card When Publishing",
    hint: "Automatically post a contract card when the GM publishes a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(p, lt, {
    name: "Post Chat Card When Resolved",
    hint: "Automatically post a result card when the GM completes or fails a bounty.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(p, dt, {
    name: "Show Linked Documents To Players",
    hint: "Allow player-visible bounty cards to show linked scene and journal buttons when the bounty is published.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  });
}
var tt, et;
const _ = ((et = (tt = foundry.applications) == null ? void 0 : tt.api) == null ? void 0 : et.ApplicationV2) ?? Application;
var nt, at;
const K = (at = (nt = foundry.applications) == null ? void 0 : nt.api) == null ? void 0 : at.HandlebarsApplicationMixin, Zt = K ? K(_) : _;
function Q(e) {
  return ((e == null ? void 0 : e.contents) ?? []).map((t) => ({ id: t.id, name: t.name }));
}
function te(e) {
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
    linkedJournalId: String(t.get("linkedJournalId") ?? ""),
    linkedSceneId: String(t.get("linkedSceneId") ?? "")
  };
}
var S, yt, bt;
const w = class w extends Zt {
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
      threatLevels: P,
      journals: Q(game.journal),
      scenes: Q(game.scenes),
      canEdit: ((a = game.user) == null ? void 0 : a.isGM) === !0
    };
  }
  _onRender(t, n) {
    var r, i;
    (r = super._onRender) == null || r.call(this, t, n), (i = this.element.querySelector("[name='title']")) == null || i.focus();
  }
};
S = new WeakSet(), yt = async function(t, n, a) {
  var i, s, o;
  if (t.preventDefault(), !((i = game.user) != null && i.isGM)) {
    (o = (s = ui.notifications) == null ? void 0 : s.warn) == null || o.call(s, "Only a GM can edit bounties.");
    return;
  }
  await q(te(n)) && ne();
}, bt = function(t) {
  t.preventDefault();
  const n = this.element.querySelector("[name='image']");
  n && new FilePicker({
    type: "image",
    current: n.value,
    callback: (a) => {
      n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 }));
    }
  }).browse();
}, D(w, S), I(w, "DEFAULT_OPTIONS", {
  id: "bounty-editor-app",
  tag: "form",
  form: {
    handler: g(w, S, yt),
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
    browseImage: g(w, S, bt)
  }
}), I(w, "PARTS", {
  editor: {
    template: `${A}/bounty-editor.hbs`
  }
});
let T = w;
var rt, it;
const X = ((it = (rt = foundry.applications) == null ? void 0 : rt.api) == null ? void 0 : it.ApplicationV2) ?? Application;
var st, ot;
const Z = (ot = (st = foundry.applications) == null ? void 0 : st.api) == null ? void 0 : ot.HandlebarsApplicationMixin, ee = Z ? Z(X) : X;
let y = null;
function m(e) {
  var t;
  return (t = e.target.closest("[data-bounty-id]")) == null ? void 0 : t.dataset.bountyId;
}
var L, H, c, wt, At, St, Bt, It, Lt, Ct, Et, vt, Dt, Tt, Mt, Ot, kt, Nt;
const f = class f extends ee {
  constructor(n = {}) {
    super(n);
    D(this, L);
    this.filters = {
      status: "",
      threatLevel: "",
      faction: "",
      tag: "",
      search: ""
    }, this.expanded = /* @__PURE__ */ new Set();
  }
  async _prepareContext(n) {
    var i;
    const a = ((i = game.user) == null ? void 0 : i.isGM) === !0, r = V({ includeHidden: a }).map(Wt).map((s) => ({ ...s, expanded: this.expanded.has(s.id) }));
    return {
      isGM: a,
      filters: this.filters,
      options: _t(),
      bounties: Y(r, this.filters),
      totalCount: r.length,
      visibleCount: Y(r, this.filters).length
    };
  }
  _onRender(n, a) {
    var i;
    (i = super._onRender) == null || i.call(this, n, a);
    const r = this.element;
    r.querySelectorAll("[data-filter]").forEach((s) => {
      s.addEventListener("change", () => g(this, L, H).call(this, s)), s.addEventListener("input", () => g(this, L, H).call(this, s));
    }), r.querySelectorAll("[data-bounty-toggle]").forEach((s) => {
      s.addEventListener("click", () => {
        const o = s.dataset.bountyToggle;
        this.expanded.has(o) ? this.expanded.delete(o) : this.expanded.add(o), this.render({ force: !0 });
      });
    });
  }
  async close(n = {}) {
    return y === this && (y = null), super.close(n);
  }
};
L = new WeakSet(), H = function(n) {
  this.filters[n.dataset.filter] = n.value, this.render({ force: !0 });
}, c = new WeakSet(), wt = function() {
  new T().render({ force: !0 });
}, At = function(n) {
  const a = m(n);
  a && new T({ bountyId: a }).render({ force: !0 });
}, St = async function(n) {
  const a = m(n);
  a && await pt(a) && this.render({ force: !0 });
}, Bt = async function(n) {
  const a = m(n);
  a && (await k(a, !0), this.render({ force: !0 }));
}, It = async function(n) {
  const a = m(n);
  a && (await k(a, !1), this.render({ force: !0 }));
}, Lt = async function(n) {
  const a = m(n);
  a && (await mt(a), this.render({ force: !0 }));
}, Ct = async function(n) {
  const a = m(n);
  a && (await W(a, !1), this.render({ force: !0 }));
}, Et = async function(n) {
  const a = m(n);
  a && (await W(a, !0), this.render({ force: !0 }));
}, vt = async function(n) {
  const a = m(n);
  a && (await v(a, { status: l.HIDDEN, published: !1 }), this.render({ force: !0 }));
}, Dt = async function(n) {
  var i, s;
  const a = m(n), r = ((s = (i = n.target.closest("[data-bounty-id]")) == null ? void 0 : i.querySelector("[data-claimed-by]")) == null ? void 0 : s.value) ?? "";
  a && (await ht(a, r), this.render({ force: !0 }));
}, Tt = async function(n) {
  const a = m(n);
  a && await Kt(a);
}, Mt = function(n) {
  var s, o, d, b;
  const a = (s = n.target.closest("[data-image-src]")) == null ? void 0 : s.dataset.imageSrc;
  if (!a) return;
  const r = ((b = (d = (o = n.target.closest("[data-bounty-id]")) == null ? void 0 : o.querySelector(".bb-card-title")) == null ? void 0 : d.textContent) == null ? void 0 : b.trim()) || "Bounty Image";
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
  var r, i, s, o;
  const a = (r = n.target.closest("[data-open-journal]")) == null ? void 0 : r.dataset.openJournal;
  (o = (s = (i = game.journal) == null ? void 0 : i.get(a)) == null ? void 0 : s.sheet) == null || o.render(!0);
}, kt = function(n) {
  var r, i, s, o;
  const a = (r = n.target.closest("[data-open-scene]")) == null ? void 0 : r.dataset.openScene;
  (o = (s = (i = game.scenes) == null ? void 0 : i.get(a)) == null ? void 0 : s.view) == null || o.call(s);
}, Nt = function() {
  this.filters = { status: "", threatLevel: "", faction: "", tag: "", search: "" }, this.render({ force: !0 });
}, D(f, c), I(f, "DEFAULT_OPTIONS", {
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
    editBounty: g(f, c, At),
    deleteBounty: g(f, c, St),
    publishBounty: g(f, c, Bt),
    unpublishBounty: g(f, c, It),
    archiveBounty: g(f, c, Lt),
    completeBounty: g(f, c, Ct),
    failBounty: g(f, c, Et),
    hideBounty: g(f, c, vt),
    claimBounty: g(f, c, Dt),
    requestContract: g(f, c, Tt),
    openImage: g(f, c, Mt),
    openJournal: g(f, c, Ot),
    openScene: g(f, c, kt),
    clearFilters: g(f, c, Nt)
  }
}), I(f, "PARTS", {
  board: {
    template: `${A}/bounty-board.hbs`
  }
});
let N = f;
function F() {
  return y || (y = new N()), y.render({ force: !0 }), y;
}
function ne() {
  y == null || y.render({ force: !0 });
}
function ae(e) {
  var i, s;
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
    o != null && o.tools && !((s = (i = o.tools).some) != null && s.call(i, (d) => d.name === n.name)) && o.tools.push(n);
    return;
  }
  const a = e ?? {}, r = a.tokens ?? a.token ?? Object.values(a)[0];
  !(r != null && r.tools) || r.tools[n.name] || (r.tools[n.name] = { ...n, order: Object.keys(r.tools).length });
}
function Ht() {
  const e = {
    open: F,
    getAllBounties: V,
    getBounty: E,
    upsertBounty: q,
    deleteBounty: pt,
    publishBounty: k,
    archiveBounty: mt,
    claimBounty: ht,
    seedTestData: Qt
    // Future extension hooks:
    // Patreon/premium gating can wrap open() or selected GM actions here.
    // Random bounty generator can call upsertBounty() with generated data.
    // Faction reputation systems can listen for completed/failed state changes.
    // Galaxy map integration can use linkedSceneId/location metadata.
    // HoloCall contact integration can add claimant/contact actions.
    // Security camera and crime scene modules can attach evidence links via notes or future document ids.
  }, t = game.modules.get(p);
  t && (t.api = e), game.scifiSuite ?? (game.scifiSuite = {}), game.scifiSuite.bountyBoard = e;
}
Hooks.once("init", async () => {
  Xt(), Ht(), Handlebars.registerHelper("bbEq", (e, t) => e === t), Handlebars.registerHelper("bbIncludes", (e, t) => Array.isArray(e) && e.includes(t)), Handlebars.registerHelper("bbStatusClass", (e) => `bb-status--${String(e ?? "available").toLowerCase()}`), await loadTemplates([
    `${A}/bounty-card.hbs`,
    `${A}/bounty-board.hbs`,
    `${A}/bounty-editor.hbs`,
    `${A}/bounty-chat-card.hbs`
  ]);
});
Hooks.on("getSceneControlButtons", ae);
Hooks.once("ready", () => {
  var e, t, n;
  Ht(), (n = (t = (e = game.modules.get("holosuite-core")) == null ? void 0 : e.api) == null ? void 0 : t.registerApp) == null || n.call(t, {
    id: p,
    title: ct,
    icon: "fa-solid fa-crosshairs",
    premium: !1,
    description: "Open the sci-fi contract terminal.",
    open: () => F()
  }), console.log(`${p} | Ready. API available at game.scifiSuite.bountyBoard.`);
});
