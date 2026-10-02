export const PLANET_PRESETS = [
  { value: "ice", label: "Ice Planet", color: "#bfeaff", texture: "Ice-planet.webp" },
  { value: "alien", label: "Alien Planet", color: "#9de56f", texture: "Alien-planet.webp" },
  { value: "earth", label: "Earth Planet", color: "#78caff", texture: "Earth-planet.webp" },
  { value: "lush", label: "Lush Planet", color: "#7dffbd", texture: "Lush-planet.webp" },
  { value: "desert", label: "Desert Planet", color: "#d9a45c", texture: "Desert-planet.webp" },
  { value: "gas-giant", label: "Gas Giant", color: "#e7bd82", texture: "GasGiant.webp" },
  { value: "volcanic", label: "Volcanic Planet", color: "#ff7043", texture: "Volcanic-planet.webp" },
  { value: "moon", label: "Moon", color: "#c7d0d8", texture: "Moon.webp" },
  { value: "sun", label: "Sun", color: "#ffd36a", texture: "sun-planet.webp" },
  { value: "techno", label: "Techno Planet", color: "#65e7ff", texture: "Techno-planet.webp" },
  { value: "prison", label: "Prison", color: "#9fc7d6", texture: "Prison.webp" },
  { value: "black-hole", label: "Black Hole", color: "#9d7cff", texture: "BlackHole.webp" },
  { value: "anomaly", label: "Anomaly", color: "#e88cff", texture: "Anomaly.webp" },
  { value: "asteroid", label: "Asteroid", color: "#a7a39c", texture: "Asteroid.webp" },
  { value: "donut-planet", label: "Donut Planet", color: "#f0a6d2", texture: "Donut-planet.webp" },
  { value: "cube", label: "Cube", color: "#76d7ff", texture: "Cube-planet.webp" }
];
export const PLANET_OPTIONS = [
  ...PLANET_PRESETS,
  { value: "color", label: "Flat color" },
  { value: "custom", label: "Custom texture" },
  { value: "none", label: "No detail view" }
];
export const PLANET_SHAPE_OPTIONS = [
  { value: "sphere", label: "Sphere" },
  { value: "cube", label: "Cube" },
  { value: "donut", label: "Donut" },
  { value: "asteroid", label: "Asteroid" },
  { value: "crystal", label: "Crystal" },
  { value: "cylinder", label: "Cylinder" }
];
export const PLANET_FINISH_OPTIONS = [
  { value: "smooth", label: "Smooth" },
  { value: "matte", label: "Matte" },
  { value: "holographic", label: "Holographic" }
];
export function normalizePlanetShape(value: unknown) {
  return PLANET_SHAPE_OPTIONS.some(shape => shape.value === value) ? String(value) : "sphere";
}
export function normalizePlanetFinish(value: unknown) {
  return PLANET_FINISH_OPTIONS.some(finish => finish.value === value) ? String(value) : "smooth";
}
export function normalizePlanetPreset(value: unknown) {
  if (value === "auto") return "ice";
  return PLANET_OPTIONS.some(p => p.value === value) ? String(value) : "ice";
}
const UNIVERSAL_PLANET_OPTIONS = new Set(["color", "custom", "none"]);
const SHAPE_PLANET_PRESETS: Record<string, string[]> = {
  sphere: PLANET_PRESETS.map(preset => preset.value).filter(value => !["prison", "anomaly", "cube", "donut-planet"].includes(value)),
  cube: ["cube"],
  donut: ["donut-planet"],
  asteroid: ["asteroid"],
  crystal: ["anomaly"],
  cylinder: ["prison"]
};
export function getPlanetOptionsForShape(value: unknown) {
  const allowed = new Set(SHAPE_PLANET_PRESETS[normalizePlanetShape(value)] ?? SHAPE_PLANET_PRESETS.sphere);
  return PLANET_OPTIONS.filter(option => allowed.has(option.value) || UNIVERSAL_PLANET_OPTIONS.has(option.value));
}
export function normalizePlanetPresetForShape(preset: unknown, shape: unknown) {
  const normalized = normalizePlanetPreset(preset);
  const options = getPlanetOptionsForShape(shape);
  if (options.some(option => option.value === normalized)) return normalized;
  return options.find(option => !UNIVERSAL_PLANET_OPTIONS.has(option.value))?.value ?? "color";
}
export function isDefaultStaticPlanetAppearance(preset: unknown) {
  return preset === "black-hole";
}
export function getPlanetAppearance(system: any, preview = "") {
  if (!system || system.obscured || system.planetPreset === "none") return null;
  const preset = normalizePlanetPreset(system.planetPreset);
  const selected = PLANET_PRESETS.find(p => p.value === preview)
    ?? PLANET_PRESETS.find(p => p.value === preset) ?? PLANET_PRESETS[0];
  const usesCustomTexture = !preview && preset === "custom" && Boolean(system.planetTexture);
  const usesFlatColor = !preview && preset === "color";
  return {
    texture: usesFlatColor ? null : usesCustomTexture ? system.planetTexture : `modules/galaxy-map/assets/planets/${selected.texture}`,
    label: usesFlatColor ? "Flat color" : usesCustomTexture ? "Custom texture" : selected.label,
    preset: usesFlatColor ? "color" : usesCustomTexture ? "custom" : selected.value,
    color: usesFlatColor ? system.planetColor || "#58d8ff" : selected.color,
    shape: normalizePlanetShape(system.planetShape),
    finish: normalizePlanetFinish(system.planetFinish)
  };
}
