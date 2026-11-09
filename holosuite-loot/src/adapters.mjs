import { canonical, clone, MODULE_ID, LootError } from "./model.mjs";
import { dndCurrency } from "./currency.mjs";

function snapshotItem(item) {
  const data = clone(item.toObject());
  delete data._id; delete data.folder; delete data.ownership; delete data._stats;
  delete data.flags?.[MODULE_ID];
  for (const effect of data.effects ?? []) { delete effect._id; effect.origin = null; }
  return data;
}

async function detachSource(token) {
  if (token.actorLink) await token.update({ actorLink: false });
  if (token.actorLink) throw new LootError("SourceChanged");
}

class EmbeddedItemAdapter {
  manual = false;
  received(actor, _entry, claim) {
    return actor.items.get(claim.itemId)?.getFlag(MODULE_ID, "claim") === claim.id;
  }
  async create(actor, entry, claim) {
    const existing = actor.items.get(claim.itemId);
    if (existing) {
      if (existing.getFlag(MODULE_ID, "claim") !== claim.id) throw new LootError("RecoveryRequired");
      return existing;
    }
    const data = clone(entry.data);
    data._id = claim.itemId;
    data.flags ??= {};
    data.flags[MODULE_ID] = { claim: claim.id };
    const [created] = await actor.createEmbeddedDocuments("Item", [data], { keepId: true });
    if (!created || (this.manual ? !this.received(actor, entry, claim) : created.id !== claim.itemId)) {
      throw new LootError("TransferFailed");
    }
    return created;
  }
}

export class Dnd5eAdapter extends EmbeddedItemAdapter {
  id = "dnd5e";
  currencyEntries(actor) { return dndCurrency.entries(actor); }
  received(actor, entry, claim) {
    return entry.currency?.storage === "balance" ? dndCurrency.received(actor, entry, claim)
      : super.received(actor, entry, claim);
  }
  async cleanup(token, actor, entry, claim) {
    if (entry.currency?.storage === "balance") await dndCurrency.cleanup(token, actor, entry, claim);
  }
  destination(actor) { return actor.type === "character"; }
  eligible(item) {
    const system = item.system;
    const metadata = system?.constructor?.metadata;
    const physical = ["weapon", "equipment", "consumable", "tool", "loot", "container"];
    if (!physical.includes(item.type) || metadata?.inventoryItem === false) return false;
    // Modern D&D5e models expose inventoryItem; older versions use the physical schema.
    const field = system?.schema?.getField?.("quantity");
    if (system?.schema && !field) return false;
    if (!Number.isSafeInteger(system?.quantity) || system.quantity <= 0) return false;
    const subtype = system.type?.value ?? system.weaponType ?? system.armor?.type;
    return !["natural", "siege", "vehicle", "currency"].includes(subtype);
  }
  snapshot(item) {
    const data = snapshotItem(item);
    // Preserve item mechanics, activities and effects, but detach corpse-local relationships.
    data.system.container = null;
    if ("equipped" in data.system) data.system.equipped = false;
    if ("attuned" in data.system) data.system.attuned = false;
    // D&D5e 3.x used attunement=2 for an attuned item, 1 for required.
    if (data.system.attunement === 2) data.system.attunement = 1;
    return data;
  }
  async create(actor, entry, claim, beginCurrency) {
    if (entry.currency?.storage === "balance") return dndCurrency.grant(actor, entry, claim, beginCurrency);
    return super.create(actor, entry, claim);
  }
  preview(entry) {
    const data = clone(entry.data);
    if (data.system.identified !== false) return data;
    return { name: data.system.unidentified?.name || "Unidentified Item", img: data.img, type: "loot",
      system: { quantity: data.system.quantity, identified: false, description: { value: data.system.unidentified?.description ?? "" } } };
  }
  async sourceClaim(token, entry) {
    if (!entry.source?.itemId && entry.currency?.storage !== "balance") return null;
    if (entry.source?.ruleKey && entry.source.ruleKey !== `${token.actorId ?? token.actor?.id ?? ""}:${entry.source.itemId}`) {
      throw new LootError("SourceChanged");
    }
    await detachSource(token);
    if (entry.currency?.storage === "balance") return dndCurrency.sourcePlan(token, entry);
    const item = token.actor.items.get(entry.source.itemId);
    const quantity = item?.system.quantity;
    if (!this.eligible(item ?? {}) || quantity < entry.data.system.quantity
      || (entry.source.ruleKey && item.type !== entry.data.type)) throw new LootError("SourceChanged");
    return { itemId: item.id, before: quantity, after: quantity - entry.data.system.quantity };
  }
  validateSourcePlan(token, entry, claim) {
    if (!entry.source?.ruleKey) return;
    const item = token.actor?.items.get(claim.source?.itemId);
    if (token.actorLink || entry.source.ruleKey !== `${token.actorId ?? token.actor?.id ?? ""}:${item?.id}`
      || !this.eligible(item ?? {}) || item.type !== entry.data.type || item.system.quantity !== claim.source.before) {
      throw new LootError("SourceChanged");
    }
    const expected = claim.source.sfCurrency;
    if (expected) {
      const current = this.entryMetadata(item).currency;
      if (current?.unit !== expected.unit || current?.amount !== expected.amount) throw new LootError("CurrencyChanged");
    }
  }
  async removeSource(token, entry, claim) {
    const source = claim.source;
    if (!source) return;
    // A GM may have relinked the corpse since reservation; never edit a shared Actor.
    await detachSource(token);
    if (source.currency) return dndCurrency.debit(token, entry, claim);
    const item = token.actor.items.get(source.itemId);
    if (!item) return; // A completed deletion is idempotent across a failed ledger write.
    if (item.getFlag(MODULE_ID, "sourceClaim") === claim.id) return;
    if (item.system.quantity !== source.before) throw new LootError("SourceChanged");
    if (source.after === 0) await token.actor.deleteEmbeddedDocuments("Item", [item.id]);
    else await item.update({ "system.quantity": source.after, [`flags.${MODULE_ID}.sourceClaim`]: claim.id });
    const remaining = token.actor.items.get(source.itemId);
    if (source.after === 0 ? !!remaining : remaining?.system.quantity !== source.after
      || remaining?.getFlag(MODULE_ID, "sourceClaim") !== claim.id) throw new LootError("SourceChanged");
  }
}

/** SF2e stores money as physical treasure, including native credstick Items.
 * Keeping each credstick preserves its value and fixed-ID transfer recovery. */
export class Sf2eAdapter extends Dnd5eAdapter {
  id = "sf2e";
  currencyEntries() { return []; }
  eligible(item) {
    const types = ["ammo", "armor", "backpack", "book", "consumable", "equipment", "shield", "treasure", "weapon"];
    return types.includes(item.type) && (item.isOfType ? item.isOfType("physical") : true)
      && !(item.type === "weapon" && item.system?.category === "unarmed")
      && Number.isSafeInteger(item.system?.quantity) && item.system.quantity > 0;
  }
  snapshot(item) {
    const data = clone(item.toObject());
    delete data._id; delete data.folder; delete data.ownership; delete data._stats; delete data.flags?.[MODULE_ID];
    // Grant links and equipment positions belong to the corpse, not its recipient.
    delete data.flags?.pf2e?.grantedBy; delete data.flags?.pf2e?.itemGrants;
    data.system.containerId = null;
    if (data.system.description) delete data.system.description.gm;
    if (data.system.equipped) data.system.equipped = { carryType: "stowed", handsHeld: 0, invested: false };
    for (const effect of data.effects ?? []) { delete effect._id; effect.origin = null; }
    return data;
  }
  entryMetadata(item, quantity = item.system?.quantity) {
    const unit = item.isCurrency ? item.unit : null;
    const value = unit ? item.assetValue : null;
    const amount = quantity === item.system?.quantity ? value?.[unit]
      : value?.constructor.fromPrice?.(item.price, quantity)?.[unit];
    return unit && Number.isSafeInteger(amount) && amount > 0
      ? { currency: { storage: "item", unit, amount } } : {};
  }
  async sourceClaim(token, entry) {
    const plan = await super.sourceClaim(token, entry);
    if (entry.currency?.storage !== "item") return plan;
    const item = token.actor.items.get(entry.source.itemId);
    const current = this.entryMetadata(item).currency;
    const portion = this.entryMetadata(item, entry.data.system.quantity).currency;
    if (portion?.unit !== entry.currency.unit || portion?.amount !== entry.currency.amount
      || (!entry.source.ruleKey && item.system.quantity !== entry.data.system.quantity)) throw new LootError("CurrencyChanged");
    return { ...plan, sfCurrency: { unit: current.unit, amount: current.amount } };
  }
  async removeSource(token, entry, claim) {
    const item = claim.source?.itemId ? token.actor.items.get(claim.source.itemId) : null;
    if (item && claim.source.sfCurrency) {
      const current = this.entryMetadata(item).currency;
      if (current?.unit !== claim.source.sfCurrency.unit || current?.amount !== claim.source.sfCurrency.amount) throw new LootError("CurrencyChanged");
    }
    return super.removeSource(token, entry, claim);
  }
  preview(entry) {
    const data = clone(entry.data);
    if (data.system.identification?.status === "identified") return data;
    const unknown = data.system.identification?.unidentified;
    return { name: unknown?.name || "Unidentified Item", img: unknown?.img || data.img, type: "equipment",
      system: { quantity: data.system.quantity, description: { value: unknown?.data?.description?.value ?? "" } } };
  }
}

class ManualLootAdapter extends EmbeddedItemAdapter {
  manual = true;
  destination(actor) { return !!actor.items && typeof actor.createEmbeddedDocuments === "function"; }
  eligible(item) { return !!item?.id && typeof item.toObject === "function"; }
  snapshot(item) { return snapshotItem(item); }
  preview(entry) {
    const { data } = entry;
    if (data.system?.identified !== false && data.system?.identification?.status !== "unidentified") return clone(data);
    const unknown = data.system?.unidentified ?? data.system?.identification?.unidentified;
    return { name: unknown?.name || "Unidentified Item", type: data.type, img: unknown?.img || data.img };
  }
  received(actor, entry, claim) {
    return super.received(actor, entry, claim) || actor.items.some(item => item.getFlag(MODULE_ID, "claim") === claim.id);
  }
  async create(actor, entry, claim, begin) {
    if (claim.itemAttempted || !begin) throw new LootError("RecoveryRequired");
    await begin();
    return super.create(actor, entry, claim);
  }

  async sourceClaim(token, entry) {
    await detachSource(token);
    const source = { itemId: entry.source?.itemId };
    this.validateSourcePlan(token, entry, { source });
    return source;
  }
  validateSourcePlan(token, entry, claim) {
    const id = claim.source?.itemId;
    const item = token.actor?.items.get(id);
    if (token.actorLink || !entry.wholeItem || id !== entry.source?.itemId
      || entry.source?.ruleKey !== `${token.actorId ?? token.actor?.id ?? ""}:${id}`
      || !this.eligible(item) || canonical(this.snapshot(item)) !== canonical(entry.data)) {
      throw new LootError("SourceChanged");
    }
  }
  async removeSource(token, entry, claim) {
    await detachSource(token);
    const id = claim.source?.itemId;
    if (!id || !entry.wholeItem || entry.source?.ruleKey !== `${token.actorId ?? token.actor?.id ?? ""}:${id}`) {
      throw new LootError("RecoveryRequired");
    }
    if (!token.actor.items.get(id)) return; // Retrying an already completed deletion.
    this.validateSourcePlan(token, entry, claim);
    await token.actor.deleteEmbeddedDocuments("Item", [id]);
    if (token.actor.items.get(id)) throw new LootError("SourceChanged");
  }
}

const adapters = new Map([["dnd5e", new Dnd5eAdapter()], ["sf2e", new Sf2eAdapter()]]);
const manualAdapter = new ManualLootAdapter();
export function registerAdapter(id, adapter) { adapters.set(id, adapter); }
export function getAdapter(id) { return adapters.get(id) ?? manualAdapter; }
