export const PLANET_PRESETS = [
  { value: "cartoon", label: "Cartoon · Acid Seas", color: "#af91ff" },
  { value: "adventure", label: "Painterly · Golden Frontier", color: "#69e7dc" },
  { value: "realistic", label: "Realistic · Blue Marble", color: "#78caff" }
];
export const PLANET_OPTIONS = [
  { value: "auto", label: "Automatic (cartoon for planet icons)" },
  ...PLANET_PRESETS,
  { value: "custom", label: "Custom texture" },
  { value: "none", label: "No planet view" }
];
export const PLANET_SHAPE_OPTIONS = [
  { value: "sphere", label: "Sphere" },
  { value: "cube", label: "Cube" },
  { value: "donut", label: "Donut" },
  { value: "asteroid", label: "Asteroid" },
  { value: "crystal", label: "Crystal" },
  { value: "cylinder", label: "Cylinder" }
];
export function normalizePlanetShape(value: unknown) {
  return PLANET_SHAPE_OPTIONS.some(shape => shape.value === value) ? String(value) : "sphere";
}
export function normalizePlanetPreset(value: unknown) {
  return PLANET_OPTIONS.some(p => p.value === value) ? String(value) : "auto";
}
export function getPlanetAppearance(system: any, preview = "") {
  if (!system || system.obscured || system.planetPreset === "none") return null;
  const preset = normalizePlanetPreset(system.planetPreset);
  const isPlanet = ["planet", "terrestrial", "gas-giant", "ice-world", "volcanic", "artificial", "ringed"].includes(system.iconStyle ?? "planet")
    && system.type !== "station" && system.type !== "anomaly";
  if (preset === "auto" && !isPlanet && !system.planetTexture) return null;
  const selected = PLANET_PRESETS.find(p => p.value === preview)
    ?? PLANET_PRESETS.find(p => p.value === preset) ?? PLANET_PRESETS[0];
  const usesCustomTexture = !preview && preset === "custom" && Boolean(system.planetTexture);
  return {
    texture: usesCustomTexture ? system.planetTexture : `modules/galaxy-map/assets/planets/${selected.value}.png`,
    label: usesCustomTexture ? "Custom texture" : selected.label,
    color: selected.color,
    shape: normalizePlanetShape(system.planetShape)
  };
}
