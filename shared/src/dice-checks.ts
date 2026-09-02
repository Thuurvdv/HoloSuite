export type RollDirection = "high" | "low";

const STANDARD_DIE_SIDES = [4, 6, 8, 10, 12, 20, 100];

export function getDieOptions(selected: unknown = 20) {
  const selectedSides = normalizeDieSides(selected);
  const sides = new Set([...STANDARD_DIE_SIDES, selectedSides]);
  // Foundry's fulfillment list can be extended by systems and modules. Only
  // numbered dice work with these modules' numeric natural-result checks.
  const registered = (globalThis as any).CONFIG?.Dice?.fulfillment?.dice ?? {};
  for (const denomination of Object.keys(registered)) {
    const match = /^d([1-9]\d*)$/i.exec(denomination);
    if (!match) continue;
    const value = Number(match[1]);
    if (value >= 2 && value <= 10000) sides.add(value);
  }
  return [...sides].sort((a, b) => a - b).map(value => ({ value, label: `d${value}`, selected: value === selectedSides }));
}

export function getCriticalRollEndpoints(dieSides: unknown, rollDirection: unknown) {
  const sides = normalizeDieSides(dieSides);
  const low = normalizeRollDirection(rollDirection) === "low";
  return { success: low ? 1 : sides, failure: low ? sides : 1 };
}

export function normalizeDieSides(value: unknown): number {
  const sides = Number(value);
  return Number.isInteger(sides) && sides >= 2 && sides <= 10000 ? sides : 20;
}

export function normalizeRollDirection(value: unknown): RollDirection {
  return value === "low" ? "low" : "high";
}

export function getNaturalDieResult(roll: any, dieSides = 20): number | null {
  const dice = roll?.dice ?? roll?.terms ?? [];
  for (const die of dice) {
    if (Number(die?.faces ?? die?._faces) !== dieSides) continue;
    const result = die.results?.find((entry: any) => entry.active !== false && !entry.discarded && !entry.rerolled);
    const value = Number(result?.result ?? result?.value);
    if (Number.isInteger(value) && value >= 1 && value <= dieSides) return value;
  }
  return null;
}
