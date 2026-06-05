import { normalizeNullableNumber, normalizePositiveNumber } from "./camera-model.js";
import type { Size } from "./frame-crop";
import type { Bounds } from "./region-geometry";

export interface TokenDocumentLike {
  [key: string]: unknown;
  x?: unknown;
  y?: unknown;
  width?: unknown;
  height?: unknown;
  document?: TokenDocumentLike;
  _source?: TokenDocumentLike;
  toObject?: () => TokenDocumentLike;
}

export interface TokenDrawRect {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

export function getTokenSceneBounds(document: TokenDocumentLike | null | undefined, gridSize = 100): Bounds | null {
  const data = getTokenData(document);
  if (!data) return null;
  const x = normalizeNullableNumber(data.x);
  const y = normalizeNullableNumber(data.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

  return {
    x,
    y,
    width: normalizePositiveNumber(data.width, 1) * gridSize,
    height: normalizePositiveNumber(data.height, 1) * gridSize
  };
}

export function getTokenData(document: TokenDocumentLike | null | undefined): TokenDocumentLike | null {
  if (!document) return null;
  if (document.document) return getTokenData(document.document);
  if (typeof document.toObject === "function") {
    const data = document.toObject();
    if (data && typeof data === "object") return data;
  }
  if (document._source && typeof document._source === "object") return document._source;
  return document;
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
