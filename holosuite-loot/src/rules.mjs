import { LootError } from "./model.mjs";

export const RULE_SETTING = "inventoryRules";

// Foundry records provenance on copied Items. Only shared, standalone Item
// origins qualify; an embedded Item UUID or display name is not a global key.
export function globalItemKey(item) {
  const standalone = /^(?:Item\.[\w-]+|Compendium\.[\w-]+\.[\w-]+\.(?:Item\.)?[\w-]+)$/;
  return [item._stats?.compendiumSource, item._stats?.duplicateSource, item.flags?.core?.sourceId]
    .find(value => typeof value === "string" && standalone.test(value))
    ?.replace(/^(Compendium\.[^.]+\.[^.]+)\.(?!Item\.)/, "$1.Item.");
}

export function ruleKeys(token, item, baseActor) {
  if (item.balance) {
    const key = item.id;
    return { token: key, actor: baseActor?.id ? `${baseActor.id}:${key}` : undefined };
  }
  return {
    token: item.id ? `${token.actorId ?? token.actor?.id ?? ""}:${item.id}` : undefined,
    actor: baseActor?.id && baseActor.items.get(item.id) ? `${baseActor.id}:${item.id}` : undefined,
    global: globalItemKey(item)
  };
}

export function resolveRule(keys, tokenRules, worldRules) {
  for (const scope of ["token", "actor", "global"]) {
    const rule = keys[scope] && (scope === "token" ? tokenRules : worldRules[scope])?.[keys[scope]];
    if (rule) return { rule, scope };
  }
  return { rule: { mode: "allow" }, scope: "default" };
}

export function parseRule(mode, input = "") {
  if (mode === "inherit") return null;
  if (mode === "allow" || mode === "never") return { mode };
  if (mode !== "quantity" || typeof input !== "string" || input.length > 40) throw new LootError("InvalidRule");
  const quantity = input.trim().toLowerCase().replace(/\s+/g, "");
  if (/^\d+$/.test(quantity) && Number.isSafeInteger(Number(quantity))) return { mode, quantity: String(Number(quantity)) };
  const dice = /^(\d{0,3})d([1-9]\d{0,4})(?:[+-]\d{1,6})?$/.exec(quantity);
  if (dice && (dice[1] === "" || Number(dice[1]) > 0)) return { mode, quantity: dice[1] ? quantity : `1${quantity}` };
  throw new LootError("InvalidRule");
}

export async function resolveQuantity(rule, available, roll) {
  if (rule.mode === "never") return 0;
  if (rule.mode === "allow") return available;
  const { quantity } = parseRule(rule.mode, rule.quantity);
  const total = /^\d+$/.test(quantity) ? Number(quantity) : await roll(quantity);
  if (!Number.isSafeInteger(total)) throw new LootError("InvalidRule");
  return Math.min(available, Math.max(0, total));
}

export const isDiceRule = rule => rule?.mode === "quantity" && !/^\d+$/.test(rule.quantity);

export function withRule(rules, keys, rule) {
  const next = { ...rules };
  for (const key of keys) {
    if (rule) next[key] = rule;
    else delete next[key];
  }
  return next;
}
