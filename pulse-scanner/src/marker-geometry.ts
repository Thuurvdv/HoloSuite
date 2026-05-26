import { getTargetScanRadius } from "./scan-geometry.js";

export type ResizeHandle =
  | "nw"
  | "n"
  | "ne"
  | "e"
  | "se"
  | "s"
  | "sw"
  | "w"
  | "radius-e"
  | "radius-s"
  | "radius-w"
  | "radius-n";

export interface MarkerTargetLike {
  x: number;
  y: number;
  radius: number;
  shape: "circle" | "rectangle";
  width: number;
  height: number;
}

export interface ResizeHandlePosition {
  handle: ResizeHandle;
  x: number;
  y: number;
}

export interface MarkerResizeUpdates {
  width?: number;
  height?: number;
  radius?: number;
}

export function getResizeHandlePositions(target: MarkerTargetLike): ResizeHandlePosition[] {
  if (target.shape === "rectangle") {
    const halfWidth = Math.max(10, Number(target.width || 160) / 2);
    const halfHeight = Math.max(10, Number(target.height || 160) / 2);
    return [
      { handle: "nw", x: -halfWidth, y: -halfHeight },
      { handle: "n", x: 0, y: -halfHeight },
      { handle: "ne", x: halfWidth, y: -halfHeight },
      { handle: "e", x: halfWidth, y: 0 },
      { handle: "se", x: halfWidth, y: halfHeight },
      { handle: "s", x: 0, y: halfHeight },
      { handle: "sw", x: -halfWidth, y: halfHeight },
      { handle: "w", x: -halfWidth, y: 0 }
    ];
  }

  const radius = Math.max(12, Number(target.radius || 80));
  return [
    { handle: "radius-e", x: radius, y: 0 },
    { handle: "radius-s", x: 0, y: radius },
    { handle: "radius-w", x: -radius, y: 0 },
    { handle: "radius-n", x: 0, y: -radius }
  ];
}

export function getResizeCursor(handle: string): string {
  if (handle.startsWith("radius")) return "move";
  if (handle === "n" || handle === "s") return "ns-resize";
  if (handle === "e" || handle === "w") return "ew-resize";
  if (handle === "nw" || handle === "se") return "nwse-resize";
  if (handle === "ne" || handle === "sw") return "nesw-resize";
  return "move";
}

export function getResizeUpdates(target: MarkerTargetLike, handle: string, point: { x: number; y: number }): MarkerResizeUpdates {
  const dx = point.x - Number(target.x);
  const dy = point.y - Number(target.y);

  if (target.shape === "rectangle") {
    const updates: MarkerResizeUpdates = {};
    if (handle.includes("e") || handle.includes("w")) updates.width = Math.max(24, Math.round(Math.abs(dx) * 2));
    if (handle.includes("n") || handle.includes("s")) updates.height = Math.max(24, Math.round(Math.abs(dy) * 2));
    return updates;
  }

  return {
    radius: Math.max(12, Math.round(Math.hypot(dx, dy)))
  };
}

export function getNearTargetThreshold(target: MarkerTargetLike): number {
  return Math.max(18, Math.min(getTargetScanRadius(target), 80));
}

export function isPointNearTarget(position: { x: number; y: number }, target: MarkerTargetLike): boolean {
  return Math.hypot(Number(target.x) - position.x, Number(target.y) - position.y) <= getNearTargetThreshold(target);
}
