var ht = Object.defineProperty;
var mt = (e, n, i) => n in e ? ht(e, n, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[n] = i;
var R = (e, n, i) => mt(e, typeof n != "symbol" ? n + "" : n, i);
const f = "holosuite-loot", de = "1.1.0", Ve = "commandV3", Ie = "replyV3", N = (e) => structuredClone(e);
function gt(e, n, i, t = "request") {
  var s, a;
  return i !== e.id || !e.active || !((a = (s = n.flags) == null ? void 0 : s[f]) != null && a[t]) ? null : N(e.getFlag(f, t));
}
class g extends Error {
  constructor(n) {
    super(n), this.code = n;
  }
}
function fe(e) {
  const n = (i) => typeof i == "string" && /^[\w-]{1,64}$/.test(i);
  return typeof (e == null ? void 0 : e.tokenUuid) == "string" && /^Scene\.[\w-]{1,64}\.Token\.[\w-]{1,64}$/.test(e.tokenUuid) && ["view", "inspect", "take", "all"].includes(e.action) && (!["inspect", "take"].includes(e.action) || n(e.entryId)) && (e.actorId == null || typeof e.actorId == "string" && /^(?:[\w-]{1,64}|Actor\.[\w-]{1,64}|Scene\.[\w-]{1,64}\.Token\.[\w-]{1,64}(?:\.Actor\.[\w-]{1,64})?)$/.test(e.actorId));
}
function Z(e) {
  var n;
  return e.getFlag(f, "config") ?? ((n = e.actor) == null ? void 0 : n.getFlag(f, "config")) ?? { mode: "automatic", source: "inventory" };
}
const O = (e) => (e == null ? void 0 : e.uuid) ?? (e == null ? void 0 : e.id), ee = (e) => JSON.stringify(e, (n, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(Object.entries(i).sort(([t], [s]) => t.localeCompare(s))) : i);
function k(e, n, i, t = void 0) {
  return !e || !i.destination(e) || !e.testUserPermission(n, "OWNER") ? !1 : !i.manual || !t || O(e) !== O(t.actor) && (e.isToken || e.id !== t.actorId);
}
function Qe(e, n, i, t, s = void 0) {
  const a = (r) => k(r, e, t, s);
  if (a(e.character)) return e.character;
  const c = [...new Map(Array.from(i ?? []).map((r) => r.actor).filter(a).map((r) => [O(r), r])).values()];
  if (c.length === 1) return c[0];
  if (c.length > 1) throw new g("AmbiguousActor");
  const o = Array.from(n ?? []).filter(a);
  if (o.length === 1) return o[0];
  throw new g(o.length ? "AmbiguousActor" : "NoActor");
}
function se(e, { combats: n = [], zeroHP: i = !1, automatic: t = !0, manual: s = !1 } = {}) {
  var r, l, u, d, y, v;
  if (!(e != null && e.actor) || (s ? !e.actor.items : e.actor.type !== "npc")) return !1;
  if (s) return ((r = e.getFlag(f, "config")) == null ? void 0 : r.mode) === "enabled";
  const a = Z(e);
  if (a.mode === "disabled") return !1;
  if (a.mode === "enabled") return !0;
  if (!t) return !1;
  if (n.some((S) => {
    var I, w, q;
    return ((I = S.scene) == null ? void 0 : I.id) === ((w = e.parent) == null ? void 0 : w.id) && ((q = S.combatants) == null ? void 0 : q.some((L) => L.tokenId === e.id && L.defeated));
  })) return !0;
  const c = e.actor.statuses;
  if (c != null && c.has("dead")) return !0;
  const o = (u = (l = e.actor.system) == null ? void 0 : l.attributes) == null ? void 0 : u.hp;
  return i && Number(o == null ? void 0 : o.max) > 0 && (o == null ? void 0 : o.value) === 0 && !((v = (y = (d = e.actor.system) == null ? void 0 : d.attributes) == null ? void 0 : y.death) != null && v.success);
}
function yt(e, n, i, t = void 0) {
  var a, c, o;
  if (!(n != null && n.active) || !se(e, i)) throw new g("Unavailable");
  if (n.isGM) return;
  const s = ((a = e.parent) == null ? void 0 : a.active) || ((c = e.parent) == null ? void 0 : c.testUserPermission(n, "LIMITED"));
  if (e.hidden || n.viewedScene !== ((o = e.parent) == null ? void 0 : o.id) || !s || !i.visible(e, n))
    throw new g("AccessDenied");
  if (i.inRange && !i.inRange(e, n, t)) throw new g("OutOfRange");
}
function De(e, n, i, t = void 0) {
  if (!k(e, n, i, t))
    throw new g("ActorDenied");
}
class ge {
  constructor() {
    R(this, "tails", /* @__PURE__ */ new Map());
  }
  async run(n, i) {
    const s = (this.tails.get(n) ?? Promise.resolve()).catch(() => {
    }).then(i);
    this.tails.set(n, s);
    try {
      return await s;
    } finally {
      this.tails.get(n) === s && this.tails.delete(n);
    }
  }
}
const Re = new ge(), Le = ["cp", "sp", "ep", "gp", "pp"], K = (e, n) => {
  var i, t;
  return (t = (i = e == null ? void 0 : e.system) == null ? void 0 : i.currency) == null ? void 0 : t[n];
}, V = (e) => Number.isSafeInteger(e) && e >= 0, qe = (e) => `${e.currency.unit}:${e.currency.amount}`, te = (e, n, i, t = !1) => {
  var s, a;
  return ((a = (s = e.getFlag) == null ? void 0 : s.call(e, f, t ? "currencyDebits" : "currencyReceipts")) == null ? void 0 : a[i.id]) === qe(n);
}, Q = {
  entries(e) {
    return Le.filter((n) => V(K(e, n)) && K(e, n) > 0).map((n) => {
      var a, c, o, r, l;
      const i = K(e, n), t = (o = (c = (a = globalThis.CONFIG) == null ? void 0 : a.DND5E) == null ? void 0 : c.currencies) == null ? void 0 : o[n], s = typeof t == "string" ? t : t == null ? void 0 : t.label;
      return { currency: { storage: "balance", unit: n, amount: i }, data: {
        name: s ? ((l = (r = globalThis.game) == null ? void 0 : r.i18n) == null ? void 0 : l.localize(s)) ?? s : n.toUpperCase(),
        type: "currency",
        img: "icons/svg/coins.svg",
        system: { quantity: i }
      } };
    });
  },
  received: te,
  async grant(e, n, i, t) {
    return Re.run(O(e), async () => {
      if (te(e, n, i)) return;
      if (i.currencyAttempted) throw new g("RecoveryRequired");
      if (!t) throw new g("RecoveryRequired");
      await t();
      const { unit: s, amount: a } = n.currency, c = K(e, s);
      if (!Le.includes(s) || !V(a) || !a || !V(c) || !V(c + a)) throw new g("CurrencyChanged");
      if (await e.update({
        [`system.currency.${s}`]: c + a,
        [`flags.${f}.currencyReceipts.${i.id}`]: qe(n)
      }), !te(e, n, i)) throw new g("TransferFailed");
    });
  },
  sourcePlan(e, n) {
    const { unit: i, amount: t } = n.currency, s = K(e.actor, i);
    if (!Le.includes(i) || !V(s) || !V(t) || t <= 0 || s < t) throw new g("CurrencyChanged");
    return { currency: i, before: s, after: s - t };
  },
  async debit(e, n, i) {
    return Re.run(O(e.actor), async () => {
      const t = e.actor;
      if (te(t, n, i, !0)) return;
      const s = i.source;
      if (K(t, s.currency) !== s.before) throw new g("CurrencyChanged");
      if (await t.update({
        [`system.currency.${s.currency}`]: s.after,
        [`flags.${f}.currencyDebits.${i.id}`]: qe(n)
      }), !te(t, n, i, !0)) throw new g("CurrencyChanged");
    });
  },
  async cleanup(e, n, i, t) {
    for (const [s, a] of [[n, "currencyReceipts"], [e.actor, "currencyDebits"]])
      try {
        await Re.run(O(s), () => s.update({ [`flags.${f}.${a}.-=${t.id}`]: null }));
      } catch (c) {
        console.warn("HoloSuite Loot | Could not clean committed currency receipt", c);
      }
  }
};
function Je(e) {
  var i;
  const n = N(e.toObject());
  delete n._id, delete n.folder, delete n.ownership, delete n._stats, (i = n.flags) == null || delete i[f];
  for (const t of n.effects ?? [])
    delete t._id, t.origin = null;
  return n;
}
async function he(e) {
  if (e.actorLink && await e.update({ actorLink: !1 }), e.actorLink) throw new g("SourceChanged");
}
class We {
  constructor() {
    R(this, "manual", !1);
  }
  received(n, i, t) {
    var s;
    return ((s = n.items.get(t.itemId)) == null ? void 0 : s.getFlag(f, "claim")) === t.id;
  }
  async create(n, i, t) {
    const s = n.items.get(t.itemId);
    if (s) {
      if (s.getFlag(f, "claim") !== t.id) throw new g("RecoveryRequired");
      return s;
    }
    const a = N(i.data);
    a._id = t.itemId, a.flags ?? (a.flags = {}), a.flags[f] = { claim: t.id };
    const [c] = await n.createEmbeddedDocuments("Item", [a], { keepId: !0 });
    if (!c || (this.manual ? !this.received(n, i, t) : c.id !== t.itemId))
      throw new g("TransferFailed");
    return c;
  }
}
class ke extends We {
  constructor() {
    super(...arguments);
    R(this, "id", "dnd5e");
  }
  currencyEntries(i) {
    return Q.entries(i);
  }
  received(i, t, s) {
    var a;
    return ((a = t.currency) == null ? void 0 : a.storage) === "balance" ? Q.received(i, t, s) : super.received(i, t, s);
  }
  async cleanup(i, t, s, a) {
    var c;
    ((c = s.currency) == null ? void 0 : c.storage) === "balance" && await Q.cleanup(i, t, s, a);
  }
  destination(i) {
    return i.type === "character";
  }
  eligible(i) {
    var r, l, u, d, y;
    const t = i.system, s = (r = t == null ? void 0 : t.constructor) == null ? void 0 : r.metadata;
    if (!["weapon", "equipment", "consumable", "tool", "loot", "container"].includes(i.type) || (s == null ? void 0 : s.inventoryItem) === !1) return !1;
    const c = (u = (l = t == null ? void 0 : t.schema) == null ? void 0 : l.getField) == null ? void 0 : u.call(l, "quantity");
    if (t != null && t.schema && !c || !Number.isSafeInteger(t == null ? void 0 : t.quantity) || t.quantity <= 0) return !1;
    const o = ((d = t.type) == null ? void 0 : d.value) ?? t.weaponType ?? ((y = t.armor) == null ? void 0 : y.type);
    return !["natural", "siege", "vehicle", "currency"].includes(o);
  }
  snapshot(i) {
    const t = Je(i);
    return t.system.container = null, "equipped" in t.system && (t.system.equipped = !1), "attuned" in t.system && (t.system.attuned = !1), t.system.attunement === 2 && (t.system.attunement = 1), t;
  }
  async create(i, t, s, a) {
    var c;
    return ((c = t.currency) == null ? void 0 : c.storage) === "balance" ? Q.grant(i, t, s, a) : super.create(i, t, s);
  }
  preview(i) {
    var s, a;
    const t = N(i.data);
    return t.system.identified !== !1 ? t : {
      name: ((s = t.system.unidentified) == null ? void 0 : s.name) || "Unidentified Item",
      img: t.img,
      type: "loot",
      system: { quantity: t.system.quantity, identified: !1, description: { value: ((a = t.system.unidentified) == null ? void 0 : a.description) ?? "" } }
    };
  }
  async sourceClaim(i, t) {
    var c, o, r, l, u;
    if (!((c = t.source) != null && c.itemId) && ((o = t.currency) == null ? void 0 : o.storage) !== "balance") return null;
    if ((r = t.source) != null && r.ruleKey && t.source.ruleKey !== `${i.actorId ?? ((l = i.actor) == null ? void 0 : l.id) ?? ""}:${t.source.itemId}`)
      throw new g("SourceChanged");
    if (await he(i), ((u = t.currency) == null ? void 0 : u.storage) === "balance") return Q.sourcePlan(i, t);
    const s = i.actor.items.get(t.source.itemId), a = s == null ? void 0 : s.system.quantity;
    if (!this.eligible(s ?? {}) || a < t.data.system.quantity || t.source.ruleKey && s.type !== t.data.type) throw new g("SourceChanged");
    return { itemId: s.id, before: a, after: a - t.data.system.quantity };
  }
  validateSourcePlan(i, t, s) {
    var o, r, l, u;
    if (!((o = t.source) != null && o.ruleKey)) return;
    const a = (l = i.actor) == null ? void 0 : l.items.get((r = s.source) == null ? void 0 : r.itemId);
    if (i.actorLink || t.source.ruleKey !== `${i.actorId ?? ((u = i.actor) == null ? void 0 : u.id) ?? ""}:${a == null ? void 0 : a.id}` || !this.eligible(a ?? {}) || a.type !== t.data.type || a.system.quantity !== s.source.before)
      throw new g("SourceChanged");
    const c = s.source.sfCurrency;
    if (c) {
      const d = this.entryMetadata(a).currency;
      if ((d == null ? void 0 : d.unit) !== c.unit || (d == null ? void 0 : d.amount) !== c.amount) throw new g("CurrencyChanged");
    }
  }
  async removeSource(i, t, s) {
    const a = s.source;
    if (!a) return;
    if (await he(i), a.currency) return Q.debit(i, t, s);
    const c = i.actor.items.get(a.itemId);
    if (!c || c.getFlag(f, "sourceClaim") === s.id) return;
    if (c.system.quantity !== a.before) throw new g("SourceChanged");
    a.after === 0 ? await i.actor.deleteEmbeddedDocuments("Item", [c.id]) : await c.update({ "system.quantity": a.after, [`flags.${f}.sourceClaim`]: s.id });
    const o = i.actor.items.get(a.itemId);
    if (a.after === 0 ? o : (o == null ? void 0 : o.system.quantity) !== a.after || (o == null ? void 0 : o.getFlag(f, "sourceClaim")) !== s.id) throw new g("SourceChanged");
  }
}
class pt extends ke {
  constructor() {
    super(...arguments);
    R(this, "id", "sf2e");
  }
  currencyEntries() {
    return [];
  }
  eligible(i) {
    var s, a;
    return ["ammo", "armor", "backpack", "book", "consumable", "equipment", "shield", "treasure", "weapon"].includes(i.type) && (i.isOfType ? i.isOfType("physical") : !0) && !(i.type === "weapon" && ((s = i.system) == null ? void 0 : s.category) === "unarmed") && Number.isSafeInteger((a = i.system) == null ? void 0 : a.quantity) && i.system.quantity > 0;
  }
  snapshot(i) {
    var s, a, c, o, r;
    const t = N(i.toObject());
    delete t._id, delete t.folder, delete t.ownership, delete t._stats, (s = t.flags) == null || delete s[f], (c = (a = t.flags) == null ? void 0 : a.pf2e) == null || delete c.grantedBy, (r = (o = t.flags) == null ? void 0 : o.pf2e) == null || delete r.itemGrants, t.system.containerId = null, t.system.description && delete t.system.description.gm, t.system.equipped && (t.system.equipped = { carryType: "stowed", handsHeld: 0, invested: !1 });
    for (const l of t.effects ?? [])
      delete l._id, l.origin = null;
    return t;
  }
  entryMetadata(i, t = ((s) => (s = i.system) == null ? void 0 : s.quantity)()) {
    var r, l, u, d;
    const a = i.isCurrency ? i.unit : null, c = a ? i.assetValue : null, o = t === ((r = i.system) == null ? void 0 : r.quantity) ? c == null ? void 0 : c[a] : (d = (u = c == null ? void 0 : (l = c.constructor).fromPrice) == null ? void 0 : u.call(l, i.price, t)) == null ? void 0 : d[a];
    return a && Number.isSafeInteger(o) && o > 0 ? { currency: { storage: "item", unit: a, amount: o } } : {};
  }
  async sourceClaim(i, t) {
    var r;
    const s = await super.sourceClaim(i, t);
    if (((r = t.currency) == null ? void 0 : r.storage) !== "item") return s;
    const a = i.actor.items.get(t.source.itemId), c = this.entryMetadata(a).currency, o = this.entryMetadata(a, t.data.system.quantity).currency;
    if ((o == null ? void 0 : o.unit) !== t.currency.unit || (o == null ? void 0 : o.amount) !== t.currency.amount || !t.source.ruleKey && a.system.quantity !== t.data.system.quantity) throw new g("CurrencyChanged");
    return { ...s, sfCurrency: { unit: c.unit, amount: c.amount } };
  }
  async removeSource(i, t, s) {
    var c;
    const a = (c = s.source) != null && c.itemId ? i.actor.items.get(s.source.itemId) : null;
    if (a && s.source.sfCurrency) {
      const o = this.entryMetadata(a).currency;
      if ((o == null ? void 0 : o.unit) !== s.source.sfCurrency.unit || (o == null ? void 0 : o.amount) !== s.source.sfCurrency.amount) throw new g("CurrencyChanged");
    }
    return super.removeSource(i, t, s);
  }
  preview(i) {
    var a, c, o, r;
    const t = N(i.data);
    if (((a = t.system.identification) == null ? void 0 : a.status) === "identified") return t;
    const s = (c = t.system.identification) == null ? void 0 : c.unidentified;
    return {
      name: (s == null ? void 0 : s.name) || "Unidentified Item",
      img: (s == null ? void 0 : s.img) || t.img,
      type: "equipment",
      system: { quantity: t.system.quantity, description: { value: ((r = (o = s == null ? void 0 : s.data) == null ? void 0 : o.description) == null ? void 0 : r.value) ?? "" } }
    };
  }
}
class wt extends We {
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
    return Je(i);
  }
  preview(i) {
    var a, c, o, r, l, u;
    const { data: t } = i;
    if (((a = t.system) == null ? void 0 : a.identified) !== !1 && ((o = (c = t.system) == null ? void 0 : c.identification) == null ? void 0 : o.status) !== "unidentified") return N(t);
    const s = ((r = t.system) == null ? void 0 : r.unidentified) ?? ((u = (l = t.system) == null ? void 0 : l.identification) == null ? void 0 : u.unidentified);
    return { name: (s == null ? void 0 : s.name) || "Unidentified Item", type: t.type, img: (s == null ? void 0 : s.img) || t.img };
  }
  received(i, t, s) {
    return super.received(i, t, s) || i.items.some((a) => a.getFlag(f, "claim") === s.id);
  }
  async create(i, t, s, a) {
    if (s.itemAttempted || !a) throw new g("RecoveryRequired");
    return await a(), super.create(i, t, s);
  }
  async sourceClaim(i, t) {
    var a;
    await he(i);
    const s = { itemId: (a = t.source) == null ? void 0 : a.itemId };
    return this.validateSourcePlan(i, t, { source: s }), s;
  }
  validateSourcePlan(i, t, s) {
    var o, r, l, u, d;
    const a = (o = s.source) == null ? void 0 : o.itemId, c = (r = i.actor) == null ? void 0 : r.items.get(a);
    if (i.actorLink || !t.wholeItem || a !== ((l = t.source) == null ? void 0 : l.itemId) || ((u = t.source) == null ? void 0 : u.ruleKey) !== `${i.actorId ?? ((d = i.actor) == null ? void 0 : d.id) ?? ""}:${a}` || !this.eligible(c) || ee(this.snapshot(c)) !== ee(t.data))
      throw new g("SourceChanged");
  }
  async removeSource(i, t, s) {
    var c, o, r;
    await he(i);
    const a = (c = s.source) == null ? void 0 : c.itemId;
    if (!a || !t.wholeItem || ((o = t.source) == null ? void 0 : o.ruleKey) !== `${i.actorId ?? ((r = i.actor) == null ? void 0 : r.id) ?? ""}:${a}`)
      throw new g("RecoveryRequired");
    if (i.actor.items.get(a) && (this.validateSourcePlan(i, t, s), await i.actor.deleteEmbeddedDocuments("Item", [a]), i.actor.items.get(a)))
      throw new g("SourceChanged");
  }
}
const Xe = /* @__PURE__ */ new Map([["dnd5e", new ke()], ["sf2e", new pt()]]), vt = new wt();
function bt(e, n) {
  Xe.set(e, n);
}
function St(e) {
  return Xe.get(e) ?? vt;
}
function Pe(e) {
  if (!e.claim.quantityRoll) return e;
  const n = N(e.data);
  return n.system.quantity = e.claim.quantityRoll.quantity, { ...e, data: n };
}
class It {
  constructor(n) {
    R(this, "queue", new ge());
    this.io = n;
  }
  async collected(n, i, t, s) {
    var c, o, r, l;
    const a = Pe(t);
    if (t.claim.quantityRoll) {
      try {
        await ((o = (c = this.io).quantityRolled) == null ? void 0 : o.call(c, a, s));
      } catch (u) {
        console.warn("HoloSuite Loot | Could not post quantity roll", u);
      }
      if (!t.claim.quantityRoll.quantity) return;
    }
    try {
      await ((l = (r = this.io).collected) == null ? void 0 : l.call(r, { token: n, actor: i, entry: a, adapter: s }));
    } catch (u) {
      console.warn("HoloSuite Loot | Could not post loot to chat", u);
    }
  }
  async execute(n, i) {
    if (!fe(n)) throw new g("InvalidRequest");
    return this.queue.run(n.tokenUuid, async () => {
      var y, v, S, I, w, q, L, C, b, p;
      const t = this.io, s = await t.token(n.tokenUuid);
      if (!s) throw new g("Unavailable");
      const a = (m, h = t.environment()) => {
        if (!t.authority()) throw new g("NoGM");
        yt(s, i, h, m);
      }, c = t.environment();
      if (a(void 0, c), !i.isGM && c.inRange && (n.action === "view" || n.action === "inspect")) {
        const m = await ((y = t.destination) == null ? void 0 : y.call(t, { ...n, actorId: void 0 }, i, s));
        m && a(m);
      }
      const o = t.adapter();
      if (!o) throw new g("Unsupported");
      let r = await t.load(s, o);
      for (const m of r.entries.filter((h) => h.claim && !h.taken)) {
        a();
        const h = await t.actor(m.claim.actorId);
        if (!h) throw new g("RecoveryRequired");
        if (((v = m.claim.quantityRoll) == null ? void 0 : v.quantity) === 0 || (o.received ? o.received(h, m, m.claim) : ((S = h.items.get(m.claim.itemId)) == null ? void 0 : S.getFlag(t.moduleId, "claim")) === m.claim.id)) {
          await ((I = o.removeSource) == null ? void 0 : I.call(o, s, m, m.claim));
          const T = N(r);
          T.entries.find((E) => E.id === m.id).taken = !0, await t.save(s, T), r = T, await this.collected(s, h, m, o), await ((w = o.cleanup) == null ? void 0 : w.call(o, s, h, m, m.claim));
        }
      }
      if (n.action === "view") return t.summary(s, r);
      if (n.action === "inspect") {
        const m = r.entries.find((h) => h.id === n.entryId && !h.taken && !h.hidden);
        if (!m || m.currency) throw new g("Unavailable");
        return { item: o.preview ? o.preview(m) : N(m.data) };
      }
      const l = t.destination ? await t.destination(n, i, s) : await t.actor(n.actorId);
      De(l, i, o, s), a(l);
      const u = r.entries.filter((m) => !m.taken && !m.hidden && (n.action === "all" || m.id === n.entryId));
      if (!u.length && n.action === "take") return t.summary(s, r);
      const d = [];
      for (const m of u)
        try {
          a(l), De(l, i, o, s);
          let h = r.entries.find((T) => T.id === m.id);
          if (h.claim && (h.claim.userId !== i.id || ![l.id, O(l)].includes(h.claim.actorId)))
            throw new g("RecoveryRequired");
          if (!h.claim) {
            const T = await ((q = o.sourceClaim) == null ? void 0 : q.call(o, s, h));
            a(l);
            let E;
            if (h.formula) {
              if (!T || !o.removeSource) throw new g("SourceChanged");
              E = await t.rollQuantity(h.formula), a(l);
            }
            const U = N(r);
            U.entries.find((B) => B.id === h.id).claim = {
              id: t.id(),
              itemId: t.id(),
              userId: i.id,
              actorId: O(l),
              ...E ? { quantityRoll: E } : {},
              ...T ? { source: T } : {}
            }, await t.save(s, U), r = U, h = r.entries.find((B) => B.id === m.id);
          }
          a(l), (L = o.validateSourcePlan) == null || L.call(o, s, h, h.claim), ((C = h.claim.quantityRoll) == null ? void 0 : C.quantity) !== 0 && await o.create(l, Pe(h), h.claim, async () => {
            const T = h.wholeItem ? "itemAttempted" : "currencyAttempted", E = N(r);
            E.entries.find((U) => U.id === h.id).claim[T] = !0, await t.save(s, E), r = E, h.claim[T] = !0;
          }), await ((b = o.removeSource) == null ? void 0 : b.call(o, s, h, h.claim));
          const M = N(r);
          M.entries.find((T) => T.id === h.id).taken = !0, await t.save(s, M), r = M, await this.collected(s, l, h, o), await ((p = o.cleanup) == null ? void 0 : p.call(o, s, l, h, h.claim));
        } catch (h) {
          if (d.push({ name: m.data.name, code: h.code ?? "TransferFailed" }), !t.authority()) break;
        }
      return { ...t.summary(s, r), failures: d };
    });
  }
}
const me = "inventoryRules";
function Rt(e) {
  var i, t, s, a, c;
  const n = /^(?:Item\.[\w-]+|Compendium\.[\w-]+\.[\w-]+\.(?:Item\.)?[\w-]+)$/;
  return (c = [(i = e._stats) == null ? void 0 : i.compendiumSource, (t = e._stats) == null ? void 0 : t.duplicateSource, (a = (s = e.flags) == null ? void 0 : s.core) == null ? void 0 : a.sourceId].find((o) => typeof o == "string" && n.test(o))) == null ? void 0 : c.replace(/^(Compendium\.[^.]+\.[^.]+)\.(?!Item\.)/, "$1.Item.");
}
function j(e, n, i) {
  var t;
  return {
    token: n.id ? `${e.actorId ?? ((t = e.actor) == null ? void 0 : t.id) ?? ""}:${n.id}` : void 0,
    actor: i != null && i.id && i.items.get(n.id) ? `${i.id}:${n.id}` : void 0,
    global: Rt(n)
  };
}
function ye(e, n, i) {
  var t;
  for (const s of ["token", "actor", "global"]) {
    const a = e[s] && ((t = s === "token" ? n : i[s]) == null ? void 0 : t[e[s]]);
    if (a) return { rule: a, scope: s };
  }
  return { rule: { mode: "allow" }, scope: "default" };
}
function pe(e, n = "") {
  if (e === "inherit") return null;
  if (e === "allow" || e === "never") return { mode: e };
  if (e !== "quantity" || typeof n != "string" || n.length > 40) throw new g("InvalidRule");
  const i = n.trim().toLowerCase().replace(/\s+/g, "");
  if (/^\d+$/.test(i) && Number.isSafeInteger(Number(i))) return { mode: e, quantity: String(Number(i)) };
  const t = /^(\d{0,3})d([1-9]\d{0,4})(?:[+-]\d{1,6})?$/.exec(i);
  if (t && (t[1] === "" || Number(t[1]) > 0)) return { mode: e, quantity: t[1] ? i : `1${i}` };
  throw new g("InvalidRule");
}
async function Lt(e, n, i) {
  if (e.mode === "never") return 0;
  if (e.mode === "allow") return n;
  const { quantity: t } = pe(e.mode, e.quantity), s = /^\d+$/.test(t) ? Number(t) : await i(t);
  if (!Number.isSafeInteger(s)) throw new g("InvalidRule");
  return Math.min(n, Math.max(0, s));
}
const Ye = (e) => (e == null ? void 0 : e.mode) === "quantity" && !/^\d+$/.test(e.quantity);
function Ue(e, n, i) {
  const t = { ...e };
  for (const s of n)
    i ? t[s] = i : delete t[s];
  return t;
}
function Me() {
  return game.users.contents.filter((e) => {
    var n;
    return e.active && e.isGM && ((n = e.getFlag) == null ? void 0 : n.call(e, f, "transportVersion")) === de;
  }).sort((e, n) => e.id.localeCompare(n.id))[0];
}
const $ = () => {
  var e;
  return ((e = Me()) == null ? void 0 : e.id) === game.user.id;
}, Ze = "lootRange", et = 15;
function Fe() {
  const e = game.settings.get(f, Ze);
  return Number.isFinite(e) ? Math.max(0, e) : et;
}
function qt(e, n, i) {
  var t, s, a;
  return ((t = e.getCenterPoint) == null ? void 0 : t.call(e, i)) ?? ((a = (s = e.object) == null ? void 0 : s.getCenterPoint) == null ? void 0 : a.call(s, i)) ?? {
    x: i.x + e.width * (n.sizeX ?? n.size) / 2,
    y: i.y + e.height * (n.sizeY ?? n.size) / 2
  };
}
function Ge(e, n) {
  var c;
  const { x: i, y: t } = e._source ?? e, s = { x: i, y: t };
  if (n.isSquare && n.getOffsetRange) {
    const o = e.width * n.size, r = e.height * n.size, [l, u, d, y] = n.getOffsetRange({ ...s, width: o, height: r }), v = [];
    for (let S = l; S < d; S++)
      for (let I = u; I < y; I++) v.push(n.getCenterPoint({ i: S, j: I }));
    if (v.length) return v;
  }
  const a = (c = e.getOccupiedGridSpaceOffsets) == null ? void 0 : c.call(e, { ...s, level: null });
  return a != null && a.length ? a.map(({ i: o, j: r }) => n.getCenterPoint({ i: o, j: r })) : [qt(e, n, s)];
}
function Ct(e, n, i, t, s) {
  var u;
  const a = e.parent, c = a == null ? void 0 : a.grid;
  if (!(c != null && c.measurePath)) return !1;
  const o = (u = c.units) == null ? void 0 : u.trim().toLowerCase().replace(/\.$/, ""), r = /^(m|meters?|metres?)$/.test(o ?? "") ? t * 0.3048 : /^(yd|yards?)$/.test(o ?? "") ? t / 3 : t, l = Ge(e, c);
  return Array.from(a.tokens ?? []).some((d) => {
    const y = d.actor;
    return d.id === e.id || d.hidden || !k(y, n, i, e) || s && O(y) !== O(s) ? !1 : Ge(d, c).some(({ x: v, y: S }) => l.some((I) => c.measurePath([{ x: v, y: S }, { x: I.x, y: I.y }]).distance <= r + 1e-8));
  });
}
function Tt(e, n) {
  var a, c;
  const i = e.parent;
  if (((a = canvas.scene) == null ? void 0 : a.id) !== i.id) return !1;
  if (!i.tokenVision) return !0;
  const t = e.object;
  if (!t) return !1;
  const s = globalThis.CONFIG;
  return (c = e.hasStatusEffect) != null && c.call(e, s.specialStatusEffects.INVISIBLE) ? !1 : canvas.tokens.placeables.some((o) => {
    var l, u, d, y, v, S, I, w, q, L, C, b, p, m;
    if (o.document.hidden || !((l = o.document.sight) != null && l.enabled) || !((u = o.actor) != null && u.testUserPermission(n, "OWNER")) || (y = (d = o.document).hasStatusEffect) != null && y.call(d, s.specialStatusEffects.BLIND)) return !1;
    let r;
    try {
      const h = o.document.sight, M = ((S = (v = o.document).getVisionOrigin) == null ? void 0 : S.call(v)) ?? { ...o.center, elevation: o.document.elevation };
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
      }), r.isBlinded || !((I = r.los) != null && I.contains(t.center.x, t.center.y))) return !1;
      if ((w = r.shape) != null && w.contains(t.center.x, t.center.y)) return !0;
      const T = (q = canvas.environment) == null ? void 0 : q.globalLightSource;
      return (T ? T.active && ((L = T.shape) == null ? void 0 : L.contains(t.center.x, t.center.y)) : i.globalLight && (i.globalLightThreshold == null || i.darkness <= i.globalLightThreshold)) && ((C = r.light) != null && C.contains(t.center.x, t.center.y)) ? !0 : !!((b = r.light) != null && b.contains(t.center.x, t.center.y)) && !!((m = (p = canvas.effects) == null ? void 0 : p.lightSources) != null && m.some((U) => {
        var B;
        return U.active && ((B = U.shape) == null ? void 0 : B.contains(t.center.x, t.center.y));
      }));
    } catch {
      return !1;
    } finally {
      r == null || r.destroy();
    }
  });
}
function Mt(e) {
  const n = game.settings.get(f, "zeroHP"), i = e ? Fe() : 0;
  return {
    combats: game.combats.contents,
    automatic: n,
    zeroHP: n,
    manual: !!(e != null && e.manual),
    visible: Tt,
    inRange: i > 0 ? (t, s, a) => Ct(t, s, e, i, a) : void 0
  };
}
const Ft = new ge(), we = (e) => game.journal.find((n) => n.getFlag(f, "tokenUuid") === e.uuid && n.getFlag(f, "kind") === "snapshot"), ve = () => game.settings.get(f, me) ?? {}, be = (e) => {
  var n;
  return (n = game.actors) == null ? void 0 : n.get(e.actorId);
}, tt = async (e) => {
  var i, t;
  const n = ((t = (i = globalThis.foundry) == null ? void 0 : i.dice) == null ? void 0 : t.Roll) ?? globalThis.Roll;
  return new n(e).evaluate({ allowInteractive: !1 });
}, ne = (e, n) => {
  var i, t;
  return ((t = (i = e.actor) == null ? void 0 : i.items) == null ? void 0 : t.filter((s) => n.eligible(s))) ?? [];
}, Ce = (e) => Z(e).source === "custom", Ae = (e) => JSON.parse((e == null ? void 0 : e.getFlag(f, "rules")) ?? "{}"), G = (e) => `flags.${f}.${e}`, xe = ({ id: e, hidden: n }) => ({ id: e, taken: !1, ...n ? { hidden: !0 } : {} }), it = (e) => e.mode === "quantity" ? e.quantity : e.mode, X = (e, n) => e.setFlag(f, "state", {
  ...n,
  entries: n.entries.map((i) => {
    var a;
    if (!((a = i.claim) != null && a.quantityRoll)) return i;
    const { quantityRoll: t, ...s } = i.claim;
    return { ...i, claim: s };
  })
}), st = (e, n, i) => {
  var t, s;
  return Ye(i) && n.sourceClaim && n.removeSource && !((s = (t = n.entryMetadata) == null ? void 0 : t.call(n, e)) != null && s.currency);
};
async function At(e) {
  const n = pe("quantity", e);
  if (!Ye(n)) throw new g("InvalidRule");
  const i = await tt(n.quantity);
  if (!Number.isSafeInteger(i.total)) throw new g("InvalidRule");
  return { quantity: Math.max(0, i.total), roll: i.toJSON() };
}
function nt(e, n, i) {
  const t = ee(i), s = e.filter((a) => ee(n.snapshot(a)) === t);
  return s.length === 1 && s[0].id ? s[0] : void 0;
}
async function He(e, n, i, t, { original: s, previousRoll: a, legacyRollCeiling: c, onRoll: o } = {}) {
  var I;
  const r = n.snapshot(e);
  if (n.manual) return { id: foundry.utils.randomID(), data: r, wholeItem: !0, source: { itemId: e.id, ruleKey: i } };
  const l = s ?? r.system.quantity, u = Math.min(l, r.system.quantity), d = a === void 0 && c === void 0 && st(e, n, t) ? t.quantity : void 0;
  let y, v;
  const S = d ? u : await Lt(t, u, async (w) => {
    if (a === void 0 && c !== void 0)
      return v = c, v;
    if (a !== void 0)
      y = a;
    else {
      const q = await tt(w);
      y = q.total, o == null || o(q);
    }
    return y;
  });
  return r.system.quantity = S, {
    id: foundry.utils.randomID(),
    data: r,
    originalQuantity: l,
    limit: it(t),
    hidden: S === 0,
    ...d ? { formula: d } : {},
    ...y === void 0 ? {} : { rolledQuantity: y },
    ...v === void 0 ? {} : { rollCeiling: v },
    ...e.id ? { source: { itemId: e.id, ruleKey: i } } : {},
    ...(I = n.entryMetadata) == null ? void 0 : I.call(n, e, S)
  };
}
function at(e, n) {
  var u, d;
  const i = we(e), t = i == null ? void 0 : i.getFlag(f, "state"), s = i == null ? void 0 : i.getFlag(f, "items"), a = new Map(Array.isArray(s) ? s.map((y) => [y.id, y]) : []), c = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), r = ne(e, n), l = n.snapshot && !Ce(e) && !((u = e.getFlag(f, "config")) != null && u.customId);
  for (const y of (t == null ? void 0 : t.entries) ?? []) {
    const v = a.get(y.id);
    if ((d = v == null ? void 0 : v.source) != null && d.ruleKey)
      c.set(v.source.ruleKey, { ...v, ...y });
    else if (l && (v != null && v.data) && !v.currency && !v.source) {
      const S = nt(r, n, v.data);
      if (!S) continue;
      const I = j(e, S).token;
      o.set(I, o.has(I) ? null : { ...v, ...y });
    }
  }
  for (const [y, v] of o) v && !c.has(y) && c.set(y, v);
  return {
    vault: i,
    state: t,
    byId: a,
    byKey: c,
    items: r,
    corpse: Ae(i),
    shared: ve(),
    locked: Ce(e) || !t && (e.getFlag(f, "state") || i && !i.getFlag(f, "draft"))
  };
}
function xt(e, n) {
  const { state: i, byKey: t, items: s, corpse: a, shared: c, locked: o } = at(e, n), r = be(e);
  return s.map((l) => {
    var v, S;
    const u = j(e, l, r), d = t.get(u.token), y = o ? "RuleLocked" : !u.token || i && !d ? "RuleMissingSnapshot" : d != null && d.taken ? "RuleCollected" : d != null && d.claim ? "RuleReserved" : "";
    return {
      id: l.id,
      name: l.name,
      img: l.img,
      quantity: l.system.quantity,
      entry: d,
      effective: ye(u, a, c),
      overrides: { token: a[u.token], actor: (v = c.actor) == null ? void 0 : v[u.actor], global: (S = c.global) == null ? void 0 : S[u.global] },
      canToken: !y,
      tokenUnavailable: y,
      canActor: !!u.actor,
      canGlobal: !!u.global
    };
  });
}
async function Ht(e, n, i, t, s) {
  if (!$()) throw new g("RuleGM");
  const { vault: a, state: c, byId: o, byKey: r, items: l, corpse: u, shared: d, locked: y } = at(e, n), v = be(e), S = l.filter((b) => t.includes(b.id)).map((b) => ({ item: b, key: j(e, b, v)[i] }));
  if (!t.length || S.length !== t.length || S.some(({ key: b }) => !b)) throw new g("RuleScopeUnavailable");
  const I = S.map(({ key: b }) => b);
  if (i === "actor" || i === "global")
    return Ft.run(me, async () => {
      if (!$()) throw new g("RuleGM");
      const b = ve(), p = { ...b, [i]: Ue(b[i], I, i === "global" && (s == null ? void 0 : s.mode) === "allow" ? null : s) };
      await game.settings.set(f, me, p);
    });
  if (i !== "token" || y) throw new g("RuleScopeUnavailable");
  if (c && I.some((b) => {
    const p = r.get(b);
    return !p || p.taken || p.claim;
  })) throw new g("RuleScopeUnavailable");
  const w = Ue(u, I, s);
  if (!a) {
    Object.keys(w).length && await ot(e, [], { rules: JSON.stringify(w), draft: !0 });
    return;
  }
  if (!c) {
    await a.setFlag(f, "rules", JSON.stringify(w));
    return;
  }
  const q = /* @__PURE__ */ new Map(), L = [];
  for (const { item: b, key: p } of S) {
    const m = r.get(p), h = ye(j(e, b, v), w, d).rule;
    if (m.limit !== it(h) || !m.formula && st(b, n, h)) {
      let M;
      const T = await He(b, n, p, h, {
        original: m.originalQuantity ?? m.data.system.quantity,
        onRoll: (E) => {
          M = E;
        }
      });
      q.set(m.id, T), M && L.push({ roll: M, itemName: b.name, quantity: T.data.system.quantity });
    }
  }
  if (!$()) throw new g("RuleGM");
  const C = {
    ...c,
    vaultId: a.id,
    entries: c.entries.map((b) => q.has(b.id) ? xe(q.get(b.id)) : b)
  };
  return await a.update({
    [G("rules")]: JSON.stringify(w),
    [G("state")]: C,
    [G("items")]: Array.from(o.values(), (b) => q.get(b.id) ?? b)
  }), await X(e, C), L;
}
async function ot(e, n, i) {
  var a, c;
  const s = await (((c = (a = globalThis.foundry) == null ? void 0 : a.documents) == null ? void 0 : c.JournalEntry) ?? globalThis.JournalEntry).create({
    name: `HoloLoot · ${e.name}`,
    ownership: { default: 0 },
    flags: { [f]: { tokenUuid: e.uuid, kind: "snapshot", items: structuredClone(n), ...i } }
  });
  if (!s) throw new g("PersistenceFailed");
  return s.id;
}
function le(e, n, i) {
  const t = game.journal.get(e);
  if (!t || t.getFlag(f, "tokenUuid") !== n.uuid || t.getFlag(f, "kind") !== i) throw new g("RecoveryRequired");
  const s = t.getFlag(f, "items");
  if (!Array.isArray(s)) throw new g("RecoveryRequired");
  return structuredClone(s);
}
function rt(e, n) {
  const i = Z(e);
  return !!(e.actor && (n.manual || i.source !== "custom" && !i.customId) && n.sourceClaim && n.removeSource);
}
function $t(e, n) {
  var c;
  const i = we(e), t = new Set((c = i == null ? void 0 : i.getFlag(f, "state")) == null ? void 0 : c.entries.filter((o) => !o.taken).map((o) => o.id)), s = i == null ? void 0 : i.getFlag(f, "items"), a = new Set((Array.isArray(s) ? s : []).filter((o) => o.wholeItem && t.has(o.id)).map((o) => {
    var r;
    return (r = o.source) == null ? void 0 : r.ruleKey;
  }));
  return ne(e, n).map((o) => ({
    id: o.id,
    name: o.name,
    img: o.img,
    selected: a.has(j(e, o, null).token)
  }));
}
async function Et(e, n, i, t) {
  if (!$()) throw new g("RuleGM");
  if (!n.manual || !["enabled", "disabled"].includes(i)) throw new g("InvalidRequest");
  await ct(e, n, { mode: i, ids: new Set(t) }), await e.setFlag(f, "config", { mode: i, source: "inventory" });
}
async function ct(e, n, i) {
  var L, C, b;
  if (!$()) throw new g("RuleGM");
  if (!rt(e, n) || n.manual && !i) throw new g("RefreshUnsupported");
  const t = we(e), s = t == null ? void 0 : t.getFlag(f, "state");
  if (!s) {
    await $e(e, n, i);
    return;
  }
  if (s.version !== 1) throw new g("RecoveryRequired");
  const a = s.entries.filter((p) => p.claim || p.taken), c = (p) => {
    var m, h, M, T;
    return ((h = (m = p.claim) == null ? void 0 : m.source) == null ? void 0 : h.itemId) || ((T = (M = p.claim) == null ? void 0 : M.source) == null ? void 0 : T.currency) && `currency:${p.claim.source.currency}`;
  };
  if (a.length && e.actorLink || a.some((p) => !c(p)))
    throw new g("RefreshUntracked");
  const o = new Set(a.filter((p) => !p.taken).map(c)), r = le(t.id, e, "snapshot"), l = new Map(r.map((p) => [p.id, p]));
  if (a.some((p) => !p.taken && !l.has(p.id))) throw new g("RecoveryRequired");
  const u = /* @__PURE__ */ new Map();
  for (const p of s.entries) {
    const m = l.get(p.id), h = ((L = m == null ? void 0 : m.source) == null ? void 0 : L.ruleKey) || ((C = m == null ? void 0 : m.currency) == null ? void 0 : C.storage) === "balance" && `currency:${m.currency.unit}`;
    h && u.set(h, { saved: m, taken: p.taken });
  }
  const d = (p, m) => (m && !m.taken && ee({ ...p, id: m.saved.id }) === ee(m.saved) && (p.id = m.saved.id), p), y = be(e), v = Ae(t), S = ve(), I = [];
  for (const p of ne(e, n)) {
    if (o.has(p.id) || n.manual && !(i != null && i.ids.has(p.id))) continue;
    const m = j(e, p, y), h = u.get(m.token), M = h == null ? void 0 : h.saved.limit, T = M === void 0 ? ye(m, v, S).rule : pe(M === "allow" || M === "never" ? M : "quantity", M), E = h == null ? void 0 : h.saved.rolledQuantity, U = M === void 0 || h.saved.formula ? void 0 : h.saved.rollCeiling ?? h.saved.data.system.quantity;
    I.push(d(await He(p, n, m.token, T, { previousRoll: E, legacyRollCeiling: U }), h));
  }
  for (const p of ((b = n.currencyEntries) == null ? void 0 : b.call(n, e.actor)) ?? []) {
    const m = `currency:${p.currency.unit}`;
    o.has(m) || I.push(d({ ...p, id: foundry.utils.randomID() }, u.get(m)));
  }
  if (!$()) throw new g("RuleGM");
  const w = { ...s, vaultId: t.id, currencyReady: !0, entries: [...a, ...I.map(xe)] }, q = a.flatMap((p) => l.has(p.id) ? [l.get(p.id)] : []);
  await t.update({
    [G("state")]: w,
    [G("items")]: [...q, ...I],
    ...i ? { [G("manualMode")]: i.mode } : {}
  }), await X(e, w);
}
async function $e(e, n, i) {
  var c;
  const t = we(e);
  if (n.manual && !i && (t == null ? void 0 : t.getFlag(f, "manualMode")) !== "enabled") throw new g("Unavailable");
  let s = t == null ? void 0 : t.getFlag(f, "state");
  if (!s && (e.getFlag(f, "state") || t && !t.getFlag(f, "draft")))
    throw new g("RecoveryRequired");
  if (!s) {
    const o = Z(e), r = ve(), l = Ae(t), u = be(e), d = [];
    if (!n.manual && Ce(e)) {
      const S = o.customId ? le(o.customId, e, "custom") : [];
      d.push(...S.map((I) => ({ id: foundry.utils.randomID(), data: I })));
    } else
      for (const S of ne(e, n)) {
        if (n.manual && !(i != null && i.ids.has(S.id))) continue;
        const I = j(e, S, u), { rule: w } = ye(I, l, r);
        d.push(await He(S, n, I.token, w));
      }
    d.push(...(((c = n.currencyEntries) == null ? void 0 : c.call(n, e.actor)) ?? []).map((S) => ({ ...S, id: foundry.utils.randomID() })));
    const y = { version: 1, currencyReady: !0, entries: d.map(xe) }, v = t ? t.id : await ot(e, d, { state: y, ...i ? { manualMode: i.mode } : {} });
    s = { ...y, vaultId: v }, t && await t.update({
      [G("items")]: d,
      [G("state")]: s,
      [G("draft")]: !1,
      ...i ? { [G("manualMode")]: i.mode } : {}
    }), await X(e, s);
  }
  if (s.version !== 1) throw new g("RecoveryRequired");
  if (s = { ...s, vaultId: s.vaultId ?? (t == null ? void 0 : t.id) }, !s.currencyReady && n.currencyEntries) {
    const o = t ?? game.journal.get(s.vaultId), r = o.getFlag(f, "items"), l = Array.isArray(r) ? structuredClone(r) : s.entries.every((d) => d.taken) ? [] : le(s.vaultId, e, "snapshot"), u = n.currencyEntries(e.actor).map((d) => ({ ...d, id: foundry.utils.randomID() }));
    s = { ...s, currencyReady: !0, entries: [...s.entries, ...u.map(({ id: d }) => ({ id: d, taken: !1 }))] }, u.length ? await o.update({ [`flags.${f}.items`]: [...l, ...u], [`flags.${f}.state`]: s }) : await o.setFlag(f, "state", s), await X(e, s);
  }
  if (e.getFlag(f, "state") || await X(e, s), s.entries.every((o) => o.taken)) return {
    ...s,
    entries: s.entries.map((o) => ({ ...o, data: null }))
  };
  const a = le(s.vaultId, e, "snapshot");
  return { ...s, entries: s.entries.map((o) => {
    var d;
    if (o.taken) return { ...o, data: null };
    const r = a.find((y) => y.id === o.id), l = r == null ? void 0 : r.data;
    if (!l || !!r.wholeItem != !!n.manual) throw new g("RecoveryRequired");
    let u = r.source;
    if (!u && !r.currency && !((d = e.getFlag(f, "config")) != null && d.customId) && n.snapshot) {
      const y = nt(ne(e, n), n, l);
      y && (u = { itemId: y.id });
    }
    return {
      ...o,
      data: l,
      ...r.wholeItem ? { wholeItem: !0 } : {},
      ...r.formula ? { formula: r.formula } : {},
      ...r.currency ? { currency: r.currency } : {},
      ...u ? { source: u } : {}
    };
  }) };
}
async function Ot(e, n) {
  const i = {
    version: 1,
    ...n.currencyReady ? { currencyReady: !0 } : {},
    vaultId: n.vaultId,
    entries: n.entries.map(({ id: s, taken: a, claim: c, hidden: o }) => ({
      id: s,
      taken: !!a,
      ...c ? { claim: c } : {},
      ...o ? { hidden: o } : {}
    }))
  }, t = game.journal.get(n.vaultId);
  if ((t == null ? void 0 : t.getFlag(f, "tokenUuid")) !== e.uuid) throw new g("RecoveryRequired");
  await t.setFlag(f, "state", i), await X(e, i);
}
function Nt(e, n) {
  return {
    tokenUuid: e.uuid,
    name: e.name,
    img: e.texture.src,
    entries: n.entries.filter((i) => !i.taken && !i.hidden).map((i) => {
      var c, o, r, l, u, d, y, v, S, I, w, q, L, C, b, p, m;
      const t = { ...i.data, system: i.data.system ?? {} }, s = t.system.identified === !1 || ((c = t.system.identification) == null ? void 0 : c.status) === "unidentified", a = s ? (o = t.system.unidentified) == null ? void 0 : o.description : (r = t.system.description) == null ? void 0 : r.value;
      return {
        id: i.id,
        name: i.currency ? game.i18n.localize(`HL.Currency.${i.currency.unit}`) : s ? ((l = t.system.unidentified) == null ? void 0 : l.name) || ((d = (u = t.system.identification) == null ? void 0 : u.unidentified) == null ? void 0 : d.name) || game.i18n.localize("HL.Unidentified") : t.name,
        currency: !!i.currency,
        img: s && ((v = (y = t.system.identification) == null ? void 0 : y.unidentified) == null ? void 0 : v.img) || t.img,
        quantity: i.wholeItem ? 1 : ((S = i.currency) == null ? void 0 : S.amount) ?? t.system.quantity,
        ...i.wholeItem ? { wholeItem: !0 } : {},
        ...i.formula ? { formula: i.formula } : {},
        type: i.currency ? game.i18n.localize("HL.CurrencyLabel") : game.i18n.localize(`TYPES.Item.${t.type}`),
        rarity: s ? "" : game.i18n.localize(((q = (w = (I = globalThis.CONFIG) == null ? void 0 : I.DND5E) == null ? void 0 : w.itemRarity) == null ? void 0 : q[t.system.rarity]) ?? ((p = (C = (L = globalThis.CONFIG) == null ? void 0 : L.PF2E) == null ? void 0 : C.rarityTraits) == null ? void 0 : p[(b = t.system.traits) == null ? void 0 : b.rarity]) ?? t.system.rarity ?? ""),
        tooltip: ((m = new DOMParser().parseFromString(a ?? "", "text/html").body.textContent) == null ? void 0 : m.slice(0, 1500)) ?? "",
        pending: !!i.claim
      };
    })
  };
}
function Dt(e, n = e) {
  const i = `${n} |`;
  return {
    log: (t, ...s) => console.log(i, t, ...s),
    warn: (t, ...s) => console.warn(i, t, ...s),
    error: (t, ...s) => console.error(i, t, ...s)
  };
}
function Pt(e, n = {}) {
  const i = n.socketName ?? `module.${e}`, t = Dt(e, n.title ?? e);
  return {
    socketName: i,
    emit(s) {
      var c;
      const a = (c = globalThis.game) == null ? void 0 : c.socket;
      return a != null && a.emit ? (a.emit(i, s), !0) : (t.warn("Foundry socket is unavailable.", s), !1);
    },
    isGMSender(s) {
      var a, c, o;
      return s ? !!((o = (c = (a = globalThis.game) == null ? void 0 : a.users) == null ? void 0 : c.get(String(s))) != null && o.isGM) : !1;
    }
  };
}
const _e = Pt(f, { title: "HoloSuite Loot" }), ie = /* @__PURE__ */ new Map(), Ut = new ge();
async function Gt(e, n) {
  game.socket.on(_e.socketName, (i) => {
    (i == null ? void 0 : i.type) === "refresh" && typeof i.tokenUuid == "string" && n(i.tokenUuid);
  }), Hooks.on("updateUser", (i, t, s, a) => {
    var o, r, l;
    if (i.id === game.user.id && ((r = (o = t.flags) == null ? void 0 : o[f]) != null && r[Ie])) {
      let u;
      try {
        u = JSON.parse(i.getFlag(f, Ie));
      } catch {
        return;
      }
      const d = ie.get(u == null ? void 0 : u.id);
      d && d.gm === a && ((l = game.users.get(a)) != null && l.isGM) && (clearTimeout(d.timer), ie.delete(u.id), u.result.error ? d.reject(new g(u.result.error)) : d.resolve(structuredClone(u.result)));
    }
    const c = gt(i, t, a, Ve);
    !c || !$() || typeof c.id != "string" || !/^[\w-]{1,64}$/.test(c.id) || Ut.run(i.id, async () => {
      if (!$()) return;
      let u;
      try {
        if (!fe(c)) throw new g("InvalidRequest");
        u = await e.execute(c, i);
      } catch (d) {
        console.warn("HoloSuite Loot | Request failed", d), u = { error: d.code ?? "TransferFailed" };
      }
      await i.setFlag(f, Ie, JSON.stringify({ id: c.id, result: u })), fe(c) && ["take", "all"].includes(c.action) && _e.emit({ type: "refresh", tokenUuid: c.tokenUuid });
    }).catch((u) => console.warn("HoloSuite Loot | Could not deliver reply", u));
  }), game.user.isGM && await game.user.setFlag(f, "transportVersion", de);
}
async function _t(e, n) {
  if (!fe(e)) throw new g("InvalidRequest");
  const i = Me();
  if (!i) throw new g(game.users.contents.some((s) => s.active && s.isGM) ? "BuildMismatch" : "NoGM");
  if (i.id === game.user.id && n) return n.execute(e, game.user);
  const t = foundry.utils.randomID();
  return new Promise((s, a) => {
    const c = setTimeout(() => {
      ie.delete(t), a(new g("Timeout"));
    }, e.action === "view" ? 8e3 : 2e4);
    ie.set(t, { resolve: s, reject: a, timer: c, gm: i.id }), game.user.setFlag(f, Ve, { ...e, id: t }).catch((o) => {
      clearTimeout(c), ie.delete(t), a(o);
    });
  });
}
function jt() {
  var e, n, i;
  return ((n = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : n.api) ?? ((i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) ?? null;
}
function zt() {
  var e, n, i;
  return ((n = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : n.api) ?? ((i = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : i.api) ?? null;
}
function Bt(e = {}, n = {}) {
  var t, s, a;
  const i = ((s = (t = globalThis.foundry) == null ? void 0 : t.utils) == null ? void 0 : s.mergeObject) ?? ((a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.mergeObject);
  return typeof i == "function" ? i(e, n, { inplace: !1 }) : { ...e, ...n };
}
function Kt() {
  var e, n, i, t, s;
  return ((i = (n = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : n.randomID) == null ? void 0 : i.call(n, 8)) ?? ((s = (t = foundry == null ? void 0 : foundry.utils) == null ? void 0 : t.randomID) == null ? void 0 : s.call(t, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function je(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${Kt()}`),
    tag: e.tag ?? "section",
    classes: Array.isArray(e.classes) ? e.classes : [],
    window: {
      title: e.title ?? "",
      icon: e.icon,
      resizable: e.resizable === !0
    },
    position: {
      width: Number(e.width ?? 600),
      height: e.height === "auto" ? "auto" : Number(e.height ?? 600)
    }
  };
}
function Vt(e) {
  return class extends e {
    constructor(t = {}) {
      const s = Bt(new.target.defaultOptions ?? {}, t);
      super(je(s));
      R(this, "_v1Options");
      this._v1Options = s;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return je(this.defaultOptions ?? {});
    }
    activateListeners(t) {
    }
    async _renderHTML(t, s) {
      var l, u, d;
      const a = typeof this.getData == "function" ? await this.getData() : {}, c = ((l = this._v1Options) == null ? void 0 : l.template) ?? ((u = this.options) == null ? void 0 : u.template) ?? ((d = this.constructor.defaultOptions) == null ? void 0 : d.template);
      if (!c) return document.createDocumentFragment();
      const o = await globalThis.renderTemplate(c, a), r = document.createElement("template");
      return r.innerHTML = o.trim(), r.content;
    }
    _activateV1Form(t) {
      var a, c;
      if (typeof this._updateObject != "function") return;
      const s = (a = t.matches) != null && a.call(t, "form") ? t : (c = t.querySelector) == null ? void 0 : c.call(t, "form");
      s instanceof HTMLFormElement && s.addEventListener("submit", async (o) => {
        var l;
        o.preventDefault(), o.stopPropagation();
        const r = new FormData(s);
        await this._updateObject(o, r), ((l = this._v1Options) == null ? void 0 : l.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(t, s, a) {
      var u, d, y, v;
      s.replaceChildren(t);
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
      Array.isArray(l) && l.length && (s.classList.add(...l), (v = (y = s.closest) == null ? void 0 : y.call(s, ".window-app, .app, .application")) == null || v.classList.add(...l)), this._activateV1Form(s), typeof this.activateListeners == "function" && this.activateListeners(c ? c(s) : s);
    }
  };
}
function Qt() {
  const e = jt(), n = zt(), i = globalThis.Application ?? (n == null ? void 0 : n.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (n == null ? void 0 : n.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (i) return i;
  const t = e == null ? void 0 : e.ApplicationV2;
  return t ? Vt(t) : null;
}
class Jt {
  constructor(n, i) {
    R(this, "outside", (n) => {
      n.composedPath().includes(this.root) || this.dismiss();
    });
    this.root = n, this.dismiss = i, document.addEventListener("pointerdown", this.outside, !0);
  }
  destroy() {
    document.removeEventListener("pointerdown", this.outside, !0);
  }
}
class Wt {
  constructor(n, i, t, s) {
    R(this, "frame", 0);
    R(this, "destroyed", !1);
    R(this, "svg");
    R(this, "line");
    R(this, "lastGeometry", "");
    R(this, "outside", (n) => {
      var t, s;
      const i = n.composedPath();
      n.button === 2 && i.includes(((t = canvas.app) == null ? void 0 : t.canvas) ?? ((s = canvas.app) == null ? void 0 : s.view)) || i.includes(this.root) || this.dismiss();
    });
    R(this, "update", () => {
      var t, s;
      if (this.destroyed) return;
      const n = ((t = canvas.app) == null ? void 0 : t.canvas) ?? ((s = canvas.app) == null ? void 0 : s.view), i = this.token.object;
      if (!this.root.isConnected) {
        this.destroy();
        return;
      }
      if (!i || this.token.hidden) {
        this.destroy(), this.dismiss();
        return;
      }
      if (this.root.isConnected && n && canvas.stage) {
        const a = n.getBoundingClientRect(), c = canvas.app.renderer.screen, o = canvas.stage.worldTransform.apply(i.center), r = a.left + o.x * a.width / c.width, l = a.top + o.y * a.height / c.height, u = this.root.getBoundingClientRect(), d = 24 + Math.min(60, (i.w ?? 0) * Math.abs(canvas.stage.worldTransform.a) / 2), y = r + d + u.width <= innerWidth - 8 ? r + d : r - d - u.width, v = Math.max(8, Math.min(innerWidth - u.width - 8, y)), S = Math.max(8, Math.min(innerHeight - u.height - 8, l - u.height / 3));
        (Math.abs(u.left - v) > 0.5 || Math.abs(u.top - S) > 0.5) && this.position(v, S);
        const I = this.root.querySelector(".hl-panel") ?? this.root, w = I.getBoundingClientRect(), q = getComputedStyle(I), L = parseFloat(q.borderLeftWidth) || 3, C = Math.min(parseFloat(q.borderTopLeftRadius) || 0, w.height / 2, w.width / 2), b = r <= w.left || r >= w.right, p = b ? r <= w.left ? w.left + L / 2 : w.right - L / 2 : Math.max(w.left + C, Math.min(w.right - C, r)), m = b ? Math.max(w.top + C, Math.min(w.bottom - C, l)) : l < (w.top + w.bottom) / 2 ? w.top + L / 2 : w.bottom - L / 2, h = `${r},${l},${p},${m}`;
        h !== this.lastGeometry && (this.line.setAttribute("x1", String(r)), this.line.setAttribute("y1", String(l)), this.line.setAttribute("x2", String(p)), this.line.setAttribute("y2", String(m)), this.lastGeometry = h), this.line.style.stroke = q.borderLeftColor, this.line.style.strokeWidth = String(L), this.svg.style.zIndex = String(Math.max(0, (parseInt(getComputedStyle(this.root).zIndex) || 100) - 1));
      }
      this.frame = requestAnimationFrame(this.update);
    });
    this.root = n, this.token = i, this.position = t, this.dismiss = s;
    const a = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(a, "svg"), this.svg.classList.add("hl-loot-tether"), this.svg.setAttribute("aria-hidden", "true"), this.line = document.createElementNS(a, "line"), this.svg.append(this.line), document.body.append(this.svg), document.addEventListener("pointerdown", this.outside, !0), this.frame = requestAnimationFrame(this.update);
  }
  destroy() {
    this.destroyed = !0, cancelAnimationFrame(this.frame), document.removeEventListener("pointerdown", this.outside, !0), this.svg.remove();
  }
}
const J = (e) => String(e ?? "").replace(/[&<>"']/g, (n) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[n]);
async function kt({ roll: e, itemName: n, quantity: i }) {
  var c;
  const { game: t } = globalThis, s = t.i18n.format("HL.QuantityRollChat", { item: J(n), quantity: i }), a = ((c = t.release) == null ? void 0 : c.generation) >= 14 ? { messageMode: "self" } : { rollMode: "selfroll" };
  await e.toMessage({ flavor: s }, a);
}
async function Xt(e, n) {
  var d;
  const { game: i, foundry: t, ChatMessage: s } = globalThis, a = e.claim.quantityRoll, c = n.preview ? n.preview(e) : e.data, r = (((d = t == null ? void 0 : t.dice) == null ? void 0 : d.Roll) ?? globalThis.Roll).fromData(a.roll), l = i.i18n.format("HL.PickupRollChat", { item: J(c.name), quantity: a.quantity }), u = await r.toMessage({ flavor: l }, { create: !1 });
  await s.create({ ...u, whisper: [e.claim.userId], blind: !1 });
}
async function Yt({ token: e, actor: n, entry: i, adapter: t }) {
  var r, l;
  const { game: s, ChatMessage: a } = globalThis;
  if (!s.settings.get(f, "chatLog")) return;
  const c = t.preview ? t.preview(i) : i.data, o = s.i18n.format("HL.ChatLooted", {
    actor: J(n.name),
    source: J(e.name),
    item: J(c.name),
    quantity: J(i.wholeItem ? 1 : ((r = i.currency) == null ? void 0 : r.amount) ?? ((l = c.system) == null ? void 0 : l.quantity) ?? 1)
  });
  await a.create({
    speaker: a.getSpeaker({ actor: n }),
    content: `<p>${o}</p>`,
    whisper: [],
    blind: !1,
    flags: { [f]: { claimId: i.claim.id, userId: i.claim.userId } }
  });
}
const ut = Qt(), lt = (e) => `modules/${f}/templates/${e}.hbs`, x = (e) => game.i18n.localize(`HL.${e}`);
function D(e) {
  const n = x((e == null ? void 0 : e.code) ?? "TransferFailed");
  return ui.notifications.warn(n), n;
}
const dt = (e) => e instanceof HTMLElement ? e : e[0];
class Zt extends ut {
  constructor(i, t, s) {
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
    this.token = i, this.send = t, this.adapter = s;
    const a = game.user.character;
    k(a, game.user, s, i) && (this.destination = s.manual ? O(a) : a.id);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: "HoloSuite Loot",
      classes: ["holosuite-loot-window", "holosuite-loot-popup"],
      template: lt("loot"),
      width: 340,
      height: "auto",
      resizable: !1
    });
  }
  show(i) {
    return this.firstDraw || (this.firstDraw = new Promise((t) => {
      this.resolveFirstDraw = t;
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
            D(i), await this.close();
            return;
          }
          this.data = { entries: [] }, this.message = D(i);
        }
        this.loading = !1, this.disposed || this.render(!0);
      })().finally(() => {
        this.refreshing = null, this.refreshAgain && !this.disposed && !this.busy && this.refresh();
      }), this.refreshing);
    }
  }
  getData() {
    var r, l;
    const i = game.settings.get(f, "characterSelector"), t = game.settings.get(f, "panelTheme"), s = this.adapter.manual ? [...new Map([...game.actors.contents, ...Array.from(((r = canvas.scene) == null ? void 0 : r.tokens) ?? [], (u) => u.actor)].filter((u) => k(u, game.user, this.adapter, this.token)).map((u) => [O(u), u])).values()] : game.actors.contents.filter((u) => k(u, game.user, this.adapter)), a = (u) => this.adapter.manual ? O(u) : u.id;
    let c = "";
    if (i)
      !this.destination && s.length === 1 && (this.destination = a(s[0]));
    else try {
      this.destination = O(Qe(game.user, game.actors.contents, (l = canvas.scene) == null ? void 0 : l.tokens, this.adapter, this.token));
    } catch (u) {
      this.destination = "", c = x(u.code);
    }
    const o = i ? s.some((u) => a(u) === this.destination) : !!this.destination;
    return {
      ...this.data,
      name: this.data.name ?? this.token.name,
      img: this.data.img ?? this.token.texture.src,
      actors: s.map((u) => ({ id: a(u), name: u.name, selected: a(u) === this.destination })),
      disabled: this.loading || this.busy || !o || !this.data.entries.length,
      loading: this.loading,
      showSelector: i,
      theme: t,
      busy: this.busy,
      message: this.message || c || (!s.length && i ? x("NoActor") : ""),
      empty: !this.loading && !this.data.entries.length && !this.message
    };
  }
  activateListeners(i) {
    var a, c, o;
    if (super.activateListeners(i), this.disposed) return;
    const t = dt(i);
    (a = this.presentation) == null || a.destroy();
    const s = t.closest(".window-app, .application") ?? t.closest(".holosuite-loot-popup") ?? t;
    this.presentation = new Wt(
      s,
      this.token,
      (r, l) => this.setPosition({ left: r, top: l }),
      () => void this.close()
    ), (c = t.querySelector("select")) == null || c.addEventListener("change", (r) => {
      this.destination = r.target.value, this.render(!0);
    }), t.querySelectorAll("button[data-loot]").forEach((r) => {
      r.addEventListener("click", () => void this.take(r.dataset.loot));
    }), t.querySelectorAll("[data-inspect]").forEach((r) => {
      r.addEventListener("click", () => void this.inspect(r.dataset.inspect));
    }), (o = this.resolveFirstDraw) == null || o.call(this), this.resolveFirstDraw = null;
  }
  async inspect(i) {
    try {
      const s = { ...(await this.send({ action: "inspect", entryId: i, tokenUuid: this.token.uuid })).item, ownership: { default: 0, [game.user.id]: 2 } }, a = globalThis.CONFIG.Item.documentClass;
      new a(s, { temporary: !0 }).sheet.render(!0, { editable: !1 });
    } catch (t) {
      D(t);
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
        const t = this.data.failures ?? [];
        this.message = t.map((s) => `${s.name}: ${x(s.code)}`).join(" · "), this.message && ui.notifications.warn(this.message);
      } catch (t) {
        this.message = D(t);
      } finally {
        this.busy = !1, this.disposed || (this.render(!0), this.refreshAgain && this.refresh());
      }
    }
  }
  async close(i) {
    var t, s;
    return this.disposed = !0, (t = this.presentation) == null || t.destroy(), this.presentation = null, (s = this.resolveFirstDraw) == null || s.call(this), this.resolveFirstDraw = null, super.close(i);
  }
}
class ei extends ut {
  constructor(i, t, s) {
    super({ id: `hololoot-config-${i.id}` });
    R(this, "token");
    R(this, "adapter");
    R(this, "queue");
    R(this, "config");
    R(this, "scope", "token");
    R(this, "busy", !1);
    R(this, "dismissal", null);
    this.token = i, this.adapter = t, this.queue = s, this.config = structuredClone(Z(i));
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: x("Title"),
      classes: ["holosuite-loot-window", "holosuite-loot-config"],
      template: lt("config"),
      width: 480,
      height: "auto",
      resizable: !1
    });
  }
  getData() {
    const i = !!this.adapter.manual, t = !i && game.settings.get(f, "zeroHP"), s = !t && this.config.mode === "automatic" ? "disabled" : this.config.mode, a = (r) => (r == null ? void 0 : r.quantity) ?? (r ? x(`Rule.${r.mode}`) : ""), c = i ? $t(this.token, this.adapter) : xt(this.token, this.adapter).map(({ entry: r, effective: l, overrides: u, ...d }) => ({
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
    })), o = $();
    return {
      name: this.token.name,
      theme: game.settings.get(f, "panelTheme"),
      busy: this.busy,
      automatic: t,
      rows: c,
      canEdit: o,
      manual: i,
      saveDisabled: this.busy || i && !o,
      canRefresh: !i && o && rt(this.token, this.adapter),
      scopes: ["token", "actor", "global"].map((r) => ({ value: r, label: x(`Scope.${r}`), selected: this.scope === r })),
      modes: (t ? ["automatic", "enabled", "disabled"] : ["enabled", "disabled"]).map((r) => ({ value: r, label: x(r), selected: r === s }))
    };
  }
  activateListeners(i) {
    var y, v, S, I;
    super.activateListeners(i);
    const t = dt(i);
    (y = this.dismissal) == null || y.destroy(), this.dismissal = new Jt(t.closest(".window-app, .application") ?? t, () => {
      this.busy || this.close();
    }), (v = t.querySelector('[name="mode"]')) == null || v.addEventListener("change", (w) => {
      this.config.mode = w.target.value;
    }), (S = t.querySelector("[data-save]")) == null || S.addEventListener("click", () => {
      const w = Array.from(t.querySelectorAll("[data-manual-item]:checked"), (q) => q.value);
      this.save(w);
    }), (I = t.querySelector("[data-close]")) == null || I.addEventListener("click", () => void this.close());
    const s = t.querySelector('[name="scope"]'), a = t.querySelector('[name="behavior"]'), c = t.querySelector('[name="formula"]'), o = t.querySelector("[data-apply]"), r = t.querySelector("[data-refresh-inventory]"), l = t.querySelector("[data-select-all]");
    if (!s || !a || !c || !o || !l) return;
    const u = Array.from(t.querySelectorAll("input[data-rule-item]")), d = () => {
      this.scope = s.value, s.disabled = a.disabled = c.disabled = this.busy, r && (r.disabled = this.busy);
      const w = u.filter((L) => {
        const C = L.dataset[this.scope] === "true";
        L.disabled = this.busy || !C, C || (L.checked = !1);
        const b = L.closest("label"), p = b == null ? void 0 : b.querySelector("[data-rule-unavailable]"), m = L.dataset[`${this.scope}Unavailable`];
        p && (p.textContent = !C && m ? x(m) : "");
        const h = b == null ? void 0 : b.querySelector("[data-scoped-rule]"), M = L.dataset[`${this.scope}Rule`];
        return h && (h.textContent = M && L.dataset.effectiveScope !== this.scope ? ` · ${x(`Scope.${this.scope}`)} ${M}` : ""), C;
      }), q = w.filter((L) => L.checked).length;
      l.disabled = this.busy || !w.length, l.checked = !!q && q === w.length, l.indeterminate = !!q && !l.checked, o.disabled = this.busy || !q, c.hidden = a.value !== "quantity";
    };
    s.addEventListener("change", d), a.addEventListener("change", d);
    for (const w of u) w.addEventListener("change", d);
    l.addEventListener("change", () => {
      for (const w of u) w.disabled || (w.checked = l.checked);
      d();
    }), r == null || r.addEventListener("click", async () => {
      if (!(!$() || this.busy)) {
        this.busy = !0, d();
        try {
          await this.queue.run(this.token.uuid, () => ct(this.token, this.adapter)), ui.notifications.info(x("InventoryRefreshed"));
        } catch (w) {
          D(w);
          return;
        } finally {
          this.busy = !1, d();
        }
        this.rendered && this.render(!0);
      }
    }), o.addEventListener("click", async () => {
      if (!(!$() || this.busy)) {
        try {
          const w = pe(a.value, c.value), q = u.filter((b) => b.checked && !b.disabled).map((b) => b.value), L = this.scope;
          this.busy = !0, d();
          const C = await this.queue.run(this.token.uuid, () => Ht(this.token, this.adapter, L, q, w));
          for (const b of C ?? [])
            kt(b).catch((p) => console.warn("HoloSuite Loot | Could not post quantity roll", p));
        } catch (w) {
          D(w);
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
        const t = this.config.mode === "automatic" && (this.adapter.manual || !game.settings.get(f, "zeroHP")) ? "disabled" : this.config.mode;
        await this.queue.run(this.token.uuid, () => this.adapter.manual ? Et(this.token, this.adapter, t, i) : this.token.setFlag(f, "config", { ...Z(this.token), mode: t })), await this.close();
      } catch (t) {
        D(t);
      } finally {
        this.busy = !1, this.rendered && this.render(!0);
      }
    }
  }
  async close(i) {
    var t;
    return (t = this.dismissal) == null || t.destroy(), this.dismissal = null, super.close(i);
  }
}
class ti {
  constructor(n) {
    R(this, "sprites", /* @__PURE__ */ new Map());
    R(this, "texture");
    R(this, "disposed", !1);
    var t;
    this.available = n;
    const i = ((t = foundry.canvas) == null ? void 0 : t.loadTexture) ?? globalThis.loadTexture;
    Promise.resolve().then(() => i == null ? void 0 : i(`modules/${f}/assets/ui/loot-badge.svg`)).then((s) => {
      this.disposed || !s || (this.texture = s, this.refreshScene());
    }).catch((s) => console.warn("HoloSuite Loot | Badge texture could not load", s));
  }
  refreshScene() {
    var n;
    for (const i of ((n = canvas.tokens) == null ? void 0 : n.placeables) ?? []) this.refresh(i);
  }
  refresh(n) {
    if (!n || this.disposed || !this.texture) return;
    const i = n.document, t = i.getFlag(f, "state");
    if (n.destroyed || n.isPreview || i.hidden || !this.available(i) || t && !t.entries.some((a) => !a.taken && !a.hidden)) {
      this.remove(n);
      return;
    }
    let s = this.sprites.get(n);
    (s != null && s.destroyed || (s == null ? void 0 : s.parent) !== n) && (this.remove(n), s = new PIXI.Sprite(this.texture), s.name = "holosuite-loot-badge", s.eventMode = "none", s.anchor.set(0.5), s.width = s.height = 24, s.zIndex = 100, n.addChild(s), this.sprites.set(n, s)), s.position.set(n.w, 0);
  }
  remove(n) {
    var t;
    const i = this.sprites.get(n);
    this.sprites.delete(n), i && !i.destroyed && ((t = i.parent) == null || t.removeChild(i), i.destroy());
  }
  destroy() {
    this.disposed = !0;
    for (const n of this.sprites.keys()) this.remove(n);
  }
}
const H = /* @__PURE__ */ new Map();
let A = null, z = !1, ue = 0;
const P = () => St(game.system.id), ae = () => Mt(P()), Ee = (e) => (e == null ? void 0 : e.actor) && (P().manual ? !!e.actor.items : e.actor.type === "npc"), ii = (e, n, i) => {
  var t;
  return Qe(e, game.actors.contents, (t = game.scenes.get(e.viewedScene)) == null ? void 0 : t.tokens, n, i);
}, re = new It({
  moduleId: f,
  authority: $,
  environment: ae,
  adapter: P,
  token: async (e) => {
    if (!/^Scene\.[^.]+\.Token\.[^.]+$/.test(e)) throw new g("InvalidRequest");
    const i = await (foundry.utils.fromUuid ?? globalThis.fromUuid)(e);
    return (i == null ? void 0 : i.documentName) === "Token" ? i : null;
  },
  actor: (e) => game.actors.get(e) ?? (foundry.utils.fromUuid ?? globalThis.fromUuid)(e),
  id: () => foundry.utils.randomID(),
  destination: (e, n, i) => game.settings.get(f, "characterSelector") ? e.actorId ? re.io.actor(e.actorId) : null : ii(n, P(), i),
  load: $e,
  save: Ot,
  summary: Nt,
  collected: Yt,
  rollQuantity: At,
  quantityRolled: Xt
}), Te = (e) => _t(e, re);
function Oe(e) {
  var n;
  return z && se(e, ae()) && (game.user.isGM || !e.hidden && ((n = e.object) == null ? void 0 : n.isVisible));
}
async function Se(e) {
  var a, c, o, r, l;
  e = (e == null ? void 0 : e.document) ?? e;
  const n = P();
  if (!n) {
    D(new g("Unsupported"));
    return;
  }
  if (game.user.isGM) return ce(e);
  if (!Oe(e)) {
    D(new g("Unavailable"));
    return;
  }
  const i = ++ue;
  let t;
  if (Fe() > 0 && (!H.has(e.uuid) || (a = H.get(e.uuid)) != null && a.disposed)) {
    try {
      t = await Te({ action: "view", tokenUuid: e.uuid });
    } catch (u) {
      i === ue && ((c = canvas.scene) == null ? void 0 : c.id) === ((o = e.parent) == null ? void 0 : o.id) && D(u);
      return;
    }
    if (i !== ue || ((r = canvas.scene) == null ? void 0 : r.id) !== ((l = e.parent) == null ? void 0 : l.id)) return;
  }
  for (const [u, d] of H)
    u !== e.uuid && !d.disposed && await d.close();
  if (i !== ue) return;
  let s = H.get(e.uuid);
  (!s || s.disposed) && (s = new Zt(e, Te, n), H.set(e.uuid, s), await s.show(t), t !== void 0) || s.disposed || await s.refresh();
}
async function ce(e) {
  var n;
  if (!(!game.user.isGM || !P())) {
    if (((n = e == null ? void 0 : e.parent) == null ? void 0 : n.documentName) !== "Scene" || !Ee(e)) {
      ui.notifications.info(x("SelectToken"));
      return;
    }
    try {
      new ei(e, P(), re.queue).render(!0);
    } catch (i) {
      D(i);
    }
  }
}
function oe(e) {
  const n = H.get(e);
  n && !n.disposed && n.refresh();
}
function Ne(e) {
  !z || !$() || P().manual || e.getFlag(f, "state") || !se(e, ae()) || re.queue.run(e.uuid, async () => {
    $() && se(e, ae()) && !e.getFlag(f, "state") && await $e(e, P());
  }).catch((n) => console.warn("HoloSuite Loot | Snapshot initialization failed", e.uuid, n));
}
function _() {
  var e;
  for (const n of ((e = canvas.scene) == null ? void 0 : e.tokens) ?? []) Ne(n);
  A == null || A.refreshScene();
}
function si() {
  const e = [.../* @__PURE__ */ new Set([...canvas.tokens.controlled, ...game.user.targets])];
  if (e.length !== 1) {
    ui.notifications.info(x("SelectToken"));
    return;
  }
  const n = e[0];
  game.user.isGM ? ce(n.document) : Se(n.document);
}
function ze() {
  var n;
  const e = ((n = game.modules.get("holosuite-core")) == null ? void 0 : n.api) ?? game.holosuite;
  return e != null && e.registerApp ? (e.registerApp({
    id: f,
    title: x("Title"),
    icon: "fa-solid fa-box-open",
    playerVisible: !1,
    premium: !1,
    description: x("SelectToken"),
    open: si
  }), !0) : !1;
}
let F, Y, Be = "", Ke = 0;
function W(e) {
  var r, l;
  if (game.user.isGM || !z || e.type === "pointerdown" && e.button !== 2) return;
  const n = F == null ? void 0 : F.getBoundingClientRect(), i = (l = (r = canvas.app) == null ? void 0 : r.renderer) == null ? void 0 : l.screen;
  if (!(n != null && n.width) || !n.height || !i || !canvas.stage) return;
  const t = canvas.stage.worldTransform.applyInverse({
    x: (e.clientX - n.left) * i.width / n.width,
    y: (e.clientY - n.top) * i.height / n.height
  }), s = (u) => {
    var d;
    return (u == null ? void 0 : u.isVisible) && (((d = u.bounds) == null ? void 0 : d.contains(t.x, t.y)) ?? (t.x >= u.document.x && t.y >= u.document.y && t.x <= u.document.x + u.w && t.y <= u.document.y + u.h));
  }, a = s(Y) ? Y : [...canvas.tokens.placeables].reverse().find(s), c = a == null ? void 0 : a.document;
  if (!Oe(c)) {
    for (const u of H.values()) u.disposed || u.close();
    return;
  }
  if (e.type === "contextmenu" && Be === c.uuid && Date.now() - Ke < 1e3) return;
  e.type === "pointerdown" && (Be = c.uuid, Ke = Date.now());
  const o = H.get(c.uuid);
  o && !o.disposed ? o.close() : Se(c);
}
function ft() {
  var e, n;
  A == null || A.destroy(), A = z ? new ti((i) => se(i, ae())) : null, F == null || F.removeEventListener("contextmenu", W, !0), F == null || F.removeEventListener("pointerdown", W, !0), F = ((e = canvas.app) == null ? void 0 : e.canvas) ?? ((n = canvas.app) == null ? void 0 : n.view), F == null || F.addEventListener("contextmenu", W, !0), F == null || F.addEventListener("pointerdown", W, !0);
}
Hooks.once("init", () => {
  game.settings.register(f, me, { scope: "world", config: !1, type: Object, default: {} }), game.settings.register(f, "zeroHP", {
    name: "HL.ZeroHP",
    hint: "HL.ZeroHPHint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0,
    onChange: () => {
      _();
      for (const e of H.keys()) oe(e);
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
  }), game.settings.register(f, Ze, {
    name: "HL.LootRange",
    hint: "HL.LootRangeHint",
    scope: "world",
    config: !0,
    type: Number,
    default: et,
    onChange: () => {
      for (const e of H.keys()) oe(e);
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
      for (const e of H.values()) e.disposed || e.render(!1);
    }
  });
});
Hooks.once("ready", async () => {
  var e;
  if (!((e = game.modules.get("holosuite-core")) != null && e.active)) {
    ui.notifications.error(x("CoreMissing"));
    return;
  }
  try {
    await Gt(re, oe);
  } catch (n) {
    D(n);
    return;
  }
  z = !0, game.modules.get(f).api = {
    version: de,
    open: Se,
    configure: ce,
    registerAdapter: bt,
    // Requests still pass every authority and permission check, including calls from macros.
    request: Te,
    authority: () => {
      var n;
      return (n = Me()) == null ? void 0 : n.id;
    }
  }, ze(), setTimeout(ze, 500), ft(), _(), console.info(`HoloSuite Loot | ${de} ready; Foundry ${game.version}, ${game.system.id} ${game.system.version}`);
});
Hooks.on("canvasReady", () => {
  ft(), _();
});
Hooks.on("hoverToken", (e, n) => {
  n ? Y = e : Y === e && (Y = null);
});
Hooks.on("canvasTearDown", () => {
  A == null || A.destroy(), A = null, Y = null, F == null || F.removeEventListener("contextmenu", W, !0), F == null || F.removeEventListener("pointerdown", W, !0), F = null;
  for (const e of H.values()) e.close();
  H.clear();
});
Hooks.on("renderTokenHUD", (e, n) => {
  var c;
  if (!z) return;
  const i = (c = e.object) == null ? void 0 : c.document;
  if (!Ee(i)) return;
  const t = n instanceof HTMLElement ? n : n[0], s = t.querySelector(".col.right") ?? t;
  t.querySelectorAll(".hl-token-action").forEach((o) => o.remove());
  const a = (o, r, l) => {
    const u = document.createElement("button");
    u.type = "button", u.className = "control-icon hl-token-action", u.title = o, u.setAttribute("aria-label", o);
    const d = document.createElement("i");
    d.className = r, u.append(d), u.addEventListener("click", (y) => {
      y.preventDefault(), y.stopPropagation(), l();
    }), s.append(u);
  };
  game.user.isGM ? P() && !game.settings.get(f, "hideGmLootButton") && a(x("Loot"), "fa-solid fa-box-open", () => void ce(i)) : Oe(i) && a(x("Loot"), "fa-solid fa-box-open", () => void Se(i));
});
Hooks.on("renderTokenConfig", (e, n) => {
  var a;
  if (!z || !game.user.isGM || !P()) return;
  const i = e.document ?? e.object;
  if (((a = i == null ? void 0 : i.parent) == null ? void 0 : a.documentName) !== "Scene" || !Ee(i)) return;
  const t = n instanceof HTMLElement ? n : n[0];
  if (t.querySelector(".hl-token-config")) return;
  const s = document.createElement("button");
  s.type = "button", s.className = "hl-token-config", s.textContent = x("Configure"), s.addEventListener("click", () => ce(i)), (t.querySelector('[data-tab="character"]') ?? t.querySelector("form") ?? t).append(s);
});
Hooks.on("drawToken", (e) => A == null ? void 0 : A.refresh(e));
Hooks.on("refreshToken", (e, n) => {
  (!n || n.refreshSize || n.refreshShape) && (A == null || A.refresh(e));
});
Hooks.on("destroyToken", (e) => A == null ? void 0 : A.remove(e));
Hooks.on("updateToken", (e, n) => {
  var i, t, s;
  if (Ne(e), A == null || A.refresh(e.object), oe(e.uuid), !(!H.size || !Fe() || ((i = e.parent) == null ? void 0 : i.id) !== ((t = canvas.scene) == null ? void 0 : t.id) || !e.actor || !((s = P()) != null && s.destination(e.actor)) || !e.actor.testUserPermission(game.user, "OWNER") || !["x", "y", "elevation", "width", "height", "hidden"].some((a) => a in n)))
    for (const a of H.keys()) a !== e.uuid && oe(a);
});
Hooks.on("createToken", Ne);
Hooks.on("updateCombatant", _);
Hooks.on("deleteCombatant", _);
Hooks.on("updateActor", _);
Hooks.on("createActiveEffect", _);
Hooks.on("updateActiveEffect", _);
Hooks.on("deleteActiveEffect", _);
Hooks.on("userConnected", _);
Hooks.on("deleteToken", (e) => {
  var n;
  if ((n = H.get(e.uuid)) == null || n.close(), H.delete(e.uuid), !!$())
    for (const i of game.journal.contents)
      i.getFlag(f, "tokenUuid") === e.uuid && i.delete().catch(console.warn);
});
