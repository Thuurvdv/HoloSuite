var rt = Object.defineProperty;
var ct = (e, s, t) => s in e ? rt(e, s, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[s] = t;
var L = (e, s, t) => ct(e, typeof s != "symbol" ? s + "" : s, t);
const h = "holosuite-loot", ce = "1.1.0", ze = "commandV3", ve = "replyV3", N = (e) => structuredClone(e);
function ut(e, s, t, i = "request") {
  var n, a;
  return t !== e.id || !e.active || !((a = (n = s.flags) == null ? void 0 : n[h]) != null && a[i]) ? null : N(e.getFlag(h, i));
}
class y extends Error {
  constructor(s) {
    super(s), this.code = s;
  }
}
function ue(e) {
  const s = (t) => typeof t == "string" && /^[\w-]{1,64}$/.test(t);
  return typeof (e == null ? void 0 : e.tokenUuid) == "string" && /^Scene\.[\w-]{1,64}\.Token\.[\w-]{1,64}$/.test(e.tokenUuid) && ["view", "inspect", "take", "all"].includes(e.action) && (!["inspect", "take"].includes(e.action) || s(e.entryId)) && (e.actorId == null || typeof e.actorId == "string" && /^(?:[\w-]{1,64}|Actor\.[\w-]{1,64}|Scene\.[\w-]{1,64}\.Token\.[\w-]{1,64}(?:\.Actor\.[\w-]{1,64})?)$/.test(e.actorId));
}
function X(e) {
  var s;
  return e.getFlag(h, "config") ?? ((s = e.actor) == null ? void 0 : s.getFlag(h, "config")) ?? { mode: "automatic", source: "inventory" };
}
const P = (e) => (e == null ? void 0 : e.uuid) ?? (e == null ? void 0 : e.id);
function ke(e, s, t, i) {
  const n = (o) => o && i.destination(o) && o.testUserPermission(e, "OWNER");
  if (n(e.character)) return e.character;
  const a = [...new Map(Array.from(t ?? []).map((o) => o.actor).filter(n).map((o) => [P(o), o])).values()];
  if (a.length === 1) return a[0];
  if (a.length > 1) throw new y("AmbiguousActor");
  const r = Array.from(s ?? []).filter(n);
  if (r.length === 1) return r[0];
  throw new y(r.length ? "AmbiguousActor" : "NoActor");
}
function te(e, { combats: s = [], zeroHP: t = !1, automatic: i = !0 } = {}) {
  var o, c, l, u, d;
  if (!(e != null && e.actor) || e.actor.type !== "npc") return !1;
  const n = X(e);
  if (n.mode === "disabled") return !1;
  if (n.mode === "enabled") return !0;
  if (!i) return !1;
  if (s.some((w) => {
    var p, S, R;
    return ((p = w.scene) == null ? void 0 : p.id) === ((S = e.parent) == null ? void 0 : S.id) && ((R = w.combatants) == null ? void 0 : R.some((v) => v.tokenId === e.id && v.defeated));
  })) return !0;
  const a = e.actor.statuses;
  if (a != null && a.has("dead")) return !0;
  const r = (c = (o = e.actor.system) == null ? void 0 : o.attributes) == null ? void 0 : c.hp;
  return t && Number(r == null ? void 0 : r.max) > 0 && (r == null ? void 0 : r.value) === 0 && !((d = (u = (l = e.actor.system) == null ? void 0 : l.attributes) == null ? void 0 : u.death) != null && d.success);
}
function lt(e, s, t, i = void 0) {
  var a, r, o;
  if (!(s != null && s.active) || !te(e, t)) throw new y("Unavailable");
  if (s.isGM) return;
  const n = ((a = e.parent) == null ? void 0 : a.active) || ((r = e.parent) == null ? void 0 : r.testUserPermission(s, "LIMITED"));
  if (e.hidden || s.viewedScene !== ((o = e.parent) == null ? void 0 : o.id) || !n || !t.visible(e, s))
    throw new y("AccessDenied");
  if (t.inRange && !t.inRange(e, s, i)) throw new y("OutOfRange");
}
function Oe(e, s, t) {
  if (!e || !t.destination(e) || !e.testUserPermission(s, "OWNER"))
    throw new y("ActorDenied");
}
class he {
  constructor() {
    L(this, "tails", /* @__PURE__ */ new Map());
  }
  async run(s, t) {
    const n = (this.tails.get(s) ?? Promise.resolve()).catch(() => {
    }).then(t);
    this.tails.set(s, n);
    try {
      return await n;
    } finally {
      this.tails.get(s) === n && this.tails.delete(s);
    }
  }
}
const be = new he(), Se = ["cp", "sp", "ep", "gp", "pp"], k = (e, s) => {
  var t, i;
  return (i = (t = e == null ? void 0 : e.system) == null ? void 0 : t.currency) == null ? void 0 : i[s];
}, B = (e) => Number.isSafeInteger(e) && e >= 0, Re = (e) => `${e.currency.unit}:${e.currency.amount}`, Z = (e, s, t, i = !1) => {
  var n, a;
  return ((a = (n = e.getFlag) == null ? void 0 : n.call(e, h, i ? "currencyDebits" : "currencyReceipts")) == null ? void 0 : a[t.id]) === Re(s);
}, V = {
  entries(e) {
    return Se.filter((s) => B(k(e, s)) && k(e, s) > 0).map((s) => {
      var a, r, o, c, l;
      const t = k(e, s), i = (o = (r = (a = globalThis.CONFIG) == null ? void 0 : a.DND5E) == null ? void 0 : r.currencies) == null ? void 0 : o[s], n = typeof i == "string" ? i : i == null ? void 0 : i.label;
      return { currency: { storage: "balance", unit: s, amount: t }, data: {
        name: n ? ((l = (c = globalThis.game) == null ? void 0 : c.i18n) == null ? void 0 : l.localize(n)) ?? n : s.toUpperCase(),
        type: "currency",
        img: "icons/svg/coins.svg",
        system: { quantity: t }
      } };
    });
  },
  received: Z,
  async grant(e, s, t, i) {
    return be.run(P(e), async () => {
      if (Z(e, s, t)) return;
      if (t.currencyAttempted) throw new y("RecoveryRequired");
      if (!i) throw new y("RecoveryRequired");
      await i();
      const { unit: n, amount: a } = s.currency, r = k(e, n);
      if (!Se.includes(n) || !B(a) || !a || !B(r) || !B(r + a)) throw new y("CurrencyChanged");
      if (await e.update({
        [`system.currency.${n}`]: r + a,
        [`flags.${h}.currencyReceipts.${t.id}`]: Re(s)
      }), !Z(e, s, t)) throw new y("TransferFailed");
    });
  },
  sourcePlan(e, s) {
    const { unit: t, amount: i } = s.currency, n = k(e.actor, t);
    if (!Se.includes(t) || !B(n) || !B(i) || i <= 0 || n < i) throw new y("CurrencyChanged");
    return { currency: t, before: n, after: n - i };
  },
  async debit(e, s, t) {
    return be.run(P(e.actor), async () => {
      const i = e.actor;
      if (Z(i, s, t, !0)) return;
      const n = t.source;
      if (k(i, n.currency) !== n.before) throw new y("CurrencyChanged");
      if (await i.update({
        [`system.currency.${n.currency}`]: n.after,
        [`flags.${h}.currencyDebits.${t.id}`]: Re(s)
      }), !Z(i, s, t, !0)) throw new y("CurrencyChanged");
    });
  },
  async cleanup(e, s, t, i) {
    for (const [n, a] of [[s, "currencyReceipts"], [e.actor, "currencyDebits"]])
      try {
        await be.run(P(n), () => n.update({ [`flags.${h}.${a}.-=${i.id}`]: null }));
      } catch (r) {
        console.warn("HoloSuite Loot | Could not clean committed currency receipt", r);
      }
  }
};
class Be {
  constructor() {
    L(this, "id", "dnd5e");
  }
  currencyEntries(s) {
    return V.entries(s);
  }
  received(s, t, i) {
    var n, a;
    return ((n = t.currency) == null ? void 0 : n.storage) === "balance" ? V.received(s, t, i) : ((a = s.items.get(i.itemId)) == null ? void 0 : a.getFlag(h, "claim")) === i.id;
  }
  async cleanup(s, t, i, n) {
    var a;
    ((a = i.currency) == null ? void 0 : a.storage) === "balance" && await V.cleanup(s, t, i, n);
  }
  destination(s) {
    return s.type === "character";
  }
  eligible(s) {
    var o, c, l, u, d;
    const t = s.system, i = (o = t == null ? void 0 : t.constructor) == null ? void 0 : o.metadata;
    if (!["weapon", "equipment", "consumable", "tool", "loot", "container"].includes(s.type) || (i == null ? void 0 : i.inventoryItem) === !1) return !1;
    const a = (l = (c = t == null ? void 0 : t.schema) == null ? void 0 : c.getField) == null ? void 0 : l.call(c, "quantity");
    if (t != null && t.schema && !a || !Number.isSafeInteger(t == null ? void 0 : t.quantity) || t.quantity <= 0) return !1;
    const r = ((u = t.type) == null ? void 0 : u.value) ?? t.weaponType ?? ((d = t.armor) == null ? void 0 : d.type);
    return !["natural", "siege", "vehicle", "currency"].includes(r);
  }
  snapshot(s) {
    var i;
    const t = N(s.toObject());
    delete t._id, delete t.folder, delete t.ownership, delete t._stats, t.system.container = null, "equipped" in t.system && (t.system.equipped = !1), "attuned" in t.system && (t.system.attuned = !1), t.system.attunement === 2 && (t.system.attunement = 1), (i = t.flags) == null || delete i[h];
    for (const n of t.effects ?? [])
      delete n._id, n.origin = null;
    return t;
  }
  async create(s, t, i, n) {
    var c;
    if (((c = t.currency) == null ? void 0 : c.storage) === "balance") return V.grant(s, t, i, n);
    const a = s.items.get(i.itemId);
    if (a) {
      if (a.getFlag(h, "claim") !== i.id) throw new y("RecoveryRequired");
      return a;
    }
    const r = N(t.data);
    r._id = i.itemId, r.flags ?? (r.flags = {}), r.flags[h] = { claim: i.id };
    const [o] = await s.createEmbeddedDocuments("Item", [r], { keepId: !0 });
    if (!o || o.id !== i.itemId) throw new y("TransferFailed");
    return o;
  }
  preview(s) {
    var i, n;
    const t = N(s.data);
    return t.system.identified !== !1 ? t : {
      name: ((i = t.system.unidentified) == null ? void 0 : i.name) || "Unidentified Item",
      img: t.img,
      type: "loot",
      system: { quantity: t.system.quantity, identified: !1, description: { value: ((n = t.system.unidentified) == null ? void 0 : n.description) ?? "" } }
    };
  }
  async sourceClaim(s, t) {
    var a, r, o, c, l;
    if (!((a = t.source) != null && a.itemId) && ((r = t.currency) == null ? void 0 : r.storage) !== "balance") return null;
    if ((o = t.source) != null && o.ruleKey && t.source.ruleKey !== `${s.actorId ?? ((c = s.actor) == null ? void 0 : c.id) ?? ""}:${t.source.itemId}`)
      throw new y("SourceChanged");
    if (s.actorLink && await s.update({ actorLink: !1 }), s.actorLink) throw new y("SourceChanged");
    if (((l = t.currency) == null ? void 0 : l.storage) === "balance") return V.sourcePlan(s, t);
    const i = s.actor.items.get(t.source.itemId), n = i == null ? void 0 : i.system.quantity;
    if (!this.eligible(i ?? {}) || n < t.data.system.quantity || t.source.ruleKey && i.type !== t.data.type) throw new y("SourceChanged");
    return { itemId: i.id, before: n, after: n - t.data.system.quantity };
  }
  validateSourcePlan(s, t, i) {
    var r, o, c, l;
    if (!((r = t.source) != null && r.ruleKey)) return;
    const n = (c = s.actor) == null ? void 0 : c.items.get((o = i.source) == null ? void 0 : o.itemId);
    if (s.actorLink || t.source.ruleKey !== `${s.actorId ?? ((l = s.actor) == null ? void 0 : l.id) ?? ""}:${n == null ? void 0 : n.id}` || !this.eligible(n ?? {}) || n.type !== t.data.type || n.system.quantity !== i.source.before)
      throw new y("SourceChanged");
    const a = i.source.sfCurrency;
    if (a) {
      const u = this.entryMetadata(n).currency;
      if ((u == null ? void 0 : u.unit) !== a.unit || (u == null ? void 0 : u.amount) !== a.amount) throw new y("CurrencyChanged");
    }
  }
  async removeSource(s, t, i) {
    const n = i.source;
    if (!n) return;
    if (s.actorLink && await s.update({ actorLink: !1 }), s.actorLink) throw new y("SourceChanged");
    if (n.currency) return V.debit(s, t, i);
    const a = s.actor.items.get(n.itemId);
    if (!a || a.getFlag(h, "sourceClaim") === i.id) return;
    if (a.system.quantity !== n.before) throw new y("SourceChanged");
    n.after === 0 ? await s.actor.deleteEmbeddedDocuments("Item", [a.id]) : await a.update({ "system.quantity": n.after, [`flags.${h}.sourceClaim`]: i.id });
    const r = s.actor.items.get(n.itemId);
    if (n.after === 0 ? r : (r == null ? void 0 : r.system.quantity) !== n.after || (r == null ? void 0 : r.getFlag(h, "sourceClaim")) !== i.id) throw new y("SourceChanged");
  }
}
class dt extends Be {
  constructor() {
    super(...arguments);
    L(this, "id", "sf2e");
  }
  currencyEntries() {
    return [];
  }
  eligible(t) {
    var n, a;
    return ["ammo", "armor", "backpack", "book", "consumable", "equipment", "shield", "treasure", "weapon"].includes(t.type) && (t.isOfType ? t.isOfType("physical") : !0) && !(t.type === "weapon" && ((n = t.system) == null ? void 0 : n.category) === "unarmed") && Number.isSafeInteger((a = t.system) == null ? void 0 : a.quantity) && t.system.quantity > 0;
  }
  snapshot(t) {
    var n, a, r, o, c;
    const i = N(t.toObject());
    delete i._id, delete i.folder, delete i.ownership, delete i._stats, (n = i.flags) == null || delete n[h], (r = (a = i.flags) == null ? void 0 : a.pf2e) == null || delete r.grantedBy, (c = (o = i.flags) == null ? void 0 : o.pf2e) == null || delete c.itemGrants, i.system.containerId = null, i.system.description && delete i.system.description.gm, i.system.equipped && (i.system.equipped = { carryType: "stowed", handsHeld: 0, invested: !1 });
    for (const l of i.effects ?? [])
      delete l._id, l.origin = null;
    return i;
  }
  entryMetadata(t, i = ((n) => (n = t.system) == null ? void 0 : n.quantity)()) {
    var c, l, u, d;
    const a = t.isCurrency ? t.unit : null, r = a ? t.assetValue : null, o = i === ((c = t.system) == null ? void 0 : c.quantity) ? r == null ? void 0 : r[a] : (d = (u = r == null ? void 0 : (l = r.constructor).fromPrice) == null ? void 0 : u.call(l, t.price, i)) == null ? void 0 : d[a];
    return a && Number.isSafeInteger(o) && o > 0 ? { currency: { storage: "item", unit: a, amount: o } } : {};
  }
  async sourceClaim(t, i) {
    var c;
    const n = await super.sourceClaim(t, i);
    if (((c = i.currency) == null ? void 0 : c.storage) !== "item") return n;
    const a = t.actor.items.get(i.source.itemId), r = this.entryMetadata(a).currency, o = this.entryMetadata(a, i.data.system.quantity).currency;
    if ((o == null ? void 0 : o.unit) !== i.currency.unit || (o == null ? void 0 : o.amount) !== i.currency.amount || !i.source.ruleKey && a.system.quantity !== i.data.system.quantity) throw new y("CurrencyChanged");
    return { ...n, sfCurrency: { unit: r.unit, amount: r.amount } };
  }
  async removeSource(t, i, n) {
    var r;
    const a = (r = n.source) != null && r.itemId ? t.actor.items.get(n.source.itemId) : null;
    if (a && n.source.sfCurrency) {
      const o = this.entryMetadata(a).currency;
      if ((o == null ? void 0 : o.unit) !== n.source.sfCurrency.unit || (o == null ? void 0 : o.amount) !== n.source.sfCurrency.amount) throw new y("CurrencyChanged");
    }
    return super.removeSource(t, i, n);
  }
  preview(t) {
    var a, r, o, c;
    const i = N(t.data);
    if (((a = i.system.identification) == null ? void 0 : a.status) === "identified") return i;
    const n = (r = i.system.identification) == null ? void 0 : r.unidentified;
    return {
      name: (n == null ? void 0 : n.name) || "Unidentified Item",
      img: (n == null ? void 0 : n.img) || i.img,
      type: "equipment",
      system: { quantity: i.system.quantity, description: { value: ((c = (o = n == null ? void 0 : n.data) == null ? void 0 : o.description) == null ? void 0 : c.value) ?? "" } }
    };
  }
}
const Ve = /* @__PURE__ */ new Map([["dnd5e", new Be()], ["sf2e", new dt()]]);
function ft(e, s) {
  Ve.set(e, s);
}
function ht(e) {
  return Ve.get(e);
}
function $e(e) {
  if (!e.claim.quantityRoll) return e;
  const s = N(e.data);
  return s.system.quantity = e.claim.quantityRoll.quantity, { ...e, data: s };
}
class mt {
  constructor(s) {
    L(this, "queue", new he());
    this.io = s;
  }
  async collected(s, t, i, n) {
    var r, o, c, l;
    const a = $e(i);
    if (i.claim.quantityRoll) {
      try {
        await ((o = (r = this.io).quantityRolled) == null ? void 0 : o.call(r, a, n));
      } catch (u) {
        console.warn("HoloSuite Loot | Could not post quantity roll", u);
      }
      if (!i.claim.quantityRoll.quantity) return;
    }
    try {
      await ((l = (c = this.io).collected) == null ? void 0 : l.call(c, { token: s, actor: t, entry: a, adapter: n }));
    } catch (u) {
      console.warn("HoloSuite Loot | Could not post loot to chat", u);
    }
  }
  async execute(s, t) {
    if (!ue(s)) throw new y("InvalidRequest");
    return this.queue.run(s.tokenUuid, async () => {
      var w, p, S, R, v, q, I, C, f, b;
      const i = this.io, n = await i.token(s.tokenUuid);
      if (!n) throw new y("Unavailable");
      const a = (g, m = i.environment()) => {
        if (!i.authority()) throw new y("NoGM");
        lt(n, t, m, g);
      }, r = i.environment();
      if (a(void 0, r), !t.isGM && r.inRange && (s.action === "view" || s.action === "inspect")) {
        const g = await ((w = i.destination) == null ? void 0 : w.call(i, { ...s, actorId: void 0 }, t));
        g && a(g);
      }
      const o = i.adapter();
      if (!o) throw new y("Unsupported");
      let c = await i.load(n, o);
      for (const g of c.entries.filter((m) => m.claim && !m.taken)) {
        a();
        const m = await i.actor(g.claim.actorId);
        if (!m) throw new y("RecoveryRequired");
        if (((p = g.claim.quantityRoll) == null ? void 0 : p.quantity) === 0 || (o.received ? o.received(m, g, g.claim) : ((S = m.items.get(g.claim.itemId)) == null ? void 0 : S.getFlag(i.moduleId, "claim")) === g.claim.id)) {
          await ((R = o.removeSource) == null ? void 0 : R.call(o, n, g, g.claim));
          const T = N(c);
          T.entries.find(($) => $.id === g.id).taken = !0, await i.save(n, T), c = T, await this.collected(n, m, g, o), await ((v = o.cleanup) == null ? void 0 : v.call(o, n, m, g, g.claim));
        }
      }
      if (s.action === "view") return i.summary(n, c);
      if (s.action === "inspect") {
        const g = c.entries.find((m) => m.id === s.entryId && !m.taken && !m.hidden);
        if (!g || g.currency) throw new y("Unavailable");
        return { item: o.preview ? o.preview(g) : N(g.data) };
      }
      const l = i.destination ? await i.destination(s, t) : await i.actor(s.actorId);
      Oe(l, t, o), a(l);
      const u = c.entries.filter((g) => !g.taken && !g.hidden && (s.action === "all" || g.id === s.entryId));
      if (!u.length && s.action === "take") return i.summary(n, c);
      const d = [];
      for (const g of u)
        try {
          a(l), Oe(l, t, o);
          let m = c.entries.find((T) => T.id === g.id);
          if (m.claim && (m.claim.userId !== t.id || ![l.id, P(l)].includes(m.claim.actorId)))
            throw new y("RecoveryRequired");
          if (!m.claim) {
            const T = await ((q = o.sourceClaim) == null ? void 0 : q.call(o, n, m));
            a(l);
            let $;
            if (m.formula) {
              if (!T || !o.removeSource) throw new y("SourceChanged");
              $ = await i.rollQuantity(m.formula), a(l);
            }
            const j = N(c);
            j.entries.find((z) => z.id === m.id).claim = {
              id: i.id(),
              itemId: i.id(),
              userId: t.id,
              actorId: P(l),
              ...$ ? { quantityRoll: $ } : {},
              ...T ? { source: T } : {}
            }, await i.save(n, j), c = j, m = c.entries.find((z) => z.id === g.id);
          }
          a(l), (I = o.validateSourcePlan) == null || I.call(o, n, m, m.claim), ((C = m.claim.quantityRoll) == null ? void 0 : C.quantity) !== 0 && await o.create(l, $e(m), m.claim, async () => {
            const T = N(c);
            T.entries.find(($) => $.id === m.id).claim.currencyAttempted = !0, await i.save(n, T), c = T, m.claim.currencyAttempted = !0;
          }), await ((f = o.removeSource) == null ? void 0 : f.call(o, n, m, m.claim));
          const H = N(c);
          H.entries.find((T) => T.id === m.id).taken = !0, await i.save(n, H), c = H, await this.collected(n, l, m, o), await ((b = o.cleanup) == null ? void 0 : b.call(o, n, l, m, m.claim));
        } catch (m) {
          if (d.push({ name: g.data.name, code: m.code ?? "TransferFailed" }), !i.authority()) break;
        }
      return { ...i.summary(n, c), failures: d };
    });
  }
}
const le = "inventoryRules";
function gt(e) {
  var t, i, n, a, r;
  const s = /^(?:Item\.[\w-]+|Compendium\.[\w-]+\.[\w-]+\.(?:Item\.)?[\w-]+)$/;
  return (r = [(t = e._stats) == null ? void 0 : t.compendiumSource, (i = e._stats) == null ? void 0 : i.duplicateSource, (a = (n = e.flags) == null ? void 0 : n.core) == null ? void 0 : a.sourceId].find((o) => typeof o == "string" && s.test(o))) == null ? void 0 : r.replace(/^(Compendium\.[^.]+\.[^.]+)\.(?!Item\.)/, "$1.Item.");
}
function Y(e, s, t) {
  var i;
  return {
    token: s.id ? `${e.actorId ?? ((i = e.actor) == null ? void 0 : i.id) ?? ""}:${s.id}` : void 0,
    actor: t != null && t.id && t.items.get(s.id) ? `${t.id}:${s.id}` : void 0,
    global: gt(s)
  };
}
function me(e, s, t) {
  var i;
  for (const n of ["token", "actor", "global"]) {
    const a = e[n] && ((i = n === "token" ? s : t[n]) == null ? void 0 : i[e[n]]);
    if (a) return { rule: a, scope: n };
  }
  return { rule: { mode: "allow" }, scope: "default" };
}
function ge(e, s = "") {
  if (e === "inherit") return null;
  if (e === "allow" || e === "never") return { mode: e };
  if (e !== "quantity" || typeof s != "string" || s.length > 40) throw new y("InvalidRule");
  const t = s.trim().toLowerCase().replace(/\s+/g, "");
  if (/^\d+$/.test(t) && Number.isSafeInteger(Number(t))) return { mode: e, quantity: String(Number(t)) };
  const i = /^(\d{0,3})d([1-9]\d{0,4})(?:[+-]\d{1,6})?$/.exec(t);
  if (i && (i[1] === "" || Number(i[1]) > 0)) return { mode: e, quantity: i[1] ? t : `1${t}` };
  throw new y("InvalidRule");
}
async function yt(e, s, t) {
  if (e.mode === "never") return 0;
  if (e.mode === "allow") return s;
  const { quantity: i } = ge(e.mode, e.quantity), n = /^\d+$/.test(i) ? Number(i) : await t(i);
  if (!Number.isSafeInteger(n)) throw new y("InvalidRule");
  return Math.min(s, Math.max(0, n));
}
const Ke = (e) => (e == null ? void 0 : e.mode) === "quantity" && !/^\d+$/.test(e.quantity);
function Ne(e, s, t) {
  const i = { ...e };
  for (const n of s)
    t ? i[n] = t : delete i[n];
  return i;
}
function qe() {
  return game.users.contents.filter((e) => {
    var s;
    return e.active && e.isGM && ((s = e.getFlag) == null ? void 0 : s.call(e, h, "transportVersion")) === ce;
  }).sort((e, s) => e.id.localeCompare(s.id))[0];
}
const E = () => {
  var e;
  return ((e = qe()) == null ? void 0 : e.id) === game.user.id;
}, Qe = "lootRange", We = 15;
function Ce() {
  const e = game.settings.get(h, Qe);
  return Number.isFinite(e) ? Math.max(0, e) : We;
}
function pt(e, s, t) {
  var i, n, a;
  return ((i = e.getCenterPoint) == null ? void 0 : i.call(e, t)) ?? ((a = (n = e.object) == null ? void 0 : n.getCenterPoint) == null ? void 0 : a.call(n, t)) ?? {
    x: t.x + e.width * (s.sizeX ?? s.size) / 2,
    y: t.y + e.height * (s.sizeY ?? s.size) / 2
  };
}
function De(e, s) {
  var r;
  const { x: t, y: i } = e._source ?? e, n = { x: t, y: i };
  if (s.isSquare && s.getOffsetRange) {
    const o = e.width * s.size, c = e.height * s.size, [l, u, d, w] = s.getOffsetRange({ ...n, width: o, height: c }), p = [];
    for (let S = l; S < d; S++)
      for (let R = u; R < w; R++) p.push(s.getCenterPoint({ i: S, j: R }));
    if (p.length) return p;
  }
  const a = (r = e.getOccupiedGridSpaceOffsets) == null ? void 0 : r.call(e, { ...n, level: null });
  return a != null && a.length ? a.map(({ i: o, j: c }) => s.getCenterPoint({ i: o, j: c })) : [pt(e, s, n)];
}
function wt(e, s, t, i, n) {
  var u;
  const a = e.parent, r = a == null ? void 0 : a.grid;
  if (!(r != null && r.measurePath)) return !1;
  const o = (u = r.units) == null ? void 0 : u.trim().toLowerCase().replace(/\.$/, ""), c = /^(m|meters?|metres?)$/.test(o ?? "") ? i * 0.3048 : /^(yd|yards?)$/.test(o ?? "") ? i / 3 : i, l = De(e, r);
  return Array.from(a.tokens ?? []).some((d) => {
    const w = d.actor;
    return d.id === e.id || d.hidden || !w || !t.destination(w) || !w.testUserPermission(s, "OWNER") || n && P(w) !== P(n) ? !1 : De(d, r).some(({ x: p, y: S }) => l.some((R) => r.measurePath([{ x: p, y: S }, { x: R.x, y: R.y }]).distance <= c + 1e-8));
  });
}
function vt(e, s) {
  var a, r;
  const t = e.parent;
  if (((a = canvas.scene) == null ? void 0 : a.id) !== t.id) return !1;
  if (!t.tokenVision) return !0;
  const i = e.object;
  if (!i) return !1;
  const n = globalThis.CONFIG;
  return (r = e.hasStatusEffect) != null && r.call(e, n.specialStatusEffects.INVISIBLE) ? !1 : canvas.tokens.placeables.some((o) => {
    var l, u, d, w, p, S, R, v, q, I, C, f, b, g;
    if (o.document.hidden || !((l = o.document.sight) != null && l.enabled) || !((u = o.actor) != null && u.testUserPermission(s, "OWNER")) || (w = (d = o.document).hasStatusEffect) != null && w.call(d, n.specialStatusEffects.BLIND)) return !1;
    let c;
    try {
      const m = o.document.sight, H = ((S = (p = o.document).getVisionOrigin) == null ? void 0 : S.call(p)) ?? { ...o.center, elevation: o.document.elevation };
      if (c = new n.Canvas.visionSourceClass({ object: o, sourceId: `hololoot-${s.id}-${o.id}` }), c.initialize({
        x: H.x,
        y: H.y,
        elevation: H.elevation,
        ...o.document.level != null ? { level: o.document.level } : {},
        rotation: o.document.rotation,
        radius: o.sightRange,
        lightRadius: o.lightPerceptionRange ?? canvas.dimensions.maxR,
        externalRadius: o.externalRadius,
        angle: m.angle,
        visionMode: m.visionMode,
        color: m.color,
        contrast: m.contrast,
        saturation: m.saturation,
        brightness: m.brightness,
        attenuation: m.attenuation
      }), c.isBlinded || !((R = c.los) != null && R.contains(i.center.x, i.center.y))) return !1;
      if ((v = c.shape) != null && v.contains(i.center.x, i.center.y)) return !0;
      const T = (q = canvas.environment) == null ? void 0 : q.globalLightSource;
      return (T ? T.active && ((I = T.shape) == null ? void 0 : I.contains(i.center.x, i.center.y)) : t.globalLight && (t.globalLightThreshold == null || t.darkness <= t.globalLightThreshold)) && ((C = c.light) != null && C.contains(i.center.x, i.center.y)) ? !0 : !!((f = c.light) != null && f.contains(i.center.x, i.center.y)) && !!((g = (b = canvas.effects) == null ? void 0 : b.lightSources) != null && g.some((j) => {
        var z;
        return j.active && ((z = j.shape) == null ? void 0 : z.contains(i.center.x, i.center.y));
      }));
    } catch {
      return !1;
    } finally {
      c == null || c.destroy();
    }
  });
}
function ie(e) {
  const s = game.settings.get(h, "zeroHP"), t = e ? Ce() : 0;
  return {
    combats: game.combats.contents,
    automatic: s,
    zeroHP: s,
    visible: vt,
    inRange: t > 0 ? (i, n, a) => wt(i, n, e, t, a) : void 0
  };
}
const bt = new he(), Te = (e) => game.journal.find((s) => s.getFlag(h, "tokenUuid") === e.uuid && s.getFlag(h, "kind") === "snapshot"), ye = () => game.settings.get(h, le) ?? {}, pe = (e) => {
  var s;
  return (s = game.actors) == null ? void 0 : s.get(e.actorId);
}, Je = async (e) => {
  var t, i;
  const s = ((i = (t = globalThis.foundry) == null ? void 0 : t.dice) == null ? void 0 : i.Roll) ?? globalThis.Roll;
  return new s(e).evaluate({ allowInteractive: !1 });
}, de = (e, s) => {
  var t, i;
  return ((i = (t = e.actor) == null ? void 0 : t.items) == null ? void 0 : i.filter((n) => s.eligible(n))) ?? [];
}, Le = (e) => X(e).source === "custom", Me = (e) => JSON.parse((e == null ? void 0 : e.getFlag(h, "rules")) ?? "{}"), G = (e) => `flags.${h}.${e}`, Fe = ({ id: e, hidden: s }) => ({ id: e, taken: !1, ...s ? { hidden: !0 } : {} }), Xe = (e) => e.mode === "quantity" ? e.quantity : e.mode, W = (e, s) => e.setFlag(h, "state", {
  ...s,
  entries: s.entries.map((t) => {
    var a;
    if (!((a = t.claim) != null && a.quantityRoll)) return t;
    const { quantityRoll: i, ...n } = t.claim;
    return { ...t, claim: n };
  })
}), Ye = (e, s, t) => {
  var i, n;
  return Ke(t) && s.sourceClaim && s.removeSource && !((n = (i = s.entryMetadata) == null ? void 0 : i.call(s, e)) != null && n.currency);
};
async function St(e) {
  const s = ge("quantity", e);
  if (!Ke(s)) throw new y("InvalidRule");
  const t = await Je(s.quantity);
  if (!Number.isSafeInteger(t.total)) throw new y("InvalidRule");
  return { quantity: Math.max(0, t.total), roll: t.toJSON() };
}
const fe = (e) => JSON.stringify(e, (s, t) => t && typeof t == "object" && !Array.isArray(t) ? Object.fromEntries(Object.entries(t).sort(([i], [n]) => i.localeCompare(n))) : t);
function Ze(e, s, t) {
  const i = fe(t), n = e.filter((a) => fe(s.snapshot(a)) === i);
  return n.length === 1 && n[0].id ? n[0] : void 0;
}
async function xe(e, s, t, i, { original: n, previousRoll: a, legacyRollCeiling: r, onRoll: o } = {}) {
  var R;
  const c = s.snapshot(e), l = n ?? c.system.quantity, u = Math.min(l, c.system.quantity), d = a === void 0 && r === void 0 && Ye(e, s, i) ? i.quantity : void 0;
  let w, p;
  const S = d ? u : await yt(i, u, async (v) => {
    if (a === void 0 && r !== void 0)
      return p = r, p;
    if (a !== void 0)
      w = a;
    else {
      const q = await Je(v);
      w = q.total, o == null || o(q);
    }
    return w;
  });
  return c.system.quantity = S, {
    id: foundry.utils.randomID(),
    data: c,
    originalQuantity: l,
    limit: Xe(i),
    hidden: S === 0,
    ...d ? { formula: d } : {},
    ...w === void 0 ? {} : { rolledQuantity: w },
    ...p === void 0 ? {} : { rollCeiling: p },
    ...e.id ? { source: { itemId: e.id, ruleKey: t } } : {},
    ...(R = s.entryMetadata) == null ? void 0 : R.call(s, e, S)
  };
}
function et(e, s) {
  var u, d;
  const t = Te(e), i = t == null ? void 0 : t.getFlag(h, "state"), n = t == null ? void 0 : t.getFlag(h, "items"), a = new Map(Array.isArray(n) ? n.map((w) => [w.id, w]) : []), r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), c = de(e, s), l = s.snapshot && !Le(e) && !((u = e.getFlag(h, "config")) != null && u.customId);
  for (const w of (i == null ? void 0 : i.entries) ?? []) {
    const p = a.get(w.id);
    if ((d = p == null ? void 0 : p.source) != null && d.ruleKey)
      r.set(p.source.ruleKey, { ...p, ...w });
    else if (l && (p != null && p.data) && !p.currency && !p.source) {
      const S = Ze(c, s, p.data);
      if (!S) continue;
      const R = Y(e, S).token;
      o.set(R, o.has(R) ? null : { ...p, ...w });
    }
  }
  for (const [w, p] of o) p && !r.has(w) && r.set(w, p);
  return {
    vault: t,
    state: i,
    byId: a,
    byKey: r,
    items: c,
    corpse: Me(t),
    shared: ye(),
    locked: Le(e) || !i && (e.getFlag(h, "state") || t && !t.getFlag(h, "draft"))
  };
}
function Rt(e, s) {
  const { state: t, byKey: i, items: n, corpse: a, shared: r, locked: o } = et(e, s), c = pe(e);
  return n.map((l) => {
    var p, S;
    const u = Y(e, l, c), d = i.get(u.token), w = o ? "RuleLocked" : !u.token || t && !d ? "RuleMissingSnapshot" : d != null && d.taken ? "RuleCollected" : d != null && d.claim ? "RuleReserved" : "";
    return {
      id: l.id,
      name: l.name,
      img: l.img,
      quantity: l.system.quantity,
      entry: d,
      effective: me(u, a, r),
      overrides: { token: a[u.token], actor: (p = r.actor) == null ? void 0 : p[u.actor], global: (S = r.global) == null ? void 0 : S[u.global] },
      canToken: !w,
      tokenUnavailable: w,
      canActor: !!u.actor,
      canGlobal: !!u.global
    };
  });
}
async function Lt(e, s, t, i, n) {
  if (!E()) throw new y("RuleGM");
  const { vault: a, state: r, byId: o, byKey: c, items: l, corpse: u, shared: d, locked: w } = et(e, s), p = pe(e), S = l.filter((f) => i.includes(f.id)).map((f) => ({ item: f, key: Y(e, f, p)[t] }));
  if (!i.length || S.length !== i.length || S.some(({ key: f }) => !f)) throw new y("RuleScopeUnavailable");
  const R = S.map(({ key: f }) => f);
  if (t === "actor" || t === "global")
    return bt.run(le, async () => {
      if (!E()) throw new y("RuleGM");
      const f = ye(), b = { ...f, [t]: Ne(f[t], R, t === "global" && (n == null ? void 0 : n.mode) === "allow" ? null : n) };
      await game.settings.set(h, le, b);
    });
  if (t !== "token" || w) throw new y("RuleScopeUnavailable");
  if (r && R.some((f) => {
    const b = c.get(f);
    return !b || b.taken || b.claim;
  })) throw new y("RuleScopeUnavailable");
  const v = Ne(u, R, n);
  if (!a) {
    Object.keys(v).length && await tt(e, [], { rules: JSON.stringify(v), draft: !0 });
    return;
  }
  if (!r) {
    await a.setFlag(h, "rules", JSON.stringify(v));
    return;
  }
  const q = /* @__PURE__ */ new Map(), I = [];
  for (const { item: f, key: b } of S) {
    const g = c.get(b), m = me(Y(e, f, p), v, d).rule;
    if (g.limit !== Xe(m) || !g.formula && Ye(f, s, m)) {
      let H;
      const T = await xe(f, s, b, m, {
        original: g.originalQuantity ?? g.data.system.quantity,
        onRoll: ($) => {
          H = $;
        }
      });
      q.set(g.id, T), H && I.push({ roll: H, itemName: f.name, quantity: T.data.system.quantity });
    }
  }
  if (!E()) throw new y("RuleGM");
  const C = {
    ...r,
    vaultId: a.id,
    entries: r.entries.map((f) => q.has(f.id) ? Fe(q.get(f.id)) : f)
  };
  return await a.update({
    [G("rules")]: JSON.stringify(v),
    [G("state")]: C,
    [G("items")]: Array.from(o.values(), (f) => q.get(f.id) ?? f)
  }), await W(e, C), I;
}
async function tt(e, s, t) {
  var a, r;
  const n = await (((r = (a = globalThis.foundry) == null ? void 0 : a.documents) == null ? void 0 : r.JournalEntry) ?? globalThis.JournalEntry).create({
    name: `HoloLoot · ${e.name}`,
    ownership: { default: 0 },
    flags: { [h]: { tokenUuid: e.uuid, kind: "snapshot", items: structuredClone(s), ...t } }
  });
  if (!n) throw new y("PersistenceFailed");
  return n.id;
}
function re(e, s, t) {
  const i = game.journal.get(e);
  if (!i || i.getFlag(h, "tokenUuid") !== s.uuid || i.getFlag(h, "kind") !== t) throw new y("RecoveryRequired");
  const n = i.getFlag(h, "items");
  if (!Array.isArray(n)) throw new y("RecoveryRequired");
  return structuredClone(n);
}
function it(e, s) {
  const t = X(e);
  return !!(e.actor && t.source !== "custom" && !t.customId && s.sourceClaim && s.removeSource);
}
async function It(e, s) {
  var q, I, C;
  if (!E()) throw new y("RuleGM");
  if (!it(e, s)) throw new y("RefreshUnsupported");
  const t = Te(e), i = t == null ? void 0 : t.getFlag(h, "state");
  if (!i) {
    await He(e, s);
    return;
  }
  if (i.version !== 1) throw new y("RecoveryRequired");
  const n = i.entries.filter((f) => f.claim || f.taken), a = (f) => {
    var b, g, m, H;
    return ((g = (b = f.claim) == null ? void 0 : b.source) == null ? void 0 : g.itemId) || ((H = (m = f.claim) == null ? void 0 : m.source) == null ? void 0 : H.currency) && `currency:${f.claim.source.currency}`;
  };
  if (n.length && e.actorLink || n.some((f) => !a(f)))
    throw new y("RefreshUntracked");
  const r = new Set(n.filter((f) => !f.taken).map(a)), o = re(t.id, e, "snapshot"), c = new Map(o.map((f) => [f.id, f]));
  if (n.some((f) => !f.taken && !c.has(f.id))) throw new y("RecoveryRequired");
  const l = /* @__PURE__ */ new Map();
  for (const f of i.entries) {
    const b = c.get(f.id), g = ((q = b == null ? void 0 : b.source) == null ? void 0 : q.ruleKey) || ((I = b == null ? void 0 : b.currency) == null ? void 0 : I.storage) === "balance" && `currency:${b.currency.unit}`;
    g && l.set(g, { saved: b, taken: f.taken });
  }
  const u = (f, b) => (b && !b.taken && fe({ ...f, id: b.saved.id }) === fe(b.saved) && (f.id = b.saved.id), f), d = pe(e), w = Me(t), p = ye(), S = [];
  for (const f of de(e, s)) {
    if (r.has(f.id)) continue;
    const b = Y(e, f, d), g = l.get(b.token), m = g == null ? void 0 : g.saved.limit, H = m === void 0 ? me(b, w, p).rule : ge(m === "allow" || m === "never" ? m : "quantity", m), T = g == null ? void 0 : g.saved.rolledQuantity, $ = m === void 0 || g.saved.formula ? void 0 : g.saved.rollCeiling ?? g.saved.data.system.quantity;
    S.push(u(await xe(f, s, b.token, H, { previousRoll: T, legacyRollCeiling: $ }), g));
  }
  for (const f of ((C = s.currencyEntries) == null ? void 0 : C.call(s, e.actor)) ?? []) {
    const b = `currency:${f.currency.unit}`;
    r.has(b) || S.push(u({ ...f, id: foundry.utils.randomID() }, l.get(b)));
  }
  if (!E()) throw new y("RuleGM");
  const R = { ...i, vaultId: t.id, currencyReady: !0, entries: [...n, ...S.map(Fe)] }, v = n.flatMap((f) => c.has(f.id) ? [c.get(f.id)] : []);
  await t.update({ [G("state")]: R, [G("items")]: [...v, ...S] }), await W(e, R);
}
async function He(e, s) {
  var a;
  const t = Te(e);
  let i = t == null ? void 0 : t.getFlag(h, "state");
  if (!i && (e.getFlag(h, "state") || t && !t.getFlag(h, "draft")))
    throw new y("RecoveryRequired");
  if (!i) {
    const r = X(e), o = ye(), c = Me(t), l = pe(e), u = [];
    if (Le(e)) {
      const p = r.customId ? re(r.customId, e, "custom") : [];
      u.push(...p.map((S) => ({ id: foundry.utils.randomID(), data: S })));
    } else
      for (const p of de(e, s)) {
        const S = Y(e, p, l), { rule: R } = me(S, c, o);
        u.push(await xe(p, s, S.token, R));
      }
    u.push(...(((a = s.currencyEntries) == null ? void 0 : a.call(s, e.actor)) ?? []).map((p) => ({ ...p, id: foundry.utils.randomID() })));
    const d = { version: 1, currencyReady: !0, entries: u.map(Fe) }, w = t ? t.id : await tt(e, u, { state: d });
    i = { ...d, vaultId: w }, t && await t.update({ [G("items")]: u, [G("state")]: i, [G("draft")]: !1 }), await W(e, i);
  }
  if (i.version !== 1) throw new y("RecoveryRequired");
  if (i = { ...i, vaultId: i.vaultId ?? (t == null ? void 0 : t.id) }, !i.currencyReady && s.currencyEntries) {
    const r = t ?? game.journal.get(i.vaultId), o = r.getFlag(h, "items"), c = Array.isArray(o) ? structuredClone(o) : i.entries.every((u) => u.taken) ? [] : re(i.vaultId, e, "snapshot"), l = s.currencyEntries(e.actor).map((u) => ({ ...u, id: foundry.utils.randomID() }));
    i = { ...i, currencyReady: !0, entries: [...i.entries, ...l.map(({ id: u }) => ({ id: u, taken: !1 }))] }, l.length ? await r.update({ [`flags.${h}.items`]: [...c, ...l], [`flags.${h}.state`]: i }) : await r.setFlag(h, "state", i), await W(e, i);
  }
  if (e.getFlag(h, "state") || await W(e, i), i.entries.every((r) => r.taken)) return {
    ...i,
    entries: i.entries.map((r) => ({ ...r, data: null }))
  };
  const n = re(i.vaultId, e, "snapshot");
  return { ...i, entries: i.entries.map((r) => {
    var u;
    if (r.taken) return { ...r, data: null };
    const o = n.find((d) => d.id === r.id), c = o == null ? void 0 : o.data;
    if (!c) throw new y("RecoveryRequired");
    let l = o.source;
    if (!l && !o.currency && !((u = e.getFlag(h, "config")) != null && u.customId) && s.snapshot) {
      const d = Ze(de(e, s), s, c);
      d && (l = { itemId: d.id });
    }
    return {
      ...r,
      data: c,
      ...o.formula ? { formula: o.formula } : {},
      ...o.currency ? { currency: o.currency } : {},
      ...l ? { source: l } : {}
    };
  }) };
}
async function qt(e, s) {
  const t = {
    version: 1,
    ...s.currencyReady ? { currencyReady: !0 } : {},
    vaultId: s.vaultId,
    entries: s.entries.map(({ id: n, taken: a, claim: r, hidden: o }) => ({
      id: n,
      taken: !!a,
      ...r ? { claim: r } : {},
      ...o ? { hidden: o } : {}
    }))
  }, i = game.journal.get(s.vaultId);
  if ((i == null ? void 0 : i.getFlag(h, "tokenUuid")) !== e.uuid) throw new y("RecoveryRequired");
  await i.setFlag(h, "state", t), await W(e, t);
}
function Ct(e, s) {
  return {
    tokenUuid: e.uuid,
    name: e.name,
    img: e.texture.src,
    entries: s.entries.filter((t) => !t.taken && !t.hidden).map((t) => {
      var r, o, c, l, u, d, w, p, S, R, v, q, I, C, f, b, g;
      const i = t.data, n = i.system.identified === !1 || ((r = i.system.identification) == null ? void 0 : r.status) === "unidentified", a = n ? (o = i.system.unidentified) == null ? void 0 : o.description : (c = i.system.description) == null ? void 0 : c.value;
      return {
        id: t.id,
        name: t.currency ? game.i18n.localize(`HL.Currency.${t.currency.unit}`) : n ? ((l = i.system.unidentified) == null ? void 0 : l.name) || ((d = (u = i.system.identification) == null ? void 0 : u.unidentified) == null ? void 0 : d.name) || game.i18n.localize("HL.Unidentified") : i.name,
        currency: !!t.currency,
        img: n && ((p = (w = i.system.identification) == null ? void 0 : w.unidentified) == null ? void 0 : p.img) || i.img,
        quantity: ((S = t.currency) == null ? void 0 : S.amount) ?? i.system.quantity,
        ...t.formula ? { formula: t.formula } : {},
        type: t.currency ? game.i18n.localize("HL.CurrencyLabel") : game.i18n.localize(`TYPES.Item.${i.type}`),
        rarity: n ? "" : game.i18n.localize(((q = (v = (R = globalThis.CONFIG) == null ? void 0 : R.DND5E) == null ? void 0 : v.itemRarity) == null ? void 0 : q[i.system.rarity]) ?? ((b = (C = (I = globalThis.CONFIG) == null ? void 0 : I.PF2E) == null ? void 0 : C.rarityTraits) == null ? void 0 : b[(f = i.system.traits) == null ? void 0 : f.rarity]) ?? i.system.rarity ?? ""),
        tooltip: ((g = new DOMParser().parseFromString(a ?? "", "text/html").body.textContent) == null ? void 0 : g.slice(0, 1500)) ?? "",
        pending: !!t.claim
      };
    })
  };
}
function Tt(e, s = e) {
  const t = `${s} |`;
  return {
    log: (i, ...n) => console.log(t, i, ...n),
    warn: (i, ...n) => console.warn(t, i, ...n),
    error: (i, ...n) => console.error(t, i, ...n)
  };
}
function Mt(e, s = {}) {
  const t = s.socketName ?? `module.${e}`, i = Tt(e, s.title ?? e);
  return {
    socketName: t,
    emit(n) {
      var r;
      const a = (r = globalThis.game) == null ? void 0 : r.socket;
      return a != null && a.emit ? (a.emit(t, n), !0) : (i.warn("Foundry socket is unavailable.", n), !1);
    },
    isGMSender(n) {
      var a, r, o;
      return n ? !!((o = (r = (a = globalThis.game) == null ? void 0 : a.users) == null ? void 0 : r.get(String(n))) != null && o.isGM) : !1;
    }
  };
}
const Ue = Mt(h, { title: "HoloSuite Loot" }), ee = /* @__PURE__ */ new Map(), Ft = new he();
async function xt(e, s) {
  game.socket.on(Ue.socketName, (t) => {
    (t == null ? void 0 : t.type) === "refresh" && typeof t.tokenUuid == "string" && s(t.tokenUuid);
  }), Hooks.on("updateUser", (t, i, n, a) => {
    var o, c, l;
    if (t.id === game.user.id && ((c = (o = i.flags) == null ? void 0 : o[h]) != null && c[ve])) {
      let u;
      try {
        u = JSON.parse(t.getFlag(h, ve));
      } catch {
        return;
      }
      const d = ee.get(u == null ? void 0 : u.id);
      d && d.gm === a && ((l = game.users.get(a)) != null && l.isGM) && (clearTimeout(d.timer), ee.delete(u.id), u.result.error ? d.reject(new y(u.result.error)) : d.resolve(structuredClone(u.result)));
    }
    const r = ut(t, i, a, ze);
    !r || !E() || typeof r.id != "string" || !/^[\w-]{1,64}$/.test(r.id) || Ft.run(t.id, async () => {
      if (!E()) return;
      let u;
      try {
        if (!ue(r)) throw new y("InvalidRequest");
        u = await e.execute(r, t);
      } catch (d) {
        console.warn("HoloSuite Loot | Request failed", d), u = { error: d.code ?? "TransferFailed" };
      }
      await t.setFlag(h, ve, JSON.stringify({ id: r.id, result: u })), ue(r) && ["take", "all"].includes(r.action) && Ue.emit({ type: "refresh", tokenUuid: r.tokenUuid });
    }).catch((u) => console.warn("HoloSuite Loot | Could not deliver reply", u));
  }), game.user.isGM && await game.user.setFlag(h, "transportVersion", ce);
}
async function Ht(e, s) {
  if (!ue(e)) throw new y("InvalidRequest");
  const t = qe();
  if (!t) throw new y(game.users.contents.some((n) => n.active && n.isGM) ? "BuildMismatch" : "NoGM");
  if (t.id === game.user.id && s) return s.execute(e, game.user);
  const i = foundry.utils.randomID();
  return new Promise((n, a) => {
    const r = setTimeout(() => {
      ee.delete(i), a(new y("Timeout"));
    }, e.action === "view" ? 8e3 : 2e4);
    ee.set(i, { resolve: n, reject: a, timer: r, gm: t.id }), game.user.setFlag(h, ze, { ...e, id: i }).catch((o) => {
      clearTimeout(r), ee.delete(i), a(o);
    });
  });
}
function At() {
  var e, s, t;
  return ((s = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : s.api) ?? ((t = foundry == null ? void 0 : foundry.applications) == null ? void 0 : t.api) ?? null;
}
function Et() {
  var e, s, t;
  return ((s = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : s.api) ?? ((t = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : t.api) ?? null;
}
function Ot(e = {}, s = {}) {
  var i, n, a;
  const t = ((n = (i = globalThis.foundry) == null ? void 0 : i.utils) == null ? void 0 : n.mergeObject) ?? ((a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.mergeObject);
  return typeof t == "function" ? t(e, s, { inplace: !1 }) : { ...e, ...s };
}
function $t() {
  var e, s, t, i, n;
  return ((t = (s = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : s.randomID) == null ? void 0 : t.call(s, 8)) ?? ((n = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.randomID) == null ? void 0 : n.call(i, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function Pe(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${$t()}`),
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
function Nt(e) {
  return class extends e {
    constructor(i = {}) {
      const n = Ot(new.target.defaultOptions ?? {}, i);
      super(Pe(n));
      L(this, "_v1Options");
      this._v1Options = n;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return Pe(this.defaultOptions ?? {});
    }
    activateListeners(i) {
    }
    async _renderHTML(i, n) {
      var l, u, d;
      const a = typeof this.getData == "function" ? await this.getData() : {}, r = ((l = this._v1Options) == null ? void 0 : l.template) ?? ((u = this.options) == null ? void 0 : u.template) ?? ((d = this.constructor.defaultOptions) == null ? void 0 : d.template);
      if (!r) return document.createDocumentFragment();
      const o = await globalThis.renderTemplate(r, a), c = document.createElement("template");
      return c.innerHTML = o.trim(), c.content;
    }
    _activateV1Form(i) {
      var a, r;
      if (typeof this._updateObject != "function") return;
      const n = (a = i.matches) != null && a.call(i, "form") ? i : (r = i.querySelector) == null ? void 0 : r.call(i, "form");
      n instanceof HTMLFormElement && n.addEventListener("submit", async (o) => {
        var l;
        o.preventDefault(), o.stopPropagation();
        const c = new FormData(n);
        await this._updateObject(o, c), ((l = this._v1Options) == null ? void 0 : l.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(i, n, a) {
      var u, d, w, p;
      n.replaceChildren(i);
      const r = globalThis.jQuery ?? globalThis.$, o = ((u = n.closest) == null ? void 0 : u.call(n, ".window-app, .app, .application")) ?? n, c = r ? r(o) : o;
      try {
        Object.defineProperty(this, "element", {
          value: c,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = c;
        } catch {
        }
      }
      const l = (d = this._v1Options) == null ? void 0 : d.classes;
      Array.isArray(l) && l.length && (n.classList.add(...l), (p = (w = n.closest) == null ? void 0 : w.call(n, ".window-app, .app, .application")) == null || p.classList.add(...l)), this._activateV1Form(n), typeof this.activateListeners == "function" && this.activateListeners(r ? r(n) : n);
    }
  };
}
function Dt() {
  const e = At(), s = Et(), t = globalThis.Application ?? (s == null ? void 0 : s.Application) ?? (e == null ? void 0 : e.ApplicationV1) ?? globalThis.FormApplication ?? (s == null ? void 0 : s.FormApplication) ?? (e == null ? void 0 : e.FormApplication);
  if (t) return t;
  const i = e == null ? void 0 : e.ApplicationV2;
  return i ? Nt(i) : null;
}
class Ut {
  constructor(s, t) {
    L(this, "outside", (s) => {
      s.composedPath().includes(this.root) || this.dismiss();
    });
    this.root = s, this.dismiss = t, document.addEventListener("pointerdown", this.outside, !0);
  }
  destroy() {
    document.removeEventListener("pointerdown", this.outside, !0);
  }
}
class Pt {
  constructor(s, t, i, n) {
    L(this, "frame", 0);
    L(this, "destroyed", !1);
    L(this, "svg");
    L(this, "line");
    L(this, "lastGeometry", "");
    L(this, "outside", (s) => {
      var i, n;
      const t = s.composedPath();
      s.button === 2 && t.includes(((i = canvas.app) == null ? void 0 : i.canvas) ?? ((n = canvas.app) == null ? void 0 : n.view)) || t.includes(this.root) || this.dismiss();
    });
    L(this, "update", () => {
      var i, n;
      if (this.destroyed) return;
      const s = ((i = canvas.app) == null ? void 0 : i.canvas) ?? ((n = canvas.app) == null ? void 0 : n.view), t = this.token.object;
      if (!this.root.isConnected) {
        this.destroy();
        return;
      }
      if (!t || this.token.hidden) {
        this.destroy(), this.dismiss();
        return;
      }
      if (this.root.isConnected && s && canvas.stage) {
        const a = s.getBoundingClientRect(), r = canvas.app.renderer.screen, o = canvas.stage.worldTransform.apply(t.center), c = a.left + o.x * a.width / r.width, l = a.top + o.y * a.height / r.height, u = this.root.getBoundingClientRect(), d = 24 + Math.min(60, (t.w ?? 0) * Math.abs(canvas.stage.worldTransform.a) / 2), w = c + d + u.width <= innerWidth - 8 ? c + d : c - d - u.width, p = Math.max(8, Math.min(innerWidth - u.width - 8, w)), S = Math.max(8, Math.min(innerHeight - u.height - 8, l - u.height / 3));
        (Math.abs(u.left - p) > 0.5 || Math.abs(u.top - S) > 0.5) && this.position(p, S);
        const R = this.root.querySelector(".hl-panel") ?? this.root, v = R.getBoundingClientRect(), q = getComputedStyle(R), I = parseFloat(q.borderLeftWidth) || 3, C = Math.min(parseFloat(q.borderTopLeftRadius) || 0, v.height / 2, v.width / 2), f = c <= v.left || c >= v.right, b = f ? c <= v.left ? v.left + I / 2 : v.right - I / 2 : Math.max(v.left + C, Math.min(v.right - C, c)), g = f ? Math.max(v.top + C, Math.min(v.bottom - C, l)) : l < (v.top + v.bottom) / 2 ? v.top + I / 2 : v.bottom - I / 2, m = `${c},${l},${b},${g}`;
        m !== this.lastGeometry && (this.line.setAttribute("x1", String(c)), this.line.setAttribute("y1", String(l)), this.line.setAttribute("x2", String(b)), this.line.setAttribute("y2", String(g)), this.lastGeometry = m), this.line.style.stroke = q.borderLeftColor, this.line.style.strokeWidth = String(I), this.svg.style.zIndex = String(Math.max(0, (parseInt(getComputedStyle(this.root).zIndex) || 100) - 1));
      }
      this.frame = requestAnimationFrame(this.update);
    });
    this.root = s, this.token = t, this.position = i, this.dismiss = n;
    const a = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(a, "svg"), this.svg.classList.add("hl-loot-tether"), this.svg.setAttribute("aria-hidden", "true"), this.line = document.createElementNS(a, "line"), this.svg.append(this.line), document.body.append(this.svg), document.addEventListener("pointerdown", this.outside, !0), this.frame = requestAnimationFrame(this.update);
  }
  destroy() {
    this.destroyed = !0, cancelAnimationFrame(this.frame), document.removeEventListener("pointerdown", this.outside, !0), this.svg.remove();
  }
}
const K = (e) => String(e ?? "").replace(/[&<>"']/g, (s) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[s]);
async function Gt({ roll: e, itemName: s, quantity: t }) {
  var r;
  const { game: i } = globalThis, n = i.i18n.format("HL.QuantityRollChat", { item: K(s), quantity: t }), a = ((r = i.release) == null ? void 0 : r.generation) >= 14 ? { messageMode: "self" } : { rollMode: "selfroll" };
  await e.toMessage({ flavor: n }, a);
}
async function _t(e, s) {
  var d;
  const { game: t, foundry: i, ChatMessage: n } = globalThis, a = e.claim.quantityRoll, r = s.preview ? s.preview(e) : e.data, c = (((d = i == null ? void 0 : i.dice) == null ? void 0 : d.Roll) ?? globalThis.Roll).fromData(a.roll), l = t.i18n.format("HL.PickupRollChat", { item: K(r.name), quantity: a.quantity }), u = await c.toMessage({ flavor: l }, { create: !1 });
  await n.create({ ...u, whisper: [e.claim.userId], blind: !1 });
}
async function jt({ token: e, actor: s, entry: t, adapter: i }) {
  var c, l;
  const { game: n, ChatMessage: a } = globalThis;
  if (!n.settings.get(h, "chatLog")) return;
  const r = i.preview ? i.preview(t) : t.data, o = n.i18n.format("HL.ChatLooted", {
    actor: K(s.name),
    source: K(e.name),
    item: K(r.name),
    quantity: K(((c = t.currency) == null ? void 0 : c.amount) ?? ((l = r.system) == null ? void 0 : l.quantity) ?? 1)
  });
  await a.create({
    speaker: a.getSpeaker({ actor: s }),
    content: `<p>${o}</p>`,
    whisper: [],
    blind: !1,
    flags: { [h]: { claimId: t.claim.id, userId: t.claim.userId } }
  });
}
const st = Dt(), nt = (e) => `modules/${h}/templates/${e}.hbs`, x = (e) => game.i18n.localize(`HL.${e}`);
function D(e) {
  const s = x((e == null ? void 0 : e.code) ?? "TransferFailed");
  return ui.notifications.warn(s), s;
}
const ot = (e) => e instanceof HTMLElement ? e : e[0];
class zt extends st {
  constructor(t, i, n) {
    super({ id: `hololoot-${t.id}` });
    L(this, "token");
    L(this, "send");
    L(this, "adapter");
    L(this, "data", { entries: [] });
    L(this, "destination", "");
    L(this, "busy", !1);
    L(this, "message", "");
    L(this, "loading", !1);
    L(this, "firstDraw", null);
    L(this, "resolveFirstDraw", null);
    L(this, "refreshing", null);
    L(this, "refreshAgain", !1);
    L(this, "disposed", !1);
    L(this, "presentation", null);
    this.token = t, this.send = i, this.adapter = n;
    const a = game.user.character;
    a && n.destination(a) && a.testUserPermission(game.user, "OWNER") && (this.destination = a.id);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: "HoloSuite Loot",
      classes: ["holosuite-loot-window", "holosuite-loot-popup"],
      template: nt("loot"),
      width: 340,
      height: "auto",
      resizable: !1
    });
  }
  show(t) {
    return this.firstDraw || (this.firstDraw = new Promise((i) => {
      this.resolveFirstDraw = i;
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
            D(t), await this.close();
            return;
          }
          this.data = { entries: [] }, this.message = D(t);
        }
        this.loading = !1, this.disposed || this.render(!0);
      })().finally(() => {
        this.refreshing = null, this.refreshAgain && !this.disposed && !this.busy && this.refresh();
      }), this.refreshing);
    }
  }
  getData() {
    var o;
    const t = game.settings.get(h, "characterSelector"), i = game.settings.get(h, "panelTheme"), n = game.actors.contents.filter((c) => this.adapter.destination(c) && c.testUserPermission(game.user, "OWNER"));
    let a = "";
    if (t)
      !this.destination && n.length === 1 && (this.destination = n[0].id);
    else try {
      this.destination = P(ke(game.user, game.actors.contents, (o = canvas.scene) == null ? void 0 : o.tokens, this.adapter));
    } catch (c) {
      this.destination = "", a = x(c.code);
    }
    const r = t ? n.some((c) => c.id === this.destination) : !!this.destination;
    return {
      ...this.data,
      name: this.data.name ?? this.token.name,
      img: this.data.img ?? this.token.texture.src,
      actors: n.map((c) => ({ id: c.id, name: c.name, selected: c.id === this.destination })),
      disabled: this.loading || this.busy || !r || !this.data.entries.length,
      loading: this.loading,
      showSelector: t,
      theme: i,
      busy: this.busy,
      message: this.message || a || (!n.length && t ? x("NoActor") : ""),
      empty: !this.loading && !this.data.entries.length && !this.message
    };
  }
  activateListeners(t) {
    var a, r, o;
    if (super.activateListeners(t), this.disposed) return;
    const i = ot(t);
    (a = this.presentation) == null || a.destroy();
    const n = i.closest(".window-app, .application") ?? i.closest(".holosuite-loot-popup") ?? i;
    this.presentation = new Pt(
      n,
      this.token,
      (c, l) => this.setPosition({ left: c, top: l }),
      () => void this.close()
    ), (r = i.querySelector("select")) == null || r.addEventListener("change", (c) => {
      this.destination = c.target.value, this.render(!0);
    }), i.querySelectorAll("button[data-loot]").forEach((c) => {
      c.addEventListener("click", () => void this.take(c.dataset.loot));
    }), i.querySelectorAll("[data-inspect]").forEach((c) => {
      c.addEventListener("click", () => void this.inspect(c.dataset.inspect));
    }), (o = this.resolveFirstDraw) == null || o.call(this), this.resolveFirstDraw = null;
  }
  async inspect(t) {
    try {
      const n = { ...(await this.send({ action: "inspect", entryId: t, tokenUuid: this.token.uuid })).item, ownership: { default: 0, [game.user.id]: 2 } }, a = globalThis.CONFIG.Item.documentClass;
      new a(n, { temporary: !0 }).sheet.render(!0, { editable: !1 });
    } catch (i) {
      D(i);
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
        const i = this.data.failures ?? [];
        this.message = i.map((n) => `${n.name}: ${x(n.code)}`).join(" · "), this.message && ui.notifications.warn(this.message);
      } catch (i) {
        this.message = D(i);
      } finally {
        this.busy = !1, this.disposed || (this.render(!0), this.refreshAgain && this.refresh());
      }
    }
  }
  async close(t) {
    var i, n;
    return this.disposed = !0, (i = this.presentation) == null || i.destroy(), this.presentation = null, (n = this.resolveFirstDraw) == null || n.call(this), this.resolveFirstDraw = null, super.close(t);
  }
}
class kt extends st {
  constructor(t, i, n) {
    super({ id: `hololoot-config-${t.id}` });
    L(this, "token");
    L(this, "adapter");
    L(this, "queue");
    L(this, "config");
    L(this, "scope", "token");
    L(this, "busy", !1);
    L(this, "dismissal", null);
    this.token = t, this.adapter = i, this.queue = n, this.config = structuredClone(X(t));
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: x("Title"),
      classes: ["holosuite-loot-window", "holosuite-loot-config"],
      template: nt("config"),
      width: 480,
      height: "auto",
      resizable: !1
    });
  }
  getData() {
    const t = game.settings.get(h, "zeroHP"), i = !t && this.config.mode === "automatic" ? "disabled" : this.config.mode, n = (o) => (o == null ? void 0 : o.quantity) ?? (o ? x(`Rule.${o.mode}`) : ""), a = Rt(this.token, this.adapter).map(({ entry: o, effective: c, overrides: l, ...u }) => ({
      ...u,
      configured: n(c.rule),
      effectiveScope: c.scope,
      tokenRule: n(l.token),
      actorRule: n(l.actor),
      globalRule: n(l.global),
      ruleScope: x(`Scope.${c.scope}`),
      original: (o == null ? void 0 : o.originalQuantity) ?? u.quantity,
      remaining: o ? o.taken ? 0 : o.formula ?? o.data.system.quantity : "—",
      rollResult: !(o != null && o.taken) && Number.isSafeInteger(o == null ? void 0 : o.rolledQuantity) ? game.i18n.format("HL.QuantityRollResult", { roll: o.rolledQuantity, quantity: o.data.system.quantity }) : "",
      pending: !!(o != null && o.claim) && !(o != null && o.taken)
    })), r = E();
    return {
      name: this.token.name,
      theme: game.settings.get(h, "panelTheme"),
      busy: this.busy,
      automatic: t,
      rows: a,
      canEdit: r,
      canRefresh: r && it(this.token, this.adapter),
      scopes: ["token", "actor", "global"].map((o) => ({ value: o, label: x(`Scope.${o}`), selected: this.scope === o })),
      modes: (t ? ["automatic", "enabled", "disabled"] : ["enabled", "disabled"]).map((o) => ({ value: o, label: x(o), selected: o === i }))
    };
  }
  activateListeners(t) {
    var w, p, S, R;
    super.activateListeners(t);
    const i = ot(t);
    (w = this.dismissal) == null || w.destroy(), this.dismissal = new Ut(i.closest(".window-app, .application") ?? i, () => {
      this.busy || this.close();
    }), (p = i.querySelector('[name="mode"]')) == null || p.addEventListener("change", (v) => {
      this.config.mode = v.target.value;
    }), (S = i.querySelector("[data-save]")) == null || S.addEventListener("click", () => void this.save()), (R = i.querySelector("[data-close]")) == null || R.addEventListener("click", () => void this.close());
    const n = i.querySelector('[name="scope"]'), a = i.querySelector('[name="behavior"]'), r = i.querySelector('[name="formula"]'), o = i.querySelector("[data-apply]"), c = i.querySelector("[data-refresh-inventory]"), l = i.querySelector("[data-select-all]");
    if (!n || !a || !r || !o || !l) return;
    const u = Array.from(i.querySelectorAll("input[data-rule-item]")), d = () => {
      this.scope = n.value, n.disabled = a.disabled = r.disabled = this.busy, c && (c.disabled = this.busy);
      const v = u.filter((I) => {
        const C = I.dataset[this.scope] === "true";
        I.disabled = this.busy || !C, C || (I.checked = !1);
        const f = I.closest("label"), b = f == null ? void 0 : f.querySelector("[data-rule-unavailable]"), g = I.dataset[`${this.scope}Unavailable`];
        b && (b.textContent = !C && g ? x(g) : "");
        const m = f == null ? void 0 : f.querySelector("[data-scoped-rule]"), H = I.dataset[`${this.scope}Rule`];
        return m && (m.textContent = H && I.dataset.effectiveScope !== this.scope ? ` · ${x(`Scope.${this.scope}`)} ${H}` : ""), C;
      }), q = v.filter((I) => I.checked).length;
      l.disabled = this.busy || !v.length, l.checked = !!q && q === v.length, l.indeterminate = !!q && !l.checked, o.disabled = this.busy || !q, r.hidden = a.value !== "quantity";
    };
    n.addEventListener("change", d), a.addEventListener("change", d);
    for (const v of u) v.addEventListener("change", d);
    l.addEventListener("change", () => {
      for (const v of u) v.disabled || (v.checked = l.checked);
      d();
    }), c == null || c.addEventListener("click", async () => {
      if (!(!E() || this.busy)) {
        this.busy = !0, d();
        try {
          await this.queue.run(this.token.uuid, () => It(this.token, this.adapter)), ui.notifications.info(x("InventoryRefreshed"));
        } catch (v) {
          D(v);
          return;
        } finally {
          this.busy = !1, d();
        }
        this.rendered && this.render(!0);
      }
    }), o.addEventListener("click", async () => {
      if (!(!E() || this.busy)) {
        try {
          const v = ge(a.value, r.value), q = u.filter((f) => f.checked && !f.disabled).map((f) => f.value), I = this.scope;
          this.busy = !0, d();
          const C = await this.queue.run(this.token.uuid, () => Lt(this.token, this.adapter, I, q, v));
          for (const f of C ?? [])
            Gt(f).catch((b) => console.warn("HoloSuite Loot | Could not post quantity roll", b));
        } catch (v) {
          D(v);
          return;
        } finally {
          this.busy = !1, d();
        }
        this.render(!0);
      }
    }), d();
  }
  async save() {
    if (!(!game.user.isGM || this.busy)) {
      this.busy = !0, this.render(!0);
      try {
        const t = this.config.mode === "automatic" && !game.settings.get(h, "zeroHP") ? "disabled" : this.config.mode;
        await this.queue.run(this.token.uuid, () => this.token.setFlag(h, "config", { ...X(this.token), mode: t })), await this.close();
      } catch (t) {
        D(t);
      } finally {
        this.busy = !1, this.rendered && this.render(!0);
      }
    }
  }
  async close(t) {
    var i;
    return (i = this.dismissal) == null || i.destroy(), this.dismissal = null, super.close(t);
  }
}
class Bt {
  constructor(s) {
    L(this, "sprites", /* @__PURE__ */ new Map());
    L(this, "texture");
    L(this, "disposed", !1);
    var i;
    this.available = s;
    const t = ((i = foundry.canvas) == null ? void 0 : i.loadTexture) ?? globalThis.loadTexture;
    Promise.resolve().then(() => t == null ? void 0 : t(`modules/${h}/assets/ui/loot-badge.svg`)).then((n) => {
      this.disposed || !n || (this.texture = n, this.refreshScene());
    }).catch((n) => console.warn("HoloSuite Loot | Badge texture could not load", n));
  }
  refreshScene() {
    var s;
    for (const t of ((s = canvas.tokens) == null ? void 0 : s.placeables) ?? []) this.refresh(t);
  }
  refresh(s) {
    if (!s || this.disposed || !this.texture) return;
    const t = s.document, i = t.getFlag(h, "state");
    if (s.destroyed || s.isPreview || t.hidden || !this.available(t) || i && !i.entries.some((a) => !a.taken && !a.hidden)) {
      this.remove(s);
      return;
    }
    let n = this.sprites.get(s);
    (n != null && n.destroyed || (n == null ? void 0 : n.parent) !== s) && (this.remove(s), n = new PIXI.Sprite(this.texture), n.name = "holosuite-loot-badge", n.eventMode = "none", n.anchor.set(0.5), n.width = n.height = 24, n.zIndex = 100, s.addChild(n), this.sprites.set(s, n)), n.position.set(s.w, 0);
  }
  remove(s) {
    var i;
    const t = this.sprites.get(s);
    this.sprites.delete(s), t && !t.destroyed && ((i = t.parent) == null || i.removeChild(t), t.destroy());
  }
  destroy() {
    this.disposed = !0;
    for (const s of this.sprites.keys()) this.remove(s);
  }
}
const A = /* @__PURE__ */ new Map();
let F = null, _ = !1, ae = 0;
const O = () => ht(game.system.id), Vt = (e, s) => {
  var t;
  return ke(e, game.actors.contents, (t = game.scenes.get(e.viewedScene)) == null ? void 0 : t.tokens, s);
}, ne = new mt({
  moduleId: h,
  authority: E,
  environment: () => ie(O()),
  adapter: O,
  token: async (e) => {
    if (!/^Scene\.[^.]+\.Token\.[^.]+$/.test(e)) throw new y("InvalidRequest");
    const t = await (foundry.utils.fromUuid ?? globalThis.fromUuid)(e);
    return (t == null ? void 0 : t.documentName) === "Token" ? t : null;
  },
  actor: (e) => game.actors.get(e) ?? (foundry.utils.fromUuid ?? globalThis.fromUuid)(e),
  id: () => foundry.utils.randomID(),
  destination: (e, s) => game.settings.get(h, "characterSelector") ? e.actorId ? ne.io.actor(e.actorId) : null : Vt(s, O()),
  load: He,
  save: qt,
  summary: Ct,
  collected: jt,
  rollQuantity: St,
  quantityRolled: _t
}), Ie = (e) => Ht(e, ne);
function Ae(e) {
  var s;
  return _ && !!O() && te(e, ie()) && (game.user.isGM || !e.hidden && ((s = e.object) == null ? void 0 : s.isVisible));
}
async function we(e) {
  var a, r, o, c, l;
  e = (e == null ? void 0 : e.document) ?? e;
  const s = O();
  if (!s) {
    D(new y("Unsupported"));
    return;
  }
  if (game.user.isGM) return oe(e);
  if (!Ae(e)) {
    D(new y("Unavailable"));
    return;
  }
  const t = ++ae;
  let i;
  if (Ce() > 0 && (!A.has(e.uuid) || (a = A.get(e.uuid)) != null && a.disposed)) {
    try {
      i = await Ie({ action: "view", tokenUuid: e.uuid });
    } catch (u) {
      t === ae && ((r = canvas.scene) == null ? void 0 : r.id) === ((o = e.parent) == null ? void 0 : o.id) && D(u);
      return;
    }
    if (t !== ae || ((c = canvas.scene) == null ? void 0 : c.id) !== ((l = e.parent) == null ? void 0 : l.id)) return;
  }
  for (const [u, d] of A)
    u !== e.uuid && !d.disposed && await d.close();
  if (t !== ae) return;
  let n = A.get(e.uuid);
  (!n || n.disposed) && (n = new zt(e, Ie, s), A.set(e.uuid, n), await n.show(i), i !== void 0) || n.disposed || await n.refresh();
}
async function oe(e) {
  var s, t;
  if (!(!game.user.isGM || !O())) {
    if (((s = e == null ? void 0 : e.parent) == null ? void 0 : s.documentName) !== "Scene" || ((t = e.actor) == null ? void 0 : t.type) !== "npc") {
      ui.notifications.info(x("SelectToken"));
      return;
    }
    try {
      new kt(e, O(), ne.queue).render(!0);
    } catch (i) {
      D(i);
    }
  }
}
function se(e) {
  const s = A.get(e);
  s && !s.disposed && s.refresh();
}
function Ee(e) {
  !_ || !E() || !O() || e.getFlag(h, "state") || !te(e, ie()) || ne.queue.run(e.uuid, async () => {
    E() && te(e, ie()) && !e.getFlag(h, "state") && await He(e, O());
  }).catch((s) => console.warn("HoloSuite Loot | Snapshot initialization failed", e.uuid, s));
}
function U() {
  var e;
  for (const s of ((e = canvas.scene) == null ? void 0 : e.tokens) ?? []) Ee(s);
  F == null || F.refreshScene();
}
function Kt() {
  const e = [.../* @__PURE__ */ new Set([...canvas.tokens.controlled, ...game.user.targets])];
  if (e.length !== 1) {
    ui.notifications.info(x("SelectToken"));
    return;
  }
  const s = e[0];
  game.user.isGM ? oe(s.document) : we(s.document);
}
function Ge() {
  var s;
  const e = ((s = game.modules.get("holosuite-core")) == null ? void 0 : s.api) ?? game.holosuite;
  return e != null && e.registerApp ? (e.registerApp({
    id: h,
    title: x("Title"),
    icon: "fa-solid fa-box-open",
    playerVisible: !1,
    premium: !1,
    description: x("SelectToken"),
    open: Kt
  }), !0) : !1;
}
let M, J, _e = "", je = 0;
function Q(e) {
  var c, l;
  if (game.user.isGM || !_ || e.type === "pointerdown" && e.button !== 2) return;
  const s = M == null ? void 0 : M.getBoundingClientRect(), t = (l = (c = canvas.app) == null ? void 0 : c.renderer) == null ? void 0 : l.screen;
  if (!(s != null && s.width) || !s.height || !t || !canvas.stage) return;
  const i = canvas.stage.worldTransform.applyInverse({
    x: (e.clientX - s.left) * t.width / s.width,
    y: (e.clientY - s.top) * t.height / s.height
  }), n = (u) => {
    var d;
    return (u == null ? void 0 : u.isVisible) && (((d = u.bounds) == null ? void 0 : d.contains(i.x, i.y)) ?? (i.x >= u.document.x && i.y >= u.document.y && i.x <= u.document.x + u.w && i.y <= u.document.y + u.h));
  }, a = n(J) ? J : [...canvas.tokens.placeables].reverse().find(n), r = a == null ? void 0 : a.document;
  if (!Ae(r)) {
    for (const u of A.values()) u.disposed || u.close();
    return;
  }
  if (e.type === "contextmenu" && _e === r.uuid && Date.now() - je < 1e3) return;
  e.type === "pointerdown" && (_e = r.uuid, je = Date.now());
  const o = A.get(r.uuid);
  o && !o.disposed ? o.close() : we(r);
}
function at() {
  var e, s;
  F == null || F.destroy(), F = _ ? new Bt((t) => !!O() && te(t, ie())) : null, M == null || M.removeEventListener("contextmenu", Q, !0), M == null || M.removeEventListener("pointerdown", Q, !0), M = ((e = canvas.app) == null ? void 0 : e.canvas) ?? ((s = canvas.app) == null ? void 0 : s.view), M == null || M.addEventListener("contextmenu", Q, !0), M == null || M.addEventListener("pointerdown", Q, !0);
}
Hooks.once("init", () => {
  game.settings.register(h, le, { scope: "world", config: !1, type: Object, default: {} }), game.settings.register(h, "zeroHP", {
    name: "HL.ZeroHP",
    hint: "HL.ZeroHPHint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0,
    onChange: () => {
      U();
      for (const e of A.keys()) se(e);
    }
  }), game.settings.register(h, "hideGmLootButton", {
    name: "HL.HideGmLootButton",
    hint: "HL.HideGmLootButtonHint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(h, "characterSelector", {
    name: "HL.CharacterSelector",
    hint: "HL.CharacterSelectorHint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(h, Qe, {
    name: "HL.LootRange",
    hint: "HL.LootRangeHint",
    scope: "world",
    config: !0,
    type: Number,
    default: We,
    onChange: () => {
      for (const e of A.keys()) se(e);
    }
  }), game.settings.register(h, "chatLog", {
    name: "HL.ChatLog",
    hint: "HL.ChatLogHint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(h, "panelTheme", {
    name: "HL.PanelTheme",
    hint: "HL.PanelThemeHint",
    scope: "world",
    config: !0,
    type: String,
    default: "holo",
    choices: { holo: "HL.ThemeHolo", neutral: "HL.ThemeNeutral", fantasy: "HL.ThemeFantasy" },
    onChange: () => {
      for (const e of A.values()) e.disposed || e.render(!1);
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
    await xt(ne, se);
  } catch (s) {
    D(s);
    return;
  }
  _ = !0, game.modules.get(h).api = {
    version: ce,
    open: we,
    configure: oe,
    registerAdapter: ft,
    // Requests still pass every authority and permission check, including calls from macros.
    request: Ie,
    authority: () => {
      var s;
      return (s = qe()) == null ? void 0 : s.id;
    }
  }, Ge(), setTimeout(Ge, 500), at(), U(), console.info(`HoloSuite Loot | ${ce} ready; Foundry ${game.version}, ${game.system.id} ${game.system.version}`);
});
Hooks.on("canvasReady", () => {
  at(), U();
});
Hooks.on("hoverToken", (e, s) => {
  s ? J = e : J === e && (J = null);
});
Hooks.on("canvasTearDown", () => {
  F == null || F.destroy(), F = null, J = null, M == null || M.removeEventListener("contextmenu", Q, !0), M == null || M.removeEventListener("pointerdown", Q, !0), M = null;
  for (const e of A.values()) e.close();
  A.clear();
});
Hooks.on("renderTokenHUD", (e, s) => {
  var r;
  if (!_) return;
  const t = (r = e.object) == null ? void 0 : r.document;
  if (!(t != null && t.actor) || t.actor.type !== "npc") return;
  const i = s instanceof HTMLElement ? s : s[0], n = i.querySelector(".col.right") ?? i;
  i.querySelectorAll(".hl-token-action").forEach((o) => o.remove());
  const a = (o, c, l) => {
    const u = document.createElement("button");
    u.type = "button", u.className = "control-icon hl-token-action", u.title = o, u.setAttribute("aria-label", o);
    const d = document.createElement("i");
    d.className = c, u.append(d), u.addEventListener("click", (w) => {
      w.preventDefault(), w.stopPropagation(), l();
    }), n.append(u);
  };
  game.user.isGM ? O() && !game.settings.get(h, "hideGmLootButton") && a(x("Loot"), "fa-solid fa-box-open", () => void oe(t)) : Ae(t) && a(x("Loot"), "fa-solid fa-box-open", () => void we(t));
});
Hooks.on("renderTokenConfig", (e, s) => {
  var a, r;
  if (!_ || !game.user.isGM || !O()) return;
  const t = e.document ?? e.object;
  if (((a = t == null ? void 0 : t.parent) == null ? void 0 : a.documentName) !== "Scene" || ((r = t.actor) == null ? void 0 : r.type) !== "npc") return;
  const i = s instanceof HTMLElement ? s : s[0];
  if (i.querySelector(".hl-token-config")) return;
  const n = document.createElement("button");
  n.type = "button", n.className = "hl-token-config", n.textContent = x("Configure"), n.addEventListener("click", () => oe(t)), (i.querySelector('[data-tab="character"]') ?? i.querySelector("form") ?? i).append(n);
});
Hooks.on("drawToken", (e) => F == null ? void 0 : F.refresh(e));
Hooks.on("refreshToken", (e, s) => {
  (!s || s.refreshSize || s.refreshShape) && (F == null || F.refresh(e));
});
Hooks.on("destroyToken", (e) => F == null ? void 0 : F.remove(e));
Hooks.on("updateToken", (e, s) => {
  var t, i, n;
  if (Ee(e), F == null || F.refresh(e.object), se(e.uuid), !(!A.size || !Ce() || ((t = e.parent) == null ? void 0 : t.id) !== ((i = canvas.scene) == null ? void 0 : i.id) || !e.actor || !((n = O()) != null && n.destination(e.actor)) || !e.actor.testUserPermission(game.user, "OWNER") || !["x", "y", "elevation", "width", "height", "hidden"].some((a) => a in s)))
    for (const a of A.keys()) a !== e.uuid && se(a);
});
Hooks.on("createToken", Ee);
Hooks.on("updateCombatant", U);
Hooks.on("deleteCombatant", U);
Hooks.on("updateActor", U);
Hooks.on("createActiveEffect", U);
Hooks.on("updateActiveEffect", U);
Hooks.on("deleteActiveEffect", U);
Hooks.on("userConnected", U);
Hooks.on("deleteToken", (e) => {
  var s;
  if ((s = A.get(e.uuid)) == null || s.close(), A.delete(e.uuid), !!E())
    for (const t of game.journal.contents)
      t.getFlag(h, "tokenUuid") === e.uuid && t.delete().catch(console.warn);
});
