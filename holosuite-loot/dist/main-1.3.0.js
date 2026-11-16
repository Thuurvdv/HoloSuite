var wt = Object.defineProperty;
var vt = (s, i, e) => i in s ? wt(s, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[i] = e;
var S = (s, i, e) => vt(s, typeof i != "symbol" ? i + "" : i, e);
const f = "holosuite-loot", ye = "1.3.0", ke = "commandV3", Te = "replyV3", O = (s) => structuredClone(s), H = (s) => {
  var i, e, t;
  return ((e = (i = s == null ? void 0 : s.system) == null ? void 0 : i.quantity) == null ? void 0 : e.value) ?? ((t = s == null ? void 0 : s.system) == null ? void 0 : t.quantity) ?? 1;
}, He = (s) => {
  var i;
  return typeof ((i = s == null ? void 0 : s.system) == null ? void 0 : i.quantity) == "object" && s.system.quantity !== null ? "system.quantity.value" : "system.quantity";
};
function Xe(s, i) {
  He(s) === "system.quantity.value" ? s.system.quantity.value = i : s.system.quantity !== void 0 && (s.system.quantity = i);
}
function bt(s, i, e, t = "request") {
  var n, a;
  return e !== s.id || !s.active || !((a = (n = i.flags) == null ? void 0 : n[f]) != null && a[t]) ? null : O(s.getFlag(f, t));
}
class m extends Error {
  constructor(i) {
    super(i), this.code = i;
  }
}
function pe(s) {
  const i = (e) => typeof e == "string" && /^[\w-]{1,64}$/.test(e);
  return typeof (s == null ? void 0 : s.tokenUuid) == "string" && /^Scene\.[\w-]{1,64}\.Token\.[\w-]{1,64}$/.test(s.tokenUuid) && ["view", "inspect", "take", "all"].includes(s.action) && (!["inspect", "take"].includes(s.action) || i(s.entryId)) && (s.actorId == null || typeof s.actorId == "string" && /^(?:[\w-]{1,64}|Actor\.[\w-]{1,64}|Scene\.[\w-]{1,64}\.Token\.[\w-]{1,64}(?:\.Actor\.[\w-]{1,64})?)$/.test(s.actorId));
}
function Z(s) {
  var i;
  return s.getFlag(f, "config") ?? ((i = s.actor) == null ? void 0 : i.getFlag(f, "config")) ?? { mode: "automatic", source: "inventory" };
}
const N = (s) => (s == null ? void 0 : s.uuid) ?? (s == null ? void 0 : s.id), ee = (s) => JSON.stringify(s, (i, e) => e && typeof e == "object" && !Array.isArray(e) ? Object.fromEntries(Object.entries(e).sort(([t], [n]) => t.localeCompare(n))) : e);
function J(s, i, e, t = void 0) {
  return !s || !e.destination(s) || !s.testUserPermission(i, "OWNER") ? !1 : !(e.manual || e.acceptsLegacyWholeItems) || !t || N(s) !== N(t.actor) && (s.isToken || s.id !== t.actorId);
}
function Ye(s, i, e, t, n = void 0) {
  const a = (c) => J(c, s, t, n);
  if (a(s.character)) return s.character;
  const o = [...new Map(Array.from(e ?? []).map((c) => c.actor).filter(a).map((c) => [N(c), c])).values()];
  if (o.length === 1) return o[0];
  if (o.length > 1) throw new m("AmbiguousActor");
  const r = Array.from(i ?? []).filter(a);
  if (r.length === 1) return r[0];
  throw new m(r.length ? "AmbiguousActor" : "NoActor");
}
function ae(s, { combats: i = [], zeroHP: e = !1, automatic: t = !0, manual: n = !1, sourceActor: a, hitPoints: o, defeated: r } = {}) {
  var d, v, b, p, I, g;
  if (!(s != null && s.actor) || (n ? !s.actor.items : !((a == null ? void 0 : a(s.actor)) ?? s.actor.type === "npc"))) return !1;
  if (n) return ((d = s.getFlag(f, "config")) == null ? void 0 : d.mode) === "enabled";
  const c = Z(s);
  if (c.mode === "disabled") return !1;
  if (c.mode === "enabled") return !0;
  if (!t) return !1;
  if (i.some((C) => {
    var L;
    return (L = C.combatants) == null ? void 0 : L.some((q) => {
      var h, R;
      return q.tokenId === s.id && (q.sceneId ?? ((h = C.scene) == null ? void 0 : h.id)) === ((R = s.parent) == null ? void 0 : R.id) && (q.isDefeated || q.defeated);
    });
  })) return !0;
  const l = s.actor.statuses;
  if (l != null && l.has("dead") || r != null && r(s.actor)) return !0;
  const u = o ? o(s.actor) : (b = (v = s.actor.system) == null ? void 0 : v.attributes) == null ? void 0 : b.hp;
  return e && Number(u == null ? void 0 : u.max) > 0 && (u == null ? void 0 : u.value) === 0 && !((g = (I = (p = s.actor.system) == null ? void 0 : p.attributes) == null ? void 0 : I.death) != null && g.success);
}
function St(s, i, e, t = void 0) {
  var a, o, r;
  if (!(i != null && i.active) || !ae(s, e)) throw new m("Unavailable");
  if (i.isGM) return;
  const n = ((a = s.parent) == null ? void 0 : a.active) || ((o = s.parent) == null ? void 0 : o.testUserPermission(i, "LIMITED"));
  if (s.hidden || i.viewedScene !== ((r = s.parent) == null ? void 0 : r.id) || !n || !e.visible(s, i))
    throw new m("AccessDenied");
  if (e.inRange && !e.inRange(s, i, t)) throw new m("OutOfRange");
}
function Ge(s, i, e, t = void 0) {
  if (!J(s, i, e, t))
    throw new m("ActorDenied");
}
class de {
  constructor() {
    S(this, "tails", /* @__PURE__ */ new Map());
  }
  async run(i, e) {
    const n = (this.tails.get(i) ?? Promise.resolve()).catch(() => {
    }).then(e);
    this.tails.set(i, n);
    try {
      return await n;
    } finally {
      this.tails.get(i) === n && this.tails.delete(i);
    }
  }
}
const Ae = new de(), Fe = (s) => `${s.currency.unit}:${s.currency.amount}`, se = (s, i, e, t = !1) => {
  var n, a;
  return ((a = (n = s.getFlag) == null ? void 0 : n.call(s, f, t ? "currencyDebits" : "currencyReceipts")) == null ? void 0 : a[e.id]) === Fe(i);
};
function Re({ units: s, amountOf: i, path: e, valid: t, name: n }) {
  return {
    entries(a) {
      return s.filter((o) => t(i(a, o)) && i(a, o) > 0).map((o) => {
        const r = i(a, o);
        return { currency: { storage: "balance", unit: o, amount: r }, data: {
          name: n(o),
          type: "currency",
          img: "icons/svg/coins.svg",
          system: { quantity: r }
        } };
      });
    },
    received: se,
    async grant(a, o, r, c) {
      return Ae.run(N(a), async () => {
        if (se(a, o, r)) return;
        if (r.currencyAttempted) throw new m("RecoveryRequired");
        if (!c) throw new m("RecoveryRequired");
        await c();
        const { unit: l, amount: u } = o.currency, d = i(a, l);
        if (!s.includes(l) || !t(u) || !u || !t(d) || !t(d + u)) throw new m("CurrencyChanged");
        if (await a.update({
          [e(l)]: d + u,
          [`flags.${f}.currencyReceipts.${r.id}`]: Fe(o)
        }), !se(a, o, r)) throw new m("TransferFailed");
      });
    },
    sourcePlan(a, o) {
      const { unit: r, amount: c } = o.currency, l = i(a.actor, r);
      if (!s.includes(r) || !t(l) || !t(c) || c <= 0 || l < c) throw new m("CurrencyChanged");
      return { currency: r, before: l, after: l - c };
    },
    async debit(a, o, r) {
      return Ae.run(N(a.actor), async () => {
        const c = a.actor;
        if (se(c, o, r, !0)) return;
        const l = r.source;
        if (i(c, l.currency) !== l.before) throw new m("CurrencyChanged");
        if (await c.update({
          [e(l.currency)]: l.after,
          [`flags.${f}.currencyDebits.${r.id}`]: Fe(o)
        }), !se(c, o, r, !0)) throw new m("CurrencyChanged");
      });
    },
    async cleanup(a, o, r, c) {
      for (const [l, u] of [[o, "currencyReceipts"], [a.actor, "currencyDebits"]])
        try {
          await Ae.run(N(l), () => l.update({ [`flags.${f}.${u}.-=${c.id}`]: null }));
        } catch (d) {
          console.warn("HoloSuite Loot | Could not clean committed currency receipt", d);
        }
    }
  };
}
const It = Re({
  units: ["cp", "sp", "ep", "gp", "pp"],
  amountOf: (s, i) => {
    var e, t;
    return (t = (e = s == null ? void 0 : s.system) == null ? void 0 : e.currency) == null ? void 0 : t[i];
  },
  path: (s) => `system.currency.${s}`,
  valid: (s) => Number.isSafeInteger(s) && s >= 0,
  name: (s) => {
    var t, n, a, o, r;
    const i = (a = (n = (t = globalThis.CONFIG) == null ? void 0 : t.DND5E) == null ? void 0 : n.currencies) == null ? void 0 : a[s], e = typeof i == "string" ? i : i == null ? void 0 : i.label;
    return e ? ((r = (o = globalThis.game) == null ? void 0 : o.i18n) == null ? void 0 : r.localize(e)) ?? e : s.toUpperCase();
  }
}), Rt = Re({
  units: ["swade"],
  amountOf: (s) => {
    var i, e;
    return (e = (i = s == null ? void 0 : s.system) == null ? void 0 : i.details) == null ? void 0 : e.currency;
  },
  path: () => "system.details.currency",
  valid: (s) => Number.isFinite(s) && s >= 0 && s <= Number.MAX_SAFE_INTEGER,
  name: () => {
    var s, i, e;
    return ((e = (i = (s = globalThis.game) == null ? void 0 : s.settings) == null ? void 0 : i.get("swade", "currencyName")) == null ? void 0 : e.trim()) || "Currency";
  }
}), Ct = Re({
  units: ["credits"],
  amountOf: (s) => {
    var i, e, t;
    return (t = (e = (i = s == null ? void 0 : s.system) == null ? void 0 : i.stats) == null ? void 0 : e.credits) == null ? void 0 : t.value;
  },
  path: () => "system.stats.credits.value",
  valid: (s) => Number.isSafeInteger(s) && s >= 0,
  name: () => "Credits"
}), _e = { gc: "gold", sc: "silver", cc: "copper" }, Lt = Re({
  units: Object.keys(_e),
  amountOf: (s, i) => {
    var e, t;
    return (t = (e = s == null ? void 0 : s.system) == null ? void 0 : e.currency) == null ? void 0 : t[i];
  },
  path: (s) => `system.currency.${s}`,
  valid: (s) => Number.isSafeInteger(s) && s >= 0,
  name: (s) => {
    var n, a;
    const i = _e[s], e = `DoD.currency.${i}`, t = (a = (n = globalThis.game) == null ? void 0 : n.i18n) == null ? void 0 : a.localize(e);
    return t && t !== e ? t : i[0].toUpperCase() + i.slice(1);
  }
});
function $e(s) {
  var e;
  const i = O(s.toObject());
  delete i._id, delete i.folder, delete i.ownership, delete i._stats, (e = i.flags) == null || delete e[f];
  for (const t of i.effects ?? [])
    delete t._id, t.origin = null;
  return i;
}
async function we(s) {
  if (s.actorLink && await s.update({ actorLink: !1 }), s.actorLink) throw new m("SourceChanged");
}
class Ze {
  constructor() {
    S(this, "manual", !1);
  }
  received(i, e, t) {
    var n;
    return ((n = i.items.get(t.itemId)) == null ? void 0 : n.getFlag(f, "claim")) === t.id;
  }
  async create(i, e, t) {
    var r;
    const n = i.items.get(t.itemId);
    if (n) {
      if (n.getFlag(f, "claim") !== t.id) throw new m("RecoveryRequired");
      return n;
    }
    const a = O(e.data);
    a._id = t.itemId, a.flags ?? (a.flags = {}), a.flags[f] = { claim: t.id };
    const o = (r = await i.createEmbeddedDocuments("Item", [a], { keepId: !0 })) == null ? void 0 : r[0];
    if (!this.received(i, e, t))
      throw new m("TransferFailed");
    return o;
  }
}
class et extends Ze {
  constructor() {
    super(...arguments);
    S(this, "id", "dnd5e");
    S(this, "balanceCurrency", It);
  }
  currencyEntries(e) {
    return this.balanceCurrency.entries(e);
  }
  received(e, t, n) {
    var a;
    return ((a = t.currency) == null ? void 0 : a.storage) === "balance" ? this.balanceCurrency.received(e, t, n) : super.received(e, t, n);
  }
  async cleanup(e, t, n, a) {
    var o;
    ((o = n.currency) == null ? void 0 : o.storage) === "balance" && await this.balanceCurrency.cleanup(e, t, n, a);
  }
  destination(e) {
    return e.type === "character";
  }
  eligible(e) {
    var c, l, u, d, v;
    const t = e.system, n = (c = t == null ? void 0 : t.constructor) == null ? void 0 : c.metadata;
    if (!["weapon", "equipment", "consumable", "tool", "loot", "container"].includes(e.type) || (n == null ? void 0 : n.inventoryItem) === !1) return !1;
    const o = (u = (l = t == null ? void 0 : t.schema) == null ? void 0 : l.getField) == null ? void 0 : u.call(l, "quantity");
    if (t != null && t.schema && !o || !Number.isSafeInteger(t == null ? void 0 : t.quantity) || t.quantity <= 0) return !1;
    const r = ((d = t.type) == null ? void 0 : d.value) ?? t.weaponType ?? ((v = t.armor) == null ? void 0 : v.type);
    return !["natural", "siege", "vehicle", "currency"].includes(r);
  }
  snapshot(e) {
    const t = $e(e);
    return t.system.container = null, "equipped" in t.system && (t.system.equipped = !1), "attuned" in t.system && (t.system.attuned = !1), t.system.attunement === 2 && (t.system.attunement = 1), t;
  }
  async create(e, t, n, a) {
    var o;
    return ((o = t.currency) == null ? void 0 : o.storage) === "balance" ? this.balanceCurrency.grant(e, t, n, a) : super.create(e, t, n);
  }
  preview(e) {
    var n, a;
    const t = O(e.data);
    return t.system.identified !== !1 ? t : {
      name: ((n = t.system.unidentified) == null ? void 0 : n.name) || "Unidentified Item",
      img: t.img,
      type: "loot",
      system: { quantity: t.system.quantity, identified: !1, description: { value: ((a = t.system.unidentified) == null ? void 0 : a.description) ?? "" } }
    };
  }
  async sourceClaim(e, t) {
    var r, c, l, u, d;
    if (!((r = t.source) != null && r.itemId) && ((c = t.currency) == null ? void 0 : c.storage) !== "balance") return null;
    if ((l = t.source) != null && l.ruleKey && t.source.ruleKey !== `${e.actorId ?? ((u = e.actor) == null ? void 0 : u.id) ?? ""}:${t.source.itemId}`)
      throw new m("SourceChanged");
    if (await we(e), ((d = t.currency) == null ? void 0 : d.storage) === "balance") return this.balanceCurrency.sourcePlan(e, t);
    const n = e.actor.items.get(t.source.itemId), a = H(n), o = H(t.data);
    if (!this.eligible(n ?? {}) || a < o || t.source.ruleKey && n.type !== t.data.type) throw new m("SourceChanged");
    return { itemId: n.id, before: a, after: a - o };
  }
  validateSourcePlan(e, t, n) {
    var r, c, l, u;
    if (!((r = t.source) != null && r.ruleKey)) return;
    const a = (l = e.actor) == null ? void 0 : l.items.get((c = n.source) == null ? void 0 : c.itemId);
    if (e.actorLink || t.source.ruleKey !== `${e.actorId ?? ((u = e.actor) == null ? void 0 : u.id) ?? ""}:${a == null ? void 0 : a.id}` || !this.eligible(a ?? {}) || a.type !== t.data.type || H(a) !== n.source.before)
      throw new m("SourceChanged");
    const o = n.source.sfCurrency;
    if (o) {
      const d = this.entryMetadata(a).currency;
      if ((d == null ? void 0 : d.unit) !== o.unit || (d == null ? void 0 : d.amount) !== o.amount) throw new m("CurrencyChanged");
    }
  }
  async removeSource(e, t, n) {
    const a = n.source;
    if (!a) return;
    if (await we(e), a.currency) return this.balanceCurrency.debit(e, t, n);
    const o = e.actor.items.get(a.itemId);
    if (!o || o.getFlag(f, "sourceClaim") === n.id) return;
    if (H(o) !== a.before) throw new m("SourceChanged");
    a.after === 0 ? await e.actor.deleteEmbeddedDocuments("Item", [o.id]) : await o.update({ [He(o)]: a.after, [`flags.${f}.sourceClaim`]: n.id });
    const r = e.actor.items.get(a.itemId);
    if (a.after === 0 ? r : !r || H(r) !== a.after || (r == null ? void 0 : r.getFlag(f, "sourceClaim")) !== n.id) throw new m("SourceChanged");
  }
}
class qt extends Ze {
  constructor() {
    super(...arguments);
    S(this, "manual", !0);
  }
  destination(e) {
    return !!e.items && typeof e.createEmbeddedDocuments == "function";
  }
  eligible(e) {
    return !!(e != null && e.id) && typeof e.toObject == "function";
  }
  snapshot(e) {
    return $e(e);
  }
  preview(e) {
    var a, o, r, c, l, u;
    const { data: t } = e;
    if (((a = t.system) == null ? void 0 : a.identified) !== !1 && ((r = (o = t.system) == null ? void 0 : o.identification) == null ? void 0 : r.status) !== "unidentified") return O(t);
    const n = ((c = t.system) == null ? void 0 : c.unidentified) ?? ((u = (l = t.system) == null ? void 0 : l.identification) == null ? void 0 : u.unidentified);
    return { name: (n == null ? void 0 : n.name) || "Unidentified Item", type: t.type, img: (n == null ? void 0 : n.img) || t.img };
  }
  received(e, t, n) {
    return super.received(e, t, n) || Array.from(e.items.values()).some((a) => a.getFlag(f, "claim") === n.id);
  }
  async create(e, t, n, a) {
    if (n.itemAttempted || !a) throw new m("RecoveryRequired");
    return await a(), super.create(e, t, n);
  }
  async sourceClaim(e, t) {
    var a;
    await we(e);
    const n = { itemId: (a = t.source) == null ? void 0 : a.itemId };
    return this.validateSourcePlan(e, t, { source: n }), n;
  }
  validateSourcePlan(e, t, n) {
    var r, c, l, u, d;
    const a = (r = n.source) == null ? void 0 : r.itemId, o = (c = e.actor) == null ? void 0 : c.items.get(a);
    if (e.actorLink || !t.wholeItem || a !== ((l = t.source) == null ? void 0 : l.itemId) || ((u = t.source) == null ? void 0 : u.ruleKey) !== `${e.actorId ?? ((d = e.actor) == null ? void 0 : d.id) ?? ""}:${a}` || !this.eligible(o) || ee(this.snapshot(o)) !== ee(t.data))
      throw new m("SourceChanged");
  }
  async removeSource(e, t, n) {
    var o, r, c;
    await we(e);
    const a = (o = n.source) == null ? void 0 : o.itemId;
    if (!a || !t.wholeItem || ((r = t.source) == null ? void 0 : r.ruleKey) !== `${e.actorId ?? ((c = e.actor) == null ? void 0 : c.id) ?? ""}:${a}`)
      throw new m("RecoveryRequired");
    if (e.actor.items.get(a) && (this.validateSourcePlan(e, t, n), await e.actor.deleteEmbeddedDocuments("Item", [a]), e.actor.items.get(a)))
      throw new m("SourceChanged");
  }
}
const B = new qt();
class te extends et {
  constructor() {
    super(...arguments);
    S(this, "acceptsLegacyWholeItems", !0);
    S(this, "balanceCurrency", null);
  }
  currencyEntries(e) {
    var t;
    return ((t = this.balanceCurrency) == null ? void 0 : t.entries(e)) ?? [];
  }
  eligible(e) {
    const t = H(e);
    return this.allowsStoredItem(e) && Number.isSafeInteger(t) && t > 0;
  }
  snapshot(e) {
    return this.carriedData($e(e));
  }
  carriedData(e) {
    return e;
  }
  preview(e) {
    return O(e.data);
  }
  received(e, t, n) {
    return t.wholeItem ? B.received(e, t, n) : super.received(e, t, n);
  }
  async create(e, t, n, a) {
    return t.wholeItem ? B.create(e, { ...t, data: this.carriedData(O(t.data)) }, n, a) : super.create(e, t, n, a);
  }
  async sourceClaim(e, t) {
    var n, a;
    if (this.acceptsLegacyWholeItems && ((n = t.currency) == null ? void 0 : n.storage) !== "balance" && !this.eligible(t.data))
      throw new m("SourceChanged");
    if (!t.wholeItem) return super.sourceClaim(e, t);
    if (!this.eligible(e.actor.items.get((a = t.source) == null ? void 0 : a.itemId))) throw new m("SourceChanged");
    return B.sourceClaim(e, t);
  }
  validateSourcePlan(e, t, n) {
    var a;
    if (!t.wholeItem) return super.validateSourcePlan(e, t, n);
    if (!this.eligible(e.actor.items.get((a = n.source) == null ? void 0 : a.itemId))) throw new m("SourceChanged");
    return B.validateSourcePlan(e, t, n);
  }
  async removeSource(e, t, n) {
    return t.wholeItem ? B.removeSource(e, t, n) : super.removeSource(e, t, n);
  }
}
class tt extends te {
  allowsStoredItem(i) {
    var t;
    return ["ammo", "armor", "backpack", "book", "consumable", "equipment", "shield", "treasure", "weapon"].includes(i == null ? void 0 : i.type) && (i.isOfType ? i.isOfType("physical") : !0) && !(i.type === "weapon" && ((t = i.system) == null ? void 0 : t.category) === "unarmed");
  }
  eligible(i) {
    var e;
    return Number.isSafeInteger((e = i == null ? void 0 : i.system) == null ? void 0 : e.quantity) && super.eligible(i);
  }
  carriedData(i) {
    var e, t, n, a;
    return (t = (e = i.flags) == null ? void 0 : e.pf2e) == null || delete t.grantedBy, (a = (n = i.flags) == null ? void 0 : n.pf2e) == null || delete a.itemGrants, i.system.containerId = null, i.system.description && delete i.system.description.gm, i.system.equipped && (i.system.equipped = { carryType: "stowed", handsHeld: 0, invested: !1 }), i;
  }
  async sourceClaim(i, e) {
    var r;
    const t = await super.sourceClaim(i, e);
    if (((r = e.currency) == null ? void 0 : r.storage) !== "item") return t;
    const n = i.actor.items.get(e.source.itemId), a = this.entryMetadata(n).currency, o = this.entryMetadata(n, e.data.system.quantity).currency;
    if ((o == null ? void 0 : o.unit) !== e.currency.unit || (o == null ? void 0 : o.amount) !== e.currency.amount || !e.source.ruleKey && n.system.quantity !== e.data.system.quantity) throw new m("CurrencyChanged");
    return { ...t, sfCurrency: { unit: a.unit, amount: a.amount } };
  }
  async removeSource(i, e, t) {
    var a, o;
    const n = (a = t.source) != null && a.itemId ? i.actor.items.get(t.source.itemId) : null;
    if (n && t.source.sfCurrency && ((o = n.getFlag) == null ? void 0 : o.call(n, f, "sourceClaim")) !== t.id) {
      const r = this.entryMetadata(n).currency;
      if ((r == null ? void 0 : r.unit) !== t.source.sfCurrency.unit || (r == null ? void 0 : r.amount) !== t.source.sfCurrency.amount) throw new m("CurrencyChanged");
    }
    return super.removeSource(i, e, t);
  }
  preview(i) {
    var n, a, o, r;
    const e = O(i.data);
    if (((n = e.system.identification) == null ? void 0 : n.status) === "identified") return e;
    const t = (a = e.system.identification) == null ? void 0 : a.unidentified;
    return {
      name: (t == null ? void 0 : t.name) || "Unidentified Item",
      img: (t == null ? void 0 : t.img) || e.img,
      type: "equipment",
      system: { quantity: e.system.quantity, description: { value: ((r = (o = t == null ? void 0 : t.data) == null ? void 0 : o.description) == null ? void 0 : r.value) ?? "" } }
    };
  }
}
class Tt extends tt {
  constructor() {
    super(...arguments);
    S(this, "id", "sf2e");
    S(this, "acceptsLegacyWholeItems", !1);
  }
  entryMetadata(e, t = ((n) => (n = e.system) == null ? void 0 : n.quantity)()) {
    var c, l, u, d;
    const a = e.isCurrency ? e.unit : null, o = a ? e.assetValue : null, r = t === ((c = e.system) == null ? void 0 : c.quantity) ? o == null ? void 0 : o[a] : (d = (u = o == null ? void 0 : (l = o.constructor).fromPrice) == null ? void 0 : u.call(l, e.price, t)) == null ? void 0 : d[a];
    return a && Number.isSafeInteger(r) && r > 0 ? { currency: { storage: "item", unit: a, amount: r } } : {};
  }
}
class At extends tt {
  constructor() {
    super(...arguments);
    S(this, "id", "pf2e");
  }
  hitPoints(e) {
    var t, n, a;
    return (t = e.hasCondition) != null && t.call(e, "dying", "unconscious") ? null : e.hitPoints ?? ((a = (n = e.system) == null ? void 0 : n.attributes) == null ? void 0 : a.hp);
  }
  entryMetadata(e, t = ((n) => (n = e.system) == null ? void 0 : n.quantity)()) {
    var l, u;
    const a = e.system;
    if (e.type !== "treasure" || !(e.isCoinage ?? ((a == null ? void 0 : a.stackGroup) === "coins" || (a == null ? void 0 : a.category) === "coin"))) return {};
    const o = ["cp", "sp", "gp", "pp"], r = ((l = e.price) == null ? void 0 : l.value) ?? ((u = a == null ? void 0 : a.price) == null ? void 0 : u.value), c = e.unit ?? o.find((d) => (r == null ? void 0 : r[d]) === 1);
    return o.includes(c) && Number.isSafeInteger(t) && t > 0 ? { currency: { storage: "item", unit: c, amount: t } } : {};
  }
}
class Ft extends te {
  constructor() {
    super(...arguments);
    S(this, "id", "swade");
    S(this, "balanceCurrency", Rt);
    S(this, "currencySnapshotVersion", 2);
  }
  allowsStoredItem(e) {
    var t;
    return ["weapon", "armor", "shield", "gear", "consumable"].includes(e == null ? void 0 : e.type) && e.isPhysicalItem !== !1 && !e.grantedBy && !((t = e.system) != null && t.isNaturalArmor);
  }
  eligible(e) {
    var t;
    return Number.isSafeInteger((t = e == null ? void 0 : e.system) == null ? void 0 : t.quantity) && super.eligible(e);
  }
  carriedData(e) {
    var t, n;
    return "equipStatus" in e.system && (e.system.equipStatus = 1), (n = (t = e.flags) == null ? void 0 : t.swade) == null || delete n.hasGranted, e;
  }
}
class Mt extends te {
  constructor() {
    super(...arguments);
    S(this, "id", "dragonbane");
    S(this, "balanceCurrency", Lt);
    S(this, "currencySnapshotVersion", 2);
  }
  sourceActor(e) {
    return ["npc", "monster"].includes(e.type);
  }
  hitPoints(e) {
    var t;
    return (t = e.system) == null ? void 0 : t.hitPoints;
  }
  allowsStoredItem(e) {
    var t, n;
    return ["armor", "helmet", "item", "material", "weapon"].includes(e == null ? void 0 : e.type) && !((n = (t = e.system) == null ? void 0 : t.features) != null && n.includes("unarmed"));
  }
  carriedData(e) {
    for (const t of ["worn", "storage", "mainHand", "offHand"])
      t in e.system && (e.system[t] = !1);
    return e;
  }
}
class xt extends te {
  constructor() {
    super(...arguments);
    S(this, "id", "wfrp4e");
    S(this, "coinWrites", new de());
  }
  coinValue(e) {
    var n, a;
    const t = (a = (n = e == null ? void 0 : e.system) == null ? void 0 : n.coinValue) == null ? void 0 : a.value;
    return (e == null ? void 0 : e.type) === "money" && Number.isSafeInteger(t) && t > 0 ? t : null;
  }
  coinReceipt(e, t) {
    return Array.from(e.items.values()).find((n) => {
      var a;
      return n.type === "money" && ((a = n.getFlag(f, "coinReceipts")) == null ? void 0 : a[t.id]) === !0;
    });
  }
  received(e, t, n) {
    var a;
    return super.received(e, t, n) || ((a = t.data) == null ? void 0 : a.type) === "money" && !!this.coinReceipt(e, n);
  }
  async create(e, t, n, a) {
    const o = this.coinValue(t.data);
    return o === null ? super.create(e, t, n, a) : this.coinWrites.run(N(e), async () => {
      if (this.received(e, t, n)) return;
      if (n.itemAttempted) throw new m("RecoveryRequired");
      const r = Array.from(e.items.values()).find((u) => this.coinValue(u) === o);
      if (!r) return super.create(e, t, n, a);
      const c = H(t.data);
      if (!Number.isSafeInteger(c) || c <= 0 || !a) throw new m("TransferFailed");
      await a();
      const l = H(r) + c;
      if (!e.items.has(r.id) || !Number.isSafeInteger(l)) throw new m("TransferFailed");
      if (await r.update({ [He(r)]: l, [`flags.${f}.coinReceipts.${n.id}`]: !0 }), !this.coinReceipt(e, n)) throw new m("TransferFailed");
    });
  }
  async cleanup(e, t, n, a) {
    var o;
    ((o = n.data) == null ? void 0 : o.type) === "money" && await this.coinWrites.run(N(t), async () => {
      const r = this.coinReceipt(t, a);
      try {
        await (r == null ? void 0 : r.update({ [`flags.${f}.coinReceipts.-=${a.id}`]: null }));
      } catch (c) {
        console.warn("HoloSuite Loot | Could not clean committed coin receipt", c);
      }
    });
  }
  sourceActor(e) {
    return ["npc", "creature", "vehicle"].includes(e.type);
  }
  hitPoints(e) {
    var t, n;
    return (n = (t = e.system) == null ? void 0 : t.status) == null ? void 0 : n.wounds;
  }
  allowsStoredItem(e) {
    return ["ammunition", "armour", "cargo", "container", "money", "trapping", "weapon"].includes(e == null ? void 0 : e.type);
  }
  carriedData(e) {
    var t, n;
    return typeof ((t = e.system.equipped) == null ? void 0 : t.value) == "boolean" && (e.system.equipped.value = !1), typeof ((n = e.system.location) == null ? void 0 : n.value) == "string" && (e.system.location.value = ""), e;
  }
}
class Ht extends te {
  constructor() {
    super(...arguments);
    S(this, "id", "starwarsffg");
    S(this, "balanceCurrency", Ct);
    S(this, "currencySnapshotVersion", 2);
  }
  sourceActor(e) {
    return ["minion", "rival", "nemesis", "vehicle", "homestead"].includes(e.type);
  }
  defeated(e) {
    var a, o;
    if ((a = e.statuses) != null && a.has("starwarsffg-defeated")) return !0;
    const t = (o = e.system) == null ? void 0 : o.stats, n = e.type === "vehicle" ? t == null ? void 0 : t.hullTrauma : t == null ? void 0 : t.wounds;
    return Number.isFinite(n == null ? void 0 : n.value) && Number.isFinite(n == null ? void 0 : n.max) && n.max > 0 && n.value > n.max;
  }
  hitPoints() {
    return null;
  }
  received(e, t, n) {
    var a;
    return ((a = t.currency) == null ? void 0 : a.storage) === "balance" ? super.received(e, t, n) : B.received(e, t, n);
  }
  async create(e, t, n, a) {
    var o;
    if (((o = t.currency) == null ? void 0 : o.storage) === "balance") return super.create(e, t, n, a);
    if (!this.received(e, t, n))
      return B.create(e, { ...t, data: this.carriedData(O(t.data)) }, n, a);
  }
  allowsStoredItem(e) {
    return ["armour", "gear", "itemattachment", "weapon"].includes(e == null ? void 0 : e.type);
  }
  carriedData(e) {
    return e.system.equippable && (e.system.equippable.equipped = !1), e;
  }
}
class $t extends te {
  constructor() {
    super(...arguments);
    S(this, "id", "CoC7");
  }
  destination(e) {
    return ["character", "npc"].includes(e.type);
  }
  sourceActor(e) {
    return ["npc", "creature", "container"].includes(e.type);
  }
  hitPoints(e) {
    var t, n;
    return (n = (t = e.system) == null ? void 0 : t.attribs) == null ? void 0 : n.hp;
  }
  allowsStoredItem(e) {
    return ["armor", "book", "item", "weapon"].includes(e == null ? void 0 : e.type);
  }
}
const st = new Map([
  new et(),
  new At(),
  new Tt(),
  new Ft(),
  new Mt(),
  new xt(),
  new Ht(),
  new $t()
].map((s) => [s.id, s]));
function Et(s, i) {
  st.set(s, i);
}
function Nt(s) {
  return st.get(s) ?? B;
}
function Ve(s) {
  if (!s.claim.quantityRoll) return s;
  const i = O(s.data);
  return Xe(i, s.claim.quantityRoll.quantity), { ...s, data: i };
}
class Ot {
  constructor(i) {
    S(this, "queue", new de());
    this.io = i;
  }
  async collected(i, e, t, n) {
    var o, r, c, l;
    const a = Ve(t);
    if (t.claim.quantityRoll) {
      try {
        await ((r = (o = this.io).quantityRolled) == null ? void 0 : r.call(o, a, n));
      } catch (u) {
        console.warn("HoloSuite Loot | Could not post quantity roll", u);
      }
      if (!t.claim.quantityRoll.quantity) return;
    }
    try {
      await ((l = (c = this.io).collected) == null ? void 0 : l.call(c, { token: i, actor: e, entry: a, adapter: n }));
    } catch (u) {
      console.warn("HoloSuite Loot | Could not post loot to chat", u);
    }
  }
  async execute(i, e) {
    if (!pe(i)) throw new m("InvalidRequest");
    return this.queue.run(i.tokenUuid, async () => {
      var v, b, p, I, g, C, L, q, h, R;
      const t = this.io, n = await t.token(i.tokenUuid);
      if (!n) throw new m("Unavailable");
      const a = (w, y = t.environment()) => {
        if (!t.authority()) throw new m("NoGM");
        St(n, e, y, w);
      }, o = t.environment();
      if (a(void 0, o), !e.isGM && o.inRange && (i.action === "view" || i.action === "inspect")) {
        const w = await ((v = t.destination) == null ? void 0 : v.call(t, { ...i, actorId: void 0 }, e, n));
        w && a(w);
      }
      const r = t.adapter();
      if (!r) throw new m("Unsupported");
      let c = await t.load(n, r);
      for (const w of c.entries.filter((y) => y.claim && !y.taken)) {
        a();
        const y = await t.actor(w.claim.actorId);
        if (!y) throw new m("RecoveryRequired");
        if (((b = w.claim.quantityRoll) == null ? void 0 : b.quantity) === 0 || (r.received ? r.received(y, w, w.claim) : ((p = y.items.get(w.claim.itemId)) == null ? void 0 : p.getFlag(t.moduleId, "claim")) === w.claim.id)) {
          await ((I = r.removeSource) == null ? void 0 : I.call(r, n, w, w.claim));
          const T = O(c);
          T.entries.find(($) => $.id === w.id).taken = !0, await t.save(n, T), c = T, await this.collected(n, y, w, r), await ((g = r.cleanup) == null ? void 0 : g.call(r, n, y, w, w.claim));
        }
      }
      if (i.action === "view") return t.summary(n, c);
      if (i.action === "inspect") {
        const w = c.entries.find((y) => y.id === i.entryId && !y.taken && !y.hidden);
        if (!w || w.currency) throw new m("Unavailable");
        return { item: r.preview ? r.preview(w) : O(w.data) };
      }
      const l = t.destination ? await t.destination(i, e, n) : await t.actor(i.actorId);
      Ge(l, e, r, n), a(l);
      const u = c.entries.filter((w) => !w.taken && !w.hidden && (i.action === "all" || w.id === i.entryId));
      if (!u.length && i.action === "take") return t.summary(n, c);
      const d = [];
      for (const w of u)
        try {
          a(l), Ge(l, e, r, n);
          let y = c.entries.find((T) => T.id === w.id);
          if (y.claim && (y.claim.userId !== e.id || ![l.id, N(l)].includes(y.claim.actorId)))
            throw new m("RecoveryRequired");
          if (!y.claim) {
            const T = await ((C = r.sourceClaim) == null ? void 0 : C.call(r, n, y));
            a(l);
            let $;
            if (y.formula) {
              if (!T || !r.removeSource) throw new m("SourceChanged");
              $ = await t.rollQuantity(y.formula), a(l);
            }
            const V = O(c);
            V.entries.find((z) => z.id === y.id).claim = {
              id: t.id(),
              itemId: t.id(),
              userId: e.id,
              actorId: N(l),
              ...$ ? { quantityRoll: $ } : {},
              ...T ? { source: T } : {}
            }, await t.save(n, V), c = V, y = c.entries.find((z) => z.id === w.id);
          }
          a(l), (L = r.validateSourcePlan) == null || L.call(r, n, y, y.claim), ((q = y.claim.quantityRoll) == null ? void 0 : q.quantity) !== 0 && await r.create(l, Ve(y), y.claim, async () => {
            var V;
            const T = ((V = y.currency) == null ? void 0 : V.storage) === "balance" ? "currencyAttempted" : "itemAttempted", $ = O(c);
            $.entries.find((z) => z.id === y.id).claim[T] = !0, await t.save(n, $), c = $, y.claim[T] = !0;
          }), await ((h = r.removeSource) == null ? void 0 : h.call(r, n, y, y.claim));
          const A = O(c);
          A.entries.find((T) => T.id === y.id).taken = !0, await t.save(n, A), c = A, await this.collected(n, l, y, r), await ((R = r.cleanup) == null ? void 0 : R.call(r, n, l, y, y.claim));
        } catch (y) {
          if (d.push({ name: w.data.name, code: y.code ?? "TransferFailed" }), !t.authority()) break;
        }
      return { ...t.summary(n, c), failures: d };
    });
  }
}
const ve = "inventoryRules";
function Dt(s) {
  var e, t, n, a, o;
  const i = /^(?:Item\.[\w-]+|Compendium\.[\w-]+\.[\w-]+\.(?:Item\.)?[\w-]+)$/;
  return (o = [(e = s._stats) == null ? void 0 : e.compendiumSource, (t = s._stats) == null ? void 0 : t.duplicateSource, (a = (n = s.flags) == null ? void 0 : n.core) == null ? void 0 : a.sourceId].find((r) => typeof r == "string" && i.test(r))) == null ? void 0 : o.replace(/^(Compendium\.[^.]+\.[^.]+)\.(?!Item\.)/, "$1.Item.");
}
function j(s, i, e) {
  var t;
  if (i.balance) {
    const n = i.id;
    return { token: n, actor: e != null && e.id ? `${e.id}:${n}` : void 0 };
  }
  return {
    token: i.id ? `${s.actorId ?? ((t = s.actor) == null ? void 0 : t.id) ?? ""}:${i.id}` : void 0,
    actor: e != null && e.id && e.items.get(i.id) ? `${e.id}:${i.id}` : void 0,
    global: Dt(i)
  };
}
function k(s, i, e) {
  var t;
  for (const n of ["token", "actor", "global"]) {
    const a = s[n] && ((t = n === "token" ? i : e[n]) == null ? void 0 : t[s[n]]);
    if (a) return { rule: a, scope: n };
  }
  return { rule: { mode: "allow" }, scope: "default" };
}
function Ce(s, i = "") {
  if (s === "inherit") return null;
  if (s === "allow" || s === "never") return { mode: s };
  if (s !== "quantity" || typeof i != "string" || i.length > 40) throw new m("InvalidRule");
  const e = i.trim().toLowerCase().replace(/\s+/g, "");
  if (/^\d+$/.test(e) && Number.isSafeInteger(Number(e))) return { mode: s, quantity: String(Number(e)) };
  const t = /^(\d{0,3})d([1-9]\d{0,4})(?:[+-]\d{1,6})?$/.exec(e);
  if (t && (t[1] === "" || Number(t[1]) > 0)) return { mode: s, quantity: t[1] ? e : `1${e}` };
  throw new m("InvalidRule");
}
async function Pt(s, i, e) {
  if (s.mode === "never") return 0;
  if (s.mode === "allow") return i;
  const { quantity: t } = Ce(s.mode, s.quantity), n = /^\d+$/.test(t) ? Number(t) : await e(t);
  if (!Number.isSafeInteger(n)) throw new m("InvalidRule");
  return Math.min(i, Math.max(0, n));
}
const it = (s) => (s == null ? void 0 : s.mode) === "quantity" && !/^\d+$/.test(s.quantity);
function je(s, i, e) {
  const t = { ...s };
  for (const n of i)
    e ? t[n] = e : delete t[n];
  return t;
}
function Ee() {
  return game.users.contents.filter((s) => {
    var i;
    return s.active && s.isGM && ((i = s.getFlag) == null ? void 0 : i.call(s, f, "transportVersion")) === ye;
  }).sort((s, i) => s.id.localeCompare(i.id))[0];
}
const D = () => {
  var s;
  return ((s = Ee()) == null ? void 0 : s.id) === game.user.id;
}, nt = "lootRange", at = 15;
function Ne() {
  const s = game.settings.get(f, nt);
  return Number.isFinite(s) ? Math.max(0, s) : at;
}
function Ut(s, i, e) {
  var t, n, a;
  return ((t = s.getCenterPoint) == null ? void 0 : t.call(s, e)) ?? ((a = (n = s.object) == null ? void 0 : n.getCenterPoint) == null ? void 0 : a.call(n, e)) ?? {
    x: e.x + s.width * (i.sizeX ?? i.size) / 2,
    y: e.y + s.height * (i.sizeY ?? i.size) / 2
  };
}
function ze(s, i) {
  var o;
  const { x: e, y: t } = s._source ?? s, n = { x: e, y: t };
  if (i.isSquare && i.getOffsetRange) {
    const r = s.width * i.size, c = s.height * i.size, [l, u, d, v] = i.getOffsetRange({ ...n, width: r, height: c }), b = [];
    for (let p = l; p < d; p++)
      for (let I = u; I < v; I++) b.push(i.getCenterPoint({ i: p, j: I }));
    if (b.length) return b;
  }
  const a = (o = s.getOccupiedGridSpaceOffsets) == null ? void 0 : o.call(s, { ...n, level: null });
  return a != null && a.length ? a.map(({ i: r, j: c }) => i.getCenterPoint({ i: r, j: c })) : [Ut(s, i, n)];
}
function Gt(s, i, e, t, n) {
  var u;
  const a = s.parent, o = a == null ? void 0 : a.grid;
  if (!(o != null && o.measurePath)) return !1;
  const r = (u = o.units) == null ? void 0 : u.trim().toLowerCase().replace(/\.$/, ""), c = /^(m|meters?|metres?)$/.test(r ?? "") ? t * 0.3048 : /^(yd|yards?)$/.test(r ?? "") ? t / 3 : t, l = ze(s, o);
  return Array.from(a.tokens ?? []).some((d) => {
    const v = d.actor;
    return d.id === s.id || d.hidden || !J(v, i, e, s) || n && N(v) !== N(n) ? !1 : ze(d, o).some(({ x: b, y: p }) => l.some((I) => o.measurePath([{ x: b, y: p }, { x: I.x, y: I.y }]).distance <= c + 1e-8));
  });
}
function _t(s, i) {
  var a, o;
  const e = s.parent;
  if (((a = canvas.scene) == null ? void 0 : a.id) !== e.id) return !1;
  if (!e.tokenVision) return !0;
  const t = s.object;
  if (!t) return !1;
  const n = globalThis.CONFIG;
  return (o = s.hasStatusEffect) != null && o.call(s, n.specialStatusEffects.INVISIBLE) ? !1 : canvas.tokens.placeables.some((r) => {
    var l, u, d, v, b, p, I, g, C, L, q, h, R, w;
    if (r.document.hidden || !((l = r.document.sight) != null && l.enabled) || !((u = r.actor) != null && u.testUserPermission(i, "OWNER")) || (v = (d = r.document).hasStatusEffect) != null && v.call(d, n.specialStatusEffects.BLIND)) return !1;
    let c;
    try {
      const y = r.document.sight, A = ((p = (b = r.document).getVisionOrigin) == null ? void 0 : p.call(b)) ?? { ...r.center, elevation: r.document.elevation };
      if (c = new n.Canvas.visionSourceClass({ object: r, sourceId: `hololoot-${i.id}-${r.id}` }), c.initialize({
        x: A.x,
        y: A.y,
        elevation: A.elevation,
        ...r.document.level != null ? { level: r.document.level } : {},
        rotation: r.document.rotation,
        radius: r.sightRange,
        lightRadius: r.lightPerceptionRange ?? canvas.dimensions.maxR,
        externalRadius: r.externalRadius,
        angle: y.angle,
        visionMode: y.visionMode,
        color: y.color,
        contrast: y.contrast,
        saturation: y.saturation,
        brightness: y.brightness,
        attenuation: y.attenuation
      }), c.isBlinded || !((I = c.los) != null && I.contains(t.center.x, t.center.y))) return !1;
      if ((g = c.shape) != null && g.contains(t.center.x, t.center.y)) return !0;
      const T = (C = canvas.environment) == null ? void 0 : C.globalLightSource;
      return (T ? T.active && ((L = T.shape) == null ? void 0 : L.contains(t.center.x, t.center.y)) : e.globalLight && (e.globalLightThreshold == null || e.darkness <= e.globalLightThreshold)) && ((q = c.light) != null && q.contains(t.center.x, t.center.y)) ? !0 : !!((h = c.light) != null && h.contains(t.center.x, t.center.y)) && !!((w = (R = canvas.effects) == null ? void 0 : R.lightSources) != null && w.some((V) => {
        var z;
        return V.active && ((z = V.shape) == null ? void 0 : z.contains(t.center.x, t.center.y));
      }));
    } catch {
      return !1;
    } finally {
      c == null || c.destroy();
    }
  });
}
function Vt(s) {
  var t, n, a;
  const i = game.settings.get(f, "zeroHP"), e = s ? Ne() : 0;
  return {
    combats: game.combats.contents,
    automatic: i,
    zeroHP: i,
    manual: !!(s != null && s.manual),
    visible: _t,
    sourceActor: (t = s == null ? void 0 : s.sourceActor) == null ? void 0 : t.bind(s),
    hitPoints: (n = s == null ? void 0 : s.hitPoints) == null ? void 0 : n.bind(s),
    defeated: (a = s == null ? void 0 : s.defeated) == null ? void 0 : a.bind(s),
    inRange: e > 0 ? (o, r, c) => Gt(o, r, s, e, c) : void 0
  };
}
const jt = new de(), Le = (s) => game.journal.find((i) => i.getFlag(f, "tokenUuid") === s.uuid && i.getFlag(f, "kind") === "snapshot"), re = () => game.settings.get(f, ve) ?? {}, oe = (s) => {
  var i;
  return (i = game.actors) == null ? void 0 : i.get(s.actorId);
}, rt = async (s) => {
  var e, t;
  const i = ((t = (e = globalThis.foundry) == null ? void 0 : e.dice) == null ? void 0 : t.Roll) ?? globalThis.Roll;
  return new i(s).evaluate({ allowInteractive: !1 });
}, ce = (s, i) => {
  var e, t;
  return ((t = (e = s.actor) == null ? void 0 : e.items) == null ? void 0 : t.filter((n) => i.eligible(n))) ?? [];
}, be = (s, i) => {
  var e;
  return (((e = i.currencyEntries) == null ? void 0 : e.call(i, s.actor)) ?? []).map((t) => ({
    ...t.data,
    id: `currency:${t.currency.unit}`,
    balance: t
  }));
}, Me = (s) => Z(s).source === "custom", Se = (s) => JSON.parse((s == null ? void 0 : s.getFlag(f, "rules")) ?? "{}"), _ = (s) => `flags.${f}.${s}`, Ie = ({ id: s, hidden: i }) => ({ id: s, taken: !1, ...i ? { hidden: !0 } : {} }), ot = (s) => s.mode === "quantity" ? s.quantity : s.mode, X = (s, i) => s.setFlag(f, "state", {
  ...i,
  entries: i.entries.map((e) => {
    var a;
    if (!((a = e.claim) != null && a.quantityRoll)) return e;
    const { quantityRoll: t, ...n } = e.claim;
    return { ...e, claim: n };
  })
}), ct = (s, i, e) => {
  var t, n, a;
  return it(e) && ((t = s.system) == null ? void 0 : t.quantity) != null && i.sourceClaim && i.removeSource && !s.balance && !((a = (n = i.entryMetadata) == null ? void 0 : n.call(i, s)) != null && a.currency);
};
async function zt(s) {
  const i = Ce("quantity", s);
  if (!it(i)) throw new m("InvalidRule");
  const e = await rt(i.quantity);
  if (!Number.isSafeInteger(e.total)) throw new m("InvalidRule");
  return { quantity: Math.max(0, e.total), roll: e.toJSON() };
}
function ut(s, i, e) {
  const t = ee(e), n = s.filter((a) => ee(i.snapshot(a)) === t);
  return n.length === 1 && n[0].id ? n[0] : void 0;
}
async function ie(s, i, e, t, { original: n, previousRoll: a, legacyRollCeiling: o, onRoll: r } = {}) {
  var I;
  const c = s.balance ? structuredClone(s.balance.data) : i.snapshot(s);
  if (i.manual) return { id: foundry.utils.randomID(), data: c, wholeItem: !0, source: { itemId: s.id, ruleKey: e } };
  const l = n ?? H(c), u = Math.min(l, H(c)), d = a === void 0 && o === void 0 && ct(s, i, t) ? t.quantity : void 0;
  let v, b;
  const p = d ? u : await Pt(t, u, async (g) => {
    if (a === void 0 && o !== void 0)
      return b = o, b;
    if (a !== void 0)
      v = a;
    else {
      const C = await rt(g);
      v = C.total, r == null || r(C);
    }
    return v;
  });
  return Xe(c, p), {
    id: foundry.utils.randomID(),
    data: c,
    originalQuantity: l,
    limit: ot(t),
    hidden: p === 0,
    ...d ? { formula: d } : {},
    ...v === void 0 ? {} : { rolledQuantity: v },
    ...b === void 0 ? {} : { rollCeiling: b },
    ...s.balance ? { currency: { ...s.balance.currency, amount: p } } : { ...s.id ? { source: { itemId: s.id, ruleKey: e } } : {}, ...(I = i.entryMetadata) == null ? void 0 : I.call(i, s, p) }
  };
}
function lt(s, i) {
  var u, d, v;
  const e = Le(s), t = e == null ? void 0 : e.getFlag(f, "state"), n = e == null ? void 0 : e.getFlag(f, "items"), a = new Map(Array.isArray(n) ? n.map((b) => [b.id, b]) : []), o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), c = [...ce(s, i), ...be(s, i)], l = i.snapshot && !Me(s) && !((u = s.getFlag(f, "config")) != null && u.customId);
  for (const b of (t == null ? void 0 : t.entries) ?? []) {
    const p = a.get(b.id);
    if (((d = p == null ? void 0 : p.currency) == null ? void 0 : d.storage) === "balance")
      o.set(`currency:${p.currency.unit}`, { ...p, ...b });
    else if ((v = p == null ? void 0 : p.source) != null && v.ruleKey)
      o.set(p.source.ruleKey, { ...p, ...b });
    else if (l && (p != null && p.data) && !p.currency && !p.source) {
      const I = ut(c.filter((C) => !C.balance), i, p.data);
      if (!I) continue;
      const g = j(s, I).token;
      r.set(g, r.has(g) ? null : { ...p, ...b });
    }
  }
  for (const [b, p] of r) p && !o.has(b) && o.set(b, p);
  return {
    vault: e,
    state: t,
    byId: a,
    byKey: o,
    items: c,
    corpse: Se(e),
    shared: re(),
    locked: Me(s) || !t && (s.getFlag(f, "state") || e && !e.getFlag(f, "draft"))
  };
}
function Bt(s, i) {
  const { state: e, byKey: t, items: n, corpse: a, shared: o, locked: r } = lt(s, i), c = oe(s);
  return n.map((l) => {
    var b, p;
    const u = j(s, l, c), d = t.get(u.token), v = r ? "RuleLocked" : !u.token || e && !d ? "RuleMissingSnapshot" : d != null && d.taken ? "RuleCollected" : d != null && d.claim ? "RuleReserved" : "";
    return {
      id: l.id,
      name: l.name,
      img: l.img,
      quantity: H(l),
      entry: d,
      effective: k(u, a, o),
      overrides: { token: a[u.token], actor: (b = o.actor) == null ? void 0 : b[u.actor], global: (p = o.global) == null ? void 0 : p[u.global] },
      canToken: !v,
      tokenUnavailable: v,
      canActor: !!u.actor,
      canGlobal: !!u.global
    };
  });
}
async function Kt(s, i, e, t, n) {
  if (!D()) throw new m("RuleGM");
  const { vault: a, state: o, byId: r, byKey: c, items: l, corpse: u, shared: d, locked: v } = lt(s, i), b = oe(s), p = l.filter((h) => t.includes(h.id)).map((h) => ({ item: h, key: j(s, h, b)[e] }));
  if (!t.length || p.length !== t.length || p.some(({ key: h }) => !h)) throw new m("RuleScopeUnavailable");
  const I = p.map(({ key: h }) => h);
  if (e === "actor" || e === "global")
    return jt.run(ve, async () => {
      if (!D()) throw new m("RuleGM");
      const h = re(), R = { ...h, [e]: je(h[e], I, e === "global" && (n == null ? void 0 : n.mode) === "allow" ? null : n) };
      await game.settings.set(f, ve, R);
    });
  if (e !== "token" || v) throw new m("RuleScopeUnavailable");
  if (o && I.some((h) => {
    const R = c.get(h);
    return !R || R.taken || R.claim;
  })) throw new m("RuleScopeUnavailable");
  const g = je(u, I, n);
  if (!a) {
    Object.keys(g).length && await dt(s, [], { rules: JSON.stringify(g), draft: !0 });
    return;
  }
  if (!o) {
    await a.setFlag(f, "rules", JSON.stringify(g));
    return;
  }
  const C = /* @__PURE__ */ new Map(), L = [];
  for (const { item: h, key: R } of p) {
    const w = c.get(R), y = k(j(s, h, b), g, d).rule;
    if (w.limit !== ot(y) || !w.formula && ct(h, i, y)) {
      let A;
      const T = await ie(h, i, R, y, {
        original: w.originalQuantity ?? H(w.data),
        onRoll: ($) => {
          A = $;
        }
      });
      C.set(w.id, T), A && L.push({ roll: A, itemName: h.name, quantity: H(T.data) });
    }
  }
  if (!D()) throw new m("RuleGM");
  const q = {
    ...o,
    vaultId: a.id,
    entries: o.entries.map((h) => C.has(h.id) ? Ie(C.get(h.id)) : h)
  };
  return await a.update({
    [_("rules")]: JSON.stringify(g),
    [_("state")]: q,
    [_("items")]: Array.from(r.values(), (h) => C.get(h.id) ?? h)
  }), await X(s, q), L;
}
async function dt(s, i, e) {
  var a, o;
  const n = await (((o = (a = globalThis.foundry) == null ? void 0 : a.documents) == null ? void 0 : o.JournalEntry) ?? globalThis.JournalEntry).create({
    name: `HoloLoot · ${s.name}`,
    ownership: { default: 0 },
    flags: { [f]: { tokenUuid: s.uuid, kind: "snapshot", items: structuredClone(i), ...e } }
  });
  if (!n) throw new m("PersistenceFailed");
  return n.id;
}
function ge(s, i, e) {
  const t = game.journal.get(s);
  if (!t || t.getFlag(f, "tokenUuid") !== i.uuid || t.getFlag(f, "kind") !== e) throw new m("RecoveryRequired");
  const n = t.getFlag(f, "items");
  if (!Array.isArray(n)) throw new m("RecoveryRequired");
  return structuredClone(n);
}
function ft(s, i) {
  const e = Z(s);
  return !!(s.actor && (i.manual || e.source !== "custom" && !e.customId) && i.sourceClaim && i.removeSource);
}
function Wt(s, i) {
  var o;
  const e = Le(s), t = new Set((o = e == null ? void 0 : e.getFlag(f, "state")) == null ? void 0 : o.entries.filter((r) => !r.taken).map((r) => r.id)), n = e == null ? void 0 : e.getFlag(f, "items"), a = new Set((Array.isArray(n) ? n : []).filter((r) => r.wholeItem && t.has(r.id)).map((r) => {
    var c;
    return (c = r.source) == null ? void 0 : c.ruleKey;
  }));
  return ce(s, i).map((r) => ({
    id: r.id,
    name: r.name,
    img: r.img,
    selected: a.has(j(s, r, null).token)
  }));
}
async function Qt(s, i, e, t) {
  if (!D()) throw new m("RuleGM");
  if (!i.manual || !["enabled", "disabled"].includes(e)) throw new m("InvalidRequest");
  await ht(s, i, { mode: e, ids: new Set(t) }), await s.setFlag(f, "config", { mode: e, source: "inventory" });
}
async function ht(s, i, e) {
  var L, q;
  if (!D()) throw new m("RuleGM");
  if (!ft(s, i) || i.manual && !e) throw new m("RefreshUnsupported");
  const t = Le(s), n = t == null ? void 0 : t.getFlag(f, "state");
  if (!n) {
    await Oe(s, i, e);
    return;
  }
  if (n.version !== 1) throw new m("RecoveryRequired");
  const a = n.entries.filter((h) => h.claim || h.taken), o = (h) => {
    var R, w, y, A;
    return ((w = (R = h.claim) == null ? void 0 : R.source) == null ? void 0 : w.itemId) || ((A = (y = h.claim) == null ? void 0 : y.source) == null ? void 0 : A.currency) && `currency:${h.claim.source.currency}`;
  };
  if (a.length && s.actorLink || a.some((h) => !o(h)))
    throw new m("RefreshUntracked");
  const r = new Set(a.filter((h) => !h.taken).map(o)), c = ge(t.id, s, "snapshot"), l = new Map(c.map((h) => [h.id, h]));
  if (a.some((h) => !h.taken && !l.has(h.id))) throw new m("RecoveryRequired");
  const u = /* @__PURE__ */ new Map();
  for (const h of n.entries) {
    const R = l.get(h.id), w = ((L = R == null ? void 0 : R.source) == null ? void 0 : L.ruleKey) || ((q = R == null ? void 0 : R.currency) == null ? void 0 : q.storage) === "balance" && `currency:${R.currency.unit}`;
    w && u.set(w, { saved: R, taken: h.taken });
  }
  const d = (h, R) => (R && !R.taken && ee({ ...h, id: R.saved.id }) === ee(R.saved) && (h.id = R.saved.id), h), v = oe(s), b = Se(t), p = re(), I = [];
  for (const h of [...ce(s, i), ...be(s, i)]) {
    if (r.has(h.id) || i.manual && !(e != null && e.ids.has(h.id))) continue;
    const R = j(s, h, v), w = u.get(R.token), y = w == null ? void 0 : w.saved.limit, A = y === void 0 ? k(R, b, p).rule : Ce(y === "allow" || y === "never" ? y : "quantity", y), T = w == null ? void 0 : w.saved.rolledQuantity, $ = y === void 0 || w.saved.formula ? void 0 : w.saved.rollCeiling ?? H(w.saved.data);
    I.push(d(await ie(h, i, R.token, A, { previousRoll: T, legacyRollCeiling: $ }), w));
  }
  if (!D()) throw new m("RuleGM");
  const g = {
    ...n,
    vaultId: t.id,
    currencyReady: i.currencySnapshotVersion ?? !0,
    entries: [...a, ...I.map(Ie)]
  }, C = a.flatMap((h) => l.has(h.id) ? [l.get(h.id)] : []);
  await t.update({
    [_("state")]: g,
    [_("items")]: [...C, ...I],
    ...e ? { [_("manualMode")]: e.mode } : {}
  }), await X(s, g);
}
async function Oe(s, i, e) {
  const t = Le(s);
  if (i.manual && !e && (t == null ? void 0 : t.getFlag(f, "manualMode")) !== "enabled") throw new m("Unavailable");
  let n = t == null ? void 0 : t.getFlag(f, "state");
  if (!n && (s.getFlag(f, "state") || t && !t.getFlag(f, "draft")))
    throw new m("RecoveryRequired");
  if (!n) {
    const c = Z(s), l = re(), u = Se(t), d = oe(s), v = [];
    if (!i.manual && Me(s)) {
      const I = c.customId ? ge(c.customId, s, "custom") : [];
      v.push(...I.map((g) => ({ id: foundry.utils.randomID(), data: g })));
    } else
      for (const I of ce(s, i)) {
        if (i.manual && !(e != null && e.ids.has(I.id))) continue;
        const g = j(s, I, d), { rule: C } = k(g, u, l);
        v.push(await ie(I, i, g.token, C));
      }
    for (const I of be(s, i)) {
      const g = j(s, I, d);
      v.push(await ie(I, i, g.token, k(g, u, l).rule));
    }
    const b = { version: 1, currencyReady: i.currencySnapshotVersion ?? !0, entries: v.map(Ie) }, p = t ? t.id : await dt(s, v, { state: b, ...e ? { manualMode: e.mode } : {} });
    n = { ...b, vaultId: p }, t && await t.update({
      [_("items")]: v,
      [_("state")]: n,
      [_("draft")]: !1,
      ...e ? { [_("manualMode")]: e.mode } : {}
    }), await X(s, n);
  }
  if (n.version !== 1) throw new m("RecoveryRequired");
  n = { ...n, vaultId: n.vaultId ?? (t == null ? void 0 : t.id) };
  const a = i.currencySnapshotVersion ?? !0;
  if ((!n.currencyReady || i.currencySnapshotVersion && n.currencyReady !== a) && i.currencyEntries) {
    const c = t ?? game.journal.get(n.vaultId), l = c.getFlag(f, "items"), u = Array.isArray(l) ? structuredClone(l) : n.entries.every((v) => v.taken) ? [] : ge(n.vaultId, s, "snapshot"), d = [];
    for (const v of be(s, i)) {
      const b = j(s, v, oe(s));
      d.push(await ie(v, i, b.token, k(b, Se(c), re()).rule));
    }
    n = { ...n, currencyReady: a, entries: [...n.entries, ...d.map(Ie)] }, d.length ? await c.update({ [`flags.${f}.items`]: [...u, ...d], [`flags.${f}.state`]: n }) : await c.setFlag(f, "state", n), await X(s, n);
  }
  const o = s.getFlag(f, "state");
  if ((!o || i.currencySnapshotVersion && o.currencyReady !== n.currencyReady) && await X(s, n), n.entries.every((c) => c.taken)) return {
    ...n,
    entries: n.entries.map((c) => ({ ...c, data: null }))
  };
  const r = ge(n.vaultId, s, "snapshot");
  return { ...n, entries: n.entries.flatMap((c) => {
    var p, I, g;
    if (c.taken) return [{ ...c, data: null }];
    const l = r.find((C) => C.id === c.id), u = l == null ? void 0 : l.data;
    if (!u || !i.acceptsLegacyWholeItems && !!l.wholeItem != !!i.manual) throw new m("RecoveryRequired");
    let d = l.source;
    const v = i.allowsStoredItem && (d != null && d.itemId) ? (p = s.actor) == null ? void 0 : p.items.get(d.itemId) : null, b = i.allowsStoredItem && ((I = l.currency) == null ? void 0 : I.storage) !== "balance" && (!i.allowsStoredItem(u) || v && !i.allowsStoredItem(v));
    if (b && !c.claim) return [];
    if (!b && !d && !l.currency && !((g = s.getFlag(f, "config")) != null && g.customId) && i.snapshot) {
      const C = ut(ce(s, i), i, u);
      C && (d = { itemId: C.id });
    }
    return [{
      ...c,
      data: u,
      ...b ? { hidden: !0 } : {},
      ...l.wholeItem ? { wholeItem: !0 } : {},
      ...l.formula ? { formula: l.formula } : {},
      ...l.currency ? { currency: l.currency } : {},
      ...d ? { source: d } : {}
    }];
  }) };
}
async function Jt(s, i) {
  const e = {
    version: 1,
    ...i.currencyReady ? { currencyReady: i.currencyReady } : {},
    vaultId: i.vaultId,
    entries: i.entries.map(({ id: n, taken: a, claim: o, hidden: r }) => ({
      id: n,
      taken: !!a,
      ...o ? { claim: o } : {},
      ...r ? { hidden: r } : {}
    }))
  }, t = game.journal.get(i.vaultId);
  if ((t == null ? void 0 : t.getFlag(f, "tokenUuid")) !== s.uuid) throw new m("RecoveryRequired");
  await t.setFlag(f, "state", e), await X(s, e);
}
function kt(s, i) {
  return {
    tokenUuid: s.uuid,
    name: s.name,
    img: s.texture.src,
    entries: i.entries.filter((e) => !e.taken && !e.hidden).map((e) => {
      var c, l, u, d, v, b, p, I, g, C, L, q, h, R, w, y, A, T, $;
      const t = { ...e.data, system: e.data.system ?? {} }, n = t.system.identified === !1 || ((c = t.system.identification) == null ? void 0 : c.status) === "unidentified", a = n ? (l = t.system.unidentified) == null ? void 0 : l.description : typeof t.system.description == "string" ? t.system.description : (u = t.system.description) == null ? void 0 : u.value, o = typeof t.system.rarity == "string" ? t.system.rarity : typeof ((d = t.system.traits) == null ? void 0 : d.rarity) == "string" ? t.system.traits.rarity : "", r = ((p = (b = (v = globalThis.CONFIG) == null ? void 0 : v.DND5E) == null ? void 0 : b.itemRarity) == null ? void 0 : p[o]) ?? ((C = (g = (I = globalThis.CONFIG) == null ? void 0 : I.PF2E) == null ? void 0 : g.rarityTraits) == null ? void 0 : C[o]);
      return {
        id: e.id,
        name: e.currency ? (q = (L = game.i18n).has) != null && q.call(L, `HL.Currency.${e.currency.unit}`) ? game.i18n.localize(`HL.Currency.${e.currency.unit}`) : t.name : n ? ((h = t.system.unidentified) == null ? void 0 : h.name) || ((w = (R = t.system.identification) == null ? void 0 : R.unidentified) == null ? void 0 : w.name) || game.i18n.localize("HL.Unidentified") : t.name,
        currency: !!e.currency,
        img: n && ((A = (y = t.system.identification) == null ? void 0 : y.unidentified) == null ? void 0 : A.img) || t.img,
        quantity: e.wholeItem ? 1 : ((T = e.currency) == null ? void 0 : T.amount) ?? H(t),
        ...e.wholeItem ? { wholeItem: !0 } : {},
        ...e.formula ? { formula: e.formula } : {},
        type: e.currency ? game.i18n.localize("HL.CurrencyLabel") : game.i18n.localize(`TYPES.Item.${t.type}`),
        rarity: n || !o ? "" : game.i18n.localize(typeof r == "string" ? r : o),
        tooltip: (($ = new DOMParser().parseFromString(a ?? "", "text/html").body.textContent) == null ? void 0 : $.slice(0, 1500)) ?? "",
        pending: !!e.claim
      };
    })
  };
}
function Xt(s, i = s) {
  const e = `${i} |`;
  return {
    log: (t, ...n) => console.log(e, t, ...n),
    warn: (t, ...n) => console.warn(e, t, ...n),
    error: (t, ...n) => console.error(e, t, ...n)
  };
}
function Yt(s, i = {}) {
  const e = i.socketName ?? `module.${s}`, t = Xt(s, i.title ?? s);
  return {
    socketName: e,
    emit(n) {
      var o;
      const a = (o = globalThis.game) == null ? void 0 : o.socket;
      return a != null && a.emit ? (a.emit(e, n), !0) : (t.warn("Foundry socket is unavailable.", n), !1);
    },
    isGMSender(n) {
      var a, o, r;
      return n ? !!((r = (o = (a = globalThis.game) == null ? void 0 : a.users) == null ? void 0 : o.get(String(n))) != null && r.isGM) : !1;
    }
  };
}
const Be = Yt(f, { title: "HoloSuite Loot" }), ne = /* @__PURE__ */ new Map(), Zt = new de();
async function es(s, i) {
  game.socket.on(Be.socketName, (e) => {
    (e == null ? void 0 : e.type) === "refresh" && typeof e.tokenUuid == "string" && i(e.tokenUuid);
  }), Hooks.on("updateUser", (e, t, n, a) => {
    var r, c, l;
    if (e.id === game.user.id && ((c = (r = t.flags) == null ? void 0 : r[f]) != null && c[Te])) {
      let u;
      try {
        u = JSON.parse(e.getFlag(f, Te));
      } catch {
        return;
      }
      const d = ne.get(u == null ? void 0 : u.id);
      d && d.gm === a && ((l = game.users.get(a)) != null && l.isGM) && (clearTimeout(d.timer), ne.delete(u.id), u.result.error ? d.reject(new m(u.result.error)) : d.resolve(structuredClone(u.result)));
    }
    const o = bt(e, t, a, ke);
    !o || !D() || typeof o.id != "string" || !/^[\w-]{1,64}$/.test(o.id) || Zt.run(e.id, async () => {
      if (!D()) return;
      let u;
      try {
        if (!pe(o)) throw new m("InvalidRequest");
        u = await s.execute(o, e);
      } catch (d) {
        console.warn("HoloSuite Loot | Request failed", d), u = { error: d.code ?? "TransferFailed" };
      }
      await e.setFlag(f, Te, JSON.stringify({ id: o.id, result: u })), pe(o) && ["take", "all"].includes(o.action) && Be.emit({ type: "refresh", tokenUuid: o.tokenUuid });
    }).catch((u) => console.warn("HoloSuite Loot | Could not deliver reply", u));
  }), game.user.isGM && await game.user.setFlag(f, "transportVersion", ye);
}
async function ts(s, i) {
  if (!pe(s)) throw new m("InvalidRequest");
  const e = Ee();
  if (!e) throw new m(game.users.contents.some((n) => n.active && n.isGM) ? "BuildMismatch" : "NoGM");
  if (e.id === game.user.id && i) return i.execute(s, game.user);
  const t = foundry.utils.randomID();
  return new Promise((n, a) => {
    const o = setTimeout(() => {
      ne.delete(t), a(new m("Timeout"));
    }, s.action === "view" ? 8e3 : 2e4);
    ne.set(t, { resolve: n, reject: a, timer: o, gm: e.id }), game.user.setFlag(f, ke, { ...s, id: t }).catch((r) => {
      clearTimeout(o), ne.delete(t), a(r);
    });
  });
}
function ss() {
  var s, i, e;
  return ((i = (s = globalThis.foundry) == null ? void 0 : s.applications) == null ? void 0 : i.api) ?? ((e = foundry == null ? void 0 : foundry.applications) == null ? void 0 : e.api) ?? null;
}
function is() {
  var s, i, e;
  return ((i = (s = globalThis.foundry) == null ? void 0 : s.appv1) == null ? void 0 : i.api) ?? ((e = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : e.api) ?? null;
}
function ns(s = {}, i = {}) {
  var t, n, a;
  const e = ((n = (t = globalThis.foundry) == null ? void 0 : t.utils) == null ? void 0 : n.mergeObject) ?? ((a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.mergeObject);
  return typeof e == "function" ? e(s, i, { inplace: !1 }) : { ...s, ...i };
}
function as() {
  var s, i, e, t, n;
  return ((e = (i = (s = globalThis.foundry) == null ? void 0 : s.utils) == null ? void 0 : i.randomID) == null ? void 0 : e.call(i, 8)) ?? ((n = (t = foundry == null ? void 0 : foundry.utils) == null ? void 0 : t.randomID) == null ? void 0 : n.call(t, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function Ke(s = {}) {
  return {
    id: String(s.id ?? `legacy-application-${as()}`),
    tag: s.tag ?? "section",
    classes: Array.isArray(s.classes) ? s.classes : [],
    window: {
      title: s.title ?? "",
      icon: s.icon,
      resizable: s.resizable === !0
    },
    position: {
      width: Number(s.width ?? 600),
      height: s.height === "auto" ? "auto" : Number(s.height ?? 600)
    }
  };
}
function rs(s) {
  return class extends s {
    constructor(t = {}) {
      const n = ns(new.target.defaultOptions ?? {}, t);
      super(Ke(n));
      S(this, "_v1Options");
      this._v1Options = n;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return Ke(this.defaultOptions ?? {});
    }
    activateListeners(t) {
    }
    async _renderHTML(t, n) {
      var l, u, d;
      const a = typeof this.getData == "function" ? await this.getData() : {}, o = ((l = this._v1Options) == null ? void 0 : l.template) ?? ((u = this.options) == null ? void 0 : u.template) ?? ((d = this.constructor.defaultOptions) == null ? void 0 : d.template);
      if (!o) return document.createDocumentFragment();
      const r = await globalThis.renderTemplate(o, a), c = document.createElement("template");
      return c.innerHTML = r.trim(), c.content;
    }
    _activateV1Form(t) {
      var a, o;
      if (typeof this._updateObject != "function") return;
      const n = (a = t.matches) != null && a.call(t, "form") ? t : (o = t.querySelector) == null ? void 0 : o.call(t, "form");
      n instanceof HTMLFormElement && n.addEventListener("submit", async (r) => {
        var l;
        r.preventDefault(), r.stopPropagation();
        const c = new FormData(n);
        await this._updateObject(r, c), ((l = this._v1Options) == null ? void 0 : l.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(t, n, a) {
      var u, d, v, b;
      n.replaceChildren(t);
      const o = globalThis.jQuery ?? globalThis.$, r = ((u = n.closest) == null ? void 0 : u.call(n, ".window-app, .app, .application")) ?? n, c = o ? o(r) : r;
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
      Array.isArray(l) && l.length && (n.classList.add(...l), (b = (v = n.closest) == null ? void 0 : v.call(n, ".window-app, .app, .application")) == null || b.classList.add(...l)), this._activateV1Form(n), typeof this.activateListeners == "function" && this.activateListeners(o ? o(n) : n);
    }
  };
}
function os() {
  const s = ss(), i = is(), e = globalThis.Application ?? (i == null ? void 0 : i.Application) ?? (s == null ? void 0 : s.ApplicationV1) ?? globalThis.FormApplication ?? (i == null ? void 0 : i.FormApplication) ?? (s == null ? void 0 : s.FormApplication);
  if (e) return e;
  const t = s == null ? void 0 : s.ApplicationV2;
  return t ? rs(t) : null;
}
class cs {
  constructor(i, e) {
    S(this, "outside", (i) => {
      i.composedPath().includes(this.root) || this.dismiss();
    });
    this.root = i, this.dismiss = e, document.addEventListener("pointerdown", this.outside, !0);
  }
  destroy() {
    document.removeEventListener("pointerdown", this.outside, !0);
  }
}
class us {
  constructor(i, e, t, n) {
    S(this, "frame", 0);
    S(this, "destroyed", !1);
    S(this, "svg");
    S(this, "line");
    S(this, "lastGeometry", "");
    S(this, "outside", (i) => {
      var t, n;
      const e = i.composedPath();
      i.button === 2 && e.includes(((t = canvas.app) == null ? void 0 : t.canvas) ?? ((n = canvas.app) == null ? void 0 : n.view)) || e.includes(this.root) || this.dismiss();
    });
    S(this, "update", () => {
      var t, n;
      if (this.destroyed) return;
      const i = ((t = canvas.app) == null ? void 0 : t.canvas) ?? ((n = canvas.app) == null ? void 0 : n.view), e = this.token.object;
      if (!this.root.isConnected) {
        this.destroy();
        return;
      }
      if (!e || this.token.hidden) {
        this.destroy(), this.dismiss();
        return;
      }
      if (this.root.isConnected && i && canvas.stage) {
        const a = i.getBoundingClientRect(), o = canvas.app.renderer.screen, r = canvas.stage.worldTransform.apply(e.center), c = a.left + r.x * a.width / o.width, l = a.top + r.y * a.height / o.height, u = this.root.getBoundingClientRect(), d = 24 + Math.min(60, (e.w ?? 0) * Math.abs(canvas.stage.worldTransform.a) / 2), v = c + d + u.width <= innerWidth - 8 ? c + d : c - d - u.width, b = Math.max(8, Math.min(innerWidth - u.width - 8, v)), p = Math.max(8, Math.min(innerHeight - u.height - 8, l - u.height / 3));
        (Math.abs(u.left - b) > 0.5 || Math.abs(u.top - p) > 0.5) && this.position(b, p);
        const I = this.root.querySelector(".hl-panel") ?? this.root, g = I.getBoundingClientRect(), C = getComputedStyle(I), L = parseFloat(C.borderLeftWidth) || 3, q = Math.min(parseFloat(C.borderTopLeftRadius) || 0, g.height / 2, g.width / 2), h = c <= g.left || c >= g.right, R = h ? c <= g.left ? g.left + L / 2 : g.right - L / 2 : Math.max(g.left + q, Math.min(g.right - q, c)), w = h ? Math.max(g.top + q, Math.min(g.bottom - q, l)) : l < (g.top + g.bottom) / 2 ? g.top + L / 2 : g.bottom - L / 2, y = `${c},${l},${R},${w}`;
        y !== this.lastGeometry && (this.line.setAttribute("x1", String(c)), this.line.setAttribute("y1", String(l)), this.line.setAttribute("x2", String(R)), this.line.setAttribute("y2", String(w)), this.lastGeometry = y), this.line.style.stroke = C.borderLeftColor, this.line.style.strokeWidth = String(L), this.svg.style.zIndex = String(Math.max(0, (parseInt(getComputedStyle(this.root).zIndex) || 100) - 1));
      }
      this.frame = requestAnimationFrame(this.update);
    });
    this.root = i, this.token = e, this.position = t, this.dismiss = n;
    const a = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(a, "svg"), this.svg.classList.add("hl-loot-tether"), this.svg.setAttribute("aria-hidden", "true"), this.line = document.createElementNS(a, "line"), this.svg.append(this.line), document.body.append(this.svg), document.addEventListener("pointerdown", this.outside, !0), this.frame = requestAnimationFrame(this.update);
  }
  destroy() {
    this.destroyed = !0, cancelAnimationFrame(this.frame), document.removeEventListener("pointerdown", this.outside, !0), this.svg.remove();
  }
}
const W = (s) => String(s ?? "").replace(/[&<>"']/g, (i) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[i]);
async function ls({ roll: s, itemName: i, quantity: e }) {
  var o;
  const { game: t } = globalThis, n = t.i18n.format("HL.QuantityRollChat", { item: W(i), quantity: e }), a = ((o = t.release) == null ? void 0 : o.generation) >= 14 ? { messageMode: "self" } : { rollMode: "selfroll" };
  await s.toMessage({ flavor: n }, a);
}
async function ds(s, i) {
  var d;
  const { game: e, foundry: t, ChatMessage: n } = globalThis, a = s.claim.quantityRoll, o = i.preview ? i.preview(s) : s.data, c = (((d = t == null ? void 0 : t.dice) == null ? void 0 : d.Roll) ?? globalThis.Roll).fromData(a.roll), l = e.i18n.format("HL.PickupRollChat", { item: W(o.name), quantity: a.quantity }), u = await c.toMessage({ flavor: l }, { create: !1 });
  await n.create({ ...u, whisper: [s.claim.userId], blind: !1 });
}
async function fs({ token: s, actor: i, entry: e, adapter: t }) {
  var c;
  const { game: n, ChatMessage: a } = globalThis;
  if (!n.settings.get(f, "chatLog")) return;
  const o = t.preview ? t.preview(e) : e.data, r = n.i18n.format("HL.ChatLooted", {
    actor: W(i.name),
    source: W(s.name),
    item: W(o.name),
    quantity: W(e.wholeItem ? 1 : ((c = e.currency) == null ? void 0 : c.amount) ?? H(o))
  });
  await a.create({
    speaker: a.getSpeaker({ actor: i }),
    content: `<p>${r}</p>`,
    whisper: [],
    blind: !1,
    flags: { [f]: { claimId: e.claim.id, userId: e.claim.userId } }
  });
}
const mt = os(), gt = (s) => `modules/${f}/templates/${s}.hbs`, x = (s) => game.i18n.localize(`HL.${s}`);
function U(s) {
  const i = x((s == null ? void 0 : s.code) ?? "TransferFailed");
  return ui.notifications.warn(i), i;
}
const yt = (s) => s instanceof HTMLElement ? s : s[0];
class hs extends mt {
  constructor(e, t, n) {
    super({ id: `hololoot-${e.id}` });
    S(this, "token");
    S(this, "send");
    S(this, "adapter");
    S(this, "data", { entries: [] });
    S(this, "destination", "");
    S(this, "busy", !1);
    S(this, "message", "");
    S(this, "loading", !1);
    S(this, "firstDraw", null);
    S(this, "resolveFirstDraw", null);
    S(this, "refreshing", null);
    S(this, "refreshAgain", !1);
    S(this, "disposed", !1);
    S(this, "presentation", null);
    this.token = e, this.send = t, this.adapter = n;
    const a = game.user.character;
    J(a, game.user, n, e) && (this.destination = n.manual ? N(a) : a.id);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: "HoloSuite Loot",
      classes: ["holosuite-loot-window", "holosuite-loot-popup"],
      template: gt("loot"),
      width: 340,
      height: "auto",
      resizable: !1
    });
  }
  show(e) {
    return this.firstDraw || (this.firstDraw = new Promise((t) => {
      this.resolveFirstDraw = t;
    }), this.loading = e === void 0, this.loading || (this.data = e), this.render(!0)), this.firstDraw;
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
        } catch (e) {
          if (this.disposed) return;
          if ((e == null ? void 0 : e.code) === "OutOfRange") {
            U(e), await this.close();
            return;
          }
          this.data = { entries: [] }, this.message = U(e);
        }
        this.loading = !1, this.disposed || this.render(!0);
      })().finally(() => {
        this.refreshing = null, this.refreshAgain && !this.disposed && !this.busy && this.refresh();
      }), this.refreshing);
    }
  }
  getData() {
    var c, l;
    const e = game.settings.get(f, "characterSelector"), t = game.settings.get(f, "panelTheme"), n = this.adapter.manual ? [...new Map([...game.actors.contents, ...Array.from(((c = canvas.scene) == null ? void 0 : c.tokens) ?? [], (u) => u.actor)].filter((u) => J(u, game.user, this.adapter, this.token)).map((u) => [N(u), u])).values()] : game.actors.contents.filter((u) => J(u, game.user, this.adapter)), a = (u) => this.adapter.manual ? N(u) : u.id;
    let o = "";
    if (e)
      !this.destination && n.length === 1 && (this.destination = a(n[0]));
    else try {
      this.destination = N(Ye(game.user, game.actors.contents, (l = canvas.scene) == null ? void 0 : l.tokens, this.adapter, this.token));
    } catch (u) {
      this.destination = "", o = x(u.code);
    }
    const r = e ? n.some((u) => a(u) === this.destination) : !!this.destination;
    return {
      ...this.data,
      name: this.data.name ?? this.token.name,
      img: this.data.img ?? this.token.texture.src,
      actors: n.map((u) => ({ id: a(u), name: u.name, selected: a(u) === this.destination })),
      disabled: this.loading || this.busy || !r || !this.data.entries.length,
      loading: this.loading,
      showSelector: e,
      theme: t,
      busy: this.busy,
      message: this.message || o || (!n.length && e ? x("NoActor") : ""),
      empty: !this.loading && !this.data.entries.length && !this.message
    };
  }
  activateListeners(e) {
    var a, o, r;
    if (super.activateListeners(e), this.disposed) return;
    const t = yt(e);
    (a = this.presentation) == null || a.destroy();
    const n = t.closest(".window-app, .application") ?? t.closest(".holosuite-loot-popup") ?? t;
    this.presentation = new us(
      n,
      this.token,
      (c, l) => this.setPosition({ left: c, top: l }),
      () => void this.close()
    ), (o = t.querySelector("select")) == null || o.addEventListener("change", (c) => {
      this.destination = c.target.value, this.render(!0);
    }), t.querySelectorAll("button[data-loot]").forEach((c) => {
      c.addEventListener("click", () => void this.take(c.dataset.loot));
    }), t.querySelectorAll("[data-inspect]").forEach((c) => {
      c.addEventListener("click", () => void this.inspect(c.dataset.inspect));
    }), (r = this.resolveFirstDraw) == null || r.call(this), this.resolveFirstDraw = null;
  }
  async inspect(e) {
    try {
      const n = { ...(await this.send({ action: "inspect", entryId: e, tokenUuid: this.token.uuid })).item, ownership: { default: 0, [game.user.id]: 2 } }, a = globalThis.CONFIG.Item.documentClass;
      new a(n, { temporary: !0 }).sheet.render(!0, { editable: !1 });
    } catch (t) {
      U(t);
    }
  }
  async take(e) {
    if (!this.busy) {
      if (this.getData(), !this.destination) {
        this.message = this.getData().message || x("NoActor"), this.render(!0);
        return;
      }
      this.busy = !0, this.message = "", this.render(!0);
      try {
        this.data = await this.send({
          action: e === "all" ? "all" : "take",
          entryId: e,
          actorId: this.destination,
          tokenUuid: this.token.uuid
        });
        const t = this.data.failures ?? [];
        this.message = t.map((n) => `${n.name}: ${x(n.code)}`).join(" · "), this.message && ui.notifications.warn(this.message);
      } catch (t) {
        this.message = U(t);
      } finally {
        this.busy = !1, this.disposed || (this.render(!0), this.refreshAgain && this.refresh());
      }
    }
  }
  async close(e) {
    var t, n;
    return this.disposed = !0, (t = this.presentation) == null || t.destroy(), this.presentation = null, (n = this.resolveFirstDraw) == null || n.call(this), this.resolveFirstDraw = null, super.close(e);
  }
}
class ms extends mt {
  constructor(e, t, n) {
    super({ id: `hololoot-config-${e.id}` });
    S(this, "token");
    S(this, "adapter");
    S(this, "queue");
    S(this, "config");
    S(this, "scope", "token");
    S(this, "busy", !1);
    S(this, "dismissal", null);
    this.token = e, this.adapter = t, this.queue = n, this.config = structuredClone(Z(e));
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: x("Title"),
      classes: ["holosuite-loot-window", "holosuite-loot-config"],
      template: gt("config"),
      width: 480,
      height: "auto",
      resizable: !1
    });
  }
  getData() {
    const e = !!this.adapter.manual, t = !e && game.settings.get(f, "zeroHP"), n = !t && this.config.mode === "automatic" ? "disabled" : this.config.mode, a = (c) => (c == null ? void 0 : c.quantity) ?? (c ? x(`Rule.${c.mode}`) : ""), o = e ? Wt(this.token, this.adapter) : Bt(this.token, this.adapter).map(({ entry: c, effective: l, overrides: u, ...d }) => ({
      ...d,
      configured: a(l.rule),
      effectiveScope: l.scope,
      tokenRule: a(u.token),
      actorRule: a(u.actor),
      globalRule: a(u.global),
      ruleScope: x(`Scope.${l.scope}`),
      original: (c == null ? void 0 : c.originalQuantity) ?? d.quantity,
      remaining: c ? c.taken ? 0 : c.formula ?? H(c.data) : "—",
      rollResult: !(c != null && c.taken) && Number.isSafeInteger(c == null ? void 0 : c.rolledQuantity) ? game.i18n.format("HL.QuantityRollResult", { roll: c.rolledQuantity, quantity: H(c.data) }) : "",
      pending: !!(c != null && c.claim) && !(c != null && c.taken)
    })), r = D();
    return {
      name: this.token.name,
      theme: game.settings.get(f, "panelTheme"),
      busy: this.busy,
      automatic: t,
      rows: o,
      canEdit: r,
      manual: e,
      saveDisabled: this.busy || e && !r,
      canRefresh: !e && r && ft(this.token, this.adapter),
      scopes: ["token", "actor", "global"].map((c) => ({ value: c, label: x(`Scope.${c}`), selected: this.scope === c })),
      modes: (t ? ["automatic", "enabled", "disabled"] : ["enabled", "disabled"]).map((c) => ({ value: c, label: x(c), selected: c === n }))
    };
  }
  activateListeners(e) {
    var v, b, p, I;
    super.activateListeners(e);
    const t = yt(e);
    (v = this.dismissal) == null || v.destroy(), this.dismissal = new cs(t.closest(".window-app, .application") ?? t, () => {
      this.busy || this.close();
    }), (b = t.querySelector('[name="mode"]')) == null || b.addEventListener("change", (g) => {
      this.config.mode = g.target.value;
    }), (p = t.querySelector("[data-save]")) == null || p.addEventListener("click", () => {
      const g = Array.from(t.querySelectorAll("[data-manual-item]:checked"), (C) => C.value);
      this.save(g);
    }), (I = t.querySelector("[data-close]")) == null || I.addEventListener("click", () => void this.close());
    const n = t.querySelector('[name="scope"]'), a = t.querySelector('[name="behavior"]'), o = t.querySelector('[name="formula"]'), r = t.querySelector("[data-apply]"), c = t.querySelector("[data-refresh-inventory]"), l = t.querySelector("[data-select-all]");
    if (!n || !a || !o || !r || !l) return;
    const u = Array.from(t.querySelectorAll("input[data-rule-item]")), d = () => {
      this.scope = n.value, n.disabled = a.disabled = o.disabled = this.busy, c && (c.disabled = this.busy);
      const g = u.filter((L) => {
        const q = L.dataset[this.scope] === "true";
        L.disabled = this.busy || !q, q || (L.checked = !1);
        const h = L.closest("label"), R = h == null ? void 0 : h.querySelector("[data-rule-unavailable]"), w = L.dataset[`${this.scope}Unavailable`];
        R && (R.textContent = !q && w ? x(w) : "");
        const y = h == null ? void 0 : h.querySelector("[data-scoped-rule]"), A = L.dataset[`${this.scope}Rule`];
        return y && (y.textContent = A && L.dataset.effectiveScope !== this.scope ? ` · ${x(`Scope.${this.scope}`)} ${A}` : ""), q;
      }), C = g.filter((L) => L.checked).length;
      l.disabled = this.busy || !g.length, l.checked = !!C && C === g.length, l.indeterminate = !!C && !l.checked, r.disabled = this.busy || !C, o.hidden = a.value !== "quantity";
    };
    n.addEventListener("change", d), a.addEventListener("change", d);
    for (const g of u) g.addEventListener("change", d);
    l.addEventListener("change", () => {
      for (const g of u) g.disabled || (g.checked = l.checked);
      d();
    }), c == null || c.addEventListener("click", async () => {
      if (!(!D() || this.busy)) {
        this.busy = !0, d();
        try {
          await this.queue.run(this.token.uuid, () => ht(this.token, this.adapter)), ui.notifications.info(x("InventoryRefreshed"));
        } catch (g) {
          U(g);
          return;
        } finally {
          this.busy = !1, d();
        }
        this.rendered && this.render(!0);
      }
    }), r.addEventListener("click", async () => {
      if (!(!D() || this.busy)) {
        try {
          const g = Ce(a.value, o.value), C = u.filter((h) => h.checked && !h.disabled).map((h) => h.value), L = this.scope;
          this.busy = !0, d();
          const q = await this.queue.run(this.token.uuid, () => Kt(this.token, this.adapter, L, C, g));
          for (const h of q ?? [])
            ls(h).catch((R) => console.warn("HoloSuite Loot | Could not post quantity roll", R));
        } catch (g) {
          U(g);
          return;
        } finally {
          this.busy = !1, d();
        }
        this.render(!0);
      }
    }), d();
  }
  async save(e = []) {
    if (!(!game.user.isGM || this.busy)) {
      this.busy = !0, this.render(!0);
      try {
        const t = this.config.mode === "automatic" && (this.adapter.manual || !game.settings.get(f, "zeroHP")) ? "disabled" : this.config.mode;
        await this.queue.run(this.token.uuid, () => this.adapter.manual ? Qt(this.token, this.adapter, t, e) : this.token.setFlag(f, "config", { ...Z(this.token), mode: t })), await this.close();
      } catch (t) {
        U(t);
      } finally {
        this.busy = !1, this.rendered && this.render(!0);
      }
    }
  }
  async close(e) {
    var t;
    return (t = this.dismissal) == null || t.destroy(), this.dismissal = null, super.close(e);
  }
}
class gs {
  constructor(i) {
    S(this, "sprites", /* @__PURE__ */ new Map());
    S(this, "texture");
    S(this, "disposed", !1);
    var t;
    this.available = i;
    const e = ((t = foundry.canvas) == null ? void 0 : t.loadTexture) ?? globalThis.loadTexture;
    Promise.resolve().then(() => e == null ? void 0 : e(`modules/${f}/assets/ui/loot-badge.svg`)).then((n) => {
      this.disposed || !n || (this.texture = n, this.refreshScene());
    }).catch((n) => console.warn("HoloSuite Loot | Badge texture could not load", n));
  }
  refreshScene() {
    var i;
    for (const e of ((i = canvas.tokens) == null ? void 0 : i.placeables) ?? []) this.refresh(e);
  }
  refresh(i) {
    if (!i || this.disposed || !this.texture) return;
    const e = i.document, t = e.getFlag(f, "state");
    if (i.destroyed || i.isPreview || e.hidden || !this.available(e) || t && !t.entries.some((a) => !a.taken && !a.hidden)) {
      this.remove(i);
      return;
    }
    let n = this.sprites.get(i);
    (n != null && n.destroyed || (n == null ? void 0 : n.parent) !== i) && (this.remove(i), n = new PIXI.Sprite(this.texture), n.name = "holosuite-loot-badge", n.eventMode = "none", n.anchor.set(0.5), n.width = n.height = 24, n.zIndex = 100, i.addChild(n), this.sprites.set(i, n)), n.position.set(i.w, 0);
  }
  remove(i) {
    var t;
    const e = this.sprites.get(i);
    this.sprites.delete(i), e && !e.destroyed && ((t = e.parent) == null || t.removeChild(e), e.destroy());
  }
  destroy() {
    this.disposed = !0;
    for (const i of this.sprites.keys()) this.remove(i);
  }
}
const E = /* @__PURE__ */ new Map();
let M = null, K = !1, me = 0;
const G = () => Nt(game.system.id), ue = () => Vt(G()), De = (s) => {
  var i, e;
  return (s == null ? void 0 : s.actor) && (G().manual ? !!s.actor.items : ((e = (i = G()).sourceActor) == null ? void 0 : e.call(i, s.actor)) ?? s.actor.type === "npc");
}, ys = (s, i, e) => {
  var t;
  return Ye(s, game.actors.contents, (t = game.scenes.get(s.viewedScene)) == null ? void 0 : t.tokens, i, e);
}, fe = new Ot({
  moduleId: f,
  authority: D,
  environment: ue,
  adapter: G,
  token: async (s) => {
    if (!/^Scene\.[^.]+\.Token\.[^.]+$/.test(s)) throw new m("InvalidRequest");
    const e = await (foundry.utils.fromUuid ?? globalThis.fromUuid)(s);
    return (e == null ? void 0 : e.documentName) === "Token" ? e : null;
  },
  actor: (s) => game.actors.get(s) ?? (foundry.utils.fromUuid ?? globalThis.fromUuid)(s),
  id: () => foundry.utils.randomID(),
  destination: (s, i, e) => game.settings.get(f, "characterSelector") ? s.actorId ? fe.io.actor(s.actorId) : null : ys(i, G(), e),
  load: Oe,
  save: Jt,
  summary: kt,
  collected: fs,
  rollQuantity: zt,
  quantityRolled: ds
}), xe = (s) => ts(s, fe);
function Pe(s) {
  var i;
  return K && ae(s, ue()) && (game.user.isGM || !s.hidden && ((i = s.object) == null ? void 0 : i.isVisible));
}
async function qe(s) {
  var a, o, r, c, l;
  s = (s == null ? void 0 : s.document) ?? s;
  const i = G();
  if (!i) {
    U(new m("Unsupported"));
    return;
  }
  if (game.user.isGM) return he(s);
  if (!Pe(s)) {
    U(new m("Unavailable"));
    return;
  }
  const e = ++me;
  let t;
  if (Ne() > 0 && (!E.has(s.uuid) || (a = E.get(s.uuid)) != null && a.disposed)) {
    try {
      t = await xe({ action: "view", tokenUuid: s.uuid });
    } catch (u) {
      e === me && ((o = canvas.scene) == null ? void 0 : o.id) === ((r = s.parent) == null ? void 0 : r.id) && U(u);
      return;
    }
    if (e !== me || ((c = canvas.scene) == null ? void 0 : c.id) !== ((l = s.parent) == null ? void 0 : l.id)) return;
  }
  for (const [u, d] of E)
    u !== s.uuid && !d.disposed && await d.close();
  if (e !== me) return;
  let n = E.get(s.uuid);
  (!n || n.disposed) && (n = new hs(s, xe, i), E.set(s.uuid, n), await n.show(t), t !== void 0) || n.disposed || await n.refresh();
}
async function he(s) {
  var i;
  if (!(!game.user.isGM || !G())) {
    if (((i = s == null ? void 0 : s.parent) == null ? void 0 : i.documentName) !== "Scene" || !De(s)) {
      ui.notifications.info(x("SelectToken"));
      return;
    }
    try {
      new ms(s, G(), fe.queue).render(!0);
    } catch (e) {
      U(e);
    }
  }
}
function le(s) {
  const i = E.get(s);
  i && !i.disposed && i.refresh();
}
function Ue(s) {
  const i = G(), e = () => {
    const t = s.getFlag(f, "state");
    return !t || i.currencySnapshotVersion && t.currencyReady !== i.currencySnapshotVersion;
  };
  !K || !D() || i.manual || !e() || !ae(s, ue()) || fe.queue.run(s.uuid, async () => {
    D() && e() && ae(s, ue()) && await Oe(s, i);
  }).catch((t) => console.warn("HoloSuite Loot | Snapshot initialization failed", s.uuid, t));
}
function P() {
  var s;
  for (const i of ((s = canvas.scene) == null ? void 0 : s.tokens) ?? []) Ue(i);
  M == null || M.refreshScene();
}
function ps() {
  const s = [.../* @__PURE__ */ new Set([...canvas.tokens.controlled, ...game.user.targets])];
  if (s.length !== 1) {
    ui.notifications.info(x("SelectToken"));
    return;
  }
  const i = s[0];
  game.user.isGM ? he(i.document) : qe(i.document);
}
function We() {
  var i;
  const s = ((i = game.modules.get("holosuite-core")) == null ? void 0 : i.api) ?? game.holosuite;
  return s != null && s.registerApp ? (s.registerApp({
    id: f,
    title: x("Title"),
    icon: "fa-solid fa-box-open",
    playerVisible: !1,
    premium: !1,
    description: x("SelectToken"),
    open: ps
  }), !0) : !1;
}
let F, Y, Qe = "", Je = 0;
function Q(s) {
  var c, l;
  if (game.user.isGM || !K || s.type === "pointerdown" && s.button !== 2) return;
  const i = F == null ? void 0 : F.getBoundingClientRect(), e = (l = (c = canvas.app) == null ? void 0 : c.renderer) == null ? void 0 : l.screen;
  if (!(i != null && i.width) || !i.height || !e || !canvas.stage) return;
  const t = canvas.stage.worldTransform.applyInverse({
    x: (s.clientX - i.left) * e.width / i.width,
    y: (s.clientY - i.top) * e.height / i.height
  }), n = (u) => {
    var d;
    return (u == null ? void 0 : u.isVisible) && (((d = u.bounds) == null ? void 0 : d.contains(t.x, t.y)) ?? (t.x >= u.document.x && t.y >= u.document.y && t.x <= u.document.x + u.w && t.y <= u.document.y + u.h));
  }, a = n(Y) ? Y : [...canvas.tokens.placeables].reverse().find(n), o = a == null ? void 0 : a.document;
  if (!Pe(o)) {
    for (const u of E.values()) u.disposed || u.close();
    return;
  }
  if (s.type === "contextmenu" && Qe === o.uuid && Date.now() - Je < 1e3) return;
  s.type === "pointerdown" && (Qe = o.uuid, Je = Date.now());
  const r = E.get(o.uuid);
  r && !r.disposed ? r.close() : qe(o);
}
function pt() {
  var s, i;
  M == null || M.destroy(), M = K ? new gs((e) => ae(e, ue())) : null, F == null || F.removeEventListener("contextmenu", Q, !0), F == null || F.removeEventListener("pointerdown", Q, !0), F = ((s = canvas.app) == null ? void 0 : s.canvas) ?? ((i = canvas.app) == null ? void 0 : i.view), F == null || F.addEventListener("contextmenu", Q, !0), F == null || F.addEventListener("pointerdown", Q, !0);
}
Hooks.once("init", () => {
  game.settings.register(f, ve, { scope: "world", config: !1, type: Object, default: {} }), game.settings.register(f, "zeroHP", {
    name: "HL.ZeroHP",
    hint: "HL.ZeroHPHint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0,
    onChange: () => {
      P();
      for (const s of E.keys()) le(s);
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
  }), game.settings.register(f, nt, {
    name: "HL.LootRange",
    hint: "HL.LootRangeHint",
    scope: "world",
    config: !0,
    type: Number,
    default: at,
    onChange: () => {
      for (const s of E.keys()) le(s);
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
      for (const s of E.values()) s.disposed || s.render(!1);
    }
  });
});
Hooks.once("ready", async () => {
  var s;
  if (!((s = game.modules.get("holosuite-core")) != null && s.active)) {
    ui.notifications.error(x("CoreMissing"));
    return;
  }
  try {
    await es(fe, le);
  } catch (i) {
    U(i);
    return;
  }
  K = !0, game.modules.get(f).api = {
    version: ye,
    open: qe,
    configure: he,
    registerAdapter: Et,
    // Requests still pass every authority and permission check, including calls from macros.
    request: xe,
    authority: () => {
      var i;
      return (i = Ee()) == null ? void 0 : i.id;
    }
  }, We(), setTimeout(We, 500), pt(), P(), console.info(`HoloSuite Loot | ${ye} ready; Foundry ${game.version}, ${game.system.id} ${game.system.version}`);
});
Hooks.on("canvasReady", () => {
  pt(), P();
});
Hooks.on("hoverToken", (s, i) => {
  i ? Y = s : Y === s && (Y = null);
});
Hooks.on("canvasTearDown", () => {
  M == null || M.destroy(), M = null, Y = null, F == null || F.removeEventListener("contextmenu", Q, !0), F == null || F.removeEventListener("pointerdown", Q, !0), F = null;
  for (const s of E.values()) s.close();
  E.clear();
});
Hooks.on("renderTokenHUD", (s, i) => {
  var o;
  if (!K) return;
  const e = (o = s.object) == null ? void 0 : o.document;
  if (!De(e)) return;
  const t = i instanceof HTMLElement ? i : i[0], n = t.querySelector(".col.right") ?? t;
  t.querySelectorAll(".hl-token-action").forEach((r) => r.remove());
  const a = (r, c, l) => {
    const u = document.createElement("button");
    u.type = "button", u.className = "control-icon hl-token-action", u.title = r, u.setAttribute("aria-label", r);
    const d = document.createElement("i");
    d.className = c, u.append(d), u.addEventListener("click", (v) => {
      v.preventDefault(), v.stopPropagation(), l();
    }), n.append(u);
  };
  game.user.isGM ? G() && !game.settings.get(f, "hideGmLootButton") && a(x("Loot"), "fa-solid fa-box-open", () => void he(e)) : Pe(e) && a(x("Loot"), "fa-solid fa-box-open", () => void qe(e));
});
Hooks.on("renderTokenConfig", (s, i) => {
  var a;
  if (!K || !game.user.isGM || !G()) return;
  const e = s.document ?? s.object;
  if (((a = e == null ? void 0 : e.parent) == null ? void 0 : a.documentName) !== "Scene" || !De(e)) return;
  const t = i instanceof HTMLElement ? i : i[0];
  if (t.querySelector(".hl-token-config")) return;
  const n = document.createElement("button");
  n.type = "button", n.className = "hl-token-config", n.textContent = x("Configure"), n.addEventListener("click", () => he(e)), (t.querySelector('[data-tab="character"]') ?? t.querySelector("form") ?? t).append(n);
});
Hooks.on("drawToken", (s) => M == null ? void 0 : M.refresh(s));
Hooks.on("refreshToken", (s, i) => {
  (!i || i.refreshSize || i.refreshShape) && (M == null || M.refresh(s));
});
Hooks.on("destroyToken", (s) => M == null ? void 0 : M.remove(s));
Hooks.on("updateToken", (s, i) => {
  var e, t, n;
  if (Ue(s), M == null || M.refresh(s.object), le(s.uuid), !(!E.size || !Ne() || ((e = s.parent) == null ? void 0 : e.id) !== ((t = canvas.scene) == null ? void 0 : t.id) || !s.actor || !((n = G()) != null && n.destination(s.actor)) || !s.actor.testUserPermission(game.user, "OWNER") || !["x", "y", "elevation", "width", "height", "hidden"].some((a) => a in i)))
    for (const a of E.keys()) a !== s.uuid && le(a);
});
Hooks.on("createToken", Ue);
Hooks.on("createCombatant", P);
Hooks.on("updateCombatant", P);
Hooks.on("deleteCombatant", P);
Hooks.on("updateCombat", P);
Hooks.on("deleteCombat", P);
Hooks.on("updateActor", P);
Hooks.on("createActiveEffect", P);
Hooks.on("updateActiveEffect", P);
Hooks.on("deleteActiveEffect", P);
Hooks.on("userConnected", P);
Hooks.on("deleteToken", (s) => {
  var i;
  if ((i = E.get(s.uuid)) == null || i.close(), E.delete(s.uuid), !!D())
    for (const e of game.journal.contents)
      e.getFlag(f, "tokenUuid") === s.uuid && e.delete().catch(console.warn);
});
