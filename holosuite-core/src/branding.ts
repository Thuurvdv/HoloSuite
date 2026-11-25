import type { HoloSuiteBranding } from "../../shared/src/index";

export const BRANDING_SETTING = "branding";
export const DEVICE_BRANDING_ID = "holosuite-core";

export const BRANDING_ICONS = {
  "fa-mobile-screen-button": "Phone", "fa-terminal": "Terminal", "fa-building-columns": "Bank",
  "fa-rocket": "Rocket", "fa-shuttle-space": "Shuttle", "fa-satellite-dish": "Satellite dish",
  "fa-tower-broadcast": "Broadcast tower", "fa-database": "Database", "fa-fingerprint": "Fingerprint",
  "fa-id-card": "ID card", "fa-shield-halved": "Shield", "fa-wave-square": "Waveform",
  "fa-video": "Video camera", "fa-draw-polygon": "Blueprint", "fa-bezier-curve": "Path",
  "fa-atom": "Atom", "fa-tornado": "Vortex", "fa-crosshairs": "Crosshairs", "fa-route": "Route",
  "fa-store": "Shop", "fa-file-import": "Import", "fa-microchip": "Microchip", "fa-robot": "Robot",
  "fa-wand-magic-sparkles": "Sparkles", "fa-bolt-lightning": "Lightning", "fa-cube": "Cube",
  "fa-star": "Star", "fa-gear": "Gear", "fa-arrow-left": "Left arrow", "fa-circle-xmark": "Close circle"
};

const TEXT_FIELDS = {
  name: 100, label: 48, tagline: 160,
  gmTitle: 100, gmHeading: 60, gmScreen: 48,
  playerTitle: 100, playerHeading: 60, playerScreen: 48, userLabel: 48, linkStatus: 48
};

export function imagePath(value: unknown): string {
  if (typeof value !== "string") return "";
  const path = value.trim();
  if (!path || path.length > 2048 || /[\x00-\x1f<>"'\\]/.test(path) || path.startsWith("//")) return "";
  try {
    const url = new URL(path, "https://world.invalid/");
    if (!/^https?:$/.test(url.protocol) || url.username || url.password) return "";
    return /\.(png|webp)$/i.test(url.pathname) ? path : "";
  } catch {
    return "";
  }
}

export function normalizeBranding(value: unknown): HoloSuiteBranding {
  if (!value || typeof value !== "object") return {};
  const source = value as Record<string, unknown>;
  const result: HoloSuiteBranding = {};
  for (const [field, limit] of Object.entries(TEXT_FIELDS)) {
    const text = source[field];
    if (typeof text === "string" && text.trim()) result[field] = text.trim().slice(0, limit);
  }
  for (const key of ["icon", "backIcon", "settingsIcon", "updatesIcon", "closeIcon"] as const) {
    const icon = source[key];
    if (typeof icon === "string" && Object.hasOwn(BRANDING_ICONS, icon)) result[key] = icon;
  }
  const iconImage = imagePath(source.iconImage);
  const logo = imagePath(source.logo);
  if (iconImage) result.iconImage = iconImage;
  if (logo) result.logo = logo;
  if (source.text && typeof source.text === "object") {
    const entries = Object.entries(source.text).slice(0, 20).filter(([key, value]) =>
      /^[a-z][a-zA-Z0-9]{0,39}$/.test(key) && typeof value === "string" && value.trim());
    if (entries.length) result.text = Object.fromEntries(entries.map(([key, value]) => [key, value.trim().slice(0, 160)]));
  }
  return result;
}
