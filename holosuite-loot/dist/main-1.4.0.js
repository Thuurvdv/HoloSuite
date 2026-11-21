var Rt = Object.defineProperty;
var qt = (s, i, e) => i in s ? Rt(s, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[i] = e;
var y = (s, i, e) => qt(s, typeof i != "symbol" ? i + "" : i, e);
const f = "holosuite-loot", Re = "1.4.0", st = "commandV3", Ne = "replyV3", O = (s) => structuredClone(s), E = (s) => {
  var i, e, t;
  return ((e = (i = s == null ? void 0 : s.system) == null ? void 0 : i.quantity) == null ? void 0 : e.value) ?? ((t = s == null ? void 0 : s.system) == null ? void 0 : t.quantity) ?? 1;
}, Ge = (s) => {
  var i;
  return typeof ((i = s == null ? void 0 : s.system) == null ? void 0 : i.quantity) == "object" && s.system.quantity !== null ? "system.quantity.value" : "system.quantity";
};
function it(s, i) {
  Ge(s) === "system.quantity.value" ? s.system.quantity.value = i : s.system.quantity !== void 0 && (s.system.quantity = i);
}
function At(s, i, e, t = "request") {
  var n, r;
  return e !== s.id || !s.active || !((r = (n = i.flags) == null ? void 0 : n[f]) != null && r[t]) ? null : O(s.getFlag(f, t));
}
class m extends Error {
  constructor(i) {
    super(i), this.code = i;
  }
}
function qe(s) {
  const i = (e) => typeof e == "string" && /^[\w-]{1,64}$/.test(e);
  return typeof (s == null ? void 0 : s.tokenUuid) == "string" && /^Scene\.[\w-]{1,64}\.Token\.[\w-]{1,64}$/.test(s.tokenUuid) && ["view", "inspect", "take", "all"].includes(s.action) && (!["inspect", "take"].includes(s.action) || i(s.entryId)) && (s.actorId == null || typeof s.actorId == "string" && /^(?:[\w-]{1,64}|Actor\.[\w-]{1,64}|Scene\.[\w-]{1,64}\.Token\.[\w-]{1,64}(?:\.Actor\.[\w-]{1,64})?)$/.test(s.actorId));
}
function k(s) {
  var i;
  return s.getFlag(f, "config") ?? ((i = s.actor) == null ? void 0 : i.getFlag(f, "config")) ?? { mode: "automatic", source: "inventory" };
}
function nt(s) {
  var e, t;
  const i = k(s).keepLinkedActor;
  return typeof i == "boolean" ? i : ((t = (e = globalThis.game) == null ? void 0 : e.settings) == null ? void 0 : t.get(f, "keepLinkedActor")) === !0;
}
const F = (s) => (s == null ? void 0 : s.uuid) ?? (s == null ? void 0 : s.id), ae = (s) => JSON.stringify(s, (i, e) => e && typeof e == "object" && !Array.isArray(e) ? Object.fromEntries(Object.entries(e).sort(([t], [n]) => t.localeCompare(n))) : e);
function te(s, i, e, t = void 0) {
  return !s || !e.destination(s) || !s.testUserPermission(i, "OWNER") ? !1 : !(e.manual || e.acceptsLegacyWholeItems) || !t || F(s) !== F(t.actor) && (s.isToken || s.id !== t.actorId);
}
function rt(s, i, e, t, n = void 0) {
  const r = (c) => te(c, s, t, n);
  if (r(s.character)) return s.character;
  const o = [...new Map(Array.from(e ?? []).map((c) => c.actor).filter(r).map((c) => [F(c), c])).values()];
  if (o.length === 1) return o[0];
  if (o.length > 1) throw new m("AmbiguousActor");
  const a = Array.from(i ?? []).filter(r);
  if (a.length === 1) return a[0];
  throw new m(a.length ? "AmbiguousActor" : "NoActor");
}
function me(s, { combats: i = [], zeroHP: e = !1, automatic: t = !0, manual: n = !1, sourceActor: r, hitPoints: o, defeated: a } = {}) {
  var d, g, v, p, I, b;
  if (!(s != null && s.actor) || (n ? !s.actor.items : !((r == null ? void 0 : r(s.actor)) ?? s.actor.type === "npc"))) return !1;
  if (n) return ((d = s.getFlag(f, "config")) == null ? void 0 : d.mode) === "enabled";
  const c = k(s);
  if (c.mode === "disabled") return !1;
  if (c.mode === "enabled") return !0;
  if (!t) return !1;
  if (i.some((S) => {
    var T;
    return (T = S.combatants) == null ? void 0 : T.some((q) => {
      var h, w;
      return q.tokenId === s.id && (q.sceneId ?? ((h = S.scene) == null ? void 0 : h.id)) === ((w = s.parent) == null ? void 0 : w.id) && (q.isDefeated || q.defeated);
    });
  })) return !0;
  const l = s.actor.statuses;
  if (l != null && l.has("dead") || a != null && a(s.actor)) return !0;
  const u = o ? o(s.actor) : (v = (g = s.actor.system) == null ? void 0 : g.attributes) == null ? void 0 : v.hp;
  return e && Number(u == null ? void 0 : u.max) > 0 && (u == null ? void 0 : u.value) === 0 && !((b = (I = (p = s.actor.system) == null ? void 0 : p.attributes) == null ? void 0 : I.death) != null && b.success);
}
function Tt(s, i, e, t = void 0) {
  var r, o, a;
  if (!(i != null && i.active) || !me(s, e)) throw new m("Unavailable");
  if (i.isGM) return;
  const n = ((r = s.parent) == null ? void 0 : r.active) || ((o = s.parent) == null ? void 0 : o.testUserPermission(i, "LIMITED"));
  if (s.hidden || i.viewedScene !== ((a = s.parent) == null ? void 0 : a.id) || !n || !e.visible(s, i))
    throw new m("AccessDenied");
  if (e.inRange && !e.inRange(s, i, t)) throw new m("OutOfRange");
}
function We(s, i, e, t = void 0) {
  if (!te(s, i, e, t))
    throw new m("ActorDenied");
}
class oe {
  constructor() {
    y(this, "tails", /* @__PURE__ */ new Map());
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
const De = new oe(), Oe = (s) => `${s.currency.unit}:${s.currency.amount}`, de = (s, i, e, t = !1) => {
  var n, r;
  return ((r = (n = s.getFlag) == null ? void 0 : n.call(s, f, t ? "currencyDebits" : "currencyReceipts")) == null ? void 0 : r[e.id]) === Oe(i);
};
function ce({ units: s, amountOf: i, path: e, valid: t, name: n, encode: r = (o) => o }) {
  return {
    entries(o) {
      return s.filter((a) => t(i(o, a)) && i(o, a) > 0).map((a) => {
        const c = i(o, a);
        return { currency: { storage: "balance", unit: a, amount: c }, data: {
          name: n(a),
          type: "currency",
          img: "icons/svg/coins.svg",
          system: { quantity: c }
        } };
      });
    },
    received: de,
    async grant(o, a, c, l) {
      return De.run(F(o), async () => {
        if (de(o, a, c)) return;
        if (c.currencyAttempted) throw new m("RecoveryRequired");
        if (!l) throw new m("RecoveryRequired");
        await l();
        const { unit: u, amount: d } = a.currency, g = i(o, u);
        if (!s.includes(u) || !t(d) || !d || !t(g) || !t(g + d)) throw new m("CurrencyChanged");
        if (await o.update({
          [e(u)]: r(g + d),
          [`flags.${f}.currencyReceipts.${c.id}`]: Oe(a)
        }), !de(o, a, c)) throw new m("TransferFailed");
      });
    },
    sourcePlan(o, a) {
      const { unit: c, amount: l } = a.currency, u = i(o.actor, c);
      if (!s.includes(c) || !t(u) || !t(l) || l <= 0 || u < l) throw new m("CurrencyChanged");
      return { currency: c, before: u, after: u - l };
    },
    async debit(o, a, c) {
      return De.run(F(o.actor), async () => {
        const l = o.actor;
        if (de(l, a, c, !0)) return;
        const u = c.source;
        if (i(l, u.currency) !== u.before) throw new m("CurrencyChanged");
        if (await l.update({
          [e(u.currency)]: r(u.after),
          [`flags.${f}.currencyDebits.${c.id}`]: Oe(a)
        }), !de(l, a, c, !0)) throw new m("CurrencyChanged");
      });
    },
    async cleanup(o, a, c, l) {
      for (const [u, d] of [[a, "currencyReceipts"], [o.actor, "currencyDebits"]])
        try {
          await De.run(F(u), () => u.update({ [`flags.${f}.${d}.-=${l.id}`]: null }));
        } catch (g) {
          console.warn("HoloSuite Loot | Could not clean committed currency receipt", g);
        }
    }
  };
}
const Ft = ce({
  units: ["cp", "sp", "ep", "gp", "pp"],
  amountOf: (s, i) => {
    var e, t;
    return (t = (e = s == null ? void 0 : s.system) == null ? void 0 : e.currency) == null ? void 0 : t[i];
  },
  path: (s) => `system.currency.${s}`,
  valid: (s) => Number.isSafeInteger(s) && s >= 0,
  name: (s) => {
    var t, n, r, o, a;
    const i = (r = (n = (t = globalThis.CONFIG) == null ? void 0 : t.DND5E) == null ? void 0 : n.currencies) == null ? void 0 : r[s], e = typeof i == "string" ? i : i == null ? void 0 : i.label;
    return e ? ((a = (o = globalThis.game) == null ? void 0 : o.i18n) == null ? void 0 : a.localize(e)) ?? e : s.toUpperCase();
  }
}), xt = ce({
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
}), Mt = ce({
  units: ["credits"],
  amountOf: (s) => {
    var i, e, t;
    return (t = (e = (i = s == null ? void 0 : s.system) == null ? void 0 : i.stats) == null ? void 0 : e.credits) == null ? void 0 : t.value;
  },
  path: () => "system.stats.credits.value",
  valid: (s) => Number.isSafeInteger(s) && s >= 0,
  name: () => "Credits"
}), Ht = ce({
  units: ["credits"],
  amountOf: (s) => {
    var t, n;
    const i = (n = (t = s == null ? void 0 : s.system) == null ? void 0 : t.credits) == null ? void 0 : n.value;
    if ((s == null ? void 0 : s.type) !== "character" || typeof i != "number" && typeof i != "string") return;
    if (typeof i == "number") return i;
    const e = i.trim();
    if (!e) return 0;
    if (/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(e)) return Number(e.replaceAll(",", ""));
  },
  path: () => "system.credits.value",
  valid: (s) => Number.isSafeInteger(s) && s >= 0,
  name: () => "Credits",
  encode: String
}), Et = ce({
  units: ["cp", "sp", "gp", "pp"],
  amountOf: (s, i) => {
    var e, t;
    return (t = (e = s == null ? void 0 : s.system) == null ? void 0 : e.currency) == null ? void 0 : t[i];
  },
  path: (s) => `system.currency.${s}`,
  valid: (s) => Number.isSafeInteger(s) && s >= 0,
  name: (s) => s.toUpperCase()
}), Je = { gc: "gold", sc: "silver", cc: "copper" }, $t = ce({
  units: Object.keys(Je),
  amountOf: (s, i) => {
    var e, t;
    return (t = (e = s == null ? void 0 : s.system) == null ? void 0 : e.currency) == null ? void 0 : t[i];
  },
  path: (s) => `system.currency.${s}`,
  valid: (s) => Number.isSafeInteger(s) && s >= 0,
  name: (s) => {
    var n, r;
    const i = Je[s], e = `DoD.currency.${i}`, t = (r = (n = globalThis.game) == null ? void 0 : n.i18n) == null ? void 0 : r.localize(e);
    return t && t !== e ? t : i[0].toUpperCase() + i.slice(1);
  }
});
function _e(s) {
  var e;
  const i = O(s.toObject());
  delete i._id, delete i.folder, delete i.ownership, delete i._stats, (e = i.flags) == null || delete e[f];
  for (const t of i.effects ?? [])
    delete t._id, t.origin = null;
  return i;
}
async function Nt(s) {
  if (s.actorLink && await s.update({ actorLink: !1 }), s.actorLink) throw new m("SourceChanged");
}
function ge(s, i) {
  if (i != null && i.actorUuid && (!s.actorLink || F(s.actor) !== i.actorUuid)) throw new m("SourceChanged");
}
async function Ae(s, i) {
  return i != null && i.actorUuid ? (ge(s, i), i) : !i && s.actorLink && nt(s) ? { actorUuid: F(s.actor) } : (await Nt(s), {});
}
class at {
  constructor() {
    y(this, "manual", !1);
  }
  async reserveSource(i, e, t) {
    var a;
    if (!((a = t.source) != null && a.actorUuid)) return;
    ge(i, t.source);
    const n = i.actor, r = n.getFlag(f, "linkedLootClaim");
    if (r && (r.id !== t.id || r.tokenUuid !== i.uuid)) throw new m("RecoveryRequired");
    r || await n.setFlag(f, "linkedLootClaim", { id: t.id, tokenUuid: i.uuid });
    const o = n.getFlag(f, "linkedLootClaim");
    if ((o == null ? void 0 : o.id) !== t.id || o.tokenUuid !== i.uuid) throw new m("RecoveryRequired");
  }
  async releaseSource(i, e, t) {
    var r;
    if (!((r = t.source) != null && r.actorUuid)) return;
    ge(i, t.source);
    const n = i.actor.getFlag(f, "linkedLootClaim");
    (n == null ? void 0 : n.id) === t.id && n.tokenUuid === i.uuid && await i.actor.unsetFlag(f, "linkedLootClaim");
  }
  received(i, e, t) {
    var n;
    return ((n = i.items.get(t.itemId)) == null ? void 0 : n.getFlag(f, "claim")) === t.id;
  }
  async create(i, e, t) {
    var a;
    const n = i.items.get(t.itemId);
    if (n) {
      if (n.getFlag(f, "claim") !== t.id) throw new m("RecoveryRequired");
      return n;
    }
    const r = O(e.data);
    r._id = t.itemId, r.flags ?? (r.flags = {}), r.flags[f] = { claim: t.id };
    const o = (a = await i.createEmbeddedDocuments("Item", [r], { keepId: !0 })) == null ? void 0 : a[0];
    if (!this.received(i, e, t))
      throw new m("TransferFailed");
    return o;
  }
}
class ot extends at {
  constructor() {
    super(...arguments);
    y(this, "id", "dnd5e");
    y(this, "balanceCurrency", Ft);
  }
  currencyEntries(e) {
    return this.balanceCurrency.entries(e);
  }
  received(e, t, n) {
    var r;
    return ((r = t.currency) == null ? void 0 : r.storage) === "balance" ? this.balanceCurrency.received(e, t, n) : super.received(e, t, n);
  }
  async cleanup(e, t, n, r) {
    var o;
    ((o = n.currency) == null ? void 0 : o.storage) === "balance" && await this.balanceCurrency.cleanup(e, t, n, r);
  }
  destination(e) {
    return e.type === "character";
  }
  eligible(e) {
    var c, l, u, d, g;
    const t = e.system, n = (c = t == null ? void 0 : t.constructor) == null ? void 0 : c.metadata;
    if (!["weapon", "equipment", "consumable", "tool", "loot", "container"].includes(e.type) || (n == null ? void 0 : n.inventoryItem) === !1) return !1;
    const o = (u = (l = t == null ? void 0 : t.schema) == null ? void 0 : l.getField) == null ? void 0 : u.call(l, "quantity");
    if (t != null && t.schema && !o || !Number.isSafeInteger(t == null ? void 0 : t.quantity) || t.quantity <= 0) return !1;
    const a = ((d = t.type) == null ? void 0 : d.value) ?? t.weaponType ?? ((g = t.armor) == null ? void 0 : g.type);
    return !["natural", "siege", "vehicle", "currency"].includes(a);
  }
  snapshot(e) {
    const t = _e(e);
    return t.system.container = null, "equipped" in t.system && (t.system.equipped = !1), "attuned" in t.system && (t.system.attuned = !1), t.system.attunement === 2 && (t.system.attunement = 1), t;
  }
  async create(e, t, n, r) {
    var o;
    return ((o = t.currency) == null ? void 0 : o.storage) === "balance" ? this.balanceCurrency.grant(e, t, n, r) : super.create(e, t, n);
  }
  preview(e) {
    var n, r;
    const t = O(e.data);
    return t.system.identified !== !1 ? t : {
      name: ((n = t.system.unidentified) == null ? void 0 : n.name) || "Unidentified Item",
      img: t.img,
      type: "loot",
      system: { quantity: t.system.quantity, identified: !1, description: { value: ((r = t.system.unidentified) == null ? void 0 : r.description) ?? "" } }
    };
  }
  async sourceClaim(e, t) {
    var c, l, u, d, g;
    if (!((c = t.source) != null && c.itemId) && ((l = t.currency) == null ? void 0 : l.storage) !== "balance") return null;
    if ((u = t.source) != null && u.ruleKey && t.source.ruleKey !== `${e.actorId ?? ((d = e.actor) == null ? void 0 : d.id) ?? ""}:${t.source.itemId}`)
      throw new m("SourceChanged");
    const n = await Ae(e);
    if (((g = t.currency) == null ? void 0 : g.storage) === "balance") return { ...this.balanceCurrency.sourcePlan(e, t), ...n };
    const r = e.actor.items.get(t.source.itemId), o = E(r), a = E(t.data);
    if (!this.eligible(r ?? {}) || o < a || t.source.ruleKey && r.type !== t.data.type) throw new m("SourceChanged");
    return { itemId: r.id, before: o, after: o - a, ...n };
  }
  validateSourcePlan(e, t, n) {
    var a, c, l, u, d;
    if (ge(e, n.source), !((a = t.source) != null && a.ruleKey)) return;
    const r = (l = e.actor) == null ? void 0 : l.items.get((c = n.source) == null ? void 0 : c.itemId);
    if (e.actorLink && !((u = n.source) != null && u.actorUuid) || t.source.ruleKey !== `${e.actorId ?? ((d = e.actor) == null ? void 0 : d.id) ?? ""}:${r == null ? void 0 : r.id}` || !this.eligible(r ?? {}) || r.type !== t.data.type || E(r) !== n.source.before)
      throw new m("SourceChanged");
    const o = n.source.sfCurrency;
    if (o) {
      const g = this.entryMetadata(r).currency;
      if ((g == null ? void 0 : g.unit) !== o.unit || (g == null ? void 0 : g.amount) !== o.amount) throw new m("CurrencyChanged");
    }
  }
  async removeSource(e, t, n) {
    const r = n.source;
    if (!r) return;
    if (await Ae(e, r), r.currency) return this.balanceCurrency.debit(e, t, n);
    const o = e.actor.items.get(r.itemId);
    if (!o || o.getFlag(f, "sourceClaim") === n.id) return;
    if (E(o) !== r.before) throw new m("SourceChanged");
    r.after === 0 ? await e.actor.deleteEmbeddedDocuments("Item", [o.id]) : await o.update({ [Ge(o)]: r.after, [`flags.${f}.sourceClaim`]: n.id });
    const a = e.actor.items.get(r.itemId);
    if (r.after === 0 ? a : !a || E(a) !== r.after || (a == null ? void 0 : a.getFlag(f, "sourceClaim")) !== n.id) throw new m("SourceChanged");
  }
}
class Dt extends at {
  constructor() {
    super(...arguments);
    y(this, "manual", !0);
  }
  destination(e) {
    return !!e.items && typeof e.createEmbeddedDocuments == "function";
  }
  eligible(e) {
    return !!(e != null && e.id) && typeof e.toObject == "function";
  }
  snapshot(e) {
    return _e(e);
  }
  preview(e) {
    var r, o, a, c, l, u;
    const { data: t } = e;
    if (((r = t.system) == null ? void 0 : r.identified) !== !1 && ((a = (o = t.system) == null ? void 0 : o.identification) == null ? void 0 : a.status) !== "unidentified") return O(t);
    const n = ((c = t.system) == null ? void 0 : c.unidentified) ?? ((u = (l = t.system) == null ? void 0 : l.identification) == null ? void 0 : u.unidentified);
    return { name: (n == null ? void 0 : n.name) || "Unidentified Item", type: t.type, img: (n == null ? void 0 : n.img) || t.img };
  }
  received(e, t, n) {
    return super.received(e, t, n) || Array.from(e.items.values()).some((r) => r.getFlag(f, "claim") === n.id);
  }
  async create(e, t, n, r) {
    if (n.itemAttempted || !r) throw new m("RecoveryRequired");
    return await r(), super.create(e, t, n);
  }
  async sourceClaim(e, t) {
    var r;
    const n = { itemId: (r = t.source) == null ? void 0 : r.itemId, ...await Ae(e) };
    return this.validateSourcePlan(e, t, { source: n }), n;
  }
  validateSourcePlan(e, t, n) {
    var a, c, l, u, d, g;
    ge(e, n.source);
    const r = (a = n.source) == null ? void 0 : a.itemId, o = (c = e.actor) == null ? void 0 : c.items.get(r);
    if (e.actorLink && !((l = n.source) != null && l.actorUuid) || !t.wholeItem || r !== ((u = t.source) == null ? void 0 : u.itemId) || ((d = t.source) == null ? void 0 : d.ruleKey) !== `${e.actorId ?? ((g = e.actor) == null ? void 0 : g.id) ?? ""}:${r}` || !this.eligible(o) || ae(this.snapshot(o)) !== ae(t.data))
      throw new m("SourceChanged");
  }
  async removeSource(e, t, n) {
    var o, a, c;
    await Ae(e, n.source);
    const r = (o = n.source) == null ? void 0 : o.itemId;
    if (!r || !t.wholeItem || ((a = t.source) == null ? void 0 : a.ruleKey) !== `${e.actorId ?? ((c = e.actor) == null ? void 0 : c.id) ?? ""}:${r}`)
      throw new m("RecoveryRequired");
    if (e.actor.items.get(r) && (this.validateSourcePlan(e, t, n), await e.actor.deleteEmbeddedDocuments("Item", [r]), e.actor.items.get(r)))
      throw new m("SourceChanged");
  }
}
const W = new Dt();
class Y extends ot {
  constructor() {
    super(...arguments);
    y(this, "acceptsLegacyWholeItems", !0);
    y(this, "balanceCurrency", null);
  }
  currencyEntries(e) {
    var t;
    return ((t = this.balanceCurrency) == null ? void 0 : t.entries(e)) ?? [];
  }
  eligible(e) {
    const t = E(e);
    return this.allowsStoredItem(e) && Number.isSafeInteger(t) && t > 0;
  }
  snapshot(e) {
    return this.carriedData(_e(e));
  }
  carriedData(e) {
    return e;
  }
  preview(e) {
    return O(e.data);
  }
  received(e, t, n) {
    return t.wholeItem ? W.received(e, t, n) : super.received(e, t, n);
  }
  async create(e, t, n, r) {
    return t.wholeItem ? W.create(e, { ...t, data: this.carriedData(O(t.data)) }, n, r) : super.create(e, t, n, r);
  }
  async sourceClaim(e, t) {
    var n, r;
    if (this.acceptsLegacyWholeItems && ((n = t.currency) == null ? void 0 : n.storage) !== "balance" && !this.eligible(t.data))
      throw new m("SourceChanged");
    if (!t.wholeItem) return super.sourceClaim(e, t);
    if (!this.eligible(e.actor.items.get((r = t.source) == null ? void 0 : r.itemId))) throw new m("SourceChanged");
    return W.sourceClaim(e, t);
  }
  validateSourcePlan(e, t, n) {
    var r;
    if (!t.wholeItem) return super.validateSourcePlan(e, t, n);
    if (!this.eligible(e.actor.items.get((r = n.source) == null ? void 0 : r.itemId))) throw new m("SourceChanged");
    return W.validateSourcePlan(e, t, n);
  }
  async removeSource(e, t, n) {
    return t.wholeItem ? W.removeSource(e, t, n) : super.removeSource(e, t, n);
  }
}
class ct extends Y {
  allowsStoredItem(i) {
    var t;
    return ["ammo", "armor", "backpack", "book", "consumable", "equipment", "shield", "treasure", "weapon"].includes(i == null ? void 0 : i.type) && (i.isOfType ? i.isOfType("physical") : !0) && !(i.type === "weapon" && ((t = i.system) == null ? void 0 : t.category) === "unarmed");
  }
  eligible(i) {
    var e;
    return Number.isSafeInteger((e = i == null ? void 0 : i.system) == null ? void 0 : e.quantity) && super.eligible(i);
  }
  carriedData(i) {
    var e, t, n, r;
    return (t = (e = i.flags) == null ? void 0 : e.pf2e) == null || delete t.grantedBy, (r = (n = i.flags) == null ? void 0 : n.pf2e) == null || delete r.itemGrants, i.system.containerId = null, i.system.description && delete i.system.description.gm, i.system.equipped && (i.system.equipped = { carryType: "stowed", handsHeld: 0, invested: !1 }), i;
  }
  async sourceClaim(i, e) {
    var a;
    const t = await super.sourceClaim(i, e);
    if (((a = e.currency) == null ? void 0 : a.storage) !== "item") return t;
    const n = i.actor.items.get(e.source.itemId), r = this.entryMetadata(n).currency, o = this.entryMetadata(n, e.data.system.quantity).currency;
    if ((o == null ? void 0 : o.unit) !== e.currency.unit || (o == null ? void 0 : o.amount) !== e.currency.amount || !e.source.ruleKey && n.system.quantity !== e.data.system.quantity) throw new m("CurrencyChanged");
    return { ...t, sfCurrency: { unit: r.unit, amount: r.amount } };
  }
  async removeSource(i, e, t) {
    var r, o;
    const n = (r = t.source) != null && r.itemId ? i.actor.items.get(t.source.itemId) : null;
    if (n && t.source.sfCurrency && ((o = n.getFlag) == null ? void 0 : o.call(n, f, "sourceClaim")) !== t.id) {
      const a = this.entryMetadata(n).currency;
      if ((a == null ? void 0 : a.unit) !== t.source.sfCurrency.unit || (a == null ? void 0 : a.amount) !== t.source.sfCurrency.amount) throw new m("CurrencyChanged");
    }
    return super.removeSource(i, e, t);
  }
  preview(i) {
    var n, r, o, a;
    const e = O(i.data);
    if (((n = e.system.identification) == null ? void 0 : n.status) === "identified") return e;
    const t = (r = e.system.identification) == null ? void 0 : r.unidentified;
    return {
      name: (t == null ? void 0 : t.name) || "Unidentified Item",
      img: (t == null ? void 0 : t.img) || e.img,
      type: "equipment",
      system: { quantity: e.system.quantity, description: { value: ((a = (o = t == null ? void 0 : t.data) == null ? void 0 : o.description) == null ? void 0 : a.value) ?? "" } }
    };
  }
}
class Ot extends ct {
  constructor() {
    super(...arguments);
    y(this, "id", "sf2e");
    y(this, "acceptsLegacyWholeItems", !1);
  }
  entryMetadata(e, t = ((n) => (n = e.system) == null ? void 0 : n.quantity)()) {
    var c, l, u, d;
    const r = e.isCurrency ? e.unit : null, o = r ? e.assetValue : null, a = t === ((c = e.system) == null ? void 0 : c.quantity) ? o == null ? void 0 : o[r] : (d = (u = o == null ? void 0 : (l = o.constructor).fromPrice) == null ? void 0 : u.call(l, e.price, t)) == null ? void 0 : d[r];
    return r && Number.isSafeInteger(a) && a > 0 ? { currency: { storage: "item", unit: r, amount: a } } : {};
  }
}
class Pt extends ct {
  constructor() {
    super(...arguments);
    y(this, "id", "pf2e");
  }
  hitPoints(e) {
    var t, n, r;
    return (t = e.hasCondition) != null && t.call(e, "dying", "unconscious") ? null : e.hitPoints ?? ((r = (n = e.system) == null ? void 0 : n.attributes) == null ? void 0 : r.hp);
  }
  entryMetadata(e, t = ((n) => (n = e.system) == null ? void 0 : n.quantity)()) {
    var l, u;
    const r = e.system;
    if (e.type !== "treasure" || !(e.isCoinage ?? ((r == null ? void 0 : r.stackGroup) === "coins" || (r == null ? void 0 : r.category) === "coin"))) return {};
    const o = ["cp", "sp", "gp", "pp"], a = ((l = e.price) == null ? void 0 : l.value) ?? ((u = r == null ? void 0 : r.price) == null ? void 0 : u.value), c = e.unit ?? o.find((d) => (a == null ? void 0 : a[d]) === 1);
    return o.includes(c) && Number.isSafeInteger(t) && t > 0 ? { currency: { storage: "item", unit: c, amount: t } } : {};
  }
}
class Ut extends Y {
  constructor() {
    super(...arguments);
    y(this, "id", "swade");
    y(this, "balanceCurrency", xt);
    y(this, "currencySnapshotVersion", 2);
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
class Gt extends Y {
  constructor() {
    super(...arguments);
    y(this, "id", "dragonbane");
    y(this, "balanceCurrency", $t);
    y(this, "currencySnapshotVersion", 2);
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
class _t extends Y {
  constructor() {
    super(...arguments);
    y(this, "id", "wfrp4e");
    y(this, "coinWrites", new oe());
  }
  coinValue(e) {
    var n, r;
    const t = (r = (n = e == null ? void 0 : e.system) == null ? void 0 : n.coinValue) == null ? void 0 : r.value;
    return (e == null ? void 0 : e.type) === "money" && Number.isSafeInteger(t) && t > 0 ? t : null;
  }
  coinReceipt(e, t) {
    return Array.from(e.items.values()).find((n) => {
      var r;
      return n.type === "money" && ((r = n.getFlag(f, "coinReceipts")) == null ? void 0 : r[t.id]) === !0;
    });
  }
  received(e, t, n) {
    var r;
    return super.received(e, t, n) || ((r = t.data) == null ? void 0 : r.type) === "money" && !!this.coinReceipt(e, n);
  }
  async create(e, t, n, r) {
    const o = this.coinValue(t.data);
    return o === null ? super.create(e, t, n, r) : this.coinWrites.run(F(e), async () => {
      if (this.received(e, t, n)) return;
      if (n.itemAttempted) throw new m("RecoveryRequired");
      const a = Array.from(e.items.values()).find((u) => this.coinValue(u) === o);
      if (!a) return super.create(e, t, n, r);
      const c = E(t.data);
      if (!Number.isSafeInteger(c) || c <= 0 || !r) throw new m("TransferFailed");
      await r();
      const l = E(a) + c;
      if (!e.items.has(a.id) || !Number.isSafeInteger(l)) throw new m("TransferFailed");
      if (await a.update({ [Ge(a)]: l, [`flags.${f}.coinReceipts.${n.id}`]: !0 }), !this.coinReceipt(e, n)) throw new m("TransferFailed");
    });
  }
  async cleanup(e, t, n, r) {
    var o;
    ((o = n.data) == null ? void 0 : o.type) === "money" && await this.coinWrites.run(F(t), async () => {
      const a = this.coinReceipt(t, r);
      try {
        await (a == null ? void 0 : a.update({ [`flags.${f}.coinReceipts.-=${r.id}`]: null }));
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
class Vt extends Y {
  constructor() {
    super(...arguments);
    y(this, "id", "starwarsffg");
    y(this, "balanceCurrency", Mt);
    y(this, "currencySnapshotVersion", 2);
  }
  sourceActor(e) {
    return ["minion", "rival", "nemesis", "vehicle", "homestead"].includes(e.type);
  }
  defeated(e) {
    var r, o;
    if ((r = e.statuses) != null && r.has("starwarsffg-defeated")) return !0;
    const t = (o = e.system) == null ? void 0 : o.stats, n = e.type === "vehicle" ? t == null ? void 0 : t.hullTrauma : t == null ? void 0 : t.wounds;
    return Number.isFinite(n == null ? void 0 : n.value) && Number.isFinite(n == null ? void 0 : n.max) && n.max > 0 && n.value > n.max;
  }
  hitPoints() {
    return null;
  }
  received(e, t, n) {
    var r;
    return ((r = t.currency) == null ? void 0 : r.storage) === "balance" ? super.received(e, t, n) : W.received(e, t, n);
  }
  async create(e, t, n, r) {
    var o;
    if (((o = t.currency) == null ? void 0 : o.storage) === "balance") return super.create(e, t, n, r);
    if (!this.received(e, t, n))
      return W.create(e, { ...t, data: this.carriedData(O(t.data)) }, n, r);
  }
  allowsStoredItem(e) {
    return ["armour", "gear", "itemattachment", "weapon"].includes(e == null ? void 0 : e.type);
  }
  carriedData(e) {
    return e.system.equippable && (e.system.equippable.equipped = !1), e;
  }
}
class jt extends Y {
  constructor() {
    super(...arguments);
    y(this, "id", "CoC7");
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
class zt extends Y {
  constructor() {
    super(...arguments);
    y(this, "id", "mosh");
    y(this, "balanceCurrency", Ht);
    y(this, "currencySnapshotVersion", 2);
  }
  sourceActor(e) {
    return e.type === "creature" || e.type === "character" && !e.hasPlayerOwner;
  }
  hitPoints() {
    return null;
  }
  defeated(e) {
    var o, a;
    const { health: t, hits: n, netHP: r } = e.system ?? {};
    return ((a = (o = globalThis.game) == null ? void 0 : o.settings) == null ? void 0 : a.get("mosh", "firstEdition")) === !1 ? (t == null ? void 0 : t.max) > 0 && Number.isFinite(t.value) && t.value <= 0 : (n == null ? void 0 : n.max) > 0 && n.value >= n.max || (r == null ? void 0 : r.max) > 0 && Number.isFinite(r.value) && r.value <= 0;
  }
  allowsStoredItem(e) {
    return ["item", "weapon", "armor"].includes(e == null ? void 0 : e.type);
  }
  carriedData(e) {
    return "equipped" in e.system && (e.system.equipped = !1), e;
  }
}
class Bt extends Y {
  constructor() {
    super(...arguments);
    y(this, "id", "pf1");
    y(this, "balanceCurrency", Et);
    y(this, "currencySnapshotVersion", 2);
  }
  hitPoints() {
    return null;
  }
  // Zero HP is disabled. Negative HP can still be dying.
  defeated(e) {
    var r, o, a, c, l;
    const t = (o = (r = e.system) == null ? void 0 : r.attributes) == null ? void 0 : o.hp, n = (l = (c = (a = e.system) == null ? void 0 : a.abilities) == null ? void 0 : c.con) == null ? void 0 : l.total;
    return (t == null ? void 0 : t.max) > 0 && Number.isFinite(t.value) && n > 0 && t.value <= -n;
  }
  allowsStoredItem(e) {
    var t, n;
    return ["weapon", "equipment", "consumable", "loot", "implant", "container"].includes(e == null ? void 0 : e.type) && e.isPhysical !== !1 && ((t = e.system) == null ? void 0 : t.weaponSubtype) !== "unarmed" && ((n = e.system) == null ? void 0 : n.weaponType) !== "natural";
  }
  carriedData(e) {
    var t;
    return "equipped" in e.system && (e.system.equipped = !1), "carried" in e.system && (e.system.carried = !0), (t = e.system.links) != null && t.children && (e.system.links.children = []), e;
  }
  preview(e) {
    var n, r;
    const t = e.data;
    return t.system.identified !== !1 ? super.preview(e) : {
      name: ((n = t.system.unidentified) == null ? void 0 : n.name) || "Unidentified Item",
      img: t.img,
      type: "loot",
      system: { quantity: E(t), description: { value: ((r = t.system.description) == null ? void 0 : r.unidentified) ?? "" } }
    };
  }
}
const ut = new Map([
  new ot(),
  new Pt(),
  new Ot(),
  new Ut(),
  new Gt(),
  new _t(),
  new Vt(),
  new jt(),
  new zt(),
  new Bt()
].map((s) => [s.id, s]));
function Kt(s, i) {
  ut.set(s, i);
}
function Qt(s) {
  return ut.get(s) ?? W;
}
function ke(s) {
  if (!s.claim.quantityRoll) return s;
  const i = O(s.data);
  return it(i, s.claim.quantityRoll.quantity), { ...s, data: i };
}
class Wt {
  constructor(i) {
    y(this, "queue", new oe());
    y(this, "sourceQueue", new oe());
    this.io = i;
  }
  async collected(i, e, t, n) {
    var o, a, c, l;
    const r = ke(t);
    if (t.claim.quantityRoll) {
      try {
        await ((a = (o = this.io).quantityRolled) == null ? void 0 : a.call(o, r, n));
      } catch (u) {
        console.warn("HoloSuite Loot | Could not post quantity roll", u);
      }
      if (!t.claim.quantityRoll.quantity) return;
    }
    try {
      await ((l = (c = this.io).collected) == null ? void 0 : l.call(c, { token: i, actor: e, entry: r, adapter: n }));
    } catch (u) {
      console.warn("HoloSuite Loot | Could not post loot to chat", u);
    }
  }
  async execute(i, e) {
    if (!qe(i)) throw new m("InvalidRequest");
    return this.queue.run(i.tokenUuid, async () => {
      const t = await this.io.token(i.tokenUuid);
      if (!t) throw new m("Unavailable");
      return this.sourceQueue.run(F(t.actor) ?? t.uuid, () => this.executeToken(i, e, t));
    });
  }
  async executeToken(i, e, t) {
    var v, p, I, b, S, T, q, h, w, C, A, M, $, j, K, ue;
    const n = this.io, r = (R, L = n.environment()) => {
      if (!n.authority()) throw new m("NoGM");
      Tt(t, e, L, R);
    }, o = n.environment();
    if (r(void 0, o), !e.isGM && o.inRange && (i.action === "view" || i.action === "inspect")) {
      const R = await ((v = n.destination) == null ? void 0 : v.call(n, { ...i, actorId: void 0 }, e, t));
      R && r(R);
    }
    const a = n.adapter();
    if (!a) throw new m("Unsupported");
    let c = await n.load(t, a);
    const l = t.actorLink && ((I = (p = t.actor).getFlag) == null ? void 0 : I.call(p, n.moduleId, "linkedLootClaim"));
    if (l) {
      const R = l.tokenUuid === t.uuid ? t : await n.token(l.tokenUuid);
      R != null && R.actorLink && F(R.actor) === F(t.actor) && (R === t ? c : await n.load(R, a)).entries.some((Q) => {
        var N, G;
        return ((N = Q.claim) == null ? void 0 : N.id) === l.id && Q.taken && ((G = Q.claim.source) == null ? void 0 : G.actorUuid) === F(t.actor);
      }) && await t.actor.unsetFlag(n.moduleId, "linkedLootClaim");
    }
    for (const R of c.entries.filter((L) => L.claim && !L.taken)) {
      r();
      const L = await n.actor(R.claim.actorId);
      if (!L) throw new m("RecoveryRequired");
      if (((b = R.claim.quantityRoll) == null ? void 0 : b.quantity) === 0 || (a.received ? a.received(L, R, R.claim) : ((S = L.items.get(R.claim.itemId)) == null ? void 0 : S.getFlag(n.moduleId, "claim")) === R.claim.id)) {
        await ((T = a.reserveSource) == null ? void 0 : T.call(a, t, R, R.claim)), await ((q = a.removeSource) == null ? void 0 : q.call(a, t, R, R.claim));
        const N = O(c);
        N.entries.find((G) => G.id === R.id).taken = !0, await n.save(t, N), c = N, await ((h = a.releaseSource) == null ? void 0 : h.call(a, t, R, R.claim)), await this.collected(t, L, R, a), await ((w = a.cleanup) == null ? void 0 : w.call(a, t, L, R, R.claim));
      }
    }
    if (i.action === "view") return n.summary(t, c);
    if (i.action === "inspect") {
      const R = c.entries.find((L) => L.id === i.entryId && !L.taken && !L.hidden);
      if (!R || R.currency) throw new m("Unavailable");
      return { item: a.preview ? a.preview(R) : O(R.data) };
    }
    const u = n.destination ? await n.destination(i, e, t) : await n.actor(i.actorId);
    We(u, e, a, t), r(u);
    const d = c.entries.filter((R) => !R.taken && !R.hidden && (i.action === "all" || R.id === i.entryId));
    if (!d.length && i.action === "take") return n.summary(t, c);
    const g = [];
    for (const R of d)
      try {
        r(u), We(u, e, a, t);
        let L = c.entries.find((N) => N.id === R.id);
        if (L.claim && (L.claim.userId !== e.id || ![u.id, F(u)].includes(L.claim.actorId)))
          throw new m("RecoveryRequired");
        if (!L.claim) {
          const N = await ((C = a.sourceClaim) == null ? void 0 : C.call(a, t, L));
          r(u);
          let G;
          if (L.formula) {
            if (!N || !a.removeSource) throw new m("SourceChanged");
            G = await n.rollQuantity(L.formula), r(u);
          }
          const Z = O(c);
          Z.entries.find((le) => le.id === L.id).claim = {
            id: n.id(),
            itemId: n.id(),
            userId: e.id,
            actorId: F(u),
            ...G ? { quantityRoll: G } : {},
            ...N ? { source: N } : {}
          }, await n.save(t, Z), c = Z, L = c.entries.find((le) => le.id === R.id);
        }
        r(u), (A = a.validateSourcePlan) == null || A.call(a, t, L, L.claim), await ((M = a.reserveSource) == null ? void 0 : M.call(a, t, L, L.claim)), (($ = L.claim.quantityRoll) == null ? void 0 : $.quantity) !== 0 && await a.create(u, ke(L), L.claim, async () => {
          var Z;
          const N = ((Z = L.currency) == null ? void 0 : Z.storage) === "balance" ? "currencyAttempted" : "itemAttempted", G = O(c);
          G.entries.find((le) => le.id === L.id).claim[N] = !0, await n.save(t, G), c = G, L.claim[N] = !0;
        }), await ((j = a.removeSource) == null ? void 0 : j.call(a, t, L, L.claim));
        const Q = O(c);
        Q.entries.find((N) => N.id === L.id).taken = !0, await n.save(t, Q), c = Q, await ((K = a.releaseSource) == null ? void 0 : K.call(a, t, L, L.claim)), await this.collected(t, u, L, a), await ((ue = a.cleanup) == null ? void 0 : ue.call(a, t, u, L, L.claim));
      } catch (L) {
        if (g.push({ name: R.data.name, code: L.code ?? "TransferFailed" }), !n.authority()) break;
      }
    return { ...n.summary(t, c), failures: g };
  }
}
const Te = "inventoryRules";
function Jt(s) {
  var e, t, n, r, o;
  const i = /^(?:Item\.[\w-]+|Compendium\.[\w-]+\.[\w-]+\.(?:Item\.)?[\w-]+)$/;
  return (o = [(e = s._stats) == null ? void 0 : e.compendiumSource, (t = s._stats) == null ? void 0 : t.duplicateSource, (r = (n = s.flags) == null ? void 0 : n.core) == null ? void 0 : r.sourceId].find((a) => typeof a == "string" && i.test(a))) == null ? void 0 : o.replace(/^(Compendium\.[^.]+\.[^.]+)\.(?!Item\.)/, "$1.Item.");
}
function B(s, i, e) {
  var t;
  if (i.balance) {
    const n = i.id;
    return { token: n, actor: e != null && e.id ? `${e.id}:${n}` : void 0 };
  }
  return {
    token: i.id ? `${s.actorId ?? ((t = s.actor) == null ? void 0 : t.id) ?? ""}:${i.id}` : void 0,
    actor: e != null && e.id && e.items.get(i.id) ? `${e.id}:${i.id}` : void 0,
    global: Jt(i)
  };
}
function se(s, i, e) {
  var t;
  for (const n of ["token", "actor", "global"]) {
    const r = s[n] && ((t = n === "token" ? i : e[n]) == null ? void 0 : t[s[n]]);
    if (r) return { rule: r, scope: n };
  }
  return { rule: { mode: "allow" }, scope: "default" };
}
function He(s, i = "") {
  if (s === "inherit") return null;
  if (s === "allow" || s === "never") return { mode: s };
  if (s !== "quantity" || typeof i != "string" || i.length > 40) throw new m("InvalidRule");
  const e = i.trim().toLowerCase().replace(/\s+/g, "");
  if (/^\d+$/.test(e) && Number.isSafeInteger(Number(e))) return { mode: s, quantity: String(Number(e)) };
  const t = /^(\d{0,3})d([1-9]\d{0,4})(?:[+-]\d{1,6})?$/.exec(e);
  if (t && (t[1] === "" || Number(t[1]) > 0)) return { mode: s, quantity: t[1] ? e : `1${e}` };
  throw new m("InvalidRule");
}
async function kt(s, i, e) {
  if (s.mode === "never") return 0;
  if (s.mode === "allow") return i;
  const { quantity: t } = He(s.mode, s.quantity), n = /^\d+$/.test(t) ? Number(t) : await e(t);
  if (!Number.isSafeInteger(n)) throw new m("InvalidRule");
  return Math.min(i, Math.max(0, n));
}
const lt = (s) => (s == null ? void 0 : s.mode) === "quantity" && !/^\d+$/.test(s.quantity);
function Xe(s, i, e) {
  const t = { ...s };
  for (const n of i)
    e ? t[n] = e : delete t[n];
  return t;
}
function Ve() {
  return game.users.contents.filter((s) => {
    var i;
    return s.active && s.isGM && ((i = s.getFlag) == null ? void 0 : i.call(s, f, "transportVersion")) === Re;
  }).sort((s, i) => s.id.localeCompare(i.id))[0];
}
const P = () => {
  var s;
  return ((s = Ve()) == null ? void 0 : s.id) === game.user.id;
}, dt = "lootRange", ft = 15;
function je() {
  const s = game.settings.get(f, dt);
  return Number.isFinite(s) ? Math.max(0, s) : ft;
}
function Xt(s, i, e) {
  var t, n, r;
  return ((t = s.getCenterPoint) == null ? void 0 : t.call(s, e)) ?? ((r = (n = s.object) == null ? void 0 : n.getCenterPoint) == null ? void 0 : r.call(n, e)) ?? {
    x: e.x + s.width * (i.sizeX ?? i.size) / 2,
    y: e.y + s.height * (i.sizeY ?? i.size) / 2
  };
}
function Ye(s, i) {
  var o;
  const { x: e, y: t } = s._source ?? s, n = { x: e, y: t };
  if (i.isSquare && i.getOffsetRange) {
    const a = s.width * i.size, c = s.height * i.size, [l, u, d, g] = i.getOffsetRange({ ...n, width: a, height: c }), v = [];
    for (let p = l; p < d; p++)
      for (let I = u; I < g; I++) v.push(i.getCenterPoint({ i: p, j: I }));
    if (v.length) return v;
  }
  const r = (o = s.getOccupiedGridSpaceOffsets) == null ? void 0 : o.call(s, { ...n, level: null });
  return r != null && r.length ? r.map(({ i: a, j: c }) => i.getCenterPoint({ i: a, j: c })) : [Xt(s, i, n)];
}
function Yt(s, i, e, t, n) {
  var u;
  const r = s.parent, o = r == null ? void 0 : r.grid;
  if (!(o != null && o.measurePath)) return !1;
  const a = (u = o.units) == null ? void 0 : u.trim().toLowerCase().replace(/\.$/, ""), c = /^(m|meters?|metres?)$/.test(a ?? "") ? t * 0.3048 : /^(yd|yards?)$/.test(a ?? "") ? t / 3 : t, l = Ye(s, o);
  return Array.from(r.tokens ?? []).some((d) => {
    const g = d.actor;
    return d.id === s.id || d.hidden || !te(g, i, e, s) || n && F(g) !== F(n) ? !1 : Ye(d, o).some(({ x: v, y: p }) => l.some((I) => o.measurePath([{ x: v, y: p }, { x: I.x, y: I.y }]).distance <= c + 1e-8));
  });
}
function Zt(s, i) {
  var r, o;
  const e = s.parent;
  if (((r = canvas.scene) == null ? void 0 : r.id) !== e.id) return !1;
  if (!e.tokenVision) return !0;
  const t = s.object;
  if (!t) return !1;
  const n = globalThis.CONFIG;
  return (o = s.hasStatusEffect) != null && o.call(s, n.specialStatusEffects.INVISIBLE) ? !1 : canvas.tokens.placeables.some((a) => {
    var l, u, d, g, v, p, I, b, S, T, q, h, w, C;
    if (a.document.hidden || !((l = a.document.sight) != null && l.enabled) || !((u = a.actor) != null && u.testUserPermission(i, "OWNER")) || (g = (d = a.document).hasStatusEffect) != null && g.call(d, n.specialStatusEffects.BLIND)) return !1;
    let c;
    try {
      const A = a.document.sight, M = ((p = (v = a.document).getVisionOrigin) == null ? void 0 : p.call(v)) ?? { ...a.center, elevation: a.document.elevation };
      if (c = new n.Canvas.visionSourceClass({ object: a, sourceId: `hololoot-${i.id}-${a.id}` }), c.initialize({
        x: M.x,
        y: M.y,
        elevation: M.elevation,
        ...a.document.level != null ? { level: a.document.level } : {},
        rotation: a.document.rotation,
        radius: a.sightRange,
        lightRadius: a.lightPerceptionRange ?? canvas.dimensions.maxR,
        externalRadius: a.externalRadius,
        angle: A.angle,
        visionMode: A.visionMode,
        color: A.color,
        contrast: A.contrast,
        saturation: A.saturation,
        brightness: A.brightness,
        attenuation: A.attenuation
      }), c.isBlinded || !((I = c.los) != null && I.contains(t.center.x, t.center.y))) return !1;
      if ((b = c.shape) != null && b.contains(t.center.x, t.center.y)) return !0;
      const $ = (S = canvas.environment) == null ? void 0 : S.globalLightSource;
      return ($ ? $.active && ((T = $.shape) == null ? void 0 : T.contains(t.center.x, t.center.y)) : e.globalLight && (e.globalLightThreshold == null || e.darkness <= e.globalLightThreshold)) && ((q = c.light) != null && q.contains(t.center.x, t.center.y)) ? !0 : !!((h = c.light) != null && h.contains(t.center.x, t.center.y)) && !!((C = (w = canvas.effects) == null ? void 0 : w.lightSources) != null && C.some((K) => {
        var ue;
        return K.active && ((ue = K.shape) == null ? void 0 : ue.contains(t.center.x, t.center.y));
      }));
    } catch {
      return !1;
    } finally {
      c == null || c.destroy();
    }
  });
}
function es(s) {
  var t, n, r;
  const i = game.settings.get(f, "zeroHP"), e = s ? je() : 0;
  return {
    combats: game.combats.contents,
    automatic: i,
    zeroHP: i,
    manual: !!(s != null && s.manual),
    visible: Zt,
    sourceActor: (t = s == null ? void 0 : s.sourceActor) == null ? void 0 : t.bind(s),
    hitPoints: (n = s == null ? void 0 : s.hitPoints) == null ? void 0 : n.bind(s),
    defeated: (r = s == null ? void 0 : s.defeated) == null ? void 0 : r.bind(s),
    inRange: e > 0 ? (o, a, c) => Yt(o, a, s, e, c) : void 0
  };
}
const ts = new oe(), Ee = (s) => game.journal.find((i) => i.getFlag(f, "tokenUuid") === s.uuid && i.getFlag(f, "kind") === "snapshot"), ye = () => game.settings.get(f, Te) ?? {}, pe = (s) => {
  var i;
  return (i = game.actors) == null ? void 0 : i.get(s.actorId);
}, ht = async (s) => {
  var e, t;
  const i = ((t = (e = globalThis.foundry) == null ? void 0 : e.dice) == null ? void 0 : t.Roll) ?? globalThis.Roll;
  return new i(s).evaluate({ allowInteractive: !1 });
}, we = (s, i) => {
  var e, t;
  return ((t = (e = s.actor) == null ? void 0 : e.items) == null ? void 0 : t.filter((n) => i.eligible(n))) ?? [];
}, Fe = (s, i) => {
  var e;
  return (((e = i.currencyEntries) == null ? void 0 : e.call(i, s.actor)) ?? []).map((t) => ({
    ...t.data,
    id: `currency:${t.currency.unit}`,
    balance: t
  }));
}, Pe = (s) => k(s).source === "custom", xe = (s) => JSON.parse((s == null ? void 0 : s.getFlag(f, "rules")) ?? "{}"), z = (s) => `flags.${f}.${s}`, Me = ({ id: s, hidden: i }) => ({ id: s, taken: !1, ...i ? { hidden: !0 } : {} }), mt = (s) => s.mode === "quantity" ? s.quantity : s.mode, ie = (s, i) => s.setFlag(f, "state", {
  ...i,
  entries: i.entries.map((e) => {
    var r;
    if (!((r = e.claim) != null && r.quantityRoll)) return e;
    const { quantityRoll: t, ...n } = e.claim;
    return { ...e, claim: n };
  })
}), gt = (s, i, e) => {
  var t, n, r;
  return lt(e) && ((t = s.system) == null ? void 0 : t.quantity) != null && i.sourceClaim && i.removeSource && !s.balance && !((r = (n = i.entryMetadata) == null ? void 0 : n.call(i, s)) != null && r.currency);
};
async function ss(s) {
  const i = He("quantity", s);
  if (!lt(i)) throw new m("InvalidRule");
  const e = await ht(i.quantity);
  if (!Number.isSafeInteger(e.total)) throw new m("InvalidRule");
  return { quantity: Math.max(0, e.total), roll: e.toJSON() };
}
function yt(s, i, e) {
  const t = ae(e), n = s.filter((r) => ae(i.snapshot(r)) === t);
  return n.length === 1 && n[0].id ? n[0] : void 0;
}
async function fe(s, i, e, t, { original: n, previousRoll: r, legacyRollCeiling: o, onRoll: a } = {}) {
  var I;
  const c = s.balance ? structuredClone(s.balance.data) : i.snapshot(s);
  if (i.manual) return { id: foundry.utils.randomID(), data: c, wholeItem: !0, source: { itemId: s.id, ruleKey: e } };
  const l = n ?? E(c), u = Math.min(l, E(c)), d = r === void 0 && o === void 0 && gt(s, i, t) ? t.quantity : void 0;
  let g, v;
  const p = d ? u : await kt(t, u, async (b) => {
    if (r === void 0 && o !== void 0)
      return v = o, v;
    if (r !== void 0)
      g = r;
    else {
      const S = await ht(b);
      g = S.total, a == null || a(S);
    }
    return g;
  });
  return it(c, p), {
    id: foundry.utils.randomID(),
    data: c,
    originalQuantity: l,
    limit: mt(t),
    hidden: p === 0,
    ...d ? { formula: d } : {},
    ...g === void 0 ? {} : { rolledQuantity: g },
    ...v === void 0 ? {} : { rollCeiling: v },
    ...s.balance ? { currency: { ...s.balance.currency, amount: p } } : { ...s.id ? { source: { itemId: s.id, ruleKey: e } } : {}, ...(I = i.entryMetadata) == null ? void 0 : I.call(i, s, p) }
  };
}
function pt(s, i) {
  var u, d, g;
  const e = Ee(s), t = e == null ? void 0 : e.getFlag(f, "state"), n = e == null ? void 0 : e.getFlag(f, "items"), r = new Map(Array.isArray(n) ? n.map((v) => [v.id, v]) : []), o = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), c = [...we(s, i), ...Fe(s, i)], l = i.snapshot && !Pe(s) && !((u = s.getFlag(f, "config")) != null && u.customId);
  for (const v of (t == null ? void 0 : t.entries) ?? []) {
    const p = r.get(v.id);
    if (((d = p == null ? void 0 : p.currency) == null ? void 0 : d.storage) === "balance")
      o.set(`currency:${p.currency.unit}`, { ...p, ...v });
    else if ((g = p == null ? void 0 : p.source) != null && g.ruleKey)
      o.set(p.source.ruleKey, { ...p, ...v });
    else if (l && (p != null && p.data) && !p.currency && !p.source) {
      const I = yt(c.filter((S) => !S.balance), i, p.data);
      if (!I) continue;
      const b = B(s, I).token;
      a.set(b, a.has(b) ? null : { ...p, ...v });
    }
  }
  for (const [v, p] of a) p && !o.has(v) && o.set(v, p);
  return {
    vault: e,
    state: t,
    byId: r,
    byKey: o,
    items: c,
    corpse: xe(e),
    shared: ye(),
    locked: Pe(s) || !t && (s.getFlag(f, "state") || e && !e.getFlag(f, "draft"))
  };
}
function is(s, i) {
  const { state: e, byKey: t, items: n, corpse: r, shared: o, locked: a } = pt(s, i), c = pe(s);
  return n.map((l) => {
    var v, p;
    const u = B(s, l, c), d = t.get(u.token), g = a ? "RuleLocked" : !u.token || e && !d ? "RuleMissingSnapshot" : d != null && d.taken ? "RuleCollected" : d != null && d.claim ? "RuleReserved" : "";
    return {
      id: l.id,
      name: l.name,
      img: l.img,
      quantity: E(l),
      entry: d,
      effective: se(u, r, o),
      overrides: { token: r[u.token], actor: (v = o.actor) == null ? void 0 : v[u.actor], global: (p = o.global) == null ? void 0 : p[u.global] },
      canToken: !g,
      tokenUnavailable: g,
      canActor: !!u.actor,
      canGlobal: !!u.global
    };
  });
}
async function ns(s, i, e, t, n) {
  if (!P()) throw new m("RuleGM");
  const { vault: r, state: o, byId: a, byKey: c, items: l, corpse: u, shared: d, locked: g } = pt(s, i), v = pe(s), p = l.filter((h) => t.includes(h.id)).map((h) => ({ item: h, key: B(s, h, v)[e] }));
  if (!t.length || p.length !== t.length || p.some(({ key: h }) => !h)) throw new m("RuleScopeUnavailable");
  const I = p.map(({ key: h }) => h);
  if (e === "actor" || e === "global")
    return ts.run(Te, async () => {
      if (!P()) throw new m("RuleGM");
      const h = ye(), w = { ...h, [e]: Xe(h[e], I, e === "global" && (n == null ? void 0 : n.mode) === "allow" ? null : n) };
      await game.settings.set(f, Te, w);
    });
  if (e !== "token" || g) throw new m("RuleScopeUnavailable");
  if (o && I.some((h) => {
    const w = c.get(h);
    return !w || w.taken || w.claim;
  })) throw new m("RuleScopeUnavailable");
  const b = Xe(u, I, n);
  if (!r) {
    Object.keys(b).length && await wt(s, [], { rules: JSON.stringify(b), draft: !0 });
    return;
  }
  if (!o) {
    await r.setFlag(f, "rules", JSON.stringify(b));
    return;
  }
  const S = /* @__PURE__ */ new Map(), T = [];
  for (const { item: h, key: w } of p) {
    const C = c.get(w), A = se(B(s, h, v), b, d).rule;
    if (C.limit !== mt(A) || !C.formula && gt(h, i, A)) {
      let M;
      const $ = await fe(h, i, w, A, {
        original: C.originalQuantity ?? E(C.data),
        onRoll: (j) => {
          M = j;
        }
      });
      S.set(C.id, $), M && T.push({ roll: M, itemName: h.name, quantity: E($.data) });
    }
  }
  if (!P()) throw new m("RuleGM");
  const q = {
    ...o,
    vaultId: r.id,
    entries: o.entries.map((h) => S.has(h.id) ? Me(S.get(h.id)) : h)
  };
  return await r.update({
    [z("rules")]: JSON.stringify(b),
    [z("state")]: q,
    [z("items")]: Array.from(a.values(), (h) => S.get(h.id) ?? h)
  }), await ie(s, q), T;
}
async function wt(s, i, e) {
  var r, o;
  const n = await (((o = (r = globalThis.foundry) == null ? void 0 : r.documents) == null ? void 0 : o.JournalEntry) ?? globalThis.JournalEntry).create({
    name: `HoloLoot · ${s.name}`,
    ownership: { default: 0 },
    flags: { [f]: { tokenUuid: s.uuid, kind: "snapshot", items: structuredClone(i), ...e } }
  });
  if (!n) throw new m("PersistenceFailed");
  return n.id;
}
function Ce(s, i, e) {
  const t = game.journal.get(s);
  if (!t || t.getFlag(f, "tokenUuid") !== i.uuid || t.getFlag(f, "kind") !== e) throw new m("RecoveryRequired");
  const n = t.getFlag(f, "items");
  if (!Array.isArray(n)) throw new m("RecoveryRequired");
  return structuredClone(n);
}
function vt(s, i) {
  const e = k(s);
  return !!(s.actor && (i.manual || e.source !== "custom" && !e.customId) && i.sourceClaim && i.removeSource);
}
function rs(s, i) {
  var o;
  const e = Ee(s), t = new Set((o = e == null ? void 0 : e.getFlag(f, "state")) == null ? void 0 : o.entries.filter((a) => !a.taken).map((a) => a.id)), n = e == null ? void 0 : e.getFlag(f, "items"), r = new Set((Array.isArray(n) ? n : []).filter((a) => a.wholeItem && t.has(a.id)).map((a) => {
    var c;
    return (c = a.source) == null ? void 0 : c.ruleKey;
  }));
  return we(s, i).map((a) => ({
    id: a.id,
    name: a.name,
    img: a.img,
    selected: r.has(B(s, a, null).token)
  }));
}
async function as(s, i, e, t, n) {
  if (!P()) throw new m("RuleGM");
  if (!i.manual || !["enabled", "disabled"].includes(e)) throw new m("InvalidRequest");
  await bt(s, i, { mode: e, ids: new Set(t) }), await s.setFlag(f, "config", {
    ...k(s),
    mode: e,
    source: "inventory",
    ...typeof n == "boolean" ? { keepLinkedActor: n } : {}
  });
}
async function bt(s, i, e) {
  var T, q;
  if (!P()) throw new m("RuleGM");
  if (!vt(s, i) || i.manual && !e) throw new m("RefreshUnsupported");
  const t = Ee(s), n = t == null ? void 0 : t.getFlag(f, "state");
  if (!n) {
    await ze(s, i, e);
    return;
  }
  if (n.version !== 1) throw new m("RecoveryRequired");
  const r = n.entries.filter((h) => h.claim || h.taken), o = (h) => {
    var w, C, A, M;
    return ((C = (w = h.claim) == null ? void 0 : w.source) == null ? void 0 : C.itemId) || ((M = (A = h.claim) == null ? void 0 : A.source) == null ? void 0 : M.currency) && `currency:${h.claim.source.currency}`;
  };
  if (s.actorLink && r.some((h) => {
    var w, C;
    return ((C = (w = h.claim) == null ? void 0 : w.source) == null ? void 0 : C.actorUuid) !== F(s.actor);
  }) || r.some((h) => !o(h)))
    throw new m("RefreshUntracked");
  const a = new Set(r.filter((h) => !h.taken).map(o)), c = Ce(t.id, s, "snapshot"), l = new Map(c.map((h) => [h.id, h]));
  if (r.some((h) => !h.taken && !l.has(h.id))) throw new m("RecoveryRequired");
  const u = /* @__PURE__ */ new Map();
  for (const h of n.entries) {
    const w = l.get(h.id), C = ((T = w == null ? void 0 : w.source) == null ? void 0 : T.ruleKey) || ((q = w == null ? void 0 : w.currency) == null ? void 0 : q.storage) === "balance" && `currency:${w.currency.unit}`;
    C && u.set(C, { saved: w, taken: h.taken });
  }
  const d = (h, w) => (w && !w.taken && ae({ ...h, id: w.saved.id }) === ae(w.saved) && (h.id = w.saved.id), h), g = pe(s), v = xe(t), p = ye(), I = [];
  for (const h of [...we(s, i), ...Fe(s, i)]) {
    if (a.has(h.id) || i.manual && !(e != null && e.ids.has(h.id))) continue;
    const w = B(s, h, g), C = u.get(w.token), A = C == null ? void 0 : C.saved.limit, M = A === void 0 ? se(w, v, p).rule : He(A === "allow" || A === "never" ? A : "quantity", A), $ = C == null ? void 0 : C.saved.rolledQuantity, j = A === void 0 || C.saved.formula ? void 0 : C.saved.rollCeiling ?? E(C.saved.data);
    I.push(d(await fe(h, i, w.token, M, { previousRoll: $, legacyRollCeiling: j }), C));
  }
  if (!P()) throw new m("RuleGM");
  const b = {
    ...n,
    vaultId: t.id,
    currencyReady: i.currencySnapshotVersion ?? !0,
    entries: [...r, ...I.map(Me)]
  }, S = r.flatMap((h) => l.has(h.id) ? [l.get(h.id)] : []);
  await t.update({
    [z("state")]: b,
    [z("items")]: [...S, ...I],
    ...e ? { [z("manualMode")]: e.mode } : {}
  }), await ie(s, b);
}
async function ze(s, i, e) {
  const t = Ee(s);
  if (i.manual && !e && (t == null ? void 0 : t.getFlag(f, "manualMode")) !== "enabled") throw new m("Unavailable");
  let n = t == null ? void 0 : t.getFlag(f, "state");
  if (!n && (s.getFlag(f, "state") || t && !t.getFlag(f, "draft")))
    throw new m("RecoveryRequired");
  if (!n) {
    const c = k(s), l = ye(), u = xe(t), d = pe(s), g = [];
    if (!i.manual && Pe(s)) {
      const I = c.customId ? Ce(c.customId, s, "custom") : [];
      g.push(...I.map((b) => ({ id: foundry.utils.randomID(), data: b })));
    } else
      for (const I of we(s, i)) {
        if (i.manual && !(e != null && e.ids.has(I.id))) continue;
        const b = B(s, I, d), { rule: S } = se(b, u, l);
        g.push(await fe(I, i, b.token, S));
      }
    for (const I of Fe(s, i)) {
      const b = B(s, I, d);
      g.push(await fe(I, i, b.token, se(b, u, l).rule));
    }
    const v = { version: 1, currencyReady: i.currencySnapshotVersion ?? !0, entries: g.map(Me) }, p = t ? t.id : await wt(s, g, { state: v, ...e ? { manualMode: e.mode } : {} });
    n = { ...v, vaultId: p }, t && await t.update({
      [z("items")]: g,
      [z("state")]: n,
      [z("draft")]: !1,
      ...e ? { [z("manualMode")]: e.mode } : {}
    }), await ie(s, n);
  }
  if (n.version !== 1) throw new m("RecoveryRequired");
  n = { ...n, vaultId: n.vaultId ?? (t == null ? void 0 : t.id) };
  const r = i.currencySnapshotVersion ?? !0;
  if ((!n.currencyReady || i.currencySnapshotVersion && n.currencyReady !== r) && i.currencyEntries) {
    const c = t ?? game.journal.get(n.vaultId), l = c.getFlag(f, "items"), u = Array.isArray(l) ? structuredClone(l) : n.entries.every((g) => g.taken) ? [] : Ce(n.vaultId, s, "snapshot"), d = [];
    for (const g of Fe(s, i)) {
      const v = B(s, g, pe(s));
      d.push(await fe(g, i, v.token, se(v, xe(c), ye()).rule));
    }
    n = { ...n, currencyReady: r, entries: [...n.entries, ...d.map(Me)] }, d.length ? await c.update({ [`flags.${f}.items`]: [...u, ...d], [`flags.${f}.state`]: n }) : await c.setFlag(f, "state", n), await ie(s, n);
  }
  const o = s.getFlag(f, "state");
  if ((!o || i.currencySnapshotVersion && o.currencyReady !== n.currencyReady) && await ie(s, n), n.entries.every((c) => c.taken)) return {
    ...n,
    entries: n.entries.map((c) => ({ ...c, data: null }))
  };
  const a = Ce(n.vaultId, s, "snapshot");
  return { ...n, entries: n.entries.flatMap((c) => {
    var p, I, b;
    if (c.taken) return [{ ...c, data: null }];
    const l = a.find((S) => S.id === c.id), u = l == null ? void 0 : l.data;
    if (!u || !i.acceptsLegacyWholeItems && !!l.wholeItem != !!i.manual) throw new m("RecoveryRequired");
    let d = l.source;
    const g = i.allowsStoredItem && (d != null && d.itemId) ? (p = s.actor) == null ? void 0 : p.items.get(d.itemId) : null, v = i.allowsStoredItem && ((I = l.currency) == null ? void 0 : I.storage) !== "balance" && (!i.allowsStoredItem(u) || g && !i.allowsStoredItem(g));
    if (v && !c.claim) return [];
    if (!v && !d && !l.currency && !((b = s.getFlag(f, "config")) != null && b.customId) && i.snapshot) {
      const S = yt(we(s, i), i, u);
      S && (d = { itemId: S.id });
    }
    return [{
      ...c,
      data: u,
      ...v ? { hidden: !0 } : {},
      ...l.wholeItem ? { wholeItem: !0 } : {},
      ...l.formula ? { formula: l.formula } : {},
      ...l.currency ? { currency: l.currency } : {},
      ...d ? { source: d } : {}
    }];
  }) };
}
async function os(s, i) {
  const e = {
    version: 1,
    ...i.currencyReady ? { currencyReady: i.currencyReady } : {},
    vaultId: i.vaultId,
    entries: i.entries.map(({ id: n, taken: r, claim: o, hidden: a }) => ({
      id: n,
      taken: !!r,
      ...o ? { claim: o } : {},
      ...a ? { hidden: a } : {}
    }))
  }, t = game.journal.get(i.vaultId);
  if ((t == null ? void 0 : t.getFlag(f, "tokenUuid")) !== s.uuid) throw new m("RecoveryRequired");
  await t.setFlag(f, "state", e), await ie(s, e);
}
function cs(s, i) {
  return {
    tokenUuid: s.uuid,
    name: s.name,
    img: s.texture.src,
    entries: i.entries.filter((e) => !e.taken && !e.hidden).map((e) => {
      var c, l, u, d, g, v, p, I, b, S, T, q, h, w, C, A, M, $, j, K;
      const t = { ...e.data, system: e.data.system ?? {} }, n = t.system.identified === !1 || ((c = t.system.identification) == null ? void 0 : c.status) === "unidentified", r = n ? ((l = t.system.unidentified) == null ? void 0 : l.description) ?? ((u = t.system.description) == null ? void 0 : u.unidentified) : typeof t.system.description == "string" ? t.system.description : (d = t.system.description) == null ? void 0 : d.value, o = typeof t.system.rarity == "string" ? t.system.rarity : typeof ((g = t.system.traits) == null ? void 0 : g.rarity) == "string" ? t.system.traits.rarity : "", a = ((I = (p = (v = globalThis.CONFIG) == null ? void 0 : v.DND5E) == null ? void 0 : p.itemRarity) == null ? void 0 : I[o]) ?? ((T = (S = (b = globalThis.CONFIG) == null ? void 0 : b.PF2E) == null ? void 0 : S.rarityTraits) == null ? void 0 : T[o]);
      return {
        id: e.id,
        name: e.currency ? (h = (q = game.i18n).has) != null && h.call(q, `HL.Currency.${e.currency.unit}`) ? game.i18n.localize(`HL.Currency.${e.currency.unit}`) : t.name : n ? ((w = t.system.unidentified) == null ? void 0 : w.name) || ((A = (C = t.system.identification) == null ? void 0 : C.unidentified) == null ? void 0 : A.name) || game.i18n.localize("HL.Unidentified") : t.name,
        currency: !!e.currency,
        img: n && (($ = (M = t.system.identification) == null ? void 0 : M.unidentified) == null ? void 0 : $.img) || t.img,
        quantity: e.wholeItem ? 1 : ((j = e.currency) == null ? void 0 : j.amount) ?? E(t),
        ...e.wholeItem ? { wholeItem: !0 } : {},
        ...e.formula ? { formula: e.formula } : {},
        type: e.currency ? game.i18n.localize("HL.CurrencyLabel") : game.i18n.localize(`TYPES.Item.${t.type}`),
        rarity: n || !o ? "" : game.i18n.localize(typeof a == "string" ? a : o),
        tooltip: ((K = new DOMParser().parseFromString(r ?? "", "text/html").body.textContent) == null ? void 0 : K.slice(0, 1500)) ?? "",
        pending: !!e.claim
      };
    })
  };
}
function us(s, i = s) {
  const e = `${i} |`;
  return {
    log: (t, ...n) => console.log(e, t, ...n),
    warn: (t, ...n) => console.warn(e, t, ...n),
    error: (t, ...n) => console.error(e, t, ...n)
  };
}
function ls(s, i = {}) {
  const e = i.socketName ?? `module.${s}`, t = us(s, i.title ?? s);
  return {
    socketName: e,
    emit(n) {
      var o;
      const r = (o = globalThis.game) == null ? void 0 : o.socket;
      return r != null && r.emit ? (r.emit(e, n), !0) : (t.warn("Foundry socket is unavailable.", n), !1);
    },
    isGMSender(n) {
      var r, o, a;
      return n ? !!((a = (o = (r = globalThis.game) == null ? void 0 : r.users) == null ? void 0 : o.get(String(n))) != null && a.isGM) : !1;
    }
  };
}
const Ze = ls(f, { title: "HoloSuite Loot" }), he = /* @__PURE__ */ new Map(), ds = new oe();
async function fs(s, i) {
  game.socket.on(Ze.socketName, (e) => {
    (e == null ? void 0 : e.type) === "refresh" && typeof e.tokenUuid == "string" && i(e.tokenUuid);
  }), Hooks.on("updateUser", (e, t, n, r) => {
    var a, c, l;
    if (e.id === game.user.id && ((c = (a = t.flags) == null ? void 0 : a[f]) != null && c[Ne])) {
      let u;
      try {
        u = JSON.parse(e.getFlag(f, Ne));
      } catch {
        return;
      }
      const d = he.get(u == null ? void 0 : u.id);
      d && d.gm === r && ((l = game.users.get(r)) != null && l.isGM) && (clearTimeout(d.timer), he.delete(u.id), u.result.error ? d.reject(new m(u.result.error)) : d.resolve(structuredClone(u.result)));
    }
    const o = At(e, t, r, st);
    !o || !P() || typeof o.id != "string" || !/^[\w-]{1,64}$/.test(o.id) || ds.run(e.id, async () => {
      if (!P()) return;
      let u;
      try {
        if (!qe(o)) throw new m("InvalidRequest");
        u = await s.execute(o, e);
      } catch (d) {
        console.warn("HoloSuite Loot | Request failed", d), u = { error: d.code ?? "TransferFailed" };
      }
      await e.setFlag(f, Ne, JSON.stringify({ id: o.id, result: u })), qe(o) && ["take", "all"].includes(o.action) && Ze.emit({ type: "refresh", tokenUuid: o.tokenUuid });
    }).catch((u) => console.warn("HoloSuite Loot | Could not deliver reply", u));
  }), game.user.isGM && await game.user.setFlag(f, "transportVersion", Re);
}
async function hs(s, i) {
  if (!qe(s)) throw new m("InvalidRequest");
  const e = Ve();
  if (!e) throw new m(game.users.contents.some((n) => n.active && n.isGM) ? "BuildMismatch" : "NoGM");
  if (e.id === game.user.id && i) return i.execute(s, game.user);
  const t = foundry.utils.randomID();
  return new Promise((n, r) => {
    const o = setTimeout(() => {
      he.delete(t), r(new m("Timeout"));
    }, s.action === "view" ? 8e3 : 2e4);
    he.set(t, { resolve: n, reject: r, timer: o, gm: e.id }), game.user.setFlag(f, st, { ...s, id: t }).catch((a) => {
      clearTimeout(o), he.delete(t), r(a);
    });
  });
}
function ms() {
  var s, i, e;
  return ((i = (s = globalThis.foundry) == null ? void 0 : s.applications) == null ? void 0 : i.api) ?? ((e = foundry == null ? void 0 : foundry.applications) == null ? void 0 : e.api) ?? null;
}
function gs() {
  var s, i, e;
  return ((i = (s = globalThis.foundry) == null ? void 0 : s.appv1) == null ? void 0 : i.api) ?? ((e = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : e.api) ?? null;
}
function ys(s = {}, i = {}) {
  var t, n, r;
  const e = ((n = (t = globalThis.foundry) == null ? void 0 : t.utils) == null ? void 0 : n.mergeObject) ?? ((r = foundry == null ? void 0 : foundry.utils) == null ? void 0 : r.mergeObject);
  return typeof e == "function" ? e(s, i, { inplace: !1 }) : { ...s, ...i };
}
function ps() {
  var s, i, e, t, n;
  return ((e = (i = (s = globalThis.foundry) == null ? void 0 : s.utils) == null ? void 0 : i.randomID) == null ? void 0 : e.call(i, 8)) ?? ((n = (t = foundry == null ? void 0 : foundry.utils) == null ? void 0 : t.randomID) == null ? void 0 : n.call(t, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function et(s = {}) {
  return {
    id: String(s.id ?? `legacy-application-${ps()}`),
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
function ws(s) {
  return class extends s {
    constructor(t = {}) {
      const n = ys(new.target.defaultOptions ?? {}, t);
      super(et(n));
      y(this, "_v1Options");
      this._v1Options = n;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return et(this.defaultOptions ?? {});
    }
    activateListeners(t) {
    }
    async _renderHTML(t, n) {
      var l, u, d;
      const r = typeof this.getData == "function" ? await this.getData() : {}, o = ((l = this._v1Options) == null ? void 0 : l.template) ?? ((u = this.options) == null ? void 0 : u.template) ?? ((d = this.constructor.defaultOptions) == null ? void 0 : d.template);
      if (!o) return document.createDocumentFragment();
      const a = await globalThis.renderTemplate(o, r), c = document.createElement("template");
      return c.innerHTML = a.trim(), c.content;
    }
    _activateV1Form(t) {
      var r, o;
      if (typeof this._updateObject != "function") return;
      const n = (r = t.matches) != null && r.call(t, "form") ? t : (o = t.querySelector) == null ? void 0 : o.call(t, "form");
      n instanceof HTMLFormElement && n.addEventListener("submit", async (a) => {
        var l;
        a.preventDefault(), a.stopPropagation();
        const c = new FormData(n);
        await this._updateObject(a, c), ((l = this._v1Options) == null ? void 0 : l.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(t, n, r) {
      var u, d, g, v;
      n.replaceChildren(t);
      const o = globalThis.jQuery ?? globalThis.$, a = ((u = n.closest) == null ? void 0 : u.call(n, ".window-app, .app, .application")) ?? n, c = o ? o(a) : a;
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
      Array.isArray(l) && l.length && (n.classList.add(...l), (v = (g = n.closest) == null ? void 0 : g.call(n, ".window-app, .app, .application")) == null || v.classList.add(...l)), this._activateV1Form(n), typeof this.activateListeners == "function" && this.activateListeners(o ? o(n) : n);
    }
  };
}
function vs() {
  const s = ms(), i = gs(), e = globalThis.Application ?? (i == null ? void 0 : i.Application) ?? (s == null ? void 0 : s.ApplicationV1) ?? globalThis.FormApplication ?? (i == null ? void 0 : i.FormApplication) ?? (s == null ? void 0 : s.FormApplication);
  if (e) return e;
  const t = s == null ? void 0 : s.ApplicationV2;
  return t ? ws(t) : null;
}
class bs {
  constructor(i, e) {
    y(this, "outside", (i) => {
      i.composedPath().includes(this.root) || this.dismiss();
    });
    this.root = i, this.dismiss = e, document.addEventListener("pointerdown", this.outside, !0);
  }
  destroy() {
    document.removeEventListener("pointerdown", this.outside, !0);
  }
}
class Ss {
  constructor(i, e, t, n) {
    y(this, "frame", 0);
    y(this, "destroyed", !1);
    y(this, "svg");
    y(this, "line");
    y(this, "lastGeometry", "");
    y(this, "outside", (i) => {
      var t, n;
      const e = i.composedPath();
      i.button === 2 && e.includes(((t = canvas.app) == null ? void 0 : t.canvas) ?? ((n = canvas.app) == null ? void 0 : n.view)) || e.includes(this.root) || this.dismiss();
    });
    y(this, "update", () => {
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
        const r = i.getBoundingClientRect(), o = canvas.app.renderer.screen, a = canvas.stage.worldTransform.apply(e.center), c = r.left + a.x * r.width / o.width, l = r.top + a.y * r.height / o.height, u = this.root.getBoundingClientRect(), d = 24 + Math.min(60, (e.w ?? 0) * Math.abs(canvas.stage.worldTransform.a) / 2), g = c + d + u.width <= innerWidth - 8 ? c + d : c - d - u.width, v = Math.max(8, Math.min(innerWidth - u.width - 8, g)), p = Math.max(8, Math.min(innerHeight - u.height - 8, l - u.height / 3));
        (Math.abs(u.left - v) > 0.5 || Math.abs(u.top - p) > 0.5) && this.position(v, p);
        const I = this.root.querySelector(".hl-panel") ?? this.root, b = I.getBoundingClientRect(), S = getComputedStyle(I), T = parseFloat(S.borderLeftWidth) || 3, q = Math.min(parseFloat(S.borderTopLeftRadius) || 0, b.height / 2, b.width / 2), h = c <= b.left || c >= b.right, w = h ? c <= b.left ? b.left + T / 2 : b.right - T / 2 : Math.max(b.left + q, Math.min(b.right - q, c)), C = h ? Math.max(b.top + q, Math.min(b.bottom - q, l)) : l < (b.top + b.bottom) / 2 ? b.top + T / 2 : b.bottom - T / 2, A = `${c},${l},${w},${C}`;
        A !== this.lastGeometry && (this.line.setAttribute("x1", String(c)), this.line.setAttribute("y1", String(l)), this.line.setAttribute("x2", String(w)), this.line.setAttribute("y2", String(C)), this.lastGeometry = A), this.line.style.stroke = S.borderLeftColor, this.line.style.strokeWidth = String(T), this.svg.style.zIndex = String(Math.max(0, (parseInt(getComputedStyle(this.root).zIndex) || 100) - 1));
      }
      this.frame = requestAnimationFrame(this.update);
    });
    this.root = i, this.token = e, this.position = t, this.dismiss = n;
    const r = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(r, "svg"), this.svg.classList.add("hl-loot-tether"), this.svg.setAttribute("aria-hidden", "true"), this.line = document.createElementNS(r, "line"), this.svg.append(this.line), document.body.append(this.svg), document.addEventListener("pointerdown", this.outside, !0), this.frame = requestAnimationFrame(this.update);
  }
  destroy() {
    this.destroyed = !0, cancelAnimationFrame(this.frame), document.removeEventListener("pointerdown", this.outside, !0), this.svg.remove();
  }
}
const ee = (s) => String(s ?? "").replace(/[&<>"']/g, (i) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[i]);
async function Is({ roll: s, itemName: i, quantity: e }) {
  var o;
  const { game: t } = globalThis, n = t.i18n.format("HL.QuantityRollChat", { item: ee(i), quantity: e }), r = ((o = t.release) == null ? void 0 : o.generation) >= 14 ? { messageMode: "self" } : { rollMode: "selfroll" };
  await s.toMessage({ flavor: n }, r);
}
async function Ls(s, i) {
  var d;
  const { game: e, foundry: t, ChatMessage: n } = globalThis, r = s.claim.quantityRoll, o = i.preview ? i.preview(s) : s.data, c = (((d = t == null ? void 0 : t.dice) == null ? void 0 : d.Roll) ?? globalThis.Roll).fromData(r.roll), l = e.i18n.format("HL.PickupRollChat", { item: ee(o.name), quantity: r.quantity }), u = await c.toMessage({ flavor: l }, { create: !1 });
  await n.create({ ...u, whisper: [s.claim.userId], blind: !1 });
}
async function Cs({ token: s, actor: i, entry: e, adapter: t }) {
  var c;
  const { game: n, ChatMessage: r } = globalThis;
  if (!n.settings.get(f, "chatLog")) return;
  const o = t.preview ? t.preview(e) : e.data, a = n.i18n.format("HL.ChatLooted", {
    actor: ee(i.name),
    source: ee(s.name),
    item: ee(o.name),
    quantity: ee(e.wholeItem ? 1 : ((c = e.currency) == null ? void 0 : c.amount) ?? E(o))
  });
  await r.create({
    speaker: r.getSpeaker({ actor: i }),
    content: `<p>${a}</p>`,
    whisper: [],
    blind: !1,
    flags: { [f]: { claimId: e.claim.id, userId: e.claim.userId } }
  });
}
const St = vs(), It = (s) => `modules/${f}/templates/${s}.hbs`, H = (s) => game.i18n.localize(`HL.${s}`);
function _(s) {
  const i = H((s == null ? void 0 : s.code) ?? "TransferFailed");
  return ui.notifications.warn(i), i;
}
const Lt = (s) => s instanceof HTMLElement ? s : s[0];
class Rs extends St {
  constructor(e, t, n) {
    super({ id: `hololoot-${e.id}` });
    y(this, "token");
    y(this, "send");
    y(this, "adapter");
    y(this, "data", { entries: [] });
    y(this, "destination", "");
    y(this, "busy", !1);
    y(this, "message", "");
    y(this, "loading", !1);
    y(this, "firstDraw", null);
    y(this, "resolveFirstDraw", null);
    y(this, "refreshing", null);
    y(this, "refreshAgain", !1);
    y(this, "disposed", !1);
    y(this, "presentation", null);
    this.token = e, this.send = t, this.adapter = n;
    const r = game.user.character;
    te(r, game.user, n, e) && (this.destination = n.manual ? F(r) : r.id);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: "HoloSuite Loot",
      classes: ["holosuite-loot-window", "holosuite-loot-popup"],
      template: It("loot"),
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
            _(e), await this.close();
            return;
          }
          this.data = { entries: [] }, this.message = _(e);
        }
        this.loading = !1, this.disposed || this.render(!0);
      })().finally(() => {
        this.refreshing = null, this.refreshAgain && !this.disposed && !this.busy && this.refresh();
      }), this.refreshing);
    }
  }
  getData() {
    var c, l;
    const e = game.settings.get(f, "characterSelector"), t = game.settings.get(f, "panelTheme"), n = this.adapter.manual ? [...new Map([...game.actors.contents, ...Array.from(((c = canvas.scene) == null ? void 0 : c.tokens) ?? [], (u) => u.actor)].filter((u) => te(u, game.user, this.adapter, this.token)).map((u) => [F(u), u])).values()] : game.actors.contents.filter((u) => te(u, game.user, this.adapter)), r = (u) => this.adapter.manual ? F(u) : u.id;
    let o = "";
    if (e)
      !this.destination && n.length === 1 && (this.destination = r(n[0]));
    else try {
      this.destination = F(rt(game.user, game.actors.contents, (l = canvas.scene) == null ? void 0 : l.tokens, this.adapter, this.token));
    } catch (u) {
      this.destination = "", o = H(u.code);
    }
    const a = e ? n.some((u) => r(u) === this.destination) : !!this.destination;
    return {
      ...this.data,
      name: this.data.name ?? this.token.name,
      img: this.data.img ?? this.token.texture.src,
      actors: n.map((u) => ({ id: r(u), name: u.name, selected: r(u) === this.destination })),
      disabled: this.loading || this.busy || !a || !this.data.entries.length,
      loading: this.loading,
      showSelector: e,
      theme: t,
      busy: this.busy,
      message: this.message || o || (!n.length && e ? H("NoActor") : ""),
      empty: !this.loading && !this.data.entries.length && !this.message
    };
  }
  activateListeners(e) {
    var r, o, a;
    if (super.activateListeners(e), this.disposed) return;
    const t = Lt(e);
    (r = this.presentation) == null || r.destroy();
    const n = t.closest(".window-app, .application") ?? t.closest(".holosuite-loot-popup") ?? t;
    this.presentation = new Ss(
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
    }), (a = this.resolveFirstDraw) == null || a.call(this), this.resolveFirstDraw = null;
  }
  async inspect(e) {
    try {
      const n = { ...(await this.send({ action: "inspect", entryId: e, tokenUuid: this.token.uuid })).item, ownership: { default: 0, [game.user.id]: 2 } }, r = globalThis.CONFIG.Item.documentClass;
      new r(n, { temporary: !0 }).sheet.render(!0, { editable: !1 });
    } catch (t) {
      _(t);
    }
  }
  async take(e) {
    if (!this.busy) {
      if (this.getData(), !this.destination) {
        this.message = this.getData().message || H("NoActor"), this.render(!0);
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
        this.message = t.map((n) => `${n.name}: ${H(n.code)}`).join(" · "), this.message && ui.notifications.warn(this.message);
      } catch (t) {
        this.message = _(t);
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
class qs extends St {
  constructor(e, t, n) {
    super({ id: `hololoot-config-${e.id}` });
    y(this, "token");
    y(this, "adapter");
    y(this, "queue");
    y(this, "config");
    y(this, "scope", "token");
    y(this, "busy", !1);
    y(this, "dismissal", null);
    this.token = e, this.adapter = t, this.queue = n, this.config = structuredClone(k(e)), this.config.keepLinkedActor = nt(e);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: H("Title"),
      classes: ["holosuite-loot-window", "holosuite-loot-config"],
      template: It("config"),
      width: 480,
      height: "auto",
      resizable: !1
    });
  }
  getData() {
    const e = !!this.adapter.manual, t = !e && game.settings.get(f, "zeroHP"), n = !t && this.config.mode === "automatic" ? "disabled" : this.config.mode, r = (c) => (c == null ? void 0 : c.quantity) ?? (c ? H(`Rule.${c.mode}`) : ""), o = e ? rs(this.token, this.adapter) : is(this.token, this.adapter).map(({ entry: c, effective: l, overrides: u, ...d }) => ({
      ...d,
      configured: r(l.rule),
      effectiveScope: l.scope,
      tokenRule: r(u.token),
      actorRule: r(u.actor),
      globalRule: r(u.global),
      ruleScope: H(`Scope.${l.scope}`),
      original: (c == null ? void 0 : c.originalQuantity) ?? d.quantity,
      remaining: c ? c.taken ? 0 : c.formula ?? E(c.data) : "—",
      rollResult: !(c != null && c.taken) && Number.isSafeInteger(c == null ? void 0 : c.rolledQuantity) ? game.i18n.format("HL.QuantityRollResult", { roll: c.rolledQuantity, quantity: E(c.data) }) : "",
      pending: !!(c != null && c.claim) && !(c != null && c.taken)
    })), a = P();
    return {
      name: this.token.name,
      theme: game.settings.get(f, "panelTheme"),
      busy: this.busy,
      automatic: t,
      rows: o,
      canEdit: a,
      manual: e,
      keepLinkedActor: this.config.keepLinkedActor,
      saveDisabled: this.busy || e && !a,
      canRefresh: !e && a && vt(this.token, this.adapter),
      scopes: ["token", "actor", "global"].map((c) => ({ value: c, label: H(`Scope.${c}`), selected: this.scope === c })),
      modes: (t ? ["automatic", "enabled", "disabled"] : ["enabled", "disabled"]).map((c) => ({ value: c, label: H(c), selected: c === n }))
    };
  }
  activateListeners(e) {
    var g, v, p, I, b;
    super.activateListeners(e);
    const t = Lt(e);
    (g = this.dismissal) == null || g.destroy(), this.dismissal = new bs(t.closest(".window-app, .application") ?? t, () => {
      this.busy || this.close();
    }), (v = t.querySelector('[name="mode"]')) == null || v.addEventListener("change", (S) => {
      this.config.mode = S.target.value;
    }), (p = t.querySelector('[name="keepLinkedActor"]')) == null || p.addEventListener("change", (S) => {
      this.config.keepLinkedActor = S.target.checked;
    }), (I = t.querySelector("[data-save]")) == null || I.addEventListener("click", () => {
      const S = Array.from(t.querySelectorAll("[data-manual-item]:checked"), (T) => T.value);
      this.save(S);
    }), (b = t.querySelector("[data-close]")) == null || b.addEventListener("click", () => void this.close());
    const n = t.querySelector('[name="scope"]'), r = t.querySelector('[name="behavior"]'), o = t.querySelector('[name="formula"]'), a = t.querySelector("[data-apply]"), c = t.querySelector("[data-refresh-inventory]"), l = t.querySelector("[data-select-all]");
    if (!n || !r || !o || !a || !l) return;
    const u = Array.from(t.querySelectorAll("input[data-rule-item]")), d = () => {
      this.scope = n.value, n.disabled = r.disabled = o.disabled = this.busy, c && (c.disabled = this.busy);
      const S = u.filter((q) => {
        const h = q.dataset[this.scope] === "true";
        q.disabled = this.busy || !h, h || (q.checked = !1);
        const w = q.closest("label"), C = w == null ? void 0 : w.querySelector("[data-rule-unavailable]"), A = q.dataset[`${this.scope}Unavailable`];
        C && (C.textContent = !h && A ? H(A) : "");
        const M = w == null ? void 0 : w.querySelector("[data-scoped-rule]"), $ = q.dataset[`${this.scope}Rule`];
        return M && (M.textContent = $ && q.dataset.effectiveScope !== this.scope ? ` · ${H(`Scope.${this.scope}`)} ${$}` : ""), h;
      }), T = S.filter((q) => q.checked).length;
      l.disabled = this.busy || !S.length, l.checked = !!T && T === S.length, l.indeterminate = !!T && !l.checked, a.disabled = this.busy || !T, o.hidden = r.value !== "quantity";
    };
    n.addEventListener("change", d), r.addEventListener("change", d);
    for (const S of u) S.addEventListener("change", d);
    l.addEventListener("change", () => {
      for (const S of u) S.disabled || (S.checked = l.checked);
      d();
    }), c == null || c.addEventListener("click", async () => {
      if (!(!P() || this.busy)) {
        this.busy = !0, d();
        try {
          await this.queue.run(this.token.uuid, () => bt(this.token, this.adapter)), ui.notifications.info(H("InventoryRefreshed"));
        } catch (S) {
          _(S);
          return;
        } finally {
          this.busy = !1, d();
        }
        this.rendered && this.render(!0);
      }
    }), a.addEventListener("click", async () => {
      if (!(!P() || this.busy)) {
        try {
          const S = He(r.value, o.value), T = u.filter((w) => w.checked && !w.disabled).map((w) => w.value), q = this.scope;
          this.busy = !0, d();
          const h = await this.queue.run(this.token.uuid, () => ns(this.token, this.adapter, q, T, S));
          for (const w of h ?? [])
            Is(w).catch((C) => console.warn("HoloSuite Loot | Could not post quantity roll", C));
        } catch (S) {
          _(S);
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
        await this.queue.run(this.token.uuid, () => this.adapter.manual ? as(this.token, this.adapter, t, e, this.config.keepLinkedActor) : this.token.setFlag(f, "config", { ...k(this.token), mode: t, keepLinkedActor: this.config.keepLinkedActor })), await this.close();
      } catch (t) {
        _(t);
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
class As {
  constructor(i) {
    y(this, "sprites", /* @__PURE__ */ new Map());
    y(this, "texture");
    y(this, "disposed", !1);
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
    if (i.destroyed || i.isPreview || e.hidden || !this.available(e) || t && !t.entries.some((r) => !r.taken && !r.hidden)) {
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
class Ts {
  constructor(i, { canvas: e, tokenAt: t, toggle: n, dismiss: r, now: o = Date.now }) {
    y(this, "gesture", null);
    y(this, "reset", () => {
      this.gesture = null;
    });
    y(this, "blur", (i) => {
      i.target === this.target && this.reset();
    });
    y(this, "handle", (i) => {
      if (i.type === "pointercancel") {
        this.gesture && this.gesture.pointerId === i.pointerId && (this.consume(i), this.reset());
        return;
      }
      if (i.type === "pointerup") {
        i.button === 2 && this.gesture && this.gesture.pointerId === i.pointerId && this.gesture.releasedAt === null && (this.consume(i), this.gesture.releasedAt = this.now());
        return;
      }
      if (i.type === "pointerdown") {
        if (i.button !== 2) return;
        this.reset();
      }
      if (!this.canvas || !i.composedPath().includes(this.canvas)) return;
      if (i.type === "contextmenu" && this.gesture) {
        if (this.gesture.releasedAt === null || this.now() - this.gesture.releasedAt < 1e3) {
          this.consume(i);
          return;
        }
        this.reset();
      }
      const e = this.tokenAt(i);
      if (!e) {
        this.dismiss();
        return;
      }
      this.consume(i), i.type === "pointerdown" && (this.gesture = { pointerId: i.pointerId, releasedAt: null }), this.toggle(e);
    });
    this.target = i, this.canvas = e, this.tokenAt = t, this.toggle = n, this.dismiss = r, this.now = o;
    for (const a of ["pointerdown", "pointerup", "pointercancel", "contextmenu"]) i.addEventListener(a, this.handle, { capture: !0 });
    i.addEventListener("blur", this.blur, { capture: !0 });
  }
  consume(i) {
    i.preventDefault(), i.stopImmediatePropagation();
  }
  destroy() {
    for (const i of ["pointerdown", "pointerup", "pointercancel", "contextmenu"]) this.target.removeEventListener(i, this.handle, { capture: !0 });
    this.target.removeEventListener("blur", this.blur, { capture: !0 }), this.reset();
  }
}
const D = /* @__PURE__ */ new Map();
let x = null, X = !1, Le = 0;
const V = () => Qt(game.system.id), ve = () => es(V()), Be = (s) => {
  var i, e;
  return (s == null ? void 0 : s.actor) && (V().manual ? !!s.actor.items : ((e = (i = V()).sourceActor) == null ? void 0 : e.call(i, s.actor)) ?? s.actor.type === "npc");
}, Fs = (s, i, e) => {
  var t;
  return rt(s, game.actors.contents, (t = game.scenes.get(s.viewedScene)) == null ? void 0 : t.tokens, i, e);
}, Se = new Wt({
  moduleId: f,
  authority: P,
  environment: ve,
  adapter: V,
  token: async (s) => {
    if (!/^Scene\.[^.]+\.Token\.[^.]+$/.test(s)) throw new m("InvalidRequest");
    const e = await (foundry.utils.fromUuid ?? globalThis.fromUuid)(s);
    return (e == null ? void 0 : e.documentName) === "Token" ? e : null;
  },
  actor: (s) => game.actors.get(s) ?? (foundry.utils.fromUuid ?? globalThis.fromUuid)(s),
  id: () => foundry.utils.randomID(),
  destination: (s, i, e) => game.settings.get(f, "characterSelector") ? s.actorId ? Se.io.actor(s.actorId) : null : Fs(i, V(), e),
  load: ze,
  save: os,
  summary: cs,
  collected: Cs,
  rollQuantity: ss,
  quantityRolled: Ls
}), Ue = (s) => hs(s, Se);
function Ke(s) {
  var i;
  return X && me(s, ve()) && (game.user.isGM || !s.hidden && ((i = s.object) == null ? void 0 : i.isVisible));
}
async function $e(s) {
  var r, o, a, c, l;
  s = (s == null ? void 0 : s.document) ?? s;
  const i = V();
  if (!i) {
    _(new m("Unsupported"));
    return;
  }
  if (game.user.isGM) return Ie(s);
  if (!Ke(s)) {
    _(new m("Unavailable"));
    return;
  }
  const e = ++Le;
  let t;
  if (je() > 0 && (!D.has(s.uuid) || (r = D.get(s.uuid)) != null && r.disposed)) {
    try {
      t = await Ue({ action: "view", tokenUuid: s.uuid });
    } catch (u) {
      e === Le && ((o = canvas.scene) == null ? void 0 : o.id) === ((a = s.parent) == null ? void 0 : a.id) && _(u);
      return;
    }
    if (e !== Le || ((c = canvas.scene) == null ? void 0 : c.id) !== ((l = s.parent) == null ? void 0 : l.id)) return;
  }
  for (const [u, d] of D)
    u !== s.uuid && !d.disposed && await d.close();
  if (e !== Le) return;
  let n = D.get(s.uuid);
  (!n || n.disposed) && (n = new Rs(s, Ue, i), D.set(s.uuid, n), await n.show(t), t !== void 0) || n.disposed || await n.refresh();
}
async function Ie(s) {
  var i;
  if (!(!game.user.isGM || !V())) {
    if (((i = s == null ? void 0 : s.parent) == null ? void 0 : i.documentName) !== "Scene" || !Be(s)) {
      ui.notifications.info(H("SelectToken"));
      return;
    }
    try {
      new qs(s, V(), Se.queue).render(!0);
    } catch (e) {
      _(e);
    }
  }
}
function be(s) {
  const i = D.get(s);
  i && !i.disposed && i.refresh();
}
function Qe(s) {
  const i = V(), e = () => {
    const t = s.getFlag(f, "state");
    return !t || i.currencySnapshotVersion && t.currencyReady !== i.currencySnapshotVersion;
  };
  !X || !P() || i.manual || !e() || !me(s, ve()) || Se.queue.run(s.uuid, async () => {
    P() && e() && me(s, ve()) && await ze(s, i);
  }).catch((t) => console.warn("HoloSuite Loot | Snapshot initialization failed", s.uuid, t));
}
function U() {
  var s;
  for (const i of ((s = canvas.scene) == null ? void 0 : s.tokens) ?? []) Qe(i);
  x == null || x.refreshScene();
}
function xs() {
  const s = [.../* @__PURE__ */ new Set([...canvas.tokens.controlled, ...game.user.targets])];
  if (s.length !== 1) {
    ui.notifications.info(H("SelectToken"));
    return;
  }
  const i = s[0];
  game.user.isGM ? Ie(i.document) : $e(i.document);
}
function tt() {
  var i;
  const s = ((i = game.modules.get("holosuite-core")) == null ? void 0 : i.api) ?? game.holosuite;
  return s != null && s.registerApp ? (s.registerApp({
    id: f,
    title: H("Title"),
    icon: "fa-solid fa-box-open",
    playerVisible: !1,
    premium: !1,
    description: H("SelectToken"),
    open: xs
  }), !0) : !1;
}
let ne, re, J = null;
function Ms(s) {
  var a, c;
  if (game.user.isGM || !X) return null;
  const i = ne == null ? void 0 : ne.getBoundingClientRect(), e = (c = (a = canvas.app) == null ? void 0 : a.renderer) == null ? void 0 : c.screen;
  if (!(i != null && i.width) || !i.height || !e || !canvas.stage) return;
  const t = canvas.stage.worldTransform.applyInverse({
    x: (s.clientX - i.left) * e.width / i.width,
    y: (s.clientY - i.top) * e.height / i.height
  }), n = (l) => {
    var u;
    return (l == null ? void 0 : l.isVisible) && (((u = l.bounds) == null ? void 0 : u.contains(t.x, t.y)) ?? (t.x >= l.document.x && t.y >= l.document.y && t.x <= l.document.x + l.w && t.y <= l.document.y + l.h));
  }, r = n(re) ? re : [...canvas.tokens.placeables].reverse().find(n), o = r == null ? void 0 : r.document;
  return Ke(o) ? o : null;
}
function Hs(s) {
  const i = D.get(s.uuid);
  i && !i.disposed ? i.close() : $e(s);
}
function Ct() {
  var s, i;
  x == null || x.destroy(), x = X ? new As((e) => me(e, ve())) : null, J == null || J.destroy(), ne = ((s = canvas.app) == null ? void 0 : s.canvas) ?? ((i = canvas.app) == null ? void 0 : i.view), J = new Ts(window, {
    canvas: ne,
    tokenAt: Ms,
    toggle: Hs,
    dismiss: () => {
      if (!game.user.isGM && X)
        for (const e of D.values()) e.disposed || e.close();
    }
  });
}
Hooks.once("init", () => {
  game.settings.register(f, "keepLinkedActor", {
    name: "HL.KeepLinkedActorDefault",
    hint: "HL.KeepLinkedActorDefaultHint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(f, Te, { scope: "world", config: !1, type: Object, default: {} }), game.settings.register(f, "zeroHP", {
    name: "HL.ZeroHP",
    hint: "HL.ZeroHPHint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0,
    onChange: () => {
      U();
      for (const s of D.keys()) be(s);
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
  }), game.settings.register(f, dt, {
    name: "HL.LootRange",
    hint: "HL.LootRangeHint",
    scope: "world",
    config: !0,
    type: Number,
    default: ft,
    onChange: () => {
      for (const s of D.keys()) be(s);
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
      for (const s of D.values()) s.disposed || s.render(!1);
    }
  });
});
Hooks.once("ready", async () => {
  var s;
  if (!((s = game.modules.get("holosuite-core")) != null && s.active)) {
    ui.notifications.error(H("CoreMissing"));
    return;
  }
  try {
    await fs(Se, be);
  } catch (i) {
    _(i);
    return;
  }
  X = !0, game.modules.get(f).api = {
    version: Re,
    open: $e,
    configure: Ie,
    registerAdapter: Kt,
    // Requests still pass every authority and permission check, including calls from macros.
    request: Ue,
    authority: () => {
      var i;
      return (i = Ve()) == null ? void 0 : i.id;
    }
  }, tt(), setTimeout(tt, 500), Ct(), U(), console.info(`HoloSuite Loot | ${Re} ready; Foundry ${game.version}, ${game.system.id} ${game.system.version}`);
});
Hooks.on("canvasReady", () => {
  Ct(), U();
});
Hooks.on("hoverToken", (s, i) => {
  i ? re = s : re === s && (re = null);
});
Hooks.on("canvasTearDown", () => {
  x == null || x.destroy(), x = null, re = null, J == null || J.destroy(), J = null, ne = null;
  for (const s of D.values()) s.close();
  D.clear();
});
Hooks.on("renderTokenHUD", (s, i) => {
  var o;
  if (!X) return;
  const e = (o = s.object) == null ? void 0 : o.document;
  if (!Be(e)) return;
  const t = i instanceof HTMLElement ? i : i[0], n = t.querySelector(".col.right") ?? t;
  t.querySelectorAll(".hl-token-action").forEach((a) => a.remove());
  const r = (a, c, l) => {
    const u = document.createElement("button");
    u.type = "button", u.className = "control-icon hl-token-action", u.title = a, u.setAttribute("aria-label", a);
    const d = document.createElement("i");
    d.className = c, u.append(d), u.addEventListener("click", (g) => {
      g.preventDefault(), g.stopPropagation(), l();
    }), n.append(u);
  };
  game.user.isGM ? V() && !game.settings.get(f, "hideGmLootButton") && r(H("Loot"), "fa-solid fa-box-open", () => void Ie(e)) : Ke(e) && r(H("Loot"), "fa-solid fa-box-open", () => void $e(e));
});
Hooks.on("renderTokenConfig", (s, i) => {
  var r;
  if (!X || !game.user.isGM || !V()) return;
  const e = s.document ?? s.object;
  if (((r = e == null ? void 0 : e.parent) == null ? void 0 : r.documentName) !== "Scene" || !Be(e)) return;
  const t = i instanceof HTMLElement ? i : i[0];
  if (t.querySelector(".hl-token-config")) return;
  const n = document.createElement("button");
  n.type = "button", n.className = "hl-token-config", n.textContent = H("Configure"), n.addEventListener("click", () => Ie(e)), (t.querySelector('[data-tab="character"]') ?? t.querySelector("form") ?? t).append(n);
});
Hooks.on("drawToken", (s) => x == null ? void 0 : x.refresh(s));
Hooks.on("refreshToken", (s, i) => {
  (!i || i.refreshSize || i.refreshShape) && (x == null || x.refresh(s));
});
Hooks.on("destroyToken", (s) => x == null ? void 0 : x.remove(s));
Hooks.on("updateToken", (s, i) => {
  var e, t, n;
  if (Qe(s), x == null || x.refresh(s.object), be(s.uuid), !(!D.size || !je() || ((e = s.parent) == null ? void 0 : e.id) !== ((t = canvas.scene) == null ? void 0 : t.id) || !s.actor || !((n = V()) != null && n.destination(s.actor)) || !s.actor.testUserPermission(game.user, "OWNER") || !["x", "y", "elevation", "width", "height", "hidden"].some((r) => r in i)))
    for (const r of D.keys()) r !== s.uuid && be(r);
});
Hooks.on("createToken", Qe);
Hooks.on("createCombatant", U);
Hooks.on("updateCombatant", U);
Hooks.on("deleteCombatant", U);
Hooks.on("updateCombat", U);
Hooks.on("deleteCombat", U);
Hooks.on("updateActor", U);
Hooks.on("createActiveEffect", U);
Hooks.on("updateActiveEffect", U);
Hooks.on("deleteActiveEffect", U);
Hooks.on("userConnected", U);
Hooks.on("deleteToken", (s) => {
  var i;
  if ((i = D.get(s.uuid)) == null || i.close(), D.delete(s.uuid), !!P())
    for (const e of game.journal.contents)
      e.getFlag(f, "tokenUuid") === s.uuid && e.delete().catch(console.warn);
});
