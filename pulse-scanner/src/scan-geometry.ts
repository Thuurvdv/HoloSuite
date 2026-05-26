export interface ScanPoint {
  x: number;
  y: number;
}

export interface ScanTargetLike {
  x: number;
  y: number;
  radius: number;
  shape: "circle" | "rectangle";
  width: number;
  height: number;
  status?: string;
  type?: string;
  mode?: string;
}

export function getTargetScanRadius(target: Pick<ScanTargetLike, "shape" | "width" | "height" | "radius">): number {
  if (target.shape === "rectangle") {
    return Math.hypot(Number(target.width || 0), Number(target.height || 0)) / 2;
  }
  return Number(target.radius || 0);
}

export function circleIntersectsCircle(left: ScanPoint, leftRadius: number, right: ScanPoint, rightRadius: number): boolean {
  const distance = Math.hypot(left.x - right.x, left.y - right.y);
  return distance <= Number(leftRadius) + Number(rightRadius);
}

export function circleIntersectsRectangle(center: ScanPoint, radius: number, rectangle: ScanTargetLike): boolean {
  const halfWidth = Math.max(0, Number(rectangle.width || 0) / 2);
  const halfHeight = Math.max(0, Number(rectangle.height || 0) / 2);
  const left = Number(rectangle.x) - halfWidth;
  const right = Number(rectangle.x) + halfWidth;
  const top = Number(rectangle.y) - halfHeight;
  const bottom = Number(rectangle.y) + halfHeight;
  const closestX = Math.max(left, Math.min(center.x, right));
  const closestY = Math.max(top, Math.min(center.y, bottom));
  return Math.hypot(center.x - closestX, center.y - closestY) <= Number(radius);
}

export function pulseIntersectsTarget(origin: ScanPoint, radius: number, target: ScanTargetLike): boolean {
  if (target.shape === "rectangle") return circleIntersectsRectangle(origin, radius, target);
  return circleIntersectsCircle(origin, radius, target, Number(target.radius || 0));
}

export function targetMatchesScan(
  target: ScanTargetLike,
  origin: ScanPoint,
  radius: number,
  selectedTypes?: Set<string> | null,
  selectedModes?: Set<string> | null
): boolean {
  if (target.status === "resolved") return false;
  if (selectedTypes?.size && !selectedTypes.has(String(target.type))) return false;
  if (selectedModes?.size && !selectedModes.has(String(target.mode))) return false;
  return pulseIntersectsTarget(origin, radius, target);
}
