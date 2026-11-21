import { MODULE_ID, LootError, SerialQueue, actorKey } from "./model.mjs";

const queue = new SerialQueue();
const receipt = entry => `${entry.currency.unit}:${entry.currency.amount}`;
const received = (actor, entry, claim, source = false) =>
  actor.getFlag?.(MODULE_ID, source ? "currencyDebits" : "currencyReceipts")?.[claim.id] === receipt(entry);

/** Coin balances and their receipts are written together on the same Actor.
 * The Actor queue also prevents two different corpses overwriting one balance. */
function balanceCurrency({ units, amountOf, path, valid, name, encode = value => value }) {
  return {
    entries(actor) {
      return units.filter(unit => valid(amountOf(actor, unit)) && amountOf(actor, unit) > 0).map(unit => {
        const amount = amountOf(actor, unit);
        return { currency: { storage: "balance", unit, amount }, data: {
          name: name(unit),
          type: "currency", img: "icons/svg/coins.svg", system: { quantity: amount }
        } };
      });
    },
    received,
    async grant(actor, entry, claim, begin) {
      return queue.run(actorKey(actor), async () => {
        if (received(actor, entry, claim)) return;
        // A balance has no fixed Item ID. If an earlier attempted write has no
        // receipt, stop for reconciliation rather than guessing and paying twice.
        if (claim.currencyAttempted) throw new LootError("RecoveryRequired");
        if (!begin) throw new LootError("RecoveryRequired");
        await begin();
        const { unit, amount } = entry.currency;
        const before = amountOf(actor, unit);
        if (!units.includes(unit) || !valid(amount) || !amount || !valid(before) || !valid(before + amount)) throw new LootError("CurrencyChanged");
        await actor.update({ [path(unit)]: encode(before + amount),
          [`flags.${MODULE_ID}.currencyReceipts.${claim.id}`]: receipt(entry) });
        if (!received(actor, entry, claim)) throw new LootError("TransferFailed");
      });
    },
    sourcePlan(token, entry) {
      const { unit, amount } = entry.currency;
      const before = amountOf(token.actor, unit);
      if (!units.includes(unit) || !valid(before) || !valid(amount) || amount <= 0 || before < amount) throw new LootError("CurrencyChanged");
      return { currency: unit, before, after: before - amount };
    },
    async debit(token, entry, claim) {
      return queue.run(actorKey(token.actor), async () => {
        const actor = token.actor;
        if (received(actor, entry, claim, true)) return;
        const plan = claim.source;
        if (amountOf(actor, plan.currency) !== plan.before) throw new LootError("CurrencyChanged");
        await actor.update({ [path(plan.currency)]: encode(plan.after),
          [`flags.${MODULE_ID}.currencyDebits.${claim.id}`]: receipt(entry) });
        if (!received(actor, entry, claim, true)) throw new LootError("CurrencyChanged");
      });
    },
    async cleanup(token, actor, entry, claim) {
      for (const [document, key] of [[actor, "currencyReceipts"], [token.actor, "currencyDebits"]]) {
        try {
          await queue.run(actorKey(document), () => document.update({ [`flags.${MODULE_ID}.${key}.-=${claim.id}`]: null }));
        } catch (error) { console.warn("HoloSuite Loot | Could not clean committed currency receipt", error); }
      }
    }
  };
}

export const dndCurrency = balanceCurrency({
  units: ["cp", "sp", "ep", "gp", "pp"],
  amountOf: (actor, unit) => actor?.system?.currency?.[unit],
  path: unit => `system.currency.${unit}`,
  valid: value => Number.isSafeInteger(value) && value >= 0,
  name: unit => {
    const config = globalThis.CONFIG?.DND5E?.currencies?.[unit];
    const label = typeof config === "string" ? config : config?.label;
    return label ? (globalThis.game?.i18n?.localize(label) ?? label) : unit.toUpperCase();
  }
});

export const swadeCurrency = balanceCurrency({
  units: ["swade"],
  amountOf: actor => actor?.system?.details?.currency,
  path: () => "system.details.currency",
  valid: value => Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER,
  name: () => globalThis.game?.settings?.get("swade", "currencyName")?.trim() || "Currency"
});

export const starWarsCurrency = balanceCurrency({
  units: ["credits"],
  amountOf: actor => actor?.system?.stats?.credits?.value,
  path: () => "system.stats.credits.value",
  valid: value => Number.isSafeInteger(value) && value >= 0,
  name: () => "Credits"
});

export const moshCurrency = balanceCurrency({
  units: ["credits"],
  amountOf: actor => {
    const value = actor?.system?.credits?.value;
    if (actor?.type !== "character" || (typeof value !== "number" && typeof value !== "string")) return undefined;
    if (typeof value === "number") return value;
    const text = value.trim();
    if (!text) return 0;
    if (/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(text)) return Number(text.replaceAll(",", ""));
  },
  path: () => "system.credits.value",
  valid: value => Number.isSafeInteger(value) && value >= 0,
  name: () => "Credits",
  encode: String
});

export const pf1Currency = balanceCurrency({
  units: ["cp", "sp", "gp", "pp"],
  amountOf: (actor, unit) => actor?.system?.currency?.[unit],
  path: unit => `system.currency.${unit}`,
  valid: value => Number.isSafeInteger(value) && value >= 0,
  name: unit => unit.toUpperCase()
});

const dragonbaneCoinLabels = { gc: "gold", sc: "silver", cc: "copper" };
export const dragonbaneCurrency = balanceCurrency({
  units: Object.keys(dragonbaneCoinLabels),
  amountOf: (actor, unit) => actor?.system?.currency?.[unit],
  path: unit => `system.currency.${unit}`,
  valid: value => Number.isSafeInteger(value) && value >= 0,
  name: unit => {
    const name = dragonbaneCoinLabels[unit];
    const key = `DoD.currency.${name}`;
    const label = globalThis.game?.i18n?.localize(key);
    return label && label !== key ? label : name[0].toUpperCase() + name.slice(1);
  }
});
