export type SecurityCameraStatus = "online" | "offline" | "corrupted" | "restricted";
export type SecurityCameraFeedSource = "live" | "image";
export type SecurityCameraDisplayMode = "window" | "picture-in-picture";

export interface SecurityCamera {
  id: string;
  name: string;
  sceneId: string;
  location: string;
  image: string;
  feedSource: SecurityCameraFeedSource;
  status: SecurityCameraStatus;
  displayMode: SecurityCameraDisplayMode;
  regionId: string;
  regionX: number | null;
  regionY: number | null;
  regionWidth: number;
  regionHeight: number;
  notes: string;
}

export interface SecurityCameraNormalizeOptions {
  preserveId?: boolean;
  createId?: () => string;
}

export interface SecurityCameraValidationOptions {
  requireId?: boolean;
  createId?: () => string;
}

export interface SecurityCameraValidationResult {
  ok: boolean;
  camera: SecurityCamera;
  errors: string[];
}

export const CAMERA_STATUSES = new Set<SecurityCameraStatus>(["online", "offline", "corrupted", "restricted"]);
export const FEED_SOURCES = new Set<SecurityCameraFeedSource>(["live", "image"]);
export const DISPLAY_MODES = new Set<SecurityCameraDisplayMode>(["window", "picture-in-picture"]);

export const DEFAULT_CAMERA_REGION_WIDTH = 1200;
export const DEFAULT_CAMERA_REGION_HEIGHT = 675;

export const STATUS_CHOICES = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "corrupted", label: "Corrupted" },
  { value: "restricted", label: "Restricted" }
] as const;

export const DISPLAY_MODE_CHOICES = [
  { value: "window", label: "Window" },
  { value: "picture-in-picture", label: "Picture-in-Picture" }
] as const;

export const FEED_SOURCE_CHOICES = [
  { value: "live", label: "Live Canvas" },
  { value: "image", label: "Static Image" }
] as const;

export const DEFAULT_CAMERA: SecurityCamera = {
  id: "",
  name: "Unnamed Camera",
  sceneId: "",
  location: "Unknown Location",
  image: "",
  feedSource: "image",
  status: "online",
  displayMode: "window",
  regionId: "",
  regionX: null,
  regionY: null,
  regionWidth: DEFAULT_CAMERA_REGION_WIDTH,
  regionHeight: DEFAULT_CAMERA_REGION_HEIGHT,
  notes: ""
};

export function normalizeChoice<T extends string>(value: unknown, allowed: Set<T>, fallback: T): T {
  const normalized = String(value ?? "").trim();
  return allowed.has(normalized as T) ? normalized as T : fallback;
}

export function normalizeNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function normalizePositiveNumber(value: unknown, fallback: number): number {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

export function normalizeCamera(cameraData: unknown = {}, options: SecurityCameraNormalizeOptions = {}): SecurityCamera {
  const data = readRecord(cameraData);
  const preserveId = options.preserveId === true;
  const rawId = String(data.id ?? "").trim();
  const id = preserveId ? rawId : rawId || options.createId?.() || "";
  const feedSource = normalizeChoice(data.feedSource, FEED_SOURCES, DEFAULT_CAMERA.feedSource);
  const status = normalizeChoice(data.status, CAMERA_STATUSES, DEFAULT_CAMERA.status);
  const displayMode = normalizeChoice(data.displayMode, DISPLAY_MODES, DEFAULT_CAMERA.displayMode);

  return {
    ...DEFAULT_CAMERA,
    id,
    name: String(data.name ?? DEFAULT_CAMERA.name).trim() || DEFAULT_CAMERA.name,
    sceneId: String(data.sceneId ?? "").trim(),
    location: String(data.location ?? DEFAULT_CAMERA.location).trim() || DEFAULT_CAMERA.location,
    image: String(data.image ?? "").trim(),
    feedSource,
    status,
    displayMode,
    regionId: String(data.regionId ?? "").trim(),
    regionX: normalizeNullableNumber(data.regionX),
    regionY: normalizeNullableNumber(data.regionY),
    regionWidth: normalizePositiveNumber(data.regionWidth, DEFAULT_CAMERA_REGION_WIDTH),
    regionHeight: normalizePositiveNumber(data.regionHeight, DEFAULT_CAMERA_REGION_HEIGHT),
    notes: String(data.notes ?? "").trim()
  };
}

export function validateCameraData(cameraData: unknown = {}, options: SecurityCameraValidationOptions = {}): SecurityCameraValidationResult {
  const data = readRecord(cameraData);
  const camera = normalizeCamera(data, {
    preserveId: options.requireId === true,
    createId: options.createId
  });
  const errors: string[] = [];
  const rawFeedSource = String(data.feedSource ?? DEFAULT_CAMERA.feedSource).trim();
  const rawStatus = String(data.status ?? DEFAULT_CAMERA.status).trim();
  const rawDisplayMode = String(data.displayMode ?? DEFAULT_CAMERA.displayMode).trim();

  if (options.requireId && !camera.id) errors.push("Camera id is required.");
  if (typeof data.name === "string" && !data.name.trim()) errors.push("Camera name is required.");
  if (!FEED_SOURCES.has(rawFeedSource as SecurityCameraFeedSource)) errors.push(`Invalid feed source: ${rawFeedSource}`);
  if (!CAMERA_STATUSES.has(rawStatus as SecurityCameraStatus)) errors.push(`Invalid status: ${rawStatus}`);
  if (!DISPLAY_MODES.has(rawDisplayMode as SecurityCameraDisplayMode)) errors.push(`Invalid display mode: ${rawDisplayMode}`);

  return {
    ok: errors.length === 0,
    camera: normalizeCamera(camera, { createId: options.createId }),
    errors
  };
}
