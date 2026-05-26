import { normalizeNullableNumber, normalizePositiveNumber } from "./camera-model.js";
import type { Size } from "./frame-crop";
import type { Bounds } from "./region-geometry";

export interface TokenDocumentLike {
  x?: unknown;
  y?: unknown;
  width?: unknown;
  height?: unknown;
}

export interface TokenDrawRect {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

export function getTokenSceneBounds(document: TokenDocumentLike | null | undefined, gridSize = 100): Bounds | null {
  if (!document) return null;
  const x = normalizeNullableNumber(document.x);
  const y = normalizeNullableNumber(document.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

  return {
    x,
    y,
    width: normalizePositiveNumber(document.width, 1) * gridSize,
    height: normalizePositiveNumber(document.height, 1) * gridSize
  };
}

export function intersectsBounds(a: Bounds, b: Bounds): boolean {
  return a.x < b.x + b.width
    && a.x + a.width > b.x
    && a.y < b.y + b.height
    && a.y + a.height > b.y;
}

export function projectBoundsToFrame(bounds: Bounds, region: Bounds, frame: Size): TokenDrawRect {
  return {
    dx: ((bounds.x - region.x) / region.width) * frame.width,
    dy: ((bounds.y - region.y) / region.height) * frame.height,
    dw: (bounds.width / region.width) * frame.width,
    dh: (bounds.height / region.height) * frame.height
  };
}
