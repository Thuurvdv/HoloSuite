export interface ScanPoint {
  x: number;
  y: number;
}

export interface ScanTargetLike {
  x: number;
  y: number;
  radius: number;
  status?: string;
  type?: string;
  mode?: string;
}

export function getTargetScanRadius(target: Pick<ScanTargetLike, "radius">): number {
  return Number(target.radius || 0);
}

export function circleIntersectsCircle(left: ScanPoint, leftRadius: number, right: ScanPoint, rightRadius: number): boolean {
  const distance = Math.hypot(left.x - right.x, left.y - right.y);
  return distance <= Number(leftRadius) + Number(rightRadius);
}

export function pulseIntersectsTarget(origin: ScanPoint, radius: number, target: ScanTargetLike): boolean {
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
