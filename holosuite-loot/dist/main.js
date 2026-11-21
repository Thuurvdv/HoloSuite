var At = Object.defineProperty;
var Tt = (i, s, e) => s in i ? At(i, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[s] = e;
var p = (i, s, e) => Tt(i, typeof s != "symbol" ? s + "" : s, e);
const f = "holosuite-loot", Re = "1.3.0", nt = "commandV3", Ee = "replyV3", P = (i) => structuredClone(i), N = (i) => {
  var s, e, t;
  return ((e = (s = i == null ? void 0 : i.system) == null ? void 0 : s.quantity) == null ? void 0 : e.value) ?? ((t = i == null ? void 0 : i.system) == null ? void 0 : t.quantity) ?? 1;
}, Ge = (i) => {
  var s;
  return typeof ((s = i == null ? void 0 : i.system) == null ? void 0 : s.quantity) == "object" && i.system.quantity !== null ? "system.quantity.value" : "system.quantity";
};
function rt(i, s) {
  Ge(i) === "system.quantity.value" ? i.system.quantity.value = s : i.system.quantity !== void 0 && (i.system.quantity = s);
}
function Ft(i, s, e, t = "request") {
  var n, r;
  return e !== i.id || !i.active || !((r = (n = s.flags) == null ? void 0 : n[f]) != null && r[t]) ? null : P(i.getFlag(f, t));
}
class m extends Error {
  constructor(s) {
    super(s), this.code = s;
  }
}
function qe(i) {
  const s = (e) => typeof e == "string" && /^[\w-]{1,64}$/.test(e);
  return typeof (i == null ? void 0 : i.tokenUuid) == "string" && /^Scene\.[\w-]{1,64}\.Token\.[\w-]{1,64}$/.test(i.tokenUuid) && ["view", "inspect", "take", "all"].includes(i.action) && (!["inspect", "take"].includes(i.action) || s(i.entryId)) && (i.actorId == null || typeof i.actorId == "string" && /^(?:[\w-]{1,64}|Actor\.[\w-]{1,64}|Scene\.[\w-]{1,64}\.Token\.[\w-]{1,64}(?:\.Actor\.[\w-]{1,64})?)$/.test(i.actorId));
}
function k(i) {
  var s;
  return i.getFlag(f, "config") ?? ((s = i.actor) == null ? void 0 : s.getFlag(f, "config")) ?? { mode: "automatic", source: "inventory" };
}
function at(i) {
  var e, t;
  const s = k(i).keepLinkedActor;
  return typeof s == "boolean" ? s : ((t = (e = globalThis.game) == null ? void 0 : e.settings) == null ? void 0 : t.get(f, "keepLinkedActor")) === !0;
}
const x = (i) => (i == null ? void 0 : i.uuid) ?? (i == null ? void 0 : i.id), ae = (i) => JSON.stringify(i, (s, e) => e && typeof e == "object" && !Array.isArray(e) ? Object.fromEntries(Object.entries(e).sort(([t], [n]) => t.localeCompare(n))) : e);
function ie(i, s, e, t = void 0) {
  return !i || !e.destination(i) || !i.testUserPermission(s, "OWNER") ? !1 : !(e.manual || e.acceptsLegacyWholeItems) || !t || x(i) !== x(t.actor) && (i.isToken || i.id !== t.actorId);
}
function ot(i, s, e, t, n = void 0) {
  const r = (c) => ie(c, i, t, n);
  if (r(i.character)) return i.character;
  const o = [...new Map(Array.from(e ?? []).map((c) => c.actor).filter(r).map((c) => [x(c), c])).values()];
  if (o.length === 1) return o[0];
  if (o.length > 1) throw new m("AmbiguousActor");
  const a = Array.from(s ?? []).filter(r);
  if (a.length === 1) return a[0];
  throw new m(a.length ? "AmbiguousActor" : "NoActor");
}
function me(i, { combats: s = [], zeroHP: e = !1, automatic: t = !0, manual: n = !1, sourceActor: r, hitPoints: o, defeated: a } = {}) {
  var d, g, v, y, I, b;
  if (!(i != null && i.actor) || (n ? !i.actor.items : !((r == null ? void 0 : r(i.actor)) ?? i.actor.type === "npc"))) return !1;
  if (n) return ((d = i.getFlag(f, "config")) == null ? void 0 : d.mode) === "enabled";
  const c = k(i);
  if (c.mode === "disabled") return !1;
  if (c.mode === "enabled") return !0;
  if (!t) return !1;
  if (s.some((S) => {
    var T;
    return (T = S.combatants) == null ? void 0 : T.some((q) => {
      var h, w;
      return q.tokenId === i.id && (q.sceneId ?? ((h = S.scene) == null ? void 0 : h.id)) === ((w = i.parent) == null ? void 0 : w.id) && (q.isDefeated || q.defeated);
    });
  })) return !0;
  const l = i.actor.statuses;
  if (l != null && l.has("dead") || a != null && a(i.actor)) return !0;
  const u = o ? o(i.actor) : (v = (g = i.actor.system) == null ? void 0 : g.attributes) == null ? void 0 : v.hp;
  return e && Number(u == null ? void 0 : u.max) > 0 && (u == null ? void 0 : u.value) === 0 && !((b = (I = (y = i.actor.system) == null ? void 0 : y.attributes) == null ? void 0 : I.death) != null && b.success);
}
function xt(i, s, e, t = void 0) {
  var r, o, a;
  if (!(s != null && s.active) || !me(i, e)) throw new m("Unavailable");
  if (s.isGM) return;
  const n = ((r = i.parent) == null ? void 0 : r.active) || ((o = i.parent) == null ? void 0 : o.testUserPermission(s, "LIMITED"));
  if (i.hidden || s.viewedScene !== ((a = i.parent) == null ? void 0 : a.id) || !n || !e.visible(i, s))
    throw new m("AccessDenied");
  if (e.inRange && !e.inRange(i, s, t)) throw new m("OutOfRange");
}
function We(i, s, e, t = void 0) {
  if (!ie(i, s, e, t))
    throw new m("ActorDenied");
}
class oe {
  constructor() {
    p(this, "tails", /* @__PURE__ */ new Map());
  }
  async run(s, e) {
    const n = (this.tails.get(s) ?? Promise.resolve()).catch(() => {
    }).then(e);
    this.tails.set(s, n);
    try {
      return await n;
    } finally {
      this.tails.get(s) === n && this.tails.delete(s);
    }
  }
}
const De = new oe(), Oe = (i) => `${i.currency.unit}:${i.currency.amount}`, de = (i, s, e, t = !1) => {
  var n, r;
  return ((r = (n = i.getFlag) == null ? void 0 : n.call(i, f, t ? "currencyDebits" : "currencyReceipts")) == null ? void 0 : r[e.id]) === Oe(s);
};
function ce({ units: i, amountOf: s, path: e, valid: t, name: n, encode: r = (o) => o }) {
  return {
    entries(o) {
      return i.filter((a) => t(s(o, a)) && s(o, a) > 0).map((a) => {
        const c = s(o, a);
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
      return De.run(x(o), async () => {
        if (de(o, a, c)) return;
        if (c.currencyAttempted) throw new m("RecoveryRequired");
        if (!l) throw new m("RecoveryRequired");
        await l();
        const { unit: u, amount: d } = a.currency, g = s(o, u);
        if (!i.includes(u) || !t(d) || !d || !t(g) || !t(g + d)) throw new m("CurrencyChanged");
        if (await o.update({
          [e(u)]: r(g + d),
          [`flags.${f}.currencyReceipts.${c.id}`]: Oe(a)
        }), !de(o, a, c)) throw new m("TransferFailed");
      });
    },
    sourcePlan(o, a) {
      const { unit: c, amount: l } = a.currency, u = s(o.actor, c);
      if (!i.includes(c) || !t(u) || !t(l) || l <= 0 || u < l) throw new m("CurrencyChanged");
      return { currency: c, before: u, after: u - l };
    },
    async debit(o, a, c) {
      return De.run(x(o.actor), async () => {
        const l = o.actor;
        if (de(l, a, c, !0)) return;
        const u = c.source;
        if (s(l, u.currency) !== u.before) throw new m("CurrencyChanged");
        if (await l.update({
          [e(u.currency)]: r(u.after),
          [`flags.${f}.currencyDebits.${c.id}`]: Oe(a)
        }), !de(l, a, c, !0)) throw new m("CurrencyChanged");
      });
    },
    async cleanup(o, a, c, l) {
      for (const [u, d] of [[a, "currencyReceipts"], [o.actor, "currencyDebits"]])
        try {
          await De.run(x(u), () => u.update({ [`flags.${f}.${d}.-=${l.id}`]: null }));
        } catch (g) {
          console.warn("HoloSuite Loot | Could not clean committed currency receipt", g);
        }
    }
  };
}
const Mt = ce({
  units: ["cp", "sp", "ep", "gp", "pp"],
  amountOf: (i, s) => {
    var e, t;
    return (t = (e = i == null ? void 0 : i.system) == null ? void 0 : e.currency) == null ? void 0 : t[s];
  },
  path: (i) => `system.currency.${i}`,
  valid: (i) => Number.isSafeInteger(i) && i >= 0,
  name: (i) => {
    var t, n, r, o, a;
    const s = (r = (n = (t = globalThis.CONFIG) == null ? void 0 : t.DND5E) == null ? void 0 : n.currencies) == null ? void 0 : r[i], e = typeof s == "string" ? s : s == null ? void 0 : s.label;
    return e ? ((a = (o = globalThis.game) == null ? void 0 : o.i18n) == null ? void 0 : a.localize(e)) ?? e : i.toUpperCase();
  }
}), Ht = ce({
  units: ["swade"],
  amountOf: (i) => {
    var s, e;
    return (e = (s = i == null ? void 0 : i.system) == null ? void 0 : s.details) == null ? void 0 : e.currency;
  },
  path: () => "system.details.currency",
  valid: (i) => Number.isFinite(i) && i >= 0 && i <= Number.MAX_SAFE_INTEGER,
  name: () => {
    var i, s, e;
    return ((e = (s = (i = globalThis.game) == null ? void 0 : i.settings) == null ? void 0 : s.get("swade", "currencyName")) == null ? void 0 : e.trim()) || "Currency";
  }
}), $t = ce({
  units: ["credits"],
  amountOf: (i) => {
    var s, e, t;
    return (t = (e = (s = i == null ? void 0 : i.system) == null ? void 0 : s.stats) == null ? void 0 : e.credits) == null ? void 0 : t.value;
  },
  path: () => "system.stats.credits.value",
  valid: (i) => Number.isSafeInteger(i) && i >= 0,
  name: () => "Credits"
}), Nt = ce({
  units: ["credits"],
  amountOf: (i) => {
    var t, n;
    const s = (n = (t = i == null ? void 0 : i.system) == null ? void 0 : t.credits) == null ? void 0 : n.value;
    if ((i == null ? void 0 : i.type) !== "character" || typeof s != "number" && typeof s != "string") return;
    if (typeof s == "number") return s;
    const e = s.trim();
    if (!e) return 0;
    if (/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(e)) return Number(e.replaceAll(",", ""));
  },
  path: () => "system.credits.value",
  valid: (i) => Number.isSafeInteger(i) && i >= 0,
  name: () => "Credits",
  encode: String
}), Et = ce({
  units: ["cp", "sp", "gp", "pp"],
  amountOf: (i, s) => {
    var e, t;
    return (t = (e = i == null ? void 0 : i.system) == null ? void 0 : e.currency) == null ? void 0 : t[s];
  },
  path: (i) => `system.currency.${i}`,
  valid: (i) => Number.isSafeInteger(i) && i >= 0,
  name: (i) => i.toUpperCase()
}), Je = { gc: "gold", sc: "silver", cc: "copper" }, Dt = ce({
  units: Object.keys(Je),
  amountOf: (i, s) => {
    var e, t;
    return (t = (e = i == null ? void 0 : i.system) == null ? void 0 : e.currency) == null ? void 0 : t[s];
  },
  path: (i) => `system.currency.${i}`,
  valid: (i) => Number.isSafeInteger(i) && i >= 0,
  name: (i) => {
    var n, r;
    const s = Je[i], e = `DoD.currency.${s}`, t = (r = (n = globalThis.game) == null ? void 0 : n.i18n) == null ? void 0 : r.localize(e);
    return t && t !== e ? t : s[0].toUpperCase() + s.slice(1);
  }
});
function _e(i) {
  var e;
  const s = P(i.toObject());
  delete s._id, delete s.folder, delete s.ownership, delete s._stats, (e = s.flags) == null || delete e[f];
  for (const t of s.effects ?? [])
    delete t._id, t.origin = null;
  return s;
}
async function Ot(i) {
  if (i.actorLink && await i.update({ actorLink: !1 }), i.actorLink) throw new m("SourceChanged");
}
function ge(i, s) {
  if (s != null && s.actorUuid && (!i.actorLink || x(i.actor) !== s.actorUuid)) throw new m("SourceChanged");
}
async function Ae(i, s) {
  return s != null && s.actorUuid ? (ge(i, s), s) : !s && i.actorLink && at(i) ? { actorUuid: x(i.actor) } : (await Ot(i), {});
}
class ct {
  constructor() {
    p(this, "manual", !1);
  }
  async reserveSource(s, e, t) {
    var a;
    if (!((a = t.source) != null && a.actorUuid)) return;
    ge(s, t.source);
    const n = s.actor, r = n.getFlag(f, "linkedLootClaim");
    if (r && (r.id !== t.id || r.tokenUuid !== s.uuid)) throw new m("RecoveryRequired");
    r || await n.setFlag(f, "linkedLootClaim", { id: t.id, tokenUuid: s.uuid });
    const o = n.getFlag(f, "linkedLootClaim");
    if ((o == null ? void 0 : o.id) !== t.id || o.tokenUuid !== s.uuid) throw new m("RecoveryRequired");
  }
  async releaseSource(s, e, t) {
    var r;
    if (!((r = t.source) != null && r.actorUuid)) return;
    ge(s, t.source);
    const n = s.actor.getFlag(f, "linkedLootClaim");
    (n == null ? void 0 : n.id) === t.id && n.tokenUuid === s.uuid && await s.actor.unsetFlag(f, "linkedLootClaim");
  }
  received(s, e, t) {
    var n;
    return ((n = s.items.get(t.itemId)) == null ? void 0 : n.getFlag(f, "claim")) === t.id;
  }
  async create(s, e, t) {
    var a;
    const n = s.items.get(t.itemId);
    if (n) {
      if (n.getFlag(f, "claim") !== t.id) throw new m("RecoveryRequired");
      return n;
    }
    const r = P(e.data);
    r._id = t.itemId, r.flags ?? (r.flags = {}), r.flags[f] = { claim: t.id };
    const o = (a = await s.createEmbeddedDocuments("Item", [r], { keepId: !0 })) == null ? void 0 : a[0];
    if (!this.received(s, e, t))
      throw new m("TransferFailed");
    return o;
  }
}
class ut extends ct {
  constructor() {
    super(...arguments);
    p(this, "id", "dnd5e");
    p(this, "balanceCurrency", Mt);
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
    const t = P(e.data);
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
    const r = e.actor.items.get(t.source.itemId), o = N(r), a = N(t.data);
    if (!this.eligible(r ?? {}) || o < a || t.source.ruleKey && r.type !== t.data.type) throw new m("SourceChanged");
    return { itemId: r.id, before: o, after: o - a, ...n };
  }
  validateSourcePlan(e, t, n) {
    var a, c, l, u, d;
    if (ge(e, n.source), !((a = t.source) != null && a.ruleKey)) return;
    const r = (l = e.actor) == null ? void 0 : l.items.get((c = n.source) == null ? void 0 : c.itemId);
    if (e.actorLink && !((u = n.source) != null && u.actorUuid) || t.source.ruleKey !== `${e.actorId ?? ((d = e.actor) == null ? void 0 : d.id) ?? ""}:${r == null ? void 0 : r.id}` || !this.eligible(r ?? {}) || r.type !== t.data.type || N(r) !== n.source.before)
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
    if (N(o) !== r.before) throw new m("SourceChanged");
    r.after === 0 ? await e.actor.deleteEmbeddedDocuments("Item", [o.id]) : await o.update({ [Ge(o)]: r.after, [`flags.${f}.sourceClaim`]: n.id });
    const a = e.actor.items.get(r.itemId);
    if (r.after === 0 ? a : !a || N(a) !== r.after || (a == null ? void 0 : a.getFlag(f, "sourceClaim")) !== n.id) throw new m("SourceChanged");
  }
}
class Pt extends ct {
  constructor() {
    super(...arguments);
    p(this, "manual", !0);
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
    if (((r = t.system) == null ? void 0 : r.identified) !== !1 && ((a = (o = t.system) == null ? void 0 : o.identification) == null ? void 0 : a.status) !== "unidentified") return P(t);
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
const J = new Pt();
class X extends ut {
  constructor() {
    super(...arguments);
    p(this, "acceptsLegacyWholeItems", !0);
    p(this, "balanceCurrency", null);
  }
  currencyEntries(e) {
    var t;
    return ((t = this.balanceCurrency) == null ? void 0 : t.entries(e)) ?? [];
  }
  eligible(e) {
    const t = N(e);
    return this.allowsStoredItem(e) && Number.isSafeInteger(t) && t > 0;
  }
  snapshot(e) {
    return this.carriedData(_e(e));
  }
  carriedData(e) {
    return e;
  }
  preview(e) {
    return P(e.data);
  }
  received(e, t, n) {
    return t.wholeItem ? J.received(e, t, n) : super.received(e, t, n);
  }
  async create(e, t, n, r) {
    return t.wholeItem ? J.create(e, { ...t, data: this.carriedData(P(t.data)) }, n, r) : super.create(e, t, n, r);
  }
  async sourceClaim(e, t) {
    var n, r;
    if (this.acceptsLegacyWholeItems && ((n = t.currency) == null ? void 0 : n.storage) !== "balance" && !this.eligible(t.data))
      throw new m("SourceChanged");
    if (!t.wholeItem) return super.sourceClaim(e, t);
    if (!this.eligible(e.actor.items.get((r = t.source) == null ? void 0 : r.itemId))) throw new m("SourceChanged");
    return J.sourceClaim(e, t);
  }
  validateSourcePlan(e, t, n) {
    var r;
    if (!t.wholeItem) return super.validateSourcePlan(e, t, n);
    if (!this.eligible(e.actor.items.get((r = n.source) == null ? void 0 : r.itemId))) throw new m("SourceChanged");
    return J.validateSourcePlan(e, t, n);
  }
  async removeSource(e, t, n) {
    return t.wholeItem ? J.removeSource(e, t, n) : super.removeSource(e, t, n);
  }
}
class lt extends X {
  allowsStoredItem(s) {
    var t;
    return ["ammo", "armor", "backpack", "book", "consumable", "equipment", "shield", "treasure", "weapon"].includes(s == null ? void 0 : s.type) && (s.isOfType ? s.isOfType("physical") : !0) && !(s.type === "weapon" && ((t = s.system) == null ? void 0 : t.category) === "unarmed");
  }
  eligible(s) {
    var e;
    return Number.isSafeInteger((e = s == null ? void 0 : s.system) == null ? void 0 : e.quantity) && super.eligible(s);
  }
  carriedData(s) {
    var e, t, n, r;
    return (t = (e = s.flags) == null ? void 0 : e.pf2e) == null || delete t.grantedBy, (r = (n = s.flags) == null ? void 0 : n.pf2e) == null || delete r.itemGrants, s.system.containerId = null, s.system.description && delete s.system.description.gm, s.system.equipped && (s.system.equipped = { carryType: "stowed", handsHeld: 0, invested: !1 }), s;
  }
  async sourceClaim(s, e) {
    var a;
    const t = await super.sourceClaim(s, e);
    if (((a = e.currency) == null ? void 0 : a.storage) !== "item") return t;
    const n = s.actor.items.get(e.source.itemId), r = this.entryMetadata(n).currency, o = this.entryMetadata(n, e.data.system.quantity).currency;
    if ((o == null ? void 0 : o.unit) !== e.currency.unit || (o == null ? void 0 : o.amount) !== e.currency.amount || !e.source.ruleKey && n.system.quantity !== e.data.system.quantity) throw new m("CurrencyChanged");
    return { ...t, sfCurrency: { unit: r.unit, amount: r.amount } };
  }
  async removeSource(s, e, t) {
    var r, o;
    const n = (r = t.source) != null && r.itemId ? s.actor.items.get(t.source.itemId) : null;
    if (n && t.source.sfCurrency && ((o = n.getFlag) == null ? void 0 : o.call(n, f, "sourceClaim")) !== t.id) {
      const a = this.entryMetadata(n).currency;
      if ((a == null ? void 0 : a.unit) !== t.source.sfCurrency.unit || (a == null ? void 0 : a.amount) !== t.source.sfCurrency.amount) throw new m("CurrencyChanged");
    }
    return super.removeSource(s, e, t);
  }
  preview(s) {
    var n, r, o, a;
    const e = P(s.data);
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
class Ut extends lt {
  constructor() {
    super(...arguments);
    p(this, "id", "sf2e");
    p(this, "acceptsLegacyWholeItems", !1);
  }
  entryMetadata(e, t = ((n) => (n = e.system) == null ? void 0 : n.quantity)()) {
    var c, l, u, d;
    const r = e.isCurrency ? e.unit : null, o = r ? e.assetValue : null, a = t === ((c = e.system) == null ? void 0 : c.quantity) ? o == null ? void 0 : o[r] : (d = (u = o == null ? void 0 : (l = o.constructor).fromPrice) == null ? void 0 : u.call(l, e.price, t)) == null ? void 0 : d[r];
    return r && Number.isSafeInteger(a) && a > 0 ? { currency: { storage: "item", unit: r, amount: a } } : {};
  }
}
class Gt extends lt {
  constructor() {
    super(...arguments);
    p(this, "id", "pf2e");
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
class _t extends X {
  constructor() {
    super(...arguments);
    p(this, "id", "swade");
    p(this, "balanceCurrency", Ht);
    p(this, "currencySnapshotVersion", 2);
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
class Vt extends X {
  constructor() {
    super(...arguments);
    p(this, "id", "dragonbane");
    p(this, "balanceCurrency", Dt);
    p(this, "currencySnapshotVersion", 2);
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
class jt extends X {
  constructor() {
    super(...arguments);
    p(this, "id", "wfrp4e");
    p(this, "coinWrites", new oe());
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
    return o === null ? super.create(e, t, n, r) : this.coinWrites.run(x(e), async () => {
      if (this.received(e, t, n)) return;
      if (n.itemAttempted) throw new m("RecoveryRequired");
      const a = Array.from(e.items.values()).find((u) => this.coinValue(u) === o);
      if (!a) return super.create(e, t, n, r);
      const c = N(t.data);
      if (!Number.isSafeInteger(c) || c <= 0 || !r) throw new m("TransferFailed");
      await r();
      const l = N(a) + c;
      if (!e.items.has(a.id) || !Number.isSafeInteger(l)) throw new m("TransferFailed");
      if (await a.update({ [Ge(a)]: l, [`flags.${f}.coinReceipts.${n.id}`]: !0 }), !this.coinReceipt(e, n)) throw new m("TransferFailed");
    });
  }
  async cleanup(e, t, n, r) {
    var o;
    ((o = n.data) == null ? void 0 : o.type) === "money" && await this.coinWrites.run(x(t), async () => {
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
class zt extends X {
  constructor() {
    super(...arguments);
    p(this, "id", "starwarsffg");
    p(this, "balanceCurrency", $t);
    p(this, "currencySnapshotVersion", 2);
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
    return ((r = t.currency) == null ? void 0 : r.storage) === "balance" ? super.received(e, t, n) : J.received(e, t, n);
  }
  async create(e, t, n, r) {
    var o;
    if (((o = t.currency) == null ? void 0 : o.storage) === "balance") return super.create(e, t, n, r);
    if (!this.received(e, t, n))
      return J.create(e, { ...t, data: this.carriedData(P(t.data)) }, n, r);
  }
  allowsStoredItem(e) {
    return ["armour", "gear", "itemattachment", "weapon"].includes(e == null ? void 0 : e.type);
  }
  carriedData(e) {
    return e.system.equippable && (e.system.equippable.equipped = !1), e;
  }
}
class Bt extends X {
  constructor() {
    super(...arguments);
    p(this, "id", "CoC7");
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
class Kt extends X {
  constructor() {
    super(...arguments);
    p(this, "id", "mosh");
    p(this, "balanceCurrency", Nt);
    p(this, "currencySnapshotVersion", 2);
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
class Qt extends X {
  constructor() {
    super(...arguments);
    p(this, "id", "pf1");
    p(this, "balanceCurrency", Et);
    p(this, "currencySnapshotVersion", 2);
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
      system: { quantity: N(t), description: { value: ((r = t.system.description) == null ? void 0 : r.unidentified) ?? "" } }
    };
  }
}
const dt = new Map([
  new ut(),
  new Gt(),
  new Ut(),
  new _t(),
  new Vt(),
  new jt(),
  new zt(),
  new Bt(),
  new Kt(),
  new Qt()
].map((i) => [i.id, i]));
function Wt(i, s) {
  dt.set(i, s);
}
function Jt(i) {
  return dt.get(i) ?? J;
}
function ke(i) {
  if (!i.claim.quantityRoll) return i;
  const s = P(i.data);
  return rt(s, i.claim.quantityRoll.quantity), { ...i, data: s };
}
class kt {
  constructor(s) {
    p(this, "queue", new oe());
    p(this, "sourceQueue", new oe());
    this.io = s;
  }
  async collected(s, e, t, n) {
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
      await ((l = (c = this.io).collected) == null ? void 0 : l.call(c, { token: s, actor: e, entry: r, adapter: n }));
    } catch (u) {
      console.warn("HoloSuite Loot | Could not post loot to chat", u);
    }
  }
  async execute(s, e) {
    if (!qe(s)) throw new m("InvalidRequest");
    return this.queue.run(s.tokenUuid, async () => {
      const t = await this.io.token(s.tokenUuid);
      if (!t) throw new m("Unavailable");
      return this.sourceQueue.run(x(t.actor) ?? t.uuid, () => this.executeToken(s, e, t));
    });
  }
  async executeToken(s, e, t) {
    var v, y, I, b, S, T, q, h, w, C, A, H, E, z, Q, ue;
    const n = this.io, r = (R, L = n.environment()) => {
      if (!n.authority()) throw new m("NoGM");
      xt(t, e, L, R);
    }, o = n.environment();
    if (r(void 0, o), !e.isGM && o.inRange && (s.action === "view" || s.action === "inspect")) {
      const R = await ((v = n.destination) == null ? void 0 : v.call(n, { ...s, actorId: void 0 }, e, t));
      R && r(R);
    }
    const a = n.adapter();
    if (!a) throw new m("Unsupported");
    let c = await n.load(t, a);
    const l = t.actorLink && ((I = (y = t.actor).getFlag) == null ? void 0 : I.call(y, n.moduleId, "linkedLootClaim"));
    if (l) {
      const R = l.tokenUuid === t.uuid ? t : await n.token(l.tokenUuid);
      R != null && R.actorLink && x(R.actor) === x(t.actor) && (R === t ? c : await n.load(R, a)).entries.some((W) => {
        var D, _;
        return ((D = W.claim) == null ? void 0 : D.id) === l.id && W.taken && ((_ = W.claim.source) == null ? void 0 : _.actorUuid) === x(t.actor);
      }) && await t.actor.unsetFlag(n.moduleId, "linkedLootClaim");
    }
    for (const R of c.entries.filter((L) => L.claim && !L.taken)) {
      r();
      const L = await n.actor(R.claim.actorId);
      if (!L) throw new m("RecoveryRequired");
      if (((b = R.claim.quantityRoll) == null ? void 0 : b.quantity) === 0 || (a.received ? a.received(L, R, R.claim) : ((S = L.items.get(R.claim.itemId)) == null ? void 0 : S.getFlag(n.moduleId, "claim")) === R.claim.id)) {
        await ((T = a.reserveSource) == null ? void 0 : T.call(a, t, R, R.claim)), await ((q = a.removeSource) == null ? void 0 : q.call(a, t, R, R.claim));
        const D = P(c);
        D.entries.find((_) => _.id === R.id).taken = !0, await n.save(t, D), c = D, await ((h = a.releaseSource) == null ? void 0 : h.call(a, t, R, R.claim)), await this.collected(t, L, R, a), await ((w = a.cleanup) == null ? void 0 : w.call(a, t, L, R, R.claim));
      }
    }
    if (s.action === "view") return n.summary(t, c);
    if (s.action === "inspect") {
      const R = c.entries.find((L) => L.id === s.entryId && !L.taken && !L.hidden);
      if (!R || R.currency) throw new m("Unavailable");
      return { item: a.preview ? a.preview(R) : P(R.data) };
    }
    const u = n.destination ? await n.destination(s, e, t) : await n.actor(s.actorId);
    We(u, e, a, t), r(u);
    const d = c.entries.filter((R) => !R.taken && !R.hidden && (s.action === "all" || R.id === s.entryId));
    if (!d.length && s.action === "take") return n.summary(t, c);
    const g = [];
    for (const R of d)
      try {
        r(u), We(u, e, a, t);
        let L = c.entries.find((D) => D.id === R.id);
        if (L.claim && (L.claim.userId !== e.id || ![u.id, x(u)].includes(L.claim.actorId)))
          throw new m("RecoveryRequired");
        if (!L.claim) {
          const D = await ((C = a.sourceClaim) == null ? void 0 : C.call(a, t, L));
          r(u);
          let _;
          if (L.formula) {
            if (!D || !a.removeSource) throw new m("SourceChanged");
            _ = await n.rollQuantity(L.formula), r(u);
          }
          const Z = P(c);
          Z.entries.find((le) => le.id === L.id).claim = {
            id: n.id(),
            itemId: n.id(),
            userId: e.id,
            actorId: x(u),
            ..._ ? { quantityRoll: _ } : {},
            ...D ? { source: D } : {}
          }, await n.save(t, Z), c = Z, L = c.entries.find((le) => le.id === R.id);
        }
        r(u), (A = a.validateSourcePlan) == null || A.call(a, t, L, L.claim), await ((H = a.reserveSource) == null ? void 0 : H.call(a, t, L, L.claim)), ((E = L.claim.quantityRoll) == null ? void 0 : E.quantity) !== 0 && await a.create(u, ke(L), L.claim, async () => {
          var Z;
          const D = ((Z = L.currency) == null ? void 0 : Z.storage) === "balance" ? "currencyAttempted" : "itemAttempted", _ = P(c);
          _.entries.find((le) => le.id === L.id).claim[D] = !0, await n.save(t, _), c = _, L.claim[D] = !0;
        }), await ((z = a.removeSource) == null ? void 0 : z.call(a, t, L, L.claim));
        const W = P(c);
        W.entries.find((D) => D.id === L.id).taken = !0, await n.save(t, W), c = W, await ((Q = a.releaseSource) == null ? void 0 : Q.call(a, t, L, L.claim)), await this.collected(t, u, L, a), await ((ue = a.cleanup) == null ? void 0 : ue.call(a, t, u, L, L.claim));
      } catch (L) {
        if (g.push({ name: R.data.name, code: L.code ?? "TransferFailed" }), !n.authority()) break;
      }
    return { ...n.summary(t, c), failures: g };
  }
}
const Te = "inventoryRules";
function Xt(i) {
  var e, t, n, r, o;
  const s = /^(?:Item\.[\w-]+|Compendium\.[\w-]+\.[\w-]+\.(?:Item\.)?[\w-]+)$/;
  return (o = [(e = i._stats) == null ? void 0 : e.compendiumSource, (t = i._stats) == null ? void 0 : t.duplicateSource, (r = (n = i.flags) == null ? void 0 : n.core) == null ? void 0 : r.sourceId].find((a) => typeof a == "string" && s.test(a))) == null ? void 0 : o.replace(/^(Compendium\.[^.]+\.[^.]+)\.(?!Item\.)/, "$1.Item.");
}
function K(i, s, e) {
  var t;
  if (s.balance) {
    const n = s.id;
    return { token: n, actor: e != null && e.id ? `${e.id}:${n}` : void 0 };
  }
  return {
    token: s.id ? `${i.actorId ?? ((t = i.actor) == null ? void 0 : t.id) ?? ""}:${s.id}` : void 0,
    actor: e != null && e.id && e.items.get(s.id) ? `${e.id}:${s.id}` : void 0,
    global: Xt(s)
  };
}
function se(i, s, e) {
  var t;
  for (const n of ["token", "actor", "global"]) {
    const r = i[n] && ((t = n === "token" ? s : e[n]) == null ? void 0 : t[i[n]]);
    if (r) return { rule: r, scope: n };
  }
  return { rule: { mode: "allow" }, scope: "default" };
}
function He(i, s = "") {
  if (i === "inherit") return null;
  if (i === "allow" || i === "never") return { mode: i };
  if (i !== "quantity" || typeof s != "string" || s.length > 40) throw new m("InvalidRule");
  const e = s.trim().toLowerCase().replace(/\s+/g, "");
  if (/^\d+$/.test(e) && Number.isSafeInteger(Number(e))) return { mode: i, quantity: String(Number(e)) };
  const t = /^(\d{0,3})d([1-9]\d{0,4})(?:[+-]\d{1,6})?$/.exec(e);
  if (t && (t[1] === "" || Number(t[1]) > 0)) return { mode: i, quantity: t[1] ? e : `1${e}` };
  throw new m("InvalidRule");
}
async function Yt(i, s, e) {
  if (i.mode === "never") return 0;
  if (i.mode === "allow") return s;
  const { quantity: t } = He(i.mode, i.quantity), n = /^\d+$/.test(t) ? Number(t) : await e(t);
  if (!Number.isSafeInteger(n)) throw new m("InvalidRule");
  return Math.min(s, Math.max(0, n));
}
const ft = (i) => (i == null ? void 0 : i.mode) === "quantity" && !/^\d+$/.test(i.quantity);
function Xe(i, s, e) {
  const t = { ...i };
  for (const n of s)
    e ? t[n] = e : delete t[n];
  return t;
}
function Ve() {
  return game.users.contents.filter((i) => {
    var s;
    return i.active && i.isGM && ((s = i.getFlag) == null ? void 0 : s.call(i, f, "transportVersion")) === Re;
  }).sort((i, s) => i.id.localeCompare(s.id))[0];
}
const U = () => {
  var i;
  return ((i = Ve()) == null ? void 0 : i.id) === game.user.id;
}, ht = "lootRange", mt = 15;
function je() {
  const i = game.settings.get(f, ht);
  return Number.isFinite(i) ? Math.max(0, i) : mt;
}
function Zt(i, s, e) {
  var t, n, r;
  return ((t = i.getCenterPoint) == null ? void 0 : t.call(i, e)) ?? ((r = (n = i.object) == null ? void 0 : n.getCenterPoint) == null ? void 0 : r.call(n, e)) ?? {
    x: e.x + i.width * (s.sizeX ?? s.size) / 2,
    y: e.y + i.height * (s.sizeY ?? s.size) / 2
  };
}
function Ye(i, s) {
  var o;
  const { x: e, y: t } = i._source ?? i, n = { x: e, y: t };
  if (s.isSquare && s.getOffsetRange) {
    const a = i.width * s.size, c = i.height * s.size, [l, u, d, g] = s.getOffsetRange({ ...n, width: a, height: c }), v = [];
    for (let y = l; y < d; y++)
      for (let I = u; I < g; I++) v.push(s.getCenterPoint({ i: y, j: I }));
    if (v.length) return v;
  }
  const r = (o = i.getOccupiedGridSpaceOffsets) == null ? void 0 : o.call(i, { ...n, level: null });
  return r != null && r.length ? r.map(({ i: a, j: c }) => s.getCenterPoint({ i: a, j: c })) : [Zt(i, s, n)];
}
function ei(i, s, e, t, n) {
  var u;
  const r = i.parent, o = r == null ? void 0 : r.grid;
  if (!(o != null && o.measurePath)) return !1;
  const a = (u = o.units) == null ? void 0 : u.trim().toLowerCase().replace(/\.$/, ""), c = /^(m|meters?|metres?)$/.test(a ?? "") ? t * 0.3048 : /^(yd|yards?)$/.test(a ?? "") ? t / 3 : t, l = Ye(i, o);
  return Array.from(r.tokens ?? []).some((d) => {
    const g = d.actor;
    return d.id === i.id || d.hidden || !ie(g, s, e, i) || n && x(g) !== x(n) ? !1 : Ye(d, o).some(({ x: v, y }) => l.some((I) => o.measurePath([{ x: v, y }, { x: I.x, y: I.y }]).distance <= c + 1e-8));
  });
}
function ti(i, s) {
  var r, o;
  const e = i.parent;
  if (((r = canvas.scene) == null ? void 0 : r.id) !== e.id) return !1;
  if (!e.tokenVision) return !0;
  const t = i.object;
  if (!t) return !1;
  const n = globalThis.CONFIG;
  return (o = i.hasStatusEffect) != null && o.call(i, n.specialStatusEffects.INVISIBLE) ? !1 : canvas.tokens.placeables.some((a) => {
    var l, u, d, g, v, y, I, b, S, T, q, h, w, C;
    if (a.document.hidden || !((l = a.document.sight) != null && l.enabled) || !((u = a.actor) != null && u.testUserPermission(s, "OWNER")) || (g = (d = a.document).hasStatusEffect) != null && g.call(d, n.specialStatusEffects.BLIND)) return !1;
    let c;
    try {
      const A = a.document.sight, H = ((y = (v = a.document).getVisionOrigin) == null ? void 0 : y.call(v)) ?? { ...a.center, elevation: a.document.elevation };
      if (c = new n.Canvas.visionSourceClass({ object: a, sourceId: `hololoot-${s.id}-${a.id}` }), c.initialize({
        x: H.x,
        y: H.y,
        elevation: H.elevation,
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
      const E = (S = canvas.environment) == null ? void 0 : S.globalLightSource;
      return (E ? E.active && ((T = E.shape) == null ? void 0 : T.contains(t.center.x, t.center.y)) : e.globalLight && (e.globalLightThreshold == null || e.darkness <= e.globalLightThreshold)) && ((q = c.light) != null && q.contains(t.center.x, t.center.y)) ? !0 : !!((h = c.light) != null && h.contains(t.center.x, t.center.y)) && !!((C = (w = canvas.effects) == null ? void 0 : w.lightSources) != null && C.some((Q) => {
        var ue;
        return Q.active && ((ue = Q.shape) == null ? void 0 : ue.contains(t.center.x, t.center.y));
      }));
    } catch {
      return !1;
    } finally {
      c == null || c.destroy();
    }
  });
}
function ii(i) {
  var t, n, r;
  const s = game.settings.get(f, "zeroHP"), e = i ? je() : 0;
  return {
    combats: game.combats.contents,
    automatic: s,
    zeroHP: s,
    manual: !!(i != null && i.manual),
    visible: ti,
    sourceActor: (t = i == null ? void 0 : i.sourceActor) == null ? void 0 : t.bind(i),
    hitPoints: (n = i == null ? void 0 : i.hitPoints) == null ? void 0 : n.bind(i),
    defeated: (r = i == null ? void 0 : i.defeated) == null ? void 0 : r.bind(i),
    inRange: e > 0 ? (o, a, c) => ei(o, a, i, e, c) : void 0
  };
}
const si = new oe(), $e = (i) => game.journal.find((s) => s.getFlag(f, "tokenUuid") === i.uuid && s.getFlag(f, "kind") === "snapshot"), ye = () => game.settings.get(f, Te) ?? {}, pe = (i) => {
  var s;
  return (s = game.actors) == null ? void 0 : s.get(i.actorId);
}, gt = async (i) => {
  var e, t;
  const s = ((t = (e = globalThis.foundry) == null ? void 0 : e.dice) == null ? void 0 : t.Roll) ?? globalThis.Roll;
  return new s(i).evaluate({ allowInteractive: !1 });
}, we = (i, s) => {
  var e, t;
  return ((t = (e = i.actor) == null ? void 0 : e.items) == null ? void 0 : t.filter((n) => s.eligible(n))) ?? [];
}, Fe = (i, s) => {
  var e;
  return (((e = s.currencyEntries) == null ? void 0 : e.call(s, i.actor)) ?? []).map((t) => ({
    ...t.data,
    id: `currency:${t.currency.unit}`,
    balance: t
  }));
}, Pe = (i) => k(i).source === "custom", xe = (i) => JSON.parse((i == null ? void 0 : i.getFlag(f, "rules")) ?? "{}"), B = (i) => `flags.${f}.${i}`, Me = ({ id: i, hidden: s }) => ({ id: i, taken: !1, ...s ? { hidden: !0 } : {} }), yt = (i) => i.mode === "quantity" ? i.quantity : i.mode, ne = (i, s) => i.setFlag(f, "state", {
  ...s,
  entries: s.entries.map((e) => {
    var r;
    if (!((r = e.claim) != null && r.quantityRoll)) return e;
    const { quantityRoll: t, ...n } = e.claim;
    return { ...e, claim: n };
  })
}), pt = (i, s, e) => {
  var t, n, r;
  return ft(e) && ((t = i.system) == null ? void 0 : t.quantity) != null && s.sourceClaim && s.removeSource && !i.balance && !((r = (n = s.entryMetadata) == null ? void 0 : n.call(s, i)) != null && r.currency);
};
async function ni(i) {
  const s = He("quantity", i);
  if (!ft(s)) throw new m("InvalidRule");
  const e = await gt(s.quantity);
  if (!Number.isSafeInteger(e.total)) throw new m("InvalidRule");
  return { quantity: Math.max(0, e.total), roll: e.toJSON() };
}
function wt(i, s, e) {
  const t = ae(e), n = i.filter((r) => ae(s.snapshot(r)) === t);
  return n.length === 1 && n[0].id ? n[0] : void 0;
}
async function fe(i, s, e, t, { original: n, previousRoll: r, legacyRollCeiling: o, onRoll: a } = {}) {
  var I;
  const c = i.balance ? structuredClone(i.balance.data) : s.snapshot(i);
  if (s.manual) return { id: foundry.utils.randomID(), data: c, wholeItem: !0, source: { itemId: i.id, ruleKey: e } };
  const l = n ?? N(c), u = Math.min(l, N(c)), d = r === void 0 && o === void 0 && pt(i, s, t) ? t.quantity : void 0;
  let g, v;
  const y = d ? u : await Yt(t, u, async (b) => {
    if (r === void 0 && o !== void 0)
      return v = o, v;
    if (r !== void 0)
      g = r;
    else {
      const S = await gt(b);
      g = S.total, a == null || a(S);
    }
    return g;
  });
  return rt(c, y), {
    id: foundry.utils.randomID(),
    data: c,
    originalQuantity: l,
    limit: yt(t),
    hidden: y === 0,
    ...d ? { formula: d } : {},
    ...g === void 0 ? {} : { rolledQuantity: g },
    ...v === void 0 ? {} : { rollCeiling: v },
    ...i.balance ? { currency: { ...i.balance.currency, amount: y } } : { ...i.id ? { source: { itemId: i.id, ruleKey: e } } : {}, ...(I = s.entryMetadata) == null ? void 0 : I.call(s, i, y) }
  };
}
function vt(i, s) {
  var u, d, g;
  const e = $e(i), t = e == null ? void 0 : e.getFlag(f, "state"), n = e == null ? void 0 : e.getFlag(f, "items"), r = new Map(Array.isArray(n) ? n.map((v) => [v.id, v]) : []), o = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), c = [...we(i, s), ...Fe(i, s)], l = s.snapshot && !Pe(i) && !((u = i.getFlag(f, "config")) != null && u.customId);
  for (const v of (t == null ? void 0 : t.entries) ?? []) {
    const y = r.get(v.id);
    if (((d = y == null ? void 0 : y.currency) == null ? void 0 : d.storage) === "balance")
      o.set(`currency:${y.currency.unit}`, { ...y, ...v });
    else if ((g = y == null ? void 0 : y.source) != null && g.ruleKey)
      o.set(y.source.ruleKey, { ...y, ...v });
    else if (l && (y != null && y.data) && !y.currency && !y.source) {
      const I = wt(c.filter((S) => !S.balance), s, y.data);
      if (!I) continue;
      const b = K(i, I).token;
      a.set(b, a.has(b) ? null : { ...y, ...v });
    }
  }
  for (const [v, y] of a) y && !o.has(v) && o.set(v, y);
  return {
    vault: e,
    state: t,
    byId: r,
    byKey: o,
    items: c,
    corpse: xe(e),
    shared: ye(),
    locked: Pe(i) || !t && (i.getFlag(f, "state") || e && !e.getFlag(f, "draft"))
  };
}
function ri(i, s) {
  const { state: e, byKey: t, items: n, corpse: r, shared: o, locked: a } = vt(i, s), c = pe(i);
  return n.map((l) => {
    var v, y;
    const u = K(i, l, c), d = t.get(u.token), g = a ? "RuleLocked" : !u.token || e && !d ? "RuleMissingSnapshot" : d != null && d.taken ? "RuleCollected" : d != null && d.claim ? "RuleReserved" : "";
    return {
      id: l.id,
      name: l.name,
      img: l.img,
      quantity: N(l),
      entry: d,
      effective: se(u, r, o),
      overrides: { token: r[u.token], actor: (v = o.actor) == null ? void 0 : v[u.actor], global: (y = o.global) == null ? void 0 : y[u.global] },
      canToken: !g,
      tokenUnavailable: g,
      canActor: !!u.actor,
      canGlobal: !!u.global
    };
  });
}
async function ai(i, s, e, t, n) {
  if (!U()) throw new m("RuleGM");
  const { vault: r, state: o, byId: a, byKey: c, items: l, corpse: u, shared: d, locked: g } = vt(i, s), v = pe(i), y = l.filter((h) => t.includes(h.id)).map((h) => ({ item: h, key: K(i, h, v)[e] }));
  if (!t.length || y.length !== t.length || y.some(({ key: h }) => !h)) throw new m("RuleScopeUnavailable");
  const I = y.map(({ key: h }) => h);
  if (e === "actor" || e === "global")
    return si.run(Te, async () => {
      if (!U()) throw new m("RuleGM");
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
    Object.keys(b).length && await bt(i, [], { rules: JSON.stringify(b), draft: !0 });
    return;
  }
  if (!o) {
    await r.setFlag(f, "rules", JSON.stringify(b));
    return;
  }
  const S = /* @__PURE__ */ new Map(), T = [];
  for (const { item: h, key: w } of y) {
    const C = c.get(w), A = se(K(i, h, v), b, d).rule;
    if (C.limit !== yt(A) || !C.formula && pt(h, s, A)) {
      let H;
      const E = await fe(h, s, w, A, {
        original: C.originalQuantity ?? N(C.data),
        onRoll: (z) => {
          H = z;
        }
      });
      S.set(C.id, E), H && T.push({ roll: H, itemName: h.name, quantity: N(E.data) });
    }
  }
  if (!U()) throw new m("RuleGM");
  const q = {
    ...o,
    vaultId: r.id,
    entries: o.entries.map((h) => S.has(h.id) ? Me(S.get(h.id)) : h)
  };
  return await r.update({
    [B("rules")]: JSON.stringify(b),
    [B("state")]: q,
    [B("items")]: Array.from(a.values(), (h) => S.get(h.id) ?? h)
  }), await ne(i, q), T;
}
async function bt(i, s, e) {
  var r, o;
  const n = await (((o = (r = globalThis.foundry) == null ? void 0 : r.documents) == null ? void 0 : o.JournalEntry) ?? globalThis.JournalEntry).create({
    name: `HoloLoot · ${i.name}`,
    ownership: { default: 0 },
    flags: { [f]: { tokenUuid: i.uuid, kind: "snapshot", items: structuredClone(s), ...e } }
  });
  if (!n) throw new m("PersistenceFailed");
  return n.id;
}
function Ce(i, s, e) {
  const t = game.journal.get(i);
  if (!t || t.getFlag(f, "tokenUuid") !== s.uuid || t.getFlag(f, "kind") !== e) throw new m("RecoveryRequired");
  const n = t.getFlag(f, "items");
  if (!Array.isArray(n)) throw new m("RecoveryRequired");
  return structuredClone(n);
}
function St(i, s) {
  const e = k(i);
  return !!(i.actor && (s.manual || e.source !== "custom" && !e.customId) && s.sourceClaim && s.removeSource);
}
function oi(i, s) {
  var o;
  const e = $e(i), t = new Set((o = e == null ? void 0 : e.getFlag(f, "state")) == null ? void 0 : o.entries.filter((a) => !a.taken).map((a) => a.id)), n = e == null ? void 0 : e.getFlag(f, "items"), r = new Set((Array.isArray(n) ? n : []).filter((a) => a.wholeItem && t.has(a.id)).map((a) => {
    var c;
    return (c = a.source) == null ? void 0 : c.ruleKey;
  }));
  return we(i, s).map((a) => ({
    id: a.id,
    name: a.name,
    img: a.img,
    selected: r.has(K(i, a, null).token)
  }));
}
async function ci(i, s, e, t, n) {
  if (!U()) throw new m("RuleGM");
  if (!s.manual || !["enabled", "disabled"].includes(e)) throw new m("InvalidRequest");
  await It(i, s, { mode: e, ids: new Set(t) }), await i.setFlag(f, "config", {
    ...k(i),
    mode: e,
    source: "inventory",
    ...typeof n == "boolean" ? { keepLinkedActor: n } : {}
  });
}
async function It(i, s, e) {
  var T, q;
  if (!U()) throw new m("RuleGM");
  if (!St(i, s) || s.manual && !e) throw new m("RefreshUnsupported");
  const t = $e(i), n = t == null ? void 0 : t.getFlag(f, "state");
  if (!n) {
    await ze(i, s, e);
    return;
  }
  if (n.version !== 1) throw new m("RecoveryRequired");
  const r = n.entries.filter((h) => h.claim || h.taken), o = (h) => {
    var w, C, A, H;
    return ((C = (w = h.claim) == null ? void 0 : w.source) == null ? void 0 : C.itemId) || ((H = (A = h.claim) == null ? void 0 : A.source) == null ? void 0 : H.currency) && `currency:${h.claim.source.currency}`;
  };
  if (i.actorLink && r.some((h) => {
    var w, C;
    return ((C = (w = h.claim) == null ? void 0 : w.source) == null ? void 0 : C.actorUuid) !== x(i.actor);
  }) || r.some((h) => !o(h)))
    throw new m("RefreshUntracked");
  const a = new Set(r.filter((h) => !h.taken).map(o)), c = Ce(t.id, i, "snapshot"), l = new Map(c.map((h) => [h.id, h]));
  if (r.some((h) => !h.taken && !l.has(h.id))) throw new m("RecoveryRequired");
  const u = /* @__PURE__ */ new Map();
  for (const h of n.entries) {
    const w = l.get(h.id), C = ((T = w == null ? void 0 : w.source) == null ? void 0 : T.ruleKey) || ((q = w == null ? void 0 : w.currency) == null ? void 0 : q.storage) === "balance" && `currency:${w.currency.unit}`;
    C && u.set(C, { saved: w, taken: h.taken });
  }
  const d = (h, w) => (w && !w.taken && ae({ ...h, id: w.saved.id }) === ae(w.saved) && (h.id = w.saved.id), h), g = pe(i), v = xe(t), y = ye(), I = [];
  for (const h of [...we(i, s), ...Fe(i, s)]) {
    if (a.has(h.id) || s.manual && !(e != null && e.ids.has(h.id))) continue;
    const w = K(i, h, g), C = u.get(w.token), A = C == null ? void 0 : C.saved.limit, H = A === void 0 ? se(w, v, y).rule : He(A === "allow" || A === "never" ? A : "quantity", A), E = C == null ? void 0 : C.saved.rolledQuantity, z = A === void 0 || C.saved.formula ? void 0 : C.saved.rollCeiling ?? N(C.saved.data);
    I.push(d(await fe(h, s, w.token, H, { previousRoll: E, legacyRollCeiling: z }), C));
  }
  if (!U()) throw new m("RuleGM");
  const b = {
    ...n,
    vaultId: t.id,
    currencyReady: s.currencySnapshotVersion ?? !0,
    entries: [...r, ...I.map(Me)]
  }, S = r.flatMap((h) => l.has(h.id) ? [l.get(h.id)] : []);
  await t.update({
    [B("state")]: b,
    [B("items")]: [...S, ...I],
    ...e ? { [B("manualMode")]: e.mode } : {}
  }), await ne(i, b);
}
async function ze(i, s, e) {
  const t = $e(i);
  if (s.manual && !e && (t == null ? void 0 : t.getFlag(f, "manualMode")) !== "enabled") throw new m("Unavailable");
  let n = t == null ? void 0 : t.getFlag(f, "state");
  if (!n && (i.getFlag(f, "state") || t && !t.getFlag(f, "draft")))
    throw new m("RecoveryRequired");
  if (!n) {
    const c = k(i), l = ye(), u = xe(t), d = pe(i), g = [];
    if (!s.manual && Pe(i)) {
      const I = c.customId ? Ce(c.customId, i, "custom") : [];
      g.push(...I.map((b) => ({ id: foundry.utils.randomID(), data: b })));
    } else
      for (const I of we(i, s)) {
        if (s.manual && !(e != null && e.ids.has(I.id))) continue;
        const b = K(i, I, d), { rule: S } = se(b, u, l);
        g.push(await fe(I, s, b.token, S));
      }
    for (const I of Fe(i, s)) {
      const b = K(i, I, d);
      g.push(await fe(I, s, b.token, se(b, u, l).rule));
    }
    const v = { version: 1, currencyReady: s.currencySnapshotVersion ?? !0, entries: g.map(Me) }, y = t ? t.id : await bt(i, g, { state: v, ...e ? { manualMode: e.mode } : {} });
    n = { ...v, vaultId: y }, t && await t.update({
      [B("items")]: g,
      [B("state")]: n,
      [B("draft")]: !1,
      ...e ? { [B("manualMode")]: e.mode } : {}
    }), await ne(i, n);
  }
  if (n.version !== 1) throw new m("RecoveryRequired");
  n = { ...n, vaultId: n.vaultId ?? (t == null ? void 0 : t.id) };
  const r = s.currencySnapshotVersion ?? !0;
  if ((!n.currencyReady || s.currencySnapshotVersion && n.currencyReady !== r) && s.currencyEntries) {
    const c = t ?? game.journal.get(n.vaultId), l = c.getFlag(f, "items"), u = Array.isArray(l) ? structuredClone(l) : n.entries.every((g) => g.taken) ? [] : Ce(n.vaultId, i, "snapshot"), d = [];
    for (const g of Fe(i, s)) {
      const v = K(i, g, pe(i));
      d.push(await fe(g, s, v.token, se(v, xe(c), ye()).rule));
    }
    n = { ...n, currencyReady: r, entries: [...n.entries, ...d.map(Me)] }, d.length ? await c.update({ [`flags.${f}.items`]: [...u, ...d], [`flags.${f}.state`]: n }) : await c.setFlag(f, "state", n), await ne(i, n);
  }
  const o = i.getFlag(f, "state");
  if ((!o || s.currencySnapshotVersion && o.currencyReady !== n.currencyReady) && await ne(i, n), n.entries.every((c) => c.taken)) return {
    ...n,
    entries: n.entries.map((c) => ({ ...c, data: null }))
  };
  const a = Ce(n.vaultId, i, "snapshot");
  return { ...n, entries: n.entries.flatMap((c) => {
    var y, I, b;
    if (c.taken) return [{ ...c, data: null }];
    const l = a.find((S) => S.id === c.id), u = l == null ? void 0 : l.data;
    if (!u || !s.acceptsLegacyWholeItems && !!l.wholeItem != !!s.manual) throw new m("RecoveryRequired");
    let d = l.source;
    const g = s.allowsStoredItem && (d != null && d.itemId) ? (y = i.actor) == null ? void 0 : y.items.get(d.itemId) : null, v = s.allowsStoredItem && ((I = l.currency) == null ? void 0 : I.storage) !== "balance" && (!s.allowsStoredItem(u) || g && !s.allowsStoredItem(g));
    if (v && !c.claim) return [];
    if (!v && !d && !l.currency && !((b = i.getFlag(f, "config")) != null && b.customId) && s.snapshot) {
      const S = wt(we(i, s), s, u);
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
async function li(i, s) {
  const e = {
    version: 1,
    ...s.currencyReady ? { currencyReady: s.currencyReady } : {},
    vaultId: s.vaultId,
    entries: s.entries.map(({ id: n, taken: r, claim: o, hidden: a }) => ({
      id: n,
      taken: !!r,
      ...o ? { claim: o } : {},
      ...a ? { hidden: a } : {}
    }))
  }, t = game.journal.get(s.vaultId);
  if ((t == null ? void 0 : t.getFlag(f, "tokenUuid")) !== i.uuid) throw new m("RecoveryRequired");
  await t.setFlag(f, "state", e), await ne(i, e);
}
function di(i, s) {
  return {
    tokenUuid: i.uuid,
    name: i.name,
    img: i.texture.src,
    entries: s.entries.filter((e) => !e.taken && !e.hidden).map((e) => {
      var c, l, u, d, g, v, y, I, b, S, T, q, h, w, C, A, H, E, z, Q;
      const t = { ...e.data, system: e.data.system ?? {} }, n = t.system.identified === !1 || ((c = t.system.identification) == null ? void 0 : c.status) === "unidentified", r = n ? ((l = t.system.unidentified) == null ? void 0 : l.description) ?? ((u = t.system.description) == null ? void 0 : u.unidentified) : typeof t.system.description == "string" ? t.system.description : (d = t.system.description) == null ? void 0 : d.value, o = typeof t.system.rarity == "string" ? t.system.rarity : typeof ((g = t.system.traits) == null ? void 0 : g.rarity) == "string" ? t.system.traits.rarity : "", a = ((I = (y = (v = globalThis.CONFIG) == null ? void 0 : v.DND5E) == null ? void 0 : y.itemRarity) == null ? void 0 : I[o]) ?? ((T = (S = (b = globalThis.CONFIG) == null ? void 0 : b.PF2E) == null ? void 0 : S.rarityTraits) == null ? void 0 : T[o]);
      return {
        id: e.id,
        name: e.currency ? (h = (q = game.i18n).has) != null && h.call(q, `HL.Currency.${e.currency.unit}`) ? game.i18n.localize(`HL.Currency.${e.currency.unit}`) : t.name : n ? ((w = t.system.unidentified) == null ? void 0 : w.name) || ((A = (C = t.system.identification) == null ? void 0 : C.unidentified) == null ? void 0 : A.name) || game.i18n.localize("HL.Unidentified") : t.name,
        currency: !!e.currency,
        img: n && ((E = (H = t.system.identification) == null ? void 0 : H.unidentified) == null ? void 0 : E.img) || t.img,
        quantity: e.wholeItem ? 1 : ((z = e.currency) == null ? void 0 : z.amount) ?? N(t),
        ...e.wholeItem ? { wholeItem: !0 } : {},
        ...e.formula ? { formula: e.formula } : {},
        type: e.currency ? game.i18n.localize("HL.CurrencyLabel") : game.i18n.localize(`TYPES.Item.${t.type}`),
        rarity: n || !o ? "" : game.i18n.localize(typeof a == "string" ? a : o),
        tooltip: ((Q = new DOMParser().parseFromString(r ?? "", "text/html").body.textContent) == null ? void 0 : Q.slice(0, 1500)) ?? "",
        pending: !!e.claim
      };
    })
  };
}
function fi(i, s = i) {
  const e = `${s} |`;
  return {
    log: (t, ...n) => console.log(e, t, ...n),
    warn: (t, ...n) => console.warn(e, t, ...n),
    error: (t, ...n) => console.error(e, t, ...n)
  };
}
function hi(i, s = {}) {
  const e = s.socketName ?? `module.${i}`, t = fi(i, s.title ?? i);
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
const Ze = hi(f, { title: "HoloSuite Loot" }), he = /* @__PURE__ */ new Map(), mi = new oe();
async function gi(i, s) {
  game.socket.on(Ze.socketName, (e) => {
    (e == null ? void 0 : e.type) === "refresh" && typeof e.tokenUuid == "string" && s(e.tokenUuid);
  }), Hooks.on("updateUser", (e, t, n, r) => {
    var a, c, l;
    if (e.id === game.user.id && ((c = (a = t.flags) == null ? void 0 : a[f]) != null && c[Ee])) {
      let u;
      try {
        u = JSON.parse(e.getFlag(f, Ee));
      } catch {
        return;
      }
      const d = he.get(u == null ? void 0 : u.id);
      d && d.gm === r && ((l = game.users.get(r)) != null && l.isGM) && (clearTimeout(d.timer), he.delete(u.id), u.result.error ? d.reject(new m(u.result.error)) : d.resolve(structuredClone(u.result)));
    }
    const o = Ft(e, t, r, nt);
    !o || !U() || typeof o.id != "string" || !/^[\w-]{1,64}$/.test(o.id) || mi.run(e.id, async () => {
      if (!U()) return;
      let u;
      try {
        if (!qe(o)) throw new m("InvalidRequest");
        u = await i.execute(o, e);
      } catch (d) {
        console.warn("HoloSuite Loot | Request failed", d), u = { error: d.code ?? "TransferFailed" };
      }
      await e.setFlag(f, Ee, JSON.stringify({ id: o.id, result: u })), qe(o) && ["take", "all"].includes(o.action) && Ze.emit({ type: "refresh", tokenUuid: o.tokenUuid });
    }).catch((u) => console.warn("HoloSuite Loot | Could not deliver reply", u));
  }), game.user.isGM && await game.user.setFlag(f, "transportVersion", Re);
}
async function yi(i, s) {
  if (!qe(i)) throw new m("InvalidRequest");
  const e = Ve();
  if (!e) throw new m(game.users.contents.some((n) => n.active && n.isGM) ? "BuildMismatch" : "NoGM");
  if (e.id === game.user.id && s) return s.execute(i, game.user);
  const t = foundry.utils.randomID();
  return new Promise((n, r) => {
    const o = setTimeout(() => {
      he.delete(t), r(new m("Timeout"));
    }, i.action === "view" ? 8e3 : 2e4);
    he.set(t, { resolve: n, reject: r, timer: o, gm: e.id }), game.user.setFlag(f, nt, { ...i, id: t }).catch((a) => {
      clearTimeout(o), he.delete(t), r(a);
    });
  });
}
function pi() {
  var i, s, e;
  return ((s = (i = globalThis.foundry) == null ? void 0 : i.applications) == null ? void 0 : s.api) ?? ((e = foundry == null ? void 0 : foundry.applications) == null ? void 0 : e.api) ?? null;
}
function wi() {
  var i, s, e;
  return ((s = (i = globalThis.foundry) == null ? void 0 : i.appv1) == null ? void 0 : s.api) ?? ((e = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : e.api) ?? null;
}
function vi(i = {}, s = {}) {
  var t, n, r;
  const e = ((n = (t = globalThis.foundry) == null ? void 0 : t.utils) == null ? void 0 : n.mergeObject) ?? ((r = foundry == null ? void 0 : foundry.utils) == null ? void 0 : r.mergeObject);
  return typeof e == "function" ? e(i, s, { inplace: !1 }) : { ...i, ...s };
}
function bi() {
  var i, s, e, t, n;
  return ((e = (s = (i = globalThis.foundry) == null ? void 0 : i.utils) == null ? void 0 : s.randomID) == null ? void 0 : e.call(s, 8)) ?? ((n = (t = foundry == null ? void 0 : foundry.utils) == null ? void 0 : t.randomID) == null ? void 0 : n.call(t, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function et(i = {}) {
  return {
    id: String(i.id ?? `legacy-application-${bi()}`),
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
function Si(i) {
  return class extends i {
    constructor(t = {}) {
      const n = vi(new.target.defaultOptions ?? {}, t);
      super(et(n));
      p(this, "_v1Options");
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
function Ii() {
  const i = pi(), s = wi(), e = globalThis.Application ?? (s == null ? void 0 : s.Application) ?? (i == null ? void 0 : i.ApplicationV1) ?? globalThis.FormApplication ?? (s == null ? void 0 : s.FormApplication) ?? (i == null ? void 0 : i.FormApplication);
  if (e) return e;
  const t = i == null ? void 0 : i.ApplicationV2;
  return t ? Si(t) : null;
}
class Li {
  constructor(s, e) {
    p(this, "outside", (s) => {
      s.composedPath().includes(this.root) || this.dismiss();
    });
    this.root = s, this.dismiss = e, document.addEventListener("pointerdown", this.outside, !0);
  }
  destroy() {
    document.removeEventListener("pointerdown", this.outside, !0);
  }
}
class Ci {
  constructor(s, e, t, n) {
    p(this, "frame", 0);
    p(this, "destroyed", !1);
    p(this, "svg");
    p(this, "line");
    p(this, "lastGeometry", "");
    p(this, "outside", (s) => {
      var t, n;
      const e = s.composedPath();
      s.button === 2 && e.includes(((t = canvas.app) == null ? void 0 : t.canvas) ?? ((n = canvas.app) == null ? void 0 : n.view)) || e.includes(this.root) || this.dismiss();
    });
    p(this, "update", () => {
      var t, n;
      if (this.destroyed) return;
      const s = ((t = canvas.app) == null ? void 0 : t.canvas) ?? ((n = canvas.app) == null ? void 0 : n.view), e = this.token.object;
      if (!this.root.isConnected) {
        this.destroy();
        return;
      }
      if (!e || this.token.hidden) {
        this.destroy(), this.dismiss();
        return;
      }
      if (this.root.isConnected && s && canvas.stage) {
        const r = s.getBoundingClientRect(), o = canvas.app.renderer.screen, a = canvas.stage.worldTransform.apply(e.center), c = r.left + a.x * r.width / o.width, l = r.top + a.y * r.height / o.height, u = this.root.getBoundingClientRect(), d = 24 + Math.min(60, (e.w ?? 0) * Math.abs(canvas.stage.worldTransform.a) / 2), g = c + d + u.width <= innerWidth - 8 ? c + d : c - d - u.width, v = Math.max(8, Math.min(innerWidth - u.width - 8, g)), y = Math.max(8, Math.min(innerHeight - u.height - 8, l - u.height / 3));
        (Math.abs(u.left - v) > 0.5 || Math.abs(u.top - y) > 0.5) && this.position(v, y);
        const I = this.root.querySelector(".hl-panel") ?? this.root, b = I.getBoundingClientRect(), S = getComputedStyle(I), T = parseFloat(S.borderLeftWidth) || 3, q = Math.min(parseFloat(S.borderTopLeftRadius) || 0, b.height / 2, b.width / 2), h = c <= b.left || c >= b.right, w = h ? c <= b.left ? b.left + T / 2 : b.right - T / 2 : Math.max(b.left + q, Math.min(b.right - q, c)), C = h ? Math.max(b.top + q, Math.min(b.bottom - q, l)) : l < (b.top + b.bottom) / 2 ? b.top + T / 2 : b.bottom - T / 2, A = `${c},${l},${w},${C}`;
        A !== this.lastGeometry && (this.line.setAttribute("x1", String(c)), this.line.setAttribute("y1", String(l)), this.line.setAttribute("x2", String(w)), this.line.setAttribute("y2", String(C)), this.lastGeometry = A), this.line.style.stroke = S.borderLeftColor, this.line.style.strokeWidth = String(T), this.svg.style.zIndex = String(Math.max(0, (parseInt(getComputedStyle(this.root).zIndex) || 100) - 1));
      }
      this.frame = requestAnimationFrame(this.update);
    });
    this.root = s, this.token = e, this.position = t, this.dismiss = n;
    const r = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(r, "svg"), this.svg.classList.add("hl-loot-tether"), this.svg.setAttribute("aria-hidden", "true"), this.line = document.createElementNS(r, "line"), this.svg.append(this.line), document.body.append(this.svg), document.addEventListener("pointerdown", this.outside, !0), this.frame = requestAnimationFrame(this.update);
  }
  destroy() {
    this.destroyed = !0, cancelAnimationFrame(this.frame), document.removeEventListener("pointerdown", this.outside, !0), this.svg.remove();
  }
}
const ee = (i) => String(i ?? "").replace(/[&<>"']/g, (s) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[s]);
async function Ri({ roll: i, itemName: s, quantity: e }) {
  var o;
  const { game: t } = globalThis, n = t.i18n.format("HL.QuantityRollChat", { item: ee(s), quantity: e }), r = ((o = t.release) == null ? void 0 : o.generation) >= 14 ? { messageMode: "self" } : { rollMode: "selfroll" };
  await i.toMessage({ flavor: n }, r);
}
async function qi(i, s) {
  var d;
  const { game: e, foundry: t, ChatMessage: n } = globalThis, r = i.claim.quantityRoll, o = s.preview ? s.preview(i) : i.data, c = (((d = t == null ? void 0 : t.dice) == null ? void 0 : d.Roll) ?? globalThis.Roll).fromData(r.roll), l = e.i18n.format("HL.PickupRollChat", { item: ee(o.name), quantity: r.quantity }), u = await c.toMessage({ flavor: l }, { create: !1 });
  await n.create({ ...u, whisper: [i.claim.userId], blind: !1 });
}
async function Ai({ token: i, actor: s, entry: e, adapter: t }) {
  var c;
  const { game: n, ChatMessage: r } = globalThis;
  if (!n.settings.get(f, "chatLog")) return;
  const o = t.preview ? t.preview(e) : e.data, a = n.i18n.format("HL.ChatLooted", {
    actor: ee(s.name),
    source: ee(i.name),
    item: ee(o.name),
    quantity: ee(e.wholeItem ? 1 : ((c = e.currency) == null ? void 0 : c.amount) ?? N(o))
  });
  await r.create({
    speaker: r.getSpeaker({ actor: s }),
    content: `<p>${a}</p>`,
    whisper: [],
    blind: !1,
    flags: { [f]: { claimId: e.claim.id, userId: e.claim.userId } }
  });
}
const Lt = Ii(), Ct = (i) => `modules/${f}/templates/${i}.hbs`, $ = (i) => game.i18n.localize(`HL.${i}`);
function V(i) {
  const s = $((i == null ? void 0 : i.code) ?? "TransferFailed");
  return ui.notifications.warn(s), s;
}
const Rt = (i) => i instanceof HTMLElement ? i : i[0];
class Ti extends Lt {
  constructor(e, t, n) {
    super({ id: `hololoot-${e.id}` });
    p(this, "token");
    p(this, "send");
    p(this, "adapter");
    p(this, "data", { entries: [] });
    p(this, "destination", "");
    p(this, "busy", !1);
    p(this, "message", "");
    p(this, "loading", !1);
    p(this, "firstDraw", null);
    p(this, "resolveFirstDraw", null);
    p(this, "refreshing", null);
    p(this, "refreshAgain", !1);
    p(this, "disposed", !1);
    p(this, "presentation", null);
    this.token = e, this.send = t, this.adapter = n;
    const r = game.user.character;
    ie(r, game.user, n, e) && (this.destination = n.manual ? x(r) : r.id);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: "HoloSuite Loot",
      classes: ["holosuite-loot-window", "holosuite-loot-popup"],
      template: Ct("loot"),
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
            V(e), await this.close();
            return;
          }
          this.data = { entries: [] }, this.message = V(e);
        }
        this.loading = !1, this.disposed || this.render(!0);
      })().finally(() => {
        this.refreshing = null, this.refreshAgain && !this.disposed && !this.busy && this.refresh();
      }), this.refreshing);
    }
  }
  getData() {
    var c, l;
    const e = game.settings.get(f, "characterSelector"), t = game.settings.get(f, "panelTheme"), n = this.adapter.manual ? [...new Map([...game.actors.contents, ...Array.from(((c = canvas.scene) == null ? void 0 : c.tokens) ?? [], (u) => u.actor)].filter((u) => ie(u, game.user, this.adapter, this.token)).map((u) => [x(u), u])).values()] : game.actors.contents.filter((u) => ie(u, game.user, this.adapter)), r = (u) => this.adapter.manual ? x(u) : u.id;
    let o = "";
    if (e)
      !this.destination && n.length === 1 && (this.destination = r(n[0]));
    else try {
      this.destination = x(ot(game.user, game.actors.contents, (l = canvas.scene) == null ? void 0 : l.tokens, this.adapter, this.token));
    } catch (u) {
      this.destination = "", o = $(u.code);
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
      message: this.message || o || (!n.length && e ? $("NoActor") : ""),
      empty: !this.loading && !this.data.entries.length && !this.message
    };
  }
  activateListeners(e) {
    var r, o, a;
    if (super.activateListeners(e), this.disposed) return;
    const t = Rt(e);
    (r = this.presentation) == null || r.destroy();
    const n = t.closest(".window-app, .application") ?? t.closest(".holosuite-loot-popup") ?? t;
    this.presentation = new Ci(
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
      V(t);
    }
  }
  async take(e) {
    if (!this.busy) {
      if (this.getData(), !this.destination) {
        this.message = this.getData().message || $("NoActor"), this.render(!0);
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
        this.message = t.map((n) => `${n.name}: ${$(n.code)}`).join(" · "), this.message && ui.notifications.warn(this.message);
      } catch (t) {
        this.message = V(t);
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
class Fi extends Lt {
  constructor(e, t, n) {
    super({ id: `hololoot-config-${e.id}` });
    p(this, "token");
    p(this, "adapter");
    p(this, "queue");
    p(this, "config");
    p(this, "scope", "token");
    p(this, "busy", !1);
    p(this, "dismissal", null);
    this.token = e, this.adapter = t, this.queue = n, this.config = structuredClone(k(e)), this.config.keepLinkedActor = at(e);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: $("Title"),
      classes: ["holosuite-loot-window", "holosuite-loot-config"],
      template: Ct("config"),
      width: 480,
      height: "auto",
      resizable: !1
    });
  }
  getData() {
    const e = !!this.adapter.manual, t = !e && game.settings.get(f, "zeroHP"), n = !t && this.config.mode === "automatic" ? "disabled" : this.config.mode, r = (c) => (c == null ? void 0 : c.quantity) ?? (c ? $(`Rule.${c.mode}`) : ""), o = e ? oi(this.token, this.adapter) : ri(this.token, this.adapter).map(({ entry: c, effective: l, overrides: u, ...d }) => ({
      ...d,
      configured: r(l.rule),
      effectiveScope: l.scope,
      tokenRule: r(u.token),
      actorRule: r(u.actor),
      globalRule: r(u.global),
      ruleScope: $(`Scope.${l.scope}`),
      original: (c == null ? void 0 : c.originalQuantity) ?? d.quantity,
      remaining: c ? c.taken ? 0 : c.formula ?? N(c.data) : "—",
      rollResult: !(c != null && c.taken) && Number.isSafeInteger(c == null ? void 0 : c.rolledQuantity) ? game.i18n.format("HL.QuantityRollResult", { roll: c.rolledQuantity, quantity: N(c.data) }) : "",
      pending: !!(c != null && c.claim) && !(c != null && c.taken)
    })), a = U();
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
      canRefresh: !e && a && St(this.token, this.adapter),
      scopes: ["token", "actor", "global"].map((c) => ({ value: c, label: $(`Scope.${c}`), selected: this.scope === c })),
      modes: (t ? ["automatic", "enabled", "disabled"] : ["enabled", "disabled"]).map((c) => ({ value: c, label: $(c), selected: c === n }))
    };
  }
  activateListeners(e) {
    var g, v, y, I, b;
    super.activateListeners(e);
    const t = Rt(e);
    (g = this.dismissal) == null || g.destroy(), this.dismissal = new Li(t.closest(".window-app, .application") ?? t, () => {
      this.busy || this.close();
    }), (v = t.querySelector('[name="mode"]')) == null || v.addEventListener("change", (S) => {
      this.config.mode = S.target.value;
    }), (y = t.querySelector('[name="keepLinkedActor"]')) == null || y.addEventListener("change", (S) => {
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
        C && (C.textContent = !h && A ? $(A) : "");
        const H = w == null ? void 0 : w.querySelector("[data-scoped-rule]"), E = q.dataset[`${this.scope}Rule`];
        return H && (H.textContent = E && q.dataset.effectiveScope !== this.scope ? ` · ${$(`Scope.${this.scope}`)} ${E}` : ""), h;
      }), T = S.filter((q) => q.checked).length;
      l.disabled = this.busy || !S.length, l.checked = !!T && T === S.length, l.indeterminate = !!T && !l.checked, a.disabled = this.busy || !T, o.hidden = r.value !== "quantity";
    };
    n.addEventListener("change", d), r.addEventListener("change", d);
    for (const S of u) S.addEventListener("change", d);
    l.addEventListener("change", () => {
      for (const S of u) S.disabled || (S.checked = l.checked);
      d();
    }), c == null || c.addEventListener("click", async () => {
      if (!(!U() || this.busy)) {
        this.busy = !0, d();
        try {
          await this.queue.run(this.token.uuid, () => It(this.token, this.adapter)), ui.notifications.info($("InventoryRefreshed"));
        } catch (S) {
          V(S);
          return;
        } finally {
          this.busy = !1, d();
        }
        this.rendered && this.render(!0);
      }
    }), a.addEventListener("click", async () => {
      if (!(!U() || this.busy)) {
        try {
          const S = He(r.value, o.value), T = u.filter((w) => w.checked && !w.disabled).map((w) => w.value), q = this.scope;
          this.busy = !0, d();
          const h = await this.queue.run(this.token.uuid, () => ai(this.token, this.adapter, q, T, S));
          for (const w of h ?? [])
            Ri(w).catch((C) => console.warn("HoloSuite Loot | Could not post quantity roll", C));
        } catch (S) {
          V(S);
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
        await this.queue.run(this.token.uuid, () => this.adapter.manual ? ci(this.token, this.adapter, t, e, this.config.keepLinkedActor) : this.token.setFlag(f, "config", { ...k(this.token), mode: t, keepLinkedActor: this.config.keepLinkedActor })), await this.close();
      } catch (t) {
        V(t);
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
class xi {
  constructor(s) {
    p(this, "sprites", /* @__PURE__ */ new Map());
    p(this, "texture");
    p(this, "disposed", !1);
    var t;
    this.available = s;
    const e = ((t = foundry.canvas) == null ? void 0 : t.loadTexture) ?? globalThis.loadTexture;
    Promise.resolve().then(() => e == null ? void 0 : e(`modules/${f}/assets/ui/loot-badge.svg`)).then((n) => {
      this.disposed || !n || (this.texture = n, this.refreshScene());
    }).catch((n) => console.warn("HoloSuite Loot | Badge texture could not load", n));
  }
  refreshScene() {
    var s;
    for (const e of ((s = canvas.tokens) == null ? void 0 : s.placeables) ?? []) this.refresh(e);
  }
  refresh(s) {
    if (!s || this.disposed || !this.texture) return;
    const e = s.document, t = e.getFlag(f, "state");
    if (s.destroyed || s.isPreview || e.hidden || !this.available(e) || t && !t.entries.some((r) => !r.taken && !r.hidden)) {
      this.remove(s);
      return;
    }
    let n = this.sprites.get(s);
    (n != null && n.destroyed || (n == null ? void 0 : n.parent) !== s) && (this.remove(s), n = new PIXI.Sprite(this.texture), n.name = "holosuite-loot-badge", n.eventMode = "none", n.anchor.set(0.5), n.width = n.height = 24, n.zIndex = 100, s.addChild(n), this.sprites.set(s, n)), n.position.set(s.w, 0);
  }
  remove(s) {
    var t;
    const e = this.sprites.get(s);
    this.sprites.delete(s), e && !e.destroyed && ((t = e.parent) == null || t.removeChild(e), e.destroy());
  }
  destroy() {
    this.disposed = !0;
    for (const s of this.sprites.keys()) this.remove(s);
  }
}
const O = /* @__PURE__ */ new Map();
let M = null, Y = !1, Le = 0;
const j = () => Jt(game.system.id), ve = () => ii(j()), Be = (i) => {
  var s, e;
  return (i == null ? void 0 : i.actor) && (j().manual ? !!i.actor.items : ((e = (s = j()).sourceActor) == null ? void 0 : e.call(s, i.actor)) ?? i.actor.type === "npc");
}, Mi = (i, s, e) => {
  var t;
  return ot(i, game.actors.contents, (t = game.scenes.get(i.viewedScene)) == null ? void 0 : t.tokens, s, e);
}, Se = new kt({
  moduleId: f,
  authority: U,
  environment: ve,
  adapter: j,
  token: async (i) => {
    if (!/^Scene\.[^.]+\.Token\.[^.]+$/.test(i)) throw new m("InvalidRequest");
    const e = await (foundry.utils.fromUuid ?? globalThis.fromUuid)(i);
    return (e == null ? void 0 : e.documentName) === "Token" ? e : null;
  },
  actor: (i) => game.actors.get(i) ?? (foundry.utils.fromUuid ?? globalThis.fromUuid)(i),
  id: () => foundry.utils.randomID(),
  destination: (i, s, e) => game.settings.get(f, "characterSelector") ? i.actorId ? Se.io.actor(i.actorId) : null : Mi(s, j(), e),
  load: ze,
  save: li,
  summary: di,
  collected: Ai,
  rollQuantity: ni,
  quantityRolled: qi
}), Ue = (i) => yi(i, Se);
function Ke(i) {
  var s;
  return Y && me(i, ve()) && (game.user.isGM || !i.hidden && ((s = i.object) == null ? void 0 : s.isVisible));
}
async function Ne(i) {
  var r, o, a, c, l;
  i = (i == null ? void 0 : i.document) ?? i;
  const s = j();
  if (!s) {
    V(new m("Unsupported"));
    return;
  }
  if (game.user.isGM) return Ie(i);
  if (!Ke(i)) {
    V(new m("Unavailable"));
    return;
  }
  const e = ++Le;
  let t;
  if (je() > 0 && (!O.has(i.uuid) || (r = O.get(i.uuid)) != null && r.disposed)) {
    try {
      t = await Ue({ action: "view", tokenUuid: i.uuid });
    } catch (u) {
      e === Le && ((o = canvas.scene) == null ? void 0 : o.id) === ((a = i.parent) == null ? void 0 : a.id) && V(u);
      return;
    }
    if (e !== Le || ((c = canvas.scene) == null ? void 0 : c.id) !== ((l = i.parent) == null ? void 0 : l.id)) return;
  }
  for (const [u, d] of O)
    u !== i.uuid && !d.disposed && await d.close();
  if (e !== Le) return;
  let n = O.get(i.uuid);
  (!n || n.disposed) && (n = new Ti(i, Ue, s), O.set(i.uuid, n), await n.show(t), t !== void 0) || n.disposed || await n.refresh();
}
async function Ie(i) {
  var s;
  if (!(!game.user.isGM || !j())) {
    if (((s = i == null ? void 0 : i.parent) == null ? void 0 : s.documentName) !== "Scene" || !Be(i)) {
      ui.notifications.info($("SelectToken"));
      return;
    }
    try {
      new Fi(i, j(), Se.queue).render(!0);
    } catch (e) {
      V(e);
    }
  }
}
function be(i) {
  const s = O.get(i);
  s && !s.disposed && s.refresh();
}
function Qe(i) {
  const s = j(), e = () => {
    const t = i.getFlag(f, "state");
    return !t || s.currencySnapshotVersion && t.currencyReady !== s.currencySnapshotVersion;
  };
  !Y || !U() || s.manual || !e() || !me(i, ve()) || Se.queue.run(i.uuid, async () => {
    U() && e() && me(i, ve()) && await ze(i, s);
  }).catch((t) => console.warn("HoloSuite Loot | Snapshot initialization failed", i.uuid, t));
}
function G() {
  var i;
  for (const s of ((i = canvas.scene) == null ? void 0 : i.tokens) ?? []) Qe(s);
  M == null || M.refreshScene();
}
function Hi() {
  const i = [.../* @__PURE__ */ new Set([...canvas.tokens.controlled, ...game.user.targets])];
  if (i.length !== 1) {
    ui.notifications.info($("SelectToken"));
    return;
  }
  const s = i[0];
  game.user.isGM ? Ie(s.document) : Ne(s.document);
}
function tt() {
  var s;
  const i = ((s = game.modules.get("holosuite-core")) == null ? void 0 : s.api) ?? game.holosuite;
  return i != null && i.registerApp ? (i.registerApp({
    id: f,
    title: $("Title"),
    icon: "fa-solid fa-box-open",
    playerVisible: !1,
    premium: !1,
    description: $("SelectToken"),
    open: Hi
  }), !0) : !1;
}
let F, re, it = "", st = 0;
function te(i) {
  var c, l;
  if (game.user.isGM || !Y || i.type === "pointerdown" && i.button !== 2) return;
  const s = F == null ? void 0 : F.getBoundingClientRect(), e = (l = (c = canvas.app) == null ? void 0 : c.renderer) == null ? void 0 : l.screen;
  if (!(s != null && s.width) || !s.height || !e || !canvas.stage) return;
  const t = canvas.stage.worldTransform.applyInverse({
    x: (i.clientX - s.left) * e.width / s.width,
    y: (i.clientY - s.top) * e.height / s.height
  }), n = (u) => {
    var d;
    return (u == null ? void 0 : u.isVisible) && (((d = u.bounds) == null ? void 0 : d.contains(t.x, t.y)) ?? (t.x >= u.document.x && t.y >= u.document.y && t.x <= u.document.x + u.w && t.y <= u.document.y + u.h));
  }, r = n(re) ? re : [...canvas.tokens.placeables].reverse().find(n), o = r == null ? void 0 : r.document;
  if (!Ke(o)) {
    for (const u of O.values()) u.disposed || u.close();
    return;
  }
  if (i.type === "contextmenu" && it === o.uuid && Date.now() - st < 1e3) return;
  i.type === "pointerdown" && (it = o.uuid, st = Date.now());
  const a = O.get(o.uuid);
  a && !a.disposed ? a.close() : Ne(o);
}
function qt() {
  var i, s;
  M == null || M.destroy(), M = Y ? new xi((e) => me(e, ve())) : null, F == null || F.removeEventListener("contextmenu", te, !0), F == null || F.removeEventListener("pointerdown", te, !0), F = ((i = canvas.app) == null ? void 0 : i.canvas) ?? ((s = canvas.app) == null ? void 0 : s.view), F == null || F.addEventListener("contextmenu", te, !0), F == null || F.addEventListener("pointerdown", te, !0);
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
      G();
      for (const i of O.keys()) be(i);
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
  }), game.settings.register(f, ht, {
    name: "HL.LootRange",
    hint: "HL.LootRangeHint",
    scope: "world",
    config: !0,
    type: Number,
    default: mt,
    onChange: () => {
      for (const i of O.keys()) be(i);
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
      for (const i of O.values()) i.disposed || i.render(!1);
    }
  });
});
Hooks.once("ready", async () => {
  var i;
  if (!((i = game.modules.get("holosuite-core")) != null && i.active)) {
    ui.notifications.error($("CoreMissing"));
    return;
  }
  try {
    await gi(Se, be);
  } catch (s) {
    V(s);
    return;
  }
  Y = !0, game.modules.get(f).api = {
    version: Re,
    open: Ne,
    configure: Ie,
    registerAdapter: Wt,
    // Requests still pass every authority and permission check, including calls from macros.
    request: Ue,
    authority: () => {
      var s;
      return (s = Ve()) == null ? void 0 : s.id;
    }
  }, tt(), setTimeout(tt, 500), qt(), G(), console.info(`HoloSuite Loot | ${Re} ready; Foundry ${game.version}, ${game.system.id} ${game.system.version}`);
});
Hooks.on("canvasReady", () => {
  qt(), G();
});
Hooks.on("hoverToken", (i, s) => {
  s ? re = i : re === i && (re = null);
});
Hooks.on("canvasTearDown", () => {
  M == null || M.destroy(), M = null, re = null, F == null || F.removeEventListener("contextmenu", te, !0), F == null || F.removeEventListener("pointerdown", te, !0), F = null;
  for (const i of O.values()) i.close();
  O.clear();
});
Hooks.on("renderTokenHUD", (i, s) => {
  var o;
  if (!Y) return;
  const e = (o = i.object) == null ? void 0 : o.document;
  if (!Be(e)) return;
  const t = s instanceof HTMLElement ? s : s[0], n = t.querySelector(".col.right") ?? t;
  t.querySelectorAll(".hl-token-action").forEach((a) => a.remove());
  const r = (a, c, l) => {
    const u = document.createElement("button");
    u.type = "button", u.className = "control-icon hl-token-action", u.title = a, u.setAttribute("aria-label", a);
    const d = document.createElement("i");
    d.className = c, u.append(d), u.addEventListener("click", (g) => {
      g.preventDefault(), g.stopPropagation(), l();
    }), n.append(u);
  };
  game.user.isGM ? j() && !game.settings.get(f, "hideGmLootButton") && r($("Loot"), "fa-solid fa-box-open", () => void Ie(e)) : Ke(e) && r($("Loot"), "fa-solid fa-box-open", () => void Ne(e));
});
Hooks.on("renderTokenConfig", (i, s) => {
  var r;
  if (!Y || !game.user.isGM || !j()) return;
  const e = i.document ?? i.object;
  if (((r = e == null ? void 0 : e.parent) == null ? void 0 : r.documentName) !== "Scene" || !Be(e)) return;
  const t = s instanceof HTMLElement ? s : s[0];
  if (t.querySelector(".hl-token-config")) return;
  const n = document.createElement("button");
  n.type = "button", n.className = "hl-token-config", n.textContent = $("Configure"), n.addEventListener("click", () => Ie(e)), (t.querySelector('[data-tab="character"]') ?? t.querySelector("form") ?? t).append(n);
});
Hooks.on("drawToken", (i) => M == null ? void 0 : M.refresh(i));
Hooks.on("refreshToken", (i, s) => {
  (!s || s.refreshSize || s.refreshShape) && (M == null || M.refresh(i));
});
Hooks.on("destroyToken", (i) => M == null ? void 0 : M.remove(i));
Hooks.on("updateToken", (i, s) => {
  var e, t, n;
  if (Qe(i), M == null || M.refresh(i.object), be(i.uuid), !(!O.size || !je() || ((e = i.parent) == null ? void 0 : e.id) !== ((t = canvas.scene) == null ? void 0 : t.id) || !i.actor || !((n = j()) != null && n.destination(i.actor)) || !i.actor.testUserPermission(game.user, "OWNER") || !["x", "y", "elevation", "width", "height", "hidden"].some((r) => r in s)))
    for (const r of O.keys()) r !== i.uuid && be(r);
});
Hooks.on("createToken", Qe);
Hooks.on("createCombatant", G);
Hooks.on("updateCombatant", G);
Hooks.on("deleteCombatant", G);
Hooks.on("updateCombat", G);
Hooks.on("deleteCombat", G);
Hooks.on("updateActor", G);
Hooks.on("createActiveEffect", G);
Hooks.on("updateActiveEffect", G);
Hooks.on("deleteActiveEffect", G);
Hooks.on("userConnected", G);
Hooks.on("deleteToken", (i) => {
  var s;
  if ((s = O.get(i.uuid)) == null || s.close(), O.delete(i.uuid), !!U())
    for (const e of game.journal.contents)
      e.getFlag(f, "tokenUuid") === i.uuid && e.delete().catch(console.warn);
});
