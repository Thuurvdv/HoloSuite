var mt = Object.defineProperty;
var gt = (i, n, t) => n in i ? mt(i, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[n] = t;
var R = (i, n, t) => gt(i, typeof n != "symbol" ? n + "" : n, t);
const f = "holosuite-loot", fe = "1.2.0", We = "commandV3", Re = "replyV3", $ = (i) => structuredClone(i);
function yt(i, n, t, e = "request") {
  var s, a;
  return t !== i.id || !i.active || !((a = (s = n.flags) == null ? void 0 : s[f]) != null && a[e]) ? null : $(i.getFlag(f, e));
}
class m extends Error {
  constructor(n) {
    super(n), this.code = n;
  }
}
function he(i) {
  const n = (t) => typeof t == "string" && /^[\w-]{1,64}$/.test(t);
  return typeof (i == null ? void 0 : i.tokenUuid) == "string" && /^Scene\.[\w-]{1,64}\.Token\.[\w-]{1,64}$/.test(i.tokenUuid) && ["view", "inspect", "take", "all"].includes(i.action) && (!["inspect", "take"].includes(i.action) || n(i.entryId)) && (i.actorId == null || typeof i.actorId == "string" && /^(?:[\w-]{1,64}|Actor\.[\w-]{1,64}|Scene\.[\w-]{1,64}\.Token\.[\w-]{1,64}(?:\.Actor\.[\w-]{1,64})?)$/.test(i.actorId));
}
function ee(i) {
  var n;
  return i.getFlag(f, "config") ?? ((n = i.actor) == null ? void 0 : n.getFlag(f, "config")) ?? { mode: "automatic", source: "inventory" };
}
const D = (i) => (i == null ? void 0 : i.uuid) ?? (i == null ? void 0 : i.id), te = (i) => JSON.stringify(i, (n, t) => t && typeof t == "object" && !Array.isArray(t) ? Object.fromEntries(Object.entries(t).sort(([e], [s]) => e.localeCompare(s))) : t);
function X(i, n, t, e = void 0) {
  return !i || !t.destination(i) || !i.testUserPermission(n, "OWNER") ? !1 : !t.manual || !e || D(i) !== D(e.actor) && (i.isToken || i.id !== e.actorId);
}
function ke(i, n, t, e, s = void 0) {
  const a = (r) => X(r, i, e, s);
  if (a(i.character)) return i.character;
  const c = [...new Map(Array.from(t ?? []).map((r) => r.actor).filter(a).map((r) => [D(r), r])).values()];
  if (c.length === 1) return c[0];
  if (c.length > 1) throw new m("AmbiguousActor");
  const o = Array.from(n ?? []).filter(a);
  if (o.length === 1) return o[0];
  throw new m(o.length ? "AmbiguousActor" : "NoActor");
}
function ne(i, { combats: n = [], zeroHP: t = !1, automatic: e = !0, manual: s = !1 } = {}) {
  var r, l, u, d, v, p;
  if (!(i != null && i.actor) || (s ? !i.actor.items : i.actor.type !== "npc")) return !1;
  if (s) return ((r = i.getFlag(f, "config")) == null ? void 0 : r.mode) === "enabled";
  const a = ee(i);
  if (a.mode === "disabled") return !1;
  if (a.mode === "enabled") return !0;
  if (!e) return !1;
  if (n.some((S) => {
    var I;
    return (I = S.combatants) == null ? void 0 : I.some((y) => {
      var C, L;
      return y.tokenId === i.id && (y.sceneId ?? ((C = S.scene) == null ? void 0 : C.id)) === ((L = i.parent) == null ? void 0 : L.id) && (y.isDefeated || y.defeated);
    });
  })) return !0;
  const c = i.actor.statuses;
  if (c != null && c.has("dead")) return !0;
  const o = (u = (l = i.actor.system) == null ? void 0 : l.attributes) == null ? void 0 : u.hp;
  return t && Number(o == null ? void 0 : o.max) > 0 && (o == null ? void 0 : o.value) === 0 && !((p = (v = (d = i.actor.system) == null ? void 0 : d.attributes) == null ? void 0 : v.death) != null && p.success);
}
function pt(i, n, t, e = void 0) {
  var a, c, o;
  if (!(n != null && n.active) || !ne(i, t)) throw new m("Unavailable");
  if (n.isGM) return;
  const s = ((a = i.parent) == null ? void 0 : a.active) || ((c = i.parent) == null ? void 0 : c.testUserPermission(n, "LIMITED"));
  if (i.hidden || n.viewedScene !== ((o = i.parent) == null ? void 0 : o.id) || !s || !t.visible(i, n))
    throw new m("AccessDenied");
  if (t.inRange && !t.inRange(i, n, e)) throw new m("OutOfRange");
}
function Ge(i, n, t, e = void 0) {
  if (!X(i, n, t, e))
    throw new m("ActorDenied");
}
class ye {
  constructor() {
    R(this, "tails", /* @__PURE__ */ new Map());
  }
  async run(n, t) {
    const s = (this.tails.get(n) ?? Promise.resolve()).catch(() => {
    }).then(t);
    this.tails.set(n, s);
    try {
      return await s;
    } finally {
      this.tails.get(n) === s && this.tails.delete(n);
    }
  }
}
const Le = new ye(), Ce = ["cp", "sp", "ep", "gp", "pp"], K = (i, n) => {
  var t, e;
  return (e = (t = i == null ? void 0 : i.system) == null ? void 0 : t.currency) == null ? void 0 : e[n];
}, V = (i) => Number.isSafeInteger(i) && i >= 0, qe = (i) => `${i.currency.unit}:${i.currency.amount}`, ie = (i, n, t, e = !1) => {
  var s, a;
  return ((a = (s = i.getFlag) == null ? void 0 : s.call(i, f, e ? "currencyDebits" : "currencyReceipts")) == null ? void 0 : a[t.id]) === qe(n);
}, Q = {
  entries(i) {
    return Ce.filter((n) => V(K(i, n)) && K(i, n) > 0).map((n) => {
      var a, c, o, r, l;
      const t = K(i, n), e = (o = (c = (a = globalThis.CONFIG) == null ? void 0 : a.DND5E) == null ? void 0 : c.currencies) == null ? void 0 : o[n], s = typeof e == "string" ? e : e == null ? void 0 : e.label;
      return { currency: { storage: "balance", unit: n, amount: t }, data: {
        name: s ? ((l = (r = globalThis.game) == null ? void 0 : r.i18n) == null ? void 0 : l.localize(s)) ?? s : n.toUpperCase(),
        type: "currency",
        img: "icons/svg/coins.svg",
        system: { quantity: t }
      } };
    });
  },
  received: ie,
  async grant(i, n, t, e) {
    return Le.run(D(i), async () => {
      if (ie(i, n, t)) return;
      if (t.currencyAttempted) throw new m("RecoveryRequired");
      if (!e) throw new m("RecoveryRequired");
      await e();
      const { unit: s, amount: a } = n.currency, c = K(i, s);
      if (!Ce.includes(s) || !V(a) || !a || !V(c) || !V(c + a)) throw new m("CurrencyChanged");
      if (await i.update({
        [`system.currency.${s}`]: c + a,
        [`flags.${f}.currencyReceipts.${t.id}`]: qe(n)
      }), !ie(i, n, t)) throw new m("TransferFailed");
    });
  },
  sourcePlan(i, n) {
    const { unit: t, amount: e } = n.currency, s = K(i.actor, t);
    if (!Ce.includes(t) || !V(s) || !V(e) || e <= 0 || s < e) throw new m("CurrencyChanged");
    return { currency: t, before: s, after: s - e };
  },
  async debit(i, n, t) {
    return Le.run(D(i.actor), async () => {
      const e = i.actor;
      if (ie(e, n, t, !0)) return;
      const s = t.source;
      if (K(e, s.currency) !== s.before) throw new m("CurrencyChanged");
      if (await e.update({
        [`system.currency.${s.currency}`]: s.after,
        [`flags.${f}.currencyDebits.${t.id}`]: qe(n)
      }), !ie(e, n, t, !0)) throw new m("CurrencyChanged");
    });
  },
  async cleanup(i, n, t, e) {
    for (const [s, a] of [[n, "currencyReceipts"], [i.actor, "currencyDebits"]])
      try {
        await Le.run(D(s), () => s.update({ [`flags.${f}.${a}.-=${e.id}`]: null }));
      } catch (c) {
        console.warn("HoloSuite Loot | Could not clean committed currency receipt", c);
      }
  }
};
function Fe(i) {
  var t;
  const n = $(i.toObject());
  delete n._id, delete n.folder, delete n.ownership, delete n._stats, (t = n.flags) == null || delete t[f];
  for (const e of n.effects ?? [])
    delete e._id, e.origin = null;
  return n;
}
async function me(i) {
  if (i.actorLink && await i.update({ actorLink: !1 }), i.actorLink) throw new m("SourceChanged");
}
class Xe {
  constructor() {
    R(this, "manual", !1);
  }
  received(n, t, e) {
    var s;
    return ((s = n.items.get(e.itemId)) == null ? void 0 : s.getFlag(f, "claim")) === e.id;
  }
  async create(n, t, e) {
    const s = n.items.get(e.itemId);
    if (s) {
      if (s.getFlag(f, "claim") !== e.id) throw new m("RecoveryRequired");
      return s;
    }
    const a = $(t.data);
    a._id = e.itemId, a.flags ?? (a.flags = {}), a.flags[f] = { claim: e.id };
    const [c] = await n.createEmbeddedDocuments("Item", [a], { keepId: !0 });
    if (!c || (this.manual ? !this.received(n, t, e) : c.id !== e.itemId))
      throw new m("TransferFailed");
    return c;
  }
}
class Ae extends Xe {
  constructor() {
    super(...arguments);
    R(this, "id", "dnd5e");
  }
  currencyEntries(t) {
    return Q.entries(t);
  }
  received(t, e, s) {
    var a;
    return ((a = e.currency) == null ? void 0 : a.storage) === "balance" ? Q.received(t, e, s) : super.received(t, e, s);
  }
  async cleanup(t, e, s, a) {
    var c;
    ((c = s.currency) == null ? void 0 : c.storage) === "balance" && await Q.cleanup(t, e, s, a);
  }
  destination(t) {
    return t.type === "character";
  }
  eligible(t) {
    var r, l, u, d, v;
    const e = t.system, s = (r = e == null ? void 0 : e.constructor) == null ? void 0 : r.metadata;
    if (!["weapon", "equipment", "consumable", "tool", "loot", "container"].includes(t.type) || (s == null ? void 0 : s.inventoryItem) === !1) return !1;
    const c = (u = (l = e == null ? void 0 : e.schema) == null ? void 0 : l.getField) == null ? void 0 : u.call(l, "quantity");
    if (e != null && e.schema && !c || !Number.isSafeInteger(e == null ? void 0 : e.quantity) || e.quantity <= 0) return !1;
    const o = ((d = e.type) == null ? void 0 : d.value) ?? e.weaponType ?? ((v = e.armor) == null ? void 0 : v.type);
    return !["natural", "siege", "vehicle", "currency"].includes(o);
  }
  snapshot(t) {
    const e = Fe(t);
    return e.system.container = null, "equipped" in e.system && (e.system.equipped = !1), "attuned" in e.system && (e.system.attuned = !1), e.system.attunement === 2 && (e.system.attunement = 1), e;
  }
  async create(t, e, s, a) {
    var c;
    return ((c = e.currency) == null ? void 0 : c.storage) === "balance" ? Q.grant(t, e, s, a) : super.create(t, e, s);
  }
  preview(t) {
    var s, a;
    const e = $(t.data);
    return e.system.identified !== !1 ? e : {
      name: ((s = e.system.unidentified) == null ? void 0 : s.name) || "Unidentified Item",
      img: e.img,
      type: "loot",
      system: { quantity: e.system.quantity, identified: !1, description: { value: ((a = e.system.unidentified) == null ? void 0 : a.description) ?? "" } }
    };
  }
  async sourceClaim(t, e) {
    var c, o, r, l, u;
    if (!((c = e.source) != null && c.itemId) && ((o = e.currency) == null ? void 0 : o.storage) !== "balance") return null;
    if ((r = e.source) != null && r.ruleKey && e.source.ruleKey !== `${t.actorId ?? ((l = t.actor) == null ? void 0 : l.id) ?? ""}:${e.source.itemId}`)
      throw new m("SourceChanged");
    if (await me(t), ((u = e.currency) == null ? void 0 : u.storage) === "balance") return Q.sourcePlan(t, e);
    const s = t.actor.items.get(e.source.itemId), a = s == null ? void 0 : s.system.quantity;
    if (!this.eligible(s ?? {}) || a < e.data.system.quantity || e.source.ruleKey && s.type !== e.data.type) throw new m("SourceChanged");
    return { itemId: s.id, before: a, after: a - e.data.system.quantity };
  }
  validateSourcePlan(t, e, s) {
    var o, r, l, u;
    if (!((o = e.source) != null && o.ruleKey)) return;
    const a = (l = t.actor) == null ? void 0 : l.items.get((r = s.source) == null ? void 0 : r.itemId);
    if (t.actorLink || e.source.ruleKey !== `${t.actorId ?? ((u = t.actor) == null ? void 0 : u.id) ?? ""}:${a == null ? void 0 : a.id}` || !this.eligible(a ?? {}) || a.type !== e.data.type || a.system.quantity !== s.source.before)
      throw new m("SourceChanged");
    const c = s.source.sfCurrency;
    if (c) {
      const d = this.entryMetadata(a).currency;
      if ((d == null ? void 0 : d.unit) !== c.unit || (d == null ? void 0 : d.amount) !== c.amount) throw new m("CurrencyChanged");
    }
  }
  async removeSource(t, e, s) {
    const a = s.source;
    if (!a) return;
    if (await me(t), a.currency) return Q.debit(t, e, s);
    const c = t.actor.items.get(a.itemId);
    if (!c || c.getFlag(f, "sourceClaim") === s.id) return;
    if (c.system.quantity !== a.before) throw new m("SourceChanged");
    a.after === 0 ? await t.actor.deleteEmbeddedDocuments("Item", [c.id]) : await c.update({ "system.quantity": a.after, [`flags.${f}.sourceClaim`]: s.id });
    const o = t.actor.items.get(a.itemId);
    if (a.after === 0 ? o : (o == null ? void 0 : o.system.quantity) !== a.after || (o == null ? void 0 : o.getFlag(f, "sourceClaim")) !== s.id) throw new m("SourceChanged");
  }
}
class wt extends Ae {
  constructor() {
    super(...arguments);
    R(this, "id", "sf2e");
  }
  currencyEntries() {
    return [];
  }
  eligible(t) {
    var s, a;
    return ["ammo", "armor", "backpack", "book", "consumable", "equipment", "shield", "treasure", "weapon"].includes(t.type) && (t.isOfType ? t.isOfType("physical") : !0) && !(t.type === "weapon" && ((s = t.system) == null ? void 0 : s.category) === "unarmed") && Number.isSafeInteger((a = t.system) == null ? void 0 : a.quantity) && t.system.quantity > 0;
  }
  snapshot(t) {
    var s, a, c, o, r;
    const e = $(t.toObject());
    delete e._id, delete e.folder, delete e.ownership, delete e._stats, (s = e.flags) == null || delete s[f], (c = (a = e.flags) == null ? void 0 : a.pf2e) == null || delete c.grantedBy, (r = (o = e.flags) == null ? void 0 : o.pf2e) == null || delete r.itemGrants, e.system.containerId = null, e.system.description && delete e.system.description.gm, e.system.equipped && (e.system.equipped = { carryType: "stowed", handsHeld: 0, invested: !1 });
    for (const l of e.effects ?? [])
      delete l._id, l.origin = null;
    return e;
  }
  entryMetadata(t, e = ((s) => (s = t.system) == null ? void 0 : s.quantity)()) {
    var r, l, u, d;
    const a = t.isCurrency ? t.unit : null, c = a ? t.assetValue : null, o = e === ((r = t.system) == null ? void 0 : r.quantity) ? c == null ? void 0 : c[a] : (d = (u = c == null ? void 0 : (l = c.constructor).fromPrice) == null ? void 0 : u.call(l, t.price, e)) == null ? void 0 : d[a];
    return a && Number.isSafeInteger(o) && o > 0 ? { currency: { storage: "item", unit: a, amount: o } } : {};
  }
  async sourceClaim(t, e) {
    var r;
    const s = await super.sourceClaim(t, e);
    if (((r = e.currency) == null ? void 0 : r.storage) !== "item") return s;
    const a = t.actor.items.get(e.source.itemId), c = this.entryMetadata(a).currency, o = this.entryMetadata(a, e.data.system.quantity).currency;
    if ((o == null ? void 0 : o.unit) !== e.currency.unit || (o == null ? void 0 : o.amount) !== e.currency.amount || !e.source.ruleKey && a.system.quantity !== e.data.system.quantity) throw new m("CurrencyChanged");
    return { ...s, sfCurrency: { unit: c.unit, amount: c.amount } };
  }
  async removeSource(t, e, s) {
    var c;
    const a = (c = s.source) != null && c.itemId ? t.actor.items.get(s.source.itemId) : null;
    if (a && s.source.sfCurrency) {
      const o = this.entryMetadata(a).currency;
      if ((o == null ? void 0 : o.unit) !== s.source.sfCurrency.unit || (o == null ? void 0 : o.amount) !== s.source.sfCurrency.amount) throw new m("CurrencyChanged");
    }
    return super.removeSource(t, e, s);
  }
  preview(t) {
    var a, c, o, r;
    const e = $(t.data);
    if (((a = e.system.identification) == null ? void 0 : a.status) === "identified") return e;
    const s = (c = e.system.identification) == null ? void 0 : c.unidentified;
    return {
      name: (s == null ? void 0 : s.name) || "Unidentified Item",
      img: (s == null ? void 0 : s.img) || e.img,
      type: "equipment",
      system: { quantity: e.system.quantity, description: { value: ((r = (o = s == null ? void 0 : s.data) == null ? void 0 : o.description) == null ? void 0 : r.value) ?? "" } }
    };
  }
}
class vt extends Xe {
  constructor() {
    super(...arguments);
    R(this, "manual", !0);
  }
  destination(t) {
    return !!t.items && typeof t.createEmbeddedDocuments == "function";
  }
  eligible(t) {
    return !!(t != null && t.id) && typeof t.toObject == "function";
  }
  snapshot(t) {
    return Fe(t);
  }
  preview(t) {
    var a, c, o, r, l, u;
    const { data: e } = t;
    if (((a = e.system) == null ? void 0 : a.identified) !== !1 && ((o = (c = e.system) == null ? void 0 : c.identification) == null ? void 0 : o.status) !== "unidentified") return $(e);
    const s = ((r = e.system) == null ? void 0 : r.unidentified) ?? ((u = (l = e.system) == null ? void 0 : l.identification) == null ? void 0 : u.unidentified);
    return { name: (s == null ? void 0 : s.name) || "Unidentified Item", type: e.type, img: (s == null ? void 0 : s.img) || e.img };
  }
  received(t, e, s) {
    return super.received(t, e, s) || t.items.some((a) => a.getFlag(f, "claim") === s.id);
  }
  async create(t, e, s, a) {
    if (s.itemAttempted || !a) throw new m("RecoveryRequired");
    return await a(), super.create(t, e, s);
  }
  async sourceClaim(t, e) {
    var a;
    await me(t);
    const s = { itemId: (a = e.source) == null ? void 0 : a.itemId };
    return this.validateSourcePlan(t, e, { source: s }), s;
  }
  validateSourcePlan(t, e, s) {
    var o, r, l, u, d;
    const a = (o = s.source) == null ? void 0 : o.itemId, c = (r = t.actor) == null ? void 0 : r.items.get(a);
    if (t.actorLink || !e.wholeItem || a !== ((l = e.source) == null ? void 0 : l.itemId) || ((u = e.source) == null ? void 0 : u.ruleKey) !== `${t.actorId ?? ((d = t.actor) == null ? void 0 : d.id) ?? ""}:${a}` || !this.eligible(c) || te(this.snapshot(c)) !== te(e.data))
      throw new m("SourceChanged");
  }
  async removeSource(t, e, s) {
    var c, o, r;
    await me(t);
    const a = (c = s.source) == null ? void 0 : c.itemId;
    if (!a || !e.wholeItem || ((o = e.source) == null ? void 0 : o.ruleKey) !== `${t.actorId ?? ((r = t.actor) == null ? void 0 : r.id) ?? ""}:${a}`)
      throw new m("RecoveryRequired");
    if (t.actor.items.get(a) && (this.validateSourcePlan(t, e, s), await t.actor.deleteEmbeddedDocuments("Item", [a]), t.actor.items.get(a)))
      throw new m("SourceChanged");
  }
}
const J = new vt();
class bt extends Ae {
  constructor() {
    super(...arguments);
    R(this, "id", "swade");
  }
  currencyEntries() {
    return [];
  }
  allowsStoredItem(t) {
    var e;
    return ["weapon", "armor", "shield", "gear", "consumable"].includes(t == null ? void 0 : t.type) && t.isPhysicalItem !== !1 && !t.grantedBy && !((e = t.system) != null && e.isNaturalArmor);
  }
  eligible(t) {
    var e;
    return this.allowsStoredItem(t) && Number.isSafeInteger((e = t.system) == null ? void 0 : e.quantity) && t.system.quantity > 0;
  }
  snapshot(t) {
    return this.carriedData(Fe(t));
  }
  carriedData(t) {
    var e, s;
    return "equipStatus" in t.system && (t.system.equipStatus = 1), (s = (e = t.flags) == null ? void 0 : e.swade) == null || delete s.hasGranted, t;
  }
  preview(t) {
    return $(t.data);
  }
  received(t, e, s) {
    return e.wholeItem ? J.received(t, e, s) : super.received(t, e, s);
  }
  async create(t, e, s, a) {
    return e.wholeItem ? J.create(t, { ...e, data: this.carriedData($(e.data)) }, s, a) : super.create(t, e, s, a);
  }
  async sourceClaim(t, e) {
    var s;
    if (!this.eligible(e.data)) throw new m("SourceChanged");
    if (!e.wholeItem) return super.sourceClaim(t, e);
    if (!this.eligible(t.actor.items.get((s = e.source) == null ? void 0 : s.itemId))) throw new m("SourceChanged");
    return J.sourceClaim(t, e);
  }
  validateSourcePlan(t, e, s) {
    var a;
    if (!e.wholeItem) return super.validateSourcePlan(t, e, s);
    if (!this.eligible(t.actor.items.get((a = s.source) == null ? void 0 : a.itemId))) throw new m("SourceChanged");
    return J.validateSourcePlan(t, e, s);
  }
  async removeSource(t, e, s) {
    return e.wholeItem ? J.removeSource(t, e, s) : super.removeSource(t, e, s);
  }
}
const Ye = /* @__PURE__ */ new Map([["dnd5e", new Ae()], ["sf2e", new wt()], ["swade", new bt()]]);
function St(i, n) {
  Ye.set(i, n);
}
function It(i) {
  return Ye.get(i) ?? J;
}
function _e(i) {
  if (!i.claim.quantityRoll) return i;
  const n = $(i.data);
  return n.system.quantity = i.claim.quantityRoll.quantity, { ...i, data: n };
}
class Rt {
  constructor(n) {
    R(this, "queue", new ye());
    this.io = n;
  }
  async collected(n, t, e, s) {
    var c, o, r, l;
    const a = _e(e);
    if (e.claim.quantityRoll) {
      try {
        await ((o = (c = this.io).quantityRolled) == null ? void 0 : o.call(c, a, s));
      } catch (u) {
        console.warn("HoloSuite Loot | Could not post quantity roll", u);
      }
      if (!e.claim.quantityRoll.quantity) return;
    }
    try {
      await ((l = (r = this.io).collected) == null ? void 0 : l.call(r, { token: n, actor: t, entry: a, adapter: s }));
    } catch (u) {
      console.warn("HoloSuite Loot | Could not post loot to chat", u);
    }
  }
  async execute(n, t) {
    if (!he(n)) throw new m("InvalidRequest");
    return this.queue.run(n.tokenUuid, async () => {
      var v, p, S, I, y, C, L, q, b, w;
      const e = this.io, s = await e.token(n.tokenUuid);
      if (!s) throw new m("Unavailable");
      const a = (g, h = e.environment()) => {
        if (!e.authority()) throw new m("NoGM");
        pt(s, t, h, g);
      }, c = e.environment();
      if (a(void 0, c), !t.isGM && c.inRange && (n.action === "view" || n.action === "inspect")) {
        const g = await ((v = e.destination) == null ? void 0 : v.call(e, { ...n, actorId: void 0 }, t, s));
        g && a(g);
      }
      const o = e.adapter();
      if (!o) throw new m("Unsupported");
      let r = await e.load(s, o);
      for (const g of r.entries.filter((h) => h.claim && !h.taken)) {
        a();
        const h = await e.actor(g.claim.actorId);
        if (!h) throw new m("RecoveryRequired");
        if (((p = g.claim.quantityRoll) == null ? void 0 : p.quantity) === 0 || (o.received ? o.received(h, g, g.claim) : ((S = h.items.get(g.claim.itemId)) == null ? void 0 : S.getFlag(e.moduleId, "claim")) === g.claim.id)) {
          await ((I = o.removeSource) == null ? void 0 : I.call(o, s, g, g.claim));
          const T = $(r);
          T.entries.find((O) => O.id === g.id).taken = !0, await e.save(s, T), r = T, await this.collected(s, h, g, o), await ((y = o.cleanup) == null ? void 0 : y.call(o, s, h, g, g.claim));
        }
      }
      if (n.action === "view") return e.summary(s, r);
      if (n.action === "inspect") {
        const g = r.entries.find((h) => h.id === n.entryId && !h.taken && !h.hidden);
        if (!g || g.currency) throw new m("Unavailable");
        return { item: o.preview ? o.preview(g) : $(g.data) };
      }
      const l = e.destination ? await e.destination(n, t, s) : await e.actor(n.actorId);
      Ge(l, t, o, s), a(l);
      const u = r.entries.filter((g) => !g.taken && !g.hidden && (n.action === "all" || g.id === n.entryId));
      if (!u.length && n.action === "take") return e.summary(s, r);
      const d = [];
      for (const g of u)
        try {
          a(l), Ge(l, t, o, s);
          let h = r.entries.find((T) => T.id === g.id);
          if (h.claim && (h.claim.userId !== t.id || ![l.id, D(l)].includes(h.claim.actorId)))
            throw new m("RecoveryRequired");
          if (!h.claim) {
            const T = await ((C = o.sourceClaim) == null ? void 0 : C.call(o, s, h));
            a(l);
            let O;
            if (h.formula) {
              if (!T || !o.removeSource) throw new m("SourceChanged");
              O = await e.rollQuantity(h.formula), a(l);
            }
            const G = $(r);
            G.entries.find((B) => B.id === h.id).claim = {
              id: e.id(),
              itemId: e.id(),
              userId: t.id,
              actorId: D(l),
              ...O ? { quantityRoll: O } : {},
              ...T ? { source: T } : {}
            }, await e.save(s, G), r = G, h = r.entries.find((B) => B.id === g.id);
          }
          a(l), (L = o.validateSourcePlan) == null || L.call(o, s, h, h.claim), ((q = h.claim.quantityRoll) == null ? void 0 : q.quantity) !== 0 && await o.create(l, _e(h), h.claim, async () => {
            const T = h.wholeItem ? "itemAttempted" : "currencyAttempted", O = $(r);
            O.entries.find((G) => G.id === h.id).claim[T] = !0, await e.save(s, O), r = O, h.claim[T] = !0;
          }), await ((b = o.removeSource) == null ? void 0 : b.call(o, s, h, h.claim));
          const M = $(r);
          M.entries.find((T) => T.id === h.id).taken = !0, await e.save(s, M), r = M, await this.collected(s, l, h, o), await ((w = o.cleanup) == null ? void 0 : w.call(o, s, l, h, h.claim));
        } catch (h) {
          if (d.push({ name: g.data.name, code: h.code ?? "TransferFailed" }), !e.authority()) break;
        }
      return { ...e.summary(s, r), failures: d };
    });
  }
}
const ge = "inventoryRules";
function Lt(i) {
  var t, e, s, a, c;
  const n = /^(?:Item\.[\w-]+|Compendium\.[\w-]+\.[\w-]+\.(?:Item\.)?[\w-]+)$/;
  return (c = [(t = i._stats) == null ? void 0 : t.compendiumSource, (e = i._stats) == null ? void 0 : e.duplicateSource, (a = (s = i.flags) == null ? void 0 : s.core) == null ? void 0 : a.sourceId].find((o) => typeof o == "string" && n.test(o))) == null ? void 0 : c.replace(/^(Compendium\.[^.]+\.[^.]+)\.(?!Item\.)/, "$1.Item.");
}
function j(i, n, t) {
  var e;
  return {
    token: n.id ? `${i.actorId ?? ((e = i.actor) == null ? void 0 : e.id) ?? ""}:${n.id}` : void 0,
    actor: t != null && t.id && t.items.get(n.id) ? `${t.id}:${n.id}` : void 0,
    global: Lt(n)
  };
}
function pe(i, n, t) {
  var e;
  for (const s of ["token", "actor", "global"]) {
    const a = i[s] && ((e = s === "token" ? n : t[s]) == null ? void 0 : e[i[s]]);
    if (a) return { rule: a, scope: s };
  }
  return { rule: { mode: "allow" }, scope: "default" };
}
function we(i, n = "") {
  if (i === "inherit") return null;
  if (i === "allow" || i === "never") return { mode: i };
  if (i !== "quantity" || typeof n != "string" || n.length > 40) throw new m("InvalidRule");
  const t = n.trim().toLowerCase().replace(/\s+/g, "");
  if (/^\d+$/.test(t) && Number.isSafeInteger(Number(t))) return { mode: i, quantity: String(Number(t)) };
  const e = /^(\d{0,3})d([1-9]\d{0,4})(?:[+-]\d{1,6})?$/.exec(t);
  if (e && (e[1] === "" || Number(e[1]) > 0)) return { mode: i, quantity: e[1] ? t : `1${t}` };
  throw new m("InvalidRule");
}
async function Ct(i, n, t) {
  if (i.mode === "never") return 0;
  if (i.mode === "allow") return n;
  const { quantity: e } = we(i.mode, i.quantity), s = /^\d+$/.test(e) ? Number(e) : await t(e);
  if (!Number.isSafeInteger(s)) throw new m("InvalidRule");
  return Math.min(n, Math.max(0, s));
}
const Ze = (i) => (i == null ? void 0 : i.mode) === "quantity" && !/^\d+$/.test(i.quantity);
function je(i, n, t) {
  const e = { ...i };
  for (const s of n)
    t ? e[s] = t : delete e[s];
  return e;
}
function xe() {
  return game.users.contents.filter((i) => {
    var n;
    return i.active && i.isGM && ((n = i.getFlag) == null ? void 0 : n.call(i, f, "transportVersion")) === fe;
  }).sort((i, n) => i.id.localeCompare(n.id))[0];
}
const E = () => {
  var i;
  return ((i = xe()) == null ? void 0 : i.id) === game.user.id;
}, et = "lootRange", tt = 15;
function He() {
  const i = game.settings.get(f, et);
  return Number.isFinite(i) ? Math.max(0, i) : tt;
}
function qt(i, n, t) {
  var e, s, a;
  return ((e = i.getCenterPoint) == null ? void 0 : e.call(i, t)) ?? ((a = (s = i.object) == null ? void 0 : s.getCenterPoint) == null ? void 0 : a.call(s, t)) ?? {
    x: t.x + i.width * (n.sizeX ?? n.size) / 2,
    y: t.y + i.height * (n.sizeY ?? n.size) / 2
  };
}
function ze(i, n) {
  var c;
  const { x: t, y: e } = i._source ?? i, s = { x: t, y: e };
  if (n.isSquare && n.getOffsetRange) {
    const o = i.width * n.size, r = i.height * n.size, [l, u, d, v] = n.getOffsetRange({ ...s, width: o, height: r }), p = [];
    for (let S = l; S < d; S++)
      for (let I = u; I < v; I++) p.push(n.getCenterPoint({ i: S, j: I }));
    if (p.length) return p;
  }
  const a = (c = i.getOccupiedGridSpaceOffsets) == null ? void 0 : c.call(i, { ...s, level: null });
  return a != null && a.length ? a.map(({ i: o, j: r }) => n.getCenterPoint({ i: o, j: r })) : [qt(i, n, s)];
}
function Tt(i, n, t, e, s) {
  var u;
  const a = i.parent, c = a == null ? void 0 : a.grid;
  if (!(c != null && c.measurePath)) return !1;
  const o = (u = c.units) == null ? void 0 : u.trim().toLowerCase().replace(/\.$/, ""), r = /^(m|meters?|metres?)$/.test(o ?? "") ? e * 0.3048 : /^(yd|yards?)$/.test(o ?? "") ? e / 3 : e, l = ze(i, c);
  return Array.from(a.tokens ?? []).some((d) => {
    const v = d.actor;
    return d.id === i.id || d.hidden || !X(v, n, t, i) || s && D(v) !== D(s) ? !1 : ze(d, c).some(({ x: p, y: S }) => l.some((I) => c.measurePath([{ x: p, y: S }, { x: I.x, y: I.y }]).distance <= r + 1e-8));
  });
}
function Mt(i, n) {
  var a, c;
  const t = i.parent;
  if (((a = canvas.scene) == null ? void 0 : a.id) !== t.id) return !1;
  if (!t.tokenVision) return !0;
  const e = i.object;
  if (!e) return !1;
  const s = globalThis.CONFIG;
  return (c = i.hasStatusEffect) != null && c.call(i, s.specialStatusEffects.INVISIBLE) ? !1 : canvas.tokens.placeables.some((o) => {
    var l, u, d, v, p, S, I, y, C, L, q, b, w, g;
    if (o.document.hidden || !((l = o.document.sight) != null && l.enabled) || !((u = o.actor) != null && u.testUserPermission(n, "OWNER")) || (v = (d = o.document).hasStatusEffect) != null && v.call(d, s.specialStatusEffects.BLIND)) return !1;
    let r;
    try {
      const h = o.document.sight, M = ((S = (p = o.document).getVisionOrigin) == null ? void 0 : S.call(p)) ?? { ...o.center, elevation: o.document.elevation };
      if (r = new s.Canvas.visionSourceClass({ object: o, sourceId: `hololoot-${n.id}-${o.id}` }), r.initialize({
        x: M.x,
        y: M.y,
        elevation: M.elevation,
        ...o.document.level != null ? { level: o.document.level } : {},
        rotation: o.document.rotation,
        radius: o.sightRange,
        lightRadius: o.lightPerceptionRange ?? canvas.dimensions.maxR,
        externalRadius: o.externalRadius,
        angle: h.angle,
        visionMode: h.visionMode,
        color: h.color,
        contrast: h.contrast,
        saturation: h.saturation,
        brightness: h.brightness,
        attenuation: h.attenuation
      }), r.isBlinded || !((I = r.los) != null && I.contains(e.center.x, e.center.y))) return !1;
      if ((y = r.shape) != null && y.contains(e.center.x, e.center.y)) return !0;
      const T = (C = canvas.environment) == null ? void 0 : C.globalLightSource;
      return (T ? T.active && ((L = T.shape) == null ? void 0 : L.contains(e.center.x, e.center.y)) : t.globalLight && (t.globalLightThreshold == null || t.darkness <= t.globalLightThreshold)) && ((q = r.light) != null && q.contains(e.center.x, e.center.y)) ? !0 : !!((b = r.light) != null && b.contains(e.center.x, e.center.y)) && !!((g = (w = canvas.effects) == null ? void 0 : w.lightSources) != null && g.some((G) => {
        var B;
        return G.active && ((B = G.shape) == null ? void 0 : B.contains(e.center.x, e.center.y));
      }));
    } catch {
      return !1;
    } finally {
      r == null || r.destroy();
    }
  });
}
function Ft(i) {
  const n = game.settings.get(f, "zeroHP"), t = i ? He() : 0;
  return {
    combats: game.combats.contents,
    automatic: n,
    zeroHP: n,
    manual: !!(i != null && i.manual),
    visible: Mt,
    inRange: t > 0 ? (e, s, a) => Tt(e, s, i, t, a) : void 0
  };
}
const At = new ye(), ve = (i) => game.journal.find((n) => n.getFlag(f, "tokenUuid") === i.uuid && n.getFlag(f, "kind") === "snapshot"), be = () => game.settings.get(f, ge) ?? {}, Se = (i) => {
  var n;
  return (n = game.actors) == null ? void 0 : n.get(i.actorId);
}, it = async (i) => {
  var t, e;
  const n = ((e = (t = globalThis.foundry) == null ? void 0 : t.dice) == null ? void 0 : e.Roll) ?? globalThis.Roll;
  return new n(i).evaluate({ allowInteractive: !1 });
}, ae = (i, n) => {
  var t, e;
  return ((e = (t = i.actor) == null ? void 0 : t.items) == null ? void 0 : e.filter((s) => n.eligible(s))) ?? [];
}, Te = (i) => ee(i).source === "custom", $e = (i) => JSON.parse((i == null ? void 0 : i.getFlag(f, "rules")) ?? "{}"), _ = (i) => `flags.${f}.${i}`, Ee = ({ id: i, hidden: n }) => ({ id: i, taken: !1, ...n ? { hidden: !0 } : {} }), st = (i) => i.mode === "quantity" ? i.quantity : i.mode, Y = (i, n) => i.setFlag(f, "state", {
  ...n,
  entries: n.entries.map((t) => {
    var a;
    if (!((a = t.claim) != null && a.quantityRoll)) return t;
    const { quantityRoll: e, ...s } = t.claim;
    return { ...t, claim: s };
  })
}), nt = (i, n, t) => {
  var e, s;
  return Ze(t) && n.sourceClaim && n.removeSource && !((s = (e = n.entryMetadata) == null ? void 0 : e.call(n, i)) != null && s.currency);
};
async function xt(i) {
  const n = we("quantity", i);
  if (!Ze(n)) throw new m("InvalidRule");
  const t = await it(n.quantity);
  if (!Number.isSafeInteger(t.total)) throw new m("InvalidRule");
  return { quantity: Math.max(0, t.total), roll: t.toJSON() };
}
function at(i, n, t) {
  const e = te(t), s = i.filter((a) => te(n.snapshot(a)) === e);
  return s.length === 1 && s[0].id ? s[0] : void 0;
}
async function Oe(i, n, t, e, { original: s, previousRoll: a, legacyRollCeiling: c, onRoll: o } = {}) {
  var I;
  const r = n.snapshot(i);
  if (n.manual) return { id: foundry.utils.randomID(), data: r, wholeItem: !0, source: { itemId: i.id, ruleKey: t } };
  const l = s ?? r.system.quantity, u = Math.min(l, r.system.quantity), d = a === void 0 && c === void 0 && nt(i, n, e) ? e.quantity : void 0;
  let v, p;
  const S = d ? u : await Ct(e, u, async (y) => {
    if (a === void 0 && c !== void 0)
      return p = c, p;
    if (a !== void 0)
      v = a;
    else {
      const C = await it(y);
      v = C.total, o == null || o(C);
    }
    return v;
  });
  return r.system.quantity = S, {
    id: foundry.utils.randomID(),
    data: r,
    originalQuantity: l,
    limit: st(e),
    hidden: S === 0,
    ...d ? { formula: d } : {},
    ...v === void 0 ? {} : { rolledQuantity: v },
    ...p === void 0 ? {} : { rollCeiling: p },
    ...i.id ? { source: { itemId: i.id, ruleKey: t } } : {},
    ...(I = n.entryMetadata) == null ? void 0 : I.call(n, i, S)
  };
}
function ot(i, n) {
  var u, d;
  const t = ve(i), e = t == null ? void 0 : t.getFlag(f, "state"), s = t == null ? void 0 : t.getFlag(f, "items"), a = new Map(Array.isArray(s) ? s.map((v) => [v.id, v]) : []), c = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), r = ae(i, n), l = n.snapshot && !Te(i) && !((u = i.getFlag(f, "config")) != null && u.customId);
  for (const v of (e == null ? void 0 : e.entries) ?? []) {
    const p = a.get(v.id);
    if ((d = p == null ? void 0 : p.source) != null && d.ruleKey)
      c.set(p.source.ruleKey, { ...p, ...v });
    else if (l && (p != null && p.data) && !p.currency && !p.source) {
      const S = at(r, n, p.data);
      if (!S) continue;
      const I = j(i, S).token;
      o.set(I, o.has(I) ? null : { ...p, ...v });
    }
  }
  for (const [v, p] of o) p && !c.has(v) && c.set(v, p);
  return {
    vault: t,
    state: e,
    byId: a,
    byKey: c,
    items: r,
    corpse: $e(t),
    shared: be(),
    locked: Te(i) || !e && (i.getFlag(f, "state") || t && !t.getFlag(f, "draft"))
  };
}
function Ht(i, n) {
  const { state: t, byKey: e, items: s, corpse: a, shared: c, locked: o } = ot(i, n), r = Se(i);
  return s.map((l) => {
    var p, S;
    const u = j(i, l, r), d = e.get(u.token), v = o ? "RuleLocked" : !u.token || t && !d ? "RuleMissingSnapshot" : d != null && d.taken ? "RuleCollected" : d != null && d.claim ? "RuleReserved" : "";
    return {
      id: l.id,
      name: l.name,
      img: l.img,
      quantity: l.system.quantity,
      entry: d,
      effective: pe(u, a, c),
      overrides: { token: a[u.token], actor: (p = c.actor) == null ? void 0 : p[u.actor], global: (S = c.global) == null ? void 0 : S[u.global] },
      canToken: !v,
      tokenUnavailable: v,
      canActor: !!u.actor,
      canGlobal: !!u.global
    };
  });
}
async function $t(i, n, t, e, s) {
  if (!E()) throw new m("RuleGM");
  const { vault: a, state: c, byId: o, byKey: r, items: l, corpse: u, shared: d, locked: v } = ot(i, n), p = Se(i), S = l.filter((b) => e.includes(b.id)).map((b) => ({ item: b, key: j(i, b, p)[t] }));
  if (!e.length || S.length !== e.length || S.some(({ key: b }) => !b)) throw new m("RuleScopeUnavailable");
  const I = S.map(({ key: b }) => b);
  if (t === "actor" || t === "global")
    return At.run(ge, async () => {
      if (!E()) throw new m("RuleGM");
      const b = be(), w = { ...b, [t]: je(b[t], I, t === "global" && (s == null ? void 0 : s.mode) === "allow" ? null : s) };
      await game.settings.set(f, ge, w);
    });
  if (t !== "token" || v) throw new m("RuleScopeUnavailable");
  if (c && I.some((b) => {
    const w = r.get(b);
    return !w || w.taken || w.claim;
  })) throw new m("RuleScopeUnavailable");
  const y = je(u, I, s);
  if (!a) {
    Object.keys(y).length && await rt(i, [], { rules: JSON.stringify(y), draft: !0 });
    return;
  }
  if (!c) {
    await a.setFlag(f, "rules", JSON.stringify(y));
    return;
  }
  const C = /* @__PURE__ */ new Map(), L = [];
  for (const { item: b, key: w } of S) {
    const g = r.get(w), h = pe(j(i, b, p), y, d).rule;
    if (g.limit !== st(h) || !g.formula && nt(b, n, h)) {
      let M;
      const T = await Oe(b, n, w, h, {
        original: g.originalQuantity ?? g.data.system.quantity,
        onRoll: (O) => {
          M = O;
        }
      });
      C.set(g.id, T), M && L.push({ roll: M, itemName: b.name, quantity: T.data.system.quantity });
    }
  }
  if (!E()) throw new m("RuleGM");
  const q = {
    ...c,
    vaultId: a.id,
    entries: c.entries.map((b) => C.has(b.id) ? Ee(C.get(b.id)) : b)
  };
  return await a.update({
    [_("rules")]: JSON.stringify(y),
    [_("state")]: q,
    [_("items")]: Array.from(o.values(), (b) => C.get(b.id) ?? b)
  }), await Y(i, q), L;
}
async function rt(i, n, t) {
  var a, c;
  const s = await (((c = (a = globalThis.foundry) == null ? void 0 : a.documents) == null ? void 0 : c.JournalEntry) ?? globalThis.JournalEntry).create({
    name: `HoloLoot · ${i.name}`,
    ownership: { default: 0 },
    flags: { [f]: { tokenUuid: i.uuid, kind: "snapshot", items: structuredClone(n), ...t } }
  });
  if (!s) throw new m("PersistenceFailed");
  return s.id;
}
function de(i, n, t) {
  const e = game.journal.get(i);
  if (!e || e.getFlag(f, "tokenUuid") !== n.uuid || e.getFlag(f, "kind") !== t) throw new m("RecoveryRequired");
  const s = e.getFlag(f, "items");
  if (!Array.isArray(s)) throw new m("RecoveryRequired");
  return structuredClone(s);
}
function ct(i, n) {
  const t = ee(i);
  return !!(i.actor && (n.manual || t.source !== "custom" && !t.customId) && n.sourceClaim && n.removeSource);
}
function Et(i, n) {
  var c;
  const t = ve(i), e = new Set((c = t == null ? void 0 : t.getFlag(f, "state")) == null ? void 0 : c.entries.filter((o) => !o.taken).map((o) => o.id)), s = t == null ? void 0 : t.getFlag(f, "items"), a = new Set((Array.isArray(s) ? s : []).filter((o) => o.wholeItem && e.has(o.id)).map((o) => {
    var r;
    return (r = o.source) == null ? void 0 : r.ruleKey;
  }));
  return ae(i, n).map((o) => ({
    id: o.id,
    name: o.name,
    img: o.img,
    selected: a.has(j(i, o, null).token)
  }));
}
async function Ot(i, n, t, e) {
  if (!E()) throw new m("RuleGM");
  if (!n.manual || !["enabled", "disabled"].includes(t)) throw new m("InvalidRequest");
  await ut(i, n, { mode: t, ids: new Set(e) }), await i.setFlag(f, "config", { mode: t, source: "inventory" });
}
async function ut(i, n, t) {
  var L, q, b;
  if (!E()) throw new m("RuleGM");
  if (!ct(i, n) || n.manual && !t) throw new m("RefreshUnsupported");
  const e = ve(i), s = e == null ? void 0 : e.getFlag(f, "state");
  if (!s) {
    await De(i, n, t);
    return;
  }
  if (s.version !== 1) throw new m("RecoveryRequired");
  const a = s.entries.filter((w) => w.claim || w.taken), c = (w) => {
    var g, h, M, T;
    return ((h = (g = w.claim) == null ? void 0 : g.source) == null ? void 0 : h.itemId) || ((T = (M = w.claim) == null ? void 0 : M.source) == null ? void 0 : T.currency) && `currency:${w.claim.source.currency}`;
  };
  if (a.length && i.actorLink || a.some((w) => !c(w)))
    throw new m("RefreshUntracked");
  const o = new Set(a.filter((w) => !w.taken).map(c)), r = de(e.id, i, "snapshot"), l = new Map(r.map((w) => [w.id, w]));
  if (a.some((w) => !w.taken && !l.has(w.id))) throw new m("RecoveryRequired");
  const u = /* @__PURE__ */ new Map();
  for (const w of s.entries) {
    const g = l.get(w.id), h = ((L = g == null ? void 0 : g.source) == null ? void 0 : L.ruleKey) || ((q = g == null ? void 0 : g.currency) == null ? void 0 : q.storage) === "balance" && `currency:${g.currency.unit}`;
    h && u.set(h, { saved: g, taken: w.taken });
  }
  const d = (w, g) => (g && !g.taken && te({ ...w, id: g.saved.id }) === te(g.saved) && (w.id = g.saved.id), w), v = Se(i), p = $e(e), S = be(), I = [];
  for (const w of ae(i, n)) {
    if (o.has(w.id) || n.manual && !(t != null && t.ids.has(w.id))) continue;
    const g = j(i, w, v), h = u.get(g.token), M = h == null ? void 0 : h.saved.limit, T = M === void 0 ? pe(g, p, S).rule : we(M === "allow" || M === "never" ? M : "quantity", M), O = h == null ? void 0 : h.saved.rolledQuantity, G = M === void 0 || h.saved.formula ? void 0 : h.saved.rollCeiling ?? h.saved.data.system.quantity;
    I.push(d(await Oe(w, n, g.token, T, { previousRoll: O, legacyRollCeiling: G }), h));
  }
  for (const w of ((b = n.currencyEntries) == null ? void 0 : b.call(n, i.actor)) ?? []) {
    const g = `currency:${w.currency.unit}`;
    o.has(g) || I.push(d({ ...w, id: foundry.utils.randomID() }, u.get(g)));
  }
  if (!E()) throw new m("RuleGM");
  const y = { ...s, vaultId: e.id, currencyReady: !0, entries: [...a, ...I.map(Ee)] }, C = a.flatMap((w) => l.has(w.id) ? [l.get(w.id)] : []);
  await e.update({
    [_("state")]: y,
    [_("items")]: [...C, ...I],
    ...t ? { [_("manualMode")]: t.mode } : {}
  }), await Y(i, y);
}
async function De(i, n, t) {
  var c;
  const e = ve(i);
  if (n.manual && !t && (e == null ? void 0 : e.getFlag(f, "manualMode")) !== "enabled") throw new m("Unavailable");
  let s = e == null ? void 0 : e.getFlag(f, "state");
  if (!s && (i.getFlag(f, "state") || e && !e.getFlag(f, "draft")))
    throw new m("RecoveryRequired");
  if (!s) {
    const o = ee(i), r = be(), l = $e(e), u = Se(i), d = [];
    if (!n.manual && Te(i)) {
      const S = o.customId ? de(o.customId, i, "custom") : [];
      d.push(...S.map((I) => ({ id: foundry.utils.randomID(), data: I })));
    } else
      for (const S of ae(i, n)) {
        if (n.manual && !(t != null && t.ids.has(S.id))) continue;
        const I = j(i, S, u), { rule: y } = pe(I, l, r);
        d.push(await Oe(S, n, I.token, y));
      }
    d.push(...(((c = n.currencyEntries) == null ? void 0 : c.call(n, i.actor)) ?? []).map((S) => ({ ...S, id: foundry.utils.randomID() })));
    const v = { version: 1, currencyReady: !0, entries: d.map(Ee) }, p = e ? e.id : await rt(i, d, { state: v, ...t ? { manualMode: t.mode } : {} });
    s = { ...v, vaultId: p }, e && await e.update({
      [_("items")]: d,
      [_("state")]: s,
      [_("draft")]: !1,
      ...t ? { [_("manualMode")]: t.mode } : {}
    }), await Y(i, s);
  }
  if (s.version !== 1) throw new m("RecoveryRequired");
  if (s = { ...s, vaultId: s.vaultId ?? (e == null ? void 0 : e.id) }, !s.currencyReady && n.currencyEntries) {
    const o = e ?? game.journal.get(s.vaultId), r = o.getFlag(f, "items"), l = Array.isArray(r) ? structuredClone(r) : s.entries.every((d) => d.taken) ? [] : de(s.vaultId, i, "snapshot"), u = n.currencyEntries(i.actor).map((d) => ({ ...d, id: foundry.utils.randomID() }));
    s = { ...s, currencyReady: !0, entries: [...s.entries, ...u.map(({ id: d }) => ({ id: d, taken: !1 }))] }, u.length ? await o.update({ [`flags.${f}.items`]: [...l, ...u], [`flags.${f}.state`]: s }) : await o.setFlag(f, "state", s), await Y(i, s);
  }
  if (i.getFlag(f, "state") || await Y(i, s), s.entries.every((o) => o.taken)) return {
    ...s,
    entries: s.entries.map((o) => ({ ...o, data: null }))
  };
  const a = de(s.vaultId, i, "snapshot");
  return { ...s, entries: s.entries.flatMap((o) => {
    var S, I;
    if (o.taken) return [{ ...o, data: null }];
    const r = a.find((y) => y.id === o.id), l = r == null ? void 0 : r.data, u = n.id === "swade";
    if (!l || !u && !!r.wholeItem != !!n.manual) throw new m("RecoveryRequired");
    let d = r.source;
    const v = u && (d != null && d.itemId) ? (S = i.actor) == null ? void 0 : S.items.get(d.itemId) : null, p = u && (!n.allowsStoredItem(l) || v && !n.allowsStoredItem(v));
    if (p && !o.claim) return [];
    if (!p && !d && !r.currency && !((I = i.getFlag(f, "config")) != null && I.customId) && n.snapshot) {
      const y = at(ae(i, n), n, l);
      y && (d = { itemId: y.id });
    }
    return [{
      ...o,
      data: l,
      ...p ? { hidden: !0 } : {},
      ...r.wholeItem ? { wholeItem: !0 } : {},
      ...r.formula ? { formula: r.formula } : {},
      ...r.currency ? { currency: r.currency } : {},
      ...d ? { source: d } : {}
    }];
  }) };
}
async function Dt(i, n) {
  const t = {
    version: 1,
    ...n.currencyReady ? { currencyReady: !0 } : {},
    vaultId: n.vaultId,
    entries: n.entries.map(({ id: s, taken: a, claim: c, hidden: o }) => ({
      id: s,
      taken: !!a,
      ...c ? { claim: c } : {},
      ...o ? { hidden: o } : {}
    }))
  }, e = game.journal.get(n.vaultId);
  if ((e == null ? void 0 : e.getFlag(f, "tokenUuid")) !== i.uuid) throw new m("RecoveryRequired");
  await e.setFlag(f, "state", t), await Y(i, t);
}
function Nt(i, n) {
  return {
    tokenUuid: i.uuid,
    name: i.name,
    img: i.texture.src,
    entries: n.entries.filter((t) => !t.taken && !t.hidden).map((t) => {
      var c, o, r, l, u, d, v, p, S, I, y, C, L, q, b, w, g;
      const e = { ...t.data, system: t.data.system ?? {} }, s = e.system.identified === !1 || ((c = e.system.identification) == null ? void 0 : c.status) === "unidentified", a = s ? (o = e.system.unidentified) == null ? void 0 : o.description : typeof e.system.description == "string" ? e.system.description : (r = e.system.description) == null ? void 0 : r.value;
      return {
        id: t.id,
        name: t.currency ? game.i18n.localize(`HL.Currency.${t.currency.unit}`) : s ? ((l = e.system.unidentified) == null ? void 0 : l.name) || ((d = (u = e.system.identification) == null ? void 0 : u.unidentified) == null ? void 0 : d.name) || game.i18n.localize("HL.Unidentified") : e.name,
        currency: !!t.currency,
        img: s && ((p = (v = e.system.identification) == null ? void 0 : v.unidentified) == null ? void 0 : p.img) || e.img,
        quantity: t.wholeItem ? 1 : ((S = t.currency) == null ? void 0 : S.amount) ?? e.system.quantity,
        ...t.wholeItem ? { wholeItem: !0 } : {},
        ...t.formula ? { formula: t.formula } : {},
        type: t.currency ? game.i18n.localize("HL.CurrencyLabel") : game.i18n.localize(`TYPES.Item.${e.type}`),
        rarity: s ? "" : game.i18n.localize(((C = (y = (I = globalThis.CONFIG) == null ? void 0 : I.DND5E) == null ? void 0 : y.itemRarity) == null ? void 0 : C[e.system.rarity]) ?? ((w = (q = (L = globalThis.CONFIG) == null ? void 0 : L.PF2E) == null ? void 0 : q.rarityTraits) == null ? void 0 : w[(b = e.system.traits) == null ? void 0 : b.rarity]) ?? e.system.rarity ?? ""),
        tooltip: ((g = new DOMParser().parseFromString(a ?? "", "text/html").body.textContent) == null ? void 0 : g.slice(0, 1500)) ?? "",
        pending: !!t.claim
      };
    })
  };
}
function Pt(i, n = i) {
  const t = `${n} |`;
  return {
    log: (e, ...s) => console.log(t, e, ...s),
    warn: (e, ...s) => console.warn(t, e, ...s),
    error: (e, ...s) => console.error(t, e, ...s)
  };
}
function Ut(i, n = {}) {
  const t = n.socketName ?? `module.${i}`, e = Pt(i, n.title ?? i);
  return {
    socketName: t,
    emit(s) {
      var c;
      const a = (c = globalThis.game) == null ? void 0 : c.socket;
      return a != null && a.emit ? (a.emit(t, s), !0) : (e.warn("Foundry socket is unavailable.", s), !1);
    },
    isGMSender(s) {
      var a, c, o;
      return s ? !!((o = (c = (a = globalThis.game) == null ? void 0 : a.users) == null ? void 0 : c.get(String(s))) != null && o.isGM) : !1;
    }
  };
}
const Be = Ut(f, { title: "HoloSuite Loot" }), se = /* @__PURE__ */ new Map(), Gt = new ye();
async function _t(i, n) {
  game.socket.on(Be.socketName, (t) => {
    (t == null ? void 0 : t.type) === "refresh" && typeof t.tokenUuid == "string" && n(t.tokenUuid);
  }), Hooks.on("updateUser", (t, e, s, a) => {
    var o, r, l;
    if (t.id === game.user.id && ((r = (o = e.flags) == null ? void 0 : o[f]) != null && r[Re])) {
      let u;
      try {
        u = JSON.parse(t.getFlag(f, Re));
      } catch {
        return;
      }
      const d = se.get(u == null ? void 0 : u.id);
      d && d.gm === a && ((l = game.users.get(a)) != null && l.isGM) && (clearTimeout(d.timer), se.delete(u.id), u.result.error ? d.reject(new m(u.result.error)) : d.resolve(structuredClone(u.result)));
    }
    const c = yt(t, e, a, We);
    !c || !E() || typeof c.id != "string" || !/^[\w-]{1,64}$/.test(c.id) || Gt.run(t.id, async () => {
      if (!E()) return;
      let u;
      try {
        if (!he(c)) throw new m("InvalidRequest");
        u = await i.execute(c, t);
      } catch (d) {
        console.warn("HoloSuite Loot | Request failed", d), u = { error: d.code ?? "TransferFailed" };
      }
      await t.setFlag(f, Re, JSON.stringify({ id: c.id, result: u })), he(c) && ["take", "all"].includes(c.action) && Be.emit({ type: "refresh", tokenUuid: c.tokenUuid });
    }).catch((u) => console.warn("HoloSuite Loot | Could not deliver reply", u));
  }), game.user.isGM && await game.user.setFlag(f, "transportVersion", fe);
}
async function jt(i, n) {
  if (!he(i)) throw new m("InvalidRequest");
  const t = xe();
  if (!t) throw new m(game.users.contents.some((s) => s.active && s.isGM) ? "BuildMismatch" : "NoGM");
  if (t.id === game.user.id && n) return n.execute(i, game.user);
  const e = foundry.utils.randomID();
  return new Promise((s, a) => {
    const c = setTimeout(() => {
      se.delete(e), a(new m("Timeout"));
    }, i.action === "view" ? 8e3 : 2e4);
    se.set(e, { resolve: s, reject: a, timer: c, gm: t.id }), game.user.setFlag(f, We, { ...i, id: e }).catch((o) => {
      clearTimeout(c), se.delete(e), a(o);
    });
  });
}
function zt() {
  var i, n, t;
  return ((n = (i = globalThis.foundry) == null ? void 0 : i.applications) == null ? void 0 : n.api) ?? ((t = foundry == null ? void 0 : foundry.applications) == null ? void 0 : t.api) ?? null;
}
function Bt() {
  var i, n, t;
  return ((n = (i = globalThis.foundry) == null ? void 0 : i.appv1) == null ? void 0 : n.api) ?? ((t = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : t.api) ?? null;
}
function Kt(i = {}, n = {}) {
  var e, s, a;
  const t = ((s = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : s.mergeObject) ?? ((a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.mergeObject);
  return typeof t == "function" ? t(i, n, { inplace: !1 }) : { ...i, ...n };
}
function Vt() {
  var i, n, t, e, s;
  return ((t = (n = (i = globalThis.foundry) == null ? void 0 : i.utils) == null ? void 0 : n.randomID) == null ? void 0 : t.call(n, 8)) ?? ((s = (e = foundry == null ? void 0 : foundry.utils) == null ? void 0 : e.randomID) == null ? void 0 : s.call(e, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function Ke(i = {}) {
  return {
    id: String(i.id ?? `legacy-application-${Vt()}`),
    tag: i.tag ?? "section",
    classes: Array.isArray(i.classes) ? i.classes : [],
    window: {
      title: i.title ?? "",
      icon: i.icon,
      resizable: i.resizable === !0
    },
    position: {
      width: Number(i.width ?? 600),
      height: i.height === "auto" ? "auto" : Number(i.height ?? 600)
    }
  };
}
function Qt(i) {
  return class extends i {
    constructor(e = {}) {
      const s = Kt(new.target.defaultOptions ?? {}, e);
      super(Ke(s));
      R(this, "_v1Options");
      this._v1Options = s;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return Ke(this.defaultOptions ?? {});
    }
    activateListeners(e) {
    }
    async _renderHTML(e, s) {
      var l, u, d;
      const a = typeof this.getData == "function" ? await this.getData() : {}, c = ((l = this._v1Options) == null ? void 0 : l.template) ?? ((u = this.options) == null ? void 0 : u.template) ?? ((d = this.constructor.defaultOptions) == null ? void 0 : d.template);
      if (!c) return document.createDocumentFragment();
      const o = await globalThis.renderTemplate(c, a), r = document.createElement("template");
      return r.innerHTML = o.trim(), r.content;
    }
    _activateV1Form(e) {
      var a, c;
      if (typeof this._updateObject != "function") return;
      const s = (a = e.matches) != null && a.call(e, "form") ? e : (c = e.querySelector) == null ? void 0 : c.call(e, "form");
      s instanceof HTMLFormElement && s.addEventListener("submit", async (o) => {
        var l;
        o.preventDefault(), o.stopPropagation();
        const r = new FormData(s);
        await this._updateObject(o, r), ((l = this._v1Options) == null ? void 0 : l.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(e, s, a) {
      var u, d, v, p;
      s.replaceChildren(e);
      const c = globalThis.jQuery ?? globalThis.$, o = ((u = s.closest) == null ? void 0 : u.call(s, ".window-app, .app, .application")) ?? s, r = c ? c(o) : o;
      try {
        Object.defineProperty(this, "element", {
          value: r,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = r;
        } catch {
        }
      }
      const l = (d = this._v1Options) == null ? void 0 : d.classes;
      Array.isArray(l) && l.length && (s.classList.add(...l), (p = (v = s.closest) == null ? void 0 : v.call(s, ".window-app, .app, .application")) == null || p.classList.add(...l)), this._activateV1Form(s), typeof this.activateListeners == "function" && this.activateListeners(c ? c(s) : s);
    }
  };
}
function Jt() {
  const i = zt(), n = Bt(), t = globalThis.Application ?? (n == null ? void 0 : n.Application) ?? (i == null ? void 0 : i.ApplicationV1) ?? globalThis.FormApplication ?? (n == null ? void 0 : n.FormApplication) ?? (i == null ? void 0 : i.FormApplication);
  if (t) return t;
  const e = i == null ? void 0 : i.ApplicationV2;
  return e ? Qt(e) : null;
}
class Wt {
  constructor(n, t) {
    R(this, "outside", (n) => {
      n.composedPath().includes(this.root) || this.dismiss();
    });
    this.root = n, this.dismiss = t, document.addEventListener("pointerdown", this.outside, !0);
  }
  destroy() {
    document.removeEventListener("pointerdown", this.outside, !0);
  }
}
class kt {
  constructor(n, t, e, s) {
    R(this, "frame", 0);
    R(this, "destroyed", !1);
    R(this, "svg");
    R(this, "line");
    R(this, "lastGeometry", "");
    R(this, "outside", (n) => {
      var e, s;
      const t = n.composedPath();
      n.button === 2 && t.includes(((e = canvas.app) == null ? void 0 : e.canvas) ?? ((s = canvas.app) == null ? void 0 : s.view)) || t.includes(this.root) || this.dismiss();
    });
    R(this, "update", () => {
      var e, s;
      if (this.destroyed) return;
      const n = ((e = canvas.app) == null ? void 0 : e.canvas) ?? ((s = canvas.app) == null ? void 0 : s.view), t = this.token.object;
      if (!this.root.isConnected) {
        this.destroy();
        return;
      }
      if (!t || this.token.hidden) {
        this.destroy(), this.dismiss();
        return;
      }
      if (this.root.isConnected && n && canvas.stage) {
        const a = n.getBoundingClientRect(), c = canvas.app.renderer.screen, o = canvas.stage.worldTransform.apply(t.center), r = a.left + o.x * a.width / c.width, l = a.top + o.y * a.height / c.height, u = this.root.getBoundingClientRect(), d = 24 + Math.min(60, (t.w ?? 0) * Math.abs(canvas.stage.worldTransform.a) / 2), v = r + d + u.width <= innerWidth - 8 ? r + d : r - d - u.width, p = Math.max(8, Math.min(innerWidth - u.width - 8, v)), S = Math.max(8, Math.min(innerHeight - u.height - 8, l - u.height / 3));
        (Math.abs(u.left - p) > 0.5 || Math.abs(u.top - S) > 0.5) && this.position(p, S);
        const I = this.root.querySelector(".hl-panel") ?? this.root, y = I.getBoundingClientRect(), C = getComputedStyle(I), L = parseFloat(C.borderLeftWidth) || 3, q = Math.min(parseFloat(C.borderTopLeftRadius) || 0, y.height / 2, y.width / 2), b = r <= y.left || r >= y.right, w = b ? r <= y.left ? y.left + L / 2 : y.right - L / 2 : Math.max(y.left + q, Math.min(y.right - q, r)), g = b ? Math.max(y.top + q, Math.min(y.bottom - q, l)) : l < (y.top + y.bottom) / 2 ? y.top + L / 2 : y.bottom - L / 2, h = `${r},${l},${w},${g}`;
        h !== this.lastGeometry && (this.line.setAttribute("x1", String(r)), this.line.setAttribute("y1", String(l)), this.line.setAttribute("x2", String(w)), this.line.setAttribute("y2", String(g)), this.lastGeometry = h), this.line.style.stroke = C.borderLeftColor, this.line.style.strokeWidth = String(L), this.svg.style.zIndex = String(Math.max(0, (parseInt(getComputedStyle(this.root).zIndex) || 100) - 1));
      }
      this.frame = requestAnimationFrame(this.update);
    });
    this.root = n, this.token = t, this.position = e, this.dismiss = s;
    const a = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(a, "svg"), this.svg.classList.add("hl-loot-tether"), this.svg.setAttribute("aria-hidden", "true"), this.line = document.createElementNS(a, "line"), this.svg.append(this.line), document.body.append(this.svg), document.addEventListener("pointerdown", this.outside, !0), this.frame = requestAnimationFrame(this.update);
  }
  destroy() {
    this.destroyed = !0, cancelAnimationFrame(this.frame), document.removeEventListener("pointerdown", this.outside, !0), this.svg.remove();
  }
}
const W = (i) => String(i ?? "").replace(/[&<>"']/g, (n) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[n]);
async function Xt({ roll: i, itemName: n, quantity: t }) {
  var c;
  const { game: e } = globalThis, s = e.i18n.format("HL.QuantityRollChat", { item: W(n), quantity: t }), a = ((c = e.release) == null ? void 0 : c.generation) >= 14 ? { messageMode: "self" } : { rollMode: "selfroll" };
  await i.toMessage({ flavor: s }, a);
}
async function Yt(i, n) {
  var d;
  const { game: t, foundry: e, ChatMessage: s } = globalThis, a = i.claim.quantityRoll, c = n.preview ? n.preview(i) : i.data, r = (((d = e == null ? void 0 : e.dice) == null ? void 0 : d.Roll) ?? globalThis.Roll).fromData(a.roll), l = t.i18n.format("HL.PickupRollChat", { item: W(c.name), quantity: a.quantity }), u = await r.toMessage({ flavor: l }, { create: !1 });
  await s.create({ ...u, whisper: [i.claim.userId], blind: !1 });
}
async function Zt({ token: i, actor: n, entry: t, adapter: e }) {
  var r, l;
  const { game: s, ChatMessage: a } = globalThis;
  if (!s.settings.get(f, "chatLog")) return;
  const c = e.preview ? e.preview(t) : t.data, o = s.i18n.format("HL.ChatLooted", {
    actor: W(n.name),
    source: W(i.name),
    item: W(c.name),
    quantity: W(t.wholeItem ? 1 : ((r = t.currency) == null ? void 0 : r.amount) ?? ((l = c.system) == null ? void 0 : l.quantity) ?? 1)
  });
  await a.create({
    speaker: a.getSpeaker({ actor: n }),
    content: `<p>${o}</p>`,
    whisper: [],
    blind: !1,
    flags: { [f]: { claimId: t.claim.id, userId: t.claim.userId } }
  });
}
const lt = Jt(), dt = (i) => `modules/${f}/templates/${i}.hbs`, x = (i) => game.i18n.localize(`HL.${i}`);
function P(i) {
  const n = x((i == null ? void 0 : i.code) ?? "TransferFailed");
  return ui.notifications.warn(n), n;
}
const ft = (i) => i instanceof HTMLElement ? i : i[0];
class ei extends lt {
  constructor(t, e, s) {
    super({ id: `hololoot-${t.id}` });
    R(this, "token");
    R(this, "send");
    R(this, "adapter");
    R(this, "data", { entries: [] });
    R(this, "destination", "");
    R(this, "busy", !1);
    R(this, "message", "");
    R(this, "loading", !1);
    R(this, "firstDraw", null);
    R(this, "resolveFirstDraw", null);
    R(this, "refreshing", null);
    R(this, "refreshAgain", !1);
    R(this, "disposed", !1);
    R(this, "presentation", null);
    this.token = t, this.send = e, this.adapter = s;
    const a = game.user.character;
    X(a, game.user, s, t) && (this.destination = s.manual ? D(a) : a.id);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: "HoloSuite Loot",
      classes: ["holosuite-loot-window", "holosuite-loot-popup"],
      template: dt("loot"),
      width: 340,
      height: "auto",
      resizable: !1
    });
  }
  show(t) {
    return this.firstDraw || (this.firstDraw = new Promise((e) => {
      this.resolveFirstDraw = e;
    }), this.loading = t === void 0, this.loading || (this.data = t), this.render(!0)), this.firstDraw;
  }
  async refresh() {
    if (!this.disposed) {
      if (this.busy) {
        this.refreshAgain = !0;
        return;
      }
      return this.refreshing ? (this.refreshAgain = !0, this.refreshing) : (this.refreshAgain = !1, this.refreshing = (async () => {
        try {
          this.data = await this.send({ action: "view", tokenUuid: this.token.uuid }), this.message = "";
        } catch (t) {
          if (this.disposed) return;
          if ((t == null ? void 0 : t.code) === "OutOfRange") {
            P(t), await this.close();
            return;
          }
          this.data = { entries: [] }, this.message = P(t);
        }
        this.loading = !1, this.disposed || this.render(!0);
      })().finally(() => {
        this.refreshing = null, this.refreshAgain && !this.disposed && !this.busy && this.refresh();
      }), this.refreshing);
    }
  }
  getData() {
    var r, l;
    const t = game.settings.get(f, "characterSelector"), e = game.settings.get(f, "panelTheme"), s = this.adapter.manual ? [...new Map([...game.actors.contents, ...Array.from(((r = canvas.scene) == null ? void 0 : r.tokens) ?? [], (u) => u.actor)].filter((u) => X(u, game.user, this.adapter, this.token)).map((u) => [D(u), u])).values()] : game.actors.contents.filter((u) => X(u, game.user, this.adapter)), a = (u) => this.adapter.manual ? D(u) : u.id;
    let c = "";
    if (t)
      !this.destination && s.length === 1 && (this.destination = a(s[0]));
    else try {
      this.destination = D(ke(game.user, game.actors.contents, (l = canvas.scene) == null ? void 0 : l.tokens, this.adapter, this.token));
    } catch (u) {
      this.destination = "", c = x(u.code);
    }
    const o = t ? s.some((u) => a(u) === this.destination) : !!this.destination;
    return {
      ...this.data,
      name: this.data.name ?? this.token.name,
      img: this.data.img ?? this.token.texture.src,
      actors: s.map((u) => ({ id: a(u), name: u.name, selected: a(u) === this.destination })),
      disabled: this.loading || this.busy || !o || !this.data.entries.length,
      loading: this.loading,
      showSelector: t,
      theme: e,
      busy: this.busy,
      message: this.message || c || (!s.length && t ? x("NoActor") : ""),
      empty: !this.loading && !this.data.entries.length && !this.message
    };
  }
  activateListeners(t) {
    var a, c, o;
    if (super.activateListeners(t), this.disposed) return;
    const e = ft(t);
    (a = this.presentation) == null || a.destroy();
    const s = e.closest(".window-app, .application") ?? e.closest(".holosuite-loot-popup") ?? e;
    this.presentation = new kt(
      s,
      this.token,
      (r, l) => this.setPosition({ left: r, top: l }),
      () => void this.close()
    ), (c = e.querySelector("select")) == null || c.addEventListener("change", (r) => {
      this.destination = r.target.value, this.render(!0);
    }), e.querySelectorAll("button[data-loot]").forEach((r) => {
      r.addEventListener("click", () => void this.take(r.dataset.loot));
    }), e.querySelectorAll("[data-inspect]").forEach((r) => {
      r.addEventListener("click", () => void this.inspect(r.dataset.inspect));
    }), (o = this.resolveFirstDraw) == null || o.call(this), this.resolveFirstDraw = null;
  }
  async inspect(t) {
    try {
      const s = { ...(await this.send({ action: "inspect", entryId: t, tokenUuid: this.token.uuid })).item, ownership: { default: 0, [game.user.id]: 2 } }, a = globalThis.CONFIG.Item.documentClass;
      new a(s, { temporary: !0 }).sheet.render(!0, { editable: !1 });
    } catch (e) {
      P(e);
    }
  }
  async take(t) {
    if (!this.busy) {
      if (this.getData(), !this.destination) {
        this.message = this.getData().message || x("NoActor"), this.render(!0);
        return;
      }
      this.busy = !0, this.message = "", this.render(!0);
      try {
        this.data = await this.send({
          action: t === "all" ? "all" : "take",
          entryId: t,
          actorId: this.destination,
          tokenUuid: this.token.uuid
        });
        const e = this.data.failures ?? [];
        this.message = e.map((s) => `${s.name}: ${x(s.code)}`).join(" · "), this.message && ui.notifications.warn(this.message);
      } catch (e) {
        this.message = P(e);
      } finally {
        this.busy = !1, this.disposed || (this.render(!0), this.refreshAgain && this.refresh());
      }
    }
  }
  async close(t) {
    var e, s;
    return this.disposed = !0, (e = this.presentation) == null || e.destroy(), this.presentation = null, (s = this.resolveFirstDraw) == null || s.call(this), this.resolveFirstDraw = null, super.close(t);
  }
}
class ti extends lt {
  constructor(t, e, s) {
    super({ id: `hololoot-config-${t.id}` });
    R(this, "token");
    R(this, "adapter");
    R(this, "queue");
    R(this, "config");
    R(this, "scope", "token");
    R(this, "busy", !1);
    R(this, "dismissal", null);
    this.token = t, this.adapter = e, this.queue = s, this.config = structuredClone(ee(t));
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: x("Title"),
      classes: ["holosuite-loot-window", "holosuite-loot-config"],
      template: dt("config"),
      width: 480,
      height: "auto",
      resizable: !1
    });
  }
  getData() {
    const t = !!this.adapter.manual, e = !t && game.settings.get(f, "zeroHP"), s = !e && this.config.mode === "automatic" ? "disabled" : this.config.mode, a = (r) => (r == null ? void 0 : r.quantity) ?? (r ? x(`Rule.${r.mode}`) : ""), c = t ? Et(this.token, this.adapter) : Ht(this.token, this.adapter).map(({ entry: r, effective: l, overrides: u, ...d }) => ({
      ...d,
      configured: a(l.rule),
      effectiveScope: l.scope,
      tokenRule: a(u.token),
      actorRule: a(u.actor),
      globalRule: a(u.global),
      ruleScope: x(`Scope.${l.scope}`),
      original: (r == null ? void 0 : r.originalQuantity) ?? d.quantity,
      remaining: r ? r.taken ? 0 : r.formula ?? r.data.system.quantity : "—",
      rollResult: !(r != null && r.taken) && Number.isSafeInteger(r == null ? void 0 : r.rolledQuantity) ? game.i18n.format("HL.QuantityRollResult", { roll: r.rolledQuantity, quantity: r.data.system.quantity }) : "",
      pending: !!(r != null && r.claim) && !(r != null && r.taken)
    })), o = E();
    return {
      name: this.token.name,
      theme: game.settings.get(f, "panelTheme"),
      busy: this.busy,
      automatic: e,
      rows: c,
      canEdit: o,
      manual: t,
      saveDisabled: this.busy || t && !o,
      canRefresh: !t && o && ct(this.token, this.adapter),
      scopes: ["token", "actor", "global"].map((r) => ({ value: r, label: x(`Scope.${r}`), selected: this.scope === r })),
      modes: (e ? ["automatic", "enabled", "disabled"] : ["enabled", "disabled"]).map((r) => ({ value: r, label: x(r), selected: r === s }))
    };
  }
  activateListeners(t) {
    var v, p, S, I;
    super.activateListeners(t);
    const e = ft(t);
    (v = this.dismissal) == null || v.destroy(), this.dismissal = new Wt(e.closest(".window-app, .application") ?? e, () => {
      this.busy || this.close();
    }), (p = e.querySelector('[name="mode"]')) == null || p.addEventListener("change", (y) => {
      this.config.mode = y.target.value;
    }), (S = e.querySelector("[data-save]")) == null || S.addEventListener("click", () => {
      const y = Array.from(e.querySelectorAll("[data-manual-item]:checked"), (C) => C.value);
      this.save(y);
    }), (I = e.querySelector("[data-close]")) == null || I.addEventListener("click", () => void this.close());
    const s = e.querySelector('[name="scope"]'), a = e.querySelector('[name="behavior"]'), c = e.querySelector('[name="formula"]'), o = e.querySelector("[data-apply]"), r = e.querySelector("[data-refresh-inventory]"), l = e.querySelector("[data-select-all]");
    if (!s || !a || !c || !o || !l) return;
    const u = Array.from(e.querySelectorAll("input[data-rule-item]")), d = () => {
      this.scope = s.value, s.disabled = a.disabled = c.disabled = this.busy, r && (r.disabled = this.busy);
      const y = u.filter((L) => {
        const q = L.dataset[this.scope] === "true";
        L.disabled = this.busy || !q, q || (L.checked = !1);
        const b = L.closest("label"), w = b == null ? void 0 : b.querySelector("[data-rule-unavailable]"), g = L.dataset[`${this.scope}Unavailable`];
        w && (w.textContent = !q && g ? x(g) : "");
        const h = b == null ? void 0 : b.querySelector("[data-scoped-rule]"), M = L.dataset[`${this.scope}Rule`];
        return h && (h.textContent = M && L.dataset.effectiveScope !== this.scope ? ` · ${x(`Scope.${this.scope}`)} ${M}` : ""), q;
      }), C = y.filter((L) => L.checked).length;
      l.disabled = this.busy || !y.length, l.checked = !!C && C === y.length, l.indeterminate = !!C && !l.checked, o.disabled = this.busy || !C, c.hidden = a.value !== "quantity";
    };
    s.addEventListener("change", d), a.addEventListener("change", d);
    for (const y of u) y.addEventListener("change", d);
    l.addEventListener("change", () => {
      for (const y of u) y.disabled || (y.checked = l.checked);
      d();
    }), r == null || r.addEventListener("click", async () => {
      if (!(!E() || this.busy)) {
        this.busy = !0, d();
        try {
          await this.queue.run(this.token.uuid, () => ut(this.token, this.adapter)), ui.notifications.info(x("InventoryRefreshed"));
        } catch (y) {
          P(y);
          return;
        } finally {
          this.busy = !1, d();
        }
        this.rendered && this.render(!0);
      }
    }), o.addEventListener("click", async () => {
      if (!(!E() || this.busy)) {
        try {
          const y = we(a.value, c.value), C = u.filter((b) => b.checked && !b.disabled).map((b) => b.value), L = this.scope;
          this.busy = !0, d();
          const q = await this.queue.run(this.token.uuid, () => $t(this.token, this.adapter, L, C, y));
          for (const b of q ?? [])
            Xt(b).catch((w) => console.warn("HoloSuite Loot | Could not post quantity roll", w));
        } catch (y) {
          P(y);
          return;
        } finally {
          this.busy = !1, d();
        }
        this.render(!0);
      }
    }), d();
  }
  async save(t = []) {
    if (!(!game.user.isGM || this.busy)) {
      this.busy = !0, this.render(!0);
      try {
        const e = this.config.mode === "automatic" && (this.adapter.manual || !game.settings.get(f, "zeroHP")) ? "disabled" : this.config.mode;
        await this.queue.run(this.token.uuid, () => this.adapter.manual ? Ot(this.token, this.adapter, e, t) : this.token.setFlag(f, "config", { ...ee(this.token), mode: e })), await this.close();
      } catch (e) {
        P(e);
      } finally {
        this.busy = !1, this.rendered && this.render(!0);
      }
    }
  }
  async close(t) {
    var e;
    return (e = this.dismissal) == null || e.destroy(), this.dismissal = null, super.close(t);
  }
}
class ii {
  constructor(n) {
    R(this, "sprites", /* @__PURE__ */ new Map());
    R(this, "texture");
    R(this, "disposed", !1);
    var e;
    this.available = n;
    const t = ((e = foundry.canvas) == null ? void 0 : e.loadTexture) ?? globalThis.loadTexture;
    Promise.resolve().then(() => t == null ? void 0 : t(`modules/${f}/assets/ui/loot-badge.svg`)).then((s) => {
      this.disposed || !s || (this.texture = s, this.refreshScene());
    }).catch((s) => console.warn("HoloSuite Loot | Badge texture could not load", s));
  }
  refreshScene() {
    var n;
    for (const t of ((n = canvas.tokens) == null ? void 0 : n.placeables) ?? []) this.refresh(t);
  }
  refresh(n) {
    if (!n || this.disposed || !this.texture) return;
    const t = n.document, e = t.getFlag(f, "state");
    if (n.destroyed || n.isPreview || t.hidden || !this.available(t) || e && !e.entries.some((a) => !a.taken && !a.hidden)) {
      this.remove(n);
      return;
    }
    let s = this.sprites.get(n);
    (s != null && s.destroyed || (s == null ? void 0 : s.parent) !== n) && (this.remove(n), s = new PIXI.Sprite(this.texture), s.name = "holosuite-loot-badge", s.eventMode = "none", s.anchor.set(0.5), s.width = s.height = 24, s.zIndex = 100, n.addChild(s), this.sprites.set(n, s)), s.position.set(n.w, 0);
  }
  remove(n) {
    var e;
    const t = this.sprites.get(n);
    this.sprites.delete(n), t && !t.destroyed && ((e = t.parent) == null || e.removeChild(t), t.destroy());
  }
  destroy() {
    this.disposed = !0;
    for (const n of this.sprites.keys()) this.remove(n);
  }
}
const H = /* @__PURE__ */ new Map();
let A = null, z = !1, le = 0;
const U = () => It(game.system.id), oe = () => Ft(U()), Ne = (i) => (i == null ? void 0 : i.actor) && (U().manual ? !!i.actor.items : i.actor.type === "npc"), si = (i, n, t) => {
  var e;
  return ke(i, game.actors.contents, (e = game.scenes.get(i.viewedScene)) == null ? void 0 : e.tokens, n, t);
}, ce = new Rt({
  moduleId: f,
  authority: E,
  environment: oe,
  adapter: U,
  token: async (i) => {
    if (!/^Scene\.[^.]+\.Token\.[^.]+$/.test(i)) throw new m("InvalidRequest");
    const t = await (foundry.utils.fromUuid ?? globalThis.fromUuid)(i);
    return (t == null ? void 0 : t.documentName) === "Token" ? t : null;
  },
  actor: (i) => game.actors.get(i) ?? (foundry.utils.fromUuid ?? globalThis.fromUuid)(i),
  id: () => foundry.utils.randomID(),
  destination: (i, n, t) => game.settings.get(f, "characterSelector") ? i.actorId ? ce.io.actor(i.actorId) : null : si(n, U(), t),
  load: De,
  save: Dt,
  summary: Nt,
  collected: Zt,
  rollQuantity: xt,
  quantityRolled: Yt
}), Me = (i) => jt(i, ce);
function Pe(i) {
  var n;
  return z && ne(i, oe()) && (game.user.isGM || !i.hidden && ((n = i.object) == null ? void 0 : n.isVisible));
}
async function Ie(i) {
  var a, c, o, r, l;
  i = (i == null ? void 0 : i.document) ?? i;
  const n = U();
  if (!n) {
    P(new m("Unsupported"));
    return;
  }
  if (game.user.isGM) return ue(i);
  if (!Pe(i)) {
    P(new m("Unavailable"));
    return;
  }
  const t = ++le;
  let e;
  if (He() > 0 && (!H.has(i.uuid) || (a = H.get(i.uuid)) != null && a.disposed)) {
    try {
      e = await Me({ action: "view", tokenUuid: i.uuid });
    } catch (u) {
      t === le && ((c = canvas.scene) == null ? void 0 : c.id) === ((o = i.parent) == null ? void 0 : o.id) && P(u);
      return;
    }
    if (t !== le || ((r = canvas.scene) == null ? void 0 : r.id) !== ((l = i.parent) == null ? void 0 : l.id)) return;
  }
  for (const [u, d] of H)
    u !== i.uuid && !d.disposed && await d.close();
  if (t !== le) return;
  let s = H.get(i.uuid);
  (!s || s.disposed) && (s = new ei(i, Me, n), H.set(i.uuid, s), await s.show(e), e !== void 0) || s.disposed || await s.refresh();
}
async function ue(i) {
  var n;
  if (!(!game.user.isGM || !U())) {
    if (((n = i == null ? void 0 : i.parent) == null ? void 0 : n.documentName) !== "Scene" || !Ne(i)) {
      ui.notifications.info(x("SelectToken"));
      return;
    }
    try {
      new ti(i, U(), ce.queue).render(!0);
    } catch (t) {
      P(t);
    }
  }
}
function re(i) {
  const n = H.get(i);
  n && !n.disposed && n.refresh();
}
function Ue(i) {
  !z || !E() || U().manual || i.getFlag(f, "state") || !ne(i, oe()) || ce.queue.run(i.uuid, async () => {
    E() && ne(i, oe()) && !i.getFlag(f, "state") && await De(i, U());
  }).catch((n) => console.warn("HoloSuite Loot | Snapshot initialization failed", i.uuid, n));
}
function N() {
  var i;
  for (const n of ((i = canvas.scene) == null ? void 0 : i.tokens) ?? []) Ue(n);
  A == null || A.refreshScene();
}
function ni() {
  const i = [.../* @__PURE__ */ new Set([...canvas.tokens.controlled, ...game.user.targets])];
  if (i.length !== 1) {
    ui.notifications.info(x("SelectToken"));
    return;
  }
  const n = i[0];
  game.user.isGM ? ue(n.document) : Ie(n.document);
}
function Ve() {
  var n;
  const i = ((n = game.modules.get("holosuite-core")) == null ? void 0 : n.api) ?? game.holosuite;
  return i != null && i.registerApp ? (i.registerApp({
    id: f,
    title: x("Title"),
    icon: "fa-solid fa-box-open",
    playerVisible: !1,
    premium: !1,
    description: x("SelectToken"),
    open: ni
  }), !0) : !1;
}
let F, Z, Qe = "", Je = 0;
function k(i) {
  var r, l;
  if (game.user.isGM || !z || i.type === "pointerdown" && i.button !== 2) return;
  const n = F == null ? void 0 : F.getBoundingClientRect(), t = (l = (r = canvas.app) == null ? void 0 : r.renderer) == null ? void 0 : l.screen;
  if (!(n != null && n.width) || !n.height || !t || !canvas.stage) return;
  const e = canvas.stage.worldTransform.applyInverse({
    x: (i.clientX - n.left) * t.width / n.width,
    y: (i.clientY - n.top) * t.height / n.height
  }), s = (u) => {
    var d;
    return (u == null ? void 0 : u.isVisible) && (((d = u.bounds) == null ? void 0 : d.contains(e.x, e.y)) ?? (e.x >= u.document.x && e.y >= u.document.y && e.x <= u.document.x + u.w && e.y <= u.document.y + u.h));
  }, a = s(Z) ? Z : [...canvas.tokens.placeables].reverse().find(s), c = a == null ? void 0 : a.document;
  if (!Pe(c)) {
    for (const u of H.values()) u.disposed || u.close();
    return;
  }
  if (i.type === "contextmenu" && Qe === c.uuid && Date.now() - Je < 1e3) return;
  i.type === "pointerdown" && (Qe = c.uuid, Je = Date.now());
  const o = H.get(c.uuid);
  o && !o.disposed ? o.close() : Ie(c);
}
function ht() {
  var i, n;
  A == null || A.destroy(), A = z ? new ii((t) => ne(t, oe())) : null, F == null || F.removeEventListener("contextmenu", k, !0), F == null || F.removeEventListener("pointerdown", k, !0), F = ((i = canvas.app) == null ? void 0 : i.canvas) ?? ((n = canvas.app) == null ? void 0 : n.view), F == null || F.addEventListener("contextmenu", k, !0), F == null || F.addEventListener("pointerdown", k, !0);
}
Hooks.once("init", () => {
  game.settings.register(f, ge, { scope: "world", config: !1, type: Object, default: {} }), game.settings.register(f, "zeroHP", {
    name: "HL.ZeroHP",
    hint: "HL.ZeroHPHint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0,
    onChange: () => {
      N();
      for (const i of H.keys()) re(i);
    }
  }), game.settings.register(f, "hideGmLootButton", {
    name: "HL.HideGmLootButton",
    hint: "HL.HideGmLootButtonHint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(f, "characterSelector", {
    name: "HL.CharacterSelector",
    hint: "HL.CharacterSelectorHint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(f, et, {
    name: "HL.LootRange",
    hint: "HL.LootRangeHint",
    scope: "world",
    config: !0,
    type: Number,
    default: tt,
    onChange: () => {
      for (const i of H.keys()) re(i);
    }
  }), game.settings.register(f, "chatLog", {
    name: "HL.ChatLog",
    hint: "HL.ChatLogHint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(f, "panelTheme", {
    name: "HL.PanelTheme",
    hint: "HL.PanelThemeHint",
    scope: "world",
    config: !0,
    type: String,
    default: "holo",
    choices: { holo: "HL.ThemeHolo", neutral: "HL.ThemeNeutral", fantasy: "HL.ThemeFantasy" },
    onChange: () => {
      for (const i of H.values()) i.disposed || i.render(!1);
    }
  });
});
Hooks.once("ready", async () => {
  var i;
  if (!((i = game.modules.get("holosuite-core")) != null && i.active)) {
    ui.notifications.error(x("CoreMissing"));
    return;
  }
  try {
    await _t(ce, re);
  } catch (n) {
    P(n);
    return;
  }
  z = !0, game.modules.get(f).api = {
    version: fe,
    open: Ie,
    configure: ue,
    registerAdapter: St,
    // Requests still pass every authority and permission check, including calls from macros.
    request: Me,
    authority: () => {
      var n;
      return (n = xe()) == null ? void 0 : n.id;
    }
  }, Ve(), setTimeout(Ve, 500), ht(), N(), console.info(`HoloSuite Loot | ${fe} ready; Foundry ${game.version}, ${game.system.id} ${game.system.version}`);
});
Hooks.on("canvasReady", () => {
  ht(), N();
});
Hooks.on("hoverToken", (i, n) => {
  n ? Z = i : Z === i && (Z = null);
});
Hooks.on("canvasTearDown", () => {
  A == null || A.destroy(), A = null, Z = null, F == null || F.removeEventListener("contextmenu", k, !0), F == null || F.removeEventListener("pointerdown", k, !0), F = null;
  for (const i of H.values()) i.close();
  H.clear();
});
Hooks.on("renderTokenHUD", (i, n) => {
  var c;
  if (!z) return;
  const t = (c = i.object) == null ? void 0 : c.document;
  if (!Ne(t)) return;
  const e = n instanceof HTMLElement ? n : n[0], s = e.querySelector(".col.right") ?? e;
  e.querySelectorAll(".hl-token-action").forEach((o) => o.remove());
  const a = (o, r, l) => {
    const u = document.createElement("button");
    u.type = "button", u.className = "control-icon hl-token-action", u.title = o, u.setAttribute("aria-label", o);
    const d = document.createElement("i");
    d.className = r, u.append(d), u.addEventListener("click", (v) => {
      v.preventDefault(), v.stopPropagation(), l();
    }), s.append(u);
  };
  game.user.isGM ? U() && !game.settings.get(f, "hideGmLootButton") && a(x("Loot"), "fa-solid fa-box-open", () => void ue(t)) : Pe(t) && a(x("Loot"), "fa-solid fa-box-open", () => void Ie(t));
});
Hooks.on("renderTokenConfig", (i, n) => {
  var a;
  if (!z || !game.user.isGM || !U()) return;
  const t = i.document ?? i.object;
  if (((a = t == null ? void 0 : t.parent) == null ? void 0 : a.documentName) !== "Scene" || !Ne(t)) return;
  const e = n instanceof HTMLElement ? n : n[0];
  if (e.querySelector(".hl-token-config")) return;
  const s = document.createElement("button");
  s.type = "button", s.className = "hl-token-config", s.textContent = x("Configure"), s.addEventListener("click", () => ue(t)), (e.querySelector('[data-tab="character"]') ?? e.querySelector("form") ?? e).append(s);
});
Hooks.on("drawToken", (i) => A == null ? void 0 : A.refresh(i));
Hooks.on("refreshToken", (i, n) => {
  (!n || n.refreshSize || n.refreshShape) && (A == null || A.refresh(i));
});
Hooks.on("destroyToken", (i) => A == null ? void 0 : A.remove(i));
Hooks.on("updateToken", (i, n) => {
  var t, e, s;
  if (Ue(i), A == null || A.refresh(i.object), re(i.uuid), !(!H.size || !He() || ((t = i.parent) == null ? void 0 : t.id) !== ((e = canvas.scene) == null ? void 0 : e.id) || !i.actor || !((s = U()) != null && s.destination(i.actor)) || !i.actor.testUserPermission(game.user, "OWNER") || !["x", "y", "elevation", "width", "height", "hidden"].some((a) => a in n)))
    for (const a of H.keys()) a !== i.uuid && re(a);
});
Hooks.on("createToken", Ue);
Hooks.on("createCombatant", N);
Hooks.on("updateCombatant", N);
Hooks.on("deleteCombatant", N);
Hooks.on("updateCombat", N);
Hooks.on("deleteCombat", N);
Hooks.on("updateActor", N);
Hooks.on("createActiveEffect", N);
Hooks.on("updateActiveEffect", N);
Hooks.on("deleteActiveEffect", N);
Hooks.on("userConnected", N);
Hooks.on("deleteToken", (i) => {
  var n;
  if ((n = H.get(i.uuid)) == null || n.close(), H.delete(i.uuid), !!E())
    for (const t of game.journal.contents)
      t.getFlag(f, "tokenUuid") === i.uuid && t.delete().catch(console.warn);
});
