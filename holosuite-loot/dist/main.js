var ft = Object.defineProperty;
var ht = (t, s, i) => s in t ? ft(t, s, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[s] = i;
var R = (t, s, i) => ht(t, typeof s != "symbol" ? s + "" : s, i);
const f = "holosuite-loot", he = "1.2.0", Ke = "commandV3", Le = "replyV3", $ = (t) => structuredClone(t);
function mt(t, s, i, e = "request") {
  var n, a;
  return i !== t.id || !t.active || !((a = (n = s.flags) == null ? void 0 : n[f]) != null && a[e]) ? null : $(t.getFlag(f, e));
}
class m extends Error {
  constructor(s) {
    super(s), this.code = s;
  }
}
function me(t) {
  const s = (i) => typeof i == "string" && /^[\w-]{1,64}$/.test(i);
  return typeof (t == null ? void 0 : t.tokenUuid) == "string" && /^Scene\.[\w-]{1,64}\.Token\.[\w-]{1,64}$/.test(t.tokenUuid) && ["view", "inspect", "take", "all"].includes(t.action) && (!["inspect", "take"].includes(t.action) || s(t.entryId)) && (t.actorId == null || typeof t.actorId == "string" && /^(?:[\w-]{1,64}|Actor\.[\w-]{1,64}|Scene\.[\w-]{1,64}\.Token\.[\w-]{1,64}(?:\.Actor\.[\w-]{1,64})?)$/.test(t.actorId));
}
function Y(t) {
  var s;
  return t.getFlag(f, "config") ?? ((s = t.actor) == null ? void 0 : s.getFlag(f, "config")) ?? { mode: "automatic", source: "inventory" };
}
const N = (t) => (t == null ? void 0 : t.uuid) ?? (t == null ? void 0 : t.id), Z = (t) => JSON.stringify(t, (s, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(Object.entries(i).sort(([e], [n]) => e.localeCompare(n))) : i);
function J(t, s, i, e = void 0) {
  return !t || !i.destination(t) || !t.testUserPermission(s, "OWNER") ? !1 : !i.manual || !e || N(t) !== N(e.actor) && (t.isToken || t.id !== e.actorId);
}
function Qe(t, s, i, e, n = void 0) {
  const a = (r) => J(r, t, e, n);
  if (a(t.character)) return t.character;
  const c = [...new Map(Array.from(i ?? []).map((r) => r.actor).filter(a).map((r) => [N(r), r])).values()];
  if (c.length === 1) return c[0];
  if (c.length > 1) throw new m("AmbiguousActor");
  const o = Array.from(s ?? []).filter(a);
  if (o.length === 1) return o[0];
  throw new m(o.length ? "AmbiguousActor" : "NoActor");
}
function se(t, { combats: s = [], zeroHP: i = !1, automatic: e = !0, manual: n = !1 } = {}) {
  var r, l, u, d, p, b;
  if (!(t != null && t.actor) || (n ? !t.actor.items : t.actor.type !== "npc")) return !1;
  if (n) return ((r = t.getFlag(f, "config")) == null ? void 0 : r.mode) === "enabled";
  const a = Y(t);
  if (a.mode === "disabled") return !1;
  if (a.mode === "enabled") return !0;
  if (!e) return !1;
  if (s.some((w) => {
    var S;
    return (S = w.combatants) == null ? void 0 : S.some((g) => {
      var L, C;
      return g.tokenId === t.id && (g.sceneId ?? ((L = w.scene) == null ? void 0 : L.id)) === ((C = t.parent) == null ? void 0 : C.id) && (g.isDefeated || g.defeated);
    });
  })) return !0;
  const c = t.actor.statuses;
  if (c != null && c.has("dead")) return !0;
  const o = (u = (l = t.actor.system) == null ? void 0 : l.attributes) == null ? void 0 : u.hp;
  return i && Number(o == null ? void 0 : o.max) > 0 && (o == null ? void 0 : o.value) === 0 && !((b = (p = (d = t.actor.system) == null ? void 0 : d.attributes) == null ? void 0 : p.death) != null && b.success);
}
function gt(t, s, i, e = void 0) {
  var a, c, o;
  if (!(s != null && s.active) || !se(t, i)) throw new m("Unavailable");
  if (s.isGM) return;
  const n = ((a = t.parent) == null ? void 0 : a.active) || ((c = t.parent) == null ? void 0 : c.testUserPermission(s, "LIMITED"));
  if (t.hidden || s.viewedScene !== ((o = t.parent) == null ? void 0 : o.id) || !n || !i.visible(t, s))
    throw new m("AccessDenied");
  if (i.inRange && !i.inRange(t, s, e)) throw new m("OutOfRange");
}
function De(t, s, i, e = void 0) {
  if (!J(t, s, i, e))
    throw new m("ActorDenied");
}
class be {
  constructor() {
    R(this, "tails", /* @__PURE__ */ new Map());
  }
  async run(s, i) {
    const n = (this.tails.get(s) ?? Promise.resolve()).catch(() => {
    }).then(i);
    this.tails.set(s, n);
    try {
      return await n;
    } finally {
      this.tails.get(s) === n && this.tails.delete(s);
    }
  }
}
const Ce = new be(), qe = (t) => `${t.currency.unit}:${t.currency.amount}`, ee = (t, s, i, e = !1) => {
  var n, a;
  return ((a = (n = t.getFlag) == null ? void 0 : n.call(t, f, e ? "currencyDebits" : "currencyReceipts")) == null ? void 0 : a[i.id]) === qe(s);
};
function Je({ units: t, amountOf: s, path: i, valid: e, name: n }) {
  return {
    entries(a) {
      return t.filter((c) => e(s(a, c)) && s(a, c) > 0).map((c) => {
        const o = s(a, c);
        return { currency: { storage: "balance", unit: c, amount: o }, data: {
          name: n(c),
          type: "currency",
          img: "icons/svg/coins.svg",
          system: { quantity: o }
        } };
      });
    },
    received: ee,
    async grant(a, c, o, r) {
      return Ce.run(N(a), async () => {
        if (ee(a, c, o)) return;
        if (o.currencyAttempted) throw new m("RecoveryRequired");
        if (!r) throw new m("RecoveryRequired");
        await r();
        const { unit: l, amount: u } = c.currency, d = s(a, l);
        if (!t.includes(l) || !e(u) || !u || !e(d) || !e(d + u)) throw new m("CurrencyChanged");
        if (await a.update({
          [i(l)]: d + u,
          [`flags.${f}.currencyReceipts.${o.id}`]: qe(c)
        }), !ee(a, c, o)) throw new m("TransferFailed");
      });
    },
    sourcePlan(a, c) {
      const { unit: o, amount: r } = c.currency, l = s(a.actor, o);
      if (!t.includes(o) || !e(l) || !e(r) || r <= 0 || l < r) throw new m("CurrencyChanged");
      return { currency: o, before: l, after: l - r };
    },
    async debit(a, c, o) {
      return Ce.run(N(a.actor), async () => {
        const r = a.actor;
        if (ee(r, c, o, !0)) return;
        const l = o.source;
        if (s(r, l.currency) !== l.before) throw new m("CurrencyChanged");
        if (await r.update({
          [i(l.currency)]: l.after,
          [`flags.${f}.currencyDebits.${o.id}`]: qe(c)
        }), !ee(r, c, o, !0)) throw new m("CurrencyChanged");
      });
    },
    async cleanup(a, c, o, r) {
      for (const [l, u] of [[c, "currencyReceipts"], [a.actor, "currencyDebits"]])
        try {
          await Ce.run(N(l), () => l.update({ [`flags.${f}.${u}.-=${r.id}`]: null }));
        } catch (d) {
          console.warn("HoloSuite Loot | Could not clean committed currency receipt", d);
        }
    }
  };
}
const yt = Je({
  units: ["cp", "sp", "ep", "gp", "pp"],
  amountOf: (t, s) => {
    var i, e;
    return (e = (i = t == null ? void 0 : t.system) == null ? void 0 : i.currency) == null ? void 0 : e[s];
  },
  path: (t) => `system.currency.${t}`,
  valid: (t) => Number.isSafeInteger(t) && t >= 0,
  name: (t) => {
    var e, n, a, c, o;
    const s = (a = (n = (e = globalThis.CONFIG) == null ? void 0 : e.DND5E) == null ? void 0 : n.currencies) == null ? void 0 : a[t], i = typeof s == "string" ? s : s == null ? void 0 : s.label;
    return i ? ((o = (c = globalThis.game) == null ? void 0 : c.i18n) == null ? void 0 : o.localize(i)) ?? i : t.toUpperCase();
  }
}), pt = Je({
  units: ["swade"],
  amountOf: (t) => {
    var s, i;
    return (i = (s = t == null ? void 0 : t.system) == null ? void 0 : s.details) == null ? void 0 : i.currency;
  },
  path: () => "system.details.currency",
  valid: (t) => Number.isFinite(t) && t >= 0 && t <= Number.MAX_SAFE_INTEGER,
  name: () => {
    var t, s, i;
    return ((i = (s = (t = globalThis.game) == null ? void 0 : t.settings) == null ? void 0 : s.get("swade", "currencyName")) == null ? void 0 : i.trim()) || "Currency";
  }
});
function Fe(t) {
  var i;
  const s = $(t.toObject());
  delete s._id, delete s.folder, delete s.ownership, delete s._stats, (i = s.flags) == null || delete i[f];
  for (const e of s.effects ?? [])
    delete e._id, e.origin = null;
  return s;
}
async function ge(t) {
  if (t.actorLink && await t.update({ actorLink: !1 }), t.actorLink) throw new m("SourceChanged");
}
class We {
  constructor() {
    R(this, "manual", !1);
  }
  received(s, i, e) {
    var n;
    return ((n = s.items.get(e.itemId)) == null ? void 0 : n.getFlag(f, "claim")) === e.id;
  }
  async create(s, i, e) {
    const n = s.items.get(e.itemId);
    if (n) {
      if (n.getFlag(f, "claim") !== e.id) throw new m("RecoveryRequired");
      return n;
    }
    const a = $(i.data);
    a._id = e.itemId, a.flags ?? (a.flags = {}), a.flags[f] = { claim: e.id };
    const [c] = await s.createEmbeddedDocuments("Item", [a], { keepId: !0 });
    if (!c || (this.manual ? !this.received(s, i, e) : c.id !== e.itemId))
      throw new m("TransferFailed");
    return c;
  }
}
class xe extends We {
  constructor() {
    super(...arguments);
    R(this, "id", "dnd5e");
    R(this, "balanceCurrency", yt);
  }
  currencyEntries(i) {
    return this.balanceCurrency.entries(i);
  }
  received(i, e, n) {
    var a;
    return ((a = e.currency) == null ? void 0 : a.storage) === "balance" ? this.balanceCurrency.received(i, e, n) : super.received(i, e, n);
  }
  async cleanup(i, e, n, a) {
    var c;
    ((c = n.currency) == null ? void 0 : c.storage) === "balance" && await this.balanceCurrency.cleanup(i, e, n, a);
  }
  destination(i) {
    return i.type === "character";
  }
  eligible(i) {
    var r, l, u, d, p;
    const e = i.system, n = (r = e == null ? void 0 : e.constructor) == null ? void 0 : r.metadata;
    if (!["weapon", "equipment", "consumable", "tool", "loot", "container"].includes(i.type) || (n == null ? void 0 : n.inventoryItem) === !1) return !1;
    const c = (u = (l = e == null ? void 0 : e.schema) == null ? void 0 : l.getField) == null ? void 0 : u.call(l, "quantity");
    if (e != null && e.schema && !c || !Number.isSafeInteger(e == null ? void 0 : e.quantity) || e.quantity <= 0) return !1;
    const o = ((d = e.type) == null ? void 0 : d.value) ?? e.weaponType ?? ((p = e.armor) == null ? void 0 : p.type);
    return !["natural", "siege", "vehicle", "currency"].includes(o);
  }
  snapshot(i) {
    const e = Fe(i);
    return e.system.container = null, "equipped" in e.system && (e.system.equipped = !1), "attuned" in e.system && (e.system.attuned = !1), e.system.attunement === 2 && (e.system.attunement = 1), e;
  }
  async create(i, e, n, a) {
    var c;
    return ((c = e.currency) == null ? void 0 : c.storage) === "balance" ? this.balanceCurrency.grant(i, e, n, a) : super.create(i, e, n);
  }
  preview(i) {
    var n, a;
    const e = $(i.data);
    return e.system.identified !== !1 ? e : {
      name: ((n = e.system.unidentified) == null ? void 0 : n.name) || "Unidentified Item",
      img: e.img,
      type: "loot",
      system: { quantity: e.system.quantity, identified: !1, description: { value: ((a = e.system.unidentified) == null ? void 0 : a.description) ?? "" } }
    };
  }
  async sourceClaim(i, e) {
    var c, o, r, l, u;
    if (!((c = e.source) != null && c.itemId) && ((o = e.currency) == null ? void 0 : o.storage) !== "balance") return null;
    if ((r = e.source) != null && r.ruleKey && e.source.ruleKey !== `${i.actorId ?? ((l = i.actor) == null ? void 0 : l.id) ?? ""}:${e.source.itemId}`)
      throw new m("SourceChanged");
    if (await ge(i), ((u = e.currency) == null ? void 0 : u.storage) === "balance") return this.balanceCurrency.sourcePlan(i, e);
    const n = i.actor.items.get(e.source.itemId), a = n == null ? void 0 : n.system.quantity;
    if (!this.eligible(n ?? {}) || a < e.data.system.quantity || e.source.ruleKey && n.type !== e.data.type) throw new m("SourceChanged");
    return { itemId: n.id, before: a, after: a - e.data.system.quantity };
  }
  validateSourcePlan(i, e, n) {
    var o, r, l, u;
    if (!((o = e.source) != null && o.ruleKey)) return;
    const a = (l = i.actor) == null ? void 0 : l.items.get((r = n.source) == null ? void 0 : r.itemId);
    if (i.actorLink || e.source.ruleKey !== `${i.actorId ?? ((u = i.actor) == null ? void 0 : u.id) ?? ""}:${a == null ? void 0 : a.id}` || !this.eligible(a ?? {}) || a.type !== e.data.type || a.system.quantity !== n.source.before)
      throw new m("SourceChanged");
    const c = n.source.sfCurrency;
    if (c) {
      const d = this.entryMetadata(a).currency;
      if ((d == null ? void 0 : d.unit) !== c.unit || (d == null ? void 0 : d.amount) !== c.amount) throw new m("CurrencyChanged");
    }
  }
  async removeSource(i, e, n) {
    const a = n.source;
    if (!a) return;
    if (await ge(i), a.currency) return this.balanceCurrency.debit(i, e, n);
    const c = i.actor.items.get(a.itemId);
    if (!c || c.getFlag(f, "sourceClaim") === n.id) return;
    if (c.system.quantity !== a.before) throw new m("SourceChanged");
    a.after === 0 ? await i.actor.deleteEmbeddedDocuments("Item", [c.id]) : await c.update({ "system.quantity": a.after, [`flags.${f}.sourceClaim`]: n.id });
    const o = i.actor.items.get(a.itemId);
    if (a.after === 0 ? o : (o == null ? void 0 : o.system.quantity) !== a.after || (o == null ? void 0 : o.getFlag(f, "sourceClaim")) !== n.id) throw new m("SourceChanged");
  }
}
class wt extends xe {
  constructor() {
    super(...arguments);
    R(this, "id", "sf2e");
  }
  currencyEntries() {
    return [];
  }
  eligible(i) {
    var n, a;
    return ["ammo", "armor", "backpack", "book", "consumable", "equipment", "shield", "treasure", "weapon"].includes(i.type) && (i.isOfType ? i.isOfType("physical") : !0) && !(i.type === "weapon" && ((n = i.system) == null ? void 0 : n.category) === "unarmed") && Number.isSafeInteger((a = i.system) == null ? void 0 : a.quantity) && i.system.quantity > 0;
  }
  snapshot(i) {
    var n, a, c, o, r;
    const e = $(i.toObject());
    delete e._id, delete e.folder, delete e.ownership, delete e._stats, (n = e.flags) == null || delete n[f], (c = (a = e.flags) == null ? void 0 : a.pf2e) == null || delete c.grantedBy, (r = (o = e.flags) == null ? void 0 : o.pf2e) == null || delete r.itemGrants, e.system.containerId = null, e.system.description && delete e.system.description.gm, e.system.equipped && (e.system.equipped = { carryType: "stowed", handsHeld: 0, invested: !1 });
    for (const l of e.effects ?? [])
      delete l._id, l.origin = null;
    return e;
  }
  entryMetadata(i, e = ((n) => (n = i.system) == null ? void 0 : n.quantity)()) {
    var r, l, u, d;
    const a = i.isCurrency ? i.unit : null, c = a ? i.assetValue : null, o = e === ((r = i.system) == null ? void 0 : r.quantity) ? c == null ? void 0 : c[a] : (d = (u = c == null ? void 0 : (l = c.constructor).fromPrice) == null ? void 0 : u.call(l, i.price, e)) == null ? void 0 : d[a];
    return a && Number.isSafeInteger(o) && o > 0 ? { currency: { storage: "item", unit: a, amount: o } } : {};
  }
  async sourceClaim(i, e) {
    var r;
    const n = await super.sourceClaim(i, e);
    if (((r = e.currency) == null ? void 0 : r.storage) !== "item") return n;
    const a = i.actor.items.get(e.source.itemId), c = this.entryMetadata(a).currency, o = this.entryMetadata(a, e.data.system.quantity).currency;
    if ((o == null ? void 0 : o.unit) !== e.currency.unit || (o == null ? void 0 : o.amount) !== e.currency.amount || !e.source.ruleKey && a.system.quantity !== e.data.system.quantity) throw new m("CurrencyChanged");
    return { ...n, sfCurrency: { unit: c.unit, amount: c.amount } };
  }
  async removeSource(i, e, n) {
    var c;
    const a = (c = n.source) != null && c.itemId ? i.actor.items.get(n.source.itemId) : null;
    if (a && n.source.sfCurrency) {
      const o = this.entryMetadata(a).currency;
      if ((o == null ? void 0 : o.unit) !== n.source.sfCurrency.unit || (o == null ? void 0 : o.amount) !== n.source.sfCurrency.amount) throw new m("CurrencyChanged");
    }
    return super.removeSource(i, e, n);
  }
  preview(i) {
    var a, c, o, r;
    const e = $(i.data);
    if (((a = e.system.identification) == null ? void 0 : a.status) === "identified") return e;
    const n = (c = e.system.identification) == null ? void 0 : c.unidentified;
    return {
      name: (n == null ? void 0 : n.name) || "Unidentified Item",
      img: (n == null ? void 0 : n.img) || e.img,
      type: "equipment",
      system: { quantity: e.system.quantity, description: { value: ((r = (o = n == null ? void 0 : n.data) == null ? void 0 : o.description) == null ? void 0 : r.value) ?? "" } }
    };
  }
}
class vt extends We {
  constructor() {
    super(...arguments);
    R(this, "manual", !0);
  }
  destination(i) {
    return !!i.items && typeof i.createEmbeddedDocuments == "function";
  }
  eligible(i) {
    return !!(i != null && i.id) && typeof i.toObject == "function";
  }
  snapshot(i) {
    return Fe(i);
  }
  preview(i) {
    var a, c, o, r, l, u;
    const { data: e } = i;
    if (((a = e.system) == null ? void 0 : a.identified) !== !1 && ((o = (c = e.system) == null ? void 0 : c.identification) == null ? void 0 : o.status) !== "unidentified") return $(e);
    const n = ((r = e.system) == null ? void 0 : r.unidentified) ?? ((u = (l = e.system) == null ? void 0 : l.identification) == null ? void 0 : u.unidentified);
    return { name: (n == null ? void 0 : n.name) || "Unidentified Item", type: e.type, img: (n == null ? void 0 : n.img) || e.img };
  }
  received(i, e, n) {
    return super.received(i, e, n) || i.items.some((a) => a.getFlag(f, "claim") === n.id);
  }
  async create(i, e, n, a) {
    if (n.itemAttempted || !a) throw new m("RecoveryRequired");
    return await a(), super.create(i, e, n);
  }
  async sourceClaim(i, e) {
    var a;
    await ge(i);
    const n = { itemId: (a = e.source) == null ? void 0 : a.itemId };
    return this.validateSourcePlan(i, e, { source: n }), n;
  }
  validateSourcePlan(i, e, n) {
    var o, r, l, u, d;
    const a = (o = n.source) == null ? void 0 : o.itemId, c = (r = i.actor) == null ? void 0 : r.items.get(a);
    if (i.actorLink || !e.wholeItem || a !== ((l = e.source) == null ? void 0 : l.itemId) || ((u = e.source) == null ? void 0 : u.ruleKey) !== `${i.actorId ?? ((d = i.actor) == null ? void 0 : d.id) ?? ""}:${a}` || !this.eligible(c) || Z(this.snapshot(c)) !== Z(e.data))
      throw new m("SourceChanged");
  }
  async removeSource(i, e, n) {
    var c, o, r;
    await ge(i);
    const a = (c = n.source) == null ? void 0 : c.itemId;
    if (!a || !e.wholeItem || ((o = e.source) == null ? void 0 : o.ruleKey) !== `${i.actorId ?? ((r = i.actor) == null ? void 0 : r.id) ?? ""}:${a}`)
      throw new m("RecoveryRequired");
    if (i.actor.items.get(a) && (this.validateSourcePlan(i, e, n), await i.actor.deleteEmbeddedDocuments("Item", [a]), i.actor.items.get(a)))
      throw new m("SourceChanged");
  }
}
const B = new vt();
class bt extends xe {
  constructor() {
    super(...arguments);
    R(this, "id", "swade");
    R(this, "balanceCurrency", pt);
    R(this, "currencySnapshotVersion", 2);
  }
  allowsStoredItem(i) {
    var e;
    return ["weapon", "armor", "shield", "gear", "consumable"].includes(i == null ? void 0 : i.type) && i.isPhysicalItem !== !1 && !i.grantedBy && !((e = i.system) != null && e.isNaturalArmor);
  }
  eligible(i) {
    var e;
    return this.allowsStoredItem(i) && Number.isSafeInteger((e = i.system) == null ? void 0 : e.quantity) && i.system.quantity > 0;
  }
  snapshot(i) {
    return this.carriedData(Fe(i));
  }
  carriedData(i) {
    var e, n;
    return "equipStatus" in i.system && (i.system.equipStatus = 1), (n = (e = i.flags) == null ? void 0 : e.swade) == null || delete n.hasGranted, i;
  }
  preview(i) {
    return $(i.data);
  }
  received(i, e, n) {
    return e.wholeItem ? B.received(i, e, n) : super.received(i, e, n);
  }
  async create(i, e, n, a) {
    return e.wholeItem ? B.create(i, { ...e, data: this.carriedData($(e.data)) }, n, a) : super.create(i, e, n, a);
  }
  async sourceClaim(i, e) {
    var n, a;
    if (((n = e.currency) == null ? void 0 : n.storage) !== "balance" && !this.eligible(e.data)) throw new m("SourceChanged");
    if (!e.wholeItem) return super.sourceClaim(i, e);
    if (!this.eligible(i.actor.items.get((a = e.source) == null ? void 0 : a.itemId))) throw new m("SourceChanged");
    return B.sourceClaim(i, e);
  }
  validateSourcePlan(i, e, n) {
    var a;
    if (!e.wholeItem) return super.validateSourcePlan(i, e, n);
    if (!this.eligible(i.actor.items.get((a = n.source) == null ? void 0 : a.itemId))) throw new m("SourceChanged");
    return B.validateSourcePlan(i, e, n);
  }
  async removeSource(i, e, n) {
    return e.wholeItem ? B.removeSource(i, e, n) : super.removeSource(i, e, n);
  }
}
const ke = /* @__PURE__ */ new Map([["dnd5e", new xe()], ["sf2e", new wt()], ["swade", new bt()]]);
function St(t, s) {
  ke.set(t, s);
}
function It(t) {
  return ke.get(t) ?? B;
}
function Pe(t) {
  if (!t.claim.quantityRoll) return t;
  const s = $(t.data);
  return s.system.quantity = t.claim.quantityRoll.quantity, { ...t, data: s };
}
class Rt {
  constructor(s) {
    R(this, "queue", new be());
    this.io = s;
  }
  async collected(s, i, e, n) {
    var c, o, r, l;
    const a = Pe(e);
    if (e.claim.quantityRoll) {
      try {
        await ((o = (c = this.io).quantityRolled) == null ? void 0 : o.call(c, a, n));
      } catch (u) {
        console.warn("HoloSuite Loot | Could not post quantity roll", u);
      }
      if (!e.claim.quantityRoll.quantity) return;
    }
    try {
      await ((l = (r = this.io).collected) == null ? void 0 : l.call(r, { token: s, actor: i, entry: a, adapter: n }));
    } catch (u) {
      console.warn("HoloSuite Loot | Could not post loot to chat", u);
    }
  }
  async execute(s, i) {
    if (!me(s)) throw new m("InvalidRequest");
    return this.queue.run(s.tokenUuid, async () => {
      var p, b, w, S, g, L, C, q, h, I;
      const e = this.io, n = await e.token(s.tokenUuid);
      if (!n) throw new m("Unavailable");
      const a = (v, y = e.environment()) => {
        if (!e.authority()) throw new m("NoGM");
        gt(n, i, y, v);
      }, c = e.environment();
      if (a(void 0, c), !i.isGM && c.inRange && (s.action === "view" || s.action === "inspect")) {
        const v = await ((p = e.destination) == null ? void 0 : p.call(e, { ...s, actorId: void 0 }, i, n));
        v && a(v);
      }
      const o = e.adapter();
      if (!o) throw new m("Unsupported");
      let r = await e.load(n, o);
      for (const v of r.entries.filter((y) => y.claim && !y.taken)) {
        a();
        const y = await e.actor(v.claim.actorId);
        if (!y) throw new m("RecoveryRequired");
        if (((b = v.claim.quantityRoll) == null ? void 0 : b.quantity) === 0 || (o.received ? o.received(y, v, v.claim) : ((w = y.items.get(v.claim.itemId)) == null ? void 0 : w.getFlag(e.moduleId, "claim")) === v.claim.id)) {
          await ((S = o.removeSource) == null ? void 0 : S.call(o, n, v, v.claim));
          const T = $(r);
          T.entries.find((O) => O.id === v.id).taken = !0, await e.save(n, T), r = T, await this.collected(n, y, v, o), await ((g = o.cleanup) == null ? void 0 : g.call(o, n, y, v, v.claim));
        }
      }
      if (s.action === "view") return e.summary(n, r);
      if (s.action === "inspect") {
        const v = r.entries.find((y) => y.id === s.entryId && !y.taken && !y.hidden);
        if (!v || v.currency) throw new m("Unavailable");
        return { item: o.preview ? o.preview(v) : $(v.data) };
      }
      const l = e.destination ? await e.destination(s, i, n) : await e.actor(s.actorId);
      De(l, i, o, n), a(l);
      const u = r.entries.filter((v) => !v.taken && !v.hidden && (s.action === "all" || v.id === s.entryId));
      if (!u.length && s.action === "take") return e.summary(n, r);
      const d = [];
      for (const v of u)
        try {
          a(l), De(l, i, o, n);
          let y = r.entries.find((T) => T.id === v.id);
          if (y.claim && (y.claim.userId !== i.id || ![l.id, N(l)].includes(y.claim.actorId)))
            throw new m("RecoveryRequired");
          if (!y.claim) {
            const T = await ((L = o.sourceClaim) == null ? void 0 : L.call(o, n, y));
            a(l);
            let O;
            if (y.formula) {
              if (!T || !o.removeSource) throw new m("SourceChanged");
              O = await e.rollQuantity(y.formula), a(l);
            }
            const j = $(r);
            j.entries.find((z) => z.id === y.id).claim = {
              id: e.id(),
              itemId: e.id(),
              userId: i.id,
              actorId: N(l),
              ...O ? { quantityRoll: O } : {},
              ...T ? { source: T } : {}
            }, await e.save(n, j), r = j, y = r.entries.find((z) => z.id === v.id);
          }
          a(l), (C = o.validateSourcePlan) == null || C.call(o, n, y, y.claim), ((q = y.claim.quantityRoll) == null ? void 0 : q.quantity) !== 0 && await o.create(l, Pe(y), y.claim, async () => {
            const T = y.wholeItem ? "itemAttempted" : "currencyAttempted", O = $(r);
            O.entries.find((j) => j.id === y.id).claim[T] = !0, await e.save(n, O), r = O, y.claim[T] = !0;
          }), await ((h = o.removeSource) == null ? void 0 : h.call(o, n, y, y.claim));
          const A = $(r);
          A.entries.find((T) => T.id === y.id).taken = !0, await e.save(n, A), r = A, await this.collected(n, l, y, o), await ((I = o.cleanup) == null ? void 0 : I.call(o, n, l, y, y.claim));
        } catch (y) {
          if (d.push({ name: v.data.name, code: y.code ?? "TransferFailed" }), !e.authority()) break;
        }
      return { ...e.summary(n, r), failures: d };
    });
  }
}
const ye = "inventoryRules";
function Lt(t) {
  var i, e, n, a, c;
  const s = /^(?:Item\.[\w-]+|Compendium\.[\w-]+\.[\w-]+\.(?:Item\.)?[\w-]+)$/;
  return (c = [(i = t._stats) == null ? void 0 : i.compendiumSource, (e = t._stats) == null ? void 0 : e.duplicateSource, (a = (n = t.flags) == null ? void 0 : n.core) == null ? void 0 : a.sourceId].find((o) => typeof o == "string" && s.test(o))) == null ? void 0 : c.replace(/^(Compendium\.[^.]+\.[^.]+)\.(?!Item\.)/, "$1.Item.");
}
function _(t, s, i) {
  var e;
  if (s.balance) {
    const n = s.id;
    return { token: n, actor: i != null && i.id ? `${i.id}:${n}` : void 0 };
  }
  return {
    token: s.id ? `${t.actorId ?? ((e = t.actor) == null ? void 0 : e.id) ?? ""}:${s.id}` : void 0,
    actor: i != null && i.id && i.items.get(s.id) ? `${i.id}:${s.id}` : void 0,
    global: Lt(s)
  };
}
function W(t, s, i) {
  var e;
  for (const n of ["token", "actor", "global"]) {
    const a = t[n] && ((e = n === "token" ? s : i[n]) == null ? void 0 : e[t[n]]);
    if (a) return { rule: a, scope: n };
  }
  return { rule: { mode: "allow" }, scope: "default" };
}
function Se(t, s = "") {
  if (t === "inherit") return null;
  if (t === "allow" || t === "never") return { mode: t };
  if (t !== "quantity" || typeof s != "string" || s.length > 40) throw new m("InvalidRule");
  const i = s.trim().toLowerCase().replace(/\s+/g, "");
  if (/^\d+$/.test(i) && Number.isSafeInteger(Number(i))) return { mode: t, quantity: String(Number(i)) };
  const e = /^(\d{0,3})d([1-9]\d{0,4})(?:[+-]\d{1,6})?$/.exec(i);
  if (e && (e[1] === "" || Number(e[1]) > 0)) return { mode: t, quantity: e[1] ? i : `1${i}` };
  throw new m("InvalidRule");
}
async function Ct(t, s, i) {
  if (t.mode === "never") return 0;
  if (t.mode === "allow") return s;
  const { quantity: e } = Se(t.mode, t.quantity), n = /^\d+$/.test(e) ? Number(e) : await i(e);
  if (!Number.isSafeInteger(n)) throw new m("InvalidRule");
  return Math.min(s, Math.max(0, n));
}
const Xe = (t) => (t == null ? void 0 : t.mode) === "quantity" && !/^\d+$/.test(t.quantity);
function Ue(t, s, i) {
  const e = { ...t };
  for (const n of s)
    i ? e[n] = i : delete e[n];
  return e;
}
function Ae() {
  return game.users.contents.filter((t) => {
    var s;
    return t.active && t.isGM && ((s = t.getFlag) == null ? void 0 : s.call(t, f, "transportVersion")) === he;
  }).sort((t, s) => t.id.localeCompare(s.id))[0];
}
const E = () => {
  var t;
  return ((t = Ae()) == null ? void 0 : t.id) === game.user.id;
}, Ye = "lootRange", Ze = 15;
function He() {
  const t = game.settings.get(f, Ye);
  return Number.isFinite(t) ? Math.max(0, t) : Ze;
}
function qt(t, s, i) {
  var e, n, a;
  return ((e = t.getCenterPoint) == null ? void 0 : e.call(t, i)) ?? ((a = (n = t.object) == null ? void 0 : n.getCenterPoint) == null ? void 0 : a.call(n, i)) ?? {
    x: i.x + t.width * (s.sizeX ?? s.size) / 2,
    y: i.y + t.height * (s.sizeY ?? s.size) / 2
  };
}
function Ge(t, s) {
  var c;
  const { x: i, y: e } = t._source ?? t, n = { x: i, y: e };
  if (s.isSquare && s.getOffsetRange) {
    const o = t.width * s.size, r = t.height * s.size, [l, u, d, p] = s.getOffsetRange({ ...n, width: o, height: r }), b = [];
    for (let w = l; w < d; w++)
      for (let S = u; S < p; S++) b.push(s.getCenterPoint({ i: w, j: S }));
    if (b.length) return b;
  }
  const a = (c = t.getOccupiedGridSpaceOffsets) == null ? void 0 : c.call(t, { ...n, level: null });
  return a != null && a.length ? a.map(({ i: o, j: r }) => s.getCenterPoint({ i: o, j: r })) : [qt(t, s, n)];
}
function Tt(t, s, i, e, n) {
  var u;
  const a = t.parent, c = a == null ? void 0 : a.grid;
  if (!(c != null && c.measurePath)) return !1;
  const o = (u = c.units) == null ? void 0 : u.trim().toLowerCase().replace(/\.$/, ""), r = /^(m|meters?|metres?)$/.test(o ?? "") ? e * 0.3048 : /^(yd|yards?)$/.test(o ?? "") ? e / 3 : e, l = Ge(t, c);
  return Array.from(a.tokens ?? []).some((d) => {
    const p = d.actor;
    return d.id === t.id || d.hidden || !J(p, s, i, t) || n && N(p) !== N(n) ? !1 : Ge(d, c).some(({ x: b, y: w }) => l.some((S) => c.measurePath([{ x: b, y: w }, { x: S.x, y: S.y }]).distance <= r + 1e-8));
  });
}
function Mt(t, s) {
  var a, c;
  const i = t.parent;
  if (((a = canvas.scene) == null ? void 0 : a.id) !== i.id) return !1;
  if (!i.tokenVision) return !0;
  const e = t.object;
  if (!e) return !1;
  const n = globalThis.CONFIG;
  return (c = t.hasStatusEffect) != null && c.call(t, n.specialStatusEffects.INVISIBLE) ? !1 : canvas.tokens.placeables.some((o) => {
    var l, u, d, p, b, w, S, g, L, C, q, h, I, v;
    if (o.document.hidden || !((l = o.document.sight) != null && l.enabled) || !((u = o.actor) != null && u.testUserPermission(s, "OWNER")) || (p = (d = o.document).hasStatusEffect) != null && p.call(d, n.specialStatusEffects.BLIND)) return !1;
    let r;
    try {
      const y = o.document.sight, A = ((w = (b = o.document).getVisionOrigin) == null ? void 0 : w.call(b)) ?? { ...o.center, elevation: o.document.elevation };
      if (r = new n.Canvas.visionSourceClass({ object: o, sourceId: `hololoot-${s.id}-${o.id}` }), r.initialize({
        x: A.x,
        y: A.y,
        elevation: A.elevation,
        ...o.document.level != null ? { level: o.document.level } : {},
        rotation: o.document.rotation,
        radius: o.sightRange,
        lightRadius: o.lightPerceptionRange ?? canvas.dimensions.maxR,
        externalRadius: o.externalRadius,
        angle: y.angle,
        visionMode: y.visionMode,
        color: y.color,
        contrast: y.contrast,
        saturation: y.saturation,
        brightness: y.brightness,
        attenuation: y.attenuation
      }), r.isBlinded || !((S = r.los) != null && S.contains(e.center.x, e.center.y))) return !1;
      if ((g = r.shape) != null && g.contains(e.center.x, e.center.y)) return !0;
      const T = (L = canvas.environment) == null ? void 0 : L.globalLightSource;
      return (T ? T.active && ((C = T.shape) == null ? void 0 : C.contains(e.center.x, e.center.y)) : i.globalLight && (i.globalLightThreshold == null || i.darkness <= i.globalLightThreshold)) && ((q = r.light) != null && q.contains(e.center.x, e.center.y)) ? !0 : !!((h = r.light) != null && h.contains(e.center.x, e.center.y)) && !!((v = (I = canvas.effects) == null ? void 0 : I.lightSources) != null && v.some((j) => {
        var z;
        return j.active && ((z = j.shape) == null ? void 0 : z.contains(e.center.x, e.center.y));
      }));
    } catch {
      return !1;
    } finally {
      r == null || r.destroy();
    }
  });
}
function Ft(t) {
  const s = game.settings.get(f, "zeroHP"), i = t ? He() : 0;
  return {
    combats: game.combats.contents,
    automatic: s,
    zeroHP: s,
    manual: !!(t != null && t.manual),
    visible: Mt,
    inRange: i > 0 ? (e, n, a) => Tt(e, n, t, i, a) : void 0
  };
}
const xt = new be(), Ie = (t) => game.journal.find((s) => s.getFlag(f, "tokenUuid") === t.uuid && s.getFlag(f, "kind") === "snapshot"), ne = () => game.settings.get(f, ye) ?? {}, ae = (t) => {
  var s;
  return (s = game.actors) == null ? void 0 : s.get(t.actorId);
}, et = async (t) => {
  var i, e;
  const s = ((e = (i = globalThis.foundry) == null ? void 0 : i.dice) == null ? void 0 : e.Roll) ?? globalThis.Roll;
  return new s(t).evaluate({ allowInteractive: !1 });
}, oe = (t, s) => {
  var i, e;
  return ((e = (i = t.actor) == null ? void 0 : i.items) == null ? void 0 : e.filter((n) => s.eligible(n))) ?? [];
}, pe = (t, s) => {
  var i;
  return (((i = s.currencyEntries) == null ? void 0 : i.call(s, t.actor)) ?? []).map((e) => ({
    ...e.data,
    id: `currency:${e.currency.unit}`,
    balance: e
  }));
}, Te = (t) => Y(t).source === "custom", we = (t) => JSON.parse((t == null ? void 0 : t.getFlag(f, "rules")) ?? "{}"), G = (t) => `flags.${f}.${t}`, ve = ({ id: t, hidden: s }) => ({ id: t, taken: !1, ...s ? { hidden: !0 } : {} }), tt = (t) => t.mode === "quantity" ? t.quantity : t.mode, k = (t, s) => t.setFlag(f, "state", {
  ...s,
  entries: s.entries.map((i) => {
    var a;
    if (!((a = i.claim) != null && a.quantityRoll)) return i;
    const { quantityRoll: e, ...n } = i.claim;
    return { ...i, claim: n };
  })
}), it = (t, s, i) => {
  var e, n;
  return Xe(i) && s.sourceClaim && s.removeSource && !t.balance && !((n = (e = s.entryMetadata) == null ? void 0 : e.call(s, t)) != null && n.currency);
};
async function At(t) {
  const s = Se("quantity", t);
  if (!Xe(s)) throw new m("InvalidRule");
  const i = await et(s.quantity);
  if (!Number.isSafeInteger(i.total)) throw new m("InvalidRule");
  return { quantity: Math.max(0, i.total), roll: i.toJSON() };
}
function st(t, s, i) {
  const e = Z(i), n = t.filter((a) => Z(s.snapshot(a)) === e);
  return n.length === 1 && n[0].id ? n[0] : void 0;
}
async function te(t, s, i, e, { original: n, previousRoll: a, legacyRollCeiling: c, onRoll: o } = {}) {
  var S;
  const r = t.balance ? structuredClone(t.balance.data) : s.snapshot(t);
  if (s.manual) return { id: foundry.utils.randomID(), data: r, wholeItem: !0, source: { itemId: t.id, ruleKey: i } };
  const l = n ?? r.system.quantity, u = Math.min(l, r.system.quantity), d = a === void 0 && c === void 0 && it(t, s, e) ? e.quantity : void 0;
  let p, b;
  const w = d ? u : await Ct(e, u, async (g) => {
    if (a === void 0 && c !== void 0)
      return b = c, b;
    if (a !== void 0)
      p = a;
    else {
      const L = await et(g);
      p = L.total, o == null || o(L);
    }
    return p;
  });
  return r.system.quantity = w, {
    id: foundry.utils.randomID(),
    data: r,
    originalQuantity: l,
    limit: tt(e),
    hidden: w === 0,
    ...d ? { formula: d } : {},
    ...p === void 0 ? {} : { rolledQuantity: p },
    ...b === void 0 ? {} : { rollCeiling: b },
    ...t.balance ? { currency: { ...t.balance.currency, amount: w } } : { ...t.id ? { source: { itemId: t.id, ruleKey: i } } : {}, ...(S = s.entryMetadata) == null ? void 0 : S.call(s, t, w) }
  };
}
function nt(t, s) {
  var u, d, p;
  const i = Ie(t), e = i == null ? void 0 : i.getFlag(f, "state"), n = i == null ? void 0 : i.getFlag(f, "items"), a = new Map(Array.isArray(n) ? n.map((b) => [b.id, b]) : []), c = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), r = [...oe(t, s), ...pe(t, s)], l = s.snapshot && !Te(t) && !((u = t.getFlag(f, "config")) != null && u.customId);
  for (const b of (e == null ? void 0 : e.entries) ?? []) {
    const w = a.get(b.id);
    if (((d = w == null ? void 0 : w.currency) == null ? void 0 : d.storage) === "balance")
      c.set(`currency:${w.currency.unit}`, { ...w, ...b });
    else if ((p = w == null ? void 0 : w.source) != null && p.ruleKey)
      c.set(w.source.ruleKey, { ...w, ...b });
    else if (l && (w != null && w.data) && !w.currency && !w.source) {
      const S = st(r.filter((L) => !L.balance), s, w.data);
      if (!S) continue;
      const g = _(t, S).token;
      o.set(g, o.has(g) ? null : { ...w, ...b });
    }
  }
  for (const [b, w] of o) w && !c.has(b) && c.set(b, w);
  return {
    vault: i,
    state: e,
    byId: a,
    byKey: c,
    items: r,
    corpse: we(i),
    shared: ne(),
    locked: Te(t) || !e && (t.getFlag(f, "state") || i && !i.getFlag(f, "draft"))
  };
}
function Ht(t, s) {
  const { state: i, byKey: e, items: n, corpse: a, shared: c, locked: o } = nt(t, s), r = ae(t);
  return n.map((l) => {
    var b, w;
    const u = _(t, l, r), d = e.get(u.token), p = o ? "RuleLocked" : !u.token || i && !d ? "RuleMissingSnapshot" : d != null && d.taken ? "RuleCollected" : d != null && d.claim ? "RuleReserved" : "";
    return {
      id: l.id,
      name: l.name,
      img: l.img,
      quantity: l.system.quantity,
      entry: d,
      effective: W(u, a, c),
      overrides: { token: a[u.token], actor: (b = c.actor) == null ? void 0 : b[u.actor], global: (w = c.global) == null ? void 0 : w[u.global] },
      canToken: !p,
      tokenUnavailable: p,
      canActor: !!u.actor,
      canGlobal: !!u.global
    };
  });
}
async function $t(t, s, i, e, n) {
  if (!E()) throw new m("RuleGM");
  const { vault: a, state: c, byId: o, byKey: r, items: l, corpse: u, shared: d, locked: p } = nt(t, s), b = ae(t), w = l.filter((h) => e.includes(h.id)).map((h) => ({ item: h, key: _(t, h, b)[i] }));
  if (!e.length || w.length !== e.length || w.some(({ key: h }) => !h)) throw new m("RuleScopeUnavailable");
  const S = w.map(({ key: h }) => h);
  if (i === "actor" || i === "global")
    return xt.run(ye, async () => {
      if (!E()) throw new m("RuleGM");
      const h = ne(), I = { ...h, [i]: Ue(h[i], S, i === "global" && (n == null ? void 0 : n.mode) === "allow" ? null : n) };
      await game.settings.set(f, ye, I);
    });
  if (i !== "token" || p) throw new m("RuleScopeUnavailable");
  if (c && S.some((h) => {
    const I = r.get(h);
    return !I || I.taken || I.claim;
  })) throw new m("RuleScopeUnavailable");
  const g = Ue(u, S, n);
  if (!a) {
    Object.keys(g).length && await at(t, [], { rules: JSON.stringify(g), draft: !0 });
    return;
  }
  if (!c) {
    await a.setFlag(f, "rules", JSON.stringify(g));
    return;
  }
  const L = /* @__PURE__ */ new Map(), C = [];
  for (const { item: h, key: I } of w) {
    const v = r.get(I), y = W(_(t, h, b), g, d).rule;
    if (v.limit !== tt(y) || !v.formula && it(h, s, y)) {
      let A;
      const T = await te(h, s, I, y, {
        original: v.originalQuantity ?? v.data.system.quantity,
        onRoll: (O) => {
          A = O;
        }
      });
      L.set(v.id, T), A && C.push({ roll: A, itemName: h.name, quantity: T.data.system.quantity });
    }
  }
  if (!E()) throw new m("RuleGM");
  const q = {
    ...c,
    vaultId: a.id,
    entries: c.entries.map((h) => L.has(h.id) ? ve(L.get(h.id)) : h)
  };
  return await a.update({
    [G("rules")]: JSON.stringify(g),
    [G("state")]: q,
    [G("items")]: Array.from(o.values(), (h) => L.get(h.id) ?? h)
  }), await k(t, q), C;
}
async function at(t, s, i) {
  var a, c;
  const n = await (((c = (a = globalThis.foundry) == null ? void 0 : a.documents) == null ? void 0 : c.JournalEntry) ?? globalThis.JournalEntry).create({
    name: `HoloLoot · ${t.name}`,
    ownership: { default: 0 },
    flags: { [f]: { tokenUuid: t.uuid, kind: "snapshot", items: structuredClone(s), ...i } }
  });
  if (!n) throw new m("PersistenceFailed");
  return n.id;
}
function fe(t, s, i) {
  const e = game.journal.get(t);
  if (!e || e.getFlag(f, "tokenUuid") !== s.uuid || e.getFlag(f, "kind") !== i) throw new m("RecoveryRequired");
  const n = e.getFlag(f, "items");
  if (!Array.isArray(n)) throw new m("RecoveryRequired");
  return structuredClone(n);
}
function ot(t, s) {
  const i = Y(t);
  return !!(t.actor && (s.manual || i.source !== "custom" && !i.customId) && s.sourceClaim && s.removeSource);
}
function Et(t, s) {
  var c;
  const i = Ie(t), e = new Set((c = i == null ? void 0 : i.getFlag(f, "state")) == null ? void 0 : c.entries.filter((o) => !o.taken).map((o) => o.id)), n = i == null ? void 0 : i.getFlag(f, "items"), a = new Set((Array.isArray(n) ? n : []).filter((o) => o.wholeItem && e.has(o.id)).map((o) => {
    var r;
    return (r = o.source) == null ? void 0 : r.ruleKey;
  }));
  return oe(t, s).map((o) => ({
    id: o.id,
    name: o.name,
    img: o.img,
    selected: a.has(_(t, o, null).token)
  }));
}
async function Ot(t, s, i, e) {
  if (!E()) throw new m("RuleGM");
  if (!s.manual || !["enabled", "disabled"].includes(i)) throw new m("InvalidRequest");
  await rt(t, s, { mode: i, ids: new Set(e) }), await t.setFlag(f, "config", { mode: i, source: "inventory" });
}
async function rt(t, s, i) {
  var C, q;
  if (!E()) throw new m("RuleGM");
  if (!ot(t, s) || s.manual && !i) throw new m("RefreshUnsupported");
  const e = Ie(t), n = e == null ? void 0 : e.getFlag(f, "state");
  if (!n) {
    await $e(t, s, i);
    return;
  }
  if (n.version !== 1) throw new m("RecoveryRequired");
  const a = n.entries.filter((h) => h.claim || h.taken), c = (h) => {
    var I, v, y, A;
    return ((v = (I = h.claim) == null ? void 0 : I.source) == null ? void 0 : v.itemId) || ((A = (y = h.claim) == null ? void 0 : y.source) == null ? void 0 : A.currency) && `currency:${h.claim.source.currency}`;
  };
  if (a.length && t.actorLink || a.some((h) => !c(h)))
    throw new m("RefreshUntracked");
  const o = new Set(a.filter((h) => !h.taken).map(c)), r = fe(e.id, t, "snapshot"), l = new Map(r.map((h) => [h.id, h]));
  if (a.some((h) => !h.taken && !l.has(h.id))) throw new m("RecoveryRequired");
  const u = /* @__PURE__ */ new Map();
  for (const h of n.entries) {
    const I = l.get(h.id), v = ((C = I == null ? void 0 : I.source) == null ? void 0 : C.ruleKey) || ((q = I == null ? void 0 : I.currency) == null ? void 0 : q.storage) === "balance" && `currency:${I.currency.unit}`;
    v && u.set(v, { saved: I, taken: h.taken });
  }
  const d = (h, I) => (I && !I.taken && Z({ ...h, id: I.saved.id }) === Z(I.saved) && (h.id = I.saved.id), h), p = ae(t), b = we(e), w = ne(), S = [];
  for (const h of [...oe(t, s), ...pe(t, s)]) {
    if (o.has(h.id) || s.manual && !(i != null && i.ids.has(h.id))) continue;
    const I = _(t, h, p), v = u.get(I.token), y = v == null ? void 0 : v.saved.limit, A = y === void 0 ? W(I, b, w).rule : Se(y === "allow" || y === "never" ? y : "quantity", y), T = v == null ? void 0 : v.saved.rolledQuantity, O = y === void 0 || v.saved.formula ? void 0 : v.saved.rollCeiling ?? v.saved.data.system.quantity;
    S.push(d(await te(h, s, I.token, A, { previousRoll: T, legacyRollCeiling: O }), v));
  }
  if (!E()) throw new m("RuleGM");
  const g = {
    ...n,
    vaultId: e.id,
    currencyReady: s.currencySnapshotVersion ?? !0,
    entries: [...a, ...S.map(ve)]
  }, L = a.flatMap((h) => l.has(h.id) ? [l.get(h.id)] : []);
  await e.update({
    [G("state")]: g,
    [G("items")]: [...L, ...S],
    ...i ? { [G("manualMode")]: i.mode } : {}
  }), await k(t, g);
}
async function $e(t, s, i) {
  const e = Ie(t);
  if (s.manual && !i && (e == null ? void 0 : e.getFlag(f, "manualMode")) !== "enabled") throw new m("Unavailable");
  let n = e == null ? void 0 : e.getFlag(f, "state");
  if (!n && (t.getFlag(f, "state") || e && !e.getFlag(f, "draft")))
    throw new m("RecoveryRequired");
  if (!n) {
    const r = Y(t), l = ne(), u = we(e), d = ae(t), p = [];
    if (!s.manual && Te(t)) {
      const S = r.customId ? fe(r.customId, t, "custom") : [];
      p.push(...S.map((g) => ({ id: foundry.utils.randomID(), data: g })));
    } else
      for (const S of oe(t, s)) {
        if (s.manual && !(i != null && i.ids.has(S.id))) continue;
        const g = _(t, S, d), { rule: L } = W(g, u, l);
        p.push(await te(S, s, g.token, L));
      }
    for (const S of pe(t, s)) {
      const g = _(t, S, d);
      p.push(await te(S, s, g.token, W(g, u, l).rule));
    }
    const b = { version: 1, currencyReady: s.currencySnapshotVersion ?? !0, entries: p.map(ve) }, w = e ? e.id : await at(t, p, { state: b, ...i ? { manualMode: i.mode } : {} });
    n = { ...b, vaultId: w }, e && await e.update({
      [G("items")]: p,
      [G("state")]: n,
      [G("draft")]: !1,
      ...i ? { [G("manualMode")]: i.mode } : {}
    }), await k(t, n);
  }
  if (n.version !== 1) throw new m("RecoveryRequired");
  n = { ...n, vaultId: n.vaultId ?? (e == null ? void 0 : e.id) };
  const a = s.currencySnapshotVersion ?? !0;
  if ((!n.currencyReady || s.currencySnapshotVersion && n.currencyReady !== a) && s.currencyEntries) {
    const r = e ?? game.journal.get(n.vaultId), l = r.getFlag(f, "items"), u = Array.isArray(l) ? structuredClone(l) : n.entries.every((p) => p.taken) ? [] : fe(n.vaultId, t, "snapshot"), d = [];
    for (const p of pe(t, s)) {
      const b = _(t, p, ae(t));
      d.push(await te(p, s, b.token, W(b, we(r), ne()).rule));
    }
    n = { ...n, currencyReady: a, entries: [...n.entries, ...d.map(ve)] }, d.length ? await r.update({ [`flags.${f}.items`]: [...u, ...d], [`flags.${f}.state`]: n }) : await r.setFlag(f, "state", n), await k(t, n);
  }
  const c = t.getFlag(f, "state");
  if ((!c || s.currencySnapshotVersion && c.currencyReady !== n.currencyReady) && await k(t, n), n.entries.every((r) => r.taken)) return {
    ...n,
    entries: n.entries.map((r) => ({ ...r, data: null }))
  };
  const o = fe(n.vaultId, t, "snapshot");
  return { ...n, entries: n.entries.flatMap((r) => {
    var S, g, L;
    if (r.taken) return [{ ...r, data: null }];
    const l = o.find((C) => C.id === r.id), u = l == null ? void 0 : l.data, d = s.id === "swade";
    if (!u || !d && !!l.wholeItem != !!s.manual) throw new m("RecoveryRequired");
    let p = l.source;
    const b = d && (p != null && p.itemId) ? (S = t.actor) == null ? void 0 : S.items.get(p.itemId) : null, w = d && ((g = l.currency) == null ? void 0 : g.storage) !== "balance" && (!s.allowsStoredItem(u) || b && !s.allowsStoredItem(b));
    if (w && !r.claim) return [];
    if (!w && !p && !l.currency && !((L = t.getFlag(f, "config")) != null && L.customId) && s.snapshot) {
      const C = st(oe(t, s), s, u);
      C && (p = { itemId: C.id });
    }
    return [{
      ...r,
      data: u,
      ...w ? { hidden: !0 } : {},
      ...l.wholeItem ? { wholeItem: !0 } : {},
      ...l.formula ? { formula: l.formula } : {},
      ...l.currency ? { currency: l.currency } : {},
      ...p ? { source: p } : {}
    }];
  }) };
}
async function Nt(t, s) {
  const i = {
    version: 1,
    ...s.currencyReady ? { currencyReady: s.currencyReady } : {},
    vaultId: s.vaultId,
    entries: s.entries.map(({ id: n, taken: a, claim: c, hidden: o }) => ({
      id: n,
      taken: !!a,
      ...c ? { claim: c } : {},
      ...o ? { hidden: o } : {}
    }))
  }, e = game.journal.get(s.vaultId);
  if ((e == null ? void 0 : e.getFlag(f, "tokenUuid")) !== t.uuid) throw new m("RecoveryRequired");
  await e.setFlag(f, "state", i), await k(t, i);
}
function Dt(t, s) {
  return {
    tokenUuid: t.uuid,
    name: t.name,
    img: t.texture.src,
    entries: s.entries.filter((i) => !i.taken && !i.hidden).map((i) => {
      var c, o, r, l, u, d, p, b, w, S, g, L, C, q, h, I, v;
      const e = { ...i.data, system: i.data.system ?? {} }, n = e.system.identified === !1 || ((c = e.system.identification) == null ? void 0 : c.status) === "unidentified", a = n ? (o = e.system.unidentified) == null ? void 0 : o.description : typeof e.system.description == "string" ? e.system.description : (r = e.system.description) == null ? void 0 : r.value;
      return {
        id: i.id,
        name: i.currency ? i.currency.unit === "swade" ? e.name : game.i18n.localize(`HL.Currency.${i.currency.unit}`) : n ? ((l = e.system.unidentified) == null ? void 0 : l.name) || ((d = (u = e.system.identification) == null ? void 0 : u.unidentified) == null ? void 0 : d.name) || game.i18n.localize("HL.Unidentified") : e.name,
        currency: !!i.currency,
        img: n && ((b = (p = e.system.identification) == null ? void 0 : p.unidentified) == null ? void 0 : b.img) || e.img,
        quantity: i.wholeItem ? 1 : ((w = i.currency) == null ? void 0 : w.amount) ?? e.system.quantity,
        ...i.wholeItem ? { wholeItem: !0 } : {},
        ...i.formula ? { formula: i.formula } : {},
        type: i.currency ? game.i18n.localize("HL.CurrencyLabel") : game.i18n.localize(`TYPES.Item.${e.type}`),
        rarity: n ? "" : game.i18n.localize(((L = (g = (S = globalThis.CONFIG) == null ? void 0 : S.DND5E) == null ? void 0 : g.itemRarity) == null ? void 0 : L[e.system.rarity]) ?? ((I = (q = (C = globalThis.CONFIG) == null ? void 0 : C.PF2E) == null ? void 0 : q.rarityTraits) == null ? void 0 : I[(h = e.system.traits) == null ? void 0 : h.rarity]) ?? e.system.rarity ?? ""),
        tooltip: ((v = new DOMParser().parseFromString(a ?? "", "text/html").body.textContent) == null ? void 0 : v.slice(0, 1500)) ?? "",
        pending: !!i.claim
      };
    })
  };
}
function Pt(t, s = t) {
  const i = `${s} |`;
  return {
    log: (e, ...n) => console.log(i, e, ...n),
    warn: (e, ...n) => console.warn(i, e, ...n),
    error: (e, ...n) => console.error(i, e, ...n)
  };
}
function Ut(t, s = {}) {
  const i = s.socketName ?? `module.${t}`, e = Pt(t, s.title ?? t);
  return {
    socketName: i,
    emit(n) {
      var c;
      const a = (c = globalThis.game) == null ? void 0 : c.socket;
      return a != null && a.emit ? (a.emit(i, n), !0) : (e.warn("Foundry socket is unavailable.", n), !1);
    },
    isGMSender(n) {
      var a, c, o;
      return n ? !!((o = (c = (a = globalThis.game) == null ? void 0 : a.users) == null ? void 0 : c.get(String(n))) != null && o.isGM) : !1;
    }
  };
}
const _e = Ut(f, { title: "HoloSuite Loot" }), ie = /* @__PURE__ */ new Map(), Gt = new be();
async function _t(t, s) {
  game.socket.on(_e.socketName, (i) => {
    (i == null ? void 0 : i.type) === "refresh" && typeof i.tokenUuid == "string" && s(i.tokenUuid);
  }), Hooks.on("updateUser", (i, e, n, a) => {
    var o, r, l;
    if (i.id === game.user.id && ((r = (o = e.flags) == null ? void 0 : o[f]) != null && r[Le])) {
      let u;
      try {
        u = JSON.parse(i.getFlag(f, Le));
      } catch {
        return;
      }
      const d = ie.get(u == null ? void 0 : u.id);
      d && d.gm === a && ((l = game.users.get(a)) != null && l.isGM) && (clearTimeout(d.timer), ie.delete(u.id), u.result.error ? d.reject(new m(u.result.error)) : d.resolve(structuredClone(u.result)));
    }
    const c = mt(i, e, a, Ke);
    !c || !E() || typeof c.id != "string" || !/^[\w-]{1,64}$/.test(c.id) || Gt.run(i.id, async () => {
      if (!E()) return;
      let u;
      try {
        if (!me(c)) throw new m("InvalidRequest");
        u = await t.execute(c, i);
      } catch (d) {
        console.warn("HoloSuite Loot | Request failed", d), u = { error: d.code ?? "TransferFailed" };
      }
      await i.setFlag(f, Le, JSON.stringify({ id: c.id, result: u })), me(c) && ["take", "all"].includes(c.action) && _e.emit({ type: "refresh", tokenUuid: c.tokenUuid });
    }).catch((u) => console.warn("HoloSuite Loot | Could not deliver reply", u));
  }), game.user.isGM && await game.user.setFlag(f, "transportVersion", he);
}
async function jt(t, s) {
  if (!me(t)) throw new m("InvalidRequest");
  const i = Ae();
  if (!i) throw new m(game.users.contents.some((n) => n.active && n.isGM) ? "BuildMismatch" : "NoGM");
  if (i.id === game.user.id && s) return s.execute(t, game.user);
  const e = foundry.utils.randomID();
  return new Promise((n, a) => {
    const c = setTimeout(() => {
      ie.delete(e), a(new m("Timeout"));
    }, t.action === "view" ? 8e3 : 2e4);
    ie.set(e, { resolve: n, reject: a, timer: c, gm: i.id }), game.user.setFlag(f, Ke, { ...t, id: e }).catch((o) => {
      clearTimeout(c), ie.delete(e), a(o);
    });
  });
}
function Vt() {
  var t, s, i;
  return ((s = (t = globalThis.foundry) == null ? void 0 : t.applications) == null ? void 0 : s.api) ?? ((i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) ?? null;
}
function zt() {
  var t, s, i;
  return ((s = (t = globalThis.foundry) == null ? void 0 : t.appv1) == null ? void 0 : s.api) ?? ((i = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : i.api) ?? null;
}
function Bt(t = {}, s = {}) {
  var e, n, a;
  const i = ((n = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : n.mergeObject) ?? ((a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.mergeObject);
  return typeof i == "function" ? i(t, s, { inplace: !1 }) : { ...t, ...s };
}
function Kt() {
  var t, s, i, e, n;
  return ((i = (s = (t = globalThis.foundry) == null ? void 0 : t.utils) == null ? void 0 : s.randomID) == null ? void 0 : i.call(s, 8)) ?? ((n = (e = foundry == null ? void 0 : foundry.utils) == null ? void 0 : e.randomID) == null ? void 0 : n.call(e, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function je(t = {}) {
  return {
    id: String(t.id ?? `legacy-application-${Kt()}`),
    tag: t.tag ?? "section",
    classes: Array.isArray(t.classes) ? t.classes : [],
    window: {
      title: t.title ?? "",
      icon: t.icon,
      resizable: t.resizable === !0
    },
    position: {
      width: Number(t.width ?? 600),
      height: t.height === "auto" ? "auto" : Number(t.height ?? 600)
    }
  };
}
function Qt(t) {
  return class extends t {
    constructor(e = {}) {
      const n = Bt(new.target.defaultOptions ?? {}, e);
      super(je(n));
      R(this, "_v1Options");
      this._v1Options = n;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return je(this.defaultOptions ?? {});
    }
    activateListeners(e) {
    }
    async _renderHTML(e, n) {
      var l, u, d;
      const a = typeof this.getData == "function" ? await this.getData() : {}, c = ((l = this._v1Options) == null ? void 0 : l.template) ?? ((u = this.options) == null ? void 0 : u.template) ?? ((d = this.constructor.defaultOptions) == null ? void 0 : d.template);
      if (!c) return document.createDocumentFragment();
      const o = await globalThis.renderTemplate(c, a), r = document.createElement("template");
      return r.innerHTML = o.trim(), r.content;
    }
    _activateV1Form(e) {
      var a, c;
      if (typeof this._updateObject != "function") return;
      const n = (a = e.matches) != null && a.call(e, "form") ? e : (c = e.querySelector) == null ? void 0 : c.call(e, "form");
      n instanceof HTMLFormElement && n.addEventListener("submit", async (o) => {
        var l;
        o.preventDefault(), o.stopPropagation();
        const r = new FormData(n);
        await this._updateObject(o, r), ((l = this._v1Options) == null ? void 0 : l.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(e, n, a) {
      var u, d, p, b;
      n.replaceChildren(e);
      const c = globalThis.jQuery ?? globalThis.$, o = ((u = n.closest) == null ? void 0 : u.call(n, ".window-app, .app, .application")) ?? n, r = c ? c(o) : o;
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
      Array.isArray(l) && l.length && (n.classList.add(...l), (b = (p = n.closest) == null ? void 0 : p.call(n, ".window-app, .app, .application")) == null || b.classList.add(...l)), this._activateV1Form(n), typeof this.activateListeners == "function" && this.activateListeners(c ? c(n) : n);
    }
  };
}
function Jt() {
  const t = Vt(), s = zt(), i = globalThis.Application ?? (s == null ? void 0 : s.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (s == null ? void 0 : s.FormApplication) ?? (t == null ? void 0 : t.FormApplication);
  if (i) return i;
  const e = t == null ? void 0 : t.ApplicationV2;
  return e ? Qt(e) : null;
}
class Wt {
  constructor(s, i) {
    R(this, "outside", (s) => {
      s.composedPath().includes(this.root) || this.dismiss();
    });
    this.root = s, this.dismiss = i, document.addEventListener("pointerdown", this.outside, !0);
  }
  destroy() {
    document.removeEventListener("pointerdown", this.outside, !0);
  }
}
class kt {
  constructor(s, i, e, n) {
    R(this, "frame", 0);
    R(this, "destroyed", !1);
    R(this, "svg");
    R(this, "line");
    R(this, "lastGeometry", "");
    R(this, "outside", (s) => {
      var e, n;
      const i = s.composedPath();
      s.button === 2 && i.includes(((e = canvas.app) == null ? void 0 : e.canvas) ?? ((n = canvas.app) == null ? void 0 : n.view)) || i.includes(this.root) || this.dismiss();
    });
    R(this, "update", () => {
      var e, n;
      if (this.destroyed) return;
      const s = ((e = canvas.app) == null ? void 0 : e.canvas) ?? ((n = canvas.app) == null ? void 0 : n.view), i = this.token.object;
      if (!this.root.isConnected) {
        this.destroy();
        return;
      }
      if (!i || this.token.hidden) {
        this.destroy(), this.dismiss();
        return;
      }
      if (this.root.isConnected && s && canvas.stage) {
        const a = s.getBoundingClientRect(), c = canvas.app.renderer.screen, o = canvas.stage.worldTransform.apply(i.center), r = a.left + o.x * a.width / c.width, l = a.top + o.y * a.height / c.height, u = this.root.getBoundingClientRect(), d = 24 + Math.min(60, (i.w ?? 0) * Math.abs(canvas.stage.worldTransform.a) / 2), p = r + d + u.width <= innerWidth - 8 ? r + d : r - d - u.width, b = Math.max(8, Math.min(innerWidth - u.width - 8, p)), w = Math.max(8, Math.min(innerHeight - u.height - 8, l - u.height / 3));
        (Math.abs(u.left - b) > 0.5 || Math.abs(u.top - w) > 0.5) && this.position(b, w);
        const S = this.root.querySelector(".hl-panel") ?? this.root, g = S.getBoundingClientRect(), L = getComputedStyle(S), C = parseFloat(L.borderLeftWidth) || 3, q = Math.min(parseFloat(L.borderTopLeftRadius) || 0, g.height / 2, g.width / 2), h = r <= g.left || r >= g.right, I = h ? r <= g.left ? g.left + C / 2 : g.right - C / 2 : Math.max(g.left + q, Math.min(g.right - q, r)), v = h ? Math.max(g.top + q, Math.min(g.bottom - q, l)) : l < (g.top + g.bottom) / 2 ? g.top + C / 2 : g.bottom - C / 2, y = `${r},${l},${I},${v}`;
        y !== this.lastGeometry && (this.line.setAttribute("x1", String(r)), this.line.setAttribute("y1", String(l)), this.line.setAttribute("x2", String(I)), this.line.setAttribute("y2", String(v)), this.lastGeometry = y), this.line.style.stroke = L.borderLeftColor, this.line.style.strokeWidth = String(C), this.svg.style.zIndex = String(Math.max(0, (parseInt(getComputedStyle(this.root).zIndex) || 100) - 1));
      }
      this.frame = requestAnimationFrame(this.update);
    });
    this.root = s, this.token = i, this.position = e, this.dismiss = n;
    const a = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(a, "svg"), this.svg.classList.add("hl-loot-tether"), this.svg.setAttribute("aria-hidden", "true"), this.line = document.createElementNS(a, "line"), this.svg.append(this.line), document.body.append(this.svg), document.addEventListener("pointerdown", this.outside, !0), this.frame = requestAnimationFrame(this.update);
  }
  destroy() {
    this.destroyed = !0, cancelAnimationFrame(this.frame), document.removeEventListener("pointerdown", this.outside, !0), this.svg.remove();
  }
}
const K = (t) => String(t ?? "").replace(/[&<>"']/g, (s) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[s]);
async function Xt({ roll: t, itemName: s, quantity: i }) {
  var c;
  const { game: e } = globalThis, n = e.i18n.format("HL.QuantityRollChat", { item: K(s), quantity: i }), a = ((c = e.release) == null ? void 0 : c.generation) >= 14 ? { messageMode: "self" } : { rollMode: "selfroll" };
  await t.toMessage({ flavor: n }, a);
}
async function Yt(t, s) {
  var d;
  const { game: i, foundry: e, ChatMessage: n } = globalThis, a = t.claim.quantityRoll, c = s.preview ? s.preview(t) : t.data, r = (((d = e == null ? void 0 : e.dice) == null ? void 0 : d.Roll) ?? globalThis.Roll).fromData(a.roll), l = i.i18n.format("HL.PickupRollChat", { item: K(c.name), quantity: a.quantity }), u = await r.toMessage({ flavor: l }, { create: !1 });
  await n.create({ ...u, whisper: [t.claim.userId], blind: !1 });
}
async function Zt({ token: t, actor: s, entry: i, adapter: e }) {
  var r, l;
  const { game: n, ChatMessage: a } = globalThis;
  if (!n.settings.get(f, "chatLog")) return;
  const c = e.preview ? e.preview(i) : i.data, o = n.i18n.format("HL.ChatLooted", {
    actor: K(s.name),
    source: K(t.name),
    item: K(c.name),
    quantity: K(i.wholeItem ? 1 : ((r = i.currency) == null ? void 0 : r.amount) ?? ((l = c.system) == null ? void 0 : l.quantity) ?? 1)
  });
  await a.create({
    speaker: a.getSpeaker({ actor: s }),
    content: `<p>${o}</p>`,
    whisper: [],
    blind: !1,
    flags: { [f]: { claimId: i.claim.id, userId: i.claim.userId } }
  });
}
const ct = Jt(), ut = (t) => `modules/${f}/templates/${t}.hbs`, x = (t) => game.i18n.localize(`HL.${t}`);
function P(t) {
  const s = x((t == null ? void 0 : t.code) ?? "TransferFailed");
  return ui.notifications.warn(s), s;
}
const lt = (t) => t instanceof HTMLElement ? t : t[0];
class ei extends ct {
  constructor(i, e, n) {
    super({ id: `hololoot-${i.id}` });
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
    this.token = i, this.send = e, this.adapter = n;
    const a = game.user.character;
    J(a, game.user, n, i) && (this.destination = n.manual ? N(a) : a.id);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: "HoloSuite Loot",
      classes: ["holosuite-loot-window", "holosuite-loot-popup"],
      template: ut("loot"),
      width: 340,
      height: "auto",
      resizable: !1
    });
  }
  show(i) {
    return this.firstDraw || (this.firstDraw = new Promise((e) => {
      this.resolveFirstDraw = e;
    }), this.loading = i === void 0, this.loading || (this.data = i), this.render(!0)), this.firstDraw;
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
        } catch (i) {
          if (this.disposed) return;
          if ((i == null ? void 0 : i.code) === "OutOfRange") {
            P(i), await this.close();
            return;
          }
          this.data = { entries: [] }, this.message = P(i);
        }
        this.loading = !1, this.disposed || this.render(!0);
      })().finally(() => {
        this.refreshing = null, this.refreshAgain && !this.disposed && !this.busy && this.refresh();
      }), this.refreshing);
    }
  }
  getData() {
    var r, l;
    const i = game.settings.get(f, "characterSelector"), e = game.settings.get(f, "panelTheme"), n = this.adapter.manual ? [...new Map([...game.actors.contents, ...Array.from(((r = canvas.scene) == null ? void 0 : r.tokens) ?? [], (u) => u.actor)].filter((u) => J(u, game.user, this.adapter, this.token)).map((u) => [N(u), u])).values()] : game.actors.contents.filter((u) => J(u, game.user, this.adapter)), a = (u) => this.adapter.manual ? N(u) : u.id;
    let c = "";
    if (i)
      !this.destination && n.length === 1 && (this.destination = a(n[0]));
    else try {
      this.destination = N(Qe(game.user, game.actors.contents, (l = canvas.scene) == null ? void 0 : l.tokens, this.adapter, this.token));
    } catch (u) {
      this.destination = "", c = x(u.code);
    }
    const o = i ? n.some((u) => a(u) === this.destination) : !!this.destination;
    return {
      ...this.data,
      name: this.data.name ?? this.token.name,
      img: this.data.img ?? this.token.texture.src,
      actors: n.map((u) => ({ id: a(u), name: u.name, selected: a(u) === this.destination })),
      disabled: this.loading || this.busy || !o || !this.data.entries.length,
      loading: this.loading,
      showSelector: i,
      theme: e,
      busy: this.busy,
      message: this.message || c || (!n.length && i ? x("NoActor") : ""),
      empty: !this.loading && !this.data.entries.length && !this.message
    };
  }
  activateListeners(i) {
    var a, c, o;
    if (super.activateListeners(i), this.disposed) return;
    const e = lt(i);
    (a = this.presentation) == null || a.destroy();
    const n = e.closest(".window-app, .application") ?? e.closest(".holosuite-loot-popup") ?? e;
    this.presentation = new kt(
      n,
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
  async inspect(i) {
    try {
      const n = { ...(await this.send({ action: "inspect", entryId: i, tokenUuid: this.token.uuid })).item, ownership: { default: 0, [game.user.id]: 2 } }, a = globalThis.CONFIG.Item.documentClass;
      new a(n, { temporary: !0 }).sheet.render(!0, { editable: !1 });
    } catch (e) {
      P(e);
    }
  }
  async take(i) {
    if (!this.busy) {
      if (this.getData(), !this.destination) {
        this.message = this.getData().message || x("NoActor"), this.render(!0);
        return;
      }
      this.busy = !0, this.message = "", this.render(!0);
      try {
        this.data = await this.send({
          action: i === "all" ? "all" : "take",
          entryId: i,
          actorId: this.destination,
          tokenUuid: this.token.uuid
        });
        const e = this.data.failures ?? [];
        this.message = e.map((n) => `${n.name}: ${x(n.code)}`).join(" · "), this.message && ui.notifications.warn(this.message);
      } catch (e) {
        this.message = P(e);
      } finally {
        this.busy = !1, this.disposed || (this.render(!0), this.refreshAgain && this.refresh());
      }
    }
  }
  async close(i) {
    var e, n;
    return this.disposed = !0, (e = this.presentation) == null || e.destroy(), this.presentation = null, (n = this.resolveFirstDraw) == null || n.call(this), this.resolveFirstDraw = null, super.close(i);
  }
}
class ti extends ct {
  constructor(i, e, n) {
    super({ id: `hololoot-config-${i.id}` });
    R(this, "token");
    R(this, "adapter");
    R(this, "queue");
    R(this, "config");
    R(this, "scope", "token");
    R(this, "busy", !1);
    R(this, "dismissal", null);
    this.token = i, this.adapter = e, this.queue = n, this.config = structuredClone(Y(i));
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: x("Title"),
      classes: ["holosuite-loot-window", "holosuite-loot-config"],
      template: ut("config"),
      width: 480,
      height: "auto",
      resizable: !1
    });
  }
  getData() {
    const i = !!this.adapter.manual, e = !i && game.settings.get(f, "zeroHP"), n = !e && this.config.mode === "automatic" ? "disabled" : this.config.mode, a = (r) => (r == null ? void 0 : r.quantity) ?? (r ? x(`Rule.${r.mode}`) : ""), c = i ? Et(this.token, this.adapter) : Ht(this.token, this.adapter).map(({ entry: r, effective: l, overrides: u, ...d }) => ({
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
      manual: i,
      saveDisabled: this.busy || i && !o,
      canRefresh: !i && o && ot(this.token, this.adapter),
      scopes: ["token", "actor", "global"].map((r) => ({ value: r, label: x(`Scope.${r}`), selected: this.scope === r })),
      modes: (e ? ["automatic", "enabled", "disabled"] : ["enabled", "disabled"]).map((r) => ({ value: r, label: x(r), selected: r === n }))
    };
  }
  activateListeners(i) {
    var p, b, w, S;
    super.activateListeners(i);
    const e = lt(i);
    (p = this.dismissal) == null || p.destroy(), this.dismissal = new Wt(e.closest(".window-app, .application") ?? e, () => {
      this.busy || this.close();
    }), (b = e.querySelector('[name="mode"]')) == null || b.addEventListener("change", (g) => {
      this.config.mode = g.target.value;
    }), (w = e.querySelector("[data-save]")) == null || w.addEventListener("click", () => {
      const g = Array.from(e.querySelectorAll("[data-manual-item]:checked"), (L) => L.value);
      this.save(g);
    }), (S = e.querySelector("[data-close]")) == null || S.addEventListener("click", () => void this.close());
    const n = e.querySelector('[name="scope"]'), a = e.querySelector('[name="behavior"]'), c = e.querySelector('[name="formula"]'), o = e.querySelector("[data-apply]"), r = e.querySelector("[data-refresh-inventory]"), l = e.querySelector("[data-select-all]");
    if (!n || !a || !c || !o || !l) return;
    const u = Array.from(e.querySelectorAll("input[data-rule-item]")), d = () => {
      this.scope = n.value, n.disabled = a.disabled = c.disabled = this.busy, r && (r.disabled = this.busy);
      const g = u.filter((C) => {
        const q = C.dataset[this.scope] === "true";
        C.disabled = this.busy || !q, q || (C.checked = !1);
        const h = C.closest("label"), I = h == null ? void 0 : h.querySelector("[data-rule-unavailable]"), v = C.dataset[`${this.scope}Unavailable`];
        I && (I.textContent = !q && v ? x(v) : "");
        const y = h == null ? void 0 : h.querySelector("[data-scoped-rule]"), A = C.dataset[`${this.scope}Rule`];
        return y && (y.textContent = A && C.dataset.effectiveScope !== this.scope ? ` · ${x(`Scope.${this.scope}`)} ${A}` : ""), q;
      }), L = g.filter((C) => C.checked).length;
      l.disabled = this.busy || !g.length, l.checked = !!L && L === g.length, l.indeterminate = !!L && !l.checked, o.disabled = this.busy || !L, c.hidden = a.value !== "quantity";
    };
    n.addEventListener("change", d), a.addEventListener("change", d);
    for (const g of u) g.addEventListener("change", d);
    l.addEventListener("change", () => {
      for (const g of u) g.disabled || (g.checked = l.checked);
      d();
    }), r == null || r.addEventListener("click", async () => {
      if (!(!E() || this.busy)) {
        this.busy = !0, d();
        try {
          await this.queue.run(this.token.uuid, () => rt(this.token, this.adapter)), ui.notifications.info(x("InventoryRefreshed"));
        } catch (g) {
          P(g);
          return;
        } finally {
          this.busy = !1, d();
        }
        this.rendered && this.render(!0);
      }
    }), o.addEventListener("click", async () => {
      if (!(!E() || this.busy)) {
        try {
          const g = Se(a.value, c.value), L = u.filter((h) => h.checked && !h.disabled).map((h) => h.value), C = this.scope;
          this.busy = !0, d();
          const q = await this.queue.run(this.token.uuid, () => $t(this.token, this.adapter, C, L, g));
          for (const h of q ?? [])
            Xt(h).catch((I) => console.warn("HoloSuite Loot | Could not post quantity roll", I));
        } catch (g) {
          P(g);
          return;
        } finally {
          this.busy = !1, d();
        }
        this.render(!0);
      }
    }), d();
  }
  async save(i = []) {
    if (!(!game.user.isGM || this.busy)) {
      this.busy = !0, this.render(!0);
      try {
        const e = this.config.mode === "automatic" && (this.adapter.manual || !game.settings.get(f, "zeroHP")) ? "disabled" : this.config.mode;
        await this.queue.run(this.token.uuid, () => this.adapter.manual ? Ot(this.token, this.adapter, e, i) : this.token.setFlag(f, "config", { ...Y(this.token), mode: e })), await this.close();
      } catch (e) {
        P(e);
      } finally {
        this.busy = !1, this.rendered && this.render(!0);
      }
    }
  }
  async close(i) {
    var e;
    return (e = this.dismissal) == null || e.destroy(), this.dismissal = null, super.close(i);
  }
}
class ii {
  constructor(s) {
    R(this, "sprites", /* @__PURE__ */ new Map());
    R(this, "texture");
    R(this, "disposed", !1);
    var e;
    this.available = s;
    const i = ((e = foundry.canvas) == null ? void 0 : e.loadTexture) ?? globalThis.loadTexture;
    Promise.resolve().then(() => i == null ? void 0 : i(`modules/${f}/assets/ui/loot-badge.svg`)).then((n) => {
      this.disposed || !n || (this.texture = n, this.refreshScene());
    }).catch((n) => console.warn("HoloSuite Loot | Badge texture could not load", n));
  }
  refreshScene() {
    var s;
    for (const i of ((s = canvas.tokens) == null ? void 0 : s.placeables) ?? []) this.refresh(i);
  }
  refresh(s) {
    if (!s || this.disposed || !this.texture) return;
    const i = s.document, e = i.getFlag(f, "state");
    if (s.destroyed || s.isPreview || i.hidden || !this.available(i) || e && !e.entries.some((a) => !a.taken && !a.hidden)) {
      this.remove(s);
      return;
    }
    let n = this.sprites.get(s);
    (n != null && n.destroyed || (n == null ? void 0 : n.parent) !== s) && (this.remove(s), n = new PIXI.Sprite(this.texture), n.name = "holosuite-loot-badge", n.eventMode = "none", n.anchor.set(0.5), n.width = n.height = 24, n.zIndex = 100, s.addChild(n), this.sprites.set(s, n)), n.position.set(s.w, 0);
  }
  remove(s) {
    var e;
    const i = this.sprites.get(s);
    this.sprites.delete(s), i && !i.destroyed && ((e = i.parent) == null || e.removeChild(i), i.destroy());
  }
  destroy() {
    this.disposed = !0;
    for (const s of this.sprites.keys()) this.remove(s);
  }
}
const H = /* @__PURE__ */ new Map();
let F = null, V = !1, de = 0;
const U = () => It(game.system.id), re = () => Ft(U()), Ee = (t) => (t == null ? void 0 : t.actor) && (U().manual ? !!t.actor.items : t.actor.type === "npc"), si = (t, s, i) => {
  var e;
  return Qe(t, game.actors.contents, (e = game.scenes.get(t.viewedScene)) == null ? void 0 : e.tokens, s, i);
}, ue = new Rt({
  moduleId: f,
  authority: E,
  environment: re,
  adapter: U,
  token: async (t) => {
    if (!/^Scene\.[^.]+\.Token\.[^.]+$/.test(t)) throw new m("InvalidRequest");
    const i = await (foundry.utils.fromUuid ?? globalThis.fromUuid)(t);
    return (i == null ? void 0 : i.documentName) === "Token" ? i : null;
  },
  actor: (t) => game.actors.get(t) ?? (foundry.utils.fromUuid ?? globalThis.fromUuid)(t),
  id: () => foundry.utils.randomID(),
  destination: (t, s, i) => game.settings.get(f, "characterSelector") ? t.actorId ? ue.io.actor(t.actorId) : null : si(s, U(), i),
  load: $e,
  save: Nt,
  summary: Dt,
  collected: Zt,
  rollQuantity: At,
  quantityRolled: Yt
}), Me = (t) => jt(t, ue);
function Oe(t) {
  var s;
  return V && se(t, re()) && (game.user.isGM || !t.hidden && ((s = t.object) == null ? void 0 : s.isVisible));
}
async function Re(t) {
  var a, c, o, r, l;
  t = (t == null ? void 0 : t.document) ?? t;
  const s = U();
  if (!s) {
    P(new m("Unsupported"));
    return;
  }
  if (game.user.isGM) return le(t);
  if (!Oe(t)) {
    P(new m("Unavailable"));
    return;
  }
  const i = ++de;
  let e;
  if (He() > 0 && (!H.has(t.uuid) || (a = H.get(t.uuid)) != null && a.disposed)) {
    try {
      e = await Me({ action: "view", tokenUuid: t.uuid });
    } catch (u) {
      i === de && ((c = canvas.scene) == null ? void 0 : c.id) === ((o = t.parent) == null ? void 0 : o.id) && P(u);
      return;
    }
    if (i !== de || ((r = canvas.scene) == null ? void 0 : r.id) !== ((l = t.parent) == null ? void 0 : l.id)) return;
  }
  for (const [u, d] of H)
    u !== t.uuid && !d.disposed && await d.close();
  if (i !== de) return;
  let n = H.get(t.uuid);
  (!n || n.disposed) && (n = new ei(t, Me, s), H.set(t.uuid, n), await n.show(e), e !== void 0) || n.disposed || await n.refresh();
}
async function le(t) {
  var s;
  if (!(!game.user.isGM || !U())) {
    if (((s = t == null ? void 0 : t.parent) == null ? void 0 : s.documentName) !== "Scene" || !Ee(t)) {
      ui.notifications.info(x("SelectToken"));
      return;
    }
    try {
      new ti(t, U(), ue.queue).render(!0);
    } catch (i) {
      P(i);
    }
  }
}
function ce(t) {
  const s = H.get(t);
  s && !s.disposed && s.refresh();
}
function Ne(t) {
  const s = U(), i = () => {
    const e = t.getFlag(f, "state");
    return !e || s.currencySnapshotVersion && e.currencyReady !== s.currencySnapshotVersion;
  };
  !V || !E() || s.manual || !i() || !se(t, re()) || ue.queue.run(t.uuid, async () => {
    E() && i() && se(t, re()) && await $e(t, s);
  }).catch((e) => console.warn("HoloSuite Loot | Snapshot initialization failed", t.uuid, e));
}
function D() {
  var t;
  for (const s of ((t = canvas.scene) == null ? void 0 : t.tokens) ?? []) Ne(s);
  F == null || F.refreshScene();
}
function ni() {
  const t = [.../* @__PURE__ */ new Set([...canvas.tokens.controlled, ...game.user.targets])];
  if (t.length !== 1) {
    ui.notifications.info(x("SelectToken"));
    return;
  }
  const s = t[0];
  game.user.isGM ? le(s.document) : Re(s.document);
}
function Ve() {
  var s;
  const t = ((s = game.modules.get("holosuite-core")) == null ? void 0 : s.api) ?? game.holosuite;
  return t != null && t.registerApp ? (t.registerApp({
    id: f,
    title: x("Title"),
    icon: "fa-solid fa-box-open",
    playerVisible: !1,
    premium: !1,
    description: x("SelectToken"),
    open: ni
  }), !0) : !1;
}
let M, X, ze = "", Be = 0;
function Q(t) {
  var r, l;
  if (game.user.isGM || !V || t.type === "pointerdown" && t.button !== 2) return;
  const s = M == null ? void 0 : M.getBoundingClientRect(), i = (l = (r = canvas.app) == null ? void 0 : r.renderer) == null ? void 0 : l.screen;
  if (!(s != null && s.width) || !s.height || !i || !canvas.stage) return;
  const e = canvas.stage.worldTransform.applyInverse({
    x: (t.clientX - s.left) * i.width / s.width,
    y: (t.clientY - s.top) * i.height / s.height
  }), n = (u) => {
    var d;
    return (u == null ? void 0 : u.isVisible) && (((d = u.bounds) == null ? void 0 : d.contains(e.x, e.y)) ?? (e.x >= u.document.x && e.y >= u.document.y && e.x <= u.document.x + u.w && e.y <= u.document.y + u.h));
  }, a = n(X) ? X : [...canvas.tokens.placeables].reverse().find(n), c = a == null ? void 0 : a.document;
  if (!Oe(c)) {
    for (const u of H.values()) u.disposed || u.close();
    return;
  }
  if (t.type === "contextmenu" && ze === c.uuid && Date.now() - Be < 1e3) return;
  t.type === "pointerdown" && (ze = c.uuid, Be = Date.now());
  const o = H.get(c.uuid);
  o && !o.disposed ? o.close() : Re(c);
}
function dt() {
  var t, s;
  F == null || F.destroy(), F = V ? new ii((i) => se(i, re())) : null, M == null || M.removeEventListener("contextmenu", Q, !0), M == null || M.removeEventListener("pointerdown", Q, !0), M = ((t = canvas.app) == null ? void 0 : t.canvas) ?? ((s = canvas.app) == null ? void 0 : s.view), M == null || M.addEventListener("contextmenu", Q, !0), M == null || M.addEventListener("pointerdown", Q, !0);
}
Hooks.once("init", () => {
  game.settings.register(f, ye, { scope: "world", config: !1, type: Object, default: {} }), game.settings.register(f, "zeroHP", {
    name: "HL.ZeroHP",
    hint: "HL.ZeroHPHint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0,
    onChange: () => {
      D();
      for (const t of H.keys()) ce(t);
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
  }), game.settings.register(f, Ye, {
    name: "HL.LootRange",
    hint: "HL.LootRangeHint",
    scope: "world",
    config: !0,
    type: Number,
    default: Ze,
    onChange: () => {
      for (const t of H.keys()) ce(t);
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
      for (const t of H.values()) t.disposed || t.render(!1);
    }
  });
});
Hooks.once("ready", async () => {
  var t;
  if (!((t = game.modules.get("holosuite-core")) != null && t.active)) {
    ui.notifications.error(x("CoreMissing"));
    return;
  }
  try {
    await _t(ue, ce);
  } catch (s) {
    P(s);
    return;
  }
  V = !0, game.modules.get(f).api = {
    version: he,
    open: Re,
    configure: le,
    registerAdapter: St,
    // Requests still pass every authority and permission check, including calls from macros.
    request: Me,
    authority: () => {
      var s;
      return (s = Ae()) == null ? void 0 : s.id;
    }
  }, Ve(), setTimeout(Ve, 500), dt(), D(), console.info(`HoloSuite Loot | ${he} ready; Foundry ${game.version}, ${game.system.id} ${game.system.version}`);
});
Hooks.on("canvasReady", () => {
  dt(), D();
});
Hooks.on("hoverToken", (t, s) => {
  s ? X = t : X === t && (X = null);
});
Hooks.on("canvasTearDown", () => {
  F == null || F.destroy(), F = null, X = null, M == null || M.removeEventListener("contextmenu", Q, !0), M == null || M.removeEventListener("pointerdown", Q, !0), M = null;
  for (const t of H.values()) t.close();
  H.clear();
});
Hooks.on("renderTokenHUD", (t, s) => {
  var c;
  if (!V) return;
  const i = (c = t.object) == null ? void 0 : c.document;
  if (!Ee(i)) return;
  const e = s instanceof HTMLElement ? s : s[0], n = e.querySelector(".col.right") ?? e;
  e.querySelectorAll(".hl-token-action").forEach((o) => o.remove());
  const a = (o, r, l) => {
    const u = document.createElement("button");
    u.type = "button", u.className = "control-icon hl-token-action", u.title = o, u.setAttribute("aria-label", o);
    const d = document.createElement("i");
    d.className = r, u.append(d), u.addEventListener("click", (p) => {
      p.preventDefault(), p.stopPropagation(), l();
    }), n.append(u);
  };
  game.user.isGM ? U() && !game.settings.get(f, "hideGmLootButton") && a(x("Loot"), "fa-solid fa-box-open", () => void le(i)) : Oe(i) && a(x("Loot"), "fa-solid fa-box-open", () => void Re(i));
});
Hooks.on("renderTokenConfig", (t, s) => {
  var a;
  if (!V || !game.user.isGM || !U()) return;
  const i = t.document ?? t.object;
  if (((a = i == null ? void 0 : i.parent) == null ? void 0 : a.documentName) !== "Scene" || !Ee(i)) return;
  const e = s instanceof HTMLElement ? s : s[0];
  if (e.querySelector(".hl-token-config")) return;
  const n = document.createElement("button");
  n.type = "button", n.className = "hl-token-config", n.textContent = x("Configure"), n.addEventListener("click", () => le(i)), (e.querySelector('[data-tab="character"]') ?? e.querySelector("form") ?? e).append(n);
});
Hooks.on("drawToken", (t) => F == null ? void 0 : F.refresh(t));
Hooks.on("refreshToken", (t, s) => {
  (!s || s.refreshSize || s.refreshShape) && (F == null || F.refresh(t));
});
Hooks.on("destroyToken", (t) => F == null ? void 0 : F.remove(t));
Hooks.on("updateToken", (t, s) => {
  var i, e, n;
  if (Ne(t), F == null || F.refresh(t.object), ce(t.uuid), !(!H.size || !He() || ((i = t.parent) == null ? void 0 : i.id) !== ((e = canvas.scene) == null ? void 0 : e.id) || !t.actor || !((n = U()) != null && n.destination(t.actor)) || !t.actor.testUserPermission(game.user, "OWNER") || !["x", "y", "elevation", "width", "height", "hidden"].some((a) => a in s)))
    for (const a of H.keys()) a !== t.uuid && ce(a);
});
Hooks.on("createToken", Ne);
Hooks.on("createCombatant", D);
Hooks.on("updateCombatant", D);
Hooks.on("deleteCombatant", D);
Hooks.on("updateCombat", D);
Hooks.on("deleteCombat", D);
Hooks.on("updateActor", D);
Hooks.on("createActiveEffect", D);
Hooks.on("updateActiveEffect", D);
Hooks.on("deleteActiveEffect", D);
Hooks.on("userConnected", D);
Hooks.on("deleteToken", (t) => {
  var s;
  if ((s = H.get(t.uuid)) == null || s.close(), H.delete(t.uuid), !!E())
    for (const i of game.journal.contents)
      i.getFlag(f, "tokenUuid") === t.uuid && i.delete().catch(console.warn);
});
