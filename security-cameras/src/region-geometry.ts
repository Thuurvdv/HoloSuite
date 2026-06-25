import {
  DEFAULT_CAMERA_REGION_HEIGHT,
  DEFAULT_CAMERA_REGION_WIDTH,
  normalizeNullableNumber,
  normalizePositiveNumber
} from "./camera-model.js";

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CameraRegionBounds {
  regionX: number;
  regionY: number;
  regionWidth: number;
  regionHeight: number;
}

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

export function getShapeBounds(shapeData: unknown = {}): Bounds | null {
  const shape = readRecord(shapeData);
  const points = Array.isArray(shape.points) ? shape.points : [];
  if (points.length >= 4) {
    const xs: number[] = [];
    const ys: number[] = [];
    for (let index = 0; index < points.length; index += 2) {
      xs.push(Number(points[index]));
      ys.push(Number(points[index + 1]));
    }

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    if ([minX, minY, maxX, maxY].every(Number.isFinite)) {
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
    }
  }

  const x = normalizeNullableNumber(shape.x) ?? 0;
  const y = normalizeNullableNumber(shape.y) ?? 0;
  const radiusX = normalizeNullableNumber(shape.radiusX ?? shape.radius);
  const radiusY = normalizeNullableNumber(shape.radiusY ?? shape.radius);
  if (radiusX && radiusY) {
    return {
      x: x - radiusX,
      y: y - radiusY,
      width: radiusX * 2,
      height: radiusY * 2
    };
  }

  const width = normalizePositiveNumber(shape.width, 0);
  const height = normalizePositiveNumber(shape.height, 0);
  if (!width || !height) return null;

  return { x, y, width, height };
}

export function combineBounds(bounds: Array<Bounds | null | undefined>): Bounds | null {
  const valid = bounds.filter((bound): bound is Bounds => Boolean(bound));
  if (!valid.length) return null;
  const minX = Math.min(...valid.map((bound) => bound.x));
  const minY = Math.min(...valid.map((bound) => bound.y));
  const maxX = Math.max(...valid.map((bound) => bound.x + bound.width));
  const maxY = Math.max(...valid.map((bound) => bound.y + bound.height));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

export function toCameraRegionBounds(bounds: unknown): CameraRegionBounds | null {
  const source = readRecord(bounds);
  const width = normalizePositiveNumber(source.width, DEFAULT_CAMERA_REGION_WIDTH);
  const height = normalizePositiveNumber(source.height, DEFAULT_CAMERA_REGION_HEIGHT);
  if (!width || !height) return null;

  return {
    regionX: normalizeNullableNumber(source.x) ?? 0,
    regionY: normalizeNullableNumber(source.y) ?? 0,
    regionWidth: width,
    regionHeight: height
  };
}

export function getShapesRegionBounds(shapes: unknown[]): CameraRegionBounds | null {
  const shapeBounds = combineBounds(shapes.map(getShapeBounds));
  return shapeBounds ? toCameraRegionBounds(shapeBounds) : null;
}
