import { actorKey, canonical, clone, itemQuantity, quantityPath, MODULE_ID, LootError, SerialQueue, keepLinkedActor } from "./model.mjs";
import { dndCurrency, dragonbaneCurrency, moshCurrency, pf1Currency, starWarsCurrency, swadeCurrency } from "./currency.mjs";

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

function validateSourceActor(token, source) {
  if (source?.actorUuid && (!token.actorLink || actorKey(token.actor) !== source.actorUuid)) throw new LootError("SourceChanged");
}

async function prepareSource(token, source) {
  if (source?.actorUuid) { validateSourceActor(token, source); return source; }
  // Existing claims without an actor binding retain the original unlink policy.
  if (!source && token.actorLink && keepLinkedActor(token)) return { actorUuid: actorKey(token.actor) };
  await detachSource(token);
  return {};
}

class EmbeddedItemAdapter {
  manual = false;
  async reserveSource(token, _entry, claim) {
    if (!claim.source?.actorUuid) return;
    validateSourceActor(token, claim.source);
    // Persist on the shared Actor so failed transfers also exclude other tokens
    // after a reload or a GM authority change, until the original claim resumes.
    const actor = token.actor;
    const reserved = actor.getFlag(MODULE_ID, "linkedLootClaim");
    if (reserved && (reserved.id !== claim.id || reserved.tokenUuid !== token.uuid)) throw new LootError("RecoveryRequired");
    if (!reserved) await actor.setFlag(MODULE_ID, "linkedLootClaim", { id: claim.id, tokenUuid: token.uuid });
    const stored = actor.getFlag(MODULE_ID, "linkedLootClaim");
    if (stored?.id !== claim.id || stored.tokenUuid !== token.uuid) throw new LootError("RecoveryRequired");
  }
  async releaseSource(token, _entry, claim) {
    if (!claim.source?.actorUuid) return;
    validateSourceActor(token, claim.source);
    const reserved = token.actor.getFlag(MODULE_ID, "linkedLootClaim");
    if (reserved?.id === claim.id && reserved.tokenUuid === token.uuid) await token.actor.unsetFlag(MODULE_ID, "linkedLootClaim");
  }
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
    const created = (await actor.createEmbeddedDocuments("Item", [data], { keepId: true }))?.[0];
    if (!this.received(actor, entry, claim)) {
      throw new LootError("TransferFailed");
    }
    return created;
  }
}

export class Dnd5eAdapter extends EmbeddedItemAdapter {
  id = "dnd5e";
  balanceCurrency = dndCurrency;
  currencyEntries(actor) { return this.balanceCurrency.entries(actor); }
  received(actor, entry, claim) {
    return entry.currency?.storage === "balance" ? this.balanceCurrency.received(actor, entry, claim)
      : super.received(actor, entry, claim);
  }
  async cleanup(token, actor, entry, claim) {
    if (entry.currency?.storage === "balance") await this.balanceCurrency.cleanup(token, actor, entry, claim);
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
    if (entry.currency?.storage === "balance") return this.balanceCurrency.grant(actor, entry, claim, beginCurrency);
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
    const binding = await prepareSource(token);
    if (entry.currency?.storage === "balance") return { ...this.balanceCurrency.sourcePlan(token, entry), ...binding };
    const item = token.actor.items.get(entry.source.itemId);
    const quantity = itemQuantity(item);
    const awarded = itemQuantity(entry.data);
    if (!this.eligible(item ?? {}) || quantity < awarded
      || (entry.source.ruleKey && item.type !== entry.data.type)) throw new LootError("SourceChanged");
    return { itemId: item.id, before: quantity, after: quantity - awarded, ...binding };
  }
  validateSourcePlan(token, entry, claim) {
    validateSourceActor(token, claim.source);
    if (!entry.source?.ruleKey) return;
    const item = token.actor?.items.get(claim.source?.itemId);
    if ((token.actorLink && !claim.source?.actorUuid) || entry.source.ruleKey !== `${token.actorId ?? token.actor?.id ?? ""}:${item?.id}`
      || !this.eligible(item ?? {}) || item.type !== entry.data.type || itemQuantity(item) !== claim.source.before) {
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
    await prepareSource(token, source);
    if (source.currency) return this.balanceCurrency.debit(token, entry, claim);
    const item = token.actor.items.get(source.itemId);
    if (!item) return; // A completed deletion is idempotent across a failed ledger write.
    if (item.getFlag(MODULE_ID, "sourceClaim") === claim.id) return;
    if (itemQuantity(item) !== source.before) throw new LootError("SourceChanged");
    if (source.after === 0) await token.actor.deleteEmbeddedDocuments("Item", [item.id]);
    else await item.update({ [quantityPath(item)]: source.after, [`flags.${MODULE_ID}.sourceClaim`]: claim.id });
    const remaining = token.actor.items.get(source.itemId);
    if (source.after === 0 ? !!remaining : !remaining || itemQuantity(remaining) !== source.after
      || remaining?.getFlag(MODULE_ID, "sourceClaim") !== claim.id) throw new LootError("SourceChanged");
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
    return super.received(actor, entry, claim) || Array.from(actor.items.values()).some(item => item.getFlag(MODULE_ID, "claim") === claim.id);
  }
  async create(actor, entry, claim, begin) {
    if (claim.itemAttempted || !begin) throw new LootError("RecoveryRequired");
    await begin();
    return super.create(actor, entry, claim);
  }

  async sourceClaim(token, entry) {
    const source = { itemId: entry.source?.itemId, ...await prepareSource(token) };
    this.validateSourcePlan(token, entry, { source });
    return source;
  }
  validateSourcePlan(token, entry, claim) {
    validateSourceActor(token, claim.source);
    const id = claim.source?.itemId;
    const item = token.actor?.items.get(id);
    if ((token.actorLink && !claim.source?.actorUuid) || !entry.wholeItem || id !== entry.source?.itemId
      || entry.source?.ruleKey !== `${token.actorId ?? token.actor?.id ?? ""}:${id}`
      || !this.eligible(item) || canonical(this.snapshot(item)) !== canonical(entry.data)) {
      throw new LootError("SourceChanged");
    }
  }
  async removeSource(token, entry, claim) {
    await prepareSource(token, claim.source);
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

const manualAdapter = new ManualLootAdapter();

class InventoryAdapter extends Dnd5eAdapter {
  acceptsLegacyWholeItems = true;
  balanceCurrency = null;
  currencyEntries(actor) { return this.balanceCurrency?.entries(actor) ?? []; }
  eligible(item) {
    const quantity = itemQuantity(item);
    return this.allowsStoredItem(item) && Number.isSafeInteger(quantity) && quantity > 0;
  }
  snapshot(item) {
    return this.carriedData(snapshotItem(item));
  }
  carriedData(data) { return data; }
  preview(entry) { return clone(entry.data); }
  received(actor, entry, claim) {
    return entry.wholeItem ? manualAdapter.received(actor, entry, claim) : super.received(actor, entry, claim);
  }
  async create(actor, entry, claim, begin) {
    if (entry.wholeItem) {
      return manualAdapter.create(actor, { ...entry, data: this.carriedData(clone(entry.data)) }, claim, begin);
    }
    return super.create(actor, entry, claim, begin);
  }
  async sourceClaim(token, entry) {
    if (this.acceptsLegacyWholeItems && entry.currency?.storage !== "balance" && !this.eligible(entry.data)) {
      throw new LootError("SourceChanged");
    }
    if (!entry.wholeItem) return super.sourceClaim(token, entry);
    if (!this.eligible(token.actor.items.get(entry.source?.itemId))) throw new LootError("SourceChanged");
    return manualAdapter.sourceClaim(token, entry);
  }
  validateSourcePlan(token, entry, claim) {
    if (!entry.wholeItem) return super.validateSourcePlan(token, entry, claim);
    if (!this.eligible(token.actor.items.get(claim.source?.itemId))) throw new LootError("SourceChanged");
    return manualAdapter.validateSourcePlan(token, entry, claim);
  }
  async removeSource(token, entry, claim) {
    return entry.wholeItem ? manualAdapter.removeSource(token, entry, claim) : super.removeSource(token, entry, claim);
  }
}

class PhysicalItemAdapter extends InventoryAdapter {
  allowsStoredItem(item) {
    const types = ["ammo", "armor", "backpack", "book", "consumable", "equipment", "shield", "treasure", "weapon"];
    return types.includes(item?.type) && (item.isOfType ? item.isOfType("physical") : true)
      && !(item.type === "weapon" && item.system?.category === "unarmed");
  }
  eligible(item) { return Number.isSafeInteger(item?.system?.quantity) && super.eligible(item); }
  carriedData(data) {
    // Grant links and equipment positions belong to the corpse.
    delete data.flags?.pf2e?.grantedBy; delete data.flags?.pf2e?.itemGrants;
    data.system.containerId = null;
    if (data.system.description) delete data.system.description.gm;
    if (data.system.equipped) data.system.equipped = { carryType: "stowed", handsHeld: 0, invested: false };
    return data;
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
    if (item && claim.source.sfCurrency && item.getFlag?.(MODULE_ID, "sourceClaim") !== claim.id) {
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

/** SF2e stores money as physical treasure, including native credstick Items. */
export class Sf2eAdapter extends PhysicalItemAdapter {
  id = "sf2e";
  acceptsLegacyWholeItems = false;
  entryMetadata(item, quantity = item.system?.quantity) {
    const unit = item.isCurrency ? item.unit : null;
    const value = unit ? item.assetValue : null;
    const amount = quantity === item.system?.quantity ? value?.[unit]
      : value?.constructor.fromPrice?.(item.price, quantity)?.[unit];
    return unit && Number.isSafeInteger(amount) && amount > 0
      ? { currency: { storage: "item", unit, amount } } : {};
  }
}

export class Pf2eAdapter extends PhysicalItemAdapter {
  id = "pf2e";
  hitPoints(actor) {
    return actor.hasCondition?.("dying", "unconscious") ? null
      : actor.hitPoints ?? actor.system?.attributes?.hp;
  }
  entryMetadata(item, quantity = item.system?.quantity) {
    const system = item.system;
    if (item.type !== "treasure" || !(item.isCoinage ?? (system?.stackGroup === "coins" || system?.category === "coin"))) return {};
    const denominations = ["cp", "sp", "gp", "pp"];
    const value = item.price?.value ?? system?.price?.value;
    const unit = item.unit ?? denominations.find(denomination => value?.[denomination] === 1);
    return denominations.includes(unit) && Number.isSafeInteger(quantity) && quantity > 0
      ? { currency: { storage: "item", unit, amount: quantity } } : {};
  }
}

export class SwadeAdapter extends InventoryAdapter {
  id = "swade";
  balanceCurrency = swadeCurrency;
  currencySnapshotVersion = 2;
  allowsStoredItem(item) {
    return ["weapon", "armor", "shield", "gear", "consumable"].includes(item?.type)
      && item.isPhysicalItem !== false && !item.grantedBy && !item.system?.isNaturalArmor;
  }
  eligible(item) { return Number.isSafeInteger(item?.system?.quantity) && super.eligible(item); }
  carriedData(data) {
    if ("equipStatus" in data.system) data.system.equipStatus = 1; // SWADE's Carried state.
    delete data.flags?.swade?.hasGranted;
    return data;
  }
}

class DragonbaneAdapter extends InventoryAdapter {
  id = "dragonbane";
  balanceCurrency = dragonbaneCurrency;
  currencySnapshotVersion = 2;
  sourceActor(actor) { return ["npc", "monster"].includes(actor.type); }
  hitPoints(actor) { return actor.system?.hitPoints; }
  allowsStoredItem(item) {
    return ["armor", "helmet", "item", "material", "weapon"].includes(item?.type)
      && !item.system?.features?.includes("unarmed");
  }
  carriedData(data) {
    for (const key of ["worn", "storage", "mainHand", "offHand"]) {
      if (key in data.system) data.system[key] = false;
    }
    return data;
  }
}

class WarhammerAdapter extends InventoryAdapter {
  id = "wfrp4e";
  coinWrites = new SerialQueue();
  coinValue(item) {
    const value = item?.system?.coinValue?.value;
    return item?.type === "money" && Number.isSafeInteger(value) && value > 0 ? value : null;
  }
  coinReceipt(actor, claim) {
    return Array.from(actor.items.values()).find(item => item.type === "money" && item.getFlag(MODULE_ID, "coinReceipts")?.[claim.id] === true);
  }
  received(actor, entry, claim) {
    return super.received(actor, entry, claim) || (entry.data?.type === "money" && !!this.coinReceipt(actor, claim));
  }
  async create(actor, entry, claim, begin) {
    const value = this.coinValue(entry.data);
    if (value === null) return super.create(actor, entry, claim, begin);
    return this.coinWrites.run(actorKey(actor), async () => {
      if (this.received(actor, entry, claim)) return;
      if (claim.itemAttempted) throw new LootError("RecoveryRequired");
      const stack = Array.from(actor.items.values()).find(item => this.coinValue(item) === value);
      if (!stack) return super.create(actor, entry, claim, begin);
      const amount = itemQuantity(entry.data);
      if (!Number.isSafeInteger(amount) || amount <= 0 || !begin) throw new LootError("TransferFailed");
      await begin();
      const total = itemQuantity(stack) + amount;
      if (!actor.items.has(stack.id) || !Number.isSafeInteger(total)) throw new LootError("TransferFailed");
      await stack.update({ [quantityPath(stack)]: total, [`flags.${MODULE_ID}.coinReceipts.${claim.id}`]: true });
      if (!this.coinReceipt(actor, claim)) throw new LootError("TransferFailed");
    });
  }
  async cleanup(token, actor, entry, claim) {
    if (entry.data?.type !== "money") return;
    await this.coinWrites.run(actorKey(actor), async () => {
      const stack = this.coinReceipt(actor, claim);
      try { await stack?.update({ [`flags.${MODULE_ID}.coinReceipts.-=${claim.id}`]: null }); }
      catch (error) { console.warn("HoloSuite Loot | Could not clean committed coin receipt", error); }
    });
  }
  sourceActor(actor) { return ["npc", "creature", "vehicle"].includes(actor.type); }
  hitPoints(actor) { return actor.system?.status?.wounds; }
  allowsStoredItem(item) {
    return ["ammunition", "armour", "cargo", "container", "money", "trapping", "weapon"].includes(item?.type);
  }
  carriedData(data) {
    if (typeof data.system.equipped?.value === "boolean") data.system.equipped.value = false;
    if (typeof data.system.location?.value === "string") data.system.location.value = "";
    return data;
  }
}

class StarWarsAdapter extends InventoryAdapter {
  id = "starwarsffg";
  balanceCurrency = starWarsCurrency;
  currencySnapshotVersion = 2;
  sourceActor(actor) { return ["minion", "rival", "nemesis", "vehicle", "homestead"].includes(actor.type); }
  defeated(actor) {
    if (actor.statuses?.has("starwarsffg-defeated")) return true;
    const stats = actor.system?.stats;
    const threshold = actor.type === "vehicle" ? stats?.hullTrauma : stats?.wounds;
    return Number.isFinite(threshold?.value) && Number.isFinite(threshold?.max)
      && threshold.max > 0 && threshold.value > threshold.max;
  }
  hitPoints() { return null; }
  received(actor, entry, claim) {
    return entry.currency?.storage === "balance" ? super.received(actor, entry, claim) : manualAdapter.received(actor, entry, claim);
  }
  async create(actor, entry, claim, begin) {
    if (entry.currency?.storage === "balance") return super.create(actor, entry, claim, begin);
    if (this.received(actor, entry, claim)) return;
    return manualAdapter.create(actor, { ...entry, data: this.carriedData(clone(entry.data)) }, claim, begin);
  }
  allowsStoredItem(item) { return ["armour", "gear", "itemattachment", "weapon"].includes(item?.type); }
  carriedData(data) {
    if (data.system.equippable) data.system.equippable.equipped = false;
    return data;
  }
}

class CallOfCthulhuAdapter extends InventoryAdapter {
  id = "CoC7";
  destination(actor) { return ["character", "npc"].includes(actor.type); }
  sourceActor(actor) { return ["npc", "creature", "container"].includes(actor.type); }
  hitPoints(actor) { return actor.system?.attribs?.hp; }
  allowsStoredItem(item) { return ["armor", "book", "item", "weapon"].includes(item?.type); }
}

class MothershipAdapter extends InventoryAdapter {
  id = "mosh";
  balanceCurrency = moshCurrency;
  currencySnapshotVersion = 2;
  sourceActor(actor) { return actor.type === "creature" || (actor.type === "character" && !actor.hasPlayerOwner); }
  hitPoints() { return null; }
  defeated(actor) {
    const { health, hits, netHP } = actor.system ?? {};
    if (globalThis.game?.settings?.get("mosh", "firstEdition") === false) {
      return health?.max > 0 && Number.isFinite(health.value) && health.value <= 0;
    }
    return (hits?.max > 0 && hits.value >= hits.max)
      || (netHP?.max > 0 && Number.isFinite(netHP.value) && netHP.value <= 0);
  }
  allowsStoredItem(item) { return ["item", "weapon", "armor"].includes(item?.type); }
  carriedData(data) {
    if ("equipped" in data.system) data.system.equipped = false;
    return data;
  }
}

class Pathfinder1Adapter extends InventoryAdapter {
  id = "pf1";
  balanceCurrency = pf1Currency;
  currencySnapshotVersion = 2;
  hitPoints() { return null; } // Zero HP is disabled. Negative HP can still be dying.
  defeated(actor) {
    const hp = actor.system?.attributes?.hp;
    const constitution = actor.system?.abilities?.con?.total;
    return hp?.max > 0 && Number.isFinite(hp.value) && constitution > 0 && hp.value <= -constitution;
  }
  allowsStoredItem(item) {
    return ["weapon", "equipment", "consumable", "loot", "implant", "container"].includes(item?.type)
      && item.isPhysical !== false && item.system?.weaponSubtype !== "unarmed" && item.system?.weaponType !== "natural";
  }
  carriedData(data) {
    if ("equipped" in data.system) data.system.equipped = false;
    if ("carried" in data.system) data.system.carried = true;
    if (data.system.links?.children) data.system.links.children = [];
    return data;
  }
  preview(entry) {
    const data = entry.data;
    if (data.system.identified !== false) return super.preview(entry);
    return { name: data.system.unidentified?.name || "Unidentified Item", img: data.img, type: "loot",
      system: { quantity: itemQuantity(data), description: { value: data.system.description?.unidentified ?? "" } } };
  }
}

const adapters = new Map([
  new Dnd5eAdapter(), new Pf2eAdapter(), new Sf2eAdapter(), new SwadeAdapter(), new DragonbaneAdapter(),
  new WarhammerAdapter(), new StarWarsAdapter(), new CallOfCthulhuAdapter(), new MothershipAdapter(), new Pathfinder1Adapter()
].map(adapter => [adapter.id, adapter]));
export function registerAdapter(id, adapter) { adapters.set(id, adapter); }
export function getAdapter(id) { return adapters.get(id) ?? manualAdapter; }
