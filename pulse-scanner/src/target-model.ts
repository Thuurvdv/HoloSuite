import {
  getTargetScanRadius,
  targetMatchesScan as targetMatchesScanGeometry
} from "./scan-geometry.js";

export const DEFAULT_MODE = "structural";
export const DEFAULT_TYPE = "breakable";

export const TARGET_TYPES = [
  "breakable",
  "hidden",
  "trap",
  "magic",
  "tech",
  "biological",
  "radiation",
  "evidence",
  "loot",
  "custom"
] as const;

export const VISIBILITY_MODES = ["gm", "revealed", "always"] as const;
export const TARGET_STATUSES = ["active", "revealed", "resolved"] as const;
export const SCANNER_MODES = ["structural", "arcane", "thermal", "forensic", "tech", "biological"] as const;

export type PulseTargetType = typeof TARGET_TYPES[number];
export type PulseVisibility = typeof VISIBILITY_MODES[number];
export type PulseTargetStatus = typeof TARGET_STATUSES[number];
export type PulseScannerMode = typeof SCANNER_MODES[number];

export interface PulseTarget {
  id: string;
  sceneId: string;
  regionId: string;
  x: number;
  y: number;
  radius: number;
  mode: PulseScannerMode;
  type: PulseTargetType;
  label: string;
  description: string;
  integrity: number;
  difficulty: number;
  visibility: PulseVisibility;
  status: PulseTargetStatus;
  color: string;
  icon: string;
}

export interface PulseTargetNormalizeOptions {
  createId?: () => string;
  sceneId?: string;
}

export interface PulseScanOrigin {
  x: number;
  y: number;
}

export const MODE_META: Record<PulseScannerMode, { label: string; color: string; icon: string; types: PulseTargetType[] }> = {
  structural: { label: "Structural", color: "#ffb347", icon: "fa-solid fa-building-shield", types: ["breakable", "hidden"] },
  arcane: { label: "Arcane", color: "#c77dff", icon: "fa-solid fa-wand-sparkles", types: ["magic", "hidden", "custom"] },
  thermal: { label: "Thermal", color: "#ff4d6d", icon: "fa-solid fa-temperature-high", types: ["trap", "biological", "radiation"] },
  forensic: { label: "Forensic", color: "#f7f7f2", icon: "fa-solid fa-fingerprint", types: ["evidence", "loot", "biological"] },
  tech: { label: "Tech", color: "#39ffb6", icon: "fa-solid fa-microchip", types: ["tech", "radiation", "hidden"] },
  biological: { label: "Biological", color: "#8fd14f", icon: "fa-solid fa-dna", types: ["biological", "evidence"] }
};

export const TYPE_META: Record<PulseTargetType, { label: string; color: string; icon: string }> = {
  breakable: { label: "Breakable Wall", color: "#ffb347", icon: "fa-solid fa-hammer" },
  hidden: { label: "Hidden Passage", color: "#45d6ff", icon: "fa-solid fa-door-open" },
  trap: { label: "Trap", color: "#ff4d6d", icon: "fa-solid fa-triangle-exclamation" },
  magic: { label: "Magic Residue", color: "#c77dff", icon: "fa-solid fa-wand-sparkles" },
  tech: { label: "Tech Signature", color: "#39ffb6", icon: "fa-solid fa-microchip" },
  biological: { label: "Biological Trace", color: "#8fd14f", icon: "fa-solid fa-dna" },
  radiation: { label: "Radiation Leak", color: "#f8f32b", icon: "fa-solid fa-radiation" },
  evidence: { label: "Evidence", color: "#f7f7f2", icon: "fa-solid fa-magnifying-glass" },
  loot: { label: "Loot Cache", color: "#ffd166", icon: "fa-solid fa-gem" },
  custom: { label: "Custom", color: "#7df9ff", icon: "fa-solid fa-location-dot" }
};

export const COLOR_OPTIONS = [
  { label: "Amber", value: "#ffb347" },
  { label: "Cyan", value: "#45d6ff" },
  { label: "Red", value: "#ff4d6d" },
  { label: "Violet", value: "#c77dff" },
  { label: "Green", value: "#39ffb6" },
  { label: "Bio Green", value: "#8fd14f" },
  { label: "Radiation Yellow", value: "#f8f32b" },
  { label: "White", value: "#f7f7f2" },
  { label: "Gold", value: "#ffd166" },
  { label: "Aqua", value: "#7df9ff" },
  { label: "Resolved Grey", value: "#7b858c" }
] as const;

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

export function toNumber(value: unknown, fallback: number): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function labelize(value: unknown): string {
  return String(value || "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function inferModeForType(type: unknown): PulseScannerMode {
  return SCANNER_MODES.find((mode) => MODE_META[mode]?.types?.includes(type as PulseTargetType)) ?? DEFAULT_MODE;
}

export function normalizeColor(value: unknown, fallback: string): string {
  const color = String(value || fallback || "").trim();
  return color.startsWith("#") ? color.toLowerCase() : color;
}

export function normalizeTarget(dataInput: unknown = {}, options: PulseTargetNormalizeOptions = {}): PulseTarget {
  const data = readRecord(dataInput);
  const type = TARGET_TYPES.includes(data.type as PulseTargetType) ? data.type as PulseTargetType : DEFAULT_TYPE;
  const meta = TYPE_META[type] ?? TYPE_META.custom;
  const mode = SCANNER_MODES.includes(data.mode as PulseScannerMode) ? data.mode as PulseScannerMode : inferModeForType(type);
  const status = TARGET_STATUSES.includes(data.status as PulseTargetStatus)
    ? data.status as PulseTargetStatus
    : data.resolved ? "resolved" : "active";

  return {
    id: String(data.id || options.createId?.() || ""),
    sceneId: String(data.sceneId || options.sceneId || ""),
    regionId: String(data.regionId || ""),
    x: toNumber(data.x, 0),
    y: toNumber(data.y, 0),
    radius: Math.max(0, toNumber(data.radius, 80)),
    mode,
    type,
    label: String(data.label || meta.label),
    description: String(data.description || ""),
    integrity: clamp(toNumber(data.integrity, 100), 0, 100),
    difficulty: toNumber(data.difficulty, 10),
    visibility: VISIBILITY_MODES.includes(data.visibility as PulseVisibility) ? data.visibility as PulseVisibility : "gm",
    status,
    color: normalizeColor(data.color, meta.color),
    icon: meta.icon
  };
}

export function normalizeTypeFilter(types: unknown): Set<PulseTargetType> | null {
  if (!Array.isArray(types) || types.length === 0) return null;
  const normalized = types
    .map((type) => String(type).trim())
    .filter((type): type is PulseTargetType => TARGET_TYPES.includes(type as PulseTargetType));
  return normalized.length ? new Set(normalized) : null;
}

export function normalizeModeFilter(modes: unknown): Set<PulseScannerMode> | null {
  const source = Array.isArray(modes) ? modes : modes ? [modes] : [];
  const normalized = source
    .map((mode) => String(mode).trim())
    .filter((mode): mode is PulseScannerMode => SCANNER_MODES.includes(mode as PulseScannerMode));
  return normalized.length ? new Set(normalized) : null;
}

export { getTargetScanRadius };

export function targetMatchesScan(
  target: PulseTarget,
  origin: PulseScanOrigin,
  radius: number,
  selectedTypes?: Set<PulseTargetType> | null,
  selectedModes?: Set<PulseScannerMode> | null
): boolean {
  return targetMatchesScanGeometry(target, origin, radius, selectedTypes, selectedModes);
}

export function targetVisibleToPlayer(target: Pick<PulseTarget, "visibility">): boolean {
  return target.visibility === "revealed" || target.visibility === "always";
}

export function sanitizeTargetForPulse(target: PulseTarget, playerView: boolean): PulseTarget {
  const hiddenFromPlayer = playerView && target.visibility === "gm";
  const safeTypeLabel = TYPE_META[target.type]?.label || labelize(target.type);
  const hiddenLabel = safeTypeLabel.toLowerCase().includes("signature") ? safeTypeLabel : `${safeTypeLabel} Signature`;
  return {
    ...target,
    label: hiddenFromPlayer ? hiddenLabel : target.label,
    description: hiddenFromPlayer ? "" : target.description,
    integrity: hiddenFromPlayer && target.type !== "breakable" ? null as unknown as number : target.integrity,
    difficulty: hiddenFromPlayer ? null as unknown as number : target.difficulty
  };
}

export function getColorOptions(selectedColor: unknown) {
  const color = normalizeColor(selectedColor, "");
  if (!color || COLOR_OPTIONS.some((option) => option.value === color)) return COLOR_OPTIONS;
  return [{ label: `Current (${color})`, value: color }, ...COLOR_OPTIONS];
}
