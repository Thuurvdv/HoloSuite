import { MODULE_ID, LootError, configFor, SerialQueue } from "./model.mjs";
import { RULE_SETTING, isDiceRule, parseRule, ruleKeys, resolveRule, resolveQuantity, withRule } from "./rules.mjs";
import { isAuthority } from "./permissions";
declare const game: any;
declare const foundry: any;

const worldRuleWrites = new SerialQueue();
const snapshotVault = (token: any) => game.journal.find((entry: any) => entry.getFlag(MODULE_ID, "tokenUuid") === token.uuid
  && entry.getFlag(MODULE_ID, "kind") === "snapshot");
const worldRules = () => game.settings.get(MODULE_ID, RULE_SETTING) ?? {};
const baseActor = (token: any) => game.actors?.get(token.actorId);
const evaluateRoll = async (formula: string) => {
  const Roll = (globalThis as any).foundry?.dice?.Roll ?? (globalThis as any).Roll;
  return new Roll(formula).evaluate({ allowInteractive: false });
};
const supportedItems = (token: any, adapter: any) => token.actor?.items?.filter((item: any) => adapter.eligible(item)) ?? [];
const legacyCustom = (token: any) => configFor(token).source === "custom";
const corpseRules = (vault: any) => JSON.parse(vault?.getFlag(MODULE_ID, "rules") ?? "{}");
const flag = (key: string) => `flags.${MODULE_ID}.${key}`;
const ledgerEntry = ({ id, hidden }: any) => ({ id, taken: false, ...(hidden ? { hidden: true } : {}) });
const limitKey = (rule: any) => rule.mode === "quantity" ? rule.quantity : rule.mode;
const mirrorState = (token: any, state: any) => token.setFlag(MODULE_ID, "state", {
  ...state, entries: state.entries.map((entry: any) => {
    if (!entry.claim?.quantityRoll) return entry;
    const { quantityRoll, ...claim } = entry.claim;
    return { ...entry, claim };
  })
});
const generatesLoot = (item: any, adapter: any, rule: any) =>
  isDiceRule(rule) && adapter.sourceClaim && adapter.removeSource && !adapter.entryMetadata?.(item)?.currency;

export async function rollLootQuantity(formula: string) {
  const rule = parseRule("quantity", formula);
  if (!isDiceRule(rule)) throw new LootError("InvalidRule");
  const roll = await evaluateRoll(rule.quantity);
  if (!Number.isSafeInteger(roll.total)) throw new LootError("InvalidRule");
  return { quantity: Math.max(0, roll.total), roll: roll.toJSON() };
}

const canonical = (value: any): string => JSON.stringify(value, (_key, part) => part && typeof part === "object" && !Array.isArray(part)
  ? Object.fromEntries(Object.entries(part).sort(([a], [b]) => a.localeCompare(b))) : part);

function exactInventoryMatch(items: any[], adapter: any, data: any) {
  const saved = canonical(data);
  const matches = items.filter(item => canonical(adapter.snapshot(item)) === saved);
  return matches.length === 1 && matches[0].id ? matches[0] : undefined;
}

type InventoryEntryOptions = { original?: number; previousRoll?: number; legacyRollCeiling?: number; onRoll?: (roll: any) => void };
type QuantityRoll = { roll: any; itemName: string; quantity: number };

async function inventoryEntry(item: any, adapter: any, key: string, rule: any,
  { original, previousRoll, legacyRollCeiling, onRoll }: InventoryEntryOptions = {}) {
  const data = adapter.snapshot(item);
  const originalQuantity = original ?? data.system.quantity;
  const available = Math.min(originalQuantity, data.system.quantity);
  const formula = previousRoll === undefined && legacyRollCeiling === undefined && generatesLoot(item, adapter, rule)
    ? rule.quantity : undefined;
  let rolledQuantity: number | undefined;
  let rollCeiling: number | undefined;
  const quantity = formula ? available : await resolveQuantity(rule, available, async formula => {
    if (previousRoll === undefined && legacyRollCeiling !== undefined) {
      rollCeiling = legacyRollCeiling;
      return rollCeiling;
    }
    if (previousRoll !== undefined) {
      rolledQuantity = previousRoll;
    } else {
      const roll = await evaluateRoll(formula);
      rolledQuantity = roll.total;
      onRoll?.(roll);
    }
    return rolledQuantity;
  });
  data.system.quantity = quantity;
  return { id: foundry.utils.randomID(), data, originalQuantity, limit: limitKey(rule), hidden: quantity === 0,
    ...(formula ? { formula } : {}),
    ...(rolledQuantity === undefined ? {} : { rolledQuantity }),
    ...(rollCeiling === undefined ? {} : { rollCeiling }),
    ...(item.id ? { source: { itemId: item.id, ruleKey: key } } : {}), ...adapter.entryMetadata?.(item, quantity) };
}

function ruleContext(token: any, adapter: any) {
  const vault = snapshotVault(token);
  const state = vault?.getFlag(MODULE_ID, "state");
  const entries = vault?.getFlag(MODULE_ID, "items");
  const byId = new Map<string, any>(Array.isArray(entries) ? entries.map(entry => [entry.id, entry]) : []);
  const byKey = new Map<string, any>();
  const legacyByKey = new Map<string, any>();
  const items = supportedItems(token, adapter);
  const canMatchLegacy = adapter.snapshot && !legacyCustom(token) && !token.getFlag(MODULE_ID, "config")?.customId;
  for (const entry of state?.entries ?? []) {
    const payload = byId.get(entry.id);
    if (payload?.source?.ruleKey) {
      byKey.set(payload.source.ruleKey, { ...payload, ...entry });
    } else if (canMatchLegacy && payload?.data && !payload.currency && !payload.source) {
      const item = exactInventoryMatch(items, adapter, payload.data);
      if (!item) continue;
      const key = ruleKeys(token, item).token;
      // Multiple saved stacks can match one live item if its duplicates were removed.
      legacyByKey.set(key, legacyByKey.has(key) ? null : { ...payload, ...entry });
    }
  }
  for (const [key, entry] of legacyByKey) if (entry && !byKey.has(key)) byKey.set(key, entry);
  return { vault, state, byId, byKey, items, corpse: corpseRules(vault), shared: worldRules(),
    locked: legacyCustom(token) || (!state && (token.getFlag(MODULE_ID, "state") || (vault && !vault.getFlag(MODULE_ID, "draft")))) };
}

export function ruleRows(token: any, adapter: any) {
  const { state, byKey, items, corpse, shared, locked } = ruleContext(token, adapter);
  const actor = baseActor(token);
  return items.map((item: any) => {
    const keys = ruleKeys(token, item, actor);
    const entry = byKey.get(keys.token);
    const tokenUnavailable = locked ? "RuleLocked" : !keys.token || (state && !entry) ? "RuleMissingSnapshot"
      : entry?.taken ? "RuleCollected" : entry?.claim ? "RuleReserved" : "";
    return {
      id: item.id, name: item.name, img: item.img, quantity: item.system.quantity, entry,
      effective: resolveRule(keys, corpse, shared),
      overrides: { token: corpse[keys.token], actor: shared.actor?.[keys.actor], global: shared.global?.[keys.global] },
      canToken: !tokenUnavailable, tokenUnavailable,
      canActor: !!keys.actor, canGlobal: !!keys.global
    };
  });
}

// Called only on the elected GM, inside the same token queue as collection.
export async function editRules(token: any, adapter: any, scope: string, ids: string[], rule: any) {
  if (!isAuthority()) throw new LootError("RuleGM");
  const { vault, state, byId, byKey, items, corpse, shared, locked } = ruleContext(token, adapter);
  const actor = baseActor(token);
  const selected = items.filter((item: any) => ids.includes(item.id))
    .map((item: any) => ({ item, key: ruleKeys(token, item, actor)[scope] }));
  if (!ids.length || selected.length !== ids.length || selected.some(({ key }: any) => !key)) throw new LootError("RuleScopeUnavailable");
  const keys = selected.map(({ key }: any) => key);
  if (scope === "actor" || scope === "global") {
    return worldRuleWrites.run(RULE_SETTING, async () => {
      if (!isAuthority()) throw new LootError("RuleGM");
      const current = worldRules();
      const next = { ...current, [scope]: withRule(current[scope], keys, scope === "global" && rule?.mode === "allow" ? null : rule) };
      await game.settings.set(MODULE_ID, RULE_SETTING, next);
    });
  }
  if (scope !== "token" || locked) throw new LootError("RuleScopeUnavailable");
  if (state && keys.some(key => {
    const entry = byKey.get(key);
    return !entry || entry.taken || entry.claim;
  })) throw new LootError("RuleScopeUnavailable");
  const rules = withRule(corpse, keys, rule);
  if (!vault) {
    if (Object.keys(rules).length) await createLootRecord(token, [], { rules: JSON.stringify(rules), draft: true });
    return;
  }
  // A JSON string replaces the whole rules map, including deleted keys, in one
  // document update alongside the ledger and its corresponding item snapshots.
  if (!state) {
    await vault.setFlag(MODULE_ID, "rules", JSON.stringify(rules));
    return;
  }
  const replacements = new Map<string, any>();
  const rolls: QuantityRoll[] = [];
  for (const { item, key } of selected) {
    const entry = byKey.get(key);
    const effective = resolveRule(ruleKeys(token, item, actor), rules, shared).rule;
    if (entry.limit !== limitKey(effective) || (!entry.formula && generatesLoot(item, adapter, effective))) {
      let roll;
      const replacement = await inventoryEntry(item, adapter, key, effective, {
        original: entry.originalQuantity ?? entry.data.system.quantity, onRoll: result => { roll = result; }
      });
      replacements.set(entry.id, replacement);
      if (roll) rolls.push({ roll, itemName: item.name, quantity: replacement.data.system.quantity });
    }
  }
  if (!isAuthority()) throw new LootError("RuleGM");
  const next = { ...state, vaultId: vault.id,
    entries: state.entries.map((entry: any) => replacements.has(entry.id) ? ledgerEntry(replacements.get(entry.id)) : entry) };
  await vault.update({ [flag("rules")]: JSON.stringify(rules), [flag("state")]: next,
    [flag("items")]: Array.from(byId.values(), entry => replacements.get(entry.id) ?? entry) });
  await mirrorState(token, next);
  return rolls;
}

/** Standard Foundry flags; the GM-owned record protects the authoritative
 * ledger from edits to the token mirror by an NPC's owners. */
export async function createLootRecord(token: any, items: any[], extra: any) {
  const JournalClass = (globalThis as any).foundry?.documents?.JournalEntry ?? (globalThis as any).JournalEntry;
  const vault = await JournalClass.create({
    name: `HoloLoot · ${token.name}`, ownership: { default: 0 },
    flags: { [MODULE_ID]: { tokenUuid: token.uuid, kind: "snapshot", items: structuredClone(items), ...extra } }
  });
  if (!vault) throw new LootError("PersistenceFailed");
  return vault.id;
}
function readLootRecord(id: string, token: any, kind: string) {
  const vault = game.journal.get(id);
  if (!vault || vault.getFlag(MODULE_ID, "tokenUuid") !== token.uuid
    || vault.getFlag(MODULE_ID, "kind") !== kind) throw new LootError("RecoveryRequired");
  const items = vault.getFlag(MODULE_ID, "items");
  if (!Array.isArray(items)) throw new LootError("RecoveryRequired");
  return structuredClone(items);
}

export function canRefreshInventory(token: any, adapter: any) {
  const config = configFor(token);
  return !!(token.actor && config.source !== "custom" && !config.customId && adapter.sourceClaim && adapter.removeSource);
}

/** Called inside the pickup queue. Preserve the authoritative claim ledger and
 * keep reserved sources out of the new inventory until recovery finishes. */
export async function refreshInventory(token: any, adapter: any) {
  if (!isAuthority()) throw new LootError("RuleGM");
  if (!canRefreshInventory(token, adapter)) throw new LootError("RefreshUnsupported");
  const vault = snapshotVault(token);
  const state = vault?.getFlag(MODULE_ID, "state");
  if (!state) {
    await loadState(token, adapter);
    return;
  }
  if (state.version !== 1) throw new LootError("RecoveryRequired");

  const retained = state.entries.filter((entry: any) => entry.claim || entry.taken);
  const sourceKey = (entry: any) => entry.claim?.source?.itemId
    || (entry.claim?.source?.currency && `currency:${entry.claim.source.currency}`);
  if ((retained.length && token.actorLink) || retained.some((entry: any) => !sourceKey(entry))) {
    throw new LootError("RefreshUntracked");
  }
  const reserved = new Set(retained.filter((entry: any) => !entry.taken).map(sourceKey));
  const payload = readLootRecord(vault.id, token, "snapshot");
  const byId = new Map<string, any>(payload.map((entry: any) => [entry.id, entry]));
  if (retained.some((entry: any) => !entry.taken && !byId.has(entry.id))) throw new LootError("RecoveryRequired");

  const previous = new Map<string, any>();
  for (const entry of state.entries) {
    const saved = byId.get(entry.id);
    const key = saved?.source?.ruleKey || (saved?.currency?.storage === "balance" && `currency:${saved.currency.unit}`);
    if (key) previous.set(key, { saved, taken: entry.taken });
  }
  const reuseId = (entry: any, prior: any) => {
    if (prior && !prior.taken && canonical({ ...entry, id: prior.saved.id }) === canonical(prior.saved)) {
      entry.id = prior.saved.id;
    }
    return entry;
  };
  const actor = baseActor(token);
  const corpse = corpseRules(vault);
  const shared = worldRules();
  const entries = [];
  for (const item of supportedItems(token, adapter)) {
    if (reserved.has(item.id)) continue;
    const keys = ruleKeys(token, item, actor);
    const prior = previous.get(keys.token);
    const limit = prior?.saved.limit;
    const rule = limit === undefined ? resolveRule(keys, corpse, shared).rule
      : parseRule(limit === "allow" || limit === "never" ? limit : "quantity", limit);
    // Old records only stored the clamped result. Keep it as the roll ceiling.
    const previousRoll = prior?.saved.rolledQuantity;
    const legacyRollCeiling = limit === undefined || prior.saved.formula ? undefined : prior.saved.rollCeiling ?? prior.saved.data.system.quantity;
    entries.push(reuseId(await inventoryEntry(item, adapter, keys.token, rule, { previousRoll, legacyRollCeiling }), prior));
  }
  for (const balance of adapter.currencyEntries?.(token.actor) ?? []) {
    const key = `currency:${balance.currency.unit}`;
    if (!reserved.has(key)) entries.push(reuseId({ ...balance, id: foundry.utils.randomID() }, previous.get(key)));
  }
  if (!isAuthority()) throw new LootError("RuleGM");
  const next = { ...state, vaultId: vault.id, currencyReady: true, entries: [...retained, ...entries.map(ledgerEntry)] };
  const history = retained.flatMap((entry: any) => byId.has(entry.id) ? [byId.get(entry.id)] : []);
  await vault.update({ [flag("state")]: next, [flag("items")]: [...history, ...entries] });
  await mirrorState(token, next);
}
export async function loadState(token: any, adapter: any) {
  const vault = snapshotVault(token);
  // NPC owners may be able to edit Token flags. The GM-owned backing ledger is
  // authoritative; changing or deleting the token mirror must never refill loot.
  let stored = vault?.getFlag(MODULE_ID, "state");
  if (!stored && (token.getFlag(MODULE_ID, "state") || (vault && !vault.getFlag(MODULE_ID, "draft")))) {
    throw new LootError("RecoveryRequired");
  }
  if (!stored) {
    const config = configFor(token);
    const shared = worldRules();
    const corpse = corpseRules(vault);
    const actor = baseActor(token);
    const entries = [];
    if (legacyCustom(token)) {
      const items = config.customId ? readLootRecord(config.customId, token, "custom") : [];
      entries.push(...items.map((data: any) => ({ id: foundry.utils.randomID(), data })));
    } else {
      for (const item of supportedItems(token, adapter)) {
        const keys = ruleKeys(token, item, actor);
        const { rule } = resolveRule(keys, corpse, shared);
        entries.push(await inventoryEntry(item, adapter, keys.token, rule));
      }
    }
    entries.push(...(adapter.currencyEntries?.(token.actor) ?? []).map((entry: any) => ({ ...entry, id: foundry.utils.randomID() })));
    const state = { version: 1, currencyReady: true, entries: entries.map(ledgerEntry) };
    const vaultId = vault ? vault.id : await createLootRecord(token, entries, { state });
    stored = { ...state, vaultId };
    if (vault) await vault.update({ [flag("items")]: entries, [flag("state")]: stored, [flag("draft")]: false });
    await mirrorState(token, stored);
  }
  if (stored.version !== 1) throw new LootError("RecoveryRequired");
  stored = { ...stored, vaultId: stored.vaultId ?? vault?.id };
  if (!stored.currencyReady && adapter.currencyEntries) {
    // Existing corpses gain one currency snapshot; collected Item entries stay collected.
    const original = vault ?? game.journal.get(stored.vaultId);
    const native = original.getFlag(MODULE_ID, "items");
    const payload = Array.isArray(native) ? structuredClone(native)
      : stored.entries.every((entry: any) => entry.taken) ? [] : readLootRecord(stored.vaultId, token, "snapshot");
    const added = adapter.currencyEntries(token.actor).map((entry: any) => ({ ...entry, id: foundry.utils.randomID() }));
    stored = { ...stored, currencyReady: true, entries: [...stored.entries, ...added.map(({ id }: any) => ({ id, taken: false }))] };
    // Payload and ledger migrate together on their authoritative Journal document.
    if (added.length) await original.update({ [`flags.${MODULE_ID}.items`]: [...payload, ...added], [`flags.${MODULE_ID}.state`]: stored });
    else await original.setFlag(MODULE_ID, "state", stored);
    await mirrorState(token, stored);
  }
  if (!token.getFlag(MODULE_ID, "state")) await mirrorState(token, stored);
  // Depleted records can report their ledger without loading the item payload.
  if (stored.entries.every((entry: any) => entry.taken)) return {
    ...stored, entries: stored.entries.map((entry: any) => ({ ...entry, data: null }))
  };
  const payload = readLootRecord(stored.vaultId, token, "snapshot");
  return { ...stored, entries: stored.entries.map((entry: any) => {
    if (entry.taken) return { ...entry, data: null };
    const saved = payload.find((item: any) => item.id === entry.id);
    const data = saved?.data;
    if (!data) throw new LootError("RecoveryRequired");
    let source = saved.source;
    // Upgrade old inventory snapshots only when one exact source can be identified.
    if (!source && !saved.currency && !token.getFlag(MODULE_ID, "config")?.customId && adapter.snapshot) {
      const item = exactInventoryMatch(supportedItems(token, adapter), adapter, data);
      if (item) source = { itemId: item.id };
    }
    return { ...entry, data, ...(saved.formula ? { formula: saved.formula } : {}),
      ...(saved.currency ? { currency: saved.currency } : {}), ...(source ? { source } : {}) };
  }) };
}
export async function saveState(token: any, state: any) {
  const stored = {
    version: 1, ...(state.currencyReady ? { currencyReady: true } : {}), vaultId: state.vaultId,
    entries: state.entries.map(({ id, taken, claim, hidden }: any) => ({
      id, taken: !!taken, ...(claim ? { claim } : {}), ...(hidden ? { hidden } : {})
    }))
  };
  const vault = game.journal.get(state.vaultId);
  if (vault?.getFlag(MODULE_ID, "tokenUuid") !== token.uuid) throw new LootError("RecoveryRequired");
  await vault.setFlag(MODULE_ID, "state", stored);
  await mirrorState(token, stored);
}
export function summary(token: any, state: any) {
  return {
    tokenUuid: token.uuid, name: token.name, img: token.texture.src,
    entries: state.entries.filter((entry: any) => !entry.taken && !entry.hidden).map((entry: any) => {
      const data = entry.data;
      const unidentified = data.system.identified === false || data.system.identification?.status === "unidentified";
      const description = unidentified ? data.system.unidentified?.description : data.system.description?.value;
      return {
        id: entry.id, name: entry.currency ? game.i18n.localize(`HL.Currency.${entry.currency.unit}`)
          : unidentified ? (data.system.unidentified?.name || data.system.identification?.unidentified?.name || game.i18n.localize("HL.Unidentified")) : data.name,
        currency: !!entry.currency,
        img: unidentified ? data.system.identification?.unidentified?.img || data.img : data.img,
        quantity: entry.currency?.amount ?? data.system.quantity,
        ...(entry.formula ? { formula: entry.formula } : {}),
        type: entry.currency ? game.i18n.localize("HL.CurrencyLabel") : game.i18n.localize(`TYPES.Item.${data.type}`),
        rarity: unidentified ? "" : game.i18n.localize((globalThis as any).CONFIG?.DND5E?.itemRarity?.[data.system.rarity]
          ?? (globalThis as any).CONFIG?.PF2E?.rarityTraits?.[data.system.traits?.rarity] ?? data.system.rarity ?? ""),
        tooltip: new DOMParser().parseFromString(description ?? "", "text/html").body.textContent?.slice(0, 1500) ?? "",
        pending: !!entry.claim
      };
    })
  };
}
