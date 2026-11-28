import { FATE_STYLE, fateMarkup } from "./shattered-fate";
import { mangaMarkup, MANGA_STYLE } from "./manga-overdrive";
import { riftSlashMarkup } from "./rift-slash";
import { OVERRIDE_STYLE, overrideMarkup } from "./reality-override";
import { COLLAPSE_STYLE, collapseMarkup } from "./system-collapse";
import { CROSSHAIR_STYLE, crosshairMarkup } from "./crosshair-sever";

/** Shared by the editor, roll detection and renderer. Saved IDs remain stable. */
export const EFFECT_PRESETS = [
  { id: "strike", label: "Neon Strike", description: "A slash streaks across the portrait.", shake: 0.7 },
  { id: "breach", label: "Panel Breach", description: "Blast doors open to reveal the portrait.", shake: 0.5 },
  { id: "signal", label: "Signal Bloom", description: "The portrait appears as a hologram.", shake: 0.15 },
  { id: "rift", label: "Rift Slash", description: "The portrait stays inside a jagged tear.", shake: 0.4 },
  { id: "shatter", label: "Quantum Shatter", description: "Shards come together to form the portrait.", shake: 0.65 },
  { id: "reactor", label: "Reactor Surge", description: "A plasma column lights up behind the portrait.", shake: 0.85 },
  { id: "void", label: "Void Collapse", description: "An eclipse closes around the portrait.", shake: 0.4 },
  { id: "railgun", label: "Railgun Salvo", description: "Crosshairs line up before the shot.", shake: 1 },
  { id: "eclipse", label: "Astral Eclipse", description: "Stars and rings frame the portrait.", shake: 0 },
  { id: MANGA_STYLE, label: "COMIC", description: "An ink splash cuts to a full-color comic panel.", shake: 0.7 },
  { id: FATE_STYLE, label: "SHATTER", description: "The portrait breaks into pieces and reveals the title.", shake: 0.65 },
  { id: "overdrive", label: "Cyber Overdrive", description: "A data tunnel opens into a hologram.", shake: 0.45 },
  { id: OVERRIDE_STYLE, label: "Reality Override", description: "The scene freezes and flips open in strips.", shake: 0.8 },
  { id: COLLAPSE_STYLE, label: "System Collapse", description: "The portrait glitches, falls, and flickers out.", shake: 0.6 },
  { id: CROSSHAIR_STYLE, label: "SPLIT", description: "A crosshair locks on and splits the portrait in four.", shake: 0.55 }
] as const;

export type EffectId = typeof EFFECT_PRESETS[number]["id"];
export function normalizeEffectId(value: unknown): EffectId {
  return EFFECT_PRESETS.find(preset => preset.id === value)?.id ?? "strike";
}
export function getEffectPreset(value: unknown) {
  return EFFECT_PRESETS.find(preset => preset.id === normalizeEffectId(value))!;
}

const layer = (name: string, count = 1) => Array.from({ length: count }, (_, i) =>
  `<i class="hcci-fx hcci-fx-${name}" style="--i:${i};--n:${count};--v:${i % 4};--d:${i % 5};--s:${i % 3}"></i>`).join("");

/** Procedural geometry only: no asset downloads, canvas, or perpetual JS loop. */
export function effectMarkup(value: unknown, intensity = "standard") {
  const id = normalizeEffectId(value);
  const count = intensity === "low" ? 8 : intensity === "high" ? 28 : 16;
  const particles = layer("particle", count);
  const wave = layer("wave", 2);
  switch (id) {
    case "strike": return layer("slash", 2) + layer("speed", 7) + wave + particles;
    case "breach": return '<div class="hcci-tear hcci-tear-top"><span></span></div><div class="hcci-tear hcci-tear-bottom"><span></span></div>' + layer("door", 2) + particles;
    case "signal": return layer("reticle", 3) + layer("tick", 12) + layer("sweep") + wave;
    case FATE_STYLE: return fateMarkup();
    case MANGA_STYLE: return mangaMarkup(intensity);
    case "rift": return riftSlashMarkup(intensity);
    case OVERRIDE_STYLE: return overrideMarkup(intensity);
    case COLLAPSE_STYLE: return collapseMarkup(intensity);
    case CROSSHAIR_STYLE: return crosshairMarkup();
    case "shatter": return layer("shard", count) + layer("prism", 2) + wave;
    case "reactor": return layer("rail", 6) + layer("column") + layer("corona", 2) + particles;
    case "void": return layer("disk", 2) + layer("horizon") + layer("infall", count) + wave;
    case "railgun": return layer("sight", 4) + layer("lance") + layer("wake", 7) + particles;
    case "eclipse": return layer("moon") + layer("crown", 2) + layer("star", count) + layer("orbit", 3);
    case "overdrive": return layer("gate", 5) + layer("data", count) + layer("sweep") + wave;
  }
}
